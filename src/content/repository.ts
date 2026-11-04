/**
 * Content System – loading and indexing.
 *
 * Content JSON is bundled with the app and validated with Zod on first access.
 * Everything else in the app reads content only through `getContent()`.
 *
 * Scaling note: v0.1 loads all content eagerly (≈100 kB). When the library
 * grows to thousands of modules, module bodies should be lazy-loaded
 * (import.meta.glob without `eager`) behind the same API, keeping only a
 * catalog index eager. See ARCHITECTURE.md.
 */
import {
  CategoriesFile, ComparisonsFile, DictionaryFile, GrammarNotesFile, Module, ModuleIndexFile, ModuleMeta, PlacementFile,
  type Category, type Comparison, type GrammarNote, type PlacementItem, type VocabularyEntry, type WordSense,
} from './schema';
import type { Module as ModuleBody } from './schema';

/** Index entry of a published module (no lesson body). */
type ModuleT = ModuleMeta;

export type SenseRef = { entry: VocabularyEntry; sense: WordSense; senseIndex: number };

export type RawContent = {
  dictionaries: unknown[];
  categories: unknown;
  /** Lightweight module index (moduleIndex.json). */
  moduleIndex?: unknown;
  /** Lazy loader for a module body by its bodyFile name. */
  loadBody?: (bodyFile: string) => Promise<unknown>;
  /** Full modules (tests/tooling): index and bodies are derived from these. */
  modules?: unknown[];
  grammarNotes: unknown;
  comparisons: unknown;
  placement: unknown;
};

export class ModuleNotAvailableError extends Error {}

export class ContentRepository {
  readonly entries: VocabularyEntry[];
  readonly categories: Category[];
  readonly modules: ModuleT[];
  readonly grammarNotes: GrammarNote[];
  readonly comparisons: Comparison[];
  readonly placementItems: PlacementItem[];

  private entryById = new Map<string, VocabularyEntry>();
  private senseById = new Map<string, SenseRef>();
  private moduleById = new Map<string, ModuleT>();
  private categoryById = new Map<string, Category>();
  private noteById = new Map<string, GrammarNote>();
  private modulesBySense = new Map<string, string[]>();
  private comparisonsBySense = new Map<string, Comparison[]>();

  private bodyCache = new Map<string, Promise<ModuleBody>>();
  private bodyReady = new Map<string, ModuleBody>();
  private loadBody: (bodyFile: string) => Promise<unknown>;

  constructor(raw: RawContent) {
    this.entries = raw.dictionaries.flatMap((d) => DictionaryFile.parse(d).entries);
    this.categories = CategoriesFile.parse(raw.categories).categories;
    if (raw.modules) {
      // Full modules given (tests/tooling): derive the index, keep the bodies in memory.
      const full = raw.modules.map((m) => Module.parse(m));
      this.modules = full.map((m) => { const { reading, conversation, ...meta } = m; void reading; void conversation; return { ...meta, bodyFile: `${m.id.slice(2)}.json` }; });
      for (const m of full) this.bodyReady.set(m.id, m);
      this.loadBody = async (f) => full.find((m) => `${m.id.slice(2)}.json` === f);
    } else {
      this.modules = ModuleIndexFile.parse(raw.moduleIndex).modules;
      this.loadBody = raw.loadBody ?? (() => Promise.reject(new Error('No module body loader')));
    }
    this.modules.sort((a, b) => a.recommendedOrder - b.recommendedOrder);
    this.grammarNotes = GrammarNotesFile.parse(raw.grammarNotes).notes;
    this.comparisons = ComparisonsFile.parse(raw.comparisons).comparisons;
    this.placementItems = PlacementFile.parse(raw.placement).items;

    for (const e of this.entries) {
      this.entryById.set(e.id, e);
      e.senses.forEach((sense, senseIndex) => this.senseById.set(sense.id, { entry: e, sense, senseIndex }));
    }
    for (const c of this.categories) this.categoryById.set(c.id, c);
    for (const n of this.grammarNotes) this.noteById.set(n.id, n);
    for (const m of this.modules) {
      this.moduleById.set(m.id, m);
      for (const w of m.words) this.modulesBySense.set(w.senseId, [...(this.modulesBySense.get(w.senseId) ?? []), m.id]);
    }
    for (const c of this.comparisons)
      for (const it of c.items) this.comparisonsBySense.set(it.senseId, [...(this.comparisonsBySense.get(it.senseId) ?? []), c]);
  }

  getEntry(id: string) { return this.entryById.get(id); }
  getSense(id: string) { return this.senseById.get(id); }
  /** Index entry (metadata + words) of a published module; undefined for unknown/planned IDs. */
  getModule(id: string) { return this.moduleById.get(id); }

