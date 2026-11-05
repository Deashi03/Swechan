# Changelog

## 0.7.0 – 2026-11-05

**Beslut:** utvecklingsnollställningen (`resetProgressOnUpdate`) är fortfarande på; 0.6.0 → 0.7.0 nollställer progressionen (återställningspunkt sparas).

**Bilder:** inga nya bilder i den här versionen (produktägarens beslut). Piloten från 0.6 ligger kvar oförändrad. Bilder och animationer läggs till när den nya infrastrukturen finns.

### 105 nya moduler (AI-utkast, ett överämne i taget)
Alla moduler är skrivna för sina katalogposter med verifierade 1:1-kopplingar. Varje modul har 15 ord, kontrollerat ordförråd och en linjär förkunskapskedja (`recommendedOrder` 322–328 för kläder, 401–442 för tid och 501–542 för handel). Ord som hör till senare överämnen har medvetet hållits utanför, till exempel biljett/hållplats (resor), lön/lån/försäkring (samhälle och ekonomi), sömn/stress/kroppsdelar (människan), recept/läkemedel (hälsa) och logga in/lösenord (datorer). Undantag som ligger nära senare ämnen men behövs här: *receptfri* och *halstablett* (Apotek och hygienbutiker), *klicka* och *sökfält* (Söka efter en vara) samt *tull* (Skicka utomlands). Totalt finns nu **215 publicerade moduler** och 1 541 nya ordposter.

- **Kläder & personlig stil** (21 moduler, området är nu helt publicerat)
  - *Storlek & passform*: Klädstorlekar och mått, Plagg som sitter löst eller tajt, Prova kläder, Sömmar och detaljer, Ändra och laga plagg, Färgmatchning, Stil och tillfälle
  - *Tvätt & klädvård*: Tvättsymboler och tvättråd, Sortera efter färg och material, Tvättmedel och sköljmedel, Torka och stryka, Fläckar och fläckborttagning, Vårda ull och siden, Laga knappar och sömmar
  - *Skönhet & grooming*: Frisyrer och hårtyper, Hårvårdsprodukter, Hudvårdsrutiner, Smink och kosmetika, Parfym och doft, Nagelvård och rakning, Besöka frisören
- **Tid & vardagsrutiner** (42 moduler, helt publicerat)
  - *Tid & kalender*: Klockslag och tidpunkter, Veckodagar och månader, Årstider och datum, Före och efter, Tidsspann och varaktighet, Tidsfrister och deadlines, Boka och ändra en tid
  - *Morgon & kväll*: Vakna och stiga upp, Göra sig i ordning, Frukost på morgonen, Pendla hemifrån, Kvällsmat och nedvarvning, Lägga sig och somna, Morgon- och kvällsvanor
  - *Planering & ärenden*: Att göra-listor, Prioritera uppgifter, Påminnelser och kalender, Boka möten, Skjuta upp och flytta fram, Att hinna och försena sig, Planera en ledig dag
  - *Vanliga vardagsverb*: Hämta och lämna, Ta fram och lägga undan, Sätta på och stänga av, Följa med och gå hem, Komma ihåg och glömma, Börja och sluta, Behöva och vilja
  - *Mått & mängder*: Antal och ordningstal, Vikt och volym, Längd och avstånd, Hastighet och temperatur, Ungefärliga mängder, Delar och andelar, Jämföra storlekar
  - *Problem i vardagen*: Tappa bort saker, Något går sönder, Missförstånd i hemmet, Bli försenad, Be om hjälp, Låna och lämna tillbaka, Lösa vardagliga konflikter
