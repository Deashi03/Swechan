/** Writes an HTML contact sheet of all illustrations (root areas, sub-areas and modules) for visual review. */
import fs from 'node:fs';
import { AREA_MOTIF, MODULE_MOTIF, ROOT_MOTIF } from '../../src/ui/art/motifs';
import { artFor } from '../../src/ui/art/Art';
import { renderArt } from '../../src/ui/art/render';
import { args } from './_shared';

const catalog = JSON.parse(fs.readFileSync('planning/catalog/swechan-catalog.v1.json', 'utf8')) as { categories: { catalogCategoryId: string; titleSv: string }[]; modules: { catalogId: string; titleSv: string }[] };
const title = (id: string) => catalog.categories.find((c) => c.catalogCategoryId === id)?.titleSv ?? catalog.modules.find((m) => m.catalogId === id)?.titleSv ?? id;
const ids = [...Object.keys(ROOT_MOTIF), ...Object.keys(AREA_MOTIF), ...Object.keys(MODULE_MOTIF)];
const cells = ids.map((id) => { const a = artFor(id)!; return `<figure>${renderArt(a.motif, a.hue)}<figcaption>${title(id)}</figcaption></figure>`; });
const out = args()[0] ?? 'art-sheet.html';
fs.writeFileSync(out, `<!doctype html><meta charset="utf-8"><style>
body{margin:0;padding:24px;background:#f6f7f9;font-family:system-ui,sans-serif;color:#14213d;width:960px}
.g{display:grid;grid-template-columns:repeat(6,1fr);gap:12px}figure{margin:0;background:#fff;border-radius:16px;padding:10px;text-align:center}
svg{width:96px;height:96px}figcaption{font-size:12px;font-weight:700;margin-top:4px}</style><div class="g">${cells.join('')}</div>`);
console.log(`Skrev ${ids.length} bilder till ${out}`);
