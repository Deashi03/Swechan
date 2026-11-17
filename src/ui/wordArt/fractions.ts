/**
 * Matematik & naturvetenskap → Matematikens grunder → Bråk & decimaler, 3111–3117 (0.48): fractions,
 * numerator and denominator, mixed numbers, comparing fractions, decimals, rounding and percent.
 * Recurring signs: fractions are written with digits and a bar, parts of a whole are blue pies, bars or
 * grids, and the part that the word names is orange (digit, ring, outline, arrow or box). Words in a
 * contrast pair (numerator/denominator, proper/improper, round up/round down, extend/reduce,
 * increase/decrease) share one layout where only the marked part differs. A grey reference shows what the
 * word is not. Digits and maths signs only (+ − × ÷ = ≈ < > % π); no words, no letters, no brands.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL, T, mini } from './people';
import { greyed } from './blindFix';
import { clock } from './time';

// ── Palette and basics ───────────────────────────────────────────────
const BLUE = '#7db8e8';
const PALE = '#eef3f8';
const GREEN = '#4f9d69';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ground = line('M4 112 L116 112', C.grey2, 2);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const box = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const ok = (x: number, y: number, r = 8) => all(circle(x, y, r, GREEN, C.ink, 1.2), path(`M${x - r * 0.45} ${y} L${x - r * 0.1} ${y + r * 0.35} L${x + r * 0.5} ${y - r * 0.4}`, 'none', C.white, r * 0.24));
const cross = (x: number, y: number, r = 6, col = '#d64545') => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 2.4);

/** Stacked fraction n/d centred on x, with the bar at y. cols: [numerator, bar, denominator]. */
const frac = (x: number, y: number, n: string, d: string, size = 20, cols: [string, string, string] = [C.ink, C.ink, C.ink], bw?: number) => {
  const w = bw ?? Math.max(n.length, d.length) * size * 0.62 + 6;
  return all(T(x, y - size * 0.22, n, size, cols[0]), line(`M${f1(x - w / 2)} ${y} L${f1(x + w / 2)} ${y}`, cols[1], Math.max(2, size * 0.11)), T(x, y + size * 0.86, d, size, cols[2]));
};
const pt = (x: number, y: number, r: number, a: number) => [f1(x + Math.cos(a) * r), f1(y + Math.sin(a) * r)] as const;
/** Pie divided in n parts; parts whose index is in `on` are filled. */
const pie = (x: number, y: number, r: number, n: number, on: number[], fill: string = BLUE, empty: string = C.white, edge: string = C.ink) => all(
  circle(x, y, r, empty, edge, 1.8),
  ...range(n).filter((i) => on.includes(i)).map((i) => {
    const a1 = (i / n) * Math.PI * 2 - Math.PI / 2, a2 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
    const [x1, y1] = pt(x, y, r, a1), [x2, y2] = pt(x, y, r, a2);
    return path(`M${x} ${y} L${x1} ${y1} A${r} ${r} 0 ${a2 - a1 > Math.PI ? 1 : 0} 1 ${x2} ${y2} Z`, fill, null);
  }),
  ...(n > 1 ? range(n).map((i) => { const [a, b] = pt(x, y, r, (i / n) * Math.PI * 2 - Math.PI / 2); return line(`M${x} ${y} L${a} ${b}`, edge, 1.4); }) : []),
  circle(x, y, r, 'none', edge, 1.8),
);
/** Horizontal bar divided in n cells; cells in `on` filled. */
const strip = (x: number, y: number, w: number, h: number, n: number, on: number[], fill: string = BLUE) => all(
  ...range(n).map((i) => rect(f1(x + (w / n) * i), y, f1(w / n), h, on.includes(i) ? fill : C.white, 0, C.ink, 1.3)),
  rect(x, y, w, h, 'none', 0, C.ink, 1.8),
);
/** 10 × 10 grid; the first k cells (row by row) filled. */
const grid = (x: number, y: number, s: number, k: number, fill: string = BLUE) => all(
  rect(x, y, s * 10, s * 10, C.white, 0, C.ink, 1.6),
  ...range(k).map((i) => rect(f1(x + (i % 10) * s), f1(y + Math.floor(i / 10) * s), s, s, fill, 0, null)),
  line(range(9).map((i) => `M${f1(x + (i + 1) * s)} ${y} l0 ${s * 10} M${x} ${f1(y + (i + 1) * s)} l${s * 10} 0`).join(' '), C.grey, 0.7),
  rect(x, y, s * 10, s * 10, 'none', 0, C.ink, 1.6),
);
/** Mixed number: big whole digit and a small fraction to its right. */
const mixed = (x: number, y: number, whole: string, n: string, d: string, size = 30, cols: [string, string] = [C.ink, C.ink]) => all(T(x - size * 0.32, y + size * 0.36, whole, size, cols[0]), frac(x + size * 0.36, y, n, d, size * 0.55, [cols[1], cols[1], cols[1]]));
const tagShape = (x: number, y: number, w: number, h: number, col = '#f6e08a') => all(path(`M${x - w / 2} ${y - h / 2} L${x + w / 2 - 8} ${y - h / 2} L${x + w / 2} ${y} L${x + w / 2 - 8} ${y + h / 2} L${x - w / 2} ${y + h / 2} Z`, col, C.ink, 1.6), circle(x + w / 2 - 9, y, 2, C.white, C.ink, 0.9));
const coin = (x: number, y: number, r = 7, col: string = C.silver) => all(circle(x, y, r, col, C.ink, 1.2), circle(x, y, r * 0.62, 'none', '#8a9098', 0.9));
const cakeSide = (x: number, y: number, w: number) => all(rect(x - w / 2, y - 16, w, 16, '#f6dcb0', 2, C.ink, 1.6), rect(x - w / 2, y - 20, w, 5, C.white, 2, C.ink, 1.4), line(`M${x - w / 2} ${y - 9} L${x + w / 2} ${y - 9}`, '#e89aaa', 2));
const plate = (x: number, y: number, rx = 26) => ellipse(x, y, rx, 5, C.white, C.ink, 1.6);
/** Vertical number scale from a (bottom) to b (top) at x, from y1 (bottom) to y2 (top). */
const vscale = (x: number, y1: number, y2: number, a: string, b: string) => all(line(`M${x} ${y1} L${x} ${y2}`, C.ink, 2), line(range(11).map((i) => `M${x - (i % 5 ? 3 : 6)} ${f1(y1 + ((y2 - y1) / 10) * i)} l${i % 5 ? 6 : 12} 0`).join(' '), C.ink, 1.3), T(x - 18, y1 + 5, a, 14), T(x - 18, y2 + 5, b, 14));

