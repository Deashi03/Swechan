/**
 * Samhälle & institutioner → Juridik & rättsväsende → Polis & brottsutredning, 1421–1427 (0.31): the
 * police at work, reports and suspicion, witnesses and interviews, traces and evidence, arrest and
 * detention, searches and seizure, and the course of a preliminary investigation. A police officer
 * always wears a navy uniform, a yellow reflective vest and a cap with a gold star; a police car is
 * white with a blue and yellow band; a court is a bench with a Swedish flag. No text names a word.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, star, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm, padlock, phone, shield, plaster, suitcase, plane } from './people';
import { P as F, type Mood, greyed, table, glassOf } from './blindFix';
import { checkIcon } from './labelIcons';
import { clock, cal } from './time';
import { win, door, house, tree, car } from './homeKit';
const RED = '#e8302c';
const f1 = (n: number) => n.toFixed(1);
const ground = line('M4 112 L116 112', C.grey2, 2);
/** Head and shoulder positions of a standing figure at x with height factor h. */
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, hy: ty - 56 * s, hr: 10 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const hnd = (x: number, y: number, r = 3) => circle(x, y, r, C.skin, C.ink, 1.2);
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), hnd(tx, ty, 3 * Math.max(0.7, h))); };
/** Small head-and-shoulders person (for crowds and people at a table). */
const mini = (x: number, y: number, col: string, mood: 'smile' | 'frown' | 'flat' = 'smile', s = 1, long = false) => g(`translate(${x} ${y}) scale(${s})`, long ? path('M-8 -6 C-9 6 9 6 8 -6 Z', C.hair, null) : '', path('M-10 16 C-10 4 10 4 10 16 Z', col, C.ink, 1.4), circle(0, -6, 7.5, C.skin, C.ink, 1.4), path('M-7.5 -8 C-7.5 -16 7.5 -16 7.5 -8 C4 -11 -4 -11 -7.5 -8 Z', C.hair, null),
  circle(-2.6, -6, 1, C.ink, null), circle(2.6, -6, 1, C.ink, null),
  mood === 'smile' ? path('M-2.6 -2.6 Q0 -0.6 2.6 -2.6', 'none', C.ink, 1.1) : mood === 'flat' ? line('M-2.4 -2 L2.4 -2', C.ink, 1.1) : path('M-2.6 -1.4 Q0 -3.4 2.6 -1.4', 'none', C.ink, 1.1));
/** Speech bubble centred on (cx, cy) whose tail points to (tx, ty). */
const say = (cx: number, cy: number, w: number, h: number, tx: number, ty: number, inner: Svg = '', fill: string = C.white) => {
  const L = cx - w / 2, R = cx + w / 2, Tp = cy - h / 2, B = cy + h / 2;
  let a: number[], b: number[];
  if (tx < L || tx > R) { const e = tx < L ? L : R, by = Math.max(Tp + 6, Math.min(B - 6, ty)); a = [e, by - 4.5]; b = [e, by + 4.5]; }
  else { const e = ty > cy ? B : Tp, bx = Math.max(L + 7, Math.min(R - 7, tx)); a = [bx - 5, e]; b = [bx + 5, e]; }
  return all(path(`M${a[0]} ${a[1]} L${tx} ${ty} L${b[0]} ${b[1]} Z`, fill, C.ink, 1.5), rect(L, Tp, w, h, fill, 6, C.ink, 1.5), path(`M${a[0]} ${a[1]} L${tx} ${ty} L${b[0]} ${b[1]} Z`, fill, null), inner);
};

