/**
 * Samhälle & institutioner → Juridik & rättsväsende → Förvaltning & myndigheter, 1451–1457 (0.31):
 * administrative decisions, applications and permits, appeals, the principle of public access,
 * secrecy and confidentiality, personal data and privacy, and the authorities' duty to serve. Most
 * words are abstract, so the pictures are small symbolic scenes built from the same signs as the
 * other law groups: an office block with a flag (an authority), a courthouse with a balance, white
 * sheets (documents, decisions), green and red stamps (yes / no), the § sign, a padlock (secret), a
 * magnifier (examine), and a grey reference where a contrast helps. No gavels and no words.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, star, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm, padlock } from './people';
import { P as F, type Mood, greyed } from './blindFix';
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
const cross = (x: number, y: number, s = 1, col: string = RED) => line(`M${x - 5 * s} ${y - 5 * s} L${x + 5 * s} ${y + 5 * s} M${x + 5 * s} ${y - 5 * s} L${x - 5 * s} ${y + 5 * s}`, col, 2.4 * s);
const check = (x: number, y: number, s = 1, col: string = C.green) => checkIcon(x, y, s, col);
const okB = (x: number, y: number, r = 8) => all(circle(x, y, r, C.green, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, r * 0.22));
const noB = (x: number, y: number, r = 8) => all(circle(x, y, r, RED, C.ink, 1.2), line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, C.white, r * 0.22));
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const palm = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ...[-4.6, -1.6, 1.4, 4.4].map((d, i) => rect(d - 1.3, -9 + Math.abs(i - 1.5) * 1.2, 2.6, 9, C.skin, 1.3, C.ink, 0.9)), path('M-5.5 -1 L5.5 -1 L5 5 C4 8 -4 8 -5 5 Z', C.skin, C.ink, 1), path('M-5.4 1 L-9 -3 C-10 -4 -11 -2 -10 -1 L-5 5', C.skin, C.ink, 1));
/** Arrow made of a curved path. */
const curveArrow = (d: string, ex2: number, ey: number, ang: number, col: string = HL, w = 2) => all(line(d, col, w), g(`translate(${ex2} ${ey}) rotate(${ang})`, path('M0 0 L-6 -3.4 L-6 3.4 Z', col, null)));

// ── Things ───────────────────────────────────────────────────────────
/** A sheet of paper with text lines; `marks` in the sheet's own coordinates (−14…14, −18…18). */
const doc = (x: number, y: number, s = 1, marks: Svg = '', n = 5, col: string = C.grey2, fill: string = C.white) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -18, 28, 36, fill, 2, C.ink, 1.6), ...Array.from({ length: n }, (_, i) => line(`M-9 ${-11 + i * 6} L9 ${-11 + i * 6}`, col, 2)), marks);
/** The law book: thick, dark red, gold bands, § on the cover. */
const lawBook = (x: number, y: number, s = 1, col = BOOK, mark = true) => g(`translate(${x} ${y}) scale(${s})`, rect(-13, -16, 26, 32, col, 2, C.ink, 1.6), rect(-13, -16, 5, 32, '#5e1c1c', 1, null), line('M-6 -11 L9 -11 M-6 11 L9 11', C.gold, 2), mark ? T(1.5, 5, '§', 13, C.gold) : '', rect(11, -14, 3, 28, '#f3ead6', 0.5, C.ink, 0.8));
/** An open book; `l` and `r` are drawn on the left and right page (page centres at −13 and 13). */
const openBook = (x: number, y: number, s = 1, l: Svg = '', r: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, path('M0 -14 C-8 -18 -20 -18 -26 -15 L-26 15 C-20 12 -8 12 0 16 Z', C.white, C.ink, 1.5), path('M0 -14 C8 -18 20 -18 26 -15 L26 15 C20 12 8 12 0 16 Z', C.white, C.ink, 1.5), line('M0 -14 L0 16', C.ink, 1.2), l, r);
const mag = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 8, 'rgba(220,240,252,0.7)', C.ink, 2), line('M5.6 5.6 L12 12', C.ink, 3));
const pen = (x: number, y: number, s = 1, rot = 35) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-2, -14, 4, 22, C.navy, 1, C.ink, 1), path('M-2 8 L0 13 L2 8 Z', C.tan, C.ink, 0.8));
const cal = (x: number, y: number, s = 1, hi: number[] = [], col: string = HL) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -14, 28, 28, C.white, 2, C.ink, 1.4), rect(-14, -14, 28, 7, RED, 2, C.ink, 1.4), ...Array.from({ length: 9 }, (_, i) => rect(-11 + (i % 3) * 8, -4 + Math.floor(i / 3) * 6, 6, 4.4, hi.includes(i) ? col : C.grey2, 0.8, null)));
const hourglass = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M-8 -12 L8 -12 M-8 12 L8 12', C.brown, 2.4), path('M-6 -11 L6 -11 L1 0 L6 11 L-6 11 L-1 0 Z', 'rgba(220,240,252,0.7)', C.ink, 1.2), path('M-5 10 L5 10 L0 3 Z', C.tan, null));
const coins = (x: number, y: number, n = 3, r = 5) => all(...Array.from({ length: n }, (_, i) => ellipse(x, y - i * 3, r, r * 0.45, C.gold, C.ink, 1.1)));
const envelope = (x: number, y: number, s = 1, open = false) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -9, 28, 18, C.white, 2, C.ink, 1.5), open ? path('M-14 -9 L0 -20 L14 -9', C.white, C.ink, 1.5) : path('M-14 -9 L0 2 L14 -9', 'none', C.ink, 1.3));
const shield = (x: number, y: number, s = 1, col: string = C.navy, inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, path('M0 -16 L14 -11 C14 4 8 12 0 17 C-8 12 -14 4 -14 -11 Z', col, C.ink, 1.6), inner);
const house = (x: number, y: number, s = 1, col: string = '#e8a07a') => g(`translate(${x} ${y}) scale(${s})`, path('M-14 -2 L0 -14 L14 -2 Z', RED, C.ink, 1.3), rect(-11, -2, 22, 16, col, 1, C.ink, 1.3), rect(-3, 5, 6, 9, C.brown, 0.5, C.ink, 0.8), rect(5, 1, 4, 4, '#9ad0f0', 0.5, C.ink, 0.6));
const target = (x: number, y: number, r = 12) => all(circle(x, y, r, C.white, C.ink, 1.4), circle(x, y, r * 0.66, RED, C.ink, 1), circle(x, y, r * 0.33, C.white, C.ink, 1));
/** Balance (scales); tilt > 0 lowers the right pan. */
const scales = (x: number, y: number, s = 1, tilt = 0, col: string = C.gold) => { const a = (tilt * Math.PI) / 180, dx = 18 * Math.cos(a), dy = 18 * Math.sin(a); const pan = (px: number, py: number) => all(line(`M${f1(px)} ${f1(py)} L${f1(px - 7)} ${f1(py + 10)} M${f1(px)} ${f1(py)} L${f1(px + 7)} ${f1(py + 10)}`, C.ink, 0.9), path(`M${f1(px - 9)} ${f1(py + 10)} C${f1(px - 7)} ${f1(py + 15)} ${f1(px + 7)} ${f1(py + 15)} ${f1(px + 9)} ${f1(py + 10)} Z`, col, C.ink, 1.2)); return g(`translate(${x} ${y}) scale(${s})`, line('M0 -12 L0 18 M-8 18 L8 18', C.ink, 2.2), line(`M${f1(-dx)} ${f1(-12 - dy)} L${f1(dx)} ${f1(-12 + dy)}`, C.ink, 2), circle(0, -13, 2.4, col, C.ink, 1), pan(-dx, -12 - dy), pan(dx, -12 + dy)); };

