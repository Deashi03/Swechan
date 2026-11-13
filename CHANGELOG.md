# Changelog

## 0.36.0 – 2026-11-13

42 nya moduler som gör överämnet *Historiska epoker* (R04-A01) komplett, det första i rotområdet *Historia & humaniora*. Varje nytt modulord har en egen bild, utom de 20 ord som underkändes i två blindtestomgångar. Långa ord flödar inte längre ut ur ordkortet.

### Moduler (42 nya, 726 målord)
- **Förhistorisk tid** (1901–1907): jägar- och samlarsamhällen, de första bosättningarna, jordbrukets uppkomst, stenålderns redskap, bronsålderns samhällen, järnålderns vardag och att tolka förhistoriska fynd.
- **Antiken** (1911–1917): grekiska stadsstater, Aten och demokrati, Sparta och krigarkultur, romerska republiken, romerska kejsardömet, livet i antika städer och antikens arv.
- **Medeltiden** (1921–1927): feodalism och vasaller, bönder och gods, kloster och kyrka, handelsstäder och skrån, digerdöden, medeltida kungamakt och medeltidens vardagsliv.
- **Tidigmodern tid** (1931–1937): renässans och humanism, reformationen, upptäcktsresor, koloniala imperier, absolutism och hovliv, vetenskapliga revolutionen och Europas handelsvägar.
- **Revolutioner & industrialisering** (1941–1947): upplysningen, amerikanska revolutionen, franska revolutionen, industrialiseringens fabriker, arbetarrörelsens framväxt, nationernas omvandling och 1800-talets urbanisering.
- **1900-tal till nutid** (1951–1957): första världskrigets samhällen, mellankrigstiden, andra världskrigets samhällen, kalla kriget, avkolonisering, välfärdssamhällets utveckling och globaliseringens historia.
- Varje modul har 15–19 målord, lästext med fem frågor och konversationsunderlag. Det finns 450 nya ordposter. Ord som redan fanns återanvänds med sitt `senseId`.
- Nya betydelser på befintliga poster: *röja*, *gjuta* och *offra* (förr), *utesluta* (från en grupp), *myt* (berättelse om gudar), *län* (medeltida), *ärftlig* (makt och jord), *mässa* (gudstjänst), *marknad* (på torget), *perspektiv* (i en bild), *etikett* (uppförande), *kol* (bränsle) och *mobilisera* (militärt).
- Lästexterna nämner allmänt kända historiska personer (t.ex. Sokrates, Caesar, Luther, Galilei, Napoleon, Branting, Gandhi). Namnen ligger i grundordförrådets `names`. Årtal och fakta står i `factSources`.
- *miljonprogrammet* i *Välfärdssamhällets utveckling* återanvänder `s.miljonprogram.1` från 0.34 i stället för en ny post. *båge*, *mästare* (i ett skrå) hade saknat bild och har fått bilder.
- `catalog.test.ts` räknar nu publicerade moduler i *Militärhistoria* (R04-A02) i stället för hela R04.

### Bilder (445 nya ordbilder)
- 167 symbolbilder, 150 bilder som får användas i bildövningar och resten scener.
- 188 symbol- och adjektivbilder blindtestades. 168 klarade testet efter högst två omgångar.
- **20 ord saknar bild** efter två underkända omgångar. De har planstatus `none` och står i `VISUAL_MISSING_AFTER_BLIND_TEST`, se `PROJECT_STATUS.md` → *Saknade bilder*.
- Äkta synonymer är markerade som förväxlingsbara: *folkstyre/demokrati* och *absolutism/envälde*.
- Nya bildfiler i `src/ui/wordArt/`: `prehistory.ts`, `antiquity.ts`, `middleAges.ts`, `earlyModern.ts`, `revolutions.ts` och `modernHistory.ts`.

### Gränssnitt
- **Långa ord flödar inte längre ut ur ordkortet.** Rubrikordet i ordintroduktionen, i övningarna och i ordboken hade en fast storlek (38 px) och kunde inte brytas, så långa sammansättningar som *yttrandefrihetsgrundlagen* gick utanför kortet och under högtalarknappen på en telefon. Nu krymper rubriken så att ordets längsta del får plats (container query, `--fit-len`, `components/fitWord.ts`), aldrig under 14 px; korta ord behåller full storlek. Utan stöd för container queries bryts ordet i stället. Det gällde omkring 1 660 modulord med en del på 12 tecken eller mer.

### Verktyg och test
- e2e-testets planerade exempel är *Bronsålderns vapen* (Historia & humaniora → Militärhistoria → Forntida krigföring).
- Nytt test för `fitWord`.

Service workern är `swechan-v40`.

## 0.35.0 – 2026-11-12

42 nya moduler som gör överämnet *Medier & samhällsdebatt* (R03-A06) komplett, och därmed hela rotområdet *Samhälle & institutioner* (R03). Varje nytt modulord har en egen bild, utom de 25 ord som underkändes i två blindtestomgångar.

### Moduler (42 nya, 693 målord)
- **Nyhetsmedier** (1801–1807): tidningar och nyhetsredaktioner, rubriker och ingresser, reporter och redaktör, nyhetsvärdering, nyhetsintervju, publicering och rättelse samt lokala och internationella nyheter.
- **Källkritik** (1811–1817): källa och avsändare, primär- och sekundärkällor, fakta och åsikt, bekräfta uppgifter, desinformation och rykten, manipulerade bilder och att kritiskt läsa en nyhet.
- **Sociala medier** (1821–1827): inlägg och kommentarer, följa och dela, algoritmer och flöden, influencers och publik, hashtaggar och trender, digitala konflikter och sekretessinställningar.
- **Reklam & påverkan** (1831–1837): annonser och kampanjer, målgrupper, varumärken, retoriska knep, sponsring, produktplacering och konsumentpåverkan.
- **Debatt & opinion** (1841–1847): debattartikel och insändare, argument och motargument, opinionsundersökningar, politiska debatter, saklighet och ton, polarisering och offentlig diskussion.
- **Yttrandefrihet & medierätt** (1851–1857): yttrandefrihetens grunder, pressfrihet, ansvarig utgivare, upphovsrätt i medier, integritet och publicering, förtal och kränkningar samt gränser för publicering.
- Varje modul har 15–19 målord, lästext med fem frågor och konversationsunderlag. Det finns 336 nya ordposter. Ord som redan fanns återanvänds med sitt `senseId`.
- Nya betydelser på befintliga poster: *bilaga* och *notis* (i en tidning), *slå upp* (stort), *rapportera* (i nyheterna; på nätet), *avsändare* (av information), *beroende* och *i andra hand* (om källor), *spåra* (var något kommer ifrån; en person), *vinkel* (i en text), *lägga ut*, *dela*, *räckvidd*, *visning*, *utmaning*, *fluga* (modefluga), *inställning* och *behörighet* (på nätet), *tilltala* och *knep* (i reklam), *ambassadör* (för ett företag), *replik* (skriftligt svar), *gå framåt* och *backa* (i opinionen).
- *reklam*, *gilla* och *följa* hade bara funnits i grundordförrådet och har nu egna poster. *ledare* och *läger* är nya poster där betydelse 2 (ledarartikel, åsiktsläger) är modulord.
- Grupperna skrevs parallellt med listor över varandras ord. *korrekt* skrevs av både Nyhetsmedier och Källkritik och ägs av Nyhetsmedier. *rapportera* och *spåra* fick betydelse 3 eftersom betydelse 2 redan hade lagts till av en tidigare grupp. *s.uppdatera.1* och *s.utmana.1* hade saknat bild och har fått bilder.

### Bilder (338 nya ordbilder)
- 175 symbolbilder, 76 bilder som får användas i bildövningar och resten scener.
- 200 symbol- och adjektivbilder blindtestades. 175 klarade testet efter högst två omgångar.
- **25 ord saknar bild** efter två underkända omgångar. De har planstatus `none` och står i `VISUAL_MISSING_AFTER_BLIND_TEST`, se `PROJECT_STATUS.md` → *Saknade bilder*.
- Där granskaren uttryckligen skrev att två ord förväxlas lätt underkändes bilden även med medelsäker rätt svar, så att den fick en ny chans i omgång 2.
- Äkta synonymer är markerade som förväxlingsbara, bland annat *primärkälla/förstahandskälla*, *sekundärkälla/andrahandskälla*, *korrigera/rätta* och *opinionsmätning/opinionsundersökning*.
- Nya bildfiler i `src/ui/wordArt/`: `newsMedia.ts`, `sourceCriticism.ts`, `socialMedia.ts`, `advertising.ts`, `debate.ts` och `mediaLaw.ts`.

### Verktyg och test
- e2e-testets planerade exempel är *Jägar- och samlarsamhällen* (Historia & humaniora → Historiska epoker → Förhistorisk tid).

Service workern är `swechan-v39`.

## 0.34.0 – 2026-11-12

42 nya moduler som gör överämnet *Städer & offentlig service* (R03-A05) komplett. Varje nytt modulord har en egen bild, utom de 9 ord som underkändes i två blindtestomgångar.

### Moduler (42 nya, 725 målord)
- **Stadens platser** (1701–1707): torg och gågator, bostadskvarter, parker och lekplatser, industriområden, stadskärna och förort, landmärken och mötesplatser samt att beskriva en stadsdel.
- **Offentliga byggnader** (1711–1717): stadshus och myndighetskontor, sjukhus och vårdcentraler, skolor och bibliotek, polisstation och brandstation, idrottshall och simhall, kulturhus och museum samt att besöka en offentlig byggnad.
- **Samhällsservice** (1721–1727): sophämtning och återvinning, dricksvatten och avlopp, snöröjning och gatustädning, räddningstjänst, kollektivtrafikens ansvar, äldreomsorg och medborgarservice.
- **Bostads- & stadsplanering** (1731–1737): detaljplan och bygglov, gator och kvarter, grönområden, trafikplanering, nybyggnation, renovering av stadsdelar och hållbar stadsutveckling.
- **Befolkning & migration** (1741–1747): folkbokföring, befolkningsstatistik, inflyttning och utflyttning, invandring och utvandring, uppehållstillstånd, integration och språkinlärning samt medborgarskap.
- **Civilsamhälle** (1751–1757): ideella föreningar, styrelse och stadgar, medlemskap och avgifter, volontärarbete, insamlingar och donationer, lokalt engagemang samt gemenskap och föreningsliv.
- Varje modul har 16–19 målord, lästext med fem frågor och konversationsunderlag. Det finns 419 nya ordposter. Ord som redan fanns återanvänds med sitt `senseId`.
- Nya betydelser på befintliga poster: *barnavdelning* (på bibliotek), *föreställning* (på teater), *damm* (liten sjö), *rabatt* (med blommor), *stämning* (atmosfär), *salta* (vägar), *inflyttning* och *utflyttning* (till och från en ort), *ursprungsland* (om personer), *anknytning* (familjeband), *utvisning* (från ett land och i sport), *kassör* (i en förening) och *motion* (förslag till årsmöte).
- *myndighet*, *sjukhus*, *museum*, *bastu*, *befolkning*, *statistik*, *landsbygd*, *fly* och *uttal* hade bara funnits i grundordförrådet och har nu egna poster.
- `s.förening.1` (kemi) har fått en enklare definition och ett nytt exempel, och `s.förening.2` har fått förklaring och bild.
- Grupperna skrevs parallellt med listor över varandras ord, och inga dubbletter behövde slås ihop i efterhand. *brandslang* skrevs av både Offentliga byggnader och Samhällsservice och ägs av Offentliga byggnader.

### Bilder (424 nya ordbilder)
- 117 symbolbilder, 133 bilder som får användas i bildövningar och resten scener.
- 126 symbol- och adjektivbilder blindtestades. 117 klarade testet efter högst två omgångar.
- **9 ord saknar bild** efter två underkända omgångar. De har planstatus `none` och står i `VISUAL_MISSING_AFTER_BLIND_TEST`, se `PROJECT_STATUS.md` → *Saknade bilder*.
- Äkta synonymer är markerade som förväxlingsbara, bland annat *centrum/stadskärna*, *trivsam/mysig*, *folkmängd/invånarantal* och *volontärarbete/ideellt arbete*.
- Nya bildfiler i `src/ui/wordArt/`: `cityPlaces.ts`, `publicBuildings.ts`, `publicServices.ts`, `urbanPlanning.ts`, `migration.ts` och `civilSociety.ts`.

