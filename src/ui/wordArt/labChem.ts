/**
 * Matematik & naturvetenskap → Kemi → Laboratoriekemi, 3461–3467 (0.51): laboratory glass, measuring
 * instruments, hazard symbols, weighing and measuring, filtration and distillation, titration and lab reports.
 * Recurring signs: glass is pale blue with a dark outline, water is light blue, the part the word names is
 * orange (ring, frame or arrow) and a grey reference shows what the word is not. Hazard symbols are drawn as
 * general GHS-style pictograms (black picture on white in a red diamond); no brands, no protected emblems.
 * Close words share one layout where only the marked part differs: destillera/kylare (the same still, the
 * whole path marked or only the cooled tube), bottensats/dekantera (the same glass with sand, standing still
 * or tipped to pour), filtrat (the filtration set with the clear liquid below marked).
 * Digits and maths signs only; no words.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const GL = 'rgba(206,232,248,0.6)';
const LIQ = '#9fd0ee';
const PINK = '#f29bc4';
const MUD = '#a88a62';
const SAND = '#d9bf8a';
const OIL = '#f3d36b';
const RED = '#d8262b';
const GLOVE = '#5b9bd5';
const BENCH = '#5b6470';
const WOOD = '#c99a5b';
const COAT = '#fbfbf8';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const ring = (x: number, y: number, r: number, col: string = HL, sw = 2.6) => circle(x, y, r, 'none', col, sw);
const frame = (x: number, y: number, w: number, h: number, col: string = HL, sw = 2.6) => rect(x, y, w, h, 'none', 5, col, sw);
const num = (x: number, y: number, s: string, size = 9, col: string = C.ink) => T(x, y, s, size, col);
const cross = (x: number, y: number, r: number, col: string = RED) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 2.6);
const check = (x: number, y: number, s = 1, col: string = C.green) => g(`translate(${x} ${y}) scale(${s})`, path('M-6 0 L-2 4 L6 -5', 'none', col, 2.6));
const drop = (x: number, y: number, s = 1, col: string = LIQ) => path(`M${x} ${y - 5 * s} C${x + 4 * s} ${y} ${x + 3 * s} ${y + 4 * s} ${x} ${y + 4 * s} C${x - 3 * s} ${y + 4 * s} ${x - 4 * s} ${y} ${x} ${y - 5 * s} Z`, col, C.ink, 0.8);
/** Lab bench top at y (legs to the ground). */
const bench = (y = 96, x1 = 4, x2 = 116) => all(rect(x1, y, x2 - x1, 6, BENCH, 1.5, C.ink, 1.6), line(`M${x1 + 6} ${y + 6} L${x1 + 6} 112 M${x2 - 6} ${y + 6} L${x2 - 6} 112`, BENCH, 3));
const ticks = (x: number, y1: number, y2: number, n: number, len = 4) => line(range(n + 1).map((i) => `M${x} ${f1(y1 + ((y2 - y1) * i) / n)} l${i % 2 ? len * 0.6 : len} 0`).join(' '), C.ink, 0.9);

// ── Glassware (bottom centre x, y) ───────────────────────────────────
const tubeD = (x: number, y: number, h: number, w: number) => `M${x - w / 2} ${y - h} L${x - w / 2} ${y - w / 2} A${w / 2} ${w / 2} 0 0 0 ${x + w / 2} ${y - w / 2} L${x + w / 2} ${y - h}`;
/** Test tube. */
const tube = (x: number, y: number, h = 50, w = 10, lvl = 0.4, liq: string = LIQ) => all(path(tubeD(x, y, h, w) + ' Z', GL, null),
  lvl > 0 ? path(tubeD(x, y, h * lvl, w) + ' Z', liq, null) : '', path(tubeD(x, y, h, w), 'none', C.ink, 1.5), line(`M${x - w / 2 - 1.5} ${y - h} L${x + w / 2 + 1.5} ${y - h}`, C.ink, 1.8));
/** Beaker with a spout on the left and graduation marks. */
const beaker = (x: number, y: number, w = 30, h = 36, lvl = 0.5, liq: string = LIQ) => {
  const l = x - w / 2, r = x + w / 2;
  const body = `M${l - 3} ${y - h - 2} L${l} ${y - h + 3} L${l} ${y - 2} Q${l} ${y} ${l + 2} ${y} L${r - 2} ${y} Q${r} ${y} ${r} ${y - 2} L${r} ${y - h}`;
  return all(path(body + ' Z', GL, null), lvl > 0 ? rect(l + 0.6, f1(y - h * lvl), w - 1.2, f1(h * lvl - 0.6), liq, 2, null) : '', path(body, 'none', C.ink, 1.6),
    line(range(3).map((i) => `M${r - 7} ${f1(y - h * (0.3 + i * 0.22))} L${r - 2} ${f1(y - h * (0.3 + i * 0.22))}`).join(' '), C.ink, 1));
};
/** Erlenmeyer flask, 46 px high at s = 1. */
const erlen = (x: number, y: number, s = 1, lvl = 0.3, liq: string = LIQ) => {
  const half = (h: number) => 18 - (13 * (h - 3)) / 29, hl = 46 * lvl;
  const body = 'M-5 -46 L-5 -32 L-18 -3 Q-19 0 -15 0 L15 0 Q19 0 18 -3 L5 -32 L5 -46';
  return g(`translate(${x} ${y}) scale(${s})`, path(body + ' Z', GL, null),
    lvl > 0 ? path(`M${f1(-half(hl))} ${f1(-hl)} L-18 -3 Q-19 0 -15 0 L15 0 Q19 0 18 -3 L${f1(half(hl))} ${f1(-hl)} Z`, liq, null) : '',
    path(body, 'none', C.ink, 1.6 / s), line('M-7 -46 L7 -46', C.ink, 2 / s));
};
/** Round-bottomed flask: bulb radius r, neck length n. */
const roundFlask = (x: number, y: number, r = 17, n = 22, lvl = 0.45, liq: string = LIQ) => {
  const cy = y - r, hgt = 2 * r * lvl, yy = y - hgt, hc = Math.sqrt(Math.max(0, r * r - (r - hgt) ** 2));
  const top = y - 2 * r + 1;
  return all(circle(x, cy, r, GL, null), rect(x - 4, top - n, 8, n + 2, GL, 0, null),
    lvl > 0 ? path(`M${f1(x - hc)} ${f1(yy)} A${r} ${r} 0 ${hgt > r ? 1 : 0} 0 ${f1(x + hc)} ${f1(yy)} Z`, liq, null) : '',
    path(`M${x - 4} ${top - n} L${x - 4} ${f1(top + 0.6)} A${r} ${r} 0 1 0 ${x + 4} ${f1(top + 0.6)} L${x + 4} ${top - n}`, 'none', C.ink, 1.6), line(`M${x - 6} ${top - n} L${x + 6} ${top - n}`, C.ink, 2));
};
/** Volumetric flask with a long neck and one mark. */
const volFlask = (x: number, y: number, full = true, liq: string = LIQ) => {
  const bulb = (top: number) => `M${x - 3.5} ${top} L${x - 3.5} ${y - 36} C${x - 6} ${y - 30} ${x - 19} ${y - 24} ${x - 19} ${y - 11} C${x - 19} ${y - 2} ${x - 14} ${y} ${x - 10} ${y} L${x + 10} ${y} C${x + 14} ${y} ${x + 19} ${y - 2} ${x + 19} ${y - 11} C${x + 19} ${y - 24} ${x + 6} ${y - 30} ${x + 3.5} ${y - 36} L${x + 3.5} ${top}`;
  return all(path(bulb(y - 68) + ' Z', GL, null), full ? path(bulb(y - 54) + ' Z', liq, null) : '', path(bulb(y - 68), 'none', C.ink, 1.6),
    line(`M${x - 5.5} ${y - 68} L${x + 5.5} ${y - 68}`, C.ink, 2), line(`M${x - 4.5} ${y - 54} L${x + 4.5} ${y - 54}`, C.ink, 1.8));
};
/** Graduated cylinder: height h, liquid level 0–1, with a meniscus. */
const cylinder = (x: number, y: number, h = 76, lvl = 0.55, liq: string = LIQ, w = 13) => {
  const top = y - h, ly = y - 5 - (h - 8) * lvl;
  return all(path(`M${x - 13} ${y} L${x + 13} ${y} L${x + 10} ${y - 5} L${x - 10} ${y - 5} Z`, GL, C.ink, 1.4),
    rect(x - w / 2, top, w, h - 5, GL, 1, null),
    path(`M${x - w / 2 + 0.6} ${f1(ly - 2)} Q${x} ${f1(ly + 2)} ${x + w / 2 - 0.6} ${f1(ly - 2)} L${x + w / 2 - 0.6} ${y - 5} L${x - w / 2 + 0.6} ${y - 5} Z`, liq, null),
    path(`M${x - w / 2 - 2} ${top - 1} L${x - w / 2} ${top + 2} L${x - w / 2} ${y - 5} M${x + w / 2} ${y - 5} L${x + w / 2} ${top}`, 'none', C.ink, 1.5),
    ticks(x - w / 2, top + 6, y - 9, 10, 4));
};
/** Burette: tube from top to tap at yTap, liquid from level. */
const burette = (x: number, top: number, yTap: number, lvlY: number, liq: string = LIQ, tap: string = C.dark) => all(
  rect(x - 3.5, top, 7, yTap - top, GL, 1, null), rect(x - 3, lvlY, 6, yTap - lvlY, liq, 0, null), line(`M${x - 3.5} ${top} L${x - 3.5} ${yTap} M${x + 3.5} ${top} L${x + 3.5} ${yTap}`, C.ink, 1.4),
  ticks(x - 3.5, top + 4, yTap - 4, 12, 3), rect(x - 8, yTap, 16, 4, tap, 1.5, C.ink, 1.1), circle(x + 8, yTap + 2, 2.4, tap, C.ink, 1),
  path(`M${x - 2.5} ${yTap + 4} L${x + 2.5} ${yTap + 4} L${x + 0.8} ${yTap + 12} L${x - 0.8} ${yTap + 12} Z`, GL, C.ink, 1.1));
