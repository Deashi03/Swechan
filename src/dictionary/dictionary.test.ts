import { ContentRepository, getContent, loadBundledContent } from '../content/repository';
import { DictionaryIndex } from './searchIndex';
import { segmentText } from './segmentText';
import { globalSearch } from './globalSearch';

const repo = getContent();
const index = new DictionaryIndex(repo);
const first = (q: string) => index.search(q)[0]?.entryId;

describe('dictionary search', () => {
  it('finds Swedish lemmas', () => expect(first('molekyl')).toBe('e.molekyl'));
  it('finds inflected forms', () => {
    expect(first('molekylerna')).toBe('e.molekyl');
    expect(first('belägrade')).toBe('e.belägra');
    expect(first('dammsög')).toBe('e.dammsuga');
    expect(first('dammsugde')).toBe('e.dammsuga'); // variant
  });
  it('finds Japanese kanji and readings', () => {
    expect(first('分子')).toBe('e.molekyl');
    expect(first('ぶんし')).toBe('e.molekyl');
    expect(first('ブンシ')).toBe('e.molekyl'); // katakana normalised
  });
  it('ignores case and surrounding whitespace', () => expect(first('  Molekyl ')).toBe('e.molekyl'));
  it('supports prefix search', () => expect(index.search('molek').map((h) => h.entryId)).toContain('e.molekyl'));
  it('keeps several senses under one headword', () => {
    const laga = repo.getEntry('e.laga')!;
    expect(laga.senses.map((s) => s.id)).toEqual(['s.laga.1', 's.laga.2']);
    expect(first('修理')).toBe('e.laga');
    expect(index.search('修理')[0]?.senseId).toBe('s.laga.2');
  });
  it('the same sense is shared by modules (no duplication)', () => {
    expect(repo.modulesForSense('s.ämne.1').map((m) => m.id)).toEqual(['m.material-amnen']);
    expect(repo.getSense('s.förråd.2')!.entry.id).toBe(repo.getSense('s.förråd.1')!.entry.id);
  });
  it('resolves synonym relations and comparisons per sense', () => {
    expect(repo.getSense('s.arg.1')!.sense.synonyms!.map((s) => s.senseId)).toContain('s.rasande.1');
    expect(repo.comparisonsForSense('s.storma.1').map((c) => c.id)).toContain('cmp.anfall');
    expect(repo.comparisonsForSense('s.storma.2')).toEqual([]);
  });
  it('stays fast with 20 000 entries', () => {
    const raw = loadBundledContent();
    const entries = Array.from({ length: 20000 }, (_, i) => ({
      id: `e.syn${i}`, lemma: `syntord${i}`, pos: 'noun', level: 'B1',
      inflection: { kind: 'noun', gender: 'en', indefSg: `syntord${i}`, defSg: `syntord${i}en`, indefPl: `syntord${i}ar`, defPl: `syntord${i}arna` },
      senses: [{ id: `s.syn${i}.1`, ja: `{言葉|ことば}${i}`, defSv: 'x', defJa: 'x', examples: [{ sv: 'x', ja: 'x' }], quality: { status: 'ai-draft' } }],
    }));
    const bigIndex = new DictionaryIndex(new ContentRepository({ ...raw, dictionaries: [...raw.dictionaries, { entries }] }));
    const t0 = performance.now();
    for (const q of ['syntord1234', 'syntord19999arna', 'synt', '言葉', 'ことば', 'molekylerna']) bigIndex.search(q);
    const perQuery = (performance.now() - t0) / 6;
    expect(bigIndex.search('syntord19999arna')[0]?.entryId).toBe('e.syn19999');
    expect(perQuery).toBeLessThan(100);
  });
});

describe('text segmentation', () => {
  it('links inflected words and particle verbs to entries', () => {
    const spans = segmentText('Sedan ska hon plocka undan kläder. Armén belägrade staden.', index);
    const linked = spans.filter((s) => s.entryIds.length);
    expect(linked.map((s) => s.text)).toEqual(['plocka undan', 'Armén', 'belägrade']);
    expect(spans.map((s) => s.text).join('')).toBe('Sedan ska hon plocka undan kläder. Armén belägrade staden.');
  });
});

describe('global search', () => {
  it('returns typed results for modules, categories and words', () => {
    const r = globalSearch('atom', repo, index);
    expect(r.some((x) => x.type === 'module')).toBe(true);
    expect(r.some((x) => x.type === 'category')).toBe(true);
    expect(r.some((x) => x.type === 'word')).toBe(true);
  });
  it('finds modules by Japanese title', () => {
    expect(globalSearch('城', repo, index).some((x) => x.type === 'module' && x.id === 'm.medeltida-borgar')).toBe(true);
  });
});
