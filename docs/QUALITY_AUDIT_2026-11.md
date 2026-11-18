# Kvalitetsrevision 2026-11-18: systematiska fel och ett system som stoppar dem

Underlag: `origin/main` vid 0.51.0 (`27df30b`). 1 433 moduler, 15 782 ordposter, 16 334 betydelser, 449 000 textsträngar, all bilddata, laddningskoden och produktionsinstruktionerna. Allt nedan är mätt med skript mot hela materialet, inte stickprov, om inget annat sägs. Inget innehåll och ingen kod är ändrad.

Genomförandet står i `docs/QUALITY_PLAN.md`. Dokumentet har tre delar: **fynd** (vad som är fel och varför), **system** (vad som ska byggas) och **etapper** (i vilken ordning en annan session gör det).

---

## Del 1. Den gemensamma orsaken

Nästan alla fynd har samma rot: **regeln finns i en text, men ingen grind kontrollerar den.** Produktionsagenterna läser enligt `CLAUDE.md` *bara* `docs/PRODUCTION_BRIEF.md`. Det som inte står där, eller som inte stoppas av `check.sh`, händer inte. Tre exempel:

- Briefen nämner inte animationer med ett ord → noll animationer i de 24 senaste ämnesgrupperna.
- Briefen säger "ny betydelse → `add_sense`" men aldrig "ta reda på vilka betydelser ordet har" → ordet får bara modulens betydelse.
- Regeln "varje modulord ska ha bild" har ett undantag (två blindtest, sedan `none`) utan reservnivå → undantaget växer med 8–48 ord per release.

Lösningen är därför inte fler regler i text, utan **ett kvalitetskontrakt per ordpost som maskinen kontrollerar**, plus en spärr som gör att inget mätvärde får bli sämre (se Del 3).

---

## Del 2. Fynd

Allvar: **A** = påverkar eleven nu och växer, **B** = kvalitetsbrist, **C** = långsiktig risk.

### 2.1 Bilder som saknas (din punkt 1) — A

| Överämne | Ordkort i moduler | utan bild | andel |
|---|---|---|---|
| R01 Vardag & hem | 3 836 | 8 | 0,2 % |
| R02 Människan & hälsa | 4 091 | 7 | 0,2 % |
| R03 Samhälle | 4 273 | 173 | 4,0 % |
| R04 Historia & idéer | 4 327 | 173 | 4,0 % |
| R05 Natur & geografi | 4 198 | 154 | 3,7 % |
| R06 Matematik & naturvetenskap | 2 800 | 187 | 6,7 % |

- 573 betydelser saknar bild. 444 av 1 433 moduler har minst ett bildlöst kort, 61 har tre eller fler. Värst: *Typvärde och variationsbredd* (6 av 16).
- Värsta ämnesgrupperna: Avancerad matematik 15,5 %, Filosofi & etik 13,6 %, Ekologi & miljö 13,6 %, Matematikens grunder 12,7 %.
- Ordklass: 352 substantiv, 128 adjektiv, 71 verb.

**Orsaker**

1. **Ingen reservnivå.** Efter två underkända blindtest blir planen `none` och kortet visas tomt. Regeln "högst två omgångar" och regeln "varje ord ska ha bild" krockar, och ingen av dem säger vad som ska visas i stället.
2. **Blindtestet mäter fel sak för symbolbilder.** Granskaren ska *utan glosa* peka ut rätt ord bland modulens ord. Men symbolbilder har alltid `quiz: false` och visas alltid tillsammans med den japanska glosan. Testet är alltså strängare än användningen, och det straffar just moduler med nära besläktade abstrakta ord (*talrik/population/bestånd*, *hotad/sårbar/utrotningshotad*).
3. **Trefaldig bokföring.** Ett saknat ord ska stå i `visualPlan.json` (`none`), i den hårdkodade mängden `VISUAL_MISSING_AFTER_BLIND_TEST` i `validateContent.ts` och i `PROJECT_STATUS.md` (rad 37–213). Det bryter mot "konfiguration före hårdkodning" och ger fel som *utfärda*, *föreskrift* och *enligt lag*, som aldrig ritades om.
4. **Symbolandelen** är 41–76 % i abstrakta grupper. Det är väntat, men det betyder att blindtestets utformning avgör täckningen.

