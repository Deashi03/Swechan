# Projektstatus – överlämning

**Version:** 0.6.0 · **Senast uppdaterad:** 2026-11-05 · **Gren:** `main` (publiceras via GitHub Pages; 0.6 utvecklades i grenen `claude/swechan-0.6-word-images`)

Det här dokumentet är överlämningen mellan arbetstillfällen. Läs det först, sedan `ARCHITECTURE.md`.

## 0.6 – släppt 2026-11-05 (pilot: bilder på orden)

- **Pilot:** alla ord i *Vardagskläder* har bild, plus fotona *bryna*, *mocka*, *manchester*. Produktägaren utvärderar piloten innan resten görs.
- **Beslut (produktägaren):** en bild per ord; bilden i introduktionen och i vissa övningar; bildfrågor där alternativen inte går att blanda ihop. Abstrakta ord får symbol om en lämplig, kulturellt överförbar scen finns, annars ingen bild. **Claude ansvarar för hela bildflödet** – produktägaren ska inte generera bilder.
- **Stilval:** illustrationer som kod (bilderbok, `src/ui/wordArt/`) för form; fritt licensierade foton för yta/tillstånd. Foton hämtas via Openverse (`api.openverse.org`, tillåten i miljön); Wikimedias API ger ofta 429 från molnmiljön och Flickrs bildserver är inte tillåten, så Openverse-förhandsbilder (≤ 600 px) används. Licens CC0/PDM/CC BY, aldrig BY-SA/NC.
- **Ny bild för ett ord:** motiv i `src/ui/wordArt/motifs.ts` + rad i `src/content/data/images/wordImages.json` med `group`, `quiz` och `confusableWith`. Granska med `npm run art:words`. `images.test.ts` kontrollerar distraktorreglerna.
- **Nästa steg efter godkänd pilot:** övriga klädmoduler, sedan Hem & boende och Mat & måltider (där behövs fler foton: tillagning, råvaror, konsistenser).

## 0.5 – släppt 2026-11-05

- **Rättat:** svaret syntes i frågan (omvända val/stavning) – `maskAnswer()` + valideringsregel; äldre moduler låg i fel överkategori – nu i ämnesgrupper, och validatorn kräver det.
- **Bilder, stil "Platt"** (användarens val av fem varianter): `src/ui/art/`. **Varje ny modul måste få ett eget motiv** i `motifs.ts` (`MOTIFS` + `MODULE_MOTIF[catalogId]`), annars fallerar `art.test.ts`. Granska med `npm run art:sheet`.
- **102 nya moduler**: Mat & måltider (39) och Hem & boende (42) är helt publicerade; Kläder & personlig stil har Vardagskläder, Skor & accessoarer och Textilier & material klara (21). Totalt 110 publicerade moduler. Alla ord är AI-utkast (`ai-draft`), ingen mänsklig granskning.
- **Kedjor:** en linjär förkunskapskedja per område (`recommendedOrder` 1xx mat, 2xx hem, 3xx kläder). Klädkedjan börjar efter *Flyttdag och adressändring*; nästa klädmodul (*Klädstorlekar och mått*, SWC-VAR-03-04-01) ska ha *Att känna igen kvalitet* som förkunskap och ordning 322.
- **Kvar i Kläder & personlig stil:** Storlek & passform, Tvätt & klädvård, Skönhet & grooming (21 planerade). Ord som medvetet sparats till dem: storlek/mått/midja, löst/tajt, prova, söm, dragkedjans detaljer, krympa, skrynklig, stryka, fläck, nål, frisyr, smink, rakning m.m.
- **Ord som hör till senare överämnen** har hållits utanför (budget, lån, ränta, försäkring, folkbokföring, konflikt, glasögon, väva/sticka, mikroplast, abonnemang …). Kontrollera katalogtitlarna innan ett ord görs till målord.
- Testsviten: 248 tester, ~25 s. `module:validate` och distraktorvalet är optimerade (se CHANGELOG).

## 0.4 – släppt 2026-11-04

