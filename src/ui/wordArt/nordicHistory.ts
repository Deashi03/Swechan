/**
 * Historia & humaniora → Civilisationer & världsdelars historia → Nordens historia, 2401–2407 (0.41):
 * Viking societies, the Nordic kingdoms, the Kalmar Union, the Swedish age of greatness, the Age of Liberty,
 * Sweden in the 1800s and modern Nordic history.
 * Recurring signs: a Viking with a round helmet (no horns) and a beard, a longship with a striped sail, a
 * crowned king in purple, a bishop's white mitre, farmers with straw hats, simple maps with the Baltic in
 * blue, Nordic cross flags for the countries, a domed assembly as a semicircle of seats, coins and sacks.
 * The thing the word names is in full colour and often marked with an orange ring; a grey copy is the
 * contrast. Digits only (years), no words or letters, no brands, no pointing fingers (palms only).
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { type Build } from './figures';
import { HL, arm, bolt } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Colours ──────────────────────────────────────────────────────────
const RED = '#c8372d';
const GOLD = C.gold;
const ROYAL = '#7b3fa0';
const STONE = '#c9c1b2';
const WOOD = '#a8743f';
const WOOD2 = '#7a4a20';
const SEA = '#8cc3e3';
const SEA2 = '#5f9fc8';
const SKY = '#dcecf6';
const GRASS = '#9fcb84';
const FIELD = '#e8cf73';
const CREAM = '#f3ead7';
const FUR = '#8a6a48';
const LAND = '#d9e8c4';
const SWE = '#3f6fb5';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const num = (x: number, y: number, n: string, size = 9, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${n}</text>`;

// ── Figures ──────────────────────────────────────────────────────────
const ground = line('M4 112 L116 112', C.grey2, 2);
const skyBg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const room = (col: string = '#f3ede2') => rect(4, 4, 112, 108, col, 3, null);
const sea = (y: number) => all(rect(4, y, 112, 112 - y, SEA, 0, null), ...range(4).map((i) => line(`M${10 + i * 28} ${y + 6 + (i % 2) * 5} q4 -3 8 0 q4 3 8 0`, SEA2, 1.4)));
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: f1(ty - 38 * s), sl: f1(x - 13 * s), sr: f1(x + 13 * s) }; };
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const lo = (d: string, col: string, w: number) => line(d, C.ink, w + 2) + line(d, col, w);
// head accessories (standing-figure coordinates)
const helmetL = () => all(path('M-10.8 -57 C-10.8 -71.5 10.8 -71.5 10.8 -57 Z', '#a9b0b8', C.ink, 1.4), line('M-10.5 -60 L10.5 -60', '#7d858e', 1.6), rect(-1.2, -60, 2.4, 8, '#a9b0b8', 0.6, C.ink, 0.8));
const beardL = (col: string = '#c4732a') => path('M-8 -53 C-8 -38 8 -38 8 -53 C4 -49.5 -4 -49.5 -8 -53 Z', col, C.ink, 1);
const crownL = (col: string = GOLD) => path('M-9 -63 L-9.5 -74 L-4.5 -68.5 L0 -76 L4.5 -68.5 L9.5 -74 L9 -63 Z', col, C.ink, 1.3);
const mitreL = () => all(path('M-8.5 -63 L-8 -73 L0 -87 L8 -73 L8.5 -63 Z', C.white, C.ink, 1.3), line('M0 -85 L0 -64', GOLD, 2), line('M-8.3 -66 L8.3 -66', GOLD, 2));
const strawL = () => all(ellipse(0, -63, 14, 3, '#e8c870', C.ink, 1.1), path('M-7 -63 C-7 -72 7 -72 7 -63 Z', '#e8c870', C.ink, 1.1));
const cloakL = (col: string = FUR) => path('M-15 -44 C-22 -20 -22 0 -19 6 L-14 6 L-14 -40 Z M15 -44 C22 -20 22 0 19 6 L14 6 L14 -40 Z', col, C.ink, 1.3);
const chainL = () => all(path('M-11 -40 C-7 -27 7 -27 11 -40', 'none', GOLD, 2.6), circle(0, -28.5, 3, GOLD, C.ink, 0.9));
const tricornL = (col: string = C.black) => path('M-15 -62 C-8 -66 8 -66 15 -62 L10 -70 C4 -66 -4 -66 -10 -70 Z', col, C.ink, 1.2);
const capL = (col: string) => path('M-10 -60 C-10 -71 10 -71 10 -60 L12 -58 L-12 -58 Z', col, C.ink, 1.1);
const soldierHelm = (col: string = '#5b6650') => path('M-12 -58 C-12 -73 12 -73 12 -58 L14 -56 L-14 -56 Z', col, C.ink, 1.3);
const viking = (x: number, h = 1, top: string = '#4f7f5a', mood: Mood = 'smile', beard: string = '#c4732a') => all(fig(x, top, mood, { h, bottom: '#6b5a44' }), on(x, h, beardL(beard), helmetL()));
const king = (x: number, h = 1, col: string = ROYAL, mood: Mood = 'smile') => all(fig(x, col, mood, { h, bottom: col }), on(x, h, chainL(), crownL()));
const bishop = (x: number, h = 1) => all(fig(x, C.white, 'calm', { h, bottom: RED }), on(x, h, mitreL()));
const farmer = (x: number, h = 1, top = '#b98a52', mood: Mood = 'smile') => all(fig(x, top, mood, { h, bottom: '#6b5a44' }), on(x, h, strawL()));
/** A small bust for crowds. */
const bust = (x: number, y: number, top: string, hat: Svg = '', s = 1, grey = false) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-8 12 C-8 4 8 4 8 12 Z', grey ? C.grey : top, C.ink, 1.2), circle(0, 0, 5.4, grey ? C.grey2 : C.skin, C.ink, 1.2),
  path('M-5.4 -1 C-5.4 -8 5.4 -8 5.4 -1 C3 -4 -3 -4 -5.4 -1 Z', grey ? C.grey : C.hair, null), circle(-2, 0, 0.8, C.ink, null), circle(2, 0, 0.8, C.ink, null), hat);
const bStraw = all(ellipse(0, -4.5, 8.5, 2, '#e8c870', C.ink, 0.9), path('M-4.5 -4.5 C-4.5 -10 4.5 -10 4.5 -4.5 Z', '#e8c870', C.ink, 0.9));
const bHelm = path('M-6.2 -0.5 C-6.2 -10 6.2 -10 6.2 -0.5 Z', '#a9b0b8', C.ink, 1);
const bMitre = path('M-5 -4 L-4.5 -10 L0 -17 L4.5 -10 L5 -4 Z', C.white, C.ink, 1);
const bWig = path('M-6.5 0 C-7.5 -10 7.5 -10 6.5 0 L7 6 L4 5 L4 -1 C2 -4 -2 -4 -4 -1 L-4 5 L-7 6 Z', '#ece8e0', C.ink, 0.9);
const bHat = path('M-7 -4 L7 -4 L5 -6 L5 -11 L-5 -11 L-5 -6 Z', C.black, C.ink, 0.9);
// seated figure facing right; local: feet at y 0, head centre (−5, −66)
const seatedL = (top: string, bottom: string, sk: string = C.skin) => all(lo('M-4 -24 L12 -24 L13 -3', bottom, 8.5), ellipse(16, -1.5, 6, 3, C.black, C.ink, 1),
  path('M-15 -54 L5 -54 C7 -42 7 -30 6 -21 L-14 -21 C-16 -32 -16 -44 -15 -54 Z', top, C.ink, 1.8), rect(-8, -61, 6, 8, sk, 2, C.ink, 1.2), circle(-5, -66, 9.5, sk, C.ink, 1.8),
  path('M-14.5 -68 C-14 -80.5 4 -80.5 4.5 -68 C0 -72 -10 -72 -14.5 -68 Z', C.hair, C.ink, 1.4), circle(-1, -66, 1.2, C.ink, null), line('M-3.5 -61.5 Q-1 -59.5 1.5 -61.5', C.ink, 1.2),
  lo('M-4 -50 L12 -38', top, 6), circle(13, -37, 3.2, sk, C.ink, 1.2));
const throneL = (col: string = '#b23a3a') => all(rect(-23, -82, 11, 82, col, 2, C.ink, 1.6), circle(-17.5, -84, 3.4, GOLD, C.ink, 1), rect(-23, -24, 34, 6, col, 1.5, C.ink, 1.6), line('M-21 -18 L-21 0 M9 -18 L9 0', '#7a2a2a', 3.2));
const seated = (x: number, s: number, top: string, bottom: string, o: { throne?: boolean; flip?: boolean; hat?: Svg } = {}) =>
  g(`translate(${x} 112) scale(${o.flip ? -s : s} ${s})`, o.throne ? throneL() : '', seatedL(top, bottom), o.hat ? g('translate(-5 -10)', o.hat) : '');
