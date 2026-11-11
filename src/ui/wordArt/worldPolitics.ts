/**
 * Samhälle & institutioner → Politik & demokrati → Internationell politik, 1341–1347 (0.30): diplomacy
 * and embassies, treaties, the EU's institutions, the UN, sanctions and negotiations, alliances, and
 * international conflicts. Countries are never real (except Sweden and the Nordic flags): a country is
 * a plain colour, blue (A) or orange (B), shown as a flag with a white dot or as a map shape. The EU is
 * a ring of yellow stars on blue, the UN a light-blue globe disc, the defence alliance a white compass
 * star on navy. No text names a word.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, star, type Svg } from './kit';
import { type Build } from './figures';
import { HL, arm, padlock, heart, globe } from './people';
import { P as F, type Mood, greyed, coin } from './blindFix';
import { checkIcon, leafIcon } from './labelIcons';
import { clock } from './time';
import { win, door } from './homeKit';

// ── Geometry and figures ─────────────────────────────────────────────
const RED = '#e8302c';
const f1 = (n: number) => n.toFixed(1);
const ground = line('M4 112 L116 112', C.grey2, 2);
/** Head and shoulder positions of a standing figure (figures.ts) at x with height factor h. */
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, hy: ty - 56 * s, hr: 10 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const hnd = (x: number, y: number, r = 3) => circle(x, y, r, C.skin, C.ink, 1.2);
/** An arm that starts at the shoulder (side −1 = picture-left, 1 = picture-right) and ends in a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), hnd(tx, ty, 3 * Math.max(0.7, h))); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Small head-and-shoulders person (for crowds). */
const mini = (x: number, y: number, col: string, mood: 'smile' | 'frown' | 'flat' = 'smile', s = 1, long = false, skin: string = C.skin) => g(`translate(${x} ${y}) scale(${s})`, long ? path('M-8 -6 C-9 6 9 6 8 -6 Z', C.hair, null) : '', path('M-10 16 C-10 4 10 4 10 16 Z', col, C.ink, 1.4), circle(0, -6, 7.5, skin, C.ink, 1.4), path('M-7.5 -8 C-7.5 -16 7.5 -16 7.5 -8 C4 -11 -4 -11 -7.5 -8 Z', C.hair, null),
  circle(-2.6, -6, 1, C.ink, null), circle(2.6, -6, 1, C.ink, null),
  mood === 'smile' ? path('M-2.6 -2.6 Q0 -0.6 2.6 -2.6', 'none', C.ink, 1.1) : mood === 'flat' ? line('M-2.4 -2 L2.4 -2', C.ink, 1.1) : path('M-2.6 -1.4 Q0 -3.4 2.6 -1.4', 'none', C.ink, 1.1));
/** Speech bubble centred on (cx, cy) whose tail points to (tx, ty). */
const say = (cx: number, cy: number, w: number, h: number, tx: number, ty: number, inner: Svg = '', fill: string = C.white) => {
  const L = cx - w / 2, R = cx + w / 2, Tp = cy - h / 2, B = cy + h / 2;
  let a: number[], b: number[], a2: number[], b2: number[];
  if (tx < L || tx > R) { const e = tx < L ? L : R, inw = tx < L ? 1.6 : -1.6, by = Math.max(Tp + 6, Math.min(B - 6, ty)); a = [e, by - 4.5]; b = [e, by + 4.5]; a2 = [e + inw, by - 3.6]; b2 = [e + inw, by + 3.6]; }
  else { const e = ty > cy ? B : Tp, inw = ty > cy ? -1.6 : 1.6, bx = Math.max(L + 7, Math.min(R - 7, tx)); a = [bx - 5, e]; b = [bx + 5, e]; a2 = [bx - 4, e + inw]; b2 = [bx + 4, e + inw]; }
  return all(path(`M${a[0]} ${a[1]} L${tx} ${ty} L${b[0]} ${b[1]} Z`, fill, C.ink, 1.5), rect(L, Tp, w, h, fill, 6, C.ink, 1.5), path(`M${a2[0]} ${a2[1]} L${tx} ${ty} L${b2[0]} ${b2[1]} Z`, fill, null), inner);
};
/** Bubble beside the head of the figure at x (side 1 = right of the head, −1 = left); f draws the content at the bubble centre. */
const sb = (x: number, h: number, side: 1 | -1, w: number, hh: number, f: (cx: number, cy: number) => Svg, dx = 0, dy = 0) => { const k = geo(x, h), cx = x + side * (k.hr + 6 + w / 2) + dx, cy = k.hy - 8 + dy; return say(cx, cy, w, hh, x + side * (k.hr + 1), k.hy, f(cx, cy)); };

