/**
 * Kvalitetsplanen B5 – det manuella bildspåret, Avancerad matematik (och de ord från Matematikens grunder
 * som delar betydelse). Ord som underkänts två gånger med mallfigurer ritas här för hand med större frihet:
 * kontrastpar i samma layout, matematisk notation som ledtråd (f′, ≈, =, ⇒, +C, λ, σ², E(X)), bildserier i
 * två–tre steg och rörelse för verb. Orange visar det ordet betyder, grått det som ordet inte är.
 * Bara siffror, matematiska tecken, variabelnamn och enstaka bokstäver; inga ord.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, waBob, waGrow, waIn, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

const SOFT = 'rgba(228,87,46,0.18)';
const GR = C.grey;
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const dot = (x: number, y: number, col: string = C.ink, r = 3.4) => circle(x, y, r, col, C.ink, 1);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const axes = (ox: number, oy: number, x1: number, x2: number, yt: number, yb: number, col: string = C.ink, sw = 2) =>
  all(arrow(x1, oy, x2, oy, col, sw), arrow(ox, yb, ox, yt, col, sw));
const plot = (fn: (x: number) => number, a: number, b: number, n = 40) =>
  range(n + 1).map((i) => { const x = a + ((b - a) * i) / n; return `${i ? 'L' : 'M'}${f1(x)} ${f1(fn(x))}`; }).join(' ');
const paper = (x = 6, y = 6, w = 108, h = 108) => rect(x, y, w, h, C.white, 6, C.grey2, 1.4);
const coin = (x: number, y: number, col: string = C.gold) => all(ellipse(x, y, 9, 3.6, col, C.ink, 1.2));
const stack = (x: number, yb: number, n: number, col: string = C.gold) => all(...range(n).map((i) => coin(x, yb - i * 5, col)));
/** Target with rings; the dart sits at (dx, dy) from the centre. */
const target = (cx: number, cy: number, dx: number, dy: number, col: string) =>
  all(circle(cx, cy, 30, C.white, C.ink, 1.6), circle(cx, cy, 20, '#f3d9cf', C.ink, 1.2), circle(cx, cy, 10, C.white, C.ink, 1.2), circle(cx, cy, 2.4, C.ink, null),
    line(`M${cx + dx} ${cy + dy} L${cx + dx + 20} ${cy + dy - 20}`, C.dark, 2.6), path(`M${cx + dx + 20} ${cy + dy - 20} l2 -9 l4 4 l-9 2 Z`, col, C.ink, 1), circle(cx + dx, cy + dy, 2.6, col, C.ink, 1));
const die = (x: number, y: number, s: number, pips: number, col: string = C.white) => {
  const p: Record<number, [number, number][]> = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
  return all(rect(x - s / 2, y - s / 2, s, s, col, s / 5, C.ink, 1.6), ...(p[pips] ?? []).map(([a, b]) => circle(x + a * s * 0.27, y + b * s * 0.27, s * 0.09, C.ink, null)));
};
const node = (x: number, y: number, col: string = HL) => circle(x, y, 6, col, C.ink, 1.6);
const panel = (x: number, y: number, w: number, h: number, on: boolean) => rect(x, y, w, h, on ? SOFT : C.white, 5, on ? HL : C.grey2, on ? 2.4 : 1.4);

// ── Kurvor ────────────────────────────────────────────────────────────
const parab = (x: number) => 100 - ((x - 18) * (x - 18)) / 96;
const tangentPic = (mark: 'derivata' | 'punkt') => {
  const x0 = 70, y0 = parab(x0), k = -(2 * (x0 - 18)) / 96;
  const tl = `M${x0 - 34} ${f1(y0 - 34 * k)} L${x0 + 34} ${f1(y0 + 34 * k)}`;
  return all(axes(16, 104, 10, 114, 10, 110), line(plot(parab, 16, 108), C.ink, 2.6),
    mark === 'derivata'
      ? all(line(tl, HL, 3.4), line(`M${x0} ${f1(y0)} L${x0 + 20} ${f1(y0)} L${x0 + 20} ${f1(y0 + 20 * k)}`, HL, 2, '3 2'), T(56, 24, 'f′(x)', 18, HL), dot(x0, y0, HL))
      : all(line(tl, GR, 2.2), dot(x0, y0, HL, 4.6), ring(x0, y0, 11)));
};

