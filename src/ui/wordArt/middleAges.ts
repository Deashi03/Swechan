/**
 * Historia & humaniora → Historiska epoker → Medeltiden, 1921–1927 (0.36): feudalism and vassals, peasants
 * and estates, monasteries and the church, trading towns and guilds, the Black Death, medieval kingship and
 * everyday life. The pictures are small scenes built from a few recurring signs: a crowned king (often on a
 * red throne), a kneeling man, a monk in a brown hooded robe and a nun in a black veil, a bishop's mitre and
 * staff, a stone church with a tower, a stone castle, a big white manor house, a log cabin with a turf roof,
 * fields with stripes, grain sacks and coins, and a one-masted cog. A grey copy of a figure or a thing
 * stands beside the coloured one where the contrast carries the meaning. Digits only; no words in the
 * pictures and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm, bubble, cloud, bolt, shield } from './people';
import { P as F, type Mood, greyed } from './blindFix';
import { checkIcon, starIcon } from './labelIcons';

// ── Colours ──────────────────────────────────────────────────────────
const RED = '#c8372d';
const GOLD = C.gold;
const ROYAL = '#7b3fa0';
const ROBE = '#7a5236';
const STONE = '#c9c1b2';
const STONE2 = '#a99f8e';
const LOG = '#a8743f';
const TURF = '#6f9a4f';
const FIELD = '#e8cf73';
const GRASS = '#9fcb84';
const WATER = '#9fd0ea';
const CREAM = '#f3ead7';
const FUR = '#f1ebdf';
const GREY = '#8d949c';
const f1 = (n: number) => n.toFixed(1);

// ── Figures ──────────────────────────────────────────────────────────
const ground = line('M4 112 L116 112', C.grey2, 2);
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, hy: ty - 56 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number, skin: string = C.skin) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, 3 * Math.max(0.6, h), skin, C.ink, 1.2)); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
const gfig = (x: number, more: Partial<Build> = {}) => F({ x, grey: true, ...more });
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
const lo = (d: string, col: string, w: number) => line(d, C.ink, w + 2) + line(d, col, w);
// head accessories in standing-figure coordinates (head centre 0,−56)
const crownL = (col: string = GOLD) => path('M-9 -63 L-9.5 -74 L-4.5 -68.5 L0 -76 L4.5 -68.5 L9.5 -74 L9 -63 Z', col, C.ink, 1.3);
const mitreL = () => all(path('M-8.5 -63 L-8 -73 L0 -87 L8 -73 L8.5 -63 Z', C.white, C.ink, 1.3), line('M0 -85 L0 -64', GOLD, 2), line('M-8.3 -66 L8.3 -66', GOLD, 2));
const faceL = (mood: 'smile' | 'sad' = 'smile') => all(circle(0, -55, 7.4, C.skin, C.ink, 1.1), circle(-3, -56, 1.1, C.ink, null), circle(3, -56, 1.1, C.ink, null), line(mood === 'sad' ? 'M-2.6 -50.6 Q0 -52.6 2.6 -50.6' : 'M-2.6 -51.6 Q0 -49.4 2.6 -51.6', C.ink, 1.2));
const veilL = () => all(path('M-12 -56 C-13 -71 13 -71 12 -56 L14 -36 L-14 -36 Z', C.black, C.ink, 1.3), path('M-9 -61 C-5 -65.5 5 -65.5 9 -61 L9 -49 C5 -44.5 -5 -44.5 -9 -49 Z', C.white, C.ink, 0.8), faceL());
const hoodL = () => path('M-13.5 -46 C-16 -64 -10 -72.5 0 -72.5 C10 -72.5 16 -64 13.5 -46 Z', ROBE, C.ink, 1.4);
const beltL = () => line('M-12 -18 L12 -18 M5 -18 L7 -6', '#e3cf9e', 2);
const beardL = (col: string = '#e2e2e2') => path('M-7.5 -53 C-7 -41 7 -41 7.5 -53 C4 -50 -4 -50 -7.5 -53 Z', col, C.ink, 1);
const strawL = () => all(ellipse(0, -63, 14, 3, '#e8c870', C.ink, 1.1), path('M-7 -63 C-7 -72 7 -72 7 -63 Z', '#e8c870', C.ink, 1.1));
const furHatL = (col: string = '#6b4a2e') => all(path('M-9 -61 C-9 -73 9 -73 9 -61 Z', RED, C.ink, 1.1), rect(-10.5, -64, 21, 5, col, 2.5, C.ink, 1));
const chainL = () => all(path('M-11 -40 C-7 -27 7 -27 11 -40', 'none', GOLD, 2.6), circle(0, -28.5, 3, GOLD, C.ink, 0.9));
const haloL = () => circle(0, -57, 15, 'none', GOLD, 2.8);
const capL = (col: string) => path('M-10 -60 C-10 -70 10 -70 10 -60 L12 -58 L-12 -58 Z', col, C.ink, 1.1);
const helmetL = () => all(path('M-10.5 -55 C-10.5 -70 10.5 -70 10.5 -55 Z', C.silver, C.ink, 1.3), line('M0 -67 L0 -55', GREY, 1.2));
const apronL = (col: string = '#d8c3a0') => path('M-9 -30 L9 -30 L11 4 L-11 4 Z', col, C.ink, 1.2);
const crosierL = (side: -1 | 1 = 1) => g(side < 0 ? 'scale(-1 1)' : '', path('M21 2 L21 -74 C21 -86 33 -86 33 -77 C33 -71 26 -71 26 -76', 'none', GOLD, 3), path('M21 2 L21 -74 C21 -86 33 -86 33 -77 C33 -71 26 -71 26 -76', 'none', C.ink, 0.7));
const staffL = () => lo('M23 2 L23 -72', LOG, 2.4);
/** A crowned king standing at x. */
const king = (x: number, h = 1, col: string = ROYAL, mood: Mood = 'smile') => all(fig(x, col, mood, { h, bottom: col }), on(x, h, chainL(), crownL()));
const monk = (x: number, h = 1, mood: Mood = 'calm') => all(on(x, h, hoodL()), fig(x, ROBE, mood, { h, bottom: ROBE }), on(x, h, beltL()));
const nun = (x: number, h = 1) => all(fig(x, C.black, 'calm', { h, bottom: C.black }), on(x, h, veilL()));
const peasant = (x: number, h = 1, top = '#b98a52', mood: Mood = 'smile', more: Partial<Build> = {}) => all(fig(x, top, mood, { h, bottom: '#6b5a44', ...more }), on(x, h, strawL()));

// seated figure facing right; local: feet at y 0, head centre (−5, −66)
type SO = { hair?: string; skin?: string; mood?: 'smile' | 'sad' | 'calm' };
const seatedL = (top: string, bottom: string, o: SO = {}) => {
  const sk = o.skin ?? C.skin, hr = o.hair ?? C.hair;
  return all(lo('M-4 -24 L12 -24 L13 -3', bottom, 8.5), ellipse(16, -1.5, 6, 3, C.black, C.ink, 1),
    path('M-15 -54 L5 -54 C7 -42 7 -30 6 -21 L-14 -21 C-16 -32 -16 -44 -15 -54 Z', top, C.ink, 1.8),
    rect(-8, -61, 6, 8, sk, 2, C.ink, 1.2), circle(-5, -66, 9.5, sk, C.ink, 1.8),
    path('M-14.5 -68 C-14 -80.5 4 -80.5 4.5 -68 C0 -72 -10 -72 -14.5 -68 Z', hr, C.ink, 1.4),
    circle(-1, -66, 1.2, C.ink, null), line(o.mood === 'sad' ? 'M-3.5 -60.5 Q-1 -62.5 1.5 -60.5' : 'M-3.5 -61.5 Q-1 -59.5 1.5 -61.5', C.ink, 1.2),
    lo('M-4 -50 L12 -38', top, 6), circle(13, -37, 3.2, sk, C.ink, 1.2));
};
/** Shift standing-figure head accessories onto the seated head. */
const sHead = (...k: Svg[]) => g('translate(-5 -10)', ...k);
const throneL = (col: string = '#b23a3a') => all(rect(-23, -82, 11, 82, col, 2, C.ink, 1.6), circle(-17.5, -84, 3.4, GOLD, C.ink, 1), rect(-23, -24, 34, 6, col, 1.5, C.ink, 1.6), line('M-21 -18 L-21 0 M9 -18 L9 0', '#7a2a2a', 3.2));
const chairL = () => all(rect(-22, -60, 8, 60, LOG, 2, C.ink, 1.4), rect(-22, -24, 32, 5, LOG, 1.5, C.ink, 1.4), line('M-20 -19 L-20 0 M8 -19 L8 0', '#7a4a20', 3));
/** A seated figure at (x, ground 112), scale s, facing right (flip = facing left). */
const seated = (x: number, s: number, top: string, bottom: string, o: SO & { seat?: 'throne' | 'chair' | 'none'; flip?: boolean; hat?: Svg; extra?: Svg } = {}) =>
  g(`translate(${x} 112) scale(${o.flip ? -s : s} ${s})`, o.seat === 'throne' ? throneL() : o.seat === 'chair' ? chairL() : '', seatedL(top, bottom, o), o.hat ? sHead(o.hat) : '', o.extra ?? '');
