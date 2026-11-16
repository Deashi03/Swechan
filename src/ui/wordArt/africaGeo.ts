/**
 * Natur & geografi → Världsgeografi → Afrika, 3031–3037 (0.47): North Africa's deserts, the Sahel and the savanna,
 * the Congo Basin, the East African highlands, southern Africa's landscapes, Africa's countries and capitals, and
 * Africa's larger rivers and lakes.
 * Recurring signs: landscapes with pale sky, sand-yellow desert, ochre savanna grass, dark-green rainforest and blue
 * water; maps seen from above with pale-green land on light-blue sea, grey for what the word is NOT about and an
 * orange highlight (fill, outline or ring) on what the word names. A small grey inset shows the contrasting thing.
 * Digits only; no words, no brands, no flags or national symbols, no people shown as types, no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { HL } from './people';
import { greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const SKY = '#dcecf7';
const HOT = '#fbeccb';
const WATER = '#bfe0f2';
const WATER2 = '#7fb6d9';
const SEA = '#5fa3d0';
const SEA2 = '#3c7fb0';
const GREYLAND = '#d3d3cf';
const GRASS = '#9fcb6e';
const GRASS2 = '#7fb356';
const SAVANNA = '#e3cf7a';
const SAVANNA2 = '#c9b25a';
const FOREST = '#3f8a4f';
const FOREST2 = '#2f6e3e';
const ROCK = '#a39a8c';
const STONE = '#b9ab95';
const SAND = '#f0dca0';
const DUNE = '#e9c46a';
const DUNE2 = '#d9a94a';
const RED_EARTH = '#c46a3a';
const MUD = '#a8865a';
const SALT = '#f7f6f0';
const HLFILL = '#f6c49a';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);

// ── Scenery ──────────────────────────────────────────────────────────
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const mapBg = () => rect(4, 4, 112, 108, WATER, 3, null);
const waves = (x1: number, x2: number, y: number, col: string = SEA2) => line(range(Math.max(1, Math.floor((x2 - x1) / 10))).map((i) => `M${x1 + i * 10} ${y} q2.5 -2.5 5 0 t5 0`).join(' '), col, 1.1);
const sun = (x: number, y: number, r = 6) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 5))} ${f1(y + Math.sin(a) * (r + 5))}`, C.gold, 1.8); }), circle(x, y, r, C.yellow, C.ink, 1.3));
const cloud = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', col, C.ink, 1.2));
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.4);
const dot = (x: number, y: number, r = 2.6, col: string = C.dark) => circle(x, y, r, col, C.ink, 0.9);
/** A small standing person, feet at (x, y). */
const tiny = (x: number, y: number, s = 1, col: string = C.denim, arms = '') => at(x, y, s, line('M-2 0 L-1.5 -8 M2 0 L1.5 -8', C.ink, 1.8), path('M-3.6 -8 L3.6 -8 L3 -17 L-3 -17 Z', col, C.ink, 0.9), circle(0, -20.5, 3.2, C.skin2, C.ink, 0.9), path('M-3.2 -21 C-3.2 -25 3.2 -25 3.2 -21 C1.5 -22.5 -1.5 -22.5 -3.2 -21 Z', C.hair, null), arms ? line(arms, C.ink, 1.5) : line('M-3.2 -16 L-4.5 -9 M3.2 -16 L4.5 -9', C.ink, 1.5));
const rock = (x: number, y: number, r: number, col: string = STONE) => path(`M${f1(x - r)} ${y} L${f1(x - r * 0.8)} ${f1(y - r * 0.6)} L${f1(x - r * 0.2)} ${f1(y - r)} L${f1(x + r * 0.6)} ${f1(y - r * 0.8)} L${f1(x + r)} ${f1(y - r * 0.2)} L${f1(x + r * 0.9)} ${y} Z`, col, C.ink, 0.9);
const pebbles = (pts: number[][], col: string = '#9c9282') => all(...pts.map(([x, y, r]) => ellipse(x!, y!, r ?? 1.6, (r ?? 1.6) * 0.65, col, C.ink, 0.5)));
const dune = (x: number, y: number, w: number, h: number) => all(path(`M${x - w / 2} ${y} C${x - w / 4} ${y - h * 0.4} ${x - w / 10} ${y - h} ${x + w / 10} ${y - h} C${x + w / 4} ${y - h * 0.8} ${x + w / 3} ${y - h * 0.3} ${x + w / 2} ${y} Z`, DUNE, C.ink, 1.1), path(`M${x + w / 10} ${y - h} C${x + w / 4} ${y - h * 0.8} ${x + w / 3} ${y - h * 0.3} ${x + w / 2} ${y} L${x + w / 8} ${y} C${x + w / 6} ${y - h * 0.4} ${x + w / 8} ${y - h * 0.7} ${x + w / 10} ${y - h} Z`, DUNE2, null));
const palm = (x: number, y: number, s = 1) => at(x, y, s, path('M-2 0 C-1 -12 1 -24 3 -34 L6 -34 C4 -24 3 -12 3 0 Z', '#9a7650', C.ink, 1), ...range(5).map((i) => line(`M${-1 + i * 1.2} ${-4 - i * 6} l4 0`, '#7a5a3a', 0.6)),
  path('M4.5 -34 C-4 -40 -14 -36 -18 -28 C-10 -34 -2 -34 4.5 -33 Z', '#4f9d4a', C.ink, 0.9), path('M4.5 -34 C12 -42 22 -38 26 -30 C18 -36 10 -35 4.5 -33 Z', '#4f9d4a', C.ink, 0.9), path('M4.5 -34 C0 -44 -8 -46 -14 -44 C-6 -42 0 -38 4.5 -33 Z', '#6fb35a', C.ink, 0.9), path('M4.5 -34 C8 -46 16 -48 22 -46 C14 -42 9 -38 4.5 -33 Z', '#6fb35a', C.ink, 0.9), path('M4.5 -34 C2 -40 6 -46 4 -50 C8 -46 8 -40 4.5 -33 Z', '#4f9d4a', C.ink, 0.8));
