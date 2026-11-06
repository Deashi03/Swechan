# Datamodell

Två helt separata delar: **innehåll** (levereras med appen, `src/content/data/`, validerat av `src/content/schema.ts`) och **användardata** (IndexedDB, `src/storage/types.ts`). Användardata refererar innehåll endast via stabila ID:n.

## Innehåll

```
Category (c.*) ──parentId──► Category        hierarki, obegränsat djup, flyttbar
   ▲
   │ categoryId (huvudplacering) + tags[] + related[]
Module (m.*) ── words[] ──► ModuleWord { senseId, active }
   │                              │
   ├─ reading: ReadingText        ▼
   │    paragraphs[], questions[]  WordSense (s.<lemma>.<n>) ◄── synonyms[] (per betydelse)
   └─ conversation                 ▲   examples[], defSv/defJa, explanation (0.8), usageNote, grammarNotes[]
                                   │ senses[]
                          VocabularyEntry (e.<lemma>)
                            lemma, pos, level, inflection (per ordklass), pronunciationNote

coreVocabulary.json  grundordförråd (lemman, oregelbundna former, egennamn) för språkkontrollen
GrammarNote (gn.*)   återanvändbara japanska förklaringar (genus, bestämd form, partikelverb …)
Comparison (cmp.*)   jämförelse av närliggande betydelser (intensitet, formalitet, nyans)
PlacementItem (p.*)  nivåtestets frågor
```

### Nyckelprinciper
- **VocabularyEntry** = uppslagsord. **WordSense** = en betydelse. Flera betydelser (t.ex. *laga* 1 'laga mat', 2 'reparera'; *storma*; *ämne*; *förening*) ligger under samma uppslagsord.
- **Moduler refererar betydelser** (`senseId`), aldrig kopior. Samma betydelse kan finnas i flera moduler; en rättelse slår igenom överallt.
- **Inflection** är en diskriminerad union per ordklass (`noun`, `verb`, `adjective`, `none`). Alla former lagras explicit; `variants` håller godtagna alternativ (t.ex. *dammsög / dammsugde*). Partikelverb har `particle`; substantiv utan plural har `indefPl: null`.
- **Japansk text** använder furigana-markering `{分子|ぶんし}`; varje kanji måste ha läsning (valideras).
- **frame** (valfri) på en betydelse: `{ subject?, complement? }` för böjningsövningarnas meningsramar, t.ex. `{ subject: "Isen" }` för *smälta* → "Isen ___ i går." Standardsubjekt är "Hon".
- **labelSv** (valfri) är en kort etikett per betydelse ("substans", "skolämne") som visas i ordintroduktion och ordbok.
- **Ordningen i `Module.words`** är inlärningsordningen och styr vilka ord en definition får använda.
- **Synonymrelationer** ligger på betydelsenivå (`synonym | near | antonym | related`) med valfria förklaringar.
- **quality.status** (`ai-draft | reviewed`) markerar granskningsstatus per betydelse.
- **ID-format**: `e.<lemma>`, `s.<lemma>.<n>`, `m.<slug>`, `c.<sökväg>`; mellanslag i lemma → bindestreck (`e.plocka-undan`). ID:n får aldrig återanvändas för ett annat begrepp.

### Innehållsversioner
Varje modul har `contentVersion` och `updatedAt`. Användarens `ModuleProgress.contentVersion` sparar vilken version hen började med. (Hantering av ändrad version under pågående modul: se PROJECT_STATUS – planerat.)

## Planeringskatalog (0.4)

`planning/catalog/swechan-catalog.v1.json` – produktägarens auktoritativa planeringsdata (ändras inte av appen):

```
CatalogCategory  catalogCategoryId (R01 · R01-A01 · R01-A01-T01), parentCatalogCategoryId, titleSv, titleJa (null = ej granskad)
CatalogModule    catalogId (SWC-XXX-nn-nn-nn), catalogCategoryId (alltid en ämnesgrupp), titleSv, titleJa, status planned|published, targetWordCount 15–20
```
8 rotområden → 48 underområden → 288 ämnesgrupper → 2 016 moduler (7 per ämnesgrupp). En planerad post har inga ord, texter eller övningar och kan aldrig startas.

`src/content/data/catalog/publishedMapping.json` – appens koppling till publicerade lektioner:
- `links`: verifierad 1:1 `catalogId` ⇔ `moduleId` med `verifiedBy` (0.4: de tre matlagningsmodulerna; 0.5: 105 kopplingar). Den publicerade lektionen ersätter då den planerade posten i ämnesgruppens meny.
- `compatibilityPlacements`: publicerad `m.*`-modul som visas i en katalogkategori utan att påstå ett `catalogId`; `overlapsCatalogIds` anger ämnesöverlapp (inte likvärdighet). Från 0.5 måste kategorin vara en ämnesgrupp (utan underkategorier).

