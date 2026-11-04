# Projektstatus – överlämning

**Version:** 0.1.0 · **Senast uppdaterad:** 2026-11-04 · **Gren:** `claude/swechan-0.1`

Det här dokumentet är överlämningen mellan arbetstillfällen. Läs det först, sedan `ARCHITECTURE.md`.

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
- **Innehåll**: 3 moduler (25, 24, 24 ord), 77 ordposter / 86 betydelser (inkl. 4 fristående känsloord för jämförelse/egna ord), 4 jämförelser, 8 grammatiknoteringar.

\* `word_mastered` finns i händelsetypen men emitteras ännu inte (se Återstår).

## Testat (faktiskt genomfört 2026-11-04)

- `npm run typecheck` – inga fel.
- `npm test` – **79 tester gröna** (11 filer): innehållsvalidering (och att validatorn fångar fel), furigana, datum/tidszon/sommartid, streak (13 fall enligt spec §22.1), repetition (separata dimensioner, förfallna, otillräckligt antal, fler än gränsen, skuld, felaktiga svar, ingen historikförlust, dubbelinskick), modulflöde (paus/återupptagning, steg i ordning, registrering i dagens session, tvådagars acceptansflöde, ingen dubbelräkning, data kvar efter omöppning), sparade ord, övningsgenerering för alla ord × typer, entydiga distraktorer, kunskapsnivåer, nivåtest, ordbok (svenska, japanska, kana, böjningar, flera betydelser, delade betydelser, synonymer, 20 000 poster), konversationsprompt, backup (rundtur, ogiltiga filer, framtida version, återställningspunkt), övningskomponenter (återkopplingssteg, å/ä/ö, ordbok bevarar inmatning).
- `npm run build` – OK (vendor 111 kB gzip, app 39 kB, innehåll 29 kB).
- `npm run e2e` – **hela acceptansflödet (spec §26) passerar** i Chromium med iPhone 13-emulering och simulerad klocka: välkomst → nivåtest → startsida → modul A alla tre steg (inkl. ordbok mitt i övning, uppslagning i texten med bevarad position, kopierad prompt) → dagen klar, streak 1 → omladdning behåller data → dag 2: 25 repetitioner av gårdagens ord → modul B → streak 2 → global sökning på kanji → ordbokssökning på böjningsform → export. Inga konsolfel.
- Visuell kontroll av skärmbilder (startsida, ordintro, ordbokspost, lästext med bottom sheet, samtalssteg).

**Inte testat:** på en fysisk iPhone/Safari (WebKit), riktig svensk TTS-röst, "Lägg till på hemskärmen", offline-läge i praktiken, GitHub Pages-publicering (workflowet är skrivet men har inte körts).

## Kända problem och begränsningar

1. **Innehållet är AI-utkast** (`quality.status: ai-draft`) och inte granskat av människa. Japanska läsningar/översättningar och fakta bör granskas – detta är den viktigaste kvalitetsrisken.
2. Ord i lästexterna som inte är målord finns oftast inte i ordboken; uppslagning visar då "Ordet finns ännu inte i Swechans ordbok".
3. Morfologin känner bara igen lagrade former: delade partikelverb ("plockar hon undan"), s-passiv ("belägrades") och sammansättningar ("vattenmolekyl") länkas inte.
4. Inget IPA-uttal; uttal endast via enhetens talsyntes (iPhone kan behöva ladda ner en svensk röst).
5. Efter ett rätt svar på första försöket går övningen vidare automatiskt efter 0,85 s; öppnar man ordboken inom den tiden byter övningen bakom arket.
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

1. **Publicera och testa på iPhone**: slå på GitHub Pages (Settings → Pages → Source: GitHub Actions), merga till `main`, öppna i Safari, lägg till på hemskärmen och gå igenom en hel dag. Notera problem med tangentbord, röst och layout.
2. **Granska innehållet** med en person som kan svenska och japanska; sätt `quality.status: reviewed`.
3. **Producera modul 4–6** enligt `CONTENT_GUIDELINES.md`.
