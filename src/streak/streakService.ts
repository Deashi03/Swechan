import { streakConfig } from '../config/appConfig';
import { emit } from '../feedback/events';
import type { StudyDate } from '../lib/date';
import { getMeta, setMeta } from '../storage/db';
import type { StreakState } from '../storage/types';
import { initialStreak, recordCompletion, settleStreak, type StreakEvent } from './streak';

function publish(events: StreakEvent[]) {
  for (const e of events) {
    if (e.type === 'streak_increased') emit({ type: 'streak_increased', current: e.current });
    if (e.type === 'streak_freeze_used') emit({ type: 'streak_freeze_used', date: e.date });
    if (e.type === 'streak_freeze_earned') emit({ type: 'streak_freeze_earned', freezes: e.freezes });
  }
}

/** Load the streak and settle any days that passed since the app was last opened. */
export async function loadStreak(today: StudyDate): Promise<StreakState> {
  if (!(await getMeta<string>('installDate'))) await setMeta('installDate', today);
  const stored = (await getMeta<StreakState>('streak')) ?? initialStreak(today, streakConfig);
  const { state, events } = settleStreak(stored, today);
  if (state !== stored || !(await getMeta('streak'))) await setMeta('streak', state);
  publish(events);
  return state;
}

export async function markDayCompleted(today: StudyDate): Promise<StreakState> {
  const current = await loadStreak(today);
  const { state, events } = recordCompletion(current, today, streakConfig);
  await setMeta('streak', state);
  publish(events);
  return state;
}
