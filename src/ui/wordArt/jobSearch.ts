/**
 * Ekonomi & arbetsliv → Jobbsökande & anställning, 1521–1527: occupations and positions, CV and cover
 * letter, the job interview, forms of employment, the employment contract, pay and benefits, and
 * resignation and changing jobs. Recurring signs: a company (warm block with a sawtooth roof), an
 * office block, white sheets (CV, letters, contracts), gold coins (pay), a calendar, a clock, green and
 * red marks, and a grey reference where a contrast helps. No words in the pictures and no pointing
 * fingers (thumbs and open palms instead).
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, star, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm, padlock } from './people';
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
/** Bubble beside the head of the figure at x (side 1 = right of the head, −1 = left); f draws the content at the bubble centre. */
const sb = (x: number, h: number, side: 1 | -1, w: number, hh: number, f: (cx: number, cy: number) => Svg, dy = 0) => { const k = geo(x, h), cx = x + side * (k.hr + 6 + w / 2), cy = k.hy - 8 + dy; return say(cx, cy, w, hh, x + side * (k.hr + 1), k.hy, f(cx, cy)); };
/** A hard hat on the figure at x. */
const helmet = (x: number, h = 1, col: string = C.yellow) => { const k = geo(x, h), r = k.hr; return all(path(`M${f1(x - r * 1.1)} ${f1(k.hy - r * 0.25)} C${f1(x - r * 1.1)} ${f1(k.hy - r * 1.7)} ${f1(x + r * 1.1)} ${f1(k.hy - r * 1.7)} ${f1(x + r * 1.1)} ${f1(k.hy - r * 0.25)} Z`, col, C.ink, 1.2), line(`M${f1(x - r * 1.35)} ${f1(k.hy - r * 0.25)} L${f1(x + r * 1.35)} ${f1(k.hy - r * 0.25)}`, C.ink, 1.8)); };
/** A small badge on a lanyard on the chest of the figure at x. */
const lanyard = (x: number, h = 1) => { const k = geo(x, h), cy = k.sy + 14 * k.s; return all(line(`M${f1(x - 4 * k.s)} ${f1(k.sy - 3 * k.s)} L${x} ${f1(cy - 4)} L${f1(x + 4 * k.s)} ${f1(k.sy - 3 * k.s)}`, C.red, 1), rect(x - 4, cy - 4, 8, 10, C.white, 1, C.ink, 0.9), circle(x, cy - 0.5, 1.6, C.skin, null), line(`M${x - 2.4} ${cy + 3.4} L${x + 2.4} ${cy + 3.4}`, C.navy, 1)); };
/** A tie on the figure at x. */
const tie = (x: number, h = 1, col: string = RED) => { const k = geo(x, h), s = k.s; return path(`M${f1(x - 2 * s)} ${f1(k.sy - 2 * s)} L${f1(x + 2 * s)} ${f1(k.sy - 2 * s)} L${f1(x + 3 * s)} ${f1(k.sy + 18 * s)} L${x} ${f1(k.sy + 22 * s)} L${f1(x - 3 * s)} ${f1(k.sy + 18 * s)} Z`, col, C.ink, 0.9); };

// ── Marks ────────────────────────────────────────────────────────────
const q = (x: number, y: number, sz = 13, col: string = C.navy) => T(x, y + sz * 0.36, '?', sz, col);
const ex = (x: number, y: number, sz = 13, col: string = HL) => T(x, y + sz * 0.36, '!', sz, col);
const num = (x: number, y: number, s: string, sz = 10, col: string = C.ink) => T(x, y + sz * 0.36, s, sz, col);
const cross = (x: number, y: number, s = 1, col: string = RED) => line(`M${x - 5 * s} ${y - 5 * s} L${x + 5 * s} ${y + 5 * s} M${x + 5 * s} ${y - 5 * s} L${x - 5 * s} ${y + 5 * s}`, col, 2.4 * s);
const check = (x: number, y: number, s = 1, col: string = C.green) => checkIcon(x, y, s, col);
const okB = (x: number, y: number, r = 8) => all(circle(x, y, r, C.green, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, r * 0.22));
const noB = (x: number, y: number, r = 8) => all(circle(x, y, r, RED, C.ink, 1.2), line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, C.white, r * 0.22));
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const plusB = (x: number, y: number, r = 8, col: string = C.green) => all(circle(x, y, r, col, C.ink, 1.2), line(`M${f1(x - r * 0.5)} ${y} L${f1(x + r * 0.5)} ${y} M${x} ${f1(y - r * 0.5)} L${x} ${f1(y + r * 0.5)}`, C.white, r * 0.26));
const minusB = (x: number, y: number, r = 8, col: string = RED) => all(circle(x, y, r, col, C.ink, 1.2), line(`M${f1(x - r * 0.5)} ${y} L${f1(x + r * 0.5)} ${y}`, C.white, r * 0.26));
const palm = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ...[-4.6, -1.6, 1.4, 4.4].map((d, i) => rect(d - 1.3, -9 + Math.abs(i - 1.5) * 1.2, 2.6, 9, C.skin, 1.3, C.ink, 0.9)), path('M-5.5 -1 L5.5 -1 L5 5 C4 8 -4 8 -5 5 Z', C.skin, C.ink, 1), path('M-5.4 1 L-9 -3 C-10 -4 -11 -2 -10 -1 L-5 5', C.skin, C.ink, 1));
/** Thumb up (down = true: thumb down). */
const thumb = (x: number, y: number, s = 1, down = false) => g(`translate(${x} ${y}) scale(${s} ${down ? -s : s})`, rect(-4.4, -11, 4.4, 10, C.skin, 2.2, C.ink, 1.1), rect(-5, -3, 11, 10, C.skin, 3, C.ink, 1.1), line('M-0.6 0.4 L5.4 0.4 M-0.6 3.4 L5.4 3.4', C.ink, 0.8), rect(-8, -2.4, 3.2, 9, C.navy, 1, C.ink, 0.9));
/** Arrow made of a curved path. */
const curveArrow = (d: string, ex2: number, ey: number, ang: number, col: string = HL, w = 2) => all(line(d, col, w), g(`translate(${ex2} ${ey}) rotate(${ang})`, path('M0 0 L-6 -3.4 L-6 3.4 Z', col, null)));
const warn = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -11 L11 8 L-11 8 Z', C.yellow, C.ink, 1.4), T(0, 6, '!', 12, C.ink));

