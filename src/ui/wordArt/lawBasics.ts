/**
 * Samhälle & institutioner → Juridik & rättsväsende → Rättens grunder, 1401–1407: laws and ordinances,
 * rights and duties, legal persons, sources of law, legal concepts, reading a statute, and public and
 * private law. Almost every word is abstract, so the pictures are small symbolic scenes built from a
 * few recurring signs: the red law book (a law), white sheets (documents, contracts), the § sign, the
 * balance (a court or justice, as on the Japanese lawyer's badge), the Riksdag building (the
 * legislator), an office block with a flag (an authority), a plain block (a company), green and red
 * marks, and a grey reference where a contrast helps. No gavels (courts in Sweden and Japan do not use
 * them) and no words in the pictures.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, star, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm, padlock } from './people';
import { P as F, type Mood, greyed, coin } from './blindFix';
import { checkIcon } from './labelIcons';

// ── Geometry and figures ─────────────────────────────────────────────
const RED = '#e8302c';
const BOOK = '#8a2b2b';
const f1 = (n: number) => n.toFixed(1);
const ground = line('M4 112 L116 112', C.grey2, 2);
/** Head and shoulder positions of a standing figure (figures.ts) at x with height factor h. */
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, hy: ty - 56 * s, hr: 10 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const hnd = (x: number, y: number, r = 3) => circle(x, y, r, C.skin, C.ink, 1.2);
/** An arm that starts at the shoulder (side −1 = picture-left, 1 = picture-right) and ends in a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q0 = geo(x, h); return all(arm(side < 0 ? q0.sl : q0.sr, q0.sy, tx, ty), hnd(tx, ty, 3 * Math.max(0.7, h))); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Small head-and-shoulders person; mood smile | frown | flat. */
const mini = (x: number, y: number, col: string, mood: 'smile' | 'frown' | 'flat' = 'smile', s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-10 16 C-10 4 10 4 10 16 Z', col, C.ink, 1.4), circle(0, -6, 7.5, C.skin, C.ink, 1.4), path('M-7.5 -8 C-7.5 -16 7.5 -16 7.5 -8 C4 -11 -4 -11 -7.5 -8 Z', C.hair, null),
  all(circle(-2.6, -6, 1, C.ink, null), circle(2.6, -6, 1, C.ink, null)),
  mood === 'smile' ? path('M-2.6 -2.6 Q0 -0.6 2.6 -2.6', 'none', C.ink, 1.1) : mood === 'flat' ? line('M-2.4 -2 L2.4 -2', C.ink, 1.1) : path('M-2.6 -1.4 Q0 -3.4 2.6 -1.4', 'none', C.ink, 1.1));
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

// ── Marks ────────────────────────────────────────────────────────────
const q = (x: number, y: number, sz = 13, col: string = C.navy) => T(x, y + sz * 0.36, '?', sz, col);
const ex = (x: number, y: number, sz = 13, col: string = HL) => T(x, y + sz * 0.36, '!', sz, col);
const para = (x: number, y: number, sz = 14, col: string = C.navy) => T(x, y + sz * 0.36, '§', sz, col);
const num = (x: number, y: number, s: string, sz = 10, col: string = C.ink) => T(x, y + sz * 0.36, s, sz, col);
const cross = (x: number, y: number, s = 1, col: string = RED) => line(`M${x - 5 * s} ${y - 5 * s} L${x + 5 * s} ${y + 5 * s} M${x + 5 * s} ${y - 5 * s} L${x - 5 * s} ${y + 5 * s}`, col, 2.4 * s);
const check = (x: number, y: number, s = 1, col: string = C.green) => checkIcon(x, y, s, col);
const okB = (x: number, y: number, r = 8) => all(circle(x, y, r, C.green, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, r * 0.22));
const noB = (x: number, y: number, r = 8) => all(circle(x, y, r, RED, C.ink, 1.2), line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, C.white, r * 0.22));
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const palm = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ...[-4.6, -1.6, 1.4, 4.4].map((d, i) => rect(d - 1.3, -9 + Math.abs(i - 1.5) * 1.2, 2.6, 9, C.skin, 1.3, C.ink, 0.9)), path('M-5.5 -1 L5.5 -1 L5 5 C4 8 -4 8 -5 5 Z', C.skin, C.ink, 1), path('M-5.4 1 L-9 -3 C-10 -4 -11 -2 -10 -1 L-5 5', C.skin, C.ink, 1));
/** Arrow made of a curved path. */
const curveArrow = (d: string, ex2: number, ey: number, ang: number, col: string = HL, w = 2) => all(line(d, col, w), g(`translate(${ex2} ${ey}) rotate(${ang})`, path('M0 0 L-6 -3.4 L-6 3.4 Z', col, null)));

