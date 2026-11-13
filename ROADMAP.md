# Roadmap

## v0.1 – Stabil grund (denna version)
Fungerande huvudflöde: daglig session, tre-stegsmoduler, FSRS-repetition med separata kunskapsdimensioner, streak + freezes, ordbok (även under övning), synonymjämförelse, sparade ord, nivåtest, statistik, export/import, PWA, 3 moduler.

## v0.2 – Pedagogiskt innehåll som bygger på det kända (klar)
Kontrollerat ordförråd med automatisk kontroll, inlärningskedjor med två grundmoduler, tydliga betydelser, uppslagbara ord i förklaringar, omskrivet innehåll (5 moduler).

## v0.3 – Mänsklig granskning, iPhone-finputs och fler kedjor
- Mänsklig granskning av allt innehåll (japanska glosor, läsningar, exempel, fakta) → `quality.status: reviewed`.
- Synlig "kunskapsväg" i Utforska (vilka moduler låser upp vilka).
- Fler moduler i kedjor (t.ex. *Kroppen* → *Medicin*; *Känslor* → *Relationer*; *Samhälle* → *Politik*).
- Japanska glosor för grundordförrådet, så att även grundord kan slås upp i texter.
- Kontroll som jämför förklaringar mot användarens *faktiska* inlärda ord (inte bara modulens förkunskaper).
- Inställning för fast tidszon i UI; ljudeffekter kopplade till händelsebussen (med av/på).

## v0.4 – Skalning av innehåll (klar)
- Produktägarens planeringskatalog (344 kategorier, 2 016 planerade moduler) i Kurser, högst åtta val per skärm, global sökning.
- Modulindex + lazy-laddade lektionskroppar, offlineförladdning.
- CLI för innehållsproduktion: `catalog:validate`, `module:new`, `module:validate`, `content:report`.
- Tre nya moduler i en kedja (grönsaker → skära → koka), de första 1:1-kopplade till katalogen.

## v0.5 – Innehåll i stor skala och bilder (klar)
- 102 nya moduler: Mat & måltider och Hem & boende helt publicerade, Kläder & personlig stil till hälften.
- Bilder i stilen "Platt" för områden och alla publicerade moduler.
- Rättat: svaret syntes i frågan; äldre moduler i fel överkategori.

## v0.6 – Bilder på orden (pilot klar)
- Bild per betydelse i Vardagskläder, bildövningar med förväxlingsfria alternativ, foton där yta/tillstånd avgör.

## v0.7 – Innehåll: kläder, tid och handel (klar)
- 105 nya moduler: Kläder & personlig stil, Tid & vardagsrutiner och Handel & vardagstjänster helt publicerade (215 moduler totalt).
- Repetitionen tål kort för borttagna betydelser.

## v0.8 – Förklaringar och Resor & lokaltrafik (klar)
- Svåra ord (B2+) har förklaringar som visas i introduktionen och ordboken; regeln valideras.
- 42 nya moduler: *Resor & lokaltrafik* helt publicerat, och därmed hela *Vardag & hem* (257 moduler totalt).

## v0.9 – Kroppen & sinnena (klar)
- 42 nya moduler: *Människan & hälsa → Kroppen & sinnena* helt publicerat (299 moduler totalt).

## v0.10 – Hälsa & sjukvård (klar)
- 42 nya moduler: *Människan & hälsa → Hälsa & sjukvård* helt publicerat (341 moduler totalt).

## v0.11 – Känslor & psykologi (klar)
- 42 nya moduler: *Människan & hälsa → Känslor & psykologi* helt publicerat (383 moduler totalt).

## v0.12 – Animationer: grunden (klar)
- Spelaren från Animation_tool-, registret `wordVisuals.json`, animation i introduktionen och posterbild i bildövningar, offline per modul, visualiseringsplan för alla betydelser.

