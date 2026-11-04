/**
 * Streak System – pure logic (no storage, no UI).
 *
 * Definitions
 * - A study date is completed when the daily session is completed (mandatory
 *   review + one module). `recordCompletion` is idempotent per date.
 * - Dates are settled lazily: when the app opens on date T, every unsettled
 *   date before T is settled. A missed date consumes one freeze if a streak
 *   is running and a freeze is available; otherwise the streak resets to 0.
 * - A frozen date preserves the streak but does not increase it and does not
 *   count as a completed study day.
 * - The current date is never settled as missed – the user still has time.
 * - A freeze is earned for every N completed days (config), up to the max.
 * Rules come from StreakConfig, never from UI code.
 */
import type { StreakConfig } from '../config/appConfig';
import { addDays, dateRange, diffDays, type StudyDate } from '../lib/date';
import type { StreakState } from '../storage/types';

export type StreakEvent =
  | { type: 'streak_increased'; current: number }
  | { type: 'streak_freeze_used'; date: StudyDate }
  | { type: 'streak_freeze_earned'; freezes: number }
  | { type: 'streak_reset'; previous: number };

export function initialStreak(today: StudyDate, cfg: StreakConfig): StreakState {
  return {
    current: 0,
    longest: 0,
    freezes: cfg.initialFreezes,
    lastSettledDate: addDays(today, -1),
    completedTowardFreeze: 0,
    totalCompletedDays: 0,
    history: {},
  };
}

/** Settle every date after `lastSettledDate` and before `today`. */
export function settleStreak(state: StreakState, today: StudyDate): { state: StreakState; events: StreakEvent[] } {
  const yesterday = addDays(today, -1);
  if (diffDays(state.lastSettledDate, yesterday) <= 0) return { state, events: [] };
  const s: StreakState = { ...state, history: { ...state.history } };
  const events: StreakEvent[] = [];
  for (const d of dateRange(addDays(state.lastSettledDate, 1), yesterday)) {
    if (s.history[d] === 'completed' || s.history[d] === 'frozen') continue;
    if (s.current > 0 && s.freezes > 0) {
      s.freezes -= 1;
      s.history[d] = 'frozen';
      events.push({ type: 'streak_freeze_used', date: d });
    } else if (s.current > 0) {
      events.push({ type: 'streak_reset', previous: s.current });
      s.current = 0;
    }
  }
  s.lastSettledDate = yesterday;
  return { state: s, events };
}

export function recordCompletion(
  state: StreakState,
  date: StudyDate,
  cfg: StreakConfig,
): { state: StreakState; events: StreakEvent[] } {
  const settled = settleStreak(state, date);
  let s = settled.state;
  const events = [...settled.events];
  // Already completed, or the date was already settled (e.g. clock moved backwards): no double counting.
  if (s.history[date] === 'completed' || diffDays(s.lastSettledDate, date) <= 0) return { state: s, events };
  s = { ...s, history: { ...s.history, [date]: 'completed' } };
  s.current += 1;
  s.longest = Math.max(s.longest, s.current);
  s.totalCompletedDays += 1;
  s.completedTowardFreeze += 1;
  events.push({ type: 'streak_increased', current: s.current });
  if (s.completedTowardFreeze >= cfg.earnFreezeEveryCompletedDays) {
    s.completedTowardFreeze = 0;
    if (s.freezes < cfg.maxFreezes) {
      s.freezes += 1;
      events.push({ type: 'streak_freeze_earned', freezes: s.freezes });
    }
  }
  return { state: s, events };
}

export type CalendarDay = { date: StudyDate; mark: 'completed' | 'frozen' | 'missed' | 'today' | 'today-done' | 'future' | 'before-start' };

export function calendarDays(state: StreakState, dates: StudyDate[], today: StudyDate, startDate: StudyDate): CalendarDay[] {
  return dates.map((date) => {
    const h = state.history[date];
    if (date === today) return { date, mark: h === 'completed' ? 'today-done' : 'today' };
    if (diffDays(today, date) > 0) return { date, mark: 'future' };
    if (h) return { date, mark: h };
    if (diffDays(startDate, date) < 0) return { date, mark: 'before-start' };
    return { date, mark: 'missed' };
  });
}