Följ `SWECHAN_0_4_CLAUDE_HANDOFF.md`. Katalogen: `planning/catalog/swechan-catalog.v1.json` (344 kategorier, 2 016 **planerade** moduler).
- **Fas A klar** (gren `claude/swechan-0.4-phase-a`): baslinje grön; två buggar i versionsnollställningen rättade (se CHANGELOG); granskningstester.
- **Fas B klar** (gren `claude/swechan-0.4-phase-b`, bygger på fas A): katalogindex från den riktiga katalogfilen, validator, kompatibilitetsplaceringar för de fem modulerna, spärrar mot att starta planerade moduler. Ännu inget UI som använder katalogen (det är fas C: Utforska/Kurser med högst åtta val per skärm).
- **Fas C klar** (gren `claude/swechan-0.4-phase-c`, bygger på fas B): Kurser och sökning på den riktiga katalogen, högst åtta val per skärm, planerade moduler har informationsvy utan Starta-knapp. Komponenttester i `src/ui/screens/Explore.test.tsx`.
- **Fas E klar** (gren `claude/swechan-0.4-phase-e`): CLI-verktyg `catalog:validate`, `module:new`, `module:validate`, `content:report` (se README/CONTENT_GUIDELINES).
- **Fas D klar** (gren `claude/swechan-0.4-phase-d`): modulindex + `loadModuleBody`, läs/samtal laddar lat, förladdning för offline, uppmätt bundle/laddtid (se CHANGELOG). **Kom ihåg `npm run content:index` efter ändring i en modulfil.**
- **Fas F klar** (gren `claude/swechan-0.4-phase-f`, bygger på fas E): tre nya moduler i en kedja – *Vanliga grönsaker* → *Skära och hacka* → *Koka och sjuda* – med verifierade 1:1-kopplingar till sina katalogposter; ny ordboksfil `food.json` (47 ord, AI-utkast). E2E går igenom kedjan via Kurser-menyn.
- **Fas G klar**: version 0.4.0, migreringstest 0.3.1→0.4 med nollställningen på och av, e2e-jobb i CI, dokumentation. WebKit/fysisk iPhone: EJ TESTAT.
- **Beslut (produktägaren, 2026-11-04): nollställningen ska vara PÅ även vid 0.4-releasen**, eftersom appen fortfarande är under systemutveckling och funktioner ska kunna testas från noll. Att höja `APP_VERSION` till 0.4.0 nollställer alltså all progression (återställningspunkt sparas och kan ångras). Ändra inte `devConfig.resetProgressOnUpdate` utan nytt beslut från produktägaren.

## ⚠️ Utvecklingsläge är PÅ (0.3.1–0.6.0)

`devConfig.resetProgressOnUpdate = true`: **varje ny APP_VERSION nollställer all användarprogression** (produktägarens uttryckliga önskemål under utvecklingen; en återställningspunkt sparas). Detta går emot regel 1 "Bevara användardata" och **måste stängas av (`false`) innan appen används på riktigt**. `devConfig.toolsEnabled` visar utvecklarverktygen (Inställningar + ⏭ i inlärningen). Öka alltid `APP_VERSION` vid en release – det är versionsbytet som utlöser nollställningen.

## Nytt i 0.3.1
- Moduler 15–20 ord (schema + alla moduler nedkortade till 20).
- Inlärningen visar "Del X av Y" i stället för totalen (`batchProgress` i `learnPlan.ts`).
- Versionsnummer på startsidan och välkomstsidan.
- Utvecklarverktyg (`src/dev/devTools.ts`, `src/ui/screens/DevTools.tsx`): tidsresa via klockförskjutning (`lib/clock.ts`), upplåsning av steg, genvägar för repetition, nollställning.

## Nytt i 0.3

- **Designen "Fjord"** (användarens val efter tre omgångar skisser; skisserna togs fram utanför repot). Tokens i `src/ui/styles/tokens.css`, typsnitt Manrope i `public/fonts/` (OFL). Startsida `src/ui/screens/Home.tsx`, övningar `src/ui/exercises/ExerciseView.tsx` (resultatpanel längst ner, inget auto-avancemang).
- **Jonathan** (`src/ui/components/Jonathan.tsx`): platshållare (monogram) med stämningar och händelsereaktioner. Den riktiga avataren ersätter bara komponentens innehåll.
- **Dagens svenska ord** (`src/daily/wordOfTheDay.ts`): deterministiskt per datum.
- **Pedagogiska rättningar**: kontextövningar med distraktorer från annat ämne, samma form och genus, och översättningen dold tills ledtråd/svar; böjningsövningar med naturliga meningsramar utan grammatiktermer (`inflectionFramesFor`, valfritt `frame` på betydelser); testade i `learning.test.ts`.
- Användarens önskemål om designen: proffsig läroplattform, avslappnad, lätt svenskt tema (inte för tematiskt), lite plats för gullighet. Övningsvyer i stil med ordkort + kontextmening + knappar med djup uppskattades.

## Nytt i 0.2 (efter användartest på iPhone)

