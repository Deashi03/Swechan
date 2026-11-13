/**
 * Historia & humaniora → Militärhistoria → Världskrigen, 2041–2047 (0.37): trenches and front lines, tanks and
 * mechanisation, the air war, sea battles and submarines, landings, logistics and civilians in war. The
 * pictures share a few signs: own soldiers in olive with olive helmets, the other side in grey-blue, warships
 * and machines in steel grey on light-blue water, top-down maps on pale land, and a grey reference for the
 * abstract words. War is shown through objects, machines and motion: no wounds, no bodies and no national
 * symbols. Digits only; no words in the pictures and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm, bolt } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Colours ──────────────────────────────────────────────────────────
const OLIVE = '#7d7f4a';
const OLIVE2 = '#5f6138';
const FOE = '#7a8aa0';
const FOE2 = '#56657a';
const STEEL = '#8d949c';
const STEEL2 = '#6b737c';
const SEA = '#9fd0ea';
const SEA2 = '#6aaed6';
const SAND = '#ead49c';
const MUD = '#9a7650';
const MUD2 = '#7a5a38';
const CONC = '#bdbdb3';
const NIGHT = '#2d3550';
const LAND = '#e8e0c8';
const GAS = '#c9d36a';
const SACK = '#d6c08a';
const WOOD = '#a8743f';
const f1 = (n: number) => n.toFixed(1);

// ── Figures ──────────────────────────────────────────────────────────
const ground = line('M4 112 L116 112', C.grey2, 2);
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number, skin: string = C.skin) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, 3 * Math.max(0.6, h), skin, C.ink, 1.2)); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const atf = (x: number, y: number, s: number, flip: boolean, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`, ...k);
const shift = (dx: number, dy: number, ...k: Svg[]) => g(`translate(${dx} ${dy})`, ...k);
const helmL = (col: string = OLIVE2) => all(ellipse(0, -63, 15, 3.4, col, C.ink, 1.3), path('M-9.5 -63 C-9.5 -74 9.5 -74 9.5 -63 Z', col, C.ink, 1.3));
const maskL = () => all(ellipse(0, -53, 8.5, 8, '#6b6f5a', C.ink, 1.2), circle(-3.6, -56, 2.6, '#cfe6f2', C.ink, 0.9), circle(3.6, -56, 2.6, '#cfe6f2', C.ink, 0.9), circle(0, -47.5, 3, '#4a4d40', C.ink, 1), line('M0 -44.5 C2 -38 8 -36 8 -28', '#4a4d40', 2.4));
/** Own soldier (olive) or the other side (grey-blue), with a helmet. */
const soldier = (x: number, h = 1, mood: Mood = 'calm', foe = false, more: Partial<Build> = {}) => all(fig(x, foe ? FOE : OLIVE, mood, { h, bottom: foe ? FOE2 : OLIVE2, ...more }), on(x, h, helmL(foe ? FOE2 : OLIVE2)));
const civ = (x: number, h: number, top: string, mood: Mood = 'calm', more: Partial<Build> = {}) => fig(x, top, mood, { h, ...more });
/** Small head-and-helmet seen over a parapet. */
const helmHead = (x: number, y: number, s = 1, foe = false) => at(x, y, s, circle(0, 0, 6, C.skin, C.ink, 1.2), path('M-7 -1 C-7 -10 7 -10 7 -1 Z', foe ? FOE2 : OLIVE2, C.ink, 1.1), ellipse(0, -1, 9.5, 2, foe ? FOE2 : OLIVE2, C.ink, 1), circle(-2, 1.5, 0.8, C.ink, null), circle(2, 1.5, 0.8, C.ink, null));
const motion = (x: number, y: number, dir: 1 | -1 = 1, n = 3, len = 10, gap = 6) => all(...Array.from({ length: n }, (_, i) => line(`M${x} ${y + i * gap} L${x - dir * len} ${y + i * gap}`, C.grey, 1.6)));

// ── Trenches and the front ───────────────────────────────────────────
const sandbag = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 -4 C-9 -6 9 -6 8 -4 C10 -2 10 2 8 4 C9 6 -9 6 -8 4 C-10 2 -10 -2 -8 -4 Z', SACK, C.ink, 1.1), line('M-4 -4 L-4 4 M4 -4 L4 4', '#b29e6a', 0.8));
const bagRow = (x1: number, n: number, y: number, s = 1) => all(...Array.from({ length: n }, (_, i) => sandbag(x1 + i * 15 * s, y, s)));
/** Barbed wire: posts with crossed coils between x1 and x2 at height y. */
const wire = (x1: number, x2: number, y: number, col: string = C.dark) => all(
  ...Array.from({ length: Math.floor((x2 - x1) / 22) + 1 }, (_, i) => line(`M${x1 + i * 22} ${y - 10} L${x1 + i * 22} ${y + 12}`, '#7a6a5a', 2.2)),
  ...Array.from({ length: Math.floor((x2 - x1) / 8) }, (_, i) => ellipse(x1 + 4 + i * 8, y, 4.5, 7, 'none', col, 1.1)),
  line(`M${x1} ${y - 4} L${x2} ${y - 4} M${x1} ${y + 4} L${x2} ${y + 4}`, col, 1),
  ...Array.from({ length: Math.floor((x2 - x1) / 8) }, (_, i) => line(`M${x1 + 6 + i * 8} ${y - 6} l2 -2 M${x1 + 6 + i * 8} ${y + 2} l2 2`, col, 1)));
/** Cross-section of earth from y down to the ground line, with a trench cut out between tx1 and tx2. */
const earth = (y: number, tx1 = 999, tx2 = 999, depth = 30) => all(
  path(`M0 ${y} L${tx1} ${y} L${tx1 + 3} ${y + depth} L${tx2 - 3} ${y + depth} L${tx2} ${y} L120 ${y} L120 120 L0 120 Z`, MUD, C.ink, 1.4),
  tx1 < 999 ? all(...Array.from({ length: Math.floor(depth / 7) }, (_, i) => line(`M${tx1 + 2} ${y + 3 + i * 7} L${tx1 + 6} ${y + 3 + i * 7} M${tx2 - 6} ${y + 3 + i * 7} L${tx2 - 2} ${y + 3 + i * 7}`, WOOD, 1.6)), rect(tx1 + 4, y + depth - 4, tx2 - tx1 - 8, 4, WOOD, 1, C.ink, 0.8)) : '',
  line(`M10 ${y + 18} l6 0 M96 ${y + 22} l8 0 M40 ${y + 40} l6 0`, MUD2, 1.2));
const crater = (x: number, y: number, w = 14) => all(ellipse(x, y, w, w * 0.32, MUD2, C.ink, 1.1), ellipse(x, y - 1, w * 0.7, w * 0.18, '#6a4c30', null));
const stump = (x: number, y: number, s = 1) => at(x, y, s, path('M-3 0 L-2 -16 L-6 -22 M-2 -16 L2 -26 L1 -14 L3 0 Z', '#6b5a44', C.ink, 1.2));

// ── Machines ─────────────────────────────────────────────────────────
/** A tank facing right with its bottom at y (flip faces left). */
const tank = (x: number, y: number, s = 1, col: string = OLIVE, flip = false) => atf(x, y, s, flip,
  path('M-30 -12 L30 -12 C36 -12 36 0 30 0 L-30 0 C-36 0 -36 -12 -30 -12 Z', '#4a4a40', C.ink, 1.4),
  ...[-24, -12, 0, 12, 24].map((d) => circle(d, -6, 4.2, '#8a8a78', C.ink, 1)),
  path('M-30 -12 L-26 -22 L26 -22 L32 -12 Z', col, C.ink, 1.5),
  path('M-14 -22 L-11 -32 L10 -32 L14 -22 Z', col, C.ink, 1.5), rect(13, -30, 26, 4, col, 1, C.ink, 1.2), circle(-2, -34, 2.6, col, C.ink, 1));
const truck = (x: number, y: number, s = 1, col: string = OLIVE, load: Svg = '', flip = false) => atf(x, y, s, flip,
  rect(-26, -24, 34, 18, col, 1, C.ink, 1.4), path('M10 -6 L10 -22 L20 -22 L27 -12 L27 -6 Z', col, C.ink, 1.4), path('M13 -19 L19 -19 L23 -12 L13 -12 Z', '#cfe6f2', C.ink, 0.9),
  load, path('M-26 -24 C-26 -36 8 -36 8 -24', load ? 'none' : OLIVE2, C.ink, 1.3),
  circle(-16, -4, 5, C.dark, C.ink, 1.2), circle(-4, -4, 5, C.dark, C.ink, 1.2), circle(18, -4, 5, C.dark, C.ink, 1.2), circle(-16, -4, 1.8, C.grey, null), circle(-4, -4, 1.8, C.grey, null), circle(18, -4, 1.8, C.grey, null));
