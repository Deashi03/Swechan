/**
 * Historia & humaniora → Civilisationer & världsdelars historia → Mellanösterns historia, 2431–2437 (0.41):
 * Mesopotamian city states, ancient Egypt, the Persian empires, Byzantium, the Arab caliphates, the Ottoman
 * Empire and the Middle East in the 1900s.
 * Recurring signs: sand-coloured desert with a pale sky, a blue river, mud-brick buildings, clay tablets with
 * wedge marks, a pharaoh with a striped headcloth, a Persian king with a tall crown and a long black beard,
 * gold icons with a halo, turbans for rulers, simple maps (land beige, sea blue).
 * The thing the word names is in full colour and often marked with an orange ring; a grey copy is the
 * contrast. Digits only (years, prices), no words or letters, no brands, no pointing fingers (palms only).
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { type Build } from './figures';
import { HL, arm } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Colours ──────────────────────────────────────────────────────────
const RED = '#c8372d';
const GOLD = C.gold;
const ROYAL = '#7b3fa0';
const BRICK = '#c99a62';
const BRICK2 = '#a8743f';
const MUD = '#b98a5a';
const SAND = '#ecd9a8';
const SAND2 = '#d9bf80';
const SKY = '#e2eef6';
const SEA = '#8cc3e3';
const SEA2 = '#5f9fc8';
const GRASS = '#9fcb84';
const CREAM = '#f3ead7';
const LAPIS = '#2f5aa8';
const WOOD2 = '#7a4a20';
const LAND = '#e6d8b4';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const num = (x: number, y: number, n: string, size = 9, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${n}</text>`;

// ── Scenery ──────────────────────────────────────────────────────────
const ground = line('M4 112 L116 112', C.grey2, 2);
const skyBg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const room = (col: string = '#f3ede2') => rect(4, 4, 112, 108, col, 3, null);
const desert = (y = 84) => all(skyBg(), rect(4, y, 112, 112 - y, SAND, 0, null), line(`M10 ${y + 8} q8 -3 16 0 M70 ${y + 14} q8 -3 16 0`, SAND2, 1.4));
const sunC = (x: number, y: number, r = 7) => all(circle(x, y, r + 3, 'rgba(242,193,78,0.35)', null), circle(x, y, r, C.yellow, C.ink, 1.2));
const sea = (y: number) => all(rect(4, y, 112, 112 - y, SEA, 0, null), ...range(4).map((i) => line(`M${10 + i * 28} ${y + 6 + (i % 2) * 5} q4 -3 8 0 q4 3 8 0`, SEA2, 1.4)));

// ── Figures ──────────────────────────────────────────────────────────
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: f1(ty - 38 * s), sl: f1(x - 13 * s), sr: f1(x + 13 * s) }; };
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
// head and body accessories (standing-figure coordinates)
const nemesL = () => all(path('M-11.5 -57 C-12 -71 12 -71 11.5 -57 L15 -38 L8 -40 L7.5 -52 C4 -55 -4 -55 -7.5 -52 L-8 -40 L-15 -38 Z', GOLD, C.ink, 1.3),
  ...[-12, -9.5, 9.5, 12].map((d) => line(`M${d} -54 L${d + Math.sign(d) * 1.6} -40`, LAPIS, 1.4)), line('M-10 -62 L10 -62', LAPIS, 1.6), circle(0, -66, 1.8, LAPIS, null), rect(-1.6, -47, 3.2, 8, '#3a2a1a', 1, C.ink, 0.6));
const crookL = () => all(line('M-8 -30 L8 -42', '#2a3f7a', 2.2), path('M8 -42 C11 -47 6 -50 4 -46', 'none', '#2a3f7a', 2.2), line('M8 -30 L-6 -42', GOLD, 2.2), line('M-6 -42 L-10 -46 M-6 -42 L-8 -47 M-6 -42 L-11 -44', '#2a3f7a', 1.2));
const persCrownL = () => all(path('M-9.5 -62 L-10.5 -80 L10.5 -80 L9.5 -62 Z', GOLD, C.ink, 1.3), ...[-8, -3, 2, 7].map((d) => rect(d, -84, 3, 4.5, GOLD, 0.3, C.ink, 0.8)), line('M-10 -70 L10 -70', '#b88a20', 1.2));
const persBeardL = (col: string = '#2b2320') => all(path('M-8 -53 C-10 -34 10 -34 8 -53 C4 -49.5 -4 -49.5 -8 -53 Z', col, C.ink, 1), ...[-4, 0, 4].map((d) => line(`M${d} -48 L${d} -38`, '#5a4a40', 0.8)));
const beardL = (col: string = '#e8e8e8') => path('M-8 -53 C-8 -40 8 -40 8 -53 C4 -49.5 -4 -49.5 -8 -53 Z', col, C.ink, 1);
const turbanL = (col: string = C.white, big = 1) => all(ellipse(0, -64, 12.5 * big, 6.5 * big, col, C.ink, 1.3), path(`M${-11 * big} -64 C${-6 * big} -60 ${6 * big} -68 ${11 * big} -64`, 'none', C.grey, 1), path(`M${-10 * big} -61 C${-4 * big} -57 ${6 * big} -64 ${10 * big} -60`, 'none', C.grey, 1));
const blackTurbanL = () => all(path('M-11.5 -59 C-13 -74 13 -74 11.5 -59 C6 -62 -6 -62 -11.5 -59 Z', '#26262c', C.ink, 1.3), path('M-10 -64 C-4 -61 4 -66 10 -63', 'none', '#55555e', 1));
const borkL = () => all(path('M6 -84 C19 -80 21 -58 17 -42 L12 -43 C14 -58 12 -72 5 -79 Z', C.white, C.ink, 1.2), path('M-9.5 -61 L-8 -86 C-6 -93 6 -93 8 -86 L9.5 -61 Z', C.white, C.ink, 1.3), rect(-10, -66, 20, 5, GOLD, 1, C.ink, 1), rect(-1.4, -76, 2.8, 10, GOLD, 0.6, null));
const helmL = () => all(path('M-10.5 -48 L-10.5 -64 C-10.5 -71 10.5 -71 10.5 -64 L10.5 -48 Z', C.silver, C.ink, 1.3), line('M-9 -57 L9 -57', C.ink, 1.6), line('M0 -54 L0 -48', C.ink, 1));
const crossTunicL = () => all(path('M-13 -41 L13 -41 L14 4 L-14 4 Z', C.white, C.ink, 1.2), rect(-2.2, -36, 4.4, 26, RED, 0, null), rect(-9, -28, 18, 4.4, RED, 0, null));
const furHatL = () => all(path('M-8.5 -64 L0 -80 L8.5 -64 Z', RED, C.ink, 1.2), ellipse(0, -63, 12.5, 3.8, '#8a6a48', C.ink, 1.1));
const priestCapL = () => all(path('M-10 -60 C-10 -72 10 -72 10 -60 Z', C.white, C.ink, 1.2), path('M-7 -53 L7 -53 L6 -45 L-6 -45 Z', C.white, C.ink, 1));
const monkL = () => all(rect(-9.5, -74, 19, 12, '#26262c', 1, C.ink, 1.1), path('M-11 -62 L11 -62 L14 -40 L-14 -40 Z', '#26262c', C.ink, 1.1), beardL('#6b4a2e'));
const sumerL = () => all(path('M-13 -10 L13 -10 L15 6 L-15 6 Z', '#e8dcc0', C.ink, 1.1), ...range(3).map((r) => line(`M-13 ${-6 + r * 4} q2 2 4 0 q2 2 4 0 q2 2 4 0 q2 2 4 0 q2 2 4 0 q2 2 4 0`, '#b8a880', 1)));
const robeL = (col: string) => path('M-14 -42 L14 -42 L17 46 L-17 46 Z', col, C.ink, 1.3);
/** A small bust for crowds. */
const bust = (x: number, y: number, top: string, hat: Svg = '', s = 1, grey = false) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-8 12 C-8 4 8 4 8 12 Z', grey ? C.grey : top, C.ink, 1.2), circle(0, 0, 5.4, grey ? C.grey2 : C.skin, C.ink, 1.2),
  path('M-5.4 -1 C-5.4 -8 5.4 -8 5.4 -1 C3 -4 -3 -4 -5.4 -1 Z', grey ? C.grey : C.hair, null), circle(-2, 0, 0.8, C.ink, null), circle(2, 0, 0.8, C.ink, null), hat);
