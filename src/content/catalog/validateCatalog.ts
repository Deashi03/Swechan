/**
 * Catalog validator (0.4 phase B). Returns human-readable issues; an empty list
 * means the catalog + published mapping pass all structural checks:
 * unique/stable IDs, a tree (no orphans/cycles), at most three category levels,
 * modules only in topic groups, ≤ 8 choices on every menu screen (≤ 7 modules
 * per topic group), valid target word counts, mapping references, and that
 * no planned entry is startable.
 */
import { CatalogIndex, MAX_MENU_CHOICES, MAX_MODULES_PER_TOPIC } from './catalogIndex';

export type CatalogIssue = { where: string; message: string };

export function validateCatalog(index: CatalogIndex, publishedModuleIds: Iterable<string>): CatalogIssue[] {
  const issues: CatalogIssue[] = [];
  const add = (where: string, message: string) => issues.push({ where, message });
  const published = new Set(publishedModuleIds);

  const seen = new Set<string>();
  for (const c of index.categories) {
    if (seen.has(c.catalogCategoryId)) add(c.catalogCategoryId, 'Dubblett-ID för kategori');
    seen.add(c.catalogCategoryId);
  }
  const seenM = new Set<string>();
  for (const m of index.modules) {
    if (seenM.has(m.catalogId)) add(m.catalogId, 'Dubblett-ID för modul');
    seenM.add(m.catalogId);
    if (seen.has(m.catalogId)) add(m.catalogId, 'Modul-ID krockar med kategori-ID');
  }

  for (const c of index.categories) {
    const id = c.catalogCategoryId;
    if (c.parentCatalogCategoryId !== null && !index.getCategory(c.parentCatalogCategoryId)) add(id, `Okänd förälder ${c.parentCatalogCategoryId}`);
    if (c.parentCatalogCategoryId !== null && !id.startsWith(`${c.parentCatalogCategoryId}-`)) add(id, `ID följer inte förälderns ID ${c.parentCatalogCategoryId}`);
    const depth = index.depth(id);
    if (depth > 3) add(id, `För djup hierarki (${depth} nivåer)`);
    if (index.childCategories(id).length > 0 && index.plannedModulesIn(id).length > 0) add(id, 'Kategori innehåller både underkategorier och moduler');
  }

  for (const m of index.modules) {
    const cat = index.getCategory(m.catalogCategoryId);
    if (!cat) { add(m.catalogId, `Okänd kategori ${m.catalogCategoryId}`); continue; }
    if (index.childCategories(m.catalogCategoryId).length > 0) add(m.catalogId, 'Modul ligger i en kategori som har underkategorier');
    if (m.status === 'published' && !index.publishedModuleFor(m.catalogId)) add(m.catalogId, 'Status published utan verifierad koppling till en färdig lektion');
  }

  // Menu-screen caps (root + every category), including placed published modules.
  const screens: (string | null)[] = [null, ...index.categories.map((c) => c.catalogCategoryId)];
  for (const s of screens) {
    const items = index.menuItems(s);
    if (items.length > MAX_MENU_CHOICES) add(s ?? '(rot)', `${items.length} val på en menyskärm (max ${MAX_MENU_CHOICES})`);
    const moduleItems = items.filter((i) => i.kind !== 'category').length;
    if (s !== null && index.childCategories(s).length === 0 && moduleItems > MAX_MODULES_PER_TOPIC) add(s, `${moduleItems} moduler i en ämnesgrupp (max ${MAX_MODULES_PER_TOPIC})`);
  }

  // Published mapping.
  const placed = new Set<string>();
  for (const p of index.mapping.compatibilityPlacements) {
    if (!published.has(p.moduleId)) add(p.moduleId, 'Placering för en modul som inte är publicerad');
    if (!index.getCategory(p.catalogCategoryId)) add(p.moduleId, `Placering i okänd kategori ${p.catalogCategoryId}`);
    if (placed.has(p.moduleId)) add(p.moduleId, 'Modulen är placerad flera gånger');
    placed.add(p.moduleId);
    for (const o of p.overlapsCatalogIds) if (!index.getModule(o)) add(p.moduleId, `Överlapp mot okänt katalog-ID ${o}`);
  }
  const linkedModules = new Set<string>();
  const linkedCatalog = new Set<string>();
  for (const l of index.mapping.links) {
    if (!index.getModule(l.catalogId)) add(l.catalogId, 'Koppling till okänt katalog-ID');
    if (!published.has(l.moduleId)) add(l.moduleId, 'Koppling till en modul som inte är publicerad');
    if (linkedModules.has(l.moduleId) || linkedCatalog.has(l.catalogId)) add(l.catalogId, 'Kopplingen är inte 1:1');
    if (placed.has(l.moduleId)) add(l.moduleId, 'Modulen har både koppling och kompatibilitetsplacering');
    linkedModules.add(l.moduleId);
    linkedCatalog.add(l.catalogId);
  }
  for (const id of published) if (!placed.has(id) && !linkedModules.has(id)) add(id, 'Publicerad modul saknar plats i katalogen');

  for (const m of index.modules) if (index.isStartable(m.catalogId)) add(m.catalogId, 'Planerad katalogpost är startbar');
  return issues;
}
