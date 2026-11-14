/**
 * Historia & humaniora → Arkeologi & kulturarv → Arkeologins metoder, 2301–2307 (0.40): excavations, stratigraphy and
 * soil layers, finds and find spots, dating, field documentation, laboratory analyses and interpreting material traces.
 * Recurring signs: the archaeologist in a khaki shirt and a sun hat, brown soil cut open as a profile (green turf on top,
 * dark culture layer, yellow natural sand at the bottom), a silver trowel, a soft brush, finds in warm clay colours,
 * silver coins, the lab in pale blue with white coats. Abstract words are small symbolic scenes: the coloured idea
 * dominates and a grey copy stands beside it as contrast where that helps. Digits, ? and ! only; no words, no letters,
 * no brands and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { type Build } from './figures';
import { T, arm, cloud } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const PAPER = '#f6f2ea';
const SKY = '#d6ecf7';
const LAB = '#e8f1f6';
const GRASS = '#8cc96a';
const TURF = '#6fae55';
const TOPSOIL = '#5b4632';
const SOIL = '#8a6040';
const SOIL2 = '#a87a52';
const CULT = '#3e3430';
const SAND = '#e6c987';
const CLAY = '#c4703e';
const PEAT = '#4a3826';
const CHAR = '#2b2626';
const WOOD = '#a0673d';
const STONE = '#a29c92';
const SILVER = '#cfd5db';
const BRONZE = '#c98b3a';
const KHAKI = '#d8c8a0';
const OLIVE = '#6a7a5a';
const COAT = '#f4f6f8';
const GREY = '#8d949c';
const OK = '#3f9a5a';
const GOLD = C.gold;
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (x: number, y: number, r: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${r}) scale(${s})`, ...k);

// ── Figures ──────────────────────────────────────────────────────────
const ground = line('M4 112 L116 112', C.grey2, 2);
const bg = (col: string = PAPER) => rect(4, 4, 112, 108, col, 3, null);
const geo = (x: number, h = 1, y0 = 112) => { const s = 0.84 * h, ty = y0 - 49 * s; return { s, ty, hy: ty - 56 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
/** A standing figure; feet at y0 (default the ground). */
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}, y0 = 112) =>
  y0 === 112 ? F({ x, top, mood, ...more }) : g(`translate(0 ${f1(y0 - 112)})`, F({ x, top, mood, ...more }));
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number, y0 = 112) => { const q = geo(x, h, y0); return all(arm(f1(side < 0 ? q.sl : q.sr), f1(q.sy), tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };
/** A sun hat on the figure at x. */
const hat = (x: number, h = 1, y0 = 112) => { const q = geo(x, h, y0), s = q.s, y = q.hy - 7 * s; return all(ellipse(x, f1(y), f1(15 * s), f1(3.4 * s), '#e8d9a8', C.ink, 1.1), path(`M${f1(x - 8 * s)} ${f1(y)} C${f1(x - 8 * s)} ${f1(y - 11 * s)} ${f1(x + 8 * s)} ${f1(y - 11 * s)} ${f1(x + 8 * s)} ${f1(y)} Z`, '#e8d9a8', C.ink, 1.1), line(`M${f1(x - 8 * s)} ${f1(y - 2 * s)} L${f1(x + 8 * s)} ${f1(y - 2 * s)}`, '#a0673d', 1.4)); };
/** The archaeologist: khaki shirt, olive trousers, sun hat. */
const arch = (x: number, h = 1, mood: Mood = 'smile', y0 = 112, more: Partial<Build> = {}) => all(fig(x, KHAKI, mood, { h, bottom: OLIVE, ...more }, y0), hat(x, h, y0));
/** A researcher in a white lab coat. */
const labCoat = (x: number, h = 1, mood: Mood = 'calm', y0 = 112, more: Partial<Build> = {}) => { const q = geo(x, h, y0); return all(fig(x, COAT, mood, { h, bottom: C.navy, ...more }, y0), line(`M${x} ${f1(q.sy - 2 * q.s)} L${x} ${f1(q.ty)}`, C.grey, 1.2)); };
/** A person from the past: brown wool tunic. */
const ancient = (x: number, h = 1, mood: Mood = 'calm', y0 = 112, more: Partial<Build> = {}) => fig(x, '#9a6a3e', mood, { h, bottom: '#6b4a2b', ...more }, y0);
/** A forearm coming in from the edge, fist at (x2, y2). */
const forearm = (x1: number, y1: number, x2: number, y2: number, col: string = C.skin) => all(line(`M${x1} ${y1} L${x2} ${y2}`, C.ink, 10), line(`M${x1} ${y1} L${x2} ${y2}`, col, 7.6), circle(x2, y2, 5.4, col, C.ink, 1.3));
const motion = (x: number, y: number, dir = -1) => line(`M${x} ${y} l${dir * 6} 0 M${x} ${y + 5} l${dir * 9} 0 M${x} ${y + 10} l${dir * 6} 0`, GREY, 1.4);

// ── Signs ────────────────────────────────────────────────────────────
const qm = (x: number, y: number, size = 14, col: string = C.accent) => T(x, y, '?', size, col);
const ex = (x: number, y: number, size = 14, col: string = C.red) => T(x, y, '!', size, col);
const check = (x: number, y: number, s = 1, col: string = OK) => at(x, y, s, circle(0, 0, 8, C.white, col, 1.6), line('M-4 0 L-1 3 L4 -3', col, 2.2));
const cross = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, circle(0, 0, 8, C.white, col, 1.6), line('M-3.5 -3.5 L3.5 3.5 M3.5 -3.5 L-3.5 3.5', col, 2.2));
const think = (x: number, y: number, rx: number, ry: number, inner: Svg, tx: number, ty: number) => { const dx = x - tx, dy = y + ry * 0.6 - ty; return all(
  circle(f1(tx + dx * 0.2), f1(ty + dy * 0.2), 2, C.white, C.ink, 1.1), circle(f1(tx + dx * 0.42), f1(ty + dy * 0.42), 3, C.white, C.ink, 1.2), ellipse(x, y, rx, ry, C.white, C.ink, 1.5), inner); };
const say = (x: number, y: number, w: number, h: number, inner: Svg, tx: number, ty: number) => all(
  path(`M${f1(x - 4)} ${f1(y + h / 2 - 1)} L${tx} ${ty} L${f1(x + 4)} ${f1(y + h / 2 - 1)} Z`, C.white, C.ink, 1.4), rect(x - w / 2, y - h / 2, w, h, C.white, 6, C.ink, 1.6), line(`M${f1(x - 3.4)} ${f1(y + h / 2)} L${f1(x + 3.4)} ${f1(y + h / 2)}`, C.white, 2.4), inner);
const glow = (x: number, y: number, r: number, col = 'rgba(242,193,78,0.35)') => circle(x, y, r, col, null);
const dashed = (d: string, col: string = GREY, sw = 1.4) => line(d, col, sw, '3 2');
const hourglass = (x: number, y: number, s = 1) => at(x, y, s, rect(-9, -15, 18, 3, WOOD, 1, C.ink, 1.1), rect(-9, 12, 18, 3, WOOD, 1, C.ink, 1.1), path('M-7 -12 L7 -12 L1 0 L7 12 L-7 12 L-1 0 Z', '#e9f3f8', C.ink, 1.2), path('M-4 -8 L4 -8 L0.6 -1 L-0.6 -1 Z', SAND, null), path('M-6 12 L6 12 L0 6 Z', SAND, null));

// ── Things ───────────────────────────────────────────────────────────
/** A trowel: diamond blade, handle up-right. rot in degrees, tip at (x, y). */
const trowel = (x: number, y: number, s = 1, r = 0) => rot(x, y, r, s, path('M0 0 L-5 -12 L0 -18 L5 -12 Z', SILVER, C.ink, 1.2), line('M0 -18 L0 -23', C.ink, 1.6), rect(-2.2, -33, 4.4, 11, WOOD, 2, C.ink, 1.1));
/** A soft brush, bristles at (x, y). */
const brush = (x: number, y: number, s = 1, r = 0) => rot(x, y, r, s, path('M-4 0 L4 0 L3 -7 L-3 -7 Z', '#e8d9a8', C.ink, 1), rect(-3.4, -10, 6.8, 3.6, SILVER, 0.6, C.ink, 0.9), rect(-1.8, -26, 3.6, 16, '#c0563d', 1.6, C.ink, 1));
const spade = (x: number, y: number, s = 1, r = 0) => rot(x, y, r, s, path('M-6 0 L6 0 L6 -12 L-6 -12 Z', SILVER, C.ink, 1.2), line('M0 -12 L0 -40', WOOD, 3), line('M-4 -40 L4 -40', WOOD, 3));
const bucket = (x: number, y: number, s = 1, col: string = C.orange) => at(x, y, s, path('M-9 -12 L9 -12 L7 0 L-7 0 Z', col, C.ink, 1.3), path('M-9 -12 C-9 -22 9 -22 9 -12', 'none', C.ink, 1.2));
const shard = (x: number, y: number, s = 1, r = 0, col: string = CLAY) => rot(x, y, r, s, path('M-7 -3 L3 -6 L8 1 L1 6 L-6 3 Z', col, C.ink, 1.1), line('M-4 -1 L4 -3', '#8a4a24', 0.9));
const bone = (x: number, y: number, s = 1, r = 0, col = '#efe6d2') => rot(x, y, r, s, rect(-9, -1.8, 18, 3.6, col, 1, C.ink, 1), circle(-10, -2, 2.4, col, C.ink, 1), circle(-10, 2, 2.4, col, C.ink, 1), circle(10, -2, 2.4, col, C.ink, 1), circle(10, 2, 2.4, col, C.ink, 1), rect(-8, -1, 16, 2, col, 0.5, null));
const skull = (x: number, y: number, s = 1, col = '#efe6d2') => at(x, y, s, path('M-8 2 C-10 -10 10 -10 8 2 L6 6 L-6 6 Z', col, C.ink, 1.1), circle(-3.2, -1, 2, C.dark, null), circle(3.2, -1, 2, C.dark, null), line('M-3 6 L-3 8 M0 6 L0 8 M3 6 L3 8', C.ink, 0.9));
const coin = (x: number, y: number, r = 4, col: string = SILVER) => all(circle(x, y, r, col, C.ink, 1), circle(x, y, f1(r * 0.55), 'none', '#8d949c', 0.8));
const bead = (x: number, y: number, col: string = C.denim) => circle(x, y, 2, col, C.ink, 0.8);
/** A clay pot, base at (x, y). */
const pot = (x: number, y: number, s = 1, col: string = CLAY) => at(x, y, s, path('M-8 0 C-14 -6 -14 -16 -7 -20 L-6 -24 L6 -24 L7 -20 C14 -16 14 -6 8 0 Z', col, C.ink, 1.3), line('M-10 -14 L10 -14', '#8a4a24', 1));
const axeStone = (x: number, y: number, s = 1, col: string = STONE) => at(x, y, s, path('M-10 -4 C-6 -8 6 -7 10 -3 C12 0 12 3 9 5 C4 7 -6 6 -10 3 Z', col, C.ink, 1.2));
const axeBronze = (x: number, y: number, s = 1, col: string = BRONZE) => at(x, y, s, path('M-12 -2 L4 -4 C8 -8 12 -6 12 0 C12 6 8 8 4 4 L-12 2 Z', col, C.ink, 1.2));
const lens = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 7, 'rgba(200,230,250,0.55)', C.ink, 1.6), line('M5 5 L12 12', C.ink, 3));
const paper = (x: number, y: number, w: number, h: number, col: string = C.white, lines = true) => all(rect(x, y, w, h, col, 1.5, C.ink, 1.2),
  lines ? line(Array.from({ length: Math.max(0, Math.floor((h - 6) / 5)) }, (_, i) => `M${x + 3} ${y + 5 + i * 5} L${x + w - 3} ${y + 5 + i * 5}`).join(' '), '#b8bfc6', 0.9) : '');
