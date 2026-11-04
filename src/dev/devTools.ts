/**
 * Developer tools for the development phase (devConfig in appConfig.ts).
 * They make progress-gated systems testable without waiting days:
 * version reset, time travel, unlocking, and shortcuts.
 */
import { APP_VERSION, devConfig } from '../config/appConfig';
import { getContent } from '../content/repository';
import { dimensionsForWord } from '../learning/learnPlan';
import { addDays } from '../lib/date';
import { now, setClockOffsetDays, todayStudyDate } from '../lib/clock';
import { addWordsToReview } from '../repetition/reviewService';
import { getDb, getMeta, setMeta, USER_TABLES } from '../storage/db';
import { exportBackup } from '../storage/backup';

export type DevState = { clockOffsetDays: number; unlockAllSteps: boolean };
const DEFAULT_DEV: DevState = { clockOffsetDays: 0, unlockAllSteps: false };
let devState: DevState = { ...DEFAULT_DEV };

export const getDevState = () => devState;
export const isUnlockAll = () => devConfig.toolsEnabled && devState.unlockAllSteps;

export async function loadDevState(): Promise<DevState> {
  devState = devConfig.toolsEnabled ? { ...DEFAULT_DEV, ...((await getMeta<DevState>('dev')) ?? {}) } : { ...DEFAULT_DEV };
  setClockOffsetDays(devState.clockOffsetDays);
  return devState;
}

export async function updateDevState(patch: Partial<DevState>): Promise<DevState> {
  devState = { ...devState, ...patch };
  setClockOffsetDays(devState.clockOffsetDays);
  await setMeta('dev', devState);
  return devState;
}

/** Wipe all learning progress (keeps settings and onboarding). A restore point is saved first. */
export async function resetAllProgress(reason: string): Promise<void> {
  const db = getDb();
  const backup = await exportBackup(now());
  const keep = await db.meta.where('key').anyOf(['settings', 'onboarded']).toArray();
  await db.transaction('rw', USER_TABLES.map((t) => db.table(t)), async () => {
    for (const t of USER_TABLES) await db.table(t).clear();
    await db.meta.bulkPut(keep);
    await db.meta.put({ key: 'restorePoint', value: { createdAt: Date.now(), data: backup.data } });
    await db.meta.put({ key: 'appVersion', value: APP_VERSION });
    await db.meta.put({ key: 'resetNotice', value: reason });
  });
  devState = { ...DEFAULT_DEV };
  setClockOffsetDays(0);
}

/**
 * Called once at startup. During development (resetProgressOnUpdate) every
 * new app version starts from zero. Returns true if a reset happened.
 */
export async function applyVersionReset(): Promise<boolean> {
  return applyVersionResetWith(devConfig);
}

/** Same as applyVersionReset with an explicit config (tests: resetProgressOnUpdate true/false). */
export async function applyVersionResetWith(cfg: { resetProgressOnUpdate: boolean }): Promise<boolean> {
  const stored = await getMeta<string>('appVersion');
  if (stored === APP_VERSION) return false;
  const db = getDb();
  const counts = await Promise.all([db.cards.count(), db.moduleProgress.count(), db.dailySessions.count(), db.savedWords.count(), db.reviewEvents.count()]);
  const hasData = counts.some((n) => n > 0);
  if (cfg.resetProgressOnUpdate && hasData) {
    await resetAllProgress(`Ny version ${APP_VERSION}: all progression har nollställts (utvecklingsläge).`);
    return true;
  }
  await setMeta('appVersion', APP_VERSION);
  return false;
}

/** Put every module word into the review pool as if learned yesterday (so it can be reviewed today). */
export async function addAllWordsToReview(): Promise<number> {
  const repo = getContent();
  const yesterday = addDays(await todayStudyDate(), -1);
  const at = new Date(now().getTime() - 86_400_000);
  const words = repo.modules.flatMap((m) => m.words.map((w) => ({ senseId: w.senseId, dimensions: dimensionsForWord(w, repo), ratings: {} })));
  const n = await addWordsToReview(words, 'module', at, yesterday);
  await recreateTodaysReview();
  return n;
}

/** Make every review card due now and rebuild today's review plan. */
export async function makeAllCardsDue(): Promise<number> {
  const db = getDb();
  const t = now().getTime() - 60_000;
  const cards = await db.cards.toArray();
  await db.cards.bulkPut(cards.map((c) => ({ ...c, due: t })));
  await recreateTodaysReview();
  return cards.length;
}

/** Throw away today's fixed review plan so it is planned again (module completions are kept). */
export async function recreateTodaysReview(): Promise<void> {
  const db = getDb();
  const today = await todayStudyDate();
  const rec = await db.dailySessions.get(today);
  await db.dailySessions.delete(today);
  const { ensureDailySession } = await import('../daily/dailySession');
  const fresh = await ensureDailySession(now());
  if (rec) {
    const merged = { ...fresh, modulesCompleted: rec.modulesCompleted, extraReviewsDone: rec.extraReviewsDone };
    await db.dailySessions.put(merged);
  }
}

/** Mark today's mandatory review as done without answering (counts toward the streak). */
export async function completeTodaysReviewInstantly(): Promise<void> {
  const db = getDb();
  const { ensureDailySession, registerModuleCompletion } = await import('../daily/dailySession');
  const rec = await ensureDailySession(now());
  await db.dailySessions.put({ ...rec, reviewIndex: rec.reviewPlan.length, reviewCompletedAt: now().getTime() });
  // re-run day completion check through a no-op module registration if a module is already done
  if (rec.modulesCompleted[0]) await registerModuleCompletion(rec.modulesCompleted[0], now());
}
