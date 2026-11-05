/** Writes an HTML contact sheet of all word illustrations for visual review: `npm run art:words [out.html]`. */
import fs from 'node:fs';
import { WORD_MOTIF_IDS } from '../../src/ui/wordArt/motifs';
import { renderWordArt } from '../../src/ui/wordArt/render';
import { args } from './_shared';

const out = args()[0] ?? 'word-art-sheet.html';
const cells = WORD_MOTIF_IDS.map((id) => `<figure>${renderWordArt(id)}<figcaption>${id}</figcaption></figure>`);
fs.writeFileSync(out, `<!doctype html><meta charset="utf-8"><style>
body{margin:0;padding:16px;background:#e9ecef;font-family:system-ui,sans-serif;color:#14213d;width:1000px}
.g{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}figure{margin:0;background:#fff;border-radius:14px;padding:8px;text-align:center}
svg{width:140px;height:140px}figcaption{font-size:13px;font-weight:700;margin-top:2px}</style><div class="g">${cells.join('')}</div>`);
console.log(`Skrev ${WORD_MOTIF_IDS.length} ordbilder till ${out}`);