// ── Marks ────────────────────────────────────────────────────────────
const check = (x: number, y: number, s = 1, col: string = C.green) => checkIcon(x, y, s, col);
const cross = (x: number, y: number, s = 1, col: string = RED) => line(`M${x - 5 * s} ${y - 5 * s} L${x + 5 * s} ${y + 5 * s} M${x + 5 * s} ${y - 5 * s} L${x - 5 * s} ${y + 5 * s}`, col, 2.4 * s);
const okB = (x: number, y: number, r = 8) => all(circle(x, y, r, C.green, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, r * 0.22));
const noB = (x: number, y: number, r = 8) => all(circle(x, y, r, RED, C.ink, 1.2), line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, C.white, r * 0.22));
const thumb = (x: number, y: number, s = 1, down = false) => g(`translate(${x} ${y}) scale(${s} ${down ? -s : s})`, rect(-4.4, -11, 4.4, 10, C.skin, 2.2, C.ink, 1.1), rect(-5, -3, 11, 10, C.skin, 3, C.ink, 1.1), line('M-0.6 0.4 L5.4 0.4 M-0.6 3.4 L5.4 3.4', C.ink, 0.8), rect(-8, -2.4, 3.2, 9, C.navy, 1, C.ink, 0.9));
const palm = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ...[-4.6, -1.6, 1.4, 4.4].map((d, i) => rect(d - 1.3, -9 + Math.abs(i - 1.5) * 1.2, 2.6, 9, C.skin, 1.3, C.ink, 0.9)), path('M-5.5 -1 L5.5 -1 L5 5 C4 8 -4 8 -5 5 Z', C.skin, C.ink, 1), path('M-5.4 1 L-9 -3 C-10 -4 -11 -2 -10 -1 L-5 5', C.skin, C.ink, 1));
const excl = (x: number, y: number, sz = 13, col: string = RED) => T(x, y + sz * 0.36, '!', sz, col);
const dash = (d: string, col: string = HL, w = 1.6, da = '3 3') => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-dasharray="${da}" stroke-linecap="round"/>`;
const sun = (x: number, y: number, r = 6) => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 5))} ${f1(y + Math.sin(a) * (r + 5))}`, C.gold, 1.6); }), circle(x, y, r, C.yellow, C.ink, 1.2));
const moon = (x: number, y: number, r = 7) => path(`M${x + r * 0.3} ${y - r} A${r} ${r} 0 1 0 ${x + r * 0.3} ${y + r} A${r * 0.75} ${r * 0.75} 0 1 1 ${x + r * 0.3} ${y - r} Z`, '#f6e08a', C.ink, 1.2);
const heartM = (x: number, y: number, s = 1, fill: string = C.red) => g(`translate(${x} ${y}) scale(${s})`, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', fill, C.ink, 1.4));
/** Bubble beside the head of the figure at x (side 1 = right of the head, −1 = left); f draws the content at the bubble centre. */
const sb = (x: number, h: number, side: 1 | -1, w: number, hh: number, f: (cx: number, cy: number) => Svg, dx = 0, dy = 0) => { const k = geo(x, h), cx = x + side * (k.hr + 6 + w / 2) + dx, cy = k.hy - 8 + dy; return say(cx, cy, w, hh, x + side * (k.hr + 1), k.hy, f(cx, cy)); };
/** Thought cloud beside a head (side as in sb). */
const tb = (x: number, h: number, side: 1 | -1, w: number, f: (cx: number, cy: number) => Svg, dx = 0, dy = 0, hh = 24) => { const k = geo(x, h), cx = x + side * (k.hr + 8 + w / 2) + dx, cy = k.hy - 6 + dy; return all(ellipse(cx, cy, w / 2, hh / 2, C.white, C.ink, 1.6), circle(x + side * (k.hr + 5), k.hy - 4, 2.4, C.white, C.ink, 1.1), circle(x + side * (k.hr + 2), k.hy + 1, 1.6, C.white, C.ink, 1), f(cx, cy)); };

// ── Police and things ────────────────────────────────────────────────
const PB = '#2a5db0';
const eq = (x: number, y: number, s = 1, col: string = C.ink) => line(`M${x - 5 * s} ${y - 2.5 * s} L${x + 5 * s} ${y - 2.5 * s} M${x - 5 * s} ${y + 2.5 * s} L${x + 5 * s} ${y + 2.5 * s}`, col, 2.2 * s);
const TAPE = '#3a6ad0';
/** Police officer: navy uniform, yellow reflective vest with silver bands, navy cap with a gold star. */
const cop = (x: number, mood: Mood = 'calm', more: Partial<Build> = {}) => { const s = 0.84 * (more.h ?? 1); return all(F({ x, top: C.navy, bottom: C.navy, mood, ...more }), g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, path('M-12.6 -41 L12.6 -41 L12 -3 L-12 -3 Z', C.reflex, C.ink, 1.6), rect(-12.3, -26, 24.6, 3, C.silver, 0, null), rect(-12.3, -15, 24.6, 3, C.silver, 0, null), star(-6, -34, 2.6, C.gold), path('M-11 -62 C-11 -72 11 -72 11 -62 Z', C.navy, C.ink, 1.6), ellipse(0, -61, 13, 2.6, C.dark, C.ink, 1.2), star(0, -66, 2.4, C.gold))); };
/** Plain figure. */
const civ = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Police car (bottom centre x, y): white with a blue and yellow chequered band; lights on = blue light with rays. */
const pcar = (x: number, y: number, s = 1, lights = false, flip = false) => g(`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`, path('M-26 0 L-26 -11 L-15 -13 L-9 -23 L11 -23 L17 -13 L26 -11 L26 0 Z', C.white, C.ink, 1.8), path('M-7 -21 L-11 -13 L15 -13 L9 -21 Z', '#d8eef8', C.ink, 1), line('M2 -21 L2 -13', C.ink, 1), ...Array.from({ length: 8 }, (_, i) => all(rect(-26 + i * 6.5, -9, 3.25, 2.6, PB, 0, null), rect(-22.75 + i * 6.5, -9, 3.25, 2.6, C.yellow, 0, null), rect(-26 + i * 6.5, -6.4, 3.25, 2.6, C.yellow, 0, null), rect(-22.75 + i * 6.5, -6.4, 3.25, 2.6, PB, 0, null))), rect(-3, -27, 10, 4, lights ? '#3a7ae8' : C.grey2, 1.5, C.ink, 1), lights ? line('M-6 -31 L-10 -35 M2 -31 L2 -37 M10 -31 L14 -35', '#3a7ae8', 1.8) : '', circle(-15, 0, 5, C.dark, C.ink, 1.2), circle(15, 0, 5, C.dark, C.ink, 1.2));
/** Police station: stone house with a blue sign and a gold star. */
const station = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-30, -44, 60, 44, '#e8e1d2', 1, C.ink, 1.6), rect(-32, -48, 64, 6, '#b9b2a3', 1, C.ink, 1.4), rect(-12, -40, 24, 10, PB, 2, C.ink, 1.2), star(0, -35, 3.6, C.gold), win(-19, -20, 9, 9), win(19, -20, 9, 9), door(0, 0, 12, 18, PB), circle(-9, -16, 2, '#3a7ae8', C.ink, 0.8));
/** Police ID card. */
const idCard = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-10, -7, 20, 14, C.white, 2, C.ink, 1.2), rect(-10, -7, 20, 4, PB, 1, null), rect(-8, -2, 6, 7, C.skin, 1, C.ink, 0.6), star(5, 1.5, 3, C.gold));
/** Handcuffs. */
const cuffs = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, circle(-9, 0, 6, 'none', C.ink, 4.2), circle(-9, 0, 6, 'none', C.silver, 2.4), circle(9, 0, 6, 'none', C.ink, 4.2), circle(9, 0, 6, 'none', C.silver, 2.4), line('M-3 0 L3 0', C.ink, 2.4), rect(-12, -8.5, 6, 4, C.silver, 1, C.ink, 0.9), rect(6, -8.5, 6, 4, C.silver, 1, C.ink, 0.9));
/** Blue-and-white barrier tape. */
const tape = (d: string) => all(line(d, C.ink, 5.4), line(d, C.white, 4), line(d, TAPE, 4, '5 5'));
const post = (x: number, y: number, h = 22) => all(rect(x - 1.6, y - h, 3.2, h, C.white, 1, C.ink, 1), rect(x - 1.6, y - h, 3.2, 4, RED, 0, null));
/** Magnifying glass (glass centre x, y). */
const mag = (x: number, y: number, s = 1, inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, line('M7 7 L16 16', C.ink, 4.4), line('M7 7 L16 16', C.brown, 2.6), circle(0, 0, 10, 'rgba(200,232,248,0.7)', C.ink, 2), inner);
/** Fingerprint swirl. */
const fprint = (x: number, y: number, s = 1, col: string = C.ink) => g(`translate(${x} ${y}) scale(${s})`, ...[2.5, 5, 7.5, 10, 12.5].map((r, i) => path(`M${-r * 0.8} ${r * 0.9} C${-r * 1.1} ${-r * 0.4} ${-r * 0.5} ${-r * 1.2} 0 ${-r * 1.2} C${r * 0.6} ${-r * 1.2} ${r * 1.1} ${-r * 0.4} ${r * 0.8} ${r * (i % 2 ? 0.6 : 1)}`, 'none', col, 1.2)));
/** Shoe print (sole) with tread. */
const shoe = (x: number, y: number, s = 1, rot = 0, col: string = '#6b5a4a') => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-5 -14 C-5 -20 5 -20 5 -14 L5 -4 C5 -2 4 -1 4 0 L4 2 C4 0 -4 0 -4 2 L-4 0 C-4 -1 -5 -2 -5 -4 Z', col, null), path('M-4 4 L4 4 L4 10 C4 14 -4 14 -4 10 Z', col, null), line('M-3 -14 L3 -14 M-3 -10 L3 -10 M-3 -6 L3 -6 M-2.5 7 L2.5 7 M-2.5 10 L2.5 10', C.white, 0.9));
/** Bare foot/animal track pair in snow. */
const paw = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ellipse(0, 2, 3, 2.6, C.grey, null), circle(-3, -2, 1.2, C.grey, null), circle(0, -3.2, 1.2, C.grey, null), circle(3, -2, 1.2, C.grey, null));
/** Wall-mounted surveillance camera (pointing left); cone = field of view. */
const cctv = (x: number, y: number, s = 1, cone = true) => g(`translate(${x} ${y}) scale(${s})`, cone ? path('M-14 4 L-70 50 L-30 62 Z', 'rgba(255,240,150,0.45)', null) : '', rect(2, -10, 6, 20, C.grey2, 1, C.ink, 1.2), line('M2 0 L-4 0', C.ink, 2), rect(-22, -6, 20, 11, C.white, 3, C.ink, 1.4), circle(-21, 0, 3.4, C.dark, C.ink, 1), circle(-6, -2, 1.2, RED, null));
/** Notebook with lines. */
const pad = (x: number, y: number, s = 1, inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-10, -13, 20, 26, C.white, 1.5, C.ink, 1.2), ...[-7, -2, 3, 8].map((d) => line(`M-6 ${d} L6 ${d}`, C.grey2, 1)), line('M-7 -13 L-7 -16 M0 -13 L0 -16 M7 -13 L7 -16', C.ink, 1.4), inner);
/** Document with lines (optional mark). */
const doc = (x: number, y: number, s = 1, mark: Svg = '', col: string = C.white) => g(`translate(${x} ${y}) scale(${s})`, rect(-10, -13, 20, 26, col, 1.5, C.ink, 1.2), line('M-6 -7 L6 -7 M-6 -2 L6 -2 M-6 3 L3 3', C.grey, 1.2), mark);
/** Folder. */
const folder = (x: number, y: number, s = 1, col: string = '#e8c46a', inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, path('M-16 -12 L-6 -12 L-3 -9 L16 -9 L16 12 L-16 12 Z', col, C.ink, 1.4), inner);
/** Evidence bag with a red seal. */
const ebag = (x: number, y: number, s = 1, inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-10, -12, 20, 24, 'rgba(230,240,248,0.85)', 2, C.ink, 1.2), rect(-10, -12, 20, 4, RED, 1, C.ink, 0.8), inner);
/** Yellow evidence marker (tent). */
const marker = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-5 0 L0 -9 L5 0 Z', C.yellow, C.ink, 1.1), line('M-1.5 -3 L1.5 -3', C.ink, 1.2));
/** Cell bars (window or door) at x, y with width w and height h. */
const bars = (x: number, y: number, w: number, h: number, bg: string = '#6a6f7a') => all(rect(x, y, w, h, bg, 1, C.ink, 1.6), ...Array.from({ length: Math.round(w / 6) - 1 }, (_, i) => line(`M${f1(x + (i + 1) * (w / Math.round(w / 6)))} ${y} L${f1(x + (i + 1) * (w / Math.round(w / 6)))} ${y + h}`, C.silver, 1.8)));
/** Question mark drawn as a shape. */
const qm = (x: number, y: number, s = 1, col: string = C.navy) => g(`translate(${x} ${y}) scale(${s})`, path('M-4 -5 C-4 -11 5 -11 5 -5 C5 -1 0 -1 0 3', 'none', col, 2.6), circle(0, 7.5, 1.6, col, null));
/** Bird. */
const bird = (x: number, y: number, s = 1, col: string = C.sky) => g(`translate(${x} ${y}) scale(${s})`, ellipse(0, 0, 8, 5, col, C.ink, 1.2), circle(7, -3, 3.4, col, C.ink, 1.2), path('M10 -3 L14 -2 L10 -1 Z', C.orange, C.ink, 0.8), circle(8, -4, 0.8, C.ink, null), path('M-2 -2 L-8 -14 L4 -3 Z', col, C.ink, 1.1), path('M-8 0 L-13 -3 L-13 3 Z', col, C.ink, 1));
/** Police dog (German shepherd look) with a small blue vest, facing left. */
const kdog = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M14 -14 C22 -18 24 -10 26 -16', 'none', C.ink, 3.2), path('M14 -14 C22 -18 24 -10 26 -16', 'none', '#a0673d', 2), path('M-14 0 L-12 -14 C-10 -20 12 -20 14 -14 L14 0 L10 0 L9 -8 L-8 -8 L-9 0 Z', '#a0673d', C.ink, 1.4), path('M-6 -18 C0 -20 8 -20 10 -16 L10 -10 L-6 -10 Z', PB, C.ink, 1), path('M-14 -12 L-20 -22 L-24 -32 L-18 -28 L-14 -32 L-12 -22 Z', '#5a3a22', C.ink, 1.2), path('M-20 -22 L-30 -18 L-30 -14 L-18 -15 Z', '#5a3a22', C.ink, 1.2), circle(-30, -16, 1.4, C.ink, null), circle(-19, -24, 1, C.ink, null));
/** Voice recorder on a table. */
const recorder = (x: number, y: number) => all(rect(x - 6, y - 5, 12, 5, C.dark, 1.5, C.ink, 1), circle(x + 3, y - 2.5, 1.2, RED, null));
/** Bottle. */
const bottle = (x: number, y: number, s = 1, col: string = '#5a8a4a') => g(`translate(${x} ${y}) scale(${s})`, path('M-3 -16 L3 -16 L3 -10 C6 -8 6 -6 6 -4 L6 8 L-6 8 L-6 -4 C-6 -6 -6 -8 -3 -10 Z', col, C.ink, 1.2));
/** Dizzy swirls above a head. */
const dizzy = (x: number, y: number) => all(path(`M${x - 8} ${y} c-3 -3 2 -6 4 -3 c2 3 -3 5 -4 2`, 'none', C.purple, 1.4), path(`M${x + 6} ${y - 4} c-3 -3 2 -6 4 -3 c2 3 -3 5 -4 2`, 'none', C.purple, 1.4), star(x - 1, y - 8, 2.4, C.yellow));
/** Signal bars: level of suspicion 1–3 (filled bars), as a gauge. */
const gauge = (x: number, y: number, lvl: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ...[0, 1, 2].map((i) => rect(-14 + i * 10, -8 - i * 7, 8, 8 + i * 7, i < lvl ? [C.yellow, C.orange, RED][i]! : C.white, 1, C.ink, 1.2)));
/** Judge bench with a Swedish flag (a court). */
const bench = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-30, -22, 60, 22, C.brown, 2, C.ink, 1.6), rect(-30, -24, 60, 4, '#7a4a2a', 1, C.ink, 1.2), line('M26 -24 L26 -50', C.ink, 1.4), rect(26, -50, 14, 9, '#3a6ab0', 0, C.ink, 1), rect(30, -50, 3, 9, C.yellow, 0, null), rect(26, -46.8, 14, 2.6, C.yellow, 0, null));
/** Clipboard protocol. */
const clip = (x: number, y: number, s = 1, mark: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-12, -15, 24, 30, C.tan, 2, C.ink, 1.3), rect(-10, -11, 20, 24, C.white, 1, C.ink, 0.9), rect(-5, -17, 10, 5, C.silver, 1.5, C.ink, 1), line('M-7 -6 L7 -6 M-7 -2 L7 -2 M-7 2 L7 2 M-7 6 L3 6', C.grey, 1.1), mark);
/** Crowbar. */
const crowbar = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M0 0 L0 -30 C0 -36 6 -36 8 -32', 'none', C.ink, 4.4), path('M0 0 L0 -30 C0 -36 6 -36 8 -32', 'none', RED, 2.6));
/** Laptop. */
const laptop = (x: number, y: number, s = 1, scr: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-12, -16, 24, 15, C.dark, 1.5, C.ink, 1.2), rect(-10, -14, 20, 11, '#bfe3f5', 1, null), scr, path('M-15 -1 L15 -1 L13 2 L-13 2 Z', C.grey2, C.ink, 1));
/** Price-style tag (evidence label) hanging from a string. */
const tagL = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 -6 L0 -2', C.ink, 0.8), rect(-4, -2, 8, 6, '#f6e7a8', 1, C.ink, 0.8), circle(0, 0, 0.8, C.ink, null));
/** Jewel box with sparkles. */
const jewels = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-10, -6, 20, 10, '#7a3a8a', 2, C.ink, 1.2), circle(-4, -8, 2.6, C.gold, C.ink, 0.8), circle(3, -8, 2.2, C.sky, C.ink, 0.8), sparkle(8, -12, 3));
/** Double helix (DNA). */
const helix = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-4 -12 C4 -8 4 -4 -4 0 C-12 4 -12 8 -4 12', 'none', C.purple, 1.8), path('M4 -12 C-4 -8 -4 -4 4 0 C12 4 12 8 4 12', 'none', C.green, 1.8), line('M-1 -10 L1 -10 M-2 -6 L2 -6 M-6 3 L-2 3 M-7 7 L-1 7', C.grey, 1));
/** Snail (slow, grey reference). */
const snail = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-12 0 L10 0 C12 0 14 -2 13 -4 L10 -4', C.tan, C.ink, 1.2), circle(-2, -8, 8, C.brown, C.ink, 1.2), path('M-2 -8 m-4 0 a4 4 0 1 1 4 4', 'none', C.ink, 1), line('M11 -4 L13 -10 M12 -4 L16 -9', C.ink, 1));
/** Box (archive). */
const crate = (x: number, y: number, w = 30, h = 20, col: string = C.tan) => all(rect(x - w / 2, y - h, w, h, col, 1, C.ink, 1.4), line(`M${x - w / 2} ${y - h + 5} L${x + w / 2} ${y - h + 5}`, '#a0673d', 1.2), rect(x - 4, y - h + 8, 8, 4, C.white, 1, C.ink, 0.8));
/** Puzzle piece. */
const piece = (x: number, y: number, s = 1, col: string = C.sky) => g(`translate(${x} ${y}) scale(${s})`, path('M-8 -8 L-2 -8 C-3 -12 3 -12 2 -8 L8 -8 L8 -2 C12 -3 12 3 8 2 L8 8 L-8 8 Z', col, C.ink, 1.2));
/** Lamp post; on = lit with a light cone. */
const lamp = (x: number, y: number, on = true) => all(on ? path(`M${x - 4} ${y - 52} L${x - 22} ${y} L${x + 14} ${y} L${x + 4} ${y - 52} Z`, 'rgba(255,240,150,0.5)', null) : '', line(`M${x} ${y} L${x} ${y - 56}`, C.dark, 2.4), rect(x - 5, y - 60, 10, 6, on ? C.yellow : C.grey, 2, C.ink, 1.2));
/** A shadowy person (unknown offender): dark hoodie, face in shadow. */
const shadow = (x: number, more: Partial<Build> = {}) => all(F({ x, top: '#3d3f4a', bottom: '#2e2e36', mood: 'angry', ...more }), (() => { const s = 0.84 * (more.h ?? 1); return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, path('M-12 -50 C-14 -72 14 -72 12 -50 C8 -62 -8 -62 -12 -50 Z', '#3d3f4a', C.ink, 1.6)); })());
/** Motion lines to the left of x. */
const speed = (x: number, y: number) => line(`M${x - 4} ${y - 6} L${x - 14} ${y - 6} M${x - 2} ${y} L${x - 16} ${y} M${x - 4} ${y + 6} L${x - 12} ${y + 6}`, C.grey, 1.6);