- **Handel & vardagstjänster** (42 moduler, helt publicerat)
  - *Livsmedelsbutiken*: Butikens avdelningar, Prislappar och jämförpriser, Köpa frukt och grönsaker, Hitta rätt produkt, Kassa och betalning, Erbjudanden och rabatter, Reklamera livsmedel
  - *Pengar & betalning*: Sedlar och mynt, Bankkort och kontanter, Kvitton och fakturor, Swish och digital betalning, Växel och återbetalning, Prenumerationer, Att jämföra priser
  - *Butiker & köpcentrum*: Klädbutiker, Elektronikbutiker, Apotek och hygienbutiker, Bokhandlar och presentbutiker, Öppettider och kundservice, Provrum och köer, Fråga personalen
  - *Köp på internet*: Söka efter en vara, Produktbeskrivningar och recensioner, Varukorg och kassa, Leveransalternativ, Paket och spårning, Ångerrätt och retur, Bedrägerier vid nätköp
  - *Post & paket*: Brev och vykort, Kuvert och frimärken, Paketstorlekar, Paketombud och utlämning, Skicka utomlands, Adress och postnummer, Försenat eller saknat paket
  - *Vardagliga tjänster*: Boka hantverkare, Kemtvätt och skrädderi, Kundtjänst och support, Bibliotekstjänster, Bokningar och avbokningar, Abonnemang och medlemskap, Klaga och begära ersättning

### Rättat
- **Repetitionen kunde fastna på ett ord som inte längre finns.** Om ett kort pekade på en betydelse som tagits bort ur innehållet visade repetitionen "Det här ordet finns inte längre" utan att gå att fortsätta. Sådana kort kan komma tillbaka via återställningspunkten eller en gammal säkerhetskopia. Dagens plan, extrarepetitionen och repetitionsskulden bortser nu från dem (`liveCards()` i `dailySession.ts`). Test i `moduleFlow.test.ts`.
- **Borttagen betydelse `s.nopprig.1` / `e.nopprig`** (publicerad i 0.5–0.6). Det var en felstavad dubblett av *noppig*. *Att känna igen kvalitet* använder nu den befintliga `s.noppig.1`. Gamla kort för `s.nopprig.1` ligger kvar i databasen men visas aldrig (se punkten ovan). Inga andra publicerade `m.*`- eller `s.*`-ID:n har ändrats.
- **Felalternativ med samma japanska glosa** valdes ibland samtidigt, vilket gav två likadana svarsknappar (t.ex. *lägga tillbaka* och *ställa tillbaka*). Distraktorvalet hoppar nu över en kandidat vars glosa överlappar ett redan valt alternativ.
- Japanska glosor justerade så att sökningen på 修理 fortsätter att hitta *laga* först (*lagning*, *reparation*).

### Övrigt
- Moduler utan bild tillåts: `art.test.ts` kräver bara en egen bild för varje rotområde, och att de bilder som finns är unika.
- Testet för grammatiktermer i meningsramar matchar inte längre ord som *bestämde* (falsklarm).
- Grundordförrådet utökat med vanliga ord och namn som texterna behöver (t.ex. *kod*, *konto*, *nyhet*, *följa*, *anmäla*, *beslut*, *yen*, *PostNord*).
- `APP_VERSION` 0.7.0, service workerns cache `swechan-v8`.

## 0.6.0 – 2026-11-05

**Beslut:** utvecklingsnollställningen (`resetProgressOnUpdate`) är fortfarande på; 0.5.0 → 0.6.0 nollställer progressionen (återställningspunkt sparas).

### Bilder på orden – pilot (användarens önskemål efter stickprov i 0.5)
- **En bild per betydelse** för alla 107 ord i *Vardagskläder* (7 moduler) plus tre fotoord för att prova blandningen: *bryna*, *mocka* och *manchester*.
- **Illustrationer som kod** i en ny, mer detaljerad bilderboksstil (`src/ui/wordArt/`): en verktygslåda för plagg (`kit.ts`) där det som skiljer orden åt är tydligt – krage, ärmar, huva, dragkedja, knappar, längd. Verb visas med händer och pilar, abstrakta ord med en kulturellt neutral scen (t.ex. *originell* = en färgglad figur bland grå, *tidlös* = vit skjorta och timglas). Illustrationerna laddas lat som egen del (28 kB, 10 kB gzip).
- **Foton** endast där skillnaden ligger i yta eller tillstånd. Fritt licensierade (CC0/CC BY) via Openverse, beskurna till 400 × 400 och komprimerade (24–41 kB). Upphovsperson och licens visas vid ordet och under Inställningar → Bildkällor.
- **Bildregister** `src/content/data/images/wordImages.json`: bildtyp, `quiz` (bilden är entydig nog för bildfrågor), visuell `group` och `confusableWith`. Validering: kända betydelser, symbolbilder aldrig i bildfrågor; test: motiv finns, fotofiler finns och är små, licens anges.

