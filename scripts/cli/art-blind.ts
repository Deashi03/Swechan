/**
 * Blind test sheets for word visuals (0.19.1). A reviewer who has not drawn the pictures sees only
 * numbered pictures and the module's word list (Swedish + Japanese gloss) and must say which word each
 * picture shows. A picture passes only when the reviewer picks the right word with high confidence.
 *
 *   npm run art:blind -- <outDir> risk            illustrations of adjectives/symbols + adjective animations
 *   npm run art:blind -- <outDir> modules 301-342 every visual in modules with recommendedOrder 301–342
 *   npm run art:blind -- <outDir> senses s.a.1,s.b.1
 *   npm run art:blind -- <outDir> pending          every symbol/adjective visual without a valid blind test record
 *
 * Record the reviewers' answers afterwards with `npm run art:blind:record -- <outDir>`.
 *
 * Writes <outDir>/m<order>.png (pictures, no labels), m<order>.txt (candidate words) and key.json (answers –
 * never show it to the reviewer). Animations and faces are shown as three frames (start, middle, poster).
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { loadAllMotifs, renderWordArt } from '../../src/ui/wordArt/render';
import { Scene, migrateScene, compileScene, renderFrame, frameToSvg } from '../../src/ui/anim/player';
import { faceSvg } from '../../src/ui/face/rig';
import { needsBlindTest, visualFingerprintSource, visualHash } from '../../src/content/blindTest';
import type { WordImage } from '../../src/content/images';

const R = 'src/content/data/';
type Img = { senseId: string; kind: string; motif?: string; fallbackMotif?: string; file?: string; symbol?: boolean; blindTest?: { hash: string } };
const reg = JSON.parse(fs.readFileSync(R + 'images/wordVisuals.json', 'utf8')).images as Img[];
const faces = JSON.parse(fs.readFileSync(R + 'faces/faces.json', 'utf8')).faces as Record<string, { durationMs: number; posterMs: number }>;
const senses = new Map<string, { lemma: string; ja: string; pos: string }>();
for (const f of fs.readdirSync(R + 'dictionary')) {
  const d = JSON.parse(fs.readFileSync(R + 'dictionary/' + f, 'utf8'));
  for (const e of (Array.isArray(d) ? d : d.entries ?? [])) for (const s of e.senses ?? []) senses.set(s.id, { lemma: e.lemma, ja: String(s.ja).replace(/\{([^|}]+)\|[^}]+\}/g, '$1'), pos: e.pos });
}
const modules = fs.readdirSync(R + 'modules').map((f) => JSON.parse(fs.readFileSync(R + 'modules/' + f, 'utf8')) as { id: string; recommendedOrder: number; words: { senseId: string }[] });
const moduleOf = new Map<string, (typeof modules)[number]>();
for (const m of modules) for (const w of m.words) moduleOf.set(w.senseId, m);

const [outDir, mode = 'risk', arg = ''] = process.argv.slice(2);
if (!outDir) throw new Error('usage: art:blind <outDir> risk|modules A-B|senses ids|pending');
let pick: Img[];
if (mode === 'modules') { const [a, b] = arg.split('-').map(Number); pick = reg.filter((i) => { const m = moduleOf.get(i.senseId); return m && m.recommendedOrder >= a! && m.recommendedOrder <= (b ?? a)!; }); }
else if (mode === 'senses') { const ids = new Set(arg.split(',')); pick = reg.filter((i) => ids.has(i.senseId)); }
else if (mode === 'pending') {
  await loadAllMotifs();
  const io = { renderMotif: renderWordArt, sceneFile: (f: string) => fs.readFileSync(`public/anim/scenes/${f}.json`, 'utf8'), faceScene: (s: string) => faces[s] };
  pick = reg.filter((i) => needsBlindTest(i as unknown as WordImage, senses.get(i.senseId)?.pos, moduleOf.has(i.senseId)) && i.blindTest?.hash !== visualHash(visualFingerprintSource(i as unknown as WordImage, io) ?? ''));
}
else pick = reg.filter((i) => i.symbol || senses.get(i.senseId)?.pos === 'adjective');
pick = pick.filter((i) => i.kind !== 'photo' && moduleOf.has(i.senseId));

const require = createRequire(import.meta.url);
let pw: { chromium: { launch: () => Promise<any> } };
try { pw = require('playwright'); } catch { pw = require(`${process.env.NODE_PATH ?? '/opt/node22/lib/node_modules'}/playwright`); }
const { chromium } = pw;
await loadAllMotifs();
const cellSvg = (i: Img): string => {
  if (i.kind === 'illustration') return renderWordArt(i.motif!) ?? '';
  if (i.kind === 'animation') {
    const sc = compileScene(Scene.parse(migrateScene(JSON.parse(fs.readFileSync(path.join('public/anim/scenes', `${i.file}.json`), 'utf8')))));
    return [0, sc.posterMs / 2, sc.posterMs].map((t) => frameToSvg(renderFrame(sc, t))).join('');
  }
  const f = faces[i.senseId]!;
  return [0, f.posterMs / 2, f.posterMs].map((t, k) => faceSvg(f as never, t, `b${k}`)).join('');
};
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const byModule = new Map<number, Img[]>();
for (const i of pick) { const o = moduleOf.get(i.senseId)!.recommendedOrder; byModule.set(o, [...(byModule.get(o) ?? []), i]); }
fs.mkdirSync(outDir, { recursive: true });
const key: Record<string, Record<number, string>> = {};
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
for (const [order, imgs] of [...byModule].sort((a, b) => a[0] - b[0])) {
  const shuffled = [...imgs].sort(() => rnd() - 0.5);
  key[`m${order}`] = Object.fromEntries(shuffled.map((i, n) => [n + 1, i.senseId]));
  const cells = shuffled.map((i, n) => `<figure class="${i.kind === 'illustration' ? '' : 'wide'}"><b>${n + 1}</b><div>${cellSvg(i)}</div></figure>`).join('');
  fs.writeFileSync(path.join(outDir, `m${order}.html`), `<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:10px;background:#fff;width:980px;font:700 18px system-ui}.g{display:flex;flex-wrap:wrap;gap:10px}figure{margin:0;width:230px;text-align:center}figure.wide{width:470px}figure div{display:flex;gap:4px}svg{width:220px;height:220px}figure.wide svg{width:150px;height:150px}</style><div class="g">${cells}</div>`);
  await page.goto('file://' + path.resolve(outDir, `m${order}.html`));
  await page.screenshot({ path: path.join(outDir, `m${order}.png`), fullPage: true });
  const m = modules.find((x) => x.recommendedOrder === order)!;
  const words = m.words.map((w) => senses.get(w.senseId)).filter(Boolean).map((s) => `${s!.lemma} — ${s!.ja}`).sort((a, b) => a.localeCompare(b, 'sv'));
  fs.writeFileSync(path.join(outDir, `m${order}.txt`), words.join('\n') + '\n');
}
await browser.close();
fs.writeFileSync(path.join(outDir, 'key.json'), JSON.stringify(key, null, 1));
console.log(`Skrev ${byModule.size} blindark (${pick.length} bilder) till ${outDir}`);
