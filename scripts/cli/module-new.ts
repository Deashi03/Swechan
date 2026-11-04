/** npm run module:new -- <catalogId> – creates content/drafts/<slug>.json for a planned catalog entry. */
import fs from 'node:fs';
import path from 'node:path';
import { createDraft } from '../../src/content/tools/drafts';
import { args, loadAll } from './_shared';

const [catalogId] = args();
if (!catalogId) { console.error('Användning: npm run module:new -- <katalog-ID, t.ex. SWC-VAR-02-03-01>'); process.exit(1); }
const { repo, catalog } = loadAll();
const draft = createDraft(catalog, catalogId, repo);
const file = path.join('content/drafts', `${draft.moduleId.slice(2)}.json`);
if (fs.existsSync(file)) { console.error(`${file} finns redan.`); process.exit(1); }
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, JSON.stringify(draft, null, 1) + '\n');
const cat = catalog.getModule(catalogId)!;
console.log(`Skapade ${file}\nKatalog: ${catalog.path(cat.catalogCategoryId).map((c) => c.titleSv).join(' › ')} › ${cat.titleSv}\nNästa: fyll i 15–20 planerade målord och kör npm run module:validate -- ${file}`);
