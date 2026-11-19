# Ghid: testarea front-end + backend împreună

Verificat pe Windows (PowerShell), Node 24 la backend, Docker Desktop pornit.
Front-end: `CampusSport-Frontend` · Backend: `CampusSport` (folderul `backend/`).

## 1. Pornește backend-ul (o singură dată pe zi)

În `backend/`:

1. `cp .env.example .env` (doar prima dată) și completează în `.env`:
   ```
   DB_USER=campussport
   DB_PASSWORD=campussport
   JWT_ACCESS_TTL_SECONDS=86400
   ```
   `DB_*` sunt valorile din `docker-compose.yml`. Ultima linie face ca tokenul de test să țină 24 h, nu 15 minute. `.env` nu se commit-uiește.
2. Servicii: `docker compose up -d postgres redis keycloak mailpit`.
   - **Ai deja PostgreSQL instalat pe Windows (portul 5432 ocupat)?** Nu porni containerul `postgres`. În pgAdmin rulează o singură dată
     `CREATE USER campussport WITH PASSWORD 'campussport' SUPERUSER;` și `CREATE DATABASE campussport OWNER campussport;`, apoi
     `docker compose up -d redis keycloak mailpit`.
3. Prima dată: `npm install`, apoi `npm run db:setup` (migrări + date de test).
4. `npm run start:dev` – lasă terminalul deschis. Verifică http://localhost:3000/api/docs.

## 2. Tokenul de administrator (terminal nou, în `backend/`)

```powershell
npm run dev:token -- admin
```
Copiază JWT-ul. În PowerShell folosește `curl.exe`, nu `curl`:
```powershell
curl.exe -s http://localhost:3000/api/v1/admin/settings -H "Authorization: Bearer <JWT>"
```

## 3. Pornește front-end-ul

În rădăcina front-end-ului, fișierul `.env.development.local` (nu se commit-uiește):
```
VITE_USE_MOCKS=false
VITE_API_PROXY_TARGET=http://localhost:3000
VITE_DEV_TOKEN=<JWT>
```
Apoi `npm run dev` și deschide http://localhost:5173/admin.
Pentru modul demo (fără backend) pune `VITE_USE_MOCKS=true` sau șterge fișierul.

**Flux real SSO + 2FA** (în loc de token): șterge linia `VITE_DEV_TOKEN`, repornește `npm run dev`, intră la `/admin/login` → SSO (`admin1` / `parola123`). Prima dată vei vedea „Autentificator neconfigurat”; rulează în `backend/`:
`npm run admin:enroll-totp -- admin1@campussport.example`, adaugă URI-ul afișat într-o aplicație de autentificare, apoi repetă autentificarea și introdu codul din 6 cifre.

## 4. Ce verifici (DevTools → Network, „Keep log” bifat)

| Pagină | Acțiune | Rezultat așteptat |
|---|---|---|
| Reguli | Schimbă o valoare, Salvează, F5 | `PUT /admin/settings` `200`; valoarea rămâne |
| Sporturi | Creează, editează | `POST` `201`, `PUT` `200` |
| Resurse | Creează, editează, dezactivează/activează | `POST` `201`, `PATCH` `200` |
| Utilizatori | Caută, filtrează, suspendă, reactivează | `200` |
| Jurnal audit | Perioadă, paginare | `GET /admin/audit-log` `200`, etichete în română |
| Blocări | Planificată, deblocare | `POST` `201`, `DELETE` `204` |
| Panou | Deschide; blocare de urgență, deblocare | `dashboard` `501`, apoi `availability?resource=…` `200`; bannerul de urgență cu raportul de livrare |

### Normal să nu funcționeze încă (vezi `docs/BACKEND-CERERI.md`)
Orar EF, Evenimente, Anunțuri, Rapoarte, Check-in și configurarea 2FA din „Contul meu” răspund cu mesajul „Funcționalitate indisponibilă pe server”. Ștergerea sporturilor la fel. Indicatorii check-in / neprezentări din Panou arată 0.

## 5. Depanare

| Simptom | Cauză și remediu |
|---|---|
| `Missing required environment variable DB_USER` | Completează `DB_USER` și `DB_PASSWORD` în `backend/.env` |
| `password authentication failed for user "campussport"` | Portul 5432 e ocupat de alt PostgreSQL. Creează utilizatorul și baza acolo (pasul 1.2) sau oprește serviciul Windows |
| `localhost:3000` refuză conexiunea | Backend-ul nu rulează: `npm run start:dev` în `backend/` |
| `401` peste tot în pagini | Tokenul a expirat: ia altul (`npm run dev:token -- admin`), pune-l în `VITE_DEV_TOKEN`, repornește `npm run dev` |
| `422` la salvare | Backend-ul respinge câmpuri nevalide sau în plus: deschide cererea în Network → Response, citește câmpul din `details` |
| `400` la `availability` | Cere `resource` sau `sport` (front-end-ul le trimite) |
| Redirect greșit după SSO | `PWA_URL=http://localhost:5173` în `backend/.env` |
| `totp_not_enrolled` | Rulează `npm run admin:enroll-totp -- <email>` |
| Poză roșie `…jpg failed` în Network | Imagini de test cu domeniu inexistent: ignoră |
| Modificările din `.env.development.local` nu se văd | Repornește `npm run dev` |

## 6. Teste automate

Front-end: `npm run typecheck`, `npm test` (inclusiv `src/test/backend.contract.test.ts`, contractul cu backend-ul), `npm run build`, `npm run build:demo`.
Backend: în `backend/`, `npm test` și `npm run spec:check` (conformitatea cu `livrabil05/openapi.yaml`).
