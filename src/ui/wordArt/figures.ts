/**
 * A whole-body figure with adjustable build (height, width, belly, muscles, hair), and
 * small skin and appearance scenes (0.13 pilot: Kroppen & sinnena). Used for words that
 * describe how a body looks – a comparison figure in grey makes the difference visible.
 */
import { C, all, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { headFront } from './body';
import { pointAt } from './limbs';


export type Build = { x?: number; h?: number; w?: number; belly?: number; muscle?: boolean; shoulders?: number; hair?: string; hairStyle?: 'short' | 'long'; top?: string; bottom?: string; skin?: string; grey?: boolean; face?: 'smile' | 'neutral' };
/** Standing figure, feet on y = 112. h = height factor (1 ≈ 96 px), w = width factor, belly 0–1. */
export function figure(b: Build = {}): Svg {
  const h = b.h ?? 1, w = b.w ?? 1, belly = b.belly ?? 0, sh = (b.shoulders ?? 1) * w;
  const grey = b.grey ?? false;
  const skin = grey ? C.grey2 : (b.skin ?? C.skin), top = grey ? C.grey : (b.top ?? C.sky), bot = grey ? C.grey : (b.bottom ?? C.navy), hair = grey ? C.grey : (b.hair ?? C.hair);
  const out: Svg[] = [];
  const S = (x: number) => (x * w).toFixed(1), SH = (x: number) => (x * sh).toFixed(1);
  // legs
  out.push(path(`M${S(-12)} 0 L${S(-11)} 46 L${S(-3)} 46 L0 8 L${S(3)} 46 L${S(11)} 46 L${S(12)} 0 Z`, bot, C.ink, 2));
  out.push(path(`M${S(-11)} 44 L${S(-3)} 44 L${S(-2)} 49 L${S(-13)} 49 Z M${S(3)} 44 L${S(11)} 44 L${S(13)} 49 L${S(2)} 49 Z`, grey ? C.grey : C.black, C.ink, 1.6));
  // arms
  const armW = b.muscle ? 7 : 5;
  out.push(path(`M${SH(-14)} -40 L${SH(-14) } -40 C${SH(-20)} -36 ${SH(-21)} -20 ${SH(-20) } -4 L${(-20 * sh + armW).toFixed(1)} -4 C${(-20 * sh + armW).toFixed(1)} -18 ${SH(-14)} -28 ${SH(-12)} -34 Z`, b.muscle ? skin : top, C.ink, 2));
  out.push(path(`M${SH(14)} -40 C${SH(20)} -36 ${SH(21)} -20 ${SH(20)} -4 L${(20 * sh - armW).toFixed(1)} -4 C${(20 * sh - armW).toFixed(1)} -18 ${SH(14)} -28 ${SH(12)} -34 Z`, b.muscle ? skin : top, C.ink, 2));
  out.push(circle(-20 * sh + armW / 2, -2, 3.4, skin, C.ink, 1.4), circle(20 * sh - armW / 2, -2, 3.4, skin, C.ink, 1.4));
  // torso (with belly bulge)
  const bx = 12 * w + belly * 9;
  out.push(path(`M${SH(-14)} -42 L${SH(14)} -42 C${(14 * sh + 1).toFixed(1)} -30 ${bx.toFixed(1)} -16 ${S(12)} 2 L${S(-12)} 2 C${(-bx).toFixed(1)} -16 ${(-14 * sh - 1).toFixed(1)} -30 ${SH(-14)} -42 Z`, top, C.ink, 2.2));
  if (b.muscle) out.push(line(`M${SH(-8)} -36 Q0 -30 ${SH(8)} -36 M0 -30 L0 -14`, C.ink, 1.2));
  // head
  out.push(rect(-3.5, -48, 7, 7, skin, 2, C.ink, 1.6), circle(0, -56, 10, skin, C.ink, 2));
  if (b.hairStyle === 'long') out.push(path('M-11 -56 C-14 -40 -8 -38 0 -40 C8 -38 14 -40 11 -56 C10 -70 -10 -70 -11 -56 Z', hair, C.ink, 1.8), circle(0, -54, 8.6, skin, null));
  out.push(path('M-10 -58 C-10 -72 10 -72 10 -58 C6 -63 -6 -63 -10 -58 Z', hair, C.ink, 1.8));
  out.push(circle(-3.4, -56, 1.2, C.ink, null), circle(3.4, -56, 1.2, C.ink, null), line(b.face === 'neutral' ? 'M-3 -51 L3 -51' : 'M-3 -51.5 Q0 -49 3 -51.5', C.ink, 1.3));
  const s = 0.84 * h;
  return g(`translate(${b.x ?? 60} ${(112 - 49 * s).toFixed(1)}) scale(${s.toFixed(3)})`, ...out);
}

/** Two figures side by side: the word (coloured) and a grey comparison figure. */
export const compare = (word: Build, ref: Build = {}): Svg => all(line('M6 112 L114 112', C.grey2, 2), figure({ x: 38, ...ref, grey: true }), figure({ x: 82, ...word }));

// ── Hair colours (heads) ────────────────────────────────────────────────────
export const HAIR = { blond: '#f0cf6b', mörk: '#2f2521', röd: '#c4542a' } as const;
export const hairHead = (color: string): Svg => headFront([], { hairColor: color, smile: true });

// ── Skin ───────────────────────────────────────────────────────────────────
/** A bare forearm (horizontal) on which skin marks are drawn. */
export function forearm(marks: Svg = '', o: { skin?: string; hairs?: boolean; bumps?: boolean } = {}): Svg {
  const sk = o.skin ?? C.skin;
  const out: Svg[] = [path('M0 46 C30 40 70 40 96 44 L96 82 C70 86 30 86 0 80 Z', sk, C.ink, 2.4), path('M94 40 C108 38 118 46 118 62 C118 80 108 86 94 84 Z', sk, C.ink, 2.4), line('M100 50 l12 0 M100 58 l14 0 M100 66 l14 0', C.skin2, 1.4)];
  if (o.hairs) for (let x = 8; x < 90; x += 7) out.push(line(`M${x} ${50 + (x % 3)} l3 -4 M${x + 3} ${66 + (x % 4)} l3 -4`, C.hair, 1.2));
  if (o.bumps) for (let x = 8; x < 90; x += 6) for (const y of [52, 62, 72]) out.push(circle(x + (y % 4), y + (x % 5), 1.3, C.skin2, C.ink, 0.6));
  out.push(marks);
  return all(...out);
}

/** hudfärg: six faces in different skin tones. */
export function skinTones(): Svg {
  const tones = ['#f7d8c0', '#f1c7a1', '#d9a57c', '#b07a52', '#7d5236', '#4f3322'];
  return all(...tones.map((c, i) => {
    const x = 24 + (i % 3) * 36, y = 36 + Math.floor(i / 3) * 46;
    return all(circle(x, y, 15, c, C.ink, 2), path(`M${x - 15} ${y - 2} C${x - 15} ${y - 20} ${x + 15} ${y - 20} ${x + 15} ${y - 2} C${x + 8} ${y - 10} ${x - 8} ${y - 10} ${x - 15} ${y - 2} Z`, C.hair, C.ink, 1.6),
      circle(x - 5, y + 1, 1.5, C.ink, null), circle(x + 5, y + 1, 1.5, C.ink, null), line(`M${x - 4} ${y + 7} Q${x} ${y + 10} ${x + 4} ${y + 7}`, C.ink, 1.4));
  }));
}

/** A face with something on the skin: freckles, mole, birthmark, wrinkles, pale or tanned, blush, down. */
export function faceSkin(kind: 'fräkne' | 'födelsemärke' | 'rynkig' | 'blek' | 'solbränd' | 'rodna' | 'fjun' | 'kännetecken'): Svg {
  const marks: Svg[] = [];
  if (kind === 'fräkne') for (const [x, y] of [[38, 66], [42, 70], [46, 66], [40, 74], [48, 72], [72, 66], [76, 70], [80, 66], [74, 74], [82, 72], [56, 64], [64, 64]] as const) marks.push(circle(x, y, 1.6, '#b9733f', null));
  if (kind === 'födelsemärke') marks.push(path('M70 70 C76 66 84 70 82 76 C80 82 72 80 70 76 Z', '#b46a7a', C.ink, 1.2));
  if (kind === 'kännetecken') marks.push(path('M70 70 C76 66 84 70 82 76 C80 82 72 80 70 76 Z', '#b46a7a', C.ink, 1.2));
  if (kind === 'rynkig') marks.push(line('M44 38 Q60 34 76 38 M46 42 Q60 39 74 42 M34 58 l-4 -2 M34 62 l-4 1 M86 58 l4 -2 M86 62 l4 1 M48 78 q-2 4 0 8 M72 78 q2 4 0 8', C.skin2, 1.8));
  if (kind === 'rodna') marks.push(ellipse(42, 72, 8, 5, '#f08a8a', null), ellipse(78, 72, 8, 5, '#f08a8a', null));
  if (kind === 'fjun') for (let i = 0; i < 9; i++) marks.push(line(`M${36 + (i % 3) * 4} ${66 + Math.floor(i / 3) * 4} l1 -2.4`, '#d9b48f', 1), line(`M${76 + (i % 3) * 4} ${66 + Math.floor(i / 3) * 4} l1 -2.4`, '#d9b48f', 1));
  const skin = kind === 'blek' ? '#f7e6da' : kind === 'solbränd' ? '#c98b5a' : C.skin;
  const out: Svg[] = [headFront([], { skin, skinMarks: all(...marks), smile: kind !== 'blek', frown: kind === 'blek' })];
  if (kind === 'solbränd') out.push(circle(102, 16, 9, C.yellow, C.ink, 2), line('M102 2 l0 -2 M114 8 l3 -2 M116 18 l3 0 M90 8 l-3 -2', C.gold, 2));
  if (kind === 'födelsemärke') out.push(pointAt([76, 74], [110, 104]));
  if (kind === 'kännetecken') out.push(circle(76, 74, 13, 'none', C.navy, 3), line('M86 84 L100 100', C.navy, 4.4));
  if (kind === 'fjun') out.push(circle(80, 70, 12, 'none', C.navy, 2.4), line('M89 79 L102 94', C.navy, 4));
  return all(...out);
}

/** Skin marks on a forearm: mole, scar, bruise, goose bumps, body hair, a single hair. */
export function armSkin(kind: 'leverfläck' | 'ärr' | 'blåmärke' | 'gåshud' | 'kroppsbehåring' | 'hårstrå'): Svg {
  if (kind === 'leverfläck') return all(forearm(circle(48, 62, 4.4, '#6b4a33', C.ink, 1.2)), pointAt([48, 62], [40, 110]));
  if (kind === 'ärr') return all(forearm(all(line('M30 64 L70 58', '#d98b8b', 4), line('M36 58 l-1 10 M44 57 l-1 10 M52 56 l-1 10 M60 55 l-1 10', '#c06f6f', 1.6))), pointAt([50, 61], [40, 110]));
  if (kind === 'blåmärke') return all(forearm(all(ellipse(50, 62, 14, 10, '#8a6bbf', null), ellipse(50, 62, 8, 6, '#5d4596', null), ellipse(58, 66, 6, 4, '#b7b04a', null))), pointAt([50, 64], [40, 110]));
  if (kind === 'gåshud') return all(forearm('', { bumps: true, hairs: true }), circle(36, 64, 16, 'none', C.navy, 2.4), line('M47 76 L58 90', C.navy, 4), path('M86 14 C92 10 98 18 92 22 C98 26 92 34 86 30', 'none', C.sky, 2.4), line('M80 20 l-6 -6 M80 28 l-8 0', C.sky, 2));
  if (kind === 'kroppsbehåring') return forearm('', { hairs: true });
  // hårstrå: one hair under a magnifying glass
  return all(forearm(line('M44 64 C48 54 52 50 58 48', C.hair, 1.4)), circle(52, 56, 16, 'rgba(255,255,255,0.35)', C.navy, 3), line('M44 66 C48 56 52 50 60 46', C.hair, 2.4), line('M63 68 L78 86', C.navy, 4.6));
}

/** brösthår: a chest with hair, arrow. */
export function chestHair(): Svg {
  return all(path('M10 120 C10 70 30 40 60 40 C90 40 110 70 110 120 Z', C.skin, C.ink, 2.4), path('M48 30 L72 30 L72 44 C66 48 54 48 48 44 Z', C.skin, C.ink, 2.2),
    ...Array.from({ length: 22 }, (_, i) => line(`M${42 + (i % 6) * 7} ${64 + Math.floor(i / 6) * 8 + (i % 2) * 2} q2 -3 0 -5`, C.hair, 1.4)),
    line('M44 60 Q50 64 56 60 M64 60 Q70 64 76 60', C.skin2, 1.4), pointAt([60, 72], [108, 24]));
}

// ── Build words that are not about the whole figure ────────────────────────
export const axelbred = (): Svg => compare({ shoulders: 1.45, top: C.green });
