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

## v0.4 – Skalning av innehåll
- Katalogindex + lazy-laddade modulkroppar.
- Verktyg (CLI) för modulproduktion: skelettgenerator, utökad validering (t.ex. andel okända ord i lästext mot användarens nivå).
- Morfologisk analys baserad på SALDO (känna igen delade partikelverb, s-passiv, sammansättningar).

## v0.5 – Personalisering
- FSRS-parameteroptimering per användare när tillräcklig historik finns.
- Rekommendationer baserade på kunskapsmodell och intressen.
- Fler övningstyper (t.ex. lyssna-och-skriv, kollokationer, ordbildning).

## Senare
- Inbyggd AI-konversation (ny `ConversationProvider`), ev. uttalsåterkoppling.
- Molnsynkronisering (valfri) och konto – arkitekturen är förberedd genom versionshanterad export och ID-baserade referenser.
- Personlig avatar med animationer och ljud (komponent och händelser finns redan).
- Grafiskt administratörsgränssnitt för innehåll.