### Verktyg och test
- e2e-testets planerade exempel är *Tidningar och nyhetsredaktioner* (Medier & samhällsdebatt → Nyhetsmedier).

Service workern är `swechan-v38`.

## 0.33.0 – 2026-11-12

42 nya moduler som gör överämnet *Utbildning & lärande* (R03-A04) komplett. Varje nytt modulord har en egen bild, utom de 26 ord som underkändes i två blindtestomgångar.

### Moduler (42 nya, 729 målord)
- **Svensk skola** (1601–1607): förskola och grundskola, gymnasieskolans program, lektioner och raster, lärare och skolpersonal, betyg och bedömning, stödinsatser och elevhälsa samt skolans styrdokument.
- **Universitet & högskola** (1611–1617): universitet och fakultet, kurser och program, föreläsning och seminarium, tentamen och examination, kandidat- och masterexamen, examensarbete och studievägledning.
- **Studieteknik** (1621–1627): planera studier, anteckna och sammanfatta, lässtrategier, minnestekniker, repetition och återkallning, förbereda ett prov och hantera studiesvårigheter.
- **Pedagogik** (1631–1637): undervisning och lärande, kunskapsmål, förklaringar och exempel, frågor och återkoppling, grupparbete, bedömning och utvärdering samt anpassad undervisning.
- **Forskning & akademi** (1641–1647): forskningsfrågor, hypoteser, vetenskapliga artiklar, källor och referenser, datainsamling, forskningsetik och akademisk argumentation.
- **Utbildningssystem i världen** (1651–1657): skolstart och skolplikt, läroplaner och ämnen, prov och examina, yrkesutbildning, stipendier och utbyten, jämföra utbildningssystem och studera utomlands.
- Varje modul har 16–19 målord, lästext med fem frågor och konversationsunderlag. Det finns 439 nya ordposter. Ord som redan fanns återanvänds med sitt `senseId`.
- Lästexterna har faktakällor (skollagen, Skolverket, Skolinspektionen, högskoleförordningen, Universitets- och högskolerådet, Etikprövningsmyndigheten m.fl.). De nämner inga verkliga personer eller skolor.
- Nya betydelser på befintliga poster: *rast* och *betyg* (i skolan), *utvecklingssamtal* (i skolan), *huvudman* (för en skola), *ordningsregel* (i skolan), *institution* och *nation* (vid universitet), *opposition* (granskning av uppsats), *urval* (av sökande; i en undersökning), *lägga upp* (planera), *marginal* (på papper), *innehållsförteckning* (i en bok), *gå igenom* (titta på igen), *återkalla* (i minnet), *betänketid* (tid att tänka), *pröva* (testa), *avsnitt* (del av text), *referens* och *hänvisa* (i en text), *avbryta* (sluta med något), *bemöta* (svara på kritik), *hoppa av* (en utbildning), *konkurrens* (om platser), *praktisk* (med händerna) och *erkänna* (godta officiellt).
- Dubbletter mellan grupper slogs ihop: den tidigare modulen i katalogordningen äger posten och bilden. *termin*, *upprop*, *inriktning*, *antagning* och *underkänd* skrevs av både Svensk skola och Universitet & högskola och ägs av Svensk skola.
- *förmåga* och *klara* hade bara funnits i grundordförrådet och har nu egna poster.

### Bilder (441 nya ordbilder)
- 230 symbolbilder, 72 bilder som får användas i bildövningar och resten scener. Två äldre ord som saknade bild (*mentor* i skolan och *ämne* som skolämne) har fått bilder.
- 256 symbol- och adjektivbilder blindtestades. 230 klarade testet efter högst två omgångar.
- **26 ord saknar bild** efter två underkända omgångar. De har planstatus `none` och står i `VISUAL_MISSING_AFTER_BLIND_TEST`, se `PROJECT_STATUS.md` → *Saknade bilder*.
- Äkta synonymer är markerade som förväxlingsbara, bland annat *fritidshem/fritids*, *tentamen/tenta*, *examensarbete/exjobb/självständigt arbete*, *högskola/lärosäte*, *pugga/plugga in/memorera*, *forskningsfråga/frågeställning* och *respondent/deltagare*.
- Nya bildfiler i `src/ui/wordArt/`: `school.ts`, `university.ts`, `studySkills.ts`, `pedagogy.ts`, `research.ts` och `eduWorld.ts`.

### Verktyg och test
- e2e-testets planerade exempel är *Torg och gågator* (Städer & offentlig service → Stadens platser).

Service workern är `swechan-v37`.

## 0.32.0 – 2026-11-12

42 nya moduler som gör överämnet *Ekonomi & arbetsliv* (R03-A03) komplett. Varje nytt modulord har en egen bild, utom de 25 ord som underkändes i två blindtestomgångar.

