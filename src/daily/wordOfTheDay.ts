import { getContent, type LexRef } from '../content/repository';
import { hashString } from '../lib/random';

/**
 * "Dagens svenska ord": a deterministic pick per study date (same word all
 * day, on every device). Prefers headwords with a cultural/usage note or a
 * concrete everyday word; any dictionary sense can appear.
 */
export function wordOfTheDay(date: string): LexRef | undefined {
  const repo = getContent();
  // Kvalitetsplanen A4b: picked from the lexicon (always loaded); the sheet loads the full entry.
  const senses = repo.lexicon.flatMap((e) => e.senses.map((s) => repo.getLex(s.id)!)).filter(Boolean);
  if (!senses.length) return undefined;
  return senses[hashString(`wotd:${date}`) % senses.length];
}