const camera = (x: number, y: number, s = 1) => at(x, y, s, rect(-11, -7, 22, 15, C.dark, 2.5, C.ink, 1.2), rect(-5, -10, 8, 4, C.dark, 1, C.ink, 1), circle(1, 0.5, 5, '#5a7fa8', C.ink, 1.2), circle(1, 0.5, 2.2, '#22344a', null), rect(-9, -5, 3, 2, C.yellow, 0.5, null));
const scaleBar = (x: number, y: number, len: number, n = 4, vertical = false) => all(...Array.from({ length: n }, (_, i) => vertical
  ? rect(x - 2, y + (i * len) / n, 4, len / n, i % 2 ? C.white : C.red, 0, C.ink, 0.9)
  : rect(x + (i * len) / n, y - 2, len / n, 4, i % 2 ? C.white : C.red, 0, C.ink, 0.9)));
const tripodTS = (x: number, y: number, s = 1) => at(x, y, s, line('M0 -30 L-12 0 M0 -30 L12 0 M0 -30 L0 0', WOOD, 2.2), rect(-6, -34, 12, 4, C.dark, 1, C.ink, 1), rect(-5, -48, 10, 14, C.yellow, 2, C.ink, 1.2), rect(-3, -45, 6, 5, '#bfe3f5', 1, C.ink, 0.8), circle(0, -51, 3.4, C.dark, C.ink, 1), rect(3, -54, 9, 5, C.dark, 1, C.ink, 1));
const pole = (x: number, y: number, h = 34) => all(line(`M${x} ${y} L${x} ${y - h}`, C.red, 2.4), line(`M${x} ${y - h * 0.3} L${x} ${y - h * 0.55}`, C.white, 2.4), circle(x, y - h - 3, 3.4, '#bfe3f5', C.ink, 1));
const bag = (x: number, y: number, s = 1, inner: Svg = '') => at(x, y, s, rect(-10, -13, 20, 26, 'rgba(230,240,248,0.8)', 2, C.ink, 1.3), line('M-10 -9 L10 -9', C.red, 1.6), inner, rect(-7, 4, 14, 7, C.white, 1, C.ink, 0.9));
const laptop = (x: number, y: number, s = 1, inner: Svg = '') => at(x, y, s, rect(-20, -28, 40, 26, C.dark, 2, C.ink, 1.3), rect(-17, -25, 34, 20, '#eaf4fb', 1, null), inner, path('M-24 0 L24 0 L20 -2 L-20 -2 Z', GREY, C.ink, 1.1));
const microscope = (x: number, y: number, s = 1) => at(x, y, s, rect(-12, -3, 24, 3, C.dark, 1, C.ink, 1.1), path('M4 -3 C10 -10 10 -22 2 -28', 'none', C.dark, 3.4), rect(-8, -14, 14, 3, GREY, 0.5, C.ink, 1), rot(-2, -24, -25, 1, rect(-2.4, -10, 4.8, 18, C.white, 1.5, C.ink, 1.1)));
const tube = (x: number, y: number, s = 1, col: string = SOIL) => at(x, y, s, path('M-3.5 -14 L3.5 -14 L3.5 6 C3.5 10 -3.5 10 -3.5 6 Z', 'rgba(230,240,248,0.85)', C.ink, 1.1), path('M-3.5 0 L3.5 0 L3.5 6 C3.5 10 -3.5 10 -3.5 6 Z', col, null), rect(-4.5, -17, 9, 4, C.red, 1, C.ink, 0.9));
const helix = (x: number, y: number, h: number, c1: string = C.denim, c2: string = C.red) => { const n = 4, st = h / n; const a = Array.from({ length: n }, (_, i) => y + i * st); return all(
  ...a.map((yy) => line(`M${x - 7} ${f1(yy + st * 0.25)} L${x + 7} ${f1(yy + st * 0.25)} M${x - 7} ${f1(yy + st * 0.75)} L${x + 7} ${f1(yy + st * 0.75)}`, '#b8bfc6', 1.4)),
  path(a.map((yy, i) => `${i ? '' : `M${x - 8} ${f1(yy)} `}C${x - 8} ${f1(yy + st * 0.3)} ${x + 8} ${f1(yy + st * 0.2)} ${x + 8} ${f1(yy + st * 0.5)} C${x + 8} ${f1(yy + st * 0.8)} ${x - 8} ${f1(yy + st * 0.7)} ${x - 8} ${f1(yy + st)}`).join(' '), 'none', c1, 2.2),
  path(a.map((yy, i) => `${i ? '' : `M${x + 8} ${f1(yy)} `}C${x + 8} ${f1(yy + st * 0.3)} ${x - 8} ${f1(yy + st * 0.2)} ${x - 8} ${f1(yy + st * 0.5)} C${x - 8} ${f1(yy + st * 0.8)} ${x + 8} ${f1(yy + st * 0.7)} ${x + 8} ${f1(yy + st)}`).join(' '), 'none', c2, 2.2)); };
const pollenG = (x: number, y: number, r: number, col: string = C.yellow, kind = 0) => all(circle(x, y, r, col, C.ink, 1),
  kind === 0 ? all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return circle(f1(x + Math.cos(a) * r * 0.7), f1(y + Math.sin(a) * r * 0.7), f1(r * 0.12), '#c99a2a', null); }))
  : kind === 1 ? all(ellipse(x - r * 0.9, y, r * 0.5, r * 0.8, col, C.ink, 0.9), ellipse(x + r * 0.9, y, r * 0.5, r * 0.8, col, C.ink, 0.9))
  : line(`M${x - r * 0.5} ${y} L${x + r * 0.5} ${y} M${x} ${y - r * 0.5} L${x} ${y + r * 0.5}`, '#c99a2a', 1));
const seed = (x: number, y: number, s = 1, col = '#d9b25a', r = 0) => rot(x, y, r, s, ellipse(0, 0, 4, 2.4, col, C.ink, 0.9), line('M-2.5 0 L2.5 0', 'rgba(0,0,0,0.3)', 0.7));
const rings = (x: number, y: number, r: number, widths: number[], col = '#e9c98f') => { let rr = r; const out: Svg[] = [circle(x, y, r, col, '#7a4a24', 2.4)]; for (const w of widths) { rr -= w; if (rr > 1) out.push(circle(x, y, f1(rr), 'none', '#a8784a', 1)); } return all(...out, circle(x, y, 1.6, '#7a4a24', null)); };
const lawBook = (x: number, y: number, s = 1, col = '#7a3b3b') => at(x, y, s, rect(-10, -13, 20, 26, col, 2, C.ink, 1.3), line('M-7 -13 L-7 13', 'rgba(0,0,0,0.25)', 1.4), rect(-3, -6, 10, 7, GOLD, 1, null));
const shieldS = (x: number, y: number, s = 1, col: string = C.navy, inner: Svg = '') => at(x, y, s, path('M0 -16 L14 -11 C14 4 8 12 0 17 C-8 12 -14 4 -14 -11 Z', col, C.ink, 1.6), inner);
const govB = (x: number, y: number, s = 1, col: string = '#d8cfb8') => at(x, y, s,
  rect(-22, -6, 44, 6, col, 0.5, C.ink, 1.3), ...[-16, -8, 0, 8, 16].map((d) => rect(d - 2.5, -30, 5, 24, col, 0.5, C.ink, 1.1)),
  rect(-22, -34, 44, 4, col, 0.5, C.ink, 1.2), path('M-24 -34 L0 -46 L24 -34 Z', col, C.ink, 1.3));
const banknote = (x: number, y: number, s = 1) => at(x, y, s, rect(-11, -6, 22, 12, '#9fd3a8', 1.5, C.ink, 1.1), circle(0, 0, 3.4, '#6ab07a', C.ink, 0.8));
const longhouse = (x: number, y: number, s = 1) => at(x, y, s, rect(-30, -14, 60, 14, '#c9a06a', 1, C.ink, 1.3), path('M-34 -14 C-30 -30 30 -30 34 -14 Z', '#d2ac5e', C.ink, 1.3), rect(-3, -10, 6, 10, '#6b4a2b', 1, C.ink, 1));
const runestone = (x: number, y: number, s = 1) => at(x, y, s, path('M-9 0 L-11 -26 C-10 -36 10 -36 11 -26 L9 0 Z', STONE, C.ink, 1.3), path('M-6 -4 C-8 -18 -6 -28 0 -30 C6 -28 8 -18 6 -4', 'none', C.red, 2));
const excavator = (x: number, y: number, s = 1, armUp = false) => at(x, y, s,
  rect(-26, -8, 34, 8, C.dark, 4, C.ink, 1.3), ...[-21, -12, -3, 4].map((d) => circle(d, -4, 2.4, GREY, C.ink, 0.8)),
  rect(-24, -24, 30, 16, C.yellow, 2, C.ink, 1.4), rect(-22, -38, 14, 14, C.yellow, 2, C.ink, 1.4), rect(-20, -35, 10, 9, '#bfe3f5', 1, C.ink, 1),
  armUp ? all(path('M4 -20 L22 -42 L26 -38 L8 -16 Z', C.yellow, C.ink, 1.3), path('M22 -42 L38 -30 L34 -26 L20 -36 Z', C.yellow, C.ink, 1.3), path('M34 -30 L44 -24 L40 -14 L30 -20 Z', C.dark, C.ink, 1.2))
    : all(path('M4 -20 L24 -38 L28 -34 L8 -16 Z', C.yellow, C.ink, 1.3), path('M24 -38 L36 -10 L31 -9 L21 -34 Z', C.yellow, C.ink, 1.3), path('M30 -12 L42 -6 L40 4 L28 0 Z', C.dark, C.ink, 1.2)));
/** A profile wall: stacked horizontal layers between y0 and y1, with colours and boundaries (y values). */
const profile = (x: number, y: number, w: number, layers: [string, number][]) => { let yy = y; const out: Svg[] = []; for (const [col, h] of layers) { out.push(rect(x, yy, w, h, col, 0, C.ink, 1.1)); yy += h; } return all(...out); };
const turfTop = (x: number, y: number, w: number) => all(rect(x, y - 3, w, 4, TURF, 0, C.ink, 1), line(Array.from({ length: Math.floor(w / 6) }, (_, i) => `M${x + 3 + i * 6} ${y - 3} l-1 -3 M${x + 5 + i * 6} ${y - 3} l1 -3`).join(' '), TURF, 1.2));
const pegs = (pts: [number, number][]) => all(...pts.map(([px, py]) => all(line(`M${px} ${py} L${px} ${py - 6}`, WOOD, 1.8), circle(px, py - 6, 1.4, C.red, null))));

