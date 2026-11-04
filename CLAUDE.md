# Instruktioner för AI-sessioner i Swechan

1. Läs `PROJECT_STATUS.md` (överlämning) och `ARCHITECTURE.md` innan du ändrar något.
2. Följ reglerna i `ARCHITECTURE.md` → "Regler för vidareutveckling" (bevara användardata, ingen duplicering av ordposter, konfiguration före hårdkodning, inga knappar utan funktion).
3. Ändringar i repetition, streak, daglig session, datamodell eller backup kräver tester. Kör `npm run typecheck && npm test` före commit; kör `npm run build && npm run e2e` efter UI-ändringar i huvudflödet.
4. Nytt innehåll: följ `CONTENT_GUIDELINES.md` och kör `npm run validate:content`.
5. Ändrar du lagrade användardata: lägg till en ny `db.version(n)` med `upgrade()` och uppdatera `migrateBackup` + `DATA_MODEL.md`.
6. Uppdatera `PROJECT_STATUS.md` och `CHANGELOG.md` efter varje betydelsefull etapp.
7. Användargränssnittet är på svenska; japanska texter med kanji ska alltid ha furigana via `{漢字|かんじ}`-markering och renderas med `<Ja>`.

## Nästa utvecklingsetapp: Swechan 0.4

Inför arbete med 0.4: läs även [`SWECHAN_0_4_CLAUDE_HANDOFF.md`](SWECHAN_0_4_CLAUDE_HANDOFF.md). Där finns en kodbasanpassad fasplan och särskilda regler för katalogen med 2 016 **planerade** moduler, max åtta val per menyskärm, 15–20 ord per publicerad modul, och riskerna kring versionsbunden utvecklingsnollställning. Katalogens fullständiga JSON-filer tillhandahålls separat av produktägaren; rekonstruera dem inte genom gissning. Bevara alltid befintliga publicerade `m.*`- och `s.*`-ID:n.

**Katalog 0.4 finns i GitHub:** [`planning/catalog/swechan-catalog.v1.json`](planning/catalog/swechan-catalog.v1.json) innehåller samtliga **344 kategorier och 2 016 planerade moduler**. Använd den verkliga filen; syntetisk data endast i isolerade tester. Äldre arbetsgrenar hämtar filen från `origin/main`. Schemat för planerade katalogposter måste hållas separat från färdiga `Module`-lektioner. Moduler har 15–20 ord.
