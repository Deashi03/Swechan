# Projektstatus – nuläge

**Version:** 0.32.0 (2026-11-12) · **Senast uppdaterad:** 2026-11-12 · **Gren:** `claude/swechan-0.32` → `main` (publiceras via GitHub Pages)

Läs den här filen först. Historiken per version står i `CHANGELOG.md`. Läs aldrig hela den filen, lägg bara till nytt överst.

## Vad som finns

- **Appen:** en PWA för japansktalande som lär sig svenska.
  - Varje dag: en *Dagens Swechan* med repetition (FSRS, upp till 25 kort) och en ny modul.
  - Modulerna har tre steg: ord, lästext och samtalsprompt.
  - Övrigt: streak med freezes, ordbok med sökning på svenska, japanska och kana, sparade och egna ord, nivåtest, export och import med återställningspunkt, och offlineläge.
  - Arkitekturen beskrivs i `ARCHITECTURE.md`.
- **Innehåll:** 635 publicerade moduler. 630 av dem motsvarar katalogposter: hela *Vardag & hem* (R01), hela *Människan & hälsa* (R02) och överämnena *Politik & demokrati* (R03-A01), *Juridik & rättsväsende* (R03-A02) och *Ekonomi & arbetsliv* (R03-A03). De andra 5 är de ursprungliga modulerna.
  - Katalogen `planning/catalog/swechan-catalog.v1.json` har 2 016 planerade moduler i 344 kategorier.
  - Nästa överämne är *Utbildning & lärande* (R03-A04).
- **Bilder:**
  - Varje nivå i katalogmenyn har en illustration: rotområden, överämnen, ämnesgrupper och alla 2 016 moduler.
  - 8 996 ordbilder. Varje modulord har bild, animation eller symbol, utom orden under *Saknade bilder*.
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

1. Nästa etapp, i en ny session: överämnet *Utbildning & lärande* (R03-A04), med bild på varje ord. Produktionen följer `docs/PRODUCTION_BRIEF.md`.
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
- **Från 0.31 (45 ord):**
  - Rättens grunder: `s.utfärda.1`, `s.föreskrift.1`, `s.enligt-lag.1`, `s.författning.1`, `s.lagstadgad.1`, `s.rätt.2`, `s.skyldig.3`, `s.plikt.1`, `s.åligga.1`, `s.privatperson.1`, `s.offentlig-rätt.1`
    - *utfärda*, *föreskrift* och *enligt lag* ritades av misstag aldrig om efter första omgången. De kan vara värda ett nytt försök om produktägaren tillåter det.
  - Brott & straff: `s.gärning.1`, `s.straffbar.1`, `s.brottslig.1`, `s.uppsåt.1`, `s.vårdslös.1`, `s.avsiktlig.1`, `s.uppsåtlig.1`, `s.oaktsamhet.1`, `s.anstiftan.1`, `s.straff.1`, `s.individualprevention.1`
  - Polis & brottsutredning: `s.skäligen-misstänkt.1`, `s.anhållande.1`, `s.försvåra.1`
  - Domstolar & rättegång: `s.rättegång.1`, `s.yrkande.2`, `s.yrka.1`, `s.åtalsplikt.1`, `s.åtal.1`, `s.stämning.1`, `s.yttra-sig.1`, `s.överklagande.1`, `s.frikänna.1`, `s.fria.2`
  - Civilrätt i vardagen: `s.sakliga-skäl.1`
  - Förvaltning & myndigheter: `s.handlägga.1`, `s.ansökan.1`, `s.sekretessbelagd.1`, `s.sekretessmarkering.1`, `s.sekretess.1`, `s.konfidentiell.1`, `s.serviceskyldighet.1`, `s.service.2`, `s.vägledning.1`
