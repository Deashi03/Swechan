/**
 * Samhälle & institutioner → Utbildning & lärande → Utbildningssystem i världen, 1651–1657 (0.33): school
 * start and compulsory schooling, curricula and subjects, tests and examinations, vocational training,
 * scholarships and exchanges, comparing education systems, and studying abroad. Most words compare
 * countries, so the pictures reuse the school signs of Svensk skola (ochre school building, green board,
 * report cards, a university with columns) and add national flags as neutral place markers, planes and
 * suitcases (going abroad), certificates with seals, simple bar charts and a podium (comparisons). Digits,
 * grade letters and a few foreign characters only; no words in the pictures and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, star, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm } from './people';
import { P as F, type Mood, greyed } from './blindFix';
import { checkIcon, heartIcon } from './labelIcons';

// ── Geometry and figures ─────────────────────────────────────────────
const RED = '#e8302c';
const TEACH = '#4f9d69';
const f1 = (n: number) => n.toFixed(1);
const ground = line('M4 112 L116 112', C.grey2, 2);
/** Head and shoulder positions of a standing figure (figures.ts) at x with height factor h. */
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, hy: ty - 56 * s, hr: 10 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const hnd = (x: number, y: number, r = 3) => circle(x, y, r, C.skin, C.ink, 1.2);
/** An arm that starts at the shoulder (side −1 = picture-left, 1 = picture-right) and ends in a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q0 = geo(x, h); return all(arm(side < 0 ? q0.sl : q0.sr, q0.sy, tx, ty), hnd(tx, ty, 3 * Math.max(0.6, h))); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** A child (small standing figure). */
const kid = (x: number, top: string = C.orange, mood: Mood = 'smile', h = 0.55, more: Partial<Build> = {}) => fig(x, top, mood, { h, ...more });
/** A teacher: adult in green holding a book against the chest. */
const teacher = (x: number, h = 0.9, mood: Mood = 'smile', more: Partial<Build> = {}) => { const k = geo(x, h); return all(fig(x, TEACH, mood, { h, hairStyle: 'long', ...more }), g(`translate(${f1(x + 7 * h)} ${f1(k.sy + 14 * h)}) scale(${h})`, rect(-6, -8, 12, 16, C.navy, 1.5, C.ink, 1.2), line('M-3 -8 L-3 8', C.white, 0.8))); };
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; torso −42…2; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
const vestL = (col: string = C.reflex) => all(path('M-13.5 -41 L-6 -41 L0 -28 L6 -41 L13.5 -41 L12 1 L-12 1 Z', col, C.ink, 1.4), line('M-12.6 -14 L-3 -14 M3 -14 L12.6 -14', C.silver, 2.4));
const tieL = all(path('M-6 -42 L0 -34 L6 -42', 'none', C.white, 2.4), path('M-1.8 -38 L1.8 -38 L3 -24 L0 -20 L-3 -24 Z', RED, C.ink, 0.9));
/** Head-and-shoulders person (seated behind a desk or table). */
const mini = (x: number, y: number, col: string, mood: 'smile' | 'frown' | 'flat' | 'open' = 'smile', s = 1, grey = false, long = false) => {
  const sk = grey ? C.grey2 : C.skin, hr = grey ? C.grey : C.hair, c = grey ? C.grey : col;
  return g(`translate(${x} ${y}) scale(${s})`, long ? path('M-8 -6 C-9 4 -6 6 0 6 C6 6 9 4 8 -6 Z', hr, null) : '', path('M-10 16 C-10 4 10 4 10 16 Z', c, C.ink, 1.4), circle(0, -6, 7.5, sk, C.ink, 1.4), path('M-7.5 -8 C-7.5 -16 7.5 -16 7.5 -8 C4 -11 -4 -11 -7.5 -8 Z', hr, null),
    all(circle(-2.6, -6, 1, C.ink, null), circle(2.6, -6, 1, C.ink, null)),
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
/** Bubble beside the head of the figure at x (side 1 = right of the head, −1 = left); f draws at the bubble centre. */
const sb = (x: number, h: number, side: 1 | -1, w: number, hh: number, f: (cx: number, cy: number) => Svg, dy = 0, fill: string = C.white) => { const k = geo(x, h), cx = x + side * (k.hr + 6 + w / 2), cy = k.hy - 8 + dy; return say(cx, cy, w, hh, x + side * (k.hr + 1), k.hy, f(cx, cy), fill); };
/** Thought bubble beside the head of the figure at x. */
const think = (x: number, h: number, side: 1 | -1, w: number, hh: number, inner: (cx: number, cy: number) => Svg, dy = 0) => {
  const k = geo(x, h), cx = x + side * (k.hr + 8 + w / 2), cy = k.hy - 10 + dy;
  return all(ellipse(cx, cy, w / 2, hh / 2, C.white, C.ink, 1.5), circle(x + side * (k.hr + 3), k.hy - 2, 1.8, C.white, C.ink, 1), circle(x + side * (k.hr + 6), k.hy - 6, 2.6, C.white, C.ink, 1.1), inner(cx, cy));
};

// ── Marks ────────────────────────────────────────────────────────────
const q = (x: number, y: number, sz = 13, col: string = C.navy) => T(x, y + sz * 0.36, '?', sz, col);
const num = (x: number, y: number, s: string, sz = 10, col: string = C.ink) => T(x, y + sz * 0.36, s, sz, col);
const para = (x: number, y: number, sz = 14, col: string = C.navy) => T(x, y + sz * 0.36, '§', sz, col);
const cross = (x: number, y: number, s = 1, col: string = RED) => line(`M${x - 5 * s} ${y - 5 * s} L${x + 5 * s} ${y + 5 * s} M${x + 5 * s} ${y - 5 * s} L${x - 5 * s} ${y + 5 * s}`, col, 2.4 * s);
const check = (x: number, y: number, s = 1, col: string = C.green) => checkIcon(x, y, s, col);
const okB = (x: number, y: number, r = 8) => all(circle(x, y, r, C.green, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, r * 0.22));
const noB = (x: number, y: number, r = 8) => all(circle(x, y, r, RED, C.ink, 1.2), line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, C.white, r * 0.22));
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const plusB = (x: number, y: number, r = 8, col: string = C.green) => all(circle(x, y, r, col, C.ink, 1.2), line(`M${f1(x - r * 0.5)} ${y} L${f1(x + r * 0.5)} ${y} M${x} ${f1(y - r * 0.5)} L${x} ${f1(y + r * 0.5)}`, C.white, r * 0.28));
const curveArrow = (d: string, ex2: number, ey: number, ang: number, col: string = HL, w = 2) => all(line(d, col, w), g(`translate(${ex2} ${ey}) rotate(${ang})`, path('M0 0 L-6 -3.4 L-6 3.4 Z', col, null)));
const thumb = (x: number, y: number, s = 1, up = true, col: string = C.skin) => g(`translate(${x} ${y}) scale(${s}${up ? '' : ' -1'})`, rect(-6, -2, 11, 11, col, 3, C.ink, 1.2), path('M-4 -2 L-3 -10 C-3 -13 1 -13 1 -10 L1 -2 Z', col, C.ink, 1.2), line('M-1 3 L5 3 M-1 6 L5 6', C.ink, 0.7));
/** A grade letter in a rounded square. */
const grade = (x: number, y: number, l: string, col: string = C.white, s = 1, txt: string = C.ink) => g(`translate(${x} ${y}) scale(${s})`, rect(-6, -6, 12, 12, col, 2, C.ink, 1.1), T(0, 3.6, l, 10, txt));
const GCOL: Record<string, string> = { A: '#4caf6a', B: '#8cc56a', C: '#c9d85a', D: '#f2c14e', E: '#f29a4e', F: RED };

// ── Things ───────────────────────────────────────────────────────────
/** A sheet of paper; `marks` in the sheet's own coordinates (−14…14, −18…18). */
const doc = (x: number, y: number, s = 1, marks: Svg = '', n = 5, col: string = C.grey2, fill: string = C.white) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -18, 28, 36, fill, 2, C.ink, 1.6), ...Array.from({ length: n }, (_, i) => line(`M-9 ${-11 + i * 6} L9 ${-11 + i * 6}`, col, 2)), marks);
/** A report card: rows of a subject dot and a grade letter. */
const report = (x: number, y: number, s = 1, gs: string[] = ['A', 'C', 'B'], head: string = C.navy) => g(`translate(${x} ${y}) scale(${s})`, rect(-15, -20, 30, 40, C.white, 2, C.ink, 1.6), rect(-15, -20, 30, 7, head, 2, C.ink, 1.4), ...gs.map((l, i) => all(circle(-8, -6 + i * 10, 2.6, ['#5aa7e8', '#e85a5a', '#7ac06a', '#c8a8d8', '#f2c14e'][i % 5]!, C.ink, 0.8), line(`M-4 ${-6 + i * 10} L1 ${-6 + i * 10}`, C.grey2, 1.6), grade(8, -6 + i * 10, l, GCOL[l] ?? C.white, 0.72))));
/** A test paper: questions with boxes; `marks` per row: 'ok' | 'no' | ''. */
const test = (x: number, y: number, s = 1, marks: string[] = ['', '', ''], extra: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -18, 28, 36, C.white, 2, C.ink, 1.6), ...marks.map((m, i) => all(num(-9, -9 + i * 10, `${i + 1}`, 6), line(`M-5 ${-9 + i * 10} L5 ${-9 + i * 10}`, C.grey2, 1.8), m === 'ok' ? check(9, -9 + i * 10, 0.55) : m === 'no' ? cross(9, -9 + i * 10, 0.5) : rect(6.5, -11.5 + i * 10, 5, 5, 'none', 0.5, C.ink, 0.8))), extra);
const clip = (x: number, y: number, s = 1, marks: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-12, -16, 24, 32, C.brown, 2, C.ink, 1.4), rect(-10, -13, 20, 27, C.white, 1, null), rect(-5, -18, 10, 5, C.silver, 1.5, C.ink, 1), marks);
const pencil = (x: number, y: number, rot = 0, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-2, -14, 4, 20, C.yellow, 0.5, C.ink, 1), path('M-2 6 L0 11 L2 6 Z', C.tan, C.ink, 0.8), rect(-2, -16, 4, 3, C.pink, 0.5, C.ink, 0.8));
const book = (x: number, y: number, s = 1, col: string = C.navy, mark: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-10, -13, 20, 26, col, 2, C.ink, 1.4), rect(-10, -13, 4, 26, 'rgba(0,0,0,0.2)', 1, null), mark);
const openBook = (x: number, y: number, s = 1, col: string = C.white) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -6 C-5 -9 -12 -9 -16 -7 L-16 7 C-12 5 -5 5 0 8 C5 5 12 5 16 7 L16 -7 C12 -9 5 -9 0 -6 Z', col, C.ink, 1.4), line('M0 -6 L0 8', C.ink, 1), line('M-12 -3 L-4 -2 M-12 1 L-4 2 M4 -2 L12 -3 M4 2 L12 1', C.grey2, 1.2));
const toolbox = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -6, 28, 14, RED, 2, C.ink, 1.4), path('M-6 -6 L-6 -11 L6 -11 L6 -6', 'none', C.ink, 1.8), line('M-14 -1 L14 -1', C.ink, 1), line('M-10 -6 L-4 -15 M2 -6 L10 -14', C.silver, 2.4));
const wrench = (x: number, y: number, rot = 0, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-1.8, -4, 3.6, 18, C.silver, 1, C.ink, 1), path('M-5 -10 C-5 -14 5 -14 5 -10 L5 -5 L2 -5 L2 -10 L-2 -10 L-2 -5 L-5 -5 Z', C.silver, C.ink, 1));
const flask = (x: number, y: number, s = 1, col: string = '#7ac06a') => g(`translate(${x} ${y}) scale(${s})`, path('M-3 -12 L3 -12 L3 -4 L10 9 C11 12 9 13 7 13 L-7 13 C-9 13 -11 12 -10 9 L-3 -4 Z', 'rgba(220,240,252,0.8)', C.ink, 1.3), path('M-6.5 4 L6.5 4 L10 9 C11 12 9 13 7 13 L-7 13 C-9 13 -11 12 -10 9 Z', col, null), rect(-4, -14, 8, 3, C.grey2, 1, C.ink, 1));
const globe = (x: number, y: number, r = 9) => all(circle(x, y, r, '#8cc7e8', C.ink, 1.3), path(`M${x - r * 0.6} ${y - r * 0.4} C${x - r * 0.2} ${y - r * 0.7} ${x + r * 0.1} ${y - r * 0.2} ${x - r * 0.2} ${y + r * 0.2} C${x - r * 0.5} ${y + r * 0.5} ${x - r * 0.8} ${y + r * 0.1} ${x - r * 0.6} ${y - r * 0.4} Z M${x + r * 0.2} ${y + r * 0.3} C${x + r * 0.6} ${y} ${x + r * 0.8} ${y + r * 0.4} ${x + r * 0.5} ${y + r * 0.7} C${x + r * 0.3} ${y + r * 0.8} ${x + r * 0.1} ${y + r * 0.6} ${x + r * 0.2} ${y + r * 0.3} Z`, C.green, null), line(`M${x} ${y - r - 2} L${x} ${y - r}`, C.ink, 1.2), path(`M${x - r - 2} ${y + r + 3} L${x + r + 2} ${y + r + 3}`, 'none', C.brown, 2.4));
const hammer = (x: number, y: number, rot = 0, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-1.6, -4, 3.2, 18, C.brown, 1, C.ink, 1), rect(-7, -9, 14, 6, C.grey, 1, C.ink, 1.1));
const palette = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -9 C8 -9 12 -3 10 3 C9 6 5 5 4 8 C3 11 -2 11 -6 8 C-12 4 -11 -9 0 -9 Z', C.beige, C.ink, 1.2), circle(-4, -4, 1.8, RED, null), circle(1, -6, 1.8, C.yellow, null), circle(6, -3, 1.8, '#5aa7e8', null), circle(-5, 2, 1.8, C.green, null));
const noteM = (x: number, y: number, s = 1, col: string = C.navy) => g(`translate(${x} ${y}) scale(${s})`, path('M0 6 L0 -10 L8 -12 L8 4', 'none', col, 2), ellipse(-2.5, 6, 3.4, 2.6, col, null), ellipse(5.5, 4, 3.4, 2.6, col, null));
const heartS = (x: number, y: number, s = 1, col: string = RED) => heartIcon(x, y, s, col);
const mag = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 8, 'rgba(220,240,252,0.7)', C.ink, 2), line('M5.6 5.6 L12 12', C.ink, 3));
const padlock = (x: number, y: number, s = 1, col: string = C.gold) => g(`translate(${x} ${y}) scale(${s})`, path('M-6 -4 L-6 -10 C-6 -18 6 -18 6 -10 L6 -4', 'none', C.ink, 2.4), rect(-9, -4, 18, 14, col, 2, C.ink, 1.5), circle(0, 3, 2, C.ink, null));
const envelope = (x: number, y: number, s = 1, inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -9, 28, 18, C.white, 2, C.ink, 1.5), path('M-14 -9 L0 2 L14 -9', 'none', C.ink, 1.3), inner);
const cup = (x: number, y: number, col: string = C.white) => g(`translate(${x} ${y})`, path('M-5 -5 L5 -5 L4 5 C4 7 -4 7 -4 5 Z', col, C.ink, 1.2), path('M5 -2 C9 -2 9 3 4 3', 'none', C.ink, 1.2), line('M-2 -8 C-3 -10 -1 -11 -2 -13 M2 -8 C1 -10 3 -11 2 -13', C.grey2, 1));
const ball = (x: number, y: number, r = 5) => all(circle(x, y, r, C.white, C.ink, 1.3), path(`M${x - r * 0.4} ${y - r * 0.3} L${x} ${y - r * 0.6} L${x + r * 0.4} ${y - r * 0.3} L${x + r * 0.25} ${y + r * 0.2} L${x - r * 0.25} ${y + r * 0.2} Z`, C.dark, null));
const leaf = (x: number, y: number, s = 1, col: string = C.orange) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -8 C6 -4 6 4 0 8 C-6 4 -6 -4 0 -8 Z', col, C.ink, 1), line('M0 -6 L0 10', C.brown, 1));
const flower = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L0 10', C.green, 2), ...[0, 72, 144, 216, 288].map((a) => circle(+f1(Math.sin((a * Math.PI) / 180) * 4), +f1(-Math.cos((a * Math.PI) / 180) * 4), 3, C.pink, C.ink, 0.8)), circle(0, 0, 2.4, C.yellow, null));
const coin = (x: number, y: number, r = 5) => all(circle(x, y, r, C.gold, C.ink, 1.2), circle(x, y, r * 0.55, 'none', '#b88a20', 1));
const desk = (x: number, y: number, w = 22, col: string = C.tan) => all(rect(x - w / 2, y, w, 4, col, 1.5, C.ink, 1.3), line(`M${x - w / 2 + 3} ${y + 4} L${x - w / 2 + 3} ${y + 16} M${x + w / 2 - 3} ${y + 4} L${x + w / 2 - 3} ${y + 16}`, C.brown, 2));
const table = (y: number, x1: number, x2: number) => all(rect(x1, y, x2 - x1, 5, C.tan, 2, C.ink, 1.6), line(`M${x1 + 6} ${y + 5} L${x1 + 6} 112 M${x2 - 6} ${y + 5} L${x2 - 6} 112`, C.brown, 2.6));
/** A child seated at a school desk (head and shoulders above the desk top at y). */
const pupil = (x: number, y: number, col: string, mood: 'smile' | 'frown' | 'flat' | 'open' = 'smile', s = 0.8, long = false, grey = false) => all(mini(x, y - 10 * s, col, mood, s, grey, long), desk(x, y + 2 * s, 24 * s));
/** The green school board. */
const board = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x - 2, y - 2, w + 4, h + 4, C.brown, 2, C.ink, 1.4), rect(x, y, w, h, '#2f6b4f', 1, null), inner);
/** Chalk marks on the board. */
const chalk = (d: string, sw = 1.6) => line(d, '#eef3e6', sw);
/** The school: an ochre two-storey building with a red roof and a clock in the gable; (x, y) = bottom centre. */
const school = (x: number, y: number, s = 1, wall = '#e9b75a', grey = false) => {
  const w = grey ? '#c9ced4' : wall, roof = grey ? '#9aa3ad' : RED, win = grey ? '#e3e6ea' : '#9ad0f0';
  return g(`translate(${x} ${y}) scale(${s})`, rect(-30, -34, 60, 34, w, 1, C.ink, 1.5), path('M-34 -34 L0 -50 L34 -34 Z', roof, C.ink, 1.5), circle(0, -40, 4.2, C.white, C.ink, 1), line('M0 -40 L0 -43 M0 -40 L2.4 -39', C.ink, 0.9),
    ...[-22, -12, 8, 18].flatMap((cx) => [rect(cx - 3.5, -29, 7, 8, win, 0.8, C.ink, 0.8), rect(cx - 3.5, -16, 7, 8, win, 0.8, C.ink, 0.8)]), rect(-5, -15, 10, 15, grey ? '#9aa3ad' : C.brown, 1, C.ink, 1.1));
};
/** The upper-secondary school: a larger, modern block (brick) with glass. */
const gym = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-34, -40, 68, 40, '#c8735a', 1, C.ink, 1.5), rect(-34, -44, 68, 5, '#8a4a3a', 1, C.ink, 1.3), ...[-26, -16, -6, 10, 20].flatMap((cx) => [rect(cx - 3.5, -35, 7, 9, '#bfe3f5', 0.8, C.ink, 0.8), rect(cx - 3.5, -22, 7, 9, '#bfe3f5', 0.8, C.ink, 0.8)]), rect(-1, -18, 8, 18, '#bfe3f5', 1, C.ink, 1.1));
/** A university: columns and a cap on the gable. */
const uni = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-26, -4, 52, 5, C.grey2, 1, C.ink, 1.2), rect(-22, -26, 44, 22, '#efe6d2', 1, C.ink, 1.4), path('M-26 -26 L0 -40 L26 -26 Z', '#e2d6bc', C.ink, 1.4), ...[-15, -5, 5, 15].map((cx) => rect(cx - 2.2, -24, 4.4, 20, C.white, 1, C.ink, 0.9)), g('translate(0 -31) scale(0.7)', path('M-9 -2 L0 -6 L9 -2 L0 2 Z', C.navy, C.ink, 0.8), path('M-5 0 L-5 4 C-2 6 2 6 5 4 L5 0', C.navy, C.ink, 0.8)));
/** Swedish flag; (x, y) is the top-left corner. */
const flagSE = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(0, 0, 20, 13, '#2a6ebb', 0.5, C.ink, 1), rect(6, 0, 3.4, 13, '#f7cf2e', 0, null), rect(0, 4.8, 20, 3.4, '#f7cf2e', 0, null), rect(0, 0, 20, 13, 'none', 0.5, C.ink, 1));
const flagJP = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(0, 0, 20, 13, C.white, 0.5, C.ink, 1), circle(10, 6.5, 3.8, '#d62f3a', null));
/** An authority (state agency): office block with a flag. */
const office = (x: number, y: number, s = 1, col = '#cfd8e2', sign: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-18, -26, 36, 46, col, 1.5, C.ink, 1.4), ...Array.from({ length: 9 }, (_, i) => rect(-13 + (i % 3) * 10, -21 + Math.floor(i / 3) * 11, 6, 7, '#9ad0f0', 0.5, C.ink, 0.6)), rect(-5, 8, 10, 12, C.brown, 0.5, C.ink, 1), line('M12 -26 L12 -40', C.ink, 1.4), flagSE(12, -40, 0.55), sign);
/** A town hall (the municipality): a small building with a clock tower. */
const townHall = (x: number, y: number, s = 1, col = '#f0d9b5') => g(`translate(${x} ${y}) scale(${s})`, rect(-20, -6, 40, 26, col, 1, C.ink, 1.4), rect(-6, -24, 12, 18, col, 1, C.ink, 1.4), path('M-8 -24 L0 -32 L8 -24 Z', RED, C.ink, 1.2), circle(0, -16, 3.4, C.white, C.ink, 0.9), rect(-4, 8, 8, 12, C.brown, 0.5, C.ink, 0.9), rect(-16, 0, 6, 6, '#9ad0f0', 0.5, C.ink, 0.6), rect(10, 0, 6, 6, '#9ad0f0', 0.5, C.ink, 0.6));
/** The parliament (the state). */
const parliament = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-30, 10, 60, 5, C.grey2, 1, C.ink, 1.2), rect(-27, -10, 54, 20, '#efe6d2', 1, C.ink, 1.4), path('M-30 -10 L0 -24 L30 -10 Z', '#e2d6bc', C.ink, 1.4), ...[-20, -10, 0, 10, 20].map((cx) => rect(cx - 2, -8, 4, 18, C.white, 1, C.ink, 0.8)), line('M0 -24 L0 -36', C.ink, 1.4), flagSE(0, -36, 0.55));
/** A company: warm block with a sawtooth roof. */
const company = (x: number, y: number, s = 1, col = '#e9c27a') => g(`translate(${x} ${y}) scale(${s})`, path('M-22 -14 L-22 -26 L-11 -18 L-11 -26 L0 -18 L0 -26 L11 -18 L22 -18 L22 22 L-22 22 Z', col, C.ink, 1.4), ...[-14, -4, 6, 16].map((cx) => rect(cx - 3, -8, 6, 7, '#9ad0f0', 0.5, C.ink, 0.6)), rect(-5, 9, 10, 13, C.brown, 0.5, C.ink, 1));
const house = (x: number, y: number, s = 1, col = '#e8a07a') => g(`translate(${x} ${y}) scale(${s})`, path('M-14 -2 L0 -14 L14 -2 Z', RED, C.ink, 1.3), rect(-11, -2, 22, 16, col, 1, C.ink, 1.3), rect(-3, 5, 6, 9, C.brown, 0.5, C.ink, 0.8), rect(5, 1, 4, 4, '#9ad0f0', 0.5, C.ink, 0.6));
/** A clock face showing h:m. */
const clock = (x: number, y: number, r: number, h: number, m = 0) => {
  const pt = (hr: number, rr: number) => { const a = (hr / 12) * Math.PI * 2 - Math.PI / 2; return [x + Math.cos(a) * rr, y + Math.sin(a) * rr] as const; };
  const ticks = Array.from({ length: 12 }, (_, i) => { const a = pt(i, r * 0.8), b = pt(i, r * 0.95); return line(`M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])}`, C.ink, i % 3 ? 0.8 : 1.4); });
  const hh = pt(h + m / 60, r * 0.5), mm = pt(m / 5, r * 0.78);
  return all(circle(x, y, r, C.white, C.ink, 1.6), ...ticks, line(`M${x} ${y} L${f1(hh[0])} ${f1(hh[1])}`, C.ink, 2), line(`M${x} ${y} L${f1(mm[0])} ${f1(mm[1])}`, C.ink, 1.3), circle(x, y, 1.4, C.ink, null));
};
/** A school bell ringing. */
/** Year boxes 0–9 along the bottom; `hi` = indices to highlight (0 = förskoleklass). */
const years = (hi: number[], col: string = C.yellow, y = 6, x0 = 5, w = 10.4) => all(...Array.from({ length: 10 }, (_, i) => { const on2 = hi.includes(i); return all(rect(x0 + i * (w + 0.6), y, w, 13, on2 ? col : '#e3e6ea', 1.5, C.ink, on2 ? 1.3 : 0.9), num(x0 + i * (w + 0.6) + w / 2, y + 6.5, `${i}`, 8, on2 ? C.ink : C.grey)); }));
/** A bracket above year boxes from index a to b. */
const yearSpan = (a: number, b: number, col: string = HL, y = 22, x0 = 5, w = 10.4) => { const xa = x0 + a * (w + 0.6), xb = x0 + b * (w + 0.6) + w; return line(`M${f1(xa)} ${y} L${f1(xa)} ${y + 4} L${f1(xb)} ${y + 4} L${f1(xb)} ${y}`, col, 2.2); };
/** Centre x of year box i. */
const yx = (i: number, x0 = 5, w = 10.4) => x0 + i * (w + 0.6) + w / 2;
/** Month strip from August to July: 12 cells; colour per cell index (0 = Aug). */
const months = (cols: (string | null)[], y = 60, x0 = 6, w = 8.6) => all(...['8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', '7'].map((m, i) => all(rect(x0 + i * (w + 0.4), y, w, 14, cols[i] ?? '#e3e6ea', 1.2, C.ink, 0.9), num(x0 + i * (w + 0.4) + w / 2, y + 7, m, 6.4, cols[i] ? C.ink : C.grey))));
const mx = (i: number, x0 = 6, w = 8.6) => x0 + i * (w + 0.4) + w / 2;
/** A door. */
const door = (x: number, y: number, w = 16, h = 30, col: string = C.brown) => all(rect(x - w / 2, y - h, w, h, col, 1, C.ink, 1.4), circle(x + w / 2 - 3, y - h / 2, 1.2, C.gold, null));
/** A locker. */
/** Picture symbols (a visual schedule). */
/** A headset. */
const headset = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-8 2 C-8 -10 8 -10 8 2', 'none', C.dark, 2.2), rect(-10, 0, 5, 8, C.dark, 2, C.ink, 1), rect(5, 0, 5, 8, C.dark, 2, C.ink, 1));
/** A steering wheel. */
const stamp = (x: number, y: number, s = 1, col: string = RED) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 7, 'none', col, 1.6), circle(0, 0, 4.4, 'none', col, 0.9), star(0, 0, 2.6, col));
const ballot = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-10, -6, 20, 16, '#7aa7d8', 1.5, C.ink, 1.3), rect(-5, -7, 10, 2, C.dark, 0.5, null), rect(-4, -16, 8, 10, C.white, 1, C.ink, 1), check(0, -11, 0.4));
const target = (x: number, y: number, r = 10) => all(circle(x, y, r, C.white, C.ink, 1.3), circle(x, y, r * 0.66, RED, C.ink, 1), circle(x, y, r * 0.33, C.white, C.ink, 1));
const stepsUp = (x: number, base: number, n: number, w: number, hh: number, col: string = C.mint) => all(...Array.from({ length: n }, (_, i) => rect(x + i * w, base - (i + 1) * hh, w, (i + 1) * hh, col, 1, C.ink, 1.2)));
const saw = (x: number, y: number, rot = 0, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M0 -3 L26 -3 L26 3 L0 5 Z', C.silver, C.ink, 1), path('M2 5 L4 7 L6 4.8 L8 6.8 L10 4.6 L12 6.6 L14 4.4 L16 6.4 L18 4.2 L20 6.2 L22 4 L24 6 L26 3', 'none', C.ink, 0.8), rect(-9, -5, 10, 10, C.brown, 2, C.ink, 1.1));
const plank = (x: number, y: number, w = 40) => all(rect(x - w / 2, y - 4, w, 8, '#d9a86a', 1, C.ink, 1.2), line(`M${x - w / 2 + 6} ${y - 1} C${x - 4} ${y - 3} ${x + 4} ${y + 2} ${x + w / 2 - 6} ${y}`, '#b07a40', 0.9));
const chair = (x: number, y: number, s = 1, col: string = '#5a8fc7') => g(`translate(${x} ${y}) scale(${s})`, rect(-6, -14, 12, 3, col, 1, C.ink, 1), rect(-6, -4, 12, 3, col, 1, C.ink, 1), line('M-5 -11 L-5 -4 M5 -11 L5 -4 M-5 -1 L-5 8 M5 -1 L5 8', C.ink, 1.4));
/** Course blocks (a stack of course credits). */
/** A signpost with icons on its boards. */
const id = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-18, -12, 36, 24, '#e8f0f8', 3, C.ink, 1.5), rect(-18, -12, 36, 6, C.navy, 3, C.ink, 1.3), rect(-14, -3, 11, 12, C.white, 1, C.ink, 0.9), circle(-8.5, 1, 3, C.skin, C.ink, 0.7), path('M-12 9 C-12 5 -5 5 -5 9 Z', TEACH, null), line('M0 -1 L13 -1 M0 3 L11 3 M0 7 L9 7', C.grey, 1.4), stamp(11, 6, 0.5, C.gold));


