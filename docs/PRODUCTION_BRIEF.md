# Produktionsinstruktion: moduler och ordbilder

För agenter som skriver en ämnesgrupp (sju moduler). Läs bara den här filen, exemplet och din grupps filer.

## Arbetsgång
1. Synka arbetskopian med integrationsgrenen. Skriv aldrig i integratörens träd.
2. Skriv ett skript per modul som `tools/production/examples/r1252_forandring.py` (DSL: `tools/production/dsl.py`) och kör det med `SWECHAN_REPO=<arbetskopia> python3 <skript>`.
   - Den första modulen har förkunskapen `prev('<föregående>')`, resten den förra modulen.
   - Varje modul har 15–20 målord. Spara ord som passar en annan katalogtitel bättre.
3. Kör `python3 tools/production/exists.py ord1 ord_två` innan du skapar en post.
   - Finns betydelsen: referera dess `senseId`.
   - Ny betydelse på en befintlig post: `add_sense`, och `set_label` på den gamla.
4. Kör `tools/production/check.sh m.<slug>` och rätta varje `VOC`-rad och varje valideringsfel.
5. Kör `npm run typecheck && npm run validate:content && npx vitest run`. Bara blindtestet får fallera.
6. Rapportera:
   - skripten i ordning
   - nya poster och återanvända `senseId`
   - symboler
   - ändrade filer utanför gruppen
   - språkliga osäkerheter

## Språk
- Följ SAOL/SO.
- B2-ord och svårare får `expl=(sv, ja)`.
- Furigana `{漢字|かんじ}` på varje kanji, med rätt läsning i sammanhanget.
- Flerordsuttryck är egna poster.
- Skriv rak ordföljd och dela inte partikelverb.

## Bilder (alla nya ord)
- **Fil:** `src/ui/wordArt/<fil>.ts` exporterar `<EXPORT>`. Nyckeln är `'<prefix>.<sensenyckel>'` (`.2` för betydelse 2). Lägg till en rad i `GROUPS` i `render.ts`. Hjälpfunktioner står ovanför objektet. Bildytan är 120×120 med marken på y=112.
- **Konkret ord:** en tydlig scen. `quiz: true` bara om bilden är entydig.
- **Abstrakt ord:** en symbolisk minischen med `symbol: true` och `quiz: false`. Egenskapen ska dominera bilden, med en grå referens som kontrast.
- **Aldrig:**
  - text som avslöjar ordet
  - varumärken
  - västerländska metaforer
  - pekfinger (använd `thumb()`/`palm()`)
- **Figurer:**
  - Armarna börjar vid axeln.
  - Pratbubblor står bredvid huvudet.
  - Inget skärs av i kanten.
  - Flytta en figur med `g('translate(…)', …)`, aldrig med `.replace()`.
- **Registrera:**
  1. `npm run visuals:plan`
  2. `python3 tools/production/specgen.py <fil>.ts <prefix> <spec.json> 'grupp;…' 'ejquiz,…' 'nyckel=senseId'`
  3. Sätt `symbol`, `quiz`, `plan` och `confusableWith` (bara äkta synonymer).
  4. `python3 tools/production/vis.py <spec.json>`, en gång per grupp. En ny körning raderar blindtesten.
- **Granska:**
  1. `npx vite-node tools/production/wsheet.ts <fil>.ts <EXPORT> ark.html 0 40`
  2. `node tools/production/snap.cjs ark.html ark.png`
  3. Förstår eleven ordet av bara bilden och den japanska glosan?

## Blindtest (integratören)
1. `npm run art:blind -- <ny mapp> pending`
2. Låt en oberoende granskare skriva `answers_*.json`.
3. `npm run art:blind:record -- <mapp> "$(python3 tools/production/accept.py <mapp>)"`

Äkta synonymer markeras med `tools/production/conf.py s.a.1 s.b.1`. En bild får högst två omgångar. Klarar den inte den andra får ordet planstatus `none` och listas som saknad bild i `PROJECT_STATUS.md`.

## Dubbletter
Om `module()` stoppar med "DUBBLETT" äger den tidigare modulen i katalogordningen posten. Den senare refererar dess `senseId`, och dess egen bild för ordet stryks ur specen.
