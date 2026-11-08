# Projektstatus – överlämning

**Version:** 0.23.0 · **Senast uppdaterad:** 2026-11-08 · **Gren:** `main` (publiceras via GitHub Pages; 0.23 utvecklades i grenen `claude/swechan-0.23`)

Det här dokumentet är överlämningen mellan arbetstillfällen. Läs det först, sedan `ARCHITECTURE.md`.

## 0.23 – släppt 2026-11-08 (Hälsa & sjukvård har bilder)

- **Gjort:**
  - Bilder till hela *Hälsa & sjukvård* (801–857): 629 av 630 modulord. *motion* har ingen bild (underkänd två gånger).
  - 145 symbol- och adjektivbilder blindtestades (122 godkända, 23 synonymfall).
  - Motiven finns i `symptoms.ts` (`sympt.`), `care.ts` (`besök.`), `disease.ts` (`sjuk.`), `medicine.ts` (`med.`), `firstaid.ts` (`akut.`) och `prevention.ts` (`frisk.`).
  - Vård markeras med ett grönt kors. Inget rött kors, inga läkemedelsmärken och inga myndighetslogotyper.
  - I hela appen har 5 541 av 6 182 modulord en bild.
- **Nästa steg (0.24):** 900-serien (*Känslor & psykologi*, cirka 630 ord) och övriga moduler utan bild.
- **Kom ihåg:**
  - Acceptlistan till `art:blind:record` är kommaseparerad. Med mellanslag godtas ingen av de listade bilderna.
  - Ett svar med låg säkerhet godkänns aldrig som synonymfall. Rita hellre om bilden än att lägga till fler `confusableWith`.
  - När en bild ändras efter blindtestet (även bara en färg) måste den testas igen.

## 0.22 – släppt 2026-11-08 (Resor & transport har bilder)

- **Gjort:**
  - Bilder till hela *Resor & transport* (601–657): 634 av 636 modulord. *varifrån* och *en bit* har ingen bild (underkända två gånger).
  - 115 symbol- och adjektivbilder blindtestades (108 godkända, 7 synonymfall).
  - Motiven finns i `transit.ts` (`trafik.`), `nav.ts` (`väg.`), `car.ts` (`bil.`), `bike.ts` (`cyk.`), `rail.ts` (`tåg.`) och `travel.ts` (`res.`).
  - I hela appen har 4 912 av 6 182 modulord en bild.
- **Nästa steg (0.23):** de överämnen som återstår (800- och 900-serierna samt övriga moduler utan bild).
- **Kom ihåg:**
  - Flytta en figur uppåt med `g('translate(0 -dy)', P(...))`. Använd aldrig `.replace()` på figurens SVG-sträng, eftersom figuren innehåller flera `translate`.
  - Om `git status` visar opushade commits trots att pushen lyckades: jämför med `git ls-remote origin <gren>` och uppdatera spårningsreferensen.
  - Ange alltid scratchpad-sökvägen fullt ut till `art:blind` (en tom variabel skrev en gång bladen till `/b22b`).

## 0.21 – släppt 2026-11-08 (Handla & tjänster har bilder)

- **Gjort:**
  - Bilder till hela *Handla & tjänster* (501–542): 628 av 630 modulord. *leverans* och *vänligen* har ingen bild (underkända två gånger).
  - 126 symbol- och adjektivbilder blindtestades (113 godkända, 13 synonymfall).
  - Motiven finns i `shopping.ts` (`köp.`), `money.ts` (`peng.`), `stores.ts` (`buti.`), `online.ts` (`ehan.`), `post.ts` (`post.`) och `services.ts` (`tjän.`).
  - I hela appen har 4 280 av 6 182 modulord en bild.
- **Nästa steg (0.22):** överämnena i 600-, 800- och 900-serierna, ungefär 630 ord vardera.
- **Kom ihåg:**
  - Arbetsgången är densamma som i 0.20: rita, granska ark, registrera, blindtest, `record`, rätta.
  - Ta bort granskarens svar för en bild som har ritats om innan du kör `record` igen. Annars kopplas gamla svar till den nya bilden.
  - Använd aldrig osynlig text eller tomma platshållare (`.slice(0, 0)`, `'none', 'none', 0`) i motiven. Skriv bara det som ska synas.
  - Varumärken ritas aldrig: betaltjänster, postföretag, operatörer och myndigheter visas med allmänna symboler.

## 0.20 – släppt 2026-11-08 (Tid & vardagsrutiner har bilder)

- **Gjort:**
  - Bilder till hela *Tid & vardagsrutiner* (401–442): 628 av 630 modulord. *så fort* och *veckovis* har ingen bild.
  - Alla symbol- och adjektivbilder är blindtestade.
  - Motiven finns i `time.ts` (`tid.`), `routine.ts` (`rut.`), `planning.ts` (`plan.`), `actions.ts` (`akt.`), `measure.ts` (`mått.`) och `mishaps.ts` (`vard.`).
- **Nästa steg (0.21):** överämnena i 500-, 600-, 800- och 900-serierna, ungefär 630 ord vardera.
- **Kom ihåg:**
  - Arbetsgången per omgång om cirka 7 moduler:
    1. Rita motiven.
    2. Granska dem i ark med `scratchpad/fsheet.ts`.
    3. Registrera med `specgen.py` och `vis.py`.
    4. Kör `npm run art:blind -- <mapp> pending`.
    5. Låt nya granskare svara utan facit.
    6. Kör `npm run art:blind:record`.
    7. Rätta och lägg till `confusableWith` för äkta synonymer.
  - Kolla sense-ID:t i `mdefs.py`-utskriften innan du anger ett specialfall till `specgen` (t.ex. `s.tjänst-favor.1`, inte `s.tjänst.1`).
  - `P({ mood })` i `blindFix.ts` ger figurer med ansiktsuttryck, `head()` i `routine.ts` ett ansikte i närbild och `bed()` en säng.

## 0.19.1 – släppt 2026-11-08 (blindtest och styrsystem för bilder)

- **Gjort:**
  - Alla 517 symbol- och adjektivbilder blindtestades. 159 ritades om, och 4 ord utan tydlig scen fick ingen bild.
  - Nu har 448 bilder godkänt blindtest och 65 är godkända synonymfall.
  - Ett styrsystem infördes: fältet `blindTest` med fingeravtryck, ett test som stoppar bygget och reglerna i `CONTENT_GUIDELINES.md`.
- **Arbetsgång för nya bilder (obligatorisk för symboler och adjektiv):**
  1. Rita bilden.
  2. Kör `npm run art:blind -- <mapp> pending`.
  3. Låt en ny AI-session (eller en människa) svara utan facit. Granskarinstruktionen finns i `CONTENT_GUIDELINES.md` → *Blindtest*.
  4. Kör `npm run art:blind:record -- <mapp> [godtagna-medium]`.
  5. Rita om allt som underkänns och testa igen.
- **Kom ihåg:**
  - Granska aldrig dina egna bilder med ordet bredvid.
  - Standardfiguren (`figure()`) kan inte visa passform eller frisyr. Använd `dressed()`/`fitPair()` (`fitFigures.ts`) eller en närbild.
  - `P({ mood })` i `blindFix.ts` ger figurer med ansiktsuttryck.
