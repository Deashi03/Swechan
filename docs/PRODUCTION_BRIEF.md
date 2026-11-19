# Produktionsinstruktion: moduler och ordbilder

För agenter som skriver en ämnesgrupp (sju moduler). Läs bara den här filen, exemplet och din grupps filer.

Varje ny modul har `"standard": 2` och ska uppfylla kvalitetskontraktet (`quality/contract.json`, K1–K10 och TEXT). `tools/production/check.sh` stoppar modulen annars. Det som en grind kontrollerar står här bara med en rad.

## Arbetsgång
1. Synka arbetskopian med integrationsgrenen. Skriv aldrig i integratörens träd.
2. **Inventera betydelserna innan du skriver** (K3, K4). Kör `python3 tools/production/senses.py ord1 ord_två` för alla ord du tänker använda.
   - Finns betydelsen: referera dess `senseId`. Ordet hör till den modul där det först lärs ut.
   - Kontrollera varje posts betydelser mot SO (eller SAOL/Lexin). Lägg till de **vanliga betydelser som saknas** med `add_sense`, även om de inte blir modulord. Ge den gamla betydelsen en etikett med `set_label`.
   - Vardagsbetydelsen visas först: `order=1` på den, `order=2` … på resten. Betydelsens egen nivå: `lv='B2'`. Egen böjning (homonymer som *ett damm/en damm*): `infl={...}`.
   - Nya poster: `inv='SO'` på posten. Grundord (markerat GRUNDORD): `inv=('SO', <nummer på grundbetydelsen>)`. Befintliga poster: `python3 tools/production/senses.py --mark <entry-id> SO [--core <sense-id>]`.
3. Skriv ett skript per modul som `tools/production/examples/r1252_forandring.py` (DSL: `tools/production/dsl.py`) och kör det med `SWECHAN_REPO=<arbetskopia> python3 <skript>`.
   - Den första modulen har förkunskapen `prev('<föregående>')`, resten den förra modulen.
   - Varje modul har 15–20 målord. Spara ord som passar en annan katalogtitel bättre.
   - `descSv` beskriver vad eleven lär sig, inte en uppräkning av orden.
   - Fakta: `factSources=[('Påståendet', 'Källa (myndighet, lag, uppslagsverk)', 'årligen'|'aldrig')]`. Lagar, belopp, åldrar och regler är `årligen`. En vardagsscen utan fakta har ingen `factSources`.
4. Kör `tools/production/check.sh m.<slug> …` och rätta varje `VOC`-, `KONTRAKT`- och `SPÄRR`-rad och varje valideringsfel. Skriptet bygger modulindexet och sätter `contentVersion` (ändra den aldrig för hand).
5. Kör `npm run typecheck && npm run validate:content && npx vitest run`. Bara blindtestet får fallera.
6. Rapportera:
   - skripten i ordning
   - nya poster, tillagda betydelser och återanvända `senseId`
   - bilder: animationer, symboler, ord i det manuella spåret
   - ändrade filer utanför gruppen
   - språkliga osäkerheter

## Språk
- Följ SAOL/SO. Furigana `{漢字|かんじ}` på varje kanji, med rätt läsning i sammanhanget. Spärren jämför läsningen med resten av materialet; en riktig avvikande läsning läggs i `quality/readings-allow.json`.
- Flerordsuttryck är egna poster. Skriv rak ordföljd och dela inte partikelverb.
- Svensk och japansk text säger samma sak (inget saknas på japanska). Personnamn och katakana: `quality/characters.json`. Figurer med `role: "fast"` (Aiko, Erik, Mia, Leo, Mei) används bara enligt sin anteckning, aldrig som främlingar.
- Typografi: ”svenska citattecken”, inga `..`, inga dubbla ord eller blanksteg.

## Förklaringar
- **B2 och svårare** (K5, K6): `expl=(sv, ja)` med
  1. vad ordet betyder i praktiken, med ett konkret exempel,
  2. hur det används: `coll=[…]` (vanliga kombinationer), `note=(sv, ja)` eller `reg=`,
  3. en mening om skillnaden mot varje förväxlingsord (`confusableWith` i bilden), eller `syn=[(id, 'near')]`,
  4. ett andra exempel `ex2=(sv, ja)`, helst med annan böjningsform eller konstruktion.
  Börja inte med att upprepa definitionen.
- **Abstrakta B1-ord** (plan `symbol`, K7): en kort förklaring, högst tre meningar, på svenska och japanska.

