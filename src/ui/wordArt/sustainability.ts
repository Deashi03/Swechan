/**
 * Natur & geografi → Ekologi & miljö → Hållbar resursanvändning, 2941–2947 (0.46): renewable resources, natural
 * resources and raw materials, water management, forestry, fisheries management, the circular economy and the
 * life-cycle perspective.
 * Recurring signs: the thing the word names is coloured and ringed in orange while the rest is pale or grey; an orange
 * arrow means "becomes" or "goes to"; a yellow lightning bolt is electricity; red-orange wavy lines are heat; blue
 * drops are water; a gauge or a bar shows "how much"; a stage chain (mine → factory → truck → use → bin) is a product's
 * life. Abstract words are small symbolic scenes where the coloured idea dominates and a grey copy stands beside it as
 * contrast. Digits only; no words, no brands, no logos of real organisations and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { type Build } from './figures';
import { HL, arm, bolt } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const PAPER = '#f6f2ea';
const SKY = '#d6ecf7';
const GRASS = '#9ccf72';
const GRASS2 = '#5f9e45';
const LEAF = '#5fa84a';
const PINE = '#3f8a4f';
const TRUNK = '#8a6244';
const WOOD = '#c8955c';
const WOOD2 = '#9a6a3a';
const SOIL = '#a7794e';
const ROCK = '#9a948c';
const ROCK2 = '#7a746c';
const WATER = '#9fd0ec';
const WATER2 = '#4f93c8';
const SEA = '#6fb0dc';
const YEL = '#f6d03c';
const GOLD = '#e6a817';
const RED = '#d93a3a';
const WHITE = '#fbfbf8';
const GREY = '#c4c8cc';
const STEEL = '#b8c2cc';
const COPPER = '#c8743a';
const COPPER2 = '#9a4f22';
const FISH = '#8fa6b8';
const MACH = '#f0b429';
const SMOKE = '#8a8f96';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const flipAt = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${-s} ${s})`, ...k);
const rot = (x: number, y: number, r: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${r}) scale(${s})`, ...k);
const rng = (seed: number) => { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; };
const bg = (col: string = PAPER) => rect(4, 4, 112, 108, col, 3, null);
const ground = (y = 112, col: string = C.grey2) => line(`M4 ${y} L116 ${y}`, col, 2);
const meadow = (y = 92) => all(bg(SKY), rect(4, y, 112, 112 - y, GRASS, 0, null), line(`M4 ${y} L116 ${y}`, GRASS2, 1.4));
const ring = (x: number, y: number, rx: number, ry = rx) => ellipse(x, y, rx, ry, 'none', HL, 2.6);
const box = (x: number, y: number, w: number, h: number) => rect(x, y, w, h, 'none', 3, HL, 2.6);
const panel = (x: number, y: number, w: number, h: number, fill: string = WHITE) => rect(x, y, w, h, fill, 3, C.ink, 1.4);
const check = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 8, WHITE, C.green, 2), line('M-4 0 L-1 3.5 L4.5 -3.5', C.green, 2.4));
const cross = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 8, WHITE, RED, 2), line('M-3.5 -3.5 L3.5 3.5 M3.5 -3.5 L-3.5 3.5', RED, 2.4));
const noSign = (x: number, y: number, r: number, inner: Svg) => all(circle(x, y, r, WHITE, null), inner, circle(x, y, r, 'none', RED, r * 0.16), line(`M${f1(x - r * 0.7)} ${f1(y - r * 0.7)} L${f1(x + r * 0.7)} ${f1(y + r * 0.7)}`, RED, r * 0.16));
const sunAt = (x: number, y: number, r = 7) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 5))} ${f1(y + Math.sin(a) * (r + 5))}`, GOLD, 1.6); }), circle(x, y, r, YEL, GOLD, 1.4));
const cloud = (x: number, y: number, s = 1, fill: string = WHITE) => at(x, y, s, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', fill, C.ink, 1.3));
const drop = (x: number, y: number, s = 1, col: string = WATER2) => path(`M${x} ${f1(y - 5 * s)} C${f1(x + 4 * s)} ${y} ${f1(x + 3 * s)} ${f1(y + 4 * s)} ${x} ${f1(y + 4 * s)} C${f1(x - 3 * s)} ${f1(y + 4 * s)} ${f1(x - 4 * s)} ${y} ${x} ${f1(y - 5 * s)} Z`, col, C.ink, 0.8);
const heat = (x: number, y: number, s = 1, col: string = '#e8603a') => at(x, y, s, path('M-5 0 C-8 -4 -2 -6 -5 -10 C-8 -14 -2 -16 -5 -20 M3 0 C0 -4 6 -6 3 -10 C0 -14 6 -16 3 -20', 'none', col, 1.8));
const flame = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 C-9 0 -10 -10 -4 -16 C-4 -10 0 -10 0 -14 C2 -20 8 -22 6 -28 C14 -20 12 -8 9 -4 C8 -1 4 0 0 0 Z', '#f08a2c', C.ink, 1), path('M1 -1 C-4 -1 -5 -7 -1 -10 C0 -6 3 -7 3 -10 C6 -7 6 -2 1 -1 Z', YEL, null));
const coin = (x: number, y: number, r = 5) => all(circle(x, y, r, C.gold, C.ink, 1.2), circle(x, y, r * 0.55, 'none', '#b88a20', 1));

// ── Nature ───────────────────────────────────────────────────────────
const tree = (x: number, y: number, s = 1, col: string = LEAF) => at(x, y, s, path('M-3 0 L-2.4 -22 L2.4 -22 L3 0 Z', TRUNK, C.ink, 1.2), circle(0, -30, 12, col, C.ink, 1.2), circle(-8, -24, 8, col, C.ink, 1.2), circle(8, -24, 8, col, C.ink, 1.2), circle(0, -24, 8, col, null));
const spruce = (x: number, y: number, s = 1, col: string = PINE) => at(x, y, s, rect(-1.6, -6, 3.2, 6, TRUNK, 0, C.ink, 1), path('M0 -40 L-7 -28 L-4 -28 L-10 -17 L-6 -17 L-12 -6 L12 -6 L6 -17 L10 -17 L4 -28 L7 -28 Z', col, C.ink, 1.2));
const stump = (x: number, y: number, s = 1) => at(x, y, s, path('M-5 0 L-4 -6 L4 -6 L5 0 Z', TRUNK, C.ink, 1), ellipse(0, -6, 4, 1.6, '#e8c890', C.ink, 0.9));
const seedling = (x: number, y: number, s = 1) => at(x, y, s, line('M0 0 L0 -9', GRASS2, 1.6), path('M0 -14 L-4 -8 L4 -8 Z M0 -10 L-5 -3 L5 -3 Z', PINE, C.ink, 0.8));
/** A log seen from the side, lying along x from x to x+len, radius r. */
const log = (x: number, y: number, len: number, r: number, col: string = WOOD) => all(rect(x, y - r, len, 2 * r, col, r * 0.4, C.ink, 1), ellipse(x + len, y, r * 0.55, r, '#e8c890', C.ink, 1), ellipse(x + len, y, r * 0.25, r * 0.45, 'none', WOOD2, 0.6));
const logEnd = (x: number, y: number, r: number) => all(circle(x, y, r, '#e8c890', C.ink, 1), circle(x, y, r * 0.5, 'none', WOOD2, 0.7));
const fish = (x: number, y: number, s = 1, col: string = FISH, flip = false) => (flip ? flipAt : at)(x, y, s, path('M-12 0 L-18 -6 L-18 6 Z', col, C.ink, 1.1), ellipse(0, 0, 12, 5.6, col, C.ink, 1.2), circle(7, -1.4, 1, C.ink, null), path('M3 -4 C4 -1 4 1 3 4', 'none', C.ink, 0.8));
const waves = (y: number, x1 = 4, x2 = 116, col: string = WATER2) => line(range(Math.ceil((x2 - x1) / 12)).map((i) => `M${x1 + i * 12} ${y} q3 -2.4 6 0 q3 2.4 6 0`).join(' '), col, 1);
const sea = (y: number, col: string = SEA) => all(rect(4, y, 112, 112 - y, col, 0, null), waves(y));

