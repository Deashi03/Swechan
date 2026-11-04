# Instruktioner för AI-sessioner i Swechan

1. Läs `PROJECT_STATUS.md` (överlämning) och `ARCHITECTURE.md` innan du ändrar något.
2. Följ reglerna i `ARCHITECTURE.md` → "Regler för vidareutveckling" (bevara användardata, ingen duplicering av ordposter, konfiguration före hårdkodning, inga knappar utan funktion).
3. Ändringar i repetition, streak, daglig session, datamodell eller backup kräver tester. Kör `npm run typecheck && npm test` före commit; kör `npm run build && npm run e2e` efter UI-ändringar i huvudflödet.
4. Nytt innehåll: följ `CONTENT_GUIDELINES.md` och kör `npm run validate:content`.
5. Ändrar du lagrade användardata: lägg till en ny `db.version(n)` med `upgrade()` och uppdatera `migrateBackup` + `DATA_MODEL.md`.
6. Uppdatera `PROJECT_STATUS.md` och `CHANGELOG.md` efter varje betydelsefull etapp.
7. Användargränssnittet är på svenska; japanska texter med kanji ska alltid ha furigana via `{漢字|かんじ}`-markering och renderas med `<Ja>`.
