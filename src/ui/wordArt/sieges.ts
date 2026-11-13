/**
 * Historia & humaniora → Militärhistoria → Medeltida belägringar, 2021–2027 (0.37): why towns and castles
 * were besieged, cutting a town off, siege lines and earthworks, ladders and grappling hooks, siege engines,
 * storming and plundering, surrender and relief. The pictures share a few signs: a grey stone wall with
 * merlons, attackers in red tunics with iron helmets, defenders in blue, pale canvas tents, wooden machines,
 * top-down maps with a round walled town, water in light blue and a white flag for talks. Abstract words get
 * a small symbolic scene with a grey reference. Violence is shown only as objects and motion: no wounds and
 * no bodies. Digits only; no words in the pictures and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { type Build } from './figures';
import { HL, arm, shield } from './people';
import { P as F, type Mood, greyed } from './blindFix';
import { checkIcon } from './labelIcons';

// ── Colours ──────────────────────────────────────────────────────────
const STONE = '#c9c1b2';
const STONE2 = '#a99f8e';
const WOOD = '#a8743f';
const WOOD2 = '#7a4a20';
const ROPE = '#c9a66b';
const IRON = '#6b7280';
const WATER = '#9fd0ea';
const GRASS = '#9fcb84';
const EARTH = '#b08a5a';
const CANVAS = '#efe3c4';
const ATK = '#b8473a';
const DEF = '#3f6fb5';
const GOLD = C.gold;
const NIGHT = '#2b3350';
const ROOF = '#c8572d';
const f1 = (n: number) => n.toFixed(1);

// ── Figures ──────────────────────────────────────────────────────────
const ground = line('M4 112 L116 112', C.grey2, 2);
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, hy: ty - 56 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number, skin: string = C.skin) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, 3 * Math.max(0.6, h), skin, C.ink, 1.2)); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
const lo = (d: string, col: string, w: number) => line(d, C.ink, w + 2) + line(d, col, w);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
/** Move a whole drawing (figures included) up or sideways. */
const shift = (dx: number, dy: number, ...k: Svg[]) => g(`translate(${dx} ${dy})`, ...k);
const helmL = () => all(path('M-10.5 -55 C-10.5 -70 10.5 -70 10.5 -55 Z', C.silver, C.ink, 1.3), line('M-12 -56 L12 -56', IRON, 1.6));
const crownL = () => path('M-9 -63 L-9.5 -74 L-4.5 -68.5 L0 -76 L4.5 -68.5 L9.5 -74 L9 -63 Z', GOLD, C.ink, 1.3);
const strawL = () => all(ellipse(0, -63, 14, 3, '#e8c870', C.ink, 1.1), path('M-7 -63 C-7 -72 7 -72 7 -63 Z', '#e8c870', C.ink, 1.1));
const capL = (col: string) => path('M-10 -60 C-10 -70 10 -70 10 -60 L12 -58 L-12 -58 Z', col, C.ink, 1.1);
/** An attacker (red tunic) or defender (blue tunic) with an iron helmet. */
const soldier = (x: number, h = 1, col: string = ATK, mood: Mood = 'calm', more: Partial<Build> = {}) => all(fig(x, col, mood, { h, bottom: '#5a4a3a', ...more }), on(x, h, helmL()));
const king = (x: number, h = 1, col = '#7b3fa0', mood: Mood = 'smile') => all(fig(x, col, mood, { h, bottom: col }), on(x, h, crownL()));
const townsman = (x: number, h = 1, top = '#5a8a5a', mood: Mood = 'calm', more: Partial<Build> = {}) => all(fig(x, top, mood, { h, bottom: '#4a4038', ...more }), on(x, h, capL('#6b4a2e')));
const peasant = (x: number, h = 1, top = '#b98a52', mood: Mood = 'calm', more: Partial<Build> = {}) => all(fig(x, top, mood, { h, bottom: '#6b5a44', ...more }), on(x, h, strawL()));
/** Spear held upright beside a figure. */
const spear = (x: number, top: number, bottom = 112) => all(lo(`M${x} ${bottom} L${x} ${top + 6}`, WOOD, 1.6), path(`M${x - 2.5} ${top + 7} L${x} ${top} L${x + 2.5} ${top + 7} Z`, C.silver, C.ink, 1));
const sword = (x: number, y: number, rot = 0, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-1.8 0 L-1.8 -22 L0 -26 L1.8 -22 L1.8 0 Z', C.silver, C.ink, 1), line('M-6 0 L6 0', GOLD, 2.4), line('M0 0 L0 6', WOOD2, 2.4));
const motion = (x: number, y: number, dir: 1 | -1 = 1, n = 3, len = 10) => all(...Array.from({ length: n }, (_, i) => line(`M${x} ${y + i * 6} L${x - dir * len} ${y + i * 6}`, C.grey, 1.6)));

// kneeling figure facing right; local: ground 0, head centre (6, −58)
const kneelL = (top: string, bottom: string, sk: string = C.skin, hr: string = C.hair) => all(
  lo('M-4 -22 L-2 -4 L-18 -4', bottom, 8), ellipse(-21, -3, 4, 3, C.black, C.ink, 1),
  lo('M-4 -22 L11 -22 L12 -3', bottom, 8), ellipse(15, -1.5, 5, 2.6, C.black, C.ink, 1),
  path('M-12 -50 L4 -52 C8 -40 6 -30 4 -19 L-12 -19 C-14 -30 -14 -40 -12 -50 Z', top, C.ink, 1.8),
  circle(6, -58, 9, sk, C.ink, 1.8), path('M-3 -60 C-3 -72.5 15 -72.5 15 -60 C10 -64 2 -64 -3 -60 Z', hr, C.ink, 1.4),
  circle(10.5, -57.5, 1.1, C.ink, null), line('M8 -52.6 Q10.5 -51 13 -52.8', C.ink, 1.1),
  lo('M0 -46 L18 -40', top, 6), circle(19, -40, 3, sk, C.ink, 1.2));
const kneel = (x: number, s: number, top: string, bottom: string, flip = false, extra: Svg = '') => g(`translate(${x} 112) scale(${flip ? -s : s} ${s})`, kneelL(top, bottom), extra);

// ── Buildings and earthworks ─────────────────────────────────────────
/** A stone wall from `top` down to the ground, with merlons on top. */
const wall = (x: number, top: number, w: number, col: string = STONE, bottom = 112) => all(
  rect(x, top, w, bottom - top, col, 1, C.ink, 1.6),
  ...Array.from({ length: Math.max(1, Math.floor((w - 2) / 10)) }, (_, i) => rect(x + 2 + i * 10, top - 6, 6, 6.5, col, 0.5, C.ink, 1.2)),
  ...[0.33, 0.66].filter((t) => (bottom - top) * t > 8).map((t, i) => line(`M${x + 3 + i * 5} ${f1(top + (bottom - top) * t)} L${x + w - 3} ${f1(top + (bottom - top) * t)}`, STONE2, 1)));
const archDoor = (cx: number, w: number, h: number, fill = '#4a3a2e', base = 112) => path(`M${cx - w / 2} ${base} L${cx - w / 2} ${base - h + w / 2} A${w / 2} ${w / 2} 0 0 1 ${cx + w / 2} ${base - h + w / 2} L${cx + w / 2} ${base} Z`, fill, C.ink, 1.3);
/** Wooden gate with planks inside an arch. */
const gate = (cx: number, w: number, h: number, base = 112) => all(archDoor(cx, w, h, WOOD, base), ...Array.from({ length: Math.floor(w / 5) - 1 }, (_, i) => line(`M${f1(cx - w / 2 + (i + 1) * 5)} ${base - 1} L${f1(cx - w / 2 + (i + 1) * 5)} ${base - h + 6}`, WOOD2, 1)), line(`M${cx - w / 2} ${base - h * 0.45} L${cx + w / 2} ${base - h * 0.45}`, IRON, 1.8));
const castleS = (x: number, y: number, s = 1, col: string = STONE) => at(x, y, s,
  rect(-24, -38, 48, 38, col, 1, C.ink, 1.6), ...[-22, -12, -2, 8, 18].map((d) => rect(d, -44, 5, 6, col, 0.5, C.ink, 1.2)),
  rect(-36, -56, 15, 56, col, 1, C.ink, 1.6), rect(21, -56, 15, 56, col, 1, C.ink, 1.6),
  ...[-36, -29.5, 21, 27.5].map((d) => rect(d, -61, 4.5, 5, col, 0.5, C.ink, 1.1)),
  path('M-8 0 L-8 -16 C-8 -26 8 -26 8 -16 L8 0 Z', '#4a3a2e', C.ink, 1.3), rect(-31, -44, 5, 8, '#4a3a2e', 2, null), rect(26, -44, 5, 8, '#4a3a2e', 2, null));
const house = (x: number, y: number, s = 1, roof: string = ROOF, wallC = '#f3ead7') => at(x, y, s, rect(-10, -14, 20, 14, wallC, 1, C.ink, 1.3), path('M-12 -14 L0 -25 L12 -14 Z', roof, C.ink, 1.3), rect(-3, -8, 6, 8, '#6b4a2e', 1, null));
const church = (x: number, y: number, s = 1) => at(x, y, s,
  rect(-24, -26, 36, 26, '#f3ead7', 1, C.ink, 1.6), path('M-27 -26 L-6 -40 L15 -26 Z', '#8a5a3a', C.ink, 1.6),
  rect(12, -52, 14, 52, '#f3ead7', 1, C.ink, 1.6), path('M10 -52 L19 -70 L28 -52 Z', '#8a5a3a', C.ink, 1.6), line('M19 -70 L19 -79 M15 -75.5 L23 -75.5', C.ink, 1.8),
  path('M-10 0 L-10 -10 C-10 -16 -2 -16 -2 -10 L-2 0 Z', '#6b4a2e', C.ink, 1.2), path('M16 -40 C16 -45 22 -45 22 -40 L22 -34 L16 -34 Z', '#5a6a80', C.ink, 1));
/** A walled town seen from the side: wall, a tower and roofs behind. */
const town = (x: number, w: number, top = 70, col: string = STONE) => all(
  house(x + w * 0.25, top + 2, 1.1), house(x + w * 0.62, top, 1.2, '#b0473a'), rect(x + w * 0.42, top - 34, 9, 34, col, 1, C.ink, 1.3), path(`M${x + w * 0.42 - 1} ${top - 34} L${x + w * 0.42 + 4.5} ${top - 44} L${x + w * 0.42 + 10} ${top - 34} Z`, '#8a5a3a', C.ink, 1.2),
  wall(x, top, w, col));
const tent = (x: number, y: number, s = 1, col: string = CANVAS, flagC: string = ATK) => at(x, y, s,
  path('M-16 0 L0 -24 L16 0 Z', col, C.ink, 1.4), path('M0 -24 L-4 0 L4 0 Z', '#c9b98f', C.ink, 1), line('M0 -24 L0 -32', C.ink, 1.2), path('M0 -32 L7 -30 L0 -27.5 Z', flagC, C.ink, 0.8));
const palisade = (x: number, w: number, top: number, base = 112, col = WOOD) => all(...Array.from({ length: Math.floor(w / 7) }, (_, i) => path(`M${x + i * 7} ${base} L${x + i * 7} ${top + 4} L${x + i * 7 + 3} ${top} L${x + i * 7 + 6} ${top + 4} L${x + i * 7 + 6} ${base} Z`, col, C.ink, 1.1)), line(`M${x} ${f1(top + (base - top) * 0.35)} L${x + Math.floor(w / 7) * 7 - 1} ${f1(top + (base - top) * 0.35)}`, WOOD2, 1.6));
const bank = (x1: number, x2: number, h: number, base = 112, col = EARTH) => path(`M${x1} ${base} C${x1 + (x2 - x1) * 0.25} ${base - h} ${x1 + (x2 - x1) * 0.75} ${base - h} ${x2} ${base} Z`, col, C.ink, 1.4);
const flag = (x: number, base: number, hgt: number, col: string, wave = true) => all(lo(`M${x} ${base} L${x} ${base - hgt}`, WOOD2, 1.4), wave ? path(`M${x} ${base - hgt} C${x + 6} ${base - hgt - 3} ${x + 10} ${base - hgt + 3} ${x + 16} ${base - hgt} L${x + 16} ${base - hgt + 10} C${x + 10} ${base - hgt + 13} ${x + 6} ${base - hgt + 7} ${x} ${base - hgt + 10} Z`, col, C.ink, 1.2) : rect(x, base - hgt, 16, 10, col, 1, C.ink, 1.2));
const whiteFlag = (x: number, base: number, hgt: number) => flag(x, base, hgt, C.white);

// ── Things ───────────────────────────────────────────────────────────
const stone = (x: number, y: number, r = 5) => all(circle(x, y, r, '#9aa3ad', C.ink, 1.3), path(`M${f1(x - r * 0.4)} ${f1(y - r * 0.3)} L${f1(x + r * 0.2)} ${f1(y - r * 0.5)}`, 'none', '#c4cad0', 1.2));
const coin = (x: number, y: number, r = 4) => all(circle(x, y, r, GOLD, C.ink, 1.1), circle(x, y, r * 0.55, 'none', '#b88a20', 0.9));
const chest = (x: number, y: number, s = 1, open = true) => at(x, y, s,
  rect(-14, -12, 28, 12, WOOD, 1.5, C.ink, 1.4), line('M-14 -6 L14 -6', IRON, 1.6), rect(-2, -9, 4, 5, GOLD, 1, C.ink, 0.8),
  open ? all(coin(-7, -14, 3.6), coin(0, -15.5, 3.6), coin(7, -14, 3.6), coin(-3, -18, 3.2), coin(4, -18.5, 3.2), path('M-14 -12 L-12 -24 L16 -24 L14 -12', WOOD, C.ink, 1.4)) : path('M-14 -12 C-14 -19 14 -19 14 -12 Z', WOOD, C.ink, 1.4));
const sack = (x: number, y: number, s = 1, col = '#d9c08a') => at(x, y, s, path('M-8 10 C-11 0 -9 -6 -4 -8 L-5 -12 L5 -12 L4 -8 C9 -6 11 0 8 10 Z', col, C.ink, 1.3), line('M-5 -8.5 L5 -8.5', '#8a6a3a', 1.4));
const barrel = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 -11 C-10 -4 -10 4 -8 11 L8 11 C10 4 10 -4 8 -11 Z', WOOD, C.ink, 1.3), line('M-9 -5 L9 -5 M-9 5 L9 5', IRON, 1.4));
const bread = (x: number, y: number, s = 1) => at(x, y, s, path('M-10 4 C-12 -6 12 -6 10 4 Z', '#d9a05a', C.ink, 1.2), line('M-5 -1 L-2 -4 M1 -1 L4 -4', '#a0672d', 1.1));
const scroll = (x: number, y: number, s = 1) => at(x, y, s, rect(-8, -10, 16, 20, '#f6ecd2', 2, C.ink, 1.2), ...[-6, -2, 2].map((d) => line(`M-5 ${d} L5 ${d}`, '#8a7a6a', 1)), circle(0, 7, 3.4, '#c8372d', C.ink, 0.9));
const torch = (x: number, y: number, rot = 0, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, lo('M0 0 L0 -18', WOOD2, 2.4), path('M0 -32 C6 -25 7 -20 4 -17 C2 -15 -2 -15 -4 -17 C-7 -20 -5 -25 -2 -27 C-1 -24 0 -25 0 -32 Z', C.orange, C.ink, 1), path('M0 -24 C2 -21 2 -18 0 -17.5 C-2 -18 -2 -21 0 -24 Z', C.yellow, null));
const flame = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -16 C8 -6 12 0 10 6 C8 13 -8 13 -10 6 C-12 0 -6 -4 -4 -10 C-2 -4 0 -4 0 -16 Z', C.orange, C.ink, 1.2), path('M0 -2 C4 2 4 8 0 9 C-4 8 -4 2 0 -2 Z', C.yellow, null));
const smoke = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 C-6 -6 6 -10 0 -16 C-6 -22 6 -26 0 -32', 'none', '#9aa3ad', 2.4));
const key = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, circle(-10, 0, 6, 'none', GOLD, 3.4), circle(-10, 0, 6, 'none', C.ink, 0.8), lo('M-4 0 L14 0', GOLD, 3), line('M10 0 L10 5 M14 0 L14 5', GOLD, 2.6));
/** A ladder from (x1, y1) to (x2, y2). */
const ladder = (x1: number, y1: number, x2: number, y2: number, w = 9, col: string = WOOD) => {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy * w / 2, ny = ux * w / 2;
  const rungs = Array.from({ length: Math.floor(L / 9) }, (_, i) => { const cx = x1 + ux * (i + 0.6) * 9, cy = y1 + uy * (i + 0.6) * 9; return line(`M${f1(cx - nx)} ${f1(cy - ny)} L${f1(cx + nx)} ${f1(cy + ny)}`, col, 2); });
  return all(lo(`M${f1(x1 - nx)} ${f1(y1 - ny)} L${f1(x2 - nx)} ${f1(y2 - ny)}`, col, 2.2), lo(`M${f1(x1 + nx)} ${f1(y1 + ny)} L${f1(x2 + nx)} ${f1(y2 + ny)}`, col, 2.2), ...rungs);
};
const rope = (d: string) => line(d, '#7a5a2a', 3.2) + line(d, ROPE, 2);
const coil = (x: number, y: number, s = 1) => at(x, y, s, ...[14, 10.5, 7, 3.5].map((r) => ellipse(0, 0, r, r * 0.55, 'none', '#7a5a2a', 3.4)), ...[14, 10.5, 7, 3.5].map((r) => ellipse(0, 0, r, r * 0.55, 'none', ROPE, 2.2)), rope('M14 0 C18 4 22 6 28 6'));
/** Grappling hook: three prongs on a shaft, with the rope ring at (0,0). */
const grapnel = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, lo('M0 0 L0 14', IRON, 2.4), circle(0, -1.5, 2.4, 'none', IRON, 1.6), ...[-1, 0, 1].map((d) => lo(d === 0 ? 'M0 14 L0 22 C0 24 3 25 4 22' : `M0 14 C${d * 6} 16 ${d * 10} 14 ${d * 10} 8`, IRON, 2.2)));
const hourglass = (x: number, y: number, s = 1) => at(x, y, s, rect(-9, -16, 18, 3, WOOD, 1, C.ink, 1), rect(-9, 13, 18, 3, WOOD, 1, C.ink, 1), path('M-7 -13 L7 -13 L1 0 L7 13 L-7 13 L-1 0 Z', 'rgba(220,240,252,0.7)', C.ink, 1.2), path('M-4 -10 L4 -10 L0.6 -2 L-0.6 -2 Z', '#e8c870', null), path('M-6 12 L6 12 L0 5 Z', '#e8c870', null));
const check = (x: number, y: number, s = 1) => checkIcon(x, y, s, C.green);
const cross = (x: number, y: number, s = 1, col = '#c8372d') => line(`M${x - 6 * s} ${y - 6 * s} L${x + 6 * s} ${y + 6 * s} M${x + 6 * s} ${y - 6 * s} L${x - 6 * s} ${y + 6 * s}`, col, 2.8 * s);
const boom = (x: number, y: number, r = 10, col: string = C.yellow) => path(Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2, rr = i % 2 ? r * 0.5 : r; return `${i ? 'L' : 'M'}${f1(x + Math.cos(a) * rr)} ${f1(y + Math.sin(a) * rr)}`; }).join(' ') + ' Z', col, C.ink, 1.2);
const moon = (x: number, y: number, r = 6) => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${f1(x + r * 0.9)} ${f1(y + r * 0.4)} A${f1(r * 0.8)} ${f1(r * 0.8)} 0 1 1 ${x} ${y - r} Z`, '#f3e6a1', C.ink, 1.1);
const night = (...k: Svg[]) => all(rect(2, 2, 116, 112, NIGHT, 6, null), moon(100, 18, 7), ...k);
const pebbles = (x: number, y: number, n: number) => all(...Array.from({ length: n }, (_, i) => stone(x + (i % 4) * 7 - ((Math.floor(i / 4)) % 2) * 3, y - Math.floor(i / 4) * 5, 3.2)));
const cart = (x: number, y: number, s = 1, load: Svg = '') => at(x, y, s, rect(-14, -12, 28, 9, WOOD, 1.5, C.ink, 1.4), circle(-8, -1, 5, WOOD2, C.ink, 1.3), circle(8, -1, 5, WOOD2, C.ink, 1.3), circle(-8, -1, 1.4, C.ink, null), circle(8, -1, 1.4, C.ink, null), load);
const boat = (x: number, y: number, s = 1, sail: string | null = null) => at(x, y, s, path('M-18 -4 L18 -4 L12 4 L-12 4 Z', WOOD, C.ink, 1.4), sail ? all(lo('M0 -4 L0 -30', WOOD2, 1.4), path('M1 -28 L14 -8 L1 -8 Z', sail, C.ink, 1.1)) : '');
const plusSign = (x: number, y: number, r = 6, col: string = C.green) => line(`M${x - r} ${y} L${x + r} ${y} M${x} ${y - r} L${x} ${y + r}`, col, 3);

// ── Siege engines (local: ground y = 0) ──────────────────────────────
const wheel = (x: number, y: number, r = 6) => all(circle(x, y, r, WOOD2, C.ink, 1.3), line(`M${x - r + 1.5} ${y} L${x + r - 1.5} ${y} M${x} ${y - r + 1.5} L${x} ${y + r - 1.5}`, WOOD, 1.2));
/** Trebuchet. `cw` colours the counterweight box (for motvikt). */
const trebuchetL = (cw: string = '#6b5a44', thrown = false) => all(
  rect(-30, -8, 60, 6, WOOD, 1.5, C.ink, 1.4), path('M-22 -8 L0 -52 L22 -8', 'none', WOOD2, 4.2), path('M-22 -8 L0 -52 L22 -8', 'none', WOOD, 2.6), circle(0, -52, 2.6, IRON, C.ink, 1),
  thrown ? all(lo('M0 -52 L-12 -92', WOOD, 3.2), lo('M0 -52 L8 -38', WOOD, 3.2), rect(-2, -38, 18, 16, cw, 2, C.ink, 1.4))
    : all(lo('M0 -52 L36 -18', WOOD, 3.2), lo('M0 -52 L-11 -64', WOOD, 3.2), rect(-22, -68, 18, 16, cw, 2, C.ink, 1.4), line('M36 -18 C42 -10 48 -8 50 -6', '#7a5a2a', 1.4), stone(50, -8, 4)));
const ramL = () => all(path('M-30 -6 L-24 -40 L24 -40 L30 -6 Z', '#8a6a3a', C.ink, 1.5), path('M-30 -40 L0 -54 L30 -40 Z', '#6b5a44', C.ink, 1.5), ...[-18, -6, 6, 18].map((d) => line(`M${d} -40 L${d * 1.1} -8`, '#6b4a2a', 1.2)), wheel(-20, -4, 6), wheel(20, -4, 6),
  lo('M-26 -24 L48 -24', WOOD, 6), path('M46 -29 L56 -27 L58 -24 L56 -21 L46 -19 Z', IRON, C.ink, 1.3), line('M-6 -40 L-6 -27 M18 -40 L18 -27', '#7a5a2a', 1.2));
const towerL = () => all(rect(-18, -96, 36, 92, '#8a6a3a', 1, C.ink, 1.6), ...[-80, -60, -40, -20].map((y) => line(`M-18 ${y} L18 ${y}`, '#6b4a2a', 1.3)), ...[-8, 8].map((x) => line(`M${x} -96 L${x} -4`, '#6b4a2a', 1)),
  ...[-16, -6, 4, 12].map((x) => rect(x, -103, 5, 7, '#8a6a3a', 0.5, C.ink, 1.1)), wheel(-12, -4, 7), wheel(12, -4, 7), rect(-6, -76, 12, 12, '#4a3a2e', 1, null));
const ballistaL = (bolt = true) => all(path('M-14 0 L0 -18 L14 0', 'none', WOOD2, 3.4), rect(-24, -24, 50, 6, WOOD, 1.5, C.ink, 1.3), path('M14 -38 C4 -28 4 -14 14 -4', 'none', WOOD2, 3.2), line('M14 -38 L-20 -21 L14 -4', '#7a5a2a', 1.2), bolt ? all(lo('M-20 -21 L30 -21', WOOD, 1.8), path('M30 -24 L37 -21 L30 -18 Z', C.silver, C.ink, 1)) : '');
const bolt = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, lo('M-18 0 L14 0', WOOD, 1.8), path('M14 -3 L21 0 L14 3 Z', C.silver, C.ink, 1), path('M-18 0 L-22 -4 M-18 0 L-22 4', 'none', '#c8372d', 1.6));
const arrowShaft = (x1: number, y1: number, x2: number, y2: number) => { const a = Math.atan2(y2 - y1, x2 - x1), hx = Math.cos(a), hy = Math.sin(a); return all(line(`M${x1} ${y1} L${x2} ${y2}`, WOOD2, 1.4), path(`M${f1(x2 + hx * 4)} ${f1(y2 + hy * 4)} L${f1(x2 - hy * 2.4)} ${f1(y2 + hx * 2.4)} L${f1(x2 + hy * 2.4)} ${f1(y2 - hx * 2.4)} Z`, C.silver, C.ink, 0.8)); };
/** Dashed flight path. */
const arc = (d: string, col: string = HL) => line(d, col, 1.8, '4 3');

// ── Top-down maps ────────────────────────────────────────────────────
const mapBg = (col = '#e6efd6') => rect(4, 6, 112, 104, col, 6, C.ink, 1.4);
const topTown = (cx: number, cy: number, r: number, col: string = STONE) => all(circle(cx, cy, r, '#efe7d6', null), circle(cx, cy, r, 'none', C.ink, 4.6), circle(cx, cy, r, 'none', col, 3),
  ...[[-0.4, -0.3], [0.3, -0.35], [-0.2, 0.35], [0.35, 0.25]].map(([a, b]) => rect(cx + a! * r - r * 0.13, cy + b! * r - r * 0.13, r * 0.26, r * 0.26, ROOF, 1, C.ink, 0.8)));
const ring = (cx: number, cy: number, r: number, col: string, w = 3, dash?: string) => all(circle(cx, cy, r, 'none', C.ink, w + 1.6), `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${col}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`);
const radialArrows = (cx: number, cy: number, r1: number, r2: number, n: number, col: string, off = 0) => all(...Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + off; return arrow(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, cx + Math.cos(a) * r2, cy + Math.sin(a) * r2, col, 2.4); }));
const dotTent = (x: number, y: number, col: string = ATK) => path(`M${x - 4} ${y + 3} L${x} ${y - 4} L${x + 4} ${y + 3} Z`, CANVAS, col, 1.2);

export const SIEGE_MOTIFS: Record<string, Svg> = {
  // 2021 Belägringens mål
  'beläg.strategisk': all(mapBg(), path('M4 64 C30 58 44 70 60 62 C78 54 92 66 116 60 L116 72 C92 78 78 66 60 74 C44 82 30 70 4 76 Z', WATER, C.ink, 1.2),
    line('M60 10 L60 106 M8 30 L112 100', '#c9a66b', 3), castleS(60, 64, 0.42), ring(60, 56, 22, HL, 2.4), greyed(castleS(98, 34, 0.32)), greyed(castleS(20, 104, 0.3))),
  'beläg.knutpunkt': all(mapBg(), ...['M60 58 L60 8', 'M60 58 L112 30', 'M60 58 L110 102', 'M60 58 L14 104', 'M60 58 L8 26'].map((d) => all(line(d, C.ink, 7), line(d, '#e8d7a8', 5))),
    circle(60, 58, 14, '#efe7d6', C.ink, 1.6), house(55, 62, 0.5), house(65, 60, 0.5, '#b0473a'), cart(28, 40, 0.5), cart(92, 92, 0.5), cart(96, 42, 0.5), cart(34, 92, 0.5)),
  'beläg.vadställe': all(rect(4, 80, 112, 32, WATER, 2, null), path('M4 80 C20 80 30 74 44 74 L44 80 Z', GRASS, null), rect(4, 66, 30, 14, GRASS, 2, null), rect(86, 66, 30, 14, GRASS, 2, null),
    path('M40 112 L44 92 L76 92 L80 112 Z', '#d9c99a', null), soldier(60, 0.62, ATK), rect(30, 98, 60, 14, 'rgba(159,208,234,0.75)', 1, null), line('M4 98 C30 95 60 101 116 97', '#5a8fb0', 1.4),
    rect(4, 98, 30, 14, '#6fa9cc', 1, null), rect(86, 98, 30, 14, '#6fa9cc', 1, null), check(60, 44, 1.2)),
  'beläg.skattkammare': all(rect(4, 8, 112, 104, '#7d6f62', 4, C.ink, 1.4), rect(4, 96, 112, 16, '#6b5e52', 1, null), ...[20, 50, 80].map((x) => rect(x, 8, 2, 88, '#6b5e52', 0, null)),
    chest(30, 104, 1.1), chest(86, 104, 1), path('M54 80 L58 62 L66 62 L70 80 Z', GOLD, C.ink, 1.3), ellipse(62, 62, 6, 2, GOLD, C.ink, 1), rect(56, 80, 12, 4, GOLD, 1, C.ink, 1),
    g('translate(60 40)', path('M-14 6 L-15 -10 L-7 -2 L0 -14 L7 -2 L15 -10 L14 6 Z', GOLD, C.ink, 1.4), rect(-14, 4, 28, 5, GOLD, 1, C.ink, 1.2), circle(0, 6.5, 1.6, '#c8372d', null)), sparkle(30, 70, 5), sparkle(94, 60, 5), sparkle(78, 30, 4)),
  'beläg.underkasta-sig': all(king(84, 0.95, '#7b3fa0', 'calm'), kneel(36, 0.85, DEF, '#4a4038'), sword(60, 108, 90, 0.9), ground),
  'beläg.herravälde': all(mapBg('#dfeaf2'), path('M4 30 C30 34 40 20 60 26 C80 32 96 18 116 24 L116 110 L4 110 Z', '#e6efd6', C.ink, 1.2),
    ...[[22, 60], [50, 82], [80, 64], [100, 92], [30, 96]].map(([x, y]) => all(house(x!, y!, 0.55), flag(x! + 6, y! - 8, 14, '#7b3fa0'))), boat(40, 18, 0.5, '#7b3fa0'), boat(88, 14, 0.5, '#7b3fa0'),
    g('translate(62 44) scale(0.9)', path('M-14 6 L-15 -10 L-7 -2 L0 -14 L7 -2 L15 -10 L14 6 Z', GOLD, C.ink, 1.6), rect(-14, 4, 28, 5, GOLD, 1, C.ink, 1.4))),
  'beläg.övertag': all(wall(54, 62, 62), shift(0, -50, soldier(86, 0.5, DEF, 'smile')), greyed(soldier(26, 0.55, C.grey)), arrow(76, 38, 40, 70, DEF, 2.6), ground),
  'beläg.utdragen': all(tent(26, 112, 1.1), line('M14 104 C18 90 30 96 26 104', '#e2e2e2', 1), ...[0, 1, 2, 3, 4].map((i) => g(`translate(${54 + i * 11} ${40 + i * 4}) rotate(${i * 6 - 10})`, rect(-9, -10, 18, 20, C.white, 2, C.ink, 1.2), rect(-9, -10, 18, 5, '#c8372d', 2, C.ink, 1))),
    rect(14, 18, 92, 8, C.white, 3, C.ink, 1.2), rect(14, 18, 92, 8, HL, 3, null), greyed(rect(14, 6, 24, 6, C.grey, 3, C.ink, 1)), hourglass(96, 92, 1.1), ground),

  // 2022 Omringa och avskära
  'beläg.avskära': all(town(4, 40, 70), line('M44 104 L116 104', '#c9a66b', 7), cart(104, 104, 0.8, sack(0, -18, 0.6)), rect(66, 92, 6, 20, WOOD, 1, C.ink, 1.2), rect(58, 94, 22, 4, WOOD, 1, C.ink, 1.1), soldier(80, 0.55, ATK), cross(69, 80, 1.1), ground),
  'beläg.blockad': all(rect(4, 70, 112, 42, WATER, 2, null), town(4, 46, 62), ...[56, 76, 96].map((x, i) => boat(x, 82 + (i % 2) * 6, 0.72, ATK)), boat(104, 104, 0.5), cross(92, 104, 0.8), line('M50 96 L116 96', '#5a8fb0', 1, '3 3')),
  'beläg.tillförsel': all(town(70, 46, 70), gate(93, 12, 22), line('M4 106 L80 106', '#c9a66b', 6), cart(20, 106, 0.8, all(sack(-4, -18, 0.55), barrel(6, -18, 0.45))), cart(50, 106, 0.8, sack(0, -18, 0.6)), arrow(30, 70, 80, 70, C.green, 3), ground),
  'beläg.ransonera': all(townsman(28, 0.9, DEF, 'calm'), reach(28, 0.9, 1, 46, 66), bread(52, 64, 0.5), sack(16, 100, 1, '#e6d3b3'), ...[66, 84, 102].map((x, i) => all(fig(x, ['#c96b3c', '#5a8a5a', '#b07aa1'][i]!, 'calm', { h: 0.62 }))), bread(62, 82, 0.35), ground),
  'beläg.svälta-ut': all(town(30, 60, 70), ...[34, 46].map((x) => tent(x - 22, 112, 0.6)), tent(106, 112, 0.6), soldier(14, 0.42, ATK), soldier(104, 0.42, ATK), g('translate(60 34)', ellipse(0, 0, 14, 5, C.white, C.ink, 1.3), ellipse(0, -1, 9, 2.6, '#f3f3f0', null)), hourglass(98, 30, 0.9), ground),
  'beläg.budbärare': night(wall(4, 60, 30, '#8f887c'), townsman(66, 0.72, '#5a6a80', 'calm'), reach(66, 0.72, 1, 82, 70), scroll(86, 70, 0.7), motion(52, 74, 1, 3, 10), greyed(soldier(104, 0.55, C.grey)), line('M4 112 L116 112', '#5a6478', 2)),
  'beläg.smuggla': night(rect(2, 84, 116, 30, '#3f5a80', 2, null), boat(54, 90, 1.3), sack(42, 82, 0.6), sack(54, 82, 0.6), path('M34 84 L76 84 L72 76 L38 76 Z', 'rgba(220,210,170,0.5)', C.ink, 1), ...[42, 50, 58, 66].map((x) => line(`M${x} 77 L${x - 2} 84`, C.ink, 0.6)),
    shift(-4, -20, peasant(74, 0.5, '#5a6a80', 'calm')), wall(92, 50, 26, '#8f887c', 84)),
  'beläg.isolerad.2': all(rect(4, 6, 112, 104, WATER, 6, C.ink, 1.4), ellipse(60, 60, 30, 22, '#e6efd6', C.ink, 1.4), topTown(60, 60, 14), ...[[60, 36, 60, 14], [90, 60, 112, 60], [60, 82, 60, 106], [30, 60, 8, 60]].map(([a, b, c, d]) => all(line(`M${a} ${b} L${c} ${d}`, '#c9a66b', 4), cross((a! + c!) / 2, (b! + d!) / 2, 0.8)))),
  'beläg.utfall.2': all(wall(4, 46, 40), archDoor(24, 16, 30, '#3a2e26'), soldier(52, 0.62, DEF, 'angry'), soldier(70, 0.62, DEF, 'angry'), arrow(46, 44, 100, 44, DEF, 3), tent(104, 112, 0.8), greyed(soldier(96, 0.5, C.grey)), ground),

  // 2023 Kontravallationslinjer och kringvärn
  'beläg.befästning': all(path('M12 112 L18 70 L42 60 L60 70 L78 60 L102 70 L108 112 Z', STONE, C.ink, 1.6), ...[18, 42, 60, 78, 102].map((x, i) => rect(x - 6, i % 2 ? 50 : 60, 12, i % 2 ? 62 : 52, STONE, 1, C.ink, 1.4)),
    ...[18, 42, 60, 78, 102].map((x, i) => all(...[-6, 0].map((d) => rect(x + d, (i % 2 ? 50 : 60) - 5, 5, 5, STONE, 0.5, C.ink, 1)))), gate(60, 14, 22), flag(42, 50, 20, DEF), ground),
  'beläg.löpgrav': all(rect(4, 70, 112, 42, EARTH, 2, null), line('M4 70 L116 70', C.ink, 1.4), path('M30 70 L30 112 L76 112 L76 70', '#7a5a3a', C.ink, 1.4), soldier(53, 0.5, ATK), bank(14, 34, 10, 70), bank(72, 96, 10, 70), wall(92, 28, 24), arrowShaft(110, 20, 82, 40), ground),
  'beläg.påle': all(rect(4, 104, 112, 8, EARTH, 2, null), lo('M60 104 L60 52', WOOD, 8), path('M56 104 L60 112 L64 104 Z', WOOD, C.ink, 1.1), peasant(92, 0.72, '#b98a52', 'calm'), reach(92, 0.72, -1, 72, 46), lo('M72 46 L64 34', WOOD2, 3), rect(56, 26, 14, 10, WOOD2, 2, C.ink, 1.2), motion(60, 44, -1, 2, 8), ground),
  'beläg.palissad': all(rect(4, 104, 112, 8, EARTH, 2, null), palisade(10, 100, 40), ground),
  'beläg.förskansa-sig': all(bank(4, 82, 34), palisade(16, 56, 52, 92), soldier(96, 0.6, DEF, 'calm'), ...[[30, 30], [52, 24]].map(([x, y]) => arrowShaft(x! - 18, y! - 10, x!, y!)), lo('M106 112 L112 80', WOOD, 2), path('M108 112 L116 112 L114 104 L110 104 Z', IRON, C.ink, 1), ground),
  'beläg.skans': all(path('M4 112 C30 90 90 90 116 112 Z', GRASS, C.ink, 1.4), path('M30 100 L36 78 L84 78 L90 100 Z', EARTH, C.ink, 1.5), palisade(38, 44, 66, 80), flag(60, 66, 22, DEF), soldier(44, 0.32, DEF), ground),
  'beläg.kontravallation': all(mapBg(), topTown(60, 58, 16), ring(60, 58, 36, ATK, 3.4), ...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return dotTent(60 + Math.cos(a) * 43, 58 + Math.sin(a) * 43); }), radialArrows(60, 58, 32, 22, 6, ATK, 0.5)),
  'beläg.cirkumvallation': all(mapBg(), topTown(60, 58, 13), greyed(ring(60, 58, 26, C.grey, 2.4)), ring(60, 58, 40, ATK, 3.4), radialArrows(60, 58, 43, 52, 6, ATK, 0.5), g('translate(104 16)', ...[0, 6, 12].map((d) => path(`M${d - 4} 4 L${d} -3 L${d + 4} 4 Z`, DEF, C.ink, 1))), arrow(100, 24, 92, 32, DEF, 2.4)),
  'beläg.kringvärn': all(mapBg(), ring(60, 58, 28, STONE2, 5), circle(60, 58, 24, '#efe7d6', null), ...[[-8, -6], [8, -6], [0, 8]].map(([a, b]) => dotTent(60 + a!, 58 + b!, DEF)),
    ...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return all(arrow(60 + Math.cos(a) * 50, 58 + Math.sin(a) * 50, 60 + Math.cos(a) * 36, 58 + Math.sin(a) * 36, C.grey, 2), cross(60 + Math.cos(a) * 33, 58 + Math.sin(a) * 33, 0.45)); })),
  'beläg.försvarslinje': all(bank(4, 116, 18), ...[16, 36, 56, 76, 96].map((x) => all(soldier(x, 0.52, DEF, 'calm'), shield(x + 6, 92, 0.7, DEF))), ...[22, 50, 80].map((x) => arrowShaft(x + 10, 20, x, 40)), line('M6 52 L114 52', HL, 2, '5 4')),
  'beläg.omsluta': all(ellipse(60, 80, 54, 28, '#e6efd6', null), church(66, 96, 0.8), path('M10 86 C10 52 110 52 110 86 C110 110 10 110 10 86 Z', 'none', C.ink, 7), path('M10 86 C10 52 110 52 110 86 C110 110 10 110 10 86 Z', 'none', STONE, 5), ground),

  // 2024 Stormstegar och änterhakar
  'beläg.stormstege': all(wall(70, 22, 46), ladder(34, 112, 76, 22, 11), shift(16, -40, soldier(40, 0.48, ATK)), soldier(20, 0.55, ATK), ground),
  'beläg.hake': all(rect(4, 6, 112, 106, '#e9dfcd', 4, null), rect(36, 40, 48, 8, WOOD, 2, C.ink, 1.3), lo('M60 48 L60 60 C60 70 72 70 72 60', IRON, 3.2), key(70, 80, 0.9, 90), rect(16, 72, 10, 40, WOOD, 1, C.ink, 1.2), circle(60, 44, 2, C.ink, null)),
  'beläg.änterhake': all(grapnel(60, 38, 2.2), rope('M60 34 C56 20 70 14 76 8'), ground, coil(40, 100, 0.9)),
  'beläg.lina': all(coil(56, 80, 2.2), ground),
  'beläg.haka-fast': all(wall(4, 52, 112), grapnel(60, 46, 1.6, 180), rope('M60 50 C62 70 54 90 58 112'), ring(60, 34, 14, HL, 2.2)),
  'beläg.klänga': all(wall(60, 8, 56), rope('M66 2 L66 112'), shift(0, -30, soldier(54, 0.62, ATK, 'frown')), circle(64, 34, 3, C.skin, C.ink, 1.2), circle(68, 44, 3, C.skin, C.ink, 1.2), ground),
  'beläg.bestiga': all(path('M8 112 L60 30 L112 112 Z', '#a9b0a0', C.ink, 1.6), path('M50 46 L60 30 L70 46 L64 42 L58 48 Z', C.white, C.ink, 1), arc('M24 108 C40 90 34 70 52 56'), shift(4, -80, soldier(56, 0.36, ATK, 'laugh')), flag(66, 32, 18, ATK)),
  'beläg.fotfäste': all(wall(36, 4, 80), rect(36, 80, 50, 6, STONE2, 1, C.ink, 1.3), g('translate(62 74)', path('M-14 -4 L10 -4 C14 -4 16 0 14 6 L-14 6 Z', C.black, C.ink, 1.4), rect(-14, -40, 12, 36, '#5a4a3a', 2, C.ink, 1.4)), check(98, 70, 1.4), greyed(g('translate(18 96) rotate(30)', path('M-10 -4 L8 -4 C12 -4 12 4 8 6 L-10 6 Z', C.black, C.ink, 1.2))), motion(18, 84, 1, 2, 6), ground),
  'beläg.hiva': all(wall(70, 30, 46), peasant(42, 0.8, '#b98a52', 'frown', { muscle: true }), reach(42, 0.8, -1, 34, 34), reach(42, 0.8, 1, 50, 34), stone(42, 26, 11), ...[30, 54].map((x) => line(`M${x} 18 L${x} 10`, C.grey, 1.6)), ground),
  'beläg.störta': all(path('M4 112 L4 30 L40 30 L44 112 Z', '#a9b0a0', C.ink, 1.6), stone(70, 58, 9), arc('M42 30 C58 30 66 40 70 48', C.grey), ...[0, 1, 2].map((i) => line(`M${62 + i * 8} ${44 - i * 2} L${60 + i * 8} ${32 - i * 2}`, C.grey, 1.6)), boom(86, 106, 10, '#e6d3b3'), stone(86, 104, 5), ground),
  'beläg.forcera': all(rect(52, 34, 12, 78, STONE, 1, C.ink, 1.4), rect(88, 34, 12, 78, STONE, 1, C.ink, 1.4), ...[[66, 64, -20], [74, 82, 30], [84, 60, -40]].map(([x, y, r]) => g(`translate(${x} ${y}) rotate(${r})`, rect(-3, -14, 6, 28, WOOD, 1, C.ink, 1.2))), soldier(30, 0.62, ATK, 'angry'), soldier(48, 0.62, ATK, 'angry'), arrow(56, 54, 110, 54, ATK, 3.4), ground),
  'beläg.avvärja': all(soldier(78, 0.8, DEF, 'calm'), reach(78, 0.8, -1, 60, 54), shield(58, 56, 1.5, DEF), ...[[20, 40, 36, 46], [16, 64, 34, 62], [22, 84, 36, 76]].map(([a, b, c, d]) => arrowShaft(a!, b!, c!, d!)), ...[[42, 44], [40, 64], [42, 80]].map(([x, y]) => boom(x!, y!, 4, C.white)), ground),

  // 2025 Belägringsmaskiner
  'beläg.belägringsmaskin': all(wall(92, 40, 24), at(30, 112, 0.6, trebuchetL()), at(58, 112, 0.5, ramL()), at(80, 112, 0.6, towerL()), ground),
  'beläg.blida': all(at(52, 112, 1.2, trebuchetL()), ground),
  'beläg.motvikt': all(at(66, 112, 1.2, trebuchetL(HL)), ring(42, 41, 18, HL, 2.2), ground),
  'beläg.slunga-verb': all(at(28, 112, 0.8, trebuchetL('#6b5a44', true)), arc('M18 38 C40 0 80 0 104 40'), stone(106, 46, 5), motion(100, 40, 1, 3, 8), ground),
  'beläg.murbräcka': all(wall(92, 30, 24), gate(104, 18, 34), at(50, 112, 1, ramL()), boom(98, 86, 6, C.white), ground),
  'beläg.belägringstorn': all(wall(84, 48, 32), at(54, 112, 0.75, towerL()), path('M67 42 L88 46 L88 49 L67 45 Z', WOOD, C.ink, 1.2), shift(0, -72, soldier(50, 0.34, ATK)), ground),
  'beläg.ballista': all(at(54, 108, 1.4, ballistaL()), ground),
  'beläg.projektil': all(rect(4, 6, 112, 106, '#e8f2f8', 4, null), arc('M8 100 C30 30 70 20 96 40', C.grey), stone(96, 40, 8), motion(86, 34, 1, 3, 10), arc('M8 80 C40 60 70 60 104 76', C.grey), bolt(96, 74, 0.8, 18)),
  'beläg.avfyra': all(at(40, 108, 1.1, ballistaL(false)), bolt(92, 82, 0.9), motion(74, 76, 1, 3, 12), soldier(16, 0.58, ATK, 'calm'), reach(16, 0.58, 1, 28, 82), boom(46, 84, 7, C.white), ground),
  'beläg.slagkraft': all(wall(62, 22, 54), path('M84 52 L78 64 L88 72 L80 86 M84 52 L96 60 L92 74', 'none', C.ink, 1.6), boom(80, 60, 18, C.yellow), stone(70, 58, 10), motion(56, 54, 1, 3, 14), greyed(all(stone(26, 98, 4), arc('M30 90 C34 84 38 84 40 92', C.grey))), ground),
  'beläg.splittra': all(rect(40, 30, 12, 82, STONE, 1, C.ink, 1.4), rect(92, 30, 12, 82, STONE, 1, C.ink, 1.4), ...[[62, 62, -30], [70, 50, 20], [80, 70, -60], [66, 84, 50], [82, 92, 10], [74, 38, -10]].map(([x, y, r]) => g(`translate(${x} ${y}) rotate(${r})`, path('M-2 -9 L2 -8 L3 0 L1 9 L-2 7 Z', WOOD, C.ink, 1))), stone(28, 60, 9), motion(16, 56, 1, 3, 10), boom(72, 64, 14, '#f7e7b0'), ground),
  'beläg.bräsch': all(path('M4 112 L4 30 L44 30 L48 52 L56 70 L66 74 L76 62 L80 40 L78 30 L116 30 L116 112 Z', STONE, C.ink, 1.6), ...[4, 14, 24, 34, 82, 92, 102].map((x) => rect(x + 2, 24, 6, 6.5, STONE, 0.5, C.ink, 1.2)), pebbles(50, 108, 12), ring(62, 56, 22, HL, 2.2), ground),

  // 2026 Stormning och plundring
  'beläg.stormning': all(wall(78, 30, 38), ladder(52, 112, 82, 30, 9), soldier(16, 0.5, ATK, 'angry'), soldier(34, 0.5, ATK, 'angry'), soldier(58, 0.5, ATK, 'angry'), shift(12, -40, soldier(56, 0.4, ATK, 'angry')), flag(8, 70, 26, ATK), motion(10, 84, 1, 2, 6), ground),
  'beläg.tränga-in': all(path('M4 112 L4 30 L52 30 L52 112 Z', STONE, C.ink, 1.6), path('M74 112 L74 30 L116 30 L116 112 Z', STONE, C.ink, 1.6), ...[6, 16, 26, 38, 76, 86, 96, 106].map((x) => rect(x + 2, 24, 6, 6.5, STONE, 0.5, C.ink, 1.2)), pebbles(54, 110, 6), soldier(62, 0.62, ATK, 'angry'), arrow(36, 60, 96, 60, ATK, 3), ground),
  'beläg.plundring': all(house(30, 112, 2.2), house(92, 112, 1.6, '#b0473a'), soldier(52, 0.6, ATK, 'smile'), reach(52, 0.6, 1, 64, 76), sack(68, 80, 0.8), soldier(102, 0.5, ATK, 'smile'), chest(100, 70, 0.5, false), ground),
  'beläg.krigsbyte': all(cart(66, 108, 1.6, all(chest(-4, -14, 0.6), sack(8, -20, 0.5), g('translate(-12 -26)', path('M-6 6 C-6 -4 6 -4 6 6 Z', '#c9a040', C.ink, 1.1), line('M0 -3 L0 -6', C.ink, 1.2)))), sword(18, 106, 20, 0.9), soldier(104, 0.55, ATK, 'smile'), flag(28, 70, 30, ATK), ground),
  'beläg.sätta-eld-på': all(house(80, 112, 2.6, '#d9b45a'), flame(70, 46, 0.9), smoke(72, 30, 0.6), soldier(28, 0.7, ATK, 'angry'), reach(28, 0.7, 1, 50, 62), torch(50, 64, 30, 0.9), ground),
  'beläg.skövla': all(rect(4, 76, 112, 36, '#8a7a5a', 2, null), ...[20, 46, 74, 100].map((x) => all(rect(x - 2, 86, 4, 18, '#4a3a2a', 1, C.ink, 0.8), line(`M${x} 92 L${x + 6} 86 M${x} 96 L${x - 5} 90`, '#4a3a2a', 1.4))), house(60, 76, 1.4, '#6b5e52', '#9a9080'), smoke(54, 48, 0.8), smoke(66, 50, 0.7), flame(96, 104, 0.5), ...[30, 84].map((x) => flame(x, 106, 0.4)), ground),
  'beläg.tillflykt': all(church(76, 112, 1.25), peasant(30, 0.55, '#b98a52', 'shock'), townsman(48, 0.55, '#5a8a5a', 'shock', { hairStyle: 'long' }), arrow(14, 78, 62, 92, C.green, 3), ground),
  'beläg.skona': all(soldier(84, 0.85, ATK, 'calm'), sword(98, 108, 160, 0.8), reach(84, 0.85, -1, 66, 58), g('translate(64 56) scale(1.1)', ...[-4.6, -1.6, 1.4, 4.4].map((d) => rect(d - 1.3, -9, 2.6, 9, C.skin, 1.3, C.ink, 0.9)), path('M-5.5 -1 L5.5 -1 L5 5 C4 8 -4 8 -5 5 Z', C.skin, C.ink, 1)), kneel(26, 0.6, '#5a8a5a', '#4a4038'), fig(44, '#b07aa1', 'frown', { h: 0.45, hairStyle: 'long' }), check(104, 22, 1.3), ground),
  'beläg.brandskatt': all(townsman(30, 0.8, '#5a8a5a', 'frown'), reach(30, 0.8, 1, 48, 80), chest(56, 92, 0.9), soldier(88, 0.8, ATK, 'smile'), torch(100, 76, 160, 0.8), cross(104, 52, 0.8), house(56, 40, 1.1), ground),
  'beläg.segrare': all(path('M24 112 L40 74 L80 74 L96 112 Z', GRASS, C.ink, 1.4), shift(0, -38, soldier(60, 0.6, ATK, 'laugh')), reach(60, 0.6, 1, 74, 18), flag(74, 30, 20, ATK), greyed(soldier(16, 0.45, C.grey, 'frown')), greyed(soldier(104, 0.45, C.grey, 'frown')), ground),

  // 2027 Kapitulation och undsättning
  'beläg.kapitulation': all(town(54, 62, 60), whiteFlag(100, 54, 30), soldier(18, 0.5, DEF, 'frown'), soldier(40, 0.5, DEF, 'frown'), ...[[22, 108, 70], [32, 110, 100], [42, 107, 120]].map(([x, y, r]) => sword(x!, y!, r!, 0.7)), shield(30, 100, 0.6, DEF), ground),
  'beläg.vit-flagga': all(lo('M48 112 L48 18', WOOD2, 3), path('M48 18 C62 12 74 26 92 18 L92 50 C74 58 62 44 48 50 Z', C.white, C.ink, 1.8), ground),
  'beläg.parlamentär': all(wall(4, 40, 34), archDoor(22, 14, 26, '#3a2e26'), townsman(58, 0.7, DEF, 'calm'), reach(58, 0.7, 1, 70, 60), whiteFlag(70, 64, 34), tent(100, 112, 0.9), arc('M44 108 L86 108'), ground),
  'beläg.fri-lejd': all(wall(4, 40, 26), archDoor(16, 12, 24, '#3a2e26'), soldier(40, 0.5, DEF, 'smile'), soldier(56, 0.5, DEF, 'smile'), arc('M30 108 C60 100 84 100 114 106', C.green), greyed(soldier(88, 0.55, C.grey)), greyed(soldier(108, 0.55, C.grey)), scroll(66, 30, 0.9), check(84, 26, 1.1)),
  'beläg.gisslan': all(tent(98, 112, 1.1), townsman(26, 0.58, '#5a8a5a', 'frown'), townsman(44, 0.58, '#c96b3c', 'frown'), townsman(62, 0.58, '#5a6a80', 'frown'), soldier(84, 0.62, ATK, 'calm'), spear(76, 52), scroll(20, 30, 0.8), arrow(30, 30, 80, 30, C.grey, 2.4)),
  'beläg.överlämna': all(townsman(34, 0.85, '#5a8a5a', 'calm'), king(88, 0.85, '#7b3fa0', 'smile'), reach(34, 0.85, 1, 54, 64), reach(88, 0.85, -1, 70, 64), rect(50, 62, 22, 6, '#c8372d', 3, C.ink, 1.2), key(61, 56, 0.6), ground),
  'beläg.förstärkning': all(soldier(18, 0.5, DEF, 'smile'), soldier(34, 0.5, DEF, 'smile'), ...[60, 76, 92, 108].map((x) => soldier(x, 0.5, DEF, 'calm')), arrow(110, 34, 66, 34, C.green, 3), plusSign(48, 34, 7), flag(96, 70, 20, DEF), ground),
  'beläg.undsätta': all(town(4, 46, 74), tent(62, 112, 0.6), greyed(soldier(74, 0.45, C.grey, 'shock')), arrow(78, 70, 54, 70, C.grey, 2), ...[96, 110].map((x) => soldier(x, 0.5, DEF, 'angry')), flag(102, 58, 22, DEF), arrow(98, 44, 66, 56, DEF, 3), ground),
  'beläg.undsättning': all(path('M60 112 C76 72 104 72 118 112 Z', GRASS, C.ink, 1.4), ...[84, 96, 108].map((x) => all(lo(`M${x} 84 L${x} 66`, WOOD2, 1.2), path(`M${x} 66 L${x + 8} 68 L${x} 71 Z`, DEF, C.ink, 0.8))), flame(94, 64, 0.5), wall(4, 64, 48), shift(0, -48, fig(16, DEF, 'laugh', { h: 0.42 }), fig(32, '#5a8a5a', 'laugh', { h: 0.42, hairStyle: 'long' })), reach(16, 0.42, 1, 22, 14), ground),
  'beläg.dra-sig-tillbaka': all(castleS(26, 112, 0.8), soldier(66, 0.55, ATK, 'frown'), soldier(86, 0.55, ATK, 'frown'), g('translate(104 96) rotate(-70)', line('M0 -5 L40 -5 M0 5 L40 5', WOOD, 2), ...[6, 16, 26, 36].map((d) => line(`M${d} -5 L${d} 5`, WOOD, 1.6))), arrow(74, 30, 112, 30, ATK, 3), ground),
};