const bTurban = ellipse(0, -5.5, 6.8, 3.4, C.white, C.ink, 0.9);
const bScarf = path('M-6 -1 C-7 -9 7 -9 6 -1 L7 8 L4 7 L4 1 C2 -3 -2 -3 -4 1 L-4 7 L-7 8 Z', '#d64545', C.ink, 0.8);
// seated figure facing right; local: feet at y 0, head centre (−5, −66)
const lo = (d: string, col: string, w: number) => line(d, C.ink, w + 2) + line(d, col, w);
const seatedL = (top: string, bottom: string) => all(lo('M-4 -24 L12 -24 L13 -3', bottom, 8.5), ellipse(16, -1.5, 6, 3, C.black, C.ink, 1),
  path('M-15 -54 L5 -54 C7 -42 7 -30 6 -21 L-14 -21 C-16 -32 -16 -44 -15 -54 Z', top, C.ink, 1.8), rect(-8, -61, 6, 8, C.skin, 2, C.ink, 1.2), circle(-5, -66, 9.5, C.skin, C.ink, 1.8),
  path('M-14.5 -68 C-14 -80.5 4 -80.5 4.5 -68 C0 -72 -10 -72 -14.5 -68 Z', C.hair, C.ink, 1.4), circle(-1, -66, 1.2, C.ink, null), line('M-3.5 -61.5 Q-1 -59.5 1.5 -61.5', C.ink, 1.2),
  lo('M-4 -50 L12 -38', top, 6), circle(13, -37, 3.2, C.skin, C.ink, 1.2));
const throneL = (col: string = '#b23a3a') => all(rect(-23, -82, 11, 82, col, 2, C.ink, 1.6), circle(-17.5, -84, 3.4, GOLD, C.ink, 1), rect(-23, -24, 34, 6, col, 1.5, C.ink, 1.6), line('M-21 -18 L-21 0 M9 -18 L9 0', '#7a2a2a', 3.2));
const seated = (x: number, s: number, top: string, bottom: string, o: { throne?: boolean; flip?: boolean; hat?: Svg; throneCol?: string } = {}) =>
  g(`translate(${x} 112) scale(${o.flip ? -s : s} ${s})`, o.throne ? throneL(o.throneCol) : '', seatedL(top, bottom), o.hat ? g('translate(-5 -10)', o.hat) : '');
// kneeling figure facing right; local: ground 0, head centre (6, −58)
const kneelL = (top: string, bottom: string, hat: Svg = '') => all(
  lo('M-4 -22 L-2 -4 L-18 -4', bottom, 8), ellipse(-21, -3, 4, 3, C.black, C.ink, 1), lo('M-4 -22 L11 -22 L12 -3', bottom, 8), ellipse(15, -1.5, 5, 2.6, C.black, C.ink, 1),
  path('M-12 -50 L4 -52 C8 -40 6 -30 4 -19 L-12 -19 C-14 -30 -14 -40 -12 -50 Z', top, C.ink, 1.8), circle(6, -58, 9, C.skin, C.ink, 1.8), path('M-3 -60 C-3 -72.5 15 -72.5 15 -60 C10 -64 2 -64 -3 -60 Z', C.hair, C.ink, 1.4),
  circle(10.5, -57.5, 1.1, C.ink, null), line('M8 -52.6 Q10.5 -51 13 -52.8', C.ink, 1.1), lo('M0 -46 L18 -40', top, 6), circle(19, -40, 3, C.skin, C.ink, 1.2), hat);
const kneel = (x: number, s: number, top: string, bottom: string, flip = false, hat: Svg = '') => g(`translate(${x} 112) scale(${flip ? -s : s} ${s})`, kneelL(top, bottom, hat));

