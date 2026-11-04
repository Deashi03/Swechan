import { setClockForTests } from '../lib/clock';
import { setSchedulerForTests, FsrsScheduler } from '../repetition/fsrsScheduler';
import { resetDbForTests } from '../storage/db';
import { updateSettings } from '../storage/settings';

/** Fresh DB, deterministic scheduler, fixed time zone, controllable clock. */
export async function setupTestEnv(startIso = '2026-03-02T09:00:00+01:00') {
  await resetDbForTests();
  setSchedulerForTests(new FsrsScheduler({ fuzz: false }));
  let current = new Date(startIso);
  setClockForTests(() => current);
  await updateSettings({ timeZone: 'Europe/Stockholm' });
  return {
    now: () => current,
    set: (iso: string) => { current = new Date(iso); },
    advanceDays: (n: number) => { current = new Date(current.getTime() + n * 86_400_000); },
  };
}
