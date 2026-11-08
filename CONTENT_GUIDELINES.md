# Riktlinjer för innehåll

Innehållskorrekthet är en kärnfunktion. Felaktiga översättningar, böjningar, furigana eller fakta är **allvarliga buggar**.

## Filer

| Fil | Innehåll |
|---|---|
| `src/content/data/dictionary/*.json` | Ordposter (valfri uppdelning per domän; alla filer slås ihop) |
| `src/content/data/modules/<slug>.json` | En modul per fil |
| `src/content/data/categories.json` | Kategorihierarkin |
| `src/content/data/grammarNotes.json` | Återanvändbara japanska grammatikförklaringar |
| `src/content/data/comparisons.json` | Jämförelser av närliggande ord |
| `src/content/data/placement.json` | Nivåtestets frågor |

Ingen kodändring behövs för en ny modul, kategori eller ordpost. Kör alltid `npm run validate:content` (och `npm test`).

## Grundregel: kontrollerat ordförråd (från 0.2)

Förklaringar, exempel, lästexter och frågor får **bara** använda ord som eleven redan kan:

1. **Grundordförrådet** (`src/content/data/core/coreVocabulary.json`, ungefär A1–A2, ~920 ord). Regelbundna böjningar känns igen automatiskt; oregelbundna former listas i `irregularForms`, egennamn i `names`.
2. **Målord i förkunskapsmodulerna** (`prerequisites`, transitivt).
3. **Målord i samma modul**:
   - en *definition* får bara använda ord som kommer **tidigare** i modulens ordlista,
   - ett *exempel* får dessutom använda ordet självt,
   - *lästext och frågor* får använda alla modulens ord.

Ordningen i `words` är alltså också **inlärningsordningen**. Lägg grundläggande begrepp först (t.ex. *partikel* före *atom*, *atom* före *molekyl*).
`npm run validate:content` kör kontrollen och listar varje text med okända ord. Lösningen är nästan alltid att **skriva enklare**, inte att lägga till ord i grundordförrådet. Lägg bara till verkligt grundläggande ord (A1–A2) där.

**Behövs ett svårare ord?** Gör det till ett målord tidigare i modulen, eller bygg en **förkunskapsmodul** (som *Material och ämnen* före *Atomer och molekyler*, och *Krig och försvar* före *Medeltida borgar*). Moduler bildar på så sätt inlärningskedjor; *Dagens modul* föreslår bara moduler vars förkunskaper är klara.

**Stil för definitioner:** korta meningar, konkreta exempel, inga facktermer som inte redan lärts in. Djupare fakta hör hemma i lästexten. Den japanska definitionen ska säga samma sak som den svenska.

## Flera betydelser

- Alla vanliga betydelser av ett uppslagsord ska finnas som egna `senses` (t.ex. *ämne*: substans, skolämne, samtalsämne, material att göra något av, "ämne till"). Kontrollera mot SO/SAOL.
- Ge varje betydelse en kort `labelSv` (t.ex. "substans", "skolämne"). Etiketten visas i ordintroduktionen och ordboken.
- Skriv **inte** "ordet har två betydelser" i `usageNote` – appen visar alla betydelser automatiskt i en egen sektion.

## Övningar som bara har ett rätt svar (0.3)

- Böjningsövningar använder fasta, naturliga meningar ("Jag tänker på den/det ___.", "… två ___.", "… de ___."; "Hon ___ nu / i går", "Hon har ___"; "Det är ___.", "De är ___."). För verb där "Hon" blir konstigt: ange `frame` på betydelsen, t.ex. `{"subject": "Armén", "complement": "staden"}`. Ramen kontrolleras av språkkontrollen.
- Kontextövningar bygger på betydelsens exempelmeningar. Ge varje betydelse en `tags`-etikett för ämnet (t.ex. "hemmet", "kemi", "krig"); distraktorer väljs från *andra* ämnen så att bara ett ord passar. Skriv exempelmeningar där målordet är tydligt bestämt av sammanhanget.

