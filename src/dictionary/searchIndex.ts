/**
 * Dictionary System – search index.
 *
 * Keys: Swedish lemma + every stored inflected form, Japanese gloss (kanji),
 * Japanese reading (kana, from furigana markup), alternative translations.
 * Lookup strategy: exact key (Map, O(1)) → prefix (binary search in a sorted
 * key array, O(log n + k)) → substring scan as a fallback only when few
 * results were found. This keeps keystroke search fast for tens of thousands
 * of entries without an external search library.
 */
import { normalizeJapanese, stripFurigana, toKanaReading } from '../content/furigana';
import { allForms } from '../content/morphology';
import type { ContentRepository } from '../content/repository';

export type MatchKind = 'lemma' | 'form' | 'japanese' | 'reading';
type Posting = { entryId: string; senseId?: string; kind: MatchKind };

export type DictionaryHit = {
  entryId: string;
  senseId?: string;
  kind: MatchKind;
  matchedKey: string;
  quality: 0 | 1 | 2; // 0 exact, 1 prefix, 2 substring
};

export function normalizeQuery(q: string): string {
  return normalizeJapanese(q).toLowerCase().replace(/\s+/g, ' ');
}

/** Split a Japanese gloss like "{洗|あら}う、{洗濯|せんたく}する；…" into separate search terms. */
function jaTerms(markup: string): { base: string; kana: string }[] {
  return markup
    .split(/[、；;,（）()]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => ({ base: normalizeQuery(stripFurigana(part)), kana: normalizeQuery(toKanaReading(part)) }));
}

export class DictionaryIndex {
  private exact = new Map<string, Posting[]>();
  private sortedKeys: string[] = [];

  constructor(repo: ContentRepository) {
    const add = (key: string, p: Posting) => {
      const k = normalizeQuery(key);
      if (!k) return;
      const list = this.exact.get(k);
      if (list) { if (!list.some((x) => x.entryId === p.entryId && x.senseId === p.senseId && x.kind === p.kind)) list.push(p); }
      else this.exact.set(k, [p]);
    };
    for (const e of repo.entries) {
      add(e.lemma, { entryId: e.id, kind: 'lemma' });
      for (const f of allForms(e)) if (f !== e.lemma.toLowerCase()) add(f, { entryId: e.id, kind: 'form' });
      for (const s of e.senses) {
        for (const t of [...jaTerms(s.ja), ...(s.jaAlt ?? []).flatMap(jaTerms)]) {
          add(t.base, { entryId: e.id, senseId: s.id, kind: 'japanese' });
          if (t.kana !== t.base) add(t.kana, { entryId: e.id, senseId: s.id, kind: 'reading' });
        }
      }
    }
    this.sortedKeys = [...this.exact.keys()].sort();
  }

  search(query: string, limit = 30): DictionaryHit[] {
    const q = normalizeQuery(query);
    if (!q) return [];
    const hits: DictionaryHit[] = [];
    const seen = new Set<string>();
    const push = (key: string, quality: 0 | 1 | 2) => {
      for (const p of this.exact.get(key) ?? []) {
        const id = `${p.entryId}|${p.senseId ?? ''}`;
        if (seen.has(id)) continue;
        seen.add(id);
        hits.push({ ...p, matchedKey: key, quality });
      }
    };
    push(q, 0);
    // prefix range via binary search
    let lo = 0, hi = this.sortedKeys.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (this.sortedKeys[mid]! < q) lo = mid + 1; else hi = mid; }
    for (let i = lo; i < this.sortedKeys.length && hits.length < limit; i++) {
      const k = this.sortedKeys[i]!;
      if (!k.startsWith(q)) break;
      if (k !== q) push(k, 1);
    }
    if (hits.length < limit && q.length >= 2) {
      for (const k of this.sortedKeys) {
        if (hits.length >= limit) break;
        if (!k.startsWith(q) && k.includes(q)) push(k, 2);
      }
    }
    // Entries before senses of same entry are deduplicated by the UI; keep order stable by quality then kind.
    const kindRank: Record<MatchKind, number> = { lemma: 0, japanese: 1, reading: 2, form: 3 };
    return hits.sort((a, b) => a.quality - b.quality || kindRank[a.kind] - kindRank[b.kind]).slice(0, limit);
  }

  /** Entry ids whose forms exactly match a (single- or multi-word) Swedish surface string. */
  lookupForm(surface: string): string[] {
    const list = this.exact.get(normalizeQuery(surface)) ?? [];
    return [...new Set(list.filter((p) => p.kind === 'lemma' || p.kind === 'form').map((p) => p.entryId))];
  }
}