Användarens feedback på 0.1: (1) förklaringar använde svårare ord än ordet som lärdes in, (2) flera betydelser (t.ex. *ämne*) visades otydligt och ofullständigt, (3) frågor använde ord som eleven inte gått igenom. Åtgärder:

- **Kontrollerat ordförråd** (`src/content/vocabularyCheck.ts`, `data/core/coreVocabulary.json`): ett test underkänner varje förklaring, exempel, lästext eller fråga som använder ord utanför grundordförrådet + förkunskapsmoduler + tidigare ord i modulen. 196 problemtexter i 0.1 → 0.
- **Inlärningskedjor**: nya grundmoduler *Material och ämnen* → *Atomer och molekyler*, *Krig och försvar* → *Medeltida borgar*. *Dagens modul* respekterar kedjan.
- **Betydelser**: `labelSv` per betydelse; sektionen "”ämne” har 5 betydelser" i ordintroduktionen; översikt i ordboken.
- **Uppslagbara ord** i förklaringar, exempel och läsfrågor (`SvText`).
- **Buggfix**: "Hoppa över" på välkomstsidan fungerade inte.

## Färdigbyggt (fungerar)

- **Startsida** med "Dagens Swechan": A. Repetition (x/25, progress, start/fortsätt/klar) och B. Dagens modul (rekommenderad eller pågående, "Välj annan"), streak, längsta streak, freezes, veckokalender (klar/freeze/missad/idag), kort statistik, avatar med kontextuell hälsning, positiv bekräftelse när dagen är klar, notis om repetitionsskuld.
- **Daglig session**: plan fryses vid dagens start; inga tidigare ord → repetition klar automatiskt; färre än 25 ord → sessionen använder det som finns; dagens nya ord ingår inte; dagen klar när båda delar är klara (valfri ordning).
- **Streak**: regler i `config/appConfig.ts` (1 freeze vid start, max 2, +1 per 7 klara dagar), automatisk freeze-förbrukning, flera missade dagar, idempotens, studiedatum i lokal tidszon, sommartidssäkert.
- **Moduler** i tre steg med paus/återupptagning efter varje svar; stegen låses upp i ordning; modul klar → orden in i repetitionen → dagens session meddelas.
  - Steg 1: introduktionskort (anpassad längd, japansk/svensk förklaring, exempel, uttalsknapp, frivillig grammatik/jämförelse) + 6 övningstyper i batchar om 5, felade uppgifter återkommer.
  - Steg 2: lästext där varje ord kan tryckas för uppslagning (bottom sheet, läsposition bevaras), målord markerade, uppläsning om svensk röst finns, 5 läsförståelsefrågor med förklaringar.
  - Steg 3: genererad ChatGPT-prompt (kopiera-knapp med fallback, öppna ChatGPT, visa prompt), manuell markering som genomförd.
- **Repetition**: FSRS via ts-fsrs, kort per betydelse × dimension (betydelse/stavning/böjning), prioritering av förfallna/svåra/låg sannolikhet, olika ord per session, varierade övningstyper, extrarepetition (10 åt gången), repetitionsskuld + rekommendation (ändrar aldrig takten själv).
- **Ordbok**: sökning på svenska uppslagsord, böjningsformer (inkl. varianter), japanska ord, kanji, kana (även katakana→hiragana), prefix/delsträng; fullständiga poster med flera betydelser, böjningstabell, exempel, kollokationer, stilnivå, synonymer per betydelse, jämförelser, japanska grammatiknoteringar, relaterade moduler, kunskapsnivå, "Spara ord", "+ Lär mig ordet".
- **Ordbok under övning**: bok-ikonen i alla sessioner + "Öppna i ordboken" i facit; övningens state och inmatning bevaras.
- **Sparade ord** och **egna ord att lära** (introduktion + övningar innan de går in i repetitionen).
- **Svåra ord** per dimension och **sammanblandade ordpar** (med jämförelse) i Repetition-vyn.
- **Kunskapsnivåer** (introducerat/förstått/aktivt behärskat/långsiktigt befäst) enligt dokumenterade kriterier; statistikvy med tidslinje.
- **Nivåtest** (15 frågor, frivilligt, kan göras om) med ärlig reservation om att det inte är en CEFR-bedömning.
- **Export/import** av versionshanterad JSON; validering; återställningspunkt + "Ångra senaste import"; begäran om skyddad lagring.
- **Inställningar**: repetitioner per dag (10–60), furigana av/på, animationer (system/minska/alla), uppläsning (röststatus, test, tempo).
- **PWA**: manifest, ikoner (inkl. apple-touch-icon), service worker (offline), safe-area-stöd, tabbar för tummen, fokusläge utan tabbar i sessioner, å/ä/ö-knappar vid skrivning (bra med japanskt tangentbord).
- **Feedback System**: händelsebuss (`answer_correct`, `answer_incorrect`, `review_completed`, `module_completed`, `daily_session_completed`, `streak_increased`, `streak_freeze_used`, `streak_freeze_earned`, `word_mastered`*) + platshållaravatar "Swe-kun" med stämningar.
- **Innehåll**: 5 moduler i två kedjor + en fristående (Hemmet 25, Material och ämnen 21, Atomer och molekyler 22, Krig och försvar 21, Medeltida borgar 23 ord), 116 ordposter / 129 betydelser (inkl. 4 fristående känsloord), 5 jämförelser, 8 grammatiknoteringar, grundordförråd ~920 ord.

