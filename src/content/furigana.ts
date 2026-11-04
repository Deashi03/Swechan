/**
 * Furigana markup.
 *
 * Japanese teaching text is stored with explicit, hand-checkable readings:
 *
 *   "{分子|ぶんし}は{原子|げんし}が{結|むす}びついたものです。"
 *
 * `{base|reading}` marks a ruby group. Every kanji in stored Japanese text
 * MUST be inside a ruby group – the content validator enforces this, so the
 * app never guesses readings at render time. Text outside braces is rendered
 * as-is. Readings must be hiragana (katakana allowed for loan readings).
 */
export type FuriganaSegment = { text: string; reading?: string };

const RUBY_RE = /\{([^{}|]+)\|([^{}|]+)\}/g;
// CJK Unified Ideographs (+ Ext A) and the iteration mark 々
const KANJI_RE = /[㐀-䶿一-鿿々]/;
const KANA_RE = /^[぀-ゟ゠-ヿー・]+$/;

export function parseFurigana(markup: string): FuriganaSegment[] {
  const out: FuriganaSegment[] = [];
  let last = 0;
  for (const m of markup.matchAll(RUBY_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push({ text: markup.slice(last, idx) });
    out.push({ text: m[1]!, reading: m[2]! });
    last = idx + m[0].length;
  }
  if (last < markup.length) out.push({ text: markup.slice(last) });
  return out;
}

/** Plain text without readings: "分子は…" */
export function stripFurigana(markup: string): string {
  return markup.replace(RUBY_RE, '$1');
}

/** Text with kanji replaced by their readings: "ぶんしは…" */
export function toKanaReading(markup: string): string {
  return markup.replace(RUBY_RE, '$2');
}

/** Text with readings in full-width parentheses – only for export to plain-text targets such as a ChatGPT prompt. */
export function toParenthesized(markup: string): string {
  return markup.replace(RUBY_RE, '$1（$2）');
}

export type FuriganaIssue = { message: string };

/** Quality check used by the content validator. */
export function checkFurigana(markup: string): FuriganaIssue[] {
  const issues: FuriganaIssue[] = [];
  const openCount = (markup.match(/\{/g) ?? []).length;
  const closeCount = (markup.match(/\}/g) ?? []).length;
  if (openCount !== closeCount) issues.push({ message: `Obalanserade klamrar i "${markup}"` });
  for (const seg of parseFurigana(markup)) {
    if (seg.reading === undefined) {
      if (KANJI_RE.test(seg.text)) issues.push({ message: `Kanji utan furigana: "${seg.text}" i "${markup}"` });
      if (/[{}|]/.test(seg.text)) issues.push({ message: `Felaktig rubymarkering nära "${seg.text}"` });
    } else {
      if (!KANJI_RE.test(seg.text)) issues.push({ message: `Rubygrupp utan kanji: "${seg.text}"` });
      if (!KANA_RE.test(seg.reading)) issues.push({ message: `Läsningen "${seg.reading}" för "${seg.text}" är inte kana` });
    }
  }
  return issues;
}

/** Normalize Japanese for search: NFKC, katakana → hiragana, trim. */
export function normalizeJapanese(s: string): string {
  return s
    .normalize('NFKC')
    .replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60))
    .trim();
}