### 2.2 En sekund mellan korten (din punkt 2) — A

Jag har inte kunnat mäta i en webbläsare (arbetsytan saknar nätverk och `node_modules`). Diagnosen bygger på koden, och varje punkt nedan är verifierad där.

1. **Bilden hämtas först när kortet visas.** `WordImage` → `loadMotif()` laddar en JavaScript-del per motivprefix. Ingenting förladdar nästa kort. `prefetchModuleVisuals()` förladdar bara animationer, inte illustrationer.
2. **Varje kort träffar en ny del.** Det finns 201 delar på i snitt 45 kB (upp till 81 kB) med 50–100 motiv var. Ett kort behöver ett motiv men laddar hela delen. Antal olika delar per modul:

   | R01 | R02 | R03 | R04 | R05 | R06 |
   |---|---|---|---|---|---|
   | 1,6 | 2,4 | 5,1 | 6,1 | 6,3 | 7,2 |

   Orsaken är återanvändningen: i R06 är över hälften av en moduls ord hämtade från andra områden, och varje sådant ord ligger i sitt ursprungsområdes del. Det förklarar varför det har blivit sämre *nu*.
3. **Cachen töms vid varje release.** `public/sw.js` byter cachenamn (`swechan-v55`) varje version och raderar då *allt*, även oförändrade filer med hash i namnet. Med 1–2 releaser per dag börjar eleven nästan alltid med kall cache.
4. **Platshållaren pulserar** (`.word-image.loading`, 1,2 s) och den gamla bilden tas bort direkt, så väntan syns tydligt.
5. **Nästa kort väntar på två databasskrivningar** (`logLearnEvent`, `onSave`) innan det ritas. Litet bidrag, men det läggs ovanpå.

Dessutom, samma rot men större risk (C): **hela ordboken ligger i startpaketet.** `repository.ts` importerar alla 1 431 ordboksfiler med `eager: true`. Delen `content` är cirka 24 MB JavaScript (5,7 MB gzip) och laddas om vid varje release. Vid 2 016 moduler blir det cirka 34 MB.

### 2.3 Animationer har slutat användas (din punkt 3) — A

| | Animerade ord | varav i *Kroppen & sinnena* |
|---|---|---|
| Alla 16 253 modulord | 267 (+44 ansikten) | 194 |
| Allt efter *Relationer & familj* (24 ämnesgrupper, cirka 9 900 nya ord) | **0** | |

- 2 920 verb, 210 animerade (7 %). 1 163 substantiv vars definition börjar med "När …" (processer): 20 animerade. 1 867 ord vars definition beskriver rörelse eller förändring: 102 animerade.
- *Rörelseenergi* har en stillbild med plan `symbol`.
- Planen säger `animation` för 229 betydelser. 46 av dem har ändå en stillbild.

**Orsaker**

1. `PRODUCTION_BRIEF.md` avsnittet *Bilder (alla nya ord)* beskriver bara stillbilder. Animationsvägen (`scripts/scenes/*.scenes.ts`, `npm run scenes:build`, ADR 37) nämns inte.
2. `tools/production/vis.py` skriver alltid `kind: illustration` och sätter planen till `scene` om inget annat anges. Verktyget **skriver över** den ursprungliga heuristiken "verb → animation" i `visuals-plan.mjs`.
3. Ingen validering jämför planen med det levererade. `plan: animation` + stillbild godkänns tyst.
4. Scenmotorn har bara mallen `body` (människor). Det finns ingen enkel väg att animera *saker* (en kula som rullar, vatten som kokar, en kurva som växer).

### 2.4 Betydelser som saknas (din punkt 4) — A

