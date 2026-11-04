/**
 * Catalog index (0.4 phase B): deterministic, read-only view of the planned
 * catalog combined with the published lessons.
 *
 * - Built by a pure function from the raw catalog file + published mapping +
 *   the set of published module IDs. Same input → identical index.
 * - Order is the catalog file order (the product owner's order).
 * - Planned entries are searchable/browsable metadata only. `isStartable`
 *   is true ONLY for published lessons that exist in the content repository.
 */
import { CatalogFile, PublishedMapping, type CatalogCategory, type CatalogModule } from './schema';

/** Maximum number of choices on one menu screen (product requirement). */
export const MAX_MENU_CHOICES = 8;
/** At the module level: max seven modules (+ a back button). */
export const MAX_MODULES_PER_TOPIC = 7;

export type MenuItem =
  | { kind: 'category'; id: string; titleSv: string; titleJa: string | null; plannedCount: number; publishedCount: number }
  | { kind: 'planned'; id: string; titleSv: string; titleJa: string | null; targetWordCount: number }
  | { kind: 'published'; id: string; catalogId: string | null };

export type PublishedInfo = { titleSv: string };

export class CatalogIndex {
  readonly categories: CatalogCategory[];
  readonly modules: CatalogModule[];
  readonly mapping: PublishedMapping;
  readonly schemaVersion: string;
  readonly sourceTaxonomyVersion: string;

  private catById = new Map<string, CatalogCategory>();
  private modById = new Map<string, CatalogModule>();
  private childCats = new Map<string | null, CatalogCategory[]>();
  private modsByCat = new Map<string, CatalogModule[]>();
  private placedByCat = new Map<string, string[]>();
  private linkByCatalogId = new Map<string, string>();
  private publishedIds: Set<string>;

  constructor(raw: unknown, mapping: unknown, publishedModuleIds: Iterable<string>) {
    const file = CatalogFile.parse(raw);
    this.schemaVersion = file.schemaVersion;
    this.sourceTaxonomyVersion = file.sourceTaxonomyVersion;
    this.categories = file.categories;
    this.modules = file.modules;
    this.mapping = PublishedMapping.parse(mapping);
    this.publishedIds = new Set(publishedModuleIds);
    for (const c of this.categories) {
      this.catById.set(c.catalogCategoryId, c);
      const k = c.parentCatalogCategoryId;
      this.childCats.set(k, [...(this.childCats.get(k) ?? []), c]);
    }
    for (const m of this.modules) {
      this.modById.set(m.catalogId, m);
      this.modsByCat.set(m.catalogCategoryId, [...(this.modsByCat.get(m.catalogCategoryId) ?? []), m]);
    }
    for (const p of this.mapping.compatibilityPlacements) this.placedByCat.set(p.catalogCategoryId, [...(this.placedByCat.get(p.catalogCategoryId) ?? []), p.moduleId]);
    for (const l of this.mapping.links) this.linkByCatalogId.set(l.catalogId, l.moduleId);
  }

  getCategory(id: string) { return this.catById.get(id); }
  getModule(catalogId: string) { return this.modById.get(catalogId); }
  childCategories(parentId: string | null): CatalogCategory[] { return this.childCats.get(parentId) ?? []; }
  plannedModulesIn(categoryId: string): CatalogModule[] { return this.modsByCat.get(categoryId) ?? []; }
  placedPublishedIn(categoryId: string): string[] { return this.placedByCat.get(categoryId) ?? []; }
  /** Published lesson linked (verified 1:1) to a catalog entry, if any. */
  publishedModuleFor(catalogId: string): string | undefined { return this.linkByCatalogId.get(catalogId); }

  path(categoryId: string): CatalogCategory[] {
    const out: CatalogCategory[] = [];
    let cur = this.catById.get(categoryId);
    while (cur && out.length < 10) { out.unshift(cur); cur = cur.parentCatalogCategoryId ? this.catById.get(cur.parentCatalogCategoryId) : undefined; }
    return out;
  }

  depth(categoryId: string): number { return this.path(categoryId).length; }

  /** All planned modules below a category (any depth). */
  countBelow(categoryId: string): { planned: number; published: number } {
    let planned = this.plannedModulesIn(categoryId).length;
    let published = this.placedPublishedIn(categoryId).length + this.plannedModulesIn(categoryId).filter((m) => this.linkByCatalogId.has(m.catalogId)).length;
    for (const c of this.childCategories(categoryId)) {
      const n = this.countBelow(c.catalogCategoryId);
      planned += n.planned;
      published += n.published;
    }
    return { planned, published };
  }

  /**
   * The choices shown on one menu screen (null = root). Never more than
   * MAX_MENU_CHOICES – guaranteed by validateCatalog() and tests.
   */
  menuItems(categoryId: string | null): MenuItem[] {
    const cats: MenuItem[] = this.childCategories(categoryId).map((c) => {
      const n = this.countBelow(c.catalogCategoryId);
      return { kind: 'category', id: c.catalogCategoryId, titleSv: c.titleSv, titleJa: c.titleJa, plannedCount: n.planned, publishedCount: n.published };
    });
    if (categoryId === null) return cats;
    const published: MenuItem[] = this.placedPublishedIn(categoryId).map((id) => ({ kind: 'published', id, catalogId: null }));
    const modules: MenuItem[] = this.plannedModulesIn(categoryId).map((m) => {
      const linked = this.linkByCatalogId.get(m.catalogId);
      return linked && this.publishedIds.has(linked)
        ? { kind: 'published', id: linked, catalogId: m.catalogId }
        : { kind: 'planned', id: m.catalogId, titleSv: m.titleSv, titleJa: m.titleJa, targetWordCount: m.targetWordCount };
    });
    return [...cats, ...published, ...modules];
  }

  /** Only published lessons that exist can be started (never planned catalog entries). */
  isStartable(id: string): boolean {
    return this.publishedIds.has(id);
  }

  /** Metadata search over category and module titles (no lesson bodies are loaded). */
  search(query: string, limit = 50): { kind: 'category' | 'planned'; id: string; titleSv: string }[] {
    const q = query.trim().toLocaleLowerCase('sv');
    if (q.length < 2) return [];
    const out: { kind: 'category' | 'planned'; id: string; titleSv: string }[] = [];
    for (const c of this.categories) if (c.titleSv.toLocaleLowerCase('sv').includes(q)) out.push({ kind: 'category', id: c.catalogCategoryId, titleSv: c.titleSv });
    for (const m of this.modules) {
      if (out.length >= limit) break;
      if (m.titleSv.toLocaleLowerCase('sv').includes(q)) out.push({ kind: 'planned', id: m.catalogId, titleSv: m.titleSv });
    }
    return out.slice(0, limit);
  }

  translationStatus(): { categoriesWithJa: number; modulesWithJa: number } {
    return { categoriesWithJa: this.categories.filter((c) => c.titleJa).length, modulesWithJa: this.modules.filter((m) => m.titleJa).length };
  }
}
