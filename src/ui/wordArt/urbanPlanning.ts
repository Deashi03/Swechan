/**
 * Samhälle & institutioner → Städer & offentlig service → Bostads- & stadsplanering, 1731–1737 (0.34):
 * detailed plans and building permits, streets and blocks, green areas, traffic planning, new
 * construction, renovation of districts and sustainable urban development. Recurring signs: the kommun
 * is a green badge with a little house, a permit is a white paper with that badge and a green tick (a red
 * cross when refused), plans and maps are seen from above with grey streets and beige blocks, building
 * work is orange and yellow (helmets, cranes, scaffolding), heat is red and lost heat is grey. Abstract
 * words are small symbolic scenes with a grey reference. Digits only; no words in the pictures and no
 * pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, star, type Svg } from './kit';
import { type Build } from './figures';
import { arm } from './people';
import { P as F, type Mood, greyed, coin, drop } from './blindFix';
import { win, tree, car, door, fence } from './homeKit';
import { clock } from './time';
import { checkIcon } from './labelIcons';

// ── Geometry and figures ─────────────────────────────────────────────
const RED = '#e8302c';
const BRICK = '#c4553a';
const OCHRE = '#e3b04b';
const WATER = '#9fd6ef';
const WOOD = '#d9a066';
const ROAD = '#8f959c';
const BLOCKC = '#eadcc0';
const GRASS = '#a9d78d';
const HI = '#f28c28';
const f1 = (n: number) => n.toFixed(1);
const ground = line('M4 112 L116 112', C.grey2, 2);
const lawn = (y = 100) => rect(4, y, 112, 112 - y, GRASS, 0, null);
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, hy: ty - 56 * s, hr: 10 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const hnd = (x: number, y: number, r = 3) => circle(x, y, r, C.skin, C.ink, 1.2);
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), hnd(tx, ty, 3 * Math.max(0.7, h))); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; torso −42…2; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
const helmet = (col: string = C.yellow) => all(path('M-12 -60 C-12 -74 12 -74 12 -60 L15 -59 L-15 -59 Z', col, C.ink, 1.6), line('M0 -72 L0 -61', C.ink, 0.8));
const vest = all(path('M-13 -40 L13 -40 L12 0 L-12 0 Z', HI, C.ink, 1.4), line('M-12 -18 L12 -18 M-12 -9 L12 -9', C.reflex, 2.6));
/** Builder: figure with a helmet and a high-visibility vest. */
const builder = (x: number, h = 0.8, mood: Mood = 'smile') => all(fig(x, HI, mood, { h, bottom: '#3b4a6b' }), on(x, h, vest, helmet()));
/** Small head-and-shoulders person (in rows, behind counters, in windows). */
const mini = (x: number, y: number, col: string, mood: 'smile' | 'frown' | 'flat' = 'smile', s = 1, long = false, grey = false) => {
  const sk = grey ? C.grey2 : C.skin, hr = grey ? C.grey : C.hair, c = grey ? C.grey : col;
  return g(`translate(${x} ${y}) scale(${s})`, long ? path('M-8 -6 C-9 6 9 6 8 -6 Z', hr, null) : '', path('M-10 16 C-10 4 10 4 10 16 Z', c, C.ink, 1.4), circle(0, -6, 7.5, sk, C.ink, 1.4), path('M-7.5 -8 C-7.5 -16 7.5 -16 7.5 -8 C4 -11 -4 -11 -7.5 -8 Z', hr, null),
    circle(-2.6, -6, 1, C.ink, null), circle(2.6, -6, 1, C.ink, null),
    mood === 'smile' ? path('M-2.6 -2.6 Q0 -0.6 2.6 -2.6', 'none', C.ink, 1.1) : mood === 'flat' ? line('M-2.4 -2 L2.4 -2', C.ink, 1.1) : path('M-2.6 -1.4 Q0 -3.4 2.6 -1.4', 'none', C.ink, 1.1));
};
/** Speech bubble centred on (cx, cy) whose tail points to (tx, ty). */
const say = (cx: number, cy: number, w: number, h: number, tx: number, ty: number, inner: Svg = '', fill: string = C.white) => {
  const L = cx - w / 2, R = cx + w / 2, Tp = cy - h / 2, B = cy + h / 2;
  let a: number[], b: number[];
  if (tx < L || tx > R) { const e = tx < L ? L : R, by = Math.max(Tp + 6, Math.min(B - 6, ty)); a = [e, by - 4.5]; b = [e, by + 4.5]; }
  else { const e = ty > cy ? B : Tp, bx = Math.max(L + 7, Math.min(R - 7, tx)); a = [bx - 5, e]; b = [bx + 5, e]; }
  return all(path(`M${a[0]} ${a[1]} L${tx} ${ty} L${b[0]} ${b[1]} Z`, fill, C.ink, 1.5), rect(L, Tp, w, h, fill, 6, C.ink, 1.5), path(`M${a[0]} ${a[1]} L${tx} ${ty} L${b[0]} ${b[1]} Z`, fill, null), inner);
};