- 515 av 15 782 poster (3,3 %) har fler än en betydelse.
- Av 74 vanliga flertydiga ord som jag kontrollerade har **43 bara en betydelse** i ordboken. Exempel på vad eleven får se:

  | Ord | Enda betydelsen i ordboken | Saknas |
  |---|---|---|
  | arbete | （物理の）仕事 | jobb, arbete i allmänhet |
  | val | クジラ | politiskt val, valmöjlighet |
  | följa | （SNSで）フォローする | följa efter, följa en regel |
  | effekt | 仕事率、出力 | verkan |
  | spänning | 電圧 | spännande känsla, anspänning |
  | ledning | （熱の）伝導 | ledning i företag, elledning, ledning i match |
  | led | 関節 | vandringsled, led i en kedja |
  | bråk | 分数 | gräl |
  | stam | 幹 | folkstam, ordstam |

- 177 poster med en betydelse skriver själva i förklaringen att ordet "kan också betyda …" (*vakt*, *block*, *flygel*, *gods*, *provins*, *salong* …). Betydelsen är alltså känd men inte inlagd.
- 96 glosor rymmer två betydelser åtskilda med 「；」, och 13 definitioner säger "Också: …" (*lämna*: 去る、離れる；渡す、返す).

**Orsaker**

1. **Grundordförrådet har inga ordposter.** `coreVocabulary.json` är en ren ordlista (1 865 lemman). När ett grundord senare får en fackbetydelse skapas en post med *bara* fackbetydelsen. 313 poster har ett lemma som också är grundord, och 265 av dem har en enda betydelse.
2. **Ingen inventering.** Briefen säger vad man gör *om* betydelsen finns, inte att man ska ta reda på vilka betydelser ordet har. `exists.py` svarar bara på "finns lemmat?".
3. **Betydelsenumret blir fel för alltid.** `s.arbete.1` är nu fysikbetydelsen, och ID:n får inte ändras. `OtherSenses` visar betydelserna i ID-ordning, så huvudbetydelsen hamnar som nummer 2 när den väl läggs till.
4. **Nivå och böjning ligger på posten, inte på betydelsen.** *arbete* har nivå B2 på grund av fysiken. *damm* (en/ett) kan inte beskrivas rätt.

### 2.5 Förklaringar för svåra ord (din punkt 5) — B

Det som finns är sakligt bra: alla 7 121 ord på B2/C1 har en förklaring, medianen är 41–48 ord. Bristerna är systematiska i *vad* förklaringen innehåller:

| Mått | Värde |
|---|---|
| Betydelser med exakt ett exempel | 16 307 av 16 334 (99,8 %) |
| Svåra ord (B2+) med uppgift om användning (`usageNote`, `collocations` eller `synonyms`) | 1–2 % i varje överämne |
| Förklaringar som innehåller exempel eller kontrast ("till exempel", "jämför", "inte samma som") | R02 43 % → R05 22 % |
| Förväxlingspar kända i bilddata (`confusableWith`) | 7 233 |
| … där texten nämner det andra ordet | 473 (6,5 %) |
| B1-ord (6 369, 39 % av allt) med förklaring | nästan inga (krav först från B2) |
| Förklaringens första mening är "X är/betyder …" (upprepar definitionen) | 36–76 % |

**Mönstret:** förklaringarna är uppslagsverk (vad saken *är*), inte språkhjälp (hur ordet *används*, vad det *förväxlas med*, vad det heter på japanska i motsvarande begrepp). Kunskapen om förväxlingar finns redan, från blindtesten, men når aldrig eleven. Validatorn kräver bara att förklaringen finns, är lång nog och inte upprepar definitionen ordagrant.

### 2.6 Språk, typografi och fakta — B

Från granskningen av R01–R03 och från skript över hela materialet:

| Fynd | Omfattning | Grind i dag |
|---|---|---|
| Samma kanjiord med olika läsning | 451 ord, varav säkra fel som 違法\|いはん, 支払\|しはらい, 分間\|ふんかん | ingen |
| Räkneord och läsning i sammanhang (4分\|ふん) | återkommande i R01–R03 | ingen |
| Kanji utan furigana | 57 strängar, mest i `factSources` | bara vissa fält |
| Raka citattecken i stället för ” | 1 015 strängar, 896 i R04–R05 | ingen |
| Dubbelpunkt "..", dubbla ord, dubbla blanksteg | cirka 50 | ingen |
| Japansk förklaring har färre meningar än den svenska | 354 (4 %), 21 % avvikelse i R06 | ingen |
| Samma namn med olika katakana (カリン/カーリン 4–4) | flera namn | ingen |
| Figurer utan fast roll och ålder (Kenji, Aiko som främling) | återkommande | bara namnlista |
| Föråldrade fakta (lagar, belopp, åldersgränser) | ett tiotal rättade i R01–R03 | ingen |
| Frågeförklaring citerar text som inte längre finns | återkommande efter ändringar | ingen |
| Moduler vars beskrivning bara räknar upp orden | 1 415 av 1 433 | ingen |
| `related` tomt | 1 429 av 1 433 | ingen |

- **Fakta saknar datum och källa.** `factSources` är fri text utan länk och utan "kontrollerad den". Det går inte att veta vad som ska kontrolleras om.
- **R04–R06 är inte språkgranskade.** Felen ovan bör finnas där i samma takt som i R01–R03.
- **Granskningen ligger kvar i PR #66.** 108 moduler och 49 ordboksfiler är rättade där men inte på `main`. Rättningarna finns alltså inte i appen (違法\|いはん finns kvar i måtten ovan), och grenen krockar på nytt för varje release.

### 2.7 Långsiktiga risker — C

1. **Startpaketet** växer linjärt med innehållet (2.2).
2. **`PROJECT_STATUS.md` är 552 rader** och ska läsas av varje session. 490 rader är listor (saknade bilder, öppna osäkerheter). Varje session betalar för dem, och listorna krockar vid varje sammanslagning, liksom `CHANGELOG.md`.
3. **Förkunskapskedjan är 1 425 led djup.** Ordförrådskontrollen godkänner ett ord om det lärts ut *någonstans tidigare i kedjan*. En elev som går direkt till Fysik möter då ord ur 1 300 moduler som hen inte läst. Regeln skyddar skribenten, inte eleven.
4. **Manuella steg som glöms:** `contentVersion`/`updatedAt` (också i moduler som delar en ändrad betydelse), modulindex, cachenamn i `sw.js`, ändringslogg.
5. **All status är `ai-draft`** (16 334 av 16 334). Det finns inget sätt att märka en post som språkgranskad eller en bild som godkänd av människa.
6. **592 fria taggar**, inget kontrollerat ordförråd.
7. **Katalogen säger `planned` för alla 2 016 moduler**, fast 1 433 är publicerade.
8. **`devConfig.resetProgressOnUpdate`** nollställer elevens framsteg vid varje version. Måste stängas av före verklig användning.
9. **Ordboks- och modulfiler tål inte omskrivning med verktyg** (ändringar kräver exakt textersättning), så massrättningar är dyra.
10. **Sju testfiler går inte att köra utan nätverk** (dexie). En session utan nätverk kan inte verifiera lagringsändringar.

---

## Del 3. Rekommenderat system

Sex byggstenar. S1 och S2 är själva systemet. S3–S6 är de ändringar som krävs för att kontraktet ska gå att uppfylla.

### S1. Kvalitetskontrakt per ordpost (maskinläsbart)

En fil `quality/contract.json` som anger vad en färdig betydelse ska ha. `tools/production/check.sh` och CI kör samma kontroll. Förslag på kontrakt, version 2:

| # | Krav | Gäller |
|---|---|---|
| K1 | Visualisering finns: animation, scen eller symbol. `none` är inte tillåtet: ordet står då i kön för manuellt spår (se S3). | alla modulord |
| K2 | Levererad bildsort = planens bildsort. `plan: animation` kräver animation, annars ett skrivet undantag med skäl. | alla |
| K3 | **Betydelseinventering gjord:** posten har fältet `senseInventory: { checkedAgainst: "SO", date, otherSenses: n }`, och alla vanliga betydelser finns som betydelser (de behöver inte vara modulord). | alla nya poster |
| K4 | Lemma som finns i grundordförrådet: grundbetydelsen ska finnas som betydelse i posten. | 313 poster nu |
| K5 | Förklaringen innehåller (a) ett konkret exempel, (b) minst en användningsuppgift: `collocations`, `usageNote` eller `register`, (c) för varje ord i `confusableWith` och varje blindtestförväxling: en mening om skillnaden eller en `synonyms`-länk. | B2+ |
| K6 | Två exempel, varav ett med annan böjningsform eller konstruktion än det första. | B2+ |
| K7 | Kort förklaring (1–2 meningar) också för abstrakta B1-ord (plan `symbol`). | B1 |
| K8 | Svensk och japansk text har samma antal meningar (± 0) i förklaring och exempel. | alla |
| K9 | Varje faktapåstående i `factSources` har `{ text, source, checked: datum, recheck: "årligen" \| "aldrig" }`. | moduler |

