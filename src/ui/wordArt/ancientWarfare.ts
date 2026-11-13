/**
 * Historia & humaniora → Krig & militärhistoria → Forntida krigföring, 2001–2007 (0.37): bronze-age weapons,
 * ancient infantry, the Greek phalanx, Roman legions, ancient cavalry, campaigns and supply, command and
 * formations. The pictures share a few signs: bronze weapons and helmets (Greek helmets with a red crest,
 * Roman silver helmets, a red transverse crest for the centurion), round bronze shields and red Roman
 * shields, side-view horses and riders, and battle maps seen from above where our army is blue blocks of
 * dots and the enemy is red. The thing the word names is coloured or ringed in orange; a grey copy stands
 * beside it where a contrast helps. Digits only; no words and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { type Build } from './figures';
import { HL, arm } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Colours and geometry ─────────────────────────────────────────────
const BRONZE = '#c8893a';
const BRONZE2 = '#9a6428';
const RED = '#c0392b';
const BLUE = '#3f6fb5';
const FOE = '#c8463a';
const WOOD = '#8a5a2e';
const GRASS = '#e2ebc6';
const HILL = '#b9cf8e';
const ROAD = '#e6d7ae';
const TUNIC = '#b8322a';
const HORSE = '#9a6438';
const HAY = '#e8c870';
const CANVAS = '#e8dcbc';
const f1 = (n: number) => n.toFixed(1);
const ground = line('M4 112 L116 112', C.grey2, 2);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const lo = (d: string, col: string, w: number) => line(d, C.ink, w + 2) + line(d, col, w);
/** Shoulder positions of a standing figure (figures.ts) at x with height factor h. */
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, hy: ty - 56 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
/** An arm from the shoulder (side −1 = picture-left) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, 3 * Math.max(0.6, h), C.skin, C.ink, 1.2)); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };

// ── Head wear (figure coordinates) ───────────────────────────────────
const helmG = (crest: string = RED) => all(path('M-10 -66 C-6 -82 6 -82 10 -66', 'none', C.ink, 7), path('M-10 -66 C-6 -82 6 -82 10 -66', 'none', crest, 5), path('M-11.5 -56 C-12 -72 12 -72 11.5 -56 L11.5 -45 L6 -45 L5 -55 L-5 -55 L-6 -45 L-11.5 -45 Z', BRONZE, C.ink, 1.6));
const helmR = (plume = true) => all(plume ? rect(-2, -78, 4, 10, RED, 1, C.ink, 0.8) : '', path('M-11 -56 C-11 -72 11 -72 11 -56 Z', C.silver, C.ink, 1.5), path('M-11 -57 L-12.5 -48 L-8.5 -46 L-8 -56 Z M11 -57 L12.5 -48 L8.5 -46 L8 -56 Z', C.silver, C.ink, 1));
const helmC = () => all(ellipse(0, -70, 16, 4.5, RED, C.ink, 1.3), helmR(false));
const helmB = () => all(path('M-10.5 -56 C-10.5 -72 10.5 -72 10.5 -56 Z', BRONZE, C.ink, 1.5), circle(0, -68, 2.2, BRONZE2, C.ink, 0.8), line('M-10 -58 L10 -58', BRONZE2, 1.2));
const capeL = (col: string = RED) => path('M-14 -42 C-20 -20 -22 10 -20 34 L20 34 C22 10 20 -20 14 -42 Z', col, C.ink, 1.6);
const beardL = (col: string = '#e2e2e2') => path('M-7.5 -53 C-7 -41 7 -41 7.5 -53 C4 -50 -4 -50 -7.5 -53 Z', col, C.ink, 1);
const discsL = () => all(...[-30, -22, -14].map((y) => circle(0, y, 3, C.gold, C.ink, 0.8)));

// ── Weapons and gear (picture coordinates) ───────────────────────────
const spear = (x1: number, y1: number, x2: number, y2: number, tip: string = BRONZE, w = 2.2) => { const a = Math.atan2(y2 - y1, x2 - x1); return all(line(`M${x1} ${y1} L${x2} ${y2}`, WOOD, w), g(`translate(${x2} ${y2}) rotate(${f1(a * 180 / Math.PI)})`, path('M-1 -3.2 L9 0 L-1 3.2 Z', tip, C.ink, 0.8))); };
const dagger = (x: number, y: number, s = 1, rot = 0, col: string = BRONZE) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M0 -30 L5 -8 L4 0 L-4 0 L-5 -8 Z', col, C.ink, 1.3), line('M0 -26 L0 -2', BRONZE2, 1), rect(-8, 0, 16, 3.4, WOOD, 1, C.ink, 1), rect(-2.2, 3.4, 4.4, 10, WOOD, 1, C.ink, 1), circle(0, 15, 3, col, C.ink, 1));
const longSword = (x: number, y: number, s = 1, rot = 0, col: string = C.silver) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M0 -66 L4 -58 L4 0 L-4 0 L-4 -58 Z', col, C.ink, 1.3), line('M0 -58 L0 -3', C.grey, 1), rect(-10, 0, 20, 3.4, WOOD, 1, C.ink, 1), rect(-2.2, 3.4, 4.4, 11, WOOD, 1, C.ink, 1), circle(0, 16, 3, col, C.ink, 1));
const gladius = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M0 -40 L5 -32 L5 0 L-5 0 L-5 -32 Z', C.silver, C.ink, 1.3), line('M0 -33 L0 -3', C.grey, 1), rect(-8, 0, 16, 4, '#e9dcc0', 2, C.ink, 1), rect(-2.6, 4, 5.2, 9, WOOD, 1, C.ink, 1), circle(0, 15, 4, '#e9dcc0', C.ink, 1));
const axeHead = (col: string = BRONZE) => path('M-2 -6 C4 -8 10 -12 14 -16 C17 -6 17 6 14 16 C10 12 4 8 -2 6 Z', col, C.ink, 1.3);
const battleAxe = (x: number, y: number, s = 1, rot = 0, col: string = BRONZE) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, lo('M0 -36 L0 36', WOOD, 3), g('translate(0 -28)', axeHead(col)), path('M0 -32 L-7 -28 L0 -24 Z', col, C.ink, 1));
const roundShield = (x: number, y: number, r = 14, col: string = BRONZE) => all(circle(x, y, r, col, C.ink, 1.6), circle(x, y, r * 0.72, 'none', BRONZE2, 1.2), circle(x, y, r * 0.18, BRONZE2, null));
const scutum = (x: number, y: number, s = 1, col: string = TUNIC) => at(x, y, s, rect(-11, -18, 22, 36, col, 5, C.ink, 1.6), line('M-11 -10 L11 -10 M-11 10 L11 10', C.gold, 1.4), circle(0, 0, 4.2, C.gold, C.ink, 1));
const bow = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -24 C10 -14 10 14 0 24', 'none', WOOD, 3), line('M0 -24 L0 24', C.ink, 0.8));
const coin = (x: number, y: number, r = 4.5) => all(circle(x, y, r, C.gold, C.ink, 1.1), circle(x, y, r * 0.55, 'none', '#b88a20', 0.9));
const coins = (x: number, y: number, n = 4) => all(...Array.from({ length: n }, (_, i) => ellipse(x, y - i * 3, 7, 2.6, C.gold, C.ink, 1)));
const banner = (x: number, y: number, col: string = RED, s = 1) => at(x, y, s, lo('M0 0 L0 -44', WOOD, 2), path('M0 -44 L16 -40 L0 -34 Z', col, C.ink, 1.2));
const standard = (x: number, y: number, s = 1) => at(x, y, s, lo('M0 6 L0 -58', WOOD, 2.4), line('M-8 -50 L8 -50', WOOD, 2), rect(-8, -50, 16, 14, RED, 1, C.ink, 1.2), line('M-6 -38 L-6 -34 M0 -38 L0 -34 M6 -38 L6 -34', C.gold, 1.4), ...[-26, -18, -10].map((yy) => circle(0, yy, 3.6, C.gold, C.ink, 0.9)), path('M-6 -58 C-3 -64 3 -64 6 -58 Z', C.gold, C.ink, 1));
const eagleIcon = (x: number, y: number, s = 1, col: string = C.gold) => at(x, y, s, path('M0 -6 C-6 -14 -16 -14 -22 -8 C-14 -8 -8 -4 -4 2 Z M0 -6 C6 -14 16 -14 22 -8 C14 -8 8 -4 4 2 Z', col, C.ink, 1.2), ellipse(0, 0, 4, 7, col, C.ink, 1.2), circle(0, -8, 3, col, C.ink, 1), path('M2 -8 L5 -7 L2 -6 Z', C.orange, null));
const tent = (x: number, y: number, s = 1, col: string = CANVAS) => at(x, y, s, path('M-16 0 L-12 -18 L12 -18 L16 0 Z', col, C.ink, 1.4), path('M-12 -18 L0 -24 L12 -18 Z', col, C.ink, 1.2), path('M-4 0 L0 -14 L4 0 Z', '#7a5a34', C.ink, 1));
const fire = (x: number, y: number, s = 1) => at(x, y, s, line('M-7 1 L7 -1 M-7 -1 L7 1', WOOD, 2.4), path('M-6 0 C-8 -6 -3 -8 -2 -14 C1 -9 6 -8 6 -3 C7 -1 6 0 6 0 Z', C.orange, C.ink, 1), path('M-3 0 C-3 -4 0 -5 0 -8 C2 -5 3 -3 3 0 Z', C.yellow, null));
const sack = (x: number, y: number, s = 1, col = '#d9c08a') => at(x, y, s, path('M-8 10 C-11 0 -9 -6 -4 -8 L-5 -12 L5 -12 L4 -8 C9 -6 11 0 8 10 Z', col, C.ink, 1.3), line('M-5 -8.5 L5 -8.5', '#8a6a3a', 1.4));
const barrel = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 -12 C-11 -4 -11 4 -8 12 L8 12 C11 4 11 -4 8 -12 Z', '#a8743f', C.ink, 1.3), line('M-9.6 -6 L9.6 -6 M-9.6 6 L9.6 6', '#5e3a1a', 1.4));
const loaf = (x: number, y: number, s = 1) => at(x, y, s, path('M-9 3 C-10 -6 10 -6 9 3 Z', '#d99a4e', C.ink, 1.2), line('M-4 -3 L-2 1 M1 -3 L3 1', '#a0673d', 1));
const fish = (x: number, y: number, s = 1) => at(x, y, s, path('M-10 0 C-4 -6 6 -6 9 0 C6 6 -4 6 -10 0 Z', '#b9a37a', C.ink, 1.1), path('M9 0 L15 -5 L15 5 Z', '#b9a37a', C.ink, 1), circle(-6, -1, 0.9, C.ink, null));
const hay = (x: number, y: number, s = 1) => at(x, y, s, path('M-18 0 C-18 -14 -8 -20 0 -20 C8 -20 18 -14 18 0 Z', HAY, C.ink, 1.4), ...[-12, -6, 0, 6, 12].map((xx) => line(`M${xx} -2 L${xx + 2} -14`, '#c8a040', 1)));
const wheel = (x: number, y: number, r = 7) => all(circle(x, y, r, '#a8743f', C.ink, 1.4), line(`M${x - r} ${y} L${x + r} ${y} M${x} ${y - r} L${x} ${y + r}`, '#5e3a1a', 1.1), circle(x, y, 1.6, '#5e3a1a', null));
const wagon = (x: number, y: number, s = 1, load: Svg = '') => at(x, y, s, load, rect(-22, -16, 44, 10, '#a8743f', 1, C.ink, 1.4), line('M22 -10 L34 -6', WOOD, 2), wheel(-12, -6), wheel(12, -6));
const bush = (x: number, y: number, s = 1) => at(x, y, s, circle(-8, -6, 8, '#5f9e58', C.ink, 1.3), circle(6, -8, 9, '#5f9e58', C.ink, 1.3), circle(0, -2, 8, '#6fae64', C.ink, 1.3));
const tree = (x: number, y: number, s = 1) => at(x, y, s, rect(-2, -14, 4, 14, '#7a4a20', 1, C.ink, 1), circle(0, -20, 10, '#5f9e58', C.ink, 1.4));
const hillAt = (x: number, y: number, w: number, h: number, col: string = HILL) => path(`M${x - w / 2} ${y} C${x - w / 4} ${y - h} ${x + w / 4} ${y - h} ${x + w / 2} ${y} Z`, col, C.ink, 1.4);
const mountain = (x: number, y: number, w: number, h: number) => all(path(`M${x - w / 2} ${y} L${x} ${y - h} L${x + w / 2} ${y} Z`, '#9a8f7a', C.ink, 1.4), path(`M${f1(x - w * 0.12)} ${f1(y - h * 0.76)} L${x} ${y - h} L${f1(x + w * 0.12)} ${f1(y - h * 0.76)} Z`, C.white, C.ink, 0.8));
const city = (x: number, y: number, s = 1, col: string = '#d8cfbd') => at(x, y, s, rect(-16, -12, 32, 12, col, 0, C.ink, 1.3), rect(-20, -18, 8, 18, col, 0, C.ink, 1.3), rect(12, -18, 8, 18, col, 0, C.ink, 1.3), rect(-3, -7, 6, 7, C.dark, 2, null));
const flake = (x: number, y: number, s = 1) => at(x, y, s, line('M0 -4 L0 4 M-3.5 -2 L3.5 2 M-3.5 2 L3.5 -2', '#5aa7d6', 1.2));
const dust = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 4, '#e5dccb', C.grey, 0.8), circle(-6, 2, 3, '#e5dccb', C.grey, 0.8), circle(-11, 0, 2.2, '#e5dccb', C.grey, 0.8));
const speed = (x: number, y: number) => line(`M${x} ${y} L${x - 14} ${y} M${x + 2} ${y + 7} L${x - 10} ${y + 7} M${x} ${y + 14} L${x - 14} ${y + 14}`, C.grey, 1.6);
const ring = (x: number, y: number, r: number) => circle(x, y, r, 'none', HL, 2.4);
const dashBox = (x: number, y: number, w: number, h: number) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="none" stroke="${HL}" stroke-width="2.2" stroke-dasharray="5 3"/>`;
const hourglass = (x: number, y: number, s = 1) => at(x, y, s, rect(-7, -12, 14, 2.6, WOOD, 1, C.ink, 0.9), rect(-7, 9.4, 14, 2.6, WOOD, 1, C.ink, 0.9), path('M-5 -9.4 L5 -9.4 L0.8 0 L5 9.4 L-5 9.4 L-0.8 0 Z', '#dff0fa', C.ink, 1), path('M-3 7.6 L3 7.6 L0 3 Z M-3.6 -7 L3.6 -7 L0 -2 Z', HAY, null));
const crossed = (x: number, y: number, s = 1) => at(x, y, s, longSword(0, 0, 0.3, 40), longSword(0, 0, 0.3, -40));

// ── People ───────────────────────────────────────────────────────────
/** A standing soldier: figure + head wear (+ extra figure-coordinate drawings in front). */
const soldier = (x: number, h = 1, top: string = TUNIC, head: Svg = helmR(), mood: Mood = 'calm', extra: Svg = '', more: Partial<Build> = {}) => all(fig(x, top, mood, { h, bottom: '#6b5a44', ...more }), on(x, h, head, extra));
/** Side-view head-and-shoulders soldier facing right; (x, y) = head centre. */
const sol = (x: number, y: number, col: string, s = 1, o: { helm?: string; shield?: string; spear?: boolean; grey?: boolean; flip?: boolean; crest?: boolean } = {}) => {
  const grey = o.grey ?? false, c = grey ? C.grey : col, sk = grey ? C.grey2 : C.skin, hm = grey ? C.grey : (o.helm ?? BRONZE);
  return g(`translate(${x} ${y}) scale(${o.flip ? -s : s} ${s})`,
    o.spear ? line('M7 18 L7 -20', grey ? C.grey : WOOD, 1.8) : '', o.spear ? path('M5 -20 L7 -28 L9 -20 Z', grey ? C.grey : BRONZE, C.ink, 0.6) : '',
    path('M-9 16 C-9 5 9 5 9 16 Z', c, C.ink, 1.3), circle(0, -1, 6.2, sk, C.ink, 1.3), circle(2.8, -1.6, 0.9, C.ink, null),
    o.crest ? path('M-6 -6 C-4 -14 4 -14 6 -6', 'none', grey ? C.grey : RED, 2.6) : '',
    path('M-6.8 -2 C-6.8 -11 6.8 -11 6.8 -2 Z', hm, C.ink, 1.1),
    o.shield ? circle(4, 10, 6.4, grey ? C.grey2 : o.shield, C.ink, 1.2) : '');
};
const row = (x: number, y: number, n: number, gap: number, col: string, s = 1, o: Parameters<typeof sol>[4] = {}) => all(...Array.from({ length: n }, (_, i) => sol(x + i * gap, y, col, s, o)));

