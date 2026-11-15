/**
 * Natur & geografi → Landskap & geologi → Floder, sjöar & hav, 2531–2537 (0.42): the parts of a river, Swedish
 * lakes and watercourses, waterfalls and rapids, deltas and river mouths, seas and oceans, tides and ocean
 * currents, and the water cycle.
 * Recurring signs: light blue fresh water and darker blue sea, green land seen from above (maps) or from the side,
 * dark blue arrows for the direction of the water, and an orange highlight ring or arrow on the thing that the
 * word names. Sizes of watercourses are shown with people, bridges and boats. Digits only; no words, no brands,
 * no pointing fingers. Abstract words are small symbolic scenes with a grey reference beside them as contrast.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { type Build } from './figures';
import { HL, arm } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const SKY = '#e2eff8';
const FRESH = '#7cc0e6';
const FRESH2 = '#4f9ccc';
const SEA = '#3f86c0';
const SEA2 = '#2c6aa0';
const DEEP = '#1d3f66';
const ABYSS = '#121f38';
const LAND = '#8cc96a';
const LAND2 = '#5f9e48';
const SPRUCE = '#3f7a4a';
const SAND = '#e9d5a1';
const MUD = '#8a6a48';
const MUD2 = '#6e523a';
const ROCK = '#9a8a78';
const ROCK2 = '#7a6c5c';
const SNOW = '#f7f8fa';
const ICE = '#d9eef8';
const ICE2 = '#a9d3ea';
const FOAM = '#ffffff';
const CONCRETE = '#b9b6ae';
const WOOD = '#a0673d';
const WOOD2 = '#7a4a26';
const REED = '#c9a85a';
const PEAT = '#3b3328';
const FLOW = '#1f4f86';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const num = (x: number, y: number, n: string, size = 9, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${n}</text>`;

// ── Scenery ──────────────────────────────────────────────────────────
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const field = (y = 96, col: string = LAND) => rect(4, y, 112, 112 - y, col, 0, null);
const cloud = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', col, C.ink, 1.2));
const sun = (x: number, y: number, r = 7) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 6))} ${f1(y + Math.sin(a) * (r + 6))}`, C.gold, 1.8); }), circle(x, y, r, C.yellow, C.ink, 1.2));
const moon = (x: number, y: number, r = 7) => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${x} ${y + r} A${f1(r * 0.7)} ${r} 0 1 1 ${x} ${y - r} Z`, '#f4e7a6', C.ink, 1.1);
const tree = (x: number, y = 112, s = 1, col: string = LAND2) => at(x, y, s, rect(-2, -14, 4, 14, C.brown, 1, C.ink, 1), circle(0, -20, 9, col, C.ink, 1.2));
const spruce = (x: number, y = 112, s = 1, col: string = SPRUCE) => at(x, y, s, rect(-1.5, -6, 3, 6, C.brown, 0, C.ink, 0.8), path('M0 -34 L9 -14 L5 -14 L11 -6 L-11 -6 L-5 -14 L-9 -14 Z', col, C.ink, 1.1));
const topTree = (x: number, y: number, r = 4, col: string = LAND2) => circle(x, y, r, col, C.ink, 0.8);
const mountain = (x: number, y: number, w: number, h: number, col: string = ROCK, snow = true) => all(path(`M${x - w / 2} ${y} L${x} ${y - h} L${x + w / 2} ${y} Z`, col, C.ink, 1.3), snow ? path(`M${f1(x - w * 0.14)} ${f1(y - h * 0.72)} L${x} ${y - h} L${f1(x + w * 0.14)} ${f1(y - h * 0.72)} L${f1(x + w * 0.05)} ${f1(y - h * 0.78)} L${f1(x - w * 0.04)} ${f1(y - h * 0.7)} Z`, SNOW, C.ink, 0.9) : '');
const house = (x: number, y: number, s = 1, col: string = '#e8d9c0', roof: string = '#b84a3a') => at(x, y, s, rect(-9, -12, 18, 12, col, 0, C.ink, 1.1), path('M-11 -12 L0 -21 L11 -12 Z', roof, C.ink, 1.1), rect(-2.5, -7, 5, 7, C.dark, 0, null));
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.4);
const ban = (x: number, y: number, r = 7, w = 2.4) => all(circle(x, y, r, 'none', C.red, w), line(`M${f1(x - r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r * 0.7)} ${f1(y - r * 0.7)}`, C.red, w));
const okC = (x: number, y: number, r = 7) => all(circle(x, y, r, '#3a9a5a', C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, f1(r * 0.24)));
const waves = (x1: number, x2: number, y: number, col: string = C.white, sw = 1.1) => line(range(Math.max(1, Math.floor((x2 - x1) / 10))).map((i) => `M${x1 + i * 10} ${y} q2.5 -2.5 5 0 t5 0`).join(' '), col, sw);
const drop = (x: number, y: number, s = 1, col: string = FRESH) => at(x, y, s, path('M0 -6 C3 -2 4 0 4 2 C4 5 -4 5 -4 2 C-4 0 -3 -2 0 -6 Z', col, C.ink, 0.9));
const rain = (x: number, y: number, n = 4, col: string = FRESH2) => line(range(n).map((i) => `M${x + i * 7} ${y + (i % 2) * 4} l-2 6`).join(' '), col, 1.6);
const flake = (x: number, y: number, s = 1) => at(x, y, s, line('M0 -4 L0 4 M-3.5 -2 L3.5 2 M-3.5 2 L3.5 -2', '#7fb3d9', 1.2));
const fish = (x: number, y: number, s = 1, col: string = C.yellow, flip = false) => g(`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`, path('M-6 0 C-3 -4 4 -4 6 0 C4 4 -3 4 -6 0 Z M6 0 L10 -3 L10 3 Z', col, C.ink, 0.8), circle(-3, -0.6, 0.7, C.ink, null));
const salmon = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-10 0 C-6 -5 6 -5 9 0 C6 4 -6 5 -10 0 Z M9 0 L14 -4 L13 0 L14 4 Z', '#c8cfd6', C.ink, 0.9), path('M-8 1 C-3 3 4 3 8 1', 'none', '#e98a7a', 1.4), circle(-6, -1, 0.9, C.ink, null));
const boat = (x: number, y: number, s = 1, col: string = C.red, flip = false) => g(`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`, path('M-12 -4 L12 -4 L8 3 L-9 3 Z', col, C.ink, 1.2), rect(-3, -12, 7, 8, C.white, 1, C.ink, 1), line('M7 -4 L7 -14', C.ink, 1));
const ship = (x: number, y: number, s = 1) => at(x, y, s, path('M-18 -4 L18 -4 L13 4 L-14 4 Z', C.navy, C.ink, 1.2), rect(-8, -11, 16, 7, C.white, 1, C.ink, 1), rect(2, -16, 4, 5, C.red, 0, C.ink, 0.8));
const rowboat = (x: number, y: number, s = 1, col: string = WOOD) => at(x, y, s, path('M-12 -3 C-6 3 6 3 12 -3 Z', col, C.ink, 1.2), line('M-2 -1 L-10 -8 M2 -1 L10 -8', WOOD2, 1.2));
const stone = (x: number, y: number, rx: number, ry: number, col: string = ROCK) => ellipse(x, y, rx, ry, col, C.ink, 1);
const foam = (x: number, y: number, s = 1) => at(x, y, s, path('M-6 2 C-8 -2 -4 -5 -1 -3 C0 -6 5 -6 5 -2 C8 -2 8 2 5 3 Z', FOAM, '#9ccbe6', 0.8));
const flowA = (x1: number, y1: number, x2: number, y2: number, col: string = FLOW, w = 2) => arrow(x1, y1, x2, y2, col, w);
/** A watercourse seen from above: a dark outline under a wider light stroke. */
const water = (d: string, w: number, col: string = FRESH) => all(line(d, C.ink, w + 2), line(d, col, w));
const greenMap = (col: string = LAND) => rect(4, 4, 112, 108, col, 3, null);

