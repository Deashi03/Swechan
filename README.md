# Swechan

Swechan är en mobilanpassad webbapp (PWA) för att bygga ett stort svenskt ordförråd, särskilt utformad för en japansktalande användare. Varje dag består av **(A) repetition** av tidigare inlärda ord och **(B) en ny modul** med 15–20 ord i tre steg: lära sig orden → läsa en text → använda orden i samtal (via ChatGPT).

> **Ny AI-session?** Läs [`PROJECT_STATUS.md`](PROJECT_STATUS.md) först, sedan [`ARCHITECTURE.md`](ARCHITECTURE.md).

## Snabbstart

Kräver Node 20+ (testat med Node 22).

```bash
npm install
npm run dev          # utvecklingsserver, öppna adressen som visas
```

| Kommando | Vad det gör |
|---|---|
| `npm run dev` | Utvecklingsserver med hot reload |
| `npm run build` | Typkontroll + produktionsbygge till `dist/` |
| `npm run preview` | Servera `dist/` lokalt |
| `npm test` | Alla enhets-, integrations- och komponenttester (Vitest) |
| `npm run typecheck` | Endast TypeScript-kontroll |
| `npm run validate:content` | Validerar allt innehåll (schema, furigana, referenser, målord i lästexter) |
| `npm run e2e` | End-to-end-test av hela acceptansflödet i Chromium med iPhone-emulering (kör `npm run build` först; kräver att `playwright` finns globalt installerat) |

## Använda appen på iPhone

1. Publicera via GitHub Pages (se nedan) eller annan statisk webbserver med HTTPS.
2. Öppna adressen i **Safari** → Dela-knappen → **Lägg till på hemskärmen**.
3. Appen fungerar då i helskärm och offline efter första laddningen.
4. Uppläsning kräver en svensk röst: *Inställningar → Hjälpmedel → Uppläst innehåll → Röster → Svenska*.
5. All progression sparas lokalt i telefonen. **Exportera säkerhetskopia regelbundet** (Inställningar → Säkerhetskopia) och spara filen t.ex. i iCloud Drive.

## Distribution (GitHub Pages)

Workflowet `.github/workflows/ci.yml` kör typkontroll, tester och bygge på varje push. På grenen `main` publiceras `dist/` till GitHub Pages.
Engångsinställning i GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
Bygget använder relativa sökvägar (`base: './'`) och hash-routing, så det fungerar på vilken undersökväg som helst.

## Teknik

React 19 · TypeScript · Vite · Dexie (IndexedDB) · Zod · ts-fsrs (FSRS-algoritmen) · Vitest + Testing Library · Playwright (e2e). Inga UI-ramverk, ingen backend, inget konto.

## Dokumentation

- [`PROJECT_STATUS.md`](PROJECT_STATUS.md) – vad som är klart, testat, kända problem, nästa steg (överlämning)
- [`ARCHITECTURE.md`](ARCHITECTURE.md) – system, beroenden, arkitekturbeslut
- [`DATA_MODEL.md`](DATA_MODEL.md) – innehållsmodell och användardata
- [`CONTENT_GUIDELINES.md`](CONTENT_GUIDELINES.md) – hur nya moduler och ord produceras och kvalitetssäkras
- [`PEDAGOGY.md`](PEDAGOGY.md) – pedagogiska principer och hur de implementeras
- [`ROADMAP.md`](ROADMAP.md) – planerade faser
- [`CHANGELOG.md`](CHANGELOG.md) – ändringar per version