export const FRACTION_MOTIFS: Record<string, Svg> = {
  // ── 3111 Täljare och nämnare ─────────────────────────────────────
  'brak.bråk': all(pie(36, 60, 26, 4, [0, 1, 2]), T(68, 66, '=', 22), frac(94, 58, '3', '4', 28)),
  'brak.täljare': all(pie(32, 60, 24, 4, [0, 1, 2], HL), frac(84, 58, '3', '4', 34, [HL, C.ink, C.grey]), ring(84, 42, 17), arrow(60, 34, 70, 40, HL, 2.4)),
  'brak.nämnare': all(pie(32, 60, 24, 4, [], PALE, C.white, HL), frac(84, 58, '3', '4', 34, [C.grey, C.ink, HL]), ring(84, 78, 17), arrow(60, 92, 70, 84, HL, 2.4)),
  'brak.bråkstreck': all(frac(60, 60, '5', '8', 40, [C.grey, HL, C.grey], 56), arrow(104, 44, 92, 57, HL, 3), arrow(16, 44, 28, 57, HL, 3)),
  'brak.stambråk': all(
    ...[[22, '2', 2], [52, '3', 3], [82, '5', 5]].map(([x, d, n]) => all(pie(x as number, 34, 13, n as number, [0], HL), frac(x as number, 70, '1', d as string, 20, [HL, C.ink, C.ink]))),
    greyed(pie(106, 34, 9, 4, [0, 1, 2]), frac(106, 70, '3', '4', 14)), cross(106, 98, 5)),
  'brak.dela-in': all(rect(16, 40, 88, 50, '#f6e08a', 2, C.ink, 2), line('M38 40 L38 90 M60 40 L60 90 M82 40 L82 90', HL, 2.6, '5 4'),
    g('translate(86 30) rotate(30)', rect(-3, -26, 6, 30, C.yellow, 1, C.ink, 1.2), path('M-3 4 L3 4 L0 11 Z', C.tan, C.ink, 1), circle(0, 10, 0.9, C.ink, null)), ...[27, 49, 71, 93].map((x) => T(x, 70, '¼', 13, C.grey))),
  'brak.sjättedel': all(pie(52, 58, 34, 6, [0], HL, '#f6c860'), T(102, 108, '1/6', 16, HL)),
  'brak.åttondel': all(pie(52, 58, 34, 8, [0], HL, '#f6c860'), T(102, 108, '1/8', 16, HL)),
  'brak.tiondel': all(strip(10, 44, 100, 22, 10, [0], HL), T(60, 94, '1/10', 18, HL), arrow(15, 82, 15, 70, HL, 2.4)),
  // ── 3112 Blandad form och bråkform ────────────────────────────────
  'brak.blandad-form': all(pie(28, 40, 18, 4, [0, 1, 2, 3]), T(55, 46, '+', 18), pie(82, 40, 18, 4, [0, 1, 2]), mixed(56, 86, '1', '3', '4', 34, [HL, HL]), box(28, 62, 58, 44), greyed(frac(104, 88, '7', '4', 14))),
  'brak.bråkform': all(greyed(T(26, 66, '0,5', 22)), arrow(44, 60, 60, 60, HL, 3), frac(86, 56, '1', '2', 34, [HL, HL, HL]), box(66, 20, 40, 72)),
  'brak.heltalsdel': all(pie(30, 38, 20, 4, [0, 1, 2, 3]), circle(30, 38, 23, 'none', HL, 2.6), greyed(pie(84, 38, 20, 4, [0, 1, 2])), mixed(58, 86, '1', '3', '4', 36, [HL, C.grey]), ring(46, 86, 15), arrow(34, 64, 42, 71, HL, 2.4)),
  'brak.äkta-bråk': all(circle(36, 50, 24, 'none', C.grey, 1.6, ), pie(36, 50, 24, 4, [0, 1, 2], HL), frac(84, 46, '3', '4', 26, [HL, C.ink, C.ink]), T(84, 98, '< 1', 20, HL), greyed(frac(36, 92, '5', '4', 12))),
  'brak.oäkta-bråk': all(pie(24, 50, 16, 4, [0, 1, 2, 3], HL), pie(58, 50, 16, 4, [0], HL), frac(94, 46, '5', '4', 26, [HL, C.ink, C.ink]), T(94, 98, '> 1', 20, HL), greyed(frac(40, 92, '3', '4', 12))),
  'brak.en-och-en-halv': all(ground, plate(34, 96, 26), cakeSide(34, 94, 42), plate(88, 96, 20), rect(78, 74, 20, 16, '#f6dcb0', 2, C.ink, 1.6), rect(78, 70, 20, 5, C.white, 1, C.ink, 1.4), line('M78 81 L98 81', '#e89aaa', 2), circle(86, 66, 3, '#d64545', C.ink, 0.8), circle(28, 70, 3, '#d64545', C.ink, 0.8), circle(42, 70, 3, '#d64545', C.ink, 0.8), mixed(60, 32, '1', '1', '2', 30, [HL, HL])),
  'brak.halvannan': all(clock(30, 44, 20, 1, 0, { shade: [0, 360] }), T(62, 50, '+', 18), clock(92, 44, 20, 12, 30, { shade: [0, 180] }), rect(14, 84, 92, 12, C.white, 2, C.ink, 1.4), rect(14, 84, 61, 12, HL, 2, null), rect(14, 84, 92, 12, 'none', 2, C.ink, 1.4), line('M55 82 L55 98', C.ink, 1.4), T(34, 110, '1', 12), T(75, 110, '1½', 12, HL)),
  'brak.halv': all(ground, greyed(circle(24, 30, 12, C.orange, C.ink, 1.4)), path('M52 52 A24 24 0 0 0 52 100 Z', '#f8d9a0', C.ink, 1.8), path('M52 56 A20 20 0 0 0 52 96 Z', '#f6b860', null), path('M68 52 A24 24 0 0 1 68 100 Z', '#f8d9a0', C.ink, 1.8), path('M68 56 A20 20 0 0 1 68 96 Z', '#f6b860', null), line('M52 76 L38 66 M52 76 L36 76 M52 76 L38 86 M68 76 L82 66 M68 76 L84 76 M68 76 L82 86', '#f8e3c0', 1.2), line('M60 44 L60 106', HL, 2.4, '4 3'), T(88, 34, '½', 24, HL)),
  'brak.tre-kvart': all(clock(54, 58, 38, 12, 45, { shade: [0, 270], nums: true }), T(104, 106, '45', 16, HL)),
  // ── 3113 Jämföra bråk ────────────────────────────────────────────
  'brak.gemensam-nämnare': all(frac(22, 34, '1', '2', 18), arrow(36, 38, 48, 38, C.grey, 2), frac(64, 34, '3', '6', 18, [C.ink, C.ink, HL]),
    frac(22, 84, '1', '3', 18), arrow(36, 88, 48, 88, C.grey, 2), frac(64, 84, '2', '6', 18, [C.ink, C.ink, HL]), ring(64, 49, 10), ring(64, 99, 10), path('M76 50 C96 52 96 96 76 98', 'none', HL, 2.4), T(104, 78, '=', 18, HL)),
  'brak.förkorta.2': all(frac(28, 34, '6', '8', 24), arrow(46, 38, 72, 38, HL, 3), T(59, 30, '÷2', 12, HL), frac(92, 34, '3', '4', 24, [HL, HL, HL]), pie(28, 88, 18, 8, [0, 1, 2, 3, 4, 5]), T(60, 94, '=', 18), pie(92, 88, 18, 4, [0, 1, 2])),
  'brak.förlänga.2': all(frac(28, 34, '3', '4', 24), arrow(46, 38, 72, 38, HL, 3), T(59, 30, '×2', 12, HL), frac(92, 34, '6', '8', 24, [HL, HL, HL]), pie(28, 88, 18, 4, [0, 1, 2]), T(60, 94, '=', 18), pie(92, 88, 18, 8, [0, 1, 2, 3, 4, 5])),
  'brak.i-enklaste-form': all(greyed(frac(16, 50, '8', '16', 14), frac(42, 50, '4', '8', 14), frac(64, 50, '2', '4', 14)), line('M27 54 L32 54 M52 54 L56 54 M72 54 L78 54', C.grey, 1.4), frac(96, 50, '1', '2', 26, [HL, HL, HL]), box(82, 24, 28, 56), ok(96, 98, 9)),
  'brak.tårtbit': all(ground, greyed(cakeSide(36, 72, 48)), plate(70, 98, 34), path('M44 92 L96 80 L96 94 L44 94 Z', '#f6dcb0', C.ink, 1.8), path('M44 92 L96 80 L96 74 L44 86 Z', C.white, C.ink, 1.6), line('M50 93.5 L96 88', '#e89aaa', 2), circle(86, 72, 4, '#d64545', C.ink, 1), path('M86 68 l2 -3', 'none', GREEN, 1.6)),
  // ── 3114 Decimalform ─────────────────────────────────────────────
  'brak.decimalform': all(greyed(frac(24, 54, '3', '4', 22)), arrow(40, 60, 56, 60, HL, 3), T(86, 69, '0,75', 22, HL), box(60, 46, 54, 32)),
  'brak.decimal': all(T(40, 74, '3,', 40), rect(55, 40, 22, 42, 'rgba(228,87,46,0.15)', 3, HL, 2.4), rect(79, 40, 22, 42, 'rgba(228,87,46,0.15)', 3, HL, 2.4), T(66, 74, '1', 36, HL), T(90, 74, '4', 36, HL), arrow(66, 100, 66, 86, HL, 2.4), arrow(90, 100, 90, 86, HL, 2.4)),
  'brak.decimalkomma': all(T(36, 72, '2', 44), circle(58, 70, 4.5, HL, null), path('M60 70 C60 76 57 80 54 82', 'none', HL, 4), T(80, 72, '5', 44), ring(58, 72, 13), greyed(T(60, 106, '2.5', 16)), cross(76, 101, 5)),
  'brak.hundradel': all(grid(12, 14, 6.4, 1, HL), ring(15.2, 17.2, 6), T(96, 56, '1/100', 13, HL), T(96, 80, '0,01', 16, HL)),
  'brak.tusendel': all(rect(8, 62, 104, 16, '#f6e08a', 1, C.ink, 1.6), line(range(21).map((i) => `M${f1(8 + i * 5.2)} 62 l0 ${i % 10 === 0 ? 10 : i % 5 === 0 ? 7 : 4}`).join(' '), C.ink, 1), T(12, 92, '0', 10), T(108, 92, '1', 10),
    circle(28, 34, 18, '#eaf6ff', C.ink, 2), line('M41 47 L50 58', C.ink, 4), line('M22 30 L22 40 M24 30 L24 40 M26 30 L26 40', C.ink, 1), rect(23.2, 30, 1.6, 10, HL, 0, null), line('M24 40 L13 62', HL, 1.6, '3 2'), T(86, 42, '0,001', 16, HL)),
  'brak.öre': all(tagShape(56, 58, 92, 44), T(46, 68, '14,', 26), T(78, 68, '90', 26, HL), box(63, 44, 32, 32), greyed(coin(24, 98, 8)), cross(24, 98, 7)),
  // ── 3115 Avrundning ─────────────────────────────────────────────
  'brak.avrundning': all(line('M10 70 L110 70', C.ink, 2), line(range(11).map((i) => `M${10 + i * 10} ${i % 5 ? 66 : 62} L${10 + i * 10} ${i % 5 ? 74 : 78}`).join(' '), C.ink, 1.4), T(10, 94, '4', 14), T(110, 94, '5', 14), circle(90, 70, 4, C.ink, null), T(84, 56, '4,8', 13), path('M92 60 C98 36 108 40 110 62', 'none', HL, 2.6), arrow(108, 54, 110, 63, HL, 2.6), circle(110, 70, 5, 'none', HL, 2.6)),
  'brak.avrunda-uppåt': all(vscale(40, 102, 22, '3', '4'), circle(40, 46, 5, C.ink, null), T(18, 51, '3,7', 12), path('M70 104 L70 52 L58 52 L82 18 L106 52 L94 52 L94 104 Z', HL, C.ink, 1.6), circle(40, 22, 7, 'none', HL, 2.8), line('M47 22 L60 22', HL, 2, '3 2')),
  'brak.avrunda-nedåt': all(vscale(64, 102, 22, '3', '4'), circle(64, 86, 5, C.ink, null), T(94, 91, '3,2', 16), arrow(78, 90, 78, 104, HL, 3.4), circle(64, 102, 7, 'none', HL, 2.8)),
  'brak.närmevärde': all(greyed(T(60, 34, 'π = 3,14159…', 15)), arrow(60, 44, 60, 60, HL, 3), rect(30, 64, 60, 34, 'rgba(228,87,46,0.12)', 4, HL, 2.8), T(60, 90, '3,14', 26, HL)),
  'brak.ungefär-lika-med': all(T(24, 60, '9,8', 20), path('M48 46 c4 -4 8 -4 12 0 s8 4 12 0 M48 58 c4 -4 8 -4 12 0 s8 4 12 0', 'none', HL, 4.4), T(96, 60, '10', 22), greyed(T(60, 100, '=', 22)), cross(60, 93, 7)),
  'brak.öresavrundning': all(rect(12, 18, 44, 60, C.white, 2, C.ink, 1.6), line('M18 30 L48 30 M18 38 L42 38 M18 46 L46 46', C.grey2, 2), line('M16 56 L52 56', C.ink, 1), T(34, 70, '47,60', 12), arrow(60, 48, 74, 48, HL, 3), rect(78, 30, 34, 36, 'rgba(228,87,46,0.12)', 4, HL, 2.4), T(95, 54, '48', 18, HL), coin(28, 98, 8), coin(46, 98, 8), coin(64, 98, 8), coin(82, 98, 8)),
  'brak.värdesiffra': all(T(25, 70, '0,0', 28, C.grey), rect(48, 44, 66, 36, 'rgba(228,87,46,0.12)', 4, HL, 2.4), T(81, 70, '350', 28, HL), ...[59, 81, 103].map((x) => circle(x, 92, 3, HL, null))),
  // ── 3116 Procent i vardagen ──────────────────────────────────────
  'brak.procent': all(circle(60, 60, 46, '#fbe1d6', HL, 3), circle(42, 40, 11, 'none', HL, 7), circle(78, 80, 11, 'none', HL, 7), line('M82 30 L38 90', HL, 8)),
  'brak.procentform': all(greyed(frac(20, 46, '1', '4', 18), T(52, 58, '=', 16), T(80, 58, '0,25', 16)), T(60, 100, '25 %', 26, HL), box(28, 76, 64, 32)),
  'brak.andel.2': all(...range(5).map((i) => g(`translate(${16 + i * 22} 52)`, mini(0, 0, i < 3 ? C.orange : C.grey2))), box(3, 32, 66, 34), path('M8 70 L8 76 L64 76 L64 70', 'none', HL, 2.4), frac(36, 94, '3', '5', 18, [HL, HL, HL]), greyed(frac(98, 94, '2', '5', 14))),
  'brak.var-tredje': all(...range(6).map((i) => g(`translate(${14 + i * 18.4} 70)`, mini(0, 0, i % 3 === 2 ? C.orange : C.grey2))), ...[2, 5].map((i) => arrow(14 + i * 18.4, 36, 14 + i * 18.4, 54, HL, 2.6)), T(60, 106, '1/3', 16, HL)),
  'brak.hundra-procent': all(rect(10, 30, 92, 24, C.white, 6, C.ink, 2), rect(13, 33, 86, 18, GREEN, 4, null), T(56, 47, '100 %', 13, C.white), ok(108, 42, 8), greyed(rect(10, 80, 92, 18, C.white, 6, C.ink, 1.6), rect(13, 83, 50, 12, GREEN, 3, null), T(80, 94, '60 %', 10))),
  // ── 3117 Procentuell förändring ──────────────────────────────────
  'brak.procentuell': all(line('M14 104 L106 104', C.ink, 1.8), rect(26, 54, 26, 50, C.grey2, 1, C.ink, 1.4), T(39, 48, '100', 12), rect(70, 44, 26, 60, BLUE, 1, C.ink, 1.4), rect(70, 44, 26, 10, HL, 1, C.ink, 1.2), T(83, 38, '120', 12), tagShape(58, 18, 44, 18, '#fbe1d6'), T(55, 23, '+20 %', 11, HL)),
  'brak.ökning': all(ground, ...range(3).map((i) => g(`translate(${14 + i * 12} 100)`, mini(0, 0, C.grey2))), arrow(50, 92, 62, 92, C.grey, 2.4), ...range(6).map((i) => g(`translate(${72 + (i % 3) * 14} ${i < 3 ? 100 : 76})`, mini(0, 0, C.orange))), arrow(60, 60, 60, 16, HL, 5)),
  'brak.minskning': all(ground, ...range(6).map((i) => g(`translate(${14 + (i % 3) * 14} ${i < 3 ? 100 : 76})`, mini(0, 0, C.grey2))), arrow(56, 92, 68, 92, C.grey, 2.4), ...range(3).map((i) => g(`translate(${80 + i * 12} 100)`, mini(0, 0, C.orange))), arrow(60, 16, 60, 60, HL, 5)),
  'brak.förändringsfaktor': all(T(22, 56, '100', 18), T(44, 56, '×', 18), T(70, 56, '1,05', 18, HL), ring(70, 50, 18), T(60, 96, '= 105', 20)),
  'brak.prissänkning': all(tagShape(56, 40, 84, 34), T(48, 48, '800', 22, C.grey), line('M28 38 L70 48', '#d64545', 3), tagShape(56, 88, 84, 34, '#fbe1d6'), T(48, 96, '600', 22, HL), arrow(104, 46, 104, 80, HL, 3.4)),
};
