import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';
import { getMeta } from '../../storage/db';
import { DEFAULT_SETTINGS, getSettings } from '../../storage/settings';
import type { Settings, StreakState } from '../../storage/types';
import { getDb } from '../../storage/db';
import { now, todayStudyDate } from '../../lib/clock';

export function useSettings(): Settings {
  return useLiveQuery(() => getSettings(), [], DEFAULT_SETTINGS);
}

export function useStreak(): StreakState | undefined {
  return useLiveQuery(() => getMeta<StreakState>('streak'), []);
}

/** Current study date; re-evaluates when the app returns to the foreground or the minute changes. */
export function useToday(): string | null {
  const settings = useSettings();
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    const update = () => todayStudyDate(now()).then((d) => alive && setToday((prev) => (prev === d ? prev : d)));
    update();
    const id = setInterval(update, 60_000);
    document.addEventListener('visibilitychange', update);
    return () => { alive = false; clearInterval(id); document.removeEventListener('visibilitychange', update); };
  }, [settings.timeZone]);
  return today;
}

export function useSavedSet(): Set<string> {
  const rows = useLiveQuery(() => getDb().savedWords.toArray(), [], []);
  return new Set(rows.map((r) => r.senseId));
}