// ── Things ───────────────────────────────────────────────────────────
const house = (x: number, y: number, s = 1, wall: string = '#e8c8a0', roof: string = '#b8503a') => at(x, y, s, rect(-14, -18, 28, 18, wall, 1, C.ink, 1.3), path('M-17 -18 L0 -32 L17 -18 Z', roof, C.ink, 1.3), rect(-4, -10, 8, 10, '#8a5a3a', 1, C.ink, 1), rect(-11, -14, 6, 5, '#cfe6f4', 0.6, C.ink, 0.8), rect(5, -14, 6, 5, '#cfe6f4', 0.6, C.ink, 0.8));
const factory = (x: number, y: number, s = 1, col: string = '#c9b8a4', smoke = true) => at(x, y, s, rect(-20, -18, 40, 18, col, 1, C.ink, 1.3), path('M-20 -18 L-20 -26 L-10 -18 L-10 -26 L0 -18 L0 -26 L10 -18 Z', col, C.ink, 1.2), rect(12, -40, 6, 22, '#a89482', 0.6, C.ink, 1.1), ...[-15, -5, 5].map((xx) => rect(xx, -12, 6, 5, '#f0d880', 0.6, C.ink, 0.7)), smoke ? all(circle(16, -46, 3.4, '#d8dadc', C.ink, 0.6), circle(20, -51, 4, '#d8dadc', C.ink, 0.6)) : '');
const truck = (x: number, y: number, s = 1, col: string = '#4f8ac8', load: Svg = '') => at(x, y, s, rect(-22, -16, 30, 12, col, 1, C.ink, 1.2), load, path('M8 -14 L16 -14 L21 -8 L21 -4 L8 -4 Z', col, C.ink, 1.2), rect(11, -12, 5, 4, '#cfe6f4', 0.5, C.ink, 0.6), circle(-15, -3, 3.4, C.dark, C.ink, 1), circle(-6, -3, 3.4, C.dark, C.ink, 1), circle(14, -3, 3.4, C.dark, C.ink, 1));
const bin = (x: number, y: number, s = 1, col: string = '#6a7a8a') => at(x, y, s, path('M-8 -16 L8 -16 L6.5 0 L-6.5 0 Z', col, C.ink, 1.2), rect(-9.5, -19, 19, 3.4, col, 1, C.ink, 1.1), line('M-3 -12 L-2.6 -4 M3 -12 L2.6 -4', C.ink, 0.8));
const phoneIcon = (x: number, y: number, s = 1, scr: string = '#9fd0ec') => at(x, y, s, rect(-6, -11, 12, 22, C.dark, 2.4, C.ink, 1), rect(-4.6, -8.6, 9.2, 15.6, scr, 0.8, null), circle(0, 8.8, 0.9, '#888', null));
const mineHead = (x: number, y: number, s = 1) => at(x, y, s, path('M-10 0 L-4 -30 L4 -30 L10 0', 'none', C.dark, 2), line('M-7 -12 L7 -12 M-5.5 -22 L5.5 -22 M-7 -12 L5.5 -22 M7 -12 L-5.5 -22', C.dark, 1), circle(0, -32, 4, 'none', C.dark, 1.6));
const oreChunk = (x: number, y: number, s = 1, col: string = ROCK, fleck: string = '#5a6a7a') => at(x, y, s, path('M-9 4 L-10 -2 L-5 -8 L3 -9 L9 -4 L10 3 L4 7 L-5 7 Z', col, C.ink, 1.1), circle(-3, -2, 1.4, fleck, null), circle(3, 1, 1.2, fleck, null), circle(5, -5, 1, fleck, null));
const gauge = (x: number, y: number, r: number, v: number, col: string = HL) => { const a = Math.PI * (1 - v); return all(path(`M${x - r} ${y} A${r} ${r} 0 0 1 ${x + r} ${y} Z`, WHITE, C.ink, 1.3), path(`M${x - r * 0.82} ${y} A${r * 0.82} ${r * 0.82} 0 0 1 ${f1(x - r * 0.82 * Math.cos(Math.PI * 0.33))} ${f1(y - r * 0.82 * Math.sin(Math.PI * 0.33))}`, 'none', '#7cc576', 3), path(`M${f1(x + r * 0.82 * Math.cos(Math.PI * 0.33))} ${f1(y - r * 0.82 * Math.sin(Math.PI * 0.33))} A${r * 0.82} ${r * 0.82} 0 0 1 ${x + r * 0.82} ${y}`, 'none', RED, 3), line(`M${x} ${y} L${f1(x + Math.cos(a) * r * 0.7)} ${f1(y - Math.sin(a) * r * 0.7)}`, col === HL ? C.ink : col, 2), circle(x, y, 2, C.ink, null)); };
const recycle = (x: number, y: number, r: number, col: string = '#3f9a5a') => all(...range(3).map((i) => { const a0 = (i * 120 - 80) * Math.PI / 180, a1 = (i * 120 + 10) * Math.PI / 180; const p0 = [x + Math.cos(a0) * r, y + Math.sin(a0) * r], p1 = [x + Math.cos(a1) * r, y + Math.sin(a1) * r]; return arrow(f1(p0[0]!), f1(p0[1]!), f1(p1[0]!), f1(p1[1]!), col, f1(r * 0.28)); }));
const jar = (x: number, y: number, s = 1, fill: string = 'none') => at(x, y, s, rect(-6, -16, 12, 3.4, '#8a8f96', 1, C.ink, 0.9), path('M-7 -12.6 L7 -12.6 L7 -1 C7 0.4 6 1 5 1 L-5 1 C-6 1 -7 0.4 -7 -1 Z', 'rgba(220,240,252,0.7)', C.ink, 1.1), fill !== 'none' ? path('M-6 -6 L6 -6 L6 -1 C6 0 5 0.2 5 0.2 L-5 0.2 C-6 0.2 -6 0 -6 -1 Z', fill, null) : '');
const chair = (x: number, y: number, s = 1, col: string = WOOD) => at(x, y, s, line('M-6 0 L-6 -10 M6 0 L6 -10 M-6 -10 L-6 -24', col, 2.4), rect(-8, -12, 16, 3, col, 1, C.ink, 0.8), line('M-6 -24 L-6 -10', C.ink, 0.4));
const shirt = (x: number, y: number, s = 1, col: string = '#e06a6a') => at(x, y, s, path('M-6 -10 L-14 -6 L-11 0 L-7 -2 L-7 10 L7 10 L7 -2 L11 0 L14 -6 L6 -10 C4 -7 -4 -7 -6 -10 Z', col, C.ink, 1.1));
const pants = (x: number, y: number, s = 1, col: string = '#4a72b0') => at(x, y, s, path('M-7 -10 L7 -10 L8 10 L2 10 L0 -2 L-2 10 L-8 10 Z', col, C.ink, 1.1));
const bag = (x: number, y: number, s = 1, col: string = '#4a72b0') => at(x, y, s, path('M-5 -8 C-5 -15 5 -15 5 -8', 'none', C.ink, 1.6), path('M-9 -8 L9 -8 L10 8 L-10 8 Z', col, C.ink, 1.2), line('M-9 -2 L9 -2', '#2e5590', 0.8), circle(-4, 2, 1, '#e8d080', null), circle(4, 2, 1, '#e8d080', null));
const crate = (x: number, y: number, s = 1, col: string = '#c99a5a') => at(x, y, s, rect(-12, -9, 24, 9, col, 1, C.ink, 1.1), line('M-12 -4.5 L12 -4.5', '#8a6236', 0.8));
const boat = (x: number, y: number, s = 1, col: string = '#c8503a') => at(x, y, s, path('M-24 -8 L24 -8 L18 4 L-18 4 Z', col, C.ink, 1.3), rect(-6, -18, 14, 10, WHITE, 1, C.ink, 1.1), rect(-3, -15, 4, 4, '#cfe6f4', 0.5, C.ink, 0.6), line('M14 -8 L14 -26 L22 -12', C.ink, 1.2));
/** Person standing, feet at y0. */
const geo = (x: number, h = 1, y0 = 112) => { const s = 0.84 * h, ty = y0 - 49 * s; return { s, ty, hy: ty - 56 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}, y0 = 112) =>
  y0 === 112 ? F({ x, top, mood, ...more }) : g(`translate(0 ${f1(y0 - 112)})`, F({ x, top, mood, ...more }));
