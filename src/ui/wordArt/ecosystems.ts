/**
 * Natur & geografi → Ekologi & miljö → Ekosystemets grunder, 2901–2907 (0.46): species and populations, habitats,
 * food chains, producers and consumers, decomposers, ecological niches and ecosystem services.
 * Recurring signs: animals are drawn side-on facing right in natural colours with one dark outline; an orange
 * arrow always means "is eaten by" or "energy goes to"; small yellow sparkles are energy from the sun; coloured dots
 * in the soil are nutrients; a magnifying lens or a microscope circle shows what is too small to see. The thing the
 * word names is coloured and ringed in orange, while the rest is drawn pale or grey. Abstract words are small
 * symbolic scenes where the coloured idea dominates and a grey copy stands beside it as contrast. Predators and
 * prey are shown with restraint: no blood, no wounds. No words, no letters, no brands and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { HL } from './people';
import { greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const PAPER = '#f6f2ea';
const SKY = '#d8ecf6';
const NIGHT = '#2f3b5c';
const GRASS = '#a6cf72';
const GRASS2 = '#6fa64a';
const LEAF = '#5fa84a';
const LEAF2 = '#3d7f33';
const TRUNK = '#8a6244';
const SOIL = '#9a6c46';
const SOIL2 = '#7a5236';
const WATER = '#9fd0ec';
const WATER2 = '#4f93c8';
const HARE = '#b08a62';
const FOX = '#e07a2e';
const DEER = '#b5793f';
const MOUSE = '#9a8f86';
const FROG = '#6fb04a';
const HAWK = '#8a6a4a';
const YEL = '#f6d03c';
const GOLD = '#e6a817';
const RED = '#d93a3a';
const WHITE = '#fbfbf8';
const GREY = '#c4c8cc';
const ROCK = '#a7a19a';
const BERRY = '#c8283c';
const DOT_N = '#3f7fd0';
const DOT_P = '#e0559a';
const DOT_K = '#f0a020';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const flipAt = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${-s} ${s})`, ...k);
const rot = (x: number, y: number, r: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${r}) scale(${s})`, ...k);
const bg = (col: string = PAPER) => rect(4, 4, 112, 108, col, 3, null);
const ground = line('M4 112 L116 112', C.grey2, 2);
const meadow = (y = 92) => all(bg(SKY), rect(4, y, 112, 112 - y, GRASS, 0, null), line(`M4 ${y} L116 ${y}`, GRASS2, 1.4));
const ring = (x: number, y: number, rx: number, ry = rx) => ellipse(x, y, rx, ry, 'none', HL, 2.6);
const rng = (seed: number) => { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; };
const sunAt = (x: number, y: number, r = 7) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 5))} ${f1(y + Math.sin(a) * (r + 5))}`, GOLD, 1.6); }), circle(x, y, r, YEL, GOLD, 1.4));
const check = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 8, WHITE, C.green, 2), line('M-4 0 L-1 3.5 L4.5 -3.5', C.green, 2.4));
const cross = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 8, WHITE, RED, 2), line('M-3.5 -3.5 L3.5 3.5 M3.5 -3.5 L-3.5 3.5', RED, 2.4));
const panel = (x: number, y: number, w: number, h: number, fill: string = WHITE) => rect(x, y, w, h, fill, 3, C.ink, 1.4);
const lens = (x: number, y: number, r: number, inner: Svg, fill: string = WHITE) => all(line(`M${f1(x + r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r + 10)} ${f1(y + r + 10)}`, C.dark, 4), circle(x, y, r, fill, C.dark, 2.6), inner, circle(x, y, r, 'none', C.dark, 2.6));
const energy = (x: number, y: number, r = 3.4) => sparkle(x, y, r, GOLD);
const dots = (x: number, y: number, w: number, h: number, n: number, seed: number, r = 1.6, cols: string[] = [DOT_N, DOT_P, DOT_K]) => { const R = rng(seed); return all(...range(n).map((i) => circle(f1(x + R() * w), f1(y + R() * h), r, cols[i % cols.length]!, C.ink, 0.5))); };
const zz = (x: number, y: number, col: string = WHITE) => all(path(`M${x} ${y} l5 0 l-5 5 l5 0`, 'none', col, 1.4), path(`M${x + 7} ${y - 8} l6 0 l-6 6 l6 0`, 'none', col, 1.6));
const speed = (x: number, y: number) => line(`M${x} ${y} l-6 0 M${x + 1} ${y + 5} l-8 0 M${x} ${y + 10} l-6 0`, C.ink, 1.2);

// ── Plants ───────────────────────────────────────────────────────────
const grass = (x: number, y: number, s = 1, col: string = GRASS2) => at(x, y, s, line('M-4 0 Q-6 -8 -9 -12 M-1 0 Q-1 -9 -3 -15 M2 0 Q3 -9 5 -14 M5 0 Q8 -6 10 -9', col, 1.6));
const tree = (x: number, y: number, s = 1, col: string = LEAF) => at(x, y, s, path('M-3 0 L-2.4 -22 L2.4 -22 L3 0 Z', TRUNK, C.ink, 1.2), circle(0, -30, 12, col, C.ink, 1.2), circle(-8, -24, 8, col, C.ink, 1.2), circle(8, -24, 8, col, C.ink, 1.2), circle(0, -24, 8, col, null));
const spruce = (x: number, y: number, s = 1, col: string = '#3f8a4f') => at(x, y, s, rect(-1.6, -6, 3.2, 6, TRUNK, 0, C.ink, 1), path('M0 -40 L-7 -28 L-4 -28 L-10 -17 L-6 -17 L-12 -6 L12 -6 L6 -17 L10 -17 L4 -28 L7 -28 Z', col, C.ink, 1.2));
const flower = (x: number, y: number, s = 1, col: string = '#f2a0c4', mid: string = YEL) => at(x, y, s, line('M0 0 L0 -14', GRASS2, 1.6), path('M0 -6 C-5 -8 -6 -11 -6 -12 C-3 -11 -1 -9 0 -7', LEAF, C.ink, 0.8), ...range(5).map((i) => rot(0, -16, i * 72, 1, ellipse(0, -3.4, 2.4, 3.4, col, C.ink, 0.7))), circle(0, -16, 2, mid, C.ink, 0.7));
const bush = (x: number, y: number, s = 1, berries = 0, col: string = LEAF, seed = 5) => { const R = rng(seed); return at(x, y, s, ellipse(0, -10, 16, 11, col, C.ink, 1.2), ellipse(-9, -6, 9, 6, col, C.ink, 1.2), ellipse(9, -6, 9, 6, col, C.ink, 1.2), ellipse(0, -6, 12, 6, col, null), ...range(berries).map(() => circle(f1(-12 + R() * 24), f1(-18 + R() * 14), 1.8, BERRY, C.ink, 0.6))); };
const leafShape = (x: number, y: number, s = 1, a = 0, col: string = LEAF) => rot(x, y, a, s, path('M-10 0 C-6 -6 6 -6 10 0 C6 6 -6 6 -10 0 Z', col, C.ink, 1), line('M-9 0 L9 0', LEAF2, 0.7));
const reeds = (x: number, y: number, s = 1) => at(x, y, s, line('M-6 0 Q-7 -14 -9 -24 M-2 0 Q-2 -16 -3 -28 M2 0 Q3 -14 5 -22 M6 0 Q8 -10 10 -18', GRASS2, 1.6), rect(-4.4, -34, 2.8, 9, '#8a5a30', 1.4, C.ink, 0.6), rect(3.6, -29, 2.8, 8, '#8a5a30', 1.4, C.ink, 0.6));
const nettle = (x: number, y: number, s = 1, col: string = LEAF) => at(x, y, s, line('M0 0 L0 -30', GRASS2, 1.8), ...[-8, -16, -24].map((yy, i) => all(rot(0, yy, -150 + i * 4, 1, path('M0 0 L4 -3 L8 -1 L11 -3 L14 0 L11 3 L8 1 L4 3 Z', col, C.ink, 0.8)), rot(0, yy, -30 - i * 4, 1, path('M0 0 L4 -3 L8 -1 L11 -3 L14 0 L11 3 L8 1 L4 3 Z', col, C.ink, 0.8)))));

// ── Animals (side-on, facing right, feet on y = 0) ───────────────────
const mouse = (col: string = MOUSE) => all(path('M-8 -4 C-14 -4 -18 -8 -22 -4', 'none', C.ink, 1.2), ellipse(0, -5, 8.5, 5, col, C.ink, 1.2), circle(8, -6.5, 4, col, C.ink, 1.2), circle(6.4, -10.4, 2.6, '#e8b7b0', C.ink, 1), circle(9.6, -7.4, 0.8, C.ink, null), circle(12, -6, 0.9, '#d08080', null));
const hare = (col: string = HARE) => all(ellipse(-1, -10, 12, 8, col, C.ink, 1.3), circle(-12, -12, 3.4, WHITE, C.ink, 1), ellipse(11, -16, 6.4, 5.2, col, C.ink, 1.3), rot(7, -20, -18, 1, ellipse(0, -8, 2.4, 8.4, col, C.ink, 1.2)), rot(10, -20, -6, 1, ellipse(0, -8, 2.4, 8.4, col, C.ink, 1.2)), circle(13.4, -17, 1, C.ink, null),
  path('M-8 -4 C-10 0 -4 1 2 0', col, C.ink, 1.2), line('M6 -3 L8 0', C.ink, 1.4));
const fox = (col: string = FOX) => all(path('M-13 -12 C-24 -12 -30 -4 -28 2 C-24 -2 -18 -6 -12 -8 Z', col, C.ink, 1.2), path('M-28 2 C-27 -1 -25 -3 -23 -4 C-24 -1 -26 1 -28 2 Z', WHITE, C.ink, 0.8),
  line('M-8 -8 L-9 0 M-4 -8 L-3 0 M6 -8 L5 0 M10 -8 L11 0', C.ink, 2), ellipse(0, -12, 14, 6.4, col, C.ink, 1.2), path('M10 -16 L14 -26 L17 -18 L20 -25 L22 -15 C26 -14 28 -12 29 -11 L22 -8 C18 -6 12 -8 10 -12 Z', col, C.ink, 1.2), path('M22 -8 C24 -9 27 -10 29 -11 L22 -11 Z', WHITE, null), circle(19, -14, 1, C.ink, null), circle(29, -11, 1, C.ink, null));
const deer = (col: string = DEER, antlers = true) => all(line('M-11 -16 L-12 0 M-7 -16 L-6 0 M8 -16 L7 0 M12 -16 L13 0', C.ink, 2.2), ellipse(0, -22, 16, 8, col, C.ink, 1.3), ellipse(-14, -23, 3.4, 3, WHITE, C.ink, 0.8), path('M10 -26 L16 -40 L22 -38 L18 -24 Z', col, C.ink, 1.3), path('M16 -40 C20 -42 26 -40 28 -36 L22 -34 Z', col, C.ink, 1.2), ellipse(17, -43, 2, 3.4, col, C.ink, 1), circle(21, -39, 0.9, C.ink, null),
  antlers ? line('M18 -44 L17 -52 M17 -48 L14 -51 M20 -44 L22 -51', '#6a4a2a', 1.6) : '');
const bird = (col: string = '#7a8aa0', belly: string = '#e8e0d0') => all(path('M-8 -9 L-15 -12 L-14 -7 Z', col, C.ink, 1), ellipse(0, -8, 8, 5.4, col, C.ink, 1.2), path('M-4 -6 C0 -3 5 -4 7 -6', belly, null), circle(7, -12, 4, col, C.ink, 1.2), path('M10.6 -12.6 L14 -11.6 L10.6 -10.6 Z', GOLD, C.ink, 0.7), circle(8.4, -12.8, 0.8, C.ink, null), line('M-1 -3 L-1 0 M2 -3 L2 0', C.ink, 1.1));
const hawk = (col: string = HAWK) => all(path('M-4 -2 C-16 -10 -26 -8 -34 -4 C-24 -2 -14 2 -4 4 Z', col, C.ink, 1.2), path('M-4 -2 C-12 -16 -22 -20 -30 -22 C-22 -12 -14 -4 -4 2 Z', '#a07e5c', C.ink, 1.2), ellipse(2, 0, 11, 5, col, C.ink, 1.2), path('M-8 0 L-16 4 L-14 -2 Z', col, C.ink, 1), circle(13, -3, 4.4, col, C.ink, 1.2), path('M17 -4 C20 -4 20 -1 18 0 L16.4 -1.6 Z', GOLD, C.ink, 0.7), circle(14, -4, 0.9, C.ink, null), path('M-2 2 C2 4 6 4 9 2', '#e8d6b6', null));
const owl = (col: string = '#9a7a5a') => all(ellipse(0, -14, 10, 14, col, C.ink, 1.3), circle(-4.2, -20, 4, '#e8d6b6', C.ink, 0.8), circle(4.2, -20, 4, '#e8d6b6', C.ink, 0.8), circle(-4.2, -20, 1.8, C.ink, null), circle(4.2, -20, 1.8, C.ink, null), path('M-1.4 -17 L1.4 -17 L0 -14 Z', GOLD, C.ink, 0.6), path('M-5 -8 C-2 -6 2 -6 5 -8 M-5 -4 C-2 -2 2 -2 5 -4', 'none', '#6a4a2a', 0.9), line('M-3 0 L-3 1.5 M3 0 L3 1.5', GOLD, 1.4));
const frog = (col: string = FROG) => all(path('M-10 0 C-14 -2 -14 -6 -8 -6 L-2 -2', col, C.ink, 1.2), ellipse(0, -7, 10, 6, col, C.ink, 1.3), circle(5, -12, 3, col, C.ink, 1.1), circle(5.6, -12.6, 1.2, C.ink, null), path('M6 -6 C9 -6 11 -7 11 -8', 'none', C.ink, 0.9), path('M4 -3 L6 0 L9 0', 'none', C.ink, 1.3), ellipse(-2, -9, 1.4, 1, '#3d7f33', null), ellipse(-6, -7, 1.2, 0.9, '#3d7f33', null));
const hopper = (col: string = '#7cb342') => all(ellipse(0, -5, 10, 3.4, col, C.ink, 1.1), ellipse(10, -6.6, 3.6, 3.4, col, C.ink, 1.1), circle(11.6, -7.6, 0.9, C.ink, null), path('M-2 -6 L-8 -14 L-14 0', 'none', C.ink, 1.4), path('M-2 -6 L-8 -14 L-14 0', 'none', col, 0.8), line('M4 -3 L3 0 M7 -3 L8 0', C.ink, 1), path('M12 -9 C16 -16 20 -18 24 -18', 'none', C.ink, 0.9), path('M-6 -7 L8 -7.4', 'none', '#5a8a2a', 1));
const fish = (col: string = '#8fa6b8') => all(path('M-12 0 L-18 -6 L-18 6 Z', col, C.ink, 1.1), ellipse(0, 0, 12, 5.6, col, C.ink, 1.2), circle(7, -1.4, 1, C.ink, null), path('M3 -4 C4 -1 4 1 3 4', 'none', C.ink, 0.8));
const bee = (s = 1) => at(0, 0, s, ellipse(-2, -8, 5, 3.2, 'rgba(230,242,250,0.9)', C.ink, 0.8), ellipse(2, -8, 5, 3.2, 'rgba(230,242,250,0.9)', C.ink, 0.8), ellipse(0, 0, 8, 5.6, '#f2c230', C.ink, 1.2), path('M-3 -5 C-4 -2 -4 2 -3 5 M2 -5.4 C1 -2 1 2 2 5.4', 'none', C.ink, 2.2), circle(8, -1, 3.4, C.ink, null));
const woodlouse = (col: string = '#8a8f96') => all(...range(7).map((i) => line(`M${-9 + i * 3} -2 L${-10 + i * 3} 0.6`, C.ink, 0.9)), path('M-11 -2 C-11 -9 9 -9 11 -3 C12 -1 10 -1 8 -1 L-9 -1 C-11 -1 -11 -1 -11 -2 Z', col, C.ink, 1.1), ...range(6).map((i) => line(`M${-7 + i * 3} -7 C${-7.6 + i * 3} -4 ${-7.6 + i * 3} -3 ${-7 + i * 3} -1.4`, '#5f646a', 0.8)), line('M11 -3 C14 -6 16 -6 18 -5 M11 -2 C14 -3 16 -2 18 -1', C.ink, 0.8), path('M-11 -2 L-14 -4 M-11 -1.6 L-14 0', 'none', C.ink, 0.8));
const bact = (x: number, y: number, s = 1, a = 0, col: string = '#7ac08a') => rot(x, y, a, s, path('M-8 -3 C-10 -3 -10 3 -8 3 L8 3 C10 3 10 -3 8 -3 Z', col, C.ink, 1), path('M9.6 0 C12 -2 13 2 15 0 C16 -1 17 1 18 0', 'none', C.ink, 0.7), ellipse(-2, 0, 2, 1, 'rgba(0,0,0,0.18)', null));
const coccus = (x: number, y: number, r: number, col: string) => all(circle(x, y, r, col, C.ink, 0.9), circle(f1(x - r * 0.3), f1(y - r * 0.3), f1(r * 0.3), 'rgba(255,255,255,0.5)', null));
const diatom = (x: number, y: number, s = 1, a = 0) => rot(x, y, a, s, ellipse(0, 0, 7, 2.6, '#a8d86a', C.ink, 0.9), line('M-5 0 L5 0', '#5f9a3a', 0.6), circle(0, 0, 0.8, '#3d7f33', null));
const greenCell = (x: number, y: number, r = 3) => all(circle(x, y, r, '#8ccf5a', C.ink, 0.8), circle(f1(x + r * 0.2), f1(y - r * 0.1), f1(r * 0.4), '#4f9a2a', null));
const copepod = (x: number, y: number, s = 1, a = 0, col: string = '#f0b070') => rot(x, y, a, s, path('M-2 -4 C6 -5 8 -1 6 2 C4 4 0 4 -2 3 Z', col, C.ink, 0.9), path('M-2 3 L-7 6 M-2 0 L-8 0', 'none', C.ink, 0.8), path('M6 -3 C10 -8 14 -9 18 -8 M6 -2 C10 -5 14 -3 17 -1', 'none', C.ink, 0.7), circle(4, -2, 0.8, RED, null));
const worm = (x: number, y: number, s = 1, col: string = '#d98a8a') => at(x, y, s, path('M-12 0 C-8 -6 -4 4 0 -1 C4 -6 8 3 12 -2', 'none', C.ink, 4.6), path('M-12 0 C-8 -6 -4 4 0 -1 C4 -6 8 3 12 -2', 'none', col, 3.2));
const butterfly = (x: number, y: number, s = 1, col: string = '#f0a030') => at(x, y, s, path('M0 0 C-6 -10 -14 -10 -12 -2 C-11 2 -5 2 0 0 Z M0 0 C6 -10 14 -10 12 -2 C11 2 5 2 0 0 Z', col, C.ink, 1), path('M0 0 C-5 4 -10 8 -7 10 C-4 11 -1 6 0 0 Z M0 0 C5 4 10 8 7 10 C4 11 1 6 0 0 Z', col, C.ink, 1), ellipse(0, 1, 1.2, 5, C.ink, null), line('M0 -4 L-3 -9 M0 -4 L3 -9', C.ink, 0.8));
const caterpillar = (x: number, y: number, s = 1, col: string = '#3a3a3a') => at(x, y, s, ...range(6).map((i) => circle(-10 + i * 4, i % 2 ? -1 : 0, 2.8, col, C.ink, 0.6)), ...range(6).map((i) => line(`M${-10 + i * 4} -2.6 l0 -2`, '#f2f2f2', 0.6)), circle(12, -1, 3, col, C.ink, 0.7), circle(13, -2, 0.7, WHITE, null));
const tick = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 0, 2.6, 2, '#5a2a1a', C.ink, 0.5), circle(2.6, 0, 0.9, C.ink, null), line('M-2 -1.6 l-1.4 -1 M0 -2 l0 -1.6 M-2 1.6 l-1.4 1 M0 2 l0 1.6', C.ink, 0.5));
const crow = (col: string = '#3a3d48') => bird(col, '#4a4e5a');
const duck = (col: string = '#9a7a5a') => all(path('M-12 -6 C-12 -14 4 -14 8 -8 C10 -4 6 0 -2 0 C-10 0 -12 -2 -12 -6 Z', col, C.ink, 1.2), path('M-6 -9 C-2 -12 3 -11 5 -8', 'none', '#6a4a2a', 1), circle(8, -14, 4.4, col, C.ink, 1.2), path('M12 -15 C15 -15 16 -13 16 -12 L12 -12 Z', GOLD, C.ink, 0.8), circle(9, -15, 0.8, C.ink, null));
const duckling = (col: string = '#f2d24a') => all(ellipse(0, -3.6, 5, 3.6, col, C.ink, 1), circle(4, -7.6, 2.8, col, C.ink, 1), path('M6.4 -8 L8.6 -7.4 L6.4 -6.8 Z', GOLD, C.ink, 0.6), circle(4.6, -8.2, 0.6, C.ink, null));
const gull = (col: string = WHITE) => all(path('M-9 -8 L-16 -10 L-14 -6 Z', '#9aa3ad', C.ink, 1), ellipse(0, -7, 9, 5, col, C.ink, 1.2), path('M-8 -9 C-4 -12 2 -12 4 -9 L-6 -6 Z', '#9aa3ad', C.ink, 1), circle(8, -11, 3.6, col, C.ink, 1.2), path('M11 -11.6 L15 -11 L11 -10 Z', GOLD, C.ink, 0.7), circle(9, -12, 0.7, C.ink, null), line('M-1 -2 L-1 0 M2 -2 L2 0', GOLD, 1.1));
const flyingGull = (x: number, y: number, s = 1, col: string = WHITE) => at(x, y, s, path('M-12 -2 C-8 -6 -3 -6 0 0 C3 -6 8 -6 12 -2 C8 -3 4 -2 0 2 C-4 -2 -8 -3 -12 -2 Z', col, C.ink, 1));
const squirrel = (col: string = '#c0602a') => all(path('M-6 -6 C-16 -6 -18 -20 -10 -26 C-6 -28 -4 -22 -8 -20 C-12 -16 -10 -10 -4 -10 Z', col, C.ink, 1.2), ellipse(0, -8, 7, 6, col, C.ink, 1.2), circle(6, -14, 4.4, col, C.ink, 1.2), path('M4.6 -18 L5 -22 L7.4 -18.4 Z', col, C.ink, 0.9), circle(7.6, -14.6, 0.8, C.ink, null), line('M2 -2 L3 0 M-3 -2 L-4 0', C.ink, 1.2));
/** Small framed icon of an animal (feet on the frame bottom). */
const lemming = (col: string = '#c99a5a') => all(ellipse(0, -5, 8, 5.2, col, C.ink, 1.2), path('M-4 -9.6 C0 -10.6 4 -10 6 -8 L-4 -6 Z', '#3a3030', null), circle(7, -6, 3.8, col, C.ink, 1.1), circle(8.6, -7, 0.8, C.ink, null), line('M-2 -1 L-2 0 M3 -1 L3 0', C.ink, 1));

