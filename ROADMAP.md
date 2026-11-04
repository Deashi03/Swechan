# Roadmap

## v0.1 – Stabil grund (denna version)
Fungerande huvudflöde: daglig session, tre-stegsmoduler, FSRS-repetition med separata kunskapsdimensioner, streak + freezes, ordbok (även under övning), synonymjämförelse, sparade ord, nivåtest, statistik, export/import, PWA, 3 moduler.

## v0.2 – Innehållskvalitet och iPhone-finputs
- Mänsklig granskning av allt v0.1-innehåll (japanska glosor, läsningar, exempel, fakta) → `quality.status: reviewed`.
- Testa på riktig iPhone (Safari + hemskärm): tangentbord, safe areas, svensk röst, offline.
- 5–10 moduler totalt (förslag: kroppen & hälsa, känslor & relationer, väder & klimat, samhälle & politik, Napoleonkrigen).
- Stödordbok för vanliga ord i lästexterna (så att alla ord i texten går att slå upp).
- Inställning för fast tidszon i UI; ev. ljudeffekter kopplade till händelsebussen (med av/på).
- Hantering av ändrad `contentVersion` för pågående modul (behåll plan, hoppa över borttagna ord – delvis redan robust).

## v0.3 – Skalning av innehåll
- Katalogindex + lazy-laddade modulkroppar.
- Verktyg (CLI) för modulproduktion: skelettgenerator, utökad validering (t.ex. andel okända ord i lästext mot användarens nivå).
- Morfologisk analys baserad på SALDO (känna igen delade partikelverb, s-passiv, sammansättningar).

## v0.4 – Personalisering
- FSRS-parameteroptimering per användare när tillräcklig historik finns.
- Rekommendationer baserade på kunskapsmodell och intressen.
- Fler övningstyper (t.ex. lyssna-och-skriv, kollokationer, ordbildning).

## Senare
- Inbyggd AI-konversation (ny `ConversationProvider`), ev. uttalsåterkoppling.
- Molnsynkronisering (valfri) och konto – arkitekturen är förberedd genom versionshanterad export och ID-baserade referenser.
- Personlig avatar med animationer och ljud (komponent och händelser finns redan).
- Grafiskt administratörsgränssnitt för innehåll.
