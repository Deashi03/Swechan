/**
 * Matematik & naturvetenskap → Biologi → Ekologi & organismvärlden, 3561–3567 (0.52): photosynthesis and cellular
 * respiration, food webs, population dynamics, symbiosis and parasitism, biodiversity, nutrient cycles and life cycles.
 * Recurring signs: energy is a yellow lightning bolt; an oxygen molecule is two red balls, carbon dioxide a black ball
 * between two red ones, glucose a small orange hexagon. The part the word names is ringed or framed in orange, and a
 * grey copy beside it shows what the word is not; a red cross marks what is missing or does not happen.
 * Close words share one layout where only the marked part differs: cellandning/anaerob (the same cell; oxygen enters
 * along an orange arrow, or the oxygen is grey and crossed out and only a small bolt comes out).
 * Digits and maths signs only; no words, no brands and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL } from './people';
import { greyed } from './blindFix';
import { figure } from './figures';

// ── Palette and basics ───────────────────────────────────────────────
const PAPER = '#f6f2ea';
const SKY = '#d6ecf7';
const GRASS = '#8cc96a';
const GRASS2 = '#5f9e45';
const LEAF = '#4f9d4a';
const LEAF2 = '#2f6e2c';
const WATER = '#9fd2ee';
const WATER2 = '#5aa6cf';
const SOIL = '#a8784a';
const BARK = '#7a5232';
const CELL = '#fdeedd';
const MITO = '#f2a65a';
const RED = '#d8343a';
const YEL = '#f2c14e';
const WHITE = '#fbfbf8';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const atF = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${-s} ${s})`, ...k);
const rot = (x: number, y: number, a: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${a})`, ...k);
const bg = (col: string = PAPER) => rect(4, 4, 112, 108, col, 3, null);
const field = (y: number, col: string = GRASS) => rect(4, y, 112, 112 - y, col, 0, null);
const ring = (x: number, y: number, rx: number, ry = rx, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number) => rect(x, y, w, h, 'none', 4, HL, 2.6);
const cross = (x: number, y: number, r = 5, col: string = RED) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 2.6);
const panel = (x: number, y: number, w: number, h: number, col: string = WHITE) => rect(x, y, w, h, col, 3, C.ink, 1.4);
/** Digits / maths signs only. */
const num = (s: string, x: number, y: number, size = 10, fill: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" fill="${fill}" text-anchor="middle">${s}</text>`;

// ── Molecules and energy ─────────────────────────────────────────────
const bolt = (x: number, y: number, s = 1, col: string = YEL) => at(x, y, s, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', col, C.ink, 1.3));
const o2 = (x: number, y: number, s = 1) => at(x, y, s, circle(-4, 0, 4.6, RED, C.ink, 1.1), circle(4, 0, 4.6, RED, C.ink, 1.1));
const co2 = (x: number, y: number, s = 1) => at(x, y, s, circle(-7.5, 0, 4, RED, C.ink, 1.1), circle(7.5, 0, 4, RED, C.ink, 1.1), circle(0, 0, 5, C.dark, C.ink, 1.1));
const h2o = (x: number, y: number, s = 1) => at(x, y, s, circle(-5, 3, 3, WHITE, C.ink, 1), circle(5, 3, 3, WHITE, C.ink, 1), circle(0, -1, 4.6, RED, C.ink, 1.1));
const hexa = (x: number, y: number, s = 1, col: string = '#f2a65a') => at(x, y, s, path('M0 -7 L6 -3.5 L6 3.5 L0 7 L-6 3.5 L-6 -3.5 Z', col, C.ink, 1.2));
const glucose = (x: number, y: number, s = 1) => hexa(x, y, s);
const mito = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 0, 14, 8, MITO, C.ink, 1.3), path('M-10 0 L-7 -5 L-4 4 L-1 -5 L2 4 L5 -5 L8 4 L10 0', 'none', '#a8642a', 1.2));
const heat = (x: number, y: number, s = 1, col: string = RED) => at(x, y, s, line('M-6 0 C-9 -4 -3 -7 -6 -11 C-9 -15 -3 -17 -6 -20 M0 0 C-3 -4 3 -7 0 -11 C-3 -15 3 -17 0 -20 M6 0 C3 -4 9 -7 6 -11 C3 -15 9 -17 6 -20', col, 1.6));
const sunAt = (x: number, y: number, r = 9) => all(...range(10).map((i) => { const a = (i / 10) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 3))} ${f1(y + Math.sin(a) * (r + 3))} L${f1(x + Math.cos(a) * (r + 7))} ${f1(y + Math.sin(a) * (r + 7))}`, C.gold, 2); }), circle(x, y, r, YEL, C.ink, 1.4));
/** The cell used by cellandning and anaerob. */
const cellBase = () => all(ellipse(60, 62, 30, 34, CELL, C.ink, 2), mito(60, 62, 1.1));

// ── Plants ───────────────────────────────────────────────────────────
const leafShape = (x: number, y: number, s = 1, a = 0, col: string = LEAF) => g(`translate(${x} ${y}) rotate(${a}) scale(${s})`, path('M0 0 C8 -10 26 -10 34 0 C26 10 8 10 0 0 Z', col, C.ink, 1.3), line('M0 0 L32 0 M10 0 L16 -5 M18 0 L24 -5 M10 0 L16 5 M18 0 L24 5', LEAF2, 0.9));
const tuft = (x: number, y: number, s = 1, col: string = GRASS2) => at(x, y, s, line('M-3 0 Q-4 -4 -6 -7 M0 0 L0 -8 M3 0 Q4 -4 6 -7', col, 1.4));
const flower = (x: number, y: number, col: string, h = 16, r = 3.2) => all(line(`M${x} ${y} L${x} ${y - h}`, GRASS2, 1.4), ...range(5).map((i) => { const a = (i / 5) * Math.PI * 2; return circle(f1(x + Math.cos(a) * r), f1(y - h + Math.sin(a) * r), r * 0.85, col, C.ink, 0.6); }), circle(x, y - h, r * 0.6, YEL, C.ink, 0.6));
const spruce = (x: number, y: number, s = 1, col: string = LEAF2) => at(x, y, s, rect(-2, -8, 4, 8, BARK, 0, C.ink, 1), path('M0 -56 L-10 -38 L-5 -38 L-15 -22 L-8 -22 L-20 -8 L20 -8 L8 -22 L15 -22 L5 -38 L10 -38 Z', col, C.ink, 1.3));
const bareTree = (x: number, y: number, s = 1, col: string = BARK) => at(x, y, s, path('M-4 0 L-3 -40 L3 -40 L4 0 Z', col, C.ink, 1.2),
  line('M0 -38 L-22 -62 M0 -38 L22 -64 M-1 -30 L-26 -42 M1 -30 L26 -44 M-12 -50 L-16 -70 M12 -52 L16 -72 M0 -40 L0 -74', col, 2.6));
const oak = (x: number, y: number, s = 1) => at(x, y, s, path('M-5 0 L-4 -30 L4 -30 L5 0 Z', BARK, C.ink, 1.2), circle(-14, -40, 13, LEAF, C.ink, 1.2), circle(14, -40, 13, LEAF, C.ink, 1.2), circle(0, -52, 15, LEAF, C.ink, 1.2), rect(-22, -40, 44, 10, LEAF, 4, null));

// ── Animals ──────────────────────────────────────────────────────────
type FishO = { body?: string; fin?: string; stripes?: string };
/** Fish facing right; s = 1 is about 30 px long. */
const fish = (x: number, y: number, s = 1, o: FishO = {}) => {
  const b = o.body ?? '#a9b8c4', fn = o.fin ?? b;
  return at(x, y, s, path('M-15 0 L-22 -7 L-22 7 Z', fn, C.ink, 1.1), path('M-16 0 C-10 -9 8 -9 14 0 C8 9 -10 9 -16 0 Z', b, C.ink, 1.3),
    o.stripes ? line('M-4 -6 L-4 6 M4 -6 L4 6', o.stripes, 2) : '', circle(8, -2, 1.5, C.ink, null), line('M14 0 L11 1', C.ink, 0.9));
};
type BirdO = { body?: string; wing?: string; head?: string; belly?: string };
/** Small perched bird facing right; s = 1 is about 30 px long. */
const bird = (x: number, y: number, s = 1, o: BirdO = {}) => {
  const body = o.body ?? '#7aa0c8', wing = o.wing ?? '#4a6fa0';
  return at(x, y, s, path('M-9 -1 L-17 -4 L-17 3 Z', wing, C.ink, 1.1), ellipse(0, 0, 11, 7.5, body, C.ink, 1.3), o.belly ? path('M-4 4 C0 7 6 6 9 2 C6 0 0 1 -4 4 Z', o.belly, null) : '',
    path('M-8 -2 C-3 -8 5 -6 5 0 C2 3 -4 3 -8 -2 Z', wing, C.ink, 1), circle(9, -6, 5.6, o.head ?? body, C.ink, 1.3), circle(11, -7, 1.1, C.ink, null),
    path('M14 -7.5 L19 -6 L14 -4.5 Z', '#3d3f4a', C.ink, 0.8), line('M-2 7 L-3 12 M3 7 L4 12', C.ink, 1.2));
};
const beetle = (x: number, y: number, s = 1, col = '#5a3a22') => at(x, y, s, line('M-4 -3 L-7 -5 M-4 0 L-8 0 M-4 3 L-7 5 M4 -3 L7 -5 M4 0 L8 0 M4 3 L7 5', C.ink, 0.8), ellipse(0, 1, 4, 5.5, col, C.ink, 0.8), circle(0, -5, 2.4, col, C.ink, 0.8), line('M0 -3 L0 6', C.ink, 0.6));
const hare = (x: number, y: number, s = 1, col = '#b08a62') => at(x, y, s, ellipse(0, 0, 9, 6, col, C.ink, 1.1), circle(8, -5, 4.2, col, C.ink, 1.1), path('M7 -9 C6 -18 9 -19 10 -9 Z M10 -8 C11 -17 14 -17 12 -8 Z', col, C.ink, 0.9), circle(10, -6, 0.8, C.ink, null), circle(-9, -2, 2.4, WHITE, C.ink, 0.8));
const cat = (x: number, y: number, s = 1, col = '#e0a64e') => at(x, y, s, path('M14 -4 C24 -6 26 -18 20 -22', 'none', C.ink, 4), path('M14 -4 C24 -6 26 -18 20 -22', 'none', col, 2.4), ellipse(2, -8, 15, 9, col, C.ink, 1.5),
  circle(-12, -18, 8, col, C.ink, 1.5), path('M-19 -22 L-18 -30 L-13 -24 Z M-10 -24 L-6 -30 L-5 -21 Z', col, C.ink, 1.1), circle(-15, -19, 1, C.ink, null), circle(-10, -19, 1, C.ink, null),
  line('M-8 0 L-8 0 M-6 -1 L-6 0 M8 -1 L8 0', C.ink, 1.2), line('M-8 -1 L-8 0 M-3 -1 L-3 0 M6 -1 L6 0 M11 -1 L11 0', C.ink, 1.6));
const flea = (x: number, y: number, s = 1) => at(x, y, s, path('M-6 2 C-7 -5 2 -8 6 -3 C8 0 6 4 2 4 L-4 4 Z', '#7a4a2a', C.ink, 1), circle(6, -2, 1.8, '#7a4a2a', C.ink, 0.8),
  line('M-2 4 L-4 9 L-7 10 M2 4 L1 8 M4 3 L8 8 L12 6', C.ink, 1));
const louse = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 3, 5, 7, '#c9b49a', C.ink, 1), ellipse(0, -6, 3, 2.6, '#c9b49a', C.ink, 0.9), line('M0 -3 L0 9 M-2 1 L2 1 M-2 5 L2 5', '#8a7458', 0.7),
  line('M-4 -1 L-9 -4 L-10 -1 M-5 3 L-10 3 L-11 6 M-4 7 L-8 10 L-8 13 M4 -1 L9 -4 L10 -1 M5 3 L10 3 L11 6 M4 7 L8 10 L8 13 M-1 -8 L-3 -11 M1 -8 L3 -11', C.ink, 0.9));
const butterfly = (x: number, y: number, s = 1, col: string = '#f2a65a') => at(x, y, s, path('M0 0 C-6 -10 -16 -10 -14 -1 C-13 3 -6 3 0 1 Z M0 1 C-5 3 -12 6 -10 11 C-7 13 -2 8 0 3 Z', col, C.ink, 1), g('scale(-1 1)', path('M0 0 C-6 -10 -16 -10 -14 -1 C-13 3 -6 3 0 1 Z M0 1 C-5 3 -12 6 -10 11 C-7 13 -2 8 0 3 Z', col, C.ink, 1)), ellipse(0, 2, 1.6, 6, C.dark, null), line('M-1 -4 L-4 -9 M1 -4 L4 -9', C.ink, 0.8));
const bee = (x: number, y: number, s = 1) => at(x, y, s, ellipse(-3, -5, 4, 3, 'rgba(220,240,252,0.9)', C.ink, 0.7), ellipse(2, -5, 4, 3, 'rgba(220,240,252,0.9)', C.ink, 0.7), ellipse(0, 0, 6, 4, YEL, C.ink, 0.9), line('M-2 -3.5 L-2 3.5 M1.5 -3.8 L1.5 3.8', C.ink, 1.2), circle(6, -1, 2.2, C.dark, null));
const frog = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 0, 8, 5, '#7ab648', C.ink, 1), circle(-4, -5, 2.4, '#7ab648', C.ink, 0.9), circle(4, -5, 2.4, '#7ab648', C.ink, 0.9), circle(-4, -5, 1, C.ink, null), circle(4, -5, 1, C.ink, null), line('M-7 3 L-11 6 M7 3 L11 6', C.ink, 1));
const dino = (x: number, y: number, s = 1, col = '#7a9a5a') => at(x, y, s, path('M-26 -6 C-18 -10 -10 -22 2 -20 C8 -19 10 -26 14 -34 C16 -38 24 -38 24 -33 C24 -29 18 -29 17 -25 C16 -18 18 -10 12 -4 L12 0 L7 0 L6 -4 L-4 -4 L-5 0 L-10 0 L-10 -5 C-16 -4 -22 -4 -26 -6 Z', col, C.ink, 1.3), circle(20, -34, 1, C.ink, null));
const shell = (x: number, y: number, s = 1, col = '#d6b27a') => at(x, y, s, circle(0, 0, 9, col, C.ink, 1.2), path('M0 0 C3 0 3 -4 0 -4 C-5 -4 -6 3 -1 5 C6 7 9 -2 6 -7', 'none', C.ink, 1));
const beaver = (x: number, y: number, s = 1) => at(x, y, s, ellipse(-18, 3, 9, 4, '#6a4a2c', C.ink, 1.1), line('M-24 2 L-12 2 M-22 5 L-14 5', '#4a3220', 0.7), ellipse(0, 0, 13, 9, '#9a6a3a', C.ink, 1.3), circle(12, -5, 6.5, '#9a6a3a', C.ink, 1.3), circle(9, -11, 2, '#9a6a3a', C.ink, 0.9), circle(14, -7, 1.1, C.ink, null), rect(16, -3, 3, 3, WHITE, 0.5, C.ink, 0.6), line('M-6 8 L-7 11 M6 8 L7 11', C.ink, 1.4));
const cow = (x: number, y: number, s = 1) => at(x, y, s, rect(-14, -14, 26, 13, WHITE, 5, C.ink, 1.2), circle(-6, -9, 3.5, C.dark, null), circle(6, -6, 2.5, C.dark, null), path('M12 -14 L20 -12 L22 -4 L14 -4 Z', WHITE, C.ink, 1.1), line('M-11 -1 L-11 5 M-6 -1 L-6 5 M4 -1 L4 5 M9 -1 L9 5', C.ink, 1.6), line('M14 -14 L13 -18 M18 -13 L19 -17', C.ink, 1));

export const ECOBIO_MOTIFS: Record<string, Svg> = {
  // ── Fotosyntes och cellandning ─────────────────────────────────────
  'ekob.cellandning': all(bg(), cellBase(), glucose(12, 44, 1.2), o2(14, 80, 1.1), arrow(24, 46, 42, 54, C.grey, 2.4), arrow(26, 78, 42, 70, HL, 3.4),
    co2(102, 40, 0.95), h2o(104, 62), bolt(103, 88, 1.15), arrow(80, 54, 90, 44, C.grey, 2.2), arrow(82, 62, 92, 62, C.grey, 2.2), arrow(80, 72, 92, 84, C.grey, 2.2), ring(14, 80, 13, 10)),
  'ekob.anaerob': all(bg(), cellBase(), glucose(12, 44, 1.2), greyed(o2(14, 80, 1.1)), cross(14, 80, 9), arrow(24, 46, 42, 54, C.grey, 2.4),
    bolt(102, 62, 0.6), arrow(82, 62, 94, 62, C.grey, 2.2), path('M98 82 C98 78 102 74 102 74 C102 74 106 78 106 82 C106 86 98 86 98 82 Z', '#f6f0c8', C.ink, 1), frame(4.5, 64, 22, 32)),
  'ekob.ljusenergi': all(bg(SKY), field(96), sunAt(22, 22, 11), leafShape(56, 84, 1.5, -24), line('M70 82 L68 112', GRASS2, 2.4),
    ...[[34, 30, 66, 66], [38, 20, 80, 56], [28, 38, 56, 72]].map(([a, b, c, d]) => line(`M${a} ${b} Q${f1((a! + c!) / 2 + 4)} ${f1((b! + d!) / 2 - 6)} ${c} ${d}`, '#e8a020', 3)), ring(55, 46, 22, 20), bolt(98, 40, 0.9)),
  'ekob.förbränna': all(bg('#eef4ea'), field(104, '#d9c9a8'), figure({ x: 40, top: C.orange, bottom: C.navy, h: 0.82 }),
    path('M40 66 C33 60 36 50 41 45 C41 52 46 52 46 47 C52 54 50 64 43 67 Z', '#f08a2c', C.ink, 1.2), path('M41 64 C39 60 41 56 43 54 C45 58 47 60 43 64 Z', YEL, null), heat(40, 34, 0.7),
    panel(78, 50, 34, 28), path('M84 72 L106 72 L95 56 Z', '#f3d9a8', C.ink, 1.1), line('M86 68 L104 68', '#ef9fb5', 2), circle(95, 55, 2, RED, C.ink, 0.6), arrow(78, 64, 58, 62, HL, 3), ring(42, 56, 13, 15)),
  'ekob.energirik': all(bg(), rect(4, 86, 112, 26, C.tan, 0, null), line('M4 86 L116 86', C.brown, 2),
    ellipse(32, 80, 24, 7, WHITE, C.ink, 1.4), ...[[22, 74], [30, 72], [38, 75], [27, 77], [35, 78]].map(([x, y]) => ellipse(x!, y!, 4, 3, '#c98a4a', C.ink, 0.8)), path('M40 78 L52 78 L52 70 Z', '#f2d05a', C.ink, 1),
    bolt(20, 44, 1.2), bolt(34, 40, 1.4), bolt(48, 44, 1.2), ring(34, 58, 26, 30),
    greyed(ellipse(88, 80, 22, 7, WHITE, C.ink, 1.4), ...[[80, 76], [88, 75], [96, 76]].map(([x, y]) => all(circle(x!, y!, 4.4, '#a8d48a', C.ink, 0.9), circle(x!, y!, 2.6, '#e0f0c8', null))), bolt(88, 52, 0.6))),
  // ── Näringsvävar ───────────────────────────────────────────────────
  'ekob.tertiärkonsument': all(bg(WATER), rect(4, 4, 112, 14, SKY, 0, null), line('M4 18 L116 18', WATER2, 1.6),
    greyed(...range(6).map((i) => circle(10 + (i % 3) * 5, 98 - Math.floor(i / 3) * 5, 2, '#6fbf5a', C.ink, 0.6)), at(30, 80, 1, ellipse(0, 0, 4, 2.6, '#e8d6b0', C.ink, 0.8), line('M-3 2 L-5 5 M0 2 L0 5 M3 2 L5 5', C.ink, 0.6)), fish(50, 62, 0.65, { body: '#c9ced4', fin: '#e08a7a' })),
    fish(84, 40, 1.15, { body: '#7aa860', fin: '#5f8a45', stripes: '#c8e09a' }), arrow(18, 90, 26, 84, C.grey, 2), arrow(34, 76, 42, 68, C.grey, 2), arrow(58, 58, 64, 50, C.grey, 2),
    num('1', 30, 70, 9, C.grey), num('2', 50, 52, 9, C.grey), num('3', 84, 64, 13), ring(84, 40, 28, 16)),
  'ekob.energipyramid': all(bg(), path('M60 10 L76 34 L44 34 Z', '#e4572e', C.ink, 1.4), path('M44 34 L76 34 L90 58 L30 58 Z', '#f2a65a', C.ink, 1.4), path('M30 58 L90 58 L104 82 L16 82 Z', YEL, C.ink, 1.4), path('M16 82 L104 82 L114 104 L6 104 Z', GRASS, C.ink, 1.4),
    tuft(40, 100, 1.4), tuft(60, 100, 1.4), tuft(80, 100, 1.4), hare(52, 74, 0.8), hare(72, 74, 0.8), at(60, 50, 0.7, ellipse(0, 0, 10, 6, '#e07a2c', C.ink, 1.1), circle(9, -5, 5, '#e07a2c', C.ink, 1.1), path('M6 -9 L7 -14 L10 -9 Z M10 -9 L13 -13 L13 -7 Z', '#e07a2c', C.ink, 0.8), path('M-9 -1 C-16 -4 -18 4 -12 4 Z', '#e07a2c', C.ink, 0.8)),
    at(60, 28, 0.55, path('M-14 0 C-6 -8 6 -8 14 0 L6 -2 L0 4 L-6 -2 Z', '#6a4a2c', C.ink, 1.2))),
  'ekob.energiförlust': all(bg(), leafShape(8, 76, 0.9, 0), hare(98, 80, 1.3), path('M26 66 L80 74 L80 82 L26 92 Z', YEL, C.ink, 1.3), bolt(16, 50, 1.2), bolt(96, 54, 0.55),
    heat(46, 64, 1, RED), heat(62, 66, 0.9, RED), ring(54, 52, 18, 16), num('−90 %', 54, 30, 11, RED)),
  'ekob.fiskgjuse': all(bg(SKY), rect(4, 86, 112, 26, WATER, 0, null), line('M14 92 l8 0 M40 98 l10 0 M80 94 l9 0', WHITE, 1.2), path('M40 86 C46 82 54 82 60 86', 'none', WHITE, 1.4),
    at(60, 50, 1, path('M-4 -4 C-20 -18 -40 -20 -50 -14 C-40 -10 -24 -6 -6 4 Z', '#6a4a2c', C.ink, 1.3), path('M4 -4 C20 -18 40 -20 50 -14 C40 -10 24 -6 6 4 Z', '#6a4a2c', C.ink, 1.3),
      path('M-30 -14 C-22 -12 -14 -8 -6 0 M30 -14 C22 -12 14 -8 6 0', 'none', WHITE, 1), ellipse(0, 2, 7, 13, WHITE, C.ink, 1.3), path('M-4 14 L0 20 L4 14 Z', '#6a4a2c', C.ink, 1), circle(0, -12, 6, WHITE, C.ink, 1.3), line('M-5 -13 L-1 -11 M5 -13 L1 -11', C.dark, 1.6), path('M-2 -7 L0 -3 L2 -7 Z', C.dark, C.ink, 0.6)),
    line('M57 64 L55 72 M63 64 L65 72', '#9aa3ad', 2), fish(60, 76, 0.6, { body: '#c0ccd6' })),
  'ekob.sparvhök': all(bg('#eef4ea'), field(100), at(28, 100, 1, path('M-12 0 C-20 -6 -18 -24 -4 -26 C6 -32 22 -22 18 -6 C20 -2 14 0 12 0 Z', LEAF, C.ink, 1.3)),
    bird(30, 82, 0.7, { body: '#7aa0c8', wing: '#4a6fa0', belly: YEL }),
    atF(80, 50, 1.3, ellipse(0, 0, 13, 7, '#7a8a9a', C.ink, 1.3), path('M-4 4 C2 7 8 5 11 0 C8 -1 0 1 -4 4 Z', '#f0e2c8', null), line('M-2 2 L0 5 M2 2 L4 5 M6 1 L7 4', '#c07a4a', 0.9), path('M-10 -2 L-24 -6 L-24 2 Z', '#7a8a9a', C.ink, 1), path('M-6 -2 C-2 -14 10 -18 14 -12 C8 -8 2 -4 -6 -2 Z', '#5a6a7a', C.ink, 1.1),
      circle(10, -5, 5, '#7a8a9a', C.ink, 1.2), circle(12, -6, 1.6, YEL, C.ink, 0.6), circle(12, -6, 0.6, C.ink, null), path('M14.5 -6 L18 -4 L14 -3 Z', C.dark, C.ink, 0.6), line('M2 6 L4 14 L7 15 M-2 6 L-3 14 L0 15', YEL, 1.6)),
    line('M100 40 L114 36 M100 46 L114 46', C.grey2, 1.2)),
  // ── Populationsdynamik ─────────────────────────────────────────────
  'ekob.populationstäthet': all(bg(), panel(8, 28, 48, 48, '#e6f2d8'), ...range(16).map((i) => hare(15 + (i % 4) * 11, 40 + Math.floor(i / 4) * 10, 0.45)), frame(5, 25, 54, 54),
    greyed(panel(64, 28, 48, 48, '#e6f2d8'), hare(78, 44, 0.45), hare(98, 64, 0.45)), line('M8 84 L56 84 M64 84 L112 84', C.ink, 1.2), line('M8 81 L8 87 M56 81 L56 87 M64 81 L64 87 M112 81 L112 87', C.ink, 1.2), num('=', 60, 98, 14)),
  'ekob.bärförmåga': all(bg(), line('M14 100 L110 100 M14 100 L14 14', C.ink, 1.6), path('M14 96 C40 96 48 40 70 34 C84 30 96 31 108 31', 'none', GRASS2, 3), line('M14 30 L110 30', HL, 2.6, '5 4'),
    hare(30, 112 - 18, 0.55), hare(56, 60, 0.55), hare(90, 22, 0.55), hare(104, 22, 0.55), hare(76, 22, 0.55)),
  'ekob.begränsande-faktor': all(bg(), field(100, '#c9a77a'), at(18, 100, 1, line('M0 0 L0 -14', GRASS2, 2), leafShape(0, -10, 0.3, -40), leafShape(0, -10, 0.3, -140)),
    sunAt(46, 20, 6), rect(39, 34, 14, 56, C.grey2, 2, C.ink, 1), rect(39, 34, 14, 56, YEL, 2, C.ink, 1),
    path('M74 12 C74 12 80 20 80 24 C80 28 74 28 74 28 C74 28 68 28 68 24 C68 20 74 12 74 12 Z', WATER2, C.ink, 1), rect(67, 34, 14, 56, WATER, 2, C.ink, 1),
    hexa(102, 20, 1, '#a8784a'), rect(95, 34, 14, 56, C.grey2, 2, C.ink, 1), rect(95, 78, 14, 12, '#a8784a', 2, C.ink, 1), frame(91, 30, 22, 64)),
  'ekob.massförökning': all(bg(), field(104), spruce(32, 104, 1.6, '#a8784a'), ...range(18).map((i) => beetle(18 + (i * 37) % 30, 32 + (i * 23) % 60, 0.55)),
    greyed(spruce(88, 104, 1.1), beetle(88, 70, 0.55)), panel(70, 8, 42, 30), line('M74 32 L80 32 L86 30 L92 12 L96 30 L108 32', HL, 2.4), ring(32, 62, 24, 40)),
  // ── Symbios och parasitism ─────────────────────────────────────────
  'ekob.kommensalism': all(bg(SKY), field(104), oak(52, 104, 1.6), ellipse(74, 56, 10, 4, '#a8784a', C.ink, 1.1), line('M66 56 L82 56', BARK, 0.8), bird(74, 46, 0.6, { body: '#c98a4a', wing: '#8a5a2e' }),
    circle(96, 26, 8, C.green, C.ink, 1.2), line('M92 26 L100 26 M96 22 L96 30', WHITE, 2.2), circle(22, 50, 8, C.grey2, C.ink, 1.2), num('0', 22, 54, 11, C.dark), ring(74, 50, 14, 12)),
  'ekob.städarfisk': all(bg(WATER), rect(4, 96, 112, 16, '#e8d3a2', 0, null), at(18, 100, 1, path('M0 0 L-4 -14 M0 0 L4 -16 M0 0 L0 -20', 'none', '#e07a7a', 3)), at(102, 100, 1, path('M0 0 L-5 -12 M0 0 L5 -14', 'none', '#c87ab0', 3)),
    atF(54, 54, 2.1, path('M-15 0 L-22 -7 L-22 7 Z', '#8a7a5a', C.ink, 0.8), path('M-16 0 C-10 -10 8 -10 15 -1 L10 1 L15 3 C8 9 -10 9 -16 0 Z', '#a89a72', C.ink, 0.8), circle(8, -3, 1.3, C.ink, null), circle(-2, 3, 1.1, '#6a5a3a', null), circle(-8, -2, 1, '#6a5a3a', null)),
    at(26, 52, 0.55, path('M-15 0 L-22 -6 L-22 6 Z', '#3a6ad0', C.ink, 1.4), path('M-16 0 C-10 -6 8 -6 14 0 C8 6 -10 6 -16 0 Z', '#7ab0f0', C.ink, 1.6), line('M-14 0 L13 0', C.dark, 2.4), circle(9, -2, 1.5, C.ink, null)), ring(28, 52, 12, 9)),
  'ekob.huvudlus': all(bg(), circle(32, 60, 20, C.skin, C.ink, 1.6), path('M12 58 C10 30 54 30 52 58 C46 46 18 46 12 58 Z', '#6a4a2c', C.ink, 1.4), circle(38, 62, 1.6, C.ink, null), line('M36 70 Q40 72 44 70', C.ink, 1),
    circle(84, 50, 26, '#fbf6ea', C.ink, 2.4), line('M66 68 L54 84', C.ink, 5), ...range(5).map((i) => line(`M${62 + i * 9} 30 C${66 + i * 9} 44 ${60 + i * 9} 58 ${66 + i * 9} 74`, '#6a4a2c', 1.6)),
    louse(84, 50, 1.6), circle(84, 50, 26, 'none', HL, 2.6), line('M44 42 L62 40', HL, 1.4, '3 3')),
  'ekob.loppa': all(bg(), field(104, '#d9c9a8'), cat(36, 104, 1.3), circle(90, 44, 22, '#fbf6ea', C.ink, 2.2), flea(90, 44, 2.2), circle(90, 44, 22, 'none', HL, 2.6), line('M74 60 L64 70', C.ink, 4),
    flea(22, 60, 0.4), flea(48, 54, 0.4), line('M22 60 C26 46 32 44 36 50 M48 54 C52 40 58 42 60 48', C.grey, 1, '2 2')),
  'ekob.mistel': all(bg('#e4eef6'), field(100, '#f4f8fb'), bareTree(46, 100, 1.2), ...[[28, 36], [70, 30], [40, 22]].map(([x, y]) => all(circle(x!, y!, 7, LEAF, C.ink, 1.1), circle(x! - 2, y! + 1, 1.3, WHITE, C.ink, 0.5), circle(x! + 2, y! - 1, 1.3, WHITE, C.ink, 0.5))),
    panel(80, 54, 34, 34), ...[[-8, -6, 30], [6, -8, -30], [-6, 6, 150], [8, 6, -150]].map(([dx, dy, a]) => rot(97 + dx! / 2, 71 + dy! / 2, a!, ellipse(0, 0, 7, 3, LEAF, C.ink, 0.9))), circle(95, 70, 2.4, WHITE, C.ink, 0.7), circle(100, 73, 2.4, WHITE, C.ink, 0.7), circle(97, 66, 2.4, WHITE, C.ink, 0.7),
    ring(70, 30, 10), line('M76 38 L88 54', HL, 1.4, '3 3')),
  // ── Biodiversitet ──────────────────────────────────────────────────
  'ekob.biodiversitet': all(bg(), circle(40, 60, 34, '#e6f2d8', C.ink, 1.6), fish(30, 76, 0.5, { body: '#f2a65a' }), butterfly(28, 44, 0.7, '#c87ab0'), bird(52, 42, 0.55), flower(46, 92, RED, 12, 2.6), flower(56, 90, '#8a6bbf', 14, 2.6), frog(54, 70, 0.8), beetle(18, 60, 0.7, '#2f7a4a'),
    at(36, 62, 0.6, path('M-6 0 C-6 -8 6 -8 6 0 Z', '#d8343a', C.ink, 1), rect(-2, 0, 4, 5, WHITE, 1, C.ink, 0.8)), ring(40, 60, 37),
    greyed(circle(92, 60, 20, '#e6f2d8', C.ink, 1.4), ...range(6).map((i) => line(`M${82 + (i % 3) * 10} ${68 - Math.floor(i / 3) * 12} l0 -8`, GRASS2, 2)))),
  'ekob.nyckelart': all(bg(SKY), rect(4, 70, 112, 42, WATER, 0, null), path('M60 70 L100 70 L104 112 L56 112 Z', '#9a7a5a', null), ...range(6).map((i) => line(`M${60 + i * 7} 72 L${66 + i * 7} 110`, '#6a4a2c', 2)),
    rect(100, 70, 16, 42, GRASS, 0, null), beaver(76, 62, 1.1), frog(24, 80, 0.9), fish(36, 96, 0.55), bird(22, 56, 0.6, { body: '#c9ced4', wing: '#8a9aa8' }), butterfly(46, 30, 0.6, '#f2c14e'),
    arrow(62, 58, 34, 52, HL, 2), arrow(62, 66, 32, 80, HL, 2), arrow(66, 74, 44, 94, HL, 2), ring(76, 60, 18, 14)),
  'ekob.fragmentering': all(bg('#e8e2d4'), ...[[8, 8, 46, 44], [66, 8, 46, 44], [8, 66, 46, 42], [66, 66, 46, 42]].map(([x, y, w, h]) => all(rect(x!, y!, w!, h!, '#9cc77a', 4, C.ink, 1.2), spruce(x! + 14, y! + h! - 4, 0.6), spruce(x! + 32, y! + h! - 6, 0.55))),
    rect(4, 54, 112, 10, C.grey, 0, null), rect(56, 4, 8, 108, C.grey, 0, null), line('M4 59 L116 59 M60 4 L60 112', WHITE, 1, '4 4'),
    hare(36, 30, 0.7, '#a0673d'), arrow(42, 36, 74, 36, HL, 2.2), cross(60, 36, 6), frame(5, 5, 110, 106)),
  'ekob.blomsteräng': all(bg(SKY), field(76), ...range(14).map((i) => flower(10 + i * 7.6, 108 - (i % 3) * 6, [RED, '#8a6bbf', YEL, WHITE, '#ef9fb5', '#3f6fb5'][i % 6]!, 14 + (i % 4) * 4, 2.8)),
    ...range(10).map((i) => tuft(14 + i * 10, 112, 1)), bee(40, 52, 1), bee(82, 46, 1), butterfly(62, 40, 1, '#f2a65a'), circle(100, 18, 8, YEL, C.ink, 1.2)),
  'ekob.massutdöende': all(bg('#f2e6dc'), field(100, '#c9b49a'), circle(96, 18, 7, '#7a6a5a', C.ink, 1.2), line('M90 24 L70 42 M94 26 L80 40 M88 20 L74 32', '#f2a65a', 2.4),
    greyed(dino(30, 100, 0.9), shell(68, 94, 0.9), fish(94, 92, 0.7), at(14, 100, 1, line('M0 0 L0 -16 M0 -8 L-5 -14 M0 -10 L5 -16', GRASS2, 2))),
    cross(30, 74, 6), cross(68, 80, 5), cross(94, 78, 5), cross(14, 80, 4), frame(6, 56, 108, 50)),
  // ── Kretslopp av näringsämnen ──────────────────────────────────────
  'ekob.kolets-kretslopp': all(bg(SKY), field(92), co2(60, 18, 1.2), oak(24, 100, 0.8), cow(86, 102, 1.2), ellipse(58, 106, 10, 3, '#7a5232', C.ink, 1),
    path('M44 22 C30 26 24 36 24 44', 'none', HL, 2.4), path('M24 44 L20 38 L28 38 Z', HL, null), path('M40 70 C52 80 62 84 70 86', 'none', HL, 2.4), path('M70 86 L63 87 L66 80 Z', HL, null),
    path('M96 76 C100 56 92 34 76 22', 'none', HL, 2.4), path('M76 22 L84 22 L80 28 Z', HL, null), line('M58 102 L58 34', C.grey, 1.6, '3 3')),
  'ekob.urlakning': all(bg(SKY), rect(4, 46, 84, 66, SOIL, 0, null), rect(88, 60, 28, 52, '#7ab070', 0, null), line('M88 60 L116 60', WATER2, 1.4), ...range(5).map((i) => line(`M${12 + i * 16} 10 l-3 8 M${20 + i * 16} 22 l-3 8`, WATER2, 1.8)),
    at(30, 46, 1, line('M0 0 L0 -14', GRASS2, 2), path('M0 -10 C-6 -14 -10 -12 -12 -10 C-8 -8 -4 -8 0 -10 Z M0 -12 C6 -16 10 -14 12 -12 C8 -10 4 -10 0 -12 Z', '#c9c86a', C.ink, 0.8)),
    ...range(9).map((i) => circle(20 + (i % 3) * 18 + Math.floor(i / 3) * 8, 62 + Math.floor(i / 3) * 14, 2.6, ['#3f6fb5', '#f2c14e', '#d0679a'][i % 3]!, C.ink, 0.6)), arrow(30, 86, 84, 98, HL, 3), ...range(4).map((i) => circle(94 + i * 5, 72 + (i % 2) * 6, 2, '#4f9d4a', null))),
  // ── Organismers livscykler ─────────────────────────────────────────
  'ekob.äggläggning': all(bg('#eef4ea'), path('M6 30 C30 10 90 14 114 34 C90 40 30 42 6 30 Z', LEAF, C.ink, 1.4), line('M6 30 L112 32', LEAF2, 1.2),
    butterfly(56, 60, 1.6, '#f6f2ea'), circle(48, 52, 2, C.dark, null), ...range(7).map((i) => ellipse(68 + (i % 4) * 6, 40 + Math.floor(i / 4) * 5, 2.2, 2.8, YEL, C.ink, 0.7)), ring(76, 42, 14, 8), line('M60 64 C64 54 66 48 68 44', C.dark, 1.2)),
  'ekob.ormbunke': all(bg('#e4eee0'), field(100, '#7a6a4a'), ...[[-50, 1], [-25, 1.1], [0, 1.2], [25, 1.1], [50, 1]].map(([a, s]) => g(`translate(60 104) rotate(${a}) scale(${s})`, line('M0 0 C2 -30 0 -56 -4 -76', LEAF2, 1.6),
    ...range(10).map((i) => { const y = -10 - i * 6.5, len = 12 - Math.abs(i - 3) * 1.1; return all(ellipse(-len / 2 - 0.5, y, len / 2, 2.2, LEAF, C.ink, 0.5), ellipse(len / 2 + 0.5, y, len / 2, 2.2, LEAF, C.ink, 0.5)); })))),
  'ekob.livslängd.2': all(bg(), ...([[26, 4, '#f2c14e'], [60, 30, '#a0673d'], [94, 76, '#7a9a5a']] as const).map(([y, w, col]) => all(line(`M36 ${y} L112 ${y}`, C.grey2, 1.2), rect(36, y - 5, w, 10, col, 2, C.ink, 1.1))),
    at(20, 26, 0.9, ellipse(0, 0, 6, 2, '#c9b49a', C.ink, 0.8), ellipse(-2, -4, 5, 2, 'rgba(220,240,252,0.9)', C.ink, 0.6), line('M-6 0 L-14 -2 M-6 1 L-14 2', C.ink, 0.6)), num('1', 50, 30, 10),
    at(18, 64, 0.65, ellipse(0, 0, 12, 7, '#a0673d', C.ink, 1.2), circle(10, -6, 6, '#a0673d', C.ink, 1.2), path('M6 -10 L4 -2 L9 -4 Z', '#6a4a2c', null), line('M-8 6 L-8 11 M8 6 L8 11', C.ink, 1.4)), num('15', 78, 64, 10),
    at(18, 98, 0.65, path('M-14 4 C-14 -10 14 -10 14 4 Z', '#7a9a5a', C.ink, 1.2), path('M-8 -4 L0 -8 L8 -4 M-10 2 L-4 -4 L4 -4 L10 2', 'none', '#4a6a3a', 1), circle(17, 0, 4, '#9aba7a', C.ink, 1.1), line('M-9 4 L-10 8 M9 4 L10 8', C.ink, 1.6)), num('100', 92, 84, 10),
    frame(33, 12, 81, 94)),
};