/** Woodpecker clinging to a trunk on its left side (feet at 0,0), black and white with a red cap. */
const woodpecker = () => all(path('M2 4 L-2 12 L4 10 Z', '#2e2e36', C.ink, 1), ellipse(2, -6, 5, 10, '#2e2e36', C.ink, 1.2), ellipse(3.4, -4, 2.6, 6, '#f2f2f2', null), circle(0, -18, 4.6, '#2e2e36', C.ink, 1.2), path('M-2 -22 C0 -24 3 -23 4 -21 L0 -20 Z', RED, null), ellipse(1.4, -17, 2, 1.6, '#f2f2f2', null), path('M-4 -18.6 L-10 -17.6 L-4 -16.6 Z', '#6a6a6a', C.ink, 0.7), circle(-1.6, -19, 0.8, C.ink, null), line('M-1 0 L-4 1 M-1 -3 L-4 -2', C.ink, 1.2));
/** Grey wolf, side-on facing right. */
const wolf = (col: string = '#7c828c') => all(path('M-13 -12 C-22 -14 -26 -8 -26 -2 C-22 -6 -18 -8 -12 -8 Z', col, C.ink, 1.2), line('M-8 -8 L-9 0 M-4 -8 L-3 0 M6 -8 L5 0 M10 -8 L11 0', C.ink, 2.4), ellipse(0, -13, 15, 7.4, col, C.ink, 1.3), path('M-6 -18 C0 -21 8 -20 12 -16', 'none', '#4a4e56', 2), path('M10 -18 L13 -30 L17 -20 L20 -29 L22 -16 C27 -15 30 -13 31 -11 L22 -7 C17 -6 12 -8 10 -12 Z', col, C.ink, 1.3), path('M22 -7 C25 -8 28 -10 31 -11 L22 -11 Z', '#e8e8e8', null), circle(19, -15, 1.1, C.ink, null), circle(31, -11, 1, C.ink, null));

