/**
 * Historia & humaniora → Krig & militärhistoria → Tidiga moderna arméer, 2031–2037 (0.37): pikemen and
 * musketeers, artillery, uniforms and regiments, linear tactics and drill, field fortifications, the
 * battles of the 1600s and the Caroleans of Karl XII. Shared signs: our soldiers wear blue coats with
 * yellow cuffs and buff breeches (broad-brimmed hats in the 1600s, tricorns around 1700), the enemy wears
 * red; muskets are brown stocks with dark iron barrels; cannons are black iron on brown wheeled carriages;
 * gunfire is a yellow-orange flash with a white smoke cloud; battle maps are seen from above with blue
 * blocks of dots for our side and red for the enemy. The thing the word names is ringed or outlined in
 * orange; a grey copy stands beside it where a contrast helps. Digits only; no words, no national
 * symbols, no wounds, no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, star, type Svg } from './kit';
import { type Build } from './figures';
import { HL } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Colours and geometry ─────────────────────────────────────────────
const BLUE = '#2f5aa8';
const YEL = '#e8c23a';
const BUFF = '#e6d6a6';
const FOE = '#c8463a';
const WOOD = '#8a5a2e';
const IRON = '#3d3f4a';
const STEEL = '#c0c6cc';
const EARTH = '#b08a5a';
const EARTH2 = '#8d6a40';
const GRASS = '#e2ebc6';
const HILL = '#b9cf8e';
const FALU = '#a8322a';
const SNOW = '#f2f6fa';
const SMOKE = '#eceae4';
const f1 = (n: number) => +n.toFixed(1);
const ground = line('M4 112 L116 112', C.grey2, 2);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, hy: f1(ty - 56 * s), sy: f1(ty - 38 * s), sl: f1(x - 13 * s), sr: f1(x + 13 * s) }; };
/** A sleeved arm from the shoulder (side −1 = picture-left) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number, col: string = BLUE) => {
  const q = geo(x, h), sx = side < 0 ? q.sl : q.sr, w = 5 * Math.max(0.7, h);
  return all(line(`M${sx} ${q.sy} L${tx} ${ty}`, C.ink, w + 1.6), line(`M${sx} ${q.sy} L${tx} ${ty}`, col, w), circle(tx, ty, 3 * Math.max(0.6, h), C.skin, C.ink, 1.2));
};
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
const ring = (x: number, y: number, r: number) => circle(x, y, r, 'none', HL, 2.4);
const dashBox = (x: number, y: number, w: number, h: number) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="none" stroke="${HL}" stroke-width="2.2" stroke-dasharray="5 3"/>`;
const dash = (d: string, col: string = C.grey, w = 1.4, da = '3 3') => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-dasharray="${da}" stroke-linecap="round"/>`;

// ── Head wear and coats (figure coordinates) ─────────────────────────
const tricorn = (col: string = IRON) => all(path('M-9 -64 C-8 -75 8 -75 9 -64 Z', col, C.ink, 1.3), path('M-16 -62 L16 -62 L11 -71 L0 -66 L-11 -71 Z', col, C.ink, 1.4), line('M-15 -62.5 L15 -62.5', YEL, 1.2));
const hat1600 = (col: string = '#4a3a2a', plume: string = '#f3efe6') => all(path('M-8 -64 C-8 -78 8 -78 8 -64 Z', col, C.ink, 1.3), ellipse(0, -64, 17, 4, col, C.ink, 1.4), path('M4 -70 C12 -78 20 -76 22 -70 C16 -72 10 -70 6 -66 Z', plume, C.ink, 1));
const morion = () => all(path('M-9 -64 C-9 -80 9 -80 9 -64 Z', STEEL, C.ink, 1.4), path('M-16 -62 C-8 -66 8 -66 16 -62 C12 -60 -12 -60 -16 -62 Z', STEEL, C.ink, 1.3), line('M0 -79 L0 -84', C.ink, 2));
const mitre = (col: string = BLUE) => all(path('M-10 -62 L10 -62 L5 -90 C2 -92 -4 -90 -6 -86 Z', col, C.ink, 1.4), path('M-9 -63 L9 -63 L7 -72 L-7 -72 Z', YEL, C.ink, 1), circle(5, -90, 2.4, YEL, C.ink, 0.8));
const karpus = () => all(path('M-11 -60 C-11 -76 11 -76 11 -60 Z', BLUE, C.ink, 1.4), path('M-12 -60 L12 -60 L12 -55 L-12 -55 Z', YEL, C.ink, 1));
const kepi = (col: string = IRON) => path('M-10 -62 C-10 -74 10 -74 10 -62 Z', col, C.ink, 1.3);
const crownR = () => all(path('M-10 -62 L-10 -72 C-10 -84 10 -84 10 -72 L10 -62 Z', C.gold, C.ink, 1.4), ellipse(0, -62, 12, 3.4, '#f3efe6', C.ink, 1.2), circle(0, -85, 2.2, C.gold, C.ink, 0.9));
const cuffs = () => all(rect(-4, -40, 8, 34, 'none', 0, YEL, 0), line('M-3 -38 L-3 0 M3 -38 L3 0', YEL, 0.9), ...[-34, -26, -18, -10].map((y) => circle(0, y, 1.2, YEL, null)));
const sash = (col: string = C.gold) => path('M-13 -38 L13 -20 L13 -15 L-13 -33 Z', col, C.ink, 1);
const harneskL = (col: string = STEEL) => path('M-12 -41 L12 -41 C14 -28 12 -14 0 -6 C-12 -14 -14 -28 -12 -41 Z', col, C.ink, 1.4);
const bandolier = () => all(line('M-12 -40 L12 -12', '#6b4220', 2.6), ...[0, 1, 2, 3].map((i) => rect(-9 + i * 5, -36 + i * 6, 2.6, 5, '#d8c08a', 0.6, C.ink, 0.6)));
const collar = () => path('M-6 -42 L0 -36 L6 -42 Z', C.white, C.ink, 0.8);

// ── Weapons and gear (picture coordinates) ───────────────────────────
/** Musket from butt (x1,y1) to muzzle (x2,y2); bay adds a bayonet. */
const gun = (x1: number, y1: number, x2: number, y2: number, o: { bay?: boolean; grey?: boolean; w?: number } = {}) => {
  const w = o.w ?? 1, mx = f1(x1 + (x2 - x1) * 0.4), my = f1(y1 + (y2 - y1) * 0.4), bx = f1(x2 + (x2 - x1) * 0.22), by = f1(y2 + (y2 - y1) * 0.22);
  return all(line(`M${x1} ${y1} L${mx} ${my}`, C.ink, 5.6 * w), line(`M${x1} ${y1} L${mx} ${my}`, o.grey ? C.grey : WOOD, 4 * w), line(`M${mx} ${my} L${x2} ${y2}`, C.ink, 3.2 * w), line(`M${mx} ${my} L${x2} ${y2}`, o.grey ? C.grey2 : '#5a5c66', 1.8 * w),
    o.bay ? line(`M${x2} ${y2} L${bx} ${by}`, o.grey ? C.grey : STEEL, 1.8 * w) : '');
};
const pike = (x1: number, y1: number, x2: number, y2: number, grey = false) => { const a = Math.atan2(y2 - y1, x2 - x1); return all(line(`M${x1} ${y1} L${x2} ${y2}`, grey ? C.grey : WOOD, 2.2), g(`translate(${x2} ${y2}) rotate(${f1(a * 180 / Math.PI)})`, path('M-1 -2.6 L8 0 L-1 2.6 Z', grey ? C.grey2 : STEEL, C.ink, 0.8))); };
const flash = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -9 L3 -3 L10 -4 L5 1 L9 7 L2 4 L-1 10 L-2 3 L-9 5 L-4 0 L-9 -6 L-2 -3 Z', C.yellow, C.orange, 1.4));
const puff = (x: number, y: number, s = 1, col: string = SMOKE) => at(x, y, s, circle(-6, 2, 6, col, C.grey, 1), circle(3, -2, 7.5, col, C.grey, 1), circle(10, 3, 5.5, col, C.grey, 1), circle(1, 5, 6, col, null));
const ball = (x: number, y: number, r = 4, col: string = IRON) => all(circle(x, y, r, col, C.ink, 1.1), circle(f1(x - r * 0.35), f1(y - r * 0.35), f1(r * 0.25), '#8a8c96', null));
const wheel = (x: number, y: number, r = 9, col: string = WOOD) => all(circle(x, y, r, 'none', C.ink, 3.6), circle(x, y, r, 'none', col, 2.2), ...[0, 60, 120].map((d) => { const a = d * Math.PI / 180; return line(`M${f1(x - Math.cos(a) * r)} ${f1(y - Math.sin(a) * r)} L${f1(x + Math.cos(a) * r)} ${f1(y + Math.sin(a) * r)}`, col, 1.4); }), circle(x, y, 2, IRON, null));
/** Cannon on its carriage, facing right, wheels on y; o.rot raises the barrel. */
const cannon = (x: number, y: number, s = 1, o: { grey?: boolean; rot?: number; barrel?: string; carriage?: string; flip?: boolean } = {}) => {
  const bar = o.grey ? C.grey : (o.barrel ?? IRON), car = o.grey ? C.grey2 : (o.carriage ?? WOOD);
  return g(`translate(${x} ${y}) scale(${o.flip ? -s : s} ${s})`, path('M-30 0 L-26 -4 L2 -14 L6 -10 L-24 2 Z', car, C.ink, 1.4),
    g(`translate(0 -14) rotate(${-(o.rot ?? 0)})`, path('M-18 -5 L24 -3.4 L24 3.4 L-18 5 Z', bar, C.ink, 1.4), rect(22, -4.6, 3.6, 9.2, bar, 1, C.ink, 1.1), circle(-20, 0, 3, bar, C.ink, 1), line('M-6 -4.6 L-6 4.6 M8 -4 L8 4', '#5a5c66', 1)),
    wheel(0, -9, 9, car));
};
const mortar = (x: number, y: number, s = 1, grey = false) => at(x, y, s, rect(-14, -8, 28, 8, grey ? C.grey2 : WOOD, 1, C.ink, 1.4), g('translate(0 -10) rotate(-45)', path('M-8 -9 L12 -7 L12 7 L-8 9 C-14 6 -14 -6 -8 -9 Z', grey ? C.grey : IRON, C.ink, 1.4), rect(10, -8, 3.4, 16, grey ? C.grey : IRON, 1, C.ink, 1)));
const flag = (x: number, y: number, col: string = BLUE, s = 1, o: { fringe?: boolean; cross?: string } = {}) => at(x, y, s, line('M0 0 L0 -54', C.ink, 3.4), line('M0 0 L0 -54', WOOD, 2), path('M0 -52 C8 -56 16 -48 26 -52 L26 -32 C16 -28 8 -36 0 -32 Z', col, C.ink, 1.3),
  o.fringe ? line('M26 -52 L26 -32', C.gold, 2.4) : '', o.cross ? circle(13, -42, 4, o.cross, C.ink, 0.8) : '', path('M-2.6 -54 L0 -60 L2.6 -54 Z', C.gold, C.ink, 0.8));