// kneeling figure facing right; local: ground 0, head centre (6, −58)
const kneelL = (top: string, bottom: string, sk: string = C.skin, hr: string = C.hair) => all(
  lo('M-4 -22 L-2 -4 L-18 -4', bottom, 8), ellipse(-21, -3, 4, 3, C.black, C.ink, 1),
  lo('M-4 -22 L11 -22 L12 -3', bottom, 8), ellipse(15, -1.5, 5, 2.6, C.black, C.ink, 1),
  path('M-12 -50 L4 -52 C8 -40 6 -30 4 -19 L-12 -19 C-14 -30 -14 -40 -12 -50 Z', top, C.ink, 1.8),
  circle(6, -58, 9, sk, C.ink, 1.8), path('M-3 -60 C-3 -72.5 15 -72.5 15 -60 C10 -64 2 -64 -3 -60 Z', hr, C.ink, 1.4),
  circle(10.5, -57.5, 1.1, C.ink, null), line('M8 -52.6 Q10.5 -51 13 -52.8', C.ink, 1.1),
  lo('M0 -46 L18 -40', top, 6), circle(19, -40, 3, sk, C.ink, 1.2));
const kHead = (...k: Svg[]) => g('translate(6 -2)', ...k);
const kneel = (x: number, s: number, top: string, bottom: string, o: { flip?: boolean; grey?: boolean; hat?: Svg } = {}) => {
  const k = g(`translate(${x} 112) scale(${o.flip ? -s : s} ${s})`, kneelL(o.grey ? C.grey : top, o.grey ? C.grey : bottom, o.grey ? C.grey2 : C.skin, o.grey ? C.grey : C.hair), o.hat ? kHead(o.hat) : '');
  return o.grey ? greyed(k) : k;
};
/** A small bust (head and shoulders) for crowds, trees and charts. */
const bust = (x: number, y: number, top: string, hat: Svg = '', s = 1, grey = false) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-8 12 C-8 4 8 4 8 12 Z', grey ? C.grey : top, C.ink, 1.2), circle(0, 0, 5.4, grey ? C.grey2 : C.skin, C.ink, 1.2),
  path('M-5.4 -1 C-5.4 -8 5.4 -8 5.4 -1 C3 -4 -3 -4 -5.4 -1 Z', grey ? C.grey : C.hair, null), circle(-2, 0, 0.8, C.ink, null), circle(2, 0, 0.8, C.ink, null), hat);
const bCrown = path('M-5.5 -4 L-6 -11 L-3 -7.5 L0 -12 L3 -7.5 L6 -11 L5.5 -4 Z', GOLD, C.ink, 1);
const bStraw = all(ellipse(0, -4.5, 8.5, 2, '#e8c870', C.ink, 0.9), path('M-4.5 -4.5 C-4.5 -10 4.5 -10 4.5 -4.5 Z', '#e8c870', C.ink, 0.9));
const bHelm = path('M-6.2 -0.5 C-6.2 -10 6.2 -10 6.2 -0.5 Z', C.silver, C.ink, 1);
const bMitre = path('M-5 -4 L-4.5 -10 L0 -17 L4.5 -10 L5 -4 Z', C.white, C.ink, 1);

// ── Things ───────────────────────────────────────────────────────────
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const crownBig = (x: number, y: number, s = 1, col: string = GOLD) => at(x, y, s, path('M-14 6 L-15 -10 L-7 -2 L0 -14 L7 -2 L15 -10 L14 6 Z', col, C.ink, 1.6), rect(-14, 4, 28, 5, col, 1, C.ink, 1.4), circle(0, 6.5, 1.6, RED, null), circle(-8, 6.5, 1.4, '#3f6fb5', null), circle(8, 6.5, 1.4, '#3f6fb5', null));
const dashedCrown = (x: number, y: number, s = 1) => at(x, y, s, path('M-14 6 L-15 -10 L-7 -2 L0 -14 L7 -2 L15 -10 L14 6 Z', 'none', HL, 1.8), line('M-14 9 L14 9', HL, 1.8));
const coin = (x: number, y: number, r = 5) => all(circle(x, y, r, GOLD, C.ink, 1.2), circle(x, y, r * 0.55, 'none', '#b88a20', 1));
const noSign = (x: number, y: number, r = 8) => all(circle(x, y, r, 'none', RED, 2.6), line(`M${f1(x - r * 0.7)} ${f1(y - r * 0.7)} L${f1(x + r * 0.7)} ${f1(y + r * 0.7)}`, RED, 2.6));
const cross = (x: number, y: number, s = 1, col: string = RED) => line(`M${x - 6 * s} ${y - 6 * s} L${x + 6 * s} ${y + 6 * s} M${x + 6 * s} ${y - 6 * s} L${x - 6 * s} ${y + 6 * s}`, col, 2.6 * s);
const check = (x: number, y: number, s = 1) => checkIcon(x, y, s, C.green);
const sack = (x: number, y: number, s = 1, col = '#d9c08a') => at(x, y, s, path('M-8 10 C-11 0 -9 -6 -4 -8 L-5 -12 L5 -12 L4 -8 C9 -6 11 0 8 10 Z', col, C.ink, 1.3), line('M-5 -8.5 L5 -8.5', '#8a6a3a', 1.4));
const tub = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 -6 L8 -6 L6 6 L-6 6 Z', LOG, C.ink, 1.3), line('M-7.4 -2 L7.4 -2 M-6.7 3 L6.7 3', '#6b4220', 1), ellipse(0, -6, 8, 2, '#f6e08a', C.ink, 1));
const tree = (x: number, y: number, s = 1, col: string = '#5f9e58') => at(x, y, s, rect(-2, -14, 4, 14, '#7a4a20', 1, C.ink, 1), circle(0, -20, 10, col, C.ink, 1.4));
const field = (x: number, y: number, w: number, h: number, col: string = FIELD, rows = 4) => all(rect(x, y, w, h, col, 2, C.ink, 1.2), ...Array.from({ length: rows - 1 }, (_, i) => line(`M${x + 2} ${f1(y + (h / rows) * (i + 1))} L${x + w - 2} ${f1(y + (h / rows) * (i + 1))}`, '#b9953c', 1)));
const stalks = (x: number, y: number, n: number, hgt: number, col = '#d8a92c', gap = 6) => all(...Array.from({ length: n }, (_, i) => all(line(`M${x + i * gap} ${y} L${x + i * gap} ${y - hgt}`, col, 1.6), ellipse(x + i * gap, y - hgt - 3, 1.8, 4, col, C.ink, 0.6))));
const wilted = (x: number, y: number, n: number, gap = 7) => all(...Array.from({ length: n }, (_, i) => path(`M${x + i * gap} ${y} C${x + i * gap} ${y - 8} ${x + i * gap + 3} ${y - 10} ${x + i * gap + 5} ${y - 6}`, 'none', '#8a6a3a', 1.6)));
const flake = (x: number, y: number, s = 1) => at(x, y, s, line('M0 -6 L0 6 M-5 -3 L5 3 M-5 3 L5 -3', '#5aa7d6', 1.6));
const drops = (x: number, y: number) => line(`M${x - 8} ${y} l-2 5 M${x} ${y + 2} l-2 5 M${x + 8} ${y} l-2 5`, '#5aa7d6', 1.8);
const sunS = (x: number, y: number, r = 6) => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 5))} ${f1(y + Math.sin(a) * (r + 5))}`, GOLD, 1.6); }), circle(x, y, r, C.yellow, C.ink, 1.2));
const moon = (x: number, y: number, r = 6) => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${f1(x + r * 0.9)} ${f1(y + r * 0.4)} A${f1(r * 0.8)} ${f1(r * 0.8)} 0 1 1 ${x} ${y - r} Z`, '#f3e6a1', C.ink, 1.1);
const flameS = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -16 C8 -6 12 0 10 6 C8 13 -8 13 -10 6 C-12 0 -6 -4 -4 -10 C-2 -4 0 -4 0 -16 Z', C.orange, C.ink, 1.2), path('M0 -2 C4 2 4 8 0 9 C-4 8 -4 2 0 -2 Z', C.yellow, null));
const smoke = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 C-6 -6 6 -10 0 -16 C-6 -22 6 -26 0 -32', 'none', '#9aa3ad', 2.4));
const palm = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ...[-4.6, -1.6, 1.4, 4.4].map((d, i) => rect(d - 1.3, -9 + Math.abs(i - 1.5) * 1.2, 2.6, 9, C.skin, 1.3, C.ink, 0.9)), path('M-5.5 -1 L5.5 -1 L5 5 C4 8 -4 8 -5 5 Z', C.skin, C.ink, 1), path('M-5.4 1 L-9 -3 C-10 -4 -11 -2 -10 -1 L-5 5', C.skin, C.ink, 1));
// buildings
const church = (x: number, y: number, s = 1, col: string = CREAM) => at(x, y, s,
  rect(-24, -26, 36, 26, col, 1, C.ink, 1.6), path('M-27 -26 L-6 -40 L15 -26 Z', '#8a5a3a', C.ink, 1.6),
  rect(12, -52, 14, 52, col, 1, C.ink, 1.6), path('M10 -52 L19 -70 L28 -52 Z', '#8a5a3a', C.ink, 1.6), line('M19 -70 L19 -79 M15 -75.5 L23 -75.5', C.ink, 1.8),
  path('M-10 0 L-10 -10 C-10 -16 -2 -16 -2 -10 L-2 0 Z', '#6b4a2e', C.ink, 1.2), path('M16 -40 C16 -45 22 -45 22 -40 L22 -34 L16 -34 Z', '#5a6a80', C.ink, 1), circle(-17, -16, 3, '#5a6a80', C.ink, 1));
const castle = (x: number, y: number, s = 1, col: string = STONE) => at(x, y, s,
  rect(-24, -38, 48, 38, col, 1, C.ink, 1.6), ...[-22, -12, -2, 8, 18].map((d) => rect(d, -44, 5, 6, col, 0.5, C.ink, 1.2)),
  rect(-36, -56, 15, 56, col, 1, C.ink, 1.6), rect(21, -56, 15, 56, col, 1, C.ink, 1.6),
  ...[-36, -29.5, 21, 27.5].map((d) => rect(d, -61, 4.5, 5, col, 0.5, C.ink, 1.1)),
  path('M-8 0 L-8 -16 C-8 -26 8 -26 8 -16 L8 0 Z', '#4a3a2e', C.ink, 1.3), rect(-31, -44, 5, 8, '#4a3a2e', 2, null), rect(26, -44, 5, 8, '#4a3a2e', 2, null));