// ── Composite helpers ────────────────────────────────────────────────
const pond = (cx: number, cy: number, rx: number, ry: number) => all(ellipse(cx, cy, rx, ry, WATER, WATER2, 1.6), path(`M${cx - rx * 0.5} ${cy} q4 -2 8 0 M${cx + rx * 0.1} ${cy + ry * 0.4} q4 -2 8 0`, 'none', WATER2, 0.8));
/** A pyramid of four bands (bottom = producers). hl = index of the highlighted band (0 = bottom) or -1. */
const pyramid = (hl: number, icons: Svg[]) => {
  const cols = ['#9fd07a', '#e9d68a', '#f0b98a', '#e89a8a'];
  const bands = range(4).map((i) => { const y1 = 104 - i * 22, y2 = y1 - 22, w1 = 50 - i * 12, w2 = 50 - (i + 1) * 12; return path(`M${60 - w1} ${y1} L${60 + w1} ${y1} L${60 + w2} ${y2} L${60 - w2} ${y2} Z`, hl === -1 || hl === i ? cols[i]! : GREY, C.ink, 1.3); });
  return all(...bands, ...icons.map((ic, i) => (hl === -1 || hl === i ? ic : greyed(ic))), hl >= 0 ? path(`M${60 - (50 - hl * 12) - 3} ${104 - hl * 22 + 2} L${60 + (50 - hl * 12) + 3} ${104 - hl * 22 + 2} L${60 + (50 - (hl + 1) * 12) + 3} ${104 - (hl + 1) * 22 - 2} L${60 - (50 - (hl + 1) * 12) - 3} ${104 - (hl + 1) * 22 - 2} Z`, 'none', HL, 2.6) : '');
};
const pyrIcons = (): Svg[] => [all(grass(44, 100, 0.9), grass(60, 100, 0.9), grass(76, 100, 0.9)), all(at(46, 80, 0.62, hare()), at(72, 80, 0.62, hopper())), at(56, 58, 0.62, frog()), at(56, 36, 0.5, fox())];
const blockTower = (x: number, y: number, s: number, tilt: number, falling: boolean) => {
  const icons = [all(grass(0, 8, 0.6)), at(0, 9, 0.42, hare()), at(-2, 9, 0.42, frog()), at(-3, 9, 0.32, fox())];
  const block = (i: number, dx: number, a: number) => rot(dx, -i * 14 - 7, a, 1, rect(-12 + i * 1.6, -7, 24 - i * 3.2, 14, ['#bfe3a0', '#f0dca0', '#f6c8a0', '#f0aaa0'][i]!, 2, C.ink, 1.2), g('translate(0 -8)', icons[i]!));
  return at(x, y, s, ...range(4).map((i) => (falling ? block(i, (i % 2 ? -1 : 1) * i * tilt * 7 + i * tilt * 4, (i % 2 ? -1 : 1) * i * tilt * 16 + i * 6) : block(i, 0, 0))));
};