### Moduler (42 nya, 727 målord)
- **Privatekonomi** (1501–1507): inkomster och utgifter, budget och sparande, ränta och inflation i vardagen, lån och amortering, försäkringar, skatt på inkomsten och ekonomiska prioriteringar.
- **Arbetsplatsens vardag** (1511–1517): arbetsuppgifter och ansvar, arbetstider och scheman, möten och arbetslag, arbetsmiljö och säkerhet, feedback och utvecklingssamtal, semester och ledighet samt arbetsplatskonflikter.
- **Jobbsökande & anställning** (1521–1527): yrken och befattningar, CV och personligt brev, arbetsintervju, anställningsformer, anställningsavtal, lön och förmåner samt uppsägning och byte av jobb.
- **Företagande** (1531–1537): starta företag, affärsidéer och kunder, varor och tjänster, omsättning och kostnader, vinst och förlust, marknadsföring och företagsformer.
- **Marknadsekonomi** (1541–1547): utbud och efterfrågan, priser och konkurrens, marknader och branscher, produktivitet och tillväxt, konjunktur och arbetslöshet, handel och import samt ekonomisk politik.
- **Banker & investeringar** (1551–1557): bankkonton och överföringar, räntor och obligationer, aktier och fonder, risk och avkastning, diversifiering, börsens aktörer och pensionssparande.
- Varje modul har 16–18 målord, lästext med fem frågor och konversationsunderlag. Det finns 484 nya ordposter. Ord som redan fanns återanvänds med sitt `senseId`.
- Lästexterna har faktakällor (Skatteverket, Konsumentverket, Finansinspektionen, Riksbanken, Arbetsmiljöverket, Pensionsmyndigheten, semesterlagen, arbetstidslagen, LAS, aktiebolagslagen, bokföringslagen m.fl.). De nämner inga verkliga personer eller företag. Belopp som ändras varje år står som ungefärliga.
- Nya betydelser på befintliga poster: *styrka* (bra sida), *svaghet* (svag sida), *säga upp* (en anställd), *skuld* (pengar), *deklarera* (skatt), *tjänst* (det ett företag säljer), *rykte* (vad folk tycker), *sjunka* (bli lägre), *överskott* (för mycket av en vara), *nedgång* och *uppgång* (minskning, ökning), *tull* (avgift), *uttag* (från konto), *placera* (pengar), *svänga* (gå upp och ner) och *mäklare* (aktier).
- Dubbletter mellan grupper slogs ihop: den tidigare modulen i katalogordningen äger posten och bilden. *arbetsledare*, *kompetens*, *heltid*, *deltid* och *styrka* (bra sida) refererar Arbetsplatsens vardag, *bruttolön* och *nettolön* refererar Privatekonomi och *investera*/*investering* refererar Marknadsekonomi.
- *semester* och *risk* hade bara funnits i grundordförrådet och har nu egna poster.

### Bilder (475 nya ordbilder)
- 305 symbolbilder, 57 bilder som får användas i bildövningar och resten scener.
- 332 symbol- och adjektivbilder blindtestades. 307 klarade testet efter högst två omgångar.
- **25 ord saknar bild** efter två underkända omgångar. De har planstatus `none` och står i `VISUAL_MISSING_AFTER_BLIND_TEST`, se `PROJECT_STATUS.md` → *Saknade bilder*.
- Äkta synonymer är markerade som förväxlingsbara: *fast anställning/tillsvidareanställning*, *amortera/betala av*, *feedback/återkoppling*, *diversifiera/sprida riskerna* och *diversifiering/riskspridning*.
- Nya bildfiler i `src/ui/wordArt/`: `privateEconomy.ts`, `workplace.ts`, `jobSearch.ts`, `business.ts`, `marketEconomy.ts` och `banking.ts`.

### Verktyg och test
- e2e-testets planerade exempel är *Förskola och grundskola* (Utbildning & lärande → Svensk skola).

Service workern är `swechan-v36`.

## 0.31.0 – 2026-11-12

42 nya moduler som gör överämnet *Juridik & rättsväsende* (R03-A02) komplett. Varje nytt modulord har en egen bild, utom de 45 ord som underkändes i två blindtestomgångar.

### Moduler (42 nya, 702 målord)
- **Rättens grunder** (1401–1407): lag och förordning, rättigheter och skyldigheter, rättssubjekt, rättskällor, juridiska begrepp, att tolka en lagtext och offentlig och privat rätt.
- **Brott & straff** (1411–1417): brottets rekvisit, uppsåt och oaktsamhet, försök och medverkan, böter och fängelse, straffmätning och påföljd, allmän- och individualprevention samt vanliga brottsrubriceringar.
- **Polis & brottsutredning** (1421–1427): polisens uppgifter, anmälan och misstanke, vittnen och förhör, bevis och spår, gripande och anhållande, husrannsakan och beslag samt förundersökningen.
- **Domstolar & rättegång** (1431–1437): tingsrätt och hovrätt, åklagare och försvarare, målsägande och tilltalad, åtal och stämning, huvudförhandling, dom och överklagande samt bevisvärdering.
- **Civilrätt i vardagen** (1441–1447): avtal, köp och konsumentskydd, hyra, skadestånd, familjerätt, arbetsrätt samt tvister och förlikning.
- **Förvaltning & myndigheter** (1451–1457): förvaltningsbeslut, ansökan och tillstånd, att överklaga myndighetsbeslut, offentlighetsprincipen, sekretess och tystnadsplikt, personuppgifter och integritet samt myndigheternas serviceskyldighet.
- Varje modul har 15–20 målord, lästext med fem frågor och konversationsunderlag. Det finns 498 nya ordposter. Ord som redan fanns återanvänds med sitt `senseId`.
- Lästexterna har faktakällor med lagrum (brottsbalken, rättegångsbalken, polislagen, avtalslagen, konsumentköplagen, hyreslagen, äktenskapsbalken, LAS, förvaltningslagen, tryckfrihetsförordningen, offentlighets- och sekretesslagen, dataskyddsförordningen m.fl.). De nämner inga verkliga personer eller rättsfall.
- Nya betydelser på befintliga poster: *rätt* (rättighet; domstol), *skyldig* (måste), *gå före* (vara viktigare), *tolka* (förstå), *förvaltningsrätt* (rättsområde), *försök*, *återfall* och *grov* (om brott), *tips*, *misstanke*, *neka*, *spår*, *träff*, *gripa*, *fynd*, *utredning*, *protokoll*, *klara upp*, *mål* (i domstol), *företräda*, *yrkande*, *fria* (frikänna), *ogiltig* (om avtal), *umgänge* (barn och förälder), *uppsägning* (från ett jobb) och *service* (myndighetens).
- Dubbletter mellan grupper slogs ihop: den tidigare modulen i katalogordningen äger posten och bilden. *legalitetsprincipen* och *befogenhet* refererar Rättens grunder, *gärningsperson* och *brottsförebyggande* refererar Brott & straff, *bestrida* refererar Domstolar & rättegång och *böter* refererar den befintliga posten *bot* (`s.bot.1`).
- *lag*, *stycke*, *stämning* och *testamente* hade bara funnits i grundordförrådet och har nu egna poster.

### Bilder (482 nya ordbilder)
- 289 symbolbilder, 52 bilder som får användas i bildövningar och resten scener.
- 339 symbol- och adjektivbilder blindtestades. 294 klarade testet efter högst två omgångar.
- **45 ord saknar bild** efter två underkända omgångar. De har planstatus `none` och står i `VISUAL_MISSING_AFTER_BLIND_TEST`, se `PROJECT_STATUS.md` → *Saknade bilder*.
- Tre ord i Rättens grunder (*utfärda*, *föreskrift*, *enligt lag*) ritades av misstag inte om mellan omgångarna, eftersom integratören läste en avkortad lista över underkända bilder. Listorna tas nu fram direkt ur blindtestdatan.
- Nya bildfiler i `src/ui/wordArt/`: `lawBasics.ts`, `crime.ts`, `police.ts`, `courts.ts`, `civilLaw.ts` och `authorities.ts`.

### Verktyg och test
- e2e-testets planerade exempel är *Inkomster och utgifter* (Ekonomi & arbetsliv → Privatekonomi).
- Python-cachefiler (`__pycache__`) ligger inte längre i git.

Service workern är `swechan-v35`.

## 0.30.0 – 2026-11-11

42 nya moduler som gör överämnet *Politik & demokrati* (R03-A01) komplett. Det är det första överämnet i rotområdet *Samhälle & institutioner*. Varje nytt modulord har en egen bild, utom de 20 ord som underkändes i två blindtestomgångar.

### Moduler (42 nya, 697 målord)
- **Demokratins grundbegrepp** (1301–1307): demokrati och diktatur, rösträtt, majoritet och minoritet, maktfördelning, medborgerliga fri- och rättigheter, opinion och demokratiska institutioner.
- **Svensk politik** (1311–1317): riksdag och regering, ministrar, partier, motioner och propositioner, utskott, riksdagsdebatter och regeringsbildning.
- **Val & folkomröstningar** (1321–1327): valkampanjer, vallokaler, rösträkning, mandat, spärrar och valsystem, folkomröstningar och regeringsskifte.
- **Kommuner & regioner** (1331–1337): fullmäktige, nämnder, regionernas ansvar, skattefinansierad service, lokala beslut, medborgarförslag och kommunal självstyrelse.
- **Internationell politik** (1341–1347): diplomati, fördrag, EU och FN, sanktioner, allianser och internationella konflikter.
- **Politiska idéer** (1351–1357): liberalism, konservatism, socialism, nationalism, feminism, grön ideologi samt kompromiss och reform.
- Varje modul har 15–19 målord, lästext med fem frågor och konversationsunderlag. Det finns 495 nya ordposter. Ord som redan fanns återanvänds med sitt `senseId`.
- Lästexterna har faktakällor (riksdagen.se, regeringen.se, val.se, Regeringsformen m.fl.). De nämner inga levande politiker och inga partisiffror, och partier visas bara som färger.
- Nya betydelser på befintliga poster: *kammare* (riksdagens), *avgå* (lämna ett uppdrag), *motion* (förslag i riksdagen), *utredning*, *remiss*, *anta*, *släppa fram*, *ogiltig* (röst), *jämn* (nästan lika), *spärr* (i val), *lokal* (på en ort), *justera* (ett protokoll), och *självständighet* (ett lands). Den befintliga betydelsen *hållbar* (s.hållbar.2) fick bild.
- 18 ordposter och betydelsen *avgå* (lämna ett uppdrag) skapades av två grupper samtidigt och slogs ihop. Den tidigare modulen i katalogordningen äger posten och bilden.
- Ordet *parti* hade bara funnits i grundordförrådet och har nu en egen post, liksom *avtal*, *krig* och *fred*.

### Bilder (489 nya ordbilder)
- 294 symbolbilder, 55 bilder som får användas i bildövningar och resten scener.
- 315 symbol- och adjektivbilder blindtestades. 295 klarade testet efter högst två omgångar.
- **20 ord saknar bild** efter två underkända omgångar. De har planstatus `none` och står i `VISUAL_MISSING_AFTER_BLIND_TEST`: *rösträtt, utöva, statsmakt, medborgerlig, representera, institution, ansvarig, politisk, bereda, debattera, valkampanj, valkrets, regional, motivering, diplomatisk, åtagande, samarbete, liberal, liberalism* och *socialistisk*.
- Äkta synonymer är markerade som förväxlingsbara, till exempel *minister/statsråd*, *regeringsskifte/maktskifte*, *angripa/anfalla* och *fosterland/hemland*.
- Nya bildfiler i `src/ui/wordArt/`: `democracy.ts`, `swedishPolitics.ts`, `elections.ts`, `municipal.ts`, `worldPolitics.ts` och `ideologies.ts`.

### Verktyg och test
- `tools/production/dsl.py` skriver versionsnumret i `verifiedBy` (tidigare stod det `'+VER+'`).
- e2e-testets planerade exempel är *Lag och förordning* (Juridik & rättsväsende).

Service workern är `swechan-v34`.

## 0.29.0 – 2026-11-11

105 nya moduler som gör överämnet *Människan & hälsa* komplett: resten av *Relationer & familj* och hela *Kommunikation* och *Livsfaser*. Från och med den här versionen har **varje modulord en bild, animation eller symbol**. Det är produktägarens regel från 0.29, och validatorn stoppar nya ord utan visualisering.

### Moduler (105 nya, 1 825 målord)
- **Relationer & familj:** *Föräldraskap & barn* (1031–1037), *Högtider & familjehändelser* (1041–1047) och *Relationella uttryck* (1051–1057).
- **Kommunikation:** *Samtalets grunder* (1101–1107), *Åsikter & argument* (1111–1117), *Artighet & sociala normer* (1121–1127), *Konflikter & försoning* (1131–1137), *Icke-verbal kommunikation* (1141–1147) och *Samtal på distans* (1151–1157).
- **Livsfaser:** *Barndom & ungdom* (1201–1207), *Vuxenliv* (1211–1217), *Åldrande* (1221–1227), *Lärande & färdigheter* (1231–1237), *Identitet & värderingar* (1241–1247) och *Livets motgångar* (1251–1257).
- Varje modul har 16–19 målord, lästext med fem frågor och konversationsunderlag. Ord som redan fanns återanvänds med sitt `senseId`. Svåra ord (B2 och högre) har förklaring.
- Nya betydelser på befintliga poster, till exempel *uppskatta* (sätta värde på), *skärm* (bildskärm), *tråd* (i en chatt), *kontakt* (mellan människor) och *släppa taget* (i tanken). *s.motivera.1* är avgränsad till betydelsen ge lust; *s.motivera.2* är förklara varför.

### Bilder (1 430 nya ordbilder)
- Alla nya ord utom ett har en egen bild: 1 031 symbolbilder, 155 bilder som får användas i bildövningar och resten scener som bara visas i ordintroduktionen.
- Alla symbol- och adjektivbilder har klarat ett oberoende blindtest. Bilder som granskaren inte kände igen ritades om. Äkta synonymer (till exempel *andrum* och *egentid*) är markerade som förväxlingsbara och ställs aldrig mot varandra i övningarna.
- Ett ord saknar bild: *demenssjuk*, som underkändes i flera omgångar. Det har planstatus `none` och står i `VISUAL_MISSING_AFTER_BLIND_TEST`.
- Nya bildfiler i `src/ui/wordArt/`: `parenting.ts`, `familyEvents.ts`, `relationSkills.ts`, `conversation.ts`, `opinions.ts`, `politeness.ts`, `conflicts.ts`, `nonverbal.ts`, `remoteTalk.ts`, `childhood.ts`, `adulthood.ts`, `ageing.ts`, `learning.ts`, `identity.ts` och `setbacks.ts`.

### Regler och validering
- Ny regel i `validateContent`: varje modulord ska ha en visualisering, och planen får inte säga "ingen bild" för ett modulord. Bara 14 äldre ord är undantagna (`VISUAL_EXCEPTIONS_BEFORE_0_29`).
- Nytt test: alla modulord har bild utom de 14 äldre undantagen.
- Vitest hoppar över `.claude/` (agenternas arbetskopior).
- Ny regel: en bild får högst två blindtestomgångar. Underkänns den andra gången får ordet planstatus `none` och listas som saknad bild.

### Dokument och verktyg
- `PROJECT_STATUS.md` beskriver bara nuläget. Historiken finns i `CHANGELOG.md`, och lärdomar som fortfarande gäller står i `CONTENT_GUIDELINES.md` och `ARCHITECTURE.md`.
- Ny produktionsinstruktion för modul- och bildagenter: `docs/PRODUCTION_BRIEF.md`.
- Produktionsverktygen (DSL, ordkontroll, bildregistrering, kontaktark, blindtestshjälp) ligger nu i `tools/production/`.
- e2e-testets planerade exempel är *Demokrati och diktatur* (Samhälle & institutioner).

Service workern är `swechan-v33`.

## 0.28.0 – 2026-11-09

Bilder till katalogens moduler, del 2. Nu har **alla 2 016 moduler** i katalogen en egen illustration i menyn *Kurser*. Varje nivå i katalogen har alltså bild: rotområden, överämnen, ämnesgrupper och moduler.

### Moduler (1 260 nya illustrationer)
- **Historia & kultur (252):** epoker, krigshistoria, religioner, filosofi, arkeologi och världens historia. Några exempel: grekiskt tempel (*Grekiska stadsstater*), borg med vindbrygga, torii (*Shintoismens ritualer*) och tidslinje (*Kronologier och tidslinjer*). Religioner visas med byggnader och föremål.
- **Natur & miljö (252):** landformer, väder och klimat, djur, växter, ekologi och geografi. Några exempel: vulkan, åska, älg, flugsvamp, näringskedja och kompass.
- **Vetenskap (252):** matematik, fysik, kemi, biologi och astronomi. Räknesätt och tecken ritas som streck, inte som bokstäver eller siffror. Några exempel: koordinatsystem, prisma med spektrum, pH-skala, DNA-spiral och månens faser.
- **Teknik (252):** datorer, programmering, elektronik, energi, verkstad, byggande och fordon. Några exempel: processor, neuralt nätverk, vindkraftverk, kugghjul, bro och höghastighetståg.
- **Kultur & fritid (252):** språk och litteratur, musik och scenkonst, bild och form, idrott, hobby och resor. Några exempel: noter, teatermasker, staffli, bollar för olika sporter, tärningar och tält.
- Inga motiv har text, emoji, flaggor från verkliga länder, märken eller logotyper.

### Rättat
- Rollen `accent2` vrider nyansen 200 grader. Delar med egen färgton (vatten, hjärtan, eld) fick därför fel färg i vissa motiv. Nu används `main` för sådana delar, även i ämnesgrupperna och modulbilderna från 0.26–0.27.
- Raka linjer med rollen `light` fylldes i stället för att strykas och syntes inte. De använder nu `line`.

### Teknik
- Nya filer `src/ui/art/moduleArtR04.ts`–`moduleArtR08.ts` med motiv och en `R0x_MODULE_MOTIF`-koppling i katalogordning.
- Testet för täckning kräver nu att alla 2 016 katalogmoduler har bild.

Service workern är `swechan-v32`.

## 0.27.0 – 2026-11-09

Bilder till katalogens moduler, del 1. I menyn *Kurser* har nu alla moduler i tre rotområden en egen illustration: *Vardag & hem*, *Människan & hälsa* och *Samhälle*. Det är 756 av katalogens 2 016 moduler.

### Moduler (651 nya illustrationer)
- **Vardag & hem (147 nya):** resten av kläder, hälsa i hemmet, tid och kalender, handel och resor (VAR-03-04 – VAR-06-06). Alla 252 moduler har nu bild.
- **Människan & hälsa (252 nya):** kroppen, hälsa och sjukvård, känslor, relationer, kommunikation och livsfaser (MAN-01 – MAN-06). Några exempel: lungor (*Lungor och luftvägar*), timglas (*Tålmodig och otålig*), släktträd (*Beskriva ett släktträd*) och videosamtal.
- **Samhälle (252 nya):** politik, juridik, ekonomi, utbildning, staden och medier (SAM-01 – SAM-06). Några exempel: riksdagens halvcirkel (*Riksdag och regering*), domarklubba (*Dom och överklagande*), utbud-och-efterfrågan-kurvor och en tidningssida (*Tidningar och nyhetsredaktioner*).
- Publicerade moduler (`m.*`) visar bilden från den katalogmodul de är kopplade till.
- Inga motiv har text, emoji, flaggor från verkliga länder, märken eller logotyper.

### Teknik
- Nya filer `src/ui/art/moduleArtR01.ts`, `moduleArtR02.ts` och `moduleArtR03.ts`. Varje fil har motiven (`m1_*`, `m2_*`, `m3_*`) och en koppling från katalog-id (`R0x_MODULE_MOTIF`) i katalogordning. Allt slås ihop med `MOTIFS` och `MODULE_MOTIF` i `motifs.ts`.
- Nytt test: alla 756 moduler i de tre rotområdena har en bild. Det befintliga testet vaktar att ingen modulbild delas med en annan modul eller kategori.

Service workern är `swechan-v31`.

## 0.26.0 – 2026-11-09

Bilder till katalogens ämnesgrupper. I menyn *Kurser* har nu alla 288 ämnesgrupper (nivån under överämnena) en egen illustration.

### Ämnesgrupper (288 nya illustrationer)
- Varje ämnesgrupp har ett eget motiv i appens platta stil, i rotområdets färg. Några exempel: planlösning (*Bostadstyper & rum*), lunga (*Inre organ*), valbås (*Val & folkomröstningar*), vikingaskepp (*Nordens historia*), älg (*Däggdjur*), prisma (*Ljus & optik*), databas (*Data & algoritmer*) och lägereld (*Friluftsliv*).
- Religioner visas med byggnader och föremål (kyrka, moské, lotus, menora), världsdelar med enkla siluetter. Inga märken, logotyper, flaggor, text eller emoji.

### Teknik
- Nya filen `src/ui/art/groupMotifs.ts` innehåller motiven (`tg_*`) och `GROUP_MOTIF`. Motiven slås ihop med `MOTIFS` i `motifs.ts`, och `artFor()` ger bild för ämnesgrupps-id:n (`R01-A01-T01` …).
- Nytt test: alla 288 ämnesgrupper har en unik bild som inte delas med rotområden, överämnen eller moduler. `npm run art:sheet` tar med ämnesgrupperna.

Service workern är `swechan-v30`.

## 0.25.0 – 2026-11-09

Bilder till katalogens överämnen. I menyn *Kurser* har nu alla 48 överämnen (till exempel *Hem & boende*, *Hälsa & sjukvård*, *Fysik*) en egen illustration, på samma sätt som rotområdena och modulerna.

### Överämnen (48 nya illustrationer)
- Varje överämne har ett eget motiv i appens platta illustrationsstil, i rotområdets färg. Några exempel: en nyckel (*Hem & boende*), ett stetoskop (*Hälsa & sjukvård*), en valurna (*Politik & demokrati*), ett timglas (*Historiska epoker*), en tass (*Djurvärlden*), en DNA-spiral (*Biologi*), ett kugghjul (*Maskiner & tillverkning*) och ett tält (*Naturupplevelser & reseliv*).
- Inga motiv innehåller text eller emoji. Inga märken eller logotyper ritas.
- Ämnesgrupperna (nivån under överämnena) har fortfarande ingen bild.

### Teknik
- `AREA_MOTIF` i `src/ui/art/motifs.ts` kopplar överämnen (`R01-A01` …) till motiv med prefixet `ar_`. `artFor()` i `Art.tsx` ger nu bild för id:n med sju tecken.
- Nytt test: alla 48 överämnen i katalogen har en bild, ingen bild används två gånger, och ingen delas med ett rotområde eller en modul.
- `npm run art:sheet` tar nu med överämnena i kontaktarket.

Service workern är `swechan-v29`.

## 0.24.0 – 2026-11-09

Fortsättning på bilderna till de färdiga modulerna. Hela överämnet *Känslor & psykologi* (901–957) har nu bilder: 627 av 630 modulord. Nästan alla är symbolbilder, och alla gick igenom blindtestgrinden.

### Känslor & psykologi (627 nya bilder)
- **Grundkänslor (901–907):** glädje och lycka, sorg och saknad, rädsla och oro, ilska och frustration, förvåning och förvirring, skam och skuld, känslors styrkegrader. De flesta känslor visas med ett uttrycksfullt ansikte (`fc()` i `emotions.ts`). Styrkegraderna visas som en nivåmätare som är olika full.
- **Sammansatta känslor (911–917):** lättnad och trygghet, avund och svartsjuka, stolthet och tillfredsställelse, besvikelse och ånger, hopp och förväntan, längtan och nostalgi, ambivalens och kluvenhet.
- **Tankar (921–927):** uppmärksamhet och fokus, minnen, fantasi, tolkning och antaganden, beslut och tvekan, reflektion, omedvetna vanor.
- **Personlighet (931–937):** utåtriktad och reserverad, noggrann och slarvig, modig och försiktig, tålmodig och otålig, empatisk och självisk, spontan och planerad, att beskriva någons karaktär. Dragen visas som typiska beteenden i små scener.
- **Psykiskt välmående (941–947):** stressreaktioner, press och krav, oro och grubbel, vila och avkoppling, att hantera bakslag, att söka stöd, balans mellan aktivitet och återhämtning. Stödlinjer och stödsamtal ritas allmänt, utan namn eller logotyper.
- **Utveckling och motivation (951–957):** mål och ambitioner, självförtroende och självkänsla, viljestyrka och disciplin, vanor och beteendeförändring, inre och yttre motivation, misslyckanden och lärande, att uppmuntra andra.
- Tre ord har ingen bild: *extremt*, *otrogen* och *ödmjuk*. De underkändes två gånger i blindtestet och fick planstatus `none`.

### Blindtest
- 557 bilder blindtestades i den här versionen: 436 godkända och 121 godkända synonymfall. Underkända bilder ritades om och testades igen, till exempel *dåligt samvete*, *skamsen*, *envishet* och *tummen upp*. Tummen ritades om så att den inte kan läsas som ett pekfinger.
- Känsloord har många nära synonymer. Därför fick grupper av ord `confusableWith`, till exempel *nedstämd*/*deppig*/*sorgsen*, *ilska*/*förbannad*/*gå i taket*, *grubbla*/*älta*/*tankarna snurrar*, de starka gradorden *otroligt*/*oerhört*/*hemskt*/*fruktansvärt* och *stötta*/*stödja*/*stöttande*.

