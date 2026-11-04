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

## Process för en ny modul

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
Allt innehåll (v0.1–0.2) är producerat med AI-stöd och markerat `ai-draft`. Det har kontrollerats automatiskt (schema, furigana-täckning, referenser, målord i texter) men **inte granskats av en människa**. Prioritera granskning av japanska översättningar och läsningar.
