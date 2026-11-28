/**
 * Kultur & fritid → Bildkonst & design → Måleri & teckning, 4521–4527 (0.63): drawing with pencil and charcoal,
 * watercolour, acrylic and oil paint, brushes and canvases, portrait, landscape and abstract painting.
 * Recurring signs: the thing the word names is in colour (often with an orange ring, frame or arrow) and a grey
 * reference shows what the word is not. Words taught in Bildkonstens grunder (teckna, teckning, skiss, skissblock,
 * palett, geometrisk) keep their pictures there. Close words get clearly different scenes: kroki (three quick
 * gesture figures and a 2-minute clock) and posera (a person lifts an arm in front of a camera); blyertspenna (a
 * pencil and its grey curl), kol (black sticks and soft black strokes), suddgummi (the eraser) and sudda (it rubs
 * a line away); akvarell (a soft finished painting), vattenfärg (the paint box), blöta (clear water makes the
 * paper shine), vått i vått (colour blooms on wet paper), späda ut (three wells from dark to light), tusch (ink
 * stick and stone) and tuschmålning (a bamboo scroll); oljefärg (tube with an oil drop), akrylfärg (tube with a
 * water drop and a brush in water), tub (three kinds of tube), linolja (bottle with the blue flax flower),
 * terpentin (a smelly can with brushes) and fernissa (half of a painting gets glossy); täckande (an opaque patch
 * hides stripes) and måla över (a brush covers a tree); duk (a blank canvas), kilram (the bare wooden stretcher
 * with wedges), ram (an empty gold frame), staffli (the easel alone) and tavelkrok (a hook in a ring); naturtrogen
 * (an apple = its painting), karikatyr (a face with a huge nose) and självporträtt (a mirror); abstrakt /
 * föreställande (the same pair of canvases with the other one in colour) and kludd (messy scribbles); pionjär
 * (first on a new path) and före sin tid (1906 ? → 1986 ♥).
 * Digits, ? ! = ≠ and ✓/✗ marks only; no words, no letters that name the word, no brands.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, sparkle, waBob, waGrow, waIn, waPulse, waShake, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const PAPER = '#fdfcf7';
const WALL = '#efe8dc';
const WOOD = '#c99a62';
const WOOD2 = '#a8763f';
const GOLD = '#d9a93a';
const LINEN = '#e8dcc2';
const GRAPH = '#5a5d66';
const WATER = '#cfe8f6';
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const cross = (x: number, y: number, s = 6, col: string = C.red) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 3);
const tick = (x: number, y: number, s = 6, col: string = C.green) => line(`M${x - s} ${y} L${x - s / 3} ${y + s * 0.7} L${x + s} ${y - s * 0.8}`, col, 3);
const wall = (h = 112) => rect(0, 0, 120, h, WALL, 0, null);
/** Rotation of a part about (px, py): it swings from fromDeg to its drawn position (the poster frame). */
const swing = (name: string, px: number, py: number, fromDeg: number, ...k: Svg[]) =>
  moving(name, `0%{transform:translate(${px}px,${py}px) rotate(${fromDeg}deg) translate(${-px}px,${-py}px)}55%,100%{transform:translate(${px}px,${py}px) rotate(0deg) translate(${-px}px,${-py}px)}`, { dur: 2.6 }, ...k);
/** A part that appears (fades in) while something else moves. */
const appear = (name: string, ...k: Svg[]) => moving(name, '0%,20%{opacity:0}60%,100%{opacity:1}', { dur: 2.6 }, ...k);

/** Pencil, tip at (x, y), body towards angle deg. */
const pencil = (x: number, y: number, deg = -45, len = 34, body: string = C.yellow) => g(`translate(${x} ${y}) rotate(${deg})`, path('M0 0 L7 -3 L7 3 Z', C.beige, C.ink, 1), path('M0 0 L2.5 -1 L2.5 1 Z', GRAPH, null),
  rect(7, -3, len, 6, body, 1, C.ink, 1.2), line(`M7 0 L${7 + len} 0`, 'rgba(0,0,0,0.15)', 1), rect(7 + len, -3, 4, 6, C.silver, 0, C.ink, 1), rect(11 + len, -3, 5, 6, C.pink, 2, C.ink, 1.2));
/** Brush, tip at (x, y), handle towards angle deg. */
const brush = (x: number, y: number, deg = -45, len = 40, tip: string = C.ink, handle: string = C.red) => g(`translate(${x} ${y}) rotate(${deg})`,
  path('M0 0 Q4 -3.4 10 -2.8 L10 2.8 Q4 3.4 0 0 Z', tip, C.ink, 1), rect(10, -2.8, 7, 5.6, C.silver, 1, C.ink, 1), path(`M17 -2.4 L${len} -1.6 L${len} 1.6 L17 2.4 Z`, handle, C.ink, 1.1));
/** Flat (wide) brush, tip at (x, y). */
const flatBrush = (x: number, y: number, deg = -60, tip: string = C.white, handle: string = WOOD) => g(`translate(${x} ${y}) rotate(${deg})`,
  rect(0, -7, 9, 14, tip, 1, C.ink, 1.1), rect(9, -6, 7, 12, C.silver, 1, C.ink, 1.1), path('M16 -3 L42 -2 L42 2 L16 3 Z', handle, C.ink, 1.1));
/** Fist holding something at (x, y), sleeve towards (dx, dy). */
const fist = (x: number, y: number, dx = 14, dy = 14, sleeve: string = C.navy) => all(line(`M${x} ${y} L${x + dx} ${y + dy}`, C.ink, 11), line(`M${x} ${y} L${x + dx} ${y + dy}`, sleeve, 8.6), circle(x, y, 6.5, C.skin, C.ink, 1.4));
/** Open hand (palm) at (x, y), fingers up. */
const palm = (x: number, y: number, rot = 0) => g(`translate(${x} ${y}) rotate(${rot})`, path('M-6 6 L-6 -4 C-6 -7 -3 -7 -3 -4 L-3 -8 C-3 -11 0 -11 0 -8 L0 -9 C0 -12 3 -12 3 -9 L3 -7 C3 -10 6 -10 6 -7 L6 4 C6 8 3 10 0 10 C-4 10 -6 8 -6 6 Z', C.skin, C.ink, 1.2),
  path('M-6 2 L-9 -2 C-11 -4 -9 -6 -7 -4 L-6 -2', C.skin, C.ink, 1.2));