// ── Buildings and flags ──────────────────────────────────────────────
/** Swedish flag; (x, y) is the top-left corner. */
const flagSE = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(0, 0, 20, 13, '#2a6ebb', 0.5, C.ink, 1), rect(6, 0, 3.4, 13, '#f7cf2e', 0, null), rect(0, 4.8, 20, 3.4, '#f7cf2e', 0, null), rect(0, 0, 20, 13, 'none', 0.5, C.ink, 1));
/** The EU flag (a circle of twelve stars on blue); (x, y) is the top-left corner. */
const flagEU = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(0, 0, 20, 13, '#2a4fa8', 0.5, C.ink, 1), ...Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return star(+f1(10 + Math.sin(a) * 4.3), +f1(6.5 - Math.cos(a) * 4.3), 0.9, '#f7cf2e'); }));
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

// ── Things for this group ────────────────────────────────────────────
/** A round stamp mark: green with a tick (yes) or red with a cross (no). */
const seal = (x: number, y: number, r: number, ok: boolean) => all(circle(x, y, r, 'none', ok ? C.green : RED, r * 0.22), ok ? path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.38)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.green, r * 0.24) : line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, RED, r * 0.24));
/** A decision: a sheet with a stamp in the lower part. */
const decision = (x: number, y: number, s: number, ok: boolean) => doc(x, y, s, seal(5, 9, 6.5, ok), 3);
/** A case folder with a tab. */
const folder = (x: number, y: number, s = 1, col = '#f2cf6b', inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, path('M-18 -12 L-18 -16 L-6 -16 L-3 -12 Z', col, C.ink, 1.3), rect(-18, -12, 36, 26, col, 2, C.ink, 1.5), inner);
/** An open ledger (the register of documents) with rows of entries. */
const ledger = (x: number, y: number, s = 1, hiRow = -1) => openBook(x, y, s, all(...[0, 1, 2, 3].map((i) => all(rect(-23, -9 + i * 6, 4, 3.5, C.grey, 0.5, null), line(`M-17 ${-7 + i * 6} L-4 ${-7 + i * 6}`, i === hiRow ? HL : C.grey2, 2)))), all(...[0, 1, 2, 3].map((i) => line(`M4 ${-7 + i * 6} L22 ${-7 + i * 6}`, i === hiRow ? HL : C.grey2, 2))));
/** A counter (desk) seen from the front. */
const counter = (x1: number, x2: number, y = 80) => all(rect(x1, y, x2 - x1, 32, '#c9a77c', 2, C.ink, 1.6), line(`M${x1} ${y + 6} L${x2} ${y + 6}`, C.brown, 1.2));
/** A wall camera on a bracket, looking down-left. */
const cctv = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L10 0 L10 -10', C.ink, 2.4), g('rotate(20)', rect(-22, -6, 22, 12, C.white, 3, C.ink, 1.6), rect(-27, -4, 6, 8, C.dark, 1, C.ink, 1.2), circle(-6, 0, 1.6, RED, null)), path('M-26 6 L-46 34 L-14 26 Z', 'rgba(242,193,78,0.25)', null));
/** A computer screen; `inner` is drawn at the screen centre. */
const screen = (x: number, y: number, s = 1, inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-22, -16, 44, 30, C.dark, 3, C.ink, 1.6), rect(-19, -13, 38, 24, '#dff0fa', 1, null), inner, rect(-4, 14, 8, 6, C.grey, 0.5, C.ink, 1), rect(-12, 20, 24, 3, C.grey, 1, C.ink, 1));
/** A database (stacked cylinder). */
const db = (x: number, y: number, s = 1, col = '#7fb0d8') => g(`translate(${x} ${y}) scale(${s})`, path('M-14 -12 L-14 12 C-14 18 14 18 14 12 L14 -12', col, C.ink, 1.5), ellipse(0, -12, 14, 5, col, C.ink, 1.5), path('M-14 0 C-14 6 14 6 14 0', 'none', C.ink, 1.2));
/** A waste bin. */
const bin = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-10 -8 L10 -8 L8 14 L-8 14 Z', C.grey, C.ink, 1.5), rect(-12, -12, 24, 4, C.grey2, 1, C.ink, 1.3), line('M-4 -4 L-3 10 M4 -4 L3 10', C.ink, 1));
/** A stopwatch. */
const watch = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-3, -18, 6, 4, C.dark, 1, C.ink, 1), circle(0, 0, 14, C.white, C.ink, 2), line('M0 0 L0 -9 M0 0 L6 3', C.ink, 2), circle(0, 0, 1.6, C.ink, null));
/** A round no-entry sign. */
const noEntry = (x: number, y: number, r = 9) => all(circle(x, y, r, RED, C.ink, 1.3), rect(x - r * 0.62, y - r * 0.18, r * 1.24, r * 0.36, C.white, 0.5, null));
/** An ID card with a small face. */
const idCard = (x: number, y: number, s = 1, col = '#cfe3f3') => g(`translate(${x} ${y}) scale(${s})`, rect(-15, -10, 30, 20, col, 2, C.ink, 1.4), circle(-7, -2, 3.6, C.skin, C.ink, 0.9), path('M-12 7 C-12 1 -2 1 -2 7 Z', C.navy, null), line('M2 -4 L11 -4 M2 1 L11 1 M2 6 L8 6', C.grey, 1.6));
/** A small food cart. */
const cart = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-18, -16, 36, 22, C.yellow, 2, C.ink, 1.5), path('M-21 -16 L-14 -26 L14 -26 L21 -16 Z', RED, C.ink, 1.4), rect(-12, -12, 24, 8, C.white, 1, C.ink, 1), circle(-10, 10, 5, C.dark, C.ink, 1.2), circle(10, 10, 5, C.dark, C.ink, 1.2));
/** A pause sign (two bars in a circle). */
const pauseSign = (x: number, y: number, r = 10) => all(circle(x, y, r, C.yellow, C.ink, 1.5), rect(x - r * 0.42, y - r * 0.45, r * 0.28, r * 0.9, C.ink, 0.5, null), rect(x + r * 0.14, y - r * 0.45, r * 0.28, r * 0.9, C.ink, 0.5, null));
/** A paperclip. */
const clip = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-2 10 L-2 -6 C-2 -10 4 -10 4 -6 L4 8 C4 12 -6 12 -6 8 L-6 -4', 'none', C.silver, 2), path('M-2 10 L-2 -6 C-2 -10 4 -10 4 -6 L4 8 C4 12 -6 12 -6 8 L-6 -4', 'none', C.ink, 0.6));
/** A rosette seal for a certificate. */
const rosette = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-4 2 L-7 12 L-2 9 L0 13 L1 3 Z', RED, C.ink, 0.8), path('M4 2 L7 12 L2 9 L0 13 L-1 3 Z', RED, C.ink, 0.8), circle(0, 0, 6, C.gold, C.ink, 1), circle(0, 0, 3.5, 'none', '#b88a20', 1));
/** A heavy dark weight. */
const weight = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-5 -14 C-5 -20 5 -20 5 -14', 'none', C.ink, 2.4), path('M-12 -12 L12 -12 L16 10 L-16 10 Z', C.dark, C.ink, 1.5));
/** A gift box. */
const gift = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-10, -6, 20, 16, C.green, 1, C.ink, 1.3), rect(-12, -10, 24, 5, C.mint, 1, C.ink, 1.3), rect(-1.5, -10, 3, 20, C.yellow, 0, null), path('M0 -10 C-6 -16 -10 -12 -4 -10 M0 -10 C6 -16 10 -12 4 -10', 'none', C.yellow, 1.6));
/** A notebook and pen (a journalist). */
const notebook = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-8, -10, 16, 20, C.white, 1, C.ink, 1.3), line('M-8 -10 L8 -10', C.ink, 2.4), line('M-5 -4 L5 -4 M-5 0 L5 0 M-5 4 L3 4', C.grey, 1.2));
/** A dark silhouette of an anonymous person. */
const shadow = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-12 16 C-12 2 12 2 12 16 Z', C.dark, C.ink, 1.2), circle(0, -6, 8, C.dark, C.ink, 1.2), q(0, -6, 10, C.white));
/** A shelf with ring binders. */
const shelf = (x: number, y: number, w: number, cols: string[]) => all(rect(x, y, w, 4, C.brown, 1, C.ink, 1.2), ...cols.map((c, i) => all(rect(x + 3 + i * 9, y - 24, 8, 24, c, 1, C.ink, 1.1), circle(x + 7 + i * 9, y - 8, 1.8, C.white, C.ink, 0.7))));
/** A heart between two people (a close relation). */
const bond = (x: number, y: number) => heart_(x, y);
/** A bell on a counter. */
const bell = (x: number, y: number) => all(path(`M${x - 7} ${y} C${x - 7} ${y - 10} ${x + 7} ${y - 10} ${x + 7} ${y} Z`, C.gold, C.ink, 1.3), rect(x - 9, y, 18, 3, C.dark, 1, C.ink, 1), circle(x, y - 10, 1.8, C.dark, null));
/** A lightbulb that is on. */
const bulbOn = (x: number, y: number) => all(...[-1, 0, 1].map((i) => line(`M${x + i * 11} ${y - 13 - (i === 0 ? 3 : 0)} l${i * 3} -4`, C.gold, 2)), circle(x, y, 8, C.yellow, C.ink, 1.4), rect(x - 4, y + 7, 8, 5, C.grey, 1, C.ink, 1));
/** A ramp with a wheelchair symbol. */
const ramp = (x: number, w: number) => all(path(`M${x} 112 L${x + w} 100 L${x + w} 112 Z`, C.grey2, C.ink, 1.2), circle(x + w * 0.45, 96, 4, 'none', '#2a6ebb', 1.8), circle(x + w * 0.45, 88, 1.8, '#2a6ebb', null), line(`M${x + w * 0.45} 90 L${x + w * 0.45} 95 L${x + w * 0.62} 95 L${x + w * 0.66} 100`, '#2a6ebb', 1.8));
/** A phone handset. */
const handset = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s}) rotate(-30)`, path('M-10 -4 C-10 -10 10 -10 10 -4 L7 -1 L4 -4 L-4 -4 L-7 -1 Z', C.green, C.ink, 1.3));
/** Black bars over text lines (masked text). */
const masked = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-18, -24, 36, 48, C.white, 2, C.ink, 1.6), ...[0, 1, 2, 3, 4, 5].map((i) => (i === 1 || i === 4 ? rect(-13, -18 + i * 7, 26, 5, C.ink, 0.5, null) : i === 2 ? all(line('M-13 -1.5 L-3 -1.5', C.grey, 2), rect(-1, -4, 14, 5, C.ink, 0.5, null)) : line(`M-13 ${-15.5 + i * 7} L13 ${-15.5 + i * 7}`, C.grey, 2))));
/** Steps of three courts; `hi` (0–2) marks the step that is meant. */
const courtSteps = (hi: number) => all(podium(14, 30, [22, 40, 58], hi === 0 ? [C.yellow, C.grey2, C.grey2] : hi === 1 ? [C.grey2, C.yellow, C.grey2] : [C.grey2, C.grey2, C.yellow]), ...[0, 1, 2].map((i) => { const c = court(29 + i * 30, 112 - [22, 40, 58][i]! - 12, 0.38); return i === hi ? c : greyed(c); }), arrow(30, 70, 50, 56, C.grey, 1.8), arrow(60, 52, 80, 38, C.grey, 1.8), ring(29 + hi * 30, 112 - [22, 40, 58][hi]! - 12, 15));

export const AUTHORITY_MOTIFS: Record<string, Svg> = {
  // ── Förvaltningsbeslut ──
  'forv.förvaltningsmyndighet': all(office(44, 88, 1.1), okB(80, 30, 7), greyed(court(96, 98, 0.45)), noB(108, 72, 6), ground),
  'forv.myndighetsutövning': all(office(26, 90, 0.8), arrow(46, 56, 64, 56, HL, 2.6), doc(78, 46, 0.8, all(para(0, -4, 13, C.navy), seal(5, 10, 5, true)), 0), fig(96, C.orange, 'calm', { h: 0.62 }), ground),
  'forv.förvaltningslagen': all(lawBook(30, 62, 1.25), arrow(52, 62, 64, 62, HL, 2.4), office(92, 88, 0.7), folder(92, 32, 0.55), ground),
  'forv.handlägga': all(fig(34, C.navy, 'calm', { h: 0.95 }), counter(8, 112, 82), folder(80, 74, 0.8, '#f2cf6b', doc(0, -6, 0.5, '', 3)), reach(34, 0.95, 1, 68, 70), mag(98, 62, 0.8)),
  'forv.handläggning': all(folder(18, 56, 0.6), arrow(32, 56, 44, 56, C.grey, 2), mag(58, 54, 1), arrow(74, 56, 86, 56, C.grey, 2), decision(102, 56, 0.8, true), line('M10 86 L110 86', HL, 2.4), circle(18, 86, 3, HL, null), circle(60, 86, 3, HL, null), circle(102, 86, 3, HL, null), ground),
  'forv.beslutsunderlag': all(doc(22, 88, 0.6, rosette(0, 6, 0.8), 2), doc(60, 92, 0.6, '', 4), doc(98, 88, 0.6, rect(-9, -4, 18, 12, '#9ad0f0', 1, C.ink, 0.8), 2), arrow(28, 70, 50, 46, C.grey, 1.8), arrow(60, 74, 60, 50, C.grey, 1.8), arrow(92, 70, 70, 46, C.grey, 1.8), decision(60, 26, 0.7, true), ground),
  'forv.bifall': all(decision(40, 58, 1.35, true), fig(94, C.orange, 'laugh', { h: 0.8 }), ground),
  'forv.avslag': all(decision(40, 58, 1.35, false), fig(94, C.orange, 'frown', { h: 0.8 }), ground),
  'forv.gynnande': all(decision(22, 40, 0.7, true), curveArrow('M34 36 C52 30 62 40 66 52', 66, 52, 60, HL, 2.2), gift(70, 66, 1.1), coins(54, 106, 3, 5), fig(98, C.orange, 'laugh', { h: 0.72 }), ground),
  'forv.betungande': all(decision(22, 40, 0.7, false), curveArrow('M34 36 C50 24 66 22 74 30', 74, 30, 40, HL, 2.2), fig(84, C.orange, 'frown', { h: 0.7 }), weight(84, 30, 1.1), ground),
  // ── Ansökan och tillstånd ──
  'forv.ansökan': all(fig(24, C.orange, 'smile', { h: 0.85 }), reach(24, 0.85, 1, 50, 60), doc(56, 56, 0.8, path('M-8 12 C-5 6 -3 14 0 9 C2 6 4 12 7 10', 'none', C.navy, 1.4), 3), arrow(70, 60, 80, 60, HL, 2.4), office(98, 90, 0.6), ground),
  'forv.sökande': all(office(92, 90, 0.6), greyed(fig(64, C.green, 'calm', { h: 0.7 })), fig(26, C.orange, 'smile', { h: 0.8 }), reach(26, 0.8, 1, 44, 64), doc(48, 62, 0.5, '', 3), ring(30, 70, 26)),
  'forv.blankett': all(rect(28, 12, 64, 92, C.white, 3, C.ink, 2), ...[0, 1, 2, 3].map((i) => all(rect(36, 24 + i * 18, 8, 8, C.white, 1, C.ink, 1.3), line(`M50 ${28 + i * 18} L82 ${28 + i * 18}`, C.grey2, 2.4))), check(40, 28, 0.7), check(40, 46, 0.7), pen(92, 82, 1.1, 30)),
  'forv.bifoga': all(envelope(52, 82, 1.6, true), doc(56, 52, 0.9, '', 4), arrow(92, 30, 70, 50, HL, 2.4), clip(66, 38, 1)),
  'forv.bilaga': all(doc(46, 60, 1.3, '', 6), doc(84, 70, 0.85, '', 3, C.grey2, '#fff6d8'), clip(78, 46, 1.1), ring(84, 70, 22)),
  'forv.intyg': all(rect(18, 22, 84, 72, '#fffaf0', 3, C.ink, 2), rect(24, 28, 72, 60, 'none', 2, C.gold, 1.4), line('M34 42 L86 42 M34 52 L80 52 M34 62 L70 62', C.grey, 2.2), path('M38 78 C42 72 46 82 50 76', 'none', C.navy, 1.6), rosette(80, 74, 1.4), ground),
  'forv.komplettering': all(doc(42, 58, 1.4, all(rect(-9, 1, 18, 10, 'none', 1, HL, 1.4)), 2), doc(96, 34, 0.55, '', 3, C.grey2, '#fff6d8'), curveArrow('M96 50 C96 66 80 74 62 74', 62, 74, 180, HL, 2.2), T(100, 78, '+', 18, HL), ground),
  'forv.ansökningsavgift': all(doc(26, 58, 0.9, '', 4), T(44, 64, '+', 16, C.ink), coins(58, 70, 4, 6), arrow(70, 58, 80, 58, HL, 2.4), office(98, 90, 0.6), ground),
  'forv.tillståndspliktig': all(cart(30, 96, 1), rect(56, 76, 6, 36, C.grey, 1, C.ink, 1.2), rect(62, 78, 52, 6, RED, 1, C.ink, 1.2), ...[0, 1, 2].map((i) => rect(70 + i * 16, 78, 8, 6, C.white, 0, null)), doc(90, 40, 0.7, seal(4, 9, 6, true), 3), ex(108, 24, 14), ground),
  'forv.bevilja': all(fig(28, C.navy, 'smile', { h: 0.85 }), reach(28, 0.85, 1, 56, 64), decision(60, 60, 0.75, true), fig(92, C.orange, 'laugh', { h: 0.78 }), reach(92, 0.78, -1, 68, 66), office(28, 18, 0.3), ground),
  'forv.återkalla': all(office(24, 90, 0.7), doc(80, 50, 0.8, seal(4, 9, 6, true), 3), cross(80, 50, 1.6), curveArrow('M70 36 C58 22 44 24 36 34', 36, 34, 130, RED, 2.4), fig(100, C.orange, 'frown', { h: 0.6 }), ground),
  'forv.dispens': all(rect(58, 30, 4, 82, C.grey, 1, C.ink, 1), noEntry(60, 26, 11), greyed(fig(22, C.green, 'calm', { h: 0.6 }), fig(40, C.purple, 'calm', { h: 0.6 })), fig(88, C.orange, 'smile', { h: 0.7 }), doc(108, 66, 0.45, seal(4, 9, 6, true), 2), arrow(66, 104, 78, 104, HL, 2), ground),
  // ── Överklaga myndighetsbeslut ──
  'forv.överklagandetid': all(decision(22, 46, 0.7, false), cal(64, 44, 1.3, [0, 1, 2, 3, 4, 5, 6, 7, 8]), hourglass(102, 46, 1), arrow(14, 90, 106, 90, HL, 2.6), line('M14 84 L14 96', HL, 2.6), ground),
  'forv.överklagandehänvisning': all(rect(22, 10, 56, 96, C.white, 3, C.ink, 2), seal(60, 30, 7, false), line('M30 22 L50 22 M30 30 L50 30 M30 38 L50 38', C.grey2, 2.2), rect(26, 60, 48, 40, '#fff6d8', 2, HL, 2), court(50, 84, 0.42), arrow(76, 80, 96, 80, HL, 2.2), court(104, 96, 0.38), ground),
  'forv.avvisa': all(office(28, 90, 0.7), watch(96, 30, 0.8), noB(106, 18, 5), envelope(80, 76, 0.8), curveArrow('M70 70 C80 58 96 60 104 70', 104, 70, 60, RED, 2.2), cross(52, 56, 1), ground),
  'forv.omprövning': all(office(30, 90, 0.7), decision(82, 58, 0.9, false), curveArrow('M62 34 C76 14 100 18 104 38', 104, 38, 90, HL, 2.4), mag(92, 70, 0.9), ground),
  'forv.rättelse': all(doc(52, 58, 1.6, all(line('M-9 -5 L9 -5', RED, 2.2), line('M-9 -8 L9 -2', RED, 1.6), line('M-9 1 L9 1', C.green, 2.4)), 4), pen(96, 74, 1.2, 30), check(92, 30, 1.2)),
  'forv.inhibition': all(court(26, 92, 0.6), decision(70, 30, 0.6, false), house(96, 98, 1.1), arrow(76, 48, 90, 74, C.grey, 2), pauseSign(70, 74, 12), ground),
  'forv.kammarrätt': courtSteps(1),
  'forv.Högsta-förvaltningsdomstolen': courtSteps(2),
  'forv.Justitieombudsmannen': all(parliament(26, 46, 0.42), arrow(26, 62, 26, 70, C.grey, 1.8), fig(26, C.navy, 'calm', { h: 0.62 }), mag(58, 68, 1.2), office(92, 90, 0.7), envelope(70, 24, 0.6), ground),
  // ── Offentlighetsprincipen ──
  'forv.tryckfrihetsförordningen': all(lawBook(28, 64, 1.3), rect(60, 30, 50, 64, C.white, 2, C.ink, 1.6), rect(66, 36, 38, 14, C.grey2, 1, null), line('M66 58 L104 58 M66 64 L104 64 M66 70 L94 70 M66 78 L104 78 M66 84 L90 84', C.grey, 1.8), flagSE(86, 12, 0.9), ground),
  'forv.begära-ut': all(office(106, 34, 0.35), fig(92, C.navy, 'smile', { h: 0.85 }), counter(66, 118, 82), fig(28, C.orange, 'smile', { h: 0.85 }), sb(28, 0.85, 1, 26, 22, (cx, cy) => all(doc(cx - 4, cy, 0.38, '', 3), q(cx + 7, cy, 10))), arrow(64, 72, 50, 72, HL, 2.2), doc(76, 70, 0.45, '', 3)),
  'forv.diarium': all(ledger(60, 56, 1.8, 1), envelope(22, 98, 0.6), cal(98, 98, 0.6), ground),
  'forv.diarieföra': all(envelope(20, 40, 0.8), arrow(34, 44, 46, 52, HL, 2.2), ledger(72, 62, 1.5, 2), pen(104, 50, 0.9, 30), ground),
  'forv.registrator': all(fig(40, C.navy, 'smile', { h: 0.95 }), counter(8, 112, 82), ledger(84, 70, 0.8, 1), envelope(18, 74, 0.5), envelope(24, 68, 0.5), reach(40, 0.95, 1, 70, 70)),
  'forv.inkomma': all(office(80, 90, 1), envelope(28, 36, 0.9), curveArrow('M38 42 C50 52 60 64 70 80', 70, 80, 60, HL, 2.4), rect(68, 76, 16, 4, C.dark, 1, null), ground),
  'forv.upprätta': all(doc(52, 60, 1.6, all(line('M-9 12 L9 12', C.ink, 1), path('M-8 10 C-5 4 -3 12 0 7 C2 4 4 10 7 8', 'none', C.navy, 1.4)), 4), pen(88, 86, 1.1, 30), check(96, 32, 1.3), office(100, 100, 0.25, '#cfd8e2', false)),
  'forv.arkivera': all(rect(16, 14, 88, 98, '#e8dccb', 2, C.ink, 1.6), shelf(20, 50, 80, ['#5aa7e8', '#e85a5a', '#7ac06a', '#f2c14e', '#a585d0', '#5aa7e8', '#7ac06a', '#e85a5a']), shelf(20, 86, 44, ['#f2c14e', '#a585d0', '#5aa7e8', '#e85a5a']), rect(70, 62, 9, 24, C.green, 1, C.ink, 1.1), arrow(96, 62, 82, 72, HL, 2.2), line('M16 112 L104 112', C.grey2, 2)),
  'forv.meddelarfrihet': all(office(98, 88, 0.6), fig(30, C.navy, 'smile', { h: 0.8 }), fig(70, C.green, 'smile', { h: 0.8 }), notebook(84, 62, 0.8), sb(30, 0.8, 1, 22, 18, (cx, cy) => doc(cx, cy, 0.3, '', 3)), okB(52, 18, 7), ground),
  'forv.meddelarskydd': all(fig(84, C.green, 'calm', { h: 0.85 }), notebook(100, 64, 0.8), shield(42, 62, 2.1, '#cfe3f3', shadow(0, 2, 0.75)), ground),
  'forv.efterforskningsförbud': all(fig(28, C.navy, 'angry', { h: 0.85 }), reach(28, 0.85, 1, 52, 56), mag(62, 52, 1.2), noB(62, 52, 13), greyed(shadow(98, 90, 1.1)), ground),
  // ── Sekretess och tystnadsplikt ──
  'forv.sekretess': all(folder(52, 64, 1.7, '#f2cf6b', doc(0, -4, 0.55, '', 3)), padlock(52, 76, 1.3), say(96, 28, 30, 22, 82, 44, cross(96, 28, 1)), ground),
  'forv.sekretessbelagd': all(doc(48, 58, 1.6, padlock(0, 4, 0.9, false, RED), 2), seal(88, 30, 10, false), ground),
  'forv.röja': all(fig(30, C.orange, 'smile', { h: 0.85 }), sb(30, 0.85, 1, 28, 24, (cx, cy) => padlock(cx, cy + 2, 0.7, true, C.gold)), greyed(fig(90, C.green, 'shock', { h: 0.8 })), doc(98, 30, 0.45, '', 3), ex(110, 16, 12), ground),
  'forv.obehörig': all(rect(56, 22, 44, 90, '#cfd8e2', 2, C.ink, 1.6), rect(64, 30, 28, 82, C.brown, 1, C.ink, 1.4), circle(86, 72, 2, C.gold, null), noEntry(78, 46, 10), greyed(fig(26, C.green, 'calm', { h: 0.85 })), palm(46, 62, 1.1), ground),
  'forv.konfidentiell': all(fig(26, C.orange, 'calm', { h: 0.8 }), fig(70, C.navy, 'calm', { h: 0.8 }), say(48, 20, 22, 20, 36, 38, padlock(48, 22, 0.55)), rect(96, 14, 18, 98, C.brown, 1, C.ink, 1.4), circle(100, 64, 1.8, C.gold, null), ground),
  'forv.lämna-ut': all(office(106, 34, 0.35), fig(92, C.navy, 'smile', { h: 0.85 }), counter(66, 118, 82), reach(92, 0.85, -1, 72, 72), arrow(64, 72, 56, 72, HL, 2.4), doc(44, 66, 0.6, '', 4), fig(22, C.orange, 'smile', { h: 0.85 })),
  'forv.sekretessprövning': all(fig(24, C.navy, 'calm', { h: 0.85 }), doc(56, 56, 1, '', 5), mag(66, 64, 0.9), reach(24, 0.85, 1, 44, 58), padlock(96, 34, 0.8, false, RED), okB(96, 74, 9), line('M80 40 L74 50 M80 70 L74 62', C.grey, 1.6), ground),
  'forv.maska': all(masked(50, 58, 1.6), g('translate(96 74) rotate(30)', rect(-4, -18, 8, 26, C.dark, 2, C.ink, 1.2), rect(-4, 8, 8, 5, C.ink, 1, null))),
  'forv.sekretessbrytande': all(doc(22, 56, 0.8, '', 4), padlock(52, 46, 1.2, true, C.gold), arrow(30, 82, 74, 82, HL, 2.4), fig(94, C.navy, 'calm', { h: 0.8 }), cap(94, geo(94, 0.8).hy - 6, 0.8), ground),
  'forv.anmälningsplikt': all(lawBook(22, 32, 0.7), fig(28, C.green, 'calm', { h: 0.85 }), fig(56, C.yellow, 'frown', { h: 0.5 }), arrow(66, 60, 82, 60, HL, 2.6), ex(74, 46, 14), townHall(98, 92, 0.7), ground),
  'forv.orosanmälan': all(envelope(30, 72, 1.3), say(34, 30, 34, 28, 30, 58, all(circle(34, 30, 9, C.skin, C.ink, 1.2), circle(31, 28, 1, C.ink, null), circle(37, 28, 1, C.ink, null), path('M30 35 Q34 32 38 35', 'none', C.ink, 1.1))), arrow(54, 72, 76, 72, HL, 2.4), townHall(96, 92, 0.7), ground),
  'forv.skyddad-identitet': all(shield(36, 62, 2.4, '#cfe3f3', all(circle(0, -4, 5, C.skin, C.ink, 1), path('M-8 10 C-8 2 8 2 8 10 Z', C.purple, C.ink, 1))), greyed(house(92, 70, 1.4)), q(92, 40, 18, C.navy), ground),
  'forv.sekretessmarkering': all(rect(22, 14, 64, 92, C.white, 2, C.ink, 1.6), ...[0, 1, 2, 3, 4].map((i) => all(circle(32, 28 + i * 17, 4, C.skin, C.ink, 0.9), line(`M40 ${28 + i * 17} L76 ${28 + i * 17}`, i === 2 ? RED : C.grey2, 2.4))), padlock(98, 62, 0.9, false, RED), ring(58, 62, 30, RED), ground),
  // ── Personuppgifter och integritet ──
  'forv.integritetskränkande': all(rect(64, 30, 46, 50, '#cfe3f3', 2, C.ink, 1.6), line('M87 30 L87 80 M64 55 L110 55', C.ink, 1.4), mini(78, 46, C.orange, 'frown', 0.9), fig(26, C.dark, 'calm', { h: 0.85 }), reach(26, 0.85, 1, 48, 50), rect(44, 42, 9, 15, C.dark, 2, C.ink, 1), rect(45.5, 44, 6, 10, '#bfe3f5', 1, null), cross(56, 22, 1.4), ground),
  'forv.dataskyddsförordningen': all(flagEU(10, 16, 1.6), lawBook(30, 80, 1), shield(82, 62, 2.2, C.navy, idCard(0, 0, 0.55)), ground),
  'forv.behandla-personuppgifter': all(screen(60, 52, 1.5, idCard(0, -1, 0.75)), idCard(16, 94, 0.6), arrow(26, 86, 40, 76, HL, 2), db(102, 92, 0.6), arrow(80, 76, 94, 84, HL, 2), ground),
  'forv.personuppgiftsansvarig': all(company(36, 86, 0.9), ring(36, 78, 30), db(92, 84, 1), idCard(92, 46, 0.55), line('M66 84 L78 84', C.ink, 1.6, '2 2'), ground),
  'forv.samla-in': all(mini(18, 30, C.orange, 'smile', 0.7), mini(18, 72, C.green, 'smile', 0.7), mini(60, 22, C.purple, 'smile', 0.7), arrow(28, 34, 66, 70, C.grey, 1.6), arrow(28, 74, 64, 82, C.grey, 1.6), arrow(60, 36, 74, 64, C.grey, 1.6), path('M64 70 L104 70 L96 106 L72 106 Z', C.tan, C.ink, 1.5), idCard(84, 84, 0.5), ground),
  'forv.ändamål': all(idCard(22, 40, 0.7), arrow(36, 54, 60, 72, HL, 2.4), target(80, 80, 22), circle(80, 80, 3, C.ink, null), greyed(idCard(98, 26, 0.5)), noB(110, 16, 5), ground),
  'forv.känsliga-personuppgifter': all(idCard(46, 58, 1.8), heart_(70, 50), rect(66, 60, 10, 3, RED, 0, null), rect(69.5, 56.5, 3, 10, RED, 0, null), padlock(96, 92, 0.9, false, RED), ring(46, 58, 34, RED), ground),
  'forv.register': all(rect(24, 18, 72, 88, C.white, 2, C.ink, 1.6), ...[0, 1, 2, 3, 4].map((i) => all(circle(34, 30 + i * 17, 4.5, C.skin, C.ink, 0.9), line(`M44 ${30 + i * 17} L86 ${30 + i * 17}`, C.grey2, 2.4))), ground),
  'forv.registerutdrag': all(company(26, 86, 0.6), db(26, 40, 0.7), arrow(46, 52, 58, 52, HL, 2.2), rect(60, 24, 32, 46, C.white, 2, C.ink, 1.5), circle(68, 34, 3.5, C.skin, C.ink, 0.9), line('M74 34 L86 34 M66 44 L86 44 M66 52 L86 52 M66 60 L80 60', C.grey, 1.6), fig(100, C.orange, 'smile', { h: 0.62 }), ground),
  'forv.lagra': all(rect(56, 22, 50, 90, C.dark, 3, C.ink, 1.6), ...[0, 1, 2, 3].map((i) => all(rect(62, 30 + i * 20, 38, 14, '#5c6070', 2, C.ink, 1), circle(94, 37 + i * 20, 1.8, C.green, null))), idCard(24, 50, 0.7), arrow(38, 60, 54, 70, HL, 2.2), cal(26, 92, 0.6), ground),
  'forv.rätten-att-bli-bortglömd': all(idCard(30, 36, 0.9), curveArrow('M42 48 C54 60 60 70 62 80', 62, 80, 80, HL, 2.2), bin(66, 96, 1.2), fig(100, C.orange, 'smile', { h: 0.6 }), check(100, 30, 1), ground),
  'forv.kamerabevakning': all(rect(66, 12, 50, 100, '#e8dccb', 2, C.ink, 1.6), rect(78, 60, 26, 52, '#9ad0f0', 1, C.ink, 1.3), cctv(70, 30, 1.1), fig(32, C.orange, 'smile', { h: 0.8 }), ground),
  'forv.Integritetsskyddsmyndigheten': all(office(30, 88, 0.75, '#cfd8e2', true, shield(0, -4, 0.5, C.navy)), mag(64, 56, 1.1), company(92, 90, 0.55), db(96, 44, 0.5), ground),
  // ── Myndigheters serviceskyldighet ──
  'forv.serviceskyldighet': all(lawBook(106, 20, 0.5), fig(92, C.navy, 'smile', { h: 0.85 }), counter(64, 118, 82), reach(92, 0.85, -1, 70, 70), palm(68, 66, 0.9), fig(26, C.orange, 'smile', { h: 0.85 }), sb(26, 0.85, 1, 18, 18, (cx, cy) => q(cx, cy, 12)), check(62, 40, 1)),
  'forv.service.2': all(fig(92, C.navy, 'laugh', { h: 0.85 }), counter(60, 118, 82), bell(76, 82), fig(28, C.orange, 'smile', { h: 0.85 }), star(52, 22, 6), star(64, 14, 6), star(76, 22, 6)),
  'forv.tillgänglig': all(office(40, 90, 1, '#cfd8e2', true, rect(-5, 9, 10, 13, '#9ad0f0', 0.5, C.ink, 1)), ramp(26, 22), handset(88, 30, 1.2), envelope(96, 64, 0.7), okB(104, 92, 7), ground),
  'forv.hänvisa': all(office(18, 96, 0.6), fig(46, C.navy, 'smile', { h: 0.8 }), reach(46, 0.8, 1, 74, 40), palm(78, 36, 1), arrow(78, 66, 96, 66, HL, 2.4), office(102, 96, 0.6, '#d8e8c9'), fig(70, C.orange, 'smile', { h: 0.55 }), ground),
  'forv.vägledning': all(line('M8 108 C40 96 60 80 100 60', C.grey2, 8), fig(30, C.navy, 'smile', { h: 0.85 }), reach(30, 0.85, 1, 56, 52), palm(60, 48, 1), fig(82, C.orange, 'smile', { h: 0.65 }), arrow(92, 70, 106, 50, HL, 2.2), office(104, 28, 0.35), ground),
  'forv.begriplig': all(fig(76, C.orange, 'laugh', { h: 0.85 }), bulbOn(76, 14), doc(30, 62, 1.2, '', 3), arrow(48, 60, 60, 60, HL, 2.2), check(102, 30, 1)),
  'forv.klarspråk': all(greyed(doc(28, 50, 1.2, '', 5)), cross(28, 92, 1), doc(78, 50, 1.3, '', 3, C.navy), check(78, 92, 1.2), office(106, 18, 0.25)),
  'forv.utan-dröjsmål': all(office(22, 90, 0.6), watch(60, 30, 1.1), envelope(64, 78, 0.8), line('M32 72 L48 72 M28 80 L46 80 M32 88 L48 88', C.grey, 2), arrow(78, 78, 90, 78, HL, 2.6), fig(104, C.orange, 'smile', { h: 0.6 }), ground),
  'forv.handläggningstid': all(folder(18, 76, 0.6), decision(104, 74, 0.6, true), arrow(32, 76, 86, 76, HL, 2.6), cal(48, 36, 0.9, [0, 1, 2, 3, 4]), hourglass(84, 36, 1), ground),
  'forv.jäv': all(fig(32, C.navy, 'smile', { h: 0.85 }), fig(92, C.orange, 'smile', { h: 0.85 }), bond(62, 40), folder(62, 82, 0.7), noB(62, 18, 8), ground),
};