## Bilder (alla nya ord)
Varje modulord får en visualisering (K1). Planen (`npm run visuals:plan`) säger vilken sort; verktygen skriver inte över den.

- **Animation** (plan `animation`: verb, processord som börjar med "När …", ord om rörelse eller förändring – K2, K10):
  - **Saker som rör sig** (en kula rullar, vatten kokar, en kurva växer, energi flödar): rita slutläget som vanligt och lägg rörelsen med `moving(namn, keyframes, { dur, delay, spin }, …delar)` från `kit.ts`. Grundläget är affischbilden. Använd bara `transform` och `opacity`. Sätt `"animated": true` i specen. Exempel: `mek.rörelseenergi` och `mek.lägesenergi` i `mechanics.ts`, `berg.omvandla` i `rocksMinerals.ts`. Färdiga rörelser: `waIn(namn, dx, dy, …)` (kommer in från ett håll, för pilar och partiklar), `waPulse` (glöder eller blinkar), `waShake`, `waBob`, `waSway`, `waGrow` (bildas eller sprids) och `waSpin`. Exempel: `atom.kretsa`, `vag.guppa`, `reak.explosion`.
  - **Människor som gör något:** en scen i `scripts/scenes/*.scenes.ts` (mall `body`), `npm run scenes:build`.
  - En stillbild där planen säger animation kräver `"waiver": "<skäl>"` i specen. Minst 60 % av modulens verb och processord ska röra sig.
- **Konkret ord:** en tydlig scen. `quiz: true` bara om bilden är entydig.
- **Abstrakt ord:** en symbolisk minischen med `symbol: true` och `quiz: false`. Egenskapen ska dominera bilden, med en grå referens som kontrast.
- **Fil:** `src/ui/wordArt/<fil>.ts` exporterar `<EXPORT>`. Nyckeln är `'<prefix>.<sensenyckel>'` (`.2` för betydelse 2). Lägg till en rad i `GROUPS` i `render.ts`. Bildytan är 120×120 med marken på y=112.
- **Aldrig:** text som avslöjar ordet, varumärken, västerländska metaforer, pekfinger (använd `thumb()`/`palm()`).
- **Figurer:** armarna börjar vid axeln, pratbubblor bredvid huvudet, inget skärs av i kanten, flytta med `g('translate(…)', …)`, aldrig med `.replace()`.
- **Registrera:**
  1. `npm run visuals:plan`
  2. `python3 tools/production/specgen.py <fil>.ts <prefix> <spec.json> 'grupp;…' 'ejquiz,…' 'nyckel=senseId'`
  3. Sätt `symbol`, `quiz`, `animated`, `confusableWith` (bara äkta synonymer) och vid behov `waiver`.
  4. `python3 tools/production/vis.py <spec.json>`, en gång per grupp. En ny körning raderar blindtesten. Följ varje `VARNING`.
- **Granska själv:** `npx vite-node tools/production/wsheet.ts <fil>.ts <EXPORT> ark.html 0 40`, sedan `node tools/production/snap.cjs ark.html ark.png`. Förstår eleven ordet av bilden och den japanska glosan?

## Blindtest (integratören)
- **Bildövningsbilder** (`quiz: true`) och adjektiv i bildövningar: öppet test. `npm run art:blind -- <ny mapp> pending`, en oberoende granskare skriver `answers_*.json`, sedan `npm run art:blind:record -- <mapp> "$(python3 tools/production/accept.py <mapp>)"`.
- **Symbolbilder** (`quiz: false`): matchningstest. `npm run art:blind -- <ny mapp> pending --match`; granskaren får ordet och glosan och väljer rätt bild bland modulens bilder (`{ "<ord>": { "pick": <nr>, "conf": "high" } }`), sedan samma `art:blind:record`.
- Äkta synonymer markeras med `tools/production/conf.py s.a.1 s.b.1`.
- **Högst två omgångar.** Klarar bilden inte den andra går ordet till **det manuella spåret**: planen får `status: "manual"`, och bilden görs om för hand med större frihet (egen ritning i stället för mallfigurer, animation, bildserie i två–tre rutor, kontrastpar, närbild) och testas med matchningstest. Lyckas inte heller det visas bilden för produktägaren med en rad om varför. Ett modulord publiceras aldrig utan bild. Tidigare förväxlingar: `quality/visual-manual-notes.md`.

## Dubbletter
Om `module()` stoppar med "DUBBLETT" äger den tidigare modulen i katalogordningen posten. Den senare refererar dess `senseId`, och dess egen bild för ordet stryks ur specen.
