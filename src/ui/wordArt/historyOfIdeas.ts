/**
 * Historia & humaniora → Religion & idéhistoria → Idéernas historia, 2151–2157 (0.38): myth and world view,
 * the medieval tradition of learning, the ideas of humanism, Enlightenment thought, secularisation, science
 * and religion, and modern views of life. Myths are drawn as landscapes, skies and story scrolls, never as
 * caricatured gods; religions appear as buildings (church, mosque, pagoda) of equal size. Scholars are small
 * figures in robes with books, quills and parchment. Abstract ideas are symbolic mini-scenes where the
 * coloured idea dominates and a grey copy stands beside it as contrast. Digits only; no words, no letters
 * and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm, bubble, heart, bolt, cloud, thought } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Colours ──────────────────────────────────────────────────────────
const GOLD = C.gold;
const NIGHT = '#2b3a67';
const DAY = '#cfe9f7';
const STONE = '#e9e1cf';
const STONE2 = '#cbbf9f';
const ROOF = '#9a4a3a';
const MONK = '#8a5a34';
const ROBE = '#b03a3a';
const PARCH = '#f3e6c4';
const WOOD = '#a8743f';
const GRASS = '#7fbf6a';
const SEA = '#5aa7d6';
const UNDER = '#4a3b63';
const GREEN = '#2f8a6a';
const GREY = '#8d949c';
const f1 = (n: number) => n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);

// ── Figures ──────────────────────────────────────────────────────────
const ground = line('M4 112 L116 112', C.grey2, 2);
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, 3 * Math.max(0.6, h), C.skin, C.ink, 1.2)); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
const robeL = (col: string) => path('M-13 -40 L13 -40 L16 48 L-16 48 Z', col, C.ink, 1.4);
const hoodL = (col: string) => path('M-12 -50 C-14 -70 14 -70 12 -50 L14 -40 L-14 -40 Z', col, C.ink, 1.3);
const faceL = (mood: 'smile' | 'calm' = 'smile') => all(circle(0, -55, 7.6, C.skin, C.ink, 1.1),
  mood === 'calm' ? path('M-5 -55.5 Q-3.2 -58 -1.4 -55.5 M1.4 -55.5 Q3.2 -58 5 -55.5', 'none', C.ink, 1.2) : all(circle(-3, -56, 1.1, C.ink, null), circle(3, -56, 1.1, C.ink, null)),
  line('M-2.6 -51.6 Q0 -49.4 2.6 -51.6', C.ink, 1.2));
/** A monk or nun in a brown robe with a hood. */
const monk = (x: number, h = 1, col: string = MONK, mood: 'smile' | 'calm' = 'smile') => all(fig(x, col, 'smile', { h, bottom: col }), on(x, h, robeL(col), hoodL(col), faceL(mood), line('M-13 -10 L13 -10', '#e6d3b3', 2)));
/** A medieval scholar in a long robe and a round cap. */
const scholar = (x: number, h = 1, col: string = ROBE, mood: Mood = 'smile') => all(fig(x, col, mood, { h, bottom: col }), on(x, h, robeL(col), path('M-11 -62 C-12 -74 12 -74 11 -62 Z', C.black, C.ink, 1.2), line('M-12 -36 L12 -36', GOLD, 2)));
/** A child at about half height. */
const kid = (x: number, top: string, hair: 'short' | 'long' = 'short', mood: Mood = 'smile') => fig(x, top, mood, { h: 0.58, hairStyle: hair });

// ── Things ───────────────────────────────────────────────────────────
const sky = (col: string = DAY, y2 = 112) => rect(4, 4, 112, y2 - 4, col, 3, null);
const starDot = (x: number, y: number, r = 1.4, col = '#f6e8a8') => path(`M${x} ${y - r * 2} L${f1(x + r * 0.5)} ${f1(y - r * 0.5)} L${x + r * 2} ${y} L${f1(x + r * 0.5)} ${f1(y + r * 0.5)} L${x} ${y + r * 2} L${f1(x - r * 0.5)} ${f1(y + r * 0.5)} L${x - r * 2} ${y} L${f1(x - r * 0.5)} ${f1(y - r * 0.5)} Z`, col, null);
const sunS = (x: number, y: number, r = 7, col: string = C.yellow) => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 5))} ${f1(y + Math.sin(a) * (r + 5))}`, GOLD, 1.6); }), circle(x, y, r, col, C.ink, 1.2));
const moonC = (x: number, y: number, r: number, col = '#f6e08a') => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${x} ${y + r} A${f1(r * 0.75)} ${r} 0 1 1 ${x} ${y - r} Z`, col, C.ink, 1);
const earth = (x: number, y: number, r: number) => all(circle(x, y, r, SEA, C.ink, 1.4), path(`M${f1(x - r * 0.6)} ${f1(y - r * 0.4)} C${f1(x - r * 0.1)} ${f1(y - r * 0.8)} ${f1(x + r * 0.2)} ${f1(y - r * 0.1)} ${f1(x - r * 0.2)} ${f1(y + r * 0.2)} C${f1(x - r * 0.6)} ${f1(y + r * 0.4)} ${f1(x - r * 0.8)} ${f1(y)} ${f1(x - r * 0.6)} ${f1(y - r * 0.4)} Z M${f1(x + r * 0.3)} ${f1(y + r * 0.1)} C${f1(x + r * 0.8)} ${f1(y - r * 0.1)} ${f1(x + r * 0.7)} ${f1(y + r * 0.6)} ${f1(x + r * 0.3)} ${f1(y + r * 0.7)} Z`, GRASS, C.ink, 0.8));
const planet = (x: number, y: number, r: number, col: string) => circle(x, y, r, col, C.ink, 1);
const orbit = (cx: number, cy: number, rx: number, ry: number) => ellipse(cx, cy, rx, ry, 'none', '#9aa3ad', 1);
const tree = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s, rect(-2.5, -16, 5, 16, C.brown, 1, C.ink, 1), circle(0, -24, 11, col, C.ink, 1.2), circle(-7, -19, 7, col, C.ink, 1.2), circle(7, -19, 7, col, C.ink, 1.2));
const hill = (y = 96, col: string = GRASS) => path(`M4 ${y} C30 ${y - 10} 60 ${y - 12} 90 ${y - 4} C100 ${y - 2} 110 ${y} 116 ${y + 2} L116 112 L4 112 Z`, col, C.ink, 1.2);
const qm = (x: number, y: number, size = 14, col: string = HL) => T(x, y, '?', size, col);
const check = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s, circle(0, 0, 8, C.white, col, 1.6), line('M-4 0 L-1 3 L4 -3', col, 2.2));
const cross = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, circle(0, 0, 8, C.white, col, 1.6), line('M-3.5 -3.5 L3.5 3.5 M3.5 -3.5 L-3.5 3.5', col, 2.2));

/** An open book. */
const book = (x: number, y: number, s = 1, cover: string = ROBE, lines = true) => at(x, y, s,
  path('M0 6 C-8 2 -18 2 -24 6 L-24 -12 C-18 -16 -8 -16 0 -12 Z', '#fbf5e4', C.ink, 1.2), path('M0 6 C8 2 18 2 24 6 L24 -12 C18 -16 8 -16 0 -12 Z', '#fbf5e4', C.ink, 1.2),
  path('M-24 6 C-18 2 -8 2 0 6 C8 2 18 2 24 6 L24 8 C18 4 8 4 0 8 C-8 4 -18 4 -24 8 Z', cover, C.ink, 1),
  lines ? line('M-20 -8 L-4 -10 M-20 -3 L-4 -5 M-20 2 L-4 0 M4 -10 L20 -8 M4 -5 L20 -3 M4 0 L20 2', '#9a8f7a', 1) : '');