/** Sheet of paper. */
const sheet = (x: number, y: number, w: number, h: number, fill: string = PAPER) => rect(x, y, w, h, fill, 1, C.ink, 1.6);
const tape = (x: number, y: number, rot = -20) => g(`translate(${x} ${y}) rotate(${rot})`, rect(-7, -3, 14, 6, 'rgba(242,215,140,0.85)', 1, null));
/** Canvas on a stretcher (front view), with an optional picture inside. */
const canvas = (x: number, y: number, w: number, h: number, ...inner: Svg[]) => all(rect(x, y, w, h, C.white, 1, C.ink, 1.8), ...inner, rect(x, y, w, h, 'none', 1, C.ink, 1.8));
/** Gold frame around a picture. */
const frame = (x: number, y: number, w: number, h: number, col: string = GOLD, ...inner: Svg[]) => all(rect(x - 5, y - 5, w + 10, h + 10, col, 1, C.ink, 1.6), rect(x - 2, y - 2, w + 4, h + 4, 'none', 0, '#b8862a', 1), rect(x, y, w, h, C.white, 0, C.ink, 1.2), ...inner);
/** Easel: legs from the ground to the top (x, top), ledge at ly. */
const easel = (x: number, top = 24, ly = 84, col: string = WOOD) => all(line(`M${x} ${top} L${x + 6} 112`, WOOD2, 3), line(`M${x - 4} ${top} L${x - 20} 112 M${x + 4} ${top} L${x + 20} 112`, C.ink, 5), line(`M${x - 4} ${top} L${x - 20} 112 M${x + 4} ${top} L${x + 20} 112`, col, 3), rect(x - 22, ly, 44, 5, col, 1, C.ink, 1.4));
/** Paint tube lying, cap at the left end (x, y). */
const tube = (x: number, y: number, label: string = C.red, s = 1, rot = 0, body: string = C.silver, mark: Svg = '') => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  rect(-8, -4, 8, 8, C.dark, 1.5, C.ink, 1.2), path('M0 -6 L6 -8 L38 -8 L40 -6 L40 6 L38 8 L6 8 L0 6 Z', body, C.ink, 1.4), rect(10, -6, 22, 12, label, 1, null), line('M40 -7 L40 7 M42 -7 L42 7', C.ink, 1.2), mark);
/** Jar with liquid. */
const jar = (x: number, y: number, w: number, h: number, liquid: string = WATER, level = 0.6) => all(rect(x, y + h * (1 - level), w, h * level, liquid, 2, null), rect(x, y, w, h, 'rgba(230,244,252,0.35)', 3, C.ink, 1.6), line(`M${x + 3} ${y + 4} L${x + 3} ${y + h - 4}`, C.white, 1.4));
/** Paint blob. */
const blob = (x: number, y: number, col: string, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-6 2 C-8 -3 -3 -6 0 -5 C3 -7 8 -4 7 0 C9 4 3 6 0 5 C-4 6 -7 5 -6 2 Z', col, C.ink, 1));
/** Simple standing (or seated) person; r and l are the hand positions in local coordinates (x = 0, ground at 112). */
type Who = { top?: string; bottom?: string; hair?: string; long?: boolean; skin?: string; r?: [number, number]; l?: [number, number]; s?: number; grey?: boolean; face?: 'smile' | 'neutral' | 'angry' | 'puzzled' | 'happy' | 'closed'; seated?: boolean; crown?: boolean; back?: boolean; noR?: boolean; noL?: boolean };
function who(x: number, o: Who = {}): Svg {
  const grey = o.grey ?? false, s = o.s ?? 1;
  const sk = grey ? C.grey2 : o.skin ?? C.skin, top = grey ? C.grey : o.top ?? C.sky, bot = grey ? C.grey : o.bottom ?? C.navy, hair = grey ? C.grey : o.hair ?? C.hair;
  const dy = o.seated ? 10 : 0;
  const sh: [number, number] = [9, 45 + dy], shl: [number, number] = [-9, 45 + dy];
  const r = o.r ?? [13, 78 + dy * 0.6], l = o.l ?? [-13, 78 + dy * 0.6];
  const arm = (a: [number, number], b: [number, number]) => all(line(`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`, C.ink, 7.4), line(`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`, top, 5.2), circle(b[0], b[1], 3.2, sk, C.ink, 1.2));
  const out: Svg[] = [];
  if (o.long) out.push(path(`M-11 ${30 + dy} C-13 ${46 + dy} -7 ${48 + dy} 0 ${46 + dy} C7 ${48 + dy} 13 ${46 + dy} 11 ${30 + dy} Z`, hair, C.ink, 1.4));
  if (o.seated) out.push(path('M-11 89 L-10 110 L-3 110 L-1 92 L1 92 L3 110 L10 110 L11 89 Z', bot, C.ink, 1.8));
  else out.push(path('M-11 79 L-10 110 L-3 110 L0 88 L3 110 L10 110 L11 79 Z', bot, C.ink, 1.8));
  out.push(ellipse(-6.5, 111, 5, 2.4, grey ? C.grey : C.black, null), ellipse(6.5, 111, 5, 2.4, grey ? C.grey : C.black, null));
  out.push(path(`M-10 ${42 + dy} L10 ${42 + dy} L12 ${80 + dy} L-12 ${80 + dy} Z`, top, C.ink, 1.8));
  out.push(rect(-3, 36 + dy, 6, 7, sk, 1, C.ink, 1.2), circle(0, 30 + dy, 9.5, sk, C.ink, 1.8));
  if (o.back) out.push(path(`M-9.5 ${31 + dy} C-11 ${18 + dy} 11 ${18 + dy} 9.5 ${31 + dy} C9 ${37 + dy} -9 ${37 + dy} -9.5 ${31 + dy} Z`, hair, C.ink, 1.4));
  else {
    out.push(path(`M-9.5 ${28 + dy} C-9.5 ${16 + dy} 9.5 ${16 + dy} 9.5 ${28 + dy} C6 ${23 + dy} -6 ${23 + dy} -9.5 ${28 + dy} Z`, hair, C.ink, 1.4));
    const f = o.face ?? 'smile', ey = 30 + dy;
    if (f === 'closed') out.push(line(`M-5 ${ey - 1} Q-3.2 ${ey + 1} -1.4 ${ey - 1} M1.4 ${ey - 1} Q3.2 ${ey + 1} 5 ${ey - 1}`, C.ink, 1.1));
    else out.push(circle(-3.2, ey - 1, 1.2, C.ink, null), circle(3.2, ey - 1, 1.2, C.ink, null));
    if (f === 'angry') out.push(line(`M-6 ${ey - 5} L-1.5 ${ey - 3} M6 ${ey - 5} L1.5 ${ey - 3}`, C.ink, 1.3), path(`M-3 ${ey + 5.5} Q0 ${ey + 3} 3 ${ey + 5.5}`, 'none', C.ink, 1.3));
    else if (f === 'puzzled') out.push(line(`M-6 ${ey - 4} L-1.5 ${ey - 5} M1.5 ${ey - 4.5} L6 ${ey - 3.5}`, C.ink, 1.1), line(`M-2.5 ${ey + 4.5} L3 ${ey + 3.5}`, C.ink, 1.3));
    else if (f === 'neutral') out.push(line(`M-2.5 ${ey + 4} L2.5 ${ey + 4}`, C.ink, 1.3));
    else if (f === 'happy') out.push(path(`M-3.4 ${ey + 3} Q0 ${ey + 7.5} 3.4 ${ey + 3} Z`, '#c84a4a', C.ink, 1));
    else out.push(path(`M-3 ${ey + 3.5} Q0 ${ey + 6} 3 ${ey + 3.5}`, 'none', C.ink, 1.3));
  }
  if (o.crown) out.push(path(`M-8 ${20 + dy} L-8 ${12 + dy} L-4 ${16 + dy} L0 ${10 + dy} L4 ${16 + dy} L8 ${12 + dy} L8 ${20 + dy} Z`, C.gold, C.ink, 1.3));
  if (!o.noL) out.push(arm(shl, l));
  if (!o.noR) out.push(arm(sh, r));
  return g(`translate(${x} ${(1 - s) * 112}) scale(${s})`, ...out);
}
/** Small head (front) for portraits. */
const face = (x: number, y: number, r: number, o: { hair?: string; long?: boolean; top?: string; mood?: 'smile' | 'neutral'; nose?: number; ears?: number } = {}) => {
  const hair = o.hair ?? C.hair, k = r / 10;
  return g(`translate(${x} ${y}) scale(${k})`, o.long ? path('M-11 -2 C-13 14 -7 16 0 14 C7 16 13 14 11 -2 Z', hair, C.ink, 1.4) : '', o.top ? path('M-16 22 C-14 13 -7 11 0 11 C7 11 14 13 16 22 Z', o.top, C.ink, 1.6) : '',
    rect(-3, 7, 6, 6, C.skin, 1, C.ink, 1.2), (o.ears ?? 1) > 1 ? all(ellipse(-10 - o.ears! * 2, 0, 3 * o.ears!, 4 * o.ears!, C.skin, C.ink, 1.3), ellipse(10 + o.ears! * 2, 0, 3 * o.ears!, 4 * o.ears!, C.skin, C.ink, 1.3)) : '',
    circle(0, 0, 10, C.skin, C.ink, 1.6), path('M-10 -2 C-10 -14 10 -14 10 -2 C6 -7 -6 -7 -10 -2 Z', hair, C.ink, 1.2), circle(-3.4, -1, 1.2, C.ink, null), circle(3.4, -1, 1.2, C.ink, null),
    (o.nose ?? 1) > 1 ? ellipse(0, 3, 3 * o.nose!, 2.6 * o.nose!, '#f0b48e', C.ink, 1.2) : line('M0 0 L-1 3 L1 3', C.skin2, 1),
    o.mood === 'neutral' ? line('M-2.5 6 L2.5 6', C.ink, 1.2) : path('M-3 5 Q0 7.5 3 5', 'none', C.ink, 1.2));
};
/** Side view of a head facing right (silhouette or skin), centred at (x, y). */
const profileHead = (x: number, y: number, s = 1, fill: string = C.ink, hair: string = C.ink) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-12 22 L-12 14 C-20 8 -21 -10 -8 -18 C2 -24 14 -18 15 -8 L20 -1 L15 1 C17 4 15 6 14 7 C15 9 13 11 11 11 C11 15 7 17 3 16 L4 22 Z', fill, C.ink, 1.4),
  path('M-12 14 C-20 8 -21 -10 -8 -18 C2 -24 14 -18 15 -8 C8 -12 0 -12 -4 -6 C-6 0 -8 6 -12 14 Z', hair, C.ink, 1.2), circle(-16, -8, 6, hair, C.ink, 1.2));
/** Mountain landscape (inside a box). */
const scenery = (x: number, y: number, w: number, h: number, o: { sky?: string; hill?: string; water?: string; sun?: string } = {}) => {
  const X = (f: number) => +(x + f * w).toFixed(1), Y = (f: number) => +(y + f * h).toFixed(1);
  return all(rect(x, y, w, h, o.sky ?? '#cfe6f5', 0, null), o.sun ? circle(X(0.78), Y(0.22), Math.min(w, h) * 0.09, o.sun, null) : '',
    path(`M${x} ${Y(0.7)} L${X(0.25)} ${Y(0.3)} L${X(0.45)} ${Y(0.55)} L${X(0.62)} ${Y(0.35)} L${X(1)} ${Y(0.7)} Z`, o.hill ?? '#7a9cc0', null),
    path(`M${X(0.21)} ${Y(0.36)} L${X(0.25)} ${Y(0.3)} L${X(0.29)} ${Y(0.36)} Z M${X(0.58)} ${Y(0.4)} L${X(0.62)} ${Y(0.35)} L${X(0.66)} ${Y(0.4)} Z`, C.white, null),
    rect(x, Y(0.7), w, h * 0.3, o.water ?? '#8cc7e8', 0, null), path(`M${x} ${Y(0.7)} L${X(0.3)} ${Y(0.62)} L${X(0.55)} ${Y(0.7)} Z`, '#6fae6b', null));
};
/** Red cottage with white corners. */
const cottage = (x: number, y: number, s = 1, wallCol = '#b5332e') => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -14, 28, 14, wallCol, 0, C.ink, 1.4), path('M-17 -14 L0 -26 L17 -14 Z', C.dark, C.ink, 1.4),
  line('M-13 -14 L-13 0 M13 -14 L13 0', C.white, 2), rect(-4, -9, 7, 9, C.white, 0, C.ink, 1), rect(6, -11, 5, 5, C.white, 0, C.ink, 1));