\* `word_mastered` finns i händelsetypen men emitteras ännu inte (se Återstår).

## Testat (version 0.4.0)

- `npm run typecheck` OK · `npm test` **141 tester gröna** · `validate:content` 21/21 · `catalog:validate` OK · `content:index -- --check` OK · `npm run build` OK.
- `npm run e2e` **passerar** (Chromium, iPhone 13-emulering). Det täcker nu även Kurser-menyn (≤ 8 val, planerad post utan Starta-knapp) och kedjan *Vanliga grönsaker* → lär → läs → samtalsprompt → nästa dags repetition.
- Migrering 0.3.1→0.4.0 med fullständig datamängd och `resetProgressOnUpdate` på och av: `src/dev/release04.migration.test.ts`.
- **EJ TESTAT:** WebKit/Safari, fysisk iPhone och verklig TTS.

## Testat (version 0.3.1)

- `npm run typecheck` OK · `npm test` **95 tester gröna** (nya: nollställning vid versionsbyte + återställningspunkt, tidsresa, upplåsning, genvägar, "Del X av Y", passiva ord) · `npm run build` OK · `npm run e2e` **passerar** · skärmbilder av startsida, inlärning och utvecklarpanel granskade.

## Testat (version 0.3)

- `npm run typecheck` OK · `npm test` **88 tester gröna** (nya: distraktorer från annat ämne och samma genus, meningsramar utan "alla" och grammatiktermer, inget auto-avancemang) · `npm run build` OK · `npm run e2e` **passerar** med nya designen · skärmbilder av startsida, ordintro, flerval, kontextövning och skrivövning granskade.

## Testat (version 0.2)

- `npm run typecheck` OK · `npm test` **85 tester gröna** (inkl. språkkontrollen över allt innehåll och inlärningskedjan) · `npm run build` OK · `npm run e2e` **passerar** (inkl. ny kontroll av "Hoppa över") · skärmbilder av nya ordintroduktioner granskade.

### Från 0.1

- `npm run typecheck` – inga fel.
- `npm test` – **79 tester gröna** (11 filer): innehållsvalidering (och att validatorn fångar fel), furigana, datum/tidszon/sommartid, streak (13 fall enligt spec §22.1), repetition (separata dimensioner, förfallna, otillräckligt antal, fler än gränsen, skuld, felaktiga svar, ingen historikförlust, dubbelinskick), modulflöde (paus/återupptagning, steg i ordning, registrering i dagens session, tvådagars acceptansflöde, ingen dubbelräkning, data kvar efter omöppning), sparade ord, övningsgenerering för alla ord × typer, entydiga distraktorer, kunskapsnivåer, nivåtest, ordbok (svenska, japanska, kana, böjningar, flera betydelser, delade betydelser, synonymer, 20 000 poster), konversationsprompt, backup (rundtur, ogiltiga filer, framtida version, återställningspunkt), övningskomponenter (återkopplingssteg, å/ä/ö, ordbok bevarar inmatning).
- `npm run build` – OK (vendor 111 kB gzip, app 39 kB, innehåll 29 kB).
- `npm run e2e` – **hela acceptansflödet (spec §26) passerar** i Chromium med iPhone 13-emulering och simulerad klocka: välkomst → nivåtest → startsida → modul A alla tre steg (inkl. ordbok mitt i övning, uppslagning i texten med bevarad position, kopierad prompt) → dagen klar, streak 1 → omladdning behåller data → dag 2: 25 repetitioner av gårdagens ord → modul B → streak 2 → global sökning på kanji → ordbokssökning på böjningsform → export. Inga konsolfel.
- Visuell kontroll av skärmbilder (startsida, ordintro, ordbokspost, lästext med bottom sheet, samtalssteg).