## Planeringskatalogen (0.4)

- Nya moduler hämtar ämne och svensk titel från `planning/catalog/swechan-catalog.v1.json`. Hitta aldrig på modulnamn eller ämnen utanför katalogen.
- En publicerad lektion får ett eget `m.*`-ID. När den motsvarar exakt en katalogpost: lägg en post i `links` i `publishedMapping.json` (med `verifiedBy`). Annars: `compatibilityPlacements` i en kategori där menyskärmen fortfarande har högst åtta val (kontrolleras av `npm run catalog:validate`).
- Japanska titlar i katalogen är `null` tills en människa har översatt och granskat dem. AI-förslag får inte markeras som granskade.

Exempel på en kedja (0.4 fas F): *Vanliga grönsaker* (SWC-VAR-02-01-01) → *Skära och hacka* (SWC-VAR-02-03-01) → *Koka och sjuda* (SWC-VAR-02-03-02). Varje modul har den föregående som förkunskap, så att senare förklaringar och texter får använda dess ord.

## Verktyg (0.4)

```bash
npm run module:new -- SWC-VAR-02-03-01        # utkast från katalogen (titel och storlek från katalogen)
npm run module:validate -- content/drafts/skara-och-hacka.json   # vad saknas i utkastet?
npm run content:index                          # efter att lektionen skrivits i src/content/data/modules/
npm run module:validate -- m.skara-och-hacka   # schema, referenser, furigana, böjning, textens ordtäckning, frågor, ordförråd, katalog
npm run content:report                         # helhetsbild
```

Utkast i `content/drafts/` ingår aldrig i appen. Status `reviewed` på en betydelse kräver `reviewer` och `date` och får bara sättas efter verklig mänsklig granskning; verktygen och AI sätter den aldrig.

## Svåra ord ska förklaras (0.8)

Produktägarens regel: **så fort ett ord är så svårt att en genomsnittlig elev i årskurs 9 skulle ha svårt för det, ska det förklaras ytterligare.** En lärare skulle aldrig säga ”specificerat kvitto” till högstadieelever utan förklaring. Det blir särskilt viktigt för fack- och samhällsord (t.ex. *ränta*, *belägring*, *existentialistisk*).

- Varje betydelse kan ha `explanation: { sv, ja }`, en längre förklaring som visas öppet i ordintroduktionen (rutan ”Förklaring · 詳しい説明”) och i ordboken.
- **Nivån B2 och uppåt betyder ”svårt för en genomsnittlig niondeklassare”.** Alla modulord på B2+ måste ha en förklaring (`EXPLANATION_FROM_LEVEL` i `schema.ts`). `validate:content` underkänner annars modulen. Sätt alltså nivån efter den regeln: fack-, myndighets-, ekonomi- och bostadsord samt formella ord är B2 även om de är vanliga för vuxna (i 0.8 flyttades 143 sådana ord från B1 till B2, t.ex. *moms*, *bolån*, *deposition* och *besked*).
- En bra förklaring (2–3 meningar, minst 60 tecken) säger **vad ordet betyder i praktiken, när och varför man använder det och vanliga kombinationer**. Exempel: *specificerad*: ”Ett specificerat kvitto visar varje vara på en egen rad med sitt eget pris, i stället för bara summan … Man behöver det till exempel när jobbet ska betala tillbaka en middag.” Ge gärna en svensk kulturbakgrund (”I Sverige …”) och skillnader mot Japan.
- Förklaringen får inte bara upprepa `defSv`. Den följer det kontrollerade ordförrådet som en definition: grundord, förkunskaper, tidigare ord i modulen och ordet självt. Den japanska versionen säger samma sak, med furigana.
- I generatorn: `s(..., expl=(sv, ja))`. För befintliga ord: `explain.py list` / `explain.py apply`. Generatorn behåller förklaringar som redan finns i ordboksfilen.

## Flerordsuttryck (produktägarens påminnelse 0.8)

