/**
 * faces:build (0.14) – validate the face scenes in scripts/faces/*.faces.ts, write
 * src/content/data/faces/faces.json and register each sense as `kind: "face"` in wordVisuals.json
 * (a previous illustration is kept as `fallbackMotif`). The plan row is marked `by: manual`.
 *
 *   npm run faces:build [-- --strips faces.html] [--only snegla,stirra]
 */
import fs from 'node:fs';
import { FaceSceneSchema } from '../../src/content/faces';
import { faceSvg } from '../../src/ui/face/rig';
import { KROPP_FACES } from './kropp.faces';

const argv = process.argv.slice(2);
const opt = (k: string) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : undefined);
const only = opt('--only')?.split(',');
const all = [...KROPP_FACES];
const errors: string[] = [];
const seen = new Set<string>();
for (const d of all) {
  if (seen.has(d.sense)) errors.push(`${d.sense}: dubblett`);
  seen.add(d.sense);
  const r = FaceSceneSchema.safeParse(d.scene);
  if (!r.success) errors.push(`${d.sense}: ${r.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ')}`);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }

if (opt('--strips')) {
  const rows = all.filter((d) => !only || only.some((o) => d.sense === `s.${o}.1` || d.sense === o)).map((d, i) => {
    const s = d.scene, ts = [0.2, 0.45, 0.7].map((k) => Math.round(k * s.durationMs)).concat([s.posterMs]);
    return `<div class="r"><b>${d.sense.slice(2, -2)}</b>${ts.map((t, j) => faceSvg(s, t, `s${i}x${j}`).replace('<svg ', '<svg width="112" height="112" ')).join('')}</div>`;
  });
  fs.writeFileSync(opt('--strips')!, `<!doctype html><meta charset="utf-8"><style>body{font:11px system-ui;margin:6px;width:1010px;display:grid;grid-template-columns:1fr 1fr;gap:4px 10px}.r{display:flex;align-items:center;gap:3px}.r b{width:84px}</style>${rows.join('')}`);
  console.log(`Remsor: ${opt('--strips')}`);
}

const faces: Record<string, unknown> = {};
for (const d of [...all].sort((a, b) => a.sense.localeCompare(b.sense, 'sv'))) faces[d.sense] = d.scene;
const facesPath = 'src/content/data/faces/faces.json';
const prevFaces = JSON.parse(fs.readFileSync(facesPath, 'utf8'));
fs.writeFileSync(facesPath, JSON.stringify({ _comment: prevFaces._comment, faces }) + '\n');

const regPath = 'src/content/data/images/wordVisuals.json';
const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
const idx = new Map<string, number>(reg.images.map((i: { senseId: string }, n: number) => [i.senseId, n]));
for (const d of all) {
  const n = idx.get(d.sense), prev = n === undefined ? undefined : reg.images[n];
  const fallbackMotif = prev?.kind === 'illustration' ? prev.motif : prev?.fallbackMotif;
  const entry = { senseId: d.sense, kind: 'face', group: d.group, quiz: d.quiz ?? false, ...(d.confusable?.length ? { confusableWith: d.confusable } : {}), reviewStatus: 'ai-draft', ...(fallbackMotif ? { fallbackMotif } : {}) };
  if (n === undefined) reg.images.push(entry); else reg.images[n] = entry;
}
fs.writeFileSync(regPath, JSON.stringify(reg, null, 1) + '\n');

const planPath = 'src/content/data/images/visualPlan.json';
const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
for (const d of all) plan.plan[d.sense] = { kind: plan.plan[d.sense]?.kind ?? 'animation', by: 'manual' };
fs.writeFileSync(planPath, JSON.stringify(plan, null, 0).replace(/\},"/g, '},\n"').replace('{"_comment"', '{\n"_comment"') + '\n');
console.log(`Skrev ${all.length} ansiktsscener.`);
