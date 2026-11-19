# Contractul API folosit de front-end

Front-end-ul admin rulează în două moduri (`src/api/endpoints.ts`):
- **Demo** (`VITE_USE_MOCKS=true`): serverul simulat MSW (`src/mocks/`), contract camelCase, cu rutele „presupuse” din tabelul de mai jos.
- **Backend real** (`VITE_USE_MOCKS=false`): `src/api/real.ts`, contractul din `livrabil05/openapi.yaml` (`snake_case`). Conversia se face în `src/api/mappers.ts`; tipurile serverului sunt în `src/api/backend-types.ts`.

Ce lipsește sau diferă pe backend este listat, cu prioritate, în `docs/BACKEND-CERERI.md`.
Prefix: `/api/v1`. Autentificare: token de acces în memorie (`Authorization: Bearer`) + refresh prin cookie HttpOnly (`POST /auth/refresh` → `{ access_token }`). Erori: `{ code, message_ro, message_en, details? }`. `401` pe o rută diferită de `/auth/*` și `/me` → trimitere la login. Validările eșuate dau **422**.

## Rute confirmate (testate cu backend-ul real)

| Front-end | Backend real | Observații |
|---|---|---|
| sesiune | `GET /me` | întoarce `User`; front-end-ul acceptă doar `role = admin`; `twoFactorVerified` = adevărat (sesiunea de admin se creează doar după TOTP); `expiresAt` din JWT |
| pasul TOTP | `POST /auth/2fa/verify { challenge_id, code }` | `challenge_id` vine în adresa `/auth/2fa?challenge_id=…&return_to=…` după SSO |
| reînnoire / ieșire | `POST /auth/refresh`, `POST /auth/logout` (204) | |
| sporturi | `GET /sports`, `POST /admin/sports`, `PUT /admin/sports/{id}` | `name_ro`, `name_en`, `icon` (implicit `sport`), `required_equipment` |
| resurse | `GET /resources?include_inactive=true`, `POST/PATCH /admin/resources[/{id}]` | program trimis pe toate cele 7 zile; `type` = `teren` |
| blocări | `GET/POST /admin/blocks`, `DELETE /admin/blocks/{id}` (204), `GET /admin/blocks/{id}/delivery` | tip `cleaning` → `maintenance`; statusul (activ/planificat/istoric) se calculează în front-end |
| setări | `GET/PUT /admin/settings` | mapare câmpuri: `quotaMonthly`↔`monthly_quota`, `maxActiveFuture`↔`max_active_bookings`, `windowStudentDays`↔`booking_window_days_student`, `windowTeacherDays`↔`booking_window_days_teacher`, `windowExternalHours`↔`booking_window_hours_external`, `cancelBeforeHours`↔`cancel_free_hours`, `checkinBeforeMin`↔`checkin_minutes_before`, `checkinAfterMin`↔`checkin_minutes_after`, `noShowLimit`↔`no_show_threshold`, `suspensionDays`↔`no_show_suspension_days`, `waitlistOfferMinutes`↔`waitlist_offer_minutes`; câmpurile necunoscute formularului se păstrează la PUT; `updated_by`/`updated_at` nu se trimit |
| audit | `GET /admin/audit-log?actor&from&to&page&page_size` | perioada (24h/7d/30d/12m) → `from`/`to`; acțiunile serverului (`resource.update` …) se convertesc în cele din interfață |
| utilizatori | `GET /admin/users?q&role&status&page&page_size`, `POST .../suspend { until, reason }`, `POST .../reactivate` | „zile” din formular → `until`; administratorii nu se afișează |
| panou | `GET /admin/dashboard` (501) → rezervă `GET /availability?resource=…&date=…` | o cerere pe resursă activă |

## Rute presupuse, încă fără corespondent pe backend (doar în modul demo)

`GET /admin/blocks/preview` (estimat din `/availability`), `PATCH /admin/blocks/{id}`, `POST /admin/schedule/import/preview`, `POST /admin/schedule/classes/preview`, `GET /admin/events`, `POST /admin/events/preview`, `GET /admin/announcements`, `GET /admin/announcements/audience`, `GET /admin/reports?month=&format=`, `DELETE /admin/sports/{id}`, `POST /admin/check-in`, `POST /admin/2fa/setup`, `POST /admin/2fa/confirm`.
În modul backend real acestea răspund cu eroarea „funcționalitate indisponibilă pe server” (`501 NOT_IMPLEMENTED`).

## Decizii

- **D2 – Setări:** închisă. Backend-ul folosește `snake_case`; front-end-ul convertește în `mappers.ts`.
- **D3 – Autentificare:** închisă. Token de acces în memorie + refresh prin cookie HttpOnly (`POST /auth/refresh`, confirmat).
- **D4 – Rute noi:** parțial confirmate (vezi tabelele de mai sus); restul în `BACKEND-CERERI.md`.
- **D5 – Cota „per sport”:** deschisă. Backend-ul respinge `monthly_quota_per_sport` nevid (422) până se schimbă schema.
- **D6 – Sport `icon`:** se trimite `sport` până se decide un câmp în formular.
- **D7 – Program resursă:** un singur interval pe toate cele 7 zile.
- **D8 – Blocare `cleaning`:** se trimite ca `maintenance`.
- **D9 – Panou:** compus din `/availability` până se implementează `/admin/dashboard`.
- **D10 – Dotări:** lista va fi fixă și comună front-end/backend (vezi `BACKEND-CERERI.md`, punctul 19).