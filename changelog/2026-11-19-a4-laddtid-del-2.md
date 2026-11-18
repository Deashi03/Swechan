## 0.54.0 – 2026-11-19: etapp A4, laddtid del 2 (delvis)

- **Innehållet delas upp:** ordboken låg i en enda fil på 25 MB (6 MB komprimerad) som laddades om vid varje release. Nu blir det en fil per ämnesgrupp (`dict-R01-A01` …, 0,3–0,9 MB vardera) plus `visuals` och `module-index`. En release ändrar bara de filer vars innehåll ändrats; resten ligger kvar i cachen (A3).
- **Storleksspärr:** `node scripts/bundle-report.mjs --check` körs i CI efter bygget, skriver ut startpaketets storlek och fallerar om en enskild fil blir större än 5 MB.
- Kvar till etapp A4b (se `docs/QUALITY_PLAN.md`): ordboken ur startpaketet (kräver ett asynkront innehålls-API) och bildpaket per modul.
