/**
 * Matematik & naturvetenskap → Avancerad matematik → Linjär algebra, 3231–3237 (0.49): vectors, matrices,
 * matrix operations, linear systems, determinants, eigenvalues and eigenvectors, linear transformations.
 * Digits, the letters a–d, x, y, k, b, A, I and λ, and the signs + − · = [ ] | | ( ) { } may appear; no picture
 * contains a word that names its word. Close words share one layout where only the highlighted part differs
 * (vektor/skalär; belopp/komponent on the arrow (3, 4); huvuddiagonal/enhetsmatris/nollmatris on a matrix;
 * egenvektor/egenvärde on the same stretched grid; egenfrekvens/resonans on the same swing with a steady or a
 * growing wave; moturs/medurs on the same clock with the arrow turning the other way).
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL, T } from './people';
import { P, greyed } from './blindFix';

// ── Palette and small helpers ────────────────────────────────────────
const SOFT = '#f4f6f8';
const MARK = '#fff3b0';
const OK = '#3f9a5a';
const BLUE = '#3c7fb0';
const GRID = '#d9e2ea';
const SKY = '#e4f1fa';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ground = line('M4 112 L116 112', C.grey2, 2);
const bg = (col: string = SOFT) => rect(4, 4, 112, 108, col, 3, null);
const num = (x: number, y: number, s: string, size = 12, col: string = C.ink) => T(x, y, s, size, col);
const check = (x: number, y: number, s = 1, col: string = OK) => line(`M${x - 6 * s} ${y} L${x - 2 * s} ${y + 5 * s} L${x + 7 * s} ${y - 6 * s}`, col, 3 * s);
const cross = (x: number, y: number, s = 1, col: string = C.red) => line(`M${x - 5 * s} ${y - 5 * s} L${x + 5 * s} ${y + 5 * s} M${x + 5 * s} ${y - 5 * s} L${x - 5 * s} ${y + 5 * s}`, col, 3 * s);
const mark = (x: number, y: number, w: number, h: number) => rect(f1(x - w / 2), f1(y - h / 2), f1(w), f1(h), MARK, 3, HL, 2.2);
const card = (x: number, y: number, w: number, h: number, stroke: string = C.ink) => rect(x, y, w, h, C.white, 5, stroke, 1.6);
/** Square grid with cell size s. */
const grid = (x0: number, y0: number, cols: number, rows: number, s: number, col: string = GRID) => all(...range(cols + 1).map((i) => line(`M${x0 + i * s} ${y0} L${x0 + i * s} ${y0 + rows * s}`, col, 1)), ...range(rows + 1).map((j) => line(`M${x0} ${y0 + j * s} L${x0 + cols * s} ${y0 + j * s}`, col, 1)));
/** Standard coordinate plane: grid 12 px, origin at (24, 96). */
const OX = 24, OY = 96, S = 12;
const G = (i: number, j: number): [number, number] => [OX + i * S, OY - j * S];
const plane = (extra: Svg = '') => all(bg(), grid(12, 12, 8, 8, S), line(`M8 ${OY} L112 ${OY}`, C.grey, 1.6), line(`M${OX} 8 L${OX} 108`, C.grey, 1.6), extra);
/** Arrow with a dot at its start. */
const vec = (x1: number, y1: number, x2: number, y2: number, col: string = HL, sw = 3.4, dot = true) => all(arrow(x1, y1, x2, y2, col, sw), dot ? circle(x1, y1, 2.6, col, null) : '');
const vecG = (a: [number, number], b: [number, number], col: string = HL, sw = 3.4, dot = true) => vec(G(...a)[0], G(...a)[1], G(...b)[0], G(...b)[1], col, sw, dot);
/** A matrix of strings centred at (cx, cy); hl = highlighted cells; bars = determinant bars instead of brackets. */
type Cell = [number, number];
const mat = (cx: number, cy: number, m: string[][], o: { cw?: number; ch?: number; size?: number; hl?: Cell[]; dim?: boolean; bars?: boolean; br?: string; col?: string; tint?: Record<string, string> } = {}) => {
  const cw = o.cw ?? 18, chh = o.ch ?? 18, size = o.size ?? 13, cols = m[0]!.length;
  const w = cols * cw, h = m.length * chh, x0 = cx - w / 2, y0 = cy - h / 2;
  const X = (c: number) => f1(x0 + cw * (c + 0.5)), Y = (r: number) => f1(y0 + chh * (r + 0.5));
  const hl = o.hl ?? [];
  const on = (r: number, c: number) => hl.some(([a, b]) => a === r && b === c);
  const out: Svg[] = [];
  m.forEach((row, r) => row.forEach((t, c) => {
    const tint = o.tint?.[`${r},${c}`];
    if (tint) out.push(rect(f1(X(c) - cw / 2 + 1.5), f1(Y(r) - chh / 2 + 1.5), cw - 3, chh - 3, tint, 3, null));
    if (on(r, c)) out.push(rect(f1(X(c) - cw / 2 + 1.5), f1(Y(r) - chh / 2 + 1.5), cw - 3, chh - 3, MARK, 3, HL, 1.8));
    out.push(num(X(c), f1(Y(r) + size * 0.36), t, size, on(r, c) ? HL : o.dim && hl.length ? C.grey : (o.col ?? C.ink)));
  }));
  const bc = o.br ?? C.ink, L = f1(x0 - 2), R = f1(x0 + w + 2), T0 = f1(y0 - 2), B = f1(y0 + h + 2);
  out.push(o.bars ? line(`M${L} ${T0} L${L} ${B} M${R} ${T0} L${R} ${B}`, bc, 2.2) : line(`M${L + 5} ${T0} L${L} ${T0} L${L} ${B} L${L + 5} ${B} M${R - 5} ${T0} L${R} ${T0} L${R} ${B} L${R - 5} ${B}`, bc, 2.2));
  return { svg: all(...out), X, Y, x0, y0, w, h };
};
const M3 = [['2', '7', '1'], ['4', '5', '3'], ['6', '8', '9']];
const thermo = (x: number, y: number, col: string = C.red) => all(rect(x - 5, y - 40, 10, 44, C.white, 5, C.ink, 1.6), rect(x - 2.5, y - 22, 5, 24, col, 1, null), circle(x, y + 6, 7, col, C.ink, 1.6), ...range(4).map((i) => line(`M${x + 5} ${y - 34 + i * 8} L${x + 9} ${y - 34 + i * 8}`, C.ink, 1)));
const house = (x: number, y: number, col: string = C.sky, s = 1) => at(x, y, s, path('M-7 0 L-7 -8 L0 -14 L7 -8 L7 0 Z', col, C.ink, 1.3), rect(-2, -5, 4, 5, C.ink, 0.5, null));
const car = (x: number, y: number, col: string = C.red, flip = false) => g(`translate(${x} ${y})${flip ? ' scale(-1 1)' : ''}`, path('M-14 0 L-14 -7 L-8 -7 L-4 -13 L6 -13 L10 -7 L14 -7 L14 0 Z', col, C.ink, 1.4), rect(-3, -11.5, 7, 4, '#bfe3f5', 1, null), circle(-8, 1, 3.2, C.dark, null), circle(8, 1, 3.2, C.dark, null));
const clock = (inner: Svg) => all(bg(), circle(60, 60, 30, C.white, C.ink, 2.2), ...range(12).map((i) => { const a = (i / 12) * Math.PI * 2; return line(`M${f1(60 + Math.sin(a) * 26)} ${f1(60 - Math.cos(a) * 26)} L${f1(60 + Math.sin(a) * 29)} ${f1(60 - Math.cos(a) * 29)}`, C.ink, i % 3 ? 1 : 2); }), num(60, 42, '12', 8), line('M60 60 L60 40', C.ink, 2.4), line('M60 60 L72 66', C.ink, 2.4), circle(60, 60, 2.4, C.ink, null), inner);
/** Circular arrow around the clock: ccw = against the hands. */
const turn = (ccw: boolean) => {
  const r = 42, a0 = -60, a1 = 210, pt = (d: number) => [f1(60 + Math.cos((d * Math.PI) / 180) * r), f1(60 + Math.sin((d * Math.PI) / 180) * r)] as const;
  const [sx, sy] = pt(a0), [ex, ey] = pt(a1);
  const arc = path(`M${sx} ${sy} A${r} ${r} 0 1 1 ${ex} ${ey}`, 'none', HL, 4);
  const head = (d: number, dir: 1 | -1) => { const [x, y] = pt(d), tx = -Math.sin((d * Math.PI) / 180) * dir, ty = Math.cos((d * Math.PI) / 180) * dir; return arrow(f1(x - tx * 6), f1(y - ty * 6), f1(x + tx * 3), f1(y + ty * 3), HL, 4); };
  // the arc runs clockwise on screen from a0 to a1 (sweep 1); for ccw the head sits at the start pointing back
  return all(arc, ccw ? head(a0, -1) : head(a1, 1));
};
/** Swing on a frame with a child; returns the drawing. */
const swing = (push: boolean) => all(line('M14 82 L26 20 L38 82 M26 20 L64 20', C.brown, 3), line('M26 20 L18 34', C.brown, 2), line('M30 22 L50 66 M40 21 L58 64', C.dark, 1.4), at(54, 12, 0.5, P({ x: 0, h: 0.75, top: C.orange })), rect(46, 64, 16, 3, C.brown, 1, C.ink, 1), path('M30 74 C38 84 52 86 66 80', 'none', C.grey, 1.6, ), push ? at(88, 13, 0.62, P({ x: 0, h: 0.9, top: C.green })) : '', push ? arrow(78, 54, 66, 60, HL, 2.4) : '');
/** Wave along y from x 8 to 112; grow = amplitude grows. */
const wave = (y: number, grow: boolean) => {
  const pts = range(97).map((i) => { const x = 10 + i, amp = grow ? 1 + i * 0.12 : 7; return `${i ? 'L' : 'M'}${x} ${f1(y - Math.sin(i / 5.5) * amp)}`; });
  return line(pts.join(' '), HL, 2.6);
};