// ── Things ───────────────────────────────────────────────────────────
const lines = (x: number, y: number, w: number, n = 3, col: string = C.grey) => all(...Array.from({ length: n }, (_, i) => line(`M${x - w / 2} ${y + i * 4.4} L${x + w / 2 - (i === n - 1 ? w * 0.35 : 0)} ${y + i * 4.4}`, col, 1.6)));
/** A sheet of paper with text lines; `marks` in the sheet's own coordinates (−14…14, −18…18). */
const doc = (x: number, y: number, s = 1, marks: Svg = '', n = 5, col: string = C.grey2, fill: string = C.white) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -18, 28, 36, fill, 2, C.ink, 1.6), ...Array.from({ length: n }, (_, i) => line(`M-9 ${-11 + i * 6} L9 ${-11 + i * 6}`, col, 2)), marks);
/** A contract: a sheet with a signature line at the bottom. */
const contract = (x: number, y: number, s = 1, signed = true) => doc(x, y, s, all(line('M-9 12 L9 12', C.ink, 1), signed ? path('M-8 10 C-5 4 -3 12 0 7 C2 4 4 10 7 8', 'none', C.navy, 1.4) : ''), 4);
/** The law book: thick, dark red, gold bands, § on the cover. */
const lawBook = (x: number, y: number, s = 1, col = BOOK, mark = true) => g(`translate(${x} ${y}) scale(${s})`, rect(-13, -16, 26, 32, col, 2, C.ink, 1.6), rect(-13, -16, 5, 32, '#5e1c1c', 1, null), line('M-6 -11 L9 -11 M-6 11 L9 11', C.gold, 2), mark ? T(1.5, 5, '§', 13, C.gold) : '', rect(11, -14, 3, 28, '#f3ead6', 0.5, C.ink, 0.8));
/** An open book; `l` and `r` are drawn on the left and right page (page centres at −13 and 13). */
const openBook = (x: number, y: number, s = 1, l: Svg = '', r: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, path('M0 -14 C-8 -18 -20 -18 -26 -15 L-26 15 C-20 12 -8 12 0 16 Z', C.white, C.ink, 1.5), path('M0 -14 C8 -18 20 -18 26 -15 L26 15 C20 12 8 12 0 16 Z', C.white, C.ink, 1.5), line('M0 -14 L0 16', C.ink, 1.2), l, r);
const mag = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 8, 'rgba(220,240,252,0.7)', C.ink, 2), line('M5.6 5.6 L12 12', C.ink, 3));
const pen = (x: number, y: number, s = 1, rot = 35) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-2, -14, 4, 22, C.navy, 1, C.ink, 1), path('M-2 8 L0 13 L2 8 Z', C.tan, C.ink, 0.8));
const cal = (x: number, y: number, s = 1, hi: number[] = [], col: string = HL) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -14, 28, 28, C.white, 2, C.ink, 1.4), rect(-14, -14, 28, 7, RED, 2, C.ink, 1.4), ...Array.from({ length: 9 }, (_, i) => rect(-11 + (i % 3) * 8, -4 + Math.floor(i / 3) * 6, 6, 4.4, hi.includes(i) ? col : C.grey2, 0.8, null)));
const hourglass = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M-8 -12 L8 -12 M-8 12 L8 12', C.brown, 2.4), path('M-6 -11 L6 -11 L1 0 L6 11 L-6 11 L-1 0 Z', 'rgba(220,240,252,0.7)', C.ink, 1.2), path('M-5 10 L5 10 L0 3 Z', C.tan, null));
const handshake = (x: number, y: number, s = 1, c1: string = C.navy, c2: string = C.navy) => g(`translate(${x} ${y}) scale(${s})`, rect(-22, -4, 12, 9, c1, 2, C.ink, 1.2), rect(10, -4, 12, 9, c2, 2, C.ink, 1.2), path('M-10 -4 C-4 -8 4 -8 10 -4 L10 5 C4 8 -4 8 -10 5 Z', C.skin, C.ink, 1.2), line('M-4 -5 L-2 5 M0 -6 L2 5 M4 -5 L5 4', C.ink, 0.8));
const coins = (x: number, y: number, n = 3, r = 5) => all(...Array.from({ length: n }, (_, i) => ellipse(x, y - i * 3, r, r * 0.45, C.gold, C.ink, 1.1)));
const envelope = (x: number, y: number, s = 1, open = false) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -9, 28, 18, C.white, 2, C.ink, 1.5), open ? path('M-14 -9 L0 -20 L14 -9', C.white, C.ink, 1.5) : path('M-14 -9 L0 2 L14 -9', 'none', C.ink, 1.3));
const shield = (x: number, y: number, s = 1, col: string = C.navy, inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, path('M0 -16 L14 -11 C14 4 8 12 0 17 C-8 12 -14 4 -14 -11 Z', col, C.ink, 1.6), inner);
const school = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-10 -2 L0 -10 L10 -2 Z', RED, C.ink, 1.1), rect(-8, -2, 16, 11, C.yellow, 1, C.ink, 1.1), rect(-2, 3, 4, 6, C.brown, 0.5, null), circle(0, -4.5, 1.6, C.white, C.ink, 0.6));
const house = (x: number, y: number, s = 1, col: string = '#e8a07a') => g(`translate(${x} ${y}) scale(${s})`, path('M-14 -2 L0 -14 L14 -2 Z', RED, C.ink, 1.3), rect(-11, -2, 22, 16, col, 1, C.ink, 1.3), rect(-3, 5, 6, 9, C.brown, 0.5, C.ink, 0.8), rect(5, 1, 4, 4, '#9ad0f0', 0.5, C.ink, 0.6));
const key = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, circle(-6, 0, 4, 'none', C.gold, 2.4), line('M-2 0 L9 0 M6 0 L6 4 M9 0 L9 3', C.gold, 2.4));
const bike = (x: number, y: number, s = 1, col: string = C.green) => g(`translate(${x} ${y}) scale(${s})`, circle(-10, 0, 7, 'none', C.ink, 1.8), circle(10, 0, 7, 'none', C.ink, 1.8), line('M-10 0 L-3 -10 L7 -10 L10 0 M-3 -10 L0 0 L7 -10 M-5 -14 L-1 -14 M7 -10 L6 -15 L9 -15', col, 2));
const car = (x: number, y: number, s = 1, col: string = C.denim) => g(`translate(${x} ${y}) scale(${s})`, path('M-18 2 L-18 -6 L-10 -8 L-5 -15 L8 -15 L13 -8 L18 -6 L18 2 Z', col, C.ink, 1.4), rect(-3, -13, 9, 5, '#bfe3f5', 1, null), circle(-10, 3, 4, C.dark, C.ink, 1), circle(10, 3, 4, C.dark, C.ink, 1));
const cradle = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-16 -4 C-16 10 16 10 16 -4 Z', C.tan, C.ink, 1.4), path('M-18 12 C-8 16 8 16 18 12', 'none', C.brown, 2), circle(-6, -6, 6, C.skin, C.ink, 1.2), path('M-2 -6 L12 -6 L12 -2 L-2 -2 Z', C.rose, C.ink, 1), all(circle(-8, -6.5, 0.8, C.ink, null), circle(-4.2, -6.5, 0.8, C.ink, null)));
const flask = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-3 -10 L3 -10 L3 -3 L9 9 L-9 9 L-3 -3 Z', 'rgba(220,240,252,0.8)', C.ink, 1.3), path('M-6 4 L6 4 L9 9 L-9 9 Z', C.mint, null));
const cuffs = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(-7, 0, 6, 'none', C.silver, 3), circle(7, 0, 6, 'none', C.silver, 3), line('M-1 0 L1 0', C.grey, 3), circle(-7, 0, 6, 'none', C.ink, 0.8), circle(7, 0, 6, 'none', C.ink, 0.8));
const target = (x: number, y: number, r = 12) => all(circle(x, y, r, C.white, C.ink, 1.4), circle(x, y, r * 0.66, RED, C.ink, 1), circle(x, y, r * 0.33, C.white, C.ink, 1));
const signpost = (x: number, y: number, s = 1, col: string = C.green) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L0 -34', C.brown, 3), path('M-2 -32 L16 -32 L22 -27 L16 -22 L-2 -22 Z', col, C.ink, 1.3), path('M2 -18 L-16 -18 L-22 -13 L-16 -8 L2 -8 Z', C.grey2, C.ink, 1.3));
const tree = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-2, -2, 4, 12, C.brown, 1, C.ink, 1), path('M0 -22 L10 -2 L-10 -2 Z', '#3f8a55', C.ink, 1.2));
const berries = (x: number, y: number) => all(circle(x, y, 2.2, '#4a5bc4', C.ink, 0.6), circle(x + 3.4, y + 1, 2.2, '#4a5bc4', C.ink, 0.6), circle(x + 1.4, y + 3.6, 2.2, '#4a5bc4', C.ink, 0.6));
const dog = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ellipse(0, 0, 11, 6, C.tan, C.ink, 1.3), circle(11, -6, 5, C.tan, C.ink, 1.3), path('M9 -10 L8 -4 L12 -6 Z', C.brown, null), line('M-7 5 L-7 11 M7 5 L7 11 M-11 -1 L-15 -6', C.ink, 1.6), circle(13, -7, 0.8, C.ink, null));
const cat = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ellipse(0, 0, 10, 6, C.grey, C.ink, 1.3), circle(10, -6, 5, C.grey, C.ink, 1.3), path('M7 -10 L8 -14 L10 -10 M11 -10 L13 -14 L14 -9', C.grey, C.ink, 1), line('M-6 5 L-6 11 M6 5 L6 11', C.ink, 1.6), path('M-10 -1 C-16 -4 -16 -10 -12 -12', 'none', C.ink, 1.6), circle(12, -7, 0.8, C.ink, null));
const chair = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M-6 -14 L-6 10 M-6 0 L8 0 L8 10', C.brown, 3));
/** Balance (scales); tilt > 0 lowers the right pan. */
const scales = (x: number, y: number, s = 1, tilt = 0, col: string = C.gold) => { const a = (tilt * Math.PI) / 180, dx = 18 * Math.cos(a), dy = 18 * Math.sin(a); const pan = (px: number, py: number) => all(line(`M${f1(px)} ${f1(py)} L${f1(px - 7)} ${f1(py + 10)} M${f1(px)} ${f1(py)} L${f1(px + 7)} ${f1(py + 10)}`, C.ink, 0.9), path(`M${f1(px - 9)} ${f1(py + 10)} C${f1(px - 7)} ${f1(py + 15)} ${f1(px + 7)} ${f1(py + 15)} ${f1(px + 9)} ${f1(py + 10)} Z`, col, C.ink, 1.2)); return g(`translate(${x} ${y}) scale(${s})`, line('M0 -12 L0 18 M-8 18 L8 18', C.ink, 2.2), line(`M${f1(-dx)} ${f1(-12 - dy)} L${f1(dx)} ${f1(-12 + dy)}`, C.ink, 2), circle(0, -13, 2.4, col, C.ink, 1), pan(-dx, -12 - dy), pan(dx, -12 + dy)); };