const manor = (x: number, y: number, s = 1, wall: string = '#f6f1e6', roof: string = RED) => at(x, y, s,
  path('M-36 -34 L-30 -48 L30 -48 L36 -34 Z', roof, C.ink, 1.6), rect(-34, -34, 68, 34, wall, 1, C.ink, 1.6),
  ...[-26, -14, 10, 22].flatMap((d) => [rect(d, -29, 6, 9, '#7aa0c4', 1, C.ink, 1), rect(d, -15, 6, 9, '#7aa0c4', 1, C.ink, 1)]),
  path('M-5 0 L-5 -13 C-5 -18 5 -18 5 -13 L5 0 Z', '#6b4a2e', C.ink, 1.2), path('M-6 -48 L0 -56 L6 -48 Z', roof, C.ink, 1.3));
const cabin = (x: number, y: number, s = 1, o: { broken?: boolean; smoke?: boolean } = {}) => at(x, y, s,
  rect(-22, -26, 44, 26, LOG, 1, C.ink, 1.6), ...[-21, -16, -11, -6].map((d) => line(`M-21 ${d} L21 ${d}`, '#7a4a20', 1.1)),
  ...[-21, -16, -11, -6, -1].flatMap((d) => [circle(-22, d + 2.5, 2.4, '#c9935a', C.ink, 0.8), circle(22, d + 2.5, 2.4, '#c9935a', C.ink, 0.8)]),
  o.broken ? all(path('M-26 -26 L-8 -40 L-2 -34 L4 -42 L26 -26 Z', TURF, C.ink, 1.6), path('M-6 -34 L0 -30 L6 -35', 'none', C.ink, 1.2), rect(-5, -16, 10, 16, '#2e2a26', 0.5, C.ink, 1.1)) : all(path('M-26 -26 L0 -44 L26 -26 Z', TURF, C.ink, 1.6), rect(-5, -16, 10, 16, '#6b4a2e', 0.5, C.ink, 1.1)),
  o.smoke ? smoke(12, -40, 0.6) : '');
const townhouse = (x: number, y: number, s = 1, col: string = '#e6b48a') => at(x, y, s,
  path('M-9 0 L-9 -30 L-6 -30 L-6 -35 L-3 -35 L-3 -40 L3 -40 L3 -35 L6 -35 L6 -30 L9 -30 L9 0 Z', col, C.ink, 1.4),
  rect(-5, -26, 4, 5, '#5a6a80', 0.5, null), rect(1, -26, 4, 5, '#5a6a80', 0.5, null), rect(-5, -17, 4, 5, '#5a6a80', 0.5, null), rect(1, -17, 4, 5, '#5a6a80', 0.5, null), rect(-2.5, -8, 5, 8, '#6b4a2e', 0.5, null));
const kogg = (x: number, y: number, s = 1, sail: string = CREAM) => at(x, y, s,
  path('M-34 -16 C-30 2 30 2 34 -16 Z', '#8a5a2e', C.ink, 1.6), line('M-31 -10 L31 -10', '#5e3a1a', 1.2),
  rect(-34, -24, 13, 8, '#8a5a2e', 1, C.ink, 1.3), rect(21, -24, 13, 8, '#8a5a2e', 1, C.ink, 1.3),
  line('M0 -16 L0 -66', '#5e3a1a', 2.6), path('M-17 -60 C-12 -48 -12 -34 -17 -24 L17 -24 C12 -34 12 -48 17 -60 Z', sail, C.ink, 1.4),
  line('M-16 -42 L16 -42', RED, 2.4), path('M0 -66 L10 -63 L0 -60 Z', RED, C.ink, 0.8));
const waves = (y: number, x1 = 4, x2 = 116) => line(`M${x1} ${y} ${Array.from({ length: Math.floor((x2 - x1) / 12) }, () => `q3 -3 6 0 q3 3 6 0`).join(' ')}`, '#4d8fc0', 1.6);
const book = (x: number, y: number, s = 1, cover: string = '#7a2a2a', crossMark = true) => at(x, y, s, rect(-12, -9, 24, 18, cover, 2, C.ink, 1.4), crossMark ? line('M0 -5 L0 5 M-3.5 -1.5 L3.5 -1.5', GOLD, 1.8) : '');
const openBook = (x: number, y: number, s = 1, initial = true) => at(x, y, s,
  path('M0 -16 C-8 -20 -22 -20 -30 -16 L-30 14 C-22 10 -8 10 0 14 Z', '#f6ecd2', C.ink, 1.5), path('M0 -16 C8 -20 22 -20 30 -16 L30 14 C22 10 8 10 0 14 Z', '#f6ecd2', C.ink, 1.5),
  initial ? rect(-26, -12, 8, 8, RED, 1, C.ink, 0.8) : '', initial ? path('M-24 -6 L-22 -11 L-20 -6', 'none', GOLD, 1.2) : '',
  ...[-11, -6, -1, 4, 9].map((d, i) => path(`M${i < 2 ? -16 : -26} ${d} q3 -1.5 6 0 t6 0 t6 0 t4 0`, 'none', '#5a4a3a', 1)),
  ...[-11, -6, -1, 4, 9].map((d) => path(`M4 ${d} q3 -1.5 6 0 t6 0 t6 0 t4 0`, 'none', '#5a4a3a', 1)));
const quill = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 C4 -10 12 -22 20 -28 C16 -18 10 -8 2 1 Z', C.white, C.ink, 1.1), line('M0 0 L-3 5', C.ink, 1.4));
const candle = (x: number, y: number, s = 1, col: string = '#efe3c0') => at(x, y, s, rect(-3.5, -16, 7, 16, col, 1, C.ink, 1.1), line('M0 -16 L0 -19', C.ink, 1), path('M0 -27 C3 -23 3 -20 0 -19 C-3 -20 -3 -23 0 -27 Z', C.orange, C.ink, 0.8));
const mug = (x: number, y: number, s = 1, drink: string = '#e9c86a') => at(x, y, s, path('M-6 -10 L6 -10 L5 6 L-5 6 Z', LOG, C.ink, 1.3), path('M6 -6 C11 -6 11 2 5 2', 'none', C.ink, 1.4), ellipse(0, -10, 6, 2, drink, C.ink, 0.9), path('M-6 -10 C-6 -14 6 -14 6 -10', '#fbf6e6', C.ink, 0.9));
const bacterium = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-7, -3, 14, 6, '#7bb36a', 3, C.ink, 1), circle(-2.5, 0, 0.9, '#3d6b34', null), circle(2.5, 0, 0.9, '#3d6b34', null));
const horseL = (col: string = '#9a6438') => all(
  lo('M-14 -22 L-15 -1 M-7 -22 L-7 -1 M9 -22 L9 -1 M15 -22 L17 -1', col, 3.6),
  ellipse(0, -30, 20, 10, col, C.ink, 1.6), path('M14 -36 L22 -52 C24 -56 30 -56 32 -52 L34 -46 C34 -43 31 -42 29 -44 L24 -42 L20 -28 Z', col, C.ink, 1.6),
  circle(27, -50, 1.1, C.ink, null), path('M18 -46 L21 -56 L26 -54', 'none', '#4a2e1a', 2.4), path('M-19 -32 C-27 -30 -28 -18 -25 -12', 'none', '#4a2e1a', 3));
const horse = (x: number, s = 1, col?: string) => g(`translate(${x} 112) scale(${s})`, horseL(col));
const cowL = () => all(lo('M-13 -18 L-13 -1 M-6 -18 L-6 -1 M8 -18 L8 -1 M14 -18 L14 -1', C.white, 3.4), ellipse(0, -26, 20, 10, C.white, C.ink, 1.6),
  ellipse(-6, -28, 5, 4, C.black, null), ellipse(8, -24, 4, 3, C.black, null), path('M16 -32 L26 -36 C30 -36 32 -30 30 -25 L22 -22 Z', C.white, C.ink, 1.4),
  circle(26, -32, 1, C.ink, null), path('M20 -36 L19 -41 M24 -37 L25 -42', 'none', C.ink, 1.4), ellipse(4, -15, 4, 2.6, C.pink, C.ink, 0.9), path('M-20 -28 C-25 -24 -25 -16 -23 -12', 'none', C.ink, 1.4));
