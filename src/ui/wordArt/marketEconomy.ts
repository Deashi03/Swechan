/**
 * Ekonomi & arbetsliv → Marknadsekonomi, 1541–1547: supply and demand, prices and competition, markets
 * and industries, productivity and growth, the business cycle and unemployment, trade and imports, and
 * economic policy. Recurring signs: price tags with a coin, line charts (green up, red down), shops and
 * factories, a country as a soft blob with a house, a globe, a container ship, a domed government
 * building and a columned central bank with a coin. Grey reference where a contrast helps. No words in
 * the pictures and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, star, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm, padlock, cloud, sun, drops } from './people';
import { P as F, type Mood, greyed, coin } from './blindFix';
import { checkIcon } from './labelIcons';

// ── Geometry and figures ─────────────────────────────────────────────
const RED = '#e8302c';
const f1 = (n: number) => n.toFixed(1);
const ground = line('M4 112 L116 112', C.grey2, 2);
/** Head and shoulder positions of a standing figure (figures.ts) at x with height factor h. */
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, hy: ty - 56 * s, hr: 10 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
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

// ── Marks ────────────────────────────────────────────────────────────
const q = (x: number, y: number, sz = 13, col: string = C.navy) => T(x, y + sz * 0.36, '?', sz, col);
const ex = (x: number, y: number, sz = 13, col: string = HL) => T(x, y + sz * 0.36, '!', sz, col);
const cross = (x: number, y: number, s = 1, col: string = RED) => line(`M${x - 5 * s} ${y - 5 * s} L${x + 5 * s} ${y + 5 * s} M${x + 5 * s} ${y - 5 * s} L${x - 5 * s} ${y + 5 * s}`, col, 2.4 * s);
const check = (x: number, y: number, s = 1, col: string = C.green) => checkIcon(x, y, s, col);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const minusB = (x: number, y: number, r = 8, col: string = RED) => all(circle(x, y, r, col, C.ink, 1.2), line(`M${f1(x - r * 0.5)} ${y} L${f1(x + r * 0.5)} ${y}`, C.white, r * 0.26));
const palm = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ...[-4.6, -1.6, 1.4, 4.4].map((d, i) => rect(d - 1.3, -9 + Math.abs(i - 1.5) * 1.2, 2.6, 9, C.skin, 1.3, C.ink, 0.9)), path('M-5.5 -1 L5.5 -1 L5 5 C4 8 -4 8 -5 5 Z', C.skin, C.ink, 1), path('M-5.4 1 L-9 -3 C-10 -4 -11 -2 -10 -1 L-5 5', C.skin, C.ink, 1));
const warn = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -11 L11 8 L-11 8 Z', C.yellow, C.ink, 1.4), T(0, 6, '!', 12, C.ink));

// ── Things ───────────────────────────────────────────────────────────
/** A sheet of paper with text lines; `marks` in the sheet's own coordinates (−14…14, −18…18). */
const doc = (x: number, y: number, s = 1, marks: Svg = '', n = 5, col: string = C.grey2, fill: string = C.white) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -18, 28, 36, fill, 2, C.ink, 1.6), ...Array.from({ length: n }, (_, i) => line(`M-9 ${-11 + i * 6} L9 ${-11 + i * 6}`, col, 2)), marks);
/** A contract: a sheet with a signature line at the bottom. */
const contract = (x: number, y: number, s = 1, signed = true, mark: Svg = '') => doc(x, y, s, all(line('M-9 12 L9 12', C.ink, 1), signed ? path('M-8 10 C-5 4 -3 12 0 7 C2 4 4 10 7 8', 'none', C.navy, 1.4) : '', mark), 4);
/** A CV: a sheet with three sections (cap, briefcase, speech bubble) and lines. */
const cv = (x: number, y: number, s = 1, extra: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -18, 28, 36, C.white, 2, C.ink, 1.6),
  path('M-11 -12 L-8 -13.6 L-5 -12 L-8 -10.4 Z', C.navy, null), line('M-8 -11 L-8 -9', C.navy, 0.8), line('M-3 -13 L10 -13 M-3 -10 L7 -10', C.grey2, 1.6),
  rect(-11, -3, 6, 4.4, C.brown, 0.8, null), line('M-9.4 -3 L-9.4 -4.4 L-6.6 -4.4 L-6.6 -3', C.brown, 0.8), line('M-3 -3 L10 -3 M-3 0 L7 0', C.grey2, 1.6),
  rect(-11, 6, 6, 4, C.sky, 1.4, null), line('M-3 7 L10 7 M-3 10 L7 10', C.grey2, 1.6), extra);