Varje modul får fältet `standard: 1 | 2`. Nya moduler måste vara `standard: 2`, annars stoppar `check.sh`. Gamla moduler är `1` tills eftersläpningen (S6) lyft dem.

### S2. Spärr: inget mätvärde får bli sämre

`npm run audit:content` skriver `quality/metrics.json` med måtten i den här rapporten per ämnesgrupp. CI jämför med den incheckade filen och **fallerar om något värde försämrats**. Förbättringar skrivs in och blir ny lägstanivå. Minsta uppsättning:

- andel modulkort utan bild · andel verb och processord med animation · planerad men ej levererad animation
- andel poster med fler än en betydelse · antal "kan också betyda" utan egen betydelse · antal grundord med bara fackbetydelse
- andel B2+ med användningsuppgift, två exempel, nämnda förväxlingar
- antal kanjiord med avvikande läsning · raka citattecken · typografifel · meningsantal SV≠JA
- antal bilddelar per modul · storlek på startpaketet · tid till bild (S4)

Det här är det som hindrar *nya sessioner* från att upprepa felen: de behöver inte ha läst något. Grinden säger nej.

Nya valideringsregler som hör hit (alla enkla):

1. `plan.kind` ≠ levererad sort → fel.
2. Samma kanjiord med två läsningar → fel, om inte paret står i `quality/readings-allow.json` (äkta dubbelläsningar som 昨夜).
3. Typografi: `..`, dubbla ord (med undantagslista: "var var", "de de"), dubbla blanksteg, raka citattecken, blanksteg före skiljetecken.
4. Namn → katakana: en tabell `characters.json` med namn, katakana, ålder, roll och relationer. Validatorn kräver att katakanan stämmer och att ett namn med fast roll inte presenteras som främling.
5. Citat i `explanationSv` måste finnas ordagrant i lästexten.
6. `descriptionSv` får inte vara en uppräkning av målorden.
7. Förklaringen nämner "kan också betyda" → posten måste ha minst två betydelser.
8. `contentVersion` och `updatedAt` räknas ut av ett skript ur innehållets hash, också för moduler som delar en ändrad betydelse. Aldrig för hand.

### S3. Bilder: reservtrappa, rätt test och animationer tillbaka

**Reservtrappa** (ersätter `none`):

1. animation → 2. scen → 3. symbol → 4. **manuellt spår** (produktägarens beslut, se Del 5): efter två underkända omgångar läggs ordet i en kö och får en bild som skapas för hand med större kreativ frihet.

Regeln "högst två blindtestomgångar" behålls för den vanliga produktionen. Skillnaden är att ordet går vidare till nivå 4 i stället för till `none`.

**Rätt test för rätt bild.** Det öppna blindtestet behålls för bilder med `quiz: true`. För symboler, som alltid visas med glosan, byts det mot ett **matchningstest**: granskaren får ordet och glosan och väljer rätt bild bland modulens bilder. Det mäter det eleven faktiskt gör. Beslutat, se Del 5.

**En källa.** `visualPlan.json` blir enda platsen för status. Mängden `VISUAL_MISSING_AFTER_BLIND_TEST` och listan i `PROJECT_STATUS.md` tas bort och ersätts av en genererad rapport.

**Animationer.**