// ── Buildings and flags ──────────────────────────────────────────────
/** Swedish flag; (x, y) is the top-left corner. */
const flagSE = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(0, 0, 20, 13, '#2a6ebb', 0.5, C.ink, 1), rect(6, 0, 3.4, 13, '#f7cf2e', 0, null), rect(0, 4.8, 20, 3.4, '#f7cf2e', 0, null), rect(0, 0, 20, 13, 'none', 0.5, C.ink, 1));
/** The EU flag (a circle of twelve stars on blue); (x, y) is the top-left corner. */
const flagEU = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(0, 0, 20, 13, '#2a4fa8', 0.5, C.ink, 1), ...Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return star(+f1(10 + Math.sin(a) * 4.3), +f1(6.5 - Math.cos(a) * 4.3), 0.9, '#f7cf2e'); }));
/** A plain two-colour flag for an unnamed country. */
const flagX = (x: number, y: number, c1: string, c2: string, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(0, 0, 20, 6.5, c1, 0, null), rect(0, 6.5, 20, 6.5, c2, 0, null), rect(0, 0, 20, 13, 'none', 0.5, C.ink, 1));
const pole = (x: number, base: number, top: number, f: Svg) => all(line(`M${x} ${base} L${x} ${top}`, C.ink, 1.6), f);
/** The Riksdag building: steps, columns, pediment and a flag. */
const parliament = (x: number, y: number, s = 1, flag = true) => g(`translate(${x} ${y}) scale(${s})`, rect(-40, 14, 80, 6, C.grey2, 1, C.ink, 1.2), rect(-36, -12, 72, 26, '#efe6d2', 1, C.ink, 1.4), path('M-40 -12 L0 -30 L40 -12 Z', '#e2d6bc', C.ink, 1.4), ...[-28, -16, -4, 8, 20, 32].map((cx) => rect(cx - 2.4, -9, 4.8, 23, C.white, 1, C.ink, 0.9)), circle(0, -19, 3.2, C.gold, C.ink, 0.8), flag ? all(line('M0 -30 L0 -44', C.ink, 1.4), flagSE(0, -44, 0.6)) : '');
/** Office building with rows of windows; a flag on the roof marks an authority. */
const office = (x: number, y: number, s = 1, col: string = '#cfd8e2', flag = true, sign: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-22, -30, 44, 52, col, 1.5, C.ink, 1.4), ...Array.from({ length: 12 }, (_, i) => rect(-17 + (i % 4) * 9.4, -25 + Math.floor(i / 4) * 11, 6, 7, '#9ad0f0', 0.5, C.ink, 0.6)), rect(-5, 9, 10, 13, C.brown, 0.5, C.ink, 1), sign, flag ? all(line('M14 -30 L14 -44', C.ink, 1.4), flagSE(14, -44, 0.55)) : '');
/** A company: a warm-coloured block with a sawtooth roof and no flag. */
const company = (x: number, y: number, s = 1, col: string = '#e9c27a') => g(`translate(${x} ${y}) scale(${s})`, path('M-22 -14 L-22 -26 L-11 -18 L-11 -26 L0 -18 L0 -26 L11 -18 L22 -18 L22 22 L-22 22 Z', col, C.ink, 1.4), ...[-14, -4, 6, 16].map((cx) => rect(cx - 3, -8, 6, 7, '#9ad0f0', 0.5, C.ink, 0.6)), rect(-5, 9, 10, 13, C.brown, 0.5, C.ink, 1), rect(12, 4, 6, 6, '#9ad0f0', 0.5, C.ink, 0.6));
/** A courthouse: columns and a balance on the pediment. */
const court = (x: number, y: number, s = 1, col: string = '#e8e2d4') => g(`translate(${x} ${y}) scale(${s})`, rect(-30, 14, 60, 6, C.grey2, 1, C.ink, 1.2), rect(-26, -8, 52, 22, col, 1, C.ink, 1.4), path('M-30 -8 L0 -26 L30 -8 Z', col, C.ink, 1.4), ...[-18, -6, 6, 18].map((cx) => rect(cx - 2.4, -6, 4.8, 20, C.white, 1, C.ink, 0.9)), scales(0, -14, 0.28));
/** A town hall (kommun / region): a small building with a clock tower. */
const townHall = (x: number, y: number, s = 1, col: string = '#f0d9b5') => g(`translate(${x} ${y}) scale(${s})`, rect(-20, -6, 40, 26, col, 1, C.ink, 1.4), rect(-6, -24, 12, 18, col, 1, C.ink, 1.4), path('M-8 -24 L0 -32 L8 -24 Z', RED, C.ink, 1.2), circle(0, -16, 3.4, C.white, C.ink, 0.9), rect(-4, 8, 8, 12, C.brown, 0.5, C.ink, 0.9), rect(-16, 0, 6, 6, '#9ad0f0', 0.5, C.ink, 0.6), rect(10, 0, 6, 6, '#9ad0f0', 0.5, C.ink, 0.6));
/** A police cap on a figure's head (top of the head at y). */
const cap = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-10 0 L-9 -6 L9 -6 L10 0 Z', C.navy, C.ink, 1.2), rect(-12, -1, 24, 3, C.dark, 1, C.ink, 0.8), circle(0, -3, 1.8, C.gold, null));
/** A podium with steps of heights hs; `items` stand on the steps. */
const podium = (x: number, w: number, hs: number[], cols: string[]) => all(...hs.map((h, i) => rect(x + i * w, 112 - h, w, h, cols[i % cols.length]!, 1, C.ink, 1.4)));
const heart_ = (x: number, y: number) => path(`M${x} ${y + 4} C${x - 6} ${y} ${x - 5} ${y - 5} ${x - 2} ${y - 5} C${x - 0.5} ${y - 5} ${x} ${y - 4} ${x} ${y - 3} C${x} ${y - 4} ${x + 0.5} ${y - 5} ${x + 2} ${y - 5} C${x + 5} ${y - 5} ${x + 6} ${y} ${x} ${y + 4} Z`, C.red, C.ink, 0.9);
const table = (y: number, x1: number, x2: number) => all(rect(x1, y, x2 - x1, 6, C.tan, 2, C.ink, 1.8), line(`M${x1 + 8} ${y + 6} L${x1 + 8} 112 M${x2 - 8} ${y + 6} L${x2 - 8} 112`, C.brown, 3));
const bars = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, 'none', 1, C.ink, 2), ...Array.from({ length: Math.floor(w / 6) }, (_, i) => line(`M${x + 4 + i * 6} ${y} L${x + 4 + i * 6} ${y + h}`, C.dark, 2.2)));

