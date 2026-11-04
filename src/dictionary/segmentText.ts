/**
 * Segments a Swedish text into spans linked to dictionary entries.
 * Greedy longest match (up to 3 words) so particle verbs like "plocka undan"
 * are recognised as one unit. Used by the interactive reader.
 */
import { tokenize } from '../content/morphology';
import type { DictionaryIndex } from './searchIndex';

export type TextSpan = { text: string; entryIds: string[]; isWord: boolean };

export function segmentText(text: string, index: DictionaryIndex, maxWords = 3): TextSpan[] {
  const tokens = tokenize(text);
  const out: TextSpan[] = [];
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i]!;
    if (!t.isWord) { out.push({ text: t.text, entryIds: [], isWord: false }); i++; continue; }
    let matched = false;
    for (let n = maxWords; n >= 2 && !matched; n--) {
      // collect n word tokens separated only by single spaces
      const wordIdx: number[] = [i];
      let j = i + 1;
      while (wordIdx.length < n && j + 1 < tokens.length && tokens[j]!.text === ' ' && tokens[j + 1]!.isWord) {
        wordIdx.push(j + 1);
        j += 2;
      }
      if (wordIdx.length !== n) continue;
      const surface = wordIdx.map((k) => tokens[k]!.text).join(' ');
      const ids = index.lookupForm(surface);
      if (ids.length) {
        out.push({ text: text.slice(t.start, tokens[wordIdx[n - 1]!]!.end), entryIds: ids, isWord: true });
        i = wordIdx[n - 1]! + 1;
        matched = true;
      }
    }
    if (matched) continue;
    out.push({ text: t.text, entryIds: index.lookupForm(t.text), isWord: true });
    i++;
  }
  return out;
}
