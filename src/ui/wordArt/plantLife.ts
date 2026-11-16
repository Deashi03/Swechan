/**
 * Natur & geografi → Växter & svampar → Växters liv, 2841–2847 (0.45): seeds and germination, roots and nutrient
 * uptake, stems and leaves, photosynthesis in everyday terms, flowering and fruit set, plant reproduction and
 * adaptation to the environment.
 * Recurring signs: underground parts are shown in a cut of brown soil below a surface line; the part the word names
 * is coloured and ringed in orange while the rest of the plant is pale; a magnifying lens shows what is too small to
 * see; nutrients are small coloured dots, water blue drops, carbon dioxide grey pairs of balls and oxygen light-blue
 * bubbles; time is a row of month blocks or day ticks, never digits that spell a word. Abstract adjectives are small
 * symbolic scenes where the coloured idea dominates and a grey copy stands beside it as contrast. No words, no brands
 * and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL, arm } from './people';
import { P, drop, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const PAPER = '#f6f2ea';
const SKY = '#d8ecf6';
const NIGHT = '#3a4466';
const SOIL = '#9a6c46';
const SOIL2 = '#7a5236';
const STEM = '#4f8f3a';
const LEAF = '#62ad4f';
const LEAF2 = '#3d7f33';
const PALEGREEN = '#cfe6b8';
const YELLOWLEAF = '#e6cf52';
const ROOT = '#f1e6cc';
const SEED = '#b07a3e';
const SEED2 = '#8a5a2a';
const COTY = '#e9d27a';
const WHITE = '#fbfbf8';
const YEL = '#f6d03c';
const GOLD = '#e6a817';
const PINK = '#f3a9c4';
const RED = '#d93a3a';
const CHERRY = '#b8202e';
const PALE = '#e6e1d8';
const WATER = '#9fd0ec';
const WATER2 = '#4f93c8';
const BARK = '#7a5a40';
const WOOD = '#b98a5a';
const STONE = '#aaa49b';
const CO2 = '#8e959e';
const O2 = '#bfe6fb';
const POT = '#c8693e';
const GLASS = 'rgba(214,238,250,0.7)';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (x: number, y: number, r: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${r}) scale(${s})`, ...k);
const bg = (col: string = PAPER) => rect(4, 4, 112, 108, col, 3, null);
const ground = line('M4 112 L116 112', C.grey2, 2);
const ring = (x: number, y: number, rx: number, ry = rx) => ellipse(x, y, rx, ry, 'none', HL, 2.4);
const rng = (seed: number) => { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; };
/** Brown soil from y down to the ground line, with a few pebbles. */
const soil = (y: number, seed = 3) => { const R = rng(seed); return all(rect(4, y, 112, 112 - y, SOIL, 0, null), line(`M4 ${y} L116 ${y}`, SOIL2, 1.6), ...range(9).map(() => ellipse(f1(8 + R() * 104), f1(y + 4 + R() * (104 - y)), 1.6, 1, SOIL2, null))); };
const sunAt = (x: number, y: number, r = 7) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 5))} ${f1(y + Math.sin(a) * (r + 5))}`, GOLD, 1.6); }), circle(x, y, r, YEL, GOLD, 1.4));
const check = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 8, WHITE, C.green, 2), line('M-4 0 L-1 3.5 L4.5 -3.5', C.green, 2.4));
const cross = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 8, WHITE, RED, 2), line('M-3.5 -3.5 L3.5 3.5 M3.5 -3.5 L-3.5 3.5', RED, 2.4));
const lens = (x: number, y: number, r: number, inner: Svg, hx = 1, hy = 1) => all(line(`M${f1(x + hx * r * 0.7)} ${f1(y + hy * r * 0.7)} L${f1(x + hx * (r + 12))} ${f1(y + hy * (r + 12))}`, C.dark, 4), circle(x, y, r, WHITE, C.dark, 2.6), inner, circle(x, y, r, 'none', C.dark, 2.6));
/** Leaf from (x,y) pointing at angle a (0 = right, -90 = up). */
const leaf = (x: number, y: number, len: number, w: number, a: number, col: string = LEAF, vein = true, sw = 0.8) => rot(x, y, a, 1,
  path(`M0 0 C${f1(len * 0.3)} ${-w} ${f1(len * 0.75)} ${-w} ${len} 0 C${f1(len * 0.75)} ${w} ${f1(len * 0.3)} ${w} 0 0 Z`, col, C.ink, sw), vein ? line(`M1 0 L${f1(len * 0.85)} 0`, LEAF2, 0.6) : '');
const roundLeaf = (x: number, y: number, r: number, a: number, col: string = COTY) => rot(x, y, a, 1, ellipse(r, 0, r, r * 0.62, col, C.ink, 0.9));
const bloom = (x: number, y: number, n: number, r: number, pw: number, col: string, mid: string = YEL, midR = r * 0.32, off = 0, sw = 0.8) => all(
  ...range(n).map((i) => rot(x, y, off + (i * 360) / n, 1, ellipse(0, f1(-r * 0.55), pw, f1(r * 0.55), col, C.ink, sw))), circle(x, y, f1(midR), mid, C.ink, sw));
const stem = (d: string, w = 1.8, col: string = STEM) => line(d, col, w);
/** A bean seed lying on its side, centre (x,y). */
const bean = (x: number, y: number, s = 1, col: string = SEED, a = 0) => rot(x, y, a, s, path('M-9 -2 C-9 -8 -1 -9 3 -7 C6 -6 9 -5 9 0 C9 6 3 8 -2 7 C-7 6 -9 3 -9 -2 Z', col, C.ink, 1.2), path('M-1 -2 C0 -3 2 -3 3 -2', 'none', SEED2, 1.2));
/** A small seedling standing at (x,y): stem, two round seed leaves, optional pair of true leaves. */
const seedling = (x: number, y: number, s = 1, true2 = true, coty: string = COTY) => at(x, y, s, stem('M0 0 Q1 -10 0 -18', 1.6), roundLeaf(0, -18, 5, -160, coty), roundLeaf(0, -18, 5, -20, coty),
  true2 ? all(stem('M0 -18 L0 -24', 1.4), leaf(0, -24, 9, 3, -130), leaf(0, -24, 9, 3, -50)) : '');
/** Simple potted plant (pot rim at y). */
const pot = (x: number, y: number, w = 16, h = 14, col: string = POT) => all(path(`M${x - w / 2} ${y} L${x + w / 2} ${y} L${x + w / 2 - 3} ${y + h} L${x - w / 2 + 3} ${y + h} Z`, col, C.ink, 1.4), rect(x - w / 2 - 1.6, y - 3, w + 3.2, 4, col, 1, C.ink, 1.2));
const plant = (x: number, y: number, h: number, col: string = LEAF, n = 3) => all(stem(`M${x} ${y} L${x} ${y - h}`, 1.8), ...range(n).map((i) => leaf(x, y - h * (0.3 + (i * 0.6) / n), h * 0.38, h * 0.11, i % 2 ? -30 : -150, col)), leaf(x, y - h, h * 0.3, h * 0.1, -90, col));
const molCO2 = (x: number, y: number, s = 1) => at(x, y, s, circle(-4.6, 0, 3, CO2, C.ink, 0.8), circle(4.6, 0, 3, CO2, C.ink, 0.8), circle(0, 0, 3.6, '#4a4f57', C.ink, 0.8));
const bubble = (x: number, y: number, r = 2.6) => all(circle(x, y, r, O2, WATER2, 0.9), circle(f1(x - r * 0.35), f1(y - r * 0.35), f1(r * 0.25), WHITE, null));
const dots = (x: number, y: number, w: number, h: number, n: number, col: string, seed: number, r = 1) => { const R = rng(seed); return all(...range(n).map(() => circle(f1(x + R() * w), f1(y + R() * h), r, col, C.ink, 0.4))); };
const flake = (x: number, y: number, s = 1) => at(x, y, s, line('M-4 0 L4 0 M-2 -3.4 L2 3.4 M-2 3.4 L2 -3.4', '#6fa8d8', 1.2));
/** Row of 12 month blocks; the indices in `on` are coloured. */
const months = (y: number, on: number[], col: string = PINK) => all(...range(12).map((i) => rect(10 + i * 8.4, y, 7, 10, on.includes(i) ? col : WHITE, 1.4, C.ink, 0.9)));
const potato = (x: number, y: number, s = 1, a = 0) => rot(x, y, a, s, path('M-10 -1 C-10 -7 -3 -8 2 -7 C8 -6 11 -3 10 2 C9 7 2 8 -3 7 C-8 6 -10 4 -10 -1 Z', '#d8b46a', C.ink, 1.1), circle(-4, -2, 0.8, SEED2, null), circle(3, 2, 0.8, SEED2, null), circle(6, -3, 0.8, SEED2, null));
const tulip = (x: number, y: number, s = 1, col: string = RED) => at(x, y, s, stem('M0 0 L0 -26', 1.8), leaf(0, -4, 14, 3.4, -120), leaf(0, -6, 13, 3, -60), path('M-6 -26 C-7 -34 -5 -38 -4 -40 L-2 -34 L0 -40 L2 -34 L4 -40 C5 -38 7 -34 6 -26 C4 -23 -4 -23 -6 -26 Z', col, C.ink, 1));
const blub = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -12 C-2 -10 -9 -6 -9 1 C-9 6 -5 8 0 8 C5 8 9 6 9 1 C9 -6 2 -10 0 -12 Z', '#e9c9a0', C.ink, 1.2), path('M-3 -2 C-3 2 -2 5 0 7 M3 -2 C3 2 2 5 0 7', 'none', '#c9a072', 0.8), line('M-5 8 l-2 4 M-2 8 l-1 5 M1 8 l1 5 M4 8 l2 4', ROOT, 1));
const fig = (x: number, top: string, more: { h?: number; hairStyle?: 'short' | 'long' } = {}) => P({ x, top, mood: 'smile', ...more });

// ── Motifs ───────────────────────────────────────────────────────────
export const PLANT_LIFE_MOTIFS: Record<string, Svg> = {
  // ── 2841 Frö och groning ──
  /** gro: in a cut through the soil a bean seed has split open; a white root grows down and a green shoot with two seed leaves pushes up through the surface towards a small sun. The bean is ringed. */
  'vliv.gro': all(bg(SKY), soil(62), sunAt(98, 22, 7), bean(56, 86, 1.5), path('M56 92 C55 98 57 104 54 110', 'none', C.ink, 3.6), path('M56 92 C55 98 57 104 54 110', 'none', ROOT, 2.4), line('M58 94 l4 3 M55 101 l-4 2', ROOT, 1),
    stem('M58 80 C58 72 56 64 58 52', 2.2), roundLeaf(58, 52, 6, -155), roundLeaf(58, 52, 6, -25), ring(56, 86, 18, 13)),
  /** groning: three stages in a row on damp soil – a dry seed, the same seed swollen with a small white root, and a seedling with two round seed leaves – joined by orange arrows. */
  'vliv.groning': all(bg(SKY), soil(84), bean(18, 80, 1, SEED, 0), arrow(28, 74, 40, 74, HL, 2.4), bean(56, 78, 1.35, '#c99a5e'), path('M56 84 C55 90 57 96 55 102', 'none', C.ink, 3), path('M56 84 C55 90 57 96 55 102', 'none', ROOT, 2),
    arrow(70, 74, 82, 74, HL, 2.4), seedling(98, 84, 1.6, false), path('M98 84 C97 92 99 98 97 106', 'none', C.ink, 3), path('M98 84 C97 92 99 98 97 106', 'none', ROOT, 2)),
  /** fröskal: one big seed cut open – the hard brown outer coat is peeled back a little and ringed in orange, the pale soft inside shows through. */
  'vliv.fröskal': all(bg(), ground, at(60, 64, 4.4, path('M-9 -2 C-9 -8 -1 -9 3 -7 C6 -6 9 -5 9 0 C9 6 3 8 -2 7 C-7 6 -9 3 -9 -2 Z', '#f3e6c4', C.ink, 0.5)),
    at(60, 64, 4.4, path('M-9 -2 C-9 -8 -1 -9 3 -7 C6 -6 9 -5 9 0 L5 1 C4 -3 0 -5 -4 -4 C-7 -3 -8 0 -7 3 C-8 2 -9 0 -9 -2 Z', SEED, C.ink, 0.5), path('M-9 -2 C-9 3 -7 6 -2 7 C3 8 9 6 9 0 L5 1 C5 5 0 6 -3 5 C-6 4 -7 3 -7 3 Z', SEED, C.ink, 0.5)),
    path('M42 46 C48 38 70 34 86 44', 'none', HL, 2.6), path('M86 44 L82 40 M86 44 L81 46', 'none', HL, 2.4), path('M34 70 C36 88 62 98 86 84', 'none', HL, 2.6)),
  /** spricka (verb): a hard round seed whose brown shell breaks with a zigzag crack; small burst lines and two flying chips show it is splitting open right now. */
  'vliv.spricka-verb': all(bg(), ground, ellipse(60, 64, 30, 24, SEED, C.ink, 2), path('M38 56 C46 52 52 62 60 58 C68 54 72 66 82 60', 'none', SEED2, 1), path('M48 42 L54 52 L50 58 L60 66 L56 74 L66 86', 'none', C.ink, 3), path('M48 42 L54 52 L50 58 L60 66 L56 74 L66 86', 'none', '#f3e6c4', 1.4),
    line('M40 36 L36 30 M60 34 L60 26 M76 40 L82 34 M84 64 L92 64', HL, 2), path('M30 34 l4 -3 l2 4 Z', SEED, C.ink, 1), path('M88 46 l5 -2 l0 5 Z', SEED, C.ink, 1)),
  /** grodd: close-up of a bean lying on damp paper with a white sprout curling out of it; the sprout is ringed. Beside it a small bowl of bean sprouts. */
  'vliv.grodd': all(bg(), rect(10, 70, 66, 10, '#e4eef4', 2, C.grey, 1), bean(34, 66, 2.2), path('M44 60 C56 52 62 60 60 70 C58 78 66 82 72 80', 'none', C.ink, 5), path('M44 60 C56 52 62 60 60 70 C58 78 66 82 72 80', 'none', ROOT, 3.4), ring(58, 66, 16, 16),
    ellipse(96, 100, 16, 5, WHITE, C.ink, 1.4), path('M80 100 C80 110 112 110 112 100 Z', WHITE, C.ink, 1.4), ...range(7).map((i) => path(`M${84 + i * 4} 100 C${82 + i * 4} 92 ${88 + i * 4} 90 ${86 + i * 4} 86`, 'none', '#efe6c8', 1.4)), ...range(7).map((i) => ellipse(86 + i * 4, 86, 1.6, 1.2, '#d6d06a', null)), ground),
  /** groddplanta: a tiny seedling with only two round seed leaves stands in soil, ringed; a grown plant of the same kind stands grey behind it for scale. */
  'vliv.groddplanta': all(bg(SKY), soil(96), greyed(plant(86, 96, 70, LEAF, 5)), seedling(40, 96, 1.6, false), ring(40, 80, 18, 16)),
  /** hjärtblad: a young plant with two round yellow-green seed leaves low down (coloured and ringed) and above them its first pointed true leaves drawn pale. */
  'vliv.hjärtblad': all(bg(SKY), soil(98), stem('M60 98 Q61 70 60 34', 2.4), leaf(60, 40, 22, 6, -140, PALEGREEN), leaf(60, 40, 22, 6, -40, PALEGREEN), leaf(60, 34, 16, 5, -90, PALEGREEN),
    roundLeaf(60, 72, 13, -170, '#b9d75a'), roundLeaf(60, 72, 13, -10, '#b9d75a'), ring(60, 70, 34, 13)),
  /** komma upp: the soil surface across the picture with small green shoots just breaking through it; under the surface the seeds they came from; orange arrows point upwards. */
  'vliv.komma-upp': all(bg(SKY), soil(70), ...[24, 60, 96].map((x, i) => all(bean(x, 94, 0.9), line(`M${x} 90 C${x - 1} 84 ${x + 1} 78 ${x} ${66 - i * 2}`, STEM, 2), roundLeaf(x, 66 - i * 2, 4, -160), roundLeaf(x, 66 - i * 2, 4, -20), arrow(x + 10, 60, x + 10, 44, HL, 2.2)))),
  /** grobar: two seeds side by side on soil – the coloured one has sprouted and has a green tick; the grey, dried and wrinkled one beside it does nothing and has a red cross. */
  'vliv.grobar': all(bg(), soil(80), seedling(36, 80, 1.6, false), bean(36, 86, 1.3), path('M36 90 C35 96 37 100 35 106', 'none', ROOT, 2), check(36, 30, 1.2),
    greyed(at(86, 84, 1.3, path('M-9 -1 C-9 -6 -4 -6 -2 -5 C0 -7 3 -6 4 -5 C7 -6 9 -3 8 0 C9 4 4 6 0 5 C-3 7 -7 5 -9 -1 Z', '#a08a6a', C.ink, 1.2), line('M-5 -2 l3 2 M1 -1 l3 2', C.ink, 0.6))), cross(86, 30, 1.2)),
  /** groningstid: from a seed at the left an orange arrow runs along a row of day marks (tick, tick, tick …) to a small seedling at the right; a little calendar page sits above the arrow. */
  'vliv.groningstid': all(bg(), soil(88), bean(18, 84, 1.1), seedling(102, 88, 1.3, false), arrow(30, 76, 90, 76, HL, 2.6), ...range(6).map((i) => line(`M${36 + i * 9} 70 L${36 + i * 9} 82`, C.ink, 1.4)),
    rect(42, 22, 36, 34, WHITE, 3, C.ink, 1.6), rect(42, 22, 36, 9, RED, 3, C.ink, 1.6), ...range(3).map((r) => all(...range(4).map((c) => rect(46 + c * 8, 35 + r * 6.4, 5, 4, r * 4 + c < 6 ? '#f4b25a' : PALE, 0.8, null))))),
  /** frövila: a seed lies quietly in the soil under a layer of snow at night; a moon above and small "z z" signs rise from the seed – it is resting, not growing. */
  'vliv.frövila': all(bg(NIGHT), at(92, 24, 1.4, path('M2 -8 C-8 -8 -8 8 2 8 C-3 4 -3 -4 2 -8 Z', '#f6e7a0', C.ink, 1)), soil(70), path('M4 70 C20 62 40 66 60 62 C80 60 100 66 116 62 L116 72 L4 72 Z', WHITE, C.grey, 1), ...range(6).map((i) => flake(12 + i * 18, 22 + (i % 3) * 12, 1)),
    bean(50, 94, 1.6), path('M64 84 l6 0 l-6 6 l6 0', 'none', WHITE, 1.8), path('M74 72 l8 0 l-8 8 l8 0', 'none', WHITE, 2), ring(50, 94, 18, 12)),
  /** näringsförråd: a bean cut open – inside, two big yellow halves full of food (coloured and ringed) and a tiny plant germ between them; small orange arrows carry the food to the germ. */
  'vliv.näringsförråd': all(bg(), ground, at(60, 62, 4, path('M-9 -2 C-9 -8 -1 -9 3 -7 C6 -6 9 -5 9 0 C9 6 3 8 -2 7 C-7 6 -9 3 -9 -2 Z', SEED, C.ink, 0.5)), at(60, 62, 3.6, path('M-9 -2 C-9 -8 -1 -9 3 -7 C6 -6 9 -5 9 0 C9 6 3 8 -2 7 C-7 6 -9 3 -9 -2 Z', '#f2d77a', C.ink, 0.4)),
    dots(34, 52, 50, 22, 26, '#e6b030', 7, 1.2), path('M80 54 C84 50 88 52 88 58 C88 62 84 64 80 62 Z', '#9ccc5a', C.ink, 1.2), line('M80 58 L74 58', '#7aa840', 1.6), arrow(46, 76, 72, 66, HL, 2), arrow(48, 44, 74, 54, HL, 2), ring(56, 62, 30, 22)),

  // ── 2842 Rötter och näringsupptag ──
  /** sidorot: a cut through the soil shows one thick root going straight down from a small plant; many thinner side roots branch off from it to the left and right and are coloured orange. */
  'vliv.sidorot': all(bg(SKY), soil(40), plant(60, 40, 30, LEAF, 3), path('M60 40 C60 60 61 84 60 108', 'none', C.ink, 6), path('M60 40 C60 60 61 84 60 108', 'none', ROOT, 4.4),
    ...[52, 64, 76, 88, 98].map((y, i) => all(path(`M60 ${y} C52 ${y + 2} 44 ${y + 6} ${34 + i * 2} ${y + 12}`, 'none', HL, 2.2), path(`M60 ${y + 4} C68 ${y + 6} 76 ${y + 10} ${86 - i * 2} ${y + 14}`, 'none', HL, 2.2)))),
  /** trådrot: a grass tuft whose many thin roots of equal size spread like a beard in the soil (coloured); a small grey carrot-like taproot plant beside it for contrast. */
  'vliv.trådrot': all(bg(SKY), soil(46), ...range(9).map((i) => path(`M${30 + i * 2} 46 Q${26 + i * 3} ${30} ${20 + i * 5} ${14 + (i % 3) * 4}`, 'none', LEAF2, 1.8)),
    ...range(14).map((i) => path(`M38 46 C${30 + i * 1.4} 60 ${16 + i * 4} 76 ${12 + i * 4.6} ${86 + (i % 4) * 5}`, 'none', HL, 1.4)),
    greyed(all(leaf(94, 46, 14, 4, -120), leaf(94, 46, 14, 4, -60), path('M88 46 L100 46 L95 92 Z', '#f08a2c', C.ink, 1.2)))),
  /** rothår: a root tip seen through a magnifying lens – the thin root is covered behind its tip by a fuzz of very fine white hairs, ringed in orange; soil grains around. */
  'vliv.rothår': all(bg(SKY), soil(30), path('M30 30 C30 46 32 58 34 70', 'none', ROOT, 3), lens(64, 70, 32, all(rect(34, 40, 60, 60, SOIL, 0, null), dots(36, 42, 56, 56, 16, '#b88a5c', 4, 1.8), path('M56 40 C58 60 62 78 64 96 L68 96 C66 78 62 60 60 40 Z', ROOT, C.ink, 1), ...range(18).map((i) => { const y = 46 + i * 2.6; return line(`M${f1(57 + i * 0.45)} ${y} l-7 -2 M${f1(61 + i * 0.45)} ${y + 1} l7 -2`, WHITE, 0.8); })), 0.8, -0.9), ring(64, 66, 18, 22)),
  /** rotspets: in the soil a root grows down and finds its way between grey stones; its pointed end with a small cap is ringed in orange, a short orange arrow shows the direction it grows. */
  'vliv.rotspets': all(bg(SKY), soil(28), plant(40, 28, 20, LEAF, 2), path('M40 28 C42 46 56 50 54 66 C52 78 66 82 68 94', 'none', C.ink, 5), path('M40 28 C42 46 56 50 54 66 C52 78 66 82 68 94', 'none', ROOT, 3.6),
    ellipse(36, 62, 12, 8, STONE, C.ink, 1.4), ellipse(80, 76, 12, 9, STONE, C.ink, 1.4), ellipse(50, 102, 10, 6, STONE, C.ink, 1.4), path('M65 92 L71 92 L68 99 Z', '#e8c890', C.ink, 1), arrow(76, 92, 80, 104, HL, 2.2), ring(68, 95, 9)),
  /** rotknöl: a dahlia-like flower above ground; below, in the cut soil, a bunch of fat brown finger-like root tubers hangs from the stem base, coloured and ringed. */
  'vliv.rotknöl': all(bg(SKY), soil(56), stem('M60 56 L60 24', 2.2), leaf(60, 44, 16, 5, -150), leaf(60, 40, 16, 5, -30), bloom(60, 20, 12, 18, 3.4, '#e8466a', YEL, 4),
    ...[-24, -10, 6, 20].map((a, i) => rot(60, 60, a + 90, 1, path('M0 -3 C10 -6 26 -6 30 0 C26 6 10 6 0 3 Z', i % 2 ? '#a8784a' : '#bb8a58', C.ink, 1.2))), ring(60, 80, 24, 22)),
  /** näringsupptag: a cut through the soil with the roots of a plant; small coloured dots (blue, yellow, purple) float in the soil water and orange arrows carry them into the roots and up the stem. */
  'vliv.näringsupptag': all(bg(SKY), soil(52), plant(60, 52, 36, LEAF, 3), ...range(6).map((i) => path(`M60 52 C${54 + i * 2} 66 ${30 + i * 12} 80 ${22 + i * 15} 100`, 'none', ROOT, 2)),
    dots(10, 66, 100, 40, 14, WATER, 8, 1.6), dots(10, 66, 100, 40, 10, YEL, 11, 1.4), dots(10, 66, 100, 40, 8, '#9a6ac8', 13, 1.4), arrow(24, 92, 38, 78, HL, 2.2), arrow(96, 92, 82, 78, HL, 2.2), arrow(66, 50, 66, 26, HL, 2.4)),
  /** växtnäring: a person pours a few drops of liquid plant food from a small bottle into a watering can; next to it stands a fresh, green plant in a pot. */
  'vliv.växtnäring': all(bg(), ground, fig(28, '#3a8a6a', { h: 0.92 }), arm(36, 52, 48, 40), rect(46, 26, 8, 14, '#5aa0d0', 2, C.ink, 1.2), rect(48, 22, 4, 4, WHITE, 1, C.ink, 1), drop(52, 48, 0.6, '#3f9a4f'), drop(53, 56, 0.6, '#3f9a4f'),
    path('M44 64 L66 64 L64 88 L46 88 Z', '#8ab4d4', C.ink, 1.6), path('M66 70 L80 60', 'none', C.ink, 3), pot(96, 94, 18, 16), plant(96, 92, 44, LEAF, 4)),
  /** fosfor: a plant with an unusually big root system and many flowers stands in the soil; beside it a sack with a white bone picture and white powder (bone meal) is poured on the soil – symbol for the substance that feeds roots and flowers. */
  'vliv.fosfor': all(bg(SKY), soil(70), plant(76, 70, 46, LEAF, 4), bloom(64, 34, 5, 8, 2.4, '#ef6aa0', YEL, 2), bloom(90, 30, 5, 8, 2.4, '#ef6aa0', YEL, 2), bloom(76, 22, 5, 8, 2.4, '#ef6aa0', YEL, 2),
    ...range(7).map((i) => path(`M76 70 C${70 + i * 2} 82 ${54 + i * 8} 94 ${52 + i * 8} 108`, 'none', HL, 1.8)), path('M10 50 L38 50 L40 92 L8 92 Z', '#d8c8a0', C.ink, 1.6), path('M16 66 C14 62 18 60 20 63 L28 63 C30 60 34 62 32 66 C34 70 30 72 28 69 L20 69 C18 72 14 70 16 66 Z', WHITE, C.ink, 1),
    path('M40 54 C46 58 50 64 52 70', 'none', '#efe9dc', 4), dots(44, 64, 16, 6, 8, WHITE, 5, 1)),
  /** kalium: grey-white ash from an old fire is spread with a small shovel on the soil around a healthy plant; a banana and a potato lie beside it as other things that contain the same substance. */
  'vliv.kalium': all(bg(SKY), soil(76), plant(66, 76, 46, LEAF, 4), path('M40 76 C50 70 80 70 92 76 Z', '#c8c4be', C.ink, 1), dots(44, 70, 44, 5, 12, '#e6e3de', 9, 1), path('M14 30 L36 56', 'none', BARK, 3), path('M34 52 L44 60 L38 66 L28 58 Z', '#9aa3ad', C.ink, 1.2),
    path('M92 94 C98 100 108 100 112 92 C108 96 98 96 94 90 Z', YEL, C.ink, 1.2), potato(22, 96, 1.1)),
  /** näringsbrist: a sad plant with pale yellow, spotty leaves in grey, lifeless soil; beside it a grey healthy green plant in good dark soil for comparison. */
  'vliv.näringsbrist': all(bg(), ground, rect(14, 92, 44, 20, '#c8b8a0', 2, C.ink, 1.2), stem('M36 92 L36 44', 1.6, '#a8a050'), ...[[-150, 82], [-30, 76], [-150, 64], [-30, 58]].map(([a, y]) => leaf(36, y!, 16, 5, a!, YELLOWLEAF)), dots(22, 54, 30, 30, 10, '#a0702a', 3, 1.1), leaf(36, 46, 12, 4, 60, YELLOWLEAF),
    greyed(all(rect(64, 92, 44, 20, SOIL2, 2, C.ink, 1.2), plant(86, 92, 52, LEAF, 5)))),
  /** förankra (fästa stadigt): a tree bends in a strong wind (grey streaks), but its deep roots grip the soil and rocks like hands, coloured and ringed, so the tree stays put. */
  'vliv.förankra.2': all(bg(SKY), soil(64), line('M8 20 L30 20 M6 32 L24 32 M10 44 L28 44', C.grey, 2), path('M60 64 C62 50 66 36 74 24', 'none', BARK, 7), ellipse(80, 22, 22, 14, LEAF, C.ink, 1.4), ellipse(70, 30, 14, 9, '#58a046', C.ink, 1.2),
    ...[[-150, 30], [-120, 38], [-90, 42], [-60, 38], [-30, 32]].map(([a, l]) => rot(60, 66, a! + 180, 1, path(`M0 0 C${l! * 0.4} 2 ${l! * 0.7} -2 ${l} 4`, 'none', HL, 3))), ellipse(26, 96, 10, 6, STONE, C.ink, 1.2), ellipse(96, 98, 10, 6, STONE, C.ink, 1.2), ring(60, 86, 40, 24)),

  // ── 2843 Stjälkar och blad ──
  /** stjälk: a tall sunflower; its long thick green stem carrying the leaves and the flower head is coloured strongly and ringed, the rest pale. */
  'vliv.stjälk': all(bg(SKY), ground, path('M58 112 L58 30 L62 30 L62 112 Z', STEM, C.ink, 1.4), leaf(60, 80, 26, 9, -160, PALEGREEN), leaf(60, 64, 24, 8, -20, PALEGREEN), leaf(60, 48, 20, 7, -160, PALEGREEN), bloom(60, 24, 16, 18, 3.2, '#f4e2a0', '#cdb68a', 7), ring(60, 70, 10, 42)),
  /** blad: a single big green leaf with a short stalk, sitting on a thin stem, fills the picture and is ringed; the stem and a second small leaf are pale. */
  'vliv.blad': all(bg(SKY), ground, stem('M30 112 Q32 80 30 40', 2, PALEGREEN), leaf(32, 72, 70, 26, -28, LEAF, true, 1.4), ...range(4).map((i) => rot(32, 72, -28, 1, line(`M${16 + i * 12} 0 l8 -12 M${16 + i * 12} 0 l8 12`, LEAF2, 0.8))), leaf(30, 50, 18, 6, -140, PALEGREEN), ring(66, 54, 42, 26)),
  /** vedartad: a rose bush with hard brown woody stems and a few red roses stands in colour; beside it a soft green herb in grey. */
  'vliv.vedartad': all(bg(), ground, ...[[-14, 'M44 112 C40 90 30 70 26 44'], [0, 'M44 112 C44 84 46 64 48 36'], [14, 'M44 112 C50 90 60 72 66 48']].map(([, d]) => all(line(d as string, C.ink, 5.4), line(d as string, WOOD, 3.6))), ...[[30, 70], [46, 60], [58, 76]].map(([x, y]) => line(`M${x} ${y} l-3 -3 M${x} ${y! + 8} l3 -3`, C.ink, 1)),
    bloom(26, 40, 7, 9, 3, RED, '#9a1a2a', 2.4), bloom(48, 32, 7, 9, 3, RED, '#9a1a2a', 2.4), bloom(66, 44, 7, 9, 3, RED, '#9a1a2a', 2.4), leaf(34, 62, 10, 3.4, -150), leaf(52, 54, 10, 3.4, -30), greyed(plant(94, 112, 44, LEAF, 4))),
  /** örtartad: a soft green herb with thin, bendy, juicy green stems (one bends gently) stands in colour; beside it a brown woody bush in grey. */
  'vliv.örtartad': all(bg(), ground, path('M34 112 C34 90 30 70 22 54', 'none', '#7ac05a', 3), path('M38 112 C38 90 40 70 38 46', 'none', '#7ac05a', 3), path('M42 112 C44 92 52 78 58 66', 'none', '#7ac05a', 3),
    leaf(22, 54, 12, 5, -120, LEAF), leaf(38, 46, 12, 5, -90, LEAF), leaf(58, 66, 12, 5, -40, LEAF), leaf(30, 80, 12, 5, -160, LEAF), leaf(44, 86, 12, 5, -20, LEAF), greyed(all(line('M90 112 C86 90 78 70 74 50', C.ink, 5), line('M90 112 C90 86 92 66 94 44', C.ink, 5), line('M90 112 C96 90 104 72 108 54', C.ink, 5)))),
  /** bladskaft: one leaf on a plant stem; the thin stalk joining the leaf to the stem is coloured orange and ringed, the leaf blade itself is pale. */
  'vliv.bladskaft': all(bg(SKY), ground, stem('M24 112 L24 20', 3, PALEGREEN), path('M24 70 C38 64 46 58 56 54', 'none', C.ink, 4.4), path('M24 70 C38 64 46 58 56 54', 'none', HL, 3), rot(56, 54, -20, 1, path('M0 0 C14 -22 48 -20 56 0 C48 20 14 22 0 0 Z', PALEGREEN, C.ink, 1.2), line('M2 0 L50 0', '#a8c890', 1)), ring(40, 62, 20, 12)),
  /** bladskiva: the same leaf shape, but now the broad flat green part is coloured strongly and ringed, while the stalk and stem are pale. */
  'vliv.bladskiva': all(bg(SKY), ground, stem('M24 112 L24 20', 3, PALEGREEN), path('M24 70 C38 64 46 58 56 54', 'none', PALEGREEN, 3), rot(56, 54, -20, 1, path('M0 0 C14 -22 48 -20 56 0 C48 20 14 22 0 0 Z', LEAF, C.ink, 1.6), line('M2 0 L50 0', LEAF2, 1), ...range(4).map((i) => line(`M${10 + i * 10} 0 l8 -9 M${10 + i * 10} 0 l8 9`, LEAF2, 0.8))), ring(82, 44, 32, 22)),
  /** bladnerv: a person holds a big leaf up against the sun; light shines through and the network of veins (a middle vein and branching side veins) stands out in orange. */
  'vliv.bladnerv': all(bg(SKY), sunAt(100, 18, 8), ground, fig(26, '#5a7fe0', { h: 0.8 }), arm(34, 64, 50, 52), rot(70, 46, -30, 1, path('M-22 0 C-12 -24 24 -26 36 0 C24 26 -12 24 -22 0 Z', '#bfe08a', C.ink, 1.4), line('M-22 0 L34 0', HL, 2.2),
    ...range(5).map((i) => line(`M${-12 + i * 9} 0 C${-8 + i * 9} -6 ${-4 + i * 9} -12 ${-2 + i * 9} -18 M${-12 + i * 9} 0 C${-8 + i * 9} 6 ${-4 + i * 9} 12 ${-2 + i * 9} 18`, HL, 1.4)))),
  /** bladkant: a big birch-like leaf whose saw-toothed edge all the way round is traced in orange; a smooth-edged leaf in grey beside it. */
  'vliv.bladkant': all(bg(SKY), ground, (() => { const n = 14; const pts: string[] = []; for (let i = 0; i <= n; i++) { const t = i / n, a = Math.PI * t; const r = 30 + (i % 2 ? 4 : 0); pts.push(`${f1(50 + Math.cos(Math.PI - a) * r * 0.8)} ${f1(58 - Math.sin(a) * r)}`); } for (let i = 1; i < n; i++) { const t = i / n, a = Math.PI * t; const r = 30 + (i % 2 ? 4 : 0); pts.push(`${f1(50 + Math.cos(a) * r * 0.8)} ${f1(58 + Math.sin(a) * r * 0.9)}`); } return all(path(`M${pts.join(' L')} Z`, LEAF, HL, 2.6), line('M26 58 L76 58', LEAF2, 1), stem('M26 58 L14 70', 2)); })(),
    greyed(all(ellipse(98, 60, 12, 20, LEAF, C.ink, 1.2), line('M98 40 L98 92', LEAF2, 1)))),
  /** bladställning: a mint-like stem where the leaves sit two and two exactly opposite each other; each opposite pair is joined by a short orange bar; a grey stem with leaves placed one by one alternately beside it. */
  'vliv.bladställning': all(bg(SKY), ground, stem('M42 112 L42 18', 3), ...[94, 70, 46, 24].map((y) => all(leaf(42, y, 22, 7, 180), leaf(42, y, 22, 7, 0), line(`M30 ${y} L54 ${y}`, HL, 2.4))),
    greyed(all(stem('M94 112 L94 22', 3), ...[96, 80, 64, 48, 32].map((y, i) => leaf(94, y, 18, 6, i % 2 ? 200 : -20))))),
  /** sammansatt blad: a rowan leaf – one long stalk with many small leaflets in pairs and one at the tip – bracketed in orange as one leaf; a grey simple single leaf beside it. */
  'vliv.sammansatt-blad': all(bg(SKY), ground, stem('M40 110 L40 18', 2), ...range(6).map((i) => all(leaf(40, 96 - i * 13, 16, 5, 200), leaf(40, 96 - i * 13, 16, 5, -20))), leaf(40, 20, 14, 5, -90),
    path('M16 14 L12 14 L12 108 L16 108 M64 14 L68 14 L68 108 L64 108', 'none', HL, 2.4), greyed(all(stem('M94 110 L94 70', 2), leaf(94, 70, 34, 12, -90)))),
  /** bladrosett: seen from slightly above, a dandelion's long toothed leaves lie flat on the ground in a circle around one centre, like a green star, and are ringed. */
  'vliv.bladrosett': all(bg('#cfe3b8'), ...range(10).map((i) => rot(60, 66, i * 36, 1, path('M0 0 L6 -4 L10 0 L16 -5 L20 0 L26 -5 L30 0 L36 -3 L40 0 L36 3 L30 2 L26 5 L20 2 L16 5 L10 2 L6 4 Z', i % 2 ? LEAF : '#58a046', C.ink, 0.8))), circle(60, 66, 4, '#86b04a', C.ink, 1), stem('M60 66 L60 30', 2), bloom(60, 26, 18, 10, 1.6, YEL, GOLD, 3), ring(60, 70, 50, 36)),
  /** klänge: a pea plant climbs a stick; thin green tendrils coil around the stick in spirals, coloured orange and ringed. */
  'vliv.klänge': all(bg(SKY), ground, line('M70 112 L70 10', WOOD, 4), path('M40 112 C44 90 52 70 58 40', 'none', STEM, 2.4), leaf(48, 80, 14, 6, -160), leaf(52, 64, 14, 6, -150), leaf(56, 48, 12, 5, -160), bloom(46, 92, 5, 8, 3, WHITE, '#f0e0f0', 2),
    ...[[56, 70], [58, 50], [58, 30]].map(([x, y]) => path(`M${x} ${y} C${x! + 6} ${y! - 2} ${x! + 10} ${y! - 2} 70 ${y! - 4} C74 ${y! - 6} 74 ${y! - 1} 70 ${y} C66 ${y! + 1} 66 ${y! - 7} 70 ${y! - 8} C74 ${y! - 9} 74 ${y! - 4} 71 ${y! - 3}`, 'none', HL, 1.8)), ring(68, 50, 12, 30)),
  /** klyvöppning: a magnifying lens over the underside of a leaf shows the green cells and several tiny mouth-like openings, each made of two bean-shaped cells; small grey and blue arrows show air and water vapour going in and out of one of them, ringed. */
  'vliv.klyvöppning': all(bg(SKY), rot(30, 92, -20, 1, path('M-24 0 C-12 -18 18 -18 30 0 C18 18 -12 18 -24 0 Z', LEAF, C.ink, 1.4)), lens(70, 56, 38, all(rect(32, 18, 76, 76, '#b8dc90', 0, null), ...range(5).map((r) => path(`M32 ${26 + r * 16} C52 ${22 + r * 16} 88 ${30 + r * 16} 108 ${24 + r * 16}`, 'none', '#94c070', 1)),
    ...[[56, 40], [86, 44], [52, 78], [84, 80], [70, 60]].map(([x, y]) => all(path(`M${x! - 8} ${y} C${x! - 8} ${y! - 8} ${x! - 2} ${y! - 8} ${x} ${y! - 4} C${x! - 3} ${y! - 2} ${x! - 3} ${y! + 2} ${x} ${y! + 4} C${x! - 2} ${y! + 8} ${x! - 8} ${y! + 8} ${x! - 8} ${y} Z`, '#5ea848', C.ink, 0.9), path(`M${x! + 8} ${y} C${x! + 8} ${y! - 8} ${x! + 2} ${y! - 8} ${x} ${y! - 4} C${x! + 3} ${y! - 2} ${x! + 3} ${y! + 2} ${x} ${y! + 4} C${x! + 2} ${y! + 8} ${x! + 8} ${y! + 8} ${x! + 8} ${y} Z`, '#5ea848', C.ink, 0.9), ellipse(x!, y!, 1.4, 4, '#2f5a26', null))),
    arrow(70, 50, 70, 36, WATER2, 1.8), molCO2(80, 70, 0.7)), -0.75, 0.8), ring(70, 60, 13)),

  // ── 2844 Fotosyntes i vardagstermer ──
  /** solljus: a bright sun in the corner sends wide golden beams through a window onto a green plant in a pot on the windowsill. */
  'vliv.solljus': all(bg('#efe4cc'), rect(10, 14, 50, 60, SKY, 2, C.ink, 2), line('M35 14 L35 74 M10 44 L60 44', C.ink, 2), sunAt(24, 26, 7), path('M28 30 L104 72 L80 92 L20 40 Z', 'rgba(250,215,90,0.45)', null), path('M30 36 L96 96 L70 100 L22 46 Z', 'rgba(250,215,90,0.35)', null),
    rect(4, 98, 112, 6, WOOD, 1, C.ink, 1.4), pot(88, 84, 18, 14), plant(88, 82, 40, LEAF, 4)),
  /** fotosyntes: one big green leaf in the middle; sunbeams come in from the sun above, grey carbon-dioxide balls and blue water drops go in (orange arrows in), and light-blue oxygen bubbles and a white sugar cube come out (arrows out). */
  'vliv.fotosyntes': all(bg(SKY), sunAt(20, 20, 8), line('M30 28 L46 42 M36 22 L52 36', GOLD, 2), rot(62, 60, -20, 1, path('M-26 0 C-14 -24 28 -24 38 0 C28 24 -14 24 -26 0 Z', LEAF, C.ink, 1.6), line('M-24 0 L34 0', LEAF2, 1.2)), stem('M40 70 L28 100', 2),
    molCO2(100, 26), arrow(94, 32, 84, 42, HL, 2.2), drop(20, 96, 1.2, WATER), arrow(26, 92, 34, 82, HL, 2.2), bubble(96, 78), bubble(104, 86, 2), bubble(100, 94, 3), arrow(80, 72, 90, 80, HL, 2.2), rect(64, 92, 10, 10, WHITE, 1.4, C.ink, 1.2), line('M64 92 L68 89 L78 89 L74 92 M78 89 L78 99 L74 102', C.ink, 1), arrow(62, 76, 66, 88, HL, 2.2)),
  /** klorofyll: a magnifying lens over a green leaf shows its cells packed with small bright-green grains (ringed); beside it an autumn leaf in grey that has lost them. */
  'vliv.klorofyll': all(bg(SKY), rot(26, 84, -40, 1, path('M-20 0 C-10 -18 18 -18 26 0 C18 18 -10 18 -20 0 Z', LEAF, C.ink, 1.4)), lens(64, 50, 34, all(...range(3).map((r) => all(...range(3).map((c) => all(rect(38 + c * 18, 24 + r * 18, 17, 17, '#e6f2d4', 3, '#9cc07a', 1), dots(40 + c * 18, 26 + r * 18, 12, 12, 6, '#2fa83a', r * 3 + c + 2, 1.8)))))), -0.7, 0.9), ring(64, 50, 22),
    greyed(rot(96, 96, -30, 1, path('M-14 0 C-6 -12 12 -12 18 0 C12 12 -6 12 -14 0 Z', YELLOWLEAF, C.ink, 1.2)))),
  /** stärkelse: a raw potato cut in half shows its white inside; next to it a bowl of fine white powder, and a lens shows the powder as many small white grains (ringed). */
  'vliv.stärkelse': all(bg(), ground, path('M8 98 C8 84 22 80 34 82 C46 84 50 92 48 100 C46 108 30 110 20 108 C12 106 8 104 8 98 Z', '#d8b46a', C.ink, 1.4), ellipse(30, 96, 14, 9, '#fbf4dc', C.ink, 1), dots(20, 90, 20, 12, 10, WHITE, 2, 0.8),
    ellipse(76, 98, 20, 6, WHITE, C.ink, 1.4), path('M56 98 C56 112 96 112 96 98 Z', '#c8d8e4', C.ink, 1.4), path('M62 98 C66 88 86 88 90 98 Z', WHITE, C.ink, 1), lens(78, 40, 22, all(...range(14).map((i) => ellipse(f1(66 + (i % 5) * 6), f1(30 + Math.floor(i / 5) * 8), 2.6, 2, WHITE, C.grey, 0.8))), -0.4, 1), ring(78, 40, 26)),
  /** avge (släppa ut): a green water plant in a glass jar of water in the sun gives off a stream of small light-blue bubbles that rise to the surface; orange arrows point out from the leaves. */
  'vliv.avge': all(bg(), sunAt(100, 18, 7), ground, path('M30 34 L30 104 C30 110 90 110 90 104 L90 34', GLASS, C.ink, 2), rect(32, 48, 56, 58, 'rgba(159,208,236,0.55)', 0, null), line('M32 48 L88 48', WATER2, 1.2),
    stem('M60 106 C58 90 62 76 60 60', 2), ...[[96, -150], [88, -30], [78, -150], [70, -30], [62, -120]].map(([y, a]) => leaf(60, y!, 14, 3, a!, '#5aa84a')), ...[[50, 84], [52, 74], [48, 64], [54, 56], [70, 80], [68, 68], [72, 58], [64, 52]].map(([x, y], i) => bubble(x!, y!, 1.6 + (i % 3) * 0.6)),
    arrow(64, 76, 76, 70, HL, 2), arrow(56, 70, 44, 64, HL, 2), bubble(58, 44, 2.4), bubble(66, 40, 2)),
  /** binda koldioxid: grey carbon-dioxide balls float in the air and orange arrows draw them into the crowns of trees; in the trunks and roots below they are drawn as dark stored dots. */
  'vliv.binda-koldioxid': all(bg(SKY), soil(92), ...[[36, 0.9], [84, 1]].map(([x, s]) => at(x!, 92, s!, path('M-4 0 L-3 -40 L3 -40 L4 0 Z', BARK, C.ink, 1.2), circle(0, -50, 20, LEAF, C.ink, 1.4), circle(-10, -44, 12, '#58a046', C.ink, 1), circle(10, -44, 12, '#58a046', C.ink, 1), dots(-3, -38, 6, 34, 6, '#2b2a33', x!, 1), path('M0 0 C-6 6 -10 10 -14 16 M0 0 C6 6 10 10 14 16', 'none', ROOT, 1.6))),
    molCO2(14, 14, 0.9), molCO2(60, 12, 0.9), molCO2(106, 16, 0.9), arrow(18, 20, 28, 30, HL, 2), arrow(60, 18, 60, 30, HL, 2), arrow(102, 22, 92, 30, HL, 2)),
  /** vända sig mot ljuset: a potted plant on a windowsill; its stem and all leaves bend clearly towards the bright window at one side; an orange curved arrow follows the bend. */
  'vliv.vända-sig-mot-ljuset': all(bg('#d9d2c4'), rect(72, 10, 40, 74, SKY, 2, C.ink, 2), line('M92 10 L92 84 M72 46 L112 46', C.ink, 2), sunAt(100, 26, 6), path('M72 30 L36 70 L52 90 L72 66 Z', 'rgba(250,215,90,0.35)', null), rect(4, 98, 112, 6, WOOD, 1, C.ink, 1.4),
    pot(34, 84, 20, 14), path('M34 82 C34 66 42 52 60 44', 'none', STEM, 2.4), leaf(38, 66, 14, 5, -20), leaf(44, 56, 14, 5, -10), leaf(52, 48, 13, 5, -20), leaf(60, 44, 12, 5, -10), path('M20 60 C24 40 40 30 56 28', 'none', HL, 2.2), path('M56 28 L50 24 M56 28 L51 32', 'none', HL, 2.2)),
  /** ljusbrist: in a dark corner of a room a seedling has grown very tall and thin, pale yellow-green and leaning, with tiny leaves; a grey sturdy green plant of the same kind stands beside it. */
  'vliv.ljusbrist': all(bg('#5a5a6a'), rect(4, 98, 112, 14, '#4a4a58', 0, null), pot(36, 92, 18, 14, '#a8805e'), path('M36 90 C36 70 34 50 40 22', 'none', '#d6dc8a', 1.6), leaf(36, 70, 6, 2, -160, '#e2e29a'), leaf(37, 50, 6, 2, -20, '#e2e29a'), leaf(40, 22, 6, 2, -90, '#e2e29a'),
    greyed(all(pot(86, 92, 18, 14), plant(86, 90, 30, LEAF, 4)))),
  /** livsviktig: a plant in the middle whose stem ends in a red heart with a heartbeat line; around it the sun and a water drop are joined to the plant by orange arrows – it cannot live without them. */
  'vliv.livsviktig': all(bg(SKY), ground, sunAt(22, 22, 8), drop(98, 24, 2, WATER), arrow(32, 32, 48, 48, HL, 2.4), arrow(90, 34, 72, 48, HL, 2.4), plant(60, 112, 44, LEAF, 4), at(60, 58, 1.2, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', RED, C.ink, 1.4)), line('M36 58 L48 58 L52 50 L56 66 L60 54 L64 58 L84 58', WHITE, 1.6)),

  // ── 2845 Blomning och fruktsättning ──
  /** blomknopp: a cherry branch with several closed round pink buds on short stalks (ringed); one bud is just starting to show pink petals. */
  'vliv.blomknopp': all(bg(SKY), path('M8 90 C40 80 70 60 112 50', 'none', BARK, 5), ...[[30, 82], [50, 74], [70, 64], [92, 56]].map(([x, y], i) => all(line(`M${x} ${y} L${x! + (i % 2 ? 4 : -2)} ${y! - 12}`, STEM, 1.4), ellipse(x! + (i % 2 ? 4 : -2), y! - 17, 5, 7, i === 3 ? PINK : '#d8b0b8', C.ink, 1.2), path(`M${x! + (i % 2 ? 4 : -2) - 4} ${y! - 13} C${x! + (i % 2 ? 4 : -2) - 2} ${y! - 9} ${x! + (i % 2 ? 4 : -2) + 2} ${y! - 9} ${x! + (i % 2 ? 4 : -2) + 4} ${y! - 13}`, 'none', '#7ab050', 1.6))),
    leaf(40, 78, 10, 3, 60), ring(50, 58, 12, 14), ring(74, 47, 12, 14)),
  /** blomning: a big tree completely covered in pink blossom; under it two people sit on a blanket and look up at it; petals drift in the air. */
  'vliv.blomning': all(bg(SKY), ground, path('M58 112 C58 96 56 82 60 70 M60 80 C50 74 40 70 34 64 M60 76 C70 70 80 68 88 62', 'none', BARK, 5), ...range(22).map((i) => { const R = rng(i + 3); return circle(f1(20 + R() * 80), f1(22 + R() * 46), f1(7 + R() * 5), i % 3 ? PINK : '#f8c6d6', C.ink, 0.6); }),
    ...range(6).map((i) => bloom(26 + i * 14, 30 + (i % 2) * 16, 5, 6, 2, WHITE, PINK, 1.4)), rect(18, 104, 60, 6, '#5a7ad0', 1, C.ink, 1), fig(30, '#e07a30', { h: 0.55 }), fig(52, '#3a8a6a', { h: 0.52, hairStyle: 'long' }),
    ...[[96, 80], [104, 92], [88, 96]].map(([x, y]) => ellipse(x!, y!, 2, 1.2, PINK, null))),
  /** blomningstid: a row of twelve month blocks; above a short run of them in early summer a flowering plant stands and those months are coloured pink and bracketed in orange; the other months are white and the plant is shown as a bare grey stem there. */
  'vliv.blomningstid': all(bg(), months(84, [4, 5], PINK), path('M43 98 L43 102 L68 102 L68 98', 'none', HL, 2.4), stem('M56 82 L56 52', 2), leaf(56, 70, 10, 3.4, -150), leaf(56, 64, 10, 3.4, -30), bloom(56, 46, 6, 12, 3.4, '#e46a9a', YEL, 3), sunAt(56, 18, 6),
    greyed(all(stem('M20 82 L20 66', 1.6), stem('M100 82 L100 66', 1.6), leaf(20, 72, 6, 2, -150), leaf(100, 72, 6, 2, -30))), flake(16, 56), flake(104, 56)),
  /** stå i blom: an apple tree in a garden is covered all over with open white-pink flowers right now; bees fly around it and a person stops to look. */
  'vliv.stå-i-blom': all(bg(SKY), ground, path('M66 112 C66 96 64 84 66 72', 'none', BARK, 6), circle(66, 50, 34, '#7ab85a', C.ink, 1.4), ...range(24).map((i) => { const R = rng(i * 7 + 31); const a = (i / 24) * Math.PI * 2 * 3 + R(), r = 8 + (i % 3) * 9 + R() * 3; return bloom(f1(66 + Math.cos(a) * r), f1(50 + Math.sin(a) * r * 0.9), 5, 5, 1.8, '#fbeef2', '#f6c0d0', 1.2); }), bloom(66, 50, 5, 5, 1.8, '#fbeef2', '#f6c0d0', 1.2),
    fig(20, '#d06a3a', { h: 0.78 }), at(104, 22, 0.8, ellipse(0, 0, 5, 3.6, YEL, C.ink, 0.8), line('M-1 -3.4 L-1 3.4 M2 -3.4 L2 3.4', C.ink, 1))),
  /** överblommad: a flower whose petals have gone brown, hang limp and have fallen on the ground around it, only the green centre left (coloured); a fresh open flower in grey beside it. */
  'vliv.överblommad': all(bg(), ground, path('M40 112 C40 90 42 70 46 56 C48 50 52 50 54 54', 'none', '#8a9a4a', 2), circle(54, 58, 6, '#9ab050', C.ink, 1.2), ...[[-30, 50, 66], [10, 58, 68], [40, 46, 70]].map(([a, x, y]) => rot(x!, y!, a! + 90, 1, path('M0 0 C3 4 3 12 0 16 C-3 12 -3 4 0 0 Z', '#b08a5a', C.ink, 0.9))),
    ...[[20, 108, 20], [64, 110, -30], [76, 108, 60], [30, 110, 80]].map(([x, y, a]) => rot(x!, y!, a!, 1, ellipse(0, 0, 6, 2.6, '#b08a5a', C.ink, 0.8))), leaf(42, 86, 14, 4, -150, '#8aa048'), greyed(all(stem('M94 112 L94 54', 2), bloom(94, 46, 7, 18, 4.6, PINK, YEL, 4)))),
  /** befrukta: a cut-open flower; a pollen grain on the top of the pistil grows a thin tube down into it to an egg cell at the bottom (ringed, with a small spark); a bee flies away above. */
  'vliv.befrukta': all(bg(SKY), ground, stem('M60 112 L60 90', 2.4), path('M44 90 C44 74 50 62 56 58 L64 58 C70 62 76 74 76 90 Z', '#cfe6b0', C.ink, 1.4), path('M56 58 L56 30 C56 26 64 26 64 30 L64 58', '#cfe6b0', C.ink, 1.4), ellipse(60, 28, 7, 3, '#b8d880', C.ink, 1.2),
    path('M36 70 C24 60 22 40 30 30 C38 40 44 56 44 72 Z', PINK, C.ink, 1), path('M84 70 C96 60 98 40 90 30 C82 40 76 56 76 72 Z', PINK, C.ink, 1), circle(60, 24, 3, YEL, C.ink, 1), path('M60 26 C61 40 58 56 60 76', 'none', HL, 1.8), ellipse(60, 80, 5, 4, WHITE, C.ink, 1.2),
    line('M52 74 l-3 -3 M68 74 l3 -3 M60 70 l0 -3', GOLD, 1.4), ring(60, 80, 10), at(98, 16, 0.9, ellipse(0, 0, 6, 4, YEL, C.ink, 0.8), line('M-1 -4 L-1 4 M2 -4 L2 4', C.ink, 1))),
  /** befruktning (hos växter): close-up of a pistil in a flower: one yellow pollen grain at the top has grown a tube down to a white egg cell, and where they meet two small cells join into one (ringed, with a spark). */
  'vliv.befruktning.2': all(bg('#f4eef6'), path('M40 108 C36 86 44 70 52 64 L52 22 C52 16 68 16 68 22 L68 64 C76 70 84 86 80 108 Z', '#d6ecbc', C.ink, 1.6), ellipse(60, 18, 12, 5, '#b8d880', C.ink, 1.4), circle(58, 12, 4, YEL, C.ink, 1.2),
    path('M58 14 C60 30 56 50 60 70 C62 78 60 84 60 86', 'none', HL, 2), ellipse(60, 92, 10, 8, WHITE, C.ink, 1.4), circle(57, 92, 3, '#f2c0d0', C.ink, 1), circle(63, 92, 3, YEL, C.ink, 1), line('M48 82 l-4 -4 M72 82 l4 -4 M60 80 l0 -4', GOLD, 1.6), ring(60, 92, 15, 13)),
  /** fruktsättning: a branch shows the change from flower to fruit: an open white flower, then the same with its petals falling and a tiny green fruit, then a bigger green fruit, then a red apple – linked by orange arrows. */
  'vliv.fruktsättning': all(bg(SKY), path('M4 40 C40 36 80 38 116 34', 'none', BARK, 4), stem('M18 39 L18 50', 1.4), bloom(18, 56, 5, 12, 3.4, '#fbeef2', YEL, 2.4), arrow(28, 56, 36, 56, HL, 2), stem('M46 38 L46 50', 1.4), circle(46, 56, 4, '#9cd060', C.ink, 1), ellipse(40, 66, 3, 1.4, '#fbeef2', C.ink, 0.6), ellipse(52, 70, 3, 1.4, '#fbeef2', C.ink, 0.6),
    arrow(54, 56, 62, 56, HL, 2), stem('M72 38 L72 48', 1.4), circle(72, 56, 7, '#9cd060', C.ink, 1.2), arrow(81, 56, 89, 56, HL, 2), stem('M102 36 L102 46', 1.4), path('M92 58 C92 46 112 46 112 58 C112 70 92 70 92 58 Z', RED, C.ink, 1.4), leaf(102, 44, 8, 3, -30), ground, ring(72, 56, 12)),
  /** fruktkött: a plum cut in half – the thick juicy yellow-orange flesh is coloured and ringed, the stone in the middle is pale grey; the other half with its purple skin lies beside it. */
  'vliv.fruktkött': all(bg(), ground, ellipse(46, 72, 30, 28, '#5a2a6a', C.ink, 2), ellipse(46, 72, 26, 24, '#f2b84a', null), ellipse(46, 72, 9, 12, '#d6cfc4', C.ink, 1.2), ring(46, 72, 34, 32), ellipse(98, 88, 16, 15, '#6a3a7a', C.ink, 1.6), path('M98 74 C96 70 98 66 100 64', 'none', BARK, 1.6), drop(78, 50, 0.8, '#f8d070')),
  /** stenfrukt: two red cherries on joined stalks, one cut open to show the single hard pale stone in the middle (ringed); beside them a halved plum also with one stone. */
  'vliv.stenfrukt': all(bg(), ground, path('M40 22 C38 36 32 50 30 60 M40 22 C46 36 54 50 58 62', 'none', STEM, 1.8), leaf(40, 22, 14, 4, -40), circle(30, 70, 12, CHERRY, C.ink, 1.6), circle(58, 72, 13, CHERRY, C.ink, 1.6), circle(58, 72, 10, '#e8506a', null), ellipse(58, 72, 5, 6, '#efe2c8', C.ink, 1.4), ring(58, 72, 9),
    ellipse(94, 92, 16, 14, '#5a2a6a', C.ink, 1.6), ellipse(94, 92, 13, 11, '#f2b84a', null), ellipse(94, 92, 5, 7, '#efe2c8', C.ink, 1.2), ring(94, 92, 9, 10)),
  /** frökapsel: a dry brown poppy seed head on a stem, with a little crown on top and a ring of small holes; tiny black seeds pour out as the wind shakes it; the capsule is ringed. */
  'vliv.frökapsel': all(bg(SKY), ground, line('M14 30 L30 30 M10 40 L26 40', C.grey, 2), stem('M60 112 C60 90 58 70 60 56', 2, '#a89a5a'), path('M46 44 C46 30 74 30 74 44 C74 56 66 60 60 60 C54 60 46 56 46 44 Z', '#b89a5a', C.ink, 1.6), path('M46 34 L50 28 L55 33 L60 27 L65 33 L70 28 L74 34 C70 36 50 36 46 34 Z', '#8a7040', C.ink, 1.2),
    ...range(5).map((i) => circle(50 + i * 5, 38, 1.2, '#4a3a20', null)), ...range(14).map((i) => { const R = rng(i + 70); return circle(f1(76 + R() * 24), f1(40 + R() * 40), 1, C.ink, null); }), ring(60, 44, 20, 20)),
  /** balja (på ärtor): an opened green pea pod held in two fingers shows a row of round green peas lying inside; a closed pod hangs on the plant beside it. */
  'vliv.balja.2': all(bg(), ground, path('M14 60 C30 76 86 80 104 58 C90 90 30 92 14 60 Z', '#7ab84a', C.ink, 1.6), path('M16 60 C34 68 84 70 102 58 C86 76 34 78 16 60 Z', '#c8e6a0', C.ink, 1), ...range(6).map((i) => circle(30 + i * 11, 70 - Math.abs(i - 2.5) * 0.8, 5, '#5aa83a', C.ink, 1)),
    stem('M100 10 C96 20 98 30 96 36', 1.6), path('M96 36 C92 40 90 48 92 54 C96 50 100 42 98 34 Z', '#7ab84a', C.ink, 1.2), leaf(98, 22, 10, 4, -20)),

  // ── 2846 Växters fortplantning ──
  /** förökning: one plant at the left; orange arrows branch out from it to several identical new small plants – one plant becomes many. */
  'vliv.förökning': all(bg(SKY), soil(96), plant(22, 96, 44, LEAF, 4), arrow(34, 60, 54, 44, HL, 2.2), arrow(36, 70, 56, 70, HL, 2.2), arrow(34, 80, 54, 94, HL, 2.2),
    ...[[74, 46], [96, 46], [74, 76], [96, 76], [74, 104], [96, 104]].map(([x, y]) => all(stem(`M${x} ${y} L${x} ${y! - 16}`, 1.4), leaf(x!, y! - 8, 7, 2.4, -150), leaf(x!, y! - 10, 7, 2.4, -30), leaf(x!, y! - 16, 6, 2.2, -90)))),
  /** ettårig: one round orange arc for one single year – along it a seed, a young plant, a flowering plant, a plant with seeds and a dead brown plant; the sun above marks one summer. */
  'vliv.ettårig': all(bg(), ground, sunAt(60, 18, 7), path('M12 100 C20 40 100 40 108 100', 'none', HL, 2.4), path('M108 100 L103 95 M108 100 L110 93', 'none', HL, 2.4), bean(12, 106, 0.6), seedling(32, 70, 0.8, false),
    at(60, 56, 0.9, stem('M0 0 L0 -20', 1.4), leaf(0, -8, 8, 2.4, -150), leaf(0, -8, 8, 2.4, -30), bloom(0, -22, 5, 8, 2.4, '#e46a9a', YEL, 2)), at(86, 70, 0.9, stem('M0 0 L0 -18', 1.4), circle(0, -20, 3.4, '#c8a04a', C.ink, 1), dots(-4, -16, 8, 8, 4, C.ink, 4, 0.6)), at(108, 92, 0.8, path('M0 0 C0 -6 -4 -10 -8 -12 M0 -4 C3 -8 6 -9 8 -10', 'none', '#9a7a4a', 1.4))),
  /** flerårig: the same plant over three summers side by side (a small sun above each, dashed lines between the years), each year green with flowers; under the ground the same root lives on in all three, joined by an orange dashed line. */
  'vliv.flerårig': all(bg(SKY), soil(80), ...[22, 60, 98].map((x, i) => all(stem(`M${x} 80 L${x} ${52 - i * 6}`, 1.8), leaf(x, 70, 10, 3, -150), leaf(x, 66, 10, 3, -30), bloom(x, 48 - i * 6, 6, 10, 3, '#8a6ad8', YEL, 2.4), ellipse(x, 90, 8, 5, '#b88a58', C.ink, 1.2), path(`M${x} 95 l-4 8 M${x} 95 l4 8`, 'none', ROOT, 1.2))),
    line('M30 90 L52 90 M68 90 L90 90', HL, 2.2, '3 2'), ...[22, 60, 98].map((x) => sunAt(x, 16, 4)), line('M41 8 L41 30 M79 8 L79 30', C.grey, 1.4, '2 2')),
  /** fröspridning: a plant in the middle sends its seeds away in different ways – winged seeds blow off with the wind, a bird flies away with a berry, and a hooked seed sticks to a passing hare's fur; dotted orange paths lead away. */
  'vliv.fröspridning': all(bg(SKY), ground, plant(56, 112, 50, LEAF, 4), circle(52, 66, 3, CHERRY, C.ink, 0.8), circle(62, 72, 3, CHERRY, C.ink, 0.8), line('M14 20 L34 20 M10 30 L28 30', C.grey, 2),
    ...[[80, 30, 20], [96, 22, -20], [104, 40, 30]].map(([x, y, a]) => rot(x!, y!, a!, 1, ellipse(0, 0, 6, 2, '#c8a46a', C.ink, 0.8), circle(-6, 0, 1.6, SEED2, null))), line('M60 60 C70 44 80 34 88 30', HL, 1.4, '2 2.4'),
    at(24, 52, 1, path('M-8 0 C-4 -6 6 -6 8 0 C4 2 -4 2 -8 0 Z', '#7a6a5a', C.ink, 1), path('M-2 -2 C-6 -10 -12 -8 -14 -4', 'none', C.ink, 1.4), path('M2 -2 C6 -10 12 -8 14 -4', 'none', C.ink, 1.4), circle(8, 2, 2, CHERRY, C.ink, 0.6)), line('M52 64 C44 60 34 56 30 54', HL, 1.4, '2 2.4'),
    at(90, 100, 1, ellipse(0, 0, 12, 7, '#c8a47a', C.ink, 1.2), circle(-12, -5, 5, '#c8a47a', C.ink, 1.2), path('M-14 -10 L-16 -20 L-12 -11 M-11 -10 L-10 -20 L-9 -10', '#c8a47a', C.ink, 1), circle(4, -6, 2.4, '#7a5a3a', C.ink, 0.8), line('M4 -9 l-1 -2 M6 -8 l2 -1', C.ink, 0.6)), line('M62 90 C70 92 80 94 88 94', HL, 1.4, '2 2.4')),
  /** maskrosboll: a round white dandelion seed head on a tall stem; a child blows on it and the small seeds with white parachutes fly away in the wind. */
  'vliv.maskrosboll': all(bg(SKY), ground, fig(26, '#e0b030', { h: 0.8, hairStyle: 'long' }), arm(34, 64, 50, 54), stem('M50 56 L54 36', 1.6), circle(56, 30, 13, 'rgba(255,255,255,0.85)', '#c8ced4', 1), ...range(18).map((i) => { const a = (i / 18) * Math.PI * 2; return line(`M56 30 L${f1(56 + Math.cos(a) * 13)} ${f1(30 + Math.sin(a) * 13)}`, '#dfe3e6', 0.6); }), circle(56, 30, 2.6, '#c8b07a', null),
    ...[[78, 24], [90, 34], [98, 18], [106, 40], [84, 46]].map(([x, y]) => all(line(`M${x} ${y} L${x! - 3} ${y! + 6}`, '#b8a070', 0.8), path(`M${x! - 4} ${y} C${x! - 2} ${y! - 4} ${x! + 2} ${y! - 4} ${x! + 4} ${y}`, 'none', '#c8ced4', 1))), line('M34 36 C40 34 44 32 46 30', '#b8c4cc', 1.2)),
  /** kardborre: a tall burdock plant with big leaves and round prickly burrs covered in small hooks (ringed); a dog beside it has several burrs caught in its fur. */
  'vliv.kardborre': all(bg(SKY), ground, stem('M34 112 L34 30', 2.4), leaf(34, 100, 26, 10, -160), leaf(34, 96, 24, 9, -20), ...[[24, 34], [40, 26], [44, 44], [26, 50]].map(([x, y]) => all(circle(x!, y!, 6, '#8a6a7a', C.ink, 1), ...range(10).map((i) => { const a = (i / 10) * Math.PI * 2; return line(`M${f1(x! + Math.cos(a) * 6)} ${f1(y! + Math.sin(a) * 6)} l${f1(Math.cos(a) * 3)} ${f1(Math.sin(a) * 3)}`, C.ink, 0.6); }), circle(x!, y! - 4, 2, '#c05a9a', null))), ring(34, 38, 18),
    at(86, 112, 1, path('M-16 0 L-14 -18 C-12 -24 12 -22 14 -14 L16 0 Z', '#d4a373', C.ink, 1.4), circle(-16, -26, 8, '#d4a373', C.ink, 1.4), path('M-24 -30 C-28 -24 -26 -18 -22 -20 Z', '#a0673d', C.ink, 1), circle(-18, -27, 1.1, C.ink, null), path('M14 -14 C22 -18 24 -26 20 -30', 'none', '#d4a373', 3)), ...[[80, 96], [92, 102], [96, 92]].map(([x, y]) => all(circle(x!, y!, 3.4, '#8a6a7a', C.ink, 0.8), line(`M${x! - 4} ${y} l-2 0 M${x! + 4} ${y} l2 0 M${x} ${y! - 4} l0 -2`, C.ink, 0.5)))),
  /** självså sig: one flowering plant in the middle drops its seeds (dotted orange curves); around it on the ground many small new plants of the same kind have come up by themselves – no person, no seed bag. */
  'vliv.självså-sig': all(bg(SKY), soil(96), stem('M60 96 L60 40', 2), leaf(60, 80, 14, 4, -150), leaf(60, 72, 14, 4, -30), bloom(60, 34, 12, 14, 2.4, '#f08a2c', '#a0501a', 4), bloom(48, 52, 10, 8, 2, '#f08a2c', '#a0501a', 2.4),
    ...[[22, 'M54 40 C40 40 28 60 22 90'], [40, 'M52 50 C44 60 42 76 40 90'], [82, 'M66 40 C78 46 82 70 82 90'], [102, 'M68 36 C88 38 98 64 102 90']].map(([x, d]) => all(line(d as string, HL, 1.4, '2 2.4'), seedling(x as number, 96, 0.7, false, '#9cd060')))),
  /** stickling: a short piece of a green plant, cut off with scissors from a potted mother plant, stands in a glass of water and has grown new white roots in the water (ringed). */
  'vliv.stickling': all(bg(), rect(4, 96, 112, 16, WOOD, 0, C.ink, 1), pot(28, 80, 22, 16), plant(28, 78, 40, '#4fa048', 5), at(44, 46, 1, path('M0 0 L10 -6 M0 0 L10 6', 'none', C.grey, 2), circle(-4, -3, 3, 'none', C.dark, 1.4), circle(-4, 3, 3, 'none', C.dark, 1.4)),
    path('M66 50 L68 96 L96 96 L98 50 Z', GLASS, C.ink, 1.6), rect(68, 62, 29, 34, 'rgba(159,208,236,0.55)', 0, null), stem('M82 90 L82 36', 2), leaf(82, 46, 12, 4, -150, '#4fa048'), leaf(82, 40, 12, 4, -30, '#4fa048'), leaf(82, 36, 10, 3.6, -90, '#4fa048'),
    ...[-40, -10, 20, 50].map((a) => rot(82, 90, a + 90, 1, path('M0 0 C2 2 4 2 6 4', 'none', ROOT, 1.4))), ring(82, 90, 12, 8)),
  /** rotskott: a cut through the soil shows a tree whose long root runs sideways under the ground; at several points along it new small shoots come up through the surface some way from the tree, coloured and ringed. */
  'vliv.rotskott': all(bg(SKY), soil(80), path('M22 80 L24 30 L30 30 L32 80 Z', BARK, C.ink, 1.2), circle(27, 24, 18, LEAF, C.ink, 1.4), path('M27 84 C50 90 76 88 112 92', 'none', C.ink, 4), path('M27 84 C50 90 76 88 112 92', 'none', ROOT, 2.6),
    ...[60, 86, 106].map((x) => all(line(`M${x} 89 L${x} 66`, '#7ab050', 2), leaf(x, 70, 8, 3, -150), leaf(x, 68, 8, 3, -30), leaf(x, 66, 7, 2.6, -90))), ring(84, 78, 30, 16)),
  /** jordstam: a cut through the soil shows a knobbly, horizontal stem lying under the ground (like ginger), coloured; from it shoots go up into the air and small roots go down at regular gaps. */
  'vliv.jordstam': all(bg(SKY), soil(52), path('M12 76 C20 70 30 72 38 76 C46 80 54 70 64 74 C74 78 84 70 96 74 C104 76 110 72 112 74 L112 84 C104 84 98 88 90 84 C80 80 72 88 62 84 C52 80 44 90 34 86 C26 82 18 86 12 84 Z', '#d8b46a', C.ink, 1.4),
    ...[24, 54, 86].map((x) => all(line(`M${x} 74 L${x} 26`, STEM, 2), leaf(x, 44, 12, 4, -150), leaf(x, 38, 12, 4, -30), leaf(x, 26, 10, 3.4, -90), path(`M${x} 84 l-4 12 M${x} 84 l3 14 M${x + 4} 84 l6 10`, 'none', ROOT, 1.2))), ring(62, 79, 54, 14)),
  /** blomlök: a cut through the soil shows a round, papery onion-like bulb with roots underneath (ringed); out of it grows a tulip that flowers above ground. */
  'vliv.blomlök': all(bg(SKY), soil(70), blub(60, 88, 1.6), path('M60 70 L60 69', 'none', STEM, 2), tulip(60, 70, 1.3), ring(60, 90, 20, 22)),
  /** knöl: a potato plant above the ground; in the soil below hang several round potatoes on thin stalks; one is ringed and has small eyes from which tiny shoots grow. */
  'vliv.knöl': all(bg(SKY), soil(56), stem('M60 56 L60 22', 2), ...[[-150, 48], [-30, 44], [-150, 34], [-30, 30]].map(([a, y]) => leaf(60, y!, 14, 5, a!)), bloom(60, 18, 5, 8, 2.6, WHITE, YEL, 2),
    path('M60 56 C54 66 40 72 32 80 M60 56 C64 70 72 78 84 82 M60 56 C60 70 58 84 60 96', 'none', ROOT, 1.4), potato(32, 84, 1.2, -20), potato(86, 86, 1.2, 15), potato(60, 100, 1.4), line('M66 96 l3 -4 M54 98 l-3 -4', '#a8d070', 1.4), ring(60, 100, 20, 12)),
  /** moderplanta: a big strawberry plant (coloured and ringed) sends out long runners along the ground; at their ends small new young plants have rooted, drawn paler. */
  'vliv.moderplanta': all(bg(SKY), soil(94), ...[-150, -110, -70, -30].map((a) => leaf(40, 94, 20, 8, a, LEAF)), circle(32, 82, 4, CHERRY, C.ink, 1), bloom(48, 74, 5, 6, 2, WHITE, YEL, 1.4), ring(40, 82, 26, 20),
    path('M52 94 C64 88 74 88 82 94', 'none', '#b07050', 1.6), path('M52 94 C70 84 92 84 106 94', 'none', '#b07050', 1.6), ...[82, 106].map((x) => all(leaf(x, 94, 9, 3.6, -130, PALEGREEN), leaf(x, 94, 9, 3.6, -50, PALEGREEN), line(`M${x} 94 l-2 6 M${x} 94 l2 6`, ROOT, 1)))),

  // ── 2847 Anpassning till miljön ──
  /** växtplats: one plant in its spot – a fern-like plant in damp shade at the foot of a tree by a brook; small signs around it (a sun half in shadow, a water drop, a handful of dark soil) are linked to the spot by an orange dashed ring. */
  'vliv.växtplats': all(bg(SKY), ground, path('M4 104 C30 100 60 108 116 102 L116 112 L4 112 Z', WATER, C.ink, 1), path('M80 104 L82 40 L90 40 L92 104 Z', BARK, C.ink, 1.2), circle(86, 32, 26, '#58a046', C.ink, 1.4),
    ...[-160, -130, -100, -70, -40].map((a) => rot(50, 100, a, 1, path('M0 0 C8 -3 18 -3 26 0 C18 3 8 3 0 0 Z', LEAF, C.ink, 0.8), ...range(5).map((i) => line(`M${4 + i * 4} 0 l2 -3 M${4 + i * 4} 0 l2 3`, LEAF2, 0.6)))),
    ellipse(50, 88, 34, 22, 'none', HL, 2), path('M12 22 C12 14 20 10 26 14 L26 30 Z', YEL, C.ink, 1), path('M26 14 C32 18 32 26 26 30 Z', C.grey, C.ink, 1), drop(14, 48, 1.4, WATER), ellipse(30, 60, 8, 4, SOIL2, C.ink, 1)),
  /** suckulent: a pot with a fat, fleshy plant – a rosette of thick, plump bluish-green leaves; one leaf is shown cut through, full of water drops (ringed). */
  'vliv.suckulent': all(bg('#f3ead8'), ground, pot(60, 90, 40, 22), ...[-170, -140, -110, -70, -40, -10].map((a) => rot(60, 88, a, 1, path('M0 -5 C10 -8 22 -6 28 0 C22 6 10 8 0 5 Z', '#8ab89a', C.ink, 1.2))), ...[-130, -90, -50].map((a) => rot(60, 86, a, 1, path('M0 -4 C8 -6 16 -4 20 0 C16 4 8 6 0 4 Z', '#9cc8a8', C.ink, 1))),
    rot(96, 40, 20, 1, path('M-14 -7 C0 -11 14 -8 18 0 C14 8 0 11 -14 7 Z', '#d8f0dc', C.ink, 1.4), drop(-6, 0, 0.8, WATER), drop(2, -2, 0.8, WATER), drop(9, 1, 0.8, WATER)), line('M82 56 L72 70', HL, 1.6, '2 2'), ring(96, 40, 22, 14)),
  /** vaxskikt: a big shiny leaf with a glossy highlight; raindrops land on it, stay round as beads and roll off its edge instead of soaking in; its shiny surface is ringed. */
  'vliv.vaxskikt': all(bg(SKY), ground, rot(56, 66, -15, 1, path('M-40 0 C-24 -28 30 -30 46 0 C30 30 -24 28 -40 0 Z', '#3f9a4f', C.ink, 1.6), path('M-30 -8 C-16 -20 16 -22 30 -10', 'none', 'rgba(255,255,255,0.7)', 4), line('M-38 0 L42 0', LEAF2, 1)),
    ...[[40, 56], [60, 48], [74, 62], [52, 72]].map(([x, y]) => all(circle(x!, y!, 3.4, 'rgba(190,230,250,0.9)', WATER2, 1), circle(x! - 1, y! - 1, 1, WHITE, null))), ...[[98, 74], [102, 88], [104, 102]].map(([x, y]) => drop(x!, y!, 0.9, WATER)), ...range(6).map((i) => line(`M${20 + i * 14} 12 l-2 6`, WATER2, 1.4)), ring(56, 62, 46, 26)),
  /** skuggtålig: in deep shade under a big tree a broad-leaved plant grows green and fresh (coloured); beside it in the same shade a grey sun plant hangs limp. */
  'vliv.skuggtålig': all(bg('#b8c8b0'), rect(4, 4, 112, 40, '#4f8a3f', 0, null), path('M4 44 C20 54 40 50 60 56 C80 50 100 54 116 44 Z', '#4f8a3f', null), line('M100 4 L100 112', BARK, 8), ground,
    ...[-150, -120, -60, -30].map((a) => leaf(40, 112, 30, 12, a, '#2f8a3f')), leaf(40, 112, 26, 10, -90, '#2f8a3f'), greyed(all(path('M80 112 C80 96 82 88 76 80', 'none', STEM, 1.6), leaf(78, 96, 10, 3, 140, YELLOWLEAF), leaf(80, 102, 10, 3, 40, YELLOWLEAF), path('M76 80 C72 82 70 86 72 90', 'none', '#e0c040', 3)))),
  /** ljuskrävande: on an open sunny spot under a strong sun a plant stands tall, green and flowering (coloured); a grey copy of it in the shadow of a wall is thin and weak. */
  'vliv.ljuskrävande': all(bg(SKY), sunAt(30, 20, 9), ground, line('M40 30 L48 46 M22 34 L18 50', GOLD, 1.6), plant(34, 112, 56, LEAF, 5), bloom(34, 52, 6, 10, 3, YEL, GOLD, 2.4),
    rect(74, 30, 42, 82, '#9a9aa4', 0, null), greyed(all(path('M90 112 C90 96 92 86 88 76', 'none', STEM, 1.2), leaf(90, 96, 7, 2, -150), leaf(90, 90, 7, 2, -30)))),
  /** salttålig: at a sea shore with waves and white salt crystals on the stones, a fleshy-leaved beach plant grows healthy and green (coloured); a grey ordinary plant beside it has wilted. */
  'vliv.salttålig': all(bg(SKY), path('M4 60 C20 56 30 64 46 60 C62 56 72 64 88 60 C100 56 110 62 116 60 L116 80 L4 80 Z', WATER2, C.ink, 1), path('M4 66 C16 62 26 70 40 66 C54 62 64 70 78 66', 'none', WHITE, 1.4), rect(4, 80, 112, 32, '#e8d8b0', 0, null), ground,
    ...[[16, 96], [100, 100], [70, 104]].map(([x, y]) => all(ellipse(x!, y!, 9, 5, STONE, C.ink, 1), rect(x! - 3, y! - 5, 2.4, 2.4, WHITE, 0, C.grey, 0.5), rect(x! + 1, y! - 6, 2, 2, WHITE, 0, C.grey, 0.5))),
    stem('M42 112 L42 70', 2.4), ...[[-160, 106], [-20, 102], [-150, 94], [-30, 90], [-140, 82], [-40, 78], [-90, 70]].map(([a, y]) => rot(42, y!, a!, 1, ellipse(10, 0, 10, 4.6, '#6aa88a', C.ink, 1))), greyed(all(path('M86 112 C86 100 88 94 82 88', 'none', STEM, 1.4), leaf(86, 104, 10, 3, 140, YELLOWLEAF), leaf(86, 100, 10, 3, 30, YELLOWLEAF)))),
  /** vattenväxt: a cut through a pond: plants grow in the water – long soft stems rise from the muddy bottom, some leaves under water, a few reaching the surface; a fish swims between them. */
  'vliv.vattenväxt': all(bg(SKY), rect(4, 40, 112, 60, 'rgba(120,190,230,0.6)', 0, null), line('M4 40 L116 40', WATER2, 1.6), rect(4, 100, 112, 12, SOIL2, 0, null),
    ...[24, 50, 78, 100].map((x, i) => all(path(`M${x} 100 C${x - 6} 84 ${x + 6} 66 ${x} ${i % 2 ? 40 : 52}`, 'none', '#3f8a3a', 1.8), ...range(4).map((j) => leaf(x + (j % 2 ? 1 : -1), 92 - j * 11, 9, 2.4, j % 2 ? -30 : -150, '#4fa04a')))), ellipse(78, 40, 10, 2.4, '#5aa84a', C.ink, 1),
    at(62, 74, 1, path('M-8 0 C-4 -5 4 -5 8 0 C4 5 -4 5 -8 0 Z M8 0 L13 -4 L13 4 Z', '#f08a2c', C.ink, 1), circle(-4, -1, 0.8, C.ink, null))),
  /** flytblad: a water-lily pond: big round leaves with a notch lie flat on the water surface (ringed), on long stalks going down to the bottom; a frog sits on one and a white flower floats beside them. */
  'vliv.flytblad': all(bg(SKY), rect(4, 52, 112, 60, 'rgba(120,190,230,0.6)', 0, null), line('M4 52 L116 52', WATER2, 1.6), ...[[30, 52], [74, 54]].map(([x, y]) => all(line(`M${x} ${y} C${x! - 6} 80 ${x! + 6} 96 ${x} 112`, '#3f8a3a', 1.6), path(`M${x! - 18} ${y} C${x! - 18} ${y! - 8} ${x! + 18} ${y! - 8} ${x! + 18} ${y} C${x! + 18} ${y! + 6} ${x! + 4} ${y! + 6} ${x} ${y} L${x! - 6} ${y! + 4} C${x! - 14} ${y! + 4} ${x! - 18} ${y! + 2} ${x! - 18} ${y} Z`, '#5aa84a', C.ink, 1.2))),
    bloom(100, 48, 8, 12, 3, WHITE, YEL, 2.6), at(74, 44, 1, ellipse(0, 0, 7, 5, '#7ac04a', C.ink, 1), circle(-3, -4, 2, '#7ac04a', C.ink, 0.8), circle(3, -4, 2, '#7ac04a', C.ink, 0.8), circle(-3, -4.4, 0.8, C.ink, null), circle(3, -4.4, 0.8, C.ink, null)), ring(52, 50, 44, 12)),
  /** klätterväxt: a green climbing plant with many leaves grows up a brick wall and a wooden trellis from a small root at the bottom, reaching almost to the top; an orange arrow shows its way upwards. */
  'vliv.klätterväxt': all(bg(SKY), rect(10, 10, 100, 102, '#c87a5a', 0, C.ink, 1.4), ...range(10).map((r) => line(`M10 ${20 + r * 10} L110 ${20 + r * 10}`, '#a85a3a', 0.8)), ...range(10).map((r) => all(...range(5).map((c) => line(`M${10 + c * 20 + (r % 2) * 10} ${10 + r * 10} l0 10`, '#a85a3a', 0.8)))), ground,
    path('M40 112 C30 96 52 84 42 70 C32 56 56 46 48 30 C44 22 52 16 58 14', 'none', STEM, 2.4), ...[[38, 100, -150], [44, 90, -20], [40, 78, -160], [44, 64, -30], [40, 50, -150], [50, 38, -20], [48, 26, -150], [56, 18, -40]].map(([x, y, a]) => leaf(x!, y!, 12, 5, a!, '#3f9a4f')), arrow(76, 100, 76, 26, HL, 2.6)),
  /** luftrot: an orchid with pink flowers in a pot; several thick silver-green roots grow out of the stem into the air above the pot instead of into the soil, ringed. */
  'vliv.luftrot': all(bg('#f3ead8'), ground, pot(52, 92, 30, 20, '#d8dcd8'), ...[-160, -20].map((a) => leaf(52, 88, 24, 8, a, '#3f8a4a')), path('M52 86 C52 60 66 40 84 34', 'none', '#6a8a4a', 1.6), ...[[70, 46], [80, 36], [92, 36]].map(([x, y]) => bloom(x!, y!, 5, 10, 3.4, '#e86aa8', '#f6e06a', 2.2)),
    ...[['M48 86 C40 78 30 80 22 74'], ['M54 86 C58 76 66 74 72 66'], ['M50 86 C44 70 36 64 34 56']].map(([d]) => all(line(d!, C.ink, 4), line(d!, '#cfdccf', 2.6))), ring(42, 72, 24, 18)),
};