### Var bilderna visas
- **Ordintroduktionen**: alltid när ordet har en bild.
- **Nya övningar**: *bild → fyra ord* (`image_choice`) och *ord → fyra bilder* (`image_pick`, namnen visas först efter svaret). I steg 1 ersätter de igenkänningsrundan för ord med entydig bild; i repetitionen ingår de bland betydelseövningarna. De räknas som betydelseövningar (ingen ny korttyp, oförändrat antal repetitioner).
- **Stavning**: bilden visas tillsammans med den japanska ledtråden.
- **Inte** i luckmeningar, böjningsövningar eller japanska → svenska (bilden skulle avslöja svaret eller ersätta översättningsträningen).

### Alternativ som inte går att blanda ihop
- Distraktorer i bildövningar måste ha en entydig bild, komma från en **annan visuell grupp** och får inte vara **deklarerat förväxlingsbara** åt något håll. Bilden på en brynt biff får alltså aldrig alternativet *steka*; *kofta* och *munkjacka* (samma grupp) visas aldrig tillsammans; allmänna ord som *långbyxor* och *underkläder* är aldrig alternativ.
- Ord utan entydig bild (t.ex. *klädstil*, *ha på sig*, detaljer som *ärm*) får bild i introduktionen men inga bildfrågor.
- Tester genererar varje bildövning med flera slumpfrön och underkänner varje otillåtet alternativ.

### Övrigt
- `npm run art:words` skriver ett kontaktark med alla ordbilder för granskning.
- Bilderna förladdas för offline tillsammans med lektionerna.
- `APP_VERSION` 0.6.0, service workerns cache `swechan-v7`.

## 0.5.0 – 2026-11-05

**Beslut:** utvecklingsnollställningen (`resetProgressOnUpdate`) är fortfarande på; 0.4.0 → 0.5.0 nollställer progressionen (återställningspunkt sparas, Inställningar → Säkerhetskopia → Ångra).

### Rättat (användarens feedback på 0.4)
- **Svaret syntes i frågan.** Omvända val (japanska → svenska) och stavning visade ibland svenska ordet i japansk definition, exempel eller ledtråd. `maskAnswer()` döljer nu alla former av svaret (＿＿＿) i fråga, underrubrik och ledtråd, och valideringen underkänner en japansk översättning/definition som innehåller det svenska ordet. Sex betydelser skrevs om (konstruktionen flyttad till `usageNote`). Nytt test: inget återkallningsprompt innehåller någon form av svaret.
- **Moduler under fel överkategori.** De fem äldre modulerna låg direkt i underområden och syntes i flera menyer. De ligger nu i ämnesgrupper (t.ex. *Hemmet och vardagliga aktiviteter* i Hem & boende → Städning & underhåll, *Material och ämnen* i Kemi → Atomer & periodiska systemet). `validateCatalog` underkänner en placering i en kategori som har underkategorier, och en ämnesgrupp får högst åtta val totalt.

### Bilder (stil "Platt", användarens val av fem varianter)
- Egna SVG-illustrationer (inga emojis) för de åtta rotområdena och **varje publicerad modul**: `src/ui/art/` (`motifs.ts` med motiv på ett 64×64-rutnät, `render.ts`, `<Art>`). Visas i Kurser (områden och ämnesgrupper) och på modulkort.
- Test: varje publicerad modul har en egen, unik bild. `npm run art:sheet` skriver ett kontaktark för granskning.

### 102 nya moduler (AI-utkast, ett överämne i taget)
Alla skrivna för sina katalogposter med verifierade 1:1-kopplingar, 15–20 ord, kontrollerat ordförråd och en linjär förkunskapskedja per område. Ord som hör hemma i senare ämnen (t.ex. budget, lån, försäkring, folkbokföring, konflikt, glasögon, väva/sticka, mikroplast) har medvetet hållits utanför.

