import { API_BASE, USE_MOCKS } from './config';
import { http } from './http';
import type {
  AdminUser,
  Announcement,
  AnnouncementInput,
  AudienceEstimate,
  AudienceQuery,
  AuditPage,
  AuditQuery,
  Block,
  BlockInput,
  BlockList,
  BlockPreview,
  BlockPreviewQuery,
  DashboardData,
  DeliveryReport,
  EventInput,
  EventPreview,
  ExportFormat,
  ManualClassInput,
  ReportData,
  Resource,
  ResourceInput,
  RuleSettings,
  SchedulePreview,
  ScheduleResult,
  SessionInfo,
  Sport,
  UniEvent,
} from './types';

function periodToRange(period?: AuditQuery['period']): { from?: string; to?: string } {
  if (!period) return {};
  const now = new Date();
  const ms = period === '24h' ? 86_400_000 : period === '7d' ? 7 * 86_400_000 : 30 * 86_400_000;
  return { from: new Date(now.getTime() - ms).toISOString(), to: now.toISOString() };
}

function mapSettingsFromApi(raw: Record<string, unknown>): RuleSettings {
  if ('monthlyQuota' in raw) return raw as unknown as RuleSettings;
  return {
    monthlyQuota: Number(raw.monthly_quota ?? 4),
    bookingWindowDays: Number(raw.booking_window_days ?? 14),
    cancelDeadlineHours: Number(raw.cancel_deadline_hours ?? 6),
    noShowPenaltyDays: Number(raw.no_show_penalty_days ?? 7),
    maxActiveBookings: Number(raw.max_active_bookings ?? 2),
  } as unknown as RuleSettings;
}

function mapSettingsToApi(s: RuleSettings): Record<string, unknown> {
  const r = s as unknown as Record<string, unknown>;
  return {
    monthly_quota: r.monthlyQuota,
    booking_window_days: r.bookingWindowDays,
    cancel_deadline_hours: r.cancelDeadlineHours,
    no_show_penalty_days: r.noShowPenaltyDays,
    max_active_bookings: r.maxActiveBookings,
  };
}

/**
 * Stratul de acces la API. Rutele marcate „SDD 6.1” sunt cele documentate;
 * cele marcate „presupus” trebuie confirmate cu echipa de backend
 * (lista completă: docs/API-ASSUMPTIONS.md).
 */
