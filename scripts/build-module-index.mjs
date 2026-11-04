#!/usr/bin/env node
/**
 * Generates src/content/data/moduleIndex.json – the lightweight, eagerly
 * loaded module index (everything except the lesson body: reading text and
 * conversation). Lesson bodies stay in src/content/data/modules/*.json and are
 * lazy-loaded per module. Authoring still happens in ONE file per module.
 *
 *   npm run content:index          (re-generate)
 *   npm run content:index -- --check  (fail if the index is out of date; used in tests/CI)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'src/content/data/modules');
const out = path.join(root, 'src/content/data/moduleIndex.json');

export function buildIndex() {
  const modules = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort().map((f) => {
    const m = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const { reading, conversation, ...meta } = m;
    void reading; void conversation;
    return { ...meta, bodyFile: f };
  });
  modules.sort((a, b) => a.recommendedOrder - b.recommendedOrder || a.id.localeCompare(b.id));
  return { _comment: 'GENERERAD FIL – redigera inte. Kör `npm run content:index` efter ändringar i src/content/data/modules/*.json.', modules };
}

const text = JSON.stringify(buildIndex(), null, 1) + '\n';
if (process.argv.includes('--check')) {
  const current = fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : '';
  if (current !== text) { console.error('moduleIndex.json är inaktuell – kör `npm run content:index`.'); process.exit(1); }
  console.log('moduleIndex.json är aktuell.');
} else {
  fs.writeFileSync(out, text);
  console.log(`Skrev ${path.relative(root, out)} (${JSON.parse(text).modules.length} moduler).`);
}
