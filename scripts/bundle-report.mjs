#!/usr/bin/env node
/**
 * Bundle size report and guard (kvalitetsplanen A4). Run after `npm run build`.
 *
 *   node scripts/bundle-report.mjs           print the largest chunks and the startup size
 *   node scripts/bundle-report.mjs --check   also fail if a chunk is larger than MAX_CHUNK_MB
 *
 * "Startup" = the files index.html loads directly plus their static imports (the eager graph).
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const MAX_CHUNK_MB = 5; // raw size of one JS chunk; the old single content chunk was 25 MB. module-index (≈3.6 MB) is the largest.
const dist = path.resolve('dist');
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const size = (f) => fs.statSync(path.join(dist, f)).size;
const gz = (f) => zlib.gzipSync(fs.readFileSync(path.join(dist, f))).length;
const entries = [...html.matchAll(/(?:src|href)="\.?\/?(assets\/[^"]+\.(?:js|css))"/g)].map((m) => m[1]);
const seen = new Set();
const walk = (f) => {
  if (seen.has(f) || !fs.existsSync(path.join(dist, f))) return;
  seen.add(f);
  if (!f.endsWith('.js')) return;
  const src = fs.readFileSync(path.join(dist, f), 'utf8');
  for (const m of src.matchAll(/(?:^|[;\s])import\s*(?:[^'"()]*?from\s*)?["']\.\/([^"']+\.js)["']/g)) walk(`assets/${m[1]}`);
};
entries.forEach(walk);
const all = fs.readdirSync(path.join(dist, 'assets')).filter((f) => f.endsWith('.js')).map((f) => `assets/${f}`);
const rows = all.map((f) => ({ f, raw: size(f) })).sort((a, b) => b.raw - a.raw);
console.log('Största filer (rå storlek):');
for (const r of rows.slice(0, 10)) console.log(`  ${(r.raw / 1e6).toFixed(2)} MB  ${r.f}`);
let sRaw = 0, sGz = 0;
for (const f of seen) { sRaw += size(f); sGz += gz(f); }
console.log(`Startpaket: ${seen.size} filer, ${(sRaw / 1e6).toFixed(1)} MB rått, ${(sGz / 1e6).toFixed(2)} MB gzip`);
if (process.argv.includes('--check')) {
  const big = rows.filter((r) => r.raw > MAX_CHUNK_MB * 1e6);
  if (big.length) {
    for (const r of big) console.error(`För stor fil: ${r.f} (${(r.raw / 1e6).toFixed(1)} MB > ${MAX_CHUNK_MB} MB). Dela upp den i vite.config.ts.`);
    process.exit(1);
  }
  console.log('Storleksspärren: OK.');
}