const sheep = (x: number, y: number, s = 1) => at(x, y, s, line('M-6 0 L-6 6 M5 0 L5 6', C.ink, 1.6), ellipse(0, -2, 10, 6.5, C.white, C.ink, 1.3), ellipse(10, -5, 3.5, 3, C.dark, C.ink, 1));
const pot = (x: number, y: number, s = 1) => at(x, y, s, path('M-9 -6 L9 -6 C9 4 6 8 0 8 C-6 8 -9 4 -9 -6 Z', C.dark, C.ink, 1.3), path('M-7 -6 C-7 -14 7 -14 7 -6', 'none', C.ink, 1));
const bowl = (x: number, y: number, s = 1, food = '') => at(x, y, s, food, path('M-8 -2 L8 -2 C8 4 4 6 0 6 C-4 6 -8 4 -8 -2 Z', LOG, C.ink, 1.2));
const table = (y = 84, x1 = 10, x2 = 110) => all(rect(x1, y, x2 - x1, 6, '#b98a52', 2, C.ink, 1.6), line(`M${x1 + 8} ${y + 6} L${x1 + 8} 112 M${x2 - 8} ${y + 6} L${x2 - 8} 112`, '#7a4a20', 3));
const bed = (x: number, y: number, w = 56) => all(rect(x, y, w, 10, LOG, 2, C.ink, 1.4), line(`M${x + 3} ${y + 10} L${x + 3} 112 M${x + w - 3} ${y + 10} L${x + w - 3} 112`, '#7a4a20', 3));
const scales = (x: number, y: number, s = 1) => at(x, y, s, line('M0 0 L0 -26 M-14 -22 L14 -22', C.dark, 1.8), path('M-20 -12 L-8 -12 L-14 -22 Z', 'none', C.dark, 1), path('M8 -12 L20 -12 L14 -22 Z', 'none', C.dark, 1), ellipse(-14, -12, 7, 2.4, GOLD, C.ink, 1), ellipse(14, -12, 7, 2.4, GOLD, C.ink, 1), rect(-6, 0, 12, 3, C.dark, 1, null));
const barrel = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 -12 C-11 -4 -11 4 -8 12 L8 12 C11 4 11 -4 8 -12 Z', LOG, C.ink, 1.3), line('M-9.6 -6 L9.6 -6 M-9.6 6 L9.6 6', '#5e3a1a', 1.4));
const shoe = (x: number, y: number, s = 1) => at(x, y, s, path('M-10 2 L-10 -6 C-10 -10 -4 -10 -3 -6 L-1 -3 C4 -2 10 -1 10 2 Z', '#6b3f1e', C.ink, 1.2));
const cabinet = (x: number, y: number, s = 1) => at(x, y, s, rect(-12, -30, 24, 30, '#a8743f', 1.5, C.ink, 1.5), line('M0 -28 L0 -2', '#6b4220', 1.4), circle(-2.5, -15, 1.2, GOLD, null), circle(2.5, -15, 1.2, GOLD, null), path('M-14 -30 L14 -30 L12 -34 L-12 -34 Z', '#8a5a2e', C.ink, 1.2));
const bundle = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 0, 13, 4.4, '#efe9dc', C.ink, 1.2), line('M-6 -3.6 L-6 3.6 M5 -3.8 L5 3.8', '#b8ad98', 1.2));
const sheaf = (x: number, y: number, s = 1) => at(x, y, s, path('M-10 0 L-4 -22 L4 -22 L10 0 Z', '#e8c870', C.ink, 1.3), path('M-4 -22 L-9 -36 M-1 -22 L-3 -38 M2 -22 L3 -38 M4 -22 L9 -36', 'none', '#c8a040', 1.6), line('M-6 -12 L6 -12', '#9a7428', 2.2));
const cradle = (x: number, y: number, s = 1, baby = true, grey = false) => { const k = at(x, y, s, path('M-12 -10 L12 -10 L10 0 L-10 0 Z', grey ? C.grey2 : LOG, C.ink, 1.2), path('M-14 4 C-8 0 8 0 14 4', 'none', C.ink, 1.4), baby ? all(circle(-5, -12, 4, C.skin, C.ink, 1), rect(-1, -14, 11, 5, '#bcd7ea', 2, C.ink, 1)) : ''); return grey ? greyed(k) : k; };
const sword = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-1.4, -22, 2.8, 22, C.silver, 1, C.ink, 0.9), rect(-6, 0, 12, 2.6, GOLD, 1, C.ink, 0.8), rect(-1.2, 2.6, 2.4, 6, '#6b4220', 0.5, null));
const swedenMap = (x: number, y: number, s = 1, fill: string = '#cfe3c4') => at(x, y, s, path('M2 -48 C10 -46 12 -36 8 -28 C6 -18 10 -10 6 0 C4 10 6 20 0 30 C-4 40 -10 46 -14 44 C-16 36 -10 28 -12 18 C-14 8 -8 -2 -10 -12 C-12 -24 -6 -40 2 -48 Z', fill, C.ink, 1.4));

