/**
 * scenes:build – turn the scene definitions in scripts/scenes/*.scenes.ts into an export in the
 * same format as Animation_tool-'s `anim:export` (animations.index.json + anim/<id>.json), then
 * import it with `npm run visuals:import <out>` (0.13).
 *
 *   npm run scenes:build -- [--out dist/scenes] [--strips strips.html] [--only blinka,nysa]
 *
 * Every scene must parse with the player schema and compile without warnings.
 */
import fs from 'node:fs';
import path from 'node:path';
import { Scene, compileScene, renderFrame, frameToSvg } from '../../src/ui/anim/player';
import { build, type Def } from './kit';
import { KROPP } from './kropp.scenes';
import { KROPP2 } from './kropp2.scenes';

const argv = process.argv.slice(2);
const opt = (k: string) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : undefined);
const out = opt('--out') ?? 'dist/scenes';
const only = opt('--only')?.split(',');
// Swedish definition from the dictionary when a scene gives no hint
const defSv = new Map<string, string>();
for (const f of fs.readdirSync('src/content/data/dictionary')) for (const e of JSON.parse(fs.readFileSync(path.join('src/content/data/dictionary', f), 'utf8')).entries) for (const s of e.senses) defSv.set(s.id, s.defSv);
const defs: Def[] = [...KROPP, ...KROPP2].map((d) => (d.hint ? d : { ...d, hint: (defSv.get(d.sense) ?? '').slice(0, 200) })).filter((d) => !only || only.some((o) => d.sense === o || d.sense === `s.${o}.1`));

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'anim'), { recursive: true });
const index: { animations: Record<string, unknown>[] } = { animations: [] };
const errors: string[] = [];
const strips: string[] = [];
const seen = new Set<string>();
for (const d of defs) {
  if (seen.has(d.sense)) { errors.push(`${d.sense}: dubblett`); continue; }
  seen.add(d.sense);
  const parsed = Scene.safeParse(build(d));
  if (!parsed.success) { errors.push(`${d.sense}: ${parsed.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ')}`); continue; }
  const s = parsed.data;
  const c = compileScene(s);
  if (c.warnings.length) { errors.push(`${d.sense}: ${c.warnings.join('; ')}`); continue; }
  const file = `anim/${s.animationId}.json`;
  fs.writeFileSync(path.join(out, file), JSON.stringify(s));
  index.animations.push({ animationId: s.animationId, kind: 'word', senseId: s.senseId, file, group: d.group, quiz: d.quiz ?? false, confusableWith: d.confusable ?? [], reviewStatus: 'ai-draft' });
  if (opt('--strips')) {
    const ts = [0.15, 0.45, 0.75, 1].map((k) => Math.round(k * s.durationMs));
    strips.push(`<div class="r"><b>${s.titleSv}</b>${ts.map((t) => frameToSvg(renderFrame(c, t), { width: 96, clipPrefix: `${s.animationId}-${t}` })).join('')}<i>${d.feature}</i></div>`);
  }
}
fs.writeFileSync(path.join(out, 'animations.index.json'), JSON.stringify(index, null, 1));
if (opt('--strips')) fs.writeFileSync(opt('--strips')!, `<!doctype html><meta charset="utf-8"><style>body{font:11px system-ui;margin:6px;width:1010px;display:grid;grid-template-columns:1fr 1fr;gap:2px 10px}.r{display:flex;align-items:center;gap:3px}.r b{width:86px}.r i{display:none}</style>${strips.join('')}`);
console.log(`Skrev ${index.animations.length} scener till ${out}.`);
if (errors.length) { console.error(`${errors.length} fel:\n  ` + errors.join('\n  ')); process.exit(1); }
