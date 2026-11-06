# Arkitektur

Swechan är en **local-first, statisk PWA**. All logik körs i webbläsaren, allt innehåll levereras med appen som validerad JSON, och användardata lagras i IndexedDB. Det finns ingen server och inget konto i v0.1.

## Teknikval (och varför)

| Val | Motivering |
|---|---|
| React 19 + TypeScript + Vite | Specens rekommendation; snabb utveckling, starka typer, statiskt bygge. |
| Egen hash-router (`src/ui/app/router.ts`, ~80 rader) | Fungerar på GitHub Pages utan server-rewrites; undviker ett beroende. |
| Vanlig CSS med designtokens (CSS-variabler) | Tailwind gav ingen tydlig förenkling; alla färger/avstånd/rundningar finns i `src/ui/styles/tokens.css`. |
| Dexie 4 (IndexedDB) | Välunderhållen, transaktioner, schemaversioner med migreringar, `useLiveQuery` för reaktiv UI. |
| Zod 3 | Runtime-validering av innehåll och importerade säkerhetskopior. |
| ts-fsrs 5 | Etablerad, välunderhållen FSRS-implementation (MIT). Ingen egen minnesalgoritm. |
| Vitest + Testing Library + fake-indexeddb | Tester av logik, tjänster mot riktig IndexedDB-emulering och komponenter. |
| Playwright (globalt installerad) | E2E-test av acceptansflödet (`scripts/e2e-smoke.mjs`). |

## System och kataloger

```
src/
  config/appConfig.ts     Konfiguration: streak-regler, sessionsstorlek, FSRS-parametrar, länkar
  lib/                    date (studiedatum/tidszoner), random (seedad PRNG), clock (injicerbar "nu")
  content/                CONTENT SYSTEM
    data/                   ← allt undervisningsinnehåll (JSON)
    schema.ts               Zod-scheman = innehållsformatet
    repository.ts           laddning, validering, index (getContent())
    furigana.ts             {漢字|かんじ}-markering, parsning, kvalitetskontroll
    morphology.ts           böjningsformer från lagrade tabeller, tokenisering
    validateContent.ts      utvecklarverktyg: kvalitetskontroller
    vocabularyCheck.ts      kontrollerat ordförråd (grundord + förkunskaper + inlärningsordning)
  dictionary/             DICTIONARY SYSTEM: sökindex, global sökning, textsegmentering
  learning/               LEARNING ENGINE
    exercises/              övningstyper: generatorer + standardiserat resultatformat
    answerCheck.ts          svarskontroll (å/ä/ö strikt, blanksteg/versaler tillåtna)
    learnPlan.ts            steg 1-plan, framsteg, vilka kunskapsdimensioner ett ord får
    knowledge.ts            kunskapsnivåer, svåra ord, sammanblandade ord
    placement.ts            nivåtestets poängsättning
  repetition/             REPETITION ENGINE
    scheduler.ts            utbytbart Scheduler-gränssnitt
    fsrsScheduler.ts        FSRS-implementation (ts-fsrs)
    selection.ts            urval för daglig repetition (ren funktion)
    reviewService.ts        kort skapas/uppdateras, händelselogg
  daily/                  DAILY SESSION SYSTEM (dagens plan, avslut, repetitionsskuld)
  streak/                 STREAK SYSTEM (ren logik + tunn lagringstjänst)
  modules/                modulprogression (3 steg) och personliga ord
  conversation/           CONVERSATION SYSTEM: promptgenerator + provider-adapter
  audio/                  talsyntes bakom SpeechService-gränssnitt
  feedback/               FEEDBACK SYSTEM: händelsebuss (answer_correct, streak_increased …)
  stats/                  statistik härledd ur användardata
  storage/                Dexie-databas, inställningar, typer, backup (export/import)
  ui/                     UI SYSTEM: app (router, hooks), components, dictionary, exercises, screens, styles
```

### Beroenderiktning

```
ui  ──►  daily / modules / dictionary / conversation / stats / audio / feedback
             │            │
             ▼            ▼
        repetition   learning  ──►  content
             │            │
             └──► storage ◄┘        streak (ren) ◄── streak/streakService ──► storage
```