// ── Horses and riders (local coordinates: hooves on y = 0, facing right) ──
const horseL = (col: string = HORSE, gallop = false, ears = false) => all(
  gallop ? lo('M-14 -22 L-24 -8 M-8 -22 L-14 -4 M9 -22 L20 -10 M15 -22 L28 -16', col, 3.6) : lo('M-14 -22 L-15 -1 M-7 -22 L-7 -1 M9 -22 L9 -1 M15 -22 L17 -1', col, 3.6),
  ellipse(0, -30, 20, 10, col, C.ink, 1.6), path('M14 -36 L22 -52 C24 -56 30 -56 32 -52 L34 -46 C34 -43 31 -42 29 -44 L24 -42 L20 -28 Z', col, C.ink, 1.6),
  circle(27, -50, 1.1, C.ink, null), ears ? path('M22 -53 L19 -66 L25 -55 Z M25 -54 L25 -67 L28 -55 Z', col, C.ink, 1.1) : path('M18 -46 L21 -56 L26 -54', 'none', '#4a2e1a', 2.4), path('M-19 -32 C-27 -30 -28 -18 -25 -12', 'none', ears ? C.ink : '#4a2e1a', ears ? 1.4 : 3));
/** A rider sitting on horseL; armL = the rider's arm to the reins (or to (ax, ay)). */
const riderL = (top: string = TUNIC, head: 'greek' | 'roman' | 'none' | 'cap' = 'none', o: { ax?: number; ay?: number; grey?: boolean } = {}) => {
  const sk = o.grey ? C.grey2 : C.skin, tp = o.grey ? C.grey : top, ax = o.ax ?? 18, ay = o.ay ?? -48;
  const hd = head === 'greek' ? all(path('M-6 -78 C-2 -86 4 -86 7 -78', 'none', o.grey ? C.grey : RED, 3), path('M-7.5 -70 C-7.5 -81 7.5 -81 7.5 -70 L7.5 -66 L-7.5 -66 Z', o.grey ? C.grey : BRONZE, C.ink, 1.2))
    : head === 'roman' ? path('M-7.5 -70 C-7.5 -81 7.5 -81 7.5 -70 Z', o.grey ? C.grey : C.silver, C.ink, 1.2)
    : head === 'cap' ? path('M-7.5 -70 C-7.5 -81 7.5 -81 7.5 -70 L9 -69 Z', o.grey ? C.grey : '#7a5236', C.ink, 1.1)
    : path('M-7 -71 C-7 -79 7 -79 7 -71 C3 -74 -3 -74 -7 -71 Z', o.grey ? C.grey : C.hair, C.ink, 1);
  return all(lo('M-3 -40 L5 -28 L3 -16', o.grey ? C.grey : '#6b5a44', 4.2), line('M3 -16 L9 -15', C.black, 3),
    path('M-7 -38 L7 -38 L6 -60 L-6 -60 Z', tp, C.ink, 1.6), rect(-2.5, -65, 5, 6, sk, 1.5, C.ink, 1.1), circle(0, -70, 7, sk, C.ink, 1.5), circle(3.2, -71, 1, C.ink, null), hd,
    arm(3, -56, ax, ay), circle(ax, ay, 2.6, sk, C.ink, 1.1), line(`M${ax} ${ay} L28 -44`, '#4a2e1a', 1.2));
};
const rider = (x: number, y: number, s = 1, top: string = TUNIC, head: Parameters<typeof riderL>[1] = 'none', more: Svg = '', o: { gallop?: boolean; col?: string; ax?: number; ay?: number; grey?: boolean; flip?: boolean } = {}) =>
  g(`translate(${x} ${y}) scale(${o.flip ? -s : s} ${s})`, o.grey ? greyed(horseL(o.col, o.gallop)) : horseL(o.col, o.gallop), riderL(top, head, { ax: o.ax, ay: o.ay, grey: o.grey }), more);
