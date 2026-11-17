/**
 * Matematik & naturvetenskap → Avancerad matematik → Sannolikhetsteori, 3241–3247 (0.49): random trials and
 * outcomes, events and probabilities, conditional probability, independent events, combinatorics,
 * probability distributions, expected value and variance.
 * Recurring signs: dice faces, coins (a crown on one side, the digit 1 on the other), coloured balls and a
 * light axis frame; the part that the word names is orange and a grey reference shows what the word is not.
 * Close words share one layout where only the marked part differs: händelse/komplementhändelse on the same
 * grid of die faces; osannolik/trolig on the same 0–1 scale; urna/utan återläggning on the same jar;
 * normalfördelning/likformig fördelning on the same axes (curve or flat bars); väntevärde/varians/
 * standardavvikelse with balance point, squares and ± arrows. Digits, maths signs and the letters X, P, A, B
 * and σ only; no words, no brands.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, star, type Svg } from './kit';
import { HL, T, mini } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const SOFT = '#f4f6f8';
const MARK = '#fff3b0';
const TINT = 'rgba(228,87,46,0.18)';
const BLUE = '#5b9bd5';
const GREEN = '#3f9a5a';
const FELT = '#4f9d69';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ground = line('M4 112 L116 112', C.grey2, 2);
const bg = (col: string = SOFT) => rect(4, 4, 112, 108, col, 3, null);
const num = (x: number, y: number, s: string, size = 12, col: string = C.ink) => T(x, y, s, size, col);
const check = (x: number, y: number, s = 1, col: string = GREEN) => line(`M${x - 6 * s} ${y} L${x - 2 * s} ${y + 5 * s} L${x + 7 * s} ${y - 6 * s}`, col, 3 * s);
const cross = (x: number, y: number, s = 1, col: string = C.red) => line(`M${x - 5 * s} ${y - 5 * s} L${x + 5 * s} ${y + 5 * s} M${x + 5 * s} ${y - 5 * s} L${x - 5 * s} ${y + 5 * s}`, col, 3 * s);

/** Die face with n pips, centred at (cx, cy), side s. */
const PIPS: Record<number, [number, number][]> = {
  1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 0], [1, 1]],
};
const die = (cx: number, cy: number, s: number, n: number, o: { fill?: string; pip?: string; stroke?: string; rot?: number } = {}) =>
  g(`translate(${cx} ${cy}) rotate(${o.rot ?? 0})`, rect(f1(-s / 2), f1(-s / 2), s, s, o.fill ?? C.white, f1(s * 0.18), o.stroke ?? C.ink, f1(Math.max(1.2, s * 0.07))),
    ...PIPS[n]!.map(([a, b]) => circle(f1(a * s * 0.27), f1(b * s * 0.27), f1(s * 0.09), o.pip ?? C.ink, null)));
/** Coin: side 'k' = crown, side '1' = the digit 1. */
const crown = (s = 1, col: string = C.brown) => g(`scale(${s})`, path('M-8 4 L-9 -5 L-4 -1 L0 -7 L4 -1 L9 -5 L8 4 Z', col, null), circle(-9, -5.5, 1.4, col, null), circle(0, -7.5, 1.4, col, null), circle(9, -5.5, 1.4, col, null));
const coin = (cx: number, cy: number, r: number, side: 'k' | '1', o: { stroke?: string; sw?: number } = {}) =>
  g(`translate(${cx} ${cy})`, circle(0, 0, r, C.gold, o.stroke ?? C.ink, o.sw ?? 1.8), circle(0, 0, f1(r * 0.8), 'none', C.brown, 1),
    side === 'k' ? crown(r / 13) : num(0, f1(r * 0.38), '1', f1(r * 1.1), C.brown));
/** Ball with highlight. */
const ball = (x: number, y: number, col: string, r = 5) => all(circle(x, y, r, col, C.ink, 1.2), circle(f1(x - r * 0.35), f1(y - r * 0.35), f1(r * 0.28), 'rgba(255,255,255,0.7)', null));
/** Glass jar with balls; pos = list of [x, y, colour]. */
const jar = (x: number, y: number, balls: [number, number, string][]) => all(
  path(`M${x - 22} ${y - 44} L${x - 22} ${y - 4} C${x - 22} ${y} ${x - 18} ${y + 2} ${x - 14} ${y + 2} L${x + 14} ${y + 2} C${x + 18} ${y + 2} ${x + 22} ${y} ${x + 22} ${y - 4} L${x + 22} ${y - 44}`, '#e8f4fb', C.ink, 2),
  ellipse(x, y - 44, 22, 4, '#d4ebf7', C.ink, 1.6),
  ...balls.map(([bx, by, c]) => ball(x + bx, y + by, c, 6)));