const pen = (x: number, y: number, s = 1, rot = 35) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-2, -14, 4, 22, C.navy, 1, C.ink, 1), path('M-2 8 L0 13 L2 8 Z', C.tan, C.ink, 0.8));
const cal = (x: number, y: number, s = 1, hi: number[] = [], col: string = HL) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -14, 28, 28, C.white, 2, C.ink, 1.4), rect(-14, -14, 28, 7, RED, 2, C.ink, 1.4), ...Array.from({ length: 9 }, (_, i) => rect(-11 + (i % 3) * 8, -4 + Math.floor(i / 3) * 6, 6, 4.4, hi.includes(i) ? col : C.grey2, 0.8, null)));
const hourglass = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M-8 -12 L8 -12 M-8 12 L8 12', C.brown, 2.4), path('M-6 -11 L6 -11 L1 0 L6 11 L-6 11 L-1 0 Z', 'rgba(220,240,252,0.7)', C.ink, 1.2), path('M-5 10 L5 10 L0 3 Z', C.tan, null));
/** Clock face; hh in hours (0–12), mm in minutes. */
const clock = (x: number, y: number, r: number, hh = 3, mm = 0, face: string = C.white) => { const ha = ((hh % 12) + mm / 60) / 12 * Math.PI * 2, ma = mm / 60 * Math.PI * 2; return all(circle(x, y, r, face, C.ink, 1.8), ...Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return line(`M${f1(x + Math.sin(a) * r * 0.82)} ${f1(y - Math.cos(a) * r * 0.82)} L${f1(x + Math.sin(a) * r * 0.92)} ${f1(y - Math.cos(a) * r * 0.92)}`, C.ink, 1); }), line(`M${x} ${y} L${f1(x + Math.sin(ha) * r * 0.5)} ${f1(y - Math.cos(ha) * r * 0.5)}`, C.ink, 2.2), line(`M${x} ${y} L${f1(x + Math.sin(ma) * r * 0.75)} ${f1(y - Math.cos(ma) * r * 0.75)}`, C.ink, 1.6), circle(x, y, 1.6, C.ink, null)); };
/** Pie (filled sector from 12 o'clock clockwise), frac 0–1. */
const pie = (x: number, y: number, r: number, frac: number, col: string = C.green) => { if (frac >= 1) return circle(x, y, r, col, C.ink, 1.8); const a = frac * Math.PI * 2, ex2 = x + Math.sin(a) * r, ey = y - Math.cos(a) * r; return all(circle(x, y, r, C.white, C.ink, 1.8), path(`M${x} ${y} L${x} ${y - r} A${r} ${r} 0 ${frac > 0.5 ? 1 : 0} 1 ${f1(ex2)} ${f1(ey)} Z`, col, C.ink, 1.4)); };
const coins = (x: number, y: number, n = 3, r = 5) => all(...Array.from({ length: n }, (_, i) => ellipse(x, y - i * 3, r, r * 0.45, C.gold, C.ink, 1.1)));
const handshake = (x: number, y: number, s = 1, c1: string = C.navy, c2: string = C.navy) => g(`translate(${x} ${y}) scale(${s})`, rect(-22, -4, 12, 9, c1, 2, C.ink, 1.2), rect(10, -4, 12, 9, c2, 2, C.ink, 1.2), path('M-10 -4 C-4 -8 4 -8 10 -4 L10 5 C4 8 -4 8 -10 5 Z', C.skin, C.ink, 1.2), line('M-4 -5 L-2 5 M0 -6 L2 5 M4 -5 L5 4', C.ink, 0.8));
const mag = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 8, 'rgba(220,240,252,0.7)', C.ink, 2), line('M5.6 5.6 L12 12', C.ink, 3));
const table = (y: number, x1: number, x2: number) => all(rect(x1, y, x2 - x1, 6, C.tan, 2, C.ink, 1.8), line(`M${x1 + 8} ${y + 6} L${x1 + 8} 112 M${x2 - 8} ${y + 6} L${x2 - 8} 112`, C.brown, 3));
const laptop = (x: number, y: number, s = 1, screen: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-16, -22, 32, 21, C.dark, 2, C.ink, 1.4), rect(-13.5, -19.5, 27, 16, '#bfe3f5', 1, null), screen, path('M-20 -1 L20 -1 L22 2 L-22 2 Z', C.grey, C.ink, 1.2));
const phone = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-4, -7, 8, 14, C.dark, 2, C.ink, 1), rect(-3, -5, 6, 9, '#bfe3f5', 0.5, null));
const briefcase = (x: number, y: number, s = 1, col: string = C.brown) => g(`translate(${x} ${y}) scale(${s})`, path('M-4 -7 L-4 -10 L4 -10 L4 -7', 'none', C.ink, 1.6), rect(-10, -7, 20, 14, col, 2, C.ink, 1.4), line('M-10 -1 L10 -1', C.ink, 0.9));
const calcu = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-8, -11, 16, 22, C.dark, 2, C.ink, 1.2), rect(-6, -9, 12, 5, '#cfe9c8', 1, null), ...Array.from({ length: 9 }, (_, i) => rect(-6 + (i % 3) * 4.4, -2 + Math.floor(i / 3) * 4.2, 3.2, 3, i === 8 ? C.orange : C.grey2, 0.6, null)));
const barChart = (x: number, y: number, s = 1, hs: number[] = [6, 10, 8, 14], col: string = C.green) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -18, 28, 26, C.white, 2, C.ink, 1.4), ...hs.map((h, i) => rect(-10 + i * 6, 5 - h, 4, h, col, 0.5, null)), line('M-11 5 L11 5', C.ink, 1));
const wrench = (x: number, y: number, s = 1, rot = 40) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-1.8, -2, 3.6, 16, C.silver, 1, C.ink, 1), path('M-5 -2 L-5 -8 L-2 -10 L-2 -5 L2 -5 L2 -10 L5 -8 L5 -2 Z', C.silver, C.ink, 1));
const box = (x: number, y: number, w = 20, h = 14) => all(rect(x - w / 2, y - h / 2, w, h, C.tan, 1, C.ink, 1.4), line(`M${x - w / 2} ${y - h / 2 + 4} L${x + w / 2} ${y - h / 2 + 4} M${x} ${y - h / 2} L${x} ${y - h / 2 + 4}`, '#a0673d', 1));
const shelf = (x: number, y: number, w: number, h: number) => all(line(`M${x} ${y} L${x} ${y + h} M${x + w} ${y} L${x + w} ${y + h}`, C.grey, 3), ...[0, 1, 2].map((r) => line(`M${x} ${y + 8 + r * (h - 8) / 2.6} L${x + w} ${y + 8 + r * (h - 8) / 2.6}`, C.grey, 2.4)), ...[0, 1].map((r) => all(box(x + w * 0.3, y + 1 + r * (h - 8) / 2.6, 12, 12), box(x + w * 0.7, y + 1 + r * (h - 8) / 2.6, 12, 12))));
const gift = (x: number, y: number, s = 1, col: string = C.red) => g(`translate(${x} ${y}) scale(${s})`, rect(-12, -8, 24, 18, col, 2, C.ink, 1.4), rect(-14, -13, 28, 6, col, 2, C.ink, 1.4), rect(-2, -13, 4, 23, C.gold, 0, null), path('M0 -13 C-8 -22 -12 -14 0 -13 C12 -14 8 -22 0 -13', 'none', C.gold, 2));
const cup = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-6 -6 L6 -6 L5 6 C5 8 -5 8 -5 6 Z', C.white, C.ink, 1.3), path('M6 -3 C10 -3 10 3 5 3', 'none', C.ink, 1.2), path('M-2 -9 C-3 -12 0 -13 -1 -16 M2 -9 C1 -12 4 -13 3 -16', 'none', C.grey, 1));
const pin = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 14 C-4 6 -10 0 -10 -6 C-10 -12 -5 -16 0 -16 C5 -16 10 -12 10 -6 C10 0 4 6 0 14 Z', RED, C.ink, 1.4), circle(0, -6, 4, C.white, C.ink, 1));
const car = (x: number, y: number, s = 1, col: string = C.denim) => g(`translate(${x} ${y}) scale(${s})`, path('M-18 2 L-18 -6 L-10 -8 L-5 -15 L8 -15 L13 -8 L18 -6 L18 2 Z', col, C.ink, 1.4), rect(-3, -13, 9, 5, '#bfe3f5', 1, null), circle(-10, 3, 4, C.dark, C.ink, 1), circle(10, 3, 4, C.dark, C.ink, 1));
const school = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-10 -2 L0 -10 L10 -2 Z', RED, C.ink, 1.1), rect(-8, -2, 16, 11, C.yellow, 1, C.ink, 1.1), rect(-2, 3, 4, 6, C.brown, 0.5, null), circle(0, -4.5, 1.6, C.white, C.ink, 0.6));

// ── Buildings ────────────────────────────────────────────────────────
/** A company: a warm-coloured block with a sawtooth roof. */
const company = (x: number, y: number, s = 1, col: string = '#e9c27a') => g(`translate(${x} ${y}) scale(${s})`, path('M-22 -14 L-22 -26 L-11 -18 L-11 -26 L0 -18 L0 -26 L11 -18 L22 -18 L22 22 L-22 22 Z', col, C.ink, 1.4), ...[-14, -4, 6, 16].map((cx) => rect(cx - 3, -8, 6, 7, '#9ad0f0', 0.5, C.ink, 0.6)), rect(-5, 9, 10, 13, C.brown, 0.5, C.ink, 1), rect(12, 4, 6, 6, '#9ad0f0', 0.5, C.ink, 0.6));
/** Office building with rows of windows (no flag). */
const office = (x: number, y: number, s = 1, col: string = '#cfd8e2') => g(`translate(${x} ${y}) scale(${s})`, rect(-22, -30, 44, 52, col, 1.5, C.ink, 1.4), ...Array.from({ length: 12 }, (_, i) => rect(-17 + (i % 4) * 9.4, -25 + Math.floor(i / 4) * 11, 6, 7, '#9ad0f0', 0.5, C.ink, 0.6)), rect(-5, 9, 10, 13, C.brown, 0.5, C.ink, 1));
/** A factory with a chimney. */
const factory = (x: number, y: number, s = 1, col: string = '#d9c6a8') => g(`translate(${x} ${y}) scale(${s})`, rect(14, -36, 7, 20, C.grey, 0.5, C.ink, 1.2), path('M-24 20 L-24 -10 L-12 -18 L-12 -10 L0 -18 L0 -10 L12 -18 L12 -16 L24 -16 L24 20 Z', col, C.ink, 1.4), ...[-16, -4, 8].map((cx) => rect(cx - 3, -4, 6, 6, '#9ad0f0', 0.5, C.ink, 0.6)), rect(10, 6, 9, 14, C.brown, 0.5, C.ink, 1));
const hospital = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-18, -20, 36, 40, C.white, 1.5, C.ink, 1.4), rect(-3, -16, 6, 14, RED, 0, null), rect(-7, -12, 14, 6, RED, 0, null), rect(-5, 8, 10, 12, '#9ad0f0', 0.5, C.ink, 0.8));
const shop = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-18, -12, 36, 32, '#f3e2c4', 1, C.ink, 1.4), path('M-20 -12 L20 -12 L18 -20 L-18 -20 Z', C.green, C.ink, 1.2), ...[-14, -6, 2, 10].map((cx) => rect(cx, -12, 4, 5, C.white, 0, null)), rect(-14, -2, 14, 12, '#9ad0f0', 0.5, C.ink, 0.8), rect(4, 2, 8, 18, C.brown, 0.5, C.ink, 1));

function house(x: number, y: number, s = 1, col = '#e8a07a'): Svg { return g(`translate(${x} ${y}) scale(${s})`, path('M-14 -2 L0 -14 L14 -2 Z', RED, C.ink, 1.3), rect(-11, -2, 22, 16, col, 1, C.ink, 1.3), rect(-3, 5, 6, 9, C.brown, 0.5, C.ink, 0.8)); }