/** Lab stand: base at the ground, rod at x, and a clamp at (x → cx, cy). */
const stand = (x: number, top: number, cx: number, cy: number, col: string = C.dark) => all(rect(x - 16, 106, 40, 6, col, 1.5, C.ink, 1.4), rect(x - 1.8, top, 3.6, 106 - top, C.silver, 1, C.ink, 1.2),
  rect(x - 4, cy - 3, 8, 6, col, 1, C.ink, 1), line(`M${x + 4} ${cy} L${cx - 5} ${cy}`, col, 2.4), path(`M${cx - 6} ${cy - 5} L${cx - 3} ${cy - 5} L${cx - 3} ${cy + 5} L${cx - 6} ${cy + 5} M${cx + 6} ${cy - 5} L${cx + 3} ${cy - 5} L${cx + 3} ${cy + 5} L${cx + 6} ${cy + 5}`, 'none', col, 2));
/** Gas burner with a blue flame; (x, y) = foot. */
const burner = (x: number, y: number, fl = true) => all(rect(x - 11, y - 4, 22, 4, C.dark, 1, C.ink, 1.2), rect(x - 3.5, y - 26, 7, 22, C.silver, 1, C.ink, 1.3), line(`M${x - 11} ${y - 6} L${x - 18} ${y - 6}`, C.dark, 2),
  fl ? g(`translate(${x} ${y - 26})`, path('M0 0 C-6 0 -6 -8 -3.5 -13 C-2 -17 0 -21 0 -24 C1 -21 2 -17 3.5 -13 C6 -8 6 0 0 0 Z', '#9cc4f2', C.ink, 1), path('M0 -1 C-2.5 -1 -2.5 -6 0 -12 C2.5 -6 2.5 -1 0 -1 Z', '#4f8fe0', null)) : '');
/** Droplet pipette: rubber bulb on top, tip at (x, y). */
const pipette = (x: number, y: number, len = 40, rot = 0) => g(`translate(${x} ${y}) rotate(${rot})`, path(`M-2.2 -${len} L-2.2 -8 L-0.7 0 L0.7 0 L2.2 -8 L2.2 -${len} Z`, GL, C.ink, 1.2), rect(-1.6, -14, 3.2, 8, LIQ, 0.5, null),
  path(`M-4 -${len} C-6 -${len + 8} -4 -${len + 15} 0 -${len + 15} C4 -${len + 15} 6 -${len + 8} 4 -${len} Z`, C.red, C.ink, 1.2));
/** Simple worker behind a bench (lower body hidden): head at (x, 42); hands at the given points. */
const worker = (x: number, hands: [number, number][], o: { top?: string; hair?: string; goggles?: boolean; long?: boolean } = {}) => {
  const top = o.top ?? COAT, hair = o.hair ?? C.hair;
  const armD = (sx: number, [hx, hy]: [number, number]) => `M${sx} 60 L${hx} ${hy}`;
  return all(
    o.long ? path(`M${x - 11} 42 C${x - 14} 58 ${x - 6} 58 ${x} 56 C${x + 6} 58 ${x + 14} 58 ${x + 11} 42 Z`, hair, C.ink, 1.4) : '',
    path(`M${x - 15} 98 L${x - 13} 62 C${x - 12} 57 ${x - 6} 55 ${x} 55 C${x + 6} 55 ${x + 12} 57 ${x + 13} 62 L${x + 15} 98 Z`, top, C.ink, 1.8),
    line(`M${x - 3} 56 L${x} 64 L${x + 3} 56`, C.grey, 1.2),
    rect(x - 3, 49, 6, 7, C.skin, 2, C.ink, 1.2), circle(x, 42, 9, C.skin, C.ink, 1.6),
    path(`M${x - 9} 41 C${x - 9} 30 ${x + 9} 30 ${x + 9} 41 C${x + 5} 36 ${x - 5} 36 ${x - 9} 41 Z`, hair, C.ink, 1.4),
    o.goggles ? all(rect(x - 8, 39, 16, 6, 'rgba(200,230,250,0.8)', 3, C.ink, 1.2), line(`M${x} 39 L${x} 45`, C.ink, 0.8)) : all(circle(x - 3, 42, 1.1, C.ink, null), circle(x + 3, 42, 1.1, C.ink, null)),
    line(`M${x - 2.6} 46.5 Q${x} 48.5 ${x + 2.6} 46.5`, C.ink, 1.1),
    ...hands.map((h, i) => all(line(armD(i ? x + 11 : x - 11, h), C.ink, 6.4), line(armD(i ? x + 11 : x - 11, h), top, 4.6), circle(h[0], h[1], 3.2, C.skin, C.ink, 1.2))));
};

