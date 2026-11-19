## Osläppt – 2026-11-19: etapp A4b, ordboken laddas lat

- **Startpaketet** gick från 6,3 MB till 2,3 MB komprimerat (26,7 → 12,7 MB rått, 43 → 7 filer). Vid start laddas appen, modulindexet, bildregistret och *uppslagsdelen*: lemma, ordklass, nivå, böjning, glosor, etiketter, taggar och synonymlänkar för varje post (`src/content/lexicon.ts`, byggs vid bygget). Definitioner, exempel och förklaringar laddas per ämnesgrupp när de behövs.
- Sökning, ordlistor, statistik, inlärningsplaner och distraktorer i övningarna går på uppslagsdelen. Inlärnings- och repetitionspass, ordboksbladet, lektionerna och jämförelser väntar på sina ord (`src/ui/app/useSenses.tsx`); ett repetitionskort vars post laddas visas inte längre som "finns inte".
- Hela ordboken laddas i bakgrunden efter start, så offline fungerar som förut. Tester, verktyg och dev-servern laddar allt direkt; produktionsbygget byter laddare med ett alias i `vite.config.ts`.
- Storleksspärr: startpaketet högst 3 MB komprimerat (`npm run bundle:report -- --check`). Tester för lat laddning i `src/content/lazyDictionary.test.ts`.