// ── Signs and small things ────────────────────────────────────────────
/** A kommun: green badge with a little house. */
const kommun = (x: number, y: number, r = 9) => all(circle(x, y, r, C.green, C.ink, 1.4), path(`M${x - r * 0.5} ${y + r * 0.1} L${x} ${y - r * 0.45} L${x + r * 0.5} ${y + r * 0.1} Z`, C.white, null), rect(x - r * 0.38, y + r * 0.1, r * 0.76, r * 0.42, C.white, 0, null));
const check = (x: number, y: number, s = 1, col: string = C.green) => checkIcon(x, y, s, col);
const cross = (x: number, y: number, r = 6, col: string = RED) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 3);
const okBadge = (x: number, y: number, r = 7) => all(circle(x, y, r, C.white, C.green, 2), check(x, y + 0.5, r / 7));
const noBadge = (x: number, y: number, r = 7) => all(circle(x, y, r, C.white, RED, 2), cross(x, y, r * 0.5));
/** A paper with the kommun badge and text lines; `mark` drawn in the lower part. */
const permit = (x: number, y: number, s = 1, mark: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, path('M-14 -18 L8 -18 L14 -12 L14 18 L-14 18 Z', C.white, C.ink, 1.5), path('M8 -18 L8 -12 L14 -12', 'none', C.ink, 1), kommun(-7, -10, 4.5), line('M0 -12 L9 -12 M-10 -2 L10 -2 M-10 3 L6 3', C.grey, 1.2), mark);
const sunS = (x: number, y: number, r = 6) => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 5))} ${f1(y + Math.sin(a) * (r + 5))}`, C.gold, 1.6); }), circle(x, y, r, C.yellow, C.ink, 1.2));
const moon = (x: number, y: number, r = 6) => path(`M${x + r * 0.3} ${y - r} A${r} ${r} 0 1 0 ${x + r * 0.3} ${y + r} A${r * 0.75} ${r * 0.75} 0 1 1 ${x + r * 0.3} ${y - r} Z`, '#f6e08a', C.ink, 1.2);
const cloud = (x: number, y: number, s = 1, fill: string = C.white) => g(`translate(${x} ${y}) scale(${s})`, path('M-16 6 C-23 6 -23 -5 -15 -5 C-14 -14 -3 -16 1 -9 C5 -15 17 -13 16 -4 C23 -4 23 6 16 6 Z', fill, C.ink, 1.4));
const rain = (x1: number, x2: number, y1: number, y2: number, step = 7) => line(Array.from({ length: Math.floor((x2 - x1) / step) + 1 }, (_, i) => { const x = x1 + i * step, o = (i % 2) * 6; return `M${x} ${y1 + o} l-3 7 M${x - 4} ${y1 + o + 14} l-3 7 M${x - 8} ${y1 + o + 28} l-3 7`; }).join(' ') + (y2 > y1 + 44 ? Array.from({ length: Math.floor((x2 - x1) / step) + 1 }, (_, i) => ` M${x1 + i * step - 12} ${y1 + 44 + (i % 2) * 6} l-3 7`).join('') : ''), '#4f8fc9', 1.6);
const conifer = (x: number, y: number, s = 1, col: string = '#3f7f53') => g(`translate(${x} ${y}) scale(${s})`, rect(-2, -6, 4, 6, C.brown, 0.5, C.ink, 1), path('M0 -40 L-12 -6 L12 -6 Z', col, C.ink, 1.4), path('M0 -40 L-9 -18 L9 -18 Z', col, C.ink, 1.2));
const bush = (x: number, y: number, s = 1, col: string = C.green) => g(`translate(${x} ${y}) scale(${s})`, path('M-12 0 C-16 -8 -8 -14 -4 -10 C-2 -16 8 -16 8 -9 C14 -11 16 -2 12 0 Z', col, C.ink, 1.2));
const flower = (x: number, y: number, col: string = C.pink, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L0 -10', C.green, 1.4), ...[0, 72, 144, 216, 288].map((a) => circle(+f1(Math.cos((a * Math.PI) / 180) * 3), +f1(-12 + Math.sin((a * Math.PI) / 180) * 3), 2.4, col, C.ink, 0.6)), circle(0, -12, 1.8, C.yellow, null));
const bee = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ellipse(-2, -5, 4, 3, 'rgba(230,245,255,0.9)', C.ink, 0.7), ellipse(3, -5, 4, 3, 'rgba(230,245,255,0.9)', C.ink, 0.7), ellipse(0, 0, 6, 4, C.yellow, C.ink, 1), line('M-2 -3.6 L-2 3.6 M1.5 -3.8 L1.5 3.8', C.ink, 1.4), circle(6, -0.5, 2.4, C.ink, null));
const butterfly = (x: number, y: number, col: string = C.purple, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 0 C-6 -10 -12 -6 -9 0 C-12 6 -5 8 0 2 Z', col, C.ink, 0.9), path('M0 0 C6 -10 12 -6 9 0 C12 6 5 8 0 2 Z', col, C.ink, 0.9), line('M0 -3 L0 4', C.ink, 1.6));
const bird = (x: number, y: number, s = 1, col: string = '#6a8fb8') => g(`translate(${x} ${y}) scale(${s})`, ellipse(0, 0, 7, 5, col, C.ink, 1.2), circle(6, -4, 3.6, col, C.ink, 1.2), path('M9 -4.5 L13 -3.5 L9 -2.5 Z', C.orange, C.ink, 0.6), circle(7, -5, 0.8, C.ink, null), path('M-6 -1 L-12 -4 L-11 2 Z', col, C.ink, 1), path('M-3 -2 C0 -8 4 -6 3 -1', 'none', C.ink, 0.9));
const birdFly = (x: number, y: number, s = 1) => line(`M${x - 6 * s} ${y} q${3 * s} ${-4 * s} ${6 * s} 0 q${3 * s} ${-4 * s} ${6 * s} 0`, C.ink, 1.3);
/** Generic building (top-left x, y) with a grid of windows. */
const bld = (x: number, y: number, w: number, h: number, col: string, cols: number, rows: number, lit = false, roof: string | null = null) => all(rect(x, y, w, h, col, 1, C.ink, 1.6), roof ? rect(x - 1.5, y - 3, w + 3, 4, roof, 1, C.ink, 1.2) : '', ...Array.from({ length: cols * rows }, (_, i) => win(x + (w / cols) * ((i % cols) + 0.5), y + 8 + Math.floor(i / cols) * 13, 6, 7, lit)));
const smallHouse = (x: number, y: number, s = 1, wall: string = C.yellow, roof: string = BRICK) => g(`translate(${x} ${y}) scale(${s})`, path('M-16 -18 L0 -32 L16 -18 Z', roof, C.ink, 1.6), rect(-14, -18, 28, 18, wall, 0.5, C.ink, 1.6), rect(-4, -12, 8, 12, C.brown, 0.5, C.ink, 1.1), win(-9, -10, 5, 5), win(9, -10, 5, 5));
/** Falu-red shed with white corners. */
const shed = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-16 -20 L0 -32 L16 -20 Z', C.dark, C.ink, 1.4), rect(-14, -20, 28, 20, '#a93226', 0.5, C.ink, 1.4), rect(-14, -20, 2.5, 20, C.white, 0, null), rect(11.5, -20, 2.5, 20, C.white, 0, null), rect(-5, -15, 10, 15, '#8e2a20', 0.5, C.ink, 1), circle(3, -8, 0.9, C.gold, null));
const bike = (x: number, y: number, s = 1, col: string = C.denim) => g(`translate(${x} ${y}) scale(${s})`, circle(-10, 0, 7, 'none', C.ink, 1.6), circle(10, 0, 7, 'none', C.ink, 1.6), line('M-10 0 L-3 -10 L7 -10 L10 0 M-3 -10 L1 0 L7 -10 M-4 -13 L-1 -13 M7 -10 L6 -15 L9 -15', col, 2));
const bus = (x: number, y: number, s = 1, col: string = '#c84a3a') => g(`translate(${x} ${y}) scale(${s})`, rect(-30, -24, 60, 22, col, 4, C.ink, 1.6), ...[-26, -16, -6, 4, 14].map((d) => rect(d, -20, 8, 8, '#d8eef8', 1, C.ink, 0.8)), rect(23, -20, 6, 16, '#bfe3f5', 1, C.ink, 0.9), circle(-18, -1, 4.4, C.dark, C.ink, 1), circle(18, -1, 4.4, C.dark, C.ink, 1));
const truckS = (x: number, y: number, s = 1, col: string = C.white) => g(`translate(${x} ${y}) scale(${s})`, rect(-30, -26, 40, 24, col, 1.5, C.ink, 1.6), path('M10 -18 L22 -18 L28 -9 L28 -2 L10 -2 Z', '#4f7fb8', C.ink, 1.6), path('M13 -16 L21 -16 L25 -10 L13 -10 Z', '#d8eef8', C.ink, 0.9), circle(-20, -1, 4.4, C.dark, C.ink, 1), circle(-8, -1, 4.4, C.dark, C.ink, 1), circle(20, -1, 4.4, C.dark, C.ink, 1));
const carS = (x: number, y: number, s = 1, col: string = C.red) => car(x, y, s, col);
const coinStack = (x: number, y: number, n: number) => all(...Array.from({ length: n }, (_, i) => all(ellipse(x, y - i * 4, 7, 2.6, C.gold, C.ink, 1), ellipse(x, y - i * 4 - 1, 5, 1.4, 'none', '#b88a20', 0.6))));
const keyS = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 3.4, 'none', C.gold, 2.2), line('M3.4 0 L12 0 M9 0 L9 3 M11.5 0 L11.5 2.5', C.gold, 2));
const boxS = (x: number, y: number, w = 16, h = 12) => all(rect(x - w / 2, y - h, w, h, C.tan, 1, C.ink, 1.3), line(`M${x - w / 2} ${y - h + 3} L${x + w / 2} ${y - h + 3}`, C.brown, 1), rect(x - 2, y - h, 4, 3, '#c9a26b', 0, null));
const lampPost = (x: number, y: number, h = 44, lit = true) => all(line(`M${x} ${y} L${x} ${y - h} Q${x} ${y - h - 6} ${x + 7} ${y - h - 6}`, C.dark, 2.4), path(`M${x + 3} ${y - h - 6} L${x + 13} ${y - h - 6} L${x + 11} ${y - h - 2} L${x + 5} ${y - h - 2} Z`, C.dark, C.ink, 1), lit ? path(`M${x + 5} ${y - h - 2} L${x + 11} ${y - h - 2} L${x + 22} ${y} L${x - 6} ${y} Z`, 'rgba(255,236,150,0.35)', null) : '', lit ? ellipse(x + 8, y - h - 1.5, 3, 1.4, '#fff3b0', null) : '');
const crane = (x: number, top: number, jibL = 26, jibR = 46, load: Svg = '') => all(
  path(`M${x - 4} 112 L${x - 4} ${top} L${x + 4} ${top} L${x + 4} 112`, 'none', C.yellow, 2.6), line(Array.from({ length: Math.floor((112 - top) / 8) }, (_, i) => `M${x - 4} ${top + i * 8} L${x + 4} ${top + i * 8 + 8}`).join(' '), C.gold, 1.2),
  line(`M${x - jibL} ${top} L${x + jibR} ${top}`, C.yellow, 3), line(`M${x - jibL} ${top} L${x + jibR} ${top}`, C.ink, 0.6), line(`M${x} ${top - 10} L${x - jibL} ${top} M${x} ${top - 10} L${x + jibR} ${top}`, C.ink, 0.9), line(`M${x} ${top} L${x} ${top - 10}`, C.yellow, 2.4),
  rect(x - jibL - 2, top - 2, 8, 7, C.grey, 1, C.ink, 1), rect(x + 4, top + 1, 7, 6, '#d8eef8', 1, C.ink, 1), load);
const scaffold = (x1: number, x2: number, y1: number, y2: number) => all(...Array.from({ length: Math.round((x2 - x1) / 14) + 1 }, (_, i) => line(`M${x1 + i * 14} ${y1} L${x1 + i * 14} ${y2}`, C.silver, 2)), ...Array.from({ length: Math.floor((y2 - y1) / 18) + 1 }, (_, i) => all(rect(x1 - 2, y1 + i * 18 - 2, x2 - x1 + 4, 3, WOOD, 0.5, C.ink, 0.8))), line(Array.from({ length: Math.round((x2 - x1) / 14) }, (_, i) => `M${x1 + i * 14} ${y2} L${x1 + i * 14 + 14} ${y1}`).join(' '), C.silver, 1));
const shovel = (x: number, y: number, s = 1, col: string = C.silver, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, line('M0 -30 L0 -6', C.brown, 2.4), line('M-4 -30 L4 -30', C.brown, 2.4), path('M-5 -7 L5 -7 L5 2 C5 6 -5 6 -5 2 Z', col, C.ink, 1.2));
/** Plan view background (blocks) with grey streets given as rectangles. */
const planBg = () => rect(4, 8, 112, 104, BLOCKC, 0, null);
const street = (x: number, y: number, w: number, h: number) => rect(x, y, w, h, ROAD, 0, null);
const roofTop = (x: number, y: number, w: number, h: number, col: string = '#c98b6b') => rect(x, y, w, h, col, 1, C.ink, 1);
/** Thermometer-like heat arrow (red wavy). */
const heatUp = (x: number, y: number, col: string = RED, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 0 C-4 -4 4 -8 0 -12 C-4 -16 4 -20 0 -24', 'none', col, 2.2), path('M-3.5 -21 L0 -26 L3.5 -21', 'none', col, 2.2));
const smoke = (x: number, y: number, col: string = C.grey) => all(circle(x, y, 4, col, null), circle(x + 5, y - 6, 5, col, null), circle(x + 12, y - 11, 6, col, null));
const pipe = (d: string, col: string = RED) => all(line(d, C.ink, 5), line(d, col, 3));
const plus = (x: number, y: number, r = 4, col: string = C.green) => line(`M${x - r} ${y} L${x + r} ${y} M${x} ${y - r} L${x} ${y + r}`, col, 2.6);
const upArrow = (x: number, y1: number, y2: number, col: string = C.green) => arrow(x, y1, x, y2, col, 3);
const ribbonTape = (x1: number, x2: number, y: number) => line(`M${x1} ${y} L${x2} ${y}`, RED, 3, '6 4');
const reeds = (x: number, y: number) => all(line(`M${x} ${y} L${x - 2} ${y - 18} M${x + 3} ${y} L${x + 4} ${y - 22} M${x + 6} ${y} L${x + 9} ${y - 16}`, '#6a8f3a', 1.6), ellipse(x + 4, y - 24, 1.6, 4, C.brown, C.ink, 0.6), ellipse(x - 2, y - 20, 1.4, 3.4, C.brown, C.ink, 0.6));
const water = (x1: number, x2: number, y: number, yb: number) => all(rect(x1, y, x2 - x1, yb - y, WATER, 0, null), line(Array.from({ length: Math.floor((x2 - x1) / 12) }, (_, i) => `M${x1 + 2 + i * 12} ${y + 5} q3 -2.5 6 0`).join(' '), '#5aa7d6', 1.2));
const panel = (x: number, y: number, w = 14, h = 9) => all(rect(x, y, w, h, '#2f4f86', 0.5, C.ink, 1), line(`M${x + w / 3} ${y} L${x + w / 3} ${y + h} M${x + (2 * w) / 3} ${y} L${x + (2 * w) / 3} ${y + h} M${x} ${y + h / 2} L${x + w} ${y + h / 2}`, '#9fc3ee', 0.7));
const radiator = (x: number, y: number, warm = true) => all(rect(x, y, 22, 12, C.white, 1.5, C.ink, 1.2), line(`M${x + 4} ${y + 2} L${x + 4} ${y + 10} M${x + 9} ${y + 2} L${x + 9} ${y + 10} M${x + 14} ${y + 2} L${x + 14} ${y + 10} M${x + 18} ${y + 2} L${x + 18} ${y + 10}`, C.grey, 1), warm ? all(heatUp(x + 6, y - 2, RED, 0.5), heatUp(x + 16, y - 2, RED, 0.5)) : '');
const camera = (x: number, y: number) => all(rect(x - 6, y - 4, 12, 8, C.dark, 1.5, C.ink, 1), circle(x - 6, y, 2.4, C.grey2, C.ink, 0.8));
const sign30 = (x: number, y: number, r = 7, n = '30') => all(line(`M${x} ${y + r} L${x} 112`, C.grey, 2), circle(x, y, r, C.white, RED, 2.6), `<text x="${x}" y="${y + r * 0.38}" font-family="system-ui,sans-serif" font-weight="800" font-size="${f1(r * 0.95)}" text-anchor="middle" fill="${C.ink}">${n}</text>`);
const num = (x: number, y: number, t: string, size = 9, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${t}</text>`;
const sq = (x: number, y: number, s = 5) => all(rect(x, y - s, s, s, 'none', 0, C.ink, 1), line(`M${x} ${y + 2} L${x + s} ${y + 2}`, C.ink, 0.6));
const zebra = (x1: number, x2: number, y1: number, y2: number) => all(...Array.from({ length: Math.floor((x2 - x1) / 8) }, (_, i) => rect(x1 + i * 8, y1, 5, y2 - y1, C.white, 0, null)));
const worn = (x: number, y: number) => line(`M${x} ${y} l3 4 l-2 4 l3 5`, C.ink, 0.9);
const sparkle = (x: number, y: number, r = 4) => line(`M${x - r} ${y} L${x + r} ${y} M${x} ${y - r} L${x} ${y + r} M${x - r * 0.6} ${y - r * 0.6} L${x + r * 0.6} ${y + r * 0.6} M${x + r * 0.6} ${y - r * 0.6} L${x - r * 0.6} ${y + r * 0.6}`, C.gold, 1.3);
const gauge = (x: number, y: number, lvl: number, col: string) => all(rect(x - 4, y - 30, 8, 30, C.white, 2, C.ink, 1.2), rect(x - 2.5, y - 1.5 - lvl, 5, lvl, col, 1, null));
const coSmoke = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -12 15 -4 C21 -4 21 6 14 6 Z', '#7d8288', C.ink, 1.2), circle(-5, 0, 2.6, 'none', C.white, 1.2), circle(3, 0, 2.6, 'none', C.white, 1.2), circle(9, 1.8, 1.6, 'none', C.white, 1));
const earth = (x: number, y: number, r = 9) => all(circle(x, y, r, '#7fc4ec', C.ink, 1.4), path(`M${x - r * 0.6} ${y - r * 0.4} C${x - r * 0.2} ${y - r * 0.8} ${x + r * 0.2} ${y - r * 0.1} ${x - r * 0.1} ${y + r * 0.3} C${x - r * 0.4} ${y + r * 0.5} ${x - r * 0.8} ${y + r * 0.1} ${x - r * 0.6} ${y - r * 0.4} Z M${x + r * 0.3} ${y + r * 0.2} C${x + r * 0.7} ${y} ${x + r * 0.8} ${y + r * 0.5} ${x + r * 0.4} ${y + r * 0.7} Z`, C.green, null));
const shopFront = (x: number, y: number, w: number, awn: string) => all(rect(x, y, w, 18, '#fbf3e4', 0.5, C.ink, 1.2), path(`M${x - 1} ${y} L${x + w + 1} ${y} L${x + w - 1} ${y + 6} L${x + 1} ${y + 6} Z`, awn, C.ink, 1), ...Array.from({ length: Math.floor(w / 6) }, (_, i) => line(`M${x + 3 + i * 6} ${y + 0.5} L${x + 3 + i * 6} ${y + 5.5}`, C.white, 1.6)), rect(x + 3, y + 8, w * 0.45, 10, '#bfe3f5', 0.5, C.ink, 0.8), rect(x + w * 0.62, y + 7, w * 0.26, 11, C.brown, 0.5, C.ink, 0.8));