Svenskan har många kombinationer av ord som tillsammans betyder något annat än orden var för sig, till exempel *komma ihåg*, *ta hand om*, *hålla med* och *på skämt*. De ska vara **egna ordposter** (lemma med mellanslag, t.ex. `v('komma ihåg', ...)` eller `x('på skämt', 'phrase', ...)`) och läras som en helhet, inte delas upp i sina delar. Partikelverb får `particle`. Reflexiva uttryck skrivs med *sig* (*ta på sig*). I lästexten måste uttrycket stå sammanhängande.

Kontrollen känner igen böjda former av verbuttryck (`v('ta sig till', ...)`, `v('sitta bra', ...)`), men inte av `x()`-fraser. Använd därför `v()` när uttrycket innehåller ett verb. Reflexiv i andra person (*spänner du fast dig*) och inverterad ordföljd (*svänger ni in*) känns inte igen, så skriv om meningen (*Aiko spänner fast sig*, *ni ska svänga in*).

**Homografer:** har ordet samma ordklass som en befintlig post läggs en ny betydelse till på posten (`s.spår.2`, järnvägsspår), inte en ny post. Den nya betydelsen valideras också mot ordförrådet i den modul som äger ordboksfilen. Annan ordklass ger en egen post med nyckel (`e.halka-noun`).

## Produktion i stor skala (0.5)

- **Ett överämne i taget.** Gör klart en ämnesgrupp (alla sju moduler) innan nästa påbörjas.
- **Rätt ord i rätt ämne.** Sök i katalogen (`planning/catalog/swechan-catalog.v1.json`) efter titlar som passar ordet bättre innan det görs till målord; spara t.ex. ekonomiord till Samhälle → Privatekonomi och kroppsord till Människan.
- **Sammansättningar** av två kända ord godtas av ordförrådskontrollen (`fläskfilé`, `vardagsmat`), men målordet självt räknas bara om det står i sin egen form i lästexten. Partikelverb måste stå sammanhängande ("hoppa över", inte "hoppar Erik över"); passiv form och delade partiklar känns inte igen.
- **Pluraliska ord** (*sopor*, *jeans* m.fl.): använd singularlemma om det finns, annars en post utan böjning (`kind: none`) och bara grundformen i texterna. Reflexiva verb (*ta på sig*) har ingen `particle`.
- **Bild:** från 0.7 läggs moduler till utan bild (produktägarens beslut i väntan på ny bild- och animationsinfrastruktur). Lägg inte till nya motiv eller ordbilder utan nytt beslut. `art.test.ts` kräver bara att de bilder som finns är unika.
- **Omvänd ordföljd** ("Har du jämnt?", "fyller hon ut") bryter målord som består av flera ord. Skriv om till rak ordföljd ("Det är bra om du har jämnt", "hon måste fylla ut"). Genitiv ("mottagarens") och reflexiv i andra person ("ångrar dig") känns inte heller igen.
- **Kolla både singular och plural** med `known.py`/ordboken innan ett ord görs till målord (*torrvaror* → finns som *torrvara*, *arbetsdagar* → *arbetsdag*).
- **Ta inte bort publicerade `s.*`-ID:n.** Måste en dubblett slås ihop (som `s.nopprig.1` → `s.noppig.1` i 0.7): dokumentera det i CHANGELOG. Gamla kort för den borttagna betydelsen ignoreras av repetitionen (`liveCards()`).
- **Japansk glosa:** undvik att lägga ett annat ords huvudglosa inom parentes (t.ex. 「靴屋（修理）」) – parentesdelen blir en egen sökterm i ordboken.

## Bilder på orden (0.6)