/** A closed book standing up, spine towards us. */
const cbook = (x: number, y: number, s = 1, col: string = ROBE, mark: Svg = '') => at(x, y, s, rect(-10, -13, 20, 26, col, 2, C.ink, 1.3), line('M-7 -13 L-7 13', 'rgba(0,0,0,0.25)', 1.4), mark);
const crossMark = (col: string = GOLD) => line('M1 -7 L1 7 M-4 -2 L6 -2', col, 2);
/** A stack of books lying flat. */
const books = (x: number, y: number, n: number, s = 1) => at(x, y, s, ...Array.from({ length: n }, (_, i) => rect(-12 + (i % 2) * 2, -6 - i * 6, 24, 6, [ROBE, GREEN, C.denim, '#b07a2a', C.purple][i % 5]!, 1, C.ink, 1)));
const quill = (x: number, y: number, s = 1, rot = -30) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M0 0 C-6 -10 -5 -24 0 -32 C5 -24 6 -10 0 0 Z', C.white, C.ink, 1.1), line('M0 -30 L0 6', C.ink, 1.1));
const candle = (x: number, y: number, s = 1) => at(x, y, s, rect(-3, -14, 6, 14, '#fbf5e4', 1, C.ink, 1), path('M0 -22 C-3 -18 -3 -15 0 -15 C3 -15 3 -18 0 -22 Z', C.yellow, C.ink, 0.8), circle(0, -18, 7, 'rgba(242,193,78,0.25)', null));
const scroll = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x, y, w, h, PARCH, 1, C.ink, 1.3), rect(x - 3, y - 3, 4, h + 6, '#d9c08a', 2, C.ink, 1.1), rect(x + w - 1, y - 3, 4, h + 6, '#d9c08a', 2, C.ink, 1.1), inner);
const column = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, rect(-9, -4, 18, 4, col, 0.5, C.ink, 1), rect(-6, -34, 12, 30, col, 0.5, C.ink, 1), line('M-3 -32 L-3 -6 M0 -32 L0 -6 M3 -32 L3 -6', C.grey2, 0.8), rect(-9, -38, 18, 4, col, 0.5, C.ink, 1));
const gear = (x: number, y: number, r = 8, col: string = '#8a8f98') => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return circle(+f1(x + Math.cos(a) * r), +f1(y + Math.sin(a) * r), r * 0.3, col, C.ink, 0.8); }), circle(x, y, r, col, C.ink, 1.2), circle(x, y, r * 0.35, C.white, C.ink, 1));
const scales = (x: number, y: number, s = 1, tilt = 0, l: Svg = '', r: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, line('M0 -26 L0 22 M-12 22 L12 22', C.ink, 2.4),
  g(`rotate(${tilt} 0 -24)`, line('M-26 -24 L26 -24', C.ink, 2.4), line('M-26 -24 L-32 -8 M-26 -24 L-20 -8 M26 -24 L20 -8 M26 -24 L32 -8', C.ink, 1), path('M-34 -8 C-34 -2 -18 -2 -18 -8 Z', GOLD, C.ink, 1.2), path('M18 -8 C18 -2 34 -2 34 -8 Z', GOLD, C.ink, 1.2), g('translate(-26 -14)', l), g('translate(26 -14)', r)), circle(0, -26, 2.4, GOLD, C.ink, 1));

// buildings (base at y)
const church = (x: number, y: number, s = 1, col: string = '#f2ece0') => at(x, y, s, rect(-18, -24, 28, 24, col, 1, C.ink, 1.4), path('M-21 -24 L-4 -36 L13 -24 Z', ROOF, C.ink, 1.3), rect(10, -46, 12, 46, col, 1, C.ink, 1.4), path('M8 -46 L16 -62 L24 -46 Z', '#5a6a8a', C.ink, 1.3), line('M16 -62 L16 -70 M13 -67 L19 -67', C.ink, 1.4), path('M-8 0 L-8 -10 C-8 -15 0 -15 0 -10 L0 0 Z', '#8a5a34', C.ink, 1), circle(16, -34, 3, '#bfe3f5', C.ink, 0.9));
const cathedral = (x: number, y: number, s = 1, col: string = STONE) => at(x, y, s,
  rect(-30, -44, 60, 44, col, 1, C.ink, 1.4), rect(-36, -76, 16, 76, col, 1, C.ink, 1.4), rect(20, -76, 16, 76, col, 1, C.ink, 1.4),
  path('M-38 -76 L-28 -96 L-18 -76 Z M18 -76 L28 -96 L38 -76 Z', '#5a6a8a', C.ink, 1.3), path('M-30 -44 L0 -60 L30 -44 Z', ROOF, C.ink, 1.3),
  circle(0, -30, 9, '#bfe3f5', C.ink, 1.2), line('M0 -39 L0 -21 M-9 -30 L9 -30 M-6 -36 L6 -24 M6 -36 L-6 -24', C.ink, 0.7),
  path('M-8 0 L-8 -12 C-8 -19 8 -19 8 -12 L8 0 Z', '#8a5a34', C.ink, 1.1),
  ...[-28, 28].map((cx) => path(`M${cx - 3} -50 L${cx - 3} -58 C${cx - 3} -62 ${cx + 3} -62 ${cx + 3} -58 L${cx + 3} -50 Z`, '#bfe3f5', C.ink, 0.9)));
const mosque = (x: number, y: number, s = 1) => at(x, y, s, rect(-18, -22, 36, 22, '#f3ead7', 1, C.ink, 1.4), path('M-13 -22 C-13 -42 13 -42 13 -22 Z', GREEN, C.ink, 1.3), line('M0 -40 L0 -46', GOLD, 1.6), moonC(0, -50, 3, GOLD),
  path('M22 0 L23 -48 L29 -48 L30 0 Z', '#f3ead7', C.ink, 1.3), path('M22 -48 L26 -58 L30 -48 Z', GREEN, C.ink, 1.1), path('M-5 0 L-5 -9 C-5 -14 5 -14 5 -9 L5 0 Z', '#8a5a34', C.ink, 1));
