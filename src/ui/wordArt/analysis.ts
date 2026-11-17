/**
 * Matematik & naturvetenskap → Avancerad matematik → Analys & derivata, 3211–3217 (0.49): limits,
 * continuity, the meaning of the derivative, differentiation rules, tangents, extreme values and
 * optimisation problems.
 * Recurring signs: a light grid with ink axes; the part that the word names is orange (line, point, ring,
 * segment, sign or arrow) and a grey reference shows what the word is not. Words in a contrast pair or trio
 * (konvergera/divergera, kontinuerlig/språng, slutet/öppet intervall, sekant/derivata, sinus/cosinus,
 * produktregel/kvotregel, tangeringspunkt/normal, maximipunkt/minimipunkt/terrasspunkt) share one layout
 * where only the marked part differs. Digits, maths signs and the variable names x, y, f and g only; no
 * words, no brands.
 */
import { C, all, arrow, circle, ellipse, g, hand, line, path, rect, star, type Svg } from './kit';
import { HL, T, mini } from './people';
import { greyed } from './blindFix';
import { clock } from './time';

// ── Palette and basics ───────────────────────────────────────────────
const BLUE = '#5b9bd5';
const PALE = '#eef3f8';
const GRID = '#dde3ea';
const GREEN = '#4f9d69';
const RED = '#d64545';
const SOFT = 'rgba(228,87,46,0.14)';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const dot = (x: number, y: number, col: string = C.ink, r = 3.4) => circle(x, y, r, col, C.ink, 1);
const hollow = (x: number, y: number, col: string = C.ink, r = 3.6) => circle(x, y, r, C.white, col, 2);
const ok = (x: number, y: number, r = 8) => all(circle(x, y, r, GREEN, C.ink, 1.2), path(`M${x - r * 0.45} ${y} L${x - r * 0.1} ${y + r * 0.35} L${x + r * 0.5} ${y - r * 0.4}`, 'none', C.white, r * 0.24));
const cross = (x: number, y: number, r = 6, col = RED) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 2.4);
const grid = (x1: number, y1: number, x2: number, y2: number, s: number) => line(
  [...range(Math.round((x2 - x1) / s) + 1).map((i) => `M${f1(x1 + i * s)} ${y1} L${f1(x1 + i * s)} ${y2}`), ...range(Math.round((y2 - y1) / s) + 1).map((i) => `M${x1} ${f1(y1 + i * s)} L${x2} ${f1(y1 + i * s)}`)].join(' '), GRID, 0.9);
/** Axes crossing at (ox, oy) with arrowheads and the labels x and y. */
const axes = (ox: number, oy: number, x1: number, x2: number, yt: number, yb: number, labels = true) => all(
  arrow(x1, oy, x2, oy, C.ink, 2), arrow(ox, yb, ox, yt, C.ink, 2),
  labels ? all(T(x2 - 3, oy + 13, 'x', 11, C.ink, 700), T(ox - 9, yt + 8, 'y', 11, C.ink, 700)) : '');
