# Ghid de testare a front-end-ului pe propria mașină

Ghidul pornește de la zero: poți urma pașii și pe un calculator pe care nu ai rulat niciodată proiectul.
Front-end-ul rulează **fără backend**: un server simulat (MSW) răspunde direct în browser, cu date demo.

## 1. Ce îți trebuie

| Program | Versiune | Cum verifici |
|---|---|---|
| Node.js | 20.19 sau mai nou (recomandat 22 LTS) | `node -v` |
| npm | vine cu Node | `npm -v` |
| Un browser modern | Chrome, Edge, Firefox sau Safari 16+ | – |

Node.js se descarcă de la <https://nodejs.org> (varianta LTS). Pe Windows folosește PowerShell sau Terminalul Windows.

## 2. Instalare

1. Dezarhivează `campussport-frontend.zip` într-un dosar la alegere.
2. Deschide un terminal **în acel dosar** (`cd campussport-frontend`).
3. Instalează dependențele (prima dată durează 1–2 minute):
   ```bash
   npm install
   ```
4. Nu e nevoie de alte fișiere de configurare: `.env.development` pornește deja serverul simulat.

## 3. Pornire

```bash
npm run dev
```

Terminalul afișează `Local: http://localhost:5173/`. Deschide adresa în browser, apoi mergi la **<http://localhost:5173/admin>**.

## 4. Autentificare (demo)

1. Apasă **Autentificare cu SSO universitar** (în demo nu se cere parolă).
2. La „Cod de verificare” introdu **123456**.
3. Ajungi în panoul de administrare, ca **Maria Ionescu**.

> **Important:** datele demo și sesiunea trăiesc în memoria paginii. La o reîncărcare (F5) se resetează și trebuie să te autentifici din nou. Navighează între pagini cu meniul din stânga, nu tastând adrese.

## 5. Ce poți verifica, pagină cu pagină

### Panou (FR-43, UI-08)
- Indicatori (rezervări, check-in-uri, neprezentări, ocupare) și grila resurselor pe ore.
- Săgețile de lângă dată schimbă ziua; **Azi** revine la ziua curentă.
- **Blocare de urgență, din 2 acțiuni:** apasă **Blochează** pe un rând → în fereastră vezi câte rezervări se anulează → **Blochează acum**.
  Apar: notificarea de succes, banda „…este blocată de urgență” cu progresul trimiterii („Anunțați X din Y…”), iar rândul devine roșu.
  Din bandă poți **debloca** resursa.

### Resurse (FR-39)
- Selectează o resursă în tabel; editezi în panoul din dreapta.
- **Validare dotări (FR-07):** bifează *Baschet* fără *Panouri* → apare avertismentul și salvarea e blocată.
- **Acces extern:** alege „Doar în fereastra orară” pentru zile și ore.
- **Dezactivează** cere confirmare; resursa inactivă se poate reactiva.
- **Resursă nouă** creează o resursă.

### Orar EF (FR-42)
- **Adaugă manual:** completează cursul, alege zilele și intervalul → **Verifică conflictele** → **Confirmă importul**.
- **Din fișier:** trage un fișier `.csv`/`.xlsx` (max. 5 MB). Orice alt format sau un fișier prea mare este respins cu mesaj.
  Pentru a vedea conflicte, programează un curs pe o resursă și un interval cu rezervări (în grila din *Panou* sunt celulele albastre); tabelul de conflicte listează rezervările care se vor anula.

### Evenimente (FR-44)
- **Eveniment nou** → alege resursele și intervalul. „Conflictele” se actualizează live; la creare, rezervările în conflict se anulează.

### Blocări (FR-40…42)
- Taburi **Active / Planificate / Istoric**.
- **Blocare planificată** (mentenanță sau curățenie, cu repetare opțională), **Editează**, **Anulează**.
- La o blocare de urgență, **Raport** deschide raportul „anunțați / livrați”, care se completează în timp real.

### Anunțuri
- Alege categoria, scrie titlul și mesajul, alege destinatarii și canalele. „Ajunge la N utilizatori” se calculează în avans.
- Fără titlu, mesaj sau canal, **Trimite** afișează erorile.

### Rapoarte (FR-45)
- Schimbă luna cu săgețile; graficul pe ore și ocuparea pe resurse se actualizează.
- **CSV** descarcă un fișier. **PDF** descarcă un PDF de demonstrație.

### Reguli (FR-46)
- Modifică o valoare în afara intervalului (ex. „Cota lunară” = 99) → eroare; salvarea e blocată.
- O valoare corectă activează **Salvează**; modificarea apare apoi în *Jurnal audit*.

### Jurnal audit
- Caută text, filtrează după administrator și perioadă, paginează, exportă CSV.

## 6. Teme, limbă, accesibilitate
- Meniul din colțul stânga-jos (numele tău): **Limbă** (RO/EN) și **Aspect** (Sistem/Luminos/Întunecat).
- Tastatură: `Tab` / `Shift+Tab` parcurg elementele, `Esc` închide ferestrele, `Enter`/`Space` activează butoanele. Primul `Tab` arată „Sari la conținut”.
- Rezoluție de lucru: de la 1366×768 (SYS-02).

## 7. Teste automate

```bash
npm run typecheck   # verificarea tipurilor TypeScript
npm test            # teste unitare + integrare (Vitest, MSW)
npm run build       # build de producție
npm run build:demo  # build static cu serverul simulat inclus (se poate publica oriunde)
npm run preview     # servește build-ul local, la http://localhost:4173
```

Testele acoperă validările (resurse, reguli, anunțuri), exportul CSV, paritatea traducerilor RO/EN (fiecare cheie folosită în cod există în ambele limbi), fluxul de blocare de urgență și autentificarea în 2 pași.

## 8. Conectarea la backend-ul real

1. Copiază `.env.example` în `.env.local` și setează `VITE_USE_MOCKS=false`.
2. Setează `VITE_API_PROXY_TARGET` la adresa serverului NestJS (implicit `http://localhost:3000`).
3. Repornește `npm run dev`. Cererile către `/api/v1/...` trec prin proxy.
4. Rutele „presupuse” (neprecizate în SDD) sunt în `docs/API-ASSUMPTIONS.md` și trebuie confirmate cu echipa de backend.

## 9. Probleme frecvente

| Simptom | Cauză / soluție |
|---|---|
| `npm install` dă erori de versiune | Actualizează Node.js la 20.19+ (`node -v`). |
| Portul 5173 e ocupat | Pornește cu `npm run dev -- --port 5174`. |
| Pagina e goală și consola arată `mockServiceWorker.js` | Rulează din rădăcina proiectului; fișierul e în `public/`. În Firefox privat, service worker-ul poate fi blocat: folosește o fereastră normală. |
| Te întoarce mereu la login | Normal după F5 (sesiunea demo e în memorie). Autentifică-te din nou. |
| Fonturile arată diferit | Inter se încarcă din pachet, nu de pe internet; golește cache-ul browserului. |
