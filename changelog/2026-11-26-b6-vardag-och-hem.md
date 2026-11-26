## Osläppt – 2026-11-26: etapp B6, Vardag & hem (R01-A01) enligt standard 2

Första etappen i B6. Alla 42 befintliga moduler i *Vardag & hem* har nu `"standard": 2` och uppfyller kvalitetskontraktet. Det var 980 kontraktsfel, och alla är rättade.

- **Ämnesgrupper:**
  - *Bostadstyper & rum*
  - *Möbler & inredning*
  - *Kök & hushållsredskap*
  - *Badrum & hygienutrymmen*
  - *Städning & underhåll*
  - *Hyra, köpa & grannar*
- **Betydelser (K3/K4):** 560 ordposter är inventerade mot SO, och 84 vanliga betydelser är nya. Vardagsbetydelsen visas först och den gamla betydelsen har fått etikett. Exempel:
  - *läge* (i bostad, läge på en apparat)
  - *etta*, *tvåa*, *trea* (lägenhet, betyg, siffra)
  - *riva* (dra sönder, riva ett hus, riva ost)
  - *säkerhet* och *larm*
  - *stopp* (allmänt och i rör)
  - *visning*, *bud* och *rörlig*
  - *skälla* och *hänsyn*

  Grundorden har `coreSense`, till exempel *vind* (väder först), *flytta*, *lämna* och *sakna*.
- **Förklaringar (K5–K7):**
  - Ett 60-tal B2-ord har fått kollokationer, ett andra exempel och en mening om förväxlingsordet, till exempel *hyresrätt*/*bostadsrätt*/*äganderätt*, *offert*, *ventilation* och *källsortera*.
  - Ett 60-tal abstrakta B1-ord har fått en kort förklaring.
- **Beskrivningar:** modulbeskrivningarna säger nu vad eleven lär sig, inte bara vilka ord modulen har.
- **Fakta (K9):** strängen "Vardagsscen utan faktapåståenden." är borttagen. Moduler med fakta har strukturerade källor. Exempel:
  - Brandvarnarens dag 1 december
  - 1177 om brännskador
  - osthyvelns patent 1925
  - bostadsrättslagen och jordabalken
  - kötiden i Stockholms bostadsförmedling
- **Animationer (K10):** 59 befintliga verbbilder har fått rörelse i `housing.ts`, `furniture.ts`, `kitchenHome.ts`, `bathroom.ts`, `cleaning.ts` och `housingAdmin.ts`. Ingen av dem hade blindtest, och stillbilderna är oförändrade.
- **Rättat:**
  - Lästexten i *Säkerhet i köket* sa att de flesta olyckor i hemmet sker i köket. Det som stämmer är att de flesta bränder börjar där, och texten säger nu det.
  - Den japanska definitionen av *med fog* stod i definitionen och ligger nu i en användningsanteckning.
- **Spärren:** "ord med animation" och "poster med flera betydelser" räknas bara för befintliga moduler och sjönk därför när modulerna lämnade det omfånget. Det är registrerat med `--allow-worse`, och flaggan kan nu anges flera gånger.
