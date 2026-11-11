# Instruktioner för AI-sessioner i Swechan

## Vad du läser
- **Alltid:** `PROJECT_STATUS.md`. Den beskriver nuläget, nästa steg, öppna osäkerheter och regler att komma ihåg.
- **Vid ändringar i kod, datamodell eller lagring:** `ARCHITECTURE.md`.
- **Vid nytt innehåll (moduler, ord, bilder):** `CONTENT_GUIDELINES.md`.
- **`CHANGELOG.md`:** läs aldrig hela filen. Lägg bara till nytt överst.
- **Agenter som skriver moduler och bilder:** läs bara `docs/PRODUCTION_BRIEF.md` och filerna för din egen ämnesgrupp.

## Regler
1. Följ "Regler för vidareutveckling" i `ARCHITECTURE.md`:
   - bevara användardata
   - ingen duplicering av ordposter
   - konfiguration före hårdkodning
   - inga knappar utan funktion
2. Ändringar i repetition, streak, daglig session, datamodell eller backup kräver tester.
   - Kör `npm run typecheck && npm test` före commit.
   - Kör `npm run build && npm run e2e` efter UI-ändringar i huvudflödet.
3. Nytt innehåll: följ `CONTENT_GUIDELINES.md` och kör `npm run validate:content`.
   - Varje modulord ska ha bild, animation eller symbol.
   - Symbol- och adjektivbilder kräver ett godkänt oberoende blindtest.
4. Ändrar du lagrade användardata:
   - lägg till en ny `db.version(n)` med `upgrade()`
   - uppdatera `migrateBackup` och `DATA_MODEL.md`
5. Uppdatera `PROJECT_STATUS.md` och lägg till överst i `CHANGELOG.md` efter varje betydelsefull etapp.
6. Användargränssnittet är på svenska. Japanska texter med kanji ska alltid ha furigana via `{漢字|かんじ}`-markering och renderas med `<Ja>`.
7. Katalogen `planning/catalog/swechan-catalog.v1.json` har 344 kategorier och 2 016 **planerade** moduler. Använd den verkliga filen, och syntetisk data bara i isolerade tester.
   - Planerade katalogposter hålls skilda från färdiga `Module`-lektioner.
   - Varje modul har 15–20 ord, och varje menyskärm högst åtta val.
   - Bevara alltid befintliga publicerade `m.*`- och `s.*`-ID:n.
8. Arbetsform för att spara användargränser:
   - Ta en etapp per session. När den är inlagd: uppdatera statusfilen, stanna och be produktägaren starta en ny session.
   - Kör högst tre ämnesgrupper parallellt.
   - Ge varje bild högst två blindtestomgångar.
   - Kör rutinsteg med låg ansträngningsnivå.
   - Byt inte till en lättare modell för svensk eller japansk text eller för bilder utan att fråga produktägaren.
