/** npm run module:validate -- <m.id | content/drafts/x.json> */
import fs from 'node:fs';
import { validateDraft } from '../../src/content/tools/drafts';
import { checkModule } from '../../src/content/tools/moduleCheck';
import { args, loadAll } from './_shared';

const [target] = args();
if (!target) { console.error('Användning: npm run module:validate -- <m.modul-id | sökväg till utkast>'); process.exit(1); }
const { repo, catalog, core } = loadAll();
if (target.endsWith('.json')) {
  const issues = validateDraft(JSON.parse(fs.readFileSync(target, 'utf8')), catalog, repo);
  for (const i of issues) console.log(`${i.level === 'error' ? 'FEL ' : 'ATT GÖRA'}: ${i.message}`);
  const errors = issues.filter((i) => i.level === 'error').length;
  console.log(errors ? `\n${errors} fel.` : issues.length ? '\nUtkastet är giltigt men inte färdigt.' : '\nUtkastet är komplett.');
  process.exit(errors ? 1 : 0);
}
const r = checkModule(target, repo, core, catalog);
for (const e of r.errors) console.error(`- ${e}`);
console.log(r.errors.length ? `\n${r.errors.length} problem i ${target}.` : `${target}: OK (schema, referenser, furigana, böjning, målord i texten, frågor, ordförråd, katalogplacering).`);
process.exit(r.errors.length ? 1 : 0);