- **Hem & boende** (42 moduler)
  - *Bostadstyper & rum*: Hus och lägenheter, Husets olika rum, Utrymmen i flerbostadshus, Att beskriva en bostad, Planlösning och boyta, Flytta till ny bostad, Boendeformer i Sverige
  - *Möbler & inredning*: Soffor och fåtöljer, Bord och stolar, Sängar och sovrumsmöbler, Förvaring och hyllor, Lampor och belysning, Färger och inredningsstilar, Att möblera ett rum
  - *Kök & hushållsredskap*: Kökets större apparater, Redskap för matlagning, Porslin och bestick, Förvaringskärl och burkar, Köksmaterial och ytor, Att duka ett bord, Säkerhet i köket
  - *Badrum & hygienutrymmen*: Toalett och handfat, Dusch och badkar, Handdukar och badrumstextil, Hygienartiklar hemma, Tvättstuga och tvättmaskiner, Avlopp och vattenkranar, Badrumsproblem och reparation
  - *Städning & underhåll*: Städredskap och rengöringsmedel, Dammsuga och torka golv, Tvätta kläder och textilier, Sortera och slänga sopor, Små reparationer hemma, Skador och slitage, Veckostädning och rutiner
  - *Hyra, köpa & grannar*: Bostadsannonser och visningar, Hyresavtal och hyresvärd, Avgifter och boendekostnader, Bostadsrätt och förening, Grannar och störningar, Felanmälan och service, Flyttdag och adressändring
- **Mat & måltider** (39 moduler)
  - *Råvaror & skafferi*: Frukter och bär, Spannmål och gryn, Bönor och linser, Nötter och frön, Kryddor och örter, Torrvaror och konserver
  - *Kött, fisk & vegetariskt*: Styckningsdelar och köttsorter, Fågel och ägg, Fiskarter och skaldjur, Vegetariska proteinkällor, Mejeriprodukter och alternativ, Att välja råvaror, Hållbarhet och förvaring
  - *Matlagningens verb*: Steka och bryna, Grädda och baka, Vispa och röra, Krydda och smaka av, Tillaga och servera
  - *Smaker & konsistenser*: Grundsmaker och dofter, Söta och syrliga smaker, Starka och milda smaker, Krispigt och knaprigt, Mjukt och segt, Färskhet och mognad, Beskriva en maträtt
  - *Måltider & servering*: Frukostmat och frukostvanor, Lunch och middag, Mellanmål och fika, Portioner och tillbehör, Restaurangmenyer, Beställa och betala på restaurang, Matbordets samtal
  - *Kost & matkultur*: Svenska husmansrätter, Japansk mat på svenska, Mat från olika världsdelar, Specialkost och allergener, Näringsämnen i maten, Matsvinn och rester, Högtidsmat och traditioner
- **Kläder & personlig stil** (21 moduler)
  - *Vardagskläder*: Tröjor och skjortor, Byxor och kjolar, Klänningar och kostymer, Underkläder och strumpor, Jackor och ytterplagg, Sportiga vardagskläder, Att beskriva en outfit
  - *Skor & accessoarer*: Vardagsskor och kängor, Finskor och klackar, Mössor och hattar, Halsdukar och handskar, Väskor och ryggsäckar, Smycken och klockor, Bälten och små tillbehör
  - *Textilier & material*: Bomull och linne, Ull och silke, Syntetiska textilmaterial, Läder och mocka, Mönster och texturer, Tygers egenskaper, Att känna igen kvalitet

Hem & boende och Mat & måltider är **helt publicerade** (inga planerade poster kvar). Ordboken har nu 1 695 uppslagsord / 1 734 betydelser, alla `ai-draft` (ingen mänsklig granskning). Inga uppslagsord dubblerade; nya betydelser lades till befintliga poster där ordet redan fanns (t.ex. *kök* matkultur, *släcka* lampa, *tång* redskap).

### Innehållsverktyg och kontroller
- Grundordförrådet utökat med verkligt grundläggande A1–A2-ord, oregelbundna former och namn som texterna behövde.
- Ordförrådskontrollen godtar sammansättningar av två kända ord (med fogemorfem -s- och stamform av -a/-e-ord; huvudordet måste vara känt), namn i genitiv och flerordsuttryck med tre ord.
- `module:validate` rapporterar även fel på modulens ordposter (`e.*`), och flera moduler kan kontrolleras i ett svep (`checkModules`): testet för alla moduler gick från 66 s till 4 s.
- Distraktorvalet cachar glosor och listan över alla betydelser (snabbare övningsgenerering i appen; testsviten 110 s → 23 s).
- Tester som räknade med ett visst antal moduler eller en viss planerad post är nu oberoende av hur många moduler som publiceras.
- Modul-ID får innehålla ü.

