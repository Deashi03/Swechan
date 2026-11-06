#!/usr/bin/env node
/**
 * Visual plan (0.12): which kind of visual every sense should get.
 *
 *   node scripts/visuals-plan.mjs          – add missing senses (never changes existing rows)
 *   node scripts/visuals-plan.mjs --stats  – print counts only
 *   node scripts/visuals-plan.mjs --recompute – also re-classify rows that are still `by: heuristic`
 *
 * Kinds (see docs in DATA_MODEL.md):
 *   animation – actions and processes (verbs, verb phrases): moving scene, poster frame in quizzes
 *   scene     – concrete things (nouns, some adjectives): still or lightly moving scene, quiz-eligible
 *   symbol    – abstractions, feelings, properties, idioms: symbolic scene + Japanese gloss, never quiz
 *   none      – function words where a picture would mislead
 * Rows written here are `by: "heuristic"` (AI draft). Correct a row by hand and set `by: "manual"`;
 * the production pipeline (Animation_tool-) reads the plan per module.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const planPath = join(ROOT, 'src/content/data/images/visualPlan.json');
const plan = existsSync(planPath) ? JSON.parse(readFileSync(planPath, 'utf8')) : { _comment: '', plan: {} };
plan._comment = 'Visualiseringsplan (0.12): vilken sorts bild varje betydelse ska få. kind: animation (handling/process), scene (konkret sak), symbol (abstrakt ord, känsla, egenskap eller idiom – symbolisk scen med japansk glosa, aldrig i bildövningar), none (funktionsord). by: heuristic (AI-utkast från scripts/visuals-plan.mjs) eller manual (granskad). Ändra aldrig senseId. Se DATA_MODEL.md.';

// which catalog area a dictionary file belongs to (module slug → categoryId)
const index = JSON.parse(readFileSync(join(ROOT, 'src/content/data/moduleIndex.json'), 'utf8'));
const areaBySlug = new Map(index.modules.map((m) => [m.id.slice(2), m.categoryId]));
const visuals = JSON.parse(readFileSync(join(ROOT, 'src/content/data/images/wordVisuals.json'), 'utf8')).images;
const visualBySense = new Map(visuals.map((v) => [v.senseId, v]));

const ABSTRACT_AREAS = ['R02-A03']; // Känslor & psykologi
const ABSTRACT_SUFFIX = /(het|else|ism|tion|sion|skap|ande|ende|dom|nad|itet|ans|ens|eri)$/;
const CONCRETE_HET = new Set(['lägenhet', 'enhet', 'sevärdhet', 'nyhet', 'helhet', 'tillgänglighet']);

function sceneTemplate(v) {
  try { return JSON.parse(readFileSync(join(ROOT, 'public/anim/scenes', `${v.file}.json`), 'utf8')).template ?? ''; } catch { return ''; }
}
function classify(entry, sense, area) {
  const v = visualBySense.get(sense.id);
  if (v?.kind === 'animation') {
    if (/^(attribute-gloss|relation-arrow|property-contrast)/.test(sceneTemplate(v))) return 'symbol';
    return entry.pos === 'verb' || entry.inflection?.kind === 'verb' ? 'animation' : 'scene';
  }
  if (v) return v.symbol ? 'symbol' : 'scene';
  const abstractArea = ABSTRACT_AREAS.some((a) => area?.startsWith(a));
  const lemma = entry.lemma.toLowerCase();
  switch (entry.pos) {
    // multiword verbs in abstract areas are idioms (acceptera sig själv, gå i taket): symbolic scene
    case 'verb': return abstractArea && lemma.includes(' ') ? 'symbol' : 'animation';
    case 'phrase': return entry.inflection?.kind === 'verb' && !abstractArea ? 'animation' : 'symbol';
    case 'noun': {
      if (abstractArea) return 'symbol';
      if (ABSTRACT_SUFFIX.test(lemma) && !CONCRETE_HET.has(lemma)) return 'symbol';
      return 'scene';
    }
    case 'adjective': case 'adverb': case 'preposition': return 'symbol';
    default: return 'none';
  }
}

const stats = process.argv.includes('--stats');
const recompute = process.argv.includes('--recompute'); // re-run the heuristic for rows that are still `heuristic`
let added = 0;
const dictDir = join(ROOT, 'src/content/data/dictionary');
for (const f of readdirSync(dictDir).sort()) {
  const area = f.startsWith('m-') ? areaBySlug.get(f.slice(2, -5)) : undefined;
  for (const e of JSON.parse(readFileSync(join(dictDir, f), 'utf8')).entries) {
    for (const s of e.senses) {
      if (plan.plan[s.id] && !(recompute && plan.plan[s.id].by === 'heuristic')) continue;
      plan.plan[s.id] = { kind: classify(e, s, area), by: 'heuristic' };
      added++;
    }
  }
}
const counts = {};
for (const r of Object.values(plan.plan)) counts[r.kind] = (counts[r.kind] ?? 0) + 1;
if (!stats) {
  plan.plan = Object.fromEntries(Object.entries(plan.plan).sort(([a], [b]) => a.localeCompare(b, 'sv')));
  writeFileSync(planPath, JSON.stringify(plan, null, 0).replace(/\},"/g, '},\n"').replace('{"_comment"', '{\n"_comment"') + '\n');
  console.log(`La till ${added} betydelser.`);
}
console.log('Plan:', counts, 'totalt', Object.values(counts).reduce((a, b) => a + b, 0));
