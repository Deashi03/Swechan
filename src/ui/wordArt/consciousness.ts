/**
 * Historia & humaniora → Filosofi & etik → Medvetande & identitet, 2241–2247 (0.39): consciousness and
 * experience, soul and body, personal identity, free will, intention and action, time and self-understanding,
 * and artificial consciousness. Abstract words are symbolic mini-scenes: the coloured idea dominates and a grey
 * copy stands beside it as contrast. Philosophers are small neutral figures in robes, never portraits. The inner
 * life is a glowing core or a thought cloud, the soul a pale light, the body solid colour. Digits, ?, = and ! only;
 * no words, no letters and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, star, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm, cat, cloud, dog, heart } from './people';
import { P as F, type Mood, greyed, sepia } from './blindFix';

// ── Colours ──────────────────────────────────────────────────────────
const GOLD = C.gold;
const PAPER = '#f6f2ea';
const DAY = '#d6ecf7';
const NIGHT = '#24315a';
const ROBE = '#7a5aa6';
const SOUL = '#fff4c2';
const GLOW = 'rgba(242,193,78,0.35)';
const MIND = '#b9a6e6';
const STONE = '#cbbf9f';
const WOOD = '#a8743f';
const GRASS = '#7fbf6a';
const SEA = '#5aa7d6';
const GREY = '#8d949c';
const OK = '#3f9a5a';
const SCREEN = '#cfeaf7';
const METAL = '#b8c2cc';
const f1 = (n: number) => n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);

// ── Figures ──────────────────────────────────────────────────────────
const ground = line('M4 112 L116 112', C.grey2, 2);
const bg = (col: string = PAPER) => rect(4, 4, 112, 108, col, 3, null);
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, hy: ty - 56 * s, sy: ty - 38 * s, cy: ty - 24 * s, sl: x - 13 * s, sr: x + 13 * s }; };
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, 3 * Math.max(0.6, h), C.skin, C.ink, 1.2)); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
/** A philosopher in a long robe (no portrait). */
const sage = (x: number, h = 1, col: string = ROBE, mood: Mood = 'smile') => all(fig(x, col, mood, { h, bottom: col }), on(x, h, path('M-13 -40 L13 -40 L16 48 L-16 48 Z', col, C.ink, 1.4), line('M-12 -36 L12 -36', GOLD, 2)));
/** Hand at the chin (thinking). */
const chin = (x: number, h = 1) => { const q = geo(x, h); return reach(x, h, 1, x + 3 * q.s, q.hy + 12 * q.s); };
/** A glowing core in the chest of the figure at x (the inner self). */
const core = (x: number, h = 1, col: string = GOLD) => { const q = geo(x, h); return all(circle(x, q.cy, 10 * q.s, GLOW, null), circle(x, q.cy, 5 * q.s, col, C.ink, 1)); };
/** A thought cloud at (x, y) with a trail of dots towards (tx, ty). */
const think = (x: number, y: number, rx: number, ry: number, inner: Svg, tx: number, ty: number) => { const ex2 = x - tx, ey = y + ry * 0.6 - ty; return all(
  circle(+f1(tx + ex2 * 0.2), +f1(ty + ey * 0.2), 2.2, C.white, C.ink, 1.1), circle(+f1(tx + ex2 * 0.42), +f1(ty + ey * 0.42), 3.2, C.white, C.ink, 1.2),
  ellipse(x, y, rx, ry, C.white, C.ink, 1.6), inner); };

