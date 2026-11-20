## Osläppt – 2026-11-20: etapp B5, manuellt bildspår för Avancerad matematik

- 54 ord som saknade bild har fått en handritad bild som klarat matchningstestet med en oberoende granskare. Exempel: *derivata* (tangent med f′(x)), *närmevärde* (π ≈ 3,14 på en tallinje), *exakt* (pilen i mitten och =), *integrationskonstant* (en familj kurvor med + C), *varians* (kvadrater på avvikelserna och σ²), *implikation* och *omvändning* (A ⇒ B mot B ⇒ A), *komplementhändelse* (allt utom A skuggat) och *i takt med* (ett ljus som brinner ner timme för timme). Nio av bilderna rör sig (*beräkna*, *derivera*, *deformera*, *vinst*, *förlust* med flera).
- Motiven ligger i `src/ui/wordArt/manualMath.ts` (prefix `manm.`). Flera av orden delas med *Matematikens grunder* (*procent*, *andel*, *area*, *samband*, *potens*), som därmed också fick färre bildlösa ord.
- Fyra ord klarade inte två omgångar: *egenvärde*, *numerisk*, *slumpförsök* och *sökning*. De ligger kvar i det manuella spåret med en rad om varför och ett förslag till produktägaren i `quality/visual-manual-notes.md`.
- Verktyget `art:blind` visar nu affischbilden för rörliga motiv. Tidigare kunde arket fånga en rörlig del i sitt startläge, till exempel en nästan genomskinlig pil.
- Mått: ”ord utan bild” 592 → 538, ”ord med animation” 406 → 413, ”planerad animation saknas” 152 → 147.
