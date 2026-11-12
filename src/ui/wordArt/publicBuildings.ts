/**
 * Samhälle & institutioner → Städer & offentlig service → Offentliga byggnader, 1711–1717 (0.34): the
 * town hall and authority offices, hospitals and health centres, schools and libraries, police and fire
 * stations, sports halls and swimming baths, culture houses and museums, and visiting a public
 * building. Recurring signs: the state is a building with columns and the Swedish flag, a kommun is a
 * green badge with a little house (as in municipal.ts), a hospital is white with a red cross, the
 * school is ochre with a red roof and a clock, books are coloured spines on shelves, water is light
 * blue with wave lines. Abstract words are small symbolic scenes with a grey reference. Digits only;
 * no words in the pictures and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, star, type Svg } from './kit';
import { type Build } from './figures';
import { arm } from './people';
import { P as F, type Mood, greyed, coin } from './blindFix';
import { win, tree } from './homeKit';
import { clock } from './time';
import { checkIcon } from './labelIcons';

// ── Geometry and figures ─────────────────────────────────────────────
const RED = '#e8302c';
const BRICK = '#c4553a';
const OCHRE = '#e3b04b';
const WATER = '#9fd6ef';
const WOOD = '#d9a066';
const f1 = (n: number) => n.toFixed(1);
const ground = line('M4 112 L116 112', C.grey2, 2);
/** Head and shoulder positions of a standing figure at x with height factor h. */
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, hy: ty - 56 * s, hr: 10 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const hnd = (x: number, y: number, r = 3) => circle(x, y, r, C.skin, C.ink, 1.2);
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), hnd(tx, ty, 3 * Math.max(0.7, h))); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; torso −42…2; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
/** Small head-and-shoulders person (behind counters, in rows, in beds). */
const mini = (x: number, y: number, col: string, mood: 'smile' | 'frown' | 'flat' | 'open' = 'smile', s = 1, long = false, grey = false) => {
  const sk = grey ? C.grey2 : C.skin, hr = grey ? C.grey : C.hair, c = grey ? C.grey : col;
  return g(`translate(${x} ${y}) scale(${s})`, long ? path('M-8 -6 C-9 6 9 6 8 -6 Z', hr, null) : '', path('M-10 16 C-10 4 10 4 10 16 Z', c, C.ink, 1.4), circle(0, -6, 7.5, sk, C.ink, 1.4), path('M-7.5 -8 C-7.5 -16 7.5 -16 7.5 -8 C4 -11 -4 -11 -7.5 -8 Z', hr, null),
    circle(-2.6, -6, 1, C.ink, null), circle(2.6, -6, 1, C.ink, null),
    mood === 'smile' ? path('M-2.6 -2.6 Q0 -0.6 2.6 -2.6', 'none', C.ink, 1.1) : mood === 'flat' ? line('M-2.4 -2 L2.4 -2', C.ink, 1.1) : mood === 'open' ? ellipse(0, -2, 1.6, 1.4, '#c84a4a', C.ink, 0.8) : path('M-2.6 -1.4 Q0 -3.4 2.6 -1.4', 'none', C.ink, 1.1));
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
const flagSE = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L0 -24', C.ink, 1.6), rect(0, -24, 16, 10, '#3a6ab0', 0, C.ink, 1), rect(5, -24, 3, 10, C.yellow, 0, null), rect(0, -20.5, 16, 3, C.yellow, 0, null));
/** The state: a small building with columns and a flag. */
const stateHouse = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-16 -14 L0 -24 L16 -14 Z', C.beige, C.ink, 1.4), rect(-15, -14, 30, 3, C.beige, 0, C.ink, 1.2), ...[-11, -4, 3, 10].map((cx) => rect(cx - 1.5, -11, 3, 13, C.white, 0, C.ink, 1)), rect(-17, 2, 34, 3, C.beige, 0, C.ink, 1.2), flagSE(0, -24, 0.6));
/** A kommun: green badge with a little house. */
const kommun = (x: number, y: number, r = 9) => all(circle(x, y, r, C.green, C.ink, 1.4), path(`M${x - r * 0.5} ${y + r * 0.1} L${x} ${y - r * 0.45} L${x + r * 0.5} ${y + r * 0.1} Z`, C.white, null), rect(x - r * 0.38, y + r * 0.1, r * 0.76, r * 0.42, C.white, 0, null));
const redCross = (x: number, y: number, r = 6, bg: string = C.white) => all(circle(x, y, r, bg, C.ink, 1.2), rect(x - r * 0.2, y - r * 0.65, r * 0.4, r * 1.3, RED, 0.3, null), rect(x - r * 0.65, y - r * 0.2, r * 1.3, r * 0.4, RED, 0.3, null));
const check = (x: number, y: number, s = 1, col: string = C.green) => checkIcon(x, y, s, col);
const cross = (x: number, y: number, r = 6, col: string = RED) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 3);
const sunS = (x: number, y: number, r = 6) => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 5))} ${f1(y + Math.sin(a) * (r + 5))}`, C.gold, 1.6); }), circle(x, y, r, C.yellow, C.ink, 1.2));
const moon = (x: number, y: number, r = 6) => path(`M${x + r * 0.3} ${y - r} A${r} ${r} 0 1 0 ${x + r * 0.3} ${y + r} A${r * 0.75} ${r * 0.75} 0 1 1 ${x + r * 0.3} ${y - r} Z`, '#f6e08a', C.ink, 1.2);
const phoneS = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-6, -11, 12, 22, C.dark, 2.5, C.ink, 1.2), rect(-4.5, -8, 9, 14, '#bfe3f5', 1, null));
const envelope = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-12, -8, 24, 16, C.white, 2, C.ink, 1.4), path('M-12 -8 L0 2 L12 -8', 'none', C.ink, 1.2));
const passport = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-7, -10, 14, 20, '#8a2a3a', 1.5, C.ink, 1.2), circle(0, -2, 3.4, 'none', C.gold, 1), line('M-3 5 L3 5', C.gold, 1));
const book = (x: number, y: number, s = 1, col: string = C.navy) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -6 C-4 -9 -9 -9 -12 -7 L-12 7 C-9 5 -4 5 0 8 C4 5 9 5 12 7 L12 -7 C9 -9 4 -9 0 -6 Z', C.white, C.ink, 1.3), path('M0 -6 L0 8', 'none', col, 1.6), line('M-9 -3 L-3 -2 M-9 0 L-3 1 M3 -2 L9 -3 M3 1 L9 0', C.grey, 0.8));
/** A shelf of book spines between x1 and x2 at base y. */
const shelf = (x1: number, x2: number, y: number, seed = 0) => {
  const cols = [RED, C.navy, C.green, C.yellow, C.purple, C.orange, C.denim, C.brown];
  const out: Svg[] = [rect(x1 - 1, y, x2 - x1 + 2, 3, C.brown, 0.5, C.ink, 1)];
  let x = x1, i = seed;
  while (x < x2 - 3) { const w = 3 + ((i * 7) % 3), h = 10 + ((i * 5) % 5); out.push(rect(x, y - h, w, h, cols[i % cols.length]!, 0.4, C.ink, 0.7)); x += w + 0.6; i++; }
  return all(...out);
};
const bookcase = (x: number, y: number, w: number, rows: number, seed = 0) => all(rect(x - 2, y - rows * 16 - 2, w + 4, rows * 16 + 4, WOOD, 1, C.ink, 1.4), ...Array.from({ length: rows }, (_, r) => shelf(x, x + w, y - r * 16 - 1, seed + r * 3)));
/** Water surface with waves between x1 and x2, from y down to yb. */
const water = (x1: number, x2: number, y: number, yb: number) => all(rect(x1, y, x2 - x1, yb - y, WATER, 0, null), line(Array.from({ length: Math.floor((x2 - x1) / 12) }, (_, i) => `M${x1 + 2 + i * 12} ${y + 5} q3 -2.5 6 0`).join(' '), '#5aa7d6', 1.2));
const wave = (x: number, y: number, w = 16) => line(`M${x - w / 2} ${y} q${w / 8} -3 ${w / 4} 0 q${w / 8} 3 ${w / 4} 0 q${w / 8} -3 ${w / 4} 0 q${w / 8} 3 ${w / 4} 0`, '#5aa7d6', 1.8);
/** Hospital bed (side view, head left at x, mattress top at y). */
const hbed = (x: number, y: number, w = 56, raise = true, sheet: string = C.sky) => all(
  line(`M${x + 4} ${y + 6} L${x + 4} ${y + 22} M${x + w - 4} ${y + 6} L${x + w - 4} ${y + 22}`, C.silver, 3), line(`M${x + 4} ${y + 22} L${x + w - 4} ${y + 22}`, C.silver, 2),
  circle(x + 4, y + 25, 2.6, C.dark, C.ink, 1), circle(x + w - 4, y + 25, 2.6, C.dark, C.ink, 1),
  rect(x, y, w, 7, C.white, 2, C.ink, 1.4), raise ? path(`M${x} ${y} L${x + 4} ${y - 14} L${x + 18} ${y - 12} L${x + 18} ${y} Z`, C.white, C.ink, 1.4) : '',
  line(`M${x - 2} ${y - (raise ? 22 : 12)} L${x - 2} ${y + 8} M${x + w + 2} ${y - 8} L${x + w + 2} ${y + 8}`, C.silver, 2.4),
  line(`M${x + 24} ${y - 5} L${x + w - 6} ${y - 5}`, C.silver, 1.8), line(`M${x + 24} ${y - 5} L${x + 24} ${y} M${x + w - 6} ${y - 5} L${x + w - 6} ${y}`, C.silver, 1.4), sheet ? '' : '');
/** Patient lying in a bed (head at hx, hy), blanket to x2. */
const patient = (hx: number, hy: number, x2: number, col: string = C.sky) => all(path(`M${hx + 4} ${hy + 2} C${hx + 20} ${hy - 6} ${x2 - 8} ${hy + 4} ${x2} ${hy + 8} L${x2} ${hy + 12} L${hx + 4} ${hy + 12} Z`, col, C.ink, 1.4), circle(hx, hy, 6, C.skin, C.ink, 1.3), path(`M${hx - 6} ${hy - 1} C${hx - 6} ${hy - 8} ${hx + 5} ${hy - 9} ${hx + 6} ${hy - 3} C${hx + 2} ${hy - 6} ${hx - 2} ${hy - 5} ${hx - 6} ${hy - 1} Z`, C.hair, null), circle(hx + 2, hy - 0.5, 0.8, C.ink, null));
const ivPole = (x: number, y: number) => all(line(`M${x} ${y} L${x} ${y - 52}`, C.silver, 2), line(`M${x - 6} ${y} L${x + 6} ${y}`, C.silver, 2), path(`M${x - 4} ${y - 52} L${x + 4} ${y - 52} L${x + 4} ${y - 40} Q${x} ${y - 37} ${x - 4} ${y - 40} Z`, '#e8f6fd', C.ink, 1));
/** Seated person in a wheelchair, side view facing right; wheel centre at (x, 100). */
const wheelchair = (x: number, col: string = C.purple, grey = false) => {
  const sk = grey ? C.grey2 : C.skin, c = grey ? C.grey : col, hr = grey ? C.grey : C.hair;
  return all(circle(x, 98, 13, 'none', C.dark, 3), circle(x, 98, 13, 'none', C.ink, 0.8), circle(x, 98, 2, C.dark, null), circle(x + 18, 108, 4, C.dark, C.ink, 1),
    line(`M${x - 6} 88 L${x + 16} 88 L${x + 18} 104 M${x - 6} 88 L${x - 8} 62 L${x - 14} 60`, C.dark, 2.4),
    path(`M${x - 6} 86 L${x + 14} 86 L${x + 14} 94 L${x + 18} 106 L${x + 24} 106 L${x + 24} 110 L${x + 13} 110 L${x + 8} 94 L${x - 4} 94 Z`, C.navy, C.ink, 1.4),
    path(`M${x - 8} 64 L${x + 4} 64 L${x + 4} 88 L${x - 6} 88 Z`, c, C.ink, 1.4), line(`M${x + 2} 70 L${x + 12} 80`, sk, 4.4), circle(x + 12, 80, 2.6, sk, C.ink, 1),
    circle(x - 1, 54, 8, sk, C.ink, 1.4), path(`M${x - 9} 52 C${x - 9} 43 ${x + 7} 43 ${x + 8} 50 C${x + 2} 48 ${x - 4} 48 ${x - 9} 52 Z`, hr, null), circle(x + 3, 53, 1, C.ink, null), path(`M${x + 2} 58 Q${x + 4} 59 ${x + 6} 57.6`, 'none', C.ink, 1));
};
const wheelIcon = (x: number, y: number, s = 1, col: string = '#2f6fb5') => g(`translate(${x} ${y}) scale(${s})`, rect(-9, -9, 18, 18, col, 2, C.ink, 1), circle(-1, -5.5, 1.6, C.white, null), path('M-1 -3 L-1 2 L4 2 L6 6', 'none', C.white, 1.6), path('M-4 -0.5 A5 5 0 1 0 3 5', 'none', C.white, 1.4));
/** A generic building block with a grid of windows. */
const block = (x: number, y: number, w: number, h: number, col: string, cols: number, rows: number, lit = false) => all(rect(x, y, w, h, col, 1, C.ink, 1.8), ...Array.from({ length: cols * rows }, (_, i) => win(x + (w / cols) * ((i % cols) + 0.5), y + 8 + Math.floor(i / cols) * 14, 7, 8, lit)));
/** Counter (desk front) from x1 to x2 with top at y. */
const counter = (x1: number, x2: number, y: number, col: string = C.tan) => all(rect(x1, y, x2 - x1, 112 - y, col, 1, C.ink, 1.6), rect(x1 - 2, y - 3, x2 - x1 + 4, 4, C.brown, 1, C.ink, 1.2));
const stage = (y = 84) => all(rect(10, y, 100, 8, WOOD, 1, C.ink, 1.6), path(`M10 8 L24 8 C20 30 22 60 18 ${y} L10 ${y} Z M110 8 L96 8 C100 30 98 60 102 ${y} L110 ${y} Z`, '#b8323c', C.ink, 1.6), rect(10, 6, 100, 6, '#9c2630', 1, C.ink, 1.4));
const audience = (y = 106, n = 6, x0 = 16, dx = 18) => all(...Array.from({ length: n }, (_, i) => g(`translate(${x0 + i * dx} ${y})`, circle(0, -4, 6, C.dark, null), path('M-9 8 C-9 0 9 0 9 8 Z', C.dark, null))));
const frame = (x: number, y: number, w: number, h: number, inner: Svg, col: string = C.gold) => all(rect(x, y, w, h, col, 1, C.ink, 1.4), rect(x + 3, y + 3, w - 6, h - 6, '#fbf6e8', 0, C.ink, 0.8), inner);
const landscape = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, '#cfe9f7', 0, null), path(`M${x} ${y + h} L${x + w * 0.3} ${y + h * 0.45} L${x + w * 0.55} ${y + h * 0.75} L${x + w * 0.75} ${y + h * 0.35} L${x + w} ${y + h} Z`, C.green, C.ink, 0.8), circle(x + w * 0.8, y + h * 0.25, h * 0.12, C.yellow, null));
const plinth = (x: number, y: number, w = 20) => all(rect(x - w / 2, y, w, 112 - y, C.white, 1, C.ink, 1.4), rect(x - w / 2 - 2, y - 2, w + 4, 4, C.grey2, 1, C.ink, 1.2));
const vase = (x: number, y: number, s = 1, col: string = '#c9773a') => g(`translate(${x} ${y}) scale(${s})`, path('M-5 -18 L5 -18 L4 -14 C10 -10 10 -2 6 0 L-6 0 C-10 -2 -10 -10 -4 -14 Z', col, C.ink, 1.3), line('M-7 -8 L7 -8', C.ink, 1));
const ticket = (x: number, y: number, s = 1, col: string = C.yellow) => g(`translate(${x} ${y}) scale(${s})`, path('M-12 -7 L12 -7 L12 -3 A3 3 0 0 0 12 3 L12 7 L-12 7 L-12 3 A3 3 0 0 0 -12 -3 Z', col, C.ink, 1.3), line('M4 -6 L4 6', C.ink, 0.8, '1.5 1.5'));
const note = (x: number, y: number, s = 1, col: string = C.navy) => g(`translate(${x} ${y}) scale(${s})`, path('M0 6 L0 -10 L8 -12 L8 4', 'none', col, 2), ellipse(-2.5, 6, 3.4, 2.6, col, null), ellipse(5.5, 4, 3.4, 2.6, col, null));
const balloon = (x: number, y: number, col: string) => all(path(`M${x} ${y + 9} C${x - 2} ${y + 16} ${x + 2} ${y + 20} ${x} ${y + 26}`, 'none', C.ink, 1), ellipse(x, y, 6, 8, col, C.ink, 1.4));
const keyS = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 3, C.gold, C.ink, 1), line('M3 0 L10 0 M7 0 L7 3 M9 0 L9 2.5', C.ink, 1.4));
const fireTruck = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`,
  rect(-44, -26, 62, 26, RED, 2, C.ink, 1.8), path('M18 -26 L32 -26 L42 -12 L42 0 L18 0 Z', RED, C.ink, 1.8), path('M21 -23 L31 -23 L38 -13 L21 -13 Z', '#d8eef8', C.ink, 1.2),
  line('M-42 -32 L16 -32 M-42 -36 L16 -36', C.silver, 2.4), ...[-36, -24, -12, 0, 12].map((xx) => line(`M${xx} -36 L${xx} -32`, C.silver, 1.6)), line('M-42 -32 L-42 -26 M14 -32 L14 -26', C.dark, 1.6),
  rect(-40, -20, 12, 10, C.silver, 1, C.ink, 1), rect(-24, -20, 12, 10, C.silver, 1, C.ink, 1), rect(-8, -20, 12, 10, C.silver, 1, C.ink, 1), line('M-44 -6 L42 -6', C.white, 2),
  rect(24, -30, 8, 4, '#3a7bd5', 1, C.ink, 1), circle(-30, 2, 7, C.dark, C.ink, 1.6), circle(-30, 2, 2.6, C.grey, null), circle(28, 2, 7, C.dark, C.ink, 1.6), circle(28, 2, 2.6, C.grey, null));