const throne = (x: number, s = 1, col: string = '#b23a3a') => g(`translate(${x} 112) scale(${s})`, throneL(col));
// kneeling figure facing right; local: ground 0, head centre (6, −58)
const kneelL = (top: string, bottom: string) => all(
  lo('M-4 -22 L-2 -4 L-18 -4', bottom, 8), ellipse(-21, -3, 4, 3, C.black, C.ink, 1), lo('M-4 -22 L11 -22 L12 -3', bottom, 8), ellipse(15, -1.5, 5, 2.6, C.black, C.ink, 1),
  path('M-12 -50 L4 -52 C8 -40 6 -30 4 -19 L-12 -19 C-14 -30 -14 -40 -12 -50 Z', top, C.ink, 1.8), circle(6, -58, 9, C.skin, C.ink, 1.8), path('M-3 -60 C-3 -72.5 15 -72.5 15 -60 C10 -64 2 -64 -3 -60 Z', C.hair, C.ink, 1.4),
  circle(10.5, -57.5, 1.1, C.ink, null), line('M8 -52.6 Q10.5 -51 13 -52.8', C.ink, 1.1), lo('M0 -46 L18 -40', top, 6), circle(19, -40, 3, C.skin, C.ink, 1.2));
const kneel = (x: number, s: number, top: string, bottom: string, flip = false) => g(`translate(${x} 112) scale(${flip ? -s : s} ${s})`, kneelL(top, bottom));

// ── Things ───────────────────────────────────────────────────────────
const crownBig = (x: number, y: number, s = 1, col: string = GOLD) => at(x, y, s, path('M-14 6 L-15 -10 L-7 -2 L0 -14 L7 -2 L15 -10 L14 6 Z', col, C.ink, 1.6), rect(-14, 4, 28, 5, col, 1, C.ink, 1.4), circle(0, 6.5, 1.6, RED, null), circle(-8, 6.5, 1.4, SWE, null), circle(8, 6.5, 1.4, SWE, null));
const coin = (x: number, y: number, r = 5) => all(circle(x, y, r, GOLD, C.ink, 1.2), circle(x, y, r * 0.55, 'none', '#b88a20', 1));
const silver = (x: number, y: number, r = 4) => all(circle(x, y, r, C.silver, C.ink, 1.1), circle(x, y, r * 0.5, 'none', '#8a9098', 0.9));
const sack = (x: number, y: number, s = 1, col = '#d9c08a') => at(x, y, s, path('M-8 10 C-11 0 -9 -6 -4 -8 L-5 -12 L5 -12 L4 -8 C9 -6 11 0 8 10 Z', col, C.ink, 1.3), line('M-5 -8.5 L5 -8.5', '#8a6a3a', 1.4));
const ring = (x: number, y: number, r: number) => circle(x, y, r, 'none', HL, 2.6);
const noSign = (x: number, y: number, r = 8) => all(circle(x, y, r, 'none', RED, 2.6), line(`M${f1(x - r * 0.7)} ${f1(y - r * 0.7)} L${f1(x + r * 0.7)} ${f1(y + r * 0.7)}`, RED, 2.6));
const palm = (x: number, y: number, s = 1) => at(x, y, s, ...[-4.6, -1.6, 1.4, 4.4].map((d, i) => rect(d - 1.3, -9 + Math.abs(i - 1.5) * 1.2, 2.6, 9, C.skin, 1.3, C.ink, 0.9)), path('M-5.5 -1 L5.5 -1 L5 5 C4 8 -4 8 -5 5 Z', C.skin, C.ink, 1));
const roundShield = (x: number, y: number, r = 7, col: string = RED) => all(circle(x, y, r, col, C.ink, 1.3), line(`M${x - r} ${y} L${x + r} ${y} M${x} ${y - r} L${x} ${y + r}`, CREAM, 1.4), circle(x, y, r * 0.3, C.silver, C.ink, 0.9));
const doc = (x: number, y: number, s = 1, col: string = CREAM, n = 4) => at(x, y, s, path('M-10 -13 L6 -13 L10 -9 L10 13 L-10 13 Z', col, C.ink, 1.4), ...range(n).map((i) => line(`M-7 ${-7 + i * 5} L${i === n - 1 ? 2 : 7} ${-7 + i * 5}`, C.grey, 1.3)));
const seal = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 4.4, RED, C.ink, 1), circle(0, 0, 2, '#a02a22', null), path('M-2 3.5 L-4 9 L-1 7 M2 3.5 L4 9 L1 7', 'none', RED, 1.6));
const sword = (x: number, y: number, s = 1, r = 0) => g(`translate(${x} ${y}) rotate(${r}) scale(${s})`, path('M-1.6 -24 L1.6 -24 L1.6 2 L-1.6 2 Z', C.silver, C.ink, 1), path('M0 -27 L1.6 -24 L-1.6 -24 Z', C.silver, C.ink, 0.8), rect(-6, 2, 12, 2.6, GOLD, 1, C.ink, 0.9), rect(-1.4, 4.6, 2.8, 6, WOOD2, 0.8, C.ink, 0.8));
const axe = (x: number, y: number, s = 1, r = 0) => g(`translate(${x} ${y}) rotate(${r}) scale(${s})`, line('M0 12 L0 -12', WOOD2, 2.8), path('M-1 -13 L-10 -9 L-9 1 L-1 -4 Z', C.silver, C.ink, 1));
const fork = (x: number, y: number, s = 1, r = 0) => g(`translate(${x} ${y}) rotate(${r}) scale(${s})`, line('M0 14 L0 -10', WOOD2, 2.4), path('M-5 -18 L-5 -10 L5 -10 L5 -18 M0 -18 L0 -10', 'none', '#7d858e', 1.6));
const pick = (x: number, y: number, s = 1, r = 0) => g(`translate(${x} ${y}) rotate(${r}) scale(${s})`, line('M0 14 L0 -10', WOOD2, 2.6), path('M-12 -8 C-6 -14 6 -14 12 -8 C6 -11 -6 -11 -12 -8 Z', '#7d858e', C.ink, 1));
const musket = (x: number, y: number, s = 1, r = 0) => g(`translate(${x} ${y}) rotate(${r}) scale(${s})`, line('M0 -22 L0 6', C.dark, 2), path('M-1.6 6 L1.6 6 L3 14 L-2 14 Z', WOOD2, C.ink, 0.9));
const flameS = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -16 C8 -6 12 0 10 6 C8 13 -8 13 -10 6 C-12 0 -6 -4 -4 -10 C-2 -4 0 -4 0 -16 Z', C.orange, C.ink, 1.2), path('M0 -2 C4 2 4 8 0 9 C-4 8 -4 2 0 -2 Z', C.yellow, null));
const smoke = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 C-6 -6 6 -10 0 -16 C-6 -22 6 -26 0 -32', 'none', '#9aa3ad', 2.4));
const field = (x: number, y: number, w: number, h: number, col: string = FIELD, rows = 4) => all(rect(x, y, w, h, col, 2, C.ink, 1.2), ...range(rows - 1).map((i) => line(`M${x + 2} ${f1(y + (h / rows) * (i + 1))} L${x + w - 2} ${f1(y + (h / rows) * (i + 1))}`, '#b9953c', 1)));
const tree = (x: number, y: number, s = 1, col: string = '#5f9e58') => at(x, y, s, rect(-2, -14, 4, 14, WOOD2, 1, C.ink, 1), circle(0, -20, 10, col, C.ink, 1.4));
const chainBroken = (x: number, y: number, s = 1) => at(x, y, s, ellipse(-9, 0, 5, 3, 'none', '#7d858e', 2), ellipse(-1, 0, 5, 3, 'none', '#7d858e', 2), path('M5 -3 C8 -4 9 -1 8 1', 'none', '#7d858e', 2), path('M12 1 C11 3 13 5 15 4', 'none', '#7d858e', 2), ellipse(19, 0, 5, 3, 'none', '#7d858e', 2), line('M9 -5 L11 -8 M10 4 L12 7', HL, 1.4));
// buildings
const house = (x: number, y: number, s = 1, col: string = '#c84a3c', roof: string = '#6b4a3a') => at(x, y, s, rect(-9, -10, 18, 10, col, 0.5, C.ink, 1.2), path('M-11 -10 L0 -19 L11 -10 Z', roof, C.ink, 1.2), rect(-2, -6, 4, 6, '#5a3a2a', 0.3, null));
const church = (x: number, y: number, s = 1, col: string = CREAM) => at(x, y, s, rect(-24, -26, 36, 26, col, 1, C.ink, 1.6), path('M-27 -26 L-6 -40 L15 -26 Z', '#8a5a3a', C.ink, 1.6),
  rect(12, -52, 14, 52, col, 1, C.ink, 1.6), path('M10 -52 L19 -70 L28 -52 Z', '#8a5a3a', C.ink, 1.6), line('M19 -70 L19 -79 M15 -75.5 L23 -75.5', C.ink, 1.8), path('M-10 0 L-10 -10 C-10 -16 -2 -16 -2 -10 L-2 0 Z', '#6b4a2e', C.ink, 1.2));
const castle = (x: number, y: number, s = 1, col: string = STONE) => at(x, y, s, rect(-24, -38, 48, 38, col, 1, C.ink, 1.6), ...[-22, -12, -2, 8, 18].map((d) => rect(d, -44, 5, 6, col, 0.5, C.ink, 1.2)),
  rect(-36, -56, 15, 56, col, 1, C.ink, 1.6), rect(21, -56, 15, 56, col, 1, C.ink, 1.6), ...[-36, -29.5, 21, 27.5].map((d) => rect(d, -61, 4.5, 5, col, 0.5, C.ink, 1.1)),
  path('M-8 0 L-8 -16 C-8 -26 8 -26 8 -16 L8 0 Z', '#4a3a2e', C.ink, 1.3));
