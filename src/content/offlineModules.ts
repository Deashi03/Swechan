/**
 * Device-local record of which lesson bodies have been loaded at least once
 * with the current app version (the service worker caches the fetched chunk,
 * so they are then available offline). Stored in localStorage – it describes
 * this device's cache, not learning progress. Keyed by app version because a
 * new version's service worker drops the old cache.
 */
import { APP_VERSION } from '../config/appConfig';

const KEY = `swechan.offlineModules.${APP_VERSION}`;

function read(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[]; } catch { return []; }
}

export function markModuleOffline(id: string): void {
  try {
    const ids = read();
    if (!ids.includes(id)) localStorage.setItem(KEY, JSON.stringify([...ids, id]));
  } catch { /* storage unavailable – only a convenience */ }
}

export function isModuleOffline(id: string): boolean {
  return read().includes(id);
}
