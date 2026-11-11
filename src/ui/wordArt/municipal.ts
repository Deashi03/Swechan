/**
 * Samhälle & institutioner → Politik & demokrati → Kommuner & regioner, 1331–1337 (0.30): the
 * municipal council, the executive board and committees, the regions, tax-funded services, local
 * decisions, citizens' proposals and local self-government. A kommun is always a green map piece
 * or a green badge with a little house; a region is blue with a white cross; the state is a
 * building with columns and the Swedish flag. Parties are plain colours. No text names a word.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, star, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm } from './people';
import { P as F, type Mood, greyed, sepia, coin } from './blindFix';
import { checkIcon } from './labelIcons';
import { cal } from './time';
import { win, door, tree } from './homeKit';

// ── Geometry and figures ─────────────────────────────────────────────
const RED = '#e8302c';
const f1 = (n: number) => n.toFixed(1);
const ground = line('M4 112 L116 112', C.grey2, 2);
/** Head and shoulder positions of a standing figure at x with height factor h. */
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, hy: ty - 56 * s, hr: 10 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const hnd = (x: number, y: number, r = 3) => circle(x, y, r, C.skin, C.ink, 1.2);
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), hnd(tx, ty, 3 * Math.max(0.7, h))); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Small head-and-shoulders person (for crowds and people at a table). */
const mini = (x: number, y: number, col: string, mood: 'smile' | 'frown' | 'flat' = 'smile', s = 1, long = false) => g(`translate(${x} ${y}) scale(${s})`, long ? path('M-8 -6 C-9 6 9 6 8 -6 Z', C.hair, null) : '', path('M-10 16 C-10 4 10 4 10 16 Z', col, C.ink, 1.4), circle(0, -6, 7.5, C.skin, C.ink, 1.4), path('M-7.5 -8 C-7.5 -16 7.5 -16 7.5 -8 C4 -11 -4 -11 -7.5 -8 Z', C.hair, null),
  circle(-2.6, -6, 1, C.ink, null), circle(2.6, -6, 1, C.ink, null),
  mood === 'smile' ? path('M-2.6 -2.6 Q0 -0.6 2.6 -2.6', 'none', C.ink, 1.1) : mood === 'flat' ? line('M-2.4 -2 L2.4 -2', C.ink, 1.1) : path('M-2.6 -1.4 Q0 -3.4 2.6 -1.4', 'none', C.ink, 1.1));
/** Speech bubble centred on (cx, cy) whose tail points to (tx, ty). */
const say = (cx: number, cy: number, w: number, h: number, tx: number, ty: number, inner: Svg = '', fill: string = C.white) => {
  const L = cx - w / 2, R = cx + w / 2, Tp = cy - h / 2, B = cy + h / 2;
  let a: number[], b: number[];
  if (tx < L || tx > R) { const e = tx < L ? L : R, by = Math.max(Tp + 6, Math.min(B - 6, ty)); a = [e, by - 4.5]; b = [e, by + 4.5]; }
  else { const e = ty > cy ? B : Tp, bx = Math.max(L + 7, Math.min(R - 7, tx)); a = [bx - 5, e]; b = [bx + 5, e]; }
  return all(path(`M${a[0]} ${a[1]} L${tx} ${ty} L${b[0]} ${b[1]} Z`, fill, C.ink, 1.5), rect(L, Tp, w, h, fill, 6, C.ink, 1.5), path(`M${a[0]} ${a[1]} L${tx} ${ty} L${b[0]} ${b[1]} Z`, fill, null), inner);
};