const crate = (x: number, y: number, s = 1, col = WOOD) => at(x, y, s, rect(-7, -7, 14, 14, col, 1, C.ink, 1.2), line('M-7 -7 L7 7 M-7 7 L7 -7', '#7a4a20', 0.9));
const can = (x: number, y: number, s = 1, col = OLIVE) => at(x, y, s, rect(-6, -9, 12, 18, col, 1.5, C.ink, 1.2), path('M-6 -9 L-2 -13 L4 -13 L6 -9', 'none', C.ink, 1.2), line('M-4 -3 L4 5 M4 -3 L-4 5', OLIVE2, 1));
const drum = (x: number, y: number, s = 1, col = '#a5483c') => at(x, y, s, rect(-8, -12, 16, 24, col, 2, C.ink, 1.3), line('M-8 -4 L8 -4 M-8 4 L8 4', C.ink, 0.9), ellipse(0, -12, 8, 2.4, col, C.ink, 1));
const horse = (x: number, y: number, s = 1, col = '#8a5a3a', flip = false) => atf(x, y, s, flip,
  path('M-18 -24 C-18 -32 12 -32 14 -24 L14 -18 C12 -14 -16 -14 -18 -18 Z', col, C.ink, 1.3),
  line('M-14 -16 L-15 0 M-8 -16 L-7 0 M6 -16 L5 0 M11 -16 L12 0', col, 3.2), line('M-14 -16 L-15 0 M-8 -16 L-7 0 M6 -16 L5 0 M11 -16 L12 0', C.ink, 0.6),
  path('M12 -26 L18 -38 L26 -36 L28 -32 L20 -30 L16 -22 Z', col, C.ink, 1.3), path('M-18 -24 C-24 -22 -24 -14 -22 -10', 'none', '#3b2a1a', 2.4), circle(21, -35, 0.9, C.ink, null));
/** A cart or field gun on wheels drawn behind a horse. */
const cart = (x: number, y: number, s = 1) => at(x, y, s, rect(-14, -16, 28, 10, WOOD, 1, C.ink, 1.2), circle(-8, -4, 5, 'none', '#5a3a1a', 1.8), circle(8, -4, 5, 'none', '#5a3a1a', 1.8), line('M14 -12 L26 -12', '#5a3a1a', 1.6));
const mg = (x: number, y: number, s = 1, flip = false) => atf(x, y, s, flip,
  line('M-6 0 L0 -12 L8 0 M0 -12 L-2 0', C.dark, 2), rect(-10, -18, 18, 7, STEEL2, 2, C.ink, 1.2), rect(8, -16.5, 18, 3, C.dark, 1, C.ink, 0.8), rect(-12, -17, 4, 5, C.dark, 1, null),
  path('M-6 -11 C-8 -6 -4 -4 -2 -2', 'none', '#c9a23c', 2.4), ...[-6, -5, -3.5].map((d, i) => line(`M${d} ${-10 + i * 3} l2 0`, '#8a6a20', 1)));
const bombS = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M0 12 C-5 12 -5 -4 0 -10 C5 -4 5 12 0 12 Z', C.dark, C.ink, 1.2), path('M-4 -8 L-6 -14 L6 -14 L4 -8 Z', STEEL2, C.ink, 1), line('M-3 2 L3 2', STEEL, 1));
const burst = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -14 L4 -5 L13 -8 L7 0 L14 7 L4 5 L1 14 L-3 5 L-12 9 L-6 1 L-13 -7 L-4 -5 Z', C.yellow, C.ink, 1.2), path('M0 -6 L2 -2 L6 -3 L3 0 L6 4 L1 3 L0 7 L-2 3 L-6 4 L-3 0 L-6 -3 L-2 -2 Z', C.orange, null));
const smoke = (x: number, y: number, s = 1, col = '#9aa3ad') => at(x, y, s, path('M0 0 C-6 -6 6 -10 0 -16 C-6 -22 6 -26 0 -32', 'none', col, 2.4));
const puff = (x: number, y: number, s = 1, col = '#c9ced4') => at(x, y, s, path('M-10 4 C-14 4 -14 -3 -9 -3 C-8 -9 0 -10 2 -5 C6 -9 12 -6 10 -1 C14 0 13 4 10 4 Z', col, C.ink, 1));
const flame = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -16 C8 -6 12 0 10 6 C8 13 -8 13 -10 6 C-12 0 -6 -4 -4 -10 C-2 -4 0 -4 0 -16 Z', C.orange, C.ink, 1.2), path('M0 -2 C4 2 4 8 0 9 C-4 8 -4 2 0 -2 Z', C.yellow, null));

// ── Planes (seen from above, nose up) and in the air ──────────────────
/** A plane seen from above; big = four-engine bomber. */
const planeT = (x: number, y: number, s = 1, col: string = OLIVE, rot = 0, big = false) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  big ? all(
    path('M0 -24 C4 -22 4 -12 4 0 L3 22 L-3 22 L-4 0 C-4 -12 -4 -22 0 -24 Z', col, C.ink, 1.3),
    path('M-4 -8 L-36 -2 L-36 4 L-4 4 Z M4 -8 L36 -2 L36 4 L4 4 Z', col, C.ink, 1.2),
    ...[-26, -14, 14, 26].map((d) => all(rect(d - 2.5, -10, 5, 9, col, 1.5, C.ink, 1), line(`M${d - 4} -11 L${d + 4} -11`, C.ink, 1.2))),
    path('M-3 16 L-14 20 L-14 23 L-3 22 Z M3 16 L14 20 L14 23 L3 22 Z', col, C.ink, 1), ellipse(0, -17, 2.2, 3.4, '#cfe6f2', C.ink, 0.8))
    : all(
      path('M0 -20 C3 -18 3 -10 3 0 L2 16 L-2 16 L-3 0 C-3 -10 -3 -18 0 -20 Z', col, C.ink, 1.3),
      path('M-3 -7 L-22 -3 L-22 2 L-3 2 Z M3 -7 L22 -3 L22 2 L3 2 Z', col, C.ink, 1.2),
      path('M-2 11 L-9 14 L-9 16.5 L-2 16 Z M2 11 L9 14 L9 16.5 L2 16 Z', col, C.ink, 1), ellipse(0, -6, 1.8, 3, '#cfe6f2', C.ink, 0.8), line('M-5 -21 L5 -21', C.ink, 1.4)));
/** A plane seen from the side, nose right (flip = nose left). */
const planeS = (x: number, y: number, s = 1, col: string = OLIVE, flip = false, rot = 0, big = false) => g(`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -s : s} ${s})`,
  path(big ? 'M-30 -2 C-30 -7 16 -8 26 -4 C29 -2 29 3 26 4 C16 6 -30 4 -30 -2 Z' : 'M-20 -1 C-20 -5 10 -6 18 -3 C20 -1 20 2 18 3 C10 4 -20 3 -20 -1 Z', col, C.ink, 1.3),
  path(big ? 'M-27 -4 L-34 -16 L-28 -16 L-20 -4 Z' : 'M-17 -2 L-23 -11 L-18 -11 L-12 -2 Z', col, C.ink, 1.1),
  ellipse(big ? 0 : -1, 1.5, big ? 16 : 9, 2.2, col, C.ink, 1.1), circle(big ? 20 : 8, -4, 2.4, '#cfe6f2', C.ink, 0.9),
  big ? all(ellipse(-4, 4, 4, 2.6, col, C.ink, 1), ellipse(8, 4, 4, 2.6, col, C.ink, 1)) : line('M20 -6 L20 6', C.ink, 1.4));
const chute = (x: number, y: number, s = 1, body: Svg = '') => at(x, y, s, path('M-20 -10 C-20 -32 20 -32 20 -10 C14 -13 8 -13 0 -10 C-8 -13 -14 -13 -20 -10 Z', C.white, C.ink, 1.4), line('M-7 -26 C-6 -18 -6 -14 -6 -11 M7 -26 C6 -18 6 -14 6 -11', C.grey2, 1), line('M-20 -10 L-3 14 M-6 -11 L-2 14 M6 -11 L2 14 M20 -10 L3 14', C.dark, 0.9), body);
/** Small hanging figure for a parachute (local, top of head at y 12). */
const hanger = (col: string, helmet = true) => all(path('M-5 22 L5 22 L4 36 L-4 36 Z', col, C.ink, 1), line('M-3 36 L-4 44 M3 36 L4 44', C.dark, 2.2), circle(0, 17, 4.5, C.skin, C.ink, 1), helmet ? path('M-5 16 C-5 10 5 10 5 16 Z', OLIVE2, C.ink, 0.9) : path('M-4.5 15 C-4.5 11 4.5 11 4.5 15 Z', C.hair, null), line('M-5 23 L-3 14 M5 23 L3 14', C.skin, 1.6));
const searchlight = (x: number, y: number, rot: number) => g(`translate(${x} ${y}) rotate(${rot})`, path('M-3 0 L-22 -90 L22 -90 L3 0 Z', 'rgba(255,244,190,0.35)', null), rect(-5, -4, 10, 8, STEEL2, 2, C.ink, 1));
const aaGun = (x: number, y: number, s = 1, rot = -50) => at(x, y, s, path('M-16 0 L-10 -8 L10 -8 L16 0 Z', OLIVE2, C.ink, 1.2), g(`translate(0 -10) rotate(${rot})`, rect(0, -2.5, 30, 5, OLIVE, 1, C.ink, 1.2), rect(26, -3.2, 6, 6.4, C.dark, 1, null)), rect(-8, -14, 16, 7, OLIVE, 2, C.ink, 1.2));
const star4 = (x: number, y: number, r = 1.4) => circle(x, y, r, '#f3e6a1', null);