// ── Market-economy things ────────────────────────────────────────────
/** A price tag (hole on the left) centred on (x, y); `inner` is drawn in tag coordinates (−16…16, −10…10). */
const tag = (x: number, y: number, s = 1, col: string = '#f6e3a8', inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, path('M-16 0 L-8 -10 L16 -10 L16 10 L-8 10 Z', col, C.ink, 1.4), circle(-9, 0, 2, C.white, C.ink, 1), inner);
/** A price tag with a coin on it. */
const ptag = (x: number, y: number, s = 1, col: string = '#f6e3a8') => tag(x, y, s, col, coin(4, 0, 5));
/** Line chart; pts are heights 0–1. */
const chart = (x: number, y: number, w: number, h: number, pts: number[], col: string = C.green, frame = true) => {
  const xy = pts.map((p, i) => `${f1(x + 8 + i * (w - 14) / (pts.length - 1))} ${f1(y + h - 8 - p * (h - 16))}`);
  return all(frame ? rect(x, y, w, h, C.white, 3, C.ink, 1.4) : '', line(`M${x + 5} ${y + 4} L${x + 5} ${y + h - 5} L${x + w - 4} ${y + h - 5}`, C.grey, 1.2), line('M' + xy.join(' L'), col, 2.8));
};
/** The business cycle: a wave across the picture between y0 (top) and y1 (bottom). */
const waveD = (y0: number, y1: number) => { const m = (y0 + y1) / 2, a = (y1 - y0) / 2; return `M8 ${m} C18 ${m - a * 1.3} 30 ${m - a * 1.3} 36 ${m} C42 ${m + a * 1.3} 54 ${m + a * 1.3} 64 ${m} C74 ${m - a * 1.3} 86 ${m - a * 1.3} 92 ${m} C98 ${m + a * 1.3} 108 ${m + a * 1.3} 114 ${m}`; };
const sea = path('M0 100 Q10 96 20 100 T40 100 T60 100 T80 100 T100 100 T120 100 L120 120 L0 120 Z', '#8cc7e8', null);
/** Container ship on the water line y. */
const ship = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-42 -2 L42 -2 L34 12 L-36 12 Z', C.navy, C.ink, 1.4), rect(26, -20, 12, 18, C.white, 1, C.ink, 1.2), rect(28, -17, 8, 4, '#9ad0f0', 0.5, null),
  ...[-38, -26, -14, -2, 10].map((cx, i) => rect(cx, -12, 11, 10, [RED, C.orange, C.green, C.denim, C.yellow][i]!, 1, C.ink, 1)), ...[-32, -20, -8, 4].map((cx, i) => rect(cx, -22, 11, 10, [C.green, C.denim, RED, C.orange][i]!, 1, C.ink, 1)));
/** A classical building with columns (government or central bank). */
const columns = (x: number, y: number, s = 1, col: string = C.white) => g(`translate(${x} ${y}) scale(${s})`, path('M-24 -14 L0 -28 L24 -14 Z', col, C.ink, 1.4), rect(-22, -14, 44, 4, col, 0, C.ink, 1.2), ...[-16, -6, 4, 14].map((cx) => rect(cx - 2, -10, 4, 24, col, 0, C.ink, 1)), rect(-25, 14, 50, 5, col, 0, C.ink, 1.4));
/** Central bank: columns with a big coin in the pediment. */
const cbank = (x: number, y: number, s = 1) => all(columns(x, y, s, '#e8eef4'), coin(x, y - 19 * s, 4.4 * s));
/** Government: a domed building. */
const govt = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-10 -16 C-10 -30 10 -30 10 -16 Z', '#9ad0c0', C.ink, 1.3), line('M0 -28 L0 -34', C.ink, 1.2), rect(-24, -16, 48, 32, '#f0e6d2', 1, C.ink, 1.4), ...[-17, -8, 1, 10].map((cx) => rect(cx, -10, 6, 10, '#9ad0f0', 0.5, C.ink, 0.6)), rect(-4, 4, 8, 12, C.brown, 0.5, C.ink, 1));
const globe = (x: number, y: number, r: number) => all(circle(x, y, r, '#8cc7e8', C.ink, 1.6), path(`M${f1(x - r * 0.6)} ${f1(y - r * 0.5)} C${f1(x - r * 0.2)} ${f1(y - r * 0.8)} ${f1(x + r * 0.1)} ${f1(y - r * 0.3)} ${f1(x - r * 0.1)} ${f1(y)} C${f1(x - r * 0.3)} ${f1(y + r * 0.4)} ${f1(x - r * 0.7)} ${f1(y + r * 0.1)} ${f1(x - r * 0.6)} ${f1(y - r * 0.5)} Z`, '#7bbf6a', C.ink, 1), path(`M${f1(x + r * 0.3)} ${f1(y - r * 0.2)} C${f1(x + r * 0.8)} ${f1(y - r * 0.4)} ${f1(x + r * 0.8)} ${f1(y + r * 0.4)} ${f1(x + r * 0.4)} ${f1(y + r * 0.6)} C${f1(x + r * 0.1)} ${f1(y + r * 0.4)} ${f1(x + r * 0.1)} ${f1(y)} ${f1(x + r * 0.3)} ${f1(y - r * 0.2)} Z`, '#7bbf6a', C.ink, 1));
/** A country as a soft blob; a house inside marks "our country". */
const land = (x: number, y: number, s = 1, col: string = '#d8eccf', home = false) => g(`translate(${x} ${y}) scale(${s})`, path('M-20 -8 C-22 -20 -6 -24 4 -18 C16 -22 24 -10 20 2 C24 14 8 22 -4 18 C-16 22 -24 8 -20 -8 Z', col, C.ink, 1.4), home ? house(0, 2, 0.7) : '');
const tree = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-1.6, -6, 3.2, 6, C.brown, 0, null), path('M0 -30 L9 -16 L5 -16 L11 -6 L-11 -6 L-5 -16 L-9 -16 Z', '#3f8a55', C.ink, 1.1));
const truck = (x: number, y: number, s = 1, col: string = C.denim, load: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-22, -20, 30, 18, col, 1.5, C.ink, 1.3), path('M8 -14 L16 -14 L22 -8 L22 -2 L8 -2 Z', C.white, C.ink, 1.3), rect(11, -12, 6, 4, '#9ad0f0', 0.5, null), circle(-14, 0, 4, C.dark, C.ink, 1), circle(14, 0, 4, C.dark, C.ink, 1), load);
const cart = (x: number, y: number, s = 1, load: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, load, path('M-20 -22 L-16 -22 L-12 -4 L14 -4 L18 -18 L-14 -18', 'none', C.ink, 1.8), line('M-12 -4 L-14 2 L14 2', C.ink, 1.6), circle(-10, 6, 3, C.dark, null), circle(10, 6, 3, C.dark, null));
const roll = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-5, -6, 10, 12, C.white, 2, C.ink, 1), ellipse(0, -6, 5, 1.8, C.white, C.ink, 0.9), ellipse(0, -6, 1.6, 0.7, C.grey, null));
const umbrella = (x: number, y: number, s = 1, col: string = C.denim) => g(`translate(${x} ${y}) scale(${s})`, path('M-26 0 C-24 -18 24 -18 26 0 C20 -4 14 -4 8 0 C2 -4 -2 -4 -8 0 C-14 -4 -20 -4 -26 0 Z', col, C.ink, 1.4), line('M0 0 L0 22 C0 26 -5 26 -5 22', C.ink, 1.6));
const gear = (x: number, y: number, r: number, col: string = C.grey) => all(...Array.from({ length: 8 }, (_, i) => { const a = i / 8 * Math.PI * 2; return rect(x + Math.cos(a) * r - 3, y + Math.sin(a) * r - 3, 6, 6, col, 1, C.ink, 1); }), circle(x, y, r, col, C.ink, 1.4), circle(x, y, r * 0.35, C.white, C.ink, 1));
/** Balance scale; tilt > 0 = right pan lower. */
const balance = (x: number, y: number, tilt: number, left: Svg = '', right: Svg = '') => { const dy = tilt * 10; return all(line(`M${x} ${y} L${x} ${y + 50}`, C.brown, 3), path(`M${x - 14} ${y + 54} L${x + 14} ${y + 54} L${x + 8} ${y + 48} L${x - 8} ${y + 48} Z`, C.brown, C.ink, 1.2), line(`M${x - 34} ${y - dy} L${x + 34} ${y + dy}`, C.ink, 2.4), circle(x, y, 3, C.gold, C.ink, 1),
  line(`M${x - 34} ${y - dy} L${x - 44} ${y - dy + 18} M${x - 34} ${y - dy} L${x - 24} ${y - dy + 18} M${x + 34} ${y + dy} L${x + 24} ${y + dy + 18} M${x + 34} ${y + dy} L${x + 44} ${y + dy + 18}`, C.grey, 1), path(`M${x - 46} ${y - dy + 18} L${x - 22} ${y - dy + 18} C${x - 24} ${y - dy + 24} ${x - 44} ${y - dy + 24} ${x - 46} ${y - dy + 18} Z`, C.gold, C.ink, 1.2), path(`M${x + 22} ${y + dy + 18} L${x + 46} ${y + dy + 18} C${x + 44} ${y + dy + 24} ${x + 24} ${y + dy + 24} ${x + 22} ${y + dy + 18} Z`, C.gold, C.ink, 1.2), g(`translate(${x - 34} ${y - dy + 16})`, left), g(`translate(${x + 34} ${y + dy + 16})`, right)); };
