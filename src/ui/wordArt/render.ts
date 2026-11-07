import { scene } from './kit';
import { WORD_MOTIFS } from './motifs';

/**
 * Word illustrations. The original motifs (motifs.ts) are always here; the motifs of each area are
 * their own lazily loaded chunk (0.14), keyed by the prefix of the motif id, so that opening a module
 * only downloads the drawings it needs. Call `loadMotif` before `renderWordArt` for such a motif.
 */
type Motifs = Record<string, string>;
const GROUPS: Record<string, () => Promise<Motifs>> = {
  'kropp.': () => import('./bodyMotifs').then((m) => m.BODY_MOTIFS),
  'familj.': () => import('./family').then((m) => m.FAMILY_MOTIFS),
  'fest.': () => import('./celebrations').then((m) => m.CELEBRATION_MOTIFS),
  'vän.': () => import('./friends').then((m) => m.FRIEND_MOTIFS),
  'mat.': () => import('./food').then((m) => m.FOOD_MOTIFS),
};
const loaded: Motifs = {};
const pending = new Map<string, Promise<void>>();
const groupOf = (id: string) => Object.keys(GROUPS).find((p) => id.startsWith(p));

/** Make sure the chunk that holds `motifId` is loaded (resolves at once for the original motifs). */
export function loadMotif(motifId: string): Promise<void> {
  const g = groupOf(motifId);
  if (!g) return Promise.resolve();
  let p = pending.get(g);
  if (!p) { p = GROUPS[g]!().then((m) => { Object.assign(loaded, m); }); pending.set(g, p); }
  return p;
}
/** Load every group (tests, contact sheets). */
export async function loadAllMotifs(): Promise<void> { await Promise.all(Object.keys(GROUPS).map((g) => loadMotif(g))); }
/** True when the motif exists (after its group is loaded). */
export const hasMotif = (motifId: string): boolean => motifId in WORD_MOTIFS || motifId in loaded;

/** Full SVG markup for a word illustration, or null if the motif does not exist (or is not loaded yet). */
export function renderWordArt(motifId: string): string | null {
  const body = WORD_MOTIFS[motifId] ?? loaded[motifId];
  return body === undefined ? null : scene(body);
}
