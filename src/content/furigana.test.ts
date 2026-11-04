import { checkFurigana, normalizeJapanese, parseFurigana, stripFurigana, toKanaReading, toParenthesized } from './furigana';
import { ContentRepository, loadBundledContent } from './repository';
import { loadAllModuleBodiesEager } from './tooling';
import { validateContent } from './validateContent';

describe('furigana markup', () => {
  const m = '{分子|ぶんし}は{原子|げんし}が{結|むす}びついたものです。';
  it('parses ruby groups', () => {
    expect(parseFurigana(m)[0]).toEqual({ text: '分子', reading: 'ぶんし' });
    expect(stripFurigana(m)).toBe('分子は原子が結びついたものです。');
    expect(toKanaReading(m)).toBe('ぶんしはげんしがむすびついたものです。');
    expect(toParenthesized('{分子|ぶんし}')).toBe('分子（ぶんし）');
  });
  it('flags kanji without readings and non-kana readings', () => {
    expect(checkFurigana(m)).toEqual([]);
    expect(checkFurigana('英語の{本|ほん}').length).toBe(1);
    expect(checkFurigana('{本|hon}').length).toBe(1);
    expect(checkFurigana('{ほん|ほん}').length).toBe(1);
  });
  it('normalizes katakana to hiragana for search', () => {
    expect(normalizeJapanese('ベッド')).toBe('べっど');
  });
});

describe('content validator catches real problems', () => {
  it('detects a missing target word and bad furigana', () => {
    const base = loadBundledContent();
    const raw = { ...base, moduleIndex: undefined, loadBody: undefined, modules: structuredClone(loadAllModuleBodiesEager()), dictionaries: structuredClone(base.dictionaries) };
    const mod = (raw.modules as { id: string; reading: { paragraphs: string[] } }[]).find((x) => x.id === 'm.atomer-molekyler')!;
    mod.reading.paragraphs = mod.reading.paragraphs.map((p) => p.replace(/molekyl\w*/g, 'sak'));
    const dict = (raw.dictionaries as { entries: { senses: { defJa: string }[] }[] }[])[0]!;
    dict.entries[0]!.senses[0]!.defJa = '漢字だけ';
    const issues = validateContent(new ContentRepository(raw));
    expect(issues.some((i) => i.message.includes('"molekyl" saknas'))).toBe(true);
    expect(issues.some((i) => i.message.includes('Kanji utan furigana'))).toBe(true);
  });
});
