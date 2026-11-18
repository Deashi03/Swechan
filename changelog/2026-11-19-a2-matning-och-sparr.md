## 0.54.0 – 2026-11-19: etapp A2, mätning och kvalitetsspärr

- `npm run audit:content` (`scripts/audit-content.mjs`) mäter 22 kvalitetsmått för de befintliga modulerna (bildlösa ord, animationer, betydelser, förklaringar, läsningar, typografi, namn, sv/ja) och kontrollerar kvalitetskontraktet (`quality/contract.json`) för nya moduler och moduler med `standard: 2`. `--report` ger en tabell per ämnesgrupp, `--backlog` arbetsköer i `quality/backlog/`.
- Spärren: `quality/metrics.json` är lägstanivån. CI fallerar om ett mått blir sämre eller om en modul bryter mot kontraktet. Förbättringar skrivs in med `--update`; en avsiktlig försämring kräver `--allow-worse "<mått>: <skäl>"` och skälet sparas.
- `quality/legacy-modules.json`: de 1 517 moduler som fanns före kontraktet. En modul som inte står där måste ha `standard: 2`.
- `npm run content:version` (`scripts/content-version.mjs`): `contentVersion` och `updatedAt` räknas ut ur ett fingeravtryck av modulen och dess ordposter, också när en delad ordpost ändras. CI kontrollerar att inget glömts. Versionen ska inte längre ändras för hand.
- `quality/characters.json`: personnamn med enda tillåtna katakana och fasta roller (Aiko, Erik, Mia, Leo, Mei). `quality/readings-allow.json`: kanjiord med flera godkända läsningar och kända felläsningar; tonande första ljud godtas automatiskt.
- `tools/production/check.sh` kör nu också `content:version` och spärren.
- Utgångsläge: 592 ord utan bild, 311 animerade ord, 3 920 verb och processord utan animation, 8 459 svåra ord med ett enda exempel, 1 753 abstrakta B1-ord utan förklaring, 175 poster som säger "kan också betyda" utan att ha betydelsen.
