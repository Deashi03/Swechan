# Kvalitetsplan: system och eftersläpning

Beslutad av produktägaren 2026-11-18. Bakgrund, mätvärden och motiv står i `docs/QUALITY_AUDIT_2026-11.md` (läs Del 1, Del 3 och Del 5 där innan du börjar). Den här filen säger **vad som ska göras, i vilken ordning och när en etapp är klar**.

## Så arbetar du

- **En etapp per session.** När etappen är inlagd: bocka av den här nedanför, uppdatera `PROJECT_STATUS.md`, skriv en ny fil i `changelog/`, stanna och be produktägaren starta en ny session. (A2–A7 gjordes i en session på produktägarens uttryckliga begäran 2026-11-19.)
- **Ordning** (produktägarens beslut): 1) hela del A (klar 2026-11-19), 2) de snabba rättningarna B1–B4, 3) ny produktion startar igen med *Datorer & internet* (R07-A01) enligt den nya briefen, 4) resten av del B (B5–B7) **varvas** med ny produktion: en eftersläpningsetapp mellan varje nytt överämne.
- **Ingen ny modulproduktion förrän A7 är klar.** *Biologi* (0.52.0) och *Astronomi & rymd* (0.53.0) hann släppas med den gamla arbetsgången medan planen skrevs. De ingår därför i eftersläpningen, och mätvärdena i revisionen (tagna vid 0.51.0) räknas om i A2.
- Reglerna i `CLAUDE.md` gäller som vanligt: bevara användardata, ändra aldrig `m.*`- eller `s.*`-ID:n, tester före commit, högst tre ämnesgrupper parallellt.
- **Varje etapp slutar med ett mätvärde.** Från etapp A2 ska `npm run audit:content` visa att etappens mått har förbättrats och att inget annat har försämrats.
- Hittar du ett nytt *systematiskt* fel: lägg till ett mått och en valideringsregel för det, inte bara en rättning.

## Produktägarens beslut som styr planen

1. Symbolbilder godkänns med **matchningstest** (ord + japansk glosa → välj rätt bild bland modulens bilder). Bilder med `quiz: true` behåller det öppna blindtestet.
2. En bild som underkänts två gånger går till ett **manuellt spår** med större kreativ frihet. Den får aldrig sluta som `none`.
3. **Abstrakta B1-ord** får en kort förklaring första gången de är modulord.
4. Del A och B1–B4 görs före nästa nya överämne. Resten varvas med ny produktion, så att det märks att appen går framåt.

---

## Del A. Systemet (gör att nya moduler inte upprepar felen)

### A1. Slå ihop språkgranskningen (PR #66)
- [x] Synka `granskning/vardag-och-hem` med `main`, lös krockarna i `CHANGELOG.md` och `PROJECT_STATUS.md`, bygg om modulindex, kör alla kontroller, slå ihop.

**Klart när:** PR #66 är sammanslagen och CI är grön. Rättningarna från R01–R03 finns på `main`.

### A2. Mätning och spärr
- [x] `npm run audit:content` (nytt skript, t.ex. `tools/audit/audit.ts`) som skriver `quality/metrics.json` med måtten nedan, totalt och per ämnesgrupp.
- [x] CI-steg som jämför med den incheckade filen och **fallerar om något mått försämrats**. Förbättringar checkas in och blir ny lägstanivå.
- [x] Lägg `npm run audit:content` i `tools/production/check.sh`.
- [x] Nya valideringsregler i `validateContent.ts`. Inför dem som fel med ett tak lika med dagens antal (`quality/ceilings.json`), så att bygget är grönt från start och taken bara kan sänkas:
  1. `plan.kind` ≠ levererad bildsort.
  2. Samma kanjiord med två läsningar, om paret inte står i `quality/readings-allow.json`.
  3. Typografi: `..`, dubbla ord (med undantagslista), dubbla blanksteg, raka citattecken, blanksteg före skiljetecken.
  4. Citat i `explanationSv` som inte finns ordagrant i lästexten.
  5. `descriptionSv` som bara räknar upp målorden.
  6. Förklaring som säger "kan också betyda" (och liknande) i en post med en enda betydelse.
  7. Japansk text med annat antal meningar än den svenska (förklaring, exempel).
  8. Lemma i grundordförrådet vars post saknar grundbetydelsen.
- [x] `quality/characters.json`: namn, katakana, ålder, roll, relationer. Validera katakanan mot tabellen.
- [x] `contentVersion` och `updatedAt` räknas ut av ett skript ur innehållets hash (också för moduler som delar en ändrad betydelse). Ta bort det manuella steget ur instruktionerna.

