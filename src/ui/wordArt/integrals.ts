/**
 * Matematik & naturvetenskap → Avancerad matematik → Integraler & differentialekvationer, 3221–3227 (0.49):
 * primitive functions, the definite integral, area under a curve, integration methods, differential
 * equations, initial conditions and modelling change.
 * Recurring signs: ink axes on paper; the part the word names is orange (curve, edge, limit, term, arrow or
 * point) and a grey reference shows what the word is not. Contrast pairs share one layout where only the
 * marked part differs: primitiv funktion/integrera (result panel vs. arrow), integral/undre gräns/övre gräns
 * (whole integral vs. lower or upper limit), underskatta/överskatta (rectangles below vs. above the curve),
 * and allmän lösning/partikulär
 * lösning/begynnelsevillkor (the whole family vs. one curve vs. the starting point).
 * Digits, maths signs and the variable names x, y, t and u only; no words, no brands.
 */
import { C, all, arrow, circle, g, line, path, rect, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const SOFT = 'rgba(228,87,46,0.18)';
const SCREEN = '#d6ead2';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const dot = (x: number, y: number, col: string = C.ink, r = 3.4) => circle(x, y, r, col, C.ink, 1);
/** Axes with arrowheads crossing at (ox, oy). */
const axes = (ox: number, oy: number, x1: number, x2: number, yt: number, yb: number, col: string = C.ink, sw = 2) =>
  all(arrow(x1, oy, x2, oy, col, sw), arrow(ox, yb, ox, yt, col, sw));
/** Polyline through a sampled function y = fn(x) for x in [a, b]. */
const plot = (fn: (x: number) => number, a: number, b: number, n = 40) =>
  range(n + 1).map((i) => { const x = a + ((b - a) * i) / n; return `${i ? 'L' : 'M'}${f1(x)} ${f1(fn(x))}`; }).join(' ');
const box = (x: number, y: number, w: number, h: number, col: string = HL, fill: string = SOFT) => rect(x, y, w, h, fill, 4, col, 2.4);

// ── Shared layouts ───────────────────────────────────────────────────
/** f(x) = 2x on the left, F(x) = x² on the right, an arrow between: 'F' marks the result, 'arrow' the step. */
const primPic = (hl: 'F' | 'arrow') => {
  const left = all(rect(4, 8, 48, 100, C.white, 4, C.grey2, 1.4), T(28, 28, '2x', 16), axes(12, 98, 8, 50, 38, 102, C.ink, 1.6), line('M12 98 L44 46', C.ink, 2.6));
  const rightCol = hl === 'F' ? HL : C.ink;
  const right = all(rect(68, 8, 48, 100, hl === 'F' ? SOFT : C.white, 4, hl === 'F' ? HL : C.grey2, hl === 'F' ? 2.6 : 1.4), T(92, 28, 'x²', 16, rightCol),
    axes(76, 98, 72, 114, 38, 102, C.ink, 1.6), path('M76 98 Q94 98 108 46', 'none', rightCol, hl === 'F' ? 3.4 : 2.6));
  const step = hl === 'arrow' ? all(arrow(50, 62, 72, 62, HL, 4.4), T(61, 52, '∫', 16, HL)) : greyed(arrow(53, 62, 67, 62, C.grey, 2));
  return all(hl === 'F' ? greyed(left) : left, right, step);
};
/** ∫ from 1 to 3 of 2x with its region: 'all' = the whole integral, 'lo'/'hi' = the lower/upper limit. */
const intPic = (hl: 'all' | 'lo' | 'hi') => {
  const c = (k: 'lo' | 'hi') => (hl === 'all' || hl === k ? HL : C.ink);
  const xa = 30, xb = 62, ya = 96, yb = 72;
  const region = path(`M${xa} 108 L${xa} ${ya} L${xb} ${yb} L${xb} 108 Z`, hl === 'all' ? SOFT : '#e4e7eb', hl === 'all' ? HL : null, 2.4);
  return all(
    T(22, 44, '∫', 38, hl === 'all' ? HL : C.ink, 500), T(36, 16, '3', 13, c('hi')), T(10, 58, '1', 13, c('lo')), T(56, 38, '2x', 18, hl === 'all' ? HL : C.ink),
    hl === 'all' ? T(94, 38, '= 8', 18, HL) : '',
    hl === 'lo' ? ring(10, 53, 8) : '', hl === 'hi' ? ring(36, 11, 9) : '',
    region, axes(14, 108, 8, 114, 60, 112, C.ink, 1.8), line('M14 108 L82 57', C.ink, 2.4),
    hl === 'lo' ? all(line(`M${xa} 108 L${xa} ${ya - 4}`, HL, 4), T(xa, 119, '1', 10, HL)) : '',
    hl === 'hi' ? all(line(`M${xb} 108 L${xb} ${yb - 4}`, HL, 4), T(xb, 119, '3', 10, HL)) : '');
};
/** An increasing curve with four rectangles: below the curve ('under') or reaching above it ('over'). */
const sumPic = (k: 'under' | 'over') => {
  const cy = (x: number) => f1(92 - ((x - 14) / 96) ** 2 * 72);
  const rects = [14, 38, 62, 86].map((x) => { const top = cy(k === 'under' ? x : x + 24); return rect(x, top, 24, 106 - top, SOFT, 0, HL, 2); });
  return all(...rects, axes(14, 106, 8, 116, 10, 110, C.ink, 1.8), path(plot(cy, 14, 110), 'none', C.ink, 3),
    rect(8, 10, 34, 28, C.white, 4, C.grey2, 1.2), T(25, 32, k === 'under' ? '<' : '>', 24, HL));
};
/** A family of cooling curves approaching y = 60. */
const coolY = (y0: number) => (x: number) => f1(60 + (y0 - 60) * Math.exp(-(x - 18) / 26));
const STARTS = [16, 32, 46, 76, 92, 104];
const familyFrame = () => all(axes(18, 112, 12, 116, 6, 114, C.ink, 1.8), line('M18 60 L112 60', C.grey2, 1.2, '4 4'));

// ── Small objects ───────────────────────────────────────────────────
const stopwatch = (x: number, y: number, s = 1, hand = -40, face: string = C.white) => g(`translate(${x} ${y}) scale(${s})`,
  rect(-6, -44, 12, 8, C.silver, 2, C.ink, 1.6), rect(-3, -38, 6, 5, C.silver, 0, C.ink, 1.2),
  g('rotate(40)', rect(-4, -42, 8, 7, C.silver, 2, C.ink, 1.4)),
  circle(0, 0, 34, C.orange, C.ink, 2.2), circle(0, 0, 28, face, C.ink, 1.6),
  line(range(12).map((i) => { const a = (i * Math.PI) / 6; return `M${f1(Math.sin(a) * 24)} ${f1(-Math.cos(a) * 24)} L${f1(Math.sin(a) * (i % 3 ? 22 : 19))} ${f1(-Math.cos(a) * (i % 3 ? 22 : 19))}`; }).join(' '), C.ink, 1.4),
  g(`rotate(${hand})`, line('M0 4 L0 -20', C.red, 2.4)), circle(0, 0, 2.6, C.ink, null));
const display = (x: number, y: number, txt: string, col: string) => all(rect(x - 34, y - 15, 68, 26, '#1f2a26', 4, C.ink, 1.8), rect(x - 30, y - 11, 60, 18, SCREEN, 2, null), T(x, y + 4, txt, 15, col, 800));
/** A pencil whose tip is at (x, y). */
const pen = (x: number, y: number, rot = 30, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-2.6 -6 L0 0 L2.6 -6 Z', C.tan, C.ink, 0.9), path('M-1 -2.4 L0 0 L1 -2.4 Z', C.ink, null), rect(-2.6, -28, 5.2, 22, C.yellow, 0.6, C.ink, 1), rect(-2.6, -32, 5.2, 4, C.pink, 0.6, C.ink, 0.9));

export const INTEGRAL_MOTIFS: Record<string, Svg> = {
  // ── 3221 Primitiva funktioner ─────────────────────────────────────
  'intg.polynom': all(
    box(4, 12, 30, 28), box(44, 12, 38, 28), box(92, 12, 24, 28),
    T(19, 33, 'x³', 17, HL), T(63, 33, '2x²', 17, HL), T(104, 33, '5', 17, HL), T(39, 32, '+', 15), T(87, 32, '+', 15),
    axes(20, 100, 10, 114, 50, 112, C.ink, 1.8),
    path(plot((x) => { const u = (x - 60) / 26; return f1(84 - 18 * (u * u * u - 1.6 * u)); }, 26, 100), 'none', HL, 3)),
  'intg.primitiv-funktion': primPic('F'),
  'intg.integrera': all(
    rect(4, 46, 26, 22, C.white, 3, C.ink, 1.4), T(17, 62, '2x', 13),
    arrow(31, 57, 41, 57, HL, 3),
    rect(42, 32, 38, 50, HL, 6, C.ink, 2), T(61, 70, '∫', 34, C.white, 500),
    path('M50 28 C54 18 68 18 72 28', 'none', HL, 2.6), path('M72 28 l-7 -1 l4 -6 Z', HL, HL, 1),
    path('M70 88 C66 98 54 98 50 88', 'none', HL, 2.6), path('M50 88 l7 1 l-4 6 Z', HL, HL, 1),
    arrow(81, 57, 91, 57, HL, 3),
    rect(92, 40, 26, 34, C.white, 3, C.ink, 1.4), T(105, 54, 'x²', 11), line('M97 64 L106 64', HL, 2), pen(106, 64, 25, 0.8),
    greyed(line('M8 108 L112 108', C.grey2, 1.4))),
  'intg.integrationskonstant': all(
    axes(60, 108, 10, 114, 6, 114, C.ink, 1.6),
    greyed(path('M30 66 Q60 126 90 66', 'none', C.grey, 2.4)),
    path('M30 46 Q60 106 90 46', 'none', C.ink, 2.6), path('M30 26 Q60 86 90 26', 'none', C.ink, 2.6),
    arrow(98, 66, 98, 48, HL, 3), arrow(98, 46, 98, 28, HL, 3), T(110, 60, '+2', 11, HL), T(110, 40, '+2', 11, HL),
    dot(60, 96, C.grey, 2.6), dot(60, 76, HL, 3.2), dot(60, 56, HL, 3.2)),
  'intg.integraltecken': all(
    rect(30, 6, 60, 108, SOFT, 10, HL, 2.6), T(60, 96, '∫', 96, HL, 400),
    greyed(T(14, 30, '+', 18, C.grey), T(106, 30, '×', 18, C.grey), T(14, 100, '=', 18, C.grey), T(106, 100, '÷', 18, C.grey))),
  // ── 3222 Bestämd integral ─────────────────────────────────────────
  'intg.integral': intPic('all'),
  'intg.undre-gräns': intPic('lo'),
  'intg.övre-gräns': intPic('hi'),
  'intg.tillryggalagd': all(
    rect(4, 82, 112, 22, '#d9dde2', 0, null), line('M4 82 L116 82 M4 104 L116 104', C.grey, 1.4),
    line('M14 93 L70 93', HL, 5), line('M92 93 L114 93', C.grey, 2, '4 5'),
    line('M14 104 L14 58', C.ink, 2), path('M14 58 L30 63 L14 68 Z', C.green, C.ink, 1.2),
    g('translate(80 96)', path('M-14 -4 L-12 -12 L-6 -14 L-2 -20 L8 -20 L12 -13 L16 -11 L16 -4 Z', C.sky, C.ink, 1.4), circle(-7, -3, 4, C.dark, C.ink, 1), circle(9, -3, 4, C.dark, C.ink, 1)),
    line('M14 46 L70 46', HL, 2), path('M14 46 l6 -4 l0 8 Z M70 46 l-6 -4 l0 8 Z', HL, HL, 1), T(42, 38, '12 km', 13, HL),
    greyed(line('M92 46 L114 46', C.grey, 1.6, '3 3'), T(103, 38, '?', 13, C.grey))),
  'intg.grafräknare': all(
    rect(30, 4, 60, 110, C.dark, 8, C.ink, 2), rect(36, 12, 48, 38, SCREEN, 3, C.ink, 1.4),
    line('M40 44 L80 44 M44 16 L44 48', '#5d6b5a', 1), path(plot((x) => f1(44 - 26 * Math.exp(-(((x - 62) / 10) ** 2))), 40, 80), 'none', HL, 2.4),
    ...range(4).flatMap((r) => range(4).map((c) => rect(38 + c * 12, 58 + r * 13, 9, 9, r === 0 ? C.silver : c === 3 ? C.orange : '#e6e8eb', 2, C.ink, 0.9)))),
  // ── 3223 Area under kurvan ────────────────────────────────────────
  'intg.avgränsa.2': all(
    axes(14, 100, 8, 116, 8, 112, C.ink, 1.8),
    greyed(path('M14 84 C24 70 30 64 34 60', 'none', C.grey, 2.2), path('M90 34 C98 28 104 26 112 24', 'none', C.grey, 2.2)),
    path('M34 100 L34 60 C50 46 70 42 90 34 L90 100 Z', C.paper, HL, 5),
    ...[[34, 100], [34, 80], [34, 60], [52, 50], [72, 42], [90, 34], [90, 56], [90, 78], [90, 100], [52, 100], [72, 100]].map(([x, y]) => rect(x! - 3, y! - 6, 6, 12, C.white, 1, C.ink, 1.4)),
    arrow(62, 82, 62, 104, HL, 2), arrow(62, 70, 62, 48, HL, 2), arrow(48, 76, 36, 76, HL, 2), arrow(76, 76, 88, 76, HL, 2)),
  'intg.underskatta': sumPic('under'),
  'intg.överskatta': sumPic('over'),
  // ── 3224 Integrationsmetoder ──────────────────────────────────────
  'intg.substitution': all(
    T(14, 38, '(', 26), box(20, 16, 62, 30), T(51, 38, '3x + 1', 17, HL), T(88, 38, ')', 26), T(98, 28, '2', 13),
    arrow(51, 50, 51, 74, HL, 3.4),
    box(30, 78, 32, 30), T(46, 100, 'u', 20, HL), T(70, 92, '2', 13),
  ),
  'intg.partiell-integration': all(
    T(14, 42, '∫', 34, C.ink, 500), box(26, 14, 28, 34), T(40, 38, 'x', 20, HL), T(62, 36, '·', 22), box(70, 14, 40, 34),
    path(plot((x) => f1(31 - 9 * Math.sin(((x - 74) / 32) * 2 * Math.PI)), 74, 106), 'none', HL, 2.6),
    arrow(40, 52, 32, 84, HL, 3), arrow(90, 52, 98, 84, HL, 3), T(22, 70, '′', 20, HL), T(108, 70, '∫', 18, HL, 500),
    rect(16, 88, 30, 24, C.white, 4, C.ink, 1.4), T(31, 106, '1', 16), rect(76, 88, 40, 24, C.white, 4, C.ink, 1.4),
    path(plot((x) => f1(100 + 8 * Math.cos(((x - 80) / 32) * 2 * Math.PI)), 80, 112), 'none', C.ink, 2)),
  // ── 3225 Differentialekvationer ───────────────────────────────────
  'intg.proportionell.2': all(
    axes(16, 104, 8, 116, 8, 112, C.ink, 1.8),
    greyed(line('M16 76 L112 52', C.grey, 2)),
    line('M16 104 L110 28.8', HL, 3),
    ...[[1, 2], [2, 4], [4, 8]].map(([a, b]) => { const x = 16 + a! * 20, y = 104 - b! * 8; return all(line(`M${x} 104 L${x} ${y} L16 ${y}`, HL, 1.2, '3 3'), dot(x, y, HL, 3.6), T(x, 116, String(a), 10, HL), T(8, y + 4, String(b), 10, HL)); }),
  ),
  'intg.differentialekvation': all(
    box(6, 8, 108, 34), T(60, 31, 'y′ = 0,5 · y', 15, HL),
    axes(18, 108, 12, 116, 46, 112, C.ink, 1.8),
    path(plot((x) => f1(104 - 6 * Math.exp((x - 18) / 30)), 18, 86), 'none', C.ink, 2.8),
    ...[36, 58, 76].map((x) => { const y = 104 - 6 * Math.exp((x - 18) / 30), k = -(6 / 30) * Math.exp((x - 18) / 30), d = 9 / Math.sqrt(1 + k * k); return line(`M${f1(x - d)} ${f1(y - k * d)} L${f1(x + d)} ${f1(y + k * d)}`, HL, 3); })),
  'intg.riktningsfält': all(
    axes(12, 112, 8, 116, 6, 114, C.ink, 1.6),
    ...range(7).flatMap((i) => range(7).map((j) => {
      const x = 22 + i * 15, y = 14 + j * 15, k = -(y - 60) / 26, d = 5 / Math.sqrt(1 + k * k);
      return line(`M${f1(x - d)} ${f1(y - k * d)} L${f1(x + d)} ${f1(y + k * d)}`, C.ink, 1.6);
    })),
    path(plot(coolY(12), 14, 114), 'none', HL, 3.4)),
  'intg.allmän-lösning': all(familyFrame(), ...STARTS.map((y0) => path(plot(coolY(y0), 18, 114), 'none', HL, 2.6))),
  'intg.partikulär-lösning': all(familyFrame(), greyed(...STARTS.filter((y0) => y0 !== 32).map((y0) => path(plot(coolY(y0), 18, 114), 'none', C.grey, 2))),
    path(plot(coolY(32), 18, 114), 'none', HL, 4)),
  // ── 3226 Begynnelsevillkor ────────────────────────────────────────
  'intg.stoppur': all(stopwatch(60, 70, 1.1), line('M4 112 L116 112', C.grey2, 2)),
  'intg.nollställa': all(
    greyed(display(60, 24, '12:47', C.ink)),
    path('M88 40 C104 52 104 70 88 80', 'none', HL, 3), path('M88 80 l1 -9 l7 5 Z', HL, HL, 1),
    path('M32 40 C16 52 16 70 32 80', 'none', HL, 3), path('M32 80 l-1 -9 l-7 5 Z', HL, HL, 1),
    display(60, 98, '00:00', HL)),
  'intg.begynnelsevillkor': all(familyFrame(), greyed(...STARTS.map((y0) => path(plot(coolY(y0), 18, 114), 'none', C.grey, 1.8))),
    path(plot(coolY(32), 18, 114), 'none', C.ink, 2.4), dot(18, 32, HL, 5), ring(18, 32, 11),
    rect(36, 12, 52, 22, C.white, 4, HL, 2), T(62, 28, 't = 0', 13, HL), line('M36 26 L28 30', HL, 1.8)),
  // ── 3227 Modellering av förändring ────────────────────────────────
  'intg.modellera': all(
    line('M4 112 L60 112', C.grey2, 2),
    line('M14 90 L10 111 M14 90 L19 111', C.ink, 3), path('M8 74 L20 74 L19 92 L9 92 Z', C.green, C.ink, 1.4),
    circle(14, 66, 7, C.skin, C.ink, 1.4), path('M7 64 C7 56 21 56 21 64 C18 61 10 61 7 64 Z', C.hair, null),
    line('M19 76 L26 64', C.skin, 4.4), line('M19 76 L26 64', C.ink, 0.6), line('M9 77 L4 88', C.skin, 4.4),
    line('M28 60 C36 14 52 14 58 108', C.grey, 1.8, '4 4'), circle(28, 60, 4.5, C.orange, C.ink, 1.2),
    arrow(46, 44, 62, 44, HL, 3.4),
    g('rotate(4 90 70)', rect(64, 28, 52, 72, C.white, 2, C.ink, 1.6), line('M70 92 L112 92 M72 94 L72 36', C.ink, 1.4),
      path('M72 90 Q88 30 104 90', 'none', HL, 3), dot(72, 90, HL, 2.6)),
    pen(104, 88, 28, 1)),
  'intg.exponentiell': all(
    axes(16, 106, 10, 116, 4, 112, C.ink, 1.8),
    greyed(line('M16 103 L112 58', C.grey, 2.6)),
    path(plot((x) => f1(106 - 3 * 2 ** ((x - 16) / 16)), 16, 96), 'none', HL, 3.6),
    ...range(4).map((i) => { const x = 48 + i * 16, y = f1(106 - 3 * 2 ** ((x - 16) / 16)); return dot(x, y, HL, 3); }),
    T(62, 98, '×2', 10, HL), T(78, 80, '×2', 10, HL), T(94, 54, '×2', 10, HL)),
  'intg.fördubblingstid': all(
    axes(16, 106, 10, 116, 4, 112, C.ink, 1.8),
    ...[[40, 90], [64, 74], [88, 42]].map(([x, y]) => all(line(`M16 ${y} L${x} ${y} L${x} 106`, C.grey, 1, '3 3'), dot(x!, y!, C.ink, 3))),
    path(plot((x) => f1(106 - 8 * 2 ** ((x - 16) / 24)), 16, 100), 'none', C.ink, 2.8),
    line('M16 106 L40 106', HL, 5), line('M40 106 L64 106', '#f2a487', 5), line('M64 106 L88 106', HL, 5),
    T(28, 118, '10', 9, HL), T(52, 118, '10', 9, HL), T(76, 118, '10', 9, HL),
    T(8, 101, '1', 9), T(8, 93, '2', 9), T(8, 77, '4', 9), T(8, 45, '8', 9)),
};
