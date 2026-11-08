/**
 * Records the result of a blind test (see art-blind.ts) in wordVisuals.json (0.19.1).
 *
 *   npm run art:blind:record -- <dir> [s.a.1,s.b.1]
 *
 * Reads <dir>/key.json and the reviewers' <dir>/answers_*.json ({ m<order>: { <n>: { word, conf, saw, problem } } }).
 * A picture passes when the reviewer named its word with high confidence. Medium confidence passes only for
 * senses listed in the optional second argument (the author has read the reviewer's remark and accepts it).
 * When every other module word the reviewer names (as the answer or in the remark) is declared in
 * `confusableWith`, the result is `synonym` – allowed, because those words are never offered against each
 * other in picture exercises. A low-confidence wrong answer counts only if the remark says the picture's
 * own word fits equally well. Everything else fails,
 * and a failed picture loses any earlier record. The record stores a fingerprint of the tested picture.
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadAllMotifs, renderWordArt } from '../../src/ui/wordArt/render';
import { visualFingerprintSource, visualHash } from '../../src/content/blindTest';
import type { WordImage } from '../../src/content/images';

const R = 'src/content/data/';
const [dir, acceptArg = ''] = process.argv.slice(2);
if (!dir) throw new Error('usage: art:blind:record <dir> [acceptMediumIds]');
const accept = new Set(acceptArg.split(',').filter(Boolean));
const regFile = R + 'images/wordVisuals.json';
const reg = JSON.parse(fs.readFileSync(regFile, 'utf8')) as { images: (WordImage & { blindTest?: unknown })[] };
const faces = JSON.parse(fs.readFileSync(R + 'faces/faces.json', 'utf8')).faces as Record<string, unknown>;
const version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version as string;
const lemma = new Map<string, string>();
for (const f of fs.readdirSync(R + 'dictionary')) {
  const d = JSON.parse(fs.readFileSync(R + 'dictionary/' + f, 'utf8'));
  for (const e of (Array.isArray(d) ? d : d.entries ?? [])) for (const s of e.senses ?? []) lemma.set(s.id, e.lemma);
}
const norm = (s = '') => s.trim().toLowerCase();
const key = JSON.parse(fs.readFileSync(path.join(dir, 'key.json'), 'utf8')) as Record<string, Record<string, string>>;
const answers: Record<string, Record<string, { word?: string; conf?: string; problem?: string }>> = {};
for (const f of fs.readdirSync(dir).filter((x) => /^answers_.*\.json$/.test(x))) Object.assign(answers, JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));

// candidate words per sheet (the reviewer's list)
const moduleWords = new Map<string, Set<string>>();
for (const m of Object.keys(key)) {
  const f = path.join(dir, `${m}.txt`);
  if (fs.existsSync(f)) moduleWords.set(m, new Set(fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => norm(l.split(' — ')[0]))));
}
await loadAllMotifs();
const io = { renderMotif: renderWordArt, sceneFile: (f: string) => fs.readFileSync(`public/anim/scenes/${f}.json`, 'utf8'), faceScene: (s: string) => faces[s] };
const bySense = new Map(reg.images.map((i) => [i.senseId, i]));
const tally = { pass: 0, synonym: 0, fail: 0, unrated: 0 };
const fails: string[] = [];
for (const [m, map] of Object.entries(key)) {
  for (const [n, sid] of Object.entries(map)) {
    const img = bySense.get(sid)!;
    const a = answers[m]?.[n];
    if (!a) { tally.unrated++; continue; }
    const right = norm(a.word) === norm(lemma.get(sid));
    let result: 'pass' | 'synonym' | null = null;
    const conf = new Set((img.confusableWith ?? []).map((c) => norm(lemma.get(c))));
    // other module words the reviewer names as possible readings (in the remark or as the answer)
    const named = new Set([...(moduleWords.get(m) ?? [])].filter((w) => w !== norm(lemma.get(sid)) && (norm(a.problem).includes(w) || w === norm(a.word))));
    const onlyConfusables = [...named].every((w) => conf.has(w));
    if (right && (a.conf === 'high' || (a.conf === 'medium' && accept.has(sid)))) result = 'pass';
    // the only doubt is with words that are never offered against this picture: allowed
    // (a low-confidence wrong answer counts only when the reviewer says the picture's own word fits as well)
    else if (named.size > 0 && onlyConfusables && (right || a.conf !== 'low' || norm(a.problem).includes(norm(lemma.get(sid))))) result = 'synonym';
    if (result) {
      img.blindTest = { result, round: version, hash: visualHash(visualFingerprintSource(img, io) ?? '') };
      tally[result]++;
    } else {
      delete img.blindTest;
      tally.fail++;
      fails.push(`${sid}  → ${a.word ?? '–'} (${a.conf ?? '?'}) ${a.problem ?? ''}`);
    }
  }
}
fs.writeFileSync(regFile, JSON.stringify(reg, null, 1) + '\n');
console.log(`Godkända ${tally.pass}, synonym ${tally.synonym}, underkända ${tally.fail}, obesvarade ${tally.unrated}`);
for (const f of fails) console.log('  ✗ ' + f);
