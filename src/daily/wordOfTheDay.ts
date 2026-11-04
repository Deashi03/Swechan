import { getContent, type SenseRef } from '../content/repository';
import { hashString } from '../lib/random';

/**
 * "Dagens svenska ord": a deterministic pick per study date (same word all
 * day, on every device). Prefers headwords with a cultural/usage note or a
 * concrete everyday word; any dictionary sense can appear.
 */
export function wordOfTheDay(date: string): SenseRef | undefined {
  const repo = getContent();
  const senses = repo.entries.flatMap((e) => e.senses.map((s) => repo.getSense(s.id)!)).filter(Boolean);
  if (!senses.length) return undefined;
  return senses[hashString(`wotd:${date}`) % senses.length];
}
