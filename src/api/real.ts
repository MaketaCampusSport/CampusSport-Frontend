import { API_BASE } from './config';
import type {
  BAvailability,
  BBlock,
  BBlockResult,
  BDashboard,
  BDelivery,
  BPage,
  BResource,
  BSession,
  BSettings,
  BSport,
  BUser,
  BAuditEntry,
} from './backend-types';
import { ApiError, getAccessToken, http, setAccessToken } from './http';
import {
  blockStatus,
  bucharestHour,
  fromBlockInput,
  fromResourceInput,
  fromSettings,
  fromSportInput,
  periodToRange,
  toAuditEntry,
  toBlock,
  toManagedUser,
  toResource,
  toSession,
  toSettings,
  toSport,
} from './mappers';
import type { Api } from './endpoints';
import type {
  AuditEntry,
  Block,
  BlockList,
  CellState,
  DashboardData,
  DashboardRow,
  Resource,
  UserKind,
} from './types';

/** Funcționalitate care încă nu există pe server – apare în UI ca eroare clară, nu ca „Not Found”. */
function notYet(what: string): never {
  throw new ApiError(501, `Funcționalitate indisponibilă pe server (${what}).`, 'NOT_IMPLEMENTED');
}

const todayIso = () => new Date().toISOString().slice(0, 10);

async function loadResources(): Promise<BResource[]> {
  return http.get<BResource[]>('/resources', { include_inactive: true });
}

async function loadBlocks(): Promise<BBlock[]> {
  const page = await http.get<BPage<BBlock>>('/admin/blocks', { page: 1, page_size: 100 });
  return page.items;
}

/** Blocările active acum, pe resursă (pentru insigna „blocată” din catalog). */
function activeBlockLabel(blocks: BBlock[], resourceId: string): string | null {
  const b = blocks.find((x) => x.resource_id === resourceId && blockStatus(x) === 'active');
  return b ? b.reason : null;
}

function cellState(slot: BDashboard['resources'][number]['slots'][number]): CellState {
  if (slot.status === 'blocked') {
    if (slot.block_kind === 'pe_class') return 'pe_class';
    if (slot.block_kind === 'event') return 'event';
    return 'blocked';
  }
  if (slot.status === 'occupied' || slot.status === 'mine') return 'booked';
  return 'free';
}

function toDashboard(d: BDashboard | BAvailability, blocks: BBlock[], photos: Map<string, string>): DashboardData {
  const rows: DashboardRow[] = d.resources.map((r) => {
    const cells = new Map<number, { state: CellState }>();
    r.slots.forEach((s) => cells.set(bucharestHour(s.start), { state: cellState(s) }));
    const label = activeBlockLabel(blocks, r.resource_id);
    return {
      resourceId: r.resource_id,
      name: r.resource_name,
      photoUrl: photos.get(r.resource_id) ?? '',
      blocked: label !== null,
      blockedLabel: label,
      cells: [...cells.entries()].sort((a, b) => a[0] - b[0]).map(([hour, c]) => ({ hour, state: c.state })),
    };
  });
  const hours = [...new Set(rows.flatMap((r) => r.cells.map((c) => c.hour)))].sort((a, b) => a - b);
  const all = rows.flatMap((r) => r.cells);
  const booked = all.filter((c) => c.state === 'booked').length;
  const open = all.filter((c) => c.state !== 'closed').length;
  const checkIns = 'check_ins_count' in d ? d.check_ins_count : 0;
  const noShows = 'no_shows_count' in d ? d.no_shows_count : 0;
  return {
    date: d.date,
    hours,
    kpis: {
      bookings: { value: booked },
      checkIns: { value: checkIns },
      noShows: { value: noShows },
      occupancyPct: { value: open ? Math.round((booked / open) * 100) : 0 },
    },
    rows,
    activeEmergencies: blocks
      .filter((b) => b.kind === 'emergency' && blockStatus(b) === 'active')
      .map((b) => ({
        blockId: b.id,
        resourceId: b.resource_id,
        resourceName: rows.find((r) => r.resourceId === b.resource_id)?.name ?? b.resource_id,
        reason: b.reason,
        startedAt: b.start,
        affectedCount: 0,
      })),
  };
}

