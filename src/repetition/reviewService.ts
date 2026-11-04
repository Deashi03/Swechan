/**
 * Repetition Engine – persistence-facing operations.
 */
import type { StudyDate } from '../lib/date';
import { getDb } from '../storage/db';
import type { Dimension, ExercisePhase, Rating, ReviewCardRecord, ReviewEventRecord } from '../storage/types';
import type { ExerciseResult, Outcome } from '../learning/exercises/types';
import { difficultItems } from '../learning/knowledge';
import { getScheduler } from './fsrsScheduler';

export const cardId = (senseId: string, dim: Dimension) => `${senseId}|${dim}`;

export function outcomeToRating(o: Outcome): Rating {
  return o === 'first' ? 'good' : o === 'retry' ? 'hard' : 'again';
}

export type NewWord = { senseId: string; dimensions: Dimension[]; ratings: Partial<Record<Dimension, Rating>> };

/**
 * Put words into the review pool. Existing cards (same sense learned in an
 * earlier module) are kept untouched – history is never reset.
 * The initial rating comes from the learner's performance during introduction.
 */
export async function addWordsToReview(words: NewWord[], source: ReviewCardRecord['source'], at: Date, today: StudyDate): Promise<number> {
  const db = getDb();
  const sch = getScheduler();
  let created = 0;
  await db.transaction('rw', db.cards, async () => {
    for (const w of words) {
      for (const dim of w.dimensions) {
        const id = cardId(w.senseId, dim);
        if (await db.cards.get(id)) continue;
        const st = sch.review(sch.initial(at), w.ratings[dim] ?? 'hard', at);
        await db.cards.add({ id, senseId: w.senseId, dimension: dim, createdDate: today, createdAt: at.getTime(), due: st.due, sched: st.sched, source });
        created++;
      }
    }
  });
  return created;
}

function eventFrom(result: ExerciseResult, phase: ExercisePhase, at: Date, today: StudyDate): ReviewEventRecord {
  return {
    senseId: result.senseId, dimension: result.dimension, exerciseType: result.exerciseType, phase,
    correct: result.outcome !== 'failed', attempts: result.attempts, at: at.getTime(), date: today,
    ...(result.confusedWithSenseId ? { confusedWithSenseId: result.confusedWithSenseId } : {}),
  };
}

/** Log an exercise done while learning a module (does not touch the schedule). */
export async function logLearnEvent(result: ExerciseResult, at: Date, today: StudyDate): Promise<void> {
  await getDb().reviewEvents.add(eventFrom(result, 'learn', at, today));
}

/** Apply a review result to the card's schedule and log the event. Must run inside a transaction covering cards + reviewEvents. */
export async function applyReview(cardIdValue: string, result: ExerciseResult, phase: ExercisePhase, at: Date, today: StudyDate): Promise<ReviewCardRecord | undefined> {
  const db = getDb();
  const card = await db.cards.get(cardIdValue);
  if (!card) return undefined;
  const rating = outcomeToRating(result.outcome);
  const next = getScheduler().review({ sched: card.sched, due: card.due }, rating, at);
  const updated: ReviewCardRecord = { ...card, sched: next.sched, due: next.due };
  await db.cards.put(updated);
  await db.reviewEvents.add({ ...eventFrom(result, phase, at, today), cardId: card.id, rating, nextDue: next.due });
  return updated;
}

export async function getDifficultCardIds(): Promise<Set<string>> {
  const db = getDb();
  const items = difficultItems(await db.reviewEvents.toArray(), await db.cards.toArray());
  return new Set(items.map((i) => cardId(i.senseId, i.dimension as Dimension)));
}
