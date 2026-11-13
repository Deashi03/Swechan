/**
 * Historia & humaniora → Filosofi & etik → Kunskapsteori, 2211–2217 (0.39): knowing and believing, experience
 * and reason, scepticism, evidence, justification, perspective and interpretation, and the limits of knowledge.
 * Abstract words are symbolic mini-scenes: the coloured idea dominates and a grey copy stands beside it as
 * contrast. Philosophers are small neutral figures in robes, never portraits. Beliefs are thought bubbles,
 * reasons are stones and pillars, evidence is charts and documents. Digits, ? and ! only; no words, no letters
 * and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, star, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm, cloud, crossedArms } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Colours ──────────────────────────────────────────────────────────
const GOLD = C.gold;
const PAPER = '#f6f2ea';
const DAY = '#d6ecf7';
const NIGHT = '#24315a';
const PARCH = '#f3e6c4';
const ROBE = '#7a5aa6';
const ROBE2 = '#3f7f6a';
const STONE = '#cbbf9f';
const WOOD = '#a8743f';
const GRASS = '#7fbf6a';
const SEA = '#5aa7d6';
const GREY = '#8d949c';
const OK = '#3f9a5a';
const f1 = (n: number) => n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);

// ── Figures ──────────────────────────────────────────────────────────
const ground = line('M4 112 L116 112', C.grey2, 2);
const bg = (col: string = PAPER) => rect(4, 4, 112, 108, col, 3, null);
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, hy: ty - 56 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, 3 * Math.max(0.6, h), C.skin, C.ink, 1.2)); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
const robeL = (col: string) => path('M-13 -40 L13 -40 L16 48 L-16 48 Z', col, C.ink, 1.4);
/** A philosopher in a long robe (no portrait). */
const sage = (x: number, h = 1, col: string = ROBE, mood: Mood = 'smile') => all(fig(x, col, mood, { h, bottom: col }), on(x, h, robeL(col), line('M-12 -36 L12 -36', GOLD, 2), line('M0 -40 L0 46', 'rgba(0,0,0,0.18)', 1.4)));
/** Hand at the chin (thinking). */
const chin = (x: number, h = 1) => { const q = geo(x, h); return reach(x, h, 1, x + 3 * q.s, q.hy + 12 * q.s); };
/** A thought cloud at (x, y) with a trail of dots towards (tx, ty). */
const think = (x: number, y: number, rx: number, ry: number, inner: Svg, tx: number, ty: number) => { const ex2 = x - tx, ey = y + ry * 0.6 - ty; return all(
  circle(+f1(tx + ex2 * 0.2), +f1(ty + ey * 0.2), 2.2, C.white, C.ink, 1.1), circle(+f1(tx + ex2 * 0.42), +f1(ty + ey * 0.42), 3.2, C.white, C.ink, 1.2),
  ellipse(x, y, rx, ry, C.white, C.ink, 1.6), inner); };
/** A speech bubble centred at (x, y); the tail goes towards (tx, ty). */
const say = (x: number, y: number, w: number, h: number, inner: Svg, tx: number, ty: number) => all(
  path(`M${f1(x - 4)} ${f1(y + h / 2 - 1)} L${tx} ${ty} L${f1(x + 4)} ${f1(y + h / 2 - 1)} Z`, C.white, C.ink, 1.4),
  rect(x - w / 2, y - h / 2, w, h, C.white, 6, C.ink, 1.6), line(`M${f1(x - 3.4)} ${f1(y + h / 2)} L${f1(x + 3.4)} ${f1(y + h / 2)}`, C.white, 2.4), inner);

// ── Things ───────────────────────────────────────────────────────────
const qm = (x: number, y: number, size = 14, col: string = HL) => T(x, y, '?', size, col);
const ex = (x: number, y: number, size = 14, col: string = C.red) => T(x, y, '!', size, col);
const check = (x: number, y: number, s = 1, col: string = OK) => at(x, y, s, circle(0, 0, 8, C.white, col, 1.6), line('M-4 0 L-1 3 L4 -3', col, 2.2));
const cross = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, circle(0, 0, 8, C.white, col, 1.6), line('M-3.5 -3.5 L3.5 3.5 M3.5 -3.5 L-3.5 3.5', col, 2.2));
const tick = (x: number, y: number, s = 1, col: string = OK) => at(x, y, s, line('M-5 0 L-1.5 4 L5 -4', col, 2.6));
const sunS = (x: number, y: number, r = 7) => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 5))} ${f1(y + Math.sin(a) * (r + 5))}`, GOLD, 1.6); }), circle(x, y, r, C.yellow, C.ink, 1.2));
const rays = (x: number, y: number, r1: number, r2: number, n = 12, col: string = GOLD, sw = 1.6) => all(...Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * r1)} ${f1(y + Math.sin(a) * r1)} L${f1(x + Math.cos(a) * r2)} ${f1(y + Math.sin(a) * r2)}`, col, sw); }));
const glow = (x: number, y: number, r: number, col = 'rgba(242,193,78,0.35)') => circle(x, y, r, col, null);
const bulb = (x: number, y: number, s = 1, lit = true) => at(x, y, s, lit ? glow(0, -2, 14) : '', circle(0, -2, 8, lit ? C.yellow : C.grey2, C.ink, 1.4), rect(-4, 5, 8, 6, C.silver, 1.5, C.ink, 1.1), line('M-3 -2 L0 2 L3 -2', lit ? '#b8860b' : GREY, 1));
const gear = (x: number, y: number, r = 8, col: string = '#8a8f98') => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return circle(+f1(x + Math.cos(a) * r), +f1(y + Math.sin(a) * r), r * 0.3, col, C.ink, 0.8); }), circle(x, y, r, col, C.ink, 1.2), circle(x, y, r * 0.35, C.white, C.ink, 1));
/** An open book. */
const book = (x: number, y: number, s = 1, cover: string = ROBE, lines = true) => at(x, y, s,
  path('M0 6 C-8 2 -18 2 -24 6 L-24 -12 C-18 -16 -8 -16 0 -12 Z', '#fbf5e4', C.ink, 1.2), path('M0 6 C8 2 18 2 24 6 L24 -12 C18 -16 8 -16 0 -12 Z', '#fbf5e4', C.ink, 1.2),
  path('M-24 6 C-18 2 -8 2 0 6 C8 2 18 2 24 6 L24 8 C18 4 8 4 0 8 C-8 4 -18 4 -24 8 Z', cover, C.ink, 1),
  lines ? line('M-20 -8 L-4 -10 M-20 -3 L-4 -5 M-20 2 L-4 0 M4 -10 L20 -8 M4 -5 L20 -3 M4 0 L20 2', '#9a8f7a', 1) : '');
