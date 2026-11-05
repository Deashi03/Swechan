import { scene } from './kit';
import { WORD_MOTIFS } from './motifs';

/** Full SVG markup for a word illustration, or null if the motif does not exist. */
export function renderWordArt(motifId: string): string | null {
  const body = WORD_MOTIFS[motifId];
  return body === undefined ? null : scene(body);
}