### Teknik
- Nya motivfiler som laddas när de behövs: `emotions.ts` (`känsla.`), `emotions2.ts` (`emo.`), `mind.ts` (`tanke.`), `traits.ts` (`drag.`), `wellbeing.ts` (`väl.`) och `growth.ts` (`växa.`).
- `fc()` i `emotions.ts` ritar ett ansikte med valbara ögon, ögonbryn och munnar samt tårar, rodnad, svett och hudfärg (till exempel grön av avund). Hjälparna exporteras och används i de andra 900-filerna.

I hela appen har nu 6 168 av 6 182 modulord en bild. Utvecklingsnollställningen är fortfarande på. Service workern är `swechan-v28`.

## 0.23.0 – 2026-11-08

Fortsättning på bilderna till de färdiga modulerna. Hela överämnet *Hälsa & sjukvård* (801–857) har nu bilder: 629 av 630 modulord. Alla symbol- och adjektivbilder gick igenom blindtestgrinden.

### Hälsa & sjukvård (629 nya bilder)
- **Symtom och besvär (801–807):** feber och frossa, hosta och halsont, ont i magen, huvudvärk och yrsel, trötthet och svaghet, hudutslag och klåda, att beskriva symtom för vården.
- **Vårdbesök (811–817):** vårdcentral och mottagning, att boka läkartid, sjukdomshistoria, undersökning och provtagning, remiss och specialist, besked och uppföljning, patientens frågor.
- **Sjukdomar och diagnoser (821–827):** förkylning och influensa, infektionssjukdomar, allergier och astma, hjärt-kärlsjukdomar, diabetes och ämnesomsättning, kroniska sjukdomar, skillnaden mellan symtom och diagnos.
- **Läkemedel och behandling (831–837):** tabletter och kapslar, recept och apotek, dosering, biverkningar och varningar, salvor och inhalatorer, vaccination, att följa en behandling.
- **Första hjälpen och olyckor (841–847):** sår och blödningar, stukningar och frakturer, brännskador, medvetslöshet, HLR och livräddning, att larma 112, att beskriva en skada.
- **Förebyggande hälsa (851–857):** motion och återhämtning, kost, sömn, stresshantering, tandhälsa, hälsoundersökningar, riskfaktorer och hälsoval.
- Inga läkemedelsmärken, organisationers logotyper eller skyddade emblem ritas. Vård markeras med ett allmänt grönt kors. Det röda korset på ambulansen och på sjuksköterskor i 0.23:s motiv byttes mot ett grönt kors, och de berörda bilderna blindtestades igen. Larmcentralen, läkemedelsmyndigheten och läkemedelsdatabasen ritas som allmänna scener.
- Ett ord har ingen bild: *motion*. Det underkändes två gånger i blindtestet och fick planstatus `none`.

### Blindtest
- 145 bilder blindtestades i den här versionen: 122 godkända och 23 godkända synonymfall. Underkända bilder ritades om och testades igen, till exempel *Alzheimers sjukdom*, *receptbelagd*, *medvetslös*, *medvetslöshet*, *vid medvetande* och *fysisk aktivitet*.
- Symtomorden har många nära synonymer. De fick `confusableWith` i grupper, till exempel trötthetsorden (*trötthet*, *utmattad*, *orkeslös*, *kraftlös* …), feberorden och yrselorden, samt *hjärt-lungräddning*/*HLR*, *apotekare*/*farmaceut* och *skriva ut*/*förskriva*/*ordinera*.

### Teknik
- Nya motivfiler som laddas när de behövs: `symptoms.ts` (`sympt.`), `care.ts` (`besök.`), `disease.ts` (`sjuk.`), `medicine.ts` (`med.`), `firstaid.ts` (`akut.`) och `prevention.ts` (`frisk.`).
- `lying()` i `firstaid.ts` ritar en liggande person med öppna eller slutna ögon, och `bulbI()` visar medvetande som en tänd eller släckt lampa.

I hela appen har nu 5 541 av 6 182 modulord en bild. Utvecklingsnollställningen är fortfarande på. Service workern är `swechan-v27`.

## 0.22.0 – 2026-11-08

Fortsättning på bilderna till de färdiga modulerna. Hela överämnet *Resor & transport* (601–657) har nu bilder: 634 av 636 modulord. Alla symbol- och adjektivbilder gick igenom blindtestgrinden.

### Resor & transport (632 nya bilder)
- **Kollektivtrafik (601–607):** buss och hållplats, tunnelbana och pendeltåg, spårvagn och färja, biljetter och periodkort, tidtabeller och byten, förseningar och trafikstörningar, att fråga efter rätt linje.
- **Hitta rätt (611–617):** höger och vänster, korsningar och rondeller, gångvägar och övergångsställen, kartor och väderstreck, avstånd och riktningar, adresser, vägbeskrivningar. Riktningsorden visas oftast som en liten gatukarta sedd ovanifrån med en gående eller en bil och en pil.
- **Bil (621–627):** bilens delar (den delen är markerad på samma bil), starta och köra, parkera, tanka och ladda, däck och väglag, trafikskyltar och enkla bilproblem. Skyltarna är allmänna piktogram utan ord.
- **Cykel och promenader (631–637):** cykelns delar, cykelvägar, trafikregler för cyklister, promenader och vandring, hjälmar och reflexer, att laga en cykel, väglag och säkerhet.
- **Tåg (641–647):** stationer och perronger, biljettyper och platser, bagage, byten och anslutningar, nattåg, förseningar och ombokning, resor mellan svenska städer.
- **Flyg och hotell (651–657):** flygplatser och terminaler, incheckning och säkerhetskontroll, pass och resehandlingar, bagage, ombord på flyget, hotellrum och reception, in- och utcheckning.
- Inga operatörs-, flyg- eller hotellmärken ritas. Avgångstavlor visar ortkoder och tider men inga flygbolagskoder.
- Två ord har ingen bild: *varifrån* och *en bit*. Båda underkändes två gånger i blindtestet och fick planstatus `none`.

