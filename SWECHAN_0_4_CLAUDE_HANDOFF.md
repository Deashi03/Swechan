# Swechan 0.4 — instruktioner till Claude Code

**Status:** Planerings- och överlämningsdokument. Ingen implementation av 0.4 har genomförts genom detta dokument.
**Baslinje:** main vid commit aa1cdbf74845583a9090a06bf86ad4dfc924d3d6 (0.3.1, 2026-11-04).
**Produktägarkrav:** Utveckla befintliga Swechan, skriv inte om den från grunden.

## 1. Förberedelser inför varje Claude-session

1. Läs CLAUDE.md, PROJECT_STATUS.md, ARCHITECTURE.md, DATA_MODEL.md, CONTENT_GUIDELINES.md, PEDAGOGY.md och ROADMAP.md.
2. Läs denna fil och de aktuella källfilerna. Läs alltid den nyaste main/arbetsgrenens kod; detta dokument är en granskningsbaslinje, inte en ersättning för aktuell kod.
3. Skapa en egen arbetsgren för en liten, avgränsad 0.4-etapp. Ändra inte releasekod på main under pågående utveckling.
4. Före ändring: kör npm ci, npm run typecheck, npm test, npm run validate:content, npm run build och dokumentera resultat.
5. Efter ändring: relevanta tester och dokumentation; gör PR med vad som faktiskt ändrades, risker, migrering och återstående arbete. Rapportera inte något som testat utan faktisk verifiering.

## 2. Faktiskt läge i 0.3.1

- React 19, TypeScript, Vite, Dexie/IndexedDB och ts-fsrs. PWA, GitHub Pages-workflow och svensk/japansk ordbok med furigana.
- Fem fullständiga moduler i två kedjor och en fristående: hemmet-vardag, material-amnen, atomer-molekyler, krig-forsvar och medeltida-borgar. I 0.3.1 är alla nedkortade till **20 mål samt högst 20 ord per modul**; schemat tillåter **15–20**. Behåll existerande moduler och deras stabila ID:n.
- Tre modulsteg, daglig repetition med FSRS per betydelse × färdighet, streak och streak freeze, ordbok även under övning, utvecklarverktyg, säkerhetskopior och nivåtest finns redan.
- 95 gröna tester och E2E-passering anges i PROJECT_STATUS.md. Den senaste CI-körningen på main var grön. Fysisk iPhone/WebKit och verklig TTS är inte dokumenterat verifierade.
- **Viktig risk:** src/config/appConfig.ts har resetProgressOnUpdate=true i utvecklingsläge. Ändring av APP_VERSION kan nollställa progression med återställningspunkt. Ingen tyst ändring av denna regel eller försämring av backup får ske.

## 3. Den planerade katalogen är inte 2 016 färdiga lektioner

Det finns en separat produktägarplaneringskatalog med **8 rotområden, 48 underområden, 288 ämnesgrupper och 2 016 planerade moduler**. Hierarki: 8 → 6 → 6 → 7. De två JSON-filerna i det separata Swechan 0.4-utvecklingspaketet heter Swechan_0.1_alla_moduler.json och Swechan_0.1_modulregister.json. Projektets katalogdata saknas ännu i 0.3.1-repot; begär källfilerna från produktägaren om de inte tillhandahållits i Claude-sessionen, i stället för att rekonstruera 2 016 titlar ur minnet.

- En planerad katalogpost har endast namn, placering, status och önskat antal ord (18 som standard, 15–20 tillåtet); inga färdiga ord, lästexter eller övningar.
- Svenska titlar och hierarkiska ID:n i katalogen är auktoritativa planeringsuppgifter. Japanska titlar saknas (null); fabricera aldrig en mänskligt granskad översättning.
- Katalogens ID:n är av typen SWC-... medan existerande publicerade moduler har ID av typen m.*. **Skilj på stabilt catalogId och publicerat moduleId. Byt aldrig gamla m.* eller s.* och förlora aldrig användarprogression.**
- Koppla bara ett catalogId till ett publicerat moduleId efter verifierad matchning; använd separat kompatibilitetsplacering när ett gammalt brett ämne inte motsvarar en exakt katalogpost.
- Inför två separata scheman: ett lätt katalogindex med planned/published och ett strikt fullständigt Module-schema. En planned-post är sökbar men inte startbar/rekommenderbar eller räknad som inlärd.

## 4. Begränsning: högst åtta val per menyskärm

Ämnesmenyns rot har högst åtta val; underområden högst sex; ämnesgrupper högst sex; modulnivån högst sju moduler plus eventuell tillbaka-knapp. Sökfält i sidhuvud räknas inte som extra ämneskategori. Om sökresultat visas som valmeny ska de pagineras. En planerad modul får informationsvy (ämne + status), men inte en vilseledande Starta-knapp.

Nuvarande src/ui/screens/Explore.tsx visar även sektionen Alla moduler på rotnivå. Den måste byggas om när stor katalog integreras för att inte rendera 2 016 kort i samma vy. Bevara godkänd Fjord-design och mobil användbarhet.

## 5. Prioriterad utvecklingsordning 0.4

### Fas A — säker baslinje och dokumentation

