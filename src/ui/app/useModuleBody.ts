import { useEffect, useState } from 'react';
import { markModuleOffline } from '../../content/offlineModules';
import { getContent } from '../../content/repository';
import type { Module } from '../../content/schema';

/** Lazy-loads a published lesson body (reading text + conversation) with error/retry state. */
export function useModuleBody(id: string): { body: Module | undefined; error: string | null; retry: () => void } {
  const repo = getContent();
  const [body, setBody] = useState<Module | undefined>(() => repo.getLoadedModuleBody(id));
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let alive = true;
    setError(null);
    repo.loadModuleBody(id)
      .then((b) => { if (!alive) return; setBody(b); markModuleOffline(id); })
      .catch((e: Error) => alive && setError(navigator.onLine === false ? 'Du verkar vara offline, och den här lektionen har inte laddats på enheten än.' : e.message));
    return () => { alive = false; };
  }, [id, attempt, repo]);
  return { body, error, retry: () => setAttempt((a) => a + 1) };
}

/** Prefetch all published lesson bodies when the browser is idle (makes them available offline). */
export function prefetchModuleBodies(): void {
  const run = () => {
    const repo = getContent();
    for (const m of repo.modules) repo.loadModuleBody(m.id).then(() => markModuleOffline(m.id)).catch(() => { /* retried on open */ });
  };
  const w = window as Window & { requestIdleCallback?: (cb: () => void) => void };
  if (w.requestIdleCallback) w.requestIdleCallback(run); else setTimeout(run, 2000);
}