const grazeL = (col: string = HORSE) => all(lo('M-14 -22 L-15 -1 M-7 -22 L-7 -1 M9 -22 L9 -1 M15 -22 L17 -1', col, 3.6), ellipse(0, -30, 20, 10, col, C.ink, 1.6),
  path('M12 -38 L28 -18 L32 -15 C36 -13 38 -7 36 -3 L30 -2 C28 -4 26 -8 24 -12 L16 -24 Z', col, C.ink, 1.6), circle(30, -11, 1.1, C.ink, null), path('M22 -22 L22 -28 L27 -22', 'none', '#4a2e1a', 2), path('M-19 -32 C-27 -30 -28 -18 -25 -12', 'none', '#4a2e1a', 3));
const elephantL = () => all(lo('M-16 -20 L-16 -1 M-6 -20 L-6 -1 M10 -20 L10 -1 M18 -20 L18 -1', '#9aa0a8', 6), ellipse(0, -30, 24, 15, '#a5abb3', C.ink, 1.6),
  path('M18 -42 C30 -48 38 -40 36 -28 C36 -18 40 -10 44 -6 L40 -4 C34 -10 30 -18 28 -24 L20 -22 Z', '#a5abb3', C.ink, 1.6), path('M20 -40 C12 -36 12 -26 20 -24 Z', '#959ba3', C.ink, 1.2),
  circle(30, -38, 1.3, C.ink, null), path('M33 -28 C38 -26 42 -26 46 -30', 'none', C.white, 2.6), path('M-24 -30 C-28 -26 -28 -20 -26 -16', 'none', C.ink, 1.4));

// ── Battle maps (seen from above) ────────────────────────────────────
const field = (col: string = GRASS) => rect(4, 6, 112, 106, col, 6, C.grey2, 1.2);
/** A block of soldiers seen from above: coloured rectangle with rows of heads. */
const block = (x: number, y: number, w: number, h: number, col: string = BLUE, o: { hl?: boolean; grey?: boolean; dot?: string } = {}) => {
  const c = o.grey ? C.grey2 : col, cols = Math.max(1, Math.floor((w - 2) / 5)), rows = Math.max(1, Math.floor((h - 2) / 5));
  const dx = w / cols, dy = h / rows;
  return all(rect(x, y, w, h, c, 1.5, o.hl ? HL : C.ink, o.hl ? 2.4 : 1.1), ...Array.from({ length: rows * cols }, (_, i) => circle(+f1(x + dx * (i % cols + 0.5)), +f1(y + dy * (Math.floor(i / cols) + 0.5)), 1.3, o.dot ?? (o.grey ? C.grey : C.white), null)));
};
/** Cavalry block: like block, with a small horse head on top. */
const cavBlock = (x: number, y: number, w: number, h: number, col: string = BLUE, o: { hl?: boolean; grey?: boolean } = {}) => all(rect(x, y, w, h, o.grey ? C.grey2 : col, 1.5, o.hl ? HL : C.ink, o.hl ? 2.4 : 1.1),
  ...Array.from({ length: Math.max(1, Math.floor(w / 6)) }, (_, i) => ellipse(+f1(x + (w / Math.max(1, Math.floor(w / 6))) * (i + 0.5)), y + h / 2, 1.4, h / 2 - 2, o.grey ? C.grey : '#f3e3c0', null)),
  at(x + w / 2, y - 1, 0.32, o.grey ? greyed(horseHead()) : horseHead()));
