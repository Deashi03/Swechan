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

## Process för en ny modul

1. **Välj ämne** och placera det i kategoriträdet (lägg till kategorier vid behov; `parentId`, `order`, svenska + japanska namn).
2. **Välj 20–30 målord** (standard 25). Blanda ordklasser. Markera ~60 % som `active: true` (ska kunna användas) och resten som `active: false` (främst förstå).
3. **Sök i ordboken först** (`npm run dev` → Ordlista, eller grep i `dictionary/`). Finns betydelsen redan: referera dess `senseId`. Finns ordet men inte betydelsen: lägg till en ny `sense` i samma post. Skapa annars en ny post.
4. **Kontrollera betydelse och böjning** mot en auktoritativ källa (SAOL/SO via svenska.se, Språkbankens Karp/SALDO). Alla former skrivs explicit; alternativa former i `variants`.
5. **Skriv förklaringar**: `defSv` och `defJa` ska bygga på **samma faktaunderlag** och säga samma sak. Korta, pedagogiska, sakligt korrekta. Sätt `concept: true` för tekniska/historiska/abstrakta begrepp.
6. **Furigana**: varje kanji i japansk text inom `{漢字|かんじ}`. Läsningen ska stämma i *sammanhanget* (t.ex. `{何|なん}か{月|げつ}`). Validatorn hittar saknad furigana men **inte fel läsning** – det kräver mänsklig granskning.
7. **Exempelmeningar**: naturlig svenska, gärna med vanlig kollokation; japansk översättning som är naturlig (inte ord-för-ord).
8. **Lästext**: alla målord ska förekomma (valfri böjningsform). Ämnet får vara avancerat, men utöver målorden ska språket vara enkelt (sikta på att > 95 % av övriga ord är kända för en elev på modulens nivå). Kontrollera fakta och ange `factSources`.
9. **Kontrollera målorden mot texten**: `npm run validate:content` rapporterar målord som saknas. Obs: delade partikelverb ("plockar hon undan") och passiv på -s känns inte igen – skriv om eller använd en sammanhängande form.
10. **Läsförståelsefrågor**: minst 3, helst 5. Blanda `detail`, `cause`, `usage` (hur ett målord används, t.ex. rätt betydelse av ett flertydigt ord) och `inference`. Frågorna ska testa förståelse, inte bara ordigenkänning. Ge förklaring (gärna även japansk).
11. **Konversationsunderlag**: `scenarioSv` + 3–4 `discussionPoints`. Prompten genereras automatiskt.
12. **Validera och publicera**: `npm run validate:content && npm test`. Öka `contentVersion` och `updatedAt` vid ändring av en befintlig modul.

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

## Status i v0.1
Allt innehåll i v0.1 är producerat med AI-stöd och markerat `ai-draft`. Det har kontrollerats automatiskt (schema, furigana-täckning, referenser, målord i texter) men **inte granskats av en människa**. Prioritera granskning av japanska översättningar och läsningar.