### Release
- `APP_VERSION` 0.5.0, `package.json` 0.5.0, service workerns cache `swechan-v6`.
- E2E använder en fortfarande planerad post (*Prova kläder*) för kontrollen att planerade moduler saknar Starta-knapp.

## 0.4.0 – 2026-11-04

**Beslut:** utvecklingsnollställningen (`resetProgressOnUpdate`) är på även vid 0.4-releasen (produktägarens beslut under systemutvecklingen).

### Fas A – säker baslinje (PR "0.4 fas A")
- Baslinje före ändringar: `npm ci`, `typecheck`, 95/95 tester, `validate:content` 4/4, `build` – alla gröna.
- **Rättat:** att ångra en utvecklingsnollställning (eller importera en äldre säkerhetskopia) återställde också det gamla versionsnumret, så nästa start nollställde allt igen och ångringen gick förlorad. Återställd/importerad data markeras nu med den körande versionen.
- **Rättat:** en användare med enbart sparade ord eller enbart svarshistorik räknades inte som "har data" vid versionsbyte.
- `applyVersionResetWith(cfg)` gör nollställningsregeln testbar med `resetProgressOnUpdate` både `true` och `false`.
- Nya granskningstester (`src/dev/versionReset.audit.test.ts`): ångra, import av äldre backup, bara sparade ord, användare utan lagrad version, återställningspunktens innehåll (en generation, aldrig nästlad), regeln avstängd.
- README: 15–20 ord per modul (stod 20–30).
- Ingen ändring av FSRS, streak, IndexedDB-schema, ord- eller modul-ID:n. `APP_VERSION` är oförändrad (0.3.1) för att inte utlösa någon nollställning.

### Fas B – planerad katalog (PR "0.4 fas B")
- **Den riktiga katalogen** `planning/catalog/swechan-catalog.v1.json` (344 kategorier, 2 016 planerade moduler) är nu datakällan för katalogindexet. Inga syntetiska produktionsdata; syntetiska fall finns bara i isolerade tester.
- Separata Zod-scheman för planerade katalogposter (`src/content/catalog/schema.ts`), helt skilda från `Module`-lektioner.
- `CatalogIndex`: deterministisk uppbyggnad i katalogens ordning, menyval per skärm, sökning i metadata, översättningsstatus.
- `validateCatalog`: unika ID:n, trädstruktur, högst tre kategorinivåer, moduler bara i ämnesgrupper, **högst åtta val per menyskärm** (högst sju moduler per ämnesgrupp), 15–20 målord, kopplingar och att inga planerade poster är startbara.
- **De fem publicerade modulerna** behåller sina `m.*`-ID:n och får **kompatibilitetsplaceringar** (`src/content/data/catalog/publishedMapping.json`) i Hem & boende, Kemi och Militärhistoria. Ingen motsvarar exakt en katalogpost, så inga 1:1-kopplingar görs; ämnesöverlapp dokumenteras separat.
- Planerade moduler kan inte startas: de finns inte i lektionsrepositoriet, `startOrResumeLearn` avvisar dem och `recommendedModule` föreslår dem aldrig (testat).
- Katalogen laddas lat (`loadCatalog`) som en egen del och ingår inte i startpaketet. Nya skript: `npm run catalog:validate`; katalogtesterna ingår i `npm run validate:content`.

### Fas C – Kurser och global sökning (PR "0.4 fas C")
- Fliken **Kurser** bygger nu på den riktiga katalogen: 8 områden → underområden → ämnesgrupper → moduler, högst åtta val per skärm. Rotnivåns lista "Alla moduler" är borttagen.
- Varje val visar hur många moduler som är **klara att studera** respektive **planerade**. Publicerade lektioner visas som modulkort och kan startas; planerade moduler är märkta *Planerad* och leder till en **informationsvy utan Starta-knapp** ("Den här modulen är inte färdig än"), med närliggande publicerade moduler.
- **Global sökning** i katalogens metadata (ämnen och planerade moduler) plus publicerade moduler och ord, i typade sektioner med **sidindelning (8 per sida)**.
- Modulsidans brödsmulor följer modulens placering i katalogen.
- Katalogdelen (352 kB, 39 kB gzip) laddas först när Kurser öppnas; startpaketet växte ~8 kB (Kurser-koden). Laddningsfel visar "Försök igen".