**Inte testat:** på en fysisk iPhone/Safari (WebKit), riktig svensk TTS-röst, "Lägg till på hemskärmen", offline-läge i praktiken, GitHub Pages-publicering (workflowet är skrivet men har inte körts).

## Kända problem och begränsningar

1. **Innehållet är AI-utkast** (även 0.2-omskrivningen) (`quality.status: ai-draft`) och inte granskat av människa. Japanska läsningar/översättningar och fakta bör granskas – detta är den viktigaste kvalitetsrisken.
2. Grundord (t.ex. *gjord*, *salt*) finns inte i ordboken och kan inte slås upp; texterna innehåller nu bara grundord och inlärda ord, men grundorden saknar japanska glosor.
2b. Språkkontrollens igenkänning av grundord är en heuristik (suffixregler); den kan i sällsynta fall godkänna ett ord som inte är ett grundord. Grundordförrådet är egenkomponerat (ingen licensierad frekvenslista) och bör granskas.
2c. Språkkontrollen utgår från modulens förkunskaper, inte från vad användaren faktiskt har lärt sig (en användare kan hoppa över kedjan).
3. Morfologin känner bara igen lagrade former: delade partikelverb ("plockar hon undan"), s-passiv ("belägrades") och sammansättningar ("vattenmolekyl") länkas inte.
4. Inget IPA-uttal; uttal endast via enhetens talsyntes (iPhone kan behöva ladda ner en svensk röst).
5. (Åtgärdat i 0.3: inget automatiskt avancemang längre.) Kontextövningarnas felalternativ kan komma från moduler som eleven ännu inte gjort (de väljs från andra ämnen för att vara entydiga).
6. Ändrat "repetitioner per dag" gäller först nästa dag (dagens plan är fryst).
7. Extrarepetitionens urval sparas inte (varje svar sparas dock).
8. Fast tidszon stöds i datamodell och logik men kan inte väljas i UI.
9. Om en modul ändrar `contentVersion` under pågående steg 1 används den sparade planen; borttagna ord hoppas över, nya ord kommer inte med förrän modulen startas om (ingen omstartsfunktion ännu).
10. `word_mastered` emitteras inte; inga ljudeffekter (avsiktligt dolt tills de finns).
11. All innehåll laddas ivrigt (OK för v0.1; se ADR 11).
12. Ruby-text gör att kanji med långa läsningar spärras ut lite (normalt webbläsarbeteende).
13. Ingen ESLint-konfiguration; e2e-skriptet använder globalt installerad Playwright.

## Återstår (inte implementerat i 0.1)

Se `ROADMAP.md`. Kortsiktigt viktigast: test på fysisk iPhone, mänsklig innehållsgranskning, fler moduler, stödordbok för lästexter.

## Nästa rekommenderade arbetsuppgift

(0.4) 1. Testa 0.4 på iPhone: Kurser-menyn, sökningen och kedjan grönsaker → skära → koka. 2. Mänsklig granskning av matlagningsmodulerna. 3. Nästa avgränsade PR: fortsätt *Matlagningens verb* (t.ex. SWC-VAR-02-03-03 Steka och bryna) med `module:new`. 4. Japanska katalogtitlar. 5. Bestäm när `resetProgressOnUpdate` ska stängas av.

(0.3) 1. Testa Fjord-designen på iPhone (särskilt resultatpanelen längst ner och tangentbordet i skrivövningar). 2. Mänsklig granskning av innehållet. 3. Fler moduler. 4. Ta fram Jonathan-avataren (illustration) och koppla in den i `Jonathan.tsx`.

(0.2) 1. Merga 0.2 till `main` (publiceras automatiskt) och testa på iPhone: gå igenom *Material och ämnen* och kontrollera att förklaringarna känns begripliga. 2. Mänsklig granskning av innehållet. 3. Fler moduler i kedjor enligt `CONTENT_GUIDELINES.md` (kontrollerat ordförråd).

### Tidigare (0.1)

1. **Publicera och testa på iPhone**: slå på GitHub Pages (Settings → Pages → Source: GitHub Actions), merga till `main`, öppna i Safari, lägg till på hemskärmen och gå igenom en hel dag. Notera problem med tangentbord, röst och layout.
2. **Granska innehållet** med en person som kan svenska och japanska; sätt `quality.status: reviewed`.
3. **Producera modul 4–6** enligt `CONTENT_GUIDELINES.md`.
