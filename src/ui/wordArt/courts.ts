/**
 * Samhälle & institutioner → Juridik & rättsväsende → Domstolar & rättegång, 1431–1437 (0.31): district
 * and appeal courts, prosecutor and defence, injured party and defendant, prosecution and summons, the
 * main hearing, judgment and appeal, and the weighing of evidence. The people keep fixed colours in
 * every picture: the judge wears dark grey and sits second from the left on the bench (as in police.ts),
 * the three lay judges wear purple, light blue and mint, the prosecutor wears burgundy, the defence
 * lawyer dark teal, the defendant orange, the injured party green and a witness yellow; listeners are
 * grey. The bench carries a small balance (no gavels – Swedish and Japanese courts do not use them).
 * The three court levels are drawn as courthouses growing larger on three steps. No words in the
 * pictures; numerals and § only where they count or number things.
 */
import { C, all, arrow, circle, ellipse, g, heart, line, path, rect, star, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm } from './people';
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
/** The law book: thick, dark red, gold bands, § on the cover. */
const lawBook = (x: number, y: number, s = 1, col = BOOK, mark = true) => g(`translate(${x} ${y}) scale(${s})`, rect(-13, -16, 26, 32, col, 2, C.ink, 1.6), rect(-13, -16, 5, 32, '#5e1c1c', 1, null), line('M-6 -11 L9 -11 M-6 11 L9 11', C.gold, 2), mark ? T(1.5, 5, '§', 13, C.gold) : '', rect(11, -14, 3, 28, '#f3ead6', 0.5, C.ink, 0.8));
const mag = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 8, 'rgba(220,240,252,0.7)', C.ink, 2), line('M5.6 5.6 L12 12', C.ink, 3));
const pen = (x: number, y: number, s = 1, rot = 35) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-2, -14, 4, 22, C.navy, 1, C.ink, 1), path('M-2 8 L0 13 L2 8 Z', C.tan, C.ink, 0.8));
const cal = (x: number, y: number, s = 1, hi: number[] = [], col: string = HL) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -14, 28, 28, C.white, 2, C.ink, 1.4), rect(-14, -14, 28, 7, RED, 2, C.ink, 1.4), ...Array.from({ length: 9 }, (_, i) => rect(-11 + (i % 3) * 8, -4 + Math.floor(i / 3) * 6, 6, 4.4, hi.includes(i) ? col : C.grey2, 0.8, null)));
const hourglass = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M-8 -12 L8 -12 M-8 12 L8 12', C.brown, 2.4), path('M-6 -11 L6 -11 L1 0 L6 11 L-6 11 L-1 0 Z', 'rgba(220,240,252,0.7)', C.ink, 1.2), path('M-5 10 L5 10 L0 3 Z', C.tan, null));
const coins = (x: number, y: number, n = 3, r = 5) => all(...Array.from({ length: n }, (_, i) => ellipse(x, y - i * 3, r, r * 0.45, C.gold, C.ink, 1.1)));
const envelope = (x: number, y: number, s = 1, open = false) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -9, 28, 18, C.white, 2, C.ink, 1.5), open ? path('M-14 -9 L0 -20 L14 -9', C.white, C.ink, 1.5) : path('M-14 -9 L0 2 L14 -9', 'none', C.ink, 1.3));
const shield = (x: number, y: number, s = 1, col: string = C.navy, inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, path('M0 -16 L14 -11 C14 4 8 12 0 17 C-8 12 -14 4 -14 -11 Z', col, C.ink, 1.6), inner);
const cuffs = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(-7, 0, 6, 'none', C.silver, 3), circle(7, 0, 6, 'none', C.silver, 3), line('M-1 0 L1 0', C.grey, 3), circle(-7, 0, 6, 'none', C.ink, 0.8), circle(7, 0, 6, 'none', C.ink, 0.8));
/** Balance (scales); tilt > 0 lowers the right pan. */
const scales = (x: number, y: number, s = 1, tilt = 0, col: string = C.gold) => { const a = (tilt * Math.PI) / 180, dx = 18 * Math.cos(a), dy = 18 * Math.sin(a); const pan = (px: number, py: number) => all(line(`M${f1(px)} ${f1(py)} L${f1(px - 7)} ${f1(py + 10)} M${f1(px)} ${f1(py)} L${f1(px + 7)} ${f1(py + 10)}`, C.ink, 0.9), path(`M${f1(px - 9)} ${f1(py + 10)} C${f1(px - 7)} ${f1(py + 15)} ${f1(px + 7)} ${f1(py + 15)} ${f1(px + 9)} ${f1(py + 10)} Z`, col, C.ink, 1.2)); return g(`translate(${x} ${y}) scale(${s})`, line('M0 -12 L0 18 M-8 18 L8 18', C.ink, 2.2), line(`M${f1(-dx)} ${f1(-12 - dy)} L${f1(dx)} ${f1(-12 + dy)}`, C.ink, 2), circle(0, -13, 2.4, col, C.ink, 1), pan(-dx, -12 - dy), pan(dx, -12 + dy)); };

