/**
 * Daily review selection (pure).
 *
 * Priority: (1) due cards, lowest retrievability first, known-difficult cards
 * boosted; (2) if fewer than the target are due, supplement with not-yet-due
 * cards with the lowest retrievability (early review – see fsrsScheduler.ts).
 * Prefers one card per sense so a session covers many different words, and
 * orders the result so the same word never appears twice in a row.
 * Cards created today (today's new module words) are excluded.
 */
import { createRng, shuffle } from '../lib/random';
import { toStudyDate, type StudyDate } from '../lib/date';
import type { ReviewCardRecord } from '../storage/types';

export type SelectionInput = {
  cards: ReviewCardRecord[];
  now: Date;
  today: StudyDate;
  timeZone: string | null;
  limit: number;
  retrievability: (c: ReviewCardRecord) => number;
  difficultCardIds?: Set<string>;
  /** Cards that must not be picked (e.g. already reviewed today). */
  excludeCardIds?: Set<string>;
  seed?: number;
};

export type SelectionResult = { cardIds: string[]; dueCount: number; debt: number; eligibleCount: number };

export function isDue(card: ReviewCardRecord, today: StudyDate, timeZone: string | null): boolean {
  return toStudyDate(new Date(card.due), timeZone) <= today;
}

function pickDistinct(sorted: ReviewCardRecord[], limit: number, already: ReviewCardRecord[]): ReviewCardRecord[] {
  const picked = [...already];
  const senses = new Set(picked.map((c) => c.senseId));
  const ids = new Set(picked.map((c) => c.id));
  for (const c of sorted) {
    if (picked.length >= limit) break;
    if (!senses.has(c.senseId)) { picked.push(c); senses.add(c.senseId); ids.add(c.id); }
  }
  for (const c of sorted) {
    if (picked.length >= limit) break;
    if (!ids.has(c.id)) { picked.push(c); ids.add(c.id); }
  }
  return picked;
}

/** Reorder so consecutive items have different senses where possible. */
export function spreadBySense<T extends { senseId: string }>(items: T[]): T[] {
  const rest = [...items];
  const out: T[] = [];
  while (rest.length) {
    const prev = out[out.length - 1];
    const idx = rest.findIndex((x) => x.senseId !== prev?.senseId);
    out.push(rest.splice(idx === -1 ? 0 : idx, 1)[0]!);
  }
  return out;
}

export function selectReviewCards(input: SelectionInput): SelectionResult {
  const { today, timeZone, limit } = input;
  const difficult = input.difficultCardIds ?? new Set<string>();
  const exclude = input.excludeCardIds ?? new Set<string>();
  const eligible = input.cards.filter((c) => c.createdDate < today && !exclude.has(c.id));
  // Score and due-state are computed once per card: the comparator runs O(n log n) times, and both
  // retrievability and study-date conversion are too costly to repeat for large card pools.
  const scores = new Map<string, number>();
  for (const c of eligible) scores.set(c.id, input.retrievability(c) - (difficult.has(c.id) ? 0.15 : 0));
  const byScore = (a: ReviewCardRecord, b: ReviewCardRecord) => scores.get(a.id)! - scores.get(b.id)! || a.id.localeCompare(b.id);

  const due: ReviewCardRecord[] = [];
  const notDue: ReviewCardRecord[] = [];
  for (const c of eligible) (isDue(c, today, timeZone) ? due : notDue).push(c);
  due.sort(byScore);
  notDue.sort(byScore);

  let picked = pickDistinct(due, limit, []);
  const dueTaken = picked.length;
  if (picked.length < limit) picked = pickDistinct(notDue, limit, picked);

  const rng = createRng(input.seed ?? 1);
  const ordered = spreadBySense(shuffle(picked, rng));
  return { cardIds: ordered.map((c) => c.id), dueCount: due.length, debt: Math.max(0, due.length - dueTaken), eligibleCount: eligible.length };
}