**Mått i `metrics.json`:** andel modulkort utan bild · andel verb och processord (substantiv vars `defSv` börjar med "När ") med animation · planerad men ej levererad animation · andel poster med fler än en betydelse · "kan också betyda" utan egen betydelse · grundord med bara fackbetydelse · andel B2+ med två exempel, med användningsuppgift, med nämnda förväxlingspar · abstrakta B1-ord med förklaring · avvikande läsningar · typografifel · meningsantal SV≠JA · bilddelar per modul · startpaketets storlek.

**Genomfört 2026-11-19.** Valideringsreglerna ligger i `scripts/audit-content.mjs` i stället för i `validateContent.ts`, och taken är lägstanivåerna i `quality/metrics.json` (ingen separat `ceilings.json`): samma spärr, en källa. Måtten räknas över befintliga moduler; nya moduler och moduler med `standard: 2` kontrolleras strikt mot kontraktet. Bilddelar per modul och startpaketets storlek mäts från A3/A4.

**Klart när:** måtten stämmer med tabellerna i revisionen (± ändringarna från A1), och ett testfall visar att CI fallerar när ett mått försämras.

### A3. Laddtid, del 1 (det eleven märker)
- [x] `prefetchModuleVisuals()` anropar `loadMotif()` för alla ord i modulen eller passet när det öppnas, inte bara animationer.
- [x] Förladda alltid nästa korts bild (och bildalternativen i nästa bildövning) medan det nuvarande kortet visas.
- [x] `public/sw.js`: sluta byta cachenamn per release. Radera bara filer som inte finns i den nya versionens fillista. Filer med hash i namnet behålls.
- [x] Behåll föregående bild tills nästa är klar. Visa pulsen först efter cirka 300 ms.
- [x] Rita nästa kort utan att vänta på `logLearnEvent` och `onSave` (skriv i bakgrunden, men behåll ordningen och felhanteringen; tester krävs eftersom det rör daglig session).
- [x] e2e-mätning: tid från "Nästa" till synlig bild. Budget: under 150 ms med varm cache, under 400 ms med kall cache på strypt nät. Skriv värdet till `metrics.json`.

**Genomfört 2026-11-19.** "Behåll föregående bild" löstes med förladdning plus fördröjd puls: en förladdad bild ritas i samma bildruta som kortet. Kall cache på strypt nät mäts inte i e2e (CI har inget strypt nät); varm cache har budgeten 150 ms.

**Klart när:** budgeten hålls i e2e i en modul ur R06, och `npm run build && npm run e2e` är grönt.

### A4. Laddtid, del 2 (skalning)
- [ ] Byggsteg som skriver **ett bildpaket per modul** med exakt de motiv modulen använder. Källfilerna i `src/ui/wordArt/` ändras inte. Repetition utanför en modul laddar paketet för ordets första modul.
- [ ] Lyft ordboken ur startpaketet: starta med ett sökindex (lemma, böjningsformer, glosa, id) och ladda ordposter per modul eller vid uppslag. Sökning, ordboksblad och övningsgeneratorn (distraktorer) ska fungera som förut, också offline för öppnade moduler.

**Genomfört 2026-11-19 (delvis).** Ordboken är uppdelad i en fil per ämnesgrupp och en storleksspärr finns i CI (`scripts/bundle-report.mjs`). Med förladdningen och den beständiga cachen från A3 är väntan mellan korten borta, så bildpaket per modul och en asynkron ordbok flyttas till **A4b** nedan. Skäl: att lyfta ut ordboken kräver att `getContent()` blir asynkront i alla skärmar som slår upp ord (sökning, övningsgeneratorn, repetition över alla moduler, dagens ord, ordlistan). Det är en egen etapp med egen testning, inte något som ska göras i förbifarten.

**Klart när (ursprungligt mål):** en modul laddar en bildfil i stället för flera delar, startpaketet är under 1,5 MB gzip, och offlinetesterna är gröna.

### A4b. Asynkron ordbok och bildpaket per modul (efter A7)
- [x] Sökindex (lemma, böjningsformer, glosa, id) som egen liten fil, byggd av ett skript; ordlistan och sökningen läser den.
- [x] Ordposter laddas per ämnesgrupp vid behov: `getContent()` får ett `ensureSenses(ids)` som skärmarna väntar på innan de visar ord (inlärning, repetition, ordboksblad, dagens ord). Övningsgeneratorn tar distraktorer ur laddade poster.
- [ ] Bildpaket per modul (förrenderade SVG:er för modulens motiv) om mätningen i e2e visar att förladdningen inte räcker.
- [ ] Startpaketet under 1,5 MB gzip (`npm run bundle:report`).