// ── Marks ────────────────────────────────────────────────────────────
const check = (x: number, y: number, s = 1, col: string = C.green) => checkIcon(x, y, s, col);
const cross = (x: number, y: number, s = 1, col: string = RED) => line(`M${x - 5 * s} ${y - 5 * s} L${x + 5 * s} ${y + 5 * s} M${x + 5 * s} ${y - 5 * s} L${x - 5 * s} ${y + 5 * s}`, col, 2.4 * s);
const noB = (x: number, y: number, r = 8) => all(circle(x, y, r, RED, C.ink, 1.2), line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, C.white, r * 0.22));
const okB = (x: number, y: number, r = 8) => all(circle(x, y, r, C.green, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, r * 0.22));
const thumb = (x: number, y: number, s = 1, down = false) => g(`translate(${x} ${y}) scale(${s} ${down ? -s : s})`, rect(-4.4, -11, 4.4, 10, C.skin, 2.2, C.ink, 1.1), rect(-5, -3, 11, 10, C.skin, 3, C.ink, 1.1), line('M-0.6 0.4 L5.4 0.4 M-0.6 3.4 L5.4 3.4', C.ink, 0.8), rect(-8, -2.4, 3.2, 9, C.navy, 1, C.ink, 0.9));
const palm = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ...[-4.6, -1.6, 1.4, 4.4].map((d, i) => rect(d - 1.3, -9 + Math.abs(i - 1.5) * 1.2, 2.6, 9, C.skin, 1.3, C.ink, 0.9)), path('M-5.5 -1 L5.5 -1 L5 5 C4 8 -4 8 -5 5 Z', C.skin, C.ink, 1), path('M-5.4 1 L-9 -3 C-10 -4 -11 -2 -10 -1 L-5 5', C.skin, C.ink, 1));
const dash = (d: string, col: string = HL, w = 1.6, da = '3 3') => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-dasharray="${da}" stroke-linecap="round"/>`;
const bang = (x: number, y: number, s = 1, col: string = RED) => g(`translate(${x} ${y}) scale(${s})`, rect(-1.8, -9, 3.6, 11, col, 1.5, null), circle(0, 6, 2, col, null));

// ── Countries and emblems ────────────────────────────────────────────
/** Country colours: A (blue) is "us", B (orange) the other country; more for crowds. */
const NA = '#5aa7e8', NB = '#f28a2e';
const NC = [NA, NB, '#7ac06a', '#a585d0', '#e85a5a', '#f2c14e', '#4fb6a8', '#d07aa8'];
/** Flag on a pole standing on (x, y): plain colour with a white dot. */
const flag = (x: number, y: number, col: string, s = 1, pole = true) => g(`translate(${x} ${y}) scale(${s})`, pole ? line('M0 0 L0 -30', C.ink, 1.6) : '', rect(0, -30, 20, 13, col, 1, C.ink, 1.1), circle(10, -23.5, 2.6, C.white, null));
/** Small hand flag / lapel flag without pole, centred on (x, y). */
const pin = (x: number, y: number, col: string, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-6, -4, 12, 8, col, 1, C.ink, 0.9), circle(0, 0, 1.6, C.white, null));
const flagSE = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L0 -30', C.ink, 1.6), rect(0, -30, 20, 13, '#3a6ab0', 0, C.ink, 1), rect(6, -30, 3.4, 13, C.yellow, 0, null), rect(0, -25.2, 20, 3.4, C.yellow, 0, null));
/** Nordic cross flag (field, cross, optional inner cross). */
const nordFlag = (x: number, y: number, field: string, crossC: string, inner: string | null = null, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L0 -30', C.ink, 1.6), rect(0, -30, 20, 13, field, 0, C.ink, 1), rect(5.4, -30, 4, 13, crossC, 0, null), rect(0, -25.5, 20, 4, crossC, 0, null), inner ? all(rect(6.4, -30, 2, 13, inner, 0, null), rect(0, -24.5, 20, 2, inner, 0, null)) : '');
const EUB = '#2f4fa3';
/** EU flag: a ring of twelve yellow stars on blue (w wide, top-left at x, y). */
const euFlag = (x: number, y: number, w = 30) => { const h = w * 2 / 3, cx = x + w / 2, cy = y + h / 2, r = h * 0.33; return all(rect(x, y, w, h, EUB, 1, C.ink, 1.1), ...Array.from({ length: 12 }, (_, i) => circle(+f1(cx + r * Math.cos((i * Math.PI) / 6)), +f1(cy + r * Math.sin((i * Math.PI) / 6)), +f1(Math.max(0.9, h * 0.055)), '#ffd84a', null))); };
/** EU flag on a pole standing on (x, y). */
const euPole = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L0 -32', C.ink, 1.6), euFlag(0, -32, 24));
const UNB = '#5b92e5';
/** UN-style disc: light-blue globe with white grid and two white leaf sprays. */
const unEmb = (x: number, y: number, r = 10) => all(circle(x, y, r, UNB, C.ink, 1.2), circle(x, y, r * 0.62, 'none', C.white, r * 0.08), ellipse(x, y, r * 0.3, r * 0.62, 'none', C.white, r * 0.07), line(`M${f1(x - r * 0.62)} ${y} L${f1(x + r * 0.62)} ${y}`, C.white, r * 0.07), path(`M${f1(x - r * 0.75)} ${f1(y - r * 0.4)} Q${f1(x - r * 0.9)} ${f1(y + r * 0.5)} ${x} ${f1(y + r * 0.85)} Q${f1(x + r * 0.9)} ${f1(y + r * 0.5)} ${f1(x + r * 0.75)} ${f1(y - r * 0.4)}`, 'none', C.white, r * 0.09));
const unFlag = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L0 -30', C.ink, 1.6), rect(0, -30, 22, 15, UNB, 1, C.ink, 1.1), unEmb(11, -22.5, 5.6));
/** Defence-alliance emblem: white four-pointed compass star on navy. */
const allyE = (x: number, y: number, r = 10) => all(circle(x, y, r, C.navy, C.ink, 1.2), path(`M${x} ${f1(y - r * 0.8)} L${f1(x + r * 0.18)} ${f1(y - r * 0.18)} L${f1(x + r * 0.8)} ${y} L${f1(x + r * 0.18)} ${f1(y + r * 0.18)} L${x} ${f1(y + r * 0.8)} L${f1(x - r * 0.18)} ${f1(y + r * 0.18)} L${f1(x - r * 0.8)} ${y} L${f1(x - r * 0.18)} ${f1(y - r * 0.18)} Z`, C.white, null));
/** Two neighbouring countries as map shapes; A on the left, B on the right, border at x ≈ 60. */
const LANDA = 'M8 30 C20 18 44 20 60 26 C56 44 64 62 58 84 C44 92 22 90 12 80 C4 64 4 44 8 30 Z';
const LANDB = 'M60 26 C76 20 98 22 110 32 C116 50 114 70 108 84 C94 92 72 90 58 84 C64 62 56 44 60 26 Z';
const lands = (a: string = '#cfe3f5', b: string = '#f8dcc0') => all(path(LANDA, a, C.ink, 1.6), path(LANDB, b, C.ink, 1.6), dash('M60 26 C56 44 64 62 58 84', C.ink, 1.4, '4 3'));
/** A country map shape centred on (x, y) of size s (about 40 × 34 at s = 1). */
const land = (x: number, y: number, col: string, s = 1, k = 0) => g(`translate(${x} ${y}) scale(${s})`, path(['M-18 -12 C-8 -20 10 -18 18 -12 C22 0 20 10 14 16 C2 20 -10 20 -16 14 C-22 4 -22 -4 -18 -12 Z', 'M-16 -14 C-4 -18 12 -16 18 -8 C20 4 16 14 6 17 C-6 19 -16 14 -19 6 C-21 -2 -20 -10 -16 -14 Z', 'M-14 -16 C0 -16 16 -14 19 -4 C20 8 12 16 0 17 C-12 18 -20 10 -19 -2 C-18 -10 -17 -14 -14 -16 Z'][k % 3]!, col, C.ink, 1.4 / s));

// ── Buildings and things ─────────────────────────────────────────────
/** Embassy: stone facade with columns, steps and a flag on the roof (standing on y). */
const embassy = (x: number, y: number, s = 1, col: string = NA) => g(`translate(${x} ${y}) scale(${s})`, rect(-30, -6, 60, 6, C.grey2, 1, C.ink, 1.4), rect(-26, -40, 52, 34, '#efe8da', 1, C.ink, 1.6), path('M-30 -40 L0 -56 L30 -40 Z', '#e3dac6', C.ink, 1.6), ...[-19, -7, 7, 19].map((d) => rect(d - 2.5, -38, 5, 32, C.white, 1, C.ink, 1)), door(0, -6, 10, 18, C.brown), flag(0, -56, col, 0.8));
/** Plain office building with windows and a flag (standing on y). */
const office = (x: number, y: number, s = 1, col: string = NA, wall = '#e6d3b3') => g(`translate(${x} ${y}) scale(${s})`, rect(-22, -44, 44, 44, wall, 1, C.ink, 1.6), win(-11, -32, 9, 9), win(11, -32, 9, 9), win(-11, -18, 9, 9), win(11, -18, 9, 9), door(0, 0, 10, 14, C.brown), flag(8, -44, col, 0.7));
/** Paper document; o.head = colour band, o.seal = red wax seal, o.sig = number of signatures, o.ok = green tick. */
const doc = (x: number, y: number, s = 1, o: { head?: string; seal?: boolean; sig?: number; ok?: boolean; rows?: number; paper?: string } = {}) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -18, 28, 36, o.paper ?? C.white, 2, C.ink, 1.4), o.head ? rect(-14, -18, 28, 7, o.head, 2, C.ink, 1.2) : '',
  ...Array.from({ length: o.rows ?? 4 }, (_, i) => line(`M-9 ${-7 + i * 5} L9 ${-7 + i * 5}`, C.grey, 1.3)),
  ...Array.from({ length: o.sig ?? 0 }, (_, i) => path(`M${-10 + i * 11} 13 q2 -4 3 0 q1 3 3 -1 q1 -2 3 1`, 'none', C.navy, 1.1)),
  o.seal ? all(circle(8, 11, 4.4, RED, C.ink, 1), circle(8, 11, 2.2, 'none', '#ff8a80', 0.8)) : '', o.ok ? check(8, 9, 0.7) : '');
/** Rolled treaty: paper with two rolls, a ribbon and a seal. */
const scroll = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-18, -20, 36, 40, '#f8f0d8', 1, C.ink, 1.4), rect(-21, -24, 42, 6, '#e8d8a8', 3, C.ink, 1.3), rect(-21, 18, 42, 6, '#e8d8a8', 3, C.ink, 1.3), ...[0, 1, 2, 3].map((i) => line(`M-12 ${-12 + i * 5} L12 ${-12 + i * 5}`, C.grey, 1.3)), path('M4 8 L2 22 L6 19 L10 22 L8 8 Z', '#3a6ab0', C.ink, 0.9), circle(6, 8, 5, RED, C.ink, 1), circle(6, 8, 2.6, 'none', '#ff8a80', 0.8));
/** Two forearms from the left (colour a) and right (colour b) meeting in a handshake at (x, y). */
const shake = (x: number, y: number, a: string = NA, b: string = NB, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-30 2 L-10 -2 L-8 6 L-30 10 Z', a, C.ink, 1.3), path('M30 2 L10 -2 L8 6 L30 10 Z', b, C.ink, 1.3), path('M-10 -3 C-4 -7 4 -7 10 -3 L10 6 C4 9 -4 9 -10 6 Z', C.skin, C.ink, 1.2), line('M-4 -5 L-2 6 M0 -5 L2 6 M4 -5 L5 5', C.ink, 0.8));
/** Long negotiating table seen from the front (top at y). */
const ntable = (x: number, y: number, w = 70) => all(rect(x - w / 2, y, w, 6, C.tan, 2, C.ink, 1.6), line(`M${x - w / 2 + 6} ${y + 6} L${x - w / 2 + 6} 112 M${x + w / 2 - 6} ${y + 6} L${x + w / 2 - 6} 112`, C.brown, 3));
const crate = (x: number, y: number, s = 1, col: string = C.tan) => g(`translate(${x} ${y}) scale(${s})`, rect(-8, -8, 16, 16, col, 1, C.ink, 1.3), line('M-8 -8 L8 8 M8 -8 L-8 8', C.brown, 0.9));
const coins = (x: number, y: number, n = 3) => all(...Array.from({ length: n }, (_, i) => coin(x + (i % 2) * 3, y - i * 3.4, 5)));
/** Cargo ship on the water line y. */
const ship = (x: number, y: number, s = 1, cargo: string[] = [NB, C.green, NA]) => g(`translate(${x} ${y}) scale(${s})`, path('M-26 -8 L26 -8 L20 4 L-22 4 Z', C.navy, C.ink, 1.6), ...cargo.map((c, i) => rect(-18 + i * 11, -18, 10, 10, c, 1, C.ink, 1.1)), rect(16, -22, 7, 14, C.white, 1, C.ink, 1.2));
/** Road barrier at a border: post on x, arm closed (horizontal) or open (up). */
const barrier = (x: number, y: number, open = false) => all(rect(x - 3, y - 26, 6, 26, C.grey, 1, C.ink, 1.3), g(`translate(${x} ${y - 22}) rotate(${open ? -70 : 0})`, rect(0, -2.5, 44, 5, C.white, 1, C.ink, 1.2), ...[6, 18, 30].map((d) => rect(d, -2.5, 6, 5, RED, 0, null))));
/** Tank facing right (flip = facing left), standing on y. */
const tank = (x: number, y: number, s = 1, col = '#6d7f4a', flip = false) => g(`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`, rect(-20, -9, 40, 9, C.dark, 4, C.ink, 1.4), ...[-14, -5, 4, 13].map((d) => circle(d, -4.5, 3, C.grey, C.ink, 0.8)), path('M-17 -9 L-14 -17 L14 -17 L18 -9 Z', col, C.ink, 1.4), rect(-8, -24, 16, 8, col, 3, C.ink, 1.3), rect(8, -22, 20, 3.4, col, 1, C.ink, 1.1));
/** Rifle held diagonally at (x, y). */
const rifle = (x: number, y: number, s = 1, rot = -30) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-14, -2, 28, 4, C.dark, 1, C.ink, 1), path('M-14 -2 L-20 -1 L-20 5 L-12 2 Z', C.brown, C.ink, 1), rect(-2, 2, 3, 5, C.dark, 0.5, C.ink, 0.8));
/** Soldier: standing figure in green with a helmet; helmet colour can be blue (UN). */
const soldier = (x: number, helm = '#5d6e3e', more: Partial<Build> = {}, mood: Mood = 'calm') => { const k = geo(x, more.h ?? 1); return all(fig(x, '#6d7f4a', mood, { bottom: '#55663a', ...more }), path(`M${f1(x - k.hr * 1.15)} ${f1(k.hy - k.hr * 0.25)} C${f1(x - k.hr * 1.15)} ${f1(k.hy - k.hr * 1.6)} ${f1(x + k.hr * 1.15)} ${f1(k.hy - k.hr * 1.6)} ${f1(x + k.hr * 1.15)} ${f1(k.hy - k.hr * 0.25)} Z`, helm, C.ink, 1.3)); };
const smoke = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 7, '#8e949c', null), circle(7, -6, 8, '#a7adb4', null), circle(-4, -12, 7, '#b9bec4', null), circle(5, -18, 6, '#c9ced4', null));
const fire = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -16 C6 -8 9 -2 7 4 C5 9 -5 9 -7 4 C-9 -2 -4 -5 -3 -10 C-1 -5 1 -6 0 -16 Z', C.orange, C.ink, 1), path('M0 -4 C3 -1 4 2 2 5 C0 7 -3 6 -3 3 C-3 0 -1 -1 0 -4 Z', C.yellow, null));
const blast = (x: number, y: number, r = 10) => path(Array.from({ length: 16 }, (_, i) => { const a = (i * Math.PI) / 8, rr = i % 2 ? r * 0.5 : r; return `${i ? 'L' : 'M'}${f1(x + rr * Math.cos(a))} ${f1(y + rr * Math.sin(a))}`; }).join(' ') + ' Z', C.yellow, RED, 1.6);
/** Damaged house (broken roof, dark windows), standing on y. */
const ruin = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-18 0 L-18 -26 L-8 -34 L2 -24 L8 -30 L18 -22 L18 0 Z', '#c9b9a0', C.ink, 1.5), rect(-12, -18, 7, 7, C.dark, 0.5, C.ink, 1), path('M5 -16 L12 -16 L12 -9 L5 -9 Z', C.dark, C.ink, 1), line('M-2 -10 L2 -4 L-1 0', C.ink, 1));
const houseS = (x: number, y: number, s = 1, wall: string = '#f2d59a', roof: string = '#c0503c') => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -20, 28, 20, wall, 1, C.ink, 1.4), path('M-17 -19 L0 -32 L17 -19 Z', roof, C.ink, 1.4), win(-6, -11, 7, 7), door(6, 0, 6, 10, C.brown));
const tent = (x: number, y: number, s = 1, col = '#e9e2cf') => g(`translate(${x} ${y}) scale(${s})`, path('M-22 0 L0 -26 L22 0 Z', col, C.ink, 1.6), path('M-5 0 L0 -12 L5 0 Z', C.dark, C.ink, 1.2));
const bag = (x: number, y: number, s = 1, col: string = C.brown) => g(`translate(${x} ${y}) scale(${s})`, rect(-7, -6, 14, 12, col, 3, C.ink, 1.3), path('M-3 -6 L-3 -9 L3 -9 L3 -6', 'none', C.ink, 1.2));
const pass = (x: number, y: number, s = 1, col = '#8a2b3a') => g(`translate(${x} ${y}) scale(${s})`, rect(-6, -8, 12, 16, col, 1.5, C.ink, 1.1), circle(0, -1, 3, 'none', C.gold, 0.9));
const briefcase = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-9, -6, 18, 13, C.dark, 2, C.ink, 1.3), path('M-4 -6 L-4 -9 L4 -9 L4 -6', 'none', C.ink, 1.3), rect(-2, -1, 4, 2.6, C.gold, 0.5, null));
/** Seats of a parliament as dots in a semicircle; cols = one colour per seat (left to right). */
function hemi(cx: number, cy: number, R: number, cols: string[], dot = 2.6, r0 = 0.45): Svg {
  const n = cols.length, rows = n > 40 ? 4 : n > 16 ? 3 : 2;
  const rr = Array.from({ length: rows }, (_, i) => R * (r0 + ((1 - r0) * i) / Math.max(1, rows - 1)));
  const tot = rr.reduce((a, b) => a + b, 0);
  const cnt = rr.map((r) => Math.max(2, Math.round((n * r) / tot)));
  cnt[rows - 1]! += n - cnt.reduce((a, b) => a + b, 0);
  const pts: { a: number; x: number; y: number }[] = [];
  rr.forEach((r, i) => { const c = cnt[i]!; for (let j = 0; j < c; j++) { const a = Math.PI * (1 - j / (c - 1)); pts.push({ a, x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) }); } });
  pts.sort((p, q2) => q2.a - p.a);
  return all(...pts.map((p, i) => circle(+f1(p.x), +f1(p.y), dot, cols[i] ?? C.grey2, C.ink, 0.6)));
}
/** Balance (scales) on a stand at (x, y). */
const scales = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 -30 L0 0 M-8 0 L8 0', C.ink, 2.2), line('M-20 -26 L20 -26', C.ink, 2), line('M-20 -26 L-26 -14 M-20 -26 L-14 -14 M20 -26 L14 -14 M20 -26 L26 -14', C.ink, 1), path('M-28 -14 L-12 -14 Q-20 -8 -28 -14 Z', C.gold, C.ink, 1.1), path('M12 -14 L28 -14 Q20 -8 12 -14 Z', C.gold, C.ink, 1.1), circle(0, -30, 2.4, C.gold, C.ink, 1));
const urn = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-16, -12, 32, 26, '#6f93c9', 2, C.ink, 1.6), path('M-18 -16 L18 -16 L16 -11 L-16 -11 Z', '#90b0dc', C.ink, 1.4), rect(-7, -15.2, 14, 2.6, C.ink, 1, null));
const chair = (x: number, y: number, col: string = C.navy, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-10, -4, 20, 5, col, 1.5, C.ink, 1.3), rect(6, -26, 5, 23, col, 1.5, C.ink, 1.3), line('M-8 1 L-8 14 M8 1 L8 14', C.ink, 2));
const camera = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-8, -5, 16, 11, C.dark, 2, C.ink, 1.2), circle(0, 0.5, 3.4, '#9fd0f0', C.ink, 1), rect(-5, -8, 5, 3, C.dark, 1, null));
const ice = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, 'rgba(180,225,250,0.75)', 4, '#5aa7d6', 1.6), line(`M${x + 4} ${y + 6} L${x + 12} ${y + 3} M${x + w - 10} ${y + h - 5} L${x + w - 4} ${y + h - 9}`, C.white, 1.6));
const flake = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 -6 L0 6 M-5 -3 L5 3 M-5 3 L5 -3', '#5aa7d6', 1.6));

const sparkleS = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -6 L1.4 -1.4 L6 0 L1.4 1.4 L0 6 L-1.4 1.4 L-6 0 L-1.4 -1.4 Z', C.gold, null));
/** Checklist paper centred on (x, y): four rows with boxes, the first `ticks` rows ticked. */
const checklist = (x: number, y: number, s = 1, ticks = 0) => g(`translate(${x} ${y}) scale(${s})`, rect(-13, -17, 26, 34, C.white, 2, C.ink, 1.3), ...[0, 1, 2, 3].map((i) => all(rect(-9, -12 + i * 7.4, 5, 5, C.white, 0.8, C.ink, 0.9), line(`M-1 ${-9.5 + i * 7.4} L9 ${-9.5 + i * 7.4}`, C.grey, 1.3), i < ticks ? path(`M-9 ${-10 + i * 7.4} L-6.6 ${-7.6 + i * 7.4} L-2.6 ${-13.6 + i * 7.4}`, 'none', C.green, 1.6) : '')));
/** Lorry facing right standing on y. */
const truckS = (x: number, y: number, s = 1, load: string = C.tan) => g(`translate(${x} ${y}) scale(${s})`, rect(-30, -30, 38, 24, load, 1.5, C.ink, 1.4), line('M-17 -30 L-17 -6 M-4 -30 L-4 -6', C.brown, 1), path('M8 -24 L20 -24 L28 -14 L28 -6 L8 -6 Z', C.sky, C.ink, 1.4), path('M12 -21 L19 -21 L24 -14 L12 -14 Z', '#e8f4fb', C.ink, 0.9), circle(-20, -4, 4.4, C.black, C.ink, 1), circle(18, -4, 4.4, C.black, C.ink, 1));
/** Faint background houses for a street. */
const block2 = () => all(rect(4, 56, 28, 56, '#e3e7ec', 1, C.grey, 1.2), win(12, 68, 7, 7), win(24, 68, 7, 7), win(12, 84, 7, 7), win(24, 84, 7, 7), rect(34, 70, 20, 42, '#ece5d8', 1, C.grey, 1.2), win(44, 82, 7, 7));

const target = (x: number, y: number, r = 8) => all(circle(x, y, r, RED, C.ink, 1.2), circle(x, y, r * 0.66, C.white, null), circle(x, y, r * 0.34, RED, null));
/** Euro sign centred on (x, y). */
const eur = (x: number, y: number, s = 1, col: string = C.ink) => g(`translate(${x} ${y}) scale(${s})`, path('M5 -6 C1 -9 -6 -7 -6 0 C-6 7 1 9 5 6', 'none', col, 2), line('M-9 -2 L2 -2 M-9 2 L2 2', col, 1.6));
/** Fifteen seat positions around the horseshoe table (security council). */
const horseshoe = (): [number, number][] => [...[36, 48, 60, 72].map((y): [number, number] => [15, y]), ...Array.from({ length: 7 }, (_, i): [number, number] => { const a = Math.PI * (0.95 - (i * 0.9) / 6); return [+f1(60 + 45 * Math.cos(a)), +f1(84 + 24 * Math.sin(a))]; }), ...[72, 60, 48, 36].map((y): [number, number] => [105, y])];
const reach2 = (x: number, y: number) => line(`M${x - 8} ${y + 8} L${x - 14} ${y + 2}`, C.skin, 4);
const bottle = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-3.6, -8, 7.2, 16, '#bfe3f5', 2, C.ink, 1.1), rect(-2, -11, 4, 3, C.navy, 0.6, null));

/** Fighter plane flying to the right. */
const jet = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-22 0 L14 -3 L24 0 L14 3 Z', '#8c96a0', C.ink, 1.3), path('M-4 -2 L-12 -14 L-6 -14 L6 -2 Z M-4 2 L-12 14 L-6 14 L6 2 Z', '#7d8792', C.ink, 1.2), path('M-20 -1 L-26 -9 L-22 -9 L-16 -1 Z', '#7d8792', C.ink, 1.1), path('M10 -2.4 L16 -1 L10 0 Z', '#9fd0f0', null));
const radar = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L0 12 M-5 12 L5 12', C.ink, 1.6), path('M-10 -6 Q0 8 10 -6 Z', C.white, C.ink, 1.3), line('M0 -1 L4 -10', C.ink, 1.2), path('M7 -14 q4 4 0 8 M10 -17 q6 7 0 14', 'none', HL, 1.2));
const sunS = (x: number, y: number, r = 8) => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 3))} ${f1(y + Math.sin(a) * (r + 3))} L${f1(x + Math.cos(a) * (r + 7))} ${f1(y + Math.sin(a) * (r + 7))}`, C.gold, 2); }), circle(x, y, r, C.yellow, C.ink, 1.4));
const cloudG = (x: number, y: number) => all(ellipse(x, y, 40, 18, '#e3e7ec', C.grey, 1.4), circle(x - 22, y - 8, 12, '#e3e7ec', null), circle(x + 18, y - 10, 13, '#e3e7ec', null));