// ── Marks ────────────────────────────────────────────────────────────
const check = (x: number, y: number, s = 1, col: string = C.green) => checkIcon(x, y, s, col);
const cross = (x: number, y: number, s = 1, col: string = RED) => line(`M${x - 5 * s} ${y - 5 * s} L${x + 5 * s} ${y + 5 * s} M${x + 5 * s} ${y - 5 * s} L${x - 5 * s} ${y + 5 * s}`, col, 2.4 * s);
const okB = (x: number, y: number, r = 8) => all(circle(x, y, r, C.green, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, r * 0.22));
const noB = (x: number, y: number, r = 8) => all(circle(x, y, r, RED, C.ink, 1.2), line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, C.white, r * 0.22));
const thumb = (x: number, y: number, s = 1, down = false) => g(`translate(${x} ${y}) scale(${s} ${down ? -s : s})`, rect(-4.4, -11, 4.4, 10, C.skin, 2.2, C.ink, 1.1), rect(-5, -3, 11, 10, C.skin, 3, C.ink, 1.1), line('M-0.6 0.4 L5.4 0.4 M-0.6 3.4 L5.4 3.4', C.ink, 0.8), rect(-8, -2.4, 3.2, 9, C.navy, 1, C.ink, 0.9));
const palm = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ...[-4.6, -1.6, 1.4, 4.4].map((d, i) => rect(d - 1.3, -9 + Math.abs(i - 1.5) * 1.2, 2.6, 9, C.skin, 1.3, C.ink, 0.9)), path('M-5.5 -1 L5.5 -1 L5 5 C4 8 -4 8 -5 5 Z', C.skin, C.ink, 1), path('M-5.4 1 L-9 -3 C-10 -4 -11 -2 -10 -1 L-5 5', C.skin, C.ink, 1));
const q = (x: number, y: number, sz = 13, col: string = C.navy) => T(x, y + sz * 0.36, '?', sz, col);
const excl = (x: number, y: number, sz = 13, col: string = RED) => T(x, y + sz * 0.36, '!', sz, col);
const upA = (x: number, y: number, col: string = C.green, l = 14) => arrow(x, y + l / 2, x, y - l / 2, col, 2.6);
const downA = (x: number, y: number, col: string = RED, l = 14) => arrow(x, y - l / 2, x, y + l / 2, col, 2.6);
const dash = (d: string, col: string = HL, w = 1.6, da = '3 3') => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-dasharray="${da}" stroke-linecap="round"/>`;
const sun = (x: number, y: number, r = 6) => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 5))} ${f1(y + Math.sin(a) * (r + 5))}`, C.gold, 1.6); }), circle(x, y, r, C.yellow, C.ink, 1.2));
const moon = (x: number, y: number, r = 7) => path(`M${x + r * 0.3} ${y - r} A${r} ${r} 0 1 0 ${x + r * 0.3} ${y + r} A${r * 0.75} ${r * 0.75} 0 1 1 ${x + r * 0.3} ${y - r} Z`, '#f6e08a', C.ink, 1.2);
const heartM = (x: number, y: number, s = 1, fill: string = C.red) => g(`translate(${x} ${y}) scale(${s})`, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', fill, C.ink, 1.4));
const bulb = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-9 -9 l-3 -3 M0 -12 l0 -4 M9 -9 l3 -3', 'none', C.gold, 1.6), circle(0, -2, 6, C.yellow, C.ink, 1.2), rect(-3, 3.5, 6, 4.5, C.grey, 1, C.ink, 1));
const flagSE = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L0 -26', C.ink, 1.6), rect(0, -26, 18, 11, '#3a6ab0', 0, C.ink, 1), rect(5.5, -26, 3.4, 11, C.yellow, 0, null), rect(0, -22.2, 18, 3.4, C.yellow, 0, null));

// ── Civic things ─────────────────────────────────────────────────────
/** Party colours (no real parties). */
const PC = ['#e85a5a', '#5aa7e8', '#7ac06a', '#f2c14e', '#a585d0', '#f28a2e'];
const KG = '#8cc96a', KG2 = '#d9efc8', RB = '#6f9fd8', RB2 = '#d6e6f7';
/** Kommun badge: green shield with a little white house. */
const kb = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-9 -10 L9 -10 L9 1 C9 7 4 10 0 12 C-4 10 -9 7 -9 1 Z', KG, C.ink, 1.3), path('M-5 0 L0 -5 L5 0 Z', C.white, null), rect(-3.6, 0, 7.2, 5, C.white, 0, null), rect(-1, 2, 2, 3, KG, 0, null));
/** Region badge: blue shield with a white cross. */
const rb = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-9 -10 L9 -10 L9 1 C9 7 4 10 0 12 C-4 10 -9 7 -9 1 Z', RB, C.ink, 1.3), path('M-1.8 -6 L1.8 -6 L1.8 -2.4 L5.4 -2.4 L5.4 1.2 L1.8 1.2 L1.8 4.8 L-1.8 4.8 L-1.8 1.2 L-5.4 1.2 L-5.4 -2.4 L-1.8 -2.4 Z', C.white, null));
/** Tiny house. */
const hs = (x: number, y: number, s = 1, wall: string = '#f2dfb8', roof: string = '#c0583f') => g(`translate(${x} ${y}) scale(${s})`, rect(-6, -8, 12, 8, wall, 0.5, C.ink, 1), path('M-8 -8 L0 -14 L8 -8 Z', roof, C.ink, 1), rect(-1.6, -4, 3.2, 4, C.brown, 0.3, null));
/** Town hall: building with a clock tower and a flag. */
const thall = (x: number, y: number, s = 1, wall = '#efe3c8') => g(`translate(${x} ${y}) scale(${s})`, rect(-30, -36, 60, 36, wall, 1, C.ink, 1.8), path('M-33 -36 L33 -36 L30 -42 L-30 -42 Z', '#8aa0b8', C.ink, 1.6), rect(-8, -62, 16, 22, wall, 1, C.ink, 1.6), path('M-10 -62 L0 -72 L10 -62 Z', '#8aa0b8', C.ink, 1.5), circle(0, -54, 5, C.white, C.ink, 1.2), line('M0 -54 L0 -57.5 M0 -54 L2.6 -54', C.ink, 1), flagSE(0, -72, 0.6),
  win(-20, -24, 9, 10), win(20, -24, 9, 10), door(0, 0, 12, 20, C.brown), kb(-20, -8, 0.55), kb(20, -8, 0.55));
/** State building: columns, pediment and the Swedish flag. */
const statehouse = (x: number, y: number, s = 1, emblem: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-30, -4, 60, 4, '#d9d4c6', 0, C.ink, 1.4), ...[-22, -11, 0, 11, 22].map((cx) => rect(cx - 3, -32, 6, 28, '#f1ede2', 0.5, C.ink, 1.2)), rect(-32, -36, 64, 5, '#d9d4c6', 0, C.ink, 1.4), path('M-34 -36 L0 -52 L34 -36 Z', '#e6e0d0', C.ink, 1.6), emblem, flagSE(0, -52, 0.7));
/** Courthouse: the state building with a balance in the pediment. */
const scalesI = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 -6 L0 6 M-7 -4 L7 -4 M-4 6 L4 6', C.ink, 1.2), path('M-10 2 L-4 2 Q-7 5 -10 2 Z M4 2 L10 2 Q7 5 4 2 Z', C.gold, C.ink, 0.8), line('M-7 -4 L-10 2 M-7 -4 L-4 2 M7 -4 L4 2 M7 -4 L10 2', C.ink, 0.7));
const court = (x: number, y: number, s = 1) => statehouse(x, y, s, scalesI(0, -42, 0.8));
/** Paper with a coloured head band and lines; `inner` is drawn on top (origin = paper centre). */
const doc = (x: number, y: number, s = 1, o: { band?: string; lines?: number; inner?: Svg; rot?: number; w?: number; h?: number } = {}) => { const w = o.w ?? 24, h = o.h ?? 32; return g(`translate(${x} ${y}) rotate(${o.rot ?? 0}) scale(${s})`, rect(-w / 2, -h / 2, w, h, C.white, 1.5, C.ink, 1.3), o.band ? rect(-w / 2, -h / 2, w, 6, o.band, 1.5, C.ink, 1) : '', ...Array.from({ length: o.lines ?? 4 }, (_, i) => line(`M${-w / 2 + 4} ${-h / 2 + 11 + i * 5} L${w / 2 - 4} ${-h / 2 + 11 + i * 5}`, C.grey2, 1.4)), o.inner ?? ''); };
/** Law book with a symbol on the cover. */
const book = (x: number, y: number, s = 1, col = '#7a3b2e', mark: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -18, 28, 36, col, 2, C.ink, 1.6), rect(-14, 13, 28, 5, '#f6efe2', 1, C.ink, 1.2), line('M-10 -18 L-10 13', '#5a2a20', 1.2), mark);
/** Gavel (klubba). */
const gavel = (x: number, y: number, s = 1, rot = -30) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-8, -4, 16, 8, C.brown, 2, C.ink, 1.2), line('M0 4 L0 18', C.brown, 2.6), line('M0 4 L0 18', C.ink, 0.6));
/** Pen with the tip at (x, y). */
const pen = (x: number, y: number, s = 1, rot = 35) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M0 0 L-2 -6 L2 -6 Z', C.ink, null), rect(-2, -26, 4, 20, C.navy, 1, C.ink, 1));
/** Banknote. */
const bill = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-12, -6, 24, 12, '#bfe0b0', 1.5, C.ink, 1.1), circle(0, 0, 3.4, '#8cc07a', C.ink, 0.8));
/** Stack of coins. */
const stack = (x: number, y: number, n = 4, r = 6) => all(...Array.from({ length: n }, (_, i) => all(ellipse(x, y - i * 3, r, r * 0.42, C.gold, C.ink, 1), ellipse(x, y - i * 3 - 0.8, r * 0.6, r * 0.22, 'none', '#b88a20', 0.8))));
/** Table seen from the front at y between x1 and x2. */
const desk = (x1: number, x2: number, y: number, col: string = C.tan) => all(rect(x1, y, x2 - x1, 6, col, 2, C.ink, 1.6), line(`M${x1 + 5} ${y + 6} L${x1 + 5} 112 M${x2 - 5} ${y + 6} L${x2 - 5} 112`, C.brown, 2.4));
/** People sitting behind a table: minis at xs with colours. */
const panel = (xs: number[], cols: string[], y = 76, moods: ('smile' | 'flat' | 'frown')[] = []) => all(...xs.map((x, i) => mini(x, y, cols[i % cols.length]!, moods[i] ?? 'smile', 1, i % 2 === 1)), desk(Math.min(...xs) - 14, Math.max(...xs) + 14, y + 12));
/** Horseshoe hall: seats in a curve with members, the chair at the top with a gavel; `emblem` on the wall. */
const hall = (emblem: Svg, wall = '#f3ecdf') => all(rect(4, 6, 112, 106, wall, 4, C.ink, 1.6), emblem,
  rect(46, 34, 28, 8, C.brown, 1.5, C.ink, 1.3), mini(60, 30, C.navy, 'smile', 0.8), gavel(70, 30, 0.5),
  path('M14 58 Q60 120 106 58', 'none', C.brown, 8), path('M14 58 Q60 120 106 58', 'none', C.ink, 1),
  ...[[18, 52], [28, 66], [41, 76], [55, 80], [69, 80], [83, 76], [96, 66], [104, 52]].map(([x, y], i) => mini(x!, y!, PC[i % 6]!, 'smile', 0.7, i % 2 === 0)),
  ...[[30, 98], [48, 104], [72, 104], [90, 98]].map(([x, y], i) => mini(x!, y!, PC[(i + 3) % 6]!, 'smile', 0.7, i % 2 === 1)));