const cbook = (x: number, y: number, s = 1, col: string = ROBE) => at(x, y, s, rect(-10, -13, 20, 26, col, 2, C.ink, 1.3), line('M-7 -13 L-7 13', 'rgba(0,0,0,0.25)', 1.4));
const scroll = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x, y, w, h, PARCH, 1, C.ink, 1.3), rect(x - 3, y - 3, 4, h + 6, '#d9c08a', 2, C.ink, 1.1), rect(x + w - 1, y - 3, 4, h + 6, '#d9c08a', 2, C.ink, 1.1), inner);
/** A white card (claim, statement) centred at (x, y). */
const card = (x: number, y: number, w: number, h: number, inner: Svg = '', col: string = C.white) => all(rect(x - w / 2, y - h / 2, w, h, col, 3, C.ink, 1.4), inner);
const textLines = (x: number, y: number, w: number, n = 3, col = '#9aa3ad') => line(Array.from({ length: n }, (_, i) => `M${x} ${y + i * 5} L${x + w - (i === n - 1 ? w * 0.35 : 0)} ${y + i * 5}`).join(' '), col, 1.4);
/** A bar chart on a sheet. */
const chart = (x: number, y: number, s = 1, col: string = SEA) => at(x, y, s, rect(-14, -16, 28, 32, C.white, 2, C.ink, 1.3), line('M-9 10 L-9 -10 M-9 10 L10 10', C.ink, 1.1), rect(-6, 0, 4, 10, col, 0.5, null), rect(-1, -4, 4, 14, col, 0.5, null), rect(4, -9, 4, 19, col, 0.5, null));
const eye = (x: number, y: number, s = 1, col: string = '#5a8ac6') => at(x, y, s, path('M-12 0 C-6 -8 6 -8 12 0 C6 8 -6 8 -12 0 Z', C.white, C.ink, 1.4), circle(0, 0, 4.4, col, C.ink, 1), circle(0, 0, 1.8, C.ink, null), circle(1.4, -1.4, 0.9, C.white, null));
const ear = (x: number, y: number, s = 1) => at(x, y, s, path('M-4 -10 C6 -14 12 -4 6 4 C3 8 2 12 -2 12 C-5 12 -6 9 -4 7', C.skin, C.ink, 1.4), path('M-1 -5 C4 -7 7 -2 3 2', 'none', C.ink, 1));
const handIcon = (x: number, y: number, s = 1) => at(x, y, s, ...[-4.6, -1.6, 1.4, 4.4].map((d, i) => rect(d - 1.3, -9 + Math.abs(i - 1.5) * 1.2, 2.6, 9, C.skin, 1.3, C.ink, 0.9)), path('M-5.5 -1 L5.5 -1 L5 5 C4 8 -4 8 -5 5 Z', C.skin, C.ink, 1), path('M-5.4 1 L-9 -3 C-10 -4 -11 -2 -10 -1 L-5 5', C.skin, C.ink, 1));
const palm = handIcon;
/** A head in profile facing right, with an outlined brain area. */
const head = (x: number, y: number, s = 1, col: string = C.skin) => at(x, y, s,
  path('M-16 18 L-16 6 C-24 -4 -22 -24 -4 -26 C12 -28 20 -16 18 -6 L22 2 L18 4 L18 10 C18 14 12 14 8 13 L8 18 Z', col, C.ink, 1.6),
  circle(10, -6, 1.4, C.ink, null));
const magnifier = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, line('M6 6 L15 15', C.brown, 4), circle(0, 0, 8, 'rgba(200,230,250,0.6)', C.ink, 1.8));
const pill = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, rect(-7, -3, 14, 6, C.white, 3, C.ink, 1.1), path('M0 -3 L4 -3 C8 -3 8 3 4 3 L0 3 Z', col, null), rect(-7, -3, 14, 6, 'none', 3, C.ink, 1.1));
const house = (x: number, y: number, s = 1, col: string = '#f2ece0', roof: string = '#c0563d') => at(x, y, s, rect(-12, -16, 24, 16, col, 1, C.ink, 1.3), path('M-15 -16 L0 -28 L15 -16 Z', roof, C.ink, 1.3), rect(-3, -9, 6, 9, '#8a5a34', 1, C.ink, 0.9));
const keyIcon = (x: number, y: number, s = 1, col: string = GOLD, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, circle(-8, 0, 5, 'none', col, 2.6), line('M-3 0 L10 0 M6 0 L6 4 M10 0 L10 4', col, 2.6));
const gauge = (x: number, y: number, r: number, v: number, col: string = OK) => { const a = Math.PI * (1 - v); return all(path(`M${x - r} ${y} A${r} ${r} 0 0 1 ${x + r} ${y} Z`, C.white, C.ink, 1.6), path(`M${x - r * 0.8} ${y} A${r * 0.8} ${r * 0.8} 0 0 1 ${f1(x + Math.cos(a) * r * 0.8)} ${f1(y - Math.sin(a) * r * 0.8)}`, 'none', col, r * 0.22), line(`M${x} ${y} L${f1(x + Math.cos(a) * r * 0.7)} ${f1(y - Math.sin(a) * r * 0.7)}`, C.ink, 2.2), circle(x, y, 2.4, C.ink, null)); };
const pillar = (x: number, y: number, h: number, col: string = STONE) => all(rect(x - 6, y - h, 12, h, col, 0.5, C.ink, 1.2), rect(x - 8, y - h - 4, 16, 4, col, 0.5, C.ink, 1.1), rect(x - 8, y - 4, 16, 4, col, 0.5, C.ink, 1.1), line(`M${x - 2} ${y - h + 2} L${x - 2} ${y - 6} M${x + 2} ${y - h + 2} L${x + 2} ${y - 6}`, 'rgba(0,0,0,0.2)', 0.9));
const stoneBlock = (x: number, y: number, w: number, h: number, col: string = STONE) => all(rect(x, y, w, h, col, 2, C.ink, 1.4), line(`M${x + w * 0.3} ${y} L${x + w * 0.3} ${y + h * 0.5} M${x} ${y + h * 0.5} L${x + w} ${y + h * 0.5} M${x + w * 0.7} ${y + h * 0.5} L${x + w * 0.7} ${y + h}`, 'rgba(0,0,0,0.25)', 1));
const swan = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M-12 0 C-12 -6 2 -8 8 -2 C10 0 8 6 0 6 L-8 6 C-12 6 -14 2 -12 0 Z', col, C.ink, 1.2), path('M6 -2 C4 -10 6 -16 10 -16 C13 -16 13 -12 11 -12', 'none', col === C.white ? C.ink : col, 3.4), path('M6 -2 C4 -10 6 -16 10 -16 C13 -16 13 -12 11 -12', 'none', col, 2), path('M11 -14 L15 -13 L11 -12 Z', C.orange, null));
const waterLine = (y: number) => line(`M6 ${y} C14 ${y - 3} 22 ${y + 3} 30 ${y} C38 ${y - 3} 46 ${y + 3} 54 ${y} C62 ${y - 3} 70 ${y + 3} 78 ${y} C86 ${y - 3} 94 ${y + 3} 102 ${y} C108 ${y - 2} 112 ${y + 2} 114 ${y}`, SEA, 1.6);
const frame = (x: number, y: number, w: number, h: number, inner: Svg = '', col: string = GOLD) => all(rect(x - 3, y - 3, w + 6, h + 6, col, 1, C.ink, 1.4), rect(x, y, w, h, C.white, 0, C.ink, 1), inner);
const tree = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s, rect(-2.5, -16, 5, 16, C.brown, 1, C.ink, 1), circle(0, -24, 11, col, C.ink, 1.2), circle(-7, -19, 7, col, C.ink, 1.2), circle(7, -19, 7, col, C.ink, 1.2));
const flag = (x: number, y: number, col: string = C.red) => all(line(`M${x} ${y} L${x} ${y - 22}`, C.ink, 1.8), path(`M${x} ${y - 22} L${x + 12} ${y - 18} L${x} ${y - 14} Z`, col, C.ink, 1));
const trophy = (x: number, y: number, s = 1) => at(x, y, s, path('M-7 -10 L7 -10 L6 -2 C5 3 -5 3 -6 -2 Z', GOLD, C.ink, 1.2), path('M-7 -8 C-12 -8 -12 -2 -6 -1 M7 -8 C12 -8 12 -2 6 -1', 'none', C.ink, 1.1), rect(-2, 2, 4, 5, GOLD, 0.5, C.ink, 1), rect(-6, 7, 12, 3, WOOD, 0.5, C.ink, 1));
const target = (x: number, y: number, r: number, gr = false) => all(...[1, 0.72, 0.44, 0.18].map((k, i) => circle(x, y, r * k, gr ? [C.grey2, C.white, C.grey2, GREY][i]! : [C.white, '#e45b5b', C.white, '#e45b5b'][i]!, C.ink, 1.1)));
const dart = (x: number, y: number, rot = -30, col: string = C.navy) => g(`translate(${x} ${y}) rotate(${rot})`, line('M0 0 L-14 0', col, 2), path('M-14 0 L-19 -3 L-17 0 L-19 3 Z', col, null), circle(0, 0, 1.2, C.ink, null));

