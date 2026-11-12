/**
 * Samhälle & institutioner → Juridik & rättsväsende → Civilrätt i vardagen, 1441–1447 (0.31): contracts,
 * purchases and consumer protection, renting a home, damages and liability, family law, the basics of
 * labour law, and disputes and settlements. Recurring signs: the white contract sheet with a signature,
 * the handshake, the dark red law book with § and a small picture on the cover (the field of law), the
 * balance (a court or a fair judgement), coins and notes, a shield (protection), green and red marks and a
 * grey reference where a contrast helps. No gavels, no brands, no words in the pictures.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm, brokenHeart, dog, plaster } from './people';
import { P as F, type Mood, greyed } from './blindFix';
import { checkIcon } from './labelIcons';
import { sofa, tv } from './homeKit';

// ── Geometry and figures ─────────────────────────────────────────────
const RED = '#e8302c';
const BOOK = '#8a2b2b';
const f1 = (n: number) => n.toFixed(1);
const ground = line('M4 112 L116 112', C.grey2, 2);
/** Head and shoulder positions of a standing figure (figures.ts) at x with height factor h. */
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, hy: ty - 56 * s, hr: 10 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const hnd = (x: number, y: number, r = 3) => circle(x, y, r, C.skin, C.ink, 1.2);
/** An arm that starts at the shoulder (side −1 = picture-left, 1 = picture-right) and ends in a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), hnd(tx, ty, 3 * Math.max(0.7, h))); };
/** Just the arm (for hands drawn by another helper). */
const armTo = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Small head-and-shoulders person; mood smile | frown | flat | shock. */
const mini = (x: number, y: number, col: string, mood: 'smile' | 'frown' | 'flat' | 'shock' = 'smile', s = 1, long = false) => g(`translate(${x} ${y}) scale(${s})`, long ? path('M-8 -6 C-9 6 9 6 8 -6 Z', C.hair, null) : '', path('M-10 16 C-10 4 10 4 10 16 Z', col, C.ink, 1.4), circle(0, -6, 7.5, C.skin, C.ink, 1.4), path('M-7.5 -8 C-7.5 -16 7.5 -16 7.5 -8 C4 -11 -4 -11 -7.5 -8 Z', C.hair, null),
  circle(-2.6, -6, 1, C.ink, null), circle(2.6, -6, 1, C.ink, null),
  mood === 'smile' ? path('M-2.6 -2.6 Q0 -0.6 2.6 -2.6', 'none', C.ink, 1.1) : mood === 'flat' ? line('M-2.4 -2 L2.4 -2', C.ink, 1.1) : mood === 'shock' ? ellipse(0, -2, 1.4, 1.8, '#c84a4a', C.ink, 0.8) : path('M-2.6 -1.4 Q0 -3.4 2.6 -1.4', 'none', C.ink, 1.1));
/** Speech bubble centred on (cx, cy) whose tail points to (tx, ty). */
const say = (cx: number, cy: number, w: number, h: number, tx: number, ty: number, inner: Svg = '') => {
  const L = cx - w / 2, R = cx + w / 2, Tp = cy - h / 2, B = cy + h / 2;
  let a: number[], b: number[];
  if (tx < L || tx > R) { const e = tx < L ? L : R, by = Math.max(Tp + 6, Math.min(B - 6, ty)); a = [e, by - 4.5]; b = [e, by + 4.5]; }
  else { const e = ty > cy ? B : Tp, bx = Math.max(L + 7, Math.min(R - 7, tx)); a = [bx - 5, e]; b = [bx + 5, e]; }
  return all(path(`M${a[0]} ${a[1]} L${tx} ${ty} L${b[0]} ${b[1]} Z`, C.white, C.ink, 1.5), rect(L, Tp, w, h, C.white, 6, C.ink, 1.5), path(`M${a[0]} ${a[1]} L${tx} ${ty} L${b[0]} ${b[1]} Z`, C.white, null), inner);
};
/** Bubble beside the head of the figure at x (side 1 = right of the head, −1 = left); f draws the content at the bubble centre. */
const sb = (x: number, h: number, side: 1 | -1, w: number, hh: number, f: (cx: number, cy: number) => Svg, dy = 0) => { const k = geo(x, h), cx = x + side * (k.hr + 6 + w / 2), cy = k.hy - 8 + dy; return say(cx, cy, w, hh, x + side * (k.hr + 1), k.hy, f(cx, cy)); };
/** Thought cloud beside a head. */
const tb = (x: number, h: number, side: 1 | -1, w: number, f: (cx: number, cy: number) => Svg, dy = 0, hh = 22) => { const k = geo(x, h), cx = x + side * (k.hr + 8 + w / 2), cy = k.hy - 8 + dy; return all(ellipse(cx, cy, w / 2, hh / 2, C.white, C.ink, 1.5), circle(x + side * (k.hr + 4), k.hy - 2, 2.2, C.white, C.ink, 1), f(cx, cy)); };

