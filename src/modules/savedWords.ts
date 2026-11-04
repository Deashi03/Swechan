/**
 * Personal word list ("Spara ord") and learning words outside modules.
 * A queued word gets the same introduction + exercises as module words
 * before it enters the review pool.
 */
import { getContent } from '../content/repository';
import { dimensionsForWord, newLearnSession } from '../learning/learnPlan';
import { now as clockNow, todayStudyDate } from '../lib/clock';
import { hashString } from '../lib/random';
import { addWordsToReview, outcomeToRating } from '../repetition/reviewService';
import { getDb, getMeta, setMeta } from '../storage/db';
import type { Dimension, LearnSessionState, Rating } from '../storage/types';

export async function toggleSaved(senseId: string, at: Date = clockNow()): Promise<boolean> {
  const db = getDb();
  const existing = await db.savedWords.get(senseId);
  if (existing) { await db.savedWords.delete(senseId); return false; }
  await db.savedWords.put({ senseId, savedAt: at.getTime(), queuedForLearning: false });
  return true;
}

export async function queueForLearning(senseId: string, at: Date = clockNow()): Promise<void> {
  const db = getDb();
  const existing = await db.savedWords.get(senseId);
  await db.savedWords.put({ ...(existing ?? { senseId, savedAt: at.getTime() }), queuedForLearning: true });
}

/** Queued words that are not yet in the review pool. */
export async function pendingPersonalWords(): Promise<string[]> {
  const db = getDb();
  const saved = await db.savedWords.toArray();
  const out: string[] = [];
  for (const w of saved) {
    if (!w.queuedForLearning || w.learnedAt) continue;
    if (await db.cards.where('senseId').equals(w.senseId).count()) continue;
    out.push(w.senseId);
  }
  return out;
}

const PERSONAL_BATCH = 5;
type PersonalLearn = { senseIds: string[]; learn: LearnSessionState };

export async function startOrResumePersonalLearn(at: Date = clockNow()): Promise<PersonalLearn | null> {
  const existing = await getMeta<PersonalLearn>('personalLearn');
  if (existing) return existing;
  const ids = (await pendingPersonalWords()).slice(0, PERSONAL_BATCH);
  if (!ids.length) return null;
  const words = ids.map((senseId) => ({ senseId, active: true }));
  const pl = { senseIds: ids, learn: newLearnSession(words, getContent(), hashString(`personal:${at.getTime()}`)) };
  await setMeta('personalLearn', pl);
  return pl;
}

export async function savePersonalLearn(pl: PersonalLearn): Promise<void> {
  await setMeta('personalLearn', pl);
}

export async function finishPersonalLearn(at: Date = clockNow()): Promise<void> {
  const pl = await getMeta<PersonalLearn>('personalLearn');
  if (!pl) return;
  const repo = getContent();
  const today = await todayStudyDate(at);
  const words = pl.senseIds.map((senseId) => {
    const dims = dimensionsForWord({ senseId, active: true }, repo);
    const ratings: Partial<Record<Dimension, Rating>> = {};
    for (const d of dims) { const r = pl.learn.results[`${senseId}|${d}`]; ratings[d] = r ? outcomeToRating(r) : 'hard'; }
    return { senseId, dimensions: dims, ratings };
  });
  await addWordsToReview(words, 'personal', at, today);
  const db = getDb();
  for (const id of pl.senseIds) {
    const w = await db.savedWords.get(id);
    if (w) await db.savedWords.put({ ...w, learnedAt: at.getTime() });
  }
  await getDb().meta.delete('personalLearn');
}