const acacia = (x: number, y: number, s = 1) => at(x, y, s, path('M-1.5 0 L-1 -14 L-8 -24 L-6 -25 L0 -17 L6 -26 L8 -25 L1.5 -14 L1.5 0 Z', '#7a5a3a', C.ink, 0.9), path('M-24 -26 C-20 -34 20 -34 24 -26 C16 -22 -16 -22 -24 -26 Z', '#7f9e3f', C.ink, 1.1), path('M-18 -30 C-10 -34 10 -34 18 -30', 'none', '#9cbf5a', 1.4));
const baobab = (x: number, y: number, s = 1) => at(x, y, s, path('M-12 0 C-14 -14 -11 -30 -8 -40 L8 -40 C11 -30 14 -14 12 0 Z', '#b58a6a', C.ink, 1.3), line('M-6 -40 L-12 -50 L-17 -52 M-12 -50 L-11 -56 M0 -40 L0 -54 L-4 -58 M0 -54 L4 -59 M6 -40 L13 -49 L18 -50 M13 -49 L12 -55', '#8a6448', 2), ...[[-17, -53], [-11, -57], [-4, -59], [4, -60], [18, -51], [12, -56]].map(([a, b]) => ellipse(a!, b!, 3.6, 2.4, '#7f9e3f', C.ink, 0.6)), line('M-6 -10 C-5 -20 -6 -30 -4 -36 M5 -8 C6 -18 5 -28 4 -36', '#93684c', 0.8));
const savannaGround = (y = 84) => all(path(`M4 112 L4 ${y} C40 ${y - 4} 80 ${y + 2} 116 ${y - 2} L116 112 Z`, SAVANNA, C.ink, 1.1), ...range(9).map((i) => line(`M${10 + i * 12} ${y + 8 + (i % 3) * 6} l1.5 -4 l1.5 4`, SAVANNA2, 1)));
const goat = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, ellipse(0, -8, 8, 4.5, col, C.ink, 1), line('M-5 -4 L-5 0 M-2 -4 L-2 0 M3 -4 L3 0 M6 -4 L6 0', C.ink, 1.2), path('M6 -10 L10 -15 L13 -13 L11 -9 Z', col, C.ink, 0.9), line('M10 -15 L8 -19 M11 -15 L11 -19', C.ink, 0.9), line('M-8 -9 L-10 -12', C.ink, 0.9));
const cowB = (x: number, y: number, s = 1, col: string = '#c98d5a') => at(x, y, s, rect(-9, -12, 18, 8, col, 3, C.ink, 1), line('M-7 -4 L-7 0 M-3 -4 L-3 0 M4 -4 L4 0 M7 -4 L7 0', C.ink, 1.4), rect(8, -15, 6, 6, col, 2, C.ink, 1), path('M8 -15 C6 -20 4 -20 3 -19 M14 -15 C16 -20 18 -20 19 -19', 'none', C.ink, 1), circle(-3, -9, 1.8, C.white, null));
const giraffe = (x: number, y: number, s = 1) => at(x, y, s, line('M-6 -14 L-7 0 M-2 -14 L-2 0 M4 -14 L4 0 M7 -14 L8 0', C.ink, 1.6), ellipse(0, -17, 10, 5, '#e8b04a', C.ink, 1.1), path('M6 -19 L12 -42 L16 -42 L10 -16 Z', '#e8b04a', C.ink, 1), path('M11 -42 L20 -44 L21 -40 L14 -39 Z', '#e8b04a', C.ink, 1), line('M13 -43 L12 -47 M15 -43 L15 -47', C.ink, 1), ...[[-4, -17], [2, -18], [-1, -15], [12, -32], [11, -24]].map(([a, b]) => circle(a!, b!, 1.5, '#a0673d', null)));
const zebra = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, -10, 10, 5, C.white, C.ink, 1.1), line('M-6 -6 L-6 0 M-3 -6 L-3 0 M4 -6 L4 0 M7 -6 L7 0', C.ink, 1.5), path('M8 -13 L14 -18 L17 -15 L12 -9 Z', C.white, C.ink, 1), line('M-6 -15 L-6 -6 M-2 -15 L-2 -5 M2 -15 L2 -5 M6 -14 L6 -6 M10 -14 L12 -11', C.ink, 1.1));
const antelope = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, -10, 8, 4, '#c98d4a', C.ink, 1), line('M-5 -6 L-5 0 M-2 -6 L-2 0 M3 -6 L3 0 M6 -6 L6 0', C.ink, 1.2), path('M6 -12 L10 -17 L13 -15 L10 -10 Z', '#c98d4a', C.ink, 0.9), line('M10 -17 C9 -22 11 -24 12 -25 M12 -16 C12 -21 14 -23 15 -24', C.ink, 0.9), path('M-8 -10 L-4 -10 L-4 -8 L-8 -8 Z', C.white, null));
const rainTree = (x: number, y: number, s = 1, col: string = FOREST) => at(x, y, s, rect(-2.5, -40, 5, 40, '#7a5a3a', 1, C.ink, 1), ellipse(0, -46, 18, 10, col, C.ink, 1.1), ellipse(-10, -42, 9, 6, col, C.ink, 1), ellipse(10, -42, 9, 6, col, C.ink, 1));
const leafy = (x: number, y: number, r: number, col: string = FOREST2) => circle(x, y, r, col, C.ink, 0.9);
const jeep = (x: number, y: number, s = 1) => at(x, y, s, path('M-22 -4 L-22 -14 L-12 -14 L-8 -22 L12 -22 L14 -14 L22 -14 L22 -4 Z', '#cdb27a', C.ink, 1.2), rect(-6, -20, 7, 6, '#8cc7e8', 1, C.ink, 0.8), rect(4, -20, 7, 6, '#8cc7e8', 1, C.ink, 0.8), line('M-10 -22 L-10 -32 M14 -22 L14 -32 M-12 -32 L16 -32', C.ink, 1.2), circle(-13, -3, 5, C.dark, C.ink, 1), circle(13, -3, 5, C.dark, C.ink, 1), circle(-13, -3, 2, C.grey, null), circle(13, -3, 2, C.grey, null));
const diamond = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 -4 L-4 -9 L4 -9 L8 -4 L0 7 Z', '#d7f0fb', C.ink, 1.2), line('M-8 -4 L8 -4 M-4 -9 L-2 -4 L0 7 M4 -9 L2 -4 L0 7', C.ink, 0.7));
const wreck = (x: number, y: number, s = 1) => at(x, y, s, path('M-30 0 L-26 -12 L18 -16 L30 -6 L26 2 Z', '#8a5a3a', C.ink, 1.3), path('M-20 -12 L-18 -22 L4 -24 L6 -14 Z', '#a87a52', C.ink, 1), line('M-6 -24 L-2 -44 M14 -16 L20 -32', '#5a3a2a', 1.8), line('M-26 -12 L-22 -2 M-14 -13 L-12 -1 M-2 -14 L-2 0 M10 -15 L10 -1', '#5a3a2a', 0.8), circle(-10, -18, 1.8, '#3a2a1a', null), circle(-2, -19, 1.8, '#3a2a1a', null), path('M18 -16 L22 -8 L14 -6 Z', '#3a2a1a', null));

