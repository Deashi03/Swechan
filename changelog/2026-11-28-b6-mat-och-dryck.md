## Osläppt – 2026-11-28: etapp B6, Mat & dryck (R01-A02) enligt standard 2

Andra etappen i B6. Alla 42 befintliga moduler i *Mat & dryck* har nu `"standard": 2` och uppfyller kvalitetskontraktet. Det var 828 kontraktsfel, och alla är rättade. I samma etapp är sju äldre animerade scener omritade, eftersom de visade sin japanska översättning som text.

- **Ämnesgrupper:**
  - *Råvaror & skafferi*
  - *Kött, fisk & vegetariskt*
  - *Matlagningens verb*
  - *Smaker & konsistenser*
  - *Måltider & servering*
  - *Kost & matkultur*
- **Betydelser (K3/K4):** 588 ordposter är inventerade mot SO, och 43 vanliga betydelser är nya. Vardagsbetydelsen visas först och den gamla betydelsen har fått etikett. Exempel:
  - *morot* (belöning) och *paprika* (krydda)
  - *mogen* och *omogen* (om person)
  - *vass* (om ord) och *mild* (om person)
  - *lock* (i håret) och *fat* (för öl eller olja)
  - *sällskap* (grupp), *klimat* (stämning) och *reaktion* (svar på något)
  - *säsong* (sport och tv) och *kvalitet* (god egenskap)

  Åtta grundord har `coreSense`, till exempel *skära*, *koka*, *röra*, *dela* och *skicka*.
- **Förklaringar (K5–K7):**
  - Ett 30-tal B2-ord har fått kollokationer, ett andra exempel och en mening om förväxlingsordet. Exempel:
    - *laktos*/*laktosfri*
    - *hållbarhet*/*bäst före*
    - *halal*/*kosher*
    - *överkänslig*/*allergisk*
    - *matsvinn*/*slösa*
  - 75 abstrakta B1-ord har fått en kort förklaring.
- **Beskrivningar:** 27 modulbeskrivningar säger nu vad eleven lär sig, inte bara vilka ord modulen har.
- **Fakta (K9):** strängen "Vardagsscen utan faktapåståenden." är borttagen. Moduler med fakta har strukturerade källor, i första hand Livsmedelsverket och 1177. Exempel:
  - kylskåpstemperatur, bäst före-datum och upptining
  - hemberedskap för en vecka
  - linfrö
  - allergener i märkningen
  - tallriksmodellen
  - Kanelbullens dag och Våffeldagen
- **Rättat:**
  - *allergen*: allergener "måste stå med fet stil" → "ska synas tydligt, ofta med fet stil" (EU 1169/2011 kräver framhävning).
  - *kalcium*: "barn och äldre behöver extra mycket" → "barn och unga som växer behöver mycket kalcium".
  - Lördagsgodis: påståendet "Medicinalstyrelsen 1959" gick inte att belägga och är omskrivet till att seden växte fram i slutet av 1950-talet efter Vipeholmsundersökningarna.
- **Animationer (K10):** 48 befintliga verbbilder har fått rörelse i `basics.ts`, `food.ts`, `groceries.ts`, `kitchen.ts`, `meals.ts` och `dining.ts`. Ingen av dem hade blindtest, och stillbilderna är oförändrade.
- **Sju scener omritade (produktägarens beslut 2026-11-28):** scenerna för *baklänges*, *vass*, *slö*, *modern*, *grov*, *sportig* och *gyllenbrun* visade den japanska glosan som text, vilket avslöjar svaret. Utan texten underkändes de i blindtest, så de är omritade som handritade kontrastbilder i `blindFix.ts`, och scenfilerna är borttagna.
  - Godkända i matchningstest: *vass* (skär tunna skivor), *slö* (mosar tomaten), *gyllenbrun* (blek, gyllenbrun och bränd brödskiva), *modern* (gammaldags mot modernt rum), *baklänges* och *sportig*.
  - *grov* (fint pulver mot stora korn) valdes rätt men med medelhög säkerhet i två omritningar. Produktägaren beslutade att räkna *grov*/*sandpapper* som synonympar. Bilden har undantag (`waived`), eftersom registreringen inte kan räkna ett rätt svar med medelhög säkerhet som synonym.
- **Spärren:** "ord med animation" (528 → 489) och "poster med flera betydelser" (950 → 908) räknas bara för äldre moduler och sjönk därför när modulerna lämnade det omfånget. Det är registrerat med `--allow-worse`. Sex andra mått blev bättre, till exempel "abstrakt B1 utan förklaring" (1 741 → 1 666).