### Blindtest
- 115 bilder blindtestades i den här versionen: 108 godkända och 7 godkända synonymfall. Underkända bilder ritades om och testades igen, till exempel *gles* (landsbygdshållplats med bara två avgångar), *åt andra hållet*, *gående*, *leda cykeln* och *i färdriktningen*.
- Nära synonymer fick `confusableWith`, till exempel *stiga på*/*kliva på*, *perrong*/*plattform*, *ankommande*/*avgående*, *fotgängare*/*gående* och *ny avgångstid*/*ändrad*.

### Teknik
- Nya motivfiler som laddas när de behövs: `transit.ts` (`trafik.`), `nav.ts` (`väg.`), `car.ts` (`bil.`), `bike.ts` (`cyk.`), `rail.ts` (`tåg.`) och `travel.ts` (`res.`).
- `walker()` och `carTop()` i `nav.ts` ritar en gående och en bil ovanifrån, och `bike()` i `bike.ts` ritar en cykel där en del kan markeras.

I hela appen har nu 4 912 av 6 182 modulord en bild. Utvecklingsnollställningen är fortfarande på. Service workern är `swechan-v26`.

## 0.21.0 – 2026-11-08

Fortsättning på bilderna till de färdiga modulerna. Hela överämnet *Handla & tjänster* (501–542) har nu bilder: 628 av 630 modulord. Alla symbol- och adjektivbilder gick igenom blindtestgrinden.

### Handla & tjänster (592 nya bilder)
- **I butiken (501–507):** handla mat, kassan, kvitto, rabatter och erbjudanden, kvalitet och priser.
- **Pengar och betalning (508–514):** kontanter, kort, betalning med mobilen, fakturor, delbetalning, avgifter, prenumerationer och prisjämförelser. Betaltjänster ritas som allmänna symboler utan varumärken (telefon med belopp och grön knapp i stället för en logotyp).
- **Butiker och service (515–521):** klädbutiker och avdelningar (skyltarna har piktogram), elektronik, apotek, bokhandel och presentbutik, öppettider, provrum och köer, frågor till personalen.
- **Handla på nätet (522–528):** sökning och filter, produktbeskrivningar och recensioner, varukorg och kassa, leveransalternativ, spårning, ångerrätt och retur, bedrägerier vid nätköp. Skärmarna visar ikoner, siffror och priser men aldrig ordet.
- **Post och paket (529–535):** brev och vykort, kuvert och frimärken, paketstorlekar, paketombud och paketskåp, skicka utomlands, adresser och postnummer, försenade och saknade paket. Postlådor och fordon ritas utan postmärken.
- **Tjänster (536–542):** hantverkare, kemtvätt och skrädderi, kundtjänst och support, bibliotek, bokningar och avbokningar, abonnemang och medlemskap, klagomål och ersättning.
- Två ord har ingen bild: *leverans* (tolkades två gånger som *leverera*) och *vänligen* (artighetsord utan tydlig scen). Båda fick planstatus `none` efter två blindtest.

### Blindtest
- 126 bilder blindtestades i den här versionen: 113 godkända och 13 godkända synonymfall. Underkända bilder ritades om och testades igen, till exempel *exklusive* (ställs nu mot *inklusive*: maträtten ingår, drycken kostar extra), *trovärdig*, *ändringssömnad* och avdelningsskyltarna.
- Nära synonymer och överordnade begrepp har fått `confusableWith`, till exempel *bedrägeri*/*nätfiske*, *oanvänd*/*nyskick*, *butiksbiträde*/*expedit* och *på väg*/*under transport*/*ute för leverans*. De ställs aldrig mot varandra i bildövningar.
- Osynlig text (teckenstorlek 0,1) som låg kvar i några motiv är borttagen. Testet *no picture spells out its own word* hittade den.

### Teknik
- Nya motivfiler som laddas när de behövs: `shopping.ts` (`köp.`), `money.ts` (`peng.`), `stores.ts` (`buti.`), `online.ts` (`ehan.`), `post.ts` (`post.`) och `services.ts` (`tjän.`).
- Återanvändbara hjälpare: `cart` och `ptag` (`shopping.ts`), `note`, `coin` och `bankcard` (`money.ts`).

I hela appen har nu 4 280 av 6 182 modulord en bild. Utvecklingsnollställningen är fortfarande på. Service workern är `swechan-v25`.

## 0.20.0 – 2026-11-08

Produktägaren bad om bilder till de färdiga modulerna. Hela överämnet *Tid & vardagsrutiner* (401–442) har nu bilder: 628 av 630 modulord. Alla bilder gick igenom blindtestgrinden från 0.19.1.

### Tid & vardagsrutiner (628 nya bilder)
- **Klockan och kalendern (401–407):**
  - klockslag visas på en analog klocka där den nämnda delen av timmen är markerad (*kvart över*, *fem i*, *halv tre*);
  - veckodagar och datum visas i en kalender där dagens datum är markerat (*i måndags*, *i förrgår*, *förrförra*);
  - tidsfrister och bokningar.
- **Morgon och kväll (408–414):** vakna, göra sig i ordning, frukost, pendla, varva ner, läggdags och vanor.
- **Planering (415–421):** listor, prioriteringar, kalender, möten, skjuta upp, hinna och en ledig dag.
- **Vardagliga handlingar (422–428):** hämta och lämna, ta fram och lägga undan, sätta på och stänga av, följa med, minnas, börja och sluta, behöva och vilja.
- **Mängder och mått (429–435):** tal, vikt, volym, längd, hastighet, temperatur, ungefärliga mängder, delar och storlekar. Siffror och enheter (*kg*, *cl*, *km*) får synas eftersom de aldrig stavar ordet.
- **När något går fel (436–442):** tappa bort, något går sönder, missförstånd, försenad, be om hjälp, låna och lämna tillbaka, konflikter.
- Två ord har ingen bild: *så fort* (funktionsord) och *veckovis*, som underkändes i blindtestet två gånger.

### Blindtest
- Alla 192 symbol- och adjektivbilder i serien testades av granskare som inte visste svaret: 98 godkända och 94 godkända synonymfall. Bilder som underkändes ritades om och testades igen.
- Nära synonymer som en bild inte kan skilja åt (*jättestor*/*enorm*/*gigantisk*, *innan dess*/*dessförinnan*, *totalt*/*sammanlagt*) har fått `confusableWith`. De ställs aldrig mot varandra i bildövningar.
- `art:blind:record` matchar nu hela ord i granskarens kommentar, så att *prio* inte hittas i *prioritering*.

### Teknik
- Nya motivfiler som laddas när de behövs: `time.ts` (`tid.`), `routine.ts` (`rut.`), `planning.ts` (`plan.`), `actions.ts` (`akt.`), `measure.ts` (`mått.`) och `mishaps.ts` (`vard.`).
- `clock()` och `cal()` i `time.ts` ritar klockor med markerade sektorer och kalendrar med markerade dagar.

I hela appen har nu 3 688 av 6 182 modulord en bild. Utvecklingsnollställningen är fortfarande på. Service workern är `swechan-v24`.

## 0.19.1 – 2026-11-08

Produktägaren påpekade att frisyr- och klädadjektivens bilder (*lockig*, *vågig*, *tovig*, *tajt*, *lös*) inte visade orden. Den här versionen går igenom orsaken, rättar alla bilder med samma risk och inför ett styrsystem som stoppar felet framöver.

### Varför bilderna blev fel
- **Granskning med facit:** bilderna granskades av den som ritat dem, med ordet bredvid. Då ser man det man vet att bilden ska visa.
- **Fel mall:** standardfiguren har fasta kläder och fast frisyr. Den kan inte visa passform eller hårstruktur, så skillnaden hamnade i små tillägg.
- **Markeringar bar ordet:** en orange pil eller ett litet tecken var ibland det enda som skilde *tajt* från *lös*.
- **Volym före kontroll:** när 500 bilder per version var målet fångade granskningen bara layoutfel (beskärning, överlapp), inte om ordet syntes.

### Blindtest av alla riskbilder
- Alla 517 symbol- och adjektivbilder i moduler blindtestades: en granskare som inte vet svaret ser numrerade bilder och modulens ordlista med japansk glosa och säger vilket ord varje bild visar.
- 180 bilder underkändes eller var osäkra. 159 bilder ritades om i upp till fyra omgångar, och varje omgång testades av nya granskare. Bland dem finns 18 animationer och 3 ansikten som ersattes av tydligare illustrationer.
- Nya motivfiler: `bodyFix.ts` (`kfix.`, kropp och hälsa) och `blindFix.ts` (`fix.`, mat, hem, familj, vänner och kärlek). `fitFigures.ts` ritar figurer vars kläder kan sitta tajt, löst eller säckigt bredvid en grå referens.
- Ord som betyder samma sak i bild, till exempel olika ordklasser av samma begrepp (*smittsam*/*smitta*, *immun*/*immunförsvar*), och nära synonymer har fått `confusableWith`. De ställs aldrig mot varandra i bildövningar.
- Fyra ord saknar tydlig scen och har ingen bild längre: *frasighet*, *knaprig*, *ha det trevligt* och *ömsint*.
- Resultat: 448 bilder godkända, 65 godkända som synonymfall, 0 underkända.

### Styrsystem
- **Regler i `CONTENT_GUIDELINES.md`:**
  - egenskapen ska dominera bilden;
  - jämför med en grå referens;
  - använd inte en mall som inte kan bära egenskapen;
  - markeringar stödjer men bär aldrig;
  - visa en situation hellre än en sak.
- **Blindtest i registret:** `blindTest` i `wordVisuals.json` innehåller resultatet och ett fingeravtryck av den testade bilden.
- **Testet stoppar bygget:** *every symbol and adjective picture passed an independent blind test* går inte igenom om en symbol- eller adjektivbild saknar blindtest eller har ritats om efter sitt test.
- **Verktyg:**
  - `npm run art:blind -- <mapp> pending` gör blindark för allt som saknar giltigt test.
  - `npm run art:blind:record -- <mapp>` sparar granskarnas svar.

I hela appen har 3 045 av 6 182 modulord en bild. Utvecklingsnollställningen är fortfarande på. Service workern är `swechan-v23`.

## 0.19.0 – 2026-11-07

Produktägaren bad om minst 500 nya bilder. Det blev 549, och alla har granskats i förstoring.

### Kläder & stil klart (421 nya bilder)
- **Material (315–321):**
  - bomull och linne, ull och silke, syntetmaterial, läder och mocka
  - mönster och texturer, tygers egenskaper, att känna igen kvalitet
- **Passform och stil (322–328):**
  - storlekar och mått, lösa och tajta plagg, att prova kläder
  - sömmar och detaljer, ändra och laga, färgmatchning, stil och tillfälle
- **Klädvård (329–335):** tvättsymboler, sortera tvätt, tvättmedel, torka och stryka, fläckar, ull och siden, laga knappar och sömmar.
- **Hår och hud (336–342):** frisyrer, hårvårdsprodukter, hudvård, smink, parfym, naglar och rakning, besöka frisören.
- Nu har alla modulord i *Kläder & stil* (301–342) en bild.

### Grundmodulerna 1–8 (128 nya bilder)
- Hemmet och vardagen, material och ämnen, atomer och molekyler, krig och försvar, medeltida borgar, vanliga grönsaker, skära och hacka, koka och sjuda.

### Principer
- Egenskaper och abstrakta ord (*tajt*, *dämpad*, *intensiv*, *neutral* …) är symbolbilder. De visas alltid med den japanska översättningen och aldrig i bildövningarna.
- Ingen bild innehåller ordet självt. Testet från 0.18.1 kontrollerar även alla nya bilder.
- I hela appen har nu 3 049 av 6 182 modulord en bild.

### Teknik
- Nya motivgrupper som laddas när de behövs: `tyg.` (textiles.ts), `pass.` (fit.ts), `tvätt.` (laundry.ts), `skön.` (beauty.ts) och `bas.` (basics.ts).

Utvecklingsnollställningen är fortfarande på. Service workern är `swechan-v22`.

## 0.18.1 – 2026-11-07

Produktägaren påpekade att bilden för *högtidlig* inte såg högtidlig ut. Abstrakta ord får gärna visas som en symbol tillsammans med det japanska ordet, och liknande bilder skulle också granskas.

