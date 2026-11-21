## Osläppt – 2026-11-21: etapp B5, manuellt bildspår för Matematikens grunder

- Alla 32 bildlösa ord i Matematikens grunder har nu en handritad bild med räkneuttryck, klossar, tallinjer, staplar och tabeller som ledtråd. Exempel: *överslag* (19 · 21 → 20 · 20 ≈ 400), *isolera* (x ensam i en ruta), *avrundning* (4,7 → 5 på tallinjen), *mittersta* (pilen på talet i mitten), *korrelation* (punkter längs en linje med r ≈ 0,9) och *kvadratdecimeter* (rutnät med 1 dm).
- 25 bilder klarade matchningstestet. Tre räknas som synonymer enligt produktägarens beslut: *delbar/gå jämnt upp*, *olikhet/olikhetstecken* och *variera/rörlig*. *Rektangulär/rektangel* är också markerade som synonymer. Fyra bilder är godkända som symbolbilder med undantag: *storleksordning*, *rimlighet*, *storhet* och *rektangulär*.
- Motiven ligger i `src/ui/wordArt/manualMathBasics.ts` (prefix `manb.`).
- Måttet ”B2+ förväxlingsord som inte nämns” steg av de nya synonymparen. Försämringen är avsiktlig och registrerad med `--allow-worse`.
- Mått: ”ord utan bild” 354 → 322, ”ord med animation” 447 → 450, ”planerad animation saknas” 127 → 124.