/** Committee: people at a table under a sign that shows their field. */
const committee = (icon: Svg, cols: string[] = [PC[1]!, PC[0]!, PC[2]!, PC[3]!]) => all(ground, rect(30, 8, 60, 40, C.white, 4, C.ink, 1.6), icon, panel([30, 50, 70, 90], cols, 74));
/** Map: an area split into kommun pieces (origin top-left, about 100 × 84). */
const KP = ['M0 10 L34 0 L46 30 L10 44 Z', 'M34 0 L74 4 L70 34 L46 30 Z', 'M74 4 L100 18 L94 46 L70 34 Z', 'M10 44 L46 30 L50 64 L18 80 Z', 'M46 30 L70 34 L94 46 L84 78 L50 64 Z'];
const kmap = (x: number, y: number, s: number, fill: (i: number) => string, extra: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, ...KP.map((d, i) => path(d, fill(i), C.ink, 1.4 / s)), extra);
/** A simple country outline divided into regions (origin top-left, about 64 × 82). */
const REG = ['M0 0 L30 0 L34 26 L4 30 Z', 'M30 0 L62 4 L60 28 L34 26 Z', 'M4 30 L34 26 L36 54 L8 58 Z', 'M34 26 L60 28 L64 52 L36 54 Z', 'M8 58 L36 54 L38 80 L14 82 Z', 'M36 54 L64 52 L60 78 L38 80 Z'];
const mapR = (x: number, y: number, s = 1, fill: (i: number) => string = () => '#e4e7ea', extra: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, ...REG.map((d, i) => path(d, fill(i), C.ink, 1.4 / s)), extra);
/** Small icons. */
const schoolI = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-9, -6, 18, 12, '#e6d3b3', 1, C.ink, 1.1), path('M-11 -5 L0 -12 L11 -5 Z', '#b0533c', C.ink, 1.1), rect(-2, 0, 4, 6, C.brown, 0.5, C.ink, 0.8), circle(0, -6.5, 1.6, C.white, C.ink, 0.6));
const hospI = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-9, -9, 18, 16, C.white, 2, C.ink, 1.1), path('M-2 -6 L2 -6 L2 -3 L5 -3 L5 1 L2 1 L2 4 L-2 4 L-2 1 L-5 1 L-5 -3 L-2 -3 Z', RED, null));
const busI = (x: number, y: number, s = 1, col: string = '#e8a23a') => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -9, 28, 14, col, 3, C.ink, 1.2), rect(-11, -6, 6, 5, '#d8eef8', 1, C.ink, 0.7), rect(-3, -6, 6, 5, '#d8eef8', 1, C.ink, 0.7), rect(5, -6, 6, 5, '#d8eef8', 1, C.ink, 0.7), circle(-8, 6, 2.6, C.dark, C.ink, 0.8), circle(8, 6, 2.6, C.dark, C.ink, 0.8));
const trainI = (x: number, y: number, s = 1, col: string = '#c9463d') => g(`translate(${x} ${y}) scale(${s})`, path('M-16 5 L-16 -6 C-16 -9 -13 -10 -10 -10 L14 -10 C17 -10 18 -8 18 -4 L18 5 Z', col, C.ink, 1.2), rect(-12, -7, 6, 5, '#d8eef8', 1, C.ink, 0.7), rect(-3, -7, 6, 5, '#d8eef8', 1, C.ink, 0.7), rect(6, -7, 6, 5, '#d8eef8', 1, C.ink, 0.7), circle(-9, 6, 2.2, C.dark, null), circle(9, 6, 2.2, C.dark, null));
const familyI = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, mini(-6, 0, C.orange, 'smile', 0.8, true), mini(8, 4, C.green, 'smile', 0.55), heartM(1, -16, 0.5));
const toothI = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-8 -8 C-8 -13 -3 -12 0 -10 C3 -12 8 -13 8 -8 C8 -2 6 0 5 8 C4 11 2 11 1.5 6 C1 3 -1 3 -1.5 6 C-2 11 -4 11 -5 8 C-6 0 -8 -2 -8 -8 Z', C.white, C.ink, 1.3));
const craneI = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M-6 12 L-6 -14 L14 -14 M-6 -10 L-2 -14 M-10 -14 L-6 -14', C.orange, 2), line('M10 -14 L10 -4', C.ink, 0.8), rect(7, -4, 6, 4, C.grey, 0.5, C.ink, 0.7), path('M-14 12 L2 12 L2 2 L-14 2 Z', '#f2dfb8', C.ink, 1), line('M-14 7 L2 7 M-6 2 L-6 12', C.ink, 0.6));
const bookI = (x: number, y: number, s = 1, col: string = C.navy) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -4 C-3 -6 -6 -6 -8 -5 L-8 5 C-6 4 -3 4 0 6 C3 4 6 4 8 5 L8 -5 C6 -6 3 -6 0 -4 Z', C.white, col, 1.4), line('M0 -4 L0 6', col, 1.2));
const fireI = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -8, 26, 12, RED, 2, C.ink, 1.2), rect(4, -14, 10, 8, RED, 2, C.ink, 1.2), rect(6, -12, 6, 4, '#d8eef8', 1, null), line('M-12 -10 L2 -12', C.grey, 1.6), circle(-8, 5, 2.6, C.dark, null), circle(8, 5, 2.6, C.dark, null));
const shopI = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -10, 28, 20, '#f2e6d0', 1, C.ink, 1.2), path('M-16 -10 L16 -10 L14 -16 L-14 -16 Z', '#e85a5a', C.ink, 1.1), rect(-10, -4, 10, 8, '#d8eef8', 1, C.ink, 0.8), rect(4, -4, 6, 14, C.brown, 0.5, C.ink, 0.8));
const factoryI = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-16 10 L-16 -4 L-8 -10 L-8 -4 L0 -10 L0 -4 L8 -10 L8 10 Z', '#d9dde3', C.ink, 1.2), rect(10, -18, 5, 28, '#c2c9d2', 0.5, C.ink, 1.1), rect(-12, 2, 5, 5, '#d8eef8', 0.5, C.ink, 0.7), rect(-2, 2, 5, 5, '#d8eef8', 0.5, C.ink, 0.7));
const capI = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-12 -2 L0 -8 L12 -2 L0 4 Z', C.dark, C.ink, 1), path('M-7 1 L-7 7 C-3 10 3 10 7 7 L7 1 L0 4 Z', C.dark, C.ink, 1), line('M10 -2 L10 6', C.gold, 1.2));
const laptop = (x: number, y: number, s = 1, inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-30, -40, 60, 38, C.dark, 3, C.ink, 1.6), rect(-27, -37, 54, 32, '#eef6fb', 1, null), inner, path('M-36 0 L36 0 L32 -2 L-32 -2 Z', C.grey, C.ink, 1.4));
const stamp = (x: number, y: number, s = 1, col: string = C.green) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 9, 'none', col, 2), check(0, 0, 0.9, col));
const padlock = (x: number, y: number, s = 1, col: string = C.gold) => g(`translate(${x} ${y}) scale(${s})`, path('M-6 -4 L-6 -12 C-6 -20 6 -20 6 -12 L6 -4', 'none', C.ink, 2.6), rect(-9, -4, 18, 14, col, 2, C.ink, 1.6), circle(0, 2, 2, C.ink, null));
const road = (y: number, h = 14) => all(rect(0, y, 120, h, '#9aa0a8', 0, null), line(`M4 ${y + h / 2} L116 ${y + h / 2}`, C.white, 1.6, '7 6'));
const pine = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-1.5, -6, 3, 6, C.brown, 0.5, null), path('M0 -26 L8 -6 L-8 -6 Z', '#3f7d4f', C.ink, 1));
const pie = (x: number, y: number, r: number, parts: [string, number][]) => { let a = -Math.PI / 2; const tot = parts.reduce((s, p) => s + p[1], 0); return all(...parts.map(([c, v]) => { const b = a + (v / tot) * 2 * Math.PI, la = b - a > Math.PI ? 1 : 0, d = `M${x} ${y} L${f1(x + r * Math.cos(a))} ${f1(y + r * Math.sin(a))} A${r} ${r} 0 ${la} 1 ${f1(x + r * Math.cos(b))} ${f1(y + r * Math.sin(b))} Z`; a = b; return path(d, c, C.ink, 1.2); })); };
/** Balance with the beam tilted by `tilt` degrees; things in the pans. */
const scaleB = (x: number, y: number, tilt: number, l: Svg = '', r: Svg = '', s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-14 40 L14 40 L4 34 L-4 34 Z', C.brown, C.ink, 1.4), line('M0 34 L0 -2', C.ink, 2.6),
  g(`rotate(${tilt})`, line('M-34 0 L34 0', C.ink, 2.6), line('M-32 0 L-40 18 M-32 0 L-24 18 M32 0 L24 18 M32 0 L40 18', C.ink, 1), path('M-44 18 L-20 18 Q-32 26 -44 18 Z', C.gold, C.ink, 1.2), path('M20 18 L44 18 Q32 26 20 18 Z', C.gold, C.ink, 1.2), g('translate(-32 16)', g(`rotate(${-tilt})`, l)), g('translate(32 16)', g(`rotate(${-tilt})`, r))), circle(0, 0, 3, C.gold, C.ink, 1.2));