export const LINALG_MOTIFS: Record<string, Svg> = {
  // ── 3231 Vektorer ────────────────────────────────────────────────────
  /** vektor: a coordinate grid with one big highlighted arrow (length and direction marked); a grey thermometer card with 20° in the corner. */
  'lina.vektor': plane(all(greyed(card(70, 70, 38, 30), num(89, 91, '20°', 13)), vecG([0, 0], [5, 6], HL, 4.4), path(`M${OX + 20} ${OY} A20 20 0 0 0 ${f1(OX + 20 * Math.cos(0.876))} ${f1(OY - 20 * Math.sin(0.876))}`, 'none', BLUE, 2), line(`M${OX - 8} ${OY - 6} L${OX + 52} ${OY - 78}`, HL, 1.2, '3 3'))),
  /** skalär: the same corner card, now large and highlighted: a thermometer with the number 20°; a grey arrow below is crossed out. */
  'lina.skalär': all(bg(), rect(10, 10, 100, 62, MARK, 6, HL, 2.6), thermo(32, 52), num(76, 52, '20°', 30, HL), greyed(vec(22, 104, 64, 84, C.dark, 3)), cross(44, 94, 1.1)),
  /** pil: a signpost with a green sign showing a big white arrow pointing right. */
  'lina.pil.2': all(bg(SKY), rect(56, 50, 6, 62, C.grey, 1, C.ink, 1.4), rect(18, 18, 84, 38, OK, 4, C.ink, 2), path('M28 32 L70 32 L70 24 L92 37 L70 50 L70 42 L28 42 Z', C.white, C.ink, 1.4), path('M4 112 C30 104 90 104 116 112 Z', '#8cc96a', null), ground),
  /** belopp: the arrow (3, 4) on a grid with a ruler laid along it; the tag on the ruler says 5 (highlighted); the legs 3 and 4 are grey. */
  'lina.belopp.2': plane(all(line(`M${G(0, 0)[0]} ${G(0, 0)[1]} L${G(3, 0)[0]} ${G(3, 0)[1]} L${G(3, 4)[0]} ${G(3, 4)[1]}`, C.grey, 1.6, '3 3'), num(G(1.5, 0)[0], OY + 11, '3', 9, C.grey), num(G(3, 2)[0] + 8, G(3, 2)[1] + 3, '4', 9, C.grey), g(`translate(${G(0, 0)[0]} ${G(0, 0)[1]}) rotate(-53.13)`, rect(0, -18, 60, 9, C.yellow, 1, C.ink, 1.2), ...range(6).map((i) => line(`M${i * 12} -18 L${i * 12} -13`, C.ink, 1))), vecG([0, 0], [3, 4], C.dark, 3.4), mark(G(1.2, 3.6)[0], G(1.2, 3.6)[1], 22, 20), num(G(1.2, 3.6)[0], G(1.2, 3.6)[1] + 6, '5', 16, HL), num(86, 30, '|v| = 5', 12, HL))),
  /** komponent: the same arrow (3, 4); now the dashed sideways part 3 and the upward part 4 are highlighted with their numbers. */
  'lina.komponent': plane(all(vecG([0, 0], [3, 4], C.dark, 3), line(`M${G(0, 0)[0]} ${G(0, 0)[1] + 0} L${G(3, 0)[0]} ${G(3, 0)[1]}`, HL, 4), line(`M${G(3, 0)[0]} ${G(3, 0)[1]} L${G(3, 4)[0]} ${G(3, 4)[1]}`, HL, 4), mark(G(1.5, 0)[0], OY + 9, 16, 15), num(G(1.5, 0)[0], OY + 13, '3', 11, HL), mark(G(3, 2)[0] + 11, G(3, 2)[1], 16, 15), num(G(3, 2)[0] + 11, G(3, 2)[1] + 4, '4', 11, HL), num(88, 30, '(3, 4)', 12, C.dark))),
  /** startpunkt: a dark arrow on a grid; its start is a big highlighted ring with a small start flag. */
  'lina.startpunkt': plane(all(vecG([1, 1], [6, 5], C.dark, 3.4, false), circle(G(1, 1)[0], G(1, 1)[1], 7, MARK, HL, 3), circle(G(1, 1)[0], G(1, 1)[1], 2.6, HL, null), line(`M${G(1, 1)[0]} ${G(1, 1)[1] - 7} L${G(1, 1)[0]} ${G(1, 1)[1] - 30}`, C.ink, 1.6), path(`M${G(1, 1)[0]} ${G(1, 1)[1] - 30} L${G(1, 1)[0] + 14} ${G(1, 1)[1] - 25} L${G(1, 1)[0]} ${G(1, 1)[1] - 20} Z`, HL, C.ink, 1.2))),
  /** nollvektor: on the grid only a highlighted dot at the origin with (0, 0); a grey arrow beside it is crossed out. */
  'lina.nollvektor': plane(all(circle(OX, OY, 8, MARK, HL, 2.6), circle(OX, OY, 3.4, HL, null), mark(54, 74, 44, 20), num(54, 79, '(0, 0)', 13, HL), greyed(vec(60, 50, 100, 22, C.dark, 3)), cross(80, 36, 1.1))),
  /** enhetsvektor: a big grid (one square = 1) with a dashed circle of radius 1; four highlighted arrows of length 1 end on the circle; a grey long arrow for contrast. */
  'lina.enhetsvektor': all(bg(), grid(12, 12, 4, 4, 24), circle(60, 60, 24, 'none', BLUE, 1.6), line('M60 60 L84 60', C.ink, 0.1), vec(60, 60, 84, 60, HL, 3.4), vec(60, 60, 60, 36, HL, 3.4), vec(60, 60, 43, 77, HL, 3.4), vec(60, 60, 77, 77, HL, 3.4), mark(72, 50, 14, 14), num(72, 54, '1', 10, HL), greyed(vec(14, 104, 50, 104 - 36 * 0.1, C.dark, 2.4))),
  /** motsatt: two highlighted arrows from one centre point pointing left and right; below, two cars drive away from each other. */
  'lina.motsatt': all(bg(SKY), circle(60, 40, 4, C.ink, null), vec(60, 40, 18, 40, HL, 4.4, false), vec(60, 40, 102, 40, HL, 4.4, false), rect(4, 84, 112, 24, C.grey2, 0, null), line('M8 96 L112 96', C.white, 1.6, '6 5'), car(34, 92, C.red, true), car(86, 104, C.denim), ground),
  /** förskjutning: a grey triangle and the same triangle highlighted further right and up; three parallel dashed arrows join the corners. */
  'lina.förskjutning': plane(all(path(`M${G(0, 1)[0]} ${G(0, 1)[1]} L${G(2, 1)[0]} ${G(2, 1)[1]} L${G(1, 3)[0]} ${G(1, 3)[1]} Z`, C.grey2, C.grey, 1.6), ...[[0, 1], [2, 1], [1, 3]].map(([i, j]) => arrow(G(i!, j!)[0], G(i!, j!)[1], G(i! + 4, j! + 3)[0] - 3, G(i! + 4, j! + 3)[1] + 2, BLUE, 1.8)), path(`M${G(4, 4)[0]} ${G(4, 4)[1]} L${G(6, 4)[0]} ${G(6, 4)[1]} L${G(5, 6)[0]} ${G(5, 6)[1]} Z`, MARK, HL, 2.6))),
  /** vindriktning: a windsock on a pole blowing straight to the right, wind lines and a big highlighted arrow above it. */
  'lina.vindriktning': all(bg(SKY), rect(24, 40, 4, 72, C.grey, 1, C.ink, 1.2), path('M28 44 L80 50 L80 64 L28 70 Z', C.white, C.ink, 1.6), path('M38 45.2 L48 46.3 L48 67.6 L38 68.8 Z M58 47.5 L68 48.6 L68 65.4 L58 66.6 Z', C.red, null), ...[30, 76, 88].map((y) => line(`M${y === 30 ? 40 : 60} ${y} C${y === 30 ? 60 : 76} ${y - 4} ${y === 30 ? 80 : 92} ${y + 4} ${y === 30 ? 100 : 110} ${y}`, C.grey, 1.6)), vec(36, 18, 104, 18, HL, 4.4, false), path('M4 112 C30 104 90 104 116 112 Z', '#8cc96a', null), ground),
  /** addera: arrow a and arrow b placed head to tail (blue); the arrow from the start of a to the end of b is highlighted; a + sign. */
  'lina.addera': plane(all(vecG([0, 0], [4, 1], BLUE, 3), vecG([4, 1], [5, 5], BLUE, 3, false), vecG([0, 0], [5, 5], HL, 4.2), circle(94, 70, 10, MARK, HL, 2), num(94, 76, '+', 18, HL))),

  // ── 3232 Matriser ──────────────────────────────────────────────────────
  /** matris: a 2 × 3 block of numbers inside large highlighted brackets; small arrows show 2 rows and 3 columns. */
  'lina.matris': (() => { const m = mat(60, 56, [['3', '1', '4'], ['1', '5', '9']], { cw: 24, ch: 24, size: 16, br: HL }); return all(bg(), rect(18, 28, 84, 56, MARK, 4, null), m.svg, arrow(16, 44, 16, 70, C.grey, 1.8), num(10, 61, '2', 9, C.grey), arrow(30, 96, 92, 96, C.grey, 1.8), num(60, 108, '3', 9, C.grey)); })(),
  /** element: the same 2 × 3 matrix in grey; one number (5) is ringed and highlighted, with an arrow to it. */
  'lina.element.2': (() => { const m = mat(60, 62, [['3', '1', '4'], ['1', '5', '9']], { cw: 24, ch: 24, size: 16, hl: [[1, 1]], dim: true }); return all(bg(), m.svg, circle(m.X(1), m.Y(1), 14, 'none', HL, 2.4), arrow(90, 16, m.X(1) + 9, m.Y(1) - 12, HL, 2.6)); })(),
  /** hakparentes: two huge highlighted square brackets [ ] with grey numbers between; small grey round brackets crossed out below. */
  'lina.hakparentes': all(bg(), line('M40 14 L24 14 L24 82 L40 82', HL, 6), line('M80 14 L96 14 L96 82 L80 82', HL, 6), num(60, 42, '3   1', 13, C.grey), num(60, 66, '2   4', 13, C.grey), greyed(num(60, 106, '( )', 18)), cross(80, 100, 0.9)),
  /** index: a big a with the small numbers 2 3 at its lower right highlighted; arrows lead to row 2 and column 3 of a small grid. */
  'lina.index.2': all(bg(), num(26, 42, 'a', 34, C.dark), mark(48, 40, 26, 18), num(48, 46, '23', 14, HL), grid(56, 58, 3, 3, 14, C.grey), rect(56, 72, 42, 14, 'none', 0, BLUE, 1.6), rect(84, 58, 14, 42, 'none', 0, BLUE, 1.6), rect(85, 73, 12, 12, MARK, 1, HL, 2), num(48, 83, '2', 11, BLUE), num(91, 112 - 2, '3', 11, BLUE)),
  /** kvadratisk: a 3 × 3 matrix in a highlighted square frame with a tick; below, a grey 2 × 4 matrix is crossed out. */
  'lina.kvadratisk': (() => { const m = mat(50, 40, M3, { cw: 16, ch: 16, size: 11 }); const r = mat(60, 92, [['1', '0', '2', '5'], ['3', '4', '1', '0']], { cw: 14, ch: 13, size: 9 }); return all(bg(), rect(m.x0 - 6, m.y0 - 6, m.w + 12, m.h + 12, MARK, 3, HL, 2.6), m.svg, check(98, 38, 1.2), greyed(r.svg), cross(104, 92, 1)); })(),
  /** huvuddiagonal: a 3 × 3 matrix with different numbers; the cells from the top left to the bottom right are highlighted and joined by a diagonal line. */
  'lina.huvuddiagonal': (() => { const m = mat(60, 60, M3, { cw: 26, ch: 26, size: 15, hl: [[0, 0], [1, 1], [2, 2]], dim: true }); return all(bg(), line(`M${m.X(0) - 16} ${m.Y(0) - 16} L${m.X(2) + 16} ${m.Y(2) + 16}`, HL, 2, '4 3'), m.svg); })(),
  /** enhetsmatris: a 3 × 3 matrix with 1 on the diagonal (highlighted) and 0 everywhere else. */
  'lina.enhetsmatris': (() => { const m = mat(60, 60, [['1', '0', '0'], ['0', '1', '0'], ['0', '0', '1']], { cw: 26, ch: 26, size: 17, hl: [[0, 0], [1, 1], [2, 2]] }); return all(bg(), m.svg); })(),
  /** nollmatris: a 2 × 3 matrix where every element is 0, all highlighted. */
  'lina.nollmatris': (() => { const z = [['0', '0', '0'], ['0', '0', '0']]; const m = mat(60, 60, z, { cw: 26, ch: 26, size: 17, hl: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]] }); return all(bg(), m.svg); })(),
  /** pixel: a small picture of a heart made of square pixels on a screen; a magnifying glass shows that one square is a single colour. */
  'lina.pixel': (() => { const H = ['01100110', '11111111', '11111111', '01111110', '00111100', '00011000']; return all(bg(), rect(8, 14, 70, 58, C.dark, 4, C.ink, 1.6), ...H.flatMap((row, r) => row.split('').map((b, c) => rect(13 + c * 7.5, 20 + r * 7.5, 7, 7, b === '1' ? C.red : '#e8eef3', 0, null))), rect(13 + 2 * 7.5, 20 + 7.5, 7, 7, 'none', 0, HL, 1.6), line('M35 31 L74 66', HL, 1.2, '2 2'), circle(86, 76, 18, C.white, C.ink, 2.4), rect(76, 66, 20, 20, C.red, 0, HL, 2), line('M99 89 L110 102', C.ink, 4.4), rect(36, 76, 14, 10, C.grey, 1, null), rect(26, 86, 34, 4, C.grey, 1, null)); })(),
  /** kalkylark: a laptop showing a sheet of small cells in rows and columns, with numbers; the sum cell at the bottom is highlighted. */
  'lina.kalkylark': all(bg(), rect(14, 14, 92, 66, C.dark, 4, C.ink, 1.6), rect(18, 18, 84, 58, C.white, 1, null), ...range(5).map((r) => range(4).map((c) => rect(18 + c * 21, 18 + r * 11.6, 21, 11.6, r === 0 || c === 0 ? '#e1e7ed' : C.white, 0, '#b8c2cc', 0.8)).join('')), ...[['120', '45'], ['80', '30'], ['60', '25']].map(([a, b], i) => num(49.5, 37.5 + i * 11.6, a!, 7.5) + num(70.5, 37.5 + i * 11.6, b!, 7.5)), rect(39, 64.4, 21, 11.6, MARK, 0, HL, 1.8), num(49.5, 72.5, '260', 7.5, HL), path('M6 84 L114 84 L106 94 L14 94 Z', C.grey2, C.ink, 1.6)),
  /** avståndstabell: a square table with small houses as headers for three towns; the numbers are distances, zeros on the diagonal; a car on a road below. */
  'lina.avståndstabell': all(bg(), ...range(3).map((i) => house(46 + i * 22, 24, [C.sky, C.yellow, C.pink][i]!) + house(22, 44 + i * 18, [C.sky, C.yellow, C.pink][i]!)), rect(35, 31, 66, 54, C.white, 2, C.ink, 1.4), line('M57 31 L57 85 M79 31 L79 85 M35 49 L101 49 M35 67 L101 67', '#b8c2cc', 1), ...[['0', '470', '610'], ['470', '0', '270'], ['610', '270', '0']].flatMap((row, r) => row.map((t, c) => num(46 + c * 22, 44 + r * 18, t, 8, t === '0' ? C.grey : HL))), line('M8 102 L112 102', C.grey2, 8), line('M10 102 L110 102', C.white, 1, '5 4'), car(90, 104, C.red)),

  // ── 3233 Matrisoperationer ────────────────────────────────────────────
  /** subtrahera: 9 − 4 = 5 with the minus sign highlighted; nine blocks, four of them lifted away with an arrow. */
  'lina.subtrahera': all(bg(), num(28, 38, '9', 24), mark(48, 30, 20, 22), num(48, 38, '−', 26, HL), num(68, 38, '4', 24), num(98, 38, '= 5', 18, C.grey), ...range(5).map((i) => rect(12 + i * 13, 88, 12, 12, C.sky, 1, C.ink, 1)), ...range(4).map((i) => rect(68 + (i % 2) * 13, 58 + Math.floor(i / 2) * 13, 12, 12, 'none', 1, HL, 1.6)), arrow(64, 94, 74, 86, HL, 2), ground),
  /** elementvis: two 2 × 2 matrices; each pair of numbers on the same place has its own colour, and a thin line joins each pair. */
  'lina.elementvis': (() => { const tint = { '0,0': '#ffd9c7', '0,1': '#d3ecd8', '1,0': '#d6e6f5', '1,1': '#efe0f5' }; const a = mat(28, 52, [['1', '2'], ['3', '4']], { cw: 19, ch: 20, size: 13, tint }), b = mat(92, 52, [['5', '6'], ['7', '8']], { cw: 19, ch: 20, size: 13, tint }); const cols = ['#e4572e', OK, BLUE, C.purple]; return all(bg(), ...[[0, 0], [0, 1], [1, 0], [1, 1]].map(([r, c], i) => path(`M${a.X(c!)} ${a.Y(r!) + 8} C${a.X(c!)} ${88 + i * 5} ${b.X(c!)} ${88 + i * 5} ${b.X(c!)} ${b.Y(r!) + 8}`, 'none', cols[i]!, 1.6)), a.svg, b.svg, num(60, 57, '+', 16)); })(),
  /** matrismultiplikation: matrix A with its first row highlighted · matrix B with its first column highlighted → the result matrix with only the top-left element highlighted. */
  'lina.matrismultiplikation': (() => { const a = mat(22, 40, [['1', '2'], ['3', '4']], { cw: 14, ch: 16, size: 11 }), b = mat(66, 40, [['5', '6'], ['7', '8']], { cw: 14, ch: 16, size: 11 }), r = mat(66, 90, [['19', '22'], ['43', '50']], { cw: 20, ch: 16, size: 10, hl: [[0, 0]], dim: true }); return all(bg(), rect(a.x0, a.y0 + 1, a.w, 14, MARK, 3, HL, 2), rect(b.x0 + 1, b.y0, 12, b.h, MARK, 3, HL, 2), a.svg, b.svg, num(44, 45, '·', 18), arrow(66, 60, 66, 72, HL, 2.6), r.svg, num(26, 92, '1·5 + 2·7', 8, HL), arrow(44, 89, 54, 89, HL, 1.6)); })(),
  /** skalärprodukt: (2, 3) · (4, 1); arcs join 2 with 4 and 3 with 1; the answer is the single highlighted number 11. */
  'lina.skalärprodukt': all(bg(), num(32, 46, '(2, 3)', 16), num(60, 46, '·', 20), num(88, 46, '(4, 1)', 16), path('M24 26 C40 8 72 8 80 26', 'none', HL, 1.8), path('M38 52 C52 66 82 66 96 52', 'none', BLUE, 1.8), num(60, 80, '2·4 + 3·1', 11, C.grey), circle(60, 98, 13, MARK, HL, 2.4), num(60, 103, '11', 14, HL)),
  /** byta plats: two people on two chairs, with two curved arrows showing that they swap seats. */
  'lina.byta-plats': all(bg('#f6efe4'), ellipse(30, 110, 20, 5, '#ffd9c7', C.ink, 1.2), ellipse(90, 110, 20, 5, '#d6e6f5', C.ink, 1.2), at(30, 12, 0.88, P({ x: 0, h: 0.95, top: C.orange })), at(90, 12, 0.88, P({ x: 0, h: 0.95, top: C.green })), path('M36 16 C48 0 72 0 84 16', 'none', HL, 3), arrow(80, 12, 85, 18, HL, 3), path('M76 52 C66 62 54 62 44 52', 'none', HL, 3), arrow(48, 56, 43, 50, HL, 3)),
  /** kommutativ: 3 · 5 = 5 · 3 in a highlighted frame, with swap arrows over the 3 and the 5 and a tick; 2 + 7 = 7 + 2 smaller below. */
  'lina.kommutativ': all(bg(), rect(8, 30, 104, 38, MARK, 6, HL, 2.4), num(60, 57, '3 · 5 = 5 · 3', 19, HL), path('M20 30 C30 14 44 14 52 30', 'none', BLUE, 2), path('M68 30 C76 14 92 14 100 30', 'none', BLUE, 2), arrow(48, 24, 52, 30, BLUE, 2), arrow(96, 24, 100, 30, BLUE, 2), num(54, 94, '2 + 7 = 7 + 2', 13, C.dark), check(100, 90, 1)),
  /** transponera: a 2 × 3 matrix with the first row orange and the second blue → a 3 × 2 matrix where the orange numbers form the first column and the blue the second. */
  'lina.transponera': (() => { const tA = { '0,0': '#ffd9c7', '0,1': '#ffd9c7', '0,2': '#ffd9c7', '1,0': '#d6e6f5', '1,1': '#d6e6f5', '1,2': '#d6e6f5' }; const tB = { '0,0': '#ffd9c7', '1,0': '#ffd9c7', '2,0': '#ffd9c7', '0,1': '#d6e6f5', '1,1': '#d6e6f5', '2,1': '#d6e6f5' }; const a = mat(34, 40, [['1', '2', '3'], ['4', '5', '6']], { cw: 16, ch: 18, size: 12, tint: tA }), b = mat(86, 70, [['1', '4'], ['2', '5'], ['3', '6']], { cw: 16, ch: 18, size: 12, tint: tB }); return all(bg(), a.svg, b.svg, path('M38 60 C40 86 56 92 70 84', 'none', HL, 3), arrow(64, 88, 71, 84, HL, 3), num(104, 34, 'T', 13, HL)); })(),
  /** invers: a card with a grey house turned by an arrow A; a highlighted arrow A⁻¹ turns it back to the start; a tick. */
  'lina.invers': all(bg(), card(8, 34, 30, 34), house(23, 60, C.sky, 1.3), card(82, 34, 30, 34), g('translate(97 51) rotate(90)', house(0, 9, C.sky, 1.3)), arrow(42, 40, 78, 40, C.dark, 2.6), num(60, 32, 'A', 12, C.dark), path('M78 64 C70 80 50 80 42 64', 'none', HL, 3.4), arrow(46, 70, 41, 63, HL, 3.4), mark(60, 92, 34, 20), num(60, 97, 'A⁻¹', 14, HL), check(23, 92, 1)),

  // ── 3234 Linjära ekvationssystem ──────────────────────────────────────
  /** ekvationssystem: two equations under each other, x + y = 10 and x − y = 2, held together by a big highlighted brace. */
  'lina.ekvationssystem': all(bg(), card(28, 26, 84, 64), path('M24 24 C14 24 18 50 10 58 C18 66 14 92 24 92', 'none', HL, 4), num(70, 50, 'x + y = 10', 15), num(70, 78, 'x − y = 2', 15)),
  /** substitutionsmetod: top card y = 10 − x with 10 − x boxed; an arrow carries the box into the place of y in the lower equation. */
  'lina.substitutionsmetod': all(bg(), card(14, 10, 92, 30), num(36, 31, 'y =', 15), rect(54, 15, 46, 20, MARK, 4, HL, 2.2), num(77, 31, '10 − x', 14, HL), path('M77 40 C77 56 40 52 40 70', 'none', HL, 2.6), arrow(40, 64, 40, 72, HL, 2.6), card(6, 74, 108, 30), num(20, 95, 'x −', 13), rect(30, 78, 50, 22, MARK, 4, HL, 2.2), num(55, 94, '(10 − x)', 13, HL), num(97, 95, '= 2', 13)),
  /** eliminera: 3x + y on a card; the highlighted y is being rubbed out by an eraser, with crumbs. */
  'lina.eliminera': all(bg(), card(10, 34, 100, 40), num(36, 62, '3x +', 20), num(82, 62, 'y', 26, 'rgba(228,87,46,0.35)'), line('M70 46 L94 66 M94 46 L70 66', HL, 3), g('translate(92 30) rotate(35)', rect(-10, -16, 20, 30, C.pink, 3, C.ink, 1.6), rect(-10, 2, 20, 12, C.sky, 2, C.ink, 1.4)), ...[[72, 84], [80, 88], [90, 82], [86, 92]].map(([x, y]) => circle(x!, y!, 1.6, C.pink, null))),
  /** additionsmetod: x + y = 10 over x − y = 2, a big highlighted + on the left, a line, and the sum 2x = 12 below. */
  'lina.additionsmetod': all(bg(), card(28, 10, 84, 28), num(70, 30, 'x + y = 10', 14), card(28, 42, 84, 28), num(70, 62, 'x − y = 2', 14), circle(15, 40, 10, MARK, HL, 2.2), num(15, 46, '+', 18, HL), line('M28 78 L112 78', HL, 3), mark(70, 94, 60, 22), num(70, 100, '2x = 12', 15, HL)),
  /** sakna lösning: a coordinate grid with two highlighted parallel lines that never meet; a no-entry ring between them. */
  'lina.sakna-lösning': plane(all(line(`M${G(-1, 0)[0]} ${G(-1, 0)[1]} L${G(6, 7)[0]} ${G(6, 7)[1]}`, HL, 3.4), line(`M${G(2, -1)[0]} ${G(2, -1)[1]} L${G(7, 4)[0]} ${G(7, 4)[1]}`, HL, 3.4), circle(84, 30, 12, C.white, C.red, 3), line('M75.5 38.5 L92.5 21.5', C.red, 3))),
  /** oändligt många lösningar: two lines lying exactly on top of each other (thick highlighted and dashed blue), many dots on them and ∞. */
  'lina.oändligt-många-lösningar': plane(all(line(`M${G(-1, 0)[0]} ${G(-1, 0)[1]} L${G(6, 7)[0]} ${G(6, 7)[1]}`, HL, 6), line(`M${G(-1, 0)[0]} ${G(-1, 0)[1]} L${G(6, 7)[0]} ${G(6, 7)[1]}`, BLUE, 2, '5 4'), ...range(7).map((i) => circle(G(i - 0.5, i + 0.5)[0], G(i - 0.5, i + 0.5)[1], 2.6, C.white, C.ink, 1.4)), mark(88, 80, 30, 24), num(88, 89, '∞', 22, HL))),

  // ── 3235 Determinanter ────────────────────────────────────────────────
  /** determinant: a 2 × 2 block of numbers between two straight bars, = and the single highlighted number 10. */
  'lina.determinant': (() => { const m = mat(36, 56, [['3', '1'], ['2', '4']], { cw: 22, ch: 24, size: 17, bars: true }); return all(bg(), m.svg, num(70, 62, '=', 20), mark(96, 56, 30, 30), num(96, 64, '10', 19, HL)); })(),
  /** korsvis: a 2 × 2 matrix a b / c d with two crossing arrows over the diagonals, one highlighted (a·d) and one blue (b·c), like an X. */
  'lina.korsvis': (() => { const m = mat(60, 50, [['a', 'b'], ['c', 'd']], { cw: 40, ch: 34, size: 20 }); return all(bg(), m.svg, arrow(m.X(0) + 6, m.Y(0) - 2, m.X(1) - 6, m.Y(1) - 10, HL, 3.4), arrow(m.X(1) - 6, m.Y(0) - 2, m.X(0) + 6, m.Y(1) - 10, BLUE, 3.4), num(60, 104, 'a·d − b·c', 13, C.dark)); })(),
  /** skalfaktor: a small grey square with side 1 → an arrow with a highlighted tag × 3 → a large square with side 3. */
  'lina.skalfaktor': all(bg(), rect(10, 70, 14, 14, C.grey2, 0, C.grey, 1.6), num(17, 96, '1', 9, C.grey), arrow(28, 76, 48, 76, HL, 3), mark(38, 60, 26, 18), num(38, 65, '× 3', 11, HL), rect(56, 34, 54, 54, 'none', 0, HL, 3), ...range(2).map((i) => line(`M${74 + i * 18} 34 L${74 + i * 18} 88 M56 ${52 + i * 18} L110 ${52 + i * 18}`, C.grey2, 1)), num(83, 102, '3', 11, HL)),
  /** inverterbar: top, a square → a parallelogram with a dark arrow there and a highlighted arrow back, and a tick; bottom, grey: a square squashed into a line, the way back crossed out. */
  'lina.inverterbar': all(bg(), rect(10, 14, 22, 22, C.sky, 0, C.ink, 1.4), path('M80 36 L102 36 L110 14 L88 14 Z', C.sky, C.ink, 1.4), arrow(38, 20, 74, 20, C.dark, 2.4), path('M74 32 C64 40 48 40 38 32', 'none', HL, 3), arrow(42, 36, 37, 31, HL, 3), check(60, 52, 1), greyed(rect(10, 70, 22, 22, C.sky, 0, C.ink, 1.4), line('M80 92 L110 82', C.ink, 3), arrow(38, 76, 74, 76, C.dark, 2.4), path('M74 94 C64 102 48 102 38 94', 'none', C.dark, 2.4)), cross(56, 99, 1)),
  /** spegelvänd: a dashed mirror line; on the left a grey flag on a pole pointing right, on the right the same flag highlighted but turned the other way. */
  'lina.spegelvänd': all(bg(), line('M60 8 L60 108', BLUE, 2, '5 4'), greyed(line('M24 102 L24 22', C.ink, 3), path('M24 22 L48 30 L24 40 Z', C.dark, C.ink, 1.4), path('M24 46 L40 46 L40 58 L24 58', 'none', C.ink, 2.4)), line('M96 102 L96 22', C.ink, 3), path('M96 22 L72 30 L96 40 Z', HL, C.ink, 1.4), path('M96 46 L80 46 L80 58 L96 58', 'none', HL, 2.4), arrow(44, 80, 76, 80, C.grey, 1.8), ground),

  // ── 3236 Egenvärden och egenvektorer (shared stretched grid) ──────────
  /** egenvektor: the diagonal line through the origin is highlighted; a short and a long arrow lie on it (the same direction); two grey arrows elsewhere turn to a new direction (dashed). */
  'lina.egenvektor': plane(all(line(`M${G(-1, -1)[0]} ${G(-1, -1)[1]} L${G(7, 7)[0]} ${G(7, 7)[1]}`, HL, 1.6, '4 3'), greyed(vecG([0, 0], [3, 0], C.dark, 2.4), vecG([0, 0], [5, 2], C.dark, 2.4, false)), path(`M${G(3, 0)[0] + 2} ${G(3, 0)[1] - 4} C${G(4.6, 0.4)[0]} ${G(4.6, 0.4)[1]} ${G(4.8, 1.2)[0]} ${G(4.8, 1.2)[1]} ${G(4.8, 1.8)[0]} ${G(4.8, 1.8)[1]}`, 'none', C.grey, 1.4, ), vecG([0, 0], [6, 6], HL, 3), vecG([0, 0], [3, 3], HL, 5.4))),
  /** egenvärde: the same picture, now the arrows on the diagonal are dark and the number × 2 is highlighted, with brackets showing one length and two lengths. */
  'lina.egenvärde': plane(all(line(`M${G(-1, -1)[0]} ${G(-1, -1)[1]} L${G(7, 7)[0]} ${G(7, 7)[1]}`, C.grey, 1.2, '4 3'), vecG([0, 0], [6, 6], C.dark, 2.4), vecG([0, 0], [3, 3], C.dark, 4.4), line(`M${G(0, 0)[0] + 6} ${G(0, 0)[1] + 6} L${G(3, 3)[0] + 6} ${G(3, 3)[1] + 6}`, BLUE, 2), line(`M${G(0, 0)[0] + 12} ${G(0, 0)[1] + 12} L${G(6, 6)[0] + 12} ${G(6, 6)[1] + 12}`, HL, 2.4), mark(88, 82, 32, 22), num(88, 88, '× 2', 15, HL))),
  /** karakteristisk ekvation: a highlighted card det(A − λI) = 0 and, below it, two small results λ = 2 and λ = 3. */
  'lina.karakteristisk-ekvation': all(bg(), rect(6, 22, 108, 36, MARK, 6, HL, 2.6), num(60, 46, 'det(A − λI) = 0', 14, HL), arrow(60, 62, 60, 74, C.grey, 2), card(16, 80, 38, 22), num(35, 95, 'λ = 2', 11, C.dark), card(66, 80, 38, 22), num(85, 95, 'λ = 3', 11, C.dark)),
  /** diagonalisera: a grey 3 × 3 matrix full of numbers → arrow → a 3 × 3 matrix with highlighted numbers only on the diagonal and 0 elsewhere. */
  'lina.diagonalisera': (() => { const a = mat(30, 40, [['4', '1', '2'], ['1', '3', '5'], ['2', '5', '6']], { cw: 14, ch: 14, size: 9, col: C.grey }), b = mat(86, 84, [['2', '0', '0'], ['0', '5', '0'], ['0', '0', '7']], { cw: 16, ch: 16, size: 12, hl: [[0, 0], [1, 1], [2, 2]], dim: true }); return all(bg(), a.svg, path('M30 64 C30 80 44 86 56 84', 'none', HL, 3), arrow(50, 86, 58, 84, HL, 3), b.svg); })(),
  /** egenfrekvens: a child on a swing; at the bottom a highlighted wave that keeps the same height and the same rhythm. */
  'lina.egenfrekvens': all(bg(SKY), swing(false), rect(6, 90, 108, 22, C.white, 3, null), wave(101, false)),
  /** resonans: the same swing, now pushed by an adult; the highlighted wave at the bottom grows bigger and bigger. */
  'lina.resonans': all(bg(SKY), swing(true), rect(6, 84, 108, 28, C.white, 3, null), wave(98, true)),
  /** sökmotor: a browser window with a search field and a magnifying glass, and a list of results numbered 1, 2, 3. */
  'lina.sökmotor': all(bg(), rect(8, 10, 104, 96, C.white, 4, C.ink, 1.8), rect(8, 10, 104, 12, '#e1e7ed', 4, null), ...[16, 24, 32].map((x, i) => circle(x, 16, 2.4, [C.red, C.yellow, OK][i]!, null)), rect(18, 30, 84, 16, C.white, 8, HL, 2.2), circle(90, 38, 4, 'none', HL, 2), line('M93 41 L97 45', HL, 2.4), line('M26 38 L64 38', C.grey, 2), ...range(3).map((i) => all(num(22, 66 + i * 14, `${i + 1}`, 9, HL), line(`M30 ${61 + i * 14} L${96 - i * 12} ${61 + i * 14}`, BLUE, 2.4), line(`M30 ${66 + i * 14} L${84 - i * 8} ${66 + i * 14}`, C.grey2, 1.6)))),

  // ── 3237 Linjära transformationer ─────────────────────────────────────
  /** transformation: a grey square grid on the left → arrow → a highlighted slanted and turned grid on the right; the origin dot stays in the corner of both. */
  'lina.transformation': all(bg(), g('translate(12 92)', ...range(4).map((i) => line(`M${i * 10} 0 L${i * 10} -30 M0 ${-i * 10} L30 ${-i * 10}`, C.grey, 1.4)), circle(0, 0, 2.6, C.ink, null)), arrow(48, 76, 62, 76, HL, 3), g('translate(70 92)', ...range(4).map((i) => line(`M${i * 12} ${-i * 4} L${i * 12 + 10} ${-i * 4 - 36} M${i * 3.3} ${-i * 12} L${36 + i * 3.3} ${-i * 12 - 12}`, HL, 1.8)), circle(0, 0, 2.6, C.ink, null)), num(60, 28, 'A', 14, C.dark)),
  /** rotation: on a grid, a grey arrow-shaped flag pointing right and the same flag highlighted pointing up; an arc with 90° between them, around the origin. */
  'lina.rotation.2': plane(all(greyed(vecG([0, 0], [6, 0], C.dark, 3.4), path(`M${G(4, 0)[0]} ${G(4, 0)[1]} L${G(4, 1.4)[0]} ${G(4, 1.4)[1]} L${G(5.4, 0)[0]} ${G(5.4, 0)[1]} Z`, C.dark, null)), vecG([0, 0], [0, 6], HL, 3.4), path(`M${G(0, 4)[0]} ${G(0, 4)[1]} L${G(-1.4, 4)[0]} ${G(-1.4, 4)[1]} L${G(0, 5.4)[0]} ${G(0, 5.4)[1]} Z`, HL, null), path(`M${G(3.5, 0)[0]} ${G(3.5, 0)[1]} A42 42 0 0 0 ${G(0, 3.5)[0]} ${G(0, 3.5)[1]}`, 'none', BLUE, 2.2), arrow(G(0.9, 3.4)[0], G(0.9, 3.4)[1] - 1, G(0, 3.5)[0] + 2, G(0, 3.5)[1], BLUE, 2.2), mark(76, 44, 32, 20), num(76, 50, '90°', 13, HL))),
  /** moturs: a clock with a big highlighted circular arrow going against the hands. */
  'lina.moturs': clock(turn(true)),
  /** medurs: the same clock with the big highlighted circular arrow going the same way as the hands. */
  'lina.medurs': clock(turn(false)),
  /** skjuvning: a straight grey stack of cards on the left; on the right the same stack pushed sideways at the top so it leans, highlighted, with arrows that get longer upwards. */
  'lina.skjuvning': all(bg(), ...range(6).map((i) => rect(10, 98 - i * 10, 30, 9, C.grey2, 1, C.grey, 1)), ...range(6).map((i) => rect(60 + i * 5, 98 - i * 10, 30, 9, i % 2 ? MARK : C.white, 1, HL, 1.6)), ...[2, 4].map((i) => arrow(56 + i * 5 - 14, 102 - i * 10, 56 + i * 5 - 2, 102 - i * 10, BLUE, 2)), arrow(74, 42, 94, 42, BLUE, 2.4), ground),
  /** projektion: a grey slanted arrow above a line; dashed lines drop straight down from it; its highlighted shadow lies on the line; a sun at the top. */
  'lina.projektion': all(bg(SKY), circle(60, 16, 8, C.yellow, C.gold, 1.6), vec(26, 86, 92, 36, C.dark, 3), line('M26 86 L26 98 M92 36 L92 98 M59 61 L59 98', C.grey, 1.4, '3 3'), line('M6 98 L114 98', C.ink, 2), rect(26, 95, 66, 6, MARK, 1, null), line('M26 98 L92 98', HL, 4.4), circle(26, 98, 2.6, HL, null)),
  /** datorgrafik: a computer screen showing a wireframe cube and a little figure in a game; a game controller in front. */
  'lina.datorgrafik': all(bg(), rect(10, 10, 100, 66, C.dark, 4, C.ink, 1.8), rect(15, 15, 90, 56, '#1f2a44', 2, null), path('M30 34 L52 34 L52 56 L30 56 Z M40 26 L62 26 L62 48 L40 48 Z M30 34 L40 26 M52 34 L62 26 M52 56 L62 48 M30 56 L40 48', 'none', '#7fd3ff', 1.4), ...range(4).map((i) => line(`M${70 + i * 8} 66 L${74 + i * 6} 50`, '#3e5a7a', 1)), circle(86, 40, 4, C.yellow, null), rect(83, 44, 6, 10, HL, 1, null), rect(52, 76, 16, 6, C.grey, 1, null), path('M30 94 C30 84 90 84 90 94 C92 108 76 108 72 100 L48 100 C44 108 28 108 30 94 Z', C.grey2, C.ink, 1.6), circle(42, 93, 4, C.dark, null), circle(78, 91, 2.4, HL, null), circle(84, 95, 2.4, BLUE, null)),
};