- **Nästa steg (0.20):** överämnena i 400-, 500-, 600-, 800- och 900-serierna, med blindtest som grind.

## 0.19 – släppt 2026-11-07 (Kläder & stil klart, grundmodulerna 1–8)

- **Gjort:**
  - *Kläder & stil* 315–342 (421 bilder) och grundmodulerna 1–8 (128 bilder), sammanlagt 549.
  - Motiven finns i `textiles.ts` (`tyg.`), `fit.ts` (`pass.`), `laundry.ts` (`tvätt.`), `beauty.ts` (`skön.`) och `basics.ts` (`bas.`).
  - I hela appen har 3 049 av 6 182 modulord en bild.
- **Nästa steg (0.20):** överämnena i 400-, 500-, 600-, 800- och 900-serierna (cirka 630 ord vardera saknar bild).
- **Kom ihåg:**
  - `scratchpad/specgen.py FIL PREFIX UT.json 'grupp;…' 'ejquiz,…'` gör bildspecifikationen. Symbolstatus hämtas från visualPlan.
  - Två granskningsark:
    - `scratchpad/msheet.ts FIL EXPORT ut.html från antal` visar en motivfil i 190 px.
    - `scratchpad/one.sh FIL EXPORT '.nyckel,…'` visar enskilda motiv.
  - Motivhjälpare som används i motivobjektet måste deklareras *före* `export const …_MOTIFS`. Annars blir det ett ReferenceError vid laddning.

## 0.18.1 – släppt 2026-11-07 (symbolbilder och text i bilder)

- **Återkoppling:**
  - *Högtidlig* såg inte högtidlig ut.
  - Abstrakta ord får visas som en symbol tillsammans med det japanska ordet.
  - Liknande bilder skulle också granskas.
- **Gjort:**
  - Alla symbolbilder, adjektiv och bilder som inte används i bildövningar är granskade. Svaga och felaktiga bilder är omritade (se CHANGELOG).
  - 50 bilder med ordets text är rättade. Testet *no picture spells out its own word* skyddar mot nya.
- **Kom ihåg:**
  - Principerna för symbolbilder står i CONTENT_GUIDELINES → *Bilder på orden*.
  - `scratchpad/symsheet.ts` ritar granskningsark med svenskt ord och japansk glosa. Lägen: `symbol`, `adj`, `noquiz` eller en kommaseparerad lista med senseId.
  - `scratchpad/textcheck.ts` listar all text i bilderna.

## 0.18 – släppt 2026-11-07 (Vardag & hem klart till 242, skor och accessoarer)

- **Önskemål från produktägaren:** minst 500 nya bilder, utan slarv med detaljerna.
- **Gjort:**
  - *Vardag & hem* 215–242 (411 bilder) och *Kläder & stil* 308–314 (105 bilder), sammanlagt 516 nya bilder.
  - Motiven finns i `homeKitchen.ts` (`khem.`), `bathroom.ts` (`bad.`), `cleaning.ts` (`städ.`), `housingAdmin.ts` (`bost.`) och `accessories.ts` (`acc.`).
  - I hela appen har 2 496 av 6 182 modulord en bild.
- **Nästa steg (0.19):**
  - *Kläder & stil* 315–342: material, mönster, storlekar, att prova kläder, tvätt och klädvård, hår och hudvård.
  - Därefter 0-modulerna (cirka 129 ord) och överämnena i 400-, 500-, 600-, 800- och 900-serierna.
  - Nytt område: resten av *Relationer & familj*.
- **Kom ihåg:**
  - Granska varje bild i förstoring, med `XXbig.ts` (300 px) eller `XXmid.ts` (200 px).
  - Vanliga fel att leta efter:
    - figurens extra arm som börjar mitt på kroppen; armar ska utgå från axeln;
    - pratbubblor över huvudet;
    - motiv som skärs av vid bildkanten;
    - skyltar som avslöjar svaret.
  - Klackskor ritas med `heelBody(H)` i `accessories.ts`, så att tåkappan får höjd.

## 0.17 – släppt 2026-11-07 (Mat & dryck klart, bostad och möbler)

- **Gjort:**
  - *Vardag & hem* 132–139 och 201–214 har bilder för alla modulord (323 nya). Hela Mat & dryck (101–139) är klart.
  - Motiven finns i `dining.ts` (`bord.`), `housing.ts` (`hus.`) och `furniture.ts` (`möb.`).
  - I hela appen har 1 973 av 6 182 modulord en bild.
- **Nästa steg (0.18):**
  - *Vardag & hem* 215–242: kök och badrum, städning, reparationer, hyra och bostadsrätt, grannar, felanmälan.
  - Därefter övriga områden i Vardag & hem och de andra överämnena.
  - Nytt område: resten av *Relationer & familj*.
- **Kom ihåg:**
  - `scratchpad/parens.py FIL` tar bort överflödiga avslutande parenteser i motivrader. De uppstår lätt när utfyllnad rensas bort med ersättningar.
  - Ord med betydelsenummer 2 (till exempel `s.släcka.2`) får egna motiv-id som `möb.släcka-lampa`, och läggs till i specifikationen för hand efter `mkspec.py`.

## 0.16 – släppt 2026-11-07 (bild → ord med japanska, Vardag & hem 114–131)

- **Återkoppling från produktägaren:** 0.15 är godkänd. Önskemålen var bilder i de tidigare modulerna, och att det japanska ordet visas i bildövningarna, med animationen spelad en gång.
- **Gjort:**
  - I *Vilket ord passar till bilden?* står den japanska översättningen under bilden. Animationen eller ansiktet spelas en gång och går sedan tillbaka till affischbilden (`pictureMode()`, ADR 41).
  - *Vardag & hem* 114–131 har bilder för alla modulord (250 nya). Motiven finns i `kitchen.ts` (`kök.`) och `meals.ts` (`mål.`).
  - I hela appen har 1 644 av 6 182 modulord en bild.
- **Nästa steg (0.17):**
  - Fortsätta fylla på bilder: *Vardag & hem* 132–139 (matbordets samtal, husmansrätter, japansk mat, världens mat, specialkost, näringsämnen, matsvinn, högtidsmat) och sedan 201–242 (bostad och hem).
  - Sedan de andra överämnena som saknar bilder (Hälsa & sjukvård, Känslor & psykologi …). Ansiktsord görs med ansiktsriggen.
  - Nytt område: resten av *Relationer & familj* (Föräldraskap & barn, Högtider & familjehändelser, Relationella uttryck).
- **Kom ihåg:** `scratchpad/missing.py LO HI` listar ord utan bild för moduler med `recommendedOrder` mellan LO och HI. `mkspec.py` gör bildspecifikationen, och det som står efter det fjärde kolonet i en rad betyder symbol (alltid `quiz: false`).

## 0.15 – släppt 2026-11-07 (Vänskap och Kärlek & partnerskap klara, Vardag & hem 108–113, tydligare japanska)

