import type { CSSProperties } from 'react';

/**
 * Long Swedish compounds (yttrandefrihetsgrundlagen, olaga integritetsintrång …) are wider than a phone card at the
 * big headword size. `fitWord` sets `--fit-len` to the longest unbreakable token; the `.fit-word` rule then shrinks
 * the font so that token fits the nearest `.fit-box` container (container query units), never below `--fit-min`.
 * Browsers without container queries keep the normal size and break the word instead (overflow-wrap: anywhere).
 */
export function longestToken(text: string): number {
  return text.split(/\s+/).reduce((m, w) => Math.max(m, [...w].length), 1);
}

export function fitWord(text: string): { style: CSSProperties } {
  return { style: { '--fit-len': longestToken(text) } as CSSProperties };
}
