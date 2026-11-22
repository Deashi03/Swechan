import coreJson from './data/core/coreVocabulary.json';
import { toolingRepository as getContent } from './tooling';
import { tokenize } from './morphology';
import { checkVocabulary, CoreVocabularyFile, VocabularyChecker } from './vocabularyCheck';

const core = CoreVocabularyFile.parse(coreJson);

describe('controlled vocabulary', () => {
  it('recognises regular inflections of core words but not unknown words', () => {
    const c = new VocabularyChecker(core);
    const none = new Set<string>();
    for (const w of ['husen', 'flickor', 'köpte', 'stängt', 'starkare', 'glömde', 'kände', 'landets', 'gamla', 'gick']) expect(c.isKnown(w, none)).toBe(true);
    for (const w of ['grundämnets', 'protoner', 'befäst', 'egenskaper']) expect(c.isKnown(w, none)).toBe(false);
    expect(c.unknownWords('Hon plockade undan leksakerna.', new Set(['plockade undan']))).toEqual(['leksakerna'].filter((w) => !c.isKnown(w, none)));
  });

  it('all teaching texts only use core words, earlier-taught words or prerequisite words', () => {
    const issues = checkVocabulary(getContent(), core);
    if (issues.length) console.error(`${issues.length} texter med okända ord:\n` + issues.map((i) => `${i.where}: [${i.unknown.join(', ')}]`).join('\n'));
    expect(issues).toEqual([]);
  }, 240_000); // grows with the content (~72 s at 1 685 modules on CI)
});

describe('tokenizer', () => {
  it('keeps a leading digit group in hyphenated words (3D-skrivare) but not plain numbers', () => {
    const words = (t: string) => tokenize(t).filter((x) => x.isWord).map((x) => x.text);
    expect(words('Vi köpte en 3D-skrivare för 1500 kronor.')).toEqual(['Vi', 'köpte', 'en', '3D-skrivare', 'för', 'kronor']);
    expect(words('3D-utskriften tog 3 timmar i A4-format.')).toEqual(['3D-utskriften', 'tog', 'timmar', 'i', 'A', 'format']);
  });
});

describe('compound words', () => {
  it('accepts compounds of known words, with or without linking -s-', async () => {
    const { VocabularyChecker, CoreVocabularyFile } = await import('./vocabularyCheck');
    const core = CoreVocabularyFile.parse({ lemmas: ['vardag', 'mat', 'fläsk', 'jul'], irregularForms: [], names: [] });
    const c = new VocabularyChecker(core);
    const extra = new Set(['filé']);
    expect(c.unknownWords('vardagsmat fläskfilé julmat', extra)).toEqual([]);
    expect(c.unknownWords('xyzmat', extra)).toEqual(['xyzmat']);
  });
});