export const MIDDLE_AGES_MOTIFS: Record<string, Svg> = {
  // ── 1921 Feodalism och vasaller ──
  'mtid.feodalism': all(path('M60 6 L112 108 L8 108 Z', CREAM, C.ink, 1.8), line('M47 32 L73 32 M33.5 58 L86.5 58 M20 84 L100 84', C.ink, 1.2),
    crownBig(60, 22, 0.55), bust(52, 44, ROYAL, '', 0.85), bust(68, 44, ROYAL, '', 0.85), ...[44, 60, 76].map((x) => bust(x, 70, C.silver, bHelm, 0.85)), ...[30, 50, 70, 90].map((x) => bust(x, 96, '#b98a52', bStraw, 0.85))),
  'mtid.vasall': all(greyed(seated(32, 1, ROYAL, ROYAL, { seat: 'throne', hat: crownL() })), kneel(68, 1, C.denim, C.navy, { flip: true }), sword(88, 104, 0.6, 60), ground),
  'mtid.länsherre': all(seated(30, 1, RED, C.navy, { seat: 'chair', hat: furHatL(), extra: g('translate(-5 0)', chainL()) }), kneel(70, 0.75, C.grey, C.grey, { flip: true, grey: true }), kneel(100, 0.75, C.grey, C.grey, { flip: true, grey: true }), ground),
  'mtid.län.2': all(crownBig(20, 20, 0.6), path('M62 64 L104 80 L62 98 L20 80 Z', GRASS, HL, 2.2), path('M44 74 L74 86 M54 70 L84 82', 'none', '#6f9a4f', 1.2), path('M36 80 L60 90 L68 86 L44 76 Z', FIELD, C.ink, 0.9), cabin(70, 80, 0.35), tree(88, 82, 0.45), tree(48, 72, 0.4),
    line('M28 28 C40 34 52 46 58 60', HL, 2, '4 3'), path('M53 58 L59 64 L61 55', 'none', HL, 2), fig(104, C.denim, 'smile', { h: 0.55 })),
  'mtid.beskydd': all(fig(40, C.silver, 'calm', { h: 1, bottom: C.dark }), on(40, 1, helmetL()), reach(40, 1, 1, 66, 46), g('translate(80 48) rotate(25)', shield(0, 0, 1.6, C.navy)), cloud(96, 14, 1, C.dark), bolt(84, 28, 0.7), bolt(104, 28, 0.7),
    fig(84, '#c96b3c', 'shock', { h: 0.5, hairStyle: 'long' }), fig(100, '#b98a52', 'shock', { h: 0.45 }), ground),
  'mtid.i-utbyte-mot': all(fig(20, RED, 'smile', { h: 0.85 }), on(20, 0.85, furHatL()), peasant(100, 0.85), arrow(34, 40, 86, 40, HL, 2.6), arrow(86, 80, 34, 80, HL, 2.6), shield(60, 26, 0.75, C.navy), sack(60, 92, 0.9), ground),
  'mtid.svära-trohet': all(seated(30, 1, ROYAL, ROYAL, { seat: 'throne', hat: crownL() }), kneel(62, 1, C.denim, C.navy, { flip: true }), circle(43, 74, 8, 'none', HL, 2.2), bubble(88, 30, 30, all(heart2(81, 30, 0.55), crownBig(95, 30, 0.35))), ground),
  'mtid.ed': all(fig(46, C.denim, 'calm', { h: 1 }), reach(46, 1, -1, 28, 26), palm(28, 22, 1.1), reach(46, 1, 1, 78, 64), rect(76, 68, 22, 44, LOG, 1, C.ink, 1.4), path('M72 68 L102 68 L98 60 L76 60 Z', LOG, C.ink, 1.4), book(87, 61, 0.7), ground),
  'mtid.adel': all(rect(8, 80, 76, 32, STONE, 1, C.ink, 1.6), line('M8 92 L84 92', STONE2, 1), g('translate(0 -32)', fig(24, ROYAL, 'smile', { h: 0.7, bottom: ROYAL }), on(24, 0.7, chainL()), fig(46, RED, 'smile', { h: 0.72, hairStyle: 'long', bottom: RED }), on(46, 0.72, chainL()), fig(68, C.navy, 'smile', { h: 0.7, bottom: C.navy }), on(68, 0.7, chainL())),
    shield(14, 30, 0.6, RED), crownBig(14, 16, 0.3), gfig(102, { h: 0.85 }), ground),
  'mtid.frälse': all(horse(36, 1), g('translate(30 82)', path('M-8 -26 L6 -26 C8 -16 7 -8 6 0 L-8 0 C-9 -8 -9 -16 -8 -26 Z', C.navy, C.ink, 1.6), circle(-1, -34, 7.5, C.skin, C.ink, 1.6), path('M-8 -36 C-8 -46 6 -46 6 -36 Z', C.silver, C.ink, 1.2), lo('M0 0 L6 14', C.navy, 6)), shield(22, 76, 0.7, RED),
    coin(96, 54, 12), noSign(96, 54, 17), crownBig(96, 18, 0.55), arrow(62, 40, 84, 24, HL, 2.2), ground),
  'mtid.privilegium': all(rect(56, 108, 52, 4, RED, 1, null), fig(82, ROYAL, 'smile', { h: 0.95, bottom: ROYAL }), on(82, 0.95, chainL()), starIcon(82, 8, 1.3, GOLD), lo('M50 80 L50 112', '#8a5a2e', 3), lo('M8 80 L8 112', '#8a5a2e', 3), path('M8 82 C20 90 38 90 50 82', 'none', RED, 3),
    gfig(28, { h: 0.85 }), ground),
  'mtid.skattefrihet': all(gfig(24, { h: 0.9 }), greyed(sack(40, 80, 1)), fig(92, ROYAL, 'smile', { h: 0.9, bottom: ROYAL }), rect(64, 92, 20, 14, LOG, 2, C.ink, 1.3), coin(69, 90, 3.5), coin(76, 89, 3.5), coin(80, 91, 3.5), arrow(64, 70, 48, 70, GREY, 2.2), cross(56, 70, 1.1), ground),
  'mtid.ärftlig.2': all(bust(22, 70, ROYAL, bCrown, 1.5, false), bust(60, 74, ROYAL, bCrown, 1.25), bust(98, 80, ROYAL, bCrown, 1.0), arrow(32, 50, 50, 54, HL, 2.2), arrow(70, 56, 88, 64, HL, 2.2), field(10, 100, 100, 10, GRASS, 2)),
  'mtid.undersåte': all(greyed(castle(30, 60, 0.7), king(30, 0.45)), ...[48, 62, 76, 90, 104].map((x, i) => fig(x, [C.denim, '#c96b3c', C.green, '#b07aa1', '#b98a52'][i]!, 'smile', { h: 0.5 + (i % 2) * 0.05, hairStyle: i % 2 ? 'long' : 'short' })), ...[62, 90].map((x) => coin(x + 6, 92, 3.2)), ground),
  // ── 1922 Bönder och gods ──
  'mtid.gods': all(field(6, 92, 34, 16, FIELD), field(80, 92, 34, 16, FIELD), manor(60, 88, 0.95), cabin(18, 86, 0.32), cabin(102, 86, 0.32), tree(8, 86, 0.5), tree(112, 86, 0.5), field(42, 98, 36, 10, GRASS, 2), ground),
  'mtid.godsägare': all(greyed(manor(60, 78, 0.95)), field(4, 96, 112, 14, FIELD, 3), fig(60, RED, 'smile', { h: 0.9, bottom: C.navy }), on(60, 0.9, furHatL(), chainL()), reach(60, 0.9, -1, 42, 70), reach(60, 0.9, 1, 78, 70)),
  'mtid.arrende': all(field(32, 94, 56, 16, FIELD), gfig(14, { h: 0.85 }), peasant(104, 0.85), arrow(94, 40, 30, 40, HL, 2.4), sack(62, 30, 0.9), arrow(30, 62, 46, 84, GREY, 1.8), arrow(90, 62, 74, 84, HL, 1.8), ground),
  'mtid.dagsverke': all(greyed(manor(84, 66, 0.7)), field(4, 96, 112, 14, FIELD, 3), peasant(40, 0.95, '#b98a52', 'frown'), reach(40, 0.95, 1, 60, 74), lo('M60 74 L62 102', LOG, 2.2), path('M62 102 L76 104', 'none', C.silver, 3), sunS(20, 18, 6), path('M10 34 C14 8 40 4 48 26', 'none', HL, 1.8, ), path('M45 22 L48 27 L51 21', 'none', HL, 1.8), noSign(104, 20, 9), coin(104, 20, 5)),
  'mtid.landbo': all(greyed(manor(86, 58, 0.65)), cabin(30, 104, 0.8, { smoke: true }), peasant(68, 0.85), reach(68, 0.85, 1, 82, 76), tub(86, 76, 0.9), arrow(92, 70, 98, 52, HL, 2.2), ground),
  'mtid.livegen': all(field(4, 96, 112, 14, FIELD, 3), peasant(50, 1, '#b98a52', 'frown'), lo('M24 108 L24 86', '#7a4a20', 4), path('M24 100 C30 106 38 108 44 108', 'none', C.dark, 2.4, ), ...[28, 33, 38, 43].map((x, i) => ellipse(x, 104 + (i % 2) * 2, 2.4, 1.6, 'none', C.dark, 1.2)), gfig(96, { h: 0.95 }), on(96, 0.95, furHatL('#7d8590'))),
  'mtid.skattebonde': all(cabin(28, 104, 0.85, { smoke: true }), check(44, 66, 1.3), peasant(72, 0.9), reach(72, 0.9, 1, 88, 72), sack(92, 74, 0.8), arrow(96, 62, 104, 40, HL, 2.2), crownBig(104, 26, 0.55), ground),
  'mtid.allmänning': all(ellipse(60, 80, 46, 20, GRASS, C.ink, 1.4), cabin(16, 46, 0.4), cabin(60, 34, 0.4), cabin(104, 46, 0.4), line('M22 52 L38 68 M60 40 L60 62 M98 52 L82 68', HL, 1.6, '3 3'), sheep(46, 82, 0.9), sheep(68, 76, 0.9), g('translate(66 102) scale(0.6)', cowL()), sheep(86, 88, 0.8)),
  'mtid.dräng': all(fig(42, '#c9b48a', 'smile', { h: 0.95, bottom: '#6b5a44' }), on(42, 0.95, capL('#6b5a44')), reach(42, 0.95, 1, 64, 70), line('M64 70 C72 66 78 62 86 62', '#5e3a1a', 1.4), horse(84, 0.95), sheaf(14, 112, 0.7), ground),
  'mtid.piga': all(g('translate(78 112)', cowL()), rect(46, 94, 14, 4, LOG, 1, C.ink, 1.2), line('M49 98 L49 112 M57 98 L57 112', '#7a4a20', 2), seated(56, 0.7, '#c96b3c', '#8a6a4a', { hair: '#c4542a' }), path('M72 100 L82 100 L80 110 L74 110 Z', C.silver, C.ink, 1.2), ground),
  'mtid.husbonde': all(fig(30, '#5a6a80', 'smile', { h: 1.05, bottom: '#3d3f4a' }), on(30, 1.05, beardL('#6b4a2e')), reach(30, 1.05, 1, 54, 46), palm(56, 42, 1), greyed(peasant(84, 0.75), peasant(104, 0.75)), field(70, 104, 46, 6, FIELD, 2), ground),
  'mtid.missväxt': all(greyed(field(6, 96, 50, 14, FIELD, 2), stalks(10, 96, 8, 26)), field(64, 96, 50, 14, '#c9b48a', 2), wilted(68, 96, 7), cloud(90, 22, 1.1, C.grey), drops(90, 36), flake(72, 44, 0.9), flake(108, 46, 0.9), line('M60 12 L60 108', C.grey2, 1.4, '3 3')),
  'mtid.nödår': all(table(80), bowl(36, 78, 1), bowl(60, 78, 1), bowl(84, 78, 1), fig(22, '#b98a52', 'frown', { h: 0.85, bottom: '#6b5a44' }), fig(98, '#c96b3c', 'frown', { h: 0.8, hairStyle: 'long', bottom: '#6b5a44' }), fig(60, '#8a6a4a', 'frown', { h: 0.5 }), path('M50 24 L70 24 L72 40 C72 46 48 46 48 40 Z', '#d9c08a', C.ink, 1.3), line('M54 28 L66 28', '#8a6a3a', 1.2), noSign(60, 34, 14)),
  // ── 1923 Kloster och kyrka ──
  'mtid.kloster': all(rect(8, 70, 104, 30, STONE, 1, C.ink, 1.6), ...[16, 30, 44, 58, 72, 86, 100].map((x) => path(`M${x - 5} 100 L${x - 5} 88 C${x - 5} 82 ${x + 5} 82 ${x + 5} 88 L${x + 5} 100 Z`, '#6b5a4a', C.ink, 1)), path('M4 70 L60 58 L116 70 Z', '#8a5a3a', C.ink, 1.6), church(60, 58, 0.7, STONE), rect(4, 100, 112, 12, WATER, 1, C.ink, 1.2), waves(106, 8, 112)),
  'mtid.munk': all(path('M24 112 L24 40 C24 18 96 18 96 40 L96 112', 'none', STONE2, 4), monk(60, 1), reach(60, 1, -1, 58, 54), reach(60, 1, 1, 62, 54), ground),
  'mtid.nunna': all(path('M24 112 L24 40 C24 18 96 18 96 40 L96 112', 'none', STONE2, 4), nun(60, 1), reach(60, 1, -1, 58, 54), reach(60, 1, 1, 62, 54), ground),
  'mtid.abbot': all(monk(44, 0.9, 'smile'), on(44, 0.9, crosierL()), greyed(monk(86, 0.68), monk(106, 0.68)), ground),
  'mtid.abbedissa': all(nun(44, 0.9), on(44, 0.9, crosierL()), greyed(nun(86, 0.68), nun(106, 0.68)), ground),
  'mtid.biskop': all(greyed(church(26, 112, 0.9)), fig(70, C.white, 'calm', { h: 0.9, bottom: RED }), on(70, 0.9, line('M0 -42 L0 2', RED, 4), line('M-8 -30 L8 -30', GOLD, 2), mitreL(), crosierL()), ground),
  'mtid.mässa.2': all(rect(4, 6, 112, 106, '#efe6d2', 0, null), path('M60 6 C40 14 40 36 40 50 L80 50 C80 36 80 14 60 6 Z', '#bcd7ea', C.ink, 1.2), line('M60 18 L60 40 M52 28 L68 28', GOLD, 2), rect(70, 78, 40, 34, CREAM, 1, C.ink, 1.4), rect(70, 78, 40, 6, RED, 1, C.ink, 1.2), candle(76, 78, 0.8), candle(104, 78, 0.8),
    fig(90, C.white, 'calm', { h: 0.62, bottom: C.white }), on(90, 0.62, line('M-6 -40 L6 -40', GOLD, 3)), reach(90, 0.62, -1, 84, 50), reach(90, 0.62, 1, 96, 50), path('M86 48 L94 48 L92 42 L88 42 Z', GOLD, C.ink, 1), rect(6, 92, 54, 5, LOG, 1, C.ink, 1.2), ...[14, 30, 46].map((x, i) => bust(x, 84, ['#c96b3c', C.denim, C.green][i]!, '', 1))),
  'mtid.helig': all(greyed(cabin(24, 108, 0.75)), ...Array.from({ length: 9 }, (_, i) => { const a = Math.PI * (0.95 + i * 0.1375); return line(`M${f1(84 + Math.cos(a) * 36)} ${f1(70 + Math.sin(a) * 36)} L${f1(84 + Math.cos(a) * 50)} ${f1(70 + Math.sin(a) * 50)}`, GOLD, 2.6); }), church(80, 108, 1.0), ground),
  'mtid.helgon': all(rect(30, 72, 28, 40, STONE, 1, C.ink, 1.4), g('translate(0 -40)', on(44, 0.7, haloL()), fig(44, '#3f6fb5', 'calm', { h: 0.7, bottom: '#3f6fb5', hairStyle: 'long' })), kneel(92, 0.72, C.grey, C.grey, { flip: true, grey: true }), candle(68, 112, 0.8), candle(76, 112, 0.7), ground),
  'mtid.pilgrim': all(path('M4 112 C30 100 60 96 116 70', 'none', '#d9c08a', 10), church(102, 64, 0.5), fig(40, '#8a6a4a', 'smile', { h: 0.9, bottom: '#6b5a44' }), on(40, 0.9, all(ellipse(0, -63, 16, 3.4, '#6b4a2e', C.ink, 1.1), path('M-7 -63 C-7 -71 7 -71 7 -63 Z', '#6b4a2e', C.ink, 1.1)), staffL()), sack(26, 76, 0.7, '#a8743f'), ground),
  'mtid.vallfärd': all(cabin(18, 106, 0.45), church(96, 40, 0.55), path('M28 98 C50 96 40 74 60 70 C82 66 70 48 88 44', 'none', HL, 2.4, ), ...[[36, 94], [46, 84], [56, 72], [72, 62], [82, 50]].map(([x, y]) => ellipse(x!, y!, 1.8, 2.8, C.dark, null)), sunS(40, 22, 5), moon(60, 30, 5), sunS(80, 82, 5), moon(104, 76, 5), ground),
  'mtid.tionde': all(...Array.from({ length: 9 }, (_, i) => greyed(sack(14 + (i % 5) * 14, i < 5 ? 84 : 104, 0.75))), sack(84, 104, 0.85, FIELD), arrow(90, 92, 100, 72, HL, 2.2), church(98, 66, 0.55), T(14, 62, '10', 10, GREY), T(84, 84, '1', 10, HL), ground),
  'mtid.handskrift': all(openBook(60, 62, 1.5), quill(94, 104, 1), path('M18 100 L28 100 L27 110 L19 110 Z', C.dark, C.ink, 1.2)),
  'mtid.skriva-av': all(rect(52, 82, 60, 5, LOG, 1, C.ink, 1.4), line('M58 87 L58 112 M106 87 L106 112', '#7a4a20', 3), seated(30, 0.9, ROBE, ROBE, { seat: 'chair' }), openBook(96, 74, 0.55), lo('M100 96 L100 112', LOG, 2), g('translate(96 50) rotate(-20)', openBook(0, 0, 0.5)), lo('M96 58 L104 66', LOG, 2), arrow(86, 52, 82, 66, HL, 2), quill(82, 78, 0.6)),
  'mtid.örtagård': all(rect(4, 70, 112, 42, '#b98a52', 0, null), rect(4, 66, 112, 6, STONE, 1, C.ink, 1.3), ...[[10, 78], [42, 78], [74, 78], [10, 96], [42, 96], [74, 96]].map(([x, y], i) => all(rect(x!, y!, 28, 12, '#6f9a4f', 2, C.ink, 1), ...[6, 14, 22].map((d) => circle(x! + d, y! + 4, 3, ['#4f9d69', '#7ac08a', '#b07aa1', '#f2c14e', '#4f9d69', '#c96b3c'][i]!, C.ink, 0.6)))), monk(104, 0.6)),
  // ── 1924 Handelsstäder och skrån ──
  'mtid.handelsstad': all(rect(4, 86, 112, 26, WATER, 0, null), waves(98), rect(4, 76, 112, 10, STONE, 1, C.ink, 1.3), ...[14, 30, 46, 62, 78, 94, 108].map((x, i) => townhouse(x, 76, 1, ['#e6b48a', '#d98a6a', '#e8d27a', '#c9a07a', '#e6b48a', '#d9a0a0', '#e8d27a'][i])), church(58, 30, 0.45), kogg(36, 104, 0.45), kogg(90, 106, 0.5)),
  'mtid.köpman': all(fig(40, '#3f6fb5', 'smile', { h: 0.95, bottom: C.navy }), on(40, 0.95, furHatL(), chainL()), table(80, 52, 112), scales(82, 78, 0.9), coin(64, 76, 3.5), coin(70, 77, 3.5), barrel(102, 100, 0.8), sack(14, 102, 0.8), ground),
  'mtid.hansestad': all(rect(4, 4, 112, 108, WATER, 3, null), path('M4 4 L60 4 C52 20 34 18 28 34 C22 48 8 46 4 60 Z', '#cfe3c4', C.ink, 1.3), path('M116 70 C100 76 92 96 70 100 C56 104 50 112 50 112 L116 112 Z', '#cfe3c4', C.ink, 1.3), path('M74 34 C80 30 90 32 88 40 C86 46 76 46 74 40 Z', '#cfe3c4', C.ink, 1.2),
    townhouse(30, 30, 0.6), townhouse(82, 40, 0.6), townhouse(96, 90, 0.6), line('M34 34 C50 40 64 42 76 40 M84 46 C90 60 94 70 94 82 M34 36 C40 60 70 80 88 90', C.navy, 1.6, '4 3'), kogg(56, 50, 0.25), kogg(62, 78, 0.25)),
  'mtid.kogg': all(rect(4, 96, 112, 16, WATER, 0, null), waves(100), kogg(60, 102, 1.25)),
  'mtid.marknad.2': all(...[[24, '#e8302c'], [60, '#3f6fb5'], [96, C.green]].map(([x, col]) => all(path(`M${+x! - 16} 66 L${+x! + 16} 66 L${+x! + 12} 56 L${+x! - 12} 56 Z`, col as string, C.ink, 1.3), line(`M${+x! - 14} 66 L${+x! - 14} 96 M${+x! + 14} 66 L${+x! + 14} 96`, '#7a4a20', 2), rect(+x! - 16, 86, 32, 6, LOG, 1, C.ink, 1.2))),
    sack(18, 82, 0.5), tub(28, 84, 0.6), coin(56, 84, 2.6), ellipse(64, 84, 5, 2.6, C.orange, C.ink, 0.8), barrel(96, 80, 0.45), fig(42, '#c96b3c', 'smile', { h: 0.55, hairStyle: 'long' }), fig(78, '#b98a52', 'smile', { h: 0.55 }), fig(112, C.denim, 'smile', { h: 0.5 }), ground),
  'mtid.borgare': all(rect(4, 54, 112, 6, STONE, 1, C.ink, 1.2), ...[16, 34, 86, 104].map((x, i) => townhouse(x, 60, 0.9, ['#e6b48a', '#e8d27a', '#d98a6a', '#c9a07a'][i])), fig(60, '#3f6fb5', 'smile', { h: 0.9, bottom: C.navy }), on(60, 0.9, capL(RED)), reach(60, 0.9, 1, 76, 72), at(80, 72, 1, circle(-3, 0, 3, 'none', GOLD, 1.8), line('M0 0 L10 0 M7 0 L7 4 M10 0 L10 3', GOLD, 1.8)), ground),
  'mtid.rådhus': all(rect(4, 100, 112, 12, '#d8d0c0', 0, null), ...[16, 30, 44, 58, 72, 86, 100].map((x) => line(`M${x} 100 L${x - 4} 112`, '#b8ad98', 1)), rect(24, 52, 72, 42, '#e8d6b0', 1, C.ink, 1.6), path('M20 52 L60 34 L100 52 Z', '#8a5a3a', C.ink, 1.6), rect(52, 14, 16, 30, '#e8d6b0', 1, C.ink, 1.4), path('M50 14 L60 2 L70 14 Z', '#8a5a3a', C.ink, 1.4), circle(60, 26, 5, C.white, C.ink, 1.2), line('M60 26 L60 23 M60 26 L62.5 27', C.ink, 1),
    ...[32, 44, 70, 82].map((x) => rect(x, 60, 7, 11, '#7aa0c4', 1, C.ink, 1)), path('M54 94 L54 78 C54 72 66 72 66 78 L66 94 Z', '#6b4a2e', C.ink, 1.2), rect(44, 94, 32, 3, STONE2, 0.5, C.ink, 1), rect(40, 97, 40, 3, STONE2, 0.5, C.ink, 1)),
  'mtid.borgmästare': all(greyed(rect(14, 40, 92, 60, '#e8d6b0', 1, C.ink, 1.6), path('M10 40 L60 18 L110 40 Z', '#8a5a3a', C.ink, 1.6)), fig(60, C.black, 'smile', { h: 0.98, bottom: C.black }), on(60, 0.98, beardL('#6b4a2e'), path('M-14 -42 L-11 2 M14 -42 L11 2', 'none', FUR, 3), all(path('M-12 -42 C-8 -24 8 -24 12 -42', 'none', GOLD, 3.4), circle(0, -24, 4.2, GOLD, C.ink, 1))), ground),
  'mtid.skrå': all(line('M40 6 L40 14 M80 6 L80 14', C.dark, 1.4), rect(34, 14, 52, 22, CREAM, 2, C.ink, 1.6), shoe(60, 28, 1.3), ...[24, 60, 96].map((x, i) => all(fig(x, ['#c96b3c', '#3f6fb5', C.green][i]!, 'smile', { h: 0.72 }), on(x, 0.72, apronL()), reach(x, 0.72, 1, x + 12, 86), shoe(x + 14, 86, 0.6))), ground),
  'mtid.mästare.3': all(table(84, 50, 114), cabinet(68, 84, 0.7), fig(32, '#5a6a80', 'smile', { h: 1.0, bottom: C.dark }), on(32, 1, beardL('#d8d8d8'), apronL()), reach(32, 1, 1, 56, 64), palm(58, 60, 0.9), greyed(fig(100, C.grey, 'smile', { h: 0.62 })), ground),
  'mtid.mästarprov': all(cabinet(60, 112, 1.1), check(60, 42, 1.6), fig(24, '#c96b3c', 'smile', { h: 0.85 }), on(24, 0.85, apronL()), reach(24, 0.85, 1, 44, 84), greyed(seated(84, 0.55, C.dark, C.dark, { flip: true, seat: 'chair' }), seated(104, 0.55, C.dark, C.dark, { flip: true, seat: 'chair' })), ground),
  // ── 1925 Digerdöden ──
  'mtid.pest': all(bed(8, 88, 70), rect(12, 76, 62, 14, '#e6e2d8', 4, C.ink, 1.3), circle(20, 76, 8, '#e3cfa8', C.ink, 1.4), ...[[17, 74], [23, 79], [19, 80]].map(([x, y]) => circle(x!, y!, 1.4, '#5a3a4a', null)), circle(18, 74, 1, C.ink, null), circle(94, 40, 20, '#f6fbf4', C.ink, 2), lo('M108 54 L116 64', C.dark, 4), bacterium(88, 34, 1, 20), bacterium(100, 42, 1, -30), bacterium(90, 48, 0.9, 70), ground),
  'mtid.digerdöden': all(rect(4, 4, 112, 108, '#e9e4da', 0, null), path('M4 4 L116 4 L116 40 C90 48 76 30 60 40 C44 50 30 36 4 46 Z', '#2e2e36', null, 0), ...[16, 34, 52, 70, 88, 106].map((x, i) => townhouse(x, 96, 0.9, i < 3 ? '#8d8a86' : '#e6b48a')), line('M4 96 L116 96', C.ink, 1.4), rect(4, 96, 112, 16, WATER, 0, null), kogg(100, 110, 0.35, '#7d7d7d'), T(60, 26, '1350', 13, C.white)),
  'mtid.böld': all(fig(60, '#b98a52', 'sick', { h: 1.15, bottom: '#6b5a44' }), on(60, 1.15, circle(8, -44, 4.6, '#c9504a', C.ink, 1.1), circle(8, -44, 2, '#e88a7a', null)), circle(68, 34, 11, 'none', HL, 2), ground),
  'mtid.härja': all(path('M4 30 C14 18 30 18 40 26 C50 14 70 16 76 28 L76 46 L4 46 Z', '#2e2e36', C.ink, 1.2), arrow(70, 22, 110, 22, C.dark, 3), ...[14, 34, 54].map((x) => greyed(cabin(x, 104, 0.45))), ...[78, 98].map((x) => cabin(x, 104, 0.45)), line('M4 50 L76 50', '#2e2e36', 1, '2 3'), ground),
  'mtid.dödlighet': all(...Array.from({ length: 10 }, (_, i) => { const x = 14 + (i % 5) * 23, y = i < 5 ? 34 : 82, k = bust(x, y, ['#c96b3c', C.denim, C.green, '#b07aa1', '#b98a52'][i % 5]!, '', 1.5, i % 2 === 1); return all(k, i % 2 === 1 ? cross(x, y + 6, 0.9, C.dark) : ''); }), line('M8 64 L112 64', C.grey2, 1.4), bacterium(60, 104, 1.2)),
  'mtid.massgrav': all(path('M10 84 L110 84 L102 112 L18 112 Z', '#8a6a4a', C.ink, 1.6), ...[[30, 92], [48, 92], [66, 92], [84, 92], [38, 102], [58, 102], [78, 102]].map(([x, y]) => bundle(x!, y!, 1)), path('M4 84 C10 72 30 70 40 78 L40 84 Z', '#a0826a', C.ink, 1.2), lo('M104 84 L104 56 M96 64 L112 64', LOG, 3), ground),
  'mtid.överlevande': all(...[16, 36, 84, 104].map((x) => greyed(fig(x, C.grey, 'calm', { h: 0.82 }))), fig(60, '#c96b3c', 'calm', { h: 0.95, hairStyle: 'long' }), sunS(60, 10, 4), ground),
  'mtid.ödegård': all(field(4, 96, 112, 14, '#b9b08a', 2), tree(84, 106, 0.55), tree(100, 108, 0.45), tree(70, 108, 0.35), cabin(36, 104, 1, { broken: true }), ...[16, 24, 52, 58].map((x) => path(`M${x} 112 L${x - 2} 104 M${x} 112 L${x + 2} 103 M${x} 112 L${x} 102`, 'none', '#6f9a4f', 1.2)), ground),
  // ── 1926 Medeltida kungamakt ──
  'mtid.regera': all(seated(30, 1, ROYAL, ROYAL, { seat: 'throne', hat: crownL(), extra: lo('M13 -37 L22 -72', GOLD, 2.6) + circle(22, -74, 3.4, GOLD, C.ink, 1) }), swedenMap(90, 64, 0.9), ...[[88, 34], [84, 60], [92, 86]].map(([x, y]) => townhouse(x!, y!, 0.35)), line('M54 36 C64 30 72 34 78 40', HL, 1.8, '3 3'), ground),
  'mtid.kröna': all(kneel(44, 1, ROYAL, ROYAL), fig(92, C.white, 'calm', { h: 0.95, bottom: RED }), on(92, 0.95, mitreL()), reach(92, 0.95, -1, 58, 42), crownBig(52, 44, 0.42), ground),
  'mtid.tronföljare': all(greyed(king(30, 1.0)), fig(84, '#3f6fb5', 'smile', { h: 0.75 }), dashedCrown(84, 36, 0.55), arrow(42, 26, 70, 34, HL, 2), ground),
  'mtid.valrike': all(fig(60, '#3f6fb5', 'smile', { h: 0.8 }), dashedCrown(60, 22, 0.6), ...[[16, RED], [34, ROYAL], [86, C.navy], [104, '#5a6a80']].map(([x, col]) => all(fig(+x!, col as string, 'smile', { h: 0.7 }), reach(+x!, 0.7, +x! < 60 ? 1 : -1, +x! < 60 ? +x! + 10 : +x! - 10, 44), palm(+x! < 60 ? +x! + 10 : +x! - 10, 40, 0.7))), ground),
  'mtid.storman': all(greyed(castle(90, 80, 0.55)), fig(46, RED, 'smile', { h: 1.05, w: 1.15, belly: 0.6, bottom: C.navy }), on(46, 1.05, path('M-17 -42 L-14 4 M17 -42 L14 4', 'none', FUR, 4), chainL(), beardL('#6b4a2e')), sack(84, 104, 0.8, GOLD), coin(96, 106, 4), coin(102, 108, 3.5), ground),
  'mtid.riksråd': all(ellipse(60, 92, 44, 10, '#b98a52', C.ink, 1.6), line('M26 98 L26 112 M94 98 L94 112', '#7a4a20', 3), bust(60, 56, ROYAL, bCrown, 1.4), bust(24, 72, RED, '', 1.2), bust(42, 66, C.white, bMitre, 1.2), bust(78, 66, C.navy, '', 1.2), bust(96, 72, '#5a6a80', '', 1.2), book(60, 90, 0.5, CREAM, false)),
  'mtid.landskapslag': all(path('M60 8 C72 10 74 26 68 38 C64 50 72 62 66 76 C62 90 60 100 50 108 C40 112 34 104 38 92 C42 80 34 66 40 54 C44 40 38 22 48 12 C52 8 56 8 60 8 Z', '#cfe3c4', C.ink, 1.6), line('M42 34 C52 36 62 32 70 34 M38 60 C48 62 58 58 68 60 M40 86 C48 86 56 84 62 86', C.ink, 1.2, '3 2'),
    book(58, 22, 0.42, RED, false), book(54, 47, 0.42, C.navy, false), book(54, 72, 0.42, C.green, false), book(50, 96, 0.42, '#b07aa1', false)),
  'mtid.eriksgata': all(path('M60 8 C72 10 74 26 68 38 C64 50 72 62 66 76 C62 90 60 100 50 108 C40 112 34 104 38 92 C42 80 34 66 40 54 C44 40 38 22 48 12 C52 8 56 8 60 8 Z', '#cfe3c4', C.ink, 1.6), ...[[56, 30], [62, 54], [52, 80], [46, 98]].map(([x, y]) => circle(x!, y!, 3.4, RED, C.ink, 1)), line('M56 30 C80 36 72 48 62 54 C78 64 70 74 52 80 C36 86 38 94 46 98', HL, 2, '4 3'), crownBig(56, 18, 0.4), g('translate(100 112) scale(0.5)', horseL(), g('translate(-4 -34)', path('M-8 -26 L6 -26 C8 -16 7 -8 6 0 L-8 0 C-9 -8 -9 -16 -8 -26 Z', ROYAL, C.ink, 1.6), circle(-1, -34, 7.5, C.skin, C.ink, 1.6), path('M-7 -39 L-7 -48 L-3 -44 L0 -49 L3 -44 L7 -48 L7 -39 Z', GOLD, C.ink, 1.2)))),
  'mtid.fogde': all(greyed(castle(26, 112, 0.6)), fig(60, '#5a6a80', 'angry', { h: 1.0, bottom: C.dark }), on(60, 1, helmetL()), reach(60, 1, 1, 80, 70), greyed(peasant(100, 0.8)), sack(84, 78, 0.85), ground),
  'mtid.maktkamp': all(crownBig(60, 46, 0.8), fig(18, RED, 'angry', { h: 0.85 }), fig(102, C.navy, 'angry', { h: 0.85 }), reach(18, 0.85, 1, 44, 52), reach(102, 0.85, -1, 76, 52), line('M44 52 L50 50 M76 52 L70 50', C.ink, 1.4), path('M36 30 C40 26 44 26 46 30 M74 30 C76 26 80 26 84 30', 'none', C.dark, 1.4), ground),
  'mtid.avsätta': all(greyed(at(36, 112, 1, throneL())), fig(80, ROYAL, 'shock', { h: 0.9, bottom: ROYAL }), arrow(46, 60, 64, 60, HL, 2.4), crownBig(36, 40, 0.45), cross(36, 40, 1.4), greyed(fig(108, C.grey, 'angry', { h: 0.75 })), ground),
  'mtid.union': all(crownBig(60, 22, 0.7), path('M20 72 C20 50 100 50 100 72', 'none', GOLD, 3), shieldFlag(28, 80, RED, 'cross'), shieldFlag(60, 80, RED, 'lion'), shieldFlag(92, 80, '#2f5aa8', 'crowns')),
  // ── 1927 Medeltidens vardagsliv ──
  'mtid.timmerhus': all(cabin(60, 108, 1.7, { smoke: true }), tree(12, 108, 0.6), tree(108, 108, 0.6), ground),
  'mtid.eldstad': all(rect(4, 4, 112, 108, '#5a4a3a', 0, null), rect(4, 4, 112, 108, 'rgba(240,200,140,0.25)', 0, null), path('M4 4 L52 4 L56 14 L64 14 L68 4 L116 4', 'none', C.ink, 1.4), smoke(60, 46, 1), ellipse(60, 100, 34, 8, STONE2, C.ink, 1.4), ...[34, 46, 58, 70, 82].map((x) => ellipse(x, 98, 5, 3.4, STONE, C.ink, 0.9)), flameS(60, 88, 1.3), lo('M36 52 L60 46 L84 52', C.dark, 1.4), line('M60 46 L60 58', C.dark, 1.2), pot(60, 66, 0.9), rect(4, 108, 112, 4, '#3d2e22', 0, null)),
  'mtid.halm': all(sheaf(26, 104, 1.2), sheaf(52, 104, 1.1), path('M64 112 C70 96 110 94 116 112 Z', '#e8c870', C.ink, 1.3), ...Array.from({ length: 10 }, (_, i) => line(`M${72 + i * 4} ${110 - (i % 3)} L${76 + i * 4} ${100 + (i % 4)}`, '#c8a040', 1.2)), ground),
  'mtid.fäll': all(bed(10, 86, 100), path('M14 86 C12 76 20 68 32 70 C40 62 56 64 62 70 C72 64 88 66 94 72 C104 70 110 78 106 86 Z', FUR, C.ink, 1.6), ...[[26, 76], [40, 72], [54, 76], [70, 72], [84, 76], [96, 80]].map(([x, y]) => path(`M${x! - 4} ${y} q2 -3 4 0 q2 -3 4 0`, 'none', '#c8bca6', 1.2)), circle(20, 66, 7, C.skin, C.ink, 1.3), path('M14 64 C14 56 26 56 26 64 Z', C.hair, null), line('M17 66 L19 66 M21 66 L23 66', C.ink, 1), ground),
  'mtid.talgljus': all(rect(42, 98, 36, 6, '#8a6a4a', 2, C.ink, 1.3), candle(60, 98, 2.2, '#efe3c0'), smoke(64, 30, 0.6), sheep(24, 100, 1), arrow(36, 90, 44, 82, HL, 1.8), circle(60, 46, 26, 'rgba(242,193,78,0.18)', null), ground),
  'mtid.brunn': all(ellipse(44, 92, 22, 6, STONE2, C.ink, 1.4), rect(22, 92, 44, 20, STONE, 1, C.ink, 1.6), ...[28, 40, 52].map((x) => line(`M${x} 92 L${x} 112`, STONE2, 1)), lo('M26 92 L26 52 M62 92 L62 52', LOG, 3), path('M20 54 L44 40 L68 54 Z', '#8a5a3a', C.ink, 1.4), line('M44 56 L44 76', C.dark, 1.2), path('M38 76 L50 76 L48 86 L40 86 Z', LOG, C.ink, 1.2),
    fig(94, '#c96b3c', 'smile', { h: 0.65, hairStyle: 'long' }), reach(94, 0.65, -1, 82, 92), path('M76 92 L88 92 L86 102 L78 102 Z', LOG, C.ink, 1.2), ground),
  'mtid.svagdricka': all(table(86), barrel(22, 100, 1), mug(54, 84, 1.3), mug(78, 84, 1.1), fig(100, '#c96b3c', 'smile', { h: 0.62 }), ground),
  'mtid.fasta': all(rect(10, 8, 62, 56, C.white, 2, C.ink, 1.4), rect(10, 8, 62, 10, RED, 2, C.ink, 1.2), ...Array.from({ length: 20 }, (_, i) => rect(14 + (i % 5) * 11.5, 22 + Math.floor(i / 5) * 10, 9, 7, '#e6e2d8', 1, null)), T(41, 54, '40', 18, C.ink), g('translate(92 34)', path('M-10 4 C-14 -6 -4 -14 4 -8 C8 -6 10 0 6 4 L10 10 C12 12 10 14 8 12 L2 6 C-2 8 -8 8 -10 4 Z', '#c97a4a', C.ink, 1.3)), noSign(92, 34, 16),
    g('translate(60 92)', path('M-24 0 C-14 -12 10 -12 18 0 C10 12 -14 12 -24 0 Z', '#7aa0c4', C.ink, 1.4), path('M18 0 L28 -8 L28 8 Z', '#7aa0c4', C.ink, 1.4), circle(-14, -2, 1.6, C.ink, null)), check(96, 92, 1.4)),
  'mtid.gille': all(table(82), ...[[24, '#c96b3c'], [48, C.denim], [72, C.green], [96, '#b07aa1']].map(([x, col], i) => all(bust(+x!, 62, col as string, '', 1.6), mug(+x! + (i < 2 ? 10 : -10), 50, 0.8))), bowl(40, 80, 0.9, ellipse(0, -2, 6, 2, '#c97a4a', null)), bowl(82, 80, 0.9, ellipse(0, -2, 6, 2, '#e8c870', null)), ground),
  'mtid.spelman': all(fig(36, '#5a6a80', 'calm', { h: 1, bottom: C.dark }), g('translate(48 46) rotate(-30)', ellipse(0, 0, 9, 5, '#a8743f', C.ink, 1.2), line('M8 0 L22 0', '#6b4220', 2)), reach(36, 1, 1, 52, 44), reach(36, 1, -1, 30, 44), line('M28 38 L60 30', C.dark, 1.2), note2(66, 18), note2(78, 28),
    fig(84, '#c96b3c', 'laugh', { h: 0.7, hairStyle: 'long' }), fig(104, C.green, 'laugh', { h: 0.72 }), reach(84, 0.7, 1, 94, 70), reach(104, 0.72, -1, 94, 70), ground),
  'mtid.gycklare': all(fig(60, '#e8302c', 'laugh', { h: 0.8, bottom: '#f2c14e' }), on(60, 0.8, path('M-10 -62 L-18 -74 L-6 -66 L0 -78 L6 -66 L18 -74 L10 -62 Z', C.green, C.ink, 1.2), circle(-18, -74, 2.2, GOLD, C.ink, 0.8), circle(18, -74, 2.2, GOLD, C.ink, 0.8), circle(0, -78, 2.2, GOLD, C.ink, 0.8)), reach(60, 0.8, -1, 40, 56), reach(60, 0.8, 1, 80, 56),
    circle(38, 34, 5, C.denim, C.ink, 1.2), circle(60, 12, 5, GOLD, C.ink, 1.2), circle(82, 34, 5, C.green, C.ink, 1.2), path('M40 50 C40 30 50 16 56 13 M80 50 C80 30 70 16 64 13', 'none', C.grey2, 1, ), ground),
  'mtid.barnadödlighet': all(...[16, 38, 60, 82, 104].map((x, i) => cradle(x, 100, 1, i % 2 === 0, i % 2 === 1)), ...[38, 82].map((x) => cross(x, 80, 0.7, C.dark)), ground),
};