/** Smaller standing figure (height factor h) with its feet at (x, y0). */
const mini = (x: number, y0: number, h: number, more: Partial<Build> & { mood?: Mood } = {}) => g(`translate(0 ${f1(y0 - 112)})`, F({ x, h, ...more }));
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number, y0 = 112) => { const q = geo(x, h, y0); return all(arm(f1(side < 0 ? q.sl : q.sr), f1(q.sy), tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };
const helmet = (x: number, h = 1, y0 = 112, col: string = '#f08a2c') => { const q = geo(x, h, y0); return all(path(`M${f1(x - 11 * q.s)} ${f1(q.hy - 2 * q.s)} C${f1(x - 11 * q.s)} ${f1(q.hy - 16 * q.s)} ${f1(x + 11 * q.s)} ${f1(q.hy - 16 * q.s)} ${f1(x + 11 * q.s)} ${f1(q.hy - 2 * q.s)} Z`, col, C.ink, 1.2), rect(f1(x - 13 * q.s), f1(q.hy - 3 * q.s), f1(26 * q.s), f1(2.4 * q.s), col, 0.6, C.ink, 0.8)); };
/** Small stage icons used in life-cycle chains (centred at x, y, about 18 px). */
const stMine = (x: number, y: number, col = true) => { const k = at(x, y, 0.7, mineHead(0, 10, 0.7), oreChunk(9, 6, 0.6)); return col ? k : greyed(k); };
const stFactory = (x: number, y: number, col = true) => { const k = factory(x, y + 9, 0.5); return col ? k : greyed(k); };
const stTruck = (x: number, y: number, col = true) => { const k = truck(x, y + 8, 0.6); return col ? k : greyed(k); };
const stUse = (x: number, y: number, col = true) => { const k = all(at(x, y, 1, phoneIcon(0, 0, 0.8)), bolt(x + 8, y - 6, 0.4)); return col ? k : greyed(k); };
const stBin = (x: number, y: number, col = true) => { const k = bin(x, y + 9, 0.7); return col ? k : greyed(k); };
const chain = (y: number, hl: number, cols: boolean[] = [true, true, true, true, true]) => {
  const xs = [14, 37, 60, 83, 106], f = [stMine, stFactory, stTruck, stUse, stBin];
  return all(...xs.slice(0, 4).map((x) => arrow(x + 9, y, x + 14, y, '#b0b4b8', 1.6)), ...xs.map((x, i) => f[i]!(x, y, cols[i]!)), hl >= 0 ? ring(xs[hl]!, y, 12, 13) : '');
};
const footprint = (x: number, y: number, s: number, fill: string, stroke: string = C.ink) => at(x, y, s, path('M0 -26 C10 -26 13 -14 11 -2 C10 8 8 18 0 22 C-8 18 -10 8 -10 -2 C-11 -14 -9 -26 0 -26 Z', fill, stroke, 1.4), ...[[-9, -34, 3.4], [-2, -37, 3], [5, -36, 2.8], [10, -32, 2.4], [13, -26, 2]].map(([a, b, r]) => circle(a!, b!, r!, fill, stroke, 1.2)));

// ── Motifs ───────────────────────────────────────────────────────────
export const SUSTAINABILITY_MOTIFS: Record<string, Svg> = {
  // ── 2941 Förnybara resurser ──
  /** outtömlig: on the left a pipe pours a steady blue stream into a tank that stays full to the brim, with a green full gauge and an orange endless-loop sign above, ringed in orange; on the right, grey, the same kind of tank has its tap open below and is almost empty, with a red stub on its gauge. */
  'hres.outtömlig': all(bg(), ground(), path('M8 20 L30 20 L30 28', 'none', C.dark, 4), line('M30 30 L30 52', WATER2, 3.4), line('M27 32 L27 50 M33 32 L33 50', WATER, 1), rect(12, 52, 36, 58, 'rgba(220,240,252,0.7)', 2, C.ink, 1.4), rect(13.4, 55, 33.2, 53.6, '#7fb0d8', 1, null), waves(56, 14, 46),
    rect(52, 56, 8, 52, WHITE, 2, C.ink, 1.1), rect(53.2, 57.4, 5.6, 49.2, '#7cc576', 1, null), path('M14 10 C14 2 24 2 28 10 C32 18 42 18 42 10 C42 2 32 2 28 10 C24 18 14 18 14 10 Z', 'none', HL, 2.6), ring(36, 76, 30, 40),
    greyed(rect(74, 52, 30, 50, 'rgba(220,240,252,0.7)', 2, C.ink, 1.3), rect(75.4, 94, 27.2, 6.6, '#7fb0d8', 1, null), path('M89 102 L89 106 L96 106', 'none', C.dark, 3), drop(98, 110, 0.6), rect(108, 52, 6, 50, WHITE, 2, C.ink, 1)), rect(109, 96, 4, 5, RED, 0.6, null)),
  /** ta slut: a person turns an empty bottle upside down and shakes it hard over an empty glass; shake lines fly out around the bottle, but nothing comes out – only a dashed outline of a drop crossed out in red; the empty bottle is ringed in orange. */
  'hres.ta-slut': all(bg(), ground(), fig(30, C.green, 'frown'), reach(30, 1, 1, 66, 40), reach(30, 1, -1, 64, 50), rot(74, 40, 160, 1, rect(-7, -16, 14, 24, 'rgba(220,240,252,0.7)', 3, C.ink, 1.3), rect(-3, -22, 6, 6, 'rgba(220,240,252,0.7)', 1, C.ink, 1.1)),
    path('M58 26 l-6 -4 M58 34 l-8 0 M90 28 l6 -4 M92 38 l8 0 M88 50 l6 4', 'none', C.ink, 1.4), path('M80 64 C83 68 83 71 80 72 C77 71 77 68 80 64 Z', 'none', C.ink, 1, ), line('M74 64 L86 74 M86 64 L74 74', RED, 2), path('M68 84 L92 84 L89 110 L71 110 Z', 'rgba(220,240,252,0.7)', C.ink, 1.3), ring(76, 40, 18, 22)),
  /** solcell: a house roof with a dark-blue solar panel made of many small squares; one single square is shown enlarged in an orange ring, with the sun's ray going in and a yellow lightning bolt coming out. */
  'hres.solcell': all(bg(SKY), sunAt(18, 18, 8), house(36, 108, 1.7, '#e8d4b4', '#9a5a44'), rot(36, 62, -40, 1, rect(-14, -7, 28, 14, '#2f5a9a', 1, C.ink, 1.1), line('M-7 -7 L-7 7 M0 -7 L0 7 M7 -7 L7 7 M-14 0 L14 0', '#8cb8e8', 0.7)), line('M42 58 L74 50', HL, 1.2, '2 2'),
    circle(88, 52, 22, WHITE, C.ink, 1.4), rect(76, 40, 24, 24, '#2f5a9a', 1, C.ink, 1.3), line('M76 48 L100 48 M76 56 L100 56 M84 40 L84 64 M92 40 L92 64', '#8cb8e8', 0.6), line('M70 18 L80 38', GOLD, 2), bolt(104, 78, 0.8), ring(88, 52, 24)),
  /** vindkraftverk: a tall white tower with three long blades turning in the wind on a green plain, ringed in orange; small grey houses far below show how tall it is, and curved lines show the wind. */
  'hres.vindkraftverk': all(meadow(98), path('M57 98 L59 30 L61 30 L63 98 Z', WHITE, C.ink, 1.3), rect(56, 26, 12, 7, WHITE, 2, C.ink, 1.2), circle(60, 30, 2.6, GREY, C.ink, 1),
    rot(60, 30, 10, 1, path('M0 0 C2 -8 2 -22 0 -26 C-2 -22 -2 -8 0 0 Z', WHITE, C.ink, 1.1)), rot(60, 30, 130, 1, path('M0 0 C2 -8 2 -22 0 -26 C-2 -22 -2 -8 0 0 Z', WHITE, C.ink, 1.1)), rot(60, 30, 250, 1, path('M0 0 C2 -8 2 -22 0 -26 C-2 -22 -2 -8 0 0 Z', WHITE, C.ink, 1.1)),
    path('M8 22 C16 18 22 24 30 20 M10 34 C18 30 24 36 32 32', 'none', '#7aa8c8', 1.4), greyed(house(20, 98, 0.45), house(96, 98, 0.45), house(106, 98, 0.4)), ring(60, 56, 30, 48)),
  /** bioenergi: three small living sources on the left – a heap of wood chips, a heap of straw and manure, and green plants – each send an orange arrow into one big round sign on the right with a large yellow lightning bolt and red heat waves; the energy sign is ringed in orange. */
  'hres.bioenergi': all(bg(), panel(6, 10, 34, 28, '#f3ead8'), ...range(12).map((i) => { const R = rng(i + 31); return rect(f1(10 + R() * 24), f1(26 + R() * 8), 4.4, 2.6, i % 2 ? '#d8b078' : '#b88a50', 0.6, C.ink, 0.5); }), path('M12 34 C16 24 30 24 34 34 Z', 'none', C.ink, 0.4),
    panel(6, 46, 34, 28, '#f3ead8'), path('M10 70 C12 58 32 58 36 70 Z', '#8a6a3a', C.ink, 1.1), ...range(5).map((i) => line(`M${14 + i * 4} 62 l3 -6`, '#e8c860', 1.2)), panel(6, 82, 34, 28, '#f3ead8'), ...range(4).map((i) => all(line(`M${13 + i * 7} 106 L${13 + i * 7} 90`, GRASS2, 1.6), ellipse(13 + i * 7 - 3, 96, 3, 1.4, LEAF, C.ink, 0.6), ellipse(13 + i * 7 + 3, 92, 3, 1.4, LEAF, C.ink, 0.6))),
    arrow(42, 24, 58, 46, HL, 2.4), arrow(42, 60, 56, 60, HL, 2.4), arrow(42, 96, 58, 74, HL, 2.4), circle(86, 60, 26, '#fff3c8', C.ink, 1.6), at(82, 62, 1.9, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', YEL, C.ink, 0.9)), heat(100, 74, 0.7), ring(86, 60, 29)),
  /** biobränsle: a big heap of branches, tree tops and wood chips in an orange ring, and an orange arrow carrying it into the open door of a furnace with a bright fire. */
  'hres.biobränsle': all(bg(), ground(), ...range(30).map((i) => { const R = rng(i + 3); return rect(f1(10 + R() * 44), f1(88 + R() * 20 - (R() * 16 * (1 - Math.abs(R() - 0.5) * 2))), 5, 3, i % 3 ? '#d8b078' : '#b88a50', 0.6, C.ink, 0.5); }),
    ...range(6).map((i) => line(`M${14 + i * 7} ${96 - (i % 3) * 4} l8 -6 m-4 3 l1 -5`, TRUNK, 1.6)), ring(32, 98, 28, 16), arrow(62, 98, 74, 98, HL, 3), rect(76, 56, 34, 56, '#8a8f96', 2, C.ink, 1.4), rect(84, 82, 18, 18, '#3a3030', 2, C.ink, 1.2), flame(93, 98, 0.55), rect(86, 44, 8, 12, '#8a8f96', 0.6, C.ink, 1.1)),
  /** ved: a neat stack of split firewood logs seen from the end, ringed in orange; beside it an axe stuck in a chopping block. */
  'hres.ved': all(bg(), ground(), ...range(4).flatMap((r) => range(5 - (r % 2)).map((c) => path(`M${12 + c * 11 + (r % 2) * 5.5} ${108 - r * 10} l10 0 l-5 -9 Z`, '#e8c890', C.ink, 1))), ring(38, 92, 32, 22),
    rect(80, 98, 16, 14, WOOD2, 1, C.ink, 1.2), ellipse(88, 98, 8, 2.4, '#e8c890', C.ink, 1), rot(88, 96, -30, 1, line('M0 0 L0 -18', WOOD2, 2.2), path('M-1 -2 L-8 -6 L-8 2 Z', STEEL, C.ink, 0.9))),
  /** bergvärme: a cut through the ground – a house on top, grey bedrock below, and a long narrow hole going deep down with a blue pipe loop inside; red-orange heat arrows rise from the rock, through a heat-pump box at the house, and warm wavy lines leave the house. */
  'hres.bergvärme': all(rect(4, 4, 112, 40, SKY, 3, null), rect(4, 44, 112, 12, SOIL, 0, null), rect(4, 56, 112, 56, ROCK, 0, null), ...range(10).map((i) => { const R = rng(i + 7); return path(`M${f1(8 + R() * 100)} ${f1(62 + R() * 44)} l6 -2 l2 4 l-5 2 Z`, ROCK2, null); }), house(46, 44, 1.2), heat(46, 8, 0.5),
    rect(64, 30, 10, 14, WHITE, 1.4, C.ink, 1.1), circle(69, 37, 3, 'none', C.ink, 0.8), rect(66, 44, 6, 66, '#e4e4e4', 1, C.ink, 1), line('M67.6 44 L67.6 106 L70.4 106 L70.4 44', WATER2, 1.6), ...[96, 80, 64].map((y) => arrow(84, y, 76, y - 4, '#e8603a', 2)), ring(69, 76, 14, 40)),
  /** förbruka: a car drives along while a stream of fuel drops goes into its tank and grey exhaust comes out behind; above it a counter with digits counts the used amount up, with an orange up-arrow; the flow of fuel into the car is ringed in orange. */
  'hres.förbruka': all(bg(SKY), rect(4, 96, 112, 16, '#9a9a9a', 0, null), line('M8 104 L20 104 M34 104 L46 104 M60 104 L72 104 M86 104 L98 104', WHITE, 1.6), at(64, 94, 1.4, path('M-22 0 L-18 -10 C-16 -16 -10 -18 -4 -18 L8 -18 C14 -18 18 -12 22 -6 L22 0 Z', '#e06a4a', C.ink, 1.1), rect(-12, -15, 8, 6, '#cfe6f4', 0.6, C.ink, 0.6), rect(0, -15, 8, 6, '#cfe6f4', 0.6, C.ink, 0.6), circle(-12, 1, 4.4, C.dark, C.ink, 1), circle(12, 1, 4.4, C.dark, C.ink, 1)),
    ...range(4).map((i) => drop(70 + i * 6, 52 + i * 6, 0.8, '#c89a20')), path('M66 46 L72 46', 'none', C.dark, 3), ring(80, 64, 14, 16), ...[[20, 86, 5], [12, 80, 4], [6, 72, 3.4]].map(([x, y, r]) => circle(x!, y!, r!, SMOKE, null)),
    rect(30, 14, 48, 20, C.dark, 2, C.ink, 1.3), ...['3', '4', '7'].map((d, i) => all(rect(34 + i * 13, 17, 11, 14, WHITE, 1, null), `<text x="${39.5 + i * 13}" y="${28}" font-family="system-ui,sans-serif" font-weight="700" font-size="11" text-anchor="middle" fill="${C.ink}">${d}</text>`)), arrow(88, 32, 88, 12, HL, 2.6)),

  // ── 2942 Naturresurser och råvaror ──
  /** förädla: a rough grey lump of ore, an orange arrow into a factory, and an orange arrow out to shiny steel beams and a coil of sheet steel, which are ringed and have a small gold coin beside them to show they are worth more. */
  'hres.förädla': all(bg(), ground(), oreChunk(16, 92, 1.2), arrow(30, 92, 40, 92, HL, 2.4), factory(60, 108, 0.9), arrow(80, 92, 88, 92, HL, 2.4), rect(90, 96, 22, 5, STEEL, 0.6, C.ink, 1), rect(92, 90, 18, 5, STEEL, 0.6, C.ink, 1), circle(101, 78, 8, STEEL, C.ink, 1.2), circle(101, 78, 3, WHITE, C.ink, 0.9), sparkle(110, 70, 3, WHITE), coin(110, 62, 4.4), ring(101, 86, 14, 22)),
  /** koppar: a shiny reddish-brown coil of copper wire and a short copper pipe, ringed in orange; to the side a grey lump of ore with green-blue flecks shows where the metal comes from. */
  'hres.koppar': all(bg(), ground(), ...range(6).map((i) => ellipse(46 + i * 4, 80, 6, 22, 'none', COPPER2, 3.4)), ...range(6).map((i) => ellipse(46 + i * 4, 80, 6, 22, 'none', COPPER, 2)), line('M70 80 C80 80 84 96 96 98', COPPER, 2.4), rect(20, 98, 40, 8, COPPER, 3, C.ink, 1.2), ellipse(60, 102, 2, 4, COPPER2, C.ink, 1), sparkle(36, 100, 2, WHITE), sparkle(52, 64, 3, WHITE), ring(52, 86, 36, 28), greyed(oreChunk(100, 52, 1.1, ROCK, '#3aa08a'))),
  /** litium: a big rechargeable battery cut open, with light silver-white metal flakes glowing inside it, ringed in orange; it is plugged into a small electric car with a cable. */
  'hres.litium': all(bg(), ground(), rect(14, 40, 44, 64, '#4a5260', 4, C.ink, 1.4), rect(28, 34, 16, 6, '#4a5260', 1, C.ink, 1.2), rect(20, 48, 32, 50, '#e8ecf0', 2, C.ink, 1), ...range(6).map((i) => path(`M${24 + (i % 3) * 9} ${56 + Math.floor(i / 3) * 18} l6 -2 l2 6 l-5 3 l-4 -3 Z`, '#d8dee6', C.ink, 0.8)), sparkle(30, 86, 3, WHITE), sparkle(46, 60, 3, WHITE), ring(36, 72, 28, 40),
    path('M58 70 C70 70 70 96 78 96', 'none', C.ink, 1.6), path('M74 104 L76 94 C78 88 84 86 90 86 L102 86 C106 86 110 92 112 98 L112 104 Z', '#5cb8a8', C.ink, 1.2), circle(82, 106, 4, C.dark, C.ink, 1), circle(104, 106, 4, C.dark, C.ink, 1), bolt(94, 74, 0.5)),
  /** knapphet: a wide, dry canal with cracked brown mud; along the middle runs only one thin trickle of water, ringed in orange; a small grey picture in the corner shows the same canal full of water. */
  'hres.knapphet': all(bg(SKY), path('M4 52 L116 52 L104 112 L16 112 Z', '#c8a878', C.ink, 1.3), path('M14 56 L106 56 L96 108 L24 108 Z', '#d8b888', null), ...range(14).map((i) => { const R = rng(i + 41); const x = 26 + R() * 68, y = 62 + R() * 40; return line(`M${f1(x)} ${f1(y)} l${f1(R() * 8 - 4)} ${f1(R() * 6)} l${f1(R() * 8 - 4)} ${f1(R() * 6 - 3)}`, '#9a7a4a', 0.9); }),
    path('M58 56 C60 70 56 80 60 92 C62 100 58 104 60 108', 'none', WATER2, 2.4), ring(60, 82, 10, 28), rect(4, 4, 112, 48, SKY, 0, null),
    greyed(rect(78, 8, 34, 30, WHITE, 2, C.ink, 1), path('M80 16 L110 16 L106 36 L84 36 Z', '#c8a878', C.ink, 1), path('M82 18 L108 18 L105 34 L85 34 Z', '#7fb0d8', null)), sunAt(24, 24, 9)),
  /** skrot: a scrapyard heap of old metal – a rusty car body, bent pipes, cans and wheels – ringed in orange, with a crane magnet lifting a piece from the top. */
  'hres.skrot': all(bg(SKY), ground(), path('M8 112 C14 86 30 74 52 72 C74 70 94 84 110 112 Z', '#a89a8a', C.ink, 1.3), path('M30 92 L36 82 L62 80 L70 90 L72 98 L28 100 Z', '#b8643a', C.ink, 1.2), rect(42, 84, 8, 6, '#9fb8c8', 0.6, C.ink, 0.7), circle(36, 100, 5, C.dark, C.ink, 1), circle(66, 100, 5, C.dark, C.ink, 1),
    line('M78 92 L100 86 M80 100 L104 100', '#8a8f96', 3), ...[[20, 104], [88, 106], [56, 106]].map(([x, y]) => rect(x!, y!, 7, 6, '#c8b090', 1, C.ink, 0.8)), line('M84 6 L84 40', C.dark, 1.4), rect(76, 40, 16, 6, '#d93a3a', 1.6, C.ink, 1.1), line('M80 46 L78 56 L90 54', '#8a8f96', 2.4), ring(58, 88, 52, 26)),

  // ── 2943 Vattenhushållning ──
  /** grundvattennivå: a cut through the ground: grass on top, brown soil, then a blue water-filled layer; the top of the blue layer is a dashed orange line marked by an orange double arrow and a scale on the side, and a well pipe goes down into the water. */
  'hres.grundvattennivå': all(rect(4, 4, 112, 26, SKY, 3, null), rect(4, 30, 112, 8, GRASS, 0, null), rect(4, 38, 112, 74, SOIL, 0, null), rect(4, 70, 112, 42, '#7fb0d8', 0, null), ...range(24).map((i) => circle(8 + (i % 12) * 9, 76 + Math.floor(i / 12) * 14 + (i % 2) * 4, 1.6, '#c8a87a', null)), house(30, 30, 0.9),
    rect(70, 24, 8, 76, '#c4c8cc', 1, C.ink, 1.1), rect(72, 70, 4, 28, WATER2, 0.6, null), line('M4 70 L116 70', HL, 2.6, '5 3'), rect(96, 34, 10, 72, WHITE, 1, C.ink, 1), ...range(9).map((i) => line(`M96 ${38 + i * 8} l4 0`, C.ink, 0.8)), arrow(90, 50, 90, 68, HL, 2), arrow(90, 50, 90, 32, HL, 2)),
  /** vattenförbrukning: a kitchen tap, a shower head and a washing machine each send a blue stream into one big measuring jug in the middle, which is nearly full and ringed in orange; a water meter dial sits on the pipe. */
  'hres.vattenförbrukning': all(bg(), ground(), path('M12 30 L26 30 L26 36', 'none', C.dark, 3), line('M26 38 C28 50 40 60 46 66', WATER2, 2.4), circle(20, 18, 7, '#c4c8cc', C.ink, 1.2), path('M20 25 L20 30', 'none', C.dark, 3),
    line('M100 16 L100 26', C.dark, 3), path('M92 26 L108 26 L104 32 L96 32 Z', '#c4c8cc', C.ink, 1.1), line('M96 34 C92 50 82 58 76 66 M100 34 C98 50 86 60 78 68', WATER2, 1.6), rect(92, 82, 20, 30, WHITE, 2, C.ink, 1.2), circle(102, 98, 7, '#cfe6f4', C.ink, 1.1), line('M92 96 C86 90 82 82 76 76', WATER2, 2),
    path('M42 66 L80 66 L76 112 L46 112 Z', 'rgba(220,240,252,0.7)', C.ink, 1.4), path('M44 76 L78 76 L76 112 L46 112 Z', '#7fb0d8', null), ...range(4).map((i) => line(`M48 ${104 - i * 9} l6 0`, C.ink, 1)), ring(61, 89, 26, 28), circle(60, 22, 9, WHITE, C.ink, 1.2), line('M60 22 L65 17', RED, 1.6), line('M33 30 L51 30 M69 22 L92 22', C.dark, 2)),
  /** snålspolande: two shower heads side by side; the grey one on the left pours many thick streams, the coloured one on the right, ringed in orange, gives only a few thin streams, and a small drop gauge below it shows a low level with a green check. */
  'hres.snålspolande': all(bg(), greyed(line('M30 10 L30 24', C.dark, 3), path('M18 24 L42 24 L38 32 L22 32 Z', '#c4c8cc', C.ink, 1.2), ...range(7).map((i) => line(`M${21 + i * 3} 34 L${16 + i * 4.6} 96`, WATER2, 2.6)), rect(12, 98, 36, 10, WHITE, 1, C.ink, 1), rect(13, 99, 34, 8, '#7fb0d8', 0.6, null)),
    line('M88 10 L88 24', C.dark, 3), path('M76 24 L100 24 L96 32 L80 32 Z', '#c4c8cc', C.ink, 1.2), ...range(4).map((i) => line(`M${82 + i * 4} 34 L${80 + i * 5.4} 90`, WATER2, 1)), ring(88, 52, 20, 36), rect(70, 98, 36, 10, WHITE, 1, C.ink, 1), rect(71, 99, 8, 8, '#7fb0d8', 0.6, null), check(110, 96, 0.7)),
  /** regnvatten: a grey cloud with falling blue raindrops; the drops land in a clear glass on the ground, which is half full of rainwater and ringed in orange. */
  'hres.regnvatten': all(bg(SKY), rect(4, 100, 112, 12, GRASS, 0, null), cloud(60, 20, 2, '#b8c0c8'), ...range(12).map((i) => drop(28 + (i % 6) * 13, 46 + Math.floor(i / 6) * 20 + (i % 2) * 6, 0.9)), path('M44 64 L76 64 L72 102 L48 102 Z', 'rgba(220,240,252,0.7)', C.ink, 1.4), path('M46 82 L74 82 L72 102 L48 102 Z', '#7fb0d8', null), waves(82, 46, 70), ring(60, 84, 22, 24)),
  /** avsaltning: waves of salty sea water go through a pipe into a small plant building; out of it come a white heap of salt crystals on one side and, ringed in orange, a tap filling a glass with clean drinking water on the other. */
  'hres.avsaltning': all(bg(SKY), rect(4, 70, 40, 42, SEA, 0, null), waves(70, 4, 44), ...range(8).map((i) => rect(8 + (i % 4) * 8, 80 + Math.floor(i / 4) * 12, 2.4, 2.4, WHITE, 0.4, C.ink, 0.4)), line('M24 90 L44 90', C.dark, 3), rect(44, 60, 34, 36, '#c9d4dc', 2, C.ink, 1.3), path('M44 60 L61 48 L78 60 Z', '#9aa8b4', C.ink, 1.2), ...range(3).map((i) => circle(52 + i * 9, 74, 3, WATER, C.ink, 0.8)),
    path('M50 112 C52 100 60 98 64 98 C68 98 74 100 76 112 Z', WHITE, C.ink, 1.1), ...range(5).map((i) => rect(56 + i * 3, 104 - (i % 2) * 3, 2.4, 2.4, '#e8eef2', 0.4, C.ink, 0.5)), path('M78 72 L96 72 L96 78', 'none', C.dark, 3), drop(96, 84, 0.7), path('M88 90 L104 90 L101 110 L91 110 Z', 'rgba(220,240,252,0.7)', C.ink, 1.2), rect(91.6, 98, 9, 11.4, WATER, 0.6, null), ring(96, 92, 14, 22)),

  // ── 2944 Skogsbruk ──
  /** avverka: a forest where most trees have been cut down: many stumps, a pile of logs, and one tall spruce falling over with curved motion lines; the cut area is ringed in orange while the standing forest behind is grey. */
  'hres.avverka': all(bg(SKY), rect(4, 92, 112, 20, '#c8b080', 0, null), greyed(...range(6).map((i) => spruce(10 + i * 20, 70, 0.9))), ...[[18, 104], [40, 98], [62, 106], [86, 100], [104, 108]].map(([x, y]) => stump(x!, y!, 1.2)), ...range(3).map((i) => log(12 + i * 3, 110 - i * 5, 30, 2.8)),
    rot(70, 96, 62, 1.1, spruce(0, 0, 1)), path('M64 54 C76 52 86 60 92 70 M60 62 C70 62 78 68 82 76', 'none', C.ink, 1.1), ring(62, 96, 56, 18)),
  /** skogsägare: a smiling woman stands in front of her own forest and holds up a paper map with a tree on it; the forest behind her is marked off with orange corner posts and an orange dashed border. */
  'hres.skogsägare': all(meadow(88), ...range(5).map((i) => spruce(50 + i * 14, 84 - (i % 2) * 4, 0.9)), line('M44 88 L44 40 L116 40', HL, 2.2, '5 3'), ...[[44, 88], [44, 40]].map(([x, y]) => rect(x! - 1.6, y! - 10, 3.2, 10, HL, 0.6, C.ink, 0.8)), fig(26, C.green, 'smile', { hairStyle: 'long' }),
    reach(26, 1, 1, 38, 62), rect(30, 44, 22, 18, WHITE, 1, C.ink, 1.2), line('M33 48 L48 48 L48 58 L33 58 Z', HL, 1, '2 1'), spruce(41, 58, 0.22)),
  /** motorsåg: a forest worker in an orange helmet holds an orange chainsaw against a tree trunk; sawdust flies, and the chainsaw is ringed in orange. */
  'hres.motorsåg': all(bg(), ground(), path('M88 112 L90 14 L104 14 L106 112 Z', TRUNK, C.ink, 1.4), path('M88 74 L96 70 L88 66 Z', '#e8c890', C.ink, 0.8), fig(40, '#f08a2c', 'calm', { bottom: '#3a5a3a' }), helmet(40), reach(40, 1, 1, 64, 74), reach(40, 1, -1, 62, 66),
    rect(56, 62, 18, 14, '#f08a2c', 2, C.ink, 1.2), path('M58 62 C58 54 70 54 70 62', 'none', C.ink, 1.8), path('M74 64 L92 66 C94 68 94 72 92 72 L74 74 Z', '#c4c8cc', C.ink, 1.1), ...range(6).map((i) => line(`M${76 + i * 3} 64.6 l1 -1.4`, C.ink, 0.6)), ...range(6).map((i) => circle(80 + i * 3, 80 + (i % 3) * 4, 1, '#e8c890', null)), ring(74, 68, 22, 14)),
  /** skördare: a big yellow forestry machine with six wheels and a long crane arm whose head grips a tree; the tree is being cut into logs that lie on the ground; the machine is ringed in orange. */
  'hres.skördare': all(bg(SKY), rect(4, 100, 112, 12, '#c8b080', 0, null), spruce(100, 100, 1.4), path('M10 92 L60 92 L60 80 L44 80 L40 66 L22 66 L18 80 L10 80 Z', MACH, C.ink, 1.3), rect(24, 69, 14, 10, '#cfe6f4', 1, C.ink, 1), ...[16, 30, 50].map((x) => circle(x, 98, 7, C.dark, C.ink, 1.2)),
    line('M50 80 L72 54 L90 74', '#d89a20', 4), line('M50 80 L72 54 L90 74', C.ink, 0.8), rect(86, 72, 12, 12, '#c0c6cc', 2, C.ink, 1.1), ...range(3).map((i) => log(60 + i * 2, 110 - i * 5, 24, 3)), ring(48, 80, 44, 28)),
  /** pappersbruk: a factory beside a lake with tall chimneys and white steam; logs go in on one side on a belt, and big rolls of white paper come out on the other; the factory is ringed in orange. */
  'hres.pappersbruk': all(bg(SKY), rect(4, 96, 112, 16, WATER, 0, null), waves(98), rect(36, 50, 52, 46, '#c9b8a4', 2, C.ink, 1.4), path('M36 50 L48 40 L60 50 L72 40 L84 50', 'none', C.ink, 1.2), rect(70, 18, 7, 32, '#a89482', 0.6, C.ink, 1.1), cloud(78, 12, 0.7, WHITE), ...[42, 54].map((x) => rect(x, 60, 8, 7, '#f0d880', 0.6, C.ink, 0.7)),
    line('M6 84 L36 84', C.dark, 2.4), ...range(3).map((i) => logEnd(10 + i * 9, 79, 3.6)), line('M88 88 L114 88', C.dark, 2.4), ...[96, 108].map((x) => all(rect(x - 5, 74, 10, 14, WHITE, 2, C.ink, 1), ellipse(x, 74, 5, 2, '#eee', C.ink, 0.9))), ring(62, 66, 32, 30)),
  /** massaved: a pile of thin, short logs at a forest road, ringed in orange, with an orange arrow to a big roll of white paper; beside the pile a few thick grey logs go another way, to a grey saw blade. */
  'hres.massaved': all(bg(), ground(), ...range(10).map((i) => logEnd(14 + (i % 4) * 9 + (Math.floor(i / 4) % 2) * 4.5, 106 - Math.floor(i / 4) * 8, 4)), ring(30, 96, 24, 18), arrow(56, 98, 72, 98, HL, 2.6), rect(76, 84, 18, 26, WHITE, 2, C.ink, 1.2), ellipse(85, 84, 9, 3, '#eee', C.ink, 1), path('M94 104 L112 108 L112 112 L94 110 Z', WHITE, C.ink, 1),
    greyed(...range(3).map((i) => logEnd(22 + i * 15, 40, 7)), line('M60 40 L76 40', C.ink, 1.6), circle(90, 40, 10, '#ddd', C.ink, 1.2), ...range(12).map((i) => { const a = i * Math.PI / 6; return line(`M${f1(90 + Math.cos(a) * 10)} ${f1(40 + Math.sin(a) * 10)} l${f1(Math.cos(a + 0.5) * 3)} ${f1(Math.sin(a + 0.5) * 3)}`, C.ink, 1); }))),
  /** gallring: two pictures of a young spruce forest; on the left, grey, the trees stand very close together; on the right, ringed in orange, some trees are gone (only stumps are left) and the sun reaches the bigger trees that remain. */
  'hres.gallring': all(bg(), greyed(rect(6, 20, 50, 88, SKY, 2, null), ...range(9).map((i) => spruce(12 + i * 5, 106 - (i % 2) * 3, 0.85))), rect(64, 20, 50, 88, SKY, 2, null), sunAt(104, 30, 6), ...[72, 89, 106].map((x) => spruce(x, 106, 1)), ...[80, 97].map((x) => stump(x, 106, 0.9)), line('M100 36 L90 60 M104 40 L104 64', GOLD, 1.2, '2 2'), arrow(56, 64, 64, 64, HL, 2.4), box(64, 20, 50, 88)),
  /** återplantera: on a cleared area with stumps, a kneeling person in work clothes puts a small spruce seedling into the ground; a straight row of new little seedlings stands in front, ringed in orange. */
  'hres.återplantera': all(bg(SKY), rect(4, 84, 112, 28, '#c8a878', 0, null), ...[[14, 92], [100, 90], [62, 88]].map(([x, y]) => stump(x!, y!, 1)), mini(40, 112, 0.8, { top: '#5a8a4a', mood: 'smile', bottom: '#4a4a3a' }), reach(40, 0.8, 1, 58, 96, 112), seedling(60, 100, 1),
    ...range(4).map((i) => seedling(72 + i * 11, 106, 0.9)), ring(82, 100, 30, 12)),
  /** hyggesfri: a coloured forest with trees of many sizes and ages and only one or two stumps, so the forest stays standing, ringed in orange with a green check; a small grey picture beside it shows a clear-cut with only stumps, and a red cross. */
  'hres.hyggesfri': all(bg(), rect(6, 30, 70, 78, SKY, 2, null), ...[[14, 1.1], [26, 0.6], [36, 1.3], [50, 0.8], [62, 1.2], [72, 0.5]].map(([x, s]) => spruce(x!, 106, s!)), tree(44, 106, 0.6), stump(30, 106, 0.8), box(6, 30, 70, 78), check(70, 22, 0.8),
    greyed(rect(82, 60, 32, 48, SKY, 2, null), ...[88, 96, 104, 110].map((x, i) => stump(x, 104 - (i % 2) * 4, 0.8))), cross(98, 52, 0.7)),

  // ── 2945 Fiskeförvaltning ──
  /** förvalta: two careful hands hold a round piece of sea with fish and a small island with a tree; an orange circular arrow goes around it, and a gold coin and a little clock beside it show that something valuable is looked after for a long time. */
  'hres.förvalta': all(bg(), circle(60, 58, 30, SEA, C.ink, 1.4), waves(50, 32, 88), ...[[48, 66], [70, 72], [58, 80]].map(([x, y], i) => fish(x!, y!, 0.6, FISH, i === 1)), ellipse(66, 46, 9, 4, '#c8b080', C.ink, 1), tree(66, 46, 0.4),
    path('M24 76 C24 98 44 106 60 104 C76 106 96 98 96 76 L88 74 C86 90 74 96 60 96 C46 96 34 90 32 74 Z', C.skin, C.ink, 1.3), path('M60 18 A40 40 0 1 1 22 46', 'none', HL, 2.4), path('M22 46 L18 38 L28 40 Z', HL, HL, 1), coin(102, 22, 6), circle(18, 20, 7, WHITE, C.ink, 1.2), line('M18 20 L18 15 M18 20 L22 22', C.ink, 1.2)),
  /** fångst: on a fishing boat, a fisherman holds up a big crate full of shiny cod; the full crate is ringed in orange. */
  'hres.fångst': all(bg(SKY), sea(92), path('M6 92 L114 92 L106 110 L14 110 Z', '#c8503a', C.ink, 1.3), fig(30, '#f0c030', 'laugh', { bottom: '#f0c030', h: 0.8 }, 92), reach(30, 0.8, 1, 54, 62, 92), reach(30, 0.8, -1, 54, 68, 92), crate(70, 70, 1.8), ...range(5).map((i) => fish(56 + i * 7, 54 - (i % 2) * 3, 0.5, '#a8a070', i % 2 === 0)), ring(70, 60, 26, 16)),
  /** fiskeförbud: a sea with fish swimming freely; in front, a big round sign shows a fishing rod and a hooked fish crossed out with a thick red line. */
  'hres.fiskeförbud': all(bg(SKY), sea(70), ...[[24, 92], [86, 96], [100, 80]].map(([x, y], i) => fish(x!, y!, 0.7, FISH, i === 1)), noSign(60, 46, 30, all(line('M42 30 L76 54', WOOD2, 2.4), line('M76 54 L76 62', C.ink, 0.8), fish(70, 66, 0.6)))),
  /** minimimått: a fish lies on a measuring board; an orange line on the board marks the smallest allowed length, and the fish's tail does not reach it, so an orange arrow shows the fish going back into the water. */
  'hres.minimimått': all(bg(), rect(4, 88, 112, 24, SEA, 0, null), waves(88), rect(10, 44, 100, 18, '#f0e0b0', 2, C.ink, 1.3), ...range(19).map((i) => line(`M${15 + i * 5} 44 l0 ${i % 2 ? 4 : 7}`, C.ink, 0.8)), fish(44, 53, 1.6, '#a8a070'), line('M86 38 L86 68', HL, 3), path('M82 38 L90 38', 'none', HL, 3), arrow(40, 70, 52, 92, HL, 2.6), fish(66, 100, 0.7, '#a8a070')),
  /** fredningstid: a calendar page where a block of months is coloured orange; beside it, under water, a fish lays a cluster of eggs, and a small round sign shows fishing crossed out in red. */
  'hres.fredningstid': all(bg(), rect(8, 14, 56, 60, WHITE, 2, C.ink, 1.4), rect(8, 14, 56, 10, '#7aa0c8', 2, C.ink, 1.2), ...range(12).map((i) => rect(12 + (i % 4) * 13, 28 + Math.floor(i / 4) * 14, 10, 10, i >= 3 && i <= 5 ? HL : '#e8e8e8', 1, C.ink, 0.8)), box(10, 40, 54, 26),
    rect(4, 78, 112, 34, SEA, 0, null), waves(78), fish(50, 94, 1, '#a8a070'), ...range(9).map((i) => circle(74 + (i % 3) * 4, 98 + Math.floor(i / 3) * 4, 1.8, '#f0b070', C.ink, 0.5)), noSign(94, 40, 16, all(line('M84 30 L102 44', WOOD2, 2), line('M102 44 L102 50', C.ink, 0.7)))),
  /** fritidsfiske: a relaxed person sits on a wooden jetty in the sun with a fishing rod, a small cooler and a thermos beside them; the line goes into a calm lake; the person is ringed in orange. */
  'hres.fritidsfiske': all(bg(SKY), sunAt(98, 18, 7), rect(4, 76, 112, 36, WATER, 0, null), waves(78), rect(4, 70, 60, 6, WOOD, 1, C.ink, 1.2), line('M14 76 L14 96 M50 76 L50 96', WOOD2, 3), mini(36, 70, 0.62, { top: '#5aa0c8', mood: 'calm' }), line('M44 50 L92 22', WOOD2, 2), line('M92 22 L96 90', C.ink, 0.6), circle(96, 90, 2, RED, C.ink, 0.6), reach(36, 0.62, 1, 46, 50, 70),
    rect(10, 62, 12, 8, '#e8e8e8', 1, C.ink, 1), rect(54, 58, 5, 12, '#c84a4a', 1.4, C.ink, 0.9), ring(36, 44, 15, 30)),
  /** fiskodling: in a calm bay, several round floating net pens are full of fish jumping; a small boat with a feeder is beside them; the pens are ringed in orange. */
  'hres.fiskodling': all(bg(SKY), path('M4 40 L30 28 L50 40 Z M80 40 L104 24 L116 34 L116 40 Z', '#7a9a6a', C.ink, 1), sea(40), ...[[36, 72], [80, 72]].map(([x, y]) => all(ellipse(x!, y!, 22, 8, 'rgba(255,255,255,0.25)', C.dark, 2), ...range(6).map((i) => line(`M${x! - 20 + i * 8} ${y! - 2} l0 18`, C.dark, 0.6)), ellipse(x!, y! + 16, 20, 6, 'none', C.dark, 0.7))),
    ...[[30, 68], [42, 74], [76, 68], [86, 74]].map(([x, y], i) => fish(x!, y!, 0.45, '#c8909a', i % 2 === 1)), rot(36, 60, -30, 1, fish(0, 0, 0.45, '#c8909a')), boat(60, 104, 0.6, '#5a8ac8'), ring(58, 74, 50, 16)),

  // ── 2946 Cirkulär ekonomi ──
  /** återanvända: the same glass jar three times: first full of red jam, then empty and clean with water drops, then full of pencils; orange arrows go from one to the next and back round to the start. */
  'hres.återanvända': all(bg(), jar(22, 66, 1.6, '#c8283c'), jar(60, 66, 1.6), drop(52, 36, 0.8), drop(68, 34, 0.8), jar(98, 66, 1.6), ...[[-8, '#e04a4a'], [-3, '#4a8ae0'], [2, '#f0c030'], [7, '#5cb85c']].map(([dx, col]) => all(line(`M${98 + (dx as number)} 50 L${98 + (dx as number)} 36`, col as string, 2.4), path(`M${97 + (dx as number)} 36 L${98 + (dx as number)} 32 L${99 + (dx as number)} 36 Z`, '#e8c890', null))),
    arrow(36, 56, 46, 56, HL, 2.4), arrow(74, 56, 84, 56, HL, 2.4), path('M98 82 C98 104 22 104 22 84', 'none', HL, 2.4), path('M22 84 L18 92 L28 90 Z', HL, HL, 1)),
  /** cirkulär ekonomi: a big orange circle of arrows joining five small pictures – a factory, a shopping bag, a person using the thing, a spanner for repair and green recycling arrows – back to the factory; below, a short grey straight line goes from a factory to a rubbish bin, with a red cross. */
  'hres.cirkulär-ekonomi': all(bg(), circle(60, 46, 32, 'none', HL, 2.6), ...[0, 72, 144, 216, 288].map((d) => { const a = (d - 90 + 34) * Math.PI / 180; const x = 60 + Math.cos(a) * 32, y = 46 + Math.sin(a) * 32; return path(`M${f1(x)} ${f1(y)} l${f1(Math.cos(a + 1.9) * 6)} ${f1(Math.sin(a + 1.9) * 6)} l${f1(Math.cos(a + Math.PI / 2 + 0.9) * -6)} ${f1(Math.sin(a + Math.PI / 2 + 0.9) * -6)} Z`, HL, HL, 1); }),
    factory(60, 22, 0.42), bag(91, 40, 0.8, C.green), at(80, 74, 0.7, phoneIcon(0, 0, 1)), rot(38, 74, 30, 1, path('M-2 -10 L2 -10 L2 6 C5 7 5 12 2 12 L-2 12 C-5 12 -5 7 -2 6 Z', STEEL, C.ink, 1)), recycle(28, 40, 7),
    greyed(factory(22, 108, 0.4), line('M36 102 L84 102', C.ink, 2), bin(96, 110, 0.7)), cross(60, 98, 0.6)),
  /** loppis: an outdoor flea market table with old things – a lamp, a vase, a stack of books, a teapot and a radio – with small price tags showing digits; two people look and one holds a coin; the table is ringed in orange. */
  'hres.loppis': all(bg(SKY), ground(), rect(14, 70, 84, 6, WOOD, 1, C.ink, 1.2), line('M18 76 L18 112 M94 76 L94 112', WOOD2, 3), rect(14, 76, 84, 12, '#e8a0a0', 0, C.ink, 0.8), path('M24 70 L32 70 L30 58 L26 58 Z', '#7a9ac8', C.ink, 1), path('M22 58 L34 58 L30 48 L26 48 Z', '#f0d880', C.ink, 1), ...range(3).map((i) => rect(42, 64 - i * 4, 16, 4, ['#c84a4a', '#4a8a5a', '#4a6ac8'][i]!, 0.6, C.ink, 0.8)),
    ellipse(70, 64, 7, 6, '#e8e8e8', C.ink, 1), path('M77 62 L82 58', 'none', C.ink, 1.4), rect(84, 60, 12, 10, '#a07a5a', 1, C.ink, 1), circle(88, 65, 2.4, '#ddd', C.ink, 0.6), ...[[30, 82, 5], [50, 82, 2], [72, 82, 8]].map(([x, y, n]) => all(rect(x! - 6, y! - 4, 12, 8, WHITE, 1, C.ink, 0.8), `<text x="${x}" y="${y! + 2.6}" font-family="system-ui,sans-serif" font-weight="700" font-size="7" text-anchor="middle" fill="${C.ink}">${n}</text>`)),
    ring(56, 72, 46, 22), greyed(mini(10, 112, 0.5, { top: C.orange })), mini(110, 112, 0.5, { top: C.purple, mood: 'smile' }), coin(100, 82, 3.4)),
  /** klädbyte: two friends stand at a table with piles of clothes; each holds out a piece of clothing to the other – a red shirt one way, blue trousers the other – and two orange arrows show the swap. */
  'hres.klädbyte': all(bg(), ground(), rect(30, 84, 60, 5, WOOD, 1, C.ink, 1.1), line('M34 89 L34 112 M86 89 L86 112', WOOD2, 3), ...range(3).map((i) => rect(38 + i * 2, 80 - i * 4, 18, 4, ['#e8c040', '#5cb85c', '#c8a0e0'][i]!, 1, C.ink, 0.8)), ...range(3).map((i) => rect(64 + i * 2, 80 - i * 4, 18, 4, ['#e06a6a', '#6aa0e0', '#f0a040'][i]!, 1, C.ink, 0.8)),
    fig(16, C.orange, 'smile', { hairStyle: 'long' }), fig(104, C.green, 'smile'), reach(16, 1, 1, 40, 52), reach(104, 1, -1, 80, 56), shirt(46, 50, 0.9, '#e06a6a'), pants(74, 54, 0.9, '#4a72b0'), arrow(48, 34, 72, 34, HL, 2.4), arrow(72, 72, 48, 72, HL, 2.4)),
  /** uppcykla: a pair of old worn-out jeans with holes, an orange arrow with a sparkle, and a smart new bag sewn from the same denim, ringed in orange. */
  'hres.uppcykla': all(bg(), ground(), greyed(pants(26, 70, 2.4, '#4a72b0')), ellipse(20, 86, 3, 2, PAPER, C.ink, 0.6), ellipse(32, 70, 2.4, 1.6, PAPER, C.ink, 0.6), arrow(50, 70, 66, 70, HL, 3), sparkle(58, 58, 4, GOLD), bag(90, 76, 2, '#4a72b0'), sparkle(106, 52, 3, GOLD), ring(90, 72, 24, 28)),
  /** delningsekonomi: one single car in the middle with four people around it joined to it by orange lines, each with a little clock showing they take turns; in a grey strip below, four people each stand next to their own car. */
  'hres.delningsekonomi': all(bg(), at(60, 52, 1, path('M-22 0 L-18 -10 C-16 -16 -10 -18 -4 -18 L8 -18 C14 -18 18 -12 22 -6 L22 0 Z', '#5cb8a8', C.ink, 1.3), circle(-12, 1, 4.4, C.dark, C.ink, 1), circle(12, 1, 4.4, C.dark, C.ink, 1)), ...[[16, 26], [104, 26], [16, 70], [104, 70]].map(([x, y], i) => all(line(`M${x! < 60 ? x! + 8 : x! - 8} ${y} L${x! < 60 ? 40 : 80} ${y! < 50 ? 40 : 52}`, HL, 1.6, '3 2'), mini(x!, y! + 14, 0.32, { top: [C.orange, C.green, C.purple, C.navy][i]! }), circle(x! + (x! < 60 ? 12 : -12), y! - 10, 4.4, WHITE, C.ink, 0.9), line(`M${x! + (x! < 60 ? 12 : -12)} ${y! - 10} l0 -3 M${x! + (x! < 60 ? 12 : -12)} ${y! - 10} l${2 + i} 1`, C.ink, 0.8))), ring(60, 46, 28, 16),
    greyed(...range(4).map((i) => all(mini(14 + i * 28, 110, 0.22, { top: C.grey }), at(26 + i * 28, 110, 0.4, path('M-12 0 L-10 -6 C-8 -9 -4 -10 0 -10 L6 -10 C9 -10 11 -7 12 -4 L12 0 Z', '#9aa', C.ink, 1)))))),
  /** restprodukt: a log goes into a grey machine from the left and a finished grey board comes out on the right; from the bottom of the machine a heap of coloured wood shavings and sawdust falls out on its own, and this left-over heap is ringed in orange. */
  'hres.restprodukt': all(bg(), ground(), log(6, 52, 26, 5), arrow(34, 52, 40, 52, '#b0b4b8', 2), rect(40, 30, 40, 40, '#9aa3ad', 3, C.ink, 1.4), circle(52, 46, 6, '#c4c8cc', C.ink, 1), circle(68, 52, 5, '#c4c8cc', C.ink, 1), rect(54, 70, 12, 6, '#7a828c', 1, C.ink, 1),
    greyed(arrow(80, 52, 86, 52, C.ink, 2), rect(88, 48, 26, 7, WOOD, 1, C.ink, 1.1)), path('M44 112 C48 92 72 92 76 112 Z', '#e8c890', C.ink, 1.2), ...range(14).map((i) => { const R = rng(i + 51); return path(`M${f1(48 + R() * 24)} ${f1(98 + R() * 12)} q2 -2 4 0`, 'none', WOOD2, 1); }), ...range(5).map((i) => circle(56 + i * 2.4, 78 + i * 3, 0.9, WOOD2, null)), ring(60, 100, 22, 14)),
  /** resurseffektiv: two factories each make one identical box; the grey one on the left swallows a big pile of logs, drops and lightning bolts; the coloured one on the right, ringed in orange with a green check, needs only a small pile for the same box. */
  'hres.resurseffektiv': all(bg(), ground(), greyed(...range(6).map((i) => logEnd(10 + (i % 3) * 8, 48 - Math.floor(i / 3) * 8, 3.4)), ...range(4).map((i) => drop(10 + i * 7, 62, 0.9)), bolt(18, 76, 0.5), bolt(30, 76, 0.5), arrow(38, 60, 42, 76, C.ink, 1.6), factory(30, 108, 0.6), crate(30, 106, 0.6)),
    logEnd(78, 48, 3.4), drop(86, 52, 0.9), bolt(94, 50, 0.5), arrow(86, 60, 88, 76, HL, 2), factory(88, 108, 0.6), crate(88, 106, 0.6), box(62, 30, 52, 82), check(108, 24, 0.8)),

  // ── 2947 Livscykelperspektiv ──
  /** livscykel (2): one T-shirt shown four times around a big orange circle of arrows, getting older: brand new with sparkles at the top, worn by a person on the right, faded with a patch at the bottom, and torn into a rag with holes on the left – the whole life of one product. */
  'hres.livscykel.2': all(bg(), circle(60, 60, 36, 'none', HL, 2.4), ...[45, 135, 225, 315].map((d) => { const a = d * Math.PI / 180, x = 60 + Math.cos(a) * 36, y = 60 + Math.sin(a) * 36; return path(`M${f1(x)} ${f1(y)} l${f1(Math.cos(a + 2.4) * 7)} ${f1(Math.sin(a + 2.4) * 7)} l${f1(Math.cos(a + 0.6) * 7)} ${f1(Math.sin(a + 0.6) * 7)} Z`, HL, HL, 1); }),
    shirt(60, 22, 1.2, '#e06a6a'), sparkle(76, 12, 4, GOLD), sparkle(44, 14, 3, GOLD), mini(98, 80, 0.4, { top: '#e06a6a', mood: 'smile' }), shirt(60, 98, 1.2, '#d8a8a8'), rect(62, 98, 6, 6, '#8ab0d8', 1, C.ink, 0.8),
    shirt(22, 60, 1.2, '#b8a0a0'), ellipse(18, 62, 2.4, 2, PAPER, C.ink, 0.6), ellipse(26, 66, 2, 1.6, PAPER, C.ink, 0.6), path('M14 70 l2 3 l2 -3 l2 3', 'none', C.ink, 0.8)),
  /** livscykelanalys: a clipboard chart: along the bottom five small stage pictures (mine, factory, truck, phone, bin) and above each one a bar showing how much it harms the environment – the factory bar is highest; a magnifying glass looks at the bars. */
  'hres.livscykelanalys': all(bg(), rect(6, 10, 108, 100, WHITE, 3, C.ink, 1.4), rect(44, 6, 32, 8, '#8a8f96', 2, C.ink, 1), line('M10 80 L110 80', C.ink, 1), ...[14, 37, 60, 83, 106].map((x, i) => rect(x - 5, 80 - [16, 46, 12, 22, 8][i]!, 10, [16, 46, 12, 22, 8][i]!, [GREY, '#e8603a', GREY, '#f0b070', GREY][i]!, 1, C.ink, 0.9)), chain(96, -1),
    circle(84, 34, 12, 'rgba(220,240,252,0.4)', C.dark, 2.4), line('M93 43 L102 52', C.dark, 3.4)),
  /** från vagga till grav: on the left a wooden baby cradle with a little new chair inside it; an orange arrow goes through a picture of the chair being used, and on to the right, where the broken chair lies on a mound with a plain rounded gravestone; one orange bracket covers the whole way. */
  'hres.från-vagga-till-grav': all(bg(), ground(), path('M8 90 C8 104 36 104 36 90 Z', WOOD, C.ink, 1.2), line('M8 104 C14 100 30 100 36 104', WOOD2, 2), chair(22, 90, 0.5), arrow(38, 92, 46, 92, HL, 2.2), chair(60, 108, 0.9), mini(68, 112, 0.42, { top: C.green }), arrow(76, 92, 84, 92, HL, 2.2),
    path('M86 112 C88 100 112 100 114 112 Z', '#a88a6a', C.ink, 1.1), path('M96 104 L96 82 C96 76 108 76 108 82 L108 104 Z', '#b8bcc0', C.ink, 1.2), rot(98, 106, 70, 0.5, chair(0, 0, 1, '#a08060')), path('M6 64 L6 58 L114 58 L114 64', 'none', HL, 2.6)),
  /** användning: the five-step chain of a phone's life with only the fourth step – a person using the phone, with lightning for the electricity it uses – coloured and ringed in orange; the other steps are grey. */
  'hres.användning': all(bg(), chain(40, 3, [false, false, false, true, false]), mini(60, 112, 0.6, { top: C.orange, mood: 'smile' }), reach(60, 0.6, 1, 70, 76), phoneIcon(72, 72, 0.7), bolt(84, 64, 0.5), line('M94 90 L106 90 L106 80', C.ink, 1.2), rect(104, 74, 6, 6, WHITE, 1, C.ink, 0.9)),
  /** kassera: a shop worker in an apron throws a broken, cracked television into a big waste container; an orange arrow shows the throw, and the container is ringed. */
  'hres.kassera': all(bg(), ground(), fig(28, '#5a8ac8', 'calm', { bottom: '#3a3a4a' }), rect(18, 70, 20, 30, '#3a8a5a', 2, C.ink, 1), reach(28, 1, 1, 52, 52), rot(60, 44, 20, 1, rect(-12, -9, 24, 18, C.dark, 2, C.ink, 1.2), rect(-10, -7, 20, 14, '#9fb8c8', 1, null), line('M-6 -7 L0 0 L-3 7 M0 0 L8 -3', C.ink, 0.9)),
    arrow(70, 52, 82, 72, HL, 2.4), path('M72 112 L68 76 L116 76 L112 112 Z', '#5a7a5a', C.ink, 1.3), rect(66, 72, 52, 5, '#4a6a4a', 1, C.ink, 1.1), ring(92, 92, 26, 22)),
  /** återvinningsbar: a coloured packaging carton with a big green circle of three chasing arrows on it and a green check, ringed in orange; beside it a grey carton without the arrows has a red cross. */
  'hres.återvinningsbar': all(bg(), ground(), path('M18 112 L18 46 L30 34 L58 34 L58 112 Z', '#e8d4b0', C.ink, 1.4), path('M18 46 L46 46 L58 34 M46 46 L46 112', 'none', C.ink, 1.1), recycle(32, 80, 12), check(50, 22, 0.9), ring(38, 74, 28, 44),
    greyed(path('M78 112 L78 62 L88 54 L108 54 L108 112 Z', '#e8d4b0', C.ink, 1.3), circle(92, 88, 8, '#aaa', C.ink, 1)), cross(94, 44, 0.8)),
  /** miljöpåverkan: a factory and an aeroplane send out dark smoke; orange arrows go from the smoke to its effects – a wilting brown tree, a sad fish in dirty water and a grey sky – which are ringed in orange. */
  'hres.miljöpåverkan': all(bg('#dfe3e6'), rect(4, 92, 112, 20, '#b8b090', 0, null), factory(24, 92, 0.9, '#c9b8a4', false), ...[[38, 42], [46, 32], [56, 24]].map(([x, y]) => circle(x!, y!, 6, SMOKE, C.ink, 0.8)), path('M70 18 L96 14 L102 16 L96 20 L72 22 Z M82 14 L90 6 L92 14 M84 21 L90 28 L92 20', WHITE, C.ink, 1), ...[[64, 22], [58, 18]].map(([x, y]) => circle(x!, y!, 3.4, SMOKE, null)),
    arrow(62, 34, 72, 54, HL, 2), path('M88 92 L88 70', TRUNK, C.ink, 2.4), path('M88 70 C80 60 78 54 76 50 M88 72 C96 62 100 58 104 56 M88 68 L88 56', 'none', '#8a6a3a', 1.6), ...[[76, 50], [104, 56], [88, 56]].map(([x, y]) => ellipse(x!, y! + 3, 3, 1.6, '#b08a4a', C.ink, 0.6)), arrow(50, 60, 46, 92, HL, 2), ellipse(40, 102, 26, 7, '#7a8a6a', C.ink, 1.1), fish(40, 102, 0.5, '#9aa'), ring(88, 72, 20, 24), ring(40, 102, 28, 9)),
  /** klimatavtryck: a T-shirt on the left; beside it a tall column of dark grey smoke clouds stacked higher and higher, ringed in orange; on the right a thermometer stands next to a small Earth, with the red line high up. */
  'hres.klimatavtryck': all(bg(), ground(), shirt(22, 90, 1.5, '#e06a6a'), arrow(40, 90, 48, 90, HL, 2.2), ...range(5).map((i) => cloud(64, 102 - i * 17, 0.8 + i * 0.06, ['#9a9ea6', '#8a8e96', '#7a7e86', '#6a6e76', '#5a5e66'][i]!)), ring(64, 66, 22, 46),
    circle(96, 98, 10, SEA, C.ink, 1.2), path('M90 94 c3 -4 7 -3 9 0 c-2 4 -6 4 -9 0 Z M96 102 c3 -2 6 0 4 3 Z', GRASS2, null), rect(102, 22, 8, 66, WHITE, 4, C.ink, 1.2), circle(106, 90, 6, RED, C.ink, 1.2), rect(104.4, 30, 3.2, 58, RED, 1.4, null), ...range(6).map((i) => line(`M110 ${30 + i * 10} l3 0`, C.ink, 0.8))),
  /** energiåtgång: a steel factory with a glowing steel bar coming out; many yellow lightning bolts stream into it from a power line, and a big gauge beside it has its needle far over in the red; the gauge is ringed in orange. */
  'hres.energiåtgång': all(bg(), ground(), line('M8 20 L8 60 M4 24 L12 24 M8 24 L60 46', C.dark, 1.4), ...range(4).map((i) => bolt(22 + i * 10, 34 + i * 4, 0.5)), factory(52, 108, 1.2), rect(78, 100, 30, 6, '#f08a2c', 1, C.ink, 1), heat(92, 98, 0.4), gauge(94, 48, 18, 0.9), ring(94, 42, 22, 16)),
  /** ekologiskt fotavtryck: a person stands beside a huge footprint shape filled with patches of field, forest, pasture and sea, ringed in orange; small globes in a row at the top – four of them – show how many Earths this way of living would need. */
  'hres.ekologiskt-fotavtryck': all(bg(), g('', footprint(70, 80, 1.3, GRASS)), path('M58 76 C64 70 72 72 80 76 L82 92 L60 92 Z', '#f0d070', null), path('M60 96 C66 100 74 100 80 96 L76 106 L64 106 Z', SEA, null), ...range(5).map((i) => spruce(60 + i * 5, 72 - (i % 2) * 3, 0.32)), footprint(70, 80, 1.3, 'none'), ring(70, 70, 26, 44),
    mini(22, 112, 0.6, { top: C.orange, mood: 'smile' }), ...range(4).map((i) => all(circle(16 + i * 15, 16, 6, SEA, C.ink, 1), path(`M${12 + i * 15} 14 c2 -3 5 -2 6 0 c-1 3 -4 3 -6 0 Z M${17 + i * 15} 19 c2 -1 4 0 3 2 Z`, GRASS2, null)))),
};
