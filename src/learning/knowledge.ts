/**
 * Personal knowledge model – documented criteria (see PEDAGOGY.md).
 *
 * introduced    – the word has been met (introduction or any exercise).
 * understood    – at least one first-try correct meaning exercise.
 * active        – understood + first-try correct spelling, and, if the word
 *                 has an inflection card, a first-try correct inflection answer.
 * consolidated  – every review card of the word has FSRS stability ≥ 21 days
 *                 AND a successful review happened ≥ 21 days after the word
 *                 entered the review pool. Nothing is ever called "permanent".
 */
import { repetitionConfig } from '../config/appConfig';
import type { ReviewCardRecord, ReviewEventRecord } from '../storage/types';

export type KnowledgeLevel = 'introduced' | 'understood' | 'active' | 'consolidated';
export const KNOWLEDGE_ORDER: KnowledgeLevel[] = ['introduced', 'understood', 'active', 'consolidated'];

export function knowledgeLevel(cards: ReviewCardRecord[], events: ReviewEventRecord[]): KnowledgeLevel | null {
  if (!cards.length && !events.length) return null;
  const firstTry = (dim: string) => events.some((e) => e.dimension === dim && e.correct && e.attempts === 1);
  const understood = firstTry('meaning');
  const hasProduction = cards.some((c) => c.dimension === 'spelling');
  const needsInflection = cards.some((c) => c.dimension === 'inflection');
  const active = understood && hasProduction && firstTry('spelling') && (!needsInflection || firstTry('inflection'));

  const days = repetitionConfig.consolidatedStabilityDays;
  const stable = cards.length > 0 && cards.every((c) => c.sched.stability >= days);
  const poolStart = Math.min(...cards.map((c) => c.createdAt));
  const lateSuccess = events.some((e) => e.phase !== 'learn' && e.correct && e.at - poolStart >= days * 86_400_000);
  if (stable && lateSuccess && understood) return 'consolidated';
  if (active) return 'active';
  if (understood) return 'understood';
  return 'introduced';
}

export type DifficultItem = { senseId: string; dimension: string; failures: number; total: number };

/** Words the learner often gets wrong, per dimension (review phases + learning). */
export function difficultItems(events: ReviewEventRecord[], cards: ReviewCardRecord[]): DifficultItem[] {
  const by = new Map<string, DifficultItem>();
  for (const e of events) {
    const k = `${e.senseId}|${e.dimension}`;
    const it = by.get(k) ?? { senseId: e.senseId, dimension: e.dimension, failures: 0, total: 0 };
    it.total += 1;
    if (!e.correct || e.attempts > 1) it.failures += 1;
    by.set(k, it);
  }
  const lapses = new Map(cards.map((c) => [c.id, c.sched.lapses]));
  return [...by.values()]
    .filter((it) => (lapses.get(`${it.senseId}|${it.dimension}`) ?? 0) >= 2 || (it.total >= 3 && it.failures / it.total >= 0.4))
    .sort((a, b) => b.failures / b.total - a.failures / a.total || b.failures - a.failures);
}

/** Pairs of senses the learner has confused at least twice in choice exercises. */
export function confusedPairs(events: ReviewEventRecord[]): { a: string; b: string; count: number }[] {
  const m = new Map<string, number>();
  for (const e of events) {
    if (!e.confusedWithSenseId) continue;
    const [a, b] = [e.senseId, e.confusedWithSenseId].sort() as [string, string];
    m.set(`${a}|${b}`, (m.get(`${a}|${b}`) ?? 0) + 1);
  }
  return [...m.entries()].filter(([, n]) => n >= 2).map(([k, count]) => { const [a, b] = k.split('|') as [string, string]; return { a, b, count }; });
}