- Planregel i kod, inte i text: verb, processubstantiv ("När …"), och ord vars definition beskriver rörelse eller förändring får `plan: animation` av `visuals-plan.mjs`. `vis.py` får inte längre skriva över planen, bara uppfylla den.
- **Enkel väg för saker:** låt en kodillustration innehålla rörelse (SVG-animation i samma motivfil, med stillbild som posterbild och vid "minskad rörelse"). Då kan samma agent som ritar bilden animera kulan, vätskan eller kurvan utan scenmotorn. Scenmotorn behålls för människor.
- Briefen får ett avsnitt *Animation* med ett exempel av varje sort, och `check.sh` stoppar `plan: animation` utan animation.
- Mål i `metrics.json`: animation för minst 60 % av verb och processord i nya moduler.

### S4. Laddtid

I prioritetsordning. Punkt 1–3 bör räcka för att ta bort den synliga väntan.

1. **Förladda modulens bilder.** Utöka `prefetchModuleVisuals()` så att den anropar `loadMotif()` för varje ord i modulen eller passet när det öppnas, och förladda alltid nästa korts bild medan det nuvarande visas.
2. **Sluta tömma cachen.** Filer med hash i namnet är oföränderliga. Service workern ska bara radera filer som inte finns i den nya versionens fillista, inte byta cachenamn.
3. **Behåll föregående bild tills nästa är klar**, och ta bort pulsen för väntetider under cirka 300 ms.
4. **Ett bildpaket per modul.** Ett byggsteg som för varje modul skriver en liten fil med exakt de 15–20 motiv modulen använder (cirka 10 kB), oavsett vilket område motivet ritades i. Då laddas en fil per modul i stället för sju delar på 45 kB. Källfilerna i `wordArt/` ändras inte.
5. **Lyft ordboken ur startpaketet.** Starta med ett litet sökindex (lemma, glosa, id) och ladda ordposter per modul eller vid uppslag.
6. **Prestandabudget i e2e:** tid från "Nästa" till synlig bild under 150 ms med varm cache och under 400 ms med kall cache på strypt nät. Mätvärdet in i `metrics.json`.

### S5. Betydelser

1. **Nytt obligatoriskt steg i briefen**, före skrivandet: `python3 tools/production/senses.py <ord>` visar postens betydelser, om lemmat är grundord, och kräver att agenten fyller i `senseInventory` (K3). Vanliga betydelser läggs in som betydelser utan att bli modulord. Datamodellen stöder det redan (81 sådana finns).
2. **Visningsordning skild från ID.** Nytt fält `order` på betydelsen. `OtherSenses` och ordboken sorterar på det. Då kan vardagsbetydelsen av *arbete* stå först fast den heter `s.arbete.2`. Inga ID:n ändras, ingen migrering av användardata.
3. **`level` på betydelsen** (med postens nivå som reserv), så att *arbete* (jobb) är A1 och *arbete* (fysik) B2.
4. **Homonymer med olika genus eller böjning** (*damm*): tillåt `inflection` på betydelsen som överskuggar postens.
5. **Grundordförrådet:** poster skapas inte för alla 1 865 grundord, bara när ett grundord blir modulord (K4).

### S6. Eftersläpningen i befintliga moduler

Genererade arbetsköer i `quality/backlog/*.json`, en per typ, sorterade så att det eleven möter först rättas först. Varje etapp är en session och slutar med att `metrics.json` förbättras.

| Kö | Antal | Innehåll |
|---|---|---|
| B1 Laddtid | kod | S4 punkt 1–3, sedan 4–6 |
| B2 Betydelser, säkra | 177 + 109 | "kan också betyda" och 「；」/"Också:" → egna betydelser |
| B3 Betydelser, grundord | 265 | lägg till grundbetydelsen, sätt `order` |
| B4 Betydelser, inventering | cirka 15 000 | resten, en ämnesgrupp per session, bara `senseInventory` + saknade betydelser |
| B5 Saknade bilder | 573 | manuellt spår (nivå 4), en ämnesgrupp per session |
| B6 Animationer | 46, sedan cirka 2 700 verb och 1 100 processord | först planerade men ej levererade, sedan fysik/kemi/kropp/vardagsverb där rörelsen bär betydelsen |
| B7 Förklaringar | 7 121 (B2+) | K5–K6, börja med de 6 760 förväxlingspar som inte nämns |
| B8 Språk och typografi | 451 + 1 015 + cirka 50 | läsningar, citattecken, typografi (till stor del skriptbart) |
| B9 Språkgranskning R04–R06 | 676 moduler | samma metod som R01–R03 |
| B10 Fakta | alla `factSources` | strukturera, datera, kontrollera det som är `recheck: årligen` |

