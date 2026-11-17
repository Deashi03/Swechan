/**
 * Matematik & naturvetenskap → Matematikens grunder → Geometrins grundformer, 3131–3137 (0.48): points and
 * lines, angles, triangles, quadrilaterals and polygons, circles, perimeter and area, volume and solids.
 * Digits, ° and π may appear; no picture contains a word or a letter that names its word. Close pairs
 * (vinkelspets/vinkelben, katet/hypotenusa, kongruent/likformig, basyta/sidoyta …)
 * share one layout where only the highlighted part differs; the grey parts are the reference.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL, T, arm } from './people';
import { greyed } from './blindFix';

// ── Palette and small helpers ────────────────────────────────────────
const SOFT = '#f4f6f8';
const PAPER = '#fbf6e6';
const FILL = '#f9c9a6';
const REF = C.grey2;
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const rad = (d: number) => (d * Math.PI) / 180;
const bg = (col: string = SOFT) => rect(4, 4, 112, 108, col, 3, null);
const ground = line('M4 112 L116 112', C.grey2, 2);
const num = (x: number, y: number, s: string, size = 11, col: string = C.ink) => T(x, y, s, size, col);
/** Point at angle d (degrees, counter-clockwise, 0 = right) and distance r from (cx, cy). */
const P = (cx: number, cy: number, r: number, d: number): [number, number] => [f1(cx + r * Math.cos(rad(d))), f1(cy - r * Math.sin(rad(d)))];
const pts = (p: [number, number][]) => p.map(([x, y]) => `${x} ${y}`).join(' L');
const poly = (p: [number, number][], fill: string, stroke: string | null = C.ink, sw = 2) => path(`M${pts(p)} Z`, fill, stroke, sw);
const seg = (a: [number, number], b: [number, number], col: string = C.ink, sw = 2.2, dash?: string) => line(`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`, col, sw, dash);
const dot = (x: number, y: number, r = 3.2, col: string = C.ink) => circle(x, y, r, col, null);
const ring = (x: number, y: number, r = 8) => circle(x, y, r, 'none', HL, 2.4);
const bigDot = (x: number, y: number) => all(ring(x, y, 9), dot(x, y, 4.4, HL));
/** Arrowhead at b pointing away from a. */
const head = (a: [number, number], b: [number, number], col: string = C.ink, s = 6) => {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), l = (d: number) => [f1(b[0] - s * Math.cos(ang + d)), f1(b[1] - s * Math.sin(ang + d))];
  const [x1, y1] = l(0.45), [x2, y2] = l(-0.45);
  return path(`M${b[0]} ${b[1]} L${x1} ${y1} L${x2} ${y2} Z`, col, null);
};
/** Line with arrowheads at both ends (goes on without end). */
const infLine = (a: [number, number], b: [number, number], col: string = C.ink, sw = 2.6) => all(seg(a, b, col, sw), head(b, a, col, 4 + sw * 1.6), head(a, b, col, 4 + sw * 1.6));
/** Arc from angle a1 to a2 (counter-clockwise). */
const arcD = (cx: number, cy: number, r: number, a1: number, a2: number) => { const [x1, y1] = P(cx, cy, r, a1), [x2, y2] = P(cx, cy, r, a2); return `M${x1} ${y1} A${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 0 ${x2} ${y2}`; };
const arc = (cx: number, cy: number, r: number, a1: number, a2: number, col: string = HL, sw = 2.4) => line(arcD(cx, cy, r, a1, a2), col, sw);
const wedge = (cx: number, cy: number, r: number, a1: number, a2: number, fill: string = FILL, stroke: string | null = null) => path(`M${cx} ${cy} L${arcD(cx, cy, r, a1, a2).slice(1)} Z`, fill, stroke, 1.6);
/** Small right-angle square at corner c between directions d1 and d2 (degrees). */
const rightMark = (c: [number, number], d1: number, d2: number, s = 9, col: string = C.ink) => { const a = P(c[0], c[1], s, d1), b = P(c[0], c[1], s, d2), m: [number, number] = [f1(a[0] + b[0] - c[0]), f1(a[1] + b[1] - c[1])]; return line(`M${a[0]} ${a[1]} L${m[0]} ${m[1]} L${b[0]} ${b[1]}`, col, 1.6); };
/** Equal-length tick marks (n strokes) across the middle of segment a–b. */
const ticks = (a: [number, number], b: [number, number], n = 1, col: string = HL) => {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, ang = Math.atan2(b[1] - a[1], b[0] - a[0]), ux = Math.cos(ang), uy = Math.sin(ang), out: Svg[] = [];
  for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * 4, x = mx + ux * o, y = my + uy * o; out.push(line(`M${f1(x - uy * 5)} ${f1(y + ux * 5)} L${f1(x + uy * 5)} ${f1(y - ux * 5)}`, col, 2)); }
  return all(...out);
};
/** Parallel-arrow mark (">") on the middle of a–b. */
const parMark = (a: [number, number], b: [number, number], n = 1, col: string = HL) => { const out: Svg[] = []; for (let i = 0; i < n; i++) { const t = 0.5 + (i - (n - 1) / 2) * 0.07, m: [number, number] = [f1(a[0] + (b[0] - a[0]) * t), f1(a[1] + (b[1] - a[1]) * t)], ang = Math.atan2(b[1] - a[1], b[0] - a[0]), p1 = [f1(m[0] - 6 * Math.cos(ang - 0.6)), f1(m[1] - 6 * Math.sin(ang - 0.6))], p2 = [f1(m[0] - 6 * Math.cos(ang + 0.6)), f1(m[1] - 6 * Math.sin(ang + 0.6))]; out.push(line(`M${p1[0]} ${p1[1]} L${m[0]} ${m[1]} L${p2[0]} ${p2[1]}`, col, 2.2)); } return all(...out); };
const reg = (cx: number, cy: number, r: number, n: number, start = 90): [number, number][] => range(n).map((i) => P(cx, cy, r, start + (i * 360) / n));
const check = (x: number, y: number, s = 1, col: string = C.green) => line(`M${x - 6 * s} ${y} L${x - 2 * s} ${y + 5 * s} L${x + 7 * s} ${y - 6 * s}`, col, 3 * s);
const cross = (x: number, y: number, s = 1, col: string = C.red) => line(`M${x - 5 * s} ${y - 5 * s} L${x + 5 * s} ${y + 5 * s} M${x + 5 * s} ${y - 5 * s} L${x - 5 * s} ${y + 5 * s}`, col, 3 * s);
const hnd = (x: number, y: number, r = 4) => circle(x, y, r, C.skin, C.ink, 1.2);
const pencil = (x: number, y: number, rot = -35, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-3, -26, 6, 22, C.yellow, 0.5, C.ink, 1), path('M-3 -4 L3 -4 L0 3 Z', C.tan, C.ink, 0.8), rect(-3, -30, 6, 4, C.pink, 0.5, C.ink, 0.8));
const ruler = (x: number, y: number, w: number, rot = 0, h = 12) => g(`translate(${x} ${y}) rotate(${rot})`, rect(0, 0, w, h, '#f3dc8a', 1.5, C.ink, 1.2), ...range(Math.floor(w / 6) + 1).map((i) => line(`M${i * 6 + 2} 0 L${i * 6 + 2} ${i % 5 === 0 ? 6 : 3.5}`, C.ink, 0.8)));
const sheet = (x: number, y: number, w: number, h: number) => rect(x, y, w, h, PAPER, 2, C.ink, 1.4);
/** Generic angle: vertex v, legs at directions d1 and d2. */
const angle = (v: [number, number], d1: number, d2: number, len = 46, legCol: string = C.ink, sw = 3) => all(seg(v, P(v[0], v[1], len, d1), legCol, sw), seg(v, P(v[0], v[1], len, d2), legCol, sw));
/** One angle type on the shared layout: vertex (40, 84), first leg to the right. */
const AV: [number, number] = [36, 86];
const angType = (deg: number, label: string, ref = true) => { const AV: [number, number] = deg > 90 ? [62, 86] : [36, 86], len = deg > 90 ? 50 : 66; return all(bg(),
  ref && deg !== 90 ? seg(AV, P(AV[0], AV[1], 40, 90), REF, 1.8, '4 3') : '',
  wedge(AV[0], AV[1], 22, 0, deg, FILL), arc(AV[0], AV[1], 22, 0, deg, HL, 2.6),
  angle(AV, 0, deg, len), deg === 90 ? rightMark(AV, 0, 90, 10, HL) : '', dot(AV[0], AV[1], 3.4),
  num(deg > 120 ? 92 : 86, deg > 120 ? 40 : 46, label, 15, HL)); };

