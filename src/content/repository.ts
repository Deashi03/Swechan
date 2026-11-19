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
// Kvalitetsplanen A4b: './dictionarySource' loads every dictionary file at once (tests, tools, dev);
// the production build replaces it with './dictionarySource.lazy' (lexicon + per-file loading), see vite.config.ts.
import { dictionarySource } from './dictionarySource';

/** Index entry of a published module (no lesson body). */
type ModuleT = ModuleMeta;

/**
 * A sense with its headword. `entry` is a view of the headword as this sense sees it (kvalitetsplanen A6):
 * a sense's own `level` and `inflection` replace the entry's, so every screen and exercise that reads
 * `ref.entry.level` / `ref.entry.inflection` uses the right values. `senseIndex` is the display position.
 */
export type SenseRef = { entry: VocabularyEntry; sense: WordSense; senseIndex: number };

/**
 * Kvalitetsplanen A4b – the lexicon: the light part of every headword (lemma, word class, level,
 * inflection, and per sense the gloss, label, tags and synonyms). It is always loaded, so search,
 * word lists, statistics and exercise distractors work at once. Definitions, examples and
 * explanations are in the full entries, loaded per subject group (`ensureSenses`).
 * A full entry is a valid LexEntry, so code typed for the lexicon accepts both.
 */
export type LexSense = Pick<WordSense, 'id' | 'ja' | 'jaAlt' | 'labelSv' | 'order' | 'level' | 'inflection' | 'tags'> & {
  synonyms?: Pick<NonNullable<WordSense['synonyms']>[number], 'senseId' | 'relation'>[];
};
export type LexEntry = Pick<VocabularyEntry, 'id' | 'lemma' | 'pos' | 'level' | 'inflection'> & { senses: LexSense[] };
export type LexRef = { entry: LexEntry; sense: LexSense; senseIndex: number };
/** Lexicon row as generated at build time: the entry plus the dictionary file that holds it. */
export type LexRow = LexEntry & { file: string };

/** Senses in display order: senses with `order` first (lower first), then the others in file order. */
export function orderSenses<E extends { senses: { id: string; order?: number }[] }>(e: E): E {
  if (!e.senses.some((s) => s.order !== undefined)) return e;
  const pos = new Map(e.senses.map((s, i) => [s.id, i]));
  const key = (s: { order?: number }) => s.order ?? Number.POSITIVE_INFINITY;
  return { ...e, senses: [...e.senses].sort((a, b) => (key(a) === key(b) ? 0 : key(a) < key(b) ? -1 : 1) || pos.get(a.id)! - pos.get(b.id)!) };
}
function senseView<E extends LexEntry>(e: E, s: LexSense): E {
  if (!s.level && !s.inflection) return e;
  return { ...e, level: s.level ?? e.level, inflection: s.inflection ?? e.inflection };
}