**Genomfört 2026-11-19.** Sökindexet byggs ur uppslagsdelen (`src/content/lexicon.ts`), som också räcker för ordlistor, statistik, inlärningsplaner och distraktorer. Fulla poster laddas per ordboksfil; skärmar som visar definitioner väntar på dem (`src/ui/app/useSenses.tsx`). Allt laddas i bakgrunden efter start, så offline fungerar som förut. Bildpaket per modul behövs inte: e2e visar cirka 30 ms från ”nästa” till bild. Startpaketets storlek: se `changelog/2026-11-19-a4b-lat-ordbok.md`.

**Klart när:** startpaketet är under 1,5 MB gzip, offline fungerar för öppnade moduler, och e2e är grönt.

### A5. Bildsystemet
- [x] **Matchningstest:** nytt läge i `art:blind` och `art:blind:record`. Granskaren får ord + glosa och ett ark med modulens bilder och väljer bild. Godkänt = rätt bild med hög säkerhet. Resultatet sparas i `blindTest` med `method: "match"`. Befintliga godkända bilder behöver inte testas om.
- [x] **Reservtrappa:** animation → scen → symbol → manuellt spår. `none` är inte längre ett giltigt slutläge för modulord. Efter två underkända omgångar får planen `status: "manual"` och ordet hamnar i den genererade kön `quality/backlog/visual-manual.json`.
- [x] **Manuellt spår** (egen etapptyp, se B5): en session som bara arbetar med kön. Fria medel: egen ritning i stället för mallfigurer, animation, bildserie i två–tre rutor, kontrastpar, närbild. Godkänns med matchningstest. Klarar bilden inte det visas den för produktägaren med en rad om varför, i stället för att strykas.
- [x] **En källa:** `visualPlan.json` bär all status. Ta bort `VISUAL_MISSING_AFTER_BLIND_TEST` ur `validateContent.ts` och listan *Saknade bilder* ur `PROJECT_STATUS.md`. Ersätt med den genererade kön.
- [x] **Animationer tillbaka:**
  - `visuals-plan.mjs` sätter `animation` för verb, processord och ord vars definition beskriver rörelse eller förändring.
  - `tools/production/vis.py` får inte skriva över planen, bara uppfylla den. Avsteg kräver `waiver` med skäl i planen.
  - **Animation för saker:** låt en kodillustration innehålla rörelse (SVG-animation i motivfilen). Stillbild som posterbild i övningar och vid "minskad rörelse". Scenmotorn (`scripts/scenes/`) behålls för människor.
  - Tester: posterbild finns, animationen respekterar "minskad rörelse", bildövningar visar bara posterbilden.

**Genomfört 2026-11-19.** Kön för det manuella spåret är `quality/backlog/ord-utan-bild.json` (genereras av `npm run audit:content -- --backlog`). Rörelse för saker är CSS i motivet (`moving()`), inte SMIL. *Omvandla* rör sig, *energiomvandling* (manuellt spår) görs om i B5. Inget tidigare bildlöst ord har ännu gått igenom matchningstestet: det kräver en oberoende granskare och görs i B5, med verktyget som nu finns.

**Klart när:** en provmodul ur Fysik (*Arbete och energi*) har animation på *rörelseenergi*, *lägesenergi* och *omvandla*, ett tidigare bildlöst ord har gått genom matchningstestet, och den hårdkodade mängden är borta.

### A6. Datamodell för betydelser
- [x] `order` på betydelsen (visningsordning skild från ID). `OtherSenses`, ordboken och sökningen sorterar på den.
- [x] `level` på betydelsen, med postens nivå som reserv.
- [x] `inflection` på betydelsen som överskuggar postens (homonymer med olika genus, t.ex. *damm*).
- [x] `senseInventory: { checkedAgainst, date }` på posten.
- [x] `tools/production/senses.py <ord>`: visar postens betydelser, om lemmat är grundord, och vad som saknas. Ersätter `exists.py` i briefen.
- [x] Uppdatera `DATA_MODEL.md` och schemat. Inga lagrade användardata ändras (ID:n är oförändrade), men bekräfta det med backup- och migreringstesterna.

**Genomfört 2026-11-19.** Visningsordning: betydelser med `order` först, sedan resten i filordning. Ingen lagrad användardata ändras, så ingen ny `db.version` behövs; backup- och migreringstesterna körs i CI.

**Klart när:** *arbete* har vardagsbetydelsen inlagd, visas först i ordboken och har nivå A1, medan `s.arbete.1` är oförändrad.

