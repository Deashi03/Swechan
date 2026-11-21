# Projektstatus – nuläge

**Version:** 0.55.0 (2026-11-19) · **Senast uppdaterad:** 2026-11-19 · **Gren:** `main` (publiceras via GitHub Pages)

Läs den här filen först. Historik: `changelog/` (en fil per release eller etapp; läs bara den du behöver) och arkivet `CHANGELOG.md` (till och med 2026-11-18; läs aldrig hela).

## Vad som finns

- **Appen:** en PWA för japansktalande som lär sig svenska.
  - Varje dag: en *Dagens Swechan* med repetition (FSRS, upp till 25 kort) och en ny modul.
  - Modulerna har tre steg: ord, lästext och samtalsprompt.
  - Övrigt: streak med freezes, ordbok med sökning på svenska, japanska och kana, sparade och egna ord, nivåtest, export och import med återställningspunkt, och offlineläge.
  - Arkitekturen beskrivs i `ARCHITECTURE.md`.
- **Innehåll:** 1 559 publicerade moduler: R01–R05 hela, R06 *Matematik & naturvetenskap* hela och *Datorer & internet* (R07-A01, 0.55, första överämnet som skrivits enligt standard 2). Katalogen har 2 016 planerade moduler i 344 kategorier. Nästa överämne är *Programmering & artificiell intelligens* (R07-A02).
- **Bilder:** 16 376 ordbilder, 398 rörliga. 386 modulord väntar i det manuella bildspåret (se nedan). Symbol- och adjektivbilder har klarat ett oberoende blindtest.
- **Kvalitetssystemet (kvalitetsplanen A2–A7, 2026-11-19):**
  - `npm run audit:content -- --check` i CI: 23 kvalitetsmått för de befintliga modulerna får inte bli sämre (`quality/metrics.json`), och nya moduler måste uppfylla kontraktet (`quality/contract.json`, `"standard": 2`).
  - `contentVersion` sätts automatiskt (`npm run content:version`, kontrolleras i CI).
  - Laddtid: förladdade bilder, cache som överlever releaser, ordboken laddas lat (uppslagsdel vid start, fulla poster per ämnesgrupp), storleksspärr (`npm run bundle:report`). Bild efter "nästa" på cirka 30 ms i e2e.
  - Matchningstest för symbolbilder, manuellt bildspår i stället för "ingen bild", rörelse i motiv (`moving()`).
  - Betydelser: `order`, `level` och `inflection` per betydelse, `senseInventory` per post (`tools/production/senses.py`).
- **Regler som stoppas av validering och tester:** kontrollerat ordförråd, furigana, förklaringar för B2-ord och svårare, 15–20 ord per modul, bild eller manuellt spår för varje modulord, blindtest för symbol- och adjektivbilder, kvalitetsspärren och kontraktet.
- **Utvecklingsläge är på.** `devConfig.resetProgressOnUpdate = true`: varje ny `APP_VERSION` nollställer all progression. Det är produktägarens önskemål under utvecklingen, och en återställningspunkt sparas. Läget måste stängas av innan appen används på riktigt. Ändra det aldrig utan produktägarens besked.

## Nästa steg

1. **Kvalitetsplanen** (`docs/QUALITY_PLAN.md`, produktägarens beslut 2026-11-18): del A är klar (också A4b, lat ordbok). B1–B4 är klara, och *Datorer & internet* (R07-A01) är producerat som `standard: 2` (0.55). Nästa är **en etapp ur B5–B7** (förslag: B5, manuellt spår, värsta ämnesgrupp först), därefter ny produktion av *Programmering & artificiell intelligens* (R07-A02); uppdragen för den gruppen ska skrivas om efter den nya briefen. Kvar från B4: 152 planerade animationer och 13 processord utan bild i Fysik och Kemi ligger i det manuella bildspåret. Köerna: `npm run audit:content -- --backlog`.
   - Resten av eftersläpningen (B5–B7) varvas med ny produktion: en etapp mellan varje nytt överämne.
   - Beslut: matchningstest för symbolbilder, manuellt spår för bilder som underkänts två gånger (aldrig "ingen bild"), kort förklaring för abstrakta B1-ord.
   - Arbetet görs av Opus (produktägarens val).
2. Mänsklig granskning av språket: `quality/uncertainties.md`.
3. Test på fysisk iPhone: Safari/WebKit, riktig svensk röst och "Lägg till på hemskärmen". Inget av detta är testat ännu.

