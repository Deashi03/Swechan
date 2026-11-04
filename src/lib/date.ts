/**
 * Study-date utilities.
 *
 * A "study date" is a calendar date string `YYYY-MM-DD` in the user's study
 * time zone (device local time by default, or a fixed IANA zone from
 * settings). All day arithmetic is done on these strings via UTC-noon
 * anchors, so daylight-saving transitions can never make a day 23 or 25 hours
 * long or skip/duplicate a date.
 */
export type StudyDate = string; // YYYY-MM-DD

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isStudyDate(value: string): value is StudyDate {
  return DATE_RE.test(value);
}

/** The study date of `instant` in `timeZone` (undefined/null = device local zone). */
export function toStudyDate(instant: Date, timeZone?: string | null): StudyDate {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: timeZone ?? undefined,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  // en-CA formats as YYYY-MM-DD
  const parts = fmt.formatToParts(instant);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function anchor(date: StudyDate): number {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  return Date.UTC(y, m - 1, d, 12, 0, 0);
}

export function addDays(date: StudyDate, days: number): StudyDate {
  const t = new Date(anchor(date) + days * 86_400_000);
  return t.toISOString().slice(0, 10);
}

/** Whole days from `a` to `b` (b - a). */
export function diffDays(a: StudyDate, b: StudyDate): number {
  return Math.round((anchor(b) - anchor(a)) / 86_400_000);
}

/** Inclusive list of dates from `from` to `to`. Empty if from > to. */
export function dateRange(from: StudyDate, to: StudyDate): StudyDate[] {
  const out: StudyDate[] = [];
  for (let d = from; diffDays(d, to) >= 0; d = addDays(d, 1)) out.push(d);
  return out;
}

/** Monday-based week (ISO) containing `date`. */
export function weekOf(date: StudyDate): StudyDate[] {
  const dow = new Date(anchor(date)).getUTCDay(); // 0 = Sunday
  const mondayOffset = (dow + 6) % 7;
  const monday = addDays(date, -mondayOffset);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

export function weekdayShortSv(date: StudyDate): string {
  return ['sö', 'må', 'ti', 'on', 'to', 'fr', 'lö'][new Date(anchor(date)).getUTCDay()]!;
}