/** Axis frame with origin (x0, y0), width w, height h. */
const axes = (x0: number, y0: number, w: number, h: number) => all(line(`M${x0} ${y0 - h} L${x0} ${y0} L${x0 + w} ${y0}`, C.ink, 1.8));
/** Bell curve as a path between xa and xb, centre mu, spread sd, peak height H above base y0. */
const bellPts = (xa: number, xb: number, y0: number, mu: number, sd: number, H: number) => range(41).map((i) => { const x = xa + ((xb - xa) * i) / 40; return [f1(x), f1(y0 - H * Math.exp(-(((x - mu) / sd) ** 2) / 2))] as const; });
const bell = (xa: number, xb: number, y0: number, mu: number, sd: number, H: number, col: string = HL, fill = 'none', sw = 3) => {
  const p = bellPts(xa, xb, y0, mu, sd, H);
  const d = p.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  return all(fill !== 'none' ? path(`${d} L${xb} ${y0} L${xa} ${y0} Z`, fill, null) : '', line(d, col, sw));
};
/** 0–1 scale with a pointer at p (orange) and a grey pointer at q. */
const scale01 = (p: number, q: number) => {
  const X = (t: number) => f1(14 + t * 92);
  return all(bg(),
    rect(14, 62, 92, 12, C.white, 6, C.ink, 1.6), rect(14, 62, 46, 12, '#e3edf6', 6, null), rect(14, 62, 92, 12, 'none', 6, C.ink, 1.6),
    ...[0, 0.25, 0.5, 0.75, 1].map((t) => line(`M${X(t)} 74 L${X(t)} 80`, C.ink, 1.4)),
    num(14, 94, '0', 12), num(60, 94, '½', 12, C.grey), num(106, 94, '1', 12),
    greyed(path(`M${X(q)} 60 L${f1(X(q) - 6)} 46 L${f1(X(q) + 6)} 46 Z`, C.dark, null)),
    rect(f1(X(p) - 14), 14, 28, 22, MARK, 4, HL, 2.4), num(X(p), 30, `${Math.round(p * 100)} %`, 10, HL),
    path(`M${X(p)} 60 L${f1(X(p) - 8)} 40 L${f1(X(p) + 8)} 40 Z`, HL, C.ink, 1.4));
};
/** Card with a suit sign in the middle. */
const suit = (k: 'h' | 'd' | 's' | 'c', s = 1) => {
  const red = '#d64545', blk = C.ink;
  const H = path('M0 6 C-10 -1 -7 -9 -2.5 -8 C-1 -7.6 0 -6 0 -4.5 C0 -6 1 -7.6 2.5 -8 C7 -9 10 -1 0 6 Z', red, null);
  return g(`scale(${s})`, k === 'h' ? H : k === 'd' ? path('M0 -8 L6 0 L0 8 L-6 0 Z', red, null)
    : k === 's' ? all(g('rotate(180)', path('M0 6 C-10 -1 -7 -9 -2.5 -8 C-1 -7.6 0 -6 0 -4.5 C0 -6 1 -7.6 2.5 -8 C7 -9 10 -1 0 6 Z', blk, null)), path('M0 2 L-3 8 L3 8 Z', blk, null))
    : all(circle(0, -4, 3.4, blk, null), circle(-4, 1.5, 3.4, blk, null), circle(4, 1.5, 3.4, blk, null), path('M0 0 L-3 8 L3 8 Z', blk, null)));
};
const card = (x: number, y: number, rot: number, k: 'h' | 'd' | 's' | 'c', n: string) => g(`translate(${x} ${y}) rotate(${rot})`, rect(-13, -19, 26, 38, C.white, 3, C.ink, 1.6), g('translate(0 1)', suit(k, 1)), num(-7, -9, n, 7, k === 'h' || k === 'd' ? '#d64545' : C.ink));
/** Test cassette: positive = two lines. */
const cassette = (x: number, y: number, positive: boolean, s = 1) => at(x, y, s,
  rect(-34, -12, 68, 24, C.white, 6, C.ink, 2), circle(-22, 0, 5, '#e3e7eb', C.ink, 1.4), rect(-6, -6, 30, 12, '#f2f4f6', 2, C.ink, 1.2),
  line('M4 -5 L4 5', '#c2185b', 2.6), positive ? line('M14 -5 L14 5', '#c2185b', 2.6) : '');
