/**
 * Historia & humaniora → Filosofi & etik → Filosofins grundord, 2201–2207 (0.39): concepts and definitions,
 * claims and conclusions, arguments and premises, logic and contradiction, truth and knowledge, thought
 * experiments and the philosophical conversation. Claims are drawn as white cards with a small picture
 * (sun, rain, shapes); truth values as a green tick or a red cross; reasoning as arrows, steps and bridges
 * between cards. Philosophers are small neutral figures in robes, never portraits. The idea dominates the
 * picture and a grey copy stands beside it as contrast. Digits and the signs ? ! ≠ ∴ only; no words,
 * no letters and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm, bolt, cloud } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Colours ──────────────────────────────────────────────────────────
const PAPER = '#f6f2ea';
const DAY = '#cfe9f7';
const NIGHT = '#2b3a67';
const ROBE = '#e9e1cf';
const PARCH = '#f3e6c4';
const WOOD = '#a8743f';
const GRASS = '#7fbf6a';
const SEA = '#5aa7d6';
const GOLD = C.gold;
const GREEN = '#3f9a5a';
const BLUE = '#3f6fb5';
const PRINT = '#2f5f9e';
const f1 = (n: number) => n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);

// ── Figures ──────────────────────────────────────────────────────────
const ground = line('M4 112 L116 112', C.grey2, 2);
const bg = (col: string = PAPER) => rect(4, 4, 112, 108, col, 3, null);
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s, hy: ty - 56 * s }; };
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, 3 * Math.max(0.6, h), C.skin, C.ink, 1.2)); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
const robeL = (col: string, band: string) => all(path('M-13 -40 L13 -40 L16 48 L-16 48 Z', col, C.ink, 1.4), line('M-10 -40 L12 40', band, 2.4));
const beard = (col: string = '#6b5a4a') => path('M-7 -52 C-7 -43 7 -43 7 -52 C4 -49 -4 -49 -7 -52 Z', col, C.ink, 0.9);
/** A philosopher: a small neutral figure in a long robe with a coloured band. */
const sage = (x: number, h = 1, band: string = BLUE, mood: Mood = 'calm', bearded = true) => all(fig(x, ROBE, mood, { h, bottom: ROBE }), on(x, h, robeL(ROBE, band), bearded ? beard() : ''));