export const api = {
  auth: {
    /** presupus: starea sesiunii curente (401 dacă nu există sesiune SSO). */
    me: () => http.get<SessionInfo>('/me'),
    /**
     * SDD 6.1: GET /auth/sso/login redirecționează către SSO-ul universității.
     * În modul demo simulăm întoarcerea din SSO fără redirecționare.
     */
    async startSso(): Promise<'redirected' | 'mock'> {
      if (USE_MOCKS) {
        await http.post('/auth/sso/login');
        return 'mock';
      }
      window.location.assign(
        `${API_BASE}/auth/sso/login?audience=admin&redirect=${encodeURIComponent('/admin')}`,
      );
      return 'redirected';
    },
    /** presupus: al doilea pas TOTP pentru administratori (NFR-08). */
    verifyTotp: (code: string) => http.post<SessionInfo>('/auth/admin/totp', { code }),
    /** presupus */
    logout: () => http.post<void>('/auth/logout'),
  },

  catalog: {
    /** SDD 6.1: GET /sports */
    sports: () => http.get<Sport[]>('/sports'),
    /** presupus: listă completă, inclusiv resursele dezactivate. */
    resources: () => http.get<Resource[]>('/admin/resources'),
  },

  resources: {
    /** presupus (FR-39) */
    create: (input: ResourceInput) => http.post<Resource>('/admin/resources', input),
    /** presupus (FR-39) */
    update: (id: string, input: ResourceInput) => http.patch<Resource>(`/admin/resources/${id}`, input),
    /** presupus (FR-39): dezactivare / reactivare. */
    setActive: (id: string, active: boolean) =>
      http.patch<Resource>(`/admin/resources/${id}`, { active }),
  },

  dashboard: {
    /** presupus (FR-43): ziua curentă pe toate resursele + indicatori. */
    get: (date: string) => http.get<DashboardData>('/admin/dashboard', { date }),
  },

  blocks: {
    /** presupus */
    list: () => http.get<BlockList>('/admin/blocks'),
    /** presupus: câte rezervări ar fi afectate (FR-41). */
    preview: (q: BlockPreviewQuery) => {
      if (USE_MOCKS) {
        return http.get<BlockPreview>('/admin/blocks/preview', {
          resourceId: q.resourceId,
          from: q.from,
          to: q.to,
          excludeBlockId: q.excludeBlockId,
        });
      }
      return Promise.resolve({ affectedCount: 0, affectedBookings: [] } as unknown as BlockPreview);
    },
    /** SDD 6.1: POST /admin/blocks – blocare de urgență sau planificată. */
    create: (input: BlockInput) => http.post<Block>('/admin/blocks', input),
    /** presupus */
    update: (id: string, input: BlockInput) => {
      if (USE_MOCKS) return http.patch<Block>(`/admin/blocks/${id}`, input);
      return Promise.reject(new Error('Editarea blocărilor nu este disponibilă pe API; șterge și recreează blocarea.'));
    },
    /** presupus: deblocare (încheie blocarea acum). */
    release: (id: string) => http.delete<Block>(`/admin/blocks/${id}`),
    /** presupus: raportul „anunțați / livrați” (SDD 7.3). */
    delivery: (id: string) => http.get<DeliveryReport>(`/admin/blocks/${id}/delivery`),
  },

  schedule: {
    /** presupus: validează fișierul și calculează conflictele, fără să scrie (SDD 7.4). */
    previewFile(file: File): Promise<SchedulePreview> {
      const form = new FormData();
      form.append('file', file);
      return http.upload<SchedulePreview>('/admin/schedule/import/preview', form);
    },
    /** presupus: „Adaugă manual” – același flux de previzualizare. */
    previewManual: (input: ManualClassInput) =>
      http.post<SchedulePreview>('/admin/schedule/classes/preview', input),
    /** SDD 6.1: POST /admin/schedule/import – confirmă importul pregătit anterior. */
    commit: (importId: string) => http.post<ScheduleResult>('/admin/schedule/import', { importId }),
  },

  events: {
    /** presupus */
    list: () => http.get<UniEvent[]>('/admin/events'),
    /** presupus: conflictele noului eveniment, înainte de confirmare. */
    preview: (input: EventInput) => http.post<EventPreview>('/admin/events/preview', input),
    /** SDD 6.1: POST /admin/events */
    create: (input: EventInput) => http.post<UniEvent>('/admin/events', input),
  },

  announcements: {
    /** presupus */
    list: () => http.get<Announcement[]>('/admin/announcements'),
    /** presupus: „Ajunge la N utilizatori”. */
    audience: (q: AudienceQuery) =>
      http.get<AudienceEstimate>('/admin/announcements/audience', {
        audience: q.audience,
        resourceId: q.resourceId,
        date: q.date,
        allDay: q.allDay,
        from: q.from,
        to: q.to,
      }),
    /** SDD 6.1: POST /admin/announcements */
    send: (input: AnnouncementInput) => http.post<Announcement>('/admin/announcements', input),
  },

  reports: {
    /** SDD 6.1: GET /admin/reports?month= */
    get: (month: string) => http.get<ReportData>('/admin/reports', { month }),
    /** SDD 6.1: export CSV/PDF – parametrul `format` este presupus. */
    export: (month: string, format: ExportFormat) => http.blob('/admin/reports', { month, format }),
  },

  settings: {
    /** SDD 6.1: GET/PUT /admin/settings */
    get: async () => {
      const raw = await http.get<Record<string, unknown>>('/admin/settings');
      return USE_MOCKS ? (raw as unknown as RuleSettings) : mapSettingsFromApi(raw);
    },
    update: async (settings: RuleSettings) => {
      const payload = USE_MOCKS ? settings : mapSettingsToApi(settings);
      const raw = await http.put<Record<string, unknown>>('/admin/settings', payload);
      return USE_MOCKS ? (raw as unknown as RuleSettings) : mapSettingsFromApi(raw);
    },
  },

  audit: {
    /** presupus (FR-45) */
    list: (q: AuditQuery) => {
      if (USE_MOCKS) {
        return http.get<AuditPage>('/admin/audit', {
          q: q.q,
          actorId: q.actorId,
          period: q.period,
          page: q.page,
          pageSize: q.pageSize,
        });
      }
      const range = periodToRange(q.period);
      return http.get<AuditPage>('/admin/audit-log', {
        actor: q.actorId,
        entity: q.q,
        from: range.from,
        to: range.to,
        page: q.page,
        page_size: q.pageSize,
      });
    },
    exportCsv: (q: Omit<AuditQuery, 'page' | 'pageSize'>) => {
      if (USE_MOCKS) {
        return http.blob('/admin/audit', { q: q.q, actorId: q.actorId, period: q.period, format: 'csv' });
      }
      const range = periodToRange(q.period);
      return http.blob('/admin/audit-log', {
        actor: q.actorId,
        entity: q.q,
        from: range.from,
        to: range.to,
        format: 'csv',
      });
    },
  },
};

export type { AdminUser };