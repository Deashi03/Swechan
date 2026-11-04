/** npm run content:report [-- --out rapport.md] */
import fs from 'node:fs';
import { buildContentReport } from '../../src/content/tools/report';
import { args, loadAll } from './_shared';

const a = args();
const { repo, catalog, core } = loadAll();
const r = buildContentReport(repo, core, catalog);
const out = a.includes('--out') ? a[a.indexOf('--out') + 1] : undefined;
if (out) { fs.writeFileSync(out, r.markdown); console.log(`Skrev ${out}`); } else console.log(r.markdown);
const problems = r.brokenReferences.length + r.unintroducedWords.length + r.catalogIssues.length;
process.exit(problems ? 1 : 0);