// ── Solids (oblique projection: depth goes up and right) ─────────────
type Pt = [number, number];
const DX = 0.55, DY = -0.42;
/** Box with front lower-left corner (x, y), width w, height h, depth d. hl: face(s) to highlight. */
const box = (x: number, y: number, w: number, h: number, d: number, col: string, o: { hl?: ('front' | 'top' | 'side' | 'bottom')[]; edge?: boolean; ghost?: boolean } = {}) => {
  const ox = d * DX, oy = d * DY, F = (f: string, base: string) => (o.hl?.includes(f as 'front') ? FILL : base);
  const front: Pt[] = [[x, y], [x + w, y], [x + w, y - h], [x, y - h]];
  const top: Pt[] = [[x, y - h], [x + w, y - h], [f1(x + w + ox), f1(y - h + oy)], [f1(x + ox), f1(y - h + oy)]];
  const side: Pt[] = [[x + w, y], [f1(x + w + ox), f1(y + oy)], [f1(x + w + ox), f1(y - h + oy)], [x + w, y - h]];
  const bottom: Pt[] = [[x, y], [x + w, y], [f1(x + w + ox), f1(y + oy)], [f1(x + ox), f1(y + oy)]];
  const out: Svg[] = [];
  if (o.ghost || o.hl?.includes('bottom')) out.push(poly(bottom, o.hl?.includes('bottom') ? FILL : 'none', null), line(`M${x} ${y} L${f1(x + ox)} ${f1(y + oy)} L${f1(x + w + ox)} ${f1(y + oy)} M${f1(x + ox)} ${f1(y + oy)} L${f1(x + ox)} ${f1(y - h + oy)}`, C.grey, 1.2, '3 2'));
  out.push(poly(side, o.ghost ? 'rgba(255,255,255,0.15)' : F('side', shade(col, -0.18)), o.hl?.includes('side') ? HL : C.ink, o.hl?.includes('side') ? 2.6 : 1.6));
  out.push(poly(top, o.ghost ? 'rgba(255,255,255,0.15)' : F('top', shade(col, 0.22)), o.hl?.includes('top') ? HL : C.ink, o.hl?.includes('top') ? 2.6 : 1.6));
  out.push(poly(front, o.ghost ? 'rgba(255,255,255,0.15)' : F('front', col), o.hl?.includes('front') ? HL : C.ink, o.hl?.includes('front') ? 2.6 : 1.6));
  if (o.hl?.includes('bottom')) out.push(line(`M${x} ${y} L${x + w} ${y} L${f1(x + w + ox)} ${f1(y + oy)}`, HL, 2.6), line(`M${x} ${y} L${f1(x + ox)} ${f1(y + oy)} L${f1(x + w + ox)} ${f1(y + oy)}`, HL, 2.2, '3 2'));
  return all(...out);
};
/** Lighten (t > 0) or darken (t < 0) a #rrggbb colour. */
function shade(hex: string, t: number) {
  const n = parseInt(hex.slice(1), 16), c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(t > 0 ? v + (255 - v) * t : v * (1 + t)));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
const cyl = (cx: number, by: number, rx: number, h: number, col: string, o: { bottomHl?: boolean; topHl?: boolean } = {}) => {
  const ry = f1(rx * 0.32);
  return all(
    o.bottomHl ? ellipse(cx, by, rx, ry, FILL, HL, 2.4) : '',
    path(`M${cx - rx} ${by - h} L${cx - rx} ${by} A${rx} ${ry} 0 0 0 ${cx + rx} ${by} L${cx + rx} ${by - h} Z`, col, C.ink, 1.8),
    o.bottomHl ? line(`M${cx - rx} ${by} A${rx} ${ry} 0 0 0 ${cx + rx} ${by}`, HL, 2.6) : '',
    o.bottomHl ? line(`M${cx - rx} ${by} A${rx} ${ry} 0 0 1 ${cx + rx} ${by}`, HL, 1.8, '3 2') : line(`M${cx - rx} ${by} A${rx} ${ry} 0 0 1 ${cx + rx} ${by}`, C.grey, 1.1, '3 2'),
    ellipse(cx, by - h, rx, ry, o.topHl ? FILL : shade(col, 0.25), o.topHl ? HL : C.ink, 1.8),
    path(`M${cx - rx * 0.6} ${by - h + ry + 4} L${cx - rx * 0.6} ${by - 2}`, 'none', 'rgba(255,255,255,0.55)', 3));
};
const cone = (cx: number, by: number, rx: number, h: number, col: string) => { const ry = f1(rx * 0.32); return all(line(`M${cx - rx} ${by} A${rx} ${ry} 0 0 1 ${cx + rx} ${by}`, C.grey, 1.1, '3 2'), path(`M${cx - rx} ${by} A${rx} ${ry} 0 0 0 ${cx + rx} ${by} L${cx} ${by - h} Z`, col, C.ink, 1.8), line(`M${cx - rx * 0.45} ${by - 4} L${cx - 3} ${by - h + 12}`, 'rgba(255,255,255,0.55)', 3)); };
const sphere = (cx: number, cy: number, r: number, col: string) => all(circle(cx, cy, r, col, C.ink, 1.8), line(`M${cx - r} ${cy} A${r} ${f1(r * 0.3)} 0 0 0 ${cx + r} ${cy}`, shade(col, -0.3), 1.2), line(`M${cx - r} ${cy} A${r} ${f1(r * 0.3)} 0 0 1 ${cx + r} ${cy}`, shade(col, -0.3), 1, '3 2'), ellipse(f1(cx - r * 0.35), f1(cy - r * 0.4), f1(r * 0.28), f1(r * 0.18), 'rgba(255,255,255,0.6)', null));
/** Square pyramid: base front-left (x, y), base width w, depth d, height h. */
const pyr = (x: number, y: number, w: number, d: number, h: number, col: string, hlSide = false) => {
  const ox = d * DX, oy = d * DY, apex: Pt = [f1(x + w / 2 + ox / 2), f1(y + oy / 2 - h)];
  return all(line(`M${x} ${y} L${f1(x + ox)} ${f1(y + oy)} L${f1(x + w + ox)} ${f1(y + oy)} M${f1(x + ox)} ${f1(y + oy)} L${apex[0]} ${apex[1]}`, C.grey, 1.1, '3 2'),
    poly([[x + w, y], [f1(x + w + ox), f1(y + oy)], apex], shade(col, -0.2), C.ink, 1.6), poly([[x, y], [x + w, y], apex], hlSide ? FILL : col, hlSide ? HL : C.ink, hlSide ? 2.6 : 1.6));
};
/** Triangular prism lying on a rectangle side. */
const prism = (x: number, y: number, w: number, h: number, d: number, col: string) => {
  const ox = d * DX, oy = d * DY, a: Pt = [x, y], b: Pt = [x + w, y], c: Pt = [f1(x + w / 2), y - h];
  const m = (p: Pt): Pt => [f1(p[0] + ox), f1(p[1] + oy)];
  return all(line(`M${a[0]} ${a[1]} L${m(a)[0]} ${m(a)[1]} L${m(b)[0]} ${m(b)[1]}`, C.grey, 1.1, '3 2'), line(`M${m(a)[0]} ${m(a)[1]} L${m(c)[0]} ${m(c)[1]}`, C.grey, 1.1, '3 2'),
    poly([c, m(c), m(b), b], shade(col, -0.18), C.ink, 1.6), poly([a, b, c], col, C.ink, 1.8));
};
const person = (x: number, s = 1, top: string = C.green) => g(`translate(${x} 112) scale(${s})`, line('M-5 0 L-3 -26 M5 0 L3 -26', C.denim2, 5), rect(-9, -50, 18, 26, top, 5, C.ink, 1.4), circle(0, -58, 8, C.skin, C.ink, 1.4), path('M-8 -60 C-8 -70 8 -70 8 -60 C4 -64 -4 -64 -8 -60 Z', C.hair, null));
const unitCube = (x: number, y: number, s: number, col: string = FILL) => box(x, y, s, s, s, col);

