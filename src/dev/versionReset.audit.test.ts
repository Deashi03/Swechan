/**
 * Phase A audit (0.4): version-bound development reset, restore point and
 * backup/migration interplay. These tests document the intended behaviour.
 */
import { APP_VERSION } from '../config/appConfig';
import { addWordsToReview } from '../repetition/reviewService';
import { exportBackup, importBackup, undoLastImport } from '../storage/backup';
import { getDb, getMeta, setMeta } from '../storage/db';
import { setupTestEnv } from '../test/helpers';
import { applyVersionReset, resetAllProgress } from './devTools';

async function seedOldVersionUser(version: string | null) {
  const env = await setupTestEnv();
  if (version) await setMeta('appVersion', version);
  await addWordsToReview([{ senseId: 's.kök.1', dimensions: ['meaning', 'spelling'], ratings: {} }], 'module', env.now(), '2026-03-02');
  await getDb().savedWords.put({ senseId: 's.arg.1', savedAt: 1, queuedForLearning: false });
  return env;
}

describe('version reset audit', () => {
  it('undoing a development reset is NOT wiped again at the next start', async () => {
    await seedOldVersionUser('0.3.0');
    expect(await applyVersionReset()).toBe(true);
    expect(await getDb().cards.count()).toBe(0);
    expect(await undoLastImport()).toBe(true);
    expect(await getDb().cards.count()).toBe(2);
    // next app start with the same version: data must survive
    expect(await applyVersionReset()).toBe(false);
    expect(await getDb().cards.count()).toBe(2);
  });

  it('importing an older backup does not trigger a reset at the next start', async () => {
    await seedOldVersionUser('0.3.0');
    const old = await exportBackup();
    await setupTestEnv();
    await setMeta('appVersion', APP_VERSION);
    expect(old.data.meta.find((m) => m.key === 'appVersion')?.value).toBe('0.3.0');
    expect((await importBackup(JSON.stringify(old))).ok).toBe(true);
    expect(await getMeta('appVersion')).toBe(APP_VERSION);
    expect(await applyVersionReset()).toBe(false);
    expect(await getDb().cards.count()).toBe(2);
  });

  it('a user with only saved words is treated as having data', async () => {
    await setupTestEnv();
    await setMeta('appVersion', '0.3.0');
    await getDb().savedWords.put({ senseId: 's.arg.1', savedAt: 1, queuedForLearning: false });
    expect(await applyVersionReset()).toBe(true);
    expect(await getDb().savedWords.count()).toBe(0);
  });

  it('users from before version tracking (no appVersion stored) are reset once, then stable', async () => {
    await seedOldVersionUser(null);
    expect(await applyVersionReset()).toBe(true);
    expect(await applyVersionReset()).toBe(false);
  });

  it('the restore point holds the complete pre-reset data, but never a nested restore point', async () => {
    await seedOldVersionUser('0.3.0');
    await resetAllProgress('test 1');
    await addWordsToReview([{ senseId: 's.golv.1', dimensions: ['meaning'], ratings: {} }], 'module', new Date(), '2026-03-03');
    await resetAllProgress('test 2');
    const rp = (await getDb().meta.get('restorePoint'))!.value as { data: { cards: unknown[]; meta: { key: string }[] } };
    expect(rp.data.cards.length).toBe(1); // only the latest generation is kept
    expect(rp.data.meta.some((m) => m.key === 'restorePoint')).toBe(false);
  });

  it('with resetProgressOnUpdate=false a version change keeps all data', async () => {
    await seedOldVersionUser('0.3.0');
    const { applyVersionResetWith } = await import('./devTools');
    expect(await applyVersionResetWith({ resetProgressOnUpdate: false })).toBe(false);
    expect(await getDb().cards.count()).toBe(2);
    expect(await getMeta('appVersion')).toBe(APP_VERSION);
  });
});
