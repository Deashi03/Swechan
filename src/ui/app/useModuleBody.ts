import { allWordImages, imageFor, photoUrl, sceneUrl } from '../../content/images';
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
      .then((b) => { if (!alive) return; setBody(b); markModuleOffline(id); prefetchModuleVisuals(id); })
      .catch((e: Error) => alive && setError(navigator.onLine === false ? 'Du verkar vara offline, och den här lektionen har inte laddats på enheten än.' : e.message));
    return () => { alive = false; };
  }, [id, attempt, repo]);
  return { body, error, retry: () => setAttempt((a) => a + 1) };
}

/**
 * Animations (0.12): fetch the scene files of a module's words so that the service worker caches
 * them – the word introduction and later reviews then work offline. Done per module (when the
 * module is opened), not for the whole catalogue, so the download grows with what the learner uses.
 */
const prefetchedVisuals = new Set<string>();
export function prefetchModuleVisuals(moduleId: string): void {
  if (prefetchedVisuals.has(moduleId)) return;
  prefetchedVisuals.add(moduleId);
  const m = getContent().getModule(moduleId);
  if (!m) return;
  for (const w of m.words) {
    const v = imageFor(w.senseId);
    if (v?.kind === 'animation') fetch(sceneUrl(v.file)).catch(() => undefined);
  }
  import('../components/AnimatedWordVisual').catch(() => undefined);
}

/** Prefetch all published lesson bodies when the browser is idle (makes them available offline). */
export function prefetchModuleBodies(): void {
  const run = () => {
    const repo = getContent();
    for (const m of repo.modules) repo.loadModuleBody(m.id).then(() => markModuleOffline(m.id)).catch(() => { /* retried on open */ });
    // Word pictures (0.6): the illustration chunk and the photos, so that they are cached by the service worker.
    import('../wordArt/render').catch(() => undefined);
    for (const img of allWordImages()) if (img.kind === 'photo') fetch(photoUrl(img.file)).catch(() => undefined);
  };
  const w = window as Window & { requestIdleCallback?: (cb: () => void) => void };
  if (w.requestIdleCallback) w.requestIdleCallback(run); else setTimeout(run, 2000);
}
