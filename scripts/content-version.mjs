#!/usr/bin/env node
/**
 * Automatisk contentVersion/updatedAt (kvalitetsplanen, etapp A2).
 *
 * En moduls innehåll = modulfilen (utom contentVersion och updatedAt) + varje modulords ordpost
 * (postens fält och betydelsen). Ändras något av det – också en ordpost som delas med en annan
 * modul – höjs contentVersion med 1 och updatedAt sätts till dagens datum.
 *
 *   npm run content:version            höj versionen för ändrade moduler och bygg om modulindexet
 *   npm run content:version -- --check fallera om en modul ändrats utan att versionen höjts (CI)
 *
 * Fingeravtrycken sparas i quality/content-hashes.json. Redigera aldrig contentVersion för hand.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = process.env.SWECHAN_REPO ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const D = path.join(root, 'src/content/data');
const store = path.join(root, 'quality/content-hashes.json');
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

/** Stable JSON: keys sorted, so formatting and key order never count as a change. */
function stable(v) {
  if (Array.isArray(v)) return `[${v.map(stable).join(',')}]`;
  if (v && typeof v === 'object') return `{${Object.keys(v).sort().filter((k) => !k.startsWith('_')).map((k) => `${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`;
  return JSON.stringify(v);
}

export function moduleHashes() {
  const senses = new Map();
  for (const f of fs.readdirSync(path.join(D, 'dictionary')).filter((x) => x.endsWith('.json'))) {
    for (const e of readJson(path.join(D, 'dictionary', f)).entries ?? []) {
      const { senses: ss, ...meta } = e;
      for (const s of ss) senses.set(s.id, stable({ entry: meta, sense: s }));
    }
  }
  const out = {};
  for (const f of fs.readdirSync(path.join(D, 'modules')).filter((x) => x.endsWith('.json')).sort()) {
    const m = readJson(path.join(D, 'modules', f));
    const { contentVersion, updatedAt, ...rest } = m;
    void updatedAt;
    const h = crypto.createHash('sha256');
    h.update(stable(rest));
    for (const w of m.words) h.update(senses.get(w.senseId) ?? `missing:${w.senseId}`);
    out[m.id] = { file: f, hash: h.digest('hex').slice(0, 16), contentVersion };
  }
  return out;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const now = moduleHashes();
  const prev = fs.existsSync(store) ? readJson(store).modules : {};
  const changed = Object.entries(now).filter(([id, x]) => prev[id] && prev[id].hash !== x.hash);
  const fresh = Object.keys(now).filter((id) => !prev[id]);
  if (process.argv.includes('--check')) {
    const stale = changed.filter(([id, x]) => x.contentVersion <= prev[id].contentVersion);
    const unknown = fresh;
    if (stale.length || unknown.length || changed.length) {
      for (const [id] of stale) console.error(`${id}: innehållet har ändrats men contentVersion är inte höjd`);
      for (const id of unknown) console.error(`${id}: saknas i quality/content-hashes.json`);
      if (!stale.length && !unknown.length) console.error('Fingeravtrycken är inaktuella.');
      console.error('Kör `npm run content:version` och checka in ändringarna.');
      process.exit(1);
    }
    console.log(`content-hashes.json är aktuell (${Object.keys(now).length} moduler).`);
    process.exit(0);
  }
  const today = process.env.SWECHAN_TODAY ?? new Date().toISOString().slice(0, 10);
  let bumped = 0;
  for (const [id, x] of changed) {
    if (x.contentVersion > prev[id].contentVersion) continue; // already raised by hand
    const p = path.join(D, 'modules', x.file);
    const t = fs.readFileSync(p, 'utf8');
    const next = prev[id].contentVersion + 1;
    const t2 = t.replace(/"contentVersion": \d+/, `"contentVersion": ${next}`).replace(/"updatedAt": "[^"]*"/, `"updatedAt": "${today}"`);
    fs.writeFileSync(p, t2);
    bumped++;
  }
  if (bumped) execFileSync('node', [path.join(root, 'scripts/build-module-index.mjs')], { stdio: 'inherit' });
  const final = moduleHashes();
  const out = { _comment: 'Fingeravtryck för automatisk contentVersion. Skrivs av `npm run content:version`. Redigera inte för hand.', modules: Object.fromEntries(Object.entries(final).sort().map(([id, x]) => [id, { hash: x.hash, contentVersion: x.contentVersion }])) };
  fs.mkdirSync(path.dirname(store), { recursive: true });
  fs.writeFileSync(store, JSON.stringify(out, null, 0).replace(/},"/g, '},\n"') + '\n');
  console.log(`${bumped} moduler fick ny contentVersion; ${fresh.length} nya moduler registrerade.`);
}