// ── Map of Africa (simplified) ───────────────────────────────────────
const AF = 'M24 22 L30 16 L44 14 L56 18 L58 14 L62 20 L72 22 L82 22 L88 25 L92 34 L98 46 L104 52 L114 51 L108 62 L100 76 L98 86 L92 96 L86 104 L76 110 L66 112 L60 108 L56 96 L52 84 L50 72 L52 62 L46 58 L36 57 L24 56 L14 48 L8 40 L10 32 L16 26 Z';
const MADA = 'M104 84 L108 82 L110 88 L106 100 L102 98 Z';
const SAMERICA = 'M40 10 L70 16 L90 34 L84 52 L70 64 L60 90 L50 110 L44 100 L46 70 L34 46 L30 24 Z';
/** Seven oranges heaped on top of a crate (shifted dx). */
const fruits = (dx: number) => all(...[[18, 50], [28, 46], [38, 48], [48, 51], [23, 42], [34, 40], [44, 43]].map(([x, y]) => all(circle(x! + dx, y!, 6, C.orange, C.ink, 1), line(`M${x! + dx} ${y! - 6} l1 -2`, '#4f7a3a', 1.2))));
/** A wooden crate (top-left corner x, y; 46×48) seen from the front. */
const crate = (x: number, y: number, col: string) => all(rect(x, y, 46, 48, col, 1, C.ink, 1.4), line(`M${x} ${y + 6} L${x + 46} ${y + 6} M${x} ${y + 42} L${x + 46} ${y + 42}`, '#a0673d', 1.2), line(`M${x + 4} ${y} L${x + 4} ${y + 48} M${x + 42} ${y} L${x + 42} ${y + 48}`, '#a0673d', 1.2));

// ── River helpers ────────────────────────────────────────────────────
const river = (d: string, col: string = WATER2, w = 5) => all(path(d, 'none', C.ink, w + 1.6), path(d, 'none', col, w));