// ── Things ───────────────────────────────────────────────────────────
const ring = (x: number, y: number, r: number) => circle(x, y, r, 'none', HL, 2.6);
const noSign = (x: number, y: number, r = 8) => all(circle(x, y, r, 'none', RED, 2.6), line(`M${f1(x - r * 0.7)} ${f1(y - r * 0.7)} L${f1(x + r * 0.7)} ${f1(y + r * 0.7)}`, RED, 2.6));
const palm = (x: number, y: number, s = 1) => at(x, y, s, ...[-4.6, -1.6, 1.4, 4.4].map((d, i) => rect(d - 1.3, -9 + Math.abs(i - 1.5) * 1.2, 2.6, 9, C.skin, 1.3, C.ink, 0.9)), path('M-5.5 -1 L5.5 -1 L5 5 C4 8 -4 8 -5 5 Z', C.skin, C.ink, 1));
const coin = (x: number, y: number, r = 5) => all(circle(x, y, r, GOLD, C.ink, 1.2), circle(x, y, r * 0.55, 'none', '#b88a20', 1));
const sack = (x: number, y: number, s = 1, col = '#d9c08a') => at(x, y, s, path('M-8 10 C-11 0 -9 -6 -4 -8 L-5 -12 L5 -12 L4 -8 C9 -6 11 0 8 10 Z', col, C.ink, 1.3), line('M-5 -8.5 L5 -8.5', '#8a6a3a', 1.4));
const doc = (x: number, y: number, s = 1, col: string = CREAM, n = 4) => at(x, y, s, path('M-10 -13 L6 -13 L10 -9 L10 13 L-10 13 Z', col, C.ink, 1.4), ...range(n).map((i) => line(`M-7 ${-7 + i * 5} L${i === n - 1 ? 2 : 7} ${-7 + i * 5}`, C.grey, 1.3)));
const sword = (x: number, y: number, s = 1, r = 0) => g(`translate(${x} ${y}) rotate(${r}) scale(${s})`, path('M-1.6 -24 L1.6 -24 L1.6 2 L-1.6 2 Z', C.silver, C.ink, 1), path('M0 -27 L1.6 -24 L-1.6 -24 Z', C.silver, C.ink, 0.8), rect(-6, 2, 12, 2.6, GOLD, 1, C.ink, 0.9), rect(-1.4, 4.6, 2.8, 6, WOOD2, 0.8, C.ink, 0.8));
const flameS = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -16 C8 -6 12 0 10 6 C8 13 -8 13 -10 6 C-12 0 -6 -4 -4 -10 C-2 -4 0 -4 0 -16 Z', C.orange, C.ink, 1.2), path('M0 -2 C4 2 4 8 0 9 C-4 8 -4 2 0 -2 Z', C.yellow, null));
const smoke = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 C-6 -6 6 -10 0 -16 C-6 -22 6 -26 0 -32', 'none', '#9aa3ad', 2.4));
const bubble = (x: number, y: number, w: number, h: number, inner: Svg, tailLeft = true) => all(rect(x - w / 2, y - h / 2, w, h, C.white, 6, C.ink, 1.4), path(tailLeft ? `M${x - w / 2 + 8} ${y + h / 2 - 0.5} L${x - w / 2 + 2} ${y + h / 2 + 8} L${x - w / 2 + 16} ${y + h / 2 - 0.5} Z` : `M${x + w / 2 - 8} ${y + h / 2 - 0.5} L${x + w / 2 - 2} ${y + h / 2 + 8} L${x + w / 2 - 16} ${y + h / 2 - 0.5} Z`, C.white, C.ink, 1.4), rect(x - w / 2 + 2, y + h / 2 - 3, 16, 3, C.white, 0, null), inner);
const tent = (x: number, y: number, s = 1, col: string = '#f2efe6') => at(x, y, s, path('M-14 0 L0 -16 L14 0 Z', col, C.ink, 1.3), path('M-3 0 L0 -8 L3 0 Z', '#8a7a62', null), line('M0 -16 L0 -19', C.ink, 1.2));
const palmTree = (x: number, y: number, s = 1) => at(x, y, s, path('M-1 0 C0 -10 2 -20 1 -30 L3 -30 C4 -20 3 -10 2 0 Z', '#a8743f', C.ink, 1), ...[[-14, -30], [-12, -38], [0, -42], [14, -36], [15, -28]].map(([a, b]) => path(`M2 -30 Q${(a! + 2) / 2} ${b! - 6} ${a} ${b}`, 'none', '#4f9d69', 3)));
const camel = (x: number, y: number, s = 1) => at(x, y, s, path('M-16 -14 C-14 -24 -6 -26 -2 -18 C2 -26 10 -24 12 -14 L16 -14 L18 -26 L23 -27 L24 -23 L20 -22 L19 -10 L-16 -8 Z', '#c89a5a', C.ink, 1.2), ...[-13, -8, 8, 13].map((d) => line(`M${d} -9 L${d} 0`, '#a8743f', 2.2)));
// Mesopotamia
const wedge = (x: number, y: number, s = 1, r = 0) => g(`translate(${x} ${y}) rotate(${r}) scale(${s})`, path('M-2 -2 L2 -2 L0 3 Z', '#6b4a2e', null), line('M0 0 L0 6', '#6b4a2e', 0.9));
const wedgeRow = (x: number, y: number, n: number, s = 1) => all(...range(n).map((i) => wedge(x + i * 4.2 * s, y, s, (i * 47) % 3 === 0 ? 90 : 0)));
const tablet = (x: number, y: number, s = 1, rows = 4) => at(x, y, s, rect(-12, -15, 24, 30, '#c9a27a', 5, C.ink, 1.4), ...range(rows).map((r) => wedgeRow(-8, -9 + r * 6.5, 5, 0.9)));
const ziggurat = (x: number, y: number, s = 1, col: string = BRICK) => at(x, y, s, rect(-40, -16, 80, 16, col, 0.5, C.ink, 1.4), rect(-28, -30, 56, 14, col, 0.5, C.ink, 1.4), rect(-17, -43, 34, 13, col, 0.5, C.ink, 1.4),
  rect(-9, -56, 18, 13, '#e8dcc0', 0.5, C.ink, 1.3), rect(-3, -50, 6, 7, '#6b4a2e', 0.5, null), path('M-6 0 L-4 -43 L4 -43 L6 0 Z', BRICK2, C.ink, 1.1), ...range(8).map((i) => line(`M${-5.6 + i * 0.25} ${-3 - i * 5} L${5.6 - i * 0.25} ${-3 - i * 5}`, '#7a5a3a', 0.8)));
const mudHouse = (x: number, y: number, s = 1, col: string = MUD) => at(x, y, s, rect(-10, -14, 20, 14, col, 1, C.ink, 1.2), rect(-3, -7, 6, 7, '#5a3a24', 0.5, null), rect(-10, -16, 20, 3, BRICK2, 0.5, C.ink, 0.8));
const stele = (x: number, y: number, s = 1) => at(x, y, s, path('M-14 0 L-14 -60 C-14 -72 14 -72 14 -60 L14 0 Z', '#3d3f4a', C.ink, 1.5),
  g('translate(-5 -50) scale(0.42)', seatedL('#8a8a96', '#8a8a96')), g('translate(7 -42) scale(0.26)', path('M-14 -54 L4 -54 L4 0 L-14 0 Z', '#8a8a96', null), circle(-5, -62, 9, '#8a8a96', null)),
  ...range(6).map((r) => all(...range(5).map((i) => g(`translate(${-9 + i * 4.4} ${-34 + r * 5.4}) scale(0.7)`, path('M-2 -2 L2 -2 L0 3 Z', '#c9ced4', null))))));
// Egypt
const pyramid = (x: number, y: number, s = 1, col: string = '#e3c27a') => at(x, y, s, path('M-30 0 L0 -30 L30 0 Z', col, C.ink, 1.4), path('M0 -30 L30 0 L8 0 Z', '#c9a45a', null), path('M-30 0 L0 -30 L30 0 Z', 'none', C.ink, 1.4));
const sarco = (x: number, y: number, s = 1, open = false) => at(x, y, s, path('M-8 -26 C-12 -24 -12 -16 -9 -12 L-8 0 L8 0 L9 -12 C12 -16 12 -24 8 -26 C4 -30 -4 -30 -8 -26 Z', open ? '#7a4a20' : GOLD, C.ink, 1.3),
  open ? '' : all(circle(0, -21, 4, C.skin, C.ink, 1), path('M-4 -23 C-4 -28 4 -28 4 -23 L5 -16 L-5 -16 Z', LAPIS, null), circle(0, -21, 3.2, C.skin, null), line('M-6 -10 L6 -10 M-6 -6 L6 -6', LAPIS, 1.2)));
const mummyL = (h = 1) => at(0, 0, h, path('M-7 -48 C-10 -46 -10 -38 -9 -34 L-8 0 L8 0 L9 -34 C10 -38 10 -46 7 -48 C4 -51 -4 -51 -7 -48 Z', '#efe6cf', C.ink, 1.4),
  ...range(9).map((i) => line(`M-8 ${-40 + i * 4.5} L8 ${-37 + i * 4.5}`, '#c8b890', 1.1)), circle(-2.4, -42, 0.9, C.ink, null), circle(2.4, -42, 0.9, C.ink, null));
const sphinx = (x: number, y: number, s = 1) => at(x, y, s, path('M-34 0 L-34 -8 C-34 -14 -26 -16 -18 -16 L8 -16 L10 -24 L22 -24 L24 -6 L34 -4 L34 0 Z', '#e0bd78', C.ink, 1.4),
  path('M8 -16 L8 -36 C8 -46 24 -46 24 -36 L26 -18 L22 -20 L21 -30 L11 -30 L10 -20 L6 -18 Z', GOLD, C.ink, 1.3), ...[10, 12.5, 21.5, 24].map((d) => line(`M${d} -30 L${d} -20`, LAPIS, 1.2)),
  circle(16, -32, 6, '#e0bd78', C.ink, 1.2), circle(14, -33, 0.9, C.ink, null), circle(18, -33, 0.9, C.ink, null), line('M14 -29.5 L18 -29.5', C.ink, 0.9), path('M-34 -8 C-40 -10 -40 -18 -36 -20', 'none', C.ink, 1.4), line('M24 -4 L34 -4', C.ink, 1));