// ── Ships and the sea ─────────────────────────────────────────────────
const sea = (y: number, col: string = SEA) => all(rect(0, y, 120, 120 - y, col, 0, null), line(`M0 ${y} ${Array.from({ length: 15 }, (_, i) => `Q${i * 8 + 4} ${y - 2.5} ${i * 8 + 8} ${y}`).join(' ')}`, SEA2, 1.4));
const hull = (w: number, h: number, col: string) => path(`M${-w / 2} ${-h} L${w / 2 + 6} ${-h} L${w / 2 - 3} 0 L${-w / 2 + 3} 0 Z`, col, C.ink, 1.4);
const turret = (x: number, y: number, s = 1, flip = false) => atf(x, y, s, flip, path('M-6 0 L-5 -5 L5 -5 L6 0 Z', STEEL2, C.ink, 1), rect(4, -4.5, 14, 2, C.dark, 0.5, null));
/** Ship side views, bow to the right, waterline at y (flip = bow left). */
const battleship = (x: number, y: number, s = 1, flip = false) => atf(x, y, s, flip,
  hull(92, 9, STEEL), rect(-10, -24, 20, 15, STEEL, 1, C.ink, 1.3), rect(-4, -36, 8, 12, STEEL, 1, C.ink, 1.2), line('M0 -36 L0 -46 M-5 -42 L5 -42', C.ink, 1.3), rect(-22, -20, 8, 11, STEEL2, 1, C.ink, 1.1),
  turret(20, -9, 1.3), turret(34, -9, 1.2), turret(-30, -9, 1.3, true), ...[-40, -16, 12, 40].map((d) => circle(d, -4.5, 1.2, C.dark, null)));
const destroyer = (x: number, y: number, s = 1, flip = false) => atf(x, y, s, flip,
  hull(70, 6, STEEL), rect(4, -16, 12, 10, STEEL, 1, C.ink, 1.2), rect(-10, -18, 6, 12, STEEL2, 1, C.ink, 1.1), line('M10 -16 L10 -26', C.ink, 1.2), turret(26, -6, 0.9), turret(-26, -6, 0.9, true));
const carrier = (x: number, y: number, s = 1, planes = 3) => at(x, y, s,
  path('M-50 -12 L52 -12 L44 0 L-44 0 Z', STEEL, C.ink, 1.4), rect(-52, -15, 106, 4, STEEL2, 1, C.ink, 1.2), line('M-46 -13 L46 -13', C.white, 0.8, '4 3'),
  rect(26, -30, 12, 15, STEEL, 1, C.ink, 1.2), line('M32 -30 L32 -38', C.ink, 1.2),
  ...Array.from({ length: planes }, (_, i) => planeS(-36 + i * 18, -18, 0.42, OLIVE)));
const cargo = (x: number, y: number, s = 1, col = '#a5483c', flip = false) => atf(x, y, s, flip,
  hull(60, 8, col), rect(14, -18, 12, 10, C.white, 1, C.ink, 1.2), rect(18, -24, 4, 6, C.dark, 1, C.ink, 0.8), ...[-20, -8, 2].map((d) => rect(d, -14, 9, 6, [SAND, '#7fa5c9', '#9fbf7a'][(d + 20) / 10 | 0] ?? SAND, 1, C.ink, 0.9)));
/** Submarine: centre at (x, y). */
const sub = (x: number, y: number, s = 1, col = STEEL2, flip = false, scope = 0) => atf(x, y, s, flip,
  ellipse(0, 0, 34, 7, col, C.ink, 1.4), path('M-6 -6 L-4 -15 L8 -15 L10 -6 Z', col, C.ink, 1.3), path('M-34 0 L-40 -6 L-40 6 Z', col, C.ink, 1.1),
  scope ? all(line(`M4 -15 L4 ${-15 - scope}`, C.ink, 3), line(`M4 -15 L4 ${-15 - scope}`, STEEL, 1.6), rect(4, -17 - scope, 5, 3, STEEL, 1, C.ink, 0.9)) : '',
  ...[-18, -8, 14, 22].map((d) => circle(d, 0, 1.2, C.dark, null)));
const landingCraft = (x: number, y: number, s = 1, rampDown = false, troops = 3) => at(x, y, s,
  ...Array.from({ length: troops }, (_, i) => helmHead(-16 + i * 9, -16, 0.6)),
  path('M-26 -12 L18 -12 L18 0 L-22 0 Z', OLIVE, C.ink, 1.4),
  rampDown ? path('M18 -2 L36 4 L36 8 L18 2 Z', OLIVE2, C.ink, 1.2) : path('M18 -12 L24 -14 L24 -2 L18 0 Z', OLIVE2, C.ink, 1.2));
const seaMine = (x: number, y: number, s = 1) => at(x, y, s, ...[0, 45, 90, 135, 180, 225, 270, 315].map((a) => g(`rotate(${a})`, line('M0 -9 L0 -13', C.ink, 2), circle(0, -13.5, 1.6, C.dark, null))), circle(0, 0, 10, C.dark, C.ink, 1.4), path('M-4 -5 C-2 -7 2 -7 3 -6', 'none', C.grey, 1.2));
const bubbles = (x: number, y: number, n = 4, dx = -6) => all(...Array.from({ length: n }, (_, i) => circle(x + i * dx, y - (i % 2) * 2, 1.4 + (i % 3) * 0.4, 'none', C.white, 1)));
const fish = (x: number, y: number, s = 1) => at(x, y, s, path('M-6 0 C-3 -4 4 -4 6 0 C4 4 -3 4 -6 0 Z M-6 0 L-10 -3 L-10 3 Z', '#f2c14e', C.ink, 0.9));

// ── Buildings and land ────────────────────────────────────────────────
const bunker = (x: number, y: number, s = 1) => at(x, y, s, path('M-26 0 L-22 -18 C-18 -24 18 -24 22 -18 L26 0 Z', CONC, C.ink, 1.5), rect(-12, -14, 24, 4, C.dark, 1, C.ink, 1), line('M-14 -20 L-10 -16 M8 -6 L14 -2', '#9a9a90', 1));
const house = (x: number, y: number, s = 1, roof = '#c8572d', wallC = '#f3ead7') => at(x, y, s, rect(-10, -14, 20, 14, wallC, 1, C.ink, 1.3), path('M-12 -14 L0 -25 L12 -14 Z', roof, C.ink, 1.3), rect(-3, -8, 6, 8, '#6b4a2e', 1, null));
const ruinHouse = (x: number, y: number, s = 1) => at(x, y, s, path('M-14 0 L-14 -26 L-6 -20 L-2 -30 L4 -22 L8 -26 L14 -18 L14 0 Z', '#c9b8a0', C.ink, 1.3), rect(-8, -16, 5, 6, C.dark, 1, null), rect(4, -12, 5, 6, C.dark, 1, null), path('M-18 0 L-12 -5 L-4 -3 L2 -6 L10 -3 L18 0 Z', '#a89880', C.ink, 1));
const factory = (x: number, y: number, s = 1) => at(x, y, s, path('M-30 0 L-30 -16 L-20 -24 L-20 -16 L-10 -24 L-10 -16 L0 -24 L0 -16 L10 -16 L10 0 Z', '#b5523b', C.ink, 1.4), rect(14, -36, 7, 36, '#9a4a36', 1, C.ink, 1.2), smoke(17, -38, 0.5), ...[-24, -14, -4].map((d) => rect(d, -10, 5, 5, C.yellow, 1, C.ink, 0.8)));
const train = (x: number, y: number, s = 1, cars = 2) => at(x, y, s,
  line(`M-50 2 L${30 + cars * 30} 2`, C.dark, 2), rect(-44, -20, 30, 18, C.dark, 2, C.ink, 1.3), rect(-48, -14, 6, 12, C.dark, 1, C.ink, 1), rect(-22, -28, 6, 8, C.dark, 1, C.ink, 1), rect(-40, -16, 10, 7, C.yellow, 1, C.ink, 0.8),
  circle(-38, -1, 3.6, C.grey, C.ink, 1), circle(-22, -1, 3.6, C.grey, C.ink, 1),
  ...Array.from({ length: cars }, (_, i) => all(rect(-10 + i * 30, -18, 26, 16, '#8a5a3a', 1, C.ink, 1.2), line(`M${-10 + i * 30} -10 L${16 + i * 30} -10`, '#6b4a2e', 1), circle(-4 + i * 30, -1, 3.2, C.grey, C.ink, 1), circle(10 + i * 30, -1, 3.2, C.grey, C.ink, 1))));