/** First-quadrant system with origin (20, 100). */
const q1 = (labels = true, yt = 8) => all(grid(20, yt + 6, 108, 100, 11), axes(20, 100, 12, 114, yt, 108, labels));
/** Centred system with origin (60, 60). */
const c4 = (labels = true) => all(grid(10, 10, 110, 110, 10), axes(60, 60, 6, 114, 6, 114, labels));
/** Smooth curve through points (Catmull-Rom → cubic Bézier). */
const smooth = (pts: readonly (readonly [number, number])[]) => {
  let d = `M${pts[0]![0]} ${pts[0]![1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]!, p1 = pts[i]!, p2 = pts[i + 1]!, p3 = pts[Math.min(pts.length - 1, i + 2)]!;
    d += ` C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`;
  }
  return d;
};
/** Sample a function on [a, b] into screen points: sx, sy map maths → screen. */
const plot = (fn: (x: number) => number, a: number, b: number, sx: (x: number) => number, sy: (y: number) => number, n = 24) =>
  range(n + 1).map((i) => { const x = a + ((b - a) * i) / n; return [f1(sx(x)), f1(sy(fn(x)))] as const; });
/** Tokens in a row, centred on x; `hl` indices orange. */
const eq = (x: number, y: number, toks: string[], size: number, hl: number[] = [], gap = size * 0.78, base: string = C.ink) => {
  const x0 = x - ((toks.length - 1) * gap) / 2;
  return all(...toks.map((t, i) => T(f1(x0 + i * gap), y, t, size, hl.includes(i) ? HL : base)));
};
const card = (x: number, y: number, w: number, h: number, stroke: string = C.grey2, sw = 1.2, fill: string = C.white) => rect(x, y, w, h, fill, 4, stroke, sw);
/** A pencil whose tip is at (x, y). */
const pen = (x: number, y: number, rot = 30, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-2.6 -6 L0 0 L2.6 -6 Z', C.tan, C.ink, 0.9), path('M-1 -2.4 L0 0 L1 -2.4 Z', C.ink, null), rect(-2.6, -28, 5.2, 22, C.yellow, 0.6, C.ink, 1), rect(-2.6, -32, 5.2, 4, C.pink, 0.6, C.ink, 0.9));
/** A small closed fist holding the pencil (seen from the side). */
const fist = (x: number, y: number) => all(path(`M${x - 9} ${y - 4} C${x - 9} ${y - 12} ${x + 9} ${y - 12} ${x + 9} ${y - 4} L${x + 9} ${y + 4} C${x + 9} ${y + 9} ${x - 9} ${y + 9} ${x - 9} ${y + 4} Z`, C.skin, C.ink, 1.4),
  line(`M${x - 4} ${y - 9} L${x - 4} ${y - 2} M${x + 1} ${y - 10} L${x + 1} ${y - 2} M${x + 6} ${y - 9} L${x + 6} ${y - 2}`, C.skin2, 1.1), path(`M${x + 9} ${y - 2} L${x + 24} ${y - 14} L${x + 26} ${y - 10} L${x + 12} ${y + 4} Z`, C.skin, C.ink, 1.4));
const car = (x: number, y: number, col: string = RED, s = 1) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-22 -6 L-20 -13 L-11 -15 L-5 -23 L10 -23 L16 -15 L22 -13 L23 -6 Z', col, C.ink, 1.5), path('M-3 -21 L1 -15 L12 -15 L8 -21 Z', '#cfe8f7', C.ink, 1), path('M-9 -15 L-5 -21 L-2 -21 L-3 -15 Z', '#cfe8f7', C.ink, 1),
  circle(-12, -5, 5.5, C.dark, C.ink, 1.2), circle(13, -5, 5.5, C.dark, C.ink, 1.2), circle(-12, -5, 2, C.silver, null), circle(13, -5, 2, C.silver, null));
/** Speedometer dial centred at (x, y) with radius r; the needle points at `v` of 0–160. */
const dial = (x: number, y: number, r: number, v: number, needle: string = HL) => {
  const ang = (t: number) => Math.PI * (1.15 - (1.3 * t) / 160);
  const pt = (t: number, rr: number) => [f1(x + Math.cos(ang(t)) * rr), f1(y - Math.sin(ang(t)) * rr)] as const;
  const ticks = range(17).map((i) => { const [ax, ay] = pt(i * 10, r * 0.86), [bx, by] = pt(i * 10, i % 2 ? r * 0.78 : r * 0.7); return `M${ax} ${ay} L${bx} ${by}`; }).join(' ');
  const [nx, ny] = pt(v, r * 0.72);
  return all(circle(x, y, r, C.dark, C.ink, 2), circle(x, y, r - 3, '#1d2128', null), line(ticks, C.white, 1.3),
    ...[0, 40, 80, 120, 160].map((t) => { const [lx, ly] = pt(t, r * 0.5); return T(lx, ly + 3, String(t), r * 0.17, C.white, 700); }),
    line(`M${x} ${y} L${nx} ${ny}`, needle, 3), circle(x, y, 3.4, C.silver, C.ink, 1));
};
const sheep = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M-7 0 L-7 8 M-2 0 L-2 8 M4 0 L4 8 M8 0 L8 8', C.ink, 2),
  path('M-12 -2 C-14 -8 -8 -13 -3 -11 C0 -15 7 -14 9 -10 C14 -10 15 -3 11 0 C10 4 -9 5 -12 -2 Z', C.white, C.ink, 1.4), ellipse(13, -7, 4.5, 3.5, C.dark, C.ink, 1), circle(14, -8, 0.8, C.white, null));

// ── Shared layouts ───────────────────────────────────────────────────
/** Dots of a sequence (n, aₙ) around the grey level y = 56; conv = settle on it, else fly away. */
const seqPic = (conv: boolean) => {
  const pts = conv ? [[22, 26], [32, 80], [42, 40], [52, 68], [62, 49], [72, 61], [82, 54], [92, 57.5], [102, 55.8]] : [[22, 52], [32, 60], [42, 46], [52, 68], [62, 36], [72, 82], [82, 22], [92, 98], [102, 10]];
  return all(grid(14, 8, 110, 104, 12), arrow(14, 104, 114, 104, C.ink, 2), arrow(16, 108, 16, 6, C.ink, 2), line('M16 56 L110 56', C.grey, 2, '5 4'),
    line(smooth(pts as [number, number][]), conv ? HL : HL, 1.4, '2 3'), ...pts.map(([x, y]) => dot(x!, y!, HL, 3.2)),
    conv ? all(ring(104, 56, 8), arrow(80, 72, 98, 60, HL, 2.2)) : all(arrow(92, 92, 104, 108, HL, 2.2), arrow(92, 22, 104, 6, HL, 2.2)));
};
/** y = 1/x-type curve in the first quadrant approaching the level y = L (screen 44). */
const hyper = plot((x) => 1 / x, 0.22, 5.6, (x) => 20 + x * 16, (y) => 44 + y * 12);
/** A cubic with a local maximum at (40, 34) and a local minimum at (84, 78). */
const cubicPts = plot((x) => -(x * x * x) / 3 + x, -2.15, 2.15, (x) => 62 + x * 22, (y) => 56 - y * 33);
const MAXP = [40, 34] as const, MINP = [84, 78] as const;
const extremaPic = (which: 'max' | 'min') => {
  const [ax, ay] = which === 'max' ? MAXP : MINP, [ox, oy] = which === 'max' ? MINP : MAXP;
  return all(grid(10, 10, 110, 110, 10), axes(62, 56, 6, 114, 6, 114, false), path(smooth(cubicPts), 'none', C.ink, 2.8),
    greyed(dot(ox, oy, C.grey, 3)), line(`M${ax - 16} ${ay} L${ax + 16} ${ay}`, HL, 2.6), dot(ax, ay, HL, 4.4), ring(ax, ay, 10),
    which === 'max' ? all(arrow(ax - 22, ay + 26, ax - 12, ay + 10, HL, 2), arrow(ax + 12, ay + 10, ax + 22, ay + 26, HL, 2)) : all(arrow(ax - 22, ay - 26, ax - 12, ay - 10, HL, 2), arrow(ax + 12, ay - 10, ax + 22, ay - 26, HL, 2)));
};
/** A curve with a point P and its tangent (shared by tangeringspunkt and normal). */
const tanBase = (y0: number) => {
  const pts = plot((x) => 0.06 * x * x, 0, 7.4, (x) => 14 + x * 12, (y) => y0 - y * 12);
  return { pts, P: [14 + 4 * 12, f1(y0 - 0.06 * 16 * 12)] as const, k: 0.48 };
};
/** Number line 0–5 with the interval 1–4; closed = filled dots. */
const intervalPic = (closed: boolean) => {
  const X = (t: number) => 14 + t * 19;
  return all(card(8, 10, 104, 32, closed ? HL : HL, 2.4, 'rgba(228,87,46,0.08)'),
    eq(60, 33, closed ? ['1', '≤', 'x', '≤', '4'] : ['1', '<', 'x', '<', '4'], 18, [1, 3], 16),
    arrow(8, 80, 114, 80, C.ink, 2), line(range(6).map((t) => `M${X(t)} 75 L${X(t)} 85`).join(' '), C.ink, 1.6), ...range(6).map((t) => T(X(t), 100, String(t), 11, t === 1 || t === 4 ? HL : C.ink)),
    line(`M${X(1)} 80 L${X(4)} 80`, HL, 6), closed ? all(dot(X(1), 80, HL, 5.4), dot(X(4), 80, HL, 5.4)) : all(hollow(X(1), 80, HL, 5.4), hollow(X(4), 80, HL, 5.4)),
    ring(X(1), 80, 10), ring(X(4), 80, 10));
};
/** Unit circle with the point at 40°; part = which leg is orange; a little wave below. */
const trigPic = (part: 'sin' | 'cos') => {
  const cx = 52, cy = 48, r = 34, a = (40 * Math.PI) / 180, px = f1(cx + r * Math.cos(a)), py = f1(cy - r * Math.sin(a));
  const vert = line(`M${px} ${py} L${px} ${cy}`, part === 'sin' ? HL : C.grey, part === 'sin' ? 4.4 : 1.8), hori = line(`M${cx} ${cy} L${px} ${cy}`, part === 'cos' ? HL : C.grey, part === 'cos' ? 4.4 : 1.8);
  const wave = plot((x) => (part === 'sin' ? Math.sin(x) : Math.cos(x)), 0, 2 * Math.PI, (x) => 22 + x * 13, (y) => 100 - y * 10, 32);
  return all(circle(cx, cy, r, PALE, C.grey, 1.6), arrow(10, cy, 96, cy, C.ink, 1.6), arrow(cx, 90, cx, 8, C.ink, 1.6), line(`M${cx} ${cy} L${px} ${py}`, C.ink, 2),
    path(`M${cx + 9} ${cy} A9 9 0 0 0 ${f1(cx + 9 * Math.cos(a))} ${f1(cy - 9 * Math.sin(a))}`, 'none', C.ink, 1.4), part === 'sin' ? all(hori, vert) : all(vert, hori), dot(px, py, C.ink, 3.4),
    part === 'sin' ? T(px + 11, f1((py + cy) / 2 + 4), '?', 12, HL) : T(f1((cx + px) / 2), cy + 14, '?', 12, HL),
    line('M18 100 L108 100', C.grey2, 1.2), path(smooth(wave), 'none', HL, 2.4), ring(22, part === 'sin' ? 100 : 90, 5));
};
/** "(f ⋆ g)′ = …" with the operator orange. */
const rulePic = (op: 'prod' | 'quot') => all(card(8, 10, 104, 40, HL, 2.4, 'rgba(228,87,46,0.08)'),
  eq(60, 38, ['(', 'f', op === 'prod' ? '·' : '/', 'g', ')', '′'], 22, [2], 13),
  op === 'prod' ? eq(60, 86, ['f′', '·', 'g', '+', 'f', '·', 'g′'], 15, [], 12)
    : all(eq(60, 74, ['f′', '·', 'g', '−', 'f', '·', 'g′'], 14, [], 12), line('M18 81 L102 81', C.ink, 1.8), eq(60, 100, ['g²'], 15)),
  '');

export const ANALYSIS_MOTIFS: Record<string, Svg> = {
  // ── 3211 Gränsvärden ─────────────────────────────────────────────
  'ana.gränsvärde.2': all(card(6, 6, 108, 30, HL, 2.2, 'rgba(228,87,46,0.08)'), T(18, 26, '2,1', 9), T(40, 26, '2,01', 9), T(66, 26, '2,001', 9), arrow(80, 22, 89, 22, HL, 2.2), T(101, 28, '2', 18, HL), ring(101, 22, 10),
    q1(false, 40), line('M20 67 L110 67', C.grey, 1.6, '5 4'), path(smooth(plot((x) => 2 + 1.8 / x, 1.15, 7.8, (x) => 20 + x * 11.5, (y) => 100 - y * 16.5)), 'none', C.ink, 2.6),
    dot(20, 67, HL, 3.6), ring(20, 67, 8), arrow(80, 58, 104, 63, HL, 2)),
  'ana.närma-sig': all(line('M4 112 L116 112', C.grey2, 2), path('M86 112 L86 78 L101 64 L116 78 L116 112 Z', C.beige, C.ink, 1.6), path('M82 80 L101 60 L120 80', 'none', RED, 3), rect(96, 92, 10, 20, C.brown, 1, C.ink, 1.2),
    greyed(g('translate(14 100) scale(1.1)', mini(0, 0, C.grey)), g('translate(40 100) scale(1.1)', mini(0, 0, C.grey))), g('translate(62 100) scale(1.1)', mini(0, 0, C.orange)),
    arrow(18, 70, 36, 70, C.grey, 2.2), arrow(42, 70, 56, 70, C.grey, 2.2), arrow(68, 80, 80, 80, HL, 3), line('M20 64 L20 76 M86 64 L86 76', C.grey, 1)),
  'ana.asymptot': all(q1(false), path(smooth(hyper), 'none', C.ink, 2.6), line('M20 44 L110 44', HL, 3.4, '6 4'), line('M20 104 L20 8', HL, 3.4, '6 4'),
    arrow(96, 34, 96, 41, C.ink, 1.4), arrow(96, 54, 96, 47, C.ink, 1.4), T(103, 38, '∞', 11, C.grey)),
  'ana.konvergera': seqPic(true),
  'ana.divergera': seqPic(false),
  'ana.försumbar': all(line('M10 104 L110 104', C.ink, 1.8), rect(22, 38, 28, 66, BLUE, 1, C.ink, 1.4), rect(70, 38, 28, 66, BLUE, 1, C.ink, 1.4), T(60, 60, '≈', 18), T(36, 76, '100', 11, C.white), T(84, 76, '100,001', 8, C.white),
    rect(70, 36.5, 28, 1.8, HL, 0, null), circle(96, 18, 12, 'rgba(255,255,255,0.9)', C.ink, 2), line('M88 27 L80 35', C.ink, 3.4), rect(88, 16, 16, 5, HL, 0, null), line('M88 21 L104 21', BLUE, 3)),
  'ana.studsa': all(line('M4 108 L116 108', C.grey2, 2), line('M12 20 L22 108 C30 46 46 46 54 108 C60 74 72 74 78 108 C82 90 90 90 94 108 C96 100 102 100 104 108', C.grey, 1.6, '3 3'),
    circle(66, 74, 8, RED, C.ink, 1.6), path('M60 70 C64 66 70 66 73 70', 'none', C.white, 1.6), line('M50 106 l-4 -3 M58 106 l4 -3 M18 106 l-4 -3 M26 106 l4 -3', HL, 1.6)),
  // ── 3212 Kontinuitet ─────────────────────────────────────────────
  'ana.kontinuerlig': all(q1(false), path('M20 90 C36 30 54 30 66 62 S92 92 104 40', 'none', HL, 4), pen(104, 40, 25), ok(36, 24, 8),
    greyed(g('translate(66 4) scale(0.36)', line('M10 100 L50 60', C.grey, 6), line('M50 30 L100 10', C.grey, 6)), cross(108, 14, 5))),
  'ana.lyfta-pennan': all(rect(8, 60, 104, 50, '#fbf6e6', 3, C.grey2, 1.2), path('M14 98 C26 70 40 70 52 86', 'none', C.ink, 2.6), path('M70 76 C84 64 96 70 106 66', 'none', C.ink, 2.6), line('M52 86 L70 76', C.grey, 1.4, '2 4'),
    pen(54, 50, 28), fist(54, 50 - 30), arrow(36, 52, 36, 26, HL, 3), line('M48 94 L56 78', HL, 1.6, '2 2')),
  'ana.språng': all(q1(false), line('M20 82 L64 70', C.ink, 3), dot(64, 70, C.ink, 3.6), line('M64 38 L104 26', C.ink, 3), hollow(64, 38, C.ink, 3.6),
    line('M64 66 L64 42', HL, 3), path('M60 47 L64 41 L68 47 M60 61 L64 67 L68 61', 'none', HL, 2.2), rect(56, 34, 16, 40, 'none', 6, HL, 2)),
  'ana.slutet-intervall': intervalPic(true),
  'ana.öppet-intervall': intervalPic(false),
  'ana.odefinierad': all(rect(26, 6, 68, 104, C.dark, 8, C.ink, 2), rect(32, 12, 56, 34, '#cfe0c4', 3, C.ink, 1.2), T(60, 26, '8 ÷ 0', 11, C.ink, 700), T(74, 42, '?', 16, HL), rect(66, 29, 18, 16, 'none', 3, HL, 2),
    ...range(12).map((i) => rect(34 + (i % 4) * 13, 54 + Math.floor(i / 4) * 16, 10, 11, i === 7 ? HL : C.grey2, 2, C.ink, 0.8)),
    greyed(card(96, 74, 22, 30, C.grey, 1), T(107, 85, '8÷2', 6), T(107, 97, '4', 9))),
  // ── 3213 Derivatans betydelse ───────────────────────────────────
  'ana.hastighetsmätare': all(rect(4, 18, 112, 86, '#4a4d58', 14, C.ink, 2), dial(60, 66, 40, 70), rect(48, 84, 24, 10, '#141a20', 2, null), T(60, 92, '70', 8, '#ff6a3c')),
  'ana.accelerera': all(rect(4, 92, 112, 20, '#9aa3ad', 0, null), line('M8 102 L22 102 M34 102 L48 102 M60 102 L74 102 M86 102 L100 102', C.white, 2),
    greyed(car(16, 92, C.grey, 0.5), car(34, 92, C.grey, 0.6)), car(80, 92, RED, 0.9), line('M48 70 L58 70 M44 78 L58 78 M50 86 L58 86', HL, 2.4),
    arrow(12, 56, 22, 56, HL, 2), arrow(28, 50, 46, 50, HL, 2.6), arrow(54, 42, 86, 42, HL, 3.4), dial(100, 22, 14, 130)),
  'ana.förändringshastighet': all(q1(false), line('M20 92 L106 28', C.ink, 2.6), line('M42 76 L64 76', C.grey, 2.4), line('M64 76 L64 60', HL, 4), T(80, 72, '+3', 13, HL),
    clock(53, 90, 7, 1, 0), rect(4, 14, 10, 50, C.white, 5, C.ink, 1.4), rect(7, 30, 4, 32, RED, 2, null), circle(9, 66, 6, RED, C.ink, 1.4), arrow(30, 32, 30, 16, HL, 2.4)),
  'ana.sekant': all(q1(false), path(smooth(plot((x) => 0.09 * x * x, 0, 7.6, (x) => 20 + x * 11.5, (y) => 100 - y * 12)), 'none', C.ink, 2.6),
    (() => { const ax = 20 + 2 * 11.5, ay = 100 - 0.09 * 4 * 12, bx = 20 + 6 * 11.5, by = 100 - 0.09 * 36 * 12, k = (by - ay) / (bx - ax);
      return all(greyed(line(`M${f1(ax - 18)} ${f1(ay - 18 * (-(0.09 * 4 * 12) / 11.5))} L${f1(ax + 30)} ${f1(ay + 30 * (-(0.09 * 4 * 12) / 11.5))}`, C.grey, 1.6, '3 3')),
        line(`M${f1(ax - 14)} ${f1(ay - 14 * k)} L${f1(bx + 12)} ${f1(by + 12 * k)}`, HL, 3.4), dot(f1(ax), f1(ay), HL, 4), dot(f1(bx), f1(by), HL, 4), ring(f1(ax), f1(ay), 8), ring(f1(bx), f1(by), 8)); })()),
  'ana.derivata': all(card(6, 6, 108, 30, HL, 2.2, 'rgba(228,87,46,0.08)'), eq(60, 28, ['f′', '(', 'x', ')'], 20, [0], 14),
    q1(false, 40), path(smooth(plot((x) => 0.09 * x * x, 0, 7.6, (x) => 20 + x * 11.5, (y) => 100 - y * 7.5)), 'none', C.ink, 2.6),
    (() => { const px = 20 + 5 * 11.5, py = 100 - 0.09 * 25 * 7.5, k = -(0.18 * 5 * 7.5) / 11.5;
      return all(line(`M${f1(px - 30)} ${f1(py - 30 * k)} L${f1(px + 24)} ${f1(py + 24 * k)}`, BLUE, 2.2), line(`M${f1(px - 16)} ${f1(py - 16 * k)} L${f1(px)} ${f1(py - 16 * k)}`, C.grey, 1.8), line(`M${f1(px)} ${f1(py - 16 * k)} L${f1(px)} ${f1(py)}`, HL, 3.6), dot(f1(px), f1(py), HL, 4)); })()),
  // ── 3214 Deriveringsregler ──────────────────────────────────────
  'ana.formelsamling': all(path('M10 24 L58 30 L58 108 L10 102 Z', C.white, C.ink, 1.8), path('M110 24 L62 30 L62 108 L110 102 Z', C.white, C.ink, 1.8), path('M58 30 C59 28 61 28 62 30 L62 108 C61 106 59 106 58 108 Z', C.grey2, C.ink, 1),
    rect(14, 18, 92, 6, BLUE, 2, C.ink, 1), T(34, 46, 'a²+b²=c²', 7), T(34, 62, 'πr²', 9), T(34, 78, 'x² → 2x', 8), T(34, 94, 'k·x+m', 8), T(86, 48, 'sin²+cos²', 6), T(86, 64, '(a+b)²', 8), T(86, 80, 'eˣ → eˣ', 8), T(86, 96, '½·b·h', 8)),
  'ana.derivera': all(card(8, 20, 104, 44, HL, 2.4, 'rgba(228,87,46,0.08)'), T(28, 50, 'x³', 22), arrow(44, 42, 70, 42, HL, 4), T(52, 34, '′', 16, HL), T(92, 50, '3x²', 22, HL),
    greyed(T(28, 98, 'x²', 15, C.grey), arrow(42, 93, 64, 93, C.grey, 2.4), T(90, 98, '2x', 15, C.grey))),
  'ana.exponentialfunktion': all(q1(false), greyed(line('M20 92 L108 60', C.grey, 2, '4 3')), path(smooth(plot((x) => 2 ** x, 0, 6.2, (x) => 20 + x * 14, (y) => 100 - y * 1.25)), 'none', HL, 3.6),
    T(86, 26, '2ˣ', 15, HL), ...[0, 1, 2, 3, 4, 5, 6].map((i) => dot(20 + i * 14, f1(100 - 2 ** i * 1.25), HL, 2.4))),
  'ana.sinus': trigPic('sin'),
  'ana.cosinus': trigPic('cos'),
  'ana.produktregel': rulePic('prod'),
  'ana.kvotregel': rulePic('quot'),
  'ana.kedjeregel': all(g('translate(28 22)', ellipse(0, 0, 13, 8, 'none', HL, 3.4), ellipse(18, 0, 13, 8, 'none', C.grey, 3.4), ellipse(36, 0, 13, 8, 'none', HL, 3.4), ellipse(54, 0, 13, 8, 'none', C.grey, 3.4)),
    rect(10, 42, 100, 30, C.white, 4, C.grey2, 1.2), T(36, 64, '(', 18), rect(42, 48, 36, 20, SOFT, 3, HL, 1.8), T(60, 63, '3x+1', 13), T(84, 64, ')⁵', 18),
    arrow(60, 76, 60, 86, C.ink, 2), T(48, 106, '5(3x+1)⁴', 12), T(92, 106, '· 3', 14, HL), ring(93, 101, 11)),
  // ── 3215 Tangenter och förändring ───────────────────────────────
  'ana.nudda': all(circle(76, 70, 24, '#8cc7e8', C.ink, 2), path('M64 56 C68 52 74 51 78 52', 'none', C.white, 2.4),
    rect(6, 61, 12, 20, C.denim, 2, C.ink, 1.4), hand(34, 71, 1.8), line('M48 62 l4 -3 M48 78 l4 3 M46 70 l4 0', HL, 1.8), ring(51, 70, 4.5)),
  'ana.tangeringspunkt': (() => { const { pts, P, k } = tanBase(96); return all(grid(10, 10, 110, 110, 10), path(smooth(pts), 'none', C.ink, 2.8),
    greyed(line(`M${P[0] - 44} ${f1(P[1] + 44 * k)} L${P[0] + 44} ${f1(P[1] - 44 * k)}`, C.grey, 2.2)), dot(P[0], P[1], HL, 5), ring(P[0], P[1], 11), arrow(P[0] - 22, P[1] - 30, P[0] - 9, P[1] - 12, HL, 2.4)); })(),
  'ana.normal-noun': (() => { const { pts, P, k } = tanBase(96), nk = -1 / k, d = 34 / Math.sqrt(1 + nk * nk);
    return all(grid(10, 10, 110, 110, 10), path(smooth(pts), 'none', C.ink, 2.8), greyed(line(`M${P[0] - 44} ${f1(P[1] + 44 * k)} L${P[0] + 44} ${f1(P[1] - 44 * k)}`, C.grey, 2.2)),
      line(`M${f1(P[0] - d)} ${f1(P[1] - d * nk * -1)} L${f1(P[0] + d)} ${f1(P[1] + d * nk * -1)}`, HL, 3.6),
      (() => { const ux = 1 / Math.sqrt(1 + k * k), uy = -k / Math.sqrt(1 + k * k), vx = -uy, vy = ux, s = 8; return line(`M${f1(P[0] + ux * s)} ${f1(P[1] + uy * s)} L${f1(P[0] + ux * s - vx * s)} ${f1(P[1] + uy * s - vy * s)} L${f1(P[0] - vx * s)} ${f1(P[1] - vy * s)}`, HL, 1.8); })(),
      dot(P[0], P[1], C.ink, 3.4)); })(),
  // ── 3216 Extremvärden ───────────────────────────────────────────
  'ana.extremvärde.2': all(grid(10, 10, 110, 110, 10), axes(20, 56, 12, 114, 6, 114, false), path(smooth(plot((x) => -(x * x * x) / 3 + x, -2.05, 2.15, (x) => 64 + x * 20, (y) => 56 - y * 33)), 'none', C.ink, 2.6),
    line(`M${64 - 20} ${56 - 22} L20 ${56 - 22} M${64 + 20} ${56 + 22} L20 ${56 + 22}`, HL, 1.6, '3 3'), dot(44, 34, HL, 3.6), dot(84, 78, HL, 3.6), line('M14 34 L26 34 M14 78 L26 78', HL, 3.4), ring(20, 34, 8), ring(20, 78, 8)),
  'ana.maximipunkt': extremaPic('max'),
  'ana.minimipunkt': extremaPic('min'),
  'ana.terrasspunkt': all(grid(10, 10, 110, 110, 10), axes(62, 56, 6, 114, 6, 114, false), path(smooth(plot((x) => (x * x * x) / 2.2, -2.1, 2.1, (x) => 62 + x * 22, (y) => 56 - y * 22)), 'none', C.ink, 2.8),
    line('M46 56 L78 56', HL, 2.6), dot(62, 56, HL, 4.4), ring(62, 56, 10), arrow(28, 100, 36, 84, HL, 2), arrow(88, 28, 96, 12, HL, 2)),
  'ana.nollställe': all(c4(false), path(smooth(plot((x) => (x * x - 4) / 1.4, -3, 3, (x) => 60 + x * 16, (y) => 60 - y * 12)), 'none', C.ink, 2.6),
    dot(28, 60, HL, 4.4), dot(92, 60, HL, 4.4), ring(28, 60, 9), ring(92, 60, 9), T(28, 80, '−2', 11, HL), T(92, 80, '2', 11, HL), greyed(dot(60, f1(60 + 4 / 1.4 * 12), C.grey, 2.4))),
  'ana.teckentabell': all(rect(6, 18, 108, 84, C.white, 3, HL, 2.6), line('M6 46 L114 46 M6 74 L114 74 M26 18 L26 102', C.ink, 1.6), line('M56 18 L56 102 M88 18 L88 102', C.grey, 1),
    T(16, 37, 'x', 12, C.ink, 700), T(16, 65, 'f′', 12, C.ink, 700), T(16, 93, 'f', 12, C.ink, 700), T(56, 37, '1', 12), T(88, 37, '3', 12),
    T(40, 65, '+', 15, HL), T(56, 65, '0', 12, HL), T(72, 65, '−', 15, HL), T(88, 65, '0', 12, HL), T(102, 65, '+', 15, HL),
    arrow(33, 96, 47, 82, C.ink, 2), arrow(64, 82, 80, 96, C.ink, 2), arrow(95, 96, 109, 82, C.ink, 2)),
  'ana.andraderivata': all(eq(60, 26, ['f', '→', 'f′', '→', 'f″'], 17, [4], 20), ring(100, 20, 13),
    ...[[20, 'c'], [60, 'p'], [100, 'l']].map(([x, k]) => { const xx = x as number; const box = card(xx - 17, 44, 34, 58, k === 'l' ? HL : C.grey2, k === 'l' ? 2.4 : 1.2);
      const fn = k === 'c' ? (t: number) => (t * t * t) / 3 - t : k === 'p' ? (t: number) => t * t - 1 : (t: number) => 2 * t;
      return all(box, line(`M${xx - 15} 73 L${xx + 15} 73`, C.grey2, 1), path(smooth(plot(fn, -1.8, 1.8, (t) => xx + t * 8, (y) => 73 - y * 6, 12)), 'none', k === 'l' ? HL : C.ink, 2.2)); }),
    arrow(38, 73, 42, 73, C.grey, 1.6), arrow(78, 73, 82, 73, C.grey, 1.6)),
  // ── 3217 Optimeringsproblem ─────────────────────────────────────
  'ana.stängsel': all(rect(0, 0, 120, 112, '#e6f2fa', 0, null), path('M0 76 L120 70 L120 112 L0 112 Z', '#bfe0a6', null), line('M4 112 L116 112', C.grey2, 2),
    sheep(84, 82, 1), ...[12, 40, 68, 96].map((x) => rect(x - 3, 52, 6, 56, C.brown, 1, C.ink, 1.2)),
    line('M8 60 L112 60 M8 72 L112 72 M8 84 L112 84 M8 96 L112 96', C.silver, 1.8), line(range(14).map((i) => `M${8 + i * 8} 60 L${16 + i * 8} 96 M${16 + i * 8} 60 L${8 + i * 8} 96`).join(' '), C.silver, 0.9)),
  'ana.optimal': all(line('M6 108 L114 108', C.grey2, 1.6),
    greyed(rect(10, 34, 10, 70, C.grey2, 1, C.ink, 1.2), rect(28, 50, 18, 54, C.grey2, 1, C.ink, 1.2), rect(88, 80, 26, 24, C.grey2, 1, C.ink, 1.2)),
    rect(52, 66, 32, 38, SOFT, 1, HL, 2.8), star(68, 46, 9, C.yellow), ok(68, 85, 8)),
  'ana.minimera': all(line('M10 104 L112 104', C.ink, 1.8), ...[[22, 60], [44, 44], [66, 28], [88, 12]].map(([x, h], i) => all(rect(x! - 8, 104 - h!, 16, h!, i === 3 ? HL : C.grey2, 1, C.ink, 1.2),
    ...range(Math.max(1, Math.round(h! / 12))).map((j) => ellipse(x!, 100 - j * 12, 7, 2.6, C.gold, C.ink, 0.8)))), arrow(16, 30, 98, 76, HL, 3.4), ring(88, 98, 13)),
  'ana.materialåtgång': all(rect(6, 8, 74, 100, '#d8dde3', 2, C.ink, 1.6), circle(26, 28, 14, C.white, HL, 2.4), circle(58, 28, 14, C.white, HL, 2.4), rect(12, 50, 60, 44, C.white, 1, HL, 2.4),
    line('M18 104 L72 104', C.grey, 1, '2 2'), g('translate(98 72)', rect(-12, -24, 24, 44, C.silver, 1, C.ink, 1.6), ellipse(0, -24, 12, 4, C.white, C.ink, 1.4), ellipse(0, 20, 12, 4, C.silver, C.ink, 1.4)),
    arrow(80, 50, 86, 52, HL, 2)),
};