const policeCar = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-40 -2 L-40 -14 C-40 -18 -36 -20 -30 -20 L-18 -20 L-8 -32 L16 -32 L28 -20 L36 -18 C40 -17 42 -14 42 -10 L42 -2 Z', C.white, C.ink, 1.8),
  path('M-14 -20 L-6 -29 L4 -29 L4 -20 Z M8 -20 L8 -29 L15 -29 L23 -20 Z', '#d8eef8', C.ink, 1.2),
  ...[-38, -26, -14, -2, 10, 22, 34].map((xx, i) => rect(xx, -14, 12, 6, i % 2 ? C.yellow : '#2f5fb0', 0, null)), ...[-32, -20, -8, 4, 16, 28].map((xx, i) => rect(xx, -8, 12, 5, i % 2 ? C.yellow : '#2f5fb0', 0, null)),
  path('M-40 -14 L42 -14', 'none', C.ink, 0.8), rect(-2, -37, 12, 5, '#3a7bd5', 1.5, C.ink, 1.2), line('M0 -40 L-3 -44 M8 -40 L11 -44 M4 -40 L4 -45', '#3a7bd5', 1.4),
  circle(-24, 0, 7, C.dark, C.ink, 1.6), circle(-24, 0, 2.6, C.grey, null), circle(26, 0, 7, C.dark, C.ink, 1.6), circle(26, 0, 2.6, C.grey, null));