const calendar = (x: number, y: number, txt: string, s = 1, col: string = '#c8372d') => at(x, y, s, rect(-14, -13, 28, 26, C.white, 2, C.ink, 1.3), rect(-14, -13, 28, 7, col, 2, C.ink, 1.3), T(0, 8, txt, 9.5, C.ink));
const warnSign = (x: number, y: number, s = 1) => at(x, y, s, line('M0 0 L0 -20', '#7a6a5a', 2.2), path('M0 -36 L10 -20 L-10 -20 Z', C.yellow, C.ink, 1.3), line('M0 -31 L0 -25', C.ink, 1.8), circle(0, -22.6, 1, C.ink, null));
const hedgehog = (x: number, y: number, s = 1) => at(x, y, s, line('M-9 2 L9 -12 M-9 -12 L9 2 M0 -16 L0 2', '#6b5a44', 3.4), line('M-9 2 L9 -12 M-9 -12 L9 2 M0 -16 L0 2', STEEL2, 2));
const landMine = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 0, 8, 3, STEEL2, C.ink, 1.1), rect(-2, -4.5, 4, 2.5, C.dark, 0.5, null));
const cot = (x: number, y: number, s = 1) => at(x, y, s, rect(-20, -8, 40, 5, C.white, 1, C.ink, 1.1), line('M-18 -3 L-18 4 M18 -3 L18 4', C.dark, 1.6));
const bowl = (x: number, y: number, s = 1) => at(x, y, s, path('M-6 0 L6 0 C6 5 -6 5 -6 0 Z', STEEL, C.ink, 1));
const suitcase = (x: number, y: number, s = 1, col = '#8a5a3a') => at(x, y, s, rect(-8, -7, 16, 13, col, 2, C.ink, 1.2), path('M-3 -7 L-3 -10 L3 -10 L3 -7', 'none', C.ink, 1.2));
const tag = (x: number, y: number, s = 1) => at(x, y, s, line('M0 -6 L0 -1', C.ink, 0.8), rect(-5, -1, 10, 7, C.white, 1, C.ink, 0.9), line('M-3 2 L3 2 M-3 4 L1 4', C.grey, 0.8));
/** A simple top-down map: land on the left/right with the sea in light blue. */
const mapFrame = (...k: Svg[]) => all(rect(8, 10, 104, 96, LAND, 3, C.ink, 1.6), ...k);
const dot = (x: number, y: number, foe = false) => all(circle(x, y, 3.2, foe ? FOE2 : OLIVE2, C.ink, 0.9));