  /**
   * Full lesson (reading text + conversation) of a published module.
   * Lazy-loaded per module, validated, cached; a failed load can be retried.
   * Planned catalog entries and unknown IDs are rejected.
   */
  loadModuleBody(id: string): Promise<ModuleBody> {
    const meta = this.moduleById.get(id);
    if (!meta) return Promise.reject(new ModuleNotAvailableError(`Modulen ${id} är inte publicerad`));
    const ready = this.bodyReady.get(id);
    if (ready) return Promise.resolve(ready);
    let p = this.bodyCache.get(id);
    if (!p) {
      p = this.loadBody(meta.bodyFile).then((raw) => {
        const body = Module.parse(raw);
        if (body.id !== id) throw new Error(`Fel modulfil för ${id}`);
        if (body.contentVersion !== meta.contentVersion) throw new Error(`Modulindexet är inaktuellt för ${id} (kör npm run content:index)`);
        this.bodyReady.set(id, body);
        return body;
      });
      p.catch(() => this.bodyCache.delete(id)); // allow retry
      this.bodyCache.set(id, p);
    }
    return p;
  }

  /** The lesson body if it has already been loaded in this session. */
  getLoadedModuleBody(id: string): ModuleBody | undefined { return this.bodyReady.get(id); }
  getCategory(id: string) { return this.categoryById.get(id); }
  getGrammarNote(id: string) { return this.noteById.get(id); }
  modulesForSense(senseId: string): ModuleT[] {
    return (this.modulesBySense.get(senseId) ?? []).map((id) => this.moduleById.get(id)!).filter(Boolean);
  }
  comparisonsForSense(senseId: string): Comparison[] { return this.comparisonsBySense.get(senseId) ?? []; }
  childCategories(parentId: string | null): Category[] {
    return this.categories.filter((c) => c.parentId === parentId).sort((a, b) => a.order - b.order);
  }
  categoryPath(id: string): Category[] {
    const path: Category[] = [];
    let cur = this.categoryById.get(id);
    while (cur && path.length < 20) { path.unshift(cur); cur = cur.parentId ? this.categoryById.get(cur.parentId) : undefined; }
    return path;
  }
  /** Modules placed in this category or any descendant. */
  modulesUnderCategory(id: string): ModuleT[] {
    return this.modules.filter((m) => this.categoryPath(m.categoryId).some((c) => c.id === id));
  }

  /** Grammar notes relevant to a sense: automatic by word class + sense-specific ones. */
  grammarNotesFor(senseId: string): GrammarNote[] {
    const ref = this.senseById.get(senseId);
    if (!ref) return [];
    const ids: string[] = [];
    const infl = ref.entry.inflection;
    if (infl.kind === 'noun') ids.push('gn.genus', 'gn.definite', infl.indefPl === null ? 'gn.mass-noun' : 'gn.plural');
    if (infl.kind === 'verb') ids.push('gn.verb-tense', ...(infl.particle ? ['gn.particle-verb'] : []));
    if (infl.kind === 'adjective') ids.push(infl.indeclinable ? 'gn.indeclinable-adj' : 'gn.adj-agreement');
    for (const id of ref.sense.grammarNotes ?? []) ids.push(id);
    return [...new Set(ids)].map((id) => this.noteById.get(id)).filter((n): n is GrammarNote => !!n);
  }
}

let instance: ContentRepository | null = null;

export function loadBundledContent(): RawContent {
  const dicts = import.meta.glob('./data/dictionary/*.json', { eager: true, import: 'default' });
  const index = import.meta.glob('./data/moduleIndex.json', { eager: true, import: 'default' });
  const bodies = import.meta.glob('./data/modules/*.json', { import: 'default' });
  const single = import.meta.glob(['./data/categories.json', './data/grammarNotes.json', './data/comparisons.json', './data/placement.json'], { eager: true, import: 'default' });
  return {
    dictionaries: Object.values(dicts),
    moduleIndex: index['./data/moduleIndex.json'],
    loadBody: (bodyFile: string) => {
      const loader = bodies[`./data/modules/${bodyFile}`];
      return loader ? loader() : Promise.reject(new Error(`Saknar modulfil ${bodyFile}`));
    },
    categories: single['./data/categories.json'],
    grammarNotes: single['./data/grammarNotes.json'],
    comparisons: single['./data/comparisons.json'],
    placement: single['./data/placement.json'],
  };
}

export function getContent(): ContentRepository {
  if (!instance) instance = new ContentRepository(loadBundledContent());
  return instance;
}

/** Test hook. */
export function setContentForTests(repo: ContentRepository | null) { instance = repo; }