export const URBAN_PLANNING_MOTIFS: Record<string, Svg> = {
  // ── 1731 Detaljplan och bygglov ────────────────────────────────────
  'splan.stadsbyggnadskontor': all(rect(4, 8, 112, 104, '#eef0f2', 0, null), rect(10, 14, 50, 40, C.white, 2, C.ink, 1.4), rect(13, 17, 44, 34, BLOCKC, 0, null),
    street(13, 30, 44, 4), street(30, 17, 4, 34), ...[[15, 19], [36, 19], [15, 36], [36, 36]].map(([x, y]) => roofTop(x!, y!, 13 + (x === 36 ? 6 : 0), 9)), rect(16, 42, 10, 7, GRASS, 1, C.ink, 0.8),
    kommun(98, 24, 9), counter(4, 116, 80),
    mini(84, 66, C.navy, 'smile', 1.15, true), all(rect(66, 74, 30, 5, C.white, 1, C.ink, 1), line('M70 76.5 L92 76.5', '#5a8fd0', 0.8)),
    fig(30, C.orange, 'smile', { h: 0.9 }), reach(30, 0.9, 1, 52, 74), g('rotate(-18 52 70)', rect(42, 67, 22, 6, '#dbe9f6', 3, C.ink, 1.2), ellipse(42, 70, 2, 3, '#c6dcf0', C.ink, 1))),
  'splan.byggnadshöjd': all(ground, line('M8 40 L112 40', RED, 1.6, '5 3'), bld(22, 40, 40, 72, BRICK, 3, 5), bld(70, 64, 30, 48, C.beige, 2, 3),
    line('M12 40 L12 112', C.ink, 1.4), line('M8 40 L16 40 M8 112 L16 112', C.ink, 1.6), arrow(12, 76, 12, 44, C.ink, 1.6), arrow(12, 76, 12, 108, C.ink, 1.6), ...[52, 64, 76, 88, 100].map((y) => line(`M10 ${y} L14 ${y}`, C.ink, 1)),
    rect(30, 98, 10, 14, C.brown, 0.5, C.ink, 1.2), greyed(bld(96, 30, 18, 82, '#bbb', 1, 6)), cross(105, 22, 5)),
  'splan.tillbyggnad': all(ground, lawn(104), path('M8 62 L36 38 L64 62 Z', '#9e9a92', C.ink, 1.6), rect(12, 62, 48, 50, '#e7dcc6', 0.5, C.ink, 1.6), win(24, 78, 10, 10), win(48, 78, 10, 10), door(36, 112, 11, 20),
    path('M60 72 L104 72 L104 66 L60 66 Z', '#5d8f6d', C.ink, 1.6), rect(60, 72, 44, 40, '#f4c46a', 0.5, C.ink, 2), line('M60 72 L60 112', C.ink, 2.4), win(74, 88, 11, 11), win(94, 88, 9, 11),
    plus(100, 34, 6), arrow(70, 40, 84, 56, C.green, 2.6), tree(112, 104, 0.5)),
  'splan.friggebod': all(ground, lawn(100), greyed(smallHouse(26, 100, 1.4, C.beige, '#999')), fence(82, 114, 100), shed(78, 104, 1.5),
    all(rect(88, 16, 26, 16, C.white, 3, C.ink, 1.2), num(99, 28, '15', 9), sq(105, 27, 5)), line('M100 32 L86 56', C.grey, 1, '2 2'), flower(60, 104, C.pink), flower(66, 104, C.yellow), sunS(16, 18, 5)),
  'splan.attefallshus': all(ground, lawn(100), greyed(smallHouse(24, 100, 1.4, C.beige, '#999')),
    path('M58 70 L82 52 L106 70 Z', C.dark, C.ink, 1.6), rect(60, 70, 44, 32, '#e9e2d0', 0.5, C.ink, 1.6), rect(94, 46, 5, 12, BRICK, 0.5, C.ink, 1), win(72, 82, 10, 10, true), rect(86, 78, 10, 24, C.brown, 0.5, C.ink, 1.2),
    line('M58 102 L106 102', C.ink, 1.6), mini(72, 84, C.green, 'smile', 0.5), all(rect(84, 14, 28, 16, C.white, 3, C.ink, 1.2), num(96, 26, '30', 9), sq(103, 25, 5)), line('M96 30 L86 48', C.grey, 1, '2 2'), permit(42, 30, 0.7, okBadge(0, 9, 5))),
  'splan.grannehörande': all(ground, permit(60, 30, 1.1, all(rect(-9, 4, 18, 11, '#dbe9f6', 1, C.ink, 0.8), smallHouse(0, 14, 0.3, '#f4c46a'))), arrow(46, 42, 28, 60, C.grey, 2), arrow(74, 42, 92, 60, C.grey, 2),
    smallHouse(20, 112, 1.1, C.sky), smallHouse(100, 112, 1.1, C.pink), mini(20, 90, C.orange, 'smile', 0.7), mini(100, 90, C.green, 'flat', 0.7, true),
    say(10, 66, 14, 12, 16, 82, check(10, 66.5, 0.9)), say(110, 66, 14, 12, 104, 82, all(circle(107, 66, 1.3, C.ink, null), circle(110, 66, 1.3, C.ink, null), circle(113, 66, 1.3, C.ink, null)))),
  'splan.strandskydd': all(rect(4, 8, 112, 104, '#cfe8b8', 0, null), path('M4 8 L34 8 C30 40 40 70 30 112 L4 112 Z', WATER, C.ink, 1.4), line('M10 30 q3 -2.5 6 0 M14 60 q3 -2.5 6 0 M10 90 q3 -2.5 6 0', '#5aa7d6', 1.2),
    path('M34 8 C30 40 40 70 30 112 L74 112 C84 70 74 40 78 8 Z', 'rgba(79,157,105,0.25)', null), line('M78 8 C74 40 84 70 74 112', C.green, 2.2, '5 3'),
    smallHouse(54, 74, 0.8, C.yellow), noBadge(54, 40, 8), smallHouse(98, 74, 0.8, C.yellow), okBadge(98, 40, 8), arrow(36, 96, 70, 96, C.green, 1.6), arrow(70, 96, 36, 96, C.green, 1.6), conifer(44, 112, 0.5), bird(22, 50, 0.6)),
  'splan.startbesked': all(ground, permit(30, 36, 1.4, okBadge(0, 11, 5.5)), arrow(54, 40, 70, 54, C.green, 2.6),
    path('M60 112 C70 96 100 96 112 112 Z', '#b5895a', C.ink, 1.4), builder(86, 0.74), shovel(100, 104, 1, C.silver, 20), reach(86, 0.74, 1, 97, 84), ribbonTape(56, 116, 90), line('M58 90 L58 112 M114 90 L114 112', C.ink, 1.4)),
  'splan.slutbesked': all(ground, lawn(104), permit(24, 34, 1.4, okBadge(0, 11, 5.5)), smallHouse(84, 104, 1.7, '#f4c46a', BRICK), keyS(48, 70, 1.2), arrow(46, 58, 60, 70, C.green, 2.2),
    fig(56, C.orange, 'laugh', { h: 0.6 }), boxS(66, 112, 12, 9), sparkle(110, 46), sparkle(64, 46, 3)),
  'splan.svartbygge': all(rect(4, 8, 112, 104, '#3b4766', 0, null), ground, rect(4, 104, 112, 8, '#55704a', 0, null), moon(100, 22, 7), star(80, 18, 1.6, C.yellow), star(20, 28, 1.6, C.yellow),
    path('M30 104 L30 70 L62 70 L62 104', 'none', WOOD, 3), line('M30 70 L46 58 L62 70 M30 86 L62 86 M46 70 L46 104', WOOD, 2.4), fig(80, '#2b2b30', 'shock', { h: 0.7, bottom: '#2b2b30' }), reach(80, 0.7, -1, 64, 82),
    permit(96, 64, 0.9, noBadge(0, 9, 6))),

  // ── 1732 Gator och kvarter ────────────────────────────────────────
  'splan.gatunät': all(planBg(), path('M4 40 C30 36 50 48 70 44 C88 40 100 30 116 32', 'none', ROAD, 7), path('M4 84 C26 90 60 78 116 86', 'none', ROAD, 7), path('M30 8 C34 40 24 70 34 112', 'none', ROAD, 6), path('M78 8 C70 30 84 60 74 112', 'none', ROAD, 6), path('M34 62 C50 60 60 66 78 62', 'none', ROAD, 4),
    ...[[10, 12, 14, 18], [44, 12, 24, 22], [90, 10, 20, 16], [10, 52, 14, 22], [44, 70, 20, 8], [92, 48, 18, 26], [44, 94, 22, 14], [90, 94, 18, 14], [8, 96, 16, 12]].map(([x, y, w, h]) => roofTop(x!, y!, w!, h!)),
    circle(30, 40, 3, C.white, C.ink, 1), circle(74, 44, 3, C.white, C.ink, 1), circle(32, 86, 3, C.white, C.ink, 1), circle(76, 84, 3, C.white, C.ink, 1), circle(34, 62, 2.4, C.white, C.ink, 1), circle(78, 62, 2.4, C.white, C.ink, 1)),
  'splan.rutnät': all(planBg(), ...[30, 60, 90].map((y) => street(4, y - 3, 112, 6)), ...[30, 60, 90].map((x) => street(x - 3, 8, 6, 104)),
    ...[8, 34, 64, 94].flatMap((x, i) => [12, 34, 64, 94].map((y, j) => roofTop(x + 2, y + 1, i === 0 || i === 3 ? 16 : 20, j === 0 ? 13 : 20, (i + j) % 3 === 0 ? '#c98b6b' : (i + j) % 3 === 1 ? '#d9a37f' : '#b97a5c'))),
    line('M4 30 L116 30 M4 60 L116 60 M4 90 L116 90 M30 8 L30 112 M60 8 L60 112 M90 8 L90 112', C.white, 0.8, '3 3')),
  'splan.huvudgata': all(rect(4, 8, 112, 104, '#dff0fb', 0, null), path('M4 112 L52 54 L68 54 L116 112 Z', ROAD, null), line('M60 58 L60 66 M60 74 L60 84 M60 94 L60 108', C.white, 1.6),
    path('M4 112 L4 100 L52 54 L4 54 Z', '#eadcc0', null), path('M116 112 L116 100 L68 54 L116 54 Z', '#eadcc0', null),
    bld(6, 20, 26, 60, BRICK, 2, 4), bld(32, 34, 20, 30, OCHRE, 2, 2), bld(88, 20, 26, 60, C.beige, 2, 4), bld(68, 34, 20, 30, '#a7c4a0', 2, 2),
    shopFront(8, 80, 22, RED), shopFront(90, 80, 22, C.green), bus(64, 84, 0.6), carS(46, 100, 0.6, C.denim), carS(84, 108, 0.6, C.yellow), mini(20, 104, C.orange, 'smile', 0.6), mini(104, 104, C.purple, 'smile', 0.6, true)),
  'splan.bostadsgata': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), rect(4, 100, 112, 12, ROAD, 0, null), rect(4, 96, 112, 4, '#cfcac0', 0, null), smallHouse(22, 96, 1.2, C.yellow), smallHouse(62, 96, 1.2, C.sky, C.dark), smallHouse(100, 96, 1.2, C.pink),
    tree(42, 96, 0.8), tree(82, 96, 0.8), fig(52, C.red, 'laugh', { h: 0.36 }), circle(60, 108, 3, C.orange, C.ink, 1), carS(96, 110, 0.5, C.green), sunS(108, 20, 5)),
  'splan.återvändsgränd': all(rect(4, 8, 112, 104, GRASS, 0, null), street(52, 50, 16, 62), circle(60, 40, 22, ROAD, null), ...[[24, 18], [96, 18], [22, 62], [98, 62], [60, 10]].map(([x, y]) => all(roofTop(x! - 9, y! - 7, 18, 14, '#c98b6b'), line(`M${x! - 9} ${y} L${x! + 9} ${y}`, '#9b6a50', 0.8))),
    carS(60, 96, 0.5, C.red), line('M66 74 C78 60 78 30 60 26 C42 30 42 56 54 72', C.accent, 2, '4 3'), path('M50 66 L54 74 L58 67', 'none', C.accent, 2), tree(14, 100, 0.5), tree(106, 100, 0.5), tree(34, 34, 0.4)),
  'splan.kantsten': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), rect(4, 76, 64, 36, '#cfcac0', 0, null), line('M4 76 L68 76', C.ink, 1.4), ...[16, 34, 52].map((x) => line(`M${x} 76 L${x - 4} 112`, '#aaa49a', 1)),
    rect(64, 76, 10, 36, '#e2ded6', 0, HI, 2.6), rect(74, 94, 42, 18, ROAD, 0, null), line('M74 94 L116 94', C.ink, 1.2), path('M68 76 L74 76 L74 94', 'none', C.ink, 1.4),
    circle(96, 82, 12, C.dark, C.ink, 1.6), circle(96, 82, 5, C.silver, C.ink, 1), fig(30, C.denim, 'smile', { h: 0.62 }), g('translate(0 -36)', ''), arrow(86, 52, 72, 72, C.accent, 2.4)),
  'splan.gatubelysning': all(rect(4, 8, 112, 104, '#2c3757', 0, null), moon(100, 20, 6), star(30, 18, 1.4, C.yellow), star(62, 14, 1.4, C.yellow), rect(4, 100, 112, 12, '#555a63', 0, null),
    bld(6, 50, 24, 50, '#5a6070', 2, 3, true), bld(90, 46, 24, 54, '#5a6070', 2, 3, true), lampPost(36, 100, 50), lampPost(70, 100, 50), fig(60, C.orange, 'smile', { h: 0.48 })),
  'splan.gatunamn': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, rect(4, 18, 52, 94, C.beige, 0, C.ink, 1.6), win(18, 40, 9, 11), win(40, 40, 9, 11), win(18, 70, 9, 11), win(40, 70, 9, 11),
    rect(30, 26, 44, 16, '#2f5fa8', 2, C.ink, 1.6), rect(32, 28, 40, 12, 'none', 1, C.white, 1), line('M36 34 q2 -3 4 0 q2 3 4 0 q2 -3 4 0 q2 3 4 0 q2 -3 4 0 q2 3 4 0 q2 -3 4 0', C.white, 1.6), num(66, 37.5, '12', 8, C.white),
    fig(88, C.green, 'smile', { h: 0.86 }), reach(88, 0.86, -1, 74, 74), all(rect(62, 66, 16, 20, C.white, 1, C.ink, 1.2), line('M64 72 L76 72 M70 68 L70 84 M64 80 L76 80', ROAD, 1.6)), say(104, 30, 16, 12, 96, 40, all(circle(101, 30, 1.2, C.ink, null), circle(104, 30, 1.2, C.ink, null), circle(107, 30, 1.2, C.ink, null)))),
  'splan.slutet-kvarter': all(rect(4, 8, 112, 104, ROAD, 0, null), path('M18 22 L102 22 L102 98 L18 98 Z', '#c98b6b', C.ink, 1.6), rect(34, 38, 52, 44, GRASS, 1, C.ink, 1.4),
    line('M18 22 L34 38 M102 22 L86 38 M102 98 L86 82 M18 98 L34 82', '#9b6a50', 1), line('M46 22 L46 38 M74 22 L74 38 M46 82 L46 98 M74 82 L74 98 M18 60 L34 60 M86 60 L102 60', '#9b6a50', 1),
    tree(50, 66, 0.5), tree(70, 60, 0.6), circle(62, 74, 4, C.yellow, C.ink, 1), rect(56, 82, 8, 16, '#7d5b45', 0, C.ink, 1), line('M4 15 L116 15 M4 105 L116 105', C.white, 0.8, '3 3')),
  'splan.kvartersstad': all(rect(4, 8, 112, 104, ROAD, 0, null), ...[[8, 12], [44, 12], [80, 12], [8, 48], [44, 48], [80, 48], [8, 84], [44, 84], [80, 84]].map(([x, y], i) => all(rect(x!, y!, 32, 26, i % 2 ? '#d9a37f' : '#c98b6b', 1, C.ink, 1.2), rect(x! + 8, y! + 7, 16, 12, GRASS, 0.5, C.ink, 0.8))),
    ...[[24, 41], [60, 77], [96, 41]].map(([x, y]) => all(mini(x!, y!, C.orange, 'smile', 0.32), mini(x! + 6, y!, C.green, 'smile', 0.32, true)))),
  'splan.bebyggelse': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), path('M4 112 L4 80 C40 70 80 74 116 80 L116 112 Z', GRASS, null),
    smallHouse(18, 98, 0.8, C.yellow), smallHouse(36, 92, 0.8, C.pink), bld(48, 60, 22, 36, BRICK, 2, 3), smallHouse(82, 94, 0.8, C.sky, C.dark), bld(92, 70, 18, 26, C.beige, 2, 2), smallHouse(30, 110, 0.8, C.mint), smallHouse(64, 110, 0.8, OCHRE), smallHouse(100, 110, 0.8, C.white),
    path('M50 58 L59 46 L68 58', 'none', C.ink, 0), conifer(10, 80, 0.4), conifer(112, 82, 0.4), cloud(30, 24, 0.8)),
  'splan.gångstråk': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), path('M4 112 L44 62 L76 62 L116 112 Z', '#e8ddc7', C.ink, 1.2), path('M4 112 L4 70 L44 62 Z', GRASS, null), path('M116 112 L116 70 L76 62 Z', GRASS, null),
    water(4, 116, 52, 62), tree(16, 96, 0.8), tree(104, 96, 0.8), tree(36, 72, 0.5), tree(84, 72, 0.5), lampPost(26, 108, 40, false),
    g('translate(0 -26)', fig(52, C.green, 'smile', { h: 0.26 }), fig(66, C.purple, 'smile', { h: 0.26, hairStyle: 'long' })), g('translate(0 -14)', fig(42, C.red, 'smile', { h: 0.38 }), fig(78, C.denim, 'smile', { h: 0.38, hairStyle: 'long' })), fig(34, C.yellow, 'smile', { h: 0.52 }), fig(86, C.orange, 'smile', { h: 0.5 })),

  // ── 1733 Grönområden ──────────────────────────────────────────────
  'splan.grönområde': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), greyed(bld(6, 24, 22, 60, '#999', 2, 4), bld(92, 30, 22, 54, '#999', 2, 4)), path('M4 112 L4 80 C30 74 90 74 116 80 L116 112 Z', GRASS, null),
    tree(30, 86, 0.9), tree(52, 80, 1), conifer(74, 84, 0.8), tree(96, 88, 0.8), path('M20 112 C40 98 70 100 100 112', 'none', '#e8ddc7', 5), fig(48, C.orange, 'smile', { h: 0.44 }), fig(70, C.denim, 'smile', { h: 0.42, hairStyle: 'long' }), bush(14, 104, 0.6), flower(86, 106, C.pink, 0.8)),
  'splan.grönyta': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, bld(6, 28, 36, 84, C.beige, 3, 6), bld(78, 28, 36, 84, BRICK, 3, 6), rect(42, 92, 36, 20, GRASS, 0, C.green, 2.4), line('M46 92 l2 -4 M56 92 l-2 -5 M66 92 l2 -4 M74 92 l-1 -5', C.green, 1.4), bush(60, 92, 0.6), flower(50, 102, C.yellow, 0.8), flower(70, 104, C.pink, 0.8)),
  'splan.naturområde': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), path('M4 112 L4 76 C30 66 60 72 116 64 L116 112 Z', GRASS, null), conifer(16, 82, 0.9), conifer(30, 78, 1.1), conifer(44, 82, 0.8), tree(92, 74, 1), conifer(106, 76, 0.8),
    path('M58 100 C60 90 74 88 80 96 C82 102 66 106 58 100 Z', '#a8a39a', C.ink, 1.2), flower(30, 104, C.yellow), flower(40, 108, C.purple), flower(94, 106, C.pink), butterfly(66, 72, C.orange, 0.8), birdFly(60, 26), birdFly(76, 32, 0.8), cloud(30, 24, 0.7)),
  'splan.friluftsområde': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), water(4, 116, 48, 62), path('M4 48 C30 40 60 44 116 40 L116 48 Z', '#3f7f53', null), conifer(14, 48, 0.5), conifer(40, 46, 0.5), conifer(90, 42, 0.5), rect(4, 62, 112, 50, GRASS, 0, null),
    path('M4 96 C30 82 70 106 116 88', 'none', '#e0c79a', 5), fig(40, C.red, 'laugh', { h: 0.54 }), on(40, 0.54, ''), all(rect(78, 92, 22, 4, WOOD, 1, C.ink, 1), line('M80 96 L80 104 M98 96 L98 104', C.brown, 2)), all(rect(98, 74, 10, 8, C.dark, 1, C.ink, 1), line('M100 74 l2 -4 M104 74 l-1 -5', C.orange, 1.4), line('M103 82 L103 96', C.dark, 2)), smoke(104, 66, '#d5d5d5'), swimmer(74, 56), sunS(102, 18, 5)),
  'splan.naturreservat': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), path('M4 112 L4 70 C40 64 80 66 116 70 L116 112 Z', GRASS, null), conifer(14, 82, 1), conifer(30, 80, 1.2), tree(52, 78, 1), conifer(102, 80, 1.1), conifer(88, 82, 0.9),
    line('M70 112 L70 70', C.brown, 3), rect(56, 50, 28, 22, C.white, 2, C.ink, 1.6), rect(58, 52, 24, 18, 'none', 1, C.green, 1.4), conifer(64, 68, 0.36), bird(76, 62, 0.5), flower(72, 68, C.pink, 0.45),
    ...[8, 116].map((x) => line(`M${x} 112 L${x} 98`, C.white, 2.4)), line('M8 100 L116 100', C.white, 0, ''), bird(40, 46, 0.6), butterfly(96, 100, C.yellow, 0.7)),
  'splan.stadsodling': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, greyed(bld(6, 14, 108, 64, '#ccc', 6, 4)), rect(10, 96, 34, 16, WOOD, 1, C.ink, 1.4), rect(52, 96, 34, 16, WOOD, 1, C.ink, 1.4),
    ...[16, 26, 36].map((x) => all(line(`M${x} 96 L${x} 82`, C.green, 1.6), circle(x - 2, 86, 3, RED, C.ink, 0.8), circle(x + 2, 90, 2.6, RED, C.ink, 0.8))), ...[58, 68, 78].map((x) => ellipse(x, 93, 5, 3.4, '#7cc36a', C.ink, 0.8)),
    fig(100, C.orange, 'smile', { h: 0.82 }), reach(100, 0.82, -1, 88, 78), path('M80 74 L92 74 L92 84 L80 84 Z', C.green, C.ink, 1.2), line('M80 76 L72 84', C.green, 2), line('M70 86 l-2 4 M73 88 l-2 4', '#5aa7d6', 1.2)),
  'splan.koloniområde': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), rect(4, 70, 112, 42, GRASS, 0, null), ...[[22, 86], [60, 84], [98, 86]].map(([x, y]) => all(shed(x!, y!, 0.75), fence(x! - 18, x! + 18, y! + 18))),
    ...[12, 18, 50, 70, 88, 108].map((x, i) => flower(x, 100, [C.pink, C.yellow, C.purple, RED, C.orange, C.pink][i]!, 0.8)), fig(40, C.green, 'smile', { h: 0.5, hairStyle: 'long' }), fig(80, C.denim, 'smile', { h: 0.48 }), tree(10, 70, 0.6), tree(110, 70, 0.6)),
  'splan.våtmark': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), rect(4, 70, 112, 42, '#b7d79a', 0, null), path('M10 86 C30 78 70 80 110 88 C100 100 40 104 10 96 Z', WATER, C.ink, 1.2), path('M24 100 C40 96 60 98 74 104 L20 108 Z', WATER, null),
    reeds(10, 92), reeds(28, 80), reeds(86, 82), reeds(104, 90), reeds(56, 108), bird(60, 88, 0.8, C.white), ellipse(60, 92, 9, 1.4, '#7fb7d8', null), birdFly(40, 30), birdFly(80, 24, 0.8), butterfly(96, 66, C.yellow, 0.6)),
  'splan.grönt-tak': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, bld(18, 56, 84, 56, C.beige, 5, 3), path('M14 56 L106 56 L106 44 C90 38 30 40 14 46 Z', GRASS, C.ink, 1.6), line('M20 44 l2 -5 M36 42 l-1 -5 M54 41 l2 -4 M72 41 l-1 -5 M90 42 l2 -5', C.green, 1.6),
    flower(30, 44, C.yellow, 0.7), flower(64, 41, C.pink, 0.7), flower(86, 43, C.purple, 0.7), bee(46, 28, 0.8), drop(22, 26), drop(34, 20), drop(80, 22), drop(96, 28), arrow(50, 30, 52, 38, '#4f8fc9', 1.4)),
  'splan.biologisk-mångfald': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), rect(4, 96, 112, 16, GRASS, 0, null), circle(60, 60, 40, '#eaf6dc', C.green, 1.6),
    flower(36, 92, C.pink), flower(46, 94, C.yellow), flower(74, 92, C.purple), flower(84, 94, RED), tree(60, 74, 0.8), bee(40, 54), butterfly(82, 50, C.orange), bird(62, 32, 0.8), path('M28 72 C30 66 38 66 38 72 Z', '#d9534f', C.ink, 1), line('M33 72 L33 78', C.white, 2), circle(31, 69, 1, C.white, null), circle(35, 68, 1, C.white, null),
    all(ellipse(88, 74, 6, 4, '#6fae4f', C.ink, 1), circle(85, 72, 1.2, C.ink, null), circle(91, 72, 1.2, C.ink, null)), all(ellipse(24, 84, 4, 2, C.ink, null), circle(21, 84, 1.4, C.ink, null))),
  'splan.pollinerare': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), rect(4, 100, 112, 12, GRASS, 0, null), flower(20, 104, C.pink, 2.4), flower(98, 104, C.purple, 2.4), line('M24 70 C40 40 70 40 92 70', C.gold, 1.4, '2 3'),
    ...[[34, 54], [48, 46], [64, 46], [78, 54]].map(([x, y]) => circle(x!, y!, 1.6, C.gold, null)), bee(58, 36, 1.4), butterfly(84, 26, C.orange, 0.8), circle(20, 75, 3, C.gold, null), circle(98, 75, 3, C.gold, null)),
  'splan.insektshotell': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, line('M60 112 L60 96', C.brown, 4), path('M28 30 L60 12 L92 30 Z', C.brown, C.ink, 1.6), rect(32, 30, 56, 66, WOOD, 1, C.ink, 1.8), line('M32 52 L88 52 M32 74 L88 74 M60 30 L60 96', C.brown, 2),
    ...Array.from({ length: 12 }, (_, i) => circle(37 + (i % 4) * 5, 36 + Math.floor(i / 4) * 5.5, 2, '#5b3a22', C.ink, 0.6)), ...Array.from({ length: 6 }, (_, i) => circle(65 + (i % 3) * 7, 38 + Math.floor(i / 3) * 7, 3, '#e8d2a0', C.ink, 0.8)),
    ...Array.from({ length: 4 }, (_, i) => ellipse(40 + i * 5, 63, 2.4, 8, '#b98b5a', C.ink, 0.7)), ...Array.from({ length: 6 }, (_, i) => circle(66 + (i % 3) * 7, 58 + Math.floor(i / 3) * 8, 3, '#a4783f', C.ink, 0.8)),
    ...Array.from({ length: 6 }, (_, i) => line(`M${35 + i * 4} 78 L${35 + i * 4} 92`, '#c9a26b', 2.4)), ...Array.from({ length: 6 }, (_, i) => circle(66 + (i % 3) * 7, 80 + Math.floor(i / 3) * 8, 3, '#5b3a22', C.ink, 0.6)), bee(100, 46, 0.9), bee(20, 66, 0.8), flower(16, 112, C.pink), flower(104, 112, C.yellow)),
  'splan.fågelholk': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, rect(50, 20, 14, 92, C.brown, 2, C.ink, 1.6), circle(34, 30, 22, C.green, C.ink, 1.4), circle(84, 26, 22, C.green, C.ink, 1.4), rect(50, 20, 14, 30, C.brown, 0, null),
    path('M60 44 L80 32 L100 44 Z', BRICK, C.ink, 1.6), rect(64, 44, 32, 34, WOOD, 1, C.ink, 1.6), circle(80, 56, 5, '#3a2a1e', C.ink, 1.2), line('M80 66 L80 70', C.ink, 2), bird(96, 92, 0.9, '#5f8fc8'), line('M64 60 L50 60', C.ink, 1.4)),

  // ── 1734 Trafikplanering ──────────────────────────────────────────
  'splan.trafikplanering': all(rect(4, 8, 112, 104, '#eef0f2', 0, null), rect(10, 14, 66, 50, BLOCKC, 2, C.ink, 1.4), path('M10 40 L76 40', 'none', ROAD, 5), path('M40 14 L40 64', 'none', ROAD, 5), path('M14 60 C30 48 60 30 74 18', 'none', '#e0a33a', 2.4), line('M10 52 L76 52', '#c84a3a', 2, '4 2'),
    rect(22, 20, 10, 8, C.white, 1, C.ink, 0.8), bike(27, 26, 0.24), rect(56, 46, 10, 8, C.white, 1, C.ink, 0.8), rect(58, 48, 6, 3, '#c84a3a', 0.5, null), circle(40, 40, 3, C.white, C.ink, 1),
    rect(4, 82, 112, 6, C.tan, 1, C.ink, 1.4), fig(96, C.navy, 'smile', { h: 0.84, hairStyle: 'long' }), reach(96, 0.84, -1, 72, 56), all(rect(70, 52, 4, 12, C.yellow, 0.5, C.ink, 0.8))),
  'splan.trafikflöde': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), rect(4, 64, 112, 40, ROAD, 0, null), line('M4 84 L116 84', C.white, 1.6, '8 6'),
    carS(18, 80, 0.5, C.red), carS(48, 80, 0.5, C.yellow), carS(78, 80, 0.5, C.green), carS(104, 80, 0.5, C.denim), g('translate(120 0) scale(-1 1)', carS(28, 100, 0.5, C.purple), carS(60, 100, 0.5, C.orange), bus(98, 102, 0.5)),
    arrow(10, 58, 54, 58, C.accent, 2.2), arrow(110, 110, 70, 110, C.accent, 2.2), all(line('M86 64 L86 30', C.grey, 2), rect(72, 14, 30, 18, C.black, 3, C.ink, 1.4), num(87, 27, '2318', 10, '#7ef0a0')), camera(80, 38)),
  'splan.rusningstrafik': all(rect(4, 8, 112, 104, '#fde9cc', 0, null), sunS(18, 22, 6), rect(4, 76, 112, 36, ROAD, 0, null), line('M4 94 L116 94', C.white, 1.6, '8 6'),
    ...[14, 40, 66, 92].map((x, i) => carS(x, 92, 0.5, [C.red, C.yellow, C.green, C.denim][i]!)), ...[22, 48, 74, 100].map((x, i) => carS(x, 110, 0.5, [C.purple, C.orange, C.sky, C.red][i]!)),
    mini(40, 82, C.navy, 'frown', 0.32), mini(66, 82, C.green, 'frown', 0.32, true), clock(96, 34, 13, 8, 0), bld(30, 30, 20, 46, C.beige, 2, 3), bld(54, 40, 18, 36, '#c9b2a0', 2, 2)),
  'splan.genomfartstrafik': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), rect(4, 82, 112, 18, ROAD, 0, null), line('M4 91 L116 91', C.white, 1.4, '6 5'),
    smallHouse(24, 82, 1.1, C.yellow), bld(42, 46, 26, 36, BRICK, 2, 2), smallHouse(90, 82, 1.1, C.pink), truckS(34, 98, 0.6), truckS(84, 98, 0.6, '#d8d0c0'),
    arrow(8, 106, 112, 106, C.accent, 2.4), mini(90, 66, C.orange, 'frown', 0.5), line('M100 62 l3 -3 M102 66 l4 -1', C.ink, 1), smoke(52, 86, '#b9bdc2'), smoke(100, 86, '#b9bdc2')),
  'splan.förbifart': all(rect(4, 8, 112, 104, GRASS, 0, null), circle(60, 66, 26, BLOCKC, C.ink, 1.2), ...[[50, 56], [64, 54], [54, 70], [68, 70]].map(([x, y]) => roofTop(x! - 5, y! - 4, 10, 8)),
    path('M4 66 L34 66 M86 66 L116 66', 'none', ROAD, 6), line('M34 66 L86 66', ROAD, 3), path('M30 66 C30 20 90 20 90 66', 'none', ROAD, 7), path('M30 66 C30 20 90 20 90 66', 'none', HI, 2),
    truckS(60, 30, 0.4), arrow(76, 26, 88, 40, C.accent, 1.8), line('M4 66 L116 66', C.white, 0.6, '3 3')),
  'splan.framkomlighet': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), rect(4, 46, 112, 22, ROAD, 0, null), rect(4, 76, 112, 22, '#b9bdc2', 0, null),
    bus(70, 66, 0.8), line('M14 52 L32 52 M10 58 L28 58 M16 64 L30 64', C.ink, 1.4), arrow(96, 56, 114, 56, C.green, 2.6),
    greyed(carS(18, 96, 0.5, '#999'), carS(48, 96, 0.5, '#999'), carS(78, 96, 0.5, '#999'), carS(106, 96, 0.5, '#999')), check(108, 32, 1.6)),
  'splan.busskörfält': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), path('M4 112 L44 50 L76 50 L116 112 Z', ROAD, null), path('M60 112 L60 50 L76 50 L116 112 Z', '#b9483d', null), line('M60 112 L60 50', C.white, 2), line('M32 112 L52 50', C.white, 1.4, '6 6'),
    bus(84, 98, 0.8), carS(28, 104, 0.5, C.yellow), carS(40, 84, 0.4, C.green), carS(48, 66, 0.3, C.denim), arrow(84, 70, 70, 56, C.white, 2)),
  'splan.cykelparkering': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, path('M8 34 L112 34 L104 26 L16 26 Z', '#7d8792', C.ink, 1.6), line('M14 34 L14 112 M106 34 L106 112', C.grey, 3),
    ...[26, 46, 66, 86].map((x, i) => all(line(`M${x - 8} 112 L${x - 8} 96 Q${x} 86 ${x + 8} 96 L${x + 8} 112`, C.silver, 2.4), bike(x, 104, 0.8, [C.denim, RED, C.green, C.yellow][i]!)))),
  'splan.infartsparkering': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), rect(4, 78, 70, 34, '#9da3aa', 0, null), ...[10, 26, 42, 58].map((x) => line(`M${x} 80 L${x} 96`, C.white, 1.4)),
    carS(18, 94, 0.36, C.red), carS(34, 94, 0.36, C.yellow), carS(50, 94, 0.36, C.green), carS(18, 110, 0.36, C.denim), carS(34, 110, 0.36, C.purple),
    rect(78, 40, 38, 40, '#cfc6b6', 1, C.ink, 1.4), rect(80, 30, 34, 10, C.denim, 1, C.ink, 1.2), bus(96, 108, 0.6), fig(66, C.orange, 'smile', { h: 0.5 }), arrow(54, 72, 80, 72, C.green, 2), tree(70, 44, 0.5)),
  'splan.trafiksäkerhet': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), rect(4, 86, 112, 26, ROAD, 0, null), zebra(30, 90, 88, 112), path('M8 104 C14 96 22 96 28 104 Z', '#e8d34a', C.ink, 1),
    fig(56, C.red, 'smile', { h: 0.42 }), fig(70, C.yellow, 'smile', { h: 0.62, hairStyle: 'long' }), reach(70, 0.62, -1, 60, 92), sign30(100, 54, 9), shieldS(24, 40)),
  'splan.trängselskatt': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), rect(4, 82, 112, 30, ROAD, 0, null), line('M14 112 L14 30 M106 112 L106 30', C.grey, 3), rect(12, 28, 96, 8, C.grey, 1, C.ink, 1.4),
    camera(40, 42), camera(80, 42), line('M40 46 L44 70 M80 46 L76 70', C.accent, 1, '2 2'), carS(60, 100, 0.8, C.denim), rect(52, 94, 16, 5, C.white, 1, C.ink, 0.8), coin(98, 62, 6), coin(110, 52, 5), clock(22, 60, 9, 8, 0)),

  // ── 1735 Nybyggnation ─────────────────────────────────────────────
  'splan.nybyggnation': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, greyed(bld(6, 52, 26, 60, '#aaa', 2, 4)), crane(84, 22, 30, 30),
    rect(40, 70, 36, 42, '#e8e2d4', 0, C.ink, 1.4), line('M40 84 L76 84 M40 98 L76 98 M52 70 L52 112 M64 70 L64 112', C.grey, 1.2), line('M40 70 L40 56 L76 56 L76 70', C.grey, 1.4, '3 2'), rect(98, 92, 16, 20, '#e8e2d4', 0, C.ink, 1.2), line('M84 52 L84 70', C.ink, 1), rect(78, 70, 12, 6, WOOD, 0.5, C.ink, 1)),
  'splan.nyproduktion': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, lawn(104), bld(28, 30, 64, 82, C.white, 4, 5), rect(54, 94, 12, 18, '#bfe3f5', 1, C.ink, 1.2), sparkle(20, 30, 5), sparkle(100, 22, 5), sparkle(104, 70, 4),
    all(line('M14 112 L14 84', C.brown, 2), rect(6, 70, 20, 14, C.white, 1, C.ink, 1.2), keyS(11, 77, 0.7)), tree(108, 104, 0.6)),
  'splan.bostadsbyggande': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, bld(10, 86, 22, 26, C.beige, 2, 1), bld(36, 70, 22, 42, '#f4c46a', 2, 3), bld(62, 52, 22, 60, BRICK, 2, 4), rect(88, 40, 22, 72, '#e8e2d4', 0, C.ink, 1.4), line('M88 58 L110 58 M88 76 L110 76 M88 94 L110 94 M99 40 L99 112', C.grey, 1), scaffold(88, 110, 40, 112),
    arrow(14, 70, 92, 22, C.green, 3)),
  'splan.exploatera': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, greyed(rect(6, 70, 44, 42, '#aaa', 0, null), conifer(16, 82, 0.6), tree(36, 84, 0.6), flower(28, 100, '#888')), arrow(52, 80, 66, 80, C.accent, 3),
    rect(68, 70, 46, 42, '#d8cfc0', 0, null), bld(70, 60, 18, 52, '#f4c46a', 1, 4), bld(92, 74, 20, 38, BRICK, 2, 2), line('M68 108 L114 108', ROAD, 3)),
  'splan.byggherre': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, fig(34, '#2b3550', 'smile', { h: 0.92, bottom: '#2b3550' }), on(34, 0.92, helmet(C.white), path('M-3 -42 L0 -30 L3 -42 Z', C.white, null), line('M0 -40 L0 -26', RED, 2)),
    reach(34, 0.92, 1, 54, 70), all(rect(50, 58, 28, 20, C.white, 1, C.ink, 1.2), path('M54 74 L54 64 L64 60 L74 64 L74 74 Z', 'none', '#2f5fa8', 1.4)), coinStack(16, 108, 4), builder(92, 0.72), say(98, 26, 18, 14, 94, 42, check(98, 26.5, 1))),
  'splan.första-spadtaget': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, path('M40 112 C46 104 74 104 80 112 Z', '#9b6b3c', C.ink, 1.2), fig(54, '#2b3550', 'laugh', { h: 0.86, bottom: '#2b3550' }), on(54, 0.86, helmet(C.white)),
    shovel(72, 110, 1.2, C.gold, -10), reach(54, 0.86, 1, 70, 78), ribbonTape(4, 116, 90), line('M14 90 L14 112 M106 90 L106 112', C.ink, 1.4),
    mini(16, 64, C.orange, 'smile', 0.8), mini(98, 64, C.green, 'smile', 0.8, true), all(rect(100, 40, 14, 10, C.dark, 2, C.ink, 1), circle(107, 45, 3, '#9fc3ee', C.ink, 0.8)), sparkle(90, 30, 4), sparkle(28, 30, 4)),
  'splan.byggarbetsplats': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, rect(4, 98, 112, 14, '#c9a46e', 0, null), crane(30, 22, 18, 40),
    all(path('M56 104 L56 92 L84 92 L88 104 Z', C.yellow, C.ink, 1.4), rect(60, 80, 14, 12, C.yellow, 1, C.ink, 1.4), line('M84 92 L98 74 L108 84', C.yellow, 3), path('M104 82 L112 84 L110 92 L102 90 Z', C.yellow, C.ink, 1.2), rect(54, 104, 36, 5, C.dark, 2, C.ink, 1)),
    builder(94, 0.6), ...Array.from({ length: 6 }, (_, i) => rect(6 + i * 4, 96, 3, 16, C.white, 0, i % 2 ? RED : C.white, 1)), path('M8 96 L28 96', 'none', RED, 0)),
  'splan.byggkran': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, crane(48, 20, 30, 64), line('M96 20 L96 66', C.ink, 1), rect(86, 66, 20, 10, '#9da3aa', 1, C.ink, 1.4), greyed(bld(78, 82, 36, 30, '#bbb', 3, 2))),
  'splan.byggställning': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, rect(26, 18, 70, 94, C.beige, 0, C.ink, 1.6), ...[34, 52, 70, 88].flatMap((x) => [32, 56, 80].map((y) => win(x, y, 8, 10))), scaffold(18, 102, 22, 112), builder(74, 0.5), g('translate(0 -36)', builder(40, 0.5))),
  'splan.byggarbetare': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, builder(56, 1), reach(56, 1, 1, 84, 66), reach(56, 1, -1, 30, 66), rect(18, 60, 80, 6, WOOD, 1, C.ink, 1.2), greyed(scaffold(96, 116, 30, 112))),
  'splan.gjuta': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, path('M4 112 L4 90 L60 90 L60 112', 'none', C.ink, 0), rect(10, 96, 50, 16, '#b8b8b2', 0, null), rect(8, 90, 4, 22, WOOD, 0.5, C.ink, 1), rect(58, 90, 4, 22, WOOD, 0.5, C.ink, 1), line('M10 98 L58 98', C.grey, 0.8),
    g('translate(80 104)', rect(-14, -30, 46, 26, C.white, 2, C.ink, 1.4), g('rotate(-14 8 -22)', ellipse(8, -22, 20, 12, '#e8862c', C.ink, 1.6), line('M-4 -30 L20 -14 M4 -32 L22 -20', C.white, 1.6)), path('M-14 -12 L-30 -6', 'none', C.grey, 4), circle(-6, 0, 5, C.dark, C.ink, 1), circle(22, 0, 5, C.dark, C.ink, 1)),
    path('M48 86 C42 90 40 94 40 98 L52 98 C52 94 50 90 48 86 Z', '#9a9a94', C.ink, 1), line('M66 84 L48 86', C.grey, 4), line('M66 84 L48 86', C.ink, 0.6), builder(24, 0.56)),
  'splan.visningslägenhet': all(rect(4, 8, 112, 104, '#f6efe2', 0, null), rect(4, 84, 112, 28, '#e8d3b0', 0, null), rect(14, 22, 30, 26, '#bfe3f5', 1, C.ink, 1.4), all(rect(18, 70, 40, 14, C.mint, 4, C.ink, 1.4), rect(16, 62, 44, 10, C.mint, 4, C.ink, 1.4)), all(rect(66, 74, 18, 3, WOOD, 1, C.ink, 1), line('M68 77 L68 84 M82 77 L82 84', C.brown, 1.6)), vaseS(75, 74),
    fig(92, C.purple, 'smile', { h: 0.82, hairStyle: 'long' }), fig(104, C.denim, 'smile', { h: 0.88 }), fig(56, '#2b3550', 'smile', { h: 0.84, bottom: '#2b3550' }), reach(56, 0.84, -1, 40, 62), all(rect(60, 52, 8, 10, C.white, 1, C.ink, 0.8))),
  'splan.inflyttningsklar': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, greyed(rect(6, 40, 40, 72, '#ddd', 0, '#888', 1.2), scaffold(6, 46, 44, 112)), rect(62, 40, 46, 72, '#f4c46a', 1, C.ink, 1.6), win(74, 56, 10, 10), win(96, 56, 10, 10), win(74, 80, 10, 10), win(96, 80, 10, 10), rect(80, 96, 12, 16, C.brown, 0.5, C.ink, 1.2),
    okBadge(86, 24, 9), keyS(52, 90, 1.1), boxS(60, 112, 12, 10)),

  // ── 1736 Renovering av stadsdelar ─────────────────────────────────
  'splan.rusta-upp': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, rect(14, 30, 70, 82, '#c9c2b4', 0, C.ink, 1.6), rect(14, 30, 34, 82, '#f4c46a', 0, C.ink, 1.6), worn(64, 46), worn(72, 70), worn(56, 88),
    win(30, 48, 10, 10), win(30, 76, 10, 10), all(rect(58, 43, 10, 10, '#c9d4dc', 1, C.ink, 1.2), line('M58 43 L68 53', C.ink, 0.8)), win(70, 76, 10, 10), fig(98, C.white, 'smile', { h: 0.84, bottom: C.white }), reach(98, 0.84, -1, 56, 60), line('M56 60 L48 54', C.brown, 2.4), rect(44, 48, 6, 9, OCHRE, 1, C.ink, 1)),
  'splan.upprustning': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, greyed(rect(6, 70, 44, 42, '#ccc', 0, null), line('M14 112 L14 84 M10 84 L18 84', '#888', 2), path('M28 104 L40 100', 'none', '#888', 1.6), worn(34, 80)), arrow(52, 86, 66, 86, C.accent, 3),
    rect(68, 70, 46, 42, '#e9e2d0', 0, null), all(rect(72, 88, 20, 4, WOOD, 1, C.ink, 1), line('M74 92 L74 98 M90 92 L90 98', C.brown, 2)), tree(104, 104, 0.6), flower(78, 108, C.pink), flower(86, 108, C.yellow), lampPost(98, 112, 34, false), sparkle(80, 76, 4)),
  'splan.ombyggnad': all(rect(4, 8, 112, 104, '#f2efe8', 0, null), rect(10, 24, 100, 80, 'none', 1, C.ink, 2), line('M60 24 L60 104', C.grey, 2, '4 3'), cross(60, 64, 6),
    line('M36 24 L36 104 M84 24 L84 104', C.ink, 2.4), all(rect(14, 80, 18, 10, C.tan, 1, C.ink, 1), rect(14, 60, 8, 12, '#bfe3f5', 1, C.ink, 1)), all(rect(88, 70, 18, 22, C.sky, 2, C.ink, 1), rect(88, 66, 6, 6, C.white, 1, C.ink, 0.8)),
    builder(48, 0.46), arrow(40, 16, 80, 16, C.accent, 2)),
  'splan.rivning': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, path('M50 112 L50 50 L66 40 L74 56 L82 48 L90 60 L96 112 Z', '#c9b8a6', C.ink, 1.6), win(62, 70, 8, 9), win(80, 86, 8, 9), ...[[60, 104], [72, 106], [86, 100], [96, 108]].map(([x, y]) => rect(x!, y!, 7, 5, '#b09a86', 1, C.ink, 0.8)),
    all(path('M10 104 L10 92 L32 92 L36 104 Z', C.yellow, C.ink, 1.4), rect(14, 80, 12, 12, C.yellow, 1, C.ink, 1.4), line('M32 92 L42 56 L48 66', C.yellow, 3.4), path('M44 62 L54 60 L54 72 L46 72 Z', C.dark, C.ink, 1.2), rect(8, 104, 30, 5, C.dark, 2, C.ink, 1)),
    smoke(70, 40, '#d6cfc6'), smoke(86, 34, '#d6cfc6')),
  'splan.fasadrenovering': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, rect(20, 16, 80, 96, '#bfb8aa', 0, C.ink, 1.6), rect(20, 16, 40, 96, '#f6d99a', 0, null), line('M20 16 L20 112 M100 16 L100 112', C.ink, 1.6), worn(78, 30), worn(86, 66),
    ...[32, 48, 72, 88].flatMap((x) => [32, 60, 88].map((y) => win(x, y, 8, 10))), scaffold(14, 106, 22, 112), builder(66, 0.48), line('M74 76 L62 66', C.brown, 2), rect(57, 61, 7, 8, '#f6d99a', 1, C.ink, 0.8)),
  'splan.tilläggsisolera': all(rect(4, 8, 112, 104, '#f4f1ea', 0, null), greyed(rect(10, 20, 8, 40, '#bbb', 0, C.ink, 1.2), path('M24 40 L40 40', 'none', '#777', 2), heatUp(30, 40, '#777', 0.6), path('M24 30 L40 30', 'none', '#777', 1.4), arrow(22, 50, 40, 50, '#777', 1.6)),
    rect(56, 18, 10, 90, '#c9a084', 0, C.ink, 1.4), path('M66 18 L88 18 L88 108 L66 108 Z', '#f2d25c', C.ink, 1.4), path('M66 26 q5 4 11 0 q5 -4 11 0 M66 40 q5 4 11 0 q5 -4 11 0 M66 54 q5 4 11 0 q5 -4 11 0 M66 68 q5 4 11 0 q5 -4 11 0 M66 82 q5 4 11 0 q5 -4 11 0 M66 96 q5 4 11 0 q5 -4 11 0', 'none', '#c9a43a', 1.2),
    rect(88, 18, 6, 90, '#efe9dc', 0, C.ink, 1.2), heatUp(48, 66, RED, 0.9), arrow(42, 58, 54, 58, RED, 2), path('M54 52 L44 40', 'none', RED, 0), arrow(54, 76, 44, 82, RED, 2), radiator(22, 92)),
  'splan.evakueringslägenhet': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, rect(6, 28, 40, 84, C.beige, 0, C.ink, 1.6), rect(14, 40, 24, 20, '#9da3aa', 0, C.ink, 1), line('M18 44 L34 56 M34 44 L18 56', C.grey, 1.2), builder(26, 0.42),
    rect(76, 40, 38, 72, '#a7c4a0', 0, C.ink, 1.6), win(86, 56, 9, 10, true), win(104, 56, 9, 10), win(86, 80, 9, 10), win(104, 80, 9, 10), arrow(48, 76, 74, 76, C.accent, 2.6),
    fig(58, C.orange, 'smile', { h: 0.48 }), boxS(66, 112, 10, 8), all(rect(52, 16, 22, 18, C.white, 2, C.ink, 1.2), rect(52, 16, 22, 5, RED, 1, null), ...Array.from({ length: 8 }, (_, i) => rect(55 + (i % 4) * 4.4, 24 + Math.floor(i / 4) * 4, 3, 3, i < 6 ? C.green : C.grey2, 0.5, null)))),
  'splan.hyresgästförening': all(rect(4, 8, 112, 104, '#f6efe2', 0, null), rect(34, 14, 52, 30, C.white, 2, C.ink, 1.4), bld(46, 20, 28, 22, BRICK, 2, 1), ...[[38, 22], [82, 22]].map(([x, y]) => all(circle(x!, y!, 3, C.skin, C.ink, 0.8))),
    ...[16, 36, 56, 76, 96].map((x, i) => mini(x + 4, 76 + (i % 2) * 6, [C.red, C.green, C.navy, C.purple, C.orange][i]!, 'smile', 0.95, i % 2 === 0)), ...[[24, 68], [64, 68]].map(([x, y]) => all(line(`M${x! + 4} ${y! + 10} L${x! + 8} ${y! - 6}`, C.skin, 4), circle(x! + 8, y! - 8, 3, C.skin, C.ink, 1))),
    rect(4, 98, 112, 14, '#d9c3a0', 0, null), say(96, 54, 18, 12, 100, 66, all(circle(92, 54, 1.2, C.ink, null), circle(96, 54, 1.2, C.ink, null), circle(100, 54, 1.2, C.ink, null)))),
  'splan.standardhöjning': all(rect(4, 8, 112, 104, '#f4f1ea', 0, null), greyed(rect(8, 60, 40, 30, '#bbb', 1, C.ink, 1.2), rect(8, 56, 40, 4, '#999', 0, null), circle(18, 52, 3, 'none', '#777', 1.2), worn(36, 66)), arrow(52, 74, 66, 74, C.accent, 3),
    rect(70, 60, 42, 30, C.white, 1, C.ink, 1.4), rect(68, 56, 46, 5, '#5a5f6a', 1, C.ink, 1), rect(76, 64, 14, 22, '#e6eaee', 1, C.ink, 1), circle(83, 75, 4, '#bfe3f5', C.ink, 0.8), rect(94, 64, 14, 10, '#d9a066', 1, C.ink, 1), sparkle(100, 44, 5),
    coin(88, 102, 5), upArrow(100, 108, 94, C.accent), coin(76, 102, 5)),
  'splan.renoveringsvräkning': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, rect(54, 20, 56, 92, '#f6d99a', 0, C.ink, 1.6), ...[64, 82, 100].flatMap((x) => [34, 58, 82].map((y) => win(x, y, 8, 10))), sparkle(46, 24, 4),
    coinStack(86, 110, 3), upArrow(100, 108, 90, RED), fig(28, C.grey, 'frown', { h: 0.82 }), reach(28, 0.82, -1, 14, 86), rect(8, 86, 12, 14, C.brown, 2, C.ink, 1.2), arrow(40, 104, 10, 104, C.grey, 2)),
  'splan.gentrifiering': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, greyed(rect(6, 40, 50, 72, '#ccc', 0, C.ink, 1.2), rect(12, 84, 18, 18, '#aaa', 0, null), worn(40, 56)), arrow(58, 76, 64, 76, C.accent, 2.4),
    rect(64, 40, 50, 72, '#f6d99a', 0, C.ink, 1.4), shopFront(68, 92, 42, C.green), win(76, 56, 8, 10), win(100, 56, 8, 10), coffee(110, 32), coinStack(98, 34, 3),
    fig(30, C.grey, 'frown', { h: 0.5 }), fig(84, C.purple, 'smile', { h: 0.5, hairStyle: 'long' })),
  'splan.trygghetsvandring': all(rect(4, 8, 112, 104, '#2c3757', 0, null), rect(4, 100, 112, 12, '#555a63', 0, null), lampPost(98, 100, 50, false), cross(108, 42, 4, RED),
    ...[[30, C.reflex], [50, C.reflex], [70, C.reflex]].map(([x, c], i) => all(fig(x as number, c as string, 'smile', { h: 0.72, hairStyle: i === 1 ? 'long' : 'short' }))), reach(70, 0.72, 1, 88, 60),
    path('M30 68 L14 56 L14 80 Z', 'rgba(255,236,150,0.45)', null), reach(30, 0.72, -1, 22, 70), rect(46, 72, 8, 10, C.white, 1, C.ink, 0.8)),

  // ── 1737 Hållbar stadsutveckling ──────────────────────────────────
  'splan.stadsutveckling': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, lawn(104), bld(8, 56, 20, 48, C.beige, 2, 3), bld(30, 40, 22, 64, '#a7c4a0', 2, 4, false, GRASS), bld(56, 60, 24, 44, '#f4c46a', 2, 3), crane(94, 26, 20, 16),
    rect(84, 64, 22, 40, '#e8e2d4', 0, C.ink, 1.2), panel(58, 54, 10, 6), panel(68, 54, 10, 6), tree(26, 104, 0.6), tree(82, 104, 0.6), bike(56, 108, 0.5), fig(110, C.orange, 'smile', { h: 0.4 })),
  'splan.förtätning': all(planBg(), street(4, 56, 112, 8), street(56, 8, 8, 104), greyed(...[[10, 14], [70, 14], [10, 70], [70, 70]].map(([x, y]) => rect(x!, y!, 18, 14, '#999', 1, C.ink, 1))),
    ...[[32, 14], [94, 14], [10, 34], [32, 34], [70, 34], [94, 34], [32, 70], [94, 70], [10, 90], [32, 90], [70, 90], [94, 90]].map(([x, y], i) => all(roofTop(x!, y!, 18, 14, i % 2 ? '#e8862c' : '#d06a3a'), plus(x! + 9, y! + 7, 3, C.white)))),
  'splan.blandstad': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, rect(10, 20, 100, 92, '#f6d99a', 0, C.ink, 1.6), ...[22, 44, 66, 88].map((x) => win(x + 4, 34, 9, 10, true)), mini(26, 36, C.green, 'smile', 0.4), ...[22, 44].map((x) => win(x + 4, 56, 9, 10)),
    all(rect(62, 50, 44, 14, '#d8eef8', 0, C.ink, 1), mini(72, 58, C.navy, 'smile', 0.42), rect(78, 58, 10, 4, C.dark, 0.5, null), mini(96, 58, C.purple, 'smile', 0.42, true)),
    line('M10 72 L110 72', C.ink, 1.6), shopFront(14, 76, 40, RED), shopFront(64, 76, 42, C.green), coffee(30, 108), fig(60, C.orange, 'smile', { h: 0.36 }), bike(96, 108, 0.5)),
  'splan.klimatsmart': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, greyed(carS(28, 108, 0.9, '#999'), coSmoke(16, 78, 0.9)), bike(84, 104, 1.1, C.green), fig(84, C.orange, 'laugh', { h: 0.6 }), on(84, 0.6, ''), earth(84, 30, 12), heartS(98, 20), check(64, 40, 1.4), cross(28, 46, 7)),
  'splan.energieffektiv': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, greyed(smallHouse(26, 112, 1.3, '#ccc', '#999'), heatUp(14, 60, '#777', 0.6), heatUp(38, 56, '#777', 0.6), gauge(26, 38, 24, '#888')),
    path('M60 76 L86 54 L112 76 Z', C.green, C.ink, 1.8), rect(64, 76, 44, 36, '#fdf3dc', 0, C.ink, 3.4), win(76, 90, 10, 10, true), rect(92, 90, 10, 22, C.brown, 0.5, C.ink, 1), gauge(86, 44, 5, C.green), check(100, 28, 1.2)),
  'splan.passivhus': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, sunS(102, 22, 7), path('M14 56 L54 26 L94 56 Z', C.dark, C.ink, 1.8), rect(18, 56, 72, 56, '#f2d25c', 0, C.ink, 1.8), rect(24, 62, 60, 50, '#fdf3dc', 0, C.ink, 1.4),
    rect(30, 70, 18, 16, '#bfe3f5', 1, C.ink, 1.4), line('M88 30 L72 60', C.gold, 1.4, '3 2'), mini(64, 86, C.orange, 'smile', 0.8), heatUp(64, 74, RED, 0.5), greyed(radiator(30, 96, false)), cross(41, 102, 5)),
  'splan.solpanel': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, sunS(20, 22, 7), path('M20 72 L60 38 L100 72 Z', BRICK, C.ink, 1.8), rect(26, 72, 68, 40, '#f6efe2', 0, C.ink, 1.6), win(42, 88, 10, 10), rect(66, 88, 12, 24, C.brown, 0.5, C.ink, 1.2),
    ...[0.18, 0.48].map((t) => solarOn(20 + 40 * t, 72 - 34 * t, 20 + 40 * (t + 0.28), 72 - 34 * (t + 0.28))), line('M28 30 L46 46 M32 26 L56 40', C.gold, 1.2, '3 2')),
  'splan.fjärrvärme': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), rect(4, 86, 112, 26, '#c9b394', 0, null), rect(8, 46, 30, 40, '#9da3aa', 1, C.ink, 1.6), rect(26, 22, 7, 24, '#8a9098', 0.5, C.ink, 1.2), smoke(30, 16, '#e3e3e3'), path('M14 70 L22 60 L30 70 Z', RED, null),
    pipe('M24 96 L110 96'), pipe('M60 96 L60 86'), pipe('M98 96 L98 86'), smallHouse(60, 86, 0.9, C.yellow), bld(84, 50, 28, 36, C.beige, 2, 2), heatUp(60, 66, RED, 0.5), heatUp(98, 46, RED, 0.5), arrow(40, 104, 70, 104, RED, 1.8)),
  'splan.bilpool': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, rect(4, 92, 112, 20, '#9da3aa', 0, null), carS(30, 108, 0.7, C.green), carS(84, 108, 0.7, C.green), rect(24, 94, 12, 4, C.white, 1, null), rect(78, 94, 12, 4, C.white, 1, null),
    mini(18, 60, C.orange, 'smile', 0.7), mini(46, 60, C.purple, 'smile', 0.7, true), mini(74, 60, C.navy, 'smile', 0.7), mini(102, 60, C.red, 'smile', 0.7, true), keyS(54, 32, 1.4), line('M18 50 L54 36 M46 50 L58 38 M74 50 L64 38 M102 50 L70 34', C.grey, 1, '2 2')),
  'splan.klimatanpassning': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), cloud(30, 22, 0.9, '#cdd3da'), rain(18, 44, 30, 40), path('M4 112 L4 82 L50 82 C56 94 70 94 76 82 L116 82 L116 112 Z', '#c9b394', null), path('M50 82 C56 94 70 94 76 82 Z', WATER, C.ink, 1.2),
    rect(4, 72, 40, 10, '#a99a80', 0, null), smallHouse(24, 72, 0.9, C.yellow), rect(80, 70, 36, 12, '#a99a80', 0, null), bld(84, 40, 26, 30, C.beige, 2, 2), tree(62, 82, 0.6), check(108, 22, 1.4)),
  'splan.översvämning': all(rect(4, 8, 112, 104, '#dbe3ea', 0, null), cloud(36, 20, 0.9, '#aeb6bf'), cloud(84, 22, 0.8, '#aeb6bf'), rain(14, 106, 32, 50), smallHouse(30, 100, 1.4, C.yellow), smallHouse(90, 100, 1.4, C.pink),
    rect(4, 86, 112, 26, 'rgba(110,170,214,0.85)', 0, null), line('M8 90 q4 -3 8 0 q4 3 8 0 M40 92 q4 -3 8 0 q4 3 8 0 M76 90 q4 -3 8 0 q4 3 8 0', '#3f7fb8', 1.4), carS(60, 98, 0.5, C.red), rect(36, 104, 50, 8, 'rgba(110,170,214,0.85)', 0, null)),
  'splan.skyfall': all(rect(4, 8, 112, 104, '#cfd6de', 0, null), path('M4 8 L116 8 L116 30 C100 36 80 28 60 34 C40 28 20 36 4 30 Z', '#5c6670', C.ink, 1.4), rain(10, 114, 34, 70), rain(14, 116, 52, 70),
    rect(4, 100, 112, 12, '#7aa6c8', 0, null), fig(60, C.yellow, 'shock', { h: 0.62 }), line('M70 62 L70 92', C.ink, 1.4), path('M50 64 C50 50 90 50 90 64 Z', C.denim, C.ink, 1.4), line('M14 104 q4 -3 8 0 M94 106 q4 -3 8 0', '#3f7fb8', 1.4)),
  'splan.klimatneutral': all(rect(4, 8, 112, 104, '#e8f4fb', 0, null), ground, line('M60 30 L60 104', C.dark, 3), path('M50 104 L70 104 L66 98 L54 98 Z', C.dark, C.ink, 1), line('M18 40 L102 40', C.dark, 3), circle(60, 30, 3, C.dark, null),
    line('M24 40 L18 64 M24 40 L30 64 M96 40 L90 64 M96 40 L102 64', C.ink, 1), path('M12 64 L36 64 C34 72 14 72 12 64 Z', C.silver, C.ink, 1.2), path('M84 64 L108 64 C106 72 86 72 84 64 Z', C.silver, C.ink, 1.2),
    coSmoke(24, 56, 0.6), conifer(96, 63, 0.5), tree(90, 63, 0.4), tree(103, 63, 0.4), earth(60, 82, 10), num(60, 24, '0', 9)),
};