// ── Shared layouts ───────────────────────────────────────────────────
/** Horizontal segment layout (ändpunkt / mittpunkt / sträcka). */
const A: Pt = [22, 62], B: Pt = [98, 62];
/** Triangle layout: base 18–102 at y 94, apex (46, 22). */
const TA: Pt = [18, 94], TB: Pt = [102, 94], TC: Pt = [46, 24];
const triBase = (fill: string = '#eef3f7') => poly([TA, TB, TC], fill, C.ink, 2.2);
/** Right triangle layout: right angle at (24, 94). */
const RA: Pt = [24, 94], RB: Pt = [100, 94], RC: Pt = [24, 30];
/** Circle layout. */
const CX = 58, CY = 60, CR = 40;
const circBase = (col: string = C.ink, sw = 2.2) => circle(CX, CY, CR, '#eef3f7', col, sw);
/** Rectangle grid of unit squares. */
const grid = (x: number, y: number, cols: number, rows: number, s: number, col: string = C.grey2, sw = 0.8) => all(...range(cols + 1).map((i) => line(`M${f1(x + i * s)} ${y} L${f1(x + i * s)} ${f1(y + rows * s)}`, col, sw)), ...range(rows + 1).map((j) => line(`M${x} ${f1(y + j * s)} L${f1(x + cols * s)} ${f1(y + j * s)}`, col, sw)));
const dim = (a: Pt, b: Pt, label: string, off: [number, number], col: string = C.dark) => all(seg(a, b, col, 1.2), head(b, a, col, 5), head(a, b, col, 5), num(f1((a[0] + b[0]) / 2 + off[0]), f1((a[1] + b[1]) / 2 + off[1]), label, 9, col));