const birch = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-1.6, -26, 3.2, 26, C.white, 1, C.ink, 1), line('M-1.6 -20 L0 -20 M0 -12 L1.6 -12 M-1.6 -6 L0 -6', C.ink, 1), ellipse(0, -30, 9, 11, '#7fbf6a', C.ink, 1.2));
const pine = (x: number, y: number, s = 1, col = '#3f7d4f') => g(`translate(${x} ${y}) scale(${s})`, path('M0 -26 L8 -10 L4 -10 L10 0 L-10 0 L-4 -10 L-8 -10 Z', col, C.ink, 1.2), rect(-1.5, 0, 3, 4, C.brown, 0, null));
const flower = (x: number, y: number, col: string = C.pink) => all(line(`M${x} ${y} L${x} ${y + 8}`, C.green, 1.4), circle(x, y, 2.4, col, C.ink, 0.8), circle(x, y, 0.9, C.yellow, null));
const apple = (x: number, y: number, s = 1, col: string = C.red) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -7 C-7 -11 -11 -3 -9 3 C-7 9 -2 10 0 8 C2 10 7 9 9 3 C11 -3 7 -11 0 -7 Z', col, C.ink, 1.4), line('M0 -7 L1 -11', C.brown, 1.6), path('M1 -10 C4 -13 7 -11 6 -9 C4 -9 2 -9 1 -10 Z', C.green, C.ink, 0.8));
const bottle = (x: number, y: number, col: string = '#4f8a5a', s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-3 -30 L3 -30 L3 -22 C8 -18 8 -14 8 -10 L8 0 L-8 0 L-8 -10 C-8 -14 -8 -18 -3 -22 Z', col, C.ink, 1.4), line('M-5 -14 L-5 -4', 'rgba(255,255,255,0.5)', 1.6));

export const PAINT_MOTIFS: Record<string, Svg> = {
  // ── 4521 Blyerts och kol ───────────────────────────────────────────
  /** blyertspenna: a big pencil lies across the picture; its grey tip has just drawn a grey curl and a few letters-free lines on paper. */
  'paint.blyertspenna': all(sheet(8, 30, 104, 70), line('M18 82 C28 66 40 92 50 76 C58 64 66 90 74 78', GRAPH, 2), line('M20 46 L56 46 M20 54 L48 54', '#a0a3aa', 1.6),
    pencil(76, 78, -38, 46), ring(76, 78, 9)),
  /** kol (för teckning): three black sticks of charcoal and broad, soft black strokes; one fingertip is black. */
  'paint.kol.3': all(sheet(6, 14, 108, 58), path('M14 52 C30 30 46 60 62 38 C70 28 80 44 98 30', 'none', 'rgba(30,30,36,0.25)', 12), path('M14 52 C30 30 46 60 62 38 C70 28 80 44 98 30', 'none', C.black, 5),
    path('M20 64 C40 58 60 66 90 58', 'none', 'rgba(30,30,36,0.35)', 8),
    ...([[30, 88, -8], [60, 92, 6], [88, 86, -14]] as [number, number, number][]).map(([x, y, r]) => g(`translate(${x} ${y}) rotate(${r})`, path('M-18 -3 L16 -4 L18 0 L16 4 L-18 3 L-19 0 Z', C.black, C.ink, 1.2), line('M-12 -1 L-2 -2 M4 1 L12 0', '#55555e', 1))),
    ring(60, 92, 22)),
  /** suddgummi: a pink and white eraser with a worn corner and crumbs, next to a pencil line with a gap. */
  'paint.suddgummi': all(sheet(8, 52, 104, 50), line('M16 92 L46 92 M74 92 L104 92', GRAPH, 2), line('M16 82 L104 82', GRAPH, 2),
    g('translate(60 66) rotate(-14)', path('M-26 -12 L20 -12 L26 -6 L26 12 L-26 12 Z', C.white, C.ink, 1.8), rect(-26, -12, 20, 24, '#f4a7b9', 1, C.ink, 1.8), path('M20 -12 L26 -6 L20 -6 Z', '#e6e6e6', C.ink, 1)),
    ...([[50, 96], [56, 98], [62, 95], [68, 99], [58, 101]] as [number, number][]).map(([x, y]) => ellipse(x, y, 2, 1.2, '#f4c3cf', C.ink, 0.6))),
  /** sudda: an eraser rubs back and forth over a pencil line; the middle of the line is gone and crumbs fall. */
  'paint.sudda': all(sheet(8, 40, 104, 62), line('M16 72 L44 72 M78 72 L104 72', GRAPH, 2.2), line('M44 72 L78 72', 'rgba(90,93,102,0.25)', 2.2, '3 4'),
    waShake('paint-sudda', g('translate(62 58) rotate(-20)', rect(-12, -18, 24, 36, C.white, 3, C.ink, 1.8), rect(-12, -18, 24, 13, '#f4a7b9', 3, C.ink, 1.8)), fist(76, 40, 16, -14)),
    waIn('paint-sudda-c', 0, -8, ...([[50, 82], [58, 86], [66, 83], [72, 88]] as [number, number][]).map(([x, y]) => ellipse(x, y, 2, 1.2, '#f4c3cf', C.ink, 0.6)))),
  /** vässa: a pencil is pushed into a small sharpener; a curly shaving grows out of the side. */
  'paint.vässa': all(ground(), g('translate(42 74)', path('M-14 -14 L14 -14 L14 14 L-14 14 Z', C.silver, C.ink, 1.8), path('M14 -10 L22 -6 L22 6 L14 10 Z', C.grey, C.ink, 1.4), circle(18, 0, 3, C.dark, null)),
    moving('paint-vassa-p', '0%{transform:translate(14px,0)}50%{transform:translate(4px,0)}100%{transform:translate(14px,0)}', { dur: 1.6 }, pencil(60, 74, 0, 40)),
    waGrow('paint-vassa-s', path('M44 58 C38 48 46 40 54 44 C62 48 56 58 48 54 C44 52 48 46 52 48', '#e8c79a', C.ink, 1.2), line('M48 52 L46 49', '#7a5a3a', 1.6)),
    ...([[30, 104], [36, 108], [52, 106]] as [number, number][]).map(([x, y]) => path(`M${x} ${y} l3 -3 l2 3 Z`, '#e8c79a', C.ink, 0.8))),
  /** kroki: a sheet with three quick gesture figures in different poses (few dark strokes) and a timer at 2 minutes. */
  'paint.kroki': all(sheet(6, 22, 108, 84), ...([[26, 0], [58, 1], [90, 2]] as [number, number][]).map(([x, k]) => g(`translate(${x} 60)`, circle(0, -24, 5, 'none', C.black, 2),
    k === 0 ? line('M0 -19 C2 -6 -2 4 0 14 M0 14 L-8 34 M0 14 L8 34 M0 -14 L-12 -26 M0 -14 L12 -4', C.black, 2.4)
      : k === 1 ? line('M0 -19 C-4 -6 4 4 2 14 M2 14 L-10 30 M2 14 L14 32 M-1 -12 L-14 -6 M-1 -12 L10 -24', C.black, 2.4)
        : line('M0 -19 C4 -8 6 2 0 14 M0 14 L-4 34 M0 14 L12 28 M2 -12 L14 -16 M2 -12 L-10 -2', C.black, 2.4))),
    g('translate(96 14)', circle(0, 0, 11, C.white, C.ink, 1.8), rect(-2, -14, 4, 4, C.dark, 1, null), line('M0 0 L0 -7 M0 0 L5 2', HL, 2)), T(80, 18, '2', 12, HL)),
  /** posera: a person lifts her arm into a pose in front of a camera on a tripod; the camera flashes. */
  'paint.posera': all(ground(), who(40, { top: C.purple, bottom: C.navy, long: true, noL: true, r: [8, 70] }),
    swing('paint-posera', 31, 45, -148, g('translate(40 0)', line('M-9 45 L-22 24', C.ink, 7.4), line('M-9 45 L-22 24', C.purple, 5.2), circle(-22, 24, 3.2, C.skin, C.ink, 1.2))),
    line('M96 112 L96 74 M96 74 L86 112 M96 74 L106 112', C.dark, 2), rect(84, 56, 24, 18, C.dark, 3, C.ink, 1.6), circle(90, 65, 6, '#4a6a8a', C.ink, 1.4), rect(100, 52, 6, 4, C.grey, 1, C.ink, 1),
    waPulse('paint-posera-f', path('M78 52 L72 46 M76 62 L68 62 M78 72 L72 78', 'none', C.gold, 2.4), sparkle(80, 60, 5))),
  /** stilleben: a framed painting of apples in a bowl, a green bottle and a jug on a table with a cloth. */
  'paint.stilleben': all(wall(), frame(18, 18, 84, 70, GOLD, rect(18, 18, 84, 70, '#5c4a3e', 0, null), rect(18, 64, 84, 24, '#8a6a4a', 0, null), path('M18 64 L102 64 L102 88 L60 88 C46 80 30 92 18 84 Z', '#efe6d0', null),
    bottle(80, 66, '#3f7d4f', 1.1), path('M34 46 L48 46 C50 54 50 60 46 66 L36 66 C32 60 32 54 34 46 Z', '#c7a26b', C.ink, 1.2), path('M48 50 C54 50 54 58 48 58', 'none', C.ink, 1.4),
    ellipse(58, 70, 14, 4, C.white, C.ink, 1.2), apple(52, 64, 0.7), apple(62, 63, 0.7, C.yellow), apple(58, 58, 0.7, '#d46a3a')), ground()),

  // ── 4522 Akvarell ──────────────────────────────────────────────────
  /** akvarell: a finished watercolour taped to a board: soft sky, hills, a lake and birches in see-through colour that flows together. */
  'paint.akvarell': all(rect(6, 12, 108, 92, WOOD, 3, C.ink, 1.6), sheet(12, 18, 96, 80), path('M12 18 L108 18 L108 52 C80 46 40 56 12 50 Z', 'rgba(140,199,232,0.55)', null), ellipse(40, 34, 18, 7, 'rgba(255,255,255,0.7)', null),
    path('M12 62 C30 46 48 54 64 50 C80 46 96 52 108 58 L108 72 L12 72 Z', 'rgba(111,174,107,0.55)', null), path('M12 70 C40 64 80 68 108 66 L108 98 L12 98 Z', 'rgba(91,155,213,0.45)', null),
    path('M20 76 C40 72 80 78 100 74', 'none', 'rgba(255,255,255,0.7)', 2), ...([[30, 62], [36, 64]] as [number, number][]).map(([x, y]) => all(line(`M${x} ${y} L${x} ${y - 20}`, 'rgba(60,60,60,0.6)', 1.6), ellipse(x, y - 22, 6, 7, 'rgba(160,200,90,0.55)', null))),
    tape(13, 19), tape(107, 19, 20), tape(13, 97, 20), tape(107, 97, -20), brush(98, 108, -170, 34, '#5b9bd5')),
  /** måla (bild): a painter at an easel; her arm with the brush swings and a new red stroke appears on the canvas (a flower). */
  'paint.måla.2': all(ground(), easel(76, 18, 84), canvas(54, 22, 44, 52, line('M76 66 L76 46', C.green, 2.4), path('M72 56 C66 52 66 48 72 50', C.green, null)),
    appear('paint-mala-s', circle(76, 40, 7, C.red, null), circle(76, 40, 2.6, C.yellow, null)), who(30, { top: C.orange, long: true, noR: true, l: [-12, 76] }),
    swing('paint-mala-b', 39, 45, 25, line('M39 45 L66 44', C.ink, 7.4), line('M39 45 L66 44', C.orange, 5.2), circle(66, 44, 3.2, C.skin, C.ink, 1.2), brush(72, 42, 168, 30, C.red, WOOD))),
  /** vattenfärg: an open box of watercolours with twelve colour cakes and a brush across it. */
  'paint.vattenfärg': all(ground(100), rect(10, 50, 100, 46, C.dark, 3, C.ink, 1.8), rect(14, 54, 92, 38, C.white, 2, C.ink, 1.2),
    ...range(12).map((i) => rect(18 + (i % 6) * 14.4, 58 + Math.floor(i / 6) * 16, 11, 12, [C.yellow, C.orange, C.red, C.pink, C.purple, C.navy, C.sky, C.green, '#2f6f3f', C.brown, '#7a4a2a', C.black][i]!, 1.5, C.ink, 1)),
    path('M10 50 L110 50 L104 18 L16 18 Z', '#4a4c58', C.ink, 1.8), rect(26, 26, 68, 16, C.white, 2, C.ink, 1), ...range(3).map((i) => ellipse(40 + i * 20, 34, 7, 4, ['rgba(91,155,213,0.6)', 'rgba(214,69,69,0.5)', 'rgba(79,157,105,0.5)'][i]!, null)),
    brush(30, 104, -15, 66, C.navy, C.red)),
  /** kursledare: a teacher in orange stands by an easel and shows a painting with an open hand; three students sit with their backs to us. */
  'paint.kursledare': all(wall(), easel(84, 30, 84), canvas(66, 32, 36, 30, rect(66, 32, 36, 30, 'rgba(140,199,232,0.5)', 0, null), path('M66 54 C76 46 88 50 102 46 L102 62 L66 62 Z', 'rgba(111,174,107,0.6)', null)),
    who(46, { top: HL, s: 0.9, r: [22, 50], l: [-13, 78] }), g('translate(68 50)', palm(0, 0, 70)),
    ...[18, 50, 82].map((x) => g(`translate(${x} 100)`, path('M-12 20 C-12 8 -6 4 0 4 C6 4 12 8 12 20 Z', C.grey, C.ink, 1.4), circle(0, -2, 7, C.hair, C.ink, 1.4)))),
  /** blöta: a wide brush with clear water moves over the paper; behind it the paper shines wet (pale blue with white glints); a jar of water. */
  'paint.blöta': all(sheet(8, 30, 104, 70), waIn('paint-bloeta-w', -30, 0, path('M14 44 L74 44 L74 88 L14 88 Z', 'rgba(140,199,232,0.4)', null), line('M22 52 L40 50 M30 64 L56 62 M20 78 L44 76', C.white, 2.2), sparkle(60, 56, 3.6, C.white)),
    moving('paint-bloeta-b', '0%{transform:translate(-50px,0)}55%,100%{transform:translate(0,0)}', { dur: 2.6 }, flatBrush(78, 66, -50, WATER)), jar(92, 70, 18, 26), drop2(80, 52)),
  /** späda ut: three wells from dark to light blue; drops of water fall into the last well and an arrow shows that the colour gets lighter. */
  'paint.späda-ut': all(rect(6, 56, 108, 36, C.white, 10, C.ink, 1.8), ...[0, 1, 2].map((i) => all(ellipse(26 + i * 34, 74, 13, 9, ['#2f5d8a', '#6f9bc9', '#c3dbef'][i]!, C.ink, 1.4), ellipse(22 + i * 34, 71, 4, 2, 'rgba(255,255,255,0.6)', null))),
    arrow(20, 102, 98, 102, HL, 3), g('translate(94 24) rotate(20)', rect(-4, -18, 8, 24, 'rgba(220,240,252,0.8)', 2, C.ink, 1.4), rect(-6, -26, 12, 10, C.red, 3, C.ink, 1.4)),
    waIn('paint-spada', 0, -20, path('M92 44 C95 49 95 53 92 53 C89 53 89 49 92 44 Z', WATER, C.ink, 1), path('M94 56 C97 61 97 65 94 65 C91 65 91 61 94 56 Z', WATER, C.ink, 1))),
  /** vått i vått: on paper that shines wet, a brush touches it and the colour blooms out with soft, fuzzy edges. */
  'paint.vått-i-vått': all(sheet(8, 20, 104, 84), path('M16 30 L104 30 L104 96 L16 96 Z', 'rgba(140,199,232,0.25)', null), line('M24 40 L44 38 M70 88 L96 86', C.white, 2),
    waGrow('paint-vatt', circle(56, 64, 30, 'rgba(214,69,69,0.12)', null), circle(56, 64, 22, 'rgba(214,69,69,0.2)', null), circle(56, 64, 14, 'rgba(214,69,69,0.35)', null), circle(56, 64, 7, 'rgba(214,69,69,0.55)', null),
      circle(76, 52, 14, 'rgba(242,193,78,0.3)', null), circle(76, 52, 8, 'rgba(242,193,78,0.5)', null)),
    brush(58, 62, -40, 44, '#c23a3a', WOOD)),
  /** tusch: a black ink stick with a gold pattern, a stone with a pool of black ink and a bottle of ink; one black brush stroke. */
  'paint.tusch': all(ground(), g('translate(42 86)', rect(-28, -8, 56, 22, '#4a4c58', 4, C.ink, 1.8), ellipse(-8, 3, 16, 7, C.black, C.ink, 1.2), ellipse(-12, 1, 4, 1.6, 'rgba(255,255,255,0.4)', null)),
    g('translate(30 46) rotate(-20)', rect(-6, -22, 12, 44, C.black, 2, C.ink, 1.6), path('M-3 -12 L3 -12 L0 -6 Z M-3 0 L3 0 L0 6 Z', C.gold, null)),
    path('M86 104 L86 70 L80 64 L80 54 L96 54 L96 64 L90 70 L90 104', C.black, C.ink, 1.6), rect(78, 70, 24, 34, C.black, 3, C.ink, 1.6), rect(82, 80, 16, 14, C.white, 1, null), circle(90, 87, 4, C.red, null),
    path('M56 30 C70 22 86 26 104 18', 'none', C.black, 5)),
  /** tuschmålning: a hanging scroll with bamboo in black and grey ink and a small red seal. */
  'paint.tuschmålning': all(wall(), line('M60 2 L46 12 M60 2 L74 12', C.ink, 1.2), rect(34, 12, 52, 6, WOOD2, 2, C.ink, 1.4), rect(36, 18, 48, 86, '#f3ecd8', 0, C.ink, 1.4), rect(32, 104, 56, 6, WOOD2, 3, C.ink, 1.4),
    line('M50 100 L50 26 M64 100 C64 70 66 50 66 30', C.black, 3.4), line('M50 80 L50 81 M50 56 L50 57 M65 78 L65 79 M65.6 54 L65.6 55', C.white, 2),
    ...([[50, 50, -30], [50, 72, 30], [66, 44, 30], [66, 62, -35], [66, 36, -60]] as [number, number, number][]).map(([x, y, r]) => g(`translate(${x} ${y}) rotate(${r})`, path('M0 0 C6 -2 14 -2 20 0 C14 2 6 2 0 0 Z', 'rgba(46,46,54,0.75)', null))),
    path('M42 92 C52 88 60 92 74 88', 'none', 'rgba(46,46,54,0.25)', 3), rect(74, 90, 7, 7, '#c23a3a', 1, null)),
  /** vattenfast (symbol): water drops fall on two lines; the black one stays sharp (tick), the grey one runs and blurs (cross). */
  'paint.vattenfast': all(sheet(8, 30, 104, 72), line('M22 46 L22 90', C.black, 4), ...([[22, 40], [22, 60], [22, 80]] as [number, number][]).map(([x, y]) => drop2(x + 6, y)), tick(28, 20),
    greyed(path('M80 44 C76 56 86 66 80 78 C76 86 84 92 80 96', 'none', '#555', 10), line('M80 46 L80 90', '#333', 3)), ...([[86, 40], [86, 62], [86, 82]] as [number, number][]).map(([x, y]) => drop2(x, y)), cross(84, 20, 5)),

  // ── 4523 Akryl och oljefärg ────────────────────────────────────────
  /** målning: a framed painting of a sailing boat on the sea hangs on a museum wall under a lamp, with a small label. */
  'paint.målning': all(wall(), path('M50 4 L70 4 L66 10 L54 10 Z', C.dark, C.ink, 1.2), path('M54 10 L30 30 L90 30 L66 10 Z', 'rgba(255,240,180,0.45)', null),
    frame(24, 30, 72, 54, GOLD, rect(24, 30, 72, 34, '#f2c6a0', 0, null), rect(24, 64, 72, 20, '#3f6fb5', 0, null), path('M24 66 C40 62 56 70 96 64', 'none', '#8cc7e8', 2), path('M56 62 L56 40 L70 60 Z', C.white, C.ink, 1), path('M46 62 L72 62 L68 68 L50 68 Z', C.brown, C.ink, 1), circle(84, 42, 6, '#f08a3c', null)),
    rect(52, 94, 16, 8, C.white, 1, C.ink, 1), ground()),
  /** oljefärg: a metal tube with a golden oil drop on the label and a thick, glossy blob of paint with ridges. */
  'paint.oljefärg': all(ground(100), tube(20, 54, '#2f5d8a', 1.6, 0, C.silver, path('M22 -4 C25 0 25 3 22 3 C19 3 19 0 22 -4 Z', C.gold, C.ink, 0.8)),
    g('translate(64 86)', path('M-30 10 C-34 -2 -20 -10 -6 -8 C4 -16 22 -12 26 -2 C34 0 32 12 22 12 Z', '#2f5d8a', C.ink, 1.6), path('M-20 0 C-10 -6 0 -4 10 -8 M-14 6 C0 2 10 4 20 0', 'none', '#5b8cc0', 2), path('M-8 -6 C-2 -10 6 -10 10 -6', 'none', C.white, 2.2)),
    path('M96 30 C102 40 102 48 96 48 C90 48 90 40 96 30 Z', C.gold, C.ink, 1.4), path('M93 40 C93 44 95 45 96 45', 'none', C.white, 1.2)),
  /** akrylfärg: a plastic tube with a water drop on the label, a flat blob of paint and a brush standing in a glass of blue water. */
  'paint.akrylfärg': all(ground(104), tube(16, 60, C.red, 1.4, 0, C.white, path('M22 -4 C25 0 25 3 22 3 C19 3 19 0 22 -4 Z', '#5b9bd5', C.ink, 0.8)),
    g('translate(40 92)', path('M-24 6 C-26 0 -16 -4 0 -3 C16 -4 26 0 24 6 C14 9 -14 9 -24 6 Z', C.red, C.ink, 1.4)), jar(78, 58, 26, 46, '#9fcbe8', 0.7), brush(90, 66, -80, 48, C.red, C.yellow),
    path('M100 30 C104 37 104 42 100 42 C96 42 96 37 100 30 Z', '#5b9bd5', C.ink, 1.2)),
  /** tub: three kinds of tube side by side: toothpaste with a ribbon of paste, a small cream tube and a paint tube. */
  'paint.tub': all(ground(), tube(46, 34, '#5b9bd5', 1.4, 0, C.white), path('M34 34 C28 30 22 38 14 34', 'none', C.ink, 6.4), path('M34 34 C28 30 22 38 14 34', 'none', C.white, 4.4), line('M34 33 C28 29 22 37 14 33', '#5b9bd5', 1.2),
    tube(40, 68, C.mint, 1, 0, C.white), tube(30, 98, C.orange, 1.4, -6)),
  /** palettkniv: a cranked palette knife spreads a thick ridge of paint over the canvas; the knife moves and the paint comes after it. */
  'paint.palettkniv': all(canvas(8, 40, 104, 64), appear('paint-pk-p', path('M18 82 C30 76 46 78 60 74 L62 84 C48 88 32 88 18 90 Z', '#e0b23c', C.ink, 1.2), line('M22 84 C34 80 46 82 58 78', '#f5d78a', 1.6)),
    moving('paint-pk-k', '0%{transform:translate(-36px,6px)}55%,100%{transform:translate(0,0)}', { dur: 2.6 }, path('M58 82 L72 74 L80 76 L68 86 Z', C.silver, C.ink, 1.4), line('M76 75 L84 64 L104 52', C.ink, 1.6),
      path('M84 64 L104 50 L108 54 L88 68 Z', '#6b4a32', C.ink, 1.4))),
  /** förkläde: a canvas apron with paint stains hangs on a hook by its neck strap. */
  'paint.förkläde': all(wall(), circle(60, 12, 3, C.dark, C.ink, 1.2), path('M50 30 C50 16 70 16 70 30', 'none', '#7a6a52', 2.4), path('M44 30 L76 30 L78 50 L92 54 L88 104 L32 104 L28 54 L42 50 Z', '#d9c9a3', C.ink, 2),
    line('M28 54 L14 70 M92 54 L106 70', '#7a6a52', 2.4), rect(48, 66, 24, 16, 'none', 1, C.ink, 1.4), blob(40, 90, C.red, 0.8), blob(76, 72, C.navy, 0.7), blob(62, 96, C.green, 0.6), blob(54, 44, C.yellow, 0.5)),
  /** täckande (symbol): over black stripes, an orange patch hides them completely (tick); a grey see-through patch still shows them (cross). */
  'paint.täckande': all(rect(8, 24, 104, 72, C.white, 2, C.ink, 1.6), line(range(9).map((i) => `M${14 + i * 11} 28 L${14 + i * 11} 92`).join(' '), C.black, 4),
    rect(14, 40, 40, 40, HL, 2, C.ink, 1.6), tick(34, 106), rect(66, 40, 40, 40, 'rgba(160,165,172,0.45)', 2, C.grey, 1.6), cross(86, 106, 5)),
  /** måla över: a brush with blue paint sweeps over a grey tree on the canvas; most of the tree is already covered. */
  'paint.måla-över': all(canvas(10, 20, 100, 80), rect(10, 20, 100, 80, '#eaf4fb', 0, null), greyed(line('M46 96 L46 64', C.brown, 6), circle(46, 52, 18, C.green, C.ink, 1.4)),
    waIn('paint-over', -40, 0, path('M12 36 L80 34 L82 74 L12 76 Z', '#8cc7e8', null), line('M14 42 L78 40 M14 56 L80 54 M14 68 L80 66', '#a9d6ef', 2)),
    moving('paint-over-b', '0%{transform:translate(-40px,0)}55%,100%{transform:translate(0,0)}', { dur: 2.6 }, flatBrush(84, 54, -40, '#8cc7e8', C.red))),
  /** linolja: a glass bottle with golden oil next to a flax plant with blue flowers; a drop falls into a blob of paint. */
  'paint.linolja': all(ground(), bottle(40, 110, 'rgba(224,178,60,0.75)', 2.2), rect(32, 44, 16, 8, C.dark, 1, C.ink, 1.2),
    ...([[80, 48], [92, 40], [100, 56], [86, 62]] as [number, number][]).map(([x, y]) => all(line(`M${x} ${y} L${88} 112`, C.green, 1.6), ...range(5).map((i) => ellipse(x + Math.cos(i * 1.256) * 4, y + Math.sin(i * 1.256) * 4, 3, 2, '#6f9be0', null)), circle(x, y, 1.6, C.yellow, null))),
    waIn('paint-lin', 0, -14, path('M62 80 C65 85 65 89 62 89 C59 89 59 85 62 80 Z', C.gold, C.ink, 1)), blob(62, 100, C.red, 1.2)),
  /** terpentin: a metal can full of clear liquid with brushes standing in it; wavy lines of strong smell rise from it. */
  'paint.terpentin': all(ground(), rect(36, 56, 48, 56, C.silver, 3, C.ink, 1.8), ellipse(60, 56, 24, 6, '#d8e6c0', C.ink, 1.6), line('M40 66 L80 66', C.grey, 1.4),
    brush(52, 60, -100, 50, C.navy, C.red), brush(62, 58, -80, 54, C.green, C.yellow), brush(70, 60, -65, 46, C.red, WOOD),
    moving('paint-terp', '0%{transform:translate(0,8px);opacity:0}50%{opacity:1}100%{transform:translate(0,-6px);opacity:0}', { dur: 2.4 }, path('M30 44 C26 36 34 32 30 24 M92 44 C88 36 96 32 92 24 M100 52 C96 44 104 40 100 32', 'none', '#8fbf5a', 2.4))),
  /** fernissa: a wide brush with clear varnish moves over a painting; the left half is glossy with white glints, the right half is still dull. */
  'paint.fernissa': all(canvas(8, 22, 104, 76), rect(8, 22, 104, 76, '#c97a4a', 0, null), path('M8 74 C40 60 70 80 112 64 L112 98 L8 98 Z', '#6a4a8a', null), circle(80, 42, 10, C.yellow, null),
    path('M8 22 L60 22 L60 98 L8 98 Z', 'rgba(255,255,255,0.18)', null), line('M14 30 L28 44 M22 30 L44 52 M16 70 L30 84', 'rgba(255,255,255,0.75)', 2.2), sparkle(42, 34, 4, C.white), sparkle(24, 60, 3, C.white),
    moving('paint-fern', '0%{transform:translate(-40px,0)}55%,100%{transform:translate(0,0)}', { dur: 2.6 }, flatBrush(62, 60, -60, '#f3d58a')), jar(90, 100, 18, 16, '#e0b23c', 0.7)),

  // ── 4524 Penslar och dukar ─────────────────────────────────────────
  /** borst: a brush with a ring around its head and a big round close-up of the stiff bristles, hair by hair. */
  'paint.borst': all(brush(22, 98, -50, 50, '#d9b886', C.red), ring(28, 91, 10), line('M36 84 L54 64', HL, 2), circle(80, 42, 32, C.white, HL, 3),
    ...range(13).map((i) => line(`M${62 + i * 3} 70 L${60 + i * 3.2} 18`, i % 2 ? '#c49a62' : '#e0c08a', 2.2)), rect(56, 64, 48, 10, C.silver, 1, C.ink, 1.2)),
  /** doppa: a brush dips down into a jar of red paint and comes up again; a drip hangs from the tip. */
  'paint.doppa': all(ground(), jar(40, 70, 40, 42, C.red, 0.55), ellipse(60, 89, 19, 3, '#e86a6a', null),
    waBob('paint-doppa', 12, brush(60, 92, -88, 70, C.red, WOOD), path('M60 92 C62 96 62 99 60 99 C58 99 58 96 60 92 Z', C.red, C.ink, 0.8))),
  /** penseldrag: one broad orange stroke with dry-brush streaks across a white canvas; a small grey brush at its end. */
  'paint.penseldrag': all(canvas(8, 24, 104, 72), path('M18 72 C34 46 64 44 98 50 L100 60 C66 56 40 60 22 80 Z', HL, null),
    line('M24 72 C38 54 64 50 96 54 M28 76 C44 58 66 56 98 58', 'rgba(255,255,255,0.65)', 1.2), line('M96 50 L104 48 M98 55 L106 54 M98 60 L104 61', HL, 1.6), greyed(brush(104, 54, -10, 30, C.ink, C.red))),
  /** duk (att måla på): a blank canvas seen at an angle: white front, linen side wrapped round the stretcher with staples. */
  'paint.duk.2': all(ground(), path('M24 18 L88 26 L88 104 L24 110 Z', C.white, C.ink, 2), path('M88 26 L98 22 L98 100 L88 104 Z', LINEN, C.ink, 1.8),
    ...range(6).map((i) => rect(91, 30 + i * 12, 4, 2, C.silver, 0, C.ink, 0.6)), line(range(8).map((i) => `M${30 + i * 7} ${20 + i * 0.9} L${30 + i * 7} ${108 - i * 0.7}`).join(' '), 'rgba(200,190,170,0.35)', 1), ring(60, 64, 46)),
  /** ram (runt en tavla): an empty, wide gold frame with corner ornaments hangs on the wall; the wall shows through the middle. */
  'paint.ram.2': all(wall(), rect(16, 14, 88, 84, GOLD, 2, C.ink, 2), rect(30, 28, 60, 56, WALL, 0, C.ink, 2), rect(22, 20, 76, 72, 'none', 1, '#b8862a', 1.6),
    ...([[22, 20], [98, 20], [22, 92], [98, 92]] as [number, number][]).map(([x, y]) => circle(x, y, 4, '#f0c85a', C.ink, 1.2)), line('M60 6 L44 14 M60 6 L76 14', C.ink, 1.2), circle(60, 6, 2, C.dark, null)),
  /** kilram: a bare wooden stretcher (four laths and a cross bar) leaning on the wall; the small wooden wedges in two inner corners are ringed in orange. */
  'paint.kilram': all(wall(), ground(), rect(18, 20, 84, 88, 'none', 1, C.ink, 10.4), rect(18, 20, 84, 88, 'none', 1, WOOD, 8), line('M60 20 L60 108', C.ink, 8.4), line('M60 20 L60 108', WOOD2, 6),
    path('M22 24 L32 24 L22 34 Z', '#e6c08f', C.ink, 1.2), path('M98 104 L88 104 L98 94 Z', '#e6c08f', C.ink, 1.2), path('M98 24 L88 24 L98 34 Z', '#e6c08f', C.ink, 1.2), path('M22 104 L32 104 L22 94 Z', '#e6c08f', C.ink, 1.2),
    ring(27, 29, 10), ring(93, 99, 10)),
  /** spänna upp: seen from behind, two hands pull the linen over the edge of a wooden stretcher; orange arrows pull outwards. */
  'paint.spänna-upp': all(rect(14, 22, 92, 76, LINEN, 1, C.ink, 1.6), rect(24, 32, 72, 56, 'none', 1, WOOD2, 8), rect(24, 32, 72, 56, 'none', 1, C.ink, 1),
    line('M24 60 L96 60 M60 32 L60 88', WOOD, 5), waIn('paint-spann', 10, 0, palm(20, 60, -90), arrow(24, 44, 8, 44, HL, 2.6)), waIn('paint-spann2', -10, 0, palm(100, 60, 90), arrow(96, 44, 112, 44, HL, 2.6)),
    ...[44, 60, 76].map((x) => rect(x - 2, 25, 4, 2, C.silver, 0, C.ink, 0.6))),
  /** häftpistol: a staple gun with a red body and a strip of staples next to it. */
  'paint.häftpistol': all(ground(), path('M18 54 L86 46 C94 46 96 52 92 56 L30 66 C22 68 16 62 18 54 Z', C.red, C.ink, 1.8), path('M30 66 L86 58 L84 70 L32 78 Z', C.dark, C.ink, 1.6),
    path('M52 62 C60 76 72 92 92 94 L94 86 C80 84 70 72 64 60 Z', C.silver, C.ink, 1.6), rect(24, 80, 10, 4, C.grey, 0, C.ink, 1), line(range(8).map((i) => `M${28 + i * 8} 104 L${28 + i * 8} 98 L${34 + i * 8} 98 L${34 + i * 8} 104`).join(' '), C.silver, 1.6)),
  /** grundera: a wide brush puts white primer on a raw beige linen canvas; the white band grows behind the brush; a tin of white primer. */
  'paint.grundera': all(canvas(8, 18, 92, 80), rect(8, 18, 92, 80, LINEN, 0, null), line(range(12).map((i) => `M${12 + i * 7.6} 20 L${12 + i * 7.6} 96`).join(' '), 'rgba(160,140,110,0.3)', 1),
    waIn('paint-grund', -40, 0, rect(10, 20, 62, 76, C.white, 0, null)), moving('paint-grund-b', '0%{transform:translate(-40px,0)}55%,100%{transform:translate(0,0)}', { dur: 2.6 }, flatBrush(74, 58, -40, C.white)),
    rect(92, 84, 22, 24, C.silver, 2, C.ink, 1.6), ellipse(103, 84, 11, 3, C.white, C.ink, 1.2)),
  /** staffli: a wooden easel on its own: three legs, a ledge and a clamp at the top, with no canvas on it. */
  'paint.staffli': all(ground(), line('M60 12 L68 112', WOOD2, 4), line('M56 12 L36 112 M64 12 L84 112', C.ink, 6), line('M56 12 L36 112 M64 12 L84 112', WOOD, 4), rect(52, 8, 16, 8, WOOD, 2, C.ink, 1.4),
    rect(34, 76, 52, 6, WOOD, 1, C.ink, 1.6), rect(56, 20, 8, 6, WOOD2, 1, C.ink, 1.2), ring(60, 60, 50)),
  /** tavelkrok: a brass picture hook with its nail in the wall, ringed and enlarged; the wire of a frame hangs on it. */
  'paint.tavelkrok': all(wall(), line('M60 50 L26 88 M60 50 L94 88', C.dark, 1.4), frame(22, 88, 76, 26, GOLD), circle(60, 34, 26, WALL, HL, 3),
    rect(53, 16, 12, 16, '#d9a93a', 2, C.ink, 1.4), line('M56 20 L70 30', C.dark, 2.6), circle(56, 20, 2, C.silver, C.ink, 1), path('M59 32 L59 40 C59 48 71 48 71 40 L71 36', 'none', C.ink, 5), path('M59 32 L59 40 C59 48 71 48 71 40 L71 36', 'none', '#d9a93a', 3), line('M40 54 L65 46 L82 54', C.dark, 1.6)),

  // ── 4525 Porträttmåleri ────────────────────────────────────────────
  /** självporträtt: a painter looks into a mirror on the wall; the canvas on her easel shows the same face as in the mirror. */
  'paint.självporträtt': all(wall(), ellipse(26, 36, 16, 20, '#cfe6f5', C.ink, 2), face(26, 34, 9, { long: true, hair: '#6b3b25', top: C.orange }),
    who(56, { top: C.orange, long: true, hair: '#6b3b25', back: true, r: [24, 46] }), easel(94, 26, 86), canvas(76, 30, 36, 48, face(94, 50, 12, { long: true, hair: '#6b3b25', top: C.orange })),
    line('M48 34 L36 36', HL, 1.6, '3 2')),
  /** sitta modell: a man sits still on a chair (in colour); a grey painter at an easel moves the brush up and down. */
  'paint.sitta-modell': all(ground(), rect(14, 80, 32, 6, WOOD, 1, C.ink, 1.4), line('M16 86 L16 112 M44 86 L44 112 M16 56 L16 86', WOOD2, 3), who(30, { top: C.green, seated: true, face: 'neutral', r: [12, 82], l: [-12, 82] }),
    greyed(easel(94, 28, 86), canvas(78, 32, 32, 40, face(94, 50, 10)), who(70, { back: true, s: 0.85 })), moving('paint-sitta', '0%,100%{transform:translate(0,0)}50%{transform:translate(0,8px)}', { dur: 1.8 }, brush(82, 50, 150, 26, C.ink, C.grey))),
  /** bröstbild: a framed picture shows a woman from the head down to the chest; a grey whole figure beside it has an orange cut line at the chest. */
  'paint.bröstbild': all(wall(), frame(14, 20, 56, 66, GOLD, rect(14, 20, 56, 66, '#cfe0ea', 0, null), path('M18 86 C18 66 30 60 42 60 C54 60 66 66 66 86 Z', C.purple, C.ink, 1.4), face(42, 44, 14, { long: true, hair: '#3b2f2f' })),
    greyed(who(96, { s: 0.75, long: true })), line('M80 66 L112 66', HL, 2.4, '4 3'), line('M84 62 L84 70 M108 62 L108 70', HL, 2)),
  /** profil (från sidan): an oval frame with a dark silhouette of a head seen from the side; a small grey face from the front is crossed out. */
  'paint.profil.3': all(wall(), ellipse(52, 60, 34, 44, GOLD, C.ink, 2), ellipse(52, 60, 28, 38, '#f6efe0', C.ink, 1.4), profileHead(54, 58, 1.25, C.black, C.black),
    greyed(face(100, 30, 9)), cross(100, 30, 12, C.grey)),
  /** blick: two big eyes in a portrait look to the side; an orange dashed line goes from the eyes to a small flower they are looking at. */
  'paint.blick': all(wall(), frame(14, 22, 60, 56, GOLD, rect(14, 22, 60, 56, '#f1c7a1', 0, null), path('M14 30 C30 22 58 22 74 30 L74 38 C58 30 30 30 14 38 Z', C.hair, null),
    ellipse(32, 50, 10, 6, C.white, C.ink, 1.4), ellipse(58, 50, 10, 6, C.white, C.ink, 1.4), circle(37, 50, 4, '#4a6a8a', null), circle(63, 50, 4, '#4a6a8a', null), circle(37, 50, 1.6, C.ink, null), circle(63, 50, 1.6, C.ink, null),
    line('M24 42 L40 40 M50 40 L66 42', C.hair, 2.4), path('M38 66 Q46 70 54 66', 'none', C.ink, 1.4)), line('M68 50 L98 84', HL, 2.4, '5 4'), flower(102, 88, C.red), flower(108, 92, C.pink)),
  /** hovmålare: a painter in orange paints a king who sits on a throne with a crown and a red cape; the canvas shows the crowned king. */
  'paint.hovmålare': all(wall(), path('M8 112 L8 54 C8 46 34 46 34 54 L34 112 Z', '#8a2a2a', C.ink, 1.6), who(21, { top: '#b5332e', crown: true, seated: true, face: 'neutral', r: [12, 84], l: [-12, 84] }),
    easel(96, 34, 88), canvas(80, 38, 32, 40, rect(80, 38, 32, 40, '#e8d8b0', 0, null), face(96, 56, 9), path('M90 46 L90 42 L93 44 L96 41 L99 44 L102 42 L102 46 Z', C.gold, C.ink, 0.8)),
    who(64, { top: HL, s: 0.9, r: [24, 40], l: [-13, 78] }), brush(88, 50, 160, 26, C.red, WOOD)),
  /** naturtrogen (symbol): a real apple on a table and a framed painting of exactly the same apple with = between them; below, a grey clumsy apple painting with ≠. */
  'paint.naturtrogen': all(wall(), rect(0, 64, 120, 48, '#d8cbb3', 0, null), apple(24, 54, 1.6), frame(64, 22, 40, 40, GOLD, rect(64, 22, 40, 40, '#f6efe0', 0, null), apple(84, 44, 1.6)),
    T(46, 50, '=', 16, HL), greyed(frame(72, 82, 24, 20, GOLD, path('M78 88 C76 98 92 100 90 90 C88 84 82 82 78 88 Z', C.red, C.ink, 1)), T(56, 98, '≠', 14, C.ink))),
  /** karikatyr: a drawing of a face with a huge nose, huge ears and a tiny body; a small grey normal face beside it for comparison. */
  'paint.karikatyr': all(sheet(10, 10, 80, 96), face(50, 48, 20, { nose: 2.6, ears: 1.8, hair: C.hair }), line('M50 70 L50 86 M50 76 L42 82 M50 76 L58 82 M50 86 L46 96 M50 86 L54 96', C.ink, 2),
    greyed(face(104, 60, 9, { top: C.grey })), T(104, 40, '≠', 10, C.grey)),

  // ── 4526 Landskapsmåleri ───────────────────────────────────────────
  /** landskap (målning): a framed landscape painting (mountains, lake, sun) hangs on a gallery wall above a bench. */
  'paint.landskap.3': all(wall(), frame(16, 16, 88, 60, GOLD, scenery(16, 16, 88, 60, { sun: C.yellow })), rect(30, 94, 60, 6, WOOD, 1, C.ink, 1.4), line('M36 100 L36 112 M84 100 L84 112', WOOD2, 3), ground()),
  /** friluftsmåleri: a painter stands outdoors at a light easel in a meadow with trees and sun; the canvas shows the same view; her brush moves. */
  'paint.friluftsmåleri': all(rect(0, 0, 120, 120, '#d9eef9', 0, null), circle(100, 18, 8, C.yellow, null), path('M0 70 C30 56 70 60 120 66 L120 120 L0 120 Z', '#a7d38c', null), pine(14, 70, 1.2), pine(26, 68, 0.9), birch(110, 70, 1),
    line('M70 46 L62 112 M70 46 L80 112 M70 46 L72 112', WOOD2, 2.4), canvas(56, 40, 30, 26, rect(56, 40, 30, 26, '#d9eef9', 0, null), path('M56 58 C64 52 74 54 86 56 L86 66 L56 66 Z', '#a7d38c', null), pine(62, 58, 0.4)),
    who(36, { top: C.orange, long: true, s: 0.9, r: [22, 52], l: [-13, 78] }), moving('paint-frilu', '0%,100%{transform:translate(0,0)}50%{transform:translate(2px,-7px)}', { dur: 1.8 }, brush(60, 56, 168, 22, C.green, WOOD)),
    flower(96, 96), flower(104, 100, C.yellow), flower(20, 100)),
  /** fältstaffli: a light folding field easel: folded and carried by its strap (left), arrow, and set up with telescopic legs (right). */
  'paint.fältstaffli': all(ground(), rect(10, 58, 30, 22, WOOD, 3, C.ink, 1.6), path('M14 58 C14 40 36 40 36 58', 'none', C.dark, 2.4), line('M12 80 L12 104 M24 80 L24 104 M38 80 L38 104', WOOD2, 2), arrow(44, 72, 58, 72, HL, 3),
    rect(70, 40, 40, 16, WOOD, 3, C.ink, 1.6), rect(76, 22, 28, 18, C.white, 1, C.ink, 1.4), line('M76 56 L64 112 M104 56 L116 112 M90 56 L90 112', C.ink, 3), line('M76 56 L64 112 M104 56 L116 112 M90 56 L90 112', C.silver, 1.6),
    line('M72 80 L76 80 M106 80 L110 80 M88 84 L92 84', C.dark, 2)),
  /** skifta: the same mountain lake three times: pink morning, blue noon and orange evening, with arrows between; the sun moves across. */
  'paint.skifta': all(...[0, 1, 2].map((i) => all(scenery(6 + i * 36 + i * 2, 30, 32, 52, { sky: ['#f6c9d4', '#bfe3f5', '#f5a46a'][i], hill: ['#9a86b8', '#6f8fb5', '#6b4a6a'][i], water: ['#d8b4c8', '#8cc7e8', '#c97a4a'][i], sun: ['#fbe3a0', C.yellow, '#ef8a3c'][i] }),
    rect(6 + i * 38, 30, 32, 52, 'none', 1, C.ink, 1.6))), arrow(39, 92, 43, 92, HL, 2.4), arrow(77, 92, 81, 92, HL, 2.4), line('M6 92 L36 92 M44 92 L74 92 M82 92 L112 92', HL, 2),
    moving('paint-skifta', '0%{transform:translate(-76px,10px)}50%{transform:translate(-38px,-4px)}100%{transform:translate(0,8px)}', { dur: 4 }, circle(104, 20, 5, C.yellow, C.ink, 1))),
  /** spegling: a mountain and pines stand by a calm lake and appear upside down in the water; the reflection is ringed in orange. */
  'paint.spegling': all(rect(0, 0, 120, 60, '#cfe6f5', 0, null), path('M10 60 L44 18 L64 42 L80 26 L112 60 Z', '#7a9cc0', C.ink, 1.4), path('M40 23 L44 18 L48 23 Z M76 31 L80 26 L84 31 Z', C.white, null), pine(20, 60, 1), pine(100, 60, 0.9),
    rect(0, 60, 120, 60, '#8cc7e8', 0, null), g('translate(0 120) scale(1 -1)', g('opacity="0.6"', path('M10 60 L44 18 L64 42 L80 26 L112 60 Z', '#5f84ad', null), pine(20, 60, 1, '#4f8a6a'), pine(100, 60, 0.9, '#4f8a6a'))),
    line('M20 76 L40 76 M70 86 L96 86 M30 98 L50 98', 'rgba(255,255,255,0.6)', 1.6), line('M0 60 L120 60', C.ink, 1.2), ellipse(60, 84, 54, 24, 'none', HL, 2.6)),
  /** stämningsfull (symbol): a lake at dusk in soft purple and gold, mist on the water, a person on a jetty with a hand on the heart; a small grey dull copy of the scene. */
  'paint.stämningsfull': all(rect(0, 0, 120, 120, '#4a3f6b', 0, null), rect(0, 40, 120, 30, '#c97a8a', 0, null), circle(60, 66, 12, '#f5c26b', null), rect(0, 66, 120, 54, '#3a4a7a', 0, null), path('M30 70 L90 70 L76 100 L44 100 Z', 'rgba(245,194,107,0.35)', null),
    path('M0 64 C20 60 40 66 60 62 C80 58 100 64 120 60 L120 70 L0 70 Z', 'rgba(255,255,255,0.3)', null), pine(10, 66, 1, '#2a3550'), pine(108, 66, 1.1, '#2a3550'),
    rect(62, 96, 50, 4, '#6b4a32', 0, C.ink, 1), g('translate(86 -16)', who(0, { top: '#c7b3e6', s: 0.5, face: 'closed', r: [2, 54], back: false })), waPulse('paint-stam', sparkle(30, 20, 3, '#fbe3a0'), sparkle(96, 14, 2.6, '#fbe3a0'), sparkle(70, 28, 2, '#fbe3a0')),
    g('translate(4 4)', greyed(rect(0, 0, 30, 22, '#ddd', 1, C.ink, 1), rect(0, 12, 30, 10, '#bbb', 0, null)))),
  /** idyllisk: a red cottage with white corners by a lake, a birch, flowers and sun; in the corner a small grey street with traffic for comparison. */
  'paint.idyllisk': all(rect(0, 0, 120, 120, '#d9eef9', 0, null), circle(96, 20, 9, C.yellow, null), path('M0 72 C40 62 80 66 120 70 L120 120 L0 120 Z', '#a7d38c', null), rect(0, 92, 120, 28, '#8cc7e8', 0, null),
    cottage(56, 76, 1.5), birch(90, 82, 1.1), ...([[20, 80], [28, 84], [36, 80], [76, 84], [104, 84]] as [number, number][]).map(([x, y], i) => flower(x, y, [C.pink, C.yellow, C.red, C.white, C.purple][i])), line('M20 104 L40 104 M70 110 L96 110', C.white, 1.6),
    g('translate(4 4)', greyed(rect(0, 0, 32, 24, '#ccc', 1, C.ink, 1), rect(4, 4, 8, 14, '#999', 0, null), rect(16, 2, 10, 16, '#999', 0, null), rect(0, 18, 32, 6, '#777', 0, null)))),

  // ── 4527 Abstrakt måleri ───────────────────────────────────────────
  /** abstrakt (i konst): a big canvas in colour with free shapes, swirls and fields that show nothing recognisable; a small grey canvas with a tree beside it. */
  'paint.abstrakt.2': all(wall(), canvas(8, 14, 70, 86, rect(8, 14, 70, 40, '#f2c14e', 0, null), circle(30, 64, 16, C.red, null), path('M8 100 L40 56 L78 86 L78 100 Z', '#3f6fb5', null), path('M44 24 C64 20 70 40 56 48 C44 54 40 36 52 34', 'none', C.black, 3), rect(56, 60, 16, 22, C.green, 0, null)),
    greyed(canvas(86, 54, 28, 34, line('M100 84 L100 72', C.brown, 3), circle(100, 66, 8, C.green, null))), ground()),
  /** föreställande: a big canvas in colour with a house, a tree, a sun and a person you can recognise; a small grey abstract canvas beside it. */
  'paint.föreställande': all(wall(), canvas(8, 14, 70, 86, rect(8, 14, 70, 56, '#cfe6f5', 0, null), rect(8, 70, 70, 30, '#a7d38c', 0, null), circle(64, 28, 7, C.yellow, null), cottage(32, 76, 1.1), birch(60, 84, 0.9), g('translate(46 52) scale(0.3)', who(0, { top: C.orange }))),
    greyed(canvas(86, 54, 28, 34, circle(96, 66, 6, C.red, null), rect(102, 72, 10, 12, C.navy, 0, null), path('M88 86 L100 74 L112 86 Z', C.yellow, null))), ground()),
  /** kludd: a crumpled sheet with messy scribbles, blots and smears, and a stubby crayon. */
  'paint.kludd': all(path('M10 20 L50 14 L108 22 L104 60 L110 100 L60 106 L12 98 L16 60 Z', PAPER, C.ink, 1.6), line('M26 40 C40 24 30 60 52 36 C70 18 60 70 84 40 C96 26 92 64 70 70 C50 76 34 60 30 84', C.navy, 2.4),
    path('M60 80 C70 72 88 78 84 90 C80 98 64 96 60 80 Z', 'rgba(214,69,69,0.6)', null), line('M40 50 L80 58 M30 70 L56 64 C64 62 70 86 92 84', C.green, 2), path('M22 88 C30 84 40 92 50 88', 'none', 'rgba(242,193,78,0.8)', 6), blob(92, 34, C.brown, 0.8),
    g('translate(96 104) rotate(-30)', rect(-10, -4, 18, 8, C.red, 2, C.ink, 1.2), path('M8 -4 L14 0 L8 4 Z', C.red, C.ink, 1))),
  /** utan titel (symbol): an abstract painting on the wall; the little label under it has only a dash where the title should be, ringed in orange. */
  'paint.utan-titel': all(wall(), canvas(22, 10, 76, 58, rect(22, 10, 76, 58, '#c7b3e6', 0, null), circle(50, 40, 14, '#3f6fb5', null), path('M64 64 L84 22 L96 64 Z', '#ef8a3c', null)),
    rect(40, 80, 40, 24, C.white, 2, C.ink, 1.6), line('M54 88 L66 88', C.ink, 2.6), line('M46 96 L74 96 M46 100 L66 100', C.grey2, 1.6), ring(60, 88, 16)),
  /** pionjär: the first person (orange) cuts a new path through tall grass with a flag; small grey people follow behind on the path. */
  'paint.pionjär': all(rect(0, 0, 120, 120, '#e8f2df', 0, null), path('M0 112 L60 96 L84 92 L84 112 Z', '#d8c39a', null), ...range(14).map((i) => line(`M${80 + i * 3} 112 L${78 + i * 3 + (i % 3)} ${70 + (i % 4) * 4}`, '#6f9d4a', 2)),
    greyed(who(12, { s: 0.45 }), who(30, { s: 0.55 }), who(48, { s: 0.65 })), who(78, { top: HL, s: 0.85, r: [16, 30] }), line('M91.6 37 L91.6 4', C.dark, 2), path('M91.6 4 L108 9 L91.6 14 Z', C.yellow, C.ink, 1.2), ...([[40, 104], [56, 100], [70, 96]] as [number, number][]).map(([x, y]) => ellipse(x, y, 2.4, 1.4, '#b89a6a', null))),
  /** före sin tid: left, in 1906, people look at an abstract painting with blank faces and question marks; an arrow leads right, to 1986, where people smile at the same painting with hearts. */
  'paint.före-sin-tid': all(rect(0, 0, 60, 120, '#e6e2da', 0, null), rect(60, 0, 60, 120, '#f6efe0', 0, null), T(30, 14, '1906', 10, C.ink), T(90, 14, '1986', 10, C.ink),
    canvas(18, 24, 24, 26, circle(26, 33, 5, C.red, null), path('M30 50 L38 30 L42 50 Z', C.navy, null)), greyed(...[14, 30, 46].map((x) => face(x, 76, 7, { mood: 'neutral', top: C.grey }))), ...[14, 30, 46].map((x) => T(x, 100, '?', 11, C.ink)),
    arrow(50, 112, 70, 112, HL, 2.6), canvas(78, 24, 24, 26, circle(86, 33, 5, C.red, null), path('M90 50 L98 30 L102 50 Z', C.navy, null)), ...[[74, C.green], [90, C.purple], [106, C.orange]].map(([x, c]) => face(x as number, 76, 7, { top: c as string })),
    waPulse('paint-fore', ...[74, 90, 106].map((x) => g(`translate(${x} 98) scale(0.55)`, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', C.red, C.ink, 1.4))))),
  /** konstriktning: on a gallery wall, paintings in three groups; each group shares one way of painting (dots, cubes, drips) and has the same coloured band under it. */
  'paint.konstriktning': all(wall(), ...[0, 1, 2].map((k) => all(...[0, 1].map((j) => {
    const x = 6 + k * 38 + (j ? 0 : 0), y = 14 + j * 38;
    const inner = k === 0 ? all(rect(x, y, 30, 28, '#cfe6f5', 0, null), ...range(18).map((i) => circle(x + 4 + (i % 6) * 4.6, y + 5 + Math.floor(i / 6) * 8, 1.8, [C.yellow, C.pink, C.green][i % 3]!, null)))
      : k === 1 ? all(rect(x, y, 30, 28, '#e6d3b3', 0, null), path(`M${x + 4} ${y + 24} L${x + 10} ${y + 6} L${x + 18} ${y + 14} L${x + 26} ${y + 4} L${x + 26} ${y + 24} Z`, '#a0673d', C.ink, 1), line(`M${x + 10} ${y + 6} L${x + 10} ${y + 24} M${x + 18} ${y + 14} L${x + 18} ${y + 24}`, C.ink, 1))
        : all(rect(x, y, 30, 28, C.white, 0, null), line(`M${x + 6} ${y + 2} L${x + 6} ${y + 20} M${x + 14} ${y + 2} L${x + 14} ${y + 26} M${x + 22} ${y + 2} L${x + 22} ${y + 16}`, [C.red, C.navy, C.black][j]!, 2.4));
    return all(rect(x, y, 30, 28, C.white, 1, C.ink, 1.4), inner, rect(x, y, 30, 28, 'none', 1, C.ink, 1.4));
  }), rect(6 + k * 38, 86, 30, 6, [HL, C.green, C.purple][k]!, 2, C.ink, 1.2))), ground()),
  /** provocerande (symbol): an odd painting on the wall makes visitors angry: red faces, exclamation marks and a lightning bolt in a speech bubble. */
  'paint.provocerande': all(wall(), canvas(36, 10, 48, 40, rect(36, 10, 48, 40, '#2e2e36', 0, null), path('M44 44 L60 16 L76 44 Z', '#d64545', null), circle(60, 34, 4, C.yellow, null)),
    who(26, { top: C.navy, s: 0.6, face: 'angry', skin: '#f2a08a', r: [10, 52] }), who(94, { top: C.green, s: 0.6, face: 'angry', skin: '#f2a08a', r: [-10, 52], long: true }),
    waShake('paint-prov', T(10, 66, '!', 14, C.red), T(110, 66, '!', 14, C.red), g('translate(60 70)', path('M-16 -10 L16 -10 L16 8 L4 8 L0 14 L-2 8 L-16 8 Z', C.white, C.ink, 1.4), path('M2 -8 L-5 0 L0 0 L-3 7 L5 -2 L0 -2 Z', C.yellow, C.ink, 1)))),
  /** experimentera: a painter tries new tools on a canvas: a sponge, a fork and sand slide in one after another, each leaving a different texture. */
  'paint.experimentera': all(canvas(8, 14, 76, 60), ...range(12).map((i) => circle(18 + (i % 4) * 4, 24 + Math.floor(i / 4) * 4, 1.4, C.red, null)), line('M44 22 L44 40 M48 22 L48 40 M52 22 L52 40', C.navy, 1.4), ...range(20).map((i) => circle(20 + (i * 7) % 52, 52 + (i * 5) % 16, 0.9, '#a0673d', null)),
    rect(0, 80, 120, 40, WOOD, 0, C.ink, 1), waIn('paint-exp1', -10, -10, rect(12, 88, 18, 12, C.yellow, 3, C.ink, 1.4)), moving('paint-exp2', '0%,30%{transform:translate(0,-10px);opacity:0}70%,100%{transform:translate(0,0);opacity:1}', { dur: 3 }, line('M44 102 L44 88 M40 88 L40 94 M44 88 L44 94 M48 88 L48 94 M40 94 L48 94', C.silver, 2)),
    moving('paint-exp3', '0%,50%{transform:translate(0,-10px);opacity:0}85%,100%{transform:translate(0,0);opacity:1}', { dur: 3 }, jar(58, 86, 14, 18, '#e8c79a', 0.6)), who(100, { top: C.orange, s: 0.8, r: [-20, 30] }), T(96, 12, '?', 12, HL), T(108, 22, '!', 12, HL)),
};

/** Water drop. */
function drop2(x: number, y: number) {
  return path(`M${x} ${y - 6} C${x + 4} ${y} ${x + 4} ${y + 4} ${x} ${y + 4} C${x - 4} ${y + 4} ${x - 4} ${y} ${x} ${y - 6} Z`, '#8cc7e8', C.ink, 1);
}