## v0.13 – Pilot: Kroppen & sinnena helt visualiserat (klar)
- Alla 631 modulord i *Kroppen & sinnena* har en bild: 374 kodillustrationer (kroppsdelar, organ, diagram, hjälpmedel, symboler) och 257 animationer (243 nya scener skrivna som data i `scripts/scenes`).
- Kvar: stickprov av produktägaren, flytta scenerna och kroppsdelsmallarna till Animation_tool- när en session har pushbehörighet där, dela `render`-delen per överämne.

## v0.14 – Relationer & familj börjar, Vardag & hem fylls på (klar)
- 10 nya moduler med bilder från början: hela *Familjemedlemmar* (7) och de tre första i *Vänskap*.
- Påfyllning av bilder: *Vardag & hem* ordning 101–107 (frukt, spannmål, baljväxter, nötter, kryddor, torrvaror, kött).
- Illustrationerna laddas per område.

## v0.15 – Relationer & familj fortsätter, Vardag & hem fylls på, tydligare japanska (klar)
- 11 nya moduler med bilder från början: resten av *Vänskap* (1014–1017) och hela *Kärlek & partnerskap* (1021–1027).
- Påfyllning av bilder: *Vardag & hem* ordning 108–113 (fågel och ägg, fisk och skaldjur, vegetariskt, mejeri, råvaror, förvaring).
- Gränssnitt: japansk text om ordet är stor och mörk med tydlig furigana (ADR 40).

## v0.16 – Bild → ord med japanska, Vardag & hem 114–131 (klar)
- Övningen *Vilket ord passar till bilden?* visar ordets japanska översättning, och en animation till ordet spelas en gång (ADR 41).
- Påfyllning av bilder: *Vardag & hem* 114–131 (matlagning, smaker, konsistens, färskhet, måltider, fika, restaurang), 250 bilder.

## v0.17 – Mat & dryck klart, Bostad och möbler (klar)
- Påfyllning av bilder: *Vardag & hem* 132–139 (nu har hela Mat & dryck, 101–139, bilder), 201–207 (bostad) och 208–214 (möbler och inredning), sammanlagt 323 bilder.

## v0.18 – Vardag & hem till 242, skor och accessoarer (klar)
- Påfyllning av bilder:
  - *Vardag & hem* 215–242: kök, badrum, städning och reparationer, hyra, bostadsrätt, grannar, felanmälan och flytt.
  - *Kläder & stil* 308–314: skor, mössor, halsdukar och vantar, väskor, smycken och tillbehör.
  - Sammanlagt 516 bilder.

## v0.19 – Kläder & stil klart, grundmodulerna 1–8 (klar)
- Påfyllning av bilder: *Kläder & stil* 315–342 (material, passform, klädvård, hår och hud) och grundmodulerna 1–8, sammanlagt 549 bilder.

## v0.19.1 – blindtest och styrsystem för bilder (klar)
- Alla symbol- och adjektivbilder blindtestade och rättade. Blindtest med fingeravtryck krävs nu för sådana bilder (test stoppar bygget).

## v0.20 – Tid & vardagsrutiner har bilder (klar)
- 628 bilder för 401–442, alla symbol- och adjektivbilder blindtestade.

## v0.21 – Handla & tjänster har bilder (klar)
- 592 nya bilder för 501–542, alla symbol- och adjektivbilder blindtestade.

## v0.22 – Resor & transport har bilder (klar)
- 632 nya bilder för 601–657, alla symbol- och adjektivbilder blindtestade.

## v0.23 – Hälsa & sjukvård har bilder (klar)
- 629 nya bilder för 801–857, alla symbol- och adjektivbilder blindtestade.

## v0.24 – Känslor & psykologi har bilder (klar)
- 627 nya bilder för 901–957, alla symbol- och adjektivbilder blindtestade.

## v0.25 – överämnena har bilder (klar)
- 48 illustrationer för katalogens överämnen i menyn.

## v0.26 – ämnesgrupperna har bilder (klar)
- 288 illustrationer för katalogens ämnesgrupper i menyn.

