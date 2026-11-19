# Cereri către echipa de backend

Rezultatul conectării front-end-ului admin la backend-ul real (`MaketaCampusSport/CampusSport`, contract `livrabil05/openapi.yaml`).
Front-end-ul convertește `snake_case` ↔ `camelCase` în `src/api/mappers.ts` și folosește backend-ul când `VITE_USE_MOCKS=false` (`src/api/real.ts`). Ce nu există încă pe server apare în interfață ca „funcționalitate indisponibilă” (eroare `501`).

Prioritate: **P1** = o pagină nu funcționează fără ea; **P2** = funcționează, dar limitat; **P3** = îmbunătățire.

## A. Funcții încă 501 / lipsă (pagini indisponibile)

| # | Cerere | Prioritate | Efect în front-end acum |
|---|---|---|---|
| 1 | `GET /admin/dashboard` (501) conform `Dashboard`: `date, resources[], check_ins_count, no_shows_count` | P2 | Panoul se compune din `GET /availability?resource=…` (o cerere pe resursă); indicatorii check-in și neprezentări rămân 0 |
| 2 | `GET /admin/reports` (501) conform `MonthlyReport` + export CSV/PDF | P1 | Pagina Rapoarte indisponibilă |
| 3 | `POST /admin/schedule/import`, `/import/{id}/confirm`, `POST /admin/schedule/classes` (501) | P1 | Pagina Orar EF indisponibilă |
| 4 | `POST /admin/events` (501), plus `GET /admin/events` (listă) și previzualizare conflicte | P1 | Pagina Evenimente indisponibilă |
| 5 | `POST /admin/announcements` (501), plus `GET /admin/announcements` (istoric) și estimare audiență („ajunge la N utilizatori”) | P1 | Pagina Anunțuri indisponibilă |
| 6 | Check-in administrativ după cod QR: `POST /bookings/{id}/check-in` cere id-ul rezervării, dar `qr_token` nu îl conține. Propunere: `POST /admin/check-in { qr_token }` care întoarce `CheckInResult` | P1 | Pagina Check-in indisponibilă |
| 7 | Înrolare TOTP din interfață: `POST /admin/2fa/setup` (întoarce `secret`, `otpauth_url`) și `POST /admin/2fa/confirm { code }` (422 la cod greșit). Azi doar CLI: `npm run admin:enroll-totp` | P2 | Pagina „Contul meu” indisponibilă |
| 8 | `DELETE /admin/sports/{id}` (409 dacă o resursă folosește sportul) | P2 | Ștergerea sporturilor indisponibilă |
| 9 | Blocări recurente (501 conform README) | P2 | Recurența „zilnic/săptămânal” nu se poate testa |

## B. Câmpuri și rute care limitează pagini existente

| # | Cerere | Prioritate | Efect în front-end acum |
|---|---|---|---|
| 10 | `GET /admin/blocks/preview?resource_id&from&to` – câte rezervări ar fi afectate | P2 | Estimare din `/availability` (max. 14 zile) |
| 11 | `PATCH /admin/blocks/{id}` – editarea unei blocări planificate | P2 | Editarea blocărilor indisponibilă |
| 12 | `Block`: câmpurile `cancelled_bookings_count`, `released_at` și, pentru raportul de livrare, `resource_name`, `cancelled`, `quotas_refunded`, `duration_seconds`; la creare tip `cleaning` și lista canalelor de notificare | P3 | Coloana „Anulate” arată 0 pentru blocările existente; „Curățenie” se trimite ca „Mentenanță”; canalele alese nu se trimit |
| 13 | `AuditEntry`: adaugă `actor_name`; filtru text `q` pe jurnal | P2 | Actorul apare ca id scurt; căutarea se face doar pe pagina curentă |
| 14 | Etichete pentru acțiunile de audit: front-end-ul le cunoaște pe `block.create/delete`, `resource.create/update`, `settings.update`, `sport.create/update`, `user.suspend/auto_suspend/reactivate`. Lipsește `user.delete` (se afișează textul brut) | P3 | – |
| 15 | `User`: `no_shows_this_month` | P3 | Coloana „No-show luna aceasta” arată 0 |
| 16 | `PUT /admin/settings`: să ignore (nu să respingă cu 422) câmpurile doar de citit `updated_by` / `updated_at` | P3 | Front-end-ul nu le mai trimite |
| 17 | `GET /availability` cere `resource` sau `sport` (400 altfel). Documentați în OpenAPI că parametrul `date` singur nu e suficient; opțional, permiteți toate resursele | P3 | Panoul face o cerere pe resursă |
| 18 | Cotă separată per sport (`monthly_quota_per_sport` nevidă dă 422 azi): confirmați când se implementează (D5) | P2 | Comutatorul „per sport” dezactivează valorile |

## C. Decizii de vocabular (de stabilit împreună)

| # | Subiect | Situația |
|---|---|---|
| 19 | **Dotări** | Backend-ul are text liber (`panou`, `fileu tenis`, `fileu volei`, `porți fotbal`, `minge baschet`); front-end-ul avea o listă fixă (`panouri`, `fileu`, `mingi`, `rachete`, `vestiar`, `tribuna`, `porti`). Se va stabili o **listă fixă comună**; apoi se actualizează seed-ul din backend sau lista din front-end. Până atunci formularele arată doar valorile existente pe server |
| 20 | **Sport – `icon`** | Obligatoriu pe server; formularul nu îl are încă (se trimite `sport`). De decis: câmp în formular sau valoare implicită |
| 21 | **Program resursă** | Serverul are program pe zile (`opening_hours`); formularul are un singur interval pentru toate zilele (trimis pe toate cele 7 zile) |
| 22 | **Tip resursă (`type`)** | Obligatoriu la creare; front-end-ul trimite `teren` |
| 23 | **Autentificare admin** | După SSO backend-ul redirecționează la `PWA_URL/auth/2fa?challenge_id=…&return_to=…`; front-end-ul are ruta `/auth/2fa`. Fluxul real SSO + 2FA nu a fost încă testat cap-coadă (în testare s-a folosit tokenul de dezvoltare) |

## D. Rute confirmate și funcționale (testate cu backend-ul real)

`GET /me`, `POST /auth/2fa/verify`, `POST /auth/refresh`, `POST /auth/logout`, `GET /sports`, `POST /admin/sports`, `PUT /admin/sports/{id}`, `GET /resources?include_inactive`, `POST /admin/resources`, `PATCH /admin/resources/{id}`, `GET/POST /admin/blocks`, `DELETE /admin/blocks/{id}`, `GET /admin/blocks/{id}/delivery`, `GET/PUT /admin/settings`, `GET /admin/audit-log`, `GET /admin/users`, `POST /admin/users/{id}/suspend`, `POST /admin/users/{id}/reactivate`, `GET /availability`.
