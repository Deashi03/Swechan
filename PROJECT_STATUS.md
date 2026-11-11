# Projektstatus – nuläge

**Version:** 0.30.0 (släppt 2026-11-11) · **Senast uppdaterad:** 2026-11-11 · **Gren:** `main` (publiceras via GitHub Pages)

Läs den här filen först. Historiken per version står i `CHANGELOG.md`. Läs aldrig hela den filen, lägg bara till nytt överst.

## Vad som finns

- **Appen:** en PWA för japansktalande som lär sig svenska.
  - Varje dag: en *Dagens Swechan* med repetition (FSRS, upp till 25 kort) och en ny modul.
  - Modulerna har tre steg: ord, lästext och samtalsprompt.
  - Övrigt: streak med freezes, ordbok med sökning på svenska, japanska och kana, sparade och egna ord, nivåtest, export och import med återställningspunkt, och offlineläge.
  - Arkitekturen beskrivs i `ARCHITECTURE.md`.
- **Innehåll:** 551 publicerade moduler. 546 av dem motsvarar katalogposter: hela *Vardag & hem* (R01), hela *Människan & hälsa* (R02) och överämnet *Politik & demokrati* (R03-A01). De andra 5 är de ursprungliga modulerna.
  - Katalogen `planning/catalog/swechan-catalog.v1.json` har 2 016 planerade moduler i 344 kategorier.
  - Nästa överämne är *Juridik & rättsväsende* (R03-A02).
- **Bilder:**
  - Varje nivå i katalogmenyn har en illustration: rotområden, överämnen, ämnesgrupper och alla 2 016 moduler.
  - 8 039 ordbilder. Varje modulord har bild, animation eller symbol, utom orden under *Saknade bilder*.
  - Symbol- och adjektivbilder har klarat ett oberoende blindtest.
- **Regler som stoppas av validering och tester:**
  - kontrollerat ordförråd
  - furigana
  - förklaringar för B2-ord och svårare
  - 15–20 ord per modul
  - bild för varje modulord (från 0.29)
  - blindtest för symbol- och adjektivbilder
- **Utvecklingsläge är på.** `devConfig.resetProgressOnUpdate = true`: varje ny `APP_VERSION` nollställer all progression. Det är produktägarens önskemål under utvecklingen, och en återställningspunkt sparas. Läget måste stängas av innan appen används på riktigt. Ändra det aldrig utan produktägarens beslut. `toolsEnabled` visar utvecklarverktygen.

## Nästa steg

1. Nästa etapp, i en ny session: överämnet *Juridik & rättsväsende* (R03-A02), med bild på varje ord. Produktionen följer `docs/PRODUCTION_BRIEF.md`.
2. Mänsklig granskning av språket, se *Öppna osäkerheter*.
3. Nya bildidéer för orden under *Saknade bilder*.
4. Test på fysisk iPhone: Safari/WebKit, riktig svensk röst och "Lägg till på hemskärmen". Inget av detta är testat ännu.

## Saknade bilder

Dessa modulord har planstatus `none`, eftersom de har underkänts i två blindtest.

- **Före 0.29 (14 ord):**
  - `s.en-bit.1`, `s.extremt.1`, `s.frasighet.1`, `s.ha-det-trevligt.1`, `s.knaprig.1`
  - `s.leverans.1`, `s.motion.1`, `s.otrogen.1`, `s.så-fort.1`, `s.varifrån.1`
  - `s.veckovis.1`, `s.vänligen.1`, `s.ödmjuk.1`, `s.ömsint.1`
  - De står i `VISUAL_EXCEPTIONS_BEFORE_0_29`.
- **Från 0.29:** `s.demenssjuk.1` (*Minnesförändringar*).
- **Från 0.30 (20 ord):**
  - Demokratins grundbegrepp: `s.rösträtt.1`, `s.utöva.1`, `s.statsmakt.1`, `s.medborgerlig.1`, `s.representera.1`, `s.institution.1`, `s.ansvarig.1`
  - Svensk politik: `s.politisk.1`, `s.bereda.1`, `s.debattera.1`
  - Val & folkomröstningar: `s.valkampanj.1`, `s.valkrets.1`
  - Kommuner & regioner: `s.regional.1`, `s.motivering.1`
  - Internationell politik: `s.diplomatisk.1`, `s.åtagande.1`, `s.samarbete.1`
  - Politiska idéer: `s.liberal.1`, `s.liberalism.1`, `s.socialistisk.1`
- Orden från 0.29 och framåt står i `VISUAL_MISSING_AFTER_BLIND_TEST`.

## Öppna osäkerheter (för mänsklig granskning)

