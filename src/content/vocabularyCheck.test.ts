import coreJson from './data/core/coreVocabulary.json';
import { toolingRepository as getContent } from './tooling';
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
  });
});