---

## Del 4. Etapper för implementering

En etapp per session, i den här ordningen. Etapp 1–3 ger systemet, resten är eftersläpning.

1. **Slå ihop PR #66** (efter ny synk med `main`). Annars räknas redan rättade fel som eftersläpning, och grenen fortsätter krocka.
2. **Mätning och spärr:** `npm run audit:content`, `quality/metrics.json`, CI-jämförelse, de åtta valideringsreglerna i S2. Reglerna införs som varningar med nuvarande antal som tak, så att bygget inte blir rött första dagen.
3. **Laddtid** S4 punkt 1–3 och budgettestet. Det här är den enda etappen eleven märker direkt.
4. **Bildsystemet:** reservtrappa, matchningstest, plan som enda källa, `vis.py` slutar skriva över planen, animationsväg för saker, briefens animationsavsnitt.
5. **Datamodell för betydelser:** `order`, `level` och `inflection` på betydelsen, `senseInventory`, `senses.py`. Kräver ny innehållsversion men ingen ändring av lagrade användardata.
6. **Kontrakt version 2 och `standard`-fältet**, ny `PRODUCTION_BRIEF.md`. Från och med här kan nya moduler inte upprepa felen.
7. **Dokumentstädning:** `PROJECT_STATUS.md` ned till cirka 80 rader (nuläge, nästa steg, regler). Listorna flyttas till genererade filer under `quality/`. `CHANGELOG.md` delas i en fil per release, så att sammanslagningar inte krockar.
8. Därefter köerna B2–B10, varvat med ny produktion (*Biologi* står på tur).

Ändringar i `CLAUDE.md` (små): lägg till "Kör `npm run audit:content`; inget mätvärde får försämras" under Regler, och ersätt "Varje modulord ska ha bild, animation eller symbol" med hänvisning till kontraktet.

---

## Del 5. Produktägarens beslut (2026-11-18)

1. **Matchningstest för symbolbilder: ja.** Granskaren får ordet och glosan och väljer rätt bild bland modulens bilder. Bilder med `quiz: true` behåller det öppna blindtestet.
2. **Underkänd två gånger → manuellt spår.** Ordet får inte längre `none` och inte heller en automatisk bild av exempelmeningen. Det går till en kö där bilden skapas för hand med större kreativ frihet (egen ritning i stället för mallar, animation, bildserie, kontrastpar). Detta ersätter "kontextbild" i S3 och K1.
3. **Kort förklaring för abstrakta B1-ord: ja**, när ordet är nytt för eleven (första gången det är modulord).
4. **Systemet först, sedan varvat.** Del A och de snabba rättningarna görs före nästa nya överämne. Resten av eftersläpningen varvas med ny produktion. Arbetet görs av Opus enligt `docs/QUALITY_PLAN.md`. (*Biologi*, 0.52.0, och *Astronomi & rymd*, 0.53.0, släpptes med den gamla arbetsgången medan planen skrevs och ingår i eftersläpningen.)

---

## Bilaga. Täckning per ämnesgrupp (nya ord i gruppen)

