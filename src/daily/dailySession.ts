/**
 * Daily Session System.
 *
 * A study day = (A) mandatory review of earlier-learned words + (B) one
 * completed module, in any order. Today's review plan is fixed when the day
 * starts so progress like "7/25" survives app restarts. Words learned today
 * are never part of today's mandatory review.
 */
import { sessionConfig } from '../config/appConfig';
import { getContent } from '../content/repository';
import { emit } from '../feedback/events';
import type { ExerciseResult } from '../learning/exercises/types';
import { now as clockNow, todayStudyDate } from '../lib/clock';
import { hashString } from '../lib/random';
import { applyReview, getDifficultCardIds } from '../repetition/reviewService';
import { getScheduler } from '../repetition/fsrsScheduler';
import { selectReviewCards, isDue } from '../repetition/selection';
import { markDayCompleted, loadStreak } from '../streak/streakService';
import { getDb } from '../storage/db';
import { getSettings } from '../storage/settings';
import type { DailySessionRecord } from '../storage/types';

/**
 * Cards whose sense still exists in the content. A sense can disappear from a
 * release (e.g. a misspelt duplicate merged into the correct entry); its old
 * cards may come back through a restore point or a backup and must never block
 * a review session.
 */
async function liveCards() {
  const repo = getContent();
  return (await getDb().cards.toArray()).filter((c) => !!repo.getSense(c.senseId));
}

async function planReview(at: Date, today: string, limit: number, exclude?: Set<string>) {
  const settings = await getSettings();
  const sch = getScheduler();
  return selectReviewCards({
    cards: await liveCards(),
    now: at,
    today,
    timeZone: settings.timeZone,
    limit,
    retrievability: (c) => sch.retrievability({ sched: c.sched, due: c.due }, at),
    difficultCardIds: await getDifficultCardIds(),
    excludeCardIds: exclude,
    seed: hashString(today),
  });
}

/** Get (creating if needed) today's session. Also settles the streak for missed days. */
export async function ensureDailySession(at: Date = clockNow()): Promise<DailySessionRecord> {
  const db = getDb();
  const today = await todayStudyDate(at);
  await loadStreak(today);
  const existing = await db.dailySessions.get(today);
  if (existing) return existing;
  const settings = await getSettings();
  const sel = await planReview(at, today, settings.dailyReviewCount);
  const rec: DailySessionRecord = {
    date: today,
    reviewTarget: sel.cardIds.length,
    reviewPlan: sel.cardIds,
    reviewIndex: 0,
    noReviewMaterial: sel.cardIds.length === 0,
    ...(sel.cardIds.length === 0 ? { reviewCompletedAt: at.getTime() } : {}),
    modulesCompleted: [],
    extraReviewsDone: 0,
  };
  // put-if-absent inside a transaction protects against double creation (two tabs / rapid re-render)
  return db.transaction('rw', db.dailySessions, async () => {
    const again = await db.dailySessions.get(today);
    if (again) return again;
    await db.dailySessions.add(rec);
    return rec;
  });
}

async function maybeCompleteDay(rec: DailySessionRecord, at: Date): Promise<DailySessionRecord> {
  if (rec.completedAt || !rec.reviewCompletedAt || rec.modulesCompleted.length === 0) return rec;
  const done = { ...rec, completedAt: at.getTime() };
  await getDb().dailySessions.put(done);
  await markDayCompleted(rec.date);
  emit({ type: 'daily_session_completed', date: rec.date });
  return done;
}

/** Record one answered task of today's mandatory review. */
export async function completeReviewItem(date: string, cardIdValue: string, result: ExerciseResult, at: Date = clockNow()): Promise<DailySessionRecord> {
  const db = getDb();
  const rec = await db.transaction('rw', db.dailySessions, db.cards, db.reviewEvents, async () => {
    const r = await db.dailySessions.get(date);
    if (!r) throw new Error(`No daily session for ${date}`);
    if (r.reviewPlan[r.reviewIndex] !== cardIdValue) return r; // stale/duplicate submit – ignore
    await applyReview(cardIdValue, result, 'review', at, date);
    const next: DailySessionRecord = { ...r, reviewIndex: r.reviewIndex + 1 };
    if (next.reviewIndex >= next.reviewPlan.length && !next.reviewCompletedAt) next.reviewCompletedAt = at.getTime();
    await db.dailySessions.put(next);
    return next;
  });
  if (rec.reviewCompletedAt && rec.reviewIndex === rec.reviewPlan.length && !rec.completedAt) emit({ type: 'review_completed' });
  return maybeCompleteDay(rec, at);
}

export async function registerModuleCompletion(moduleId: string, at: Date = clockNow()): Promise<DailySessionRecord> {
  const rec = await ensureDailySession(at);
  const next = rec.modulesCompleted.includes(moduleId) ? rec : { ...rec, modulesCompleted: [...rec.modulesCompleted, moduleId] };
  await getDb().dailySessions.put(next);
  return maybeCompleteDay(next, at);
}

/** Optional extra reviews beyond the daily target – most urgent first. */
export async function planExtraReviews(count: number, at: Date = clockNow()): Promise<string[]> {
  const db = getDb();
  const rec = await ensureDailySession(at);
  const today = rec.date;
  const reviewedToday = new Set((await db.reviewEvents.where('date').equals(today).toArray()).map((e) => e.cardId).filter((x): x is string => !!x));
  const exclude = new Set([...rec.reviewPlan, ...reviewedToday]);
  return (await planReview(at, today, count, exclude)).cardIds;
}

export async function completeExtraReview(cardIdValue: string, result: ExerciseResult, at: Date = clockNow()): Promise<void> {
  const db = getDb();
  const today = await todayStudyDate(at);
  await db.transaction('rw', db.dailySessions, db.cards, db.reviewEvents, async () => {
    await applyReview(cardIdValue, result, 'extra', at, today);
    const r = await db.dailySessions.get(today);
    if (r) await db.dailySessions.put({ ...r, extraReviewsDone: r.extraReviewsDone + 1 });
  });
}

export type ReviewLoad = { dueToday: number; coveredToday: number; debt: number; warn: boolean };

/** Review debt: due cards that today's mandatory session does not cover. */
export async function reviewLoad(at: Date = clockNow()): Promise<ReviewLoad> {
  const db = getDb();
  const settings = await getSettings();
  const rec = await ensureDailySession(at);
  const today = rec.date;
  const reviewedToday = new Set((await db.reviewEvents.where('date').equals(today).toArray()).map((e) => e.cardId));
  const remainingPlan = new Set(rec.reviewPlan.slice(rec.reviewIndex));
  const due = (await liveCards()).filter((c) => c.createdDate < today && isDue(c, today, settings.timeZone) && !reviewedToday.has(c.id));
  const debt = due.filter((c) => !remainingPlan.has(c.id)).length;
  return { dueToday: due.length, coveredToday: rec.reviewPlan.length, debt, warn: debt >= sessionConfig.debtWarningThreshold };
}