const horseHead = () => path('M-8 0 L-2 -18 C0 -22 6 -22 8 -18 L10 -12 C10 -9 7 -8 5 -10 L0 -8 L2 0 Z', HORSE, C.ink, 2.4);

// ── Speech bubble beside the head ────────────────────────────────────
const pawn = (x: number, y: number, col: string) => all(ellipse(x, y, 4.6, 1.8, col, C.ink, 1), path(`M${x - 3} ${y - 1} L${x - 1.6} ${y - 7} L${x + 1.6} ${y - 7} L${x + 3} ${y - 1} Z`, col, C.ink, 1), circle(x, y - 8.6, 2.6, col, C.ink, 1));
const say = (cx: number, cy: number, w: number, h: number, tx: number, ty: number, inner: Svg = '') => {
  const L = cx - w / 2, R = cx + w / 2, Tp = cy - h / 2, B = cy + h / 2; let a: number[], b: number[];
  if (tx < L || tx > R) { const e = tx < L ? L : R, by = Math.max(Tp + 5, Math.min(B - 5, ty)); a = [e, by - 4]; b = [e, by + 4]; }
  else { const e = ty > cy ? B : Tp, bx = Math.max(L + 6, Math.min(R - 6, tx)); a = [bx - 4, e]; b = [bx + 4, e]; }
  return all(path(`M${a[0]} ${a[1]} L${tx} ${ty} L${b[0]} ${b[1]} Z`, C.white, C.ink, 1.4), rect(L, Tp, w, h, C.white, 5, C.ink, 1.4), path(`M${a[0]} ${a[1]} L${tx} ${ty} L${b[0]} ${b[1]} Z`, C.white, null), inner);
};