export const LAW_BASICS_MOTIFS: Record<string, Svg> = {
  // ── 1401 Lag och förordning ──
  'rgrund.lag': all(parliament(30, 40, 0.42), arrow(52, 32, 66, 32, HL, 2.4), lawBook(86, 32, 1.15), ...[24, 48, 72, 96].map((x, i) => mini(x, 92, [C.green, C.orange, C.purple, C.sky][i]!, 'smile', 0.95)), ...[24, 48, 72, 96].map((x) => check(x, 70, 0.8)), ground),
  'rgrund.lagstiftning': all(parliament(60, 46, 0.78), arrow(60, 66, 60, 76, HL, 2.4), lawBook(28, 96, 0.75), lawBook(50, 96, 0.75, '#2f4a7a'), lawBook(72, 96, 0.75, '#3f7a4f'), lawBook(94, 96, 0.75, '#7a5a2f'), ground),
  'rgrund.lagstiftare': all(g('translate(0 -8)', ...[18, 36, 54].map((x, i) => mini(x, 74, [C.green, C.orange, C.purple][i]!, 'smile', 0.9))), rect(6, 80, 64, 6, C.tan, 2, C.ink, 1.6), line('M12 86 L12 112 M64 86 L64 112', C.brown, 3), doc(92, 72, 1.2, para(0, 2, 16, C.navy), 0), pen(102, 76, 1, 30), arrow(70, 60, 80, 66, HL, 2), flagSE(84, 18, 0.9), ground),
  'rgrund.bestämmelse': all(doc(52, 60, 2.4, rect(-11, -2.4, 22, 5.6, 'rgba(228,87,46,0.35)', 1, null), 6), mag(92, 62, 1.4)),
  'rgrund.föreskrift': all(greyed(parliament(22, 30, 0.34)), arrow(38, 30, 46, 46, C.grey, 2), office(64, 74, 0.8), arrow(84, 68, 92, 68, HL, 2.2), doc(104, 66, 0.8, all(check(-6, -6, 0.5), check(-6, 4, 0.5)), 0), ground),
  'rgrund.utfärda': all(rect(48, 70, 24, 42, '#cfd8e2', 1, C.ink, 1.6), fig(26, C.navy, 'smile', { h: 0.92 }), reach(26, 0.92, 1, 58, 62), rect(56, 54, 10, 14, '#7a2b3a', 1.5, C.ink, 1.2), circle(61, 59, 2.2, 'none', C.gold, 1), fig(92, C.orange, 'smile', { h: 0.86 }), reach(92, 0.86, -1, 68, 62), ground),
  'rgrund.författning': all(parliament(20, 22, 0.28, false), office(60, 22, 0.36, '#cfd8e2', true), office(100, 22, 0.36, '#e3d6f0', false), arrow(20, 34, 34, 56, C.grey, 1.8), arrow(60, 34, 60, 56, C.grey, 1.8), arrow(100, 34, 86, 56, C.grey, 1.8), rect(14, 58, 92, 50, '#2f4a7a', 4, C.ink, 1.8), ...[30, 60, 90].map((x) => circle(x, 62, 2.4, C.silver, C.ink, 0.8)), lawBook(34, 86, 0.7), doc(60, 86, 0.7, flagSE(-7, -14, 0.7), 4), doc(86, 86, 0.7, rect(-8, -15, 16, 8, '#e3d6f0', 1, C.ink, 0.8), 4)),
  'rgrund.lagbok': all(rect(16, 92, 88, 6, C.tan, 2, C.ink, 1.6), line('M24 98 L24 112 M96 98 L96 112', C.brown, 3), lawBook(60, 60, 2.0), ground),
  'rgrund.enligt-lag': all(openBook(32, 52, 1, para(-13, 0, 14), lines(13, -6, 14, 4)), line('M58 52 L78 52', C.navy, 2, '3 3'), arrow(74, 52, 84, 52, C.navy, 2.2), g('translate(0 -6)', fig(98, C.orange, 'smile', { h: 0.62 })), school(98, 30, 1.2), okB(76, 84, 8), ground),
  'rgrund.lagstadgad': all(cal(40, 46, 1.9, [3, 4, 5, 6, 7, 8], C.green), padlock(40, 92, 1.3, false, C.gold), T(40, 104, '§', 10, BOOK), line('M40 72 L40 84', C.ink, 2), greyed(contract(96, 52, 0.9, true)), arrow(84, 52, 72, 52, C.grey, 2.2), noB(96, 86, 9)),
  'rgrund.upphäva': all(g('translate(36 58) rotate(-8)', path('M-20 -26 L6 -26 L2 -12 L8 0 L0 12 L6 26 L-20 26 Z', C.white, C.ink, 1.6), line('M-15 -16 L-2 -16 M-15 -8 L2 -8 M-15 0 L0 0 M-15 8 L0 8', C.grey2, 2), T(-7, 22, '§', 12, C.navy)), g('translate(84 62) rotate(10)', path('M-4 -26 L22 -26 L22 26 L-4 26 L2 12 L-6 0 L0 -12 Z', C.white, C.ink, 1.6), line('M4 -16 L16 -16 M2 -8 L16 -8 M2 0 L16 0 M4 8 L16 8', C.grey2, 2)), cross(60, 26, 1.6), parliament(60, 104, 0.3, false)),

  // ── 1402 Juridiska rättigheter och skyldigheter ──
  'rgrund.rätt.2': all(lawBook(22, 26, 0.85), curveArrow('M34 22 C50 10 62 14 66 26', 66, 26, 60, C.green, 2.2), school(96, 58, 2.0), rect(54, 70, 4, 42, C.grey, 1, C.ink, 1), path('M58 72 L74 62 L74 112 L58 112 Z', C.green, C.ink, 1.4), g('translate(-8 0)', fig(40, C.yellow, 'laugh', { h: 0.62 })), okB(82, 26, 8), ground),
  'rgrund.skyldig.3': all(lawBook(18, 24, 0.85), path('M30 30 C46 40 52 52 54 58', 'none', C.brown, 2.2), fig(56, C.navy, 'calm', { h: 0.9 }), circle(54, 59, 3, 'none', C.brown, 1.6), reach(56, 0.9, 1, 76, 82), fig(84, C.yellow, 'smile', { h: 0.52 }), school(106, 76, 1.0), arrow(92, 106, 112, 106, HL, 1.8), greyed(fig(18, C.grey, 'smile', { h: 0.62 })), ground),
  'rgrund.plikt': all(fig(50, C.green, 'calm', { h: 0.92 }), reach(50, 0.92, 1, 70, 90), path('M66 106 C70 96 84 94 96 100 L100 108 L66 108 Z', C.orange, C.ink, 1.4), circle(104, 98, 6, C.skin, C.ink, 1.2), sb(50, 0.92, -1, 22, 20, (cx, cy) => ex(cx, cy, 15)), greyed(fig(100, C.grey, 'calm', { h: 0.8 })), arrow(104, 30, 116, 30, C.grey, 1.6), heart_(50, 58), ground),
  'rgrund.förpliktelse': all(contract(60, 32, 1.1), handshake(60, 64, 1.1, C.navy, C.green), arrow(40, 74, 24, 88, HL, 2.2), arrow(80, 74, 96, 88, HL, 2.2), rect(10, 90, 22, 16, C.tan, 1, C.ink, 1.4), line('M10 95 L32 95', C.brown, 1.2), coins(102, 104, 3, 6), ground),
  'rgrund.berättigad': all(rect(48, 76, 24, 36, '#cfd8e2', 1, C.ink, 1.6), coins(60, 72, 3, 5), fig(28, C.orange, 'smile', { h: 0.82 }), okB(28, 14, 8), arrow(56, 62, 40, 62, C.green, 2.2), greyed(fig(94, C.grey, 'frown', { h: 0.8 })), noB(94, 16, 7), ground),
  'rgrund.befogenhet': all(fig(30, C.navy, 'calm', { h: 0.95 }), cap(30, geo(30, 0.95).hy - 7, 0.95), reach(30, 0.95, 1, 52, 44), palm(54, 40, 1.1), shield(30, 62, 0.4, C.gold), car(90, 100, 1.1, C.denim), ground),
  'rgrund.åligga': all(contract(60, 26, 0.8), arrow(66, 44, 84, 58, HL, 2.2), greyed(fig(24, C.grey, 'smile', { h: 0.84 })), fig(92, C.green, 'calm', { h: 0.84 }), ring(92, 50, 24, HL), reach(92, 0.84, -1, 74, 82), line('M74 82 L68 106', C.brown, 2.4), path('M62 104 L74 104 L72 112 L64 112 Z', C.yellow, C.ink, 1), ground),
  'rgrund.ålägga': all(office(26, 64, 0.72), arrow(46, 52, 62, 52, HL, 2.6), doc(56, 30, 0.6, ex(0, 0, 18), 0), company(92, 70, 0.74), fig(84, C.orange, 'calm', { h: 0.42 }), ground),
  'rgrund.fullgöra': all(doc(36, 58, 1.7, all(check(-6, -11, 0.5), check(-6, -5, 0.5), check(-6, 1, 0.5), check(-6, 7, 0.5)), 0), fig(88, C.green, 'laugh', { h: 0.9 }), reach(88, 0.9, -1, 72, 24), reach(88, 0.9, 1, 104, 24), star(60, 18, 5, C.gold), ground),
  'rgrund.åsidosätta': all(g('translate(30 96) rotate(-80)', doc(0, 0, 0.9, all(cross(0, 0, 0.6)), 4)), path('M14 82 L26 62 L38 82 Z', C.yellow, C.ink, 1.4), ex(26, 74, 10, C.ink), fig(84, C.purple, 'calm', { h: 0.9 }), arrow(96, 70, 112, 70, C.grey, 2), noB(60, 30, 8), ground),
  'rgrund.kränkning': all(circle(84, 66, 34, 'rgba(140,199,232,0.25)', null), path('M84 32 A34 34 0 1 1 52 78', 'none', C.denim, 2.4), path('M50 52 L56 58 L50 64 L57 70', 'none', RED, 2.4), fig(92, C.orange, 'shock', { h: 0.78 }), fig(30, '#7a6a8a', 'smile', { h: 0.82 }), reach(30, 0.82, 1, 58, 66), rect(56, 58, 14, 10, C.pink, 1, C.ink, 1.2), padlock(64, 56, 0.4, true), ex(92, 12, 14, RED), ground),
  'rgrund.rättsskydd': all(shield(54, 58, 2.4, C.navy, T(0, 6, '§', 16, C.gold)), g('translate(14 0)', fig(80, C.green, 'smile', { h: 0.55 })), ...[30, 50, 70].map((y) => arrow(4, y - 6, 22, y, RED, 2.2)), ground),

  // ── 1403 Rättssubjekt ──
  'rgrund.rättssubjekt': all(ring(30, 56, 22, C.green), fig(30, C.orange, 'smile', { h: 0.48 }), ring(76, 56, 22, C.green), company(76, 58, 0.55), okB(30, 26, 6), okB(76, 26, 6), greyed(dog(30, 100, 0.9), chair(78, 100, 1)), noB(54, 98, 6)),
  'rgrund.fysisk-person': all(fig(40, C.orange, 'smile', { h: 0.95 }), ring(40, 64, 40, C.green), greyed(company(96, 86, 0.6))),
  'rgrund.juridisk-person': all(company(56, 68, 1.3), ring(56, 66, 42, C.green), greyed(fig(104, C.grey, 'smile', { h: 0.55 }))),
  'rgrund.rättskapacitet': all(cradle(36, 88, 1.4), house(86, 40, 1.1), coins(86, 74, 3, 6), curveArrow('M50 74 C58 60 66 56 72 52', 72, 52, -40, C.green, 2.2), okB(30, 54, 8), ground),
  'rgrund.rättshandling': all(contract(52, 58, 2.0, true), pen(84, 74, 1.2, 30), hnd(80, 84, 4), arrow(96, 34, 110, 34, HL, 2), key(104, 50, 1.1, 0), ground),
  'rgrund.part': all(fig(20, C.orange, 'smile', { h: 0.8 }), fig(100, C.green, 'smile', { h: 0.8 }), ring(20, 66, 22, C.orange), ring(100, 66, 22, C.green), contract(60, 66, 1.1), line('M42 66 L48 66 M72 66 L78 66', C.ink, 1.6, '2 2'), ground),
  'rgrund.omyndig': all(fig(36, C.yellow, 'frown', { h: 0.7 }), num(36, 82, '15', 9, C.ink), reach(36, 0.7, 1, 58, 70), pen(62, 66, 0.8, 30), contract(70, 74, 1.0, false), noB(36, 26, 9), greyed(fig(100, C.grey, 'smile', { h: 0.95 }), num(100, 64, '18', 9, C.ink)), ground),
  'rgrund.förmyndare': all(fig(40, C.navy, 'smile', { h: 0.95 }), reach(40, 0.95, 1, 60, 60), path('M54 54 C54 46 74 46 74 56 C74 66 56 68 54 60 Z', C.pink, C.ink, 1.3), circle(70, 52, 1, C.ink, null), coin(64, 44, 3), fig(92, C.yellow, 'smile', { h: 0.55 }), curveArrow('M78 42 C70 30 60 30 52 38', 52, 38, 140, C.green, 1.8), ground),
  'rgrund.god-man': all(rect(10, 82, 100, 6, C.tan, 2, C.ink, 1.6), fig(30, C.green, 'smile', { h: 0.8 }), fig(88, '#b0a090', 'calm', { h: 0.8, hair: C.grey2 }), envelope(56, 76, 0.6), envelope(66, 72, 0.6), reach(30, 0.8, 1, 50, 74), coins(76, 80, 2, 4), ground),
  'rgrund.huvudman': all(rect(10, 82, 100, 6, C.tan, 2, C.ink, 1.6), greyed(fig(30, C.grey, 'smile', { h: 0.8 })), fig(88, '#b0a090', 'smile', { h: 0.8, hair: C.grey2 }), ring(88, 50, 26, HL), envelope(58, 76, 0.6), ground),
  'rgrund.företrädare': all(company(28, 72, 0.9), curveArrow('M46 40 C56 30 66 30 74 36', 74, 36, 40, HL, 2.2), fig(86, C.navy, 'smile', { h: 0.9 }), reach(86, 0.9, -1, 70, 70), contract(62, 76, 0.7), ground),
  'rgrund.stiftelse': all(rect(40, 44, 40, 30, C.tan, 2, C.ink, 1.6), coins(60, 40, 4, 8), arrow(44, 78, 26, 92, C.green, 2.2), arrow(76, 78, 94, 92, C.green, 2.2), flask(20, 100, 1.1), openBook(98, 100, 0.5), greyed(mini(60, 16, C.grey, 'flat', 0.9)), cross(60, 14, 1.2), ground),

  // ── 1404 Rättskällor ──
  'rgrund.gå-före.2': all(podium(18, 28, [36, 60, 24], [C.grey2, C.gold, C.grey2]), doc(60, 32, 0.8, flagEU(-10, -14, 1), 3), doc(32, 56, 0.8, flagSE(-10, -14, 1), 3), curveArrow('M36 34 C40 18 46 14 50 16', 50, 16, 20, HL, 2.2), num(60, 74, '1', 14, C.ink), num(32, 92, '2', 14, C.ink)),
  'rgrund.rättskälla': all(lawBook(20, 30, 0.75), doc(20, 64, 0.65, '', 4), scales(20, 92, 0.6), arrow(36, 30, 62, 54, HL, 1.8), arrow(34, 64, 62, 64, HL, 1.8), arrow(36, 92, 62, 74, HL, 1.8), fig(88, C.navy, 'calm', { h: 0.9 }), q(104, 14, 14), ground),
  'rgrund.förarbete': all(...[0, 1, 2].map((i) => doc(22 + i * 8, 70 - i * 8, 0.9, '', 5)), mag(48, 76, 0.9), arrow(62, 60, 80, 60, HL, 2.6), lawBook(98, 60, 1.2), ground),
  'rgrund.rättsfall': all(rect(20, 30, 80, 66, '#f2d48a', 3, C.ink, 1.6), path('M20 30 L20 24 L46 24 L52 30 Z', '#f2d48a', C.ink, 1.6), mini(38, 56, C.orange, 'frown', 0.9), mini(82, 56, C.green, 'frown', 0.9), scales(60, 70, 0.7)),
  'rgrund.rättspraxis': all(...[0, 1, 2, 3, 4, 5].map((i) => scales(22 + (i % 3) * 38, 36 + Math.floor(i / 3) * 46, 0.55, 14)), arrow(6, 112, 114, 112, C.grey, 1.6)),
  'rgrund.prejudikat': all(court(60, 28, 0.9, '#e8d9a8'), star(60, 2, 4, C.gold), ...[20, 60, 100].map((x) => court(x, 96, 0.45)), arrow(46, 52, 26, 74, HL, 2), arrow(60, 52, 60, 74, HL, 2), arrow(74, 52, 94, 74, HL, 2)),
  'rgrund.vägledande': all(signpost(40, 108, 1.6), doc(92, 60, 1.2, scales(0, 2, 0.4), 0), ground),
  'rgrund.lagkommentar': all(openBook(56, 60, 1.9, all(T(-13, 4, '§', 16, C.navy), lines(-13, 8, 12, 2)), all(lines(13, -8, 14, 5, C.navy))), mag(94, 82, 1.2), ground),
  'rgrund.doktrin': all(rect(46, 78, 66, 6, C.tan, 2, C.ink, 1.6), fig(30, C.purple, 'calm', { h: 0.9 }), circle(27, geo(30, 0.9).hy, 3, 'none', C.ink, 1), circle(33, geo(30, 0.9).hy, 3, 'none', C.ink, 1), reach(30, 0.9, 1, 58, 74), doc(66, 70, 0.6, '', 4), ...[0, 1, 2].map((i) => rect(86, 70 - i * 8, 22, 7, [BOOK, C.navy, C.green][i]!, 1, C.ink, 1)), lawBook(98, 50, 0.6), line('M52 84 L52 112 M106 84 L106 112', C.brown, 3), ground),
  'rgrund.sedvänja': all(table(84, 10, 110), greyed(fig(24, '#b0a090', 'smile', { h: 0.84, hair: C.grey2 })), fig(60, C.green, 'smile', { h: 0.84 }), fig(96, C.yellow, 'smile', { h: 0.6 }), ...[36, 72, 106].map((x) => all(path(`M${x - 5} 76 L${x + 5} 76 L${x + 4} 84 L${x - 4} 84 Z`, C.white, C.ink, 1.2), path(`M${x - 2} 72 C${x - 4} 68 ${x} 66 ${x - 2} 62`, 'none', C.grey, 1))), curveArrow('M30 8 C50 0 70 0 90 8', 90, 8, 25, HL, 2), curveArrow('M90 14 C70 22 50 22 30 14', 30, 14, 205, HL, 2)),
  'rgrund.sedvanerätt': all(tree(16, 100), tree(36, 96, 0.8), tree(104, 100), fig(70, C.green, 'smile', { h: 0.8 }), berries(84, 92), greyed(doc(30, 34, 0.8, '', 4)), cross(30, 34, 1.4), okB(90, 26, 9), ground),
  'rgrund.rättsprincip': all(...[24, 48, 72, 96].map((x, i) => lawBook(x, 40, 0.7, [BOOK, '#2f4a7a', '#3f7a4f', '#7a5a2f'][i]!)), ...[24, 48, 72, 96].map((x) => arrow(x, 72, x, 60, C.grey, 1.6)), rect(10, 74, 100, 34, C.gold, 3, C.ink, 1.8), mini(30, 90, C.orange, 'flat', 0.7), T(52, 96, '=', 16, C.ink), mini(74, 90, C.orange, 'flat', 0.7), scales(98, 92, 0.38, 0)),
  'rgrund.EU-rätt': all(pole(30, 112, 20, flagEU(30, 20, 1.6)), lawBook(84, 60, 1.6, '#2a4fa8'), ground),
  'rgrund.rangordning': all(path('M60 10 L104 104 L16 104 Z', 'none', C.grey2, 2), doc(60, 30, 0.7, para(0, 4, 12, C.gold), 0, C.grey2, '#f6e3a8'), doc(44, 66, 0.7, para(0, 4, 12, C.navy), 0), doc(76, 66, 0.7, para(0, 4, 12, C.navy), 0), ...[24, 48, 72, 96].map((x) => doc(x, 96, 0.5, '', 3)), num(84, 28, '1', 12, C.ink)),

  // ── 1405 Juridiska begrepp ──
  'rgrund.juridik': all(rect(10, 84, 100, 6, C.tan, 2, C.ink, 1.6), fig(34, C.orange, 'calm', { h: 0.84 }), reach(34, 0.84, 1, 58, 76), openBook(66, 76, 0.7, para(-13, 0, 10)), lawBook(98, 70, 0.6), scales(84, 32, 0.9), line('M16 90 L16 112 M104 90 L104 112', C.brown, 3), ground),
  'rgrund.jurist': all(fig(54, C.dark, 'smile', { h: 1 }), path(`M52 ${f1(geo(54).sy)} L56 ${f1(geo(54).sy)} L57 ${f1(geo(54).sy + 14)} L54 ${f1(geo(54).sy + 17)} L51 ${f1(geo(54).sy + 14)} Z`, RED, C.ink, 1), circle(62, 46, 2.6, C.gold, C.ink, 0.8), reach(54, 1, 1, 80, 78), lawBook(88, 78, 0.6), scales(98, 24, 0.7), ground),
  'rgrund.rättsväsende': all(court(60, 34, 0.8), shield(22, 86, 0.9, C.navy, star(0, 0, 4, C.gold)), car(96, 96, 0.9, C.white), rect(88, 82, 12, 3, C.navy, 0.5, null), line('M30 78 L46 54 M88 82 L74 54 M34 90 L80 94', C.grey, 1.6, '3 3')),
  'rgrund.rättsordning': all(rect(14, 22, 92, 82, '#f3ead6', 4, C.ink, 1.8), flagSE(20, 10, 1), ...Array.from({ length: 9 }, (_, i) => doc(32 + (i % 3) * 28, 42 + Math.floor(i / 3) * 26, 0.5, '', 3)), ...[0, 1].map((r) => line(`M24 ${55 + r * 26} L96 ${55 + r * 26}`, C.grey2, 1))),
  'rgrund.rättssäkerhet': all(scales(46, 50, 1.4, 0), shield(96, 66, 1.4, C.green, check(0, 0, 0.9, C.white)), ground),
  'rgrund.legalitetsprincip': all(doc(24, 36, 0.9, para(0, 2, 14, C.navy), 0), arrow(24, 58, 24, 70, RED, 2), bars(10, 76, 28, 30), doc(84, 36, 0.9, '', 0), arrow(84, 58, 84, 64, C.green, 2), fig(84, C.orange, 'smile', { h: 0.48 }), okB(102, 72, 6), line('M54 12 L54 108', C.grey2, 1.6, '4 4')),
  'rgrund.retroaktiv': all(...[0, 1, 2, 3].map((i) => cal(20 + i * 27, 70, 0.8, i < 3 ? [0, 1, 2, 3, 4, 5, 6, 7, 8] : [], i < 3 ? C.green : HL)), coins(101, 44, 3, 6), curveArrow('M100 50 C90 20 40 20 22 50', 22, 50, 120, C.green, 2.4)),
  'rgrund.preskriberas': all(greyed(contract(34, 62, 1.4)), coin(46, 80, 5), hourglass(86, 50, 1.6), num(86, 84, '10', 13, C.ink), cross(34, 62, 1.8, C.grey), ground),
  'rgrund.rättsverkan': all(contract(24, 60, 1.1), arrow(42, 50, 64, 30, HL, 2.2), arrow(42, 60, 64, 60, HL, 2.2), arrow(42, 70, 64, 90, HL, 2.2), key(84, 30, 1.2), coins(84, 66, 3, 6), house(86, 92, 0.9)),
  'rgrund.presumtion': all(scales(30, 36, 0.9, 0), q(30, 72, 16), fig(82, C.white, 'calm', { h: 0.92 }), okB(82, 10, 8), line('M52 50 L64 50', C.grey, 1.6, '3 3'), ground),
  'rgrund.i-god-tro': all(fig(28, C.green, 'smile', { h: 0.9 }), sb(28, 0.9, 1, 26, 20, (cx, cy) => check(cx, cy, 0.8)), bike(74, 100, 1.2, C.green), path('M68 88 L72 92 L70 95', 'none', RED, 1.4), ring(70, 92, 7, RED), fig(104, C.orange, 'smile', { h: 0.78 }), ground),
  'rgrund.lag-och-rätt': all(lawBook(34, 62, 1.5), scales(86, 60, 1.3, 0), circle(60, 62, 4, HL, null)),
  'rgrund.tvingande': all(contract(40, 60, 1.5), rect(24, 42, 32, 6, 'rgba(232,48,44,0.25)', 1, null), cross(40, 45, 0.9), shield(92, 54, 1.3, BOOK, T(0, 6, '§', 16, C.gold)), arrow(76, 54, 62, 54, BOOK, 3)),
  'rgrund.dispositiv': all(contract(30, 58, 1.2), greyed(lawBook(30, 96, 0.6)), line('M60 14 L60 106', C.grey2, 1.6, '4 4'), doc(88, 58, 1.2, '', 0), lawBook(88, 96, 0.6), curveArrow('M88 82 C80 76 80 70 86 64', 86, 64, -60, C.green, 2)),

  // ── 1406 Att tolka en lagtext ──
  'rgrund.tolka.2': all(doc(40, 70, 1.3, para(0, -6, 12, C.navy), 3), fig(86, C.orange, 'calm', { h: 0.9 }), reach(86, 0.9, -1, 60, 60), mag(54, 58, 1), sb(86, 0.9, -1, 30, 22, (cx, cy) => all(q(cx - 6, cy, 12), ex(cx + 6, cy, 12, C.green)), -4), ground),
  'rgrund.kapitel': all(openBook(60, 64, 2.0, all(rect(-22, -12, 18, 5, HL, 1, null), lines(-13, -2, 16, 3)), all(rect(4, -12, 18, 5, C.denim, 1, null), lines(13, -2, 16, 3))), num(30, 26, '1', 14, HL), num(90, 26, '2', 14, C.denim)),
  'rgrund.paragraf': all(doc(60, 60, 2.4, all(T(-4, -5, '4', 9, C.ink), T(4, -5, '§', 9, C.navy)), 0), ...[0, 1, 2, 3].map((i) => line(`M44 ${70 + i * 8} L76 ${70 + i * 8}`, C.grey2, 2.4))),
  'rgrund.stycke': all(doc(60, 60, 2.4, all(rect(-11, -14, 22, 10, C.grey2, 1, null), rect(-11, -2, 22, 10, 'rgba(228,87,46,0.45)', 1, C.ink, 0.5), rect(-11, 10, 22, 6, C.grey2, 1, null)), 0)),
  'rgrund.lagrum': all(openBook(48, 70, 1.6, lines(-13, -6, 14, 5), lines(13, -6, 14, 5)), rect(64, 56, 16, 5, 'rgba(228,87,46,0.55)', 1, null), path('M70 34 L76 34 L76 52 L73 49 L70 52 Z', RED, C.ink, 1), mag(96, 40, 1.6), T(96, 44, '§', 11, C.navy), ground),
  'rgrund.ordalydelse': all(doc(36, 60, 1.8, '', 0), ...[0, 1, 2, 3, 4].map((i) => all(rect(16, 36 + i * 10, 12, 4, C.ink, 2, null), rect(32, 36 + i * 10, 8, 4, C.ink, 2, null), rect(44, 36 + i * 10, 10, 4, C.ink, 2, null))), circle(88, 56, 20, 'rgba(220,240,252,0.8)', C.ink, 2.4), line('M102 70 L112 82', C.ink, 4), rect(74, 52, 12, 7, C.ink, 3, null), rect(90, 52, 10, 7, C.ink, 3, null)),
  'rgrund.definiera': all(rect(10, 46, 36, 22, C.white, 3, C.ink, 1.6), rect(16, 54, 24, 6, C.ink, 3, null), line('M54 52 L66 52 M54 60 L66 60', C.ink, 2.6), house(92, 60, 1.6), ground),
  'rgrund.syfte': all(lawBook(22, 60, 0.9), arrow(38, 60, 72, 60, HL, 2.4), target(90, 60, 18), fig(92, C.yellow, 'smile', { h: 0.36 }), ground),
  'rgrund.tillämpa': all(lawBook(30, 34, 1.0), arrow(30, 54, 30, 66, HL, 2.4), rect(16, 66, 28, 8, C.navy, 1, C.ink, 1.2), rect(26, 58, 8, 8, C.brown, 1, C.ink, 1), rect(54, 70, 56, 38, '#f2d48a', 3, C.ink, 1.6), mini(70, 86, C.orange, 'flat', 0.7), mini(94, 86, C.green, 'flat', 0.7), circle(82, 80, 8, 'none', RED, 2), para(82, 80, 10, RED)),
  'rgrund.huvudregel': all(doc(18, 30, 0.8, para(0, 2, 12, C.navy), 0), arrow(32, 30, 44, 40, HL, 2.4), rect(40, 30, 76, 62, 'rgba(79,157,105,0.15)', 6, C.green, 2), ...[0, 1, 2, 3, 4, 5].map((i) => mini(54 + (i % 3) * 24, 48 + Math.floor(i / 3) * 28, C.green, 'smile', 0.75)), check(104, 22, 1.2), greyed(mini(18, 96, C.grey, 'flat', 0.6))),
  'rgrund.gränsfall': all(rect(6, 30, 54, 70, 'rgba(79,157,105,0.25)', 2, null), rect(60, 30, 54, 70, 'rgba(232,48,44,0.2)', 2, null), line('M60 24 L60 106', C.ink, 2.4, '5 4'), okB(30, 20, 7), noB(90, 20, 7), cat(60, 80, 1.3), q(60, 52, 18)),
  'rgrund.analogi': all(dog(30, 56, 1.3), doc(30, 92, 0.6, para(0, 2, 12, C.navy), 0), curveArrow('M42 30 C54 18 66 18 78 30', 78, 30, 40, HL, 2.2), cat(88, 56, 1.3), T(60, 66, '≈', 18, HL), doc(88, 92, 0.6, para(0, 2, 12, C.navy), 0)),
  'rgrund.motsatsvis': all(car(30, 50, 1.1), noB(30, 24, 8), curveArrow('M50 44 C58 36 66 36 74 44', 74, 44, 40, HL, 2), bike(90, 54, 1.0), okB(90, 24, 8), line('M60 70 L60 104', C.grey2, 1.6, '3 3'), greyed(doc(30, 92, 0.5, '', 3)), doc(90, 92, 0.5, '', 3)),

  // ── 1407 Offentlig och privat rätt ──
  'rgrund.förvaltningsrätt.2': all(office(36, 70, 0.9), arrow(62, 60, 76, 60, HL, 2.2), doc(94, 52, 0.9, all(check(-6, -6, 0.5), line('M-9 8 L9 8', C.ink, 1)), 3), scales(94, 92, 0.5), ground),
  'rgrund.offentlig-rätt': all(parliament(44, 30, 0.5), arrow(44, 46, 44, 70, HL, 3), mini(44, 86, C.orange, 'flat', 0.95), rect(26, 104, 36, 4, C.grey2, 1, null), line('M84 10 L84 110', C.grey2, 1.4, '4 4'), greyed(mini(96, 86, C.grey, 'smile', 0.6), mini(112, 86, C.grey, 'smile', 0.6), line('M100 74 L108 74', C.ink, 1.6))),
  'rgrund.privaträtt': all(greyed(parliament(60, 22, 0.32, false)), cross(60, 20, 1.2), fig(24, C.orange, 'smile', { h: 0.78 }), fig(96, C.green, 'smile', { h: 0.78 }), handshake(60, 74, 1.0, C.orange, C.green), rect(8, 108, 104, 4, C.gold, 1, null), arrow(46, 98, 74, 98, C.grey, 1.4), arrow(74, 102, 46, 102, C.grey, 1.4)),
  'rgrund.civilrätt': all(fig(22, C.orange, 'smile', { h: 0.85 }), reach(22, 0.85, 1, 46, 62), coins(50, 66, 2, 5), fig(98, C.green, 'smile', { h: 0.85 }), reach(98, 0.85, -1, 74, 62), rect(66, 54, 14, 12, C.tan, 1, C.ink, 1.2), line('M10 96 L110 96', C.grey2, 2), ground),
  'rgrund.rättsområde': all(circle(60, 60, 44, C.white, C.ink, 1.8), line('M60 60 L60 16 M60 60 L98 82 M60 60 L22 82', C.ink, 1.6), house(84, 44, 0.8), coins(60, 92, 3, 6), company(36, 46, 0.42)),
  'rgrund.det-allmänna': all(ellipse(60, 70, 54, 36, 'rgba(242,193,78,0.18)', HL, 2), parliament(60, 52, 0.42), townHall(28, 86, 0.6), office(92, 88, 0.48)),
  'rgrund.enskild': all(greyed(parliament(40, 30, 0.4), townHall(90, 34, 0.5), office(66, 34, 0.32)), arrow(60, 56, 60, 68, C.grey, 2), fig(60, C.orange, 'smile', { h: 0.48 }), ring(60, 88, 26, HL), ground),
  'rgrund.privatperson': all(house(22, 94, 1.3), fig(52, C.orange, 'smile', { h: 0.82 }), reach(52, 0.82, 1, 70, 86), bike(84, 102, 0.85), greyed(rect(78, 14, 38, 34, '#cfd8e2', 2, C.ink, 1.2), path('M76 14 L118 14 L114 6 L80 6 Z', RED, C.ink, 1), rect(86, 32, 20, 10, C.dark, 1, C.ink, 1)), ground),
  'rgrund.överordnad': all(rect(40, 22, 40, 14, C.gold, 2, C.ink, 1.6), mini(60, 14, C.navy, 'smile', 0.8), arrow(60, 40, 60, 62, HL, 2.6), ...[30, 60, 90].map((x) => all(rect(x - 14, 82, 28, 12, C.grey2, 2, C.ink, 1.2), mini(x, 74, C.grey, 'flat', 0.7)))),
  'rgrund.jämbördig': all(line('M20 80 L100 80', C.brown, 4), path('M54 100 L60 82 L66 100 Z', C.grey, C.ink, 1.4), g('translate(0 -32)', fig(30, C.orange, 'smile', { h: 0.55 }), fig(90, C.green, 'smile', { h: 0.55 })), ground),
  'rgrund.rättsförhållande': all(fig(22, C.orange, 'smile', { h: 0.8 }), fig(98, C.green, 'smile', { h: 0.8 }), path('M36 54 C48 46 72 46 84 54', 'none', C.navy, 3), path('M36 54 C48 62 72 62 84 54', 'none', C.navy, 3), circle(60, 54, 9, C.white, C.ink, 1.4), para(60, 54, 11, C.navy), ground),
  'rgrund.statsrätt': all(parliament(60, 40, 0.7), lawBook(26, 92, 0.7), rect(76, 86, 24, 20, C.white, 2, C.ink, 1.5), line('M82 86 L94 86', C.ink, 3), rect(84, 76, 8, 10, C.yellow, 1, C.ink, 1), ground),
  'rgrund.straffrätt': all(lawBook(30, 60, 1.4), arrow(52, 60, 66, 60, HL, 2.4), cuffs(92, 46, 1.4), bars(74, 70, 36, 34), ground),
  'rgrund.processrätt': all(rect(40, 18, 40, 18, C.tan, 2, C.ink, 1.6), mini(60, 12, C.dark, 'flat', 0.8), mini(22, 80, C.orange, 'flat', 0.8), mini(98, 80, C.green, 'flat', 0.8), num(22, 104, '1', 12, HL), num(98, 104, '2', 12, HL), curveArrow('M30 66 C36 50 46 42 52 40', 52, 40, -30, C.grey, 1.6), curveArrow('M90 66 C84 50 74 42 68 40', 68, 40, -150, C.grey, 1.6), scales(60, 70, 0.5)),
  'rgrund.folkrätt': all(pole(16, 112, 24, flagX(16, 24, '#3a9a5a', C.white, 1.2)), pole(104, 112, 24, flagX(80, 24, '#d64545', C.yellow, 1.2)), contract(60, 46, 0.9), handshake(60, 80, 1.0, '#3a9a5a', '#d64545'), ground),
};