const manor = (x: number, y: number, s = 1, wall: string = '#f6f1e6', roof: string = RED) => at(x, y, s, path('M-36 -34 L-30 -48 L30 -48 L36 -34 Z', roof, C.ink, 1.6), rect(-34, -34, 68, 34, wall, 1, C.ink, 1.6),
  ...[-26, -14, 10, 22].flatMap((d) => [rect(d, -29, 6, 9, '#7aa0c4', 1, C.ink, 1), rect(d, -15, 6, 9, '#7aa0c4', 1, C.ink, 1)]), rect(-4, -16, 8, 16, '#6b4a2e', 1, C.ink, 1.2));
const farm = (x: number, y: number, s = 1) => at(x, y, s, rect(-12, -12, 16, 12, '#b5452e', 0.5, C.ink, 1.2), path('M-14 -12 L-4 -20 L6 -12 Z', '#5a4a3a', C.ink, 1.2), rect(6, -9, 10, 9, '#b5452e', 0.5, C.ink, 1.1), path('M5 -9 L11 -14 L17 -9 Z', '#5a4a3a', C.ink, 1.1), rect(-6, -6, 4, 6, C.white, 0.3, null));
// ships
/** A Viking longship, waterline centre (x, y): dragon prow at the right, striped sail. */
const longship = (x: number, y: number, s = 1, sail = true, sailCol: string = RED) => at(x, y, s,
  sail ? all(line('M0 -2 L0 -50', WOOD2, 2.4), path('M-20 -46 L20 -46 L22 -14 L-22 -14 Z', CREAM, C.ink, 1.4), ...[-14, -2, 10].map((d) => path(`M${d} -46 L${d + 6} -46 L${d + 6.6} -14 L${d - 0.6} -14 Z`, sailCol, null)), path('M-20 -46 L20 -46 L22 -14 L-22 -14 Z', 'none', C.ink, 1.4), line('M-24 -46 L24 -46', WOOD2, 2)) : '',
  path('M-40 -4 C-30 8 30 8 40 -4 L42 -16 C44 -24 52 -22 50 -16 C48 -12 44 -14 46 -18 L44 -8 L-44 -8 L-46 -16 C-48 -20 -44 -22 -42 -18 Z', WOOD, C.ink, 1.6),
  line('M-38 -4 C-26 4 26 4 38 -4', WOOD2, 1), ...range(7).map((i) => roundShield(-30 + i * 10, -7, 3.6, i % 2 ? '#e0b23c' : RED)));
const oars = (x: number, y: number, s = 1) => at(x, y, s, ...range(6).map((i) => line(`M${-26 + i * 10} -4 L${-32 + i * 10} 10`, WOOD2, 1.6)));
/** A three-masted sailing ship, waterline centre (x, y). */
const bigShip = (x: number, y: number, s = 1, hull: string = '#5a3a24', ports = 2, flagCol: string = SWE) => at(x, y, s,
  ...[-18, 0, 18].map((m) => all(line(`M${m} -4 L${m} -58`, WOOD2, 2), path(`M${m - 12} -54 L${m + 12} -54 L${m + 13} -40 L${m - 13} -40 Z`, C.white, C.ink, 1.1), path(`M${m - 13} -36 L${m + 13} -36 L${m + 14} -18 L${m - 14} -18 Z`, C.white, C.ink, 1.1))),
  path('M-14 -62 L-14 -70 L-4 -66 Z', flagCol, C.ink, 0.8),
  path('M-40 -14 L40 -14 L46 -24 L44 -6 C36 6 -30 6 -38 -2 L-46 -10 L-46 -30 L-36 -30 L-36 -14 Z', hull, C.ink, 1.6), path('M-46 -30 L-36 -30 L-36 -14 L-46 -12 Z', GOLD, C.ink, 1.1),
  ...range(ports).flatMap((r) => range(7).map((i) => rect(-28 + i * 9, -11 + r * 6, 4, 3.4, '#2a1a10', 0.5, GOLD, 0.6))));
// maps and flags
type Fl = 'dk' | 'se' | 'no' | 'fi' | 'is' | 'grey';
const FLAGS: Record<Fl, [string, string, string?]> = { dk: ['#c8102e', C.white], se: ['#006aa7', '#fecc00'], no: ['#ba0c2f', C.white, '#00205b'], fi: [C.white, '#003580'], is: ['#02529c', C.white, '#dc1e35'], grey: ['#c9ced4', '#8d949c'] };
/** A Nordic cross flag with its top-left corner at (x, y). */
const flag = (x: number, y: number, kind: Fl, w = 22) => {
  const h = w * 0.7, [bg, cr, inner] = FLAGS[kind], cx = x + w * 0.36, cy = y + h / 2, t = h * 0.22;
  return all(rect(x, y, w, h, bg, 0.5, C.ink, 1), rect(f1(cx - t / 2), y, f1(t), f1(h), cr, 0, null), rect(x, f1(cy - t / 2), w, f1(t), cr, 0, null),
    inner ? all(rect(f1(cx - t / 4), y, f1(t / 2), f1(h), inner, 0, null), rect(x, f1(cy - t / 4), w, f1(t / 2), inner, 0, null)) : '', rect(x, y, w, h, 'none', 0.5, C.ink, 1));
};
const poleFlag = (x: number, y: number, kind: Fl, w = 20) => all(line(`M${x} ${y} L${x} ${f1(y - w * 1.6)}`, C.ink, 1.6), flag(x, f1(y - w * 1.6), kind, w));
/** The Nordic lands around the Baltic, as a simple map (land green, sea blue). */
const nordicMap = (landCol: string = LAND) => all(rect(4, 4, 112, 108, SEA, 3, null),
  path('M4 4 L40 4 C44 14 40 22 46 30 C50 40 44 52 48 64 C50 76 44 86 34 92 C26 96 18 92 12 96 L4 98 Z', landCol, C.ink, 1.4),
  path('M58 4 L116 4 L116 74 C104 78 96 70 92 60 C88 50 80 44 76 34 C70 26 62 18 58 4 Z', landCol, C.ink, 1.4),
  path('M4 112 L4 104 C20 98 40 102 60 98 C80 94 100 98 116 92 L116 112 Z', landCol, C.ink, 1.4));
const chamber = (x: number, y: number, s = 1, cols: string[] = [SWE, RED, C.green]) => at(x, y, s, ...[0, 1, 2].map((r) => path(`M${-30 + r * 8} 0 A${30 - r * 8} ${24 - r * 6} 0 0 1 ${30 - r * 8} 0`, 'none', cols[r % cols.length]!, 4)),
  ...range(9).map((i) => { const a = Math.PI * (i / 8); return circle(f1(-34 * Math.cos(a)), f1(-28 * Math.sin(a)), 2.4, C.skin, C.ink, 0.7); }), rect(-6, -4, 12, 6, WOOD, 1, C.ink, 1));