// small extras used above
function solarOn(x1: number, y1: number, x2: number, y2: number): Svg { const nx = 0.65 * 10, ny = 0.76 * 10; return all(path(`M${f1(x1)} ${f1(y1)} L${f1(x2)} ${f1(y2)} L${f1(x2 + nx)} ${f1(y2 + ny)} L${f1(x1 + nx)} ${f1(y1 + ny)} Z`, '#2f4f86', C.ink, 1.2), line(`M${f1((x1 + x2) / 2)} ${f1((y1 + y2) / 2)} L${f1((x1 + x2) / 2 + nx)} ${f1((y1 + y2) / 2 + ny)} M${f1(x1 + nx / 2)} ${f1(y1 + ny / 2)} L${f1(x2 + nx / 2)} ${f1(y2 + ny / 2)}`, '#9fc3ee', 0.8)); }
function swimmer(x: number, y: number): Svg { return all(circle(x, y, 4, C.skin, C.ink, 1), path(`M${x - 4} ${y - 1} C${x - 4} ${y - 6} ${x + 4} ${y - 6} ${x + 4} ${y - 1} Z`, RED, null), line(`M${x - 10} ${y + 2} L${x - 5} ${y - 2} M${x + 5} ${y - 2} L${x + 10} ${y + 2}`, C.skin, 2.4)); }
function shieldS(x: number, y: number): Svg { return all(path(`M${x} ${y - 14} L${x + 12} ${y - 9} C${x + 12} ${y + 4} ${x + 7} ${y + 11} ${x} ${y + 15} C${x - 7} ${y + 11} ${x - 12} ${y + 4} ${x - 12} ${y - 9} Z`, C.green, C.ink, 1.6), check(x, y, 1.2, C.white)); }
function vaseS(x: number, y: number): Svg { return all(path(`M${x - 3} ${y} L${x + 3} ${y} L${x + 2} ${y - 8} L${x - 2} ${y - 8} Z`, C.denim, C.ink, 1), line(`M${x} ${y - 8} L${x - 3} ${y - 14} M${x} ${y - 8} L${x + 3} ${y - 15}`, C.green, 1.2), circle(x - 3, y - 15, 2, C.pink, null), circle(x + 3, y - 16, 2, C.yellow, null)); }
function coffee(x: number, y: number): Svg { return all(path(`M${x - 5} ${y - 7} L${x + 5} ${y - 7} L${x + 4} ${y} L${x - 4} ${y} Z`, C.white, C.ink, 1.1), path(`M${x + 5} ${y - 5} C${x + 8} ${y - 5} ${x + 8} ${y - 1} ${x + 4.4} ${y - 1.4}`, 'none', C.ink, 1), line(`M${x - 2} ${y - 9} q1 -2 0 -4 M${x + 2} ${y - 9} q1 -2 0 -4`, C.grey, 0.9)); }
function heartS(x: number, y: number): Svg { return path(`M${x} ${y + 6} C${x - 9} ${y} ${x - 6} ${y - 8} ${x} ${y - 3} C${x + 6} ${y - 8} ${x + 9} ${y} ${x} ${y + 6} Z`, C.red, C.ink, 1.1); }
function counter(x1: number, x2: number, y: number, col: string = C.tan): Svg { return all(rect(x1, y, x2 - x1, 112 - y, col, 1, C.ink, 1.6), rect(x1 - 2, y - 3, x2 - x1 + 4, 4, C.brown, 1, C.ink, 1.2)); }