- **content** beror inte på något annat system. **streak.ts**, **selection.ts**, **learnPlan.ts**, **knowledge.ts**, **promptBuilder.ts** och övningsgeneratorerna är rena funktioner utan lagring eller UI.
- Ingen pedagogisk kod importerar React. UI-komponenter innehåller inga ordlistor eller lektionstexter.
- Pedagogiska system *emitterar* händelser (`feedback/events.ts`); avatar och framtida ljud/animationer *prenumererar*. Inget beror på att en prenumerant finns.

## Viktiga flöden

**Dagens session** (`daily/dailySession.ts`): `ensureDailySession()` körs när Hem öppnas. Den reglerar streaken för passerade dagar, och om dagens post saknas väljs dagens repetitionskort (fryses i posten så att "7/25" överlever omstart). Finns inga tidigare ord markeras repetitionen som klar. När både repetitionen och minst en modul är klara: `markDayCompleted()` → streak + händelser.

**Modul** (`modules/moduleService.ts`): steg 1 sparar sin plan och position efter varje svar. Stegen låses upp i ordning. När alla tre är klara skapas repetitionskort (initialt betyg från prestationen i steg 1) och dagens session meddelas.

**Repetition**: varje svar uppdaterar kortets FSRS-tillstånd och loggar en `ReviewEvent` i samma transaktion som sessionsindexet flyttas fram. Dubbla inskick ignoreras.

**Ordbok under övning**: `DictionarySheetProvider` renderar ett bottom sheet *ovanpå* nuvarande skärm. Skärmen avmonteras aldrig, så svar, inmatning och läsposition finns kvar.

## Arkitekturbeslut (ADR-logg)