- **Från 0.32 (25 ord):**
  - Privatekonomi: `s.inflation.1`, `s.räntekostnad.1`, `s.låneränta.1`, `s.inkomstskatt.1`, `s.skattepliktig.1`, `s.hushålla.1`
  - Arbetsplatsens vardag: `s.ha-hand-om.1`, `s.tjänstledighet.1`, `s.kränkande-särbehandling.1`
  - Jobbsökande & anställning: `s.befattning.1`
  - Företagande: `s.F-skatt.1`, `s.vinst.1`, `s.förlust.1`, `s.marknadsföring.1`, `s.bolag.1`
  - Marknadsekonomi: `s.stiga.1`, `s.konkurrent.1`, `s.sektor.1`, `s.effektivisera.1`, `s.arbetsmarknad.1`, `s.finanspolitik.1`, `s.penningpolitik.1`
  - Banker & investeringar: `s.obligation.1`, `s.sprida-riskerna.1`, `s.riskspridning.1`
  - *vinst* och *förlust* förväxlades med *gå med vinst*/*gå med förlust*, och *riskspridning*/*sprida riskerna* med *diversifiera*. Produktägaren kan överväga att markera dem som synonymer och testa igen.
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
- **0.31, svenska:**
  - *personuppgiftsansvarig*, *sekretessmarkering*, *skäligen misstänkt* och *ockerhyra* finns kanske inte i SAOL; *maska* (maskera uppgifter) är myndighetsjargong
  - substantiverade particip med bestämd form på -n (*skadelidanden*, *käranden*, *svaranden*), *förlikas* (deponens) och *tilltalad*/*sakkunnig* som adjektiv
  - *misstänkt* (adjektiv) sammanfaller med supinum av *misstänka*; *stämning* och *lag* har nu bara sina juridiska betydelser som egna poster
  - texterna i Polis och Civilrätt skriver runt ord från parallella grupper (*något olagligt* i stället för *brott*, *de två sidorna* i stället för *parterna*); de kan göras naturligare nu när hela kedjan finns
- **0.31, japanska:**
  - ungefärliga motsvarigheter: *god man* ({補佐人|ほさにん}), *huvudman*, *lagrum*, *villkorlig dom* ({条件|じょうけん}つき{判決|はんけつ}), *dråp* ({故殺|こさつ}), *målsägande* ({被害者|ひがいしゃ}), *strafföreläggande* ({略式命令|りゃくしきめいれい}), *nämndeman* ({参審員|さんしんいん})
  - egna översättningar av myndigheter: *hyresnämnden* ({賃貸|ちんたい}{紛争|ふんそう}{委員会|いいんかい}), *Kronofogden* ({執行庁|しっこうちょう})
  - *avvisa* ({却下|きゃっか}) mot *avslå*, och {要配慮個人情報|ようはいりょこじんじょうほう}, {黒塗|くろぬ}り
- **0.31, fakta (kontrollera lagrum):**
  - RB 36:17 (ledande frågor), lag 2018:1693 (dna-registret), prövotider (BrB 27–28 kap.), förvaltningslagen 5–7 och 40–46 §§, TF 2 kap. 15 §, föräldrabalken 11:4–5
  - beloppsgränsen för förenklat tvistemål (ungefär 30 000 kronor, ett halvt prisbasbelopp) ändras varje år
  - Brå-sammanfattningen om att upptäcktsrisken avskräcker mer än straffets längd
- **0.32, svenska:**
  - pluralord böjda som *glasögon*: *skyddsglasögon*, *samarbetssvårigheter*, *sociala medier*; *trakasseri* som singularlemma
  - *anställd* som substantiv (egentligen particip/adjektiv), *driven* i platsannonsbetydelsen, *säga upp sig* utan `particle`
  - *intervju* i stället för *arbetsintervju* (ordförrådskontrollen godkände inte sammansättningen)
  - *slogan* (sloganen, slogans), *vd* (vd:n, vd:ar), *handelspartner* (pluralen *partner*, SAOL tillåter även *partners*), *låna upp* om stater och företag
  - *Konkurrensverket* och *Arbetsförmedlingen* som oböjliga egennamn; *Bolagsverket* och andra myndighetsnamn står bara i `factSources`
- **0.32, japanska:**
  - egna eller ungefärliga översättningar: *OB-tillägg* ({深夜|しんや}・{休日|きゅうじつ}{勤務手当|きんむてあて}), *friskvårdsbidrag* ({健康増進手当|けんこうぞうしんてあて}), *F-skatt*, *handelsbolag* ({合名会社|ごうめいがいしゃ}), *trafikförsäkring* ({自賠責保険|じばいせきほけん}), *skattetabell*, *jobbskatteavdrag* ({勤労所得|きんろうしょとく}の{税額控除|ぜいがくこうじょ}), *köpstopp* ({買|か}い{物断|ものだ}ち)
  - *Arbetsförmedlingen* ({公共職業安定所|こうきょうしょくぎょうあんていじょ}), *permittera* ({一時帰休|いちじききゅう}させる), *statsskuld*, *placering* ({運用先|うんようさき}), *riktålder* ({目安年齢|めやすねんれい}), *premiepension* ({積立年金|つみたてねんきん})
- **0.32, fakta (kan ändras över tid):**
  - amorteringskravet (texten nämner bara 1 % över 50 % och 2 % över 70 % belåning) och bolånetaket 2026
  - gränsen för statlig inkomstskatt (ungefär 50 000 kr i månaden), nettolönsexemplet i Uppsala, sista dag för deklarationen
  - arbetsgivaravgiften (ungefär 31 %), aktiekapital 25 000 kr, momssatser, bokföringen sparas i 7 år
  - arbetstidslagen (11 timmars dygnsvila, rast efter fem timmar), läkarintyg från dag 8, LAS efter 2022 (provanställning högst sex månader, skriftlig information inom sju dagar)
  - inflationsmålet 2 % (KPIF), att ungefär hälften av produktionen exporteras och att Norge och Tyskland är de största handelspartnerna
  - insättningsgarantin (ungefär en miljon kronor), riktåldern 67 år 2026, pensionsavgiften 18,5 % (16 + 2,5)
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
  - `CACHE` i `public/sw.js` (nu `swechan-v36`)
  - `CHANGELOG.md` (överst), den här filen och `ROADMAP.md`
  - Kör `npm run typecheck && npm test && npm run validate:content && npm run build && npm run e2e`.
- **Git:** om `git status` visar opushade commits trots att pushen lyckades, jämför med `git ls-remote origin <gren>` och uppdatera spårningsreferensen.
- **e2e:** `scripts/e2e-smoke.mjs` använder den planerade modulen *Förskola och grundskola* (SWC-SAM-04-01-01) som exempel. Byt exemplet när den publiceras.
- **Blindtest:** ta fram listan över underkända bilder direkt ur `key.json` och `wordVisuals.json` (resultat ≠ `pass`), inte ur avkortad utdata från `art:blind:record`.
- Regler för innehåll och bilder står i `CONTENT_GUIDELINES.md`, för kod i `ARCHITECTURE.md`, och produktionsarbetet i `docs/PRODUCTION_BRIEF.md`.
