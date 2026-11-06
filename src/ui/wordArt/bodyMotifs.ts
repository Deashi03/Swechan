/**
 * Word illustrations for Kroppen & sinnena (0.13 pilot), built with body.ts.
 * Keys are motif ids as used in src/content/data/images/wordVisuals.json.
 */
import type { Svg } from './kit';
import { faceFeatures, headFront, headProfile, skull } from './body';

export const BODY_MOTIFS: Record<string, Svg> = {
  // ── Huvud och ansikte ──────────────────────────────────────────
  'kropp.skalle': skull(),
  'kropp.hjässa': headProfile(['hjässa'], { arrowFrom: [104, 8] }),
  'kropp.bakhuvud': headProfile(['bakhuvud'], { arrowFrom: [10, 30] }),
  'kropp.tinning': headFront(['tinning'], { arrowFrom: [112, 30] }),
  'kropp.nacke': headProfile(['nacke'], { arrowFrom: [12, 100] }),
  'kropp.haka': headFront(['haka'], { arrowFrom: [108, 110] }),
  'kropp.käke': headFront(['käke'], { arrowFrom: [112, 104] }),
  'kropp.ögonbryn': headFront(['ögonbryn'], { arrowFrom: [110, 30] }),
  'kropp.ögonfrans': headFront(['ögonfrans'], { arrowFrom: [110, 34] }),
  'kropp.ögonlock': headFront(['ögonlock'], { arrowFrom: [110, 40] }),
  'kropp.näsrygg': headFront(['näsrygg'], { arrowFrom: [100, 40] }),
  'kropp.näsborre': headFront(['näsborre'], { arrowFrom: [106, 92] }),
  'kropp.mungipa': headFront(['mungipa'], { arrowFrom: [108, 98] }),
  'kropp.smilgrop': headFront(['smilgrop'], { arrowFrom: [110, 96] }),
  'kropp.ansiktsdrag': faceFeatures(),
};
