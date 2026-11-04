/** npm run catalog:validate – tree, unique IDs, max 8 choices per screen, translation status. */
import { MAX_MENU_CHOICES } from '../../src/content/catalog/catalogIndex';
import { validateCatalog } from '../../src/content/catalog/validateCatalog';
import { loadAll } from './_shared';

const { repo, catalog } = loadAll();
const roots = catalog.childCategories(null);
const areas = roots.flatMap((r) => catalog.childCategories(r.catalogCategoryId));
const topics = areas.flatMap((a) => catalog.childCategories(a.catalogCategoryId));
const screens = [null, ...catalog.categories.map((c) => c.catalogCategoryId)];
const maxChoices = Math.max(...screens.map((s) => catalog.menuItems(s).length));
const tr = catalog.translationStatus();
console.log(`Katalog ${catalog.schemaVersion} (${catalog.sourceTaxonomyVersion})`);
console.log(`Kategorier: ${catalog.categories.length} (${roots.length} områden → ${areas.length} underområden → ${topics.length} ämnesgrupper)`);
console.log(`Moduler: ${catalog.modules.length} (planerade ${catalog.modules.filter((m) => m.status === 'planned').length})`);
console.log(`Flest val på en menyskärm: ${maxChoices} (max ${MAX_MENU_CHOICES})`);
console.log(`Japanska titlar: kategorier ${tr.categoriesWithJa}/${catalog.categories.length}, moduler ${tr.modulesWithJa}/${catalog.modules.length}`);
console.log(`Publicerade moduler: ${repo.modules.length} (kopplingar ${catalog.mapping.links.length}, placeringar ${catalog.mapping.compatibilityPlacements.length})`);
const issues = validateCatalog(catalog, repo.modules.map((m) => m.id));
if (issues.length) {
  console.error(`\n${issues.length} problem:`);
  for (const i of issues) console.error(`- ${i.where}: ${i.message}`);
  process.exit(1);
}
console.log('\nOK – inga problem.');
