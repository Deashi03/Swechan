/**
 * Samhälle & institutioner → Ekonomi & arbetsliv → Privatekonomi, 1501–1507 (0.32): income and
 * expenses, budget and saving, interest and inflation in everyday life, loans and amortisation,
 * insurance, income tax and economic priorities. Most words are abstract, so the pictures are small
 * symbolic scenes built from a few recurring signs: gold coins and stacks (money), a wallet (one's own
 * money), green and red bars (in / out), a bank (columns and a coin on the gable), an authority (office
 * block with a flag, here the tax office), a navy shield (insurance), the % sign (interest), price
 * tags with arrows (prices), and a grey reference where a contrast helps. Amounts are digits only.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Geometry and figures ─────────────────────────────────────────────
const RED = '#e8302c';
const f1 = (n: number) => n.toFixed(1);
const ground = line('M4 112 L116 112', C.grey2, 2);
/** Head and shoulder positions of a standing figure (figures.ts) at x with height factor h. */
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, hy: ty - 56 * s, hr: 10 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const hnd = (x: number, y: number, r = 3) => circle(x, y, r, C.skin, C.ink, 1.2);
/** An arm that starts at the shoulder (side −1 = picture-left, 1 = picture-right) and ends in a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q0 = geo(x, h); return all(arm(side < 0 ? q0.sl : q0.sr, q0.sy, tx, ty), hnd(tx, ty, 3 * Math.max(0.7, h))); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Speech or thought bubble beside the head of the figure at x (side 1 = right of the head). */
const think = (x: number, h: number, side: 1 | -1, w: number, hh: number, inner: (cx: number, cy: number) => Svg, dy = 0) => {
  const k = geo(x, h), cx = x + side * (k.hr + 8 + w / 2), cy = k.hy - 10 + dy;
  return all(ellipse(cx, cy, w / 2, hh / 2, C.white, C.ink, 1.5), circle(x + side * (k.hr + 3), k.hy - 2, 1.8, C.white, C.ink, 1), circle(x + side * (k.hr + 6), k.hy - 6, 2.6, C.white, C.ink, 1.1), inner(cx, cy));
};

// ── Marks ────────────────────────────────────────────────────────────
const pct = (x: number, y: number, sz = 14, col: string = C.navy) => T(x, y + sz * 0.36, '%', sz, col);
const plusB = (x: number, y: number, r = 8, col: string = C.green) => all(circle(x, y, r, col, C.ink, 1.2), line(`M${f1(x - r * 0.5)} ${y} L${f1(x + r * 0.5)} ${y} M${x} ${f1(y - r * 0.5)} L${x} ${f1(y + r * 0.5)}`, C.white, r * 0.28));
const minusB = (x: number, y: number, r = 8, col: string = RED) => all(circle(x, y, r, col, C.ink, 1.2), line(`M${f1(x - r * 0.5)} ${y} L${f1(x + r * 0.5)} ${y}`, C.white, r * 0.28));
const okB = (x: number, y: number, r = 8) => all(circle(x, y, r, C.green, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, r * 0.22));
const noB = (x: number, y: number, r = 8) => all(circle(x, y, r, RED, C.ink, 1.2), line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, C.white, r * 0.22));
const cross = (x: number, y: number, s = 1, col: string = RED) => line(`M${x - 6 * s} ${y - 6 * s} L${x + 6 * s} ${y + 6 * s} M${x + 6 * s} ${y - 6 * s} L${x - 6 * s} ${y + 6 * s}`, col, 2.6 * s);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const ex = (x: number, y: number, sz = 14, col: string = RED) => T(x, y + sz * 0.36, '!', sz, col);
const q = (x: number, y: number, sz = 13, col: string = C.navy) => T(x, y + sz * 0.36, '?', sz, col);
const para = (x: number, y: number, sz = 14, col: string = C.navy) => T(x, y + sz * 0.36, '§', sz, col);
/** Dashed limit line. */
const limit = (x1: number, x2: number, y: number, col: string = C.ink) => line(`M${x1} ${y} L${x2} ${y}`, col, 1.8, '4 3');
const curveArrow = (d: string, ex2: number, ey: number, ang: number, col: string = HL, w = 2) => all(line(d, col, w), g(`translate(${ex2} ${ey}) rotate(${ang})`, path('M0 0 L-6 -3.4 L-6 3.4 Z', col, null)));

