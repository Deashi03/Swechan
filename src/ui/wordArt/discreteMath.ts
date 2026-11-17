/**
 * Matematik & naturvetenskap → Avancerad matematik → Diskret matematik, 3251–3257 (0.49): sets and relations,
 * logical operators, proof methods, graphs and networks, trees and search, recursion, algorithmic complexity.
 * Digits, the letters p, q, x, y, n, a–c, A–E and the signs ∪ ∩ ∧ ∨ ¬ ⇒ ⇔ { } ( ) = ≠ ! ∎ may appear; no picture
 * contains a word that names its word. Close words share one layout where only the highlighted part differs:
 * mängd/element/delmängd on the same loop of fruit; union/snitt/komplement on the same two circles;
 * konjunktion/disjunktion on the same lamp with two switches in a row or side by side; implikation/omvändning/
 * ekvivalens on the same cloud and puddle with the arrow one way, back or both ways; direkt bevis/
 * motsägelsebevis on the same chain of steps (straight to a tick, or into a flash); graf/nod/kant/riktad graf/
 * kortaste vägen on the same network; träd/rot/löv on the same upside-down tree; linjär/binär sökning on the
 * same row of numbered boxes.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL, P, T, bolt, bubble, cloud, drops } from './people';
import { greyed } from './blindFix';

// ── Palette and small helpers ────────────────────────────────────────
const SOFT = '#f4f6f8';
const MARK = '#fff3b0';
const TINT = 'rgba(228,87,46,0.28)';
const OK = '#3f9a5a';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ground = line('M4 112 L116 112', C.grey2, 2);
const bg = (col: string = SOFT) => rect(4, 4, 112, 108, col, 3, null);
const num = (x: number, y: number, s: string, size = 12, col: string = C.ink) => T(x, y, s, size, col);
const check = (x: number, y: number, s = 1, col: string = OK) => line(`M${x - 6 * s} ${y} L${x - 2 * s} ${y + 5 * s} L${x + 7 * s} ${y - 6 * s}`, col, 3 * s);
const cross = (x: number, y: number, s = 1, col: string = C.red) => line(`M${x - 5 * s} ${y - 5 * s} L${x + 5 * s} ${y + 5 * s} M${x + 5 * s} ${y - 5 * s} L${x - 5 * s} ${y + 5 * s}`, col, 3 * s);
const badge = (x: number, y: number, s: string, size = 18) => all(circle(x, y, 12, MARK, HL, 2.2), num(x, y + size * 0.36, s, size, HL));

// small objects
const apple = (x: number, y: number, col: string = C.red) => all(circle(x, y, 5.5, col, C.ink, 1.2), line(`M${x} ${y - 5} L${x + 1} ${y - 9}`, C.brown, 1.4), ellipse(x + 3.5, y - 8, 2.6, 1.4, C.green, null));
const pear = (x: number, y: number) => all(path(`M${x} ${y - 9} C${x + 3} ${y - 9} ${x + 3} ${y - 4} ${x + 5} ${y} C${x + 7} ${y + 6} ${x - 7} ${y + 6} ${x - 5} ${y} C${x - 3} ${y - 4} ${x - 3} ${y - 9} ${x} ${y - 9} Z`, '#c5d65a', C.ink, 1.2), line(`M${x} ${y - 9} L${x} ${y - 12}`, C.brown, 1.4));
const lemon = (x: number, y: number) => ellipse(x, y, 7, 5, C.yellow, C.ink, 1.2);
const grape = (x: number, y: number) => all(...[[0, 0], [4, 0], [2, 4], [-2, 4], [6, 4], [2, 8]].map(([a, b]) => circle(x + a! - 2, y + b! - 4, 2.4, C.purple, C.ink, 0.8)));
/** The five fruits used for the set pictures. */
const FRUIT: [number, number, (x: number, y: number) => Svg][] = [[42, 46, (x, y) => apple(x, y)], [64, 40, pear], [82, 54, lemon], [50, 70, grape], [72, 74, (x, y) => apple(x, y, C.orange)]];
const loop = (stroke: string = HL, fill: string = MARK, sw = 3) => ellipse(62, 58, 40, 32, fill, stroke, sw);
const outside = () => greyed(at(14, 100, 0.9, lemon(0, 0)), at(106, 18, 0.9, apple(0, 0)), at(104, 100, 0.9, pear(0, 0)));

// Venn diagram: A (46, 58), B (74, 58), r 26; intersections at (60, 36.1) and (60, 79.9)
const VA = circle(46, 58, 26, 'none', C.ink, 2), VB = circle(74, 58, 26, 'none', C.ink, 2);
const LENS = 'M60 36.1 A26 26 0 0 1 60 79.9 A26 26 0 0 1 60 36.1 Z';
const UNION = 'M60 36.1 A26 26 0 1 0 60 79.9 A26 26 0 1 0 60 36.1 Z';
const vennLabels = all(num(30, 62, 'A', 12, C.dark), num(90, 62, 'B', 12, C.dark));

// lamp and switches (circuit pictures)
const lamp = (x: number, y: number, on: boolean) => all(on ? all(...[-1, 0, 1].map((i) => line(`M${x + i * 13} ${y - 15 - (i === 0 ? 3 : 0)} l${i * 4} -5`, C.gold, 2.4))) : '', circle(x, y, 10, on ? C.yellow : C.white, C.ink, 1.8), rect(x - 5, y + 9, 10, 7, C.grey, 1, C.ink, 1.2));
/** Switch from (x, y) to (x + 20, y); closed = lever down on the contact. */
const sw = (x: number, y: number, closed: boolean, col: string = C.ink) => all(circle(x, y, 2.6, C.white, col, 1.6), circle(x + 20, y, 2.6, C.white, col, 1.6), line(closed ? `M${x} ${y} L${x + 19} ${y - 1}` : `M${x} ${y} L${x + 17} ${y - 11}`, col, 3));