const drum = (x: number, y: number, s = 1) => at(x, y, s, rect(-11, -9, 22, 18, FOE, 2, C.ink, 1.4), ellipse(0, -9, 11, 3.4, '#f3efe6', C.ink, 1.2), line('M-11 -5 L-4 7 L4 -5 L11 7', C.white, 1.2), rect(-11, 6, 22, 3, BLUE, 1, C.ink, 0.8));
const spadeT = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, line('M0 -40 L0 6', C.ink, 4.6), line('M0 -40 L0 6', WOOD, 3), line('M-5 -40 L5 -40', WOOD, 3), path('M-7 4 L7 4 L6 18 C3 24 -3 24 -6 18 Z', STEEL, C.ink, 1.3));
const pickT = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, line('M0 -34 L0 30', C.ink, 4.6), line('M0 -34 L0 30', WOOD, 3), path('M-24 -26 C-12 -36 12 -36 24 -26 C12 -32 -12 -32 -24 -26 Z', STEEL, C.ink, 1.4), rect(-3.4, -36, 6.8, 7, IRON, 1, C.ink, 1));
const basket = (x: number, y: number, s = 1, fill: string = EARTH) => at(x, y, s, rect(-9, -24, 18, 24, '#c9a46a', 2, C.ink, 1.3), ellipse(0, -24, 9, 2.8, fill, C.ink, 1.1), ...[-6, -2, 2, 6].map((xx) => line(`M${xx} -22 L${xx} -1`, '#8a6a3a', 1)), ...[-18, -12, -6].map((yy) => line(`M-9 ${yy} L9 ${yy}`, '#8a6a3a', 1)));
const fascine = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-30, -6, 60, 12, '#9a7a48', 6, C.ink, 1.3), ...[-3, 0, 3].map((yy) => line(`M-28 ${yy} L28 ${yy}`, '#6b4f2a', 0.9)), ...[-18, 0, 18].map((xx) => rect(xx - 1.6, -6.6, 3.2, 13.2, '#d8c08a', 1, C.ink, 0.8)));
const caltrop = (x: number, y: number, s = 1, col: string = IRON) => at(x, y, s, line('M0 0 L0 -12 M0 0 L-10 6 M0 0 L10 6 M0 0 L-3 4', C.ink, 3.4), line('M0 0 L0 -12 M0 0 L-10 6 M0 0 L10 6 M0 0 L-3 4', col, 2));
const cheval = (x: number, y: number, s = 1, grey = false) => at(x, y, s, rect(-36, -4, 72, 8, grey ? C.grey2 : WOOD, 3, C.ink, 1.3), ...[-28, -16, -4, 8, 20, 32].map((xx, i) => line(i % 2 ? `M${xx - 8} 10 L${xx + 8} -14` : `M${xx + 8} 10 L${xx - 8} -14`, grey ? C.grey : '#c9a46a', 2.4)));
const tree = (x: number, y: number, s = 1, col: string = '#5f9e58') => at(x, y, s, rect(-2, -14, 4, 14, '#7a4a20', 1, C.ink, 1), circle(0, -22, 10, col, C.ink, 1.4));
const fir = (x: number, y: number, s = 1, snow = false) => at(x, y, s, rect(-1.6, -6, 3.2, 6, '#7a4a20', 0, null), path('M0 -34 L-10 -6 L10 -6 Z', '#3f7f4a', C.ink, 1.2), snow ? path('M0 -34 L-4 -22 L4 -22 Z', SNOW, null) : '');
const torp = (x: number, y: number, s = 1, col: string = FALU) => at(x, y, s, rect(-20, -22, 40, 22, col, 0, C.ink, 1.4), path('M-24 -22 L0 -38 L24 -22 Z', IRON, C.ink, 1.4), rect(-20, -22, 3, 22, C.white, 0, null), rect(17, -22, 3, 22, C.white, 0, null), rect(-4, -14, 8, 14, '#6b4220', 1, C.ink, 1), rect(-15, -16, 7, 7, '#bfe3f5', 1, C.ink, 1), rect(8, -16, 7, 7, '#bfe3f5', 1, C.ink, 1), rect(10, -42, 4, 8, IRON, 0, C.ink, 1));
const farm = (x: number, y: number, s = 1, col: string = FALU) => at(x, y, s, rect(-12, -12, 24, 12, col, 0, C.ink, 1.2), path('M-15 -12 L0 -22 L15 -12 Z', IRON, C.ink, 1.2), rect(-3, -7, 6, 7, '#6b4220', 1, null));
const hillAt = (x: number, y: number, w: number, h: number, col: string = HILL) => path(`M${x - w / 2} ${y} C${x - w / 4} ${y - h} ${x + w / 4} ${y - h} ${x + w / 2} ${y} Z`, col, C.ink, 1.4);
const laurel = (x: number, y: number, s = 1) => at(x, y, s, ...Array.from({ length: 6 }, (_, i) => { const a = Math.PI * (0.6 + i * 0.16); return ellipse(f1(Math.cos(a) * 9), f1(Math.sin(a) * 9), 3.2, 1.6, '#5f9e58', C.ink, 0.6); }), ...Array.from({ length: 6 }, (_, i) => { const a = Math.PI * (0.4 - i * 0.16); return ellipse(f1(Math.cos(a) * 9), f1(Math.sin(a) * 9), 3.2, 1.6, '#5f9e58', C.ink, 0.6); }));
const flake = (x: number, y: number, s = 1) => at(x, y, s, line('M0 -4 L0 4 M-3.5 -2 L3.5 2 M-3.5 2 L3.5 -2', '#5aa7d6', 1.2));
const sound = (x: number, y: number, s = 1, col: string = C.grey) => at(x, y, s, path('M0 -6 C4 -3 4 3 0 6 M5 -10 C11 -4 11 4 5 10', 'none', col, 1.6));
const fortWall = (x: number, y: number, w: number, h: number, col: string = '#d8cfbd') => all(rect(x, y - h, w, h, col, 0, C.ink, 1.4), ...Array.from({ length: Math.floor(w / 10) }, (_, i) => rect(x + i * 10, y - h - 5, 6, 5, col, 0, C.ink, 1.2)));
const house = (x: number, y: number, s = 1, col: string = '#e8d8b8') => at(x, y, s, rect(-10, -14, 20, 14, col, 0, C.ink, 1.2), path('M-12 -14 L0 -24 L12 -14 Z', FALU, C.ink, 1.2), rect(-3, -7, 5, 7, '#6b4220', 0, null));
const say = (cx: number, cy: number, w: number, h: number, tx: number, ty: number, inner: Svg = '') => {
  const L = cx - w / 2, R = cx + w / 2, Tp = cy - h / 2, B = cy + h / 2; let a: number[], b: number[];
  if (tx < L || tx > R) { const e = tx < L ? L : R, by = Math.max(Tp + 5, Math.min(B - 5, ty)); a = [e, by - 4]; b = [e, by + 4]; }
  else { const e = ty > cy ? B : Tp, bx = Math.max(L + 6, Math.min(R - 6, tx)); a = [bx - 4, e]; b = [bx + 4, e]; }
  return all(path(`M${a[0]} ${a[1]} L${tx} ${ty} L${b[0]} ${b[1]} Z`, C.white, C.ink, 1.4), rect(L, Tp, w, h, C.white, 5, C.ink, 1.4), path(`M${a[0]} ${a[1]} L${tx} ${ty} L${b[0]} ${b[1]} Z`, C.white, null), inner);
};
const bang = (x: number, y: number, s = 1) => at(x, y, s, rect(-1.6, -8, 3.2, 10, C.ink, 1, null), circle(0, 6, 1.8, C.ink, null));

