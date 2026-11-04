/**
 * Global search across modules, categories and words, with typed results.
 */
import { normalizeJapanese, stripFurigana, toKanaReading } from '../content/furigana';
import type { ContentRepository } from '../content/repository';
import type { DictionaryHit, DictionaryIndex } from './searchIndex';
import { normalizeQuery } from './searchIndex';

export type GlobalResult =
  | { type: 'module'; id: string }
  | { type: 'category'; id: string }
  | { type: 'word'; hit: DictionaryHit };

function matches(q: string, ...fields: string[]): boolean {
  return fields.some((f) => {
    const n = normalizeQuery(f);
    return n.includes(q) || normalizeJapanese(toKanaReading(f)).includes(q) || normalizeQuery(stripFurigana(f)).includes(q);
  });
}

export function globalSearch(query: string, repo: ContentRepository, index: DictionaryIndex): GlobalResult[] {
  const q = normalizeQuery(query);
  if (!q) return [];
  const modules: GlobalResult[] = repo.modules
    .filter((m) => matches(q, m.titleSv, m.titleJa, m.descriptionSv, ...m.tags))
    .map((m) => ({ type: 'module', id: m.id }));
  const categories: GlobalResult[] = repo.categories
    .filter((c) => matches(q, c.nameSv, c.nameJa))
    .map((c) => ({ type: 'category', id: c.id }));
  const seenEntries = new Set<string>();
  const words: GlobalResult[] = [];
  for (const hit of index.search(q, 20)) {
    if (seenEntries.has(hit.entryId)) continue;
    seenEntries.add(hit.entryId);
    words.push({ type: 'word', hit });
  }
  return [...modules, ...categories, ...words];
}