- **Gränssnitt:**
  - Japansk text om ordet är stor och mörk med tydlig furigana (`ja-word`, `ja-gloss`, ADR 40).
  - Instruktioner är små och grå.
  - Nya komponenter ska följa regeln i CONTENT_GUIDELINES *Japansk text i gränssnittet*.
- **Spår 1, nytt område:**
  - *Relationer & familj*: 1014–1017 (resten av *Vänskap*) och 1021–1027 (hela *Kärlek & partnerskap*), med bilder för alla ord.
  - Motiven finns i `friends.ts` (`vän.`) och `love.ts` (`kär.`), och de gemensamma hjälparna i `people.ts`.
- **Spår 2, påfyllning:**
  - *Vardag & hem* 108–113 har nu bilder för alla modulord. Motiven finns i `groceries.ts` (`livs.`).
  - I hela appen har 1 290 av 6 182 modulord en bild.
- **Rättat:** generatorn kunde visa två likadana svarsalternativ när två ord har samma form (*mod*/*mode* → *modet*).
- **Nästa steg (0.16):**
  - *Föräldraskap & barn* (SWC-MAN-04-04-01…), *Högtider & familjehändelser* och *Relationella uttryck* för att avsluta *Relationer & familj*.
  - Påfyllning av *Vardag & hem* 114–… (steka och bryna, grädda och baka, vispa och röra …).
  - Fortsatt UI-arbete efter produktägarens stickprov.
- **Kom ihåg:**
  - När 1031 *Graviditet och födsel* publiceras måste e2e-testets exempel på en planerad modul bytas igen (`scripts/e2e-smoke.mjs`).
  - Hjälpskript i scratchpad: `gen5/check.sh`, `gen5/commit.sh`, `vis.py`, `mkspec.py` (bildspecifikation på en rad per ord), `prune.py` (tar bort oanvända importer i motivfiler) och kontaktarken `frsheet.ts`, `lovesheet.ts` och `grsheet.ts`.

## 0.14 – släppt 2026-11-07 (Relationer & familj börjar + Vardag & hem fylls på)

- **Spår 1, nytt område:**
  - *Relationer & familj*: 1001–1007 (hela *Familjemedlemmar*) och 1011–1013 (*Vänskap*), med bilder för alla ord.
  - Motiven finns i `family.ts`, `celebrations.ts` och `friends.ts`, och scenerna i `scripts/scenes/familj.scenes.ts`.
- **Spår 2, påfyllning:**
  - *Vardag & hem* 101–107 (maten) har nu bilder för alla modulord. Motiven finns i `food.ts`.
  - I hela appen har 1 086 av 5 935 modulord en bild.
- **Nästa steg (0.15):**
  - *Vänskap* 1014–1017: Hjälpa och stötta, Förtroende och lojalitet, Missförstånd mellan vänner, Vänskap över avstånd.
  - *Kärlek & partnerskap* 1021–1027.
  - Påfyllning av *Vardag & hem* 108–… (fågel och ägg, fisk och skaldjur …).
- **Arbetsflöde per modul:**
  1. Kör skriptet i scratchpad gen5 (`rNNNN_*.py`) och `check.sh`.
  2. Kör `npm run visuals:plan`.
  3. Rita motiven och registrera dem med vis.py (illustration, `by: manual`).
  4. Lägg animationer i `scripts/scenes/*.scenes.ts` och kör `npm run scenes:build -- --out dist/scenes && npm run visuals:import dist/scenes`.
- **Kom ihåg:**
  - Ansiktsord görs med ansiktsriggen (CONTENT_GUIDELINES *Ansiktsuttryck*).
  - Ett nytt område får ett nytt motivprefix och en ny rad i `GROUPS` i `render.ts`.

## 0.13.1 – släppt 2026-11-06 (ansiktsuttryck med egen rigg)

- **Återkoppling från produktägaren:** 0.13 är godkänd, utom ansiktsuttrycken. Ansiktsord är svåra och kräver extra uppmärksamhet, både nu och i framtiden.
- **Gjort:**
  - Ansiktsriggen finns i `src/ui/face/rig.ts` (ADR 38).
  - 47 ansiktsord är gjorda om, med scenerna i `scripts/faces/kropp.faces.ts`.
  - Reglerna finns i `CONTENT_GUIDELINES.md` under *Ansiktsuttryck*.
- **Arbetsflöde:**
  1. `npm run faces:build -- --strips /tmp/remsor.html`.
  2. Granska remsorna i full storlek.
  3. Kör `npm test`.
- **Nästa gång ansiktsord kommer:**
  - När *Känslor & psykologi* fylls på med bilder ska alla känslo- och minord göras med riggen.
  - Saknas en signal ska den läggas till i riggen.

## 0.13 – släppt 2026-11-06 (pilot: Kroppen & sinnena helt visualiserat)

- **Läge:** alla 631 modulord i *Kroppen & sinnena* har en bild (374 illustrationer, 257 animationer). I hela appen har 797 av 5 758 modulord en visualisering.
- **Hur det gjordes (ADR 37):**
  - Kroppsdelar, organ, diagram, hjälpmedel och symboler är kodillustrationer i `src/ui/wordArt/`. Kitet består av `body`, `limbs`, `anatomy`, `organs`, `senses`, `figures` och `medical`, och motiven ligger i `bodyMotifs.ts`.
  - Verb och tillstånd är scendata i `scripts/scenes/kropp.scenes.ts` (verb) och `kropp2.scenes.ts` (tillstånd).
  - Arbetsflödet är `npm run scenes:build -- --out dist/scenes --strips /tmp/remsor.html`. Titta på remsorna och kör sedan `npm run visuals:import dist/scenes`.
  - Planraderna för pilotens ord har `by: manual`.
- **Erfarenheter (mätt i piloten):**
  - Ett gemensamt kit per vy gör att ett nytt kroppsord oftast kostar en rad.
  - Scener som data går snabbt för poser, miner och gester, men rigg och perspektiv sätter gränser. I framvy böjs armbågen bara framåt, så båda händerna kan inte nå öronen. Huvudet kan inte vridas, och blicken kan inte gå uppåt. Sådana ord fick en kompromiss eller en stillbild.
  - Granskning med bildremsor i 4 rutor per scen räckte för att hitta felaktiga poser.
- **Inte gjort:**
  - Produktägarens stickprov återstår, och alla bilder är `ai-draft`.
  - Inget blindtest i Animation_tool- är gjort för de nya scenerna.
- **Animation_tool-:**
  - Det går fortfarande inte att pusha dit från den här sessionen.
  - Scenerna i `scripts/scenes` kan flyttas dit oförändrade.
  - Den lokala grenen `claude/swechan-ga-och-springa` finns bara i containern.
- **Nästa steg (0.14):**
  - Två spår: *Relationer & familj* (första modul *Föräldrar och barn*, förkunskap `m.att-uppmuntra-andra`, order 1001) med bilder från början, och påfyllning av *Vardag & hem*.
  - Dela `render`-delen per överämne innan nästa områdes motiv läggs till.

## 0.12 – släppt 2026-11-06 (animationer: grunden)

- **Beslut (produktägaren):** varje ordpost ska få en visualisering som används i introduktion och övningar. Stoppet för bilder/animationer är hävt; AI-utkast får visas. Claude godkänner mallarna i Animation_tool-; produktägaren stickprovar i piloten.
- **Plan (godkänd av produktägaren):** 0.12 grunden → 0.13 pilot *Kroppen & sinnena* helt visualiserat (~630 poster) → från 0.14 två spår per release: ett nytt överämne som är "klart" först när varje modulord har visualisering, plus ett befintligt överämne som fylls på (Vardag & hem först, sedan kedjans ordning).
- **Arbetsflöde för bilder:** producera/ändra scener i Animation_tool- (`npm run anim:batch`, `anim:validate`, blindtest) → `npm run anim:export` där → i Swechan `npm run visuals:import <sökväg>/dist/swechan` → `npm test`. Nya ord: `npm run visuals:plan` (validatorn stoppar annars). Ändra aldrig `senseId`; `animationId` med å/ä/ö får ASCII-säkert filnamn automatiskt.
- **Läge:** 84 animationer importerade; 180 av 5 758 modulord har visualisering (inklusive de gamla kodillustrationerna). Plan: animation 1 145, scen 3 036, symbol 1 617, ingen 1 (AI-utkast).
- **Animation_tool-:** sessionen kan inte pusha dit. Grenen `claude/swechan-ga-och-springa` (14 scener + gångsätt) finns bara lokalt i den här containern och som bundle i scratchpad – scenerna själva är dock bevarade i Swechan (`public/anim/scenes/`, rå scen = källan). Nästa session bör ha båda repona med pushbehörighet.
- **Nästa steg (0.13):** pilot *Kroppen & sinnena*: gå igenom planen modul för modul (rätta `by: manual`), producera scener med recept/batch i Animation_tool-, blindtesta ett stickprov per ämnesgrupp, importera, mät tid per modul.
- **Kända begränsningar:** spelarpaketet är 52 kB gzip (målet var 15 kB; föremålsbiblioteket står för det mesta). Heuristiken klassar många konkreta adjektiv (*rostig*, *vissen*) som symbol – justeras i produktionen.

## 0.11 – släppt 2026-11-06 (Känslor & psykologi)

- **Innehåll:** *Människan & hälsa → Känslor & psykologi* (R02-A03) är helt publicerat: 42 moduler med `recommendedOrder` 901–957. Den första modulen har *Riskfaktorer och hälsoval* som förkunskap. Totalt finns **383 publicerade moduler**.
- **Nästa överämne:** *Människan & hälsa → Relationer & familj* (R02-A04). Dess första modul, *Föräldrar och barn* (SWC-MAN-04-01-01), ska ha *Att uppmuntra andra* (`m.att-uppmuntra-andra`) som förkunskap och ordning 1001.
- **Ord som redan finns och ska återanvändas i Relationer & familj:** *kär*, *pojkvän*, *flörta*, *trogen*, *otrogen*, *svartsjuk(a)* (Avund och svartsjuka), *kram* och *omtanke* (Lättnad och trygghet), *bry sig om*, *empati* (Empatisk och självisk), *umgås*, *småprata* (Utåtriktad och reserverad), *klasskamrat*, *återträff* (Längtan och nostalgi), *begravning*, *beklaga sorgen*, *ta farväl* (Sorg och saknad), *gratulera*, *uppmuntra*, *komplimang* (Att uppmuntra andra). Grundordförrådet har *kusin*, *systerdotter*, *släkt*, *make*, *partner*, *storebror* m.fl.
- **Homografer:** `e.saknad-känsla` är en egen post med nyckel; `s.skyldig.2` är en ny betydelse på befintlig post.
- **Kontrolltips:** ord inne i ett målfrasverb måste vara kända (t.ex. *kvalet* i *stå i valet och kvalet*, *tvivla* i *tvivla på sig själv*) – lägg annars ordet i grundordförrådet. Första och andra personens reflexiv (*ändra mig*, *jämföra mig med*, *lära mig den hårda vägen*) känns inte igen som målform; skriv berättarform med *sig*. Böjda substantivfraser som *starka sidor* fungerar via `fixn`.
- **E2E:** den planerade katalogposten är nu *Människan & hälsa → Relationer & familj → Familjemedlemmar → Föräldrar och barn*.
- **Bilder:** fortfarande inga nya bilder eller animationer.

## 0.10 – släppt 2026-11-06 (Hälsa & sjukvård)

- **Innehåll:** *Människan & hälsa → Hälsa & sjukvård* (R02-A02) är helt publicerat: 42 moduler med `recommendedOrder` 801–857. Den första modulen har *Beskriva smärta och obehag* som förkunskap. Totalt finns **341 publicerade moduler**.
- **Nästa överämne:** *Människan & hälsa → Känslor & psykologi* (R02-A03). Dess första modul, *Glädje och lycka* (SWC-MAN-03-01-01), ska ha *Riskfaktorer och hälsoval* (`m.riskfaktorer-och-halsoval`) som förkunskap och ordning 901.
- **Ord som redan finns och ska återanvändas i Känslor & psykologi:** *stress*/*stressad* (grundordförråd), *stresshantering*, *utbränd*, *gå in i väggen*, *avslappning*, *mindfulness*, *egentid* och *pressad* i *Stresshantering*; *återhämtning* (Senor och fästen) och *återhämta sig* (Motion och återhämtning). Sök i `src/content/data/dictionary` innan nya ord skapas. Undvik att dubblera *Stress & återhämtning* (R02-A03-T05) med orden ovan – välj psykologiska nyanser i stället.
- **Homografer:** `e.hosta-noun`, `e.blåsa-hud` och `e.var-sår` är egna poster med nyckel.
- **Kontrolltips:** negation inne i ett partikelverb ("Lägg inte på") och inverterad ordföljd ("gick en kollega in i väggen") gör att målordet inte hittas – skriv "inte lägga på" och "en kollega som gick in i väggen". Partikelverb med efterföljande preposition (*dra ner på*) får inte `particle=`, eftersom formen måste sluta på partikeln. Siffror (112, 1177) ignoreras av kontrollen och kan inte vara målord.
- **E2E:** den planerade katalogposten är nu *Människan & hälsa → Känslor & psykologi → Grundkänslor → Glädje och lycka*.
- **Bilder:** fortfarande inga nya bilder eller animationer.

## 0.9 – släppt 2026-11-06 (Kroppen & sinnena)

- **Innehåll:** *Människan & hälsa → Kroppen & sinnena* (R02-A01) är helt publicerat: 42 moduler med `recommendedOrder` 701–757. Den första modulen har *In- och utcheckning* som förkunskap. Totalt finns **299 publicerade moduler**.
- **Nästa överämne:** *Människan & hälsa → Hälsa & sjukvård* (R02-A02). Dess första modul, *Feber och frossa* (SWC-MAN-02-01-01), ska ha *Beskriva smärta och obehag* (`m.beskriva-smarta-och-obehag`) som förkunskap och ordning 801.
- **Ord som sparats till Hälsa & sjukvård:** *feber*, *frossa*, *huvudvärk*, *yrsel*, *halsont*, *klåda*, *utslag*, *läkemedel*, *biverkning* och *vårdcentral* (*recept* och *tablett* finns redan i grundordförrådet). *Vaccin*, *vaccinera*, *antibiotika* och *smitta* finns redan i *Kroppens immunförsvar*, så återanvänd dem i stället för att skapa dubbletter. Det gäller också *smärta*, *värk*, *öm* och *göra ont* i *Beskriva smärta och obehag*.
- **Ord som lagts till i grundordförrådet:** bland annat *cell*, *hjärna*, *organ*, *syre*, *puls*, *hormon*, *virus*, *bakterie*, *infektion*, *inflammation*, *förkylning*, *influensa*, *patient*, *vård*, *sköterska*, *behandling*, *operation*, *blödning*, *sår*, *rörelse*, *övning*, *stress*, *teater*, *rep*, *orm*, *myra* och *dum*, samt namnen *Max* och *Emil*. Se CHANGELOG.
- **Homografer:** `s.mager.2`, `s.kraftig.2`, `s.lins.2` och `s.smälta.2` är nya betydelser på befintliga poster. `e.vad-kropp`, `e.led-kropp`, `e.gift-ämne`, `e.ta-upp-kropp`, `e.sträcka-verb` och `e.min-ansikte` är egna poster med nyckel.
- **Kontrolltips:** en multiword-post som börjar med ett verb efter *sedan*/*nu*/*där* blir lätt inverterad ("Sedan ställer han ner") och hittas då inte. Skriv subjektet först. Sammansättningar med fogesuffix (*fotbollsmatch*) känns inte alltid igen.
- **E2E:** den planerade katalogposten är nu *Människan & hälsa → Hälsa & sjukvård → Symtom & besvär → Feber och frossa*.
- **Bilder:** fortfarande inga nya bilder eller animationer.

## 0.8 – släppt 2026-11-06 (förklaringar för svåra ord + Resor & lokaltrafik)

- **Krav (produktägaren):** ord som en genomsnittlig elev i årskurs 9 skulle ha svårt för **ska förklaras ytterligare**, inte bara översättas. Ett modulord på B2 eller högre måste ha `sense.explanation {sv, ja}`, med 2–3 meningar om praktisk betydelse, användning, vanliga kombinationer och svensk kulturbakgrund. Validatorn stoppar modulord på B2+ som saknar förklaring. Sätt B2 på ord som är svåra för en niondeklassare, även om de är vanliga (143 B1-ord omklassades). Alla publicerade svåra betydelser har förklaringar (791 totalt).
- **Flerordsuttryck** (*komma ihåg*, *gå vilse*, *ta sig till*) är egna poster och målord. Tänk på det i varje modul. Kontrollen hittar målord bara som sammanhängande text: inverterad ordföljd ("svänger ni in") och andra personens reflexiv ("spänner du fast dig") känns inte igen. För partikelverb/reflexiva verb i lästexten: skriv dem i infinitiv eller rak ordföljd.
- **Innehåll:** *Resor & lokaltrafik* är helt publicerat (42 moduler, `recommendedOrder` 601–657). Därmed är **hela rotområdet *Vardag & hem* publicerat** (257 moduler totalt). Nästa överämne blir det första i ett annat rotområde, t.ex. *Människan & hälsa → Kroppen & sinnena* (R02-A01). Första modulen där ska ha *In- och utcheckning* (`m.in-och-utcheckning`) som förkunskap. Lägg ordningen i en ny serie (t.ex. 701).
- **Homografer:** samma ordklass → ny betydelse på befintlig post (`s.spår.2`). Den valideras också mot ordförrådet i modulen som äger ordboksfilen. Annan ordklass → egen post med nyckel (`e.halka-noun`, `e.pumpa-verb`).
- **Prestanda:** repetitionsurvalet beräknar varje kort en gång (ADR 33); `makeAllCardsDue` använder `clear()` + `bulkAdd()`. Testsviten har nu 412 tester.
- **E2E:** den planerade katalogposten är nu *Människan & hälsa → Kroppen & sinnena → Kroppens yttre delar → Huvud och ansikte*.
- **Push-tips:** om GitHub svarar "fatal error in commit_refs_rules" även på den kanoniska adressen, ge commiten en ny hash (`git commit --amend --no-edit`) och pusha igen. Felet var tillfälligt och knutet till en viss commit.
- **Bilder:** fortfarande inga nya bilder eller animationer (produktägarens beslut från 0.7 gäller).

## 0.7 – släppt 2026-11-05 (105 nya moduler, inga nya bilder)

- **Innehåll:** 105 nya moduler. *Kläder & personlig stil*, *Tid & vardagsrutiner* och *Handel & vardagstjänster* är nu helt publicerade. Totalt finns **215 publicerade moduler**. Alla ord är AI-utkast (`ai-draft`).
- **Beslut (produktägaren):** bilderna i 0.6 fungerade inte som tänkt. Produktägaren tar fram en instruktion (med Claude Fable) för ett program som skapar animationer. **Lägg inte till eller ändra ord- eller modulbilder** förrän den instruktionen finns. Piloten från 0.6 ligger kvar oförändrad.
- **Kedjor:** `recommendedOrder` 4xx tid (401–442), 5xx handel (501–542). Nästa område är *Resor & lokaltrafik* (R01-A06). Dess första modul, *Buss och hållplats* (SWC-VAR-06-01-01), ska ha *Klaga och begära ersättning* (`m.klaga-och-begara-ersattning`) som förkunskap och ordning 601.
- **Ord som sparats till senare överämnen:** biljett, hållplats, tunnelbana, station, trafik, parkering, körkort, pass (resor); lön, lån, ränta, försäkring, folkbokföring, polisanmälan (samhälle); sömn, stress, kroppsdelar, midja, känslor som besviken/nyfiken (människan); recept, läkemedel, feber (hälsa); logga in, lösenord (datorer). Kontrollera katalogtitlarna innan ett ord görs till målord.
- **Rättat:** repetitionen kunde fastna på kort vars betydelse tagits bort (nu `liveCards()`). Den felstavade dubbletten `s.nopprig.1` togs bort (`s.noppig.1` används). Distraktorer med samma glosa väljs inte längre samtidigt.
- **E2E:** den planerade katalogposten i e2e-skriptet är nu *Resor & lokaltrafik → Kollektivtrafik → Buss och hållplats*; byt till en annan planerad post när den publiceras.
- **Push-tips:** remoten är `github.com/Deashi03/swechan` (gemener). Om GitHub svarar "fatal error in commit_refs_rules", pusha till den kanoniska adressen: `git push https://github.com/Deashi03/Swechan.git HEAD:<gren>`.

## 0.6 – släppt 2026-11-05 (pilot: bilder på orden)

- **Pilot:** alla ord i *Vardagskläder* har bild, plus fotona *bryna*, *mocka*, *manchester*. Produktägaren utvärderar piloten innan resten görs.
- **Beslut (produktägaren):** en bild per ord; bilden i introduktionen och i vissa övningar; bildfrågor där alternativen inte går att blanda ihop. Abstrakta ord får symbol om en lämplig, kulturellt överförbar scen finns, annars ingen bild. **Claude ansvarar för hela bildflödet** – produktägaren ska inte generera bilder.
- **Stilval:** illustrationer som kod (bilderbok, `src/ui/wordArt/`) för form; fritt licensierade foton för yta/tillstånd. Foton hämtas via Openverse (`api.openverse.org`, tillåten i miljön); Wikimedias API ger ofta 429 från molnmiljön och Flickrs bildserver är inte tillåten, så Openverse-förhandsbilder (≤ 600 px) används. Licens CC0/PDM/CC BY, aldrig BY-SA/NC.
- **Ny bild för ett ord (före 0.12):** motiv i `src/ui/wordArt/motifs.ts` + rad i `src/content/data/images/wordVisuals.json` (från 0.12 görs nya bilder som scener i Animation_tool-, se 0.12-avsnittet) med `group`, `quiz` och `confusableWith`. Granska med `npm run art:words`. `images.test.ts` kontrollerar distraktorreglerna.
- **Nästa steg efter godkänd pilot:** övriga klädmoduler, sedan Hem & boende och Mat & måltider (där behövs fler foton: tillagning, råvaror, konsistenser).

## 0.5 – släppt 2026-11-05

- **Rättat:** svaret syntes i frågan (omvända val/stavning) – `maskAnswer()` + valideringsregel; äldre moduler låg i fel överkategori – nu i ämnesgrupper, och validatorn kräver det.
- **Bilder, stil "Platt"** (användarens val av fem varianter): `src/ui/art/`. (Från 0.7 får moduler sakna bild; se 0.7 ovan.) Granska med `npm run art:sheet`.
- **102 nya moduler**: Mat & måltider (39) och Hem & boende (42) är helt publicerade; Kläder & personlig stil har Vardagskläder, Skor & accessoarer och Textilier & material klara (21). Totalt 110 publicerade moduler. Alla ord är AI-utkast (`ai-draft`), ingen mänsklig granskning.
- **Kedjor:** en linjär förkunskapskedja per område (`recommendedOrder` 1xx mat, 2xx hem, 3xx kläder). Klädkedjan börjar efter *Flyttdag och adressändring*; nästa klädmodul (*Klädstorlekar och mått*, SWC-VAR-03-04-01) ska ha *Att känna igen kvalitet* som förkunskap och ordning 322.
- **Kvar i Kläder & personlig stil:** Storlek & passform, Tvätt & klädvård, Skönhet & grooming (21 planerade). Ord som medvetet sparats till dem: storlek/mått/midja, löst/tajt, prova, söm, dragkedjans detaljer, krympa, skrynklig, stryka, fläck, nål, frisyr, smink, rakning m.m.
- **Ord som hör till senare överämnen** har hållits utanför (budget, lån, ränta, försäkring, folkbokföring, konflikt, glasögon, väva/sticka, mikroplast, abonnemang …). Kontrollera katalogtitlarna innan ett ord görs till målord.
- Testsviten: 248 tester, ~25 s. `module:validate` och distraktorvalet är optimerade (se CHANGELOG).

## 0.4 – släppt 2026-11-04

Följ `SWECHAN_0_4_CLAUDE_HANDOFF.md`. Katalogen: `planning/catalog/swechan-catalog.v1.json` (344 kategorier, 2 016 **planerade** moduler).
- **Fas A klar** (gren `claude/swechan-0.4-phase-a`): baslinje grön; två buggar i versionsnollställningen rättade (se CHANGELOG); granskningstester.
- **Fas B klar** (gren `claude/swechan-0.4-phase-b`, bygger på fas A): katalogindex från den riktiga katalogfilen, validator, kompatibilitetsplaceringar för de fem modulerna, spärrar mot att starta planerade moduler. Ännu inget UI som använder katalogen (det är fas C: Utforska/Kurser med högst åtta val per skärm).
- **Fas C klar** (gren `claude/swechan-0.4-phase-c`, bygger på fas B): Kurser och sökning på den riktiga katalogen, högst åtta val per skärm, planerade moduler har informationsvy utan Starta-knapp. Komponenttester i `src/ui/screens/Explore.test.tsx`.
- **Fas E klar** (gren `claude/swechan-0.4-phase-e`): CLI-verktyg `catalog:validate`, `module:new`, `module:validate`, `content:report` (se README/CONTENT_GUIDELINES).
- **Fas D klar** (gren `claude/swechan-0.4-phase-d`): modulindex + `loadModuleBody`, läs/samtal laddar lat, förladdning för offline, uppmätt bundle/laddtid (se CHANGELOG). **Kom ihåg `npm run content:index` efter ändring i en modulfil.**
- **Fas F klar** (gren `claude/swechan-0.4-phase-f`, bygger på fas E): tre nya moduler i en kedja – *Vanliga grönsaker* → *Skära och hacka* → *Koka och sjuda* – med verifierade 1:1-kopplingar till sina katalogposter; ny ordboksfil `food.json` (47 ord, AI-utkast). E2E går igenom kedjan via Kurser-menyn.
- **Fas G klar**: version 0.4.0, migreringstest 0.3.1→0.4 med nollställningen på och av, e2e-jobb i CI, dokumentation. WebKit/fysisk iPhone: EJ TESTAT.
- **Beslut (produktägaren, 2026-11-04): nollställningen ska vara PÅ även vid 0.4-releasen**, eftersom appen fortfarande är under systemutveckling och funktioner ska kunna testas från noll. Att höja `APP_VERSION` till 0.4.0 nollställer alltså all progression (återställningspunkt sparas och kan ångras). Ändra inte `devConfig.resetProgressOnUpdate` utan nytt beslut från produktägaren.

## ⚠️ Utvecklingsläge är PÅ (0.3.1–0.12.0)

`devConfig.resetProgressOnUpdate = true`: **varje ny APP_VERSION nollställer all användarprogression** (produktägarens uttryckliga önskemål under utvecklingen; en återställningspunkt sparas). Detta går emot regel 1 "Bevara användardata" och **måste stängas av (`false`) innan appen används på riktigt**. `devConfig.toolsEnabled` visar utvecklarverktygen (Inställningar + ⏭ i inlärningen). Öka alltid `APP_VERSION` vid en release – det är versionsbytet som utlöser nollställningen.

## Nytt i 0.3.1
- Moduler 15–20 ord (schema + alla moduler nedkortade till 20).
- Inlärningen visar "Del X av Y" i stället för totalen (`batchProgress` i `learnPlan.ts`).
- Versionsnummer på startsidan och välkomstsidan.
- Utvecklarverktyg (`src/dev/devTools.ts`, `src/ui/screens/DevTools.tsx`): tidsresa via klockförskjutning (`lib/clock.ts`), upplåsning av steg, genvägar för repetition, nollställning.

## Nytt i 0.3

- **Designen "Fjord"** (användarens val efter tre omgångar skisser; skisserna togs fram utanför repot). Tokens i `src/ui/styles/tokens.css`, typsnitt Manrope i `public/fonts/` (OFL). Startsida `src/ui/screens/Home.tsx`, övningar `src/ui/exercises/ExerciseView.tsx` (resultatpanel längst ner, inget auto-avancemang).
- **Jonathan** (`src/ui/components/Jonathan.tsx`): platshållare (monogram) med stämningar och händelsereaktioner. Den riktiga avataren ersätter bara komponentens innehåll.
- **Dagens svenska ord** (`src/daily/wordOfTheDay.ts`): deterministiskt per datum.
- **Pedagogiska rättningar**: kontextövningar med distraktorer från annat ämne, samma form och genus, och översättningen dold tills ledtråd/svar; böjningsövningar med naturliga meningsramar utan grammatiktermer (`inflectionFramesFor`, valfritt `frame` på betydelser); testade i `learning.test.ts`.
- Användarens önskemål om designen: proffsig läroplattform, avslappnad, lätt svenskt tema (inte för tematiskt), lite plats för gullighet. Övningsvyer i stil med ordkort + kontextmening + knappar med djup uppskattades.

## Nytt i 0.2 (efter användartest på iPhone)

Användarens feedback på 0.1: (1) förklaringar använde svårare ord än ordet som lärdes in, (2) flera betydelser (t.ex. *ämne*) visades otydligt och ofullständigt, (3) frågor använde ord som eleven inte gått igenom. Åtgärder:

- **Kontrollerat ordförråd** (`src/content/vocabularyCheck.ts`, `data/core/coreVocabulary.json`): ett test underkänner varje förklaring, exempel, lästext eller fråga som använder ord utanför grundordförrådet + förkunskapsmoduler + tidigare ord i modulen. 196 problemtexter i 0.1 → 0.
- **Inlärningskedjor**: nya grundmoduler *Material och ämnen* → *Atomer och molekyler*, *Krig och försvar* → *Medeltida borgar*. *Dagens modul* respekterar kedjan.
- **Betydelser**: `labelSv` per betydelse; sektionen "”ämne” har 5 betydelser" i ordintroduktionen; översikt i ordboken.
- **Uppslagbara ord** i förklaringar, exempel och läsfrågor (`SvText`).
- **Buggfix**: "Hoppa över" på välkomstsidan fungerade inte.

## Färdigbyggt (fungerar)

- **Startsida** med "Dagens Swechan": A. Repetition (x/25, progress, start/fortsätt/klar) och B. Dagens modul (rekommenderad eller pågående, "Välj annan"), streak, längsta streak, freezes, veckokalender (klar/freeze/missad/idag), kort statistik, avatar med kontextuell hälsning, positiv bekräftelse när dagen är klar, notis om repetitionsskuld.
- **Daglig session**: plan fryses vid dagens start; inga tidigare ord → repetition klar automatiskt; färre än 25 ord → sessionen använder det som finns; dagens nya ord ingår inte; dagen klar när båda delar är klara (valfri ordning).
- **Streak**: regler i `config/appConfig.ts` (1 freeze vid start, max 2, +1 per 7 klara dagar), automatisk freeze-förbrukning, flera missade dagar, idempotens, studiedatum i lokal tidszon, sommartidssäkert.
- **Moduler** i tre steg med paus/återupptagning efter varje svar; stegen låses upp i ordning; modul klar → orden in i repetitionen → dagens session meddelas.
  - Steg 1: introduktionskort (anpassad längd, japansk/svensk förklaring, exempel, uttalsknapp, frivillig grammatik/jämförelse) + 6 övningstyper i batchar om 5, felade uppgifter återkommer.
  - Steg 2: lästext där varje ord kan tryckas för uppslagning (bottom sheet, läsposition bevaras), målord markerade, uppläsning om svensk röst finns, 5 läsförståelsefrågor med förklaringar.
  - Steg 3: genererad ChatGPT-prompt (kopiera-knapp med fallback, öppna ChatGPT, visa prompt), manuell markering som genomförd.
- **Repetition**: FSRS via ts-fsrs, kort per betydelse × dimension (betydelse/stavning/böjning), prioritering av förfallna/svåra/låg sannolikhet, olika ord per session, varierade övningstyper, extrarepetition (10 åt gången), repetitionsskuld + rekommendation (ändrar aldrig takten själv).
- **Ordbok**: sökning på svenska uppslagsord, böjningsformer (inkl. varianter), japanska ord, kanji, kana (även katakana→hiragana), prefix/delsträng; fullständiga poster med flera betydelser, böjningstabell, exempel, kollokationer, stilnivå, synonymer per betydelse, jämförelser, japanska grammatiknoteringar, relaterade moduler, kunskapsnivå, "Spara ord", "+ Lär mig ordet".
- **Ordbok under övning**: bok-ikonen i alla sessioner + "Öppna i ordboken" i facit; övningens state och inmatning bevaras.
- **Sparade ord** och **egna ord att lära** (introduktion + övningar innan de går in i repetitionen).
- **Svåra ord** per dimension och **sammanblandade ordpar** (med jämförelse) i Repetition-vyn.
- **Kunskapsnivåer** (introducerat/förstått/aktivt behärskat/långsiktigt befäst) enligt dokumenterade kriterier; statistikvy med tidslinje.
- **Nivåtest** (15 frågor, frivilligt, kan göras om) med ärlig reservation om att det inte är en CEFR-bedömning.
- **Export/import** av versionshanterad JSON; validering; återställningspunkt + "Ångra senaste import"; begäran om skyddad lagring.
- **Inställningar**: repetitioner per dag (10–60), furigana av/på, animationer (system/minska/alla), uppläsning (röststatus, test, tempo).
- **PWA**: manifest, ikoner (inkl. apple-touch-icon), service worker (offline), safe-area-stöd, tabbar för tummen, fokusläge utan tabbar i sessioner, å/ä/ö-knappar vid skrivning (bra med japanskt tangentbord).
- **Feedback System**: händelsebuss (`answer_correct`, `answer_incorrect`, `review_completed`, `module_completed`, `daily_session_completed`, `streak_increased`, `streak_freeze_used`, `streak_freeze_earned`, `word_mastered`*) + platshållaravatar "Swe-kun" med stämningar.
- **Innehåll**: 5 moduler i två kedjor + en fristående (Hemmet 25, Material och ämnen 21, Atomer och molekyler 22, Krig och försvar 21, Medeltida borgar 23 ord), 116 ordposter / 129 betydelser (inkl. 4 fristående känsloord), 5 jämförelser, 8 grammatiknoteringar, grundordförråd ~920 ord.

\* `word_mastered` finns i händelsetypen men emitteras ännu inte (se Återstår).

## Testat (version 0.4.0)

- `npm run typecheck` OK · `npm test` **141 tester gröna** · `validate:content` 21/21 · `catalog:validate` OK · `content:index -- --check` OK · `npm run build` OK.
- `npm run e2e` **passerar** (Chromium, iPhone 13-emulering). Det täcker nu även Kurser-menyn (≤ 8 val, planerad post utan Starta-knapp) och kedjan *Vanliga grönsaker* → lär → läs → samtalsprompt → nästa dags repetition.
- Migrering 0.3.1→0.4.0 med fullständig datamängd och `resetProgressOnUpdate` på och av: `src/dev/release04.migration.test.ts`.
- **EJ TESTAT:** WebKit/Safari, fysisk iPhone och verklig TTS.

## Testat (version 0.3.1)

- `npm run typecheck` OK · `npm test` **95 tester gröna** (nya: nollställning vid versionsbyte + återställningspunkt, tidsresa, upplåsning, genvägar, "Del X av Y", passiva ord) · `npm run build` OK · `npm run e2e` **passerar** · skärmbilder av startsida, inlärning och utvecklarpanel granskade.

## Testat (version 0.3)

- `npm run typecheck` OK · `npm test` **88 tester gröna** (nya: distraktorer från annat ämne och samma genus, meningsramar utan "alla" och grammatiktermer, inget auto-avancemang) · `npm run build` OK · `npm run e2e` **passerar** med nya designen · skärmbilder av startsida, ordintro, flerval, kontextövning och skrivövning granskade.

## Testat (version 0.2)

- `npm run typecheck` OK · `npm test` **85 tester gröna** (inkl. språkkontrollen över allt innehåll och inlärningskedjan) · `npm run build` OK · `npm run e2e` **passerar** (inkl. ny kontroll av "Hoppa över") · skärmbilder av nya ordintroduktioner granskade.

### Från 0.1

- `npm run typecheck` – inga fel.
- `npm test` – **79 tester gröna** (11 filer): innehållsvalidering (och att validatorn fångar fel), furigana, datum/tidszon/sommartid, streak (13 fall enligt spec §22.1), repetition (separata dimensioner, förfallna, otillräckligt antal, fler än gränsen, skuld, felaktiga svar, ingen historikförlust, dubbelinskick), modulflöde (paus/återupptagning, steg i ordning, registrering i dagens session, tvådagars acceptansflöde, ingen dubbelräkning, data kvar efter omöppning), sparade ord, övningsgenerering för alla ord × typer, entydiga distraktorer, kunskapsnivåer, nivåtest, ordbok (svenska, japanska, kana, böjningar, flera betydelser, delade betydelser, synonymer, 20 000 poster), konversationsprompt, backup (rundtur, ogiltiga filer, framtida version, återställningspunkt), övningskomponenter (återkopplingssteg, å/ä/ö, ordbok bevarar inmatning).
- `npm run build` – OK (vendor 111 kB gzip, app 39 kB, innehåll 29 kB).
- `npm run e2e` – **hela acceptansflödet (spec §26) passerar** i Chromium med iPhone 13-emulering och simulerad klocka: välkomst → nivåtest → startsida → modul A alla tre steg (inkl. ordbok mitt i övning, uppslagning i texten med bevarad position, kopierad prompt) → dagen klar, streak 1 → omladdning behåller data → dag 2: 25 repetitioner av gårdagens ord → modul B → streak 2 → global sökning på kanji → ordbokssökning på böjningsform → export. Inga konsolfel.
- Visuell kontroll av skärmbilder (startsida, ordintro, ordbokspost, lästext med bottom sheet, samtalssteg).

**Inte testat:** på en fysisk iPhone/Safari (WebKit), riktig svensk TTS-röst, "Lägg till på hemskärmen", offline-läge i praktiken, GitHub Pages-publicering (workflowet är skrivet men har inte körts).

## Kända problem och begränsningar

1. **Innehållet är AI-utkast** (även 0.2-omskrivningen) (`quality.status: ai-draft`) och inte granskat av människa. Japanska läsningar/översättningar och fakta bör granskas – detta är den viktigaste kvalitetsrisken.
2. Grundord (t.ex. *gjord*, *salt*) finns inte i ordboken och kan inte slås upp; texterna innehåller nu bara grundord och inlärda ord, men grundorden saknar japanska glosor.
2b. Språkkontrollens igenkänning av grundord är en heuristik (suffixregler); den kan i sällsynta fall godkänna ett ord som inte är ett grundord. Grundordförrådet är egenkomponerat (ingen licensierad frekvenslista) och bör granskas.
2c. Språkkontrollen utgår från modulens förkunskaper, inte från vad användaren faktiskt har lärt sig (en användare kan hoppa över kedjan).
3. Morfologin känner bara igen lagrade former: delade partikelverb ("plockar hon undan"), s-passiv ("belägrades") och sammansättningar ("vattenmolekyl") länkas inte.
4. Inget IPA-uttal; uttal endast via enhetens talsyntes (iPhone kan behöva ladda ner en svensk röst).
5. (Åtgärdat i 0.3: inget automatiskt avancemang längre.) Kontextövningarnas felalternativ kan komma från moduler som eleven ännu inte gjort (de väljs från andra ämnen för att vara entydiga).
6. Ändrat "repetitioner per dag" gäller först nästa dag (dagens plan är fryst).
7. Extrarepetitionens urval sparas inte (varje svar sparas dock).
8. Fast tidszon stöds i datamodell och logik men kan inte väljas i UI.
9. Om en modul ändrar `contentVersion` under pågående steg 1 används den sparade planen; borttagna ord hoppas över, nya ord kommer inte med förrän modulen startas om (ingen omstartsfunktion ännu).
10. `word_mastered` emitteras inte; inga ljudeffekter (avsiktligt dolt tills de finns).
11. All innehåll laddas ivrigt (OK för v0.1; se ADR 11).
12. Ruby-text gör att kanji med långa läsningar spärras ut lite (normalt webbläsarbeteende).
13. Ingen ESLint-konfiguration; e2e-skriptet använder globalt installerad Playwright.

## Återstår (inte implementerat i 0.1)

Se `ROADMAP.md`. Kortsiktigt viktigast: test på fysisk iPhone, mänsklig innehållsgranskning, fler moduler, stödordbok för lästexter.

## Nästa rekommenderade arbetsuppgift

(0.4) 1. Testa 0.4 på iPhone: Kurser-menyn, sökningen och kedjan grönsaker → skära → koka. 2. Mänsklig granskning av matlagningsmodulerna. 3. Nästa avgränsade PR: fortsätt *Matlagningens verb* (t.ex. SWC-VAR-02-03-03 Steka och bryna) med `module:new`. 4. Japanska katalogtitlar. 5. Bestäm när `resetProgressOnUpdate` ska stängas av.

(0.3) 1. Testa Fjord-designen på iPhone (särskilt resultatpanelen längst ner och tangentbordet i skrivövningar). 2. Mänsklig granskning av innehållet. 3. Fler moduler. 4. Ta fram Jonathan-avataren (illustration) och koppla in den i `Jonathan.tsx`.

(0.2) 1. Merga 0.2 till `main` (publiceras automatiskt) och testa på iPhone: gå igenom *Material och ämnen* och kontrollera att förklaringarna känns begripliga. 2. Mänsklig granskning av innehållet. 3. Fler moduler i kedjor enligt `CONTENT_GUIDELINES.md` (kontrollerat ordförråd).

### Tidigare (0.1)

1. **Publicera och testa på iPhone**: slå på GitHub Pages (Settings → Pages → Source: GitHub Actions), merga till `main`, öppna i Safari, lägg till på hemskärmen och gå igenom en hel dag. Notera problem med tangentbord, röst och layout.
2. **Granska innehållet** med en person som kan svenska och japanska; sätt `quality.status: reviewed`.
3. **Producera modul 4–6** enligt `CONTENT_GUIDELINES.md`.
