/**
 * Matematik & naturvetenskap → Matematikens grunder → Funktioner & grafer, 3141–3147 (0.48): coordinate
 * systems, points and axes, the equation of a straight line, slope and intersection, proportionality,
 * function values and reading graphs.
 * Recurring signs: a light grid with ink axes; the part that the word names is orange (axis, point, ring,
 * segment, digit or arrow) and a grey reference shows what the word is not. Words in a contrast pair
 * (x-axel/y-axel, x-koordinat/y-koordinat, k-värde/m-värde, stigande/fallande, i x-led/i y-led,
 * definitionsmängd/värdemängd, öka/minska, högsta/lägsta värde) share one layout where only the marked
 * part differs. Digits, maths signs and the variable names x and y only; no words, no brands.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL, T, mini } from './people';
import { greyed } from './blindFix';
import { clock } from './time';

// ── Palette and basics ───────────────────────────────────────────────
const BLUE = '#5b9bd5';
const PALE = '#eef3f8';
const GRID = '#dde3ea';
const GREEN = '#4f9d69';
const RED = '#d64545';
const SOFT = 'rgba(228,87,46,0.18)';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const dot = (x: number, y: number, col: string = C.ink, r = 3.4) => circle(x, y, r, col, C.ink, 1);
const ok = (x: number, y: number, r = 8) => all(circle(x, y, r, GREEN, C.ink, 1.2), path(`M${x - r * 0.45} ${y} L${x - r * 0.1} ${y + r * 0.35} L${x + r * 0.5} ${y - r * 0.4}`, 'none', C.white, r * 0.24));
const cross = (x: number, y: number, r = 6, col = RED) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 2.4);
const grid = (x1: number, y1: number, x2: number, y2: number, s: number) => line(
  [...range(Math.round((x2 - x1) / s) + 1).map((i) => `M${f1(x1 + i * s)} ${y1} L${f1(x1 + i * s)} ${y2}`), ...range(Math.round((y2 - y1) / s) + 1).map((i) => `M${x1} ${f1(y1 + i * s)} L${x2} ${f1(y1 + i * s)}`)].join(' '), GRID, 0.9);
type AxOpts = { x1?: number; x2?: number; yt?: number; yb?: number; xc?: string; yc?: string; xw?: number; yw?: number; step?: number; labels?: boolean };
/** Axes crossing at (ox, oy) with arrowheads, small ticks every `step` and the labels x and y. */
const axes = (ox: number, oy: number, o: AxOpts = {}) => {
  const { x1 = 10, x2 = 112, yt = 8, yb = 110, xc = C.ink, yc = C.ink, xw = 2, yw = 2, step = 12, labels = true } = o;
  const tx = range(30).map((i) => ox + (i - 15) * step).filter((x) => x > x1 + 2 && x < x2 - 8 && x !== ox);
  const ty = range(30).map((i) => oy + (i - 15) * step).filter((y) => y > yt + 8 && y < yb - 2 && y !== oy);
  return all(
    arrow(x1, oy, x2, oy, xc, xw), arrow(ox, yb, ox, yt, yc, yw),
    line(tx.map((x) => `M${x} ${oy - 2.5} L${x} ${oy + 2.5}`).join(' '), xc, 1.3),
    line(ty.map((y) => `M${ox - 2.5} ${y} L${ox + 2.5} ${y}`).join(' '), yc, 1.3),
    labels ? all(T(x2 - 3, oy + 13, 'x', 11, xc, 700), T(ox - 9, yt + 8, 'y', 11, yc, 700)) : '',
  );
};
/** First-quadrant system: origin (22, 98), one unit = 12. */
const O = [22, 98] as const;
const P = (i: number, j: number) => [f1(O[0] + i * 12), f1(O[1] - j * 12)] as const;
const q1 = (o: AxOpts = {}) => all(grid(22, 14, 106, 98, 12), axes(O[0], O[1], { x1: 14, x2: 114, yt: 6, yb: 106, ...o }));
/** Centred system: origin (60, 60), one unit = 12. */
const c4 = (o: AxOpts = {}) => all(grid(12, 12, 108, 108, 12), axes(60, 60, { x1: 6, x2: 114, yt: 6, yb: 114, ...o }));
const poly = (pts: readonly (readonly [number, number])[]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
/** A pencil whose tip is at (x, y). */
const pen = (x: number, y: number, rot = 30, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-2.6 -6 L0 0 L2.6 -6 Z', C.tan, C.ink, 0.9), path('M-1 -2.4 L0 0 L1 -2.4 Z', C.ink, null), rect(-2.6, -28, 5.2, 22, C.yellow, 0.6, C.ink, 1), rect(-2.6, -32, 5.2, 4, C.pink, 0.6, C.ink, 0.9));
const ruler = (x: number, y: number, w: number) => all(rect(x, y, w, 11, '#f6e08a', 1, C.ink, 1.2), line(range(Math.floor(w / 6)).map((i) => `M${x + 4 + i * 6} ${y} L${x + 4 + i * 6} ${y + (i % 5 ? 3 : 6)}`).join(' '), C.ink, 0.8));
/** "(a, b)" centred on x; cols colour the two numbers. */
const pair = (x: number, y: number, a: string, b: string, size = 14, ca: string = C.ink, cb: string = C.ink, cp: string = C.ink) => {
  const u = size * 0.55;
  return all(T(x - 2.2 * u, y, '(', size, cp), T(x - 1.15 * u, y, a, size, ca), T(x, y, ',', size, cp), T(x + 1.15 * u, y, b, size, cb), T(x + 2.2 * u, y, ')', size, cp));
};
const label = (x: number, y: number, w: number, h: number) => rect(x - w / 2, y - h / 2, w, h, C.white, 4, C.grey2, 1);
/** Tokens in a row, centred on x; `hl` indices orange. */
const eq = (x: number, y: number, toks: string[], size: number, hl: number[] = [], gap = size * 0.78, base: string = C.ink) => {
  const x0 = x - ((toks.length - 1) * gap) / 2;
  return all(...toks.map((t, i) => T(f1(x0 + i * gap), y, t, size, hl.includes(i) ? HL : base)));
};
const eqX = (x: number, toks: string[], i: number, size: number, gap = size * 0.78) => f1(x - ((toks.length - 1) * gap) / 2 + i * gap);
/** Slope triangle under a line: from (x, y) one unit right (grey) and k units up (orange). */
const coin = (x: number, y: number) => all(ellipse(x, y, 8, 3, C.gold, C.ink, 1), ellipse(x, y - 1.5, 8, 3, '#f2d27a', C.ink, 1));
const weight = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(0, -16, 4, 'none', C.dark, 2.4), path('M-9 0 L-6 -13 L6 -13 L9 0 Z', C.dark, C.ink, 1.2), T(0, -3.5, '1', 9, C.white));
const cab = (x: number, y: number) => g(`translate(${x} ${y})`, path('M-26 -6 L-24 -14 L-14 -16 L-8 -26 L12 -26 L18 -16 L26 -14 L27 -6 Z', C.yellow, C.ink, 1.6), path('M-6 -24 L-2 -17 L10 -17 L8 -24 Z', '#cfe8f7', C.ink, 1), path('M-12 -17 L-8 -24 L-4 -24 L-5 -17 Z', '#cfe8f7', C.ink, 1), rect(-4, -32, 12, 6, C.white, 1, C.ink, 1), line('M-1 -29 L5 -29', C.ink, 1.4, '1.5 1.5'), circle(-14, -5, 6, C.dark, C.ink, 1.2), circle(16, -5, 6, C.dark, C.ink, 1.2), circle(-14, -5, 2.2, C.silver, null), circle(16, -5, 2.2, C.silver, null));
const flagPole = (x: number, y: number, col: string = HL) => all(line(`M${x} ${y} L${x} ${y - 30}`, C.ink, 2), path(`M${x} ${y - 30} L${x + 16} ${y - 25} L${x} ${y - 20} Z`, col, C.ink, 1.2));
/** Equation y = 3x + 1 above a small graph of it; hl = 'k' or 'm'. */
const kmPic = (hl: 'k' | 'm') => {
  const toks = ['y', '=', '3', 'x', '+', '1'], o = [24, 104] as const, u = 7, pt = (i: number, j: number) => [f1(o[0] + i * u), f1(o[1] - j * u)] as const;
  const [ax, ay] = pt(0, 1), [bx, by] = pt(2.85, 9.5), [s1x, s1y] = pt(1, 4), [s2x] = pt(2, 4), [, s3y] = pt(2, 7);
  const kx = eqX(60, toks, 2, 20, 17), mx = eqX(60, toks, 5, 20, 17);
  return all(eq(60, 26, toks, 20, [hl === 'k' ? 2 : 5], 17), ring(hl === 'k' ? kx : mx, 19, 11),
    grid(24, 34, 108, 104, 7), axes(o[0], o[1], { x1: 16, x2: 112, yt: 32, yb: 110, step: 7, labels: false }),
    line(`M${ax} ${ay} L${bx} ${by}`, C.ink, 2.6),
    hl === 'k' ? all(line(`M${s1x} ${s1y} L${s2x} ${s1y}`, C.grey, 2), line(`M${s2x} ${s1y} L${s2x} ${s3y}`, HL, 3.4), T(s2x + 9, f1((s1y + s3y) / 2 + 4), '3', 13, HL))
      : all(dot(ax, ay, HL, 4), ring(ax, ay, 8), T(ax + 14, ay + 4, '1', 13, HL)));
};
const domPic = (axis: 'x' | 'y') => {
  const [ax, ay] = P(1, 2), [bx, by] = P(5, 6.5);
  const curve = `M${ax} ${ay} C${P(2.5, 2)[0]} ${P(2.5, 2)[1]} ${P(3, 6)[0]} ${P(3, 6)[1]} ${bx} ${by}`;
  const xBar = all(line(`M${ax} ${O[1]} L${bx} ${O[1]}`, axis === 'x' ? HL : C.grey, axis === 'x' ? 6 : 3), line(`M${ax} ${O[1] - 6} L${ax} ${O[1] + 6} M${bx} ${O[1] - 6} L${bx} ${O[1] + 6}`, axis === 'x' ? HL : C.grey, 2.4));
  const yBar = all(line(`M${O[0]} ${ay} L${O[0]} ${by}`, axis === 'y' ? HL : C.grey, axis === 'y' ? 6 : 3), line(`M${O[0] - 6} ${ay} L${O[0] + 6} ${ay} M${O[0] - 6} ${by} L${O[0] + 6} ${by}`, axis === 'y' ? HL : C.grey, 2.4));
  const drops = axis === 'x' ? line(`M${ax} ${ay} L${ax} ${O[1]} M${bx} ${by} L${bx} ${O[1]}`, HL, 1.4, '3 3') : line(`M${ax} ${ay} L${O[0]} ${ay} M${bx} ${by} L${O[0]} ${by}`, HL, 1.4, '3 3');
  return all(q1(), path(curve, 'none', C.ink, 2.6), dot(ax, ay), dot(bx, by), drops, axis === 'x' ? all(greyed(yBar), xBar) : all(greyed(xBar), yBar));
};
/** Groups of small figures (counts) along the ground with a trend arrow. */
const crowd = (counts: number[], up: boolean) => {
  const xs = up ? [14, 48, 92] : [28, 72, 106], out: Svg[] = [];
  const spots: Record<number, [number, number][]> = { 1: [[0, 0]], 3: [[-13, 0], [0, 0], [13, 0]], 5: [[-8, -17], [8, -17], [-15, 0], [0, 0], [15, 0]] };
  counts.forEach((n, gi) => spots[n]!.forEach(([dx, dy], i) => out.push(g(`translate(${xs[gi]! + dx} ${100 + dy}) scale(0.78)`, mini(0, 0, [C.orange, BLUE, GREEN, C.purple, C.yellow][i % 5]!)))));
  return all(line('M4 112 L116 112', C.grey2, 2), ...out, up ? arrow(12, 58, 104, 22, HL, 4) : arrow(12, 22, 104, 58, HL, 4));
};
const hillPic = (top: boolean) => {
  const c = top ? 'M22 90 C46 90 48 22 64 22 C80 22 84 90 106 90' : 'M22 26 C46 26 48 92 64 92 C80 92 84 26 106 26';
  const y = top ? 22 : 92;
  return all(q1({ labels: false }), path(c, 'none', C.ink, 2.6), line(`M64 ${y} L22 ${y}`, HL, 1.6, '3 3'), dot(64, y, HL, 4.2), ring(64, y, 9), T(12, y + 4, top ? '9' : '1', 11, HL), greyed(dot(64, top ? 92 : 22, C.grey, 2.4)));
};

export const FUNCTION_MOTIFS: Record<string, Svg> = {
  // ── 3141 Matematiska koordinatsystem ─────────────────────────────
  'funk.vågrät': all(
    greyed(line('M100 14 L100 62', C.grey, 4)),
    line('M8 84 L112 84', HL, 5),
    rect(22, 66, 76, 16, '#f2c14e', 3, C.ink, 1.6), rect(48, 69, 24, 10, '#cdeedd', 5, C.ink, 1.2), ellipse(60, 74, 5, 3, C.white, C.ink, 0.8), line('M53 69 L53 79 M67 69 L67 79', C.ink, 1),
    path('M8 100 C20 96 32 104 44 100 S68 96 80 100 S104 104 112 100', 'none', '#8cc7e8', 2), path('M8 108 C20 104 32 112 44 108 S68 104 80 108 S104 112 112 108', 'none', '#8cc7e8', 2)),
  'funk.x-axel': all(c4({ yc: C.grey, xc: HL, xw: 4 }), ...[1, 2, 3].map((i) => T(60 + i * 12, 75, String(i), 10, HL)), T(36, 75, '−2', 10, HL), T(12, 75, '−4', 10, HL)),
  'funk.y-axel': all(c4({ xc: C.grey, yc: HL, yw: 4 }), ...[1, 2, 3].map((i) => T(49, 60 - i * 12 + 3, String(i), 9, HL)), ...[1, 2, 3].map((i) => T(47, 60 + i * 12 + 3, `−${i}`, 9, HL))),
  'funk.origo': all(c4(), label(88, 40, 34, 18), pair(88, 45, '0', '0', 12, HL, HL, HL), arrow(76, 48, 66, 55, HL, 2), dot(60, 60, HL, 4.2), ring(60, 60, 9)),
  'funk.kvadrant': all(rect(12, 12, 48, 48, '#e9ecef', 0, null), rect(12, 60, 48, 48, '#e9ecef', 0, null), rect(60, 60, 48, 48, '#e9ecef', 0, null), rect(60, 12, 48, 48, SOFT, 0, HL, 2.6), c4(), label(84, 36, 34, 18), pair(84, 41, '+', '+', 12, HL, HL, HL)),
  'funk.rutat-papper': all(
    g('rotate(-7 60 60)', rect(16, 12, 86, 96, C.white, 2, C.ink, 1.8), line([...range(13).map((i) => `M${16 + i * 7} 12 L${16 + i * 7} 108`), ...range(14).map((i) => `M16 ${12 + i * 7} L102 ${12 + i * 7}`)].join(' '), '#9ec9ea', 0.8), rect(16, 12, 86, 96, 'none', 2, C.ink, 1.8)),
    pen(88, 92, 35, 1.1)),
  'funk.rita-upp': all(rect(8, 8, 104, 104, '#fbf6e6', 3, C.grey2, 1.2), arrow(26, 92, 26, 18, C.ink, 2.4), line('M26 84 L72 84', HL, 3), line('M72 84 L106 84', C.grey, 1.6, '3 4'), ruler(18, 88, 90), pen(72, 84, 25), arrow(46, 70, 62, 70, HL, 2.2)),
  'funk.gradera': all(line('M10 70 L110 70', C.ink, 2.4), line([22, 38, 54, 70].map((x) => `M${x} 62 L${x} 78`).join(' '), HL, 3), line('M86 62 L86 70', HL, 3), line('M102 62 L102 78', C.grey, 1.6, '2 3'),
    ...[30, 46, 62].map((x) => all(line(`M${x - 6} 90 L${x + 6} 90`, C.grey, 1.2), path(`M${x - 6} 90 l3 -2 l0 4 Z M${x + 6} 90 l-3 -2 l0 4 Z`, C.grey, null))), pen(86, 62, 20, 1.1)),
  'funk.skala-noun.2': all(arrow(48, 108, 48, 8, C.ink, 2.4), line(range(5).map((i) => `M42 ${100 - i * 20} L54 ${100 - i * 20}`).join(' '), C.ink, 2),
    rect(10, 14, 30, 94, 'rgba(228,87,46,0.10)', 4, HL, 2.2), ...range(5).map((i) => T(25, 105 - i * 20, String(i * 10), 13, HL)),
    path('M60 80 C68 80 68 60 60 60', 'none', HL, 2.2), T(82, 75, '10', 15, HL), path('M60 60 C68 60 68 40 60 40', 'none', C.grey, 1.6), T(80, 55, '10', 11, C.grey)),
  'funk.tvådimensionell': all(rect(22, 30, 60, 60, PALE, 0, null), grid(22, 30, 82, 90, 10), rect(22, 30, 60, 60, 'none', 0, C.ink, 1.6), arrow(22, 90, 98, 90, HL, 4), arrow(22, 90, 22, 14, HL, 4),
    greyed(arrow(70, 14, 112, 14, C.grey, 2.4), path('M92 98 L104 98 L104 110 L92 110 Z M92 98 L97 93 L109 93 L104 98 M104 110 L109 105 L109 93', '#d8dde3', C.ink, 1.2))),
  // ── 3142 Punkter och axlar ───────────────────────────────────────
  'funk.x-koordinat': all(q1(), line(`M${P(5, 4)[0]} ${P(5, 4)[1]} L${P(5, 0)[0]} ${O[1]}`, HL, 2, '3 3'), greyed(line(`M${P(5, 4)[0]} ${P(5, 4)[1]} L${O[0]} ${P(5, 4)[1]}`, C.grey, 1.4, '3 3')), dot(P(5, 4)[0], P(5, 4)[1], C.ink, 4), ring(P(5, 0)[0], O[1], 7), T(P(5, 0)[0], 112, '5', 11, HL), label(46, 26, 46, 20), pair(46, 31, '5', '4', 14, HL, C.grey)),
  'funk.y-koordinat': all(q1(), line(`M${P(5, 4)[0]} ${P(5, 4)[1]} L${O[0]} ${P(5, 4)[1]}`, HL, 2, '3 3'), greyed(line(`M${P(5, 4)[0]} ${P(5, 4)[1]} L${P(5, 0)[0]} ${O[1]}`, C.grey, 1.4, '3 3')), dot(P(5, 4)[0], P(5, 4)[1], C.ink, 4), ring(O[0], P(5, 4)[1], 7), T(12, P(5, 4)[1] + 4, '4', 11, HL), label(70, 26, 46, 20), pair(70, 31, '5', '4', 14, C.grey, HL)),
  'funk.talpar': all(rect(14, 12, 92, 42, 'rgba(228,87,46,0.10)', 6, HL, 2.6), pair(60, 44, '3', '5', 28, HL, HL, HL),
    grid(40, 66, 100, 108, 7), arrow(40, 106, 104, 106, C.ink, 1.6), arrow(42, 110, 42, 64, C.ink, 1.6), line('M63 106 L63 71 L42 71', HL, 1.2, '2 2'), dot(63, 71, HL, 3.4), arrow(60, 56, 62, 66, HL, 2)),
  'funk.pricka-in': all(q1(), greyed(line(`M${P(3, 5)[0]} ${O[1]} L${P(3, 5)[0]} ${P(3, 5)[1]} L${O[0]} ${P(3, 5)[1]}`, C.grey, 1.4, '3 3')), dot(P(3, 5)[0], P(3, 5)[1], HL, 4.4),
    line(`M${P(3, 5)[0] - 10} ${P(3, 5)[1] - 8} l-4 -3 M${P(3, 5)[0] - 12} ${P(3, 5)[1] + 2} l-5 0 M${P(3, 5)[0] - 6} ${P(3, 5)[1] - 12} l-2 -4`, HL, 1.6), pen(P(3, 5)[0], P(3, 5)[1], 30, 1.1)),
  'funk.mittpunkt': all(line('M18 86 L102 34', C.grey, 2.4), dot(18, 86), dot(102, 34), dot(60, 60, HL, 5), ring(60, 60, 10),
    line('M36 70 L42 79 M40 68 L46 77', C.ink, 1.6), line('M75 46 L81 55 M79 44 L85 53', C.ink, 1.6)),
  'funk.spegla': all(arrow(60, 110, 60, 8, C.ink, 2), line('M60 14 L60 106', C.grey, 1, '3 3'),
    greyed(path('M72 40 L72 84 L102 84 Z', '#cfd5db', C.ink, 1.6), dot(72, 40, C.grey, 2.6)),
    path('M48 40 L48 84 L18 84 Z', SOFT, HL, 2.6), dot(48, 40, HL, 3),
    path('M88 30 C80 12 40 12 32 30', 'none', HL, 2.4), path('M32 30 l-1 -8 l7 4 Z', HL, HL, 1)),
  // ── 3143 Räta linjens ekvation ───────────────────────────────────
  'funk.rak': all(line('M12 40 L108 40', HL, 5), ok(104, 22, 8), greyed(path('M12 86 C24 70 34 102 48 86 S72 70 84 86 S100 100 108 86', 'none', C.grey, 4)), cross(108, 104, 6)),
  'funk.dra-en-linje': all(g('rotate(-33.7 60 60)', ruler(10, 63, 100)), line('M24 84 L70 53.3', HL, 3.4), line('M70 53.3 L96 36', C.grey, 1.6, '3 4'), dot(24, 84), dot(96, 36), pen(70, 53.3, 20)),
  'funk.graf': all(q1(), line(poly([P(0, 1), P(1, 3), P(2, 3.5), P(3, 5), P(4, 4.5), P(5, 6), P(6, 6.5)]), HL, 3), ...[[0, 1], [1, 3], [2, 3.5], [3, 5], [4, 4.5], [5, 6], [6, 6.5]].map(([i, j]) => dot(P(i!, j!)[0], P(i!, j!)[1], HL, 2.8))),
  'funk.linjär.2': all(q1(), greyed(path(`M${P(0, 0.5)[0]} ${P(0, 0.5)[1]} C${P(4, 0.5)[0]} ${P(4, 0.5)[1]} ${P(5, 3)[0]} ${P(5, 3)[1]} ${P(5.6, 7.4)[0]} ${P(5.6, 7.4)[1]}`, 'none', C.grey, 2)),
    line(`M${P(0, 1)[0]} ${P(0, 1)[1]} L${P(6.5, 7.5)[0]} ${P(6.5, 7.5)[1]}`, HL, 3.4),
    ...[0, 2, 4].map((i) => line(`M${P(i, i + 1)[0]} ${P(i, i + 1)[1]} L${P(i + 2, i + 1)[0]} ${P(i, i + 1)[1]} L${P(i + 2, i + 3)[0]} ${P(i + 2, i + 3)[1]}`, C.ink, 1.4, '2 2')),
    ...[0, 2, 4, 6].map((i) => dot(P(i, i + 1)[0], P(i, i + 1)[1], HL, 3))),
  'funk.räta-linjens-ekvation': all(rect(8, 8, 104, 34, 'rgba(228,87,46,0.10)', 6, HL, 2.6), eq(60, 33, ['y', '=', '2', 'x', '+', '1'], 20, [0, 1, 2, 3, 4, 5]),
    grid(24, 50, 104, 106, 8), axes(24, 106, { x1: 18, x2: 112, yt: 48, yb: 112, step: 8, labels: false }), line('M24 98 L52 42', HL, 3), ...[0, 1, 2].map((i) => dot(24 + i * 8, 98 - i * 16, HL, 2.6))),
  'funk.k-värde': kmPic('k'),
  'funk.m-värde': kmPic('m'),
  'funk.värdetabell': all(rect(10, 14, 100, 44, C.white, 3, HL, 2.6), line('M10 36 L110 36 M30 14 L30 58', C.ink, 1.6), line('M50 14 L50 58 M70 14 L70 58 M90 14 L90 58', C.grey, 1),
    T(20, 30, 'x', 13, C.ink, 700), T(20, 52, 'y', 13, C.ink, 700), ...[0, 1, 2, 3].map((i) => all(T(40 + i * 20, 30, String(i), 13), T(40 + i * 20, 52, String(2 * i + 1), 13, HL))),
    arrow(60, 62, 60, 72, HL, 2), arrow(30, 108, 108, 108, C.ink, 1.6), arrow(32, 110, 32, 72, C.ink, 1.6), ...[0, 1, 2, 3].map((i) => dot(40 + i * 18, 104 - (2 * i + 1) * 4.2, HL, 3))),
  'funk.stämma': all(eq(50, 46, ['2', '·', '3', '+', '1', '=', '7'], 17, [6], 11), ok(100, 40, 9), greyed(eq(50, 92, ['2', '·', '3', '+', '1', '=', '8'], 13, [], 9)), cross(98, 87, 6)),
  // ── 3144 Lutning och skärning ───────────────────────────────────
  'funk.skillnad': all(line('M10 104 L110 104', C.ink, 1.8), rect(22, 34, 26, 70, BLUE, 1, C.ink, 1.4), rect(70, 64, 26, 40, BLUE, 1, C.ink, 1.4), T(35, 28, '9', 14), T(83, 94, '5', 14, C.white),
    rect(70, 34, 26, 30, SOFT, 1, HL, 2.2, ), line('M50 34 L100 34', C.grey, 1.2, '3 3'), line('M104 36 L104 62', HL, 2.4), path('M100 40 L104 34 L108 40 M100 56 L104 62 L108 56', 'none', HL, 2.2), T(83, 54, '4', 15, HL)),
  'funk.lutning.2': all(q1(), line(`M${P(0, 0.5)[0]} ${P(0, 0.5)[1]} L${P(3.5, 7.5)[0]} ${P(3.5, 7.5)[1]}`, C.ink, 2.8),
    line(`M${P(1, 2.5)[0]} ${P(1, 2.5)[1]} L${P(2, 2.5)[0]} ${P(2, 2.5)[1]}`, C.grey, 2.4), line(`M${P(2, 2.5)[0]} ${P(2, 2.5)[1]} L${P(2, 4.5)[0]} ${P(2, 4.5)[1]}`, HL, 4),
    T(P(1.5, 2.5)[0] + 2, P(1.5, 2.5)[1] + 16, '1', 12, C.grey), T(P(2, 3.5)[0] + 11, P(2, 3.5)[1] + 5, '2', 14, HL),
    path(`M${P(1, 2.5)[0] + 9} ${P(1, 2.5)[1]} A9 9 0 0 0 ${f1(P(1, 2.5)[0] + 9 * Math.cos(1.107))} ${f1(P(1, 2.5)[1] - 9 * Math.sin(1.107))}`, 'none', HL, 2)),
  'funk.stigande': all(q1(), greyed(line(`M${P(0, 6.5)[0]} ${P(0, 6.5)[1]} L${P(6.5, 1)[0]} ${P(6.5, 1)[1]}`, C.grey, 1.6, '4 3')), arrow(P(0, 1)[0], P(0, 1)[1], P(6.5, 7)[0], P(6.5, 7)[1], HL, 4)),
  'funk.fallande': all(q1(), greyed(line(`M${P(0, 1)[0]} ${P(0, 1)[1]} L${P(6.5, 6.5)[0]} ${P(6.5, 6.5)[1]}`, C.grey, 1.6, '4 3')), arrow(P(0, 7)[0], P(0, 7)[1], P(6.5, 1)[0], P(6.5, 1)[1], HL, 4)),
  'funk.i-x-led': all(q1(), dot(P(1, 3)[0], P(1, 3)[1], C.ink, 4), ...[0, 1, 2].map((i) => arrow(P(1 + i * 1.7, 3)[0] + 3, P(1, 3)[1], P(2.7 + i * 1.7, 3)[0] - 1, P(1, 3)[1], HL, 3.4)), greyed(arrow(P(6, 1)[0], P(6, 1)[1], P(6, 6)[0], P(6, 6)[1], C.grey, 2.4))),
  'funk.i-y-led': all(q1(), dot(P(3, 1)[0], P(3, 1)[1], C.ink, 4), ...[0, 1, 2].map((i) => arrow(P(3, 1)[0], P(3, 1 + i * 1.8)[1] - 3, P(3, 1)[0], P(3, 2.8 + i * 1.8)[1] + 1, HL, 3.4)), greyed(arrow(P(0.5, 6.5)[0], P(0.5, 6.5)[1], P(5.5, 6.5)[0], P(5.5, 6.5)[1], C.grey, 2.4))),
  'funk.skära.2': all(line('M14 96 L106 24', HL, 4.4), line('M14 26 L106 94', BLUE, 4.4), line('M60 44 L60 36 M74 52 L82 48 M74 68 L82 72 M60 76 L60 84 M46 68 L38 72 M46 52 L38 48', HL, 2)),
  'funk.skärningspunkt': all(q1(), greyed(line(`M${P(0, 1)[0]} ${P(0, 1)[1]} L${P(6.5, 7.5)[0]} ${P(6.5, 7.5)[1]}`, C.grey, 2.4), line(`M${P(0, 7)[0]} ${P(0, 7)[1]} L${P(6.5, 0.5)[0]} ${P(6.5, 0.5)[1]}`, C.grey, 2.4)),
    dot(P(3, 4)[0], P(3, 4)[1], HL, 4.6), ring(P(3, 4)[0], P(3, 4)[1], 10), label(88, 24, 40, 18), pair(88, 29, '3', '4', 12, HL, HL, HL)),
  'funk.grafiskt': all(label(60, 14, 104, 18), eq(60, 19, ['x', '+', '1', '=', '7', '−', 'x'], 13, [], 10),
    grid(22, 31, 99, 104, 11), axes(22, 104, { x1: 16, x2: 112, yt: 26, yb: 110, step: 11, labels: false }),
    line('M22 93 L88 27', C.ink, 2.2), line('M22 27 L88 93', BLUE, 2.2), line('M55 60 L55 104', HL, 1.8, '3 3'), dot(55, 60, HL, 4), ring(55, 60, 8), ring(55, 104, 6), T(55, 117, '3', 10, HL), pen(64, 56, 40, 0.9)),
  // ── 3145 Proportionalitet ───────────────────────────────────────
  'funk.förhållande.2': all(path('M20 28 L64 28 L60 106 L24 106 Z', '#cfe8f7', C.ink, 2), path('M23.1 90.4 L60.9 90.4 L60 106 L24 106 Z', '#d6455c', null), path('M20 28 L64 28 L60 106 L24 106 Z', 'none', C.ink, 2),
    line(range(4).map((i) => `M${f1(22 + i * 0.2)} ${f1(43.6 + i * 15.6)} l6 0`).join(' '), C.ink, 1.2), path('M70 28 C76 28 76 90 70 90', 'none', C.grey, 1.6), path('M70 91 C74 91 74 105 70 105', 'none', HL, 2), T(84, 64, '4', 14, C.grey), T(80, 103, '1', 14, HL),
    rect(76, 10, 40, 26, C.white, 4, HL, 2.4), T(96, 29, '1:4', 16, HL)),
  'funk.per': all(path('M8 12 L94 12 L110 30 L94 48 L8 48 Z', '#f6e08a', C.ink, 1.8), circle(98, 30, 3, C.white, C.ink, 1), T(30, 39, '30', 22), T(56, 41, '/', 30, HL), weight(78, 42, 1),
    ...[24, 60, 96].map((x) => all(weight(x, 82, 0.9), arrow(x, 86, x, 94, HL, 1.8), coin(x, 104), T(x, 117, '30', 9)))),
  'funk.samband': all(circle(28, 60, 18, PALE, C.ink, 2), circle(92, 60, 18, PALE, C.ink, 2), circle(28, 60, 4, C.ink, null), circle(92, 60, 4, C.ink, null), line('M28 60 L28 46 M92 60 L92 46', C.ink, 2),
    path('M28 40 L92 40 A20 20 0 0 1 92 80 L28 80 A20 20 0 0 1 28 40 Z', 'none', HL, 4), arrow(54, 40, 68, 40, HL, 3), arrow(66, 80, 52, 80, HL, 3), T(28, 106, 'x', 13, C.ink, 700), T(92, 106, 'y', 13, C.ink, 700)),
  'funk.i-takt-med': all(...[0, 1, 2].map((i) => all(...range(i + 1).map((k) => rect(18 + i * 36, 44 - k * 11, 20, 10, BLUE, 2, C.ink, 1.2)), ...range(i + 1).map((k) => coin(28 + i * 36, 104 - k * 6)))),
    arrow(14, 44, 106, 12, HL, 3), arrow(14, 100, 106, 74, HL, 3), line('M8 60 L112 60', C.grey2, 1.2, '3 3')),
  'funk.proportionalitet': all(q1(), line(`M${O[0]} ${O[1]} L${P(3.6, 7.2)[0]} ${P(3.6, 7.2)[1]}`, HL, 3.4), dot(O[0], O[1], HL, 4), ring(O[0], O[1], 8),
    line(`M${P(1, 2)[0]} ${P(1, 2)[1]} L${P(1, 0)[0]} ${O[1]} M${P(2, 4)[0]} ${P(2, 4)[1]} L${P(2, 0)[0]} ${O[1]} M${P(1, 2)[0]} ${P(1, 2)[1]} L${O[0]} ${P(1, 2)[1]} M${P(2, 4)[0]} ${P(2, 4)[1]} L${O[0]} ${P(2, 4)[1]}`, C.grey, 1.2, '3 3'),
    dot(P(1, 2)[0], P(1, 2)[1], HL, 3), dot(P(2, 4)[0], P(2, 4)[1], HL, 3), T(88, 50, '×2', 14, HL), T(88, 70, '×2', 14, HL), greyed(arrow(64, 64, 74, 54, C.grey, 1.4))),
  'funk.proportionalitetskonstant': all(rect(10, 10, 100, 44, C.white, 3, C.ink, 1.6), line('M10 32 L110 32 M30 10 L30 54', C.ink, 1.4), line('M57 10 L57 54 M84 10 L84 54', C.grey, 1),
    T(20, 26, 'x', 12, C.ink, 700), T(20, 48, 'y', 12, C.ink, 700), ...[1, 2, 3].map((i) => all(T(17 + i * 27, 26, String(i), 12), T(17 + i * 27, 48, String(i * 30), 12), T(17 + i * 27, 72, '÷', 13, C.grey), arrow(17 + i * 27, 76, 17 + i * 27, 86, HL, 2))),
    rect(30, 88, 80, 24, 'rgba(228,87,46,0.12)', 4, HL, 2.4), ...[1, 2, 3].map((i) => T(17 + i * 27, 106, '30', 14, HL))),
  'funk.omvänt-proportionell': all(q1(), rect(O[0], P(2, 3)[1], 24, 36, SOFT, 0, null), rect(O[0], P(3, 2)[1], 36, 24, 'rgba(91,155,213,0.18)', 0, null),
    greyed(line(`M${O[0]} ${O[1]} L${P(6, 6)[0]} ${P(6, 6)[1]}`, C.grey, 1.6, '4 3')),
    path(`M${P(0.85, 7)[0]} ${P(0.85, 7)[1]} C${P(1.4, 3.2)[0]} ${P(1.4, 3.2)[1]} ${P(2.6, 2)[0]} ${P(2.6, 2)[1]} ${P(6.8, 0.9)[0]} ${P(6.8, 0.9)[1]}`, 'none', HL, 3.4),
    ...[[1, 6], [2, 3], [3, 2], [6, 1]].map(([i, j]) => dot(P(i!, j!)[0], P(i!, j!)[1], HL, 3))),
  // ── 3146 Funktionsvärden ────────────────────────────────────────
  'funk.bero-på.2': all(rect(14, 26, 10, 76, PALE, 4, C.ink, 1.6), rect(8, 46, 22, 10, HL, 3, C.ink, 1.4), arrow(19, 40, 19, 30, HL, 2.4), T(19, 116, 'x', 12, C.ink, 700),
    path('M58 90 A30 30 0 0 1 118 90', PALE, C.ink, 2), line('M64 90 L112 90', C.ink, 1.4), line(range(7).map((i) => { const a = Math.PI - (i / 6) * Math.PI; return `M${f1(88 + Math.cos(a) * 26)} ${f1(90 - Math.sin(a) * 26)} L${f1(88 + Math.cos(a) * 21)} ${f1(90 - Math.sin(a) * 21)}`; }).join(' '), C.ink, 1.2),
    line(`M88 90 L${f1(88 + Math.cos(0.9) * 22)} ${f1(90 - Math.sin(0.9) * 22)}`, HL, 3), circle(88, 90, 3.4, C.ink, null), T(88, 110, 'y', 12, C.ink, 700), path('M32 50 C48 40 58 50 66 66', 'none', HL, 2.6), path('M66 66 l-7 -2 l5 -5 Z', HL, HL, 1)),
  'funk.funktion.2': all(ellipse(28, 60, 16, 40, PALE, C.ink, 2), ellipse(92, 60, 16, 40, PALE, C.ink, 2), ...[1, 2, 3].map((i, k) => all(T(28, 38 + k * 26, String(i), 15), T(92, 38 + k * 26, String(2 * i + 1), 15, HL), arrow(38, 33 + k * 26, 80, 33 + k * 26, HL, 2.6))), T(28, 114, 'x', 12, C.ink, 700), T(92, 114, 'y', 12, C.ink, 700)),
  'funk.funktionsmaskin': all(path('M44 22 L76 22 L68 36 L52 36 Z', C.silver, C.ink, 1.6), rect(26, 36, 68, 50, '#5b7fb5', 6, C.ink, 2), rect(36, 48, 48, 22, C.white, 3, C.ink, 1.2), T(60, 64, '×2 +1', 13), circle(32, 92, 6, C.grey, C.ink, 1.2), circle(88, 92, 6, C.grey, C.ink, 1.2), rect(94, 70, 14, 10, C.silver, 1, C.ink, 1.4),
    rect(50, 2, 20, 16, C.white, 3, C.ink, 1.4), T(60, 15, '3', 13), arrow(60, 18, 60, 30, C.grey, 2), rect(94, 90, 22, 20, C.white, 3, HL, 2.4), T(105, 105, '7', 15, HL), arrow(102, 80, 104, 88, HL, 2), line('M8 104 L90 104', C.grey2, 2)),
  'funk.funktionsvärde': all(q1(), line(`M${P(0, 1)[0]} ${P(0, 1)[1]} L${P(3.2, 7.4)[0]} ${P(3.2, 7.4)[1]}`, C.ink, 2.6), line(`M${P(2, 5)[0]} ${P(2, 5)[1]} L${P(2, 0)[0]} ${O[1]}`, C.grey, 1.4, '3 3'), line(`M${P(2, 5)[0]} ${P(2, 5)[1]} L${O[0]} ${P(2, 5)[1]}`, HL, 2, '3 3'),
    dot(P(2, 5)[0], P(2, 5)[1], HL, 4), ring(O[0], P(2, 5)[1], 7), T(12, P(2, 5)[1] + 4, '5', 11, HL), T(P(2, 0)[0], 112, '2', 11, C.grey), label(88, 76, 44, 22), T(79, 81, 'f(2) =', 11), T(102, 82, '5', 15, HL), ring(102, 77, 8)),
  'funk.definitionsmängd': domPic('x'),
  'funk.värdemängd': domPic('y'),
  'funk.startavgift': all(rect(4, 96, 112, 16, '#9aa3ad', 0, null), line('M8 104 L28 104 M44 104 L64 104 M80 104 L100 104', C.white, 2), flagPole(16, 96), cab(56, 96), T(16, 109, '0', 9, C.white),
    rect(78, 14, 36, 26, C.white, 4, HL, 2.6), T(96, 33, '50', 18, HL), arrow(88, 42, 76, 58, HL, 2.2)),
  'funk.taxameter': all(path('M6 86 C30 76 90 76 114 86 L114 112 L6 112 Z', '#4a4d58', C.ink, 1.6), rect(18, 30, 84, 54, C.dark, 6, C.ink, 2), rect(26, 38, 68, 26, '#141a20', 3, C.ink, 1.2), T(60, 59, '125', 22, '#ff6a3c'),
    ...[36, 52, 68, 84].map((x) => circle(x, 74, 3.6, [RED, GREEN, C.yellow, C.grey2][(x - 36) / 16]!, C.ink, 1)), greyed(rect(42, 8, 36, 12, C.yellow, 3, C.ink, 1.2), line('M46 14 L74 14', C.ink, 2, '3 3'))),
  // ── 3147 Tolka grafer ───────────────────────────────────────────
  'funk.öka': crowd([1, 3, 5], true),
  'funk.minska': crowd([5, 3, 1], false),
  'funk.kurva': all(q1({ labels: false }), greyed(line(`M${P(0, 1)[0]} ${P(0, 1)[1]} L${P(7, 5)[0]} ${P(7, 5)[1]}`, C.grey, 1.6, '4 3')), path('M22 86 C36 20 56 18 66 52 S92 92 106 30', 'none', HL, 3.6)),
  'funk.tidsaxel': all(grid(22, 14, 106, 74, 12), arrow(22, 80, 22, 8, C.grey, 2), arrow(14, 74, 114, 74, HL, 4), line([30, 62, 94].map((x) => `M${x} 70 L${x} 78`).join(' '), HL, 2.4),
    clock(30, 96, 9, 8, 0), clock(62, 96, 9, 12, 0), clock(94, 96, 9, 4, 0), greyed(path('M22 60 C40 54 60 40 100 30', 'none', C.grey, 2))),
  'funk.plana-ut': all(q1({ labels: false }), path('M22 96 C34 50 48 32 66 28', 'none', C.ink, 2.6), line('M66 28 L108 27', HL, 4), arrow(70, 42, 104, 42, HL, 2.4), arrow(104, 42, 70, 42, HL, 2.4), greyed(line('M66 28 L96 4', C.grey, 1.4, '3 3'))),
  'funk.högsta-värde': hillPic(true),
  'funk.lägsta-värde': hillPic(false),
  'funk.förlopp': all(flagPole(14, 104, GREEN), line(poly([[18, 92], [40, 52], [62, 76], [84, 38], [104, 48]]), C.ink, 2.4),
    ...[[18, 92, 40, 52], [40, 52, 62, 76], [62, 76, 84, 38], [84, 38, 104, 48]].map(([a, b, c, d]) => arrow(f1(a! + (c! - a!) * 0.3), f1(b! + (d! - b!) * 0.3), f1(a! + (c! - a!) * 0.72), f1(b! + (d! - b!) * 0.72), HL, 2.6)),
    ...[[18, 92], [40, 52], [62, 76], [84, 38], [104, 48]].map(([x, y], i) => all(circle(x!, y!, 7, C.white, HL, 2), T(x!, y! + 4, String(i + 1), 9, HL))), path('M104 41 L104 14 L116 18 L104 22', 'none', C.ink, 1.6)),
  'funk.feberkurva': all(rect(14, 10, 100, 96, C.white, 3, C.ink, 1.6), grid(26, 18, 110, 94, 12), line('M26 58 L110 58', C.grey, 1.4, '4 3'), T(19, 34, '39', 8), T(19, 62, '37', 8),
    line(poly([[32, 62], [44, 40], [56, 28], [68, 36], [80, 50], [92, 46], [104, 60]]), RED, 3), ...[[32, 62], [44, 40], [56, 28], [68, 36], [80, 50], [92, 46], [104, 60]].map(([x, y]) => dot(x!, y!, RED, 2.6)),
    rect(4, 70, 8, 34, C.white, 4, C.ink, 1.4), rect(6, 80, 4, 22, RED, 2, null), circle(8, 104, 5, RED, C.ink, 1.4)),
};
