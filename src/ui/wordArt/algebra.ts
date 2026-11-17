/**
 * Matematik & naturvetenskap → Matematikens grunder → Algebraiska uttryck, 3121–3127 (0.48): variables and
 * constants, terms and coefficients, brackets and the order of operations, simplifying expressions,
 * solving simple equations, inequalities and everyday formulas. Digits, the letters x, y, a, b, s, v, t
 * and the signs + − · = < > ≤ ≥ ( ) may appear; no picture contains a word that names its word. Close
 * words share one layout where only the highlighted part differs (variabel/konstant on 2x + 7;
 * term/koefficient/variabelterm/konstantterm/förtecken on 4x + 7 − 2y; vänsterled/högerled on 2x + 1 = 9;
 * multiplicera in/bryta ut with the arrows going in opposite directions; ≥/≤ on the same number line).
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL, T, thought } from './people';
import { P, greyed } from './blindFix';

// ── Palette and small helpers ────────────────────────────────────────
const SOFT = '#f4f6f8';
const OK = '#3f9a5a';
const MARK = '#fff3b0';
const BLUE = '#3c7fb0';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ground = line('M4 112 L116 112', C.grey2, 2);
const bg = (col: string = SOFT) => rect(4, 4, 112, 108, col, 3, null);
const num = (x: number, y: number, s: string, size = 12, col: string = C.ink) => T(x, y, s, size, col);
const check = (x: number, y: number, s = 1, col: string = OK) => line(`M${x - 6 * s} ${y} L${x - 2 * s} ${y + 5 * s} L${x + 7 * s} ${y - 6 * s}`, col, 3 * s);
const cross = (x: number, y: number, s = 1, col: string = C.red) => line(`M${x - 5 * s} ${y - 5 * s} L${x + 5 * s} ${y + 5 * s} M${x + 5 * s} ${y - 5 * s} L${x - 5 * s} ${y + 5 * s}`, col, 3 * s);
/** Highlighted box behind a part of an expression. */
const mark = (x: number, y: number, w: number, h: number) => rect(f1(x - w / 2), f1(y - h / 2), f1(w), f1(h), MARK, 3, HL, 2.2);
/** A white card for an expression. */
const card = (x: number, y: number, w: number, h: number) => rect(x, y, w, h, C.white, 5, C.ink, 1.6);
/**
 * A row of tokens with explicit widths (in units of the font size), centred at x. `hl` = indices to
 * highlight; with `dim`, the others turn grey. Returns the svg and the centre x of each token.
 */
type Tok = [string, number];
const expr = (x: number, y: number, toks: Tok[], size: number, hl: number[] = [], o: { dim?: boolean; col?: string; box?: boolean } = {}) => {
  const tot = toks.reduce((s, t) => s + t[1], 0) * size;
  let cx = x - tot / 2;
  const xs: number[] = [], out: Svg[] = [], marks: Svg[] = [];
  toks.forEach(([t, w], i) => {
    const c = f1(cx + (w * size) / 2); xs.push(c); cx += w * size;
    const on = hl.includes(i);
    if (on && o.box !== false) marks.push(mark(c, y - size * 0.35, w * size + 3, size * 1.2));
    out.push(num(c, y, t, size, on ? HL : o.dim && hl.length ? C.grey : (o.col ?? C.ink)));
  });
  return { svg: all(...marks, ...out), xs };
};
/** Box spanning tokens i..j of an expression drawn by expr(). */
const span = (e: { xs: number[] }, toks: Tok[], size: number, y: number, i: number, j: number, col: string = HL, fill: string = MARK) => {
  const l = e.xs[i]! - (toks[i]![1] * size) / 2 - 2, r = e.xs[j]! + (toks[j]![1] * size) / 2 + 2;
  return rect(f1(l), f1(y - size * 0.98), f1(r - l), f1(size * 1.26), fill, 4, col, 2.2);
};
/** Small superscript digit drawn up to the right of (x, y). */
const sup = (x: number, y: number, d: string, size: number, col: string = C.ink) => num(x, y - size * 0.45, d, size * 0.6, col);
const pencil = (x: number, y: number, rot = -35) => g(`translate(${x} ${y}) rotate(${rot})`, rect(-2.5, -20, 5, 18, C.yellow, 0.5, C.ink, 1), path('M-2.5 -2 L2.5 -2 L0 4 Z', C.tan, C.ink, 0.8), rect(-2.5, -23, 5, 3, C.pink, 0.5, C.ink, 0.8));
const sheet = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, C.white, 2, C.ink, 1.4), ...range(Math.floor(h / 12)).map((i) => line(`M${x + 4} ${y + 12 + i * 12} L${x + w - 4} ${y + 12 + i * 12}`, '#cfe0ef', 0.8)));
const padlock = (x: number, y: number, s = 1) => at(x, y, s, path('M-6 -4 L-6 -11 C-6 -19 6 -19 6 -11 L6 -4', 'none', C.ink, 2.4), rect(-9, -4, 18, 14, C.gold, 2, C.ink, 1.4), circle(0, 2, 1.8, C.ink, null));
/** A dial whose pointer can turn, with a circular arrow (= changes). */
const spin = (x: number, y: number, r: number, col: string = HL) => all(path(`M${x + r} ${y} A${r} ${r} 0 1 1 ${f1(x + r * 0.2)} ${f1(y - r * 0.98)}`, 'none', col, 2.2), path(`M${f1(x + r * 0.2)} ${f1(y - r * 0.98)} l7 -3 l-2 7 Z`, col, col, 1));
/** Balance scale with something on each pan. */
const balance = (cx: number, tilt: number, left: Svg, right: Svg, col: string = C.ink) => all(
  path(`M${cx - 12} 108 L${cx + 12} 108 L${cx} 96 Z`, C.grey, C.ink, 1.2), line(`M${cx} 96 L${cx} 52`, col, 2.4),
  g(`rotate(${tilt} ${cx} 52)`, line(`M${cx - 40} 52 L${cx + 40} 52`, col, 2.4), line(`M${cx - 40} 52 L${cx - 50} 72 M${cx - 40} 52 L${cx - 30} 72 M${cx + 40} 52 L${cx + 30} 72 M${cx + 40} 52 L${cx + 50} 72`, C.ink, 1),
    path(`M${cx - 54} 72 L${cx - 26} 72 C${cx - 28} 80 ${cx - 52} 80 ${cx - 54} 72 Z`, C.silver, C.ink, 1.2), path(`M${cx + 26} 72 L${cx + 54} 72 C${cx + 52} 80 ${cx + 28} 80 ${cx + 26} 72 Z`, C.silver, C.ink, 1.2),
    g(`translate(${cx - 40} 66) rotate(${-tilt})`, left), g(`translate(${cx + 40} 66) rotate(${-tilt})`, right)),
  circle(cx, 52, 3, C.dark, null));