- **En bild per betydelse** där den hjälper. Form → illustration (`src/ui/wordArt/motifs.ts`, med plaggverktygen i `kit.ts`); yta/tillstånd (tillagning, material, mognad) → foto.
- **Gör skillnaden tydlig:** överdriv det som skiljer ordet från närliggande ord (knappar på *kofta*, dragkedja och huva på *munkjacka*, hög krage på *polotröja*). Markera en del av ett plagg med orange kontur (*ärm*, *krage*).
- **Abstrakta ord och egenskaper (0.18.1, samma princip som i Animation_tool-, `docs/WORD_FUNCTIONS.md`):**
  - Använd en symbolisk minischen som *bär* begreppet, gärna utifrån exempelmeningen. *Högtidlig* = en festklädd middag med vit duk, kandelaber och allvarliga ansikten, inte en figur vid ett bord. *Mätt* = rund mage och en hand som tackar nej till mer.
  - Scenen får vara symbolisk eftersom den alltid visas tillsammans med den japanska översättningen (ordintroduktionen och stavningsövningen). Symbolbilder visas aldrig i bildövningar och har alltid `quiz: false`.
  - Inga västerländska metaforer (uggla = visdom, lejon = mod, korsade fingrar = tur). Svenska gester ritas som de görs i Sverige: *hålla tummarna* = tummarna inne i knutna händer.
  - Finns ingen tydlig scen: ingen bild.
- **Ingen text som avslöjar ordet (0.18.1):**
  - Bilden visas både i bildövningarna och i stavningsövningen. Den får därför aldrig innehålla ordet eller en del av det, inte heller skyltar, etiketter eller ljudord som *MJÖL*, *KROG*, *krisp* eller *Skål!*.
  - Etiketter och skyltar får en ikon i stället (`labelIcons.ts`).
  - Testet *no picture spells out its own word* stoppar detta.
- **Egenskaper syns genom kontrast och överdrift (0.19.1).** Lärdomen från frisyr- och passformsbilderna, som såg rätt ut för den som ritade dem men inte visade ordet:
  - **Egenskapen ska dominera bilden.** Det som skiljer *lockig* från *vågig*, *tajt* från *lös* ska vara det största och tydligaste i bilden, inte en detalj på en standardfigur.
  - **Jämför med en grå referens.** En grå figur/sak i normalutförande bredvid den färgade som har egenskapen (`compare`/`fitPair` i `fitFigures.ts`): *tajt* = grå normal tröja bredvid en färgad som spänner över kroppen.
  - **Använd inte en mall som inte kan bära egenskapen.** Standardfiguren har fasta kläder och fast frisyr. Den kan aldrig visa passform eller hårstruktur – rita då med `dressed()` eller en egen närbild.
  - **Markeringar stödjer, de bär aldrig.** Pilar, orange ringar och små tecken får peka på egenskapen men aldrig vara det enda som visar den.
  - **Situation framför sak.** Ett tillstånd visas genom vad det gör med någon (*andfådd* = flämtar högst upp i trappan, *uttorkad* = törstig efter loppet med tom flaska), gärna utifrån exempelmeningen.
- **Blindtest är obligatoriskt för symboler och egenskaper (0.19.1).** Den som ritat en bild kan inte bedöma den, eftersom hen vet vilket ord den ska visa.
  1. `npm run art:blind -- <mapp> pending` gör numrerade bildark utan ord för alla symbol- och adjektivbilder som saknar giltigt blindtest. Till varje ark hör modulens ordlista med japansk glosa.
  2. En granskare som inte vet svaret (en ny AI-session eller en människa) skriver för varje bild vilket ord den visar, med säkerhet *high/medium/low*. Instruktion till granskaren: läs `<mapp>/mN.png` och `<mapp>/mN.txt`, öppna inga andra filer, välj för varje numrerad bild det ord som bilden tydligast visar, nämn i `problem` andra ord ur listan som passar lika bra, och skriv `<mapp>/answers_K.json` som `{ "mN": { "1": { "word", "conf", "saw", "problem" } } }`.
  3. `npm run art:blind:record -- <mapp> [godtagna-medium]` sparar resultatet i `blindTest` med ett fingeravtryck av den testade bilden. Godkänt = rätt ord med hög säkerhet, eller medel efter att författaren läst granskarens kommentar. Ett ord i `confusableWith` ger `synonym`.
  4. Testet *every symbol and adjective picture passed an independent blind test* stoppar bilder utan blindtest och bilder som ritats om efter sitt blindtest.