export const MUNICIPAL_MOTIFS: Record<string, Svg> = {
  // ── Kommunfullmäktige ────────────────────────────────────────────
  // kommun: one piece of the map is green with its own little town and badge; the neighbouring kommuner are grey.
  'kommun.kommun': all(kmap(8, 14, 1.04, (i) => (i === 4 ? KG2 : '#e4e7ea')), hs(70, 64, 1.1), hs(84, 66, 0.9), thall(78, 82, 0.32), hs(92, 76, 0.8), kb(96, 46, 0.9), ...[[22, 40], [40, 22], [92, 34], [28, 84]].map(([x, y]) => greyed(hs(x!, y!, 0.7)))),
  // kommunfullmäktige: the big hall with many members in a horseshoe, the chair with a gavel, and the kommun badge on the wall.
  'kommun.kommunfullmäktige': hall(kb(60, 18, 0.9)),
  // kommunhus: the town hall with its clock tower and the kommun badges by the door; people walk in.
  'kommun.kommunhus': all(ground, tree(10, 112, 0.6), thall(60, 112, 1.2), tree(110, 112, 0.6), mini(30, 100, PC[3]!, 'smile', 0.6), arrow(36, 106, 50, 106, HL, 1.6)),
  // förtroendevald: many voters hand her their trust (hearts go to her); she takes the task (folder); a grey person beside her gets nothing.
  'kommun.förtroendevald': all(ground, ...[[12, 96], [26, 102], [40, 96], [18, 80], [34, 82]].map(([x, y], i) => mini(x!, y!, PC[i % 6]!, 'smile', 0.7, i % 2 === 0)), arrow(48, 82, 66, 66, HL, 2), heartM(46, 64, 0.6), heartM(56, 54, 0.6), fig(84, PC[1]!, 'laugh', { h: 0.82, hairStyle: 'long' }), reach(84, 0.82, 1, 100, 68), rect(96, 60, 14, 18, C.navy, 1.5, C.ink, 1.2), star(84, 18, 5, C.gold)),
  // fritidspolitiker: by day she works as a nurse (sun); in the evening (moon) she sits at the council table with a gavel and papers.
  'kommun.fritidspolitiker': all(rect(4, 6, 54, 106, '#fff6d8', 4, C.ink, 1.4), rect(62, 6, 54, 106, '#2f3e66', 4, C.ink, 1.4), sun(46, 20), moon(104, 20), fig(30, C.white, 'smile', { h: 0.72, hairStyle: 'long' }), g('translate(30 74)', rect(-3, -3, 6, 6, RED, 0.5, null)), mini(88, 76, C.white, 'smile', 1, true), desk(70, 110, 88), doc(102, 84, 0.45, { band: KG }), gavel(76, 84, 0.5), arrow(52, 100, 68, 100, HL, 2)),
  // arvode: after the meeting she receives an envelope with money for the meeting (calendar day ticked).
  'kommun.arvode': all(ground, fig(34, PC[2]!, 'smile', { h: 0.85, hairStyle: 'long' }), reach(34, 0.85, 1, 58, 66), g('translate(70 64)', rect(-12, -8, 24, 16, '#e9d6ad', 1.5, C.ink, 1.3), path('M-12 -8 L0 1 L12 -8', 'none', C.ink, 1.1)), bill(70, 52, 0.7, -12), coin(84, 54, 4), arrow(98, 70, 82, 66, HL, 2), reach(108, 0.7, -1, 84, 72), mini(108, 92, C.navy, 'smile', 0.9), cal(66, 6, 46, 2, (i) => (i === 3 ? '#fde0b8' : null), { mark: (i) => (i === 3 ? gavel(0, 0, 0.3) : '') })),
  // dagordning: the list of numbered points; 1 and 2 are done, the chair's gavel points at 3.
  'kommun.dagordning': all(rect(22, 6, 62, 100, C.white, 3, C.ink, 1.8), rect(22, 6, 62, 10, KG, 3, C.ink, 1.4), ...[0, 1, 2, 3, 4].map((i) => all(T(32, 32 + i * 16, String(i + 1), 10, C.navy), line(`M40 ${28 + i * 16} L74 ${28 + i * 16}`, C.grey2, 2.4), i < 2 ? check(78, 28 + i * 16, 0.6) : '')), arrow(106, 60, 90, 60, HL, 2.4), gavel(104, 82, 0.9, -20)),
  // yrkande: at the meeting she stands up with her palm raised and presents a paper with her proposal; the others sit (grey).
  'kommun.yrkande': all(ground, greyed(mini(16, 80, C.grey), mini(36, 80, C.grey), mini(94, 80, C.grey)), desk(4, 116, 92), fig(64, PC[4]!, 'smile', { h: 0.92, hairStyle: 'long' }), reach(64, 0.92, 1, 84, 30), palm(84, 26, 1), reach(64, 0.92, -1, 46, 54), doc(40, 50, 0.6, { band: PC[4], inner: check(0, 4, 0.9) }), say(26, 20, 32, 22, 40, 36, all(rect(14, 14, 10, 10, C.white, 1, C.ink, 1), check(19, 19, 0.5), arrow(28, 19, 36, 19, HL, 1.4)))),
  // allmänheten: lots of ordinary people of every kind (colourful) as against one grey official at his desk.
  'kommun.allmänhet': all(ground, greyed(mini(104, 26, C.grey, 'flat', 0.9), rect(90, 36, 28, 5, C.tan, 1, C.ink, 1.2)), ...[[14, 64], [32, 60], [50, 66], [68, 62], [86, 68], [104, 66], [22, 86], [40, 90], [58, 86], [76, 90], [94, 88], [112, 92]].map(([x, y], i) => mini(x!, y!, PC[i % 6]!, 'smile', 0.85, i % 3 === 1)), mini(10, 104, C.orange, 'smile', 0.5), mini(66, 106, C.green, 'smile', 0.5)),

  // ── Kommunstyrelse och nämnder ───────────────────────────────────
  // kommunstyrelse: a small group round the table in front of the town hall leads the work; arrows go down to the committees below.
  'kommun.kommunstyrelse': all(thall(60, 46, 0.6), panel([32, 50, 70, 88], [PC[1]!, PC[0]!, PC[2]!, PC[4]!], 60), gavel(98, 70, 0.5), arrow(30, 82, 18, 96, HL, 1.8), arrow(60, 82, 60, 96, HL, 1.8), arrow(90, 82, 102, 96, HL, 1.8), schoolI(16, 106, 0.8), familyI(60, 106, 0.7), craneI(104, 104, 0.6), line('M4 112 L116 112', C.grey2, 2)),
  // nämnd: each committee looks after one field; this one (school) is in colour, the others are grey.
  'kommun.nämnd': all(ground, greyed(rect(8, 8, 30, 26, C.white, 3, C.ink, 1.4), familyI(23, 26, 0.7), rect(82, 8, 30, 26, C.white, 3, C.ink, 1.4), craneI(97, 24, 0.7)), rect(42, 4, 36, 32, C.white, 3, HL, 2), schoolI(60, 24, 1.2), panel([36, 60, 84], [PC[1]!, PC[0]!, PC[2]!], 74)),
  // kommunalråd: the full-time leading politician answers journalists' microphones in front of the town hall.
  'kommun.kommunalråd': all(ground, thall(26, 112, 0.6), fig(62, C.navy, 'smile', { h: 0.92 }), path('M62 46 L59 60 L62 66 L65 60 Z', RED, C.ink, 0.8), kb(52, 52, 0.4), fig(102, PC[3]!, 'smile', { h: 0.7, hairStyle: 'long' }), reach(102, 0.7, -1, 90, 46), g('translate(80 41) rotate(27)', rect(0, -2, 12, 4, C.dark, 1, C.ink, 0.8), circle(-3, 0, 4, C.dark, C.ink, 1)), hnd(90, 46, 2.4)),
  // oppositionsråd: the full-time politician of the other side stands opposite the majority (left), shows a thumb down and a paper of her own.
  'kommun.oppositionsråd': all(ground, mini(14, 74, PC[1]!), mini(30, 74, PC[1]!, 'smile', 1, true), mini(46, 74, PC[1]!), desk(2, 58, 86), fig(88, PC[0]!, 'smile', { h: 0.9, hairStyle: 'long' }), path('M88 46 L85.5 58 L88 63 L90.5 58 Z', C.navy, C.ink, 0.8), reach(88, 0.9, -1, 70, 52), thumb(68, 50, 0.9, true), reach(88, 0.9, 1, 108, 60), doc(110, 54, 0.5, { band: PC[0] })),
  // förvaltning: the officials at their desks with computers and folders carry out what the politicians at the top have decided.
  'kommun.förvaltning': all(rect(4, 4, 112, 34, '#eef3f8', 4, C.ink, 1.2), panel([42, 60, 78], [PC[1]!, PC[0]!, PC[2]!], 14), gavel(92, 22, 0.4), downA(60, 46, HL, 12), ...[[24, 72], [60, 72], [96, 72], [24, 98], [60, 98], [96, 98]].map(([x, y], i) => all(mini(x!, y!, ['#9fb4c8', '#b9c9a6', '#d6b8a0'][i % 3]!, 'smile', 0.7, i % 2 === 0), rect(x! - 14, y! + 8, 28, 4, C.tan, 1, C.ink, 1), rect(x! + 4, y! - 2, 10, 8, C.dark, 1, C.ink, 0.8), rect(x! - 14, y! + 1, 6, 7, C.yellow, 0.5, C.ink, 0.7)))),
  // socialnämnd: politicians at their table whose field is help for families (family with a heart on the sign).
  'kommun.socialnämnd': committee(familyI(60, 34, 1.3)),
  // utbildningsnämnd: politicians at their table whose field is schools (school and book on the sign).
  'kommun.utbildningsnämnd': committee(all(schoolI(50, 30, 1.3), bookI(76, 32, 1.1))),
  // byggnadsnämnd: politicians at their table whose field is building (crane and house on the sign).
  'kommun.byggnadsnämnd': committee(craneI(60, 30, 1.3)),
  // kommundirektör: the top of the pyramid of officials, in a suit with a tie, with all the staff below.
  'kommun.kommundirektör': all(ground, path('M60 30 L110 108 L10 108 Z', '#eef3f8', C.ink, 1.2), mini(60, 30, C.navy, 'smile', 1.2), path('M60 38 L58 46 L60 49 L62 46 Z', RED, null), ...[[46, 60], [74, 60], [34, 82], [60, 82], [86, 82], [22, 102], [46, 102], [74, 102], [98, 102]].map(([x, y], i) => mini(x!, y!, ['#9fb4c8', '#b9c9a6', '#d6b8a0'][i % 3]!, 'smile', 0.6, i % 2 === 1)), star(60, 8, 5, C.gold), kb(96, 22, 0.8)),
  // delegera: the politician at the desk hands the folder with the decision stamp to the official, who will decide instead.
  'kommun.delegera': all(ground, desk(4, 52, 82), fig(26, PC[1]!, 'smile', { h: 0.8 }), reach(26, 0.8, 1, 56, 58), g('translate(64 56)', rect(-10, -8, 20, 14, C.yellow, 1.5, C.ink, 1.2), stamp(0, -1, 0.5, C.green)), arrow(56, 40, 80, 40, HL, 2.4), fig(96, '#9fb4c8', 'smile', { h: 0.8, hairStyle: 'long' }), reach(96, 0.8, -1, 74, 60)),

  // ── Regioners ansvar ─────────────────────────────────────────────
  // regionfullmäktige: the big hall with members in a horseshoe, and the blue region badge on the wall.
  'kommun.regionfullmäktige': hall(rb(60, 18, 0.9), '#eaf1fa'),
  // regionråd: the full-time politician of the region stands between the hospital and the bus, with the blue badge.
  'kommun.regionråd': all(ground, g('translate(24 112)', rect(-20, -54, 40, 54, C.white, 2, C.ink, 1.6), hospI(0, -40, 1), win(-10, -18, 8, 8), win(10, -18, 8, 8), door(0, 0, 10, 14, C.navy)), fig(66, C.navy, 'smile', { h: 0.9 }), path('M66 48 L63.5 60 L66 65 L68.5 60 Z', RED, C.ink, 0.8), rb(56, 54, 0.45), busI(100, 100, 1)),
  // landsting: the old sign over the hospital door (sepia) is replaced by the new blue region sign; the year of the change is shown.
  'kommun.landsting': all(ground, rect(28, 50, 64, 62, C.white, 2, C.ink, 1.6), hospI(60, 70, 1.2), door(60, 112, 14, 22, C.navy), sepia(g('translate(26 24)', rect(-18, -10, 36, 20, '#e8d9b8', 2, C.ink, 1.4), circle(-9, 0, 5, '#b9a27a', C.ink, 1), line('M-1 -3 L12 -3 M-1 3 L12 3', '#8a7656', 2))), cross(26, 24, 1.6, C.grey), arrow(48, 24, 70, 24, HL, 2.4), g('translate(94 24)', rect(-18, -10, 36, 20, RB2, 2, C.ink, 1.4), rb(-8, 0, 0.7), line('M2 -3 L13 -3 M2 3 L13 3', RB, 2)), T(59, 14, '2019', 8, C.navy)),
  // sjukvård: a patient in a hospital bed is cared for by a doctor with a stethoscope.
  'kommun.sjukvård': all(ground, rect(8, 70, 66, 10, C.white, 3, C.ink, 1.6), rect(8, 64, 16, 10, C.white, 4, C.ink, 1.2), line('M10 80 L10 108 M72 80 L72 108', C.grey, 3), circle(24, 60, 8, C.skin, C.ink, 1.4), path('M18 58 C18 50 30 50 30 58 C27 55 21 55 18 58 Z', C.hair, null), rect(28, 62, 44, 10, '#a9cdf2', 3, C.ink, 1.2), fig(94, C.white, 'smile', { h: 0.92 }), path('M86 46 C86 62 102 62 102 46', 'none', C.dark, 1.4), circle(94, 64, 3, C.grey, C.dark, 1.2), hospI(52, 22, 1.4)),
  // regional: in the whole country (grey) one region is blue, and a train runs between its towns.
  'kommun.regional': all(mapR(10, 14, 1.2, (i) => (i === 3 ? RB2 : '#e4e7ea')), hs(58, 60, 0.8), hs(80, 52, 0.7), hs(68, 74, 0.7), line('M58 62 L68 74 L80 54', RB, 1.8), trainI(98, 98, 0.8), rb(102, 20, 0.9)),
  // tandvård: a child in the dentist's chair; the dentist checks his teeth; a big clean tooth.
  'kommun.tandvård': all(ground, path('M14 92 L46 92 L58 76 L64 78 L52 98 L14 98 Z', '#6fb7c9', C.ink, 1.4), line('M30 98 L30 110 M20 110 L40 110', C.grey, 3), mini(56, 66, C.green, 'smile', 0.9), fig(88, C.white, 'smile', { h: 0.9, hairStyle: 'long' }), reach(88, 0.9, -1, 64, 64), line('M64 64 L60 62', C.grey, 1.6), toothI(24, 30, 1.8), path('M42 18 l3 -3 M44 26 l4 0 M42 34 l3 3', 'none', C.gold, 1.4)),
  // specialistvård: the small health centre sends the patient (arrow) to the big hospital, where a heart doctor examines a big heart.
  'kommun.specialistvård': all(ground, g('translate(18 112)', rect(-14, -24, 28, 24, C.white, 2, C.ink, 1.4), hospI(0, -14, 0.7)), arrow(36, 96, 52, 96, HL, 2), g('translate(84 112)', rect(-30, -72, 60, 72, C.white, 2, C.ink, 1.6), ...[-18, 0, 18].map((x) => win(x, -54, 9, 9)), ...[-18, 18].map((x) => win(x, -34, 9, 9)), door(0, 0, 14, 18, C.navy)), heartM(84, 46, 1.4, C.red), path('M70 46 L76 46 L79 40 L83 52 L86 46 L98 46', 'none', C.white, 1.6), doc(26, 40, 0.7, { band: RED, inner: arrow(-6, 6, 6, 6, HL, 1.4) })),
  // regional utveckling: the region (blue) grows: new factory, train, school cap and an arrow going up.
  'kommun.regional-utveckling': all(ground, path('M8 90 L28 54 L60 46 L100 56 L112 90 Z', RB2, C.ink, 1.4), factoryI(32, 74, 0.9), trainI(80, 80, 0.7), capI(60, 58, 0.9), hs(54, 82, 0.8), hs(98, 66, 0.6), upA(100, 28, C.green, 26), path('M14 40 L36 30 L58 22 L86 12', 'none', C.green, 2.4), rb(18, 18, 0.9)),

  // ── Skattefinansierad service ────────────────────────────────────
  // skattefinansierad: many people put coins into the shared pot; out of it come the school and the hospital, which the child enters without paying.
  'kommun.skattefinansierad': all(ground, ...[[10, 30], [26, 22], [42, 30]].map(([x, y], i) => all(mini(x!, y!, PC[i]!, 'smile', 0.7), coin(x! + 4, y! + 20, 3.4))), path('M14 58 L42 58 L38 82 L18 82 Z', '#f2e6c8', C.ink, 1.6), arrow(26, 48, 28, 60, HL, 1.6), stack(28, 74, 3, 5), arrow(46, 70, 62, 70, HL, 2.4), schoolI(82, 50, 1.6), hospI(82, 90, 1.4), mini(106, 96, C.green, 'smile', 0.6), arrow(104, 84, 96, 72, HL, 1.4), noB(108, 62, 6)),
  // kommunalskatt: from the payslip a part goes (arrows) to the town hall and to the region (hospital).
  'kommun.kommunalskatt': all(ground, doc(22, 56, 1.2, { band: C.green, lines: 3, inner: all(rect(-8, 6, 16, 6, '#fde0b8', 1, C.ink, 0.8), coin(0, 9, 2.4)) }), arrow(40, 52, 64, 40, HL, 2.2), arrow(40, 68, 64, 86, HL, 2.2), thall(90, 54, 0.55), g('translate(90 108)', rect(-16, -24, 32, 24, C.white, 2, C.ink, 1.4), hospI(0, -12, 0.8)), kb(110, 14, 0.6), rb(112, 78, 0.6)),
  // skattesats: the coin (income) as a pie; about a third is the tax share (orange) and a percent sign.
  'kommun.skattesats': all(pie(52, 60, 38, [[C.accent, 32], ['#f6e3a6', 68]]), circle(52, 60, 38, 'none', C.ink, 2), T(98, 34, '%', 24, C.accent), arrow(92, 50, 78, 54, HL, 2), coin(100, 96, 8), coin(110, 104, 6)),
  // skattebetalare: a working woman with a briefcase drops her coin into the slot of the town hall.
  'kommun.skattebetalare': all(ground, fig(30, C.navy, 'smile', { h: 0.9, hairStyle: 'long' }), reach(30, 0.9, -1, 12, 96), rect(4, 94, 14, 12, C.brown, 2, C.ink, 1.2), reach(30, 0.9, 1, 56, 52), coin(60, 50, 4), arrow(64, 50, 76, 58, HL, 1.8), thall(90, 112, 0.7), rect(82, 64, 16, 4, C.ink, 1, null)),
  // välfärd: one big roof shelters a schoolchild, an old man with a stick and a sick woman in bed.
  'kommun.välfärd': all(ground, path('M6 54 L60 14 L114 54 Z', '#e8a23a', C.ink, 2), line('M14 54 L14 112 M106 54 L106 112', C.brown, 3), mini(30, 84, C.green, 'smile', 0.85), rect(24, 96, 12, 10, C.red, 2, C.ink, 1), mini(60, 82, C.grey2, 'smile', 0.9), line('M70 84 L74 110', C.brown, 2), path('M58 72 C62 68 66 70 64 74', 'none', C.white, 1.6), rect(76, 96, 28, 8, C.white, 2, C.ink, 1.2), circle(82, 92, 4.4, C.skin, C.ink, 1), rect(86, 92, 18, 6, '#a9cdf2', 2, C.ink, 1), heartM(60, 40, 0.8)),
  // offentlig sektor: school, hospital, fire engine and town hall are in colour together; the private shop and factory beside them are grey.
  'kommun.offentlig-sektor': all(ground, rect(4, 8, 76, 104, '#eaf5e2', 6, KG, 2), thall(42, 54, 0.45), schoolI(20, 72, 1.2), hospI(62, 72, 1.2), fireI(40, 102, 1.1), greyed(shopI(100, 44, 0.9), factoryI(100, 94, 0.9))),
  // socialtjänst: the social worker at her desk listens to a worried father and his child and gives them a folder of help.
  'kommun.socialtjänst': all(ground, desk(48, 114, 86), fig(96, '#9fb4c8', 'smile', { h: 0.8, hairStyle: 'long' }), reach(96, 0.8, -1, 70, 76), g('translate(64 78)', rect(-8, -6, 16, 12, C.yellow, 1.5, C.ink, 1.1), heartM(0, 1, 0.3)), fig(26, C.orange, 'frown', { h: 0.82 }), fig(46, C.green, 'smile', { h: 0.48 }), kb(110, 18, 0.8)),
  // statsbidrag: the state (building with the flag) sends money (arrow) to the town hall.
  'kommun.statsbidrag': all(ground, statehouse(30, 112, 0.8), arrow(54, 56, 78, 56, HL, 2.6), bill(66, 44, 0.7), coin(62, 70, 4), coin(72, 68, 4), thall(92, 112, 0.6)),
  // finansiera: the stack of money turns (arrow) into a new building under construction with a crane.
  'kommun.finansiera': all(ground, stack(22, 104, 6, 10), bill(22, 76, 0.9, -10), arrow(40, 86, 58, 86, HL, 2.6), rect(66, 62, 40, 50, '#f2dfb8', 1, C.ink, 1.6), line('M66 78 L106 78 M66 94 L106 94 M80 62 L80 112 M94 62 L94 112', C.ink, 0.8), line('M110 112 L110 14 L60 14 M110 22 L102 14', C.orange, 3), line('M74 14 L74 40', C.ink, 1), rect(70, 40, 8, 6, C.grey, 1, C.ink, 1)),
  // grundskola: children with school bags walk into the school building.
  'kommun.grundskola': all(ground, g('translate(70 112)', rect(-40, -50, 80, 50, '#e6d3b3', 2, C.ink, 1.8), path('M-44 -50 L0 -72 L44 -50 Z', '#b0533c', C.ink, 1.8), circle(0, -58, 5, C.white, C.ink, 1.2), ...[-26, -10, 10, 26].map((x) => win(x, -34, 10, 10)), door(0, 0, 14, 22, C.brown)), fig(16, C.green, 'smile', { h: 0.5 }), rect(4, 82, 7, 12, C.red, 2, C.ink, 1), fig(36, C.orange, 'smile', { h: 0.54, hairStyle: 'long' }), rect(24, 80, 7, 12, C.navy, 2, C.ink, 1)),

  // ── Lokala beslut ────────────────────────────────────────────────
  // lokal (på en ort): a magnifier picks out one small place on the map, with its own houses and people; the rest of the country is grey.
  'kommun.lokal.2': all(mapR(8, 22, 1.1, () => '#e4e7ea'), circle(42, 62, 4, HL, C.ink, 1), line('M46 58 L66 40', C.ink, 1.4), circle(88, 36, 26, '#eaf5e2', C.ink, 2.4), hs(78, 40, 1), hs(96, 38, 0.9), mini(88, 52, PC[3]!, 'smile', 0.5), tree(104, 50, 0.4), line('M106 54 L114 62', C.ink, 4)),
  // justera (ett protokoll): two members read through the minutes of the meeting and sign that they are right.
  'kommun.justera.2': all(ground, desk(4, 116, 86), mini(26, 74, PC[1]!), mini(94, 74, PC[2]!, 'smile', 1, true), doc(60, 64, 1.2, { band: KG, lines: 5, inner: all(path('M-8 12 q2 -3 4 0 t4 0', 'none', C.navy, 1), path('M2 12 q2 -3 4 0 t4 0', 'none', C.navy, 1)) }), pen(48, 78, 0.6, 30), pen(74, 78, 0.6, -30), check(60, 30, 1.2)),
  // detaljplan: the plan of one area: building plots with their heights, the street and the green park.
  'kommun.detaljplan': all(rect(6, 6, 108, 108, '#f8f5ec', 3, C.ink, 1.6), rect(6, 54, 108, 14, '#c9ced4', 0, C.ink, 1), ...[[14, 14], [40, 14], [66, 14]].map(([x, y]) => all(rect(x!, y!, 22, 32, '#f6d6a8', 1, C.ink, 1.2), ...[0, 1, 2].map((k) => line(`M${x! + 3} ${y! + 26 - k * 8} L${x! + 19} ${y! + 26 - k * 8}`, '#c48a4a', 1)))), rect(92, 14, 16, 32, '#f6d6a8', 1, C.ink, 1.2), rect(14, 76, 46, 30, '#bfe0a8', 1, C.ink, 1.2), tree(26, 100, 0.4), tree(46, 98, 0.4), rect(66, 76, 42, 30, '#f6d6a8', 1, C.ink, 1.2), dash('M66 76 L108 106', C.ink, 0.8), dash('M108 76 L66 106', C.ink, 0.8), line('M110 14 L110 46 M107 14 L113 14 M107 46 L113 46', HL, 1.4)),
  // översiktsplan: the whole kommun at a glance: broad zones for housing (yellow), nature (green), work (grey) and the main roads.
  'kommun.översiktsplan': all(path('M10 20 L56 6 L104 18 L112 64 L88 108 L30 110 L8 72 Z', '#f8f5ec', C.ink, 2), path('M30 30 C50 22 60 40 48 52 C36 60 24 46 30 30 Z', '#f6e08a', C.ink, 1), path('M66 60 C84 52 98 66 90 80 C80 92 62 80 66 60 Z', '#f6e08a', C.ink, 1), path('M70 20 C92 18 104 30 100 46 C88 50 72 40 70 20 Z', '#a8d98a', C.ink, 1), path('M16 74 C30 70 40 84 34 100 C24 104 14 92 16 74 Z', '#a8d98a', C.ink, 1), path('M44 66 L60 64 L60 80 L44 82 Z', '#c9ced4', C.ink, 1), line('M10 60 C40 58 70 56 112 50 M56 6 C56 40 52 80 58 110', '#9aa0a8', 3), kb(100, 96, 0.9)),
  // bygglov: she holds up the approved permit (green stamp) in front of the house frame that is being built.
  'kommun.bygglov': all(ground, path('M58 112 L58 62 L84 42 L110 62 L110 112', 'none', C.brown, 2.6), line('M58 62 L110 62 M58 86 L110 86 M71 62 L71 112 M97 62 L97 112 M58 62 L84 42', C.brown, 1.6), fig(28, C.orange, 'laugh', { h: 0.85 }), reach(28, 0.85, 1, 46, 36), doc(46, 30, 0.9, { band: KG, inner: stamp(0, 6, 0.6) }), kb(10, 14, 0.7)),
  // samråd: the official shows the plan on a board, and the residents give their views (bubbles with ticks and crosses).
  'kommun.samråd': all(ground, rect(36, 16, 48, 36, C.white, 2, C.ink, 1.6), line('M44 52 L40 76 M76 52 L80 76', C.brown, 2), rect(40, 20, 18, 14, '#f6d6a8', 1, C.ink, 1), rect(62, 20, 18, 14, '#bfe0a8', 1, C.ink, 1), rect(40, 38, 40, 6, '#c9ced4', 0, null), fig(18, '#9fb4c8', 'smile', { h: 0.72 }), reach(18, 0.72, 1, 38, 40), ...[[52, 96, PC[3]!], [76, 98, PC[5]!], [100, 94, PC[2]!]].map(([x, y, c]) => mini(x as number, y as number, c as string, 'smile', 0.9)), say(102, 66, 18, 16, 100, 84, check(102, 66, 0.6)), say(80, 66, 18, 16, 77, 86, cross(80, 66, 0.5)), say(56, 68, 18, 16, 53, 84, q(56, 68, 11))),
  // berörd: the new road is built right past these two houses (highlighted rings); the houses far away are grey.
  'kommun.berörd': all(road(70, 16), rect(0, 86, 120, 26, '#d9efc8', 0, null), rect(0, 26, 120, 44, '#eef6e6', 0, null), hs(34, 66, 1.4), hs(70, 66, 1.4), path('M20 46 C26 38 42 38 48 46 M56 46 C62 38 78 38 84 46', 'none', HL, 1.8), path('M14 40 C22 30 46 30 54 40 M50 40 C58 30 82 30 90 40', 'none', HL, 1.2), greyed(hs(10, 108, 0.9), hs(108, 106, 0.9), hs(106, 40, 0.8)), g('translate(98 82)', rect(-8, -6, 16, 10, C.yellow, 1, C.ink, 1), line('M-4 4 L-4 10 M4 4 L4 10', C.ink, 1.2)), excl(34, 18, 14), excl(70, 18, 14)),
  // lägga ned: the little school is closed for good: planks over the door; the sad children walk away.
  'kommun.lägga-ned': all(ground, g('translate(46 112)', rect(-32, -46, 64, 46, '#e6d3b3', 2, C.ink, 1.8), path('M-36 -46 L0 -66 L36 -46 Z', '#b0533c', C.ink, 1.8), win(-18, -30, 10, 10), win(18, -30, 10, 10), door(0, 0, 14, 22, C.brown), line('M-10 -20 L10 -4 M10 -20 L-10 -4', '#7a5236', 3.4)), noB(46, 26, 8), fig(94, C.green, 'frown', { h: 0.5 }), fig(110, C.orange, 'frown', { h: 0.46, hairStyle: 'long' }), arrow(100, 78, 116, 78, C.grey, 1.6)),
  // laglighetsprövning: the judge weighs the council's decision against the law book; the beam is level, so the decision follows the law.
  'kommun.laglighetsprövning': all(ground, scaleB(60, 52, 0, doc(0, -10, 0.5, { band: KG }), book(0, -9, 0.4, '#7a3b2e', scalesI(0, -4, 0.8)), 1), check(60, 30, 1), mini(18, 32, C.dark, 'flat', 0.9), gavel(28, 44, 0.4), kb(102, 18, 0.7)),
  // förvaltningsrätt: the court building with the balance: on one side a resident, on the other the town hall.
  'kommun.förvaltningsrätt': all(ground, court(60, 76, 1), fig(14, C.orange, 'smile', { h: 0.42 }), thall(104, 112, 0.36), arrow(26, 98, 36, 90, HL, 1.6), arrow(92, 98, 84, 90, HL, 1.6), desk(28, 92, 92), mini(60, 82, C.dark, 'flat', 0.7)),
  // vinna laga kraft: three weeks pass with no appeal (days crossed out) and the decision gets a padlock: now it stands.
  'kommun.vinna-laga-kraft': all(cal(6, 6, 60, 3, (i) => (i < 21 ? '#e8ecf0' : null), { mark: (i) => (i < 21 ? line('M-2 -2 L2 2 M2 -2 L-2 2', C.grey, 0.8) : '') }), arrow(70, 32, 86, 50, HL, 2.2), doc(86, 82, 1.2, { band: KG }), padlock(98, 96, 0.9), greyed(noB(28, 92, 9)), line('M18 102 L38 82', RED, 2)),

  // ── Medborgarförslag ─────────────────────────────────────────────
  // medborgarförslag: an ordinary resident drops her paper with an idea (light bulb) into the post box of the town hall.
  'kommun.medborgarförslag': all(ground, thall(88, 112, 0.6), rect(56, 76, 14, 18, C.yellow, 2, C.ink, 1.3), line('M59 81 L67 81', C.ink, 1.4), line('M63 94 L63 112', C.ink, 2), fig(26, C.orange, 'smile', { h: 0.85, hairStyle: 'long' }), reach(26, 0.85, 1, 50, 70), doc(50, 62, 0.6, { inner: bulb(0, 4, 0.8) }), bulb(26, 6, 0.9)),
  // e-förslag: the proposal (light bulb) on a laptop screen collects thumbs up from many people.
  'kommun.e-förslag': all(laptop(60, 88, 1.3, all(rect(-20, -34, 22, 26, C.white, 1, C.ink, 0.8), bulb(-9, -22, 0.7), thumb(14, -22, 0.7), T(14, -10, '127', 6, C.navy))), ...[[12, 26], [32, 14], [88, 14], [108, 26]].map(([x, y], i) => all(mini(x!, y!, PC[i]!, 'smile', 0.6), thumb(x! + 10, y! + 4, 0.4)))),
  // förslagsställare: she is the one with the idea (light bulb) whose paper is on the board; the other people are grey.
  'kommun.förslagsställare': all(ground, greyed(fig(16, C.grey, 'smile', { h: 0.62 }), fig(104, C.grey, 'smile', { h: 0.62 })), fig(60, PC[2]!, 'laugh', { h: 0.9, hairStyle: 'long' }), bulb(60, 4, 1), reach(60, 0.9, 1, 84, 52), doc(88, 44, 0.7, { inner: bulb(0, 4, 0.6) }), arrow(78, 18, 70, 12, HL, 1.6)),
  // motivering: to her idea (paper with a bulb) she adds the reason: a fast car beside a child, so a crossing is needed.
  'kommun.motivering': all(doc(28, 40, 1.1, { inner: bulb(0, 4, 0.9) }), arrow(48, 40, 62, 40, HL, 2), rect(64, 12, 52, 56, C.white, 3, C.ink, 1.6), rect(66, 52, 48, 12, '#9aa0a8', 0, null), g('translate(80 52)', rect(-10, -8, 20, 8, C.red, 2, C.ink, 1), circle(-6, 0, 2, C.dark, null), circle(6, 0, 2, C.dark, null)), line('M64 46 L56 46 M66 42 L60 42', C.grey, 1.2), mini(104, 40, C.green, 'frown', 0.6), excl(98, 22, 11), q(28, 92, 22), arrow(40, 92, 60, 72, HL, 2)),
  // bifalla: the chair's gavel comes down and the proposal gets the green tick.
  'kommun.bifalla': all(ground, desk(4, 116, 86), mini(30, 74, C.navy), gavel(50, 66, 0.9, -40), doc(82, 58, 1.2, { band: PC[1], inner: stamp(0, 6, 0.8) }), path('M44 74 l-4 4 M50 78 l0 5 M56 74 l4 4', 'none', C.gold, 1.4), okB(100, 20, 10)),
  // medborgardialog: politicians and residents sit in a ring round the map and talk with each other.
  'kommun.medborgardialog': all(ground, ellipse(60, 80, 28, 10, C.tan, C.ink, 1.4), path('M46 78 L72 76 L76 82 L50 84 Z', '#eaf5e2', C.ink, 0.8), ...[[22, 62, C.navy], [44, 50, PC[3]!], [76, 50, PC[5]!], [98, 62, C.navy], [32, 98, PC[2]!], [88, 98, PC[0]!]].map(([x, y, c], i) => mini(x as number, y as number, c as string, 'smile', 0.85, i % 2 === 1)), say(26, 24, 22, 18, 22, 50, bulb(26, 26, 0.6)), say(94, 24, 22, 18, 98, 50, heartM(94, 24, 0.45)), say(60, 18, 20, 16, 60, 38, q(60, 18, 10))),
  // underskrift: a hand writes a signature on the line at the bottom of the paper.
  'kommun.underskrift': all(rect(14, 10, 92, 100, C.white, 3, C.ink, 1.8), ...[0, 1, 2, 3, 4].map((i) => line(`M24 ${26 + i * 10} L96 ${26 + i * 10}`, C.grey2, 2)), line('M24 92 L80 92', C.ink, 1.4), path('M26 88 C30 76 36 76 34 86 C33 92 40 74 44 84 C46 90 50 80 54 86 C56 89 60 84 64 86', 'none', C.navy, 2), pen(66, 86, 1.2, 40), hnd(78, 72, 6)),
  // farthinder: the striped bump across the street makes the car slow down.
  'kommun.farthinder': all(rect(0, 84, 120, 28, '#9aa0a8', 0, null), path('M66 98 C72 86 92 86 98 98 Z', '#f2c14e', C.ink, 1.4), line('M74 96 L78 89 M82 96 L85 88 M90 96 L92 91', C.white, 2.6), g('translate(36 92) rotate(-4)', path('M-22 0 L-22 -10 L-12 -12 L-6 -20 L10 -20 L16 -12 L22 -10 L22 0 Z', '#5aa7e8', C.ink, 1.6), path('M-4 -18 L-8 -12 L12 -12 L7 -18 Z', '#d8eef8', C.ink, 1), circle(-12, 0, 5, C.dark, C.ink, 1.2), circle(12, 0, 5, C.dark, C.ink, 1.2)), line('M6 76 L12 76 M4 82 L10 82', C.grey, 1.6), g('translate(98 54)', line('M0 0 L0 30', C.ink, 2), path('M-12 0 L12 0 L0 -20 Z', C.white, RED, 3), path('M-6 -4 C-4 -10 4 -10 6 -4 Z', C.ink, null))),

  // ── Kommunal självstyrelse ───────────────────────────────────────
  // självstyrelse: inside its own border the kommun decides itself (gavel) and keeps its own coins; the state stays outside (grey).
  'kommun.självstyrelse': all(ground, dash('M40 8 L116 8 L116 112 L40 112 Z', KG, 2.4, '6 4'), rect(42, 10, 72, 100, '#f1f8ea', 2, null), thall(76, 112, 0.8), gavel(58, 40, 0.8, -30), stack(100, 40, 4, 6), kb(104, 18, 0.8), greyed(statehouse(20, 112, 0.5)), cross(22, 50, 0.7, C.grey)),
  // kommunal: things that belong to the kommun carry its green badge (school, bus, library); the private shop has none and is grey.
  'kommun.kommunal': all(ground, schoolI(28, 34, 2), kb(46, 18, 0.8), busI(84, 38, 1.4), kb(104, 22, 0.8), g('translate(30 98)', rect(-20, -20, 40, 20, '#efe3c8', 1, C.ink, 1.4), bookI(0, -10, 1.2)), kb(52, 80, 0.8), greyed(shopI(90, 96, 1.1))),
  // beskattningsrätt: the law book gives the kommun the right (arrow with a key-like tick) to collect coins from the houses.
  'kommun.beskattningsrätt': all(ground, book(22, 40, 1, '#3a6ab0', flagSE(-4, 4, 0.5)), arrow(40, 40, 58, 52, HL, 2), check(50, 36, 0.8), thall(80, 112, 0.6), rect(72, 62, 16, 4, C.ink, 1, null), ...[[18, 104], [40, 104]].map(([x, y]) => hs(x!, y!, 1.1)), coin(56, 78, 4), coin(66, 72, 4), arrow(30, 88, 62, 70, HL, 1.4)),
  // kommunallag: the thick law book with the kommun badge on the cover, and a gavel.
  'kommun.kommunallag': all(ground, book(54, 64, 2, '#7a3b2e', kb(0, -4, 0.9)), gavel(98, 92, 1.1, -30), thall(100, 44, 0.3)),
  // kommunsammanslagning: two small kommuner (each with a badge) are pushed together into one big kommun.
  'kommun.kommunsammanslagning': all(path('M8 20 L36 14 L40 50 L10 56 Z', KG2, C.ink, 1.4), path('M8 66 L40 60 L42 98 L12 104 Z', KG2, C.ink, 1.4), kb(24, 34, 0.7), kb(26, 82, 0.7), arrow(46, 36, 62, 50, HL, 2.2), arrow(48, 80, 62, 66, HL, 2.2), path('M68 20 L110 16 L114 104 L72 106 Z', KG2, C.ink, 2), dash('M70 60 L112 58', C.grey, 1.2), kb(92, 58, 1.1), hs(82, 34, 0.8), hs(98, 88, 0.8)),
  // glesbygd: a wide forest land with a long road and only one house here and one far away.
  'kommun.glesbygd': all(rect(0, 60, 120, 52, '#d9efc8', 0, null), path('M0 60 L18 44 L36 56 L58 36 L82 54 L102 40 L120 52 L120 60 Z', '#b9c9d8', null), path('M58 112 C60 92 70 76 92 64', 'none', '#9aa0a8', 6), hs(30, 96, 1.6), hs(100, 66, 0.6), ...[[8, 84], [14, 92], [48, 78], [56, 70], [70, 96], [80, 104], [96, 88], [110, 96], [112, 76], [40, 106]].map(([x, y]) => pine(x!, y!, 0.6)), ...[[20, 22], [38, 16]].map(([x, y]) => path(`M${x} ${y} q3 -3 6 0 q3 -3 6 0`, 'none', C.ink, 1))),
  // länsstyrelse: the state's building (columns and flag) stands in the county; its inspector checks the town hall with a list.
  'kommun.länsstyrelse': all(ground, statehouse(30, 112, 0.7), fig(66, C.navy, 'smile', { h: 0.72 }), reach(66, 0.72, 1, 82, 70), g('translate(86 70)', rect(-6, -8, 12, 16, C.tan, 1, C.ink, 1), rect(-4, -5, 8, 11, C.white, 0, null), check(0, -1, 0.4)), thall(102, 112, 0.36), mapR(4, 4, 0.36, (i) => (i === 2 ? RB2 : '#e4e7ea'))),
  // invånarantal: the people of a town are counted: rows of people beside their houses and a counter.
  'kommun.invånarantal': all(ground, hs(16, 50, 1.4), hs(40, 46, 1.2), hs(28, 30, 1), ...Array.from({ length: 15 }, (_, i) => mini(60 + (i % 5) * 12, 34 + Math.floor(i / 5) * 24, PC[i % 6]!, 'smile', 0.55, i % 2 === 0)), rect(10, 84, 44, 20, C.black, 4, C.ink, 1.4), T(32, 99, '15', 14, '#7ef0a0'), arrow(56, 94, 62, 94, HL, 1.4)),
  // utjämningssystem: money goes (arrow) from the rich kommun with a big stack to the poor one with a small stack, so the scale becomes level.
  'kommun.utjämningssystem': all(ground, kb(20, 18, 0.9), kb(100, 18, 0.9), stack(20, 70, 9, 8), stack(100, 70, 2, 8), path('M36 40 C52 26 68 26 84 40', 'none', HL, 2.4), path('M84 40 l-7 -1 l4 -6 Z', HL, HL, 1), coin(60, 26, 4), scaleB(60, 76, 0, stack(0, -2, 3, 5), stack(0, -2, 3, 5), 0.7)),
};
