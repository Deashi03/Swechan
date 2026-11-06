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

## v0.9 – nästa steg
- Infrastruktur för bilder och animationer enligt produktägarens kommande instruktion; därefter bilder för de publicerade modulerna.
- Nästa överämne, ett i taget: *Människan & hälsa → Kroppen & sinnena* (R02-A01).
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
