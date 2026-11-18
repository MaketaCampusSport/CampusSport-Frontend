import type {
  BAuditEntry,
  BBlock,
  BDay,
  BResource,
  BSettings,
  BSport,
  BUser,
  BWeeklyHours,
} from './backend-types';
import type {
  AuditAction,
  AuditEntry,
  Block,
  BlockInput,
  BlockStatus,
  ExternalWindow,
  IsoWeekday,
  ManagedUser,
  Resource,
  ResourceInput,
  RuleSettings,
  SessionInfo,
  Sport,
  SportInput,
  UserKind,
} from './types';

/* ───────────── Utilitare ───────────── */

const DAYS: BDay[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']; // index + 1 = ISO weekday

/** Ora (0–23) în fusul Europe/Bucharest, indiferent de offset-ul din răspuns. */
export function bucharestHour(iso: string): number {
  const h = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hourCycle: 'h23', timeZone: 'Europe/Bucharest' })
    .formatToParts(new Date(iso))
    .find((p) => p.type === 'hour')?.value;
  return Number(h ?? 0);
}

/** Expirarea JWT-ului (câmpul `exp`) sau, dacă nu se poate citi, peste 8 ore (NFR-08). */
export function expiryFromJwt(token: string | null): string {
  try {
    const payload = JSON.parse(atob((token ?? '').split('.')[1]!.replace(/-/g, '+').replace(/_/g, '/'))) as {
      exp?: number;
    };
    if (payload.exp) return new Date(payload.exp * 1000).toISOString();
  } catch {
    /* token ilizibil */
  }
  return new Date(Date.now() + 8 * 3600_000).toISOString();
}

/* ───────────── Sesiune ───────────── */

export function toSession(u: BUser, token: string | null): SessionInfo {
  return {
    user: { id: u.id, fullName: u.full_name, email: u.email, role: 'admin' },
    // Backend-ul emite sesiune de administrator doar după pasul TOTP.
    twoFactorVerified: true,
    expiresAt: expiryFromJwt(token),
  };
}

/* ───────────── Sporturi ───────────── */

export const toSport = (s: BSport): Sport => ({
  id: s.id,
  nameRo: s.name_ro,
  nameEn: s.name_en,
  requiredEquipment: s.required_equipment ?? [],
});

/** `icon` este obligatoriu pe server, dar formularul nu îl are încă → valoare implicită. */
export const fromSportInput = (s: SportInput) => ({
  name_ro: s.nameRo,
  name_en: s.nameEn,
  icon: 'sport',
  required_equipment: s.requiredEquipment,
});

/* ───────────── Resurse ───────────── */

function hhmmMin(list: string[]): string {
  return [...list].sort()[0] ?? '08:00';
}
function hhmmMax(list: string[]): string {
  return [...list].sort().at(-1) ?? '22:00';
}

function toExternalWindow(w: BWeeklyHours | undefined): ExternalWindow | null {
  if (!w) return null;
  const days = DAYS.map((d, i) => ((w[d]?.length ?? 0) > 0 ? ((i + 1) as IsoWeekday) : null)).filter(
    (d): d is IsoWeekday => d !== null,
  );
  if (days.length === 0) return null;
  const first = w[DAYS[days[0]! - 1]!]![0]!;
  return { days, from: first.open, to: first.close };
}

export function toResource(r: BResource, blockedLabel: string | null = null): Resource {
  const ranges = DAYS.flatMap((d) => r.opening_hours?.[d] ?? []);
  return {
    id: r.id,
    name: r.name ?? '',
    location: r.location ?? '',
    photoUrl: r.photo_url ?? '',
    capacity: r.capacity ?? 0,
    equipment: r.equipment ?? [],
    sportIds: r.sport_ids ?? [],
    opensAt: hhmmMin(ranges.map((x) => x.open)),
    closesAt: hhmmMax(ranges.map((x) => x.close)),
    slotMinutes: r.slot_minutes ?? 60,
    externalAccess: r.external_access ?? 'never',
    externalWindow: toExternalWindow(r.external_access_windows),
    active: r.active ?? true,
    blocked: blockedLabel !== null,
    blockedLabel,
  };
}