/** Firefighter helmet + jacket on a standing figure (local coordinates of `on`). */
const fireGear = all(path('M-14.5 -42 L14.5 -42 L13 2 L-13 2 Z', '#3d3f4a', C.ink, 1.6), line('M-13 -16 L13 -16 M-13 -6 L13 -6', C.reflex, 3), line('M-13 -16 L13 -16 M-13 -6 L13 -6', C.silver, 1), path('M-13 -62 C-13 -76 13 -76 13 -62 L17 -60 L-17 -60 Z', C.yellow, C.ink, 1.6), line('M0 -74 L0 -61', C.ink, 1));
/** Swimmer head with cap and goggles, seen from the front (centre x, y). */
const swimHead = (x: number, y: number, s = 1, cap: string = C.red) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 10, C.skin, C.ink, 1.6), path('M-10.5 -1 C-11 -15 11 -15 10.5 -1 C6 -4 -6 -4 -10.5 -1 Z', cap, C.ink, 1.4), circle(-4, 1.5, 3, '#5aa7d6', C.ink, 1.2), circle(4, 1.5, 3, '#5aa7d6', C.ink, 1.2), line('M-1 1.5 L1 1.5 M-7 1.5 L-10 0 M7 1.5 L10 0', C.ink, 1.2), path('M-3 6 Q0 8 3 6', 'none', C.ink, 1.1));
/** Pool basin: rim and water between x1 and x2 with top at y. */
const pool = (x1: number, x2: number, y: number, yb = 110, lanes = 0) => all(rect(x1 - 4, y - 3, x2 - x1 + 8, yb - y + 5, C.white, 2, C.ink, 1.6), water(x1, x2, y + 1, yb), ...Array.from({ length: lanes }, (_, i) => { const ly = y + 4 + ((yb - y - 4) / (lanes + 1)) * (i + 1); return line(`M${x1} ${f1(ly)} L${x2} ${f1(ly)}`, RED, 2, '3 3'); }));

const shieldBadgeL = path('M6 -34 L12 -32 C12 -26 10 -24 9 -23 C8 -24 6 -26 6 -32 Z', C.gold, C.ink, 0.8);

