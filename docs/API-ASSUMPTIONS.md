# Rute API presupuse de front-end

SDD 6.1 definește doar o parte dintre rute. Cele de mai jos sunt **presupuse** de front-end și trebuie confirmate sau ajustate cu echipa de backend.
Implementarea lor este în `src/api/endpoints.ts`; tipurile în `src/api/types.ts`; simularea în `src/mocks/handlers.ts`.
Prefix: `/api/v1`. Autentificare: cookie HttpOnly. Erori: `{ code, message }` cu statusul HTTP corespunzător (401 → front-end-ul trimite la login).

| Metodă și rută | Scop | Notă |
|---|---|---|
| `GET /me` | Sesiunea curentă | 401 fără sesiune; `twoFactorVerified`, `expiresAt` (8 h) |
| `POST /auth/admin/totp` | Pasul 2 (TOTP) | corp `{ code }` |
| `POST /auth/logout` | Deconectare | |
| `GET /admin/resources` | Toate resursele, inclusiv inactive | `blocked` calculat de server |
| `POST/PATCH /admin/resources[/:id]` | Creare, editare, (re)activare | `PATCH { active }` |
| `GET /admin/dashboard?date=` | Grila zilei + indicatori + urgențe active | |
| `GET /admin/blocks` | Lista blocărilor + contoare pe stare | |
| `GET /admin/blocks/preview` | Câte rezervări se anulează | `resourceId, from, to, excludeBlockId` |
| `PATCH /admin/blocks/:id` | Editare blocare planificată | |
| `DELETE /admin/blocks/:id` | Deblocare (încheie acum) | |
| `GET /admin/blocks/:id/delivery` | Raport „anunțați / livrați” (SDD 7.3) | |
| `POST /admin/schedule/import/preview` | Previzualizare fișier orar | multipart `file`; întoarce `importId` |
| `POST /admin/schedule/classes/preview` | Previzualizare curs adăugat manual | |
| `GET /admin/events`, `POST /admin/events/preview` | Listă și conflicte | |
| `GET /admin/announcements`, `GET /admin/announcements/audience` | Istoric și „ajunge la N” | |
| `GET /admin/audit` | Jurnal paginat | `q, actorId, period, page, pageSize`; `format=csv` pentru export |
| `GET /admin/reports?month=&format=` | Export CSV/PDF | parametrul `format` este presupus |

Rutele din SDD 6.1 folosite ca atare: `GET /auth/sso/login`, `GET /sports`, `POST /admin/blocks`, `POST /admin/schedule/import` (cu `importId`), `POST /admin/events`, `POST /admin/announcements`, `GET /admin/reports?month=`, `GET/PUT /admin/settings`.
