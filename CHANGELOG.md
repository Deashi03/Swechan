# Changelog

## 0.1.0 – 2026-11-04
Första versionen.

### Tillagt
- Projektgrund: React 19 + TypeScript + Vite, PWA (manifest, service worker, ikoner), GitHub Actions för test och GitHub Pages.
- Content System: Zod-scheman, furigana-markering med validering, böjningstabeller per ordklass, kategoriträd, återanvändbara grammatiknoteringar, synonymjämförelser, innehållsvalidator (`npm run validate:content`).
- Innehåll: 3 moduler (Hemmet och vardagliga aktiviteter, Atomer och molekyler, Medeltida slott och belägringar), 77 ordposter med 86 betydelser, 4 jämförelser, 8 grammatiknoteringar, 15 nivåtestfrågor.
- Learning Engine: 6 övningstyper (betydelse, omvänd, kontext, synonymnyans, stavning, böjning), svarskontroll med strikt å/ä/ö, flerstegsåterkoppling, steg-1-plan i batchar, kunskapsnivåer, svåra ord, sammanblandade ord, nivåtest.
- Repetition Engine: FSRS (ts-fsrs) bakom utbytbart gränssnitt, separata kort per betydelse och dimension, urval med prioritering och spridning, repetitionsskuld och extrarepetition.
- Daily Session System, Streak System (freezes, kalender, tidszons-/sommartidssäkert), modulprogression med paus/återupptagning.
- Dictionary System: sökning på svenska, böjningsformer, japanska, kanji och kana; global sökning; textsegmentering för interaktiv läsning; ordbok som bottom sheet under övningar.
- Conversation System: automatiskt genererad ChatGPT-prompt + adapter.
- Talsyntes via Web Speech API (endast om svensk röst finns).
- Sparade ord och inlärning av egna ord utanför moduler.
- Statistik, inställningar, export/import med validering och återställningspunkt.
- Händelsebuss och platshållaravatar med reaktioner; stöd för reducerad rörelse.
- Tester: 79 Vitest-tester + e2e-acceptanstest (Playwright).