export const AFRICA_GEO_MOTIFS: Record<string, Svg> = {
  // 3031 Nordafrikas öknar
  'gaf.saltsjö': all(bg(HOT), sun(98, 18, 6), path('M4 112 L4 54 C40 50 80 56 116 52 L116 112 Z', '#d9c28e', C.ink, 1.1), ellipse(60, 84, 50, 22, SALT, C.ink, 1.2), ellipse(60, 84, 40, 16, '#a8d4e6', C.ink, 1), ellipse(56, 82, 28, 9, '#c4e3ef', null),
    ...[[18, 84], [24, 76], [100, 82], [96, 94], [30, 96], [88, 70], [72, 100], [44, 70]].map(([x, y]) => path(`M${x! - 3} ${y} L${x} ${y! - 3} L${x! + 3} ${y} L${x} ${y! + 3} Z`, C.white, C.grey, 0.6)), at(100, 34, 1, circle(0, 0, 12, C.white, C.ink, 1.2), rect(-6, -2, 12, 8, SALT, 1, C.ink, 0.9), ...[[-4, -6], [0, -8], [4, -6], [-2, -4], [2, -4]].map(([a, b]) => rect(a! - 1, b! - 1, 2, 2, C.white, 0, C.grey, 0.5))), rock(16, 56, 4, ROCK)),
  // 3032 Sahel och savann
  'gaf.ökenspridning': all(bg(HOT), sun(100, 18, 6), path('M4 112 L4 70 C30 66 60 72 116 68 L116 112 Z', '#b9cf7a', C.ink, 1.1), ...range(5).map((i) => all(...range(3).map((r) => line(`M${70 + i * 9} ${80 + r * 10} l0 -6 M${68 + i * 9} ${77 + r * 10} l2 2 l2 -2`, '#5f8f3a', 1)))),
    path('M4 112 L4 66 C14 60 30 64 40 70 C48 76 54 86 56 112 Z', DUNE, C.ink, 1.1), path('M14 64 C24 62 34 66 40 72 L30 74 Z', DUNE2, null), ...range(3).map((r) => line(`M${44 + r * 3} ${86 + r * 8} l0 -5 M${42 + r * 3} ${84 + r * 8} l2 2 l3 -3`, '#a08a3a', 1)), arrow(30, 50, 62, 50, HL, 3.4), arrow(36, 60, 64, 62, HL, 2.6), line('M10 40 l6 0 M14 46 l8 0', C.grey, 1.2)),
  'gaf.överbetning': all(bg(HOT), sun(100, 18, 6), path('M4 112 L4 66 C40 62 80 68 116 64 L116 112 Z', '#d7bf86', C.ink, 1.1), ...[[14, 76], [30, 84], [54, 78], [80, 86], [100, 76], [22, 98], [70, 100], [96, 102], [46, 104]].map(([x, y]) => line(`M${x} ${y} l1 -2 M${x! + 3} ${y} l0 -2`, '#9a8a4a', 1)),
    goat(22, 82, 1.1), goat(44, 90, 1.1, '#5a4a3a'), goat(70, 82, 1.1), goat(92, 92, 1.1, '#8a6a4a'), goat(30, 104, 1.1, '#8a6a4a'), goat(60, 106, 1.1), goat(86, 108, 1.1, '#5a4a3a'), goat(52, 74, 1, '#8a6a4a'),
    at(24, 30, 0.48, greyed(rect(-28, -22, 56, 44, SKY, 3, C.ink, 2), path('M-28 22 L-28 0 L28 0 L28 22 Z', GRASS, C.ink, 2), ...range(8).map((i) => line(`M${-24 + i * 7} 4 l0 -8 M${-22 + i * 7} 6 l0 -6`, '#4f8f3a', 2)), goat(4, 14, 1.4)))),
  'gaf.herde': all(bg(), savannaGround(82), acacia(98, 82, 0.8), at(30, 106, 1.6, tiny(0, 0, 1, '#8a4a7a', 'M-3.2 -16 L-6 -10 M3.2 -16 L7 -12'), line('M7 -12 L7 -12', C.ink, 1)), line('M42 110 L44 72', '#7a5a3a', 2.2), path('M44 72 C44 66 50 66 50 70', 'none', '#7a5a3a', 2.2),
    goat(62, 96, 1.2), goat(80, 100, 1.2, '#5a4a3a'), goat(70, 108, 1.2, '#8a6a4a'), goat(94, 108, 1.2), cowB(88, 90, 0.9)),
  'gaf.vattenhål': all(bg(HOT), savannaGround(70), ellipse(60, 94, 36, 12, '#8cc0d8', C.ink, 1.2), ellipse(56, 92, 20, 5, '#b4dbea', null), path('M24 94 C30 104 90 104 96 94', 'none', MUD, 2),
    zebra(30, 88, 1.1), antelope(88, 88, 1.1), at(60, 82, 1, giraffe(0, 0, 0.9)), acacia(16, 70, 0.6), acacia(104, 70, 0.7), sun(98, 18, 6)),
  'gaf.hirs': all(bg(), path('M4 112 L4 92 C40 88 80 94 116 90 L116 112 Z', SAVANNA, C.ink, 1.1), ...[[30, 104, 1], [56, 106, 1.2], [84, 104, 1]].map(([x, y, s]) => at(x!, y!, s!, line('M0 0 L0 -50', '#8a9a4a', 2), line('M0 -20 C-8 -24 -12 -30 -14 -36 M0 -30 C8 -34 12 -40 14 -46 M0 -12 C6 -16 10 -22 12 -26', '#7f9e3f', 1.6), path('M0 -50 C-5 -56 -5 -70 0 -76 C5 -70 5 -56 0 -50 Z', '#d9b25a', C.ink, 1), ...range(6).map((i) => circle(i % 2 ? 2 : -2, -54 - i * 3.4, 1.6, '#e8c46a', C.ink, 0.4)))),
    at(100, 30, 1, circle(0, 0, 13, C.white, C.ink, 1.2), path('M-9 0 C-9 8 9 8 9 0 Z', '#c9a87a', C.ink, 1), ...range(9).map((i) => circle(-6 + (i % 5) * 3, -1 - Math.floor(i / 5) * 2.5, 1.4, '#e8c46a', C.ink, 0.4)))),
  'gaf.akacia': all(bg(), savannaGround(88), acacia(56, 98, 2.2), path('M30 40 C44 34 70 34 84 40', 'none', '#9cbf5a', 1.4), giraffe(96, 100, 0.8), at(18, 30, 0.45, greyed(rect(-24, -22, 48, 44, SKY, 3, C.ink, 2), rect(-2, 0, 4, 18, '#7a5a3a', 0, C.ink, 2), circle(0, -6, 12, GRASS2, C.ink, 2)))),
  'gaf.apbrödsträd': all(bg(), savannaGround(92), baobab(56, 104, 1.5), tiny(88, 104, 0.9, C.orange), acacia(16, 94, 0.5), sun(100, 18, 5)),
  'gaf.termitstack': all(bg(), savannaGround(92), path('M38 104 C34 80 42 50 48 30 C50 24 54 24 56 32 C58 40 60 44 62 38 C64 32 68 34 68 42 C70 60 74 84 72 104 Z', RED_EARTH, C.ink, 1.3), path('M46 60 C48 50 50 42 52 36 M60 80 C62 70 64 60 64 50', 'none', '#9a4a2a', 1), circle(52, 72, 2, '#7a3a1a', null), circle(64, 92, 1.8, '#7a3a1a', null),
    tiny(92, 104, 1.2, C.green), at(96, 40, 1, circle(0, 0, 12, C.white, C.ink, 1.2), ellipse(-4, 0, 3, 2.2, '#f3e3c3', C.ink, 0.6), ellipse(1, 0, 2.6, 2, '#f3e3c3', C.ink, 0.6), circle(5, -0.5, 2, '#d9a060', C.ink, 0.6), line('M-4 2 l-2 3 M0 2 l0 3 M3 2 l2 3 M-4 -2 l-2 -3 M0 -2 l0 -3 M3 -2 l2 -3', C.ink, 0.6)), acacia(16, 92, 0.5)),
  // 3033 Kongobäckenet
  'gaf.bäcken.2': all(bg(), path('M4 112 L4 40 L22 36 C30 64 40 82 60 82 C80 82 90 64 98 36 L116 40 L116 112 Z', '#b08a5a', C.ink, 1.2), path('M4 40 L22 36 L25 46 L4 48 Z M116 40 L98 36 L95 46 L116 48 Z', '#8a9a5a', null), river('M10 42 C18 54 26 66 38 76', WATER2, 2.6), river('M110 42 C102 54 94 66 82 76', WATER2, 2.6), ...range(9).map((i) => leafy(34 + i * 6.5, 76 - (i % 2) * 3, 5.5, i % 2 ? FOREST : FOREST2)), arrow(16, 26, 30, 46, C.dark, 2.2), arrow(104, 26, 90, 46, C.dark, 2.2), path('M22 36 C30 64 40 82 60 82 C80 82 90 64 98 36', 'none', HL, 2.8), line('M4 100 L116 100', '#9a7a4e', 1, '3 3')),
  'gaf.lian': all(bg('#cfe6d0'), rect(4, 96, 112, 16, '#4f7a3a', 0, null), rainTree(22, 108, 1.6, FOREST), rainTree(96, 108, 1.5, FOREST2), path('M4 4 L116 4 L116 22 C90 30 30 30 4 22 Z', FOREST, C.ink, 1),
    ...[['M38 22 C40 40 34 60 40 90', 2.6], ['M54 26 C58 46 50 62 56 80', 2.4], ['M70 24 C66 44 74 60 68 84', 2.4], ['M84 22 C88 38 80 52 86 70', 2.2]].map(([d, w]) => all(line(d as string, C.ink, (w as number) + 1.4), line(d as string, '#6f9e3f', w as number))), ...[[39, 40], [36, 60], [56, 46], [52, 62], [68, 40], [72, 60], [86, 40], [82, 54]].map(([x, y]) => ellipse(x!, y!, 3, 1.8, '#8fc06a', C.ink, 0.5)),
    oval(62, 56, 30, 34)),
  'gaf.gorilla': all(bg('#cfe6d0'), rect(4, 92, 112, 20, '#4f7a3a', 0, null), rainTree(14, 98, 1.3, FOREST2), rainTree(106, 98, 1.3, FOREST), ...[[30, 96], [94, 94], [70, 100]].map(([x, y]) => leafy(x!, y!, 7, '#5f9a4a')),
    at(60, 104, 1.5, path('M-16 0 C-20 -12 -18 -26 -8 -30 C-4 -32 4 -32 8 -30 C18 -26 20 -12 16 0 Z', '#2e2e36', C.ink, 1.1), path('M-16 -22 C-24 -16 -24 -4 -20 0 L-14 0 C-16 -8 -14 -14 -12 -18 Z M16 -22 C24 -16 24 -4 20 0 L14 0 C16 -8 14 -14 12 -18 Z', '#3d3f4a', C.ink, 1),
      circle(0, -36, 9, '#2e2e36', C.ink, 1.1), path('M0 -46 C-4 -46 -6 -42 -4 -40 L4 -40 C6 -42 4 -46 0 -46 Z', '#3d3f4a', null), ellipse(0, -33, 6, 4.5, '#6b6a72', C.ink, 0.7), circle(-3, -38, 1, C.white, null), circle(3, -38, 1, C.white, null), line('M-2 -32 L2 -32', C.ink, 0.8), ellipse(0, -16, 8, 9, '#55545e', null))),
  'gaf.flodbåt': all(bg(), rect(4, 34, 112, 22, FOREST, 0, null), ...range(9).map((i) => leafy(8 + i * 13, 36 + (i % 2) * 3, 8, i % 2 ? FOREST : FOREST2)), rect(4, 56, 112, 56, '#a89060', 0, null), waves(10, 108, 98, '#7a6440'), waves(16, 104, 106, '#7a6440'),
    at(60, 86, 1.2, path('M-42 -4 L42 -4 L36 8 L-38 8 Z', '#d9d2b8', C.ink, 1.3), rect(-34, -18, 52, 14, C.white, 1, C.ink, 1), path('M-38 -18 L22 -18 L22 -22 L-38 -22 Z', '#3f6fb5', C.ink, 1), ...range(7).map((i) => rect(-31 + i * 7, -15, 4, 4, '#8cc7e8', 0, C.ink, 0.5)), rect(24, -14, 12, 10, '#e6d3b3', 1, C.ink, 0.9), rect(26, -20, 8, 6, '#c9a87a', 1, C.ink, 0.8),
      ...[[-34, -24], [-26, -25], [-18, -24], [-10, -25], [-2, -24], [8, -25], [16, -24]].map(([x, y], i) => all(circle(x!, y! - 2, 2, C.skin2, C.ink, 0.5), rect(x! - 2, y!, 4, 3, [C.red, C.yellow, C.green, C.orange][i % 4]!, 0, null))), line('M-40 2 L40 2', C.red, 1.2))),
  // 3034 Östafrikas högland
  'gaf.gravsänka': all(bg(), path('M4 40 L44 40 L52 80 L68 80 L76 40 L116 40 L116 60 L4 60 Z', 'none', null), path('M4 46 L42 46 L50 84 L4 84 Z', '#c9b27a', C.ink, 1.2), path('M4 40 L42 40 L42 46 L4 46 Z', GRASS, C.ink, 1), path('M116 46 L78 46 L70 84 L116 84 Z', '#c9b27a', C.ink, 1.2), path('M116 40 L78 40 L78 46 L116 46 Z', GRASS, C.ink, 1),
    path('M42 40 L42 46 L50 84 L70 84 L78 46 L78 40', 'none', null), path('M42 46 L50 84 L70 84 L78 46', 'none', C.ink, 1.3), path('M48 74 L72 74 L70 84 L50 84 Z', '#9fcb6e', C.ink, 1), ellipse(60, 79, 7, 2.6, SEA, C.ink, 0.8), rect(4, 84, 112, 28, '#b29a6a', 0, C.ink, 1.1), line('M4 96 L116 96', '#9a825a', 1, '3 3'),
    line('M50 84 L48 112 M70 84 L72 112', C.ink, 1.3, '3 2'), arrow(28, 30, 8, 30, HL, 3), arrow(92, 30, 112, 30, HL, 3), path('M42 46 L50 84 L70 84 L78 46', 'none', HL, 2.4), acacia(20, 40, 0.35), acacia(100, 40, 0.35)),
  'gaf.kratersjö': all(bg(), path('M4 112 L4 96 C30 92 90 92 116 96 L116 112 Z', GRASS2, C.ink, 1.1), path('M8 100 L42 50 L78 50 L112 100 Z', '#8a9a6a', C.ink, 1.3), line('M14 92 L40 56 M106 92 L80 56', '#6f8a4a', 1), ellipse(60, 50, 18, 5, '#5f7a4a', C.ink, 1.1), ellipse(60, 50, 15, 3.6, SEA, C.ink, 0.9), ellipse(57, 49.5, 7, 1.4, '#a8d4e6', null),
    oval(60, 50, 22, 8), at(26, 26, 0.45, greyed(rect(-24, -20, 48, 40, SKY, 3, C.ink, 2), path('M-20 18 L-6 -6 L6 -6 L20 18 Z', '#7a6a5e', C.ink, 2), cloud(2, -14, 0.6, C.grey2)))),
  'gaf.kaffebuske': all(bg(), path('M4 112 L4 90 C40 86 80 92 116 88 L116 112 Z', '#8a6a4a', C.ink, 1.1), at(54, 104, 1.4, line('M0 0 L0 -40 M0 -12 L-14 -26 M0 -18 L14 -34 M0 -28 L-10 -40', '#6a4a2a', 2), ...[[-14, -26], [14, -34], [-10, -40], [0, -42], [-6, -16], [8, -22], [4, -32]].map(([x, y]) => all(ellipse(x! - 4, y!, 4, 2, '#2f7a3e', C.ink, 0.6), ellipse(x! + 4, y!, 4, 2, '#2f7a3e', C.ink, 0.6))), ...[[-10, -24], [-8, -26], [10, -32], [12, -30], [-6, -38], [2, -40], [4, -20], [6, -18], [-3, -14]].map(([x, y]) => circle(x!, y!, 1.6, C.red, C.ink, 0.5))),
    at(98, 32, 1, circle(0, 0, 13, C.white, C.ink, 1.2), ellipse(-3, 0, 4, 5.5, '#6b3d1f', C.ink, 0.8), line('M-3 -5 C-1 -2 -5 2 -3 5', '#3a1f0f', 0.8), ellipse(4, 1, 3.4, 4.8, '#6b3d1f', C.ink, 0.8), line('M4 -3.5 C6 -1 2 2 4 5.5', '#3a1f0f', 0.8))),
  'gaf.safari': all(bg(), savannaGround(70), acacia(100, 74, 0.7), giraffe(84, 76, 0.7), at(26, 80, 0.8, zebra(0, 0, 1)), sun(20, 18, 5), jeep(52, 104, 1.5), at(52, 104, 1.5, ...[[-6, -32], [4, -32]].map(([x, y]) => all(circle(x!, y! - 3, 2.6, C.skin2, C.ink, 0.6), path(`M${x! - 2.6} ${y! - 4} C${x! - 2.6} ${y! - 7} ${x! + 2.6} ${y! - 7} ${x! + 2.6} ${y! - 4} Z`, C.hair, null))), rect(1, -37, 6, 3, C.dark, 1, null), circle(2, -35.5, 1.4, C.dark, null), circle(6, -35.5, 1.4, C.dark, null))),
  // 3035 Södra Afrikas landskap
  'gaf.kustöken': all(bg('#eef3f6'), cloud(30, 22, 1, '#eef1f4'), cloud(76, 16, 0.8, '#eef1f4'), rect(4, 40, 112, 8, 'rgba(255,255,255,0.75)', 0, null), path('M4 112 L4 56 L34 56 C30 74 34 92 30 112 Z', SEA, C.ink, 1), waves(6, 26, 68), waves(8, 28, 84), waves(6, 26, 100), path('M34 56 L116 56 L116 112 L30 112 C34 92 30 74 34 56 Z', '#f0c070', C.ink, 1), dune(60, 112, 50, 44), dune(96, 112, 46, 54), dune(78, 112, 30, 22), path('M34 56 C30 74 34 92 30 112', 'none', C.white, 2.2), path('M34 56 C30 74 34 92 30 112', 'none', HL, 2.8), sun(104, 20, 5)),
  'gaf.skeppsvrak': all(bg(), rect(4, 56, 112, 18, SEA, 0, null), waves(10, 108, 62), waves(14, 104, 70), path('M4 112 L4 74 C40 70 80 76 116 72 L116 112 Z', SAND, C.ink, 1.1), wreck(60, 96, 1.5), pebbles([[20, 104], [100, 104], [26, 92]], '#d9c48a'), cloud(26, 22, 0.7, '#eef1f4')),
  'gaf.saltpanna': all(bg(HOT), sun(100, 18, 5), path('M4 112 L4 52 L116 52 L116 112 Z', SALT, C.ink, 1.1), line('M4 52 L116 52', C.ink, 1), ...range(4).map((r) => all(...range(r % 2 ? 6 : 7).map((c) => { const x = 14 + c * 15 + (r % 2) * 8; const y = 60 + r * 13; const w = 9 + r * 3; return path(`M${x - w / 2} ${y} L${x - w / 4} ${y - 3 - r} L${x + w / 4} ${y - 3 - r} L${x + w / 2} ${y} L${x + w / 4} ${y + 3 + r} L${x - w / 4} ${y + 3 + r} Z`, 'none', '#c9c4b0', 0.9); }))), antelope(22, 52, 0.6), zebra(98, 52, 0.55), at(26, 28, 0.45, greyed(rect(-24, -18, 48, 36, HOT, 3, C.ink, 2), ellipse(0, 6, 20, 8, '#a8d4e6', C.ink, 2)))),
  'gaf.inlandsdelta': all(rect(4, 4, 112, 108, SAND, 3, null), ...range(10).map((i) => dune(14 + i * 11, 20 + (i % 3) * 30, 10, 4)), path('M60 4 C58 14 62 22 60 30', 'none', SEA2, 4),
    path('M60 30 C40 40 26 64 30 92 C48 104 76 104 92 90 C96 64 80 40 60 30 Z', '#9fcb6e', C.ink, 1.1), ...[['M60 30 C52 46 40 62 36 86'], ['M60 30 C56 50 50 70 50 96'], ['M60 30 C62 50 64 72 66 98'], ['M60 30 C68 46 80 64 86 86'], ['M48 60 C44 66 38 70 34 72'], ['M72 60 C78 66 84 70 88 72']].map(([d]) => path(d!, 'none', SEA2, 1.8)),
    ...[[44, 76], [58, 82], [74, 80], [52, 64], [68, 66]].map(([x, y]) => ellipse(x!, y!, 3, 2, '#7fb356', C.ink, 0.5)), path('M60 30 C40 40 26 64 30 92 C48 104 76 104 92 90 C96 64 80 40 60 30 Z', 'none', HL, 2.4),
    at(98, 96, 0.4, greyed(rect(-24, -20, 48, 40, SAND, 3, C.ink, 2), path('M0 -20 L0 0', 'none', SEA2, 5), path('M-24 10 L24 10 L24 20 L-24 20 Z', SEA, C.ink, 2), path('M0 0 L-14 10 M0 0 L0 10 M0 0 L14 10', 'none', SEA2, 3)))),
  'gaf.diamantgruva': all(bg(), path('M4 112 L4 40 L116 40 L116 112 Z', '#b9a37a', C.ink, 1.1), ellipse(60, 66, 50, 22, '#8a7a5a', C.ink, 1.2), ellipse(60, 70, 40, 16, '#7a6a4a', C.ink, 1), ellipse(60, 74, 30, 11, '#6a5a3e', C.ink, 1), ellipse(60, 78, 19, 7, '#4f4430', C.ink, 1), ellipse(60, 80, 10, 3.6, '#3a6a7a', C.ink, 0.9),
    ...[[18, 40], [30, 38], [96, 38]].map(([x, y]) => all(rect(x! - 4, y! - 8, 8, 8, C.white, 0.5, C.ink, 0.8), path(`M${x! - 5} ${y! - 8} L${x} ${y! - 12} L${x! + 5} ${y! - 8} Z`, C.grey, C.ink, 0.6))), tiny(104, 104, 0.9, C.orange), diamond(92, 22, 1.3), sparkle(104, 14, 3), sparkle(80, 14, 2.4)),
  // 3036 Afrikas länder och huvudstäder
  'gaf.afrikansk': all(bg('#f6f2ea'), rect(4, 100, 112, 12, '#d9c8a8', 0, null), line('M4 100 L116 100', C.ink, 1),
    fruits(0),
    crate(10, 52, HLFILL), at(13.5, 56, 0.32, path(AF, '#e4572e', C.ink, 2.4), path(MADA, '#e4572e', C.ink, 2)), oval(33, 76, 30, 30), sparkle(10, 30, 3), sparkle(56, 28, 2.6),
    greyed(fruits(54), crate(64, 52, '#e8dcc4'), at(67.8, 56.8, 0.32, path(SAMERICA, '#5a6b7a', C.ink, 2.4)))),
  'gaf.kustland': all(mapBg(), rect(4, 4, 112, 34, GREYLAND, 3, null), line('M4 38 L116 38', C.ink, 1), line('M44 4 L44 38 M84 4 L84 38', C.ink, 1), path('M4 38 L44 38 L50 60 L44 80 C30 84 16 82 4 86 Z', GREYLAND, C.ink, 1.1),
    path('M44 38 L84 38 L86 62 C90 72 94 80 96 88 C80 92 64 88 52 86 L44 80 L50 60 Z', HLFILL, C.ink, 1.4), path('M84 38 L116 38 L116 84 C108 84 100 86 96 88 C94 80 90 72 86 62 Z', GREYLAND, C.ink, 1.1), path('M52 86 C64 88 80 92 96 88', 'none', HL, 3.6), path('M44 38 L84 38 L86 62 C90 72 94 80 96 88 C80 92 64 88 52 86 L44 80 L50 60 Z', 'none', HL, 2.2),
    waves(14, 104, 98), waves(20, 100, 106), dot(66, 60, 3, C.red), at(70, 100, 0.8, path('M-10 -3 L10 -3 L7 3 L-7 3 Z', C.white, C.ink, 1), line('M0 -3 L0 -12', C.ink, 0.9), path('M1 -11 L7 -4 L1 -4 Z', C.white, C.ink, 0.7))),
  // 3037 Afrikas större floder och sjöar
  'gaf.sammanflöde': all(rect(4, 4, 112, 108, '#e6d6a8', 3, null), river('M10 6 C20 24 36 40 56 56', '#d9e8ee', 7), river('M110 6 C100 24 84 40 64 56', '#3f7fb5', 7), river('M60 56 C58 74 64 92 60 112', '#7fa6c4', 10), path('M57 60 C56 76 61 92 57 112', 'none', '#d9e8ee', 3), path('M63 60 C62 76 67 92 63 112', 'none', '#3f7fb5', 3),
    ...[[44, 66], [50, 74], [72, 66], [78, 74], [46, 82], [74, 84]].map(([x, y]) => all(rect(x! - 3, y! - 4, 6, 5, C.white, 0.5, C.ink, 0.6))), ring(60, 56, 12), ...[[18, 60], [100, 60], [24, 96], [96, 96]].map(([x, y]) => palm(x!, y!, 0.35))),
  'gaf.konstgjord-sjö': all(bg(), path('M4 112 L4 40 L30 30 L50 50 L4 112 Z', ROCK, C.ink, 1.2), path('M116 112 L116 40 L90 30 L70 50 L116 112 Z', ROCK, C.ink, 1.2), path('M4 48 C30 40 60 44 74 52 L74 70 L4 70 Z', SEA, C.ink, 1), waves(10, 66, 56), ...[[18, 66], [40, 64]].map(([x, y]) => all(line(`M${x} ${y} L${x} ${y! - 6}`, '#4f7a3a', 1.2), circle(x!, y! - 7, 2.6, '#4f7a3a', C.ink, 0.5))), path('M28 70 L32 66 L36 70 Z', '#c8643a', C.ink, 0.6),
    path('M74 46 L82 46 L86 96 L70 96 Z', '#d0d0cc', C.ink, 1.3), line('M74 56 L83 56 M73 70 L84 70 M72 84 L85 84', '#9a9a96', 1), path('M86 82 C94 86 100 92 116 94 L116 112 L80 112 Z', SEA, null), path('M86 82 C90 90 92 100 90 112', 'none', C.white, 1.6), rect(88, 72, 12, 10, C.white, 0.5, C.ink, 0.8), line('M100 72 L108 62 L112 64', C.ink, 0.8),
    path('M4 48 C30 40 60 44 74 52 L74 70 L4 70 Z', 'none', HL, 2.4), path('M74 52 L74 70', 'none', C.ink, 1)),
};