export const PUBLIC_BUILDING_MOTIFS: Record<string, Svg> = {
  // ── 1711 Stadshus och myndighetskontor ─────────────────────────────
  'offb.stadshus': all(ground, rect(4, 88, 112, 24, '#e8e2d4', 0, null),
    block(10, 54, 100, 42, BRICK, 6, 2), rect(48, 14, 24, 42, BRICK, 0, C.ink, 1.8), path('M46 14 L60 2 L74 14 Z', C.green, C.ink, 1.6), clock(60, 26, 6, 10, 10),
    win(55, 44, 5, 8), win(65, 44, 5, 8), rect(50, 80, 20, 16, C.brown, 6, C.ink, 1.6), line('M60 80 L60 96', C.ink, 1), flagSE(10, 54, 0.9), flagSE(102, 54, 0.9),
    fig(24, C.orange, 'smile', { h: 0.36 }), fig(92, C.denim, 'smile', { h: 0.36, hairStyle: 'long' })),
  'offb.myndighet': all(ground, line('M60 46 L26 76 M60 46 L94 76', C.grey, 1.6, '3 2'),
    block(38, 14, 44, 44, '#d9dde3', 3, 2), agencyBadge(60, 24, 1.3), office(24, 1), office(96, 1),
    counter(40, 80, 98), mini(60, 90, C.navy, 'smile', 0.9), rect(64, 92, 12, 7, C.white, 1, C.ink, 1), circle(73, 95, 2.4, 'none', RED, 1.2)),
  'offb.myndighetskontor': all(rect(4, 8, 112, 104, '#eef0f2', 0, null), stateHouse(60, 30, 0.8),
    counter(6, 114, 76), rect(8, 40, 50, 36, '#e6f4fb', 0, C.ink, 1.2), rect(62, 40, 50, 36, '#e6f4fb', 0, C.ink, 1.2), mini(33, 62, C.navy, 'smile', 1.1), mini(87, 62, C.green, 'smile', 1.1, true),
    rect(24, 34, 18, 9, C.black, 2, C.ink, 1), rect(78, 34, 18, 9, C.black, 2, C.ink, 1),
    `<text x="33" y="41.5" font-family="ui-monospace,monospace" font-weight="700" font-size="7" text-anchor="middle" fill="#7ef0a0">14</text><text x="87" y="41.5" font-family="ui-monospace,monospace" font-weight="700" font-size="7" text-anchor="middle" fill="#7ef0a0">15</text>`,
    rect(26, 74, 14, 3, C.white, 0.5, C.ink, 0.8)),
  'offb.sessionssal': all(rect(4, 8, 112, 104, '#efe6d6', 0, null), rect(36, 12, 48, 18, C.white, 2, C.ink, 1.4), kommun(60, 21, 7),
    rect(42, 36, 36, 10, C.brown, 1.5, C.ink, 1.4), mini(52, 32, C.navy, 'smile', 0.7), mini(68, 32, C.dark, 'smile', 0.7, true), rect(42, 40, 36, 6, C.brown, 1, C.ink, 1.2),
    path('M8 74 Q60 50 112 74 L112 82 Q60 58 8 82 Z', WOOD, C.ink, 1.4), path('M8 98 Q60 74 112 98 L112 106 Q60 82 8 106 Z', WOOD, C.ink, 1.4),
    ...[[18, 68], [34, 62], [52, 58], [70, 58], [88, 62], [104, 68]].map(([x, y], i) => mini(x!, y!, [C.red, C.green, C.navy, C.purple, C.orange, C.denim][i]!, 'smile', 0.62, i % 2 === 1)),
    ...[[16, 92], [36, 86], [56, 82], [76, 83], [96, 88]].map(([x, y], i) => mini(x!, y!, [C.yellow, C.dark, C.green, C.red, C.navy][i]!, 'smile', 0.62, i % 2 === 0))),
  'offb.personligt-besök': all(rect(4, 8, 112, 104, '#eef0f2', 0, null), counter(56, 114, 76), mini(88, 62, C.green, 'smile', 1.2, true),
    fig(34, C.orange, 'smile', { h: 0.92 }), say(60, 26, 22, 14, 44, 30, all(circle(55, 26, 1.6, C.ink, null), circle(60, 26, 1.6, C.ink, null), circle(65, 26, 1.6, C.ink, null))), say(96, 26, 20, 14, 92, 42, path('M91 26 l3 3 l6 -6', 'none', C.green, 2)),
    greyed(phoneS(12, 22, 0.9), envelope(14, 48, 0.7)), cross(13, 34, 9)),
  'offb.kontorstid': all(ground, block(24, 46, 72, 66, '#d9dde3', 4, 3, true), rect(52, 94, 16, 18, C.brown, 1, C.ink, 1.4), stateHouse(60, 40, 0.7),
    clock(22, 24, 13, 12, 0, { shade: [8 * 30, 16 * 30], shadeCol: 'rgba(79,157,105,0.4)' }), sunS(100, 22, 7), greyed(moon(104, 52, 5))),

  // ── 1712 Sjukhus och vårdcentraler ────────────────────────────────
  'offb.sjukhus': all(ground, block(8, 30, 104, 82, C.white, 7, 4), rect(44, 14, 32, 18, C.white, 1, C.ink, 1.8), redCross(60, 23, 7), rect(46, 90, 28, 22, '#bfe3f5', 1, C.ink, 1.6), line('M60 90 L60 112', C.ink, 1),
    rect(6, 84, 32, 4, C.white, 0, null), path('M14 100 L14 90 L30 90 L36 98 L36 106 L14 106 Z', C.white, C.ink, 1.4), rect(15, 92, 4, 4, RED, 0, null), line('M14 98 L36 98', RED, 2), circle(19, 107, 3, C.dark, null), circle(32, 107, 3, C.dark, null), rect(20, 87, 5, 3, '#3a7bd5', 1, C.ink, 0.8)),
  'offb.universitetssjukhus': all(ground, block(4, 40, 70, 72, C.white, 5, 4), block(78, 22, 38, 90, C.white, 2, 6), redCross(39, 30, 8), rect(28, 92, 22, 20, '#bfe3f5', 1, C.ink, 1.6),
    all(path('M84 10 L97 4 L110 10 L97 16 Z', C.navy, C.ink, 1.2), path('M90 12.5 L90 17 C94 20 100 20 104 17 L104 12.5', C.navy, C.ink, 1.2), line('M108 10 L108 18', C.gold, 1.4))),
  'offb.vårdavdelning': all(rect(4, 8, 112, 104, '#eef3f5', 0, null), line('M4 62 L116 62', C.ink, 1.6), line('M40 8 L40 62 M80 8 L80 62', C.ink, 1.6),
    hbed(8, 44, 28, false), patient(14, 38, 34), hbed(46, 44, 28, false), patient(52, 38, 72, C.mint), hbed(86, 44, 26, false), patient(92, 38, 110, C.pink),
    rect(4, 62, 112, 50, '#f4f1ea', 0, null), line('M4 62 L116 62', C.ink, 1.6), counter(60, 112, 92, C.white), redCross(86, 100, 5),
    fig(30, C.white, 'smile', { h: 0.62, hairStyle: 'long' }), on(30, 0.62, all(circle(-6, -30, 5, C.white, C.ink, 1), rect(-7.1, -33.6, 2.2, 7.2, RED, 0.3, null), rect(-9.6, -31.1, 7.2, 2.2, RED, 0.3, null)))),
  'offb.korridor': all(rect(4, 8, 112, 104, '#eef0f2', 0, null), path('M4 8 L46 46 L46 74 L4 112 Z', '#dfe3e8', C.ink, 1.4), path('M116 8 L74 46 L74 74 L116 112 Z', '#dfe3e8', C.ink, 1.4),
    path('M4 112 L46 74 L74 74 L116 112 Z', '#cfc6b6', C.ink, 1.4), rect(46, 46, 28, 28, '#f8f8f4', 0, C.ink, 1.4), rect(55, 54, 10, 20, C.brown, 0.5, C.ink, 1),
    path('M12 30 L24 40 L24 84 L12 94 Z', '#7fa6c9', C.ink, 1.2), path('M30 46 L37 52 L37 74 L30 80 Z', '#7fa6c9', C.ink, 1.2), path('M108 30 L96 40 L96 84 L108 94 Z', '#7fa6c9', C.ink, 1.2), path('M90 46 L83 52 L83 74 L90 80 Z', '#7fa6c9', C.ink, 1.2),
    path('M4 8 L116 8 L74 46 L46 46 Z', '#f5f5f0', C.ink, 1.4), rect(56, 20, 8, 3, '#fff3b0', 1, C.ink, 0.6), rect(55, 34, 10, 2.4, '#fff3b0', 1, C.ink, 0.6)),
  'offb.sjukhussäng': all(rect(4, 8, 112, 104, '#eef3f5', 0, null), ground, hbed(18, 66, 80, true), patient(28, 50, 92), ivPole(108, 108), line('M108 70 C104 74 100 60 92 62', '#8cc7e8', 1.2)),
  'offb.vårdplats': all(rect(4, 8, 112, 104, '#eef3f5', 0, null), line('M4 62 L116 62 M4 112 L116 112', C.grey2, 2),
    greyed(hbed(8, 30, 44, false), patient(14, 24, 50), hbed(68, 30, 44, false), patient(74, 24, 110), hbed(8, 80, 44, false), patient(14, 74, 50)),
    rect(62, 64, 54, 46, 'none', 6, C.green, 2.6), hbed(68, 80, 44, false), rect(78, 74, 16, 6, C.white, 3, C.ink, 1.2), check(100, 72, 1.3)),
  'offb.besökstid': all(rect(4, 8, 112, 104, '#eef3f5', 0, null), ground, hbed(8, 78, 60, true), patient(18, 62, 64, C.mint),
    fig(90, C.orange, 'smile', { h: 0.86 }), reach(90, 0.86, -1, 72, 64), line('M72 62 L66 48 M72 62 L72 46 M72 62 L78 48', C.green, 1.6), circle(66, 46, 3.4, C.pink, C.ink, 1), circle(72, 44, 3.4, C.red, C.ink, 1), circle(78, 46, 3.4, C.yellow, C.ink, 1),
    clock(24, 26, 13, 4, 0, { shade: [2 * 30, 7 * 30], shadeCol: 'rgba(79,157,105,0.45)' })),
  'offb.operationssal': all(rect(4, 8, 112, 104, '#e3eef0', 0, null), ellipse(60, 18, 26, 8, C.silver, C.ink, 1.6), ellipse(60, 20, 18, 4, '#fff3b0', C.ink, 1), line('M60 8 L60 10', C.ink, 2), path('M36 22 L20 76 L100 76 L84 22 Z', 'rgba(255,243,176,0.35)', null),
    rect(26, 76, 68, 6, C.white, 1, C.ink, 1.4), line('M60 82 L60 106 M48 106 L72 106', C.silver, 3), patient(34, 70, 88, '#a8dcc0'),
    ...[[18, 0.8], [102, 0.8]].map(([x, h]) => all(fig(x!, '#5fae9a', 'smile', { h: h!, bottom: '#5fae9a' }), on(x!, h!, all(path('M-10 -60 C-10 -70 10 -70 10 -60 Z', '#5fae9a', C.ink, 1.2), rect(-7, -55, 14, 7, C.white, 2, C.ink, 1))))),
    reach(18, 0.8, 1, 38, 66), reach(102, 0.8, -1, 82, 66)),
  'offb.intensivvård': all(rect(4, 8, 112, 104, '#e8eef2', 0, null), ground, hbed(10, 78, 64, true), patient(20, 62, 70),
    path('M24 64 C30 54 40 50 48 48', 'none', '#8cc7e8', 2.4), rect(46, 38, 12, 16, C.silver, 2, C.ink, 1.2),
    rect(80, 20, 32, 24, C.dark, 3, C.ink, 1.6), line('M83 34 L90 34 L93 26 L96 40 L99 30 L101 34 L109 34', '#7ef0a0', 1.6), rect(84, 48, 26, 18, C.silver, 2, C.ink, 1.4), circle(91, 57, 3, C.green, C.ink, 1), circle(101, 57, 3, RED, C.ink, 1),
    line('M96 66 L96 110 M86 110 L106 110', C.silver, 2.4), ivPole(76, 110), line('M80 44 C70 50 60 56 52 64', C.grey, 1)),
  'offb.förlossningsavdelning': all(rect(4, 8, 112, 104, '#f6eef2', 0, null), ground, hbed(8, 80, 66, true), patient(18, 64, 70, C.pink),
    all(ellipse(42, 64, 12, 7, C.white, C.ink, 1.4), circle(34, 60, 5.4, C.skin, C.ink, 1.2), path('M29.5 58 C30 53 38 53 38.5 58 C36 56 32 56 29.5 58 Z', C.hair, null), path('M32 62 Q34 63.4 36 62', 'none', C.ink, 0.9)), line('M24 70 L36 68', C.skin, 3.4),
    fig(98, C.white, 'smile', { h: 0.84, hairStyle: 'long' }), on(98, 0.84, all(circle(-6, -30, 5, C.white, C.ink, 1), rect(-7.1, -33.6, 2.2, 7.2, RED, 0.3, null), rect(-9.6, -31.1, 7.2, 2.2, RED, 0.3, null))),
    path('M76 96 L92 96 L90 106 L78 106 Z', '#e8f6fd', C.ink, 1.2), line('M80 106 L80 111 M88 106 L88 111', C.silver, 1.6), heartPink(60, 34)),

  // ── 1713 Skolor och bibliotek ─────────────────────────────────────
  'offb.skolbyggnad': all(ground, rect(4, 92, 112, 20, '#e7e1d2', 0, null), block(10, 46, 100, 50, OCHRE, 6, 2), path('M6 48 L60 20 L114 48 Z', RED, C.ink, 1.8), clock(60, 36, 7, 8, 0),
    rect(52, 78, 16, 18, C.brown, 1, C.ink, 1.6), line('M60 78 L60 96', C.ink, 1), tree(104, 112, 0.8), line('M20 112 L20 98 L32 98 L32 112 M20 98 L16 106 M32 98 L36 106', C.grey, 1.6)),
  'offb.gymnastiksal': all(rect(4, 8, 112, 104, '#f2ead8', 0, null), rect(4, 96, 112, 16, '#e3c58e', 0, null), line('M4 96 L116 96', C.ink, 1.4),
    rect(8, 20, 30, 74, 'none', 0, WOOD, 3), ...[28, 38, 48, 58, 68, 78, 88].map((y) => line(`M8 ${y} L38 ${y}`, WOOD, 2.4)), line('M8 20 L8 96 M38 20 L38 96', C.brown, 2),
    line('M60 10 L60 76', '#c9a26b', 3), line('M60 10 L60 76', C.ink, 0.6), rect(48, 84, 28, 6, WOOD, 1, C.ink, 1.2), line('M52 90 L52 96 M72 90 L72 96', C.brown, 2),
    rect(84, 30, 28, 4, C.silver, 1, C.ink, 1), circle(98, 80, 6, C.orange, C.ink, 1.4), fig(96, C.red, 'laugh', { h: 0.5 }), reach(96, 0.5, 1, 104, 68), fig(66, C.denim, 'smile', { h: 0.5, hairStyle: 'long' })),
  'offb.skolbibliotek': all(rect(4, 8, 112, 104, '#f3ecdc', 0, null), bookcase(8, 92, 44, 4, 1), rect(60, 14, 26, 18, OCHRE, 1, C.ink, 1.2), path('M58 15 L73 6 L88 15 Z', RED, C.ink, 1.2), clock(73, 22, 3.6, 8, 0),
    rect(56, 86, 58, 5, WOOD, 1, C.ink, 1.4), line('M60 91 L60 112 M110 91 L110 112', C.brown, 2.4), mini(72, 74, C.orange, 'smile', 0.85), mini(98, 74, C.green, 'smile', 0.85, true), book(72, 84, 0.6, RED), book(98, 84, 0.6, C.navy)),
  'offb.folkbibliotek': all(ground, block(18, 40, 84, 72, '#d8d4c8', 5, 2), rect(18, 28, 84, 14, '#b9b2a2', 1, C.ink, 1.6), book(60, 35, 0.8, RED), kommun(94, 35, 5),
    rect(48, 84, 24, 28, '#bfe3f5', 1, C.ink, 1.6), line('M60 84 L60 112', C.ink, 1), fig(32, C.orange, 'smile', { h: 0.62, hairStyle: 'long' }), fig(88, C.navy, 'smile', { h: 0.88 }), fig(76, C.yellow, 'smile', { h: 0.4 })),
  'offb.bokbuss': all(ground, path('M4 112 L4 92 C30 86 80 88 116 92 L116 112 Z', '#b8dca0', null), tree(14, 96, 0.7),
    rect(24, 52, 88, 46, '#3f8fc0', 6, C.ink, 1.8), rect(30, 58, 26, 18, '#d8eef8', 2, C.ink, 1.2), rect(88, 58, 18, 18, '#d8eef8', 2, C.ink, 1.2), rect(62, 58, 20, 38, '#d8eef8', 2, C.ink, 1.4),
    shelf(64, 80, 68, 2), shelf(64, 80, 82, 5), book(43, 88, 0.8, RED), book(98, 88, 0.7, C.green), circle(42, 100, 7, C.dark, C.ink, 1.6), circle(96, 100, 7, C.dark, C.ink, 1.6),
    fig(54, C.purple, 'smile', { h: 0.52, hairStyle: 'long' })),
  'offb.skönlitteratur': all(book(60, 92, 3, RED), line('M38 66 C30 48 34 30 46 22', C.purple, 1.6, '3 3'), line('M82 66 C92 50 90 30 78 22', C.purple, 1.6, '3 3'),
    all(rect(26, 16, 22, 22, '#c7b3e6', 1, C.ink, 1.4), path('M24 16 L28 8 L32 16 L37 8 L42 16 L46 8 L50 16', 'none', C.ink, 1.4), rect(33, 28, 8, 10, C.brown, 4, C.ink, 1)),
    all(path('M70 30 C74 18 92 16 98 24 C104 20 110 28 104 32 L96 34 L92 40 L84 34 C76 36 70 34 70 30 Z', C.green, C.ink, 1.4), circle(98, 25, 1.4, C.ink, null), path('M104 28 L112 26 L106 32', '#ef8a3c', C.ink, 1)),
    star(60, 18, 7), star(16, 48, 4), star(106, 52, 4), greyed(rect(4, 90, 22, 18, C.white, 1, C.ink, 1.2), line('M8 104 L8 98 M12 104 L12 94 M16 104 L16 100 M20 104 L20 96', C.ink, 2))),
  'offb.facklitteratur': all(book(60, 92, 3, C.navy), line('M38 66 L32 40 M60 60 L60 36 M82 66 L90 40', C.grey, 1.4, '3 2'),
    all(circle(28, 26, 12, '#bfe3f5', C.ink, 1.4), path('M20 20 C24 16 30 20 26 26 C22 30 18 26 20 20 Z M30 28 C34 26 38 30 34 34 Z', C.green, C.ink, 1)),
    all(rect(48, 12, 24, 22, C.white, 1, C.ink, 1.4), rect(52, 24, 4, 8, C.denim, 0, null), rect(58, 18, 4, 14, C.orange, 0, null), rect(64, 21, 4, 11, C.green, 0, null)),
    all(path('M84 30 C84 18 102 14 104 26 C106 34 96 38 92 34 C88 38 84 34 84 30 Z', C.green, C.ink, 1.4), line('M94 36 L94 44', C.brown, 2.4), line('M94 20 L94 32 M88 26 L94 30 M100 24 L94 28', '#2e7a4a', 1)),
    greyed(all(path('M8 104 L14 92 L20 104 Z', C.purple, C.ink, 1), star(18, 90, 3)))),
  'offb.barnavdelning.2': all(rect(4, 8, 112, 104, '#fbf1e4', 0, null), rect(4, 96, 112, 16, '#bfe0c9', 0, null),
    bookcase(8, 92, 30, 2, 0), bookcase(82, 92, 30, 2, 4), ellipse(40, 104, 14, 6, C.yellow, C.ink, 1.4), ellipse(80, 104, 14, 6, C.pink, C.ink, 1.4),
    fig(42, C.orange, 'smile', { h: 0.44 }), book(42, 86, 0.7, C.green), fig(66, C.denim, 'smile', { h: 0.5, hairStyle: 'long' }), book(66, 84, 0.7, RED), star(30, 24, 5), star(90, 20, 4), star(60, 30, 4, C.pink),
    balloon(18, 28, C.red), balloon(104, 34, C.sky)),

  // ── 1714 Polisstation och brandstation ────────────────────────────
  'offb.polisbil': all(ground, line('M8 100 L112 100', C.grey2, 1, '6 6'), policeCar(60, 98, 1.12)),
  'offb.passexpedition': all(rect(4, 8, 112, 104, '#eef0f2', 0, null), counter(6, 114, 80), rect(60, 22, 50, 42, C.white, 1, C.ink, 1.2),
    fig(28, C.orange, 'smile', { h: 0.95 }), all(rect(70, 46, 18, 12, C.dark, 2, C.ink, 1.2), circle(79, 52, 4, '#5a6c80', C.ink, 1), line('M79 58 L79 78 M72 78 L86 78', C.ink, 1.6)),
    mini(100, 66, C.navy, 'smile', 1), shieldBadge(100, 32), passport(48, 74, 0.8), line('M40 34 L66 46', C.yellow, 1, '2 2')),
  'offb.brandman': all(ground, fig(46, '#3d3f4a', 'smile', { h: 1, bottom: '#3d3f4a' }), on(46, 1, fireGear), reach(46, 1, 1, 74, 70),
    path('M66 72 C70 78 76 76 80 68 L86 62', 'none', C.dark, 5), rect(84, 56, 10, 8, C.silver, 1, C.ink, 1.2), path('M94 60 C102 56 108 62 112 70 M94 60 C104 62 106 70 108 78 M94 62 C102 68 102 76 102 84', 'none', '#5aa7d6', 2.4),
    path('M20 112 C14 104 26 98 22 88 C30 94 34 104 28 112 Z', C.orange, C.ink, 1.2)),
  'offb.brandbil': all(ground, fireTruck(60, 102, 1.15)),
  'offb.brandstation': all(ground, rect(6, 30, 84, 82, BRICK, 1, C.ink, 1.8), rect(92, 10, 22, 102, BRICK, 1, C.ink, 1.8), win(103, 22, 8, 10), win(103, 44, 8, 10), line('M103 60 L103 100', C.dark, 2.4),
    rect(12, 58, 34, 54, '#3d3f4a', 1, C.ink, 1.6), rect(50, 58, 34, 54, '#3d3f4a', 1, C.ink, 1.6), g('translate(2 0)', fireTruck(27, 108, 0.42)), g('translate(2 0)', fireTruck(65, 108, 0.42)),
    win(24, 42, 10, 8), win(48, 42, 10, 8), win(72, 42, 10, 8), rect(40, 34, 16, 4, RED, 1, C.ink, 1)),
  'offb.brandslang': all(ground, ellipse(26, 98, 18, 12, '#c9a66b', C.ink, 1.6), ellipse(26, 98, 12, 8, 'none', C.ink, 1.2), ellipse(26, 98, 6, 4, '#c9a66b', C.ink, 1.2),
    path('M42 100 C60 108 70 96 80 86 L92 74', 'none', C.ink, 7.4), path('M42 100 C60 108 70 96 80 86 L92 74', 'none', '#e6c98a', 5), rect(90, 66, 12, 10, C.silver, 2, C.ink, 1.2),
    path('M100 66 C104 50 110 40 116 34 M100 66 C98 50 96 38 98 26 M100 66 C108 58 114 56 118 56', 'none', '#5aa7d6', 2.4)),

  // ── 1715 Idrottshall och simhall ──────────────────────────────────
  'offb.idrottshall': all(rect(4, 8, 112, 104, '#eef0f2', 0, null), path('M4 30 L60 12 L116 30', 'none', C.ink, 1.6), line('M20 25 L20 8 M40 18.5 L40 8 M80 18.5 L80 8 M100 25 L100 8', C.grey2, 1.4),
    rect(4, 74, 112, 38, '#e7c48e', 0, null), line('M4 74 L116 74', C.ink, 1.4), ellipse(60, 92, 14, 6, 'none', RED, 1.6), line('M60 76 L60 110', RED, 1.6), rect(6, 84, 6, 16, 'none', 0, C.white, 2), rect(108, 84, 6, 16, 'none', 0, C.white, 2),
    rect(4, 40, 112, 30, '#c9ced4', 0, C.ink, 1.2), ...Array.from({ length: 12 }, (_, i) => circle(10 + i * 9, 50 + (i % 2) * 8, 3.4, [C.red, C.navy, C.yellow, C.green][i % 4]!, C.ink, 0.8)),
    fig(40, C.yellow, 'smile', { h: 0.42 }), fig(80, C.red, 'smile', { h: 0.42 }), circle(60, 104, 3, C.white, C.ink, 1)),
  'offb.innebandy': all(ground, rect(4, 92, 112, 20, '#e7c48e', 0, null), line('M4 112 L116 112', C.ink, 1.2),
    fig(36, C.yellow, 'laugh', { h: 0.82 }), reach(36, 0.82, 1, 56, 86), line('M50 68 L64 104 L72 104', C.ink, 4.6), line('M50 68 L64 104 L72 104', C.white, 3),
    circle(82, 104, 4.2, C.white, C.ink, 1.3), circle(80.6, 102.8, 0.9, C.ink, null), circle(83.4, 102.8, 0.9, C.ink, null), circle(82, 105.6, 0.9, C.ink, null),
    rect(94, 84, 22, 22, 'none', 1, RED, 2.6), line('M94 92 L116 92 M94 100 L116 100 M101 84 L101 106 M108 84 L108 106', C.grey2, 0.8)),
  'offb.simhall': all(ground, rect(6, 34, 108, 78, '#d9e6ee', 2, C.ink, 1.8), path('M4 36 Q60 4 116 36 Z', '#b8cbd8', C.ink, 1.8), rect(14, 46, 92, 42, '#e6f4fb', 1, C.ink, 1.4),
    line('M37 46 L37 88 M60 46 L60 88 M83 46 L83 88', C.ink, 1.2), water(15, 105, 70, 87), all(circle(46, 74, 3.4, C.skin, C.ink, 1), line('M38 76 L44 74 M48 74 L54 72', C.skin, 2.4)), swimHead(80, 74, 0.4),
    rect(50, 92, 20, 20, '#bfe3f5', 1, C.ink, 1.6), wave(30, 100, 20), wave(90, 100, 20)),
  'offb.bassäng': all(rect(4, 8, 112, 104, '#e6eef2', 0, null), pool(12, 108, 30, 106, 3), path('M98 24 L98 14 M106 24 L106 14 M98 16 L106 16 M98 20 L106 20', 'none', C.silver, 1.8),
    swimHead(42, 58, 0.5), line('M30 58 L36 58', C.white, 2), swimHead(78, 86, 0.5, C.yellow)),
  'offb.bastu': all(rect(4, 8, 112, 104, '#e8c08a', 0, null), ...[22, 36, 50, 64, 78, 92].map((y) => line(`M4 ${y} L116 ${y}`, '#c79a5e', 1)),
    rect(4, 66, 72, 8, WOOD, 1, C.ink, 1.4), rect(4, 90, 92, 8, WOOD, 1, C.ink, 1.4), line('M12 74 L12 90 M68 74 L68 90 M12 98 L12 112 M88 98 L88 112', C.brown, 3),
    rect(90, 60, 22, 40, C.dark, 2, C.ink, 1.6), ...[[95, 58], [101, 56], [107, 58], [98, 54], [104, 53]].map(([x, y]) => circle(x!, y!, 3, C.grey, C.ink, 1)), path('M96 46 C92 40 100 36 96 30 M104 46 C100 40 108 36 104 30', 'none', C.white, 1.6),
    fig(40, C.white, 'calm', { h: 0.62, bottom: C.white }), on(40, 0.62, path('M-13 -20 L13 -20 L13 2 L-13 2 Z', C.white, C.ink, 1.2)), path('M48 54 Q50 58 48 60 Q46 58 48 54 Z M34 52 Q36 56 34 58 Q32 56 34 52 Z', C.sky, C.ink, 0.8)),
  'offb.barnbassäng': all(rect(4, 8, 112, 104, '#e6eef2', 0, null), pool(10, 110, 80, 108), fig(40, C.navy, 'smile', { h: 0.92, bottom: C.navy }), fig(72, C.orange, 'laugh', { h: 0.42 }), water(10, 110, 92, 108), reach(40, 0.92, 1, 62, 82),
    all(ellipse(94, 90, 7, 4, C.yellow, C.ink, 1.2), circle(98, 85, 3.6, C.yellow, C.ink, 1.2), path('M101 85 L105 86 L101 87 Z', C.orange, C.ink, 0.8), circle(98.6, 84, 0.7, C.ink, null)), line('M10 94 L10 108', C.ink, 0.1)),
  'offb.hopptorn': all(rect(4, 8, 112, 104, '#e6eef2', 0, null), pool(40, 112, 80, 110), rect(12, 24, 8, 88, C.white, 1, C.ink, 1.6), rect(12, 24, 36, 5, C.white, 1, C.ink, 1.4), rect(12, 54, 30, 5, C.white, 1, C.ink, 1.4),
    line('M24 112 L24 30 M30 112 L30 30', C.silver, 1.4), ...[40, 50, 64, 74, 84, 94, 104].map((y) => line(`M24 ${y} L30 ${y}`, C.silver, 1.2)),
    g('translate(0 -36) rotate(160 70 88)', fig(70, C.red, 'laugh', { h: 0.42 })), line('M58 20 C68 18 74 30 72 44', C.grey, 1.2, '3 3'), path('M70 82 C72 76 78 76 80 82', 'none', '#5aa7d6', 1.6)),
  'offb.vattenrutschbana': all(rect(4, 8, 112, 104, '#e6eef2', 0, null), pool(66, 112, 90, 110), rect(8, 22, 10, 90, C.silver, 1, C.ink, 1.4), rect(6, 18, 22, 6, C.white, 1, C.ink, 1.4),
    path('M24 24 C60 20 70 40 40 52 C10 64 20 80 50 82 C64 83 70 88 76 96', 'none', C.ink, 12), path('M24 24 C60 20 70 40 40 52 C10 64 20 80 50 82 C64 83 70 88 76 96', 'none', C.yellow, 9),
    path('M24 24 C60 20 70 40 40 52 C10 64 20 80 50 82 C64 83 70 88 76 96', 'none', '#bfe3f5', 3), all(circle(44, 80, 4.4, C.skin, C.ink, 1.2), path('M40 77 C40 72 48 72 48 77 Z', C.hair, null), line('M48 82 L58 84', C.red, 4)), path('M80 92 C84 86 90 86 94 92', 'none', '#5aa7d6', 1.6)),
  'offb.badvakt': all(rect(4, 8, 112, 104, '#e6eef2', 0, null), pool(56, 112, 70, 110, 1), line('M18 112 L22 64 M38 112 L34 64 M18 88 L38 88', C.white, 3.2), line('M18 112 L22 64 M38 112 L34 64', C.ink, 0.8), rect(16, 62, 24, 5, C.white, 1, C.ink, 1.2),
    on(28, 0.62, ''), fig(28, RED, 'smile', { h: 0.6, bottom: RED }), g('translate(0 -28)', ''), circle(46, 88, 9, 'none', RED, 5), circle(46, 88, 9, 'none', C.white, 2.4, ), reach(28, 0.6, 1, 42, 82),
    swimHead(86, 86, 0.42, C.yellow)),
  'offb.badmössa': all(swimHead(60, 64, 3.6, C.red), line('M30 40 Q60 30 90 40', C.white, 1.4)),
  'offb.simglasögon': all(ellipse(40, 60, 18, 14, '#5aa7d6', C.ink, 2.2), ellipse(80, 60, 18, 14, '#5aa7d6', C.ink, 2.2), path('M34 52 C38 50 42 50 44 52', 'none', C.white, 2), path('M74 52 C78 50 82 50 84 52', 'none', C.white, 2),
    line('M58 60 L62 60', C.ink, 3), path('M22 60 C10 62 8 80 20 86 C40 96 80 96 100 86 C112 80 110 62 98 60', 'none', C.dark, 3)),
  'offb.simma-längder': all(rect(4, 8, 112, 104, '#e6eef2', 0, null), pool(10, 110, 40, 100, 2), swimHead(70, 70, 0.5), line('M58 70 L64 70 M76 70 L82 70', C.skin, 2.4),
    arrow(24, 58, 96, 58, C.accent, 2.4), arrow(96, 82, 24, 82, C.accent, 2.4), ...[0, 1, 2, 3].map((i) => line(`M${40 + i * 6} 18 L${40 + i * 6} 30`, C.ink, 2)), line('M38 28 L62 20', C.ink, 2), line('M72 18 L72 30 M78 18 L78 30', C.ink, 2)),

  // ── 1716 Kulturhus och museum ─────────────────────────────────────
  'offb.kulturhus': all(ground, rect(6, 26, 108, 86, '#e9e4da', 2, C.ink, 1.8), rect(6, 22, 108, 6, C.dark, 1, C.ink, 1.4),
    rect(12, 34, 30, 30, '#d8eef8', 1, C.ink, 1.2), shelf(14, 40, 48, 0), shelf(14, 40, 62, 3), rect(46, 34, 30, 30, '#d8eef8', 1, C.ink, 1.2), frame(50, 38, 22, 18, landscape(53, 41, 16, 12)),
    rect(80, 34, 30, 30, '#d8eef8', 1, C.ink, 1.2), note(90, 50, 1.1), note(102, 46, 0.8, RED), rect(12, 70, 30, 30, '#d8eef8', 1, C.ink, 1.2), all(path('M16 98 L16 84 L38 84 L38 98', 'none', '#b8323c', 3), fig(27, C.purple, 'laugh', { h: 0.3 })),
    rect(80, 70, 30, 30, '#d8eef8', 1, C.ink, 1.2), mini(88, 90, C.orange, 'smile', 0.6), mini(102, 90, C.green, 'smile', 0.6, true), cupS(95, 96), rect(50, 76, 20, 36, '#bfe3f5', 1, C.ink, 1.6), line('M60 76 L60 112', C.ink, 1)),
  'offb.museum': all(rect(4, 8, 112, 104, '#efe8da', 0, null), rect(4, 96, 112, 16, '#d8cdb8', 0, null), line('M4 96 L116 96', C.ink, 1.2),
    plinth(30, 76, 22), vase(30, 76, 1.4), frame(56, 20, 30, 24, landscape(59, 23, 24, 18)), dinoBones(92, 94),
    line('M14 98 L14 82 M46 98 L46 82', C.gold, 2), path('M14 84 Q30 92 46 84', 'none', '#b8323c', 2), fig(64, C.orange, 'smile', { h: 0.56 })),
  'offb.utställning': all(rect(4, 8, 112, 104, '#f4f2ee', 0, null), rect(4, 94, 112, 18, '#d9d4ca', 0, null), line('M4 94 L116 94', C.ink, 1.2),
    frame(10, 26, 26, 20, landscape(13, 29, 20, 14)), frame(46, 20, 28, 30, all(rect(49, 23, 22, 24, '#f6d6a8', 0, null), circle(60, 33, 5, C.skin, C.ink, 1), path('M51 47 C51 38 69 38 69 47 Z', C.navy, null))), frame(84, 26, 26, 20, all(rect(87, 29, 20, 14, C.white, 0, null), circle(93, 36, 4, RED, null), rect(98, 32, 7, 8, C.denim, 0, null))),
    fig(30, C.orange, 'smile', { h: 0.62, hairStyle: 'long' }), fig(60, C.green, 'smile', { h: 0.64 }), fig(92, C.purple, 'smile', { h: 0.6 })),
  'offb.konsthall': all(ground, rect(10, 34, 100, 78, C.white, 1, C.ink, 1.8), rect(10, 28, 100, 8, C.dark, 1, C.ink, 1.4),
    rect(18, 44, 60, 40, '#e6f4fb', 1, C.ink, 1.4), circle(36, 60, 9, RED, C.ink, 1.2), rect(48, 52, 14, 22, C.yellow, 0, C.ink, 1.2), path('M60 80 L72 60 L76 80 Z', C.denim, C.ink, 1.2),
    rect(86, 44, 16, 64, '#d64545', 1, C.ink, 1.4), circle(94, 60, 4, C.yellow, null), rect(90, 72, 8, 8, C.white, 0, null), path('M90 96 L98 86 L98 96 Z', C.navy, null), rect(28, 88, 22, 24, '#bfe3f5', 1, C.ink, 1.6), fig(64, C.navy, 'smile', { h: 0.44 })),
  'offb.samling': all(rect(10, 12, 100, 92, '#f3ead8', 3, C.ink, 2), rect(16, 18, 88, 80, '#fbf6e8', 1, C.ink, 1),
    ...Array.from({ length: 12 }, (_, i) => { const x = 28 + (i % 4) * 21, y = 32 + Math.floor(i / 4) * 24, c = [C.orange, C.sky, C.yellow, C.purple, RED, C.green][i % 6]!;
      return all(path(`M${x} ${y} C${x - 10} ${y - 10} ${x - 10} ${y + 6} ${x} ${y + 2} C${x + 10} ${y + 6} ${x + 10} ${y - 10} ${x} ${y} Z`, c, C.ink, 1), line(`M${x} ${y - 4} L${x} ${y + 6}`, C.ink, 1.2), line(`M${x - 4} ${y + 9} L${x + 4} ${y + 9}`, C.grey2, 1)); }),
    ),
  'offb.konstverk': all(rect(4, 8, 112, 104, '#f4f2ee', 0, null), path('M60 8 L40 24 L80 24 Z', 'rgba(255,243,176,0.6)', null), frame(28, 20, 64, 52, all(landscape(32, 24, 56, 44))), rect(28, 72, 64, 0, 'none', 0),
    star(98, 22, 5), star(20, 30, 4), line('M30 104 L90 104', C.grey2, 2), rect(50, 78, 20, 6, C.white, 1, C.ink, 1), fig(98, C.orange, 'love', { h: 0.5, hairStyle: 'long' })),
  'offb.skulptur': all(rect(4, 8, 112, 104, '#f4f2ee', 0, null), plinth(60, 86, 40),
    path('M48 84 C46 70 50 58 56 54 C52 48 52 36 60 34 C68 36 68 48 64 54 C70 58 76 70 72 84 Z', '#b8b4ac', C.ink, 1.8), path('M56 54 C50 50 44 44 42 36 M64 54 C70 50 76 44 78 36', 'none', '#b8b4ac', 5), path('M56 54 C50 50 44 44 42 36 M64 54 C70 50 76 44 78 36', 'none', C.ink, 0.6), circle(60, 26, 8, '#b8b4ac', C.ink, 1.8),
    fig(100, C.green, 'smile', { h: 0.56 })),
  'offb.monter': all(rect(4, 8, 112, 104, '#efe8da', 0, null), rect(24, 74, 72, 38, C.brown, 1, C.ink, 1.8), rect(24, 26, 72, 48, 'rgba(220,240,252,0.55)', 2, C.ink, 1.8), line('M30 32 L42 44 M32 46 L44 58', C.white, 1.6),
    vase(44, 72, 1.3), all(circle(66, 66, 6, 'none', C.gold, 2.2), circle(66, 60, 2.4, RED, C.ink, 0.8)), all(path('M78 72 L82 54 L86 54 L90 72 Z', '#8a8f96', C.ink, 1.2), line('M84 54 L84 46', C.brown, 2)), line('M28 112 L28 74', C.ink, 0.1)),
  'offb.guidad-visning': all(rect(4, 8, 112, 104, '#f4f2ee', 0, null), frame(56, 16, 40, 30, landscape(59, 19, 34, 24)),
    fig(28, C.green, 'smile', { h: 0.96, hairStyle: 'long' }), reach(28, 0.96, 1, 46, 30), line('M46 30 L46 10', C.ink, 1.6), path('M46 10 L58 13 L46 16 Z', C.yellow, C.ink, 1), say(16, 18, 16, 12, 22, 28, all(circle(12, 18, 1.3, C.ink, null), circle(16, 18, 1.3, C.ink, null), circle(20, 18, 1.3, C.ink, null))),
    fig(62, C.orange, 'smile', { h: 0.64 }), fig(80, C.purple, 'smile', { h: 0.66, hairStyle: 'long' }), fig(98, C.navy, 'smile', { h: 0.62 }), fig(112, C.red, 'smile', { h: 0.5, hairStyle: 'long' })),
  'offb.museibutik': all(rect(4, 8, 112, 104, '#f6efe2', 0, null), rect(8, 20, 48, 54, WOOD, 1, C.ink, 1.4), line('M8 38 L56 38 M8 56 L56 56', C.brown, 2),
    ...[14, 26, 38].map((x, i) => rect(x, 24, 9, 12, [C.sky, C.pink, C.mint][i]!, 0.5, C.ink, 0.8)), cupS(20, 52), cupS(40, 52), book(24, 68, 0.6, RED), book(44, 68, 0.6, C.navy),
    counter(60, 114, 80), mini(92, 66, C.green, 'smile', 1, true), rect(66, 72, 14, 8, C.dark, 1, C.ink, 1), vase(104, 80, 0.6), fig(30, C.orange, 'smile', { h: 0.52 })),
  'offb.fri-entré': all(rect(4, 8, 112, 104, '#f4f2ee', 0, null), ground, rect(46, 60, 10, 52, C.silver, 1, C.ink, 1.4), rect(64, 60, 10, 52, C.silver, 1, C.ink, 1.4), line('M56 74 L46 64', C.dark, 3), line('M64 74 L74 64', C.dark, 3),
    fig(60, C.orange, 'smile', { h: 0.62 }), arrow(36, 96, 84, 96, C.green, 3), coin(96, 30, 9), cross(96, 30, 12), check(26, 30, 2),
    greyed(ticket(96, 62, 0.9))),
  'offb.scen': all(rect(4, 8, 112, 104, '#2e2e36', 0, null), stage(80), rect(24, 12, 72, 68, '#47475a', 0, null), path('M40 12 L30 80 L90 80 L80 12 Z', 'rgba(255,243,176,0.35)', null),
    circle(40, 14, 4, C.yellow, C.ink, 1), circle(80, 14, 4, C.yellow, C.ink, 1), audience(108, 6, 15, 18)),
  'offb.konsert': all(rect(4, 8, 112, 104, '#2e2e36', 0, null), stage(84), rect(24, 12, 72, 72, '#47475a', 0, null),
    fig(42, C.purple, 'laugh', { h: 0.62, hairStyle: 'long' }), g('translate(0 0)', path('M28 64 C24 70 30 78 38 74 L52 60 L48 56 Z', C.brown, C.ink, 1.4)),
    fig(78, C.green, 'smile', { h: 0.62 }), line('M90 48 L90 84 M84 84 L96 84', C.ink, 1.6), circle(90, 46, 3, C.dark, C.ink, 1),
    note(60, 30, 1.1, C.yellow), note(30, 26, 0.8, C.yellow), note(96, 22, 0.8, C.yellow), audience(108, 6, 15, 18)),
  'offb.föreställning.2': all(rect(4, 8, 112, 104, '#2e2e36', 0, null), stage(80), rect(24, 12, 72, 68, '#47475a', 0, null),
    fig(46, C.red, 'laugh', { h: 0.62, hairStyle: 'long' }), reach(46, 0.62, -1, 30, 38), reach(46, 0.62, 1, 58, 40), fig(74, C.yellow, 'laugh', { h: 0.62 }), reach(74, 0.62, -1, 62, 42), reach(74, 0.62, 1, 90, 36),
    path('M36 12 L30 80 L90 80 L84 12 Z', 'rgba(255,243,176,0.25)', null), audience(108, 6, 15, 18)),

  // ── 1717 Besöka en offentlig byggnad ──────────────────────────────
  'offb.offentlig-byggnad': all(ground, block(14, 42, 92, 70, '#e0dccf', 5, 2), stateHouse(32, 32, 0.6), kommun(88, 26, 8), rect(44, 80, 32, 32, '#bfe3f5', 1, C.ink, 1.6), line('M60 80 L60 112', C.ink, 1),
    fig(22, C.orange, 'smile', { h: 0.5, hairStyle: 'long' }), fig(98, C.navy, 'smile', { h: 0.6 }), fig(110, C.yellow, 'smile', { h: 0.36 }), arrow(28, 104, 44, 104, C.green, 2.4), arrow(92, 104, 76, 104, C.green, 2.4)),
  'offb.öppet-hus': all(ground, rect(10, 30, 76, 82, BRICK, 1, C.ink, 1.8), rect(18, 52, 60, 60, '#3d3f4a', 1, C.ink, 1.6), fireTruck(48, 106, 0.6), rect(18, 46, 60, 6, C.grey, 0, C.ink, 1),
    balloon(16, 22, C.red), balloon(28, 18, C.yellow), balloon(80, 20, C.sky), fig(94, C.orange, 'laugh', { h: 0.6 }), fig(108, C.purple, 'smile', { h: 0.42, hairStyle: 'long' }),
    greyed(all(rect(92, 8, 22, 24, '#3d3f4a', 1, C.ink, 1.4), padlockS(103, 22)))),
  'offb.huvudentré': all(ground, block(4, 30, 112, 82, '#dcd6c8', 7, 3), rect(40, 66, 40, 46, '#bfe3f5', 2, C.ink, 2.2), line('M60 66 L60 112', C.ink, 1.4), rect(36, 58, 48, 8, C.dark, 1, C.ink, 1.4), path('M30 66 L36 58 L84 58 L90 66', 'none', C.ink, 1),
    rect(8, 92, 10, 20, C.brown, 1, C.ink, 1.2), rect(102, 92, 10, 20, C.brown, 1, C.ink, 1.2), star(60, 50, 5), arrow(60, 76, 60, 96, C.accent, 0), fig(60, C.orange, 'smile', { h: 0.5 })),
  'offb.ramp': all(ground, rect(70, 56, 46, 56, '#dcd6c8', 1, C.ink, 1.6), rect(88, 70, 18, 42, '#bfe3f5', 1, C.ink, 1.4),
    greyed(path('M4 112 L4 100 L12 100 L12 92 L20 92 L20 84 L28 84 L28 112 Z', C.grey, C.ink, 1.2)), path('M30 112 L70 84 L70 112 Z', '#c9ced4', C.ink, 1.6), line('M30 106 L70 78', C.silver, 2),
    g('rotate(-35 50 96)', path('M38 84 C38 76 46 74 52 76 L52 86 L62 86 L62 92 L40 92 Z', C.denim, C.ink, 1.4), line('M62 86 L68 80', C.ink, 1.8), circle(44, 95, 3, C.dark, null), circle(58, 95, 3, C.dark, null)), arrow(40, 70, 62, 55, C.green, 2.6)),
  'offb.rullstolsanpassad': all(ground, rect(52, 18, 64, 94, '#dcd6c8', 1, C.ink, 1.6), rect(70, 40, 34, 72, '#bfe3f5', 1, C.ink, 1.6), wheelIcon(87, 30, 0.9), wheelchair(40), check(20, 24, 1.6),
    ),
  'offb.entréplan': all(ground, rect(20, 10, 80, 102, '#eceae4', 1, C.ink, 1.8), line('M20 36 L100 36 M20 62 L100 62 M20 88 L100 88', C.ink, 1.4), rect(20, 88, 80, 24, '#f6e2b0', 0, C.ink, 1.8),
    ...[23, 49, 75].map((y) => all(win(36, y, 10, 10), win(60, y, 10, 10), win(84, y, 10, 10))), rect(50, 92, 20, 20, '#bfe3f5', 1, C.ink, 1.4), arrow(4, 104, 46, 104, C.accent, 2.6), fig(84, C.navy, 'smile', { h: 0.32 })),
  'offb.besökare': all(rect(4, 8, 112, 104, '#f2f0ea', 0, null), ground, rect(78, 20, 34, 92, '#e6e1d4', 1, C.ink, 1.6), rect(86, 46, 20, 66, '#bfe3f5', 1, C.ink, 1.4),
    fig(28, C.orange, 'smile', { h: 0.9 }), on(28, 0.9, rect(4, -34, 7, 8, C.yellow, 1, C.ink, 0.8)), fig(56, C.purple, 'smile', { h: 0.84, hairStyle: 'long' }), on(56, 0.84, rect(4, -34, 7, 8, C.yellow, 1, C.ink, 0.8)),
    arrow(62, 104, 84, 104, C.green, 2.6), reach(56, 0.84, 1, 72, 42), rect(68, 26, 10, 14, C.white, 1, C.ink, 1)),
  'offb.väktare': all(ground, rect(64, 14, 52, 98, '#e6e1d4', 1, C.ink, 1.6), rect(76, 40, 28, 72, '#bfe3f5', 1, C.ink, 1.4),
    fig(42, '#2b3550', 'smile', { h: 1, bottom: '#2b3550' }), on(42, 1, all(rect(-13, -40, 26, 6, '#2b3550', 0, null), shieldBadgeL, path('M-11 -64 C-11 -74 11 -74 11 -64 L14 -62 L-14 -62 Z', '#2b3550', C.ink, 1.4))),
    rect(56, 60, 6, 12, C.dark, 1, C.ink, 1), line('M58 60 L58 54', C.ink, 1.4), reach(42, 1, 1, 58, 68)),
  'offb.förvaringsskåp': all(rect(4, 8, 112, 104, '#eef0f2', 0, null), ground, ...Array.from({ length: 8 }, (_, i) => { const x = 10 + (i % 4) * 18, y = 20 + Math.floor(i / 4) * 44;
      return all(rect(x, y, 16, 42, i === 5 ? '#f2c14e' : '#7fa6c9', 1, C.ink, 1.4), circle(x + 12, y + 20, 1.6, C.dark, null), i === 5 ? '' : keyS(x + 6, y + 8, 0.6)); }),
    fig(96, C.orange, 'smile', { h: 0.84 }), reach(96, 0.84, -1, 74, 76), rect(64, 72, 12, 10, C.green, 2, C.ink, 1.2), keyS(80, 88, 0.8)),
};