export const ANCIENT_WARFARE_MOTIFS: Record<string, Svg> = {
  // ── 2001 Bronsålderns vapen ──
  'fkrig.dolk': all(fig(34, '#b98a52', 'calm', { h: 1, bottom: '#6b5a44' }), on(34, 1, helmB()), reach(34, 1, 1, 58, 64), dagger(60, 60, 0.9, 30), ring(66, 50, 16),
    greyed(longSword(96, 92, 1.05, 0)), ground),
  'fkrig.hugga': all(fig(38, '#b98a52', 'angry', { bottom: '#6b5a44' }), reach(38, 1, 1, 60, 30), reach(38, 1, -1, 56, 36), battleAxe(66, 46, 0.75, 52, C.silver),
    path('M58 14 C76 14 90 30 92 52', 'none', HL, 2.4, ), path('M86 50 L92 56 L95 47', 'none', HL, 2.4), rect(78, 84, 34, 28, '#c9975c', 3, C.ink, 1.6), ellipse(95, 84, 17, 4, '#e3c08a', C.ink, 1.4), line('M95 80 L95 92', C.ink, 1.6),
    path('M100 70 l4 -4 l2 3 Z M88 72 l-3 -5 l4 0 Z', '#e3c08a', C.ink, 0.8), ground),
  'fkrig.klinga': all(g('translate(60 60) rotate(-30)', path('M0 -58 L6 -46 L6 10 L-6 10 L-6 -46 Z', C.silver, HL, 3), line('M0 -46 L0 8', C.grey, 1.2), greyed(rect(-16, 10, 32, 5, WOOD, 1, C.ink, 1.2), rect(-3.4, 15, 6.8, 18, WOOD, 1, C.ink, 1.2), circle(0, 35, 4.4, BRONZE, C.ink, 1.2)))),
  'fkrig.egg': all(g('translate(52 62) rotate(-30)', path('M0 -58 L8 -46 L8 10 L-6 10 L-6 -46 Z', C.grey2, C.ink, 1.4), line('M8 -46 L8 8 M0 -58 L8 -46', HL, 3.4), greyed(rect(-16, 10, 32, 5, WOOD, 1, C.ink, 1.2), rect(-3.4, 15, 6.8, 18, WOOD, 1, C.ink, 1.2))),
    path('M88 30 L104 22 L104 44 Z', '#a8d08a', C.ink, 1.2), path('M90 36 L106 48 L94 56 Z', '#a8d08a', C.ink, 1.2), path('M80 30 l4 -4 M83 36 l5 -1 M80 42 l4 3', 'none', HL, 1.6)),
  'fkrig.spjutspets': all(line('M14 108 L70 52', WOOD, 3), path('M68 54 L80 38 L84 42 Z', BRONZE, C.ink, 1), circle(80, 40, 10, 'none', C.grey, 1.4), line('M86 34 L92 28', C.grey, 1.4), circle(94, 26, 22, C.white, HL, 2.6),
    g('translate(94 26) rotate(-45) scale(2.2)', path('M-8 -3 L-8 3 M-8 0 L-4 0', 'none', WOOD, 2), path('M-4 -3.4 L8 0 L-4 3.4 Z', BRONZE, C.ink, 0.6), line('M-3 0 L6 0', BRONZE2, 0.5))),
  'fkrig.stridsyxa': all(soldier(40, 1, '#b98a52', helmB(), 'angry'), reach(40, 1, 1, 64, 52), battleAxe(66, 46, 0.9, 20), ring(74, 26, 16), greyed(at(98, 112, 0.7, rect(-14, -20, 28, 20, '#c9975c', 3, C.ink, 1.6), g('translate(0 -38) rotate(30)', lo('M0 -16 L0 16', WOOD, 2.4), g('translate(0 -12) scale(0.6)', axeHead(C.grey))))), ground),

  // ── 2002 Antikens infanteri ──
  'fkrig.infanteri': all(...[0, 1, 2].map((r) => row(14 + r * 6, 50 + r * 18, 6, 15, TUNIC, 0.95, { spear: true, shield: BRONZE })), line('M8 108 L112 108', C.grey2, 2),
    greyed(rider(96, 30, 0.42, C.grey, 'none')), ...[0, 1, 2].map((i) => path(`M${18 + i * 30} 104 l4 0 m4 0 l4 0`, 'none', C.grey, 1.4))),
  'fkrig.fotsoldat': all(soldier(40, 1, TUNIC, helmG(), 'calm'), reach(40, 1, -1, 22, 66), spear(22, 108, 22, 14), roundShield(58, 72, 13), ellipse(40, 110, 20, 5, 'none', HL, 2.4),
    greyed(rider(92, 112, 0.62, C.grey, 'none')), ground),
  'fkrig.trupp': all(circle(58, 66, 46, 'none', HL, 2.4), banner(30, 76, RED, 0.9), sol(36, 44, TUNIC, 1.1, { spear: true }), row(50, 46, 3, 16, TUNIC, 1.1, { spear: true, shield: BRONZE }), row(30, 74, 4, 16, TUNIC, 1.1, { spear: true, shield: BRONZE }), row(42, 100, 3, 16, TUNIC, 1, { shield: BRONZE }),
    greyed(sol(110, 100, C.grey, 0.8))),
  'fkrig.beväpnad': all(soldier(34, 1, TUNIC, helmG(), 'angry'), reach(34, 1, -1, 16, 60), spear(16, 108, 16, 12), roundShield(48, 72, 13), longSword(30, 100, 0.35, 0),
    greyed(fig(90, C.grey, 'shock', { bottom: C.grey }), reach(90, 1, -1, 72, 42), reach(90, 1, 1, 108, 42)), ground),
  'fkrig.kastspjut': all(fig(26, TUNIC, 'angry', { bottom: '#6b5a44' }), on(26, 1, helmG()), reach(26, 1, 1, 42, 18), line('M42 18 C60 6 80 8 96 26', C.grey, 1.4, '3 3'), spear(80, 18, 100, 34, BRONZE, 2.6), ring(92, 28, 14),
    greyed(roundShield(100, 96, 13)), ground),
  'fkrig.slunga': all(fig(34, '#b98a52', 'angry', { bottom: '#6b5a44' }), reach(34, 1, 1, 46, 16), `<circle cx="46" cy="16" r="13" fill="none" stroke="${C.grey}" stroke-width="1.4" stroke-dasharray="3 3"/>`,
    line('M46 16 L56 8', '#7a5236', 2), path('M54 6 C58 4 60 8 58 11 Z', '#7a5236', C.ink, 1), ring(52, 12, 11), circle(84, 32, 3.6, C.grey, C.ink, 1), line('M64 22 L78 30', C.grey, 1.4, '3 3'), greyed(rect(96, 50, 16, 62, '#d8cfbd', 1, C.ink, 1.2)), ground),
  'fkrig.bågskytt': all(fig(40, '#5f8f3a', 'calm', { bottom: '#6b5a44' }), reach(40, 1, 1, 76, 44), reach(40, 1, -1, 56, 44), bow(78, 44, 1.1), line('M78 17.6 L56 44 L78 70.4', C.ink, 0.8), line('M56 44 L96 44', WOOD, 1.6), path('M96 41 L104 44 L96 47 Z', C.grey, C.ink, 0.8),
    rect(14, 40, 8, 24, '#7a5236', 2, C.ink, 1.1), line('M16 40 L14 32 M19 40 L19 31 M21 40 L23 32', WOOD, 1.4), ground),
  'fkrig.legosoldat': all(soldier(50, 1, '#2f7f7a', helmG('#2f7f7a'), 'smile'), reach(50, 1, 1, 74, 66), coins(76, 64, 3), soldier(98, 0.8, '#7b3f8c', all(path('M-9 -64 L-9 -72 L-5 -67 L0 -74 L5 -67 L9 -72 L9 -64 Z', C.gold, C.ink, 1.2)), 'smile'), reach(98, 0.8, -1, 84, 56), coin(84, 52, 4),
    arrow(92, 38, 76, 50, C.gold, 2), greyed(banner(18, 112, C.grey, 1.2)), ground),
  'fkrig.värva.2': all(rect(54, 76, 40, 6, '#b98a52', 2, C.ink, 1.4), line('M58 82 L58 112 M90 82 L90 112', WOOD, 3), coins(66, 74, 3), rect(76, 68, 14, 8, '#f3e3b8', 1, C.ink, 1),
    soldier(80, 0.8, TUNIC, helmC(), 'smile'), fig(22, '#b98a52', 'smile', { h: 0.85, bottom: '#6b5a44' }), arrow(34, 52, 52, 52, HL, 2.6), row(96, 22, 2, 12, TUNIC, 0.8, { helm: C.silver }), ground),
  'fkrig.slagfält': all(rect(4, 70, 112, 42, '#cfe0a8', 0, null), hillAt(30, 70, 60, 14), hillAt(92, 70, 56, 12), banner(14, 70, BLUE, 0.7), banner(108, 70, FOE, 0.7),
    line('M30 104 L40 82 M70 108 L64 86 M92 100 L100 84', WOOD, 2.2), roundShield(50, 100, 7), at(84, 104, 0.5, scutum(0, 0, 1, C.grey)), roundShield(22, 92, 6, C.grey2), dust(64, 64, 1.4), dust(40, 60, 1.1), crossed(60, 46, 1.4), ground),
  'fkrig.seger': all(...[[22, 0.85], [50, 1], [80, 0.85]].map(([x, h]) => all(soldier(x!, h!, TUNIC, helmG(), 'laugh'), reach(x!, h!, 1, x! + 14, 30 + (1 - h!) * 40))), spear(64, 34, 64, 6), spear(94, 44, 94, 16), spear(36, 44, 36, 16),
    at(50, 4, 0.9, ...Array.from({ length: 7 }, (_, i) => { const a = Math.PI * (0.15 + i * 0.12); return ellipse(+f1(Math.cos(a) * 14), +f1(8 + Math.sin(a) * 6), 3, 1.6, '#5f8f3a', C.ink, 0.6); })),
    greyed(sol(104, 98, C.grey, 0.7, { flip: true }), sol(114, 102, C.grey, 0.6, { flip: true })), ground),

  // ── 2003 Grekiska falangen ──
  'fkrig.falang': all(...[0, 1, 2, 3].map((r) => all(...Array.from({ length: 6 }, (_, i) => spear(10 + i * 14 + r * 4, 92 - r * 8, 26 + i * 14 + r * 4, 70 - r * 8, BRONZE, 1.6)))),
    ...[3, 2, 1, 0].map((r) => all(...Array.from({ length: 6 }, (_, i) => all(sol(14 + i * 14 + r * 4, 76 - r * 8, TUNIC, 0.8, { crest: true }), roundShield(18 + i * 14 + r * 4, 88 - r * 8, 7.4))))), ground),
  'fkrig.hoplit': all(soldier(56, 1.05, TUNIC, helmG(), 'calm'), reach(56, 1.05, 1, 82, 60), spear(82, 110, 82, 8), roundShield(42, 74, 20), at(42, 74, 0.7, path('M-6 -6 L6 -6 L0 8 Z', RED, C.ink, 1)), ground),
  'fkrig.sköldmur': all(...Array.from({ length: 7 }, (_, i) => sol(14 + i * 15.4, 52, TUNIC, 1, { crest: true })), ...Array.from({ length: 7 }, (_, i) => roundShield(14 + i * 15.4, 76, 11)), rect(4, 66, 112, 22, 'none', 0, HL, 0),
    ...[[30, 20], [62, 14], [96, 22]].map(([x, y]) => g(`translate(${x} ${y}) rotate(70)`, line('M-10 0 L8 0', WOOD, 1.6), path('M8 -2.6 L13 0 L8 2.6 Z', C.grey, C.ink, 0.6))), path('M60 64 l-4 -6 M64 64 l4 -6', 'none', C.grey, 1.4), line('M6 92 L114 92', HL, 2.4), ground),
  'fkrig.stridslinje': all(field(), ...Array.from({ length: 6 }, (_, i) => block(10 + i * 17, 76, 15, 10, BLUE)), dashBox(7, 72, 106, 18), ...Array.from({ length: 6 }, (_, i) => block(10 + i * 17, 26, 15, 10, FOE, { grey: true })),
    ...[20, 60, 100].map((x) => arrow(x, 68, x, 46, BLUE, 2.2))),
  'fkrig.slagordning': all(field(), block(10, 26, 100, 8, FOE, { grey: true }), cavBlock(12, 64, 16, 12), block(34, 60, 16, 16), block(52, 60, 16, 16), block(70, 60, 16, 16), cavBlock(92, 64, 16, 12), block(44, 90, 32, 10), dashBox(8, 54, 104, 52)),
  'fkrig.flank': all(field(), block(18, 42, 52, 34, BLUE), line('M71 42 L71 76', HL, 4), arrow(108, 59, 78, 59, FOE, 3.4), cavBlock(96, 72, 14, 10, FOE), greyed(block(18, 12, 52, 10, FOE)), path('M76 38 C84 30 92 32 96 40', 'none', HL, 1.6, )),
  'fkrig.rycka-fram': all(...Array.from({ length: 5 }, (_, i) => all(soldier(14 + i * 20, 0.62, TUNIC, helmG(), 'calm'), spear(22 + i * 20, 70, 32 + i * 20, 38, BRONZE, 1.6))), arrow(20, 22, 104, 22, HL, 3.6),
    ...[0, 1, 2, 3, 4].map((i) => path(`M${6 + i * 20} 110 l3 0`, 'none', C.grey, 1.6)), ground),

  // ── 2004 Romerska legioner ──
  'fkrig.legion': all(field(), ...[0, 1, 2, 3].map((i) => block(14 + i * 24, 40, 18, 14, TUNIC)), ...[0, 1, 2].map((i) => block(26 + i * 24, 62, 18, 14, TUNIC)), ...[0, 1, 2].map((i) => block(26 + i * 24, 84, 18, 14, TUNIC)), dashBox(9, 34, 102, 70), eagleIcon(60, 22, 0.9)),
  'fkrig.legionär': all(soldier(56, 1.05, TUNIC, helmR(), 'calm', all(line('M-12 -20 L12 -20', '#6b4220', 3))), scutum(38, 74, 1.1), reach(56, 1.05, 1, 80, 60), line('M80 108 L80 20', WOOD, 2.2), path('M78.6 20 L80 4 L81.4 20 Z', C.grey, C.ink, 0.8), ground),
  'fkrig.centurion': all(soldier(40, 1.05, TUNIC, helmC(), 'angry', discsL()), reach(40, 1.05, 1, 62, 50), lo('M60 66 L66 34', '#8a5a2e', 2), say(86, 20, 26, 16, 54, 22, path('M80 20 L92 20 M88 16 L92 20 L88 24', 'none', C.ink, 1.8)),
    greyed(row(70, 92, 3, 15, C.grey, 0.9, { helm: C.grey })), ground),
  'fkrig.kohort': all(field(), ...[0, 1, 2, 3].map((i) => block(14 + i * 24, 40, 18, 14, TUNIC, { grey: true })), ...[0, 1, 2].map((i) => block(26 + i * 24, 62, 18, 14, TUNIC, { grey: i !== 1, hl: i === 1 })), ...[0, 1, 2].map((i) => block(26 + i * 24, 84, 18, 14, TUNIC, { grey: true })), greyed(eagleIcon(60, 22, 0.9))),
  'fkrig.fälttecken': all(soldier(44, 1, TUNIC, helmR(), 'calm', all(path('M-10 -64 C-8 -76 8 -76 10 -64 Z', '#7a5236', C.ink, 1))), reach(44, 1, 1, 72, 60), standard(72, 104, 1.45), ring(72, 34, 26), ground),
  'fkrig.örn': all(mountain(30, 112, 52, 46), mountain(84, 112, 60, 36), at(60, 40, 2.2, path('M0 -2 C-6 -12 -18 -14 -26 -6 C-20 -6 -16 -4 -14 0 C-18 0 -20 2 -22 4 C-14 4 -8 4 -4 6 Z M0 -2 C6 -12 18 -14 26 -6 C20 -6 16 -4 14 0 C18 0 20 2 22 4 C14 4 8 4 4 6 Z', '#7a5236', C.ink, 0.7), ellipse(0, 2, 4, 8, '#7a5236', C.ink, 0.7), circle(0, -6, 3.4, C.white, C.ink, 0.7), path('M2 -6 L5.4 -5 L2 -3.6 Z', C.yellow, C.ink, 0.4), circle(0.8, -6.6, 0.6, C.ink, null), path('M-3 10 L0 14 L3 10 Z', '#7a5236', C.ink, 0.6))),
  'fkrig.kortsvärd': all(gladius(46, 84, 1.3, 0), greyed(longSword(88, 92, 1.1, 0)), line('M20 108 L104 108', C.grey2, 1.4), line('M24 104 L24 112 M104 104 L104 112', C.grey2, 1.4)),
  'fkrig.läger': all(rect(4, 60, 112, 52, '#cfe0a8', 0, null), path('M10 70 L110 70 L110 108 L10 108 Z', '#e9dfc4', null), ...Array.from({ length: 21 }, (_, i) => line(`M${10 + i * 5} 66 L${10 + i * 5} 72`, WOOD, 2.2)), line('M10 70 L52 70 M68 70 L110 70', WOOD, 1.6),
    ...[[26, 86], [46, 86], [74, 86], [94, 86], [26, 104], [46, 104], [74, 104], [94, 104]].map(([x, y]) => tent(x!, y!, 0.75)), fire(60, 100, 0.8), banner(60, 92, RED, 0.6), line('M52 70 L52 62 M68 70 L68 62', WOOD, 3), ground),
  'fkrig.veteran': all(soldier(40, 1, TUNIC, helmR(), 'calm', all(discsL(), beardL(), line('M5 -60 L9 -52', '#c0392b', 1.2))), reach(40, 1, -1, 18, 66), lo('M18 64 L16 110', WOOD, 2.2),
    on(40, 1, path('M-11 -56 C-12 -48 -10 -46 -9 -44 M11 -56 C12 -48 10 -46 9 -44', 'none', '#e2e2e2', 2.4)), greyed(soldier(86, 0.78, C.grey, helmR(false), 'smile')), ground),
  'fkrig.sold': all(rect(14, 74, 46, 6, '#b98a52', 2, C.ink, 1.4), line('M18 80 L18 112 M56 80 L56 112', WOOD, 3), rect(16, 58, 18, 16, '#8a5a2e', 2, C.ink, 1.4), line('M16 62 L34 62', C.ink, 1), coins(46, 72, 4), fig(30, '#7b3f8c', 'calm', { h: 0.6, bottom: '#7b3f8c' }),
    soldier(78, 0.9, TUNIC, helmR(), 'smile'), reach(78, 0.9, -1, 60, 60), coin(58, 58, 4.4), ring(52, 64, 12), greyed(sol(104, 70, C.grey, 0.8), sol(112, 74, C.grey, 0.8)), ground),

  // ── 2005 Kavalleri i antiken ──
  'fkrig.kavalleri': all(rider(78, 76, 0.62, TUNIC, 'greek', spear(18, -40, 46, -54, BRONZE, 2.4), { gallop: true }), rider(44, 96, 0.62, TUNIC, 'greek', spear(18, -40, 46, -54, BRONZE, 2.4), { gallop: true, col: '#7a4a2a' }), rider(90, 112, 0.62, TUNIC, 'greek', spear(18, -40, 46, -54, BRONZE, 2.4), { gallop: true, col: '#b98a5a' }),
    dust(20, 104, 1), dust(56, 108, 1), dust(36, 84, 0.8), ground),
  'fkrig.ryttare': all(rider(54, 112, 1.1, '#2f7f7a', 'none'), ring(54, 32, 20), ground),
  'fkrig.stigbygel': all(at(56, 112, 1.25, horseL(), path('M-12 -39 C-8 -46 8 -46 12 -39 Z', '#7a4a2a', C.ink, 1.3), line('M0 -40 L0 -19', '#4a2e1a', 1.6), path('M-4.5 -19 L4.5 -19 L5.5 -12 L-5.5 -12 Z', 'none', HL, 2.4), line('M-6 -12 L6 -12', C.ink, 1.6)), ring(56, 93, 13), ground),
  'fkrig.tygel': all(rider(50, 112, 1.05, TUNIC, 'none', line('M20 -50 L31 -45', HL, 3), { ax: 20, ay: -50 }), ring(78, 62, 15), ground),
  'fkrig.lans': all(rider(48, 112, 1, TUNIC, 'roman', all(line('M-24 -48 L64 -60', WOOD, 2.6), path('M62 -63 L76 -62 L63 -57 Z', C.silver, C.ink, 0.9)), { ax: 16, ay: -50, gallop: true }), line('M24 64 L114 52', HL, 1.6, '4 3'), ground),
  'fkrig.galoppera': all(at(62, 106, 1.1, horseL(HORSE, true)), speed(26, 52), dust(22, 100, 1.2), dust(40, 108, 0.9), ground),
  'fkrig.beriden': all(greyed(g('translate(0 -62)', ...[24, 60, 96].map((x) => soldier(x, 0.42, C.grey, helmG(C.grey), 'calm')), line('M8 112 L112 112', C.grey2, 1.6))), line('M8 58 L112 58', C.grey2, 1.2, '4 3'),
    ...[20, 56, 92].map((x) => rider(x, 110, 0.5, TUNIC, 'greek', spear(14, -36, 40, -66, BRONZE, 2.4))), dashBox(4, 62, 112, 50), ground),
  'fkrig.spana': all(hillAt(34, 112, 76, 50), rider(34, 82, 0.62, TUNIC, 'greek', '', { ax: 6, ay: -72 }), line('M42 34 L100 70 M42 34 L106 86', C.grey, 1.2, '3 3'), tent(96, 90, 0.5, C.grey2), tent(108, 92, 0.4, C.grey2), tent(102, 100, 0.45, C.grey2), ground),
  'fkrig.förfölja': all(fig(92, C.grey, 'shock', { h: 0.62, bottom: C.grey }), rider(42, 112, 0.7, TUNIC, 'greek', spear(16, -40, 42, -50, BRONZE, 2.2), { gallop: true }), arrow(70, 30, 94, 30, HL, 2.6), dust(14, 104, 1), path('M78 108 l3 0 m4 0 l3 0', 'none', C.grey, 1.4), ground),
  'fkrig.krigselefant': all(at(54, 112, 1.25, elephantL(), rect(-14, -60, 24, 16, '#a8743f', 1, C.ink, 1.4), line('M-14 -52 L10 -52', '#5e3a1a', 1), sol(-6, -66, TUNIC, 0.62), sol(4, -66, TUNIC, 0.62, { spear: true }), circle(22, -48, 4, C.skin, C.ink, 1)), ground),

  // ── 2006 Fälttåg och försörjning ──
  'fkrig.fälttåg': all(field(), city(22, 100, 0.8, BLUE), mountain(58, 76, 30, 26), path('M28 92 C44 86 40 66 58 60 C78 52 84 40 98 30', 'none', HL, 2.4), `<path d="M28 92 C44 86 40 66 58 60 C78 52 84 40 98 30" fill="none" stroke="${C.white}" stroke-width="1" stroke-dasharray="3 4"/>`,
    tent(44, 78, 0.45), tent(76, 52, 0.45), crossed(100, 24, 1), city(102, 44, 0.6, '#d8cfbd'), flake(16, 18), flake(26, 24)),
  'fkrig.marsch': all(rect(4, 98, 112, 14, ROAD, 0, null), ...Array.from({ length: 5 }, (_, i) => all(soldier(14 + i * 22, 0.6, TUNIC, helmR(), 'calm', all(rect(10, -40, 12, 14, '#7a5236', 2, C.ink, 1), line('M16 -40 L16 -68', WOOD, 2))))), arrow(20, 12, 104, 12, C.grey, 2.2), ground),
  'fkrig.försörjning': all(tent(84, 70, 0.9), tent(104, 74, 0.7), sol(94, 92, TUNIC, 0.9, { helm: C.silver }), wagon(30, 104, 0.8, all(sack(-10, -24, 0.7), barrel(6, -24, 0.6))), arrow(50, 92, 76, 84, HL, 2.6),
    loaf(36, 34, 1.2), barrel(58, 30, 0.8), hay(30, 64, 0.6), arrow(44, 40, 72, 58, HL, 2.2), arrow(40, 66, 70, 70, HL, 2.2), ground),
  'fkrig.proviant': all(path('M24 108 L30 60 L90 60 L96 108 Z', '#a8743f', C.ink, 1.8), path('M30 60 C40 52 80 52 90 60', 'none', C.ink, 1.6), loaf(44, 52, 1.6), fish(76, 50, 1.3), path('M52 40 L62 34 L70 42 L60 48 Z', '#8a4a3a', C.ink, 1.2), ellipse(60, 58, 10, 4, '#f3e3a0', C.ink, 1.2), ring(60, 48, 30)),
  'fkrig.tross': all(greyed(row(80, 40, 3, 12, C.grey, 0.8, { helm: C.grey, spear: true })), wagon(70, 108, 0.9, all(sack(-10, -24, 0.7), sack(4, -24, 0.7), barrel(14, -24, 0.5))), at(24, 108, 0.62, horseL('#7a6a5a', false, true), rect(-14, -48, 22, 10, '#c9a06a', 2, C.ink, 1.2)), dashBox(6, 60, 96, 50), ground),
  'fkrig.mula': all(at(52, 108, 1.35, horseL('#8a7a6a', false, true)), ring(80, 32, 14), greyed(at(104, 108, 0.5, horseL(C.grey))), ground),
  'fkrig.packdjur': all(at(58, 110, 1.15, horseL(HORSE), rect(-16, -54, 30, 12, '#c9a06a', 2, C.ink, 1.4), sack(-12, -58, 0.8), sack(2, -60, 0.9), rect(-18, -42, 10, 12, '#a8743f', 2, C.ink, 1.2), rect(4, -42, 10, 12, '#a8743f', 2, C.ink, 1.2)), dashBox(32, 32, 44, 32), ground),
  'fkrig.foder.2': all(at(46, 112, 1.3, grazeL()), hay(96, 112, 1), path('M100 90 L104 84 M92 92 L90 86', 'none', '#c8a040', 1.4), ring(94, 100, 20), ground),
  'fkrig.förnödenheter': all(sack(22, 98, 1.2), sack(40, 100, 1.1), barrel(60, 98, 1.1), rect(74, 90, 30, 20, '#a8743f', 2, C.ink, 1.4), line('M74 98 L104 98', '#5e3a1a', 1.2), loaf(30, 76, 1), path('M80 82 L96 82 L94 90 L82 90 Z', '#6f8fbf', C.ink, 1.1), lo('M86 90 L92 74', WOOD, 1.6), path('M90 74 L96 72 L94 78 Z', C.grey, C.ink, 0.8),
    fish(56, 78, 0.9), dashBox(10, 66, 100, 46), ground),
  'fkrig.vinterkvarter': all(rect(4, 96, 112, 16, C.white, 0, null), path('M4 96 C30 92 90 92 116 96', 'none', C.grey2, 1.4), ...[[22, 96], [96, 96]].map(([x, y]) => all(rect(x! - 14, y! - 18, 28, 18, '#a8743f', 1, C.ink, 1.4), path(`M${x! - 17} ${y! - 18} L${x} ${y! - 30} L${x! + 17} ${y! - 18} Z`, C.white, C.ink, 1.4), rect(x! + 6, y! - 34, 4, 10, '#7a4a20', 0, C.ink, 1), path(`M${x! + 8} ${y! - 38} c-4 -4 4 -6 0 -10`, 'none', C.grey2, 2))),
    fire(60, 100, 1.1), sol(46, 86, TUNIC, 0.9, { helm: C.silver }), sol(74, 86, TUNIC, 0.9, { helm: C.silver, flip: true }), ...[[14, 16], [40, 10], [70, 20], [100, 12], [56, 40], [110, 44], [30, 46]].map(([x, y]) => flake(x!, y!, 1.3)), ground),

  // ── 2007 Befäl och formationer ──
  'fkrig.officer': all(soldier(36, 1, TUNIC, helmR(), 'calm', capeL('#7a2a2a')), reach(36, 1, 1, 60, 30), greyed(row(72, 84, 3, 14, C.grey, 1, { helm: C.grey, spear: true })), arrow(70, 60, 108, 60, C.grey, 2), ground),
  'fkrig.general': all(hillAt(34, 112, 76, 30), soldier(34, 0.92, TUNIC, all(helmG(C.gold)), 'calm', all(capeL(RED), discsL())), reach(34, 0.92, 1, 56, 56), line('M56 56 L68 46', '#7a2a2a', 2.6),
    soldier(80, 0.58, '#7a2a2a', helmR(), 'calm'), soldier(104, 0.58, '#7a2a2a', helmR(), 'calm'), ground),
  'fkrig.befäl': all(row(10, 18, 7, 16.5, BLUE, 0.6, { helm: C.silver, spear: true }), soldier(36, 0.72, TUNIC, helmG(C.gold), 'calm', all(capeL('#7a2a2a'), beardL())), soldier(84, 0.72, TUNIC, helmG(C.gold), 'smile', capeL(RED)),
    reach(36, 0.72, 1, 54, 70), reach(84, 0.72, -1, 66, 70), rect(50, 67, 20, 5, C.gold, 2, C.ink, 1.2), ring(60, 70, 13), path('M44 50 C52 40 68 40 76 50', 'none', HL, 2.4), path('M70 49 L76 51 L77 44', 'none', HL, 2.4), ground),
  'fkrig.befälhavare': all(rect(40, 86, 40, 26, '#d8cfbd', 2, C.ink, 1.4), g('translate(0 -26)', soldier(60, 0.6, TUNIC, helmG(C.gold), 'angry', capeL(RED)), on(60, 0.6, line('M14 -40 L30 -66', WOOD, 2.6))), ring(60, 36, 16),
    row(8, 96, 2, 16, BLUE, 0.9, { helm: C.silver, spear: true }), g('translate(120 0) scale(-1 1)', row(8, 96, 2, 16, BLUE, 0.9, { helm: C.silver, spear: true })), ground),
  'fkrig.fältherre': all(hillAt(30, 112, 70, 54), rider(28, 72, 0.55, RED, 'greek', '', {}), ...[[66, 92], [86, 92], [76, 102], [96, 102]].map(([x, y]) => block(x!, y!, 16, 8, BLUE)), cavBlock(100, 86, 12, 6), cavBlock(54, 86, 10, 6), ring(28, 40, 18), ground),
  'fkrig.anföra': all(rect(4, 100, 112, 12, ROAD, 0, null), rider(92, 104, 0.6, RED, 'greek', banner(18, -46, RED, 0.8)), ...[0, 1, 2, 3].map((i) => soldier(16 + i * 15, 0.5, TUNIC, helmR(), 'calm')), arrow(74, 30, 112, 30, HL, 2.6), ring(92, 52, 22), ground),
  'fkrig.order': all(soldier(26, 1, TUNIC, helmC(), 'angry'), say(60, 18, 34, 20, 38, 24, arrow(48, 18, 72, 18, HL, 3)), ...[0, 1, 2].map((i) => all(sol(66 + i * 16, 88, TUNIC, 1, { helm: C.silver, spear: true }))), arrow(64, 108, 112, 108, HL, 2.6)),
  'fkrig.taktik': all(soldier(22, 0.9, TUNIC, helmG(C.gold), 'calm', capeL(RED)), soldier(98, 0.9, TUNIC, helmR(), 'calm', capeL('#7a2a2a')), path('M16 60 L104 60 L114 92 L6 92 Z', '#f3e3b8', C.ink, 1.6), line('M14 92 L14 112 M106 92 L106 112', WOOD, 3),
    ...[[44, 66], [60, 64], [76, 66]].map(([x, y]) => pawn(x!, y!, FOE)), ...[[40, 86], [60, 86], [80, 86]].map(([x, y]) => pawn(x!, y!, BLUE)),
    line('M38 80 C24 78 22 68 30 62', C.dark, 1.8, '3 3'), line('M58 79 C54 76 54 74 56 72', C.dark, 1.8, '3 3'), path('M53 74 L56 71 L59 74', 'none', C.dark, 1.6), path('M78 80 C92 78 96 70 88 64', 'none', HL, 2.4), path('M88 70 L87 63 L94 65', 'none', HL, 2.4), path('M26 65 L30 61 L33 66', 'none', C.dark, 1.6), ground),
  'fkrig.strategi': all(rect(26, 8, 90, 74, '#f3e3b8', 3, C.ink, 1.6), path('M36 70 C40 50 30 30 50 20 C70 12 100 20 106 40 C110 56 98 72 80 74 Z', '#cfe0a8', C.ink, 1.2), city(48, 62, 0.45, BLUE), city(96, 34, 0.45, FOE), city(70, 30, 0.35, '#d8cfbd'), city(90, 62, 0.35, '#d8cfbd'),
    path('M52 58 C60 50 62 40 68 34', 'none', HL, 2), path('M74 30 C82 28 86 30 92 32', 'none', HL, 2), circle(60, 46, 4, C.white, C.ink, 0.8), circle(82, 26, 4, C.white, C.ink, 0.8), `<text x="60" y="48.2" font-family="system-ui,sans-serif" font-weight="800" font-size="6" text-anchor="middle" fill="${C.ink}">1</text>`, `<text x="82" y="28.2" font-family="system-ui,sans-serif" font-weight="800" font-size="6" text-anchor="middle" fill="${C.ink}">2</text>`,
    fig(16, TUNIC, 'calm', { h: 0.62, bottom: '#6b5a44' }), on(16, 0.62, helmG(C.gold)), ground),
  'fkrig.formation': all(field(), ...[[60, 22], [52, 32], [68, 32], [44, 42], [60, 42], [76, 42], [36, 52], [52, 52], [68, 52], [84, 52]].map(([x, y]) => sol(x!, y!, BLUE, 0.55, { helm: C.silver })), dashBox(26, 12, 68, 52),
    greyed(...[[20, 86], [34, 92], [28, 102], [48, 96], [60, 88], [74, 100], [88, 90], [98, 102]].map(([x, y]) => sol(x!, y!, C.grey, 0.5)))),
  'fkrig.kolonn': all(field(), path('M14 108 C30 80 40 70 60 62 C80 54 96 40 104 14', 'none', ROAD, 14), ...Array.from({ length: 10 }, (_, i) => { const t = i / 9, x = 22 + t * 76, y = 98 - t * 74; return block(+f1(x - 4), +f1(y - 3), 8, 6, BLUE); }), arrow(98, 30, 106, 12, HL, 2.6), tree(30, 50, 0.6), tree(94, 92, 0.6)),
  'fkrig.reserv': all(field(), block(14, 44, 92, 12, BLUE), block(14, 26, 92, 10, FOE), crossed(36, 40, 0.8), crossed(84, 40, 0.8), block(42, 82, 36, 14, BLUE, { hl: true }), hourglass(96, 88, 1), line('M60 80 L60 62', BLUE, 1.6, '3 3')),
  'fkrig.bakhåll': all(rect(4, 92, 112, 20, ROAD, 0, null), hillAt(34, 74, 70, 40), hillAt(96, 74, 54, 30), ...[[18, 52], [38, 46], [58, 52]].map(([x, y]) => sol(x!, y!, TUNIC, 0.7, { helm: BRONZE, crest: true })), bush(18, 64, 0.9), bush(38, 58, 0.9), bush(58, 64, 0.9), bush(94, 54, 0.8),
    greyed(row(44, 92, 5, 14, C.grey, 0.7, { helm: C.grey, spear: true })), ring(38, 54, 26), ground),
  'fkrig.retirera': all(...[0, 1, 2].map((i) => sol(18 + i * 16, 74 + (i % 2) * 6, TUNIC, 1.1, { helm: C.silver, flip: true, shield: TUNIC })), arrow(66, 54, 14, 54, HL, 3.4), ...[0, 1].map((i) => sol(92 + i * 14, 76 + i * 4, FOE, 1.1, { helm: C.grey, spear: true, flip: true })),
    path('M66 104 l-3 0 m-4 0 l-3 0', 'none', C.grey, 1.6), ground),
};