const pagoda = (x: number, y: number, s = 1) => at(x, y, s, rect(-14, -16, 28, 16, '#f3ead7', 1, C.ink, 1.3), path('M-24 -16 C-16 -18 16 -18 24 -16 L14 -26 L-14 -26 Z', ROOF, C.ink, 1.3), rect(-10, -36, 20, 10, '#f3ead7', 1, C.ink, 1.2), path('M-20 -36 C-12 -38 12 -38 20 -36 L10 -46 L-10 -46 Z', ROOF, C.ink, 1.3), line('M0 -46 L0 -56', GOLD, 2), path('M-4 0 L-4 -9 L4 -9 L4 0 Z', '#8a5a34', C.ink, 1));
const house = (x: number, y: number, s = 1, col: string = '#f2ece0', roof: string = ROOF) => at(x, y, s, rect(-12, -16, 24, 16, col, 1, C.ink, 1.3), path('M-15 -16 L0 -28 L15 -16 Z', roof, C.ink, 1.3), rect(-3, -9, 6, 9, '#8a5a34', 1, C.ink, 0.9));
const arch = (x: number, y: number, w: number, h: number, col: string = STONE) => path(`M${x - w / 2} ${y} L${x - w / 2} ${y - h + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w / 2} ${y - h + w / 2} L${x + w / 2} ${y} Z`, col, C.ink, 1.2);
/** A school desk seen from the front. */
const desk = (x: number, y: number, w = 22) => all(rect(x - w / 2, y, w, 4, WOOD, 1, C.ink, 1), line(`M${x - w / 2 + 3} ${y + 4} L${x - w / 2 + 3} 112 M${x + w / 2 - 3} ${y + 4} L${x + w / 2 - 3} 112`, '#7a4a20', 2));
const board = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x, y, w, h, '#2f5a46', 2, '#7a4a20', 2.4), inner);
/** A simple ghost-like soul. */
const soul = (x: number, y: number, s = 1) => at(x, y, s, path('M-6 8 L-6 -2 C-6 -10 6 -10 6 -2 L6 8 L3 6 L0 8 L-3 6 Z', 'rgba(240,240,250,0.85)', '#c9c6dd', 1), circle(-2, -2, 0.9, UNDER, null), circle(2, -2, 0.9, UNDER, null));
const rainbow = (x: number, y: number, r: number) => all(...['#e45b5b', '#f2a65a', '#f2d04e', '#7fbf6a', '#5aa7d6', '#8a6bbf'].map((c, i) => path(`M${x - r + i * 3} ${y} A${r - i * 3} ${r - i * 3} 0 0 1 ${x + r - i * 3} ${y}`, 'none', c, 3)));
const flame = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -16 C8 -8 8 0 0 2 C-8 0 -8 -8 0 -16 Z', C.orange, C.ink, 1), path('M0 -8 C3 -4 3 0 0 1 C-3 0 -3 -4 0 -8 Z', C.yellow, null));
const wave = (x: number, y: number, s = 1) => at(x, y, s, path('M-14 6 C-10 -8 4 -12 10 -4 C4 -6 0 -2 2 4 Z', SEA, C.ink, 1.1), line('M-16 8 L14 8', SEA, 2));
const chain = (x: number, y: number, n: number, col: string = GREY) => all(...Array.from({ length: n }, (_, i) => ellipse(x + i * 7, y, 4.5, 3, 'none', col, 2)));
const zodiac = (x: number, y: number, r: number) => all(circle(x, y, r, '#1f2d55', C.ink, 1.4), circle(x, y, r * 0.55, '#2b3a67', '#f6e8a8', 0.8),
  ...Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * r * 0.55)} ${f1(y + Math.sin(a) * r * 0.55)} L${f1(x + Math.cos(a) * r)} ${f1(y + Math.sin(a) * r)}`, '#f6e8a8', 0.8); }),
  ...Array.from({ length: 12 }, (_, i) => { const a = ((i + 0.5) / 12) * Math.PI * 2; return starDot(+f1(x + Math.cos(a) * r * 0.78), +f1(y + Math.sin(a) * r * 0.78), r * 0.05); }),
  sunS(x, y, r * 0.18, C.yellow));
const crystal = (x: number, y: number, s = 1, col = '#b9a2e6') => at(x, y, s, path('M0 -16 L6 -6 L4 0 L-4 0 L-6 -6 Z', col, C.ink, 1), line('M0 -16 L0 0 M-6 -6 L6 -6', 'rgba(255,255,255,0.7)', 0.8));
const glow = (x: number, y: number, r: number, col = 'rgba(242,193,78,0.35)') => circle(x, y, r, col, null);
const fish = (x: number, y: number, s = 1, col: string = SEA) => at(x, y, s, path('M-10 0 C-4 -7 6 -7 10 0 C6 7 -4 7 -10 0 Z', col, C.ink, 1), path('M10 0 L16 -5 L16 5 Z', col, C.ink, 1), circle(-5, -1, 1, C.ink, null));
const lizard = (x: number, y: number, s = 1, col: string = '#7fbf6a') => at(x, y, s, path('M-14 0 C-8 -6 6 -6 10 -2 L16 -3 C17 0 14 2 10 2 C6 4 -6 4 -14 0 Z', col, C.ink, 1), line('M-6 2 L-8 7 M4 2 L6 7', C.ink, 1.4), path('M-14 0 C-20 -2 -24 2 -28 0', 'none', col, 2.4), circle(13, -1.4, 0.8, C.ink, null));
const mammal = (x: number, y: number, s = 1, col: string = '#c9975a') => at(x, y, s, ellipse(0, -8, 12, 7, col, C.ink, 1.1), circle(13, -12, 5.5, col, C.ink, 1.1), path('M11 -17 L12 -21 L15 -17 Z', col, C.ink, 0.8), line('M-7 -2 L-7 4 M7 -2 L7 4', C.ink, 1.6), path('M-12 -9 C-17 -10 -19 -6 -20 -3', 'none', C.ink, 1.2), circle(15, -13, 0.8, C.ink, null));
const puzzle = (x: number, y: number, s = 1, col: string, tabRight = true, inner: Svg = '') => at(x, y, s, path(tabRight ? 'M-16 -16 L16 -16 L16 -6 C24 -8 24 8 16 6 L16 16 L-16 16 Z' : 'M-16 -16 L16 -16 L16 16 L-16 16 L-16 6 C-8 8 -8 -8 -16 -6 Z', col, C.ink, 1.4), inner);
const baby = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 4, 13, 8, '#f6f2ea', C.ink, 1.2), circle(-8, -2, 7, C.skin, C.ink, 1.2), path('M-14 -4 C-14 -10 -2 -10 -2 -4', 'none', C.hair, 1.2), path('M-11 -2 Q-10 -3.5 -9 -2 M-7 -2 Q-6 -3.5 -5 -2', 'none', C.ink, 0.9));
const bird = (x: number, y: number, s = 1, col: string = C.sky) => at(x, y, s, path('M-10 0 C-6 -8 -2 -8 0 -2 C2 -8 6 -8 10 0 C6 -4 2 -2 0 2 C-2 -2 -6 -4 -10 0 Z', col, C.ink, 1));
const cage = (x: number, y: number, s = 1, col: string = GREY) => at(x, y, s, path('M-14 14 L-14 -6 C-14 -20 14 -20 14 -6 L14 14 Z', 'none', col, 1.6), line('M-7 14 L-7 -14 M0 14 L0 -17 M7 14 L7 -14', col, 1.2), line('M-16 14 L16 14', col, 2.4));
const rays = (x: number, y: number, r1: number, r2: number, n = 12, col: string = GOLD, sw = 1.6) => all(...Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * r1)} ${f1(y + Math.sin(a) * r1)} L${f1(x + Math.cos(a) * r2)} ${f1(y + Math.sin(a) * r2)}`, col, sw); }));
const ring = (cx: number, cy: number, rx: number, ry: number, col: string, fill = 'none') => ellipse(cx, cy, rx, ry, fill, col, 2);
/** Little people (bust) for crowds. */
const bust = (x: number, y: number, top: string, s = 1, grey = false, long = false) => g(`translate(${x} ${y}) scale(${s})`,
  long ? path('M-6 -1 C-7 8 7 8 6 -1 Z', grey ? C.grey : C.hair, null) : '',
  path('M-8 12 C-8 4 8 4 8 12 Z', grey ? C.grey : top, C.ink, 1.2), circle(0, 0, 5.4, grey ? C.grey2 : C.skin, C.ink, 1.2),
  path('M-5.4 -1 C-5.4 -8 5.4 -8 5.4 -1 C3 -4 -3 -4 -5.4 -1 Z', grey ? C.grey : C.hair, null), circle(-2, 0, 0.8, C.ink, null), circle(2, 0, 0.8, C.ink, null), line('M-1.6 2.6 Q0 3.8 1.6 2.6', C.ink, 0.8));

