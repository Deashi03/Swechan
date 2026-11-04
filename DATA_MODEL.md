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
   └─ conversation                 ▲   examples[], defSv/defJa, usageNote, grammarNotes[]
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