const glyph = (k: number, x: number, y: number, s = 1, col: string = C.ink) => at(x, y, s, [
  all(ellipse(0, 0, 4.6, 2.4, 'none', col, 1), circle(0, 0, 1.3, col, null), path('M-1 2.4 L-2 5', 'none', col, 1)), // eye
  all(path('M-4 3 C-4 -1 0 -3 2 -3 L4 -4 L3 -2 C3 2 0 3 -4 3 Z', 'none', col, 1), line('M-1 3 L-1 5 M1 3 L1 5', col, 1)), // bird
  all(ellipse(0, -2.4, 2, 2.4, 'none', col, 1.1), line('M-3.6 0.4 L3.6 0.4 M0 0 L0 5', col, 1.2)), // ankh
  line('M-4 0 l2 -2 l2 2 l2 -2 l2 2', col, 1), // water
  all(path('M-3 4 L-3 -2 C-3 -5 3 -5 3 -2 L3 4', 'none', col, 1)), // reed hut
  all(path('M-4 2 C-2 -3 2 -3 4 2', 'none', col, 1), circle(0, -2.6, 1, col, null)), // sun-on-hill
][k % 6]!);
const glyphCol = (x: number, y: number, n: number, s = 1, start = 0, col: string = C.ink) => all(...range(n).map((i) => glyph(start + i, x, y + i * 10 * s, s, col)));
const papyrusPlant = (x: number, y: number, s = 1) => at(x, y, s, ...[-6, 0, 6].map((d, i) => all(line(`M${d * 0.4} 0 L${d} ${-30 - i * 4}`, '#4f9d69', 1.6), path(`M${d - 6} ${-34 - i * 4} L${d} ${-30 - i * 4} L${d + 6} ${-34 - i * 4} C${d + 4} ${-40 - i * 4} ${d - 4} ${-40 - i * 4} ${d - 6} ${-34 - i * 4} Z`, '#7fbf6a', C.ink, 0.9))));
const scroll = (x: number, y: number, s = 1) => at(x, y, s, rect(-16, -10, 32, 20, '#ecdcae', 1, C.ink, 1.3), circle(-16, 0, 3, '#d9c08a', C.ink, 1), ...range(3).map((i) => glyphCol(-8 + i * 8, -5, 2, 0.7, i * 2, '#5a4a3a')));
const jar = (x: number, y: number, s = 1, col: string = '#e8dcc0') => at(x, y, s, path('M-4 0 C-6 -4 -6 -10 -3 -12 L3 -12 C6 -10 6 -4 4 0 Z', col, C.ink, 1), circle(0, -14, 3, '#d9c08a', C.ink, 0.9));
const torch = (x: number, y: number, s = 1) => at(x, y, s, line('M0 0 L0 -14', WOOD2, 2.4), flameS(0, -16, 0.45));
// Persia
const fireAltar = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 0 L-6 -8 L-10 -12 L-10 -16 L10 -16 L10 -12 L6 -8 L8 0 Z', '#d6cdbd', C.ink, 1.3), path('M-12 -20 L12 -20 L10 -16 L-10 -16 Z', '#c9c1b2', C.ink, 1.2), flameS(0, -30, 0.9));
const columns = (x: number, y: number, n: number, gap = 14, h = 50, col: string = '#e3d6bc') => all(...range(n).map((i) => all(rect(x + i * gap - 2.5, y - h, 5, h, col, 0.5, C.ink, 1.1), rect(x + i * gap - 5, y - h - 4, 10, 4, col, 0.5, C.ink, 1))));
// Byzantium
const icon = (x: number, y: number, s = 1, grey = false) => at(x, y, s, rect(-11, -15, 22, 30, grey ? '#ccc' : GOLD, 1.5, C.ink, 1.4), rect(-8, -12, 16, 24, grey ? '#ddd' : '#f2d27a', 1, null),
  circle(0, -5, 5.6, grey ? '#eee' : '#f6e3a0', grey ? C.grey : '#b88a20', 1), circle(0, -5, 3.2, grey ? C.grey2 : C.skin2, C.ink, 0.8), path('M-6 12 C-6 2 6 2 6 12 Z', grey ? C.grey : '#a83232', C.ink, 0.8), path('M-3 4 L0 12 L3 4', 'none', grey ? C.grey : LAPIS, 1.2));
const dome = (x: number, y: number, s = 1, col: string = '#c9c1b2') => at(x, y, s, rect(-30, -26, 60, 26, '#e8dcc4', 1, C.ink, 1.4), path('M-22 -26 C-22 -50 22 -50 22 -26 Z', col, C.ink, 1.4), ...range(7).map((i) => rect(-19 + i * 6, -30, 2.4, 3, '#7aa0c4', 0.3, null)), rect(-4, -12, 8, 12, '#6b4a2e', 2, C.ink, 1));
const minaret = (x: number, y: number, s = 1, col: string = '#efe6d4') => at(x, y, s, rect(-3, -50, 6, 50, col, 0.5, C.ink, 1.2), rect(-5, -36, 10, 3, col, 0.5, C.ink, 1), path('M-3 -50 L0 -60 L3 -50 Z', '#7a8a98', C.ink, 1));
const ship = (x: number, y: number, s = 1, hull: string = '#7a4a20', sail: string = CREAM) => at(x, y, s, line('M0 -4 L0 -38', WOOD2, 2), path('M0 -36 L18 -14 L0 -12 Z', sail, C.ink, 1.2), path('M-26 -6 L26 -6 L20 4 L-20 4 Z', hull, C.ink, 1.4), ...range(5).map((i) => line(`M${-16 + i * 8} 2 L${-19 + i * 8} 10`, WOOD2, 1.4)));
const wallTowers = (x: number, y: number, w: number, h: number, col: string = '#c9c1b2') => all(rect(x, y - h, w, h, col, 0.5, C.ink, 1.4), ...range(Math.floor(w / 8)).map((i) => rect(x + 1 + i * 8, y - h - 4, 5, 4, col, 0.3, C.ink, 1)), rect(x - 4, y - h - 12, 12, h + 12, col, 0.5, C.ink, 1.4), rect(x + w - 8, y - h - 12, 12, h + 12, col, 0.5, C.ink, 1.4));
const shieldCross = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -12 L10 -8 C10 3 6 9 0 13 C-6 9 -10 3 -10 -8 Z', C.white, C.ink, 1.3), rect(-1.6, -9, 3.2, 19, RED, 0, null), rect(-7, -3, 14, 3.2, RED, 0, null));
const banner = (x: number, y: number, col: string, s = 1, sym: Svg = '') => at(x, y, s, line('M0 0 L0 -40', WOOD2, 2), path('M0 -40 L20 -36 L0 -28 Z', col, C.ink, 1), sym);
// later periods
const derrick = (x: number, y: number, s = 1) => at(x, y, s, path('M-12 0 L-3 -46 L3 -46 L12 0', 'none', '#5a5f68', 2), line('M-9 -14 L9 -14 M-7 -26 L7 -26 M-5 -36 L5 -36 M-9 -14 L7 -26 M9 -14 L-7 -26 M-7 -26 L5 -36 M7 -26 L-5 -36', '#5a5f68', 1.2), rect(-5, -50, 10, 4, '#5a5f68', 1, C.ink, 1));
const barrel = (x: number, y: number, s = 1, col: string = '#2f6a7a') => at(x, y, s, rect(-8, -22, 16, 22, col, 3, C.ink, 1.3), line('M-8 -15 L8 -15 M-8 -7 L8 -7', C.ink, 1.2), path('M-2 -20 C-4 -17 -1 -16 0 -18 Z', '#2e2e36', null));
const car = (x: number, y: number, s = 1, col: string = '#d64545') => at(x, y, s, path('M-18 0 L-18 -8 L-10 -9 L-5 -16 L8 -16 L13 -9 L18 -8 L18 0 Z', col, C.ink, 1.3), rect(-3, -14, 8, 5, '#bfe3f5', 1, null), circle(-10, 0, 4, C.dark, C.ink, 1), circle(10, 0, 4, C.dark, C.ink, 1));
const hourglass = (x: number, y: number, s = 1) => at(x, y, s, rect(-8, -14, 16, 3, WOOD2, 1, C.ink, 1), rect(-8, 11, 16, 3, WOOD2, 1, C.ink, 1), path('M-6 -11 L6 -11 L1 0 L6 11 L-6 11 L-1 0 Z', 'rgba(220,240,252,0.8)', C.ink, 1.1), path('M-3.6 -6 L3.6 -6 L0.6 -1 L-0.6 -1 Z', '#e0b23c', null), path('M-4 11 L4 11 L0 6 Z', '#e0b23c', null));
const flower = (x: number, y: number, s = 1, col: string = '#ef6fa0') => at(x, y, s, line('M0 0 L0 12', '#4f9d69', 1.6), ...range(5).map((i) => { const a = (i / 5) * Math.PI * 2; return circle(f1(3.4 * Math.cos(a)), f1(-2 + 3.4 * Math.sin(a)), 2.6, col, C.ink, 0.7); }), circle(0, -2, 2, C.yellow, C.ink, 0.6));
const starD = (x: number, y: number, r: number, col: string = LAPIS) => all(path(`M${x} ${y - r} L${f1(x + r * 0.866)} ${f1(y + r / 2)} L${f1(x - r * 0.866)} ${f1(y + r / 2)} Z`, 'none', col, 1.6), path(`M${x} ${y + r} L${f1(x + r * 0.866)} ${f1(y - r / 2)} L${f1(x - r * 0.866)} ${f1(y - r / 2)} Z`, 'none', col, 1.6));
const yurt = (x: number, y: number, s = 1) => at(x, y, s, path('M-20 0 L-20 -14 L20 -14 L20 0 Z', '#f2efe6', C.ink, 1.3), path('M-22 -14 C-14 -26 14 -26 22 -14 Z', '#f2efe6', C.ink, 1.3), line('M-20 -8 L20 -8', RED, 1.6), rect(-4, -10, 8, 10, RED, 1, C.ink, 1));
const horse = (x: number, y: number, s = 1, col: string = '#8a5a3a') => at(x, y, s, path('M-18 -18 C-18 -26 12 -26 14 -20 L22 -34 L28 -33 L28 -28 L20 -16 C18 -12 14 -10 10 -10 L-14 -10 C-18 -10 -18 -14 -18 -18 Z', col, C.ink, 1.3),
  ...[-14, -9, 6, 11].map((d) => line(`M${d} -11 L${d} 0`, col, 3)), path('M-18 -18 C-24 -16 -24 -8 -22 -4', 'none', '#3a2a1a', 2.2), path('M21 -34 L19 -38 L23 -35', '#3a2a1a', null, 1));