const wallet = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-12, -8, 24, 16, C.brown, 3, C.ink, 1.4), rect(4, -4, 10, 8, '#8a5530', 2, C.ink, 1), circle(8, 0, 1.4, C.gold, null));
const target = (x: number, y: number, r: number) => all(circle(x, y, r, C.white, C.ink, 1.6), circle(x, y, r * 0.7, RED, C.ink, 1.2), circle(x, y, r * 0.42, C.white, C.ink, 1.2), circle(x, y, r * 0.16, RED, null));
const pickaxe = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, line('M0 -14 L0 14', C.brown, 3), path('M-14 -12 C-6 -18 6 -18 14 -12 C6 -15 -6 -15 -14 -12 Z', C.silver, C.ink, 1.2));
const tractor = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -18, 20, 12, RED, 1.5, C.ink, 1.3), rect(-4, -30, 12, 13, RED, 1, C.ink, 1.3), rect(-1, -27, 7, 7, '#9ad0f0', 0.5, null), rect(8, -16, 10, 8, RED, 1, C.ink, 1.2), circle(-8, -4, 9, C.dark, C.ink, 1.3), circle(-8, -4, 3, C.grey, null), circle(14, -2, 6, C.dark, C.ink, 1.3));
const cow = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -16, 26, 13, C.white, 6, C.ink, 1.3), circle(-6, -12, 3.4, C.dark, null), circle(5, -8, 2.6, C.dark, null), rect(10, -20, 10, 9, C.white, 4, C.ink, 1.2), circle(17, -16, 0.9, C.ink, null), line('M-11 -3 L-11 4 M-4 -3 L-4 4 M3 -3 L3 4 M9 -3 L9 4', C.ink, 1.8));
const hotel = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-18, -40, 36, 60, '#f2d0c4', 1.5, C.ink, 1.4), ...Array.from({ length: 12 }, (_, i) => rect(-13 + (i % 3) * 10, -34 + Math.floor(i / 3) * 11, 6, 7, '#9ad0f0', 0.5, C.ink, 0.6)), rect(-6, 8, 12, 12, C.brown, 0.5, C.ink, 1), path('M-10 8 L10 8 L12 4 L-12 4 Z', RED, C.ink, 1));
const suitcase = (x: number, y: number, s = 1, col: string = C.orange) => g(`translate(${x} ${y}) scale(${s})`, rect(-7, -10, 14, 18, col, 2, C.ink, 1.2), path('M-3 -10 L-3 -13 L3 -13 L3 -10', 'none', C.ink, 1.2), circle(-4, 9, 1.4, C.dark, null), circle(4, 9, 1.4, C.dark, null));
const robotArm = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-10, -6, 20, 6, C.grey, 1, C.ink, 1.2), line('M0 -6 L-8 -30 L14 -42', C.orange, 6), line('M0 -6 L-8 -30 L14 -42', C.ink, 0.8), circle(-8, -30, 3.4, C.grey, C.ink, 1), circle(0, -6, 3.4, C.grey, C.ink, 1), path('M14 -42 L20 -38 M14 -42 L18 -48', 'none', C.ink, 2));
const belt = (x1: number, x2: number, y: number) => all(rect(x1, y, x2 - x1, 6, C.dark, 3, C.ink, 1.2), ...Array.from({ length: Math.floor((x2 - x1) / 12) }, (_, i) => circle(x1 + 6 + i * 12, y + 3, 1.6, C.grey, null)), line(`M${x1 + 6} ${y + 6} L${x1 + 6} 112 M${x2 - 6} ${y + 6} L${x2 - 6} 112`, C.grey, 2.4));
const bulb = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ...[-1, 0, 1].map((i) => line(`M${i * 14} ${-16 - (i === 0 ? 4 : 0)} l${i * 4} -5`, C.gold, 2)), circle(0, -4, 10, C.yellow, C.ink, 1.4), rect(-5, 5, 10, 7, C.grey, 1.5, C.ink, 1.2));
const bag$ = (x: number, y: number, s = 1, col: string = C.tan) => g(`translate(${x} ${y}) scale(${s})`, path('M-4 -14 L4 -14 L2 -10 C12 -6 14 12 0 12 C-14 12 -12 -6 -2 -10 Z', col, C.ink, 1.4), line('M-4 -10 L4 -10', C.brown, 1.6), circle(0, 2, 4.4, C.gold, C.ink, 1));
const people = (x: number, y: number, n: number, dx: number, s: number, col: (i: number) => string, mood: (i: number) => 'smile' | 'frown' | 'flat' = () => 'smile') => all(...Array.from({ length: n }, (_, i) => mini(x + i * dx, y, col(i), mood(i), s)));
const shelfEmpty = (x: number, y: number, w: number, h: number) => all(line(`M${x} ${y} L${x} ${y + h} M${x + w} ${y} L${x + w} ${y + h}`, C.grey, 3), ...[0, 1, 2].map((r) => line(`M${x} ${y + 10 + r * (h - 10) / 2.4} L${x + w} ${y + 10 + r * (h - 10) / 2.4}`, C.grey, 2.4)));
const apple = (x: number, y: number, r = 4) => all(circle(x, y, r, RED, C.ink, 1), line(`M${x} ${y - r} l1 -2`, C.brown, 1));
const milk = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-5 -6 L0 -11 L5 -6 L5 9 L-5 9 Z', C.white, C.ink, 1.1), rect(-5, -2, 10, 5, C.denim, 0, null));
const stall = (x: number, y: number, s = 1, col: string = RED, goods: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, line('M-20 -30 L-20 14 M20 -30 L20 14', C.brown, 2.4), path('M-24 -30 L24 -30 L22 -38 L-22 -38 Z', col, C.ink, 1.2), ...[-16, -6, 4, 14].map((cx) => rect(cx - 2, -30, 4, 4, C.white, 0, null)), rect(-22, -2, 44, 8, C.tan, 1, C.ink, 1.3), goods);
const cobweb = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L14 0 M0 0 L0 14 M0 0 L10 10 M4 0 Q4 4 0 4 M8 0 Q8 8 0 8 M12 0 Q12 12 0 12', C.grey, 0.9));
const pause = (x: number, y: number, r = 9) => all(circle(x, y, r, C.yellow, C.ink, 1.3), rect(x - r * 0.4, y - r * 0.45, r * 0.25, r * 0.9, C.ink, 0.5, null), rect(x + r * 0.15, y - r * 0.45, r * 0.25, r * 0.9, C.ink, 0.5, null));
const bolt2 = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', C.yellow, C.ink, 1.4));
const chain = (x1: number, y1: number, x2: number, y2: number, n: number) => all(...Array.from({ length: n }, (_, i) => { const t = (i + 0.5) / n; return ellipse(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, 3.4, 2.2, 'none', C.grey, 1.6); }));
const curr = (x: number, y: number, sym: string, col: string = C.gold, r = 10) => all(circle(x, y, r, col, C.ink, 1.3), T(x, y + r * 0.42, sym, r * 1.1, C.ink));
const note$ = (x: number, y: number, s = 1, col: string = '#a8d8a8', sym = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-16, -8, 32, 16, col, 2, C.ink, 1.2), circle(0, 0, 4.4, 'rgba(255,255,255,0.6)', C.ink, 0.8), sym ? T(0, 2.6, sym, 7, C.ink) : '');
const pipe = (x1: number, x2: number, y: number) => all(rect(x1, y - 3, x2 - x1, 6, C.silver, 2, C.ink, 1), circle(x1 + (x2 - x1) * 0.7, y, 1.8, C.sky, null));