/** Number line from a to b; returns svg and X(). */
const nline = (y: number, a: number, b: number, x0 = 16, x1 = 104) => {
  const step = (x1 - x0) / (b - a), X = (n: number) => f1(x0 + (n - a) * step), out: Svg[] = [line(`M${x0 - 8} ${y} L${x1 + 8} ${y}`, C.ink, 1.8)];
  for (let n = a; n <= b; n++) out.push(line(`M${X(n)} ${y - 4} L${X(n)} ${y + 4}`, C.ink, 1.4), num(X(n), y + 15, `${n}`, 9));
  return { svg: all(...out), X };
};
/** A ray on a number line from n towards dir, with an open or filled dot. */
const ray = (L: { X: (n: number) => number }, y: number, n: number, dir: 1 | -1, filled: boolean, end: number) => all(line(`M${L.X(n)} ${y - 10} L${end} ${y - 10}`, HL, 3.4), path(`M${end + dir * 7} ${y - 10} L${end} ${y - 14} L${end} ${y - 6} Z`, HL, HL, 1), circle(L.X(n), y - 10, 4.4, filled ? HL : C.white, HL, 2.4));
/** Stick-figure icon (for signs). */
const icon = (x: number, y: number, col: string = C.dark, s = 1) => at(x, y, s, circle(0, -9, 3, col, null), path('M-4 -5 L4 -5 L3.4 4 L-3.4 4 Z', col, null), line('M-2 4 L-2 10 M2 4 L2 10', col, 2));
const card2x7 = (hl: number[]) => {
  const toks: Tok[] = [['2', 0.62], ['x', 0.62], ['+', 0.9], ['7', 0.7]];
  return { toks, e: expr(60, 46, toks, 26, hl, { dim: true }) };
};
const T4x: Tok[] = [['4', 0.62], ['x', 0.62], ['+', 0.82], ['7', 0.66], ['−', 0.82], ['2', 0.62], ['y', 0.62]];
const card4x = (inner: (e: { xs: number[] }) => Svg, hl: number[] = [], dim = true, extra: Svg = '') => {
  const e = expr(60, 64, T4x, 19, hl, { dim, box: false });
  return all(bg(), card(8, 36, 104, 42), inner(e), e.svg, extra);
};
const T21: Tok[] = [['2', 0.62], ['x', 0.62], ['+', 0.82], ['1', 0.62], ['=', 0.9], ['9', 0.66]];
const sides = (left: boolean) => {
  const e2 = expr(60, 62, T21, 20, left ? [0, 1, 2, 3] : [5], { dim: true, box: false });
  const box = left ? span(e2, T21, 20, 62, 0, 3) : span(e2, T21, 20, 62, 5, 5);
  const sideArrow = left ? arrow(36, 96, 22, 96, HL, 3) : arrow(84, 96, 98, 96, HL, 3);
  return all(bg(), card(8, 36, 104, 40), box, e2.svg, sideArrow, line('M60 84 L60 104', C.grey, 1.4, '3 3'));
};

