# anim – spelarpaket från Animation_tool-

Kopiera hela denna mapp till Swechan som `src/ui/anim/`. Beroenden: React 19 och Zod 3 (båda finns i Swechan). Ingen Swechan-specifik kod här.

- `player/index.ts` – `ScenePlayer`, `ScenePoster`, `useReducedMotion`, `compileScene`, `renderFrame`, `frameToSvg`, `Scene`, `migrateScene`.
- `WordVisual.tsx` – referenskoppling senseId → register → animation eller befintlig bild.
- Allt annat är motorn: `schema/`, `engine/`, `assets/`, `motions/`, `actions/`, `compiler/compile.ts`.

Animationerna själva kommer från `npm run anim:export` (`animations.index.json` + `anim/<id>.json` + `poster/<id>.svg`). Se `docs/SWECHAN_INTEGRATION.md` i Animation_tool- för stegen.
