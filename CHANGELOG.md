# Changelog

## 0.4.0 – under utveckling (ej släppt)

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
