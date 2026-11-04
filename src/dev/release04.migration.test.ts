/**
 * Phase G (0.4 release gate): 0.3.1 → 0.4 with a complete user data set –
 * finished module, a module step in progress, FSRS cards with review history,
 * daily sessions, streak, saved words and settings – with
 * resetProgressOnUpdate both false and true.
 */
import { APP_VERSION } from '../config/appConfig';
import { completeReviewItem, ensureDailySession, registerModuleCompletion } from '../daily/dailySession';
import { advanceLearnSession, isLearnSessionDone } from '../learning/learnPlan';
import { completeStep, getModuleProgress, saveLearnState, startOrResumeLearn } from '../modules/moduleService';
import { toggleSaved } from '../modules/savedWords';
import { exportBackup, undoLastImport } from '../storage/backup';
import { getDb, getMeta, setMeta } from '../storage/db';
import { getSettings, updateSettings } from '../storage/settings';
import { setupTestEnv } from '../test/helpers';
import { applyVersionResetWith } from './devTools';

const userTables = (d: Awaited<ReturnType<typeof exportBackup>>['data']) => ({
  cards: d.cards, reviewEvents: d.reviewEvents, moduleProgress: d.moduleProgress,
  dailySessions: d.dailySessions, savedWords: d.savedWords,
  meta: d.meta.filter((m) => !['appVersion', 'restorePoint', 'resetNotice'].includes(m.key)),
});

async function seedFull031User() {
  const env = await setupTestEnv('2026-11-02T09:00:00+01:00');
  await updateSettings({ dailyReviewCount: 20, furigana: false });
  // day 1: finish a whole module
  await ensureDailySession();
  const A = 'm.hemmet-vardag';
  let s = await startOrResumeLearn(A);
  while (!isLearnSessionDone(s)) s = advanceLearnSession(s, s.plan[s.index]!.kind === 'intro' ? 'seen' : 'first');
  await saveLearnState(A, s);
  for (const step of ['learn', 'read', 'converse'] as const) await completeStep(A, step);
  await registerModuleCompletion(A);
  // day 2: review a few cards, then leave the next module's step 1 half done
  env.advanceDays(1);
  const day = await ensureDailySession();
  for (const id of day.reviewPlan.slice(0, 3)) {
    const [senseId, dim] = id.split('|') as [string, 'meaning'];
    await completeReviewItem(day.date, id, { senseId, dimension: dim, exerciseType: 'meaning_choice', outcome: 'first', attempts: 1 });
  }
  let s2 = await startOrResumeLearn('m.material-amnen');
  for (let i = 0; i < 6; i++) s2 = advanceLearnSession(s2, 'first');
  await saveLearnState('m.material-amnen', s2);
  await toggleSaved('s.arg.1');
  await setMeta('appVersion', '0.3.1');
  return env;
}

describe('0.3.1 → 0.4 release migration', () => {
  it('runs as a newer version than 0.3.1', () => {
    expect(APP_VERSION).not.toBe('0.3.1');
  });

  it('resetProgressOnUpdate=false: every table survives unchanged and the step in progress resumes', async () => {
    await seedFull031User();
    const before = userTables((await exportBackup()).data);
    expect(before.cards.length).toBeGreaterThan(20);
    expect(before.reviewEvents.length).toBeGreaterThan(0);
    expect(before.dailySessions.length).toBe(2);
    expect(before.savedWords.length).toBe(1);
    expect(before.meta.some((m) => m.key === 'streak')).toBe(true);
    expect(await applyVersionResetWith({ resetProgressOnUpdate: false })).toBe(false);
    expect(userTables((await exportBackup()).data)).toEqual(before);
    expect(await getMeta('appVersion')).toBe(APP_VERSION);
    expect((await startOrResumeLearn('m.material-amnen')).index).toBe(6);
    expect((await getModuleProgress('m.hemmet-vardag'))?.completedAt).toBeTruthy();
  });

  it('resetProgressOnUpdate=true (the decided 0.4 behaviour): progress cleared, settings kept, undo restores everything once', async () => {
    await seedFull031User();
    const before = userTables((await exportBackup()).data);
    expect(await applyVersionResetWith({ resetProgressOnUpdate: true })).toBe(true);
    const db = getDb();
    for (const t of ['cards', 'reviewEvents', 'moduleProgress', 'dailySessions', 'savedWords'] as const) expect(await db.table(t).count(), t).toBe(0);
    expect(await getMeta('streak')).toBeUndefined();
    expect(await getSettings()).toMatchObject({ timeZone: 'Europe/Stockholm', dailyReviewCount: 20, furigana: false });
    expect(await getMeta('restorePoint')).toBeTruthy();
    // undo → the full 0.3.1 data set is back and is not wiped again at the next start
    expect(await undoLastImport()).toBe(true);
    expect(userTables((await exportBackup()).data)).toEqual(before);
    expect(await applyVersionResetWith({ resetProgressOnUpdate: true })).toBe(false);
    expect((await startOrResumeLearn('m.material-amnen')).index).toBe(6);
  });
});