export type RawContent = {
  /** Full dictionary files, loaded at once (tests, tools, dev server). */
  dictionaries: unknown[];
  /** Kvalitetsplanen A4b (production build): the lexicon; full entries are then loaded with `loadDictionary`. */
  lexicon?: LexRow[];
  /** Loads one dictionary file (by file name, e.g. "m-arbete-och-energi.json"). */
  loadDictionary?: (file: string) => Promise<unknown>;
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
  /** The light part of every headword (always complete). */
  readonly lexicon: LexEntry[];
  readonly categories: Category[];
  readonly modules: ModuleT[];
  readonly grammarNotes: GrammarNote[];
  readonly comparisons: Comparison[];
  readonly placementItems: PlacementItem[];

  private entryById = new Map<string, VocabularyEntry>();
  private senseById = new Map<string, SenseRef>();
  private lexEntryById = new Map<string, LexEntry>();
  private lexSenseById = new Map<string, LexRef>();
  /** Lazy mode: dictionary file per entry id, files loaded so far, and pending loads. */
  private fileOfEntry = new Map<string, string>();
  private loadedFiles = new Set<string>();
  private fileLoads = new Map<string, Promise<void>>();
  private loadDictionary: ((file: string) => Promise<unknown>) | null = null;
  private loadedEntries: VocabularyEntry[] = [];
  private moduleById = new Map<string, ModuleT>();
  private categoryById = new Map<string, Category>();
  private noteById = new Map<string, GrammarNote>();
  private modulesBySense = new Map<string, string[]>();
  private comparisonsBySense = new Map<string, Comparison[]>();

  private bodyCache = new Map<string, Promise<ModuleBody>>();
  private bodyReady = new Map<string, ModuleBody>();
  private loadBody: (bodyFile: string) => Promise<unknown>;

  constructor(raw: RawContent) {
    if (raw.lexicon && raw.loadDictionary) {
      this.loadDictionary = raw.loadDictionary;
      this.lexicon = raw.lexicon.map((row) => { const { file, ...e } = row; this.fileOfEntry.set(e.id, file); return orderSenses(e); });
    } else {
      this.loadedEntries = raw.dictionaries.flatMap((d) => DictionaryFile.parse(d).entries).map(orderSenses);
      this.lexicon = this.loadedEntries;
    }
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

    for (const e of this.lexicon) {
      this.lexEntryById.set(e.id, e);
      e.senses.forEach((sense, senseIndex) => this.lexSenseById.set(sense.id, { entry: senseView(e, sense), sense, senseIndex }));
    }
    this.indexFullEntries(this.loadedEntries);
    for (const c of this.categories) this.categoryById.set(c.id, c);
    for (const n of this.grammarNotes) this.noteById.set(n.id, n);
    for (const m of this.modules) {
      this.moduleById.set(m.id, m);
      for (const w of m.words) this.modulesBySense.set(w.senseId, [...(this.modulesBySense.get(w.senseId) ?? []), m.id]);
    }
    for (const c of this.comparisons)
      for (const it of c.items) this.comparisonsBySense.set(it.senseId, [...(this.comparisonsBySense.get(it.senseId) ?? []), c]);
  }

  private indexFullEntries(list: VocabularyEntry[]) {
    for (const e of list) {
      this.entryById.set(e.id, e);
      e.senses.forEach((sense, senseIndex) => this.senseById.set(sense.id, { entry: senseView(e, sense), sense, senseIndex }));
    }
  }

  /** Full headwords loaded so far (all of them except in the lazily loaded production build). */
  get entries(): VocabularyEntry[] { return this.loadedEntries; }
  /** Full headword, if loaded (see ensureEntries). */
  getEntry(id: string) { return this.entryById.get(id); }
  /** Full sense with definition, examples and explanation, if loaded (see ensureSenses). */
  getSense(id: string) { return this.senseById.get(id); }
  /** Light headword: always available. */
  getLexEntry(id: string) { return this.lexEntryById.get(id); }
  /** Light sense (lemma, gloss, inflection, tags, synonyms): always available. */
  getLex(id: string): LexRef | undefined { return this.lexSenseById.get(id); }
  hasSense(id: string): boolean { return this.lexSenseById.has(id); }
  /** Are the full senses loaded? Unknown ids count as loaded (there is nothing to load). */
  sensesLoaded(ids: Iterable<string>): boolean {
    for (const id of ids) if (this.lexSenseById.has(id) && !this.senseById.has(id)) return false;
    return true;
  }
  /** Load the full entries behind these senses (one dictionary file per subject group chunk). */
  ensureSenses(ids: Iterable<string>): Promise<void> {
    return this.ensureEntries([...ids].map((id) => this.lexSenseById.get(id)?.entry.id).filter((x): x is string => !!x));
  }
  ensureEntries(entryIds: Iterable<string>): Promise<void> {
    if (!this.loadDictionary) return Promise.resolve();
    const files = new Set<string>();
    for (const id of entryIds) { const f = this.fileOfEntry.get(id); if (f && !this.loadedFiles.has(f)) files.add(f); }
    return Promise.all([...files].map((f) => this.loadFile(f))).then(() => undefined);
  }
  /** Load every dictionary file (in the background after start, for offline use). */
  ensureAll(): Promise<void> {
    if (!this.loadDictionary) return Promise.resolve();
    return Promise.all([...new Set(this.fileOfEntry.values())].map((f) => this.loadFile(f))).then(() => undefined);
  }
  private loadFile(file: string): Promise<void> {
    let p = this.fileLoads.get(file);
    if (!p) {
      p = this.loadDictionary!(file).then((raw) => {
        if (this.loadedFiles.has(file)) return;
        const list = DictionaryFile.parse(raw).entries.map(orderSenses);
        this.loadedFiles.add(file);
        this.loadedEntries.push(...list);
        this.indexFullEntries(list);
      });
      p.catch(() => this.fileLoads.delete(file)); // allow retry
      this.fileLoads.set(file, p);
    }
    return p;
  }
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
    const lex = this.lexSenseById.get(senseId);
    if (!lex) return [];
    const ids: string[] = [];
    const infl = lex.entry.inflection;
    if (infl.kind === 'noun') ids.push('gn.genus', 'gn.definite', infl.indefPl === null ? 'gn.mass-noun' : 'gn.plural');
    if (infl.kind === 'verb') ids.push('gn.verb-tense', ...(infl.particle ? ['gn.particle-verb'] : []));
    if (infl.kind === 'adjective') ids.push(infl.indeclinable ? 'gn.indeclinable-adj' : 'gn.adj-agreement');
    for (const id of ref?.sense.grammarNotes ?? []) ids.push(id);
    return [...new Set(ids)].map((id) => this.noteById.get(id)).filter((n): n is GrammarNote => !!n);
  }
}

let instance: ContentRepository | null = null;

export function loadBundledContent(): RawContent {
  const index = import.meta.glob('./data/moduleIndex.json', { eager: true, import: 'default' });
  const bodies = import.meta.glob('./data/modules/*.json', { import: 'default' });
  const single = import.meta.glob(['./data/categories.json', './data/grammarNotes.json', './data/comparisons.json', './data/placement.json'], { eager: true, import: 'default' });
  return {
    ...dictionarySource(),
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