### Symbolbilder och abstrakta ord
- Principen kommer från Animation_tool- (`docs/WORD_FUNCTIONS.md`): egenskaper och abstraktioner visas som en symbolisk minischen tillsammans med den japanska översättningen. I Swechan står översättningen redan intill bilden överallt där en symbolbild visas, i ordintroduktionen och i stavningsövningen. Därför behövs ingen extra text i själva bilden.
- Alla 295 symbolbilder, 63 adjektiv och 553 bilder som inte används i bildövningar har granskats manuellt.
- Omritade bilder:
  - *högtidlig*: festklädd middag med vit duk, kandelaber och ljuskrona.
  - *isbrytare*: visade ett fartyg, men ordet betyder något som lättar upp stämningen. Nu en lek där isen spricker.
  - *mätt*: rund mage och en hand som tackar nej till mer.
  - *mättande*: en stor gröttallrik som ger en mätt mage.
  - *traditionsenlig*: samma julbord som på det gamla fotot hos mormor.
  - *hålla tummarna*: visade korsade fingrar, alltså den engelska gesten. Nu tummarna inne i knutna händer, som i Sverige.
  - *livslängd*, *förlänga*, *ansvar*, *uppriktig*, *tuggummi* och *mogen*.

### Ingen text som avslöjar svaret
- 50 bilder innehöll ordet själv eller en del av det. Exempel:
  - etiketter: *MJÖL*, *SYLT*, *HONUNG*, *TONFISK*, *LINFRÖ*
  - skyltar: *KROG*, *ENTRÉ*, *KONDITORI*, *SOPRUM*, *CYKLAR*
  - ljudord: *krisp*, *knap*, *KRAS*
  - repliker: *Vi ses!*, *Skål!*, *JA!*
- Texten är borttagen eller ersatt av små ikoner (vete, bär, fisk, tårta, ölsejdel, vinglas …) i den nya filen `labelIcons.ts`.
- Ett nytt test stoppar bilder som stavar sitt eget ord, eftersom bilden även visas i stavningsövningen.

Utvecklingsnollställningen är fortfarande på. Service workern är `swechan-v21`.

## 0.18.0 – 2026-11-07

Produktägaren bad om minst 500 nya, korrekta bilder i den här versionen. Det blev 516. Varje bild har granskats i förstoring. Rättningarna gällde framför allt text som avslöjar svaret, figurer som skymdes, motiv som gick att förväxla och detaljer som låg utanför bilden.

### Påfyllning: Vardag & hem 215–242 (411 nya bilder)
- **Kök hemma (215–221):** kökets större apparater, redskap för matlagning, porslin och bestick, förvaringskärl och burkar, köksmaterial och ytor, att duka ett bord, säkerhet i köket.
- **Badrum och tvätt (222–228):** toalett och handfat, dusch och badkar, handdukar och badrumstextil, hygienartiklar hemma, tvättstuga och tvättmaskiner, avlopp och vattenkranar, badrumsproblem och reparation.
- **Städ och underhåll (229–235):** städredskap och rengöringsmedel, dammsuga och torka golv, tvätta kläder, sortera sopor, små reparationer, skador och slitage, veckostädning och rutiner.
- **Bo och hyra (236–242):** bostadsannonser och visningar, hyresavtal och hyresvärd, avgifter och boendekostnader, bostadsrätt och förening, grannar och störningar, felanmälan och service, flyttdag och adressändring.
- Nu har alla modulord i *Vardag & hem* 101–242 en bild.

### Påfyllning: Kläder & stil 308–314 (105 nya bilder)
- Vardagsskor och kängor, finskor och klackar, mössor och hattar, halsdukar och handskar, väskor och ryggsäckar, smycken och klockor, bälten och små tillbehör.

### Detaljer i bilderna
- Skyltar och etiketter som skulle avslöja svaret har tagits bort, till exempel *Soprum*, *Kemtvätt*, *Lim* och *Garanti*. De ersätts av symboler.
- Abstrakta ord (*rutin*, *ansvar*, *ombildning*, *förlänga* …) och symbolbilder visas inte i bildövningarna.
- Bilder som ligger nära varandra (*spik/spika*, *hyra/månadsavgift*, *lås/låssmed* …) har samma `group`, så att de inte blir svarsalternativ till varandra.
- I hela appen har nu 2 496 av 6 182 modulord en bild.

### Teknik
- Nya motivgrupper som laddas när de behövs: `khem.` (homeKitchen.ts), `bad.` (bathroom.ts), `städ.` (cleaning.ts), `bost.` (housingAdmin.ts) och `acc.` (accessories.ts).

Utvecklingsnollställningen är fortfarande på. Service workern är `swechan-v20`.

## 0.17.0 – 2026-11-07

Produktägaren var nöjd med 0.16. I den här versionen fortsätter påfyllningen av bilder i de tidigare modulerna.

### Påfyllning: Vardag & hem (323 nya bilder)
- **Mat & dryck är klart:** 132–139 har nu bilder, så alla modulord i 101–139 har en bild. De nya modulerna är matbordets samtal, svenska husmansrätter, japansk mat på svenska, mat från olika världsdelar, specialkost och allergener, näringsämnen, matsvinn och rester samt högtidsmat och traditioner.
- **Bostad (201–207):** hus och lägenheter, husets rum, utrymmen i flerbostadshus, att beskriva en bostad, planlösning och boyta, att flytta och boendeformer i Sverige.
- **Möbler och inredning (208–214):** soffor och fåtöljer, bord och stolar, sängar och sovrumsmöbler, förvaring och hyllor, lampor och belysning, färger och inredningsstilar samt att möblera ett rum.
- Färgord (*beige*, *turkos*, *lila*) visas som färgprov utan text, så att bilden inte avslöjar svaret i bildövningen.
- I hela appen har nu 1 973 av 6 182 modulord en bild.

### Teknik
- Nya motivgrupper som laddas när de behövs: `bord.` (dining.ts), `hus.` (housing.ts) och `möb.` (furniture.ts). Bostadshjälparna ligger i `homeKit.ts`.

Utvecklingsnollställningen är fortfarande på. Service workern är `swechan-v19`.

## 0.16.0 – 2026-11-07

Produktägarens önskemål efter 0.15: fyll på bilder i de tidigare modulerna, och visa det japanska ordet i bildövningen.

### Övningen *Vilket ord passar till bilden?* (ADR 41)
- Ordets japanska översättning står nu under bilden, stor och mörk med furigana. En del bilder är svåra att tolka utan stöd.
- Hör en animation till ordet spelas den **en gång** och går sedan tillbaka till sin mest talande bildruta (affischbilden), med ▶ för att spela igen. Det gäller även ansiktsanimationer. Stillbilder och symboler visas som vanligt.
- I *Vilken bild passar till ordet?* är bilderna fortfarande stillbilder, så att alla alternativ visas på samma villkor.

### Påfyllning: Vardag & hem 114–131 (250 nya bilder)
- Steka och bryna, grädda och baka, vispa och röra, krydda och smaka av, tillaga och servera, grundsmaker och dofter.
- Söta och syrliga smaker, starka och milda smaker, krispigt och knaprigt, mjukt och segt, färskhet och mognad, beskriva en maträtt.
- Frukost, lunch och middag, mellanmål och fika, portioner och tillbehör, restaurangmenyer, beställa och betala.
- I hela appen har nu 1 644 av 6 182 modulord en bild.

### Teknik
- Nya motivgrupper som laddas när de behövs: `kök.` (kitchen.ts) och `mål.` (meals.ts), med gemensamma hjälpare i `kitchenKit.ts`.
- `WordImage` har ett nytt läge, `once`, och `ScenePlayer` har `endOnPoster`.

Utvecklingsnollställningen är fortfarande på. Service workern är `swechan-v18`.

## 0.15.0 – 2026-11-07

Två innehållsspår som tidigare, och ett nytt spår för gränssnittet.

### Gränssnitt: tydligare japanska (ADR 40)
- Japansk text som hör till ordet som lärs in är nu stor och mörk, och furiganan är större och mörkare. Det gäller översättningar, definitioner, exempel, förklaringar, svarsalternativ, ledtrådar och återkoppling i övningar, ordintron, ordboken och listorna.
- Instruktioner och hjälptext är fortfarande små och grå, så att de inte konkurrerar med ordet.
- Regeln gäller också framtida moduler och komponenter: klasserna `ja-word` och `ja-gloss` och `jaClassName` på `LangText` (se CONTENT_GUIDELINES).

### Nytt: Relationer & familj fortsätter (11 moduler, 198 ord)
- **Vänskap (1014–1017), nu komplett:**
  - Hjälpa och stötta
  - Förtroende och lojalitet
  - Missförstånd mellan vänner
  - Vänskap över avstånd
- **Kärlek & partnerskap (1021–1027), komplett:**
  - Förälskelse och attraktion
  - Dejting och uppvaktning
  - Att bli tillsammans
  - Sambo och äktenskap
  - Gemensam vardag
  - Omtanke och uppskattning
  - Konflikter i parrelationer
- Alla 198 ord har bilder, till exempel *stöttepelare* (en pelare som bär ett tak), *dra sitt strå till stacken* (myror som bär strån), *ghosta* (ett spöke bredvid obesvarade meddelanden), *glida isär* (två isflak som driver isär), *fråga chans* (en lapp med ja/nej-rutor), *sova sked* och *gå skilda vägar*.
- Svåra ord (B2 och uppåt) har förklaringar på svenska och japanska. Alla texter är AI-utkast.

### Påfyllning: Vardag & hem (94 nya bilder)
- Ordning 108–113: fågel och ägg, fiskarter och skaldjur, vegetariska proteinkällor, mejeriprodukter och alternativ, att välja råvaror, hållbarhet och förvaring. Där finns nu bilder för alla modulord.
- I hela appen har nu 1 290 av 6 182 modulord en bild.

### Rättat
- **Dubbla svarsalternativ:** två olika ord med samma böjningsform (*mod* och *mode* ger båda *modet*) kunde bli två likadana alternativ i en lucköversättning. Generatorn tar nu bort dubbletter, och homografer med samma grundform blir aldrig alternativ till varandra. Det finns ett test för det.

### Teknik
- Nya motivgrupper som laddas när de behövs: `kär.` (love.ts) och `livs.` (groceries.ts). Hjälparna för människor och relationer ligger i `people.ts`.
- e2e-testet använder *Föräldraskap & barn → Graviditet och födsel* som exempel på en planerad modul.

Utvecklingsnollställningen är fortfarande på. Service workern är `swechan-v17`.

## 0.14.0 – 2026-11-07

Två spår i samma release, enligt planen: ett nytt överämne med bilder från början, och påfyllning av bilder i ett gammalt överämne.

### Nytt: Relationer & familj (10 moduler, 174 ord)
- **Familjemedlemmar (1001–1007):**
  - Föräldrar och barn
  - Syskon och kusiner
  - Mor- och farföräldrar
  - Släktrelationer
  - Svärfamilj och ingifta
  - Familjetraditioner
  - Beskriva ett släktträd
- **Vänskap (1011–1013):**
  - Bekanta och vänner
  - Lära känna någon
  - Umgås och träffas
- Alla ord har bilder: familjebilder där den person ordet gäller är markerad (*mellanbarn*, *svärmor*, *halvsyskon* …), släktträdsdiagram (*omgift*, *släktgren*, *efterkommande*), namnskyltar (*förnamn*, *mellannamn*, *efternamn*), traditioner (*dopp i grytan*, *adventsljusstake*) och vänskap. Animationer finns för *växa upp*, *flytta hemifrån*, *bråka*, *reta* och *samlas*.
- Svåra ord (B2 och uppåt) har förklaringar på svenska och japanska. Alla texter är AI-utkast.

### Påfyllning: Vardag & hem (112 nya bilder)
- Ordning 101–107: frukt och bär, spannmål och gryn, bönor och linser, nötter och frön, kryddor och örter, torrvaror och konserver, styckningsdelar och köttsorter. Där finns nu bilder för alla modulord.

### Teknik
- **Illustrationer laddas per område (ADR 39):** `render` gick från 61 till 6,5 kB gzip. Kroppen, familj, fest, vänskap och mat är egna lata delar.
- **Snabbare test:** testet av rekommendationsordningen markerar moduler som klara direkt (40 s → 0,4 s). Det slog i tidsgränsen på CI.