// small extras used above
function heartPink(x: number, y: number): Svg { return path(`M${x} ${y + 6} C${x - 9} ${y} ${x - 6} ${y - 8} ${x} ${y - 3} C${x + 6} ${y - 8} ${x + 9} ${y} ${x} ${y + 6} Z`, C.pink, C.ink, 1.2); }
function shieldBadge(x: number, y: number): Svg { return all(path(`M${x} ${y - 10} L${x + 9} ${y - 6} C${x + 9} ${y + 3} ${x + 5} ${y + 8} ${x} ${y + 11} C${x - 5} ${y + 8} ${x - 9} ${y + 3} ${x - 9} ${y - 6} Z`, '#2f5fb0', C.ink, 1.4), star(x, y, 4, C.yellow)); }
function cupS(x: number, y: number): Svg { return all(path(`M${x - 4} ${y - 5} L${x + 4} ${y - 5} L${x + 3.4} ${y + 2} L${x - 3.4} ${y + 2} Z`, C.white, C.ink, 1), path(`M${x + 4} ${y - 3} C${x + 7} ${y - 3} ${x + 7} ${y + 1} ${x + 3.6} ${y}`, 'none', C.ink, 1)); }
function padlockS(x: number, y: number): Svg { return all(path(`M${x - 4} ${y - 2} L${x - 4} ${y - 6} C${x - 4} ${y - 11} ${x + 4} ${y - 11} ${x + 4} ${y - 6} L${x + 4} ${y - 2}`, 'none', C.ink, 2), rect(x - 6, y - 3, 12, 9, C.gold, 2, C.ink, 1.2)); }
function dinoBones(x: number, y: number): Svg {
  return all(line(`M${x - 18} ${y - 26} C${x - 8} ${y - 34} ${x + 6} ${y - 32} ${x + 12} ${y - 24} L${x + 22} ${y - 36}`, '#e8e0cc', 4), line(`M${x - 18} ${y - 26} C${x - 8} ${y - 34} ${x + 6} ${y - 32} ${x + 12} ${y - 24} L${x + 22} ${y - 36}`, C.ink, 0.8),
    ellipse(x + 24, y - 39, 5, 3.4, '#e8e0cc', C.ink, 1.2), ...[-12, -6, 0, 6].map((d) => line(`M${x + d} ${y - 30} L${x + d} ${y - 22}`, '#d6ccb4', 2)), line(`M${x - 10} ${y - 26} L${x - 14} ${y} M${x + 8} ${y - 25} L${x + 10} ${y}`, '#e8e0cc', 3), line(`M${x - 18} ${y - 26} L${x - 28} ${y - 18}`, '#e8e0cc', 3), rect(x - 24, y, 44, 2, C.grey, 0, null));
}

function agencyBadge(x: number, y: number, s = 1): Svg { return g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 7, '#2f5fb0', C.ink, 1.2), rect(-3, -4.5, 6, 9, '#8a2a3a', 1, C.white, 0.8), circle(0, -0.5, 1.6, 'none', C.gold, 0.8)); }
function office(x: number, s = 1): Svg { return g(`translate(${x} 0)`, all(rect(-14 * s, 76, 28 * s, 36, '#d9dde3', 1, C.ink, 1.6), win(-6 * s, 92, 6, 7), win(6 * s, 92, 6, 7), rect(-4, 100, 8, 12, C.brown, 1, C.ink, 1), agencyBadge(0, 82, 0.8))); }