// ── Motifs ───────────────────────────────────────────────────────────
export const POLICE_MOTIFS: Record<string, Svg> = {
  // ── Polisens arbetsuppgifter ─────────────────────────────────────
  // polisstation: the stone house with the blue sign and gold star; a police car parked outside and an officer at the door.
  'polis.polisstation': all(ground, station(56, 112, 1.3), pcar(98, 112, 0.6), cop(16, 'smile', { h: 0.6 })),
  // uniform: a police uniform on a hanger (navy jacket, reflective band, gold star) and the cap on a hook beside it.
  'polis.uniform': all(line('M60 6 L60 14 M60 14 L36 28 M60 14 L84 28', C.ink, 1.8), path('M38 26 L82 26 L96 42 L92 80 L82 80 L82 104 L38 104 L38 80 L28 80 L24 42 Z', C.navy, C.ink, 1.8), path('M38 26 L82 26 L82 104 L38 104 Z', C.navy, null), rect(38, 64, 44, 6, C.reflex, 0, C.ink, 1), rect(24, 64, 14, 6, C.reflex, 0, null), rect(82, 64, 12, 6, C.reflex, 0, null), line('M60 30 L60 104', C.ink, 1.2), path('M50 26 L60 38 L70 26', 'none', C.ink, 1.4), star(72, 44, 4.6, C.gold), circle(56, 48, 1.4, C.gold, null), circle(56, 58, 1.4, C.gold, null), circle(56, 80, 1.4, C.gold, null), g('translate(106 30)', path('M-11 0 C-11 -10 11 -10 11 0 Z', C.navy, C.ink, 1.4), ellipse(0, 1, 13, 2.6, C.dark, C.ink, 1), star(0, -4, 2.4, C.gold)), line('M106 20 L106 14', C.ink, 1.4)),
  // i tjänst: the same woman twice – at home in her own clothes she is grey (off duty); at work in uniform beside the police car she is in colour.
  'polis.i-tjänst': all(ground, greyed(civ(24, C.green, 'sleepy', { hairStyle: 'long', h: 0.78 }), rect(4, 86, 40, 12, C.purple, 4, C.ink, 1.4), moon(12, 24, 7)), line('M50 14 L50 108', C.grey2, 1.6, '4 4'), pcar(98, 112, 0.5), cop(76, 'smile', { hairStyle: 'long', h: 0.86 }), sun(108, 22, 6)),
  // patrullera: two officers walk a round through the neighbourhood; the dashed loop arrow shows their round past the houses.
  'polis.patrullera': all(ground, house(20, 70, 0.42, C.yellow, RED), house(100, 70, 0.42, C.sky, C.navy), dash('M14 104 C-4 92 6 54 60 50 C114 54 124 92 106 104', HL, 1.8, '4 3'), arrow(98, 104, 106, 104, HL, 2), cop(48, 'calm', { h: 0.66 }), cop(70, 'calm', { h: 0.66, hairStyle: 'long' }), speed(40, 92)),
  // befogenhet: the officer (gold star glowing) raises a palm and the car stops at once; grey: an ordinary person does the same and the car drives on (cross).
  'polis.befogenhet': all(ground, circle(30, 64, 30, '#fff5d6', HL, 2), cop(30, 'calm', { h: 0.84 }), reach(30, 0.84, 1, 50, 44), palm(52, 38, 1.1), car(92, 112, 0.62, C.red), check(92, 76, 1.2), greyed(g('translate(84 6) scale(0.34)', civ(0, C.green, 'calm'), car(60, 112, 0.8, C.red), arrow(70, 90, 100, 90, C.ink, 4))), cross(112, 24, 0.8)),
  // upprätthålla: a woman holds a plank perfectly level (bubble in the middle) – morning, noon and night the same state is kept (ticks along a continuing arrow); grey: the plank let go, fallen and tilted.
  'polis.upprätthålla': all(ground, ...[[24, 14, 0], [60, 14, 1], [96, 14, 2]].map(([x, y, k]) => all(k === 2 ? moon(x!, y!, 6) : sun(x!, y! + (k === 0 ? 4 : 0), 5), check(x!, y! + 14, 0.7))), dash('M14 38 L106 38', HL, 2, '5 4'), arrow(100, 38, 110, 38, HL, 2), rect(16, 57, 88, 7, C.tan, 2, C.ink, 1.6), rect(50, 50, 20, 5, C.white, 2, C.ink, 1), circle(60, 52.5, 1.8, C.green, null), civ(60, C.purple, 'calm', { hairStyle: 'long', h: 0.62 }), reach(60, 0.62, -1, 40, 60), reach(60, 0.62, 1, 80, 60), greyed(g('rotate(-18 30 110)', rect(4, 104, 52, 6, C.tan, 2, C.ink, 1.4)), cross(98, 96, 0.9))),
  // allmän ordning: a calm town square – people stroll, sit on a bench and chat, an officer walks by; grey: the same square in disorder (shouting, a broken bench).
  'polis.allmän-ordning': all(ground, rect(4, 92, 112, 20, '#e6e1d6', 0, null), tree(14, 92, 0.6), civ(36, C.orange, 'smile', { hairStyle: 'long', h: 0.6 }), civ(52, C.sky, 'smile', { h: 0.64 }), rect(66, 92, 22, 4, C.brown, 1, C.ink, 1.2), line('M68 96 L68 104 M86 96 L86 104', C.ink, 1.6), mini(72, 84, C.green, 'smile', 0.7, true), mini(82, 84, C.yellow, 'smile', 0.7), cop(104, 'smile', { h: 0.62 }), greyed(g('translate(26 22) scale(0.42)', rect(-30, -22, 60, 44, C.white, 3, C.ink, 2), mini(-12, 2, C.grey, 'frown'), mini(12, 2, C.grey, 'frown'), path('M-4 -14 L4 -6 M4 -14 L-4 -6', 'none', C.ink, 2))), cross(26, 22, 0.6)),
  // ordningsvakt: a guard in dark clothes with a yellow armband and arms crossed stands at the door of a restaurant at night, guests queuing.
  'polis.ordningsvakt': all(ground, rect(54, 24, 62, 88, '#7a4a3a', 1, C.ink, 1.6), door(84, 112, 18, 30, C.dark), win(66, 50, 12, 10, true), win(102, 50, 12, 10, true), lamp(60, 112, true), civ(84, C.black, 'calm', { h: 0.8 }), rect(70, 62, 6, 5, C.yellow, 1, C.ink, 0.8), star(73, 64.5, 1.6, C.navy), mini(20, 96, C.orange, 'smile', 0.9, true), mini(36, 96, C.sky, 'smile', 0.9), moon(16, 18, 7), arrow(46, 90, 58, 90, C.grey, 1.6)),
  // brottsförebyggande: a well-lit park path where people walk safely; grey reference: the same path dark, with a lurking shadow, crossed out.
  'polis.brottsförebyggande': all(ground, rect(44, 102, 72, 10, '#e6e1d6', 0, null), lamp(64, 112, true), lamp(102, 112, true), civ(84, C.orange, 'smile', { hairStyle: 'long', h: 0.66 }), shield(110, 30, 0.7), greyed(g('translate(0 0)', rect(4, 40, 36, 72, '#5b5f6a', 2, null), lamp(14, 112, false), shadow(28, { h: 0.5 }))), cross(22, 32, 0.9)),
  // trafikkontroll: an officer raises a palm and stops a car by the cones; she will check the driver and the car.
  'polis.trafikkontroll': all(rect(0, 96, 120, 16, '#8a8f98', 0, null), line('M4 104 L20 104 M34 104 L50 104 M64 104 L80 104', C.white, 2), ...[16, 30].map((x) => path(`M${x - 5} 112 L${x} 98 L${x + 5} 112 Z`, C.orange, C.ink, 1.2)), car(86, 108, 0.8, C.red), mini(84, 84, C.green, 'flat', 0.6), cop(50, 'calm', { h: 0.8 }), reach(50, 0.8, 1, 66, 50), palm(68, 44, 1.1), pcar(20, 92, 0.42, true)),
  // nykterhetskontroll: the officer holds a breath tester to the open car window; the driver blows and the tester shows green.
  'polis.nykterhetskontroll': all(rect(0, 100, 120, 12, '#8a8f98', 0, null), car(84, 106, 1.1, C.sky), mini(80, 74, C.orange, 'flat', 0.8, true), cop(36, 'calm', { h: 0.88 }), reach(36, 0.88, 1, 64, 72), rect(60, 64, 8, 16, C.dark, 2, C.ink, 1.2), rect(61.5, 68, 5, 4, C.green, 1, null), line('M68 66 L73 70', C.white, 2.4), line('M74 70 L78 72 M74 74 L78 75', C.sky, 1.2), check(64, 54, 1)),
  // berusad: a man sways by a bench with a bottle in his hand; swirls and stars above his head, red cheeks.
  'polis.berusad': all(ground, rect(70, 92, 40, 4, C.brown, 1, C.ink, 1.2), line('M74 96 L74 108 M106 96 L106 108', C.ink, 1.6), g('rotate(-8 50 112)', civ(50, C.green, 'sleepy', { h: 0.86 })), dizzy(48, 10), reach(50, 0.86, 1, 72, 74), bottle(74, 78, 0.8), path('M32 80 C28 84 32 88 28 92', 'none', C.grey, 1.4)),
  // omhänderta: two officers gently lead a drunk man (swirls) between them towards the police car, holding his arms.
  'polis.omhänderta': all(ground, pcar(100, 112, 0.6, true), cop(26, 'calm', { h: 0.8 }), civ(50, C.green, 'sleepy', { h: 0.8 }), dizzy(48, 30), cop(74, 'calm', { h: 0.8, hairStyle: 'long' }), reach(26, 0.8, 1, 42, 66), reach(74, 0.8, -1, 58, 66), arrow(84, 54, 98, 54, HL, 2)),
  // civilklädd: a woman in an ordinary green jacket shows her police ID card; beside her a grey officer in uniform for comparison.
  'polis.civilklädd': all(ground, greyed(cop(90, 'calm', { h: 0.76 })), civ(40, C.green, 'calm', { hairStyle: 'long', h: 0.9, bottom: C.denim }), reach(40, 0.9, 1, 62, 50), idCard(66, 44, 1.3), circle(66, 44, 15, 'none', HL, 1.6)),

  // ── Anmälan och misstanke ────────────────────────────────────────
  // polisanmälan: at the police counter a woman tells what happened; the officer writes it into a report on the screen (form with the gold star).
  'polis.polisanmälan': all(ground, rect(4, 70, 112, 8, C.tan, 2, C.ink, 1.6), rect(10, 78, 100, 34, '#cfc6b3', 1, C.ink, 1.4), cop(84, 'calm', { h: 0.84 }), laptop(70, 68, 1, doc(0, -8, 0.32, star(0, 6, 4, C.gold))), civ(28, C.orange, 'frown', { hairStyle: 'long', h: 0.86 }), say(30, 12, 30, 18, 30, 24, all(g('translate(22 14) scale(0.3)', path('M-14 0 L14 0 M0 0 L0 -14', 'none', C.ink, 3), circle(-12, 4, 8, 'none', C.ink, 3), circle(12, 4, 8, 'none', C.ink, 3)), qm(38, 12, 0.6, RED))), doc(48, 62, 0.6, star(0, 6, 4, C.gold))),
  // polisanmäla: at home a woman with a broken lock fills in a report on her laptop; an arrow goes from her screen to the police station.
  'polis.polisanmäla': all(ground, table(84, 8, 70), civ(30, C.orange, 'calm', { hairStyle: 'long', h: 0.8 }), laptop(46, 84, 1, doc(0, -8, 0.32, star(0, 6, 4, C.gold))), g('translate(16 92)', padlock(0, 0, 0.6, true), line('M4 -10 L8 -14', RED, 1.6)), dash('M58 66 C70 40 84 36 92 46', HL, 1.8), arrow(88, 42, 94, 48, HL, 2), station(98, 112, 0.6)),
  // brottsoffer: a woman sits hurt (plaster, torn bag strap, sad); a supporter kneels by her and holds her hand.
  'polis.brottsoffer': all(ground, rect(20, 86, 44, 6, C.brown, 2, C.ink, 1.4), line('M24 92 L24 112 M60 92 L60 112', C.ink, 1.6), civ(40, C.purple, 'frown', { hairStyle: 'long', h: 0.78 }), g('translate(40 62)', plaster(0, 0, -20)), path('M38 30 L40 32 M44 30 L42 32', 'none', C.sky, 1.4), civ(86, C.green, 'smile', { h: 0.72 }), reach(86, 0.72, -1, 54, 80), heartM(70, 40, 0.6), path('M18 100 L10 106 M14 96 L6 98', 'none', C.brown, 1.6)),
  // gärningsperson: a figure in a dark hood runs off with a stolen bag; the victim behind is shocked; dashed track of the escape.
  'polis.gärningsperson': all(ground, shadow(70, { h: 0.84 }), reach(70, 0.84, 1, 94, 70), path('M90 70 L100 70 L102 84 L88 84 Z', C.red, C.ink, 1.4), speed(56, 70), civ(22, C.orange, 'shock', { hairStyle: 'long', h: 0.7 }), circle(70, 40, 22, 'none', HL, 2)),
  // signalement: on the officer's notebook a description of the man: his outline with a height ruler, a red jacket swatch and dark hair swatch.
  'polis.signalement': all(rect(14, 8, 92, 104, C.white, 3, C.ink, 1.8), ...[0, 1, 2, 3, 4].map((i) => line(`M${30 + i * 15} 8 L${30 + i * 15} 3`, C.ink, 1.6)), civ(46, RED, 'calm', { h: 0.86 }), line('M76 20 L76 104', C.ink, 1.4), ...Array.from({ length: 9 }, (_, i) => line(`M76 ${20 + i * 10.5} L80 ${20 + i * 10.5}`, C.ink, 1.2)), rect(86, 30, 12, 10, RED, 1, C.ink, 1), rect(86, 48, 12, 10, C.hair, 1, C.ink, 1), rect(86, 66, 12, 10, C.navy, 1, C.ink, 1)),
  // efterlysning: a poster on a wall with a man's portrait, a question mark and a phone; two people stop and look at it.
  'polis.efterlysning': all(ground, rect(26, 10, 68, 64, C.white, 2, C.ink, 1.8), rect(26, 10, 68, 10, PB, 1, null), star(60, 15, 3.4, C.gold), rect(36, 26, 26, 30, '#e8eef4', 1, C.ink, 1.2), g('translate(49 58) scale(0.5)', mini(0, -10, C.red, 'flat', 1.6)), qm(78, 38, 1.4, RED), g('translate(78 62) scale(0.5)', phone(0, 0)), mini(20, 98, C.orange, 'smile', 1, true), mini(100, 98, C.green, 'flat', 1)),
  // tips (to the police): a person whispers into the phone (shielding it); in the bubble a car in a garage; the officer at the other end writes it down.
  'polis.tips.2': all(ground, civ(26, C.purple, 'calm', { h: 0.82 }), reach(26, 0.82, 1, 36, 32), g('translate(38 32) scale(0.42)', phone(0, 0)), sb(26, 0.82, 1, 30, 24, (x, y) => all(path(`M${x - 12} ${y + 8} L${x - 12} ${y - 2} L${x} ${y - 9} L${x + 12} ${y - 2} L${x + 12} ${y + 8} Z`, '#d8cbb3', C.ink, 1), car(x, y + 8, 0.36, C.red)), 2, -8), cop(92, 'calm', { h: 0.78 }), reach(92, 0.78, -1, 78, 64), pad(74, 70, 0.7), dash('M44 40 C60 30 70 30 80 40', HL, 1.4)),
  // misstanke (against a person): the officer's thought cloud points the suspicion at one particular man in a line of people (question mark over him).
  'polis.misstanke.2': all(ground, cop(22, 'calm', { h: 0.84 }), tb(22, 0.84, 1, 40, (x, y) => all(mini(x - 4, y + 2, C.red, 'flat', 0.7), qm(x + 10, y, 0.8, RED))), greyed(mini(62, 96, C.grey, 'flat', 1.1), mini(102, 96, C.grey, 'flat', 1.1, true)), mini(82, 96, C.red, 'flat', 1.1), qm(82, 74, 1.1, RED), dash('M40 60 L76 84', HL, 1.4)),
  // misstänkt: a man under a magnifying glass; two officers' question marks rest on him – he is suspected, not yet proven.
  'polis.misstänkt': all(ground, civ(60, C.red, 'frown', { h: 0.84 }), mag(60, 46, 2.2), qm(26, 30, 1.4, RED), qm(94, 30, 1.4, RED), greyed(mini(14, 96, C.grey, 'smile', 1), mini(106, 96, C.grey, 'smile', 1, true))),
  // skäligen misstänkt: three steps of suspicion; the man (in a ring) stands on the middle, orange step, put there by two facts (a witness's eye, a footprint); the lower step and the higher step are grey – he is not at the top level.
  'polis.skäligen-misstänkt': all(ground, ...[0, 1, 2].map((i) => rect(34 + i * 26, 100 - i * 22, 26, 12 + i * 22, i === 1 ? C.orange : C.grey2, 1, C.ink, 1.4)), mini(73, 72, C.red, 'flat', 1.1), greyed(mini(99, 50, C.grey, 'flat', 1), mini(47, 94, C.grey, 'flat', 0.9)), g('translate(14 30)', ellipse(0, 0, 9, 5.6, C.white, C.ink, 1.4), circle(0, 0, 3, '#3a6ab0', null)), shoe(14, 62, 0.9, -10), arrow(24, 36, 60, 62, HL, 1.8), arrow(22, 64, 60, 72, HL, 1.8), circle(73, 72, 15, 'none', HL, 2)),
  // på sannolika skäl: the gauge is full (red) – many facts point at the man: witness, footprint, the bag found; grey: the middle-level gauge.
  'polis.på-sannolika-skäl': all(ground, mini(90, 96, C.red, 'flat', 1.3), gauge(90, 60, 3, 1.2), g('translate(22 22)', ellipse(0, 0, 9, 5.6, C.white, C.ink, 1.4), circle(0, 0, 3, '#3a6ab0', null)), shoe(22, 58, 0.9, -10), path('M14 84 L28 84 L30 98 L12 98 Z', C.red, C.ink, 1.2), arrow(34, 26, 72, 60, HL, 1.8), arrow(32, 58, 72, 74, HL, 1.8), arrow(34, 90, 72, 92, HL, 1.8), greyed(gauge(50, 112, 2, 0.6))),

  // ── Vittnen och förhör ───────────────────────────────────────────
  // ögonvittne: a man watches a car drive through a red light – a big eye and a dashed sight line from his eyes to the car.
  'polis.ögonvittne': all(rect(0, 96, 120, 16, '#8a8f98', 0, null), civ(22, C.orange, 'shock', { h: 0.86 }), line('M98 96 L98 50', C.ink, 2), rect(92, 30, 12, 24, C.dark, 2, C.ink, 1.2), circle(98, 36, 3.4, RED, null), circle(98, 46, 3.4, '#555', null), car(70, 106, 0.8, C.sky), speed(46, 96), dash('M28 26 L64 80', HL, 1.6), g('translate(46 14)', ellipse(0, 0, 11, 7, C.white, C.ink, 1.6), circle(0, 0, 4, '#3a6ab0', null), circle(0, 0, 1.6, C.ink, null))),
  // förhör: an interview room – officer and a man on each side of a table, a recorder with a red light between them, a lamp above.
  'polis.förhör': all(rect(4, 6, 112, 106, '#e9e6df', 2, null), line('M60 6 L60 18', C.ink, 1.4), path('M50 26 L70 26 L64 18 L56 18 Z', C.yellow, C.ink, 1.2), cop(28, 'calm', { h: 0.84 }), civ(92, C.green, 'frown', { h: 0.84 }), table(76, 10, 110), recorder(60, 76), pad(36, 70, 0.6), say(54, 42, 18, 16, 38, 36, qm(54, 42, 0.8))),
  // förhöra (police sense): the officer leans over the table and asks question after question; the woman answers.
  'polis.förhöra.2': all(cop(32, 'calm', { h: 0.9 }), civ(90, C.purple, 'calm', { hairStyle: 'long', h: 0.84 }), table(80, 4, 116), reach(32, 0.9, 1, 56, 78), sb(32, 0.9, 1, 20, 16, (x, y) => qm(x, y, 0.8), 0, -6), say(64, 10, 16, 12, 72, 22, qm(64, 10, 0.6)), sb(90, 0.84, -1, 20, 16, (x, y) => all(line(`M${x - 6} ${y - 2} L${x + 6} ${y - 2} M${x - 6} ${y + 2} L${x + 3} ${y + 2}`, C.grey, 1.4)), 0, 4)),
  // förhörsledare: the officer leading the interview is in a ring of light, with notebook and recorder; the person questioned is grey.
  'polis.förhörsledare': all(circle(34, 60, 30, '#fff5d6', HL, 2), cop(34, 'calm', { h: 0.86 }), greyed(civ(92, C.grey, 'calm', { h: 0.82 })), table(80, 6, 114), recorder(64, 80), reach(34, 0.86, 1, 50, 72), pad(52, 72, 0.6), sb(34, 0.86, 1, 18, 14, (x, y) => qm(x, y, 0.7), 2, -4)),
  // iakttagelse: a woman on a balcony looks down; her thought cloud holds what she noticed (a red car and a man in a green jacket), which she will report.
  'polis.iakttagelse': all(ground, rect(4, 56, 50, 56, '#e6d3b3', 1, C.ink, 1.6), rect(4, 52, 54, 5, C.grey2, 1, C.ink, 1.2), civ(28, C.orange, 'calm', { hairStyle: 'long', h: 0.52 }), car(92, 112, 0.6, RED), mini(70, 98, C.green, 'flat', 0.8), dash('M32 40 L84 96', HL, 1.4), tb(28, 0.52, 1, 50, (x, y) => all(car(x - 8, y + 6, 0.3, RED), mini(x + 12, y + 2, C.green, 'flat', 0.5), check(x + 20, y - 6, 0.5)), 6, -14, 26)),
  // ledande fråga: the officer's question bubble already contains a knife – and the answer bubble simply repeats the knife (arrow pushes the answer); grey: an open question bubble.
  'polis.ledande-fråga': all(cop(28, 'calm', { h: 0.84 }), civ(92, C.green, 'calm', { h: 0.84 }), sb(28, 0.84, 1, 30, 22, (x, y) => all(g(`translate(${x - 4} ${y}) rotate(-30)`, rect(-1.5, -9, 3, 10, C.silver, 1, C.ink, 1), rect(-2, 1, 4, 6, C.brown, 1, C.ink, 1)), qm(x + 9, y, 0.6)), 4, -2), sb(92, 0.84, -1, 26, 20, (x, y) => all(g(`translate(${x} ${y}) rotate(-30)`, rect(-1.5, -9, 3, 10, C.silver, 1, C.ink, 1), rect(-2, 1, 4, 6, C.brown, 1, C.ink, 1))), -2, 16), arrow(52, 26, 72, 36, RED, 2), greyed(say(60, 104, 22, 14, 60, 98, qm(60, 104, 0.7)))),
  // vittna: a witness stands before the court bench (Swedish flag) and speaks; the judges listen.
  'polis.vittna': all(ground, bench(76, 76, 1.2), mini(66, 44, C.dark, 'flat', 1), mini(88, 44, C.dark, 'flat', 1, true), civ(24, C.orange, 'calm', { hairStyle: 'long', h: 0.8 }), sb(24, 0.8, 1, 22, 16, (x, y) => all(line(`M${x - 7} ${y - 2} L${x + 7} ${y - 2} M${x - 7} ${y + 2} L${x + 4} ${y + 2}`, C.grey, 1.4)), 0, -4), rect(40, 84, 16, 28, C.brown, 1, C.ink, 1.4)),
  // motsägelse: a man says two things that cannot both be true – one bubble shows him at home, the other in the restaurant; a red lightning bolt between them.
  'polis.motsägelse': all(ground, civ(60, C.red, 'frown', { h: 0.72 }), say(24, 30, 36, 30, 52, 50, house(24, 44, 0.3, C.yellow, RED)), say(96, 30, 36, 30, 68, 50, all(rect(84, 22, 24, 18, '#7a4a3a', 1, C.ink, 1), win(92, 30, 6, 6, true), path('M100 40 L100 32 L106 32 L106 40', C.dark, C.ink, 0.8))), path('M60 8 L54 20 L62 20 L56 34', 'none', RED, 2.6)),
  // neka (deny): the suspect shakes his head and holds up his palm; his bubble: the bag crossed out.
  'polis.neka.2': all(civ(70, C.red, 'frown', { h: 0.9 }), table(84, 30, 116), path('M58 14 C56 18 56 20 58 24 M82 14 C84 18 84 20 82 24', 'none', C.grey, 1.4), reach(70, 0.9, -1, 48, 46), palm(46, 40, 1.1), sb(70, 0.9, 1, 24, 22, (x, y) => all(path(`M${x - 6} ${y - 4} L${x + 6} ${y - 4} L${x + 7} ${y + 6} L${x - 7} ${y + 6} Z`, RED, C.ink, 1), cross(x, y + 1, 0.9)), 0, -10), greyed(cop(18, 'calm', { h: 0.74 }))),

  // ── Bevis och spår ───────────────────────────────────────────────
  // brottsplats: a room after the event – a broken window, things on the floor, yellow evidence markers and blue-white tape at the door.
  'polis.brottsplats': all(rect(4, 6, 112, 106, '#efe7da', 2, C.ink, 1.6), rect(4, 86, 112, 26, '#d8c4a4', 0, null), rect(60, 20, 34, 30, '#d8eef8', 1, C.ink, 1.6), path('M66 26 L74 34 L70 40 L80 46 M86 24 L80 32 L88 38', 'none', C.ink, 1.2), path('M70 92 L78 88 L84 94 Z M50 100 L58 98 L56 104 Z', '#bfe3f5', C.ink, 0.8), marker(54, 108), marker(80, 98), marker(96, 108), rect(16, 92, 20, 8, C.purple, 2, C.ink, 1), tape('M6 40 L40 70')),
  // spärra av: an officer stretches blue-white tape from post to post across the street; behind it nobody may pass.
  'polis.spärra-av': all(ground, post(14, 112, 26), post(106, 112, 26), cop(44, 'calm', { h: 0.84 }), tape('M14 90 L46 72'), reach(44, 0.84, 1, 70, 72), tape('M70 72 L106 90'), arrow(76, 60, 98, 70, HL, 1.8)),
  // avspärrning: blue-white tape runs across the picture; behind it a house with an officer, in front curious onlookers are kept out.
  'polis.avspärrning': all(ground, house(84, 80, 0.6, C.beige, C.brown), cop(56, 'calm', { h: 0.6 }), post(8, 112, 30), post(112, 112, 30), tape('M8 86 L112 86'), mini(22, 100, C.orange, 'frown', 1, true), mini(42, 102, C.green, 'flat', 1), mini(98, 100, C.sky, 'frown', 1)),
  // spår (a trace): footprints in the snow lead from the road to a house door, next to an animal's tracks.
  'polis.spår.3': all(rect(0, 60, 120, 52, C.white, 0, null), house(96, 70, 0.5, C.red, C.dark), ...[[12, 106], [22, 98], [32, 102], [42, 94], [52, 98], [62, 90], [72, 92], [82, 84]].map(([x, y], i) => shoe(x!, y!, 0.6, 70 - (i % 2) * 10, C.grey)), ...[[20, 76], [30, 72], [40, 74], [50, 70]].map(([x, y]) => paw(x!, y!, 0.8)), mag(30, 98, 1.2)),
  // kriminaltekniker: a technician in a white overall, mask and blue gloves kneels and brushes powder on a glass; evidence bag beside.
  'polis.kriminaltekniker': all(ground, F({ x: 54, top: C.white, bottom: C.white, mood: 'calm', h: 0.8 }), (() => { const k = geo(54, 0.8); return all(path(`M${54 - 9} ${k.hy - 4} C${54 - 10} ${k.hy - 16} ${54 + 10} ${k.hy - 16} ${54 + 9} ${k.hy - 4} Z`, C.white, C.ink, 1.2), rect(50, k.hy + 1, 8, 4, '#bfe3f5', 1.5, C.ink, 0.8)); })(), reach(54, 0.8, 1, 80, 92), circle(80, 92, 3, '#5a9ad8', C.ink, 1.2), glassOf(92, 108), fprint(92, 98, 0.3, C.ink), ebag(24, 100, 0.7, fprint(0, 2, 0.3)), line('M80 92 L86 86', C.brown, 2), ellipse(87, 85, 2.4, 1.6, C.dark, null)),
  // säkra spår: a gloved hand lifts a hair with tweezers into a sealed evidence bag; a camera has photographed the spot (flash) and the bag gets a label.
  'polis.säkra-spår': all(rect(4, 84, 112, 28, '#d8c4a4', 0, null), marker(34, 100), path('M30 92 C36 88 42 94 48 90', 'none', C.hair, 1.2), path('M58 58 L46 88 M62 58 L48 88', 'none', C.ink, 2.6), path('M58 58 L46 88 M62 58 L48 88', 'none', C.silver, 1.4), path('M52 44 C52 36 70 36 70 44 L70 60 L54 60 Z', '#5a9ad8', C.ink, 1.4), rect(70, 46, 16, 10, '#5a9ad8', 3, C.ink, 1.2), ebag(92, 70, 1.3, all(path('M86 72 C90 68 94 74 98 70', 'none', C.hair, 1.2), tagL(0, 14, 1.2))), arrow(66, 60, 80, 66, HL, 1.8), g('translate(26 30)', rect(-10, -6, 20, 13, C.dark, 2, C.ink, 1.2), circle(0, 1, 4, '#9fd0f0', C.ink, 1), rect(-8, -9, 6, 3, C.dark, 1, C.ink, 0.8)), sparkle(40, 22, 5, C.yellow)),
  // fingeravtryck: a large fingerprint on a drinking glass, seen through a magnifying glass.
  'polis.fingeravtryck': all(glassOf(40, 106, 'rgba(255,255,255,0.4)', 60), fprint(40, 76, 0.9, '#5a5a6a'), mag(78, 50, 2.6, fprint(0, 0, 0.7, C.ink))),
  // skoavtryck: a clear shoe print in soft soil with a ruler beside it for size.
  'polis.skoavtryck': all(rect(4, 40, 112, 72, '#b89a72', 4, null), shoe(54, 76, 2.8, 8, '#6b5338'), rect(88, 44, 10, 64, C.yellow, 1, C.ink, 1.2), ...Array.from({ length: 12 }, (_, i) => line(`M88 ${48 + i * 5} L${i % 2 ? 92 : 95} ${48 + i * 5}`, C.ink, 1)), marker(22, 104)),
  // blodspår: small drops and a smear of blood on a door and the floor, a yellow marker beside them.
  'polis.blodspår': all(rect(4, 96, 112, 16, '#d8c4a4', 0, null), rect(40, 10, 50, 86, C.white, 1, C.ink, 1.6), circle(82, 54, 2, C.gold, null), ...[[54, 50, 3], [58, 58, 2], [52, 64, 2.4], [70, 104, 4], [80, 108, 3], [60, 100, 2.4]].map(([x, y, r]) => circle(x!, y!, r!, '#b02020', null)), path('M60 40 C62 46 56 50 58 56', 'none', '#b02020', 2.4), marker(30, 108), mag(26, 60, 1.2)),
  // analysera: in a laboratory a woman looks through a microscope at a sample; a chart on the screen shows the result.
  'polis.analysera': all(table(84, 4, 116), civ(30, C.white, 'calm', { hairStyle: 'long', h: 0.86 }), g('translate(54 84)', rect(-8, -2, 16, 2, C.dark, 1, null), line('M-2 -2 L-2 -30', C.dark, 4), rect(-6, -36, 10, 10, C.dark, 2, C.ink, 1), line('M-4 -26 L-12 -18', C.dark, 3)), rect(48, 70, 12, 3, '#f0d0d0', 1, C.ink, 0.6), laptop(94, 84, 1.4, all(rect(-8, -9, 3, 5, C.green, 0, null), rect(-3, -12, 3, 8, C.orange, 0, null), rect(2, -7, 3, 3, RED, 0, null))), arrow(64, 50, 76, 58, HL, 1.6)),
  // dna-spår: a single hair on a cap under the magnifying glass, and next to it the double helix that the trace reveals.
  'polis.dna-spår': all(path('M18 98 C18 70 70 70 70 98 Z', '#3d3f4a', C.ink, 1.6), rect(14, 96, 60, 6, '#3d3f4a', 2, C.ink, 1.2), path('M36 80 C44 74 48 84 56 78', 'none', C.yellow, 1.6), mag(46, 80, 1.6), arrow(70, 60, 82, 50, HL, 2), helix(96, 40, 1.7)),
  // jämföra uses an existing picture. träff (match): two identical fingerprints side by side with an equals sign and a green tick on a screen.
  'polis.träff.2': all(rect(8, 14, 104, 70, C.dark, 3, C.ink, 1.6), rect(12, 18, 96, 62, '#e8f2f8', 1, null), fprint(36, 48, 1, C.ink), fprint(84, 48, 1, C.ink), eq(60, 48, 1.2), okB(60, 100, 10), line('M60 84 L60 90', C.ink, 2)),
  // övervakningskamera: a camera on the wall films the entrance; its view cone falls on a man walking in.
  'polis.övervakningskamera': all(ground, rect(96, 8, 20, 104, '#e6d3b3', 0, C.ink, 1.4), cctv(96, 22, 1.2), civ(46, C.dark, 'calm', { h: 0.72 }), door(108, 112, 12, 26, C.brown)),
  // alibi: at the very same time (same clock) a house is broken into on the left, while the man is clearly at work on the right – green tick; the two places are separate.
  'polis.alibi': all(ground, line('M60 8 L60 112', C.grey2, 1.6, '4 4'), greyed(house(30, 96, 0.5, C.beige, C.dark), path('M24 80 L30 86 M36 80 L28 88', 'none', C.ink, 1.6)), clock(30, 22, 9, 10, 0), clock(90, 22, 9, 10, 0), civ(90, C.navy, 'smile', { h: 0.62 }), table(94, 70, 114), laptop(106, 92, 0.7), check(74, 50, 1.4)),

  // ── Gripande och anhållande ──────────────────────────────────────
  // gripa (arrest): the officer holds the man's arm from behind while the man's hands are cuffed; the police car waits.
  'polis.gripa.2': all(ground, pcar(100, 112, 0.6), civ(52, C.red, 'frown', { h: 0.86 }), cuffs(52, 84, 0.7), cop(28, 'calm', { h: 0.9 }), reach(28, 0.9, 1, 44, 46), reach(28, 0.9, 1, 44, 66)),
  // gripande: the moment of the arrest – the officer catches up with a running man and takes hold of him (motion lines), handcuffs ready.
  'polis.gripande': all(ground, g('rotate(10 74 112)', civ(74, C.red, 'shock', { h: 0.84 })), speed(96, 70), cop(36, 'angry', { h: 0.86 }), reach(36, 0.86, 1, 62, 48), reach(36, 0.86, 1, 60, 70), cuffs(18, 40, 0.6, -20), sparkle(66, 30, 4, HL)),
  // på bar gärning: a flashlight beam catches a man just as he forces a car door; he freezes with the tool in his hand.
  'polis.på-bar-gärning': all(rect(0, 0, 120, 112, '#3a3f55', 0, null), moon(108, 14, 6), path('M18 60 L96 30 L110 100 Z', 'rgba(255,240,150,0.55)', null), car(80, 108, 1, C.sky), civ(64, C.dark, 'shock', { h: 0.82 }), reach(64, 0.82, 1, 80, 82), crowbar(84, 90, 0.6, 30), cop(12, 'angry', { h: 0.7 }), rect(18, 56, 8, 5, C.dark, 1, C.ink, 1), excl(64, 10, 16, C.yellow)),
  // göra motstånd: the man pulls away from the officer who holds his arm; angry face and tug lines.
  'polis.göra-motstånd': all(ground, cop(34, 'calm', { h: 0.86 }), g('rotate(14 80 112)', civ(80, C.red, 'angry', { h: 0.84 })), reach(34, 0.86, 1, 60, 58), arrow(78, 40, 104, 30, RED, 2.2), path('M56 50 L52 46 M58 64 L54 68', 'none', C.ink, 1.4)),
  // handfängsel: a pair of handcuffs, large and clear.
  'polis.handfängsel': all(cuffs(60, 62, 3, -12)),
  // frihetsberöva: a person behind bars watches a bird fly free outside the window – his freedom is taken; grey: the same person walking freely.
  'polis.frihetsberöva': all(rect(4, 6, 80, 106, '#cfcac0', 2, C.ink, 1.6), bars(18, 20, 40, 34), civ(40, C.orange, 'frown', { h: 0.72 }), bird(100, 28, 1, C.sky), padlock(70, 70, 0.8), greyed(civ(104, C.grey, 'smile', { h: 0.42 }))),
  // anhålla: after the arrest the decision is made – a paper with a padlock is stamped, and the man is led into a cell.
  'polis.anhålla': all(ground, doc(28, 40, 1.6, padlock(0, 4, 0.5)), g('translate(48 26) rotate(-20)', rect(-5, -14, 10, 12, C.brown, 2, C.ink, 1.2), rect(-9, -2, 18, 5, RED, 1, C.ink, 1.2)), bars(70, 30, 44, 82), civ(92, C.red, 'frown', { h: 0.72 }), arrow(46, 80, 66, 80, HL, 2)),
  // anhållande: one official at a desk stamps the decision paper with a padlock – it lasts only three days (three red calendar squares); the arrow leads on to the grey court with its long calendar (that later step is häktning).
  'polis.anhållande': all(ground, table(84, 4, 62), civ(30, C.purple, 'calm', { h: 0.82 }), reach(30, 0.82, 1, 48, 78), doc(50, 72, 0.7, padlock(0, 3, 0.4)), g('translate(46 60) rotate(-15)', rect(-3, -10, 6, 9, C.brown, 1, C.ink, 1), rect(-6, -2, 12, 4, RED, 1, C.ink, 1)), g('translate(8 8)', ...[0, 1, 2].map((i) => rect(i * 14, 0, 12, 12, '#f6b0a0', 1, C.ink, 1)), rect(0, 0, 40, 3, RED, 0, null)), arrow(52, 14, 72, 14, HL, 1.8), greyed(bench(96, 66, 0.6), ...Array.from({ length: 10 }, (_, i) => rect(76 + (i % 5) * 8, 76 + Math.floor(i / 5) * 8, 7, 7, '#f6b0a0', 1, C.ink, 0.6)))),
  // underrätta: an officer on the phone tells a mother at home; she listens with her hand on her heart (shocked).
  'polis.underrätta': all(ground, cop(26, 'calm', { h: 0.82 }), reach(26, 0.82, 1, 36, 32), g('translate(38 32) scale(0.42)', phone(0, 0)), dash('M44 30 C60 14 74 14 86 26', HL, 1.6), line('M60 8 L60 112', C.grey2, 1.2, '4 4'), house(96, 54, 0.3, C.yellow, RED), civ(92, C.purple, 'shock', { hairStyle: 'long', h: 0.72 }), reach(92, 0.72, -1, 82, 34), g('translate(82 36) scale(0.4)', phone(0, 0))),
  // flyktfara: a man in a cell dreams of escaping – his thought cloud holds a suitcase and a plane, a dashed arrow towards an open door.
  'polis.flyktfara': all(rect(4, 6, 112, 106, '#d6d1c6', 2, C.ink, 1.6), bars(78, 14, 30, 24), civ(40, C.red, 'calm', { h: 0.74 }), tb(40, 0.74, 1, 46, (x, y) => all(suitcase(x - 10, y + 2, C.red), plane(x + 10, y - 2, 0.5, -10)), 4, -8, 26), door(96, 112, 18, 40, '#9aa3ad'), dash('M58 96 L86 96', RED, 1.8), arrow(84, 96, 90, 96, RED, 2)),
  // försvåra: a man carrying a box finds his way blocked – another person pushes a boulder and a plank into his path, so the work becomes harder (sweat); grey: the same walk on a clear road.
  'polis.försvåra': all(ground, civ(30, C.orange, 'frown', { h: 0.72 }), reach(30, 0.72, 1, 50, 60), crate(54, 68, 16, 14), path('M18 22 C16 26 20 28 18 32 M44 20 C42 24 46 26 44 30', 'none', C.sky, 1.6), path('M58 112 C56 80 94 76 96 112 Z', '#8a8f98', C.ink, 1.8), path('M66 100 L72 94 M80 92 L86 98', 'none', '#6a6f78', 1.4), civ(104, C.dark, 'angry', { h: 0.62 }), reach(104, 0.62, -1, 94, 94), arrow(100, 74, 88, 84, RED, 2.2), cross(52, 98, 0.7), greyed(g('translate(70 10) scale(0.3)', line('M-40 60 L100 60', C.ink, 3), civ(0, C.grey, 'smile'), arrow(30, 30, 90, 30, C.ink, 4)))),
  // häkta: in court the judges look at the papers and decide that the man shall stay in a cell (paper with bars on it); a guard stands by him.
  'polis.häkta': all(ground, bench(76, 72, 1.2), mini(66, 40, C.dark, 'flat', 1), mini(88, 40, C.dark, 'flat', 1, true), doc(76, 60, 0.8, bars(-6, -2, 12, 10)), civ(20, C.red, 'frown', { h: 0.7 }), cuffs(20, 82, 0.5), cop(40, 'calm', { h: 0.74 })),
  // häkte: a big grey building with a high wall and small barred windows.
  'polis.häkte': all(ground, rect(20, 22, 80, 90, '#b7b3ab', 1, C.ink, 1.8), ...[34, 52, 70, 88].flatMap((x) => [bars(x - 5, 32, 10, 12), bars(x - 5, 58, 10, 12)]), rect(4, 80, 112, 32, '#8f8a82', 1, C.ink, 1.6), line('M4 80 L116 80', C.ink, 2), door(60, 112, 18, 24, '#5b5f6a'), path('M4 78 L116 78', 'none', C.ink, 1, ), ...Array.from({ length: 10 }, (_, i) => path(`M${8 + i * 11} 80 l3 -5 l3 5`, 'none', C.ink, 1))),
  // på fri fot: the barred door stands open and the man walks out smiling into the sunshine.
  'polis.på-fri-fot': all(ground, rect(4, 20, 40, 92, '#b7b3ab', 1, C.ink, 1.6), rect(10, 40, 28, 72, '#5b5f6a', 1, C.ink, 1.4), g('translate(38 40) skewY(10)', bars(0, 0, 18, 72)), civ(76, C.orange, 'laugh', { h: 0.84 }), sun(104, 20, 7), arrow(90, 96, 110, 96, C.green, 2.2), bird(104, 46, 0.7)),

  // ── Husrannsakan och beslag ──────────────────────────────────────
  // tvångsmedel: a set of measures the police may use against a person's will – handcuffs, a house with a magnifying glass, a sealed bag and a cell, framed together; grey: a free choice (a person with an open hand).
  'polis.tvångsmedel': all(rect(10, 10, 100, 80, '#fff8e6', 6, HL, 2), cuffs(34, 32, 0.9), g('translate(86 38)', house(0, 0, 0.36, C.beige, C.brown), mag(10, -8, 0.7)), ebag(34, 66, 0.9, tagL(0, 4, 1)), bars(72, 52, 28, 28)),
  // ingrepp: a big hand reaches in through the roof of a home where a family sits; they are upset.
  'polis.ingrepp': all(ground, rect(16, 50, 88, 62, '#f2dfb8', 1, C.ink, 1.8), path('M10 52 L60 20 L110 52 Z', '#c0583f', C.ink, 1.8), path('M54 0 L54 24 L50 46 L58 50 L64 46 L66 24 L66 0 Z', C.skin, C.ink, 1.6), mini(36, 92, C.orange, 'frown', 1.1, true), mini(84, 92, C.sky, 'frown', 1.1), excl(60, 78, 14, RED)),
  // husrannsakan: officers search a flat – drawers pulled out, a box opened, things on the floor, one officer looks into a cupboard with a torch.
  'polis.husrannsakan': all(rect(4, 6, 112, 106, '#efe7da', 2, null), rect(4, 90, 112, 22, '#d8c4a4', 0, null), rect(70, 40, 40, 50, C.brown, 2, C.ink, 1.6), rect(74, 46, 32, 10, '#c28a5a', 1, C.ink, 1), rect(80, 58, 36, 10, '#c28a5a', 1, C.ink, 1), rect(74, 74, 32, 10, '#c28a5a', 1, C.ink, 1), cop(40, 'calm', { h: 0.82 }), reach(40, 0.82, 1, 66, 64), rect(64, 60, 8, 4, C.dark, 1, C.ink, 1), path('M72 62 L86 56 L86 70 Z', 'rgba(255,240,150,0.6)', null), crate(18, 108, 22, 14), path('M30 104 L36 100 L42 106 Z', C.sky, C.ink, 1), rect(46, 104, 14, 4, C.white, 1, C.ink, 0.8)),
  // genomsöka: an officer with a torch sweeps every corner of a room; dashed lines cover the whole floor plan.
  'polis.genomsöka': all(rect(10, 10, 100, 90, '#f6efe2', 2, C.ink, 1.8), ...[30, 50, 70, 90].map((y) => dash(`M14 ${y - 10} L106 ${y - 10}`, HL, 1.2, '3 3')), ...[20, 40, 60, 80, 100].map((x) => dash(`M${x} 14 L${x} 96`, HL, 1.2, '3 3')), cop(60, 'calm', { h: 0.7 }), path('M74 58 L106 36 L106 72 Z', 'rgba(255,240,150,0.55)', null), rect(68, 56, 8, 4, C.dark, 1, C.ink, 1), reach(60, 0.7, 1, 70, 58), check(22, 22, 0.8), check(98, 88, 0.8)),
  // bryta upp: a crowbar forces a locked door open; splinters fly from the frame.
  'polis.bryta-upp.2': all(ground, rect(30, 14, 60, 98, C.brown, 2, C.ink, 1.8), rect(34, 18, 50, 94, '#c28a5a', 1, C.ink, 1.4), g('rotate(-6 84 60)', rect(80, 52, 6, 16, C.gold, 1, C.ink, 1)), crowbar(96, 96, 1.2, -20), path('M86 50 L94 44 M88 62 L98 62 M86 72 L94 78', 'none', C.ink, 1.6), cop(108, 'angry', { h: 0.5 })),
  // polishund: a police dog with a small blue vest sits beside its officer, who holds the lead.
  'polis.polishund': all(ground, cop(34, 'smile', { h: 0.9 }), reach(34, 0.9, 1, 54, 70), line('M54 70 C66 74 70 80 70 84', C.ink, 1.4), kdog(84, 112, 1.3)),
  // kroppsvisitation: an officer pats down a man's jacket with both hands; his open bag lies checked on the table.
  'polis.kroppsvisitation': all(ground, civ(62, C.green, 'calm', { h: 0.88 }), reach(62, 0.88, -1, 46, 36), reach(62, 0.88, 1, 78, 36), cop(28, 'calm', { h: 0.84 }), reach(28, 0.84, 1, 54, 52), reach(28, 0.84, 1, 56, 76), table(92, 86, 116), path('M90 82 L114 82 L112 92 L92 92 Z', C.red, C.ink, 1.2), path('M94 82 L98 74 L108 74 L110 82', 'none', C.ink, 1.2)),
  // kroppsbesiktning: a nurse takes a blood sample from the arm of a man while an officer watches.
  'polis.kroppsbesiktning': all(table(84, 50, 116), civ(76, C.green, 'calm', { h: 0.84 }), reach(76, 0.84, -1, 56, 74), civ(30, C.white, 'calm', { hairStyle: 'long', h: 0.84 }), reach(30, 0.84, 1, 52, 70), rect(50, 66, 3, 10, '#b02020', 1, C.ink, 0.8), line('M53 70 L58 72', C.silver, 1.2), greyed(cop(104, 'calm', { h: 0.6 }))),
  // beslag: seized things on a table, each with a yellow evidence tag: laptops, phones, a bag.
  'polis.beslag': all(table(78, 4, 116), laptop(26, 76, 1.2), tagL(40, 66, 1.2), g('translate(56 70) scale(0.5)', phone(0, 0)), tagL(64, 64, 1.2), laptop(92, 76, 1.2), tagL(106, 66, 1.2), ebag(44, 48, 1, all(g('translate(0 2) scale(0.3)', phone(0, 0)))), clip(90, 36, 1)),
  // ta i beslag: the officer carries the man's laptop away into an evidence bag; the man raises his hands in protest.
  'polis.ta-i-beslag': all(ground, civ(26, C.green, 'angry', { h: 0.82 }), reach(26, 0.82, 1, 42, 36), palm(44, 30, 1), cop(80, 'calm', { h: 0.86 }), reach(80, 0.86, -1, 60, 66), ebag(58, 70, 1.4, laptop(0, 6, 0.6)), arrow(70, 90, 94, 90, HL, 2)),
  // fynd (something found): in a garage the torch lights up a box of jewels – sparkle – while the officer looks surprised.
  'polis.fynd.2': all(rect(4, 6, 112, 106, '#cfcac0', 2, null), cop(30, 'shock', { h: 0.82 }), reach(30, 0.82, 1, 48, 62), rect(46, 60, 8, 4, C.dark, 1, C.ink, 1), path('M54 62 L100 74 L100 100 Z', 'rgba(255,240,150,0.6)', null), crate(92, 108, 30, 18), jewels(92, 88, 1.2), sparkle(80, 70, 5), sparkle(106, 72, 4)),
  // stöldgods: a hidden pile in a garage of bikes, phones, a tv and bags, all with tags – things taken from others.
  'polis.stöldgods': all(rect(4, 6, 112, 106, '#cfcac0', 2, null), g('translate(32 104)', circle(-12, 0, 9, 'none', C.ink, 2), circle(12, 0, 9, 'none', C.ink, 2), path('M-12 0 L-4 -12 L8 -12 L12 0 M-4 -12 L0 0', 'none', RED, 2)), tagL(32, 82, 1.2), rect(62, 66, 30, 22, C.dark, 2, C.ink, 1.4), rect(65, 69, 24, 16, '#9fd0f0', 1, null), tagL(92, 64, 1.2), crate(82, 112, 30, 22), g('translate(66 96) scale(0.4)', phone(0, 0)), path('M96 92 L110 92 L112 108 L94 108 Z', C.purple, C.ink, 1.2), tagL(106, 88, 1.2), greyed(shadow(18, { h: 0.5 }))),

  // ── Förundersökningens gång ──────────────────────────────────────
  // förundersökning: the case folder is open – photos, a fingerprint, a map and an interview record, all collected in one investigation.
  'polis.förundersökning': all(path('M8 30 L50 30 L56 36 L112 36 L112 104 L8 104 Z', '#e8c46a', C.ink, 1.8), rect(16, 42, 28, 22, C.white, 1, C.ink, 1.2), g('translate(30 60) scale(0.4)', mini(0, -10, C.red, 'flat', 1.6)), rect(50, 42, 26, 24, C.white, 1, C.ink, 1.2), fprint(63, 54, 0.6), rect(82, 42, 24, 24, '#dfeccf', 1, C.ink, 1.2), path('M86 58 C92 48 98 60 104 46', 'none', RED, 1.4), circle(98, 54, 2, RED, null), doc(30, 84, 0.9), clip(64, 86, 0.8), shoe(94, 86, 0.8, 20)),
  // inleda: a new investigation begins – the folder opens and a path of steps starts at a green start flag.
  'polis.inleda': all(ground, g('translate(30 62)', path('M-20 -14 L-8 -14 L-4 -10 L20 -10 L20 16 L-20 16 Z', '#e8c46a', C.ink, 1.6), path('M-20 -10 L20 -10 L26 -22 L-14 -22 Z', '#f2d98a', C.ink, 1.4)), line('M56 104 L56 60', C.ink, 2), path('M56 60 L76 66 L56 72 Z', C.green, C.ink, 1.2), dash('M56 104 L112 104', HL, 2.4, '6 4'), ...[72, 88, 104].map((x) => circle(x, 104, 3, C.white, C.ink, 1.2)), arrow(66, 86, 100, 86, C.green, 2.4), greyed(g('translate(100 40) scale(0.5)', path('M-20 -14 L-8 -14 L-4 -10 L20 -10 L20 16 L-20 16 Z', '#e8c46a', C.ink, 2)))),
  // förundersökningsledare: at the head of the table one person (in a ring of light) leads the case meeting and assigns tasks to officers.
  'polis.förundersökningsledare': all(circle(60, 40, 26, '#fff5d6', HL, 2), civ(60, C.purple, 'calm', { hairStyle: 'long', h: 0.62 }), reach(60, 0.62, 1, 80, 48), folder(84, 46, 0.6), table(86, 4, 116), mini(18, 82, C.navy, 'flat', 0.9), mini(36, 82, C.navy, 'flat', 0.9, true), mini(84, 82, C.navy, 'flat', 0.9), mini(102, 82, C.navy, 'flat', 0.9), arrow(48, 52, 34, 66, HL, 1.6), arrow(72, 58, 88, 66, HL, 1.6)),
  // utredning (police): an officer studies a wall board where photos, a map and a fingerprint are linked with red threads.
  'polis.utredning.3': all(rect(30, 8, 84, 64, '#c9a87a', 2, C.ink, 1.8), rect(36, 14, 18, 14, C.white, 1, C.ink, 1), g('translate(45 26) scale(0.3)', mini(0, -10, C.red, 'flat', 1.6)), rect(86, 14, 22, 16, '#dfeccf', 1, C.ink, 1), rect(40, 46, 18, 18, C.white, 1, C.ink, 1), fprint(49, 55, 0.4), rect(80, 44, 22, 20, C.white, 1, C.ink, 1), car(91, 58, 0.3, C.sky), line('M45 21 L97 22 M45 21 L49 55 M97 22 L91 54 M49 55 L91 54', RED, 1.2), cop(16, 'calm', { h: 0.86 }), reach(16, 0.86, 1, 36, 50)),
  // utreda: step by step along a path of clues – the magnifying glass moves from a footprint to a fingerprint to a face; each step ticked.
  'polis.utreda': all(dash('M10 96 C30 60 50 100 70 70 C86 50 96 60 110 30', HL, 2, '5 4'), shoe(16, 96, 0.8, 30), check(16, 80, 0.6), fprint(46, 82, 0.5), check(46, 66, 0.6), mini(84, 58, C.red, 'flat', 0.9), mag(104, 30, 1.4, qm(0, 0, 0.7)), greyed(qm(108, 100, 1))),
  // skyndsam: the officer runs with the case folder while a clock's hand sweeps fast; grey: a snail with a folder.
  'polis.skyndsam': all(ground, g('rotate(8 50 112)', cop(50, 'calm', { h: 0.82 })), speed(36, 66), folder(68, 66, 0.5), clock(92, 26, 12, 3, 0, { shade: [0, 15] }), arrow(104, 14, 110, 24, HL, 1.8), greyed(snail(100, 108, 0.8))),
  // tala för: a footprint and a bag point (green arrows) at the man – the clues support that he did it; thumbs up.
  'polis.tala-för': all(ground, mini(90, 90, C.red, 'flat', 1.5), shoe(24, 40, 1.2, 10), path('M14 76 L32 76 L34 92 L12 92 Z', C.red, C.ink, 1.2), arrow(36, 42, 70, 70, C.green, 2.6), arrow(38, 84, 70, 86, C.green, 2.6), thumb(96, 48, 1.4), greyed(arrow(30, 108, 50, 108, RED, 1.6))),
  // tala emot: the man's clock and the place far away block the suspicion – a red arrow is stopped by the alibi (clock with tick); thumbs down on the suspicion.
  'polis.tala-emot': all(ground, mini(90, 90, C.red, 'flat', 1.5), shoe(24, 40, 1.2, 10), arrow(36, 44, 56, 60, RED, 2.6), rect(58, 40, 6, 44, C.grey, 1, C.ink, 1.2), clock(28, 86, 10, 10, 0), check(46, 74, 0.8), arrow(42, 90, 70, 90, C.green, 2.2), thumb(96, 46, 1.4, true), greyed(arrow(30, 108, 50, 108, C.green, 1.6))),
  // protokoll (police record): an interview record on a clipboard – lines of text, a signature and the gold-star stamp – with the recorder beside it.
  'polis.protokoll.2': all(clip(52, 60, 3, all(path('M-6 8 C-4 6 -2 10 0 8 C2 6 4 9 6 7', 'none', C.navy, 0.6), star(7, -9, 1.6, C.gold))), recorder(104, 100), cop(104, 'calm', { h: 0.5 })),
  // ta del av: the suspect sits and reads through a thick folder of the investigation; his eyes follow the lines.
  'polis.ta-del-av': all(table(84, 4, 116), civ(40, C.red, 'calm', { h: 0.86 }), reach(40, 0.86, 1, 54, 78), reach(40, 0.86, 1, 70, 78), rect(50, 70, 40, 14, C.white, 1, C.ink, 1.4), rect(50, 72, 40, 6, '#e8c46a', 1, C.ink, 1), line('M58 76 L82 76', C.grey, 1), dash('M44 26 L70 70', HL, 1.2), crate(100, 84, 22, 18)),
  // delge: an officer formally hands a paper to a man, who signs that he has received it.
  'polis.delge': all(ground, cop(30, 'calm', { h: 0.86 }), reach(30, 0.86, 1, 54, 60), doc(60, 56, 0.9, path('M-6 8 C-4 6 -2 10 0 8 C2 6 4 9 6 7', 'none', C.navy, 1)), civ(90, C.green, 'calm', { h: 0.86 }), reach(90, 0.86, -1, 68, 62), line('M68 62 L64 70', C.ink, 1.6), arrow(42, 40, 70, 40, HL, 1.8)),
  // underlag: a stack of papers (reports, prints, photos) forms the base on which a decision box with a tick rests; grey: the same box with no stack under it, falling.
  'polis.underlag': all(ground, ...[0, 1, 2, 3, 4].map((i) => rect(28 + (i % 2) * 2, 98 - i * 9, 52, 9, [C.white, '#f2e6c8', '#e8f2f8', C.white, '#f6e7a8'][i]!, 1, C.ink, 1.2)), fprint(46, 76, 0.3), rect(36, 34, 36, 26, C.green, 3, C.ink, 1.6), check(54, 47, 1.6, C.white), greyed(rect(92, 30, 20, 14, C.grey, 2, C.ink, 1.2), arrow(102, 50, 102, 68, C.ink, 1.6))),
  // lägga ner: the case folder is closed, crossed out and put away into a box; the work stops.
  'polis.lägga-ner': all(ground, crate(78, 112, 54, 34), g('translate(46 40) rotate(-20)', path('M-20 -14 L-8 -14 L-4 -10 L20 -10 L20 16 L-20 16 Z', '#e8c46a', C.ink, 1.6)), noB(32, 18, 9), arrow(58, 50, 74, 70, HL, 2), greyed(clock(104, 20, 8, 5, 0))),
  // klara upp (solve): the last puzzle piece falls into place and completes the picture of a face; a green tick.
  'polis.klara-upp.2': all(rect(12, 20, 72, 72, C.white, 2, C.ink, 1.6), piece(30, 38, 2, C.sky), piece(64, 38, 2, C.mint), piece(30, 74, 2, C.lilac), g('translate(66 78) scale(1)', mini(0, 0, C.red, 'flat', 1.4)), piece(100, 96, 2, C.yellow), arrow(96, 82, 80, 76, HL, 2), check(100, 26, 1.8)),
  // ouppklarad: an old case folder with a big question mark, a cobweb and dust lies in an archive box; the years pass.
  'polis.ouppklarad': all(ground, crate(60, 112, 70, 38), g('translate(60 58)', path('M-26 -18 L-12 -18 L-8 -14 L26 -14 L26 18 L-26 18 Z', '#d8c08a', C.ink, 1.6), qm(0, 0, 2.2, RED)), path('M86 40 L104 22 M86 40 L108 40 M86 40 L100 56 M92 34 C96 38 96 42 92 46 M98 28 C104 36 104 44 98 50', 'none', C.grey, 1), cal(6, 12, 30, 3), greyed(check(104, 90, 1))),
};
