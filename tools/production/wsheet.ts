// Contact sheet for a word-art motif file in any worktree.
// usage (run from the worktree root): npx vite-node <scratch>/agent/wsheet.ts <file.ts> <EXPORT> <out.html> [from] [n]
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const { scene } = await import(path.join(root, 'src/ui/wordArt/kit.ts'));
const [file, exp, out, from = '0', n = '40'] = process.argv.slice(2);
const mod = await import(path.join(root, 'src/ui/wordArt', file!));
const entries = Object.entries(mod[exp!] as Record<string, string>).slice(+from, +from + +n);
fs.writeFileSync(out!, `<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:10px;background:#fff;width:1000px}.g{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}figure{margin:0;text-align:center}svg{width:190px;height:190px}figcaption{font:700 11px system-ui}</style><div class="g">${entries.map(([k, b]) => `<figure>${scene(b)}<figcaption>${k}</figcaption></figure>`).join('')}</div>`);
console.log(entries.length);