## Saknade bilder

386 modulord väntar i det manuella bildspåret (`status: "manual"` i planen). B5 tar en ämnesgrupp i taget; Avancerad matematik och Filosofi & etik (2026-11-20), Juridik & rättsväsende och Ekologi & miljö (2026-11-21) är klara, nästa är Fysik eller Matematikens grunder (32 kvar vardera). Efter två underkända omgångar gäller produktägarens regel: synonympar (`conf.py`) eller undantag (`waived`), se produktionsbriefen. Produktägaren beslutade 2026-11-21 om de 22 ord som underkänts två gånger: synonympar eller undantag (`blindTest.result: "waived"`), se `quality/visual-manual-notes.md`. Kö: `npm run audit:content -- --backlog` → `quality/backlog/ord-utan-bild.json`. Förväxlingar från blindtesten: `quality/visual-manual-notes.md`.

## Öppna osäkerheter

Flyttade till `quality/uncertainties.md`. Kvalitetsmåtten per ämnesgrupp: `npm run audit:content -- --report` → `quality/report.md`.

## Kom ihåg

- **Arbetsform (produktägarens regler):**
  - En etapp per session. När en release eller ett överämne är inlagt: uppdatera den här filen, stanna och be produktägaren starta en ny session.
  - Högst tre ämnesgrupper skrivs parallellt. Nästa grupp startas först när en är inlagd i integrationsgrenen.
  - En bild får högst två blindtestomgångar, se `CONTENT_GUIDELINES.md` → *Blindtest*.
  - Rutinsteg körs med låg ansträngningsnivå: registrera blindtest, uppdatera changelog och status, köra tester och bygga.
  - Byt aldrig till en lättare modell för svensk eller japansk text eller för bilder utan att fråga produktägaren.
- **Release:**
  - versionsnummer i `package.json`, `package-lock.json` (rad 3 och 9) och `APP_VERSION` i `src/config/appConfig.ts`
  - `public/sw.js` ändras inte längre per release (kvalitetsplanen A3).
  - en ny fil i `changelog/` (se `changelog/README.md`), den här filen och `ROADMAP.md`
  - Kör `npm run typecheck && npm test && npm run validate:content && npm run audit:content -- --check && npm run build && npm run e2e`.
