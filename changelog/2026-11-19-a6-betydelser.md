## 0.54.0 – 2026-11-19: etapp A6, datamodell för betydelser

- `order`, `level` och `inflection` på betydelsen, `senseInventory` på posten (schema, `DATA_MODEL.md`). Visningsordningen är skild från id:t, så vardagsbetydelsen kan stå först utan att något id byts. Repositoriet låter `getSense(id).entry` bära betydelsens egen nivå och böjning.
- Ordboken visar en betydelses egen nivå och böjning; validatorn kontrollerar unika `order`, att `coreSense` finns i posten och att betydelsens böjning passar ordklassen.
- `tools/production/senses.py <ord>` visar postens betydelser i visningsordning, var de lärs ut, om lemmat är grundord och om inventeringen är gjord; `--mark` sätter `senseInventory`. Ersätter `exists.py` i produktionen.
- *arbete* har fått vardagsbetydelsen (*jobb*, A1, `s.arbete.2`) som visas först; fysikbetydelsen `s.arbete.1` är oförändrad men har nivå B2. *damm* i betydelsen smuts böjs nu *ett damm, dammet* (ingen plural).