export const ARCHAEOLOGY_METHOD_MOTIFS: Record<string, Svg> = {
  // ── 2301 Utgrävningar ──
  /** arkeologi: the science of the past – an archaeologist studies a pot through a magnifier; below, the ground hides shards, bones and an old wall. */
  'arkm.arkeologi': all(bg(SKY), rect(4, 80, 112, 32, SOIL, 0, null), turfTop(4, 80, 112), shard(22, 94, 1), bone(52, 100, 0.9, 10), skull(92, 96, 1), rect(70, 100, 10, 6, STONE, 1, C.ink, 1), rect(80, 102, 10, 6, STONE, 1, C.ink, 1),
    arch(36, 0.62, 'smile', 77), reach(36, 0.62, 1, 58, 50, 77), rect(62, 60, 20, 4, WOOD, 1, C.ink, 1.1), line('M72 64 L72 80', WOOD, 2.4), pot(72, 60, 0.95), lens(62, 46, 1.1), reach(36, 0.62, -1, 20, 58, 77), trowel(20, 60, 0.7, 180)),
  /** arkeologisk: a find handled the archaeologist's way – on a tray with tag, trowel and brush; grey: the same pot on an ordinary kitchen shelf. */
  'arkm.arkeologisk': all(bg(), rect(10, 70, 64, 10, '#c9a37a', 2, C.ink, 1.3), pot(34, 70, 1.1), rect(50, 56, 16, 10, C.white, 1, C.ink, 1), T(58, 64, '12', 7, C.ink), line('M50 61 L44 58', C.ink, 0.8),
    trowel(18, 90, 0.9, -60), brush(62, 98, 0.9, 60), lens(66, 28, 1.2), dashed('M10 84 L74 84', SOIL2, 1),
    greyed(rect(84, 60, 30, 3, WOOD, 0.5, C.ink, 1), pot(92, 60, 0.6), rect(102, 50, 8, 10, C.white, 1, C.ink, 1), rect(84, 86, 30, 3, WOOD, 0.5, C.ink, 1), line('M86 63 L86 110 M112 63 L112 110', WOOD, 2)), ground),
  /** gräva ut: the soil is carried away bucket by bucket, and the stone foundation of a whole house comes out; the left part is still covered. */
  'arkm.gräva-ut': all(bg(SKY), rect(4, 66, 112, 46, SOIL, 0, null), turfTop(4, 66, 40), path('M44 66 L116 66 L116 112 L44 112 Z', SOIL2, null),
    rect(50, 88, 60, 18, '#d9c08f', 0, C.ink, 1.1), ...[52, 60, 68, 76, 84, 92, 100].map((x) => rect(x, 84, 7, 5, STONE, 1, C.ink, 0.9)), ...[52, 60, 68, 76, 84, 92, 100].map((x) => rect(x, 104, 7, 5, STONE, 1, C.ink, 0.9)),
    rect(4, 66, 46, 46, SOIL, 0, null), path('M50 66 L46 76 L52 88 L46 100 L50 112', 'none', C.ink, 1.2),
    arch(78, 0.6, 'calm', 92), reach(78, 0.6, 1, 92, 70, 92), spade(98, 92, 0.7, 20), arrow(30, 48, 30, 30, C.accent, 2.4), bucket(30, 62, 0.9), path('M22 54 C26 50 34 50 38 54 Z', SOIL, C.ink, 1),
    arch(16, 0.52, 'smile', 66), reach(16, 0.52, 1, 30, 46, 66)),
  /** schakt: a long, straight trench cut through a green field, with the excavator at its end. */
  'arkm.schakt': all(bg(SKY), path('M4 56 L116 56 L116 112 L4 112 Z', GRASS, null), path('M10 64 C30 56 60 56 84 62 L84 70 L10 70 Z', SOIL2, C.ink, 1.2),
    path('M12 76 L86 76 L80 96 L4 96 Z', '#4a3a30', C.ink, 1.4), path('M12 76 L86 76 L84 82 L10 82 Z', TOPSOIL, null), path('M10 82 L84 82 L80 96 L4 96 Z', SOIL, null), line('M12 76 L86 76 L80 96 L4 96 Z', C.ink, 1.4),
    line('M18 104 L76 104', C.accent, 1.6), arrow(70, 104, 80, 104, C.accent, 1.6), arrow(24, 104, 12, 104, C.accent, 1.6), excavator(92, 82, 0.5, false), ground),
  /** grävmaskin: a big yellow excavator digs its bucket into the ground. */
  'arkm.grävmaskin': all(bg(SKY), rect(4, 96, 112, 16, SOIL, 0, null), turfTop(4, 96, 70), path('M74 96 C80 104 100 104 106 96 L116 96 L116 112 L74 112 Z', '#6a4a30', null), excavator(46, 96, 1.2), path('M8 96 C12 84 26 84 30 96 Z', SOIL2, C.ink, 1.2), ground),
  /** murslev: a hand holds the trowel and scrapes a thin curl of soil off the floor of the trench. */
  'arkm.murslev': all(bg(), rect(4, 70, 112, 42, SOIL2, 0, null), line('M4 70 L116 70', C.ink, 1.2), path('M40 92 C50 86 62 86 70 90', 'none', '#6a4a30', 3), circle(78, 98, 1.6, '#6a4a30', null), circle(84, 94, 1.2, '#6a4a30', null),
    trowel(66, 94, 1.6, 50), forearm(116, 34, 100, 65), shard(30, 104, 1.1, 20)),
  /** pensel: a soft brush sweeps the last soil off a buried pot; little specks of dust fly. */
  'arkm.pensel': all(bg(), rect(4, 66, 112, 46, SOIL2, 0, null), line('M4 66 L116 66', C.ink, 1.2), at(54, 104, 1.6, path('M-8 0 C-14 -6 -14 -16 -7 -20 L-6 -24 L6 -24 L7 -20 C14 -16 14 -6 8 0 Z', CLAY, C.ink, 1), line('M-10 -14 L10 -14', '#8a4a24', 0.8)), path('M30 104 C34 96 40 94 44 98 L44 112 L30 112 Z', SOIL2, null),
    brush(78, 70, 2.2, 50), ...[[88, 60], [94, 66], [92, 54], [100, 60]].map(([x, y]) => circle(x!, y!, 1.3, SOIL, null)), motion(96, 78, 1), forearm(116, 22, 108, 45)),
  /** såll: a wooden sieve frame on legs; soil has fallen through the mesh and a bead and a coin stay on top. */
  'arkm.såll': all(bg(), path('M18 46 L102 46 L94 66 L26 66 Z', '#c9a06a', C.ink, 1.6), path('M24 50 L96 50 L90 62 L30 62 Z', '#f0e6d2', C.ink, 1),
    line('M34 50 L36 62 M46 50 L46 62 M58 50 L58 62 M70 50 L70 62 M82 50 L80 62 M28 54 L94 54 M30 58 L92 58', GREY, 0.8), bead(48, 56, C.denim), coin(70, 56, 3.6), shard(58, 57, 0.6),
    line('M26 66 L20 112 M94 66 L100 112', WOOD, 3), path('M38 112 C40 96 80 96 82 112 Z', SOIL, C.ink, 1.2), ...[44, 52, 60, 68, 76].map((x, i) => circle(x, 74 + (i % 2) * 8, 1.5, SOIL, null)), ground),
  /** sålla: a woman shakes the sieve back and forth so the soil falls through; a coin stays in the mesh. */
  'arkm.sålla': all(bg(), arch(60, 0.84, 'calm'), rect(24, 56, 72, 10, '#c9a06a', 2, C.ink, 1.4), line('M30 61 L90 61', GREY, 0.9), coin(66, 57, 3), reach(60, 0.84, -1, 28, 60), reach(60, 0.84, 1, 92, 60),
    motion(18, 54, -1), motion(102, 54, 1), ...[34, 44, 54, 76, 86].map((x, i) => circle(x, 74 + (i % 3) * 7, 1.6, SOIL, null)), path('M30 112 C34 100 86 100 90 112 Z', SOIL, C.ink, 1.2), ground),
  /** frilägga: a skeleton seen from above comes out of the soil – the head end is free, the feet are still covered; trowel and brush at work. */
  'arkm.frilägga': all(bg(), rect(8, 14, 104, 94, SOIL2, 2, C.ink, 1.3), path('M18 30 L94 30 L94 92 L18 92 Z', '#d9c08f', C.ink, 1.1),
    skull(30, 61, 1.3), line('M40 61 L76 61', '#efe6d2', 3.4), ...[44, 50, 56, 62].map((x) => path(`M${x} 52 C${x + 2} 56 ${x + 2} 66 ${x} 70`, 'none', '#efe6d2', 2)), line('M44 52 L70 46 M44 70 L70 76', '#efe6d2', 2.4), line('M76 61 L96 54 M76 61 L96 68', '#efe6d2', 2.6),
    path('M78 30 L112 30 L112 92 L78 92 C70 80 74 70 70 60 C74 50 70 40 78 30 Z', SOIL2, C.ink, 1.2), ...[[88, 44], [98, 70], [92, 84]].map(([x, y]) => circle(x!, y!, 1.6, SOIL, null)),
    trowel(76, 46, 1.2, 40), brush(60, 86, 1.2, -30)),
  /** uppdragsarkeologi: archaeologists dig first; behind them the builder in a helmet waits with the planned houses, and the money goes from him to the dig. */
  'arkm.uppdragsarkeologi': all(bg(SKY), rect(4, 90, 112, 22, SOIL, 0, null), turfTop(4, 90, 112), rect(14, 96, 50, 12, '#6a4a30', 0, C.ink, 1),
    dashed('M66 60 L66 40 L78 30 L90 40 L90 60 Z', C.navy, 1.6), dashed('M92 60 L92 44 L102 36 L112 44 L112 60 Z', C.navy, 1.6),
    arch(28, 0.5, 'calm', 106), arch(50, 0.46, 'smile', 106), fig(98, C.orange, 'smile', { h: 0.6 }, 90), path('M90 40 C90 32 106 32 106 40 Z', C.yellow, C.ink, 1.2),
    reach(98, 0.6, -1, 82, 66, 90), at(78, 66, 1, path('M-7 -4 C-11 2 -11 10 0 10 C11 10 11 2 7 -4 Z', GOLD, C.ink, 1.1), path('M-4 -4 L-6 -9 L6 -9 L4 -4 Z', '#c99a2a', C.ink, 1)), arrow(68, 70, 50, 78, OK, 2.2)),

  // ── 2302 Stratigrafi och jordlager ──
  /** stratigrafi: the soil read like a book – a person with a magnifier reads the layers of a profile; numbers mark the order from below. */
  'arkm.stratigrafi': all(bg(), turfTop(8, 20, 72), profile(8, 20, 72, [[TOPSOIL, 18], [CULT, 18], [SOIL2, 18], [SAND, 34]]),
    T(16, 33, '4', 9, C.white), T(16, 51, '3', 9, C.white), T(16, 69, '2', 9, C.ink), T(16, 92, '1', 9, C.ink), arrow(88, 100, 88, 26, C.accent, 2.4),
    shard(52, 46, 0.8), bone(46, 64, 0.6, 15), lens(56, 50, 1.6), arch(104, 0.62), reach(104, 0.62, -1, 72, 62)),
  /** kulturlager: in the profile only the dark layer made by people is coloured – full of ash, charcoal, bones and shards; the layers around it are grey. */
  'arkm.kulturlager': all(bg(), greyed(turfTop(10, 22, 100), profile(10, 22, 100, [[TOPSOIL, 22]]), profile(10, 78, 100, [[SAND, 30]])),
    rect(10, 44, 100, 34, CULT, 0, C.accent, 2.2), ...[[24, 56], [62, 66], [96, 54]].map(([x, y]) => ellipse(x!, y!, 7, 3, GREY, null)), ...[[40, 52], [78, 70], [104, 70]].map(([x, y]) => rect(x! - 2, y! - 2, 4, 4, CHAR, 1, '#000', 0.6)),
    bone(48, 66, 0.8, -10), shard(84, 56, 0.9, 20), shard(20, 70, 0.7, -20), bone(98, 62, 0.5, 30), skull(66, 52, 0.6)),
  /** matjord: only the top layer is coloured – dark loose soil with plants and roots growing in it; the layers below are grey. */
  'arkm.matjord': all(bg(SKY), greyed(profile(10, 60, 100, [[SOIL2, 22], [SAND, 26]])), rect(10, 34, 100, 26, TOPSOIL, 0, C.accent, 2.2),
    ...[22, 46, 70, 94].map((x) => all(line(`M${x} 34 L${x} 20`, C.green, 2), ellipse(x - 5, 22, 5, 2.6, C.green, C.ink, 0.8), ellipse(x + 5, 18, 5, 2.6, C.green, C.ink, 0.8), line(`M${x} 34 L${x - 3} 44 M${x} 34 L${x + 3} 48 M${x} 34 L${x} 52`, '#d9c08f', 1))),
    ...[[34, 44], [58, 52], [84, 42]].map(([x, y]) => path(`M${x} ${y} c3 -2 6 2 9 0`, 'none', C.pink, 2))),
  /** alv: only the bottom layer of untouched yellow sand is coloured; the trowel has reached it and finds nothing more; the layers above are grey. */
  'arkm.alv': all(bg(), greyed(turfTop(10, 18, 100), profile(10, 18, 100, [[TOPSOIL, 20], [CULT, 20]]), shard(40, 48, 0.8), bone(80, 46, 0.6)), rect(10, 58, 100, 50, SAND, 0, C.accent, 2.2),
    ...[[22, 70], [44, 90], [70, 74], [96, 96], [30, 100], [86, 66]].map(([x, y]) => circle(x!, y!, 1.2, '#c9a560', null)), trowel(64, 62, 1.4, -20), cross(92, 82, 1)),
  /** lagerföljd: beside the profile, the layers are drawn as a schema – boxes stacked from 1 at the bottom to 4 at the top. */
  'arkm.lagerföljd': all(bg(), turfTop(8, 16, 46), profile(8, 16, 46, [[TOPSOIL, 20], [CULT, 22], [SOIL2, 22], [SAND, 30]]),
    ...[[TOPSOIL, '4', 22], [CULT, '3', 46], [SOIL2, '2', 70], [SAND, '1', 94]].map(([col, n, y]) => all(rect(76, (y as number) - 8, 28, 16, col as string, 2, C.ink, 1.3), T(90, (y as number) + 4, n as string, 10, (col === SAND || col === SOIL2) ? C.ink : C.white))),
    line('M90 30 L90 38 M90 54 L90 62 M90 78 L90 86', C.ink, 1.6), dashed('M54 26 L74 22 M54 47 L74 46 M54 69 L74 70 M54 94 L74 94', C.accent, 1.2)),
  /** avlagring: a river slowly drops sand and clay on its bottom, layer upon layer. */
  'arkm.avlagring': all(bg(SKY), rect(4, 40, 112, 44, '#9fd2ee', 0, null), line('M4 40 L116 40', '#5aa7d6', 1.6), arrow(16, 52, 44, 52, '#2f7fb5', 2.2), arrow(56, 60, 86, 60, '#2f7fb5', 2.2),
    ...[[30, 62], [42, 68], [64, 70], [76, 74], [92, 66], [52, 76]].map(([x, y]) => circle(x!, y!, 1.6, SOIL2, null)),
    profile(4, 84, 112, [['#d9c08f', 7], ['#b89a6a', 7], [SAND, 7], ['#9a8a70', 7]]), path('M4 80 C30 76 60 84 116 78 L116 84 L4 84 Z', '#e6d3a8', C.ink, 1.1), ground),
  /** profil (2): the straight soil wall at the edge of a trench, seen from the front with all its layers; an archaeologist stands in the trench beside it. */
  'arkm.profil.2': all(bg(SKY), path('M4 30 L116 30 L116 40 L4 40 Z', GRASS, null), profile(14, 40, 92, [[TOPSOIL, 16], [CULT, 14], [SOIL2, 16], [SAND, 18]]), turfTop(14, 40, 92),
    path('M4 40 L14 40 L14 104 L4 112 Z', '#6a4a30', C.ink, 1.2), path('M116 40 L106 40 L106 104 L116 112 Z', '#6a4a30', C.ink, 1.2), path('M14 104 L106 104 L116 112 L4 112 Z', '#b89a6a', C.ink, 1.2),
    arch(90, 0.56, 'smile', 108), reach(90, 0.56, -1, 70, 76, 108), trowel(66, 76, 0.8, -100), shard(36, 76, 0.7)),
  /** nedgrävning: a dark pit cuts down from above through the layers into the yellow sand and is filled with mixed soil. */
  'arkm.nedgrävning': all(bg(), turfTop(8, 20, 104), profile(8, 20, 104, [[TOPSOIL, 20], [SOIL2, 22], [SAND, 46]]),
    path('M40 40 L80 40 C80 70 72 92 60 92 C48 92 40 70 40 40 Z', '#4a3a30', C.accent, 2.4), ...[[52, 54], [66, 62], [58, 76], [70, 48], [48, 68]].map(([x, y]) => circle(x!, y!, 2, (x! + y!) % 2 ? SAND : SOIL2, null)),
    arrow(60, 8, 60, 30, C.accent, 2.4)),
  /** avfallsgrop: a person from long ago throws a bone into a pit already full of bones and broken pots. */
  'arkm.avfallsgrop': all(bg(SKY), rect(4, 80, 112, 32, SOIL2, 0, null), turfTop(4, 80, 112), path('M50 80 L106 80 C104 100 94 108 78 108 C62 108 52 100 50 80 Z', '#4a3a30', C.ink, 1.4),
    bone(66, 90, 0.8, 20), bone(88, 96, 0.7, -30), shard(76, 100, 0.9, 10), shard(94, 86, 0.8, -20), skull(62, 100, 0.55), shard(84, 88, 0.6),
    ancient(26, 0.82, 'calm', 80), reach(26, 0.82, 1, 46, 34, 80), bone(56, 46, 0.7, 40), arrow(58, 54, 70, 74, C.accent, 2), motion(64, 40, 1)),
  /** orörd: undisturbed – straight even layers with a whole pot still in place; grey: the same layers stirred up by a spade, the pot broken. */
  'arkm.orörd': all(bg(), profile(8, 30, 62, [[TOPSOIL, 14], [CULT, 16], [SOIL2, 16], [SAND, 30]]), turfTop(8, 30, 62), pot(40, 76, 0.8), check(40, 16, 1.2),
    greyed(path('M80 44 C86 50 96 40 112 46 L112 106 L80 106 Z', SAND, C.ink, 1), path('M80 44 C90 60 100 52 112 66 L112 76 C100 70 90 80 80 70 Z', CULT, null), path('M80 80 C92 90 100 84 112 92 L112 98 C100 94 90 100 80 92 Z', TOPSOIL, null), shard(92, 86, 0.6), shard(102, 62, 0.6), spade(104, 52, 0.6, 20))),
  /** superpositionsprincipen: three steps – first a lower layer is laid down, then a new one falls on top; so the lower one is older (big hourglass), the upper one younger (small). */
  'arkm.superpositionsprincipen': all(bg(), line('M42 12 L42 108 M78 12 L78 108', C.grey2, 1.4, '4 3'),
    rect(8, 88, 30, 14, SOIL2, 0, C.ink, 1.2), arrow(23, 64, 23, 84, C.accent, 2),
    rect(46, 88, 28, 14, SOIL2, 0, C.ink, 1.2), rect(46, 76, 28, 12, TOPSOIL, 0, C.ink, 1.2), arrow(60, 52, 60, 72, C.accent, 2),
    rect(84, 88, 30, 14, SOIL2, 0, C.ink, 1.2), rect(84, 76, 30, 12, TOPSOIL, 0, C.ink, 1.2), T(23, 30, '1', 16, C.navy), T(60, 30, '2', 16, C.navy),
    hourglass(99, 52, 0.55), hourglass(99, 26, 0.35), ground),
  /** torv: dark, wet peat is cut in blocks with a spade; in the peat wall an old wooden bowl is still kept. */
  'arkm.torv': all(bg(SKY), rect(4, 46, 76, 66, PEAT, 0, C.ink, 1.3), turfTop(4, 46, 76), ...[54, 64, 74, 84, 94, 104].map((y) => path(`M8 ${y} C24 ${y - 3} 50 ${y + 3} 76 ${y - 1}`, 'none', '#6a5038', 1)),
    path('M30 96 C30 104 50 104 50 96 Z', '#b07a42', C.ink, 1.2), rect(80, 100, 36, 12, '#9fd2ee', 0, null), ...[[86, 92], [100, 92], [93, 84]].map(([x, y]) => rect(x! - 6, y! - 4, 12, 8, PEAT, 1, C.ink, 1)), spade(70, 70, 0.8, 30)),
  /** underst: the lowest box in a pile is coloured and marked with an arrow; the boxes above are grey. */
  'arkm.underst': all(bg(), greyed(rect(36, 22, 48, 20, C.tan, 2, C.ink, 1.4), rect(32, 42, 56, 22, C.tan, 2, C.ink, 1.4), rect(30, 64, 60, 22, C.tan, 2, C.ink, 1.4)),
    rect(26, 86, 68, 24, C.orange, 2, C.accent, 2.4), arrow(112, 98, 98, 98, C.accent, 3), ground),

  // ── 2303 Fynd och fyndplatser ──
  /** fyndplats: on a field a small flag marks the exact spot where the coin lay; a tape runs to a fixed peg. */
  'arkm.fyndplats': all(bg(SKY), path('M4 52 L116 52 L116 112 L4 112 Z', '#c9a37a', null), ...[62, 74, 88, 104].map((y) => line(`M4 ${y} L116 ${y - 4}`, '#a8845a', 1.4)),
    ellipse(62, 88, 10, 4, '#6a4a30', C.ink, 1), coin(62, 86, 4), line('M70 88 L70 58', C.ink, 1.6), path('M70 58 L86 62 L70 66 Z', C.red, C.ink, 1), glow(62, 86, 12), pegs([[20, 100]]), dashed('M22 96 L56 88', C.yellow, 1.6), ground),
  /** artefakt: things made by people – a stone axe and a pot are coloured; grey: an ordinary stone that nature made. */
  'arkm.artefakt': all(bg(), rect(27, 34, 6, 40, WOOD, 2, C.ink, 1.1), axeStone(30, 42, 1.6, '#8a8f99'), pot(68, 86, 1.4), check(48, 22, 1.1), bead(40, 92, C.red), bead(46, 94, C.denim), bead(52, 92, C.yellow),
    greyed(path('M86 98 C84 88 94 82 104 84 C114 86 114 98 108 102 C100 106 88 106 86 98 Z', STONE, C.ink, 1.2)), cross(98, 70, 0.9, GREY), ground),
  /** fornfynd: an old bronze axe in the ground is protected – the law book and a shield stand over it. */
  'arkm.fornfynd': all(bg(), rect(4, 70, 112, 42, SOIL2, 0, null), line('M4 70 L116 70', C.ink, 1.2), axeBronze(46, 92, 1.4), glow(46, 92, 16), lawBook(84, 40, 1.3), shieldS(36, 38, 1.2, C.navy, line('M-5 0 L-1 4 L6 -4', C.white, 2.4)), arrow(38, 58, 42, 76, C.navy, 2)),
  /** lösfynd: an axe lies alone on a field with question marks around it; grey: the same axe in a grave beside a skeleton, where its context is known. */
  'arkm.lösfynd': all(bg(SKY), rect(4, 70, 76, 42, '#c9a37a', 0, null), axeStone(40, 90, 1.4), qm(20, 60, 14), qm(62, 56, 14), qm(40, 44, 12),
    greyed(rect(84, 70, 32, 42, SOIL2, 0, null), path('M88 78 L112 78 L112 108 L88 108 Z', '#d9c08f', C.ink, 1), skull(100, 84, 0.6), line('M100 88 L100 104', '#efe6d2', 2.4), axeStone(106, 100, 0.5)), ground),
  /** skattfynd: a broken clay pot in the soil spills a heap of shining silver coins and a ring. */
  'arkm.skattfynd': all(bg(), rect(4, 60, 112, 52, SOIL2, 0, null), line('M4 60 L116 60', C.ink, 1.2), rot(42, 96, -30, 1.4, path('M-8 0 C-14 -6 -14 -16 -7 -20 L-6 -24 L6 -24 L7 -20 C14 -16 14 -6 8 0 Z', CLAY, C.ink, 1), line('M-10 -14 L10 -14', '#8a4a24', 0.8)),
    ...[[58, 96, 5], [68, 100, 5], [62, 104, 4.4], [78, 102, 5], [72, 92, 4.4], [86, 106, 4.4], [54, 106, 4.4], [82, 94, 4]].map(([x, y, r]) => coin(x!, y!, r!)), circle(94, 98, 5, 'none', SILVER, 2.6),
    sparkle(66, 82, 5), sparkle(90, 84, 4), sparkle(52, 86, 3.4)),
  /** metalldetektor: a man sweeps a metal detector over the field; it beeps over a coin hidden in the ground. */
  'arkm.metalldetektor': all(bg(SKY), rect(4, 96, 112, 16, SOIL2, 0, null), turfTop(4, 96, 112), coin(84, 106, 3.4), fig(34, C.green, 'smile', { h: 0.9 }), reach(34, 0.9, 1, 54, 64), line('M54 64 L80 92', C.dark, 2.2), ellipse(84, 93, 9, 3, C.dark, C.ink, 1.2),
    path('M94 78 q4 4 0 8 M99 74 q6 8 0 16 M104 70 q8 12 0 24', 'none', C.accent, 1.8), ground),
  /** påträffa: a road worker digging with a spade suddenly comes upon a skull – he is surprised; he was not looking for it. */
  'arkm.påträffa': all(bg(SKY), rect(4, 86, 112, 26, SOIL2, 0, null), path('M4 86 L48 86 L48 112 L4 112 Z', '#7d838c', null), line('M10 99 L22 99 M30 99 L42 99', C.white, 2),
    fig(64, C.orange, 'shock', { h: 0.72 }, 86), path('M56 19 C56 9 72 9 72 19 Z', C.yellow, C.ink, 1.2), reach(64, 0.72, 1, 84, 62, 86), spade(88, 94, 0.8, 15), skull(98, 100, 0.9), ex(84, 30, 16), ex(94, 36, 12)),
  /** fragment: one shard, picked up by a hand, belongs to the dashed outline of the whole pot. */
  'arkm.fragment': all(bg(), dashed('M34 98 C22 90 22 64 34 56 L36 48 L58 48 L60 56 C72 64 72 90 60 98 Z', GREY, 1.6), path('M50 64 L66 62 L68 78 L52 80 Z', '#e9e2cf', GREY, 1),
    at(96, 54, 1.4, path('M-8 -6 L8 -8 L10 8 L-6 10 Z', CLAY, C.ink, 1.2), line('M-6 0 L8 -2', '#8a4a24', 1)), arrow(84, 60, 70, 68, C.accent, 2.4), ground),
  /** fragmentarisk: only some bones of a skeleton are left (the rest is dashed); grey: a complete skeleton. */
  'arkm.fragmentarisk': all(bg(), rect(8, 20, 70, 86, '#d9c08f', 2, C.ink, 1.2), skull(30, 36, 1.3), dashed('M30 46 L30 80', GREY, 3), line('M30 50 L30 60', '#efe6d2', 3.4), dashed('M30 52 L14 64 M30 52 L46 64', GREY, 2), line('M30 52 L40 60', '#efe6d2', 2.6),
    dashed('M30 80 L22 102 M30 80 L38 102', GREY, 2.4), line('M33 88 L37 100', '#efe6d2', 2.8), bone(58, 74, 0.7, 60), dashed('M50 30 L70 30 M50 92 L70 92', GREY, 1), qm(62, 54, 12),
    greyed(skull(98, 40, 0.8), line('M98 46 L98 74 M98 52 L88 64 M98 52 L108 64 M98 74 L92 96 M98 74 L104 96', '#efe6d2', 2.4)), check(98, 108, 0.6, GREY)),
  /** hittelön: the official hands money to the finder, who has just handed in the old coin; the finder is glad. */
  'arkm.hittelön': all(bg(), rect(10, 70, 46, 6, WOOD, 1, C.ink, 1.3), line('M16 76 L16 112 M50 76 L50 112', WOOD, 3), coin(30, 66, 4.4), glow(30, 66, 8),
    fig(22, C.navy, 'smile', { h: 0.62 }, 70), fig(90, C.green, 'laugh', { h: 0.84 }), reach(22, 0.62, 1, 58, 52, 70), banknote(64, 52, 1), reach(90, 0.84, -1, 70, 54), arrow(62, 40, 80, 40, OK, 2.4), sparkle(104, 24, 5), ground),
  /** lösa in: the state (a pillared building) takes the silver find, and money goes back to the finder – a fair exchange shown by two arrows. */
  'arkm.lösa-in': all(bg(), govB(84, 70, 1.1), coin(84, 50, 4), coin(78, 54, 3.4), fig(24, C.green, 'smile', { h: 0.8 }), path('M44 34 C60 22 70 22 80 30', 'none', C.accent, 2.2), arrow(76, 28, 82, 34, C.accent, 2),
    at(58, 30, 1, coin(0, 0, 4)), path('M80 84 C66 94 54 94 44 84', 'none', OK, 2.2), arrow(48, 88, 42, 82, OK, 2), banknote(62, 96, 0.9), ground),
  /** kulturmiljölagen: the law book stands beside a runestone and a burial mound, all under one protecting shield dome. */
  'arkm.kulturmiljölagen': all(bg(SKY), path('M4 96 L116 96 L116 112 L4 112 Z', GRASS, null), path('M14 96 C14 40 106 40 106 96', 'rgba(140,199,232,0.35)', '#2f7fb5', 2.4),
    runestone(42, 96, 1.2), path('M60 96 C64 80 88 80 92 96 Z', TURF, C.ink, 1.2), lawBook(100, 44, 1), shieldS(22, 30, 0.8, C.navy, line('M-5 0 L-1 4 L6 -4', C.white, 2.4)), ground),

  // ── 2304 Datering av föremål ──
  /** datering: the pot goes in, and out comes its age – a tag showing about 950 years, with a check. */
  'arkm.datering': all(bg(), pot(26, 80, 1.3), arrow(46, 62, 62, 62, C.accent, 2.6), hourglass(56, 34, 0.7), rect(68, 46, 44, 32, C.white, 3, C.ink, 1.4), T(90, 68, '950', 15, C.navy), circle(70, 48, 2, C.ink, null), check(104, 88, 1), ground),
  /** relativ datering: two pots in two layers – the lower one is older (big hourglass), the upper one younger; but the years are only question marks. */
  'arkm.relativ-datering': all(bg(), profile(10, 30, 70, [[SOIL2, 36], [CULT, 40]]), pot(30, 62, 0.8, '#d98a4e'), pot(58, 100, 0.8, '#9a5a30'),
    hourglass(96, 44, 0.45), hourglass(96, 86, 0.7), line('M86 40 L76 46 M86 84 L76 90', GREY, 1.2), qm(30, 22, 12), qm(58, 22, 12), arrow(96, 74, 96, 58, C.accent, 2)),
  /** absolut datering: an arrow from the find lands on a timeline with years; a bracket marks 900–1000. */
  'arkm.absolut-datering': all(bg(), pot(28, 54, 1.1), line('M8 84 L112 84', C.ink, 2.2), ...[[14, '0'], [50, '500'], [86, '1000']].map(([x, n]) => all(line(`M${x} 80 L${x} 88`, C.ink, 1.8), T(x as number, 100, n as string, 8, C.ink))),
    rect(80, 78, 12, 12, 'rgba(228,87,46,0.25)', 1, C.accent, 1.6), arrow(40, 52, 82, 74, C.accent, 2.4), check(104, 40, 1.1)),
  /** isotop: two atoms of the same kind – the same colours, but one has an extra particle and is heavier, so the scale tips. */
  'arkm.isotop': all(bg(), path('M60 30 L60 92', 'none', C.ink, 2), path('M52 100 L68 100 L60 92 Z', GREY, C.ink, 1.2), line('M24 42 L96 54', C.ink, 2.4),
    line('M28 43 L28 56 M92 53 L92 66', C.ink, 1), at(28, 66, 1, circle(-4, -2, 4, C.red, C.ink, 0.8), circle(4, -2, 4, GREY, C.ink, 0.8), circle(0, 5, 4, C.red, C.ink, 0.8)),
    at(92, 76, 1, circle(-4, -2, 4, C.red, C.ink, 0.8), circle(4, -2, 4, GREY, C.ink, 0.8), circle(0, 5, 4, C.red, C.ink, 0.8), circle(8, 5, 4, GREY, C.accent, 1.6)), ellipse(28, 64, 14, 6, 'none', C.denim, 1), ellipse(92, 75, 16, 7, 'none', C.denim, 1), ground),
  /** radiokolmetoden: a piece of charcoal goes into the lab machine; its dots of carbon get fewer, and the screen shows the year. */
  'arkm.radiokolmetoden': all(bg(LAB), at(20, 62, 1.4, path('M-8 -4 L4 -8 L9 -1 L5 6 L-6 5 Z', CHAR, C.ink, 1.1)), arrow(34, 62, 46, 62, C.accent, 2.2),
    rect(48, 38, 44, 50, C.white, 3, C.ink, 1.4), rect(54, 44, 32, 14, '#1e2d3a', 1, null), T(70, 55, '960', 10, '#7fe08a'),
    ...[[56, 66], [62, 70], [70, 66], [78, 72], [84, 66], [66, 78], [80, 80]].map(([x, y], i) => circle(x!, y!, 2.2, i < 3 ? C.red : C.grey2, C.ink, 0.6)),
    T(104, 48, '14', 11, C.red), rect(48, 88, 44, 6, GREY, 1, C.ink, 1), ground),
  /** halveringstid: a falling curve – after one step half is left, after two steps a quarter; the steps are marked by hourglasses. */
  'arkm.halveringstid': all(bg(), line('M18 18 L18 96 L108 96', C.ink, 2), path('M18 26 C36 52 46 62 54 61 C70 60 76 76 90 78 C98 79 104 82 108 84', 'none', C.accent, 2.6),
    dashed('M18 61 L54 61 L54 96', C.navy, 1.4), dashed('M18 78 L90 78 L90 96', C.navy, 1.4), circle(18, 26, 3, C.red, C.ink, 1),
    hourglass(54, 106, 0.3), hourglass(90, 106, 0.3), T(10, 64, '½', 9, C.navy), T(10, 81, '¼', 9, C.navy)),
  /** kalibrera: a hand turns the screw of a scale with a known weight until the needle moves from the grey wrong mark to the green right mark. */
  'arkm.kalibrera': all(bg(), rect(26, 70, 64, 30, C.white, 4, C.ink, 1.5), path('M30 66 L86 66 L86 70 L30 70 Z', GREY, C.ink, 1.2), rect(46, 48, 22, 18, C.dark, 2, C.ink, 1.2), T(57, 61, '1', 10, C.white),
    path('M40 92 A18 18 0 0 1 76 92', 'none', C.ink, 1.4), line('M58 92 L70 80', OK, 2.6), greyed(line('M58 92 L48 78', C.ink, 2.6)), line('M70 77 L72 74', OK, 2), circle(58, 92, 2, C.ink, null),
    circle(96, 92, 5, GREY, C.ink, 1.3), path('M90 82 C96 76 104 80 104 86', 'none', C.accent, 1.8), arrow(102, 84, 104, 88, C.accent, 1.4), ground),
  /** årsring: a cut tree stump showing its rings, wide and narrow, one for every year. */
  'arkm.årsring': all(bg(SKY), path('M24 70 L24 106 C24 112 96 112 96 106 L96 70 Z', '#8a5a34', C.ink, 1.4), ellipse(60, 70, 36, 14, '#e9c98f', '#7a4a24', 2.2),
    ...[32, 28, 23, 19, 14, 10, 6].map((r) => ellipse(60, 70, r, f1(r * 0.39), 'none', '#a8784a', 1)), circle(60, 70, 1.6, '#7a4a24', null), ground),
  /** dendrokronologi: the ring pattern of a piece of wood is matched against a long reference strip; dashed lines line them up and give the year. */
  'arkm.dendrokronologi': all(bg(), rect(8, 30, 104, 16, '#e9c98f', 2, '#7a4a24', 1.4),
    line([12, 16, 18, 26, 30, 32, 40, 48, 52, 54, 62, 66, 74, 76, 84, 92, 96, 98, 106].map((x) => `M${x} 31 L${x} 45`).join(' '), '#a8784a', 1.2),
    rect(40, 70, 40, 16, '#e9c98f', 2, '#7a4a24', 1.4), line([44, 48, 50, 58, 62, 64, 72, 76].map((x) => `M${x} 71 L${x} 85`).join(' '), '#a8784a', 1.2),
    dashed('M44 70 L48 46 M58 70 L62 46 M72 70 L76 46', C.accent, 1.2), T(96, 100, '975', 12, C.navy), rings(20, 92, 10, [2, 3, 2, 2])),
  /** typologi: a row of axes changes shape step by step from a rough stone axe to a fine bronze axe; the arrow below shows time. */
  'arkm.typologi': all(bg(), axeStone(20, 50, 0.9, '#8a8f99'), axeStone(46, 50, 1, '#a39d90'), axeBronze(74, 50, 0.9, '#b8864a'), axeBronze(100, 50, 1, BRONZE),
    arrow(14, 86, 108, 86, C.accent, 2.6), hourglass(60, 104, 0.35), line('M30 50 L36 50 M58 50 L62 50 M86 50 L88 50', GREY, 1.2, '2 2')),
  /** före Kristus: on a timeline with 0 in the middle, the left part – before the year 0 – is coloured, with the years counted to the left. */
  'arkm.före-Kristus': all(bg(), line('M10 60 L110 60', C.grey2, 3), rect(10, 54, 50, 12, C.orange, 2, C.ink, 1.4), line('M60 46 L60 74', C.ink, 2.6), T(60, 90, '0', 14, C.ink),
    arrow(52, 36, 16, 36, C.accent, 2.6), T(24, 90, '500', 10, C.accent), line('M24 56 L24 64', C.ink, 1.4), greyed(T(96, 90, '500', 10, C.ink))),
  /** efter Kristus: the same timeline, now the right part – after the year 0 – is coloured, with the years counted to the right. */
  'arkm.efter-Kristus': all(bg(), line('M10 60 L110 60', C.grey2, 3), rect(60, 54, 50, 12, C.green, 2, C.ink, 1.4), line('M60 46 L60 74', C.ink, 2.6), T(60, 90, '0', 14, C.ink),
    arrow(68, 36, 104, 36, C.accent, 2.6), T(96, 90, '500', 10, C.accent), line('M96 56 L96 64', C.ink, 1.4), greyed(T(24, 90, '500', 10, C.ink))),
  /** årtusende: a bracket over a long piece of time that is 1000 years – from a small hut at its start to a stone church at its end. */
  'arkm.årtusende': all(bg(), line('M8 80 L112 80', C.ink, 2.2), line('M20 74 L20 86 M100 74 L100 86', C.ink, 2), path('M20 66 C20 58 30 60 40 56 L60 50 L80 56 C90 60 100 58 100 66', 'none', C.accent, 2.4),
    T(60, 42, '1000', 15, C.accent), path('M12 108 L12 98 L20 92 L28 98 L28 108 Z', '#c9a06a', C.ink, 1.1), path('M92 108 L92 96 L104 96 L104 108 Z', STONE, C.ink, 1.1), path('M94 96 L98 86 L102 96 Z', STONE, C.ink, 1.1), ground),

  // ── 2305 Dokumentation i fält ──
  /** dokumentation: a folder holds everything from the dig – photo, drawing, notes and list; it is all that remains of the place. */
  'arkm.dokumentation': all(bg(), path('M16 30 L56 30 L60 36 L104 36 L104 104 L16 104 Z', '#e6b84e', C.ink, 1.5), rect(24, 44, 34, 26, C.white, 1, C.ink, 1.2), rect(27, 47, 28, 20, SKY, 0.5, null), shard(41, 58, 0.9),
    paper(64, 42, 32, 28, '#f3f0e6', false), profile(67, 46, 26, [[TOPSOIL, 6], [CULT, 6], [SAND, 10]]), paper(24, 76, 34, 22), paper(64, 76, 32, 22), T(80, 90, '27', 9, C.navy)),
  /** fotografera: a woman photographs a pot lying in the trench; the camera flashes. */
  'arkm.fotografera': all(bg(SKY), rect(4, 92, 112, 20, SOIL2, 0, null), line('M4 92 L116 92', C.ink, 1.2), pot(90, 104, 0.8), arch(40, 0.9, 'calm'), reach(40, 0.9, 1, 60, 46), reach(40, 0.9, 1, 56, 52), camera(62, 46, 1),
    line('M76 44 L82 40 M76 50 L84 50 M76 56 L82 60', C.yellow, 2.2)),
  /** skalstock: a red and white striped stick lies beside a pot in the soil, so the photo shows its size. */
  'arkm.skalstock': all(bg(), rect(4, 30, 112, 82, SOIL2, 2, null), pot(52, 84, 1.6), scaleBar(16, 98, 88, 8), line('M16 104 L16 108 M104 104 L104 108', C.ink, 1), ground),
  /** sektionsritning: on a drawing board, the layers of the profile beside it are drawn line for line. */
  'arkm.sektionsritning': all(bg(), profile(8, 30, 42, [[TOPSOIL, 14], [CULT, 18], [SOIL2, 16], [SAND, 26]]), turfTop(8, 30, 42), path('M28 44 C30 56 36 60 40 62 L40 44 Z', '#4a3a30', null),
    rect(58, 24, 54, 70, C.white, 2, C.ink, 1.5), line('M62 44 L108 44 M62 62 L108 62 M62 78 L108 78', C.ink, 1.4), path('M84 44 C86 54 92 58 96 60 L96 44', 'none', C.ink, 1.2), line('M62 28 L62 90 M108 28 L108 90', '#cbd5dd', 0.6),
    dashed('M50 44 L58 44 M50 62 L58 62 M50 78 L58 78', C.accent, 1.2), rot(98, 100, -40, 1, rect(-2, -16, 4, 18, C.yellow, 1, C.ink, 1), path('M-2 2 L2 2 L0 6 Z', C.ink, null)), ground),
  /** millimeterpapper: a sheet of graph paper with fine and thicker lines, and a pencil on it. */
  'arkm.millimeterpapper': all(bg(), rect(18, 14, 84, 92, '#fbfdfb', 1, C.ink, 1.4),
    line(Array.from({ length: 41 }, (_, i) => `M${f1(20 + i * 2)} 16 L${f1(20 + i * 2)} 104`).join(' ') + ' ' + Array.from({ length: 45 }, (_, i) => `M20 ${f1(16 + i * 2)} L100 ${f1(16 + i * 2)}`).join(' '), '#bfe0c8', 0.35),
    line(Array.from({ length: 9 }, (_, i) => `M${20 + i * 10} 16 L${20 + i * 10} 104`).join(' ') + ' ' + Array.from({ length: 9 }, (_, i) => `M20 ${16 + i * 10} L100 ${16 + i * 10}`).join(' '), '#6fbf86', 0.9),
    path('M30 76 L50 56 L70 66 L84 40', 'none', C.ink, 1.6), rot(92, 92, -40, 1.1, rect(-2.4, -22, 4.8, 24, C.yellow, 1, C.ink, 1), path('M-2.4 2 L2.4 2 L0 7 Z', '#e8d9a8', C.ink, 0.8))),
  /** mäta in: one archaeologist holds the pole on the find, the other aims the instrument at it; the beam gives three numbers. */
  'arkm.mäta-in': all(bg(SKY), rect(4, 96, 112, 16, SOIL2, 0, null), line('M4 96 L116 96', C.ink, 1.2), tripodTS(26, 96, 0.9), arch(48, 0.62, 'calm'), dashed('M30 48 L88 50', C.red, 1.6),
    pole(92, 96, 40), arch(104, 0.66, 'smile'), reach(104, 0.66, -1, 92, 64), shard(92, 100, 0.6), rect(36, 12, 52, 14, C.white, 2, C.ink, 1.2), T(62, 23, '12 · 47 · 3', 9, C.navy)),
  /** koordinat: on a grid with two axes, a point is fixed by dashed lines to 3 on one axis and 5 on the other. */
  'arkm.koordinat': all(bg(), line(Array.from({ length: 7 }, (_, i) => `M${24 + i * 13} 18 L${24 + i * 13} 96 M24 ${96 - i * 13} L102 ${96 - i * 13}`).join(' '), '#d5dde3', 1), arrow(24, 96, 110, 96, C.ink, 2), arrow(24, 96, 24, 10, C.ink, 2),
    dashed('M63 96 L63 31 L24 31', C.accent, 1.6), circle(63, 31, 5, C.accent, C.ink, 1.3), T(63, 110, '3', 11, C.navy), T(14, 35, '5', 11, C.navy)),
  /** totalstation: the yellow measuring instrument with a small screen and lens stands on its wooden tripod. */
  'arkm.totalstation': all(bg(SKY), rect(4, 100, 112, 12, SOIL2, 0, null), tripodTS(60, 108, 1.9), ground),
  /** rutnät (2): strings stretched between pegs divide the field into equal squares before the dig starts. */
  'arkm.rutnät.2': all(bg(SKY), path('M4 40 L116 40 L116 112 L4 112 Z', GRASS, null), path('M20 104 L36 50 L84 50 L100 104 Z', '#d6b98a', C.ink, 1.2),
    line('M24 90 L96 90 M28 77 L92 77 M32 63 L88 63 M52 50 L40 104 M68 50 L80 104 M60 50 L60 104', C.white, 1.6), pegs([[20, 104], [36, 50], [84, 50], [100, 104], [60, 104], [60, 50]]), ground),
  /** fyndpåse: a closed plastic bag with a red seal holds a coin; its white label carries a number. */
  'arkm.fyndpåse': all(bg(), bag(60, 60, 2.6, all(coin(0, -2, 4.4))), T(60, 82, '27', 9, C.navy), ground),
  /** kontext: the pot lies in its layer beside a skeleton in a grave – dashed rings tie it to them; grey: the same pot alone with a question mark. */
  'arkm.kontext': all(bg(), rect(8, 30, 70, 76, SOIL2, 2, C.ink, 1.2), path('M14 44 L72 44 L72 96 L14 96 Z', '#d9c08f', C.ink, 1), skull(28, 54, 0.9), line('M28 60 L28 86 M28 64 L20 74 M28 64 L36 74 M28 86 L22 94 M28 86 L34 94', '#efe6d2', 2.2), pot(58, 86, 0.7),
    ellipse(58, 78, 12, 12, 'none', C.accent, 1.6), dashed('M46 76 L36 70', C.accent, 1.4), dashed('M58 66 L58 46', C.accent, 1.4), greyed(pot(100, 82, 0.6), qm(100, 50, 14, GREY)), ground),
  /** databas: a laptop shows a table – one row for every find, with small pictures and numbers. */
  'arkm.databas': all(bg(), laptop(60, 92, 2, all(...[-20, -14, -8].map((y) => all(line(`M-15 ${y + 3} L15 ${y + 3}`, '#b8bfc6', 0.4), rect(-15, y - 2, 4, 4, CLAY, 0.5, null), line(`M-9 ${y} L13 ${y}`, C.navy, 0.8))))), ground),

  // ── 2306 Laboratorieanalyser ──
  /** analys: a sample is examined under a magnifier and comes out as a chart of what it is made of. */
  'arkm.analys': all(bg(LAB), tube(20, 70, 1.4), lens(42, 56, 1.4), arrow(60, 60, 72, 60, C.accent, 2.2), rect(76, 30, 36, 56, C.white, 2, C.ink, 1.3), rect(82, 64, 6, 16, C.red, 0, C.ink, 0.8), rect(91, 50, 6, 30, C.denim, 0, C.ink, 0.8), rect(100, 58, 6, 22, C.yellow, 0, C.ink, 0.8), line('M80 80 L108 80', C.ink, 1.2), ground),
  /** prov (2): a gloved hand puts a small bit of soil from the trench into a labelled tube. */
  'arkm.prov.2': all(bg(LAB), rect(4, 86, 60, 26, SOIL2, 0, null), line('M4 86 L64 86', C.ink, 1.2), tube(86, 86, 2, SOIL), rect(78, 70, 16, 10, C.white, 1, C.ink, 0.8), T(86, 78, '5', 7, C.navy),
    forearm(8, 26, 44, 56, '#9fd0e6'), line('M48 58 L76 66', GREY, 2), circle(76, 66, 2.4, SOIL, null), ground),
  /** osteolog: a researcher in a white coat studies a skull with a magnifier; the bones of a skeleton lie in order on the table. */
  'arkm.osteolog': all(bg(LAB), rect(8, 78, 104, 6, C.white, 1, C.ink, 1.3), line('M14 84 L14 112 M106 84 L106 112', GREY, 3), labCoat(30, 0.9), reach(30, 0.9, 1, 54, 52), skull(62, 52, 1.2), lens(54, 48, 1.1),
    bone(70, 74, 0.6), bone(92, 74, 0.6, 10), skull(102, 70, 0.6), line('M80 70 L84 64', '#efe6d2', 2.4), ground),
  /** DNA-analys: from a tooth, the double helix is read out and turns into a pattern of bands. */
  'arkm.DNA-analys': all(bg(LAB), path('M14 50 C14 40 32 40 32 50 L30 66 L26 60 L23 70 L20 60 L16 66 Z', '#f5efe0', C.ink, 1.3), arrow(36, 56, 48, 56, C.accent, 2.2), helix(60, 22, 76),
    arrow(72, 56, 84, 56, C.accent, 2.2), rect(88, 24, 22, 66, C.white, 2, C.ink, 1.2), ...[30, 36, 46, 52, 64, 70, 80].map((y, i) => rect(92, y, 14, 2.6, i % 2 ? C.denim : C.navy, 0.5, null)), ground),
  /** isotopanalys: a tooth gives two answers – fish, meat or plants for the food, and a far-away place on a little map for where the person grew up. */
  'arkm.isotopanalys': all(bg(LAB), path('M48 40 C48 28 72 28 72 40 L70 62 L65 54 L60 66 L55 54 L50 62 Z', '#f5efe0', C.ink, 1.3), T(60, 22, '13', 9, C.red),
    arrow(46, 62, 30, 76, C.accent, 2), arrow(74, 62, 90, 76, C.accent, 2),
    at(16, 92, 1, path('M-8 0 C-4 -6 6 -6 10 0 C6 6 -4 6 -8 0 Z M10 0 L15 -4 L15 4 Z', '#7fb2d6', C.ink, 1)), seed(34, 94, 1.2), seed(40, 100, 1.2, '#d9b25a', 30),
    rect(80, 80, 32, 24, '#cfe7c2', 2, C.ink, 1.2), path('M86 84 C92 82 98 90 106 86', 'none', '#5aa7d6', 1.4), circle(102, 96, 3, C.red, C.ink, 1), dashed('M88 98 L100 96', C.red, 1)),
  /** pollenanalys: a soil core from the bog, and in the microscope circle the different pollen grains of trees and grasses. */
  'arkm.pollenanalys': all(bg(LAB), rect(12, 26, 14, 76, PEAT, 2, C.ink, 1.3), line('M12 46 L26 46 M12 66 L26 66 M12 84 L26 84', '#6a5038', 1), circle(19, 56, 3, C.yellow, null), arrow(30, 56, 44, 56, C.accent, 2.2),
    circle(78, 56, 32, '#fffbe8', C.ink, 2), pollenG(68, 44, 7, C.yellow, 0), pollenG(90, 46, 6, '#e8c46a', 1), pollenG(70, 72, 6, '#f0d27a', 2), pollenG(92, 70, 6, C.yellow, 0), microscope(104, 108, 0.6)),
  /** makrofossil: seeds, grains and a bit of nut shell picked out of a soil sample lie in a dish, big enough to see with the eye. */
  'arkm.makrofossil': all(bg(LAB), ellipse(56, 78, 44, 16, '#eef6fa', C.ink, 1.6), ellipse(56, 76, 38, 12, '#fbfdfe', '#b8c6d0', 1),
    seed(34, 74, 1.4, '#3a2e26', 20), seed(46, 80, 1.4, '#3a2e26', -15), seed(58, 72, 1.4, '#4a3a2e', 40), seed(70, 80, 1.3, '#3a2e26'), path('M78 70 C82 64 92 66 90 74 C88 80 80 80 78 70 Z', '#5a4030', C.ink, 1), seed(40, 70, 1.1, '#5a4030', 70),
    rot(94, 42, 30, 1, line('M0 -18 L-3 14 M0 -18 L3 14', GREY, 2)), ground),
  /** förkolnad: grains burnt black like charcoal but not turned to ash, beside a small flame; grey: the same grains fresh and light. */
  'arkm.förkolnad': all(bg(), seed(30, 64, 2.2, CHAR, 10), seed(48, 70, 2.2, CHAR, -20), seed(36, 82, 2.2, CHAR, 40), seed(54, 88, 2, '#3a3030', 0),
    at(42, 34, 1, path('M0 -14 C7 -7 9 -2 7 4 C5 9 -5 9 -7 4 C-9 -2 -5 -5 -3 -9 C-2 -5 0 -5 0 -14 Z', C.orange, C.ink, 1.1), path('M0 -5 C3 -2 3 3 0 5 C-3 3 -3 0 0 -5 Z', C.yellow, null)),
    greyed(seed(88, 66, 1.6, '#e6c870', 10), seed(100, 74, 1.6, '#e6c870', -20), seed(92, 84, 1.6, '#e6c870', 40)), ground),
  /** kontaminera: a bare hand touches the open dish, and little germs and cells jump into the sample – a red warning; grey: a gloved hand, safe. */
  'arkm.kontaminera': all(bg(LAB), ellipse(52, 86, 26, 8, '#eef6fa', C.ink, 1.4), path('M36 84 C44 80 60 80 68 84', 'none', SOIL2, 3), forearm(66, 18, 54, 60),
    ...[[44, 72], [54, 74], [36, 70]].map(([x, y]) => all(circle(x!, y!, 2.4, C.green, C.ink, 0.8), line(`M${x! - 3} ${y! - 2} l-2 -1 M${x! + 3} ${y! - 2} l2 -1`, C.green, 0.8))), ex(20, 44, 16),
    greyed(forearm(112, 44, 98, 72, '#9fd0e6'), ellipse(96, 92, 14, 5, '#eef6fa', C.ink, 1.2)), ground),
  /** sammansättning: a bronze object and a pie chart of what it is made of – mostly copper, a smaller part tin. */
  'arkm.sammansättning': all(bg(), axeBronze(26, 60, 1.5), arrow(46, 60, 56, 60, C.accent, 2.2), circle(84, 60, 24, '#c96a3a', C.ink, 1.6), path('M84 60 L84 36 A24 24 0 0 1 104.8 48 Z', '#c7cdd3', C.ink, 1.4),
    circle(26, 94, 6, '#c96a3a', C.ink, 1.1), T(40, 98, '+', 12, C.ink), circle(54, 94, 6, '#c7cdd3', C.ink, 1.1), ground),

  // ── 2307 Tolka materiella spår ──
  /** materiell kultur: things people made and used – a house, a pot, an axe, a dress pin and a shoe are coloured; grey: a song and a thought, which cannot be touched. */
  'arkm.materiell-kultur': all(bg(), longhouse(34, 50, 0.7), pot(78, 50, 0.9), axeStone(24, 80, 1, '#8a8f99'), circle(54, 80, 6, 'none', BRONZE, 2.4), line('M50 80 L62 70', BRONZE, 1.8), path('M70 84 L70 74 C76 72 82 76 86 80 L96 82 L96 86 L70 86 Z', '#8a5a34', C.ink, 1.1),
    greyed(at(100, 22, 1, path('M0 6 L0 -10 L8 -12 L8 4', 'none', C.ink, 2), ellipse(-2.5, 6, 3.4, 2.6, C.ink, null), ellipse(5.5, 4, 3.4, 2.6, C.ink, null)), cloud(100, 100, 0.7, '#e0e0e0')), ground),
  /** lämning: what is left of a house in the landscape – a low square of foundation stones in the grass, a broken wall, a grave stone. */
  'arkm.lämning': all(bg(SKY), path('M4 70 L116 70 L116 112 L4 112 Z', GRASS, null), ...[[24, 86], [34, 82], [44, 82], [54, 82], [64, 86], [24, 96], [64, 96], [24, 106], [34, 106], [44, 106], [54, 106], [64, 106]].map(([x, y]) => ellipse(x!, y!, 5, 3, STONE, C.ink, 1)),
    path('M82 108 L82 74 L90 70 L94 80 L100 76 L102 108 Z', STONE, C.ink, 1.2), line('M82 86 L102 86 M82 98 L102 98 M92 74 L92 86 M88 86 L88 98 M96 98 L96 108', '#7a7468', 1), ground),
  /** vittna om: burnt beams lie in the ground, and a speech bubble from them shows what happened – a house in flames. */
  'arkm.vittna-om': all(bg(), rect(4, 86, 112, 26, SOIL2, 0, null), line('M4 86 L116 86', C.ink, 1.2), rot(34, 96, -8, 1, rect(-22, -3, 44, 6, CHAR, 1, C.ink, 1)), rot(70, 100, 10, 1, rect(-18, -3, 36, 6, CHAR, 1, C.ink, 1)), ellipse(52, 106, 14, 3, GREY, null),
    say(70, 40, 60, 40, all(path('M52 52 L52 40 L64 30 L76 40 L76 52 Z', '#c9a06a', C.ink, 1.1), at(64, 34, 0.9, path('M0 -14 C7 -7 9 -2 7 4 C5 9 -5 9 -7 4 C-9 -2 -5 -5 -3 -9 C-2 -5 0 -5 0 -14 Z', C.orange, C.ink, 1), path('M0 -5 C3 -2 3 3 0 5 C-3 3 -3 0 0 -5 Z', C.yellow, null)), at(86, 36, 0.6, path('M0 -14 C7 -7 9 -2 7 4 C5 9 -5 9 -7 4 C-9 -2 -5 -5 -3 -9 C-2 -5 0 -5 0 -14 Z', C.orange, C.ink, 1))), 50, 88)),
  /** tyda på: the clues (a footprint and a dropped pot) point with a dashed arrow towards an idea, but a question mark is still there – probable, not proven. */
  'arkm.tyda-på': all(bg(), rect(4, 90, 112, 22, '#c9a37a', 0, null), ...[[14, 104], [28, 98], [42, 104]].map(([x, y]) => ellipse(x!, y!, 4, 2.2, '#8a6040', null)), shard(56, 100, 1),
    lens(30, 70, 1.3), dashed('M48 76 L78 52', C.accent, 2), arrow(76, 54, 80, 50, C.accent, 1.6), think(94, 34, 20, 16, all(path('M86 42 L86 30 L94 24 L102 30 L102 42 Z', '#c9a06a', C.ink, 1), ellipse(106, 40, 3, 2, C.dark, null)), 80, 58), qm(110, 18, 14), ground),
  /** påvisa: the analysis result on the screen proves it – a clear peak and a big green check. */
  'arkm.påvisa': all(bg(LAB), rect(14, 24, 70, 52, C.white, 3, C.ink, 1.5), line('M20 66 L78 66', C.ink, 1.2), path('M20 64 L36 63 L42 60 L48 30 L54 60 L60 63 L78 64', 'none', C.red, 2), pot(30, 100, 0.8), tube(56, 100, 1),
    check(96, 44, 2), rect(44, 76, 10, 8, GREY, 0.5, C.ink, 1), ground),
  /** etnografisk: a researcher with a notebook sits with a family of a living village and writes down how they cook and live. */
  'arkm.etnografisk': all(bg(SKY), path('M70 112 L70 74 L92 58 L114 74 L114 112 Z', '#d2ac5e', C.ink, 1.3), rect(86, 92, 12, 20, '#6b4a2b', 1, C.ink, 1), circle(52, 104, 7, C.dark, C.ink, 1.2), line('M44 108 L60 108', WOOD, 2),
    path('M48 98 C46 92 50 90 52 94 C54 90 58 92 56 98 Z', C.orange, null), fig(66, C.green, 'smile', { h: 0.5, hairStyle: 'long' }), fig(36, C.red, 'smile', { h: 0.4 }),
    arch(16, 0.66, 'calm'), reach(16, 0.66, 1, 28, 70), paper(26, 62, 12, 16), ground),
  /** status (2): on a stepped podium the woman with gold, a fine cloak and many things stands highest; ordinary people stand lower. */
  'arkm.status.2': all(bg(), rect(40, 66, 40, 46, '#d8cfb8', 1, C.ink, 1.3), rect(10, 90, 30, 22, '#e8e2d2', 1, C.ink, 1.2), rect(80, 90, 30, 22, '#e8e2d2', 1, C.ink, 1.2),
    fig(60, C.purple, 'smile', { h: 0.62, hairStyle: 'long' }, 66), path('M50 34 L70 34 L74 64 L46 64 Z', 'rgba(138,107,191,0.6)', C.ink, 1), circle(60, 34, 3, GOLD, C.ink, 1), sparkle(76, 22, 4), coin(46, 58, 3, GOLD),
    greyed(fig(24, C.grey, 'calm', { h: 0.42 }, 90), fig(96, C.grey, 'calm', { h: 0.42 }, 90))),
  /** handelskontakt: two villages far apart are linked by a sea route; a boat carries glass one way and furs the other. */
  'arkm.handelskontakt': all(bg('#9fd2ee'), path('M4 4 L40 4 C34 30 30 60 4 70 Z', GRASS, C.ink, 1.3), path('M116 112 L76 112 C80 90 92 66 116 54 Z', '#d8c890', C.ink, 1.3),
    longhouse(18, 34, 0.32), path('M94 98 L94 86 L102 80 L110 86 L110 98 Z', '#e6d3b3', C.ink, 1), dashed('M30 50 C50 60 66 70 88 82', C.navy, 1.8),
    at(58, 64, 1, path('M-14 0 L14 0 L10 6 L-10 6 Z', WOOD, C.ink, 1.2), line('M0 0 L0 -16', C.ink, 1.4), path('M0 -16 L10 -4 L0 -4 Z', C.white, C.ink, 1)), glassCup(78, 30), arrow(70, 32, 46, 40, C.accent, 1.8), rect(30, 86, 14, 8, '#8a6a48', 3, C.ink, 1), arrow(48, 90, 70, 96, C.accent, 1.8)),
  /** rekonstruktion: from a skull a sculptor's model of the face is built up – the arrow goes from the grey skull to the living face. */
  'arkm.rekonstruktion': all(bg(), greyed(skull(28, 56, 2.2)), arrow(48, 56, 62, 56, C.accent, 2.6), rect(72, 82, 32, 10, '#d8cfb8', 1, C.ink, 1.3), rect(80, 74, 16, 8, '#d8cfb8', 1, C.ink, 1.2), rect(83, 62, 10, 12, C.skin, 2, C.ink, 1.2),
    circle(88, 52, 16, C.skin, C.ink, 1.6), path('M72 50 C72 30 104 30 104 50 C98 40 78 40 72 50 Z', '#7a5a3a', C.ink, 1.3), circle(82, 52, 1.6, C.ink, null), circle(94, 52, 1.6, C.ink, null), path('M84 60 Q88 62 92 60', 'none', C.ink, 1.3), dashed('M72 52 L68 70 M104 52 L108 70', GREY, 1), ground),
  /** spekulativ: a tall wobbly tower of question-mark blocks stands on one small fact block with a check; grey: a low tower on a broad base of facts. */
  'arkm.spekulativ': all(bg(), rect(28, 98, 14, 12, OK, 1, C.ink, 1.3), line('M31 104 L34 107 L39 100', C.white, 1.8),
    ...[[30, 86, -4], [34, 74, 5], [28, 62, -6], [36, 50, 8], [30, 38, -10], [38, 26, 12]].map(([x, y, r]) => rot(x!, y!, r!, 1, rect(-8, -6, 16, 12, C.orange, 1, C.ink, 1.2), T(0, 4, '?', 9, C.white))), motion(52, 30, 1),
    greyed(rect(70, 98, 42, 12, OK, 1, C.ink, 1.2), rect(78, 86, 26, 12, OK, 1, C.ink, 1.2), rect(84, 74, 14, 12, C.orange, 1, C.ink, 1.2)), ground),
};

/** A small drinking glass (traded goods). */
function glassCup(x: number, y: number): Svg { return all(path(`M${x - 5} ${y - 8} L${x + 5} ${y - 8} L${x + 3} ${y + 6} L${x - 3} ${y + 6} Z`, 'rgba(120,200,190,0.7)', C.ink, 1.1), line(`M${x - 4} ${y - 4} L${x + 4} ${y - 4}`, C.white, 0.8)); }
