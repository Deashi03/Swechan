/**
 * Matematik & naturvetenskap → Matematikens grunder → Tal & räkning, 3101–3107 (0.48): whole and natural
 * numbers, place value, positive and negative numbers, odd and even numbers, comparing and ordering
 * numbers, the four operations and checking whether an answer is reasonable. Digits and the signs
 * + − × ÷ = < > ≈ may appear; no picture contains a word or a letter that names its word. Pairs of
 * close words (ental/tiotal/hundratal/tusental, faktor/produkt, udda/jämn, överstiga/understiga …)
 * share one layout where only the highlighted part differs.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, star, type Svg } from './kit';
import { HL, T, arm, bubble, thought } from './people';
import { P, greyed } from './blindFix';

// ── Palette and small helpers ────────────────────────────────────────
const PAPER = '#fbf6e6';
const SOFT = '#f4f6f8';
const WARM = '#e0603a';
const COLD = '#3c7fb0';
const OK = '#3f9a5a';
const MARK = '#fff3b0';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ground = line('M4 112 L116 112', C.grey2, 2);
const bg = (col: string = SOFT) => rect(4, 4, 112, 108, col, 3, null);
const num = (x: number, y: number, s: string, size = 12, col: string = C.ink) => T(x, y, s, size, col);
/** Head and shoulder positions of a standing figure at x with height factor h. */
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, hy: ty - 56 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const hnd = (x: number, y: number, r = 3) => circle(x, y, r, C.skin, C.ink, 1.2);
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), hnd(tx, ty, 3 * Math.max(0.7, h))); };
const check = (x: number, y: number, s = 1, col: string = OK) => line(`M${x - 6 * s} ${y} L${x - 2 * s} ${y + 5 * s} L${x + 7 * s} ${y - 6 * s}`, col, 3 * s);
const cross = (x: number, y: number, s = 1, col: string = C.red) => line(`M${x - 5 * s} ${y - 5 * s} L${x + 5 * s} ${y + 5 * s} M${x + 5 * s} ${y - 5 * s} L${x - 5 * s} ${y + 5 * s}`, col, 3 * s);
/** A ring that marks the important part. */
const ring = (x: number, y: number, r: number) => circle(x, y, r, 'none', HL, 2.6);
/** A highlighted box behind a digit or sign. */
const mark = (x: number, y: number, w: number, h: number) => rect(x - w / 2, y - h / 2, w, h, MARK, 3, HL, 2.2);
/** Write a row of tokens centred at x; `hl` lists the token indices to highlight, the others turn grey when `dim`. */
const row = (x: number, y: number, toks: string[], size: number, hl: number[] = [], o: { dim?: boolean; gap?: number; col?: string } = {}) => {
  const gap = o.gap ?? size * 0.95, x0 = x - ((toks.length - 1) * gap) / 2, out: Svg[] = [];
  toks.forEach((t, i) => {
    const cx = f1(x0 + i * gap), on = hl.includes(i);
    if (on) out.push(mark(cx, y - size * 0.34, Math.max(size * 0.95, t.length * size * 0.62), size * 1.15));
    out.push(num(cx, y, t, size, on ? HL : o.dim && hl.length ? C.grey : (o.col ?? C.ink)));
  });
  return all(...out);
};
const dot = (x: number, y: number, r = 3.4, col: string = C.sky) => circle(x, y, r, col, C.ink, 1);
/** A horizontal number line from a to b between x0 and x1 at height y. */
const nline = (y: number, a: number, b: number, x0 = 12, x1 = 108, o: { col?: (n: number) => string; label?: (n: number) => boolean; arrows?: boolean; size?: number; sw?: number } = {}) => {
  const step = (x1 - x0) / (b - a), X = (n: number) => f1(x0 + (n - a) * step), out: Svg[] = [];
  out.push(line(`M${x0 - 6} ${y} L${x1 + 6} ${y}`, C.ink, o.sw ?? 1.8));
  if (o.arrows !== false) out.push(path(`M${x1 + 9} ${y} L${x1 + 3} ${y - 3.4} L${x1 + 3} ${y + 3.4} Z`, C.ink, null), path(`M${x0 - 9} ${y} L${x0 - 3} ${y - 3.4} L${x0 - 3} ${y + 3.4} Z`, C.ink, null));
  for (let n = a; n <= b; n++) {
    const c = o.col ? o.col(n) : C.ink;
    out.push(line(`M${X(n)} ${y - 4} L${X(n)} ${y + 4}`, c, 1.6));
    if (!o.label || o.label(n)) out.push(num(X(n), y + 15, n < 0 ? `−${-n}` : `${n}`, o.size ?? 9, c));
  }
  return { svg: all(...out), X };
};
/** Base-ten blocks: unit cube, ten-rod, hundred-flat and thousand-cube. */
const unit = (x: number, y: number, s = 6, col: string = C.yellow) => all(rect(x, y, s, s, col, 0.6, C.ink, 0.8));
const rod = (x: number, y: number, s = 4, col: string = C.green) => all(rect(x, y, s, s * 10, col, 0.6, C.ink, 0.9), ...range(9).map((i) => line(`M${x} ${f1(y + (i + 1) * s)} L${x + s} ${f1(y + (i + 1) * s)}`, C.ink, 0.4)));
const flat = (x: number, y: number, s = 2.6, col: string = COLD) => all(rect(x, y, s * 10, s * 10, col, 0.6, C.ink, 1), ...range(9).map((i) => line(`M${f1(x + (i + 1) * s)} ${y} L${f1(x + (i + 1) * s)} ${f1(y + 10 * s)} M${x} ${f1(y + (i + 1) * s)} L${f1(x + 10 * s)} ${f1(y + (i + 1) * s)}`, 'rgba(255,255,255,0.55)', 0.4)));
const cube = (x: number, y: number, s = 22, col: string = C.purple) => { const d = s * 0.35; return all(path(`M${x} ${y + d} L${x + d} ${y} L${x + s + d} ${y} L${x + s} ${y + d} Z`, '#b9a3e0', C.ink, 1), path(`M${x + s} ${y + d} L${x + s + d} ${y} L${x + s + d} ${y + s} L${x + s} ${y + s + d} Z`, '#6d52a3', C.ink, 1), rect(x, y + d, s, s, col, 0, C.ink, 1), line(`M${x + s / 2} ${y + d} L${x + s / 2} ${y + s + d} M${x} ${y + d + s / 2} L${x + s} ${y + d + s / 2}`, 'rgba(255,255,255,0.5)', 0.6)); };
/** "4 352" with one position highlighted and the matching blocks drawn below. */
const place = (pos: 0 | 1 | 2 | 3) => {
  const digits = ['4', '3', '5', '2'], xs = [27, 49, 71, 93];
  const out: Svg[] = [bg(), rect(10, 10, 100, 36, C.white, 4, C.ink, 1.4)];
  digits.forEach((d, i) => { if (i === pos) out.push(mark(xs[i]!, 28, 18, 26)); out.push(num(xs[i]!, 37, d, 24, i === pos ? HL : C.grey)); });
  out.push(arrow(xs[pos]!, 48, 60, 58, HL, 2.4));
  const blocks: Svg[] = [];
  if (pos === 3) blocks.push(unit(48, 84, 10), unit(62, 84, 10));
  if (pos === 2) range(5).forEach((i) => blocks.push(rod(36 + i * 10, 62, 4.4)));
  if (pos === 1) range(3).forEach((i) => blocks.push(flat(16 + i * 31, 72, 2.7)));
  if (pos === 0) range(4).forEach((i) => blocks.push(cube(8 + i * 27, 74, 18)));
  return all(...out, ...blocks);
};
/** A stack of n blocks with its number below. */
const stack = (x: number, n: number, col: string, base = 98, s = 7) => all(...range(n).map((i) => rect(x - s / 2, base - (i + 1) * s, s, s, col, 1, C.ink, 0.9)), num(x, base + 11, `${n}`, 11));
/** Pairs of dots: n dots arranged two by two; a lone last dot is highlighted. */
const pairs = (n: number, x0: number, y: number, col: string) => {
  const out: Svg[] = [];
  for (let i = 0; i < n; i += 2) {
    const x = x0 + (i / 2) * 18;
    if (i + 1 < n) out.push(rect(x - 6, y - 14, 12, 26, 'none', 4, C.grey, 1.2), dot(x, y - 7, 3.8, col), dot(x, y + 5, 3.8, col));
    else out.push(dot(x, y - 7, 4.4, HL), ring(x, y - 7, 8));
  }
  return all(...out);
};
const bun = (x: number, y: number) => all(ellipse(x, y, 6, 4.4, '#d9a05b', C.ink, 1), path(`M${x - 3} ${y - 2} q3 -2 6 0`, 'none', '#f6e2b8', 1));
const plate = (x: number, y: number) => ellipse(x, y, 13, 4, C.white, C.ink, 1.2);
const apple = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, path('M0 -5 C-7 -9 -10 0 -6 5 C-4 8 -1 7 0 6 C1 7 4 8 6 5 C10 0 7 -9 0 -5 Z', col, C.ink, 1), line('M0 -5 L1 -9', C.brown, 1.2), path('M1 -8 C4 -10 6 -8 6 -7 C4 -6 2 -7 1 -8 Z', C.green, null));
/** An equation strip "a op b = c" with highlighted token indices. */
const eq = (y: number, toks: string[], hl: number[], size = 18) => row(60, y, toks, size, hl, { dim: true, gap: size * 1.05 });
const dotArray = (x0: number, y0: number, cols: number, rows: number, gap = 8, col: string = C.sky) => all(...range(rows).flatMap((r) => range(cols).map((c) => dot(x0 + c * gap, y0 + r * gap, 2.8, col))));
const groups = (cx: number[], cy: number, per: number, col: string = C.sky) => all(...cx.map((x) => all(circle(x, cy, 12, 'none', C.grey, 1.2), ...range(per).map((i) => { const a = (i / per) * Math.PI * 2; return dot(f1(x + Math.cos(a) * 6), f1(cy + Math.sin(a) * 6), 2.6, col); }))));
const sheet = (x: number, y: number, w: number, h: number) => rect(x, y, w, h, PAPER, 2, C.ink, 1.4);
const pencil = (x: number, y: number, rot = -35) => g(`translate(${x} ${y}) rotate(${rot})`, rect(-2.5, -20, 5, 18, C.yellow, 0.5, C.ink, 1), path('M-2.5 -2 L2.5 -2 L0 4 Z', C.tan, C.ink, 0.8), rect(-2.5, -23, 5, 3, C.pink, 0.5, C.ink, 0.8));
const scribble = (x: number, y: number, w: number) => line(`M${x} ${y} q3 -2 6 0 t6 0 t6 0 t6 0`.slice(0, 0) + `M${x} ${y} L${x + w} ${y}`, C.grey, 2);
const calc = (x: number, y: number, s = 1, shown = '114') => at(x, y, s, rect(-16, -24, 32, 48, C.dark, 4, C.ink, 1.4), rect(-12, -20, 24, 11, '#cfe8c4', 1.5, C.ink, 0.8), T(0, -11.6, shown, 7, C.ink), ...range(4).flatMap((r) => range(3).map((c) => rect(-11 + c * 8, -5 + r * 7, 6, 5, r === 3 && c === 2 ? C.orange : C.grey2, 1, null))));
const bus = (x: number, y: number, len = 40) => all(rect(x, y - 16, len, 14, C.yellow, 3, C.ink, 1.2), ...range(Math.floor((len - 8) / 8)).map((i) => rect(x + 4 + i * 8, y - 13, 6, 5, '#cfe8f8', 1, C.ink, 0.6)), circle(x + 8, y - 2, 3, C.dark, C.ink, 0.8), circle(x + len - 8, y - 2, 3, C.dark, C.ink, 0.8));
const bars = (xs: number[], hs: number[], cols: string[], base = 96, w = 12) => all(...xs.map((x, i) => rect(x - w / 2, base - hs[i]!, w, hs[i]!, cols[i]!, 1.5, C.ink, 1.1)));
const balance = (cx: number, tilt: number, left: Svg, right: Svg) => all(path(`M${cx - 12} 108 L${cx + 12} 108 L${cx} 96 Z`, C.grey, C.ink, 1.2), line(`M${cx} 96 L${cx} 54`, C.ink, 2.4), g(`rotate(${tilt} ${cx} 54)`, line(`M${cx - 40} 54 L${cx + 40} 54`, C.ink, 2.4), line(`M${cx - 40} 54 L${cx - 48} 72 M${cx - 40} 54 L${cx - 32} 72 M${cx + 40} 54 L${cx + 32} 72 M${cx + 40} 54 L${cx + 48} 72`, C.grey, 1), path(`M${cx - 52} 72 L${cx - 28} 72 C${cx - 30} 80 ${cx - 50} 80 ${cx - 52} 72 Z`, C.silver, C.ink, 1.2), path(`M${cx + 28} 72 L${cx + 52} 72 C${cx + 50} 80 ${cx + 30} 80 ${cx + 28} 72 Z`, C.silver, C.ink, 1.2), g(`translate(${cx - 40} 70) rotate(${-tilt})`, left), g(`translate(${cx + 40} 70) rotate(${-tilt})`, right)));
/** Staircase of numbers going up (dir 1) or down (dir −1) left to right. */
const stairs = (vals: number[], dir: 1 | -1) => {
  const out: Svg[] = [bg()];
  vals.forEach((v, i) => { const x = 22 + i * 38, h = 22 + (dir > 0 ? i : vals.length - 1 - i) * 26; out.push(rect(x - 14, 104 - h, 28, h, i === (dir > 0 ? vals.length - 1 : 0) ? '#f6c39a' : '#fde7c4', 2, C.ink, 1.2), num(x, 104 - h + 18, `${v}`, 16)); });
  out.push(dir > 0 ? arrow(14, 72, 100, 14, HL, 3.6) : arrow(20, 14, 106, 72, HL, 3.6));
  return all(...out, ground);
};
/** Limit line at y 50 and a bar that ends above (over) or below (under) it. */
const limit = (over: boolean) => all(bg(), line('M10 50 L110 50', C.dark, 2, '6 4'), num(18, 44, '500', 9, C.dark),
  bars([46], [30], [C.grey2], 104, 18), num(46, 111, '', 1),
  over ? all(rect(65, 30, 22, 74, C.orange, 1.5, C.ink, 1.2), rect(65, 30, 22, 20, '#d64545', 1.5, C.ink, 1.2), arrow(98, 50, 98, 26, HL, 3.2), ring(76, 38, 16))
    : all(rect(65, 70, 22, 34, COLD, 1.5, C.ink, 1.2), arrow(98, 52, 98, 70, HL, 3.2), line('M66 52 L86 52 M66 68 L86 68', HL, 1.4, '2 2')), ground);
