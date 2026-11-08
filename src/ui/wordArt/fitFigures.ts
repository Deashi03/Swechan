/**
 * Figures whose clothes are drawn separately from the body (0.19.1), so that fit is visible.
 * Rule: a fit word is shown as the coloured figure next to a grey reference in a normal fit
 * (the same convention as `compare` in figures.ts). The difference must be visible in the outline.
 */
import { C, all, ellipse, g, line, path, rect, type Svg } from './kit';

export type Fit = 'normal' | 'tight' | 'fitted' | 'loose' | 'baggy' | 'oversize' | 'slim' | 'suit' | 'bodycon' | 'dress';
const GREY = { skin: '#d8dde2', cloth: '#b8bec6', hair: '#9aa3ad', leg: '#9aa3ad' };
/** Standing person, feet on y = 112, centred on x, about 96 high at s = 1. */
export function dressed(x: number, fit: Fit, col: string, o: { grey?: boolean; s?: number; long?: boolean; legs?: string } = {}): Svg {
  const s = o.s ?? 1, grey = o.grey ?? false;
  const skin = grey ? GREY.skin : C.skin, cloth = grey ? GREY.cloth : col, hair = grey ? GREY.hair : C.hair, legs = grey ? GREY.leg : (o.legs ?? C.navy);
  const out: Svg[] = [];
  // legs and shoes
  out.push(path('M-9 70 L-9 108 L-2 108 L0 76 L2 108 L9 108 L9 70 Z', legs, C.ink, 1.8), path('M-10 106 L-1 106 L-1 111 L-12 111 Z M1 106 L10 106 L12 111 L1 111 Z', grey ? GREY.leg : C.black, C.ink, 1.2));
  // body skin (arms + torso) – visible wherever the garment does not cover it
  out.push(path('M-11 32 C-15 34 -17 46 -17 64 L-13 64 C-13 50 -12 42 -9 38 Z M11 32 C15 34 17 46 17 64 L13 64 C13 50 12 42 9 38 Z', skin, C.ink, 1.4), path('M-11 32 L11 32 C12 44 9 54 9 60 C9 64 11 68 11 72 L-11 72 C-11 68 -9 64 -9 60 C-9 54 -12 44 -11 32 Z', skin, C.ink, 1.6));
  const garment: Record<Fit, Svg> = {
    normal: all(path('M-12 31 L12 31 L20 38 L17 48 L13 46 L13 72 L-13 72 L-13 46 L-17 48 L-20 38 Z', cloth, C.ink, 1.8)),
    // follows the body exactly; tension lines; hem rides up and shows a band of skin
    tight: all(path('M-11 31 L11 31 L15 36 L13 42 L11 40 C11 46 8 52 8.5 56 C8.5 59 10 62 10.5 64 L-10.5 64 C-10 62 -8.5 59 -8.5 56 C-8 52 -11 46 -11 40 L-13 42 L-15 36 Z', cloth, C.ink, 1.8), ...[40, 46, 52, 58].map((y) => path(`M${-8 + (y === 52 ? 1 : 0)} ${y} C-3 ${y + 2} 3 ${y + 2} ${8 - (y === 52 ? 1 : 0)} ${y}`, 'none', 'rgba(0,0,0,0.35)', 1.1)), path('M-15 36 L-11 37 M15 36 L11 37', 'none', 'rgba(0,0,0,0.35)', 1)),
    // hangs far from the body: wide, long, deep folds, sleeves past the elbow
    loose: all(path('M-12 31 L12 31 L26 40 L22 58 L17 56 L20 82 L-20 82 L-17 56 L-22 58 L-26 40 Z', cloth, C.ink, 1.8), ...[-10, -2, 7].map((d) => path(`M${d} 46 C${d - 3} 58 ${d + 3} 70 ${d} 80`, 'none', 'rgba(0,0,0,0.22)', 1.4))),
    baggy: all(path('M-12 31 L12 31 L24 42 L22 66 L17 66 L19 86 C10 90 -10 90 -19 86 L-17 66 L-22 66 L-24 42 Z', cloth, C.ink, 1.8), ...[[-8, 50], [6, 52], [-2, 64], [10, 72], [-12, 76]].map(([a, b]) => path(`M${a! - 4} ${b} C${a!} ${b! + 4} ${a! + 2} ${b! - 2} ${a! + 6} ${b! + 2}`, 'none', 'rgba(0,0,0,0.28)', 1.2))),
    oversize: all(path('M-14 31 L14 31 L30 44 L30 74 L22 74 L21 84 L-21 84 L-22 74 L-30 74 L-30 44 Z', cloth, C.ink, 1.8), rect(-30, 70, 9, 6, cloth, 2, C.ink, 1.4), rect(21, 70, 9, 6, cloth, 2, C.ink, 1.4), path('M-6 31 C-4 37 4 37 6 31', 'none', C.ink, 1.4)),
    fitted: all(path('M-11 31 L11 31 L15 36 L15 44 L11.5 42 C11 48 8.5 54 9 60 C9 64 11 68 11 72 L-11 72 C-11 68 -9 64 -9 60 C-8.5 54 -11 48 -11.5 42 L-15 44 L-15 36 Z', cloth, C.ink, 1.8), path('M-11.5 42 C-11 48 -8.5 54 -9 60 M11.5 42 C11 48 8.5 54 9 60', 'none', 'rgba(255,255,255,0.35)', 1.6)),
    suit: all(path('M-13 31 L13 31 L19 36 L19 64 L15 64 L14 74 L-14 74 L-15 64 L-19 64 L-19 36 Z', cloth, C.ink, 1.8), path('M-3 31 L0 40 L3 31 Z', C.white, null), path('M-1.2 38 L1.2 38 L1.6 52 L0 55 L-1.6 52 Z', C.red, null)),
    dress: all(path('M-12 31 L12 31 C14 44 14 52 16 60 C20 74 24 88 26 100 L-26 100 C-24 88 -20 74 -16 60 C-14 52 -14 44 -12 31 Z', cloth, C.ink, 1.8)),
    slim: all(path('M-11 31 L11 31 L15 36 L15 64 L11 64 L10 72 L-10 72 L-11 64 L-15 64 L-15 36 Z', cloth, C.ink, 1.8), path('M-3 31 L0 40 L3 31 Z', C.white, null), path('M-1.2 38 L1.2 38 L1.6 52 L0 55 L-1.6 52 Z', C.red, null)),
    bodycon: all(path('M-10 31 L10 31 C11 44 8 52 8.5 58 C9 64 13 80 12 100 L-12 100 C-13 80 -9 64 -8.5 58 C-8 52 -11 44 -10 31 Z', cloth, C.ink, 1.8)),
  };
  out.push(garment[fit]);
  // head
  if (o.long) out.push(path('M-10 16 C-12 4 12 4 10 16 C11 26 9 32 11 36 L-11 36 C-9 32 -11 26 -10 16 Z', hair, C.ink, 1.4));
  out.push(rect(-3, 24, 6, 8, skin, 2, C.ink, 1.2), ellipse(0, 18, 8.5, 9.5, skin, C.ink, 1.6));
  out.push(path('M-8.5 16 C-9 6 9 6 8.5 16 C6 11 -6 11 -8.5 16 Z', hair, C.ink, 1.4));
  out.push(ellipse(-3, 18, 1, 1.2, C.ink, null), ellipse(3, 18, 1, 1.2, C.ink, null), path('M-2.5 22 Q0 24 2.5 22', 'none', C.ink, 1));
  return g(`translate(${x} ${(112 - 112 * s).toFixed(1)}) scale(${s})`, ...out);
}
/** Grey reference in a normal fit next to the coloured word figure. */
export const fitPair = (fit: Fit, col: string, o: { long?: boolean; legs?: string; ref?: Fit } = {}): Svg => all(line('M6 112 L114 112', C.grey2, 2), dressed(32, o.ref ?? 'normal', col, { grey: true, long: o.long }), dressed(86, fit, col, o));