const bow = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -14 C8 -8 8 8 0 14', 'none', WOOD2, 2), line('M0 -14 L0 14', C.ink, 0.8));
const crack = (d: string) => line(d, C.ink, 1.6);
const WAY = 'M8 108 C40 104 70 104 66 92 C62 80 20 84 24 70 C28 58 80 62 84 50 C88 38 50 36 56 26 C60 18 76 18 84 18';

export const MIDDLE_EAST_HISTORY_MOTIFS: Record<string, Svg> = {
  // ── 2431 Mesopotamiens stadsstater ──
  'mell.kanal.2': all(desert(56), path('M4 56 L22 56 C26 72 22 92 26 112 L4 112 Z', SEA, C.ink, 1.2), ...[[40, 66, 28], [40, 84, 28], [78, 66, 34], [78, 84, 34]].map(([x, y, w]) => all(rect(x!, y!, w!, 14, GRASS, 1, C.ink, 1), ...range(4).map((i) => line(`M${x! + 3 + i * (w! / 4)} ${y! + 11} l0 -6`, '#4f9d69', 1.4)))),
    path('M22 80 L116 80 L116 84 L22 84 Z', SEA2, C.ink, 1.2), path('M70 66 L74 66 L74 98 L70 98 Z', SEA2, C.ink, 1.2), ring(48, 82, 10), sunC(100, 20), mudHouse(60, 54, 0.9), palmTree(36, 56, 0.6),
    g('translate(0 -24)', fig(96, '#d6c49a', 'smile', { h: 0.55, bottom: '#8a6a48' })), ground),
  'mell.skrivare.2': all(room('#efe4cf'), rect(4, 92, 112, 20, '#d9c4a0', 0, null), seated(52, 0.9, '#e8dcc0', '#e8dcc0', {}), at(70, 74, 0.8, rect(-12, -15, 24, 30, '#c9a27a', 5, C.ink, 1.4), ...range(3).map((r) => wedgeRow(-8, -9 + r * 6.5, 5, 0.9))),
    line('M64 62 L74 54', '#8a6a3a', 2), tablet(96, 98, 0.55), tablet(106, 104, 0.5), ...[[18, 96], [28, 100]].map(([x, y]) => g(`translate(${x} ${y})`, rect(-6, -6, 12, 10, '#d9c08a', 2, C.ink, 1), circle(0, -9, 3, GOLD, C.ink, 0.8))), ground),
  'mell.sumerer': all(desert(90), ziggurat(60, 90, 0.7, '#d9b888'), mudHouse(14, 90, 0.8), mudHouse(106, 90, 0.8),
    ...[[30, 0.78], [60, 0.84], [90, 0.78]].map(([x, h]) => all(fig(+x!, '#e8dcc0', 'calm', { h: +h!, bottom: '#e8dcc0' }), on(+x!, +h!, sumerL(), path('M-10 -58 C-10 -71 10 -71 10 -58 Z', '#2b2320', null), beardL('#2b2320')), reach(+x!, +h!, -1, +x! - 4, 70 + (1 - +h!) * 40), reach(+x!, +h!, 1, +x! + 4, 70 + (1 - +h!) * 40))), ground),
  'mell.ziggurat': all(desert(96), sunC(100, 20), ziggurat(56, 98, 1.15), mudHouse(10, 98, 0.6), mudHouse(106, 98, 0.6), palmTree(108, 96, 0.5), ring(56, 32, 13), ground),
  'mell.kilskrift': all(room('#efe4cf'), rect(10, 14, 100, 88, '#c9a27a', 10, C.ink, 2), ...range(6).map((r) => wedgeRow(22, 28 + r * 12, 9, 2.1)), at(96, 98, 1, line('M0 0 L14 -20', '#a07a40', 4)), ring(30, 40, 9)),
  'mell.lertavla': all(room('#efe4cf'), rect(4, 86, 112, 26, '#b98a52', 0, C.ink, 1.2), tablet(40, 64, 1.7), greyed(doc(92, 70, 1.1, C.white, 5)), path('M84 98 C92 92 104 94 110 100', 'none', C.grey2, 1), tablet(88, 98, 0.45), tablet(100, 100, 0.45), ring(40, 64, 30)),
  'mell.lagsamling': all(room('#efe8da'), stele(48, 108, 1.35), fig(96, '#d6c49a', 'calm', { h: 0.72, bottom: '#8a6a48' }), on(96, 0.72, beardL('#2b2320')), reach(96, 0.72, -1, 80, 66), palm(80, 62, 0.8), ring(48, 74, 16), ground),

  // ── 2432 Det forntida Egypten ──
  'mell.farao': all(desert(90), pyramid(98, 90, 0.7), sunC(22, 20), fig(56, C.white, 'calm', { h: 1.0, bottom: C.white }), on(56, 1.0, rect(-14, -6, 28, 10, GOLD, 1, C.ink, 1), path('M-12 -42 C-6 -34 6 -34 12 -42', 'none', LAPIS, 3), nemesL(), crookL()), ground),
  'mell.pyramid': all(desert(84), sunC(100, 18), pyramid(46, 96, 1.6), pyramid(96, 98, 0.8, '#e8cc8c'), camel(18, 108, 0.7), ground),
  'mell.gravkammare': all(skyBg(), path('M4 70 L116 70 L116 112 L4 112 Z', SAND, null), path('M14 70 L60 16 L106 70 Z', '#e3c27a', C.ink, 1.6), path('M14 70 L106 70 L106 112 L14 112 Z', '#d9bf80', null), line('M4 70 L116 70', C.ink, 1),
    path('M30 70 L50 56 L54 60 L36 74 Z', '#5a4a3a', null), rect(48, 50, 26, 16, '#f2d27a', 1, C.ink, 1.3), g('translate(61 64) rotate(-90) scale(0.42)', sarco(0, 14)), jar(52, 64, 0.5), jar(70, 64, 0.5), ring(61, 58, 15)),
  'mell.balsamera': all(room('#efe4cf'), rect(18, 78, 70, 6, '#b98a52', 1, C.ink, 1.2), line('M24 84 L24 112 M82 84 L82 112', WOOD2, 3), g('translate(54 76) rotate(-90)', mummyL(0.9)),
    fig(100, C.white, 'calm', { h: 0.85, bottom: C.white }), on(100, 0.85, path('M-10 -58 C-10 -71 10 -71 10 -58 Z', '#2b2320', null)), reach(100, 0.85, -1, 80, 72), path('M80 72 C74 70 70 72 66 76', 'none', '#efe6cf', 3), circle(80, 72, 4, '#efe6cf', C.ink, 1),
    ...[[18, 108], [30, 108], [42, 108]].map(([x, y]) => jar(x!, y!, 0.9)), ground),
  'mell.mumie': all(room('#efe4cf'), at(60, 108, 1.7, path('M-12 -56 C-17 -52 -17 -40 -14 -34 L-12 0 L12 0 L14 -34 C17 -40 17 -52 12 -56 C6 -61 -6 -61 -12 -56 Z', '#7a4a20', C.ink, 1.2)), at(60, 104, 1.6, mummyL(1)), ground),
  'mell.sfinx': all(desert(88), pyramid(96, 86, 0.9), sunC(20, 18), sphinx(52, 104, 1.35), ground),
  'mell.hieroglyf': all(room('#efe0bf'), rect(8, 8, 104, 96, '#e8d29a', 2, C.ink, 1.4), ...range(5).map((i) => all(line(`M${20 + i * 20} 12 L${20 + i * 20} 100`, '#c9a45a', 0.8), glyphCol(30 + i * 20 - 10, 24, 5, 1.6, i, '#3a4a7a'))), ring(40, 52, 9)),
  'mell.papyrus': all(skyBg(), rect(4, 86, 112, 26, SEA, 0, null), papyrusPlant(22, 96, 1.4), papyrusPlant(40, 100, 1.1), scroll(84, 60, 1.4), arrow(52, 66, 62, 64, HL, 3), ring(84, 60, 26)),
  'mell.gravplundrare': all(room('#3d3a44'), rect(4, 4, 112, 108, '#4a4552', 3, null), rect(70, 30, 46, 82, '#d9bf80', 0, C.ink, 1.2), g('translate(92 104) scale(0.9)', sarco(0, 0, 1, true)), ...[[80, 106], [104, 106]].map(([x, y]) => coin(x!, y!, 4)),
    fig(40, '#5a5a66', 'shock', { h: 0.9, bottom: '#3d3f4a' }), on(40, 0.9, path('M-11 -58 C-11 -71 11 -71 11 -58 L11 -54 L-11 -54 Z', '#2e2e36', null)), reach(40, 0.9, -1, 18, 62), torch(18, 62, 1.1), reach(40, 0.9, 1, 60, 74), sack(64, 82, 1.2, '#d9c08a'), coin(64, 70, 3.4), coin(70, 72, 3), ground),

  // ── 2433 Persiska imperier ──
  'mell.storkonung': all(room('#efe8da'), columns(10, 100, 2, 10, 70), columns(102, 100, 2, 10, 70), seated(54, 0.95, ROYAL, ROYAL, { throne: true, throneCol: GOLD, hat: all(persCrownL(), persBeardL()) }),
    kneel(90, 0.48, '#3f6fb5', '#3f6fb5', true, g('translate(6 -6)', path('M-5 -64 L-5.5 -70 L-2.5 -67 L0 -71 L2.5 -67 L5.5 -70 L5 -64 Z', GOLD, C.ink, 0.8))), kneel(108, 0.48, '#4f9d69', '#4f9d69', true, g('translate(6 -6)', path('M-5 -64 L-5.5 -70 L-2.5 -67 L0 -71 L2.5 -67 L5.5 -70 L5 -64 Z', GOLD, C.ink, 0.8))), ground),
  'mell.satrap': all(skyBg('#efe8da'), rect(8, 40, 104, 70, LAND, 3, C.ink, 1.4), line('M60 40 L60 110 M8 74 L112 74', C.grey, 1, '4 3'), path('M60 74 L112 74 L112 110 L60 110 Z', '#f3d9a0', C.ink, 2),
    at(24, 60, 0.62, persCrownL(), circle(0, -56, 9, C.skin, C.ink, 1.2), persBeardL()), arrow(36, 30, 70, 52, HL, 2.6),
    g('translate(0 0)', fig(86, '#c8372d', 'calm', { h: 0.62, bottom: '#c8372d' }), on(86, 0.62, path('M-10 -60 C-10 -72 10 -72 10 -60 Z', '#e8dcc0', C.ink, 1.2), persBeardL())), coin(104, 104, 3.6), coin(108, 98, 3.2), coin(100, 98, 3.2), greyed(...[[24, 92], [44, 94]].map(([x, y]) => bust(x!, y!, '#888', '', 1)))),
  'mell.zoroastrism': all(room('#efe8da'), columns(14, 108, 1, 10, 80), columns(106, 108, 1, 10, 80), fireAltar(60, 108, 1.5), fig(92, C.white, 'calm', { h: 0.78, bottom: C.white }), on(92, 0.78, priestCapL()), reach(92, 0.78, -1, 78, 72), palm(78, 68, 0.8), ground),

  // ── 2434 Bysans och regionen ──
  'mell.bildstrid': all(room('#efe8da'), fig(30, RED, 'angry', { h: 0.85, bottom: '#5b6650' }), on(30, 0.85, path('M-12 -58 C-12 -73 12 -73 12 -58 L14 -56 L-14 -56 Z', '#7d858e', C.ink, 1.3)), reach(30, 0.85, 1, 50, 44), at(54, 40, 1, line('M-4 6 L6 -8', WOOD2, 2.6), rect(2, -12, 9, 6, '#7d858e', 1, C.ink, 1)),
    icon(62, 74, 1.1), crack('M58 66 L62 74 L60 82'), fig(92, '#26262c', 'frown', { h: 0.85, bottom: '#26262c' }), on(92, 0.85, monkL()), reach(92, 0.85, -1, 74, 72), ground),
  'mell.sund': all(rect(4, 4, 112, 108, SEA, 3, null), path('M4 4 L52 4 C56 30 50 52 54 70 C56 86 50 100 46 112 L4 112 Z', LAND, C.ink, 1.4), path('M116 4 L70 4 C66 30 72 52 68 70 C66 86 72 100 76 112 L116 112 Z', LAND, C.ink, 1.4),
    ship(61, 64, 0.38), arrow(61, 90, 61, 78, SEA2, 2.4), arrow(61, 40, 61, 28, SEA2, 2.4), dome(26, 60, 0.5), ring(61, 56, 14)),
  'mell.grekisk-eld': all(skyBg('#f2e3d2'), sea(80), ship(30, 84, 0.9, '#7a3a2a', '#a83232'), line('M50 74 L60 70', '#5a5f68', 4), path('M60 70 C70 64 78 66 86 70 C80 72 74 74 66 74 Z', C.orange, C.ink, 1),
    ship(96, 86, 0.75, '#5a4a3a', CREAM), flameS(92, 72, 1.1), flameS(84, 86, 0.6), flameS(104, 88, 0.55), smoke(96, 54, 0.8)),
  'mell.korsfarare': all(skyBg(), path('M4 92 C40 86 80 86 116 92 L116 112 L4 112 Z', SAND, null), fig(56, C.white, 'calm', { h: 1.02, bottom: '#7d858e' }), on(56, 1.02, crossTunicL(), helmL()), shieldCross(34, 80, 1.3), reach(56, 1.02, 1, 78, 70), sword(80, 68, 1.0, 10), banner(100, 110, C.white, 1, all(rect(8, -38, 2.4, 8, RED, 0, null), rect(5, -35.6, 8, 2.4, RED, 0, null))), ground),

  // ── 2435 Arabiska kalifaten ──
  'mell.erövring': all(skyBg(), wallTowers(64, 104, 44, 40), path('M78 104 L78 88 C78 80 92 80 92 88 L92 104 Z', '#3a2a1e', C.ink, 1.2), greyed(at(98, 56, 1, line('M0 0 L-12 14', WOOD2, 2), path('M-12 14 L-2 18 L-12 22 Z', '#888', null))),
    banner(84, 60, '#4f9d69', 0.9), ...[[20, 0.72], [36, 0.76], [52, 0.72]].map(([x, h]) => all(fig(+x!, '#4f6f9a', 'calm', { h: +h!, bottom: '#6b5a44' }), on(+x!, +h!, turbanL()))), reach(36, 0.76, 1, 50, 60), sword(52, 58, 0.8, 30), arrow(28, 104, 70, 104, HL, 3), ground),
  'mell.expansion': all(skyBg('#eef3e6'), rect(8, 10, 104, 96, LAND, 3, C.ink, 1.2), blob(50, 62, 1.0, '#cfe6bf'), blob(50, 62, 0.66, '#9fcb84'), blob(50, 62, 0.34, '#4f9d69'),
    num(50, 66, '1', 9, C.white), num(50, 42, '2', 9), num(50, 26, '3', 9), arrow(62, 66, 86, 82, HL, 2.6), greyed(blob(98, 30, 0.22, '#bbb'))),
  'mell.emir': all(room('#efe8da'), dome(84, 70, 0.7), minaret(116 - 8, 70, 0.8), seated(46, 0.95, '#2f6a7a', '#2f6a7a', { throne: true, throneCol: '#4f9d69', hat: turbanL() }), at(18, 44, 1, path('M0 0 L10 -4 L14 6 L4 12 Z', LAND, C.ink, 1)), bust(92, 100, '#c8372d', bTurban, 1), bust(108, 102, '#3f6fb5', bTurban, 1), ground),
  'mell.mongol': all(skyBg(), path('M4 84 C40 78 80 78 116 84 L116 112 L4 112 Z', GRASS, null), yurt(96, 90, 1.1), horse(70, 112, 0.95), fig(34, '#3f6fb5', 'smile', { h: 0.9, bottom: '#6b4a2e' }), on(34, 0.9, furHatL(), path('M-14 -42 L14 -42 L14 -36 L-14 -36 Z', GOLD, null)), reach(34, 0.9, -1, 14, 70), bow(12, 70, 1), ground),

  // ── 2436 Osmanska riket ──
  'mell.storvesir': all(room('#efe8da'), rect(4, 92, 112, 20, '#c8372d', 0, C.ink, 1), greyed(seated(102, 0.6, '#888', '#888', { throne: true, flip: true, hat: turbanL(C.white, 1.2) })), fig(50, '#2f7a5a', 'calm', { h: 1.0, bottom: '#2f7a5a', w: 1.15 }), on(50, 1.0, robeL('#2f7a5a'), path('M-15 -42 L-6 -42 L-6 46 L-17 46 Z', GOLD, null), path('M15 -42 L6 -42 L6 46 L17 46 Z', GOLD, null), turbanL(C.white, 1.5), beardL('#9a9aa0')),
    reach(50, 1.0, -1, 24, 64), palm(24, 60, 0.9), ...[[14, 100], [28, 102]].map(([x, y]) => bust(x!, y!, '#a0673d', bTurban, 1))),
  'mell.janitsjar': all(skyBg(), fig(56, '#3f6fb5', 'calm', { h: 0.95, bottom: '#c8372d' }), on(56, 0.95, path('M-14 -42 L14 -42 L16 10 L-16 10 Z', '#3f6fb5', C.ink, 1.2), rect(-14, -8, 28, 5, '#e0b23c', 1, C.ink, 1), borkL()), reach(56, 0.95, 1, 82, 66),
    g('translate(84 66) rotate(-20)', line('M0 -30 L0 10', C.dark, 2.2), path('M-2 10 L2 10 L4 20 L-3 20 Z', WOOD2, C.ink, 0.9)), ground),
  'mell.basar': all(room('#f2e4c8'), ...[0, 1, 2].map((i) => path(`M${4 + i * 38} 40 C${4 + i * 38} 18 ${42 + i * 38} 18 ${42 + i * 38} 40`, 'none', BRICK2, 4)), rect(4, 40, 112, 4, BRICK2, 0, null),
    ...[[16, '#c8372d'], [24, '#e0b23c'], [32, '#ef8a3c'], [86, '#7a8a3a'], [94, '#c8372d'], [102, '#e0b23c']].map(([x, col]) => path(`M${+x! - 5} 94 C${+x! - 5} 84 ${+x! + 5} 84 ${+x! + 5} 94 Z`, col as string, C.ink, 1)), rect(8, 94, 32, 6, WOOD2, 1, C.ink, 1), rect(80, 94, 32, 6, WOOD2, 1, C.ink, 1),
    rect(48, 50, 22, 40, '#c8372d', 1, C.ink, 1.2), rect(52, 54, 14, 32, '#e0b23c', 1, null), ...[[24, 54], [60, 46], [96, 54]].map(([x, y]) => all(line(`M${x} 44 L${x} ${y! - 6}`, C.ink, 1), path(`M${x! - 4} ${y! - 6} L${x! + 4} ${y! - 6} L${x! + 2} ${y} L${x! - 2} ${y} Z`, '#e0b23c', C.ink, 0.9))),
    bust(34, 104, '#3f6fb5', '', 1), bust(84, 104, '#c8372d', bScarf, 1), ground),
  'mell.upplösning': all(skyBg('#eef0f2'), greyed(path('M8 22 L42 14 L50 30 L40 52 L14 50 Z', '#bbb', C.ink, 1.2)),
    ...[[0, 'M58 34 L80 28 L84 46 L66 56 Z', '#e8c88c'], [1, 'M84 22 L110 30 L104 52 L88 46 Z', '#c8dca8'], [2, 'M64 62 L86 56 L90 80 L70 86 Z', '#c8d8e8'], [3, 'M92 60 L112 66 L108 92 L94 84 Z', '#e8c0c0']].map(([, d, col]) => path(d as string, col as string, C.ink, 1.4)),
    arrow(46, 36, 56, 40, HL, 2.6), ...[[74, 42, -10, -8], [98, 40, 8, -8], [78, 72, -8, 10], [102, 76, 8, 8]].map(([x, y, dx, dy]) => arrow(x!, y!, x! + dx!, y! + dy!, C.grey, 1.6)), crown(30, 92)),

  // ── 2437 Mellanöstern under 1900-talet ──
  'mell.mandat.2': all(skyBg('#eef0f2'), ellipse(40, 34, 30, 10, '#b98a52', C.ink, 1.4), ...[[16, 26, '#c8372d'], [28, 20, '#3f6fb5'], [44, 18, '#4f9d69'], [58, 22, '#e0b23c'], [66, 32, '#7b3fa0'], [14, 40, '#2f6a7a']].map(([x, y, col]) => bust(+x!, +y!, col as string, '', 0.9)),
    doc(40, 34, 0.5), arrow(40, 46, 40, 58, HL, 3), bust(24, 86, '#3f6fb5', '', 1.9), doc(46, 82, 0.7), seal(50, 89, 0.7), arrow(58, 90, 70, 94, HL, 2.6), rect(72, 82, 40, 26, '#f3d9a0', 3, C.ink, 1.4), mudHouse(84, 104, 0.7), mudHouse(100, 104, 0.6), hourglass(96, 62, 1.3), ground),
  'mell.sionism': all(skyBg(), cloudThought(60, 26), path('M50 18 C56 12 66 14 70 20 C72 28 66 36 58 36 C52 34 48 26 50 18 Z', LAND, C.ink, 1.2), starD(60, 26, 5),
    path('M46 74 C54 66 70 66 76 74 C80 84 72 94 60 94 C50 92 42 84 46 74 Z', LAND, C.ink, 1.4), starD(61, 81, 6),
    ...[[14, 66], [24, 74], [14, 82]].map(([x, y]) => bust(x!, y!, '#5a6a80', '', 0.8)), ...[[104, 64], [96, 74], [106, 84]].map(([x, y]) => bust(x!, y!, '#8a6a48', '', 0.8)), ...[[48, 104], [60, 106], [72, 104]].map(([x, y]) => bust(x!, y!, '#6b7a5a', '', 0.7)),
    arrow(30, 76, 42, 78, HL, 2.4), arrow(90, 76, 78, 78, HL, 2.4), arrow(60, 100, 60, 95, HL, 2.4)),
  'mell.flyktingläger': all(desert(60), ...range(3).flatMap((r) => range(4).map((c) => tent(22 + c * 26 + (r % 2) * 10, 72 + r * 16, 0.95))), rect(98, 30, 14, 18, '#3f6fb5', 2, C.ink, 1.2), line('M100 48 L100 60 M110 48 L110 60', C.ink, 1.4),
    fig(14, '#c8372d', 'frown', { h: 0.42, hairStyle: 'long' }), fig(24, '#3f6fb5', 'frown', { h: 0.36 }), ground),
  'mell.oljekris': all(skyBg(), derrick(22, 108, 1.1), barrel(54, 108, 1.2), at(84, 66, 1, line('M-20 30 L-20 -26 M-20 30 L24 30', C.ink, 1.4), line('M-18 22 L-6 20 L2 18 L8 -14 L20 -18', RED, 2.6)), num(76, 46, '×4', 10, RED), coin(104, 22, 5), arrow(104, 34, 104, 14, RED, 2.4), car(92, 108, 0.7, '#888'), noSign(92, 100, 11), ground),
  'mell.ayatolla': all(room('#efe8da'), fig(60, '#26262c', 'calm', { h: 0.98, bottom: '#26262c', w: 1.1 }), on(60, 0.98, robeL('#3d3f4a'), path('M-14 -42 L-5 -42 L-5 46 L-17 46 Z', '#26262c', null), path('M14 -42 L5 -42 L5 46 L17 46 Z', '#26262c', null), blackTurbanL(), beardL('#e8e8e8')),
    reach(60, 0.98, 1, 84, 52), palm(84, 48, 1), ...[[14, 100], [28, 104], [96, 104], [110, 100]].map(([x, y]) => bust(x!, y!, '#6b7a5a', '', 1))),
  'mell.arabiska-våren': all(skyBg('#fdf1dc'), sunC(96, 22, 9), ...range(4).map((i) => line(`M${80 + i * 10} 40 l-4 6`, GOLD, 1.6)), flower(18, 26, 1.4), flower(30, 34, 1.1, '#f2c14e'),
    ...[[22, 0.62, '#c8372d'], [44, 0.68, '#3f6fb5'], [66, 0.66, '#4f9d69'], [88, 0.62, C.orange]].map(([x, h, col]) => all(fig(+x!, col as string, 'laugh', { h: +h!, bottom: '#3d3f4a' }), reach(+x!, +h!, 1, +x! + 10, 60 - (+h! - 0.6) * 40), palm(+x! + 10, 56 - (+h! - 0.6) * 40, 0.8))),
    at(54, 46, 1, line('M0 0 L0 -24', WOOD2, 1.6), rect(0, -24, 16, 4, RED, 0, C.ink, 0.6), rect(0, -20, 16, 4, C.white, 0, C.ink, 0.6), rect(0, -16, 16, 4, C.black, 0, C.ink, 0.6)), ground),
  'mell.fredsprocess': all(skyBg('#eef3e6'), line(WAY, '#e3d6bc', 9), line(WAY, '#c9b890', 1, '3 3'),
    talks(44, 100), talks(40, 72), talks(70, 50), dove(92, 16, 1.2)),
};