export const MARKET_ECONOMY_MOTIFS: Record<string, Svg> = {
  // ── 1541 Utbud och efterfrågan ──
  'mark.marknad': all(stall(30, 70, 0.9, C.green, all(apple(-12, -6), apple(-4, -6), apple(4, -6), apple(12, -6))), stall(90, 70, 0.9, RED, all(milk(-10, -12, 0.8), milk(0, -12, 0.8), milk(10, -12, 0.8))), people(16, 96, 2, 28, 0.7, (i) => [C.orange, C.purple][i]!), people(76, 96, 2, 28, 0.7, (i) => [C.sky, C.yellow][i]!), coin(46, 92, 4), coin(60, 98, 4), coin(74, 92, 4), ground),
  'mark.utbud': all(stall(46, 76, 1.3, C.green, all(...Array.from({ length: 12 }, (_, i) => apple(-16 + (i % 6) * 6.4, -7 - Math.floor(i / 6) * 6, 3.2)))), ring(46, 70, 34, HL), greyed(mini(104, 92, C.grey, 'flat', 0.8)), ground),
  'mark.efterfrågan': all(stall(24, 76, 0.9, RED, apple(0, -6, 4)), ...[0, 1, 2, 3, 4].map((i) => all(mini(54 + i * 14, 96 - (i % 2) * 4, [C.orange, C.sky, C.purple, C.green, C.yellow][i]!, 'smile', 0.62))), ...[0, 1, 2].map((i) => arrow(56 + i * 22, 70, 46 - i * 2, 62 + i * 2, HL, 1.6)), coin(70, 64, 4), coin(92, 62, 4), ground),
  'mark.producent': all(tree(18, 112, 1.6), fig(48, '#7aa04a', 'smile', { h: 0.88, bottom: C.denim }), reach(48, 0.88, 1, 66, 76), box(76, 86, 24, 16), apple(70, 76), apple(78, 76), apple(84, 77), arrow(92, 86, 104, 86, HL, 2), shop(106, 56, 0.45), ground),
  'mark.efterfråga': all(shop(26, 74, 1.1), ...[0, 1, 2].map((i) => all(mini(66 + i * 20, 98, [C.orange, C.sky, C.purple][i]!, 'smile', 0.7))), say(92, 58, 40, 26, 86, 86, all(cup(84, 60, 0.8), ex(102, 58, 12))), ground),
  'mark.marknadspris': all(mini(16, 96, C.orange, 'smile', 0.8), mini(104, 96, C.sky, 'smile', 0.8), balance(60, 40, 0, coin(0, -3, 5), apple(0, -3, 5)), ptag(60, 18, 1.1), ground),
  'mark.stiga': all(chart(10, 50, 70, 56, [0.1, 0.3, 0.5, 0.75, 0.95], RED), arrow(88, 96, 88, 46, RED, 3), ptag(92, 28, 1.0), greyed(ptag(30, 26, 0.7))),
  'mark.sjunka.2': all(chart(10, 50, 70, 56, [0.95, 0.75, 0.5, 0.3, 0.1], C.green), arrow(88, 46, 88, 96, C.green, 3), ptag(92, 106, 0.8), greyed(ptag(30, 26, 1.0))),
  'mark.bristvara': all(shelfEmpty(10, 20, 60, 86), milk(56, 76, 1.0), ...[0, 1, 2].map((i) => mini(84 + (i % 2) * 18, 40 + i * 26, [C.orange, C.purple, C.sky][i]!, 'frown', 0.6)), warn(40, 40, 0.9), ground),
  'mark.överskott.2': all(...Array.from({ length: 18 }, (_, i) => milk(18 + (i % 6) * 13, 104 - Math.floor(i / 6) * 22, 1.2)), greyed(mini(106, 92, C.grey, 'flat', 0.7), cart(106, 116, 0.5))),
  'mark.hamstra': all(fig(26, C.orange, 'shock', { h: 0.86 }), reach(26, 0.86, 1, 50, 78), cart(74, 98, 1.3, all(...Array.from({ length: 10 }, (_, i) => roll(-12 + (i % 4) * 8, -26 - Math.floor(i / 4) * 12, 1.1)))), greyed(shelfEmpty(94, 18, 22, 60)), ground),
  'mark.planekonomi': all(govt(60, 30, 0.9), ...[22, 60, 98].map((x) => all(shop(x, 96, 0.55), ptag(x, 70, 0.6))), line('M60 46 L22 60 M60 46 L60 60 M60 46 L98 60', HL, 1.6)),

  // ── 1542 Priser och konkurrens ──
  'mark.konkurrent': all(shop(28, 80, 0.95), greyed(mini(28, 50, C.grey, 'flat', 0.6)), shop(92, 80, 0.95), ring(92, 76, 25, HL), mini(92, 46, RED, 'smile', 0.6), arrow(70, 60, 50, 60, C.grey, 1.6), arrow(50, 70, 70, 70, C.grey, 1.6), ground),
  'mark.konkurrera': all(fig(20, RED, 'smile', { h: 0.82 }), fig(100, C.denim, 'smile', { h: 0.82 }), reach(20, 0.82, 1, 42, 66), reach(100, 0.82, -1, 78, 66), cup(44, 64, 1.0), cup(76, 64, 1.0), mini(60, 98, C.yellow, 'flat', 0.7), q(60, 76, 12, C.navy), ground),
  'mark.konkurrenskraftig': all(shop(34, 76, 1.1), star(34, 40, 6, C.gold), ptag(34, 22, 0.8, '#c8e8b8'), people(14, 102, 3, 20, 0.5, (i) => [C.orange, C.sky, C.purple][i]!), greyed(shop(96, 76, 0.75), ptag(96, 46, 0.6)), ground),
  'mark.prissättning': all(fig(30, C.navy, 'calm', { h: 0.88 }), table(84, 40, 112), reach(30, 0.88, 1, 60, 72), tag(76, 72, 1.3, '#f6e3a8', all(coin(2, 0, 4), q(11, 0, 9))), pen(62, 66, 0.8, 30), calcu(100, 74, 0.8)),
  'mark.priskrig': all(shop(20, 84, 0.7), shop(100, 84, 0.7), ...[0, 1, 2].map((i) => all(tag(24 + i * 6, 28 + i * 16, 0.6 - i * 0.1), tag(96 - i * 6, 28 + i * 16, 0.6 - i * 0.1))), bolt2(60, 40, 1.4), arrow(46, 26, 50, 62, RED, 1.8), arrow(74, 26, 70, 62, RED, 1.8), ground),
  'mark.pressa-priserna': all(rect(30, 8, 60, 14, C.grey, 2, C.ink, 1.4), line('M60 22 L60 32', C.ink, 4), rect(26, 32, 68, 8, C.silver, 2, C.ink, 1.4), tag(60, 58, 1.6, '#f6e3a8', coin(4, 0, 4)), arrow(18, 30, 18, 70, HL, 2.4), arrow(102, 30, 102, 70, HL, 2.4), people(30, 98, 3, 30, 0.6, (i) => [RED, C.denim, C.green][i]!)),
  'mark.monopol': all(shop(30, 70, 1.3), ring(34, 66, 28, HL), ...[0, 1, 2, 3].map((i) => mini(78 + (i % 2) * 22, 30 + i * 20, [C.orange, C.sky, C.purple, C.green][i]!, 'flat', 0.55)), ground),
  'mark.dominera': all(pie(42, 50, 32, 0.8, RED), shop(98, 40, 0.7), circle(98, 70, 5, RED, C.ink, 1), greyed(shop(98, 100, 0.4))),
  'mark.kartell': all(...[24, 60, 96].map((x, i) => all(mini(x, 70, [C.navy, C.purple, C.brown][i]!, 'smile', 0.9), ptag(x, 100, 0.7))), line('M10 50 C30 30 90 30 110 50', C.grey, 1.6, '3 3'), say(60, 24, 30, 18, 60, 52, T(60, 28, '...', 12, C.navy)), padlock(108, 20, 0.8, false, C.grey)),
  'mark.Konkurrensverket': all(columns(30, 40, 1.0, '#e8eef4'), mag(76, 46, 1.6), shop(76, 94, 0.5), shop(104, 94, 0.5), ptag(76, 76, 0.5), ptag(104, 76, 0.5), ground),
  'mark.avreglering': all(rect(8, 60, 10, 52, C.grey, 1, C.ink, 1.2), path('M18 66 L44 52 L44 70 L18 84 Z', C.grey2, C.ink, 1.2), padlock(30, 30, 1.2, true, C.gold), ...[0, 1, 2].map((i) => all(shop(66 + i * 20, 98 - (i % 2) * 6, 0.45))), arrow(30, 98, 50, 98, HL, 2), ground),

  // ── 1543 Marknader och branscher ──
  'mark.bransch': all(...[16, 44, 72, 100].map((x) => all(shop(x, 54, 0.6), cup(x, 34, 0.7))), rect(3, 22, 114, 54, 'none', 6, HL, 2.4), greyed(factory(28, 98, 0.5), office(92, 98, 0.4))),
  'mark.sektor': all(pie(60, 56, 44, 0.5, '#f6e3a8'), company(80, 54, 0.5), shop(84, 80, 0.4), greyed(hospital(38, 46, 0.5), school(40, 80, 1.1))),
  'mark.näringsliv': all(factory(26, 52, 0.7), office(94, 52, 0.6), shop(30, 94, 0.6), company(90, 96, 0.6), line('M44 58 L76 58 M30 70 L30 80 M94 72 L94 80 M46 90 L72 90', C.grey, 1.6, '3 2'), coin(60, 74, 7)),
  'mark.privat-sektor': all(rect(4, 6, 54, 104, '#f6e3a8', 4, HL, 2.4), company(31, 40, 0.6), shop(31, 88, 0.6), greyed(hospital(88, 40, 0.6), school(88, 88, 1.3))),
  'mark.industri': all(factory(30, 70, 1.0), factory(90, 70, 1.0), cloud(44, 18, 0.7, C.grey2), cloud(104, 18, 0.7, C.grey2), ground),
  'mark.tillverkningsindustri': all(belt(8, 112, 82), ...[24, 60, 96].map((x) => car(x, 76, 0.6, [RED, C.denim, C.yellow][x === 24 ? 0 : x === 60 ? 1 : 2]!)), robotArm(60, 48, 0.8), factory(26, 30, 0.45)),
  'mark.skogsindustri': all(tree(16, 104, 1.4), tree(32, 108, 1.2), arrow(42, 90, 54, 90, HL, 2), ...[0, 1, 2].map((i) => all(circle(64, 100 - i * 8, 4, C.tan, C.ink, 1), rect(64, 96 - i * 8, 16, 8, C.tan, 0, C.ink, 0.8))), arrow(84, 90, 92, 90, HL, 2), factory(100, 50, 0.5), rect(94, 86, 18, 22, C.white, 3, C.ink, 1.3), ellipse(103, 86, 9, 3, C.white, C.ink, 1), ground),
  'mark.gruvindustri': all(path('M4 112 L4 40 L40 20 L80 30 L116 50 L116 112 Z', '#b8a088', C.ink, 1.4), path('M30 112 L30 76 C30 60 58 60 58 76 L58 112 Z', C.dark, C.ink, 1.4), line('M24 112 L66 112', C.brown, 2), path('M64 96 L96 96 L92 108 L68 108 Z', C.grey, C.ink, 1.3), circle(72, 110, 3, C.dark, null), circle(88, 110, 3, C.dark, null), ...[0, 1, 2, 3].map((i) => circle(70 + i * 7, 94 - (i % 2) * 3, 4, '#6a5a6a', C.ink, 0.9)), pickaxe(100, 74, 1.1, 30), g('translate(0 0)', '')),
  'mark.jordbruk': all(rect(4, 70, 112, 42, '#c9b36a', 2, null), ...[78, 88, 98, 108].map((y) => line(`M6 ${y} L114 ${y}`, '#a08a40', 1.6)), tractor(36, 100, 1.2), cow(88, 66, 1.0), sun(100, 20, 7), ground),
  'mark.tjänstesektor': all(...[[24, 24], [60, 18], [96, 24], [24, 64], [96, 64]].map(([x, y]) => circle(x!, y!, 15, C.white, C.ink, 1.4)), cup(24, 26, 1.1), line('M54 12 L66 24 M66 12 L54 24', C.ink, 1.8), circle(54, 26, 2.4, 'none', C.ink, 1.2), circle(66, 26, 2.4, 'none', C.ink, 1.2), rect(92, 18, 8, 12, RED, 0, null), rect(90, 20, 12, 8, C.white, 0, null), rect(93, 22, 6, 4, RED, 0, null), g('translate(24 66) scale(0.5)', path('M-18 2 L-18 -14 L18 -14 L18 2 Z', C.yellow, C.ink, 2), circle(-10, 4, 4, C.dark, null), circle(10, 4, 4, C.dark, null)), laptop(96, 72, 0.5), mini(60, 92, C.green, 'smile', 0.9)),
  'mark.detaljhandel': all(rect(8, 70, 40, 14, C.tan, 2, C.ink, 1.4), rect(10, 84, 36, 28, C.brown, 1, C.ink, 1.2), fig(24, C.green, 'smile', { h: 0.72 }), fig(88, C.orange, 'smile', { h: 0.86 }), reach(88, 0.86, -1, 58, 66), milk(52, 64, 1.0), coin(36, 66, 4), shelf(66, 10, 48, 34)),
  'mark.partihandel': all(rect(4, 30, 60, 82, '#cfd8e2', 2, C.ink, 1.4), ...Array.from({ length: 9 }, (_, i) => box(16 + (i % 3) * 18, 102 - Math.floor(i / 3) * 16, 16, 14)), truck(88, 104, 1.1, C.denim, all(box(-14, -12, 10, 8), box(-2, -12, 10, 8))), arrow(70, 70, 104, 70, HL, 2), shop(106, 46, 0.4)),
  'mark.besöksnäring': all(hotel(36, 88, 1.0), fig(84, C.yellow, 'laugh', { h: 0.8 }), suitcase(102, 104, 1.1), reach(84, 0.8, -1, 74, 52), rect(66, 46, 10, 8, C.dark, 1.5, C.ink, 1), circle(71, 50, 2.4, '#9ad0f0', null), sun(104, 18, 7), ground),
  'mark.storföretag': all(office(46, 70, 1.4), ...Array.from({ length: 6 }, (_, i) => mini(12 + i * 19, 104, [C.orange, C.sky, C.purple, C.green, C.yellow, C.pink][i]!, 'smile', 0.4)), greyed(shop(104, 30, 0.4))),
  'mark.småföretag': all(shop(44, 80, 1.2), mini(34, 56, C.orange, 'smile', 0.6), mini(54, 56, C.green, 'smile', 0.6), greyed(office(100, 70, 0.8)), ground),
  'mark.aktör': all(circle(60, 60, 22, '#f6e3a8', C.ink, 1.4), coin(60, 60, 8), ...[[60, 16, factory(0, 0, 0.32)], [102, 60, shop(0, 0, 0.42)], [60, 104, columns(0, 0, 0.36)], [18, 60, mini(0, 0, C.green, 'smile', 0.6)]].map(([x, y, s]) => all(circle(x as number, y as number, 14, C.white, C.ink, 1.2), g(`translate(${x} ${y})`, s as Svg))), line('M60 30 L60 38 M88 60 L82 60 M60 90 L60 82 M32 60 L38 60', HL, 2)),
  'mark.marknadsandel': all(pie(46, 56, 34, 0.3, RED), greyed(shop(100, 90, 0.5)), shop(100, 30, 0.5), circle(100, 56, 5, RED, C.ink, 1), ring(60, 30, 10, HL)),

  // ── 1544 Produktivitet och tillväxt ──
  'mark.producera': all(factory(36, 70, 1.2), belt(66, 114, 86), box(76, 80, 12, 10), box(92, 80, 12, 10), box(108, 80, 12, 10), arrow(66, 64, 110, 64, HL, 2), ground),
  'mark.produktion': all(belt(8, 112, 70), ...[18, 36, 54, 72, 90].map((x) => box(x, 64, 14, 10)), barChart(84, 34, 1.1, [4, 8, 12, 16], C.green), factory(28, 30, 0.5)),
  'mark.BNP': all(land(30, 50, 1.4, '#d8eccf', true), arrow(56, 50, 70, 50, HL, 2), ...Array.from({ length: 8 }, (_, i) => ellipse(94, 100 - i * 7, 16, 5, C.gold, C.ink, 1.1)), car(20, 104, 0.5, RED), box(40, 104, 12, 10), cup(54, 104, 0.8), line('M74 104 L74 46', C.grey, 1.4)),
  'mark.produktivitet': all(greyed(fig(22, C.grey, 'calm', { h: 0.72 }), box(22, 104, 12, 10), clock(22, 26, 10, 1, 0)), fig(76, C.green, 'smile', { h: 0.72 }), gear(102, 46, 9, C.grey), ...[0, 1, 2, 3].map((i) => box(96 + (i % 2) * 14, 106 - Math.floor(i / 2) * 11, 12, 10)), clock(80, 26, 10, 1, 0), arrow(44, 60, 56, 60, HL, 2)),
  'mark.effektivisera': all(greyed(line('M14 30 C30 10 30 50 46 30 C60 14 54 54 70 34 C82 18 90 40 104 30', C.grey, 2)), arrow(14, 80, 104, 80, C.green, 3), greyed(clock(18, 104, 7, 3, 30)), clock(102, 104, 7, 1, 0), mini(10, 60, C.green, 'smile', 0.5)),
  'mark.investering': all(coins(20, 100, 3, 7), arrow(32, 86, 46, 70, HL, 2), gear(60, 56, 14, C.silver), arrow(76, 56, 88, 56, HL, 2), coins(102, 100, 8, 7), cal(102, 30, 0.8, [8], C.green)),
  'mark.investera': all(company(28, 66, 0.9), fig(64, C.navy, 'smile', { h: 0.85 }), reach(64, 0.85, 1, 86, 74), coin(88, 72, 5), arrow(88, 80, 96, 88, HL, 1.6), robotArm(104, 110, 0.6), ground),
  'mark.automatisering': all(belt(8, 112, 82), box(30, 76, 14, 10), box(70, 76, 14, 10), robotArm(52, 82, 1.0), robotArm(96, 82, 0.8), greyed(fig(16, C.grey, 'calm', { h: 0.55 }))),
  'mark.digitalisering': all(greyed(...[0, 1, 2, 3].map((i) => doc(26 + i * 2, 70 - i * 4, 0.9))), arrow(48, 60, 64, 60, HL, 2.4), laptop(92, 76, 1.4), phone(100, 30, 1.4)),
  'mark.innovation': all(bulb(60, 58, 1.8), gear(30, 86, 10, C.grey), gear(54, 98, 7, C.silver), star(96, 24, 4, C.gold), star(22, 30, 3, C.gold), mini(94, 92, C.green, 'smile', 0.9)),
  'mark.arbetskraft': all(...Array.from({ length: 8 }, (_, i) => { const x = 16 + (i % 4) * 29, y = 50 + Math.floor(i / 4) * 44; return all(mini(x, y, [C.orange, C.sky, C.green, C.purple, C.yellow, C.denim, C.pink, C.brown][i]!, 'smile', 0.8), i % 3 === 0 ? path(`M${x - 7} ${y - 9} C${x - 7} ${y - 17} ${x + 7} ${y - 17} ${x + 7} ${y - 9} Z`, C.yellow, C.ink, 1) : ''); }), wrench(112, 20, 0.8, 40)),
  'mark.infrastruktur': all(path('M0 112 L46 60 L74 60 L120 112 Z', C.dark, null), line('M60 64 L60 72 M60 80 L60 92 M60 100 L60 112', C.white, 2), line('M4 48 L116 48', C.brown, 2.4), ...Array.from({ length: 10 }, (_, i) => line(`M${10 + i * 11} 44 L${10 + i * 11} 52`, C.brown, 1.4)), line('M20 8 L20 40 M100 8 L100 40 M12 12 L28 12 M92 12 L108 12', C.grey, 2), path('M12 12 Q60 26 108 12', 'none', C.ink, 1), pipe(0, 40, 104)),
  'mark.reallön': all(coins(22, 100, 6, 8), arrow(22, 50, 22, 36, C.green, 2), greyed(ptag(78, 30, 1.0)), ptag(78, 64, 1.3), arrow(104, 76, 104, 50, RED, 2.2), cart(80, 104, 0.7, milk(0, -12, 0.8))),
  'mark.välstånd': all(house(46, 86, 2.0), car(96, 104, 0.8, C.denim), mini(88, 70, C.green, 'smile', 0.8), mini(104, 72, C.orange, 'smile', 0.6), sun(102, 20, 8), star(24, 22, 3, C.gold), ground),

  // ── 1545 Konjunktur och arbetslöshet ──
  'mark.konjunktur': all(line(waveD(30, 90), C.navy, 3), sun(22, 14, 6), cloud(78, 108, 0.6, C.grey), line('M8 112 L114 112', C.grey, 1.4), arrow(100, 112, 114, 112, C.grey, 1.4)),
  'mark.högkonjunktur': all(greyed(line(waveD(40, 100), C.grey, 2.4)), circle(22, 42, 9, 'none', HL, 2.4), sun(52, 16, 6), factory(78, 52, 0.7), people(64, 98, 3, 16, 0.6, (i) => [C.orange, C.green, C.sky][i]!), coins(110, 104, 4, 5)),
  'mark.lågkonjunktur': all(greyed(line(waveD(14, 70), C.grey, 2.4)), circle(50, 68, 9, 'none', HL, 2.4), cloud(50, 92, 0.7, C.grey), shop(96, 86, 0.6), cross(96, 70, 0.8), mini(20, 98, C.grey, 'frown', 0.7)),
  'mark.uppgång.2': all(chart(10, 16, 100, 88, [0.15, 0.1, 0.3, 0.55, 0.85], C.green), arrow(70, 64, 100, 30, C.green, 2.6)),
  'mark.nedgång.2': all(chart(10, 16, 100, 88, [0.85, 0.9, 0.6, 0.35, 0.12], RED), arrow(70, 50, 100, 86, RED, 2.6)),
  'mark.finanskris': all(columns(44, 50, 1.4, '#e8eef4'), line('M40 30 L48 46 L42 60 L50 74', RED, 2.4), bolt2(96, 22, 1.4), chart(74, 62, 40, 36, [0.9, 0.7, 0.2], RED), coin(20, 100, 5), coin(34, 106, 5), mini(100, 106, C.grey, 'frown', 0.5)),
  'mark.arbetsmarknad': all(rect(8, 12, 46, 50, '#f6e3a8', 2, C.brown, 2), ...[0, 1, 2, 3].map((i) => all(rect(13 + (i % 2) * 20, 18 + Math.floor(i / 2) * 22, 16, 18, C.white, 1, C.ink, 1), briefcase(21 + (i % 2) * 20, 28 + Math.floor(i / 2) * 22, 0.45))), people(70, 40, 3, 18, 0.6, (i) => [C.orange, C.sky, C.purple][i]!), cv(78, 88, 0.6), cv(100, 88, 0.6), arrow(60, 80, 46, 70, HL, 1.8), ground),
  'mark.arbetslöshet': all(...Array.from({ length: 8 }, (_, i) => { const x = 14 + (i % 4) * 30, y = 30 + Math.floor(i / 4) * 50; return i === 1 || i === 6 ? all(mini(x, y, C.grey, 'frown', 0.8), cross(x + 10, y + 16, 0.5)) : greyed(mini(x, y, C.grey, 'smile', 0.8), briefcase(x + 10, y + 18, 0.4, C.grey)); }), ring(44, 36, 18, HL), ring(74, 86, 18, HL)),
  'mark.arbetslös': all(rect(10, 84, 60, 6, C.brown, 2, C.ink, 1.3), line('M14 90 L14 112 M66 90 L66 112', C.brown, 3), fig(40, C.grey, 'frown', { h: 0.8 }), greyed(briefcase(92, 104, 1.1, C.grey)), cross(92, 100, 1.0), doc(94, 50, 0.8), mag(102, 60, 0.8)),
  'mark.långtidsarbetslös': all(fig(32, C.grey, 'sleepy', { h: 0.8 }), cobweb(4, 4, 1.4), ...[0, 1, 2, 3].map((i) => cal(76 + i * 6, 34 + i * 6, 0.8, [8], C.grey)), hourglass(96, 90, 1.2), greyed(briefcase(58, 104, 0.8, C.grey)), ground),
  'mark.ungdomsarbetslöshet': all(...[0, 1, 2].map((i) => all(fig(22 + i * 38, [C.yellow, C.mint, C.pink][i]!, i === 1 ? 'frown' : 'calm', { h: 0.62 }))), q(22, 34, 12), q(60, 34, 12), q(98, 34, 12), greyed(briefcase(60, 14, 0.8, C.grey)), cross(60, 14, 0.7), ground),
  'mark.sysselsättning': all(...Array.from({ length: 8 }, (_, i) => { const x = 14 + (i % 4) * 30, y = 30 + Math.floor(i / 4) * 50; return all(mini(x, y, [C.orange, C.sky, C.green, C.purple][i % 4]!, 'smile', 0.8), briefcase(x + 10, y + 18, 0.4)); }), arrow(112, 104, 112, 70, C.green, 2.2)),
  'mark.permittera': all(factory(30, 50, 0.9), pause(58, 22, 10), fig(76, C.orange, 'calm', { h: 0.7 }), arrow(86, 100, 98, 100, C.grey, 1.6), house(106, 104, 0.8), contract(30, 92, 0.5), hourglass(52, 96, 0.8), ground),
  'mark.a-kassa': all(umbrella(60, 40, 1.6), fig(60, C.grey, 'calm', { h: 0.62 }), coin(40, 60, 5), coin(80, 60, 5), coin(60, 18, 5), cloud(20, 14, 0.6, C.grey), drops(20, 26), ground),
  'mark.Arbetsförmedlingen': all(table(84, 30, 112), fig(20, C.orange, 'calm', { h: 0.82 }), fig(100, C.navy, 'smile', { h: 0.82 }), laptop(66, 83, 1.1, briefcase(0, -11, 0.5)), reach(100, 0.82, -1, 82, 70)),
  'mark.hålla-i-pengarna': all(greyed(shop(92, 70, 1.0), gift(94, 100, 0.6)), fig(36, C.green, 'calm', { h: 0.86 }), reach(36, 0.86, -1, 30, 66), reach(36, 0.86, 1, 42, 66), wallet(36, 66, 1.0), ground),

  // ── 1546 Handel och import ──
  'mark.import': all(land(86, 60, 1.6, '#f6e3a8', true), globe(20, 30, 14), ship(36, 90, 0.5), sea, arrow(30, 50, 62, 60, HL, 2.6)),
  'mark.export': all(land(34, 60, 1.6, '#f6e3a8', true), globe(100, 30, 14), ship(86, 90, 0.5), sea, arrow(60, 60, 92, 48, HL, 2.6)),
  'mark.exportera': all(factory(26, 62, 0.8), box(52, 92, 14, 12), arrow(58, 76, 72, 76, HL, 2), sea, ship(84, 96, 0.6), arrow(98, 66, 114, 66, HL, 2)),
  'mark.utrikeshandel': all(land(60, 60, 1.4, '#f6e3a8', true), globe(18, 22, 10), globe(102, 22, 10), globe(18, 100, 10), globe(102, 100, 10), arrow(30, 28, 42, 42, HL, 1.8), arrow(78, 42, 90, 28, HL, 1.8), arrow(42, 78, 30, 92, C.denim, 1.8), arrow(90, 92, 78, 78, C.denim, 1.8)),
  'mark.handelspartner': all(land(26, 50, 1.1, '#f6e3a8'), land(94, 50, 1.1, '#d8eccf'), arrow(46, 40, 74, 40, HL, 2), arrow(74, 60, 46, 60, C.denim, 2), box(60, 30, 10, 8), coin(60, 70, 4), handshake(60, 96, 0.8, C.orange, C.green)),
  'mark.tull.2': all(rect(60, 64, 6, 48, RED, 1, C.ink, 1.2), line('M63 70 L10 70', RED, 4), line('M63 70 L10 70', C.white, 1.6, '6 6'), truck(30, 108, 1.0, C.denim, box(-8, -12, 14, 10)), fig(94, C.navy, 'calm', { h: 0.82 }), reach(94, 0.82, -1, 78, 50), palm(78, 48, 0.9), coin(64, 40, 6), arrow(40, 40, 56, 40, HL, 1.8)),
  'mark.handelshinder': all(land(20, 56, 0.9, '#f6e3a8'), land(100, 56, 0.9, '#d8eccf'), ...Array.from({ length: 5 }, (_, i) => rect(52, 20 + i * 16, 16, 14, '#c86a4a', 1, C.ink, 1.1)), box(40, 70, 12, 10), arrow(30, 56, 48, 56, HL, 2), cross(60, 8, 0.6), ground),
  'mark.valuta': all(note$(36, 30, 1.4, '#a8d8a8', '€'), note$(84, 44, 1.4, '#f2c4a8', '¥'), curr(28, 80, '$', C.silver), curr(60, 92, '£', C.gold), curr(92, 84, '¥', C.silver)),
  'mark.växelkurs': all(curr(26, 40, '€', C.gold, 14), curr(94, 40, '¥', C.silver, 14), arrow(44, 34, 76, 34, HL, 2), arrow(76, 48, 44, 48, HL, 2), rect(20, 70, 80, 34, C.dark, 3, C.ink, 1.4), T(60, 94, '1 = 160', 13, C.yellow)),
  'mark.globalisering': all(globe(60, 60, 30), line('M20 40 C40 4 80 4 100 40', HL, 1.6, '3 3'), line('M16 80 C40 116 80 116 104 80', HL, 1.6, '3 3'), g('translate(98 34) rotate(40)', path('M0 -8 L2 -2 L9 0 L2 2 L0 8 L-2 2 L-9 0 L-2 -2 Z', C.white, C.ink, 1)), ship(26, 84, 0.25), laptop(100, 90, 0.4)),
  'mark.containerfartyg': all(sea, ship(58, 96, 1.2), cloud(20, 20, 0.6, C.white), sun(100, 20, 7)),
  'mark.leveranskedja': all(...[[16, 28, tree(0, 12, 0.7)], [60, 28, factory(0, 0, 0.36)], [104, 28, ship(0, 6, 0.24)], [104, 84, truck(0, 8, 0.6)], [60, 84, shop(0, 0, 0.45)], [16, 84, mini(0, 0, C.green, 'smile', 0.7)]].map(([x, y, s]) => all(circle(x as number, y as number, 15, C.white, C.ink, 1.2), g(`translate(${x} ${y})`, s as Svg))), arrow(32, 28, 44, 28, HL, 1.8), arrow(76, 28, 88, 28, HL, 1.8), arrow(104, 44, 104, 68, HL, 1.8), arrow(88, 84, 76, 84, HL, 1.8), arrow(44, 84, 32, 84, HL, 1.8)),
  'mark.ursprungsland': all(box(34, 80, 50, 40), rect(18, 66, 32, 22, C.white, 2, C.ink, 1.2), land(34, 77, 0.45, '#d8eccf'), pin(36, 72, 0.4), globe(92, 40, 20), pin(96, 30, 0.8), line('M50 70 C60 60 70 54 82 48', C.grey, 1.4, '3 3')),

  // ── 1547 Ekonomisk politik ──
  'mark.ekonomisk-politik': all(govt(30, 40, 1.0), cbank(90, 44, 0.9), rect(30, 78, 60, 30, C.white, 3, C.ink, 1.4), line('M36 102 L48 94 L58 98 L70 86 L84 82', C.green, 2.4), line('M30 58 L42 78 M90 66 L78 78', HL, 1.8)),
  'mark.finanspolitik': all(govt(60, 46, 1.1), coins(16, 64, 4, 6), arrow(24, 52, 34, 46, C.green, 2), arrow(86, 46, 98, 60, HL, 2), school(104, 76, 1.0), hospital(100, 100, 0.4), ground),
  'mark.skattesänkning': all(govt(28, 40, 0.8), greyed(coins(28, 104, 6, 6)), coins(28, 104, 3, 6), arrow(48, 40, 48, 70, C.green, 2.4), fig(88, C.green, 'laugh', { h: 0.8 }), reach(88, 0.8, -1, 74, 74), coins(72, 92, 4, 5), ground),
  'mark.subvention': all(g('translate(0 0)', rect(6, 60, 64, 30, C.yellow, 4, C.ink, 1.4), rect(10, 66, 56, 12, '#9ad0f0', 2, null), circle(20, 92, 6, C.dark, null), circle(56, 92, 6, C.dark, null)), govt(94, 34, 0.7), coin(88, 70, 5), coin(98, 78, 5), arrow(90, 54, 70, 72, HL, 2), tag(36, 30, 1.1, '#f6e3a8', coin(4, 0, 4)), greyed(tag(36, 48, 0.6))),
  'mark.stimulera': all(chart(14, 20, 70, 60, [0.2, 0.25, 0.5, 0.8], C.green), govt(100, 32, 0.6), coin(98, 62, 5), coin(90, 76, 4), coin(84, 88, 4), arrow(96, 70, 78, 92, HL, 1.8), ground),
  'mark.budgetunderskott': all(govt(60, 30, 0.7), balance(60, 56, 1, coins(0, -2, 2, 5), coins(0, -2, 5, 5)), arrow(16, 60, 16, 40, C.green, 2), arrow(104, 92, 112, 106, RED, 2), minusB(100, 26, 8)),
  'mark.statsskuld': all(govt(36, 50, 1.0), ...[0, 1, 2, 3, 4].map((i) => doc(84 + (i % 2) * 6, 94 - i * 14, 0.6, '', 2)), chain(58, 60, 76, 70, 4), coin(100, 20, 6), minusB(20, 16, 7), ground),
  'mark.inflationsmål': all(target(48, 56, 34), arrow(104, 22, 52, 54, C.navy, 2.4), T(96, 104, '2%', 18, C.ink)),
  'mark.prisstabilitet': all(chart(10, 14, 100, 60, [0.5, 0.52, 0.5, 0.53, 0.51, 0.52], C.green), ptag(60, 94, 1.2), check(100, 94, 0.9), greyed(line('M18 66 L30 26 L42 62 L54 22', C.grey, 1.4))),
  'mark.deflation': all(...[0, 1, 2].map((i) => tag(24 + i * 34, 30 + i * 14, 0.9 - i * 0.2, '#c8e8b8')), arrow(90, 30, 106, 62, C.green, 2), greyed(shop(30, 92, 0.6)), mini(80, 96, C.orange, 'flat', 0.7), hourglass(104, 94, 0.8), ground),
  'mark.penningpolitik': all(cbank(36, 52, 1.2), circle(92, 60, 18, C.white, C.ink, 1.6), line('M92 60 L104 50', HL, 3), T(92, 92, '%', 14, C.ink), arrow(78, 30, 106, 30, C.grey, 1.4), ground),
  'mark.åtstramning': all(govt(30, 40, 0.8), bag$(80, 70, 2.4), line('M66 44 L94 44', RED, 3), arrow(58, 30, 70, 42, RED, 1.8), arrow(102, 30, 90, 42, RED, 1.8), greyed(coins(26, 104, 3, 5))),
};