// ── Things ───────────────────────────────────────────────────────────
const qm = (x: number, y: number, size = 14, col: string = HL) => T(x, y, '?', size, col);
const check = (x: number, y: number, s = 1, col: string = OK) => at(x, y, s, circle(0, 0, 8, C.white, col, 1.6), line('M-4 0 L-1 3 L4 -3', col, 2.2));
const cross = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, circle(0, 0, 8, C.white, col, 1.6), line('M-3.5 -3.5 L3.5 3.5 M3.5 -3.5 L-3.5 3.5', col, 2.2));
const rays = (x: number, y: number, r1: number, r2: number, n = 12, col: string = GOLD, sw = 1.6) => all(...Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * r1)} ${f1(y + Math.sin(a) * r1)} L${f1(x + Math.cos(a) * r2)} ${f1(y + Math.sin(a) * r2)}`, col, sw); }));
const sunS = (x: number, y: number, r = 7) => all(rays(x, y, r + 2, r + 5, 8), circle(x, y, r, C.yellow, C.ink, 1.2));
const gear = (x: number, y: number, r = 8, col: string = '#8a8f98') => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return circle(+f1(x + Math.cos(a) * r), +f1(y + Math.sin(a) * r), r * 0.3, col, C.ink, 0.8); }), circle(x, y, r, col, C.ink, 1.2), circle(x, y, r * 0.35, C.white, C.ink, 1));
const bulb = (x: number, y: number, s = 1) => at(x, y, s, circle(0, -2, 14, GLOW, null), circle(0, -2, 8, C.yellow, C.ink, 1.4), rect(-4, 5, 8, 6, C.silver, 1.5, C.ink, 1.1));
const eye = (x: number, y: number, s = 1, col: string = '#5a8ac6') => at(x, y, s, path('M-12 0 C-6 -8 6 -8 12 0 C6 8 -6 8 -12 0 Z', C.white, C.ink, 1.4), circle(0, 0, 4.4, col, C.ink, 1), circle(0, 0, 1.8, C.ink, null));
/** A head in profile facing right. */
const head = (x: number, y: number, s = 1, col: string = C.skin) => at(x, y, s,
  path('M-16 18 L-16 6 C-24 -4 -22 -24 -4 -26 C12 -28 20 -16 18 -6 L22 2 L18 4 L18 10 C18 14 12 14 8 13 L8 18 Z', col, C.ink, 1.6), circle(10, -6, 1.4, C.ink, null));
/** A brain seen from the side. */
const brain = (x: number, y: number, s = 1, col = '#f2b8c6') => at(x, y, s,
  path('M-18 4 C-24 0 -22 -12 -14 -14 C-12 -22 0 -24 4 -18 C10 -24 22 -18 20 -8 C26 -4 24 8 16 8 C12 14 2 14 -2 10 C-8 14 -18 12 -18 4 Z', col, C.ink, 1.5),
  path('M-12 -6 C-6 -10 -2 -4 2 -8 M6 -12 C8 -6 14 -6 14 0 M-10 4 C-4 2 0 6 6 2', 'none', '#b5677a', 1.2));
const tree = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s, rect(-2.5, -16, 5, 16, C.brown, 1, C.ink, 1), circle(0, -24, 11, col, C.ink, 1.2), circle(-7, -19, 7, col, C.ink, 1.2), circle(7, -19, 7, col, C.ink, 1.2));
const house = (x: number, y: number, s = 1) => at(x, y, s, rect(-12, -16, 24, 16, '#f2ece0', 1, C.ink, 1.3), path('M-15 -16 L0 -28 L15 -16 Z', '#c0563d', C.ink, 1.3), rect(-3, -9, 6, 9, '#8a5a34', 1, C.ink, 0.9));
const palm = (x: number, y: number, s = 1) => at(x, y, s, ...[-4.6, -1.6, 1.4, 4.4].map((d, i) => rect(d - 1.3, -9 + Math.abs(i - 1.5) * 1.2, 2.6, 9, C.skin, 1.3, C.ink, 0.9)), path('M-5.5 -1 L5.5 -1 L5 5 C4 8 -4 8 -5 5 Z', C.skin, C.ink, 1), path('M-5.4 1 L-9 -3 C-10 -4 -11 -2 -10 -1 L-5 5', C.skin, C.ink, 1));
const cbook = (x: number, y: number, s = 1, col: string = ROBE) => at(x, y, s, rect(-10, -13, 20, 26, col, 2, C.ink, 1.3), line('M-7 -13 L-7 13', 'rgba(0,0,0,0.25)', 1.4));
/** A wall clock; hands given in hours (h) and minutes (m). */
const clock = (x: number, y: number, r: number, h = 10, m = 10, col: string = C.white) => { const ah = ((h % 12) / 12) * Math.PI * 2 - Math.PI / 2, am = (m / 60) * Math.PI * 2 - Math.PI / 2; return all(circle(x, y, r, col, C.ink, 1.6),
  ...Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return circle(+f1(x + Math.cos(a) * r * 0.8), +f1(y + Math.sin(a) * r * 0.8), Math.max(0.6, r * 0.05), C.ink, null); }),
  line(`M${x} ${y} L${f1(x + Math.cos(ah) * r * 0.45)} ${f1(y + Math.sin(ah) * r * 0.45)}`, C.ink, Math.max(1.2, r * 0.12)), line(`M${x} ${y} L${f1(x + Math.cos(am) * r * 0.7)} ${f1(y + Math.sin(am) * r * 0.7)}`, C.ink, Math.max(1, r * 0.08)), circle(x, y, Math.max(1, r * 0.08), C.ink, null)); };
const frame = (x: number, y: number, w: number, h: number, inner: Svg = '', col: string = GOLD) => all(rect(x - 3, y - 3, w + 6, h + 6, col, 1, C.ink, 1.4), rect(x, y, w, h, C.white, 0, C.ink, 1), inner);
/** A screen (monitor) with its top-left corner at (x, y). */
const screen = (x: number, y: number, w: number, h: number, inner: Svg = '', stand = true) => all(stand ? all(rect(x + w / 2 - 3, y + h, 6, 8, C.dark, 1, C.ink, 1), rect(x + w / 2 - 12, y + h + 7, 24, 4, C.dark, 2, C.ink, 1)) : '', rect(x - 3, y - 3, w + 6, h + 6, C.dark, 3, C.ink, 1.4), rect(x, y, w, h, SCREEN, 1, null), inner);
/** Code: indented coloured bars. */
const code = (x: number, y: number, n = 5, w = 26) => all(...Array.from({ length: n }, (_, i) => { const ind = [0, 5, 10, 5, 0, 5][i % 6]!; const cols = [C.purple, SEA, C.orange, OK, C.red]; return all(rect(x + ind, y + i * 6, 4, 3, cols[i % 5]!, 1, null), rect(x + ind + 6, y + i * 6, w - ind - 6 - (i % 3) * 4, 3, '#5d6b7a', 1, null)); }));
/** A friendly boxy robot standing with its feet at (x, 112·s). */
const robot = (x: number, y: number, s = 1, col: string = METAL) => at(x, y, s,
  rect(-3, -66, 6, 6, col, 1, C.ink, 1.2), circle(0, -68, 3, C.red, C.ink, 1),
  rect(-12, -60, 24, 18, col, 4, C.ink, 1.6), rect(-8, -56, 16, 9, '#2f3e55', 2, null), circle(-4, -51.5, 2, '#7fe3ff', null), circle(4, -51.5, 2, '#7fe3ff', null),
  rect(-4, -42, 8, 4, col, 1, C.ink, 1.1), rect(-15, -38, 30, 26, col, 4, C.ink, 1.6), circle(0, -26, 4, GOLD, C.ink, 1),
  rect(-23, -36, 7, 20, col, 3, C.ink, 1.3), rect(16, -36, 7, 20, col, 3, C.ink, 1.3),
  rect(-11, -12, 8, 12, col, 2, C.ink, 1.3), rect(3, -12, 8, 12, col, 2, C.ink, 1.3));
/** A computer chip. */
const chip = (x: number, y: number, s = 1, col: string = '#3c4a5e') => at(x, y, s,
  ...[-9, -3, 3, 9].map((d) => line(`M${d} -18 L${d} -14 M${d} 14 L${d} 18 M-18 ${d} L-14 ${d} M14 ${d} L18 ${d}`, GOLD, 2)),
  rect(-14, -14, 28, 28, col, 3, C.ink, 1.5), rect(-7, -7, 14, 14, '#6d7d94', 2, C.ink, 1));
const dice = (x: number, y: number, n: number, s = 1, rot = 0) => { const pos: Record<number, number[][]> = { 1: [[0, 0]], 2: [[-4, -4], [4, 4]], 3: [[-4, -4], [0, 0], [4, 4]], 4: [[-4, -4], [4, -4], [-4, 4], [4, 4]], 5: [[-4, -4], [4, -4], [0, 0], [-4, 4], [4, 4]], 6: [[-4, -4], [4, -4], [-4, 0], [4, 0], [-4, 4], [4, 4]] };
  return g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-9, -9, 18, 18, C.white, 3, C.ink, 1.5), ...pos[n]!.map(([a, b]) => circle(a!, b!, 1.8, C.ink, null))); };
/** A pale, glowing soul shape. */
const soul = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 16, GLOW, null), path('M0 -12 C8 -12 10 -4 8 2 C6 8 8 12 4 14 C2 10 0 12 -2 14 C-4 10 -8 12 -8 6 C-10 0 -8 -12 0 -12 Z', SOUL, '#c9a640', 1.2));
const stoneR = (x: number, y: number, s = 1, col: string = STONE) => at(x, y, s, path('M-12 6 C-14 -2 -8 -10 0 -10 C8 -10 14 -4 12 4 C10 10 -10 12 -12 6 Z', col, C.ink, 1.4), path('M-4 -4 C0 -6 4 -4 6 -2', 'none', 'rgba(0,0,0,0.25)', 1));
const drop = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -9 C6 -2 6 6 0 6 C-6 6 -6 -2 0 -9 Z', SEA, C.ink, 1.2));
const cake = (x: number, y: number, s = 1) => at(x, y, s, path('M-10 6 L10 6 L10 -4 L-10 2 Z', '#f3d9a8', C.ink, 1.2), path('M-10 2 L10 -4 L10 -7 L-10 -1 Z', C.pink, C.ink, 1), circle(4, -9, 2.4, C.red, C.ink, 0.8));
const car = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, path('M-24 0 L-24 -8 L-14 -10 L-8 -18 L10 -18 L16 -10 L24 -8 L24 0 Z', col, C.ink, 1.5), path('M-6 -16 L-11 -10 L0 -10 L0 -16 Z M3 -16 L3 -10 L13 -10 L9 -16 Z', SCREEN, C.ink, 1), circle(-13, 1, 5, C.dark, C.ink, 1.2), circle(13, 1, 5, C.dark, C.ink, 1.2));
const sparkleS = (x: number, y: number, r = 4) => path(`M${x} ${y - r} L${f1(x + r * 0.3)} ${f1(y - r * 0.3)} L${x + r} ${y} L${f1(x + r * 0.3)} ${f1(y + r * 0.3)} L${x} ${y + r} L${f1(x - r * 0.3)} ${f1(y + r * 0.3)} L${x - r} ${y} L${f1(x - r * 0.3)} ${f1(y - r * 0.3)} Z`, C.yellow, C.ink, 0.8);
const helix = (x: number, y: number, h: number) => all(...Array.from({ length: 6 }, (_, i) => line(`M${f1(x - 6 + Math.abs(Math.sin(i)) * 2)} ${f1(y + i * h / 6 + 3)} L${f1(x + 6 - Math.abs(Math.sin(i)) * 2)} ${f1(y + i * h / 6 + 3)}`, [C.red, SEA, GOLD, OK][i % 4]!, 1.6)),
  path(`M${x - 7} ${y} C${x + 9} ${y + h * 0.25} ${x - 9} ${y + h * 0.5} ${x + 7} ${y + h * 0.75} C${x + 9} ${y + h * 0.82} ${x} ${y + h} ${x - 7} ${y + h}`, 'none', C.purple, 2), path(`M${x + 7} ${y} C${x - 9} ${y + h * 0.25} ${x + 9} ${y + h * 0.5} ${x - 7} ${y + h * 0.75} C${x - 9} ${y + h * 0.82} ${x} ${y + h} ${x + 7} ${y + h}`, 'none', C.navy, 2));
const speed = (x: number, y: number, n = 3, len = 10, col: string = GREY) => line(Array.from({ length: n }, (_, i) => `M${x} ${y + i * 6} L${x + len} ${y + i * 6}`).join(' '), col, 1.6);
const chatLines = (x: number, y: number, w: number, n = 3, col = '#7a8794') => line(Array.from({ length: n }, (_, i) => `M${x} ${y + i * 5} L${x + w - (i === n - 1 ? w * 0.4 : 0)} ${y + i * 5}`).join(' '), col, 1.6);
const domino = (x: number, rot: number, col: string = C.white) => g(`translate(${x} 112) rotate(${rot})`, rect(-4, -28, 8, 28, col, 1.5, C.ink, 1.3), line('M-4 -14 L4 -14', C.ink, 1), circle(0, -21, 1.4, C.ink, null), circle(0, -7, 1.4, C.ink, null));

export const CONSCIOUSNESS_MOTIFS: Record<string, Svg> = {
  // ── 2241 Medvetande och upplevelse ──
  /** upplevelse: standing at the sea at sunset, arms open – the experience fills her (glowing heart, sparkles). */
  'medv.upplevelse': all(bg('#fde3c8'), circle(84, 66, 18, '#f59f5a', null), rect(4, 72, 112, 40, SEA, 0, null), line('M70 80 L98 80 M76 88 L92 88', '#fde3c8', 2),
    fig(36, C.orange, 'laugh', { h: 0.9, hairStyle: 'long' }), reach(36, 0.9, -1, 14, 34), reach(36, 0.9, 1, 58, 34), core(36, 0.9, C.red),
    sparkleS(18, 30, 4), sparkleS(56, 28, 5), sparkleS(36, 14, 3.5), ground),
  /** förnimmelse: fingertips near a hot cup – tiny waves reach the fingers; a grey cold cup gives nothing. */
  'medv.förnimmelse': all(bg(), at(46, 64, 2, palm(0, 0, 1)), path('M60 92 L84 92 L82 108 C82 111 62 111 62 108 Z', C.white, C.ink, 1.6), path('M84 96 C90 96 90 104 83 104', 'none', C.ink, 1.6),
    line('M66 86 C64 80 70 78 66 72 M74 86 C72 80 78 78 74 72', C.red, 1.8), line('M58 70 C56 66 60 64 58 60 M52 66 C50 62 54 60 52 56', C.orange, 1.4), circle(46, 56, 14, 'rgba(239,138,60,0.18)', null),
    greyed(path('M96 40 L112 40 L111 52 C111 54 97 54 97 52 Z', C.white, C.ink, 1.4)), ground),
  /** perception: light from the sun enters the eye, and the head turns it into its own little picture of a sun. */
  'medv.perception': all(bg(DAY), sunS(18, 22, 8), line('M28 28 L44 46 M24 34 L40 52', GOLD, 1.6, '3 3'), eye(50, 54, 0.9),
    head(84, 66, 1.4), arrow(60, 54, 74, 54, HL, 2), think(92, 22, 18, 13, all(sunS(92, 22, 4), gear(104, 30, 3.4, GREY)), 90, 40), ground),
  /** inifrån: her pain glows inside her chest; the grey observer outside only sees the outline and wonders. */
  'medv.inifrån': all(bg(), fig(36, C.green, 'frown', { h: 0.92, hairStyle: 'long' }), on(36, 0.92, circle(0, -24, 13, 'rgba(214,69,69,0.25)', null), star(0, -24, 7, C.red)),
    greyed(fig(92, C.grey, 'smile', { h: 0.78 }), qm(92, 16, 16, GREY)), ground),
  /** inre värld: inside the head a whole little landscape – sun, tree, heart and stars; a grey head beside it is empty. */
  'medv.inre-värld': all(bg('#efe9f6'), head(56, 62, 2.1), ellipse(52, 46, 26, 22, '#dff1fb', null), sunS(40, 36, 4), tree(60, 64, 0.6), heart(44, 56, 0.5), star(68, 34, 3.4, C.yellow), star(58, 28, 2.4, C.yellow), path('M30 62 C40 56 50 62 74 58', 'none', GRASS, 2),
    greyed(head(102, 96, 0.55)), ground),
  /** medvetenhet: awake, her attention reaches out in rings to the world (bird, tree); the grey sleeper notices nothing. */
  'medv.medvetenhet': all(bg(DAY), fig(40, '#3f6fb5', 'smile', { h: 0.92 }), on(40, 0.92, circle(0, -56, 22, 'none', GOLD, 1.6), circle(0, -56, 34, 'none', GOLD, 1.2), circle(0, -56, 46, 'none', GOLD, 0.8)),
    tree(80, 112, 0.8), path('M86 26 q4 -4 8 0 q4 -4 8 0', 'none', C.ink, 1.6), greyed(fig(106, C.grey, 'sleepy', { h: 0.5 })), ground),
  /** självmedvetenhet: a child looks in the mirror and thinks of herself – she knows the picture is her. */
  'medv.självmedvetenhet': all(bg(), rect(70, 30, 34, 70, WOOD, 4, C.ink, 1.6), rect(74, 34, 26, 62, '#dff1fb', 2, null), at(87, 0, 1, g('scale(-1 1)', fig(0, C.orange, 'smile', { h: 0.62, hairStyle: 'long' }))),
    fig(40, C.orange, 'laugh', { h: 0.62, hairStyle: 'long' }), think(26, 26, 18, 13, all(circle(26, 24, 6, C.skin, C.ink, 1), path('M20 22 C20 14 32 14 32 22', C.hair, null), rect(22, 30, 8, 4, C.orange, 1, null)), 38, 54), ground),

  // ── 2242 Själ och kropp ──
  /** leva vidare: a pale soul rises from a grey grave stone towards the light. */
  'medv.leva-vidare': all(bg(NIGHT), circle(60, 4, 40, 'rgba(255,244,194,0.25)', null), greyed(path('M40 112 L40 82 C40 70 80 70 80 82 L80 112 Z', STONE, C.ink, 1.6)), line('M46 112 L46 108 M74 112 L74 108', GRASS, 2),
    line('M60 70 C58 60 62 54 60 46', SOUL, 1.4, '3 3'), soul(60, 34, 1.1), arrow(84, 50, 84, 22, GOLD, 2), ground),
  /** materia: a stone, a block, water and air – all made of tiny particles. */
  'medv.materia': all(bg(), stoneR(30, 92, 1.5), rect(52, 72, 26, 26, '#d9a46a', 2, C.ink, 1.4), drop(96, 90, 1.6), ...[[86, 40], [96, 32], [104, 44], [92, 50]].map(([x, y]) => circle(x!, y!, 4, '#eaf6fd', C.ink, 1)),
    at(36, 34, 1, circle(0, 0, 16, C.white, C.ink, 1.4), ...[[-6, -5], [5, -6], [0, 2], [-7, 6], [7, 5]].map(([a, b]) => circle(a!, b!, 3.4, [C.red, SEA, GOLD, OK, C.purple][(a! + 10) % 5]!, C.ink, 0.8))), line('M44 46 L52 72', C.ink, 1, '2 2'), ground),
  /** immateriell: a hand passes right through the glowing light; the grey stone can be held. */
  'medv.immateriell': all(bg(NIGHT), soul(50, 50, 1.8), at(50, 56, 1.6, palm(0, 0, 1)), line('M30 56 L38 56 M62 56 L72 56', 'rgba(255,255,255,0.5)', 1.4, '2 3'),
    greyed(at(96, 92, 1.3, palm(0, -8, 1)), stoneR(96, 100, 0.9)), ground),
  /** psykisk: a dark storm cloud and tangled lines over her head – the trouble is in the mind; grey figure with an arm in a sling. */
  'medv.psykisk': all(bg(), fig(38, C.purple, 'frown', { h: 0.9, hairStyle: 'long' }), cloud(38, 18, 1.2, '#5a6070'), line('M30 28 l-2 6 M40 30 l-2 6', SEA, 1.6), line('M26 40 C30 34 36 44 42 36 C46 32 50 40 46 42', C.ink, 1.2),
    greyed(fig(92, C.grey, 'frown', { h: 0.74 }), path('M80 66 L104 78 L104 84 L80 72 Z', C.white, C.ink, 1.2)), ground),
  /** kroppslig: the body itself – muscles, heartbeat and a full plate; a grey thought cloud stands aside. */
  'medv.kroppslig': all(bg(), fig(44, C.red, 'smile', { h: 0.96, muscle: true }), on(44, 0.96, heart(-5, -30, 0.45)), line('M70 50 L76 50 L79 42 L83 58 L86 50 L94 50', C.red, 1.8),
    at(84, 92, 1, ellipse(0, 0, 14, 5, C.white, C.ink, 1.3), circle(-4, -2, 3, OK, null), circle(4, -2, 3, C.orange, null)), greyed(cloud(96, 24, 0.9, C.grey2)), ground),
  /** mental: inside the head, thinking, remembering and planning – gears, a picture and a calendar; a grey dumbbell aside. */
  'medv.mental': all(bg('#efe9f6'), head(50, 64, 2), gear(42, 48, 7, GOLD), frame(54, 38, 14, 11, all(house(61, 49, 0.35))), rect(36, 62, 14, 12, C.white, 1, C.ink, 1), line('M36 65 L50 65', C.red, 2), circle(40, 69, 0.9, C.ink, null), circle(44, 69, 0.9, C.ink, null),
    greyed(rect(88, 98, 22, 4, GREY, 2, C.ink, 1), rect(86, 92, 5, 16, GREY, 1, C.ink, 1), rect(107, 92, 5, 16, GREY, 1, C.ink, 1)), ground),
  /** hjärnverksamhet: sparks run through the brain, and the screen shows the waves of activity. */
  'medv.hjärnverksamhet': all(bg(), brain(46, 46, 1.7), ...[[34, 34], [54, 30], [62, 50], [38, 56]].map(([x, y]) => sparkleS(x!, y!, 4)), line('M32 40 L44 34 L56 42 L64 34', GOLD, 1.6),
    screen(74, 74, 36, 22, line('M76 86 L82 86 L84 78 L87 94 L90 82 L93 88 L96 76 L99 92 L102 84 L108 84', OK, 1.4), false), ground),
  /** dualism: two different kinds – a solid body block and a pale soul light, held apart with a gap. */
  'medv.dualism': all(bg('#efe9f6'), sage(22, 0.7), rect(42, 60, 26, 40, '#d9a46a', 3, C.ink, 1.6), line('M42 72 L68 72 M42 86 L68 86', 'rgba(0,0,0,0.2)', 1.2), soul(90, 50, 1.4),
    line('M74 80 L80 80 M74 72 L78 68', C.ink, 1, '2 2'), T(79, 92, '2', 14, HL), ground),
  /** monism: body and soul are one and the same – a single shape, half solid and half light. */
  'medv.monism': all(bg('#efe9f6'), circle(56, 58, 30, GLOW, null), path('M56 30 A28 28 0 0 0 56 86 Z', '#d9a46a', C.ink, 1.6), path('M56 30 A28 28 0 0 1 56 86 Z', SOUL, C.ink, 1.6), T(56, 102, '1', 14, HL),
    greyed(rect(92, 30, 12, 16, '#d9a46a', 2, C.ink, 1), circle(110, 38, 5, SOUL, C.ink, 1), cross(102, 58, 0.6)), ground),
  /** materialism: the brain is a machine of gears that produces the thought; the grey soul light is crossed out. */
  'medv.materialism': all(bg(), brain(44, 70, 1.5), gear(38, 66, 6, GOLD), gear(52, 72, 5, '#8a8f98'), think(70, 26, 22, 14, all(sunS(66, 26, 4), heart(78, 28, 0.4)), 50, 52),
    greyed(soul(98, 80, 0.8)), cross(106, 94, 0.7), ground),
  /** växelverkan: the body and the mind turn each other – arrows both ways in a circle. */
  'medv.växelverkan': all(bg(), rect(18, 50, 28, 34, '#d9a46a', 3, C.ink, 1.6), soul(90, 66, 1.2), path('M46 56 C60 32 76 36 86 48', 'none', HL, 2.4), path('M86 48 L84 40 L78 46 Z', HL, HL, 1),
    path('M84 84 C70 104 54 100 44 86', 'none', SEA, 2.4), path('M44 86 L46 94 L52 88 Z', SEA, SEA, 1), ground),

  // ── 2243 Personlig identitet ──
  /** minne: a thought holds a framed picture from long ago – the house and a child. */
  'medv.minne': all(bg(), fig(30, C.green, 'calm', { h: 0.9 }), chin(30, 0.9), think(80, 36, 30, 24, sepia(frame(64, 22, 32, 26, all(house(74, 46, 0.6), circle(88, 38, 3, C.skin, C.ink, 0.8), rect(86, 41, 4, 6, C.red, 1, null)))), 42, 34), ground),
  /** förändras: a small green shape turns step by step into a big gold star. */
  'medv.förändras': all(bg(), circle(20, 80, 8, OK, C.ink, 1.4), arrow(32, 80, 42, 80, HL, 2), path('M56 70 L64 84 L48 84 Z', SEA, C.ink, 1.4), arrow(68, 78, 78, 78, HL, 2), star(96, 74, 15, GOLD), ground),
  /** över tid: along a timeline with calendar pages, a seedling grows into a big tree. */
  'medv.över-tid': all(bg(), line('M10 100 L110 100', C.ink, 2), arrow(100, 100, 112, 100, HL, 2), tree(22, 98, 0.35), tree(52, 98, 0.65), tree(90, 98, 1.05),
    ...[18, 48, 86].map((x) => at(x, 108, 0.5, rect(-8, -6, 16, 12, C.white, 1, C.ink, 1.2), line('M-8 -2 L8 -2', C.red, 2))), clock(104, 18, 9, 2, 0)),
  /** personlig identitet: the child in the old photo and the grown woman are joined by one golden thread and the same glowing core. */
  'medv.personlig-identitet': all(bg(), sepia(frame(10, 22, 34, 44, at(0, -46, 1, fig(27, C.orange, 'smile', { h: 0.42, hairStyle: 'long' })))), at(0, -46, 1, core(27, 0.42)),
    fig(84, C.orange, 'smile', { h: 0.94, hairStyle: 'long' }), core(84, 0.94), line('M30 54 C50 40 64 70 84 68', GOLD, 2.4, '4 3'), ground),
  /** jag: in the middle of a grey crowd, one figure with a glowing core – "I myself". */
  'medv.jag': all(bg(), greyed(fig(16, C.grey, 'smile', { h: 0.7 }), fig(104, C.grey, 'smile', { h: 0.7 }), fig(34, C.grey, 'smile', { h: 0.56 }), fig(86, C.grey, 'smile', { h: 0.56 })),
    fig(60, '#3f6fb5', 'smile', { h: 0.96 }), on(60, 0.96, circle(0, -24, 18, GLOW, null), circle(0, -24, 7, GOLD, C.ink, 1.2)), rays(60, 15, 15, 20, 10, GOLD, 1.4), ground),
  /** identisk: two exactly alike twins with an equals sign; a grey pair that differs. */
  'medv.identisk': all(bg(), fig(26, C.green, 'smile', { h: 0.8 }), fig(70, C.green, 'smile', { h: 0.8 }), rect(42, 56, 12, 3, HL, 1, null), rect(42, 62, 12, 3, HL, 1, null),
    greyed(fig(96, C.grey, 'smile', { h: 0.46 }), fig(110, C.grey, 'smile', { h: 0.34, hairStyle: 'long' })), ground),
  /** psykologisk: inside the head – feelings, thoughts and memories; a grey bone outside stands for the body. */
  'medv.psykologisk': all(bg('#efe9f6'), head(54, 62, 2), heart(40, 56, 0.6), think(60, 38, 9, 7, gear(60, 38, 3.4, GOLD), 50, 50), sepia(frame(52, 54, 14, 11, house(59, 65, 0.32))),
    line('M42 60 L56 46 M44 60 L58 62', MIND, 1.4, '2 2'), greyed(at(98, 98, 1, rect(-10, -2, 20, 4, C.white, 2, C.ink, 1), circle(-10, -3, 3, C.white, C.ink, 1), circle(-10, 3, 3, C.white, C.ink, 1), circle(10, -3, 3, C.white, C.ink, 1), circle(10, 3, 3, C.white, C.ink, 1))), ground),
  /** känna igen sig: she reads a book and sees a girl just like herself on the page – and smiles. */
  'medv.känna-igen-sig': all(bg(), fig(30, C.orange, 'laugh', { h: 0.9, hairStyle: 'long' }), reach(30, 0.9, 1, 64, 68),
    at(80, 60, 1, path('M0 22 C-10 18 -22 18 -28 22 L-28 -16 C-22 -20 -10 -20 0 -16 Z', '#fbf5e4', C.ink, 1.2), path('M0 22 C10 18 22 18 28 22 L28 -16 C22 -20 10 -20 0 -16 Z', '#fbf5e4', C.ink, 1.2)),
    at(-18, -10, 1, fig(112, C.orange, 'smile', { h: 0.38, hairStyle: 'long' })), line('M64 50 L74 50 M64 56 L74 56 M64 62 L72 62', '#9a8f7a', 1), sparkleS(58, 30, 4), sparkleS(104, 30, 3.4), ground),

  // ── 2244 Fri vilja ──
  /** fri vilja: at a crossroads with three open paths, she chooses freely; the broken chain lies at her feet. */
  'medv.fri-vilja': all(bg(DAY), path('M50 112 L56 70 L64 70 L70 112 Z', '#e9dcc0', null), path('M56 70 L20 40 L28 36 L60 66 Z M64 70 L100 40 L92 36 L60 66 Z M58 70 L56 30 L64 30 L62 70 Z', '#e9dcc0', null),
    fig(60, C.orange, 'smile', { h: 0.72, hairStyle: 'long' }), check(22, 30, 0.7), check(60, 22, 0.7), check(98, 30, 0.7),
    ...[[28, 106], [36, 104]].map(([x, y]) => ellipse(x!, y!, 4, 2.6, 'none', GREY, 1.8)), line('M42 104 L46 100 M48 104 L44 108', GREY, 1.8), ground),
  /** slump: two dice tumble through the air – nobody decides how they land. */
  'medv.slump': all(bg('#e9f3e4'), dice(40, 44, 5, 1.8, -20), dice(78, 70, 3, 1.8, 25), line('M14 70 C24 60 26 52 22 44 M54 96 C60 90 62 86 60 80', GREY, 1.4, '3 3'), qm(96, 28, 18, HL), sparkleS(64, 30, 4), ground),
  /** determinism: a row of dominoes falls one after the other – each push decided by the one before. */
  'medv.determinism': all(bg(), domino(18, 70), domino(34, 62), domino(50, 48), domino(66, 30), domino(82, 0), domino(98, 0), arrow(18, 56, 60, 56, HL, 2.2), ground),
  /** förutbestämd: the train runs on rails that lead straight to one flag – there is no other way. */
  'medv.förutbestämd': all(bg(DAY), line('M8 100 L112 100 M8 108 L112 108', '#6b6f76', 2), ...Array.from({ length: 13 }, (_, i) => line(`M${12 + i * 8} 98 L${12 + i * 8} 110`, WOOD, 2.4)),
    at(34, 96, 1, rect(-16, -20, 32, 18, C.red, 3, C.ink, 1.4), rect(-10, -16, 8, 7, SCREEN, 1, C.ink, 1), rect(2, -16, 8, 7, SCREEN, 1, C.ink, 1), circle(-9, 0, 3.4, C.dark, C.ink, 1), circle(9, 0, 3.4, C.dark, C.ink, 1)),
    line('M102 98 L102 62', C.ink, 2), path('M102 62 L116 67 L102 72 Z', GOLD, C.ink, 1), line('M58 78 L96 78', HL, 1.6, '4 3')),
  /** styras av: a puppet on strings – a big hand above decides how it moves. */
  'medv.styras-av': all(bg(), at(60, 18, 2, palm(0, 0, 1)), rect(36, 30, 48, 4, WOOD, 1, C.ink, 1.2),
    line('M40 34 L42 66 M80 34 L78 66 M60 34 L60 46', C.ink, 0.9), fig(60, C.purple, 'frown', { h: 0.72 }), line('M50 112 L50 108 M70 112 L70 108', C.ink, 0.9), ground),
  /** arv och miljö: the child gets something from the DNA of the parents (left) and from home, school and nature around (right). */
  'medv.arv-och-miljö': all(bg(), helix(18, 30, 54), fig(60, C.yellow, 'smile', { h: 0.62 }), arrow(28, 58, 46, 70, HL, 2), house(96, 54, 1.1), tree(98, 98, 0.7), cbook(82, 92, 0.5, SEA), arrow(84, 70, 72, 76, SEA, 2),
    greyed(fig(8, C.grey, 'smile', { h: 0.4 }), fig(30, C.grey, 'smile', { h: 0.4, hairStyle: 'long' })), ground),
  /** illusion: in the hot desert he runs towards a lake and a palm tree that are only a mirage (dashed). */
  'medv.illusion': all(bg('#fbe7c0'), sunS(100, 18, 8), path('M4 96 C30 88 60 92 116 90 L116 112 L4 112 Z', '#e9c98a', null),
    fig(26, C.red, 'laugh', { h: 0.8 }), reach(26, 0.8, 1, 50, 64), ellipse(84, 78, 22, 6, 'rgba(90,167,214,0.4)', SEA, 1.4), line('M90 76 L90 50 M90 50 C82 44 78 48 74 50 M90 50 C98 44 102 48 106 50 M90 50 C86 42 84 40 80 40', OK, 1.6, '3 3'), qm(108, 66, 14, HL), ground),

  // ── 2245 Avsikt och handling ──
  /** handling: she acts – planting a tree with a spade (deliberate doing). */
  'medv.handling': all(bg(DAY), fig(40, C.green, 'smile', { h: 0.92, hairStyle: 'long' }), reach(40, 0.92, 1, 66, 72), line('M66 66 L76 106', WOOD, 3), path('M72 104 L82 102 L84 110 L74 112 Z', METAL, C.ink, 1.2),
    tree(98, 108, 0.6), path('M84 112 C90 106 106 106 112 112 Z', '#8a5a34', null), arrow(52, 28, 76, 28, HL, 2.4), ground),
  /** agera: the cup falls from the table – he jumps and catches it at once. */
  'medv.agera': all(bg(), rect(70, 70, 40, 5, C.tan, 1, C.ink, 1.4), line('M76 75 L76 112 M104 75 L104 112', C.brown, 3),
    fig(34, '#3f6fb5', 'shock', { h: 0.86 }), reach(34, 0.86, 1, 62, 92), path('M56 86 L68 86 L67 96 C67 98 57 98 57 96 Z', C.white, C.ink, 1.4), speed(8, 54, 3, 12), line('M66 66 C64 74 62 80 62 84', GREY, 1.2, '2 2'), T(80, 52, '!', 18, HL), ground),
  /** motiv: he gives flowers – and the thought behind it shows the reason: a heart. */
  'medv.motiv': all(bg(), fig(34, '#3f6fb5', 'blush', { h: 0.9 }), reach(34, 0.9, 1, 62, 70), at(68, 62, 1, line('M0 8 L-4 -6 M0 8 L2 -8 M0 8 L6 -4', OK, 1.4), circle(-4, -8, 3.4, C.red, C.ink, 0.8), circle(2, -10, 3.4, C.yellow, C.ink, 0.8), circle(6, -6, 3.4, C.pink, C.ink, 0.8)),
    think(30, 18, 14, 10, heart(30, 20, 0.6), 34, 34), fig(94, C.orange, 'laugh', { h: 0.86, hairStyle: 'long' }), ground),
  /** med flit: with a sly look she lets go of the glass on purpose, watching it fall. */
  'medv.med-flit': all(bg(), fig(40, C.purple, 'angry', { h: 0.94 }), reach(40, 0.94, 1, 70, 48), line('M70 48 L74 44', C.ink, 0.8),
    path('M72 62 L82 62 L81 72 C81 74 73 74 73 72 Z', 'rgba(220,240,252,0.7)', C.ink, 1.3), arrow(77, 78, 77, 96, HL, 2), line('M64 106 L70 102 L74 108 M80 104 L86 100 L90 108', SEA, 1.4), eye(56, 20, 0.6), line('M62 24 L74 56', C.ink, 0.8, '2 2'), ground),
  /** reflexmässig: hand jerks away from the hot stove at once – no thought in between (grey cloud crossed out). */
  'medv.reflexmässig': all(bg(), rect(54, 88, 58, 24, C.white, 2, C.ink, 1.6), ellipse(82, 88, 16, 4, C.dark, C.ink, 1.2), line('M72 82 C70 76 76 74 72 68 M84 82 C82 76 88 74 84 68 M96 82 C94 76 98 74 96 68', C.red, 1.6),
    fig(30, C.green, 'shock', { h: 0.9 }), reach(30, 0.9, 1, 54, 46), arrow(68, 70, 58, 52, HL, 2.2), line('M60 60 L66 54 M64 64 L70 58', C.orange, 1.6), greyed(cloud(30, 14, 0.7, C.grey2)), cross(42, 18, 0.55), ground),
  /** avstå från: offered cake, she raises her palm and says no thank you – she chooses not to take it. */
  'medv.avstå-från': all(bg(), fig(32, C.orange, 'calm', { h: 0.9, hairStyle: 'long' }), reach(32, 0.9, 1, 54, 56), at(56, 52, 1.1, palm(0, 0, 1)),
    fig(96, C.green, 'smile', { h: 0.86 }), reach(96, 0.86, -1, 76, 72), ellipse(74, 74, 12, 3, C.white, C.ink, 1.2), cake(74, 68, 1), ground),

  // ── 2246 Tid och självuppfattning ──
  /** självuppfattning: she paints a portrait of herself and adds what she thinks she is: a star, a heart, a book. */
  'medv.självuppfattning': all(bg(), fig(30, C.orange, 'calm', { h: 0.9, hairStyle: 'long' }), reach(30, 0.9, 1, 60, 60), line('M60 60 L66 52', WOOD, 2),
    line('M74 112 L84 38 M104 112 L94 38', WOOD, 2), rect(66, 26, 44, 52, C.white, 2, C.ink, 1.6), circle(88, 42, 7, C.skin, C.ink, 1), path('M80 40 C80 30 96 30 96 40 L97 50 L95 50 L94 42 C90 38 86 38 82 42 L81 50 L79 50 Z', C.hair, null), rect(80, 50, 16, 16, C.orange, 3, C.ink, 1),
    star(72, 32, 3.4, C.yellow), heart(104, 34, 0.35), cbook(104, 70, 0.3, ROBE), ground),
  /** barndom: a small child on a swing in the garden of the family house. */
  'medv.barndom': all(bg(DAY), house(98, 100, 1.2), line('M20 20 L20 112 M64 20 L64 112 M16 20 L68 20', WOOD, 3), line('M36 20 L34 76 M48 20 L50 76', C.ink, 1),
    rect(30, 76, 24, 4, WOOD, 1, C.ink, 1), at(-48, -42, 1, fig(90, C.yellow, 'laugh', { h: 0.42 })), sunS(96, 22, 7), ground),
  /** det förflutna: behind the walker the road fades into old, sepia scenes; the clock hand goes backwards. */
  'medv.det-förflutna': all(bg(), sepia(path('M4 70 L60 92 L60 112 L4 112 Z', '#e9dcc0', null), house(18, 76, 0.7), tree(40, 86, 0.5), fig(30, C.yellow, 'smile', { h: 0.3 })),
    path('M60 92 L116 82 L116 112 L60 112 Z', '#e9dcc0', null), fig(84, '#3f6fb5', 'calm', { h: 0.8 }), clock(30, 30, 14, 9, 45), path('M14 18 A18 18 0 0 1 30 12', 'none', HL, 2), path('M14 18 L13 11 L19 14 Z', HL, HL, 1)),
  /** tillbakablick: an old woman in an armchair looks back in her thoughts at herself as a girl. */
  'medv.tillbakablick': all(bg(), rect(10, 70, 46, 42, '#b06a4a', 6, C.ink, 1.6), fig(34, C.lilac, 'calm', { h: 0.82, hair: '#d8d8d8', hairStyle: 'long' }),
    think(84, 34, 28, 24, at(0, -64, 1, sepia(fig(84, C.orange, 'laugh', { h: 0.38, hairStyle: 'long' }))), 42, 40), ground),
  /** ögonblick: a splash frozen in mid-air with a stopwatch showing one tick. */
  'medv.ögonblick': all(bg(), at(40, 30, 1, circle(0, 4, 18, C.white, C.ink, 1.6), rect(-3, -18, 6, 5, C.ink, 1, null), line('M0 4 L0 -8', HL, 2.2), circle(0, 4, 1.6, C.ink, null)), rays(40, 34, 22, 27, 10, GOLD, 1.4),
    ellipse(80, 100, 26, 5, SEA, C.ink, 1.2), drop(80, 74, 1.4), ...[[66, 86], [94, 86], [72, 78], [88, 78]].map(([x, y]) => drop(x!, y!, 0.6)), ground),
  /** leva i nuet: she sits calmly in the sun with a cup; the clock of the past and the calendar of the future are grey. */
  'medv.leva-i-nuet': all(bg(DAY), sunS(60, 18, 7), rect(40, 86, 40, 6, WOOD, 2, C.ink, 1.4), fig(60, C.green, 'calm', { h: 0.86, hairStyle: 'long' }), reach(60, 0.86, 1, 70, 76),
    path('M68 70 L78 70 L77 80 C77 82 69 82 69 80 Z', C.white, C.ink, 1.2), line('M72 66 C70 62 74 60 72 56', GREY, 1),
    greyed(clock(18, 40, 10, 3, 0), at(102, 40, 1, rect(-10, -10, 20, 20, C.white, 1, C.ink, 1.2), line('M-10 -5 L10 -5', C.red, 2.4))), ground),
  /** tidsupplevelse: for the bored man the clock stretches long; for the laughing woman time flies (small fast clock). */
  'medv.tidsupplevelse': all(bg(), fig(28, C.grey, 'sleepy', { h: 0.84 }), ellipse(28, 18, 13, 18, C.white, C.ink, 1.6), line('M28 18 L28 6 M28 18 L34 24', C.ink, 1.6),
    fig(90, C.orange, 'laugh', { h: 0.84, hairStyle: 'long' }), clock(90, 18, 8, 4, 50), speed(100, 12, 3, 10, HL), line('M58 10 L58 110', C.grey2, 1.4, '3 3'), ground),
  /** blicka framåt: on the hill she looks towards the sunrise on the horizon. */
  'medv.blicka-framåt': all(bg('#fde3c8'), circle(104, 80, 14, '#f59f5a', null), rays(104, 80, 17, 24, 8, GOLD, 1.4), path('M4 112 L4 90 C24 80 40 82 56 90 L116 92 L116 112 Z', GRASS, C.ink, 1.2),
    fig(32, '#3f6fb5', 'smile', { h: 0.72 }), arrow(46, 50, 84, 62, HL, 2.2)),
  /** mogna (människa): from a restless child to a calm, wiser adult with a book and a lit bulb. */
  'medv.mogna.2': all(bg(), fig(16, C.yellow, 'angry', { h: 0.44 }), arrow(26, 92, 36, 92, HL, 1.6), fig(50, C.green, 'smile', { h: 0.66 }), arrow(62, 88, 72, 88, HL, 1.6),
    fig(92, '#3f6fb5', 'calm', { h: 0.94 }), cbook(98, 82, 0.5, ROBE), bulb(92, 14, 0.8), ground),

  // ── 2247 Artificiellt medvetande ──
  /** datorprogram: a screen full of indented, coloured lines of code. */
  'medv.datorprogram': all(bg(), screen(20, 20, 80, 56, code(28, 28, 7, 60)), ground),
  /** programmera: he types on a laptop and lines of code appear on the screen. */
  'medv.programmera': all(bg(), rect(50, 86, 66, 5, C.tan, 1, C.ink, 1.4), fig(28, '#3f6fb5', 'calm', { h: 0.86 }), reach(28, 0.86, 1, 64, 82),
    path('M60 86 L104 86 L100 82 L64 82 Z', C.dark, C.ink, 1.2), rect(66, 48, 36, 34, C.dark, 3, C.ink, 1.4), rect(69, 51, 30, 28, SCREEN, 1, null), code(71, 54, 4, 26), ground),
  /** beräkning: numbers go into the computer chip and a result comes out. */
  'medv.beräkning': all(bg(), T(26, 36, '2', 14, C.navy), T(26, 60, '3', 14, C.navy), T(26, 84, '5', 14, C.navy), arrow(36, 54, 46, 54, HL, 2), chip(64, 54, 1.2), arrow(84, 54, 94, 54, HL, 2), T(104, 60, '30', 14, OK), gear(64, 92, 6, GOLD), ground),
  /** artificiell: a flower built from metal parts with a plug; the grey real flower beside it. */
  'medv.artificiell': all(bg(), rect(28, 92, 30, 20, C.dark, 2, C.ink, 1.4), line('M43 92 L43 44', METAL, 3), rect(36, 60, 8, 4, METAL, 1, C.ink, 1),
    ...[0, 72, 144, 216, 288].map((a) => g(`translate(43 38) rotate(${a})`, path('M0 0 L6 -12 L-6 -12 Z', '#7fa8d6', C.ink, 1))), circle(43, 38, 5, METAL, C.ink, 1.2), path('M58 104 C70 104 70 96 80 96 M80 92 L86 92 L86 100 L80 100 Z', 'none', C.ink, 1.4),
    greyed(line('M100 112 L100 70', OK, 2.4), circle(100, 64, 7, C.pink, C.ink, 1), path('M100 90 C94 84 90 86 92 90', OK, C.ink, 1)), ground),
  /** intelligent: she solves the puzzle at once – a bright bulb; the grey person is still puzzled. */
  'medv.intelligent': all(bg(), fig(36, C.orange, 'laugh', { h: 0.9, hairStyle: 'long' }), bulb(36, 14, 1.1), reach(36, 0.9, 1, 60, 80),
    at(70, 84, 1, rect(-12, -10, 12, 10, C.red, 1, C.ink, 1), rect(0, -10, 12, 10, SEA, 1, C.ink, 1), rect(-12, 0, 12, 10, GOLD, 1, C.ink, 1), rect(0, 0, 12, 10, OK, 1, C.ink, 1)), check(90, 64, 0.7),
    greyed(fig(102, C.grey, 'frown', { h: 0.62 }), qm(102, 46, 12, GREY)), ground),
  /** artificiell intelligens: a brain made of circuits on a computer chip. */
  'medv.artificiell-intelligens': all(bg(NIGHT), chip(60, 82, 1.3), brain(60, 40, 1.6, '#9fd3f2'), line('M40 38 L48 38 L52 32 M70 30 L76 36 L84 36 M50 48 L60 48 L64 44', '#2f6aa0', 1.4), ...[[48, 38], [76, 36], [60, 48]].map(([x, y]) => circle(x!, y!, 1.8, GOLD, null)),
    line('M60 58 L60 64', '#9fd3f2', 2)),
  /** robot (maskin): a robot works at the assembly line and puts a wheel on a car. */
  'medv.robot.2': all(bg(), robot(40, 112, 1.1), car(90, 98, 1, C.red), line('M64 72 L72 92', METAL, 4), circle(76, 98, 5, C.dark, C.ink, 1.2), rect(4, 106, 112, 6, '#6b6f76', 0, C.ink, 1), ground),
  /** maskininlärning: many cat pictures go into the computer; afterwards it recognises a new cat (check). */
  'medv.maskininlärning': all(bg(), ...[[14, 18], [30, 22], [14, 44], [30, 48], [14, 70], [30, 74]].map(([x, y]) => frame(x! - 6, y! - 6, 12, 12, cat(x!, y! + 5, 0.3), C.grey2)),
    arrow(42, 46, 52, 46, HL, 2), chip(68, 46, 1), arrow(84, 46, 92, 46, HL, 2), frame(94, 36, 18, 18, cat(103, 52, 0.42)), check(103, 72, 0.8), ground),
  /** språkmodell: a pile of books goes into the chip, and out comes a chat bubble with lines of text. */
  'medv.språkmodell': all(bg(), cbook(20, 90, 0.8, C.red), cbook(26, 70, 0.8, SEA), cbook(18, 50, 0.8, OK), arrow(34, 66, 46, 66, HL, 2), chip(62, 66, 1),
    rect(80, 24, 34, 24, C.white, 6, C.ink, 1.4), path('M86 48 L84 56 L94 48 Z', C.white, C.ink, 1.2), chatLines(85, 31, 24, 3), arrow(70, 50, 82, 44, HL, 1.8), ground),
  /** simulera: the storm rages only on the screen – the woman in front of it stays dry. */
  'medv.simulera': all(bg(), screen(40, 14, 70, 50, all(cloud(64, 30, 0.9, '#5a6070'), cloud(88, 26, 0.8, '#5a6070'), line('M54 42 l-3 8 M64 44 l-3 8 M74 42 l-3 8 M84 44 l-3 8 M94 42 l-3 8', SEA, 1.6), path('M86 34 L82 44 L86 44 L83 52', 'none', C.yellow, 1.6))),
    fig(22, C.orange, 'smile', { h: 0.82, hairStyle: 'long' }), sunS(20, 18, 5), ground),
  /** efterlikna: a robot face copies the smile of the woman next to it. */
  'medv.efterlikna': all(bg(), fig(28, C.orange, 'laugh', { h: 0.9, hairStyle: 'long' }), robot(88, 112, 1.1), path('M82 59 Q88 64 94 59', 'none', '#7fe3ff', 1.6),
    arrow(46, 30, 70, 30, HL, 2), arrow(70, 38, 46, 38, GREY, 1.4), ground),
  /** turingtest: a man chats on a screen; behind the wall are a human and a robot – which one answers? */
  'medv.turingtest': all(bg(), fig(20, '#3f6fb5', 'calm', { h: 0.8 }), qm(20, 18, 16, HL), screen(36, 50, 22, 18, chatLines(39, 54, 16, 3)), rect(66, 20, 6, 92, WOOD, 1, C.ink, 1.4),
    fig(88, C.green, 'smile', { h: 0.56 }), robot(106, 112, 0.66), line('M58 58 L66 58', C.ink, 1, '2 2'), ground),
  /** autonom: the car drives itself – nobody at the wheel, sensor waves in front. */
  'medv.autonom': all(bg(DAY), rect(4, 92, 112, 20, '#6b6f76', 0, null), line('M10 102 L26 102 M40 102 L56 102 M70 102 L86 102 M100 102 L112 102', C.white, 2),
    car(52, 92, 1.6, SEA), path('M86 66 C92 72 92 80 86 86 M92 62 C100 70 100 82 92 90 M98 58 C108 68 108 84 98 94', 'none', OK, 1.6)),
  /** kännande: the dog feels joy and pain (heart and sore paw); the grey stone feels nothing. */
  'medv.kännande': all(bg(), dog(40, 100, 1.8), heart(44, 40, 0.8), star(64, 98, 4, C.red), line('M60 92 L56 88 M68 92 L72 88', C.red, 1.2), greyed(stoneR(98, 100, 1.3)), ground),
};