export const HISTORY_OF_IDEAS_MOTIFS: Record<string, Svg> = {
  // ── 2151 Myt och världsbild ──
  'idé.skapelsemyt': all(scroll(10, 22, 100, 70),
    at(28, 58, 1, circle(0, 0, 13, '#3b3550', C.ink, 1), path('M-8 0 C-8 -8 6 -8 6 0 C6 6 -4 6 -4 0 C-4 -3 1 -3 1 0', 'none', '#a99cd0', 1.6)),
    arrow(44, 58, 52, 58, HL, 2),
    at(66, 66, 1, rect(-12, -2, 24, 8, SEA, 2, C.ink, 0.9), path('M-8 -2 C-6 -10 6 -10 8 -2 Z', '#d9b56e', C.ink, 1)),
    arrow(80, 58, 88, 58, HL, 2),
    at(98, 70, 1, rect(-10, -2, 20, 6, SEA, 2, C.ink, 0.9), path('M-8 -2 C-6 -12 6 -12 8 -2 Z', GRASS, C.ink, 1), tree(2, -6, 0.42), sunS(-5, -24, 3.2)),
    T(28, 86, '1', 9, '#7a6a4a'), T(66, 86, '2', 9, '#7a6a4a'), T(98, 86, '3', 9, '#7a6a4a')),
  'idé.hjälte': all(sky('#fde7c2', 112), sunS(98, 20, 7), path('M60 34 C40 40 36 80 40 104 L80 104 C84 80 80 40 60 34 Z', ROBE, C.ink, 1.4),
    fig(60, '#3f6fb5', 'smile', { h: 0.96, bottom: '#2e5590' }), reach(60, 0.96, 1, 82, 30), g('translate(82 30) rotate(10)', rect(-1.6, -30, 3.2, 30, C.silver, 1, C.ink, 1), rect(-6, -1, 12, 3, GOLD, 1, C.ink, 1)),
    reach(60, 0.96, -1, 40, 74), at(36, 74, 1, path('M0 -14 L12 -10 C12 2 6 10 0 14 C-6 10 -12 2 -12 -10 Z', GOLD, C.ink, 1.4), circle(0, -1, 3, ROBE, null)),
    ...[[14, 100, '#c96b3c'], [104, 100, C.green]].map(([x, y, c]) => bust(+x!, +y!, c as string, 1)), ground),
  'idé.öde': all(sky('#efe9f7', 112), cloud(28, 22, 1.3, C.white), at(28, 30, 1, rect(-2, -14, 4, 26, WOOD, 1, C.ink, 1), ellipse(0, 0, 9, 5, '#d9c08a', C.ink, 1)),
    path('M28 34 C40 52 18 60 34 72 C48 82 62 70 74 80 C84 88 86 92 88 96', 'none', GOLD, 2),
    line('M88 96 L112 96', GOLD, 1.6, '3 3'), starDot(112, 92, 2, GOLD),
    fig(88, C.purple, 'calm', { h: 0.42, hairStyle: 'long' }), greyed(fig(20, C.grey, 'smile', { h: 0.42 })), ground),
  'idé.naturkraft': all(sky('#7c8aa5', 112), cloud(36, 18, 1.4, '#5a6478'), cloud(84, 16, 1.3, '#5a6478'), bolt(70, 34, 1.4),
    at(26, 112, 1, rect(-2.5, -26, 5, 26, C.brown, 1, C.ink, 1), path('M0 -26 C12 -34 26 -30 30 -24 C20 -22 10 -20 0 -26 Z', C.green, C.ink, 1.1), path('M0 -22 C14 -24 24 -18 26 -12 C16 -14 8 -14 0 -22 Z', C.green, C.ink, 1.1)),
    line('M40 60 C52 56 60 64 72 60 M44 70 C56 66 64 74 76 70', C.white, 1.8), wave(96, 104, 1.3), flame(60, 110, 1),
    greyed(fig(104, C.grey, 'shock', { h: 0.36 })), ground),
  'idé.naturfenomen': all(rect(6, 6, 52, 52, DAY, 2, C.ink, 1), rainbow(32, 50, 20),
    rect(62, 6, 52, 52, NIGHT, 2, C.ink, 1), path('M66 30 C76 18 86 34 96 22 C102 16 108 22 110 18', 'none', '#7fe0a0', 4), path('M66 40 C76 28 86 44 96 32 C102 26 108 32 110 28', 'none', '#5fc0d0', 3), starDot(72, 50), starDot(104, 46),
    rect(6, 62, 52, 50, '#8592a8', 2, C.ink, 1), cloud(32, 74, 1.1, '#5a6478'), bolt(32, 94, 1.1),
    rect(62, 62, 52, 50, '#1f2d55', 2, C.ink, 1), circle(88, 86, 14, '#f6c14e', null), ...Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return line(`M${f1(88 + Math.cos(a) * 14)} ${f1(86 + Math.sin(a) * 14)} L${f1(88 + Math.cos(a) * 19)} ${f1(86 + Math.sin(a) * 19)}`, '#f6c14e', 1.4); }), circle(88, 86, 13, '#141a33', null)),
  'idé.åska': all(sky('#8592a8', 112), cloud(60, 26, 2.4, '#4a5368'), bolt(54, 62, 1.8), bolt(84, 54, 1.1),
    line('M24 38 C20 42 20 46 24 50 M18 34 C12 40 12 48 18 54 M96 34 C100 38 100 42 96 46 M102 30 C108 36 108 44 102 50', C.yellow, 1.6),
    line('M30 70 l-3 6 M40 74 l-3 6 M70 78 l-3 6 M92 72 l-3 6 M100 82 l-3 6', '#cfe3f2', 1.4), path('M4 104 L116 104 L116 112 L4 112 Z', '#5f8f55', null), ground),
  'idé.himlavalv': all(sky('#1f2d55', 112), path('M10 96 A50 64 0 0 1 110 96 Z', '#2b3a67', '#a99cd0', 1.6),
    ...[[30, 60], [44, 44], [60, 38], [76, 46], [90, 62], [52, 60], [70, 64], [38, 76], [84, 80]].map(([x, y]) => starDot(x!, y!, 1.6)),
    ellipse(60, 98, 54, 8, GRASS, C.ink, 1.3), ellipse(60, 104, 56, 6, SEA, C.ink, 1), fig(60, C.orange, 'smile', { h: 0.3 }), reach(60, 0.3, 1, 66, 92)),
  'idé.dödsrike': all(rect(4, 4, 112, 46, DAY, 3, null), sunS(100, 16, 6), house(30, 50, 0.9), tree(70, 50, 0.7),
    rect(4, 50, 112, 62, UNDER, 3, null), line('M4 50 L116 50', '#5f8f55', 4),
    path('M12 98 C30 92 50 104 70 96 C86 90 100 100 116 96 L116 112 L4 112 Z', '#2f4a7a', null),
    arch(92, 92, 22, 32, '#6a5a83'), path('M86 92 L86 74 C86 68 98 68 98 74 L98 92 Z', '#2b2440', null),
    soul(30, 76, 1.2), soul(48, 70, 1), soul(64, 80, 1.1), at(44, 100, 1, path('M-14 0 L14 0 L10 5 L-10 5 Z', WOOD, C.ink, 1))),
  'idé.övernaturlig': all(rect(4, 4, 112, 108, '#e9e4f2', 3, null), rect(56, 30, 10, 82, '#c9b98a', 1, C.ink, 1.3), line('M56 50 L66 50 M56 70 L66 70 M56 90 L66 90', '#a8956a', 1),
    at(62, 74, 1.5, path('M-10 16 L-10 -2 C-10 -16 10 -16 10 -2 L10 16 L6 12 L2 16 L-2 12 L-6 16 Z', 'rgba(250,250,255,0.75)', '#8a6bbf', 1.2), circle(-4, -3, 1.6, C.ink, null), circle(4, -3, 1.6, C.ink, null)),
    at(94, 46, 1, rect(-10, -3, 20, 4, WOOD, 1, C.ink, 1), line('M-8 1 L-8 14 M8 1 L8 14', '#7a4a20', 2)), at(96, 24, 1, cbook(0, 0, 0.5, ROBE)), ...[[84, 30], [106, 20], [100, 62], [86, 58]].map(([x, y]) => starDot(x!, y!, 1.6, '#8a6bbf')),
    line('M88 66 L88 70 M100 66 L100 70', '#8a6bbf', 1.2, '2 2'), ellipse(94, 104, 12, 3, 'rgba(0,0,0,0.12)', null),
    greyed(fig(24, C.grey, 'shock', { h: 0.62 })), ground),
  'idé.cyklisk': all(circle(60, 50, 34, '#f6f2ea', null), path('M60 16 A34 34 0 0 1 94 50', 'none', HL, 3), path('M94 50 A34 34 0 0 1 60 84', 'none', HL, 3), path('M60 84 A34 34 0 0 1 26 50', 'none', HL, 3), path('M26 50 A34 34 0 0 1 60 16', 'none', HL, 3),
    path('M90 40 L94 50 L100 42 Z M70 82 L60 84 L68 90 Z M30 60 L26 50 L20 58 Z M50 18 L60 16 L52 10 Z', HL, null),
    at(60, 50, 1, circle(0, 0, 10, '#fff7d6', C.ink, 1)), sunS(60, 50, 5),
    at(92, 22, 1, circle(0, 0, 4, C.pink, C.ink, 0.8), ...[0, 72, 144, 216, 288].map((d) => g(`rotate(${d})`, ellipse(0, -5, 2.4, 3.4, C.pink, C.ink, 0.6)))),
    tree(98, 92, 0.5, '#e8a33c'), at(24, 82, 1, line('M0 -7 L0 7 M-6 -3.5 L6 3.5 M-6 3.5 L6 -3.5', '#5aa7d6', 1.8)), sunS(24, 22, 5),
    greyed(line('M16 104 L104 104', GREY, 3), path('M104 99 L112 104 L104 109 Z', GREY, null))),

  // ── 2152 Medeltida lärdomstradition ──
  'idé.lärdom.2': all(rect(4, 4, 112, 108, '#f3ece0', 3, null), glow(60, 58, 40, 'rgba(242,193,78,0.3)'), rays(60, 58, 30, 42, 16, GOLD, 1.4),
    book(60, 66, 1.5, ROBE), books(60, 108, 3, 1.4),
    at(24, 26, 1, circle(0, 0, 10, SEA, C.ink, 1), line('M0 -10 L0 10 M-10 0 L10 0', C.ink, 0.6)), at(96, 24, 1, line('M0 -10 L-8 8 M0 -10 L8 8', C.ink, 1.6), circle(0, -10, 2, C.ink, null)),
    at(20, 64, 0.5, column(0, 18, 1)), at(100, 70, 1, rect(-9, -7, 18, 14, PARCH, 1, C.ink, 1), line('M-6 -2 L6 -2 M-6 2 L4 2', '#9a8f7a', 0.9)), at(60, 14, 1, starDot(-8, 0, 1.6, GOLD), starDot(8, 4, 1.4, GOLD), line('M-8 0 L8 4', GOLD, 0.8)),
    line('M30 30 L44 48 M92 30 L78 48 M26 60 L36 62 M92 68 L84 66', GOLD, 1, '2 3')),
  'idé.klosterskola': all(rect(4, 4, 112, 108, STONE, 3, null), arch(32, 70, 30, 60, '#f6efe0'), arch(88, 70, 30, 60, '#f6efe0'), line('M4 70 L116 70', STONE2, 2),
    board(46, 16, 28, 20, line('M50 24 L70 24 M50 30 L64 30', C.white, 1.2)), monk(26, 0.96, MONK), reach(26, 0.96, 1, 46, 30),
    desk(66, 92, 22), kid(60, '#c96b3c'), kid(72, C.denim, 'long'), desk(98, 92, 18), kid(98, GREEN), book(66, 92, 0.3), book(98, 92, 0.3), ground),
  'idé.katedralskola': all(sky(DAY, 112), cathedral(56, 108, 1), at(98, 108, 1, rect(-12, -30, 24, 30, STONE, 1, C.ink, 1.3), path('M-15 -30 L0 -40 L15 -30 Z', ROOF, C.ink, 1.2), rect(-4, -12, 8, 12, '#8a5a34', 1, C.ink, 0.9)),
    kid(84, '#c96b3c'), cbook(90, 96, 0.3, GREEN), kid(108, C.denim), cbook(114, 96, 0.3, ROBE), path('M4 108 L116 108 L116 112 L4 112 Z', STONE2, null), ground),
  'idé.universitet': all(sky(DAY, 112), at(60, 104, 1, rect(-46, -40, 92, 40, '#f2ece0', 1, C.ink, 1.4), path('M-50 -40 L0 -64 L50 -40 Z', '#f2ece0', C.ink, 1.4), circle(0, -50, 5, '#bfe3f5', C.ink, 1),
    ...[-36, -20, -4, 12, 28].map((x) => rect(x, -36, 7, 36, C.white, 0.5, C.ink, 1)), rect(-50, -2, 100, 4, STONE2, 0.5, C.ink, 1)),
    ...[[22, '#3f6fb5'], [96, '#c96b3c']].map(([x, c]) => all(fig(+x!, c as string, 'smile', { h: 0.5 }), on(+x!, 0.5, path('M-12 -66 L0 -71 L12 -66 L0 -61 Z', C.black, C.ink, 1), line('M10 -66 L12 -58', GOLD, 1.2)))), ground),
  'idé.grammatik': all(board(6, 8, 108, 98, all(
    at(24, 30, 1, circle(0, 0, 6, C.red, C.ink, 1), line('M0 -6 L1 -9', C.green, 1.6)), arrow(34, 30, 44, 30, C.white, 1.6), rect(48, 24, 22, 12, C.denim, 2, C.white, 1),
    at(24, 58, 1, circle(-7, 0, 5, C.red, C.ink, 1), circle(0, -3, 5, C.red, C.ink, 1), circle(7, 0, 5, C.red, C.ink, 1)), arrow(36, 58, 44, 58, C.white, 1.6), rect(48, 52, 22, 12, C.denim, 2, C.white, 1), rect(70, 52, 10, 12, '#f2c14e', 2, C.white, 1),
    line('M86 24 L86 96', 'rgba(255,255,255,0.4)', 1),
    rect(90, 20, 20, 76, 'rgba(255,255,255,0.08)', 1, C.white, 0.8), ...[30, 44, 58, 72, 86].map((y) => all(rect(92, y - 5, 8, 8, C.denim, 1, null), rect(101, y - 5, 6, 8, '#f2c14e', 1, null))),
    at(24, 86, 0.7, fig(0, '#c96b3c', 'smile', { h: 0.5 })), arrow(36, 84, 44, 84, C.white, 1.6), rect(48, 78, 22, 12, '#d64545', 2, C.white, 1), rect(70, 78, 10, 12, '#f2c14e', 2, C.white, 1))),
    ground),
  'idé.logik': all(rect(4, 4, 112, 108, '#f6f2ea', 3, null), circle(38, 48, 30, '#dfeaf6', C.denim, 1.6), circle(38, 56, 18, '#c7e6c7', C.green, 1.6), circle(38, 60, 4, HL, C.ink, 1),
    arrow(72, 48, 92, 48, HL, 2.6), check(102, 48, 1.3),
    greyed(circle(30, 96, 10, C.grey2, C.ink, 1), circle(56, 96, 10, C.grey2, C.ink, 1), circle(56, 96, 3, C.grey, null)), cross(86, 96, 0.9)),
  'idé.teologi': all(rect(4, 4, 112, 108, STONE, 3, null), arch(60, 60, 34, 52, '#bfe3f5'), rays(60, 22, 6, 22, 10, '#f2d04e', 1.4),
    rect(28, 82, 64, 6, WOOD, 1, C.ink, 1.2), line('M36 88 L36 112 M84 88 L84 112', '#7a4a20', 2.4), book(60, 80, 0.9, ROBE), at(60, 70, 1, crossMark(GOLD)),
    scholar(102, 0.7, ROBE, 'calm'), monk(18, 0.7, MONK, 'calm'), candle(36, 82, 0.7), candle(84, 82, 0.7), ground),
  'idé.skolastik': all(rect(4, 4, 112, 108, '#f3ece0', 3, null), scales(60, 64, 1.2, 0, cbook(0, -2, 0.55, ROBE, crossMark()), all(cbook(0, -2, 0.55, C.denim), at(0, 0, 0.32, column(0, 14, 1)))),
    monk(16, 0.62, MONK, 'calm'), scholar(104, 0.62, ROBE, 'calm'), heart(60, 18, 0.6, GOLD), ground),
  'idé.disputation': all(rect(4, 4, 112, 108, STONE, 3, null), arch(60, 64, 30, 56, '#f6efe0'),
    rect(48, 76, 24, 6, WOOD, 1, C.ink, 1.1), path('M50 82 L70 82 L66 112 L54 112 Z', WOOD, C.ink, 1.1), scholar(60, 0.9, ROBE, 'smile'), reach(60, 0.9, 1, 76, 52),
    bubble(86, 22, 22, T(86, 27, '!', 13, HL), true), ...[[16, '#3f6fb5'], [34, GREEN], [102, '#7a5aa8']].map(([x, c], i) => all(fig(+x!, c as string, i === 1 ? 'shock' : 'smile', { h: 0.56 }))),
    bubble(26, 30, 18, T(26, 35, '?', 12, C.denim), false), bubble(106, 44, 18, T(106, 49, '?', 12, C.denim), true), ground),

  // ── 2153 Humanismens idéer ──
  'idé.medeltiden': all(line('M8 92 L112 92', GREY, 3), path('M112 87 L118 92 L112 97 Z', GREY, null),
    greyed(at(20, 86, 1, rect(-14, -4, 28, 4, C.white, 0.5, C.ink, 1), column(-8, -4, 0.6), column(8, -4, 0.6), path('M-15 -30 L0 -38 L15 -30 Z', C.white, C.ink, 1))),
    rect(36, 18, 48, 70, 'rgba(242,193,78,0.25)', 6, HL, 2), at(60, 84, 1, rect(-18, -26, 36, 26, STONE2, 0.5, C.ink, 1.2), path('M-18 -26 L-18 -32 L-12 -32 L-12 -26 M-6 -26 L-6 -32 L0 -32 L0 -26 M6 -26 L6 -32 L12 -32 L12 -26', STONE2, C.ink, 1.2), rect(-4, -10, 8, 10, '#7a4a20', 3, C.ink, 1), rect(20, -44, 10, 44, STONE2, 0.5, C.ink, 1.2), path('M18 -44 L25 -56 L32 -44 Z', ROOF, C.ink, 1.1)),
    greyed(at(100, 86, 1, rect(-12, -18, 24, 18, C.white, 0.5, C.ink, 1), path('M-10 -18 C-10 -34 10 -34 10 -18 Z', C.white, C.ink, 1))),
    T(20, 108, '500', 9, GREY), T(84, 108, '1500', 9, GREY), line('M36 96 L36 100 M84 96 L84 100', GREY, 1.4)),
  'idé.grekiska': all(fig(28, '#c96b3c', 'smile', { h: 0.9 }), bubble(70, 34, 60, all(rect(46, 25, 18, 14, '#2f6fb0', 1, C.ink, 0.8), line('M46 29 L64 29 M46 33 L64 33', C.white, 1.4), rect(46, 25, 7, 6, '#2f6fb0', 0, null), line('M49.5 25 L49.5 31 M46 28 L53 28', C.white, 1.2), column(80, 42, 0.4), column(90, 42, 0.4)), true),
    book(84, 92, 0.8, '#2f6fb0'), ground),
  'idé.människovärde': all(rect(4, 4, 112, 108, '#fff7e8', 3, null), baby(18, 100, 0.9),
    fig(44, '#3f6fb5', 'smile', { h: 0.82 }), fig(76, '#7a5aa8', 'smile', { h: 0.72, hairStyle: 'long' }), fig(104, '#b07a2a', 'smile', { h: 0.64, hair: '#d8d8d8' }), line('M114 112 L114 78', '#7a4a20', 2),
    ...[18, 44, 76, 104].map((x) => all(circle(x, 22, 10, GOLD, C.ink, 1.2), heart(x, 23, 0.55, C.red))),
    T(31, 27, '=', 14, HL), T(60, 27, '=', 14, HL), T(90, 27, '=', 14, HL), ground),
  'idé.bildad': all(rect(4, 4, 112, 108, '#f6f2ea', 3, null),
    thought(70, 30, 74, all(at(46, 30, 1, circle(0, 0, 7, SEA, C.ink, 0.9), line('M0 -7 L0 7 M-7 0 L7 0', C.ink, 0.5)), rect(56, 23, 14, 12, '#f6ead0', 1, WOOD, 1.4), path('M58 33 L62 27 L65 31 L68 29 L69 33 Z', GRASS, null), at(80, 32, 0.6, column(0, 8, 1)), at(94, 30, 1, path('M-4 4 L-4 -4 L5 -7 L5 1', 'none', C.ink, 1.3), circle(-6, 4, 2, C.ink, null), circle(3, 1, 2, C.ink, null)))),
    fig(52, '#3f6fb5', 'smile', { h: 0.72 }), on(52, 0.72, line('M-4 -40 L0 -30 L4 -40', '#d64545', 3)),
    thought(22, 58, 22, ''), greyed(fig(14, C.grey, 'smile', { h: 0.42 })), ground),
  'idé.vältalighet': all(rect(4, 4, 112, 108, '#f6f2ea', 3, null), rect(14, 72, 30, 40, '#c9b98a', 1, C.ink, 1.3), fig(29, ROBE, 'smile', { h: 0.62, bottom: ROBE }), reach(29, 0.62, 1, 44, 54),
    path('M50 40 C62 32 72 48 86 40 M50 50 C62 42 72 58 86 50 M50 60 C62 52 72 68 86 60', 'none', GOLD, 2.4),
    ...[[78, '#3f6fb5'], [94, GREEN], [108, '#7a5aa8']].map(([x, c]) => bust(+x!, 96, c as string, 1.3)), heart(94, 70, 0.5, C.red), ground),
  'idé.mångsidig': all(rect(4, 4, 112, 108, '#f6f2ea', 3, null), circle(70, 50, 38, 'rgba(242,193,78,0.18)', null), fig(70, '#7a5aa8', 'smile', { h: 0.8 }),
    at(38, 24, 1, rect(-1.5, -10, 3, 16, WOOD, 1, C.ink, 0.8), path('M-2 -10 L0 -16 L2 -10 Z', '#d64545', C.ink, 0.6)), quill(102, 28, 0.6, 20), gear(104, 64, 8), at(40, 64, 1, circle(0, 0, 8, '#bfe3f5', C.ink, 1), line('M0 -8 L0 8 M-8 0 L8 0', C.ink, 0.6)), at(70, 14, 1, path('M-6 4 L-6 -4 L6 -8 L6 0', 'none', C.ink, 1.6), circle(-8, 4, 2.4, C.ink, null), circle(4, 0, 2.4, C.ink, null)),
    at(36, 96, 1, line('M0 -12 L8 4 M0 -12 L-8 4', C.ink, 1.4), circle(0, -12, 1.6, C.ink, null)),
    greyed(fig(16, C.grey, 'smile', { h: 0.5 }), gear(16, 48, 5, GREY)), ground),

  // ── 2154 Upplysningens tänkande ──
  'idé.okunnighet': all(rect(4, 4, 112, 108, '#d8d6e0', 3, null), board(50, 14, 62, 36, all(T(81, 38, '2+2=', 13, C.white, 600), T(104, 38, '?', 13, '#f2c14e'))),
    fig(30, '#7a8a9a', 'frown', { h: 0.84 }), reach(30, 0.84, 1, 36, 38), qm(14, 30, 14, HL), qm(48, 56, 12, HL),
    thought(84, 76, 30, ''), at(62, 104, 1, g('rotate(180)', cbook(0, 0, 0.4, '#5a5a6a'))), ground),
  'idé.religionskritik': all(sky('#f3ece0', 112), rect(14, 88, 30, 24, WOOD, 1, C.ink, 1.3), g('translate(0 -24)', fig(29, '#3f6fb5', 'angry', { h: 0.72 })), g('translate(0 -24)', reach(29, 0.72, 1, 46, 40)),
    at(56, 38, 1, rect(-12, -16, 24, 30, PARCH, 1, C.ink, 1.2), church(-2, 10, 0.42), line('M-10 -12 L10 10 M10 -12 L-10 10', C.red, 2.2)),
    bubble(86, 22, 40, all(church(80, 32, 0.38), T(98, 30, '!', 14, C.red)), false),
    ...[[70, '#c96b3c'], [86, GREEN], [102, '#7a5aa8']].map(([x, c]) => bust(+x!, 98, c as string, 1.2)), ground),
  'idé.deism': all(sky('#efe9f7', 112), circle(60, 66, 32, '#dfeaf6', C.ink, 1.4), gear(50, 58, 10, '#c9a24a'), gear(70, 74, 9, '#8a8f98'), gear(72, 52, 6, '#c9a24a'), earth(50, 82, 7),
    arrow(92, 40, 100, 30, GREY, 1.6), cloud(96, 18, 1.1, C.white), at(66, 26, 1, circle(0, 0, 4, 'none', GOLD, 2), line('M4 0 L14 0 M10 0 L10 4 M13 0 L13 3', GOLD, 2)),
    path('M84 58 A26 26 0 0 1 72 92', 'none', HL, 2), path('M70 96 L72 90 L76 95 Z', HL, null), ground),
  'idé.frihet': all(sky(DAY, 112), sunS(98, 18, 7), hill(98), fig(56, '#d64545', 'laugh', { h: 0.86 }), reach(56, 0.86, -1, 34, 34), reach(56, 0.86, 1, 78, 34),
    chain(26, 40, 2), chain(80, 40, 2), bird(30, 16, 0.8), bird(80, 12, 0.7), greyed(cage(18, 94, 0.8)), ground),
  'idé.naturrätt': all(sky('#e6f4e0', 112), sunS(100, 16, 7), hill(96), tree(18, 100, 0.9), glow(58, 84, 26), baby(60, 92, 1.3),
    at(32, 40, 1, circle(0, 0, 11, C.white, HL, 1.6), heart(0, 1, 0.7, C.red)), at(60, 28, 1, circle(0, 0, 11, C.white, HL, 1.6), bird(0, 2, 0.7)), at(88, 40, 1, circle(0, 0, 11, C.white, HL, 1.6), house(0, 6, 0.45)),
    line('M38 50 L50 74 M60 39 L60 68 M82 50 L70 74', HL, 1.4, '3 3'),
    greyed(at(104, 100, 0.8, path('M-8 -36 L-8 -44 L-4 -40 L0 -46 L4 -40 L8 -44 L8 -36 Z', GOLD, C.ink, 1), circle(0, -30, 6, C.skin, C.ink, 1), path('M-9 -22 L9 -22 L11 0 L-11 0 Z', ROBE, C.ink, 1))), ground),
  'idé.framstegstro': all(sky('#f6f2ea', 112), fig(26, '#3f6fb5', 'laugh', { h: 0.82 }), on(26, 0.82, glow(0, -56, 14)),
    circle(40, 52, 3, C.white, C.ink, 1.2), circle(46, 46, 4, C.white, C.ink, 1.2), ellipse(78, 42, 38, 30, C.white, C.ink, 1.6), all(all(...[0, 1, 2, 3].map((i) => rect(46 + i * 14, 66 - i * 9, 14, 6 + i * 9, ['#e6d3b3', '#d4c09a', '#c9b98a', '#bfae7a'][i]!, 1, C.ink, 0.8)), candle(53, 66, 0.45), at(67, 54, 0.6, circle(0, -6, 6, C.yellow, C.ink, 1)), at(95, 34, 0.6, path('M0 -14 C5 -8 5 2 3 6 L-3 6 C-5 2 -5 -8 0 -14 Z', C.white, C.ink, 1), path('M-3 6 L0 12 L3 6 Z', C.orange, null)), arrow(46, 40, 100, 20, HL, 2), sunS(82, 26, 3))),
    heart(52, 90, 0.6, C.red), ground),

  // ── 2155 Sekularisering ──
  'idé.sekularisering': all(sky(DAY, 112), line('M8 104 L112 104', GREY, 2), path('M112 100 L118 104 L112 108 Z', GREY, null),
    church(22, 100, 1.1), church(62, 100, 0.72), church(98, 100, 0.42), house(48, 100, 0.6), house(80, 100, 0.8), house(110, 100, 0.95), at(86, 100, 1, rect(-6, -40, 12, 40, '#9fb3c8', 1, C.ink, 1), ...[-32, -24, -16, -8].map((y) => line(`M-3 ${y} L3 ${y}`, '#e6eef6', 1.4))),
    T(22, 116, '1800', 7, GREY), T(98, 116, '2000', 7, GREY)),
  'idé.modernisering': all(greyed(at(28, 100, 1, house(0, 0, 0.9), line('M10 0 L40 0', '#a08a5a', 2), at(26, -2, 0.5, ellipse(0, -8, 12, 7, '#9a7a5a', C.ink, 1), line('M-6 -2 L-6 4 M6 -2 L6 4', C.ink, 1.6))), line('M4 100 L56 100', '#a08a5a', 2)),
    arrow(52, 60, 66, 60, HL, 2.6),
    at(92, 100, 1, rect(-22, -40, 14, 40, '#9fb3c8', 1, C.ink, 1.2), rect(-6, -54, 12, 54, '#c9d4e0', 1, C.ink, 1.2), rect(8, -30, 16, 30, '#d4a373', 1, C.ink, 1.2), rect(12, -46, 4, 16, '#8a8f98', 0.5, C.ink, 0.8), cloud(16, -52, 0.5, C.grey2),
      ...[-34, -26, -18, -10].map((y) => line(`M-19 ${y} L-11 ${y} M-3 ${y - 12} L3 ${y - 12}`, '#e6eef6', 1.4))), at(92, 108, 1, rect(-24, -6, 30, 8, C.red, 2, C.ink, 1), circle(-18, 2, 2, C.ink, null), circle(0, 2, 2, C.ink, null)), ground),
  'idé.trossamfund': all(sky('#f6f2ea', 112), circle(60, 70, 44, 'rgba(242,193,78,0.18)', HL, 1.6, ), church(58, 76, 0.9),
    ...[[22, 92, '#c96b3c'], [36, 100, C.denim], [52, 104, '#7a5aa8'], [68, 104, GREEN], [84, 100, '#d64545'], [98, 92, '#b07a2a']].map(([x, y, c]) => bust(+x!, +y!, c as string, 1.1))),
  'idé.konfessionslös': all(sky('#f6f2ea', 112),
    greyed(ring(22, 34, 16, 20, GREY, 'rgba(200,200,200,0.2)'), church(20, 42, 0.5), ring(60, 30, 16, 20, GREY, 'rgba(200,200,200,0.2)'), mosque(56, 40, 0.48), ring(98, 34, 16, 20, GREY, 'rgba(200,200,200,0.2)'), pagoda(98, 42, 0.52)),
    fig(52, '#3f6fb5', 'smile', { h: 0.62 }), reach(52, 0.62, 1, 78, 82),
    at(86, 82, 1, rect(-12, -8, 24, 16, C.white, 2, C.ink, 1.3), rect(-9, -5, 9, 10, 'none', 1, HL, 1.2), line('M3 -3 L9 -3 M3 1 L9 1', '#9aa3ad', 1)),
    ground),
  'idé.kyrklig': all(sky(DAY, 112), church(58, 82, 1.2),
    line('M40 64 L22 50 M78 56 L98 44 M42 80 L24 94 M76 80 L96 94', GOLD, 1.4, '2 3'),
    at(18, 44, 1, circle(0, 0, 12, C.white, GOLD, 1.6), circle(-3, 1, 4, 'none', GOLD, 1.6), circle(3, 1, 4, 'none', GOLD, 1.6)),
    at(102, 38, 1, circle(0, 0, 12, C.white, GOLD, 1.6), path('M-7 -2 L7 -2 L5 6 L-5 6 Z', '#bfe3f5', C.ink, 1), line('M0 6 L0 9 M-3 9 L3 9', C.ink, 1.2)),
    at(18, 98, 1, circle(0, 0, 12, C.white, GOLD, 1.6), candle(0, 7, 0.7)),
    at(102, 98, 1, circle(0, 0, 12, C.white, GOLD, 1.6), cbook(0, 0, 0.45, C.dark, crossMark())), line('M4 112 L116 112', C.grey2, 2)),
  'idé.religiös-mångfald': all(sky(DAY, 112), church(18, 100, 0.72), mosque(50, 100, 0.8), pagoda(90, 100, 0.85),
    ...[[14, '#c96b3c', false], [32, C.denim, true], [52, GREEN, true], [70, '#7a5aa8', false], [88, '#d64545', true], [106, '#b07a2a', false]].map(([x, c, l]) => bust(+x!, 102, c as string, 0.9, false, !!l)), line('M4 108 L116 108', STONE2, 4)),

  // ── 2156 Vetenskap och religion ──
  'idé.geocentrisk': all(sky('#1f2d55', 112), orbit(60, 58, 26, 14), orbit(60, 58, 40, 24), orbit(60, 58, 52, 34), earth(60, 58, 11),
    planet(86, 58, 4, '#cfcfcf'), sunS(30, 79, 6), planet(104, 40, 4, '#e8a33c'), arrow(80, 72, 74, 76, HL, 1.6), arrow(36, 40, 46, 36, HL, 1.6),
    ...[[12, 14], [108, 12], [16, 100], [104, 100]].map(([x, y]) => starDot(x!, y!))),
  'idé.heliocentrisk': all(sky('#1f2d55', 112), orbit(60, 58, 24, 14), orbit(60, 58, 40, 24), orbit(60, 58, 52, 34), sunS(60, 58, 10),
    earth(100, 58, 5.5), planet(44, 70, 3.5, '#cfcfcf'), planet(30, 34, 4.5, '#e8a33c'), arrow(96, 74, 86, 80, HL, 1.6),
    ...[[12, 14], [108, 12], [16, 100], [104, 100]].map(([x, y]) => starDot(x!, y!))),
  'idé.kätteri': all(sky('#f3ece0', 112), ...[14, 30, 46].map((x) => all(bust(x, 82, '#9aa3ad', 1.2), cbook(x, 100, 0.34, ROBE, crossMark()))),
    fig(96, '#3f6fb5', 'smile', { h: 0.72 }), reach(96, 0.72, -1, 82, 70), at(80, 66, 1, rect(-6, -8, 12, 16, '#f2c14e', 1, C.ink, 1), sunS(0, 0, 2.6)),
    church(30, 54, 0.6), bubble(30, 14, 18, T(30, 19, '!', 12, C.red), true), line('M64 30 L64 104', HL, 1.6, '4 3'), ground),
  'idé.universum': all(sky('#141a33', 112), path('M60 56 C76 44 92 56 84 68 C74 82 46 76 44 60 C42 44 66 34 80 42', 'none', '#b8a0f0', 3), path('M60 56 C44 68 28 56 36 44 C46 30 74 36 76 52', 'none', '#8ad0f0', 3), circle(60, 56, 5, '#fff2c0', null),
    ...[[14, 14], [30, 28], [100, 18], [108, 40], [18, 90], [40, 100], [96, 96], [110, 80], [74, 14], [50, 20], [24, 60], [100, 64]].map(([x, y], i) => starDot(x!, y!, i % 3 ? 1.2 : 1.8)),
    planet(98, 86, 6, '#e8a33c'), ellipse(98, 86, 10, 3, 'none', '#f6e08a', 1.2), planet(20, 30, 4, '#7fbf6a')),
  'idé.evolution': all(rect(4, 4, 112, 108, '#eef6ea', 3, null), rect(4, 70, 30, 42, '#bfe3f5', 3, null), fish(18, 88, 1),
    arrow(34, 84, 42, 84, HL, 2), lizard(66, 88, 0.9), arrow(84, 84, 90, 84, HL, 2), mammal(100, 92, 0.85),
    path('M60 60 L60 40 M60 40 L30 24 M60 40 L90 24 M60 50 L80 36', 'none', '#7a4a20', 2), circle(30, 22, 4, GRASS, C.ink, 1), circle(90, 22, 4, GRASS, C.ink, 1), circle(80, 34, 3, GRASS, C.ink, 1), circle(60, 62, 3, GRASS, C.ink, 1), ground),
  'idé.fossil': all(rect(4, 4, 112, 108, '#efe6d2', 3, null), path('M14 30 C40 20 80 22 106 32 L110 96 C80 104 40 104 10 96 Z', '#c9b98a', C.ink, 1.4), line('M14 52 C40 48 80 50 108 56 M12 76 C40 72 80 74 109 78', '#b0a070', 1),
    at(48, 62, 1, path('M0 0 m-16 0 a16 16 0 1 0 32 0 a16 16 0 1 0 -32 0', '#d8caa4', '#6a5a3a', 1.6), path('M0 0 C0 -6 8 -6 8 0 C8 8 -6 10 -8 0 C-10 -12 12 -14 14 0', 'none', '#6a5a3a', 1.4), ...Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return line(`M${f1(Math.cos(a) * 10)} ${f1(Math.sin(a) * 10)} L${f1(Math.cos(a) * 16)} ${f1(Math.sin(a) * 16)}`, '#6a5a3a', 0.8); })),
    at(84, 78, 1, line('M-12 0 L12 0', '#6a5a3a', 1.6), ...[-8, -4, 0, 4, 8].map((x) => line(`M${x} -5 L${x} 5`, '#6a5a3a', 1)), path('M12 0 L18 -5 L18 5 Z', 'none', '#6a5a3a', 1.2), circle(-14, 0, 3, 'none', '#6a5a3a', 1.2)),
    g('translate(96 40) rotate(30)', rect(-2, -14, 4, 14, WOOD, 1, C.ink, 1), rect(-4, 0, 8, 8, '#e6d3b3', 1, C.ink, 1))),
  'idé.förenlig': all(rect(4, 4, 112, 108, '#f6f2ea', 3, null), puzzle(42, 46, 1, '#f2d9a0', true, cbook(0, 0, 0.6, ROBE, crossMark())), puzzle(74, 46, 1, '#bfe3f5', false, all(circle(0, 0, 6, 'none', C.ink, 1.6), line('M4 4 L10 10', C.ink, 2.4))), check(92, 22, 1),
    greyed(path('M16 84 L44 84 L44 92 C50 90 50 102 44 100 L44 108 L16 108 Z', C.grey2, C.ink, 1.2), path('M60 84 L88 84 L88 108 L60 108 L60 100 C66 102 66 90 60 92 Z', C.grey2, C.ink, 1.2)), cross(100, 96, 0.9)),

  // ── 2157 Moderna livsåskådningar ──
  'idé.meningen-med-livet': all(sky('#fde2c2', 112), hill(96, '#8cbf6a'), line('M10 108 C30 100 50 96 70 80 C80 72 86 64 92 54', '#e6d3b3', 4),
    glow(94, 40, 22), circle(94, 40, 16, 'rgba(255,255,255,0.8)', GOLD, 2), heart(94, 34, 0.55, C.red), bust(88, 44, '#c96b3c', 0.6), bust(100, 44, C.green, 0.6, false, true), rays(94, 40, 18, 24, 12, GOLD, 1.4),
    g('translate(0 -6)', fig(40, '#3f6fb5', 'smile', { h: 0.62 })), arrow(52, 74, 74, 54, HL, 2.4), ground),
  'idé.existentiell': all(rect(4, 4, 112, 108, '#efe9f7', 3, null), ...[[14, 14], [40, 10], [72, 16], [104, 10]].map(([x, y]) => starDot(x!, y!, 1.6, '#8a6bbf')),
    line('M10 76 L110 76', GREY, 1.6), baby(18, 76, 0.6), g('translate(0 -36)', fig(44, '#c96b3c', 'smile', { h: 0.42 })), g('translate(0 -36)', fig(72, '#7a8a9a', 'calm', { h: 0.42, hair: '#d8d8d8' })),
    at(100, 76, 1, path('M-7 0 L-7 -12 C-7 -18 7 -18 7 -12 L7 0 Z', '#b0b6bf', C.ink, 1.1), line('M0 -12 L0 -6 M-3 -9 L3 -9', C.ink, 1)),
    thought(60, 20, 80, all(qm(44, 25, 13, HL), T(60, 25, '?', 13, HL), qm(76, 25, 13, HL))), line('M20 66 C40 56 80 56 100 66', '#8a6bbf', 1, '2 3')),
  'idé.ateism': all(sky(DAY, 112), cloud(30, 20, 1.1, C.white), cloud(96, 22, 1, C.white),
    fig(34, '#3f6fb5', 'smile', { h: 0.84 }), on(34, 0.84, line('M-16 -30 L16 -14 M16 -30 L-16 -14', C.ink, 7), line('M-16 -30 L16 -14 M16 -30 L-16 -14', C.skin, 5)),
    bubble(82, 46, 46, all(cloud(82, 40, 0.8, C.white), ...[-10, -4, 2, 8].map((dx) => line(`M${82 + dx} 46 L${82 + dx * 1.6} 54`, GOLD, 1.6)), line('M64 34 L100 56 M100 34 L64 56', C.red, 2.6)), true),
    ground),
  'idé.sekulär-humanism': all(sky('#fff7e8', 112),
    at(96, 24, 1, circle(0, 0, 14, C.white, GREY, 1.2), cloud(0, -2, 0.6, C.white), ...[-5, 0, 5].map((dx) => line(`M${dx} 3 L${dx * 1.6} 10`, GOLD, 1.4)), line('M-10 -10 L10 10', C.red, 2.4)),
    fig(52, '#3f6fb5', 'smile', { h: 0.86 }), reach(52, 0.86, -1, 28, 52), reach(52, 0.86, 1, 76, 52),
    at(28, 44, 1, circle(0, -6, 7, C.yellow, C.ink, 1), rect(-3.5, 1, 7, 4, GREY, 0.5, C.ink, 0.6), rays(0, -6, 9, 13, 8, GOLD, 1.2)), heart(76, 48, 1, C.red),
    ...[[14, '#c96b3c'], [92, GREEN], [106, '#7a5aa8']].map(([x, c]) => bust(+x!, 98, c as string, 1)), ground),
  'idé.andlighet': all(sky('#1f2d55', 112), ...[[14, 14], [30, 30], [52, 12], [74, 22], [96, 10], [108, 34], [86, 40], [20, 50]].map(([x, y], i) => starDot(x!, y!, i % 2 ? 1.4 : 2)),
    path('M4 96 C30 88 70 86 116 92 L116 112 L4 112 Z', '#3f5f4a', null), tree(98, 100, 0.8, '#3f7a52'),
    fig(52, '#7a5aa8', 'calm', { h: 0.8 }), reach(52, 0.8, -1, 34, 60), reach(52, 0.8, 1, 70, 60), on(52, 0.8, glow(0, -26, 16, 'rgba(242,193,78,0.6)'), heart(0, -26, 0.7, GOLD)),
    line('M52 70 C48 50 36 40 30 30 M52 70 C54 46 54 26 52 12 M52 70 C62 50 70 36 74 22 M52 70 C70 56 80 46 86 40', '#f6e8a8', 1, '2 3')),
  'idé.nyandlighet': all(rect(4, 4, 112, 108, '#f3ecf7', 3, null), rect(8, 76, 104, 6, '#8a5a8a', 1, C.ink, 1.2), line('M18 82 L18 112 M102 82 L102 112', '#6a3a6a', 2.4),
    crystal(24, 76, 1.2), crystal(36, 76, 0.8, '#9fd8e0'), candle(52, 76, 0.9), zodiac(82, 44, 22), rect(68, 66, 10, 10, '#d64545', 1, C.ink, 0.8), rect(80, 64, 10, 10, '#2f6fb0', 1, C.ink, 0.8), starDot(73, 71, 1.4, C.white), sunS(85, 69, 2),
    at(100, 76, 1, rect(-2, -6, 4, 6, '#b07a2a', 1, C.ink, 0.8), path('M0 -8 C-3 -14 3 -16 0 -22', 'none', C.grey2, 1.2)), at(24, 40, 1, circle(0, 0, 12, 'rgba(184,160,240,0.35)', null), rays(0, 0, 4, 12, 10, '#b8a0f0', 1.2))),
  'idé.horoskop': all(rect(4, 4, 112, 108, '#f6f2ea', 3, null), rect(14, 16, 64, 84, C.white, 2, C.ink, 1.4), zodiac(46, 44, 20),
    ...[72, 80, 88].map((y) => line(`M20 ${y} L72 ${y}`, '#9aa3ad', 1.4)), fig(98, '#c96b3c', 'smile', { h: 0.7, hairStyle: 'long' }), reach(98, 0.7, -1, 78, 74), ground),
  'idé.astrologi': all(sky('#1f2d55', 112), ...[[14, 16], [30, 10], [46, 18], [24, 30]].map(([x, y]) => starDot(x!, y!, 1.8)), line('M14 16 L30 10 L46 18 L24 30 Z', '#f6e8a8', 0.8),
    zodiac(86, 34, 22), line('M30 34 L56 76 M86 56 L64 76', '#f6e8a8', 1, '3 3'), glow(60, 82, 16, 'rgba(246,232,168,0.25)'),
    fig(60, '#7a5aa8', 'smile', { h: 0.5, hairStyle: 'long' }), heart(18, 80, 0.5, C.red), line('M4 112 L116 112', C.grey2, 2)),
  'idé.självförverkligande': all(sky(DAY, 112), path('M4 112 L60 46 L116 112 Z', '#9fb08a', C.ink, 1.4), path('M50 58 L60 46 L70 58 C64 55 56 55 50 58 Z', C.white, C.ink, 1),
    line('M20 112 C40 98 30 88 48 80 C60 74 56 64 60 50', '#e6d3b3', 3), line('M70 46 L70 22', C.ink, 1.4), path('M70 22 L82 26 L70 30 Z', HL, C.ink, 1),
    g('translate(0 -66)', fig(58, '#d64545', 'laugh', { h: 0.34 })), greyed(fig(18, C.grey, 'smile', { h: 0.42 }), fig(30, C.grey, 'smile', { h: 0.42 })), line('M36 112 L108 112', '#c9ced4', 2)),
};