/** Formularul are un singur interval pe zi pentru toate zilele → îl trimitem pe toate cele 7 zile. */
export function fromResourceInput(i: ResourceInput) {
  const week: BWeeklyHours = {};
  DAYS.forEach((d) => (week[d] = [{ open: i.opensAt, close: i.closesAt }]));
  const ext: BWeeklyHours = {};
  if (i.externalAccess === 'window' && i.externalWindow) {
    i.externalWindow.days.forEach((n) => (ext[DAYS[n - 1]!] = [{ open: i.externalWindow!.from, close: i.externalWindow!.to }]));
  }
  return {
    name: i.name,
    type: 'teren',
    location: i.location,
    capacity: i.capacity,
    equipment: i.equipment,
    sport_ids: i.sportIds,
    opening_hours: week,
    slot_minutes: i.slotMinutes,
    external_access: i.externalAccess,
    external_access_windows: ext,
    active: i.active,
  };
}

/* ───────────── Blocări ───────────── */

export function blockStatus(b: { start: string; end?: string | null }, now = Date.now()): BlockStatus {
  if (new Date(b.start).getTime() > now) return 'planned';
  if (!b.end || new Date(b.end).getTime() > now) return 'active';
  return 'history';
}

export function toBlock(
  b: BBlock,
  res: { name: string; photoUrl: string } | undefined,
  affectedCount = 0,
): Block {
  const kind = b.kind === 'emergency' ? 'emergency' : 'maintenance';
  return {
    id: b.id,
    resourceId: b.resource_id,
    resourceName: res?.name ?? b.resource_id,
    resourcePhotoUrl: res?.photoUrl ?? '',
    kind,
    reason: b.reason,
    startsAt: b.start,
    endsAt: b.end ?? null,
    recurrence: 'none',
    affectedCount,
    status: blockStatus(b),
    createdBy: b.created_by,
    hasDelivery: b.kind === 'emergency',
    releasedAt: null,
  };
}

/** Recurența din front → RRULE iCal (cerută de server cu `valid_from` / `valid_to`). */
export function fromBlockInput(i: BlockInput) {
  const body: Record<string, unknown> = {
    resource_id: i.resourceId,
    // „cleaning” nu există pe server → întreținere.
    kind: i.kind === 'emergency' ? 'emergency' : 'maintenance',
    reason: i.reason,
    start: i.startsAt,
    end: i.endsAt,
  };
  if (i.recurrence !== 'none') {
    const start = new Date(i.startsAt);
    const byday = DAYS[(start.getDay() + 6) % 7]!.slice(0, 2).toUpperCase();
    const validTo = i.endsAt ? new Date(i.endsAt) : new Date(start.getTime() + 365 * 86400_000);
    body.recurrence = {
      rule: i.recurrence === 'daily' ? 'FREQ=DAILY' : `FREQ=WEEKLY;BYDAY=${byday}`,
      valid_from: i.startsAt.slice(0, 10),
      valid_to: validTo.toISOString().slice(0, 10),
    };
  }
  return body;
}

/* ───────────── Setări ───────────── */

export const toSettings = (s: BSettings): RuleSettings => ({
  quotaMonthly: s.monthly_quota,
  maxActiveFuture: s.max_active_bookings,
  quotaPerSport: Object.keys(s.monthly_quota_per_sport ?? {}).length > 0,
  windowTeacherDays: s.booking_window_days_teacher,
  windowStudentDays: s.booking_window_days_student,
  windowExternalHours: s.booking_window_hours_external,
  cancelBeforeHours: s.cancel_free_hours,
  checkinBeforeMin: s.checkin_minutes_before,
  checkinAfterMin: s.checkin_minutes_after,
  noShowLimit: s.no_show_threshold,
  suspensionDays: s.no_show_suspension_days,
  waitlistOfferMinutes: s.waitlist_offer_minutes,
});

