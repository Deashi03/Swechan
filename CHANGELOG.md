# Changelog

## 0.2.0 – 2026-11-04
Fokus: pedagogiskt innehåll som bygger på vad eleven redan kan.

### Tillagt
- **Kontrollerat ordförråd**: grundordförråd (~920 ord, A1–A2) och en automatisk språkkontroll (`npm run validate:content`). Definitioner, exempel, lästexter och frågor får bara använda grundord, ord från förkunskapsmoduler och ord som lärts in tidigare i modulen. Kontrollen hittade 196 problemtexter i 0.1-innehållet; nu 0.
- **Inlärningskedjor**: två nya grundmoduler – *Material och ämnen* (21 ord, före *Atomer och molekyler*) och *Krig och försvar* (21 ord, före *Medeltida slott och belägringar*). *Dagens modul* föreslår bara moduler vars förkunskaper är klara (även för avancerade användare); modulsidan visar vad en modul bygger på.
- **Flera betydelser tydligt**: varje betydelse har en kort etikett (`labelSv`). Ordintroduktionen visar en egen sektion med ordets alla betydelser och vilken som lärs in. *ämne* har nu fem betydelser (substans, skolämne, samtalsämne/tema, material att göra något av, "ämne till").
- Ord i förklaringar, exempel och läsfrågor som finns i ordboken går att trycka på för uppslagning.

### Ändrat
- Allt innehåll omskrivet med enklare förklaringar (svenska och japanska säger samma sak), nya lästexter och frågor. Orden i varje modul ligger i inlärningsordning.
- *ämne*, *bestå* flyttade till *Material och ämnen*; *försvara*, *anfalla*, *vapen* till *Krig och försvar*. Betydelse-ID:n är oförändrade, så befintlig repetitionshistorik påverkas inte. `s.ämne.2` är nu enbart "skolämne" (tema är `s.ämne.3`).

### Rättat
- "Hoppa över" på välkomstsidan skickade tillbaka användaren till välkomstsidan (kapplöpning i onboarding-kontrollen). Täcks nu av e2e-testet.

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
