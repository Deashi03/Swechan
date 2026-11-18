/**
 * Preloading of word visuals (kvalitetsplanen A3). A card should never wait for its picture:
 * sessions preload every word's visual when they start and the next card's visuals (including
 * the picture options of the next exercise) while the current card is shown.
 */
import { imageFor, photoUrl, sceneUrl } from '../../content/images';

type RenderModule = typeof import('../wordArt/render');
let rendererPromise: Promise<RenderModule> | null = null;
let renderer: RenderModule | null = null;

/** The illustration renderer, if it has been loaded. */
export function loadedRenderer(): RenderModule | null { return renderer; }

/** Load the illustration renderer and the chunk that holds `motif`. */
export function loadRenderer(motif: string): Promise<void> {
  rendererPromise ??= import('../wordArt/render').then((m) => (renderer = m));
  return rendererPromise.then((m) => m.loadMotif(motif));
}

const started = new Set<string>();

/** Start loading everything needed to show the visual of `senseId`. Safe to call repeatedly. */
export function preloadVisual(senseId: string | null | undefined): void {
  if (!senseId || started.has(senseId)) return;
  started.add(senseId);
  const img = imageFor(senseId);
  if (!img) return;
  const fail = () => { started.delete(senseId); };
  if (img.kind === 'illustration') loadRenderer(img.motif).catch(fail);
  else if (img.kind === 'animation') {
    fetch(sceneUrl(img.file)).catch(fail);
    import('./AnimatedWordVisual').catch(fail);
    if (img.fallbackMotif) loadRenderer(img.fallbackMotif).catch(() => undefined);
  } else if (img.kind === 'face') {
    import('./AnimatedFace').catch(fail);
    if (img.fallbackMotif) loadRenderer(img.fallbackMotif).catch(() => undefined);
  } else if (img.kind === 'photo') {
    const el = new Image();
    el.decoding = 'async';
    el.src = photoUrl(img.file);
  }
}

export function preloadVisuals(senseIds: Iterable<string | null | undefined>): void {
  for (const id of senseIds) preloadVisual(id);
}

/** Every sense an exercise may show a picture for: the target and the options. */
export function exerciseSenseIds(ex: { senseId: string; options?: { senseId: string | null }[] } | null | undefined): string[] {
  if (!ex) return [];
  return [ex.senseId, ...(ex.options ?? []).map((o) => o.senseId).filter((x): x is string => !!x)];
}

/** For tests. */
export function resetPreloadForTests(): void { started.clear(); }