const cal = (x: number, y: number, n: string, s = 1) => at(x, y, s, rect(-14, -11, 28, 22, C.white, 2, C.ink, 1.3), rect(-14, -11, 28, 6, RED, 2, C.ink, 1.3), num(0, 7, n, 9));
const pot = (x: number, y: number, s = 1) => at(x, y, s, path('M-4 -6 C-6 0 -6 6 -3 8 L3 8 C6 6 6 0 4 -6 Z', '#f0f4fa', '#2f5aa8', 1.2), path('M-4 0 C-1 -2 1 2 4 0', 'none', '#2f5aa8', 1), rect(-3.4, -8, 6.8, 2.4, '#f0f4fa', 0.5, '#2f5aa8', 0.9));
const crate = (x: number, y: number, s = 1, col: string = '#c49a62') => at(x, y, s, rect(-7, -6, 14, 12, col, 1, C.ink, 1.2), line('M-7 -6 L7 6 M7 -6 L-7 6', '#8a6a3a', 1));
const bottle = (x: number, y: number, s = 1, fill: string = 'rgba(220,240,252,0.8)') => at(x, y, s, path('M-5 -6 L-5 12 C-5 14 5 14 5 12 L5 -6 C5 -9 2 -10 2 -13 L2 -18 L-2 -18 L-2 -13 C-2 -10 -5 -9 -5 -6 Z', fill, C.ink, 1.3), rect(-2.4, -21, 4.8, 3.4, WOOD, 0.6, C.ink, 0.9), rect(-5, 0, 10, 12, 'rgba(255,255,255,0.5)', 1, null));
const shotGlass = (x: number, y: number, s = 1) => at(x, y, s, path('M-4 -6 L4 -6 L3 4 L-3 4 Z', 'rgba(220,240,252,0.75)', C.ink, 1.1), path('M-3.6 -3 L3.6 -3 L3 4 L-3 4 Z', 'rgba(255,255,255,0.9)', null));
const potato = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 0, 6, 4.4, '#c9a46a', C.ink, 1.1), circle(-2, -1, 0.7, '#8a6a3a', null), circle(2, 1, 0.7, '#8a6a3a', null));
const grain = (x: number, y: number, s = 1) => at(x, y, s, line('M0 10 L0 -8', '#c49a2c', 1.4), ...range(4).map((i) => all(ellipse(-2, -6 + i * 4, 1.6, 2.8, '#e0b23c', C.ink, 0.6), ellipse(2, -4 + i * 4, 1.6, 2.8, '#e0b23c', C.ink, 0.6))));
const euFlag = (x: number, y: number, w = 40) => all(rect(x, y, w, w * 0.66, '#1f3f9a', 1, C.ink, 1.2), ...range(12).map((i) => { const a = (i / 12) * Math.PI * 2, r = w * 0.22; return circle(f1(x + w / 2 + r * Math.cos(a)), f1(y + w * 0.33 + r * Math.sin(a)), f1(w * 0.03), '#f2c14e', null); }));
const passport = (x: number, y: number, s = 1, col: string = '#7a2a3a') => at(x, y, s, rect(-7, -10, 14, 20, col, 1.5, C.ink, 1.2), circle(0, -1, 3.4, 'none', GOLD, 1), line('M-3 6 L3 6', GOLD, 1));
const gate = (x: number, y: number, open: boolean) => at(x, y, 1, rect(-3, -30, 6, 30, '#d6d0c4', 1, C.ink, 1.2), open ? g('rotate(-70 0 -22)', rect(0, -24, 40, 5, C.white, 1, C.ink, 1.1), ...range(4).map((i) => rect(4 + i * 10, -24, 5, 5, RED, 0, null))) : all(rect(0, -24, 40, 5, C.white, 1, C.ink, 1.1), ...range(4).map((i) => rect(4 + i * 10, -24, 5, 5, RED, 0, null))));
const still = (x: number, y: number, s = 1) => at(x, y, s, path('M-14 0 C-18 -10 -16 -22 -6 -26 L6 -26 C16 -22 18 -10 14 0 Z', '#c87a3a', C.ink, 1.4), path('M-4 -26 L-4 -34 C-4 -38 4 -38 4 -34 L4 -26', '#c87a3a', C.ink, 1.3), path('M3 -34 C14 -40 22 -34 24 -24', 'none', '#c87a3a', 2.4), path('M20 -24 C30 -24 30 -18 20 -18 C30 -18 30 -12 20 -12 C30 -12 30 -6 24 -6', 'none', '#b06a2a', 2), line('M24 -6 L26 2', '#b06a2a', 2));
const loom = (x: number, y: number, s = 1, cloth: string = SWE) => at(x, y, s, line('M-14 0 L-14 -40 M14 0 L14 -40 M-16 -40 L16 -40', WOOD2, 2.4), rect(-11, -36, 22, 24, cloth, 0.5, C.ink, 1), ...range(5).map((i) => line(`M${-9 + i * 4.5} -36 L${-9 + i * 4.5} -12`, 'rgba(255,255,255,0.45)', 0.8)), line('M-14 -10 L14 -10', WOOD2, 2));
const rig = (x: number, y: number, s = 1) => at(x, y, s, ...[-18, -6, 6, 18].map((d) => line(`M${d} 0 L${d * 0.8} -26`, '#7d858e', 2.4)), rect(-24, -34, 48, 9, '#e0b23c', 1, C.ink, 1.3), rect(-16, -44, 18, 10, C.white, 1, C.ink, 1.1), line('M12 -34 L12 -70 M6 -70 L18 -70 M8 -62 L16 -62 M8 -54 L16 -54 M8 -46 L16 -46', '#7d858e', 1.6), path('M12 -70 L16 -62 L8 -62 Z M12 -62 L16 -54 L8 -54 Z M12 -54 L16 -46 L8 -46 Z', 'none', '#7d858e', 1));
const car = (x: number, y: number, s = 1, col: string = '#d64545') => at(x, y, s, path('M-18 0 L-18 -8 L-10 -9 L-5 -16 L8 -16 L13 -9 L18 -8 L18 0 Z', col, C.ink, 1.3), rect(-3, -14, 8, 5, '#bfe3f5', 1, null), circle(-10, 0, 4, C.dark, C.ink, 1), circle(10, 0, 4, C.dark, C.ink, 1));
const tv = (x: number, y: number, s = 1) => at(x, y, s, rect(-12, -10, 24, 18, WOOD, 2, C.ink, 1.3), rect(-9, -7, 15, 12, '#a8c8d8', 2, C.ink, 1), circle(9, -4, 1.4, C.ink, null), circle(9, 1, 1.4, C.ink, null), line('M-6 8 L-8 13 M6 8 L8 13', C.ink, 1.4));
const block = (x: number, y: number, w: number, h: number, col: string = '#e8dcc4') => all(rect(x, y - h, w, h, col, 1, C.ink, 1.4), ...range(Math.floor(h / 12)).flatMap((r) => range(Math.floor(w / 10)).map((c) => rect(x + 3 + c * 10, y - h + 4 + r * 12, 5, 6, '#7aa0c4', 0.5, C.ink, 0.8))));
const stalls = (x: number, y: number, s = 1, col: string = RED) => at(x, y, s, line('M-14 0 L-14 -24 M14 0 L14 -24', WOOD2, 2), path('M-17 -24 L17 -24 L14 -32 L-14 -32 Z', col, C.ink, 1.2), ...range(4).map((i) => path(`M${-17 + i * 8.5} -24 L${-12.75 + i * 8.5} -24 L${-10.5 + i * 7} -32 L${-14 + i * 7} -32 Z`, CREAM, null)), rect(-15, -10, 30, 4, WOOD, 1, C.ink, 1.1));
const scales = (x: number, y: number, s = 1) => at(x, y, s, line('M0 0 L0 -18 M-12 -16 L12 -16', C.ink, 1.6), path('M-16 -8 L-8 -8 L-12 -16 Z M8 -8 L16 -8 L12 -16 Z', 'none', C.ink, 0.9), ellipse(-12, -8, 5, 1.6, GOLD, C.ink, 1), ellipse(12, -8, 5, 1.6, GOLD, C.ink, 1), rect(-5, 0, 10, 2.4, WOOD2, 0.5, null));
const stoneCircle = (cx: number, cy: number, rx: number, ry: number, n = 10) => all(...range(n).map((i) => { const a = (i / n) * Math.PI * 2; return path(`M${f1(cx + rx * Math.cos(a) - 2.6)} ${f1(cy + ry * Math.sin(a))} L${f1(cx + rx * Math.cos(a) - 1.8)} ${f1(cy + ry * Math.sin(a) - 9)} L${f1(cx + rx * Math.cos(a) + 1.8)} ${f1(cy + ry * Math.sin(a) - 10)} L${f1(cx + rx * Math.cos(a) + 2.6)} ${f1(cy + ry * Math.sin(a))} Z`, '#a9a194', C.ink, 1); }));
const verse = (x: number, y: number, s = 1, col: string = SWE) => at(x, y, s, ...range(3).map((i) => path(`M-12 ${-6 + i * 6} q3 -3 6 0 q3 3 6 0 q3 -3 6 0 q3 3 6 0`, 'none', col, 1.4)));
const bubble = (x: number, y: number, w: number, h: number, inner: Svg, tailLeft = true) => all(rect(x - w / 2, y - h / 2, w, h, C.white, 6, C.ink, 1.4), path(tailLeft ? `M${x - w / 2 + 8} ${y + h / 2 - 0.5} L${x - w / 2 + 2} ${y + h / 2 + 8} L${x - w / 2 + 16} ${y + h / 2 - 0.5} Z` : `M${x + w / 2 - 8} ${y + h / 2 - 0.5} L${x + w / 2 - 2} ${y + h / 2 + 8} L${x + w / 2 - 16} ${y + h / 2 - 0.5} Z`, C.white, C.ink, 1.4), rect(x - w / 2 + 2, y + h / 2 - 3, 16, 3, C.white, 0, null), inner);
const angry = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 -6 L-2 -2 M8 -6 L2 -2 M-8 6 L-2 2 M8 6 L2 2', 'none', RED, 2));
const tear = (x: number, y: number) => path(`M${x} ${y} C${x + 2} ${y + 3} ${x + 2} ${y + 5} ${x} ${y + 5} C${x - 2} ${y + 5} ${x - 2} ${y + 3} ${x} ${y} Z`, '#8cc7e8', C.ink, 0.6);
const growth = (x: number, y: number, s = 1) => at(x, y, s, line('M0 0 L0 -34 M0 0 L40 0', C.ink, 1.6), ...[6, 12, 18, 26, 32].map((h, i) => rect(4 + i * 7, -h, 5, h, i === 4 ? HL : '#7fb46a', 0.5, C.ink, 0.8)), arrow(4, -8, 38, -36, HL, 2.2));
const oilDrops = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 C-6 -10 -2 -24 0 -32 C2 -24 6 -10 0 0 Z', '#2e2e36', C.ink, 1), ...[[-10, -26], [10, -28], [-14, -14], [13, -14]].map(([a, b]) => path(`M${a} ${b} C${a! - 2} ${b! + 3} ${a! + 2} ${b! + 3} ${a} ${b} Z M${a} ${b! - 3} C${a! - 3} ${b! + 3} ${a! + 3} ${b! + 3} ${a} ${b! - 3} Z`, '#2e2e36', null)));