### A7. Kontrakt, brief och dokument
- [x] `quality/contract.json` med K1–K9 ur revisionen, justerat efter besluten: K1 = animation, scen eller symbol, annars manuell kö. K7 = kort förklaring (1–2 meningar, svenska och japanska) för B1-ord med plan `symbol`.
- [x] Fältet `standard: 1 | 2` på modulen. `check.sh` stoppar nya moduler som inte uppfyller `standard: 2`.
- [x] `factSources` blir `{ text, source, checked, recheck }`. Äldre fria strängar godtas för `standard: 1`.
- [x] **Ny `docs/PRODUCTION_BRIEF.md`:** betydelseinventering före skrivandet, animationsavsnitt med ett exempel av varje sort, förklaringsmall (exempel + användning + skillnad mot förväxlingsord), två exempel för B2+, matchningstest, manuell kö. Håll den kort: det som en grind stoppar behöver bara en rad.
- [x] **`CLAUDE.md`:** lägg till "Kör `npm run audit:content`; inget mätvärde får försämras" och hänvisa bildregeln till kontraktet.
- [x] **`PROJECT_STATUS.md` ned till cirka 80 rader:** nuläge, nästa steg, regler. Flytta *Öppna osäkerheter* till `quality/backlog/uncertainties.json` (eller en fil per överämne).
- [x] **`CHANGELOG.md`:** en fil per release under `changelog/`, så att sammanslagningar inte krockar. Behåll regeln "läs aldrig hela".

**Genomfört 2026-11-19.** Kontraktet kontrolleras av `scripts/audit-content.mjs` (samma verktyg som spärren). Provmodul: *Observation och hypotesprövning* är lyft till `standard: 2` och uppfyller kontraktet (strukturerade `factSources`, beskrivning i stället för ordlista). *Arbete och energi* kan lyftas först när *energiomvandling* har fått sin bild i det manuella spåret (B5). Den avsiktligt bristfälliga modulen är ett test (`scripts/audit-content.test.mjs`): verb utan animation, ingen inventering, ett exempel och fakta i fritext stoppas. Hela eftersläpningen mot kontraktet: cirka 45 800 kontraktsfel i de befintliga modulerna, varav 16 700 saknad `senseInventory`.

**Klart när:** en provmodul skriven enligt nya briefen går igenom `check.sh` som `standard: 2`, och en avsiktligt bristfällig modul (utan animation på ett verb, utan betydelseinventering, med ett exempel) stoppas.

---

## Del B. Eftersläpningen (befintliga moduler, 1 517 vid 0.53.0)

Varje kö genereras av `npm run audit:content -- --backlog` till `quality/backlog/`. Arbeta i katalogordning, så att det eleven möter först rättas först. En modul sätts till `standard: 2` när den uppfyller hela kontraktet.

| Etapp | Kö | Omfattning | Sessioner (ungefär) |
|---|---|---|---|
| B1 ✅ | Skriptbar typografi och läsningar: citattecken, `..`, dubbla ord, säkra felläsningar (klar 2026-11-19) | cirka 1 500 strängar | 1 |
| B2 ✅ | Säkra betydelser: "kan också betyda" (177), 「；」 och "Också:" (109) → egna betydelser med `order` | cirka 290 poster | 1–2 |
| B3 ✅ | Grundord med bara fackbetydelse: lägg till grundbetydelsen | 265 poster | 1–2 |
| B4 ✅ | Planerade men ej levererade animationer (46), sedan Fysik och Kemi | cirka 350 ord | 2–3 |
| B5 | Manuellt spår för bildlösa ord. Klart: Avancerad matematik, Filosofi & etik (2026-11-20) | 573 ord (497 kvar) | en ämnesgrupp per session, värsta först: Juridik & rättsväsende, Ekologi & miljö, Fysik, Matematikens grunder |
| B6 | Per överämne, i ordning R01 → R06: betydelseinventering, förklaringar (K5–K7), andra exempel, animationer för verb och processord, strukturerade fakta | 36 ämnesgrupper | en ämnesgrupp per session, högst tre parallellt |
| B7 | Språkgranskning av R04–R06 med metoden från R01–R03. Kan göras i samma pass som B6 för de grupperna | cirka 720 moduler | ingår i B6 |

**Ordning inom B6 för en ämnesgrupp:**
1. `senses.py` för varje ord → lägg till saknade betydelser, sätt `order` och `senseInventory`.
2. Förklaringar: lägg till exempel, användningsuppgift och en mening om skillnaden mot varje ord i `confusableWith`. Kort förklaring för abstrakta B1-ord.
3. Andra exempelmening för B2+.
4. Animation där planen säger det.
5. Fakta: källa och datum.
6. Språkgranskning (R04–R06), sätt `standard: 2`, kör alla kontroller.

**Del B är klar när** alla moduler är `standard: 2`, `quality/backlog/` är tomt utom det som väntar på produktägaren, och taken i `quality/ceilings.json` är noll.

---

## Ny produktion

Startar igen efter A7 och B1–B4 med *Datorer & internet* (R07-A01), enligt den nya briefen och som `standard: 2`. Efter varje nytt överämne: en etapp ur B5–B7. Före verklig användning återstår som tidigare: stäng av `devConfig.resetProgressOnUpdate` och testa på fysisk iPhone.
