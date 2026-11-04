import { addWordsToReview } from '../repetition/reviewService';
import { setupTestEnv } from '../test/helpers';
import { exportBackup, hasRestorePoint, importBackup, undoLastImport } from './backup';
import { getDb, setMeta } from './db';
import { getSettings, updateSettings } from './settings';

describe('backup export/import', () => {
  it('round-trips all user data', async () => {
    const env = await setupTestEnv();
    await addWordsToReview([{ senseId: 's.kök.1', dimensions: ['meaning', 'spelling'], ratings: { meaning: 'good' } }], 'module', env.now(), '2026-03-02');
    await getDb().savedWords.put({ senseId: 's.arg.1', savedAt: 1, queuedForLearning: false });
    await updateSettings({ dailyReviewCount: 20 });
    await setMeta('streak', { current: 4, longest: 9, freezes: 1, lastSettledDate: '2026-03-01', completedTowardFreeze: 4, totalCompletedDays: 12, history: { '2026-03-01': 'completed' } });
    const backup = await exportBackup();
    const text = JSON.stringify(backup);

    await setupTestEnv(); // "new phone"
    expect(await getDb().cards.count()).toBe(0);
    const r = await importBackup(text);
    expect(r.ok).toBe(true);
    expect(await getDb().cards.count()).toBe(2);
    expect(await getDb().savedWords.get('s.arg.1')).toBeDefined();
    expect((await getSettings()).dailyReviewCount).toBe(20);
    expect(((await getDb().meta.get('streak'))!.value as { longest: number }).longest).toBe(9);
  });

  it('rejects invalid or corrupt files without touching existing data', async () => {
    const env = await setupTestEnv();
    await addWordsToReview([{ senseId: 's.kök.1', dimensions: ['meaning'], ratings: {} }], 'module', env.now(), '2026-03-02');
    for (const bad of ['not json', '{}', JSON.stringify({ format: 'swechan-backup', backupVersion: 1, appVersion: 'x', exportedAt: 'x', data: { meta: [], cards: [{ id: 1 }] } })]) {
      const r = await importBackup(bad);
      expect(r.ok).toBe(false);
    }
    const future = JSON.stringify({ ...(await exportBackup()), backupVersion: 99 });
    expect((await importBackup(future)).ok).toBe(false);
    expect(await getDb().cards.count()).toBe(1);
  });

  it('creates a restore point before import that can undo it', async () => {
    const env = await setupTestEnv();
    const empty = JSON.stringify(await exportBackup());
    await addWordsToReview([{ senseId: 's.kök.1', dimensions: ['meaning'], ratings: {} }], 'module', env.now(), '2026-03-02');
    expect((await importBackup(empty)).ok).toBe(true);
    expect(await getDb().cards.count()).toBe(0);
    expect(await hasRestorePoint()).not.toBeNull();
    expect(await undoLastImport()).toBe(true);
    expect(await getDb().cards.count()).toBe(1);
  });
});
