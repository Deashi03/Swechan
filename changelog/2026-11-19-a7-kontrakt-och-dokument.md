## 0.54.0 – 2026-11-19: etapp A7, kvalitetskontrakt, produktionsinstruktion och dokument

- **Kvalitetskontraktet** `quality/contract.json` (K1–K10 och TEXT) gäller nya moduler och moduler med `"standard": 2` (nytt fält i modulschemat). En modul som inte står i `quality/legacy-modules.json` måste ha `standard: 2`; `npm run audit:content` stoppar den annars.
- **`factSources`** kan nu vara `{ text, source, checked, recheck }` – vad som påstås, var det kontrollerades, när, och om det ska kontrolleras årligen. Fri text godtas bara i moduler från före kontraktet.
- **DSL** (`tools/production/dsl.py`): `order=`, `lv=` och `infl=` på betydelser, `inv=` (senseInventory) på poster, strukturerade `factSources`; `module()` sätter `standard: 2`.
- **Ny `docs/PRODUCTION_BRIEF.md`:** betydelseinventering före skrivandet, förklaringsmall för svåra ord (exempel, användning, skillnad mot förväxlingsord, andra exempel), korta förklaringar för abstrakta B1-ord, animationsavsnitt (rörelse i motiv och scener för människor), matchningstest och det manuella bildspåret.
- **`CLAUDE.md`:** kontraktet, kvalitetsspärren och automatisk `contentVersion` i reglerna; två underkända blindtest leder till det manuella spåret.
- **`PROJECT_STATUS.md`** är nedkortad från 552 till cirka 70 rader. *Öppna osäkerheter* står i `quality/uncertainties.md`, saknade bilder i kön och `quality/visual-manual-notes.md`.
- **Ändringsloggen** skrivs nu som en fil per release eller etapp i `changelog/`; `CHANGELOG.md` är ett arkiv.
- Version 0.54.0 samlar etapperna A2–A7.