const chair = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, line('M-8 0 L-8 -24 M-8 -10 L8 -10 L8 0', C.brown, 3), line('M-8 -10 L-8 0', C.brown, 3));

export const NUMBER_MOTIFS: Record<string, Svg> = {
  // ── 3101 Heltal och naturliga tal ────────────────────────────────
  /** heltal: a number line −3…3; every whole number has a coloured dot, the grey halves between have none. */
  'tal.heltal': (() => { const L = nline(70, -3, 3, 16, 104, { size: 10 }); return all(bg(), L.svg, ...range(7).map((i) => dot(L.X(i - 3), 70, 4.6, C.orange)), ...range(6).map((i) => all(line(`M${f1(L.X(i - 3) + 7.3)} 66 L${f1(L.X(i - 3) + 7.3)} 74`, C.grey2, 1), num(f1(L.X(i - 3) + 7.3), 58, '½', 7, C.grey))), rect(8, 54, 104, 40, 'none', 6, HL, 1.6), num(60, 30, '… −2, −1, 0, 1, 2 …', 12, HL)); })(),
  /** naturligt tal: the same number line; only 0, 1, 2, 3, 4 … are coloured, continuing right; the negatives are grey. */
  'tal.naturligt-tal': (() => { const L = nline(70, -3, 4, 14, 102, { size: 10, col: (n) => (n < 0 ? C.grey2 : C.ink) }); return all(bg(), L.svg, ...range(5).map((i) => dot(L.X(i), 70, 4.6, C.green)), ...range(3).map((i) => dot(L.X(i - 3), 70, 3.4, C.grey2)), rect(f1(L.X(0) - 7), 54, f1(L.X(4) - L.X(0) + 16), 40, 'none', 6, HL, 1.8), arrow(84, 44, 108, 44, C.green, 3), num(52, 32, '0, 1, 2, 3 …', 14, C.green)); })(),
  /** grundtal: three apples counted 1, 2, 3 and a big coloured 3 ("how many"); a grey podium with the place 3 as reference. */
  'tal.grundtal': all(bg(), apple(22, 40, 1.6), apple(46, 40, 1.6), apple(70, 40, 1.6), num(22, 62, '1', 10, C.grey), num(46, 62, '2', 10, C.grey), num(70, 62, '3', 10, C.grey), line('M14 70 L80 70', HL, 1.6), arrow(46, 74, 46, 84, HL, 2.4), mark(46, 96, 26, 22), num(46, 104, '3', 22, HL),
    greyed(rect(88, 74, 12, 30, C.silver, 0, C.ink, 1), rect(100, 64, 12, 40, C.gold, 0, C.ink, 1), rect(76, 82, 12, 22, C.tan, 0, C.ink, 1), num(82, 98, '3.', 8)), ground),
  /** ental: "4 352" with the last digit marked; two unit cubes below. */
  'tal.ental': place(3),
  /** tiotal: "4 352" with the 5 marked; five ten-rods below. */
  'tal.tiotal.2': place(2),
  /** hundratal: "4 352" with the 3 marked; three hundred-flats below. */
  'tal.hundratal.2': place(1),
  /** tusental: "4 352" with the 4 marked; four thousand-cubes below. */
  'tal.tusental.2': place(0),
  /** positionssystem: "555"; arrows show that the same digit is worth 500, 50 and 5 depending on its place. */
  'tal.positionssystem': all(bg(), rect(18, 10, 84, 34, C.white, 4, C.ink, 1.4), num(36, 38, '5', 26, C.red), num(60, 38, '5', 26, C.green), num(84, 38, '5', 26, COLD),
    arrow(36, 46, 22, 70, C.red, 2.2), arrow(60, 46, 60, 70, C.green, 2.2), arrow(84, 46, 98, 70, COLD, 2.2), num(22, 86, '500', 13, C.red), num(60, 86, '50', 13, C.green), num(98, 86, '5', 13, COLD),
    line('M10 96 L110 96', C.grey2, 1), rect(8, 72, 34, 22, 'none', 4, C.red, 1), rect(46, 72, 28, 22, 'none', 4, C.green, 1), rect(86, 72, 24, 22, 'none', 4, COLD, 1)),
  /** ensiffrig: one big single digit 7 in a box; grey longer numbers as reference. */
  'tal.ensiffrig': all(bg(), mark(60, 50, 50, 60), num(60, 72, '7', 56, HL), greyed(num(22, 104, '47', 12), num(98, 104, '352', 12), num(20, 22, '18', 10), num(100, 22, '2 026', 9)), circle(60, 50, 38, 'none', HL, 1.4)),
  /** talföljd: 2, 4, 6, 8 with +2 hops between and an empty box with a question mark for the next number. */
  'tal.talföljd': all(bg(), ...[2, 4, 6, 8].map((n, i) => all(circle(16 + i * 22, 70, 9, C.white, C.ink, 1.4), num(16 + i * 22, 75, `${n}`, 13))), rect(96, 60, 18, 20, MARK, 3, HL, 2), num(105, 75, '?', 14, HL),
    ...range(4).map((i) => all(path(`M${18 + i * 22} 58 Q${27 + i * 22} 40 ${36 + i * 22} 58`, 'none', HL, 1.8), path(`M${36 + i * 22} 58 l-4 -3 l1 5 Z`, HL, null), num(27 + i * 22, 42, '+2', 8, HL))), line('M10 90 L110 90', C.grey2, 1)),
  /** romersk siffra: a church-tower clock face with Roman numerals XII, III, VI and IX. */
  'tal.romersk-siffra': all(rect(4, 4, 112, 108, '#d6ecf8', 3, null), path('M30 112 L30 30 L60 8 L90 30 L90 112 Z', '#d8c7a8', C.ink, 1.6), circle(60, 58, 25, C.white, C.ink, 2), num(60, 43, 'XII', 9), num(79, 61, 'III', 8), num(60, 80, 'VI', 9), num(41, 61, 'IX', 8),
    ...range(12).map((i) => { const a = (i / 12) * Math.PI * 2; return circle(f1(60 + Math.sin(a) * 21.5), f1(58 - Math.cos(a) * 21.5), 0.9, C.ink, null); }), line('M60 58 L60 46 M60 58 L69 62', C.ink, 2), circle(60, 58, 27, 'none', HL, 2.2), rect(52, 92, 16, 20, C.brown, 2, C.ink, 1.2), ground),
  /** räkna baklänges: a rocket on its pad; a person beside it calls out 3, 2, 1 in a bubble; a down arrow along the digits. */
  'tal.räkna-baklänges': all(bg('#e4eef8'), path('M86 28 C86 14 92 6 96 4 C100 6 106 14 106 28 L106 74 L86 74 Z', C.white, C.ink, 1.6), circle(96, 34, 5, '#8cc7e8', C.ink, 1.2), path('M86 60 L78 76 L86 74 Z M106 60 L114 76 L106 74 Z', C.red, C.ink, 1.2), rect(80, 76, 32, 6, C.grey, 1, C.ink, 1), line('M84 82 L82 112 M108 82 L110 112', C.dark, 2),
    P({ x: 30, h: 0.82, top: C.orange, mood: 'laugh' }), bubble(40, 20, 52, all(num(26, 25, '3', 12, C.ink), num(40, 25, '2', 12, C.ink), num(54, 25, '1', 12, HL))), arrow(28, 34, 56, 34, HL, 2.2), ground),

  // ── 3102 Positiva och negativa tal ───────────────────────────────
  /** tallinje: a long horizontal line with arrows at both ends, evenly spaced ticks and numbers −4…4. */
  'tal.tallinje': (() => { const L = nline(62, -3, 3, 16, 104, { size: 11, sw: 2.6 }); return all(bg(), rect(6, 42, 108, 42, 'none', 6, HL, 1.8), L.svg, dot(L.X(0), 62, 3, C.dark)); })(),
  /** positivt tal: the number line; the side right of 0 is coloured warm and its numbers highlighted; the left side is grey. */
  'tal.positivt-tal': (() => { const L = nline(70, -4, 4, 14, 106, { size: 10, col: (n) => (n > 0 ? WARM : C.grey2) }); return all(bg(), rect(L.X(0) + 3, 52, L.X(4) - L.X(0) + 6, 36, 'rgba(224,96,58,0.15)', 4, WARM, 1.8), L.svg, ...[1, 2, 3, 4].map((n) => dot(L.X(n), 70, 4, WARM)), circle(L.X(0), 70, 3.4, C.white, C.ink, 1.2), num(84, 26, '+3', 18, WARM), arrow(66, 40, 108, 40, WARM, 3)); })(),
  /** negativt tal: the same layout; the side left of 0 is coloured cold and highlighted; the right side is grey. */
  'tal.negativt-tal': (() => { const L = nline(70, -4, 4, 14, 106, { size: 10, col: (n) => (n < 0 ? COLD : C.grey2) }); return all(bg(), rect(L.X(-4) - 9, 52, L.X(0) - L.X(-4) + 6, 36, 'rgba(60,127,176,0.15)', 4, COLD, 1.8), L.svg, ...[-1, -2, -3, -4].map((n) => dot(L.X(n), 70, 4, COLD)), circle(L.X(0), 70, 3.4, C.white, C.ink, 1.2), num(36, 26, '−3', 18, COLD), arrow(54, 40, 12, 40, COLD, 3)); })(),
  /** plustecken: one big plus sign in a highlighted disc; a small grey minus sign as reference. */
  'tal.plustecken': all(bg(), circle(56, 58, 36, MARK, HL, 2.6), rect(50, 32, 12, 52, HL, 2, C.ink, 1.4), rect(30, 52, 52, 12, HL, 2, C.ink, 1.4), greyed(rect(94, 96, 16, 5, C.grey, 1, null))),
  /** minustecken: one big minus sign in a highlighted disc; a small grey plus sign as reference. */
  'tal.minustecken': all(bg(), circle(56, 58, 36, MARK, HL, 2.6), rect(30, 52, 52, 12, HL, 2, C.ink, 1.4), greyed(rect(97, 92, 5, 15, C.grey, 1, null), rect(92, 97, 15, 5, C.grey, 1, null))),
  /** motsatt tal: 4 and −4 marked on a number line; a mirror line at 0 and equal arcs show they are the same distance from 0 on opposite sides. */
  'tal.motsatt-tal': (() => { const L = nline(78, -5, 5, 14, 106, { size: 9, col: (n) => (Math.abs(n) === 4 ? HL : C.grey) }); return all(bg(), L.svg, line(`M${L.X(0)} 26 L${L.X(0)} 92`, C.dark, 1.4, '4 3'), dot(L.X(4), 78, 5, HL), dot(L.X(-4), 78, 5, HL),
    path(`M${L.X(0)} 70 Q${f1((L.X(0) + L.X(4)) / 2)} 44 ${L.X(4)} 70`, 'none', WARM, 2.2), path(`M${L.X(0)} 70 Q${f1((L.X(0) + L.X(-4)) / 2)} 44 ${L.X(-4)} 70`, 'none', COLD, 2.2), num(L.X(4), 36, '4', 18, WARM), num(L.X(-4), 36, '−4', 18, COLD), dbl(L.X(-4) + 6, 20, L.X(4) - 6, 20)); })(),
  /** absolutbelopp: −4 on a number line; a bracket measures its distance to 0, and the distance 4 is written in a box (|−4| = 4). */
  'tal.absolutbelopp': (() => { const L = nline(80, -5, 5, 14, 106, { size: 9, col: (n) => (n === -4 ? COLD : C.grey) }); return all(bg(), L.svg, dot(L.X(-4), 80, 5, COLD), dot(L.X(0), 80, 3.4, C.dark), line(`M${L.X(-4)} 66 L${L.X(-4)} 60 L${L.X(0)} 60 L${L.X(0)} 66`, HL, 2.4), mark(f1((L.X(-4) + L.X(0)) / 2), 46, 18, 18), num(f1((L.X(-4) + L.X(0)) / 2), 52, '4', 15, HL), num(84, 34, '|−4| = 4', 13, C.ink)); })(),
  /** på minus: a phone banking app shows a red balance −350 kr with a down arrow; a worried person holds it. */
  'tal.på-minus': all(bg('#f3eee8'), P({ x: 34, h: 0.9, top: C.green, mood: 'frown' }), reach(34, 0.9, 1, 66, 60), at(80, 58, 1, rect(-18, -32, 36, 60, C.dark, 5, C.ink, 1.6), rect(-14, -26, 28, 46, C.white, 2, null), rect(-14, -26, 28, 9, '#cfe0f2', 2, null), num(0, -2, '−350', 10, C.red), num(0, 9, 'kr', 7, C.red), arrow(0, 13, 0, 21, C.red, 2)), ring(80, 58, 26), ground),

  // ── 3103 Udda och jämna tal ──────────────────────────────────────
  /** udda: a big 7 and seven dots set out two by two; one dot is left without a partner (ringed). */
  'tal.udda.2': all(bg(), mark(26, 36, 30, 38), num(26, 48, '7', 34, HL), pairs(7, 48, 40, C.orange), row(60, 96, ['1', '3', '5', '7', '9'], 12, [], { col: C.orange }), line('M10 82 L110 82', C.grey2, 1)),
  /** jämn: a big 8 and eight dots set out two by two; every dot has a partner (check). */
  'tal.jämn.3': all(bg(), num(26, 48, '8', 34, OK), rect(11, 17, 30, 38, '#e3f3e6', 3, OK, 2.2), num(26, 48, '8', 34, OK), ...range(4).map((i) => all(rect(42 + i * 18, 26, 12, 26, 'none', 4, C.grey, 1.2), dot(48 + i * 18, 33, 3.8, C.green), dot(48 + i * 18, 45, 3.8, C.green))), check(104, 64, 0.9), row(60, 96, ['0', '2', '4', '6', '8'], 12, [], { col: OK }), line('M10 82 L110 82', C.grey2, 1)),
  /** två och två: six small children walk in three pairs, holding hands, along a path. */
  'tal.två-och-två': all(bg('#e6f2dc'), line('M4 104 L116 104', C.grey2, 8), ...[[22, C.orange, C.sky], [58, C.green, C.pink], [94, C.purple, C.yellow]].map(([x, a, b]) => all(at(x as number - 8, 70, 1.2, path('M-6 20 C-6 8 6 8 6 20 Z', a as string, C.ink, 1), circle(0, 2, 5, C.skin, C.ink, 1.1), path('M-5 0 C-5 -5 5 -5 5 0 C3 -2 -3 -2 -5 0 Z', C.hair, null), line('M-3 20 L-3 28 M3 20 L3 28', C.ink, 1.6)), at(x as number + 8, 70, 1.2, path('M-6 20 C-6 8 6 8 6 20 Z', b as string, C.ink, 1), circle(0, 2, 5, C.skin, C.ink, 1.1), path('M-5 0 C-5 -5 5 -5 5 0 C3 -2 -3 -2 -5 0 Z', C.hair, null), line('M-3 20 L-3 28 M3 20 L3 28', C.ink, 1.6)), line(`M${x as number - 2} 88 L${x as number + 2} 88`, C.skin, 3), rect(x as number - 17, 64, 34, 44, 'none', 6, HL, 1.4))), num(60, 26, '2 + 2 + 2', 12, HL)),
  /** bli över: seven buns; three plates hold two each and the seventh bun lies alone outside, ringed. */
  'tal.bli-över': all(bg('#f6efe4'), rect(6, 70, 108, 6, C.tan, 2, C.ink, 1.4), ...[22, 52, 82].map((x) => all(plate(x, 62), bun(x - 5, 58), bun(x + 5, 58))), bun(106, 50), ring(106, 50, 10), arrow(104, 30, 106, 40, HL, 2.2), num(98, 24, '1', 14, HL), num(52, 30, '7 : 2', 14, C.dark)),
  /** gå jämnt upp: six buns on three plates, two each, and nothing left over; a check mark. */
  'tal.gå-jämnt-upp': all(bg('#f6efe4'), rect(6, 70, 108, 6, C.tan, 2, C.ink, 1.4), ...[22, 52, 82].map((x) => all(plate(x, 62), bun(x - 5, 58), bun(x + 5, 58))), circle(106, 54, 9, 'none', C.grey, 1.2, ), num(106, 58, '0', 11, C.grey), check(104, 30, 1.2), num(52, 30, '6 : 2', 14, C.dark)),
  /** delbar: twelve dots split into three equal circled groups of four; "12 : 3" with a check. */
  'tal.delbar.2': all(bg(), groups([24, 60, 96], 66, 4, C.orange), num(46, 30, '12 : 3', 16), check(92, 26, 1.2), line('M10 92 L110 92', C.grey2, 1), num(60, 106, '4 + 4 + 4', 10, C.grey)),
  /** multipel: hops of 3 along a number line 0…12 land on 3, 6, 9 and 12, which are highlighted. */
  'tal.multipel': (() => { const L = nline(80, 0, 12, 12, 108, { size: 8, col: (n) => (n % 3 === 0 && n > 0 ? HL : C.grey) }); return all(bg(), L.svg, ...[0, 3, 6, 9].map((n) => all(path(`M${L.X(n)} 74 Q${f1((L.X(n) + L.X(n + 3)) / 2)} 46 ${L.X(n + 3)} 74`, 'none', HL, 2), path(`M${L.X(n + 3)} 74 l-5 -3 l1 5 Z`, HL, null))), ...[3, 6, 9, 12].map((n) => dot(L.X(n), 80, 4, HL)), num(36, 28, '× 3', 16, HL)); })(),
  /** delare: 12 in the centre; spokes lead to 1, 2, 3, 4, 6 and 12 in circles; a grey 5 is crossed out. */
  'tal.delare': all(bg(), ...[1, 2, 3, 4, 6, 12].map((n, i) => { const a = (i / 6) * Math.PI * 2 - Math.PI / 2, x = f1(60 + Math.cos(a) * 36), y = f1(58 + Math.sin(a) * 36); return all(line(`M60 58 L${x} ${y}`, HL, 1.6), circle(x, y, 10, MARK, HL, 1.8), num(x, y + 4, `${n}`, 11, HL)); }), circle(60, 58, 14, C.white, C.ink, 2), num(60, 64, '12', 15), greyed(num(106, 106, '5', 12)), cross(106, 102, 0.8)),
  /** primtal: a grid of 1–20 where 2, 3, 5, 7, 11, 13, 17 and 19 are highlighted and the rest are grey. */
  'tal.primtal': all(bg(), ...range(20).map((i) => { const n = i + 1, x = 18 + (i % 5) * 21, y = 18 + Math.floor(i / 5) * 24, p = [2, 3, 5, 7, 11, 13, 17, 19].includes(n); return all(rect(x - 9, y - 9, 18, 18, p ? MARK : C.white, 3, p ? HL : C.grey2, p ? 2 : 1), num(x, y + 4, `${n}`, 10, p ? HL : C.grey2)); })),

  // ── 3104 Talens storleksordning ──────────────────────────────────
  /** större än: a tall stack of 8 blocks, a short stack of 3, and a big highlighted > between them. */
  'tal.större-än': all(bg(), stack(24, 8, C.orange), stack(96, 3, C.sky), mark(60, 62, 30, 30), num(60, 74, '>', 32, HL), ground),
  /** mindre än: a short stack of 3, a tall stack of 8, and a big highlighted < between them. */
  'tal.mindre-än': all(bg(), stack(24, 3, C.sky), stack(96, 8, C.orange), mark(60, 62, 30, 30), num(60, 74, '<', 32, HL), ground),
  /** lika med: a level balance with 3 + 4 on one pan and 7 on the other; a highlighted = above. */
  'tal.lika-med': all(bg(), balance(60, 0, num(0, -2, '3+4', 11), num(0, -2, '7', 12)), mark(60, 28, 26, 22), num(60, 36, '=', 24, HL), ground),
  /** storleksordning: a grey jumble of five stacks, an arrow, and the same stacks sorted from smallest to largest. */
  'tal.storleksordning': all(bg(), greyed(bars([14, 26, 38, 50], [30, 12, 40, 20], [C.grey, C.grey, C.grey, C.grey], 50, 9)), arrow(60, 32, 78, 32, HL, 2.6), bars([84, 96, 108], [10, 22, 36], [C.yellow, C.orange, WARM], 50, 9),
    bars([22, 42, 62, 82, 102], [12, 22, 32, 42, 52], ['#fde7c4', '#f9cf9a', '#f6b26b', '#ef8a3c', WARM], 106, 14), rect(10, 50, 104, 58, 'none', 6, HL, 1.6), ground),
  /** i stigande ordning: 2, 5, 9 on steps that go up from left to right; an arrow rises. */
  'tal.i-stigande-ordning': stairs([2, 5, 9], 1),
  /** i fallande ordning: 9, 5, 2 on steps that go down from left to right; an arrow falls. */
  'tal.i-fallande-ordning': stairs([9, 5, 2], -1),
  /** mittemellan: 4, 5 and 6 on a number line; 5 is marked and two equal brackets show it is as far from 4 as from 6. */
  'tal.mittemellan': (() => { const L = nline(74, 3, 7, 14, 106, { size: 12, col: (n) => (n === 5 ? HL : n === 4 || n === 6 ? C.ink : C.grey2) }); return all(bg(), L.svg, dot(L.X(4), 74, 4.4, C.sky), dot(L.X(6), 74, 4.4, C.sky), dot(L.X(5), 74, 6, HL), ring(L.X(5), 74, 11), dbl(L.X(4) + 2, 54, L.X(5) - 2, 54, C.dark, 2), dbl(L.X(5) + 2, 54, L.X(6) - 2, 54, C.dark, 2), line(`M${L.X(5)} 30 L${L.X(5)} 62`, HL, 1.6, '3 3'), num(f1((L.X(4) + L.X(5)) / 2), 46, '1', 10, C.dark), num(f1((L.X(5) + L.X(6)) / 2), 46, '1', 10, C.dark)); })(),
  /** näst störst: five bars; the tallest is a grey outline, the second tallest is coloured and ringed. */
  'tal.näst-störst': all(bg(), bars([18, 40, 62, 84, 104], [24, 70, 40, 56, 32], [C.grey2, 'none', C.grey2, HL, C.grey2], 104, 16), num(84, 42, '2', 14, HL), circle(84, 70, 22, 'none', HL, 1.6), num(40, 28, '1', 10, C.grey), ground),
  /** överstiga: a dashed limit line; a bar goes past it and the part above the line is red. */
  'tal.överstiga': limit(true),
  /** understiga: the same dashed limit line; a bar stops below it, and the gap is marked. */
  'tal.understiga': limit(false),
  /** tiopotens: a rod of 10, a flat of 100 and a cube of 1 000 grow left to right, joined by "× 10" arrows. */
  'tal.tiopotens': all(bg(), rod(14, 52, 4), num(16, 104, '10', 10), arrow(24, 72, 36, 72, HL, 2), num(30, 64, '×10', 7, HL), flat(38, 60, 2.6), num(51, 104, '100', 10), arrow(68, 72, 78, 72, HL, 2), num(73, 64, '×10', 7, HL), cube(80, 54, 22), num(95, 104, '1 000', 10), ground),

  // ── 3105 Addition och subtraktion ────────────────────────────────
  /** räknesätt: the four signs + − × ÷ in four coloured tiles. */
  'tal.räknesätt': all(bg(), ...[['+', C.orange, 34, 34], ['−', C.sky, 86, 34], ['×', C.green, 34, 84], ['÷', C.purple, 86, 84]].map(([t, c, x, y]) => all(rect((x as number) - 22, (y as number) - 22, 44, 44, c as string, 8, C.ink, 1.6), num(x as number, (y as number) + 12, t as string, 34, C.white)))),
  /** lägga ihop: two hands push a pile of three apples and a pile of four apples together on a table. */
  'tal.lägga-ihop': all(bg('#f6efe4'), rect(6, 84, 108, 6, C.tan, 2, C.ink, 1.4), apple(30, 74, 1.1), apple(42, 74, 1.1), apple(36, 64, 1.1), apple(72, 74, 1.1), apple(84, 74, 1.1), apple(78, 64, 1.1), apple(90, 64, 1.1), arrow(8, 60, 22, 66, HL, 2.6), arrow(112, 60, 100, 66, HL, 2.6), hnd(14, 72, 5), hnd(106, 72, 5), num(60, 30, '3 + 4', 16, HL), line('M58 50 L60 58 L62 50', HL, 1.6)),
  /** addition: "3 + 4 = 7" with the plus sign highlighted; three and four dots join above. */
  'tal.addition': all(bg(), dotArray(14, 32, 3, 1, 9, C.orange), dotArray(48, 32, 4, 1, 9, C.sky), arrow(40, 44, 76, 50, C.grey, 1.4), dotArray(76, 56, 7, 1, 5, C.dark), eq(92, ['3', '+', '4', '=', '7'], [1])),
  /** dra ifrån: ten apples on a table; a hand lifts four of them away (arrow out). */
  'tal.dra-ifrån': all(bg('#f6efe4'), rect(6, 84, 108, 6, C.tan, 2, C.ink, 1.4), ...range(6).map((i) => apple(14 + i * 12, 74, 1)), greyed(...range(4).map((i) => apple(60 + i * 12, 40, 1))), arrow(70, 66, 82, 50, HL, 2.6), hnd(104, 34, 5), rect(52, 28, 56, 22, 'none', 4, HL, 1.6), num(30, 30, '10 − 4', 14, HL)),
  /** subtraktion: "9 − 5 = 4" with the minus sign highlighted; nine dots, five of them crossed out. */
  'tal.subtraktion': all(bg(), ...range(9).map((i) => all(dot(16 + i * 11, 40, 3.6, i < 4 ? C.sky : C.grey2), i >= 4 ? cross(16 + i * 11, 40, 0.6, C.red) : '')), eq(92, ['9', '−', '5', '=', '4'], [1])),
  /** differens: two bars of 10 and 4 side by side; the part where the tall bar is taller is bracketed and labelled 6. */
  'tal.differens': all(bg(), rect(28, 24, 22, 80, C.orange, 2, C.ink, 1.2), rect(66, 72, 22, 32, C.sky, 2, C.ink, 1.2), num(39, 116, '', 1), num(39, 18, '10', 11), num(77, 66, '4', 11), line('M64 72 L90 72', C.grey, 1, '3 2'), line('M66 24 L90 24', C.grey, 1, '3 2'), rect(66, 24, 22, 48, MARK, 2, HL, 2, ), num(77, 54, '6', 16, HL), line('M96 24 L100 24 L100 72 L96 72', HL, 2), ground),
  /** kolumn: a grid of numbers; one vertical column is highlighted from top to bottom. */
  'tal.kolumn': all(bg(), rect(14, 14, 92, 92, C.white, 3, C.ink, 1.4), ...range(3).map((i) => line(`M${37 + i * 23} 14 L${37 + i * 23} 106`, C.grey2, 1)), ...range(3).map((i) => line(`M14 ${37 + i * 23} L106 ${37 + i * 23}`, C.grey2, 1)),
    rect(60, 14, 23, 92, MARK, 0, HL, 2.4), ...range(4).flatMap((r) => range(4).map((c) => num(25 + c * 23, 30 + r * 23, `${(r * 3 + c * 2 + 1) % 10}`, 11, c === 2 ? HL : C.grey))), arrow(71, 4, 71, 12, HL, 2)),
  /** ställa upp: a sheet where 38 and 45 are written under each other, digits aligned in dashed columns; a pencil draws the line. */
  'tal.ställa-upp.2': all(bg('#eef2f6'), sheet(18, 10, 84, 98), line('M58 14 L58 102 M76 14 L76 102', HL, 1.2, '3 3'), num(58, 42, '3', 18), num(76, 42, '8', 18), num(40, 66, '+', 18), num(58, 66, '4', 18), num(76, 66, '5', 18), line('M34 74 L88 74', C.ink, 2.4), pencil(96, 82, -30)),
  /** minnessiffra: the same vertical addition 38 + 45 = 83 seen close; a small 1 above the tens is ringed. */
  'tal.minnessiffra': all(bg('#eef2f6'), sheet(18, 10, 84, 98), num(58, 28, '1', 10, HL), ring(58, 25, 8), num(58, 48, '3', 18, C.grey), num(76, 48, '8', 18, C.grey), num(40, 70, '+', 18, C.grey), num(58, 70, '4', 18, C.grey), num(76, 70, '5', 18, C.grey), line('M34 78 L88 78', C.grey, 2.4), num(58, 98, '8', 18, C.grey), num(76, 98, '3', 18, C.grey), arrow(80, 82, 64, 30, HL, 1.6)),
  /** växla: "52 − 7" above; one ten-rod breaks apart into ten unit cubes (arrow). */
  'tal.växla.2': all(bg(), num(60, 22, '52 − 7', 16), rod(20, 36, 5), greyed(rod(30, 36, 5)), arrow(42, 60, 58, 60, HL, 3), ...range(10).map((i) => unit(64 + (i % 5) * 9, 46 + Math.floor(i / 5) * 10, 7)), unit(64, 74, 7, C.grey2), unit(73, 74, 7, C.grey2), rect(60, 42, 50, 22, 'none', 4, HL, 1.8), num(86, 100, '10', 12, HL), ground),
  /** huvudräkning: a person with closed eyes and a thought bubble 12 + 9 = 21; grey paper and pencil are crossed out. */
  'tal.huvudräkning': all(bg('#eef4f0'), P({ x: 36, h: 0.92, top: C.sky, mood: 'calm' }), thought(76, 24, 64, num(76, 28, '12+9=21', 11, HL)), greyed(sheet(80, 82, 24, 26), pencil(110, 100, -20)), cross(92, 95, 1.2), ground),
  /** textuppgift: a sheet with lines of text (shown as grey bars), a small picture of apples and a question mark; a pupil reads it. */
  'tal.textuppgift': all(bg('#eef2f6'), sheet(46, 8, 66, 92), ...range(5).map((i) => rect(52, 16 + i * 9, i === 4 ? 30 : 54, 3, C.grey, 1.5, null)), apple(60, 70, 1), apple(72, 70, 1), apple(84, 70, 1), num(100, 92, '?', 16, HL), rect(50, 12, 58, 46, 'none', 3, HL, 1.4), P({ x: 22, h: 0.84, top: C.orange, mood: 'calm' }), reach(22, 0.84, 1, 46, 60), ground),

  // ── 3106 Multiplikation och division ─────────────────────────────
  /** multiplikation: an array of 4 × 3 dots; "4 × 3 = 12" with the times sign highlighted. */
  'tal.multiplikation': all(bg(), dotArray(46, 18, 4, 3, 9, C.orange), eq(92, ['4', '×', '3', '=', '12'], [1])),
  /** faktor: the same "4 × 3 = 12" with the two numbers being multiplied highlighted; the answer is grey. */
  'tal.faktor': all(bg(), dotArray(46, 18, 4, 3, 9, C.grey2), eq(92, ['4', '×', '3', '=', '12'], [0, 2])),
  /** produkt: the same "4 × 3 = 12" with only the answer highlighted; the twelve dots are coloured. */
  'tal.produkt.2': all(bg(), rect(40, 12, 40, 30, 'none', 4, HL, 1.4), dotArray(46, 18, 4, 3, 9, C.orange), eq(92, ['4', '×', '3', '=', '12'], [4])),
  /** multiplikationstabell: a square table with a coloured top row and left column 1–5 and products inside; one cell is ringed. */
  'tal.multiplikationstabell': all(bg(), ...range(6).flatMap((r) => range(6).map((c) => { const x = 10 + c * 17, y = 10 + r * 17, head = r === 0 || c === 0; const v = r === 0 && c === 0 ? '×' : r === 0 ? `${c}` : c === 0 ? `${r}` : `${r * c}`; return all(rect(x, y, 17, 17, head ? '#f9cf9a' : C.white, 0, C.ink, 0.8), num(x + 8.5, y + 12, v, 8, head ? C.dark : C.ink)); })), ring(10 + 4 * 17 + 8.5, 10 + 3 * 17 + 8.5, 10)),
  /** kvadrattal: dot squares of 1, 4, 9 and 16 grow left to right with their numbers below. */
  'tal.kvadrattal': all(bg(), ...[1, 2, 3, 4].map((k, i) => { const x0 = [12, 26, 48, 78][i]!, gap = 6.5; return all(rect(x0 - 4, 70 - k * gap - 2, k * gap + 2, k * gap + 2, 'none', 1, HL, 1.2), ...range(k).flatMap((r) => range(k).map((c) => dot(x0 + c * gap, 70 - (k - r) * gap + 3, 2.4, C.orange))), num(x0 + (k - 1) * gap / 2, 88, `${k * k}`, 12, HL)); }), num(60, 108, '1×1  2×2  3×3  4×4', 8, C.grey)),
  /** fördubbla: three apples, an arrow marked × 2, and six apples. */
  'tal.fördubbla': all(bg(), apple(16, 56, 1.1), apple(28, 56, 1.1), apple(22, 44, 1.1), arrow(38, 52, 58, 52, HL, 3.4), num(48, 42, '×2', 12, HL), ...range(6).map((i) => apple(70 + (i % 3) * 14, 46 + Math.floor(i / 3) * 14, 1.1)), num(22, 84, '3', 14), num(84, 84, '6', 14, HL), ground),
  /** division: twelve dots shared into three equal circled groups; "12 ÷ 3" with the division sign highlighted. */
  'tal.division.2': all(bg(), groups([24, 60, 96], 34, 4, C.sky), eq(92, ['12', '÷', '3', '=', '4'], [1])),
  /** kvot: the same "12 ÷ 3 = 4" with only the answer highlighted; one group of four is coloured. */
  'tal.kvot': all(bg(), groups([24, 96], 34, 4, C.grey2), groups([60], 34, 4, C.orange), ring(60, 34, 15), eq(92, ['12', '÷', '3', '=', '4'], [4])),
  /** rest: thirteen dots in three groups of four; the thirteenth dot is outside and ringed; "13 ÷ 4" with a highlighted 1 left. */
  'tal.rest.2': all(bg(), groups([20, 50, 80], 34, 4, C.sky), dot(106, 34, 4.4, HL), ring(106, 34, 9), num(48, 84, '13 ÷ 4 = 3', 13, C.dark), mark(102, 80, 16, 18), num(102, 86, '1', 14, HL)),
  /** liggande stolen: a sheet with a Swedish long division: 126 under a line with the divisor 3 to the right and 42 above; a small chair lying on its back beside it. */
  'tal.liggande-stolen': all(bg('#eef2f6'), sheet(10, 10, 84, 92), num(40, 36, '42', 16, HL), line('M20 42 L64 42 L64 64', HL, 2.6), num(40, 60, '126', 16), num(76, 60, '3', 16), line('M22 70 L44 70', C.grey, 1.2), num(36, 86, '0', 12, C.grey), chair(88, 92, 1, -90)),

  // ── 3107 Rimlighetsbedömning ─────────────────────────────────────
  /** rimlighet: a balance with a bus on one pan and "12 m" on the other stays level (check); a grey "120 m" is crossed out. */
  'tal.rimlighet': all(bg(), balance(60, 0, at(-12, -4, 0.55, bus(0, 0, 44)), num(0, -2, '12 m', 10, OK)), check(60, 30, 1.2), greyed(num(100, 22, '120 m', 9)), cross(100, 18, 0.8), ground),
  /** överslag: "49 × 21" in grey becomes "50 × 20 = 1 000" in round numbers, joined by a ≈ sign. */
  'tal.överslag': all(bg(), rect(14, 14, 92, 30, C.white, 4, C.grey, 1.2), num(60, 36, '49 × 21', 16, C.grey), mark(60, 56, 22, 16), num(60, 62, '≈', 18, HL), rect(10, 70, 100, 30, MARK, 4, HL, 2), num(60, 92, '50 × 20 = 1 000', 13, HL)),
  /** uppskattning: a person looks at a jar of sweets and thinks "≈ 100"; the jar is ringed. */
  'tal.uppskattning.2': all(bg('#f3eee8'), P({ x: 30, h: 0.9, top: C.purple, mood: 'calm' }), thought(72, 22, 50, num(72, 26, '≈100', 12, HL)), path('M78 66 L78 110 L108 110 L108 66 Z', 'rgba(214,236,248,0.6)', C.ink, 1.4), rect(80, 60, 26, 6, C.brown, 1, C.ink, 1), ...range(16).map((i) => circle(82 + (i % 4) * 7, 104 - Math.floor(i / 4) * 9, 3, [C.red, C.yellow, C.green, C.sky][i % 4]!, C.ink, 0.6)), ground),
  /** enhet: a ruler with m, a scale with kg and a coin with kr; each unit tag is highlighted beside its number. */
  'tal.enhet': all(bg(), rect(12, 18, 96, 14, C.yellow, 2, C.ink, 1.2), ...range(10).map((i) => line(`M${20 + i * 9} 18 L${20 + i * 9} ${i % 2 ? 23 : 26}`, C.ink, 0.8)), num(36, 50, '2', 14), mark(56, 45, 18, 16), num(56, 50, 'm', 13, HL),
    rect(12, 64, 36, 30, C.silver, 4, C.ink, 1.2), circle(30, 74, 7, C.white, C.ink, 1), num(22, 106, '70', 11), mark(38, 102, 20, 14), num(38, 106, 'kg', 10, HL),
    circle(86, 76, 13, C.gold, C.ink, 1.4), num(72, 106, '10', 11), mark(92, 102, 20, 14), num(92, 106, 'kr', 10, HL)),
  /** miniräknare: a hand holds a pocket calculator with a display and buttons. */
  'tal.miniräknare': all(bg('#eef2f6'), calc(60, 54, 1.7, '123'), hnd(36, 84, 6), hnd(84, 84, 6), ground),
  /** sunt förnuft: a person with a light bulb above the head thinks about a bus: 12 m gets a check, 120 m a cross. */
  'tal.sunt-förnuft': all(bg('#eef4f0'), P({ x: 26, h: 0.9, top: C.green, mood: 'smile' }), circle(26, 18, 7, C.yellow, C.ink, 1.2), rect(23, 25, 6, 4, C.grey, 1, C.ink, 0.8), ...[-1, 0, 1].map((i) => line(`M${26 + i * 9} ${8 - (i === 0 ? 2 : 0)} l${i * 2} -3`, C.gold, 1.6)),
    thought(80, 54, 62, all(at(56, 50, 0.5, bus(0, 0, 40)), num(94, 50, '12 m', 8, OK), check(108, 46, 0.6))), greyed(num(80, 98, '120 m', 9)), cross(80, 94, 0.8), ground),
};

/** Double-headed arrow (used by the number-line pictures). */
function dbl(x1: number, y1: number, x2: number, y2: number, col: string = HL, sw = 2.4) { return all(arrow((x1 + x2) / 2, (y1 + y2) / 2, x2, y2, col, sw), arrow((x1 + x2) / 2, (y1 + y2) / 2, x1, y1, col, sw)); }
void sparkle; void star; void scribble;