export const NORDIC_HISTORY_MOTIFS: Record<string, Svg> = {
  // ── 2401 Vikingatida samhällen ──
  'nord.viking': all(skyBg(), sea(84), longship(84, 88, 0.6), rect(4, 96, 112, 16, '#e3d3a8', 0, null), viking(40, 0.95, '#4f7f5a', 'smile'), roundShield(26, 88, 9, RED), reach(40, 0.95, 1, 56, 74), axe(58, 70, 1, 10), ground),
  'nord.vikingatåg': all(skyBg(), sea(70), path('M86 70 C94 54 104 50 116 48 L116 70 Z', GRASS, C.ink, 1.4), church(106, 66, 0.42), house(94, 66, 0.8), longship(24, 76, 0.42), longship(46, 92, 0.42, true, '#e0b23c'), longship(18, 104, 0.36), arrow(60, 82, 84, 68, HL, 3)),
  'nord.långskepp': all(skyBg(), sea(80), longship(58, 86, 1.05), oars(58, 86, 1.05)),
  'nord.handelsplats': all(skyBg(), sea(92), rect(60, 88, 56, 4, WOOD, 1, C.ink, 1.1), longship(96, 98, 0.32, false), stalls(30, 92, 1, RED), stalls(70, 88, 0.8, SWE), sack(22, 80, 0.6), rect(30, 76, 9, 6, FUR, 1, C.ink, 1), silver(68, 78, 2.6), silver(74, 78, 2.6), scales(70, 77, 0.6),
    bust(14, 98, '#4f7f5a', bHelm, 1), bust(44, 98, '#b98a52', '', 1), bust(58, 94, C.orange, '', 0.9), bust(84, 92, C.purple, '', 0.9), rect(4, 104, 56, 8, '#d6c49a', 0, null)),
  'nord.ting.2': all(skyBg(), path('M4 70 C40 60 80 60 116 70 L116 112 L4 112 Z', GRASS, null), tree(102, 72, 1.1), stoneCircle(60, 92, 44, 12, 12),
    viking(60, 0.75, '#8a5a3a', 'calm', '#e2e2e2'), reach(60, 0.75, 1, 74, 58), palm(74, 54, 0.9), ...[[20, 1.05, '#4f7f5a'], [34, 1.0, '#5a6a80'], [88, 1.0, '#7a5a8a'], [102, 1.05, '#b98a52']].map(([x, s, col]) => bust(+x!, 92, col as string, '', +s!)), ...[[28, 104], [48, 106], [72, 106], [92, 104]].map(([x, y]) => bust(x!, y!, '#6b7a5a', '', 0.9))),
  'nord.lagman': all(skyBg(), path('M30 112 C36 84 84 84 90 112 Z', '#8fbf6f', C.ink, 1.4), viking(60, 0.8, '#5a6a80', 'calm', '#e2e2e2'), reach(60, 0.8, 1, 72, 64), palm(72, 60, 0.9),
    bubble(86, 22, 52, 28, all(scales(78, 32, 0.7), ...range(3).map((i) => line(`M90 ${15 + i * 6} L106 ${15 + i * 6}`, C.grey, 1.4))), true),
    ...[[12, 100], [24, 104], [100, 104], [110, 100]].map(([x, y]) => greyed(bust(x!, y!, '#888', '', 1)))),
  'nord.asatro': all(skyBg('#e6eef6'), path('M8 46 C8 34 28 32 32 40 C38 28 60 30 60 42 C70 36 84 40 82 50 L8 50 Z', C.white, C.ink, 1.2), path('M62 46 C62 34 82 32 86 40 C92 28 112 30 112 46 Z', C.white, C.ink, 1.2),
    g('translate(0 -64)', fig(34, RED, 'angry', { h: 0.42, bottom: '#6b5a44' }), on(34, 0.42, beardL('#c4732a')), at(46, 84, 0.6, rect(-5, -5, 10, 7, '#7d858e', 1, C.ink, 1), line('M0 2 L0 12', WOOD2, 2))),
    g('translate(0 -64)', fig(86, '#5a6a80', 'calm', { h: 0.42, bottom: '#3d3f4a' }), on(86, 0.42, beardL('#e2e2e2'), path('M-11 -60 C-11 -72 11 -72 11 -60 L16 -58 L-16 -58 Z', '#4a4a52', C.ink, 1), rect(-6, -59, 5, 4, C.ink, 1, null)), line('M97 98 L97 70', WOOD2, 1.4)),
    bolt(14, 32, 0.8), path('M104 10 C100 6 94 8 96 12 C92 12 92 16 96 16 L104 16 Z', C.black, C.ink, 0.8),
    ...[[30, 1], [52, 0.9], [72, 0.95], [94, 1]].map(([x, s]) => all(fig(+x!, '#b98a52', 'calm', { h: 0.48 * +s! }), reach(+x!, 0.48 * +s!, 1, +x! + 9, 62), palm(+x! + 9, 60, 0.6))), ground),
  'nord.skald': all(room(), rect(4, 96, 112, 16, '#c9a26a', 0, null), seated(92, 0.85, ROYAL, ROYAL, { throne: true, flip: true, hat: crownL() }), fig(36, '#3a8f8a', 'laugh', { h: 0.95, bottom: '#6b5a44' }), on(36, 0.95, beardL('#6b4a2e')), reach(36, 0.95, 1, 54, 60),
    bubble(48, 22, 48, 28, all(verse(40, 22, 0.8), at(58, 22, 0.25, longship(0, 0, 1))), false), ground),

  // ── 2402 Nordiska kungadömen ──
  'nord.kungadöme': all(skyBg(), path('M14 108 C10 80 20 58 34 46 C50 34 74 32 92 44 C108 56 112 84 104 108 Z', LAND, C.ink, 1.6), line('M14 108 C10 80 20 58 34 46 C50 34 74 32 92 44 C108 56 112 84 104 108', RED, 1.6, '4 3'),
    castle(60, 96, 0.55), house(28, 100, 0.8), house(92, 100, 0.8), farm(36, 76, 0.7), farm(86, 76, 0.7), crownBig(60, 18, 1), ground),
  'nord.rikssamling': all(skyBg(), ...[[22, 30, '#e8c88c'], [46, 22, '#c8dca8'], [22, 64, '#c8d8e8'], [46, 56, '#e8c0c0']].map(([x, y, col]) => all(rect(+x! - 11, +y! - 9, 22, 18, col as string, 3, C.ink, 1.2), bust(+x!, +y! - 1, '#8a6a48', '', 0.7))),
    arrow(62, 44, 74, 44, HL, 3), path('M78 24 L114 24 L114 66 L78 66 Z', LAND, C.ink, 1.6), line('M96 24 L96 66 M78 45 L114 45', C.grey2, 1, '3 3'), crownBig(96, 40, 0.9), king(96, 0.45, ROYAL), ground),
  'nord.stift': all(rect(4, 4, 112, 108, '#eef3e6', 3, null), path('M12 12 L60 8 L64 40 L40 56 L10 50 Z', '#e8dcc0', C.ink, 1.2), path('M60 8 L110 14 L108 60 L64 40 Z', '#dfe8cc', C.ink, 1.2), path('M10 50 L40 56 L46 108 L8 106 Z', '#e8d0c8', C.ink, 1.2),
    path('M40 56 L64 40 L108 60 L110 108 L46 108 Z', '#f6e2a0', C.ink, 2), church(80, 96, 0.5, CREAM), bust(66, 76, C.white, bMitre, 1.3), ring(76, 82, 30), ...[[26, 30], [86, 30], [24, 80]].map(([x, y]) => church(x!, y!, 0.25))),
  'nord.jarl': all(skyBg(), sea(92), longship(98, 100, 0.34), greyed(seated(30, 0.8, '#888', '#888', { throne: true, hat: crownL() })), fig(70, '#2f6a7a', 'smile', { h: 1.05, w: 1.15, bottom: '#3d3f4a' }), on(70, 1.05, cloakL(FUR), beardL('#c4732a'), path('M-10 -60 C-10 -71 10 -71 10 -60 Z', FUR, C.ink, 1.1)), sword(86, 90, 0.9, 10), reach(70, 1.05, 1, 86, 82), ground),
  'nord.tronstrid': all(room('#f2ebdc'), throne(60, 0.6), crownBig(60, 34, 0.8), fig(24, RED, 'angry', { h: 0.9 }), fig(96, SWE, 'angry', { h: 0.9 }), reach(24, 0.9, 1, 46, 38), reach(96, 0.9, -1, 74, 38), angry(60, 18, 0.9),
    greyed(bust(10, 98, '#888', '', 0.9), bust(110, 98, '#888', '', 0.9)), bust(8, 74, RED, '', 0.6), bust(112, 74, SWE, '', 0.6), ground),
  'nord.ledung': all(skyBg(), path('M60 52 C80 44 100 44 116 48 L116 64 L60 64 Z', GRASS, null), farm(74, 56, 0.6), farm(94, 54, 0.6), farm(110, 58, 0.5), sea(90), longship(84, 98, 0.62, false), line('M102 92 L102 66', WOOD2, 2), path('M102 66 L116 70 L102 76 Z', ROYAL, C.ink, 1),
    ...[[20, '#b98a52'], [44, '#8a6a48']].map(([x, col]) => all(farmer(+x!, 0.85, col as string))), sack(32, 92, 0.8), reach(20, 0.85, 1, 30, 84), line('M44 104 L62 70', WOOD2, 2.4), path('M62 70 L70 66 L66 74 Z', WOOD, C.ink, 1), reach(44, 0.85, 1, 54, 86), arrow(56, 100, 66, 100, HL, 2.4), ground),
  'nord.rusttjänst': all(skyBg(), path('M22 104 L26 84 L18 82 C16 74 24 64 34 64 L66 64 C76 64 82 68 86 74 L96 68 L100 74 L90 82 L84 84 L86 104 L80 104 L76 86 L36 86 L32 104 Z', '#7a5a3a', C.ink, 1.6), path('M86 74 L96 68 L100 74 L90 82 Z', '#6a4a2a', C.ink, 1.2),
    g('translate(0 -20)', fig(52, '#a9b0b8', 'smile', { h: 0.62, bottom: '#7d858e' }), on(52, 0.62, path('M-11 -56 C-11 -72 11 -72 11 -56 Z', '#a9b0b8', C.ink, 1.3)), rect(36, 56, 8, 22, RED, 1, C.ink, 1), sword(64, 60, 0.7, 30)), path('M38 66 C40 80 64 80 66 66 Z', '#7a5a3a', C.ink, 1.4),
    at(100, 26, 1, sack(0, 0, 1, GOLD), coin(-8, 10, 4)), noSign(100, 30, 15), ground),
  'nord.korståg': all(skyBg(), sea(84), path('M90 84 C96 66 106 60 116 60 L116 84 Z', GRASS, C.ink, 1.4), longship(46, 92, 0.55, true, C.white),
    ...[[24, 0.62], [40, 0.66]].map(([x, s]) => all(fig(+x!, C.white, 'calm', { h: +s!, bottom: '#7d858e' }), on(+x!, +s!, path('M-11 -56 C-11 -72 11 -72 11 -56 Z', '#a9b0b8', C.ink, 1.3), line('M0 -38 L0 -10 M-8 -28 L8 -28', RED, 3.4)))).map((k) => g('translate(14 -24)', k)),
    path('M50 30 L50 6 L66 10 L50 16', 'none', C.ink, 1.4), path('M50 6 L66 10 L50 16 Z', C.white, C.ink, 1), line('M55 8 L55 14 M52 11 L60 11', RED, 1.6), arrow(76, 74, 96, 64, HL, 3)),

  // ── 2403 Kalmarunionen ──
  'nord.unionskung': all(room('#f2ebdc'), king(60, 0.95, ROYAL), ...[[18, 'dk'], [60, 'no'], [102, 'se']].map(([x, k]) => all(flag(+x! - 12, 14, k as Fl, 24))), path('M18 32 L52 54 M60 32 L60 48 M102 32 L68 54', 'none', GOLD, 2.2), ground),
  'nord.kröning': all(rect(4, 4, 112, 108, '#efe4cf', 3, null), path('M30 4 L30 70 C30 40 90 40 90 70 L90 4', 'none', '#c9b896', 3), kneel(44, 0.95, ROYAL, ROYAL), bishop(90, 0.95), reach(90, 0.95, -1, 60, 44), crownBig(52, 46, 0.42), sparkleRing(52, 44),
    ...[12, 22, 108].map((x, i) => bust(x, 96 - (i % 2) * 6, i === 2 ? '#2f6a7a' : RED, '', 0.9)), ground),
  'nord.riksföreståndare': all(room('#f2ebdc'), greyed(throne(36, 0.7)), at(36, 64, 0.6, rect(-14, 0, 28, 6, '#b23a3a', 2, C.ink, 1)), crownBig(36, 58, 0.45), fig(82, '#2f4a7a', 'smile', { h: 1.0, bottom: '#3d3f4a' }), on(82, 1.0, cloakL('#6b4a2e'), chainL()),
    reach(82, 1, 1, 98, 74), line('M98 100 L98 40', WOOD2, 2.6), circle(98, 38, 3, GOLD, C.ink, 1), noSign(36, 50, 10), bust(102, 104, '#6b7a5a', '', 0.8), ground),
  'nord.bergsman': all(skyBg(), path('M4 40 C30 26 56 30 76 44 C88 52 100 52 116 46 L116 112 L4 112 Z', '#9a9690', C.ink, 1.4), path('M20 112 L20 78 C20 64 40 64 40 78 L40 112 Z', '#3a3530', C.ink, 1.4), line('M20 78 L40 78', WOOD2, 3),
    farm(98, 60, 0.9), fig(66, '#8a5a3a', 'smile', { h: 0.95, bottom: '#6b5a44' }), on(66, 0.95, capL('#6b4a2e')), pick(84, 80, 1, 30), reach(66, 0.95, 1, 80, 82), ...[0, 1, 2].map((i) => rect(44 + i * 7, 104 - i * 3, 12, 4, '#4a4a52', 0.5, C.ink, 0.8)), ground),
  'nord.bondeuppror': all(skyBg('#f2dccc'), castle(96, 76, 0.5), flameS(84, 40, 0.8), flameS(108, 42, 0.7), smoke(96, 30, 0.8),
    ...[[18, '#b98a52', 0.9], [38, '#8a6a48', 1], [58, '#a07040', 0.95]].map(([x, col, s]) => all(farmer(+x!, +s!, col as string, 'angry'))), fork(28, 62, 1, 10), reach(18, 0.9, 1, 28, 66), axe(48, 56, 1, 10), reach(38, 1, 1, 48, 62), fork(70, 62, 1, 15), reach(58, 0.95, 1, 68, 66), arrow(70, 100, 82, 100, HL, 2.6), ground),
  'nord.blodbad': all(rect(4, 4, 112, 108, '#e9e1d4', 3, null), ...[[8, 26], [30, 30], [52, 24], [74, 32], [96, 26]].map(([x, y]) => all(rect(x!, y!, 18, 70 - y!, '#d8b88c', 0.5, C.ink, 1.2), path(`M${x} ${y} L${x! + 9} ${y! - 12} L${x! + 18} ${y} Z`, '#b5452e', C.ink, 1.2), rect(x! + 6, y! + 8, 6, 7, '#5a6a80', 0.5, null))),
    rect(4, 70, 112, 42, '#cfc6b6', 0, null), path('M18 86 C30 78 52 80 64 84 C80 80 100 82 104 92 C96 104 70 106 56 102 C40 106 20 102 18 86 Z', '#9a1f1f', null), ...[[28, 92], [48, 96], [66, 90], [86, 96], [38, 86], [76, 100]].map(([x, y]) => greyed(path(`M${x! - 7} ${y} L${x! + 7} ${y} L${x! + 4} ${y! - 4} L${x! - 4} ${y! - 4} Z`, '#555', C.ink, 1))), sword(60, 70, 1, 90)),
  'nord.avrätta': all(rect(4, 4, 112, 108, '#e3dccd', 3, null), rect(4, 84, 112, 28, '#bfb39c', 0, null), rect(10, 78, 100, 8, WOOD, 1, C.ink, 1.4),
    fig(86, C.black, 'calm', { h: 0.95, bottom: C.black }), on(86, 0.95, path('M-11 -48 C-13 -66 -8 -70 0 -70 C8 -70 13 -66 11 -48 Z', C.black, C.ink, 1.2), rect(-7, -60, 14, 4, C.skin, 1, null)), axe(70, 26, 1.6, -40), reach(86, 0.95, -1, 72, 36),
    kneel(36, 0.62, '#c8c0b0', '#8d949c'), greyed(rect(48, 62, 16, 12, WOOD2, 1, C.ink, 1)), bust(14, 102, '#6b7a5a', '', 0.9), bust(28, 106, '#7a5a8a', '', 0.9), ground),
  'nord.amnesti': all(room('#efe8dc'), rect(54, 20, 58, 84, '#9a9690', 1, C.ink, 1.6), path('M60 104 L60 30 L86 30 L86 104', 'none', C.dark, 2), ...range(5).map((i) => line(`M${60 + i * 6.5} 30 L${60 + i * 6.5} 104`, '#4a4a52', 2)).map((k) => g('translate(30 0) rotate(0)', k)),
    king(26, 0.95, ROYAL), reach(26, 0.95, 1, 42, 70), palm(42, 66, 1), fig(70, '#c8b89a', 'laugh', { h: 0.85, bottom: '#8d949c' }), chainBroken(56, 94, 0.8), arrow(76, 50, 56, 50, HL, 2.6), ground),
  'nord.befrielsekrig': all(skyBg(), line('M70 112 L70 22', RED, 2, '5 4'), ...[[16, '#b98a52'], [32, '#8a6a48'], [48, '#3f6fb5']].map(([x, col]) => all(farmer(+x!, 0.85, col as string, 'angry'))), fork(26, 64, 0.9, 20), reach(16, 0.85, 1, 26, 68), line('M56 96 L56 40', WOOD2, 2), path('M56 40 L74 44 L56 52 Z', '#fecc00', C.ink, 1), reach(48, 0.85, 1, 56, 68),
    greyed(...[[86, 0.8], [104, 0.8]].map(([x, s]) => all(fig(+x!, '#888', 'shock', { h: +s! }), on(+x!, +s!, soldierHelm('#888'))))), arrow(72, 60, 112, 60, HL, 3), chainBroken(30, 30, 0.9), ground),

  // ── 2404 Svensk stormaktstid ──
  'nord.stormaktstid': all(nordicMap('#e8e2d0'), path('M58 4 L116 4 L116 74 C104 78 96 70 92 60 C88 50 80 44 76 34 C70 26 62 18 58 4 Z', SWE, C.ink, 1.4), path('M4 40 C20 36 36 40 44 50 C46 60 46 72 42 82 C32 92 18 92 4 96 Z', SWE, C.ink, 1.4), path('M30 104 C44 100 58 100 74 98 L80 112 L28 112 Z', SWE, C.ink, 1.4),
    cal(30, 18, '1611', 0.8), cal(92, 92, '1721', 0.8), crownBig(84, 30, 0.6)),
  'nord.trettioåriga-kriget': all(skyBg('#ece6da'), smoke(30, 46, 0.8), smoke(90, 40, 0.8), at(70, 104, 1, path('M-14 0 L-10 -10 L10 -12 L14 -2 Z', '#4a4a52', C.ink, 1.2), circle(-8, 0, 6, WOOD, C.ink, 1.2), circle(8, 0, 6, WOOD, C.ink, 1.2), path('M10 -12 L22 -16 L22 -10 L14 -2', '#4a4a52', C.ink, 1.2)),
    ...[[22, SWE], [42, '#fecc00']].map(([x, col]) => all(fig(+x!, col as string, 'angry', { h: 0.8, bottom: '#3d3f4a' }), on(+x!, 0.8, path('M-14 -62 C-6 -68 6 -68 14 -62 L8 -70 C3 -67 -3 -67 -8 -70 Z', C.black, C.ink, 1)))), musket(32, 76, 1, 40), musket(52, 76, 1, 40),
    rect(78, 14, 34, 22, C.white, 2, C.ink, 1.4), num(95, 31, '30', 15, RED), ground),
  'nord.rikskansler': all(room('#f2ebdc'), greyed(throne(26, 0.6)), at(26, 70, 0.5, crownBig(0, 0, 1)), rect(48, 80, 64, 6, WOOD, 2, C.ink, 1.4), line('M54 86 L54 112 M106 86 L106 112', WOOD2, 3),
    fig(80, C.black, 'calm', { h: 1.0, bottom: C.black }), on(80, 1, beardL('#e2e2e2'), chainL(), path('M-12 -42 L12 -42 L13 -36 L-13 -36 Z', C.white, C.ink, 0.8)), doc(62, 72, 0.7), seal(68, 78, 0.8), reach(80, 1, -1, 66, 72), doc(98, 72, 0.7), reach(80, 1, 1, 96, 70), line('M100 68 L106 56', C.dark, 1.4), ground),
  'nord.förmyndarregering': all(room('#f2ebdc'), seated(60, 0.55, ROYAL, ROYAL, { throne: true, hat: crownL() }), ...[[16, C.black], [32, '#2f4a7a'], [88, '#5a6a80'], [104, C.black]].map(([x, col]) => all(fig(+x!, col as string, 'calm', { h: 0.95, bottom: '#3d3f4a' }), on(+x!, 0.95, beardL('#6b4a2e')))), doc(46, 52, 0.6), doc(74, 52, 0.6), ring(60, 70, 18), ground),
  'nord.regalskepp': all(skyBg(), sea(86), bigShip(60, 92, 0.95, '#6a3a24', 2, SWE)),
  'nord.utskrivning': all(skyBg(), farm(100, 56, 0.9), fig(26, '#2f4a7a', 'calm', { h: 1.0, bottom: '#e6d3b3' }), on(26, 1, tricornL('#2f4a7a')), doc(42, 66, 0.7), reach(26, 1, 1, 40, 66),
    fig(62, '#b98a52', 'frown', { h: 0.9, bottom: '#6b5a44' }), musket(74, 74, 1, 0), reach(62, 0.9, 1, 74, 72), ring(62, 74, 26), fig(98, '#a0507a', 'frown', { h: 0.85, hairStyle: 'long', bottom: '#6b5a44' }), tear(94, 52), fig(112, '#8a6a48', 'frown', { h: 0.6 }), ground),
  'nord.landvinning': all(rect(4, 4, 112, 108, SEA, 3, null), path('M4 4 L60 4 L56 50 L4 60 Z', SWE, C.ink, 1.6), path('M60 4 L116 4 L116 60 L56 50 Z', '#c9ced4', C.ink, 1.4), path('M4 60 L56 50 L60 90 L4 100 Z', '#f2c14e', C.ink, 2), path('M56 50 L116 60 L116 100 L60 90 Z', '#c9ced4', C.ink, 1.4),
    line('M4 60 L56 50 L60 90 L4 100', SWE, 2, '5 3'), arrow(30, 34, 30, 70, HL, 3.4), poleFlag(42, 88, 'se', 14)),
  'nord.abdikera': all(room('#f2ebdc'), throne(28, 0.75), at(28, 70, 0.7, rect(-14, 0, 28, 6, '#b23a3a', 2, C.ink, 1)), crownBig(28, 64, 0.5), fig(80, ROYAL, 'calm', { h: 0.95, hairStyle: 'long', bottom: ROYAL }), on(80, 0.95, chainL()), reach(80, 0.95, -1, 52, 64), palm(52, 62, 0.8), arrow(88, 104, 112, 104, HL, 2.6), ring(28, 64, 13), ground),
  'nord.reduktion': all(skyBg(), manor(30, 92, 0.6), field(8, 96, 44, 12), fig(26, '#5a6a80', 'frown', { h: 0.55, bottom: '#3d3f4a' }), coin(48, 48, 4), castle(92, 92, 0.42), crownBig(92, 30, 0.6), path('M54 66 C64 56 70 56 78 62', 'none', HL, 3), path('M76 56 L80 64 L72 66 Z', HL, HL, 1),
    farm(64, 104, 0.6), ...range(5).map((i) => coin(80 + i * 8, 108 - (i % 2) * 2, 3.4)), ground),

  // ── 2405 Frihetstiden ──
  'nord.frihetstid': all(room('#f2ebdc'), chamber(60, 92, 1.3, [SWE, RED, C.green, GOLD]), greyed(crownBig(60, 26, 0.7)), at(60, 26, 1, line('M-14 -8 L14 8', '#7d858e', 2)), cal(18, 20, '1719', 0.7), cal(102, 20, '1772', 0.7), ground),
  'nord.regeringsform': all(room(), at(60, 58, 2.6, path('M-16 -20 L12 -20 L16 -16 L16 20 L-16 20 Z', CREAM, C.ink, 0.6)), crownBig(60, 26, 0.5), chamber(60, 86, 0.7), arrow(60, 36, 60, 54, HL, 2), arrow(44, 56, 52, 60, HL, 1.6), seal(92, 94, 1.4), line('M28 104 L52 104', C.grey, 1.6)),
  'nord.ståndsriksdag': all(room('#f2ebdc'), ...[
    [18, '#2f4a7a', all(bWig)], [46, C.black, all(path('M-2 6 L0 9 L2 6 Z', C.white, null))], [74, '#5a6a80', bHat], [102, '#b98a52', bStraw]].map(([x, col, hat]) => all(rect(+x! - 13, 40, 26, 64, C.white, 3, C.ink, 1.2), bust(+x!, 54, col as string, hat as string, 1.2), bust(+x! - 6, 76, col as string, hat as string, 1), bust(+x! + 6, 76, col as string, hat as string, 1), bust(+x!, 94, col as string, hat as string, 1))), crownBig(60, 20, 0.5), ground),
  'nord.partistrid': all(room(), ...[[18, '#2f4a7a'], [34, '#2f4a7a']].map(([x, col]) => all(fig(+x!, col as string, 'angry', { h: 0.9, bottom: '#3d3f4a' }), on(+x!, 0.9, tricornL()))), ...[[86, '#7a3a3a'], [102, '#7a3a3a']].map(([x, col]) => all(fig(+x!, col as string, 'angry', { h: 0.9, bottom: '#3d3f4a' }), on(+x!, 0.9, path('M-10 -60 C-10 -72 10 -72 10 -60 Z', '#6b4a2e', C.ink, 1.1)))),
    reach(34, 0.9, 1, 48, 50), reach(86, 0.9, -1, 72, 50), bolt(60, 34, 1.2), angry(28, 14, 0.8), angry(94, 14, 0.8), ground),
  'nord.merkantilism': all(rect(4, 4, 112, 108, '#eef3e6', 3, null), path('M8 20 L52 20 L52 100 L8 100 Z', SWE, C.ink, 1.6), sack(30, 80, 1.4, GOLD), ...range(6).map((i) => coin(18 + (i % 3) * 12, 52 - Math.floor(i / 3) * 10, 5)),
    arrow(56, 40, 106, 40, HL, 6), crate(84, 30, 0.9), crate(98, 30, 0.9), arrow(106, 84, 60, 84, C.grey, 1.6), crate(84, 76, 0.6), arrow(100, 62, 60, 62, '#3a9a5a', 3), coin(84, 56, 4), coin(94, 56, 4)),
  'nord.manufaktur': all(room('#efe4cf'), rect(4, 4, 112, 20, '#d8c8a8', 0, null), ...range(4).map((i) => rect(12 + i * 28, 8, 12, 12, '#bfe3f5', 1, C.ink, 1)), loom(26, 104, 0.9, SWE), loom(66, 104, 0.9, RED), loom(104, 104, 0.8, C.green),
    seated(14, 0.45, '#b98a52', '#6b5a44', {}), seated(54, 0.45, '#a0507a', '#6b5a44', {}), seated(92, 0.42, '#5a6a80', '#6b5a44', {}), ground),
  'nord.ostindiefarare': all(skyBg(), sea(84), bigShip(44, 90, 0.75, '#5a3a24', 1, SWE), rect(88, 70, 26, 14, CREAM, 1, null), crate(94, 78, 0.8, '#a8743f'), pot(106, 76, 1.4), path('M96 66 C96 60 104 60 104 66 Z', '#3a8f5a', C.ink, 0.9), circle(100, 64, 2, '#3a8f5a', null)),

  // ── 2406 Sverige under 1800-talet ──
  'nord.personalunion': all(skyBg(), king(60, 0.75, ROYAL), poleFlag(16, 108, 'se', 18), chamberHouse(32, 104, SWE), poleFlag(104, 108, 'no', 18), chamberHouse(88, 104, '#ba0c2f'), path('M48 42 L36 70 M72 42 L84 70', 'none', GOLD, 2.4), line('M60 76 L60 112', C.grey, 2, '4 4'), ground),
  'nord.agrarsamhälle': all(skyBg(), path('M4 54 C40 46 80 46 116 52 L116 112 L4 112 Z', GRASS, null), field(8, 66, 40, 18), field(56, 62, 52, 16, '#d8c070'), field(14, 90, 36, 14, '#c8dca0'), farm(62, 100, 0.8), farm(100, 100, 0.8), farm(36, 60, 0.6),
    farmer(84, 0.6, '#b98a52'), farmer(28, 0.55, '#a0507a'), greyed(...[0, 1, 2].map((i) => rect(96 + i * 6, 36 - i * 2, 5, 12 + i * 2, '#888', 0.5, C.ink, 0.8))), ground),
  'nord.laga-skifte': all(rect(4, 4, 112, 108, '#eef3e6', 3, null), greyed(...range(9).map((i) => rect(8 + i * 5, 14, 4, 34, i % 2 ? '#bbb' : '#ddd', 0, C.ink, 0.5)), ...range(9).map((i) => rect(8 + i * 5, 52, 4, 30, i % 2 ? '#ddd' : '#bbb', 0, C.ink, 0.5)), farm(30, 92, 0.5), farm(40, 98, 0.5), farm(22, 100, 0.5)),
    arrow(56, 58, 66, 58, HL, 3), rect(70, 12, 42, 30, FIELD, 2, C.ink, 1.2), rect(70, 46, 20, 60, '#c8dca0', 2, C.ink, 1.2), rect(92, 46, 20, 60, '#e0c890', 2, C.ink, 1.2), farm(92, 34, 0.55), farm(80, 70, 0.55), farm(104, 96, 0.55)),
  'nord.brännvin': all(room(), rect(4, 86, 112, 26, WOOD, 0, C.ink, 1.2), bottle(48, 70, 1.6), shotGlass(78, 80, 1.6), potato(92, 96, 1), potato(104, 98, 0.9), grain(22, 92, 1.4), ground),
  'nord.husbehovsbränning': all(room('#efe4cf'), rect(4, 4, 30, 108, '#d8c8a8', 0, null), flameS(46, 104, 0.8), still(46, 96, 1.2), bottle(78, 100, 0.8), ...[[96, 104], [104, 100], [110, 106]].map(([x, y]) => potato(x!, y!, 0.8)), fig(22, '#b98a52', 'smile', { h: 0.8, bottom: '#6b5a44' }), farm(98, 40, 0.8)),
  'nord.representationsreform': all(room('#f2ebdc'), greyed(...[[14, bWig], [30, ''], [14, bHat], [30, bStraw]].map(([h], i) => all(rect(6 + (i % 2) * 18, 30 + Math.floor(i / 2) * 34, 16, 30, '#ddd', 2, C.ink, 1), bust(14 + (i % 2) * 18, 46 + Math.floor(i / 2) * 34, '#888', h as string, 0.9)))),
    arrow(46, 62, 62, 62, HL, 3), chamber(90, 50, 0.6, [SWE]), chamber(90, 96, 0.6, [RED]), num(112, 46, '1', 9), num(112, 92, '2', 9), cal(26, 14, '1866', 0.6)),
  'nord.tvåkammarriksdag': all(room('#f2ebdc'), rect(8, 30, 104, 78, '#ece4d4', 3, C.ink, 1.4), path('M8 30 L60 8 L112 30 Z', STONE, C.ink, 1.4), line('M60 30 L60 108', C.ink, 2), chamber(34, 94, 0.62, [SWE]), chamber(86, 94, 0.62, [RED]), circle(34, 48, 8, C.white, C.ink, 1.2), num(34, 52, '1', 10), circle(86, 48, 8, C.white, C.ink, 1.2), num(86, 52, '2', 10)),

  // ── 2407 Nordens moderna utveckling ──
  'nord.ockupation': all(skyBg('#e6e3dc'), house(20, 70, 1.6), house(100, 70, 1.6, '#e0c060'), ...[[50, 0.85], [66, 0.85], [82, 0.85]].map(([x, s]) => all(fig(+x!, '#5b6650', 'calm', { h: +s!, bottom: '#4a5240' }), on(+x!, +s!, soldierHelm()))), poleFlag(96, 104, 'grey', 16), arrow(28, 104, 44, 104, HL, 2.4),
    fig(14, '#c84a3c', 'frown', { h: 0.6, hairStyle: 'long' }), fig(110, SWE, 'frown', { h: 0.55 }), ground),
  'nord.neutralitetspolitik': all(skyBg(), ellipse(22, 74, 18, 32, 'rgba(214,69,69,0.12)', RED, 1.4), ellipse(98, 74, 18, 32, 'rgba(63,111,181,0.12)', SWE, 1.4), ...[[16, 60], [28, 72], [16, 88]].map(([x, y]) => bust(x!, y!, RED, '', 0.9)), ...[[92, 60], [104, 72], [92, 88]].map(([x, y]) => bust(x!, y!, SWE, '', 0.9)),
    fig(60, '#fecc00', 'calm', { h: 0.85, bottom: '#006aa7' }), reach(60, 0.85, -1, 44, 70), reach(60, 0.85, 1, 76, 70), palm(44, 66, 0.8), palm(76, 66, 0.8), doc(60, 20, 0.9), at(60, 20, 0.5, path('M-8 0 L-3 5 L8 -6', 'none', '#3a9a5a', 3)), ground),
  'nord.rekordåren': all(skyBg(), block(64, 112, 48, 72), car(30, 106, 1), tv(46, 62, 1.1), fig(18, '#d64545', 'laugh', { h: 0.7, hairStyle: 'long' }), growth(76, 34, 0.7), cal(28, 22, '1960', 0.7), ground),
  'nord.Nordiska-rådet': all(room(), ...(['dk', 'fi', 'is', 'no', 'se'] as Fl[]).map((k, i) => flag(10 + i * 21, 12, k, 18)), ellipse(60, 84, 48, 12, '#b98a52', C.ink, 1.6), line('M20 92 L20 112 M100 92 L100 112', WOOD2, 3),
    ...[[18, 70, RED], [38, 64, '#003580'], [60, 62, '#02529c'], [82, 64, '#ba0c2f'], [102, 70, '#006aa7']].map(([x, y, col]) => bust(+x!, +y!, col as string, '', 1.3)), doc(48, 84, 0.4), doc(72, 84, 0.4)),
  'nord.passunion': all(skyBg(), poleFlag(12, 108, 'se', 16), poleFlag(108, 108, 'no', 16), gate(60, 108, true), fig(78, C.orange, 'smile', { h: 0.85 }), at(96, 100, 1, rect(-7, -8, 14, 14, RED, 3, C.ink, 1.3), path('M-3 -8 L-3 -12 L3 -12 L3 -8', 'none', C.ink, 1.3)), reach(78, 0.85, 1, 92, 84), arrow(36, 104, 52, 104, HL, 2.4), passport(36, 34, 1.4), noSign(36, 34, 15), ground),
  'nord.EU-medlemskap': all(skyBg(), euFlag(54, 16, 56), house(28, 96, 2), poleFlag(46, 108, 'se', 14), arrow(42, 54, 62, 40, HL, 3), fig(88, '#3a8f8a', 'smile', { h: 0.65 }), passportCard(100, 92), ground),
  'nord.oljefynd': all(skyBg(), sea(80), rig(60, 86, 1), oilDrops(96, 58, 0.9), g('translate(0 -34)', fig(30, C.orange, 'laugh', { h: 0.5, bottom: C.navy }), on(30, 0.5, soldierHelm(C.yellow))), coin(102, 50, 5), coin(110, 60, 4)),
};

function sparkleRing(x: number, y: number): Svg { return all(...range(6).map((i) => { const a = (i / 6) * Math.PI * 2; return line(`M${f1(x + 14 * Math.cos(a))} ${f1(y + 14 * Math.sin(a))} L${f1(x + 18 * Math.cos(a))} ${f1(y + 18 * Math.sin(a))}`, GOLD, 1.8); })); }
function chamberHouse(x: number, y: number, roof: string): Svg { return all(rect(x - 12, y - 18, 24, 18, CREAM, 1, C.ink, 1.2), path(`M${x - 14} ${y - 18} L${x} ${y - 28} L${x + 14} ${y - 18} Z`, roof, C.ink, 1.2), ...range(3).map((i) => rect(x - 8 + i * 6, y - 14, 3, 10, '#7aa0c4', 0.5, null))); }
function passportCard(x: number, y: number): Svg { return all(rect(x - 9, y - 6, 18, 12, '#1f3f9a', 1.5, C.ink, 1.1), circle(x - 3, y, 2.6, 'none', '#f2c14e', 0.9), line(`M${x + 1} ${y - 2} L${x + 6} ${y - 2} M${x + 1} ${y + 2} L${x + 6} ${y + 2}`, C.white, 1)); }
