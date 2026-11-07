import { APP_VERSION } from '../config/appConfig';
import { ensureDailySession } from '../daily/dailySession';
import { setClockForTests, todayStudyDate } from '../lib/clock';
import { isStepUnlocked } from '../modules/moduleService';
import { addWordsToReview } from '../repetition/reviewService';
import { undoLastImport } from '../storage/backup';
import { getDb, getMeta, setMeta } from '../storage/db';
import { getSettings, updateSettings } from '../storage/settings';
import { setupTestEnv } from '../test/helpers';
import { addAllWordsToReview, applyVersionReset, completeTodaysReviewInstantly, loadDevState, makeAllCardsDue, updateDevState } from './devTools';

describe('development tools', () => {
  afterEach(async () => { await updateDevState({ clockOffsetDays: 0, unlockAllSteps: false }); });

  it('a new app version resets all progress but keeps settings, with a restore point', async () => {
    const env = await setupTestEnv();
    await updateSettings({ dailyReviewCount: 20 });
    await setMeta('onboarded', true);
    await setMeta('appVersion', '0.0.1');
    await addWordsToReview([{ senseId: 's.kök.1', dimensions: ['meaning'], ratings: {} }], 'module', env.now(), '2026-03-02');
    expect(await applyVersionReset()).toBe(true);
    expect(await getDb().cards.count()).toBe(0);
    expect((await getSettings()).dailyReviewCount).toBe(20);
    expect(await getMeta('onboarded')).toBe(true);
    expect(await getMeta('appVersion')).toBe(APP_VERSION);
    expect(await getMeta<string>('resetNotice')).toMatch(APP_VERSION);
    expect(await applyVersionReset()).toBe(false); // same version: nothing happens
    expect(await undoLastImport()).toBe(true); // restore point brings the data back
    expect(await getDb().cards.count()).toBe(1);
  });

  it('does not reset a brand-new install (no data)', async () => {
    await setupTestEnv();
    expect(await applyVersionReset()).toBe(false);
    expect(await getMeta('appVersion')).toBe(APP_VERSION);
  });

  it('time travel shifts the study date', async () => {
    await setupTestEnv();
    setClockForTests(null);
    await updateSettings({ timeZone: 'UTC' });
    const before = await todayStudyDate();
    await updateDevState({ clockOffsetDays: 1 });
    const after = await todayStudyDate();
    expect(new Date(after).getTime() - new Date(before).getTime()).toBe(86_400_000);
    await updateDevState({ clockOffsetDays: 0 });
    await loadDevState();
  });

  it('unlock-all opens every module step', async () => {
    await setupTestEnv();
    expect(isStepUnlocked(undefined, 'converse')).toBe(false);
    await updateDevState({ unlockAllSteps: true });
    expect(isStepUnlocked(undefined, 'converse')).toBe(true);
  });

  it('shortcuts fill the review pool, make cards due and complete today\'s review', async () => {
    await setupTestEnv();
    await ensureDailySession();
    // 40 modules are enough for the behaviour; all ~400 took > 60 s on CI (fake IndexedDB)
    const n = await addAllWordsToReview(40);
    expect(n).toBeGreaterThan(50);
    const day = (await getDb().dailySessions.toArray())[0]!;
    expect(day.reviewPlan.length).toBe(25);
    expect(await makeAllCardsDue()).toBe(await getDb().cards.count());
    await completeTodaysReviewInstantly();
    const after = (await getDb().dailySessions.toArray())[0]!;
    expect(after.reviewCompletedAt).toBeDefined();
  });
});
