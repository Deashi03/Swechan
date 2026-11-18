# Instruktioner för AI-sessioner i Swechan

## Vad du läser
- **Alltid:** `PROJECT_STATUS.md`. Den beskriver nuläget, nästa steg, öppna osäkerheter och regler att komma ihåg.
- **Vid ändringar i kod, datamodell eller lagring:** `ARCHITECTURE.md`.
- **Vid nytt innehåll (moduler, ord, bilder):** `CONTENT_GUIDELINES.md`.
- **Under kvalitetsarbetet:** `docs/QUALITY_PLAN.md`. Ta nästa obockade etapp. Ingen ny modulproduktion förrän planen säger det.
- **Ändringslogg:** en fil per release eller etapp i `changelog/` (läs bara den du behöver). `CHANGELOG.md` är ett arkiv: läs aldrig hela filen.
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
   - Nya moduler har `"standard": 2` och uppfyller kvalitetskontraktet `quality/contract.json` (bild eller animation på varje ord, inventerade betydelser, förklaringar och exempel för svåra ord, daterade fakta).
   - Kör `tools/production/check.sh m.<slug>` eller `npm run audit:content -- --check`: inget kvalitetsmått i `quality/metrics.json` får bli sämre. En avsiktlig försämring kräver `--allow-worse "<mått>: <skäl>"`.
   - `contentVersion` sätts av `npm run content:version`, aldrig för hand.
   - Symbol- och adjektivbilder kräver ett godkänt oberoende blindtest (symboler: matchningstest).
4. Ändrar du lagrade användardata:
   - lägg till en ny `db.version(n)` med `upgrade()`
   - uppdatera `migrateBackup` och `DATA_MODEL.md`
5. Uppdatera `PROJECT_STATUS.md` och skriv en ny fil i `changelog/` (se `changelog/README.md`) efter varje betydelsefull etapp.
6. Användargränssnittet är på svenska. Japanska texter med kanji ska alltid ha furigana via `{漢字|かんじ}`-markering och renderas med `<Ja>`.
7. Katalogen `planning/catalog/swechan-catalog.v1.json` har 344 kategorier och 2 016 **planerade** moduler. Använd den verkliga filen, och syntetisk data bara i isolerade tester.
   - Planerade katalogposter hålls skilda från färdiga `Module`-lektioner.
   - Varje modul har 15–20 ord, och varje menyskärm högst åtta val.
   - Bevara alltid befintliga publicerade `m.*`- och `s.*`-ID:n.
8. Arbetsform för att spara användargränser:
   - Ta en etapp per session. När den är inlagd: uppdatera statusfilen, stanna och be produktägaren starta en ny session.
   - Kör högst tre ämnesgrupper parallellt.
   - Ge varje bild högst två blindtestomgångar. Därefter går ordet till det manuella spåret (`status: "manual"` i planen), aldrig till "ingen bild".
   - Kör rutinsteg med låg ansträngningsnivå.
   - Byt inte till en lättare modell för svensk eller japansk text eller för bilder utan att fråga produktägaren.