function crown(x: number, y: number): Svg { return greyed(at(x, y, 1, path('M-14 6 L-15 -10 L-7 -2 L0 -14 L7 -2 L15 -10 L14 6 Z', GOLD, C.ink, 1.4), crack('M0 -14 L-2 0 L2 6'))); }
function blob(x: number, y: number, k: number, col: string): Svg { const pts = [[-40, -6], [-30, -34], [-6, -44], [22, -36], [40, -14], [38, 18], [16, 38], [-14, 40], [-38, 22]]; return path(`M${pts.map(([a, b]) => `${f1(x + a! * k)} ${f1(y + b! * k)}`).join(' L')} Z`, col, C.ink, 1.3); }
function seal(x: number, y: number, s = 1): Svg { return at(x, y, s, circle(0, 0, 4.4, RED, C.ink, 1), circle(0, 0, 2, '#a02a22', null)); }
function cloudThought(x: number, y: number): Svg { return all(ellipse(x, y, 28, 16, C.white, C.ink, 1.4), circle(x - 6, y + 22, 3, C.white, C.ink, 1.1), circle(x - 10, y + 29, 2, C.white, C.ink, 1)); }
function talks(x: number, y: number): Svg { return all(ellipse(x, y, 9, 3, '#b98a52', C.ink, 1.1), bust(x - 12, y - 4, '#3f6fb5', '', 0.7), bust(x + 12, y - 4, '#4f9d69', '', 0.7), bubble(x - 12, y - 18, 12, 7, all(circle(x - 14.5, y - 18, 0.9, C.grey, null), circle(x - 9.5, y - 18, 0.9, C.grey, null)), false), bubble(x + 12, y - 18, 12, 7, all(circle(x + 9.5, y - 18, 0.9, C.grey, null), circle(x + 14.5, y - 18, 0.9, C.grey, null)))); }
function dove(x: number, y: number, s = 1): Svg { return at(x, y, s, path('M-10 2 C-6 -4 4 -4 8 0 L12 -2 L10 2 C6 6 -4 6 -10 2 Z', C.white, C.ink, 1.1), path('M-2 0 C-6 -10 2 -12 4 -2 Z', C.white, C.ink, 1), circle(7, -0.5, 0.7, C.ink, null), path('M12 0 C15 2 16 4 18 4', 'none', '#4f9d69', 1.4), ellipse(16, 2, 1.6, 0.9, '#7fbf6a', null)); }