| Grupp | Nya ord | Anim. | Scen | Symbol | Ingen | Verb | Anim. verb | Fler bet. |
|---|---|---|---|---|---|---|---|---|
| R01-A01 Hem & boende | 653 | 17 | 555 | 81 | 0 | 106 | 15 | 6 % |
| R01-A02 Mat & måltider | 645 | 37 | 515 | 91 | 2 | 112 | 33 | 9 % |
| R01-A03 Kläder & stil | 636 | 14 | 495 | 127 | 0 | 106 | 13 | 4 % |
| R01-A04 Tid & rutiner | 630 | 0 | 436 | 192 | 2 | 255 | 0 | 4 % |
| R01-A05 Handel & tjänster | 595 | 0 | 468 | 125 | 2 | 126 | 0 | 5 % |
| R01-A06 Resor | 634 | 0 | 517 | 115 | 2 | 84 | 0 | 3 % |
| R02-A01 Kroppen & sinnena | 631 | 194 | 382 | 55 | 0 | 155 | 116 | 4 % |
| R02-A02 Hälsa & sjukvård | 630 | 0 | 484 | 145 | 1 | 112 | 0 | 4 % |
| R02-A03 Känslor | 630 | 0 | 70 | 557 | 3 | 188 | 0 | 3 % |
| R02-A04 Relationer & familj | 651 | 5 | 461 | 183 | 2 | 215 | 5 | 4 % |
| R02-A05 Kommunikation | 597 | 0 | 114 | 483 | 0 | 229 | 0 | 7 % |
| R02-A06 Livsfaser | 558 | 0 | 145 | 412 | 1 | 173 | 0 | 6 % |
| R03-A01 Politik | 514 | 0 | 200 | 294 | 20 | 70 | 0 | 7 % |
| R03-A02 Juridik | 527 | 0 | 193 | 289 | 45 | 97 | 0 | 8 % |
| R03-A03 Ekonomi & arbetsliv | 500 | 0 | 170 | 305 | 25 | 82 | 0 | 6 % |
| R03-A04 Utbildning | 467 | 0 | 211 | 230 | 26 | 68 | 0 | 10 % |
| R03-A05 Städer & service | 433 | 0 | 307 | 117 | 9 | 24 | 0 | 5 % |
| R03-A06 Medier | 363 | 0 | 163 | 175 | 25 | 71 | 0 | 11 % |
| R04-A01 Historiska epoker | 475 | 0 | 288 | 167 | 20 | 43 | 0 | 5 % |
| R04-A02 Militärhistoria | 492 | 0 | 427 | 49 | 16 | 80 | 0 | 6 % |
| R04-A03 Religion | 398 | 0 | 223 | 158 | 17 | 16 | 0 | 3 % |
| R04-A04 Filosofi & etik | 352 | 0 | 38 | 266 | 48 | 48 | 0 | 4 % |
| R04-A05 Arkeologi | 399 | 0 | 278 | 107 | 14 | 51 | 0 | 7 % |
| R04-A06 Civilisationer | 271 | 0 | 193 | 60 | 18 | 10 | 0 | 3 % |
| R05-A01 Landskap & geologi | 397 | 0 | 313 | 63 | 21 | 46 | 0 | 7 % |
| R05-A02 Väder & klimat | 354 | 0 | 229 | 95 | 30 | 48 | 0 | 7 % |
| R05-A03 Djurvärlden | 520 | 0 | 447 | 59 | 14 | 82 | 0 | 8 % |
| R05-A04 Växter & svampar | 475 | 0 | 414 | 48 | 13 | 47 | 0 | 6 % |
| R05-A05 Ekologi & miljö | 316 | 0 | 182 | 91 | 43 | 40 | 0 | 6 % |
| R05-A06 Världsgeografi | 252 | 0 | 215 | 29 | 8 | 6 | 0 | 3 % |
| R06-A01 Matematikens grunder | 363 | 0 | 119 | 198 | 46 | 48 | 0 | 13 % |
| R06-A02 Avancerad matematik | 265 | 0 | 48 | 176 | 41 | 28 | 0 | 11 % |
| R06-A03 Fysik | 337 | 0 | 161 | 144 | 32 | 25 | 0 | 9 % |
| R06-A04 Kemi | 293 | 0 | 147 | 119 | 27 | 29 | 0 | 13 % |

Hur måtten räknades: "ord" = betydelse första gången den är modulord. "Symbol" = illustration med `symbol: true`. "Processord" = substantiv vars `defSv` börjar med "När ". "Förväxlingspar" = `confusableWith` i `wordVisuals.json`. "Avvikande läsning" = samma text inom `{…|…}` med fler än en läsning i hela materialet. Mätskripten bör återskapas som `npm run audit:content` i etapp 2.