// ── Hazard pictograms (centre x, y; half-diagonal r) ─────────────────
const diamond = (x: number, y: number, r: number, inner: Svg) => all(path(`M${x} ${y - r} L${x + r} ${y} L${x} ${y + r} L${x - r} ${y} Z`, C.white, RED, r * 0.14), g(`translate(${x} ${y}) scale(${f1(r / 20)})`, inner));
const K = C.black;
const pFlame = all(path('M0 8 C-8 8 -9 0 -5 -5 C-4 -1 -2 -2 -2 -4 C-2 -9 1 -12 3 -14 C3 -8 9 -4 8 2 C8 6 5 8 0 8 Z', K, null), rect(-9, 9, 18, 2.4, K, 0.5, null));
const pFlameO = all(path('M0 0 C-7 0 -8 -6 -4.5 -10 C-4 -7 -2 -8 -2 -9.5 C-2 -13 1 -15 2.6 -17 C2.6 -12 8 -9 7 -4 C7 -1 4.5 0 0 0 Z', K, null), circle(0, 5.5, 5.5, 'none', K, 2.6), rect(-9, 12, 18, 2.4, K, 0.5, null));
const pBomb = all(path(range(14).map((i) => { const a = (i * Math.PI) / 7, r = i % 2 ? 5 : 11; return `${i ? 'L' : 'M'}${f1(2 + Math.cos(a) * r)} ${f1(-2 + Math.sin(a) * r)}`; }).join(' ') + ' Z', K, null),
  circle(-6, 6, 5, K, null), rect(-14, -10, 3, 3, K, 0.5, null), rect(9, 8, 3, 3, K, 0.5, null), rect(10, -12, 2.4, 2.4, K, 0.5, null), rect(-12, 10, 2.4, 2.4, K, 0.5, null));
const pGas = all(rect(-12, -4, 22, 9, K, 4.5, null), rect(10, -2, 3, 5, K, 0.5, null), rect(-12, 7, 22, 2, K, 0.5, null));
const pSkull = all(path('M-7 -2 C-8 -11 8 -11 7 -2 C7 2 4 3 4 5 L-4 5 C-4 3 -7 2 -7 -2 Z', K, null), circle(-3, -3, 1.8, C.white, null), circle(3, -3, 1.8, C.white, null), line('M-10 6 L10 12 M10 6 L-10 12', K, 2.4));
const pBang = all(path('M-2 -11 L2 -11 L1.2 4 L-1.2 4 Z', K, null), circle(0, 8.5, 2, K, null));

/** Blue protective glove seen from the side, fingers pointing to the beaker; flip = right hand. */
const glove = (x: number, y: number, flip: boolean) => g(`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`, rect(-22, -8, 14, 26, GLOVE, 4, C.ink, 1.4),
  rect(-10, -12, 14, 22, GLOVE, 5, C.ink, 1.4), ...range(4).map((i) => rect(2, -11 + i * 5.4, 12, 4.8, GLOVE, 2.4, C.ink, 1.1)), rect(-6, 8, 14, 5, GLOVE, 2.5, C.ink, 1.1));

// ── Shared layouts ───────────────────────────────────────────────────
/** Still: flask on burner → slanted cooler → receiving flask. mark: 'all' (destillera) or 'cool' (kylare). */
const still = (mark: 'all' | 'cool') => {
  const flask = all(roundFlask(24, 76, 13, 10, 0.5), burner(24, 110, true));
  const coolerJacket = all(path('M38 44 L90 74 L86 81 L34 51 Z', mark === 'cool' ? '#bfe2fb' : GL, C.ink, 1.4), line('M30 46 L94 82', C.ink, 1.2));
  const pipe = all(line('M24 52 L24 42 L33 47', C.ink, 1.4));
  const recv = all(erlen(100, 110, 0.6, 0.22), drop(96, 90, 0.8));
  const water = all(arrow(92, 92, 82, 82, '#3f8fd2', 2.2), arrow(42, 44, 50, 34, '#3f8fd2', 2.2));
  const vapour = line('M24 50 L24 40 L34 46 L92 80', HL, 2.4, '3 3');
  return all(ground(), mark === 'cool' ? greyed(flask, pipe, recv) : all(flask, pipe, recv), coolerJacket, water,
    mark === 'all' ? all(vapour, ellipse(24, 64, 5, 2, 'none', HL, 1.2), arrow(100, 72, 100, 84, HL, 2)) : g('rotate(30 64 63)', rect(30, 52, 68, 22, 'none', 6, HL, 2.6)));
};
/** Glass with water and sand at the bottom; tipped = being poured into a second glass (dekantera). */
const sandGlass = (tipped: boolean) => {
  const gl = (x: number, y: number, sand: boolean, lvl: number) => all(rect(x - 14, y - 40, 28, 40, GL, 2, null), rect(x - 13.4, f1(y - 40 * lvl), 26.8, f1(40 * lvl - 0.6), LIQ, 2, null),
    sand ? path(`M${x - 13.4} ${y - 0.6} L${x - 13.4} ${y - 7} C${x - 6} ${y - 9} ${x + 4} ${y - 6} ${x + 13.4} ${y - 8} L${x + 13.4} ${y - 0.6} Z`, SAND, C.ink, 0.9) : '',
    sand ? all(...range(8).map((i) => circle(f1(x - 10 + i * 2.8), f1(y - 3 - (i % 3)), 0.8, '#8a6a3a', null))) : '',
    path(`M${x - 14} ${y - 40} L${x - 14} ${y} L${x + 14} ${y} L${x + 14} ${y - 40}`, 'none', C.ink, 1.6));
  return tipped
    ? all(ground(), g('translate(34 82) rotate(50)', gl(0, 0, true, 0.45)), line('M6 104 L30 86', C.ink, 6.4), line('M6 104 L30 86', C.skin, 4.6), circle(31, 85, 3.4, C.skin, C.ink, 1.2),
      path('M74 65 C80 64 84 68 86 80', 'none', LIQ, 3.4), gl(92, 110, false, 0.3), arrow(62, 36, 82, 52, HL, 2.6))
    : all(ground(), bench(96), gl(60, 96, true, 0.75), ring(60, 90, 17));
};
/** Filtration set: stand, funnel with folded paper and muddy water, flask below. */
const filterSet = (markFiltrate: boolean) => {
  const funnelPart = all(path('M38 22 L82 22 L64 52 L56 52 Z', GL, C.ink, 1.5), path('M42 24 L78 24 L60 50 Z', C.white, C.grey, 1), path('M47 30 L73 30 L60 48 Z', MUD, null), rect(57.5, 52, 5, 16, GL, 1, C.ink, 1.2));
  const flask = erlen(60, 110, 0.9, 0.36, '#cfeafc');
  return all(ground(), stand(20, 14, 60, 56), markFiltrate ? greyed(funnelPart) : funnelPart, flask, drop(60, 74, 0.8, '#cfeafc'),
    markFiltrate ? ring(60, 102, 18) : '');
};