// ── Things ───────────────────────────────────────────────────────────
const lines = (x: number, y: number, w: number, n = 3, col: string = C.grey) => all(...Array.from({ length: n }, (_, i) => line(`M${x - w / 2} ${y + i * 4.4} L${x + w / 2 - (i === n - 1 ? w * 0.35 : 0)} ${y + i * 4.4}`, col, 1.6)));
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
/** A week (five working days) as a row of boxes; on = number of highlighted days. */
const week = (x: number, y: number, on: number, col: string = C.green) => all(...Array.from({ length: 5 }, (_, i) => rect(x + i * 13, y, 11, 11, i < on ? col : C.white, 2, C.ink, 1.2)));
const hourglass = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M-8 -12 L8 -12 M-8 12 L8 12', C.brown, 2.4), path('M-6 -11 L6 -11 L1 0 L6 11 L-6 11 L-1 0 Z', 'rgba(220,240,252,0.7)', C.ink, 1.2), path('M-5 10 L5 10 L0 3 Z', C.tan, null));
/** Clock face; hh in hours (0–12), mm in minutes. */
const clock = (x: number, y: number, r: number, hh = 3, mm = 0, face: string = C.white) => { const ha = ((hh % 12) + mm / 60) / 12 * Math.PI * 2, ma = mm / 60 * Math.PI * 2; return all(circle(x, y, r, face, C.ink, 1.8), ...Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return line(`M${f1(x + Math.sin(a) * r * 0.82)} ${f1(y - Math.cos(a) * r * 0.82)} L${f1(x + Math.sin(a) * r * 0.92)} ${f1(y - Math.cos(a) * r * 0.92)}`, C.ink, 1); }), line(`M${x} ${y} L${f1(x + Math.sin(ha) * r * 0.5)} ${f1(y - Math.cos(ha) * r * 0.5)}`, C.ink, 2.2), line(`M${x} ${y} L${f1(x + Math.sin(ma) * r * 0.75)} ${f1(y - Math.cos(ma) * r * 0.75)}`, C.ink, 1.6), circle(x, y, 1.6, C.ink, null)); };
/** Pie (filled sector from 12 o'clock clockwise), frac 0–1. */
const pie = (x: number, y: number, r: number, frac: number, col: string = C.green) => { if (frac >= 1) return circle(x, y, r, col, C.ink, 1.8); const a = frac * Math.PI * 2, ex2 = x + Math.sin(a) * r, ey = y - Math.cos(a) * r; return all(circle(x, y, r, C.white, C.ink, 1.8), path(`M${x} ${y} L${x} ${y - r} A${r} ${r} 0 ${frac > 0.5 ? 1 : 0} 1 ${f1(ex2)} ${f1(ey)} Z`, col, C.ink, 1.4)); };
const coins = (x: number, y: number, n = 3, r = 5) => all(...Array.from({ length: n }, (_, i) => ellipse(x, y - i * 3, r, r * 0.45, C.gold, C.ink, 1.1)));
const envelope = (x: number, y: number, s = 1, open = false, inside: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, open ? all(path('M-14 -9 L0 -20 L14 -9', C.white, C.ink, 1.5), inside) : '', rect(-14, -9, 28, 18, C.white, 2, C.ink, 1.5), open ? path('M-14 -9 L0 1 L14 -9', 'none', C.ink, 1) : path('M-14 -9 L0 2 L14 -9', 'none', C.ink, 1.3));
const handshake = (x: number, y: number, s = 1, c1: string = C.navy, c2: string = C.navy) => g(`translate(${x} ${y}) scale(${s})`, rect(-22, -4, 12, 9, c1, 2, C.ink, 1.2), rect(10, -4, 12, 9, c2, 2, C.ink, 1.2), path('M-10 -4 C-4 -8 4 -8 10 -4 L10 5 C4 8 -4 8 -10 5 Z', C.skin, C.ink, 1.2), line('M-4 -5 L-2 5 M0 -6 L2 5 M4 -5 L5 4', C.ink, 0.8));
const mag = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 8, 'rgba(220,240,252,0.7)', C.ink, 2), line('M5.6 5.6 L12 12', C.ink, 3));
const table = (y: number, x1: number, x2: number) => all(rect(x1, y, x2 - x1, 6, C.tan, 2, C.ink, 1.8), line(`M${x1 + 8} ${y + 6} L${x1 + 8} 112 M${x2 - 8} ${y + 6} L${x2 - 8} 112`, C.brown, 3));
const laptop = (x: number, y: number, s = 1, screen: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-16, -22, 32, 21, C.dark, 2, C.ink, 1.4), rect(-13.5, -19.5, 27, 16, '#bfe3f5', 1, null), screen, path('M-20 -1 L20 -1 L22 2 L-22 2 Z', C.grey, C.ink, 1.2));
const phone = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-4, -7, 8, 14, C.dark, 2, C.ink, 1), rect(-3, -5, 6, 9, '#bfe3f5', 0.5, null));
const briefcase = (x: number, y: number, s = 1, col: string = C.brown) => g(`translate(${x} ${y}) scale(${s})`, path('M-4 -7 L-4 -10 L4 -10 L4 -7', 'none', C.ink, 1.6), rect(-10, -7, 20, 14, col, 2, C.ink, 1.4), line('M-10 -1 L10 -1', C.ink, 0.9));
const calcu = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-8, -11, 16, 22, C.dark, 2, C.ink, 1.2), rect(-6, -9, 12, 5, '#cfe9c8', 1, null), ...Array.from({ length: 9 }, (_, i) => rect(-6 + (i % 3) * 4.4, -2 + Math.floor(i / 3) * 4.2, 3.2, 3, i === 8 ? C.orange : C.grey2, 0.6, null)));
const barChart = (x: number, y: number, s = 1, hs: number[] = [6, 10, 8, 14], col: string = C.green) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -18, 28, 26, C.white, 2, C.ink, 1.4), ...hs.map((h, i) => rect(-10 + i * 6, 5 - h, 4, h, col, 0.5, null)), line('M-11 5 L11 5', C.ink, 1));
const wrench = (x: number, y: number, s = 1, rot = 40) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-1.8, -2, 3.6, 16, C.silver, 1, C.ink, 1), path('M-5 -2 L-5 -8 L-2 -10 L-2 -5 L2 -5 L2 -10 L5 -8 L5 -2 Z', C.silver, C.ink, 1));
const mopTool = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 -40 L0 0', C.brown, 2.4), path('M-8 0 L8 0 L10 6 L-10 6 Z', C.white, C.ink, 1.2), line('M-7 6 L-8 9 M-3 6 L-3 9 M2 6 L2 9 M7 6 L8 9', C.grey, 1.2));
const bucket = (x: number, y: number, s = 1, col: string = C.denim) => g(`translate(${x} ${y}) scale(${s})`, path('M-9 -8 L9 -8 L7 8 L-7 8 Z', col, C.ink, 1.4), path('M-8 -8 C-8 -16 8 -16 8 -8', 'none', C.ink, 1.2), ellipse(0, -8, 9, 2, '#bfe3f5', C.ink, 1));
const box = (x: number, y: number, w = 20, h = 14) => all(rect(x - w / 2, y - h / 2, w, h, C.tan, 1, C.ink, 1.4), line(`M${x - w / 2} ${y - h / 2 + 4} L${x + w / 2} ${y - h / 2 + 4} M${x} ${y - h / 2} L${x} ${y - h / 2 + 4}`, '#a0673d', 1));
const shelf = (x: number, y: number, w: number, h: number) => all(line(`M${x} ${y} L${x} ${y + h} M${x + w} ${y} L${x + w} ${y + h}`, C.grey, 3), ...[0, 1, 2].map((r) => line(`M${x} ${y + 8 + r * (h - 8) / 2.6} L${x + w} ${y + 8 + r * (h - 8) / 2.6}`, C.grey, 2.4)), ...[0, 1].map((r) => all(box(x + w * 0.3, y + 1 + r * (h - 8) / 2.6, 12, 12), box(x + w * 0.7, y + 1 + r * (h - 8) / 2.6, 12, 12))));
const diploma = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -10, 28, 20, '#f6ecd0', 2, C.ink, 1.4), line('M-9 -4 L9 -4 M-9 0 L6 0', C.grey, 1.4), circle(7, 5, 4, RED, C.ink, 1), path('M5 8 L4 14 L7 12 L10 14 L9 8', RED, C.ink, 0.8));
const medal = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-4 -12 L-1 -2 L1 -2 L4 -12 Z', C.denim, C.ink, 1), circle(0, 3, 6, C.gold, C.ink, 1.2), star(0, 3, 3, C.white));
const gift = (x: number, y: number, s = 1, col: string = C.red) => g(`translate(${x} ${y}) scale(${s})`, rect(-12, -8, 24, 18, col, 2, C.ink, 1.4), rect(-14, -13, 28, 6, col, 2, C.ink, 1.4), rect(-2, -13, 4, 23, C.gold, 0, null), path('M0 -13 C-8 -22 -12 -14 0 -13 C12 -14 8 -22 0 -13', 'none', C.gold, 2));
const dumbbell = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M-10 0 L10 0', C.grey, 3), rect(-15, -6, 5, 12, C.dark, 1, C.ink, 1), rect(10, -6, 5, 12, C.dark, 1, C.ink, 1));
const cup = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-6 -6 L6 -6 L5 6 C5 8 -5 8 -5 6 Z', C.white, C.ink, 1.3), path('M6 -3 C10 -3 10 3 5 3', 'none', C.ink, 1.2), path('M-2 -9 C-3 -12 0 -13 -1 -16 M2 -9 C1 -12 4 -13 3 -16', 'none', C.grey, 1));
const moon = (x: number, y: number, r = 8) => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${x + r * 0.9} ${y + r * 0.45} A${r * 0.8} ${r * 0.8} 0 1 1 ${x} ${y - r} Z`, C.yellow, C.ink, 1.2);
const pin = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 14 C-4 6 -10 0 -10 -6 C-10 -12 -5 -16 0 -16 C5 -16 10 -12 10 -6 C10 0 4 6 0 14 Z', RED, C.ink, 1.4), circle(0, -6, 4, C.white, C.ink, 1));
const door = (x: number, y: number, h = 50, open = false) => all(rect(x - 12, y - h, 24, h, '#e6d3b3', 1, C.ink, 1.6), open ? path(`M${x - 10} ${y - h + 2} L${x + 2} ${y - h + 6} L${x + 2} ${y - 2} L${x - 10} ${y} Z`, C.brown, C.ink, 1.3) : all(rect(x - 10, y - h + 2, 20, h - 2, C.brown, 1, C.ink, 1.3), circle(x + 6, y - h / 2, 1.6, C.gold, null)));
const bag = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-4 -14 L4 -14 L2 -10 C12 -6 14 12 0 12 C-14 12 -12 -6 -2 -10 Z', C.tan, C.ink, 1.4), line('M-4 -10 L4 -10', C.brown, 1.6), circle(0, 2, 4.4, C.gold, C.ink, 1));
const flowers = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L-4 -12 M0 0 L0 -14 M0 0 L4 -12', '#3f8a55', 1.6), circle(-4, -13, 3, C.pink, C.ink, 0.8), circle(0, -15, 3, C.yellow, C.ink, 0.8), circle(4, -13, 3, C.red, C.ink, 0.8), path('M-4 -2 L4 -2 L2 6 L-2 6 Z', C.white, C.ink, 1));
const cake = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-10, -6, 20, 10, '#f6c0d0', 2, C.ink, 1.2), rect(-10, -9, 20, 4, C.white, 2, C.ink, 1), line('M0 -9 L0 -14', C.ink, 1), path('M0 -14 C-2 -16 0 -18 0 -19 C1 -17 2 -16 0 -14 Z', C.orange, null));
const car = (x: number, y: number, s = 1, col: string = C.denim) => g(`translate(${x} ${y}) scale(${s})`, path('M-18 2 L-18 -6 L-10 -8 L-5 -15 L8 -15 L13 -8 L18 -6 L18 2 Z', col, C.ink, 1.4), rect(-3, -13, 9, 5, '#bfe3f5', 1, null), circle(-10, 3, 4, C.dark, C.ink, 1), circle(10, 3, 4, C.dark, C.ink, 1));
const school = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-10 -2 L0 -10 L10 -2 Z', RED, C.ink, 1.1), rect(-8, -2, 16, 11, C.yellow, 1, C.ink, 1.1), rect(-2, 3, 4, 6, C.brown, 0.5, null), circle(0, -4.5, 1.6, C.white, C.ink, 0.6));
const signpost = (x: number, y: number, s = 1, col: string = C.green) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L0 -34', C.brown, 3), path('M-2 -32 L16 -32 L22 -27 L16 -22 L-2 -22 Z', col, C.ink, 1.3), path('M2 -18 L-16 -18 L-22 -13 L-16 -8 L2 -8 Z', C.sky, C.ink, 1.3));
const infinity = (x: number, y: number, s = 1, col: string = C.gold) => g(`translate(${x} ${y}) scale(${s})`, path('M0 0 C-6 -10 -18 -10 -18 0 C-18 10 -6 10 0 0 C6 -10 18 -10 18 0 C18 10 6 10 0 0 Z', 'none', col, 4));
const bed = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-16, 0, 32, 6, C.brown, 1, C.ink, 1.2), rect(-16, -4, 32, 5, C.white, 1, C.ink, 1), circle(-11, -6, 4, C.skin, C.ink, 1), path('M-6 -6 L16 -6 L16 -1 L-6 -1 Z', C.sky, C.ink, 1));
const pram = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-10 -10 L8 -10 C8 0 4 4 -6 4 C-10 4 -12 0 -10 -10 Z', C.navy, C.ink, 1.3), path('M-10 -10 C-10 -18 2 -18 2 -10', '#5a6fb0', C.ink, 1.2), line('M8 -10 L14 -16', C.ink, 1.6), circle(-6, 8, 3, C.dark, null), circle(4, 8, 3, C.dark, null));
const board = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x, y, w, h, '#2f5a46', 2, C.brown, 3), inner);
/** A blueprint with a small bridge drawn in white. */
const blueprint = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-18, -14, 36, 28, '#2f6db5', 1.5, C.ink, 1.4), path('M-13 6 L13 6 M-13 6 C-6 -6 6 -6 13 6 M-6 6 L-6 1 M0 6 L0 -1 M6 6 L6 1', 'none', C.white, 1.2), line('M-14 -10 L-6 -10', C.white, 0.8));

// ── Buildings ────────────────────────────────────────────────────────
/** A company: a warm-coloured block with a sawtooth roof. */
const company = (x: number, y: number, s = 1, col: string = '#e9c27a') => g(`translate(${x} ${y}) scale(${s})`, path('M-22 -14 L-22 -26 L-11 -18 L-11 -26 L0 -18 L0 -26 L11 -18 L22 -18 L22 22 L-22 22 Z', col, C.ink, 1.4), ...[-14, -4, 6, 16].map((cx) => rect(cx - 3, -8, 6, 7, '#9ad0f0', 0.5, C.ink, 0.6)), rect(-5, 9, 10, 13, C.brown, 0.5, C.ink, 1), rect(12, 4, 6, 6, '#9ad0f0', 0.5, C.ink, 0.6));
/** Office building with rows of windows (no flag). */
const office = (x: number, y: number, s = 1, col: string = '#cfd8e2') => g(`translate(${x} ${y}) scale(${s})`, rect(-22, -30, 44, 52, col, 1.5, C.ink, 1.4), ...Array.from({ length: 12 }, (_, i) => rect(-17 + (i % 4) * 9.4, -25 + Math.floor(i / 4) * 11, 6, 7, '#9ad0f0', 0.5, C.ink, 0.6)), rect(-5, 9, 10, 13, C.brown, 0.5, C.ink, 1));
/** A factory with a chimney. */
const factory = (x: number, y: number, s = 1, col: string = '#d9c6a8') => g(`translate(${x} ${y}) scale(${s})`, rect(14, -36, 7, 20, C.grey, 0.5, C.ink, 1.2), path('M-24 20 L-24 -10 L-12 -18 L-12 -10 L0 -18 L0 -10 L12 -18 L12 -16 L24 -16 L24 20 Z', col, C.ink, 1.4), ...[-16, -4, 8].map((cx) => rect(cx - 3, -4, 6, 6, '#9ad0f0', 0.5, C.ink, 0.6)), rect(10, 6, 9, 14, C.brown, 0.5, C.ink, 1));
const hospital = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-18, -20, 36, 40, C.white, 1.5, C.ink, 1.4), rect(-3, -16, 6, 14, RED, 0, null), rect(-7, -12, 14, 6, RED, 0, null), rect(-5, 8, 10, 12, '#9ad0f0', 0.5, C.ink, 0.8));
const shop = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-18, -12, 36, 32, '#f3e2c4', 1, C.ink, 1.4), path('M-20 -12 L20 -12 L18 -20 L-18 -20 Z', C.green, C.ink, 1.2), ...[-14, -6, 2, 10].map((cx) => rect(cx, -12, 4, 5, C.white, 0, null)), rect(-14, -2, 14, 12, '#9ad0f0', 0.5, C.ink, 0.8), rect(4, 2, 8, 18, C.brown, 0.5, C.ink, 1));
/** An org-chart box with a small person. */
const orgBox = (x: number, y: number, col: string, hi = false) => all(rect(x - 14, y - 11, 28, 22, hi ? '#f6e3a8' : C.white, 3, hi ? HL : C.ink, hi ? 2.4 : 1.4), mini(x, y - 1, col, 'smile', 0.62));

export const JOB_SEARCH_MOTIFS: Record<string, Svg> = {
  // ── 1521 Yrken och befattningar ──
  'jobb.anställd': all(company(30, 72, 0.95), curveArrow('M50 42 C60 32 70 32 76 38', 76, 38, 40, HL, 2.2), fig(88, C.green, 'smile', { h: 0.9 }), lanyard(88, 0.9), coins(108, 106, 3, 5), ground),
  'jobb.arbetare': all(greyed(factory(30, 66, 0.9)), fig(70, C.orange, 'smile', { h: 0.95, bottom: C.denim }), helmet(70, 0.95, C.yellow), reach(70, 0.95, 1, 94, 70), wrench(98, 60, 1.1, 30), ground),
  'jobb.ingenjör': all(fig(30, C.sky, 'calm', { h: 0.9 }), helmet(30, 0.9, C.white), reach(30, 0.9, 1, 60, 64), blueprint(80, 62, 1.25), ground),
  'jobb.ekonom': all(fig(32, C.navy, 'calm', { h: 0.9 }), tie(32, 0.9), table(84, 8, 112), reach(32, 0.9, 1, 54, 78), calcu(62, 74, 0.9), barChart(94, 66, 1.1, [6, 10, 8, 15]), coins(80, 82, 2, 4)),
  'jobb.programmerare': all(fig(30, C.purple, 'calm', { h: 0.9 }), table(84, 8, 112), reach(30, 0.9, 1, 64, 80), laptop(80, 83, 1.3, all(line('M-7 -15 L-10 -11.5 L-7 -8 M7 -15 L10 -11.5 L7 -8 M2 -15.5 L-2 -7.5', C.navy, 1.4), line('M-9 -5.5 L4 -5.5', C.green, 1.2))), ground),
  'jobb.lokalvårdare': all(greyed(table(74, 70, 112)), fig(40, '#3aa6a0', 'smile', { h: 0.9 }), reach(40, 0.9, 1, 62, 70), mopTool(66, 104, 1.1), bucket(96, 103, 1.1), star(80, 104, 2.4, C.sky), star(56, 100, 2, C.sky), ground),
  'jobb.lagerarbetare': all(shelf(70, 22, 44, 90), fig(36, '#c8e04a', 'smile', { h: 0.9, bottom: C.navy }), reach(36, 0.9, -1, 26, 66), reach(36, 0.9, 1, 46, 66), box(36, 62, 26, 18), ground),
  'jobb.befattning': all(line('M60 30 L60 40 M34 40 L86 40 M34 40 L34 46 M86 40 L86 46 M86 68 L86 76 M20 76 L100 76 M20 76 L20 82 M60 76 L60 82 M100 76 L100 82', C.grey, 1.6), greyed(orgBox(60, 20, C.navy), orgBox(34, 56, C.purple), orgBox(20, 94, C.sky), orgBox(60, 94, C.sky), orgBox(100, 94, C.sky)), orgBox(86, 56, C.green, true)),
  'jobb.yrkestitel': all(line('M30 4 L42 30 M90 4 L78 30', C.red, 2.4), rect(16, 30, 88, 60, C.white, 4, C.ink, 1.8), rect(16, 30, 88, 12, C.navy, 4, null), rect(24, 50, 28, 32, '#e8eef4', 2, C.ink, 1), mini(38, 66, C.green, 'smile', 1.0), rect(58, 54, 40, 10, 'rgba(228,87,46,0.35)', 2, null), line('M61 59 L95 59', C.ink, 3), line('M60 74 L86 74', C.grey2, 2), ring(78, 59, 22, HL)),
  'jobb.arbetsledare': all(fig(28, C.orange, 'calm', { h: 0.95 }), helmet(28, 0.95, C.white), reach(28, 0.95, 1, 50, 60), rect(48, 50, 14, 18, C.brown, 1.5, C.ink, 1.2), rect(50, 53, 10, 13, C.white, 0.5, null), check(55, 57, 0.4), check(55, 63, 0.4), sb(28, 0.95, 1, 22, 16, (cx, cy) => ex(cx, cy, 12), -6), fig(80, C.denim, 'smile', { h: 0.68 }), helmet(80, 0.68), fig(104, C.denim, 'smile', { h: 0.68 }), helmet(104, 0.68), rect(70, 72, 46, 5, C.tan, 1, C.ink, 1.2), ground),
  'jobb.mellanchef': all(line('M60 26 L60 42 M60 70 L60 78 M28 78 L92 78 M28 78 L28 84 M60 78 L60 84 M92 78 L92 84', C.grey, 1.8), greyed(rect(44, 4, 32, 24, C.gold, 3, C.ink, 1.4), mini(60, 16, C.navy, 'smile', 0.7)), rect(40, 42, 40, 28, '#f6e3a8', 3, HL, 2.4), mini(60, 56, C.green, 'flat', 0.8), arrow(86, 52, 86, 36, C.grey, 1.8), arrow(34, 60, 34, 76, C.grey, 1.8), greyed(...[28, 60, 92].map((x) => all(rect(x - 14, 84, 28, 24, C.white, 3, C.ink, 1.2), mini(x, 96, C.sky, 'smile', 0.6))))),
  'jobb.yrkesutbildning': all(school(20, 22, 1.5), table(84, 34, 112), rect(46, 78, 34, 6, '#e8c48a', 1, C.ink, 1.2), path('M84 78 L100 78 L100 82 L84 82 Z', C.silver, C.ink, 1), line('M70 76 L76 84 M73 76 L79 84', C.ink, 0.8), fig(60, C.green, 'calm', { h: 0.72 }), helmet(60, 0.72, C.yellow), reach(60, 0.72, 1, 74, 76), fig(100, C.navy, 'smile', { h: 0.92 }), reach(100, 0.92, -1, 82, 58), palm(80, 56, 0.9), ground),
  'jobb.kvalificerad': all(fig(34, C.green, 'smile', { h: 0.9 }), reach(34, 0.9, 1, 56, 62), diploma(66, 60, 1.1), okB(34, 12, 8), star(52, 14, 4, C.gold), greyed(fig(98, C.grey, 'calm', { h: 0.82 })), q(98, 26, 14, C.grey), ground),
  'jobb.yrkesverksam': all(greyed(fig(16, C.yellow, 'smile', { h: 0.5 })), fig(60, C.navy, 'smile', { h: 0.92 }), reach(60, 0.92, 1, 78, 84), briefcase(80, 92, 1.0), lanyard(60, 0.92), greyed(fig(102, C.purple, 'smile', { h: 0.82, hair: C.grey2 }), line('M114 76 L116 112', C.brown, 2)), ring(60, 66, 34, HL), ground),

  // ── 1522 CV och personligt brev ──
  'jobb.platsannons': all(rect(8, 10, 70, 92, C.white, 3, C.ink, 1.8), rect(8, 10, 70, 12, C.navy, 3, null), rect(16, 30, 54, 40, '#fff6dd', 3, HL, 2, ), mini(32, 52, C.grey, 'flat', 1), q(32, 36, 12, C.navy), briefcase(56, 50, 0.9), lines(43, 62, 40, 1, C.ink), lines(43, 80, 50, 4, C.grey2), fig(100, C.orange, 'calm', { h: 0.72 }), reach(100, 0.72, -1, 82, 62), mag(76, 56, 1.0), ground),
  'jobb.söka-jobb': all(fig(22, C.green, 'calm', { h: 0.82 }), reach(22, 0.82, 1, 40, 70), cv(46, 70, 0.6), arrow(58, 60, 76, 30, HL, 2), arrow(58, 68, 76, 68, HL, 2), envelope(68, 46, 0.4), envelope(68, 68, 0.4), company(98, 32, 0.5), office(98, 92, 0.42), ground),
  'jobb.CV': all(cv(52, 60, 2.6), pen(100, 82, 1.2, 30)),
  'jobb.personligt-brev': all(greyed(cv(30, 52, 1.3)), g('translate(66 62) rotate(4)', rect(-24, -32, 48, 64, C.white, 2, C.ink, 1.8), mini(-12, -18, C.green, 'smile', 0.7), lines(4, -22, 20, 2, C.grey), lines(0, -2, 38, 5, C.grey), path('M2 24 C6 18 8 26 12 21 C14 18 16 24 20 22', 'none', C.navy, 1.4)), envelope(30, 96, 0.8)),
  'jobb.sista-ansökningsdag': all(cal(40, 50, 2.4, [8], RED), ring(59, 72, 9, RED), hourglass(96, 34, 1.4), envelope(94, 84, 0.9), arrow(80, 84, 66, 76, HL, 2)),
  'jobb.kompetens': all(fig(60, C.purple, 'smile', { h: 0.82 }), ...[[22, 22], [60, 12], [98, 22]].map(([x, y]) => circle(x!, y!, 13, C.white, C.green, 2)), g('translate(22 22)', path('M0 -5 C-3 -7 -7 -7 -9 -6 L-9 6 C-7 5 -3 5 0 7 C3 5 7 5 9 6 L9 -6 C7 -7 3 -7 0 -5 Z', C.white, C.ink, 1.2), line('M0 -5 L0 7', C.ink, 1)), wrench(60, 10, 0.7, 40), laptop(98, 30, 0.45), line('M34 30 L48 44 M60 25 L60 32 M86 30 L72 44', C.green, 1.6, '2 2'), ground),
  'jobb.merit': all(cv(52, 60, 2.4), medal(86, 34, 1.4), star(44, 26, 4, C.gold), star(44, 50, 4, C.gold), star(44, 74, 4, C.gold)),
  'jobb.meriterande': all(greyed(fig(30, C.grey, 'smile', { h: 0.8 }), okB(30, 26, 7)), fig(88, C.green, 'smile', { h: 0.8 }), okB(80, 26, 7), plusB(98, 24, 8, C.gold), arrow(110, 56, 110, 34, C.green, 2.4), ground),
  'jobb.språkkunskap': all(fig(28, C.orange, 'smile', { h: 0.88 }), say(82, 22, 30, 20, 40, 34, T(82, 28, 'Å', 14, C.navy)), say(88, 52, 30, 20, 42, 40, T(88, 58, 'あ', 14, RED)), say(82, 82, 30, 20, 40, 46, T(82, 88, 'A', 14, C.green)), ground),
  'jobb.referens': all(greyed(office(20, 74, 0.7), mini(20, 60, C.grey, 'flat', 0.6)), path('M34 40 C50 10 70 10 74 28', 'none', C.grey, 1.6, ), fig(90, C.navy, 'smile', { h: 0.9 }), tie(90, 0.9), reach(90, 0.9, -1, 82, 34), phone(80, 32, 1), ring(90, 66, 30, HL), reach(90, 0.9, 1, 108, 58), thumb(110, 54, 0.9), ground),
  'jobb.samarbetsförmåga': all(rect(8, 52, 104, 7, C.tan, 1.5, C.ink, 1.4), ...[22, 60, 98].map((x, i) => all(fig(x, [C.orange, C.green, C.purple][i]!, 'smile', { h: 0.8 }), reach(x, 0.8, -1, x - 8, 60), reach(x, 0.8, 1, x + 8, 60))), okB(60, 16, 9), ground),
  'jobb.driven': all(path('M8 112 L8 96 L36 96 L36 80 L64 80 L64 64 L92 64 L92 48 L116 48 L116 112 Z', C.grey2, C.ink, 1.4), g('translate(0 -48)', fig(78, C.orange, 'laugh', { h: 0.8 })), line('M58 26 L66 26 M56 34 L64 34 M58 42 L66 42', C.grey, 1.6), line('M106 48 L106 14', C.ink, 1.6), path('M106 14 L118 18 L106 22 Z', RED, C.ink, 1), greyed(g('translate(0 -16)', fig(18, C.grey, 'sleepy', { h: 0.55 })))),

  // ── 1523 Arbetsintervju ──
  'jobb.intervju': all(fig(30, C.navy, 'calm', { h: 0.88 }), fig(90, C.green, 'smile', { h: 0.88 }), table(86, 10, 110), cv(48, 80, 0.4), sb(30, 0.88, 1, 22, 18, (cx, cy) => q(cx, cy, 13))),
  'jobb.kalla-till': all(office(22, 82, 0.62), curveArrow('M38 48 C46 30 54 26 58 26', 58, 26, 0, HL, 2), envelope(70, 34, 1.0, true, cal(0, -12, 0.5, [4], HL)), fig(94, C.green, 'smile', { h: 0.72 }), reach(94, 0.72, -1, 80, 46), ground),
  'jobb.rekrytering': all(...[14, 33, 52, 71, 90, 108].map((x, i) => mini(x, 18, i === 3 ? C.green : C.grey, 'flat', 0.6)), path('M6 32 L114 32 L72 70 L72 84 L48 84 L48 70 Z', 'rgba(140,199,232,0.35)', C.ink, 1.6), mini(60, 100, C.green, 'smile', 0.8), okB(82, 98, 7)),
  'jobb.rekryterare': all(fig(28, C.navy, 'calm', { h: 0.9 }), reach(28, 0.9, 1, 54, 62), mag(60, 60, 1.3), ...[0, 1, 2].map((i) => cv(90 - i * 4, 82 - i * 12, 0.75)), ground),
  'jobb.förbereda-sig': all(fig(30, C.green, 'calm', { h: 0.88 }), reach(30, 0.88, 1, 52, 60), doc(58, 60, 0.75, q(0, 12, 9, C.navy), 3), clock(96, 22, 12, 8, 0), doc(96, 74, 0.9, all(check(-6, -8, 0.45), check(-6, -2, 0.45), check(-6, 4, 0.45)), 0), line('M-2 -9 L9 -9', C.grey2, 1.6), ground),
  'jobb.intervjua': all(fig(34, C.navy, 'calm', { h: 0.95 }), tie(34, 0.95), reach(34, 0.95, 1, 52, 70), rect(50, 60, 12, 16, C.white, 1, C.ink, 1.2), pen(60, 66, 0.6, 30), sb(34, 0.95, 1, 28, 20, (cx, cy) => all(q(cx - 5, cy, 13), q(cx + 6, cy, 13))), ring(34, 62, 32, HL), fig(96, C.green, 'smile', { h: 0.7 }), ground),
  'jobb.referenstagning': all(fig(24, C.navy, 'calm', { h: 0.85 }), reach(24, 0.85, 1, 34, 40), phone(36, 38, 1), cv(54, 88, 0.6, all(check(9, -16, 0.4), check(9, -6, 0.4))), path('M42 30 C60 6 82 10 88 28', 'none', HL, 1.8, ), mini(96, 46, C.purple, 'smile', 0.9), phone(106, 42, 0.8), thumb(100, 74, 0.9), ground),
  'jobb.anställa': all(greyed(company(60, 30, 0.6)), fig(24, C.navy, 'smile', { h: 0.88 }), fig(96, C.green, 'laugh', { h: 0.88 }), reach(24, 0.88, 1, 56, 70), reach(96, 0.88, -1, 64, 70), handshake(60, 70, 0.5, C.navy, C.green), contract(60, 94, 0.6), ground),
  'jobb.styrka.2': all(fig(30, C.green, 'laugh', { h: 0.9 }), reach(30, 0.9, 1, 50, 52), thumb(52, 48, 1), rect(66, 20, 46, 82, C.white, 4, C.ink, 1.6), plusB(80, 36, 9), rect(92, 30, 16, 12, C.green, 2, null), greyed(minusB(80, 82, 8), rect(92, 78, 8, 8, RED, 2, null)), ring(90, 36, 18, HL)),
  'jobb.svaghet.2': all(fig(30, C.orange, 'calm', { h: 0.9 }), rect(66, 20, 46, 82, C.white, 4, C.ink, 1.6), greyed(plusB(80, 36, 8), rect(92, 32, 14, 8, C.green, 2, null)), minusB(80, 82, 9), rect(92, 76, 16, 12, RED, 2, null), ring(90, 82, 18, HL), sb(30, 0.9, 1, 22, 16, (cx, cy) => minusB(cx, cy, 5), -4), ground),

  // ── 1524 Anställningsformer ──
  'jobb.anställningsform': all(mini(60, 20, C.green, 'flat', 0.9), q(78, 12, 13), ...[[22, infinity(0, 0, 0.36, C.green)], [60, hourglass(0, 0, 0.5)], [98, clock(0, 0, 7, 2, 0)]].map(([x, m]) => all(rect((x as number) - 16, 50, 32, 50, C.white, 3, C.ink, 1.6), lines(x as number, 84, 20, 3), g(`translate(${x} 66)`, m as Svg))), line('M60 34 L22 48 M60 34 L60 48 M60 34 L98 48', C.grey, 1.4, '2 2')),
  'jobb.fast-anställning': all(contract(34, 60, 1.6), infinity(34, 46, 0.5, C.green), company(92, 88, 0.6), fig(92, C.green, 'smile', { h: 0.46 }), padlock(92, 26, 1.0, false, C.gold), okB(110, 50, 7), ground),
  'jobb.tidsbegränsad': all(contract(30, 58, 1.4), arrow(52, 58, 66, 58, HL, 2.2), cal(90, 40, 1.4, [8], RED), cross(101, 49, 0.7, C.white), hourglass(90, 90, 1.2), greyed(infinity(30, 102, 0.3, C.grey))),
  'jobb.vikariat': all(greyed(fig(20, C.purple, 'smile', { h: 0.8 }), pram(42, 100, 1)), table(84, 54, 112), fig(84, C.green, 'smile', { h: 0.88 }), contract(108, 50, 0.5, true, hourglass(0, 0, 0.5)), curveArrow('M30 26 C44 12 58 12 70 18', 70, 18, 20, HL, 2)),
  'jobb.vikarie': all(board(46, 10, 68, 40, all(line('M54 20 L84 20 M54 28 L94 28 M54 36 L78 36', C.white, 1.6))), fig(32, C.green, 'smile', { h: 0.9 }), reach(32, 0.9, 1, 50, 30), mini(66, 96, C.yellow, 'smile', 0.8), mini(94, 96, C.sky, 'smile', 0.8), greyed(say(20, 16, 36, 26, 26, 34, bed(20, 20, 0.85)))),
  'jobb.timanställd': all(clock(42, 54, 30, 2, 0), path('M42 54 L42 24 A30 30 0 0 1 68 39 Z', 'rgba(228,87,46,0.35)', null), arrow(78, 40, 92, 34, HL, 2), coin(102, 30, 9), phone(100, 82, 1.4), line('M110 72 L114 68 M112 78 L116 77 M110 84 L114 88', HL, 1.6)),
  'jobb.heltid': all(pie(36, 46, 26, 1, C.green), clock(36, 46, 26, 5, 0, 'rgba(0,0,0,0)'), week(48, 88, 5, C.green), fig(100, C.green, 'smile', { h: 0.62 }), ground),
  'jobb.deltid': all(pie(36, 46, 26, 0.5, C.green), week(48, 88, 3, C.green), fig(100, C.orange, 'smile', { h: 0.62 }), greyed(pie(98, 18, 10, 1, C.grey)), ground),
  'jobb.sysselsättningsgrad': all(rect(10, 46, 100, 22, C.white, 4, C.ink, 1.8), rect(12, 48, 72, 18, C.green, 3, null), line('M85 42 L85 72', HL, 2.4), num(60, 90, '75%', 18, C.ink), ...[10, 35, 60, 85, 110].map((x) => line(`M${x} 70 L${x} 76`, C.grey, 1.4)), mini(85, 22, C.green, 'smile', 0.9)),
  'jobb.bemanningsföretag': all(office(30, 66, 0.9, '#e3d6f0'), ...[0, 1, 2].map((i) => mini(22 + i * 8, 44, [C.orange, C.green, C.sky][i]!, 'smile', 0.42)), curveArrow('M52 40 C66 26 76 24 86 24', 86, 24, 0, HL, 2), arrow(54, 66, 82, 66, HL, 2), curveArrow('M52 90 C66 100 74 102 84 102', 84, 102, 0, HL, 2), factory(102, 26, 0.5), hospital(102, 66, 0.5), shop(102, 98, 0.5), ground),
  'jobb.konsult': all(fig(28, C.dark, 'smile', { h: 0.9 }), tie(28, 0.9), briefcase(16, 96, 0.8), reach(28, 0.9, 1, 52, 44), rect(54, 18, 54, 36, C.white, 2, C.ink, 1.6), barChart(81, 40, 0.9, [4, 8, 12, 16]), mini(66, 92, C.orange, 'smile', 0.8), mini(94, 92, C.sky, 'smile', 0.8), hourglass(110, 72, 0.6), ground),
  'jobb.inhyrd': all(company(84, 72, 1.3, '#f2c48a'), ring(84, 92, 20, HL), fig(84, C.green, 'smile', { h: 0.5 }), office(20, 74, 0.6, '#e3d6f0'), path('M34 50 C50 34 66 50 76 64', 'none', C.purple, 1.8, ), coin(52, 38, 5), ground),

  // ── 1525 Anställningsavtal ──
  'jobb.avtala': all(fig(22, C.navy, 'smile', { h: 0.82 }), fig(98, C.green, 'smile', { h: 0.82 }), sb(22, 0.82, 1, 24, 22, (cx, cy) => cal(cx, cy, 0.5, [4], HL)), sb(98, 0.82, -1, 24, 22, (cx, cy) => cal(cx, cy, 0.5, [4], HL)), contract(60, 84, 0.8), okB(60, 58, 7), ground),
  'jobb.tillträdesdag': all(cal(32, 40, 2.0, [0], C.green), path('M18 14 L18 2 L28 6 L18 10', C.green, C.ink, 1), office(92, 80, 0.7), fig(66, C.green, 'smile', { h: 0.6 }), arrow(72, 80, 84, 80, HL, 2), ground),
  'jobb.arbetsort': all(rect(8, 50, 104, 58, '#d8eccf', 4, C.ink, 1.4), line('M8 80 L112 74 M50 50 L58 108', '#f6f2ea', 4), office(70, 74, 0.5), pin(70, 22, 1.4), greyed(fig(28, C.grey, 'smile', { h: 0.4 })), house(24, 100, 0.6)),
  'jobb.konkurrensklausul': all(company(24, 82, 0.62, '#e9c27a'), company(96, 82, 0.62, '#e9c27a'), fig(60, C.green, 'calm', { h: 0.6 }), arrow(68, 80, 78, 80, C.grey, 2), noB(80, 56, 9), contract(36, 26, 0.7), hourglass(56, 24, 0.6), ground),
  'jobb.sekretessavtal': all(contract(38, 60, 1.7), padlock(38, 76, 1.2, false, C.gold), fig(94, C.navy, 'calm', { h: 0.82 }), sb(94, 0.82, -1, 20, 16, (cx, cy) => cross(cx, cy, 0.8)), ground),
  'jobb.exemplar': all(contract(32, 46, 1.3), contract(88, 46, 1.3), T(60, 52, '=', 18, C.ink), mini(32, 96, C.navy, 'smile', 0.9), mini(88, 96, C.green, 'smile', 0.9)),

  // ── 1526 Lön och förmåner ──
  'jobb.månadslön': all(greyed(cal(48, 36, 1.8)), cal(40, 44, 2.0, [8], C.gold), coins(59, 66, 3, 6), curveArrow('M84 30 C104 34 106 60 92 70', 92, 70, 140, C.grey, 1.8), fig(98, C.green, 'smile', { h: 0.6 }), ground),
  'jobb.timlön': all(clock(36, 50, 26, 2, 0), path('M36 50 L36 24 A26 26 0 0 1 58.5 37 Z', 'rgba(228,87,46,0.45)', null), arrow(66, 50, 82, 50, HL, 2.4), coin(98, 50, 11)),
  'jobb.ingångslön': all(door(26, 108, 56, true), fig(46, C.green, 'smile', { h: 0.72 }), coins(70, 106, 2, 6), greyed(coins(86, 106, 4, 6), coins(102, 106, 6, 6)), arrow(64, 70, 104, 54, C.grey, 1.6), ground),
  'jobb.bruttolön': all(...Array.from({ length: 10 }, (_, i) => ellipse(46, 100 - i * 7, 18, 6, i >= 7 ? '#f0a030' : C.gold, C.ink, 1.2)), line('M74 104 L80 104 L80 30 L74 30', HL, 2.6), ring(46, 66, 44, HL), greyed(office(96, 90, 0.4))),
  'jobb.nettolön': all(...Array.from({ length: 7 }, (_, i) => ellipse(36, 100 - i * 7, 18, 6, C.gold, C.ink, 1.2)), greyed(...[0, 1, 2].map((i) => ellipse(36, 51 - i * 7, 18, 6, C.gold, C.ink, 1.2))), arrow(56, 40, 78, 26, C.grey, 1.8), greyed(office(96, 30, 0.38)), line('M60 104 L66 104 L66 56 L60 56', HL, 2.6), rect(80, 82, 30, 22, C.brown, 4, C.ink, 1.4), line('M80 88 L110 88', C.ink, 1), arrow(58, 80, 76, 90, HL, 2)),
  'jobb.betala-ut': all(company(28, 70, 0.9), arrow(52, 56, 74, 56, HL, 2.4), coin(62, 44, 5), coin(70, 66, 5), fig(96, C.green, 'smile', { h: 0.85 }), reach(96, 0.85, -1, 82, 60), palm(82, 58, 0.8), ground),
  'jobb.lönespecifikation': all(rect(18, 10, 64, 96, C.white, 3, C.ink, 1.8), ...[0, 1, 2].map((i) => all(line(`M26 ${26 + i * 12} L50 ${26 + i * 12}`, C.grey2, 2.4), rect(58, 22 + i * 12, 16, 7, i === 1 ? 'rgba(232,48,44,0.35)' : C.grey2, 1, null))), line('M24 66 L76 66', C.ink, 1.4), rect(24, 72, 52, 12, 'rgba(79,157,105,0.35)', 2, null), coins(70, 80, 1, 4), mag(92, 82, 1.4), coin(30, 96, 5)),
  'jobb.övertidsersättning': all(rect(8, 8, 50, 40, '#2f3f6a', 2, C.ink, 1.6), moon(26, 24, 8), star(46, 18, 2.4, C.yellow), clock(90, 26, 16, 9, 0), table(84, 8, 76), fig(40, C.navy, 'sleepy', { h: 0.85 }), laptop(54, 83, 0.7), plusB(98, 64, 8, C.green), coins(98, 94, 3, 7), ground),
  'jobb.OB-tillägg': all(rect(0, 0, 120, 112, '#2f3f6a', 0, null), moon(96, 20, 10), star(70, 14, 2.6, C.yellow), star(110, 44, 2, C.yellow), fig(40, C.white, 'smile', { h: 0.9 }), rect(38, 52, 4, 12, RED, 0, null), rect(34, 56, 12, 4, RED, 0, null), plusB(86, 66, 9, C.green), coin(102, 90, 9), line('M4 112 L116 112', C.grey2, 2)),
  'jobb.provision': all(fig(22, C.navy, 'smile', { h: 0.85 }), tie(22, 0.85), car(70, 96, 1.2, C.red), fig(104, C.green, 'smile', { h: 0.8 }), curveArrow('M70 72 C60 50 46 42 36 40', 36, 40, 200, HL, 2), coin(56, 50, 7), greyed(car(84, 30, 0.5, C.grey), car(104, 30, 0.5, C.grey)), coin(84, 16, 4), coin(104, 16, 4), ground),
  'jobb.lönesamtal': all(fig(28, C.navy, 'calm', { h: 0.85 }), fig(92, C.green, 'smile', { h: 0.85 }), table(86, 10, 110), sb(92, 0.85, -1, 30, 24, (cx, cy) => all(coins(cx - 5, cy + 6, 3, 5), arrow(cx + 7, cy + 7, cx + 7, cy - 8, C.green, 2))), doc(56, 80, 0.4, '', 3)),
  'jobb.löneanspråk': all(cv(36, 66, 1.6, all(rect(-12, 13, 24, 4, 'rgba(228,87,46,0.35)', 1, null))), coin(36, 93, 3.4), fig(96, C.orange, 'calm', { h: 0.82 }), say(84, 16, 30, 22, 92, 30, coins(84, 22, 4, 5))),
  'jobb.löneförhöjning': all(coins(26, 106, 3, 8), coins(54, 106, 6, 8), coins(82, 106, 10, 8), arrow(16, 70, 96, 30, C.green, 2.8), fig(108, C.green, 'laugh', { h: 0.55 }), ground),
  'jobb.förmån': all(company(24, 74, 0.8), arrow(46, 70, 58, 70, HL, 2), gift(74, 84, 1.0), fig(104, C.green, 'smile', { h: 0.72 }), ...[[56, 30], [80, 18], [104, 30]].map(([x, y]) => circle(x!, y!, 11, C.white, C.ink, 1.2)), cup(56, 32, 0.8), phone(80, 18, 0.9), car(104, 32, 0.4, C.denim), ground),
  'jobb.friskvårdsbidrag': all(company(22, 74, 0.75), arrow(42, 60, 58, 60, HL, 2.2), coin(50, 48, 6), fig(86, C.green, 'laugh', { h: 0.86 }), reach(86, 0.86, -1, 68, 28), reach(86, 0.86, 1, 104, 28), dumbbell(86, 26, 1.3), ground),

  // ── 1527 Uppsägning och byte av jobb ──
  'jobb.säga-upp.2': all(greyed(company(60, 28, 0.55)), fig(26, C.navy, 'calm', { h: 0.9 }), tie(26, 0.9), reach(26, 0.9, 1, 56, 66), envelope(62, 66, 0.55), fig(96, C.orange, 'frown', { h: 0.85 }), reach(96, 0.85, -1, 70, 68), ground),
  'jobb.säga-upp-sig': all(door(106, 108, 60, true), fig(30, C.navy, 'shock', { h: 0.9 }), tie(30, 0.9), fig(78, C.green, 'calm', { h: 0.85 }), reach(78, 0.85, -1, 54, 66), envelope(50, 66, 0.55), arrow(88, 104, 100, 104, HL, 2), ground),
  'jobb.varsel': all(factory(40, 50, 1.2), warn(92, 24, 1.6), ...[0, 1, 2, 3, 4].map((i) => mini(14 + i * 23, 98, i % 2 ? C.grey : C.sky, i % 2 ? 'frown' : 'flat', 0.7))),
  'jobb.varsla': all(company(22, 70, 0.8), ...[[60, 26], [70, 58], [60, 90]].map(([x, y]) => all(envelope(x!, y!, 0.6), warn(x! + 6, y! - 6, 0.6))), ...[[100, 26], [100, 58], [100, 90]].map(([x, y]) => mini(x!, y!, C.grey, 'frown', 0.7)), arrow(44, 50, 52, 34, HL, 1.8), arrow(44, 60, 54, 60, HL, 1.8), arrow(44, 72, 52, 86, HL, 1.8)),
  'jobb.få-sparken': all(fig(22, C.navy, 'angry', { h: 0.9 }), tie(22, 0.9), reach(22, 0.9, 1, 42, 44), thumb(44, 42, 1), door(104, 108, 60, true), fig(76, C.orange, 'frown', { h: 0.8 }), reach(76, 0.8, -1, 66, 82), reach(76, 0.8, 1, 86, 82), box(76, 82, 24, 16), arrow(88, 108, 98, 108, HL, 2), ground),
  'jobb.sista-arbetsdag': all(cal(24, 24, 1.3, [8], HL), fig(60, C.green, 'smile', { h: 0.88 }), reach(60, 0.88, 1, 78, 66), flowers(82, 70, 1.1), fig(100, C.purple, 'laugh', { h: 0.8 }), reach(100, 0.8, 1, 112, 44), palm(112, 40, 0.8), fig(22, C.orange, 'laugh', { h: 0.78 }), cake(22, 76, 0.9), ground),
  'jobb.tjänstgöringsintyg': all(rect(14, 14, 70, 88, '#f6ecd0', 3, C.ink, 1.8), mini(30, 34, C.green, 'smile', 0.7), lines(56, 30, 28, 2, C.grey), line('M22 56 L76 56', C.ink, 1.2), rect(22, 52, 40, 8, C.green, 2, null), lines(48, 72, 50, 3, C.grey), circle(70, 90, 8, RED, C.ink, 1.2), path('M66 96 L64 106 L70 102 L76 106 L74 96', RED, C.ink, 0.8), pen(100, 80, 1.1, 30)),
  'jobb.avgångsvederlag': all(door(26, 108, 60, true), fig(56, C.navy, 'smile', { h: 0.85 }), tie(56, 0.85), reach(56, 0.85, 1, 80, 76), bag(90, 86, 1.6), arrow(36, 104, 24, 104, C.grey, 1.8), ground),
  'jobb.omställningsstöd': all(signpost(84, 108, 1.6), fig(24, C.purple, 'smile', { h: 0.88 }), reach(24, 0.88, 1, 46, 54), palm(48, 52, 0.9), fig(58, C.orange, 'calm', { h: 0.78 }), sb(58, 0.78, 1, 20, 16, (cx, cy) => q(cx, cy, 11), -10), ground),
  'jobb.byta-jobb': all(greyed(company(22, 70, 0.8)), office(98, 70, 0.8, '#d8eccf'), fig(60, C.green, 'smile', { h: 0.66 }), arrow(40, 104, 80, 104, HL, 2.6), ground),
  'jobb.karriärbyte': all(greyed(fig(22, C.grey, 'smile', { h: 0.8 }), tie(22, 0.8, C.grey), briefcase(34, 96, 0.8, C.grey)), curveArrow('M38 30 C52 14 68 14 80 26', 80, 26, 40, HL, 2.4), fig(92, C.white, 'laugh', { h: 0.9 }), rect(90, 50, 4, 12, RED, 0, null), rect(86, 54, 12, 4, RED, 0, null), reach(92, 0.9, 1, 110, 70), ground),
};

function house(x: number, y: number, s = 1, col = '#e8a07a'): Svg { return g(`translate(${x} ${y}) scale(${s})`, path('M-14 -2 L0 -14 L14 -2 Z', RED, C.ink, 1.3), rect(-11, -2, 22, 16, col, 1, C.ink, 1.3), rect(-3, 5, 6, 9, C.brown, 0.5, C.ink, 0.8)); }