// ── Money ────────────────────────────────────────────────────────────
/** A gold coin seen from the front. */
const coin = (x: number, y: number, r = 6, col: string = C.gold) => all(circle(x, y, r, col, C.ink, 1.2), circle(x, y, r * 0.6, 'none', '#b88a20', 1));
/** A stack of n flat coins standing on y. */
const stack = (x: number, y: number, n = 4, r = 8, col: string = C.gold) => all(...Array.from({ length: n }, (_, i) => ellipse(x, y - 3 - i * 3.4, r, r * 0.42, col, C.ink, 1.1)));
/** A stack drawn as a column of coins of height h (for bar charts of money). */
const column = (x: number, base: number, h: number, w = 16, col: string = C.gold) => { const n = Math.max(1, Math.round(h / 4)); return all(...Array.from({ length: n }, (_, i) => ellipse(x, base - 2 - i * (h / n), w / 2, 3, col, C.ink, 1))); };
/** A bank note. */
const bill = (x: number, y: number, s = 1, col = '#8fc79a', rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-16, -9, 32, 18, col, 2, C.ink, 1.3), circle(0, 0, 5, 'rgba(255,255,255,0.55)', C.ink, 0.8), rect(-13, -6, 26, 12, 'none', 1, 'rgba(255,255,255,0.6)', 0.8));
const wallet = (x: number, y: number, s = 1, col = '#7a4a2a') => g(`translate(${x} ${y}) scale(${s})`, rect(-18, -12, 36, 24, col, 3, C.ink, 1.6), rect(6, -5, 12, 10, '#5a3a1a', 2, C.ink, 1), circle(12, 0, 1.6, C.gold, null));
const openWallet = (x: number, y: number, s = 1, col = '#7a4a2a') => g(`translate(${x} ${y}) scale(${s})`, path('M-18 -4 L-14 -16 L14 -16 L18 -4 Z', '#5a3a1a', C.ink, 1.4), rect(-18, -6, 36, 20, col, 3, C.ink, 1.6));
/** A glass jar; `fill` 0–1 is the height of the coins inside. */
const jar = (x: number, y: number, s = 1, fill = 0.5) => { const h = 34 * fill; return g(`translate(${x} ${y}) scale(${s})`, rect(-14, -20, 28, 38, 'rgba(220,240,252,0.55)', 5, C.ink, 1.6), fill > 0 ? rect(-12, 16 - h, 24, h, C.gold, 3, '#b88a20', 1) : '', ...Array.from({ length: Math.floor(h / 6) }, (_, i) => line(`M-10 ${f1(14 - i * 6)} L10 ${f1(14 - i * 6)}`, '#b88a20', 0.9)), rect(-12, -25, 24, 6, C.brown, 2, C.ink, 1.3)); };
/** A shopping bag. */
const bag = (x: number, y: number, s = 1, col: string = C.orange) => g(`translate(${x} ${y}) scale(${s})`, path('M-5 -12 C-5 -20 5 -20 5 -12', 'none', C.ink, 1.6), path('M-11 -12 L11 -12 L13 12 L-13 12 Z', col, C.ink, 1.5));
/** A bill (invoice) sheet with lines and a coin. */
const invoice = (x: number, y: number, s = 1, mark: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-12, -16, 24, 32, C.white, 2, C.ink, 1.4), line('M-7 -9 L7 -9 M-7 -3 L7 -3 M-7 3 L3 3', C.grey2, 2), coin(5, 10, 3.6), mark);
/** A price tag with a value; `col` is the tag colour. */
const tag = (x: number, y: number, v: string, s = 1, col = '#f6e08a', rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-14 -9 L8 -9 L15 0 L8 9 L-14 9 Z', col, C.ink, 1.3), circle(9, 0, 1.6, C.white, C.ink, 0.8), T(-3, 4, v, 10));
/** A simple calculator. */
const calc = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-11, -15, 22, 30, C.dark, 3, C.ink, 1.4), rect(-8, -12, 16, 7, '#bfe3a0', 1, null), ...Array.from({ length: 9 }, (_, i) => rect(-8 + (i % 3) * 6, -2 + Math.floor(i / 3) * 5, 4, 3.4, C.grey2, 0.8, null)));
/** A small month calendar page; `inner` drawn at the page centre. */
const page = (x: number, y: number, s = 1, inner: Svg = '', head: string = RED) => g(`translate(${x} ${y}) scale(${s})`, rect(-12, -14, 24, 28, C.white, 2, C.ink, 1.3), rect(-12, -14, 24, 6, head, 2, C.ink, 1.3), inner);
/** A sheet of paper with text lines; `marks` in the sheet's own coordinates (−14…14, −18…18). */
const doc = (x: number, y: number, s = 1, marks: Svg = '', n = 5, col: string = C.grey2, fill: string = C.white) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -18, 28, 36, fill, 2, C.ink, 1.6), ...Array.from({ length: n }, (_, i) => line(`M-9 ${-11 + i * 6} L9 ${-11 + i * 6}`, col, 2)), marks);
const envelope = (x: number, y: number, s = 1, inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -9, 28, 18, C.white, 2, C.ink, 1.5), path('M-14 -9 L0 2 L14 -9', 'none', C.ink, 1.3), inner);
const mag = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 8, 'rgba(220,240,252,0.7)', C.ink, 2), line('M5.6 5.6 L12 12', C.ink, 3));
const padlock = (x: number, y: number, s = 1, col: string = C.gold) => g(`translate(${x} ${y}) scale(${s})`, path('M-6 -4 L-6 -10 C-6 -18 6 -18 6 -10 L6 -4', 'none', C.ink, 2.4), rect(-9, -4, 18, 14, col, 2, C.ink, 1.5), circle(0, 3, 2, C.ink, null));
const scales = (x: number, y: number, s = 1, tilt = 0, l: Svg = '', r: Svg = '') => { const a = (tilt * Math.PI) / 180, dx = 22 * Math.cos(a), dy = 22 * Math.sin(a); const pan = (px: number, py: number, k: Svg) => all(line(`M${f1(px)} ${f1(py)} L${f1(px - 9)} ${f1(py + 12)} M${f1(px)} ${f1(py)} L${f1(px + 9)} ${f1(py + 12)}`, C.ink, 0.9), path(`M${f1(px - 12)} ${f1(py + 12)} C${f1(px - 9)} ${f1(py + 18)} ${f1(px + 9)} ${f1(py + 18)} ${f1(px + 12)} ${f1(py + 12)} Z`, C.gold, C.ink, 1.2), g(`translate(${f1(px)} ${f1(py + 6)})`, k)); return g(`translate(${x} ${y}) scale(${s})`, line('M0 -12 L0 26 M-10 26 L10 26', C.ink, 2.4), line(`M${f1(-dx)} ${f1(-12 - dy)} L${f1(dx)} ${f1(-12 + dy)}`, C.ink, 2.2), circle(0, -13, 2.6, C.gold, C.ink, 1), pan(-dx, -12 - dy, l), pan(dx, -12 + dy, r)); };