export const GEOMETRY_MOTIFS: Record<string, Svg> = {
  // ── 3131 Punkt och linje ─────────────────────────────────────────
  /** linje: a hand draws a long straight stroke across a sheet of paper. */
  'geom.linje': all(bg(), sheet(10, 26, 100, 66), line('M18 62 L82 50', HL, 3.4), pencil(84, 50, 30, 1.1), hnd(92, 34, 6), arm(116, 20, 94, 32)),
  /** rät linje: a straight line with arrowheads at both ends (goes on without end), two grey points on it. */
  'geom.rät-linje': all(bg(), infLine([10, 34], [110, 34], HL, 3.4), check(100, 18), greyed(line('M12 70 C30 54 46 88 64 72 C80 58 92 82 108 70', C.ink, 2.4), line('M12 100 L34 88 L52 102 L74 86 L92 100 L108 90', C.ink, 2.4)), cross(112, 64, 0.8), cross(112, 96, 0.8)),
  /** sträcka (geometri): a thick line between two end points only, measured with a ruler below. */
  'geom.sträcka.2': all(bg(), seg(A, B, HL, 4), dot(A[0], A[1], 4.6), dot(B[0], B[1], 4.6), ruler(22, 76, 78), dim([22, 44], [98, 44], '5', [0, -5])),
  /** stråle: starts in a point and goes on in one direction only (arrow), like light from a lamp. */
  'geom.stråle': all(bg(), seg([26, 66], [104, 40], HL, 3.4), head([26, 66], [108, 38.7], HL, 10), dot(26, 66, 5), greyed(circle(16, 70, 8, C.yellow, C.ink, 1.4), line('M10 82 L22 82', C.ink, 2))),
  /** ändpunkt: a grey segment whose two end points are marked. */
  'geom.ändpunkt': all(bg(), seg(A, B, C.grey, 3), bigDot(A[0], A[1]), bigDot(B[0], B[1]), dot(60, 62, 2.4, C.grey)),
  /** förlänga (göra längre): a short solid line is drawn longer along a ruler; the new part is highlighted. */
  'geom.förlänga.3': all(bg(), ruler(10, 70, 100, 0, 10), seg([16, 64], [52, 64], C.ink, 3), dot(16, 64, 3.6), seg([52, 64], [94, 64], HL, 3.4, '6 4'), head([52, 64], [100, 64], HL, 9), pencil(100, 62, 30, 0.9), arrow(54, 46, 92, 46, HL, 2.4)),
  /** parallell: two lines with the same direction and equal distance between them (two grey distance arrows). */
  'geom.parallell': all(bg(), infLine([10, 44], [110, 24], HL, 3), infLine([10, 92], [110, 72], HL, 3), parMark([10, 44], [110, 24]), parMark([10, 92], [110, 72]), dim([34, 39.5], [34, 87.5], '', [0, 0], C.grey), dim([86, 29], [86, 77], '', [0, 0], C.grey)),
  /** vinkelrät: a tilted grey line and a highlighted line meeting it at a right angle (square mark). */
  'geom.vinkelrät': (() => { const c: Pt = [58, 70]; return all(bg(), infLine(P(c[0], c[1], 58, 200), P(c[0], c[1], 58, 20), C.grey, 2.6), seg(c, P(c[0], c[1], 58, 110), HL, 3.4), head(c, P(c[0], c[1], 62, 110), HL, 9), rightMark(c, 20, 110, 11, HL), dot(c[0], c[1], 3.4)); })(),

  // ── 3132 Vinklar och vinkeltyper ─────────────────────────────────
  /** gradskiva: a half-round protractor with degree marks and numbers. */
  'geom.gradskiva': all(bg(), path('M12 92 A48 48 0 0 1 108 92 Z', 'rgba(140,199,232,0.55)', C.ink, 2), ...range(19).map((i) => { const a = P(60, 92, 48, i * 10), b = P(60, 92, i % 9 === 0 ? 36 : i % 3 === 0 ? 40 : 43, i * 10); return seg(a, b, C.ink, i % 3 === 0 ? 1.6 : 1); }), num(20, 88, '0', 8), num(60, 54, '90', 8), num(100, 88, '180', 8), path('M52 92 A8 8 0 0 1 68 92 Z', 'none', C.ink, 1.4), dot(60, 92, 2.4, HL)),
  /** vinkelspets: an angle with grey legs; only the corner point where they start is marked. */
  'geom.vinkelspets': all(bg(), angle(AV, 0, 55, 70, C.grey, 3), arc(AV[0], AV[1], 20, 0, 55, C.grey, 1.6), bigDot(AV[0], AV[1])),
  /** vinkelben: the same angle; only the two legs are highlighted. */
  'geom.vinkelben': all(bg(), angle(AV, 0, 55, 70, HL, 4.2), arc(AV[0], AV[1], 20, 0, 55, C.grey, 1.6), dot(AV[0], AV[1], 3, C.grey)),
  /** rät vinkel: 90° with the square mark. */
  'geom.rät-vinkel': angType(90, '90°'),
  /** spetsig vinkel: smaller than the dashed grey 90° line. */
  'geom.spetsig-vinkel': angType(40, '40°'),
  /** trubbig vinkel: wider than the dashed grey 90° line. */
  'geom.trubbig-vinkel': angType(130, '130°'),
  /** rak vinkel: 180°, the legs form one straight line. */
  'geom.rak-vinkel': (() => { const v: Pt = [60, 84]; return all(bg(), wedge(v[0], v[1], 26, 0, 180, FILL), arc(v[0], v[1], 26, 0, 180, HL, 2.6), seg(v, [112, 84], C.ink, 3), seg(v, [8, 84], C.ink, 3), seg(v, [60, 46], REF, 1.8, '4 3'), dot(v[0], v[1], 3.4), num(60, 34, '180°', 15, HL)); })(),
  /** full vinkel: a whole turn, 360°, round the corner point. */
  'geom.full-vinkel': (() => { const v: Pt = [60, 62]; return all(bg(), circle(v[0], v[1], 26, FILL, null), arc(v[0], v[1], 26, 2, 350, HL, 2.6), head(P(v[0], v[1], 26, 340), P(v[0], v[1], 26, 352), HL, 8), seg(v, [108, 62], C.ink, 3), dot(v[0], v[1], 3.4), num(60, 106, '360°', 14, HL)); })(),
  /** kvartsvarv: a knob turned a quarter of a turn; the quarter is highlighted, the rest of the turn is grey. */
  'geom.kvartsvarv': (() => { const v: Pt = [60, 64]; return all(bg(), circle(v[0], v[1], 40, 'none', REF, 2), wedge(v[0], v[1], 40, 0, 90, FILL, null), line(arcD(v[0], v[1], 44, 6, 84), HL, 3), head(P(v[0], v[1], 44, 20), P(v[0], v[1], 44, 4), HL, 9), circle(v[0], v[1], 16, C.silver, C.ink, 1.6), greyed(rect(57, 26, 6, 38, C.dark, 2, null)), rect(60, 61, 38, 6, C.dark, 2, C.ink, 1), num(104, 20, '90°', 11, HL)); })(),
  /** sidovinkel: two angles side by side on one straight line; together they make 180°. */
  'geom.sidovinkel': (() => { const v: Pt = [58, 86]; return all(bg(), wedge(v[0], v[1], 24, 0, 70, FILL), wedge(v[0], v[1], 24, 70, 180, '#cfe8f6'), arc(v[0], v[1], 24, 0, 70, HL, 2.6), arc(v[0], v[1], 24, 70, 180, C.denim, 2.6), seg([8, 86], [112, 86], C.ink, 3), seg(v, P(v[0], v[1], 64, 70), C.ink, 3), dot(v[0], v[1], 3.2), num(92, 74, '70°', 11, HL), num(24, 74, '110°', 11, C.denim)); })(),
  /** vertikalvinkel: two crossing lines; the two angles opposite each other are highlighted and equal. */
  'geom.vertikalvinkel': (() => { const v: Pt = [60, 60]; return all(bg(), wedge(v[0], v[1], 30, 20, 75, FILL), wedge(v[0], v[1], 30, 200, 255, FILL), arc(v[0], v[1], 30, 20, 75, HL, 2.8), arc(v[0], v[1], 30, 200, 255, HL, 2.8), seg(P(v[0], v[1], 56, 20), P(v[0], v[1], 56, 200), C.ink, 3), seg(P(v[0], v[1], 56, 75), P(v[0], v[1], 56, 255), C.ink, 3), num(...P(v[0], v[1], 42, 47), '55°', 10, HL), num(...P(v[0], v[1], 40, 227), '55°', 10, HL)); })(),
  /** vinkelhake: a right-angled drawing triangle with a scale, checking a corner of a sheet. */
  'geom.vinkelhake': all(bg(), sheet(10, 16, 84, 80), poly([[30, 96], [30, 34], [92, 96]], 'rgba(140,199,232,0.6)', C.ink, 2), poly([[38, 88], [38, 56], [70, 88]], SOFT, C.ink, 1.2), ...range(9).map((i) => line(`M${36 + i * 6.5} 96 L${36 + i * 6.5} ${i % 2 ? 92 : 90}`, C.ink, 0.8)), rightMark([30, 96], 0, 90, 10, HL), hnd(100, 90, 6), arm(116, 70, 100, 86)),

  // ── 3133 Trianglar ────────────────────────────────────────────────
  /** triangel: a figure with three sides and three corners; a grey circle and square beside it. */
  'geom.triangel': all(bg(), poly([[16, 96], [84, 96], [50, 26]], FILL, HL, 3), greyed(circle(100, 34, 10, C.white, C.ink, 1.6), rect(90, 76, 20, 20, C.white, 1, C.ink, 1.6))),
  /** sida (i en figur): a grey triangle with one of its sides highlighted. */
  'geom.sida': all(bg(), triBase(), seg(TA, TC, HL, 5), dot(TA[0], TA[1], 3), dot(TC[0], TC[1], 3)),
  /** hörn: a grey triangle; its three corners are marked. */
  'geom.hörn': all(bg(), triBase(), bigDot(TA[0], TA[1]), bigDot(TB[0], TB[1]), bigDot(TC[0], TC[1])),
  /** bas (geometri): the bottom side of a triangle is highlighted; the dashed height stands on it. */
  'geom.bas': all(bg(), triBase(), seg([46, 24], [46, 94], C.grey, 1.6, '4 3'), rightMark([46, 94], 0, 90, 7, C.grey), seg(TA, TB, HL, 5), arrow(60, 108, 60, 100, HL, 2.2)),
  /** liksidig: three equal sides, the same mark on every side. */
  'geom.liksidig': (() => { const p = reg(60, 66, 42, 3); return all(bg(), poly(p, '#eef3f7', C.ink, 2.4), ticks(p[0]!, p[1]!, 1), ticks(p[1]!, p[2]!, 1), ticks(p[2]!, p[0]!, 1)); })(),
  /** likbent: two equal sides marked; the base is different and grey. */
  'geom.likbent': all(bg(), poly([[34, 98], [86, 98], [60, 16]], '#eef3f7', C.ink, 2.4), seg([34, 98], [60, 16], HL, 3.4), seg([86, 98], [60, 16], HL, 3.4), ticks([34, 98], [60, 16], 1), ticks([86, 98], [60, 16], 1), seg([34, 98], [86, 98], REF, 3.4)),
  /** oliksidig: three sides of different lengths, each with a different number of marks and colour. */
  'geom.oliksidig': (() => { const a: Pt = [14, 96], b: Pt = [104, 96], c: Pt = [36, 30]; return all(bg(), poly([a, b, c], '#eef3f7', C.ink, 1), seg(a, b, HL, 3.4), seg(b, c, C.denim, 3.4), seg(c, a, C.green, 3.4), ticks(a, b, 1, HL), ticks(b, c, 2, C.denim), ticks(c, a, 3, C.green)); })(),
  /** rätvinklig: a triangle with one right angle (square mark highlighted). */
  'geom.rätvinklig': all(bg(), poly([RA, RB, RC], '#eef3f7', C.ink, 2.4), rect(24, 80, 14, 14, FILL, 0, HL, 2.4)),
  /** trubbvinklig: a flat triangle with one wide angle highlighted. */
  'geom.trubbvinklig': (() => { const a: Pt = [10, 92], b: Pt = [110, 92], c: Pt = [36, 62]; return all(bg(), poly([a, b, c], '#eef3f7', C.ink, 2.4), wedge(c[0], c[1], 14, 229, 338, FILL), arc(c[0], c[1], 14, 229, 338, HL, 2.6), num(36, 44, '>90°', 11, HL)); })(),
  /** spetsvinklig: all three angles small (three small arcs). */
  'geom.spetsvinklig': (() => { const p: Pt[] = [[18, 94], [102, 94], [58, 20]]; const ang = (v: Pt, u: Pt, w: Pt) => { const a1 = (Math.atan2(-(u[1] - v[1]), u[0] - v[0]) * 180) / Math.PI, a2 = (Math.atan2(-(w[1] - v[1]), w[0] - v[0]) * 180) / Math.PI; let s = Math.min(a1, a2), e = Math.max(a1, a2); if (e - s > 180) { const t = s; s = e; e = t + 360; } return all(wedge(v[0], v[1], 14, s, e, FILL), arc(v[0], v[1], 14, s, e, HL, 2.4)); }; return all(bg(), ang(p[0]!, p[1]!, p[2]!), ang(p[1]!, p[2]!, p[0]!), ang(p[2]!, p[0]!, p[1]!), poly(p, 'none', C.ink, 2.4), num(100, 30, '<90°', 10, HL)); })(),
  /** vinkelsumma: the three angles of a triangle put together make a straight line, 180°. */
  'geom.vinkelsumma': (() => { const a: Pt = [10, 62], b: Pt = [70, 62], c: Pt = [30, 16]; const A1 = (Math.atan2(-(c[1] - a[1]), c[0] - a[0]) * 180) / Math.PI, B1 = 180 - (Math.atan2(-(c[1] - b[1]), c[0] - b[0]) * 180) / Math.PI, C1 = 180 - A1 - B1; const v: Pt = [60, 104]; return all(bg(), wedge(a[0], a[1], 13, 0, A1, '#f6b38a'), wedge(b[0], b[1], 13, 180 - B1, 180, '#a8dcc0'), wedge(c[0], c[1], 11, 180 + A1, 360 - B1, '#b9d8f0'), poly([a, b, c], 'none', C.ink, 2.2), wedge(v[0], v[1], 22, 0, B1, '#a8dcc0', C.ink), wedge(v[0], v[1], 22, B1, B1 + C1, '#b9d8f0', C.ink), wedge(v[0], v[1], 22, B1 + C1, 180, '#f6b38a', C.ink), seg([30, 104], [90, 104], C.ink, 2), arrow(64, 64, 64, 78, C.grey, 2), num(100, 92, '180°', 12, HL)); })(),
  /** katet: a right triangle; the two short sides that form the right angle are highlighted. */
  'geom.katet': all(bg(), poly([RA, RB, RC], '#eef3f7', C.ink, 2), seg(RA, RB, HL, 5), seg(RA, RC, HL, 5), seg(RB, RC, REF, 3), rightMark(RA, 0, 90, 10, C.ink)),
  /** hypotenusa: the same right triangle; only the long side opposite the right angle is highlighted. */
  'geom.hypotenusa': all(bg(), poly([RA, RB, RC], '#eef3f7', C.ink, 2), seg(RA, RB, REF, 3), seg(RA, RC, REF, 3), seg(RB, RC, HL, 5), rightMark(RA, 0, 90, 10, C.ink)),
  /** Pythagoras sats: squares on the sides 3, 4 and 5 of a right triangle; 9 + 16 = 25. */
  'geom.Pythagoras-sats': (() => { const s = 8, A0: Pt = [30, 72], B0: Pt = [30 + 4 * s, 72], C0: Pt = [30, 72 - 3 * s]; const hx = B0[0] - C0[0], hy = B0[1] - C0[1]; const sq5: Pt[] = [C0, B0, [f1(B0[0] + hy), f1(B0[1] - hx)], [f1(C0[0] + hy), f1(C0[1] - hx)]]; return all(bg(), poly(sq5, '#cfe8f6', C.ink, 1.6), rect(30, 72, 4 * s, 4 * s, '#a8dcc0', 0, C.ink, 1.6), grid(30, 72, 4, 4, s, 'rgba(0,0,0,0.25)', 0.6), rect(30 - 3 * s, 72 - 3 * s, 3 * s, 3 * s, '#f6c39a', 0, C.ink, 1.6), grid(30 - 3 * s, 72 - 3 * s, 3, 3, s, 'rgba(0,0,0,0.25)', 0.6), poly([A0, B0, C0], C.white, HL, 2.6), rightMark(A0, 0, 90, 6, HL), num(18, 56, '9', 10), num(46, 94, '16', 10), num(78, 40, '25', 10), num(90, 106, '9 + 16 = 25', 9, HL)); })(),
  /** kongruent: two triangles with exactly the same shape and size (one turned), =. */
  'geom.kongruent': all(bg(), poly([[8, 50], [40, 50], [16, 16]], FILL, C.ink, 2), arrow(44, 36, 62, 36, HL, 2.4), poly([[70, 50], [102, 50], [78, 16]], FILL, HL, 3), poly([[70, 50], [102, 50], [78, 16]], 'none', C.ink, 1.4, ), check(106, 14), greyed(poly([[8, 104], [30, 104], [14, 80]], C.white, C.ink, 1.6), arrow(36, 92, 52, 92, C.ink, 2), poly([[60, 104], [104, 104], [72, 58]], C.white, C.ink, 1.6), poly([[60, 104], [82, 104], [66, 80]], 'none', C.ink, 1.2, )), cross(110, 70, 0.8)),
  /** likformig: the same layout; the second triangle has the same shape but is twice as big. */
  'geom.likformig': all(bg(), poly([[8, 92], [30, 92], [14, 68]], FILL, C.ink, 2.2), poly([[48, 92], [112, 92], [64, 20]], FILL, C.ink, 2.2), num(36, 50, '×2', 13, HL), arrow(30, 62, 50, 50, HL, 2)),

  // ── 3134 Fyrhörningar ────────────────────────────────────────────
  /** fyrhörning: different four-cornered figures, each corner marked; a grey triangle beside them for contrast. */
  'geom.fyrhörning': all(bg(), poly([[12, 54], [52, 40], [56, 84], [18, 92]], FILL, C.ink, 2.2), poly([[66, 30], [108, 30], [100, 62], [72, 62]], FILL, C.ink, 2.2), ...[[12, 54], [52, 40], [56, 84], [18, 92], [66, 30], [108, 30], [100, 62], [72, 62]].map(([x, y]) => dot(x!, y!, 3.2, HL)), num(36, 72, '4', 13, HL), num(87, 52, '4', 13, HL), greyed(poly([[72, 100], [104, 100], [88, 74]], C.white, C.ink, 1.6))),
  /** kvadrat: four equal sides and four right angles. */
  'geom.kvadrat': all(bg(), rect(26, 24, 68, 68, FILL, 0, C.ink, 2.4), ticks([26, 24], [94, 24]), ticks([94, 24], [94, 92]), ticks([94, 92], [26, 92]), ticks([26, 92], [26, 24]), rightMark([26, 92], 0, 90, 9), rightMark([94, 92], 90, 180, 9), rightMark([94, 24], 180, 270, 9), rightMark([26, 24], 270, 360, 9)),
  /** rektangel: four right angles, long sides and short sides marked differently. */
  'geom.rektangel': all(bg(), rect(12, 34, 96, 50, FILL, 0, C.ink, 2.4), ticks([12, 34], [108, 34], 2, C.dark), ticks([12, 84], [108, 84], 2, C.dark), ticks([12, 34], [12, 84], 1, C.dark), ticks([108, 34], [108, 84], 1, C.dark), rightMark([12, 84], 0, 90, 9), rightMark([108, 84], 90, 180, 9), rightMark([108, 34], 180, 270, 9), rightMark([12, 34], 270, 360, 9)),
  /** rektangulär: a rectangular table and a rectangular rug in a room seen from above; a grey round table as contrast. */
  'geom.rektangulär': all(bg('#efe6d6'), ...[[22, 22], [40, 22], [58, 22], [22, 96], [40, 96], [58, 96]].map(([x, y]) => rect(x! - 5, y! - 4, 10, 8, C.brown, 2, C.ink, 1)), rect(10, 28, 64, 62, '#c98d55', 3, C.ink, 1.8), line('M14 40 L70 40 M14 54 L70 54 M14 68 L70 68 M14 80 L70 80', '#b07a46', 1), ...[[24, 44], [42, 44], [60, 44], [24, 74], [42, 74], [60, 74]].map(([x, y]) => circle(x!, y!, 5, C.white, C.ink, 1)), rect(10, 28, 64, 62, 'none', 3, HL, 2.6), check(66, 14), greyed(circle(98, 60, 15, '#c98d55', C.ink, 1.6), circle(98, 50, 4, C.white, C.ink, 1), circle(98, 70, 4, C.white, C.ink, 1)), cross(98, 92, 0.9)),
  /** parallellogram: leaning figure; the opposite sides carry the same parallel arrows. */
  'geom.parallellogram': all(bg(), poly([[10, 84], [78, 84], [110, 34], [42, 34]], FILL, C.ink, 2.4), parMark([10, 84], [78, 84], 1), parMark([42, 34], [110, 34], 1), parMark([10, 84], [42, 34], 2), parMark([78, 84], [110, 34], 2)),
  /** romb: a diamond with four equal sides. */
  'geom.romb': all(bg(), poly([[60, 12], [96, 60], [60, 108], [24, 60]], FILL, C.ink, 2.4), ticks([60, 12], [96, 60]), ticks([96, 60], [60, 108]), ticks([60, 108], [24, 60]), ticks([24, 60], [60, 12])),
  /** parallelltrapets: only the top and bottom sides are parallel (arrows); the slanted sides are grey. */
  'geom.parallelltrapets': all(bg(), poly([[8, 88], [112, 88], [80, 36], [36, 36]], FILL, C.ink, 2.4), seg([8, 88], [112, 88], HL, 3.4), seg([36, 36], [80, 36], HL, 3.4), parMark([8, 88], [112, 88], 1), parMark([36, 36], [80, 36], 1), seg([8, 88], [36, 36], C.grey, 2.4), seg([112, 88], [80, 36], C.grey, 2.4)),
  /** motstående: in a grey quadrilateral, two sides that face each other are highlighted, with arrows between them. */
  'geom.motstående': all(bg(), rect(22, 22, 76, 76, '#eef3f7', 0, C.grey, 2.4), seg([22, 22], [22, 98], HL, 5), seg([98, 22], [98, 98], HL, 5), arrow(46, 60, 30, 60, HL, 2.4), arrow(74, 60, 90, 60, HL, 2.4), circle(60, 60, 4, C.grey, null)),
  /** diagonal: a grey square with a highlighted line from one corner to the opposite corner. */
  'geom.diagonal': all(bg(), rect(22, 22, 76, 76, '#eef3f7', 0, C.grey, 2.4), seg([22, 98], [98, 22], HL, 4), dot(22, 98, 4.4, HL), dot(98, 22, 4.4, HL)),
  /** symmetrilinje: a butterfly with a dashed highlighted line down the middle; mirror arrows on both sides. */
  'geom.symmetrilinje': all(bg(), greyed(poly([[30, 96], [30, 50], [60, 22], [90, 50], [90, 96]], C.white, C.ink, 2), rect(50, 70, 20, 26, C.white, 1, C.ink, 1.4), rect(36, 58, 10, 10, C.white, 0, C.ink, 1.2), rect(74, 58, 10, 10, C.white, 0, C.ink, 1.2)), line('M60 6 L60 112', HL, 5, '8 5'), path('M38 106 C48 100 54 100 58 104', 'none', HL, 1.8), path('M82 106 C72 100 66 100 62 104', 'none', HL, 1.8), head([48, 101], [36, 107], HL, 6), head([72, 101], [84, 107], HL, 6)),
  /** månghörning: several figures with straight sides (3, 5, 6, 7 corners) in colour; a grey circle crossed out. */
  'geom.månghörning': all(bg(), poly(reg(30, 34, 18, 3), FILL, C.ink, 2), poly(reg(84, 34, 20, 5), FILL, C.ink, 2), poly(reg(30, 84, 20, 6, 0), FILL, C.ink, 2), poly([[68, 74], [86, 66], [104, 76], [100, 96], [80, 102], [66, 92]], FILL, C.ink, 2), greyed(circle(104, 106, 8, C.white, C.ink, 1.4), line('M96 98 L112 114 M112 98 L96 114', C.red, 2))),
  /** femhörning: a five-cornered figure with its corners marked, 5. */
  'geom.femhörning': (() => { const p = reg(60, 64, 44, 5); return all(bg(), poly(p, FILL, C.ink, 2.6), ...p.map(([x, y]) => dot(x, y, 4, HL)), num(60, 70, '5', 22, HL)); })(),
  /** sexhörning: floor tiles with six corners; one tile highlighted with its corners marked. */
  'geom.sexhörning': (() => { const r = 13, h = r * Math.sqrt(3), out: Svg[] = []; let hit: Pt = [0, 0]; for (let i = 0; i < 6; i++) for (let j = 0; j < 5; j++) { const cx = f1(22 + i * 1.5 * r), cy = f1(20 + j * h + (i % 2 ? h / 2 : 0)); if (cx + r > 114 || cy + h / 2 > 110) continue; if (i === 2 && j === 1) hit = [cx, cy]; out.push(poly(reg(cx, cy, r, 6, 0), '#e6eef4', C.grey, 1.2)); } const p = reg(hit[0], hit[1], r, 6, 0); return all(bg(), ...out, poly(p, FILL, HL, 2.8), ...p.map(([x, y]) => dot(x, y, 3, HL)), num(hit[0], hit[1] + 5, '6', 13, HL)); })(),
  /** åttahörning: a red eight-cornered road sign on a pole (no text). */
  'geom.åttahörning': (() => { const p = reg(60, 46, 36, 8, 22.5), q = reg(60, 46, 30, 8, 22.5); return all(bg('#dff0fa'), rect(57, 80, 6, 32, C.grey, 1, C.ink, 1.4), poly(p, C.white, C.ink, 2), poly(q, C.red, null), ...p.map(([x, y]) => dot(x, y, 3, HL)), num(60, 54, '8', 22, C.white), ground); })(),
  /** regelbunden (om figurer): figures with all sides equal (marks) next to an uneven grey figure. */
  'geom.regelbunden.2': (() => { const a = reg(32, 36, 22, 6, 0), b = reg(88, 38, 22, 5); const tk = (p: Pt[]) => all(...p.map((q, i) => ticks(q, p[(i + 1) % p.length]!, 1))); return all(bg(), poly(a, FILL, C.ink, 2.2), tk(a), poly(b, FILL, C.ink, 2.2), tk(b), greyed(poly([[30, 78], [58, 70], [66, 92], [44, 106], [20, 100], [14, 86]], C.white, C.ink, 1.8), poly([[74, 76], [108, 72], [100, 100], [80, 104]], C.white, C.ink, 1.8))); })(),

  // ── 3135 Cirklar ─────────────────────────────────────────────────
  /** medelpunkt: a grey circle with the point in the middle marked, equal distances to the edge. */
  'geom.medelpunkt': all(bg(), circBase(C.grey), ...[0, 120, 240].map((d) => seg([CX, CY], P(CX, CY, CR, d), REF, 1.4, '3 3')), bigDot(CX, CY)),
  /** radie: a highlighted line from the middle to the edge of the circle. */
  'geom.radie': all(bg(), circBase(C.grey), seg([CX, CY], P(CX, CY, CR, 30), HL, 4.4), dot(CX, CY, 3.6), dot(...P(CX, CY, CR, 30), 3.6, HL), seg(P(CX, CY, CR, 180), [CX, CY], REF, 1.4, '3 3')),
  /** passare: the drawing tool with a needle leg and a pencil leg, standing on paper. */
  'geom.passare': all(bg(), sheet(8, 82, 104, 26), circle(60, 16, 6, C.silver, C.ink, 1.6), rect(57, 4, 6, 8, C.dark, 2, C.ink, 1), line('M58 20 L34 96', C.ink, 5), line('M58 20 L34 96', C.silver, 3), line('M34 96 L33 102', C.ink, 1.4), line('M62 20 L84 84', C.ink, 5), line('M62 20 L84 84', C.silver, 3), g('translate(86 90) rotate(-20)', rect(-3, -10, 6, 12, C.yellow, 0.5, C.ink, 1), path('M-3 2 L3 2 L0 8 Z', C.tan, C.ink, 0.8)), line('M44 64 L74 58', C.ink, 1.6)),
  /** slå en cirkel: a hand turns the compass round its needle; the circle being drawn and a turning arrow. */
  'geom.slå-en-cirkel': all(bg(), sheet(6, 30, 108, 78), ellipse(52, 82, 36, 18, 'none', HL, 3), head([70, 101], [80, 96], HL, 9), line('M52 82 L56 36', C.ink, 4), line('M52 82 L56 36', C.silver, 2.4), line('M58 36 L84 86', C.ink, 4), line('M58 36 L84 86', C.silver, 2.4), circle(57, 32, 5, C.silver, C.ink, 1.4), hnd(57, 24, 6), arm(80, 4, 60, 20), dot(52, 82, 2.6)),
  /** rund: a round ball and round plate in colour; a grey square box as contrast. */
  'geom.rund': all(bg(), ellipse(30, 34, 20, 20, C.white, C.ink, 1.8), circle(30, 34, 13, 'none', C.grey2, 1.4), circle(86, 32, 18, C.white, C.ink, 2), line('M86 32 L86 20 M86 32 L95 36', C.ink, 2), circle(86, 32, 2, C.ink, null), circle(24, 82, 10, C.gold, C.ink, 1.6), circle(24, 82, 6, 'none', '#b8902a', 1), circle(56, 84, 16, C.orange, C.ink, 1.8), path('M40 82 C50 78 62 78 72 84', 'none', C.ink, 1.2), check(70, 62), greyed(rect(88, 74, 24, 24, C.tan, 1, C.ink, 1.6)), cross(100, 106, 0.7)),
  /** halvcirkel: half of the circle filled; the other half is dashed grey. */
  'geom.halvcirkel': all(bg(), path(`M${CX - CR} ${CY} A${CR} ${CR} 0 0 1 ${CX + CR} ${CY} Z`, FILL, HL, 2.8), path(`M${CX - CR} ${CY} A${CR} ${CR} 0 0 0 ${CX + CR} ${CY}`, 'none', C.grey, 1.6), dot(CX, CY, 3), line(`M${CX - CR} ${CY} L${CX + CR} ${CY}`, C.ink, 2)),
  /** kvartscirkel: a quarter of the circle filled, with the right-angle mark; the rest dashed grey. */
  'geom.kvartscirkel': all(bg(), circle(CX, CY, CR, 'none', C.grey, 1.4), wedge(CX, CY, CR, 0, 90, FILL, HL), rightMark([CX, CY], 0, 90, 9, C.ink), dot(CX, CY, 3), seg([CX, CY], [CX - CR, CY], REF, 1.2, '3 3'), seg([CX, CY], [CX, CY + CR], REF, 1.2, '3 3')),
  /** cirkelbåge: only a piece of the round line itself is highlighted (no filled area). */
  'geom.cirkelbåge': all(bg(), circle(CX, CY, CR, 'none', C.grey, 1.6), arc(CX, CY, CR, 20, 110, HL, 6), dot(...P(CX, CY, CR, 20), 3.4, C.ink), dot(...P(CX, CY, CR, 110), 3.4, C.ink), dot(CX, CY, 2.4, C.grey)),
  /** cirkelsektor: a slice like a piece of cake between two radii, filled. */
  'geom.cirkelsektor': all(bg(), circBase(C.grey, 1.6), wedge(CX, CY, CR, 30, 90, FILL, HL), g('translate(8 -6)', wedge(CX, CY, CR, 30, 90, 'none', null)), dot(CX, CY, 3)),
  /** korda: a straight line across the circle from edge to edge, not through the middle. */
  'geom.korda': all(bg(), circBase(C.grey, 1.8), seg(P(CX, CY, CR, 160), P(CX, CY, CR, 50), HL, 4), dot(...P(CX, CY, CR, 160), 3.6, HL), dot(...P(CX, CY, CR, 50), 3.6, HL), dot(CX, CY, 2.8, C.grey), seg(P(CX, CY, CR, 180), P(CX, CY, CR, 0), REF, 1.2, '3 3')),
  /** tangent: a straight line touching the circle in one point, at a right angle to the radius. */
  'geom.tangent': (() => { const t = P(CX, CY + 6, 34, 60); return all(bg(), circle(CX, CY + 6, 34, '#eef3f7', C.grey, 1.8), seg([CX, CY + 6], t, REF, 1.6, '3 3'), infLine(P(t[0], t[1], 52, 150), P(t[0], t[1], 52, -30), HL, 3), rightMark(t, 150, 240, 8, C.ink), dot(t[0], t[1], 4, HL), dot(CX, CY + 6, 2.4, C.grey)); })(),
  /** koncentrisk: rings with the same middle point, like rings on water. */
  'geom.koncentrisk': all(bg('#d8ecf6'), ...[44, 32, 20, 9].map((r, i) => circle(60, 60, r, i % 2 ? '#bfe0f2' : '#d8ecf6', i === 0 ? HL : C.denim, 2.2)), bigDot(60, 60)),
  /** ellips: a long, flattened round figure; a dashed grey circle as reference. */
  'geom.ellips': all(bg(), circle(60, 60, 28, 'none', C.grey, 1.6), ellipse(60, 60, 50, 26, 'rgba(249,201,166,0.7)', HL, 3)),
  /** pi: the sign π and 3,14; a wheel's round line unrolled is a little more than three diameters. */
  'geom.pi': all(bg(), num(34, 54, 'π', 44, HL), num(84, 46, '3,14', 18, C.ink), circle(18, 88, 10, '#eef3f7', C.ink, 1.6), seg([8, 88], [28, 88], C.denim, 2), seg([30, 98], [112, 98], HL, 2.6), ...[0, 1, 2, 3].map((i) => seg([30 + i * 20, 94], [30 + i * 20, 102], C.denim, 2)), seg([30, 104], [90, 104], C.denim, 2)),

  // ── 3136 Omkrets och area ────────────────────────────────────────
  /** sidlängd: one side of a grey square is highlighted and measured, 3. */
  'geom.sidlängd': all(bg(), rect(28, 30, 60, 60, '#eef3f7', 0, C.grey, 2.2), seg([28, 90], [88, 90], HL, 4.4), ruler(28, 96, 62), dim([28, 22], [88, 22], '3', [0, -4], HL)),
  /** längdenhet: three rulers/units of length (1 cm, 1 dm, 1 m pieces) as lines of growing length. */
  'geom.längdenhet': all(bg(), ...[[14, 30, 12], [14, 60, 40], [14, 92, 92]].map(([x, y, w]) => all(seg([x!, y!], [x! + w!, y!], HL, 4), seg([x!, y! - 6], [x!, y! + 6], C.ink, 2), seg([x! + w!, y! - 6], [x! + w!, y! + 6], C.ink, 2), num(x! + w! / 2, y! - 8, '1', 10))), greyed(rect(60, 18, 16, 16, C.white, 0, C.ink, 1.2))),
  /** area: a rectangle filled with unit squares; the whole surface is coloured. */
  'geom.area': all(bg(), path('M14 22 L70 22 L70 56 L106 56 L106 98 L14 98 Z', FILL, null), path('M14 22 L70 22 L70 56 L106 56 L106 98 L14 98 Z', 'rgba(228,87,46,0.35)', null), path('M14 22 L70 22 L70 56 L106 56 L106 98 L14 98 Z', 'none', C.grey, 1.6)),
  /** areaenhet: three unit squares of growing size, each with 1 (contrast: the length units are lines). */
  'geom.areaenhet': all(bg(), rect(14, 84, 10, 10, FILL, 0, HL, 2), rect(32, 66, 28, 28, FILL, 0, HL, 2.2), rect(68, 44, 50, 50, FILL, 0, HL, 2.4), num(19, 80, '1', 9), num(46, 84, '1', 12), num(93, 74, '1', 16), greyed(seg([14, 104], [116, 104], C.ink, 2))),
  /** kvadratcentimeter: a tiny square, one ruler step on each side, next to a fingertip. */
  'geom.kvadratcentimeter': all(bg(), ruler(10, 86, 100, 0, 14), path('M60 80 C56 60 56 40 64 30 C70 24 80 26 84 36 C88 48 86 66 82 80 Z', C.skin, C.ink, 1.6), path('M64 40 C66 32 78 32 80 40 C78 46 66 46 64 40 Z', '#f6dccb', C.ink, 1), rect(28, 62, 12, 12, FILL, 0, HL, 2.2), dim([28, 56], [40, 56], '1', [0, -4], HL), seg([28, 86], [28, 80], HL, 1.6), seg([40, 86], [40, 80], HL, 1.6)),
  /** kvadratdecimeter: a bigger square made of 10 × 10 tiny squares, all filled. */
  'geom.kvadratdecimeter': all(bg(), rect(10, 30, 56, 56, FILL, 0, HL, 2.6), ruler(10, 90, 58, 0, 10), num(13, 110, '0', 7), num(65, 110, '10', 7), path('M80 92 L80 58 C80 54 86 54 86 58 L86 50 C86 30 92 30 92 50 L92 44 C92 26 98 26 98 44 L98 48 C98 30 104 30 104 50 L104 56 C104 40 110 40 110 58 L110 92 C110 104 80 104 80 92 Z', C.skin, C.ink, 1.6), path('M80 74 C74 66 68 62 70 58 C72 54 78 60 82 66', C.skin, C.ink, 1.4)),
  /** hektar: a square field 100 × 100 with a house and a tree for size. */
  'geom.hektar': all(bg('#dff0fa'), path('M10 96 L36 62 L108 62 L96 96 Z', '#bfe3a0', HL, 2.6), ...range(5).map((i) => line(`M${18 + i * 16} 94 L${40 + i * 14} 64`, '#9cc97f', 1.2)), rect(66, 52, 10, 8, C.white, 0, C.ink, 1), path('M64 52 L71 46 L78 52 Z', C.red, C.ink, 1), circle(48, 52, 6, C.green, C.ink, 1), num(52, 108, '100', 9, C.dark), num(108, 82, '100', 9, C.dark)),
  /** sammansatt figur: an L-shaped figure split into two rectangles in two colours, + . */
  'geom.sammansatt-figur': all(bg(), rect(14, 20, 40, 80, FILL, 0, C.ink, 2), rect(54, 64, 52, 36, '#cfe8f6', 0, C.ink, 2), line('M54 64 L54 100', C.ink, 2, '4 3'), path('M14 20 L54 20 L54 64 L106 64 L106 100 L14 100 Z', 'none', HL, 3), num(34, 64, '1', 14, C.dark), num(80, 88, '2', 14, C.dark), num(80, 40, '1 + 2', 12, HL)),

  // ── 3137 Volym och rymdgeometri ──────────────────────────────────
  /** tredimensionell: a cube with arrows in three directions; a grey flat square as contrast. */
  'geom.tredimensionell': all(bg(), box(22, 92, 40, 40, 34, FILL), arrow(22, 102, 66, 102, C.denim, 2.4), arrow(12, 94, 12, 46, C.denim, 2.4), arrow(70, 100, 90, 85, C.denim, 2.4), greyed(rect(92, 12, 18, 18, C.white, 0, C.ink, 1.4)), num(102, 64, '3', 16, HL)),
  /** volym (storlek): a see-through box being filled with small cubes; the filled space is highlighted. */
  'geom.volym.2': (() => { const out: Svg[] = []; for (let k = 0; k < 2; k++) for (let j = 0; j < 2; j++) for (let i = 0; i < 4; i++) out.push(unitCube(26 + i * 14 + k * 7.7, 96 - j * 14 - k * 5.9, 14)); return all(bg(), box(26, 96, 56, 56, 28, '#ffffff', { ghost: true }), ...out, line('M26 96 L82 96 L82 40 L26 40 Z', C.ink, 1.6), line('M82 96 L97.4 84.2 L97.4 28.2 L82 40 M26 40 L41.4 28.2 L97.4 28.2', C.ink, 1.6)); })(),
  /** kub: a cube, all edges equal. */
  'geom.kub': all(bg(), box(26, 96, 52, 52, 40, C.orange), ticks([26, 96], [78, 96], 1, C.ink), ticks([26, 96], [26, 44], 1, C.ink), ticks([78, 96], [100, 79.2], 1, C.ink), ground),
  /** rätblock: a long box like a carton; the sides are rectangles. */
  'geom.rätblock': all(bg(), box(12, 96, 76, 34, 34, C.denim), ground),
  /** kant: a grey cube with one edge highlighted. */
  'geom.kant': all(bg(), box(26, 96, 52, 52, 40, '#e6eaee'), seg([78, 96], [78, 44], HL, 5), dot(78, 96, 3.4, HL), dot(78, 44, 3.4, HL), ground),
  /** cylinder: a round body like a can, two equal circles at the ends. */
  'geom.cylinder': all(bg(), cyl(60, 96, 30, 66, C.green), ground),
  /** kon: a body with a round bottom and a point at the top. */
  'geom.kon': all(bg(), cone(60, 96, 32, 80, C.yellow), ground),
  /** klot: a ball-shaped body, round in every direction. */
  'geom.klot': all(bg(), ellipse(60, 106, 30, 5, 'rgba(0,0,0,0.12)', null), sphere(60, 64, 38, C.sky)),
  /** geometrisk kropp: a group of solids (cube, cylinder, cone, ball) on a table; a grey flat square card as contrast. */
  'geom.geometrisk-kropp': all(bg(), rect(4, 94, 112, 6, C.tan, 1, C.ink, 1.2), box(10, 94, 24, 24, 16, C.orange), cyl(56, 94, 12, 32, C.green), cone(84, 94, 12, 40, C.yellow), sphere(104, 82, 11, C.sky), greyed(rect(14, 14, 24, 24, C.white, 0, C.ink, 1.4))),
  /** basyta: a see-through box; the face it stands on is highlighted. */
  'geom.basyta': all(bg(), box(22, 96, 60, 50, 36, '#e6eaee', { hl: ['bottom'], ghost: true }), ground),
  /** sidoyta: the same box; one face on the side is highlighted instead. */
  'geom.sidoyta': all(bg(), box(22, 96, 60, 50, 36, '#e6eaee', { hl: ['front'], ghost: true }), ground),
  /** begränsningsyta: a box and its unfolded net — all six faces coloured. */
  'geom.begränsningsyta': all(bg(), box(8, 42, 26, 26, 18, '#e6eaee'), arrow(46, 34, 58, 34, C.grey, 2), ...[[66, 8], [52, 34], [66, 34], [80, 34], [94, 34], [66, 60]].map(([x, y]) => rect(x!, y!, 14, 14, FILL, 0, HL, 2)), num(30, 92, '6', 20, HL)),
  /** pyramid (geometri): a body with a square bottom and triangle sides meeting in a point (plain drawing, no desert). */
  'geom.pyramid.2': all(bg(), pyr(18, 98, 62, 40, 70, C.orange), ground),
  /** prisma: a body with two equal triangles at the ends and rectangles as sides. */
  'geom.prisma': all(bg(), prism(12, 96, 52, 44, 60, C.purple), ground),
  /** kubikcentimeter: a tiny cube, one ruler step long on every edge, next to a fingertip. */
  'geom.kubikcentimeter': all(bg(), ruler(10, 92, 100, 0, 14), path('M64 92 C60 72 60 52 68 42 C74 36 84 38 88 48 C92 60 90 78 86 92 Z', C.skin, C.ink, 1.6), path('M68 52 C70 44 82 44 84 52 C82 58 70 58 68 52 Z', '#f6dccb', C.ink, 1), box(30, 84, 12, 12, 12, FILL), seg([30, 92], [30, 86], HL, 1.6), seg([42, 92], [42, 86], HL, 1.6), dim([30, 64], [42, 64], '1', [0, -4], HL)),
  /** kubikdecimeter: a cube with edges of 10, = a milk carton of the same size. */
  'geom.kubikdecimeter': all(bg(), box(10, 96, 44, 44, 30, FILL), dim([10, 104], [54, 104], '10', [0, -3]), num(78, 68, '=', 20, HL), rect(88, 46, 24, 50, C.white, 2, C.ink, 1.6), path('M88 46 L100 34 L112 46 Z', C.white, C.ink, 1.6), rect(88, 60, 24, 18, C.sky, 0, null), num(100, 110, '1', 11), ground),
  /** kubikmeter: a big cube with edges of 1 m, a grown-up person beside it for size. */
  'geom.kubikmeter': all(bg(), box(8, 108, 56, 56, 24, FILL), person(100, 1.2, C.green), dim([8, 114], [64, 114], '1', [0, -3]), ground),
};