// ── Motifs ───────────────────────────────────────────────────────────
export const ECOSYSTEM_MOTIFS: Record<string, Svg> = {
  // ── 2901 Art och population ──
  /** ekosystem: a pond with its surroundings inside one big orange ring – sun, a tree, grass, a frog on the bank, a fish in the water and a bird – joined by thin orange double arrows that show how they all affect each other. */
  'ekos.ekosystem': all(bg(SKY), rect(4, 80, 112, 32, GRASS, 0, null), sunAt(96, 22, 7), tree(30, 82, 1.2), pond(70, 94, 30, 10), at(66, 98, 0.8, fish()), at(40, 92, 0.9, frog()), grass(98, 84), grass(12, 86), at(74, 52, 1, bird()),
    line('M88 28 Q66 36 40 46', HL, 1.4, '3 3'), line('M44 88 Q56 80 64 92', HL, 1.4, '3 3'), line('M34 56 Q54 46 66 46', HL, 1.4, '3 3'), line('M76 56 Q84 70 74 86', HL, 1.4, '3 3'), ellipse(60, 64, 54, 44, 'none', HL, 2.8)),
  /** population: a meadow where seven hares of the same kind graze inside one orange dashed border; outside the border a grey fox and a grey hare from another area stand apart. */
  'ekos.population': all(meadow(56), ellipse(54, 82, 46, 24, 'rgba(228,87,46,0.08)', HL, 2.4), ...[[24, 76], [44, 70], [66, 72], [82, 82], [34, 96], [56, 92], [74, 100]].map(([x, y], i) => (i % 2 ? flipAt(x!, y!, 0.6, hare()) : at(x!, y!, 0.6, hare()))),
    greyed(at(100, 50, 0.55, fox()), at(108, 108, 0.5, hare())), ellipse(54, 82, 46, 24, 'none', HL, 2.4), tree(20, 56, 0.7), tree(98, 30, 0.6)),
  /** individ (2): the same group of hares drawn grey; one single hare in the middle is coloured and ringed in orange. */
  'ekos.individ.2': all(meadow(56), greyed(...[[22, 76], [44, 70], [86, 72], [92, 96], [30, 100], [70, 104]].map(([x, y], i) => (i % 2 ? flipAt(x!, y!, 0.6, hare()) : at(x!, y!, 0.6, hare())))), at(60, 92, 0.9, hare()), ring(62, 80, 20, 18)),
  /** bestånd: a lake with a small fishing boat; under the surface a few fish. Beside it a chart of three columns made of fish icons that get lower and lower, and an orange arrow pointing down along them. */
  'ekos.bestånd': all(bg(SKY), rect(4, 46, 60, 66, WATER, 0, null), line('M4 46 L64 46', WATER2, 1.6), path('M12 40 L36 40 L32 46 L16 46 Z', '#c86a3a', C.ink, 1.2), line('M24 40 L24 26 M24 28 L36 44 L36 70', C.ink, 1), ...[[22, 62], [44, 74], [26, 90], [48, 98]].map(([x, y]) => at(x!, y!, 0.7, fish())),
    rect(66, 18, 48, 92, WHITE, 3, C.ink, 1.4), line('M70 104 L110 104', C.ink, 1.4), ...[[76, 7], [90, 4], [104, 2]].map(([x, n]) => all(...range(n!).map((j) => at(x!, 98 - j * 11, 0.42, fish(j === 0 && n === 2 ? HL : '#8fa6b8'))))), arrow(74, 22, 108, 52, HL, 2.4)),
  /** utbredning: a simple map of a northern land and sea; a large area in the north-west of the land is filled with orange stripes and outlined. A small lemming in a frame beside the map shows which animal the area belongs to. */
  'ekos.utbredning': all(bg('#cfe6f4'), path('M30 108 C24 92 30 76 38 66 C44 56 40 42 50 30 C58 20 70 12 86 10 C98 10 108 16 112 26 L112 108 Z', '#e8e2c8', C.ink, 1.6), path('M44 60 C48 46 52 34 62 26 C72 18 86 14 98 16 C96 30 86 40 78 50 C70 60 60 68 50 72 C46 70 44 66 44 60 Z', 'rgba(239,138,60,0.45)', HL, 2.4),
    ...range(6).map((i) => line(`M${50 + i * 8} ${66 - i * 6} L${58 + i * 8} ${36 - i * 4}`, HL, 1, '2 3')), panel(8, 10, 32, 28), at(24, 32, 1.1, lemming())),
  /** talrik: the picture is split in two. The big coloured left part shows a harbour where gulls of one kind are everywhere – crowded on the quay, floating on the water and filling the sky, about twenty of them. The narrow right part is the same harbour drawn grey with just two gulls. No rings. */
  'ekos.talrik': all(rect(4, 4, 80, 108, SKY, 3, null), rect(4, 84, 80, 28, WATER, 0, null), rect(4, 76, 56, 8, '#b9a58a', 0, C.ink, 1.2), ...[[12, 76], [22, 76], [32, 76], [42, 76], [52, 76], [16, 96], [34, 102], [56, 94], [72, 104], [70, 88]].map(([x, y]) => at(x!, y!, 0.62, gull())),
    ...[[16, 22], [32, 14], [48, 26], [64, 14], [74, 34], [24, 40], [44, 46], [62, 52], [12, 58], [36, 62], [70, 66]].map(([x, y]) => flyingGull(x!, y!, 0.75)),
    line('M84 4 L84 112', C.ink, 1.4), greyed(rect(85, 4, 31, 108, SKY, 0, null), rect(85, 84, 31, 28, WATER, 0, null), rect(85, 76, 31, 8, '#b9a58a', 0, C.ink, 1.2), at(98, 76, 0.62, gull()), flyingGull(102, 34, 0.75))),
  /** sällsynt (2): a wide grey field full of yellow-grey dandelions of one kind; one single purple orchid stands among them in colour, ringed in orange, and a small person with binoculars looks at it. */
  'ekos.sällsynt.2': all(bg(SKY), rect(4, 70, 112, 42, GRASS, 0, null), greyed(...[[12, 84], [24, 96], [34, 80], [46, 104], [58, 86], [16, 108], [88, 106], [100, 86], [110, 100], [70, 104], [36, 96]].map(([x, y]) => flower(x!, y!, 0.8, YEL, '#c89a20'))),
    at(76, 92, 1.4, line('M0 0 L0 -18', GRASS2, 1.6), ...range(5).map((i) => ellipse(0, -18 - i * 3.6, 3.4, 2.4, '#9a4ac8', C.ink, 0.7)), path('M0 -4 C-6 -6 -6 -12 -4 -14 C-2 -10 0 -8 0 -6 Z', LEAF, C.ink, 0.8)), ring(76, 72, 14, 22),
    at(26, 62, 1, circle(0, -26, 6, C.skin, C.ink, 1.2), path('M-6 -20 L6 -20 L8 0 L-8 0 Z', C.green, C.ink, 1.2), rect(3, -30, 8, 6, C.dark, 1.4, C.ink, 0.8), line('M4 -18 L8 -26', C.skin, 3))),
  /** avkomma: left, a mother duck swimming with four small yellow ducklings behind her (ducklings coloured and ringed, mother pale); right, a big plant with many small new plants growing around it from its seeds, the young ones ringed. */
  'ekos.avkomma': all(bg(SKY), rect(4, 70, 58, 42, WATER, 0, null), greyed(at(46, 84, 1, duck())), ...range(4).map((i) => at(12 + (i % 2) * 6 + Math.floor(i / 2) * 12, 86 + (i % 2) * 8, 0.9, duckling())), ring(24, 86, 18, 12),
    rect(62, 98, 54, 14, SOIL, 0, null), greyed(at(88, 98, 1, line('M0 0 L0 -44', GRASS2, 2), ...[-12, -22, -32].map((yy) => all(leafShape(-8, yy, 0.8, -20), leafShape(8, yy, 0.8, 20))), flower(0, -36, 1.1, '#f2a0c4'))), ...[70, 80, 98, 108].map((x) => at(x, 98, 0.5, line('M0 0 L0 -8', GRASS2, 1.6), leafShape(-4, -8, 0.4, -30), leafShape(4, -8, 0.4, 30))), ring(74, 92, 9, 8), ring(103, 92, 9, 8), line('M80 60 L72 88 M96 60 L104 88', HL, 1.4, '2 3')),

  // ── 2902 Livsmiljö och habitat ──
  /** livsmiljö: a woodpecker on an old tree with holes; around it dead wood on the ground, insect larvae in the bark, a small pond – the whole surroundings the bird needs are enclosed in a big orange frame. */
  'ekos.livsmiljö': all(meadow(90), rect(8, 8, 104, 100, 'rgba(228,87,46,0.06)', 8, null), path('M50 90 L52 20 L64 20 L66 90 Z', TRUNK, C.ink, 1.4), path('M52 20 C46 14 40 14 36 16 M64 22 C72 14 80 14 86 18', 'none', TRUNK, 3), ellipse(58, 42, 3, 4.4, '#3a2a1a', null), ellipse(56, 66, 2.6, 3.6, '#3a2a1a', null),
    at(70, 60, 1.1, woodpecker()), rect(14, 96, 36, 7, '#9a7a5a', 3, C.ink, 1.2), path('M20 99 c2 -2 4 2 6 0', 'none', '#f2e6c8', 1.4), pond(94, 100, 16, 5), grass(80, 92), grass(30, 92), rect(8, 8, 104, 100, 'none', 8, HL, 2.8)),
  /** habitat: a frog in the middle; an orange arrow leads to a small framed picture of a pond with reeds (green tick), and a grey arrow leads to a grey framed picture of dry sand and a cactus-free rock (red cross). */
  'ekos.habitat': all(bg(), at(60, 70, 1.6, frog()), panel(8, 14, 44, 40, SKY), rect(9, 38, 42, 15, WATER, 0, null), reeds(18, 46, 0.7), reeds(42, 44, 0.6), ellipse(30, 40, 10, 2, '#7fb356', null), arrow(52, 66, 40, 58, HL, 2.6), check(30, 62, 1),
    greyed(panel(68, 14, 44, 40, '#f2e2b8'), path('M69 48 C80 42 96 46 111 42 L111 53 L69 53 Z', '#e0c890', null), sunAt(98, 26, 6), ellipse(82, 46, 7, 4, ROCK, C.ink, 1)), line('M70 66 L80 58', C.grey, 2.4), cross(90, 62, 1)),
  /** förekomma: a plain map of a land surrounded by sea, divided into regions by thin lines; in some regions there are many brown dots (each dot a place where the animal has been found) and these regions are tinted; the other regions are grey with no dots. A small framed deer at the top left shows which animal the dots stand for. */
  'ekos.förekomma': all(bg('#cfe6f4'), path('M40 108 C34 92 40 78 46 66 C52 54 48 40 58 28 C66 18 78 12 92 12 C104 14 110 24 108 36 C104 50 96 60 94 74 C92 88 88 100 84 108 Z', '#e4e4e4', C.ink, 1.6),
    path('M40 108 C36 96 40 82 46 70 L72 66 L84 108 Z', '#f2dfb8', null), path('M58 28 C66 18 78 12 92 12 C104 14 110 24 108 36 L80 40 Z', '#f2dfb8', null), line('M46 70 L72 66 L94 74 M52 48 L80 40 L108 36 M72 66 L80 40', C.grey, 1.2), path('M40 108 C34 92 40 78 46 66 C52 54 48 40 58 28 C66 18 78 12 92 12 C104 14 110 24 108 36 C104 50 96 60 94 74 C92 88 88 100 84 108 Z', 'none', C.ink, 1.6),
    dots(48, 74, 28, 30, 14, 11, 1.8, ['#8a5a2a']), dots(70, 18, 30, 16, 10, 5, 1.8, ['#8a5a2a']), panel(8, 10, 30, 30), at(20, 38, 0.6, deer())),
  /** skydd: heavy rain falls over a meadow; two cows stand dry under the crown of a big tree, where no rain reaches them. The dry space under the tree is ringed in orange. */
  'ekos.skydd': all(bg('#c9d6e0'), rect(4, 92, 112, 20, GRASS, 0, null), ...range(30).map((i) => { const x = 8 + (i % 10) * 11 + (Math.floor(i / 10) % 2) * 5, y = 10 + Math.floor(i / 10) * 26; return x > 30 && x < 92 && y > 30 ? '' : line(`M${x} ${y} l-3 8`, WATER2, 1.6); }),
    path('M56 92 L58 40 L64 40 L66 92 Z', TRUNK, C.ink, 1.4), ellipse(60, 34, 40, 18, LEAF, C.ink, 1.4), ellipse(42, 40, 16, 10, LEAF, C.ink, 1.2), ellipse(78, 40, 16, 10, LEAF, C.ink, 1.2),
    at(40, 100, 0.55, all(line('M-10 -14 L-11 0 M-6 -14 L-5 0 M8 -14 L7 0 M12 -14 L13 0', C.ink, 2.4), ellipse(0, -20, 16, 9, WHITE, C.ink, 1.3), ellipse(-5, -22, 5, 4, C.ink, null), ellipse(19, -22, 6, 5, WHITE, C.ink, 1.2), line('M16 -27 L14 -31 M22 -27 L24 -31', C.ink, 1.4))),
    at(80, 100, 0.55, all(line('M-10 -14 L-11 0 M-6 -14 L-5 0 M8 -14 L7 0 M12 -14 L13 0', C.ink, 2.4), ellipse(0, -20, 16, 9, '#a0673d', C.ink, 1.3), ellipse(6, -22, 5, 4, WHITE, null), ellipse(19, -22, 6, 5, '#a0673d', C.ink, 1.2), line('M16 -27 L14 -31 M22 -27 L24 -31', C.ink, 1.4))), ring(60, 76, 34, 20)),
  /** tillgång: a big bush heavy with red berries, coloured, with a thrush eating from it and an orange full-level bar beside it; a grey bare bush stands beside with an almost empty grey bar. */
  'ekos.tillgång': all(meadow(96), bush(40, 96, 1.8, 26, LEAF, 4), at(30, 62, 0.9, bird('#8a6a4a', '#f2e6c8')), rect(70, 30, 8, 60, WHITE, 2, C.ink, 1.2), rect(71, 34, 6, 55, HL, 1, null),
    greyed(bush(98, 96, 1, 1, '#9aa070', 9), rect(110, 60, 5, 30, WHITE, 2, C.ink, 1.2), rect(111, 84, 3, 5, '#888', 1, null))),
  /** häckplats: a rocky islet in the sea; on it several gull nests of dry grass with eggs and small grey chicks, and parent gulls standing beside them; the nests are ringed in orange. */
  'ekos.häckplats': all(bg(SKY), rect(4, 80, 112, 32, WATER, 0, null), path('M10 92 C20 70 40 62 60 62 C82 62 100 72 110 92 Z', ROCK, C.ink, 1.6),
    ...[[34, 76], [62, 70], [88, 78]].map(([x, y], i) => all(ellipse(x!, y!, 10, 4, '#c9a86a', C.ink, 1), i === 1 ? all(circle(x! - 3, y! - 3, 3, '#c8c0b0', C.ink, 0.8), circle(x! + 3, y! - 3, 3, '#c8c0b0', C.ink, 0.8), line(`M${x! - 1} ${y! - 4} l2 0`, GOLD, 1)) : all(ellipse(x! - 3, y! - 2, 2.6, 3.2, '#d8d0a0', C.ink, 0.7), ellipse(x! + 2, y! - 2, 2.6, 3.2, '#b8c8a0', C.ink, 0.7)), ring(x!, y! - 2, 13, 8))),
    at(50, 64, 0.8, gull()), flipAt(76, 66, 0.8, gull()), flyingGull(30, 30, 1), flyingGull(84, 22, 0.9)),

  // ── 2903 Näringskedjor ──
  /** näringskedja: four pictures in a row on a meadow – grass, a grasshopper, a frog and a hawk – joined by thick orange arrows from each one to the animal that eats it. */
  'ekos.näringskedja': all(meadow(84), grass(14, 100, 1.4), grass(24, 102, 1.1), at(40, 74, 0.9, hopper()), at(66, 100, 1.1, frog()), at(96, 54, 0.9, hawk()), arrow(26, 84, 32, 76, HL, 3), arrow(50, 76, 58, 90, HL, 3), arrow(76, 88, 88, 64, HL, 3)),
  /** topprovdjur: a four-step pyramid – grass at the bottom, hares above, a fox on the third step and a grey wolf on the narrow top; only the top step with the wolf is coloured and ringed, all the others are grey. */
  'ekos.topprovdjur': all(bg(SKY), pyramid(3, [all(grass(44, 100, 0.9), grass(60, 100, 0.9), grass(76, 100, 0.9)), all(at(46, 80, 0.62, hare()), at(72, 80, 0.62, hare())), at(54, 58, 0.5, fox()), at(54, 36, 0.62, wolf())])),
  /** överföra: a green leaf full of yellow energy sparkles at the left, a hare at the right; an orange arrow carries a stream of yellow sparkles from the leaf over to the hare, where the sparkles arrive. */
  'ekos.överföra': all(bg(), ground, leafShape(26, 56, 2.2, -30), ...[[18, 52], [28, 60], [34, 48]].map(([x, y]) => energy(x!, y!, 3.4)), arrow(42, 56, 76, 56, HL, 3.4), ...[[50, 48], [60, 46], [68, 48]].map(([x, y]) => energy(x!, y!, 3)), at(92, 84, 1.3, hare()), energy(90, 60, 3.4), energy(100, 68, 3)),
  /** näringsväv: a meadow with grass, berries, a mouse, a hare, a small bird, a fox and an owl, joined by many crossing orange arrows so that the food chains form a net. */
  'ekos.näringsväv': all(meadow(96), grass(16, 106, 1.2), bush(44, 108, 0.7, 6), at(22, 78, 0.7, mouse()), at(54, 82, 0.6, hare()), at(88, 82, 0.7, bird()), at(36, 46, 0.55, fox()), at(88, 40, 0.9, owl()),
    arrow(18, 92, 20, 82, HL, 2), arrow(46, 98, 50, 86, HL, 2), arrow(44, 98, 26, 82, HL, 2), arrow(50, 98, 84, 84, HL, 2), arrow(24, 70, 36, 52, HL, 2), arrow(54, 72, 44, 52, HL, 2), arrow(28, 72, 82, 44, HL, 2), arrow(86, 72, 88, 52, HL, 2), arrow(82, 76, 52, 48, HL, 2), arrow(18, 92, 50, 80, HL, 1.6)),
  /** rubba: a hanging mobile with a bar and coloured shapes is struck from the side by a big orange arrow with a burst where it hits; the bar swings steeply, motion arcs show the wobble and two shapes are falling off. A small grey mobile at the right hangs still and level. */
  'ekos.rubba': all(bg(), line('M4 8 L116 8', C.ink, 2), line('M50 8 L50 30', C.ink, 1.2), rot(50, 32, 28, 1, line('M-34 0 L34 0', C.ink, 2.6), line('M-30 0 L-30 14 M-10 0 L-10 10 M30 0 L30 16', C.ink, 1), circle(-30, 20, 6, '#f2c14e', C.ink, 1.2), rect(-15, 10, 10, 10, '#4f9d69', 1, C.ink, 1.2), path('M24 16 L36 16 L30 28 Z', '#3f6fb5', C.ink, 1.2)), circle(50, 32, 2.4, GOLD, C.ink, 1),
    rot(70, 74, 30, 1, rect(-5, -5, 10, 10, '#d64545', 1, C.ink, 1.2)), circle(32, 92, 5, '#8a6bbf', C.ink, 1.2), line('M68 86 l2 6 M34 102 l0 6', C.ink, 1), arrow(4, 64, 24, 52, HL, 4), line('M22 44 l4 -6 M28 52 l6 -2 M20 56 l-2 6', HL, 2),
    path('M78 40 Q86 30 84 20 M82 50 Q94 38 92 22', 'none', C.ink, 1.2), path('M14 38 Q8 48 12 58', 'none', C.ink, 1.2), greyed(line('M104 8 L104 30', C.ink, 1.2), line('M92 30 L116 30', C.ink, 2), line('M94 30 L94 38 M114 30 L114 38', C.ink, 1), circle(94, 42, 4, '#f2c14e', C.ink, 1), rect(110, 38, 8, 8, '#4f9d69', 1, C.ink, 1))),
  // ── 2904 Producenter och konsumenter ──
  /** producent (2): the sun shines on a big green plant; orange-yellow rays go into its leaves, and inside the leaves small yellow sparkles show the food it makes itself. The plant is ringed; a grey hare stands beside it. */
  'ekos.producent.2': all(bg(SKY), rect(4, 96, 112, 16, SOIL, 0, null), sunAt(22, 22, 9), ...[[34, 30, 50, 52], [32, 38, 46, 64], [38, 26, 62, 42]].map(([a, b, c, d]) => arrow(a!, b!, c!, d!, GOLD, 2)), line('M60 96 L60 34', GRASS2, 2.6), ...[[-80, 40], [-100, 54], [-70, 68], [-110, 82]].map(([an, y]) => leafShape(60, y!, 1.6, an! + (y! % 20 ? 0 : 0), LEAF)),
    leafShape(72, 44, 1.6, 20), leafShape(48, 58, 1.6, -200), leafShape(72, 72, 1.6, 30), leafShape(48, 82, 1.6, -210), energy(72, 44, 3), energy(48, 58, 3), energy(72, 72, 3), ring(60, 62, 26, 38), greyed(at(98, 96, 0.8, hare()))),
  /** konsument (2): a hare eating a green plant; an orange arrow goes from the plant into the hare's mouth and small yellow sparkles follow it. The hare is coloured and ringed; the plant is pale. */
  'ekos.konsument.2': all(meadow(96), greyed(line('M90 96 L90 54', GRASS2, 2.4), leafShape(80, 62, 1.4, -160), leafShape(100, 70, 1.4, 20), leafShape(80, 80, 1.4, -170), leafShape(100, 86, 1.4, 10)), at(44, 96, 1.7, hare()), arrow(78, 66, 66, 70, HL, 2.6), energy(70, 60, 2.6), energy(62, 78, 2.6), ring(44, 74, 30, 26)),
  /** växtplankton: a lake surface under the sun; a big magnifying lens shows that the water is full of tiny green cells, small boat-shaped algae and chains of green balls. */
  'ekos.växtplankton': all(bg(SKY), sunAt(20, 18, 7), rect(4, 34, 112, 78, WATER, 0, null), line('M4 34 L116 34', WATER2, 1.6), lens(60, 70, 32, all(greenCell(48, 58, 4), greenCell(70, 54, 3.4), greenCell(54, 86, 3.6), diatom(66, 72, 1.3, 20), diatom(44, 76, 1, -30), diatom(76, 88, 1, 60), ...range(4).map((i) => greenCell(72 + i * 5, 64 + i * 3, 2.4)), greenCell(40, 64, 2.4)), '#dff0fa'), ...[[14, 60], [20, 90], [104, 50], [100, 96]].map(([x, y]) => circle(x!, y!, 1.2, '#7ab84a', null))),
  /** djurplankton: under water a magnifying lens shows tiny shrimp-like animals with long antennae, each next to a small green cell that it is about to eat; a little fish swims outside the lens. */
  'ekos.djurplankton': all(bg(WATER), lens(56, 56, 34, all(copepod(44, 46, 1.3, -10), copepod(60, 70, 1.4, 20), copepod(40, 74, 1.1, -30), greenCell(70, 42, 3), greenCell(80, 66, 2.6), greenCell(56, 86, 2.6), greenCell(66, 54, 2.4)), '#e6f4fb'), at(96, 100, 0.9, fish())),
  /** primärkonsument: a four-step pyramid – grass at the bottom, a hare and a grasshopper on the second step, a frog on the third and a fox on top; only the second step is coloured and ringed. */
  'ekos.primärkonsument': all(bg(SKY), pyramid(1, pyrIcons())),
  /** sekundärkonsument: the same four-step pyramid; only the third step with the frog is coloured and ringed. */
  'ekos.sekundärkonsument': all(bg(SKY), pyramid(2, pyrIcons())),
  /** näringsnivå: a staircase of four coloured steps going up to the right – grass on the lowest, a hare on the next, a frog above and a fox on top; orange brackets at the side mark each step as one level. */
  'ekos.näringsnivå': all(bg(SKY), ...range(4).map((i) => rect(8 + i * 22, 104 - (i + 1) * 20, 22 + (3 - i) * 0, (i + 1) * 20, ['#9fd07a', '#e9d68a', '#f0b98a', '#e89a8a'][i]!, 0, C.ink, 1.3)), grass(19, 84, 0.9), at(40, 64, 0.55, hare()), at(62, 44, 0.65, frog()), at(82, 24, 0.42, fox()),
    ...range(4).map((i) => all(line(`M104 ${104 - i * 20} L110 ${104 - i * 20} L110 ${84 - i * 20} L104 ${84 - i * 20}`, HL, 2.2), line(`M${30 + i * 22} ${84 - i * 20} L104 ${84 - i * 20}`, HL, 0.8, '2 3')))),
  /** biomassa: three heaps side by side on the ground – a huge heap of grass, a smaller heap of hares and one small fox – each with a grey weight block above it, the blocks getting smaller from left to right. */
  'ekos.biomassa': all(bg(), ground, path('M6 110 C10 70 50 70 54 110 Z', '#8cc65a', C.ink, 1.4), ...range(8).map((i) => line(`M${12 + i * 5} 108 q2 -10 0 -18`, GRASS2, 1)), at(66, 110, 0.5, hare()), at(80, 110, 0.5, hare()), at(73, 100, 0.5, hare()), at(102, 110, 0.4, fox()),
    path('M16 72 L44 72 L40 50 L20 50 Z', '#8a8f96', C.ink, 1.4), rect(26, 44, 8, 6, '#8a8f96', 2, C.ink, 1.2), path('M64 90 L84 90 L82 78 L66 78 Z', '#8a8f96', C.ink, 1.3), rect(71, 74, 6, 4, '#8a8f96', 1, C.ink, 1), path('M98 98 L108 98 L107 92 L99 92 Z', '#8a8f96', C.ink, 1.1), ring(30, 80, 28, 36)),

  // ── 2905 Nedbrytare ──
  /** bakterie: a brown dead leaf on the ground; a magnifying lens over it shows many rod-shaped bacteria with little tails, coloured green, eating holes into the leaf. */
  'ekos.bakterie': all(bg(), rect(4, 96, 112, 16, SOIL, 0, null), leafShape(36, 92, 2.4, -10, '#b07a3e'), lens(64, 52, 32, all(rect(34, 22, 60, 60, '#d8b07a', 0, null), circle(52, 40, 5, '#f6f2ea', null), circle(74, 64, 4, '#f6f2ea', null), bact(56, 52, 1.1, 20), bact(72, 38, 1, -30), bact(46, 66, 1, 60), bact(80, 56, 0.9, 100), bact(60, 72, 1, -10)), '#d8b07a'), ring(64, 52, 36)),
  /** mikroorganism: a microscope at the left; a big round view at the right shows many different tiny living things at once – green rods, purple balls, a green alga chain and a small one-celled animal. */
  'ekos.mikroorganism': all(bg(), ground, path('M14 110 L42 110 L40 104 L16 104 Z', C.dark, C.ink, 1.2), path('M24 104 C20 90 22 76 30 66', 'none', C.dark, 4), rot(32, 56, 30, 1, rect(-4, -18, 8, 26, C.dark, 2, C.ink, 1.2)), rect(18, 80, 22, 3, C.grey, 1, C.ink, 1),
    circle(80, 52, 32, '#eef8ee', C.dark, 2.6), bact(70, 40, 0.8, 20, '#6ab07a'), bact(88, 66, 0.8, -40, '#6ab07a'), coccus(92, 40, 3, '#b07ad0'), coccus(97, 45, 3, '#b07ad0'), coccus(66, 62, 3.4, '#b07ad0'), ...range(4).map((i) => greenCell(68 + i * 6, 76 - i * 2, 2.4)), ellipse(82, 52, 6, 4, '#f0c8a0', C.ink, 0.8), circle(83, 52, 1.4, '#b08060', null), line('M44 52 L48 52', C.dark, 2)),
  /** gråsugga: a stone has been lifted off damp brown soil; underneath, beside a rotting leaf, a big grey woodlouse with its armour of plates and many legs crawls, ringed in orange; two small ones further back. */
  'ekos.gråsugga': all(bg(), rect(4, 60, 112, 52, SOIL, 0, null), path('M70 20 C72 8 108 8 112 22 C114 34 98 40 84 38 C72 36 68 30 70 20 Z', ROCK, C.ink, 1.6), arrow(90, 44, 90, 36, HL, 2), leafShape(32, 88, 2, 20, '#8a5a30'), at(66, 92, 2.2, woodlouse()), ring(68, 86, 30, 14), at(30, 72, 0.8, woodlouse()), at(96, 74, 0.7, woodlouse()), ...range(8).map((i) => circle(10 + i * 14, 104 - (i % 2) * 4, 1.4, SOIL2, null))),
  /** kadaver: a dead deer lies on its side on the forest floor with its four legs stiff and straight and its head flat on the ground, eye closed; two crows stand beside it and flies circle above. No blood. */
  'ekos.kadaver': all(bg('#e6efe2'), rect(4, 90, 112, 22, '#8aa86a', 0, null), spruce(14, 92, 0.8), spruce(106, 92, 0.7),
    at(58, 100, 1.05, line('M-12 -7 L-38 -3 M-10 -4 L-36 1 M12 -6 L28 -1 M15 -3 L32 1', C.ink, 4.4), line('M-12 -7 L-38 -3 M-10 -4 L-36 1 M12 -6 L28 -1 M15 -3 L32 1', DEER, 2.6), ...[[-38, -3], [-36, 1], [28, -1], [32, 1]].map(([x, y]) => circle(x!, y!, 1.8, '#3a2a1a', null)), ellipse(0, -11, 21, 9, DEER, C.ink, 1.4), path('M-18 -16 C-6 -21 8 -21 18 -17', 'none', '#8a5a2a', 2), ellipse(-20, -11, 3.6, 4, WHITE, C.ink, 0.8),
      path('M16 -16 C22 -18 28 -18 32 -16 L44 -12 C46 -10 45 -6 42 -6 L30 -6 C24 -6 18 -8 16 -10 Z', DEER, C.ink, 1.3), circle(44, -9, 1.4, C.ink, null), rot(30, -17, -60, 1, ellipse(0, -5, 2.6, 6, DEER, C.ink, 1.1)), path('M33 -12 q2.4 1.6 4.8 0', 'none', C.ink, 1.2)),
    at(22, 104, 0.8, crow()), flipAt(102, 106, 0.8, crow()), ...[[52, 50], [62, 44], [70, 52]].map(([x, y]) => all(circle(x!, y!, 1.4, C.ink, null), ellipse(x! - 1, y! - 2, 1.4, 1, 'rgba(220,235,245,0.9)', C.ink, 0.4))), line('M48 46 q4 -6 8 0 q4 6 8 0 q4 -6 8 0', C.grey, 0.8, '1 2'), ring(62, 82, 46, 26)),
  /** återföra: an open wooden box stands on the floor; a red ball lies outside it at the right, and a thick orange U-shaped arrow carries the ball back up and into the same box. A thin grey dashed arrow shows the way it came out earlier. */
  'ekos.återföra': all(bg(), ground, path('M14 70 L56 70 L52 108 L18 108 Z', '#c99a5e', C.ink, 1.6), path('M14 70 L22 62 L62 62 L56 70 Z', '#e0b57a', C.ink, 1.4), line('M20 82 L52 82 M19 95 L53 95', '#9a6c3a', 1), 
    line('M40 60 Q60 36 86 92', C.grey, 1.6, '4 4'), circle(92, 102, 8, '#d64545', C.ink, 1.4), circle(89, 99, 2, 'rgba(255,255,255,0.6)', null), line('M104 98 C114 70 104 30 76 26 C56 24 42 34 38 52', HL, 4), path('M38 60 L32 48 L44 50 Z', HL, HL, 1.5)),
  /** nedbrytning (2): four stages of the same leaf on damp soil in a row, joined by arrows – whole, with a few holes, eaten to a lace of veins, and a small heap of dark soil; a little mushroom and a worm work beside the later stages. */
  'ekos.nedbrytning.2': all(bg(), rect(4, 84, 112, 28, SOIL, 0, null), leafShape(18, 70, 1.2, -20, '#c08a3a'), arrow(32, 70, 38, 70, HL, 2), all(leafShape(50, 70, 1.2, 10, '#a8783a'), circle(46, 68, 2.4, PAPER, null), circle(54, 72, 2, PAPER, null), circle(52, 66, 1.4, PAPER, null)), arrow(64, 70, 70, 70, HL, 2),
    all(path('M74 70 L94 70 M78 70 L80 66 M82 70 L84 74 M86 70 L88 66 M90 70 L92 74', 'none', '#8a5a2a', 1.2)), arrow(96, 70, 100, 70, HL, 2), path('M100 84 C102 74 114 74 116 84 Z', '#4a3424', C.ink, 1.1),
    at(66, 96, 0.8, path('M-6 -6 C-6 -14 6 -14 6 -6 Z', '#c86a3a', C.ink, 1), rect(-2, -6, 4, 7, '#f2e6c8', 1, C.ink, 0.8)), worm(88, 100, 0.8)),
  /** näringsämne (2): a cut through the soil with the roots of a plant; coloured dots (blue, pink and yellow) in the soil move along short orange arrows into the root tips, and three of the dots are ringed. */
  'ekos.näringsämne.2': all(bg(SKY), rect(4, 46, 112, 66, SOIL, 0, null), line('M4 46 L116 46', SOIL2, 1.6), line('M60 46 L60 12', GRASS2, 2.4), leafShape(50, 24, 1.2, -150), leafShape(70, 22, 1.2, -30), leafShape(52, 36, 1.2, -170), leafShape(68, 34, 1.2, -10),
    line('M60 46 C58 60 50 74 40 86 M60 46 C62 62 72 74 82 88 M60 46 L60 96 M50 70 L36 70 M70 72 L86 70', '#f1e6cc', 2.2), dots(10, 54, 100, 54, 22, 8, 1.8), ...[[30, 92, 38, 88], [94, 92, 84, 90], [60, 108, 60, 100], [26, 68, 34, 70]].map(([a, b, c, d]) => arrow(a!, b!, c!, d!, HL, 1.6)), ring(30, 92, 5), ring(94, 92, 5), ring(60, 108, 5)),

  // ── 2906 Ekologiska nischer ──
  /** ekologisk nisch: one big tree split into three coloured zones – the treetops, the trunk and the ground – with a different bird busy in each (a small tit in the top, a woodpecker on the trunk, a thrush on the ground); the trunk zone with the woodpecker is outlined in orange. */
  'ekos.ekologisk-nisch': all(bg(SKY), rect(4, 96, 112, 16, GRASS, 0, null), path('M54 96 L56 36 L64 36 L66 96 Z', TRUNK, C.ink, 1.4), ellipse(60, 30, 44, 22, LEAF, C.ink, 1.4), rect(8, 8, 104, 40, 'rgba(242,193,78,0.15)', 4, null), rect(48, 50, 24, 44, 'rgba(228,87,46,0.12)', 4, null),
    at(80, 28, 0.7, bird('#5a7ac0', '#f2e04a')), at(70, 80, 0.9, woodpecker()), at(28, 106, 0.8, bird('#8a6a4a', '#f2e6c8')), worm(16, 106, 0.4), rect(48, 50, 24, 44, 'none', 4, HL, 2.6), line('M8 50 L46 50 M74 50 L112 50 M8 94 L46 94 M74 94 L112 94', C.grey, 1, '3 3')),
  /** resurs: a squirrel in the middle; around it, in four round frames, the things it can use – a water drop, a nut, the sun's light and a hole in a tree for shelter – joined to it by orange arrows. */
  'ekos.resurs': all(bg(), ground, at(58, 82, 1.4, squirrel()), ...[[20, 24], [96, 24], [20, 88], [96, 88]].map(([x, y]) => circle(x!, y!, 14, WHITE, C.ink, 1.4)), path('M20 15 C26 24 26 30 20 31 C14 30 14 24 20 15 Z', WATER, WATER2, 1.2), sunAt(96, 24, 6),
    all(ellipse(20, 90, 6, 5, '#b07a3e', C.ink, 1), path('M14 88 C14 82 26 82 26 88 Z', '#7a5236', C.ink, 1)), all(rect(90, 76, 12, 24, TRUNK, 2, C.ink, 1), ellipse(96, 86, 3, 4, '#3a2a1a', null)), arrow(32, 32, 46, 48, HL, 2.2), arrow(84, 32, 70, 48, HL, 2.2), arrow(34, 86, 44, 80, HL, 2.2), arrow(82, 86, 74, 80, HL, 2.2)),
  /** generalist: a fox in the middle with orange arrows to many kinds of food around it – a mouse, berries, a small bird, a beetle, an apple core and a fish – each with a green tick. */
  'ekos.generalist': all(bg(), ground, at(54, 80, 1.2, fox()), ...[[16, 22], [60, 14], [104, 22], [14, 80], [104, 80], [60, 104]].map(([x, y]) => circle(x!, y!, 11, WHITE, C.ink, 1.2)), at(16, 26, 0.6, mouse()), bush(60, 20, 0.4, 5), at(104, 26, 0.55, bird()), all(ellipse(14, 80, 5, 4, '#4a6a3a', C.ink, 1), line('M14 76 L14 84', C.ink, 0.7)), all(path('M101 74 C99 78 99 82 101 86 L107 86 C109 82 109 78 107 74 Z', '#f2e6c8', C.ink, 1), path('M101 74 L107 74 M101 86 L107 86', 'none', RED, 2)), at(62, 104, 0.5, fish()),
    arrow(26, 30, 38, 54, HL, 2), arrow(60, 26, 60, 50, HL, 2), arrow(94, 30, 82, 54, HL, 2), arrow(26, 80, 30, 76, HL, 2), arrow(92, 80, 86, 76, HL, 2), arrow(60, 92, 60, 88, HL, 1.6)),
  /** specialist (2): a black caterpillar eats only from one stinging-nettle plant, which is coloured with a green tick; three other plants beside it are grey with red crosses. */
  'ekos.specialist.2': all(bg(), rect(4, 100, 112, 12, GRASS, 0, null), nettle(30, 100, 1.6), caterpillar(30, 66, 1), ring(30, 70, 22, 32), check(30, 22, 1.1),
    greyed(flower(64, 100, 1.4, '#f2a0c4'), bush(86, 100, 0.7, 0), grass(106, 100, 1.5)), ...[64, 86, 106].map((x) => cross(x, 52, 0.8))),
  /** överlappa: two large plain circles, one blue and one yellow, partly cover each other; the shared lens-shaped part in the middle is filled orange with stripes and outlined. Below, a small grey pair of circles that do not touch. */
  'ekos.överlappa': all(bg(), circle(44, 50, 30, 'rgba(120,170,230,0.4)', '#3f6fb5', 2.2), circle(76, 50, 30, 'rgba(242,193,78,0.4)', GOLD, 2.2), path('M60 24.6 A30 30 0 0 1 60 75.4 A30 30 0 0 1 60 24.6 Z', 'rgba(228,87,46,0.5)', HL, 2.8),
    ...range(5).map((i) => line(`M${52 + i * 4} ${36 + i * 2} L${54 + i * 4} ${66 - i * 2}`, WHITE, 1)), greyed(circle(44, 98, 9, 'rgba(120,170,230,0.4)', '#3f6fb5', 1.6), circle(76, 98, 9, 'rgba(242,193,78,0.4)', GOLD, 1.6))),
  /** samexistera: one sunny landscape at the same moment, with three different animals each calmly in its own part – a duck on a pond, a squirrel up in a tree and a hare grazing on the meadow – none of them disturbing the others; a small grey panel shows one animal chasing another away (red cross). */
  'ekos.samexistera': all(meadow(70), sunAt(64, 20, 7), pond(30, 96, 24, 8), at(30, 98, 0.7, duck()), path('M88 104 L90 40 L98 40 L100 104 Z', TRUNK, C.ink, 1.4), ellipse(94, 34, 20, 14, LEAF, C.ink, 1.4), at(100, 56, 0.7, squirrel()), at(66, 100, 0.7, hare()), grass(52, 108), grass(80, 110),
    greyed(panel(8, 8, 36, 30, SKY), at(16, 34, 0.38, deer()), flipAt(38, 34, 0.36, hare()), speed(38, 20)), cross(52, 18, 0.8)),
  /** dagaktiv: the picture is split into day and night; on the bright day side under the sun a squirrel runs along a branch with a nut, coloured and ringed; on the dark night side the same squirrel lies grey in its nest with "z z". */
  'ekos.dagaktiv': all(rect(4, 4, 70, 108, SKY, 3, null), rect(74, 4, 42, 108, NIGHT, 3, null), sunAt(22, 22, 8), line('M6 70 L72 70', TRUNK, 4), at(40, 70, 1.4, squirrel()), ellipse(52, 54, 3, 2.6, '#b07a3e', C.ink, 0.8), ring(38, 56, 22, 20),
    path('M104 18 C96 18 94 28 102 32 C96 28 98 20 104 18 Z', '#f6e7a0', C.ink, 1), line('M76 80 L114 80', TRUNK, 4), greyed(ellipse(96, 74, 14, 8, '#8a6a4a', C.ink, 1.2), at(96, 76, 0.8, squirrel())), zz(94, 54)),
  /** konkurrera (2): two gulls stand on a rock and pull at the same fish from both ends, wings raised; small motion lines show the tug. */
  'ekos.konkurrera.2': all(bg(SKY), rect(4, 96, 112, 16, WATER, 0, null), path('M10 100 C20 84 100 84 110 100 Z', ROCK, C.ink, 1.4), at(30, 92, 1.4, gull()), flipAt(90, 92, 1.4, gull()), at(60, 76, 0.9, fish()), line('M42 76 L50 76 M70 76 L78 76', C.ink, 1.4),
    path('M20 70 C14 56 22 48 30 52', 'none', C.ink, 1.2), path('M100 70 C106 56 98 48 90 52', 'none', C.ink, 1.2), speed(18, 66), mirrorSpeed(102, 66), ring(60, 76, 14, 9)),
  /** värd (2): a roe deer stands in grass; on its neck and side sit several small dark ticks (shown again large in a lens). The deer is coloured and ringed in orange. */
  'ekos.värd.2': all(meadow(96), at(52, 104, 1.6, deer()), tick(66, 62, 1), tick(56, 70, 1), tick(42, 68, 1), tick(72, 54, 0.9), ring(54, 72, 38, 26), lens(98, 26, 13, tick(98, 26, 2.6), WHITE)),

  // ── 2907 Ekosystemtjänster ──
  /** ekosystemtjänst: green nature at the left (a forest, a wetland and flowers with a bumblebee); orange arrows carry its gifts to a house and a person at the right – a water drop, an apple, a log of wood and a fresh-air leaf. */
  'ekos.ekosystemtjänst': all(bg(SKY), rect(4, 96, 112, 16, GRASS, 0, null), spruce(14, 96, 1.2), tree(32, 96, 1), pond(24, 104, 18, 4), flower(44, 96, 1), at(46, 72, 0.6, bee()),
    rect(84, 72, 26, 24, C.yellow, 1, C.ink, 1.4), path('M80 72 L97 58 L114 72 Z', RED, C.ink, 1.4), rect(93, 82, 8, 14, C.brown, 1, C.ink, 1),
    path('M64 20 C68 26 68 30 64 31 C60 30 60 26 64 20 Z', WATER, WATER2, 1.2), circle(64, 46, 5, RED, C.ink, 1), line('M64 41 L65 38', TRUNK, 1.2), rect(56, 60, 16, 7, '#b98a5a', 3, C.ink, 1), circle(72, 63.5, 3.5, '#e8c890', C.ink, 1), leafShape(64, 80, 0.7, -30),
    arrow(50, 26, 58, 26, HL, 2), arrow(70, 26, 84, 50, HL, 2), arrow(52, 46, 58, 46, HL, 2), arrow(70, 46, 82, 60, HL, 2), arrow(76, 64, 82, 70, HL, 2), arrow(70, 80, 82, 80, HL, 2)),
  /** pollinatör: three different insects each visiting a flower – a bumblebee, a butterfly and a hoverfly – with yellow pollen dots on their bodies and dotted orange flight paths between the flowers; all three insects are ringed. */
  'ekos.pollinatör': all(meadow(98), flower(22, 108, 2, '#f2a0c4'), flower(60, 108, 2.2, '#b7a0f2'), flower(98, 108, 2, YEL, '#e07a2e'), at(22, 70, 1.1, bee()), butterfly(60, 64, 1.1), at(98, 70, 1, all(ellipse(-2, -6, 4, 2.4, 'rgba(230,242,250,0.9)', C.ink, 0.7), ellipse(2, -6, 4, 2.4, 'rgba(230,242,250,0.9)', C.ink, 0.7), ellipse(0, 0, 7, 3.4, '#f2c230', C.ink, 1), path('M-3 -3 L-3 3 M1 -3.4 L1 3.4', 'none', C.ink, 1.6), circle(7, 0, 2.6, '#8a4a2a', C.ink, 0.8))),
    ...[[18, 72], [26, 70], [58, 62], [62, 66], [96, 72]].map(([x, y]) => circle(x!, y!, 1, YEL, C.ink, 0.4)), line('M32 64 Q44 50 52 58 M70 58 Q80 50 90 62', HL, 1.4, '2 3'), ring(22, 70, 12), ring(60, 64, 14, 12), ring(98, 70, 12)),
  /** vattenrening: a brown, muddy stream flows in from the left into a wetland full of reeds; out of it at the right flows clear blue water. An orange arrow follows the water through the reeds. */
  'ekos.vattenrening': all(bg(SKY), rect(4, 70, 112, 42, GRASS, 0, null), path('M4 80 C16 78 24 84 34 82 L34 94 C24 96 16 90 4 92 Z', '#9a7a4a', C.ink, 1.2), ...range(5).map((i) => circle(10 + i * 5, 86 + (i % 2) * 3, 1.2, '#5a3a1a', null)),
    ellipse(60, 88, 30, 14, '#8cc0c8', WATER2, 1.4), reeds(48, 92, 0.9), reeds(64, 90, 1), reeds(76, 94, 0.8), path('M86 82 C96 80 104 86 116 84 L116 96 C104 98 96 92 86 94 Z', '#6cc0f0', C.ink, 1.2), path('M94 88 q3 -2 6 0 M104 90 q3 -2 6 0', 'none', WHITE, 1),
    arrow(12, 66, 104, 66, HL, 2.6), sparkle(108, 78, 3, WHITE)),
  /** dämpa: a big tall orange flood wave comes in from the left, runs into a green wetland full of reeds in the middle and comes out at the right as a small low ripple; a house beyond it stays dry. */
  'ekos.dämpa': all(bg(SKY), rect(4, 92, 112, 20, GRASS, 0, null), path('M4 92 L4 40 C14 36 22 48 30 60 C34 70 36 82 38 92 Z', WATER2, C.ink, 1.4), path('M10 46 C16 46 22 52 26 60', 'none', WHITE, 1.4), arrow(18, 30, 34, 44, HL, 3),
    ellipse(58, 94, 22, 6, '#8cc0c8', WATER2, 1.2), reeds(50, 96, 0.9), reeds(62, 94, 0.9), reeds(70, 96, 0.7), path('M80 92 C84 88 90 88 94 92 Z', WATER2, C.ink, 1.2), arrow(84, 82, 92, 86, HL, 1.8),
    rect(98, 74, 14, 14, C.yellow, 1, C.ink, 1.2), path('M96 74 L105 66 L114 74 Z', RED, C.ink, 1.2), check(106, 54, 0.8)),
  /** kollapsa: a tower of four stacked blocks, each with an animal or plant on it, breaks apart – the blocks fly sideways and tumble, with crash lines; a small grey tower stands whole beside it. */
  'ekos.kollapsa': all(bg(), ground, blockTower(50, 110, 1.3, 1, true), line('M20 40 l-6 -4 M24 30 l-4 -6 M80 30 l6 -4 M86 44 l7 -2', C.ink, 1.6), path('M30 108 l4 -6 l3 4 l4 -7', 'none', HL, 1.8), greyed(blockTower(102, 110, 0.6, 0, false))),
};

function mirrorSpeed(x: number, y: number): Svg { return line(`M${x} ${y} l6 0 M${x - 1} ${y + 5} l8 0 M${x} ${y + 10} l6 0`, C.ink, 1.2); }