0.5 ändrar inte användardata (Dexie-versionen är oförändrad).

**Bilder (0.6) och animationer (0.12):** `src/content/data/images/wordVisuals.json` (hette `wordImages.json` före 0.12) – `{ senseId, kind: illustration|photo|animation, motif | file+credit | animationId+file+reviewStatus+fallbackMotif?, group, quiz, confusableWith?, symbol? }`, högst en visualisering per betydelse. En `animation` pekar på `public/anim/scenes/<file>.json` (rå scen från Animation_tool-; `file` är ett ASCII-säkert namn, `animationId` kan innehålla å/ä/ö); `fallbackMotif` är kodillustrationen som visas om scenen inte kan laddas. Från 0.13 kommer scenerna antingen från Animation_tool- eller från `scripts/scenes/*.scenes.ts` (samma format, `template: "body"`, `pedagogy.reviewStatus: "ai-draft"`); illustrationsmotiv för *Kroppen & sinnena* har prefixet `kropp.` (`src/ui/wordArt/bodyMotifs.ts`). Flera betydelser får dela motiv när orden är synonymer (t.ex. *rumpa*/*stjärt*, *urin*/*kiss*); de listar då varandra i `confusableWith`.

**Visualiseringsplan (0.12):** `src/content/data/images/visualPlan.json` – `{ plan: { [senseId]: { kind: animation|scene|symbol|none, by: heuristic|manual } } }`. Anger vilken sorts bild varje betydelse ska få (handling → animation, konkret sak → scen, abstrakt ord/känsla/egenskap/idiom → symbolisk scen med japansk glosa som aldrig används i bildövningar, funktionsord → ingen). `heuristic` = AI-utkast från `npm run visuals:plan`; `manual` = granskad. Validatorn kräver en rad för varje modulord. Läses bara av verktyg (`content/visualPlan.ts`), inte av appen.

Båda filerna är innehåll, inte användardata; ingen Dexie-version behövs. Innehåll, inte användardata. Nya `exerciseType`-värden i svarshistoriken: `image_choice`, `image_pick` (fältet är redan en fri sträng i schema och säkerhetskopia, så ingen migrering behövs). Illustrationerna är kod (`src/ui/art/`) och lagras inte.

`catalogId` (planering) och `moduleId` (publicerad lektion) är olika identiteter. Användardata refererar alltid `moduleId`/`senseId`, aldrig `catalogId`.

## Användardata (IndexedDB `swechan`, Dexie-version 1)

| Tabell | Nyckel | Innehåll |
|---|---|---|
| `meta` | `key` | `settings`, `streak` (StreakState), `placement`, `installDate`, `restorePoint`, `personalLearn`, `onboarded` |
| `cards` | `id` = `senseId|dimension` | Repetitionskort per betydelse och kunskapsdimension (`meaning`, `spelling`, `inflection`); `due`, `createdDate`, algoritmtillstånd `sched` |
| `reviewEvents` | auto-id | Varje svar: senseId, dimension, övningstyp, fas (`learn/review/extra`), korrekt, antal försök, betyg, tid, studiedatum, nästa förfallotid, ev. sammanblandad betydelse |
| `moduleProgress` | `moduleId` | Status, stegstatus, steg-1-plan + position + resultat, läsningens svar |
| `dailySessions` | `date` | Dagens frysta repetitionsplan, index, klar-tider, avklarade moduler, extrarepetitioner |
| `savedWords` | `senseId` | Sparade ord, kö för inlärning utanför modul, `learnedAt` |

Ingen persondata utöver inlärningsdata lagras (inga namn, ingen e-post, ingen spårning).

### Härledda värden (lagras inte)
- **Kunskapsnivå per ord** (`learning/knowledge.ts`) beräknas ur `cards` + `reviewEvents`.
- **Svåra ord** och **sammanblandade ordpar** beräknas ur `reviewEvents`.
- **Statistik** (`stats/stats.ts`).

### Migrering
- Schemaändring: lägg till `this.version(n).stores({...}).upgrade(tx => ...)` i `storage/db.ts`, öka `DATA_VERSION`.
- Säkerhetskopior har `backupVersion`; `migrateBackup()` i `storage/backup.ts` uppgraderar äldre format. Filer från en *nyare* version avvisas.
- Import: hela filen valideras med Zod först; nuvarande data sparas som `restorePoint`; ersättning sker i en enda transaktion (allt eller inget).

## Säkerhetskopia (JSON)

```json
{
  "format": "swechan-backup",
  "backupVersion": 1,
  "appVersion": "0.1.0",
  "exportedAt": "2026-11-04T10:00:00.000Z",
  "data": { "meta": [], "cards": [], "reviewEvents": [], "moduleProgress": [], "dailySessions": [], "savedWords": [] }
}
```