## v0.27 – modulbilder för tre rotområden (klar)
- 651 nya illustrationer: alla 756 katalogmoduler i Vardag & hem, Människan & hälsa och Samhälle har bild.

## v0.28 – alla katalogmoduler har bild (klar)
- 1 260 nya illustrationer för R04–R08. Alla 2 016 katalogmoduler har bild.

## v0.29 – Människan & hälsa komplett, alla ord med bild (klar)
- 105 nya moduler (Relationer & familj T04–T06, Kommunikation, Livsfaser) med 1 430 nya ordbilder. Från 0.29 ska varje modulord ha bild, animation eller symbol.

## v0.30 – Politik & demokrati (klar)
- 42 nya moduler i Samhälle & institutioner → Politik & demokrati med 489 nya ordbilder. 20 ord saknar bild efter två blindtestomgångar.

## v0.31 – Juridik & rättsväsende (klar)
- 42 nya moduler i Samhälle & institutioner → Juridik & rättsväsende med 482 nya ordbilder. 45 ord saknar bild efter två blindtestomgångar.

## v0.32 – Ekonomi & arbetsliv (klar)
- 42 nya moduler i Samhälle & institutioner → Ekonomi & arbetsliv med 475 nya ordbilder. 25 ord saknar bild efter två blindtestomgångar.

## v0.33 – Utbildning & lärande (klar)
- 42 nya moduler i Samhälle & institutioner → Utbildning & lärande med 441 nya ordbilder. 26 ord saknar bild efter två blindtestomgångar.

## v0.34 – Städer & offentlig service (klar)
- 42 nya moduler i Samhälle & institutioner → Städer & offentlig service med 424 nya ordbilder. 9 ord saknar bild efter två blindtestomgångar.

## v0.35 – Medier & samhällsdebatt (klar)
- 42 nya moduler i Samhälle & institutioner → Medier & samhällsdebatt med 338 nya ordbilder. 25 ord saknar bild efter två blindtestomgångar. Hela Samhälle & institutioner (R03) är nu publicerat.

## v0.36 – Historiska epoker (klar)
- 42 nya moduler i Historia & humaniora → Historiska epoker med 445 nya ordbilder. 20 ord saknar bild efter två blindtestomgångar. Långa ord flödar inte längre ut ur ordkortet.

## v0.37 – Militärhistoria (klar)
- 42 nya moduler i Historia & humaniora → Militärhistoria med 452 nya ordbilder. 16 ord saknar bild efter två blindtestomgångar.

## v0.38 – Religion & idéhistoria (klar)
- 42 nya moduler i Historia & humaniora → Religion & idéhistoria med 381 nya ordbilder. 17 ord saknar bild efter två blindtestomgångar.

## Senare – två spår per release
- Nytt överämne (nästa enligt katalogen efter *Människan & hälsa*) som räknas som klart först när varje modulord har visualisering.
- Ett befintligt överämne fylls på med visualiseringar (Vardag & hem först).
- Mänsklig språkgranskning av AI-utkasten (status `reviewed`).
- Japanska katalogtitlar (översättning + granskning).
- Utökad validering (andel okända ord i lästext mot användarens nivå); morfologisk analys baserad på SALDO.

## Senare: personalisering
- FSRS-parameteroptimering per användare när tillräcklig historik finns.
- Rekommendationer baserade på kunskapsmodell och intressen.
- Fler övningstyper (t.ex. lyssna-och-skriv, kollokationer, ordbildning).

## Senare
- Inbyggd AI-konversation (ny `ConversationProvider`), ev. uttalsåterkoppling.
- Molnsynkronisering (valfri) och konto – arkitekturen är förberedd genom versionshanterad export och ID-baserade referenser.
- Personlig avatar med animationer och ljud (komponent och händelser finns redan).
- Grafiskt administratörsgränssnitt för innehåll.
