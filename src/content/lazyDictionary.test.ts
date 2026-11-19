/**
 * Kvalitetsplanen A4b: the production build loads the lexicon at start and the full dictionary
 * entries per file. Here the lazy repository is built from the real content (an isolated test: the
 * loader is a fake that counts which files are requested).
 */
import { buildLexicon, expandLexicon } from './lexicon';
import { ContentRepository, getContent, loadBundledContent, type LexRow } from './repository';
import { DictionaryIndex } from '../dictionary/searchIndex';
import { generateExercise } from '../learning/exercises/generate';

const files = import.meta.glob('./data/dictionary/*.json', { eager: true, import: 'default' }) as Record<string, { entries: Record<string, unknown>[] }>;
const byName = new Map(Object.entries(files).map(([k, v]) => [k.split('/').pop()!, v]));

function lazyRepo() {
  const requested: string[] = [];
  const lexicon = expandLexicon<LexRow>(buildLexicon([...byName].map(([file, d]) => ({ file, entries: d.entries }))));
  const repo = new ContentRepository({
    ...loadBundledContent(),
    dictionaries: [],
    lexicon,
    loadDictionary: async (file) => { requested.push(file); return byName.get(file); },
  });
  return { repo, requested };
}

describe('ordboken laddas lat i produktionsbygget (kvalitetsplanen A4b)', () => {
  const eager = getContent();

  it('uppslagsdelen finns direkt: sökning, glosor och böjning utan att någon fil laddats', () => {
    const { repo, requested } = lazyRepo();
    expect(repo.lexicon.length).toBe(eager.lexicon.length);
    expect(repo.getSense('s.arbete.2')).toBeUndefined();
    expect(repo.getLex('s.arbete.2')?.sense.ja).toBe(eager.getSense('s.arbete.2')!.sense.ja);
    expect(repo.getLexEntry('e.arbete')!.senses[0]!.id).toBe('s.arbete.2'); // display order also in the lexicon
    expect(repo.getLex('s.damm.1')!.entry.inflection).toEqual(eager.getSense('s.damm.1')!.entry.inflection); // sense inflection
    expect(repo.hasSense('s.arbete.1')).toBe(true);
    expect(repo.sensesLoaded(['s.arbete.1'])).toBe(false);
    expect(new DictionaryIndex(repo).search('arbetet', 5).some((h) => h.entryId === 'e.arbete')).toBe(true);
    expect(requested).toEqual([]);
  });

  it('ensureSenses laddar bara de filer som behövs, och posterna blir identiska med vanlig laddning', async () => {
    const { repo, requested } = lazyRepo();
    await repo.ensureSenses(['s.arbete.1', 's.arbete.2']);
    expect(requested).toHaveLength(1);
    expect(repo.sensesLoaded(['s.arbete.1', 's.arbete.2'])).toBe(true);
    expect(repo.getSense('s.arbete.1')).toEqual(eager.getSense('s.arbete.1'));
    expect(repo.getEntry('e.arbete')).toEqual(eager.getEntry('e.arbete'));
    await repo.ensureSenses(['s.arbete.1']); // already loaded: no new request
    expect(requested).toHaveLength(1);
  });

  it('en övning kan skapas när målordet är laddat; distraktorerna tas ur uppslagsdelen', async () => {
    const { repo } = lazyRepo();
    const m = eager.modules.find((x) => x.id === 'm.arbete-och-energi')!;
    const target = m.words[0]!.senseId;
    await repo.ensureSenses([target]);
    const ex = generateExercise('meaning_choice', target, { repo, poolSenseIds: m.words.map((w) => w.senseId), seed: 7 });
    expect(ex).not.toBeNull();
    expect(ex!.type === 'meaning_choice' && ex!.options.length).toBeGreaterThanOrEqual(3);
  });

  it('ensureAll laddar allt; ett misslyckat filanrop kan göras om', async () => {
    const { repo } = lazyRepo();
    await repo.ensureAll();
    expect(repo.entries.length).toBe(eager.entries.length);
    let fail = true;
    const flaky = new ContentRepository({
      ...loadBundledContent(), dictionaries: [], lexicon: expandLexicon<LexRow>(buildLexicon([...byName].map(([file, d]) => ({ file, entries: d.entries })))),
      loadDictionary: async (file) => { if (fail) throw new Error('offline'); return byName.get(file); },
    });
    await expect(flaky.ensureSenses(['s.arbete.1'])).rejects.toThrow('offline');
    fail = false;
    await flaky.ensureSenses(['s.arbete.1']);
    expect(flaky.getSense('s.arbete.1')).toBeDefined();
  });
});