// ── People ───────────────────────────────────────────────────────────
const fig = (x: number, top: string, mood: Mood = 'calm', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** A soldier: coat colour, head wear and extra figure-coordinate drawings in front. */
const soldier = (x: number, h = 1, coat: string = BLUE, head: Svg = tricorn(), mood: Mood = 'calm', extra: Svg = '', more: Partial<Build> = {}) => all(fig(x, coat, mood, { h, bottom: BUFF, ...more }), on(x, h, head, extra));
const karo = (x: number, h = 1, mood: Mood = 'calm', head: Svg = tricorn(), extra: Svg = '') => soldier(x, h, BLUE, head, mood, all(cuffs(), extra));
/** Soldier aiming a musket to the right (o.bay = bayonet). */
const aimer = (x: number, h = 1, coat: string = BLUE, head: Svg = tricorn(), o: { bay?: boolean; mood?: Mood; fire?: boolean } = {}) => {
  const q = geo(x, h), y = q.sy + 4 * h, len = 46 * h;
  return all(soldier(x, h, coat, head, o.mood ?? 'angry', coat === BLUE ? cuffs() : ''), gun(x + 6 * h, y + 3 * h, x + len, y - 2 * h, { bay: o.bay, w: Math.max(0.7, h) }), reach(x, h, 1, f1(x + 12 * h), f1(y + 5 * h), coat), reach(x, h, -1, f1(x + 24 * h), f1(y + 2 * h), coat),
    o.fire ? all(flash(f1(x + len + 6 * h), f1(y - 2 * h), h), puff(f1(x + len + 16 * h), f1(y - 8 * h), 0.8 * h)) : '');
};
/** Soldier holding a musket upright at his right side. */
const shoulder = (x: number, h = 1, coat: string = BLUE, head: Svg = tricorn(), mood: Mood = 'calm', bay = false, extra: Svg = '') => {
  const q = geo(x, h);
  return all(soldier(x, h, coat, head, mood, all(coat === BLUE ? cuffs() : '', extra)), gun(x + 17 * h, 110, x + 17 * h, f1(q.hy - 8 * h), { bay, w: Math.max(0.7, h) }), reach(x, h, 1, f1(x + 17 * h), f1(q.sy + 22 * h), coat));
};
/** Pikeman with helmet, breastplate and a pike upright at his right side. */
const pikeman = (x: number, h = 1, grey = false) => { const q = geo(x, h); return grey ? greyed(soldier(x, h, C.grey, morion(), 'calm', harneskL()), pike(x + 16 * h, 110, x + 16 * h, 4, true)) : all(soldier(x, h, '#7a5236', morion(), 'calm', harneskL()), pike(x + 16 * h, 110, x + 16 * h, 4), reach(x, h, 1, f1(x + 16 * h), f1(q.sy + 18 * h), '#7a5236')); };
/** Small side-view head-and-shoulders soldier (x,y = head centre), facing right. */
const sol = (x: number, y: number, col: string, s = 1, o: { gun?: boolean; grey?: boolean; flip?: boolean; hat?: string; up?: boolean } = {}) => {
  const c = o.grey ? C.grey : col, sk = o.grey ? C.grey2 : C.skin, ht = o.grey ? C.grey : (o.hat ?? IRON);
  return g(`translate(${x} ${y}) scale(${o.flip ? -s : s} ${s})`,
    o.gun ? (o.up ? all(line('M7 16 L7 -22', C.ink, 3), line('M7 16 L7 -22', o.grey ? C.grey2 : '#5a5c66', 1.6)) : all(line('M0 6 L22 4', C.ink, 3.4), line('M0 6 L22 4', o.grey ? C.grey2 : '#5a5c66', 1.8))) : '',
    path('M-9 16 C-9 5 9 5 9 16 Z', c, C.ink, 1.3), circle(0, -1, 6.2, sk, C.ink, 1.3), circle(2.8, -1.6, 0.9, C.ink, null),
    path('M-10 -5 L10 -5 L7 -10 L0 -8 L-7 -10 Z', ht, C.ink, 1));
};
const row = (x: number, y: number, n: number, gap: number, col: string, s = 1, o: Parameters<typeof sol>[4] = {}) => all(...Array.from({ length: n }, (_, i) => sol(x + i * gap, y, col, s, o)));
// horse and rider (local: hooves on y = 0, facing right)
const HORSE = '#9a6438';
const horseL = (col: string = HORSE, gallop = false) => all(
  gallop ? all(line('M-14 -22 L-24 -8 M-8 -22 L-14 -4 M9 -22 L20 -10 M15 -22 L28 -16', C.ink, 5.6), line('M-14 -22 L-24 -8 M-8 -22 L-14 -4 M9 -22 L20 -10 M15 -22 L28 -16', col, 3.6))
    : all(line('M-14 -22 L-15 -1 M-7 -22 L-7 -1 M9 -22 L9 -1 M15 -22 L17 -1', C.ink, 5.6), line('M-14 -22 L-15 -1 M-7 -22 L-7 -1 M9 -22 L9 -1 M15 -22 L17 -1', col, 3.6)),
  ellipse(0, -30, 20, 10, col, C.ink, 1.6), path('M14 -36 L22 -52 C24 -56 30 -56 32 -52 L34 -46 C34 -43 31 -42 29 -44 L24 -42 L20 -28 Z', col, C.ink, 1.6),
  circle(27, -50, 1.1, C.ink, null), path('M18 -46 L21 -56 L26 -54', 'none', '#4a2e1a', 2.4), path('M-19 -32 C-27 -30 -28 -18 -25 -12', 'none', '#4a2e1a', 3));
const riderL = (coat: string = BLUE, head: Svg = '', o: { ax?: number; ay?: number } = {}) => {
  const ax = o.ax ?? 18, ay = o.ay ?? -48;
  return all(line('M-3 -40 L5 -28 L3 -16', C.ink, 6), line('M-3 -40 L5 -28 L3 -16', BUFF, 4.2), line('M3 -16 L9 -15', C.black, 3),
    path('M-7 -38 L7 -38 L6 -60 L-6 -60 Z', coat, C.ink, 1.6), rect(-2.5, -65, 5, 6, C.skin, 1.5, C.ink, 1.1), circle(0, -70, 7, C.skin, C.ink, 1.5), circle(3.2, -71, 1, C.ink, null),
    head || path('M-9 -74 L9 -74 L6 -80 L0 -77 L-6 -80 Z', IRON, C.ink, 1.1),
    line(`M3 -56 L${ax} ${ay}`, C.ink, 5.4), line(`M3 -56 L${ax} ${ay}`, coat, 3.8), circle(ax, ay, 2.6, C.skin, C.ink, 1.1));
};
const rider = (x: number, y: number, s = 1, coat: string = BLUE, more: Svg = '', o: { gallop?: boolean; col?: string; ax?: number; ay?: number; flip?: boolean; head?: Svg; grey?: boolean } = {}) =>
  o.grey ? greyed(g(`translate(${x} ${y}) scale(${o.flip ? -s : s} ${s})`, horseL(o.col, o.gallop), riderL(coat, o.head ?? '', { ax: o.ax, ay: o.ay }), more))
    : g(`translate(${x} ${y}) scale(${o.flip ? -s : s} ${s})`, horseL(o.col, o.gallop), riderL(coat, o.head ?? '', { ax: o.ax, ay: o.ay }), more);

// ── Battle maps (seen from above) ────────────────────────────────────
const field = (col: string = GRASS) => rect(4, 6, 112, 106, col, 6, C.grey2, 1.2);
const block = (x: number, y: number, w: number, h: number, col: string = BLUE, o: { hl?: boolean; grey?: boolean; dot?: string } = {}) => {
  const c = o.grey ? C.grey2 : col, cols = Math.max(1, Math.floor((w - 2) / 5)), rows = Math.max(1, Math.floor((h - 2) / 5)), dx = w / cols, dy = h / rows;
  return all(rect(x, y, w, h, c, 1.5, o.hl ? HL : C.ink, o.hl ? 2.4 : 1.1), ...Array.from({ length: rows * cols }, (_, i) => circle(f1(x + dx * (i % cols + 0.5)), f1(y + dy * (Math.floor(i / cols) + 0.5)), 1.3, o.dot ?? (o.grey ? C.grey : C.white), null)));
};
const horseHead = () => path('M-8 0 L-2 -18 C0 -22 6 -22 8 -18 L10 -12 C10 -9 7 -8 5 -10 L0 -8 L2 0 Z', HORSE, C.ink, 2.4);
const cavBlock = (x: number, y: number, w: number, h: number, col: string = BLUE, o: { hl?: boolean; grey?: boolean } = {}) => all(rect(x, y, w, h, o.grey ? C.grey2 : col, 1.5, o.hl ? HL : C.ink, o.hl ? 2.4 : 1.1),
  ...Array.from({ length: Math.max(1, Math.floor(w / 6)) }, (_, i) => ellipse(f1(x + (w / Math.max(1, Math.floor(w / 6))) * (i + 0.5)), y + h / 2, 1.4, h / 2 - 2, o.grey ? C.grey : '#f3e3c0', null)),
  at(x + w / 2, y - 1, 0.32, o.grey ? greyed(horseHead()) : horseHead()));
const gunIcon = (x: number, y: number, s = 1, col: string = IRON) => at(x, y, s, rect(-2, -7, 4, 9, col, 1, C.ink, 0.8), circle(-4, 2, 2.4, WOOD, C.ink, 0.6), circle(4, 2, 2.4, WOOD, C.ink, 0.6));

export const EARLY_ARMY_MOTIFS: Record<string, Svg> = {
  // ── 2031 Pikenerare och musketörer ──
  'arme.eldvapen': all(dashBox(6, 8, 108, 70), gun(14, 30, 104, 22), at(30, 58, 1, path('M-14 -4 L6 -6 L6 -1 L-4 0 L-8 10 L-14 9 Z', WOOD, C.ink, 1.3), rect(4, -7, 18, 4, '#5a5c66', 1, C.ink, 1)), cannon(84, 72, 0.7),
    greyed(at(22, 104, 1, path('M0 -6 L40 -4 L40 4 L0 6 Z', STEEL, C.ink, 1.2), rect(-10, -7, 10, 14, WOOD, 1, C.ink, 1)), at(92, 108, 1, path('M-12 -18 C-4 -10 -4 10 -12 18', 'none', WOOD, 3), line('M-12 -18 L-12 18', C.ink, 0.8)))),
  'arme.krut': all(at(46, 104, 1.1, path('M-18 -40 C-22 -20 -22 -6 -18 0 L18 0 C22 -6 22 -20 18 -40 Z', '#a8743f', C.ink, 1.5), line('M-20.6 -28 L20.6 -28 M-20.6 -10 L20.6 -10', '#5e3a1a', 1.6), ellipse(0, -40, 18, 4.6, '#2b2a33', C.ink, 1.3), path('M-12 -42 C-6 -50 6 -50 12 -42 Z', '#2b2a33', C.ink, 1)),
    ring(46, 56, 20), path('M64 104 C72 102 80 104 86 104 L76 98 Z', '#2b2a33', C.ink, 1), flash(96, 96, 0.9), puff(100, 80, 0.9), ground),
  'arme.skott': all(aimer(34, 0.95, BLUE, tricorn(), { mood: 'angry' }), flash(86, 48, 1.3), puff(98, 36, 1.1), ring(86, 48, 14), ball(108, 50, 2.4), line('M96 50 L104 50', C.grey, 1.2, '2 2'), sound(98, 62, 1, C.orange), ground),
  'arme.gevär': all(gun(10, 64, 108, 48, { w: 1.5 }), circle(90, 51, 4, 'none', C.ink, 1), ellipse(58, 56, 52, 14, 'none', HL, 2.4), greyed(at(30, 96, 1.1, path('M-14 -4 L6 -6 L6 -1 L-4 0 L-8 10 L-14 9 Z', WOOD, C.ink, 1.3), rect(4, -7, 18, 4, '#5a5c66', 1, C.ink, 1))), ground),
  'arme.musköt': all(soldier(30, 0.95, '#7a5236', hat1600(), 'angry', bandolier()), line('M74 112 L74 62 M70 58 L74 62 L78 58', WOOD, 2.4), gun(38, 66, 108, 56, { w: 1.4 }), reach(30, 0.95, 1, 44, 66, '#7a5236'), reach(30, 0.95, -1, 60, 62, '#7a5236'), ellipse(76, 60, 36, 10, 'none', HL, 2.4), ground),
  'arme.musketör': all(soldier(50, 1.05, '#7a5236', hat1600(), 'calm', bandolier()), gun(68, 76, 68, 6, { w: 1.2 }), reach(50, 1.05, 1, 68, 60, '#7a5236'), ellipse(52, 110, 24, 5, 'none', HL, 2.4), pikeman(100, 0.7, true), ground),
  'arme.pik': all(pike(4, 106, 112, 12), fig(22, '#7a5236', 'calm', { h: 0.55, bottom: BUFF }), ring(110, 14, 9), line('M14 116 L112 32', C.grey, 1, '2 2'), arrow(56, 92, 106, 50, C.grey, 1.4), arrow(70, 80, 18, 116 - 1, C.grey, 1.4), greyed(at(96, 108, 1, line('M0 0 L0 -26', WOOD, 2), path('M-2 -26 L0 -32 L2 -26 Z', STEEL, C.ink, 0.6)))),
  'arme.pikenerare': all(pikeman(46, 1.05), ellipse(48, 110, 22, 5, 'none', HL, 2.4), greyed(soldier(96, 0.75, C.grey, hat1600(), 'calm'), gun(106, 110, 106, 44)), ground),
  'arme.harnesk': all(at(52, 64, 2.1, path('M-12 -18 L12 -18 C14 -6 12 8 0 16 C-12 8 -14 -6 -12 -18 Z', STEEL, C.ink, 1), path('M-12 -18 L-6 -22 L6 -22 L12 -18', 'none', C.ink, 0.8), line('M0 -18 L0 14', '#9aa0a8', 0.8), path('M-12 -18 L-16 -20 L-16 -14 Z M12 -18 L16 -20 L16 -14 Z', '#7a5236', C.ink, 0.6), circle(-8, -12, 0.9, C.ink, null), circle(8, -12, 0.9, C.ink, null)),
    ring(52, 62, 40), greyed(at(100, 104, 1, morion())), ground),
  'arme.ladda.2': all(soldier(40, 1, '#7a5236', hat1600(), 'calm', bandolier()), gun(76, 110, 76, 22, { w: 1.3 }), reach(40, 1, 1, 76, 70, '#7a5236'), reach(40, 1, -1, 70, 14, '#7a5236'), path('M66 6 L74 14 L70 16 Z', '#d8c08a', C.ink, 1),
    ...[0, 1, 2].map((i) => circle(76, 16 + i * 3, 0.9, C.ink, null)), arrow(92, 8, 80, 24, HL, 2.6), ring(76, 22, 8), ground),
  'arme.skytt': all(aimer(30, 0.95, '#5f8f3a', hat1600('#4a5a2a'), { mood: 'calm' }), circle(100, 56, 14, C.white, C.ink, 1.4), circle(100, 56, 9, '#e8a0a0', C.ink, 1), circle(100, 56, 4, FOE, C.ink, 1), ...[[99, 55], [102, 57], [100, 53]].map(([a, b]) => circle(a!, b!, 1.2, C.ink, null)), line('M100 70 L100 112', WOOD, 3), ellipse(32, 110, 22, 5, 'none', HL, 2.4), ground),
  'arme.sikta': all(aimer(30, 0.95, BLUE, tricorn(), { mood: 'calm' }), dash('M80 46 L104 44', HL, 2, '3 3'), circle(108, 44, 6, 'none', HL, 2), line('M108 34 L108 54 M98 44 L118 44', HL, 1.2), circle(30, 35, 9, 'none', HL, 1.6), ground),
  'arme.mynning': all(g('translate(0 0)', line('M4 92 L74 52', C.ink, 13), line('M4 92 L74 52', '#5a5c66', 10)), at(78, 50, 1, ellipse(0, 0, 7, 9, '#5a5c66', C.ink, 1.6), ellipse(0, 0, 4, 5.4, '#1e1e24', null)), ring(78, 50, 14), puff(98, 30, 0.9), path('M86 44 C92 40 92 34 96 32', 'none', C.grey, 1.4)),
  'arme.lunta': all(at(60, 70, 1, rect(-52, -8, 70, 14, WOOD, 4, C.ink, 1.4), rect(18, -5, 40, 8, '#5a5c66', 1, C.ink, 1.2), path('M-6 -8 C-12 -22 -6 -34 6 -34', 'none', IRON, 3), rect(-4, -12, 10, 5, IRON, 1, C.ink, 1)),
    path('M66 36 C76 30 84 40 76 48 C70 54 80 62 92 60 C104 58 108 70 100 78', 'none', '#c9a46a', 3), circle(66, 36, 3, C.orange, C.red, 1.2), path('M64 32 C60 24 66 20 62 12', 'none', C.grey, 1.4), ring(66, 36, 9)),
  'arme.flintlås': all(rect(8, 74, 104, 16, WOOD, 4, C.ink, 1.4), rect(64, 70, 48, 6, '#5a5c66', 1, C.ink, 1.2), path('M30 74 C26 54 40 44 50 50 L46 58 C40 54 36 62 38 74 Z', STEEL, C.ink, 1.4), path('M46 48 L54 44 L56 52 Z', '#6b6b6b', C.ink, 1.1),
    line('M60 70 L60 54', STEEL, 3), ...[[66, 50], [70, 58], [64, 44], [72, 46]].map(([a, b]) => star(a!, b!, 2.6, C.yellow)), ring(56, 52, 14), ground),
  'arme.kruthorn': all(path('M20 52 C40 40 74 40 96 58 L92 68 C72 54 44 56 26 66 Z', '#f0e6cc', C.ink, 1.6), rect(94, 56, 8, 12, WOOD, 2, C.ink, 1.2), path('M20 52 L12 58 L26 66 Z', WOOD, C.ink, 1.2),
    path('M30 50 C40 30 80 30 96 50', 'none', '#6b4220', 1.8), ...[0, 1, 2, 3].map((i) => circle(104, 74 + i * 6, 1, C.ink, null)), ellipse(104, 104, 8, 3, '#2b2a33', C.ink, 1), ellipse(58, 56, 46, 18, 'none', HL, 2.4), ground),

  // ── 2032 Artilleriets utveckling ──
  'arme.kanon': all(cannon(58, 108, 1.5), ...[[100, 106], [108, 106], [104, 99]].map(([a, b]) => ball(a!, b!, 4)), ground),
  'arme.artilleri': all(dashBox(4, 40, 112, 70), ...[0, 1, 2].map((i) => all(cannon(26 + i * 34, 104, 0.65), flash(56 + i * 34, 86, 0.6), puff(64 + i * 34, 78, 0.5), sol(12 + i * 34, 90, BLUE, 0.7))), ground),
  'arme.kanonkula': all(...[[18, 104], [30, 104], [42, 104], [24, 94], [36, 94], [30, 84]].map(([a, b]) => ball(a!, b!, 6)), ball(84, 40, 12), ring(84, 40, 18), line('M48 54 L68 46 M50 62 L70 54', C.grey, 1.6), greyed(ball(104, 104, 2)), ground),
  'arme.kaliber': all(at(40, 60, 1, circle(0, 0, 28, '#5a5c66', C.ink, 2), circle(0, 0, 16, '#1e1e24', C.ink, 1.4), line('M-16 0 L16 0', HL, 2.4), path('M-16 -4 L-16 4 M16 -4 L16 4', 'none', HL, 2.4)), greyed(at(96, 60, 1, circle(0, 0, 16, '#5a5c66', C.ink, 2), circle(0, 0, 8, '#1e1e24', C.ink, 1.2))),
    ball(40, 104, 7), greyed(ball(96, 106, 3.6)), dash('M40 76 L40 96', C.grey)),
  'arme.lavett': all(greyed(g('translate(60 82) rotate(-6)', path('M-34 -7 L40 -5 L40 5 L-34 7 Z', C.grey, C.ink, 1.4))), path('M8 106 L14 100 L70 80 L76 86 L18 108 Z', WOOD, HL, 2.6), wheel(66, 96, 14), circle(66, 96, 15.5, 'none', HL, 2.2), ground),
  'arme.artillerist': all(cannon(80, 108, 1), karo(32, 0.95, 'calm', tricorn()), line('M40 66 L108 60', WOOD, 2.6), rect(104, 56, 8, 8, '#d8c08a', 2, C.ink, 1), reach(32, 0.95, 1, 52, 64), reach(32, 0.95, -1, 66, 62), ellipse(34, 110, 22, 5, 'none', HL, 2.4), ground),
  'arme.ammunition': all(dashBox(6, 30, 108, 80), rect(12, 76, 40, 30, WOOD, 2, C.ink, 1.4), ...[[20, 72], [30, 72], [40, 72], [25, 64], [35, 64]].map(([a, b]) => ball(a!, b!, 5)), ...[[68, 104], [92, 104]].map(([a, b]) => at(a!, b!, 1, path('M-10 -26 C-13 -14 -13 -6 -10 0 L10 0 C13 -6 13 -14 10 -26 Z', '#a8743f', C.ink, 1.3), line('M-12 -18 L12 -18 M-12 -8 L12 -8', '#5e3a1a', 1.4))),
    ...[0, 1, 2].map((i) => rect(60 + i * 12, 44, 9, 16, '#e8dcbc', 3, C.ink, 1.1)), ground),
  'arme.skottvidd': all(cannon(16, 108, 0.6, { rot: 20 }), dash('M30 92 C50 30 80 30 98 104', C.grey, 1.4), ball(98, 104, 3), line('M20 114 L98 114', HL, 2.4), path('M20 110 L20 118 M98 110 L98 118', 'none', HL, 2.4), greyed(fortWall(104, 112, 12, 26)), ground),
  'arme.rekyl': all(cannon(70, 108, 1.2), flash(108, 82, 1), arrow(48, 70, 12, 70, HL, 3.4), line('M24 96 L10 96 M22 104 L8 104', C.grey, 1.6), ball(114, 78, 3), ground),
  'arme.mörsare': all(mortar(22, 112, 1.1), dash('M30 92 C44 10 76 10 96 84', HL, 2.2, '4 3'), ball(96, 84, 4), fortWall(66, 112, 18, 40), house(98, 112, 1), flash(38, 90, 0.7), ground),
  'arme.granat': all(at(42, 62, 1, circle(0, 0, 24, IRON, C.ink, 1.8), path('M0 -24 A24 24 0 0 1 24 0 L0 0 Z', '#1e1e24', C.ink, 1.2), ...[[6, -8], [10, -14], [14, -6], [8, -18], [16, -12]].map(([a, b]) => circle(a!, b!, 1.4, '#555', null)), rect(-3, -30, 6, 7, WOOD, 1, C.ink, 1), path('M0 -30 C-6 -38 4 -42 -2 -48', 'none', '#c9a46a', 2), flash(-2, -50, 0.5)), ring(42, 60, 32), greyed(ball(98, 92, 12)), ground),
  'arme.kartesch': all(cannon(22, 108, 0.75), path('M44 84 L114 54 L114 110 Z', 'rgba(239,138,60,0.18)', null), ...Array.from({ length: 16 }, (_, i) => ball(56 + (i % 4) * 14 + (i % 2) * 4, 70 + Math.floor(i / 4) * 10 + (i % 3) * 2, 1.8)),
    at(30, 34, 1, rect(-10, -14, 20, 26, STEEL, 2, C.ink, 1.4), ...[[-5, -8], [0, -8], [5, -8], [-5, -2], [0, -2], [5, -2], [-5, 4], [0, 4], [5, 4]].map(([a, b]) => circle(a!, b!, 2, IRON, null))), ring(30, 34, 20), ground),
  'arme.beskjuta': all(cannon(14, 108, 0.55, { rot: 6 }), cannon(30, 112, 0.55, { rot: 6 }), fortWall(70, 112, 44, 54), ...[[76, 70], [92, 80], [104, 66]].map(([a, b]) => all(puff(a!, b!, 0.5, '#d8cfbd'), ball(a!, b!, 2.6))), ...[[44, 82], [52, 74]].map(([a, b]) => line(`M${a} ${b} l12 -3`, C.grey, 1.4, '2 2')), ground),
  'arme.bombardera': all(...[[20, 94], [40, 98], [62, 92], [84, 100], [104, 94]].map(([a, b]) => house(a!, b! + 14, 1)), ...[[24, 30], [52, 20], [80, 28], [104, 18]].map(([a, b]) => all(dash(`M${a! - 14} ${b! - 14} C${a! - 6} ${b! - 18} ${a} ${b! - 6} ${a} ${b}`, C.grey, 1.2), ball(a!, b!, 3))), puff(40, 82, 0.7), puff(84, 86, 0.6), flash(62, 92, 0.6), ground),
  'arme.kanonad': all(...[0, 1, 2, 3].map((i) => all(cannon(16 + i * 26, 110, 0.45), flash(36 + i * 26, 98, 0.55), puff(42 + i * 26, 90, 0.45))), ...[0, 1, 2].map((i) => path(`M${30 + i * 30} 60 C${36 + i * 30} 52 ${36 + i * 30} 40 ${30 + i * 30} 32`, 'none', HL, 2)), ...[0, 1, 2].map((i) => path(`M${40 + i * 30} 66 C${50 + i * 30} 54 ${50 + i * 30} 34 ${40 + i * 30} 22`, 'none', HL, 1.4)), ground),
  'arme.krutrök': all(rect(4, 60, 112, 52, '#cfe0a8', 0, null), ...Array.from({ length: 6 }, (_, i) => line(`M${16 + i * 18} 112 L${16 + i * 18} 50`, '#5a5c66', 1.6)), ...Array.from({ length: 6 }, (_, i) => line(`M${16 + i * 18} 50 L${16 + i * 18} 42`, STEEL, 1.4)),
    puff(20, 74, 2.2), puff(58, 70, 2.6), puff(96, 76, 2.2), puff(40, 92, 2), puff(84, 94, 2), flag(74, 46, BLUE, 0.6), ellipse(60, 80, 56, 30, 'none', HL, 2.4), ground),

  // ── 2033 Uniformer och regementen ──
  'arme.menig': all(...[0, 1, 2].map((i) => rect(8 + i * 36, 100 - i * 16, 36, 12 + i * 16, i === 0 ? '#f3e3c0' : C.grey2, 1, C.ink, 1.2)), g('translate(0 -12)', soldier(26, 0.62, BLUE, tricorn(), 'calm', cuffs())), circle(26, 66, 11, 'none', HL, 2), ellipse(26, 100, 16, 4, 'none', HL, 2.4), greyed(g('translate(0 -28)', soldier(62, 0.62, BLUE, tricorn(), 'calm', all(cuffs(), path('M-12 -30 L-6 -26 L0 -30 M-12 -25 L-6 -21 L0 -25', 'none', YEL, 2.2))))), greyed(g('translate(0 -44)', soldier(98, 0.62, BLUE, tricorn(), 'calm', all(cuffs(), sash(), rect(-17, -43, 8, 5, C.gold, 1, C.ink, 0.8), rect(9, -43, 8, 5, C.gold, 1, C.ink, 0.8)))))),
  'arme.korpral': all(karo(28, 0.95, 'calm', tricorn(), path('M-12 -30 L-6 -26 L0 -30', 'none', YEL, 2.2)), ring(19, 54, 7), ...[0, 1].map((r) => row(58 + r * 6, 70 + r * 22, 4, 14, BLUE, 0.85, { gun: true, up: true })), line('M44 60 L54 60', C.grey, 1.4), ground),
  'arme.rekryt': all(fig(30, '#9a8a6a', 'shock', { h: 0.85, bottom: '#6b5a44' }), karo(86, 0.95, 'smile'), at(58, 72, 1, rect(-12, -6, 24, 8, BLUE, 2, C.ink, 1.2), rect(-10, -12, 20, 6, BUFF, 2, C.ink, 1.1), path('M-10 -14 L10 -14 L6 -20 L0 -17 L-6 -20 Z', IRON, C.ink, 1)), reach(86, 0.95, -1, 66, 72), reach(30, 0.85, 1, 48, 72, '#9a8a6a'), ellipse(30, 110, 18, 5, 'none', HL, 2.4), ground),
  'arme.kompani': all(field(), ...Array.from({ length: 8 }, (_, i) => block(10 + (i % 4) * 26, 34 + Math.floor(i / 4) * 30, 20, 16, BLUE, { grey: i !== 1 })), dashBox(33, 30, 26, 24), at(46, 28, 0.4, flag(0, 0, YEL))),
  'arme.bataljon': all(field(), ...Array.from({ length: 8 }, (_, i) => block(10 + (i % 4) * 26, 34 + Math.floor(i / 4) * 30, 20, 16, BLUE, { grey: i >= 4 })), dashBox(6, 30, 108, 24)),
  'arme.regemente': all(field(), ...Array.from({ length: 8 }, (_, i) => block(10 + (i % 4) * 26, 34 + Math.floor(i / 4) * 30, 20, 16, BLUE)), dashBox(6, 28, 108, 56), at(60, 100, 0.5, flag(0, 0, BLUE, 1, { fringe: true, cross: YEL })), at(24, 100, 0.28, horseL())),
  'arme.fänrik': all(karo(44, 0.95, 'smile', tricorn(), sash()), reach(44, 0.95, 1, 64, 58), flag(66, 104, YEL, 1.5, { fringe: true }), ring(86, 42, 26), ground),
  'arme.löjtnant': all(...[0, 1, 2, 3].map((i) => rect(10 + i * 26, 100 - i * 14, 26, 12 + i * 14, i === 1 ? '#f3e3c0' : C.grey2, 1, C.ink, 1.2)),
    ...[0, 1, 2, 3].map((i) => i === 1 ? all(soldier(23 + i * 26, 0.42, BLUE, tricorn(), 'smile', sash()), '') : greyed(soldier(23 + i * 26, 0.42, C.grey, tricorn(), 'calm'))).map((s, i) => g(`translate(0 ${-(i * 14 + 12)})`, s)), ring(49, 52, 14)),
  'arme.överste': all(rider(48, 108, 0.95, BLUE, '', { head: path('M-9 -74 L9 -74 L6 -82 L0 -78 L-6 -82 Z', IRON, C.ink, 1.1), ax: 22, ay: -64 }), line('M44 -0 L44 0', C.ink, 1), path('M42 52 L56 66 L56 70 L42 56 Z', C.gold, C.ink, 1),
    line('M69 48 L80 30', C.gold, 2.4), ring(48, 46, 16), greyed(row(88, 96, 2, 14, BLUE, 0.8, { gun: true, up: true })), greyed(at(104, 76, 0.5, flag(0, 0, BLUE))), ground),
  'arme.gradbeteckning': all(path('M10 112 L18 40 C30 30 50 26 60 26 C70 26 90 30 102 40 L110 112 Z', BLUE, C.ink, 1.8), path('M40 26 L60 46 L80 26', 'none', C.ink, 1.6), rect(18, 42, 30, 12, YEL, 2, HL, 2.6), ...[0, 1, 2].map((i) => star(25 + i * 8, 48, 3, C.gold)), circle(60, 60, 2, YEL, C.ink, 1), circle(60, 72, 2, YEL, C.ink, 1), greyed(rect(74, 42, 30, 12, C.grey2, 2, C.ink, 1.2))),
  'arme.befordra': all(...[0, 1, 2].map((i) => rect(14 + i * 32, 96 - i * 20, 32, 16 + i * 20, C.grey2, 1, C.ink, 1.2)), greyed(g('translate(0 -16)', soldier(30, 0.45, C.grey, tricorn(), 'calm'))), g('translate(0 -36)', soldier(62, 0.45, BLUE, tricorn(), 'laugh', sash())), arrow(36, 60, 56, 40, HL, 3), star(78, 20, 6, C.gold), ring(62, 44, 16)),
  'arme.fana': all(flag(30, 108, BLUE, 1.7, { fringe: true, cross: YEL }), ellipse(54, 36, 34, 22, 'none', HL, 2.4), greyed(at(98, 108, 1, line('M0 0 L0 -40', C.ink, 2), rect(0, -40, 16, 10, C.grey2, 0, C.ink, 1))), ground),
  'arme.trumslagare': all(soldier(52, 0.8, BLUE, tricorn(), 'calm', cuffs()), drum(52, 92, 1.3), line('M40 70 L48 78 M64 70 L56 78', WOOD, 2.4), reach(52, 0.8, -1, 40, 70), reach(52, 0.8, 1, 64, 70), sound(80, 76, 1.2, C.orange), sound(26, 76, 1.2, C.orange).replace('scale(1.2)', 'scale(-1.2 1.2)'), ground),
  'arme.mundering': all(dashBox(6, 10, 108, 100), at(36, 54, 1, path('M-16 -26 L16 -26 L22 24 L-22 24 Z', BLUE, C.ink, 1.6), path('M-16 -26 L-26 10 L-20 12 L-12 -12 Z M16 -26 L26 10 L20 12 L12 -12 Z', BLUE, C.ink, 1.4), ...[-18, -8, 2, 12].map((y) => circle(0, y, 1.6, YEL, null)), rect(-26, 6, 8, 6, YEL, 1, C.ink, 0.8), rect(18, 6, 8, 6, YEL, 1, C.ink, 0.8)),
    at(86, 96, 1.2, tricorn()), at(84, 64, 1, path('M-12 -14 L12 -14 L14 14 L2 14 L0 0 L-2 14 L-14 14 Z', BUFF, C.ink, 1.4)), at(30, 100, 1, path('M-14 0 L-14 -8 L-4 -8 L-2 0 Z M2 0 L2 -8 L12 -8 L14 0 Z', C.black, C.ink, 1)), rect(70, 90, 26, 16, '#a8743f', 3, C.ink, 1.3), line('M74 90 L92 90', '#5e3a1a', 1.6)),
  'arme.kasern': all(rect(8, 30, 104, 50, '#e8dcc8', 0, C.ink, 1.6), path('M4 30 L60 14 L116 30 Z', IRON, C.ink, 1.6), ...Array.from({ length: 16 }, (_, i) => rect(14 + (i % 8) * 12.4, 38 + Math.floor(i / 8) * 18, 6, 9, '#bfe3f5', 1, C.ink, 0.9)), rect(54, 64, 12, 16, '#6b4220', 1, C.ink, 1.2),
    rect(4, 80, 112, 32, '#e6d7ae', 0, null), row(20, 92, 6, 15, BLUE, 0.7, { gun: true, up: true }), ground),

  // ── 2034 Linjetaktik och exercis ──
  'arme.i-takt': all(...[0, 1, 2, 3].map((i) => all(soldier(18 + i * 26, 0.62, BLUE, tricorn(), 'calm', cuffs()), on(18 + i * 26, 0.62, line('M4 0 L14 46', BUFF, 7)))), drum(104, 30, 0.8), ...[0, 1, 2, 3].map((i) => path(`M${12 + i * 26} 114 l12 0`, 'none', HL, 2.4)), sound(80, 28, 0.9, C.orange).replace('scale(0.9)', 'scale(-0.9 0.9)')),
  'arme.exercis': all(rect(4, 70, 112, 42, '#e6d7ae', 0, null), soldier(20, 0.85, BLUE, tricorn(), 'angry', all(cuffs(), sash())), say(30, 14, 18, 14, 22, 30, bang(30, 16, 0.9)), ...[0, 1, 2].map((i) => shoulder(52 + i * 22, 0.6, BLUE, tricorn(), 'calm')), ...[0, 1, 2].map((i) => greyed(shoulder(62 + i * 22, 0.48, C.grey, tricorn(), 'calm'))), ground),
  'arme.exercera': all(...[0, 1, 2].map((i) => all(rect(6 + i * 37, 6, 34, 104, i === 1 ? '#f8f0de' : '#fbfbf8', 4, C.grey2, 1), soldier(22 + i * 37, 0.62, BLUE, tricorn(), 'calm', cuffs()))),
    gun(30, 110, 30, 50), reach(22, 0.62, 1, 30, 84), gun(66, 86, 72, 40), reach(59, 0.62, 1, 64, 74), reach(59, 0.62, -1, 70, 56), gun(100, 76, 116, 70), reach(96, 0.62, 1, 104, 76), reach(96, 0.62, -1, 110, 72),
    ...[1, 2, 3].map((n, i) => at(12 + i * 37, 20, 1, `<text x="0" y="0" font-family="system-ui,sans-serif" font-weight="800" font-size="11" fill="${HL}">${n}</text>`))),
  'arme.kommando': all(soldier(26, 0.95, BLUE, tricorn(), 'angry', all(cuffs(), sash())), say(56, 18, 26, 18, 34, 32, all(bang(52, 20, 1), bang(60, 20, 1))), ...[0, 1, 2].map((i) => shoulder(66 + i * 18, 0.6, BLUE, tricorn(), 'shock')), ...[0, 1, 2].map((i) => path(`M${70 + i * 18} 52 l4 -6 m3 6 l4 -4`, 'none', HL, 1.4)), ground),
  'arme.giv-akt': all(soldier(36, 1, BLUE, tricorn(), 'calm', cuffs()), line('M36 6 L36 112', HL, 1.2, '3 3'), greyed(g('translate(88 0) rotate(8 0 112)', fig(0, C.grey, 'sleepy', { h: 0.9 }))), say(70, 14, 18, 14, 50, 22, bang(70, 16, 0.9)), ground),
  'arme.lystra': all(soldier(84, 0.95, BLUE, tricorn(), 'shock', cuffs()), path('M74 22 l-6 -6 M72 30 l-8 0 M74 38 l-6 6', 'none', HL, 2), greyed(soldier(22, 0.8, C.grey, tricorn(), 'angry', sash())), say(46, 20, 20, 14, 30, 34, bang(46, 22, 0.9)), sound(56, 36, 1.1, HL), ground),
  'arme.linjetaktik': all(field(), ...[0, 1, 2].map((r) => block(8, 70 + r * 8, 104, 6, BLUE)), dashBox(5, 66, 110, 28), greyed(block(20, 18, 18, 30, FOE), block(52, 18, 18, 30, FOE), block(84, 18, 18, 30, FOE)), ...[16, 40, 64, 88, 104].map((x) => flash(x, 64, 0.35))),
  'arme.front': all(field(), block(20, 50, 80, 30, BLUE), line('M20 50 L100 50', HL, 4.6), ...[30, 60, 90].map((x) => arrow(x, 46, x, 30, HL, 2)), greyed(block(20, 10, 80, 12, FOE))),
  'arme.avancera': all(...[0, 1, 2, 3].map((i) => all(shoulder(14 + i * 22, 0.6, BLUE, tricorn(), 'calm', true), on(14 + i * 22, 0.6, line('M4 0 L14 46', BUFF, 7)))), arrow(16, 16, 96, 16, HL, 3.6), flag(108, 112, FOE, 0.7), ground),
  'arme.bajonett': all(gun(4, 96, 66, 58, { w: 1.6 }), g('translate(66 58) rotate(-31.5)', rect(0, -3, 8, 6, STEEL, 1, C.ink, 1), path('M8 -2 L50 -1 L54 0 L50 1 L8 2 Z', STEEL, C.ink, 1.2)), ring(92, 44, 18), at(86, 98, 1, rect(-22, -3, 8, 6, STEEL, 1, C.ink, 1), path('M-14 -2 L26 -1 L30 0 L26 1 L-14 2 Z', STEEL, C.ink, 1.2)), ground),
  'arme.ge-eld': all(soldier(18, 0.85, BLUE, tricorn(), 'angry', all(cuffs(), sash())), say(20, 10, 16, 12, 18, 26, bang(20, 12, 0.8)), ...[0, 1, 2].map((i) => aimer(42 + i * 18, 0.55, BLUE, tricorn(), { fire: i === 2 })), ...[0, 1].map((i) => flash(90 + i * 0, 58, 0)), flash(68, 74, 0.6), flash(86, 74, 0.6), ground),
  'arme.salva.2': all(...[0, 1, 2, 3, 4].map((i) => all(sol(10 + i * 4, 30 + i * 16, BLUE, 1, { gun: true }), flash(38 + i * 4, 34 + i * 16, 0.6), puff(48 + i * 4, 30 + i * 16, 0.45))), line('M56 24 L56 108', HL, 2.4), path('M52 24 L56 24 M52 108 L56 108', 'none', HL, 2.4), ...[0, 1, 2, 3, 4].map((i) => line(`M${62 + i * 4} ${34 + i * 16} L${100 + i * 2} ${34 + i * 16}`, C.grey, 1.2, '2 3'))),
  'arme.eldgivning': all(rect(4, 76, 112, 12, EARTH, 2, C.ink, 1.4), ...[0, 1, 2, 3].map((i) => all(sol(16 + i * 26, 68, BLUE, 1, { gun: true }), flash(42 + i * 26, 72, 0.45 + (i % 2) * 0.2), puff(50 + i * 26, 64, 0.4))), ...[0, 1, 2].map((i) => line(`M${20 + i * 36} 40 L${40 + i * 36} 40`, C.grey, 1.2, '2 3')), ...[0, 1, 2, 3, 4, 5].map((i) => circle(14 + i * 18, 30, 3, i < 4 ? HL : C.grey2, null)), ground),
  'arme.eldkraft': all(rect(6, 8, 50, 102, '#fbfbf8', 4, C.grey2, 1), rect(64, 8, 50, 102, '#fff4e6', 4, HL, 2.4), greyed(sol(22, 80, C.grey, 1, { gun: true, up: true }), rect(42, 88, 8, 14, C.grey, 1, C.ink, 1)), ...[0, 1, 2].map((r) => row(70 + r * 2, 52 + r * 15, 3, 10, BLUE, 0.65, { gun: true, up: true })), cannon(84, 108, 0.36), rect(102, 16, 8, 86, HL, 1, C.ink, 1.2), line('M100 102 L112 102', C.ink, 1.2)),

  // ── 2035 Fältbefästningar ──
  'arme.spade': all(spadeT(52, 64, 1.6, 10), ring(60, 94, 20), path('M86 112 C88 100 104 98 110 112 Z', EARTH, C.ink, 1.3), ground),
  'arme.hacka-noun': all(pickT(46, 62, 1.5, -20), ring(28, 26, 16), ...[[96, 106, 10], [108, 108, 6], [86, 108, 5]].map(([a, b, r]) => circle(a!, b!, r!, '#9a8f7a', C.ink, 1.2)), path('M92 94 l-4 -6 M100 92 l2 -7', 'none', C.grey, 1.4), ground),
  'arme.fältbefästning': all(path('M4 112 L4 82 C30 76 80 74 116 80 L116 112 Z', EARTH, C.ink, 1.4), ...Array.from({ length: 10 }, (_, i) => line(`M${10 + i * 11} ${80 - (i % 2)} L${16 + i * 11} 66`, '#c9a46a', 2.2)), cannon(64, 82, 0.55), ...[0, 1].map((i) => basket(30 + i * 60, 82, 0.7)), at(98, 82, 0.6, flag(0, 0, BLUE)), sol(44, 70, BLUE, 0.8, { gun: true }), dashBox(4, 44, 112, 68)),
  'arme.fortifikation': all(rect(8, 60, 104, 8, C.tan, 2, C.ink, 1.4), rect(24, 30, 56, 32, '#f3e6c4', 1, C.ink, 1.2), path('M52 34 L62 42 L72 38 L68 50 L74 58 L60 54 L52 60 L46 52 L32 54 L38 44 L32 36 L46 40 Z', 'none', BLUE, 1.6), line('M84 30 L96 58 M84 30 L76 58', IRON, 1.6), circle(84, 30, 2, IRON, null),
    soldier(98, 0.6, BLUE, tricorn(), 'calm', sash()), line('M16 68 L16 112 M104 68 L104 112', WOOD, 3), ellipse(52, 46, 28, 18, 'none', HL, 2.2)),
  'arme.redutt': all(field(), rect(24, 24, 72, 72, EARTH2, 4, C.ink, 1.3), rect(32, 32, 56, 56, EARTH, 3, C.ink, 1.3), rect(40, 40, 40, 40, GRASS, 2, C.ink, 1.1), ...Array.from({ length: 9 }, (_, i) => circle(48 + (i % 3) * 12, 48 + Math.floor(i / 3) * 12, 2, BLUE, null)), ...[[60, 18], [60, 102], [18, 60], [102, 60]].map(([a, b]) => arrow(60 + (a! - 60) * 0.5, 60 + (b! - 60) * 0.5, a!, b!, BLUE, 1.6)), rect(20, 20, 80, 80, 'none', 6, HL, 2.4)),
  'arme.gräva-ner-sig': all(rect(4, 76, 112, 36, EARTH, 0, null), path('M12 76 C20 62 100 62 108 76 Z', EARTH2, C.ink, 1.4), rect(18, 78, 84, 20, '#6b4f2a', 2, C.ink, 1.2), ...[0, 1, 2].map((i) => sol(32 + i * 26, 72, BLUE, 0.9, { gun: true })), spadeT(100, 52, 0.6, 30), arrow(60, 22, 60, 44, HL, 3), ground),
  'arme.jordverk': all(path('M10 112 L34 56 L90 56 L112 112 Z', EARTH, C.ink, 1.6), ...[[40, 90], [70, 80], [56, 100], [86, 98]].map(([a, b]) => circle(a!, b!, 1.6, EARTH2, null)), ball(50, 64, 5), line('M30 52 L44 60', C.grey, 1.4, '2 2'), ellipse(60, 84, 50, 30, 'none', HL, 2.4), greyed(fortWall(96, 52, 16, 30)), path('M100 30 L104 38 L100 44', 'none', C.ink, 1.2), ground),
  'arme.skanskorg': all(basket(40, 110, 2.2), ring(40, 82, 32), basket(92, 112, 1.2), basket(108, 112, 1.2), greyed(basket(100, 82, 1, '#c9a46a')), ground),
  'arme.faskin': all(fascine(56, 54, 1.6, -8), ring(56, 54, 46), fascine(70, 100, 0.8), fascine(70, 88, 0.8), ground),
  'arme.förhuggning': all(...[0, 1, 2].map((i) => g(`translate(${16 + i * 28} ${104 - i * 2})`, line('M0 0 L-12 4', '#7a4a20', 4), ...[[-2, -14], [6, -10], [10, 0], [6, 8], [-2, 10]].map(([a, b]) => path(`M0 0 L${a! + 16} ${b}`, 'none', '#7a4a20', 2)), circle(20, -6, 7, '#5f9e58', C.ink, 1), circle(22, 6, 6, '#5f9e58', C.ink, 1))), dashBox(4, 82, 96, 30),
    rider(104, 104, 0.6, FOE, '', { flip: true }), path('M80 68 l-4 -6 M86 64 l0 -7', 'none', C.grey, 1.4), ground),
  'arme.spansk-ryttare': all(cheval(46, 98, 1.05), ring(46, 96, 40), rider(108, 108, 0.62, FOE, '', { flip: true, gallop: false }), path('M88 60 l-4 -6 M94 56 l0 -7', 'none', C.grey, 1.4), ground),
  'arme.fotangel': all(caltrop(46, 64, 3.6), ring(44, 52, 34), ...[[88, 104], [102, 108], [76, 110], [110, 98]].map(([a, b]) => caltrop(a!, b!, 0.7)), ground),
  'arme.vargrop': all(rect(4, 76, 112, 36, EARTH, 0, null), path('M34 76 L40 110 L80 110 L86 76 Z', '#6b4f2a', C.ink, 1.4), ...[48, 60, 72].map((x) => path(`M${x - 3} 110 L${x} 92 L${x + 3} 110 Z`, '#c9a46a', C.ink, 1)), ...Array.from({ length: 8 }, (_, i) => line(`M${30 + i * 8} 74 L${38 + i * 8} 78`, '#7a4a20', 2)), path('M30 74 C50 70 70 70 90 74', 'none', '#7fb069', 3),
    rect(30, 72, 60, 42, 'none', 4, HL, 2.4), greyed(rider(104, 76, 0.5, FOE, '', { flip: true })), line('M4 76 L116 76', '#7fb069', 2)),
  'arme.ställning': all(field(), hillAt(60, 74, 80, 30), path('M4 20 C20 40 10 70 20 112 L4 112 Z', '#8cc8ea', C.ink, 1), ...[[100, 30], [108, 50], [96, 60], [108, 72]].map(([a, b]) => tree(a!, b!, 0.6)), ...[0, 1, 2].map((i) => block(32 + i * 20, 56, 16, 10, BLUE)), dashBox(24, 46, 72, 32), greyed(block(30, 96, 60, 10, FOE)), arrow(60, 94, 60, 84, FOE, 2)),
  'arme.ta-betäckning': all(g('translate(0 24)', soldier(50, 0.75, BLUE, tricorn(), 'shock', cuffs())), path('M4 120 L4 80 C30 72 90 72 116 80 L116 120 Z', EARTH, C.ink, 1.4), ...[[30, 40], [64, 30], [96, 46]].map(([a, b]) => all(ball(a!, b!, 3), line(`M${a! + 6} ${b} l12 0`, C.grey, 1.2, '2 2'))), arrow(78, 60, 64, 76, HL, 2.6), ground),

  // ── 2036 1600-talets fältslag ──
  'arme.fältslag': all(field(), ...[0, 1, 2, 3].map((i) => block(18 + i * 22, 74, 18, 12, BLUE)), cavBlock(4, 76, 12, 10), cavBlock(104, 76, 12, 10), ...[0, 1, 2, 3].map((i) => block(18 + i * 22, 30, 18, 12, FOE)), cavBlock(4, 30, 12, 10, FOE), cavBlock(104, 30, 12, 10, FOE), ...[30, 60, 90].map((x) => gunIcon(x, 96, 1)), puff(40, 56, 0.6), puff(78, 54, 0.6), dashBox(4, 22, 112, 84)),
  'arme.drabbning': all(rect(4, 84, 112, 28, '#8cc8ea', 0, null), path('M30 84 C40 74 80 74 90 84 L90 90 L30 90 Z', '#c9b48a', C.ink, 1.4), rider(32, 84, 0.55, BLUE, '', { gallop: true, ax: 22, ay: -60 }), rider(88, 84, 0.55, FOE, '', { gallop: true, flip: true, ax: 22, ay: -60 }), line('M50 50 L70 40 M70 50 L50 40', STEEL, 2.4), ring(60, 46, 14), ground),
  'arme.fältmarskalk': all(rider(46, 108, 0.95, BLUE, '', { head: hat1600('#2b2a33', '#f3efe6'), ax: 26, ay: -66 }), at(46, 108, 0.95, rect(24, -84, 3.6, 22, C.gold, 1, C.ink, 1), rect(24, -84, 3.6, 4, BLUE, 0, null)), ring(70, 34, 14), greyed(rider(104, 108, 0.6, C.grey, '', { flip: true })), ground),
  'arme.brigad': all(field(), block(46, 48, 28, 20, '#7a5236'), block(22, 48, 20, 20, BLUE), block(78, 48, 20, 20, BLUE), block(34, 74, 52, 12, BLUE), ...[38, 60, 82].map((x) => gunIcon(x, 40, 1)), dashBox(16, 28, 88, 64), greyed(block(20, 100, 80, 8, FOE))),
  'arme.fältrop': all(...[0, 1, 2].map((i) => soldier(20 + i * 30, 0.62, '#7a5236', hat1600(), 'laugh', bandolier())), say(80, 22, 30, 22, 74, 46, all(path('M80 13 L80 31 M73 19 L87 19', 'none', C.gold, 3))), ...[0, 1, 2].map((i) => path(`M${30 + i * 30} 56 l6 -4 m-6 10 l7 0`, 'none', HL, 1.6)), ground),
  'arme.överflygla': all(field(), ...[0, 1, 2, 3].map((i) => block(14 + i * 20, 30, 18, 10, FOE)), block(14, 80, 78, 10, BLUE, { grey: true }), cavBlock(98, 80, 14, 10), path('M104 76 C112 50 108 26 96 20', 'none', HL, 3), path('M96 14 L90 22 L100 24 Z', HL, HL, 1)),
  'arme.omgruppera': all(field(), ...[[14, 30], [26, 22], [18, 44], [34, 38], [28, 54], [12, 60], [38, 26], [22, 70]].map(([a, b]) => circle(a!, b!, 2.2, BLUE, null)), arrow(46, 50, 64, 50, HL, 3.4), ...[0, 1].map((r) => block(72, 30 + r * 26, 36, 18, BLUE)), dashBox(68, 26, 44, 52)),
  'arme.segerrik': all(soldier(20, 0.85, BLUE, tricorn(), 'laugh', all(cuffs(), sash())), line('M38 82 L112 82', C.ink, 1.6), path('M110 78 L116 82 L110 86 Z', C.ink, C.ink, 1), ...[0, 1, 2, 3, 4].map((i) => all(circle(46 + i * 15, 82, 2.2, C.ink, null), laurel(46 + i * 15, 64, 0.8), at(44 + i * 15, 106, 0.3, flag(0, 0, BLUE)))), dashBox(34, 48, 82, 62), ground),
  'arme.krigslycka': all(line('M60 30 L60 100', IRON, 2.4), path('M48 104 L72 104 L60 96 Z', IRON, C.ink, 1), g('rotate(-14 60 34)', line('M20 34 L100 34', IRON, 2.4), path('M12 36 L28 36 L24 46 L16 46 Z', '#d8cfbd', C.ink, 1.2), path('M92 36 L108 36 L104 46 L96 46 Z', '#d8cfbd', C.ink, 1.2), at(20, 34, 0.32, flag(0, 0, BLUE)), at(100, 34, 0.32, flag(0, 0, FOE))), path('M98 70 C110 60 108 40 96 32', 'none', HL, 2.2), path('M94 26 L92 36 L102 34 Z', HL, HL, 1), path('M22 70 C10 60 12 44 22 40', 'none', HL, 2.2), path('M26 34 L18 38 L26 44 Z', HL, HL, 1), ground),
  'arme.fältskär': all(path('M4 112 L30 40 L90 40 L116 112 Z', '#e8dcbc', C.ink, 1.4), fig(38, '#f3efe6', 'calm', { h: 0.9, bottom: '#6b5a44' }), karo(84, 0.8, 'frown'), at(84, 112, 1, rect(-1, 0, 0, 0, 'none', 0, null)), rect(70, 64, 16, 8, C.white, 2, C.ink, 1), reach(38, 0.9, 1, 70, 66, '#f3efe6'), rect(10, 96, 20, 14, '#6b4220', 3, C.ink, 1.2), path('M14 96 C14 90 26 90 26 96', 'none', C.ink, 1.4), ellipse(40, 110, 18, 5, 'none', HL, 2.4), ground),
  'arme.krigsfånge': all(...[0, 1].map((i) => soldier(30 + i * 26, 0.72, FOE, tricorn('#2b2a33'), 'frown', '', { bottom: '#f3efe6' })), ...[0, 1].map((i) => all(reach(30 + i * 26, 0.72, -1, 20 + i * 26, 26, FOE), reach(30 + i * 26, 0.72, 1, 40 + i * 26, 26, FOE))), rect(10, 18, 62, 96, 'none', 6, HL, 2.4), shoulder(96, 0.85, BLUE, tricorn(), 'calm', true), greyed(at(30, 110, 1, line('M-10 0 L20 -6', '#5a5c66', 2.4))), ground),

  // ── 2037 Karl XII:s karoliner ──
  'arme.karolin': all(shoulder(50, 1.05, BLUE, tricorn(), 'calm', true, collar()), ellipse(52, 110, 24, 5, 'none', HL, 2.4), greyed(soldier(100, 0.7, C.grey, hat1600(), 'calm')), ground),
  'arme.indelningsverk': all(...[[16, 34], [44, 26], [16, 70], [44, 78]].map(([a, b]) => farm(a!, b!, 0.9)), dash('M4 6 L58 6 L58 88 L4 88 Z', HL, 1.6), arrow(62, 50, 78, 50, HL, 3), torp(96, 60, 0.7), soldier(96, 0.45, BLUE, tricorn(), 'calm', cuffs()), flag(100, 112, BLUE, 0.4), ground),
  'arme.rote': all(...[[22, 50], [52, 40], [30, 82], [60, 76]].map(([a, b]) => farm(a!, b!, 1)), circle(42, 60, 38, 'none', HL, 2.4), greyed(soldier(100, 0.7, C.grey, tricorn(), 'calm'))),
  'arme.soldattorp': all(torp(60, 100, 1.6), ...[[12, 98], [108, 96]].map(([a, b]) => fir(a!, b!, 0.9)), at(16, 112, 0.6, rect(-14, -8, 28, 8, '#7fb069', 1, null)), ring(60, 70, 44), at(96, 86, 0.7, path('M-6 -10 L6 -10 L8 10 L-8 10 Z', BLUE, C.ink, 1.2)), ground),
  'arme.knekt': all(shoulder(48, 1, '#8a8a7a', path('M-15 -63 L15 -63 L10 -70 L0 -67 L-10 -70 Z M-9 -64 C-8 -74 8 -74 9 -64 Z', '#4a3a2a', C.ink, 1.2), 'calm', false), ellipse(50, 110, 22, 5, 'none', HL, 2.4), greyed(rider(100, 112, 0.5, C.grey, '', { flip: true })), ground),
  'arme.dragon': all(at(36, 108, 0.75, horseL()), karo(84, 0.9, 'angry', tricorn()), gun(80, 70, 116, 64), reach(84, 0.9, 1, 92, 70), reach(84, 0.9, -1, 104, 66), path('M44 58 C52 50 64 52 70 60', 'none', HL, 2), path('M70 54 L72 62 L64 62 Z', HL, HL, 1), ground),
  'arme.grenadjär': all(soldier(44, 0.88, BLUE, mitre(), 'angry', cuffs()), reach(44, 0.88, 1, 64, 30), at(66, 26, 1, ball(0, 0, 5), path('M0 -5 C2 -10 -2 -12 2 -15', 'none', '#c9a46a', 1.6), flash(2, -16, 0.3)), dash('M70 26 C86 16 100 22 108 36', C.grey), ring(44, 36, 13), ground),
  'arme.värja': all(g('translate(40 60) rotate(-40)', path('M0 -54 L2 -50 L2 22 L-2 22 L-2 -50 Z', STEEL, C.ink, 1.2), path('M-10 22 C-12 32 12 32 10 22 Z', C.gold, C.ink, 1.2), line('M-12 24 L12 24', C.gold, 2.2), rect(-2, 26, 4, 12, WOOD, 1, C.ink, 1), circle(0, 40, 3, C.gold, C.ink, 1)), ellipse(40, 58, 18, 46, 'none', HL, 2.4).replace('/>', ' transform="rotate(-40 40 58)"/>'),
    greyed(g('translate(96 64) rotate(10)', path('M0 -44 L7 -36 L7 18 L-7 18 L-7 -36 Z', C.grey2, C.ink, 1.2), rect(-12, 18, 24, 5, C.grey, 1, C.ink, 1), rect(-3, 23, 6, 12, C.grey, 1, C.ink, 1)))),
  'arme.tsar': all(...[[20, 40], [100, 40]].map(([a, b]) => at(a!, b!, 1, rect(-8, 0, 16, 40, '#e8d8b8', 0, C.ink, 1.2), path('M-8 0 C-10 -10 0 -14 0 -22 C0 -14 10 -10 8 0 Z', '#3f8f52', C.ink, 1.2))), fig(60, '#3f6a3a', 'calm', { h: 0.9, bottom: '#2b2a33' }), on(60, 0.9, crownR(), path('M-16 -42 L16 -42 L20 46 L-20 46 Z', '#8a2a3a', C.ink, 1.4), path('M-16 -42 L-12 46 M16 -42 L12 46', 'none', C.white, 3)), ring(60, 32, 17), ground),
  'arme.fältpräst': all(soldier(30, 1, '#2b2a33', '', 'calm', all(path('M-4 -42 L4 -42 L3 -32 L-3 -32 Z', C.white, C.ink, 0.8))), at(30, 112, 1, rect(0, 0, 0, 0, 'none', 0, null)), reach(30, 1, 1, 50, 62, '#2b2a33'), rect(46, 56, 14, 10, '#7a3a2a', 1, C.ink, 1.2), ...[0, 1, 2].map((i) => all(sol(74 + i * 14, 96, BLUE, 1, { flip: true }), path(`M${70 + i * 14} 100 l3 -6 l3 6`, 'none', C.skin, 1.6))), ellipse(32, 110, 20, 5, 'none', HL, 2.4), ground),
  'arme.återtåg': all(rect(4, 80, 112, 32, SNOW, 0, null), ...[[14, 54], [100, 50]].map(([a, b]) => fir(a!, b! + 30, 0.8, true)), ...[0, 1, 2, 3].map((i) => sol(26 + i * 20, 70 + (i % 2) * 4, BLUE, 1, { flip: true, gun: true, up: true })), arrow(100, 26, 20, 26, HL, 3.4), ...[[30, 14], [64, 8], [94, 16], [50, 40], [84, 44]].map(([a, b]) => flake(a!, b!, 1)), path('M30 100 l6 0 M50 104 l6 0 M70 100 l6 0 M90 104 l6 0', 'none', '#c9d6e2', 2)),
  'arme.förfrusen': all(rect(4, 84, 112, 28, SNOW, 0, null), karo(44, 0.95, 'sick', karpus()), at(44, 112, 1, rect(0, 0, 0, 0, 'none', 0, null)), circle(28, 72, 5, '#e6eef8', HL, 2), circle(60, 72, 5, '#e6eef8', HL, 2), ...[[18, 18], [78, 12], [96, 36], [24, 46], [104, 64]].map(([a, b]) => flake(a!, b!, 1.3)), at(96, 96, 1, rect(-3, -24, 6, 30, C.white, 3, C.ink, 1.2), circle(0, 8, 5, '#5aa7d6', C.ink, 1.2), rect(-1.4, -4, 2.8, 10, '#5aa7d6', 0, null)), ground),
  'arme.fångenskap': all(rect(18, 30, 64, 82, '#d8cfbd', 0, null), karo(50, 0.85, 'frown', ''), ...Array.from({ length: 7 }, (_, i) => line(`M${22 + i * 9.6} 30 L${22 + i * 9.6} 112`, '#7a4a20', 3.4)), line('M18 30 L82 30 M18 72 L82 72', '#7a4a20', 3.4), rect(14, 26, 72, 88, 'none', 4, HL, 2.4), greyed(shoulder(102, 0.75, C.grey, kepi(), 'calm', true)), ground),
};
