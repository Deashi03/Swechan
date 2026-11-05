/** Writes an HTML contact sheet of every motif in every candidate style (0.5 style exploration). */
import fs from 'node:fs';
import { MODULE_MOTIF, ROOT_HUE, ROOT_MOTIF } from '../../src/ui/art/motifs';
import { ART_STYLES, ART_STYLE_LABEL, renderArt } from '../../src/ui/art/render';
import { args } from './_shared';

const catalog = JSON.parse(fs.readFileSync('planning/catalog/swechan-catalog.v1.json', 'utf8')) as { categories: { catalogCategoryId: string; titleSv: string }[]; modules: { catalogId: string; titleSv: string }[] };
const title = (id: string) => catalog.categories.find((c) => c.catalogCategoryId === id)?.titleSv ?? catalog.modules.find((m) => m.catalogId === id)?.titleSv ?? id;
const items = [
  ...Object.entries(ROOT_MOTIF).map(([id, motif]) => ({ id, motif, hue: ROOT_HUE[id]! })),
  ...Object.entries(MODULE_MOTIF).map(([id, motif]) => ({ id, motif, hue: ROOT_HUE.R01! })),
];
const out = args()[0] ?? 'art-sheet';
fs.mkdirSync(out, { recursive: true });
for (const st of ART_STYLES) {
  const cells = items.map((it) => `<figure>${renderArt(it.motif, st, it.hue)}<figcaption>${title(it.id)}</figcaption></figure>`);
  fs.writeFileSync(`${out}/${st}.html`, `<!doctype html><meta charset="utf-8"><style>
body{margin:0;padding:28px;background:#f6f7f9;font-family:Manrope,system-ui,sans-serif;color:#14213d;width:744px}
h1{font-size:28px;margin:0 0 4px}h2{font-size:15px;color:#667;margin:22px 0 10px;text-transform:uppercase;letter-spacing:.05em}
.g{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}figure{margin:0;background:#fff;border-radius:18px;padding:14px;text-align:center;box-shadow:0 1px 2px #0001}
svg{width:132px;height:132px}figcaption{font-size:13px;font-weight:700;margin-top:6px;line-height:1.25}</style>
<h1>Stil ${ART_STYLE_LABEL[st]}</h1><h2>Överkategorier</h2><div class="g">${cells.slice(0, 8).join('')}</div>
<h2>Moduler · Matlagningens verb</h2><div class="g">${cells.slice(8).join('')}</div>`);
}
console.log(`Skrev ${ART_STYLES.length} stilark i ${out}/`);