// ── Places and things ────────────────────────────────────────────────
const house = (x: number, y: number, s = 1, col = '#e8a07a') => g(`translate(${x} ${y}) scale(${s})`, path('M-14 -2 L0 -14 L14 -2 Z', RED, C.ink, 1.3), rect(-11, -2, 22, 16, col, 1, C.ink, 1.3), rect(-3, 5, 6, 9, C.brown, 0.5, C.ink, 0.8), rect(5, 1, 4, 4, '#9ad0f0', 0.5, C.ink, 0.6));
const car = (x: number, y: number, s = 1, col: string = '#3a7bd5') => g(`translate(${x} ${y}) scale(${s})`, path('M-22 4 L-20 -4 L-12 -6 L-6 -14 L10 -14 L16 -6 L22 -4 L22 4 Z', col, C.ink, 1.5), path('M-4 -12 L8 -12 L12 -6 L-8 -6 Z', '#bfe3f5', C.ink, 1), circle(-12, 5, 5, C.dark, C.ink, 1.2), circle(12, 5, 5, C.dark, C.ink, 1.2), circle(-12, 5, 2, C.grey, null), circle(12, 5, 2, C.grey, null));
const bus = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -10, 28, 18, '#e2574c', 3, C.ink, 1.3), rect(-11, -7, 9, 6, '#bfe3f5', 1, null), rect(2, -7, 9, 6, '#bfe3f5', 1, null), circle(-8, 9, 3, C.dark, null), circle(8, 9, 3, C.dark, null));
const phone = (x: number, y: number, s = 1, inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-9, -15, 18, 30, C.dark, 3, C.ink, 1.4), rect(-7, -12, 14, 22, '#dff0fa', 1, null), inner);
const food = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-12 -2 L12 -2 L9 12 L-9 12 Z', '#c99a5b', C.ink, 1.4), circle(-5, -5, 5, C.red, C.ink, 1), path('M2 -2 L4 -14 L8 -2 Z', C.orange, C.ink, 1), ellipse(8, -5, 4, 3, C.green, C.ink, 1));
const shirt = (x: number, y: number, s = 1, col: string = C.purple) => g(`translate(${x} ${y}) scale(${s})`, path('M-6 -12 L-14 -8 L-12 -1 L-8 -3 L-8 12 L8 12 L8 -3 L12 -1 L14 -8 L6 -12 C4 -9 -4 -9 -6 -12 Z', col, C.ink, 1.3));
const sofa = (x: number, y: number, s = 1, col = '#5b8fc7') => g(`translate(${x} ${y}) scale(${s})`, rect(-20, -12, 40, 12, col, 3, C.ink, 1.4), rect(-24, -6, 48, 12, col, 3, C.ink, 1.4), rect(-24, -8, 7, 14, col, 2, C.ink, 1.3), rect(17, -8, 7, 14, col, 2, C.ink, 1.3), line('M-20 6 L-20 10 M20 6 L20 10', C.ink, 2));
const bike = (x: number, y: number, s = 1, col: string = C.green) => g(`translate(${x} ${y}) scale(${s})`, circle(-11, 4, 7, 'none', C.ink, 1.8), circle(11, 4, 7, 'none', C.ink, 1.8), path('M-11 4 L-4 -8 L8 -8 L11 4 M-4 -8 L0 4 L8 -8 M-6 -11 L-2 -11 M8 -8 L7 -13 L11 -13', 'none', col, 2));
const washer = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -16, 28, 32, C.white, 2, C.ink, 1.5), line('M-14 -9 L14 -9', C.ink, 1.2), circle(0, 4, 8, '#bfe3f5', C.ink, 1.4), circle(8, -12.5, 1.6, C.grey, null));
const glasses = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(-7, 0, 5.5, 'rgba(220,240,252,0.7)', C.ink, 1.6), circle(7, 0, 5.5, 'rgba(220,240,252,0.7)', C.ink, 1.6), line('M-1.5 0 L1.5 0 M-12.5 -1 L-15 -4 M12.5 -1 L15 -4', C.ink, 1.4));
const plane = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-14 0 C-14 -2 10 -3 14 0 C10 3 -14 2 -14 0 Z', C.white, C.ink, 1.4), path('M-2 -1 L-8 -12 L-4 -12 L4 -1 Z M-2 1 L-8 10 L-4 10 L4 1 Z', C.sky, C.ink, 1));
const briefcase = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-4 -10 L-4 -13 L4 -13 L4 -10', 'none', C.ink, 1.6), rect(-12, -10, 24, 18, C.brown, 2, C.ink, 1.4), line('M-12 -3 L12 -3', C.ink, 1));
const cart = (x: number, y: number, s = 1, inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, inner, path('M-20 -14 L-14 -14 L-10 6 L14 6 L18 -8 L-12 -8', 'none', C.ink, 2), circle(-8, 11, 3, C.dark, null), circle(12, 11, 3, C.dark, null));
const jacket = (x: number, y: number, s = 1, col: string = '#2f6fb0') => g(`translate(${x} ${y}) scale(${s})`, path('M-6 -14 L-15 -9 L-16 12 L-10 12 L-10 0 L-9 14 L9 14 L10 0 L10 12 L16 12 L15 -9 L6 -14 C3 -10 -3 -10 -6 -14 Z', col, C.ink, 1.4), line('M0 -11 L0 14', C.ink, 1.2), path('M-6 -14 C-4 -18 4 -18 6 -14', C.white, C.ink, 1.2));
const cake = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ellipse(0, 10, 16, 4, C.white, C.ink, 1.2), rect(-12, -4, 24, 13, '#f3c2d0', 2, C.ink, 1.3), rect(-12, -8, 24, 5, C.white, 2, C.ink, 1.2), circle(0, -11, 3, C.red, C.ink, 1));
const flower = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L0 12', C.green, 2), ...[0, 72, 144, 216, 288].map((a) => circle(+f1(Math.sin((a * Math.PI) / 180) * 4), +f1(-Math.cos((a * Math.PI) / 180) * 4), 3, C.yellow, C.ink, 0.8)), circle(0, 0, 2.4, C.orange, null));
const laptop = (x: number, y: number, s = 1, inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-16, -20, 32, 20, C.dark, 2, C.ink, 1.4), rect(-13, -17, 26, 14, '#dff0fa', 1, null), inner, path('M-20 0 L20 0 L22 4 L-22 4 Z', C.grey, C.ink, 1.3));
const weight = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-5 -14 C-5 -20 5 -20 5 -14', 'none', C.ink, 2.4), path('M-12 -12 L12 -12 L16 10 L-16 10 Z', C.dark, C.ink, 1.5));
const plaster = (x: number, y: number, rot = -30) => g(`translate(${x} ${y}) rotate(${rot})`, rect(-8, -3, 16, 6, C.beige, 3, C.ink, 1.1), rect(-2.5, -3, 5, 6, '#f0e2c8', 1, null));
const flame = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -10 C6 -4 8 0 6 5 C4 9 -4 9 -6 5 C-8 0 -3 -3 -2 -7 C-1 -3 1 -3 0 -10 Z', C.orange, C.ink, 1), path('M0 -1 C3 2 3 5 0 6 C-3 5 -3 2 0 -1 Z', C.yellow, null));
const thief = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(0, -4, 7, C.skin, C.ink, 1.2), path('M-7 -6 L7 -6 L7 -2 L-7 -2 Z', C.dark, null), circle(-3, -4, 1.2, C.white, null), circle(3, -4, 1.2, C.white, null), path('M-9 12 C-9 4 9 4 9 12 Z', C.dark, C.ink, 1.2));
const brokenGlass = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-9, -8, 18, 16, '#bfe3f5', 1, C.ink, 1.3), line('M-2 -8 L1 -2 L-4 2 L0 8 M1 -2 L9 -1', C.ink, 1.1));
const crash = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -10 L3 -4 L10 -6 L5 0 L10 5 L3 4 L0 10 L-3 4 L-10 5 L-5 0 L-10 -6 L-3 -4 Z', C.yellow, C.ink, 1.2));
const child = (x: number, top: string = C.yellow, mood: Mood = 'smile') => fig(x, top, mood, { h: 0.55 });

/** A bank: columns, steps and a coin on the gable (no flag – it is not an authority). */
const bank = (x: number, y: number, s = 1, col = '#e8e2d4') => g(`translate(${x} ${y}) scale(${s})`, rect(-26, 14, 52, 6, C.grey2, 1, C.ink, 1.2), rect(-22, -6, 44, 20, col, 1, C.ink, 1.4), path('M-26 -6 L0 -22 L26 -6 Z', col, C.ink, 1.4), ...[-15, -5, 5, 15].map((cx) => rect(cx - 2.2, -4, 4.4, 18, C.white, 1, C.ink, 0.9)), coin(0, -11, 4.2));
/** Swedish flag; (x, y) is the top-left corner. */
const flagSE = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(0, 0, 20, 13, '#2a6ebb', 0.5, C.ink, 1), rect(6, 0, 3.4, 13, '#f7cf2e', 0, null), rect(0, 4.8, 20, 3.4, '#f7cf2e', 0, null), rect(0, 0, 20, 13, 'none', 0.5, C.ink, 1));
/** An authority (the tax office): office block with a flag. */
const office = (x: number, y: number, s = 1, col = '#cfd8e2') => g(`translate(${x} ${y}) scale(${s})`, rect(-18, -26, 36, 46, col, 1.5, C.ink, 1.4), ...Array.from({ length: 9 }, (_, i) => rect(-13 + (i % 3) * 10, -21 + Math.floor(i / 3) * 11, 6, 7, '#9ad0f0', 0.5, C.ink, 0.6)), rect(-5, 8, 10, 12, C.brown, 0.5, C.ink, 1), line('M12 -26 L12 -40', C.ink, 1.4), flagSE(12, -40, 0.55));
/** The central bank: a bank with a flag. */
const centralBank = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, bank(0, 0, 1, '#e9dcb8'), line('M0 -22 L0 -36', C.ink, 1.4), flagSE(0, -36, 0.6));
/** A town hall (the municipality): a small building with a clock tower. */
const townHall = (x: number, y: number, s = 1, col = '#f0d9b5') => g(`translate(${x} ${y}) scale(${s})`, rect(-20, -6, 40, 26, col, 1, C.ink, 1.4), rect(-6, -24, 12, 18, col, 1, C.ink, 1.4), path('M-8 -24 L0 -32 L8 -24 Z', RED, C.ink, 1.2), circle(0, -16, 3.4, C.white, C.ink, 0.9), rect(-4, 8, 8, 12, C.brown, 0.5, C.ink, 0.9), rect(-16, 0, 6, 6, '#9ad0f0', 0.5, C.ink, 0.6), rect(10, 0, 6, 6, '#9ad0f0', 0.5, C.ink, 0.6));
/** A company / employer: warm block with a sawtooth roof. */
const company = (x: number, y: number, s = 1, col = '#e9c27a') => g(`translate(${x} ${y}) scale(${s})`, path('M-22 -14 L-22 -26 L-11 -18 L-11 -26 L0 -18 L0 -26 L11 -18 L22 -18 L22 22 L-22 22 Z', col, C.ink, 1.4), ...[-14, -4, 6, 16].map((cx) => rect(cx - 3, -8, 6, 7, '#9ad0f0', 0.5, C.ink, 0.6)), rect(-5, 9, 10, 13, C.brown, 0.5, C.ink, 1));
/** The parliament (the state). */
const parliament = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-30, 10, 60, 5, C.grey2, 1, C.ink, 1.2), rect(-27, -10, 54, 20, '#efe6d2', 1, C.ink, 1.4), path('M-30 -10 L0 -24 L30 -10 Z', '#e2d6bc', C.ink, 1.4), ...[-20, -10, 0, 10, 20].map((cx) => rect(cx - 2, -8, 4, 18, C.white, 1, C.ink, 0.8)), line('M0 -24 L0 -36', C.ink, 1.4), flagSE(0, -36, 0.55));
/** Insurance: a navy shield, optionally with something inside. */
const shield = (x: number, y: number, s = 1, col: string = C.navy, inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, path('M0 -16 L14 -11 C14 4 8 12 0 17 C-8 12 -14 4 -14 -11 Z', col, C.ink, 1.6), inner);
/** A big translucent shield arching over a scene centred at x, from top y to the ground. */
const dome = (x: number, top: number, w: number) => path(`M${x - w / 2} 112 L${x - w / 2} ${top + 26} C${x - w / 2} ${top + 6} ${x - w / 4} ${top} ${x} ${top} C${x + w / 4} ${top} ${x + w / 2} ${top + 6} ${x + w / 2} ${top + 26} L${x + w / 2} 112`, 'rgba(47,74,122,0.12)', C.navy, 2.4);
/** The insurance company: an office with a shield sign and no flag. */
const insurer = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-18, -26, 36, 46, '#dfe6ee', 1.5, C.ink, 1.4), ...Array.from({ length: 6 }, (_, i) => rect(-13 + (i % 3) * 10, -10 + Math.floor(i / 3) * 10, 6, 6, '#9ad0f0', 0.5, C.ink, 0.6)), rect(-5, 8, 10, 12, C.brown, 0.5, C.ink, 1), shield(0, -18, 0.42));
/** A bar chart of n bars; `hs` heights, `cols` colours. */
const bars = (x: number, base: number, w: number, gap: number, hs: number[], cols: string[]) => all(...hs.map((h, i) => rect(x + i * (w + gap), base - h, w, h, cols[i % cols.length]!, 1, C.ink, 1.3)));
/** A small house-hold budget sheet: icon rows with bars. */
const budgetSheet = (x: number, y: number, s = 1, lens: number[] = [16, 10, 6], col: string = C.green) => g(`translate(${x} ${y}) scale(${s})`, rect(-20, -26, 40, 52, C.white, 2, C.ink, 1.6), g('translate(-12 -14) scale(0.45)', house(0, 0)), g('translate(-12 0) scale(0.4)', food(0, 0)), g('translate(-12 14) scale(0.45)', bus(0, 0)), ...lens.map((l, i) => rect(-4, -18 + i * 14, l, 6, col, 1, C.ink, 0.8)), line('M-16 22 L16 22', C.grey2, 1.4));

