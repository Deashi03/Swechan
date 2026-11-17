/**
 * Matematik & naturvetenskap → Matematikens grunder → Statistikens grunder, 3151–3157 (0.48): data sets,
 * frequency and distribution, mean and median, mode and range, chart types, sample and population, and
 * misleading statistics.
 * Recurring signs: data values are dots on a line or digits in white cells; the part that the word names is
 * orange (dot, bar, cell, row, ring, bracket or arrow) and a grey reference shows what the word is not.
 * Close words share one layout where only the marked part differs: tabell/rad/föra in/i tabellform on the
 * same grid; median/mittersta on sorted values; över/under genomsnittet on bars with a dashed mean line;
 * typvärde/lika ofta/variationsbredd/extremvärde/spridning on the same dot plot; the chart types on the
 * same axes. Digits and maths signs only (+ − × ÷ = < > %); no words, no letters, no brands.
 */
import { C, all, arrow, circle, ellipse, g, hand, line, path, rect, type Svg } from './kit';
import { HL, T, mini } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const BLUE = '#5b9bd5';
const PALE = '#eef3f8';
const HEAD = '#dfe8f1';
const GREEN = '#4f9d69';
const RED = '#d64545';
const SOFT = 'rgba(228,87,46,0.16)';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ground = line('M4 112 L116 112', C.grey2, 2);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const ok = (x: number, y: number, r = 8) => all(circle(x, y, r, GREEN, C.ink, 1.2), path(`M${x - r * 0.45} ${y} L${x - r * 0.1} ${y + r * 0.35} L${x + r * 0.5} ${y - r * 0.4}`, 'none', C.white, r * 0.24));
const cross = (x: number, y: number, r = 6, col = RED) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 2.4);
const dot = (x: number, y: number, col: string = BLUE, r = 3.6) => circle(x, y, r, col, C.ink, 1);
const pencil = (x: number, y: number, rot = 30) => g(`translate(${x} ${y}) rotate(${rot})`, rect(-3, -28, 6, 24, C.yellow, 1, C.ink, 1.2), path('M-3 -4 L3 -4 L0 4 Z', C.tan, C.ink, 1), circle(0, 3, 0.9, C.ink, null), rect(-3, -31, 6, 4, C.pink, 1, C.ink, 1));

/** Table grid: cols × rows cells of size cw × rh at (x, y); first row is a header. cells[r][c] = text. */
const table = (x: number, y: number, cols: number, rows: number, cw: number, rh: number, cells: string[][] = [], o: { row?: number; col?: number; cell?: [number, number]; size?: number; dim?: boolean } = {}) => all(
  rect(x, y, cols * cw, rows * rh, C.white, 2, null),
  rect(x, y, cols * cw, rh, HEAD, 2, null),
  ...(o.row !== undefined ? [rect(x, y + o.row * rh, cols * cw, rh, SOFT, 0, null)] : []),
  ...(o.col !== undefined ? [rect(x + o.col * cw, y, cw, rows * rh, SOFT, 0, null)] : []),
  ...(o.cell ? [rect(x + o.cell[1] * cw, y + o.cell[0] * rh, cw, rh, SOFT, 0, null)] : []),
  line([...range(rows - 1).map((i) => `M${x} ${y + (i + 1) * rh} L${x + cols * cw} ${y + (i + 1) * rh}`), ...range(cols - 1).map((i) => `M${x + (i + 1) * cw} ${y} L${x + (i + 1) * cw} ${y + rows * rh}`)].join(' '), C.grey, 1),
  rect(x, y, cols * cw, rows * rh, 'none', 2, C.ink, 1.8),
  ...cells.flatMap((r, ri) => r.map((t, ci) => T(x + ci * cw + cw / 2, y + ri * rh + rh * 0.7, t, o.size ?? rh * 0.55, o.dim && !(o.row === ri || o.col === ci) ? C.grey : C.ink))),
  ...(o.row !== undefined ? [rect(x, y + o.row * rh, cols * cw, rh, 'none', 2, HL, 2.6)] : []),
  ...(o.col !== undefined ? [rect(x + o.col * cw, y, cw, rows * rh, 'none', 2, HL, 2.6)] : []),
  ...(o.cell ? [rect(x + o.cell[1] * cw, y + o.cell[0] * rh, cw, rh, 'none', 2, HL, 2.6)] : []),
);
const TBL: string[][] = [['', '', ''], ['12', '8', '5'], ['7', '15', '9'], ['10', '6', '14']];