export const WORLD_POLITICS_MOTIFS: Record<string, Svg> = {
  // ── Diplomati och ambassader ─────────────────────────────────────
  // diplomat: a woman in a suit with a briefcase and her own country's lapel flag works in front of an embassy in the other (orange) country; she thinks of the handshake between the two.
  'intpol.diplomat': all(ground, embassy(86, 112, 1, NA), fig(32, C.navy, 'smile', { hairStyle: 'long' }), pin(27, 46, NA, 0.55), briefcase(48, 76, 0.9), sb(32, 1, 1, 28, 18, (x, y) => shake(x, y, NA, NB, 0.42), -4, -2)),
  // diplomati: two countries talk at a table and shake hands (coloured) instead of fighting with tanks (grey).
  'intpol.diplomati': all(ground, greyed(tank(26, 40, 0.62), tank(94, 40, 0.62, '#6d7f4a', true), blast(60, 30, 8)), cross(60, 30, 1.4), ntable(60, 92, 70), mini(28, 80, NA, 'smile', 1.2), mini(92, 80, NB, 'smile', 1.2, true), flag(44, 92, NA, 0.45), flag(70, 92, NB, 0.45), shake(60, 64, NA, NB, 0.62)),
  // diplomatisk: the black official car with the two small flags of the other country on its front, outside the embassy.
  'intpol.diplomatisk': all(ground, embassy(60, 74, 0.8, NB), g('translate(60 106) scale(1.7)', path('M-28 0 L-28 -9 L-17 -11 L-10 -20 L12 -20 L19 -11 L28 -9 L28 0 Z', C.dark, C.ink, 1.3), path('M-8 -18 L0 -18 L0 -11 L-14 -11 Z M3 -18 L11 -18 L16 -11 L3 -11 Z', '#9fd0f0', C.ink, 0.8), circle(-16, 1, 4.4, C.black, C.ink, 1), circle(16, 1, 4.4, C.black, C.ink, 1), circle(-16, 1, 1.8, C.grey, null), circle(16, 1, 1.8, C.grey, null), circle(-4, -14, 2.4, C.skin, C.ink, 0.6), line('M24 -9 L24 -19', C.ink, 0.8), rect(24, -19, 7, 4.6, NA, 0.5, C.ink, 0.5), line('M-24 -9 L-24 -19', C.ink, 0.8), rect(-24, -19, 7, 4.6, NA, 0.5, C.ink, 0.5))),
  // ambassadör: the head of the embassy, with a sash in his country's colour, hands his letter to the host country's leader.
  'intpol.ambassadör': all(ground, flag(8, 44, NA, 0.9), flag(96, 44, NB, 0.9), fig(36, C.navy, 'smile'), line('M27 41 L45 70', NA, 4.4), star(32, 50, 3.6, C.gold), reach(36, 1, 1, 56, 62), doc(62, 60, 0.5, { seal: true, rows: 3 }), fig(88, C.dark, 'smile', { hair: '#c9ced4' }), pin(83, 46, NB, 0.55), reach(88, 1, -1, 68, 62)),
  // konsulat: a small office with the home flag in an ordinary street; a woman goes in with her passport.
  'intpol.konsulat': all(ground, block2(), office(80, 112, 1.25, NA, '#efe8da'), fig(24, C.orange, 'smile', { hairStyle: 'long', h: 0.86 }), reach(24, 0.86, 1, 40, 64), pass(44, 62, 0.9), arrow(48, 98, 62, 98, HL, 2)),
  // utrikesdepartement: the ministry building with a globe over the entrance, connected to many countries' flags.
  'intpol.utrikesdepartement': all(ground, g('translate(60 112) scale(1.5)', rect(-34, -6, 68, 6, C.grey2, 1, C.ink, 1.2), rect(-30, -36, 60, 30, '#efe8da', 1, C.ink, 1.4), ...[-22, -11, 0, 11, 22].map((d) => rect(d - 2.2, -34, 4.4, 28, C.white, 1, C.ink, 0.9)), rect(-34, -40, 68, 5, '#e3dac6', 1, C.ink, 1.2), flagSE(28, -40, 0.5)), globe(60, 28, 12), ...[[18, 18], [26, 40], [102, 18], [94, 40]].map(([x, y], i) => all(dash(`M${x} ${y} L60 28`, C.grey, 1.2), pin(x!, y!, NC[i + 1]!, 0.9)))),
  // utrikespolitik: from the home country (blue) arrows go out to other countries: trade, help and safety. The school at home is inrikes (grey).
  'intpol.utrikespolitik': all(land(60, 66, '#cfe3f5', 1.3, 0), flag(56, 72, NA, 0.7), greyed(houseS(70, 84, 0.5)), land(20, 22, '#f8dcc0', 0.6, 1), land(100, 22, '#d6efc8', 0.6, 2), land(104, 100, '#e3d6f2', 0.55, 1), arrow(44, 50, 28, 32, HL, 2), arrow(76, 50, 92, 32, HL, 2), arrow(84, 82, 96, 92, HL, 2), crate(36, 34, 0.55), shake(84, 38, NA, '#7ac06a', 0.3), heart(96, 76, 0.4)),
  // statsbesök: on the red carpet the visiting head of state is welcomed by the host; both countries' flags line the carpet.
  'intpol.statsbesök': all(ground, path('M8 112 L40 96 L80 96 L112 112 Z', '#c8322c', C.ink, 1.4), flag(10, 92, NA, 0.8), flag(26, 92, NB, 0.8), flag(80, 92, NA, 0.8), flag(96, 92, NB, 0.8), fig(46, C.navy, 'smile'), pin(41, 46, NA, 0.5), reach(46, 1, 1, 60, 62), fig(74, C.dark, 'smile', { hair: '#c9ced4' }), pin(69, 46, NB, 0.5), reach(74, 1, -1, 60, 62), circle(60, 62, 3.6, C.skin, C.ink, 1.2)),
  // delegation: four people with the same lapel flag and briefcases walk together into a building in the other country.
  'intpol.delegation': all(ground, office(98, 112, 0.95, NB), ...[12, 30, 48, 66].map((x, i) => all(fig(x, i === 0 ? C.navy : C.dark, 'smile', { h: 0.7, hairStyle: i % 2 ? 'long' : 'short' }), pin(x - 3, 66, NA, 0.4), briefcase(x + 10, 92, 0.55))), flag(4, 112, NA, 0.7), arrow(26, 30, 70, 30, HL, 2.4)),
  // värdland: the orange country around everything – the blue embassy and the meeting stand on its ground, and its person welcomes them.
  'intpol.värdland': all(path('M6 30 C24 10 92 8 114 28 C120 60 112 96 98 108 C66 116 30 114 12 102 C2 80 2 50 6 30 Z', '#f8dcc0', HL, 3), flag(18, 50, NB, 1), embassy(50, 98, 0.62, NA), fig(92, NB, 'laugh', { h: 0.72 }), reach(92, 0.72, -1, 76, 70), reach(92, 0.72, 1, 108, 70)),
  // diplomatiska förbindelser: each country has an embassy of the other one; contact goes both ways.
  'intpol.diplomatiska-förbindelser': all(lands(), embassy(32, 80, 0.55, NB), embassy(88, 80, 0.55, NA), arrow(38, 40, 82, 40, HL, 2.2), arrow(82, 50, 38, 50, HL, 2.2)),
  // kalla hem: the government at home calls (bubble with a back arrow); the ambassador leaves the embassy in the other country and goes home.
  'intpol.kalla-hem': all(lands(), office(28, 84, 0.6, NA), say(32, 34, 24, 16, 30, 54, arrow(40, 34, 24, 34, HL, 1.8)), greyed(embassy(94, 84, 0.45, NA)), fig(70, C.navy, 'frown', { h: 0.5 }), bag(78, 104, 0.6), arrow(64, 70, 46, 70, HL, 2.4)),
  // utvisa: an official shows a man out of the country with an open palm; he crosses the border line with his bag; the decision paper has a red cross.
  'intpol.utvisa': all(ground, dash('M58 34 L58 112', C.ink, 1.6, '5 4'), fig(88, C.navy, 'frown'), reach(88, 1, -1, 68, 62), palm(66, 56, 0.9), fig(30, C.orange, 'frown', { h: 0.88 }), bag(16, 92, 0.9), arrow(46, 104, 12, 104, HL, 2.2), doc(104, 20, 0.6, { rows: 3 }), cross(104, 20, 1.1)),
  // immunitet: the diplomat stands inside a protective bubble; the handcuffs bounce off it.
  'intpol.immunitet': all(ground, fig(44, C.navy, 'calm'), pin(39, 46, NA, 0.55), ellipse(44, 62, 30, 52, 'rgba(140,199,232,0.25)', '#5aa7d6', 2.4), sparkleS(16, 22), sparkleS(70, 18), g('translate(98 54)', circle(-6, 0, 6, 'none', C.grey, 2.6), circle(7, 0, 6, 'none', C.grey, 2.6), line('M0 0 L1 0', C.grey, 2)), arrow(88, 62, 80, 64, RED, 2), arrow(80, 70, 92, 80, RED, 2)),

  // ── Fördrag och avtal ────────────────────────────────────────────
  // avtal: a paper signed by two people, and their handshake.
  'intpol.avtal': all(ground, doc(60, 76, 1.8, { sig: 2, rows: 4 }), shake(60, 24, C.sky, C.green, 1.1)),
  // fördrag: the rolled treaty with a seal between the two countries' flags.
  'intpol.fördrag': all(ground, flag(8, 112, NA, 1.2), flag(90, 112, NB, 1.2), scroll(60, 62, 1.25)),
  // konvention: one paper in the middle; many countries around it have all joined it.
  'intpol.konvention': all(ground, doc(60, 74, 1.5, { sig: 3, rows: 3 }), ...[[16, 64], [22, 32], [44, 14], [76, 14], [98, 32], [104, 64]].map(([x, y], i) => all(dash(`M${x} ${y} L60 ${y! < 50 ? 50 : 70}`, C.grey, 1.1), pin(x!, y!, NC[i]!, 1.1)))),
  // avtalspart: two sides are bound to the paper in the middle; the right one is marked; a third person outside is not part of it (grey).
  'intpol.avtalspart': all(ground, doc(60, 56, 1.3, { sig: 2, rows: 3 }), line('M30 64 L42 58 M90 64 L78 58', C.ink, 1.6), mini(22, 70, NA, 'smile', 1.3), mini(98, 70, NB, 'smile', 1.3, true), circle(98, 72, 17, 'none', HL, 2.6), greyed(mini(60, 98, C.grey, 'flat', 1))),
  // underteckna: close-up: a hand writes its name with a pen on the line at the bottom of the paper.
  'intpol.underteckna': all(rect(14, 6, 70, 100, C.white, 3, C.ink, 1.8), ...[0, 1, 2, 3, 4].map((i) => line(`M24 ${22 + i * 10} L74 ${22 + i * 10}`, C.grey, 2)), line('M24 88 L74 88', C.ink, 1.4), path('M26 84 q4 -10 7 0 q3 6 6 -3 q2 -5 5 2 q2 3 5 -1', 'none', C.navy, 2), g('translate(54 82) rotate(-35)', path('M0 0 L-3 -7 L3 -7 Z', C.ink, null), rect(-3.2, -40, 6.4, 33, C.navy, 1.5, C.ink, 1.3)), path('M66 60 C76 56 88 62 92 74 L116 92 L116 112 L96 112 L70 82 C62 74 60 64 66 60 Z', C.skin, C.ink, 1.6), path('M96 112 L116 92 L116 112 Z', C.navy, C.ink, 1.4)),
  // ratificera: the signed paper goes to the parliament, which says yes; then it gets the seal and is valid.
  'intpol.ratificera': all(ground, doc(20, 40, 0.85, { sig: 2, rows: 3 }), arrow(34, 40, 42, 52, HL, 2), hemi(60, 84, 22, [...Array<string>(14).fill(C.green), ...Array<string>(6).fill(C.grey2)], 2.4), okB(60, 98, 7), arrow(78, 52, 86, 40, HL, 2), doc(100, 40, 0.85, { sig: 2, rows: 3, seal: true })),
  // åta sig: among several people, she raises her hand and takes the task (the box) on herself.
  'intpol.åta-sig': all(ground, greyed(mini(16, 96, C.grey, 'flat', 1.1), mini(104, 96, C.grey, 'flat', 1.1)), fig(60, C.green, 'smile', { hairStyle: 'long' }), reach(60, 1, -1, 42, 18), palm(42, 13, 0.9), crate(78, 70, 1.2), reach(60, 1, 1, 72, 70), say(92, 30, 26, 18, 70, 24, check(92, 30, 1))),
  // åtagande: she carries the paper with her promises (a checklist) on her shoulders: it is her task now.
  'intpol.åtagande': all(ground, fig(60, C.green, 'calm', { hairStyle: 'long', h: 0.8 }), reach(60, 0.8, -1, 46, 30), reach(60, 0.8, 1, 74, 30), checklist(60, 19, 1.05, 1)),
  // uppfylla: the promised list is done: every row has a tick (left, grey: nothing done yet).
  'intpol.uppfylla': all(ground, greyed(checklist(26, 56, 1.4, 0)), arrow(48, 56, 64, 56, HL, 2.4), checklist(90, 56, 1.6, 4), okB(104, 86, 9)),
  // handel: a cargo ship carries goods from the blue country's port to the orange one, and money goes back.
  'intpol.handel': all(rect(0, 84, 120, 36, '#bfe3f5', 0, null), line('M4 94 q6 -3 12 0 q6 3 12 0 M70 104 q6 -3 12 0 q6 3 12 0', '#5aa7d6', 1.4), rect(0, 60, 22, 24, '#d9c7a0', 0, C.ink, 1.4), rect(98, 60, 22, 24, '#d9c7a0', 0, C.ink, 1.4), flag(6, 60, NA, 0.8), flag(102, 60, NB, 0.8), ship(60, 92, 1.1), arrow(40, 74, 84, 74, HL, 2), arrow(84, 40, 40, 40, C.gold, 2), coins(60, 34, 3)),
  // handelsavtal: a paper about goods and money between the two countries, closed with a handshake.
  'intpol.handelsavtal': all(ground, flag(4, 112, NA, 1), flag(94, 112, NB, 1), doc(60, 48, 1.5, { rows: 2, sig: 2 }), crate(50, 30, 0.55), coin(70, 30, 5), shake(60, 96, NA, NB, 0.8)),
  // frihandel: the barrier at the border stays open and the lorry drives through without paying (grey: closed barrier and a fee).
  'intpol.frihandel': all(ground, greyed(barrier(30, 52), truckS(84, 52, 0.55), coin(56, 30, 6)), cross(56, 30, 1.2), dash('M60 62 L60 112', C.ink, 1.4, '5 4'), barrier(60, 112, true), truckS(60, 112, 0.9), arrow(18, 70, 102, 70, HL, 2.4)),

  // ── EU:s institutioner ───────────────────────────────────────────
  // medlemsland: inside the ring of stars are the member countries; one of them (with its flag) is marked.
  'intpol.medlemsland': all(circle(60, 60, 54, '#e3e9f7', null), ...Array.from({ length: 12 }, (_, i) => star(+f1(60 + 48 * Math.cos((i * Math.PI) / 6)), +f1(60 + 48 * Math.sin((i * Math.PI) / 6)), 4.6, C.yellow)), land(44, 46, '#d6efc8', 0.62, 1), land(78, 44, '#e3d6f2', 0.6, 2), land(42, 78, '#f8dcc0', 0.62, 2), land(78, 78, '#cfe3f5', 0.66, 0), pin(78, 78, NA, 0.9), circle(78, 78, 16, 'none', HL, 2.6)),
  // EU-kommissionen: one person from each member country at one table under the EU flag; they send out a new proposal.
  'intpol.EU-kommissionen': all(ground, euFlag(38, 4, 36), ...[18, 42, 66, 90].map((x, i) => all(mini(x, 74, [C.navy, C.dark, C.navy, C.dark][i]!, 'smile', 1, i % 2 === 1), pin(x, 82, NC[i + 2]!, 0.5))), ntable(56, 86, 96), arrow(76, 22, 94, 30, HL, 2), doc(106, 40, 0.55, { head: EUB, rows: 3 }), sparkleS(114, 26, 0.8)),
  // kommissionär: one member of the commission at the podium beside the EU flag; her own area is the environment (leaf).
  'intpol.kommissionär': all(ground, fig(44, C.navy, 'smile', { hairStyle: 'long' }), euFlag(37, 44, 10), path('M28 78 L60 78 L56 112 L32 112 Z', C.tan, C.ink, 1.6), euFlag(37, 86, 14), euPole(86, 112, 1.1), sb(44, 1, 1, 24, 18, (x, y) => leafIcon(x, y, 1.3), -2, 0)),
  // Europaparlamentet: the large half-circle of seats in many party colours, under the EU flag.
  'intpol.Europaparlamentet': all(ground, euFlag(44, 4, 32), hemi(60, 100, 50, [...Array<string>(10).fill('#e85a5a'), ...Array<string>(10).fill('#f2c14e'), ...Array<string>(12).fill('#7ac06a'), ...Array<string>(14).fill('#5aa7e8'), ...Array<string>(10).fill('#a585d0'), ...Array<string>(8).fill('#2f4a7a')], 2.6), path('M52 112 L54 98 L66 98 L68 112 Z', C.tan, C.ink, 1.2)),
  // EU-val: a voter puts her envelope into a ballot box that carries the EU stars.
  'intpol.EU-val': all(ground, fig(24, C.orange, 'smile', { hairStyle: 'long', h: 0.86 }), reach(24, 0.86, 1, 58, 50), rect(52, 44, 16, 11, '#e9d6ad', 1, C.ink, 1.2), arrow(76, 44, 76, 60, HL, 2), urn(70, 96, 1.5), euFlag(58, 86, 24)),
  // ministerrådet: ministers from different member countries (their table flags) meet at one table under the EU flag.
  'intpol.ministerrådet': all(ground, euFlag(42, 4, 36), ...[18, 46, 74, 102].map((x, i) => all(mini(x, 70, C.navy, 'smile', 1.1, i % 2 === 0), flag(x - 4, 84, NC[i]!, 0.45))), ntable(60, 84, 108)),
  // Europeiska rådet: the top leaders of the member countries stand together for the photo in front of the big EU flag.
  'intpol.Europeiska-rådet': all(ground, euFlag(10, 4, 100), ...[20, 46, 72, 98].map((x, i) => all(fig(x, C.dark, 'smile', { h: 0.72, hairStyle: i % 2 ? 'long' : 'short', hair: i === 2 ? '#c9ced4' : C.hair }), pin(x - 3, 70, NC[i]!, 0.42))), camera(10, 104, 1), camera(110, 104, 1)),
  // EU-domstolen: the court building with the scales over the door and the EU flag on the roof.
  'intpol.EU-domstolen': all(ground, g('translate(60 112) scale(1.5)', rect(-34, -6, 68, 6, C.grey2, 1, C.ink, 1.2), rect(-30, -38, 60, 32, '#efe8da', 1, C.ink, 1.4), ...[-22, -12, 12, 22].map((d) => rect(d - 2.2, -36, 4.4, 30, C.white, 1, C.ink, 0.9)), door(0, -6, 10, 16, C.brown), path('M-34 -38 L0 -54 L34 -38 Z', '#e3dac6', C.ink, 1.4)), scales(60, 74, 0.7), euPole(60, 31, 0.8)),
  // förordning: one rule from the EU arrives as the same paper in every member country at once.
  'intpol.förordning': all(euFlag(44, 2, 32), doc(60, 40, 0.65, { head: EUB, rows: 3 }), ...[16, 45, 75, 104].map((x, i) => all(arrow(60, 54, x, 76, HL, 1.8), land(x, 96, ['#cfe3f5', '#f8dcc0', '#d6efc8', '#e3d6f2'][i]!, 0.6, i), doc(x, 94, 0.42, { head: EUB, rows: 2 })))),
  // direktiv: the EU sets one goal (the target); each country writes its own law (different colours) to reach it.
  'intpol.direktiv': all(euFlag(4, 4, 24), doc(42, 18, 0.55, { head: EUB, rows: 2 }), target(66, 18, 8), arrow(52, 18, 56, 18, HL, 1.6), ...[22, 60, 98].map((x, i) => all(arrow(x === 60 ? 60 : x, 34, x, 46, C.grey, 1.4), doc(x, 62, 0.62, { head: [NA, NB, '#7ac06a'][i]!, rows: 3 }), arrow(x, 78, 60 + (x - 60) * 0.25, 92, HL, 1.8))), target(60, 102, 9)),
  // ordförandeskap: the leading seat goes round among the member countries, six months each; now it is the blue country's turn.
  'intpol.ordförandeskap': all(circle(60, 62, 30, '#e3e9f7', C.ink, 1.4), euFlag(48, 54, 24), path('M60 18 A44 44 0 0 1 104 62', 'none', HL, 2.4), path('M104 62 l-5 -7 l9 0 Z', HL, HL, 1), ...[0, 1, 2, 3, 4, 5].map((i) => { const a = -Math.PI / 2 + (i * Math.PI) / 3, x = +f1(60 + 44 * Math.cos(a)), y = +f1(62 + 44 * Math.sin(a)); return pin(x, y, NC[i]!, i === 0 ? 1.4 : 0.9); }), circle(60, 18, 12, 'none', HL, 2.4), chair(60, 14, C.gold, 0.4)),
  // inre marknaden: inside the ring of stars, goods, people and money cross the inner borders freely.
  'intpol.inre-marknaden': all(circle(60, 60, 54, '#e3e9f7', null), ...Array.from({ length: 12 }, (_, i) => star(+f1(60 + 50 * Math.cos((i * Math.PI) / 6)), +f1(60 + 50 * Math.sin((i * Math.PI) / 6)), 4, C.yellow)), dash('M60 18 L60 102', C.grey, 1.4, '4 3'), dash('M18 60 L102 60', C.grey, 1.4, '4 3'), truckS(44, 50, 0.5), arrow(58, 40, 74, 40, HL, 1.8), mini(40, 76, C.orange, 'smile', 0.8, true), arrow(52, 80, 70, 80, HL, 1.8), coin(80, 72, 5), crate(80, 88, 0.6), arrow(80, 50, 80, 60, HL, 1.6)),
  // euro: coins and a note with the euro sign.
  'intpol.euro': all(ground, rect(10, 28, 72, 38, '#c9dcf2', 3, C.ink, 1.6), circle(46, 47, 12, '#e8f0fa', C.ink, 1.2), eur(46, 47, 1.2, C.navy), circle(76, 86, 16, C.gold, C.ink, 1.6), circle(76, 86, 11, '#f0cf6b', C.ink, 1), eur(76, 86, 1.1), circle(102, 96, 11, C.silver, C.ink, 1.4), circle(102, 96, 7, C.gold, C.ink, 1), eur(102, 96, 0.7), circle(36, 96, 12, C.gold, C.ink, 1.4), eur(36, 96, 0.9)),
  // överstatlig: the EU stands above the countries: its decision reaches all of them, also the one that said no.
  'intpol.överstatlig': all(euFlag(38, 2, 44), ...[22, 60, 98].map((x, i) => all(arrow(60, 34, x, 70, HL, 2), land(x, 92, ['#cfe3f5', '#f8dcc0', '#d6efc8'][i]!, 0.65, i), doc(x, 90, 0.4, { head: EUB, rows: 2 }))), thumb(80, 64, 0.8, true), line('M4 76 L116 76', C.grey2, 1.2)),

  // ── FN och internationella organisationer ────────────────────────
  // organisation: one emblem on top and below it groups of people who work for the same goal, in an organised chart.
  'intpol.organisation': all(rect(40, 6, 40, 26, C.white, 3, C.ink, 1.6), circle(60, 19, 8, '#4fb6a8', C.ink, 1.2), star(60, 19, 4.4, C.white), line('M60 32 L60 42 M22 42 L98 42 M22 42 L22 52 M60 42 L60 52 M98 42 L98 52', C.ink, 1.6), ...[22, 60, 98].map((x) => all(rect(x - 18, 52, 36, 56, '#eef6f5', 3, C.ink, 1.4), mini(x - 8, 72, '#4fb6a8', 'smile', 0.75), mini(x + 8, 72, '#4fb6a8', 'smile', 0.75, true), mini(x, 96, '#4fb6a8', 'smile', 0.75)))),
  // FN: the tall headquarters building, with many countries' flags in front and the light-blue flag.
  'intpol.FN': all(ground, rect(54, 10, 34, 102, '#cfe6ee', 1, C.ink, 1.6), ...Array.from({ length: 12 }, (_, i) => line(`M54 ${18 + i * 8} L88 ${18 + i * 8}`, '#9ccfe0', 1.2)), line('M65 10 L65 112 M77 10 L77 112', '#9ccfe0', 1.2), ...[6, 20, 34].map((x, i) => flag(x, 112, NC[i + 1]!, 0.65)), unFlag(92, 112, 0.95), unEmb(71, 30, 9)),
  // generalförsamlingen: the big hall: every country has its own desk and flag, and one vote card each.
  'intpol.generalförsamlingen': all(rect(4, 4, 112, 34, '#dbe7f6', 3, null), unEmb(60, 20, 12), ...[0, 1, 2].flatMap((r) => [0, 1, 2, 3, 4].map((c) => { const x = 16 + c * 22 + (r % 2) * 4, y = 58 + r * 20; return all(rect(x - 9, y, 18, 6, C.tan, 1, C.ink, 1.1), mini(x, y - 6, C.navy, 'smile', 0.55), pin(x + 5, y - 2, NC[(r * 5 + c) % 8]!, 0.45)); }))),
  // säkerhetsrådet: the horseshoe table seen from above with fifteen seats; five seats are permanent (gold).
  'intpol.säkerhetsrådet': all(path('M22 30 L22 84 C22 108 98 108 98 84 L98 30 L84 30 L84 84 C84 94 36 94 36 84 L36 30 Z', '#e9eef5', C.ink, 1.6), unEmb(60, 64, 12), ...horseshoe().map(([x, y], i) => circle(x, y, i % 3 === 1 ? 5.2 : 4, i % 3 === 1 ? C.gold : C.grey2, C.ink, 1.1))),
  // stormakt: a very big and strong country (orange, big figure) next to a small one (grey).
  'intpol.stormakt': all(ground, greyed(fig(22, C.grey, 'calm', { h: 0.55 }), flag(4, 112, C.grey, 0.6)), fig(76, NB, 'laugh', { h: 1.12, muscle: true, w: 1.25 }), flag(100, 50, NB, 0.9)),
  // vetorätt: four of the five say yes, but one alone stops the paper (palm, red cross).
  'intpol.vetorätt': all(ground, doc(60, 22, 0.8, { head: UNB, rows: 3 }), cross(60, 22, 2), ...[14, 37, 60, 83].map((x) => all(mini(x, 92, C.navy, 'smile', 1), thumb(x, 66, 0.8))), mini(106, 92, NB, 'frown', 1), palm(106, 64, 1.1), circle(106, 64, 12, 'none', RED, 2.4)),
  // resolution: many hands go up in the light-blue hall and the decision paper is adopted.
  'intpol.resolution': all(ground, doc(60, 26, 1, { head: UNB, rows: 3, ok: true }), ...[12, 30, 48, 66, 84, 102].map((x, i) => all(mini(x + 4, 96, NC[i]!, 'smile', 0.9, i % 2 === 0), line(`M${x + 12} 92 L${x + 12} 72`, C.skin, 4), palm(x + 12, 68, 0.6)))),
  // generalsekreterare: the head of the organisation speaks from the podium in front of the light-blue emblem.
  'intpol.generalsekreterare': all(ground, rect(10, 6, 100, 50, '#dbe7f6', 4, null), unEmb(86, 26, 14), fig(42, C.dark, 'smile', { hair: '#c9ced4' }), path('M24 76 L60 76 L56 112 L28 112 Z', C.tan, C.ink, 1.6), unEmb(42, 92, 7), sb(42, 1, 1, 22, 16, (x, y) => globe(x, y, 5), -2, 2)),
  // fredsbevarande: a soldier with a blue helmet stands between two angry groups and keeps them apart.
  'intpol.fredsbevarande': all(ground, mini(14, 92, NA, 'frown', 1.1), mini(30, 98, NA, 'frown', 1), mini(106, 92, NB, 'frown', 1.1, true), mini(90, 98, NB, 'frown', 1), soldier(60, UNB, { h: 0.95 }), reach(60, 0.95, -1, 36, 54), palm(34, 48, 0.9), reach(60, 0.95, 1, 84, 54), palm(86, 48, 0.9)),
  // mänskliga rättigheter: people of all kinds hold up together one paper with a heart: the same rights for everybody.
  'intpol.mänskliga-rättigheter': all(ground, rect(24, 8, 72, 44, C.white, 3, C.ink, 1.8), heart(60, 30, 1.4), ...[[16, C.skin, C.orange], [44, '#8d5a3b', C.green], [76, C.skin2, C.purple], [104, '#f6dcc4', C.sky]].map(([x, sk, col], i) => all(mini(x as number, 92, col as string, 'smile', 1.3, i % 2 === 1, sk as string), line(`M${x} 78 L${(x as number) < 60 ? 30 : 90} 54`, C.skin, 4)))),
  // bistånd: a lorry from the rich country brings boxes of help (heart) to a poor village, where people receive them.
  'intpol.bistånd': all(ground, houseS(96, 112, 0.8, '#d9c7a0', '#8a6a4a'), truckS(34, 112, 1, C.white), heart(22, 94, 0.55), arrow(58, 70, 80, 70, HL, 2), crate(64, 104, 0.8), mini(78, 98, C.orange, 'smile', 0.95, true), reach2(78, 98)),
  // flykting: a family leaves its burning home with their bags and walks to a tent camp.
  'intpol.flykting': all(ground, houseS(16, 112, 0.9), fire(12, 82, 0.9), smoke(20, 70, 0.8), fig(52, C.orange, 'frown', { hairStyle: 'long', h: 0.9 }), bag(66, 94, 0.9), fig(38, C.green, 'frown', { h: 0.55 }), tent(98, 112, 0.9), arrow(70, 60, 86, 60, HL, 2)),
  // hjälporganisation: helpers in vests with the heart mark give water and food from their tent to the people waiting.
  'intpol.hjälporganisation': all(ground, tent(30, 112, 1.2, C.white), heart(30, 84, 0.6), fig(62, '#4fb6a8', 'smile', { hairStyle: 'long', h: 0.9 }), heart(60, 54, 0.32), reach(62, 0.9, 1, 80, 70), bottle(84, 66), mini(100, 96, C.orange, 'smile', 1), mini(112, 102, C.purple, 'smile', 0.8, true), crate(62, 104, 0.7)),
  // global: the whole earth, with connections all the way round it.
  'intpol.global': all(globe(60, 60, 34), ...[[34, 44], [78, 36], [84, 72], [48, 82], [62, 56]].map(([x, y]) => circle(x!, y!, 3, HL, C.ink, 1)), dash('M34 44 L78 36 L84 72 L48 82 L34 44 M62 56 L78 36 M62 56 L48 82', HL, 1.4, '3 2'), path('M14 40 A50 22 0 0 1 106 40', 'none', C.navy, 2), path('M106 80 A50 22 0 0 1 14 80', 'none', C.navy, 2), path('M106 40 l-1 -8 l7 5 Z', C.navy, C.navy, 1), path('M14 80 l1 8 l-7 -5 Z', C.navy, C.navy, 1)),

  // ── Sanktioner och förhandlingar ─────────────────────────────────
  // sanktion: the orange country is closed in by a red ring; goods and money from outside are stopped at it.
  'intpol.sanktion': all(land(60, 62, '#f8dcc0', 1.3, 0), flag(56, 70, NB, 0.8), circle(60, 62, 38, 'none', RED, 3.2), crate(14, 24, 0.9), arrow(22, 30, 30, 38, C.grey, 1.8), noB(32, 40, 6), coins(108, 28, 3), arrow(100, 34, 92, 40, C.grey, 1.8), noB(90, 42, 6), truckS(20, 112, 0.5), arrow(30, 98, 36, 92, C.grey, 1.8), noB(38, 90, 6)),
  // häva: the red ring around the orange country is opened (open padlock) and goods come in again.
  'intpol.häva': all(land(60, 62, '#f8dcc0', 1.3, 0), flag(56, 70, NB, 0.8), path('M78 30 A38 38 0 1 0 98 62', 'none', RED, 3.2), dash('M98 62 A38 38 0 0 0 78 30', RED, 1.4, '3 4'), padlock(98, 26, 1, true), crate(108, 76, 0.8), arrow(104, 70, 84, 60, C.green, 2.2), coins(110, 104, 3), arrow(104, 98, 84, 80, C.green, 2.2)),
  // bojkott: people turn away from the orange country's goods and refuse to buy them (palms, crossed box).
  'intpol.bojkott': all(ground, rect(6, 72, 44, 40, '#e8dcc4', 2, C.ink, 1.4), crate(18, 100, 1), crate(38, 100, 1), crate(28, 84, 1), pin(28, 66, NB, 1), noB(42, 60, 8), ...[66, 86, 106].map((x, i) => all(mini(x, 96, [C.green, C.purple, C.sky][i]!, 'frown', 1.1, i === 1), palm(x - 6, 76, 0.7)))),
  // bojkotta: in the shop she puts the orange country's product back on the shelf and refuses it with her palm.
  'intpol.bojkotta': all(ground, rect(4, 20, 40, 92, '#e8dcc4', 2, C.ink, 1.4), line('M4 48 L44 48 M4 78 L44 78', C.ink, 1.4), ...[12, 24, 36].map((x) => all(rect(x - 4, 32, 8, 16, C.white, 1, C.ink, 1), rect(x - 4, 36, 8, 4, NB, 0, null))), ...[12, 24].map((x) => all(rect(x - 4, 62, 8, 16, C.white, 1, C.ink, 1), rect(x - 4, 66, 8, 4, C.green, 0, null))), fig(80, C.purple, 'frown', { hairStyle: 'long' }), reach(80, 1, -1, 52, 46), rect(46, 38, 8, 16, C.white, 1, C.ink, 1), rect(46, 42, 8, 4, NB, 0, null), arrow(46, 56, 40, 50, HL, 1.8), reach(80, 1, 1, 104, 44), palm(106, 38, 0.9)),
  // exportförbud: the blue country's lorry full of goods is stopped at the border: it may not sell to the other country.
  'intpol.exportförbud': all(lands(), truckS(30, 76, 0.75), barrier(60, 76, false), noB(84, 50, 10), arrow(48, 50, 70, 50, C.grey, 2)),
  // frysa tillgångar: money and a house are frozen in a block of ice with a padlock: they are still there but cannot be used.
  'intpol.frysa-tillgångar': all(ground, ice(14, 30, 92, 70), coins(36, 82, 4), houseS(66, 92, 0.9), rect(78, 56, 22, 12, '#b9d7a8', 1, C.ink, 1), circle(89, 62, 3, '#8fbf7f', null), padlock(60, 30, 1.1), flake(14, 18), flake(104, 16, 1.2), flake(110, 106)),
  // påtryckning: from both sides many arrows press on the one person in the middle.
  'intpol.påtryckning': all(ground, fig(60, NB, 'frown', { h: 0.82 }), ...[[6, 30], [6, 58], [6, 86]].map(([x, y]) => arrow(x!, y!, 38, y!, HL, 3)), ...[[114, 30], [114, 58], [114, 86]].map(([x, y]) => arrow(x!, y!, 82, y!, HL, 3)), palm(40, 46, 0.8), palm(80, 46, 0.8)),
  // ultimatum: a raised palm and a last demand (!), and the clock shows that the time is almost up.
  'intpol.ultimatum': all(ground, fig(30, NA, 'angry'), reach(30, 1, 1, 52, 38), palm(54, 32, 1), sb(30, 1, 1, 18, 18, (x, y) => bang(x, y + 1, 0.9), 14, -6), clock(86, 74, 22, 11, 55, { shade: [330, 360], shadeCol: 'rgba(232,48,44,0.55)' })),
  // dödläge: two equal teams pull the rope; the middle mark stands still over the line – nobody moves.
  'intpol.dödläge': all(ground, line('M60 40 L60 112', C.grey, 1.6), line('M8 80 L112 80', C.brown, 3), rect(57, 74, 6, 12, RED, 1, C.ink, 1), ...[14, 34].map((x) => all(mini(x, 92, NA, 'frown', 1.1), line(`M${x + 6} 88 L${x + 12} 80`, C.skin, 4))), ...[86, 106].map((x) => all(mini(x, 92, NB, 'frown', 1.1, true), line(`M${x - 6} 88 L${x - 12} 80`, C.skin, 4))), line('M52 54 L68 54 M52 60 L68 60', C.ink, 2.4)),
  // genombrott: after a long time the wall breaks and the way is open: they step through into the light.
  'intpol.genombrott': all(ground, rect(36, 10, 30, 102, '#c9805a', 0, C.ink, 1.6), ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => line(`M36 ${22 + i * 12} L66 ${22 + i * 12} M${i % 2 ? 46 : 56} ${10 + i * 12} L${i % 2 ? 46 : 56} ${22 + i * 12}`, '#8a4f30', 1)), path('M40 46 L50 38 L60 48 L64 64 L58 82 L46 86 L38 72 Z', '#fff3b0', C.ink, 1.6), ...[[70, 40, 82, 32], [72, 60, 88, 60], [70, 80, 82, 88]].map(([a, b, c, d]) => line(`M${a} ${b} L${c} ${d}`, C.gold, 2.4)), mini(20, 96, NA, 'smile', 1.1), arrow(28, 64, 50, 64, HL, 2.6), fig(94, NB, 'laugh', { h: 0.85 }), reach(94, 0.85, 1, 112, 30)),
  // uppgörelse: after the negotiation the two sides shake hands over the paper they agree on (tick).
  'intpol.uppgörelse': all(ground, ntable(60, 84, 96), fig(24, NA, 'smile', { h: 0.9 }), fig(96, NB, 'smile', { h: 0.9, hairStyle: 'long' }), reach(24, 0.9, 1, 58, 50), reach(96, 0.9, -1, 62, 50), circle(60, 50, 3.4, C.skin, C.ink, 1.2), doc(60, 76, 0.55, { sig: 2, rows: 2 }), okB(74, 70, 6)),
  // toppmöte: the top leaders of several countries meet at one round table, and the press photographs them.
  'intpol.toppmöte': all(ground, ellipse(60, 62, 46, 16, C.tan, C.ink, 1.6), ...[[22, 52], [46, 44], [74, 44], [98, 52]].map(([x, y], i) => all(mini(x!, y! - 4, C.dark, 'smile', 1, i % 2 === 1), flag(x! - 3, y! + 14, NC[i]!, 0.4))), line('M30 76 L30 92 M90 76 L90 92', C.brown, 3), camera(16, 104, 1.1), camera(60, 104, 1.1), camera(104, 104, 1.1)),

  // ── Allianser och samarbete ──────────────────────────────────────
  // samarbete: two people carry one long, heavy beam together – alone it would be too heavy (grey: one person who cannot lift it).
  'intpol.samarbete': all(ground, greyed(mini(104, 26, C.grey, 'frown', 0.8), rect(86, 34, 30, 6, C.grey, 1, null)), rect(8, 44, 96, 8, C.brown, 2, C.ink, 1.4), fig(28, NA, 'smile', { h: 0.88 }), reach(28, 0.88, 1, 34, 50), reach(28, 0.88, -1, 20, 50), fig(84, NB, 'smile', { h: 0.88, hairStyle: 'long' }), reach(84, 0.88, 1, 90, 50), reach(84, 0.88, -1, 76, 50), heart(56, 30, 0.5)),
  // samarbeta: two people build a wall together: one hands the brick, the other lays it.
  'intpol.samarbeta': all(ground, ...[0, 1, 2, 3].flatMap((r) => [0, 1, 2].map((c) => rect(44 + c * 12 + (r % 2) * 6, 100 - r * 8, 12, 8, '#c9805a', 0.5, C.ink, 1))), fig(22, NA, 'smile', { h: 0.9 }), reach(22, 0.9, 1, 44, 58), rect(42, 52, 12, 8, '#c9805a', 0.5, C.ink, 1), fig(98, NB, 'smile', { h: 0.9, hairStyle: 'long' }), reach(98, 0.9, -1, 60, 58), arrow(30, 40, 48, 40, HL, 2)),
  // försvar: the country has a big shield at its border; the arrows from outside bounce off.
  'intpol.försvar': all(land(44, 62, '#cfe3f5', 1.5, 0), flag(36, 70, NA, 0.8), g('translate(84 60) scale(1.7)', path('M0 -16 L14 -11 C14 4 8 12 0 17 C-8 12 -14 4 -14 -11 Z', C.navy, C.ink, 1.6), path('M0 -10 L8 -7 C8 2 4 8 0 11 Z', '#5a7ab0', null)), arrow(118, 30, 102, 42, RED, 2.2), arrow(102, 48, 116, 58, C.grey, 1.6), arrow(118, 92, 102, 80, RED, 2.2), arrow(102, 74, 116, 66, C.grey, 1.6)),
  // militär: green vehicles, a soldier and a fighter plane – things of the armed forces (grey: an ordinary car).
  'intpol.militär': all(ground, jet(60, 20, 1.2), tank(36, 112, 1), soldier(90, '#5d6e3e', { h: 0.85 }), greyed(g('translate(104 40) scale(0.5)', path('M-24 0 L-24 -10 L-14 -12 L-8 -22 L10 -22 L16 -12 L24 -10 L24 0 Z', C.grey, C.ink, 1.8), circle(-14, 0, 5, C.dark, null), circle(14, 0, 5, C.dark, null))), cross(104, 34, 1.1)),
  // allians: three countries' people hold hands in a row: they stand on the same side.
  'intpol.allians': all(ground, ...[22, 60, 98].map((x, i) => all(fig(x, [NA, '#7ac06a', NB][i]!, 'smile', { h: 0.82, hairStyle: i === 1 ? 'long' : 'short' }), flag(x - 6, 26, [NA, '#7ac06a', NB][i]!, 0.6))), reach(22, 0.82, 1, 41, 66), reach(60, 0.82, -1, 41, 66), reach(60, 0.82, 1, 79, 66), reach(98, 0.82, -1, 79, 66)),
  // angripa: the orange country's tanks cross the border into the blue country; an explosion where they arrive.
  'intpol.angripa': all(lands(), tank(84, 70, 0.8, '#b06a2a', true), arrow(72, 50, 38, 50, RED, 3), blast(28, 70, 11), mini(30, 96, NA, 'frown', 0.8)),
  // angrepp: one big red arrow hits the blue country, with an explosion at the point where it hits.
  'intpol.angrepp': all(land(44, 64, '#cfe3f5', 1.6, 0), flag(28, 72, NA, 0.8), arrow(116, 20, 66, 54, RED, 5), blast(60, 60, 14)),
  // försvarsallians: four countries' shields stand together; when one is attacked, the others come to help it.
  'intpol.försvarsallians': all(ground, ...[18, 46, 74, 102].map((x, i) => all(g(`translate(${x} 84) scale(1.1)`, path('M0 -16 L14 -11 C14 4 8 12 0 17 C-8 12 -14 4 -14 -11 Z', NC[i]!, C.ink, 1.6)), circle(x, 82, 3.4, C.white, null))), arrow(60, 12, 72, 58, RED, 3), arrow(30, 62, 60, 68, HL, 2), arrow(100, 58, 88, 66, HL, 2), line('M30 104 L90 104', C.ink, 2), circle(32, 104, 2.4, C.ink, null), circle(88, 104, 2.4, C.ink, null)),
  // Nato: the white compass star on navy, with the flags of the member countries in a row.
  'intpol.Nato': all(ground, allyE(60, 36, 28), ...[4, 26, 48, 70, 92].map((x, i) => flag(x, 112, NC[i]!, 0.75))),
  // alliansfri: the blue country stands alone with its own shield, outside the group of linked countries (grey).
  'intpol.alliansfri': all(ground, greyed(line('M82 44 L104 44 L93 74 Z', C.grey, 2.4), pin(82, 44, C.grey, 1.3), pin(104, 44, C.grey, 1.3), pin(93, 74, C.grey, 1.3)), flag(10, 112, NA, 1.3), g('translate(30 46) scale(1)', path('M0 -16 L14 -11 C14 4 8 12 0 17 C-8 12 -14 4 -14 -11 Z', C.navy, C.ink, 1.6)), dash('M60 20 L60 108', C.grey, 1.4, '4 4')),
  // Försvarsmakten: Sweden's armed forces: a soldier, a ship and a fighter plane under the Swedish flag.
  'intpol.Försvarsmakten': all(ground, rect(56, 92, 64, 28, '#bfe3f5', 0, null), flagSE(8, 50, 1.1), jet(78, 18, 1), soldier(36, '#5d6e3e', { h: 0.72 }), g('translate(86 96) scale(1)', path('M-28 -8 L28 -8 L22 4 L-24 4 Z', '#7d8792', C.ink, 1.5), rect(-10, -18, 18, 10, '#9aa3ad', 1, C.ink, 1.2), rect(4, -24, 4, 6, C.dark, 0.5, null), rect(-26, -14, 4, 6, '#3a6ab0', 0, null))),
  // säkerhetspolitik: the country thinks about how to stay safe: a shield, a radar, an ally and a plan.
  'intpol.säkerhetspolitik': all(land(48, 68, '#cfe3f5', 1.5, 0), flag(36, 70, NA, 0.7), g('translate(56 72) scale(0.8)', path('M0 -16 L14 -11 C14 4 8 12 0 17 C-8 12 -14 4 -14 -11 Z', C.navy, C.ink, 1.6)), radar(28, 50), dash('M74 54 L96 30', HL, 1.6), allyE(100, 24, 12), doc(102, 90, 0.7, { rows: 3, ok: true })),
  // ansluta sig: the blue country moves into the free place in the ring of allied countries.
  'intpol.ansluta-sig': all(circle(64, 58, 30, 'none', C.grey, 2), ...[0, 1, 2, 3].map((i) => { const a = -Math.PI / 2 + (i * Math.PI) / 2.5, x = +f1(64 + 30 * Math.cos(a)), y = +f1(58 + 30 * Math.sin(a)); return pin(x, y, NC[i + 1]!, 1.3); }), allyE(64, 58, 10), circle(+f1(64 + 30 * Math.cos(-Math.PI / 2 + 4 * Math.PI / 2.5)), +f1(58 + 30 * Math.sin(-Math.PI / 2 + 4 * Math.PI / 2.5)), 9, 'none', HL, 2, ), pin(14, 104, NA, 1.6), arrow(22, 96, +f1(64 + 30 * Math.cos(-Math.PI / 2 + 4 * Math.PI / 2.5)) - 8, +f1(58 + 30 * Math.sin(-Math.PI / 2 + 4 * Math.PI / 2.5)) + 8, HL, 2.4)),
  // grannland: two countries side by side with one common border; the neighbours wave to each other across it.
  'intpol.grannland': all(lands(), houseS(40, 76, 0.7), houseS(80, 76, 0.7), mini(48, 66, NA, 'smile', 0.7), mini(72, 66, NB, 'smile', 0.7, true), palm(52, 54, 0.5), palm(68, 54, 0.5), flag(20, 56, NA, 0.6), flag(92, 56, NB, 0.6)),
  // nordisk: the flags of the Nordic countries together.
  'intpol.nordisk': all(ground, nordFlag(12, 58, '#3a6ab0', C.yellow, null, 1.6), nordFlag(68, 58, '#c8102e', C.white, '#1d3f8f', 1.6), nordFlag(12, 112, '#c8102e', C.white, null, 1.6), nordFlag(68, 112, C.white, '#1d4f9f', null, 1.6)),
  // solidaritet: many people of different kinds put their hands on the shoulders of the one who is sad and help her.
  'intpol.solidaritet': all(ground, fig(60, NA, 'frown', { h: 0.8, hairStyle: 'long' }), ...[[20, C.orange, C.skin], [36, C.green, '#8d5a3b'], [84, C.purple, C.skin2], [100, '#e85a5a', C.skin]].map(([x, col, sk], i) => all(mini(x as number, 94, col as string, 'smile', 1.1, i % 2 === 0, sk as string), line(`M${x} 82 L${(x as number) < 60 ? 48 : 72} ${i % 3 === 0 ? 62 : 56}`, C.skin, 4))), heart(60, 18, 0.7), heart(28, 40, 0.45), heart(94, 38, 0.45)),

  // ── Internationella konflikter ───────────────────────────────────
  // krig: tanks shoot at each other, houses burn and smoke rises.
  'intpol.krig': all(ground, ruin(60, 112, 1.2), fire(54, 74, 0.9), smoke(66, 56, 1.2), tank(22, 112, 0.9), tank(98, 112, 0.9, '#8a6a3a', true), blast(44, 92, 8), blast(78, 90, 8), soldier(10, '#5d6e3e', { h: 0.5 })),
  // fred: the town is quiet: children play under the sun and the two countries' flags stand side by side (grey: a tank, crossed out).
  'intpol.fred': all(ground, sunS(20, 18), greyed(tank(96, 30, 0.6)), cross(96, 22, 1.4), houseS(24, 112, 0.9), houseS(96, 112, 0.9, '#cfe3f5', '#5a7ab0'), flag(48, 76, NA, 0.7), flag(62, 76, NB, 0.7), mini(46, 98, C.orange, 'smile', 0.8, true), mini(70, 98, C.green, 'smile', 0.8), circle(58, 106, 4, C.red, C.ink, 1), ...[[34, 110], [84, 110]].map(([x, y]) => all(line(`M${x} ${y} L${x} ${y! - 6}`, C.green, 1.2), circle(x!, y! - 7, 2.4, C.pink, C.ink, 0.6)))),
  // väpnad: the person on the right carries a weapon; the person on the left has none (grey).
  'intpol.väpnad': all(ground, greyed(fig(30, C.grey, 'calm', { h: 0.9 })), fig(84, '#6d7f4a', 'angry', { bottom: '#55663a' }), rifle(84, 66, 1.3, -35), circle(84, 66, 30, 'none', HL, 2)),
  // inbördeskrig: one country with one flag – but inside it two groups fight each other.
  'intpol.inbördeskrig': all(land(60, 64, '#ecdcb8', 2.5, 2), flag(52, 34, '#4fb6a8', 0.9), ...[26, 40].map((x) => mini(x, 76, '#7ac06a', 'frown', 1)), ...[80, 94].map((x) => mini(x, 76, '#a585d0', 'frown', 1, true)), blast(60, 70, 10), rifle(44, 92, 0.8, 20), rifle(76, 92, 0.8, 160)),
  // invasion: many tanks and a big arrow go from the orange country over the border into the blue country.
  'intpol.invasion': all(lands(), arrow(108, 58, 24, 58, RED, 6), tank(90, 84, 0.6, '#b06a2a', true), tank(66, 84, 0.6, '#b06a2a', true), tank(80, 40, 0.6, '#b06a2a', true), flag(96, 104, NB, 0.6)),
  // ockupera: the orange country's flag is put up in the blue country's town; its soldiers guard it and the people are sad.
  'intpol.ockupera': all(ground, houseS(20, 112, 0.9), houseS(100, 112, 0.9), flag(56, 46, NB, 1.3), rect(52, 46, 10, 6, C.grey, 1, C.ink, 1), soldier(46, '#b06a2a', { h: 0.62, top: '#b06a2a' }), soldier(74, '#b06a2a', { h: 0.62, top: '#b06a2a' }), greyed(flag(98, 70, NA, 0.6)), mini(16, 76, NA, 'frown', 0.7), mini(104, 76, NA, 'frown', 0.7, true)),
  // civilbefolkning: ordinary people – a mother with a child, an old man, a worker – not soldiers (grey).
  'intpol.civilbefolkning': all(ground, greyed(soldier(106, C.grey, { h: 0.7, grey: true })), fig(22, C.orange, 'smile', { hairStyle: 'long', h: 0.85 }), fig(40, C.green, 'smile', { h: 0.5 }), fig(64, C.purple, 'smile', { h: 0.82, hair: '#e3e3e3' }), line('M74 74 L78 112', C.brown, 2.4), fig(86, C.yellow, 'smile', { h: 0.78 })),
  // krigsbrott: a school with children is hit in the war – this is forbidden, and it is judged in court (scales).
  'intpol.krigsbrott': all(ground, houseS(32, 112, 1.6, '#f2e6c8', '#5a7ab0'), mini(26, 98, C.orange, 'frown', 0.6), mini(40, 98, C.green, 'frown', 0.6, true), blast(48, 56, 12), arrow(16, 16, 40, 46, RED, 3), bang(16, 40, 1.2), arrow(66, 80, 78, 80, HL, 2), scales(98, 104, 1.1)),
  // humanitär: a lorry with food, water and medicine (heart) helps the people who suffer.
  'intpol.humanitär': all(ground, truckS(36, 112, 1.05, C.white), heart(28, 94, 0.6), crate(70, 106, 0.7), bottle(80, 104), rect(84, 98, 12, 10, C.white, 1, C.ink, 1), line('M88 103 L92 103 M90 101 L90 105', C.green, 1.6), mini(104, 90, C.orange, 'smile', 1, true), mini(96, 62, C.green, 'smile', 0.8)),
  // vapenvila: the soldiers on both sides have put their weapons on the ground; the clock above shows a pause.
  'intpol.vapenvila': all(ground, soldier(22, '#5d6e3e', { h: 0.8 }), soldier(98, '#8a6a3a', { h: 0.8, top: '#8a6a3a' }), rifle(42, 108, 0.9, 0), rifle(78, 108, 0.9, 180), circle(60, 34, 16, C.white, C.ink, 1.8), rect(53, 26, 5, 16, C.navy, 1, null), rect(62, 26, 5, 16, C.navy, 1, null)),
  // fredssamtal: the two sides of the war sit at one table with a mediator in the middle; the war (grey) is behind them.
  'intpol.fredssamtal': all(ground, greyed(cloudG(60, 24), tank(44, 30, 0.45), blast(74, 22, 6)), ntable(60, 86, 100), mini(20, 74, '#6d7f4a', 'flat', 1.1), mini(100, 74, '#8a6a3a', 'flat', 1.1), mini(60, 72, UNB, 'smile', 1.1, true), flag(30, 86, NA, 0.45), flag(84, 86, NB, 0.45), say(36, 52, 18, 14, 28, 62, ''), say(84, 52, 18, 14, 92, 62, '')),
  // fredsavtal: the war is ended with a signed paper; the rifle is broken and the two sides shake hands.
  'intpol.fredsavtal': all(ground, doc(60, 54, 1.4, { sig: 2, rows: 3, seal: true }), shake(60, 16, NA, NB, 0.7), g('translate(30 104)', rifle(-8, 0, 0.9, -15), line('M-2 -6 L2 6', C.paper, 3)), g('translate(92 104)', rifle(0, 0, 0.7, 20), line('M-2 -6 L2 6', C.paper, 3))),
};