export const PRIVATE_ECONOMY_MOTIFS: Record<string, Svg> = {
  // ── Inkomster och utgifter ──
  'pek.utgift': all(fig(30, C.orange, 'calm', { h: 0.8 }), reach(30, 0.8, 1, 48, 66), openWallet(56, 70, 0.6), curveArrow('M62 56 C72 40 84 38 92 46', 92, 46, 40, RED, 2.4), coin(72, 40, 4.5), coin(82, 36, 4.5), invoice(100, 76, 1), bag(98, 102, 0.6), ground),
  'pek.fast-utgift': all(...[0, 1, 2].map((i) => page(24 + i * 36, 30, 1.1, '')), ...[0, 1, 2].map((i) => column(24 + i * 36, 102, 34, 18)), limit(10, 110, 66, C.green), ...[0, 1, 2].map((i) => g(`translate(${24 + i * 36} 33) scale(0.42)`, house(0, 0))), ground),
  'pek.rörlig-utgift': all(...[0, 1, 2].map((i) => page(24 + i * 36, 30, 1.1, '')), column(24, 102, 20, 18), column(60, 102, 44, 18), column(96, 102, 30, 18), ...[0, 1, 2].map((i) => g(`translate(${24 + i * 36} 33) scale(0.4)`, food(0, 0))), curveArrow('M30 66 C40 52 48 52 54 54', 54, 54, 15, HL, 1.8), curveArrow('M68 54 C76 58 84 66 90 68', 90, 68, 30, HL, 1.8), ground),
  'pek.hushållsekonomi': all(path('M14 56 L60 18 L106 56 Z', RED, C.ink, 1.6), rect(20, 56, 80, 56, '#f3dcc4', 1, C.ink, 1.6), fig(38, C.orange, 'smile', { h: 0.55 }), child(54), budgetSheet(84, 84, 0.6), arrow(4, 40, 20, 40, C.green, 2.6), coin(10, 32, 4), arrow(104, 40, 116, 40, RED, 2.6), coin(112, 32, 4)),
  'pek.levnadskostnad': all(fig(60, C.orange, 'calm', { h: 0.62 }), house(20, 30, 1), food(100, 30, 1), bus(20, 82, 1), phone(100, 80, 0.8), ...[[30, 44], [90, 44], [32, 70], [88, 70]].map(([a, b]) => line(`M${a} ${b} L${a! < 60 ? 48 : 72} ${b! < 60 ? 54 : 64}`, C.grey, 1.4, '3 2')), coin(36, 18, 4.5), coin(110, 16, 4.5), coin(36, 96, 4.5), coin(112, 98, 4.5), ground),
  'pek.disponibel-inkomst': all(column(30, 104, 64, 22), g('translate(0 0)', rect(18, 34, 24, 22, 'rgba(154,163,173,0.85)', 2, C.ink, 1)), arrow(44, 40, 66, 30, C.grey, 2), office(88, 46, 0.6), curveArrow('M42 80 C56 86 64 92 70 94', 70, 94, 20, C.green, 2.4), openWallet(90, 96, 0.8), stack(90, 92, 3, 7), ring(90, 92, 18), ground),
  'pek.inkomstkälla': all(briefcase(22, 30, 1), arrow(34, 36, 50, 56, C.green, 2.4), house(22, 66, 0.9), arrow(36, 66, 50, 70, C.green, 2.4), child(18, C.yellow), arrow(30, 96, 50, 84, C.green, 2.4), wallet(78, 74, 1.1), ring(22, 30, 15), coin(98, 50, 5), ground),
  'pek.extrainkomst': all(greyed(column(26, 104, 56, 22)), column(64, 104, 22, 18), plusB(64, 70, 8), arrow(84, 70, 70, 74, HL, 2.2), fig(98, C.orange, 'laugh', { h: 0.72 }), bag(110, 104, 0.45), ring(64, 90, 18), ground),
  'pek.bidrag': all(office(24, 86, 0.75), curveArrow('M40 46 C54 30 70 34 74 48', 74, 48, 70, C.green, 2.4), coin(52, 34, 4.5), coin(62, 32, 4.5), fig(84, C.orange, 'smile', { h: 0.78 }), child(106, C.yellow), ground),
  'pek.försörjningsstöd': all(townHall(26, 90, 0.9), curveArrow('M44 60 C56 46 70 46 78 56', 78, 56, 50, C.green, 2.4), coin(60, 46, 4.5), fig(90, C.orange, 'frown', { h: 0.8 }), openWallet(110, 92, 0.45), house(74, 24, 0.6), food(106, 24, 0.6), ground),
  'pek.gå-plus': all(bars(24, 104, 24, 10, [70, 40], [C.green, RED]), stack(70, 72, 3, 9), limit(58, 82, 64, C.green), plusB(96, 30, 13), fig(100, C.orange, 'laugh', { h: 0.6 }), ground),
  'pek.gå-minus': all(bars(24, 104, 24, 10, [40, 70], [C.green, RED]), limit(20, 50, 64, RED), minusB(96, 30, 13), fig(100, C.orange, 'frown', { h: 0.6 }), ground),
  'pek.spendera': all(fig(54, C.orange, 'laugh', { h: 0.85 }), reach(54, 0.85, -1, 30, 72), bag(26, 86, 0.9, C.orange), bag(82, 88, 0.9, C.purple), reach(54, 0.85, 1, 80, 74), coin(30, 44, 5), coin(20, 30, 5), coin(36, 22, 5), curveArrow('M42 56 C36 44 30 36 22 22', 22, 22, 240, RED, 1.8), ground),
  'pek.lägga-pengar-på': all(fig(22, C.orange, 'smile', { h: 0.78 }), reach(22, 0.78, 1, 40, 62), coin(44, 58, 5), curveArrow('M50 54 C60 44 66 44 72 50', 72, 50, 40, HL, 2.2), stack(58, 46, 2, 6), shirt(78, 72, 1.1), shirt(98, 74, 1.1, C.green), shirt(88, 96, 1.1, C.red), shirt(106, 98, 1, C.yellow), ground),

  // ── Budget och sparande ──
  'pek.budget': all(budgetSheet(52, 60, 1.6, [22, 14, 8]), g('translate(100 64) rotate(30)', rect(-2, -16, 4, 26, C.navy, 1, C.ink, 1), path('M-2 10 L0 15 L2 10 Z', C.tan, C.ink, 0.8)), stack(98, 104, 3, 9)),
  'pek.hushållsbudget': all(path('M14 50 L60 12 L106 50 Z', RED, C.ink, 1.6), rect(20, 50, 80, 62, '#f3dcc4', 1, C.ink, 1.6), budgetSheet(60, 80, 1, [20, 12, 8])),
  'pek.budgetera': all(fig(20, C.orange, 'calm', { h: 0.74 }), reach(20, 0.74, 1, 38, 50), coin(40, 48, 4.5), ...[0, 1, 2].map((i) => envelope(66, 36 + i * 28, 1.1)), g('translate(66 40) scale(0.36)', house(0, 0)), g('translate(66 68) scale(0.33)', food(0, 0)), g('translate(66 96) scale(0.36)', bus(0, 0)), stack(98, 46, 4, 7), stack(98, 74, 3, 7), stack(98, 102, 2, 7), ground),
  'pek.räkna-på': all(fig(26, C.orange, 'calm', { h: 0.82 }), reach(26, 0.82, 1, 46, 74), calc(54, 74, 1.1), think(26, 0.82, 1, 56, 36, (cx, cy) => all(car(cx - 6, cy + 2, 0.7), q(cx + 18, cy - 4, 12))), ground),
  'pek.överskott': all(invoice(20, 40, 1, all(circle(0, 0, 8, 'none', C.green, 2), line('M-4 0 L-1 3 L4 -3', C.green, 2))), invoice(46, 40, 1, all(circle(0, 0, 8, 'none', C.green, 2), line('M-4 0 L-1 3 L4 -3', C.green, 2))), invoice(72, 40, 1, all(circle(0, 0, 8, 'none', C.green, 2), line('M-4 0 L-1 3 L4 -3', C.green, 2))), stack(60, 104, 5, 12), ring(60, 92, 22, C.green), plusB(96, 84, 9), ground),
  'pek.underskott': all(invoice(24, 40, 1), invoice(52, 40, 1), invoice(80, 40, 1), stack(40, 104, 2, 12), rect(66, 80, 26, 24, 'none', 3, RED, 2), line('M66 80 L92 80', RED, 2, '4 3'), q(79, 92, 16, RED), minusB(104, 70, 8), ground),
  'pek.sparande': all(jar(30, 82, 0.8, 0.25), jar(62, 78, 0.9, 0.5), jar(96, 74, 1, 0.85), arrow(20, 30, 100, 18, C.green, 2.6), ground),
  'pek.oförutsedd': all(washer(36, 94, 1.1), path('M24 74 L30 82 L26 86 L34 94', 'none', C.ink, 1.6), crash(52, 70, 1), fig(92, C.orange, 'shock', { h: 0.8 }), ex(76, 24, 18), invoice(34, 40, 0.8), ground),
  'pek.sparmål': all(jar(44, 76, 1.5, 0.55), limit(16, 72, 36, HL), plane(92, 34, 1.1), arrow(76, 36, 70, 36, HL, 2), arrow(44, 66, 44, 46, C.green, 2.4), ground),
  'pek.spara-ihop': all(jar(22, 92, 0.6, 0.2), jar(52, 88, 0.7, 0.55), jar(84, 84, 0.8, 0.95), arrow(34, 60, 72, 50, C.green, 2), bike(84, 34, 1.1), ring(84, 34, 20), ground),
  'pek.spräcka-budgeten': all(limit(10, 110, 56, C.ink), greyed(column(30, 104, 36, 20)), column(80, 104, 72, 24, C.gold), path('M68 56 L74 50 L80 58 L86 48 L92 56', 'none', RED, 2.6), crash(80, 30, 1.1), ex(104, 30, 16), ground),
  'pek.hålla-budgeten': all(limit(10, 110, 50, C.ink), column(40, 104, 40, 22), column(78, 104, 46, 22), okB(98, 26, 11), ground),
  'pek.engångsutgift': all(...[0, 1, 2, 3].map((i) => page(18 + i * 28, 30, 0.9, '', i === 1 ? HL : C.grey)), greyed(column(18, 104, 6, 14), column(74, 104, 6, 14), column(102, 104, 6, 14)), column(46, 104, 52, 18), glasses(46, 34, 0.7), ring(46, 30, 16), ground),

  // ── Ränta och inflation i vardagen ──
  'pek.ränta': all(bank(28, 84, 0.9), stack(80, 104, 5, 12), coin(104, 72, 7), T(104, 60, '+', 14, C.green), pct(80, 46, 26, HL), ground),
  'pek.sparränta': all(bank(30, 84, 0.9), jar(30, 30, 0.55, 0.6), curveArrow('M52 56 C64 46 76 46 84 54', 84, 54, 40, C.green, 2.4), coin(68, 44, 5), pct(68, 28, 16, C.green), fig(98, C.orange, 'laugh', { h: 0.7 }), ground),
  'pek.låneränta': all(bank(92, 84, 0.9), fig(22, C.orange, 'calm', { h: 0.74 }), curveArrow('M38 56 C52 44 64 44 72 52', 72, 52, 40, RED, 2.4), stack(52, 50, 3, 7), coin(66, 40, 5, '#f0a050'), pct(66, 24, 16, RED), ground),
  'pek.räntekostnad': all(house(22, 40, 1.3), fig(44, C.orange, 'frown', { h: 0.62 }), reach(44, 0.62, 1, 62, 82), page(98, 26, 0.8), coin(66, 80, 4.5), curveArrow('M70 78 C78 70 84 72 90 78', 90, 78, 40, RED, 2.2), pct(80, 60, 14, RED), bank(98, 96, 0.55), ground),
  'pek.ränta-på-ränta': all(column(18, 104, 12, 14), column(40, 104, 20, 14), column(62, 104, 34, 14), column(84, 104, 56, 14), column(106, 104, 88, 14), curveArrow('M14 84 C50 80 80 60 102 10', 102, 10, -60, C.green, 2.2), pct(32, 32, 18, C.green)),
  'pek.styrränta': all(centralBank(60, 58, 1.1), rect(42, 82, 36, 16, C.white, 3, C.ink, 1.4), pct(60, 90, 13, HL), arrow(30, 96, 14, 104, C.grey, 1.8), arrow(90, 96, 106, 104, C.grey, 1.8), bank(12, 104, 0.32), bank(108, 104, 0.32), ground),
  'pek.räntehöjning': all(pct(44, 64, 50, C.navy), arrow(92, 96, 92, 24, RED, 4.4), house(26, 102, 0.6), ground),
  'pek.räntesänkning': all(pct(44, 64, 50, C.navy), arrow(92, 24, 92, 96, C.green, 4.4), house(26, 102, 0.6), ground),
  'pek.inflation': all(cart(30, 92, 1.1, all(food(0, -14, 0.7))), tag(30, 50, '10', 0.9, '#e6e6e6'), cart(86, 92, 1.1, all(food(0, -14, 0.7))), tag(86, 50, '15', 0.9), arrow(48, 70, 68, 70, HL, 2.6), arrow(108, 60, 108, 30, RED, 3), ground),
  'pek.prisökning': all(g('translate(36 74)', rect(-14, -22, 28, 40, '#8a5a3a', 3, C.ink, 1.5), rect(-10, -10, 20, 14, C.yellow, 1, null), circle(0, -3, 4, '#5a3a1a', null)), greyed(tag(84, 84, '50', 1)), tag(84, 42, '65', 1.1), arrow(84, 70, 84, 56, RED, 2.6), ground),
  'pek.matpris': all(cart(52, 92, 1.5, all(food(-2, -16, 0.9), circle(12, -20, 5, C.yellow, C.ink, 1))), tag(92, 38, '89', 1.2), line('M80 40 C72 44 66 56 62 64', C.ink, 1.2), ground),
  'pek.köpkraft': all(greyed(bill(22, 22, 0.8), bag(22, 72, 1.3, C.orange), food(22, 50, 0.6), food(18, 60, 0.5)), bill(82, 22, 0.8), bag(82, 72, 1.3, C.orange), food(82, 60, 0.4), arrow(44, 66, 60, 66, HL, 2.4), arrow(106, 50, 106, 80, RED, 2.6), ground),
  'pek.penningvärde': all(greyed(coin(28, 60, 20)), arrow(54, 60, 72, 60, HL, 2.6), coin(92, 60, 11), arrow(92, 30, 92, 44, RED, 2.4), tag(92, 94, '?', 0.9), ground),
  'pek.urholka': all(coin(22, 62, 14), coin(60, 62, 14), circle(60, 62, 6, C.paper, C.ink, 1), coin(98, 62, 14), circle(98, 62, 10, C.paper, C.ink, 1), arrow(38, 62, 44, 62, C.grey, 1.8), arrow(76, 62, 82, 62, C.grey, 1.8), arrow(60, 22, 60, 40, RED, 2.2)),
  'pek.räntefri': all(bag(28, 84, 1.4), bill(28, 40, 0.8), curveArrow('M48 60 C60 52 70 52 78 58', 78, 58, 30, C.grey, 2), pct(90, 54, 30, C.navy), cross(90, 54, 1.8), ground),

  // ── Lån och amortering ──
  'pek.lån': all(bank(26, 84, 0.9), curveArrow('M46 52 C60 36 76 36 84 48', 84, 48, 60, C.green, 2.4), stack(64, 40, 3, 7), fig(96, C.orange, 'smile', { h: 0.76 }), curveArrow('M82 98 C66 106 54 106 46 98', 46, 98, 200, C.grey, 1.8), ground),
  'pek.låntagare': all(greyed(bank(24, 84, 0.8)), arrow(44, 60, 66, 60, C.green, 2.4), coin(56, 50, 4.5), fig(88, C.orange, 'smile', { h: 0.82 }), reach(88, 0.82, -1, 68, 62), ring(88, 56, 26)),
  'pek.långivare': all(bank(32, 84, 1), ring(32, 76, 34), arrow(60, 60, 80, 60, C.green, 2.4), coin(70, 50, 4.5), greyed(fig(98, C.orange, 'smile', { h: 0.7 })), ground),
  'pek.lånelöfte': all(doc(40, 56, 1.6, all(g('translate(0 -6) scale(0.5)', house(0, 0)), circle(6, 10, 6, 'none', C.green, 1.6), line('M3 10 L5.5 12.5 L9 7.5', C.green, 1.6)), 0), bank(96, 92, 0.6), stack(92, 52, 4, 8), ground),
  'pek.kreditprövning': all(bank(96, 90, 0.6), fig(28, C.orange, 'calm', { h: 0.8 }), doc(64, 60, 1.1, bars(-9, 12, 5, 2, [10, 16, 8], [C.green, C.green, RED]), 0), mag(72, 50, 1.3), q(96, 40, 14), ground),
  'pek.kreditupplysning': all(rect(14, 26, 54, 70, '#f2cf6b', 3, C.ink, 1.6), circle(30, 46, 7, C.skin, C.ink, 1.2), path('M20 62 C20 52 40 52 40 62 Z', C.orange, C.ink, 1.2), line('M46 42 L62 42 M46 50 L62 50 M20 72 L62 72 M20 80 L56 80', C.grey, 2), mag(50, 66, 1.3), envelope(96, 70, 1.1, ''), arrow(70, 70, 80, 70, HL, 2), ground),
  'pek.fast-ränta': all(rect(12, 24, 96, 66, C.white, 3, C.ink, 1.4), line('M20 56 L100 56', HL, 3), pct(28, 44, 14), padlock(96, 38, 1), ...[0, 1, 2, 3, 4].map((i) => line(`M${24 + i * 18} 82 L${24 + i * 18} 86`, C.ink, 1.4)), ground),
  'pek.rörlig-ränta': all(rect(12, 24, 96, 66, C.white, 3, C.ink, 1.4), line('M20 60 C30 40 40 72 52 54 C62 40 72 70 84 50 C92 38 96 52 100 46', HL, 3), pct(28, 40, 14), ...[0, 1, 2, 3, 4].map((i) => line(`M${24 + i * 18} 82 L${24 + i * 18} 86`, C.ink, 1.4)), ground),
  'pek.amortera': all(rect(10, 16, 100, 14, RED, 2, C.ink, 1.4), rect(84, 16, 26, 14, C.paper, 2, C.ink, 1.4), arrow(97, 34, 97, 46, C.green, 2.2), fig(28, C.orange, 'smile', { h: 0.72 }), reach(28, 0.72, 1, 50, 72), coin(54, 72, 5), curveArrow('M60 70 C70 62 78 64 84 72', 84, 72, 40, C.green, 2.2), bank(96, 96, 0.6), ground),
  'pek.amortering': all(rect(10, 46, 100, 20, RED, 2, C.ink, 1.6), rect(78, 46, 32, 20, C.paper, 2, C.ink, 1.6), line('M78 46 L78 66', C.ink, 1.6), coin(94, 56, 7), arrow(94, 72, 94, 96, C.green, 2.6), page(26, 92, 0.9), ring(94, 56, 14), ground),
  'pek.amorteringskrav': all(house(36, 54, 2.2), rect(8, 92, 104, 12, C.white, 2, C.ink, 1.4), rect(8, 92, 72, 12, RED, 2, C.ink, 1.4), line('M60 86 L60 108', C.ink, 2, '3 2'), doc(96, 40, 0.8, para(0, 0, 16), 0), ex(104, 74, 14)),
  'pek.skuld.2': all(fig(40, C.orange, 'frown', { h: 0.82 }), weight(40, 22, 1.2), T(40, 26, '−', 14, C.white), line('M30 34 L24 52 M50 34 L56 52', C.skin, 4), bank(96, 92, 0.6), doc(96, 40, 0.7, minusB(0, 4, 6), 2), ground),
  'pek.betala-av': all(...[0, 1, 2, 3].map((i) => all(rect(12 + i * 26, 104 - (60 - i * 14), 20, 60 - i * 14, RED, 2, C.ink, 1.3), page(22 + i * 26, 24, 0.6))), arrow(14, 34, 110, 72, C.green, 2.4), ground),
  'pek.privatlån': all(bank(24, 84, 0.8), curveArrow('M44 54 C58 40 72 40 80 52', 80, 52, 50, C.green, 2.4), coin(62, 42, 4.5), car(88, 98, 1.2), greyed(house(98, 46, 0.9)), cross(98, 46, 1.4), ground),

  // ── Försäkringar ──
  'pek.försäkra': all(house(30, 92, 1.2), car(84, 100, 1), dome(58, 40, 108), shield(60, 26, 1, C.navy), ground),
  'pek.försäkringsbolag': all(insurer(60, 84, 1.4), ground),
  'pek.premie': all(fig(20, C.orange, 'calm', { h: 0.76 }), ...[0, 1, 2].map((i) => all(page(46 + i * 22, 28, 0.6), coin(46 + i * 22, 48, 4.5))), curveArrow('M38 70 C56 62 70 62 82 70', 82, 70, 30, HL, 2.2), insurer(98, 90, 0.7), ground),
  'pek.försäkringsvillkor': all(doc(52, 60, 2.1, all(shield(0, -12, 0.4), ...[0, 1, 2].map((i) => line(`M-4 ${-2 + i * 7} L10 ${-2 + i * 7}`, C.grey2, 1.6)), g('translate(-8 -2) scale(0.35)', flame(0, 0)), g('translate(-8 5) scale(0.35)', thief(0, 0)), g('translate(-8 12) scale(0.35)', crash(0, 0))), 0), okB(104, 50, 6), okB(104, 66, 6), noB(104, 82, 6)),
  'pek.försäkringsskydd': all(dome(60, 26, 76), fig(60, C.orange, 'calm', { h: 0.8 }), flame(10, 50, 1), curveArrow('M18 46 C20 40 22 36 22 30', 22, 30, -90, C.grey, 1.6), thief(108, 70, 1), crash(104, 30, 0.9), ground),
  'pek.drulleförsäkring': all(phone(40, 96, 1, line('M-6 -10 L0 -2 L-3 4 L4 9 M0 -2 L7 -4', C.ink, 1.2)), crash(58, 104, 0.6), curveArrow('M40 20 C38 40 38 60 40 72', 40, 72, 90, C.grey, 1.8), fig(86, C.orange, 'shock', { h: 0.8 }), shield(62, 50, 0.9, C.navy, okB(0, 0, 5)), ground),
  'pek.olycksfallsförsäkring': all(fig(40, C.orange, 'frown', { h: 0.82 }), plaster(34, 26), plaster(48, 92, 70), line('M56 70 L64 112', C.brown, 3), shield(86, 44, 1.1, C.navy), curveArrow('M86 66 C82 80 74 84 64 84', 64, 84, 170, C.green, 2), coin(78, 92, 4.5), ground),
  'pek.barnförsäkring': all(dome(60, 40, 70), child(60, C.yellow, 'smile'), shield(60, 26, 0.8), fig(104, C.green, 'smile', { h: 0.82 }), ground),
  'pek.livförsäkring': all(dome(72, 34, 72), fig(60, C.orange, 'calm', { h: 0.8 }), child(86, C.yellow, 'calm'), shield(72, 22, 0.8), coin(98, 100, 4.5), greyed(fig(18, C.navy, 'calm', { h: 0.7 })), ground),
  'pek.bilförsäkring': all(dome(60, 44, 90), car(60, 98, 1.6), shield(60, 30, 0.9), ground),
  'pek.trafikförsäkring': all(car(32, 96, 1), car(84, 96, 1, C.red), crash(58, 86, 0.9), plaster(84, 70), shield(58, 40, 1, C.navy, para(0, 1, 14, C.white)), ground),
  'pek.halvförsäkring': all(car(30, 98, 1.1), shield(30, 52, 1.1), g('translate(66 22)', flame(0, 0, 0.9)), okB(84, 22, 6), g('translate(66 46)', thief(0, 0, 0.8)), okB(84, 46, 6), g('translate(66 70)', brokenGlass(0, 0, 0.8)), okB(84, 70, 6), g('translate(66 94)', crash(0, 0, 0.8)), noB(84, 94, 6), ground),
  'pek.helförsäkring': all(car(30, 98, 1.1), shield(30, 52, 1.1, '#2f6fb0'), g('translate(66 22)', flame(0, 0, 0.9)), okB(84, 22, 6), g('translate(66 46)', thief(0, 0, 0.8)), okB(84, 46, 6), g('translate(66 70)', brokenGlass(0, 0, 0.8)), okB(84, 70, 6), g('translate(66 94)', crash(0, 0, 0.8)), okB(84, 94, 6), ground),

  // ── Skatt på inkomsten ──
  'pek.inkomstskatt': all(company(22, 82, 0.7), bill(48, 40, 0.9), arrow(58, 48, 78, 64, C.grey, 2), office(96, 88, 0.6), arrow(48, 56, 48, 80, C.green, 2), wallet(48, 96, 0.7), ground),
  'pek.statlig-inkomstskatt': all(rect(14, 30, 30, 74, C.gold, 2, C.ink, 1.4), limit(8, 52, 50, RED), rect(14, 30, 30, 20, '#9aa3ad', 2, C.ink, 1.4), arrow(46, 38, 64, 38, C.grey, 2), parliament(92, 52, 0.85), ground),
  'pek.bruttolön': all(column(42, 104, 70, 30), rect(25, 30, 34, 24, 'rgba(154,163,173,0.85)', 2, C.ink, 1), ring(42, 68, 38), greyed(wallet(98, 92, 0.8))),
  'pek.nettolön': all(column(34, 104, 46, 26), rect(19, 34, 30, 22, 'none', 2, C.grey, 1.6), line('M19 34 L49 56 M49 34 L19 56', C.grey, 1), arrow(52, 80, 70, 84, C.green, 2.4), openWallet(92, 92, 0.9), stack(92, 88, 3, 8), ring(92, 86, 20)),
  'pek.dra-skatt': all(company(24, 84, 0.75), stack(58, 52, 5, 10), arrow(66, 40, 82, 26, C.grey, 2), office(100, 52, 0.5), arrow(64, 62, 82, 82, C.green, 2), wallet(98, 98, 0.6), path('M50 42 L66 36', 'none', HL, 2.4), ground),
  'pek.skattetabell': all(rect(14, 16, 76, 88, C.white, 3, C.ink, 1.6), ...[0, 1, 2, 3, 4, 5].map((i) => all(line(`M14 ${30 + i * 12} L90 ${30 + i * 12}`, C.grey2, 1.2), rect(20, 22 + i * 12, 20, 5, C.grey2, 1, null), rect(52, 22 + i * 12, 30, 5, i === 3 ? HL : C.grey2, 1, null))), line('M46 16 L46 104', C.grey2, 1.2), townHall(104, 92, 0.5), ring(52, 61, 12, HL)),
  'pek.preliminärskatt': all(...[0, 1, 2].map((i) => all(page(20 + i * 26, 28, 0.6), coin(20 + i * 26, 46, 4.5))), curveArrow('M24 60 C40 74 60 76 76 72', 76, 72, -10, C.grey, 2), office(98, 86, 0.55), q(104, 30, 16), ground),
  'pek.jobbskatteavdrag': all(fig(30, C.orange, 'smile', { h: 0.8 }), briefcase(46, 96, 0.8), stack(30, 22, 2, 8, '#9aa3ad'), greyed(fig(88, C.green, 'calm', { h: 0.8 }), stack(88, 22, 4, 8, '#9aa3ad')), T(60, 40, '<', 18, HL), ground),
  'pek.deklarera.2': all(fig(28, C.orange, 'calm', { h: 0.8 }), laptop(62, 84, 1, doc(0, -10, 0.3, '', 3)), reach(28, 0.8, 1, 50, 80), curveArrow('M70 54 C80 40 90 40 96 48', 96, 48, 60, HL, 2), office(100, 90, 0.5), flower(14, 100, 0.8), ground),
  'pek.deklaration': all(doc(50, 58, 2, all(flagSE(-10, -16, 0.4), ...[0, 1, 2].map((i) => rect(-9, -4 + i * 6, 18, 4, C.white, 1, C.ink, 0.6)), line('M-8 14 C-5 11 -3 16 0 13', C.navy, 0.8)), 0), envelope(100, 90, 0.8), ground),
  'pek.avdrag': all(column(32, 104, 52, 24, '#9aa3ad'), path('M18 52 L46 52', 'none', RED, 2.4), T(32, 40, '−', 18, RED), bus(84, 50, 1.4), arrow(70, 60, 50, 62, HL, 2.2), column(88, 104, 16, 22, '#9aa3ad'), ground),
  'pek.skatteåterbäring': all(office(26, 82, 0.8), curveArrow('M46 44 C62 30 78 32 86 46', 86, 46, 60, C.green, 2.6), coin(60, 34, 5), coin(72, 32, 5), fig(96, C.orange, 'laugh', { h: 0.78 }), ground),
  'pek.kvarskatt': all(fig(24, C.orange, 'frown', { h: 0.78 }), curveArrow('M38 46 C54 32 70 32 80 46', 80, 46, 60, RED, 2.6), coin(52, 34, 5), coin(64, 32, 5), office(96, 84, 0.7), invoice(56, 86, 0.9, ex(0, -2, 10)), ground),
  'pek.skattepliktig': all(bill(30, 44, 1.2), arrow(48, 52, 74, 68, C.grey, 2.4), office(94, 88, 0.6), okB(30, 76, 10), ground),
  'pek.skattefri': all(bill(30, 44, 1.2), child(30, C.yellow), arrow(48, 52, 74, 68, C.grey2, 2.4), cross(62, 60, 1.3), greyed(office(94, 88, 0.6)), ground),

  // ── Ekonomiska prioriteringar ──
  'pek.nödvändighet': all(jacket(24, 42, 1.3), food(60, 44, 1.2), house(96, 44, 1.4), okB(24, 72, 7), okB(60, 72, 7), okB(96, 72, 7), greyed(cake(60, 98, 0.8))),
  'pek.lyx': all(fig(28, C.purple, 'laugh', { h: 0.8 }), rect(48, 74, 64, 6, C.tan, 2, C.ink, 1.4), line('M56 80 L56 112 M104 80 L104 112', C.brown, 3), ellipse(80, 70, 18, 5, C.white, C.ink, 1.3), cake(80, 60, 0.7), sparkle(60, 40, 6), sparkle(100, 36, 7), sparkle(90, 20, 5), coin(104, 62, 4)),
  'pek.unna-sig': all(fig(38, C.orange, 'love', { h: 0.82 }), reach(38, 0.82, 1, 62, 62), cake(74, 64, 0.8), sparkle(90, 40, 6), greyed(page(100, 92, 0.7)), ground),
  'pek.ekonomiskt-utrymme': all(rect(10, 56, 100, 28, C.white, 3, C.ink, 1.6), rect(10, 56, 56, 28, C.gold, 3, C.ink, 1.6), rect(66, 56, 44, 28, 'rgba(79,157,105,0.18)', 3, C.green, 2), sofa(88, 46, 0.7), curveArrow('M88 34 C88 44 88 50 88 60', 88, 60, 90, C.green, 2), ground),
  'pek.avvägning': all(scales(60, 64, 1.4, 0, stack(0, 2, 3, 6), sparkle(0, -2, 6, C.gold)), q(60, 22, 14), ground),
  'pek.köpstopp': all(cart(44, 90, 1.6, ''), g('translate(84 44)', circle(0, 0, 16, RED, C.ink, 1.6), rect(-10, -3, 20, 6, C.white, 1, null)), shirt(28, 50, 0.8), bag(52, 48, 0.6), page(96, 92, 0.8), ground),
  'pek.köpa-begagnat': all(bike(60, 96, 1.2, '#7a8a9a'), fig(18, C.orange, 'smile', { h: 0.76 }), fig(102, C.green, 'smile', { h: 0.76 }), reach(18, 0.76, 1, 40, 62), coin(44, 60, 4.5), path('M60 80 C60 74 64 72 66 76', 'none', C.ink, 1), rect(66, 72, 10, 6, '#f6e08a', 1, C.ink, 0.8), ground),
  'pek.hushålla': all(...[0, 1, 2, 3].map((i) => page(18 + i * 28, 30, 0.8, '')), ...[0, 1, 2, 3].map((i) => stack(18 + i * 28, 80, 2, 7)), greyed(stack(60, 106, 1, 5)), curveArrow('M30 92 C50 100 70 100 96 92', 96, 92, -10, HL, 1.6), ground),
  'pek.konsumtion': all(cart(30, 92, 1.1, all(food(0, -14, 0.6))), cart(70, 96, 1.1, all(shirt(0, -14, 0.6))), cart(102, 70, 0.8, all(phone(0, -14, 0.5))), bag(104, 102, 0.6), arrow(14, 30, 106, 30, HL, 2.4), ground),
  'pek.konsumera': all(fig(30, C.orange, 'laugh', { h: 0.8 }), reach(30, 0.8, 1, 54, 74), cart(76, 92, 1.4, all(food(-2, -16, 0.7), shirt(10, -18, 0.6), phone(-12, -18, 0.5))), coin(58, 40, 5), coin(70, 30, 5), ground),
  'pek.levnadsstandard': all(rect(8, 92, 32, 20, C.grey2, 1, C.ink, 1.3), rect(44, 72, 32, 40, C.grey2, 1, C.ink, 1.3), rect(80, 52, 32, 60, C.yellow, 1, C.ink, 1.3), house(24, 80, 0.6), house(60, 58, 0.8), house(96, 34, 1.1), car(96, 88, 0.6)),
  'pek.leva-över-sina-tillgångar': all(stack(50, 112, 2, 16), fig(50, C.purple, 'shock', { h: 0.72 }), bag(26, 90, 0.8), bag(76, 92, 0.8, C.red), car(96, 98, 0.8, '#d4a020'), path('M30 104 L36 98 M64 106 L70 100', 'none', RED, 2), minusB(96, 30, 10), invoice(18, 40, 0.8, ex(0, 0, 10))),
  'pek.ekonomisk-trygghet': all(stack(56, 112, 4, 22), fig(56, C.orange, 'calm', { h: 0.72 }), dome(56, 14, 90), shield(100, 30, 0.8, C.navy, okB(0, 0, 5)), ground),
};
