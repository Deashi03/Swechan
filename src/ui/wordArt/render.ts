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
  'kär.': () => import('./love').then((m) => m.LOVE_MOTIFS),
  'livs.': () => import('./groceries').then((m) => m.GROCERY_MOTIFS),
  'kök.': () => import('./kitchen').then((m) => m.KITCHEN_MOTIFS),
  'mål.': () => import('./meals').then((m) => m.MEAL_MOTIFS),
  'bord.': () => import('./dining').then((m) => m.DINING_MOTIFS),
  'hus.': () => import('./housing').then((m) => m.HOUSING_MOTIFS),
  'möb.': () => import('./furniture').then((m) => m.FURNITURE_MOTIFS),
  'khem.': () => import('./homeKitchen').then((m) => m.HOME_KITCHEN_MOTIFS),
  'bad.': () => import('./bathroom').then((m) => m.BATHROOM_MOTIFS),
  'städ.': () => import('./cleaning').then((m) => m.CLEANING_MOTIFS),
  'bost.': () => import('./housingAdmin').then((m) => m.HOUSING_ADMIN_MOTIFS),
  'acc.': () => import('./accessories').then((m) => m.ACCESSORY_MOTIFS),
  'tyg.': () => import('./textiles').then((m) => m.TEXTILE_MOTIFS),
  'pass.': () => import('./fit').then((m) => m.FIT_MOTIFS),
  'tvätt.': () => import('./laundry').then((m) => m.LAUNDRY_MOTIFS),
  'skön.': () => import('./beauty').then((m) => m.BEAUTY_MOTIFS),
  'bas.': () => import('./basics').then((m) => m.BASICS_MOTIFS),
  'kfix.': () => import('./bodyFix').then((m) => m.BODY_FIX_MOTIFS),
  'tid.': () => import('./time').then((m) => m.TIME_MOTIFS),
  'rut.': () => import('./routine').then((m) => m.ROUTINE_MOTIFS),
  'plan.': () => import('./planning').then((m) => m.PLANNING_MOTIFS),
  'akt.': () => import('./actions').then((m) => m.ACTION_MOTIFS),
  'mått.': () => import('./measure').then((m) => m.MEASURE_MOTIFS),
  'vard.': () => import('./mishaps').then((m) => m.MISHAP_MOTIFS),
  'köp.': () => import('./shopping').then((m) => m.SHOPPING_MOTIFS),
  'peng.': () => import('./money').then((m) => m.MONEY_MOTIFS),
  'buti.': () => import('./stores').then((m) => m.STORES_MOTIFS),
  'ehan.': () => import('./online').then((m) => m.ONLINE_MOTIFS),
  'post.': () => import('./post').then((m) => m.POST_MOTIFS),
  'fix.': () => import('./blindFix').then((m) => m.BLIND_FIX_MOTIFS),
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