- **Allt innehåll är AI-utkast** (`quality.status: ai-draft`). Japanska läsningar och översättningar är den största kvalitetsrisken. Validatorn hittar saknad furigana, men inte fel läsning.
- **0.29, svenska:**
  - pluralen *dealar*
  - imperativen *hörs* (av *höras*) och *åldras*
  - nyansen i *kohandel*, *gränslös*, *lova bättring* och *tumma på*
  - *jobba kvar*, som bara definieras som "fortsätta arbeta på samma ställe"
  - *pixlig*, *chattspråk*, *läskvitto* och pluralen *emojier*
- **0.29, japanska:**
  - {間遠|まどお}, {心|こころ}ばかりの{品|しな}, {芯|しん}の{強|つよ}さ, {気骨|きこつ}
  - 方便のうそ (*nödlögn*), 恩 (*tacksamhetsskuld*), 性に合わない (*inte min grej*)
  - 市民農園 (*kolonilott*), 准看護師・介護士 (*undersköterska*)
- **0.29, fakta:**
  - du-reformen (Bror Rexed 1967)
  - *Sju sorters kakor* (1945)
  - pensionssystemet, som medvetet hålls allmänt utan exakta åldrar
- **0.30, svenska:**
  - *taktikrösta*, *fyraprocentsspärr*, *valkretsmandat* och *budröst* finns inte säkert i SAOL
  - *frysa tillgångar* böjs starkt (frös/frusit); svag böjning är också möjlig
  - *kommunfullmäktige*/*regionfullmäktige* som oböjliga poster; *lägga ned* utan varianten *lägga ner*
  - några definitioner är vaga, eftersom ordförrådskontrollen inte godkände *kommun*, *länsstyrelsen* och minoriteternas namn i den tidiga kedjan
- **0.30, japanska:**
  - egna översättningar: {総合防衛義務|そうごうぼうえいぎむ} (*totalförsvarsplikt*), {単純過半数|たんじゅんかはんすう}, {選挙審査会|せんきょしんさかい} (*Valprövningsnämnden*), {首相承認投票|しゅしょうしょうにんとうひょう} (*statsministeromröstning*)
  - ungefärliga motsvarigheter: *interpellation*, *talmansrunda*, *stödparti*, *partisekreterare* ({幹事長|かんじちょう}), *remiss* ({意見照会|いけんしょうかい}), *idéströmning*, *förankra*
  - vissa japanska förklaringar innehåller mer än de svenska, till exempel minoriteternas namn och Montesquieu
- **0.30, fakta (kan ändras över tid):**
  - 15 utskott med 17 ledamöter, ett tjugotal statsråd och partistödets villkor
  - mandatfördelningen 310 + 39, minst 21 ledamöter i kommunfullmäktige och kommunalskatten på drygt 30 procent
  - EU:s 27 medlemsländer, FN:s 193 och Sveriges Natomedlemskap 2024
- **Kända begränsningar:**
  - Grundorden saknar japanska glosor och kan inte slås upp.
  - Ordförrådskontrollen utgår från modulens förkunskaper, inte från vad användaren faktiskt har lärt sig.
  - Morfologin känner bara igen lagrade former, inte delade partikelverb, s-passiv eller nya sammansättningar.
  - Inget IPA-uttal. Uttalet kommer från enhetens talsyntes.
  - `word_mastered` skickas inte ut.
  - Det finns ingen ESLint-konfiguration.

## Kom ihåg

- **Arbetsform (produktägarens regler):**
  - En etapp per session. När en release eller ett överämne är inlagt: uppdatera den här filen, stanna och be produktägaren starta en ny session.
  - Högst tre ämnesgrupper skrivs parallellt. Nästa grupp startas först när en är inlagd i integrationsgrenen.
  - En bild får högst två blindtestomgångar, se `CONTENT_GUIDELINES.md` → *Blindtest*.
  - Rutinsteg körs med låg ansträngningsnivå: registrera blindtest, uppdatera changelog och status, köra tester och bygga.
  - Byt aldrig till en lättare modell för svensk eller japansk text eller för bilder utan att fråga produktägaren.
- **Release:**
  - versionsnummer i `package.json`, `package-lock.json` (rad 3 och 9) och `APP_VERSION` i `src/config/appConfig.ts`
  - `CACHE` i `public/sw.js` (nu `swechan-v34`)
  - `CHANGELOG.md` (överst), den här filen och `ROADMAP.md`
  - Kör `npm run typecheck && npm test && npm run validate:content && npm run build && npm run e2e`.
- **Git:** om `git status` visar opushade commits trots att pushen lyckades, jämför med `git ls-remote origin <gren>` och uppdatera spårningsreferensen.
- **e2e:** `scripts/e2e-smoke.mjs` använder den planerade modulen *Lag och förordning* (SWC-SAM-02-01-01) som exempel. Byt exemplet när den publiceras.
- Regler för innehåll och bilder står i `CONTENT_GUIDELINES.md`, för kod i `ARCHITECTURE.md`, och produktionsarbetet i `docs/PRODUCTION_BRIEF.md`.