export const EPISTEMOLOGY_MOTIFS: Record<string, Svg> = {
  // ── 2211 Att veta och tro ──
  /** tro (uppfattning): he goes home in the belief that the meeting is over (empty room in his thought); behind the window it is still going on. */
  'kun.tro.2': all(bg(), rect(56, 14, 56, 40, '#e8eef2', 2, C.ink, 1.4), line('M84 14 L84 54', C.ink, 1.2), greyed(rect(62, 40, 44, 5, WOOD, 1, C.ink, 1), ...[68, 80, 92, 102].map((x) => all(circle(x, 30, 4, C.grey2, C.ink, 1), path(`M${x - 5} 40 C${x - 5} 34 ${x + 5} 34 ${x + 5} 40 Z`, C.grey, C.ink, 1)))),
    fig(24, '#7a4a2a', 'smile', { h: 0.82 }), reach(24, 0.82, -1, 10, 74), at(8, 80, 0.8, rect(-6, -6, 12, 12, '#5a3a20', 2, C.ink, 1.2)),
    think(66, 74, 22, 14, all(rect(52, 72, 24, 4, WOOD, 1, C.ink, 0.8), line('M56 76 L56 82 M72 76 L72 82', C.brown, 1.2), tick(82, 70, 0.7)), 32, 46), arrow(46, 104, 6, 104, HL, 2), ground),
  /** gissning: a jar of marbles and a guess with a question mark. */
  'kun.gissning': all(bg(), fig(34, C.green, 'smile', { h: 0.8 }), chin(34, 0.8),
    think(82, 26, 22, 14, all(T(78, 31, '20', 12, C.navy), qm(94, 31, 12)), 44, 40),
    path('M70 112 L70 70 C70 64 74 62 78 62 L94 62 C98 62 102 64 102 70 L102 112 Z', 'rgba(200,230,250,0.55)', C.ink, 1.6),
    ...[[76, 106], [84, 106], [92, 106], [98, 104], [80, 99], [88, 99], [96, 98], [74, 92], [84, 92], [92, 91], [78, 85], [88, 84], [96, 84], [82, 78], [92, 77]].map(([x, y], i) => circle(x!, y!, 3.4, [C.red, C.yellow, SEA, C.green, C.purple][i % 5]!, C.ink, 0.8)),
    rect(72, 58, 28, 5, WOOD, 1, C.ink, 1.1)),
  /** förmoda: from the clue (wet umbrella, wet footprints) she concludes "probably rain"; a grey die = a pure guess as contrast. */
  'kun.förmoda': all(bg(), fig(32, C.orange, 'smile', { h: 0.84, hairStyle: 'long' }), chin(32, 0.84),
    g('translate(78 104) rotate(-10)', line('M0 0 L0 -34', C.ink, 1.6), path('M-14 -30 C-14 -42 14 -42 14 -30 C10 -33 6 -33 0 -30 C-6 -33 -10 -33 -14 -30 Z', C.navy, C.ink, 1.3)), ...[[70, 108], [84, 109], [92, 106]].map(([x, y]) => ellipse(x!, y!, 4, 1.6, SEA, null)),
    ...[[74, 74], [80, 82], [86, 76]].map(([x, y]) => path(`M${x} ${y! - 4} C${x! + 3} ${y} ${x! + 2} ${y! + 3} ${x} ${y! + 3} C${x! - 2} ${y! + 3} ${x! - 3} ${y} ${x} ${y! - 4} Z`, SEA, C.ink, 0.6)),
    arrow(70, 60, 66, 42, HL, 2), think(82, 22, 22, 13, all(cloud(78, 22, 0.6, '#9aa3ad'), line('M74 30 l-2 4 M80 31 l-2 4', SEA, 1.4), tick(96, 22, 0.7)), 44, 36),
    greyed(at(104, 60, 1, rect(-7, -7, 14, 14, C.white, 2, C.ink, 1.2), circle(-3, -3, 1.4, C.ink, null), circle(3, 3, 1.4, C.ink, null), circle(0, 0, 1.4, C.ink, null)), cross(104, 76, 0.6)), ground),
  /** med säkerhet: the needle stands at the very top – completely sure; a grey meter at half as contrast. */
  'kun.med-säkerhet': all(bg(), gauge(74, 62, 34, 1), check(104, 22, 1.2), T(74, 80, '100', 13, OK),
    greyed(gauge(98, 106, 12, 0.5)), fig(22, '#3f6fb5', 'smile', { h: 0.8 }), ground),
  /** visshet: the doubt clears – "?" in grey fog, then a bright, sharp check mark. */
  'kun.visshet': all(bg(), greyed(cloud(24, 40, 1.4, C.grey2), qm(24, 46, 16, GREY)), arrow(42, 44, 58, 44, HL, 2.6),
    rays(84, 44, 20, 28, 14, GOLD, 2), circle(84, 44, 18, C.white, OK, 3), line('M75 44 L82 51 L94 36', OK, 4.4),
    fig(60, C.orange, 'laugh', { h: 0.5, hairStyle: 'long' }), ground),
  /** tvärsäker: arms crossed, a big "!" – he will not even look at the book that is offered. */
  'kun.tvärsäker': all(bg(), fig(40, C.red, 'angry', { h: 0.94 }), crossedArms(40), say(70, 22, 24, 20, all(ex(66, 29, 15, C.red), ex(76, 29, 15, C.red)), 50, 26),
    greyed(fig(96, C.grey, 'smile', { h: 0.72 }), reach(96, 0.72, -1, 80, 76), cbook(78, 74, 0.55, GREY), qm(98, 40, 12, GREY)), ground),
  /** vetande: a thought holding a solid book with a check mark (knowing); a grey cloud with "?" (only believing). */
  'kun.vetande': all(bg(), sage(32, 0.9, ROBE2), think(78, 34, 30, 22, all(book(78, 40, 0.8, ROBE2), check(92, 22, 1)), 42, 34),
    greyed(cloud(90, 90, 0.9, C.grey2), qm(90, 94, 11, GREY)), ground),
  /** villfarelse: he happily believes that the earth is flat; the real round earth stands behind him. */
  'kun.villfarelse': all(bg(NIGHT), circle(86, 74, 22, SEA, C.ink, 1.4), path('M74 62 C80 58 86 64 82 70 C78 74 72 70 74 62 Z M90 76 C96 72 102 78 98 86 C94 88 88 84 90 76 Z', GRASS, C.ink, 0.8),
    ...[[14, 14], [40, 10], [62, 18], [108, 12], [100, 40]].map(([x, y]) => circle(x!, y!, 1.2, '#f6e8a8', null)),
    fig(30, C.orange, 'laugh', { h: 0.8 }), think(54, 30, 22, 13, all(ellipse(54, 32, 15, 4, SEA, C.ink, 1), ellipse(54, 30, 10, 2.4, GRASS, null), tick(70, 26, 0.7)), 34, 40)),
  /** kunskapsteori: a philosopher weighing a thought with "?" against a book that is known. */
  'kun.kunskapsteori': all(bg('#efe9f6'), sage(28, 0.9), chin(28, 0.9),
    think(80, 30, 30, 20, all(eye(68, 30, 0.7), qm(80, 36, 14, HL), book(94, 34, 0.42, ROBE)), 40, 30),
    line('M60 90 L100 90 M80 90 L80 70', C.ink, 2), path('M58 90 C58 96 70 96 70 90 Z M90 90 C90 96 102 96 102 90 Z', GOLD, C.ink, 1.1), qm(64, 88, 10, HL), check(96, 84, 0.6), rect(74, 106, 12, 6, C.ink, 1, null), line('M80 70 L80 106', C.ink, 2), ground),

  // ── 2212 Erfarenhet och förnuft ──
  /** tänkande: hand at the chin, gears turning in the thought. */
  'kun.tänkande': all(bg(), fig(36, '#3f6fb5', 'calm', { h: 0.9 }), chin(36, 0.9),
    think(80, 32, 28, 20, all(gear(72, 32, 7, '#e0b23c'), gear(88, 28, 5, '#8a8f98'), arrow(80, 46, 86, 42, HL, 1.6)), 44, 32), ground),
  /** härleda: from two known stones, step by step, to a new insight. */
  'kun.härleda': all(bg(), card(22, 30, 22, 18, check(22, 30, 0.8)), card(22, 62, 22, 18, check(22, 62, 0.8)),
    line('M33 30 C46 30 46 46 54 46 M33 62 C46 62 46 46 54 46', C.ink, 1.8), arrow(54, 46, 70, 46, HL, 2.6), bulb(88, 46, 1.4),
    ...[0, 1, 2].map((i) => rect(18 + i * 30, 96 - i * 8, 26, 8 + i * 8, STONE, 1, C.ink, 1.1)), ground),
  /** empirism: the eye, the ear and the hand fill the book of knowledge; thinking alone (grey head with a gear) is crossed out. */
  'kun.empirism': all(bg('#eaf3e4'), eye(20, 22, 0.9), ear(20, 52, 0.9), handIcon(20, 84, 1.1), arrow(34, 24, 56, 44, HL, 2.2), arrow(32, 52, 56, 54, HL, 2.2), arrow(32, 82, 56, 64, HL, 2.2),
    book(82, 56, 1.1, ROBE2), check(98, 30, 1), greyed(at(98, 98, 0.45, head(0, 0, 1)), gear(100, 94, 3.4, GREY), cross(110, 104, 0.6))),
  /** empirist: a philosopher studying a leaf through a magnifying glass, notebook ready. */
  'kun.empirist': all(bg('#eaf3e4'), sage(40, 0.94, ROBE2), reach(40, 0.94, 1, 70, 54), magnifier(78, 46, 1.2, 0), at(80, 46, 0.7, path('M0 -8 C8 -6 8 6 0 8 C-8 6 -8 -6 0 -8 Z', C.green, C.ink, 1), line('M0 -8 L0 8', '#2f6a3f', 1)),
    reach(40, 0.94, -1, 20, 74), at(16, 74, 1, rect(-8, -8, 14, 16, C.white, 1, C.ink, 1.2), textLines(-5, -4, 8, 3)), tree(100, 112, 0.8), ground),
  /** rationalism: geometry and gears glow inside the head; the eye stands grey outside. */
  'kun.rationalism': all(bg('#efe9f6'), head(60, 64, 1.6), path('M46 40 L76 40 L61 18 Z', 'none', HL, 2.2), circle(61, 32, 5, 'none', C.navy, 1.6), gear(56, 58, 6, GOLD), T(74, 66, '2+2=4', 8, C.navy),
    greyed(eye(100, 24, 0.8), cross(104, 38, 0.6))),
  /** rationalist: a philosopher with closed eyes, thinking out a triangle and a sum. */
  'kun.rationalist': all(bg('#efe9f6'), sage(32, 0.94, ROBE, 'calm'), chin(32, 0.94),
    think(80, 32, 30, 20, all(path('M66 40 L84 40 L75 24 Z', 'none', HL, 2), T(98, 38, '=4', 9, C.navy)), 44, 30), cbook(84, 96, 0.6, ROBE), ground),
  /** tabula rasa: a baby beside an empty tablet; a grey tablet full of writing as contrast. */
  'kun.tabula-rasa': all(bg(), rect(36, 18, 46, 56, '#d9c08a', 3, C.ink, 1.6), rect(40, 22, 38, 48, '#f6efd9', 2, C.ink, 1), sparkleS(74, 26),
    at(58, 96, 1.2, ellipse(0, 4, 13, 8, '#f6f2ea', C.ink, 1.2), circle(-8, -2, 7, C.skin, C.ink, 1.2), path('M-14 -4 C-14 -10 -2 -10 -2 -4', 'none', C.hair, 1.2), path('M-11 -2 Q-10 -3.5 -9 -2 M-7 -2 Q-6 -3.5 -5 -2', 'none', C.ink, 0.9)),
    greyed(rect(90, 40, 22, 30, '#d9c08a', 2, C.ink, 1.2), textLines(93, 45, 16, 5, C.ink)), ground),
  /** pröva sig fram: trying key after key – two fail, the third fits. */
  'kun.pröva-sig-fram': all(bg(), fig(28, C.orange, 'smile', { h: 0.84, hairStyle: 'long' }), reach(28, 0.84, 1, 58, 70), keyIcon(66, 70, 0.9, GOLD),
    rect(80, 48, 30, 44, WOOD, 2, C.ink, 1.4), circle(90, 70, 3, C.ink, null), path('M89 72 L88 78 L92 78 L91 72 Z', C.ink, null),
    keyIcon(54, 26, 0.7, GREY, -20), cross(70, 22, 0.7), keyIcon(86, 24, 0.7, GREY, 20), cross(102, 22, 0.7), check(96, 40, 0.8), ground),

  // ── 2213 Skepticism ──
  /** skeptiker: everybody cheers the miracle bottle – one person stands with arms crossed and a question mark. */
  'kun.skeptiker': all(bg(), at(60, 30, 1, rect(-6, -14, 12, 22, '#7fc6a4', 3, C.ink, 1.2), rect(-3, -18, 6, 4, C.brown, 1, C.ink, 1)), star(72, 20, 4, C.yellow), star(48, 18, 3, C.yellow),
    greyed(fig(20, C.grey, 'love', { h: 0.62 }), fig(46, C.grey, 'love', { h: 0.62 }), fig(74, C.grey, 'love', { h: 0.62 })),
    fig(100, '#5a6a8a', 'frown', { h: 0.82 }), crossedArms(100), qm(100, 14, 16, HL), ground),
  /** tvivla på: inside her head the check mark cracks and a question mark grows – quiet, inner doubt. */
  'kun.tvivla-på': all(bg(), fig(30, C.green, 'frown', { h: 0.84, hairStyle: 'long' }), chin(30, 0.84),
    think(76, 40, 32, 26, all(circle(70, 40, 14, C.white, OK, 2.4), line('M62 40 L68 46 L78 34', OK, 3.2), line('M72 26 L68 36 L74 42 L69 54', C.ink, 1.8), qm(96, 50, 20, HL)), 40, 36), ground),
  /** bedra: the deceiver holds a smiling mask in front of a sly face; the grey person trusts him. */
  'kun.bedra': all(bg(), greyed(fig(92, C.grey, 'smile', { h: 0.84 }), reach(92, 0.84, -1, 70, 74)),
    fig(34, '#4a3a5a', 'angry', { h: 0.92 }), reach(34, 0.92, 1, 52, 40), line('M52 40 L52 30', WOOD, 2),
    at(46, 20, 1, ellipse(0, 0, 11, 13, '#fbe3c4', C.ink, 1.4), path('M-6 -3 Q-4 -6 -2 -3 M2 -3 Q4 -6 6 -3', 'none', C.ink, 1.2), path('M-5 4 Q0 10 5 4', 'none', C.ink, 1.4)),
    reach(34, 0.92, -1, 18, 80), at(14, 84, 1, rect(-6, -6, 12, 12, '#8d8a86', 3, C.ink, 1.1)), ground),
  /** sinnesvilla: a straight stick looks broken in a glass of water. */
  'kun.sinnesvilla': all(bg(), path('M40 30 L44 104 C44 108 76 108 76 104 L80 30 Z', 'rgba(220,240,252,0.5)', C.ink, 1.8), path('M42 60 L78 60 L76 104 C76 108 44 108 44 104 Z', 'rgba(90,167,214,0.45)', null), line('M42 60 L78 60', SEA, 1.6),
    line('M36 14 L58 60', WOOD, 5), line('M66 60 L76 98', WOOD, 5), eye(98, 30, 0.9), qm(98, 52, 14, HL), greyed(line('M100 70 L100 106', WOOD, 4)), ground),
  /** skepticism: the whole world seen through a lens with a question mark; a grey closed book of fixed truths as contrast. */
  'kun.skepticism': all(bg('#efe9f6'), circle(54, 54, 30, SEA, C.ink, 1.6), path('M38 40 C48 34 56 44 50 52 C44 58 36 52 38 40 Z M60 58 C70 52 78 62 72 72 C66 76 58 70 60 58 Z', GRASS, C.ink, 1),
    circle(54, 54, 36, 'rgba(255,255,255,0.35)', C.ink, 3), line('M80 80 L100 100', C.brown, 7), T(54, 66, '?', 34, HL),
    greyed(cbook(102, 30, 0.8, GREY), check(102, 12, 0.6, GREY))),
  /** metodiskt tvivel: everything on the list is crossed out – only the thinking itself gets a check mark. */
  'kun.metodiskt-tvivel': all(bg('#efe9f6'), sage(24, 0.86, ROBE), at(76, 60, 1, rect(-26, -46, 52, 92, PARCH, 2, C.ink, 1.4)),
    eye(64, 26, 0.6), cross(92, 26, 0.7), circle(64, 46, 6, SEA, C.ink, 1), cross(92, 46, 0.7), handIcon(64, 68, 0.9), cross(92, 66, 0.7),
    at(64, 90, 0.5, head(0, 0, 1)), gear(64, 86, 3, GOLD), check(92, 88, 0.9), reach(24, 0.86, 1, 46, 70), ground),
  /** ovedersäglig: arrows of objection break against a solid stone with a check mark. */
  'kun.ovedersäglig': all(bg(), stoneBlock(54, 44, 48, 60), check(78, 74, 1.6),
    arrow(8, 40, 46, 56, C.grey, 2.2), arrow(8, 72, 46, 72, C.grey, 2.2), arrow(8, 104, 46, 90, C.grey, 2.2),
    line('M48 54 L42 48 M48 54 L42 58 M48 72 L42 66 M48 72 L42 78 M48 90 L42 84 M48 90 L42 96', GREY, 1.4), ground),

  // ── 2214 Evidens och belägg ──
  /** evidens: research – a microscope, and a chart where many measurements together show a clear trend. */
  'kun.evidens': all(bg('#eef4f8'), at(24, 104, 1, rect(-12, -4, 24, 4, C.dark, 1, C.ink, 1), path('M-2 -4 L-2 -40 L6 -44 L10 -36 L4 -32 L4 -4 Z', '#cfd6dd', C.ink, 1.2), rect(-8, -22, 16, 3, C.dark, 1, null), rect(4, -50, 6, 10, C.dark, 1, C.ink, 1)),
    rect(42, 18, 66, 70, C.white, 2, C.ink, 1.4), line('M50 80 L50 26 M50 80 L102 80', C.ink, 1.3),
    ...[[56, 72], [60, 68], [64, 70], [68, 62], [72, 64], [76, 56], [80, 58], [84, 50], [88, 46], [92, 44], [96, 38], [62, 74], [74, 60], [86, 52], [98, 34]].map(([x, y]) => circle(x!, y!, 1.8, SEA, null)),
    line('M54 74 L100 34', HL, 2.4), check(96, 98, 1.2), ground),
  /** belägga: the scientist holds up a chart under the claim, and it gets a green stamp. */
  'kun.belägga': all(bg(), fig(30, C.white, 'smile', { h: 0.9 }), on(30, 0.9, rect(-13, -40, 26, 50, C.white, 3, C.ink, 1.2)), reach(30, 0.9, 1, 58, 58),
    chart(70, 64, 1.1, SEA), card(80, 22, 34, 20, all(textLines(68, 18, 22, 2))), arrow(76, 44, 80, 34, HL, 2), check(100, 30, 1), ground),
  /** motbevis: many white swans agree – one black swan breaks the rule. */
  'kun.motbevis': all(bg(DAY), waterLine(84), rect(4, 86, 112, 26, '#bfe3f5', 0, null),
    swan(20, 80, 0.8), swan(42, 80, 0.8), swan(64, 80, 0.8), tick(20, 58, 0.7), tick(42, 58, 0.7), tick(64, 58, 0.7),
    swan(94, 80, 1, '#2e2e36'), ex(94, 50, 18, C.red), glow(94, 72, 18, 'rgba(228,87,46,0.18)')),
  /** hörsägen: one person saw it; the story is whispered on and gets vaguer – the last listener only heard it. */
  'kun.hörsägen': all(bg(), eye(18, 22, 0.7), fig(20, C.green, 'smile', { h: 0.62 }), fig(52, C.orange, 'smile', { h: 0.62, hairStyle: 'long' }), fig(84, '#3f6fb5', 'smile', { h: 0.62 }),
    path('M28 50 C34 44 38 44 42 50', 'none', HL, 1.6), path('M60 50 C66 44 70 44 74 50', 'none', HL, 1.6), think(104, 26, 10, 9, qm(104, 31, 11, GREY), 92, 44), ear(96, 52, 0.4), ground),
  /** anekdotisk: one person's story about the tea, against a grey chart of many people. */
  'kun.anekdotisk': all(bg(), fig(30, C.orange, 'laugh', { h: 0.84, hairStyle: 'long' }), say(62, 26, 34, 24, all(at(54, 28, 1, path('M-6 -4 L6 -4 L5 5 C5 7 -5 7 -5 5 Z', C.white, C.ink, 1.1), path('M6 -2 C10 -2 10 3 5 3', 'none', C.ink, 1.1)), sunS(70, 26, 3), ex(76, 30, 10, HL)), 40, 40),
    greyed(at(90, 86, 1, rect(-16, -18, 32, 32, C.white, 2, C.ink, 1.2), ...Array.from({ length: 12 }, (_, i) => circle(-12 + (i % 6) * 5, -10 + Math.floor(i / 6) * 8, 2, C.ink, null)), line('M-12 8 L12 8', C.ink, 1))), ground),
  /** evidensbaserad: the doctor chooses the medicine with the research chart, not the one with "?". */
  'kun.evidensbaserad': all(bg('#eef6f4'), fig(30, C.white, 'smile', { h: 0.94 }), on(30, 0.94, rect(-13, -40, 26, 52, C.white, 3, C.ink, 1.2), line('M-6 -38 C-8 -24 6 -24 6 -14', C.ink, 1.2), circle(6, -12, 2, C.silver, C.ink, 1)), reach(30, 0.94, 1, 62, 70),
    at(72, 78, 1, rect(-12, -12, 24, 22, C.white, 2, C.ink, 1.4), pill(0, 4, 0.9)), chart(72, 46, 0.7, OK), check(88, 34, 0.8),
    greyed(at(102, 92, 0.8, rect(-10, -10, 20, 20, C.white, 2, C.ink, 1.2), qm(0, 6, 12, GREY))), ground),

  // ── 2215 Rättfärdigande ──
  /** rättfärdiga: asked "why did you buy it?" he shows the reasons, and they outweigh the doubt on the scale. */
  'kun.rättfärdiga': all(bg(), at(30, 104, 1, circle(-10, 0, 8, 'none', C.ink, 2), circle(10, 0, 8, 'none', C.ink, 2), line('M-10 0 L-2 -12 L10 0 M-2 -12 L6 -12 M-4 -16 L0 -16', C.red, 2.2)), at(22, 84, 1, rect(-8, -5, 16, 10, C.yellow, 2, C.ink, 1), T(0, 3, '999', 6, C.ink)),
    fig(48, '#3f6fb5', 'smile', { h: 0.78 }), reach(48, 0.78, -1, 38, 88), greyed(fig(108, C.grey, 'frown', { h: 0.5 }), qm(108, 52, 11, GREY)),
    line('M84 112 L84 50 M76 112 L92 112', C.ink, 2.2), g('translate(84 50) rotate(-16)', line('M-18 0 L18 0', C.ink, 2), line('M-18 0 L-22 10 M-18 0 L-14 10 M18 0 L14 10 M18 0 L22 10', C.ink, 0.9), path('M-24 10 C-24 15 -12 15 -12 10 Z M12 10 C12 15 24 15 24 10 Z', GOLD, C.ink, 1), stoneBlock(-23, 0, 10, 10), tick(-18, -6, 0.6), qm(18, 8, 8, GREY)), ground),
  /** rättfärdigande: belief + truth + reasons = knowledge (lamp + check + pillars → book). */
  'kun.rättfärdigande': all(bg('#efe9f6'), bulb(16, 52, 1), T(32, 58, '+', 14, C.ink), check(46, 52, 1.1), T(60, 58, '+', 14, C.ink), rect(72, 40, 26, 4, STONE, 0.5, C.ink, 1), pillar(77, 68, 22), pillar(85, 68, 22), pillar(93, 68, 22),
    T(40, 102, '=', 18, C.ink), book(70, 98, 0.9, ROBE2), sparkleS(98, 80)),
  /** på goda grunder: the detective suspects on good grounds – three pieces of evidence, each with a check mark. */
  'kun.på-goda-grunder': all(bg(), fig(24, '#6a5a3a', 'smile', { h: 0.86 }), on(24, 0.86, path('M-14 -64 L14 -64 L10 -70 L-10 -70 Z', '#6a5a3a', C.ink, 1.2)), reach(24, 0.86, 1, 42, 60), magnifier(48, 54, 0.7, 0),
    card(76, 20, 22, 20, at(76, 20, 1, ellipse(0, 0, 4, 6, C.ink, null))), tick(92, 14, 0.7), card(76, 48, 22, 20, at(76, 48, 1, path('M-5 4 L-5 -4 C-5 -7 5 -7 5 -4 L5 4 Z', C.purple, C.ink, 1))), tick(92, 42, 0.7),
    card(76, 76, 22, 20, at(76, 76, 1, rect(-6, -4, 12, 8, C.dark, 2, C.ink, 1), circle(0, 0, 2.4, SEA, null))), tick(92, 70, 0.7), greyed(fig(104, C.grey, 'shock', { h: 0.5 })), ground),
  /** välgrundad: a house on a deep stone foundation; a grey house tilts on sand. */
  'kun.välgrundad': all(bg(DAY), rect(4, 80, 112, 32, '#c9a77a', 0, null), line('M4 80 L116 80', C.ink, 1.4),
    stoneBlock(18, 72, 44, 36), house(40, 72, 1.5), check(40, 22, 1),
    greyed(g('rotate(12 96 80)', house(96, 80, 0.9)), ...[[88, 86], [96, 92], [104, 86]].map(([x, y]) => circle(x!, y!, 1.2, C.ink, null)))),
  /** ogrundad: the house floats on nothing – the dashed line shows the missing foundation. */
  'kun.ogrundad': all(bg(DAY), house(44, 60, 1.5), rect(22, 66, 44, 30, 'none', 2, HL, 1.6), line('M22 66 L66 96 M66 66 L22 96', HL, 1, '3 3'), qm(44, 108, 12, HL),
    greyed(stoneBlock(84, 84, 28, 24), house(98, 84, 0.9)), ground),
  /** försvarbar: a shield stops the arrows of objection. */
  'kun.försvarbar': all(bg(), fig(84, '#3f6fb5', 'smile', { h: 0.9 }), reach(84, 0.9, -1, 62, 64), at(58, 64, 1.4, path('M0 -16 L14 -11 C14 4 8 12 0 17 C-8 12 -14 4 -14 -11 Z', C.navy, C.ink, 1.8), line('M-4 0 L-1 3 L5 -4', C.white, 2.4)),
    arrow(6, 40, 36, 52, C.grey, 2), arrow(6, 70, 36, 68, C.grey, 2), arrow(6, 96, 36, 82, C.grey, 2), ground),
  /** cirkelresonemang: the reason leads to the claim, and the claim back to the reason – round and round. */
  'kun.cirkelresonemang': all(bg(), card(60, 22, 30, 20, ex(60, 28, 14, C.navy)), card(60, 98, 30, 20, qm(60, 104, 14, C.navy)),
    path('M82 26 C112 40 112 82 82 96', 'none', HL, 2.6), path('M82 96 L90 99 L86 91 Z', HL, HL, 1), path('M38 94 C8 80 8 38 38 24', 'none', HL, 2.6), path('M38 24 L30 21 L34 29 Z', HL, HL, 1),
    greyed(cross(60, 60, 1.1))),
  /** kriterium: a checklist with boxes; the item passes when every box is ticked. */
  'kun.kriterium': all(bg(), rect(18, 16, 52, 88, WOOD, 3, C.ink, 1.4), rect(22, 24, 44, 76, C.white, 1, C.ink, 1), rect(34, 12, 20, 8, C.silver, 2, C.ink, 1.2),
    ...[0, 1, 2].map((i) => all(rect(28, 32 + i * 22, 12, 12, C.white, 2, C.ink, 1.3), line(`M44 ${38 + i * 22} L60 ${38 + i * 22}`, '#9aa3ad', 2), i < 2 ? tick(34, 38 + i * 22, 0.8) : '')),
    star(94, 50, 12, C.yellow), arrow(94, 70, 76, 90, HL, 2), ground),
  /** hålla för sant: two hands hold a card with a check mark firmly – close-up. */
  'kun.hålla-för-sant': all(bg(), glow(60, 54, 40, 'rgba(63,154,90,0.15)'), card(60, 52, 54, 54, tick(60, 52, 4)),
    path('M4 112 L4 84 C14 80 24 82 32 72 L40 66 C44 64 46 70 42 74 L34 84 L34 112 Z', C.skin, C.ink, 1.6), path('M116 112 L116 84 C106 80 96 82 88 72 L80 66 C76 64 74 70 78 74 L86 84 L86 112 Z', C.skin, C.ink, 1.6),
    path('M30 66 C28 56 36 54 36 62 M90 66 C92 56 84 54 84 62', 'none', C.ink, 1.4)),
  /** kunskapsanspråk: "I know!" – a raised palm and a book with a check mark; the grey listener asks "?". */
  'kun.kunskapsanspråk': all(bg(), rect(10, 92, 36, 20, WOOD, 2, C.ink, 1.4), g('translate(0 -20)', fig(28, C.green, 'smile', { h: 0.78 })), reach(28, 0.78, 1, 46, 32), palm(46, 26, 0.9),
    say(74, 24, 26, 22, all(book(74, 26, 0.38, ROBE2), ex(82, 18, 10, C.red)), 52, 34), greyed(fig(96, C.grey, 'smile', { h: 0.62 }), qm(96, 50, 12, GREY)), ground),

  // ── 2216 Perspektiv och tolkning ──
  /** utgångspunkt: a start flag where several paths begin. */
  'kun.utgångspunkt': all(bg('#eaf3e4'), path('M22 104 C40 90 60 70 100 30 M22 104 C50 96 80 80 106 70 M22 104 C30 80 30 50 40 20', 'none', '#e6d3b3', 5),
    circle(22, 104, 8, C.red, C.ink, 1.4), flag(22, 98, C.red), fig(40, '#3f6fb5', 'smile', { h: 0.5 }), star(100, 28, 4), star(106, 68, 4), star(40, 18, 4), ground),
  /** synsätt: the same tree – one person sees timber and money, the other sees birds and a home for animals. */
  'kun.synsätt': all(bg(), tree(60, 96, 1.1), fig(20, C.orange, 'smile', { h: 0.62, hairStyle: 'long' }), greyed(fig(100, C.green, 'smile', { h: 0.62 })),
    think(26, 20, 18, 13, all(rect(14, 16, 14, 4, WOOD, 1, C.ink, 0.8), rect(14, 21, 14, 4, WOOD, 1, C.ink, 0.8), circle(34, 20, 4, GOLD, C.ink, 1)), 20, 44),
    greyed(think(94, 20, 18, 13, all(path('M84 18 C86 14 90 14 92 18 C94 14 98 14 100 18', 'none', C.ink, 1.4), ellipse(98, 24, 6, 3, '#a0673d', C.ink, 1)), 100, 44)), ground),
  /** mångtydig: one picture, two readings – a vase or two faces. */
  'kun.mångtydig': all(bg(), rect(34, 28, 52, 64, C.ink, 2, null), path('M48 28 C56 40 46 44 50 54 C54 64 46 70 50 80 C52 86 48 90 46 92 L74 92 C72 90 68 86 70 80 C74 70 66 64 70 54 C74 44 64 40 72 28 Z', C.white, null),
    arrow(36, 96, 22, 104, HL, 2), arrow(84, 96, 98, 104, HL, 2), think(18, 18, 13, 11, path('M14 12 L22 12 C20 16 24 18 22 24 L14 24 C12 18 16 16 14 12 Z', C.white, C.ink, 1), 30, 30), think(102, 18, 13, 11, all(circle(97, 18, 4, C.skin, C.ink, 0.8), circle(107, 18, 4, C.skin, C.ink, 0.8)), 90, 30), ground),
  /** entydig: a sign with one clear arrow; a grey sign pointing three ways as contrast. */
  'kun.entydig': all(bg(DAY), line('M44 112 L44 40', C.ink, 3), path('M22 30 L62 30 L74 40 L62 50 L22 50 Z', OK, C.ink, 1.6), arrow(28, 40, 62, 40, C.white, 3), check(44, 18, 0.9),
    greyed(line('M96 112 L96 60', C.ink, 2), arrow(96, 62, 112, 52, C.ink, 2), arrow(96, 62, 80, 52, C.ink, 2), arrow(96, 62, 96, 44, C.ink, 2)), ground),
  /** betraktare: a viewer seen from behind looks at a painting in a frame. */
  'kun.betraktare': all(bg('#f3ede2'), frame(40, 16, 60, 44, all(rect(40, 16, 60, 44, DAY, 0, null), path('M40 60 L58 38 L70 50 L80 40 L100 60 Z', GRASS, C.ink, 1), sunS(88, 28, 4))),
    line('M10 96 L110 96', C.grey2, 1), at(38, 0, 1, path('M-12 112 L-12 82 C-12 70 12 70 12 82 L12 112 Z', '#3f6fb5', C.ink, 1.6), circle(0, 64, 9, C.hair, C.ink, 1.6)), ground),
  /** referensram: she understands the new thing only through her own frame (her home, her food); outside the frame it is grey and unknown. */
  'kun.referensram': all(bg('#e6e6e6'), fig(24, C.orange, 'smile', { h: 0.84, hairStyle: 'long' }), reach(24, 0.84, 1, 46, 30), reach(24, 0.84, -1, 40, 92),
    rect(46, 20, 44, 72, '#fdf6e6', 0, null), house(58, 56, 0.8), at(78, 50, 1, path('M-8 0 C-8 8 8 8 8 0 Z', C.white, C.ink, 1.2), ellipse(0, 0, 8, 2, C.white, C.ink, 1), line('M2 -10 L6 0 M5 -10 L8 0', WOOD, 1.2)), cbook(68, 78, 0.5, ROBE2), rect(46, 20, 44, 72, 'none', 1, GOLD, 4),
    greyed(at(104, 60, 1, path('M-8 10 L0 -12 L8 10 Z', C.grey, C.ink, 1.2), circle(0, -2, 3, C.white, C.ink, 1)), qm(104, 90, 12, GREY)), arrow(98, 66, 92, 62, HL, 1.6)),
  /** hermeneutik: a scholar reads an old scroll; arrows go round between the part and the whole. */
  'kun.hermeneutik': all(bg('#f6efe0'), sage(24, 0.86, ROBE2), scroll(48, 44, 56, 40, textLines(54, 52, 44, 5, '#9a8f7a')), magnifier(70, 60, 0.8, -20),
    path('M60 34 C70 18 90 18 100 34', 'none', HL, 2.2), path('M100 34 L101 26 L94 30 Z', HL, HL, 1), path('M100 92 C90 104 70 104 60 92', 'none', HL, 2.2), path('M60 92 L59 100 L66 96 Z', HL, HL, 1), reach(24, 0.86, 1, 46, 66), ground),
  /** relativism: three people, three different things, and each one has their own check mark. */
  'kun.relativism': all(bg(), ...[[22, C.orange, '#e45b5b'], [60, C.green, OK], [98, '#3f6fb5', SEA]].map(([x, top, col], i) => all(fig(x as number, top as string, 'smile', { h: 0.62, hairStyle: i === 0 ? 'long' : 'short' }),
    i === 0 ? circle(x as number, 24, 8, col as string, C.ink, 1.2) : i === 1 ? rect((x as number) - 8, 16, 16, 16, col as string, 1, C.ink, 1.2) : path(`M${(x as number) - 9} 32 L${(x as number) + 9} 32 L${x} 16 Z`, col as string, C.ink, 1.2), tick(x as number, 42, 0.8, col as string))), ground),
  /** tolkningsföreträde: one interpretation is big and loud from the podium; the other is small and grey. */
  'kun.tolkningsföreträde': all(bg(), rect(16, 86, 34, 26, WOOD, 2, C.ink, 1.4), g('translate(0 -26)', fig(33, '#b03a3a', 'smile', { h: 0.72 })), say(60, 24, 44, 28, all(circle(52, 24, 7, C.yellow, C.ink, 1.2), tick(70, 24, 1.1)), 40, 36),
    greyed(fig(96, C.grey, 'frown', { h: 0.62 }), think(98, 60, 10, 8, circle(98, 60, 3.4, C.grey2, C.ink, 0.8), 98, 72)), ground),

  // ── 2217 Kunskapens gränser ──
  /** gåta: a jigsaw puzzle where the last piece is missing – the hole is a question mark. */
  'kun.gåta': all(bg(), ...[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => (r === 1 && c === 2 ? '' : rect(20 + c * 26, 16 + r * 26, 26, 26, ['#f2d9a0', '#bfe3f5', '#c9e6b8'][(r + c) % 3]!, 1, C.ink, 1.2)))),
    rect(72, 42, 26, 26, '#3a3550', 1, C.ink, 1.6), T(85, 63, '?', 22, C.yellow), fig(22, '#3f6fb5', 'frown', { h: 0.36 }), chin(22, 0.36), magnifier(98, 98, 0.8, 0), ground),
  /** mysterium: a glowing question mark among the stars. */
  'kun.mysterium': all(bg(NIGHT), ...[[14, 14], [30, 34], [100, 16], [108, 50], [18, 70], [96, 92], [60, 12], [40, 100]].map(([x, y]) => circle(x!, y!, 1.3, '#f6e8a8', null)),
    path('M30 76 C40 50 80 50 92 70 C80 60 50 60 40 80 Z', 'rgba(170,150,230,0.5)', null), glow(60, 56, 30, 'rgba(242,193,78,0.25)'), T(60, 76, '?', 54, '#f6e08a'), fig(22, '#3f6fb5', 'shock', { h: 0.44 })),
  /** oförklarlig: a cup floats above the table and nobody knows why. */
  'kun.oförklarlig': all(bg(), rect(52, 84, 56, 6, WOOD, 2, C.ink, 1.4), line('M58 90 L58 112 M102 90 L102 112', C.brown, 3), at(80, 50, 1.4, path('M-7 -6 L7 -6 L6 6 C6 9 -6 9 -6 6 Z', C.white, C.ink, 1.3), path('M7 -3 C12 -3 12 4 6 4', 'none', C.ink, 1.3)),
    line('M68 70 C72 74 76 70 80 74 C84 70 88 74 92 70', '#9aa3ad', 1.2, '2 2'), qm(98, 36, 13, HL), qm(62, 36, 11, HL), fig(24, '#3f6fb5', 'shock', { h: 0.84 }), ground),
  /** förbli: the tree changes with spring, summer, autumn and winter – the stone beside it stays exactly the same. */
  'kun.förbli': all(bg(), ...[0, 1, 2, 3].map((i) => all(rect(6 + i * 27, 22, 25, 70, [DAY, '#e8f4d8', '#fde7c2', '#eef2f6'][i]!, 2, C.ink, 1.1),
    line(`M${18 + i * 27} 70 L${18 + i * 27} 54`, C.brown, 2.4), i === 3 ? line(`M${18 + i * 27} 58 L${12 + i * 27} 50 M${18 + i * 27} 58 L${24 + i * 27} 50`, C.brown, 1.4) : circle(18 + i * 27, 48, 8, ['#f6c9d4', C.green, C.orange][i]!, C.ink, 1),
    ellipse(18 + i * 27, 82, 8, 6, '#8d949c', C.ink, 1.6), line(`M${6 + i * 27} 88 L${31 + i * 27} 88`, C.grey2, 1))),
    line('M10 82 L110 82', HL, 1.6, '3 3'), arrow(12, 104, 106, 104, C.grey, 2)),
  /** spekulera: many guesses float around – a house? a car? a heart? – but the magnifier finds no evidence. */
  'kun.spekulera': all(bg(), fig(60, C.green, 'smile', { h: 0.8 }), chin(60, 0.8),
    think(22, 26, 14, 11, all(house(22, 32, 0.45), qm(32, 20, 8)), 46, 44), think(98, 26, 14, 11, all(at(98, 28, 0.6, rect(-10, -4, 20, 8, C.red, 3, C.ink, 1), circle(-6, 4, 3, C.ink, null), circle(6, 4, 3, C.ink, null)), qm(108, 20, 8)), 74, 44),
    think(60, 12, 12, 8, qm(60, 16, 10), 60, 30), greyed(magnifier(98, 88, 0.9, 0), T(98, 92, '0', 9, C.ink)), ground),
  /** spekulation: a castle built on a cloud, with no facts under it; a grey test tube (a tested idea) as contrast. */
  'kun.spekulation': all(bg(DAY), cloud(52, 72, 2.2, C.white), at(52, 64, 1, rect(-16, -20, 32, 20, '#e9e1cf', 1, C.ink, 1.3), rect(-22, -32, 10, 32, '#e9e1cf', 1, C.ink, 1.3), rect(12, -32, 10, 32, '#e9e1cf', 1, C.ink, 1.3), path('M-24 -32 L-17 -42 L-10 -32 Z M10 -32 L17 -42 L24 -32 Z', C.red, C.ink, 1.2), rect(-4, -10, 8, 10, '#8a5a34', 1, C.ink, 1)),
    qm(86, 22, 13, HL), qm(16, 30, 11, HL), line('M30 104 L74 104', HL, 1.6, '3 3'), qm(52, 108, 10, HL),
    greyed(at(102, 100, 1, path('M-4 -22 L4 -22 L4 4 C4 10 -4 10 -4 4 Z', C.white, C.ink, 1.2), path('M-4 -4 L4 -4 L4 4 C4 10 -4 10 -4 4 Z', C.green, null)), check(102, 66, 0.7, GREY)), ground),
  /** utom räckhåll: on tiptoe she stretches towards a star that is far too high. */
  'kun.utom-räckhåll': all(bg(NIGHT), star(98, 14, 8, C.yellow), glow(98, 14, 13), fig(48, C.orange, 'frown', { h: 0.84, hairStyle: 'long' }), reach(48, 0.84, 1, 60, 34), reach(48, 0.84, -1, 36, 36),
    line('M64 32 L90 18', '#f6e8a8', 1, '2 3'), line('M4 112 L116 112', '#6a7290', 2)),
  /** felbar: a sum with a mistake gets a red cross, and the eraser is ready – everyone can be wrong. */
  'kun.felbar': all(bg(), sage(26, 0.86, ROBE), reach(26, 0.86, 1, 52, 76), at(78, 54, 1, rect(-26, -32, 52, 64, C.white, 2, C.ink, 1.4), T(-6, -8, '2+2=5', 11, C.navy), cross(20, -26, 0.8), line('M-22 -4 L10 -14', C.red, 1.6), T(-6, 18, '2+2=4', 11, OK)),
    g('translate(54 80) rotate(-30)', rect(-4, -14, 8, 22, C.yellow, 1, C.ink, 1.1), rect(-4, -20, 8, 6, '#ef9fb5', 1, C.ink, 1.1)), ground),
  /** ofelbar: every dart in the bull's-eye; a grey target with scattered darts as contrast. */
  'kun.ofelbar': all(bg(), target(54, 50, 34), dart(54, 50, -20), dart(55, 48, -35), dart(53, 51, -10), check(90, 18, 1),
    greyed(target(98, 96, 12, true), dart(90, 90, -20, GREY), dart(106, 104, -35, GREY)), ground),
  /** ödmjukhet: she quietly bows with a hand on her chest; a grey figure boasts on a pedestal. */
  'kun.ödmjukhet': all(bg(), fig(34, C.green, 'calm', { h: 0.84, hairStyle: 'long' }), reach(34, 0.84, 1, 36, 62), trophy(56, 100, 1.1),
    greyed(rect(76, 82, 36, 30, STONE, 1, C.ink, 1.2), g('translate(0 -30)', fig(94, C.grey, 'laugh', { h: 0.66 })), ex(110, 22, 12, GREY), ex(116, 32, 9, GREY)), ground),
};

/** Small sparkle for "clean, empty" surfaces. */
function sparkleS(x: number, y: number) { return path(`M${x} ${y - 5} Q${x} ${y} ${x + 5} ${y} Q${x} ${y} ${x} ${y + 5} Q${x} ${y} ${x - 5} ${y} Q${x} ${y} ${x} ${y - 5} Z`, GOLD, null); }
