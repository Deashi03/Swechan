import { streakConfig } from '../config/appConfig';
import { addDays } from '../lib/date';
import { calendarDays, initialStreak, recordCompletion, settleStreak } from './streak';

const cfg = streakConfig;
const D0 = '2026-03-01';

function completeDays(start: string, n: number, s = initialStreak(start, cfg)) {
  for (let i = 0; i < n; i++) s = recordCompletion(s, addDays(start, i), cfg).state;
  return s;
}

describe('streak', () => {
  it('starts at zero with one freeze', () => {
    const s = initialStreak(D0, cfg);
    expect(s.current).toBe(0);
    expect(s.freezes).toBe(1);
  });

  it('increments when a day is completed', () => {
    const r = recordCompletion(initialStreak(D0, cfg), D0, cfg);
    expect(r.state.current).toBe(1);
    expect(r.events).toContainEqual({ type: 'streak_increased', current: 1 });
  });

  it('does not double-register the same day', () => {
    let s = recordCompletion(initialStreak(D0, cfg), D0, cfg).state;
    const again = recordCompletion(s, D0, cfg);
    s = again.state;
    expect(s.current).toBe(1);
    expect(s.totalCompletedDays).toBe(1);
    expect(again.events).toEqual([]);
  });

  it('a missed day with an available freeze keeps the streak', () => {
    let s = completeDays(D0, 3); // 1–3 March
    const r = settleStreak(s, addDays(D0, 4)); // 4 March missed, open app on 5 March
    s = r.state;
    expect(s.current).toBe(3);
    expect(s.freezes).toBe(0);
    expect(s.history[addDays(D0, 3)]).toBe('frozen');
    expect(r.events).toContainEqual({ type: 'streak_freeze_used', date: addDays(D0, 3) });
    s = recordCompletion(s, addDays(D0, 4), cfg).state;
    expect(s.current).toBe(4); // frozen day does not count as a completed day
    expect(s.totalCompletedDays).toBe(4);
  });

  it('a missed day without a freeze resets the streak', () => {
    let s = completeDays(D0, 2);
    s = { ...s, freezes: 0 };
    const r = settleStreak(s, addDays(D0, 3));
    expect(r.state.current).toBe(0);
    expect(r.state.longest).toBe(2);
    expect(r.events).toContainEqual({ type: 'streak_reset', previous: 2 });
  });

  it('several missed days consume one freeze each, then break', () => {
    let s = completeDays(D0, 7); // earns a 2nd freeze on day 7
    expect(s.freezes).toBe(2);
    s = settleStreak(s, addDays(D0, 9)).state; // days 8,9 missed (indices 7,8)
    expect(s.freezes).toBe(0);
    expect(s.current).toBe(7);
    s = settleStreak(s, addDays(D0, 11)).state; // day 10,11 missed → no freeze left
    expect(s.current).toBe(0);
  });

  it('earns a freeze after seven completed days, capped at the maximum', () => {
    let s = completeDays(D0, 7);
    expect(s.freezes).toBe(2);
    s = completeDays(addDays(D0, 7), 7, s);
    expect(s.freezes).toBe(cfg.maxFreezes);
    expect(s.current).toBe(14);
  });

  it('does not use a freeze when there is no streak to protect', () => {
    const s = settleStreak(initialStreak(D0, cfg), addDays(D0, 5)).state;
    expect(s.freezes).toBe(1);
    expect(s.current).toBe(0);
  });

  it('does not settle today as missed (date change handling)', () => {
    const s = completeDays(D0, 1);
    const sameDay = settleStreak(s, D0);
    expect(sameDay.events).toEqual([]);
    const nextDay = settleStreak(s, addDays(D0, 1));
    expect(nextDay.state.current).toBe(1); // yesterday completed, today still open
    expect(nextDay.events).toEqual([]);
  });

  it('is idempotent when the app is reopened several times', () => {
    let s = completeDays(D0, 2);
    s = settleStreak(s, addDays(D0, 3)).state;
    const again = settleStreak(s, addDays(D0, 3));
    expect(again.state).toEqual(s);
    expect(again.events).toEqual([]);
  });

  it('ignores a completion for an already-settled past date (clock moved back)', () => {
    let s = completeDays(D0, 1);
    s = settleStreak(s, addDays(D0, 3)).state;
    const r = recordCompletion(s, addDays(D0, 1), cfg);
    expect(r.state.current).toBe(s.current);
  });

  it('handles the DST change in Europe (29 March 2026) without skipping days', () => {
    let s = completeDays('2026-03-28', 3); // 28, 29, 30 March
    expect(s.current).toBe(3);
    const autumn = completeDays('2026-10-24', 3); // 24, 25 (DST ends), 26 Oct
    expect(autumn.current).toBe(3);
    expect(Object.keys(autumn.history)).toEqual(['2026-10-24', '2026-10-25', '2026-10-26']);
  });

  it('builds a calendar with completed, frozen and missed days', () => {
    let s = completeDays(D0, 2);
    s = settleStreak(s, addDays(D0, 3)).state; // day index 2 frozen
    const week = [D0, addDays(D0, 1), addDays(D0, 2), addDays(D0, 3), addDays(D0, 4)];
    const cal = calendarDays(s, week, addDays(D0, 3), D0).map((d) => d.mark);
    expect(cal).toEqual(['completed', 'completed', 'frozen', 'today', 'future']);
  });
});