- **Git:** om `git status` visar opushade commits trots att pushen lyckades, jämför med `git ls-remote origin <gren>` och uppdatera spårningsreferensen.
- **e2e:** `scripts/e2e-smoke.mjs` använder den planerade modulen *Variabler och datatyper* (SWC-TEK-02-01-01) som exempel. Byt exemplet när den publiceras. Samma modul och gruppen *Programmeringens grunder* (R07-A02-T01; kontrollera att gruppen inte har en ursprunglig modul) är planerade exempel i `Explore.test.tsx` och `catalog.test.ts`.
- **Delade betydelser och dubbletter:** kontrollera `add_sense` med `tools/production/senses.py` efter varje synk. I 0.38 skrev två grupper samma `s.riktning.2`. I 0.39 skrev parallella grupper 13 samma poster (t.ex. *kriterium*, *relativism*, *oförenlig*); posten flyttades till den första modulen i katalogordningen och den redan blindtestade bilden behölls. Ge grupperna besked när en annan grupp är inlagd, så att de mergar och kör exists.py igen före commit. I 0.40 hittade exists.py inte samma begrepp med olika lemma (*kulturmiljölagen*/*kulturmiljölag*); jämför också närliggande former och bestämd form.
- **Gruppskript:** lägg skripten i `agent/out/<grupp>/` i agentens worktree med `sys.path.insert(0, os.path.join(os.environ['SWECHAN_REPO'], 'tools', 'production'))` som första rad, så kan integratören köra dem i sitt träd. En `add_names()` ska infoga nya namn utan att sortera om och skriva `coreVocabulary.json` med `indent=0`; kontrollera `git diff --numstat` på filen efter varje grupp. Integreras en grupp före gruppen som kommer före den i katalogen (0.48: T05 före T04), sätt `PREV_FALLBACK` till den senast inlagda modulen och kör om gruppens första skript när den tidigare gruppen är inlagd, så att förkunskapen pekar rätt.
- **Blindtest:** ta fram listan över underkända bilder direkt ur `key.json` och `wordVisuals.json` (resultat ≠ `pass`), inte ur avkortad utdata från `art:blind:record`. `accept.py` matchar `lika` även i "inget annat ord passar lika bra" och i "jämlika", och missar "ligger nära", "kan också läsas" och "otydlig". Läs därför granskarens kommentar för varje medelsvar och bestäm själv; i 0.41 godtogs svar där andra ord bara passade "delvis" eller "svagt", medan "nästan lika bra", "kan också avses" och "otydlig" underkändes.
- **Testtimeout:** när tre gruppagenter kör vitest samtidigt kan tunga tester (`vocabularyCheck`, `learning`, `tools`) slå i 60-sekundersgränsen. Kör då om de testfilerna separat. I CI föll testjobbet i 0.41 och 0.42 på "Timeout calling onTaskUpdate" trots att alla tester passerade: de synkrona innehållstesterna blockerade workerns event-loop i över en minut. Från 0.42 släpper `src/test/setup.ts` event-loopen efter varje test.
- **Integration av grupper:** lägg in grupperna i katalogordning när det går. Blir en senare grupp klar först och delar poster med en tidigare grupp som ännu inte är inlagd: backa den senare gruppens innehåll (`git checkout -- src/content/data && git clean -fdq src/content/data`), lägg in den tidigare först och låt den senare synka och referera dess poster, så blir förkunskapskedjan mellan grupperna rätt utan efterhandsrättning. Integratören behöver bildcommiten, skripten och `spec.json`; körordning: skripten, `npm run visuals:plan`, `vis.py spec.json`, `conf.py` för synonymer, `check.sh`.
- **Testtidsgräns för bilder:** `images.test.ts` laddar alla bildfiler i `beforeAll`. Tiden växer med varje release; i 0.51 slog kroken i standardgränsen 10 s på CI och har nu 120 s.
- **GROUPS i `render.ts`:** när integratören hämtar `render.ts` från en agents worktree (`git checkout <gren> -- …`) försvinner rader som andra grupper lagt in under tiden (0.52: `'evo.'`). Lös konflikter så att alla rader behålls och kontrollera listan före commit.
- **Blindprov efter integration i fel ordning:** `art:blind … pending` tar med alla bilder som inte är registrerade, också från en annan grupp. Registrera ett blindtest innan nästa grupps prov förbereds, eller ta bort de andra gruppernas ark och nycklar ur katalogen före granskningen (0.53).
- **Manuellt spår i ny produktion:** K1 stoppar en `standard: 2`-modul även när ordet har `status: "manual"`. Orden som underkänts två gånger måste alltså ritas för hand och klara matchningstestet innan överämnet släpps (0.55: 17 ord, 16 godkända). Status `manual` får bara stå på modulord; ett ord som tas bort ur modulen får vanlig planrad.
- **Blindtestresultat vid omarbetning:** `blindTest` i `wordVisuals.json` har en hash av bilden. När en grupp skrivs om kan resultaten från en tidigare körning kopieras för samma `senseId` och motiv; bilder som ändrats syns som obesvarade i `art:blind … pending`. `vis.py` raderar gruppens blindtest, så kör det före kopieringen och inte efter matchningstest.
- **Matchningsprov för flera grupper:** `art:blind … pending --match` tar med alla väntande bilder, också underkända från en annan grupp. Ta bort de andra gruppernas ark och nycklar innan granskaren får katalogen.
- **Abstrakta fackord:** i 0.46 saknade 43 av 135 symbolbilder bild efter två omgångar, mest för ordpar i samma modul (*utsläppsrätt/utsläppshandel*, *vite/föreläggande*). Be gruppagenterna att redan i första omgången rita ordpar i samma modul som tydliga kontraster och att undvika två nära fackord i samma modul när det går.
- **Skyddade emblem:** rött kors på vit botten ritas inte som vårdsymbol; vård markeras med ett grönt kors (se `firstaid.ts`). I 0.45 rättade integratören en sådan bild före blindtestet.
- **Långa ord:** rubrikord med `.fit-word` i en `.fit-box` krymper så att ordets längsta del får plats (`components/fitWord.ts`). Använd samma mönster för nya ställen som visar ett ord i stor storlek.
- Regler för innehåll och bilder står i `CONTENT_GUIDELINES.md`, för kod i `ARCHITECTURE.md`, och produktionsarbetet i `docs/PRODUCTION_BRIEF.md`.
