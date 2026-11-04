import { getSettings } from '../storage/settings';
import { toStudyDate, type StudyDate } from './date';

/** Injectable clock so tests (and future "time travel" debugging) can control "now". */
let offsetMs = 0;
const realNow = () => new Date(Date.now() + offsetMs);
let nowFn: () => Date = realNow;
export const now = () => nowFn();
export function setClockForTests(fn: (() => Date) | null) { nowFn = fn ?? realNow; }
/** Developer time travel: shift the app clock by whole days. */
export function setClockOffsetDays(days: number) { offsetMs = days * 86_400_000; }
export function clockOffsetDays(): number { return Math.round(offsetMs / 86_400_000); }

export async function todayStudyDate(at: Date = now()): Promise<StudyDate> {
  const s = await getSettings();
  return toStudyDate(at, s.timeZone);
}