// ── Marks ────────────────────────────────────────────────────────────
const para = (x: number, y: number, sz = 14, col: string = C.navy) => T(x, y + sz * 0.36, '§', sz, col);
const qm = (x: number, y: number, sz = 13, col: string = C.navy) => T(x, y + sz * 0.36, '?', sz, col);
const ex = (x: number, y: number, sz = 13, col: string = RED) => T(x, y + sz * 0.36, '!', sz, col);
const cross = (x: number, y: number, s = 1, col: string = RED) => line(`M${x - 5 * s} ${y - 5 * s} L${x + 5 * s} ${y + 5 * s} M${x + 5 * s} ${y - 5 * s} L${x - 5 * s} ${y + 5 * s}`, col, 2.4 * s);
const check = (x: number, y: number, s = 1, col: string = C.green) => checkIcon(x, y, s, col);
const okB = (x: number, y: number, r = 8) => all(circle(x, y, r, C.green, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, r * 0.22));
const noB = (x: number, y: number, r = 8) => all(circle(x, y, r, RED, C.ink, 1.2), line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, C.white, r * 0.22));
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const ban = (x: number, y: number, r: number) => all(circle(x, y, r, 'none', RED, r * 0.16), line(`M${f1(x - r * 0.7)} ${f1(y - r * 0.7)} L${f1(x + r * 0.7)} ${f1(y + r * 0.7)}`, RED, r * 0.16));
const dash = (d: string, col: string = HL, w = 1.6) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-dasharray="3 3" stroke-linecap="round"/>`;
const palm = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ...[-4.6, -1.6, 1.4, 4.4].map((d, i) => rect(d - 1.3, -9 + Math.abs(i - 1.5) * 1.2, 2.6, 9, C.skin, 1.3, C.ink, 0.9)), path('M-5.5 -1 L5.5 -1 L5 5 C4 8 -4 8 -5 5 Z', C.skin, C.ink, 1), path('M-5.4 1 L-9 -3 C-10 -4 -11 -2 -10 -1 L-5 5', C.skin, C.ink, 1));
/** A fist with the thumb up (yes, good). */
const thumb = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-6, -3, 11, 11, C.skin, 3, C.ink, 1.2), line('M-6 1 L4 1 M-6 4.5 L4 4.5', C.ink, 0.7), path('M-4 -3 L-4 -11 C-4 -14 1 -14 1 -11 L1 -3 Z', C.skin, C.ink, 1.2));
const notes = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L0 -12 L8 -14 L8 -2', C.ink, 1.6), ellipse(-2, 0, 3, 2.2, C.ink, null), ellipse(6, -2, 3, 2.2, C.ink, null));

// ── Things ───────────────────────────────────────────────────────────
/** A sheet of paper with text lines; `marks` in the sheet's own coordinates (−14…14, −18…18). */
const doc = (x: number, y: number, s = 1, marks: Svg = '', n = 5, col: string = C.grey2, fill: string = C.white) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -18, 28, 36, fill, 2, C.ink, 1.6), ...Array.from({ length: n }, (_, i) => line(`M-9 ${-11 + i * 6} L9 ${-11 + i * 6}`, col, 2)), marks);
const sig = (x: number, y: number, col: string = C.navy) => path(`M${x - 8} ${y} C${x - 5} ${y - 6} ${x - 3} ${y + 2} ${x} ${y - 3} C${x + 2} ${y - 6} ${x + 4} ${y} ${x + 7} ${y - 2}`, 'none', col, 1.4);
/** A contract: a sheet with one or two signature lines at the bottom. */
const contract = (x: number, y: number, s = 1, signed = true, two = false, marks: Svg = '') => doc(x, y, s, all(two ? all(line('M-11 13 L-2 13 M2 13 L11 13', C.ink, 1), signed ? all(g('translate(-6.5 1) scale(0.55)', sig(0, 20)), g('translate(6.5 1) scale(0.55)', sig(0, 20, C.green))) : '') : all(line('M-9 13 L9 13', C.ink, 1), signed ? sig(0, 11) : ''), marks), 4);
/** The law book: thick, dark red, gold bands, § on the cover and an optional small picture under it. */
const lawBook = (x: number, y: number, s = 1, icon: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-13, -16, 26, 32, BOOK, 2, C.ink, 1.6), rect(-13, -16, 5, 32, '#5e1c1c', 1, null), line('M-6 -12 L9 -12 M-6 13 L9 13', C.gold, 2), T(1.5, -1, '§', 11, C.gold), g('translate(1.5 6)', icon), rect(11, -14, 3, 28, '#f3ead6', 0.5, C.ink, 0.8));
const mag = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 8, 'rgba(220,240,252,0.7)', C.ink, 2), line('M5.6 5.6 L12 12', C.ink, 3));
const pen = (x: number, y: number, s = 1, rot = 35) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-2, -14, 4, 22, C.navy, 1, C.ink, 1), path('M-2 8 L0 13 L2 8 Z', C.tan, C.ink, 0.8));
const cal = (x: number, y: number, s = 1, hi: number[] = [], col: string = HL, n = 9) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -14, 28, 28, C.white, 2, C.ink, 1.4), rect(-14, -14, 28, 7, RED, 2, C.ink, 1.4), ...Array.from({ length: n }, (_, i) => rect(-11 + (i % 3) * 8, -4 + Math.floor(i / 3) * 6, 6, 4.4, hi.includes(i) ? col : C.grey2, 0.8, null)));
const hourglass = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M-8 -12 L8 -12 M-8 12 L8 12', C.brown, 2.4), path('M-6 -11 L6 -11 L1 0 L6 11 L-6 11 L-1 0 Z', 'rgba(220,240,252,0.7)', C.ink, 1.2), path('M-5 10 L5 10 L0 3 Z', C.tan, null), path('M-3 -9 L3 -9 L0 -4 Z', C.tan, null));
const handshake = (x: number, y: number, s = 1, c1: string = C.navy, c2: string = C.navy) => g(`translate(${x} ${y}) scale(${s})`, rect(-22, -4, 12, 9, c1, 2, C.ink, 1.2), rect(10, -4, 12, 9, c2, 2, C.ink, 1.2), path('M-10 -4 C-4 -8 4 -8 10 -4 L10 5 C4 8 -4 8 -10 5 Z', C.skin, C.ink, 1.2), line('M-4 -5 L-2 5 M0 -6 L2 5 M4 -5 L5 4', C.ink, 0.8));
const coins = (x: number, y: number, n = 3, r = 5) => all(...Array.from({ length: n }, (_, i) => ellipse(x, y - i * 3, r, r * 0.45, C.gold, C.ink, 1.1)));
const bill = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-11, -6, 22, 12, '#a8d8a8', 1.5, C.ink, 1.1), circle(0, 0, 3.4, 'none', '#4f9d69', 1.1));
const bills = (x: number, y: number, n = 3, s = 1) => all(...Array.from({ length: n }, (_, i) => bill(x + (i % 2) * 2, y - i * 4 * s, s)));
const wallet = (x: number, y: number, s = 1, empty = false) => g(`translate(${x} ${y}) scale(${s})`, rect(-11, -7, 22, 14, C.brown, 2.5, C.ink, 1.3), rect(2, -3, 9, 6, '#8a5432', 1.5, C.ink, 1), empty ? path('M-8 -7 L-5 -12 L-2 -7', 'none', C.grey, 1) : bill(-2, -9, 0.6));
const envelope = (x: number, y: number, s = 1, mark: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -9, 28, 18, C.white, 2, C.ink, 1.5), path('M-14 -9 L0 2 L14 -9', 'none', C.ink, 1.3), mark);
/** An invoice: a sheet with a coin and a total line. */
const invoice = (x: number, y: number, s = 1, mark: Svg = '') => doc(x, y, s, all(ellipse(-6, 10, 4, 2, C.gold, C.ink, 0.9), line('M1 10 L10 10', C.ink, 2), mark), 3);
const shield = (x: number, y: number, s = 1, col: string = C.green, inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, path('M0 -16 L14 -11 C14 4 8 12 0 17 C-8 12 -14 4 -14 -11 Z', col, C.ink, 1.6), inner);
const house = (x: number, y: number, s = 1, col: string = '#e8a07a') => g(`translate(${x} ${y}) scale(${s})`, path('M-14 -2 L0 -14 L14 -2 Z', RED, C.ink, 1.3), rect(-11, -2, 22, 16, col, 1, C.ink, 1.3), rect(-3, 5, 6, 9, C.brown, 0.5, C.ink, 0.8), rect(5, 1, 4, 4, '#9ad0f0', 0.5, C.ink, 0.6));
const key = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, circle(-6, 0, 4, 'none', C.gold, 2.4), line('M-2 0 L9 0 M6 0 L6 4 M9 0 L9 3', C.gold, 2.4));
const car = (x: number, y: number, s = 1, col: string = C.denim) => g(`translate(${x} ${y}) scale(${s})`, path('M-18 2 L-18 -6 L-10 -8 L-5 -15 L8 -15 L13 -8 L18 -6 L18 2 Z', col, C.ink, 1.4), rect(-3, -13, 9, 5, '#bfe3f5', 1, null), circle(-10, 3, 4, C.dark, C.ink, 1), circle(10, 3, 4, C.dark, C.ink, 1));
const bike = (x: number, y: number, s = 1, col: string = C.green) => g(`translate(${x} ${y}) scale(${s})`, circle(-10, 0, 7, 'none', C.ink, 1.8), circle(10, 0, 7, 'none', C.ink, 1.8), line('M-10 0 L-3 -10 L7 -10 L10 0 M-3 -10 L0 0 L7 -10 M-5 -14 L-1 -14 M7 -10 L6 -15 L9 -15', col, 2));
const ringPair = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(-4, 0, 6, 'none', C.gold, 2.6), circle(4, 0, 6, 'none', C.gold, 2.6), circle(-4, 0, 6, 'none', C.ink, 0.6), circle(4, 0, 6, 'none', C.ink, 0.6));
const helmet = (x: number, y: number, s = 1, col: string = C.yellow) => g(`translate(${x} ${y}) scale(${s})`, path('M-9 2 C-9 -10 9 -10 9 2 Z', col, C.ink, 1.3), rect(-11, 1, 22, 3, col, 1, C.ink, 1.1), line('M0 -8 L0 1', C.ink, 0.8));
/** A hard hat on a figure's head. */
const hat = (x: number, h: number, col: string = C.yellow) => { const k = geo(x, h); return helmet(x, k.hy - k.hr * 0.55, k.hr / 8, col); };
const tie = (x: number, h: number, col: string = RED) => { const k = geo(x, h); return path(`M${x} ${f1(k.sy)} L${f1(x - 2 * k.s)} ${f1(k.sy + 4 * k.s)} L${x} ${f1(k.sy + 18 * k.s)} L${f1(x + 2 * k.s)} ${f1(k.sy + 4 * k.s)} Z`, col, C.ink, 0.9); };
const briefcase = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-10, -6, 20, 14, C.brown, 2, C.ink, 1.3), path('M-4 -6 L-4 -9 L4 -9 L4 -6', 'none', C.ink, 1.3), line('M-10 0 L10 0', C.ink, 0.8));
const tag = (x: number, y: number, s = 1, inner: Svg = '', col: string = C.yellow) => g(`translate(${x} ${y}) scale(${s})`, path('M-12 -8 L8 -8 L14 0 L8 8 L-12 8 Z', col, C.ink, 1.3), circle(8, 0, 1.6, C.white, C.ink, 0.8), inner);
const kettle = (x: number, y: number, s = 1, broken = false, col: string = C.sky) => g(`translate(${x} ${y}) scale(${s})`, path('M-9 8 L-7 -6 C-5 -10 5 -10 7 -6 L9 8 Z', col, C.ink, 1.3), path('M7 -3 C13 -3 13 6 8 6', 'none', C.ink, 1.6), path('M-8 -2 L-14 -6', 'none', C.ink, 2), rect(-3, -12, 6, 3, C.dark, 1, null), broken ? path('M-2 -6 L1 -1 L-2 2 L2 7', 'none', RED, 1.4) : '');
const washer = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -18, 28, 36, C.white, 2, C.ink, 1.5), line('M-14 -10 L14 -10', C.ink, 1), circle(0, 4, 9, '#bfe3f5', C.ink, 1.5), circle(8, -14, 1.6, C.dark, null));
/** Shop front with a striped awning. */
const shop = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-26, -30, 52, 42, '#f3e6cf', 1, C.ink, 1.5), ...[0, 1, 2, 3, 4, 5].map((i) => path(`M${-28 + i * 9.3} -30 L${-18.7 + i * 9.3} -30 L${-18.7 + i * 9.3} -22 C${-21 + i * 9.3} -19 ${-26 + i * 9.3} -19 ${-28 + i * 9.3} -22 Z`, i % 2 ? C.white : RED, C.ink, 1)), rect(-22, -14, 20, 16, '#bfe3f5', 1, C.ink, 1.1), rect(4, -12, 14, 24, C.brown, 1, C.ink, 1.1));
const bag = (x: number, y: number, s = 1, col: string = C.orange) => g(`translate(${x} ${y}) scale(${s})`, path('M-8 -6 L8 -6 L10 10 L-10 10 Z', col, C.ink, 1.3), path('M-4 -6 C-4 -12 4 -12 4 -6', 'none', C.ink, 1.3));
const factory = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-30 20 L-30 -4 L-16 -14 L-16 -4 L-2 -14 L-2 -4 L12 -14 L12 -4 L30 -4 L30 20 Z', '#c9b39a', C.ink, 1.4), rect(18, -22, 7, 18, '#9a8a7a', 1, C.ink, 1.2), ...[-22, -8, 6].map((cx) => rect(cx - 4, 2, 8, 7, '#9ad0f0', 0.5, C.ink, 0.7)), rect(16, 6, 9, 14, C.brown, 0.5, C.ink, 1));
const pie = (x: number, y: number, r: number, frac: number, c1: string, c2: string) => { const a = frac * Math.PI * 2, ex2 = x + r * Math.sin(a), ey = y - r * Math.cos(a); return all(circle(x, y, r, c2, C.ink, 1.4), path(`M${x} ${y} L${x} ${y - r} A${r} ${r} 0 ${frac > 0.5 ? 1 : 0} 1 ${f1(ex2)} ${f1(ey)} Z`, c1, C.ink, 1.4)); };
const portrait = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-12, -14, 24, 28, '#d9c7a8', 2, C.ink, 1.5), rect(-9, -11, 18, 22, '#f5efe2', 1, null), circle(0, -3, 5, C.skin, C.ink, 1), path('M-5 -5 C-5 -9 5 -9 5 -5', 'none', C.white, 2), path('M-7 10 C-7 3 7 3 7 10 Z', C.grey, C.ink, 1), path('M6 -14 L12 -14 L12 -8 Z', C.black, null));
const flower = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L0 -12', C.green, 1.6), ...[0, 72, 144, 216, 288].map((a) => circle(+f1(4 * Math.sin((a * Math.PI) / 180)), +f1(-14 - 4 * Math.cos((a * Math.PI) / 180)), 2.6, C.white, C.ink, 0.6)), circle(0, -14, 1.8, C.yellow, null));
/** Table with legs (top at y). */
const table = (y: number, x1: number, x2: number) => all(rect(x1, y, x2 - x1, 6, C.tan, 2, C.ink, 1.8), line(`M${x1 + 8} ${y + 6} L${x1 + 8} 112 M${x2 - 8} ${y + 6} L${x2 - 8} 112`, C.brown, 3));
/** Judge's bench (front panel). */
const bench = (x1: number, x2: number, y: number) => all(rect(x1, y, x2 - x1, 24, '#b98a5e', 2, C.ink, 1.6), line(`M${x1} ${y + 6} L${x2} ${y + 6}`, '#8a5f3a', 1.2));

// ── Buildings ────────────────────────────────────────────────────────
const flagSE = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(0, 0, 20, 13, '#2a6ebb', 0.5, C.ink, 1), rect(6, 0, 3.4, 13, '#f7cf2e', 0, null), rect(0, 4.8, 20, 3.4, '#f7cf2e', 0, null), rect(0, 0, 20, 13, 'none', 0.5, C.ink, 1));
/** Balance (scales); tilt > 0 lowers the right pan; l and r are drawn in the pans. */
const scales = (x: number, y: number, s = 1, tilt = 0, l: Svg = '', r: Svg = '', col: string = C.gold) => { const a = (tilt * Math.PI) / 180, dx = 18 * Math.cos(a), dy = 18 * Math.sin(a); const pan = (px: number, py: number, c: Svg) => all(line(`M${f1(px)} ${f1(py)} L${f1(px - 7)} ${f1(py + 10)} M${f1(px)} ${f1(py)} L${f1(px + 7)} ${f1(py + 10)}`, C.ink, 0.9), g(`translate(${f1(px)} ${f1(py + 9)})`, c), path(`M${f1(px - 9)} ${f1(py + 10)} C${f1(px - 7)} ${f1(py + 15)} ${f1(px + 7)} ${f1(py + 15)} ${f1(px + 9)} ${f1(py + 10)} Z`, col, C.ink, 1.2)); return g(`translate(${x} ${y}) scale(${s})`, line('M0 -12 L0 18 M-8 18 L8 18', C.ink, 2.2), line(`M${f1(-dx)} ${f1(-12 - dy)} L${f1(dx)} ${f1(-12 + dy)}`, C.ink, 2), circle(0, -13, 2.4, col, C.ink, 1), pan(-dx, -12 - dy, l), pan(dx, -12 + dy, r)); };
/** Office building; a flag on the roof marks an authority. */
const office = (x: number, y: number, s = 1, col: string = '#cfd8e2', flag = true, sign: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-22, -30, 44, 52, col, 1.5, C.ink, 1.4), ...Array.from({ length: 12 }, (_, i) => rect(-17 + (i % 4) * 9.4, -25 + Math.floor(i / 4) * 11, 6, 7, '#9ad0f0', 0.5, C.ink, 0.6)), rect(-5, 9, 10, 13, C.brown, 0.5, C.ink, 1), sign, flag ? all(line('M14 -30 L14 -44', C.ink, 1.4), flagSE(14, -44, 0.55)) : '');
/** A courthouse: columns and a balance on the pediment. */
const court = (x: number, y: number, s = 1, col: string = '#e8e2d4') => g(`translate(${x} ${y}) scale(${s})`, rect(-30, 14, 60, 6, C.grey2, 1, C.ink, 1.2), rect(-26, -8, 52, 22, col, 1, C.ink, 1.4), path('M-30 -8 L0 -26 L30 -8 Z', col, C.ink, 1.4), ...[-18, -6, 6, 18].map((cx) => rect(cx - 2.4, -6, 4.8, 20, C.white, 1, C.ink, 0.9)), scales(0, -14, 0.28));
/** An apartment door with a number plate. */
const aptDoor = (x: number, y: number, s = 1, col: string = '#7a9cc6') => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -50, 28, 50, col, 1.5, C.ink, 1.6), circle(9, -24, 1.8, C.gold, C.ink, 0.6), rect(-5, -44, 10, 6, C.white, 1, C.ink, 0.8));
const domino = (x: number, y: number, rot = 0, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-4, -18, 8, 18, C.white, 1.5, C.ink, 1.3), line('M-3 -9 L3 -9', C.ink, 0.8), circle(0, -13.5, 1, C.ink, null), circle(0, -4.5, 1, C.ink, null));
const vase = (x: number, y: number, s = 1, broken = false) => g(`translate(${x} ${y}) scale(${s})`, broken ? all(path('M-12 0 L-8 -6 L-4 -2 L-6 0 Z', C.sky, C.ink, 1), path('M-2 0 L0 -8 L5 -5 L4 0 Z', C.sky, C.ink, 1), path('M7 0 L9 -4 L13 -1 L12 0 Z', C.sky, C.ink, 1)) : path('M-5 0 C-9 -6 -8 -14 -4 -18 L-4 -22 L4 -22 L4 -18 C8 -14 9 -6 5 0 Z', C.sky, C.ink, 1.3));
const brokenWin = (x: number, y: number, w = 22, h = 20) => all(rect(x, y, w, h, '#bfe3f5', 1, C.ink, 1.4), path(`M${x + w * 0.45} ${y} L${x + w * 0.55} ${y + h * 0.4} L${x + w * 0.3} ${y + h * 0.6} L${x + w * 0.45} ${y + h} M${x + w * 0.55} ${y + h * 0.4} L${x + w} ${y + h * 0.3}`, 'none', C.ink, 1.1));
const ball = (x: number, y: number, r = 4) => all(circle(x, y, r, C.white, C.ink, 1.1), path(`M${x - r * 0.5} ${y - r * 0.3} L${x} ${y - r * 0.6} L${x + r * 0.5} ${y - r * 0.3} L${x + r * 0.3} ${y + r * 0.3} L${x - r * 0.3} ${y + r * 0.3} Z`, C.dark, null));
const umbrella = (x: number, y: number, s = 1, col: string = C.green) => g(`translate(${x} ${y}) scale(${s})`, path('M-30 0 C-30 -22 30 -22 30 0 C24 -4 18 -4 15 0 C10 -4 4 -4 0 0 C-4 -4 -10 -4 -15 0 C-18 -4 -24 -4 -30 0 Z', col, C.ink, 1.5), line('M0 -18 L0 -22', C.ink, 1.6));
const rain = (x1: number, x2: number, y: number) => all(...Array.from({ length: Math.floor((x2 - x1) / 10) }, (_, i) => line(`M${x1 + i * 10} ${y} L${x1 + i * 10 - 2} ${y + 6}`, '#5aa7e8', 1.4)));
const baby = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ellipse(0, 4, 9, 6, C.white, C.ink, 1.2), circle(-6, -2, 5, C.skin, C.ink, 1.2), circle(-7.4, -2.4, 0.6, C.ink, null), circle(-4.6, -2.4, 0.6, C.ink, null));
const backpack = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-6, -8, 12, 16, C.purple, 3, C.ink, 1.2), rect(-4, 0, 8, 5, '#a585d0', 1, C.ink, 0.8));
const sling = (x: number, h: number) => { const k = geo(x, h); return all(path(`M${f1(k.sl + 2)} ${f1(k.sy)} L${f1(k.sr)} ${f1(k.sy + 22 * k.s)}`, 'none', C.white, 4 * k.s), rect(x - 10 * k.s, k.sy + 14 * k.s, 18 * k.s, 7 * k.s, C.white, 2, C.ink, 1)); };
const crutch = (x: number, y1: number, y2: number) => all(line(`M${x} ${y1} L${x} ${y2}`, C.grey, 2.4), line(`M${x - 4} ${y1} L${x + 4} ${y1}`, C.grey, 3));
const conveyor = (x1: number, x2: number, y: number) => all(rect(x1, y, x2 - x1, 6, C.dark, 3, C.ink, 1.2), ...Array.from({ length: Math.floor((x2 - x1) / 10) + 1 }, (_, i) => circle(x1 + 3 + i * 10, y + 3, 2, C.grey, null)), line(`M${x1 + 6} ${y + 6} L${x1 + 6} 112 M${x2 - 6} ${y + 6} L${x2 - 6} 112`, C.dark, 2.4));
const storm = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-12 4 C-18 4 -18 -6 -10 -6 C-9 -13 3 -14 5 -7 C12 -9 15 2 9 4 Z', C.grey, C.ink, 1.2), path('M-1 4 L-5 12 L0 11 L-3 18', 'none', C.yellow, 2));

export const CIVIL_LAW_MOTIFS: Record<string, Svg> = {
  // ── 1441 Avtal och avtalsvillkor ──
  // ingå avtal: two people shake hands over the table where the signed contract lies.
  'civil.ingå-avtal': all(table(86, 14, 106), fig(18, C.navy, 'smile', { h: 0.9 }), fig(102, C.green, 'smile', { h: 0.9, hairStyle: 'long' }), armTo(18, 0.9, 1, 40, 52), armTo(102, 0.9, -1, 80, 52), handshake(60, 52, 0.9, C.navy, C.green), contract(60, 74, 0.5, true, true), pen(80, 78, 0.6, 60)),
  // avtalsfrihet (symbol): a blank contract between two people; from it the choice forks to yes (green) and no (red) – both are free to choose.
  'civil.avtalsfrihet': all(ground, contract(60, 28, 0.9, false), line('M60 46 L60 58', C.ink, 2), arrow(60, 58, 44, 74, HL, 2.2), arrow(60, 58, 76, 74, HL, 2.2), okB(40, 82, 9), noB(80, 82, 9), fig(16, C.orange, 'calm', { h: 0.62, hairStyle: 'long' }), fig(104, C.sky, 'calm', { h: 0.62 }), tb(16, 0.62, 1, 20, (cx, cy) => qm(cx, cy, 11), -8), tb(104, 0.62, -1, 20, (cx, cy) => qm(cx, cy, 11), -8)),
  // anbud: the seller stands by her bike and says what it costs (bubble: bike = coins); the buyer listens and thinks.
  'civil.anbud': all(ground, fig(30, C.green, 'smile', { h: 0.84, hairStyle: 'long' }), bike(64, 104, 1, C.red), reach(30, 0.84, 1, 50, 80), sb(30, 0.84, 1, 44, 22, (cx, cy) => all(bike(cx - 10, cy + 4, 0.5, C.red), arrow(cx - 1, cy, cx + 6, cy, HL, 1.4), coins(cx + 14, cy + 4, 3, 4))), fig(100, C.sky, 'calm', { h: 0.8 }), tb(100, 0.8, -1, 16, (cx, cy) => qm(cx, cy, 11), 30)),
  // accept: the seller's offer (grey bubble) and the buyer's answer: thumb up and a green yes.
  'civil.accept': all(ground, greyed(fig(22, C.grey, 'smile', { h: 0.78, hairStyle: 'long' }), sb(22, 0.78, 1, 34, 18, (cx, cy) => all(bike(cx - 7, cy + 3, 0.4, C.grey), coins(cx + 9, cy + 3, 2, 3.4)))), fig(90, C.sky, 'laugh', { h: 0.9 }), reach(90, 0.9, -1, 66, 58), thumb(66, 56, 1.1), sb(90, 0.9, -1, 22, 20, (cx, cy) => okB(cx, cy, 7), 22)),
  // muntligt avtal: they agree only with words (bubbles) and a handshake; the sheet of paper is crossed out.
  'civil.muntligt-avtal': all(ground, fig(22, C.orange, 'smile', { h: 0.84, hairStyle: 'long' }), fig(98, C.green, 'smile', { h: 0.84 }), armTo(22, 0.84, 1, 44, 66), armTo(98, 0.84, -1, 76, 66), handshake(60, 66, 0.8, C.orange, C.green), sb(22, 0.84, 1, 26, 18, (cx, cy) => all(bike(cx - 4, cy + 3, 0.36, C.red), coins(cx + 8, cy + 3, 2, 3)), -6), sb(98, 0.84, -1, 20, 18, (cx, cy) => check(cx, cy, 0.9), -6), greyed(contract(60, 96, 0.4, false)), cross(60, 96, 1.4)),
  // avtalsvillkor: a large contract whose rows are the terms (price, time, end), read with a magnifier.
  'civil.avtalsvillkor': all(rect(20, 6, 70, 102, C.white, 3, C.ink, 1.8), ...[0, 1, 2, 3].map((i) => line(`M44 ${26 + i * 20} L80 ${26 + i * 20}`, C.grey2, 3)), coins(32, 30, 2, 5), cal(32, 46, 0.42), g('translate(32 66)', circle(0, 0, 6, C.white, C.ink, 1.2), line('M0 0 L0 -4 M0 0 L3 1', C.ink, 1)), noB(32, 86, 5), line('M30 100 L80 100', C.ink, 1), sig(55, 98), mag(96, 50, 1.6)),
  // standardavtal: the company hands out exactly the same contract to three different customers.
  'civil.standardavtal': all(ground, office(24, 70, 0.7, '#e9c27a', false), ...[0, 1, 2].map((i) => all(arrow(42, 48, 60, 28 + i * 30, HL, 1.6), contract(72, 28 + i * 30, 0.5, false, false, rect(-14, -18, 28, 6, C.sky, 2, null)), mini(100, 32 + i * 30, [C.green, C.orange, C.purple][i]!, 'smile', 0.8)))),
  // det finstilta: a contract with big lines and tiny lines at the bottom; the magnifier shows a hidden fee there.
  'civil.det-finstilta': all(rect(14, 8, 64, 100, C.white, 3, C.ink, 1.8), ...[0, 1, 2].map((i) => line(`M22 ${22 + i * 12} L70 ${22 + i * 12}`, C.grey, 4)), ...Array.from({ length: 8 }, (_, i) => line(`M22 ${70 + i * 3.6} L70 ${70 + i * 3.6}`, C.grey2, 0.9)), circle(90, 62, 22, C.white, C.ink, 2.4), line('M106 78 L116 90', C.ink, 4), ...[0, 1, 2].map((i) => line(`M76 ${54 + i * 8} L100 ${54 + i * 8}`, C.grey, 2)), coins(98, 74, 2, 4), ex(80, 72, 10), dash('M70 80 L72 70', C.grey, 1)),
  // avtalsbrott: the contract is torn; the buyer walks off with the box without paying, the seller waits with an open hand.
  'civil.avtalsbrott': all(ground, g('translate(48 22) rotate(-12)', path('M-14 -18 L2 -18 L-2 -4 L3 6 L-2 18 L-14 18 Z', C.white, C.ink, 1.5)), g('translate(64 24) rotate(10)', path('M-1 -18 L14 -18 L14 18 L1 18 L6 6 L1 -4 Z', C.white, C.ink, 1.5)), fig(22, C.green, 'frown', { h: 0.76, hairStyle: 'long' }), reach(22, 0.76, 1, 40, 72), palm(42, 70, 0.8), fig(90, C.dark, 'smile', { h: 0.76 }), rect(96, 70, 18, 16, C.tan, 1, C.ink, 1.3), arrow(96, 104, 114, 104, C.grey, 1.6), coins(66, 104, 2, 4), cross(66, 100, 1)),
  // oskälig (symbol): the balance sinks under a huge pile of coins demanded for a tiny thing; grey reference: a fair, level balance.
  'civil.oskälig': all(ground, scales(52, 62, 1.9, 22, kettle(0, -7, 0.32), all(coins(0, -2, 6, 5))), ex(96, 22, 18), greyed(scales(104, 92, 0.6, 0, coins(0, -3, 1, 3), coins(0, -3, 1, 3)))),
  // jämka (symbol): a tall stack of coins goes through the balance and comes out lower.
  'civil.jämka': all(ground, ...Array.from({ length: 12 }, (_, i) => ellipse(22, 104 - i * 6, 12, 5, C.gold, RED, 1.2)), scales(60, 44, 0.8), arrow(38, 72, 82, 72, HL, 2.6), ...Array.from({ length: 5 }, (_, i) => ellipse(98, 104 - i * 6, 12, 5, C.gold, C.green, 1.2)), check(98, 64, 1)),
  // ogiltig (3) (symbol): a signed contract with a big red no-sign over it (it does not count). Grey reference: a valid contract with a tick.
  'civil.ogiltig.3': all(contract(46, 56, 2.2, true), ban(46, 56, 34), greyed(contract(102, 84, 0.7, true)), check(102, 64, 0.8, C.grey)),
  // avtalslagen: the law book with a handshake on the cover, next to a signed contract.
  'civil.avtalslagen': all(ground, lawBook(44, 60, 2.6, handshake(0, 0, 0.32, C.gold, C.gold)), contract(98, 80, 0.9, true, true)),

  // ── 1442 Köp och konsumentskydd ──
  // näringsidkare: the shopkeeper behind the counter of her own shop sells to a customer (ring on the seller).
  'civil.näringsidkare': all(ground, shop(40, 82, 1.3), fig(40, C.navy, 'smile', { h: 0.76 }), rect(14, 84, 52, 28, '#b98a5e', 2, C.ink, 1.6), bag(54, 76, 0.7), coins(26, 82, 2, 4), ring(40, 46, 16), fig(98, C.orange, 'smile', { h: 0.8, hairStyle: 'long' }), reach(98, 0.8, -1, 70, 72)),
  // konsumentskydd (symbol): a customer with a shopping bag stands under a big green shield; the shop's red arrows bounce off.
  'civil.konsumentskydd': all(ground, shop(26, 92, 0.8), shield(82, 52, 2.6, 'rgba(79,157,105,0.25)'), fig(82, C.orange, 'calm', { h: 0.66, hairStyle: 'long' }), bag(98, 96, 0.8), arrow(40, 48, 56, 52, RED, 2.2), arrow(44, 70, 56, 70, RED, 2.2), cross(58, 46, 1), cross(58, 76, 1)),
  // konsumentköplagen: the law book with a shopping bag on the cover, between a shop and a customer.
  'civil.konsumentköplagen': all(ground, lawBook(60, 46, 2.2, bag(0, -1, 0.5, C.gold)), shop(20, 100, 0.55), mini(102, 96, C.orange, 'smile', 1.1, true), arrow(36, 96, 46, 86, C.grey, 1.6), arrow(92, 92, 80, 84, C.grey, 1.6)),
  // reklamationsrätt (symbol): the broken kettle goes back to the shop, and three calendars (three years) each have a tick.
  'civil.reklamationsrätt': all(ground, kettle(26, 92, 1.6, true), arrow(44, 92, 74, 92, HL, 2.4), shop(96, 104, 0.6), ...[0, 1, 2].map((i) => all(cal(26 + i * 34, 30, 0.9), check(36 + i * 34, 18, 0.8)))),
  // ursprungligt fel (symbol): on day 1 the new toaster already hides a crack (dashed red ring); later the crack shows, and the arrow points back to day 1.
  'civil.ursprungligt-fel': all(ground, cal(22, 22, 0.8, [0]), kettle(24, 76, 1.8), dash('M22 62 L28 70 L22 76', RED, 1.4), circle(24, 70, 12, 'none', RED, 1.6), arrow(46, 76, 72, 76, C.grey, 2), cal(96, 22, 0.8, [8]), kettle(96, 76, 1.8, true), path('M84 100 C66 112 46 112 32 100', 'none', HL, 2), path('M32 100 L38 104 L37 97 Z', HL, null)),
  // avhjälpa: a repairman kneels at the broken washing machine and fixes it with a wrench; a tick.
  'civil.avhjälpa': all(ground, washer(36, 92, 1.4), sparkle(50, 70, 4), fig(88, C.navy, 'calm', { h: 0.72 }), reach(88, 0.72, -1, 60, 80), g('translate(56 82) rotate(-30)', rect(-2, -8, 4, 14, C.silver, 1, C.ink, 1), path('M-4 -12 L4 -12 L3 -7 L-3 -7 Z', C.silver, C.ink, 1)), check(36, 52, 1.2)),
  // omleverans: at the counter the customer hands in the broken kettle and gets a new, shiny one.
  'civil.omleverans': all(ground, rect(40, 84, 80, 28, '#b98a5e', 2, C.ink, 1.6), fig(84, C.navy, 'smile', { h: 0.74 }), fig(20, C.orange, 'smile', { h: 0.8, hairStyle: 'long' }), kettle(48, 72, 1, true, C.grey), arrow(54, 60, 70, 60, C.grey, 1.6), kettle(66, 46, 1.1), sparkle(76, 36, 3.4), arrow(56, 42, 40, 42, HL, 2)),
  // prisavdrag: the jacket has a scratch; on the price tag the big amount is crossed out and a smaller one is paid.
  'civil.prisavdrag': all(ground, g('translate(30 64)', path('M-18 -24 L-8 -28 L0 -22 L8 -28 L18 -24 L22 -6 L14 -4 L14 28 L-14 28 L-14 -4 L-22 -6 Z', C.denim, C.ink, 1.5), path('M-6 4 L6 14', 'none', RED, 2)), tag(84, 30, 1.6, all(coins(-4, 4, 4, 4), cross(-4, 0, 1))), arrow(84, 48, 84, 66, HL, 2.4), tag(84, 84, 1.4, coins(-4, 3, 2, 4), C.mint)),
  // häva köpet: the customer gives the box back across the counter and gets all her money back; the receipt is torn.
  'civil.häva-köpet': all(ground, rect(54, 84, 66, 28, '#b98a5e', 2, C.ink, 1.6), fig(94, C.navy, 'calm', { h: 0.74 }), fig(24, C.orange, 'calm', { h: 0.82, hairStyle: 'long' }), rect(42, 66, 18, 16, C.tan, 1, C.ink, 1.3), arrow(48, 58, 70, 58, C.grey, 2), bills(46, 40, 3, 0.8), arrow(66, 30, 46, 30, HL, 2), g('translate(90 16)', path('M-8 -8 L0 -8 L-2 0 L1 8 L-8 8 Z', C.white, C.ink, 1.1), path('M2 -8 L8 -8 L8 8 L3 8 L5 0 Z', C.white, C.ink, 1.1))),
  // i befintligt skick: an old bike with rust spots and a flat tyre; the seller shrugs with open hands, the buyer looks it over.
  'civil.i-befintligt-skick': all(ground, bike(60, 102, 1.3, '#9a7a5a'), ...[[52, 90], [64, 88], [70, 96]].map(([x, y]) => circle(x!, y!, 1.8, '#a0522d', null)), path('M38 108 L58 108', 'none', C.dark, 3), fig(18, C.dark, 'calm', { h: 0.8 }), reach(18, 0.8, -1, 6, 62), reach(18, 0.8, 1, 32, 62), fig(102, C.orange, 'calm', { h: 0.76, hairStyle: 'long' }), mag(84, 80, 0.8)),
  // dolt fel: inside a fine room the wall is cut open: behind the wallpaper there is a big crack and mould; the new owner is shocked.
  'civil.dolt-fel': all(rect(4, 10, 112, 102, '#f6efe2', 2, null), ground, rect(4, 10, 70, 102, '#e9d8b8', 0, C.ink, 1.2), path('M30 30 L58 30 L58 80 L30 80 Z', '#9a8a7a', C.ink, 1.4), path('M44 30 L48 44 L40 54 L50 66 L44 80', 'none', C.ink, 1.8), ...[[36, 40], [52, 70], [38, 70]].map(([x, y]) => circle(x!, y!, 3, '#5a7a4a', null)), circle(44, 55, 30, 'none', HL, 2.2), fig(96, C.green, 'shock', { h: 0.8 })),
  // vilseledande (symbol): the poster shows a huge shiny TV; what comes in the box is a small cracked one.
  'civil.vilseledande': all(ground, rect(8, 8, 56, 50, C.white, 3, C.ink, 1.8), tv(36, 34, 1.1), sparkle(56, 16, 4), sparkle(14, 50, 3), sparkle(20, 18, 3), arrow(44, 62, 62, 78, C.grey, 2), rect(66, 84, 34, 28, C.tan, 1, C.ink, 1.5), g('translate(83 78)', rect(-9, -7, 18, 13, C.dark, 2, C.ink, 1.2), path('M-4 -7 L0 -1 L-3 5', 'none', C.white, 1.2)), fig(104, C.green, 'shock', { h: 0.62 }), ex(110, 30, 14)),
  // Konsumentverket: the authority's office (flag) looks at a shop's advert through a magnifier, a shopping bag on the building.
  'civil.konsumentverket': all(ground, office(32, 82, 1, '#cfd8e2', true, bag(-10, -40, 0.5)), rect(74, 42, 38, 32, C.white, 2, C.ink, 1.6), tv(93, 58, 0.5), sparkle(106, 48, 2.4), mag(80, 60, 1.4), shop(92, 104, 0.4)),

  // ── 1443 Hyra och boenderätt ──
  // hyreslagen: the law book with a house on the cover and a key beside it.
  'civil.hyreslagen': all(ground, lawBook(52, 56, 2.6, house(0, -2, 0.42)), key(98, 90, 1.4, -30)),
  // hyresnämnden: three members behind a table with a balance; the landlord (keys) and the tenant (house bubble) sit in front on each side.
  'civil.hyresnämnden': all(ground, rect(26, 50, 68, 22, '#b98a5e', 2, C.ink, 1.6), ...[42, 60, 78].map((x) => mini(x, 38, C.dark, 'flat', 0.9)), scales(60, 18, 0.5), mini(14, 96, C.navy, 'flat', 1.1), key(20, 76, 0.7), mini(106, 96, C.orange, 'flat', 1.1, true), house(106, 72, 0.6)),
  // besittningsskydd (symbol): the tenant stands in her doorway with a shield; the landlord's arrow (out!) is stopped.
  'civil.besittningsskydd': all(ground, aptDoor(74, 112, 1.3), fig(74, C.orange, 'calm', { h: 0.64, hairStyle: 'long' }), shield(52, 70, 1.4, C.green), fig(18, C.navy, 'angry', { h: 0.82 }), key(28, 76, 0.6), arrow(30, 46, 46, 56, RED, 2.2), cross(48, 52, 1)),
  // svartkontrakt: in a dark doorway a hooded man hands over a key and a contract for a thick bundle of notes; red no-sign.
  'civil.svartkontrakt': all(rect(4, 6, 112, 106, '#3d3f4a', 2, null), ground, fig(28, C.black, 'calm', { h: 0.8 }), path('M20 37 C20 29 36 29 36 37 Z', C.black, C.ink, 1.2), rect(18, 35, 22, 3, C.black, 1, C.ink, 0.8), reach(28, 0.8, 1, 52, 64), contract(54, 70, 0.4, true), key(56, 58, 0.6), fig(94, C.green, 'calm', { h: 0.8 }), reach(94, 0.8, -1, 70, 66), bills(72, 70, 4, 0.7), circle(98, 18, 11, C.white, C.ink, 1.4), house(98, 18, 0.45), ban(98, 18, 11)),
  // ockerhyra (symbol): a tiny room with a mattress and a huge pile of notes as its rent; grey reference: a normal room with a few coins.
  'civil.ockerhyra': all(ground, rect(8, 66, 34, 46, '#e6d3b3', 1, C.ink, 1.6), rect(12, 98, 26, 8, C.white, 2, C.ink, 1.1), rect(13, 94, 8, 5, C.white, 2, C.ink, 0.9), rect(26, 74, 10, 10, '#9ad0f0', 1, C.ink, 1), bills(64, 104, 9, 1.2), arrow(44, 88, 52, 88, RED, 2), ex(88, 40, 22), greyed(rect(90, 80, 24, 32, '#e6d3b3', 1, C.ink, 1.2), rect(93, 102, 18, 6, C.white, 2, C.ink, 1), coins(102, 74, 2, 4))),
  // bruksvärde (symbol): a big, modern flat and a small, old one; the better flat costs more coins – the rent follows how good the home is.
  'civil.bruksvärde': all(ground, rect(10, 40, 44, 50, '#cfe3ff', 2, C.ink, 1.6), sofa(32, 80, 0.5), sparkle(46, 48, 4), sparkle(16, 50, 3), coins(32, 106, 5, 6), rect(74, 62, 30, 28, '#d9c7a8', 2, C.ink, 1.6), line('M80 70 L90 80 M96 66 L100 74', C.grey, 1), coins(89, 106, 2, 6), scales(60, 26, 0.6, -14)),
  // hyresskuld: the tenant has an empty wallet; on the doormat a pile of unpaid bills with red marks, the calendar months marked red.
  'civil.hyresskuld': all(ground, fig(28, C.orange, 'frown', { h: 0.82 }), reach(28, 0.82, 1, 48, 70), wallet(52, 70, 0.8, true), ...[0, 1, 2].map((i) => envelope(88, 104 - i * 9, 0.9, ex(8, 2, 8))), cal(92, 30, 1, [0, 1, 2], RED)),
  // förverka (symbol): the key to the flat falls from the tenant's hand, broken by unpaid bills and loud music.
  'civil.förverka': all(ground, aptDoor(96, 112, 1.1), fig(46, C.dark, 'shock', { h: 0.78 }), reach(46, 0.78, 1, 64, 66), key(74, 84, 1.2, 40), cross(74, 84, 1.2), envelope(18, 30, 0.7, ex(7, 2, 7)), notes(14, 60, 1.1), notes(26, 52, 0.8), arrow(30, 36, 40, 44, RED, 1.6)),
  // vräka: two removal workers carry the sofa out through the door; the tenant stands outside, sad.
  'civil.vräka': all(ground, rect(70, 20, 46, 92, '#e6d3b3', 1, C.ink, 1.6), rect(78, 50, 24, 62, '#3d3f4a', 1, C.ink, 1.4), sofa(52, 96, 0.6, C.purple), fig(30, C.grey, 'calm', { h: 0.7 }), fig(80, C.grey, 'calm', { h: 0.7 }), reach(30, 0.7, 1, 36, 84), reach(80, 0.7, -1, 70, 84), fig(12, C.orange, 'frown', { h: 0.58, hairStyle: 'long' }), arrow(56, 66, 40, 66, HL, 2)),
  // vräkning: a mother and a child stand on the pavement with boxes and suitcases; the door behind them is locked.
  'civil.vräkning': all(ground, rect(64, 16, 52, 96, '#e6d3b3', 1, C.ink, 1.6), aptDoor(90, 112, 1.2), g('translate(90 78)', rect(-5, -2, 10, 8, C.gold, 1.5, C.ink, 1), path('M-3 -2 L-3 -6 C-3 -10 3 -10 3 -6 L3 -2', 'none', C.ink, 1.4)), fig(24, C.orange, 'frown', { h: 0.82, hairStyle: 'long' }), fig(46, C.yellow, 'frown', { h: 0.5 }), rect(4, 96, 14, 16, C.tan, 1, C.ink, 1.2), rect(52, 98, 14, 14, C.tan, 1, C.ink, 1.2), rect(54, 86, 10, 12, C.tan, 1, C.ink, 1.2)),

  // ── 1444 Skadestånd och ansvar ──
  // skadestånd: the man whose ball broke the window pays the house owner; notes go from him to her.
  'civil.skadestånd': all(ground, rect(70, 22, 46, 90, '#e6d3b3', 1, C.ink, 1.6), brokenWin(80, 34, 26, 22), ball(98, 104, 4), fig(26, C.navy, 'frown', { h: 0.82 }), reach(26, 0.82, 1, 48, 70), bills(52, 70, 2, 0.7), fig(78, C.orange, 'calm', { h: 0.8, hairStyle: 'long' }), reach(78, 0.8, -1, 62, 74), arrow(46, 56, 64, 56, HL, 2)),
  // skadeståndslagen: the law book with a plaster on the cover, a broken vase beside it.
  'civil.skadeståndslagen': all(ground, lawBook(50, 56, 2.6, plaster(0, -1, -20)), vase(98, 110, 1.4, true)),
  // skadeståndsskyldig (symbol): a person stands at the broken vase; from him a red arrow leads to coins he must pay (§). Grey reference: an onlooker with no arrow.
  'civil.skadeståndsskyldig': all(ground, vase(26, 110, 1.4, true), fig(42, C.navy, 'frown', { h: 0.78 }), arrow(56, 44, 82, 44, RED, 2.4), coins(96, 52, 4, 7), para(96, 24, 14, BOOK), greyed(fig(102, C.grey, 'calm', { h: 0.56 }))),
  // skadevållare: the boy who kicked the ball is ringed; the dashed path goes from his foot to the broken window.
  'civil.skadevållare': all(ground, rect(72, 20, 44, 92, '#e6d3b3', 1, C.ink, 1.6), brokenWin(84, 34, 24, 22), fig(30, C.red, 'shock', { h: 0.68 }), ball(50, 106, 4), dash('M52 102 C66 70 80 50 92 44', C.grey, 1.4), ring(30, 74, 26), greyed(fig(104, C.grey, 'angry', { h: 0.56 }))),
  // skadelidande: the owner of the dented car stands beside it, sad (ring); the other car drives off grey.
  'civil.skadelidande': all(ground, car(46, 104, 1.8, C.green), path('M66 92 L72 98 L66 102', 'none', C.ink, 1.6), fig(92, C.orange, 'frown', { h: 0.82, hairStyle: 'long' }), ring(92, 64, 26), reach(92, 0.82, -1, 74, 90), greyed(car(18, 40, 0.8, C.grey))),
  // personskada: a person with his arm in a sling and a crutch, a plaster on his head; the bike lies on the ground.
  'civil.personskada': all(ground, fig(54, C.sky, 'frown', { h: 0.92 }), sling(54, 0.92), crutch(80, 58, 112), reach(54, 0.92, 1, 78, 62), plaster(52, 26, -20), g('translate(20 100) rotate(-70)', bike(0, 0, 0.7))),
  // sakskada: a phone with a smashed screen and a dented car door – things are broken, nobody is hurt.
  'civil.sakskada': all(ground, car(40, 102, 2, C.denim), path('M44 82 L50 90 L44 96 L52 100', 'none', C.ink, 1.8), g('translate(96 80) rotate(10)', rect(-10, -18, 20, 36, C.dark, 3, C.ink, 1.4), rect(-8, -15, 16, 30, '#9fd0f0', 1, null), path('M-6 -10 L2 -2 L-4 4 L6 12 M2 -2 L8 -8', 'none', C.white, 1.2))),
  // kränkningsersättning (symbol): a woman with a broken heart (hurt feelings after a crime) receives coins from a hand.
  'civil.kränkningsersättning': all(ground, fig(36, C.purple, 'frown', { h: 0.86, hairStyle: 'long' }), brokenHeart(36, 74, 1.1), sb(36, 0.86, 1, 22, 18, (cx, cy) => ex(cx, cy, 12)), arrow(98, 70, 70, 70, HL, 2.2), coins(104, 80, 4, 7), para(104, 50, 12, BOOK)),
  // orsakssamband (symbol): a hand pushes the first domino; one knocks over the next, and the last one breaks the vase.
  'civil.orsakssamband': all(ground, palm(10, 92, 0.9), domino(22, 112, 30), domino(38, 112, 28), domino(54, 112, 24), domino(70, 112, 14), domino(84, 112, 0), vase(104, 112, 1.2, true), arrow(20, 78, 92, 78, HL, 2)),
  // strikt ansvar (symbol): the dog owner did everything right (green tick, short leash), the dog still bit the man – and she pays him anyway. Grey reference: a careful person whose accident costs nothing (coins crossed).
  'civil.strikt-ansvar': all(ground, greyed(fig(14, C.grey, 'calm', { h: 0.56 }), coins(30, 104, 2, 4)), cross(30, 100, 0.9), okB(14, 44, 6), line('M38 14 L38 112', C.grey2, 1.4), fig(52, C.green, 'calm', { h: 0.84, hairStyle: 'long' }), okB(52, 10, 8), reach(52, 0.84, -1, 42, 76), line('M42 76 L72 96', C.ink, 2), g('translate(164 0) scale(-1 1)', dog(82, 100, 0.9)), fig(106, C.navy, 'angry', { h: 0.84 }), path('M95 95 l4 -3 l2 4 Z', C.white, C.ink, 0.8), reach(52, 0.84, 1, 70, 52), coins(74, 48, 3, 5), arrow(80, 40, 94, 40, RED, 2.2)),
  // medvållande (symbol): two cyclists crash; one has no lamp in the dark, the other looks at his phone – each owns half of the fault.
  'civil.medvållande': all(rect(4, 6, 112, 106, '#2f3240', 2, null), line('M4 112 L116 112', C.grey, 2), bike(36, 102, 1.1, C.sky), mini(36, 72, C.orange, 'shock', 1, true), bike(84, 102, 1.1, C.green), mini(84, 72, C.green, 'shock', 1), path('M96 92 L118 82 L118 104 Z', 'rgba(255,236,140,0.4)', null), circle(96, 92, 2, C.yellow, null), rect(76, 62, 6, 9, C.dark, 1, C.white, 0.6), pie(60, 30, 14, 0.5, C.orange, C.green), sparkle(60, 86, 6, C.yellow)),
  // hemförsäkring: the home under a big green umbrella keeps the rain off; the sofa and TV are safe inside.
  'civil.hemförsäkring': all(ground, rain(10, 112, 8), rain(14, 112, 20), umbrella(60, 42, 1.6), line('M60 42 L60 50', C.ink, 1.6), rect(24, 52, 72, 60, '#f3e6cf', 2, C.ink, 1.6), sofa(50, 104, 0.55), tv(80, 92, 0.6), check(60, 26, 1)),
  // självrisk: a repair bill split in two: the big part is covered by the insurance shield, the small part (ringed) is paid from her own wallet.
  'civil.självrisk': all(ground, rect(22, 8, 76, 26, C.white, 2, C.ink, 1.6), rect(24, 10, 56, 22, 'rgba(79,157,105,0.35)', 1, null), rect(80, 10, 16, 22, 'rgba(239,138,60,0.5)', 1, null), shield(40, 70, 1.4, C.green), arrow(40, 46, 40, 38, C.green, 2), fig(88, C.orange, 'calm', { h: 0.62, hairStyle: 'long' }), reach(88, 0.62, -1, 72, 74), wallet(66, 74, 0.6), arrow(80, 50, 88, 38, HL, 2), ring(88, 21, 14)),
  // ansvarsförsäkring: his ball broke the neighbour's window; his insurance (shield) pays the neighbour.
  'civil.ansvarsförsäkring': all(ground, rect(78, 22, 38, 90, '#e6d3b3', 1, C.ink, 1.6), brokenWin(86, 34, 22, 20), fig(26, C.navy, 'frown', { h: 0.76 }), ball(44, 106, 4), shield(54, 36, 1.2, C.green, coins(0, 4, 3, 5)), arrow(68, 40, 86, 70, HL, 2.2), fig(96, C.orange, 'smile', { h: 0.6, hairStyle: 'long' })),

  // ── 1445 Familjerättsliga frågor ──
  // familjerätt: a family of three under the law book with a heart on the cover.
  'civil.familjerätt': all(ground, lawBook(60, 26, 1.4, path('M0 4 C-6 0 -5 -5 -2 -5 C-1 -5 0 -4 0 -3 C0 -4 1 -5 2 -5 C5 -5 6 0 0 4 Z', C.gold, null)), fig(32, C.navy, 'smile', { h: 0.76 }), fig(88, C.orange, 'smile', { h: 0.74, hairStyle: 'long' }), fig(60, C.yellow, 'smile', { h: 0.48 }), reach(32, 0.76, 1, 50, 82), reach(88, 0.74, -1, 70, 82)),
  // äktenskapsbalken: the law book with two wedding rings on the cover.
  'civil.äktenskapsbalken': all(ground, lawBook(56, 58, 2.8, ringPair(0, 0, 0.6))),
  // betänketid: a couple sits at the two ends of the sofa, turned away; between them an hourglass, and the calendar shows half a year.
  'civil.betänketid': all(ground, sofa(60, 104, 1.5, C.grey), mini(26, 74, C.navy, 'frown', 1.1), mini(94, 74, C.orange, 'frown', 1.1, true), hourglass(60, 64, 1.2), cal(60, 22, 1, [0, 1, 2, 3, 4, 5], HL)),
  // bodelning: a line splits everything the couple owns into two equal halves: coins, sofa and TV on either side.
  'civil.bodelning': all(ground, dash('M60 8 L60 112', HL, 2.2), mini(20, 22, C.navy, 'flat', 1.1), mini(100, 22, C.orange, 'flat', 1.1, true), coins(40, 50, 3, 6), coins(80, 50, 3, 6), sofa(30, 96, 0.5, C.purple), tv(88, 92, 0.7), arrow(52, 74, 38, 74, C.grey, 1.6), arrow(68, 74, 82, 74, C.grey, 1.6)),
  // giftorätt (symbol): after the wedding (rings) she still owns her house and he his car, but each has a dashed claim to half (half-pie) of the other's things. Grey reference: an unmarried couple – no claims.
  'civil.giftorätt': all(ground, ringPair(46, 12, 1.1), mini(16, 50, C.orange, 'smile', 1, true), mini(76, 50, C.navy, 'smile', 1), house(16, 92, 0.9), car(76, 98, 0.7), dash('M24 58 C40 70 56 80 66 90', HL, 2), dash('M68 58 C52 70 36 78 26 86', HL, 2), pie(46, 74, 7, 0.5, HL, C.white), line('M96 14 L96 112', C.grey2, 1.4), greyed(ringPair(108, 22, 0.6), mini(102, 60, C.grey, 'flat', 0.6, true), mini(114, 60, C.grey, 'flat', 0.6), house(102, 92, 0.45), car(114, 98, 0.35)), cross(108, 22, 0.9)),
  // äktenskapsförord: the couple sign a document at the table; the rings and a house with a padlock are on the sheet.
  'civil.äktenskapsförord': all(table(86, 10, 110), fig(20, C.navy, 'smile', { h: 0.86 }), fig(100, C.orange, 'smile', { h: 0.86, hairStyle: 'long' }), doc(60, 64, 1.1, all(ringPair(0, -10, 0.45), house(-4, 2, 0.4), g('translate(7 6)', rect(-3, -1, 6, 5, C.gold, 1, C.ink, 0.6), path('M-2 -1 L-2 -3 C-2 -5 2 -5 2 -3 L2 -1', 'none', C.ink, 0.8)), line('M-11 13 L-2 13 M2 13 L11 13', C.ink, 1)), 0), reach(20, 0.86, 1, 50, 78), reach(100, 0.86, -1, 70, 78), pen(52, 76, 0.6, 30)),
  // enskild egendom (symbol): in the split the coins are halved, but the cottage behind its own fence stays wholly on her side.
  'civil.enskild-egendom': all(ground, dash('M50 40 L50 112', C.grey, 1.6), coins(32, 100, 3, 5), coins(66, 100, 3, 5), mini(32, 66, C.navy, 'flat', 1), mini(68, 66, C.orange, 'smile', 1, true), house(98, 34, 1.1, '#c96f4a'), line('M80 52 L116 52', C.brown, 2), ...[82, 90, 98, 106, 114].map((x) => line(`M${x} 46 L${x} 56`, C.brown, 2)), arrow(92, 60, 76, 70, HL, 2), ring(98, 34, 22)),
  // sambolagen: the law book with a house on the cover; an unmarried couple at home (no rings – the rings are crossed out).
  'civil.sambolagen': all(ground, lawBook(26, 40, 1.6, house(0, -2, 0.32)), house(84, 66, 2.2, '#f0d9b5'), mini(76, 100, C.navy, 'smile', 0.9), mini(94, 100, C.orange, 'smile', 0.9, true), greyed(ringPair(26, 86, 1.2)), cross(26, 86, 1.4)),
  // gemensam vårdnad: two parents, each with their own house behind, both hold the child's hands.
  'civil.gemensam-vårdnad': all(ground, house(16, 34, 1, '#cfe3ff'), house(104, 34, 1, '#f6c9d4'), fig(26, C.navy, 'smile', { h: 0.84 }), fig(94, C.orange, 'smile', { h: 0.84, hairStyle: 'long' }), fig(60, C.yellow, 'smile', { h: 0.5 }), reach(26, 0.84, 1, 50, 84), reach(94, 0.84, -1, 70, 84), arm(52, 78, 50, 84), arm(68, 78, 70, 84)),
  // umgänge (2): the child with a backpack walks from mum's house to dad's, who waits with open arms; the weekend is marked in the calendar.
  'civil.umgänge.2': all(ground, house(18, 96, 1.5, '#f6c9d4'), fig(96, C.navy, 'laugh', { h: 0.84 }), reach(96, 0.84, -1, 78, 60), reach(96, 0.84, 1, 112, 60), fig(56, C.yellow, 'smile', { h: 0.5 }), backpack(48, 92, 0.8), arrow(64, 104, 76, 104, HL, 2), cal(56, 22, 1, [5, 8], HL)),
  // underhållsbidrag: every month (calendar) the father sends money to his child, who lives with the mother in another house.
  'civil.underhållsbidrag': all(ground, fig(20, C.navy, 'calm', { h: 0.84 }), house(92, 66, 2.2, '#f6c9d4'), fig(84, C.orange, 'smile', { h: 0.5, hairStyle: 'long' }), fig(102, C.yellow, 'smile', { h: 0.4 }), arrow(36, 54, 68, 54, HL, 2.4), bills(52, 44, 2, 0.6), cal(40, 18, 0.8, [0, 1, 2, 3, 4, 5, 6, 7, 8], C.green)),
  // faderskap: a man holds his newborn baby and signs the paper that he is the father.
  'civil.faderskap': all(ground, table(88, 60, 116), fig(34, C.green, 'love', { h: 0.92 }), baby(36, 56, 1.1), reach(34, 0.92, -1, 26, 62), reach(34, 0.92, 1, 76, 82), doc(88, 72, 0.8, all(baby(0, -6, 0.6), line('M-9 13 L9 13', C.ink, 1), sig(0, 11)), 0), pen(80, 80, 0.6, 40)),
  // arvinge: a framed portrait with a black band and flowers; from it arrows lead the house and the coins to the two grown children.
  'civil.arvinge': all(ground, portrait(60, 24, 1.3), flower(48, 48, 0.8), flower(72, 48, 0.8), arrow(44, 30, 28, 44, HL, 2), arrow(76, 30, 92, 44, HL, 2), house(16, 40, 0.7), coins(106, 46, 3, 5), fig(30, C.navy, 'calm', { h: 0.6 }), fig(90, C.orange, 'calm', { h: 0.6, hairStyle: 'long' })),
  // testamente: an old woman writes and signs the document at her desk; two witnesses stand behind and watch.
  'civil.testamente': all(table(86, 30, 116), fig(44, C.purple, 'calm', { h: 0.84, hairStyle: 'long', hair: C.silver }), reach(44, 0.84, 1, 70, 82), doc(84, 74, 0.7, all(line('M-9 13 L9 13', C.ink, 1), sig(0, 11)), 4, C.grey2, '#fff7dc'), pen(74, 78, 0.6, 30), mini(84, 40, C.green, 'flat', 1), mini(106, 40, C.sky, 'flat', 1), dash('M84 50 L84 60', C.grey, 1), dash('M104 50 L94 62', C.grey, 1)),
  // laglott (symbol): the parent who died (portrait) wrote a will giving everything to someone else, but the child still keeps a shielded slice of the pie. Grey reference: without a will the child gets the whole pie.
  'civil.laglott': all(ground, portrait(18, 24, 0.8), doc(18, 64, 0.7, sig(0, 11), 4, C.grey2, '#fff7dc'), arrow(30, 56, 44, 56, C.grey, 1.6), pie(66, 52, 20, 0.75, C.purple, C.yellow), mini(90, 98, C.purple, 'smile', 1.1), arrow(76, 66, 86, 82, C.purple, 1.6), mini(48, 98, C.yellow, 'smile', 1, true), shield(58, 44, 0.5, C.green), arrow(56, 62, 50, 82, C.yellow, 2), line('M100 8 L100 70', C.grey2, 1.2), greyed(pie(110, 24, 8, 0.999, C.yellow, C.yellow), mini(110, 52, C.grey, 'smile', 0.6, true))),
  // bouppteckning: after the death (portrait with a black band) a relative lists everything: the house, the car, coins and the red unpaid bills.
  'civil.bouppteckning': all(ground, portrait(22, 24, 0.9), table(86, 4, 116), mini(22, 76, C.navy, 'flat', 1.1), rect(42, 10, 52, 74, C.white, 2, C.ink, 1.6), house(52, 22, 0.42), check(80, 22, 0.6), car(53, 38, 0.38), check(80, 38, 0.6), coins(52, 56, 2, 4), check(80, 54, 0.6), envelope(53, 70, 0.4, ex(5, 1, 6)), check(80, 70, 0.6), pen(100, 74, 0.7, 30)),

  // ── 1446 Arbetsrättens grunder ──
  // arbetsrätt: the law book with a hard hat on the cover, the factory beside it.
  'civil.arbetsrätt': all(ground, lawBook(38, 56, 2.4, helmet(0, 0, 0.6, C.gold)), factory(92, 92, 0.75)),
  // arbetstagare: the worker in overalls and a hard hat at the factory, ringed, gets her pay envelope from the boss (grey).
  'civil.arbetstagare': all(ground, factory(28, 52, 0.7), fig(46, C.orange, 'smile', { h: 0.84, bottom: C.orange }), hat(46, 0.84), ring(46, 54, 30), greyed(fig(100, C.grey, 'calm', { h: 0.84 }), tie(100, 0.84, C.grey)), reach(100, 0.84, -1, 78, 74), envelope(72, 74, 0.6), reach(46, 0.84, 1, 64, 74)),
  // anställningsavtal: at the desk the boss (tie) and the new worker (hard hat on the table) sign the employment contract.
  'civil.anställningsavtal': all(table(86, 10, 110), fig(20, C.navy, 'smile', { h: 0.86 }), tie(20, 0.86), fig(100, C.orange, 'smile', { h: 0.86, hairStyle: 'long' }), contract(60, 70, 0.75, true, true), helmet(86, 82, 0.8), reach(20, 0.86, 1, 46, 80), reach(100, 0.86, -1, 72, 80)),
  // tillsvidareanställning (symbol): from the contract a long time line runs on and on with no end, past many calendars.
  'civil.tillsvidareanställning': all(ground, contract(20, 40, 0.9, true), mini(20, 86, C.orange, 'smile', 1.1), line('M36 60 L110 60', C.green, 4), ...[50, 70, 90].map((x) => cal(x, 40, 0.5)), path('M110 54 L118 60 L110 66 Z', C.green, null), ...[96, 102, 108].map((x) => circle(x, 76, 1.8, C.green, null))),
  // visstidsanställning (symbol): from the contract a short time line ends at a red stop post, with the end month marked in the calendar.
  'civil.visstidsanställning': all(ground, contract(20, 40, 0.9, true), mini(20, 86, C.orange, 'smile', 1.1), line('M36 60 L80 60', C.green, 4), line('M82 46 L82 74', RED, 4), cal(98, 40, 0.7, [5], RED), greyed(line('M86 60 L112 60', C.grey, 2, '3 3'))),
  // anställningsskydd: the worker at her machine is protected by a shield; the boss's arrow (out!) bounces off.
  'civil.anställningsskydd': all(ground, conveyor(60, 116, 82), fig(84, C.orange, 'calm', { h: 0.76, bottom: C.orange }), hat(84, 0.76), shield(58, 52, 1.6, C.green), fig(18, C.navy, 'angry', { h: 0.84 }), tie(18, 0.84), arrow(30, 40, 42, 46, RED, 2.2), cross(44, 44, 1)),
  // uppsägning (2): the boss hands the worker a letter; she is sad; the calendar marks the months of notice that are left.
  'civil.uppsägning.2': all(ground, fig(24, C.navy, 'calm', { h: 0.88 }), tie(24, 0.88), reach(24, 0.88, 1, 52, 66), envelope(58, 64, 0.7), fig(90, C.orange, 'frown', { h: 0.84, bottom: C.orange }), reach(90, 0.84, -1, 66, 70), cal(96, 18, 0.8, [0, 1], HL)),
  // arbetsbrist: the conveyor in the factory is empty, the order list is short and the arrow goes down; two workers stand idle.
  'civil.arbetsbrist': all(ground, conveyor(10, 76, 74), rect(30, 64, 12, 10, C.tan, 1, C.ink, 1), mini(86, 96, C.orange, 'frown', 1), mini(106, 96, C.green, 'frown', 1), doc(98, 30, 0.9, '', 1), arrow(70, 22, 80, 40, RED, 2.2), line('M14 30 L30 34 L44 30 L60 44', RED, 2)),
  // sakliga skäl (symbol): the notice letter is backed by a real reason that the law book accepts – an empty order list or a worker asleep at work (ticks). Grey reference: a boss who only dislikes a worker's face – crossed.
  'civil.sakliga-skäl': all(ground, envelope(60, 20, 1), lawBook(96, 24, 0.7), check(96, 46, 0.9), arrow(32, 52, 50, 34, C.green, 2), arrow(84, 52, 70, 34, C.green, 2), doc(26, 66, 0.7, '', 1), okB(36, 80, 6), mini(80, 70, C.orange, 'flat', 1), T(92, 58, 'z', 8, C.navy), T(98, 52, 'z', 6, C.navy), okB(90, 84, 6), line('M4 92 L116 92', C.grey2, 1.2), greyed(mini(40, 106, C.grey, 'frown', 0.7), mini(76, 106, C.grey, 'smile', 0.7), arrow(48, 104, 66, 104, C.grey, 1.4)), cross(58, 98, 0.8)),
  // turordning: four workers stand in line by years of work (bars above them); the one with the fewest years goes out of the door first.
  'civil.turordning': all(ground, ...[0, 1, 2].map((i) => all(rect(10 + i * 24, 76 - (36 - i * 12), 14, 36 - i * 12, C.green, 1, C.ink, 1), mini(17 + i * 24, 96, [C.navy, C.orange, C.purple][i]!, 'flat', 1.1))), rect(82, 71, 14, 5, RED, 1, C.ink, 1), mini(89, 96, C.sky, 'frown', 1.1), rect(100, 54, 16, 58, C.brown, 1, C.ink, 1.4), arrow(90, 106, 104, 106, HL, 2)),
  // företrädesrätt: the factory gate opens again with a job (hard hat on a hook); the woman who was laid off is first in the queue.
  'civil.företrädesrätt': all(ground, factory(90, 66, 0.9), helmet(84, 38, 0.9), mini(60, 98, C.orange, 'smile', 1.2, true), ring(60, 96, 14), greyed(mini(36, 98, C.grey, 'flat', 1), mini(16, 98, C.grey, 'flat', 1)), arrow(68, 84, 80, 74, HL, 2)),
  // avsked: the worker leaves through the door the same day with his things in a box; the calendar shows today with a flash.
  'civil.avsked': all(ground, rect(78, 30, 34, 82, '#3d3f4a', 1, C.ink, 1.6), fig(58, C.orange, 'frown', { h: 0.82, bottom: C.orange }), rect(48, 66, 22, 16, C.tan, 1, C.ink, 1.3), arrow(72, 104, 90, 104, HL, 2), cal(22, 28, 1.1, [4], RED), path('M28 50 L22 62 L27 62 L23 72', 'none', C.yellow, 2.4)),
  // avskeda: the boss sends away the worker caught with money from the till; the boss's open hand shows the way out.
  'civil.avskeda': all(ground, rect(4, 70, 30, 42, C.dark, 2, C.ink, 1.4), rect(8, 62, 22, 8, C.silver, 1, C.ink, 1.2), fig(48, C.orange, 'shock', { h: 0.78, bottom: C.orange }), reach(48, 0.78, -1, 30, 66), bill(28, 62, 0.6), fig(92, C.navy, 'angry', { h: 0.88 }), tie(92, 0.88), reach(92, 0.88, 1, 112, 52), palm(112, 50, 0.9), arrow(100, 26, 116, 26, RED, 2)),
  // LAS: the law book with a shield on the cover, and a worker in a hard hat beside it.
  'civil.las': all(ground, lawBook(40, 56, 2.4, shield(0, 0, 0.32, C.gold)), fig(94, C.orange, 'smile', { h: 0.8, bottom: C.orange }), hat(94, 0.8)),
  // kollektivavtal: a group of workers (hard hats) and a group of employers (ties) shake hands over one big contract for everybody.
  'civil.kollektivavtal': all(ground, contract(60, 32, 1.1, true, true), handshake(60, 66, 0.9, C.orange, C.navy), ...[12, 28].map((x) => all(mini(x, 96, C.orange, 'smile', 1.1), helmet(x, 78, 0.9))), ...[92, 108].map((x) => all(mini(x, 96, C.navy, 'smile', 1.1), path(`M${x} 104 l-1.6 3 l1.6 6 l1.6 -6 Z`, RED, null)))),
  // Arbetsdomstolen: the court building with a hard hat on the steps.
  'civil.arbetsdomstolen': all(ground, court(60, 74, 1.7), helmet(60, 106, 1.2)),

  // ── 1447 Tvister och förlikning ──
  // tvist (as tvistemål): two people stand on either side of the judge's bench and argue about money; no police, just a claim.
  'civil.tvistemål': all(ground, bench(36, 84, 70), mini(60, 58, C.dark, 'flat', 1.1), scales(60, 26, 0.5), fig(16, C.green, 'angry', { h: 0.74 }), fig(104, C.orange, 'angry', { h: 0.74, hairStyle: 'long' }), sb(16, 0.74, 1, 18, 16, (cx, cy) => coins(cx, cy + 3, 2, 4), -12), sb(104, 0.74, -1, 18, 16, (cx, cy) => cross(cx, cy, 0.8), -12)),
  // kärande: the woman (ringed) hands in her claim (a paper with coins) at the court.
  'civil.kärande': all(ground, court(84, 84, 1), fig(28, C.green, 'calm', { h: 0.84, hairStyle: 'long' }), ring(28, 54, 28), reach(28, 0.84, 1, 50, 66), invoice(58, 62, 0.6), arrow(64, 50, 76, 50, HL, 2)),
  // svarande: the man (ringed) gets the claim from the court in a letter and says no.
  'civil.svarande': all(ground, court(24, 84, 1), arrow(44, 50, 58, 50, HL, 2), fig(90, C.navy, 'frown', { h: 0.84 }), ring(90, 54, 28), reach(90, 0.84, -1, 66, 66), envelope(62, 66, 0.6), sb(90, 0.84, 1, 20, 18, (cx, cy) => noB(cx, cy, 6))),
  // väcka talan: she posts her claim into the court's letterbox – the case starts.
  'civil.väcka-talan': all(ground, court(76, 66, 1.4), rect(64, 90, 24, 8, C.dark, 1, C.ink, 1.2), fig(22, C.green, 'calm', { h: 0.84, hairStyle: 'long' }), reach(22, 0.84, 1, 52, 82), invoice(58, 82, 0.5), arrow(46, 70, 62, 84, HL, 2)),
  // bestrida: he holds the invoice, crosses it out and shakes his head – he will not pay.
  'civil.bestrida': all(ground, fig(36, C.navy, 'angry', { h: 0.9 }), reach(36, 0.9, 1, 66, 60), invoice(78, 58, 1.2), cross(78, 58, 2.4), sb(36, 0.9, -1, 20, 18, (cx, cy) => noB(cx, cy, 6)), path('M24 26 C20 24 20 20 24 18 M48 26 C52 24 52 20 48 18', 'none', C.ink, 1.2)),
  // Kronofogden: an official from the authority (office with a flag) puts a red seal on the car of someone who has not paid.
  'civil.kronofogden': all(ground, office(22, 74, 0.8), car(80, 102, 1.6, C.denim), circle(88, 86, 5, RED, C.ink, 1), fig(64, C.dark, 'calm', { h: 0.8 }), reach(64, 0.8, 1, 84, 86), rect(44, 58, 12, 16, '#d9c7a8', 1, C.ink, 1), reach(64, 0.8, -1, 52, 66)),
  // betalningsföreläggande: from the authority a letter with the invoice and a red mark flies to the man who has not paid.
  'civil.betalningsföreläggande': all(ground, office(24, 74, 0.8), arrow(42, 44, 66, 44, HL, 2), envelope(80, 36, 1, ex(7, 2, 9)), invoice(80, 66, 0.6, cross(0, -6, 0.6)), fig(98, C.green, 'shock', { h: 0.76 })),
  // förenklat tvistemål (symbol): a small court with a small coin – quick and cheap; grey reference: a big court with a big pile of coins.
  'civil.förenklat-tvistemål': all(ground, court(36, 82, 0.9), coins(36, 108, 1, 5), hourglass(70, 92, 0.7), greyed(court(96, 70, 1.2, C.grey2), coins(96, 108, 5, 7))),
  // medling: at a round table a mediator sits between two people and helps them; their bubbles meet in the middle.
  'civil.medling': all(ground, ellipse(60, 86, 46, 8, C.tan, C.ink, 1.6), line('M60 94 L60 112', C.brown, 3), mini(18, 70, C.green, 'flat', 1.1), mini(102, 70, C.orange, 'flat', 1.1, true), mini(60, 62, C.sky, 'smile', 1.2), arrow(28, 40, 46, 30, C.grey, 1.6), arrow(92, 40, 74, 30, C.grey, 1.6), check(60, 26, 1.2)),
  // förlikning: in front of the judge the two sides shake hands over the document they both signed; each takes half the coins.
  'civil.förlikning': all(ground, bench(36, 84, 70), mini(60, 58, C.dark, 'smile', 1.1), fig(18, C.green, 'smile', { h: 0.74 }), fig(102, C.orange, 'smile', { h: 0.74, hairStyle: 'long' }), armTo(18, 0.74, 1, 38, 50), armTo(102, 0.74, -1, 82, 50), handshake(60, 50, 0.8, C.green, C.orange), contract(60, 22, 0.6, true, true)),
  // förlikas: the storm cloud between them is gone; the two who quarrelled now shake hands and smile.
  'civil.förlikas': all(ground, fig(24, C.green, 'laugh', { h: 0.86 }), fig(96, C.orange, 'laugh', { h: 0.86, hairStyle: 'long' }), armTo(24, 0.86, 1, 46, 62), armTo(96, 0.86, -1, 74, 62), handshake(60, 62, 0.9, C.green, C.orange), greyed(storm(60, 22, 1.1)), cross(60, 26, 1.6)),
  // rättegångskostnad: the bills for the case pile up – the lawyer (briefcase), the witness and the court – and the loser pays them.
  'civil.rättegångskostnad': all(ground, ...[0, 1, 2].map((i) => doc(34 + i * 6, 40 + i * 10, 0.9, ellipse(-5, 10, 4, 2, C.gold, C.ink, 0.9), 2)), briefcase(26, 22, 0.8), mini(56, 22, C.grey, 'flat', 0.7), scales(80, 30, 0.4), fig(94, C.navy, 'frown', { h: 0.72 }), reach(94, 0.72, -1, 72, 80), wallet(66, 82, 0.7, true)),
  // rättsskyddsförsäkring: a shield covers the woman and her lawyer (briefcase) on the way to the court.
  'civil.rättsskyddsförsäkring': all(ground, court(98, 88, 0.6), shield(44, 60, 3.2, 'rgba(79,157,105,0.22)'), fig(30, C.orange, 'calm', { h: 0.62, hairStyle: 'long' }), fig(58, C.navy, 'calm', { h: 0.66 }), tie(58, 0.66), briefcase(72, 98, 0.8)),
  // rättshjälp: the state (office with a flag) pays part of the lawyer's bill for the man with the empty wallet.
  'civil.rättshjälp': all(ground, office(26, 70, 0.8), arrow(44, 54, 70, 54, HL, 2), coins(58, 48, 2, 4), fig(84, C.navy, 'calm', { h: 0.76 }), tie(84, 0.76), briefcase(98, 100, 0.7), mini(60, 98, C.green, 'frown', 1), wallet(40, 104, 0.6, true)),
  // skiljeförfarande: behind a closed door three chosen deciders sit at a table with two business people (ties) – not in a public court.
  'civil.skiljeförfarande': all(rect(4, 8, 112, 104, '#f2ece0', 2, null), ground, rect(96, 32, 18, 80, C.brown, 1, C.ink, 1.4), g('translate(105 70)', rect(-3, -2, 6, 5, C.gold, 1, C.ink, 0.6), path('M-2 -2 L-2 -4 C-2 -6 2 -6 2 -4 L2 -2', 'none', C.ink, 0.8)), rect(14, 58, 72, 6, C.tan, 2, C.ink, 1.6), ...[30, 50, 70].map((x) => mini(x, 46, C.dark, 'flat', 0.9)), mini(20, 96, C.navy, 'flat', 1), mini(78, 96, C.green, 'flat', 1), path('M20 104 l-1.4 3 l1.4 6 l1.4 -6 Z', RED, null), path('M78 104 l-1.4 3 l1.4 6 l1.4 -6 Z', RED, null)),
  // skiljedom: the three deciders hand down a sealed document; one business person is happy, the other is not.
  'civil.skiljedom': all(ground, ...[30, 50, 70].map((x) => mini(x, 30, C.dark, 'flat', 0.9)), rect(14, 42, 72, 6, C.tan, 2, C.ink, 1.6), doc(98, 30, 0.8, circle(6, 10, 4, RED, C.ink, 0.8), 3), mini(30, 96, C.navy, 'smile', 1.2), check(30, 72, 1), mini(80, 96, C.green, 'frown', 1.2), cross(80, 72, 1), arrow(90, 48, 80, 70, C.grey, 1.4), arrow(96, 50, 40, 74, C.grey, 1.4)),
};