// network for the graph pictures
const N: [number, number][] = [[20, 30], [58, 18], [98, 30], [28, 80], [64, 62], [100, 92]];
const EDGES: [number, number][] = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 4], [3, 4], [4, 5], [2, 5], [3, 5]];
const edge = (a: number, b: number, col: string = C.grey, w = 2.4) => line(`M${N[a]![0]} ${N[a]![1]} L${N[b]![0]} ${N[b]![1]}`, col, w);
const node = (i: number, fill: string = C.white, stroke: string = C.grey, r = 6) => circle(N[i]![0], N[i]![1], r, fill, stroke, 2);
const net = (ecol: string = C.grey, nfill: string = C.white, ncol: string = C.grey) => all(...EDGES.map(([a, b]) => edge(a, b, ecol)), ...N.map((_, i) => node(i, nfill, ncol)));
/** Point on the edge a→b, t from a. */
const along = (a: number, b: number, t: number): [number, number] => [f1(N[a]![0] + (N[b]![0] - N[a]![0]) * t), f1(N[a]![1] + (N[b]![1] - N[a]![1]) * t)];

// upside-down tree diagram
const TN: [number, number][] = [[60, 20], [34, 52], [86, 52], [20, 88], [48, 88], [72, 88], [100, 88]];
const TE: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];
const tree = (o: { ecol?: string; ncol?: string; nfill?: string; hl?: number[] } = {}) => all(
  ...TE.map(([a, b]) => line(`M${TN[a]![0]} ${TN[a]![1]} L${TN[b]![0]} ${TN[b]![1]}`, o.ecol ?? C.grey, 2.6)),
  ...TN.map(([x, y], i) => (o.hl ?? []).includes(i) ? all(circle(x, y, 11, 'none', HL, 2.2), circle(x, y, 7, MARK, HL, 2.6)) : circle(x, y, 7, o.nfill ?? C.white, o.ncol ?? C.grey, 2)),
);

// row of numbered boxes for the search pictures
const ROW = ['3', '8', '12', '17', '21', '26', '30', '35'];
const box = (i: number, fill: string = C.white, stroke: string = C.grey, txt: string = C.dark) => all(rect(8 + i * 13, 60, 12, 16, fill, 2, stroke, 1.6), num(14 + i * 13, 72, ROW[i]!, 7.5, txt));
const hop = (i: number, j: number, col: string = HL) => path(`M${14 + i * 13} 57 Q${f1(14 + (i + j) * 6.5)} ${f1(57 - 6 - Math.abs(j - i) * 3)} ${14 + j * 13} 57`, 'none', col, 2);

// misc objects
const doll = (x: number, s: number, col: string, open = false) => at(x, 108, s, open ? g('translate(0 -26)', path('M-10 -8 C-12 -26 12 -26 10 -8 Z', col, C.ink, 1.6), circle(0, -16, 5.5, C.skin, C.ink, 1.2)) : all(path('M-10 -8 C-12 -26 12 -26 10 -8 Z', col, C.ink, 1.6), circle(0, -16, 5.5, C.skin, C.ink, 1.2), path('M-5.5 -18 C-4 -23 4 -23 5.5 -18 C3 -21 -3 -21 -5.5 -18 Z', C.hair, null)), path('M-10 -8 C-14 0 -12 4 -8 4 L8 4 C12 4 14 0 10 -8 Z', col, C.ink, 1.6), ellipse(0, -2, 4, 3, C.white, null), circle(0, -2, 1.6, C.red, null));
const gear = (x: number, y: number, r = 12, col: string = C.grey) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return rect(f1(x + Math.cos(a) * r - 3), f1(y + Math.sin(a) * r - 3), 6, 6, col, 1, C.ink, 1); }), circle(x, y, r, col, C.ink, 1.6), circle(x, y, r * 0.38, C.white, C.ink, 1.4));
const watch = (x: number, y: number, r: number, col: string = HL) => all(rect(x - 3, y - r - 7, 6, 5, C.dark, 1, null), circle(x, y, r, C.white, col, 3), ...range(12).map((i) => { const a = (i / 12) * Math.PI * 2; return line(`M${f1(x + Math.sin(a) * (r - 3))} ${f1(y - Math.cos(a) * (r - 3))} L${f1(x + Math.sin(a) * (r - 6))} ${f1(y - Math.cos(a) * (r - 6))}`, C.ink, 1.2); }), line(`M${x} ${y} L${x} ${y - r + 6}`, C.ink, 2.2), line(`M${x} ${y} L${f1(x + r * 0.5)} ${f1(y + r * 0.2)}`, HL, 2.2), circle(x, y, 2, C.ink, null));
const laptop = (x: number, y: number, screen: Svg = '') => all(rect(x, y, 56, 38, C.dark, 3, C.ink, 1.6), rect(x + 4, y + 4, 48, 30, '#e8f2fa', 1, null), screen, path(`M${x - 6} ${y + 38} L${x + 62} ${y + 38} L${x + 56} ${y + 46} L${x} ${y + 46} Z`, C.grey2, C.ink, 1.4));
const puddle = (x: number, y: number) => all(ellipse(x, y, 18, 5, '#8cc7e8', C.ink, 1.4), ellipse(x - 5, y - 1, 5, 1.4, C.white, null));
const rainCloud = (x: number, y: number) => all(cloud(x, y, 0.9, C.grey2), drops(x, y + 10), drops(x + 2, y + 18));