// ── World things (T06) ───────────────────────────────────────────────
/** Flags; (x, y) = top-left corner, 20×13 at s = 1. */
const flagFI = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(0, 0, 20, 13, C.white, 0.5, C.ink, 1), rect(5.5, 0, 3.6, 13, '#1f4fa0', 0, null), rect(0, 4.7, 20, 3.6, '#1f4fa0', 0, null), rect(0, 0, 20, 13, 'none', 0.5, C.ink, 1));
const flagDE = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(0, 0, 20, 4.4, '#2e2e36', 0, null), rect(0, 4.4, 20, 4.4, '#d6323a', 0, null), rect(0, 8.8, 20, 4.2, '#f2c14e', 0, null), rect(0, 0, 20, 13, 'none', 0.5, C.ink, 1));
const flagFR = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(0, 0, 6.7, 13, '#2a55a8', 0, null), rect(6.7, 0, 6.6, 13, C.white, 0, null), rect(13.3, 0, 6.7, 13, '#d6323a', 0, null), rect(0, 0, 20, 13, 'none', 0.5, C.ink, 1));
const flagES = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(0, 0, 20, 13, '#c8303a', 0, null), rect(0, 3.3, 20, 6.4, '#f2c14e', 0, null), rect(0, 0, 20, 13, 'none', 0.5, C.ink, 1));
const flagUS = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(0, 0, 20, 13, C.white, 0, null), ...[0, 2, 4, 6].map((i) => rect(0, i * 1.86 + (i ? 0 : 0), 20, 1.86, '#c8303a', 0, null)), rect(0, 11.14, 20, 1.86, '#c8303a', 0, null), rect(0, 0, 9, 7, '#2a3f7a', 0, null), rect(0, 0, 20, 13, 'none', 0.5, C.ink, 1));
const flagIN = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(0, 0, 20, 4.4, '#f29a3e', 0, null), rect(0, 4.4, 20, 4.4, C.white, 0, null), rect(0, 8.8, 20, 4.2, '#3f9a4f', 0, null), circle(10, 6.5, 1.6, 'none', '#2a3f7a', 0.6), rect(0, 0, 20, 13, 'none', 0.5, C.ink, 1));
/** A flag on a pole; (x, y) = pole foot. */
const pole = (x: number, y: number, h: number, f: (x: number, y: number, s?: number) => Svg, s = 0.8) => all(line(`M${x} ${y} L${x} ${y - h}`, C.ink, 1.4), f(x, y - h, s));
const plane = (x: number, y: number, s = 1, rot = 0, col: string = C.white) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-14 0 C-14 -2.4 -12 -3 -9 -3 L10 -3 C14 -3 16 -1 16 0 C16 1 14 3 10 3 L-9 3 C-12 3 -14 2.4 -14 0 Z', col, C.ink, 1.2), path('M-2 -3 L-8 -12 L-4 -12 L5 -3 Z M-2 3 L-8 12 L-4 12 L5 3 Z', col, C.ink, 1.1), path('M-12 -2 L-15 -8 L-12 -8 L-8 -3 Z', col, C.ink, 1), circle(11, -0.6, 1, '#5aa7e8', null), circle(7, -0.6, 1, '#5aa7e8', null), circle(3, -0.6, 1, '#5aa7e8', null));
const suitcase = (x: number, y: number, s = 1, col: string = '#c8735a') => g(`translate(${x} ${y}) scale(${s})`, path('M-4 -12 L-4 -15 L4 -15 L4 -12', 'none', C.ink, 1.6), rect(-10, -12, 20, 16, col, 2.5, C.ink, 1.4), line('M-5 -12 L-5 4 M5 -12 L5 4', 'rgba(0,0,0,0.3)', 1.4), circle(-6, 6, 1.6, C.dark, null), circle(6, 6, 1.6, C.dark, null));
/** An open passport page with a stamp area (in local coordinates). */
const visaPage = (x: number, y: number, s = 1, inner: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-24, -15, 24, 30, '#f3ead6', 1.5, C.ink, 1.3), rect(0, -15, 24, 30, '#eaf0e0', 1.5, C.ink, 1.3), rect(-20, -10, 8, 10, C.white, 1, C.ink, 0.8), circle(-16, -6.5, 2.2, C.skin, null), line('M-9 -8 L-3 -8 M-9 -4 L-4 -4 M-20 4 L-4 4 M-20 8 L-6 8', C.grey, 1.1), inner);
/** Graduation cap (mortarboard). */
const mcap = (x: number, y: number, s = 1, col: string = C.navy) => g(`translate(${x} ${y}) scale(${s})`, path('M-12 -2 L0 -7 L12 -2 L0 3 Z', col, C.ink, 1), path('M-6 1 L-6 6 C-3 8 3 8 6 6 L6 1', col, C.ink, 1), line('M8 -1 L8 6', C.gold, 1.2), circle(8, 7, 1.2, C.gold, null));
/** White student cap with a black visor (Nordic). */
const scap = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-11 2 C-12 -8 12 -8 11 2 Z', C.white, C.ink, 1.3), rect(-11, 0, 22, 3.4, C.dark, 1, C.ink, 1), path('M-7 3.4 C-4 7 6 7 9 3.4 Z', C.black, C.ink, 1), circle(0, -2, 1.6, C.gold, C.ink, 0.6));
const laptop = (x: number, y: number, s = 1, scr: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-12, -16, 24, 15, C.dark, 1.5, C.ink, 1.2), rect(-10, -14, 20, 11, '#bfe3f5', 0.5, null), path('M-15 -1 L15 -1 L13 2 L-13 2 Z', C.grey, C.ink, 1), scr);
const bed = (x: number, y: number, s = 1, col: string = '#5a8fc7') => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -6, 28, 6, col, 1.5, C.ink, 1.1), rect(-14, -12, 3, 14, C.brown, 0.5, C.ink, 0.9), rect(-10, -9, 8, 3.6, C.white, 1.5, C.ink, 0.8), line('M-13 2 L-13 5 M13 0 L13 5', C.brown, 1.6));
const moon = (x: number, y: number, r = 6) => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${x + r * 0.9} ${y + r * 0.5} A${r * 0.8} ${r * 0.8} 0 1 1 ${x} ${y - r} Z`, C.yellow, C.ink, 1);
const lamp = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L-6 -14 L2 -22', C.dark, 1.6), path('M-2 -26 L8 -20 L4 -16 Z', C.yellow, C.ink, 1), path('M5 -16 L14 2 L-6 2 Z', 'rgba(242,193,78,0.25)', null), rect(-6, 0, 12, 3, C.dark, 1, null));
const gate = (x: number, y: number, w: number, h: number, col: string = C.dark) => all(line(`M${x - w / 2} 112 L${x - w / 2} ${y} M${x + w / 2} 112 L${x + w / 2} ${y}`, col, 3), path(`M${x - w / 2} ${y + 4} C${x - w / 4} ${y - 4} ${x + w / 4} ${y - 4} ${x + w / 2} ${y + 4}`, 'none', col, 2.4), ...Array.from({ length: 5 }, (_, i) => line(`M${f1(x - w / 2 + (i + 1) * w / 6)} 112 L${f1(x - w / 2 + (i + 1) * w / 6)} ${y + h}`, col, 1.4)));
const wall = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, '#c98a6a', 1, C.ink, 1.3), ...Array.from({ length: Math.floor(h / 8) }, (_, i) => line(`M${x} ${y + (i + 1) * 8} L${x + w} ${y + (i + 1) * 8}`, '#8a5a44', 0.8)), ...Array.from({ length: Math.floor(h / 8) + 1 }, (_, i) => line(`M${x + (i % 2 ? w / 3 : (2 * w) / 3)} ${y + i * 8} L${x + (i % 2 ? w / 3 : (2 * w) / 3)} ${Math.min(y + h, y + (i + 1) * 8)}`, '#8a5a44', 0.8)));
const bars = (x: number, base: number, hs: number[], w = 8, cols: string[] = ['#5aa7e8']) => all(...hs.map((h, i) => rect(x + i * (w + 3), base - h, w, h, cols[i % cols.length]!, 1, C.ink, 1)), line(`M${x - 2} ${base} L${x + hs.length * (w + 3)} ${base}`, C.ink, 1.2));
const podium = (x: number, base: number, inner: Svg[] = []) => all(rect(x - 30, base - 18, 20, 18, '#c0c6cc', 1, C.ink, 1.2), rect(x - 10, base - 28, 20, 28, C.gold, 1, C.ink, 1.2), rect(x + 10, base - 12, 20, 12, '#d9a06a', 1, C.ink, 1.2), num(x - 20, base - 9, '2', 9), num(x, base - 14, '1', 10), num(x + 20, base - 6, '3', 8), ...inner);
const seal = (x: number, y: number, r = 6, col: string = C.gold) => all(path(`M${x - 3} ${y + r - 1} L${x - 5} ${y + r + 6} L${x - 1} ${y + r + 4} L${x + 1} ${y + r + 6} L${x + 3} ${y + r - 1}`, RED, C.ink, 0.8), circle(x, y, r, col, C.ink, 1), star(x, y, r * 0.5, C.white));
/** A certificate with a seal; `emb` drawn at the top centre. */
const cert = (x: number, y: number, s = 1, emb: Svg = '', sealCol: string = C.gold) => g(`translate(${x} ${y}) scale(${s})`, rect(-20, -14, 40, 28, '#f7efd8', 1.5, C.ink, 1.4), rect(-17, -11, 34, 22, 'none', 1, '#c8a86a', 0.9), g('translate(0 -4)', emb), line('M-12 5 L4 5 M-12 8.5 L0 8.5', C.grey, 1.1), seal(12, 6, 4.6, sealCol));
const gear = (x: number, y: number, r = 6, col: string = C.grey) => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return rect(+f1(x + Math.cos(a) * r - 1.6), +f1(y + Math.sin(a) * r - 1.6), 3.2, 3.2, col, 0.5, C.ink, 0.6); }), circle(x, y, r, col, C.ink, 1), circle(x, y, r * 0.38, C.white, C.ink, 0.8));
const helmet = (x: number, y: number, s = 1, col: string = C.yellow) => g(`translate(${x} ${y}) scale(${s})`, path('M-9 2 C-9 -9 9 -9 9 2 Z', col, C.ink, 1.2), rect(-11, 1, 22, 3, col, 1, C.ink, 1), line('M0 -7 L0 1', 'rgba(0,0,0,0.3)', 1.4));
const flame = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -10 C6 -4 7 2 4 6 C2 8 -2 8 -4 6 C-7 2 -4 -3 0 -10 Z', '#f29a3e', C.ink, 1), path('M0 -3 C3 0 3 4 1 6 C0 7 -1 7 -2 6 C-3 4 -2 1 0 -3 Z', C.yellow, null));
const atom = (x: number, y: number, r = 9) => all(ellipse(x, y, r, r * 0.38, 'none', '#5a8fc7', 1.3), g(`rotate(60 ${x} ${y})`, ellipse(x, y, r, r * 0.38, 'none', '#5a8fc7', 1.3)), g(`rotate(-60 ${x} ${y})`, ellipse(x, y, r, r * 0.38, 'none', '#5a8fc7', 1.3)), circle(x, y, 2, RED, null));
const compass = (x: number, y: number, r = 7) => all(circle(x, y, r, C.white, C.ink, 1.3), path(`M${x} ${y - r + 1.5} L${x + 2} ${y} L${x - 2} ${y} Z`, RED, null), path(`M${x} ${y + r - 1.5} L${x + 2} ${y} L${x - 2} ${y} Z`, C.grey, null));
const ticket = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -8, 28, 16, '#bfe3f5', 2, C.ink, 1.2), line('M5 -8 L5 8', C.ink, 0.8, '2 2'), g('translate(-4 0) scale(0.45)', plane(0, 0, 1, -10)), line('M8 -3 L11 -3 M8 1 L11 1', C.grey, 1));
const people3 = (x: number, y: number, s = 1, cols: string[] = [C.orange, C.sky, C.purple]) => g(`translate(${x} ${y}) scale(${s})`, ...cols.map((c, i) => mini(-12 + i * 12, 0, c, 'smile', 0.7)));
const handshake = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-18 -2 L-8 -4 L-2 0 L-8 4 L-18 4 Z', '#5a8fc7', C.ink, 1.1), path('M18 -2 L8 -4 L2 0 L8 4 L18 4 Z', TEACH, C.ink, 1.1), path('M-9 -4 C-4 -8 4 -8 9 -4 C6 2 -2 6 -9 4 Z', C.skin, C.ink, 1.1), line('M-4 -3 L2 2 M-1 -5 L5 0', C.ink, 0.6));
const equals = (x: number, y: number, s = 1, col: string = C.green) => g(`translate(${x} ${y}) scale(${s})`, rect(-6, -4, 12, 3, col, 1, null), rect(-6, 1, 12, 3, col, 1, null));
const glyphs = (x: number, y: number, chars: string[], sz = 9, col: string = C.ink) => all(...chars.map((c, i) => T(x + i * sz * 1.1, y, c, sz, col)));
const studentF = (x: number, top: string = C.purple, mood: Mood = 'smile', more: Partial<Build> = {}) => fig(x, top, mood, { h: 0.8, ...more });
const mountainS = (x: number, y: number) => all(path(`M${x - 12} ${y + 8} L${x - 3} ${y - 8} L${x + 6} ${y + 8} Z`, '#8aa0b8', C.ink, 1), path(`M${x - 5} ${y - 4} L${x - 3} ${y - 8} L${x - 1} ${y - 4} Z`, C.white, null));
const backpack = (x: number, h: number, col: string = RED) => on(x, h, rect(-19, -40, 8, 22, col, 2, C.ink, 1.3), line('M-12 -40 L-6 -40', C.ink, 1.6));

// ── Motifs ───────────────────────────────────────────────────────────
export const EDUWORLD_MOTIFS: Record<string, Svg> = {
  // ── Skolstart och skolplikt ──
  'utb.skolstart': all(months(['#f2c14e', null, null, null, null, null, null, null, null, null, null, null], 8), ring(mx(0), 15, 9), school(86, 92, 0.75), kid(26, C.orange, 'laugh', 0.55), backpack(26, 0.55), kid(48, C.sky, 'smile', 0.58, { hairStyle: 'long' }), backpack(48, 0.58, '#5aa7e8'), curveArrow('M58 80 C64 76 66 74 70 74', 70, 74, -20, HL, 2.2), ground),
  'utb.skolålder': all(...Array.from({ length: 11 }, (_, i) => all(rect(4 + i * 10.2, 8, 9.4, 12, i >= 3 && i <= 9 ? C.yellow : '#e3e6ea', 1.5, C.ink, i >= 3 && i <= 9 ? 1.2 : 0.8), num(8.7 + i * 10.2, 14, `${i + 3}`, 7, i >= 3 && i <= 9 ? C.ink : C.grey))), line(`M${4 + 3 * 10.2} 24 L${4 + 3 * 10.2} 28 L${4 + 10 * 10.2 - 0.8} 28 L${4 + 10 * 10.2 - 0.8} 24`, HL, 2.2), greyed(kid(14, C.pink, 'smile', 0.34)), kid(48, C.orange, 'smile', 0.56), backpack(48, 0.56), kid(74, C.sky, 'smile', 0.66, { hairStyle: 'long' }), backpack(74, 0.66, C.green), school(100, 84, 0.4), ground),
  'utb.börja-skolan': all(school(80, 96, 0.9), door(80, 112, 14, 22, C.brown), kid(56, C.yellow, 'laugh', 0.5), on(56, 0.5, rect(-22, -42, 12, 28, RED, 3, C.ink, 1.6)), flower(46, 68, 0.9), fig(22, TEACH, 'smile', { h: 0.85, hairStyle: 'long' }), reach(22, 0.85, 1, 40, 52), curveArrow('M62 100 C68 98 70 98 74 100', 74, 100, 20, HL, 2), ground),
  'utb.läroplikt': all(house(30, 70, 2.2, '#f0d9b5'), table(92, 8, 58), kid(22, C.orange, 'smile', 0.5), openBook(36, 88, 0.6), fig(50, C.purple, 'smile', { h: 0.72, hairStyle: 'long' }), doc(90, 40, 0.9, check(0, 12, 0.7)), greyed(school(96, 108, 0.5)), cross(96, 84, 0.9, C.grey), ground),
  'utb.skolgång': all(school(60, 44, 0.65), line('M10 104 C30 70 90 70 110 104', HL, 2.4, '4 3'), kid(14, C.orange, 'smile', 0.42), kid(60, C.orange, 'smile', 0.62), fig(104, C.orange, 'smile', { h: 0.8 }), num(14, 64, '7', 9), num(104, 26, '16', 9), arrow(70, 60, 92, 60, HL, 2.4), ground),
  'utb.privatskola': all(gate(60, 54, 104, 14), school(60, 76, 0.85, '#d9c9a8'), coin(16, 30, 6), coin(26, 22, 6), coin(104, 28, 6), fig(60, '#2a3f7a', 'calm', { h: 0.62 }), on(60, 0.62, tieL), ground),
  'utb.skolavgift': all(school(86, 94, 0.75), fig(28, C.green, 'calm', { h: 0.95 }), reach(28, 0.95, 1, 48, 66), coin(52, 64, 5), coin(58, 58, 5), curveArrow('M50 54 C58 40 66 40 70 50', 70, 50, 70, HL, 2.2), kid(46, C.orange, 'smile', 0.5), ground),
  'utb.internatskola': all(moon(100, 14, 7), rect(14, 30, 92, 70, '#e9b75a', 1, C.ink, 1.5), path('M10 30 L60 12 L110 30 Z', RED, C.ink, 1.5), rect(20, 40, 38, 26, '#2f3a5a', 1, C.ink, 1.2), rect(62, 40, 38, 26, '#2f3a5a', 1, C.ink, 1.2), bed(39, 62, 1, '#5a8fc7'), mini(33, 54, C.orange, 'flat', 0.5), bed(81, 62, 1, '#7ac06a'), mini(75, 54, C.sky, 'flat', 0.5), board(22, 72, 34, 20, chalk('M28 80 L48 80 M28 86 L42 86')), door(84, 100, 14, 26), suitcase(104, 108, 0.8), ground),
  'utb.hemundervisning': all(path('M4 50 L60 14 L116 50', 'none', RED, 3), rect(10, 50, 100, 62, '#fbf3e4', 1, C.ink, 1), rect(80, 58, 22, 16, '#9ad0f0', 1, C.ink, 1), table(88, 18, 104), fig(34, C.purple, 'smile', { h: 0.85, hairStyle: 'long' }), reach(34, 0.85, 1, 56, 84), kid(78, C.orange, 'smile', 0.55), openBook(62, 84, 0.7), cup(98, 82)),
  'utb.rätt-till-utbildning': all(globe(60, 26, 14), openBook(60, 54, 1.1), kid(16, C.orange, 'smile', 0.5), kid(36, C.green, 'smile', 0.54, { skin: C.skin2 }), kid(84, C.purple, 'smile', 0.52, { skin: '#8a5a3c', hairStyle: 'long' }), kid(104, C.yellow, 'smile', 0.5, { skin: C.skin2 }), okB(60, 80, 8), ground),
  'utb.analfabet': all(fig(40, C.green, 'frown', { h: 0.95 }), reach(40, 0.95, 1, 70, 60), doc(80, 56, 1.1, all(q(0, -4, 14, RED))), think(40, 0.95, -1, 22, 16, (cx, cy) => q(cx, cy, 11)), ground),
  'utb.läskunnig': all(fig(36, TEACH, 'laugh', { h: 0.95, hairStyle: 'long' }), reach(36, 0.95, 1, 58, 62), openBook(68, 62, 1.1), check(68, 40, 1.1), greyed(fig(100, C.grey, 'frown', { h: 0.7 }), doc(100, 26, 0.5, q(0, 0, 14))), ground),
  'utb.hoppa-av.2': all(years([0, 1, 2, 3, 4], C.yellow, 8, 5, 10.4), yearSpan(0, 4, HL, 23), greyed(rect(5 + 5 * 11, 8, 54, 13, '#e3e6ea', 1.5, null)), school(30, 80, 0.6), fig(82, C.orange, 'frown', { h: 0.8 }), curveArrow('M58 70 C66 56 74 56 80 62', 80, 62, 50, RED, 2.4), door(58, 112, 14, 26, C.brown), cross(104, 60, 1.1), ground),

  // ── Läroplaner och ämnen ──
  'utb.ämne.2': all(rect(6, 8, 108, 68, '#f4ead8', 3, C.ink, 1.4), ...[[24, 24, '#5aa7e8'], [60, 24, '#e85a5a'], [96, 24, '#7ac06a'], [24, 56, '#f2c14e'], [60, 56, '#c8a8d8'], [96, 56, '#8cc7e8']].map(([x, y, c]) => rect((x as number) - 14, (y as number) - 12, 28, 24, c as string, 3, C.ink, 1.2)), T(24, 29, '+−', 12, C.white), T(60, 29, 'Aa', 12, C.white), flask(96, 24, 0.7), noteM(24, 58, 0.8, C.white), palette(60, 56, 0.9), globe(96, 56, 8), kid(30, C.orange, 'smile', 0.36), kid(90, C.sky, 'smile', 0.36, { hairStyle: 'long' }), ground),
  'utb.kärnämne': all(rect(8, 30, 30, 40, '#5aa7e8', 3, C.ink, 1.6), T(23, 56, '+−', 15, C.white), rect(45, 30, 30, 40, '#e85a5a', 3, C.ink, 1.6), T(60, 56, 'Aa', 15, C.white), rect(82, 30, 30, 40, '#7ac06a', 3, C.ink, 1.6), globe(97, 50, 10), greyed(rect(10, 82, 16, 20, C.grey2, 2, C.ink, 1), rect(32, 82, 16, 20, C.grey2, 2, C.ink, 1), rect(54, 82, 16, 20, C.grey2, 2, C.ink, 1), rect(76, 82, 16, 20, C.grey2, 2, C.ink, 1), rect(98, 82, 16, 20, C.grey2, 2, C.ink, 1)), star(23, 20, 6, C.gold), star(60, 20, 6, C.gold), star(97, 20, 6, C.gold)),
  'utb.timplan': all(rect(8, 10, 104, 96, C.white, 3, C.ink, 1.6), ...[['#5aa7e8', 80, '+−'], ['#e85a5a', 70, 'Aa'], ['#7ac06a', 40, ''], ['#f2c14e', 30, ''], ['#c8a8d8', 20, '']].map(([c, w, l], i) => all(rect(36, 18 + i * 17, (w as number) * 0.85, 11, c as string, 2, C.ink, 1), l ? T(22, 27 + i * 17, l as string, 9) : '')), ball(22, 58, 4.5), noteM(22, 75, 0.7), palette(22, 90, 0.7), clock(98, 96, 8, 2)),
  'utb.undervisningstid': all(board(10, 14, 60, 34, all(chalk('M18 24 L40 24 M18 32 L52 32 M18 40 L34 40'))), teacher(84, 0.85), pupil(24, 92, C.orange), pupil(54, 92, C.sky), clock(98, 22, 12, 9, 45), path('M98 22 L98 10 A12 12 0 0 1 110 22 Z', 'rgba(228,87,46,0.45)', null)),
  'utb.främmande-språk': all(fig(20, C.orange, 'smile', { h: 0.9 }), fig(100, C.green, 'smile', { h: 0.9, hairStyle: 'long' }), sb(20, 0.9, 1, 22, 18, (cx, cy) => glyphs(cx - 5, cy + 3, ['A', 'ä'], 9)), sb(100, 0.9, -1, 22, 18, (cx, cy) => glyphs(cx - 5, cy + 3, ['あ', 'ñ'], 9)), flagSE(4, 4, 0.9), flagJP(96, 4, 0.9), q(60, 70, 14, C.navy), ground),
  'utb.språkval': all(kid(60, C.orange, 'calm', 0.62), think(60, 0.62, 1, 20, 16, (cx, cy) => q(cx, cy, 10)), pole(18, 112, 64, flagES), pole(42, 112, 74, flagFR), pole(88, 112, 74, flagDE), ring(98, 46, 14, C.green), check(98, 30, 0.9), ground),
  'utb.naturvetenskap': all(flask(28, 60, 1.8), atom(66, 36, 14), mag(96, 76, 1.4), leaf(70, 86, 1.6, C.green), rect(4, 104, 112, 4, C.tan, 1, C.ink, 1)),
  'utb.samhällskunskap': all(rect(14, 12, 92, 92, '#f3ead6', 3, C.ink, 1.6), parliament(60, 46, 0.9), ballot(34, 88, 1), para(60, 86, 18), g('translate(86 90)', line('M0 -12 L0 6 M-10 -8 L10 -8', C.ink, 1.4), path('M-14 -2 L-10 -8 L-6 -2 Z M6 -2 L10 -8 L14 -2 Z', C.gold, C.ink, 0.8))),
  'utb.religionskunskap': all(openBook(60, 86, 2.4), g('translate(26 44) scale(0.8)', path('M-12 12 L-12 -2 L0 -12 L12 -2 L12 12 Z', '#efe6d2', C.ink, 1.2), line('M0 -12 L0 -20 M-3 -17 L3 -17', C.ink, 1.2)), g('translate(60 40) scale(0.8)', rect(-12, -2, 24, 14, '#efe6d2', 1, C.ink, 1.2), path('M-9 -2 C-9 -14 9 -14 9 -2 Z', '#7ac0a8', C.ink, 1.2), line('M0 -12 L0 -18', C.ink, 1.2)), g('translate(94 44) scale(0.8)', rect(-12, -4, 24, 16, '#efe6d2', 1, C.ink, 1.2), path('M-16 -4 L0 -12 L16 -4 Z', RED, C.ink, 1.2), path('M-10 -12 L10 -12', 'none', C.ink, 1.6))),
  'utb.geografi': all(globe(40, 50, 26), g('translate(84 58)', rect(-20, -26, 40, 52, '#e8f4e0', 2, C.ink, 1.4), path('M-14 -16 C-6 -22 4 -14 10 -18 C16 -10 6 -2 12 6 C6 16 -6 10 -12 18 C-18 8 -10 -2 -14 -16 Z', '#a8d08c', C.ink, 1), line('M-4 -6 C0 2 2 8 6 12', '#5aa7e8', 1.6)), compass(100, 98, 9), rect(4, 104, 80, 4, C.tan, 1, C.ink, 1)),
  'utb.idrott-och-hälsa': all(rect(4, 6, 112, 106, '#f4ead8', 2, null), line('M4 92 L116 92', '#c9a46a', 1.4), kid(30, RED, 'laugh', 0.62, { bottom: C.navy }), reach(30, 0.62, 1, 48, 58), ball(56, 52, 7), g('translate(82 -10)', kid(0, C.yellow, 'laugh', 0.6, { bottom: C.navy })), line('M70 100 L94 100', C.grey, 1.2, '3 3'), ...[16, 40, 64].map((x) => rect(x, 10, 4, 30, C.tan, 1, C.ink, 0.8)), line('M14 18 L72 18 M14 30 L72 30', C.tan, 2), heartS(100, 24, 1)),
  'utb.ämnesövergripande': all(circle(60, 56, 15, '#bfe3f5', C.ink, 1.6), path('M60 44 C66 52 68 58 66 62 C64 68 56 68 54 62 C52 58 54 52 60 44 Z', '#5aa7e8', C.ink, 1.2), line('M60 41 L60 26 M47 64 L30 78 M73 64 L90 78', HL, 2.4), flask(60, 16, 0.9), globe(24, 88, 11), openBook(96, 90, 1)),

  // ── Prov och examina ──
  'utb.inträdesprov': all(gate(86, 40, 48, 14, '#7a6a5a'), school(86, 40, 0.5), desk(32, 82, 34), mini(32, 72, C.navy, 'flat', 0.95), test(32, 54, 0.8, ['ok', 'ok', '']), pencil(48, 66, 30, 0.7), curveArrow('M50 44 C60 34 66 40 70 50', 70, 50, 70, HL, 2.2), clock(14, 20, 9, 9, 0), ground),
  'utb.standardiserat-prov': all(...[0, 1, 2, 3].map((i) => all(test(18 + i * 28, 36, 0.62, ['', '', '']), mini(18 + i * 28, 82, [C.orange, C.sky, C.purple, C.green][i]!, 'flat', 0.8), desk(18 + i * 28, 92, 22))), equals(32, 62, 0.8, C.green), equals(60, 62, 0.8, C.green), equals(88, 62, 0.8, C.green), clock(60, 10, 7, 10, 0)),
  'utb.avgångsprov': all(years([7, 8, 9], C.yellow, 6), ring(yx(9), 12, 9), test(36, 62, 1.1, ['ok', 'ok', 'ok']), door(92, 112, 22, 40, C.brown), curveArrow('M56 64 C66 56 74 60 80 70', 80, 70, 60, HL, 2.2), mcap(92, 56, 1.1), ground),
  'utb.studentexamen': all(flagFI(6, 6, 1.2), laptop(36, 92, 1.4, all(check(0, -8, 0.7))), table(96, 4, 70), fig(90, C.white, 'laugh', { h: 0.9, hairStyle: 'long', bottom: C.navy }), g('translate(90 24)', scap(0, 0, 0.9)), flower(108, 76, 1)),
  'utb.provresultat': all(test(46, 56, 2.1, ['ok', 'ok', 'no'], all(rect(-12, 10, 24, 8, '#fff6d8', 2, RED, 0.8))), T(46, 92.5, '18/20', 9, RED), mini(98, 74, C.purple, 'smile', 1.1, false, true)),
  'utb.klara': all(fig(42, C.orange, 'laugh', { h: 0.9 }), reach(42, 0.9, -1, 18, 24), reach(42, 0.9, 1, 70, 30), test(80, 30, 0.9, ['ok', 'ok', 'ok']), grade(102, 54, 'A', GCOL['A'], 1.4), star(20, 14, 5), star(104, 16, 4), ground),
  'utb.kugga': all(fig(40, C.sky, 'frown', { h: 0.9 }), reach(40, 0.9, 1, 68, 66), test(82, 64, 1, ['no', 'no', 'ok']), grade(100, 34, 'F', GCOL['F'], 1.6), line('M24 24 l-3 6 M30 22 l-2 6', '#5aa7e8', 1.6), ground),
  'utb.fuska': all(desk(30, 84, 34), desk(88, 84, 34), mini(30, 74, C.orange, 'flat', 0.95), mini(88, 74, C.sky, 'smile', 0.95, false, true), test(30, 56, 0.7, ['', '', '']), test(88, 56, 0.7, ['ok', 'ok', 'ok']), line('M36 68 C52 50 64 50 74 56', RED, 1.6, '3 3'), circle(74, 56, 2, RED, null), noB(30, 24, 7)),
  'utb.fusklapp': all(rect(4, 70, 112, 42, C.tan, 2, C.ink, 1.4), test(30, 46, 1, ['', '', '']), path('M60 86 C66 74 96 74 104 86 L104 104 L60 104 Z', C.sky, C.ink, 1.4), circle(70, 92, 6, C.skin, C.ink, 1.2), rect(74, 76, 30, 20, C.white, 1, C.ink, 1.2), T(89, 85, 'a²+b²', 6.5), T(89, 93, 'x=3', 6.5), ring(89, 86, 18, RED)),
  'utb.plugghäst': all(moon(102, 14, 7), table(84, 6, 114), lamp(18, 84, 1), mini(60, 70, C.purple, 'flat', 1.1, false, true), ...[0, 1, 2, 3, 4].map((i) => rect(80, 74 - i * 7, 26, 7, ['#5aa7e8', '#e85a5a', '#7ac06a', '#f2c14e', '#c8a8d8'][i]!, 1, C.ink, 1)), ...[0, 1, 2].map((i) => rect(28, 74 - i * 7, 20, 7, ['#7ac06a', '#5aa7e8', '#e85a5a'][i]!, 1, C.ink, 1)), openBook(60, 82, 0.9), clock(42, 16, 8, 11, 50)),
  'utb.privatlektion': all(table(84, 10, 110), teacher(30, 0.9), mini(86, 72, C.orange, 'smile', 1), openBook(60, 82, 0.9), reach(30, 0.9, 1, 54, 78), coin(102, 80, 4), coin(108, 76, 4), house(96, 24, 1.2)),
  'utb.konkurrens.2': all(door(96, 72, 22, 38, C.brown), rect(84, 74, 24, 6, C.grey2, 1, C.ink, 1), chair(88, 100, 0.8, C.green), chair(104, 100, 0.8, C.green), ...Array.from({ length: 7 }, (_, i) => mini(10 + (i % 4) * 16, 70 + Math.floor(i / 4) * 24, [C.orange, C.sky, C.purple, C.green, C.yellow, RED, C.pink][i]!, 'flat', 0.8)), curveArrow('M62 70 C70 62 74 60 82 60', 82, 60, 0, HL, 2.4), num(96, 20, '2', 14, C.green), mini(36, 24, C.grey, 'flat', 0.7, true), mini(54, 24, C.grey, 'flat', 0.7, true)),

  // ── Yrkesutbildning ──
  'utb.yrkesskola': all(rect(18, 34, 84, 50, '#d9a06a', 1, C.ink, 1.5), path('M14 34 L60 16 L106 34 Z', '#8a4a3a', C.ink, 1.5), gear(60, 27, 6), rect(26, 42, 30, 20, '#9ad0f0', 1, C.ink, 1), rect(64, 42, 30, 20, '#9ad0f0', 1, C.ink, 1), wrench(36, 54, 40, 0.6), hammer(80, 54, -30, 0.6), fig(28, C.orange, 'smile', { h: 0.62 }), on(28, 0.62, vestL('#2f6fbf')), fig(92, C.green, 'smile', { h: 0.64, hairStyle: 'long' }), on(92, 0.64, vestL('#2f6fbf')), ground),
  'utb.yrkeshögskola': all(uni(30, 64, 1), company(92, 58, 0.9), line('M48 46 L72 46', HL, 2.4), arrow(56, 46, 72, 46, HL, 2.4), arrow(64, 50, 48, 50, HL, 2.4), fig(60, C.purple, 'smile', { h: 0.62 }), g('translate(60 60)', helmet(0, 0, 0.7)), laptop(42, 108, 0.7), toolbox(80, 104, 0.6), ground),
  'utb.lärlingsutbildning': all(table(76, 8, 112), plank(60, 72, 50), fig(30, TEACH, 'smile', { h: 0.95 }), on(30, 0.95, path('M-10 -38 L10 -38 L12 2 L-12 2 Z', '#8a6a4a', C.ink, 1.2)), reach(30, 0.95, 1, 50, 68), fig(90, C.orange, 'smile', { h: 0.78 }), on(90, 0.78, path('M-10 -38 L10 -38 L12 2 L-12 2 Z', '#8a6a4a', C.ink, 1.2)), reach(90, 0.78, -1, 72, 68), saw(64, 66, -10, 0.6), sb(30, 0.95, 1, 18, 14, (cx, cy) => check(cx, cy, 0.6))),
  'utb.praktik': all(company(90, 90, 1), fig(28, C.orange, 'smile', { h: 0.82 }), on(28, 0.82, rect(4, -32, 8, 10, C.white, 1, C.ink, 0.8), rect(5.5, -30, 5, 2, C.navy, 0.5, null)), fig(56, TEACH, 'smile', { h: 0.95, hairStyle: 'long' }), reach(56, 0.95, -1, 42, 60), clip(40, 64, 0.6, check(0, 0, 0.6)), months([null, null, null, '#f29a4e', '#f29a4e', null, null, null, null, null, null, null], 4), ground),
  'utb.teoretisk': all(board(8, 10, 66, 40, all(chalk('M16 24 L30 24 M36 20 L36 28 M32 24 L40 24'), T(46, 28, 'E=mc²', 8, '#eef3e6'), chalk('M16 38 C24 30 32 46 40 38 C48 30 56 46 64 38'))), fig(44, C.purple, 'calm', { h: 0.62 }), openBook(44, 66, 0.8), think(44, 0.62, -1, 20, 14, (cx, cy) => T(cx, cy + 3, '?', 9, C.navy)), greyed(toolbox(96, 100, 0.9), hammer(96, 72, 20, 0.8)), ground),
  'utb.praktisk.2': all(table(84, 4, 80), plank(42, 80, 50), fig(42, C.orange, 'laugh', { h: 0.9 }), reach(42, 0.9, 1, 58, 62), g('translate(58 62) rotate(-30)', rect(-1.6, -2, 3.2, 14, C.brown, 1, C.ink, 1), rect(-6, -6, 12, 5, C.grey, 1, C.ink, 1)), reach(42, 0.9, -1, 30, 76), line('M50 70 L54 66 M48 66 L50 62', HL, 1.6), greyed(book(102, 40, 0.8), openBook(102, 72, 0.6), fig(102, C.grey, 'calm', { h: 0.45 })), ground),
  'utb.hantverk': all(fig(60, '#8a6a4a', 'smile', { h: 0.95 }), table(84, 8, 112), g('translate(60 66)', path('M-12 14 C-16 0 -10 -10 -6 -12 L6 -12 C10 -10 16 0 12 14 Z', '#c8735a', C.ink, 1.4), ellipse(0, -12, 6, 2, '#9a5a40', C.ink, 1)), reach(60, 0.95, -1, 46, 70), reach(60, 0.95, 1, 74, 70), saw(14, 80, 0, 0.5), hammer(100, 78, 70, 0.6), ground),
  'utb.gesäll': all(stepsUp(10, 112, 3, 33, 16, '#e3e6ea'), rect(43, 80, 33, 32, C.yellow, 1, C.ink, 1.4), num(26, 104, '1', 9, C.grey), num(60, 100, '2', 10), num(93, 100, '3', 9, C.grey), g('translate(0 -32)', fig(60, '#8a6a4a', 'smile', { h: 0.65 })), cert(22, 40, 0.5, hammer(0, 0, 30, 0.4), C.silver), greyed(g('translate(0 -48)', fig(93, '#8a6a4a', 'smile', { h: 0.5 }))), greyed(g('translate(0 -16)', fig(26, '#8a6a4a', 'smile', { h: 0.45 })))),
  'utb.gesällbrev': all(cert(60, 54, 2.3, all(hammer(-4, 0, 30, 0.45), saw(2, 0, 0, 0.3)), C.silver), ground),
  'utb.mästarbrev': all(cert(60, 46, 2.1, all(star(-8, -2, 3, C.gold), star(0, -3, 3, C.gold), star(8, -2, 3, C.gold))), fig(24, '#8a6a4a', 'smile', { h: 0.7, hair: C.grey }), fig(98, '#8a6a4a', 'smile', { h: 0.62 }), ground),
  'utb.certifikat': all(id(48, 46, 1.6), flame(96, 30, 1.4), helmet(96, 64, 1.2), check(48, 78, 1), ground),
  'utb.bristyrke': all(company(30, 80, 1.1), mini(30, 50, C.orange, 'frown', 0.7), ...[0, 1, 2].map((i) => chair(70 + i * 18, 104, 0.9, '#5a8fc7')), ...[0, 1, 2].map((i) => q(70 + i * 18, 76, 13, HL)), helmet(70, 92, 0.6), wrench(88, 90, 60, 0.6), ground),

  // ── Stipendier och utbyten ──
  'utb.stipendium': all(envelope(46, 60, 2, all(coin(-6, -3, 3.4), coin(2, -5, 3.4), coin(8, -2, 3.4))), mcap(46, 26, 1.4), plane(96, 30, 0.9, -15), heartS(96, 82, 1), ground),
  'utb.stipendiat': all(rect(4, 84, 112, 28, '#a8746a', 1, C.ink, 1.4), g('translate(0 -28)', fig(52, C.purple, 'laugh', { h: 0.85, hairStyle: 'long' }), fig(84, C.dark, 'smile', { h: 0.9 }), reach(84, 0.9, -1, 66, 48), reach(52, 0.85, 1, 64, 50), envelope(66, 46, 0.6)), star(20, 20, 5), star(104, 16, 4), ...[16, 34, 100].map((x) => all(hnd(x - 3, 100, 3), hnd(x + 3, 100, 3)))),
  'utb.motiveringsbrev': all(doc(40, 56, 2, all(heartS(0, -10, 0.5), target(0, 6, 6))), fig(94, C.orange, 'smile', { h: 0.85 }), on(94, 0.85, hnd(-4, -24, 3.4), line('M-4 -27 L-4 -32', C.ink, 1.4)), pencil(68, 84, 30, 0.8), ground),
  'utb.rekommendationsbrev': all(teacher(28, 0.95), reach(28, 0.95, 1, 54, 62), envelope(60, 60, 0.8, star(0, 2, 3)), studentF(92, C.orange, 'laugh'), reach(92, 0.8, -1, 66, 64), thumb(14, 26, 1.1), ground),
  'utb.resebidrag': all(ticket(40, 40, 2), coin(70, 74, 7), coin(84, 70, 7), coin(78, 84, 7), plusB(28, 82, 9), ground),
  'utb.utbytesstudent': all(pole(10, 112, 80, flagSE, 0.9), pole(92, 112, 80, flagJP, 0.9), studentF(40, C.orange, 'smile', { h: 0.7 }), suitcase(54, 110, 0.7), studentF(80, C.sky, 'smile', { h: 0.7, hairStyle: 'long' }), suitcase(66, 110, 0.7, '#5a8fc7'), arrow(38, 24, 82, 24, HL, 2.4), arrow(82, 34, 38, 34, '#5a8fc7', 2.4), ground),
  'utb.utbytesprogram': all(uni(22, 92, 0.75), uni(98, 92, 0.75), flagSE(12, 40, 0.8), flagFR(88, 40, 0.8), line('M36 50 C50 30 70 30 84 50', HL, 2, '4 3'), plane(60, 36, 0.8, 0), people3(60, 76, 0.9), arrow(44, 60, 30, 72, HL, 2), arrow(76, 60, 90, 72, HL, 2), ground),
  'utb.utbytestermin': all(months([null, '#f29a4e', '#f29a4e', '#f29a4e', '#f29a4e', null, null, null, null, null, null, null], 64), rect(14, 60, 37, 22, 'none', 3, HL, 2.4), plane(40, 36, 1, -10), flagJP(76, 22, 1.2), flagSE(10, 92, 0.8), uni(96, 108, 0.45)),
  'utb.partneruniversitet': all(uni(22, 66, 0.8), uni(98, 66, 0.8), handshake(60, 46, 1.2), flagSE(10, 80, 0.8), flagJP(88, 80, 0.8), doc(60, 90, 0.6, all(line('M-8 10 C-4 6 -2 12 2 8', C.navy, 1), line('M2 12 C6 8 8 14 12 10', C.navy, 1)))),
  'utb.värdfamilj': all(house(78, 80, 2.6), door(78, 112, 14, 24), fig(64, C.green, 'smile', { h: 0.95 }), fig(96, C.purple, 'smile', { h: 0.9, hairStyle: 'long' }), kid(80, C.yellow, 'laugh', 0.5), reach(64, 0.95, -1, 42, 70), studentF(24, C.orange, 'smile', { h: 0.8 }), suitcase(10, 108, 0.8), heartS(46, 30, 0.9), ground),
  'utb.språkkurs': all(board(14, 10, 92, 38, all(T(32, 34, 'あ', 16, '#eef3e6'), T(56, 34, 'い', 16, '#eef3e6'), T(80, 34, 'う', 16, '#eef3e6'), chalk('M26 42 L94 42', 1.2))), teacher(96, 0.8), pupil(24, 92, C.orange), pupil(52, 92, C.sky, 'smile', 0.8, true), headset(52, 70, 0.7)),

  // ── Jämföra utbildningssystem ──
  'utb.utbildningssystem': all(stepsUp(6, 112, 4, 27, 22, '#e3e6ea'), g('translate(19.5 90) scale(0.32)', house(0, 0, 2)), school(46.5, 68, 0.36), gym(73.5, 46, 0.34), uni(100.5, 22, 0.46), kid(19.5, C.orange, 'smile', 0.28), curveArrow('M10 40 C30 20 60 14 90 10', 90, 10, -10, HL, 2), ...[0, 1, 2].map((i) => line(`M${33 + i * 27} ${100 - i * 22} L${33 + i * 27} ${90 - i * 22}`, C.ink, 1))),
  'utb.jämförbar': all(bars(10, 70, [20, 34, 26], 8, ['#5aa7e8']), bars(72, 70, [22, 32, 28], 8, ['#e85a5a']), equals(60, 50, 1.2, C.green), flagSE(16, 80, 0.9), flagFI(78, 80, 0.9), greyed(bars(36, 108, [6, 4], 5), ellipse(84, 102, 8, 6, C.grey, C.ink, 1)), ground),
  'utb.centraliserad': all(parliament(60, 36, 0.85), ...[[16, 96], [42, 104], [78, 104], [104, 96]].map(([x, y]) => all(school(x!, y!, 0.3), arrow(60, 56, x!, y! - 20, HL, 2))), ground),
  'utb.decentraliserad': all(greyed(parliament(60, 26, 0.55)), ...[[22, 70], [60, 70], [98, 70]].map(([x, y]) => all(townHall(x!, y! - 12, 0.5), school(x!, y! + 40, 0.3), arrow(x!, y! + 2, x!, y! + 20, HL, 2))), ground),
  'utb.avgiftsbelagd': all(uni(46, 80, 1.1), g('translate(92 52) rotate(15)', path('M-12 -8 L10 -8 L16 0 L10 8 L-12 8 Z', C.yellow, C.ink, 1.3), circle(10, 0, 1.6, C.white, C.ink, 0.6), coin(-3, 0, 5)), coin(96, 86, 6), coin(106, 96, 6), coin(90, 100, 6), ground),
  'utb.skolsegregation': all(wall(56, 30, 8, 82), school(28, 70, 0.6), school(92, 70, 0.6, '#9ec7e8'), house(14, 30, 0.8, '#e8a07a'), house(36, 26, 0.8, '#e8a07a'), g('translate(92 20)', rect(-14, 0, 28, 16, '#c9ced4', 1, C.ink, 1.1), ...[-8, 0, 8].map((x) => rect(x - 2, 4, 4, 4, '#9ad0f0', 0.5, null))), kid(18, C.orange, 'smile', 0.38), kid(38, C.orange, 'smile', 0.38), kid(82, C.sky, 'smile', 0.38, { skin: C.skin2 }), kid(102, C.sky, 'smile', 0.38, { skin: '#8a5a3c' }), ground),
  'utb.elitskola': all(path('M4 112 C30 60 90 60 116 112 Z', '#a8d08c', C.ink, 1.2), uni(60, 58, 0.9), star(60, 16, 7, C.gold), star(44, 22, 4, C.gold), star(76, 22, 4, C.gold), people3(22, 102, 0.8), people3(98, 102, 0.8), ring(60, 44, 24, C.gold)),
  'utb.nivågruppering': all(stepsUp(8, 112, 3, 34, 26, '#e3e6ea'), ...[0, 1, 2].map((i) => g(`translate(0 ${-(i + 1) * 26})`, kid(18 + i * 34, [C.orange, C.sky, C.purple][i]!, 'smile', 0.36), kid(32 + i * 34, [C.orange, C.sky, C.purple][i]!, 'smile', 0.36))), num(25, 104, '1', 9), num(59, 104, '2', 9), num(93, 104, '3', 9)),
  'utb.klasstorlek': all(...Array.from({ length: 12 }, (_, i) => mini(14 + (i % 6) * 18, 38 + Math.floor(i / 6) * 26, [C.orange, C.sky, C.purple, C.green, C.yellow, C.pink][i % 6]!, 'smile', 0.7)), line('M6 80 L114 80', C.grey2, 1), T(60, 104, '12', 18, HL), board(30, 4, 60, 14)),
  'utb.lärartäthet': all(teacher(24, 0.7), ...[0, 1, 2].map((i) => kid(44 + i * 12, C.orange, 'smile', 0.36)), line('M80 30 L80 112', C.grey2, 1.4), greyed(fig(92, TEACH, 'calm', { h: 0.6, hairStyle: 'long' }), ...Array.from({ length: 12 }, (_, i) => mini(84 + (i % 4) * 9, 34 + Math.floor(i / 4) * 14, C.grey, 'flat', 0.45, true))), T(44, 26, '1:3', 12, HL), ground),
  'utb.kunskapsmätning': all(...[[flagSE, 8], [flagFI, 44], [flagJP, 80]].map(([f, x]) => all((f as typeof flagSE)(x as number, 6, 1), test((x as number) + 10, 42, 0.6, ['ok', 'ok', '']))), bars(26, 108, [26, 34, 40], 14, ['#5aa7e8', '#7ac06a', '#e85a5a']), mag(98, 92, 1.1)),
  'utb.rankning': all(podium(60, 112, [flagJP(50, 70, 1), flagFI(30, 80, 1), flagSE(70, 86, 1)]), star(60, 50, 6, C.gold), uni(18, 46, 0.4), uni(102, 46, 0.4)),
  'utb.skolresultat': all(report(32, 60, 1.5, ['C', 'B', 'A']), bars(64, 104, [16, 26, 38, 48], 9, ['#7ac06a']), curveArrow('M62 70 C78 58 92 44 108 34', 108, 34, -40, HL, 2.2), ground),
  'utb.utbildningsnivå': all(line('M10 104 L110 104 M10 104 L10 14', C.ink, 1.4), path('M12 96 C40 92 70 60 108 30', 'none', HL, 2.6), num(20, 112, '1950', 6), num(100, 112, '2025', 6), ...[[22, 92, 1], [56, 74, 2], [92, 44, 4]].map(([x, y, n]) => all(...Array.from({ length: n! }, (_, i) => mcap(x! + i * 6 - (n! - 1) * 3, y! - 8, 0.45))))),

  // ── Studera utomlands ──
  'utb.utlandsstudent': all(pole(100, 112, 80, flagUS, 0.9), uni(84, 108, 0.7), studentF(34, C.orange, 'laugh', { h: 0.85 }), suitcase(54, 110, 0.8), think(34, 0.85, -1, 20, 14, (cx, cy) => flagSE(cx - 7, cy - 4.5, 0.7)), plane(70, 16, 0.8, -15), ground),
  'utb.utlandsvistelse': all(months([null, '#8cc7e8', '#8cc7e8', '#8cc7e8', '#8cc7e8', '#8cc7e8', '#8cc7e8', '#8cc7e8', null, null, null, null], 4), rect(14, 1, 64, 20, 'none', 3, HL, 2.2), globe(34, 52, 18), suitcase(34, 104, 1.1), plane(88, 54, 0.9, -10), house(98, 100, 0.9)),
  'utb.studieavgift': all(uni(40, 78, 1.1), pole(14, 112, 74, flagUS, 0.8), coin(84, 60, 6), coin(96, 56, 6), coin(90, 70, 6), studentF(98, C.orange, 'calm', { h: 0.78 }), reach(98, 0.78, -1, 84, 74), curveArrow('M78 56 C70 46 66 46 62 52', 62, 52, 120, HL, 2), ground),
  'utb.studievisum': all(visaPage(60, 54, 2), stamp(80, 44, 1.6, '#2a6ebb'), g('translate(80 70)', mcap(0, 0, 0.7)), plane(30, 86, 0.6, -15)),
  'utb.språkkrav': all(door(80, 112, 26, 60, C.brown), padlock(80, 70, 0.9), bars(14, 108, [10, 20, 30, 40], 8, ['#e3e6ea', '#e3e6ea', '#7ac06a', '#7ac06a']), line('M10 78 L58 78', RED, 1.8, '4 3'), say(36, 26, 30, 18, 52, 40, glyphs(28, 30, ['A', 'b'], 9)), ground),
  'utb.språktest': all(desk(56, 84, 60), mini(56, 72, C.purple, 'flat', 1.1, false, true), headset(56, 62, 1), test(28, 60, 0.75, ['ok', 'ok', '']), say(92, 30, 30, 20, 70, 56, glyphs(84, 34, ['A', 'b'], 9)), clock(16, 20, 9, 2, 0)),
  'utb.erkänna.2': all(cert(40, 46, 1.6, mcap(0, 0, 0.6)), flagIN(8, 4, 0.9), arrow(72, 46, 92, 46, HL, 2.6), flagSE(92, 16, 1), stamp(100, 56, 1.6, C.green), check(100, 56, 0.8), office(40, 90, 0.5)),
  'utb.språkbarriär': all(wall(54, 30, 12, 82), fig(18, C.orange, 'frown', { h: 0.9 }), fig(102, C.green, 'frown', { h: 0.9, hairStyle: 'long' }), sb(18, 0.9, 1, 20, 16, (cx, cy) => glyphs(cx - 4, cy + 3, ['A', 'ä'], 8)), sb(102, 0.9, -1, 20, 16, (cx, cy) => glyphs(cx - 4, cy + 3, ['あ', 'い'], 8)), q(60, 16, 14, RED), ground),
  'utb.kulturchock': all(fig(60, C.orange, 'shock', { h: 0.9 }), path('M48 18 C52 12 56 22 60 16 C64 10 68 20 72 14', 'none', HL, 2), g('translate(18 40)', rect(-10, -10, 20, 26, '#e85a5a', 2, C.ink, 1.1), T(0, 2, '寿', 12, C.white), T(0, 13, '司', 9, C.white)), g('translate(102 50)', line('M-8 -12 L6 10 M-4 -12 L10 10', C.brown, 2)), suitcase(30, 108, 0.8), g('translate(96 92)', ellipse(0, 0, 12, 4, C.white, C.ink, 1.1), path('M-8 -1 C-8 -8 8 -8 8 -1 Z', '#e8d8b8', C.ink, 1)), ...[[36, 70], [86, 26]].map(([x, y]) => q(x!, y!, 12, C.navy)), ground),
  'utb.vidga-sina-vyer': all(path('M40 50 L116 14 L116 96 Z', 'rgba(242,193,78,0.35)', null), line('M40 50 L116 14 M40 50 L116 96', C.gold, 1.4, '3 3'), globe(92, 54, 16), plane(98, 24, 0.5, -15), mountainS(108, 88), fig(26, C.purple, 'laugh', { h: 0.9, hairStyle: 'long' }), greyed(path('M40 50 L60 44 L60 56 Z', C.grey2, null)), ground),
};