// ── Signs ────────────────────────────────────────────────────────────
const check = (x: number, y: number, s = 1, col: string = GREEN) => at(x, y, s, circle(0, 0, 8, C.white, col, 1.8), line('M-4 0 L-1 3 L4 -3', col, 2.4));
const cross = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, circle(0, 0, 8, C.white, col, 1.8), line('M-3.5 -3.5 L3.5 3.5 M3.5 -3.5 L-3.5 3.5', col, 2.4));
const qm = (x: number, y: number, size = 14, col: string = HL) => T(x, y + size * 0.36, '?', size, col);
const bang = (x: number, y: number, size = 14, col: string = HL) => T(x, y + size * 0.36, '!', size, col);
const sign = (x: number, y: number, s: string, size = 14, col: string = HL) => T(x, y + size * 0.36, s, size, col);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.2);
const dashRing = (x: number, y: number, rx: number, ry: number, col: string = HL) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="${col}" stroke-width="2" stroke-dasharray="4 3"/>`;
/** Speech bubble (rounded box) with a tail ending at (tx, ty). */
const say = (cx: number, cy: number, w: number, h: number, tx: number, ty: number, inner: Svg = '', fill: string = C.white) => {
  const bx = tx < cx ? cx - w / 4 : cx + w / 4;
  return all(path(`M${f1(bx - 5)} ${f1(cy + h / 2 - 1)} L${tx} ${ty} L${f1(bx + 5)} ${f1(cy + h / 2 - 1)} Z`, fill, C.ink, 1.4), rect(cx - w / 2, cy - h / 2, w, h, fill, 6, C.ink, 1.6), rect(bx - 4.4, cy + h / 2 - 3, 8.8, 3, fill, 0, null), inner);
};
/** Thought cloud with small circles towards (tx, ty). */
const think = (cx: number, cy: number, rx: number, ry: number, tx: number, ty: number, inner: Svg = '', fill: string = C.white) => {
  const mx = (cx + tx) / 2, my = (cy + ry * 0.7 + ty) / 2;
  return all(ellipse(cx, cy, rx, ry, fill, C.ink, 1.6), circle(+f1(mx), +f1(my), 2.6, fill, C.ink, 1.1), circle(+f1((mx + tx) / 2), +f1((my + ty) / 2), 1.7, fill, C.ink, 1), inner);
};
/** A claim: a white card with a small picture inside. */
const card = (x: number, y: number, w: number, h: number, inner: Svg = '', fill: string = C.white, stroke: string = C.ink) => all(rect(x - w / 2, y - h / 2, w, h, fill, 3, stroke, 1.5), inner);
const sunI = (x: number, y: number, r = 5) => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 1.6))} ${f1(y + Math.sin(a) * (r + 1.6))} L${f1(x + Math.cos(a) * (r + 4))} ${f1(y + Math.sin(a) * (r + 4))}`, GOLD, 1.4); }), circle(x, y, r, C.yellow, C.ink, 1));
const rainI = (x: number, y: number, s = 1) => at(x, y, s, cloud(0, -2, 0.55, '#c9ced4'), line('M-5 5 l-1.6 4 M0 6 l-1.6 4 M5 5 l-1.6 4', SEA, 1.6));
const moonI = (x: number, y: number, r = 5) => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${x} ${y + r} A${f1(r * 0.7)} ${r} 0 1 1 ${x} ${y - r} Z`, '#f6e08a', C.ink, 1);
const tri = (x: number, y: number, r: number, col: string) => path(`M${x} ${f1(y - r)} L${f1(x + r * 0.9)} ${f1(y + r * 0.6)} L${f1(x - r * 0.9)} ${f1(y + r * 0.6)} Z`, col, C.ink, 1.3);
const sq = (x: number, y: number, r: number, col: string) => rect(x - r, y - r, 2 * r, 2 * r, col, 1, C.ink, 1.3);
const dot = (x: number, y: number, r: number, col: string) => circle(x, y, r, col, C.ink, 1.3);
const book = (x: number, y: number, s = 1, cover: string = '#b03a3a') => at(x, y, s,
  path('M0 6 C-8 2 -18 2 -24 6 L-24 -12 C-18 -16 -8 -16 0 -12 Z', '#fbf5e4', C.ink, 1.2), path('M0 6 C8 2 18 2 24 6 L24 -12 C18 -16 8 -16 0 -12 Z', '#fbf5e4', C.ink, 1.2),
  path('M-24 6 C-18 2 -8 2 0 6 C8 2 18 2 24 6 L24 8 C18 4 8 4 0 8 C-8 4 -18 4 -24 8 Z', cover, C.ink, 1));
const cbook = (x: number, y: number, w: number, col: string) => rect(x - w / 2, y - 5, w, 10, col, 1.5, C.ink, 1.2);
const chair = (x: number, y: number, s = 1, col: string = WOOD, sw = 1.3) => at(x, y, s, path('M-8 -26 L-8 0 M8 -10 L8 0 M-8 -10 L8 -10', 'none', col, 3), rect(-9, -12, 19, 4, col, 1, C.ink, sw), rect(-10, -28, 4, 18, col, 1, C.ink, sw));
const stone = (x: number, y: number, r: number, col = '#8d949c') => path(`M${f1(x - r)} ${f1(y + r * 0.2)} C${f1(x - r)} ${f1(y - r * 0.8)} ${f1(x + r * 0.6)} ${f1(y - r)} ${f1(x + r)} ${f1(y - r * 0.1)} C${f1(x + r * 1.1)} ${f1(y + r * 0.8)} ${f1(x - r * 0.6)} ${f1(y + r)} ${f1(x - r)} ${f1(y + r * 0.2)} Z`, col, C.ink, 1.3);
const sheep = (x: number, y: number, s = 1, wool: string = C.white, face: string = '#3d3f4a') => at(x, y, s,
  line('M-6 4 L-6 10 M5 4 L5 10', C.ink, 2), cloud(0, 0, 0.75, wool), ellipse(13, -2, 3.6, 4.6, face, C.ink, 1), circle(14, -3, 0.7, C.white, null));
/** Arms crossed over the chest of the standing figure at x. */
const crossArms = (x: number, h: number) => on(x, h, line('M-17 -12 L13 -24', C.ink, 8), line('M-17 -12 L13 -24', C.skin, 6), line('M17 -12 L-13 -24', C.ink, 8), line('M17 -12 L-13 -24', C.skin, 6));
const tree = (x: number, y: number, s = 1, col: string = GREEN) => at(x, y, s, rect(-2.5, -16, 5, 16, C.brown, 1, C.ink, 1), circle(0, -24, 11, col, C.ink, 1.2), circle(-7, -19, 7, col, C.ink, 1.2), circle(7, -19, 7, col, C.ink, 1.2));
const house = (x: number, y: number, s = 1, col = '#f2ece0', roof = '#9a4a3a') => at(x, y, s, rect(-12, -16, 24, 16, col, 1, C.ink, 1.3), path('M-15 -16 L0 -28 L15 -16 Z', roof, C.ink, 1.3), rect(-3, -9, 6, 9, '#8a5a34', 1, C.ink, 0.9));
const earth = (x: number, y: number, r: number) => all(circle(x, y, r, SEA, C.ink, 1.4), path(`M${f1(x - r * 0.6)} ${f1(y - r * 0.4)} C${f1(x - r * 0.1)} ${f1(y - r * 0.8)} ${f1(x + r * 0.2)} ${f1(y - r * 0.1)} ${f1(x - r * 0.2)} ${f1(y + r * 0.2)} C${f1(x - r * 0.6)} ${f1(y + r * 0.4)} ${f1(x - r * 0.8)} ${f1(y)} ${f1(x - r * 0.6)} ${f1(y - r * 0.4)} Z M${f1(x + r * 0.3)} ${f1(y + r * 0.1)} C${f1(x + r * 0.8)} ${f1(y - r * 0.1)} ${f1(x + r * 0.7)} ${f1(y + r * 0.6)} ${f1(x + r * 0.3)} ${f1(y + r * 0.7)} Z`, GRASS, C.ink, 0.8));
const starDot = (x: number, y: number, r = 1.4, col = '#f6e8a8') => path(`M${x} ${f1(y - r * 2)} L${f1(x + r * 0.5)} ${f1(y - r * 0.5)} L${f1(x + r * 2)} ${y} L${f1(x + r * 0.5)} ${f1(y + r * 0.5)} L${x} ${f1(y + r * 2)} L${f1(x - r * 0.5)} ${f1(y + r * 0.5)} L${f1(x - r * 2)} ${y} L${f1(x - r * 0.5)} ${f1(y - r * 0.5)} Z`, col, null);
/** A small bust for crowds. */
const bust = (x: number, y: number, top: string, s = 1, long = false) => at(x, y, s,
  long ? path('M-6 -1 C-7 8 7 8 6 -1 Z', C.hair, null) : '', path('M-8 12 C-8 4 8 4 8 12 Z', top, C.ink, 1.2), circle(0, 0, 5.4, C.skin, C.ink, 1.2),
  path('M-5.4 -1 C-5.4 -8 5.4 -8 5.4 -1 C3 -4 -3 -4 -5.4 -1 Z', C.hair, null), circle(-2, 0, 0.8, C.ink, null), circle(2, 0, 0.8, C.ink, null), line('M-1.6 2.6 Q0 3.8 1.6 2.6', C.ink, 0.8));
const scribble = (x: number, y: number, w: number, col: string = C.grey) => line(`M${x - w / 2} ${y} q${f1(w / 8)} -3 ${f1(w / 4)} 0 t${f1(w / 4)} 0 t${f1(w / 4)} 0 t${f1(w / 4)} 0`, col, 1.6);
/** A word: a small tag with a wavy line (no letters). */
const word = (x: number, y: number, col: string = HL, w = 22) => all(rect(x - w / 2, y - 6, w, 12, C.white, 6, col, 1.8), scribble(x, y, w - 8, col));
const flask = (x: number, y: number, s = 1, liquid: string = '#7fd0b0') => at(x, y, s, path('M-3 -14 L3 -14 L3 -5 L10 8 C11 11 9 12 7 12 L-7 12 C-9 12 -11 11 -10 8 L-3 -5 Z', 'rgba(220,240,252,0.7)', C.ink, 1.2), path('M-6 3 L6 3 L9.4 9 C10 11 9 11.4 7 11.4 L-7 11.4 C-9 11.4 -10 11 -9.4 9 Z', liquid, null), line('M-4 -14 L4 -14', C.ink, 1.6));
const step = (x: number, y: number, w: number, h: number, col: string) => rect(x, y, w, h, col, 1, C.ink, 1.2);
const blueprint = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x, y, w, h, PRINT, 2, C.ink, 1.4), ...Array.from({ length: Math.floor(w / 10) }, (_, i) => line(`M${x + 10 * (i + 1)} ${y + 1} L${x + 10 * (i + 1)} ${y + h - 1}`, 'rgba(255,255,255,0.18)', 0.8)), ...Array.from({ length: Math.floor(h / 10) }, (_, i) => line(`M${x + 1} ${y + 10 * (i + 1)} L${x + w - 1} ${y + 10 * (i + 1)}`, 'rgba(255,255,255,0.18)', 0.8)), inner);
const bird = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, ellipse(0, 0, 8, 5, col, C.ink, 1.1), circle(7, -4, 3.4, col, C.ink, 1.1), path('M10 -4 L14 -3 L10 -2 Z', C.orange, C.ink, 0.6), path('M-2 -2 C-6 -10 2 -10 4 -2 Z', col, C.ink, 1), circle(8, -4.6, 0.6, C.ink, null));
const fish = (x: number, y: number, s = 1, col: string = SEA) => at(x, y, s, path('M-10 0 C-4 -7 6 -7 10 0 C6 7 -4 7 -10 0 Z', col, C.ink, 1), path('M-10 0 L-16 -5 L-16 5 Z', col, C.ink, 1), circle(5, -1, 1, C.ink, null));
const puzzle = (x: number, y: number, s: number, col: string, kind: 'tabR' | 'slotL' | 'tabL' | 'slotR', inner: Svg = '') => at(x, y, s, path(
  kind === 'tabR' ? 'M-16 -16 L16 -16 L16 -6 C24 -8 24 8 16 6 L16 16 L-16 16 Z'
    : kind === 'tabL' ? 'M-16 -16 L16 -16 L16 16 L-16 16 L-16 6 C-24 8 -24 -8 -16 -6 Z'
      : kind === 'slotL' ? 'M-16 -16 L16 -16 L16 16 L-16 16 L-16 6 C-8 8 -8 -8 -16 -6 Z'
        : 'M-16 -16 L16 -16 L16 -6 C8 -8 8 8 16 6 L16 16 L-16 16 Z', col, C.ink, 1.4), inner);
/** A scarecrow of straw. */
const strawman = (x: number, y: number, s = 1) => at(x, y, s, line('M0 -40 L0 30', WOOD, 3), line('M-22 -22 L22 -22', WOOD, 3),
  path('M-14 -28 L14 -28 L12 6 L-12 6 Z', '#c99a4a', C.ink, 1.2), line('M-8 -24 L-6 2 M0 -26 L0 4 M8 -24 L6 2', '#e6c46a', 1.2),
  ...[-24, 24].map((hx) => path(`M${hx} -26 L${hx + (hx < 0 ? -4 : 4)} -18 M${hx} -26 L${hx} -17 M${hx} -26 L${hx + (hx < 0 ? 4 : -4)} -18`, 'none', '#e6c46a', 1.6)),
  circle(0, -38, 8, '#e6c46a', C.ink, 1.2), path('M-11 -42 L11 -42 L6 -50 L-6 -50 Z', '#8a5a34', C.ink, 1.1), line('M-3 -38 L-1 -38 M1 -38 L3 -38 M-3 -34 L3 -34', C.ink, 1.1), path('M-6 6 L-8 14 M0 6 L0 14 M6 6 L8 14', 'none', '#e6c46a', 1.6));

export const PHILOSOPHY_BASICS_MOTIFS: Record<string, Svg> = {
  // ── 2201 Begrepp och definition ──
  /** Many different chairs, one shared idea of a chair in the thought cloud. */
  'filg.begrepp': all(bg(), think(60, 30, 30, 20, 60, 60, all(chair(60, 44, 1, HL, 1.6), sparkle(84, 18, 4, GOLD), sparkle(36, 20, 3, GOLD))),
    line('M60 58 L22 84 M60 58 L60 84 M60 58 L98 84', HL, 1.4, '3 3'), chair(22, 110, 0.9, WOOD), chair(60, 110, 0.9, '#3f6fb5'), chair(98, 110, 0.9, GREEN), ground),
  /** A term: a word that belongs to a field – the expert in a lab coat knows it from her thick special book; a layperson (grey) does not. */
  'filg.term': all(bg(), at(28, 96, 1, rect(-22, -14, 44, 30, BLUE, 2, C.ink, 1.4), rect(-20, -12, 4, 26, '#2f5590', 0, null), flask(4, 1, 0.9, '#7fd0b0')),
    rect(36, 62, 8, 22, HL, 1, C.ink, 1), word(40, 56, HL, 26), fig(66, C.white, 'smile', { h: 0.72, hairStyle: 'long' }), on(66, 0.72, line('M-6 -40 C-10 -24 -4 -18 0 -22', C.dark, 2.4), circle(0, -22, 3, C.silver, C.ink, 1)),
    say(40, 20, 28, 20, 60, 46, word(40, 20, HL, 18)), check(68, 14, 0.6), greyed(fig(102, C.grey, 'frown', { h: 0.56 })), qm(102, 48, 14, C.grey), ground),
  /** The inner meaning: a word opens like a box and the meaning shines inside. */
  'filg.innebörd': all(bg(), circle(60, 70, 30, 'rgba(242,193,78,0.25)', null), path('M34 68 L86 68 L82 104 L38 104 Z', '#f3e6c4', C.ink, 1.5),
    path('M34 68 L24 48 L58 44 L60 68 Z', '#f8eed6', C.ink, 1.3), path('M86 68 L96 48 L62 44 L60 68 Z', '#f8eed6', C.ink, 1.3), scribble(42, 52, 16, C.grey), scribble(78, 52, 16, C.grey),
    at(60, 70, 1, path('M0 -12 L9 0 L0 12 L-9 0 Z', HL, C.ink, 1.4), line('M-9 0 L9 0 M0 -12 L-3 0 L0 12 M0 -12 L3 0 L0 12', '#ffd0c0', 0.8)), sparkle(60, 30, 6, GOLD), sparkle(40, 34, 3.5, GOLD), sparkle(80, 34, 3.5, GOLD)),
  /** A word (tag) stands for a thing: tag and dog joined by a line. */
  'filg.beteckna': all(bg(), word(32, 30, HL, 34), at(84, 92, 1.3, path('M-12 -2 C-12 -10 10 -10 12 -4 L16 -10 L18 -4 C18 2 12 4 10 4 L10 12 L6 12 L6 4 L-6 4 L-6 12 L-10 12 L-10 4 C-14 2 -14 0 -12 -2 Z', '#c9975a', C.ink, 1.2), circle(15, -6, 0.9, C.ink, null), path('M-12 -4 C-18 -8 -18 -14 -16 -16', 'none', C.ink, 1.4)),
    line('M32 38 C32 62 50 78 70 82', HL, 2, '4 3'), circle(70, 82, 2.4, HL, null), greyed(word(34, 70, C.grey, 22), dot(34, 94, 6, C.grey2), line('M34 77 L34 87', C.grey, 1.4, '2 2')), ground),
  /** A distinguishing feature: the one striped fish among plain grey fish, its stripes circled. */
  'filg.särdrag': all(bg(DAY), rect(4, 70, 112, 42, '#9fd1ec', 3, null), greyed(fish(28, 30, 1.1, C.grey2), fish(26, 92, 1.1, C.grey2), fish(96, 92, 1.1, C.grey2)),
    at(76, 52, 1.6, path('M-10 0 C-4 -7 6 -7 10 0 C6 7 -4 7 -10 0 Z', C.yellow, C.ink, 1), path('M-10 0 L-16 -5 L-16 5 Z', C.yellow, C.ink, 1), line('M-3 -5 L-3 5 M2 -5.5 L2 5.5 M6 -4 L6 4', NIGHT, 2), circle(7, -1, 0.9, C.ink, null)),
    dashRing(80, 52, 14, 15)),
  /** A criterion: a height bar at a gate; the tall child passes (tick), the small grey one not. */
  'filg.kriterium': all(bg(), line('M58 30 L58 112 M58 30 L104 30', C.dark, 3), rect(56, 26, 52, 6, HL, 2, C.ink, 1.2),
    fig(84, C.green, 'laugh', { h: 0.8 }), check(104, 44, 0.9), greyed(fig(26, C.grey, 'frown', { h: 0.52 })), line('M12 30 L50 30', HL, 1.4, '3 3'), cross(26, 52, 0.8), ground),
  /** Classifying: mixed shapes sorted by arrows into three boxes of their own kind. */
  'filg.klassificera': all(bg(), greyed(dot(30, 22, 5, C.grey2), sq(46, 26, 5, C.grey2), tri(62, 22, 6, C.grey2), dot(76, 28, 5, C.grey2), tri(90, 24, 6, C.grey2)),
    ...[[24, SEA], [60, C.yellow], [96, C.red]].map(([x, col], i) => all(path(`M${+x! - 16} 80 L${+x! + 16} 80 L${+x! + 13} 108 L${+x! - 13} 108 Z`, '#e8dcc6', C.ink, 1.4),
      i === 0 ? all(dot(+x! - 6, 76, 5, col as string), dot(+x! + 5, 74, 5, col as string)) : i === 1 ? all(sq(+x! - 6, 75, 5, col as string), sq(+x! + 6, 74, 5, col as string)) : all(tri(+x! - 6, 75, 6, col as string), tri(+x! + 6, 74, 6, col as string)),
      arrow(60, 40, +x!, 62, HL, 2.2)))),
  /** A necessary condition: without flour no cake (grey, crossed); with flour – but flour alone is not enough, something more (?) is needed. */
  'filg.nödvändigt-villkor': all(bg(), at(22, 38, 1, path('M-12 -14 L12 -14 L14 14 L-14 14 Z', C.white, C.ink, 1.4), path('M-12 -14 L-8 -20 L8 -20 L12 -14', C.white, C.ink, 1.2), path('M-6 4 C-2 -6 2 -6 6 4 Z', '#e6d3b3', C.ink, 0.8)), ring(22, 38, 20),
    sign(46, 38, '+', 16, C.ink), rect(54, 26, 22, 24, 'none', 3, C.grey, 1.6), qm(65, 38, 14, C.grey), arrow(80, 38, 90, 38, HL, 2.4),
    at(104, 44, 1, rect(-11, -10, 22, 12, '#f1d0a8', 2, C.ink, 1.2), path('M-11 -10 C-6 -16 6 -16 11 -10 Z', C.pink, C.ink, 1.1), circle(0, -16, 2.2, C.red, C.ink, 0.8)), check(104, 20, 0.7),
    greyed(rect(10, 70, 24, 28, 'none', 3, C.grey, 1.6), sign(46, 84, '+', 14, C.grey), ellipse(64, 86, 7, 9, '#fbf4e6', C.ink, 1.2), arrow(80, 84, 90, 84, C.grey, 2), rect(94, 80, 20, 12, C.grey2, 2, C.ink, 1)), cross(104, 72, 0.7), ground),
  /** A sufficient condition: rain alone makes the street wet; a hose (grey) could do it too. */
  'filg.tillräckligt-villkor': all(bg(DAY), at(46, 26, 1.8, cloud(0, 0, 1, '#9aa3ad')), line('M30 42 l-4 10 M42 44 l-4 10 M54 42 l-4 10 M66 44 l-4 10', SEA, 2.4), arrow(46, 62, 46, 80, HL, 2.6),
    rect(4, 90, 112, 22, '#8d949c', 2, null), ellipse(40, 100, 18, 4, '#5aa7d6', null), ellipse(76, 104, 12, 3, '#5aa7d6', null), check(80, 76, 1), greyed(path('M100 60 C96 70 104 80 96 92', 'none', C.grey, 3), rect(96, 54, 10, 8, C.grey, 2, null))),
  /** Unambiguous: a word tag with one single arrow to one single thing; grey: a fork with two. */
  'filg.entydig': all(bg(), word(34, 30, HL, 32), arrow(34, 40, 34, 80, HL, 3), sunI(34, 96, 8), check(60, 96, 0.9),
    greyed(word(92, 30, C.grey, 24), line('M92 38 L82 64 M92 38 L102 64', C.grey, 1.6), dot(82, 72, 5, C.grey2), sq(102, 72, 5, C.grey2))),
  /** Many meanings: one word tag with arrows to four different things. */
  'filg.mångtydig': all(bg(), word(60, 22, HL, 34), arrow(52, 30, 18, 62, HL, 2), arrow(57, 31, 46, 74, HL, 2), arrow(63, 31, 74, 74, HL, 2), arrow(68, 30, 102, 62, HL, 2),
    sunI(18, 76, 7), at(46, 90, 1, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', C.red, C.ink, 1.4)), tree(74, 102, 0.7), bird(102, 80, 1, C.sky), ground),
  /** A counterexample: the idea "all sheep are white" (thought) is broken by one black sheep. */
  'filg.motexempel': all(bg('#eef6ea'), think(54, 26, 40, 18, 30, 62, all(sheep(32, 26, 0.8), sheep(54, 28, 0.8), sheep(76, 26, 0.8))), cross(100, 18, 1),
    greyed(sheep(26, 96, 1), sheep(52, 100, 1)), sheep(88, 94, 1.3, C.black, C.black), ring(90, 92, 20), ground),
  /** A distinction: two almost equal shapes, a firm line drawn between them. */
  'filg.distinktion': all(bg(), dot(32, 56, 19, '#f2c14e'), rect(70, 37, 38, 38, '#f2c14e', 14, C.ink, 1.3),
    line('M60 14 L60 98', HL, 3.6), arrow(55, 104, 38, 104, HL, 2.2), arrow(65, 104, 82, 104, HL, 2.2)),

  // ── 2202 Påstående och slutsats ──
  /** A statement as testimony: the witness tells what she saw and her words are written down on the record. */
  'filg.utsaga': all(bg(), g('translate(0 -22)', fig(25, C.green, 'calm', { h: 0.6, hairStyle: 'long' })), rect(8, 76, 34, 36, WOOD, 2, C.ink, 1.4),
    say(40, 22, 40, 28, 28, 44, all(at(32, 24, 0.7, rect(-8, -4, 16, 7, C.red, 2, C.ink, 1), circle(-4, 4, 2.4, C.dark, null), circle(4, 4, 2.4, C.dark, null)), tree(50, 32, 0.4))),
    arrow(62, 30, 76, 46, HL, 2.4), rect(72, 48, 36, 46, C.white, 2, C.ink, 1.4), at(84, 60, 0.6, rect(-8, -4, 16, 7, C.red, 2, C.ink, 1), circle(-4, 4, 2.4, C.dark, null), circle(4, 4, 2.4, C.dark, null)), tree(98, 66, 0.35),
    scribble(90, 76, 26, C.ink), scribble(90, 84, 26, C.ink), g('rotate(-30 104 96)', rect(102, 80, 4, 20, C.yellow, 1, C.ink, 1)), ground),
  /** A factual claim: "the tree is 10 m" can be measured – a tape beside the tree and a tick. */
  'filg.sakpåstående': all(bg(DAY), fig(20, C.orange, 'smile', { h: 0.66 }), say(52, 24, 40, 26, 30, 40, all(tree(46, 34, 0.48), sign(62, 24, '10', 9, C.ink))),
    tree(82, 112, 1.6), line('M108 112 L108 48', HL, 2.4), ...[56, 72, 88, 104].map((y) => line(`M104 ${y} L112 ${y}`, HL, 1.6)), check(104, 34, 0.9), ground),
  /** A value claim: one person loves the picture (heart), another (grey) does not – no measuring. */
  'filg.värdepåstående': all(bg(), rect(44, 18, 32, 26, '#fbf5e4', 1, WOOD, 3), path('M48 40 L56 28 L62 36 L66 30 L72 40 Z', GREEN, null), sunI(66, 24, 2.6),
    fig(28, C.red, 'love', { h: 0.62 }), say(24, 42, 22, 18, 26, 58, at(24, 43, 0.6, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', C.red, C.ink, 1.4))),
    greyed(fig(92, C.grey, 'frown', { h: 0.62 }), say(96, 42, 22, 18, 94, 58, cross(96, 42, 0.6, C.grey))), ground),
  /** Truth value: a claim card on a switch with two positions, tick and cross; the lever is on the tick. */
  'filg.sanningsvärde': all(bg(), card(60, 26, 44, 28, sunI(60, 26, 7)), line('M60 40 L60 56', C.ink, 2), rect(26, 56, 68, 30, '#e6e9ee', 8, C.ink, 1.6),
    check(40, 71, 1.1), cross(80, 71, 1.1, C.grey), line('M60 82 L44 64', C.dark, 4), circle(60, 82, 4, C.dark, C.ink, 1), circle(44, 64, 3.4, HL, C.ink, 1), ring(40, 71, 12), ground),
  /** Well-founded: a claim card resting on three firm pillars of books. */
  'filg.välgrundad': all(bg(), card(60, 24, 64, 22, all(sunI(48, 24, 5), sign(70, 24, '=', 12, C.ink), check(84, 24, 0.7))),
    ...[34, 60, 86].map((x, i) => all(cbook(x, 44, 20, ['#b03a3a', BLUE, GREEN][i]!), cbook(x, 54, 18, [GREEN, '#b07a2a', '#b03a3a'][i]!), cbook(x, 64, 20, [BLUE, '#b03a3a', '#b07a2a'][i]!), cbook(x, 74, 18, ['#b07a2a', GREEN, BLUE][i]!), cbook(x, 84, 20, [GREEN, BLUE, '#b03a3a'][i]!), cbook(x, 94, 18, ['#b03a3a', '#b07a2a', GREEN][i]!), cbook(x, 104, 20, [BLUE, GREEN, '#b07a2a'][i]!))),
    rect(20, 34, 80, 2, C.ink, 0, null), ground),
  /** Groundless: a claim card floating on air above empty dashed pillars, falling. */
  'filg.grundlös': all(bg(), g('rotate(-10 60 30)', card(60, 30, 60, 22, all(sunI(48, 30, 5), qm(76, 30, 12, C.red)))), line('M26 50 L26 110 M60 50 L60 110 M94 50 L94 110', C.grey, 1.6, '4 4'),
    arrow(96, 40, 106, 60, HL, 2.4), path('M34 46 C40 42 46 50 52 46', 'none', C.grey, 1.4), cross(104, 82, 1), ground),
  /** Overconfident: arms crossed, eyes shut, a big "!" – though the card he holds up is wrong. */
  'filg.tvärsäker': all(bg(), fig(44, C.purple, 'calm', { h: 0.92 }), crossArms(44, 0.92),
    say(86, 24, 30, 30, 58, 30, bang(86, 24, 22, HL)), card(92, 76, 30, 22, all(sunI(86, 76, 4), cross(100, 76, 0.6))), ground),
  /** Follows from: when the first tile (rain) falls, the second (wet street) must fall too. */
  'filg.följa-av': all(bg(), g('rotate(22 40 104)', rect(16, 30, 24, 74, C.white, 3, C.ink, 1.6), rainI(28, 56, 1.1)), g('rotate(8 92 104)', rect(68, 30, 24, 74, C.white, 3, HL, 2), ellipse(80, 66, 9, 3, SEA, null), line('M72 74 L88 74', '#8d949c', 3)),
    line('M14 40 C16 26 26 18 38 18', HL, 2, '3 3'), line('M98 30 C104 34 108 42 108 50', HL, 2, '3 3'), arrow(102, 44, 108, 54, HL, 2), line('M10 104 L112 104', C.ink, 2), ground),
  /** Therefore: two cards, the sign ∴ and the conclusion below. */
  'filg.följaktligen': all(bg(), card(30, 22, 40, 22, dot(30, 22, 6, SEA)), card(90, 22, 40, 22, sq(90, 22, 6, C.yellow)), sign(60, 54, '∴', 30, HL),
    card(60, 92, 60, 28, all(dot(48, 92, 6, SEA), sq(72, 92, 6, C.yellow)), '#fff7e8', HL)),
  /** Deriving: a robed figure climbs steps, one by one, from a card at the bottom to the conclusion at the top. */
  'filg.härleda': all(bg(), ...[0, 1, 2, 3].map((i) => step(20 + i * 22, 96 - i * 18, 24, 16 + i * 18, ['#e6d3b3', '#dcc6a0', '#d2b98c', '#c8ac78'][i]!)), card(24, 88, 14, 10, dot(24, 88, 2.6, SEA)),
    card(100, 26, 26, 18, all(dot(94, 26, 3.4, SEA), sq(106, 26, 3.4, C.yellow)), '#fff7e8', HL), g('translate(0 -36)', sage(64, 0.5, BLUE, 'smile', false)), arrow(30, 84, 46, 68, HL, 2), arrow(76, 50, 90, 38, HL, 2), ground),

  // ── 2203 Argument och premiss ──
  /** Premises: two coloured cards at the bottom carry the grey conclusion above. */
  'filg.premiss': all(bg(), card(34, 92, 44, 28, dot(34, 92, 7, SEA), '#fff7e8', HL), card(86, 92, 44, 28, sq(86, 92, 7, C.yellow), '#fff7e8', HL), 
    greyed(path('M30 76 L60 54 L90 76', 'none', C.grey, 2), card(60, 34, 50, 26, all(dot(50, 34, 6, C.grey2), sq(70, 34, 6, C.grey2))))),
  /** Inference: the bold step (arrow) from the premise cards to the conclusion. */
  'filg.slutledning': all(bg(), greyed(card(30, 22, 40, 22, dot(30, 22, 6, C.grey2)), card(90, 22, 40, 22, sq(90, 22, 6, C.grey2)), card(60, 96, 58, 22, all(dot(50, 96, 5, C.grey2), sq(70, 96, 5, C.grey2)))),
    path('M30 36 C30 56 60 48 60 62 M90 36 C90 56 60 48 60 62', 'none', HL, 3.4), arrow(60, 58, 60, 80, HL, 4.2), sparkle(80, 66, 5, GOLD), sparkle(40, 66, 3.5, GOLD)),
  /** Deduction: from the general (many in a wide funnel) down to one single case. */
  'filg.deduktion': all(bg(), path('M14 14 L106 14 L70 66 L70 84 L50 84 L50 66 Z', '#e6f0fa', C.ink, 1.6), ...[[26, 24], [42, 22], [58, 26], [74, 22], [92, 24], [36, 38], [54, 40], [72, 38], [60, 54]].map(([x, y]) => bird(x!, y!, 0.6, C.white)),
    arrow(60, 86, 60, 96, HL, 3), bird(60, 104, 1, HL), ring(62, 102, 11)),
  /** Induction: many single cases (sunrises) lead up to one general rule. */
  'filg.induktion': all(bg('#fff4e0'), ...[16, 38, 60, 82, 104].map((x) => all(line(`M${x - 9} 104 L${x + 9} 104`, C.ink, 1.4), path(`M${x - 7} 104 A7 7 0 0 1 ${x + 7} 104 Z`, C.yellow, C.ink, 1), arrow(x, 94, 60 + (x - 60) * 0.3, 60, HL, 1.8))),
    card(60, 34, 70, 34, all(...[40, 52, 64, 76].map((x) => path(`M${x - 5} 40 A5 5 0 0 1 ${x + 5} 40 Z`, C.yellow, C.ink, 0.8)), line('M32 40 L88 40', C.ink, 1), sign(86, 28, '…', 12, C.ink)), '#fff7e8', HL)),
  /** An error in the argument: a chain of cards that looks fine, but the magnifier shows the broken step in the middle. */
  'filg.argumentationsfel': all(bg(), card(18, 30, 24, 20, dot(18, 30, 5, SEA)), card(60, 30, 24, 20, sq(60, 30, 5, C.yellow)), card(102, 30, 24, 20, all(tri(102, 31, 6, C.green), cross(110, 22, 0.5))),
    arrow(31, 30, 46, 30, C.ink, 2), line('M73 30 L79 26 L81 34 L88 30', C.red, 2.4), arrow(84, 30, 89, 30, C.red, 2),
    circle(80, 72, 20, 'rgba(255,255,255,0.85)', C.dark, 3), line('M94 86 L108 102', C.dark, 6), line('M66 72 L74 64 L80 78 L86 68 L94 72', C.red, 3), bolt(80, 72, 0.5),
    fig(30, C.purple, 'smile', { h: 0.62 }), ground),
  /** A straw man: one person hits a scarecrow, while the real opponent stands untouched with her own view. */
  'filg.halmgubbe': all(bg(), strawman(60, 74, 0.9), fig(22, C.red, 'angry', { h: 0.7 }), reach(22, 0.7, 1, 46, 62), bolt(48, 54, 0.6),
    greyed(fig(100, C.grey, 'frown', { h: 0.62 }), path('M90 22 L112 22 L112 38 L100 38 L96 44 L96 38 L90 38 Z', C.white, C.ink, 1.2), dot(101, 30, 4, C.grey2)), ground),
  /** A circular argument: card A leads to card B and back again, round and round. */
  'filg.cirkelresonemang': all(bg(), path('M60 24 A34 34 0 1 1 26 58', 'none', HL, 3), path('M26 58 L20 50 L32 52 Z', HL, HL, 1), line('M60 92 A34 34 0 0 1 26 58', HL, 3),
    card(60, 24, 34, 22, dot(60, 24, 6, SEA)), card(60, 92, 34, 22, dot(60, 92, 6, SEA)), path('M94 58 L100 66 L88 64 Z', HL, HL, 1), qm(60, 58, 16, C.grey)),
  /** A tenable argument: arrows of criticism bounce off a firm card-shield; grey: a cracked card. */
  'filg.hållbar.3': all(bg(), at(48, 58, 1.6, path('M0 -16 L14 -11 C14 4 8 12 0 17 C-8 12 -14 4 -14 -11 Z', '#fff7e8', C.ink, 1.6), dot(0, -2, 5, SEA)), check(48, 96, 0.9),
    ...[[100, 30, 76, 44], [104, 58, 78, 58], [100, 86, 76, 72]].map(([x1, y1, x2, y2]) => all(line(`M${x1} ${y1} L${x2} ${y2}`, C.dark, 2), path(`M${x2} ${y2} l6 -4 l0 8 Z`, C.dark, null))), sparkle(72, 46, 4, GOLD), sparkle(72, 72, 4, GOLD),
    greyed(card(100, 104, 22, 12, line('M96 98 L100 104 L98 110', C.grey, 1.2)))),

  // ── 2204 Logik och motsägelse ──
  /** To contradict: one bubble says sun, the other night, about the same moment – they clash. */
  'filg.motsäga': all(bg(), fig(22, C.green, 'angry', { h: 0.66 }), fig(98, C.orange, 'angry', { h: 0.66, hairStyle: 'long' }), say(34, 26, 40, 30, 22, 52, sunI(34, 26, 8)), say(86, 26, 40, 30, 98, 52, all(rect(68, 13, 36, 26, NIGHT, 5, null), moonI(86, 26, 7), starDot(76, 18, 1.2), starDot(96, 34, 1.2))), bolt(60, 26, 0.9), ground),
  /** Self-contradiction: one head, two bubbles that say opposite things. */
  'filg.självmotsägelse': all(bg(), fig(60, C.purple, 'shock', { h: 0.82 }), say(26, 26, 36, 28, 52, 46, sunI(26, 26, 7)), say(94, 26, 36, 28, 68, 46, all(rect(78, 14, 32, 24, NIGHT, 5, null), moonI(94, 26, 6))), bolt(60, 16, 0.7), ground),
  /** Full of contradictions: a story scroll where every panel clashes with the next. */
  'filg.motsägelsefull': all(bg(), rect(10, 20, 100, 76, PARCH, 2, C.ink, 1.4), rect(6, 16, 6, 84, '#d9c08a', 2, C.ink, 1.1), rect(108, 16, 6, 84, '#d9c08a', 2, C.ink, 1.1),
    card(32, 40, 30, 26, sunI(32, 40, 6)), card(88, 40, 30, 26, rainI(88, 40, 1)), card(32, 76, 30, 26, all(rect(18, 64, 28, 24, NIGHT, 2, null), moonI(32, 76, 6))), card(88, 76, 30, 26, sunI(88, 76, 6)),
    bolt(60, 40, 0.55), bolt(60, 76, 0.55), bolt(32, 58, 0.45), bolt(88, 58, 0.45)),
  /** Inconsistent: she says "no sweets" but holds a sweet; grey: says and does the same. */
  'filg.inkonsekvent': all(bg(), fig(42, C.pink, 'blush', { h: 0.86, hairStyle: 'long' }), say(86, 26, 36, 30, 52, 30, all(ellipse(86, 26, 7, 4.4, C.red, C.ink, 1), path('M79 26 L74 22 L74 30 Z M93 26 L98 22 L98 30 Z', C.red, C.ink, 0.8), circle(86, 26, 11, 'none', C.red, 2.4), line('M78 34 L94 18', C.red, 2.4))),
    reach(42, 0.86, 1, 70, 72), at(78, 72, 1, ellipse(0, 0, 7, 4.4, C.red, C.ink, 1), path('M-7 0 L-12 -4 L-12 4 Z M7 0 L12 -4 L12 4 Z', C.red, C.ink, 0.8)), ring(78, 72, 13), qm(104, 62, 14, HL), ground),
  /** Incompatible: two puzzle pieces that cannot join (red cross); grey: two that fit. */
  'filg.oförenlig': all(bg(), puzzle(36, 44, 1, '#f2d9a0', 'tabR', dot(0, 0, 6, SEA)), puzzle(84, 44, 1, '#bfe3f5', 'tabL', sq(0, 0, 6, C.yellow)), cross(60, 16, 1),
    greyed(puzzle(44, 94, 0.6, C.grey2, 'tabR'), puzzle(63, 94, 0.6, C.grey2, 'slotL')), check(90, 94, 0.8, C.grey)),
  /** Mutually exclusive: day and night as two separate circles – the overlap is empty and crossed. */
  'filg.utesluta-varandra': all(bg(), circle(34, 50, 26, '#fff1b8', C.ink, 1.6), sunI(34, 50, 10), circle(86, 50, 26, NIGHT, C.ink, 1.6), moonI(86, 50, 10), starDot(76, 36, 1.4), starDot(98, 62, 1.4),
    cross(60, 50, 0.9), greyed(circle(50, 98, 11, C.grey2, C.ink, 1), circle(66, 98, 11, C.grey2, C.ink, 1), ellipse(58, 98, 4, 8, C.grey, null))),
  /** Absurd: a fish riding a bicycle, a laughing onlooker; grey: a fish in its bowl. */
  'filg.absurd': all(bg(DAY), at(54, 84, 1, circle(-18, 14, 12, 'none', C.ink, 2.4), circle(20, 14, 12, 'none', C.ink, 2.4), line('M-18 14 L-2 -4 L14 -4 L20 14 M-2 -4 L2 14 L14 -4 M-6 -10 L2 -10 M14 -4 L14 -14 L20 -14', C.red, 2.4)),
    at(56, 64, 1.3, path('M-10 0 C-4 -7 6 -7 10 0 C6 7 -4 7 -10 0 Z', C.orange, C.ink, 1), path('M-10 0 L-16 -5 L-16 5 Z', C.orange, C.ink, 1), circle(5, -1, 1, C.ink, null)), arm(60, 66, 66, 72),
    fig(100, C.green, 'laugh', { h: 0.62 }), sign(88, 24, '!', 18, HL), greyed(ellipse(18, 30, 12, 10, '#d8eef8', C.ink, 1.2), fish(18, 32, 0.6, C.grey2)), ground),
  /** A paradox: an impossible triangle. */
  'filg.paradox': all(bg(), card(60, 22, 50, 22, scribble(60, 22, 34, C.ink)), line('M60 33 L60 46', C.ink, 1.6), check(32, 72, 1.5), cross(88, 72, 1.5),
    path('M44 62 C54 52 66 52 76 62', 'none', HL, 2.6), path('M76 62 L68 60 L72 54 Z', HL, HL, 1), path('M76 84 C66 94 54 94 44 84', 'none', HL, 2.6), path('M44 84 L52 86 L48 92 Z', HL, HL, 1), qm(60, 104, 14, C.dark)),
  /** A fallacy in thought: in the thought cloud the path takes the wrong turn and ends in a cross. */
  'filg.tankefel': all(bg(), fig(28, C.denim, 'frown', { h: 0.72 }), think(76, 36, 38, 28, 36, 62, all(circle(46, 46, 3, C.ink, null), line('M46 46 L66 34', C.ink, 2), line('M66 34 L92 22', C.grey, 1.6, '3 3'), check(98, 20, 0.6, C.grey), line('M66 34 L90 50', HL, 2.4), cross(96, 52, 0.7))), ground),

  // ── 2205 Sanning och kunskap ──
  /** Knowledge: a head in profile, full of ordered books, a globe and a tick. */
  'filg.kunskap': all(bg(), path('M30 104 L30 86 C14 80 12 54 22 36 C34 14 74 8 90 30 C100 44 98 58 92 66 L100 78 L92 80 L92 90 C86 96 76 94 70 92 L70 104 Z', '#f6dcc4', C.ink, 1.8),
    line('M28 52 L84 52 M28 70 L84 70', WOOD, 2.4), ...[[34, BLUE], [42, '#b03a3a'], [50, GREEN], [58, '#b07a2a']].map(([x, col]) => rect(+x! - 3, 38, 6, 13, col as string, 1, C.ink, 0.9)), earth(74, 42, 8),
    ...[[36, GREEN], [44, BLUE], [52, '#b03a3a']].map(([x, col]) => rect(+x! - 3, 56, 6, 13, col as string, 1, C.ink, 0.9)), check(72, 62, 0.8)),
  /** An untruth: he says "sunshine" while it is raining – the bubble is crossed. */
  'filg.osanning': all(bg('#d9e2ea'), line('M10 10 l-3 8 M30 6 l-3 8 M50 12 l-3 8 M70 6 l-3 8 M90 10 l-3 8 M108 6 l-3 8 M18 30 l-3 8 M100 30 l-3 8', SEA, 1.6),
    fig(36, C.navy, 'smile', { h: 0.8 }), path('M20 46 C24 30 48 30 52 46 Z', '#4f5866', C.ink, 1.2), line('M36 46 L36 54', C.ink, 1.4),
    say(86, 46, 36, 30, 50, 56, sunI(86, 46, 7)), cross(102, 30, 1), ground),
  /** Relative: two equal orange circles – among big ones it looks small, among small ones big. */
  'filg.relativ': all(bg(), greyed(...[[16, 30], [44, 18], [16, 62], [44, 74]].map(([x, y]) => circle(x!, y!, 12, C.grey2, C.ink, 1)), ...[[86, 32], [100, 40], [100, 56], [86, 64], [72, 56], [72, 40]].map(([x, y]) => circle(x!, y!, 4.6, C.grey2, C.ink, 1))),
    circle(32, 46, 8, C.orange, C.ink, 1.4), circle(86, 48, 8, C.orange, C.ink, 1.4), line('M32 58 L32 92 L86 92 L86 62', HL, 1.6, '3 3'), sign(59, 104, '=', 16, HL)),
  /** Universally valid: a card with 2+2=4 above the globe; people all around the world agree. */
  'filg.allmängiltig': all(bg('#eef4fb'), card(60, 22, 54, 22, sign(60, 22, '2+2=4', 13, C.ink), '#fff7e8', HL), earth(60, 76, 24),
    ...[[24, 60, C.red], [96, 60, C.green], [22, 96, C.purple], [98, 96, C.orange], [60, 108, BLUE]].map(([x, y, col]) => all(bust(+x!, +y! - 6, col as string, 0.8), check(+x! + (+x! < 60 ? -10 : 10), +y! - 14, 0.5))),
    line('M60 34 L60 50', HL, 1.6, '3 3')),
  /** Falsify: a beam from a test hits the theory card and it cracks. */
  'filg.falsifiera': all(bg(), rect(70, 20, 40, 30, C.white, 3, C.ink, 1.5), ...[78, 90, 102].map((x) => bird(x, 34, 0.55, C.white)), path('M88 20 L84 30 L92 38 L86 50', 'none', C.red, 2),
    flask(30, 92, 1.6), line('M36 74 L78 46', HL, 3), sparkle(80, 44, 6, GOLD), bird(40, 60, 0.7, C.black), cross(100, 66, 0.9), fig(64, '#f6f6f6', 'smile', { h: 0.5 }), ground),
  /** A long-held error: the old scroll shows the sun circling the earth, many nod – and it is crossed. */
  'filg.villfarelse': all(bg(), rect(18, 12, 84, 58, PARCH, 2, C.ink, 1.4), rect(14, 8, 6, 66, '#d9c08a', 2, C.ink, 1), rect(100, 8, 6, 66, '#d9c08a', 2, C.ink, 1),
    ellipse(60, 40, 30, 18, 'none', '#9a8f7a', 1.2), earth(60, 40, 8), sunI(88, 34, 4.4), arrow(84, 52, 74, 57, '#9a8f7a', 1.6), cross(92, 18, 0.8),
    ...[[22, C.red], [42, GREEN], [62, BLUE], [82, C.orange], [100, C.purple]].map(([x, col]) => bust(+x!, 94, col as string, 1)), ground),

  // ── 2206 Tankeexperiment ──
  /** A thought experiment: the experiment (two stones tied together, falling) happens inside the thought cloud. */
  'filg.tankeexperiment': all(bg(), sage(24, 0.76, GREEN, 'calm'), think(76, 40, 36, 32, 34, 54, all(line('M66 32 L86 32', C.brown, 1.8), stone(64, 32, 9), stone(88, 32, 5), line('M60 46 L60 58 M64 46 L64 56 M86 42 L86 56 M90 42 L90 54', HL, 1.4), arrow(76, 48, 76, 64, HL, 2.4), line('M50 68 L102 68', C.grey, 1.6), qm(100, 18, 10, HL))),
    greyed(rect(84, 96, 26, 4, C.grey, 1, null), flask(96, 92, 0.6, C.grey2)), ground),
  /** Imagine: eyes closed, she sees herself flying in the thought cloud. */
  'filg.tänka-sig': all(bg(), fig(30, C.orange, 'calm', { h: 0.8, hairStyle: 'long' }), think(80, 34, 32, 26, 42, 50, all(ellipse(80, 34, 30, 24, '#dff0fb', null), cloud(66, 46, 0.5, C.white), cloud(96, 44, 0.45, C.white), g('translate(0 -64)', fig(80, C.orange, 'laugh', { h: 0.32, hairStyle: 'long' })), bird(98, 22, 0.5, C.sky), sparkle(64, 22, 3, GOLD))), ground),
  /** Hypothetical: a dashed house on an empty plot – only thought, not real; grey: a real house. */
  'filg.hypotetisk': all(bg(DAY), rect(4, 96, 112, 16, GRASS, 0, null), `<g stroke-dasharray="4 3">${all(path('M30 96 L30 62 L66 62 L66 96 Z', 'rgba(255,255,255,0.5)', HL, 2), path('M24 62 L48 40 L72 62 Z', 'rgba(255,255,255,0.5)', HL, 2))}</g>`, qm(48, 78, 16, HL),
    greyed(house(96, 96, 1)), ground),
  /** Scenarios: a road forks into three possible futures – sun, cloud, storm. */
  'filg.scenario': all(bg(), path('M54 112 L66 112 L62 70 L58 70 Z', '#cbbf9f', C.ink, 1), path('M60 72 L24 40 M60 72 L60 34 M60 72 L96 40', 'none', '#cbbf9f', 6), line('M60 72 L24 40 M60 72 L60 34 M60 72 L96 40', C.ink, 0.6, '3 3'),
    circle(22, 24, 14, '#fff1b8', C.ink, 1.2), sunI(22, 24, 6), circle(60, 20, 14, '#e6e9ee', C.ink, 1.2), cloud(60, 20, 0.6, C.white), circle(98, 24, 14, '#9aa3ad', C.ink, 1.2), bolt(98, 24, 0.6), fig(60, C.green, 'smile', { h: 0.4 }), ground),
  /** Fictional: a castle and a winged horse rise out of an open book on dashed clouds. */
  'filg.fiktiv': all(bg('#f3ecf7'), book(60, 96, 1.6, '#8a6bbf'), `<g stroke-dasharray="3 3">${all(path('M24 80 C20 60 40 56 44 64 C50 48 76 48 78 62 C86 56 100 64 96 80', 'none', '#8a6bbf', 1.6))}</g>`,
    at(52, 60, 1, rect(-12, -14, 24, 22, '#efe6d2', 1, C.ink, 1.2), rect(-16, -24, 8, 32, '#efe6d2', 1, C.ink, 1.2), rect(8, -24, 8, 32, '#efe6d2', 1, C.ink, 1.2), path('M-17 -24 L-12 -32 L-7 -24 Z M7 -24 L12 -32 L17 -24 Z', C.purple, C.ink, 1), path('M-4 8 L-4 0 C-4 -4 4 -4 4 0 L4 8 Z', '#8a5a34', C.ink, 1)),
    g('translate(0 -34)', fig(80, C.purple, 'smile', { h: 0.36, hairStyle: 'long' })), at(80, 26, 1, path('M-5 -2 L-3 -7 L0 -3 L3 -7 L5 -2 Z', GOLD, C.ink, 0.8)), moonI(100, 22, 5), sparkle(28, 30, 4, GOLD), sparkle(70, 16, 3, GOLD)),
  /** What if …: in front of a closed door, she pictures it open onto a sunny world. */
  'filg.tänk-om': all(bg(), rect(14, 40, 30, 72, WOOD, 2, C.ink, 1.4), circle(38, 78, 2, GOLD, C.ink, 0.8), fig(62, C.denim, 'smile', { h: 0.62, hairStyle: 'long' }),
    think(88, 30, 26, 22, 66, 54, all(rect(72, 16, 14, 28, '#fff1b8', 1, C.ink, 1), path('M72 16 L66 20 L66 46 L72 44 Z', WOOD, C.ink, 1), sunI(98, 24, 4), qm(100, 40, 10, HL))), ground),
  /** Unthinkable: a man of old times can picture a candle (grey, tick), but a mobile phone does not even fit in his thoughts – it bounces off. */
  'filg.otänkbar': all(bg('#efe6d2'), fig(26, '#8a6a4a', 'shock', { h: 0.8 }), path('M16 36 L36 36 L34 30 L18 30 Z', C.black, C.ink, 1),
    think(74, 36, 30, 24, 36, 48, all(...[0, 1, 2].map((r) => all(...[0, 1, 2, 3].map((c) => rect(54 + c * 10 - (r % 2) * 5, 22 + r * 9, 10, 9, '#c4542a', 0.5, C.ink, 0.6)))), qm(74, 36, 18, C.white))),
    at(108, 70, 1, rect(-6, -11, 12, 22, C.dark, 2, C.ink, 1.2), rect(-4.6, -8, 9.2, 15, '#bfe3f5', 1, null)), arrow(102, 58, 96, 50, HL, 2), arrow(96, 50, 104, 46, HL, 2), cross(108, 92, 0.7),
    greyed(ellipse(66, 96, 12, 9, C.white, C.ink, 1.2), rect(64, 92, 4, 8, C.white, 1, C.ink, 0.8), circle(66, 90, 2, C.yellow, null)), check(84, 96, 0.6, C.grey), ground),
  /** Counter-intuitive: she expected the heavy stone to land first (thought, crossed) – in reality both land at the same moment (tick) and she is amazed. */
  'filg.kontraintuitiv': all(bg(DAY), fig(20, C.orange, 'shock', { h: 0.62 }), bang(36, 52, 14, HL),
    think(36, 22, 30, 16, 22, 52, all(stone(26, 28, 6), stone(46, 18, 3.6), line('M14 34 L58 34', C.grey, 1.2))), cross(62, 12, 0.7),
    stone(76, 102, 10), stone(100, 106, 6), line('M60 112 L114 112', C.ink, 2.4), line('M70 62 L70 72 M82 62 L82 72 M97 70 L97 78 M103 70 L103 78', HL, 1.6), sign(88, 56, '=', 16, HL), check(98, 34, 0.9), ground),
  /** In theory: on the blueprint the bridge spans the river perfectly – tick. */
  'filg.i-teorin': all(bg(), blueprint(10, 16, 100, 70, all(path('M20 70 L40 70 L40 50 M80 50 L80 70 L100 70', 'none', C.white, 1.6), path('M36 50 C50 30 70 30 84 50 Z', 'none', C.white, 1.6), line('M36 50 L84 50', C.white, 1.8), line('M40 74 C50 70 70 78 80 74', '#bfe3f5', 1.4), line('M26 30 L46 30 M26 28 L26 32 M46 28 L46 32', C.white, 1))),
    check(96, 30, 0.9), at(28, 100, 1, line('M-14 6 L14 -6', C.yellow, 4), line('M-14 6 L14 -6', C.ink, 0.6)), line('M66 98 L72 86 L78 98', C.dark, 1.6), circle(72, 86, 2, C.dark, null), ground),
  /** In practice: real hands build the bridge – it is crooked and needs tools; the plan (grey) lies aside. */
  'filg.i-praktiken': all(bg(DAY), rect(4, 86, 112, 26, SEA, 0, null), rect(4, 70, 26, 42, '#b79a6a', 1, C.ink, 1.2), rect(90, 70, 26, 42, '#b79a6a', 1, C.ink, 1.2), path('M30 72 L58 70 L88 78 L88 82 L58 75 L30 77 Z', WOOD, C.ink, 1.4),
    g('translate(0 -42)', fig(16, C.orange, 'frown', { h: 0.5 }), reach(16, 0.5, 1, 34, 104)), at(36, 60, 0.8, rect(-2, -10, 4, 14, C.dark, 1, null), rect(-6, -14, 12, 6, C.grey, 1, C.ink, 1)), sign(66, 58, '!', 14, HL), bolt(80, 60, 0.4),
    greyed(blueprint(84, 14, 30, 22, line('M88 28 L110 28', C.white, 1.2)))),

  // ── 2207 Filosofisk diskussion ──
  /** Philosophical: the big kind of question – a glowing question card about the universe; an everyday question (when does the bus come?) is grey. */
  'filg.filosofisk': all(bg(), circle(56, 46, 40, 'rgba(242,193,78,0.25)', null), rect(20, 12, 72, 64, NIGHT, 6, C.ink, 1.8), ...[[28, 20], [84, 22], [30, 66], [80, 68], [56, 18]].map(([x, y]) => starDot(x!, y!, 1.6)),
    earth(42, 46, 12), moonI(72, 30, 5), qm(74, 52, 24, C.yellow), path('M40 76 L48 76 L44 84 Z', NIGHT, C.ink, 1.2),
    greyed(rect(70, 86, 42, 22, C.white, 4, C.ink, 1.2), rect(76, 92, 16, 10, C.grey2, 2, C.ink, 1), circle(80, 104, 1.6, C.ink, null), circle(88, 104, 1.6, C.ink, null), qm(102, 97, 12, C.grey))),
  /** Wonder: wide eyes, hands raised, gazing up at a sky full of sparkles. */
  'filg.förundran': all(bg('#1f2d55'), ...[[16, 18, 5], [34, 34, 3], [54, 12, 6], [80, 26, 4], [100, 14, 5], [96, 46, 3], [24, 52, 3]].map(([x, y, r]) => sparkle(x!, y!, r!, '#f6e8a8')), circle(70, 22, 9, 'rgba(242,193,78,0.35)', null),
    fig(60, C.green, 'shock', { h: 0.72, hairStyle: 'long' }), reach(60, 0.72, -1, 40, 50), reach(60, 0.72, 1, 80, 50), rect(4, 108, 112, 4, '#3e4c7a', 0, null)),
  /** A Socratic conversation: people sit in a ring around a robed elder, questions travel between them. */
  'filg.sokratiskt-samtal': all(bg(), ellipse(60, 100, 52, 10, '#e8dcc6', null), sage(60, 0.7, BLUE, 'smile'),
    ...[[18, C.red, 'long'], [40, GREEN, 'short'], [82, C.orange, 'long'], [102, C.purple, 'short']].map(([x, col, hs]) => g('translate(0 6)', fig(+x!, col as string, 'smile', { h: 0.5, hairStyle: hs as 'long' | 'short' }))),
    qm(26, 28, 14, HL), qm(60, 18, 14, C.denim), qm(94, 28, 14, HL), line('M34 30 C44 20 50 20 54 22 M68 22 C72 20 78 20 86 30', HL, 1.4, '2 3'), ground),
  /** The conversation leader stands in the middle and gives the turns: a ball goes to speaker 1, the next speaker waits for turn 2. */
  'filg.samtalsledare': all(bg(), ellipse(60, 104, 54, 8, '#e8dcc6', null), fig(60, C.denim, 'smile', { h: 0.86 }), reach(60, 0.86, -1, 34, 58), reach(60, 0.86, 1, 86, 58), circle(30, 56, 5, HL, C.ink, 1.2),
    ...[[16, C.red, 'long', '1'], [104, GREEN, 'short', '2']].map(([x, col, hs, n]) => all(fig(+x!, col as string, 'smile', { h: 0.55, hairStyle: hs as 'long' | 'short' }), circle(+x!, 38, 7, C.white, C.ink, 1.2), sign(+x!, 38, n as string, 10, n === '1' ? HL : C.ink))),
    ground),
  /** A train of thought: in the thought cloud stepping stones are joined one after the other. */
  'filg.tankegång': all(bg(), fig(26, C.purple, 'calm', { h: 0.74 }), think(76, 40, 38, 30, 38, 54, all(...[[48, 52], [60, 38], [74, 50], [88, 34], [100, 44]].map(([x, y], i, a) => all(i ? line(`M${a[i - 1]![0]} ${a[i - 1]![1]} L${x} ${y}`, HL, 2) : '', circle(x!, y!, 4, i === a.length - 1 ? HL : C.white, C.ink, 1.2))))), ground),
  /** Nuance: a brush paints all the shades between dark and light; grey: just two blocks. */
  'filg.nyansera': all(bg(), ...['#1f3a5f', '#2f5f9e', '#3f7fc4', '#6aa3db', '#9fc6ec', '#d4e6f7'].map((c, i) => rect(14 + i * 15, 24, 15, 34, c, 0, C.ink, 1)), rect(14, 24, 90, 34, 'none', 2, C.ink, 1.6),
    g('rotate(30 86 72)', rect(82, 60, 8, 34, WOOD, 2, C.ink, 1.2), path('M82 60 L90 60 L88 50 L84 50 Z', '#6aa3db', C.ink, 1)), greyed(rect(20, 84, 22, 20, C.black, 1, C.ink, 1), rect(42, 84, 22, 20, C.white, 1, C.ink, 1))),
  /** Black-and-white thinking: arms crossed, the thought only knows black (cross) or white (tick). */
  'filg.svartvit': all(bg(), fig(30, C.red, 'angry', { h: 0.8 }), crossArms(30, 0.8),
    think(82, 40, 30, 28, 44, 50, all(rect(60, 24, 22, 30, C.black, 2, C.ink, 1.2), rect(82, 24, 22, 30, C.white, 2, C.ink, 1.2), cross(71, 39, 0.6, C.white), check(93, 39, 0.6, C.ink))),
    ground),
  /** Disagreement: two calm people, one thinks circle, the other square – with ≠ between them. */
  'filg.meningsskiljaktighet': all(bg(), fig(24, C.green, 'smile', { h: 0.72 }), fig(96, C.orange, 'smile', { h: 0.72, hairStyle: 'long' }), say(30, 28, 32, 26, 24, 50, dot(30, 28, 7, SEA)), say(90, 28, 32, 26, 96, 50, sq(90, 28, 7, C.yellow)), sign(60, 30, '≠', 22, HL), ground),
};