export const DISCRETE_MOTIFS: Record<string, Svg> = {
  // ── 3251 Mängder och relationer ────────────────────────────────────────
  /** mängd: five fruits gathered inside one big highlighted closed loop; three grey fruits lie outside it. */
  'disk.mängd': all(bg(), loop(), ...FRUIT.map(([x, y, f]) => f(x, y)), outside()),
  /** element: the same loop in grey; one fruit (the pear) is ringed and highlighted, with an arrow to it. */
  'disk.element.3': all(bg(), loop(C.grey, C.white, 2), greyed(...FRUIT.filter((_, i) => i !== 1).map(([x, y, f]) => f(x, y))), circle(64, 38, 11, MARK, HL, 2.6), pear(64, 40), arrow(104, 12, 76, 30, HL, 3)),
  /** delmängd: the same big loop in grey; a smaller highlighted loop inside it holds two of the fruits. */
  'disk.delmängd': all(bg(), loop(C.grey, C.white, 2), greyed(...FRUIT.filter((_, i) => i === 2 || i === 4).map(([x, y, f]) => f(x, y))), ellipse(51, 52, 22, 28, MARK, HL, 3), ...FRUIT.filter((_, i) => i === 0 || i === 1 || i === 3).map(([x, y, f]) => f(x, y))),
  /** union: two overlapping circles A and B; everything inside either circle is coloured; ∪ in a badge. */
  'disk.union.2': all(bg(), path(UNION, TINT, HL, 3), VA, VB, vennLabels, badge(60, 100, '∪')),
  /** snitt: the same two circles; only the lens where they overlap is coloured; ∩ in a badge. */
  'disk.snitt': all(bg(), path(LENS, TINT, HL, 3), VA, VB, vennLabels, badge(60, 100, '∩')),
  /** komplement: a box around one circle A; everything in the box outside the circle is coloured, the circle stays white. */
  'disk.komplement': all(bg(), rect(10, 14, 100, 84, TINT, 3, HL, 3), circle(52, 56, 26, C.white, C.ink, 2.2), num(52, 61, 'A', 14, C.dark), ...[[22, 26], [96, 28], [94, 84], [20, 88], [92, 56]].map(([x, y]) => circle(x!, y!, 3, HL, null)), ...[[46, 48], [60, 62], [44, 66]].map(([x, y]) => circle(x!, y!, 3, C.grey, null))),
  /** relation: a loop of three small people on the left and a loop of three houses on the right; highlighted arrows join each person to one house. */
  'disk.relation': all(bg(), ellipse(30, 58, 22, 44, C.white, C.grey, 2), ellipse(90, 58, 22, 44, C.white, C.grey, 2),
    ...[26, 58, 90].map((y, i) => all(circle(30, y - 6, 5, C.skin, C.ink, 1.2), path(`M22 ${y + 8} C22 ${y} 38 ${y} 38 ${y + 8} Z`, [C.orange, C.green, C.sky][i]!, C.ink, 1.2))),
    ...[30, 62, 94].map((y, i) => at(90, y, 1, path('M-9 0 L-9 -10 L0 -18 L9 -10 L9 0 Z', [C.yellow, C.pink, C.mint][i]!, C.ink, 1.4), rect(-2.5, -7, 5, 7, C.ink, 0.5, null))),
    arrow(40, 26, 78, 58, HL, 2.6), arrow(40, 58, 78, 26, HL, 2.6), arrow(40, 90, 78, 90, HL, 2.6)),
  /** ordnat par: a big highlighted (2, 5) above a small grid with the point at 2 right, 5 up; a grey (5, 2) with ≠. */
  'disk.ordnat-par': all(bg(), rect(10, 10, 64, 26, MARK, 4, HL, 2.4), num(42, 30, '(2, 5)', 17, HL), greyed(num(96, 22, '≠', 14), num(96, 40, '(5, 2)', 11)),
    ...range(7).map((i) => line(`M${30 + i * 10} 46 L${30 + i * 10} 106 M30 ${46 + i * 10} L90 ${46 + i * 10}`, '#d9e2ea', 1)), line('M30 106 L94 106 M30 106 L30 42', C.grey, 1.8),
    line('M50 106 L50 56 L30 56', HL, 1.4, '3 3'), circle(50, 56, 4.4, HL, null), num(50, 116 - 2, '2', 8, C.grey), num(24, 59, '5', 8, C.grey)),
  /** klammerparentes: two huge highlighted curly brackets { } with grey numbers between; small grey ( ) and [ ] are crossed out below. */
  'disk.klammerparentes': all(bg(), path('M44 14 C34 14 36 30 36 38 C36 44 32 48 26 48 C32 48 36 52 36 58 C36 66 34 82 44 82', 'none', HL, 6), path('M76 14 C86 14 84 30 84 38 C84 44 88 48 94 48 C88 48 84 52 84 58 C84 66 86 82 76 82', 'none', HL, 6), num(60, 54, '1, 2, 3', 13, C.grey), greyed(num(42, 106, '( )', 15), num(78, 106, '[ ]', 15)), cross(60, 100, 0.9)),
  /** räkna upp: a woman holds up her hand and names things one by one; four fruits in a row get the numbers 1, 2, 3, 4 in turn. */
  'disk.räkna-upp': all(bg(), ground, P(28, { top: C.orange, hairStyle: 'long' }), line('M44 62 L54 40', C.skin, 5), circle(55, 37, 4.4, C.skin, C.ink, 1.4), bubble(80, 20, 54, num(80, 24, '1, 2, 3, 4 …', 9, HL)),
    apple(62, 92), pear(76, 94), lemon(90, 92), grape(104, 92), ...['1', '2', '3', '4'].map((s, i) => all(circle(62 + i * 14, 76, 5.5, MARK, HL, 1.6), num(62 + i * 14, 79, s, 8, HL)))),

  // ── 3252 Logiska operatorer ────────────────────────────────────────────
  /** konjunktion: one wire from the left to a lamp, with two switches one after the other; both are closed (highlighted) and the lamp is lit; ∧ in a badge. */
  'disk.konjunktion': all(bg(), line('M10 60 L18 60 M38 60 L50 60 M70 60 L84 60', C.ink, 2.2), sw(18, 60, true, HL), sw(50, 60, true, HL), lamp(96, 56, true), line('M86 60 L84 60', C.ink, 2.2), badge(30, 94, '∧'), num(60, 99, '1 ∧ 1 = 1', 9, C.dark)),
  /** disjunktion: the same lamp, but the two switches sit side by side on two parallel wires; only the upper one is closed and still the lamp is lit; ∨ in a badge. */
  'disk.disjunktion': all(bg(), line('M10 56 L20 56 L20 40 L34 40 M54 40 L68 40 L68 56 L84 56 M20 56 L20 72 L34 72 M54 72 L68 72 L68 56', C.ink, 2.2), sw(34, 40, true, HL), sw(34, 72, false, C.grey), lamp(96, 52, true), badge(30, 98, '∨'), num(70, 103, '1 ∨ 0 = 1', 9, C.dark)),
  /** sanningstabell: a table with the columns p, q and p ∧ q and four rows of 1 and 0; the whole table is framed and highlighted. */
  'disk.sanningstabell': (() => { const R = [['p', 'q', 'p∧q'], ['1', '1', '1'], ['1', '0', '0'], ['0', '1', '0'], ['0', '0', '0']]; return all(bg(), rect(14, 12, 92, 92, C.white, 4, HL, 3), rect(14, 12, 92, 18, MARK, 4, null), line('M14 30 L106 30', HL, 2), line('M44 12 L44 104 M74 12 L74 104', C.grey, 1.4), ...R.slice(2).map((_, r) => line(`M14 ${48 + r * 18} L106 ${48 + r * 18}`, C.grey2, 1)), ...R.flatMap((row, r) => row.map((t, c) => num(29 + c * 30, 25 + r * 18, t, r === 0 ? 11 : 12, r === 0 ? HL : c === 2 ? HL : C.dark)))); })(),
  /** antingen eller: an ice cream with a tick, a piece of cake with a tick, but the ice cream and the cake together are crossed out. */
  'disk.antingen-eller': (() => {
    const ice = (x: number, y: number) => all(path(`M${x - 7} ${y} L${x} ${y + 18} L${x + 7} ${y} Z`, C.tan, C.ink, 1.4), circle(x, y - 4, 8, C.pink, C.ink, 1.4));
    const cake = (x: number, y: number) => all(path(`M${x - 10} ${y + 14} L${x + 10} ${y + 14} L${x + 10} ${y} L${x - 10} ${y + 6} Z`, C.beige, C.ink, 1.4), path(`M${x - 10} ${y + 6} L${x + 10} ${y} L${x + 10} ${y - 3} L${x - 10} ${y + 3} Z`, C.white, C.ink, 1.2), circle(x + 4, y - 4, 2.6, C.red, C.ink, 1));
    return all(bg(), rect(8, 14, 32, 58, MARK, 4, HL, 2.2), ice(24, 34), check(24, 86, 1.2), rect(44, 14, 32, 58, MARK, 4, HL, 2.2), cake(60, 34), check(60, 86, 1.2), rect(80, 14, 34, 58, C.white, 4, C.grey, 1.6), greyed(ice(90, 34), cake(104, 40)), cross(97, 86, 1.3));
  })(),
  /** negation: a lit lamp on the left, an arrow through a highlighted ¬ badge, and the same lamp dark on the right; 1 becomes 0 below. */
  'disk.negation': all(bg(), lamp(24, 50, true), arrow(40, 52, 50, 52, C.dark, 2.4), badge(60, 52, '¬'), arrow(72, 52, 82, 52, C.dark, 2.4), lamp(96, 50, false), num(24, 92, '1', 18, C.dark), num(60, 92, '→', 16, C.grey), num(96, 92, '0', 18, HL)),
  /** implikation: a rain cloud on the left, a highlighted ⇒ arrow, and a wet street with a puddle on the right. */
  'disk.implikation': all(bg(), rainCloud(26, 38), line('M8 92 L52 92', C.grey, 2), num(60, 64, '⇒', 30, HL), puddle(92, 88), line('M68 92 L116 92', C.grey, 2), drops(92, 68), check(92, 30, 1.2)),
  /** omvändning: the same cloud and puddle, but the highlighted ⇒ arrow points back from the puddle to the cloud and has a question mark; the grey original arrow is above. */
  'disk.omvändning': all(bg(), rainCloud(26, 50), line('M8 92 L52 92', C.grey, 2), greyed(num(60, 30, '⇒', 20)), g('translate(120 0) scale(-1 1)', num(60, 72, '⇒', 30, HL)), num(60, 98, '?', 18, HL), puddle(92, 88), line('M68 92 L116 92', C.grey, 2)),
  /** ekvivalens: a closed switch on the left and a lit lamp on the right, joined by a big highlighted double arrow ⇔; below, an open switch ⇔ a dark lamp in grey. */
  'disk.ekvivalens': all(bg(), sw(10, 44, true, C.ink), num(60, 52, '⇔', 30, HL), lamp(96, 40, true), greyed(sw(10, 96, false), num(60, 102, '⇔', 18), lamp(96, 92, false))),

  // ── 3253 Bevismetoder ──────────────────────────────────────────────────
  /** sats: a framed card with a right triangle and a² + b² = c², sealed with a highlighted rosette and a tick. */
  'disk.sats': all(bg(), rect(10, 14, 100, 84, C.white, 4, HL, 3), path('M22 80 L62 80 L22 44 Z', '#d9ecf7', C.ink, 2), rect(22, 72, 8, 8, 'none', 0, C.ink, 1.2), num(40, 34, 'a² + b² = c²', 11, C.dark), circle(88, 72, 14, MARK, HL, 2.4), path('M80 84 L76 100 L84 96 L88 104 L90 86 Z', HL, null), check(88, 72, 1.1, HL)),
  /** axiom: a wall of blocks; the bottom row (the foundation) is highlighted and carries all the grey blocks above it. */
  'disk.axiom': all(bg(), ground, ...range(4).map((i) => rect(12 + i * 24, 88, 24, 22, MARK, 1, HL, 2.4)), ...range(3).map((i) => rect(24 + i * 24, 66, 24, 22, C.grey2, 1, C.grey, 1.6)), ...range(2).map((i) => rect(36 + i * 24, 44, 24, 22, C.grey2, 1, C.grey, 1.6)), rect(48, 22, 24, 22, C.grey2, 1, C.grey, 1.6), num(60, 104, 'a + b = b + a', 8, HL), arrow(100, 40, 100, 84, HL, 2.4)),
  /** direkt bevis: four steps in a row joined by straight highlighted arrows, ending in a green tick. */
  'disk.direkt-bevis': all(bg(), ...range(4).map((i) => rect(8 + i * 26, 46, 18, 18, i === 0 ? C.white : MARK, 3, HL, 2.2)), num(17, 59, '2a', 8, C.dark), num(43, 59, '+2b', 7, C.dark), num(69, 59, '2(a+b)', 5.5, C.dark), ...range(3).map((i) => arrow(27 + i * 26, 55, 33 + i * 26, 55, HL, 2.4)), check(95, 55, 1.2), num(60, 92, '1 → 2 → 3 → ✓', 10, C.grey)),
  /** motsägelsebevis: the same row of steps starts from a box with ¬, runs into a yellow flash (a contradiction), and only then turns to a tick. */
  'disk.motsägelsebevis': all(bg(), rect(8, 46, 18, 18, MARK, 3, HL, 2.2), num(17, 60, '¬', 14, HL), arrow(27, 55, 35, 55, HL, 2.4), rect(36, 46, 18, 18, C.white, 3, HL, 2.2), arrow(55, 55, 63, 55, HL, 2.4), bolt(74, 55, 1.4), cross(74, 82, 1.2), path('M86 55 C96 30 104 40 104 48', 'none', OK, 2.4), check(104, 56, 1.1), num(45, 59, 'N+1', 7, C.dark)),
  /** induktionsbevis: a row of dominoes numbered 1, 2, 3 … n, n + 1; the first is pushed and they fall one after the other. */
  'disk.induktionsbevis': all(bg(), ground, ...range(6).map((i) => { const tilt = i < 3 ? 60 - i * 18 : 0; return g(`rotate(${tilt} ${14 + i * 18} 108)`, rect(10 + i * 18, 70, 8, 38, i < 3 ? MARK : C.white, 1.5, i < 3 ? HL : C.grey, 2)); }), arrow(4, 58, 12, 66, HL, 2.6), ...['1', '2', '3', '…', 'n', 'n+1'].map((s, i) => num(14 + i * 18, 40, s, 9, i < 3 ? HL : C.dark)), line('M8 46 L112 46', C.grey2, 1)),
  /** vilket skulle bevisas: a page of grey proof lines; at the bottom right a small black square ∎ is ringed and highlighted. */
  'disk.vilket-skulle-bevisas': all(bg(), rect(18, 8, 84, 104, C.white, 3, C.ink, 1.6), ...range(7).map((i) => line(`M26 ${22 + i * 11} L${i % 3 === 2 ? 70 : 92} ${22 + i * 11}`, C.grey2, 2.4)), line('M26 99 L66 99', C.grey2, 2.4), circle(86, 98, 11, MARK, HL, 2.6), rect(81, 93, 10, 10, C.ink, 0.5, null)),

  // ── 3254 Grafer och nätverk ────────────────────────────────────────────
  /** graf: six dots joined by lines into a network, all highlighted. */
  'disk.graf.2': all(bg(), net(HL, MARK, HL)),
  /** nod: the same network in grey; one dot is big, ringed and highlighted. */
  'disk.nod': all(bg(), net(), circle(N[4]![0], N[4]![1], 14, 'none', HL, 2.2), node(4, MARK, HL, 9)),
  /** kant: the same network in grey; one line between two dots is thick and highlighted. */
  'disk.kant.2': all(bg(), net(), edge(1, 4, HL, 6), node(1), node(4)),
  /** riktad graf: the same network where every line is a highlighted arrow pointing one way. */
  'disk.riktad-graf': all(bg(), ...EDGES.map(([a, b]) => { const [x1, y1] = along(a, b, 0.14), [x2, y2] = along(a, b, 0.84); return arrow(x1, y1, x2, y2, HL, 2.4); }), ...N.map((_, i) => node(i, C.white, C.ink))),
  /** kortaste vägen: the same network with distances on the lines; a house at one dot and a flag at another; the shortest route between them is highlighted. */
  'disk.kortaste-vägen': all(bg(), net(), ...([[0, 1, '4'], [1, 2, '5'], [0, 3, '2'], [1, 4, '3'], [2, 4, '6'], [3, 4, '2'], [4, 5, '3'], [2, 5, '9'], [3, 5, '8']] as [number, number, string][]).map(([a, b, s]) => { const [x, y] = along(a, b, 0.5); return num(x, y + 3, s, 8, C.dark); }), edge(0, 3, HL, 4.4), edge(3, 4, HL, 4.4), edge(4, 5, HL, 4.4), node(0, MARK, HL), node(3, MARK, HL), node(4, MARK, HL), node(5, MARK, HL), at(20, 22, 0.8, path('M-8 0 L-8 -9 L0 -16 L8 -9 L8 0 Z', C.yellow, C.ink, 1.4)), line('M100 84 L100 66', C.ink, 1.6), path('M100 66 L112 70 L100 74 Z', C.red, C.ink, 1)),
  /** förbindelse: two small cities far apart; a highlighted dashed arc with a plane on it joins them. */
  'disk.förbindelse': (() => {
    const city = (x: number, col: string) => all(rect(x - 14, 82, 9, 28, col, 1, C.ink, 1.2), rect(x - 4, 72, 10, 38, C.grey2, 1, C.ink, 1.2), rect(x + 7, 88, 9, 22, col, 1, C.ink, 1.2));
    const plane = at(60, 26, 1, path('M-14 0 L14 -2 C18 -2 18 2 14 2 L-14 0 Z', C.white, C.ink, 1.4), path('M-2 0 L-8 -10 L-4 -10 L6 -1 Z M-2 1 L-8 10 L-4 10 L6 1 Z', C.white, C.ink, 1.2), path('M-14 0 L-18 -6 L-15 -6 L-10 -1 Z', C.white, C.ink, 1.2));
    return all(bg('#e4f1fa'), ground, city(18, C.sky), city(100, C.tan), path('M20 66 C30 10 90 10 100 66', 'none', HL, 3, ), line('M20 66 C30 10 90 10 100 66', MARK, 1.4, '5 5'), circle(20, 66, 4, HL, null), circle(100, 66, 4, HL, null), plane);
  })(),

  // ── 3255 Träd och sökning ──────────────────────────────────────────────
  /** mapp: a laptop screen with a big highlighted yellow folder; three small documents slide into it. */
  'disk.mapp': all(bg(), laptop(30, 52, all(...range(3).map((i) => rect(38 + i * 14, 60, 10, 12, C.white, 1, C.grey, 1)))), path('M30 14 L50 14 L56 20 L90 20 L90 48 L30 48 Z', C.yellow, HL, 2.6), line('M30 26 L90 26', '#d9a83a', 1.6), rect(96, 22, 12, 15, C.white, 1, C.ink, 1.2), line('M99 27 L105 27 M99 31 L105 31', C.grey, 1), arrow(94, 30, 84, 32, HL, 2)),
  /** träd: an upside-down tree of dots and lines (one at the top, two below it, four at the bottom), all highlighted; a small grey real tree upside down in the corner. */
  'disk.träd.2': all(bg(), tree({ ecol: HL, ncol: HL, nfill: MARK }), greyed(at(104, 14, 0.5, line('M0 -10 L0 8', C.brown, 4), circle(0, 14, 12, C.green, C.ink, 1.4)))),
  /** rot: the same tree in grey; the single dot at the top is ringed and highlighted. */
  'disk.rot.2': all(bg(), tree({ hl: [0] }), arrow(96, 14, 74, 20, HL, 2.6)),
  /** löv: the same tree in grey; the four dots at the bottom are ringed and highlighted. */
  'disk.löv.2': all(bg(), tree({ hl: [3, 4, 5, 6] })),
  /** sökning: a woman with a big magnifying glass goes along a bookshelf book by book; a thought bubble shows the red book she wants, and that book on the shelf is ringed and highlighted. */
  'disk.sökning': (() => { const cols = [C.sky, C.green, C.tan, C.purple, C.yellow, C.red, C.mint]; return all(bg(), ground, rect(48, 52, 66, 60, C.brown, 2, C.ink, 1.8), line('M48 82 L114 82', C.ink, 1.8), ...cols.map((c, k) => rect(52 + k * 8.6, 56 + (k % 3), 7, 25 - (k % 3), c, 1, C.ink, 1)), ...cols.slice().reverse().map((c, k) => rect(52 + k * 8.6, 86 + (k % 2), 7, 24 - (k % 2), c === C.red ? C.orange : c, 1, C.ink, 1)), rect(94.5, 52, 11, 32, 'none', 2, HL, 2.6), P(24, { top: C.orange, hairStyle: 'long' }), line('M38 66 L50 60', C.skin, 5), circle(58, 62, 9, 'rgba(255,255,255,0.6)', C.ink, 2.4), arrow(70, 46, 90, 46, HL, 2.2), bubble(62, 20, 26, rect(58, 12, 8, 14, C.red, 1, C.ink, 1))); })(),
  /** linjär sökning: eight boxes in a row; highlighted hops go from the first box to the next, one at a time, ticking each, until box 26 is found. */
  'disk.linjär-sökning': all(bg(), ...range(8).map((i) => box(i, i < 5 ? '#eef2f5' : i === 5 ? MARK : C.white, i === 5 ? HL : C.grey)), ...range(5).map((i) => hop(i, i + 1)), ...range(5).map((i) => check(14 + i * 13, 88, 0.6, C.grey)), circle(85, 68, 11, 'none', HL, 2.2), num(30, 30, '26 ?', 14, HL)),
  /** binär sökning: the same eight sorted boxes; the left half is greyed out, a big hop lands in the middle, then a smaller hop finds 26. */
  'disk.binär-sökning': all(bg(), ...range(8).map((i) => (i < 4 ? greyed(box(i)) : box(i, i === 5 ? MARK : C.white, i === 5 || i === 3 ? HL : C.grey))), path('M14 57 Q34 30 53 57', 'none', HL, 2.4), path('M53 57 Q70 40 79 57', 'none', HL, 2.4), line('M57.5 52 L57.5 84', HL, 1.4, '3 3'), circle(79, 68, 11, 'none', HL, 2.2), num(30, 30, '26 ?', 14, HL), num(57, 96, '½', 14, HL)),
  /** ordbok: a thick open book with columns of tiny lines and a row of letter tabs A B C … on the page edge; one line is highlighted. */
  'disk.ordbok': all(bg(), path('M10 34 L58 28 L58 100 L10 104 Z', C.white, C.ink, 2), path('M110 34 L62 28 L62 100 L110 104 Z', C.white, C.ink, 2), path('M58 28 C60 24 60 24 62 28 L62 100 C60 104 60 104 58 100 Z', C.navy, C.ink, 1.6), path('M10 104 L10 110 L58 106 L62 106 L110 110 L110 104', 'none', C.ink, 1.6),
    ...range(6).flatMap((i) => [line(`M16 ${44 + i * 9} L${i % 2 ? 46 : 52} ${43 + i * 9}`, C.grey2, 2), line(`M68 ${43 + i * 9} L${i % 2 ? 98 : 104} ${44 + i * 9}`, C.grey2, 2)]), line('M68 61 L104 62', HL, 3), ...['A', 'B', 'C', 'D', 'E'].map((s, i) => all(rect(10 + i * 20, 10, 16, 14, i === 2 ? MARK : C.white, 2, i === 2 ? HL : C.grey, 1.4), num(18 + i * 20, 21, s, 9, i === 2 ? HL : C.dark)))),
  /** i alfabetisk ordning: cards A B C D E in a neat row with a highlighted arrow along them; above, the same cards mixed up in grey and crossed out. */
  'disk.i-alfabetisk-ordning': all(bg(), greyed(...['D', 'A', 'E', 'B', 'C'].map((s, i) => all(rect(12 + i * 20, 16, 16, 20, C.white, 2, C.ink, 1.4), num(20 + i * 20, 31, s, 11)))), cross(60, 46, 0.9), ...['A', 'B', 'C', 'D', 'E'].map((s, i) => all(rect(12 + i * 20, 56, 16, 22, MARK, 2, HL, 2), num(20 + i * 20, 72, s, 13, HL))), arrow(14, 92, 106, 92, HL, 3)),

  // ── 3256 Rekursion ─────────────────────────────────────────────────────
  /** rekursion: a framed picture that contains a smaller copy of itself, which contains a smaller copy, and so on; highlighted arrows lead inward. */
  'disk.rekursion': all(bg(), ...range(5).map((i) => { const s = Math.pow(0.66, i), w = 100 * s, x = 60 - w / 2 + i * 6 * s, y = 60 - w * 0.45 + i * 5 * s; return all(rect(f1(x), f1(y), f1(w), f1(w * 0.9), i % 2 ? C.white : '#e4f1fa', 2, i === 0 ? C.ink : HL, f1(2.4 * Math.max(s, 0.5))), circle(f1(x + w * 0.2), f1(y + w * 0.2), f1(w * 0.06), C.yellow, null)); }), arrow(18, 100, 52, 74, HL, 2.6)),
  /** matrjosjka: four painted wooden dolls in a row from big to small; the biggest one is opened, its top half lifted. */
  'disk.matrjosjka': all(bg(), ground, doll(24, 1.5, C.red, true), doll(58, 1.15, C.orange), doll(84, 0.85, C.yellow), doll(104, 0.6, C.green)),
  /** basfall: a staircase of numbers 3, 2, 1, 0 going down with arrows; the last step 0 is highlighted with a red stop sign without text. */
  'disk.basfall': all(bg(), ...['3', '2', '1', '0'].map((s, i) => all(rect(8 + i * 22, 20 + i * 20, 22, 20, i === 3 ? MARK : C.white, 2, i === 3 ? HL : C.grey, i === 3 ? 2.6 : 1.6), num(19 + i * 22, 35 + i * 20, s, 12, i === 3 ? HL : C.dark))), ...range(3).map((i) => arrow(26 + i * 22, 34 + i * 20, 32 + i * 22, 44 + i * 20, C.grey, 2)), path('M100 70 L108 70 L114 76 L114 84 L108 90 L100 90 L94 84 L94 76 Z', C.red, C.ink, 1.6), line('M99 80 L109 80', C.white, 3)),
  /** föregående: four people in a queue facing a counter on the right, with tickets 1–4 above them; person 3 has a grey ring, and a highlighted arrow points from them to the person just before them (2), who is ringed and highlighted. */
  'disk.föregående': (() => { const Qs: [number, string, number][] = [[86, C.green, 1], [62, C.orange, 2], [38, C.sky, 3], [14, C.pink, 4]]; return all(bg(), ground, rect(100, 58, 16, 54, C.tan, 2, C.ink, 1.6), ...Qs.map(([x, c, n]) => all(n === 2 ? ellipse(x, 82, 14, 32, MARK, HL, 2.8) : n === 3 ? ellipse(x, 82, 14, 32, 'none', C.grey, 2) : '', at(x, 0, 0.55, g('translate(0 91)', P(0, { top: c }))), rect(x - 8, 30, 16, 13, n === 2 ? MARK : C.white, 2, n === 2 ? HL : C.grey, n === 2 ? 2.4 : 1.4), num(x, 40.5, String(n), 10, n === 2 ? HL : C.dark))), path('M38 26 Q50 10 60 24', 'none', HL, 2.6), arrow(57, 19, 61, 26, HL, 2.2)); })(),
  /** delproblem: one big grey box splits along arrows into three small highlighted boxes, each with a tick. */
  'disk.delproblem': all(bg(), rect(30, 10, 60, 32, C.grey2, 3, C.grey, 2), num(60, 31, '?', 16, C.dark), ...[22, 60, 98].map((x) => all(arrow(60, 44, x, 66, C.grey, 2), rect(x - 13, 70, 26, 22, MARK, 3, HL, 2.4), check(x, 81, 0.9)))),
  /** fraktal: a triangle made of smaller triangles made of even smaller triangles (a Sierpiński triangle), highlighted. */
  'disk.fraktal': (() => {
    const out: Svg[] = [];
    const tri = (x: number, y: number, s: number, d: number) => { if (d === 0) { out.push(path(`M${f1(x)} ${f1(y)} L${f1(x + s)} ${f1(y)} L${f1(x + s / 2)} ${f1(y - s * 0.866)} Z`, TINT, HL, 1)); return; } tri(x, y, s / 2, d - 1); tri(x + s / 2, y, s / 2, d - 1); tri(x + s / 4, y - s * 0.433, s / 2, d - 1); };
    tri(10, 104, 100, 4);
    return all(bg(), ...out);
  })(),

  // ── 3257 Algoritmisk komplexitet ───────────────────────────────────────
  /** komplexitet: axes with the size of the input to the right (1, 2, 3 … boxes) and time upward; a grey straight line and a highlighted curve that shoots steeply up; a small stopwatch. */
  'disk.komplexitet': all(bg(), line('M18 100 L110 100 M18 100 L18 12', C.dark, 2), arrow(100, 100, 112, 100, C.dark, 2), arrow(18, 22, 18, 10, C.dark, 2), line('M18 100 L108 70', C.grey, 2.4), path('M18 100 C60 98 80 80 96 14', 'none', HL, 3.4), ...range(4).map((i) => rect(30 + i * 20 - i * 1.5, 104, 2 + i * 3, 6, C.grey, 1, null)), watch(36, 36, 11, C.grey), num(104, 30, 'n²', 11, HL)),
  /** indata: a grey machine with a gear; a list of numbers on the left goes into it along a highlighted arrow; on the right a grey arrow comes out. */
  'disk.indata': all(bg(), rect(10, 30, 28, 56, MARK, 3, HL, 2.6), ...['7', '3', '9', '1'].map((s, i) => num(24, 46 + i * 12, s, 11, HL)), arrow(40, 58, 54, 58, HL, 3.4), rect(56, 34, 36, 48, C.grey2, 4, C.ink, 1.8), gear(74, 58, 10), greyed(arrow(94, 58, 110, 58, C.ink, 2.4))),
  /** sorteringsalgoritm: bars of mixed heights on the left (grey), a gear in the middle, and the same bars from short to tall on the right (highlighted). */
  'disk.sorteringsalgoritm': (() => { const H = [26, 12, 34, 18, 6, 22]; const S = [...H].sort((a, b) => a - b); return all(bg(), line('M8 92 L46 92 M74 92 L112 92', C.dark, 1.6), ...H.map((h, i) => rect(10 + i * 6, 92 - h * 1.6, 5, h * 1.6, C.grey2, 0.5, C.grey, 0.8)), gear(60, 56, 9), arrow(48, 76, 52, 66, C.grey, 1.6), arrow(68, 66, 72, 76, C.grey, 1.6), ...S.map((h, i) => rect(76 + i * 6, 92 - h * 1.6, 5, h * 1.6, MARK, 0.5, HL, 1.2)), arrow(76, 104, 112, 104, HL, 2)); })(),
  /** körtid: a laptop with a progress bar half full; next to it a big highlighted stopwatch. */
  'disk.körtid': all(bg(), laptop(8, 52, all(rect(16, 66, 40, 8, C.white, 2, C.ink, 1.2), rect(16, 66, 22, 8, OK, 2, null))), watch(88, 48, 22)),
};

