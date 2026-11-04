import catalogFile from '../../../planning/catalog/swechan-catalog.v1.json';
import coreJson from '../data/core/coreVocabulary.json';
import mapping from '../data/catalog/publishedMapping.json';
import { CatalogIndex } from '../catalog/catalogIndex';
import { ContentRepository, loadBundledContent } from '../repository';
import { loadAllModuleBodiesEager, toolingRepository } from '../tooling';
import { validateContent } from '../validateContent';
import { CoreVocabularyFile } from '../vocabularyCheck';
import { createDraft, slugify, validateDraft } from './drafts';
import { checkModule } from './moduleCheck';
import { buildContentReport } from './report';

const repo = toolingRepository();
const catalog = new CatalogIndex(catalogFile, mapping, repo.modules.map((m) => m.id));
const core = CoreVocabularyFile.parse(coreJson);

describe('module:new / drafts', () => {
  it('creates a draft from a real planned catalog entry (catalog title, 18 target words)', () => {
    const d = createDraft(catalog, 'SWC-VAR-02-03-01', repo);
    expect(d).toMatchObject({ draft: true, catalogId: 'SWC-VAR-02-03-01', titleSv: 'Skära och hacka', moduleId: 'm.skara-och-hacka', targetWordCount: 18, plannedWords: [] });
    expect(() => createDraft(catalog, 'SWC-FINNS-INTE', repo)).toThrow();
    expect(slugify('Kött, fisk & vegetariskt')).toBe('kott-fisk-vegetariskt');
  });
  it('reports what is missing and catches errors', () => {
    const d = createDraft(catalog, 'SWC-VAR-02-03-01', repo);
    expect(validateDraft(d, catalog, repo)).toEqual([{ level: 'todo', message: '0 planerade målord – behöver 15–20' }]);
    const words = Array.from({ length: 16 }, (_, i) => ({ lemma: `ord${i}` }));
    expect(validateDraft({ ...d, plannedWords: words }, catalog, repo)).toEqual([]);
    const bad = validateDraft({ ...d, titleSv: 'Påhittad titel', moduleId: 'm.hemmet-vardag', plannedWords: [{ lemma: 'kök' }, { lemma: 'kök' }] }, catalog, repo).map((i) => i.message);
    expect(bad.some((m) => m.includes('katalogens'))).toBe(true);
    expect(bad.some((m) => m.includes('finns redan'))).toBe(true);
    expect(bad.some((m) => m.includes('Dubblett'))).toBe(true);
    expect(bad.some((m) => m.includes('återanvänd'))).toBe(true); // "kök" exists → suggest reuse
  });
});

describe('module:validate', () => {
  it('every published module passes all checks', () => {
    for (const m of repo.modules) expect(checkModule(m.id, repo, core, catalog).errors, m.id).toEqual([]);
  });
  it('rejects planned and unknown IDs', () => {
    expect(checkModule('SWC-VAR-02-03-01', repo, core, catalog).errors[0]).toMatch(/finns inte/);
  });
});

describe('content:report', () => {
  it('summarises published/planned modules, review status and translations', () => {
    const r = buildContentReport(repo, core, catalog);
    expect(r.publishedModules).toBe(repo.modules.length);
    expect(r.plannedModules).toBe(2016 - catalog.mapping.links.length);
    expect(r.sensesReviewed).toBe(0); // nothing is human-reviewed yet – and AI must not claim it
    expect(r.catalogTitlesJa.modules).toBe(0);
    expect(r.brokenReferences).toEqual([]);
    expect(r.unintroducedWords).toEqual([]);
    expect(r.catalogIssues).toEqual([]);
    expect(r.markdown).toContain('## Publicerade moduler');
  });
});

describe('review status is a human statement', () => {
  it('"reviewed" without reviewer and date is rejected', () => {
    const base = loadBundledContent();
    const dicts = structuredClone(base.dictionaries) as { entries: { senses: { quality: object }[] }[] }[];
    dicts[0]!.entries[0]!.senses[0]!.quality = { status: 'reviewed' };
    const r = new ContentRepository({ ...base, moduleIndex: undefined, loadBody: undefined, modules: loadAllModuleBodiesEager(), dictionaries: dicts });
    expect(validateContent(r).some((i) => i.message.includes('kräver reviewer och date'))).toBe(true);
  });
});