1. **Hash-routing** i stället för react-router – statisk hosting utan konfiguration, inget beroende.
2. **Innehåll som JSON + Zod**, inte TS/JSX – validerbart, kan produceras av verktyg/AI och granskas.
3. **Explicita böjningstabeller per ordklass** (ingen regelgenerering) – korrekthet och granskbarhet före bekvämlighet. Alternativa former i `variants`.
4. **Furigana som `{漢字|かんじ}`-markering** – deterministisk, granskningsbar; validatorn underkänner kanji utan läsning. Renderas som `<ruby>`; global av/på via CSS-klass.
5. **FSRS via ts-fsrs, `enable_short_term=false`** – korttidsövning sker i steg 1, FSRS schemalägger i hela dagar. Bakom `Scheduler`-gränssnittet.
6. **Separata kort per kunskapsdimension** (`senseId|meaning/spelling/inflection`) – kortet knyts till *betydelse*, inte uppslagsord.
7. **Passiva ord får bara ett betydelsekort**; aktiva ord får även stavning och (om relevant) böjning.
8. **Dagens repetitionsplan fryses vid dagens början**; nya ord från idag ingår aldrig.
9. **Streak regleras lat** (när appen öppnas), idempotent per datum. Studiedatum = lokal kalenderdag i enhetens tidszon (eller fast zon i inställningar); dagaritmetik på datumsträngar med UTC-middag som ankare → sommartid kan inte påverka.
10. **Användardata refererar innehåll via stabila ID:n**, kopierar aldrig innehåll. Innehållskorrigeringar slår igenom överallt utan migrering.
11. **Allt innehåll laddas ivrigt i v0.1** (~100 kB). Vid tusentals moduler: dela upp i katalogindex (ivrigt) + modulkroppar (lazy `import.meta.glob`) bakom samma `ContentRepository`-API.
12. **Ordbokssökning utan externt bibliotek**: exakt Map + prefix via binärsökning + begränsad delsträngsskanning. Testat med 20 000 syntetiska poster.
13. **Konversation via adapter** (`ConversationProvider`) – v0.1 kopierar prompt till ChatGPT; en framtida inbyggd chatt implementerar samma gränssnitt.
14. **Kontrollerat ordförråd som automatisk kvalitetskontroll** (0.2) – `content/vocabularyCheck.ts` + `data/core/coreVocabulary.json`. Grundord känns igen med suffixregler (bara en QA-heuristik), målord via lagrade former. Testet `vocabularyCheck.test.ts` underkänner bygget om en text använder okända ord.
16. **Designsystem "Fjord"** (0.3) – alla färger/typografi/former som tokens; Manrope självhostad för offline och integritet (inga anrop till Google).
17. **Jonathan som stabil komponent** (0.3) – avatarens plats, storlek och händelsereaktioner är fasta; bara grafiken byts senare.
18. **Övningar utan auto-avancemang** (0.3) – resultatet visas i en bottenpanel och kräver "Fortsätt"; säkrare (ordboken, läsning av förklaringen) till priset av ett tryck.
19. **Utvecklingsläge** (0.3.1) – `devConfig`: nollställning vid varje versionsbyte (uttryckligt undantag från regel 1 under utvecklingen, med återställningspunkt) och utvecklarverktyg. Klockan har en förskjutning (`setClockOffsetDays`) som alla tjänster använder via `now()`. Stäng av före riktig användning.
20. **Planeringskatalog separat från lektioner** (0.4 fas B) – `planning/catalog/swechan-catalog.v1.json` (produktägarens, auktoritativ) läses av `src/content/catalog/` med egna Zod-scheman. `CatalogIndex` är rena metadata (titel, placering, status, målordsantal); bara lektioner i `ContentRepository` kan startas. Publicerade `m.*`-moduler kopplas till katalogen antingen med verifierad 1:1-länk (`links`) eller kompatibilitetsplacering (`compatibilityPlacements`) i `src/content/data/catalog/publishedMapping.json`. Katalogen laddas lat som egen del.
21. **Kurser-navigering = katalogens menyer** (0.4 fas C) – `Explore.tsx` renderar `CatalogIndex.menuItems()`; sökresultat pagineras (8 per sida). Gamla `categories.json` (`c.*`) används bara för modulschemats `categoryId` och kan tas bort när alla moduler har katalogplacering.
22. **Modulindex + lata lektionskroppar** (0.4 fas D) – `moduleIndex.json` genereras från modulfilerna (en fil per modul vid författande). `getModule` = indexpost (synkront), `loadModuleBody` = hela lektionen (asynkront, cache, retry, validering). Byggkonfigurationen ger varje lektion en egen del. Validatorer/CLI använder `src/content/tooling.ts`.
23. **Innehållsverktyg** (0.4 fas E) – logik i `src/content/tools/` (testbar, aldrig importerad av appen), tunna skript i `scripts/cli/` körda med `vite-node` (följer med Vitest, så inget nytt beroende) så att samma Vite-pipeline (JSON, `import.meta.glob`) gäller som i appen.
24. **Första verifierade katalogkopplingar** (0.4 fas F) – nya moduler skrivs direkt för en katalogpost (titel och ämne från katalogen) och kopplas med `links`; de äldre fem behåller kompatibilitetsplaceringar. Ordboken delas upp per ämne (`dictionary/food.json`), men ett uppslagsord får bara finnas i en post.
25. **0.4-releasen behåller utvecklingsnollställningen** (0.4 fas G) – produktägarens beslut; 0.3.1→0.4.0 nollställer progressionen med återställningspunkt. Beteendet med regeln både på och av testas med en fullständig 0.3.1-datamängd (`src/dev/release04.migration.test.ts`). E2E körs i CI som separat jobb (Playwright 1.63.0, Chromium) som inte blockerar publicering.
26. **Svaret maskeras i återkallningsövningar** (0.5) – `maskAnswer()` ersätter alla former av målordet i japanska texter som visas med omvända val och stavning; en valideringsregel förhindrar att svenska ordet står i `ja`/`defJa`.
27. **Katalogplaceringar bara i ämnesgrupper** (0.5) – kompatibilitetsplaceringar får inte ligga i en kategori med underkategorier, och publicerade + planerade val i en ämnesgrupp är högst åtta (`MAX_MODULES_PER_TOPIC`).
28. **Illustrationer som kod** (0.5) – stilen "Platt": motiv som små SVG-delar med roller (main/accent/accent2/light/line) och valfri egen kulör, renderade till inline-SVG med en palett per område. Inga bildfiler, inga emojis, ingen nätverksåtkomst; ett test kräver unika motiv (från 0.7 behöver inte varje modul ha en bild).
29. **Repo-omfattande kontroller körs en gång** (0.5) – `checkModules` kör innehålls-, ordförråds- och katalogkontrollerna en gång och filtrerar per modul; distraktorvalet cachar glosor per betydelse och betydelselistan per repository (WeakMap), eftersom innehållet är oföränderligt.
30. **Bilder per betydelse** (0.6) – registret `data/images/wordImages.json` (innehåll, inte användardata) läses av `content/images.ts`, som också äger distraktorregeln för bildövningar (`imageDistractorAllowed`: entydig bild, annan visuell grupp, ingen deklarerad förväxling). Illustrationer är SVG-kod i `src/ui/wordArt/` och laddas som egen del; foton ligger i `public/img/words/` och cachas av service workern. Bildövningarna (`image_choice`, `image_pick`) är betydelseövningar – inga nya korttyper.
31. **Kort för borttagna betydelser ignoreras** (0.7) – dagens plan, extrarepetitionen och repetitionsskulden använder bara kort vars `senseId` finns i innehållet (`liveCards()` i `daily/dailySession.ts`). Korten raderas inte (användardata bevaras), så de blir synliga igen om betydelsen återkommer. Moduler utan bild är tillåtna; `art.test.ts` kräver bara unika motiv för de bilder som finns.
32. **Förklaringar för svåra ord** (0.8) – `sense.explanation` (innehåll, inte användardata) visas öppet i `WordIntro` och `EntryView`. Nivån är regelns mått: modulord på B2+ (`needsExplanation`) måste ha en förklaring, som valideras som en definition (kontrollerat ordförråd, furigana, inte en kopia av `defSv`).
33. **Repetitionsurvalet räknar varje kort en gång** (0.8) – `selectReviewCards()` beräknar retrievability och förfallodatum en gång per kort innan sortering (jämförelsefunktionen anropas O(n log n) gånger). Ordningen är oförändrad. `makeAllCardsDue()` skriver om korten med `clear()` + `bulkAdd()` i en transaktion, eftersom `bulkPut` över befintliga nycklar var mycket långsamt i testmiljön.
34. **Ny betydelse på befintlig post i stället för dubblett** (0.8) – en homograf med samma ordklass får en ny `s.<lemma>.<n>` på den befintliga posten (t.ex. `s.spår.2`, järnvägsspår). Betydelsen valideras då också mot ordförrådet i den modul som äger ordboksfilen. Olika ordklasser får egen post med nyckel (`e.halka-noun`, `e.pumpa-verb`).
35. **En visuell motor: Animation_tool-** (0.12) – alla ordbilder framåt är scener från Animation_tool- (en stil, inga licensfrågor, ~1,3 kB per scen). Spelaren är kopierad till `src/ui/anim/` (paket från `npm run anim:package`, egen lat chunk `anim`). Scenerna importeras med `npm run visuals:import <dist/swechan>` till `public/anim/scenes/` och registret `wordVisuals.json`; posterbilden ritas ur scenen (`ScenePoster`) i stället för att skeppa en SVG per ord (5× mindre). `WordImage` visar animationen en gång i ordintroduktionen (`mode="intro"`, ▶ för repris, pausad under reducerad rörelse) och bara posterbilden i bildövningar och stavning (lika villkor för alternativen). Scenfilerna hämtas per modul när modulen öppnas (`prefetchModuleVisuals`) och cachas av service workern. Kodillustrationer och foton finns kvar som reserv tills de ersatts.
36. **Visualiseringsplan per betydelse** (0.12) – `visualPlan.json` anger animation/scen/symbol/ingen för varje betydelse. Ett nytt modulord kräver en rad (validatorn); innehållsrapporten visar hur många modulord som har en färdig visualisering. Planen styr produktionen i Animation_tool- men läses inte av appen.
15. **Förkunskaper styr rekommendationen, inte åtkomsten** (0.2) – `recommendedModule()` föreslår bara moduler vars förkunskaper är klara; moduler låses aldrig.

## Regler för vidareutveckling

1. Bevara användardata – ingen ändring får radera progression utan uttryckligt godkännande. Schemaändring = ny `db.version(n)` med `upgrade()`.
2. Undvik duplicering – en ordpost/betydelse per begrepp; moduler refererar `senseId`.
3. Separera funktioner – nya funktioner som egna moduler med tydliga gränssnitt.
4. Dokumentera beslut – lägg till i ADR-loggen ovan.
5. Testa viktiga förändringar – särskilt repetition, streak, datamodell, backup.
6. Bygg inte onödiga funktioner.
7. Innehållskvalitet först – felaktiga översättningar/böjningar är allvarliga buggar.
8. Ingen falsk funktionalitet – visa inte knappar som saknar implementation (t.ex. ljudeffekter visas inte förrän de finns).
9. Använd konfiguration (`config/appConfig.ts`, `Settings`).
10. Bevara enkelheten.
