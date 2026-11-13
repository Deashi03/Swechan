import realCatalog from '../../../planning/catalog/swechan-catalog.v1.json';
import mapping from '../data/catalog/publishedMapping.json';
import { getContent } from '../repository';
import { recommendedModule, startOrResumeLearn } from '../../modules/moduleService';
import { setupTestEnv } from '../../test/helpers';
import { CatalogIndex, MAX_MENU_CHOICES, MAX_MODULES_PER_TOPIC } from './catalogIndex';
import { loadCatalog } from './loadCatalog';
import { validateCatalog } from './validateCatalog';

const publishedIds = getContent().modules.map((m) => m.id);
const index = new CatalogIndex(realCatalog, mapping, publishedIds);

describe('real planning catalog (planning/catalog/swechan-catalog.v1.json)', () => {
  it('has 344 categories (8 → 48 → 288) and 2 016 planned modules', () => {
    expect(index.categories.length).toBe(344);
    expect(index.modules.length).toBe(2016);
    const roots = index.childCategories(null);
    expect(roots.length).toBe(8);
    const areas = roots.flatMap((r) => index.childCategories(r.catalogCategoryId));
    expect(areas.length).toBe(48);
    const topics = areas.flatMap((a) => index.childCategories(a.catalogCategoryId));
    expect(topics.length).toBe(288);
    for (const t of topics) expect(index.plannedModulesIn(t.catalogCategoryId).length).toBe(7);
  });

  it('passes every structural check, including the published mapping', () => {
    const issues = validateCatalog(index, publishedIds);
    if (issues.length) console.error(issues.map((i) => `${i.where}: ${i.message}`).join('\n'));
    expect(issues).toEqual([]);
  });

  it('never shows more than eight choices on any menu screen', () => {
    for (const s of [null, ...index.categories.map((c) => c.catalogCategoryId)]) {
      const items = index.menuItems(s);
      expect(items.length, String(s)).toBeLessThanOrEqual(MAX_MENU_CHOICES);
      if (s && index.childCategories(s).length === 0) expect(items.filter((i) => i.kind !== 'category').length).toBeLessThanOrEqual(MAX_MODULES_PER_TOPIC);
    }
    // Areas show only their topic groups – older modules live inside a topic group (feedback 0.4).
    for (const area of index.categories.filter((c) => c.catalogCategoryId.length === 7))
      expect(index.menuItems(area.catalogCategoryId).every((i) => i.kind === 'category'), area.catalogCategoryId).toBe(true);
    expect(index.menuItems('R06-A04-T01').length).toBe(8); // 7 planned + Material och ämnen
    expect(index.menuItems('R04-A02-T02').length).toBe(8); // 7 planned + Medeltida slott och belägringar
  });

  it('keeps the catalog order and real titles; all entries are planned without Japanese titles yet', () => {
    expect(index.childCategories(null).map((c) => c.titleSv)).toEqual([
      'Vardag & hem', 'Människan & hälsa', 'Samhälle & institutioner', 'Historia & humaniora',
      'Natur & geografi', 'Matematik & naturvetenskap', 'Teknik & digital värld', 'Kultur & fritid',
    ]);
    expect(index.getModule('SWC-HIS-02-03-07')?.titleSv).toBe('Kapitulation och undsättning');
    expect(index.modules.every((m) => m.status === 'planned' && m.targetWordCount >= 15 && m.targetWordCount <= 20)).toBe(true);
    expect(index.translationStatus()).toEqual({ categoriesWithJa: 0, modulesWithJa: 0 });
  });

  it('builds deterministically (same input → identical index)', () => {
    const again = new CatalogIndex(realCatalog, mapping, publishedIds);
    expect(again.menuItems('R04-A02')).toEqual(index.menuItems('R04-A02'));
    expect(again.categories).toEqual(index.categories);
    expect(JSON.stringify(again.modules)).toBe(JSON.stringify(index.modules));
  });

  it('keeps all five original published modules and their IDs, placed without a false 1:1 mapping', () => {
    const original = ['m.atomer-molekyler', 'm.hemmet-vardag', 'm.krig-forsvar', 'm.material-amnen', 'm.medeltida-borgar'];
    for (const id of original) expect(publishedIds).toContain(id);
    const linked = new Set(index.mapping.links.map((l) => l.moduleId));
    for (const id of original) expect(linked.has(id)).toBe(false);
    expect(index.menuItems('R04-A02-T02').filter((i) => i.kind === 'published').map((i) => i.id)).toEqual(['m.medeltida-borgar']);
    expect(index.menuItems('R04-A02-T03').filter((i) => i.kind === 'published').map((i) => i.id)).toEqual(['m.krig-forsvar']);
    expect(index.countBelow('R04-A02').published).toBe(2); // Historiska epoker (R04-A01) is published from 0.36
  });

  it('links the 0.4 modules 1:1 to exactly the catalog entries they were written for', () => {
    const pairs = index.mapping.links.map((l) => [l.catalogId, l.moduleId]);
    for (const p of [['SWC-VAR-02-01-01', 'm.vanliga-gronsaker'], ['SWC-VAR-02-03-01', 'm.skara-och-hacka'], ['SWC-VAR-02-03-02', 'm.koka-och-sjuda']]) expect(pairs).toContainEqual(p);
    for (const l of index.mapping.links) {
      const entry = index.getModule(l.catalogId)!;
      expect(getContent().getModule(l.moduleId)!.titleSv).toBe(entry.titleSv);
      expect(index.publishedModuleFor(l.catalogId)).toBe(l.moduleId);
      expect(index.isStartable(l.moduleId)).toBe(true);
    }
    // the topic group still shows at most 7 modules: the link replaces the planned entry
    const items = index.menuItems('R01-A02-T03');
    expect(items.length).toBeLessThanOrEqual(7);
    expect(items.filter((i) => i.kind === 'published').map((i) => i.id).slice(0, 2)).toEqual(['m.skara-och-hacka', 'm.koka-och-sjuda']);
  });

  it('search uses metadata only and finds real titles', () => {
    const r = index.search('belägring');
    expect(r.some((x) => x.kind === 'category' && x.titleSv === 'Medeltida belägringar')).toBe(true);
    expect(r.some((x) => x.kind === 'planned' && x.id === 'SWC-HIS-02-03-01')).toBe(true);
  });
});

