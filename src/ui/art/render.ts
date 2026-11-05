/**
 * Renders a motif (motifs.ts) as an SVG string in one of five candidate
 * styles (0.5 style exploration – the product owner picks one).
 * Pure function: used by the <Art> component and by the contact-sheet script.
 */
import { MOTIFS, type Part, type Role } from './motifs';

export const ART_STYLES = ['linje', 'platt', 'papper', 'akvarell', 'tryck'] as const;
export type ArtStyle = (typeof ART_STYLES)[number];
export const ART_STYLE_LABEL: Record<ArtStyle, string> = {
  linje: '1 Linje', platt: '2 Platt', papper: '3 Papper', akvarell: '4 Akvarell', tryck: '5 Tryck',
};

const hsl = (h: number, s: number, l: number, a = 1) => `hsla(${((h % 360) + 360) % 360},${s}%,${l}%,${a})`;

function shape(part: Part, attrs: string): string {
  switch (part.t) {
    case 'path': return `<path d="${part.d}" ${attrs}/>`;
    case 'circle': return `<circle cx="${part.cx}" cy="${part.cy}" r="${part.rad}" ${attrs}/>`;
    case 'rect': return `<rect x="${part.x}" y="${part.y}" width="${part.w}" height="${part.h}" rx="${part.rx ?? 0}" ${attrs}/>`;
  }
}

type Paint = Partial<Record<Role, string>>;
function filled(parts: Part[], fill: Paint, line: string, lineWidth: number, extra = ''): string {
  return parts.map((pt) => pt.r === 'line'
    ? shape(pt, `fill="none" stroke="${line}" stroke-width="${lineWidth}" stroke-linecap="round" stroke-linejoin="round" ${extra}`)
    : shape(pt, `fill="${fill[pt.r]}" ${extra}`)).join('');
}
function outlined(parts: Part[], ink: string, w: number, extra = ''): string {
  return parts.map((pt) => shape(pt, `fill="none" stroke="${ink}" stroke-width="${pt.r === 'line' ? w * 1.25 : w}" stroke-linecap="round" stroke-linejoin="round" ${extra}`)).join('');
}

export function renderArt(motifId: string, style: ArtStyle, hue: number): string {
  const motif = MOTIFS[motifId];
  if (!motif) return '';
  const h = hue;
  const id = `art-${style}-${motifId}-${h}`;
  const parts = motif.parts;
  let defs = '';
  let body = '';
  switch (style) {
    case 'linje': {
      const ink = hsl(h, 45, 28);
      body = `<rect width="64" height="64" rx="16" fill="${hsl(h, 60, 95)}"/>`
        + parts.map((pt) => pt.r === 'line'
          ? shape(pt, `fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"`)
          : shape(pt, `fill="${{ main: '#fff', light: '#fff', accent: hsl(h, 80, 82), accent2: hsl(h + 40, 85, 80) }[pt.r]}" stroke="${ink}" stroke-width="2.2" stroke-linejoin="round"`)).join('');
      break;
    }
    case 'platt': {
      body = `<circle cx="32" cy="32" r="32" fill="${hsl(h, 70, 90)}"/>`
        + filled(parts, { main: hsl(h, 58, 50), accent: hsl(h + 28, 85, 63), accent2: hsl(h + 200, 55, 56), light: hsl(h, 60, 98) }, hsl(h, 50, 25), 2.6);
      break;
    }
    case 'papper': {
      defs = `<filter id="${id}-s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1.4" stdDeviation="0.9" flood-color="${hsl(h, 40, 20)}" flood-opacity="0.35"/></filter>`
        + `<filter id="${id}-n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.07 0"/></filter>`;
      body = `<rect width="64" height="64" rx="14" fill="${hsl(h, 35, 93)}"/>`
        + `<path d="M0 44 C16 38 32 49 64 40 V50 Q64 64 50 64 H14 Q0 64 0 50 Z" fill="${hsl(h, 34, 85)}" filter="url(#${id}-s)"/>`
        + `<path d="M0 54 C20 48 40 58 64 51 V50 Q64 64 50 64 H14 Q0 64 0 50 Z" fill="${hsl(h, 34, 79)}" filter="url(#${id}-s)"/>`
        + `<g filter="url(#${id}-s)">${filled(parts, { main: hsl(h, 38, 58), accent: hsl(h + 20, 55, 73), accent2: hsl(h + 190, 30, 62), light: hsl(h, 30, 98) }, hsl(h, 30, 32), 2.4)}</g>`
        + `<rect width="64" height="64" rx="14" filter="url(#${id}-n)"/>`;
      break;
    }
    case 'akvarell': {
      const wc = (k: string, scale: number, blur: number, seed: number) =>
        `<filter id="${id}-${k}" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="${seed}" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation="${blur}"/></filter>`;
      defs = wc('w', 7, 1.4, 4) + wc('f', 2.6, 0.45, 9);
      const ink = hsl(h, 35, 22, 0.85);
      body = `<rect width="64" height="64" rx="14" fill="${hsl(45, 40, 98)}"/>`
        + `<circle cx="33" cy="35" r="25" fill="${hsl(h, 70, 80, 0.55)}" filter="url(#${id}-w)"/>`
        + `<g filter="url(#${id}-f)" opacity="0.88">${filled(parts, { main: hsl(h, 55, 62), accent: hsl(h + 25, 75, 72), accent2: hsl(h + 190, 50, 66), light: hsl(h, 40, 98) }, hsl(h, 40, 40), 2.2)}</g>`
        + `<g transform="translate(0.6 -0.4)">${outlined(parts, ink, 1.25)}</g>`;
      break;
    }
    case 'tryck': {
      const inkA = hsl(h, 85, 58);
      const inkB = hsl(222, 60, 33);
      defs = `<pattern id="${id}-d" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="1.5" cy="1.5" r="1.05" fill="${inkA}"/></pattern>`
        + `<filter id="${id}-g"><feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="1" seed="7"/><feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.15  0 0 0 0 0.1  0 0 0 0.16 0"/></filter>`;
      const paper = hsl(42, 45, 95);
      body = `<rect width="64" height="64" rx="10" fill="${paper}"/>`
        + `<g style="mix-blend-mode:multiply">`
        + parts.map((pt) => {
          if (pt.r === 'line') return shape(pt, `fill="none" stroke="${inkB}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"`);
          if (pt.r === 'main') return shape(pt, `fill="${inkA}" fill-opacity="0.28"`) + shape(pt, `fill="url(#${id}-d)"`);
          if (pt.r === 'accent') return shape(pt, `fill="${inkA}" fill-opacity="0.92"`);
          if (pt.r === 'accent2') return shape(pt, `fill="${inkB}" fill-opacity="0.85"`);
          return shape(pt, `fill="${paper}"`);
        }).join('')
        + `<g transform="translate(1.1 0.8)">${outlined(parts, inkB, 1.2, 'stroke-opacity="0.9"')}</g></g>`
        + `<rect width="64" height="64" rx="10" filter="url(#${id}-g)"/>`;
      break;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><defs>${defs}</defs>${body}</svg>`;
}
