/**
 * Kvalitetsplanen B5 – det manuella bildspåret, Matematikens grunder. Skolmatematik ritas med räkneuttryck,
 * klossar, tallinjer, staplar och tabeller, och med räknetecknet som ledtråd (+, −, <, ≈, %, dm²).
 * Orange visar det ordet betyder, grått det som ordet inte är. Bara siffror och tecken; inga ord.
 */
import { C, all, arrow, circle, line, path, rect, waIn, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';
import { SOFT, check, cross } from './manualPhilosophy';

const GR = C.grey;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const block = (x: number, y: number, col: string = C.sky, s = 10) => rect(x, y, s, s, col, 1.5, C.ink, 1);
const dot = (x: number, y: number, col: string = C.ink, r = 3.2) => circle(x, y, r, col, C.ink, 1);
const numberLine = (y: number, x1 = 8, x2 = 112) => all(arrow(x1, y, x2, y, C.ink, 2), ...range(Math.floor((x2 - x1 - 8) / 10) + 1).map((i) => line(`M${x1 + 4 + i * 10} ${y - 4} L${x1 + 4 + i * 10} ${y + 4}`, C.ink, 1.2)));
const bars = (vals: number[], x: number, y: number, w: number, col: string = HL) => all(...vals.map((v, i) => rect(x + i * (w + 4), y - v, w, v, col, 1, C.ink, 1)), line(`M${x - 4} ${y} L${x + vals.length * (w + 4)} ${y}`, C.ink, 1.6));
const table = (x: number, y: number, rows: number, cols: number, cw = 20, rh = 14, fill: (r: number, c: number) => string = () => '') => all(
  rect(x, y, cols * cw, rows * rh, C.white, 2, C.ink, 1.6), rect(x, y, cols * cw, rh, C.grey2, 2, C.ink, 1.6),
  ...range(rows - 1).map((r) => line(`M${x} ${y + (r + 1) * rh} L${x + cols * cw} ${y + (r + 1) * rh}`, C.ink, 1)), ...range(cols - 1).map((c) => line(`M${x + (c + 1) * cw} ${y} L${x + (c + 1) * cw} ${y + rows * rh}`, C.ink, 1)),
  ...range(rows).flatMap((r) => range(cols).map((c) => T(x + c * cw + cw / 2, y + r * rh + rh * 0.72, fill(r, c), 9, r === 0 ? C.ink : C.ink))));

export const MANUAL_MATH_BASICS_MOTIFS: Record<string, Svg> = {
  // Tal och räknesätt
  'manb.delbar': all(...range(12).map((i) => block(14 + (i % 4) * 12, 20 + Math.floor(i / 4) * 12, HL)), T(34, 76, '12', 14), T(88, 30, '12 : 3 = 4', 11, HL), ...range(3).map((i) => rect(70 + i * 14, 50, 10, 40, SOFT, 2, HL, 1.6)), check(92, 104, C.green, 1)),
  'manb.storleksordning': all(...[[2, 20], [5, 50], [9, 90]].map(([n, h], i) => all(rect(16 + i * 34, 100 - h!, 24, h!, i === 2 ? HL : SOFT, 2, HL, 1.6), T(28 + i * 34, 112, String(n), 12))), T(36, 24, '&lt;', 16, HL), T(70, 24, '&lt;', 16, HL)),
  'manb.addition': all(...range(3).map((i) => block(10 + i * 12, 40, C.sky, 10)), T(52, 50, '+', 22, HL), ...range(2).map((i) => block(62 + i * 12, 40, C.yellow, 10)), T(60, 90, '3 + 2 = 5', 16), rect(48, 30, 14, 26, 'none', 3, HL, 2)),
  'manb.subtraktion': all(...range(5).map((i) => block(14 + i * 12, 40, C.sky, 10)), cross(68, 45, HL, 0.8), cross(80, 45, HL, 0.8), T(60, 90, '5 − 2 = 3', 16), T(100, 50, '−', 26, HL)),
  'manb.rimlighet': all(path('M30 104 L30 70 M24 104 L30 86 L36 104 M30 74 L22 90 M30 74 L38 90', 'none', C.ink, 3), circle(30, 62, 7, C.skin, C.ink, 1.6), line('M50 54 L50 104', C.ink, 1.6), line('M46 54 L54 54 M46 104 L54 104', C.ink, 1.6), T(82, 60, '1,8 m', 13, C.green), check(104, 54, C.green, 0.9), T(82, 90, '18 m', 13, C.red), cross(104, 86, C.red, 0.9), rect(64, 44, 54, 24, 'none', 4, HL, 2.2), T(60, 24, '?', 18, HL)),
  'manb.överslag': all(T(36, 30, '19 · 21', 16, GR), arrow(36, 40, 36, 52, C.ink, 2), T(36, 70, '20 · 20', 16, HL), T(36, 100, '= 400', 16, HL), T(90, 62, '≈', 34, HL)),
  'manb.avrundning': all(numberLine(70, 8, 112), dot(56, 70, C.ink), T(56, 92, '4,7', 12), dot(62, 70, HL, 4.4), T(68, 50, '5', 16, HL), path('M56 62 C56 52 62 52 62 62', 'none', HL, 2), path('M62 62 l-4 -4 l5 -1 Z', HL, null)),
  'manb.procentuell': all(rect(10, 40, 40, 50, C.sky, 3, C.ink, 1.6), T(30, 104, '100', 11), arrow(54, 64, 66, 64, C.ink, 2), rect(70, 30, 40, 60, C.sky, 3, C.ink, 1.6), rect(70, 30, 40, 10, SOFT, 0, HL, 1.6), T(90, 104, '120', 11), T(90, 22, '+20 %', 14, HL)),
  'manb.ökning': all(bars([20, 34, 50, 70], 20, 100, 16, HL), waIn('b5-okning-1', -10, 10, arrow(18, 78, 92, 22, HL, 3)), T(100, 104, '+', 18, HL)),
  'manb.minskning': all(bars([70, 50, 34, 20], 20, 100, 16, C.sky), waIn('b5-minskning-1', -10, -10, arrow(18, 22, 92, 78, HL, 3)), T(100, 20, '−', 22, HL)),
  'manb.variera': all(line('M8 100 L112 100', C.ink, 1.6), ...[[18, 60], [36, 30], [54, 76], [72, 44], [90, 66], [104, 24]].map(([x, y]) => dot(x!, y!, HL, 4)), line('M18 60 L36 30 L54 76 L72 44 L90 66 L104 24', HL, 1.6, '3 3')),
  'manb.isolera': all(T(60, 30, '2x + 3 = 11', 15, GR), arrow(60, 40, 60, 50, C.ink, 2), T(60, 70, '2x = 8', 15, GR), arrow(60, 78, 60, 88, C.ink, 2), rect(26, 92, 26, 22, SOFT, 4, HL, 2.6), T(39, 109, 'x', 16, HL), T(76, 109, '= 4', 15)),
  'manb.olikhet': all(T(30, 70, '3', 30), T(62, 70, '&lt;', 34, HL), T(94, 70, '7', 30), greyed(T(60, 106, '=', 22, C.grey)), cross(60, 100, C.grey, 0.8)),
  'manb.storhet': all(rect(6, 30, 34, 10, '#f4e7c8', 1, C.ink, 1.2), ...range(7).map((i) => line(`M${9 + i * 5} 30 L${9 + i * 5} 34`, C.ink, 0.8)), T(23, 60, 'l', 22, HL), path('M46 40 L74 40 L70 30 L50 30 Z', C.grey2, C.ink, 1.2), line('M60 30 L60 22', C.ink, 1.6), circle(60, 20, 4, C.gold, C.ink, 1), T(60, 60, 'm', 22, HL), circle(98, 30, 12, C.white, C.ink, 1.6), line('M98 30 L98 22 M98 30 L104 32', C.ink, 1.6), T(98, 60, 't', 22, HL), greyed(T(23, 96, 'cm', 11, C.grey), T(60, 96, 'kg', 11, C.grey), T(98, 96, 's', 11, C.grey)), rect(4, 44, 112, 24, 'none', 4, HL, 2)),
  'manb.rektangulär': all(rect(16, 30, 88, 50, '#f4e7c8', 3, HL, 3), path('M16 30 L24 30 L24 38 L16 38', 'none', C.ink, 1.4), path('M104 80 L96 80 L96 72 L104 72', 'none', C.ink, 1.4), greyed(circle(100, 104, 8, C.grey2, C.grey, 1.2))),
  'manb.symmetrilinje': all(path('M60 20 C40 10 14 26 20 50 C26 72 50 72 60 96 C70 72 94 72 100 50 C106 26 80 10 60 20 Z', C.pink, C.ink, 1.6), line('M60 8 L60 112', HL, 3, '6 4')),
  'manb.rund': all(circle(36, 58, 26, C.yellow, HL, 3), circle(90, 58, 18, C.red, HL, 3), greyed(rect(70, 92, 20, 20, C.grey2, 1, C.grey, 1.2), path('M20 112 L32 92 L44 112 Z', C.grey2, C.grey, 1.2))),
  'manb.kvadratdecimeter': all(rect(20, 20, 70, 70, SOFT, 0, HL, 2.6), ...range(9).map((i) => line(`M${20 + (i + 1) * 7} 20 L${20 + (i + 1) * 7} 90 M20 ${20 + (i + 1) * 7} L90 ${20 + (i + 1) * 7}`, C.grey2, 0.6)), line('M20 100 L90 100', C.ink, 1.6), T(55, 114, '1 dm', 11), T(104, 60, 'dm²', 13, HL)),
  'manb.proportionalitet': all(line('M14 104 L110 104 M14 104 L14 10', C.ink, 2), line('M14 104 L104 20', HL, 3), ...[[34, 85, '1'], [54, 66, '2'], [74, 48, '3']].map(([x, y]) => dot(x as number, y as number, HL, 3.6)), T(84, 96, 'y = kx', 13, HL), path('M34 85 L54 85 L54 66', 'none', C.ink, 1.2), path('M54 66 L74 66 L74 48', 'none', C.ink, 1.2)),
  'manb.bero-på': all(rect(10, 40, 30, 30, C.white, 4, C.ink, 1.8), T(25, 61, 'x', 18), arrow(44, 55, 72, 55, HL, 3.4), rect(76, 40, 34, 30, SOFT, 4, HL, 2.4), T(93, 61, 'y', 18, HL), T(60, 98, 'y = f(x)', 15)),
  // Statistik
  'manb.data': all(rect(10, 16, 46, 58, C.white, 3, C.ink, 1.6), ...range(6).map((i) => T(33, 30 + i * 8, ['12', '8', '15', '9', '11', '14'][i]!, 8, HL)), arrow(60, 46, 70, 46, C.ink, 2), bars([30, 20, 38, 22], 74, 90, 7, HL)),
  'manb.datamängd': all(path('M20 30 C20 10 100 10 100 30 L100 92 C100 112 20 112 20 92 Z', '#eef6fb', C.ink, 1.8), ...range(15).map((i) => T(32 + (i % 5) * 14, 46 + Math.floor(i / 5) * 18, String([3, 7, 5, 9, 2, 6, 8, 4, 5, 7, 1, 9, 6, 3, 8][i]), 11, HL)), rect(14, 6, 92, 108, 'none', 8, HL, 2)),
  'manb.föra-in': all(table(30, 30, 4, 3, 26, 16, (r, c) => (r === 0 ? ['', 'x', 'y'][c]! : r < 3 ? [String(r), String(r * 2), String(r * 3)][c]! : '')), waIn('b5-fora-in-1', 10, -14, all(T(82, 88, '9', 11, HL), rect(82, 70, 4, 22, C.yellow, 1, C.ink, 1))), rect(82, 78, 26, 16, 'none', 0, HL, 2.4)),
  'manb.i-tabellform': all(table(14, 22, 5, 3, 30, 16, (r, c) => (r === 0 ? ['', 'A', 'B'][c]! : [String(r), String(r * 4), String(r * 7)][c]!)), rect(10, 18, 98, 88, 'none', 4, HL, 2.4)),
  'manb.förekomma': all(table(20, 20, 6, 2, 40, 14, (r, c) => (r === 0 ? ['', ''][c]! : c === 0 ? ['', '3', '5', '3', '7', '3'][r]! : '')), ...[1, 3, 5].map((r) => rect(20, 20 + r * 14, 40, 14, SOFT, 0, HL, 2)), T(80, 76, '3 ×3', 13, HL)),
  'manb.mittersta': all(...[1, 3, 4, 7, 9].map((n, i) => all(rect(10 + i * 21, 46, 18, 22, i === 2 ? SOFT : C.white, 3, i === 2 ? HL : C.ink, i === 2 ? 2.6 : 1.4), T(19 + i * 21, 62, String(n), 12, i === 2 ? HL : C.ink))), arrow(60, 30, 60, 42, HL, 2.6), T(30, 92, '2', 11, GR), T(90, 92, '2', 11, GR)),
  'manb.lägesmått': all(line('M8 80 L112 80', C.ink, 1.6), ...[[20, 1], [36, 1], [52, 2], [68, 1], [100, 1]].flatMap(([x, n]) => range(n!).map((k) => circle(x!, 74 - k * 9, 3.6, C.sky, C.ink, 1))), line('M55 40 L55 86', HL, 2), T(55, 34, 'x̄', 12, HL), line('M52 96 L52 104', HL, 2), T(52, 116, 'm', 11, HL), rect(46, 56, 12, 26, 'none', 2, HL, 2), T(84, 34, 't', 12, HL), line('M84 38 L58 60', HL, 1.2, '3 2')),
  'manb.utspridd': all(line('M8 80 L112 80', C.ink, 1.6), ...[12, 30, 58, 84, 106].map((x) => dot(x, 80, HL, 4)), greyed(...[54, 58, 62].map((x) => dot(x, 40, C.grey2, 4))), arrow(60, 96, 106, 96, HL, 2), arrow(60, 96, 12, 96, HL, 2)),
  'manb.skilja-sig-åt': all(rect(14, 40, 30, 30, C.sky, 3, C.ink, 1.6), circle(90, 55, 16, C.yellow, C.ink, 1.6), T(60, 62, '≠', 24, HL)),
  'manb.spridningsmått': all(line('M8 64 L112 64', C.ink, 1.6), ...[16, 30, 40, 52, 60, 70, 104].map((x) => circle(x, 64, 3.4, C.ink, null)), arrow(60, 40, 104, 40, HL, 2), arrow(60, 40, 16, 40, HL, 2), rect(30, 82, 40, 14, SOFT, 2, HL, 2), line('M16 89 L30 89 M70 89 L104 89', HL, 1.6), line('M50 82 L50 96', HL, 2), T(60, 116, 'σ', 13, HL), T(60, 30, 'R', 11, HL)),
  'manb.population': all(...range(30).map((i) => circle(14 + (i % 6) * 18, 22 + Math.floor(i / 6) * 18, 5, i % 7 === 2 ? HL : C.grey2, C.ink, 0.8)), rect(4, 10, 112, 96, 'none', 8, HL, 2.6)),
  'manb.korrelation': all(line('M14 104 L110 104 M14 104 L14 10', C.ink, 2), ...[[24, 92], [32, 86], [42, 80], [50, 70], [58, 72], [68, 58], [76, 50], [84, 46], [94, 34], [102, 26]].map(([x, y]) => dot(x!, y!, HL, 3.2)), line('M20 96 L106 22', C.ink, 1.4, '4 3'), T(36, 28, 'r ≈ 0,9', 12, HL)),
};