// ── Pengar ────────────────────────────────────────────────────────────
const moneyPic = (gain: boolean) => all(
  stack(24, 92, gain ? 8 : 5), T(24, 112, gain ? '100' : '70', 12),
  T(44, 66, '−', 18), stack(60, 92, gain ? 5 : 8, C.silver), T(60, 112, gain ? '70' : '100', 12),
  T(78, 66, '=', 18),
  gain ? all(stack(100, 92, 3, HL), T(100, 112, '+30', 13, HL), waIn('b5-vinst-1', 0, 10, arrow(100, 58, 100, 36, C.green, 4)))
    : all(...range(3).map((i) => ellipse(100, 92 - i * 5, 9, 3.6, 'none', HL, 1.4)), T(100, 112, '−30', 13, HL), waIn('b5-forlust-1', 0, -10, arrow(100, 36, 100, 60, HL, 4))));

// ── Logik ─────────────────────────────────────────────────────────────
const box = (x: number, y: number, s: string, col: string = C.ink, fill: string = C.white) => all(rect(x - 14, y - 14, 28, 28, fill, 6, col, 2), T(x, y + 7, s, 20, col));

export const MANUAL_MATH_MOTIFS: Record<string, Svg> = {
  // Gränsvärden, numeriska metoder
  'manm.närmevärde': all(T(22, 32, 'π', 24, GR), T(48, 34, '≈', 30, HL), rect(64, 10, 46, 30, SOFT, 5, HL, 2.6), T(87, 33, '3,14', 18, HL), line('M8 84 L112 84', C.ink, 2), ...range(11).map((i) => line(`M${10 + i * 10} 78 L${10 + i * 10} 90`, C.ink, i % 5 === 0 ? 2 : 1)), T(10, 106, '3,10', 9), T(60, 106, '3,15', 9), T(110, 106, '3,20', 9), dot(50, 84, HL, 4.6), path('M51.6 70 l-4 -7 l8 0 Z', GR, C.ink, 1), line('M51.6 70 L51.6 80', GR, 1.4), T(54, 58, 'π', 12, GR)),
  'manm.exakt': all(target(48, 72, 0, 0, HL), T(22, 28, '2 · 3', 18), T(56, 30, '=', 30, HL), T(84, 28, '6', 22)),
  'manm.area': all(...range(12).map((i) => rect(16 + (i % 4) * 22, 22 + Math.floor(i / 4) * 22, 22, 22, SOFT, 0, HL, 1.2)), rect(16, 22, 88, 66, 'none', 0, HL, 3), T(60, 112, '12 m²', 18, HL)),
  'manm.beräkna': all(paper(14, 10, 92, 100), T(60, 44, '12', 18), T(42, 64, '×', 18), T(66, 64, '7', 18), line('M30 72 L90 72', C.ink, 2), T(66, 96, '84', 20, HL), waBob('b5-berakna-1', 4, g('rotate(35 96 86)', rect(92, 56, 8, 40, C.yellow, 1, C.ink, 1.2), path('M92 96 L96 106 L100 96 Z', C.tan, C.ink, 1)))),
  'manm.noggrannhet': all(rect(8, 70, 104, 22, '#f4e7c8', 3, C.ink, 1.6), ...range(41).map((i) => line(`M${10 + i * 2.5} 70 L${10 + i * 2.5} ${i % 10 === 0 ? 84 : i % 5 === 0 ? 80 : 76}`, C.ink, 0.9)),
    circle(60, 52, 22, 'rgba(255,255,255,0.75)', C.ink, 3), line('M76 68 L92 86', C.ink, 5), ...range(9).map((i) => line(`M${44 + i * 4} 40 L${44 + i * 4} ${i % 2 ? 50 : 56}`, C.ink, 0.8)), T(60, 22, '± 0,01', 18, HL)),
  'manm.numerisk': all(axes(14, 102, 8, 114, 10, 108), ...range(8).map((i) => { const x = 18 + i * 11, h = 14 + 0.009 * (x - 10) * (x - 10) * 0.9 + i * 2; return rect(x, 102 - h, 11, h, SOFT, 0, HL, 1.4); }), line(plot((x) => 102 - (14 + 0.0081 * (x - 10) * (x - 10) + (x - 18) * 0.18), 14, 106), C.ink, 2.4), T(66, 22, '≈ 2,67', 16, HL), greyed(T(28, 22, '∫', 22, C.grey)), line('M18 8 L38 30', C.grey, 2.4)),
  'manm.startvärde': all(axes(16, 94, 10, 114, 10, 110), line(plot((x) => 94 - ((x - 16) * (x - 16)) / 60 + 30, 16, 104), C.ink, 2.4),
    line('M100 94 L100 22', GR, 1.4, '3 3'), line('M100 22 L74 94', GR, 1.6), line('M74 94 L74 67', GR, 1.4, '3 3'), line('M74 67 L64 94', GR, 1.6),
    dot(100, 94, HL, 5), line('M100 94 L100 108', HL, 2.4), path('M100 108 L100 98 L110 101 Z', HL, C.ink, 1), T(100, 120, 'x₀', 12, HL), T(78, 106, 'x₁', 10, GR), T(62, 106, 'x₂', 10, GR)),
  // Funktioner och derivata
  'manm.funktion': all(T(14, 46, '2', 16), arrow(22, 40, 38, 40, C.ink, 2.4), rect(40, 22, 40, 36, SOFT, 6, HL, 3), T(60, 47, 'f', 22, HL), arrow(82, 40, 98, 40, C.ink, 2.4), T(108, 46, '4', 16),
    T(14, 92, '3', 16), arrow(22, 86, 38, 86, GR, 2), rect(40, 70, 40, 32, C.white, 6, GR, 1.6), T(60, 92, 'f', 18, GR), arrow(82, 86, 98, 86, GR, 2), T(108, 92, '6', 16)),
  'manm.derivata': tangentPic('derivata'),
  'manm.tangeringspunkt': tangentPic('punkt'),
  'manm.derivera': all(panel(4, 30, 44, 56, false), T(26, 64, 'x²', 20), waIn('b5-derivera-1', -10, 0, arrow(50, 58, 72, 58, HL, 4.4)), T(61, 46, 'd/dx', 11, HL), panel(74, 30, 42, 56, true), T(95, 64, '2x', 20, HL)),
  'manm.förändringshastighet': all(axes(14, 100, 8, 70, 18, 106), line(plot((x) => 98 - ((x - 14) * (x - 14)) / 50, 14, 64), C.ink, 2.4),
    rect(30, 6, 22, 0, 'none'), circle(94, 58, 22, C.white, C.ink, 2), ...range(7).map((i) => { const a = Math.PI * (1 - i / 6); return line(`M${f1(94 + 17 * Math.cos(a))} ${f1(58 - 17 * Math.sin(a))} L${f1(94 + 21 * Math.cos(a))} ${f1(58 - 21 * Math.sin(a))}`, C.ink, 1.4); }),
    g('rotate(0 94 58)', waIn('b5-forandringshastighet-1', 0, 0, line('M94 58 L108 44', HL, 3.4))), circle(94, 58, 2.6, C.ink, null), T(94, 98, '°C / h', 12, HL)),
  'manm.potens': all(T(40, 56, '2', 40), T(62, 34, '3', 24, HL), T(60, 98, '2 · 2 · 2', 18), line('M24 104 L96 104', HL, 2)),
  'manm.extremvärde': all(axes(14, 104, 8, 114, 8, 110), line(plot((x) => 66 - 34 * Math.sin((x - 14) / 15), 14, 110), C.ink, 2.6),
    dot(37.6, 32, HL, 4.6), line('M26 32 L50 32', HL, 2.4), dot(84.7, 100, HL, 4.6), line('M73 100 L97 100', HL, 2.4), ring(37.6, 32, 10), ring(84.7, 100, 10)),
  'manm.linjär': all(axes(14, 104, 8, 114, 8, 110), line(plot((x) => 104 - ((x - 14) * (x - 14)) / 100, 14, 106), GR, 2, '4 3'), line('M16 100 L106 28', HL, 3.4), ...[[34, 85.6], [52, 71.2], [70, 56.8], [88, 42.4]].map(([x, y]) => dot(x!, y!, HL))),
  'manm.målfunktion': all(axes(14, 104, 8, 114, 8, 110), line(plot((x) => 100 - 70 * Math.exp(-((x - 64) * (x - 64)) / 500), 14, 110), HL, 3.4),
    T(36, 30, 'f(x)', 16, HL), line('M64 30 L64 14', C.ink, 1.6), path('M64 14 L80 18 L64 22 Z', HL, C.ink, 1), dot(64, 30, HL, 3.6), arrow(98, 70, 98, 40, HL, 2.6)),
  // Integraler och differentialekvationer
  'manm.primitiv-funktion': all(panel(4, 18, 50, 84, true), T(29, 40, 'F(x)', 16, HL), axes(10, 92, 6, 50, 48, 96, C.ink, 1.4), path('M10 92 Q30 92 46 52', 'none', HL, 3.2),
    arrow(56, 60, 70, 60, C.ink, 2.4), T(63, 52, '′', 18), panel(72, 18, 44, 84, false), T(94, 40, 'f(x)', 16), axes(78, 92, 74, 112, 48, 96, C.ink, 1.4), line('M78 92 L108 56', C.ink, 2.4)),
  'manm.integrationskonstant': all(axes(14, 104, 8, 114, 8, 110), ...[0, 1, 2, 3].map((i) => line(plot((x) => 98 - i * 18 - ((x - 14) * (x - 14)) / 260, 14, 104), i === 2 ? HL : GR, i === 2 ? 3 : 1.8)),
    arrow(100, 76, 100, 46, HL, 2.6), T(84, 20, '+ C', 22, HL)),
  'manm.begynnelsevillkor': all(axes(20, 104, 14, 114, 8, 110), ...[0, 1, 2, 3, 4].map((i) => line(plot((x) => 92 - i * 16 - (x - 20) * 0.4, 20, 108), GR, 1.6)),
    line(plot((x) => 60 - (x - 20) * 0.4, 20, 108), C.ink, 2.4), dot(20, 60, HL, 5), ring(20, 60, 11), T(64, 22, 'y(0) = 5', 16, HL)),
  'manm.tillryggalagd': all(line('M10 96 C30 96 34 70 56 70 C78 70 82 44 110 40', GR, 4, '6 5'), line('M10 96 C30 96 34 70 56 70', HL, 6),
    circle(10, 96, 4, C.ink, null), g('translate(58 62)', circle(0, -16, 5, C.skin, C.ink, 1.2), line('M0 -11 L-2 2 M-2 2 L-8 12 M-2 2 L6 10 M0 -8 L-8 -2 M0 -8 L8 -4', C.ink, 2.6)), T(30, 60, '2 km', 14, HL)),
  'manm.samband': all(rect(14, 60, 18, 44, C.sky, 2, C.ink, 1.6), rect(88, 46, 18, 58, C.mint, 2, C.ink, 1.6), arrow(23, 54, 23, 30, C.ink, 2.6), arrow(97, 40, 97, 16, C.ink, 2.6),
    ellipse(50, 70, 13, 8, 'none', HL, 3.4), ellipse(68, 70, 13, 8, 'none', HL, 3.4), line('M32 70 L37 70 M81 70 L88 70', HL, 3)),
  'manm.i-takt-med': all(...[0, 1, 2].map((i) => all(rect(4 + i * 38, 14, 36, 92, C.white, 5, C.grey2, 1.2), circle(22 + i * 38, 34, 12, C.white, C.ink, 1.6), line(`M${22 + i * 38} 34 L${22 + i * 38} 25`, C.ink, 1.8), line(`M${22 + i * 38} 34 L${f1(22 + i * 38 + 9 * Math.sin((i + 1) * 1.2))} ${f1(34 - 9 * Math.cos((i + 1) * 1.2))}`, HL, 2.4), rect(16 + i * 38, 56 + i * 14, 12, 44 - i * 14, C.beige, 2, C.ink, 1.4), path(`M${22 + i * 38} ${48 + i * 14} q-4 4 0 8 q4 -4 0 -8 Z`, C.orange, C.ink, 0.8), line(`M${22 + i * 38} ${56 + i * 14} L${22 + i * 38} ${53 + i * 14}`, C.ink, 1))), line('M10 112 L110 112', HL, 2), path('M110 112 l-6 -4 l0 8 Z', HL, null), ...[0, 1].map((i) => all(line(`M${36 + i * 38} ${62 + i * 14} L${56 + i * 38} ${76 + i * 14}`, HL, 2, '3 2'), line(`M${36 + i * 38} ${30} L${56 + i * 38} ${30}`, HL, 2, '3 2')))),
  'manm.vektor': all(...range(6).map((i) => line(`M${10 + i * 20} 10 L${10 + i * 20} 110 M10 ${10 + i * 20} L110 ${10 + i * 20}`, C.grey2, 1)), dot(30, 90, C.ink), arrow(30, 90, 90, 30, HL, 4.4), T(72, 76, 'v⃗', 22, HL)),
  'manm.komponent': all(...range(6).map((i) => line(`M${10 + i * 20} 10 L${10 + i * 20} 110 M10 ${10 + i * 20} L110 ${10 + i * 20}`, C.grey2, 1)), arrow(30, 90, 90, 30, GR, 2.6),
    arrow(30, 90, 90, 90, HL, 3.6), arrow(90, 90, 90, 30, HL, 3.6), T(60, 106, '3', 14, HL), T(102, 64, '3', 14, HL)),
  'manm.nollvektor': all(greyed(arrow(10, 30, 50, 30, C.grey, 2.6), arrow(20, 60, 44, 60, C.grey, 2.6), arrow(28, 90, 38, 90, C.grey, 2.6)), arrow(56, 60, 70, 60, C.ink, 2), dot(92, 60, HL, 6), ring(92, 60, 14), T(92, 104, '0⃗', 22, HL)),
  'manm.substitutionsmetod': all(rect(8, 8, 60, 26, SOFT, 5, HL, 2.6), T(38, 27, 'y = 2x', 16, HL), T(66, 64, 'x + y = 6', 16), path('M40 36 C40 50 70 46 86 52', 'none', HL, 2.4), path('M86 52 l-8 -1 l5 -6 Z', HL, null),
    T(60, 104, 'x + 2x = 6', 16), rect(40, 88, 34, 22, 'none', 4, HL, 2.2)),
  'manm.egenvärde': all(line('M8 112 L112 8', C.grey2, 1.4, '4 4'), arrow(24, 96, 72, 48, GR, 5), arrow(24, 96, 42, 78, C.ink, 3.4), T(22, 76, 'v', 14), path('M44 74 C60 84 76 72 74 52', 'none', HL, 2.4), path('M74 50 l-5 6 l8 1 Z', HL, null), rect(72, 70, 40, 34, SOFT, 6, HL, 2.8), T(92, 96, '×3', 22, HL), T(30, 30, 'λ', 26, HL)),
  'manm.slumpförsök': all(die(24, 40, 26, 4), T(24, 80, '?', 22, HL), circle(60, 40, 13, C.gold, C.ink, 1.6), T(60, 45, '1', 12, C.ink), T(60, 80, '?', 22, HL), circle(98, 40, 14, C.white, C.ink, 1.6), ...range(4).map((i) => path(`M98 40 L${f1(98 + 14 * Math.cos(i * Math.PI / 2))} ${f1(40 + 14 * Math.sin(i * Math.PI / 2))} A14 14 0 0 1 ${f1(98 + 14 * Math.cos((i + 1) * Math.PI / 2))} ${f1(40 + 14 * Math.sin((i + 1) * Math.PI / 2))} Z`, [C.red, C.sky, C.yellow, C.green][i]!, C.ink, 1)), line('M98 40 L98 28', C.ink, 2), T(98, 80, '?', 22, HL), rect(4, 14, 112, 76, 'none', 8, HL, 2.4)),
  'manm.komplementhändelse': all(rect(8, 12, 104, 96, SOFT, 4, HL, 2.6), circle(40, 62, 26, C.white, C.ink, 2), die(40, 70, 18, 6), ...[[78, 28, 1], [98, 56, 2], [80, 76, 3], [100, 96, 4], [62, 100, 5]].map(([x, y, n]) => die(x!, y!, 15, n!)), T(40, 54, 'A', 13), T(100, 34, 'A', 22, HL), line('M92 12 L108 12', HL, 3)),
  'manm.procent': all(...range(100).map((i) => rect(10 + (i % 10) * 6, 26 + Math.floor(i / 10) * 6, 5.4, 5.4, i === 0 ? HL : C.white, 0.8, i === 0 ? C.ink : C.grey2, 0.5)), ring(12.7, 28.7, 6), T(94, 62, '%', 44, HL), T(40, 106, '1 % = 1/100', 13, HL)),
  'manm.andel': all(circle(56, 62, 40, C.white, C.ink, 2), path('M56 62 L56 22 A40 40 0 0 1 94 74 Z', HL, C.ink, 2)),
  'manm.osannolik': all(path('M14 92 A46 46 0 0 1 106 92', 'none', C.ink, 2), path('M14 92 A46 46 0 0 1 36 52', 'none', HL, 8), T(14, 108, '0', 12), T(106, 108, '1', 12), line('M60 92 L22 80', C.ink, 3), circle(60, 92, 4, C.ink, null), T(66, 30, '1 / 1000', 14, HL)),
  'manm.relativ-frekvens': all(...range(7).map((i) => line(`M${12 + i * 6} 30 L${12 + i * 6} 54`, HL, 3)), line('M10 50 L52 34', HL, 2.4), ...range(13).map((i) => line(`M${64 + (i % 7) * 6} ${i < 7 ? 30 : 60} L${64 + (i % 7) * 6} ${i < 7 ? 54 : 84}`, GR, 2.4)),
    T(40, 100, '7', 16, HL), line('M28 104 L52 104', C.ink, 2), T(40, 118, '20', 14), T(84, 112, '= 0,35', 14, HL)),
  'manm.kombinatorik': all(...[0, 1, 2].map((i) => all(path(`M${14 + i * 18} ${18} l6 -4 l6 4 l-2 3 l-1 -1 l0 12 l-6 0 l0 -12 l-1 1 Z`, [C.red, C.sky, C.green][i]!, C.ink, 1))),
    T(70, 30, '×', 18), ...[0, 1].map((i) => rect(84 + i * 16, 14, 10, 22, [C.navy, C.tan][i]!, 2, C.ink, 1)),
    ...range(6).map((i) => all(path(`M${10 + i * 17} 68 l5 -3 l5 3 l-1 2 l-1 -1 l0 9 l-6 0 l0 -9 l-1 1 Z`, [C.red, C.red, C.sky, C.sky, C.green, C.green][i]!, C.ink, 0.8), rect(12 + i * 17, 80, 7, 14, [C.navy, C.tan][i % 2]!, 1, C.ink, 0.8))),
    T(60, 112, '3 · 2 = 6', 14, HL)),
  'manm.permutation': all(...['A', 'B', 'C'].map((l, i) => all(rect(14 + i * 34, 12, 24, 24, C.white, 4, C.ink, 1.8), T(26 + i * 34, 31, l, 16))), line('M26 38 L94 82 M60 38 L26 82 M94 38 L60 82', HL, 2.2), ...['C', 'A', 'B'].map((l, i) => all(rect(14 + i * 34, 84, 24, 24, SOFT, 4, HL, 2.4), T(26 + i * 34, 103, l, 16, HL)))),
  'manm.ordningsföljd': all(...[1, 2, 3].map((n, i) => all(circle(22 + i * 38, 60, 14, i === 0 ? SOFT : C.white, HL, 2.6), T(22 + i * 38, 67, String(n), 18, HL))), arrow(37, 60, 44, 60, C.ink, 2.4), arrow(75, 60, 82, 60, C.ink, 2.4)),
  'manm.sannolikhetsfördelning': all(axes(12, 100, 6, 116, 8, 106), ...[1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1].map((h, i) => rect(17 + i * 9, 100 - h * 13, 7, h * 13, HL, 1, C.ink, 0.8)), T(30, 22, 'P', 16)),
  'manm.jämnt-fördelad': all(line('M8 100 L112 100', C.ink, 2), ...range(6).map((i) => all(rect(12 + i * 17, 46, 14, 54, HL, 2, C.ink, 1), die(19 + i * 17, 112, 10, i + 1))), line('M8 46 L112 46', C.ink, 1.4, '4 3')),
  'manm.väntevärde': all(axes(14, 104, 8, 114, 8, 110), line('M14 58 L110 58', HL, 2.4, '5 4'), line('M14 30 L22 84 L30 44 L38 70 L46 50 L56 64 L66 54 L78 61 L92 57 L110 58', C.ink, 2), T(84, 46, 'E(X)', 16, HL), die(30, 16, 14, 3)),
  'manm.i-genomsnitt': all(greyed(rect(8, 64, 14, 40, C.grey, 2, C.ink, 1), rect(24, 34, 14, 70, C.grey, 2, C.ink, 1), rect(40, 74, 14, 30, C.grey, 2, C.ink, 1)), arrow(58, 76, 68, 76, C.ink, 2.4), ...[0, 1, 2].map((i) => rect(72 + i * 15, 58, 13, 46, HL, 2, C.ink, 1)), line('M4 58 L116 58', HL, 2, '4 3'), line('M4 104 L116 104', C.ink, 1.6)),
  'manm.förlust': moneyPic(false),
  'manm.vinst': moneyPic(true),
  'manm.varians': all(line('M8 92 L112 92', C.ink, 2), line('M60 30 L60 98', C.ink, 1.6, '3 3'), ...[[22, -38], [44, -16], [70, 10], [96, 36]].map(([x, d]) => all(rect(Math.min(x!, 60), 92 - Math.abs(d!), Math.abs(d!), Math.abs(d!), SOFT, 0, HL, 1.6), dot(x!, 92, C.ink, 3.4))), T(92, 28, 'σ²', 20, HL)),
  'manm.spridning': all(line('M8 70 L112 70', C.ink, 2), ...[16, 30, 41, 58, 66, 79, 95, 104].map((x) => dot(x, 70, C.ink, 3.6)), arrow(60, 46, 104, 46, HL, 3), arrow(60, 46, 16, 46, HL, 3), line('M16 40 L16 64 M104 40 L104 64', HL, 2)),
  'manm.implikation': all(box(24, 60, 'A'), T(60, 70, '⇒', 30, HL), box(96, 60, 'B')),
  'manm.omvändning': all(greyed(box(24, 32, 'A', C.grey), T(60, 40, '⇒', 22, C.grey), box(96, 32, 'B', C.grey)), box(24, 92, 'B', HL, SOFT), T(60, 100, '⇒', 26, HL), box(96, 92, 'A', HL, SOFT), path('M34 52 C50 66 70 66 86 72', 'none', HL, 2), path('M86 52 C70 66 50 66 34 72', 'none', HL, 2)),
  'manm.axiom': all(...[[30, 20], [58, 20], [16, 44], [44, 44], [72, 44], [30, 68], [58, 68]].map(([x, y]) => rect(x!, y!, 26, 22, C.beige, 2, C.ink, 1.4)), rect(8, 92, 104, 20, HL, 2, C.ink, 2)),
  'manm.direkt-bevis': all(box(18, 86, 'A'), arrow(32, 80, 44, 66, HL, 2.6), rect(46, 50, 28, 20, C.white, 4, C.ink, 1.6), arrow(74, 54, 86, 40, HL, 2.6), box(100, 28, 'B'), rect(94, 96, 12, 12, C.ink, 0)),
  'manm.motsägelsebevis': all(box(22, 30, '¬P'), arrow(38, 38, 54, 56, C.ink, 2.4), rect(52, 56, 24, 18, C.white, 4, C.ink, 1.6), arrow(70, 76, 82, 88, C.ink, 2.4), path('M96 72 L86 92 L96 92 L88 112 L108 86 L98 86 L106 72 Z', HL, C.ink, 1.6)),
  // Diskret matematik och specialområden
  'manm.graf': all(...[[20, 30, 60, 20], [60, 20, 100, 40], [20, 30, 34, 86], [60, 20, 60, 64], [60, 64, 34, 86], [60, 64, 96, 92], [100, 40, 96, 92], [34, 86, 96, 92]].map(([a, b, c, d]) => line(`M${a} ${b} L${c} ${d}`, C.ink, 2.2)),
    ...[[20, 30], [60, 20], [100, 40], [60, 64], [34, 86], [96, 92]].map(([x, y]) => node(x!, y!))),
  'manm.träd': all(path('M60 14 C24 30 6 70 10 100 L110 100 C114 70 96 30 60 14 Z', '#e3f1e6', null), rect(56, 0, 8, 14, C.brown, 1, C.ink, 1.2), ...[[60, 18, 32, 54], [60, 18, 88, 54], [32, 54, 16, 92], [32, 54, 46, 92], [88, 54, 74, 92], [88, 54, 104, 92]].map(([a, b, c, d]) => line(`M${a} ${b} L${c} ${d}`, C.ink, 2.2)), node(60, 18), node(32, 54), node(88, 54), ...[16, 46, 74, 104].map((x) => node(x, 92))),
  'manm.sökning': all(rect(6, 76, 30, 36, C.white, 3, C.ink, 1.4), ...range(4).map((i) => line(`M10 ${84 + i * 7} L32 ${84 + i * 7}`, C.grey2, 1.6)), rect(44, 80, 34, 30, C.beige, 2, C.ink, 1.4), line('M61 80 L61 110', C.ink, 1.2), rect(86, 78, 30, 24, C.dark, 3, C.ink, 1.4), rect(89, 81, 24, 16, C.sky, 1, null), line('M96 106 L106 106', C.ink, 2),
    line('M20 72 C30 50 50 44 58 46', HL, 2, '3 3'), line('M100 74 C96 56 84 48 76 48', HL, 2, '3 3'), waIn('b5-sokning-1', -16, 0, all(circle(62, 34, 20, 'rgba(255,255,255,0.7)', C.ink, 3.4), line('M76 48 L88 60', C.ink, 5))), T(62, 42, '?', 22, HL)),
  'manm.föregående': all(...[3, 4, 5, 6].map((n, i) => all(rect(8 + i * 27, 46, 23, 28, i === 1 ? SOFT : i === 2 ? C.white : C.white, 3, i === 1 ? HL : i === 2 ? C.ink : C.grey2, i === 1 ? 2.6 : i === 2 ? 2.4 : 1.2), T(19.5 + i * 27, 66, String(n), 16, i === 1 ? HL : i >= 2 ? C.ink : GR))),
    path('M74 42 C70 26 52 26 48 40', 'none', HL, 2.4), path('M48 40 l-4 -8 l8 1 Z', HL, null), path('M74 92 L74 80 M70 86 L74 80 L78 86', C.ink, null)),
  'manm.komplexitet': all(axes(14, 104, 8, 114, 8, 110), line('M14 104 L110 70', GR, 2), line(plot((x) => 104 - ((x - 14) * (x - 14)) / 100, 14, 102), HL, 3.4), T(44, 26, 'O(n²)', 16, HL), T(102, 118, 'n', 12)),
  'manm.deformera': all(greyed(circle(36, 60, 24, C.grey2, C.ink, 1.6)), arrow(64, 60, 74, 60, C.ink, 2),
    waGrow('b5-deformera-1', ellipse(94, 60, 22, 13, C.sky, HL, 2.6)), arrow(94, 20, 94, 40, HL, 2.6), arrow(94, 100, 94, 80, HL, 2.6)),
  'manm.kryptografi': all(path('M10 30 L60 38 L110 30 L110 100 L60 108 L10 100 Z', C.white, C.ink, 2), line('M60 38 L60 108', C.ink, 2), rect(22, 54, 26, 22, C.gold, 3, C.ink, 1.6), path('M27 54 L27 47 A8 8 0 0 1 43 47 L43 54', 'none', C.ink, 2.4), circle(35, 63, 2.6, C.ink, null), T(85, 60, 'aᵉ', 14, HL), T(86, 82, 'mod n', 11, HL), circle(28, 90, 4, 'none', C.ink, 1.6), line('M32 90 L46 90 M42 90 L42 94', C.ink, 1.6), rect(4, 22, 112, 92, 'none', 6, HL, 2.4)),
  'manm.chiffer': all(circle(60, 60, 46, C.white, C.ink, 2), circle(60, 60, 30, '#eee6f6', C.ink, 1.6), ...['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((l, i) => { const a = (i / 8) * 2 * Math.PI - Math.PI / 2; return all(T(f1(60 + 38 * Math.cos(a)), f1(64 + 38 * Math.sin(a)), l, 11), T(f1(60 + 22 * Math.cos(a)), f1(63 + 22 * Math.sin(a)), ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'][i]!, 9, HL)); }), line('M60 14 L60 46', HL, 2.4)),
  'manm.öppen-nyckel': all(...[[18, 30], [18, 60], [18, 90]].map(([x, y]) => all(circle(x!, y! - 8, 5, C.skin, C.ink, 1), path(`M${x! - 7} ${y! + 8} Q${x} ${y! - 4} ${x! + 7} ${y! + 8} Z`, C.sky, C.ink, 1))),
    ...[30, 60, 90].map((y) => all(circle(40, y, 5, 'none', HL, 2.4), line(`M45 ${y} L58 ${y} M54 ${y} L54 ${y + 4}`, HL, 2.4))), line('M66 20 L66 100', C.grey2, 1.4, '4 4'),
    circle(96, 52, 7, C.skin, C.ink, 1.2), path('M86 76 Q96 60 106 76 Z', C.mint, C.ink, 1.2), circle(96, 92, 5, 'none', C.dark, 2.4), line('M101 92 L112 92', C.dark, 2.4)),
};