- **`quiz: true` bara om bilden entydigt visar ordet.** Allmänna ord (*långbyxor*, *underkläder*) och nästan identiska ord (*mysbyxor* bredvid *mjukisbyxor*) får `quiz: false`.
- **`group`** samlar ord som liknar varandra visuellt (överdelar, byxor, jackor …); distraktorer tas aldrig från samma grupp. **`confusableWith`** anger förväxlingar över gränserna (*brud* ↔ *brudklänning*, *bryna* ↔ *steka*).
- **Foton:** bara CC0, public domain eller CC BY (aldrig NC eller SA). Ange titel, upphovsperson, licens och källsida. Neutral bakgrund, motivet centrerat, inga igenkännbara personer, ingen text. 400 × 400 webp under 80 kB.


1. **Välj ämne** och placera det i kategoriträdet (lägg till kategorier vid behov; `parentId`, `order`, svenska + japanska namn).
2. **Välj 15–20 målord** (från 0.3.1; kortare moduler är mindre tunga att ta sig igenom). Blanda ordklasser. Markera ~60 % som `active: true` (ska kunna användas) och resten som `active: false` (främst förstå).
3. **Sök i ordboken först** (`npm run dev` → Ordlista, eller grep i `dictionary/`). Finns betydelsen redan: referera dess `senseId`. Finns ordet men inte betydelsen: lägg till en ny `sense` i samma post. Skapa annars en ny post.
4. **Kontrollera betydelse och böjning** mot en auktoritativ källa (SAOL/SO via svenska.se, Språkbankens Karp/SALDO). Alla former skrivs explicit; alternativa former i `variants`.
5. **Skriv förklaringar**: `defSv` och `defJa` ska bygga på **samma faktaunderlag** och säga samma sak. Korta, pedagogiska, sakligt korrekta. Sätt `concept: true` för tekniska/historiska/abstrakta begrepp.
6. **Furigana**: varje kanji i japansk text inom `{漢字|かんじ}`. Läsningen ska stämma i *sammanhanget* (t.ex. `{何|なん}か{月|げつ}`). Validatorn hittar saknad furigana men **inte fel läsning** – det kräver mänsklig granskning.
7. **Exempelmeningar**: naturlig svenska, gärna med vanlig kollokation; japansk översättning som är naturlig (inte ord-för-ord).
8. **Lästext**: alla målord ska förekomma (valfri böjningsform). Ämnet får vara avancerat, men övriga ord ska vara grundord eller förkunskapsord – detta kontrolleras automatiskt. Kontrollera fakta och ange `factSources`.
9. **Kontrollera målorden mot texten**: `npm run validate:content` rapporterar målord som saknas. Obs: delade partikelverb ("plockar hon undan") och passiv på -s känns inte igen – skriv om eller använd en sammanhängande form.
10. **Läsförståelsefrågor**: minst 3, helst 5. Blanda `detail`, `cause`, `usage` (hur ett målord används, t.ex. rätt betydelse av ett flertydigt ord) och `inference`. Frågorna ska testa förståelse, inte bara ordigenkänning. Ge förklaring (gärna även japansk).
11. **Konversationsunderlag**: `scenarioSv` + 3–4 `discussionPoints`. Prompten genereras automatiskt.
12. **Validera och publicera**: `npm run content:index && npm run validate:content && npm test`. Öka `contentVersion` och `updatedAt` vid ändring av en befintlig modul.

## Japansk text i gränssnittet (produktägarens återkoppling 0.15)