// ── Buildings and flags ──────────────────────────────────────────────
/** Swedish flag; (x, y) is the top-left corner. */
const flagSE = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(0, 0, 20, 13, '#2a6ebb', 0.5, C.ink, 1), rect(6, 0, 3.4, 13, '#f7cf2e', 0, null), rect(0, 4.8, 20, 3.4, '#f7cf2e', 0, null), rect(0, 0, 20, 13, 'none', 0.5, C.ink, 1));
const pole = (x: number, base: number, top: number, f: Svg) => all(line(`M${x} ${base} L${x} ${top}`, C.ink, 1.6), f);
/** Office building with rows of windows; a flag on the roof marks an authority. */
const office = (x: number, y: number, s = 1, col: string = '#cfd8e2', flag = true, sign: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-22, -30, 44, 52, col, 1.5, C.ink, 1.4), ...Array.from({ length: 12 }, (_, i) => rect(-17 + (i % 4) * 9.4, -25 + Math.floor(i / 4) * 11, 6, 7, '#9ad0f0', 0.5, C.ink, 0.6)), rect(-5, 9, 10, 13, C.brown, 0.5, C.ink, 1), sign, flag ? all(line('M14 -30 L14 -44', C.ink, 1.4), flagSE(14, -44, 0.55)) : '');
/** A company: a warm-coloured block with a sawtooth roof and no flag. */
const company = (x: number, y: number, s = 1, col: string = '#e9c27a') => g(`translate(${x} ${y}) scale(${s})`, path('M-22 -14 L-22 -26 L-11 -18 L-11 -26 L0 -18 L0 -26 L11 -18 L22 -18 L22 22 L-22 22 Z', col, C.ink, 1.4), ...[-14, -4, 6, 16].map((cx) => rect(cx - 3, -8, 6, 7, '#9ad0f0', 0.5, C.ink, 0.6)), rect(-5, 9, 10, 13, C.brown, 0.5, C.ink, 1), rect(12, 4, 6, 6, '#9ad0f0', 0.5, C.ink, 0.6));
/** A courthouse: columns and a balance on the pediment. */
const court = (x: number, y: number, s = 1, col: string = '#e8e2d4') => g(`translate(${x} ${y}) scale(${s})`, rect(-30, 14, 60, 6, C.grey2, 1, C.ink, 1.2), rect(-26, -8, 52, 22, col, 1, C.ink, 1.4), path('M-30 -8 L0 -26 L30 -8 Z', col, C.ink, 1.4), ...[-18, -6, 6, 18].map((cx) => rect(cx - 2.4, -6, 4.8, 20, C.white, 1, C.ink, 0.9)), scales(0, -14, 0.28));
/** A podium with steps of heights hs; `items` stand on the steps. */
const podium = (x: number, w: number, hs: number[], cols: string[]) => all(...hs.map((h, i) => rect(x + i * w, 112 - h, w, h, cols[i % cols.length]!, 1, C.ink, 1.4)));
const folder = (x: number, y: number, s = 1, col: string = '#e8c46a', inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, path('M-16 -12 L-6 -12 L-3 -9 L16 -9 L16 12 L-16 12 Z', col, C.ink, 1.4), inner);
const pad = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-10, -13, 20, 26, C.white, 1.5, C.ink, 1.2), ...[-7, -2, 3, 8].map((d) => line(`M-6 ${d} L6 ${d}`, C.grey2, 1)), line('M-7 -13 L-7 -16 M0 -13 L0 -16 M7 -13 L7 -16', C.ink, 1.4));
const sun = (x: number, y: number, r = 6) => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 5))} ${f1(y + Math.sin(a) * (r + 5))}`, C.gold, 1.6); }), circle(x, y, r, C.yellow, C.ink, 1.2));
/** A thumbs-up hand (no pointing finger). */
const thumbOk = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-4.4, -11, 4.4, 10, C.skin, 2.2, C.ink, 1.1), rect(-5, -3, 11, 10, C.skin, 3, C.ink, 1.1), line('M-0.6 0.4 L5.4 0.4 M-0.6 3.4 L5.4 3.4', C.ink, 0.8), rect(-8, -2.4, 3.2, 9, C.navy, 1, C.ink, 0.9));

// ── Courtroom roles and furniture ────────────────────────────────────
const JUDGE = C.dark;
const PROS = '#7a2b3a';
const ADV = '#2f6f6a';
const DEFN = C.orange;
const VICT = C.green;
const WIT = C.yellow;
const LAY = [C.purple, C.sky, C.mint];
const WALL = '#ece6da';
/** The judges' bench from x1 to x2 with its top at y and a small balance on the front. */
const bench = (x1: number, x2: number, y: number, h = 16) => all(rect(x1, y, x2 - x1, h, C.brown, 2, C.ink, 1.6), rect(x1 - 2, y - 3, x2 - x1 + 4, 4, '#7a4a2a', 1, C.ink, 1.2), scales((x1 + x2) / 2, y + h / 2 - 1, 0.24));
const PX = [27, 49, 71, 93];
/** The court: a lay judge, the judge (dark, second from left) and two more lay judges behind the bench. `grey` lists seats to grey out. */
const panel = (y = 40, grey: number[] = [], moods: ('smile' | 'frown' | 'flat')[] = []) => all(...PX.map((x, i) => { const m = mini(x, y, i === 1 ? JUDGE : LAY[i === 0 ? 0 : i - 1]!, moods[i] ?? 'flat'); return grey.includes(i) ? greyed(m) : m; }), bench(14, 106, y + 9));
/** A small table for the parties, top at y. */
const desk = (x: number, y: number, w: number) => all(rect(x - w / 2, y, w, 5, C.tan, 1.5, C.ink, 1.4), line(`M${x - w / 2 + 4} ${y + 5} L${x - w / 2 + 4} 112 M${x + w / 2 - 4} ${y + 5} L${x + w / 2 - 4} 112`, C.brown, 2.4));
/** A party seated behind a table (head-and-shoulders figure). */
const seat = (x: number, y: number, col: string, mood: 'smile' | 'frown' | 'flat' = 'flat', w = 24) => all(mini(x, y, col, mood), desk(x, y + 9, w));
/** The witness stand: a small lectern whose top is at y. */
const stand = (x: number, y = 88) => all(rect(x - 9, y, 18, 112 - y, C.brown, 1.5, C.ink, 1.4), rect(x - 11, y - 3, 22, 4, '#7a4a2a', 1, C.ink, 1.1));
/** Three courthouses on three steps: the district court, the court of appeal and the Supreme Court; `hi` is the one in colour. */
const levels = (hi: number) => { const b = [court(24, 103.6, 0.42), court(60, 88, 0.5), court(96, 72.4, 0.58)].map((c, i) => (i === hi ? c : greyed(c))); const r = [[24, 98, 17], [60, 80, 20], [96, 62, 23]][hi]!; return all(rect(39, 98, 42, 14, C.grey2, 1, C.ink, 1.2), rect(75, 84, 42, 28, C.grey2, 1, C.ink, 1.2), ...b, ring(r[0]!, r[1]!, r[2]!), ground); };
const briefcase = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-4 -8 L-4 -11 L4 -11 L4 -8', 'none', C.ink, 1.6), rect(-10, -8, 20, 14, C.brown, 2, C.ink, 1.4), line('M-10 -2 L10 -2', '#7a4a2a', 1.2));
const clock = (x: number, y: number, r = 8, h = 0) => { const a = (h / 12) * Math.PI * 2; return all(circle(x, y, r, C.white, C.ink, 1.5), line(`M${x} ${y} L${f1(x + Math.sin(a) * r * 0.55)} ${f1(y - Math.cos(a) * r * 0.55)} M${x} ${y} L${x} ${f1(y - r * 0.8)}`, C.ink, 1.5)); };
const pin = (x: number, y: number, s = 1, col: string = RED) => g(`translate(${x} ${y}) scale(${s})`, path('M0 8 C-6 0 -6 -3 -6 -4 C-6 -8 -3 -10 0 -10 C3 -10 6 -8 6 -4 C6 -3 6 0 0 8 Z', col, C.ink, 1.2), circle(0, -4, 2, C.white, null));
const fprint = (x: number, y: number, s = 1, col: string = C.ink) => g(`translate(${x} ${y}) scale(${s})`, ...[2.5, 5, 7.5, 10].map((r, i) => path(`M${-r * 0.8} ${r * 0.9} C${-r * 1.1} ${-r * 0.4} ${-r * 0.5} ${-r * 1.2} 0 ${-r * 1.2} C${r * 0.6} ${-r * 1.2} ${r * 1.1} ${-r * 0.4} ${r * 0.8} ${r * (i % 2 ? 0.6 : 1)}`, 'none', col, 1.2)));
const dna = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-5 -14 C5 -9 5 -5 -5 0 C-15 5 5 9 -5 14', 'none', C.denim, 2), path('M5 -14 C-5 -9 -5 -5 5 0 C15 5 -5 9 5 14', 'none', RED, 2), line('M-3 -10 L3 -10 M-4 -4 L4 -4 M-3 4 L3 4 M-4 10 L4 10', C.grey, 1.2));
const photo = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-11, -8, 22, 16, C.white, 1, C.ink, 1.3), rect(-9, -6, 18, 12, '#bfe3f5', 0.5, null), path('M-9 6 L-3 -1 L2 4 L5 1 L9 6 Z', '#3f8a55', null), circle(5, -3, 1.6, C.yellow, null));
const mobile = (x: number, y: number, s = 1, inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-7, -12, 14, 24, C.dark, 2.5, C.ink, 1.3), rect(-5.5, -9, 11, 17, '#bfe3f5', 1, null), inner);
const ebag = (x: number, y: number, s = 1, inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-10, -12, 20, 24, 'rgba(230,240,248,0.85)', 2, C.ink, 1.2), rect(-10, -12, 20, 4, RED, 1, C.ink, 0.8), inner);
const knife = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-2 -10 L2 -10 L2 2 L0 4 L-2 2 Z', C.silver, C.ink, 0.9), rect(-2.4, 2, 4.8, 7, C.brown, 1, C.ink, 0.9));
const seal = (x: number, y: number, r: number, col: string, inner: Svg = '') => all(circle(x, y, r, col, C.ink, 1.3), circle(x, y, r * 0.72, 'none', C.white, 1), inner);
const door2 = (x: number, y: number, w: number, h: number, open = false) => all(rect(x - w / 2 - 3, y - 3, w + 6, h + 3, '#7a4a2a', 1, C.ink, 1.4), open ? all(rect(x - w / 2, y, w, h, '#fff3c4', 0, null), path(`M${x - w / 2} ${y} L${x - w / 2 - 6} ${y + 4} L${x - w / 2 - 6} ${y + h + 2} L${x - w / 2} ${y + h} Z`, C.brown, C.ink, 1.2)) : all(rect(x - w / 2, y, w / 2, h, C.brown, 0.5, C.ink, 1.2), rect(x, y, w / 2, h, C.brown, 0.5, C.ink, 1.2), circle(x - 3, y + h / 2, 1.3, C.gold, null), circle(x + 3, y + h / 2, 1.3, C.gold, null)));
const fist = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-5, -4, 10, 8, C.skin, 3, C.ink, 1.1), line('M-2 -4 L-2 0 M1 -4 L1 0', C.ink, 0.7), path('M-5 -1 L-9 -1', 'none', C.ink, 1.2));
const drops = (x: number, y: number) => all(path(`M${x} ${y} c2 3 2 5 0 5 c-2 0 -2 -2 0 -5 Z`, '#8cc7e8', C.ink, 0.8), path(`M${x + 5} ${y + 4} c2 3 2 5 0 5 c-2 0 -2 -2 0 -5 Z`, '#8cc7e8', C.ink, 0.8));
const eye = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-10 0 C-5 -7 5 -7 10 0 C5 7 -5 7 -10 0 Z', C.white, C.ink, 1.4), circle(0, 0, 3.4, C.navy, null), circle(1, -1, 1, C.white, null));
const plasterM = (x: number, y: number) => g(`translate(${x} ${y}) rotate(-25)`, rect(-4, -1.6, 8, 3.2, C.beige, 1.4, C.ink, 0.8));
const screen = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x - w / 2, y - h / 2, w, h, C.dark, 2, C.ink, 1.6), rect(x - w / 2 + 3, y - h / 2 + 3, w - 6, h - 6, '#cfe8f5', 1, null), inner);
const laptop = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-10 -12 L10 -12 L10 0 L-10 0 Z', C.grey, C.ink, 1.2), rect(-8, -10, 16, 8, '#cfe8f5', 0.5, null), line('M-6 -8 L5 -8 M-6 -5 L3 -5', C.navy, 0.9), path('M-13 0 L13 0 L15 3 L-15 3 Z', C.grey2, C.ink, 1.1));
const gauge = (x: number, y: number, w: number, h: number, lvl: number, col: string, mark: number) => all(rect(x, y, w, h, C.white, 2, C.ink, 1.4), rect(x + 2, +f1(y + h - 2 - (h - 4) * lvl), w - 4, +f1((h - 4) * lvl), col, 1, null), line(`M${x - 4} ${f1(y + h - 2 - (h - 4) * mark)} L${x + w + 4} ${f1(y + h - 2 - (h - 4) * mark)}`, C.ink, 1.6, '3 2'));
const rule = (x: number, y: number, w: number, col: string = C.grey) => line(`M${x} ${y} L${x + w} ${y}`, col, 1.6);

export const COURT_MOTIFS: Record<string, Svg> = {
  // ── 1431 Tingsrätt och hovrätt ──
  'domst.rättegång': all(rect(4, 6, 112, 106, WALL, 2, null), panel(28), seat(22, 80, PROS, 'flat', 30), seat(82, 80, ADV, 'flat', 44), mini(102, 80, DEFN, 'frown'), stand(52, 92), mini(52, 84, WIT, 'flat', 0.9)),
  'domst.rättssal': all(rect(4, 6, 112, 106, WALL, 2, null), rect(4, 6, 112, 8, '#d8cfbe', 2, null), panel(30), seat(20, 70, PROS, 'flat', 28), seat(100, 70, DEFN, 'frown', 28), line('M6 96 L114 96', C.brown, 3), ...[16, 36, 56, 76, 96].map((x) => greyed(mini(x, 100, C.grey, 'flat', 0.75)))),
  'domst.pröva': all(bench(8, 112, 74, 20), mini(30, 64, JUDGE, 'flat', 1.15), doc(70, 62, 0.62), mag(84, 64, 1.1), q(66, 26, 16), arrow(76, 26, 90, 26, HL, 2.4), okB(102, 26, 9), ground),
  'domst.mål.2': all(bench(8, 112, 76, 20), mini(28, 66, JUDGE, 'flat', 1.15), greyed(rect(58, 58, 44, 14, '#e8c46a', 2, C.ink, 1.2)), greyed(rect(60, 50, 44, 10, '#e8c46a', 2, C.ink, 1.2)), path('M54 22 L68 22 L72 27 L102 27 L102 50 L54 50 Z', '#e8c46a', C.ink, 1.5), scales(78, 36, 0.36), ring(78, 36, 20, HL), ground),
  'domst.brottmål': all(path('M14 30 L34 30 L40 36 L66 36 L66 84 L14 84 Z', '#e8c46a', C.ink, 1.6), cuffs(40, 62, 1.2), greyed(path('M74 44 L88 44 L92 49 L110 49 L110 84 L74 84 Z', '#e8c46a', C.ink, 1.4), coins(92, 74, 3, 6)), bench(10, 110, 92, 20)),
  'domst.dom': all(doc(60, 52, 2.0, all(scales(0, -12, 0.3), seal(8, 11, 5, C.gold, check(8, 11, 0.4, C.white))), 0), greyed(mini(18, 92, JUDGE)), rect(4, 100, 30, 12, C.brown, 1, C.ink, 1.2)),
  'domst.rätt.3': all(rect(4, 6, 112, 106, WALL, 2, null), panel(50), ellipse(60, 56, 54, 26, 'rgba(228,87,46,0.10)', HL, 2.4), greyed(mini(34, 100, C.grey, 'flat', 0.8)), greyed(mini(86, 100, C.grey, 'flat', 0.8))),
  'domst.tingsrätt': levels(0),
  'domst.hovrätt': levels(1),
  'domst.Högsta-domstolen': levels(2),
  'domst.instans': all(podium(18, 28, [22, 44, 66], [C.grey2, '#f3d9a4', C.grey2]), num(32, 98, '1', 12), num(60, 80, '2', 12), num(88, 58, '3', 12), folder(60, 56, 0.9), curveArrow('M30 82 C34 60 46 52 52 54', 52, 54, 10, HL, 2.2), ring(60, 56, 16, HL), ground),
  'domst.allmän-domstol': all(ellipse(48, 74, 44, 34, 'rgba(242,193,78,0.16)', HL, 2), court(22, 96, 0.36), court(48, 80, 0.44), court(74, 64, 0.52), greyed(office(102, 82, 0.5, '#cfd8e2', false)), line('M88 112 L116 112', C.grey2, 2), ground),
  'domst.nämndeman': all(rect(4, 6, 112, 106, WALL, 2, null), panel(48, [1, 2, 3]), ring(27, 46, 17, HL), greyed(lawBook(49, 28, 0.5)), mini(27, 98, LAY[0]!, 'smile', 0.9), arrow(27, 80, 27, 68, HL, 2.2)),
  'domst.lekman': all(greyed(fig(24, C.dark, 'calm', { h: 0.86 }), reach(24, 0.86, 1, 42, 66), lawBook(48, 66, 0.55)), fig(86, C.green, 'smile', { h: 0.86 }), sb(86, 0.86, -1, 26, 22, (cx, cy) => all(lawBook(cx - 4, cy, 0.38), q(cx + 7, cy, 11))), ground),
  'domst.jävig': all(bench(8, 70, 66, 22), mini(38, 56, JUDGE, 'flat', 1.2), fig(96, DEFN, 'smile', { h: 0.78 }), line('M50 44 L84 44', C.ink, 1.6, '3 3'), heart(68, 44, 7), noB(38, 30, 9), ground),

  // ── 1432 Åklagare och försvarare ──
  'domst.åklagare': all(pole(12, 112, 18, flagSE(12, 18, 0.8)), fig(38, PROS, 'calm', { h: 0.92 }), reach(38, 0.92, 1, 60, 62), doc(66, 60, 0.7, para(0, 4, 14), 3), arrow(80, 60, 92, 70, HL, 2.2), seat(100, 82, DEFN, 'frown', 24), ground),
  'domst.advokat': all(fig(48, ADV, 'smile', { h: 0.96 }), circle(56, 54, 3, C.gold, C.ink, 0.8), reach(48, 0.96, 1, 74, 88), briefcase(76, 98, 1.2), lawBook(24, 98, 0.5), scales(92, 28, 0.6), ground),
  'domst.försvarsadvokat': all(doc(16, 44, 0.6, para(0, 4, 12), 3), arrow(26, 50, 40, 54, RED, 2.4), fig(64, ADV, 'calm', { h: 0.9 }), reach(64, 0.9, -1, 46, 56), palm(46, 54, 1.1), fig(98, DEFN, 'frown', { h: 0.74 }), ground),
  'domst.advokatbyrå': all(company(60, 82, 1.3, '#d9cdb5'), rect(42, 26, 36, 14, C.white, 2, C.ink, 1.2), scales(52, 33, 0.26), briefcase(68, 36, 0.55), ground),
  'domst.klient': all(mini(30, 66, ADV, 'flat', 1.15), mini(90, 66, C.orange, 'frown', 1.15), desk(60, 78, 104), pad(42, 72, 0.55), say(60, 34, 22, 16, 82, 54, q(60, 34, 11)), ring(90, 66, 20, HL)),
  'domst.offentlig-försvarare': all(court(26, 44, 0.55), arrow(46, 50, 60, 60, HL, 2.2), fig(74, ADV, 'smile', { h: 0.84 }), fig(102, DEFN, 'calm', { h: 0.7 }), flagSE(6, 84, 0.8), coins(30, 104, 3, 6), arrow(40, 98, 56, 94, C.gold, 2), ground),
  'domst.förordna': all(fig(24, JUDGE, 'calm', { h: 0.92 }), reach(24, 0.92, 1, 52, 60), doc(60, 58, 0.62, star(0, -2, 5, C.gold), 2), fig(96, ADV, 'smile', { h: 0.88 }), reach(96, 0.88, -1, 68, 60), scales(24, 18, 0.45), ground),
  'domst.företräda.2': all(bench(78, 114, 60, 52), mini(96, 50, JUDGE, 'flat'), fig(54, ADV, 'calm', { h: 0.9 }), sb(54, 0.9, 1, 18, 14, (cx, cy) => lines(cx, cy - 3, 10, 2, C.navy)), fig(18, C.orange, 'calm', { h: 0.74 }), line('M28 70 L40 70', HL, 2, '3 2'), arrow(36, 70, 42, 70, HL, 2)),
  'domst.yrka': all(bench(70, 114, 58, 54), mini(92, 48, JUDGE, 'flat'), fig(40, PROS, 'calm', { h: 0.9 }), reach(40, 0.9, 1, 60, 44), palm(60, 40, 1), sb(40, 0.9, -1, 22, 20, (cx, cy) => all(doc(cx - 3, cy, 0.38), ex(cx + 6, cy, 13))), ground),
  'domst.yrkande.2': all(doc(34, 58, 1.4, ex(0, 2, 18), 2), arrow(56, 58, 70, 58, HL, 2.6), bench(72, 114, 64, 48), mini(93, 54, JUDGE, 'flat'), ground),

  // ── 1433 Målsägande och tilltalad ──
  'domst.målsägande': all(rect(4, 6, 112, 106, WALL, 2, null), panel(28, [0, 1, 2, 3]), mini(16, 80, PROS), mini(40, 80, VICT, 'frown'), plasterM(43, 74), desk(28, 89, 48), ring(40, 78, 15, HL), greyed(seat(96, 80, DEFN, 'flat', 30))),
  'domst.tilltalad': all(rect(4, 6, 112, 106, WALL, 2, null), panel(28, [0, 1, 2, 3]), greyed(seat(24, 80, PROS, 'flat', 32)), mini(80, 80, ADV), mini(102, 80, DEFN, 'frown'), desk(91, 89, 42), ring(102, 78, 14, HL), arrow(40, 72, 88, 72, HL, 1.8)),
  'domst.oskuldspresumtion': all(bench(62, 114, 34, 16), greyed(mini(88, 24, JUDGE)), q(104, 12, 12), fig(36, DEFN, 'calm', { h: 0.86 }), shield(36, 70, 0.95, C.green, check(0, 0, 0.6, C.white)), hourglass(90, 88, 1.3), ground),
  'domst.målsägandebiträde': all(fig(40, ADV, 'smile', { h: 0.92 }), reach(40, 0.92, 1, 67, 58), fig(78, VICT, 'frown', { h: 0.78 }), plasterM(82, 32), ground),
  'domst.vittnesstöd': all(door2(98, 46, 26, 66), rect(88, 30, 20, 10, C.white, 1, C.ink, 1), scales(98, 35, 0.2), rect(8, 86, 72, 6, C.tan, 2, C.ink, 1.4), line('M14 92 L14 112 M74 92 L74 112', C.brown, 3), mini(28, 76, WIT, 'frown'), drops(18, 64), mini(56, 76, C.pink, 'smile'), heart(42, 56, 6)),
  'domst.förneka': all(fig(36, DEFN, 'angry', { h: 0.9 }), sb(36, 0.9, 1, 34, 26, (cx, cy) => all(fist(cx - 6, cy, 1.1), mini(cx + 8, cy - 2, C.grey, 'frown', 0.5), cross(cx, cy, 1.3))), greyed(doc(96, 84, 0.8, para(0, 4, 12), 3)), ground),
  'domst.inställa-sig': all(fig(26, C.green, 'calm', { h: 0.8 }), reach(26, 0.8, 1, 42, 70), envelope(48, 70, 0.6), arrow(56, 84, 70, 84, HL, 2.4), court(92, 80, 0.62), clock(92, 34, 7, 9), ground),
  'domst.utebli': all(rect(4, 6, 112, 106, WALL, 2, null), stand(60, 86), path('M48 62 C48 44 72 44 72 62 L72 80 L48 80 Z', 'none', C.grey, 1.6), circle(60, 44, 9, 'none', C.grey, 1.6), clock(20, 30, 9, 3), noB(96, 30, 10), greyed(bench(8, 112, 98, 14))),
  'domst.videolänk': all(rect(4, 6, 112, 106, WALL, 2, null), screen(60, 42, 64, 44, mini(60, 46, WIT, 'smile', 1.2)), line('M60 64 L60 84 M50 84 L70 84', C.ink, 2), rect(86, 70, 10, 7, C.dark, 1.5, C.ink, 1), circle(84, 73.5, 2.4, C.grey, C.ink, 0.8), panel(92, [], ['flat', 'flat', 'flat', 'flat'])),

  // ── 1434 Åtal och stämning ──
  'domst.åtal': all(doc(42, 58, 1.6, all(rule(-9, -12, 18, C.ink), para(-6, 4, 12), seal(6, 10, 5, PROS)), 0), arrow(70, 58, 82, 58, HL, 2.4), court(96, 66, 0.4), ground),
  'domst.åtala': all(fig(22, PROS, 'calm', { h: 0.88 }), reach(22, 0.88, 1, 42, 60), doc(48, 58, 0.55, para(0, 4, 12), 3), arrow(58, 58, 74, 64, HL, 2.6), court(94, 38, 0.46), fig(94, DEFN, 'frown', { h: 0.62 }), ground),
  'domst.väcka-åtal': all(fig(20, PROS, 'calm', { h: 0.84 }), reach(20, 0.84, 1, 40, 64), envelope(48, 64, 0.65), arrow(58, 64, 72, 64, HL, 2.4), court(92, 70, 0.62), rect(86, 82, 12, 4, C.dark, 1, null), ground),
  'domst.åtalsplikt': all(scales(36, 60, 1.5, 22), doc(55, 66, 0.4), fprint(64, 62, 0.6), photo(58, 54, 0.5), arrow(66, 30, 84, 30, HL, 2.6), ex(76, 18, 14), court(98, 46, 0.42), greyed(mini(22, 100, PROS, 'flat', 0.9)), ground),
  'domst.tillräckliga-skäl': all(gauge(22, 22, 24, 84, 0.84, HL, 0.66), doc(74, 76, 0.7), photo(86, 52, 0.7), fprint(70, 40, 0.7), okB(98, 26, 10), ground),
  'domst.åtalsunderlåtelse': all(fig(28, PROS, 'calm', { h: 0.9 }), reach(28, 0.9, 1, 50, 62), doc(54, 60, 0.5, circle(0, 4, 3, C.grey, C.ink, 0.8), 3), line('M64 60 L86 60', C.grey, 2.4), cross(76, 60, 1.2), greyed(court(98, 72, 0.42)), ground),
  'domst.gärningsbeskrivning': all(doc(60, 58, 2.2, all(clock(-6, -11, 3.6, 8), pin(-6, 0, 0.42), mini(-6, 10, DEFN, 'frown', 0.32), ...[-11, 0, 10].map((y) => rule(-1, y, 10))), 0)),
  'domst.åtalspunkt': all(doc(54, 58, 2.2, all(...[-11, 0, 11].map((y, i) => all(num(-8, y, String(i + 1), 6), rule(-4, y, 13, i === 1 ? HL : C.grey))), rect(-12, -3.4, 25, 7, 'rgba(228,87,46,0.18)', 1, null)), 0), ring(54, 58, 22, HL)),
  'domst.stämning': all(court(26, 54, 0.6), line('M44 46 C58 26 70 30 76 40', HL, 2, '3 3'), envelope(84, 48, 1.1), seal(92, 54, 4.6, RED, scales(92, 55, 0.16)), fig(92, DEFN, 'shock', { h: 0.5 }), ground),
  'domst.frist': all(cal(44, 56, 2.2, [1, 2, 3, 4, 5, 6, 7], HL), hourglass(96, 56, 1.6), ground),
  'domst.bestrida': all(fig(32, DEFN, 'calm', { h: 0.9 }), reach(32, 0.9, 1, 54, 50), palm(56, 46, 1.2), doc(90, 52, 1.1, coins(0, 6, 3, 5), 2), cross(90, 30, 1.4), ground),
  'domst.strafföreläggande': all(doc(36, 58, 1.7, all(coins(0, -2, 3, 5), line('M-9 12 L9 12', C.ink, 1), path('M-8 10 C-5 4 -3 12 0 7 C2 4 4 10 7 8', 'none', C.navy, 1.4)), 2), pen(56, 70, 1, 30), okB(36, 18, 8), greyed(court(92, 76, 0.5)), cross(92, 66, 1.8), ground),

  // ── 1435 Huvudförhandling ──
  'domst.huvudförhandling': all(rect(4, 6, 112, 106, WALL, 2, null), panel(26), mini(14, 76, PROS), mini(34, 76, VICT), desk(24, 85, 38), mini(86, 76, ADV), mini(106, 76, DEFN, 'frown'), desk(96, 85, 36), stand(60, 92), mini(60, 82, WIT, 'flat', 0.9), say(60, 58, 16, 12, 60, 72, lines(60, 56, 8, 2, C.navy))),
  'domst.inför-stängda-dörrar': all(rect(40, 10, 76, 102, WALL, 2, null), door2(78, 38, 34, 74), rect(66, 22, 24, 12, C.white, 1, C.ink, 1), scales(78, 28, 0.24), line('M58 64 L98 64', RED, 3), ...[16, 34].map((x) => greyed(fig(x, C.grey, 'frown', { h: 0.62 }))), ground),
  'domst.sakframställning': all(bench(70, 114, 52, 60), mini(92, 42, JUDGE, 'flat'), fig(30, PROS, 'calm', { h: 0.84 }), sb(30, 0.84, 1, 40, 22, (cx, cy) => all(num(cx - 13, cy, '1', 9), arrow(cx - 8, cy, cx - 3, cy, HL, 1.6), num(cx, cy, '2', 9), arrow(cx + 5, cy, cx + 10, cy, HL, 1.6), num(cx + 14, cy, '3', 9))), doc(58, 98, 0.55), ground),
  'domst.avlägga-ed': all(rect(4, 6, 112, 106, WALL, 2, null), greyed(bench(10, 110, 28, 14)), greyed(mini(49, 18, JUDGE, 'flat', 0.8)), fig(60, WIT, 'calm', { h: 0.86 }), reach(60, 0.86, 1, 82, 40), palm(82, 36, 1.2), stand(60, 94)),
  'domst.vittnesmål': all(stand(40, 90), fig(40, WIT, 'calm', { h: 0.8 }), sb(40, 0.8, 1, 46, 32, (cx, cy) => all(eye(cx - 12, cy, 0.7), mini(cx + 4, cy + 2, C.grey, 'flat', 0.5), fist(cx + 14, cy - 2, 0.8), mini(cx + 20, cy + 4, C.grey, 'frown', 0.4)))),
  'domst.huvudförhör': all(stand(60, 92), mini(60, 82, WIT, 'flat'), mini(18, 82, ADV), desk(18, 91, 26), say(30, 50, 18, 16, 22, 70, q(30, 50, 12)), num(18, 104, '1', 10), line('M30 84 L48 84', ADV, 1.8, '3 2'), greyed(seat(102, 82, PROS, 'flat', 26)), ground),
  'domst.motförhör': all(stand(60, 92), mini(60, 82, WIT, 'frown'), drops(70, 68), greyed(seat(18, 82, ADV, 'flat', 26)), mini(102, 82, PROS), desk(102, 91, 26), say(90, 50, 18, 16, 98, 70, q(90, 50, 12)), num(102, 104, '2', 10), arrow(88, 82, 74, 82, HL, 1.8), ground),
  'domst.yttra-sig': all(greyed(bench(60, 114, 54, 58)), greyed(mini(86, 44, JUDGE)), fig(36, DEFN, 'calm', { h: 0.84 }), sb(36, 0.84, 1, 26, 18, (cx, cy) => lines(cx, cy - 4, 16, 3, C.navy)), desk(36, 92, 40)),
  'domst.protokollförare': all(rect(4, 6, 112, 106, WALL, 2, null), greyed(mini(30, 40, JUDGE)), greyed(bench(8, 52, 49, 16)), mini(84, 66, C.denim, 'flat', 1.1), desk(84, 78, 52), laptop(84, 76, 1.1), ring(84, 66, 20, HL), doc(30, 92, 0.7)),
  'domst.slutanförande': all(bench(74, 114, 52, 60), mini(94, 42, JUDGE, 'flat'), fig(36, ADV, 'calm', { h: 0.86 }), sb(36, 0.86, 1, 28, 26, (cx, cy) => all(...[-6, 0, 6].map((d) => all(check(cx - 7, cy + d, 0.35), rule(cx - 3, cy + d, 11)))), 2), ...[14, 22, 30].map((x, i) => circle(x, 104, 3, i === 2 ? HL : C.grey2, C.ink, 0.8)), ground),

  // ── 1436 Dom och överklagande ──
  'domst.överläggning': all(rect(4, 6, 112, 106, WALL, 2, C.ink, 1.6), mini(32, 56, LAY[0]!), mini(60, 50, JUDGE), mini(88, 56, LAY[1]!), mini(60, 82, LAY[2]!, 'flat', 0.9), ellipse(60, 74, 40, 10, C.tan, C.ink, 1.4), doc(48, 72, 0.3), doc(72, 72, 0.3), say(22, 26, 18, 12, 28, 46, lines(22, 24, 9, 2, C.navy)), say(98, 26, 18, 12, 92, 46, lines(98, 24, 9, 2, C.navy)), door2(104, 82, 12, 30)),
  'domst.skiljaktig': all(panel(56, [], ['smile', 'smile', 'smile', 'frown']), ...[27, 49, 71].map((x) => check(x, 30, 0.8)), cross(93, 30, 1.2), ring(93, 54, 16, HL), ground),
  'domst.domslut': all(doc(56, 58, 2.3, all(rect(-12, -16, 24, 11, 'rgba(228,87,46,0.22)', 1, null), scales(-6, -11, 0.18), check(6, -11, 0.45)), 0), ring(56, 30, 18, HL)),
  'domst.domskäl': all(doc(52, 58, 2.3, all(rect(-12, -16, 24, 8, C.grey2, 1, null), rect(-12, -2, 24, 18, 'rgba(228,87,46,0.18)', 1, null)), 0), mag(92, 76, 1.4)),
  'domst.fälla': all(bench(10, 110, 40, 16), mini(49, 30, JUDGE), arrow(60, 60, 60, 74, RED, 3.4), fig(60, DEFN, 'frown', { h: 0.42 }), cuffs(88, 100, 1), ground),
  'domst.fria.2': all(court(30, 72, 0.9), door2(30, 74, 14, 18, true), fig(76, DEFN, 'laugh', { h: 0.82 }), arrow(92, 80, 108, 80, C.green, 2.6), sun(102, 24, 7), ground),
  'domst.frikänna': all(bench(10, 110, 40, 16), mini(49, 30, JUDGE, 'smile'), fig(60, DEFN, 'laugh', { h: 0.48 }), okB(86, 70, 10), ground),
  'domst.fällande-dom': all(doc(54, 58, 2.2, all(scales(0, -9, 0.26), seal(0, 9, 6, RED)), 0), cuffs(100, 96, 1)),
  'domst.friande-dom': all(doc(54, 58, 2.2, all(scales(0, -9, 0.26), seal(0, 9, 6, C.green, check(0, 9, 0.5, C.white))), 0), door2(100, 84, 14, 26, true)),
  'domst.överklagande': all(greyed(court(26, 96, 0.5)), court(92, 54, 0.7), doc(54, 72, 0.6), curveArrow('M34 78 C40 50 60 40 74 46', 74, 46, 20, HL, 2.6), rect(70, 68, 44, 44, C.grey2, 1, C.ink, 1.2), ground),
  'domst.prövningstillstånd': all(court(80, 38, 0.6), rect(52, 60, 56, 6, C.grey, 1, C.ink, 1.2), rect(70, 56, 20, 14, C.green, 1, C.ink, 1.2), doc(80, 86, 0.5), arrow(80, 76, 80, 70, C.green, 2), greyed(doc(24, 86, 0.5)), greyed(doc(42, 92, 0.5)), cross(30, 64, 1.2), ground),
  'domst.nöja-sig': all(fig(40, DEFN, 'calm', { h: 0.86 }), reach(40, 0.86, 1, 62, 70), doc(66, 70, 0.55), greyed(court(98, 34, 0.42)), line('M70 54 L88 42', C.grey, 2, '3 3'), cross(80, 48, 1.1), thumbOk(86, 92), ground),

  // ── 1437 Bevisvärdering ──
  'domst.bevisning': all(ellipse(60, 64, 50, 40, 'rgba(242,193,78,0.16)', HL, 2), doc(36, 50, 0.8), photo(70, 42, 1.1), fprint(40, 86, 1.1), ebag(80, 82, 1.1, knife(0, 2, 0.9, 30)), mobile(58, 70, 0.8)),
  'domst.bevisvärdering': all(scales(60, 60, 2.2, -10), photo(25, 54, 0.8), fprint(98, 66, 0.7), mag(92, 26, 1)),
  'domst.fri-bevisprövning': all(greyed(lawBook(20, 30, 0.6)), cross(20, 30, 1.4), scales(66, 46, 1.4), doc(30, 92, 0.6), photo(58, 96, 0.7), fprint(86, 96, 0.7), mobile(108, 94, 0.6), ground),
  'domst.bevisvärde': all(...[[24, 0.9, photo(24, 100, 0.8)], [60, 0.55, doc(60, 100, 0.5)], [96, 0.2, say(96, 100, 18, 12, 88, 108, q(96, 100, 8))]].map(([x, v, ic]) => all(rect((x as number) - 8, 88 - 70 * (v as number), 16, 70 * (v as number), (v as number) > 0.5 ? HL : C.grey2, 1, C.ink, 1.2), ic as Svg)), line('M8 88 L112 88', C.ink, 1.4)),
  'domst.bevisbörda': all(rect(6, 46, 28, 26, C.tan, 2, C.ink, 1.6), doc(14, 59, 0.36), fprint(26, 59, 0.5), fig(44, PROS, 'frown', { h: 0.86 }), reach(44, 0.86, -1, 30, 56), drops(60, 30), fig(92, DEFN, 'calm', { h: 0.8 }), ground),
  'domst.utom-rimligt-tvivel': all(gauge(20, 18, 26, 88, 0.97, C.green, 0.9), check(80, 56, 2.4), greyed(q(102, 98, 10)), cross(102, 98, 0.9), ground),
  'domst.tillförlitlig': all(doc(36, 58, 1.6, check(0, 10, 0.7), 4), eye(36, 22, 1.1), greyed(doc(92, 62, 1.2, q(0, 6, 14), 4)), ellipse(92, 30, 16, 6, C.grey2, null)),
  'domst.stödbevisning': all(say(60, 34, 60, 26, 60, 60, lines(60, 30, 40, 2, C.navy)), rect(20, 66, 10, 30, C.grey2, 1, C.ink, 1.2), rect(90, 66, 10, 30, C.grey2, 1, C.ink, 1.2), mobile(25, 58, 0.6), doc(95, 58, 0.45), line('M30 66 L40 47 M90 66 L80 47', C.ink, 1.4), ground),
  'domst.teknisk-bevisning': all(fprint(30, 46, 1.8), dna(84, 46, 1.4), mag(52, 84, 1.3), ebag(92, 92, 0.8, knife(0, 2, 0.8, 20))),
  'domst.sakkunnig': all(fig(36, C.white, 'calm', { h: 0.92 }), line(`M30 ${f1(geo(36, 0.92).sy + 4)} L30 ${f1(geo(36, 0.92).sy + 30)}`, C.grey, 1), reach(36, 0.92, 1, 60, 42), palm(60, 40, 1), rect(64, 18, 46, 34, C.white, 2, C.ink, 1.4), ...[0, 1, 2].map((i) => rect(70 + i * 12, 44 - (i + 1) * 7, 8, (i + 1) * 7, [C.sky, C.denim, HL][i]!, 1, C.ink, 0.8)), greyed(mini(92, 90, JUDGE)), ground),
  'domst.rättsintyg': all(doc(54, 58, 2.3, all(circle(-4, -10, 3, 'none', C.ink, 0.8), line('M-4 -7 L-4 4 M-9 -3 L1 -3 M-4 4 L-8 12 M-4 4 L0 12', C.ink, 0.8), circle(-7, -2, 1.2, C.purple, null), circle(-2, 7, 1.2, C.purple, null), rule(4, -6, 6), rule(4, 0, 6), rule(4, 6, 6)), 0), path('M94 28 C86 40 86 56 96 62 C106 56 106 40 98 28', 'none', C.ink, 2), circle(96, 66, 5, C.silver, C.ink, 1.4)),
  'domst.samlad-bedömning': all(photo(20, 26, 0.8), doc(20, 92, 0.5), fprint(100, 24, 0.8), mobile(100, 92, 0.7), arrow(32, 34, 48, 50, HL, 2), arrow(30, 84, 48, 70, HL, 2), arrow(90, 32, 72, 50, HL, 2), arrow(90, 84, 72, 70, HL, 2), okB(60, 60, 14)),
};