- Kör baslinjetester, auditera versionshantering och utvecklingsnollställning; testa återställningspunkt och migreringsfall.
- Korrigera README.md som fortfarande nämner 20–30 ord, medan 0.3.1 kräver 15–20.
- Gör inga oöverlagda ändringar av FSRS, streak, IndexedDB eller ord-ID:n.

### Fas B — strukturerad planerad katalog

- Skapa egna Zod-typer och ett katalogindex för planerade ämnen/moduler.
- Importera de auktoritativa katalogfilerna med deterministisk transformering, unika/stabila ID:n och automatisk kontroll av 8-valstaket, 344 kategorier och 2 016 moduler.
- Koppla befintliga fem modulernas ID:n utan felaktig eller ungefärlig 1:1-mappning.
- Bevara dagens fem kompletta moduler intakta.

### Fas C — Utforska och global sökning

- Gör navigationen djup, snabb, tillgänglig och max åtta val per menyskärm.
- Visa planned/published tydligt. Sök genom indexets metadata utan att ladda fullständiga lektioner.
- Enbart publicerade moduler får startas, väljas som dagens modul eller bidra till statistik.

### Fas D — separat lazy-laddning av publicerade lektionskroppar

- src/content/repository.ts laddar i dag import.meta.glob eager och ContentRepository samt getContent/getModule är synkrona. Refaktorera INTE allt samtidigt.
- Inför lätt synkront index för kategorier, modultitlar, status och sök; separat loadModuleBody(id): Promise<Module> för publicerade moduler med cache, felhantering, validering och återförsök.
- Migrera tjänster och UI i små vertikala snitt; bibehåll kompatibilitet för fem befintliga moduler tills alla anrop är säkra.
- Korrekt offlinekontrakt: visa vilka moduler som finns offline efter tidigare laddning; kontrollera service worker/PWA-uppdateringar.
- Redovisa faktiskt uppmätt skillnad i startsidesbundle/laddtid.

### Fas E — innehållsproduktion och QA

Inför körbara CLI-verktyg med dokumenterade npm-skript:
- catalog:validate (träd, unika ID:n, max 8, översättningsstatus),
- module:new (validerbar draft med 15–20 planerade målord),
- module:validate (Zod, betydelsereferenser, furigana, böjning, textens ordtäckning, frågor),
- content:report (brutna referenser, ointroducerade svenska ord, status, dubbletter, saknade översättningar).

Använd existerande vocabularyCheck.ts, validateContent.ts, CONTENT_GUIDELINES.md och centrala VocabularyEntry/WordSense. Publikation och granskningsstatus måste separeras: kvalitetsflaggan reviewed kräver verklig mänsklig granskning; AI får inte sätta den på eget initiativ. Svensk-japanska förklaringar ska innehållsmässigt överensstämma och svåra begrepp ska ha korta riktiga definitioner.

### Fas F — verklig produktionsverifiering

Skapa minst tre ytterligare *kompletta* moduler om möjligt (15–20 ord) som demonstrerar en pedagogisk förkunskapskedja. Återanvänd ord/WordSense där relevant. Testa hela kedjan: ämnesmeny → modul → lär → läs → ChatGPT-prompt → repetitionskort. Flagga AI-utkast tydligt; inga osanna påståenden om mänsklig språkgranskning.

### Fas G — slutgrind och 0.4-release

- npm run typecheck, npm test, npm run validate:content, npm run build ska passera.
- E2E och WebKit/iPhone testas där miljön tillåter; annars noteras explicit EJ TESTAT. Lägg gärna till reproducerbar Playwright-installation i CI.
- Säkerställ att gamla moduler, pågående modulsteg, FSRS-kort, savedWords, dagliga sessioner, streak och export/import fungerar.
- Kontrollera 0.3.1→0.4 progressionsbeteende med resetProgressOnUpdate både true och false.
- Uppdatera README, ARCHITECTURE, DATA_MODEL, CONTENT_GUIDELINES, ROADMAP, PROJECT_STATUS, CHANGELOG.
- Slutrapportera implementerade filer, tester, migrationspåverkan, risker och nästa avgränsade PR.

## 6. Fortsatt pedagogiskt kontrakt

Varje aktiv dag: normalt 20–25 gamla repetitionsuppgifter samt en ny modul; dagsstreak först när båda slutförts. Varje modul 15–20 ord med tre steg. Ord måste kunna tränas på betydelse, stavning och böjning, läsas i sammanhang och användas i konversation. Svenska/japanska förklaringar med korrekt furigana. Återkoppling på faktiska språkliga fel, inte pauser/stamningar. Fortsätt utgå från forskningsstödd återkallning och spridd repetition; öka inte innehållsmängden på bekostnad av faktagranskning.

## 7. Börja här i nästa Claude Code-session

Läs alla styrdokument och detta dokument, kontrollera aktuellt branchläge, skapa arbetsgren, kör baslinjetester. Genomför **endast fas A + en isolerad första del av fas B** i din första PR. Visa en konkret plan med ändrade filer, migrationsrisker och testfall. Fortsätt senare med fas C–G som separata, verifierbara arbeten. Fråga inte produktägaren om redan dokumenterade krav och radera aldrig befintlig kod för att underlätta en snabb rewrite.