Utvecklingsnollställningen är fortfarande på. Service workern är `swechan-v16`.

## 0.13.1 – 2026-11-06

**Produktägarens stickprov av 0.13:** överlag godkänt, men ansiktsuttrycken var otydliga. I *höja på ögonbrynen* var ögonbrynen lika mörka som håret, så höjningen syntes inte. I *rynka på näsan* syntes ingen näsa.

### Ansiktsrigg (ADR 38)
- Ett nytt, stort ansikte fyller hela bildrutan. Ögonbrynen är ljusare än håret och sitter en bit under hårfästet; när de höjs syns pannrynkor, och när de dras ihop syns ett veck mellan dem.
- Näsan är stor nog för att rynkor och näsvingar ska synas. Ögonlocken kan kisa, och pupillerna kan titta åt alla håll, även uppåt.
- Munnen kan visa leende, snett leende, öppen och rund mun, läppbett, trut och sammanbitna tänder. Kinderna kan blåsas upp, och huvudet kan luta, vridas och nicka. En hand kan föras till mun, näsa, öra, panna, haka eller ögon, och överlägg som sol, lukt, ljud och pratbubblor tonas in.
- **47 ord** är gjorda om med riggen: hela modulen *Ansiktsuttryck och miner* och alla andra ord där ansiktet bär betydelsen. Bland dem finns *blinka*, *kisa*, *bländad*, *nysa*, *hosta*, *rapa*, *hicka*, *sniffa*, *andas in/ut*, *hålla andan*, *dåsig*, *rodna*, *höra dåligt*, *ljudkänslig*, *skaka på huvudet*, *gulsot* och *blodbrist*. De gamla helfigursscenerna är borttagna.
- `npm run faces:build [-- --strips remsor.html]` bygger, validerar och registrerar scenerna (`kind: "face"` i `wordVisuals.json`, scener i `src/content/data/faces/faces.json`).
- Nya regler finns i `CONTENT_GUIDELINES.md` under *Ansiktsuttryck*: en huvudsignal per ord, posterbilden ska vara toppen av uttrycket, och ord som lätt förväxlas ska gå att skilja åt i en stillbild.

### Tester
- `faces.test.ts`: register, data och definitioner hänger ihop, och varje bildruta renderas utan fel.
- `WordImage`: ansiktet spelas i introduktionen och visar ▶ för repris, och bildövningar visar bara posterbilden.

Utvecklingsnollställningen är fortfarande på. Service workern är `swechan-v15`.

## 0.13.0 – 2026-11-06

**Pilot klar:** hela *Människan & hälsa → Kroppen & sinnena* (42 moduler, 631 modulord) har nu en bild i ordintroduktionen och övningarna – **374 illustrationer** och **257 animationer**. Alla är AI-utkast och väntar på produktägarens stickprov.

**Beslut (Claude, ändrar ADR 35 – se ADR 37):** Animation_tool- har inga mallar för stillbilder eller kroppsdelar, och sessionen kunde inte pusha dit. Konkreta saker, kroppsdelar och diagram ritas därför som kodillustrationer i Swechan. Handlingar, tillstånd och gester skrivs som scendata i spelarens format i `scripts/scenes/`. De kan flyttas till verktyget utan ändringar.

**Beslut:** utvecklingsnollställningen är fortfarande på; 0.12.0 → 0.13.0 nollställer progressionen (återställningspunkt sparas).

### Illustrationer (src/ui/wordArt)
- Ett kroppskit där en ritning per vy används för många ord: den del ordet betyder får accentfärg och pekas ut med en pil. Vyerna är huvud och ansikte, händer, armar, ben och fötter, bål fram och bak, skelett, knäled, muskler, senor, organkarta, hjärta, kärl, hals och hjärna, urinvägar, fortplantningsorgan, ögat och örat.
- Figurer med justerbar kroppsbyggnad visar ord som *långväxt*, *knubbig* och *axelbred*, med en grå jämförelsefigur.
- Dessutom finns hud och hår, syn- och hörselhjälpmedel, sjukvårdssaker (gips, krycka, mitella, inhalator, insulinpenna), blodceller, matsmältning, hormoner, immunförsvar och smärtsymboler.

### Animationer (scripts/scenes)
- **130 verb:** kroppsrörelser, balans, skador, andning, sinnen, beröring, lyft och grepp, miner, gester, smärta, temperatur och sömn.
- **113 tillstånd och personord:** hållning, rörlighet, sömn, temperatur, sjukdomstecken, miner och kroppsspråk.
- Scenerna byggs med poser, ansiktsuttryck, ikoner och ljudmarkeringar ur spelarens schema; definitionen tas ur ordboken. Ansiktsord visas i närbild.
- `npm run scenes:build -- --out dist/scenes [--strips fil.html] [--only ord]` bygger och validerar och kan skriva bildremsor för granskning. Importen sker med `npm run visuals:import dist/scenes`.

### Tester
- `sceneDefs.test.ts`: varje scendefinition tolkas och kompileras utan varningar och stämmer med den skeppade scenfilen.

### Storlek
- Huvudpaketet är oförändrat. Illustrationsdelen `render` som laddas vid behov växte från 10 till 42 kB gzip. 243 nya scenfiler är på 1–3,7 kB vardera.

Inga ordposter, moduler eller publicerade ID:n har ändrats.

## 0.12.0 – 2026-11-06

**Beslut (produktägaren, 2026-11-06):** alla ordposter ska få en visualisering (animation, scen eller symbol) som används i ordintroduktionen och i övningarna. Det tidigare stoppet för nya bilder och animationer är hävt. AI-utkast får visas i appen under arbetet. Mallarna i Animation_tool- (`registry/templates.json`) godkänns av Claude och stickprovas av produktägaren i piloten.

**Beslut:** utvecklingsnollställningen (`resetProgressOnUpdate`) är fortfarande på; 0.11.0 → 0.12.0 nollställer progressionen (återställningspunkt sparas).

### Animationer i appen (Animation_tool-)
- **Spelaren** från Animation_tool- ligger i `src/ui/anim/` och laddas som en egen del (52 kB gzip) först när en animation visas.
- **84 animationer** är importerade (bland annat hela *Gå och springa* och ord ur *Kroppen & sinnena* och *Vardag & hem*). Scenerna ligger i `public/anim/scenes/` (cirka 1,3 kB per ord); posterbilden ritas ur scenen i stället för att lagras som egen fil.
- **Ordintroduktionen** spelar animationen en gång; ▶ spelar den igen. Med reducerad rörelse (systeminställningen eller appens inställning) börjar den pausad på posterbilden.
- **Bildövningar och stavning** visar bara posterbilden, så att alla alternativ visas på samma villkor. Distraktorreglerna är oförändrade.
- **Offline:** scenerna för en moduls ord hämtas när modulen öppnas och cachas av service workern.
- **Reserv:** finns ingen animation används kodillustrationen; kan en scen inte laddas visas illustrationen (om det finns en) eller ingen bild.
- Registret heter nu `src/content/data/images/wordVisuals.json` och har typen `animation` (med `animationId`, `file`, `reviewStatus`, `fallbackMotif`). `visualFor` är det nya namnet på `imageFor`.

### Visualiseringsplan för alla ord
- `src/content/data/images/visualPlan.json` anger för **alla 5 799 betydelser** vilken sorts bild de ska få: animation (1 145, handlingar), scen (3 036, konkreta saker), symbol (1 617, abstrakta ord, känslor, egenskaper och idiom – symbolisk scen med japansk glosa, aldrig i bildövningar) och ingen (1). Klassningen är ett AI-utkast (`by: heuristic`) som justeras per överämne när scenerna produceras.
- Validatorn kräver en plan för varje modulord, och innehållsrapporten visar hur många modulord som har en färdig visualisering (180 av 5 758 just nu).

### Verktyg
- `npm run visuals:import <dist/swechan>` importerar en export från Animation_tool- (`npm run anim:export`): ASCII-säkra filnamn, en version per betydelse, förväxlingslistor filtreras mot Swechans ordbok, oanvända scenfiler tas bort.
- `npm run visuals:plan` lägger till plan för nya betydelser (`--recompute` klassar om rader som fortfarande är heuristiska).

### Tester
- Varje scenfil finns, är liten, tolkas, kompileras och renderar en SVG-bild; inga föräldralösa filer; reservmotiv finns; bildövningar fungerar med posterbilder.
- Komponenttest: animationen spelas i introduktionen, bara posterbilden visas i övningar, och en scen som inte går att ladda ger reserven.

Inga ordposter, moduler eller publicerade ID:n har ändrats.

## 0.11.0 – 2026-11-06

**Beslut:** utvecklingsnollställningen (`resetProgressOnUpdate`) är fortfarande på; 0.10.0 → 0.11.0 nollställer progressionen (återställningspunkt sparas).

**Bilder:** inga nya bilder eller animationer (produktägarens beslut står fast).

### 42 nya moduler: *Känslor & psykologi* (helt publicerat)
Det tredje överämnet i rotområdet *Människan & hälsa*. Kedjan har `recommendedOrder` 901–957 och börjar efter *Riskfaktorer och hälsoval*. Totalt finns nu **383 publicerade moduler** och 629 nya ordposter (AI-utkast). Alla modulord på B2 eller högre har förklaringar från början (327 nya förklaringar, 1 633 totalt).
- *Grundkänslor*: Glädje och lycka, Sorg och saknad, Rädsla och oro, Ilska och frustration, Förvåning och förvirring, Skam och skuld, Känslors styrkegrader
- *Känslornas nyanser*: Lättnad och trygghet, Avund och svartsjuka, Stolthet och tillfredsställelse, Besvikelse och ånger, Hopp och förväntan, Längtan och nostalgi, Ambivalens och kluvenhet
- *Tankar & mentala processer*: Uppmärksamhet och fokus, Minnen och erinran, Fantasi och föreställning, Tolkning och antaganden, Beslut och tvekan, Reflektion och eftertanke, Omedvetna vanor
- *Personlighet & temperament*: Utåtriktad och reserverad, Noggrann och slarvig, Modig och försiktig, Tålmodig och otålig, Empatisk och självisk, Spontan och planerad, Beskriva en människas karaktär
- *Stress & återhämtning*: Stressreaktioner, Press och krav, Oro och grubbel, Vila och avkoppling, Hantera bakslag, Söka stöd, Balans mellan aktivitet och återhämtning
- *Motivation & självbild*: Mål och ambitioner, Självförtroende och självkänsla, Viljestyrka och disciplin, Vanor och beteendeförändring, Inre och yttre motivation, Misslyckanden och lärande, Att uppmuntra andra

Ungefär 160 flerordsuttryck är egna poster, till exempel *le från öra till öra*, *klump i halsen*, *beklaga sorgen*, *gå i taket*, *sjunka genom jorden*, *stå i valet och kvalet*, *sova på saken*, *ha is i magen*, *ta det säkra före det osäkra*, *bita ihop*, *ladda batterierna* och *gråta över spilld mjölk*. Svensk kultur förklaras där den behövs, till exempel jantelagen, *duktighet*, *ödmjuk*, *jordnära*, *hänsynsfull* och *bekvämlighetszon*.

Ord som redan fanns återanvändes i stället för att dupliceras, till exempel *stresshantering*, *utbränd*, *återhämta sig*, *komma ihåg*, *glömsk*, *bestämma sig*, *tveka* och *orka med*.

**Homografer:** `e.saknad-känsla` (substantivet *saknad*) är en egen post med nyckel, och `s.skyldig.2` (skyldig till något) är en ny betydelse på en befintlig post.

Inga publicerade `m.*`- eller `s.*`-ID:n har ändrats.

### Övrigt
- Grundordförrådet har fått vanliga ord som texterna behöver, till exempel *val*, *lön*, *bakgrund*, *handling*, *inre*, *yttre*, *tvivla*, *koppla*, *lätta*, *bry*, *fjäril*, *spindel* och *varg*, samt formerna *värsta*, *osäkra* och *spilld*.
- E2E: den planerade katalogposten ligger nu i *Människan & hälsa → Relationer & familj → Familjemedlemmar → Föräldrar och barn*, eftersom hela *Känslor & psykologi* är publicerat.