// ── The motifs ───────────────────────────────────────────────────────
export const WORLD_WAR_MOTIFS: Record<string, Svg> = {
  // 2041 Skyttegravar och frontlinjer
  'vkrig.front.2': mapFrame(path('M58 10 C50 26 66 38 56 52 C48 66 64 78 58 92 C56 98 60 104 58 106', 'none', HL, 3.4), ...[[30, 22], [40, 40], [28, 58], [42, 72], [30, 90]].map(([x, y]) => dot(x!, y!)), ...[[84, 26], [76, 44], [90, 60], [78, 80], [92, 94]].map(([x, y]) => dot(x!, y!, true)), arrow(36, 48, 50, 48, OLIVE2, 2), arrow(84, 66, 68, 66, FOE2, 2)),
  'vkrig.skyttegrav': all(rect(0, 0, 120, 70, '#dfe8ee', 0, null), earth(70, 34, 86, 36), bagRow(16, 2, 66, 1), bagRow(92, 2, 66, 1), wire(98, 118, 52), soldier(60, 0.62, 'calm', false, {}), stump(14, 66), puff(84, 28, 1)),
  'vkrig.sandsäck': all(...[0, 1, 2, 3].map((r) => bagRow(20 + r * 8, 5 - r, 104 - r * 10, 1)), soldier(96, 0.66, 'calm'), reach(96, 0.66, -1, 84, 66), reach(96, 0.66, 1, 108, 66), sandbag(96, 64, 1.3), ground),
  'vkrig.taggtråd': all(rect(0, 0, 120, 112, '#eef1e8', 0, null), wire(8, 112, 72), wire(16, 104, 96), line('M0 112 L120 112', MUD, 4), ground),
  'vkrig.ingenmansland': all(rect(0, 0, 120, 62, '#dfe8ee', 0, null), path('M0 62 L120 62 L120 120 L0 120 Z', MUD, C.ink, 1.4), path('M0 62 L10 62 L12 90 L22 90 L24 62', '#6a4c30', C.ink, 1.4), path('M120 62 L110 62 L108 90 L98 90 L96 62', '#6a4c30', C.ink, 1.4), helmHead(17, 64, 0.9), helmHead(103, 64, 0.9, true), crater(48, 66, 10), crater(74, 70, 12), crater(60, 82, 8), wire(34, 56, 54), stump(86, 62, 0.9), line('M28 30 L92 30', HL, 2.2), line('M28 25 L28 35 M92 25 L92 35', HL, 2.2)),
  'vkrig.kulspruta': all(bagRow(14, 4, 106, 1.1), bagRow(22, 3, 96, 1.1), mg(60, 88, 1.8), ...[0, 1, 2].map((i) => line(`M${112 - i * 4} ${54 + i * 4} l6 -1`, C.grey, 1.6)), ground),
  'vkrig.giftgas': all(rect(0, 0, 120, 112, '#eef1e8', 0, null), path('M0 82 L120 82 L120 120 L0 120 Z', MUD, C.ink, 1.4), path('M70 82 L72 100 L96 100 L98 82', '#6a4c30', C.ink, 1.4), drum(16, 70, 0.8, STEEL2), path('M22 58 C34 46 52 60 66 52 C80 44 96 60 110 56 C116 66 106 80 92 78 C78 88 60 76 46 82 C32 86 20 76 22 58 Z', GAS, C.ink, 1.4), path('M40 64 C46 60 54 66 60 62 M74 64 C80 60 86 66 92 62', 'none', '#a8b048', 1.4), arrow(30, 30, 76, 30, C.grey, 2.4), line('M36 22 L60 22', C.grey, 1.6), helmHead(84, 84, 0.8)),
  'vkrig.gasmask': all(soldier(44, 0.92, 'calm'), on(44, 0.92, maskL()), at(92, 66, 1.6, ellipse(0, 0, 8.5, 8, '#6b6f5a', C.ink, 1.2), circle(-3.6, -3, 2.6, '#cfe6f2', C.ink, 0.9), circle(3.6, -3, 2.6, '#cfe6f2', C.ink, 0.9), circle(0, 5.5, 3, '#4a4d40', C.ink, 1), line('M0 8.5 C2 14 8 16 8 24', '#4a4d40', 2.4), rect(4, 24, 9, 9, '#4a4d40', 2, C.ink, 1)), ground),
  'vkrig.offensiv': all(rect(0, 96, 120, 24, MUD, 0, null), path('M2 96 L2 112 L22 112 L22 96', '#6a4c30', C.ink, 1.2), ...[30, 50, 70, 90].map((x, i) => shift(0, (i % 2) * 2, soldier(x, 0.5, 'angry'))), motion(28, 70, 1, 3, 8), motion(68, 70, 1, 3, 8), arrow(20, 20, 108, 20, HL, 4), line('M20 30 L96 30', HL, 2.2, '4 4')),
  'vkrig.genombrott.2': mapFrame(...[18, 34, 50, 74, 90].map((y) => rect(54, y - 6, 10, 12, FOE, 1, C.ink, 1.1)), ...[[56, 56], [60, 70]].map(([x, y]) => line(`M${x} ${y} l4 -4`, C.grey, 1.2)), arrow(16, 62, 104, 62, HL, 5), dot(20, 40), dot(20, 82), dot(96, 40, true)),
  'vkrig.ställningskrig': all(rect(0, 70, 120, 50, MUD, 0, null), path('M10 70 L12 92 L30 92 L32 70', '#6a4c30', C.ink, 1.3), path('M88 70 L90 92 L108 92 L110 70', '#6a4c30', C.ink, 1.3), helmHead(21, 72, 0.9), helmHead(99, 72, 0.9, true), wire(44, 76, 66), calendar(24, 28, '1915', 0.9), calendar(60, 28, '1916', 0.9), calendar(96, 28, '1917', 0.9), arrow(36, 28, 46, 28, C.grey, 2), arrow(72, 28, 82, 28, C.grey, 2), line('M20 52 L20 60 M100 52 L100 60', C.grey, 1.6, '2 2')),
  'vkrig.utnötningskrig': all(...[0, 1, 2].map((st) => { const n = [5, 3, 1][st]!; const x0 = 8 + st * 38; const k = all(...Array.from({ length: n }, (_, i) => helmHead(x0 + 8 + (i % 3) * 9, 46 - Math.floor(i / 3) * 10, 0.62)), ...Array.from({ length: n }, (_, i) => helmHead(x0 + 8 + (i % 3) * 9, 90 - Math.floor(i / 3) * 10, 0.62, true)), rect(x0, 98, 32, 4, C.grey2, 1, null)); return st === 0 ? greyed(k) : k; }), arrow(38, 66, 46, 66, HL, 2.4), arrow(76, 66, 84, 66, HL, 2.4), line('M8 68 L112 68', C.grey2, 1, '3 3')),

  // 2042 Stridsvagnar och mekanisering
  'vkrig.föråldrad': all(greyed(planeS(88, 40, 1.3, STEEL, false, 0, false)), at(36, 72, 1.3, path('M-18 -1 C-18 -5 10 -6 16 -3 C18 -1 18 2 16 3 C10 4 -18 3 -18 -1 Z', '#b8a07a', C.ink, 1.3), rect(-6, -12, 16, 2.4, '#b8a07a', 1, C.ink, 1), rect(-6, 4, 16, 2.4, '#b8a07a', 1, C.ink, 1), line('M-2 -10 L-2 4 M6 -10 L6 4', C.ink, 1), path('M-16 -2 L-21 -10 L-17 -10 L-12 -2 Z', '#b8a07a', C.ink, 1), line('M18 -6 L18 6', C.ink, 1.4)), path('M14 88 L28 102 M22 86 L30 100 M14 96 L24 104', 'none', C.grey, 0.8), path('M12 54 C20 60 28 58 34 52 M12 54 L20 46 M12 54 L22 52', 'none', C.grey, 0.9), ...[[22, 92], [46, 96], [58, 90]].map(([x, y]) => circle(x!, y!, 1.2, '#b0a690', null)), ground),
  'vkrig.stridsvagn': all(rect(0, 100, 120, 20, MUD, 0, null), path('M40 100 L44 116 L64 116 L68 100', '#6a4c30', C.ink, 1.2), tank(60, 100, 1.3), puff(14, 94, 0.8), ground),
  'vkrig.pansar': all(tank(46, 104, 1.1), rect(78, 20, 18, 84, STEEL2, 1, C.ink, 1.6), line('M80 30 L94 30 M80 60 L94 60 M80 90 L94 90', STEEL, 1.2), ...[[104, 40], [110, 64], [104, 84]].map(([x, y]) => all(circle(x! - 6, y!, 2.2, C.dark, C.ink, 0.6), line(`M${x! - 3} ${y! - 2} L${x! + 4} ${y! - 8} M${x! - 3} ${y! + 2} L${x! + 4} ${y! + 8}`, C.grey, 1.4))), ...[[96, 38], [96, 62], [96, 82]].map(([x, y]) => all(line(`M${x} ${y} l3 -3 M${x} ${y} l4 1`, C.yellow, 1.4)))),
  'vkrig.larvfot': all(path('M0 100 L120 100 L120 120 L0 120 Z', MUD, null), at(60, 96, 2, path('M-26 -12 L26 -12 C33 -12 33 2 26 2 L-26 2 C-33 2 -33 -12 -26 -12 Z', '#4a4a40', C.ink, 1.4), ...Array.from({ length: 13 }, (_, i) => line(`M${-24 + i * 4} -12 L${-24 + i * 4} -9 M${-24 + i * 4} 2 L${-24 + i * 4} -1`, '#2e2e28', 1)), ...[-20, -10, 0, 10, 20].map((d) => all(circle(d, -5, 4.2, '#8a8a78', C.ink, 1), circle(d, -5, 1.2, C.dark, null)))), path('M10 102 C20 96 30 106 40 100 M80 102 C90 96 100 106 110 100', 'none', MUD2, 2.4), greyed(at(104, 56, 1, circle(0, 0, 9, C.dark, C.ink, 1.2), circle(0, 0, 3, C.grey, null)))),
  'vkrig.motoriserad': all(greyed(horse(20, 56, 0.8, '#8a5a3a', true), cart(42, 56, 0.8), soldier(56, 0.36, 'calm')), truck(34, 104, 0.9, OLIVE, all(helmHead(-18, -28, 0.55), helmHead(-8, -28, 0.55), helmHead(2, -28, 0.55))), truck(90, 104, 0.9, OLIVE, all(helmHead(-18, -28, 0.55), helmHead(-8, -28, 0.55), helmHead(2, -28, 0.55))), motion(10, 88, 1, 3, 6, 5), ground),
  'vkrig.mekanisering': all(greyed(horse(24, 54, 0.8), soldier(48, 0.36, 'calm')), arrow(24, 66, 24, 78, HL, 3), arrow(64, 40, 78, 40, HL, 3), at(96, 54, 0.95, path('M-12 0 L-12 -14 L-2 -14 L-2 -20 L8 -20 L8 0 Z', OLIVE, C.ink, 1.2), circle(-6, 2, 4, C.dark, C.ink, 1), circle(4, 2, 4, C.dark, C.ink, 1)), tank(34, 108, 0.8), truck(92, 108, 0.75)),
  'vkrig.division': all(...[0, 1, 2].flatMap((r) => Array.from({ length: 8 }, (_, i) => helmHead(12 + i * 13.5 + (r % 2) * 4, 30 + r * 13, 0.75))), tank(28, 104, 0.6), tank(68, 104, 0.6), truck(104, 104, 0.55), line('M8 74 L112 74', C.grey2, 1, '3 3'), T(60, 18, '15 000', 10, C.dark), ground),
  'vkrig.blixtkrig': all(...[0, 1].map((i) => tank(34 + i * 40, 106, 0.75)), motion(10, 88, 1, 3, 10, 6), motion(50, 88, 1, 3, 10, 6), planeS(40, 30, 0.9, OLIVE), planeS(84, 22, 0.9, OLIVE), motion(18, 28, 1, 2, 10, 5), bolt(104, 54, 1.4), arrow(16, 70, 108, 70, HL, 3), ground),
  'vkrig.pansarvärn': all(tank(94, 106, 0.85, FOE, true), at(34, 112, 1, path('M-14 -2 L-12 -18 L2 -20 L4 -2 Z', OLIVE, C.ink, 1.2), path('M-4 -2 L10 -2 L12 0 L-6 0 Z', OLIVE2, C.ink, 1), circle(-4, -26, 6.5, C.skin, C.ink, 1.2), path('M-11 -26 C-11 -36 3 -36 3 -26 Z', OLIVE2, C.ink, 1.1), g('rotate(-4 0 -24)', rect(-18, -24, 46, 5.5, OLIVE2, 2, C.ink, 1.2), rect(26, -25, 6, 7.5, C.dark, 1, C.ink, 0.9)), line('M0 -18 L6 -21', C.skin, 3)), bagRow(10, 3, 108, 0.8), line('M70 86 L78 86', HL, 1.6, '2 3'), ground),
  'vkrig.stridsvagnshinder': all(...[0, 1].flatMap((r) => Array.from({ length: 5 }, (_, i) => at(28 + i * 15 + r * 7, 112 - r * 9, 1 - r * 0.15, path('M-7 0 L0 -16 L7 0 Z', CONC, C.ink, 1.2), line('M-3 -6 L3 -6', '#9a9a90', 0.8)))), tank(10, 112, 0.5, FOE), ground),

  // 2043 Flygkrigets framväxt
  'vkrig.spaningsplan': all(rect(0, 0, 120, 70, '#e3f0f7', 0, null), planeS(58, 22, 1.1, OLIVE), path('M58 28 L28 92 L90 92 Z', 'rgba(255,244,190,0.45)', null), line('M58 28 L28 92 M58 28 L90 92', C.grey, 1, '3 3'), earth(92, 40, 76, 12), helmHead(50, 94, 0.5, true), helmHead(64, 94, 0.5, true), at(100, 46, 1, rect(-10, -8, 20, 15, C.white, 1, C.ink, 1.1), rect(-8, -6, 16, 11, '#d8c8a0', 0, null), line('M-8 0 L8 0', MUD2, 1.6)), at(58, 30, 1, rect(-3, 0, 6, 4, C.dark, 1, null))),
  'vkrig.skjuta-ner': all(rect(0, 0, 120, 112, '#e3f0f7', 0, null), planeS(82, 26, 1, OLIVE, true), ...[0, 1, 2].map((i) => line(`M${64 - i * 6} ${34 + i * 3} l-4 2`, C.yellow, 2)), g('translate(42 74) rotate(40)', planeS(0, 0, 0.9, FOE)), path('M26 56 C30 46 22 40 28 30 C34 22 26 16 30 8', 'none', '#7a7f88', 4), flame(48, 76, 0.4), ground),
  'vkrig.jaktplan': all(rect(0, 0, 120, 112, '#e3f0f7', 0, null), planeS(64, 54, 2, OLIVE), motion(18, 48, 1, 3, 12, 6), ground),
  'vkrig.luftstrid': all(rect(0, 0, 120, 112, '#e3f0f7', 0, null), line('M30 70 C10 50 30 20 60 24 C90 28 104 56 86 78 C70 96 44 90 30 70 Z', C.grey2, 1.4, '4 4'), planeS(40, 32, 0.85, OLIVE, false, 20), planeS(88, 76, 0.85, FOE, true, 20), ...[0, 1, 2].map((i) => line(`M${58 + i * 6} ${42 + i * 4} l4 2`, C.yellow, 1.8)), puff(24, 92, 0.7), puff(100, 18, 0.7)),
  'vkrig.fallskärm': all(rect(0, 0, 120, 112, '#e3f0f7', 0, null), chute(60, 46, 1.5, hanger(OLIVE, false)), planeS(20, 14, 0.5, STEEL), ground),
  'vkrig.flygvapen': all(rect(0, 0, 120, 112, '#e3f0f7', 0, null), planeT(36, 34, 0.9, OLIVE, 0), planeT(60, 22, 0.9, OLIVE, 0), planeT(84, 34, 0.9, OLIVE, 0), planeT(60, 62, 1.2, OLIVE, 0, true), soldier(20, 0.44, 'smile', false, { bottom: OLIVE2 }), soldier(100, 0.44, 'smile'), ground),
  'vkrig.bomb': all(bombS(60, 60, 3.2, 0), line('M30 104 L90 104', C.grey2, 2)),
  'vkrig.bomba': all(rect(0, 0, 120, 112, '#e3f0f7', 0, null), planeS(64, 18, 1.1, OLIVE, true, 0, true), ...[[60, 36], [56, 50], [52, 64]].map(([x, y]) => bombS(x!, y!, 0.6, 15)), factory(70, 112, 0.9), burst(40, 96, 1), smoke(30, 84, 0.6), ground),
  'vkrig.bombplan': all(rect(0, 0, 120, 112, '#e3f0f7', 0, null), planeT(56, 56, 1.45, OLIVE, 0, true), greyed(planeT(104, 94, 0.55, STEEL)), ground),
  'vkrig.luftherravälde': all(rect(0, 0, 120, 80, '#e3f0f7', 0, null), line('M6 80 C6 10 114 10 114 80', HL, 2.4, '5 4'), planeT(34, 42, 0.6, OLIVE, 60), planeT(60, 28, 0.6, OLIVE, 90), planeT(86, 42, 0.6, OLIVE, 120), planeT(60, 58, 0.6, OLIVE, 90), rect(0, 80, 120, 32, '#d8d0b0', 0, null), greyed(planeS(32, 100, 0.6, FOE), planeS(82, 100, 0.6, FOE)), ground),
  'vkrig.radar': all(rect(0, 0, 120, 112, '#e3f0f7', 0, null), at(32, 112, 1, line('M-12 0 L0 -30 L12 0 M-8 -10 L8 -10', C.dark, 2), g('rotate(-20 0 -34)', path('M-16 -46 C-10 -30 10 -30 16 -46 Z', STEEL, C.ink, 1.3), line('M0 -36 L0 -50', C.ink, 1.4))), ...[10, 18, 26].map((r) => path(`M${44 + r * 0.3} ${54 - r} A${r} ${r} 0 0 1 ${44 + r} ${54 - r * 0.3}`, 'none', HL, 1.6)), at(88, 78, 1, rect(-22, -22, 44, 44, C.dark, 4, C.ink, 1.4), circle(0, 0, 17, '#2f5a3a', C.ink, 1), circle(0, 0, 10, 'none', '#6fcf8a', 0.8), circle(0, 0, 4, 'none', '#6fcf8a', 0.8), line('M0 0 L12 -12', '#a6f0b8', 1.6), circle(8, -6, 1.8, '#d7f23a', null), circle(-6, 9, 1.8, '#d7f23a', null)), planeS(86, 16, 0.6, FOE, true), ground),
  'vkrig.flygbas': all(rect(0, 70, 120, 42, '#cfd8b8', 0, null), path('M0 96 L120 84 L120 98 L0 110 Z', '#8d949c', C.ink, 1.2), line('M10 102 L110 91', C.white, 1.2, '6 5'), path('M8 70 L8 52 C8 36 48 36 48 52 L48 70 Z', STEEL, C.ink, 1.4), path('M18 70 L18 56 L38 56 L38 70 Z', C.dark, null), at(84, 70, 1, rect(-4, -26, 8, 26, CONC, 1, C.ink, 1.2), rect(-9, -34, 18, 9, '#bfe3f5', 1, C.ink, 1.2)), planeT(64, 84, 0.55, OLIVE, -84), planeT(100, 78, 0.55, OLIVE, -84), planeS(80, 22, 0.7, OLIVE, false, -12)),
  'vkrig.luftvärn': all(rect(0, 0, 120, 112, NIGHT, 0, null), ...[[14, 14], [40, 8], [100, 12], [76, 20], [26, 40]].map(([x, y]) => star4(x!, y!)), searchlight(22, 108, 18), searchlight(100, 108, -20), planeS(62, 24, 0.8, FOE, true), puff(46, 30, 0.5, '#9aa3ad'), puff(80, 40, 0.5, '#9aa3ad'), aaGun(62, 110, 1.1, -70), path('M0 110 L120 110 L120 120 L0 120 Z', '#3b3f4a', null)),

  // 2044 Sjöstrider och ubåtar
  'vkrig.krigsfartyg': all(rect(0, 0, 120, 70, '#e3f0f7', 0, null), sea(70), destroyer(58, 74, 1.3)),
  'vkrig.flotta': all(rect(0, 0, 120, 112, '#e3f0f7', 0, null), sea(40), battleship(36, 56, 0.5), battleship(84, 56, 0.5), destroyer(24, 78, 0.5), destroyer(60, 80, 0.5), destroyer(96, 78, 0.5), carrier(60, 100, 0.45, 2)),
  'vkrig.slagskepp': all(rect(0, 0, 120, 74, '#e3f0f7', 0, null), sea(74), battleship(56, 78, 1.08), greyed(destroyer(98, 100, 0.32))),
  'vkrig.sjöslag': all(rect(0, 0, 120, 60, '#e3f0f7', 0, null), sea(60), battleship(28, 66, 0.48), destroyer(30, 92, 0.48), battleship(92, 66, 0.48, true), destroyer(92, 92, 0.48, true), puff(48, 50, 0.6, '#9aa3ad'), puff(72, 50, 0.6, '#9aa3ad'), ...[[60, 76], [52, 100], [70, 98]].map(([x, y]) => path(`M${x! - 4} ${y} L${x! - 2} ${y! - 8} L${x} ${y! - 2} L${x! + 2} ${y! - 9} L${x! + 4} ${y}`, C.white, C.ink, 0.8))),
  'vkrig.ubåt': all(rect(0, 0, 120, 30, '#e3f0f7', 0, null), sea(30, '#7fbbe0'), sub(60, 70, 1.3), fish(18, 96, 0.9), fish(100, 46, 0.8), bubbles(30, 60, 4, -5)),
  'vkrig.periskop': all(rect(0, 0, 120, 44, '#e3f0f7', 0, null), sea(44, '#7fbbe0'), sub(46, 86, 1, STEEL2, false, 33), cargo(96, 46, 0.42), line('M54 36 L84 40', HL, 1.4, '3 3'), at(22, 22, 1, circle(0, 0, 13, C.white, C.ink, 1.4), line('M-13 0 L13 0 M0 -13 L0 13', C.grey, 0.8), cargo(0, 4, 0.22))),
  'vkrig.torped': all(rect(0, 0, 120, 30, '#e3f0f7', 0, null), sea(30, '#7fbbe0'), cargo(88, 34, 0.7), at(36, 76, 1, path('M-22 -4 L18 -4 C24 -4 26 0 24 0 C26 0 24 4 18 4 L-22 4 Z', STEEL, C.ink, 1.3), path('M-22 -4 L-28 -9 L-28 9 L-22 4 Z', STEEL2, C.ink, 1), line('M-30 -5 L-30 5', C.dark, 1.4)), bubbles(4, 78, 3, -2), arrow(64, 70, 82, 50, HL, 2.2)),
  'vkrig.sänka.2': all(rect(0, 0, 120, 60, '#e3f0f7', 0, null), sea(60), g('translate(58 70) rotate(-24)', path('M-30 -8 L30 -8 L24 0 L-24 0 Z', '#a5483c', C.ink, 1.4), rect(4, -18, 12, 10, C.white, 1, C.ink, 1.2), rect(8, -24, 4, 6, C.dark, 1, C.ink, 0.8)), rect(0, 66, 120, 54, SEA, 0, null), line('M0 66 Q8 63 16 66 Q24 63 32 66 Q40 63 48 66 Q56 63 64 66 Q72 63 80 66 Q88 63 96 66 Q104 63 112 66 Q116 64 120 66', SEA2, 1.4), bubbles(54, 80, 4, 4), smoke(84, 46, 0.6), at(98, 64, 1, path('M-10 -4 L10 -4 L7 2 L-7 2 Z', '#e8c070', C.ink, 1.1), helmHead(-4, -8, 0.45), circle(4, -9, 2.6, C.skin, C.ink, 0.8))),
  'vkrig.jagare': all(rect(0, 0, 120, 50, '#e3f0f7', 0, null), sea(50), destroyer(60, 56, 1.15), path('M98 56 C104 52 110 52 116 56', 'none', C.white, 2), motion(18, 44, 1, 3, 10, 4), sub(70, 94, 0.55, STEEL2, false, 0), line('M60 66 L66 84', HL, 1.4, '3 3')),
  'vkrig.hangarfartyg': all(rect(0, 0, 120, 74, '#e3f0f7', 0, null), sea(74), carrier(58, 80, 1, 3), planeS(98, 34, 0.6, OLIVE, false, -18), motion(84, 40, 1, 2, 8, 4)),
  'vkrig.sjömina': all(rect(0, 0, 120, 28, '#e3f0f7', 0, null), sea(28, '#7fbbe0'), cargo(70, 30, 0.6), seaMine(54, 66, 1.4), line('M54 80 C52 92 56 100 54 108', C.dark, 1.4, '2 2'), rect(48, 106, 12, 6, C.dark, 1, C.ink, 1), line('M0 112 L120 112', MUD2, 3)),
  'vkrig.konvoj': all(rect(0, 0, 120, 112, SEA, 0, null), ...[[30, 34], [62, 34], [94, 34], [30, 70], [62, 70], [94, 70]].map(([x, y]) => cargo(x!, y!, 0.42)), destroyer(46, 98, 0.45), destroyer(96, 98, 0.45), destroyer(20, 12, 0.4), arrow(4, 52, 22, 52, HL, 2.4)),
  'vkrig.eskortera': all(rect(0, 0, 120, 112, SEA, 0, null), cargo(60, 64, 0.8), destroyer(60, 30, 0.6), destroyer(60, 102, 0.6), arrow(96, 16, 112, 16, HL, 2), arrow(98, 52, 114, 52, HL, 2), arrow(96, 90, 112, 90, HL, 2)),

  // 2045 Landstigningar
  'vkrig.invadera': mapFrame(path('M8 10 L60 10 C54 30 66 48 58 66 C52 82 64 96 60 106 L8 106 Z', SEA, C.ink, 1.2), ...[[24, 30], [30, 58], [22, 86]].map(([x, y]) => all(at(x!, y!, 0.5, path('M-12 -4 L10 -4 L10 4 L-10 4 Z', OLIVE, C.ink, 1.2)), arrow(x! + 10, y!, x! + 52, y! + 2, HL, 2.6))), house(92, 44, 0.6), house(90, 84, 0.6)),
  'vkrig.landstigning': all(rect(0, 0, 120, 56, '#e3f0f7', 0, null), sea(56), path('M60 120 L120 120 L120 74 C100 72 80 80 60 120 Z', SAND, C.ink, 1.4), landingCraft(30, 84, 0.9, true, 2), soldier(74, 0.5, 'angry'), soldier(94, 0.5, 'angry'), soldier(58, 0.42, 'calm'), arrow(66, 52, 108, 52, HL, 2.6), destroyer(30, 50, 0.4)),
  'vkrig.kustförsvar': all(rect(0, 0, 120, 70, '#e3f0f7', 0, null), sea(70), path('M50 120 L50 70 C70 56 100 56 120 54 L120 120 Z', SAND, C.ink, 1.4), bunker(78, 64, 0.7), bunker(106, 58, 0.55), hedgehog(40, 96, 0.9), hedgehog(58, 104, 0.9), hedgehog(26, 92, 0.8), destroyer(16, 52, 0.3, true), wire(60, 100, 86)),
  'vkrig.bunker': all(rect(0, 0, 120, 80, '#e3f0f7', 0, null), path('M0 112 L0 82 C30 70 90 70 120 82 L120 112 Z', '#9fcb84', C.ink, 1.2), bunker(60, 98, 2), helmHead(60, 74, 0.5, true), ground),
  'vkrig.minfält': all(rect(0, 0, 120, 70, '#eef1e8', 0, null), path('M0 70 L120 70 L120 120 L0 120 Z', '#b9a77a', C.ink, 1.3), ...[[24, 84], [52, 92], [80, 82], [100, 98], [36, 104], [70, 106]].map(([x, y]) => landMine(x!, y!, 1)), line('M0 76 L120 76', '#9a8a60', 1, '3 4'), warnSign(28, 70, 1.1), warnSign(94, 70, 1.1), wire(46, 76, 60)),
  'vkrig.fallskärmsjägare': all(rect(0, 0, 120, 112, NIGHT, 0, null), ...[[12, 8], [60, 6], [108, 14]].map(([x, y]) => star4(x!, y!)), planeS(92, 16, 0.8, OLIVE, true, 0, true), chute(30, 44, 0.85, hanger(OLIVE)), chute(64, 64, 0.85, hanger(OLIVE)), chute(98, 50, 0.7, hanger(OLIVE)), path('M0 108 L120 108 L120 120 L0 120 Z', '#3b4a3a', null)),
  'vkrig.landsätta': all(rect(0, 0, 120, 60, '#e3f0f7', 0, null), sea(60), path('M64 120 L120 120 L120 66 C96 66 80 80 64 120 Z', SAND, C.ink, 1.4), landingCraft(36, 90, 0.9, true, 3), soldier(84, 0.46, 'calm'), soldier(104, 0.46, 'calm'), arrow(52, 74, 72, 80, HL, 2.4), planeS(70, 14, 0.6, OLIVE, true), chute(96, 36, 0.45, hanger(OLIVE)), arrow(96, 48, 96, 58, HL, 2)),
  'vkrig.tidvatten': all(...[0, 1].map((p) => { const x0 = 4 + p * 58, wy = p ? 92 : 60; return all(rect(x0, 10, 54, 100, '#e3f0f7', 2, C.ink, 1.2), path(`M${x0} 110 L${x0} 50 L${x0 + 54} 86 L${x0 + 54} 110 Z`, SAND, null), rect(x0, wy, 54, 110 - wy, 'rgba(106,174,214,0.8)', 0, null), line(`M${x0} ${wy} L${x0 + 54} ${wy}`, SEA2, 1.6), ellipse(x0 + 20, 100, 7, 4, '#8a8276', C.ink, 1.1), ellipse(x0 + 36, 104, 5, 3, '#8a8276', C.ink, 1.1), rect(x0, 10, 54, 100, 'none', 2, C.ink, 1.2)); }), arrow(30, 40, 30, 52, HL, 2.2), arrow(88, 52, 88, 80, HL, 2.2), path('M46 22 A6 6 0 1 0 52 28 A4.8 4.8 0 1 1 46 22 Z', '#f3e6a1', C.ink, 1)),
  'vkrig.landstigningsbåt': all(rect(0, 0, 120, 70, '#e3f0f7', 0, null), sea(70), path('M86 120 L120 120 L120 82 C108 84 96 96 86 120 Z', SAND, C.ink, 1.4), landingCraft(48, 92, 1.7, true, 3)),
  'vkrig.vada': all(rect(0, 0, 120, 72, '#e3f0f7', 0, null), soldier(56, 0.95, 'calm'), reach(56, 0.95, -1, 40, 30), reach(56, 0.95, 1, 72, 30), rect(36, 22, 40, 8, OLIVE2, 3, C.ink, 1.2), rect(0, 72, 120, 48, 'rgba(106,174,214,0.85)', 0, null), line('M0 72 Q10 68 20 72 Q30 68 40 72 Q50 68 60 72 Q70 68 80 72 Q90 68 100 72 Q110 68 120 72', SEA2, 1.6), path('M40 74 C46 70 66 70 72 74', 'none', C.white, 1.6), path('M96 120 L120 120 L120 90 Z', SAND, C.ink, 1.2)),
  'vkrig.strandhuvud': mapFrame(path('M8 10 L44 10 C40 30 50 50 44 70 C40 86 48 98 44 106 L8 106 Z', SEA, C.ink, 1.2), path('M44 40 C64 34 76 52 72 64 C68 78 54 82 46 78', 'rgba(125,127,74,0.35)', OLIVE2, 2), ...[[52, 52], [60, 64], [54, 70]].map(([x, y]) => dot(x!, y!)), ...[[86, 36], [90, 66], [84, 92]].map(([x, y]) => dot(x!, y!, true)), arrow(14, 34, 40, 54, HL, 2.4), arrow(14, 82, 40, 66, HL, 2.4), at(20, 28, 0.4, path('M-12 -4 L10 -4 L10 4 L-10 4 Z', OLIVE, C.ink, 1.2)), at(20, 88, 0.4, path('M-12 -4 L10 -4 L10 4 L-10 4 Z', OLIVE, C.ink, 1.2))),

  // 2046 Logistik under världskrig
  'vkrig.logistik': all(factory(24, 40, 0.6), arrow(42, 32, 56, 32, HL, 2.2), train(76, 38, 0.32, 2), arrow(98, 44, 98, 58, HL, 2.2), at(98, 76, 0.8, rect(-14, -14, 28, 18, '#c9b99a', 1, C.ink, 1.2), path('M-16 -14 L0 -22 L16 -14 Z', '#8a7a64', C.ink, 1.1)), arrow(82, 76, 66, 76, HL, 2.2), truck(46, 86, 0.55), arrow(26, 82, 26, 94, HL, 2.2), helmHead(18, 104, 0.6), helmHead(32, 104, 0.6), at(64, 18, 1, circle(0, 0, 8, C.white, C.ink, 1.2), line('M0 0 L0 -5 M0 0 L4 2', C.ink, 1.2))),
  'vkrig.frakta': all(truck(52, 106, 1.5, OLIVE, all(crate(-20, -31, 0.8), crate(-8, -31, 0.8), crate(-14, -42, 0.8), crate(2, -31, 0.8))), motion(10, 80, 1, 3, 8, 6), arrow(86, 30, 112, 30, HL, 3), ground),
  'vkrig.depå': all(path('M10 78 L10 52 L60 40 L110 52 L110 78 Z', '#c9b99a', C.ink, 1.4), rect(44, 58, 32, 20, C.dark, 1, null), ...[[18, 104], [32, 104], [25, 90]].map(([x, y]) => crate(x!, y!, 1)), ...[52, 66, 80].map((x) => drum(x, 100, 0.6)), truck(100, 112, 0.5), ...[0, 1, 2].map((i) => line(`M${10 + i * 50} 78 L${10 + i * 50} 112`, '#7a6a5a', 1.6)), ground),
  'vkrig.försörjningslinje': mapFrame(factory(28, 40, 0.5), line('M30 46 C46 60 64 50 76 66 C86 80 92 86 96 94', HL, 2.6, '5 4'), at(48, 54, 0.6, crate(0, 0, 1)), at(70, 60, 0.5, truck(0, 0, 0.6)), at(86, 82, 0.6, crate(0, 0, 1)), line('M84 98 C92 94 100 104 110 98', FOE2, 2.4), helmHead(96, 100, 0.55)),
  'vkrig.flaskhals': all(rect(0, 60, 120, 52, SEA, 0, null), path('M0 60 L46 60 L46 112 L0 112 Z', '#cfd8b8', C.ink, 1.2), path('M74 60 L120 60 L120 112 L74 112 Z', '#cfd8b8', C.ink, 1.2), rect(46, 74, 28, 10, STEEL, 1, C.ink, 1.2), line('M46 74 L74 74', C.dark, 1.4), truck(60, 82, 0.4), truck(30, 82, 0.4), truck(12, 70, 0.36), truck(30, 100, 0.36), truck(10, 104, 0.36), truck(100, 82, 0.4), line('M46 38 C36 36 34 22 46 20 L46 10 L74 10 L74 20 C86 22 84 36 74 38', C.grey, 2.4)),
  'vkrig.materiel': all(rect(10, 80, 100, 6, '#7a6a5a', 1, C.ink, 1), at(26, 72, 1, path('M-10 0 C-10 -12 10 -12 10 0 Z', OLIVE2, C.ink, 1.2), ellipse(0, 0, 13, 3, OLIVE2, C.ink, 1.1)), can(52, 70, 0.9), crate(78, 70, 1.1), at(98, 74, 1, path('M-6 6 L-6 -10 L2 -10 L2 2 L8 2 L8 6 Z', '#3b2f2f', C.ink, 1.1)), tank(36, 112, 0.5), truck(88, 112, 0.5), at(60, 40, 1, path('M-24 0 L-16 -18 L16 -18 L24 0 Z', '#c9c49a', C.ink, 1.3)), at(96, 38, 1, rect(-10, -10, 20, 18, OLIVE, 2, C.ink, 1.2), line('M-6 -10 L-6 -14 M6 -10 L6 -14', C.ink, 1.2)), ground),
  'vkrig.drivmedel': all(...[16, 30, 44].map((x) => can(x, 103, 0.95)), drum(62, 100, 0.9), drum(78, 100, 0.9), soldier(100, 0.6, 'calm'), reach(100, 0.6, -1, 86, 76), at(82, 80, 1, can(0, 0, 0.8)), path('M80 86 C78 92 76 94 76 96', 'none', '#c9a23c', 2), ground),
  'vkrig.fältkök': all(at(40, 104, 1, rect(-20, -26, 40, 22, OLIVE, 2, C.ink, 1.4), ellipse(0, -26, 16, 4, STEEL, C.ink, 1.2), rect(10, -46, 5, 20, C.dark, 1, C.ink, 1), circle(-10, 0, 6, C.dark, C.ink, 1.2), circle(10, 0, 6, C.dark, C.ink, 1.2), path('M-14 -10 L-6 -10 L-6 -4 L-14 -4 Z', C.orange, null)), smoke(52, 56, 0.6), soldier(76, 0.55, 'smile'), reach(76, 0.55, -1, 62, 74), bowl(62, 72, 1), soldier(102, 0.55, 'smile'), reach(102, 0.55, -1, 92, 76), bowl(92, 74, 1), at(30, 72, 1, line('M0 0 L10 -8', C.dark, 1.6)), ground),
  'vkrig.fältsjukhus': all(path('M4 112 L22 40 L98 40 L116 112 Z', '#c9c49a', C.ink, 1.6), path('M22 40 L60 20 L98 40 Z', '#b0ab82', C.ink, 1.4), cot(42, 104, 1), at(26, 96, 1, circle(0, 0, 5, C.skin, C.ink, 1), path('M-4 -2 C-4 -7 4 -7 4 -2 Z', C.white, C.ink, 0.8)), path('M30 92 L60 92 L60 98 L30 98 Z', '#bcd7ea', C.ink, 1), civ(84, 0.62, C.white, 'calm', { hairStyle: 'long', bottom: C.white }), reach(84, 0.62, -1, 62, 88)),

  // 2047 Civilbefolkning i krig
  'vkrig.bombning': all(rect(0, 0, 120, 112, '#d8dde3', 0, null), planeT(30, 18, 0.5, STEEL2, 90, true), planeT(84, 12, 0.5, STEEL2, 90, true), ...[[34, 36], [40, 52], [88, 30], [82, 46]].map(([x, y]) => bombS(x!, y!, 0.5)), ...[16, 40, 64, 88, 108].map((x, i) => house(x, 112, 1 + (i % 2) * 0.2, '#8a5a3a')), flame(40, 90, 0.6), flame(88, 92, 0.5), smoke(64, 80, 0.7), ground),
  'vkrig.evakuering': all(train(30, 108, 0.6, 2), ...[60, 76].map((x, i) => all(civ(x, 0.44, [C.orange, C.denim][i]!, 'frown', { hairStyle: i ? 'short' : 'long' }), tag(x, 74, 0.8))), suitcase(68, 108, 0.7), civ(100, 0.7, '#b07aa1', 'frown', { hairStyle: 'long' }), greyed(house(96, 40, 0.8), house(112, 44, 0.6)), smoke(100, 22, 0.5), arrow(54, 54, 20, 54, HL, 2.6)),
  'vkrig.krigsbarn': all(civ(36, 0.55, C.orange, 'frown', { hairStyle: 'long' }), tag(36, 70, 1.1), suitcase(52, 106, 0.9), civ(84, 0.9, '#5a8a5a', 'smile', { hairStyle: 'long' }), reach(84, 0.9, -1, 50, 64), civ(104, 0.95, C.denim, 'smile'), at(14, 36, 1, path('M-10 6 L10 6 L8 12 L-8 12 Z', '#a5483c', C.ink, 1), rect(-3, -2, 6, 8, C.white, 1, C.ink, 0.8)), ground),
  'vkrig.hemlös': all(ruinHouse(84, 112, 1.8), civ(30, 0.7, '#8a7a6a', 'frown', { hairStyle: 'long' }), civ(50, 0.45, C.denim, 'frown'), at(16, 104, 1, path('M-8 8 C-10 0 -6 -6 0 -8 C6 -6 10 0 8 8 Z', '#c9b98f', C.ink, 1.2)), suitcase(64, 106, 0.8), ground),
  'vkrig.umbärande': all(greyed(at(24, 84, 0.9, rect(-14, -6, 28, 6, C.tan, 1, C.ink, 1), circle(-6, -10, 4, '#d9a35a', C.ink, 1), circle(4, -10, 4, '#d9a35a', C.ink, 1), circle(0, -16, 4, '#d9a35a', C.ink, 1))), civ(70, 0.8, '#8a7a6a', 'frown', { hairStyle: 'long', w: 0.82 }), civ(96, 0.5, '#7a8a9a', 'frown', { w: 0.8 }), at(82, 100, 1, ellipse(0, 0, 12, 4, C.white, C.ink, 1.2)), ...[[56, 16], [80, 10], [104, 22], [66, 34], [112, 40]].map(([x, y]) => at(x!, y!, 0.7, line('M0 -6 L0 6 M-5 -3 L5 3 M-5 3 L5 -3', '#5aa7d6', 1.6))), path('M68 70 L74 70 L74 76 L68 76 Z', '#c9b98f', C.ink, 0.6), ground),
  'vkrig.återuppbyggnad': all(ruinHouse(26, 112, 1.2), at(84, 112, 1, rect(-22, -30, 44, 30, '#c8572d', 1, C.ink, 1.3), ...[0, 1, 2, 3, 4].map((r) => line(`M-22 ${-6 * r} L22 ${-6 * r}`, '#9a4a36', 0.8)), rect(-6, -14, 10, 14, '#6b4a2e', 1, null)), at(84, 62, 1, ...[0, 1, 2].map((i) => rect(-22 + i * 15, -6, 14, 6, '#c8572d', 1, C.ink, 1))), civ(52, 0.6, C.orange, 'smile'), reach(52, 0.6, 1, 64, 70), rect(62, 66, 10, 6, '#c8572d', 1, C.ink, 1), line('M104 112 L104 14 L66 14 M104 24 L96 14', C.yellow, 2.4), line('M76 14 L76 40', C.dark, 1), ground),
};