/** Chart axes with origin (x0, y0), width w and height h. */
const axes = (x0: number, y0: number, w: number, h: number) => line(`M${x0} ${y0 - h} L${x0} ${y0} L${x0 + w} ${y0}`, C.ink, 2);
/** Vertical bars from the baseline y0. */
const bars = (x0: number, y0: number, bw: number, gap: number, hs: number[], cols: (string | undefined)[] = []) => all(...hs.map((h, i) => rect(f1(x0 + i * (bw + gap)), y0 - h, bw, h, cols[i] ?? BLUE, 1, C.ink, 1.4)));
/** Dot plot: stacked dots above a number line; counts[i] dots over position i. */
const dotplot = (x0: number, y0: number, step: number, counts: number[], col: (i: number) => string = () => BLUE, labels = true, from = 1) => all(
  line(`M${x0 - 6} ${y0} L${f1(x0 + (counts.length - 1) * step + 6)} ${y0}`, C.ink, 1.8),
  ...counts.map((_, i) => line(`M${f1(x0 + i * step)} ${y0 - 3} L${f1(x0 + i * step)} ${y0 + 3}`, C.ink, 1.2)),
  ...(labels ? counts.map((_, i) => T(f1(x0 + i * step), y0 + 13, `${i + from}`, 9)) : []),
  ...counts.flatMap((n, i) => range(n).map((k) => dot(f1(x0 + i * step), y0 - 8 - k * 9, col(i)))),
);
/** Mean-line bar layout shared by över/under genomsnittet. */
const meanBars = (hl: number) => {
  const hs = [40, 62, 30, 54, 44];
  return all(axes(14, 100, 96, 84), bars(22, 100, 14, 5, hs, hs.map((_, i) => (i === hl ? HL : C.grey2))), line('M14 54 L112 54', C.ink, 2, '5 4'));
};
const die = (x: number, y: number, s: number, n: number, col: string = C.white) => {
  const p: Record<number, [number, number][]> = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
  return all(rect(x - s, y - s, s * 2, s * 2, col, s * 0.35, C.ink, 1.8), ...p[n]!.map(([a, b]) => circle(f1(x + a * s * 0.5), f1(y + b * s * 0.5), s * 0.16, C.ink, null)));
};
/** Tally marks: n strokes (groups of five, the fifth crossing) from x at baseline y, height h. */
const tally = (x: number, y: number, n: number, h = 18, col: string = C.ink, sw = 2.6) => {
  const out: Svg[] = [];
  for (let i = 0; i < n; i++) {
    const grp = Math.floor(i / 5), k = i % 5, gx = x + grp * (h * 1.6);
    out.push(k < 4 ? line(`M${f1(gx + k * h * 0.28)} ${y} L${f1(gx + k * h * 0.28)} ${y - h}`, col, sw) : line(`M${f1(gx - h * 0.15)} ${y - h * 0.2} L${f1(gx + h * 1.0)} ${y - h * 0.8}`, col, sw));
  }
  return all(...out);
};
const paper = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, C.white, 2, C.ink, 1.6), ...range(Math.floor((h - 8) / 9)).map((i) => line(`M${x + 5} ${y + 10 + i * 9} L${x + w - 5} ${y + 10 + i * 9}`, C.grey2, 1.6)));
const bill = (x: number, y: number) => all(rect(x - 9, y - 5, 18, 10, '#bfe0b0', 1, C.ink, 1), circle(x, y, 2.4, 'none', '#5f8f4f', 1));