### Fas D – lat laddning av lektioner (PR "0.4 fas D")
- **Modulindex** `src/content/data/moduleIndex.json` (genereras med `npm run content:index` från `src/content/data/modules/*.json`; ett test underkänner ett inaktuellt index). Indexet innehåller metadata och ord, inte lästext och samtal.
- `ContentRepository.loadModuleBody(id)` laddar en lektion lat (egen del per modul), validerar den, cachar den och tillåter nytt försök efter fel; planerade katalog-ID:n och okända moduler avvisas (`ModuleNotAvailableError`). `getModule(id)` returnerar nu indexposten.
- Läs- och samtalssteget laddar lektionen via `useModuleBody` med laddning, fel och "Försök igen" (särskilt meddelande offline).
- **Offline:** alla publicerade lektioner förladdas när webbläsaren är ledig (service workern cachar dem); modulsidan visar *Sparad offline*. Service workern letar efter nya versioner när appen kommer till förgrunden.
- Validatorer och tester använder `toolingRepository()` (alla lektioner i minnet); appkoden importerar aldrig den.
- **Uppmätt** (vite build): startinnehållet 140,1 → 121,5 kB (gzip 36,2 → 30,3 kB); appkoden +3 kB; varje lektion är en egen del på ~5 kB. Laddtid tills välkomstskärmen (Chromium, iPhone-emulering, 1,6 Mbit/s, 150 ms latens, median av 5): fas C 1 473 ms → fas D 1 448 ms (−2 %). Liten vinst med fem moduler; poängen är att startpaketet inte växer med antalet lektioner.
- `@types/node` tillagt (utvecklingsberoende) för test/verktyg.

### Fas E – verktyg för innehållsproduktion (PR "0.4 fas E")
- Körbara kommandon (via `vite-node`): `catalog:validate`, `module:new`, `module:validate`, `content:report`. Logiken ligger i `src/content/tools/` och är enhetstestad.
- `module:new` skapar ett utkast från en **planerad katalogpost** (katalogens titel och målordsantal; föreslår `m.<slug>`); utkastschemat kräver 15–20 planerade målord och föreslår återanvändning av befintliga betydelser.
- `module:validate` kontrollerar ett utkast eller en publicerad modul: schema, betydelsereferenser, furigana, böjning, att målorden finns i texten, frågor, kontrollerat ordförråd och katalogplacering.
- `content:report`: publicerat/planerat, granskningsstatus, saknade japanska titlar, brutna referenser, ointroducerade ord, dubbletter, katalogproblem.
- Ny regel: `quality.status: reviewed` kräver `reviewer` och `date`.
- Nya moduler får placeras direkt i en katalogkategori (`categoryId` R…); gamla `c.*` fungerar fortfarande.
- CI kör nu även `content:index -- --check` och `catalog:validate`.

### Fas F – tre nya moduler i en förkunskapskedja (PR "0.4 fas F")
- **Vanliga grönsaker** (`m.vanliga-gronsaker`, 17 ord) → **Skära och hacka** (`m.skara-och-hacka`, 16 ord) → **Koka och sjuda** (`m.koka-och-sjuda`, 15 ord), skrivna för katalogposterna SWC-VAR-02-01-01, SWC-VAR-02-03-01 och SWC-VAR-02-03-02. De är de första **verifierade 1:1-kopplingarna** i `publishedMapping.json` (samma titel, ämne och placering).
- Ny ordboksfil `src/content/data/dictionary/food.json` (47 uppslagsord, inga dubbletter av befintliga poster). Flera ord har flera betydelser (sallad, svamp, tärning, riva, koka, gryta, slö) med tydliga etiketter. Fyra kärnord tillagda (orange, smak, blad, hälla).
- **AI-utkast:** alla nya ord har `quality.status: ai-draft`; ingen mänsklig språkgranskning har gjorts.
- Alla tre klarar kontrollerat ordförråd, `module:validate`, `validate:content` och `catalog:validate`.
- E2E-flödet går nu även igenom kedjan: Kurser → Vardag & hem → Mat & måltider → ämnesgrupp (planerad post utan Starta-knapp) → Vanliga grönsaker → lär → läs → samtalsprompt → nästa dags repetition med de nya korten.
- Tester uppdaterade för åtta moduler (rekommenderad ordning, katalogkopplingar, `module:new` mot en fortfarande planerad post).