- Japansk text som hör till ordet som lärs in (översättning, definition, exempel, förklaring, svarsalternativ, ledtråd) ska vara stor och mörk, med tydlig furigana. Använd klassen `ja-word` (block) eller `ja-gloss` (i en rad), eller `jaClassName` på `LangText`. Se ADR 40.
- Instruktioner och annan hjälptext får vara liten och grå (`small`/`xsmall muted`).
- Nya komponenter som visar japanska om ordet ska följa samma regel.

## Ansiktsuttryck (produktägarens återkoppling 0.13)

Ord där ansiktet bär betydelsen (miner, blickar, ansiktsuttryck, kroppsljud som syns i ansiktet, ljus- och ljudkänslighet, hudfärg vid sjukdom) är svåra och får aldrig göras med helfiguren – den är för liten, ögonbrynen är lika mörka som håret och den saknar näsa. Använd **ansiktsriggen** (`src/ui/face/rig.ts`, scener i `scripts/faces/*.faces.ts`, `npm run faces:build`):

- Ansiktet fyller hela rutan. Varje ord har **en tydlig huvudsignal** (t.ex. höjda ögonbryn + pannrynkor, rynkad näsa med veck och lyft näsvinge, pupiller uppåt) och stödsignaler som stämmer med den (ögonlock, mun, huvudets lutning).
- Börja neutralt (nyckel vid t = 0), bygg upp uttrycket, håll det. `posterMs` är toppen – det är den bilden som syns i bildövningar.
- Ord som lätt förväxlas (*stirra / snegla / blänga*, *leende / flina*, *kisa / bländad / ljuskänslig*) ska skilja sig i något som syns i en stillbild, och listas i `confusable`.
- Granska alltid bildremsorna i full storlek (`npm run faces:build -- --strips remsor.html`) innan import, och titta på posterbilden i 120 px. Lägg hellre till en parameter i riggen än att acceptera ett otydligt uttryck.
- Samma regel gäller alla framtida överämnen (t.ex. *Känslor & psykologi*): känslor och miner visas med riggen.

## Regler för ordposter

- ID:n är permanenta. Byt aldrig betydelse på ett befintligt `senseId` – användarens repetitionskort hänger på det. Rättelser av stavning/böjning/översättning är OK.
- En betydelse = ett begrepp. Synonymer/närliggande ord kopplas med `synonyms` på betydelsenivå; ange gärna `noteSv`/`noteJa` om skillnaden.
- Ord med tydligt överlappande japanska glosor (t.ex. *borg/slott* = 城) bör ha en **jämförelse** (`comparisons.json`), annars kan de bli tvetydiga i övningar. Generatorn undviker automatiskt distraktorer med gemensam glosa eller synonymrelation.
- `register` för stilnivå (vardagligt, formellt, fackspråk, historiskt, litterärt). `usageNote` för viktiga begränsningar och skillnader mot japanska.
- `level` (A1–C2) = ungefärlig nivå för ordet (används för att korta ner introduktioner).
- `quality.status`: `ai-draft` tills en människa med god svenska och japanska har granskat posten; då `reviewed` + `reviewer` + `date`.

## Källor och licenser

Kopiera **aldrig** skyddade ordboksdatabaser (t.ex. SAOL, SO, kommersiella ordböcker) in i projektet. Använd dem som referens för kontroll.
Möjliga öppna resurser att undersöka (kontrollera licens före import):
- **SALDO** (Språkbanken Text, CC BY 4.0) – morfologi och semantik; lämplig för framtida automatisk böjningskontroll.
- **Kelly-listan** (svensk frekvenslista, CC BY-NC-SA 2.0 eller motsvarande – kontrollera; *NC* kan begränsa användning).
- **JMdict** (EDRDG, CC BY-SA 4.0) – japansk lexikal resurs för kontroll av läsningar.

## Status
Allt innehåll (v0.1–0.4, inklusive de tre matlagningsmodulerna) är producerat med AI-stöd och markerat `ai-draft`. Det har kontrollerats automatiskt (schema, furigana-täckning, referenser, målord i texter) men **inte granskats av en människa**. Prioritera granskning av japanska översättningar och läsningar.