/** Implementarea pentru backend-ul NestJS real (contract snake_case, vezi `backend-types.ts`). */
export const realApi: Api = {
  auth: {
    async me() {
      const u = await http.get<BUser>('/me');
      if (u.role !== 'admin') throw new ApiError(403, 'Contul nu are rol de administrator.', 'FORBIDDEN');
      return toSession(u, getAccessToken());
    },
    async startSso() {
      window.location.assign(`${API_BASE}/auth/sso/login?return_to=${encodeURIComponent('/admin')}`);
      return 'redirected';
    },
    async verifyTotp(code: string, challengeId?: string) {
      if (!challengeId) throw new ApiError(400, 'Lipsește challenge_id (reia autentificarea SSO).', 'BAD_REQUEST');
      const s = await http.post<BSession>('/auth/2fa/verify', { challenge_id: challengeId, code });
      setAccessToken(s.access_token);
      return toSession(s.user, s.access_token);
    },
    logout: async () => {
      await http.post<void>('/auth/logout');
      setAccessToken(null);
    },
  },

  catalog: {
    sports: async () => (await http.get<BSport[]>('/sports')).map(toSport),
    async resources() {
      const [res, blocks] = await Promise.all([loadResources(), loadBlocks().catch(() => [] as BBlock[])]);
      return res.map((r) => toResource(r, activeBlockLabel(blocks, r.id)));
    },
  },

  resources: {
    create: async (input) => toResource(await http.post<BResource>('/admin/resources', fromResourceInput(input))),
    update: async (id, input) =>
      toResource(await http.patch<BResource>(`/admin/resources/${id}`, fromResourceInput(input))),
    setActive: async (id, active) => toResource(await http.patch<BResource>(`/admin/resources/${id}`, { active })),
  },

  dashboard: {
    async get(date) {
      const [resources, blocks] = await Promise.all([loadResources(), loadBlocks().catch(() => [] as BBlock[])]);
      const photos = new Map(resources.map((r) => [r.id, r.photo_url ?? '']));
      try {
        return toDashboard(await http.get<BDashboard>('/admin/dashboard', { date }), blocks, photos);
      } catch (e) {
        // Până implementează backend-ul `/admin/dashboard` (501), compunem panoul din `/availability`.
        if (!(e instanceof ApiError) || e.status !== 501) throw e;
        return toDashboard(await http.get<BAvailability>('/availability', { date }), blocks, photos);
      }
    },
  },

  blocks: {
    async list(): Promise<BlockList> {
      const [blocks, resources] = await Promise.all([loadBlocks(), loadResources()]);
      const byId = new Map(resources.map((r) => [r.id, { name: r.name ?? '', photoUrl: r.photo_url ?? '' }]));
      const items: Block[] = blocks
        .map((b) => toBlock(b, byId.get(b.resource_id)))
        .sort((a, b) => b.startsAt.localeCompare(a.startsAt));
      const counts = { active: 0, planned: 0, history: 0 };
      items.forEach((b) => counts[b.status]++);
      return { items, counts };
    },
    /** Estimare: câte sloturi ocupate sunt în interval (max. 14 zile) – până apare `/admin/blocks/preview`. */
    async preview(q) {
      const from = new Date(q.from);
      const to = q.to ? new Date(q.to) : new Date(from.getTime() + 7 * 86400_000);
      let count = 0;
      for (let d = new Date(from), n = 0; d <= to && n < 14; d = new Date(d.getTime() + 86400_000), n++) {
        const av = await http.get<BAvailability>('/availability', {
          resource: q.resourceId,
          date: d.toISOString().slice(0, 10),
        });
        for (const r of av.resources)
          for (const s of r.slots)
            if (s.status === 'occupied' && new Date(s.end) > from && new Date(s.start) < to) count++;
      }
      return { affectedCount: count };
    },
    async create(input) {
      const r = await http.post<BBlockResult>('/admin/blocks', fromBlockInput(input));
      const res = (await loadResources()).find((x) => x.id === r.block.resource_id);
      return toBlock(r.block, { name: res?.name ?? '', photoUrl: res?.photo_url ?? '' }, r.cancelled_bookings_count);
    },
    update: async () => notYet('PATCH /admin/blocks/{id}'),
    async release(id) {
      await http.delete<void>(`/admin/blocks/${id}`);
      return undefined as unknown as Block;
    },
    async delivery(id) {
      const d = await http.get<BDelivery>(`/admin/blocks/${id}/delivery`);
      const blocks = await loadBlocks();
      const b = blocks.find((x) => x.id === id);
      return {
        blockId: id,
        resourceName: '',
        startedAt: b?.start ?? new Date().toISOString(),
        total: d.notified,
        cancelled: 0,
        quotasRefunded: 0,
        delivered: d.delivered,
        push: d.by_channel?.push ?? 0,
        email: d.by_channel?.email ?? 0,
        sms: d.by_channel?.sms ?? 0,
        complete: d.delivered + d.failed >= d.notified,
        durationSeconds: 0,
      };
    },
  },

  schedule: {
    previewFile: async () => notYet('POST /admin/schedule/import'),
    previewManual: async () => notYet('POST /admin/schedule/classes'),
    commit: async () => notYet('POST /admin/schedule/import/{id}/confirm'),
  },

  events: {
    list: async () => notYet('GET /admin/events'),
    preview: async () => notYet('previzualizare evenimente'),
    create: async () => notYet('POST /admin/events'),
  },

  announcements: {
    list: async () => notYet('GET /admin/announcements'),
    audience: async () => notYet('estimare audiență'),
    send: async () => notYet('POST /admin/announcements'),
  },

  reports: {
    get: async () => notYet('GET /admin/reports'),
    export: async () => notYet('export rapoarte'),
  },

  settings: {
    get: async () => toSettings(await http.get<BSettings>('/admin/settings')),
    async update(s) {
      const current = await http.get<BSettings>('/admin/settings');
      return toSettings(await http.put<BSettings>('/admin/settings', fromSettings(s, current)));
    },
  },

  audit: {
    async list(q) {
      const { from, to } = periodToRange(q.period);
      const page = await http.get<BPage<BAuditEntry>>('/admin/audit-log', {
        actor: q.actorId,
        from,
        to,
        page: q.page,
        page_size: q.pageSize,
      });
      let items: AuditEntry[] = page.items.map(toAuditEntry);
      // Serverul nu are căutare text (`q`) → filtrăm local pe pagina curentă.
      if (q.q) {
        const needle = q.q.toLowerCase();
        items = items.filter((e) => `${e.action} ${e.object} ${e.actor.name}`.toLowerCase().includes(needle));
      }
      const actors = [...new Map(items.map((e) => [e.actor.id, e.actor])).values()];
      return { items, total: page.total, page: page.page, pageSize: page.page_size, actors };
    },
    async exportCsv(q) {
      const { from, to } = periodToRange(q.period);
      const page = await http.get<BPage<BAuditEntry>>('/admin/audit-log', {
        actor: q.actorId,
        from,
        to,
        page: 1,
        page_size: 100,
      });
      const rows = page.items.map((e) => [e.at, e.actor_id, e.action, e.entity, e.entity_id ?? ''].join(','));
      return new Blob([['at,actor_id,action,entity,entity_id', ...rows].join('\n')], { type: 'text/csv' });
    },
  },

  sports: {
    create: async (input) => toSport(await http.post<BSport>('/admin/sports', fromSportInput(input))),
    update: async (id, input) => toSport(await http.put<BSport>(`/admin/sports/${id}`, fromSportInput(input))),
    remove: async () => notYet('DELETE /admin/sports/{id}'),
  },

  users: {
    async list(q) {
      const page = await http.get<BPage<BUser>>('/admin/users', {
        q: q.q,
        role: q.role,
        status: q.status,
        page: 1,
        page_size: 100,
      });
      return page.items.filter((u) => u.role !== 'admin').map(toManagedUser);
    },
    async suspend(id, input) {
      const until = new Date(Date.now() + input.days * 86400_000).toISOString();
      return toManagedUser(await http.post<BUser>(`/admin/users/${id}/suspend`, { until, reason: input.reason }));
    },
    reactivate: async (id) => toManagedUser(await http.post<BUser>(`/admin/users/${id}/reactivate`)),
  },

  checkin: {
    verify: async () => notYet('check-in administrativ după cod QR'),
  },

  account: {
    totpSetup: async () => notYet('înrolare TOTP din interfață (doar CLI: npm run admin:enroll-totp)'),
    totpConfirm: async () => notYet('confirmare TOTP din interfață'),
  },
};

export type { Resource, UserKind };
export { todayIso };