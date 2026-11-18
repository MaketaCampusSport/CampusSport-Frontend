import { http as mswHttp, HttpResponse } from 'msw';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { setAccessToken } from '@/api/http';
import { realApi } from '@/api/real';
import { server } from '@/mocks/node';

const B = 'http://localhost/api/v1';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  setAccessToken(null);
});
afterAll(() => server.close());

const admin = { id: 'u1', full_name: 'Andrei Rusu', email: 'a@x.ro', role: 'admin', status: 'active' };

/** Teste de contract: răspunsuri în formatul EXACT al backend-ului (snake_case) → tipurile din front. */
describe('Adaptoare backend real', () => {
  it('2FA: trimite challenge_id și memorează tokenul', async () => {
    let body: unknown;
    server.use(
      mswHttp.post(`${B}/auth/2fa/verify`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ access_token: 'a.b.c', token_type: 'Bearer', expires_in: 900, user: admin });
      }),
    );
    const s = await realApi.auth.verifyTotp('123456', 'ch-1');
    expect(body).toEqual({ challenge_id: 'ch-1', code: '123456' });
    expect(s.user.fullName).toBe('Andrei Rusu');
    expect(s.twoFactorVerified).toBe(true);
  });

  it('/me: un cont care nu e admin este refuzat (403)', async () => {
    server.use(mswHttp.get(`${B}/me`, () => HttpResponse.json({ ...admin, role: 'student' })));
    await expect(realApi.auth.me()).rejects.toMatchObject({ status: 403 });
  });

  it('setări: snake_case ↔ camelCase și păstrarea câmpurilor necunoscute la PUT', async () => {
    const server_settings = {
      monthly_quota: 8, monthly_quota_per_sport: {}, max_active_bookings: 3,
      booking_window_days_student: 7, booking_window_days_teacher: 14, booking_window_hours_external: 24,
      cancel_free_hours: 2, checkin_minutes_before: 15, checkin_minutes_after: 10,
      no_show_threshold: 3, no_show_suspension_days: 14, waitlist_offer_minutes: 15,
      waitlist_simultaneous_under_hours: 6, default_slot_minutes: 60, member_replaces_external: true,
    };
    let put: Record<string, unknown> = {};
    server.use(
      mswHttp.get(`${B}/admin/settings`, () => HttpResponse.json(server_settings)),
      mswHttp.put(`${B}/admin/settings`, async ({ request }) => {
        put = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json(put);
      }),
    );
    const s = await realApi.settings.get();
    expect(s.quotaMonthly).toBe(8);
    expect(s.windowTeacherDays).toBe(14);
    await realApi.settings.update({ ...s, quotaMonthly: 10 });
    expect(put.monthly_quota).toBe(10);
    expect(put.default_slot_minutes).toBe(60); // câmp necunoscut formularului, păstrat
    expect(put.member_replaces_external).toBe(true);
  });

  it('sporturi: PUT cu name_ro / name_en / icon', async () => {
    let body: Record<string, unknown> = {};
    server.use(
      mswHttp.put(`${B}/admin/sports/s1`, async ({ request }) => {
        body = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({ id: 's1', ...body });
      }),
    );
    const s = await realApi.sports.update('s1', { nameRo: 'Baschet', nameEn: 'Basketball', requiredEquipment: ['panou'] });
    expect(body).toMatchObject({ name_ro: 'Baschet', name_en: 'Basketball', icon: 'sport', required_equipment: ['panou'] });
    expect(s.nameEn).toBe('Basketball');
  });

  it('utilizatori: pagină → listă, fără admini; suspendare cu `until`', async () => {
    let q = '';
    let body: Record<string, unknown> = {};
    server.use(
      mswHttp.get(`${B}/admin/users`, ({ request }) => {
        q = new URL(request.url).search;
        return HttpResponse.json({ page: 1, page_size: 100, total: 2, items: [admin, { ...admin, id: 'u2', full_name: 'Ion Popescu', role: 'student' }] });
      }),
      mswHttp.post(`${B}/admin/users/u2/suspend`, async ({ request }) => {
        body = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({ ...admin, id: 'u2', role: 'student', status: 'suspended', suspended_until: body.until });
      }),
    );
    const list = await realApi.users.list({ q: 'ion' });
    expect(q).toContain('page_size=100');
    expect(list.map((u) => u.fullName)).toEqual(['Ion Popescu']);
    const u = await realApi.users.suspend('u2', { days: 7, reason: 'no-show' });
    expect(typeof body.until).toBe('string');
    expect(body.reason).toBe('no-show');
    expect(u.status).toBe('suspended');
  });

  it('audit: perioada devine from/to, iar intrarea se mapează', async () => {
    let search = '';
    server.use(
      mswHttp.get(`${B}/admin/audit-log`, ({ request }) => {
        search = new URL(request.url).search;
        return HttpResponse.json({
          page: 1, page_size: 20, total: 1,
          items: [{ id: 'e1', actor_id: 'abcdef12-0000', action: 'emergency_block', entity: 'block', entity_id: 'b1234567-x', at: '2026-11-17T10:00:00Z' }],
        });
      }),
    );
    const p = await realApi.audit.list({ period: '7d', page: 1, pageSize: 20 });
    expect(search).toMatch(/from=.*&to=.*&page=1&page_size=20/);
    expect(p.items[0]!.action).toBe('emergency_block');
    expect(p.pageSize).toBe(20);
  });

  it('blocări: creare cu kind/recurență RRULE; lista calculează statusul', async () => {
    let body: Record<string, unknown> = {};
    const now = Date.now();
    server.use(
      mswHttp.get(`${B}/resources`, () => HttpResponse.json([{ id: 'r1', name: 'Teren 1', active: true }])),
      mswHttp.get(`${B}/admin/blocks`, () =>
        HttpResponse.json({
          page: 1, page_size: 100, total: 2,
          items: [
            { id: 'b1', resource_id: 'r1', kind: 'emergency', start: new Date(now - 3600_000).toISOString(), end: null, reason: 'Avarie', created_by: 'u1' },
            { id: 'b2', resource_id: 'r1', kind: 'maintenance', start: new Date(now + 86400_000).toISOString(), end: null, reason: 'Revizie', created_by: 'u1' },
          ],
        }),
      ),
      mswHttp.post(`${B}/admin/blocks`, async ({ request }) => {
        body = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({ block: { id: 'b3', resource_id: 'r1', kind: 'maintenance', start: '2027-02-02T08:00:00Z', end: '2027-03-01T08:00:00Z', reason: 'x', created_by: 'u1' }, cancelled_bookings_count: 4, notified_users_count: 4 }, { status: 201 });
      }),
    );
    const list = await realApi.blocks.list();
    expect(list.counts).toEqual({ active: 1, planned: 1, history: 0 });
    expect(list.items[0]!.resourceName).toBe('Teren 1');
    const b = await realApi.blocks.create({ resourceId: 'r1', kind: 'cleaning', reason: 'x', startsAt: '2027-02-02T08:00:00Z', endsAt: '2027-03-01T08:00:00Z', recurrence: 'weekly', channels: ['push'] });
    expect(body.kind).toBe('maintenance');
    expect(body.recurrence).toMatchObject({ rule: 'FREQ=WEEKLY;BYDAY=TU', valid_from: '2027-02-02' });
    expect(b.affectedCount).toBe(4);
  });

  it('panou: dacă /admin/dashboard dă 501, se compune din /availability', async () => {
    server.use(
      mswHttp.get(`${B}/resources`, () => HttpResponse.json([{ id: 'r1', name: 'Teren 1' }])),
      mswHttp.get(`${B}/admin/blocks`, () => HttpResponse.json({ page: 1, page_size: 100, total: 0, items: [] })),
      mswHttp.get(`${B}/admin/dashboard`, () => HttpResponse.json({ code: 'NOT_IMPLEMENTED', message_ro: 'x', message_en: 'x' }, { status: 501 })),
      mswHttp.get(`${B}/availability`, () =>
        HttpResponse.json({
          date: '2026-11-17',
          resources: [{ resource_id: 'r1', resource_name: 'Teren 1', slots: [
            { start: '2026-11-17T08:00:00+02:00', end: '2026-11-17T09:00:00+02:00', status: 'free', bookable: true },
            { start: '2026-11-17T09:00:00+02:00', end: '2026-11-17T10:00:00+02:00', status: 'occupied', bookable: false, booking_id: 'k1' },
          ] }],
        }),
      ),
    );
    const d = await realApi.dashboard.get('2026-11-17');
    expect(d.hours).toEqual([8, 9]);
    expect(d.rows[0]!.cells.map((c) => c.state)).toEqual(['free', 'booked']);
    expect(d.kpis.occupancyPct.value).toBe(50);
  });

  it('funcționalitățile încă neimplementate dau 501 clar', async () => {
    await expect(realApi.events.list()).rejects.toMatchObject({ status: 501, code: 'NOT_IMPLEMENTED' });
    await expect(realApi.checkin.verify('x')).rejects.toMatchObject({ status: 501 });
  });
});
