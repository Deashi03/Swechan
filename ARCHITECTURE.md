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