// ── People ───────────────────────────────────────────────────────────
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: f1(ty - 38 * s), sl: f1(x - 13 * s), sr: f1(x + 13 * s) }; };
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number, skin: string = C.skin) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), skin, C.ink, 1.2)); };
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
/** Figures drawn standing at x = 60 on y = 112, placed with their feet at (x, y) and scaled by s. */
const stand = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s}) translate(-60 -112)`, ...k);
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
const helmet = (col: string = C.yellow) => path('M-13 -60 C-12 -72 12 -72 13 -60 Z', col, C.ink, 1.3);
const tiny = (x: number, y: number, s = 1, col: string = C.denim) => at(x, y, s, circle(0, -11, 2.6, C.skin, C.ink, 0.7), path('M-3 -8 L3 -8 L3.5 -2 L2 -2 L2 0 L-2 0 L-2 -2 L-3.5 -2 Z', col, C.ink, 0.7));

// ── Recurring scenes ─────────────────────────────────────────────────
/** Side view of a river running from mountains (left) to the sea (right), for upstream / downstream. */
const riverRun = (extra: Svg) => all(bg(), mountain(24, 70, 40, 44), mountain(40, 70, 30, 30, ROCK2, false), field(64, LAND), rect(96, 64, 20, 48, SEA, 0, null), waves(98, 114, 72),
  path('M4 82 C30 78 60 84 96 80 L96 96 C60 100 30 94 4 98 Z', FRESH, C.ink, 1.2), flowA(20, 90, 34, 89, FLOW, 1.6), flowA(52, 91, 66, 90, FLOW, 1.6), flowA(76, 89, 90, 88, FLOW, 1.6), extra);
/** A harbour wall with a measuring pole; level = water surface y. */
const harbour = (level: number, extra: Svg = '') => all(bg(), rect(4, 30, 30, 82, CONCRETE, 0, C.ink, 1.3), line('M4 40 L34 40', C.ink, 0.8), house(18, 30, 1),
  rect(34, level, 82, 112 - level, SEA, 0, null), waves(38, 112, level + 4), rect(4, 106, 112, 6, MUD, 0, null),
  rect(98, 22, 4, 90, C.white, 0, C.ink, 1), ...range(8).map((i) => line(`M98 ${30 + i * 10} L102 ${30 + i * 10}`, C.red, 1.4)), extra);
/** A lake seen from above with forest around it. */
const lakeMap = (extra: Svg = '') => all(greenMap(), ...[[14, 14], [28, 10], [100, 16], [108, 40], [12, 96], [26, 104], [96, 104], [110, 90]].map(([x, y]) => topTree(x!, y!, 4)),
  path('M30 40 C34 24 70 22 84 32 C98 42 96 64 82 74 C68 86 40 84 32 70 C26 60 28 50 30 40 Z', FRESH, C.ink, 1.4), extra);
/** The fan-shaped delta seen from above: river from the top, sea at the bottom. */
const deltaMap = (hlArm = -1) => {
  const arms = ['M60 46 C52 60 40 72 26 90', 'M60 46 C58 62 54 76 50 92', 'M60 46 C64 62 70 76 74 92', 'M60 46 C68 60 80 72 94 90'];
  return all(greenMap(), rect(4, 88, 112, 24, SEA, 0, null), waves(8, 108, 100), path('M14 92 C30 60 50 46 60 44 C70 46 90 60 106 92 Z', '#b9d68a', C.ink, 1.2),
    water('M60 4 C58 18 62 32 60 46', 9), ...arms.map((d) => water(d, 4, FRESH)), hlArm >= 0 ? line(arms[hlArm]!, HL, 3) : '');
};
/** A globe with continents. */
const blob = (x: number, y: number, s = 1, col: string = LAND, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-10 -6 C-6 -14 6 -12 10 -6 C14 0 8 10 2 8 C-4 12 -12 6 -10 -6 Z', col, C.ink, 1.1));
const thermo = (x: number, y: number, lvl: number, col: string = C.red) => all(rect(x - 2.5, y - 24, 5, 24, C.white, 2.5, C.ink, 1.1), rect(x - 1.2, f1(y - lvl), 2.4, lvl, col, 1, null), circle(x, y + 2, 4, col, C.ink, 1.1));
const glass = (x: number, y: number, fill: string = FRESH, s = 1) => at(x, y, s, path('M-8 -18 L8 -18 L6 6 L-6 6 Z', '#eef6fb', C.ink, 1.2), path('M-7 -10 L7 -10 L6 5 L-6 5 Z', fill, null));
const bottle = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-14 -6 L6 -6 C8 -6 10 -4 12 -3 L18 -3 L18 3 L12 3 C10 4 8 6 6 6 L-14 6 C-16 6 -16 -6 -14 -6 Z', '#bfe3c9', C.ink, 1.2), rect(18, -2.5, 4, 5, WOOD, 1, C.ink, 0.8), rect(-11, -3.5, 14, 7, '#f3e6c4', 1, C.ink, 0.8), line('M-11 0 L3 0', '#d7c49a', 0.8));

// ── Motifs ───────────────────────────────────────────────────────────
export const WATERS_SEAS_MOTIFS: Record<string, Svg> = {
  // 2531 Flodens delar
  'vatt.flod': all(greenMap(), water('M50 4 C46 24 70 34 62 54 C54 74 34 82 40 112', 20), ship(50, 84, 0.7),
    tree(14, 40, 0.6), tree(96, 30, 0.6), tree(98, 90, 0.7), tree(16, 104, 0.6), house(92, 62, 0.8), house(20, 70, 0.7)),
  'vatt.flod.2': harbour(42, all(boat(70, 42, 1.1, C.red), moon(56, 16, 6), arrow(84, 70, 84, 48, HL, 2.8), ring(100, 42, 6))),
  'vatt.källa.2': all(bg(), path('M4 112 L4 50 C30 40 70 44 116 60 L116 112 Z', LAND, C.ink, 1.2), stone(40, 58, 12, 7), stone(58, 60, 9, 6, ROCK2), stone(28, 62, 7, 5),
    path('M46 60 C47 54 50 52 52 56 C54 52 57 54 56 60', 'none', FRESH2, 2), drop(44, 52, 0.8), drop(54, 50, 0.7), water('M50 64 C56 76 74 82 88 94 C96 100 104 106 116 108', 4), spruce(92, 62, 0.8), spruce(104, 66, 0.7), ring(50, 60, 13)),
  'vatt.biflod': all(greenMap(), water('M70 4 C66 30 74 60 66 112', 16), greyed(water('M90 4 C96 20 84 30 76 40', 5)), water('M8 50 C24 46 40 62 64 66', 6), line('M8 50 C24 46 40 62 64 66', HL, 2.2),
    flowA(20, 44, 34, 48, FLOW, 1.6), flowA(70, 80, 69, 96, FLOW, 1.6), tree(20, 96, 0.6), tree(98, 76, 0.6)),
  'vatt.ström': all(bg(), field(48, LAND), rect(4, 58, 112, 40, FRESH, 0, null), line('M4 58 L116 58 M4 98 L116 98', C.ink, 1.2), rect(4, 98, 112, 14, LAND, 0, null),
    ...[[12, 68], [44, 76], [16, 88], [60, 66], [70, 88]].map(([x, y]) => flowA(x!, y!, x! + 22, y!, FLOW, 2.4)), ellipse(96, 78, 6, 2.5, '#6b8e4e', C.ink, 1), arrow(96, 74, 112, 74, HL, 2.2), tree(20, 48, 0.6), tree(96, 48, 0.6)),
  'vatt.uppströms': riverRun(all(boat(62, 84, 1, C.red, true), arrow(52, 74, 24, 70, HL, 3))),
  'vatt.nedströms': all(bg(), mountain(96, 70, 40, 44), mountain(80, 70, 30, 30, ROCK2, false), field(64, LAND),
    path('M116 82 C90 78 60 84 4 80 L4 96 C60 100 90 94 116 98 Z', FRESH, C.ink, 1.2), flowA(100, 90, 86, 89, FLOW, 1.6), flowA(68, 91, 54, 90, FLOW, 1.6), flowA(30, 89, 16, 88, FLOW, 1.6),
    ring(92, 88, 5), line('M86 88 C76 87 66 86 56 86', HL, 1.6, '3 3'), boat(42, 84, 1, C.red, true), arrow(68, 74, 26, 70, HL, 3), tree(14, 64, 0.5), tree(56, 64, 0.5)),
  'vatt.flodbädd': all(bg(), path('M4 40 L28 40 C34 70 86 70 92 40 L116 40 L116 112 L4 112 Z', MUD, C.ink, 1.3), path('M28 44 C34 72 86 72 92 44 Z', FRESH, null), line('M28 44 L92 44', C.ink, 1),
    ...[[44, 66, 4], [56, 69, 3], [70, 68, 4], [80, 62, 3]].map(([x, y, r]) => stone(x!, y!, r!, f1(r! * 0.6), ROCK2)), fish(58, 54, 1), tree(14, 40, 0.6), tree(104, 40, 0.6), line('M30 52 C38 76 82 76 90 52', HL, 3)),
  'vatt.korvsjö': all(greenMap(), water('M70 4 C74 30 56 40 60 60 C64 80 76 92 72 112', 10), path('M60 30 C30 26 18 44 26 60 C34 76 52 74 56 68 C44 70 34 62 34 52 C34 40 46 34 60 36 Z', FRESH, C.ink, 1.3),
    greyed(path('M56 68 C58 50 60 42 60 36', 'none', LAND2, 2, )), oval(36, 52, 22, 26), ...[[100, 20], [96, 70], [14, 96], [104, 100]].map(([x, y]) => topTree(x!, y!, 4))),
  'vatt.vattendelare': all(bg(), path('M4 112 L4 96 L60 34 L116 96 L116 112 Z', LAND, C.ink, 1.3), rect(4, 100, 20, 12, SEA, 0, null), rect(96, 100, 20, 12, SEA, 0, null), cloud(60, 14, 0.9, '#d5dbe1'), rain(48, 22, 4),
    arrow(54, 42, 22, 86, FLOW, 2.4), arrow(66, 42, 98, 86, FLOW, 2.4), line('M60 30 L60 54', HL, 3, '4 3'), ring(60, 36, 6)),
  'vatt.avrinningsområde': all(greenMap('#cfe3b4'), rect(4, 92, 112, 20, SEA, 0, null), waves(8, 108, 102), path('M14 30 C20 10 70 6 82 22 C92 36 84 70 70 92 L48 92 C32 72 8 54 14 30 Z', LAND, HL, 2.6),
    water('M60 92 C58 70 52 50 48 30', 5), water('M50 40 C38 34 30 28 24 26', 3), water('M54 58 C64 50 72 36 76 24', 3), water('M52 72 C42 66 30 60 22 56', 2.5),
    greyed(water('M104 92 C106 70 100 50 108 30', 3)), tree(100, 14, 0.4)),
  'vatt.rinna-ut': all(bg(), field(40, LAND), rect(66, 40, 50, 72, SEA, 0, null), waves(72, 112, 60), waves(72, 112, 84), water('M4 70 C24 66 44 76 68 74', 10), flowA(12, 68, 30, 70, FLOW, 1.6), arrow(56, 74, 90, 76, HL, 3), tree(18, 44, 0.5), tree(40, 100, 0.6)),

  // 2532 Sveriges sjöar och vattendrag
  'vatt.vattendrag': all(greenMap(), water('M10 4 C20 20 14 36 30 48', 2.5), water('M110 10 C96 24 88 30 74 44', 4), water('M30 48 C44 54 56 52 74 44 C86 60 78 80 70 112', 8),
    ...[[96, 70], [20, 90], [40, 20], [88, 16], [50, 100]].map(([x, y]) => topTree(x!, y!, 4)), oval(60, 58, 54, 52)),
  'vatt.bäck': all(bg(), field(70, LAND), path('M4 96 C30 92 50 100 70 96 C90 92 104 98 116 96 L116 104 C104 106 90 100 70 104 C50 108 30 100 4 104 Z', FRESH, C.ink, 1.1),
    stand(60, 100, 0.62, fig(60, C.orange, 'laugh', { hairStyle: 'long' }), reach(60, 1, -1, 34, 54), reach(60, 1, 1, 86, 54)), stone(30, 100, 4, 2), flowA(84, 100, 100, 100, FLOW, 1.4), tree(16, 72, 0.6), tree(104, 72, 0.6)),
  'vatt.älv': all(bg(), mountain(26, 52, 44, 36), mountain(68, 52, 56, 44), mountain(100, 52, 30, 26), field(50, '#7fb066'), path('M54 52 C40 60 20 76 4 80 L4 112 L116 112 L116 92 C90 84 70 66 66 52 Z', FRESH, C.ink, 1.3),
    waves(20, 100, 96), waves(30, 80, 80), ...[[8, 70], [14, 64], [100, 76], [108, 70], [92, 68]].map(([x, y]) => spruce(x!, y!, 0.45)), rowboat(60, 98, 0.8)),
  'vatt.å': all(bg(), field(60, LAND), path('M4 80 C30 76 80 86 116 80 L116 100 C80 106 30 96 4 102 Z', FRESH, C.ink, 1.2), rect(36, 74, 46, 4, WOOD, 1, C.ink, 1.2), line('M40 78 L40 96 M78 78 L78 96', WOOD2, 2), line('M36 66 L82 66', WOOD2, 1.4),
    line('M38 66 L38 74 M80 66 L80 74', WOOD2, 1.4), stand(60, 74, 0.4, fig(60, C.green, 'smile')), flowA(14, 92, 28, 92, FLOW, 1.4), tree(14, 64, 0.6), tree(104, 62, 0.7)),
  'vatt.sjörik': all(greenMap(), ...[[20, 20, 8, 5], [44, 16, 6, 4], [70, 24, 10, 6], [96, 18, 7, 5], [28, 46, 7, 4], [56, 50, 11, 6], [90, 48, 8, 5], [16, 74, 6, 4], [42, 78, 9, 5], [72, 76, 6, 4], [100, 78, 9, 6], [30, 100, 7, 4], [64, 100, 8, 4], [96, 102, 6, 4]]
    .map(([x, y, rx, ry]) => ellipse(x!, y!, rx!, ry!, FRESH, C.ink, 1)), rect(4, 4, 112, 108, 'none', 3, HL, 2.6)),
  'vatt.insjö': lakeMap(all(greyed(path('M86 112 C96 96 108 92 116 90 L116 112 Z', SEA, null)), rowboat(54, 52, 0.9), oval(62, 54, 40, 34))),
  'vatt.tjärn': all(bg('#e8efe6'), path('M4 112 L4 76 C30 70 90 70 116 76 L116 112 Z', '#7a9a5a', null), ellipse(60, 90, 32, 11, PEAT, C.ink, 1.4), ellipse(52, 88, 10, 2, '#5a5248', null),
    ...[[12, 78, 0.9], [26, 74, 1.1], [42, 72, 0.8], [80, 72, 0.9], [96, 74, 1.1], [110, 78, 0.8], [18, 104, 0.7], [104, 106, 0.7]].map(([x, y, s]) => spruce(x!, y!, s!))),
  'vatt.sötvatten': all(bg(), field(60, LAND), path('M10 74 C20 64 70 64 86 72 C96 80 70 92 40 90 C20 88 4 84 10 74 Z', FRESH, C.ink, 1.3), fish(40, 80, 1.1, C.green), fish(62, 76, 0.9, C.orange, true),
    glass(100, 92, FRESH, 1), okC(100, 62, 6), greyed(at(24, 30, 0.8, path('M-6 -10 L6 -10 L8 12 L-8 12 Z', C.white, C.ink, 1.2), circle(-2, -6, 1, C.ink, null), circle(2, -6, 1, C.ink, null))), ban(24, 30, 10)),
  'vatt.rinna-upp': all(bg(), mountain(40, 72, 68, 60), path('M4 112 L4 70 C40 66 80 72 116 76 L116 112 Z', LAND, C.ink, 1.2), ellipse(38, 30, 7, 3, FRESH, C.ink, 1), water('M42 32 C50 46 44 60 60 72 C76 86 96 92 116 96', 4),
    flowA(56, 70, 70, 80, FLOW, 1.6), ring(39, 30, 10), spruce(90, 80, 0.6), spruce(102, 82, 0.5)),
  'vatt.tillflöde': lakeMap(all(water('M4 60 C14 58 22 56 30 54', 5), greyed(water('M84 32 C94 22 102 14 116 10', 4)), water('M60 112 C58 100 60 90 58 82', 4), line('M60 112 C58 100 60 90 58 82', HL, 2),
    arrow(58, 108, 58, 86, HL, 2.6), flowA(8, 58, 22, 56, FLOW, 1.4))),
  'vatt.utlopp': lakeMap(all(greyed(water('M4 60 C14 58 22 56 30 54', 4), water('M60 112 C58 100 60 90 58 82', 4)), water('M84 32 C94 22 102 14 116 10', 5), line('M84 32 C94 22 102 14 116 10', HL, 2.2), arrow(86, 30, 108, 14, HL, 2.6))),
  'vatt.sluss': all(bg(), rect(4, 40, 30, 72, CONCRETE, 0, C.ink, 1.2), rect(86, 70, 30, 42, CONCRETE, 0, C.ink, 1.2), rect(4, 44, 30, 6, FRESH, 0, null), rect(34, 54, 52, 58, FRESH, 0, null), rect(86, 74, 30, 4, FRESH, 0, null),
    line('M4 44 L34 44', C.ink, 1), rect(32, 40, 4, 72, WOOD, 0, C.ink, 1.1), rect(84, 50, 4, 62, WOOD, 0, C.ink, 1.1), rect(34, 104, 52, 8, CONCRETE, 0, C.ink, 1), boat(60, 54, 1.1, C.yellow), arrow(60, 96, 60, 70, HL, 2.6), greyed(line('M36 74 L84 74', C.grey, 1.4, '3 3'))),
  'vatt.islossning': all(bg(), field(40, '#f2f4f2'), sun(98, 16, 6), rect(4, 52, 112, 46, FRESH2, 0, null), line('M4 52 L116 52 M4 98 L116 98', C.ink, 1.2), rect(4, 98, 112, 14, '#f2f4f2', 0, null),
    ...[[12, 58, 18, 10, -6], [36, 66, 22, 12, 8], [66, 58, 16, 9, -10], [86, 70, 24, 12, 6], [20, 82, 20, 10, 12], [56, 84, 26, 10, -4], [96, 88, 14, 7, 0]].map(([x, y, w, h, r]) => g(`rotate(${r} ${x! + w! / 2} ${y! + h! / 2})`, rect(x!, y!, w!, h!, ICE, 2, C.ink, 1.1))),
    flowA(40, 104, 70, 104, FLOW, 1.6), spruce(14, 40, 0.5), spruce(104, 40, 0.5)),

  // 2533 Vattenfall och forsar
  'vatt.vattenfall': all(bg(), path('M4 112 L4 26 L52 26 L52 76 L4 76 Z', ROCK, C.ink, 1.3), path('M68 26 L116 26 L116 76 L68 76 Z', ROCK, C.ink, 1.3), rect(4, 20, 112, 6, LAND, 0, C.ink, 1),
    rect(52, 26, 16, 54, FRESH, 0, null), line('M56 28 L56 78 M60 28 L60 78 M64 28 L64 78', C.white, 1.4), ellipse(60, 92, 50, 14, FRESH2, C.ink, 1.3), foam(48, 84), foam(60, 82, 1.2), foam(72, 84),
    path('M4 76 L52 76 L52 26', 'none', C.ink, 1.3), spruce(16, 20, 0.5), spruce(102, 20, 0.5)),
  'vatt.fors': all(bg(), path('M4 30 L116 90 L116 112 L4 112 Z', '#7fb066', null), path('M4 34 L116 72 L116 100 L4 54 Z', FRESH, C.ink, 1.3),
    ...[[20, 44, 6], [40, 52, 7], [62, 60, 6], [84, 70, 7], [102, 80, 5], [52, 62, 4]].map(([x, y, r]) => all(stone(x!, y!, r!, f1(r! * 0.6), ROCK2), foam(x! - r!, y! - 2, 0.8))),
    flowA(14, 46, 36, 56, C.white, 2), flowA(64, 66, 88, 76, C.white, 2), spruce(14, 28, 0.5), spruce(100, 64, 0.5)),
  'vatt.forsa': all(bg('#d6ecf8'), path('M4 20 C40 30 70 60 116 66 L116 104 C70 100 40 70 4 56 Z', FRESH2, C.ink, 1.3), ...range(5).map((i) => line(`M${8 + i * 6} ${30 + i * 6} C40 ${40 + i * 6} 70 ${70 + i * 4} 112 ${74 + i * 6}`, C.white, 1.6)),
    stone(50, 70, 9, 6, ROCK2), stone(84, 86, 8, 5, ROCK2), foam(42, 64, 1.3), foam(76, 80, 1.3), foam(56, 70, 1), arrow(66, 50, 100, 60, HL, 3)),
  'vatt.fallhöjd': all(bg(), path('M4 112 L4 30 L56 30 L56 112 Z', ROCK, C.ink, 1.3), rect(56, 30, 10, 62, FRESH, 0, null), line('M58 32 L58 90 M62 32 L62 90', C.white, 1.2), ellipse(70, 96, 36, 10, FRESH2, C.ink, 1.2), rect(4, 24, 52, 6, LAND, 0, C.ink, 1),
    line('M84 30 L84 92', HL, 2.6), path('M80 36 L84 28 L88 36 Z M80 86 L84 94 L88 86 Z', HL, null), line('M66 30 L92 30 M76 94 L92 94', HL, 1.2, '3 2'), foam(66, 90)),
  'vatt.dåna': all(bg(), path('M4 112 L4 22 L34 22 L34 112 Z', ROCK, C.ink, 1.3), rect(34, 22, 14, 70, FRESH, 0, null), line('M38 24 L38 90 M43 24 L43 90', C.white, 1.3), ellipse(44, 98, 34, 10, FRESH2, C.ink, 1.2), foam(44, 92, 1.2),
    ...[10, 18, 26].map((r) => path(`M${54 + r * 0.4} ${56 - r} A${r} ${r} 0 0 1 ${54 + r * 0.4} ${56 + r}`, 'none', HL, 2)),
    stand(94, 112, 0.6, fig(60, C.orange, 'shock'), reach(60, 1, -1, 48, 30), reach(60, 1, 1, 72, 30))),
  'vatt.virvel': all(bg(FRESH), ...range(4).map((i) => path(`M${60 + 8 + i * 9} 60 A${8 + i * 9} ${f1((8 + i * 9) * 0.8)} 0 1 1 ${60 - 8 - i * 9} 60`, 'none', i % 2 ? C.white : FRESH2, 2.4)),
    circle(60, 60, 4, DEEP, null), ellipse(88, 34, 5, 2.4, '#6b8e4e', C.ink, 1), arrow(96, 40, 88, 62, HL, 2.4), ellipse(30, 86, 4, 2, '#6b8e4e', C.ink, 1)),
  'vatt.forsränning': all(bg(), path('M4 40 L116 70 L116 112 L4 112 Z', FRESH, C.ink, 1.2), ...[[20, 56], [94, 84], [50, 94], [100, 102]].map(([x, y]) => all(stone(x!, y!, 6, 3.5, ROCK2), foam(x! - 6, y! - 2, 0.8))),
    g('rotate(14 60 74)', ellipse(60, 76, 30, 8, C.orange, C.ink, 1.4), ...[44, 58, 72].map((x, i) => all(circle(x, 62, 4, C.skin, C.ink, 0.9), path(`M${x - 6} 63 C${x - 6} 56 ${x + 6} 56 ${x + 6} 63 Z`, [C.red, C.yellow, C.red][i]!, C.ink, 0.9), rect(x - 5, 66, 10, 8, C.red, 2, C.ink, 0.9))),
      line('M50 70 L40 84 M78 70 L88 84', WOOD2, 1.6)), foam(30, 80), foam(88, 92)),
  'vatt.vattenkraft': all(bg(), mountain(24, 60, 36, 30, ROCK, false), rect(4, 40, 40, 30, FRESH, 0, null), path('M44 36 L56 36 L62 112 L44 112 Z', CONCRETE, C.ink, 1.3), line('M50 56 L74 96', C.dark, 4),
    rect(68, 90, 18, 14, C.grey, 2, C.ink, 1.2), circle(77, 97, 4, C.white, C.ink, 1), line('M75 97 L79 97 M77 95 L77 99', C.ink, 1), rect(62, 104, 54, 8, FRESH, 0, null),
    line('M100 30 L94 88 M100 30 L106 88 M96 50 L104 50 M95 66 L105 66', C.dark, 1.4), line('M86 97 L98 82', C.dark, 1), path('M104 16 L98 26 L102 26 L98 36 L108 22 L104 22 L108 16 Z', C.yellow, C.ink, 1), ring(77, 97, 11)),
  'vatt.damm.3': all(bg(), mountain(24, 70, 36, 40, ROCK, false), mountain(96, 70, 36, 40, ROCK, false), rect(4, 46, 46, 24, FRESH, 0, null), waves(8, 44, 54), path('M46 40 L62 40 L70 112 L40 112 Z', CONCRETE, C.ink, 1.4),
    line('M48 52 L64 52 M46 66 L66 66 M44 80 L68 80 M42 94 L69 94', '#9a978f', 1), field(100, LAND), water('M70 106 C84 104 100 108 116 104', 4), rect(4, 70, 36, 30, FRESH, 0, null), oval(54, 76, 18, 40)),
  'vatt.laxtrappa': all(bg(), rect(4, 30, 30, 82, CONCRETE, 0, C.ink, 1.3), rect(4, 30, 30, 8, FRESH, 0, null), ...range(5).map((i) => all(rect(34 + i * 16, 40 + i * 14, 16, 72 - i * 14, CONCRETE, 0, C.ink, 1.1), rect(35 + i * 16, 40 + i * 14, 14, 7, FRESH, 0, null))),
    salmon(46, 30, 0.8, -30), salmon(78, 58, 0.8, -30), arrow(108, 100, 50, 34, HL, 2.6), line('M34 38 L34 40', C.ink, 1)),

  // 2534 Deltan och flodmynningar
  'vatt.mynning.2': all(greenMap(), rect(4, 76, 112, 36, SEA, 0, null), waves(8, 108, 90), waves(14, 104, 104), water('M58 4 C50 24 70 40 60 60 C56 68 58 74 60 78', 12), path('M48 76 C52 72 68 72 72 76 Z', FRESH, null),
    house(30, 70, 0.8), house(90, 66, 0.8), tree(16, 40, 0.6), tree(100, 34, 0.6), ring(60, 77, 14)),
  'vatt.delta-noun': all(deltaMap(), path('M18 92 L60 44 L102 92 Z', 'none', HL, 2.6)),
  'vatt.flodarm': deltaMap(3),
  'vatt.förgrena-sig': all(greenMap(), water('M60 112 C60 96 60 84 60 72', 10), water('M60 72 C52 56 36 46 22 30', 6), water('M60 72 C70 56 84 46 98 30', 6), water('M30 40 C28 28 28 18 24 6', 3), water('M30 40 C40 30 44 18 48 6', 3),
    water('M90 40 C84 28 80 16 78 6', 3), water('M90 40 C100 30 104 20 110 8', 3), ring(60, 72, 10), ring(30, 40, 6), ring(90, 40, 6)),
  'vatt.breda-ut-sig': all(greenMap('#cfe3b4'), water('M60 4 C60 20 60 30 60 40', 8), path('M60 40 C30 50 14 80 14 104 L106 104 C106 80 90 50 60 40 Z', '#a9d8f2', C.ink, 1.1), ...[[-1, 0.6], [-0.4, 1], [0.4, 1], [1, 0.6]].map(([dx, dy]) => arrow(60, 52, f1(60 + dx! * 38), f1(52 + dy! * 40), HL, 2.4))),
  'vatt.sjunka-undan': all(bg(), field(56, '#9cbf74'), path('M4 72 C30 70 90 74 116 70 L116 112 L4 112 Z', MUD, null), ellipse(36, 90, 14, 4, FRESH, C.ink, 1), ellipse(84, 98, 18, 5, FRESH, C.ink, 1), house(100, 56, 0.8), tree(16, 60, 0.6),
    greyed(line('M4 62 L116 62', FRESH2, 2.4, '4 3')), arrow(60, 64, 60, 88, HL, 2.6)),
  'vatt.risfält': all(bg(), ...range(3).map((i) => all(rect(4, 40 + i * 24, 112, 24, LAND2, 0, C.ink, 1), rect(8, 44 + i * 24, 104, 18, FRESH, 0, null), ...range(9).map((j) => line(`M${14 + j * 12} ${60 + i * 24} l-2 -9 M${14 + j * 12} ${60 + i * 24} l0 -11 M${14 + j * 12} ${60 + i * 24} l2 -9`, '#5aa04a', 1.2)))),
    mountain(30, 40, 50, 22, '#7fb066', false), mountain(90, 40, 52, 28, '#6a9a58', false)),
  'vatt.bräckvatten': all(greenMap(), rect(4, 70, 112, 42, SEA, 0, null), water('M60 4 C56 24 64 44 60 70', 14), path('M40 70 C40 86 80 86 80 70 Z', '#5aa3cf', null), waves(10, 110, 100), oval(60, 76, 26, 14), fish(44, 50, 0.9, C.green), fish(90, 96, 1, C.orange), fish(64, 76, 0.9, C.yellow)),
  'vatt.vass-noun': all(bg(), rect(4, 80, 112, 32, FRESH, 0, null), waves(8, 108, 96, FRESH2), ...range(14).map((i) => { const x = 10 + i * 7.4, h = 50 + (i % 3) * 10; return all(line(`M${x} 100 L${f1(x + (i % 2 ? 2 : -2))} ${100 - h}`, '#7a9a4a', 1.6), path(`M${f1(x + (i % 2 ? 2 : -2))} ${100 - h} c-3 4 -2 10 0 14 c2 -4 3 -10 0 -14 Z`, REED, C.ink, 0.6), line(`M${x} ${86 - (i % 4) * 4} l${i % 2 ? 6 : -6} -10`, '#7a9a4a', 1.2)); }),
    at(90, 88, 1, ellipse(0, 0, 8, 4, '#6d5a44', C.ink, 1), circle(7, -4, 3, '#2e5e3a', C.ink, 0.8), path('M10 -4 L13 -3 L10 -2 Z', C.orange, null))),
  'vatt.sandbank': all(bg(), rect(4, 44, 112, 68, SEA, 0, null), waves(8, 108, 58), waves(8, 108, 96), ellipse(60, 80, 40, 9, SAND, C.ink, 1.3), ellipse(60, 78, 28, 4, '#f3e2b4', null),
    at(48, 76, 1, ellipse(0, 0, 7, 3, '#8a8f96', C.ink, 0.8), circle(6, -2, 2.4, '#8a8f96', C.ink, 0.8)), g('rotate(-8 84 72)', boat(84, 72, 0.8, C.red)), oval(60, 80, 46, 14), cloud(28, 22, 0.7)),

  // 2535 Hav och oceaner
  'vatt.ocean': all(bg('#24304f'), circle(60, 60, 44, SEA, C.ink, 1.8), blob(32, 40, 1.3, LAND, 20), blob(30, 76, 1, LAND, -10), blob(96, 44, 0.9, LAND, 40), blob(92, 84, 0.8, LAND, 10), oval(66, 62, 22, 30)),
  'vatt.saltvatten': all(bg(), rect(4, 56, 112, 56, SEA, 0, null), waves(8, 108, 64), waves(8, 108, 82), at(84, 30, 1, path('M-8 -12 L8 -12 L10 14 L-10 14 Z', C.white, C.ink, 1.2), rect(-8, -18, 16, 6, C.grey, 2, C.ink, 1), circle(-3, -15, 0.9, C.ink, null), circle(3, -15, 0.9, C.ink, null)),
    ...[[70, 52], [76, 58], [82, 54], [74, 48]].map(([x, y]) => rect(x!, y!, 3, 3, C.white, 0, C.ink, 0.6)), glass(30, 38, SEA, 1.1), fish(40, 96, 1.2, C.orange)),
  'vatt.salthalt': all(bg('#f3ede2'), glass(36, 80, FRESH, 1.8), glass(84, 80, SEA, 1.8), ...[[78, 84], [84, 82], [90, 86], [82, 88], [88, 78], [80, 78]].map(([x, y]) => rect(x!, y!, 3, 3, C.white, 0, C.ink, 0.6)), greyed(rect(34, 86, 3, 3, C.white, 0, C.ink, 0.6)),
    rect(20, 18, 80, 10, C.white, 3, C.ink, 1.2), rect(22, 20, 14, 6, '#bfe3f5', 2, null), rect(22, 20, 60, 6, 'none', 2, null), path('M80 30 L84 24 L88 30 Z', HL, null), line('M84 30 L84 40', HL, 2), oval(84, 72, 22, 30)),
  'vatt.innanhav': all(greenMap(), rect(4, 4, 30, 108, SEA, 3, null), path('M50 30 C70 20 96 30 100 50 C104 74 86 92 64 90 C46 88 40 70 42 56 L34 54 L34 48 L44 46 C44 40 46 34 50 30 Z', SEA, C.ink, 1.3), line('M34 48 L44 46 M34 54 L42 56', C.ink, 1), oval(72, 60, 32, 34)),
  'vatt.havsyta': all(bg(), rect(4, 50, 112, 62, SEA, 0, null), rect(4, 80, 112, 32, SEA2, 0, null), line('M4 50 L116 50', HL, 3), waves(8, 108, 50, C.white, 1.2), at(30, 36, 1, path('M-8 0 C-4 -4 -2 -4 0 0 C2 -4 4 -4 8 0', 'none', C.ink, 1.4)), at(80, 30, 1, path('M-6 0 C-3 -3 -1 -3 0 0 C1 -3 3 -3 6 0', 'none', C.ink, 1.2)),
    fish(40, 70, 1.2, C.yellow), fish(84, 94, 1, C.orange, true), boat(92, 50, 0.9, C.red)),
  'vatt.kontinentalsockel': all(bg(), rect(4, 30, 112, 82, DEEP, 0, null), rect(4, 30, 112, 20, SEA, 0, null), path('M4 30 L24 30 L30 44 L66 52 L80 100 L116 104 L116 112 L4 112 Z', '#c9a27a', C.ink, 1.3), rect(4, 22, 22, 8, LAND, 0, C.ink, 1), house(14, 22, 0.6),
    waves(30, 110, 34), fish(48, 44, 0.9), fish(60, 46, 0.7, C.orange), path('M28 46 L66 54', 'none', HL, 3.2), oval(48, 48, 22, 8)),
  'vatt.djuphav': all(bg(ABYSS), rect(4, 4, 112, 14, SEA2, 3, null), path('M4 98 C30 94 70 100 116 96 L116 112 L4 112 Z', '#2c2a34', null),
    at(60, 64, 1.6, path('M-12 0 C-10 -10 8 -10 12 -2 L16 -6 L16 6 L12 2 C8 10 -10 10 -12 0 Z', '#4a4058', '#8a80a0', 1), path('M-12 2 L-6 4 L-10 6 Z', C.white, null), circle(-6, -3, 1.6, C.white, null), path('M-6 -8 C-8 -16 -16 -16 -18 -12', 'none', '#8a80a0', 0.9), circle(-18, -12, 2.4, '#f8f28a', null)),
    circle(31, 45, 7, 'rgba(248,242,138,0.25)', null), ...[[20, 30], [96, 40], [86, 86], [30, 88]].map(([x, y]) => circle(x!, y!, 0.8, '#8fb0d0', null))),
  'vatt.isberg': all(bg(), rect(4, 40, 112, 72, SEA, 0, null), path('M40 40 L48 20 L58 26 L66 12 L78 40 Z', SNOW, C.ink, 1.3), path('M40 40 L78 40 L92 64 L84 96 L56 104 L30 88 L26 60 Z', ICE2, C.ink, 1.1), line('M4 40 L116 40', C.white, 1.4), waves(80, 112, 46), ship(100, 38, 0.4), oval(58, 64, 40, 46)),

  // 2536 Tidvatten och havsströmmar
  'vatt.ebb': harbour(90, all(path('M34 96 C60 92 80 96 116 94 L116 106 L34 106 Z', MUD2, null), g('rotate(-8 64 96)', boat(64, 96, 1.1, C.red)), line('M34 58 L34 90', '#4f7a3a', 3), path('M34 56 L40 58 L34 62 Z', '#4f7a3a', null), moon(56, 16, 6), arrow(84, 50, 84, 80, HL, 2.8), ring(100, 90, 6))),
  'vatt.strömma': all(bg(SEA), waves(8, 108, 20), waves(8, 108, 104), path('M4 54 C30 40 60 70 90 52 L116 46 L116 64 L90 70 C60 88 30 58 4 72 Z', '#7fc0e8', C.ink, 1.1), ...[[14, 62], [40, 64], [66, 70], [90, 60]].map(([x, y]) => flowA(x!, y!, x! + 16, y! - 2, FLOW, 2)), bottle(54, 40, 0.5, -10), arrow(96, 80, 114, 74, HL, 2.6)),
  'vatt.ekvator': all(bg('#24304f'), circle(60, 60, 42, SEA, C.ink, 1.8), blob(40, 40, 1.2, LAND, 10), blob(76, 80, 1, LAND, -20), blob(84, 36, 0.8, LAND, 30), ellipse(60, 60, 42, 8, 'none', HL, 3), sun(60, 14, 5), circle(60, 18, 0.1, 'none', null)),
  'vatt.isfri': all(bg(), field(30, SNOW), rect(4, 44, 56, 68, SEA, 0, null), waves(8, 56, 60), ship(30, 64, 0.8), house(16, 40, 0.7, '#e8d9c0', '#b84a3a'), okC(50, 22, 6),
    greyed(rect(64, 44, 52, 68, ICE, 0, null), line('M66 60 L84 64 L96 58 L114 66 M70 80 L90 84 L112 78', C.ink, 1), ship(90, 70, 0.6)), line('M62 30 L62 112', C.ink, 1.2), ban(90, 22, 6)),
  'vatt.flaskpost': all(bg(), rect(4, 40, 112, 30, SEA, 0, null), waves(8, 108, 50), path('M4 66 C40 62 80 70 116 64 L116 112 L4 112 Z', SAND, C.ink, 1.2), bottle(58, 88, 1.6, -12), ring(60, 86, 30), at(98, 100, 1, path('M-5 0 L0 -5 L5 0 L0 5 Z', '#f2a0a0', C.ink, 0.8))),
  'vatt.mild.2': all(bg('#eaf4ea'), rect(4, 88, 82, 24, LAND, 0, null), sun(20, 20, 5), cloud(46, 22, 0.6), tree(12, 88, 0.5), ...[[26, 98], [36, 104], [48, 97]].map(([x, y]) => circle(x!, y!, 1.8, C.yellow, null)),
    stand(40, 112, 0.6, fig(60, '#7aa6c8', 'smile', { hairStyle: 'long' }), line('M60 44 L60 66', C.ink, 1.4), path('M52 40 L60 48 L68 40', 'none', C.ink, 1.2)), line('M56 42 C60 40 62 44 66 42 M54 50 C58 48 60 52 64 50', '#9fb8c8', 1.2),
    thermo(72, 84, 14, C.orange), oval(72, 72, 9, 18),
    rect(86, 4, 30, 108, C.white, 0, null), line('M86 4 L86 112', C.ink, 1.2), line('M86 58 L116 58', C.ink, 1),
    greyed(rect(86, 4, 30, 54, '#f4d9b0', 0, null), sun(98, 18, 6), thermo(110, 50, 24, C.red)), greyed(rect(86, 58, 30, 54, '#dfe6ee', 0, null), flake(96, 70, 1.4), flake(100, 86, 1.2), flake(94, 100, 1), thermo(110, 104, 3, '#5aa7d6'))),

  // 2537 Vattnets kretslopp
  'vatt.avdunsta': all(bg(), field(80, '#c9b48a'), sun(90, 22, 8), greyed(ellipse(50, 94, 34, 9, 'none', FRESH2, 1.4)), ellipse(50, 94, 20, 5, FRESH, C.ink, 1.2),
    ...[36, 50, 64].map((x) => path(`M${x} 84 C${x - 4} 76 ${x + 4} 70 ${x} 62 C${x - 4} 56 ${x + 4} 50 ${x} 44`, 'none', HL, 2)), circle(50, 30, 0.1, 'none', null)),
  'vatt.kondensera': all(bg('#f3ede2'), rect(4, 92, 112, 20, WOOD, 0, C.ink, 1.2), at(60, 70, 2, path('M-10 -20 L10 -20 L8 10 L-8 10 Z', '#e4f2fa', C.ink, 0.8), path('M-9 -12 L9 -12 L8 9 L-8 9 Z', '#bfe3f5', null), rect(-5, -10, 5, 5, ICE, 1, C.ink, 0.5), rect(1, -6, 5, 5, ICE, 1, C.ink, 0.5)),
    ...[[44, 44], [42, 66], [46, 80], [76, 50], [78, 70], [74, 84], [80, 60]].map(([x, y]) => drop(x!, y!, 0.8, '#9fd4f0')), thermo(100, 64, 4, '#5aa7d6'), ...[16, 24].map((x) => path(`M${x} 80 C${x - 3} 72 ${x + 3} 66 ${x} 58`, 'none', '#b9c4cc', 1.4)), oval(60, 66, 26, 30)),
  'vatt.nederbörd': all(bg(), field(96, LAND), cloud(40, 24, 1.2, '#c9d1d9'), cloud(84, 22, 1.1, '#c9d1d9'), rain(24, 42, 5), rain(28, 58, 4), ...[[74, 44], [86, 52], [96, 44], [80, 64], [94, 70]].map(([x, y]) => flake(x!, y!, 1.3)),
    rect(56, 74, 10, 22, '#e4f2fa', 1, C.ink, 1.1), rect(57, 84, 8, 11, FRESH, 0, null), ...range(4).map((i) => line(`M56 ${78 + i * 4} L59 ${78 + i * 4}`, C.ink, 0.8))),
  'vatt.dagg': all(bg('#fbe9d6'), sun(96, 30, 8), field(96, '#6aa04e'), ...range(9).map((i) => { const x = 14 + i * 11, h = 40 + (i % 3) * 12; return all(path(`M${x - 3} 112 C${x - 2} ${112 - h / 2} ${x + 2} ${112 - h} ${x + 4} ${112 - h} C${x + 2} ${112 - h / 2} ${x + 2} 100 ${x + 3} 112 Z`, '#5f9e48', C.ink, 0.8), drop(x + 2, 112 - h * 0.6, 0.7, '#cfeaff')); }), oval(48, 82, 18, 14)),
  'vatt.sippra': all(bg(), field(36, LAND), strata(40), ...[[30, 50], [36, 62], [28, 74], [80, 52], [74, 66], [84, 78]].map(([x, y]) => drop(x!, y!, 0.7)), arrow(56, 46, 56, 84, HL, 2.6), cloud(40, 14, 0.8, '#c9d1d9'), rain(30, 24, 4), rect(4, 90, 112, 22, '#6aaedb', 0, null), line('M4 90 L116 90', C.ink, 1)),
};

function strata(y0: number): Svg { return all(rect(4, y0, 112, 50, '#b8916a', 0, null), ...[[14, 50], [44, 60], [70, 48], [96, 70], [20, 80], [60, 82], [100, 52]].map(([x, y]) => ellipse(x!, y!, 4, 2.4, ROCK, C.ink, 0.6)), line(`M4 ${y0} L116 ${y0}`, C.ink, 1)); }
void num; void ICE2; void MUD2; void helmet; void tiny; void on;