describe('planned modules cannot be started as lessons', () => {
  it('no catalog entry is startable, published lessons are', () => {
    expect(index.modules.some((m) => index.isStartable(m.catalogId))).toBe(false);
    for (const id of publishedIds) expect(index.isStartable(id)).toBe(true);
    expect(index.menuItems('R04-A02-T04').every((i) => i.kind === 'planned')).toBe(true);
  });
  it('the lesson services reject a planned ID and never recommend one', async () => {
    await setupTestEnv();
    expect(getContent().getModule('SWC-HIS-02-03-01')).toBeUndefined();
    await expect(startOrResumeLearn('SWC-HIS-02-03-01')).rejects.toThrow();
    for (let i = 0; i < 3; i++) expect((await recommendedModule())!.id.startsWith('m.')).toBe(true);
  });
  it('the lazy loader returns the same validated index', async () => {
    const loaded = await loadCatalog();
    expect(loaded.modules.length).toBe(2016);
    expect(await loadCatalog()).toBe(loaded); // cached
  });
});

describe('validator catches structural problems (synthetic fixtures, tests only)', () => {
  const cat = (id: string, parent: string | null) => ({ catalogCategoryId: id, parentCatalogCategoryId: parent, titleSv: `Test ${id}`, titleJa: null });
  const mod = (id: string, c: string, extra: object = {}) => ({ catalogId: id, catalogCategoryId: c, titleSv: `Test ${id}`, titleJa: null, status: 'planned', targetWordCount: 18, ...extra });
  const file = (categories: object[], modules: object[]) => ({ schemaVersion: '0.4-plan-index-v1', sourceTaxonomyVersion: 'test', categories, modules });
  const empty = { links: [], compatibilityPlacements: [] };
  const v = (f: object, m: object = empty, pub: string[] = []) => validateCatalog(new CatalogIndex(f, m, pub), pub).map((i) => i.message);

  it('flags more than eight root choices', () => {
    const roots = Array.from({ length: 9 }, (_, i) => cat(`R0${i + 1}`, null));
    expect(v(file(roots, [])).some((m) => m.includes('9 val'))).toBe(true);
  });
  it('flags more than eight modules in a topic group', () => {
    const mods = Array.from({ length: 9 }, (_, i) => mod(`SWC-TST-01-01-0${i + 1}`, 'R01-A01-T01'));
    expect(v(file([cat('R01', null), cat('R01-A01', 'R01'), cat('R01-A01-T01', 'R01-A01')], mods)).some((m) => m.includes('9 moduler'))).toBe(true);
  });
  it('flags duplicates, orphans and modules outside topic groups', () => {
    const msgs = v(file([cat('R01', null), cat('R01', null), cat('R02-A01', 'R09')], [mod('SWC-TST-01-01-01', 'R01'), mod('SWC-TST-01-01-01', 'R01')]));
    expect(msgs.some((m) => m.includes('Dubblett-ID för kategori'))).toBe(true);
    expect(msgs.some((m) => m.includes('Dubblett-ID för modul'))).toBe(true);
    expect(msgs.some((m) => m.includes('Okänd förälder'))).toBe(true);
  });
  it('rejects target word counts outside 15–20 at the schema level', () => {
    expect(() => new CatalogIndex(file([cat('R01', null)], [mod('SWC-TST-01-01-01', 'R01', { targetWordCount: 25 })]), empty, [])).toThrow();
  });
  it('flags a published placement that would break the menu cap, and unverified "published" status', () => {
    const cats = [cat('R01', null), cat('R01-A01', 'R01'), ...Array.from({ length: 7 }, (_, i) => cat(`R01-A01-T0${i + 1}`, 'R01-A01'))];
    const m = { links: [], compatibilityPlacements: [{ moduleId: 'm.a', catalogCategoryId: 'R01-A01', overlapsCatalogIds: [], reason: 'x' }, { moduleId: 'm.b', catalogCategoryId: 'R01-A01', overlapsCatalogIds: [], reason: 'x' }] };
    expect(v(file(cats, []), m, ['m.a', 'm.b']).some((x) => x.includes('9 val'))).toBe(true);
    const pub = v(file([cat('R01', null), cat('R01-A01', 'R01'), cat('R01-A01-T01', 'R01-A01')], [mod('SWC-TST-01-01-01', 'R01-A01-T01', { status: 'published' })]));
    expect(pub.some((x) => x.includes('utan verifierad koppling'))).toBe(true);
  });
  it('flags a published module with no place in the catalog', () => {
    expect(v(file([cat('R01', null)], []), empty, ['m.lost']).some((x) => x.includes('saknar plats'))).toBe(true);
  });
});
