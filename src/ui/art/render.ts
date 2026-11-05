/**
 * Renders a motif (motifs.ts) as an SVG string in the app's illustration
 * style "Platt" (chosen by the product owner in 0.5 among five candidates):
 * flat filled shapes on a soft circle in the area's colour, no outlines.
 * Pure function: used by <Art> and by the contact-sheet script.
 */
import { MOTIFS, type Part, type Role } from './motifs';

const hsl = (h: number, s: number, l: number) => `hsl(${((h % 360) + 360) % 360},${s}%,${l}%)`;

function shape(part: Part, attrs: string): string {
  switch (part.t) {
    case 'path': return `<path d="${part.d}" ${attrs}/>`;
    case 'circle': return `<circle cx="${part.cx}" cy="${part.cy}" r="${part.rad}" ${attrs}/>`;
    case 'rect': return `<rect x="${part.x}" y="${part.y}" width="${part.w}" height="${part.h}" rx="${part.rx ?? 0}" ${attrs}/>`;
  }
}

export function paletteFor(h: number): Record<Role | 'bg', string> {
  return { bg: hsl(h, 70, 90), main: hsl(h, 58, 50), accent: hsl(h + 28, 85, 63), accent2: hsl(h + 200, 55, 56), light: hsl(h, 60, 98), line: hsl(h, 50, 25) };
}

export function renderArt(motifId: string, hue: number): string {
  const motif = MOTIFS[motifId];
  if (!motif) return '';
  const c = paletteFor(hue);
  const body = motif.parts.map((pt) => pt.r === 'line'
    ? shape(pt, `fill="none" stroke="${c.line}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"`)
    : shape(pt, `fill="${pt.hue === undefined ? c[pt.r] : paletteFor(pt.hue)[pt.r]}"`)).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="32" fill="${c.bg}"/>${body}</svg>`;
}