### Fas G – release
- `APP_VERSION` 0.4.0, `package.json` 0.4.0, service workerns cache `swechan-v5`.
- **Obs! Uppdateringen nollställer progressionen** (produktägarens beslut, utvecklingsläget är på). En återställningspunkt sparas: Inställningar → Säkerhetskopia → Ångra.
- Nytt releasetest `src/dev/release04.migration.test.ts`: en fullständig 0.3.1-användare (klar modul, påbörjat modulsteg, FSRS-kort med historik, två dagliga sessioner, streak, sparat ord, inställningar). Med regeln **av** blir all data oförändrad och steget kan fortsättas. Med regeln **på** töms progressionen men inställningarna behålls, och Ångra återställer allt utan att det nollställs igen vid nästa start.
- CI har ett separat e2e-jobb (Playwright 1.63.0, Chromium med iPhone-emulering). Det blockerar inte publiceringen.
- WebKit/Safari och fysisk iPhone: **EJ TESTAT** (finns inte i utvecklingsmiljön).

## 0.3.1 – 2026-11-04
Utvecklings- och testvänlighet (önskemål från produktägaren).

### Ändrat
- **Moduler har 15–20 ord** (tidigare 20–30). Alla fem moduler är nedkortade till 20 ord; borttagna ord finns kvar i ordboken. Lästexter och frågor justerade.
- **Inget "32/122"**: inlärningen visar bara den del du är i ("Del 2 av 4") med en stapel för delen och prickar för delarna.
- **Versionsnumret syns** på startsidan (bredvid hälsningen) och på välkomstsidan.

### Tillagt – utvecklingsläge (`devConfig` i `src/config/appConfig.ts`)
- **Nollställning vid varje ny version**: all progression (moduler, repetition, streak, nivåtest) nollställs när appen uppdateras; inställningar behålls och en återställningspunkt sparas (Inställningar → Säkerhetskopia → Ångra). Ett meddelande visas på startsidan.
- **Utvecklarverktyg** i Inställningar: simulera datum (±1 dag), lås upp alla modulsteg, lägg alla ord i repetitionen, gör alla kort förfallna, planera dagens repetition på nytt, slutför dagens repetition direkt, nollställ manuellt. ⏭-knapp i inlärningen för att hoppa över ett steg.

## 0.3.0 – 2026-11-04
Fokus: ny visuell design ("Fjord") och tydligare övningar.

### Ändrat – design
- Ny designriktning **Fjord** (vald bland 31 skisser): professionell läroplattform med lugn vit/grå grund, en stark blå huvudfärg och en liten gul accent som lätt svenskt inslag. Typsnittet Manrope (lokalt i appen, fungerar offline).
- Ny startsida: hälsning med Jonathan, kortet **Dagens pass** med båda delarna och *en* knapp som alltid fortsätter med nästa sak, veckokort med streak, **Dagens svenska ord**.
- Ny övningsvy: ordkort med exempelmening, svarsalternativ med A–D, resultat i en panel längst ner med "Fortsätt".
- Flikarna heter nu Hem, Kurser, Repetition och Ordbok.
- **Jonathan**: den tillfälliga figuren är ersatt av en Jonathan-platshållare (monogram) som redan reagerar på inlärningshändelser; den riktiga avataren kan bytas in utan att layouten ändras.

### Rättat – pedagogik (från användartest)
- **Tvetydiga kontextfrågor**: felalternativen hämtas nu från ett annat ämnesområde och har samma ordklass, form och genus som målordet – bara ett alternativ passar i meningen, och grammatiken avslöjar inte svaret. Den japanska översättningen visas först som ledtråd eller efter svaret.
- **Böjningsövningar** använder naturliga meningar där bara en form passar ("Jag tänker på de ___.", "Isen ___ i går.") i stället för "alla ___" (som godtog både *sängar* och *sängarna*). Inga grammatiktermer i instruktionerna ("bestämd plural", "grundform, substantiv" m.m. är borta). Ordets egna meningsramar kan anges i innehållet (`frame`).
- Övningen går inte längre vidare automatiskt efter rätt svar (det kunde byta övning bakom ordboken).