// ── Motifs ───────────────────────────────────────────────────────────
export const LABCHEM_MOTIFS: Record<string, Svg> = {
  // ── 3461 Laboratorieglas ─────────────────────────────────────────
  /** laboratorium: a room with a bench full of glassware, shelves with bottles, a sink and a worker in a white coat. */
  'labk.laboratorium': all(rect(4, 8, 112, 88, '#eef3f6', 2, null), rect(70, 14, 42, 4, C.brown, 1, C.ink, 1), rect(70, 34, 42, 4, C.brown, 1, C.ink, 1),
    ...range(4).map((i) => rect(73 + i * 10, 5, 6, 9, ['#e8b04a', '#7fb8e0', '#9dd39b', '#e58b8b'][i]!, 1.5, C.ink, 1)),
    ...range(3).map((i) => rect(75 + i * 12, 24, 7, 10, ['#c7b3e6', '#f3d36b', '#9fd0ee'][i]!, 1.5, C.ink, 1)),
    worker(36, [[26, 90], [50, 84]], { goggles: true }), bench(96), tube(52, 94, 22, 6, 0.5, '#9dd39b'), erlen(84, 96, 0.55, 0.4, PINK), beaker(104, 96, 16, 18, 0.5), rect(10, 90, 12, 6, C.silver, 1, C.ink, 1), line('M16 90 L16 82 L20 82', C.silver, 2.4)),
  /** provrör: one big test tube with blue liquid, held upright and ringed. */
  'labk.provrör': all(ground(), tube(60, 102, 82, 20, 0.4, '#7fb8e0'), ellipse(55, 50, 2, 14, 'rgba(255,255,255,0.7)', null), ring(60, 62, 46)),
  /** provrörsställ: a wooden rack with four tubes; the rack itself is framed. */
  'labk.provrörsställ': all(ground(), greyed(tube(30, 100, 60, 11, 0.4, '#e58b8b'), tube(50, 100, 60, 11, 0.5, '#7fb8e0'), tube(70, 100, 60, 11, 0.3, '#9dd39b'), tube(90, 100, 60, 11, 0.45, '#f3d36b')),
    rect(14, 70, 92, 8, WOOD, 1.5, C.ink, 1.5), ...range(4).map((i) => ellipse(30 + i * 20, 74, 6, 2, '#8a6a3a', null)), rect(14, 100, 92, 8, WOOD, 1.5, C.ink, 1.5), rect(14, 70, 6, 38, WOOD, 1, C.ink, 1.3), rect(100, 70, 6, 38, WOOD, 1, C.ink, 1.3),
    frame(10, 66, 100, 46)),
  /** provrörshållare: a wooden clip holds a test tube over a flame; a hand holds the clip's handle. */
  'labk.provrörshållare': all(ground(), burner(36, 112), g('rotate(35 38 68)', tube(38, 68, 48, 11, 0.3, '#7fb8e0')),
    rect(52, 40, 40, 6, WOOD, 2, C.ink, 1.4), rect(52, 47, 40, 4, WOOD, 2, C.ink, 1.2), rect(68, 42, 6, 8, C.silver, 1, C.ink, 1), rect(90, 39, 16, 12, WOOD, 3, C.ink, 1.4),
    line('M118 72 L108 48', C.ink, 6.4), line('M118 72 L108 48', C.skin, 4.6), circle(106, 45, 5, C.skin, C.ink, 1.3), ring(68, 45, 16)),
  /** bägare (lab): a beaker with a spout and graduation marks, half full, glass rod outside. */
  'labk.bägare.2': all(ground(), beaker(60, 106, 52, 64, 0.5, '#9fd0ee'), ellipse(42, 60, 2.4, 14, 'rgba(255,255,255,0.7)', null)),
  /** erlenmeyerkolv: a conical flask, wide at the bottom and narrow at the top, with pink liquid. */
  'labk.erlenmeyerkolv': all(ground(), erlen(60, 108, 2, 0.32, PINK), ellipse(46, 74, 2, 10, 'rgba(255,255,255,0.7)', null)),
  /** rundkolv: a round-bottomed flask with a long neck held in a clamp, on a cork ring. */
  'labk.rundkolv': all(ground(), ellipse(60, 108, 18, 4, WOOD, C.ink, 1.4), roundFlask(60, 106, 28, 30, 0.42, '#9dd39b'), stand(16, 10, 60, 30, C.grey), ellipse(48, 72, 2.4, 10, 'rgba(255,255,255,0.7)', null)),
  /** mätkolv: a volumetric flask filled exactly to the one mark on the long neck; the mark is ringed. */
  'labk.mätkolv': all(ground(), g('translate(60 108) scale(1.45) translate(-60 -108)', volFlask(60, 108, true, '#9fd0ee')), ring(60, 30, 11)),
  /** glasstav: a glass rod stirring sugar into water in a beaker; the rod is orange-outlined, a stir arrow. */
  'labk.glasstav': all(ground(), beaker(60, 108, 48, 52, 0.6), ...range(6).map((i) => circle(48 + i * 5, 102 - (i % 2) * 3, 1.4, C.white, C.grey, 0.6)),
    g('rotate(18 60 60)', rect(57.5, 14, 5, 88, 'rgba(230,245,255,0.9)', 2.5, HL, 2)), path('M42 84 C46 92 74 92 78 84', 'none', C.ink, 1.6), path('M78 84 l-1 -6 M78 84 l-6 1', 'none', C.ink, 1.6)),
  /** spatel (lab): a small metal spatula takes white powder from an open jar. */
  'labk.spatel.2': all(ground(), rect(14, 72, 36, 40, '#f0e8d8', 4, C.ink, 1.6), rect(12, 66, 40, 8, C.dark, 2, C.ink, 1.4), ellipse(32, 70, 16, 3, C.white, null),
    g('rotate(-28 70 54)', rect(30, 52, 76, 4, C.silver, 2, HL, 1.8), ellipse(32, 54, 9, 5, C.silver, HL, 1.8), ellipse(32, 52, 6, 3, C.white, null)), ...range(4).map((i) => circle(38 + i * 5, 88 + (i % 2) * 6, 1, C.white, C.grey, 0.5))),
  /** urglas: a small shallow round glass dish (side and top view) with a few salt crystals. */
  'labk.urglas': all(ground(), path('M18 92 Q60 112 102 92', 'none', C.ink, 2), path('M18 92 Q60 112 102 92 Q60 102 18 92 Z', GL, null), ...range(3).map((i) => rect(52 + i * 7, 96 - (i % 2), 4, 4, C.white, 0.5, C.grey, 0.8)),
    ellipse(60, 44, 34, 28, GL, C.ink, 1.8), ellipse(60, 44, 24, 19, 'none', C.grey2, 1), ...range(5).map((i) => rect(50 + (i * 9) % 22, 38 + (i * 7) % 14, 4, 4, C.white, 0.5, C.grey, 0.8)), line('M60 76 L60 86', C.grey, 1.2, '2 2')),
  /** petriskål: a low round dish with its lid lifted, small spots of mould and bacteria growing inside. */
  'labk.petriskål': all(ground(), ellipse(60, 92, 44, 14, '#f6f0c8', C.ink, 1.8), ellipse(60, 88, 44, 14, 'rgba(240,236,200,0.8)', C.ink, 1.6),
    ...[[44, 86, 4, '#e8d36a'], [62, 92, 5, '#d9a4c7'], [74, 84, 3.5, '#9dd39b'], [52, 94, 3, C.white], [70, 94, 2.5, '#e8d36a']].map(([x, y, r, c]) => ellipse(x as number, y as number, r as number, (r as number) * 0.55, c as string, C.ink, 0.7)),
    g('rotate(-14 60 46)', ellipse(60, 46, 46, 14, 'rgba(214,236,250,0.5)', C.ink, 1.6), path('M14 46 L14 50 Q60 66 106 50 L106 46', 'none', C.ink, 1.2)), arrow(60, 66, 60, 74, C.grey, 1.6)),
  /** pipett: a dropper pipette lets one drop fall into a test tube. */
  'labk.pipett': all(ground(), tube(60, 110, 40, 14, 0.3, '#9fd0ee'), pipette(60, 52, 32, 0), drop(60, 60, 1), ring(60, 32, 24)),
  /** gummipropp: a red-brown tapered rubber stopper, and a test tube closed with one. */
  'labk.gummipropp': all(ground(), path('M24 50 L56 50 L50 80 L30 80 Z', '#b8573a', C.ink, 1.8), ellipse(40, 50, 16, 4, '#cf6a4a', C.ink, 1.4), ring(40, 64, 26),
    tube(88, 108, 50, 14, 0.4, '#9fd0ee'), path('M80 58 L96 58 L94 48 L82 48 Z', '#b8573a', C.ink, 1.4), arrow(66, 64, 78, 60, C.grey, 2)),
  /** spolflaska: a soft plastic wash bottle is squeezed by a hand and sends a thin jet of water out of its bent tube. */
  'labk.spolflaska': all(ground(), path('M34 108 L34 60 C34 52 42 50 46 50 L58 50 C62 50 70 52 70 60 L70 108 Z', '#f4f6f8', C.ink, 1.8), rect(34, 72, 36, 36, 'rgba(159,208,238,0.6)', 0, null),
    rect(44, 42, 16, 9, C.white, 2, C.ink, 1.4), path('M52 42 L52 22 L82 14', 'none', C.ink, 2.8), path('M52 42 L52 22 L82 14', 'none', C.white, 1.4),
    path('M84 14 C96 12 104 20 110 34', 'none', '#5aa9e0', 2), drop(110, 40, 0.9), circle(30, 80, 6, C.skin, C.ink, 1.3), circle(74, 80, 6, C.skin, C.ink, 1.3), line('M22 72 l-6 -4 M22 88 l-6 4 M82 72 l6 -4 M82 88 l6 4', HL, 1.6)),
  // ── 3462 Mätinstrument ───────────────────────────────────────────
  /** mätinstrument: a scale, a thermometer, a ruler, a stopwatch and a graduated cylinder together in one frame. */
  'labk.mätinstrument': all(ground(), bench(92), rect(10, 78, 34, 14, C.silver, 3, C.ink, 1.4), rect(16, 74, 22, 4, C.dark, 1, null), rect(18, 82, 18, 6, '#cfe8d0', 1, C.ink, 0.8), num(27, 87.5, '120', 5.5),
    cylinder(56, 92, 60, 0.5), rect(68, 84, 44, 8, '#f2d16b', 1, C.ink, 1.2), line(range(9).map((i) => `M${72 + i * 5} 84 l0 ${i % 2 ? 2.5 : 4}`).join(' '), C.ink, 0.8),
    circle(96, 58, 12, C.white, C.ink, 1.6), rect(93, 42, 6, 4, C.dark, 1, null), line('M96 58 L96 50 M96 58 L102 60', C.ink, 1.4),
    rect(76, 22, 6, 50, C.white, 3, C.ink, 1.2), rect(77.6, 40, 2.8, 30, RED, 1, null), circle(79, 74, 4.4, RED, C.ink, 1.2), frame(6, 16, 108, 80)),
  /** analysvåg: a precision balance inside a glass box; the display shows 0.0153 and a tiny pinch of powder on the pan. */
  'labk.analysvåg': all(ground(), rect(12, 92, 96, 18, C.silver, 3, C.ink, 1.6), rect(20, 96, 44, 10, '#cfe8d0', 2, C.ink, 1), num(42, 104, '0.0153', 8), circle(76, 101, 3, C.dark, null), circle(88, 101, 3, C.dark, null),
    rect(16, 30, 88, 62, 'rgba(206,232,248,0.35)', 2, C.ink, 1.6), line('M60 30 L60 92', C.ink, 1), rect(56, 54, 3, 10, C.dark, 1, null), rect(61, 54, 3, 10, C.dark, 1, null),
    ellipse(60, 86, 20, 4, C.silver, C.ink, 1.4), rect(58, 86, 4, 6, C.dark, 0, null), ellipse(60, 84, 3, 1.2, C.white, C.grey, 0.6), ring(42, 101, 26)),
  /** skjutmått: a metal vernier caliper with jaws closed around a screw. */
  'labk.skjutmått': all(ground(), rect(6, 44, 108, 12, C.silver, 1, C.ink, 1.6), line(range(20).map((i) => `M${12 + i * 5} 44 l0 ${i % 2 ? 3 : 6}`).join(' '), C.ink, 0.8),
    path('M10 56 L10 96 L22 96 L22 70 L18 56 Z', C.silver, C.ink, 1.6), path('M48 40 L72 40 L72 60 L60 60 L60 96 L48 96 Z', C.silver, C.ink, 1.6), rect(50, 46, 20, 8, C.white, 1, C.ink, 0.8),
    rect(22, 72, 26, 16, '#b0b8c2', 1, C.ink, 1.4), line(range(6).map((i) => `M${25 + i * 4} 72 l-2 16`).join(' '), C.ink, 0.8), rect(18, 70, 4, 20, '#8f98a3', 0.5, C.ink, 1), ring(35, 80, 18)),
  /** mätcylinder: a tall graduated cylinder with blue water and scale marks. */
  'labk.mätcylinder': all(ground(), cylinder(60, 110, 98, 0.55, LIQ, 22), ellipse(53, 50, 1.6, 18, 'rgba(255,255,255,0.7)', null)),
  /** visare (mätinstrument): a round dial gauge; the needle is orange and ringed, a grey digital display beside it as reference. */
  'labk.visare.2': all(ground(), circle(50, 62, 34, C.white, C.ink, 2), line(range(9).map((i) => { const a = Math.PI * (1.1 - i * 0.15); return `M${f1(50 + Math.cos(a) * 30)} ${f1(62 - Math.sin(a) * 30)} L${f1(50 + Math.cos(a) * 24)} ${f1(62 - Math.sin(a) * 24)}`; }).join(' '), C.ink, 1.4),
    line('M50 62 L72 40', HL, 3.4), circle(50, 62, 3.6, C.ink, null), ring(62, 50, 18),
    greyed(rect(88, 92, 26, 16, C.dark, 2, C.ink, 1.2), rect(91, 95, 20, 10, '#cfe8d0', 1, null), num(101, 103, '3.2', 7))),
  // ── 3463 Säkerhetssymboler ───────────────────────────────────────
  /** farosymbol: a cleaning bottle with a red diamond on its label, and three different red-bordered diamonds framed together. */
  'labk.farosymbol': all(ground(), path('M14 112 L14 80 C14 74 20 72 24 70 L24 62 L34 62 L34 70 C38 72 44 74 44 80 L44 112 Z', '#e8f0f6', C.ink, 1.6), rect(18, 84, 22, 20, C.white, 1, C.ink, 1), diamond(29, 94, 7, pFlame),
    diamond(70, 30, 18, pFlame), diamond(96, 58, 18, pSkull), diamond(70, 86, 18, pBang), frame(50, 8, 68, 98)),
  /** explosiv: the red-diamond pictogram with a bursting bomb. */
  'labk.explosiv': all(ground(), diamond(60, 58, 50, pBomb)),
  /** oxiderande: the red-diamond pictogram with a flame above a ring. */
  'labk.oxiderande': all(ground(), diamond(60, 58, 50, pFlameO)),
  /** gas under tryck: the red-diamond pictogram with a gas cylinder lying down. */
  'labk.gas-under-tryck': all(ground(), diamond(60, 58, 50, pGas)),
  /** skyddshandske: two hands in blue protective gloves hold a beaker with a hazard diamond; the gloves are ringed. */
  'labk.skyddshandske': all(ground(), beaker(60, 100, 30, 40, 0.5, '#d8e88a'), diamond(60, 80, 7, pBang), glove(30, 78, false), glove(90, 78, true), ring(26, 80, 22), ring(94, 80, 22)),
  /** labbrock: a long white lab coat with buttons and pockets on a hanger. */
  'labk.labbrock': all(ground(), path('M60 8 C64 8 64 14 60 15', 'none', C.ink, 1.8), path('M60 15 L30 26 L90 26 Z', 'none', C.ink, 2),
    path('M40 26 L24 34 L14 80 L24 82 L30 52 L30 108 L90 108 L90 52 L96 82 L106 80 L96 34 L80 26 L60 40 Z', COAT, C.ink, 1.8), path('M40 26 L50 46 L60 40 L70 46 L80 26', 'none', C.ink, 1.4),
    line('M60 40 L60 108', C.ink, 1.2), ...range(4).map((i) => circle(64, 52 + i * 14, 1.8, C.white, C.ink, 1)), rect(36, 72, 16, 12, 'none', 1, C.ink, 1.2), rect(68, 72, 16, 12, 'none', 1, C.ink, 1.2), rect(70, 50, 10, 4, 'none', 1, C.ink, 1), line('M74 48 L74 54', '#3f6fb5', 2)),
  /** dragskåp: a fume cupboard with a half-open glass front; gas from a flask inside is sucked up and out through a pipe by a fan. */
  'labk.dragskåp': all(ground(), rect(12, 28, 96, 84, '#e6e9ec', 2, C.ink, 1.8), rect(18, 34, 84, 50, '#f5f7f8', 1, C.ink, 1.2), rect(18, 34, 84, 30, 'rgba(206,232,248,0.7)', 1, C.ink, 1.4), rect(18, 84, 84, 4, BENCH, 1, null),
    erlen(60, 84, 0.5, 0.4, '#d8e88a'), path('M60 60 C54 54 66 50 60 44 C55 40 64 38 60 34', 'none', '#9cbf3a', 1.8), rect(52, 12, 16, 16, C.silver, 1, C.ink, 1.4), circle(60, 20, 5, 'none', C.ink, 1), line('M56 20 L64 20 M60 16 L60 24', C.ink, 1),
    arrow(60, 32, 60, 4, HL, 2.6), arrow(40, 58, 52, 40, HL, 2), arrow(80, 58, 68, 40, HL, 2)),
  /** ögondusch: water from an eye-wash fountain sprays up into a person's eyes; a green sign with an eye and water above. */
  'labk.ögondusch': all(ground(), rect(52, 76, 8, 36, C.silver, 1, C.ink, 1.4), path('M34 76 L78 76 L72 84 L40 84 Z', '#7ccf7c', C.ink, 1.6), rect(46, 70, 4, 6, C.dark, 1, null), rect(62, 70, 4, 6, C.dark, 1, null),
    circle(56, 40, 14, C.skin, C.ink, 1.6), path('M42 38 C42 22 70 22 70 38 C64 30 48 30 42 38 Z', C.hair, C.ink, 1.4), ellipse(50, 44, 2.6, 2, C.white, C.ink, 1), ellipse(62, 44, 2.6, 2, C.white, C.ink, 1),
    path('M48 70 C48 60 49 52 50 47', 'none', '#3f8fd2', 2.2), path('M64 70 C64 60 63 52 62 47', 'none', '#3f8fd2', 2.2), drop(44, 50, 0.6, '#8cc7e8'), drop(68, 50, 0.6, '#8cc7e8'), ring(56, 46, 13),
    rect(88, 10, 24, 24, '#2e9d4f', 2, C.ink, 1.2), ellipse(100, 18, 7, 4, C.white, null), circle(100, 18, 2, '#2e9d4f', null), line('M96 26 l0 4 M100 25 l0 5 M104 26 l0 4', C.white, 1.4)),
  // ── 3464 Väga och mäta ───────────────────────────────────────────
  /** mäta: a parent measures how tall a child is against a wall with a measuring tape. */
  'labk.mäta.1': all(ground(), rect(84, 8, 6, 104, '#f2d16b', 1, C.ink, 1.2), line(range(20).map((i) => `M84 ${10 + i * 5} l${i % 2 ? 2.5 : 4} 0`).join(' '), C.ink, 0.8),
    g('translate(54 112) scale(0.62) translate(-60 -112)', worker(60, [[48, 92], [72, 92]], { top: C.green })), rect(50, 60, 36, 3, C.brown, 1, C.ink, 1),
    worker(26, [[50, 62], [14, 94]], { top: C.orange, long: true }), arrow(96, 61, 104, 61, HL, 2), ring(87, 61, 9)),
  /** tarera: a bowl on a scale shows 52.3 (grey) → a palm presses the button and the display shows 0.0 (orange ring). */
  'labk.tarera': all(ground(), greyed(rect(4, 92, 46, 16, C.silver, 3, C.ink, 1.4), rect(10, 96, 26, 8, '#cfe8d0', 1, C.ink, 0.8), num(23, 102.5, '52.3', 6.5), beaker(27, 90, 26, 26, 0)),
    arrow(52, 78, 64, 78, C.grey, 2.4),
    rect(66, 92, 50, 16, C.silver, 3, C.ink, 1.4), rect(70, 96, 26, 8, '#cfe8d0', 1, C.ink, 0.8), num(83, 102.5, '0.0', 7), circle(106, 100, 3.6, HL, C.ink, 1.2), beaker(84, 90, 26, 26, 0),
    path('M100 84 C100 78 112 78 112 84 L112 92 L100 92 Z', C.skin, C.ink, 1.3), ring(83, 100, 14)),
  /** läsa av (mätare): a person looks at an electricity meter on the wall (dashed line of sight) and writes the number in a notebook. */
  'labk.läsa-av.2': all(ground(), rect(72, 16, 40, 44, '#e6e9ec', 3, C.ink, 1.6), rect(78, 24, 28, 10, C.white, 1, C.ink, 1.2), num(92, 32, '04718', 7.5), circle(92, 46, 6, C.white, C.ink, 1), line('M88 46 L96 46', C.ink, 1),
    worker(34, [[44, 82], [30, 88]], { top: C.navy }), rect(28, 80, 22, 14, C.white, 1, C.ink, 1.2), line('M31 85 L46 85 M31 89 L42 89', C.grey, 1), line('M38 40 L76 30', HL, 1.6, '3 3'), ring(92, 29, 12)),
  /** menisk (vätskeyta): a magnifier over a cylinder shows the curved water surface; its lowest point is on a dashed line. */
  'labk.menisk.2': all(ground(), cylinder(26, 110, 90, 0.5, LIQ, 14), circle(26, 62, 10, 'none', C.grey, 1.4), line('M34 56 L58 40', C.grey, 1.4),
    circle(84, 50, 30, C.white, C.ink, 2), path('M58 46 Q84 66 110 46 L110 66 Q84 82 58 66 Z', LIQ, null), path('M58 46 Q84 66 110 46', 'none', '#2e6ea8', 2.4), line('M60 56 L108 56', HL, 1.8, '3 3'), line('M58 30 L58 72 M110 30 L110 72', C.ink, 1.4), ring(84, 56, 8)),
  /** ögonhöjd: three eyes look at a cylinder; the one at the level of the water surface is orange with a check, the higher and lower ones grey and crossed. */
  'labk.ögonhöjd': all(ground(), bench(96), cylinder(84, 96, 80, 0.5, LIQ, 16),
    greyed(ellipse(18, 30, 8, 5, C.white, C.ink, 1.4), circle(18, 30, 2.6, C.ink, null), line('M28 32 L74 52', C.grey, 1.2, '3 3')), cross(36, 22, 4),
    ellipse(18, 56, 8, 5, C.white, HL, 2), circle(18, 56, 2.6, C.ink, null), line('M28 56 L74 56', HL, 1.8, '3 3'), check(40, 46, 1),
    greyed(ellipse(18, 84, 8, 5, C.white, C.ink, 1.4), circle(18, 84, 2.6, C.ink, null), line('M28 82 L74 60', C.grey, 1.2, '3 3')), cross(36, 90, 4)),
  /** mätfel: a ruler measures a pencil, but the pencil starts at 1 instead of 0; the reading 8 is crossed out in red. */
  'labk.mätfel': all(ground(), rect(6, 64, 108, 18, '#f2d16b', 1, C.ink, 1.4), line(range(11).map((i) => `M${12 + i * 10} 82 l0 -7`).join(' '), C.ink, 1), ...range(10).map((i) => num(12 + i * 10, 74, String(i), 6)),
    path('M22 48 L84 48 L94 54 L84 60 L22 60 Z', '#f2a93b', C.ink, 1.4), rect(16, 48, 6, 12, C.pink, 1, C.ink, 1.2), path('M90 52 L94 54 L90 56 Z', C.ink, null),
    line('M12 40 L12 64', C.green, 1.6, '2 2'), line('M22 40 L22 64', RED, 1.6, '2 2'), ring(20, 66, 8), rect(86, 92, 26, 16, C.white, 3, C.ink, 1.2), num(99, 104, '8', 10), cross(99, 100, 9)),
  // ── 3465 Filtrering och destillation ─────────────────────────────
  /** separera (blandning): a glass with mixed red and blue grains → arrows split them into two glasses, only red and only blue. */
  'labk.separera.2': all(ground(), beaker(24, 70, 30, 34, 0), ...range(14).map((i) => circle(f1(14 + (i * 7) % 20), f1(64 - Math.floor(i / 5) * 5 - (i % 2) * 2), 2, i % 2 ? '#e05252' : '#4a7fd0', C.ink, 0.5)),
    arrow(44, 56, 70, 36, HL, 2.6), arrow(44, 62, 70, 86, HL, 2.6),
    beaker(92, 46, 26, 28, 0), ...range(6).map((i) => circle(f1(84 + (i * 6) % 16), f1(42 - Math.floor(i / 3) * 4), 2, '#e05252', C.ink, 0.5)),
    beaker(92, 108, 26, 28, 0), ...range(6).map((i) => circle(f1(84 + (i * 6) % 16), f1(104 - Math.floor(i / 3) * 4), 2, '#4a7fd0', C.ink, 0.5))),
  /** tratt: juice is poured from a jug through a funnel into a bottle; the funnel is ringed. */
  'labk.tratt': all(ground(), path('M44 112 L44 70 C44 62 52 58 54 50 L66 50 C68 58 76 62 76 70 L76 112 Z', '#e8f0f6', C.ink, 1.6), rect(46, 80, 28, 30, '#f5a843', 0, null),
    path('M40 22 L80 22 L64 44 L64 56 L56 56 L56 44 Z', '#7fb8e0', C.ink, 1.8), path('M20 4 L44 4 L42 20 L36 26 C30 24 22 18 20 4 Z', '#f5c6a0', C.ink, 1.4), path('M40 18 C46 20 52 24 56 30', 'none', '#f5a843', 3), ring(60, 36, 24)),
  /** filterpapper: a round paper is folded in half, in half again and opened into a cone (steps with arrows). */
  'labk.filterpapper': all(ground(), circle(20, 40, 14, C.white, C.ink, 1.4), arrow(36, 40, 46, 40, C.grey, 2), path('M50 40 A14 14 0 0 1 78 40 Z', C.white, C.ink, 1.4), arrow(82, 40, 92, 40, C.grey, 2), path('M96 40 L110 40 A14 14 0 0 0 96 26 Z', C.white, C.ink, 1.4),
    arrow(100, 56, 86, 66, C.grey, 2), path('M40 70 L80 70 L60 106 Z', C.white, C.ink, 1.8), line('M60 70 L60 106 M50 70 L60 106', C.grey2, 1), ellipse(60, 70, 20, 4, C.white, C.ink, 1.4), ring(60, 84, 26)),
  /** filtrat: the filtration set – the clear liquid that has run through into the flask is ringed; the funnel with mud is greyed. */
  'labk.filtrat': filterSet(true),
  /** bottensats: a glass of water stands still; the sand at the bottom is ringed. */
  'labk.bottensats': sandGlass(false),
  /** dekantera: the same glass is tipped and the clear water is poured into a second glass; the sand stays in the first. */
  'labk.dekantera': sandGlass(true),
  /** skiljetratt: a pear-shaped glass funnel with a tap on a stand; yellow oil floats on blue water, the water runs out into a beaker. */
  'labk.skiljetratt': all(ground(), stand(18, 8, 64, 30), path('M60 14 L68 14 L68 22 C86 30 90 52 70 70 L68 72 L60 72 L58 70 C38 52 42 30 60 22 Z', GL, C.ink, 1.6),
    path('M46 38 C50 30 78 30 82 38 L84 46 L44 46 Z', OIL, null), path('M44 46 L84 46 C84 56 78 64 70 70 L58 70 C50 64 44 56 44 46 Z', '#7fb8e0', null), line('M44 46 L84 46', C.ink, 1),
    rect(60, 72, 8, 6, GL, 1, C.ink, 1.2), rect(56, 78, 16, 4, C.dark, 1, C.ink, 1), rect(62, 82, 4, 6, GL, 1, C.ink, 1), drop(64, 92, 0.8, '#7fb8e0'), beaker(64, 112, 26, 16, 0.4, '#7fb8e0'), ring(64, 52, 30)),
  /** centrifug: a machine with its lid open; tubes in the rotor spin (arrows); one tube beside it with dark matter at the bottom. */
  'labk.centrifug': all(ground(), rect(8, 70, 76, 40, '#e6e9ec', 6, C.ink, 1.8), path('M8 70 L18 36 L74 36 L84 70', '#d0d5da', C.ink, 1.6), ellipse(46, 70, 30, 8, '#9aa3ad', C.ink, 1.4), circle(46, 70, 4, C.dark, null),
    ...range(6).map((i) => { const a = (i * Math.PI) / 3; return ellipse(f1(46 + Math.cos(a) * 20), f1(70 + Math.sin(a) * 5), 3, 2, '#e05252', C.ink, 0.8); }), path('M18 80 C30 92 62 92 74 80', 'none', HL, 2.4), path('M74 80 l-7 1 M74 80 l-1 6', 'none', HL, 2.4),
    rect(16, 96, 14, 6, '#cfe8d0', 1, C.ink, 0.8), tube(102, 108, 54, 12, 0.7, '#f4c3c3'), path('M96 102 L96 98 L108 98 L108 102 A6 6 0 0 1 96 102 Z', '#8a2222', null), arrow(92, 40, 92, 54, C.grey, 2)),
  /** kromatografi: a paper strip stands in a little water in a beaker; a black dot has spread upwards into blue, red and yellow bands. */
  'labk.kromatografi': all(ground(), beaker(56, 110, 44, 70, 0.12), rect(44, 22, 24, 84, C.white, 0, C.ink, 1.2), rect(40, 18, 32, 5, C.silver, 1, C.ink, 1),
    line('M46 92 L66 92', C.grey, 1, '2 2'), ellipse(56, 92, 3, 2, C.grey, null), ellipse(56, 78, 5, 3, '#f2c14e', null), ellipse(56, 64, 5, 3.4, '#e05252', null), ellipse(56, 48, 5, 3.4, '#4a7fd0', null), arrow(78, 92, 78, 48, HL, 2.4),
    g('rotate(30 100 92)', rect(94, 70, 8, 36, C.black, 2, C.ink, 1), path('M94 106 L102 106 L98 114 Z', C.black, null))),
  /** destillera: the still – water boils in the flask, the steam (orange dashes) goes through the cooled tube and drips into a second flask. */
  'labk.destillera': still('all'),
  /** kylare: the same still with everything greyed except the cooled tube: blue water goes in at the bottom and out at the top; the tube is framed. */
  'labk.kylare': still('cool'),
  // ── 3466 Titrering ───────────────────────────────────────────────
  /** titrera: a person in goggles opens the tap of a burette on a stand; drops fall into a flask that is turning pink. */
  'labk.titrera': all(ground(), bench(96), stand(84, 6, 64, 20), burette(64, 10, 66, 24), drop(64, 80, 0.8), erlen(64, 96, 0.55, 0.4, PINK),
    worker(28, [[56, 68], [48, 92]], { goggles: true, long: true }), ring(60, 70, 8)),
  /** stativ (laboratorium): a lab stand – heavy base, metal rod, clamp holding a burette (greyed); the stand is ringed. */
  'labk.stativ.2': all(ground(), greyed(burette(76, 14, 84, 30)), rect(28, 104, 56, 8, C.dark, 2, C.ink, 1.6), rect(40, 8, 5, 96, C.silver, 1.5, C.ink, 1.4),
    rect(37, 40, 11, 9, C.dark, 1.5, C.ink, 1.2), line('M48 44 L70 44', C.dark, 3), path('M70 38 L74 38 L74 50 L70 50 M82 38 L78 38 L78 50 L82 50', 'none', C.dark, 2.4), circle(36, 44, 3, C.dark, C.ink, 1),
    frame(24, 4, 30, 110)),
  /** byrett: a long thin glass tube with a scale from 0 at the top and a tap at the bottom; a grey graduated cylinder beside it for reference. */
  'labk.byrett': all(ground(), greyed(cylinder(26, 110, 54, 0.4)), burette(70, 6, 92, 20, LIQ, C.dark), num(84, 12, '0', 8), num(86, 50, '25', 7), num(86, 88, '50', 7), frame(58, 2, 34, 110)),
  /** magnetomrörare: a flask on a stirring plate with knobs; a small white magnet spins in the liquid (round arrow) and makes a whirl. */
  'labk.magnetomrörare': all(ground(), rect(18, 86, 84, 24, '#e6e9ec', 4, C.ink, 1.8), rect(24, 80, 72, 6, C.silver, 2, C.ink, 1.4), circle(36, 99, 5, C.dark, C.ink, 1), circle(84, 99, 5, C.dark, C.ink, 1), line('M36 99 L36 95 M84 99 L87 96', C.white, 1.2),
    erlen(60, 80, 1.2, 0.42, '#9fd0ee'), path('M48 66 C52 72 68 72 72 66', 'none', '#2e6ea8', 1.4), rect(53, 74, 14, 4, C.white, 2, C.ink, 1),
    path('M42 70 C40 80 80 80 78 70', 'none', HL, 2.2), path('M78 70 l-5 -1 M78 70 l1 5', 'none', HL, 2.2), ring(60, 76, 12)),
  /** färgomslag: a colourless flask → one more drop → the same flask is pink; the pink flask is ringed. */
  'labk.färgomslag': all(ground(), erlen(28, 104, 1.1, 0.4, '#eef6fb'), rx(48, 80, 68), drop(58, 64, 1.2), erlen(90, 104, 1.1, 0.4, PINK), sparkle(108, 44, 5), ring(90, 82, 26)),
  // ── 3467 Dokumentera laborationer ────────────────────────────────
  /** labbrapport: a stapled report page with a flask at the top, heading bars, a small table and a small line graph. */
  'labk.labbrapport': all(ground(), rect(24, 6, 72, 104, C.white, 2, C.ink, 1.8), rect(28, 2, 8, 8, C.silver, 1, C.ink, 1), erlen(40, 28, 0.4, 0.4, PINK), rect(52, 16, 36, 5, C.dark, 1, null), line('M52 25 L84 25', C.grey, 1.4),
    ...range(3).map((i) => all(rect(32, 38 + i * 10, 16, 3, HL, 1, null), line(`M52 ${39.5 + i * 10} L88 ${39.5 + i * 10}`, C.grey2, 1.4))),
    rect(32, 70, 26, 18, 'none', 0, C.ink, 1), line('M32 76 L58 76 M32 82 L58 82 M45 70 L45 88', C.ink, 0.8), line('M64 88 L64 70 M64 88 L88 88', C.ink, 1), line('M66 86 L72 80 L78 82 L86 72', '#3f8fd2', 1.6), line('M32 96 L88 96 M32 102 L76 102', C.grey2, 1.4)),
  /** utförande: three numbered steps on a page joined by arrows – 1 pour, 2 heat, 3 measure the temperature. */
  'labk.utförande': all(ground(), rect(6, 16, 108, 86, C.white, 3, C.ink, 1.6),
    circle(22, 30, 7, HL, null), num(22, 33.5, '1', 9, C.white), g('translate(26 80) rotate(-35)', beaker(0, 0, 16, 20, 0.5)), drop(36, 74, 0.8), beaker(34, 94, 14, 14, 0.3),
    circle(60, 30, 7, HL, null), num(60, 33.5, '2', 9, C.white), beaker(60, 74, 16, 16, 0.5), burner(60, 98, true),
    circle(98, 30, 7, HL, null), num(98, 33.5, '3', 9, C.white), rect(95, 46, 6, 40, C.white, 3, C.ink, 1.2), rect(96.6, 62, 2.8, 22, RED, 1, null), circle(98, 88, 4.4, RED, C.ink, 1.2),
    arrow(42, 54, 50, 54, C.grey, 2), arrow(76, 54, 86, 54, C.grey, 2)),
  /** felkälla: the results graph has one point far off (red); a dashed arrow leads back to its cause – wind from an open window on the scale – which is ringed. */
  'labk.felkälla': all(ground(), rect(6, 10, 34, 40, '#cfe8fb', 1, C.ink, 1.6), line('M23 10 L23 50 M6 30 L40 30', C.ink, 1.2), path('M40 10 L52 18 L52 56 L40 50 Z', '#e6f2fb', C.ink, 1.4),
    path('M44 30 C52 26 58 34 66 30 M44 40 C52 36 58 44 66 40', 'none', '#7fa9c9', 1.6), path('M66 30 l-4 -3 M66 30 l-4 3 M66 40 l-4 -3 M66 40 l-4 3', 'none', '#7fa9c9', 1.6),
    rect(54, 92, 40, 14, C.silver, 3, C.ink, 1.4), beaker(74, 90, 18, 18, 0.4), ring(52, 40, 20),
    line('M70 54 L70 82 L114 82', C.ink, 1.2), ...[[76, 76], [84, 72], [92, 68], [100, 64]].map(([x, y]) => circle(x!, y!, 2.2, '#3f8fd2', null)), circle(88, 58, 2.6, RED, null), line('M76 76 L100 64', C.grey, 1, '2 2'), arrow(84, 56, 72, 44, RED, 1.6)),
};

/** Thick grey reaction-style arrow. */
function rx(x1: number, y: number, x2: number): Svg { return arrow(x1, y, x2, y, C.grey, 3); }