function heart2(x: number, y: number, s = 1): Svg { return at(x, y, s, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', RED, C.ink, 1.4)); }
function note2(x: number, y: number): Svg { return all(path(`M${x} ${y + 6} L${x} ${y - 8}`, 'none', C.navy, 1.8), ellipse(x - 2.5, y + 6, 3.2, 2.4, C.navy, null)); }
function shieldFlag(x: number, y: number, col: string, kind: 'cross' | 'lion' | 'crowns'): Svg {
  const sh = 'M-14 -16 L14 -16 L14 0 C14 10 6 16 0 20 C-6 16 -14 10 -14 0 Z';
  const mark = kind === 'cross' ? line('M-4 -16 L-4 18 M-14 -2 L14 -2', C.white, 4)
    : kind === 'lion' ? path('M-6 8 L-6 -6 L-2 -10 L4 -10 L6 -6 L2 -4 L4 4 L8 8 Z', GOLD, C.ink, 0.8)
      : all(...[[-6, -8], [6, -8], [0, 4]].map(([cx, cy]) => path(`M${cx! - 4} ${cy! + 2} L${cx! - 4.5} ${cy! - 3} L${cx! - 2} ${cy! - 1} L${cx!} ${cy! - 4} L${cx! + 2} ${cy! - 1} L${cx! + 4.5} ${cy! - 3} L${cx! + 4} ${cy! + 2} Z`, GOLD, C.ink, 0.6)));
  return at(x, y, 1, path(sh, col, C.ink, 1.6), g('', `<clipPath id="cl${kind}"><path d="${sh}"/></clipPath>`, `<g clip-path="url(#cl${kind})">${mark}</g>`), path(sh, 'none', C.ink, 1.6));
}