/** Small virus. */
const virus = (x: number, y: number, s = 1, col: string = '#8bc34a') => at(x, y, s, ...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(Math.cos(a) * 6)} ${f1(Math.sin(a) * 6)} L${f1(Math.cos(a) * 9)} ${f1(Math.sin(a) * 9)}`, C.ink, 1.2) + circle(f1(Math.cos(a) * 9.5), f1(Math.sin(a) * 9.5), 1.4, col, C.ink, 0.8); }).join(''), circle(0, 0, 6.5, col, C.ink, 1.4));
const shirt = (x: number, y: number, col: string) => g(`translate(${x} ${y})`, path('M-9 -8 L-4 -10 C-2 -7 2 -7 4 -10 L9 -8 L12 -2 L8 0 L8 9 L-8 9 L-8 0 L-12 -2 Z', col, C.ink, 1.4));
const pants = (x: number, y: number, col: string) => g(`translate(${x} ${y})`, path('M-7 -10 L7 -10 L8 10 L2 10 L0 -2 L-2 10 L-8 10 Z', col, C.ink, 1.4));
/** Banknote. */
const note = (x: number, y: number, rot = 0) => g(`translate(${x} ${y}) rotate(${rot})`, rect(-16, -8, 32, 16, '#a8dcc0', 2, C.ink, 1.4), circle(0, 0, 4.5, 'none', GREEN, 1.4), num(-10, 3, '100', 5.5, GREEN));

// ── Motifs ───────────────────────────────────────────────────────────
export const PROBABILITY_MOTIFS: Record<string, Svg> = {
  // ── 3241 Slumpförsök och utfall ───────────────────────────────────────
  /** slumpförsök: a die in the air with arrows fanning out to all six possible faces and a big orange question mark; a grey 2 + 2 = 4 with a tick (no chance) below. */
  'prob.slumpförsök': all(bg(), die(60, 30, 22, 5, { rot: 18, stroke: HL }), line('M44 18 C40 12 44 6 50 8 M76 18 C80 12 76 6 70 8', HL, 1.6), ...range(6).map((i) => { const x = 14 + i * 18.4; return arrow(60, 44, f1(60 + (x - 60) * 0.8), 62, C.grey, 1.4) + die(x, 74, 14, i + 1); }), circle(98, 22, 11, MARK, HL, 2.2), num(98, 28, '?', 17, HL), greyed(num(60, 104, '2 + 2 = 4', 12)), check(96, 100, 0.8, C.grey)),
  /** utfallsrum: big orange curly braces around all six die faces in two rows. */
  'prob.utfallsrum': all(bg(), rect(18, 26, 84, 66, MARK, 6, null), path('M24 24 C14 24 18 50 12 58 C18 66 14 92 24 92', 'none', HL, 4), path('M96 24 C106 24 102 50 108 58 C102 66 106 92 96 92', 'none', HL, 4), ...range(6).map((i) => die(36 + (i % 3) * 24, 44 + Math.floor(i / 3) * 28, 18, i + 1))),
  /** tärningskast: a die flying in a dashed arc over a table, two faded copies along the way, and a hand that has just let go. */
  'prob.tärningskast': all(bg('#eef4ec'), rect(4, 90, 112, 22, FELT, 2, C.ink, 1.6), line('M20 46 C40 6 80 6 96 80', HL, 1.8, '4 4'), g('translate(6 48) rotate(-20)', path('M-2 -6 C4 -9 12 -9 16 -6 C20 -4 20 2 16 3 L8 4 C6 8 0 8 -2 5 Z', C.skin, C.ink, 1.4)), g('opacity="0.35"', die(36, 24, 14, 3, { rot: -20 })), g('opacity="0.6"', die(60, 14, 15, 5, { rot: 25 })), die(92, 74, 18, 6, { rot: 12, stroke: HL }), line('M84 88 L80 92 M100 88 L104 92', C.ink, 1.4)),
  /** krona eller klave: a coin spinning up in the air (curved arrow) and below it its two sides side by side: a crown and the digit 1, with an orange "/" between them. */
  'prob.krona-eller-klave': all(bg(), g('translate(60 26)', ellipse(0, 0, 14, 5, C.gold, C.ink, 1.6)), path('M38 40 C34 22 44 12 52 14', 'none', HL, 2.2), arrow(46, 16, 52, 14, HL, 2), path('M82 40 C86 22 76 12 68 14', 'none', HL, 2.2), coin(32, 76, 22, 'k'), coin(88, 76, 22, '1'), num(60, 84, '/', 22, HL)),
  /** kortlek: a fan of five playing cards with the four suits, and the rest of the deck as a neat stack beside them. */
  'prob.kortlek': all(bg(), ...range(4).map((i) => rect(80 - i, 64 - i * 2.4, 28, 40, C.white, 3, C.ink, 1.2)), rect(77, 56.8, 28, 40, '#3c6db0', 3, C.ink, 1.4), rect(81, 60.8, 20, 32, 'none', 2, C.white, 1.2), card(22, 66, -24, 'h', '7'), card(34, 60, -12, 's', '3'), card(48, 58, 0, 'd', '9'), card(62, 60, 12, 'c', '5'), ground),
  /** lyckohjul: a big wheel with eight coloured fields on a stand, an arrow pointer at the top and curved arrows showing that it spins. */
  'prob.lyckohjul': (() => { const cols = [C.red, C.yellow, BLUE, C.green, C.orange, C.purple, C.pink, C.sky]; const r = 34, cx = 60, cy = 56; const seg = (i: number) => { const a0 = (i / 8) * Math.PI * 2, a1 = ((i + 1) / 8) * Math.PI * 2; return path(`M${cx} ${cy} L${f1(cx + r * Math.cos(a0))} ${f1(cy + r * Math.sin(a0))} A${r} ${r} 0 0 1 ${f1(cx + r * Math.cos(a1))} ${f1(cy + r * Math.sin(a1))} Z`, cols[i]!, C.ink, 1.2); }; return all(bg(), line('M60 56 L44 110 M60 56 L76 110', C.brown, 4), ...range(8).map(seg), circle(cx, cy, r, 'none', C.ink, 2.4), circle(cx, cy, 5, C.white, C.ink, 1.6), path('M60 26 L54 12 L66 12 Z', HL, C.ink, 1.4), path('M18 30 C10 44 10 66 18 80', 'none', HL, 2.4), arrow(16, 74, 19, 82, HL, 2.4), path('M102 80 C110 66 110 44 102 30', 'none', HL, 2.4), arrow(104, 36, 101, 28, HL, 2.4), ground); })(),
  /** slumpgenerator: a phone showing a big random number with a circular "new number" arrow and a small die; grey numbers drift past it. */
  'prob.slumpgenerator': all(bg(), greyed(num(18, 30, '8', 12), num(100, 26, '51', 12), num(16, 90, '23', 12), num(104, 96, '4', 12)), rect(36, 10, 48, 96, C.dark, 7, C.ink, 1.6), rect(40, 18, 40, 78, '#eaf4fb', 2, null), rect(44, 30, 32, 26, MARK, 4, HL, 2.2), num(60, 50, '37', 18, HL), path('M52 74 A8 8 0 1 1 60 82', 'none', HL, 2.4), arrow(56, 82, 61, 82, HL, 2.2), die(72, 88, 9, 3)),
  /** lika sannolik: a level balance with die face 1 in one pan and die face 6 in the other; an orange = between them. */
  'prob.lika-sannolik': all(bg(), path('M60 30 L54 104 L66 104 Z', C.grey, C.ink, 1.6), rect(40, 102, 40, 6, C.grey, 2, C.ink, 1.4), line('M16 34 L104 34', C.ink, 3), circle(60, 34, 3, C.ink, null), line('M22 34 L14 60 M22 34 L30 60 M98 34 L90 60 M98 34 L106 60', C.ink, 1.2), path('M10 60 L34 60 C32 68 12 68 10 60 Z', C.grey2, C.ink, 1.4), path('M86 60 L110 60 C108 68 88 68 86 60 Z', C.grey2, C.ink, 1.4), die(22, 50, 16, 1), die(98, 50, 16, 6), rect(48, 52, 24, 22, MARK, 4, HL, 2.2), num(60, 70, '=', 20, HL)),

  // ── 3242 Händelser och sannolikheter ─────────────────────────────────
  /** händelse (math): all six die faces in a frame; the top row 2, 4, 6 is ringed together in orange, the bottom row 1, 3, 5 is grey. */
  'prob.händelse.2': all(bg(), rect(10, 18, 100, 84, C.white, 6, C.grey, 1.6), rect(16, 26, 88, 32, TINT, 12, HL, 3), ...[2, 4, 6].map((n, i) => die(32 + i * 28, 42, 22, n, { stroke: HL })), greyed(...[1, 3, 5].map((n, i) => die(32 + i * 28, 80, 22, n)))),
  /** komplementhändelse: the same frame; now 2, 4, 6 are grey in a grey ring and the rest, 1, 3, 5, is ringed in orange; "1 −" in the corner. */
  'prob.komplementhändelse': all(bg(), rect(10, 18, 100, 84, C.white, 6, C.grey, 1.6), greyed(rect(16, 26, 88, 32, 'none', 12, C.dark, 2), ...[2, 4, 6].map((n, i) => die(32 + i * 28, 42, 22, n))), rect(16, 64, 88, 32, TINT, 12, HL, 3), ...[1, 3, 5].map((n, i) => die(32 + i * 28, 80, 22, n, { stroke: HL })), rect(80, 4, 34, 16, MARK, 3, HL, 1.6), num(97, 16, '1 −', 11, HL)),
  /** osannolik: a scale from 0 to 1; the orange pointer stands very close to 0 (5 %); a grey pointer near 1 for contrast. */
  'prob.osannolik': scale01(0.05, 0.9),
  /** trolig: the same 0–1 scale; the orange pointer stands close to 1 (85 %); a grey pointer near 0 for contrast. */
  'prob.trolig': scale01(0.85, 0.05),
  /** femtio-femtio: a circle split exactly in two halves, orange and blue, with 50 % on each half; a coin above. */
  'prob.femtio-femtio': all(bg(), path('M60 30 A36 36 0 0 0 60 102 Z', HL, C.ink, 2), path('M60 30 A36 36 0 0 1 60 102 Z', BLUE, C.ink, 2), num(42, 70, '50 %', 11, C.white), num(78, 70, '50 %', 11, C.white), coin(60, 16, 10, 'k')),
  /** de stora talens lag: a zigzag line of the share of crowns that swings wildly at first and then settles on the dashed ½ line as the number of throws grows. */
  'prob.de-stora-talens-lag': (() => { const ys = [96, 28, 80, 40, 72, 50, 66, 54, 63, 57, 61, 58, 60.5, 59, 60, 59.6, 60, 59.8, 60]; const d = ys.map((y, i) => `${i ? 'L' : 'M'}${f1(20 + i * 5)} ${y}`).join(' '); return all(bg(), axes(16, 104, 96, 92), line('M16 60 L112 60', C.grey, 1.6, '5 4'), num(9, 64, '½', 10, C.grey), line(d, HL, 2.6), coin(98, 24, 9, 'k'), num(30, 115, '10', 7, C.grey), num(100, 115, '1000', 7, C.grey)); })(),

  // ── 3243 Betingad sannolikhet ────────────────────────────────────────
  /** betingad sannolikhet: a box with two overlapping circles A and B; everything outside B is greyed out and B is orange, with the overlap darker; P(A | B) above. */
  'prob.betingad-sannolikhet': all(bg(), rect(10, 26, 100, 78, '#e3e6ea', 4, C.grey, 1.4), circle(46, 64, 26, '#d4d9de', C.grey, 1.6), circle(74, 64, 26, MARK, HL, 3), path('M60 42.2 A26 26 0 0 1 60 85.8 A26 26 0 0 1 60 42.2 Z', 'rgba(228,87,46,0.45)', null), num(34, 68, 'A', 12, C.grey), num(86, 68, 'B', 12, HL), num(60, 19, 'P(A | B)', 13, HL)),
  /** träddiagram: from one dot two branches split, and each splits again into two; small coins at the four ends and ½ on the first branches. */
  'prob.träddiagram': all(bg(), circle(14, 60, 4, C.ink, null), line('M14 60 L52 32 M14 60 L52 88', HL, 3), line('M52 32 L88 18 M52 32 L88 46 M52 88 L88 74 M52 88 L88 102', HL, 2.2), coin(52, 32, 8, 'k'), coin(52, 88, 8, '1'), coin(100, 18, 7, 'k'), coin(100, 46, 7, '1'), coin(100, 74, 7, 'k'), coin(100, 102, 7, '1'), num(28, 40, '½', 10, C.dark), num(28, 88, '½', 10, C.dark)),
  /** snabbtest: a small white test cassette with a sample well and two lines in the window, a dropper above it and a timer. */
  'prob.snabbtest': all(bg(), cassette(56, 82, true, 1.4), g('translate(30 30) rotate(-30)', rect(-4, -20, 8, 26, '#e8f4fb', 2, C.ink, 1.4), ellipse(0, -22, 6, 4, C.purple, C.ink, 1.2)), path('M33 46 C31 50 35 52 35 49 Z', '#9fd3f0', C.ink, 1), circle(92, 30, 14, C.white, C.ink, 1.8), line('M92 30 L92 20 M92 30 L99 33', C.ink, 1.8), rect(89, 13, 6, 4, C.ink, 1, null)),
  /** falskt positiv: a test showing two lines (positive) next to a healthy, smiling person with a green tick and a crossed-out virus; an orange ring around the two lines. */
  'prob.falskt-positiv': all(bg(), cassette(40, 26, true, 0.95), circle(50, 26, 11, 'none', HL, 2.6), arrow(44, 42, 58, 56, HL, 2.2), num(28, 64, '≠', 24, HL), g('translate(80 88) scale(1.9)', mini(0, 0, C.sky)), check(104, 58, 1.2), virus(24, 92, 1.1), cross(24, 92, 1.6)),
  /** fyrfältstabell: a 2 × 2 table; the rows are marked with a virus and a heart, the columns with + and −; the four inner cells hold numbers and are framed in orange. */
  'prob.fyrfältstabell': all(bg(), rect(40, 14, 70, 22, '#dfe8f1', 2, null), rect(8, 36, 32, 70, '#dfe8f1', 2, null), num(57, 31, '+', 16), num(92, 31, '−', 16), virus(24, 54, 0.9), g('translate(24 88)', path('M0 7 C-11 0 -8 -9 -3 -8 C-1 -7.6 0 -6 0 -4.5 C0 -6 1 -7.6 3 -8 C8 -9 11 0 0 7 Z', '#e57373', C.ink, 1.2)), rect(40, 36, 70, 70, MARK, 2, null), line('M75 36 L75 106 M40 71 L110 71', C.ink, 1.4), rect(40, 36, 70, 70, 'none', 2, HL, 3), num(57, 59, '9', 15, HL), num(92, 59, '1', 15, HL), num(57, 94, '50', 15, HL), num(92, 94, '940', 13, HL)),

  // ── 3244 Oberoende händelser ─────────────────────────────────────────
  /** oberoende (math): two dice on two separate boxes with a wall between them; a link between them is crossed out and both show ⅙ unchanged. */
  'prob.oberoende.2': all(bg(), rect(8, 70, 44, 36, '#e3edf6', 3, C.ink, 1.6), rect(68, 70, 44, 36, '#e3edf6', 3, C.ink, 1.6), rect(57, 30, 6, 80, C.grey, 1, C.ink, 1.2), die(30, 56, 22, 6, { stroke: HL }), die(90, 56, 22, 3, { stroke: HL }), path('M38 30 C50 14 70 14 82 30', 'none', C.grey, 2), arrow(76, 24, 82, 30, C.grey, 2), cross(60, 18, 1.2), num(30, 96, '⅙', 15, HL), num(90, 96, '⅙', 15, HL)),
  /** urna (in probability): a glass jar with three red and two blue balls. */
  'prob.urna.2': all(bg(), at(60, 108, 1.55, jar(0, 0, [[-11, -8, C.red], [2, -8, BLUE], [13, -8, C.red], [-5, -20, C.red], [8, -20, BLUE]]))),
  /** utan återläggning: the same jar; one red ball has been taken out and lies beside it, and the arrow back into the jar is crossed out. */
  'prob.utan-återläggning': all(bg(), at(42, 108, 1.4, jar(0, 0, [[-11, -8, C.red], [2, -8, BLUE], [13, -8, C.red], [8, -20, BLUE]])), rect(80, 88, 30, 22, MARK, 4, HL, 2), ball(95, 99, C.red, 7.5), path('M94 84 C94 40 62 22 46 34', 'none', HL, 2.6), arrow(52, 29, 46, 35, HL, 2.6), cross(82, 42, 1.5)),
  /** i rad: three coins side by side, all showing the crown, numbered 1, 2, 3 with ticks above, joined by an orange bracket. */
  'prob.i-rad': all(bg(), ...[24, 60, 96].map((x, i) => coin(x, 62, 15, 'k') + num(x, 30, String(i + 1), 13, C.dark) + check(x + 2, 92, 0.9)), line('M10 44 L10 38 L110 38 L110 44', HL, 3), arrow(30, 62, 42, 62, HL, 2), arrow(66, 62, 78, 62, HL, 2)),
  /** rulett: a roulette wheel seen from above: red and black pockets around, one green zero, a white ball and a centre hub. */
  'prob.rulett': (() => { const n = 18, R = 46, r = 32, cx = 60, cy = 58; const seg = (i: number) => { const a0 = (i / n) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2; const P = (a: number, rr: number) => `${f1(cx + rr * Math.cos(a))} ${f1(cy + rr * Math.sin(a))}`; return path(`M${P(a0, r)} L${P(a0, R)} A${R} ${R} 0 0 1 ${P(a1, R)} L${P(a1, r)} A${r} ${r} 0 0 0 ${P(a0, r)} Z`, i === 0 ? GREEN : i % 2 ? '#c62828' : C.black, C.white, 0.8); }; return all(bg(), circle(cx, cy, R + 6, C.brown, C.ink, 2), ...range(n).map(seg), circle(cx, cy, r, '#7a4a2a', C.ink, 1.4), circle(cx, cy, 14, C.gold, C.ink, 1.4), line('M46 58 L74 58 M60 44 L60 72', C.gold, 3), circle(60, 58, 4, C.silver, C.ink, 1), circle(84, 26, 3.6, C.white, C.ink, 1.2)); })(),

  // ── 3245 Kombinatorik ────────────────────────────────────────────────
  /** kombinatorik: three shirts on the left and two pairs of trousers on the right, every shirt joined to every pair with orange lines; 3 × 2 = 6 below. */
  'prob.kombinatorik': all(bg(), ...[22, 50, 78].flatMap((y) => [36, 70].map((y2) => line(`M30 ${y} L82 ${y2}`, HL, 2))), shirt(18, 22, C.red), shirt(18, 50, C.yellow), shirt(18, 78, BLUE), pants(94, 36, C.navy), pants(94, 70, C.tan), rect(30, 94, 60, 16, MARK, 3, null), num(60, 106, '3 × 2 = 6', 12, HL)),
  /** permutation: three balls (red, blue, yellow) shown in all six different orders, one order per row, in an orange frame. */
  'prob.permutation': (() => { const cs = [C.red, BLUE, C.yellow]; const P = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]; return all(bg(), rect(30, 8, 60, 104, MARK, 5, HL, 2.4), ...P.flatMap((p, r) => p.map((c, k) => ball(44 + k * 16, 18 + r * 17, cs[c]!, 6.5)))); })(),
  /** fakultet (math): a big 5 with a large orange exclamation mark, and = 5 · 4 · 3 · 2 · 1 = 120 below. */
  'prob.fakultet.2': all(bg(), num(46, 64, '5', 54), rect(68, 14, 24, 56, MARK, 4, HL, 2.4), num(80, 64, '!', 54, HL), num(60, 90, '5 · 4 · 3 · 2 · 1', 12, C.dark), num(60, 106, '= 120', 13, C.dark)),
  /** kodlås: a bicycle combination lock with four number wheels showing 0 4 7 2 and a looped steel cable. */
  'prob.kodlås': all(bg(), path('M24 60 C4 20 70 0 96 34', 'none', C.dark, 7), path('M24 60 C4 20 70 0 96 34', 'none', C.grey, 3), rect(16, 56, 92, 34, C.dark, 6, C.ink, 1.8), ...['0', '4', '7', '2'].map((d, i) => rect(24 + i * 20, 61, 16, 24, C.white, 2, C.ink, 1.2) + line(`M${24 + i * 20} 66 L${40 + i * 20} 66 M${24 + i * 20} 80 L${40 + i * 20} 80`, C.grey2, 1) + num(32 + i * 20, 78, d, 13)), rect(20, 59, 84, 28, 'none', 4, HL, 2.4), line('M100 46 L100 56', C.dark, 6)),
  /** lottorad: a lottery coupon with a grid of the numbers 1–35; seven of them are crossed with orange marks, and a pen lies beside it. */
  'prob.lottorad': all(bg(), rect(10, 10, 86, 100, C.white, 3, C.ink, 1.6), ...range(35).map((i) => { const c = i % 5, r = Math.floor(i / 5), x = 22 + c * 15.5, y = 22 + r * 13; const on = [3, 8, 12, 19, 23, 28, 34].includes(i + 1); return rect(x - 6.5, y - 5.5, 13, 11, on ? MARK : C.white, 1, '#c9ced4', 0.8) + num(x, y + 3, String(i + 1), 6.5, on ? C.ink : C.grey) + (on ? line(`M${x - 5} ${y - 4} L${x + 5} ${y + 4} M${x + 5} ${y - 4} L${x - 5} ${y + 4}`, HL, 2) : ''); }), g('translate(104 60) rotate(20)', rect(-3, -30, 6, 44, BLUE, 1, C.ink, 1.2), path('M-3 14 L3 14 L0 22 Z', C.tan, C.ink, 1))),

  // ── 3246 Sannolikhetsfördelningar ────────────────────────────────────
  /** sannolikhetsfördelning: two coins above three orange bars for 0, 1 and 2 crowns with the heights ¼, ½ and ¼; "= 1" beside. */
  'prob.sannolikhetsfördelning': all(bg(), axes(14, 96, 98, 84), ...[[0, 0.25, '¼'], [1, 0.5, '½'], [2, 0.25, '¼']].map(([k, p, t]) => { const x = 26 + (k as number) * 26, h = (p as number) * 120; return rect(x, 96 - h, 18, h, HL, 1, C.ink, 1.4) + num(x + 9, 92 - h, t as string, 11, HL) + num(x + 9, 108, String(k), 10); }), coin(96, 22, 9, 'k'), coin(104, 34, 9, '1'), num(100, 62, '= 1', 11, C.dark)),
  /** stokastisk variabel: a die showing 4, an arrow labelled X to a number line 1–6, and an orange dot at 4; a grey die 2 gives a grey dot at 2. */
  'prob.stokastisk-variabel': all(bg(), die(30, 30, 24, 4, { stroke: HL }), greyed(die(86, 30, 20, 2)), line('M12 90 L108 90', C.ink, 1.8), ...range(6).map((i) => line(`M${20 + i * 16} 86 L${20 + i * 16} 94`, C.ink, 1.4) + num(20 + i * 16, 106, String(i + 1), 9)), arrow(34, 46, 66, 82, HL, 2.6), circle(68, 90, 5.5, HL, C.ink, 1.2), rect(36, 54, 18, 16, MARK, 3, HL, 1.6), num(45, 66, 'X', 12, HL), greyed(arrow(82, 44, 38, 82, C.dark, 1.6), circle(36, 90, 4, C.dark, null))),
  /** normalfördelning: on axes, a large orange bell-shaped curve, highest in the middle, with the area under it lightly filled; small grey flat bars in a corner for contrast. */
  'prob.normalfördelning': all(bg(), axes(10, 100, 102, 88), bell(12, 110, 100, 61, 15, 74, HL, TINT, 3.4), line('M61 26 L61 100', HL, 1.2, '3 3'), greyed(...range(4).map((i) => rect(86 + i * 6, 14, 5, 12, C.dark, 0, null)))),
  /** likformig fördelning: on the same axes, six orange bars of exactly the same height above the die faces 1–6; a small grey bell curve in a corner for contrast. */
  'prob.likformig-fördelning': all(bg(), axes(10, 100, 102, 88), line('M12 56 L110 56', HL, 1.4, '3 3'), ...range(6).map((i) => rect(16 + i * 16, 56, 12, 44, HL, 1, C.ink, 1.2) + die(22 + i * 16, 108, 8, i + 1)), greyed(bell(80, 110, 30, 95, 5, 18, C.dark, 'none', 1.8))),
  /** diskret (math): orange dots at 1, 2, 3, 4, 5, 6 on a number line with clear gaps between them; below it a grey unbroken line for contrast. */
  'prob.diskret.3': all(bg(), line('M10 50 L110 50', C.ink, 1.4), ...range(6).map((i) => circle(18 + i * 17, 50, 4.5, HL, C.ink, 1.2) + num(18 + i * 17, 70, String(i + 1), 10)), ...range(5).map((i) => line(`M${f1(27 + i * 17)} 40 L${f1(27 + i * 17)} 60`, C.grey2, 1, '2 2')), greyed(line('M18 96 L103 96', C.dark, 6), num(18, 110, '1', 9), num(103, 110, '6', 9))),

  // ── 3247 Väntevärde och varians ──────────────────────────────────────
  /** väntevärde: a plank with stacks of blocks like a bar chart balancing on an orange triangle at 3,5; numbers 1–6 under the plank. */
  'prob.väntevärde': all(bg(), rect(10, 70, 100, 5, C.brown, 1, C.ink, 1.4), ...[1, 2, 3, 3, 2, 1].flatMap((h, i) => range(h).map((j) => rect(13 + i * 16, 60 - j * 10, 14, 10, C.sky, 1, C.ink, 1))), path('M60 75 L50 100 L70 100 Z', HL, C.ink, 1.6), rect(46, 100, 28, 12, MARK, 2, HL, 1.6), num(60, 110, '3,5', 9, HL), line('M60 20 L60 66', HL, 1.2, '3 3')),
  /** varians: dots above and below a dashed mean line; from each dot to the line an orange square is drawn whose side is the distance to the line. */
  'prob.varians': (() => { const pts: [number, number][] = [[18, 30], [38, 72], [58, 44], [78, 84], [98, 50]]; const m = 60; return all(bg(), line('M8 60 L112 60', C.ink, 1.8, '5 4'), ...pts.map(([x, y]) => { const d = Math.abs(y - m); return rect(f1(x), f1(Math.min(y, m)), f1(d), f1(d), TINT, 0, HL, 1.8); }), ...pts.map(([x, y]) => circle(x, y, 4, BLUE, C.ink, 1.2))); })(),
  /** standardavvikelse: a grey bell curve; orange arrows go from the middle to one step left and one step right, with the band between them shaded and σ written on each arrow. */
  'prob.standardavvikelse': all(bg(), axes(10, 100, 102, 88), (() => { const p = bellPts(45, 77, 100, 61, 16, 74); return path(`M45 100 ${p.map(([x, y]) => `L${x} ${y}`).join(' ')} L77 100 Z`, TINT, null); })(), bell(12, 110, 100, 61, 16, 74, C.grey, 'none', 2.6), line('M61 26 L61 100', C.ink, 1.4, '3 3'), line('M45 52 L45 100 M77 52 L77 100', HL, 1.4, '3 3'), arrow(61, 64, 46, 64, HL, 2.6), arrow(61, 64, 76, 64, HL, 2.6), num(53, 58, 'σ', 11, HL), num(69, 58, 'σ', 11, HL)),
  /** insats (in a game): a green game table with a marked square; a hand pushes a stack of coins onto it (orange arrow). */
  'prob.insats.2': all(bg(), rect(4, 46, 112, 66, FELT, 3, C.ink, 1.6), rect(52, 66, 40, 30, 'none', 3, C.white, 2), rect(56, 70, 32, 22, MARK, 2, HL, 2.2), ...range(4).map((i) => ellipse(72, 86 - i * 4, 10, 3.6, C.gold, C.ink, 1.2)), ...range(3).map((i) => ellipse(22, 90 - i * 4, 10, 3.6, C.gold, C.ink, 1.2)), arrow(34, 82, 54, 82, HL, 3), coin(28, 26, 12, '1'), coin(52, 22, 10, 'k')),
  /** vinst (in a game): a scratched lottery ticket with three stars leads by an arrow to a happy person with a pile of banknotes and sparkles. */
  'prob.vinst.2': all(bg(), rect(8, 30, 30, 44, C.white, 3, C.ink, 1.6), ...[0, 1, 2].map((i) => star(23, 40 + i * 12, 5, C.yellow)), arrow(42, 52, 54, 52, HL, 2.6), g('translate(86 90) scale(1.7)', mini(0, 0, C.orange)), note(80, 40, -10), note(88, 32, 8), note(78, 26, -2), sparkle(62, 22, 6), sparkle(110, 18, 6), sparkle(110, 50, 5), sparkle(60, 70, 4)),
  /** skraplott: a lottery card with a silver field; part of the silver has been scratched off by a coin to show symbols underneath, with small flakes. */
  'prob.skraplott': all(bg(), rect(12, 14, 96, 70, '#fde9b0', 4, C.ink, 1.8), rect(20, 30, 80, 40, C.silver, 3, C.ink, 1.2), rect(20, 30, 46, 40, C.white, 3, null), star(32, 50, 6.5, C.yellow), star(52, 50, 6.5, C.yellow), path('M66 30 L70 36 L65 42 L71 48 L66 56 L70 62 L66 70', 'none', C.ink, 1), g('translate(86 82) rotate(-25)', ellipse(0, 0, 14, 5, C.gold, C.ink, 1.6)), ...[[60, 92], [68, 96], [56, 100], [74, 102]].map(([x, y]) => rect(x!, y!, 3, 2, C.silver, 0.5, null))),
};
