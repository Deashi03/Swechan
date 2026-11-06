#!/usr/bin/env node
/**
 * Import an animation export from Animation_tool- (`npm run anim:export` → dist/swechan/)
 * into Swechan (0.12).
 *
 *   node scripts/visuals-import.mjs <path-to-dist/swechan> [--status ai-draft|validated]
 *
 * - Copies anim/<id>.json → public/anim/scenes/<file>.json with ASCII-safe file names (å/ä/ö folded).
 *   Poster SVGs are not copied: the poster frame is rendered from the scene (ScenePoster), which is
 *   ~5× smaller than shipping a poster file per word.
 * - Writes one `animation` entry per sense into src/content/data/images/wordVisuals.json.
 *   An existing illustration for the same sense is kept as `fallbackMotif`.
 * - Animations for senses that are not dictionary entries (core words) and UI scenes are skipped
 *   and listed.
 * - Never changes a senseId or a motif id. Re-running is idempotent.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const src = args.find((a) => !a.startsWith('--'));
const minStatus = args.includes('--status') ? args[args.indexOf('--status') + 1] : 'ai-draft';
if (!src) { console.error('usage: node scripts/visuals-import.mjs <dist/swechan> [--status ai-draft|validated]'); process.exit(1); }
const ROOT = resolve(new URL('..', import.meta.url).pathname);
const index = JSON.parse(readFileSync(join(src, 'animations.index.json'), 'utf8'));
const RANK = { 'ai-draft': 0, validated: 1, reviewed: 2 };

// senses that exist in the dictionary
const senses = new Set();
const dictDir = join(ROOT, 'src/content/data/dictionary');
for (const f of readdirSync(dictDir)) for (const e of JSON.parse(readFileSync(join(dictDir, f), 'utf8')).entries) for (const s of e.senses) senses.add(s.id);

export function safeName(id) {
  return id.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9.-]+/g, '-').replace(/^-+|-+$/g, '');
}

const regPath = join(ROOT, 'src/content/data/images/wordVisuals.json');
const reg = JSON.parse(readFileSync(regPath, 'utf8'));
const bySense = new Map(reg.images.map((i) => [i.senseId, i]));
mkdirSync(join(ROOT, 'public/anim/scenes'), { recursive: true });

// confusableWith: keep only senses that exist in Swechan (the tool also knows core words)
function confusable(a, prev) {
  const list = [...new Set([...(a.confusableWith ?? []), ...(prev?.confusableWith ?? [])])].filter((s) => senses.has(s) && s !== a.senseId);
  return list.length ? { confusableWith: list } : {};
}
// one animation per sense: the best review status wins, then the last in the export (newer versions come later)
const best = new Map();
for (const a of index.animations) {
  if (a.kind !== 'word' || !a.senseId) continue;
  const cur = best.get(a.senseId);
  if (!cur || (RANK[a.reviewStatus] ?? -1) >= (RANK[cur.reviewStatus] ?? -1)) best.set(a.senseId, a);
}
const used = new Map(); let imported = 0; const skipped = [];
for (const a of index.animations) {
  if (a.kind === 'word' && a.senseId && best.get(a.senseId) !== a) { skipped.push(`${a.animationId} (ersatt av ${best.get(a.senseId).animationId})`); continue; }
  if (a.kind !== 'word' || !a.senseId) { skipped.push(`${a.animationId} (ui)`); continue; }
  if (!senses.has(a.senseId)) { skipped.push(`${a.animationId} (${a.senseId} finns inte i ordboken)`); continue; }
  if ((RANK[a.reviewStatus] ?? -1) < (RANK[minStatus] ?? 0)) { skipped.push(`${a.animationId} (${a.reviewStatus})`); continue; }
  let name = safeName(a.animationId);
  if (used.has(name) && used.get(name) !== a.animationId) { let n = 2; while (used.has(`${name}-${n}`)) n++; name = `${name}-${n}`; }
  used.set(name, a.animationId);
  copyFileSync(join(src, a.file), join(ROOT, 'public/anim/scenes', `${name}.json`));
  const prev = bySense.get(a.senseId);
  const entry = {
    senseId: a.senseId, kind: 'animation', animationId: a.animationId, file: name,
    group: a.group || prev?.group || 'övrigt', quiz: !!a.quiz,
    ...confusable(a, prev),
    reviewStatus: a.reviewStatus,
    ...(prev?.kind === 'illustration' ? { fallbackMotif: prev.motif } : prev?.fallbackMotif ? { fallbackMotif: prev.fallbackMotif } : {}),
  };
  bySense.set(a.senseId, entry); imported++;
}
// remove scene files that no animation entry references any more
const keep = new Set([...bySense.values()].filter((i) => i.kind === 'animation').map((i) => `${i.file}.json`));
for (const f of readdirSync(join(ROOT, 'public/anim/scenes'))) if (!keep.has(f)) { unlinkSync(join(ROOT, 'public/anim/scenes', f)); skipped.push(`${f} (borttagen, inte refererad)`); }
reg.images = [...bySense.values()].sort((x, y) => x.senseId.localeCompare(y.senseId, 'sv'));
writeFileSync(regPath, JSON.stringify(reg, null, 1) + '\n');
console.log(`Importerade ${imported} animationer. Hoppade över ${skipped.length}:`);
for (const s of skipped) console.log('  - ' + s);