export const STATISTICS_MOTIFS: Record<string, Svg> = {
  // ── 3151 Datamängder ─────────────────────────────────────────────
  'stats.data': all(rect(14, 22, 54, 80, C.tan, 4, C.ink, 1.8), rect(32, 16, 18, 10, C.silver, 2, C.ink, 1.4), rect(19, 30, 44, 66, C.white, 1, C.ink, 1.2),
    ...['12', '8', '15', '9', '11'].map((t, i) => T(41, 43 + i * 12, t, 11, HL)),
    paper(80, 30, 28, 34), arrow(80, 72, 70, 72, HL, 2.4), paper(84, 68, 26, 34), arrow(84, 98, 70, 90, HL, 2.4)),
  'stats.datamängd': all(path('M30 22 C18 22 24 58 12 60 C24 62 18 98 30 98', 'none', HL, 4), path('M90 22 C102 22 96 58 108 60 C96 62 102 98 90 98', 'none', HL, 4),
    ...[['3', 40, 40], ['7', 60, 36], ['7', 80, 42], ['9', 44, 62], ['12', 66, 60], ['5', 84, 66], ['8', 48, 84], ['10', 72, 84]].map(([t, x, y]) => T(x as number, y as number, t as string, 15, C.ink))),
  'stats.tabell': all(table(12, 22, 3, 4, 32, 18, TBL, { size: 11 }), ...[28, 60, 92].map((x, i) => circle(x, 31, 4, [C.orange, GREEN, BLUE][i]!, C.ink, 1))),
  'stats.rad': all(table(12, 22, 3, 4, 32, 18, TBL, { size: 11, row: 2, dim: true }), arrow(14, 104, 106, 104, HL, 3)),
  'stats.föra-in': all(table(30, 26, 3, 4, 26, 18, [['', '', ''], ['12', '8', '5'], ['7', '15', '9'], ['10', '6', '']], { size: 10, cell: [3, 2] }), T(95, 94, '14', 11, HL),
    pencil(106, 96, 30), paper(4, 34, 22, 30), path('M15 68 C15 112 70 116 84 106', 'none', HL, 2.2), path('M84 106 l-7 -1 l4 -6 Z', HL, HL, 1)),
  'stats.i-tabellform': all(greyed(...[['12', 14, 30], ['7', 32, 52], ['15', 12, 72], ['9', 30, 92], ['8', 18, 108]].map(([t, x, y]) => T(x as number, y as number, t as string, 12))), arrow(40, 66, 54, 66, HL, 3),
    table(58, 30, 2, 4, 26, 18, [['', ''], ['12', '7'], ['15', '9'], ['8', '']], { size: 11 }), rect(56, 28, 56, 76, 'none', 4, HL, 2.6)),
  // ── 3152 Frekvens och fördelning ─────────────────────────────────
  'stats.tärning.2': all(ground, ellipse(60, 106, 46, 5, C.grey2, null), die(40, 76, 20, 5), g('rotate(-14 86 82)', die(86, 82, 14, 3, C.white))),
  'stats.streck': all(paper(10, 18, 100, 84), tally(22, 74, 5, 34, HL, 4), tally(78, 74, 2, 34, C.ink, 4)),
  'stats.frekvens': all(...[[BLUE, 0], [HL, 1], [GREEN, 0], [HL, 1], [BLUE, 0], [HL, 1]].map(([c, on], i) => all(circle(16 + i * 17.6, 40, 7, c as string, C.ink, 1.2), on ? ring(16 + i * 17.6, 40, 10.5) : '')),
    tally(30, 92, 3, 22, HL, 3.4), T(70, 90, '=', 22), T(94, 92, '3', 30, HL)),
  'stats.förekomma.2': all(rect(8, 34, 104, 30, C.white, 4, C.ink, 1.6), ...['5', '7', '3', '7', '9', '7'].map((t, i) => all(T(18 + i * 16.8, 56, t, 17, t === '7' ? HL : C.grey))),
    ...[1, 3, 5].map((i) => arrow(18 + i * 16.8, 92, 18 + i * 16.8, 70, HL, 2.4))),
  'stats.frekvenstabell': all(table(10, 12, 3, 5, 33, 19, [['', '', ''], ['', '', '3'], ['', '', '5'], ['', '', '2'], ['', '', '4']], { size: 12, col: 2 }),
    ...[1, 2, 3, 4].map((n) => die(26.5, 12 + n * 19 + 9.5, 7, n)), tally(52, 46, 3, 12), tally(52, 65, 5, 12), tally(52, 84, 2, 12), tally(52, 103, 4, 12)),
  'stats.sällan': all(rect(10, 22, 100, 82, C.white, 4, C.ink, 1.8), rect(10, 22, 100, 14, RED, 4, C.ink, 1.8),
    ...range(21).map((i) => rect(16 + (i % 7) * 13.4, 42 + Math.floor(i / 7) * 20, 10, 14, i === 10 ? HL : PALE, 2, C.grey, 0.8)), ring(65.5, 69, 11)),
  'stats.relativ-frekvens': all(...range(20).map((i) => rect(10 + (i % 10) * 10, 22 + Math.floor(i / 10) * 12, 10, 12, i < 9 ? HL : C.white, 0, C.ink, 1)),
    T(36, 78, '9', 16, HL), line('M28 82 L44 82', C.ink, 2), T(36, 98, '20', 16), T(58, 90, '=', 16), T(90, 90, '45 %', 18, HL)),
  'stats.jämnt-fördelad': all(axes(14, 70, 92, 56), bars(22, 70, 16, 6, [42, 42, 42, 42], [HL, HL, HL, HL]), line('M18 28 L104 28', HL, 2, '4 3'),
    greyed(axes(40, 108, 40, 30), bars(44, 108, 6, 3, [26, 6, 12, 4]))),
  'stats.gruppera': all(...[[14, 30, HL], [30, 50, BLUE], [16, 66, GREEN], [34, 82, HL], [12, 96, BLUE], [28, 104, GREEN], [36, 36, BLUE], [10, 46, GREEN]].map(([x, y, c]) => dot(x as number, y as number, c as string)),
    arrow(44, 66, 58, 66, HL, 3),
    ...[[HL, 26], [BLUE, 60], [GREEN, 94]].map(([c, y]) => all(rect(64, (y as number) - 14, 48, 26, PALE, 4, C.ink, 1.4), ...range(3).map((k) => dot(76 + k * 12, (y as number) - 1, c as string))))),
  'stats.intervall.2': all(line('M8 70 L112 70', C.ink, 2), ...range(31).map((i) => line(`M${10 + i * 3.33} ${i % 10 ? 67 : 63} L${10 + i * 3.33} ${i % 10 ? 73 : 77}`, C.ink, i % 10 ? 0.8 : 1.4)),
    ...[0, 10, 20, 30].map((n) => T(10 + n * 3.33, 92, `${n}`, 11)), rect(43.3, 60, 30, 20, SOFT, 2, null), line('M43.3 50 L43.3 58 L73.3 58 L73.3 50', HL, 3), line('M43.3 62 L43.3 78 M73.3 62 L73.3 78', HL, 3), T(58, 40, '10–19', 14, HL)),
  // ── 3153 Medelvärde och median ──────────────────────────────────
  'stats.median': all(...['2', '3', '5', '8', '20'].map((t, i) => all(rect(8 + i * 21.6, 46, 18, 26, i === 2 ? SOFT : C.white, 3, i === 2 ? HL : C.ink, i === 2 ? 2.6 : 1.4), T(17 + i * 21.6, 65, t, 14, i === 2 ? HL : C.ink))),
    arrow(60, 100, 60, 78, HL, 3), arrow(8, 34, 112, 34, C.grey, 2)),
  'stats.i-genomsnitt': all(ground, ...[[16, 3], [36, 5], [56, 7]].flatMap(([x, n]) => range(n as number).map((k) => rect(x as number - 6, 104 - k * 9, 12, 8, C.grey2, 1, C.ink, 1))),
    arrow(70, 76, 82, 76, HL, 3), ...[88, 100, 112].flatMap((x) => range(5).map((k) => rect(x - 5, 104 - k * 9, 10, 8, HL, 1, C.ink, 1))), line('M84 60 L116 60', HL, 2, '4 3')),
  'stats.mittersta': all(ground, ...range(5).map((i) => g(`translate(${16 + i * 22} 98)`, mini(0, 0, i === 2 ? C.orange : C.grey2))), arrow(60, 40, 60, 70, HL, 3.4),
    line('M10 112 L48 112 M72 112 L110 112', C.grey, 1), T(27, 60, '2', 14, C.grey), T(93, 60, '2', 14, C.grey)),
  'stats.extremvärde': all(dotplot(12, 88, 9.6, [1, 2, 3, 2, 1, 0, 0, 0, 0, 0, 1], (i) => (i === 10 ? HL : C.grey2), false), ring(108, 80, 9), arrow(100, 40, 106, 66, HL, 2.6)),
  'stats.lägesmått': all(dotplot(14, 86, 11.5, [1, 2, 3, 4, 3, 2, 1, 1], () => C.grey2, false), path('M46.5 22 L60.5 22 L53.5 34 Z', HL, C.ink, 1.2), line('M53.5 34 L53.5 96', HL, 2.4, '4 3'), ring(53.5, 22, 13)),
  'stats.över-genomsnittet': all(meanBars(1), arrow(46, 44, 46, 22, HL, 2.6)),
  'stats.under-genomsnittet': all(meanBars(2), arrow(67, 56, 67, 68, HL, 2.6)),
  'stats.medellön': all(ground, ...[[16, 2], [36, 3], [56, 3], [76, 4], [100, 8]].flatMap(([x, n]) => range(n as number).map((k) => bill(x as number, 104 - k * 7))), line('M6 75 L114 75', HL, 2.6, '5 4')),
  // ── 3154 Typvärde och variationsbredd ────────────────────────────
  'stats.poäng': all(rect(26, 12, 68, 92, C.white, 3, C.ink, 1.8), ...range(5).map((i) => all(line(`M34 ${28 + i * 10} L74 ${28 + i * 10}`, C.grey2, 2), path(`M78 ${28 + i * 10} l3 3 l5 -6`, 'none', GREEN, 2))),
    rect(36, 80, 50, 20, SOFT, 4, HL, 2.4), T(61, 96, '34/40', 15, HL)),
  'stats.typvärde': all(dotplot(16, 92, 14.6, [1, 2, 5, 3, 2, 1, 1], (i) => (i === 2 ? HL : C.grey2)), rect(38, 38, 16, 58, 'none', 6, HL, 2.6)),
  'stats.lika-ofta': all(dotplot(16, 92, 14.6, [1, 4, 2, 4, 1, 1, 2], (i) => (i === 1 || i === 3 ? HL : C.grey2)), T(45.4, 40, '=', 18, HL), rect(23, 52, 16, 44, 'none', 6, HL, 2.2), rect(52, 52, 16, 44, 'none', 6, HL, 2.2)),
  'stats.variationsbredd': all(dotplot(14, 88, 11.5, [1, 2, 3, 2, 3, 1, 0, 1, 1], (i) => (i === 0 || i === 8 ? HL : C.grey2)), line('M14 46 L106 46', HL, 2.6), path('M14 46 l7 -4 l0 8 Z M106 46 l-7 -4 l0 8 Z', HL, HL, 1), line('M14 50 L14 74 M106 50 L106 74', HL, 1.6, '3 2')),
  'stats.spridning.2': all(greyed(line('M8 40 L112 40', C.ink, 1.6), ...[52, 56, 60, 64, 68].map((x) => dot(x, 32, C.grey2))), line('M8 88 L112 88', C.ink, 1.6), ...[12, 30, 52, 78, 106].map((x) => dot(x, 80, HL)), arrow(50, 100, 18, 100, HL, 2.4), arrow(70, 100, 102, 100, HL, 2.4)),
  'stats.utspridd': all(rect(4, 30, 112, 82, '#dff0d0', 0, null), ground, ...[[16, 44], [62, 40], [100, 52], [32, 76], [84, 82], [12, 100], [56, 98], [104, 102]].map(([x, y]) => g(`translate(${x} ${y})`, path('M-7 0 L-7 -8 L0 -14 L7 -8 L7 0 Z', HL, C.ink, 1.2), rect(-2, -5, 4, 5, C.white, 0, C.ink, 0.8))), circle(100, 16, 7, C.yellow, C.ink, 1.2)),
  'stats.skilja-sig-åt': all(circle(30, 60, 20, BLUE, C.ink, 1.8), path('M80 40 L104 80 L72 82 Z', C.yellow, C.ink, 1.8), T(58, 70, '≠', 30, HL)),
  'stats.spridningsmått': all(line('M8 54 L112 54', C.ink, 1.6), ...[14, 30, 48, 80, 106].map((x) => dot(x, 46, C.grey2)), rect(10, 70, 100, 18, C.yellow, 2, C.ink, 1.6), line(range(21).map((i) => `M${10 + i * 5} 70 l0 ${i % 5 ? 4 : 8}`).join(' '), C.ink, 1), arrow(14, 98, 106, 98, HL, 2.6), arrow(106, 98, 14, 98, HL, 2.6), line('M14 50 L14 70 M106 50 L106 70', HL, 1.6, '3 2')),
  // ── 3155 Diagramtyper ───────────────────────────────────────────
  'stats.diagram': all(rect(6, 14, 108, 84, C.white, 4, C.ink, 1.8), axes(14, 88, 40, 62), bars(18, 88, 7, 4, [24, 40, 30], [BLUE, HL, GREEN]),
    circle(86, 38, 16, BLUE, C.ink, 1.4), path('M86 38 L86 22 A16 16 0 0 1 101 43 Z', HL, C.ink, 1.4), line('M66 88 L76 72 L88 80 L106 62', HL, 2.6), line('M108 98 L108 110 M12 98 L12 110', C.grey, 2)),
  'stats.stapeldiagram': all(axes(14, 100, 96, 84), bars(24, 100, 14, 9, [40, 70, 30, 56], [HL, HL, HL, HL])),
  'stats.stapel': all(axes(14, 100, 96, 84), bars(24, 100, 14, 9, [40, 70, 30, 56], [C.grey2, HL, C.grey2, C.grey2]), arrow(78, 22, 60, 30, HL, 2.6)),
  'stats.cirkeldiagram': all(circle(60, 60, 42, BLUE, C.ink, 2), path('M60 60 L60 18 A42 42 0 0 1 102 60 Z', HL, C.ink, 2), path('M60 60 L102 60 A42 42 0 0 1 30 90 Z', GREEN, C.ink, 2)),
  'stats.linjediagram': all(axes(14, 100, 96, 84), ...[[24, 80], [40, 66], [56, 72], [72, 44], [88, 50], [104, 28]].map(([x, y], i, a) => all(i ? line(`M${a[i - 1]![0]} ${a[i - 1]![1]} L${x} ${y}`, HL, 3) : '', circle(x!, y!, 3.4, HL, C.ink, 1)))),
  'stats.stolpdiagram': all(axes(14, 100, 96, 84), ...[[28, 40], [48, 70], [68, 30], [88, 56]].map(([x, h]) => all(line(`M${x} 100 L${x} ${100 - h!}`, HL, 3), circle(x!, 100 - h!, 3.6, HL, C.ink, 1)))),
  'stats.histogram': all(axes(14, 100, 96, 84), bars(20, 100, 18, 0, [20, 46, 70, 52, 24], [HL, HL, HL, HL, HL])),
  'stats.spridningsdiagram': all(axes(14, 100, 96, 84), ...[[24, 86], [32, 80], [38, 84], [46, 70], [52, 74], [60, 62], [66, 66], [74, 52], [80, 56], [88, 44], [96, 40], [102, 30]].map(([x, y]) => circle(x!, y!, 3.4, HL, C.ink, 1))),
  'stats.lämpa-sig': all(rect(8, 14, 50, 46, C.white, 3, C.ink, 1.6), axes(14, 54, 40, 36), line('M18 48 L28 40 L38 42 L50 24', HL, 2.6), ok(54, 68, 9),
    greyed(rect(64, 14, 48, 46, C.white, 3, C.ink, 1.6), circle(88, 37, 16, BLUE, C.ink, 1.2), path('M88 37 L88 21 A16 16 0 0 1 103 42 Z', C.orange, C.ink, 1.2)), cross(106, 68, 7),
    ...range(4).map((i) => rect(12 + i * 12, 86, 10, 14, PALE, 2, C.ink, 1)), arrow(32, 82, 32, 64, HL, 2.4)),
  // ── 3156 Urval och population ───────────────────────────────────
  'stats.population.2': all(ellipse(60, 64, 54, 44, SOFT, HL, 3), ...range(15).map((i) => g(`translate(${22 + (i % 5) * 19} ${42 + Math.floor(i / 5) * 24})`, mini(0, 0, C.grey2)))),
  'stats.totalundersökning': all(...range(10).map((i) => g(`translate(${12 + (i % 5) * 22} ${56 + Math.floor(i / 5) * 40})`, mini(0, 0, C.grey2), path('M5 -14 l3 3 l5 -6', 'none', GREEN, 2.4))), rect(4, 4, 112, 22, SOFT, 4, null), T(60, 21, '10 / 10', 14, HL)),
  'stats.skev': all(ellipse(34, 64, 30, 44, PALE, C.ink, 1.6), ...range(8).map((i) => g(`translate(${22 + (i % 2) * 22} ${36 + Math.floor(i / 2) * 18}) scale(0.8)`, mini(0, 0, i % 2 ? C.orange : BLUE))),
    path('M42 30 L66 30 L66 52 L42 52 Z', 'none', HL, 2.4), arrow(70, 44, 82, 50, HL, 2.6), rect(84, 34, 30, 40, SOFT, 4, HL, 2.6), ...[0, 1].map((k) => g(`translate(${92 + k * 14} 60) scale(0.8)`, mini(0, 0, C.orange))), cross(99, 92, 8)),
  // ── 3157 Vilseledande statistik ─────────────────────────────────
  'stats.bruten-axel': all(line('M20 14 L20 54 M20 64 L20 104 L112 104', C.ink, 2), path('M14 54 L26 52 M14 62 L26 60', 'none', HL, 2.4), path('M16 54 L24 52 L16 58 L24 56 L16 62 L24 60', 'none', HL, 2), ring(20, 57, 11),
    T(10, 18, '98', 9), T(10, 102, '0', 9), T(10, 70, '95', 9), bars(36, 104, 18, 14, [20, 50, 84], [C.grey2, C.grey2, C.grey2])),
  'stats.plocka-russinen-ur-kakan': all(ground, ellipse(46, 102, 40, 7, C.white, C.ink, 1.6), path('M14 98 C14 62 78 62 78 98 Z', '#f0c98a', C.ink, 1.8), ...[[28, 84], [44, 76], [58, 88], [36, 92], [66, 80]].map(([x, y]) => ellipse(x!, y!, 3, 2.2, '#5a3a2a', null)),
    ellipse(88, 104, 12, 3, C.white, C.ink, 1.2), ...[84, 90, 94].map((x) => ellipse(x, 101, 2.6, 2, '#5a3a2a', null)), hand(92, 48, 1.3, 160), ellipse(84, 58, 3.2, 2.4, '#5a3a2a', HL, 1.4), ring(84, 58, 7)),
  'stats.i-absoluta-tal': all(greyed(rect(30, 6, 60, 22, C.white, 4, C.ink, 1.4), T(60, 23, '+50 %', 15)), ...[16, 30].map((x) => g(`translate(${x} 90)`, mini(0, 0, C.grey2))), arrow(42, 84, 56, 84, C.grey, 2.4), ...[66, 82].map((x) => g(`translate(${x} 90)`, mini(0, 0, C.grey2))), g('translate(100 90)', mini(0, 0, C.orange)), T(100, 58, '+1', 18, HL)),
  'stats.korrelation': all(rect(8, 10, 104, 44, C.white, 3, C.ink, 1.4), rect(8, 64, 104, 44, C.white, 3, C.ink, 1.4), line('M14 46 L36 40 L58 22 L80 28 L106 16', BLUE, 2.8), line('M14 100 L36 94 L58 76 L80 82 L106 70', GREEN, 2.8),
    ...[36, 58, 80].map((x) => line(`M${x} 30 L${x} 92`, HL, 1.8, '3 3'))),
};
