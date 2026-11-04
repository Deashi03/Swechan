import { sessionConfig } from '../config/appConfig';
import { getMeta, setMeta } from './db';
import type { Settings } from './types';

export const DEFAULT_SETTINGS: Settings = {
  dailyReviewCount: sessionConfig.defaultDailyReviewCount,
  furigana: true,
  reducedMotion: 'system',
  timeZone: null,
  ttsRate: 0.9,
};

export async function getSettings(): Promise<Settings> {
  return { ...DEFAULT_SETTINGS, ...((await getMeta<Partial<Settings>>('settings')) ?? {}) };
}

export async function updateSettings(patch: Partial<Settings>): Promise<Settings> {
  const next = { ...(await getSettings()), ...patch };
  next.dailyReviewCount = Math.round(
    Math.min(sessionConfig.maxDailyReviewCount, Math.max(sessionConfig.minDailyReviewCount, next.dailyReviewCount)),
  );
  await setMeta('settings', next);
  return next;
}