## 0.2.0 – 2026-11-04
Fokus: pedagogiskt innehåll som bygger på vad eleven redan kan.

### Tillagt
- **Kontrollerat ordförråd**: grundordförråd (~920 ord, A1–A2) och en automatisk språkkontroll (`npm run validate:content`). Definitioner, exempel, lästexter och frågor får bara använda grundord, ord från förkunskapsmoduler och ord som lärts in tidigare i modulen. Kontrollen hittade 196 problemtexter i 0.1-innehållet; nu 0.
- **Inlärningskedjor**: två nya grundmoduler – *Material och ämnen* (21 ord, före *Atomer och molekyler*) och *Krig och försvar* (21 ord, före *Medeltida slott och belägringar*). *Dagens modul* föreslår bara moduler vars förkunskaper är klara (även för avancerade användare); modulsidan visar vad en modul bygger på.
- **Flera betydelser tydligt**: varje betydelse har en kort etikett (`labelSv`). Ordintroduktionen visar en egen sektion med ordets alla betydelser och vilken som lärs in. *ämne* har nu fem betydelser (substans, skolämne, samtalsämne/tema, material att göra något av, "ämne till").
- Ord i förklaringar, exempel och läsfrågor som finns i ordboken går att trycka på för uppslagning.

### Ändrat
- Allt innehåll omskrivet med enklare förklaringar (svenska och japanska säger samma sak), nya lästexter och frågor. Orden i varje modul ligger i inlärningsordning.
- *ämne*, *bestå* flyttade till *Material och ämnen*; *försvara*, *anfalla*, *vapen* till *Krig och försvar*. Betydelse-ID:n är oförändrade, så befintlig repetitionshistorik påverkas inte. `s.ämne.2` är nu enbart "skolämne" (tema är `s.ämne.3`).

### Rättat
- "Hoppa över" på välkomstsidan skickade tillbaka användaren till välkomstsidan (kapplöpning i onboarding-kontrollen). Täcks nu av e2e-testet.

## 0.1.0 – 2026-11-04
Första versionen.

### Tillagt
- Projektgrund: React 19 + TypeScript + Vite, PWA (manifest, service worker, ikoner), GitHub Actions för test och GitHub Pages.
- Content System: Zod-scheman, furigana-markering med validering, böjningstabeller per ordklass, kategoriträd, återanvändbara grammatiknoteringar, synonymjämförelser, innehållsvalidator (`npm run validate:content`).
- Innehåll: 3 moduler (Hemmet och vardagliga aktiviteter, Atomer och molekyler, Medeltida slott och belägringar), 77 ordposter med 86 betydelser, 4 jämförelser, 8 grammatiknoteringar, 15 nivåtestfrågor.
- Learning Engine: 6 övningstyper (betydelse, omvänd, kontext, synonymnyans, stavning, böjning), svarskontroll med strikt å/ä/ö, flerstegsåterkoppling, steg-1-plan i batchar, kunskapsnivåer, svåra ord, sammanblandade ord, nivåtest.
- Repetition Engine: FSRS (ts-fsrs) bakom utbytbart gränssnitt, separata kort per betydelse och dimension, urval med prioritering och spridning, repetitionsskuld och extrarepetition.
- Daily Session System, Streak System (freezes, kalender, tidszons-/sommartidssäkert), modulprogression med paus/återupptagning.
- Dictionary System: sökning på svenska, böjningsformer, japanska, kanji och kana; global sökning; textsegmentering för interaktiv läsning; ordbok som bottom sheet under övningar.
- Conversation System: automatiskt genererad ChatGPT-prompt + adapter.
- Talsyntes via Web Speech API (endast om svensk röst finns).
- Sparade ord och inlärning av egna ord utanför moduler.
- Statistik, inställningar, export/import med validering och återställningspunkt.
- Händelsebuss och platshållaravatar med reaktioner; stöd för reducerad rörelse.
- Tester: 79 Vitest-tester + e2e-acceptanstest (Playwright).
