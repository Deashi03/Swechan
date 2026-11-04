import { getSettings } from '../storage/settings';
import { toStudyDate, type StudyDate } from './date';

/** Injectable clock so tests (and future "time travel" debugging) can control "now". */
let nowFn: () => Date = () => new Date();
export const now = () => nowFn();
export function setClockForTests(fn: (() => Date) | null) { nowFn = fn ?? (() => new Date()); }

export async function todayStudyDate(at: Date = now()): Promise<StudyDate> {
  const s = await getSettings();
  return toStudyDate(at, s.timeZone);
}