export const ALGEBRA_MOTIFS: Record<string, Svg> = {
  // ── 3121 Variabler och konstanter ──────────────────────────────────
  /** bokstav: three toy blocks with the letters a, b, c, and a pencil writing a fourth letter on paper. */
  'algx.bokstav': all(bg('#eef4f8'), ...[['a', C.orange, 16], ['b', C.sky, 44], ['c', C.green, 72]].map(([t, col, x]) => all(rect(x as number, 70, 26, 26, col as string, 3, C.ink, 1.6), num((x as number) + 13, 90, t as string, 20, C.white))), rect(30, 44, 26, 26, C.yellow, 3, C.ink, 1.6), num(43, 64, 'd', 20, C.ink), sheet(74, 16, 36, 46), num(92, 46, 'e', 22, HL), pencil(104, 54, -25), ground),
  /** variabel: 2x + 7 with x highlighted; below x a turning dial and the values 1, 2, 3 that x can take. */
  'algx.variabel.2': (() => { const { e } = card2x7([1]); return all(bg(), card(10, 18, 100, 40), e.svg, spin(e.xs[1]!, 84, 13), num(e.xs[1]! - 30, 90, '1', 13, HL), num(e.xs[1]!, 89, '2', 13, HL), num(e.xs[1]! + 30, 90, '3', 13, HL), arrow(e.xs[1]!, 58, e.xs[1]!, 68, HL, 2)); })(),
  /** konstant: the same 2x + 7, now with 7 highlighted and a padlock under it: it never changes. */
  'algx.konstant': (() => { const { e } = card2x7([3]); return all(bg(), card(10, 18, 100, 40), e.svg, arrow(e.xs[3]!, 58, e.xs[3]!, 68, HL, 2), padlock(e.xs[3]!, 88, 1.3), padlock(30, 92, 0.8), greyed(spin(30, 90, 12, C.dark)), cross(30, 90, 1)); })(),
  /** algebraiskt uttryck: a card 3a + 2b − 5 framed as a whole; letters orange, numbers dark; no equals sign. */
  'algx.algebraiskt-uttryck': (() => { const toks: Tok[] = [['3', 0.62], ['a', 0.62], ['+', 0.82], ['2', 0.62], ['b', 0.62], ['−', 0.82], ['5', 0.66]]; const e = expr(60, 64, toks, 20, [1, 4], { box: false }); return all(bg(), rect(10, 38, 100, 40, MARK, 6, HL, 2.6), e.svg, greyed(card(30, 88, 60, 18), num(60, 101, '3 + 2 = 5', 10)), cross(92, 97, 0.9)); })(),
  /** värde: x on a card with a tag hanging from it; on the tag the highlighted number 3. */
  'algx.värde.2': all(bg(), card(14, 22, 44, 44), num(36, 54, 'x', 30, C.ink), line('M58 44 C70 44 70 60 78 64', C.ink, 1.6), path('M78 52 L108 52 L108 84 L78 84 L72 68 Z', MARK, HL, 2.2), circle(78, 68, 2, C.ink, null), num(92, 77, '3', 22, HL), num(36, 94, 'x = 3', 14, C.grey)),
  /** variera: a price curve that goes up and down month by month (highlighted) against a flat grey line. */
  'algx.variera': all(bg(), line('M14 18 L14 98 L108 98', C.ink, 1.8), line('M14 70 L106 70', C.grey, 2, '4 3'), line('M16 72 L28 48 L40 80 L52 38 L64 62 L76 30 L88 76 L102 52', HL, 3), ...[28, 40, 52, 64, 76, 88, 102].map((x) => line(`M${x} 96 L${x} 100`, C.ink, 1.2)), arrow(20, 24, 20, 14, C.ink, 1.6)),
  /** sätta in: a tile with 4 drops into the place of x in 2x + 1; below, 2 · 4 + 1. */
  'algx.sätta-in.2': (() => { const toks: Tok[] = [['2', 0.62], ['x', 0.8], ['+', 0.82], ['1', 0.62]]; const e = expr(60, 66, toks, 22, [], { dim: false }); return all(bg(), card(14, 44, 92, 34), rect(e.xs[1]! - 10, 46, 20, 26, 'none', 3, HL, 2, ), e.svg, rect(e.xs[1]! - 10, 8, 20, 22, MARK, 3, HL, 2.2), num(e.xs[1]!, 26, '4', 18, HL), arrow(e.xs[1]!, 31, e.xs[1]!, 44, HL, 2.6), num(60, 100, '2 · 4 + 1', 15, C.dark)); })(),
  /** fast avgift: three monthly bills; the 99 at the top of each is identical and highlighted, the grey extra part differs. */
  'algx.fast-avgift': all(bg(), ...[[10, '1', '+12'], [44, '2', '+40'], [78, '3', '+5']].map(([x, m, extra]) => all(rect(x as number, 18, 32, 76, C.white, 3, C.ink, 1.4), circle((x as number) + 16, 30, 7, C.sky, C.ink, 1), num((x as number) + 16, 34, m as string, 9, C.white), mark((x as number) + 16, 52, 28, 18), num((x as number) + 16, 58, '99', 14, HL), num((x as number) + 16, 78, extra as string, 10, C.grey))), line('M14 104 L106 104', HL, 2.4, '5 3')),

  // ── 3122 Termer och koefficienter (shared layout 4x + 7 − 2y) ──────
  /** term: each of the three parts of 4x + 7 − 2y gets its own highlighted box with a bracket below. */
  'algx.term.2': card4x((e) => all(span(e, T4x, 19, 64, 0, 1), span(e, T4x, 19, 64, 2, 3), span(e, T4x, 19, 64, 4, 6), ...[[0, 1], [2, 3], [4, 6]].map(([i, j]) => line(`M${e.xs[i!]! - 4} 86 L${e.xs[i!]! - 4} 92 L${e.xs[j!]! + 4} 92 L${e.xs[j!]! + 4} 86`, HL, 2))), [], false),
  /** koefficient: only the 4 in front of x is highlighted; an arrow points to it. */
  'algx.koefficient': card4x(() => '', [0], true, arrow(30, 22, 32, 44, HL, 2.6)),
  /** variabelterm: the terms with letters (4x and −2y) are boxed; 7 is grey. */
  'algx.variabelterm': card4x((e) => all(span(e, T4x, 19, 64, 0, 1), span(e, T4x, 19, 64, 4, 6)), [0, 1, 4, 5, 6], true),
  /** konstantterm: only the number term +7 is boxed; the letter terms are grey. */
  'algx.konstantterm': card4x((e) => span(e, T4x, 19, 64, 2, 3), [2, 3], true, ''),
  /** förtecken: only the minus sign in front of 2y is highlighted, big, with an arrow. */
  'algx.förtecken': card4x(() => '', [4], true, arrow(80, 22, 76, 46, HL, 2.6)),
  /** underförstådd: x + 5 where a dashed ghost 1 in front of x is circled. */
  'algx.underförstådd': all(bg(), card(10, 34, 100, 46), circle(34, 56, 12, MARK, HL, 2), num(34, 63, '1', 20, 'rgba(228,87,46,0.55)'), circle(34, 56, 12, 'none', HL, 2.2, ), num(58, 66, 'x', 26), num(80, 66, '+', 22), num(98, 66, '5', 22), num(60, 100, '1x = x', 13, C.grey)),
  /** termer av samma slag: 3x + 4 + 5x + y; the two x-terms are highlighted in the same colour, the rest grey. */
  'algx.termer-av-samma-slag': (() => { const toks: Tok[] = [['3', 0.62], ['x', 0.62], ['+', 0.8], ['4', 0.62], ['+', 0.8], ['5', 0.62], ['x', 0.62], ['+', 0.8], ['y', 0.62]]; const e = expr(60, 64, toks, 17, [0, 1, 5, 6], { dim: true, box: false }); return all(bg(), card(6, 38, 108, 40), span(e, toks, 17, 64, 0, 1), span(e, toks, 17, 64, 5, 6), e.svg, path(`M${e.xs[0]! + 5} 84 C${e.xs[0]! + 5} 100 ${e.xs[6]!} 100 ${e.xs[6]!} 84`, 'none', HL, 2.2), circle(e.xs[0]! + 5, 84, 2, HL, null), circle(e.xs[6]!, 84, 2, HL, null)); })(),
  /** bestå av: a whole burger on the left; an arrow; its separate parts stacked apart on the right. */
  'algx.bestå-av': all(bg(), at(30, 66, 1, path('M-20 -6 C-20 -24 20 -24 20 -6 Z', C.tan, C.ink, 1.4), rect(-21, -6, 42, 5, C.green, 2, C.ink, 1), rect(-20, -1, 40, 7, C.brown, 2, C.ink, 1), rect(-21, 6, 42, 4, C.yellow, 1, C.ink, 1), path('M-20 10 L20 10 L18 18 L-18 18 Z', C.tan, C.ink, 1.4)), arrow(54, 62, 68, 62, HL, 3), at(92, 24, 0.8, path('M-20 -2 C-20 -20 20 -20 20 -2 Z', C.tan, C.ink, 1.4)), at(92, 46, 0.8, rect(-21, -3, 42, 6, C.green, 2, C.ink, 1)), at(92, 62, 0.8, rect(-20, -4, 40, 8, C.brown, 2, C.ink, 1)), at(92, 76, 0.8, rect(-21, -2, 42, 5, C.yellow, 1, C.ink, 1)), at(92, 92, 0.8, path('M-20 -4 L20 -4 L18 4 L-18 4 Z', C.tan, C.ink, 1.4)), rect(70, 8, 44, 98, 'none', 6, HL, 1.8, ), ground),

  // ── 3123 Parenteser och prioriteringsregler ────────────────────────
  /** parentes: 2 · (3 + 4) where only the two brackets are highlighted and drawn large. */
  'algx.parentes': (() => { const toks: Tok[] = [['2', 0.62], ['·', 0.6], ['(', 0.62], ['3', 0.62], ['+', 0.8], ['4', 0.62], [')', 0.62]]; const e = expr(60, 66, toks, 24, [2, 6], { dim: true }); return all(bg(), card(4, 36, 112, 46), e.svg, arrow(e.xs[2]!, 20, e.xs[2]!, 34, HL, 2.4), arrow(e.xs[6]!, 20, e.xs[6]!, 34, HL, 2.4)); })(),
  /** ordningsföljd: three numbered steps 1 → 2 → 3 (sock, shoe, tied lace); the numbers are highlighted. */
  'algx.ordningsföljd': all(bg(), ...[[22, '1'], [60, '2'], [98, '3']].map(([x, n]) => all(circle(x as number, 26, 10, MARK, HL, 2.2), num(x as number, 31, n as string, 13, HL), rect((x as number) - 16, 46, 32, 40, C.white, 4, C.ink, 1.2))), path('M16 58 L24 58 L24 74 L30 78 L30 82 L16 82 Z', C.red, C.ink, 1), path('M50 76 C50 66 60 64 64 70 L72 74 L72 82 L50 82 Z', C.denim, C.ink, 1), line('M50 76 L72 76', C.ink, 0.8), path('M88 76 C88 66 98 64 102 70 L110 74 L110 82 L88 82 Z', C.denim, C.ink, 1), path('M94 70 C90 62 102 62 98 70 M98 70 C106 62 106 74 98 70', 'none', C.white, 1.6), arrow(40, 26, 48, 26, HL, 2.4), arrow(78, 26, 86, 26, HL, 2.4), ground),
  /** prioriteringsregel: a ranked ladder: 1 ( ), 2 x², 3 · ÷, 4 + −. */
  'algx.prioriteringsregel': all(bg(), ...[['( )', 18], ['x²', 40], ['·  ÷', 62], ['+  −', 84]].map(([t, y], i) => all(circle(24, (y as number) + 2, 9, i === 0 ? MARK : C.white, HL, 2), num(24, (y as number) + 7, `${i + 1}`, 12, HL), rect(40, (y as number) - 8, 70 - i * 10, 20, i === 0 ? MARK : C.white, 4, i === 0 ? HL : C.ink, 1.6), num(40 + (70 - i * 10) / 2, (y as number) + 8, t as string, 15, C.ink))), arrow(10, 22, 10, 96, C.grey, 2)),
  /** från vänster till höger: 9 − 4 + 2 with a long highlighted arrow under it pointing right. */
  'algx.från-vänster-till-höger': all(bg(), card(8, 30, 104, 40), num(60, 58, '9  −  4  +  2', 22), arrow(14, 88, 106, 88, HL, 4), circle(14, 88, 4, HL, null), at(12, 104, 0.9, circle(0, -4, 3, C.grey, null)), at(108, 104, 0.9, circle(0, -4, 3, C.grey, null))),
  /** potens: 2³ highlighted as a whole; below, = 2 · 2 · 2 = 8. */
  'algx.potens': all(bg(), mark(60, 38, 54, 50), num(54, 56, '2', 40, HL), sup(76, 56, '3', 40, HL), num(60, 98, '2 · 2 · 2 = 8', 15, C.dark)),
  /** exponent: the same 2³, but only the small 3 is highlighted; the 2 is grey and three 2s are counted below. */
  'algx.exponent': all(bg(), num(54, 56, '2', 40, C.grey), mark(78, 30, 22, 26), sup(78, 56, '3', 40, HL), arrow(88, 26, 102, 14, HL, 2), num(30, 98, '2', 16, C.grey), num(60, 98, '2', 16, C.grey), num(90, 98, '2', 16, C.grey), ...[30, 60, 90].map((x, i) => all(circle(x, 76, 6, MARK, HL, 1.6), num(x, 80, `${i + 1}`, 9, HL)))),
  /** i kvadrat: a square of 3 × 3 small squares with side 3 marked on two sides, and 3² = 9 beside it. */
  'algx.i-kvadrat': all(bg(), ...range(3).flatMap((r) => range(3).map((c) => rect(16 + c * 18, 26 + r * 18, 18, 18, MARK, 0, HL, 1.4))), rect(16, 26, 54, 54, 'none', 0, HL, 2.6), num(43, 96, '3', 13), num(8, 57, '3', 13), num(92, 50, '3', 22, HL), sup(103, 50, '2', 22, HL), num(94, 76, '= 9', 15)),
  /** uträkning: a sheet with four lines of working, one under the other, ending in a ticked answer; a pencil. */
  'algx.uträkning': all(bg('#eef2f6'), rect(18, 8, 78, 100, C.white, 2, C.ink, 1.4), ...['4 + 2 · 3', '= 4 + 6', '= 10'].map((t, i) => num(52, 30 + i * 22, t, 13, HL)), line('M28 82 L76 82', C.ink, 1.4), line('M28 84 L76 84', C.ink, 1.4), check(84, 74), line('M24 40 L24 72', HL, 1.6, '2 3'), pencil(104, 92, -25)),

  // ── 3124 Förenkla uttryck ───────────────────────────────────────────
  /** förenkla: a long grey card x + x + x + 2 + 3 → arrow → a short highlighted card 3x + 5. */
  'algx.förenkla.2': all(bg(), card(6, 14, 108, 30), num(60, 35, 'x + x + x + 2 + 3', 14, C.grey), arrow(60, 48, 60, 64, HL, 3), rect(30, 68, 60, 32, MARK, 5, HL, 2.4), num(60, 91, '3x + 5', 18, HL)),
  /** krånglig: a tangled, knotted line (highlighted) next to a short straight grey line. */
  'algx.krånglig': all(bg(), path('M14 60 C20 20 50 20 44 50 C38 80 70 90 76 60 C82 30 40 30 52 64 C60 90 96 86 92 56 C88 30 66 44 74 58 C80 70 100 70 106 50', 'none', HL, 3), path('M30 40 C60 10 90 40 60 70 C40 90 20 70 40 52', 'none', HL, 2.4), greyed(line('M20 100 L100 100', C.dark, 3))),
  /** skriva om: an old crossed-out scribble line (grey) and, below, the same line rewritten neatly by a pencil. */
  'algx.skriva-om': all(bg('#eef2f6'), rect(14, 12, 84, 92, C.white, 2, C.ink, 1.4), greyed(path('M22 34 C30 26 36 42 44 30 C50 22 58 40 66 30 C72 22 80 38 88 30', 'none', C.dark, 2.4)), line('M20 32 L92 32', C.red, 2), arrow(56, 44, 56, 56, HL, 2.6), line('M24 66 L84 66 M24 80 L72 80', HL, 3), path('M100 40 C112 52 112 72 100 84', 'none', HL, 2), arrow(104, 78, 100, 84, HL, 2), pencil(86, 84, -30)),
  /** slå ihop: two small heaps of blocks (3 and 2) with arrows going together into one heap of 5. */
  'algx.slå-ihop': all(bg(), ...range(3).map((i) => rect(12 + i * 9, 30, 8, 8, C.sky, 1, C.ink, 1)), ...range(2).map((i) => rect(86 + i * 9, 30, 8, 8, C.sky, 1, C.ink, 1)), arrow(30, 44, 52, 70, HL, 3), arrow(92, 44, 70, 70, HL, 3), ...range(5).map((i) => rect(38 + i * 9, 84, 8, 8, C.sky, 1, C.ink, 1)), rect(34, 78, 52, 20, 'none', 4, HL, 2.2), ground),
  /** multiplicera in: 3(x + 2) with two arcs from the 3 to the x and to the 2 inside the bracket; below, 3x + 6. */
  'algx.multiplicera-in': (() => { const toks: Tok[] = [['3', 0.66], ['(', 0.46], ['x', 0.66], ['+', 0.8], ['2', 0.66], [')', 0.46]]; const e = expr(60, 64, toks, 24, [0], { dim: false }); const x0 = e.xs[0]!, a = e.xs[2]!, b = e.xs[4]!; return all(bg(), card(10, 38, 100, 38), e.svg, path(`M${x0} 42 C${x0} 18 ${a} 18 ${a} 40`, 'none', HL, 2.4), path(`M${a - 4} 34 L${a} 41 L${a + 4} 34`, 'none', HL, 2.4), path(`M${x0} 42 C${x0} 8 ${b} 8 ${b} 40`, 'none', HL, 2.4), path(`M${b - 4} 34 L${b} 41 L${b + 4} 34`, 'none', HL, 2.4), num(60, 100, '3x + 6', 16, C.dark)); })(),
  /** byta tecken: a big + and a big − with two curved arrows swapping them; small grey −(x − 2) = −x + 2 below. */
  'algx.byta-tecken': all(bg(), circle(32, 46, 18, MARK, HL, 2.2), num(32, 58, '+', 34, HL), circle(88, 46, 18, MARK, HL, 2.2), num(88, 58, '−', 34, HL), path('M48 32 C56 20 64 20 72 32', 'none', HL, 2.4), path('M66 30 L72 33 L72 26', 'none', HL, 2.4), path('M72 62 C64 74 56 74 48 62', 'none', HL, 2.4), path('M54 64 L48 61 L48 68', 'none', HL, 2.4), num(60, 98, '−(x − 2) = −x + 2', 11, C.grey)),
  /** ta ut varandra: tiles 3x and −3x push against each other with equal arrows; = 0 highlighted. */
  'algx.ta-ut-varandra': all(bg(), rect(10, 30, 36, 28, C.white, 4, C.ink, 1.6), num(28, 50, '3x', 16), rect(74, 30, 36, 28, C.white, 4, C.ink, 1.6), num(92, 50, '−3x', 16), arrow(46, 44, 58, 44, BLUE, 3), arrow(74, 44, 62, 44, BLUE, 3), mark(60, 86, 46, 26), num(60, 94, '= 0', 20, HL)),
  /** bryta ut: 6x + 9 with arrows pulling a 3 out of both terms to the front: 3(2x + 3). Arrows go outwards. */
  'algx.bryta-ut': all(bg(), card(10, 12, 100, 32), num(64, 35, '6x + 9', 20, C.grey), mark(24, 82, 22, 26), num(24, 90, '3', 22, HL), num(72, 90, '(2x + 3)', 18), path('M58 44 C56 60 40 64 30 70', 'none', HL, 2.2), arrow(34, 68, 30, 70, HL, 2.2), path('M86 44 C82 64 50 66 34 72', 'none', HL, 2.2)),
  /** gemensam faktor: 6x + 9 with 3 · 2x and 3 · 3 written under the terms; both 3s are highlighted. */
  'algx.gemensam-faktor': all(bg(), card(10, 12, 100, 32), num(60, 35, '6x  +  9', 20), line('M40 46 L34 58 M80 46 L84 58', C.grey, 1.4), mark(24, 72, 16, 20), num(24, 79, '3', 16, HL), num(42, 79, '· 2x', 14), mark(76, 72, 16, 20), num(76, 79, '3', 16, HL), num(92, 79, '· 3', 14), path('M24 84 C24 102 76 102 76 84', 'none', HL, 2)),

  // ── 3125 Lösa enkla ekvationer ──────────────────────────────────────
  /** likhetstecken: a pencil drawing a big highlighted = on a sheet between grey 4 + 3 and 7. */
  'algx.likhetstecken': all(bg('#eef2f6'), sheet(10, 14, 100, 84), num(30, 66, '4+3', 16, C.grey), mark(66, 58, 30, 24), num(66, 70, '=', 30, HL), num(96, 66, '7', 18, C.grey), pencil(84, 82, -35)),
  /** ekvation: a balance in equilibrium: x + 3 on the left pan, 7 on the right; the whole is framed. */
  'algx.ekvation': all(bg(), balance(60, 0, num(0, -2, 'x+3', 12, HL), num(0, -2, '7', 13, HL)), rect(10, 14, 100, 26, MARK, 5, HL, 2), num(60, 33, 'x + 3 = 7', 15, HL)),
  /** vänsterled: 2x + 1 = 9 with everything left of = boxed and highlighted; an arrow points left. */
  'algx.vänsterled': sides(true),
  /** högerled: the same card with everything right of = boxed and highlighted; an arrow points right. */
  'algx.högerled': sides(false),
  /** lösa: a person with a thought bubble x + 3 = 7 → x = 4 and a lit bulb; a tick. */
  'algx.lösa': all(bg('#eef4f0'), P({ x: 32, h: 0.9, top: C.sky, mood: 'smile' }), thought(78, 26, 66, num(78, 30, 'x+3=7', 11, C.dark)), rect(56, 50, 48, 22, MARK, 4, HL, 2), num(80, 66, 'x = 4', 14, HL), check(98, 88, 1.2), ground),
  /** lösning: a grey equation x + 3 = 7 and, under it, the answer x = 4 boxed and double underlined. */
  'algx.lösning.2': all(bg(), card(14, 14, 92, 30), num(60, 35, 'x + 3 = 7', 16, C.grey), line('M60 48 L60 56', C.grey, 1.6), rect(26, 60, 68, 32, MARK, 5, HL, 2.6), num(60, 83, 'x = 4', 20, HL), line('M34 98 L86 98 M34 102 L86 102', HL, 2)),
  /** obekant: x + 3 = 7 where x is a highlighted box with a question mark. */
  'algx.obekant': all(bg(), card(8, 34, 104, 46), rect(14, 40, 28, 34, MARK, 4, HL, 2.6), num(28, 66, '?', 24, HL), num(76, 66, '+ 3 = 7', 20, C.grey), num(28, 100, 'x', 18, HL), line('M28 78 L28 86', HL, 1.6, '2 2')),
  /** isolera: x = 4 where x stands alone inside a highlighted ring; the +3 is pushed away out of the ring. */
  'algx.isolera.2': all(bg(), ellipse(34, 56, 22, 26, MARK, HL, 2.6), num(34, 66, 'x', 30, HL), num(70, 64, '=', 24, C.dark), num(96, 64, '4', 24, C.dark), greyed(num(96, 104, '+3', 14)), arrow(56, 74, 84, 96, C.grey, 2)),
  /** i båda leden: x + 3 = 7 with −3 written under both sides, each highlighted, and two arrows. */
  'algx.i-båda-leden': all(bg(), card(8, 18, 104, 34), num(34, 42, 'x + 3', 18), num(64, 42, '=', 18), num(90, 42, '7', 18), line('M64 56 L64 104', C.grey, 1.4, '3 3'), arrow(34, 56, 34, 70, HL, 2.4), arrow(90, 56, 90, 70, HL, 2.4), mark(34, 84, 34, 24), num(34, 92, '− 3', 18, HL), mark(90, 84, 34, 24), num(90, 92, '− 3', 18, HL)),
  /** flytta över: x + 3 = 7: an arc carries the +3 over the = sign, where it lands as −3. */
  'algx.flytta-över': all(bg(), card(6, 54, 108, 32), num(18, 78, 'x', 20), rect(30, 60, 26, 22, 'none', 3, C.grey, 1.4), num(43, 77, '+3', 15, C.grey), num(66, 78, '=', 20), num(82, 78, '7', 20), mark(101, 71, 22, 20), num(101, 77, '−3', 14, HL), path('M43 56 C50 18 94 18 100 54', 'none', HL, 2.6), arrow(99, 46, 100, 55, HL, 2.6)),

  // ── 3126 Olikheter ──────────────────────────────────────────────────
  /** olikhet: the card x > 3 highlighted, and a number line with an open ring at 3 and a ray to the right. */
  'algx.olikhet': (() => { const L = nline(94, 0, 6); return all(bg(), rect(28, 12, 64, 34, MARK, 5, HL, 2.4), num(60, 38, 'x > 3', 20, HL), L.svg, ray(L, 94, 3, 1, false, 108)); })(),
  /** olikhetstecken: the two signs < and > big and highlighted, with small grey numbers 2 … 5 and 9 … 4. */
  'algx.olikhetstecken': all(bg(), card(14, 14, 92, 40), num(36, 44, '2', 22, C.grey), mark(60, 36, 28, 30), num(60, 46, '<', 30, HL), num(84, 44, '5', 22, C.grey), card(14, 64, 92, 40), num(36, 94, '9', 22, C.grey), mark(60, 86, 28, 30), num(60, 96, '>', 30, HL), num(84, 94, '4', 22, C.grey)),
  /** större än eller lika med: big ≥; number line with a filled dot at 3 and a ray to the right. */
  'algx.större-än-eller-lika-med': (() => { const L = nline(96, 0, 6); return all(bg(), mark(60, 32, 40, 40), num(60, 46, '≥', 36, HL), L.svg, ray(L, 96, 3, 1, true, 108)); })(),
  /** mindre än eller lika med: big ≤; the same number line with a filled dot at 3 and a ray to the left. */
  'algx.mindre-än-eller-lika-med': (() => { const L = nline(96, 0, 6); return all(bg(), mark(60, 32, 40, 40), num(60, 46, '≤', 36, HL), L.svg, ray(L, 96, 3, -1, true, 12)); })(),
  /** minst: a height post at a ride with a line at 120; a tall child reaches over it (tick), a small grey child does not. */
  'algx.minst': all(bg('#eef4f8'), rect(54, 20, 12, 92, C.yellow, 2, C.ink, 1.4), line('M48 44 L72 44', HL, 3.4), num(60, 38, '120', 9), arrow(60, 52, 60, 46, HL, 2), P({ x: 88, h: 1.02, top: C.orange }), check(104, 28, 1), greyed(P({ x: 28, h: 0.7, top: C.sky })), cross(28, 46, 0.9), ground),
  /** högst: a lift sign with eight figures inside a frame and the number 8; a ninth figure outside is crossed out. */
  'algx.högst': all(bg(), rect(10, 14, 76, 92, C.white, 4, C.ink, 1.6), mark(48, 28, 30, 20), num(48, 35, '8', 18, HL), ...range(8).map((i) => icon(22 + (i % 4) * 17, 66 + Math.floor(i / 4) * 26, C.dark, 1)), greyed(icon(102, 80, C.dark, 1.2)), cross(102, 80, 1.3)),

  // ── 3127 Formler i vardagen ─────────────────────────────────────────
  /** formel: a card s = v · t; small symbols above the letters: a road (s), a speedometer (v), a clock (t). */
  'algx.formel': all(bg(), rect(10, 56, 100, 40, MARK, 6, HL, 2.4), num(60, 84, 's = v · t', 22, HL), line('M18 38 L42 38', C.dark, 4), line('M20 38 L40 38', C.white, 1, '3 3'), path('M60 42 A12 12 0 0 1 84 42', 'none', C.ink, 1.6), line('M72 42 L78 33', C.red, 1.6), circle(98, 34, 9, C.white, C.ink, 1.4), line('M98 34 L98 28 M98 34 L102 36', C.ink, 1.2)),
  /** medelhastighet: a speedometer whose grey needle traces swing, with one highlighted needle in the middle at the average. */
  'algx.medelhastighet': all(bg(), path('M18 80 A42 42 0 0 1 102 80', 'none', C.ink, 3), ...range(9).map((i) => { const a = Math.PI + (i * Math.PI) / 8; return line(`M${f1(60 + Math.cos(a) * 36)} ${f1(80 + Math.sin(a) * 36)} L${f1(60 + Math.cos(a) * 42)} ${f1(80 + Math.sin(a) * 42)}`, C.ink, 1.4); }), ...[-60, -30, 30, 50].map((d) => g(`rotate(${d} 60 80)`, line('M60 80 L60 46', C.grey2, 2))), line('M60 80 L60 42', HL, 3.6), circle(60, 80, 4, C.dark, null), num(60, 100, 'Ø 90', 14, HL), line('M14 108 L106 108', C.dark, 3)),
  /** storhet: three things being measured, each highlighted: a ruler (length), a stopwatch (time), a thermometer (temperature). */
  'algx.storhet': all(bg(), rect(10, 30, 30, 70, MARK, 4, HL, 1.8), rect(19, 36, 12, 58, C.yellow, 1, C.ink, 1.2), ...range(6).map((i) => line(`M19 ${40 + i * 9} L25 ${40 + i * 9}`, C.ink, 1)), rect(45, 30, 30, 70, MARK, 4, HL, 1.8), circle(60, 66, 12, C.white, C.ink, 1.6), rect(57, 48, 6, 5, C.dark, 1, null), line('M60 66 L60 58 M60 66 L66 69', C.ink, 1.4), rect(80, 30, 30, 70, MARK, 4, HL, 1.8), rect(92, 38, 6, 46, C.white, 3, C.ink, 1.2), rect(93.5, 60, 3, 24, C.red, 1, null), circle(95, 88, 6, C.red, C.ink, 1.2), num(25, 22, '?', 12, HL), num(60, 22, '?', 12, HL), num(95, 22, '?', 12, HL)),
  /** lösa ut: s = v · t (grey) → t = s / v, where the t is now alone on the left and highlighted. */
  'algx.lösa-ut': all(bg(), card(14, 12, 92, 32), num(60, 35, 's = v · t', 18, C.grey), arrow(60, 48, 60, 62, HL, 3), card(14, 66, 92, 36), mark(32, 82, 22, 28), num(32, 92, 't', 22, HL), num(72, 92, '=  s / v', 18)),
};