/**
 * PUT-ul serverului cere TOATE câmpurile modificabile → pornim de la valorile curente și suprascriem ce știe formularul.
 * `updated_by` / `updated_at` sunt doar de citit: dacă le trimitem înapoi, serverul răspunde 422.
 */
export function fromSettings(s: RuleSettings, current: BSettings): Omit<BSettings, 'updated_by' | 'updated_at'> {
  const writable: Partial<BSettings> = { ...current };
  delete writable.updated_by;
  delete writable.updated_at;
  return {
    ...(writable as Omit<BSettings, 'updated_by' | 'updated_at'>),
    monthly_quota: s.quotaMonthly,
    max_active_bookings: s.maxActiveFuture,
    booking_window_days_teacher: s.windowTeacherDays,
    booking_window_days_student: s.windowStudentDays,
    booking_window_hours_external: s.windowExternalHours,
    cancel_free_hours: s.cancelBeforeHours,
    checkin_minutes_before: s.checkinBeforeMin,
    checkin_minutes_after: s.checkinAfterMin,
    no_show_threshold: s.noShowLimit,
    no_show_suspension_days: s.suspensionDays,
    waitlist_offer_minutes: s.waitlistOfferMinutes,
    // Dezactivarea „per sport” golește valorile; activarea păstrează ce există deja pe server (D5).
    monthly_quota_per_sport: s.quotaPerSport ? (current.monthly_quota_per_sport ?? {}) : {},
  };
}

/* ───────────── Audit ───────────── */

const field = (o: unknown, k: string): unknown =>
  o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined;

/** Acțiunile serverului (`resource.update` …) → acțiunile din interfață. Necunoscutele se afișează ca atare. */
export function toAuditAction(e: BAuditEntry): AuditAction {
  switch (e.action) {
    case 'block.create':
      return field(e.after, 'kind') === 'emergency' ? 'emergency_block' : 'planned_block';
    case 'block.delete':
      return 'unblock';
    case 'resource.create':
      return 'resource_created';
    case 'resource.update':
      if (field(e.after, 'active') === false && field(e.before, 'active') !== false) return 'resource_deactivated';
      if (field(e.after, 'active') === true && field(e.before, 'active') === false) return 'resource_activated';
      return 'resource_updated';
    case 'settings.update':
      return 'rule_changed';
    case 'sport.create':
      return 'sport_created';
    case 'sport.update':
      return 'sport_updated';
    case 'user.suspend':
    case 'user.auto_suspend':
      return 'account_suspended';
    case 'user.reactivate':
      return 'account_reactivated';
    default:
      return e.action as AuditAction;
  }
}

export const toAuditEntry = (e: BAuditEntry): AuditEntry => ({
  id: e.id,
  at: e.at,
  // Serverul trimite doar `actor_id`; numele va veni când backend-ul îl adaugă (vezi BACKEND-CERERI.md).
  actor: { id: e.actor_id, name: e.actor_id.slice(0, 8) },
  action: toAuditAction(e),
  object: e.entity_id ? `${e.entity} · ${e.entity_id.slice(0, 8)}` : e.entity,
});

export function periodToRange(period: '24h' | '7d' | '30d' | '12m', now = new Date()): { from: string; to: string } {
  const ms = { '24h': 86400_000, '7d': 7 * 86400_000, '30d': 30 * 86400_000, '12m': 365 * 86400_000 }[period];
  return { from: new Date(now.getTime() - ms).toISOString(), to: now.toISOString() };
}

/* ───────────── Utilizatori ───────────── */

export const toManagedUser = (u: BUser): ManagedUser => ({
  id: u.id,
  fullName: u.full_name,
  email: u.email,
  phone: u.phone ?? '',
  role: u.role as UserKind,
  status: u.status,
  suspendedUntil: u.suspended_until ?? null,
  noShowsThisMonth: 0, // lipsește din contract (cerere către backend)
});