## 0.10.0 – 2026-11-06

**Beslut:** utvecklingsnollställningen (`resetProgressOnUpdate`) är fortfarande på; 0.9.0 → 0.10.0 nollställer progressionen (återställningspunkt sparas).

**Bilder:** inga nya bilder eller animationer (produktägarens beslut står fast).

### 42 nya moduler: *Hälsa & sjukvård* (helt publicerat)
Det andra överämnet i rotområdet *Människan & hälsa*. Kedjan har `recommendedOrder` 801–857 och börjar efter *Beskriva smärta och obehag*. Totalt finns nu **341 publicerade moduler** och 630 nya ordposter (AI-utkast). Alla modulord på B2 eller högre har förklaringar från början (259 nya förklaringar, 1 306 totalt).
- *Symtom & besvär*: Feber och frossa, Hosta och halsont, Ont i magen, Huvudvärk och yrsel, Trötthet och svaghet, Hudutslag och klåda, Beskriva symtom för vården
- *Vårdbesök*: Vårdcentral och mottagning, Boka läkartid, Beskriva sjukdomshistoria, Undersökning och provtagning, Remiss och specialist, Besked och uppföljning, Patientens frågor
- *Sjukdomar & diagnoser*: Förkylning och influensa, Infektionssjukdomar, Allergier och astma, Hjärt-kärlsjukdomar, Diabetes och ämnesomsättning, Kroniska sjukdomar, Skillnaden mellan symtom och diagnos
- *Läkemedel & behandling*: Tabletter och kapslar, Recept och apotek, Dosering och intervall, Biverkningar och varningar, Salvor och inhalatorer, Vaccination och injektion, Följa en behandling
- *Första hjälpen & olyckor*: Sår och blödningar, Stukning och fraktur, Brännskador, Medvetslöshet, HLR och livräddning, Larma 112, Ge en tydlig skadebeskrivning
- *Förebyggande hälsa*: Motion och återhämtning, Näring och kostvanor, Sömnvanor, Stresshantering, Mun- och tandhälsa, Hälsoundersökningar, Riskfaktorer och hälsoval

Drygt 100 flerordsuttryck är egna poster, till exempel *boka tid*, *förnya ett recept*, *hosta i armvecket*, *hålla linjen*, *lägga på*, *allvarligt skadad*, *rakt på sak*, *gå in i väggen*, *dra ner på* och *passiv rökning*. Svensk vårdkultur förklaras där den behövs: 1177, vårdcentral, remiss, e-recept, högkostnadsskydd, SOS Alarm, Nyckelhålet, snus och screening.

**Homografer:** egna poster med nyckel för annan ordklass eller annan betydelse: `e.hosta-noun`, `e.blåsa-hud` och `e.var-sår`.

Inga publicerade `m.*`- eller `s.*`-ID:n har ändrats.

### Övrigt
- Grundordförrådet har fått vanliga ord som vårdtexterna behöver, till exempel *gravid*, *kontroll*, *laboratorium*, *utbildning*, *forskning*, *samhälle*, *effekt*, *åtgärd*, *fysisk*, *passiv*, *tobak*, *cigarett* och *helikopter*, samt namn och förkortningar som *BVC*, *MRI*, *ADHD* och *Livsmedelsverket*.
- E2E: den planerade katalogposten ligger nu i *Människan & hälsa → Känslor & psykologi → Grundkänslor → Glädje och lycka*, eftersom hela *Hälsa & sjukvård* är publicerat.
- Snabbare övningsgenerering: distraktorer väljs med en lat, seedad blandning (`lazyShuffle`) i stället för att hela ordförrådet filtreras och blandas vid varje övning, och svarsmaskeringen kompilerar ett reguljärt uttryck per ordpost (cachat). Det innehållsbreda övningstestet gick från ~57 s till ~9 s (CI hade börjat överskrida tidsgränsen på 60 s), och appen genererar övningar snabbare på telefonen.

## 0.9.0 – 2026-11-06

**Beslut:** utvecklingsnollställningen (`resetProgressOnUpdate`) är fortfarande på; 0.8.0 → 0.9.0 nollställer progressionen (återställningspunkt sparas).

**Bilder:** inga nya bilder eller animationer (produktägarens beslut står fast).

### 42 nya moduler: *Kroppen & sinnena* (helt publicerat)
Det första överämnet i rotområdet *Människan & hälsa*. Kedjan har `recommendedOrder` 701–757 och börjar efter *In- och utcheckning*. Totalt finns nu **299 publicerade moduler** och 627 nya ordposter (AI-utkast). Alla modulord på B2 eller högre har förklaringar från början (256 nya förklaringar, 1 047 totalt).
- *Kroppens yttre delar*: Huvud och ansikte, Armar och händer, Ben och fötter, Bål och rygg, Leder och rörelser, Hud och kroppsbehåring, Beskriva kroppsliga kännetecken
- *Skelett & muskler*: Ben och skelettdelar, Leder och ledband, Muskelgrupper, Senor och fästen, Hållning och balans, Rörelser och rörelseomfång, Skador i rörelseapparaten
- *Inre organ*: Hjärta och blodkärl, Lungor och luftvägar, Mage och tarmar, Lever och gallblåsa, Njurar och urinvägar, Hjärna och nervsystem, Fortplantningsorgan
- *Syn, hörsel & känsel*: Ögats delar, Seende och synfel, Örats delar, Ljud och hörsel, Känsel och beröring, Smak och lukt, Sinnesintryck i vardagen
- *Kroppens funktioner*: Andningens förlopp, Blodcirkulationen, Matsmältning, Kroppstemperatur och svettning, Sömn och vakenhet, Hormoner och reglering, Kroppens immunförsvar
- *Rörelser & kroppsliga uttryck*: Gå och springa, Böja och sträcka, Lyfta och bära, Greppa och släppa, Ansiktsuttryck och miner, Gester och kroppsspråk, Beskriva smärta och obehag

Många flerordsuttryck är egna poster, till exempel *hålla andan*, *kippa efter andan*, *sätta sig på huk*, *rycka på axlarna*, *himla med ögonen*, *hålla tummarna* och *göra ont*.

Ord som hör till *Hälsa & sjukvård* (symtom, vårdbesök, läkemedel, första hjälpen) har medvetet hållits utanför, till exempel *feber*, *huvudvärk*, *yrsel*, *halsont* och *klåda*.

**Homografer:**
- Nya betydelser på befintliga poster: `s.mager.2`, `s.kraftig.2` (kroppsbyggnad), `s.lins.2` (ögats lins) och `s.smälta.2` (matsmältning).
- Egna poster med nyckel för annan ordklass eller annan betydelse: `e.vad-kropp`, `e.led-kropp`, `e.gift-ämne`, `e.ta-upp-kropp`, `e.sträcka-verb` och `e.min-ansikte`.

Inga publicerade `m.*`- eller `s.*`-ID:n har ändrats.

### Övrigt
- Grundordförrådet har fått vanliga ord som texterna om kroppen behöver, till exempel *cell*, *hjärna*, *syre*, *virus*, *bakterie*, *infektion*, *patient*, *vård*, *rörelse*, *övning*, *stress*, *teater*, *rep* och *orm*. Det har också fått namnen *Max* och *Emil*.
- E2E: den planerade katalogposten ligger nu i *Människan & hälsa → Hälsa & sjukvård → Symtom & besvär → Feber och frossa*, eftersom hela *Kroppen & sinnena* är publicerat.

## 0.8.0 – 2026-11-06

**Beslut:** utvecklingsnollställningen (`resetProgressOnUpdate`) är fortfarande på; 0.7.0 → 0.8.0 nollställer progressionen (återställningspunkt sparas).

**Bilder:** inga nya bilder eller animationer (produktägarens beslut står fast).

### Svåra ord förklaras (produktägarens krav)
Ord som en genomsnittlig elev i årskurs 9 skulle ha svårt för ska förklaras ytterligare, inte bara översättas.
- Nytt fält `sense.explanation {sv, ja}`: 2–3 meningar om vad ordet betyder i praktiken, när och varför det används, vanliga kombinationer och svensk kulturell bakgrund. Visas i ordintroduktionen (rutan *Förklaring · 詳しい説明*) och i ordboken.
- **Regel:** varje modulord på nivå B2 eller högre måste ha en förklaring. Förklaringen valideras som en definition: kontrollerat ordförråd, furigana, minst 60 tecken och inte en kopia av `defSv`.
- **143 ord omklassade från B1 till B2** eftersom de är svåra för en niondeklassare (t.ex. *moms*, *bolån*, *deposition*, *besked*, *proton*, *kolhydrat*, *specificerat kvitto*).
- **Alla 677 svåra betydelser i de redan publicerade modulerna har fått förklaringar**, och de nya modulerna har förklaringar från början. Totalt har nu **791 betydelser** en förklaring.
- Tester: `furigana.test.ts` (regeln), `ExerciseView.test.tsx` (rutan visas för *specificerad*, inte för *skjorta*).

### Flerordsuttryck
Uttryck som bara betyder något tillsammans (*komma ihåg*, *gå vilse*, *ta sig till*, *i väntan på*, *av säkerhetsskäl* …) är egna ordposter och målord. Partikelverb har `particle`, och reflexiva verb skrivs med *sig*. Riktlinjerna finns i `CONTENT_GUIDELINES.md`.

### 42 nya moduler: *Resor & lokaltrafik* (helt publicerat)
Kedjan har `recommendedOrder` 601–657 och börjar efter *Klaga och begära ersättning*. Totalt finns nu **257 publicerade moduler** och 633 nya ordposter (AI-utkast).
- *Kollektivtrafik*: Buss och hållplats, Tunnelbana och pendeltåg, Spårvagn och färja, Biljetter och periodkort, Tidtabeller och byten, Förseningar och trafikstörningar, Fråga efter rätt linje
- *Vägbeskrivningar*: Höger och vänster, Korsningar och rondeller, Gångvägar och övergångsställen, Kartor och orientering, Avstånd och riktningar, Hitta en adress, Beskriva en färdväg
- *Bil & vardagskörning*: Bilens delar, Starta och köra, Parkera och betala, Tankning och laddning, Däck och väglag, Trafikskyltar i vardagen, Enkla bilproblem
- *Cykel & gång*: Cykelns delar, Cykelvägar och cykelbanor, Trafikregler för cyklister, Promenader och vandring, Hjälmar och reflexer, Reparera en cykel, Väglag och säkerhet
- *Tåg & långresor*: Tågstationer och perronger, Biljettyper och platser, Bagage på tåget, Byten och anslutningar, Resa med nattåg, Försening och ombokning, Resa mellan svenska städer
- *Flyg & hotell*: Flygplatser och terminaler, Incheckning och säkerhetskontroll, Pass och resehandlingar, Bagage och handbagage, Ombord på flyget, Hotellrum och reception, In- och utcheckning

Ny betydelse på en befintlig post: `s.spår.2` (järnvägsspår) på `e.spår`. Inga publicerade `m.*`- eller `s.*`-ID:n har ändrats.

### Prestanda
- Repetitionsurvalet (`selectReviewCards`) beräknar retrievability och förfallodatum en gång per kort i stället för i varje jämförelse vid sorteringen.
- Utvecklarverktyget *Gör alla kort förfallna* skriver om korten med `clear()` + `bulkAdd()`. Med det växande innehållet tog testet över 60 s; nu tar det cirka 16 s.

### Övrigt
- Grundordförrådet har fått vanliga ord och namn som texterna behöver (t.ex. *pedal*, *risk*, *varning*, *cyklist*, *turist*, *privat*, *orolig*, *mask*, *Arlanda*, *Kiruna*, *Centralen*).
- E2E: den planerade katalogposten ligger nu i *Människan & hälsa → Kroppen & sinnena → Kroppens yttre delar → Huvud och ansikte*, eftersom hela *Vardag & hem* är publicerat.
- Tester som går igenom allt innehåll i `learning.test.ts` lämnar tillbaka kontrollen efter varje modul. Annars rapporterade Vitest "Timeout calling onTaskUpdate" (exitkod 1 trots gröna tester).

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
