/**
 * Natur & geografi → Växter & svampar → Blommor & örter, 2811–2817 (0.45): wild spring flowers, summer flowers,
 * the parts of a flower, pollination, medicinal plants and herbs, poisonous plants and plant identification.
 * Recurring signs: each species is drawn from the side with the features a field guide would name (number and
 * colour of petals, leaf shape, how the flowers sit); the flower diagram is a cut-away flower whose named part is
 * coloured and ringed in orange while the rest is pale; pollen is small yellow dots, a pollinator's path a dotted
 * line with an arrow; danger is a red-bordered triangle with "!"; abstract words are small symbolic scenes where the
 * coloured idea dominates and a grey copy stands beside it as contrast. No words, no brands and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL, arm } from './people';
import { P, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const PAPER = '#f6f2ea';
const SKY = '#dcedf6';
const MEADOW = '#a9d47f';
const GRASS = '#8cc96a';
const GRASS2 = '#5e9e45';
const STEM = '#4f8f3a';
const LEAF = '#62ad4f';
const LEAF2 = '#3d7f33';
const SAGE = '#9db59a';
const BARK = '#7a5a40';
const WATER = '#9fd0ec';
const WATER2 = '#3f86c0';
const WHITE = '#fbfbf8';
const YEL = '#f6d03c';
const GOLD = '#e6a817';
const BLUE = '#5a7fe0';
const SKYBLUE = '#3f8fe8';
const VIOLET = '#8a5cc8';
const LILAC = '#b48ae0';
const PINK = '#ef8fb5';
const MAGENTA = '#d0559a';
const RED = '#d93a3a';
const ORANGE = '#f08a2c';
const PALE = '#e6e1d8';
const PALE2 = '#cfc9be';
const WOOD = '#b98a5a';
const GLASS = '#dff1f8';
const POLLEN = '#f2b81e';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (x: number, y: number, r: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${r}) scale(${s})`, ...k);
const bg = (col: string = PAPER) => rect(4, 4, 112, 108, col, 3, null);
const ground = line('M4 112 L116 112', C.grey2, 2);
const lawn = (y = 100, col: string = GRASS) => all(rect(4, y, 112, 112 - y, col, 0, null), line(`M4 ${y} L116 ${y}`, GRASS2, 1));
const ring = (x: number, y: number, rx: number, ry = rx) => ellipse(x, y, rx, ry, 'none', HL, 2.4);
const rng = (seed: number) => { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; };
const warn = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -11 L11 8 L-11 8 Z', '#ffe08a', RED, 2.4), line('M0 -4 L0 2', C.ink, 2.2), circle(0, 5, 1.2, C.ink, null));
const check = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s, circle(0, 0, 8, WHITE, col, 2), line('M-4 0 L-1 3.5 L4.5 -3.5', col, 2.4));
const cross = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 8, WHITE, RED, 2), line('M-3.5 -3.5 L3.5 3.5 M3.5 -3.5 L-3.5 3.5', RED, 2.4));
const qmark = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 8, WHITE, C.navy, 1.6), path('M-3 -2.5 C-3 -7 3 -7 3 -3 C3 -0.5 0 0 0 2.5', 'none', C.navy, 2), circle(0, 5.2, 1.2, C.navy, null));
const sunAt = (x: number, y: number, r = 7) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 5))} ${f1(y + Math.sin(a) * (r + 5))}`, GOLD, 1.6); }), circle(x, y, r, YEL, GOLD, 1.4));
const moon = (x: number, y: number, s = 1) => at(x, y, s, path('M2 -8 C-8 -8 -8 8 2 8 C-3 4 -3 -4 2 -8 Z', '#f6e7a0', C.ink, 1));
const steam = (x: number, y: number) => line(`M${x - 4} ${y} q-3 -4 0 -8 q3 -4 0 -8 M${x + 3} ${y} q-3 -4 0 -8 q3 -4 0 -8`, '#9aa3ad', 1.4);

// ── Plant parts ──────────────────────────────────────────────────────
/** A leaf from (x,y) pointing at angle a (degrees, 0 = right, -90 = up). */
const leaf = (x: number, y: number, len: number, w: number, a: number, col: string = LEAF, vein = true) => rot(x, y, a, 1,
  path(`M0 0 C${f1(len * 0.3)} ${-w} ${f1(len * 0.75)} ${-w} ${len} 0 C${f1(len * 0.75)} ${w} ${f1(len * 0.3)} ${w} 0 0 Z`, col, C.ink, 0.8), vein ? line(`M1 0 L${f1(len * 0.85)} 0`, LEAF2, 0.6) : '');
/** Toothed (serrated) leaf. */
const toothLeaf = (x: number, y: number, len: number, w: number, a: number, col: string = LEAF, teeth = 6) => {
  const top = range(teeth).map((i) => { const t = (i + 0.5) / teeth, tt = (i + 1) / teeth; const yy = (u: number) => -w * Math.sin(Math.PI * u) * 1.05; return `L${f1(len * t)} ${f1(yy(t) - 1.6)} L${f1(len * tt)} ${f1(yy(tt))}`; }).join(' ');
  const bot = range(teeth).map((i) => { const t = 1 - (i + 0.5) / teeth, tt = 1 - (i + 1) / teeth; const yy = (u: number) => w * Math.sin(Math.PI * u) * 1.05; return `L${f1(len * t)} ${f1(yy(t) + 1.6)} L${f1(len * tt)} ${f1(yy(tt))}`; }).join(' ');
  return rot(x, y, a, 1, path(`M0 0 ${top} ${bot} Z`, col, C.ink, 0.8), line(`M1 0 L${f1(len * 0.85)} 0`, LEAF2, 0.6));
};
/** Narrow grass blade from the ground. */
const blade = (x: number, y: number, h: number, lean = 2, col: string = GRASS2) => path(`M${x - 1.2} ${y} Q${x + lean * 0.4} ${y - h * 0.6} ${x + lean} ${y - h} Q${x + lean * 0.2} ${y - h * 0.5} ${x + 1.2} ${y} Z`, col, null);
const tuft = (x: number, y: number, h = 8) => all(blade(x - 3, y, h * 0.8, -3), blade(x, y, h, 1), blade(x + 3, y, h * 0.7, 3));
/** Flower seen from the front: n petals of radius r (length) and width pw, a centre disc. */
const bloom = (x: number, y: number, n: number, r: number, pw: number, col: string, mid: string = YEL, midR = r * 0.32, off = 0, sw = 0.8) => all(
  ...range(n).map((i) => rot(x, y, off + (i * 360) / n, 1, ellipse(0, f1(-r * 0.55), pw, f1(r * 0.55), col, C.ink, sw))), circle(x, y, f1(midR), mid, C.ink, sw));
/** Flower seen from the side as a cup (tulip-like), opening upwards. */
const cup = (x: number, y: number, w: number, h: number, col: string, n = 3) => all(
  ...range(n).map((i) => { const dx = (i - (n - 1) / 2) * (w / n); return path(`M${f1(x + dx - w / n / 1.4)} ${f1(y - h * 0.9)} Q${f1(x + dx)} ${f1(y - h * 1.15)} ${f1(x + dx + w / n / 1.4)} ${f1(y - h * 0.9)} Q${f1(x + dx + w / n / 1.5)} ${y} ${f1(x + dx)} ${y} Q${f1(x + dx - w / n / 1.5)} ${y} ${f1(x + dx - w / n / 1.4)} ${f1(y - h * 0.9)} Z`, col, C.ink, 0.8); }));
/** A hanging bell, mouth down, hanging from (x,y). */
const bell = (x: number, y: number, s: number, col: string, a = 0) => rot(x, y, a, s, path('M0 0 C-4 0 -5 4 -5 8 L-6 11 C-3 10 3 10 6 11 L5 8 C5 4 4 0 0 0 Z', col, C.ink, 0.9), line('M-3 11 L-3.6 12.4 M0 10.5 L0 12 M3 11 L3.6 12.4', C.ink, 0.6));
const stem = (d: string, w = 1.8, col: string = STEM) => line(d, col, w);
const dots = (x: number, y: number, w: number, h: number, n: number, col: string, seed: number, r = 0.8) => { const R = rng(seed); return all(...range(n).map(() => circle(f1(x + R() * w), f1(y + R() * h), r, col, null))); };
/** Pollen grains. */
const pollen = (x: number, y: number, n: number, spread: number, seed: number, r = 1) => dots(x - spread / 2, y - spread / 2, spread, spread, n, POLLEN, seed, r);
const dotted = (d: string, col: string = C.ink) => line(d, col, 1.2, '2 2.4');

// ── Insects and birds ────────────────────────────────────────────────
const wings = (s = 1, col = 'rgba(220,240,250,0.9)') => all(ellipse(-3, -6, 4.4 * s, 6 * s, col, C.ink, 0.7), ellipse(3, -6, 4.4 * s, 6 * s, col, C.ink, 0.7));
const bee = (x: number, y: number, s = 1, a = 0) => rot(x, y, a, s, wings(), ellipse(0, 0, 8, 5.5, YEL, C.ink, 1), line('M-3 -5 L-3 5 M1 -5.4 L1 5.4 M5 -4 L5 4', C.ink, 1.6), circle(-8, -1, 3, C.ink, null), line('M-9.5 -3.5 L-12 -7 M-8 -3.8 L-9 -8', C.ink, 0.8), line('M8 0 L10 0', C.ink, 1));
const bumble = (x: number, y: number, s = 1, a = 0) => rot(x, y, a, s, wings(1.1), ellipse(0, 0, 9, 7, C.ink, C.ink, 1), path('M-5 -6 C-2 -8 2 -8 5 -6 L5 -2 L-5 -2 Z', YEL, null), path('M3 3 C6 3 8 1 9 0 C8 4 5 6 3 6 Z', WHITE, null), circle(-9, -1, 3.4, C.ink, null), line('M-10 -4 L-12.5 -7.5 M-8.5 -4.2 L-9.5 -8.5', C.ink, 0.8));
const hoverfly = (x: number, y: number, s = 1, a = 0) => rot(x, y, a, s, ellipse(-3, -5, 5, 3, 'rgba(220,240,250,0.9)', C.ink, 0.7), ellipse(3, -5, 5, 3, 'rgba(220,240,250,0.9)', C.ink, 0.7),
  ellipse(1, 0, 7, 3.6, YEL, C.ink, 0.9), line('M-1 -3.4 L-1 3.4 M2.5 -3.4 L2.5 3.4 M6 -2 L6 2', C.ink, 1.2), circle(-6.5, 0, 3, '#b0442a', C.ink, 0.8), line('M-11 -9 L-9 -9 M-12 -6 L-10 -6 M9 -9 L11 -9', '#9aa3ad', 0.8));
const butterfly = (x: number, y: number, s = 1, col: string = ORANGE, a = 0) => rot(x, y, a, s, path('M0 0 C-4 -12 -14 -12 -12 -2 C-14 4 -6 8 0 2 Z', col, C.ink, 0.9), path('M0 0 C4 -12 14 -12 12 -2 C14 4 6 8 0 2 Z', col, C.ink, 0.9), circle(-7, -5, 1.6, C.ink, null), circle(7, -5, 1.6, C.ink, null), ellipse(0, 0, 1.4, 6, C.ink, null), line('M0 -6 L-3 -11 M0 -6 L3 -11', C.ink, 0.7));
const moth = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 L-13 -4 C-14 2 -8 6 0 3 Z', '#b9a58a', C.ink, 0.9), path('M0 0 L13 -4 C14 2 8 6 0 3 Z', '#b9a58a', C.ink, 0.9), ellipse(0, 1, 1.6, 5, '#6e5a44', null), line('M0 -3 L-4 -8 M0 -3 L4 -8', C.ink, 0.7), line('M-3 -8 l-1 -1 M-4 -7 l-1.2 0 M3 -8 l1 -1 M4 -7 l1.2 0', C.ink, 0.5));
const hummingbird = (x: number, y: number, s = 1) => at(x, y, s, path('M-2 -2 C2 -8 10 -6 12 -1 C8 0 4 4 -2 2 Z', '#3aa070', C.ink, 1), path('M2 -3 C-2 -14 6 -18 8 -10 Z', 'rgba(220,240,250,0.9)', C.ink, 0.8), path('M3 -3 C10 -14 16 -10 10 -4 Z', 'rgba(220,240,250,0.9)', C.ink, 0.8),
  circle(-3, -1, 3.6, '#3aa070', C.ink, 1), path('M-4 1 C-2 2 0 2 1 1', 'none', '#c43a5a', 1.6), circle(-4, -2, 0.8, C.ink, null), line('M-6.5 -1 L-17 1', C.ink, 1.2), path('M11 -1 L18 -3 L17 1 Z', '#2a7a55', C.ink, 0.8), line('M14 -12 L17 -12 M15 -9 L18 -9', '#9aa3ad', 0.8));

// ── Species (base of the stem at x,y; s = scale) ─────────────────────
const vitsippa = (x: number, y: number, s = 1, a = 0) => rot(x, y, a, s, stem('M0 0 Q1 -12 0 -20 Q-1 -26 2 -30'), toothLeaf(0, -18, 10, 3.4, -150, LEAF, 4), toothLeaf(0, -18, 10, 3.4, -30, LEAF, 4), toothLeaf(0, -18, 8, 3, 80, LEAF, 3),
  bloom(3, -33, 6, 9, 2.4, WHITE, YEL, 2.2, 10), line('M3 -33 l-1 -1.6 M3 -33 l1.4 -1.2 M3 -33 l1.6 0.8', GOLD, 0.6));
const blasippa = (x: number, y: number, s = 1) => at(x, y, s, ...[[-8, -4, 'M-8 0 Q-8 -4 -6 -8'], [8, -5, 'M8 0 Q8 -5 6 -9']].map(([, , d]) => stem(d as string, 1.2, '#7a5a3a')),
  path('M-6 -8 C-14 -12 -16 -4 -10 -4 C-14 0 -8 4 -6 -2 C-4 2 2 0 -2 -4 C2 -8 -2 -12 -6 -8 Z', '#5b7a3a', C.ink, 0.8), path('M6 -9 C14 -13 16 -5 10 -5 C14 -1 8 3 6 -3 C4 1 -2 -1 2 -5 C-2 -9 2 -13 6 -9 Z', '#7b5a4a', C.ink, 0.8),
  stem('M0 0 Q-1 -10 0 -18', 1.4), line('M-1 -6 l-1.6 -0.6 M-0.6 -11 l1.6 -0.6 M-0.4 -15 l-1.6 -0.4', C.grey, 0.5), bloom(0, -21, 7, 9, 2.4, BLUE, WHITE, 2.2, 0), dots(-2, -23, 4, 4, 6, '#2a3a8a', 3, 0.5));
const tussilago = (x: number, y: number, s = 1) => at(x, y, s, stem('M0 0 Q-1 -10 0 -18', 2.2, '#8a6a4a'), ...range(5).map((i) => path(`M-1.2 ${-3 - i * 3} L0 ${-5 - i * 3} L1.2 ${-3 - i * 3}`, '#b0745a', C.ink, 0.6)),
  ...range(22).map((i) => rot(0, -21, (i * 360) / 22, 1, line('M0 -3 L0 -8', YEL, 1.5))), circle(0, -21, 3.4, GOLD, C.ink, 0.8));
const gullviva = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 C-14 -2 -16 -10 -8 -8 C-6 -10 -2 -6 0 0 Z', LEAF, C.ink, 0.8), path('M0 0 C14 -2 16 -10 8 -8 C6 -10 2 -6 0 0 Z', LEAF, C.ink, 0.8), line('M-12 -5 l3 1 M-9 -7.6 l2 2 M12 -5 l-3 1 M9 -7.6 l-2 2', LEAF2, 0.5),
  stem('M0 0 L0 -26'), ...[-50, -25, 0, 25, 50].map((a) => rot(0, -26, a + 180, 1, line('M0 0 L0 -5', STEM, 1), path('M-2 -5 L2 -5 L2.4 -11 C2.4 -13 -2.4 -13 -2.4 -11 Z', '#e8d070', C.ink, 0.7), path('M-3 -11 C-3 -15 3 -15 3 -11 Z', YEL, C.ink, 0.7), circle(0, -12, 0.8, ORANGE, null))));
const kabbleka = (x: number, y: number, s = 1) => at(x, y, s, ...[[-9, -6, -18], [8, -8, 14], [0, -4, 0]].map(([lx, ly, a]) => rot(lx!, ly!, a!, 1, path('M0 4 C-10 4 -10 -10 0 -8 C10 -10 10 4 0 4 Z', '#4a9a3a', C.ink, 0.9), line('M0 3 L0 -6', LEAF2, 0.6), path('M-3 -6 C-1.6 -5 -0.6 -5 0 -6.4', 'none', '#bde0a0', 0.8))),
  stem('M2 -6 Q3 -14 6 -22'), stem('M-2 -6 Q-5 -12 -9 -17'), bloom(6, -24, 5, 10, 3.6, YEL, '#e8a020', 2.4, 15), bloom(-9, -19, 5, 8, 3, YEL, '#e8a020', 2, 0), line('M-9 -4 L9 -4', 'rgba(255,255,255,0.6)', 1));
const harsyra = (x: number, y: number, s = 1) => {
  const tre = (lx: number, ly: number, h: number) => all(stem(`M${lx} 0 L${lx} ${ly}`, 1, '#9a6a5a'), ...[-90, 30, 150].map((a) => rot(lx, ly, a, 1, path('M0 0 C-5 -3 -5 -8 -2 -8 C-1 -8 0 -7 0 -6 C0 -7 1 -8 2 -8 C5 -8 5 -3 0 0 Z', LEAF, C.ink, 0.7))), h ? '' : '');
  return at(x, y, s, tre(-8, -10, 0), tre(8, -8, 0), stem('M0 0 Q1 -10 0 -20', 1, '#9a6a5a'), bloom(0, -22, 5, 9, 3, WHITE, '#f5f0d8', 1.6, 0), ...range(5).map((i) => rot(0, -22, i * 72, 1, line('M0 -2 L0 -6.5', VIOLET, 0.5))));
};
const liljekonvalj = (x: number, y: number, s = 1) => at(x, y, s, path('M-2 0 C-14 -10 -12 -30 -4 -36 C-4 -24 -2 -12 -2 0 Z', '#3f9a4f', C.ink, 0.9), path('M2 0 C14 -10 13 -32 6 -38 C4 -24 3 -12 2 0 Z', '#4fab5c', C.ink, 0.9),
  stem('M0 0 Q1 -18 0 -28 Q2 -34 9 -36', 1.4), ...[[1, -24], [2, -28], [4, -32], [7, -35], [10, -36]].map(([bx, by], i) => all(line(`M${bx} ${by} l1.4 2`, STEM, 0.7), bell(bx! + 1.6, by! + 2, 0.42 - i * 0.02, WHITE))));
const pansy = (x: number, y: number, s = 1) => at(x, y, s, ellipse(-4, -5, 4.4, 6, VIOLET, C.ink, 0.8), ellipse(4, -5, 4.4, 6, VIOLET, C.ink, 0.8), ellipse(-6, 1, 4.4, 3.6, LILAC, C.ink, 0.8), ellipse(6, 1, 4.4, 3.6, LILAC, C.ink, 0.8), ellipse(0, 4, 5.4, 4.6, YEL, C.ink, 0.8), line('M0 1 L0 6.6 M-2 1.6 L-3 6 M2 1.6 L3 6', '#5a3a7a', 0.6), circle(0, 0.6, 1.2, ORANGE, null));
const styvmorsviol = (x: number, y: number, s = 1) => at(x, y, s, stem('M0 0 Q-2 -12 0 -22'), stem('M-1 -10 Q-8 -14 -10 -20', 1.2), leaf(0, -6, 9, 2.6, -20), leaf(-1, -12, 8, 2.2, -160), pansy(1, -26, 1), at(-10, -23, 0.7, pansy(0, 0, 1)));
const backsippa = (x: number, y: number, s = 1) => at(x, y, s, ...[-60, -120, -30, -150].map((a, i) => rot(0, -2 - i, a, 1, line('M0 0 L10 0 M4 0 l2 -2.4 M6 0 l2 2.4 M8 0 l2 -2 M3 0 l1.6 2', '#7aa060', 1))),
  stem('M0 0 Q1 -10 0 -18', 1.8, '#7a8a5a'), ...range(7).map((i) => line(`M${i % 2 ? 1 : -1} ${-2 - i * 2.4} l${i % 2 ? 2 : -2} -1`, '#cfcfcf', 0.6)),
  path('M0 -18 C-9 -18 -10 -28 -7 -34 C-4 -30 -2 -30 0 -34 C2 -30 4 -30 7 -34 C10 -28 9 -18 0 -18 Z', VIOLET, C.ink, 0.9), path('M-4 -21 C-5 -26 -4 -30 -3 -32 M4 -21 C5 -26 4 -30 3 -32', 'none', '#6a3aa8', 0.6), dots(-2.4, -27, 5, 3, 7, YEL, 7, 0.7), line('M-7 -26 l-1.6 -0.4 M7 -26 l1.6 -0.4 M-6 -22 l-1.6 0.4 M6 -22 l1.6 0.4', '#dcdcdc', 0.6));
const prastkrage = (x: number, y: number, s = 1) => at(x, y, s, stem('M0 0 Q-1 -16 0 -30'), toothLeaf(0, -8, 9, 2, -30, LEAF, 4), toothLeaf(0, -14, 8, 2, -150, LEAF, 4), bloom(0, -34, 18, 12, 1.6, WHITE, YEL, 3.6, 5));
const blaklocka = (x: number, y: number, s = 1) => at(x, y, s, stem('M0 0 Q-1 -14 0 -30 Q2 -34 6 -32', 1), stem('M0 -18 Q-6 -24 -9 -22', 0.9), leaf(0, -8, 7, 1, -40, LEAF), leaf(0, -12, 7, 1, -140, LEAF), bell(6, -32, 0.85, SKYBLUE, -15), bell(-9, -22, 0.75, SKYBLUE, 15));
const smorblomma = (x: number, y: number, s = 1) => at(x, y, s, stem('M0 0 Q0 -12 0 -18 Q4 -24 8 -28'), stem('M0 -18 Q-5 -24 -8 -30'), stem('M0 -2 Q-4 -4 -7 -5 M0 -2 Q4 -4 7 -5', 1), palmLeaf(-8, -6, 0.7), palmLeaf(8, -6, 0.7),
  bloom(8, -30, 5, 9, 3.2, YEL, '#e8b020', 2, 0), path('M6 -35 Q7 -37 9 -36', 'none', WHITE, 0.9), bloom(-8, -32, 5, 8, 3, YEL, '#e8b020', 1.8, 20), at(10, -16, 1, line('M-10 2 L0 0', STEM, 1), circle(0, 0, 2, '#7ab040', C.ink, 0.6)));
const vallmo = (x: number, y: number, s = 1) => at(x, y, s, stem('M0 0 Q-2 -16 0 -30', 1.6), ...range(6).map((i) => line(`M${-1 + (i % 2) * 1.6} ${-4 - i * 4} l${i % 2 ? 1.4 : -1.4} -0.6`, '#3d6a2a', 0.5)), stem('M-1 -14 Q-10 -18 -10 -26', 1.2), ellipse(-10, -24, 2.2, 3.4, '#7aa050', C.ink, 0.7),
  path('M0 -30 C-14 -28 -16 -42 -6 -44 C-2 -46 2 -46 6 -44 C16 -42 14 -28 0 -30 Z', RED, C.ink, 1), path('M-6 -44 C-2 -38 2 -38 6 -44', 'none', '#a82020', 0.8), path('M-10 -34 C-6 -36 -4 -36 -2 -34 M10 -34 C6 -36 4 -36 2 -34', 'none', '#a82020', 0.7), ellipse(0, -36, 4.6, 2, '#2a2a2a', C.ink, 0.6), dots(-4, -37.4, 8, 2, 8, '#1a1a1a', 4, 0.6));
const cornflowerHead = (x: number, y: number, s = 1) => at(x, y, s, ...range(9).map((i) => rot(0, 0, i * 40, 1, path('M-1.6 -2 L-3.2 -8 L-1 -7 L0 -9 L1 -7 L3.2 -8 L1.6 -2 Z', SKYBLUE, C.ink, 0.6))), circle(0, 0, 2.6, '#3a4aa8', C.ink, 0.6));
const kornblala = (x: number, y: number, s = 1) => at(x, y, s, stem('M0 0 Q1 -14 0 -26', 1.2, '#7a9a6a'), leaf(0, -10, 9, 1, -30, '#8aa880', false), leaf(0, -16, 8, 1, -150, '#8aa880', false), path('M-3 -26 L3 -26 L2 -30 L-2 -30 Z', '#7a9a6a', C.ink, 0.6), cornflowerHead(0, -33, 1.1));
const wheat = (x: number, y: number, h: number, a = 0) => rot(x, y, a, 1, line(`M0 0 L0 ${-h}`, '#d6b04a', 1.2), ...range(5).map((i) => all(ellipse(-1.6, -h + 2 + i * 2.6, 1.4, 2.2, '#e8c45a', C.ink, 0.5), ellipse(1.6, -h + 2 + i * 2.6, 1.4, 2.2, '#e8c45a', C.ink, 0.5))), line(`M0 ${-h - 1} L0 ${-h - 6} M-1.6 ${-h + 1} L-3 ${-h - 4} M1.6 ${-h + 1} L3 ${-h - 4}`, '#c8a03a', 0.5));
const pea = (x: number, y: number, col: string) => path(`M${x - 2.4} ${y} C${x - 3} ${y - 3} ${x + 3} ${y - 3} ${x + 2.4} ${y} C${x + 2} ${y + 1.6} ${x - 2} ${y + 1.6} ${x - 2.4} ${y} Z`, col, C.ink, 0.6);
const spike = (x: number, y: number, h: number, col: string, col2: string, rows = 8, w = 7) => all(...range(rows).map((i) => { const yy = y - i * (h / rows); const ww = w * (1 - (i / rows) * 0.6); return all(pea(x - ww / 2, yy, i % 2 ? col : col2), pea(x + ww / 2, yy - h / rows / 2, i % 2 ? col2 : col)); }), ellipse(x, y - h - 1, 1.6, 2.4, col2, C.ink, 0.6));
const palmLeaf = (x: number, y: number, s = 1, col: string = LEAF) => at(x, y, s, ...range(7).map((i) => rot(0, 0, -170 + i * 27, 1, ellipse(5, 0, 5, 1.4, col, C.ink, 0.6))));
const lupin = (x: number, y: number, s = 1, col: string = VIOLET, col2: string = LILAC) => at(x, y, s, stem('M0 0 L0 -22', 2.2), stem('M0 -6 Q-6 -8 -9 -12', 1), stem('M0 -10 Q6 -12 9 -16', 1), palmLeaf(-9, -13, 0.8), palmLeaf(9, -17, 0.8), spike(0, -24, 24, col, col2, 8, 8));
const rallarros = (x: number, y: number, s = 1) => at(x, y, s, stem('M0 0 L0 -26', 1.8, '#9a4a5a'), ...range(5).map((i) => leaf(0, -4 - i * 4, 9 - i, 1.6, i % 2 ? -25 : -155, LEAF, false)), ...range(7).map((i) => { const yy = -27 - i * 3.4; const ww = 5 - i * 0.5; return all(bloom(-ww / 2, yy, 4, 3.4, 1.4, MAGENTA, '#f0b0d0', 0.6, 45, 0.5), bloom(ww / 2, yy - 1.6, 4, 3.4, 1.4, MAGENTA, '#f0b0d0', 0.6, 45, 0.5)); }), ellipse(0, -52, 1.6, 2.6, '#c06090', C.ink, 0.6));
const geranium = (x: number, y: number, s = 1) => at(x, y, s, stem('M0 0 Q0 -14 0 -20 Q4 -26 8 -30'), stem('M0 -20 Q-4 -26 -8 -28'), palmLeaf(-6, -10, 1.1, LEAF), palmLeaf(7, -14, 0.9, LEAF), bloom(8, -32, 5, 8, 3, '#8a6ad8', WHITE, 1.6, 0), bloom(-8, -30, 5, 7, 2.6, '#8a6ad8', WHITE, 1.4, 20), line('M8 -36 L8 -33 M5 -33 L7 -32 M11 -33 L9 -32', '#5a3aa0', 0.6));
const linnea = (x: number, y: number, s = 1) => at(x, y, s, stem('M-16 0 Q0 -2 16 0', 1, '#7a5a3a'), ...[-12, -4, 6, 13].map((lx) => all(ellipse(lx - 2, -2, 2.4, 1.6, '#3f8a3a', C.ink, 0.6), ellipse(lx + 2, -2, 2.4, 1.6, '#3f8a3a', C.ink, 0.6))),
  stem('M0 -1 L0 -20', 0.9, '#8a5a4a'), stem('M0 -20 Q-3 -23 -6 -21 M0 -20 Q3 -23 6 -21', 0.8, '#8a5a4a'), bell(-6, -21, 0.7, '#f4b8cc', 10), bell(6, -21, 0.7, '#f4b8cc', -10));
const trumpet = (x: number, y: number, a: number, col: string) => rot(x, y, a, 1, path('M0 0 C1 -4 1 -8 0 -12 L1.6 -14 C3 -13 2 -12 2 -11 C2 -7 2 -3 1.4 0 Z', col, C.ink, 0.6), line('M1 -12 L-1.6 -16 M1.4 -12 L3 -16', '#9a6a3a', 0.5));
const kaprifol = (x: number, y: number, s = 1) => at(x, y, s, stem('M0 0 C-4 -10 4 -16 0 -26', 1.4, '#8a5a3a'), leaf(0, -12, 7, 2.4, -150, LEAF), leaf(1, -18, 7, 2.4, -30, LEAF),
  ...[-70, -45, -20, 5, 30, 55, 80].map((a, i) => trumpet(0, -27, a, i % 2 ? '#f6e4a0' : '#f2b8c8')));
const nackrosLeaf = (x: number, y: number, rx: number) => path(`M${x} ${y} L${x + rx * 0.3} ${f1(y - rx * 0.32)} A${rx} ${f1(rx * 0.38)} 0 1 1 ${x - rx * 0.1} ${f1(y - rx * 0.37)} Z`, '#4a9a4a', C.ink, 0.9);
const nackros = (x: number, y: number, s = 1) => at(x, y, s, ...range(9).map((i) => { const a = -90 + (i - 4) * 18; return rot(0, 0, a, 1, ellipse(0, 0, 9, 2.6, i % 2 ? WHITE : '#f4f0f6', C.ink, 0.7)); }).reverse(), ...range(6).map((i) => rot(0, -1, -90 + (i - 2.5) * 22, 1, ellipse(0, 0, 6, 2, WHITE, C.ink, 0.7))), ellipse(0, -2, 3, 1.6, YEL, C.ink, 0.6));
const umbel = (x: number, y: number, r: number, col: string = WHITE, rays = 9) => all(...range(rays).map((i) => { const a = Math.PI + (i / (rays - 1)) * Math.PI; return all(line(`M${x} ${y} L${f1(x + Math.cos(a) * r)} ${f1(y + Math.sin(a) * r * 0.7)}`, STEM, 0.7), dots(f1(x + Math.cos(a) * r) - 2.4, f1(y + Math.sin(a) * r * 0.7) - 2, 4.8, 2.4, 6, col, i + 3, 0.9), circle(f1(x + Math.cos(a) * r), f1(y + Math.sin(a) * r * 0.7 - 0.6), 2.2, col, C.ink, 0.5)); }));
const divLeaf = (x: number, y: number, len: number, a: number, col: string = LEAF) => rot(x, y, a, 1, line(`M0 0 L${len} 0`, STEM, 0.8), ...range(4).map((i) => all(ellipse(len * (0.3 + i * 0.2), -2, 1.6, 2.6, col, C.ink, 0.5), ellipse(len * (0.3 + i * 0.2), 2, 1.6, 2.6, col, C.ink, 0.5))));
const fingerborg = (x: number, y: number, s = 1) => at(x, y, s, stem('M0 0 L0 -48', 2), leaf(0, -2, 12, 3.4, -165, '#6aa060'), leaf(0, -3, 12, 3.4, -15, '#6aa060'), leaf(0, -10, 9, 2.6, -150, '#6aa060'),
  ...range(8).map((i) => { const yy = -16 - i * 4.4; return rot(0, yy, 0, 1 - i * 0.05, path('M0 0 C4 -2 9 -1 10 3 L11 5 C8 5 4 6 1 3 Z', i % 2 ? '#d070b0' : '#e090c8', C.ink, 0.7), circle(7, 3, 0.6, '#7a2a5a', null), circle(5, 2.4, 0.6, '#7a2a5a', null)); }));
const stormhatt = (x: number, y: number, s = 1) => at(x, y, s, stem('M0 0 L0 -50', 1.8), palmLeaf(-8, -6, 1.2, '#3f8a3a'), palmLeaf(8, -12, 1, '#3f8a3a'),
  ...range(7).map((i) => { const yy = -20 - i * 4.4; const side = i % 2 ? 1 : -1; return rot(side * 3, yy, 0, 1 - i * 0.05, path('M-3 2 C-4 -2 -2 -7 2 -7 C5 -7 6 -3 4 0 L4 3 L-3 3 Z', '#4a5ad0', C.ink, 0.7), path('M-3 3 L4 3 L3 5 L-2 5 Z', '#3a48b0', C.ink, 0.6)); }));
const tibastTwig = (x: number, y: number, s = 1) => at(x, y, s, line('M0 0 L0 -44', BARK, 2.6), line('M0 -20 L8 -34', BARK, 1.8), ...range(6).map((i) => bloom(i % 2 ? 2.6 : -2.6, -8 - i * 6, 4, 4, 1.6, '#e070b0', '#fbe0ee', 0.8, 45, 0.5)), ...range(2).map((i) => bloom(5 + i * 2, -27 - i * 4, 4, 3.6, 1.4, '#e070b0', '#fbe0ee', 0.8, 45, 0.5)));
const besksota = (x: number, y: number, s = 1) => at(x, y, s, stem('M0 0 C-6 -10 6 -20 0 -34 C-4 -40 4 -46 2 -50', 1.4, '#6a7a4a'), leaf(-1, -14, 8, 2.6, -160), leaf(1, -24, 8, 2.6, -20), leaf(0, -38, 7, 2.2, -150),
  ...[[6, -30], [10, -34]].map(([fx, fy]) => all(...range(5).map((i) => rot(fx!, fy!, i * 72 + 90, 1, path('M0 0 L-1.4 -5 L1.4 -5 Z', VIOLET, C.ink, 0.5))), path(`M${fx! - 1} ${fy} L${fx} ${fy! + 4} L${fx! + 1} ${fy} Z`, YEL, C.ink, 0.5))),
  stem('M0 -18 Q8 -18 10 -12', 0.8), ...[[8, -11], [11, -10], [10, -7], [13, -8]].map(([bx, by]) => ellipse(bx!, by!, 1.8, 2.4, RED, C.ink, 0.6)));
const kamomill = (x: number, y: number, s = 1) => at(x, y, s, stem('M0 0 Q0 -12 0 -18 Q-4 -24 -8 -26'), stem('M0 -18 Q4 -24 8 -28'), divLeaf(0, -6, 9, -30, LEAF), divLeaf(0, -10, 8, -150, LEAF),
  ...[[-8, -27], [8, -29]].map(([fx, fy]) => all(...range(12).map((i) => rot(fx!, fy!, i * 30, 1, ellipse(0, 3.4, 1, 2.4, WHITE, C.ink, 0.5))), ellipse(fx!, fy! - 0.8, 2.6, 2.4, YEL, C.ink, 0.6))));
const ringblomma = (x: number, y: number, s = 1) => at(x, y, s, stem('M0 0 L0 -22', 1.8), leaf(0, -4, 10, 3, -160, LEAF), leaf(0, -8, 10, 3, -20, LEAF), leaf(0, -14, 8, 2.6, -150, LEAF), bloom(0, -27, 16, 11, 1.8, ORANGE, '#b05a10', 3, 0), bloom(0, -27, 12, 7, 1.6, '#f6a63a', '#b05a10', 2.6, 15));
const johannesort = (x: number, y: number, s = 1) => at(x, y, s, stem('M0 0 L0 -26', 1.6, '#8a5a3a'), ...range(4).map((i) => all(leaf(0, -4 - i * 5, 7, 2, -170 + i * 4, LEAF, false), leaf(0, -4 - i * 5, 7, 2, -10 - i * 4, LEAF, false), dots(-6, -6 - i * 5, 12, 3, 3, '#d8f0c0', i + 11, 0.5))),
  ...[[0, -30], [-7, -27], [7, -27], [-4, -36], [4, -35]].map(([fx, fy]) => all(bloom(fx!, fy!, 5, 6, 2, YEL, GOLD, 1.2, 10), ...range(8).map((i) => rot(fx!, fy!, i * 45, 1, line('M0 0 L0 -3', GOLD, 0.4))))));
const rosmarin = (x: number, y: number, s = 1, a = 0) => rot(x, y, a, s, line('M0 0 L0 -36', '#8a6a4a', 1.6), ...range(12).map((i) => all(line(`M0 ${-3 - i * 2.8} l-5 -2`, '#4a7a5a', 1.4), line(`M0 ${-4 - i * 2.8} l5 -2`, '#4a7a5a', 1.4))), circle(-2, -38, 1.4, '#a8c0f0', C.ink, 0.4), circle(2, -37, 1.4, '#a8c0f0', C.ink, 0.4));
const oregano = (x: number, y: number, s = 1, a = 0) => rot(x, y, a, s, line('M0 0 L0 -30', '#8a5a4a', 1.2), ...range(5).map((i) => all(ellipse(-3, -4 - i * 5, 2.6, 2, LEAF, C.ink, 0.5), ellipse(3, -4 - i * 5, 2.6, 2, LEAF, C.ink, 0.5))), dots(-3, -36, 6, 5, 9, '#e8a8c8', 21, 1), dots(-2, -35, 4, 3, 4, '#c87aa8', 22, 0.8));
const salvia = (x: number, y: number, s = 1) => at(x, y, s, stem('M0 0 L0 -44', 1.6, '#7a8a6a'), ...[[-4, -165], [-4, -15], [-11, -155], [-11, -25]].map(([ly, a]) => all(leaf(0, ly!, 11, 3.4, a!, SAGE), rot(0, ly!, a!, 1, dots(2, -2, 8, 4, 6, '#c8d6c4', ly! + a!, 0.5)))),
  ...range(5).map((i) => path(`M0 ${-28 - i * 3.4} C${i % 2 ? 2 : -2} ${-30 - i * 3.4} ${i % 2 ? 5 : -5} ${-29 - i * 3.4} ${i % 2 ? 5 : -5} ${-27 - i * 3.4} Z`, VIOLET, C.ink, 0.5)));
const myntaSprig = (x: number, y: number, s = 1, col: string = '#4fbf5a', stemCol: string = '#5a9a3a') => at(x, y, s, stem('M0 0 L0 -26', 1.6, stemCol), ...range(3).map((i) => all(toothLeaf(0, -6 - i * 8, 9 - i, 3.4 - i * 0.4, -160, col, 5), toothLeaf(0, -6 - i * 8, 9 - i, 3.4 - i * 0.4, -20, col, 5))), toothLeaf(0, -26, 6, 2.4, -90, col, 3));
const jatteloka = (x: number, y: number, s = 1) => at(x, y, s, stem('M0 0 L0 -70', 3.4, '#6a8a4a'), ...range(10).map((i) => circle(i % 2 ? 1 : -1, -6 - i * 6, 0.9, '#a03a4a', null)), ...[[-6, -160], [-20, -20], [-34, -150]].map(([ly, a]) => rot(0, ly!, a!, 1, path('M0 0 L8 -6 L10 -2 L16 -8 L18 -2 L24 -4 L22 2 L16 4 L14 8 L8 4 Z', '#5aa04a', C.ink, 0.8))),
  umbel(0, -72, 22, WHITE, 11));
const odort = (x: number, y: number, s = 1) => at(x, y, s, stem('M0 0 L0 -40', 2), ...range(4).map((i) => line(`M-1 ${-4 - i * 9} L1 ${-4 - i * 9}`, C.ink, 0.6)), divLeaf(0, -12, 14, -160, '#5aa04a'), divLeaf(0, -20, 12, -20, '#5aa04a'), umbel(0, -42, 13, WHITE, 9));
const dill = (x: number, y: number, s = 1) => at(x, y, s, stem('M0 0 L0 -40', 1.6), ...[-10, -20].map((ly, i) => rot(0, ly, i ? -30 : -150, 1, ...range(6).map((j) => line(`M0 0 l${4 + j * 1.4} ${j % 2 ? -3 : 3}`, '#5ab04a', 0.6)))), umbel(0, -42, 13, '#e8e060', 9));

// ── Flower diagram (blommans delar) ──────────────────────────────────
type Part = 'skaft' | 'foder' | 'kron' | 'standare' | 'knapp' | 'pistill' | 'marke' | 'frukt' | 'fro' | 'nektar' | 'none';
/** A cut-away flower; the highlighted part is coloured and ringed, the rest pale. */
const diagram = (hl: Part) => {
  const c = (p: Part, col: string) => (hl === 'none' || hl === p ? col : PALE);
  const sk = (p: Part) => (hl === p ? 1.4 : 0.9);
  const out: Svg[] = [];
  out.push(stem('M60 112 L60 82', hl === 'skaft' ? 4 : 3, hl === 'none' || hl === 'skaft' ? STEM : PALE2));
  out.push(ellipse(60, 80, 10, 4, hl === 'none' ? STEM : PALE2, C.ink, 0.9));
  // sepals
  out.push(path('M52 80 C42 82 34 78 30 70 C40 70 48 74 54 78 Z', c('foder', '#5aa04a'), C.ink, sk('foder')), path('M68 80 C78 82 86 78 90 70 C80 70 72 74 66 78 Z', c('foder', '#5aa04a'), C.ink, sk('foder')));
  // petals
  out.push(path('M52 78 C30 72 18 50 26 34 C36 40 46 58 56 76 Z', c('kron', '#f07aa8'), C.ink, sk('kron')), path('M68 78 C90 72 102 50 94 34 C84 40 74 58 64 76 Z', c('kron', '#f07aa8'), C.ink, sk('kron')));
  // nectaries
  out.push(ellipse(54, 77, 2.4, 1.6, c('nektar', '#c8e050'), C.ink, sk('nektar')), ellipse(66, 77, 2.4, 1.6, c('nektar', '#c8e050'), C.ink, sk('nektar')));
  if (hl === 'nektar') out.push(path('M54 75 q-1 -3 0 -4 q1 1 0 4 Z M66 75 q-1 -3 0 -4 q1 1 0 4 Z', '#e8c040', null));
  // stamens
  for (const [bx, tx, ty] of [[55, 40, 42], [56, 46, 36], [65, 80, 42], [64, 74, 36]] as const) {
    out.push(line(`M${bx} 78 Q${(bx + tx) / 2} ${(78 + ty) / 2 + 4} ${tx} ${ty}`, hl === 'standare' ? '#d8a020' : hl === 'none' ? '#c89a3a' : PALE2, hl === 'standare' ? 1.6 : 1));
    out.push(ellipse(tx, ty - 2, 2, 3.4, hl === 'none' || hl === 'standare' || hl === 'knapp' ? YEL : PALE, C.ink, hl === 'knapp' ? 1.2 : 0.7));
  }
  // pistil: ovary, style, stigma
  out.push(path('M53 78 C51 66 69 66 67 78 Z', c('frukt', '#9ad06a'), C.ink, sk('frukt')));
  out.push(line('M60 68 L60 40', hl === 'pistill' ? '#7ab04a' : hl === 'none' ? '#8ac05a' : PALE2, hl === 'pistill' ? 3 : 2.4));
  out.push(path('M55 40 C55 34 65 34 65 40 C62 38 58 38 55 40 Z', hl === 'none' || hl === 'pistill' || hl === 'marke' ? '#c8d84a' : PALE, C.ink, hl === 'marke' ? 1.4 : 0.8));
  if (hl === 'pistill') out.push(path('M53 78 C51 66 69 66 67 78 Z', '#9ad06a', C.ink, 1.2));
  // ovules
  for (const ox of [57, 60, 63]) out.push(ellipse(ox, 74, 1.4, 2, hl === 'fro' ? WHITE : hl === 'none' ? '#f0f6e0' : PALE, C.ink, hl === 'fro' ? 1 : 0.5));
  return all(...out);
};
const diaScene = (hl: Part, ...extra: Svg[]) => all(bg(), diagram(hl), ...extra);

// ── People helpers ───────────────────────────────────────────────────
const book = (x: number, y: number, s = 1, inner: Svg = '') => at(x, y, s, path('M0 0 L-16 -3 L-16 -21 L0 -18 Z', WHITE, C.ink, 1.2), path('M0 0 L16 -3 L16 -21 L0 -18 Z', WHITE, C.ink, 1.2), line('M0 0 L0 -18', C.ink, 1), inner);
const textLines = (x: number, y: number, w: number, n: number, col = '#9aa3ad') => all(...range(n).map((i) => line(`M${x} ${y + i * 2.6} L${x + w * (i === n - 1 ? 0.6 : 1)} ${y + i * 2.6}`, col, 0.9)));
const lupp = (x: number, y: number, r: number, inner: Svg = '') => all(line(`M${f1(x + r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r * 1.5)} ${f1(y + r * 1.5)}`, '#5a3a2a', 3.4), circle(x, y, r, GLASS, C.ink, 2), inner, circle(x, y, r, 'none', C.ink, 2));
const pot = (x: number, y: number, s = 1, col: string = '#c8703a') => at(x, y, s, path('M-8 0 L8 0 L6 12 L-6 12 Z', col, C.ink, 1), rect(-9, -2, 18, 3, col, 1, C.ink, 1));
const mug = (x: number, y: number, col: string = WHITE, tea: string = '#d8b04a') => all(path(`M${x - 7} ${y - 12} L${x + 7} ${y - 12} L${x + 6} ${y} L${x - 6} ${y} Z`, col, C.ink, 1.2), ellipse(x, y - 12, 7, 1.6, tea, C.ink, 0.8), path(`M${x + 7} ${y - 9} C${x + 12} ${y - 9} ${x + 12} ${y - 3} ${x + 6} ${y - 3}`, 'none', C.ink, 1.2));
const jar = (x: number, y: number, col: string, lid: string = '#c8b07a') => all(rect(x - 7, y - 12, 14, 12, col, 3, C.ink, 1.2), rect(x - 8, y - 15, 16, 4, lid, 1, C.ink, 1));
const box = (x: number, y: number, w: number, h: number, col: string) => all(path(`M${x} ${y} L${x + w} ${y} L${x + w + 5} ${y - 4} L${x + w + 5} ${y - h - 4} L${x + 5} ${y - h - 4} L${x} ${y - h} Z`, col, C.ink, 1.2), line(`M${x} ${y - h} L${x + w} ${y - h} L${x + w + 5} ${y - h - 4} M${x + w} ${y - h} L${x + w} ${y}`, C.ink, 1.2));
const table = (y = 92) => all(rect(8, y, 104, 5, WOOD, 1.5, C.ink, 1.4), line(`M16 ${y + 5} L16 112 M104 ${y + 5} L104 112`, C.ink, 2));
const fence = (x1: number, x2: number, y: number) => all(line(`M${x1} ${y - 18} L${x2} ${y - 18} M${x1} ${y - 8} L${x2} ${y - 8}`, WOOD, 2.4), ...range(Math.floor((x2 - x1) / 12) + 1).map((i) => rect(x1 + i * 12 - 2, y - 24, 4, 24, '#d8b88a', 1, C.ink, 0.8)));
const bareTree = (x: number, y: number, s = 1) => at(x, y, s, path('M-3 0 L-2 -30 L-10 -44 M-2 -30 L2 -48 M-1 -36 L10 -46 M-2 -22 L-12 -30', 'none', BARK, 2.6), path('M-3 0 L-2 -30 L2 -30 L3 0 Z', BARK, C.ink, 0.8));
const snow = (x: number, y: number, w: number) => path(`M${x} ${y} C${x + w * 0.2} ${y - 4} ${x + w * 0.8} ${y - 4} ${x + w} ${y} Z`, WHITE, '#b8c8d8', 0.8);
const pillow = (x: number, y: number) => all(path(`M${x - 26} ${y} C${x - 30} ${y - 14} ${x - 26} ${y - 20} ${x - 20} ${y - 20} L${x + 20} ${y - 20} C${x + 26} ${y - 20} ${x + 30} ${y - 14} ${x + 26} ${y} C${x + 10} ${y + 3} ${x - 10} ${y + 3} ${x - 26} ${y} Z`, '#f2eef8', C.ink, 1.4));
const fig = (x: number, top: string, mood: 'smile' | 'calm' | 'sick' | 'shock' | 'frown' = 'smile', more: { h?: number; hairStyle?: 'short' | 'long'; bottom?: string; hair?: string } = {}) => P({ x, top, mood, ...more });

// ── Motifs ───────────────────────────────────────────────────────────
export const FLOWERS_HERBS_MOTIFS: Record<string, Svg> = {
  // ── 2811 Vilda vårblommor ──
  /** vårblomma: early spring in a bare wood – snow patches still lie on brown ground, bare trees, and small first flowers (white, blue and yellow) come up between them; a low spring sun. */
  'blom.vårblomma': all(bg(SKY), rect(4, 92, 112, 20, '#b89a72', 0, null), bareTree(24, 92, 0.9), bareTree(96, 92, 0.8), sunAt(60, 22, 6), snow(8, 96, 26), snow(80, 98, 30), snow(48, 104, 18),
    vitsippa(40, 108, 0.75), blasippa(62, 108, 0.8), tussilago(84, 110, 0.8), vitsippa(28, 110, 0.6, -6), tussilago(100, 110, 0.6)),
  /** slå ut: three stages of the same flower in a row – a closed green bud, a half-open bud, a fully open flower – with an orange arrow along them; the open flower is ringed. */
  'blom.slå-ut': all(bg(), ground, stem('M22 112 L22 64'), cup(22, 64, 5, 10, '#7ab050', 1), stem('M58 112 L58 62'), path('M58 62 C52 60 52 48 55 44 C57 50 59 50 61 44 C64 48 64 60 58 62 Z', '#f6b0c8', C.ink, 0.9), path('M53 62 C52 58 54 56 56 58 M63 62 C64 58 62 56 60 58', 'none', '#7ab050', 1.4),
    stem('M96 112 L96 62'), bloom(96, 54, 7, 16, 4.4, PINK, YEL, 4), arrow(30, 40, 84, 40, HL, 3), ring(96, 54, 18)),
  /** vitsippa: a white wood anemone with six petals and a yellow centre above a whorl of three toothed leaves; more of them carpet the ground under a bare tree. */
  'blom.vitsippa': all(bg(SKY), rect(4, 100, 112, 12, '#b89a72', 0, null), bareTree(100, 100, 0.8), vitsippa(50, 108, 2.2), vitsippa(16, 108, 0.6), vitsippa(26, 110, 0.5, 8), vitsippa(84, 110, 0.6, -6), vitsippa(96, 110, 0.5)),
  /** vitsippsbacke: a gentle slope under bare deciduous trees that is completely white with wood anemones; a person walks on the path at the foot of the slope. */
  'blom.vitsippsbacke': (() => { const R = rng(41); return all(bg(SKY), path('M4 112 L4 70 C30 56 70 50 116 62 L116 112 Z', '#b89a72', null), bareTree(28, 72, 0.9), bareTree(70, 62, 1), bareTree(102, 68, 0.8),
    ...range(70).map(() => { const xx = 8 + R() * 104; const yTop = xx < 60 ? 70 - (xx - 4) * 0.25 : 56 + (xx - 60) * 0.1; const yy = yTop + 6 + R() * (100 - yTop); return bloom(f1(xx), f1(yy), 6, 3.4, 1, WHITE, YEL, 0.7, R() * 60, 0.4); }),
    path('M4 106 C40 102 80 104 116 100 L116 112 L4 112 Z', '#d8c8a0', null), fig(92, '#3a7ad0', 'smile', { h: 0.4 })); })(),
  /** blåsippa: a blue hepatica flower with white stamens on a short hairy stem, with the three-lobed leaves (one green, one brownish from last year) at the base. */
  'blom.blåsippa': all(bg(), rect(4, 100, 112, 12, '#b89a72', 0, null), blasippa(56, 106, 2.6), blasippa(18, 108, 0.7), blasippa(100, 108, 0.7)),
  /** tussilago: a yellow coltsfoot flower on a scaly reddish stem without any leaves, coming up beside a ditch with melting snow. */
  'blom.tussilago': all(bg(SKY), rect(4, 96, 112, 16, '#9a8a6a', 0, null), snow(70, 98, 42), path('M4 104 L40 104 L44 112 L4 112 Z', WATER, null), tussilago(56, 106, 2.6), tussilago(26, 100, 0.9), tussilago(96, 100, 0.8)),
  /** gullviva: a cowslip – a cluster of nodding yellow tube-shaped flowers at the top of one stem, above a rosette of wrinkled leaves, in green grass. */
  'blom.gullviva': all(bg(SKY), lawn(98), gullviva(60, 104, 2.4), tuft(20, 104), tuft(98, 104), gullviva(20, 106, 0.6)),
  /** kabbleka: a marsh marigold with big glossy yellow cup flowers and round, heart-shaped dark green leaves, standing in shallow water by a stream. */
  'blom.kabbleka': all(bg(SKY), rect(4, 90, 112, 22, WATER, 0, null), line('M10 96 q6 -2 12 0 M70 102 q6 -2 12 0 M40 108 q6 -2 12 0', WATER2, 0.8), kabbleka(58, 100, 2.3)),
  /** harsyra: a wood sorrel – leaves made of three heart shapes and one small white flower with fine lilac veins – in the shade under a spruce. */
  'blom.harsyra': all(bg('#e4ece0'), path('M98 10 L116 60 L80 60 Z', '#2f6e4a', C.ink, 1), path('M98 30 L116 80 L80 80 Z', '#2f6e4a', C.ink, 1), rect(96, 80, 4, 30, BARK, 0, C.ink, 0.8), rect(4, 104, 112, 8, '#8a7a5a', 0, null), harsyra(50, 106, 2.6), harsyra(86, 108, 0.8)),
  /** liljekonvalj: a lily of the valley – two broad leaves and an arching stem with a row of small white hanging bells – with a light scent drawn as wavy lines. */
  'blom.liljekonvalj': all(bg(), rect(4, 104, 112, 8, '#8a7a5a', 0, null), liljekonvalj(54, 108, 2.2), line('M86 40 q4 -3 0 -6 q-4 -3 0 -6 M94 44 q4 -3 0 -6 q-4 -3 0 -6', '#b0a0c8', 1.2)),
  /** styvmorsviol: a wild pansy with flowers in three colours – two violet petals on top, two pale lilac at the sides and a yellow lower petal with dark lines – growing between stones. */
  'blom.styvmorsviol': all(bg(), rect(4, 102, 112, 10, '#c8b890', 0, null), ellipse(24, 104, 12, 6, '#a8a29a', C.ink, 1), ellipse(96, 104, 14, 7, '#b8b2aa', C.ink, 1), styvmorsviol(58, 106, 2.4)),
  /** backsippa: a pasque flower – an upright, deep violet bell with a yellow centre, the whole plant covered in fine silvery hairs – on a dry, sunny slope. */
  'blom.backsippa': all(bg(SKY), sunAt(98, 20, 6), path('M4 112 L4 96 C40 90 80 92 116 100 L116 112 Z', '#d8c890', null), backsippa(56, 104, 2.4), tuft(22, 104), tuft(96, 106)),

  // ── 2812 Sommarblommor ──
  /** vildblomma: colourful flowers growing by themselves in the grass along a country path; beside it, grey, a flower planted in a pot as contrast. */
  'blom.vildblomma': all(bg(SKY), lawn(92, MEADOW), path('M4 112 L40 92 L52 92 L30 112 Z', '#d8c8a0', null), prastkrage(60, 104, 0.9), blaklocka(74, 106, 0.9), smorblomma(90, 104, 0.8), vallmo(104, 108, 0.7), prastkrage(46, 108, 0.6), tuft(68, 108), tuft(84, 110),
    greyed(pot(18, 76, 1.2), at(18, 74, 1, stem('M0 0 L0 -20'), bloom(0, -24, 6, 9, 2.6, PINK, YEL, 2.4)))),
  /** prästkrage: an ox-eye daisy – many white ray petals around a yellow centre – on a long stem with toothed leaves, in a meadow. */
  'blom.prästkrage': all(bg(SKY), lawn(100, MEADOW), prastkrage(58, 106, 2.4), prastkrage(18, 108, 0.7), prastkrage(100, 108, 0.6)),
  /** blåklocka: a harebell – thin stems with blue bell-shaped flowers hanging from them – moving slightly in the wind. */
  'blom.blåklocka': all(bg(SKY), lawn(102, MEADOW), blaklocka(54, 106, 2.6), line('M90 30 q6 -2 10 0 M86 40 q6 -2 10 0', '#9aa3ad', 1.2)),
  /** smörblomma: a meadow buttercup – small, glossy, bright yellow cup-shaped flowers with five petals on branching stems, and deeply divided leaves. */
  'blom.smörblomma': all(bg(SKY), lawn(102, MEADOW), smorblomma(56, 106, 2.4), smorblomma(100, 108, 0.6)),
  /** vallmo: a red poppy with four big, thin, crinkled petals and a black centre, a hairy stem and a nodding bud, at the edge of a grain field. */
  'blom.vallmo': all(bg(SKY), ...range(10).map((i) => wheat(8 + i * 12, 104, 30 + (i % 3) * 4)), rect(4, 104, 112, 8, '#c8a868', 0, null), vallmo(58, 108, 2)),
  /** kornblåla: a cornflower – a clear blue, frilly flower head on a grey-green stem – standing among golden ears of grain. */
  'blom.kornblåla': all(bg(SKY), ...range(10).map((i) => wheat(8 + i * 12, 106, 34 + (i % 3) * 4)), rect(4, 104, 112, 8, '#c8a868', 0, null), kornblala(58, 106, 2.4)),
  /** lupin: tall lupins with long, dense spikes of violet and pink pea-like flowers and hand-shaped leaves, growing along a railway embankment. */
  'blom.lupin': all(bg(SKY), rect(4, 100, 112, 12, '#b8a890', 0, null), line('M4 104 L116 104 M4 108 L116 108', '#6a6a72', 1.6), lupin(54, 100, 2), lupin(22, 100, 1.3, MAGENTA, PINK), lupin(92, 100, 1.4, '#e8e8f0', LILAC)),
  /** rallarros: a hillside clearing with old tree stumps, full of tall fireweed with long pink flower spikes. */
  'blom.rallarros': all(bg(SKY), path('M4 112 L4 90 C40 84 80 86 116 92 L116 112 Z', '#9a8a6a', null), rect(12, 90, 10, 6, BARK, 1, C.ink, 0.8), rect(100, 94, 9, 5, BARK, 1, C.ink, 0.8), rallarros(56, 108, 1.7), rallarros(32, 104, 1.1), rallarros(84, 106, 1.2), rallarros(104, 104, 0.8)),
  /** midsommarblomster: wood cranesbill – violet-blue five-petalled flowers with hand-shaped leaves – with a small decorated midsummer pole in the background. */
  'blom.midsommarblomster': all(bg(SKY), lawn(100, MEADOW), at(98, 100, 0.7, line('M0 0 L0 -60', '#5a8a3a', 3), line('M-16 -44 L16 -44', '#5a8a3a', 3), circle(-16, -38, 6, 'none', '#5a8a3a', 2.4), circle(16, -38, 6, 'none', '#5a8a3a', 2.4), line('M-4 -60 L4 -60', '#3a6aa8', 2)), geranium(52, 106, 2.3)),
  /** linnea: a twinflower – a thin stem that splits in two, each with a small pale pink bell hanging down – above small round leaves creeping over moss in a pine forest. */
  'blom.linnea': all(bg('#e4ece0'), rect(80, 10, 6, 94, BARK, 0, C.ink, 0.8), rect(4, 98, 112, 14, '#6a9a4a', 0, null), dots(4, 98, 112, 14, 60, '#4a7a3a', 77, 1), linnea(56, 104, 2.6)),
  /** kaprifol: a honeysuckle climbing a wooden fence, with a crown of long pale yellow and pink trumpet flowers; a crescent moon and a moth show that it smells in the evening. */
  'blom.kaprifol': all(bg('#d8dcef'), moon(98, 20, 1.2), fence(8, 112, 104), at(60, 106, 2, stem('M0 0 C-4 -10 4 -16 0 -26', 1.4, '#8a5a3a')), kaprifol(60, 62, 1.5), moth(98, 50, 0.9)),
  /** näckros: a white water lily floating on a lake, among big round leaves with a notch. */
  'blom.näckros': all(bg(WATER), line('M10 30 q8 -2 16 0 M80 24 q8 -2 16 0 M20 96 q8 -2 16 0', WATER2, 0.9), nackrosLeaf(26, 76, 18), nackrosLeaf(92, 88, 16), nackrosLeaf(88, 40, 12), at(58, 64, 2.4, nackros(0, 0, 1))),
  /** vissna: a flower drooping in a vase, its petals brown and falling onto the table; beside it, grey, a fresh upright flower in a vase as contrast. */
  'blom.vissna': all(bg(), table(96), path('M30 96 L28 72 L44 72 L42 96 Z', GLASS, C.ink, 1.2), stem('M36 72 Q36 50 50 46 Q58 46 60 54', 1.8, '#8a8a4a'), at(60, 58, 1, ellipse(0, 0, 3, 5, '#b8865a', C.ink, 0.8), ellipse(-4, 2, 2.4, 4, '#a07040', C.ink, 0.8), ellipse(4, 3, 2.4, 4, '#c09060', C.ink, 0.8)),
    leaf(36, 64, 10, 2.4, 160, '#a8a050'), ellipse(66, 94, 3, 1.4, '#b8865a', C.ink, 0.6), ellipse(54, 95, 3, 1.2, '#a07040', C.ink, 0.6),
    greyed(path('M82 96 L80 72 L96 72 L94 96 Z', GLASS, C.ink, 1.2), stem('M88 72 L88 40', 1.8), leaf(88, 60, 10, 2.4, -30), bloom(88, 34, 6, 12, 3.4, PINK, YEL, 3))),
  /** vas: a glass vase with water and a bunch of summer flowers on a table. */
  'blom.vas': all(bg(), table(96), path('M48 96 C40 88 42 70 50 62 L50 56 L70 56 L70 62 C78 70 80 88 72 96 Z', GLASS, C.ink, 1.6), path('M44 80 C46 90 50 94 54 95 L66 95 C72 92 76 86 76 80 Z', '#b8e0f0', null),
    stem('M56 60 L46 30 M60 60 L60 24 M64 60 L76 32', 1.4), prastkrage(46, 30, 0.01), bloom(46, 28, 14, 10, 1.4, WHITE, YEL, 3), bloom(76, 30, 6, 10, 3, PINK, YEL, 2.6), at(60, 26, 1, bell(0, -6, 1, SKYBLUE)), path('M48 96 C40 88 42 70 50 62 L50 56 L70 56 L70 62 C78 70 80 88 72 96 Z', 'none', C.ink, 1.6)),
  /** blomsterkrans: a girl wearing a ring of summer flowers on her head, standing on a meadow at midsummer. */
  'blom.blomsterkrans': all(bg(SKY), lawn(100, MEADOW), fig(60, WHITE, 'smile', { hairStyle: 'long', h: 0.95, bottom: '#3a6aa8' }),
    ellipse(60, 19, 11, 3.4, 'none', '#4f8f3a', 2.4), ...range(9).map((i) => { const a = Math.PI + (i / 8) * Math.PI; const fx = f1(60 + Math.cos(a) * 11), fy = f1(19 + Math.sin(a) * 3.6); return bloom(fx, fy, 5, 4.4, 1.6, [WHITE, SKYBLUE, YEL, PINK, VIOLET][i % 5]!, YEL, 1, 0, 0.5); }), prastkrage(18, 106, 0.6), geranium(100, 106, 0.7)),
  /** sju sorters blommor: seven different small flowers laid in a row on a pillow, under a light summer night sky with a pale moon seen through a window. */
  'blom.sju-sorters-blommor': all(bg('#d8dcef'), rect(70, 10, 40, 32, '#b8c8f0', 2, C.ink, 1.4), line('M90 10 L90 42 M70 26 L110 26', C.ink, 1.2), moon(80, 18, 0.8), rect(8, 76, 104, 36, '#e8d8c0', 2, C.ink, 1.4), pillow(60, 80),
    bloom(26, 70, 12, 6, 1, WHITE, YEL, 2), at(36, 68, 1, bell(0, -4, 0.6, SKYBLUE)), bloom(46, 68, 5, 6, 2.2, YEL, GOLD, 1.4), at(56, 70, 1, cornflowerHead(0, -2, 0.6)), bloom(66, 68, 5, 6, 2.2, '#8a6ad8', WHITE, 1.2), bloom(76, 70, 4, 7, 3, RED, '#2a2a2a', 1.4), at(88, 72, 0.5, spike(0, 0, 18, MAGENTA, PINK, 5, 5))),
  /** landskapsblomma: a simple map of Sweden divided into provinces; one southern province is coloured and a twinflower stands on it as its symbol flower, ringed in orange. */
  'blom.landskapsblomma': all(bg('#e8f2f8'), path('M52 110 L45 103 L43 93 L47 86 L44 77 L50 67 L52 57 L58 47 L61 37 L67 27 L73 17 L81 8 L90 9 L93 17 L87 24 L82 32 L78 41 L74 50 L75 58 L79 65 L75 73 L71 81 L68 91 L65 100 L58 105 Z', '#f4eed8', C.ink, 1.4), ellipse(82, 86, 3, 6, '#f4eed8', C.ink, 1.2),
    line('M46 101 L62 102 M45 88 L69 86 M48 74 L76 70 M52 58 L75 58 M60 44 L77 44 M68 30 L84 30', '#9aa3ad', 1), path('M45 88 L69 86 L68 91 L65 100 L62 102 L46 101 L43 93 L47 86 Z', '#f4c8d8', C.ink, 1.2),
    at(20, 92, 1.4, linnea(0, 0, 0.9)), line('M30 72 L50 90', HL, 1.6, '3 2'), ring(56, 94, 14, 10)),

  // ── 2813 Blommans delar ──
  /** blomma (noun): one complete, simple flower with five pink petals, a yellow centre, a stem and two leaves. */
  'blom.blomma': all(bg(), ground, stem('M60 112 L60 54', 2.6), leaf(60, 92, 20, 5, -160), leaf(60, 84, 20, 5, -20), bloom(60, 44, 5, 30, 9, PINK, YEL, 8)),
  /** kronblad: the cut-away flower diagram with the coloured petals ringed; one petal has fallen off and lies beside it. */
  'blom.kronblad': diaScene('kron', ring(26, 52, 10, 20), ring(94, 52, 10, 20), rot(100, 100, -30, 1, path('M0 0 C-10 -4 -12 -18 -6 -26 C0 -18 4 -8 0 0 Z', '#f07aa8', C.ink, 1))),
  /** foderblad: the flower diagram with only the small green leaves under the petals coloured and ringed. */
  'blom.foderblad': diaScene('foder', ring(36, 74, 10, 7), ring(84, 74, 10, 7)),
  /** ståndare: the flower diagram with the thin stalks with yellow tips around the centre coloured and ringed. */
  'blom.ståndare': diaScene('standare', ring(44, 52, 10, 16), ring(76, 52, 10, 16)),
  /** ståndarknapp: the flower diagram with only the yellow tips of the stamens coloured; one tip is shown enlarged in a circle, open and full of pollen. */
  'blom.ståndarknapp': diaScene('knapp', ring(43, 36, 8), ring(77, 36, 8), circle(96, 18, 12, WHITE, HL, 2), ellipse(96, 18, 5, 8, YEL, C.ink, 1), path('M96 10 L96 26', 'none', '#c89a20', 0.8), pollen(104, 14, 8, 8, 5, 1.2), line('M84 24 L80 32', HL, 1.6)),
  /** pollenkorn: a magnifying glass over a yellow anther shows the pollen as separate round, spiky grains. */
  'blom.pollenkorn': all(bg(), ellipse(28, 92, 8, 14, YEL, C.ink, 1.2), pollen(28, 92, 30, 16, 61, 0.9), line('M28 106 L28 112', '#c89a3a', 2), lupp(70, 50, 34, all(...[[58, 40], [76, 34], [66, 60], [84, 56], [54, 58], [74, 48]].map(([px, py], i) => all(circle(px!, py!, 6, i % 2 ? POLLEN : '#f6c83a', C.ink, 1), ...range(8).map((j) => rot(px!, py!, j * 45, 1, line('M0 -6 L0 -8', C.ink, 0.8)))))))),
  /** pistill: the flower diagram with the central part – the swollen base, the column and the sticky top – coloured and ringed. */
  'blom.pistill': diaScene('pistill', ring(60, 56, 10, 26)),
  /** märke (2): the flower diagram with only the sticky top of the pistil coloured and ringed; yellow pollen grains are stuck to it. */
  'blom.märke.2': diaScene('marke', pollen(60, 36, 6, 8, 81, 1.1), ring(60, 37, 9, 6)),
  /** fruktämne: the flower diagram with only the swollen base of the pistil coloured and ringed; an arrow leads to a small apple to show what it becomes. */
  'blom.fruktämne': diaScene('frukt', ring(60, 73, 10, 7), arrow(76, 92, 92, 100, HL, 2.4), circle(102, 100, 7, RED, C.ink, 1.2), line('M102 93 L103 90', BARK, 1.2)),
  /** fröämne: the flower diagram with the small white grains inside the swollen base coloured and ringed; an arrow leads to a seed. */
  'blom.fröämne': diaScene('fro', ring(60, 74, 7, 4), arrow(70, 92, 88, 100, HL, 2.4), ellipse(98, 100, 6, 4, '#b8864a', C.ink, 1.2)),
  /** nektargömme: the flower diagram with the two small green-yellow spots deep at the base of the petals coloured and ringed, with a drop of nectar; a bee heads for them. */
  'blom.nektargömme': diaScene('nektar', ring(54, 77, 5), ring(66, 77, 5), bee(98, 92, 0.8, -20), dotted('M90 90 Q76 86 70 80', HL)),
  /** blomskaft: a flower on a tall thin stalk; the stalk directly under the flower is coloured and ringed, the flower itself pale. */
  'blom.blomskaft': diaScene('skaft', ring(60, 97, 7, 16)),
  /** blomställning: a tall stem with many small flowers sitting together in a long spike; an orange bracket marks the whole group of flowers. */
  'blom.blomställning': all(bg(), ground, stem('M54 112 L54 66', 2.4), palmLeaf(44, 96, 1.4), palmLeaf(64, 88, 1.2), spike(54, 66, 48, VIOLET, LILAC, 10, 12), line('M72 16 L78 16 L78 66 L72 66', HL, 2.6)),
  /** blomkorg: an ox-eye daisy, and beside it an enlarged circle showing that the yellow centre is made of many tiny separate flowers and each white "petal" is a small flower too. */
  'blom.blomkorg': all(bg(), ground, prastkrage(30, 112, 2), ring(30, 44, 26), line('M54 40 L64 36', HL, 1.6), circle(90, 40, 24, WHITE, HL, 2), ...range(19).map((i) => { const a = i * 2.4, r = Math.sqrt(i) * 3.6; const px = f1(90 + Math.cos(a) * r), py = f1(40 + Math.sin(a) * r); return all(path(`M${px - 2} ${py + 2} L${px - 1.4} ${py - 2} L${px + 1.4} ${py - 2} L${px + 2} ${py + 2} Z`, YEL, C.ink, 0.5), bloom(px, py - 2.4, 5, 2, 0.8, GOLD, GOLD, 0.4, 0, 0.3)); }),
    ...range(5).map((i) => rot(90, 40, -40 + i * 20, 1, path('M0 -16 C-2 -18 -2 -22 0 -23 C2 -22 2 -18 0 -16 Z', WHITE, C.ink, 0.6)))),

  // ── 2814 Pollinering ──
  /** pollinering: a bee flies from one flower, where yellow pollen sticks to it, to the sticky centre of another flower; a dotted path with an arrow and yellow dots shows the pollen being carried. */
  'blom.pollinering': all(bg(SKY), lawn(104), stem('M26 104 L26 64'), bloom(26, 56, 6, 16, 4.4, PINK, YEL, 4), pollen(26, 56, 10, 8, 91, 1.2), stem('M94 104 L94 64'), bloom(94, 56, 6, 16, 4.4, PINK, YEL, 4), pollen(94, 56, 4, 6, 93, 1.2),
    dotted('M32 48 Q60 14 88 48', HL), arrow(84, 42, 90, 50, HL, 2.4), bee(60, 26, 1.1), pollen(64, 34, 6, 6, 95, 1.1)),
  /** blomfluga: a yellow-and-black striped hoverfly with big red eyes and one pair of wings, hanging still in the air in front of a flower (short motion lines around the wings). */
  'blom.blomfluga': all(bg(SKY), stem('M84 112 L84 70'), leaf(84, 96, 12, 3, -20), bloom(84, 62, 14, 12, 1.6, WHITE, YEL, 4), at(44, 50, 2.6, hoverfly(0, 0, 1))),
  /** kolibri: a tiny green hummingbird with a long thin beak hovering in front of a red trumpet-shaped flower and drinking from it. */
  'blom.kolibri': all(bg(SKY), stem('M26 112 L26 70', 2), leaf(26, 96, 12, 3, -20), ...[[22, 64, -40], [26, 60, 0], [31, 64, 40]].map(([tx, ty, a]) => rot(tx!, ty!, a! + 90, 1, path('M0 0 L0 -2 C6 -3 14 -3 18 -6 L18 3 C14 1 6 2 0 2 Z', RED, C.ink, 0.9))), at(72, 62, 2, hummingbird(0, 0, 1))),
  /** honungsmärke: a flower seen from the front whose petals have dark lines that all lead into the centre, ringed in orange; a bee follows the lines in. */
  'blom.honungsmärke': all(bg(), bloom(56, 62, 5, 48, 13, '#a8c8f8', YEL, 8), ...range(5).map((i) => rot(56, 62, i * 72, 1, line('M0 -12 L0 -28 M-4 -12 L-6 -24 M4 -12 L6 -24', '#2a3a8a', 1.6))), ring(56, 62, 22), bee(100, 22, 0.9, 30), dotted('M94 28 Q80 40 66 52', HL)),
  /** korspollinering: two separate plants of the same kind; a bee carries yellow pollen from the left plant across to the right plant along a dotted arrow. */
  'blom.korspollinering': all(bg(SKY), lawn(104), ...[22, 98].map((px) => all(stem(`M${px} 104 L${px} 60`), leaf(px, 88, 12, 3, -160), leaf(px, 82, 12, 3, -20), bloom(px, 52, 6, 16, 4.4, VIOLET, YEL, 4))), pollen(22, 52, 8, 8, 101, 1.2), pollen(98, 52, 3, 5, 103, 1.2),
    dotted('M30 46 Q60 4 90 46', HL), arrow(86, 40, 92, 48, HL, 2.4), bee(60, 22, 1), pollen(64, 30, 6, 6, 105, 1.1), line('M60 104 L60 70', C.grey2, 1.4, '3 3')),
  /** självpollinering: one single flower, no insects; a small orange circular arrow goes from its own yellow stamen tips to its own pistil top. */
  'blom.självpollinering': all(bg(), ground, stem('M60 112 L60 82', 3), diagram('none'), dotted('M42 38 Q48 26 57 36', HL), dotted('M78 38 Q72 26 63 36', HL), arrow(52, 30, 57, 36, HL, 2), arrow(68, 30, 63, 36, HL, 2), pollen(50, 30, 5, 6, 111, 1), pollen(70, 30, 5, 6, 113, 1)),
  /** insektspollinerad: a big colourful, scented flower with a bee and a butterfly visiting it, ringed in orange; beside it, grey, grass blowing in the wind as contrast. */
  'blom.insektspollinerad': all(bg(), ground, stem('M44 112 L44 64', 2.4), leaf(44, 92, 14, 3.4, -160), bloom(44, 54, 6, 26, 7, MAGENTA, YEL, 6), line('M26 30 q-3 -3 0 -6 M62 28 q3 -3 0 -6', '#c8a0d0', 1.2), bee(70, 40, 0.9, 20), butterfly(20, 70, 0.9, ORANGE, -20), ring(44, 54, 34, 30),
    greyed(...[94, 100, 106].map((gx, i) => all(line(`M${gx} 112 Q${gx + 4} 90 ${gx + 8} 70`, GRASS2, 1.4), ...range(4).map((j) => ellipse(gx + 6 + j * 0.6, 74 + j * 4, 1.4, 2, '#c8b870', C.ink, 0.4)), i === 1 ? line('M80 70 L90 70 M82 78 L92 78', C.grey, 1.2) : '')))),
  /** vindpollinerad: grass and a birch catkin releasing clouds of yellow pollen that blow away along wind lines, ringed in orange; beside it, grey, a flower with a bee as contrast. */
  'blom.vindpollinerad': all(bg(SKY), ground, ...[18, 26, 34].map((gx) => all(line(`M${gx} 112 Q${gx + 2} 90 ${gx + 6} 64`, GRASS2, 1.6), ...range(5).map((j) => ellipse(gx + 5 + j * 0.4, 66 + j * 4, 1.6, 2.4, '#c8b870', C.ink, 0.5)))), line('M14 20 Q30 14 50 18', BARK, 2), ...[24, 36].map((cx) => all(line(`M${cx} 17 L${cx} 20`, BARK, 1), path(`M${cx - 2} 20 L${cx + 2} 20 L${cx + 1.4} 36 L${cx - 1.4} 36 Z`, '#c8a860', C.ink, 0.6))),
    line('M40 40 Q56 34 72 40 M36 60 Q56 54 74 60', '#7a9ab0', 1.6), arrow(64, 50, 78, 50, '#7a9ab0', 2.2), pollen(52, 40, 18, 18, 121, 1), pollen(56, 62, 14, 14, 123, 1), ring(36, 54, 30, 40),
    greyed(stem('M98 112 L98 84', 2), bloom(98, 76, 6, 14, 4, PINK, YEL, 3.4), bee(108, 64, 0.6))),
  /** bivänlig: a balcony box full of different flowers with bees and a bumblebee around them, a small insect hotel and a heart; beside it, grey, a bare cut lawn and a spray bottle as contrast. */
  'blom.bivänlig': all(bg(SKY), rect(8, 92, 60, 16, '#c8703a', 2, C.ink, 1.4), ...[16, 28, 40, 52, 62].map((px, i) => all(stem(`M${px} 92 L${px} ${68 - (i % 2) * 6}`), [() => bloom(px, 64 - (i % 2) * 6, 6, 9, 2.6, VIOLET, YEL, 2), () => bloom(px, 64 - (i % 2) * 6, 12, 8, 1.2, WHITE, YEL, 2.4), () => bloom(px, 64 - (i % 2) * 6, 5, 9, 3, YEL, GOLD, 2)][i % 3]!())),
    bee(30, 40, 0.8), bumble(54, 34, 0.8), bee(12, 50, 0.6, -20), path('M44 24 c-2 -4 -8 -2 -6 2 l6 6 l6 -6 c2 -4 -4 -6 -6 -2 Z', RED, C.ink, 0.8), at(70, 70, 1, rect(0, 0, 12, 16, WOOD, 1, C.ink, 1), ...range(6).map((i) => circle(3 + (i % 2) * 6, 3 + Math.floor(i / 2) * 5, 1.6, '#4a3020', null))),
    greyed(rect(86, 104, 28, 4, GRASS, 0, null), at(100, 100, 1, rect(-5, -16, 10, 16, '#7ab0d8', 2, C.ink, 1), rect(-3, -22, 6, 6, '#7ab0d8', 1, C.ink, 1), line('M3 -20 L10 -20', C.ink, 1.4), line('M12 -22 l4 -2 M12 -20 l5 0 M12 -18 l4 2', C.grey, 0.8)))),

  // ── 2815 Medicinalväxter och kryddörter ──
  /** medicinalväxt: a chamomile plant beside a stone mortar with crushed leaves, a jar of salve and a cup of herbal tea – a plant used as medicine. */
  'blom.medicinalväxt': all(bg(), table(96), kamomill(30, 96, 1.6), path('M58 96 C54 86 56 78 60 76 L84 76 C88 78 90 86 86 96 Z', '#a8a29a', C.ink, 1.4), ellipse(72, 76, 12, 3, '#6a7a5a', C.ink, 1), leaf(66, 74, 6, 1.6, -20, LEAF2), leaf(76, 74, 6, 1.6, -150, LEAF2), line('M80 76 L92 58', '#c8b090', 3.4), jar(100, 96, '#f0e8c0'), leaf(97, 88, 5, 2, -30, LEAF)),
  /** rosmarin: sprigs of rosemary – woody stems with narrow, needle-like dark green leaves and tiny pale blue flowers – on a cutting board beside roast potatoes. */
  'blom.rosmarin': all(bg(), rect(10, 80, 100, 22, '#d8b88a', 4, C.ink, 1.4), rosmarin(36, 92, 1.4, 70), rosmarin(50, 98, 1.2, 80), ...[[84, 88], [96, 92], [90, 82]].map(([px, py]) => ellipse(px!, py!, 7, 5, '#e8b85a', C.ink, 1)), rosmarin(60, 64, 1.1, 0)),
  /** oregano: a sprig of oregano with small round leaves and tiny pink flowers, and dried oregano sprinkled over a slice of pizza. */
  'blom.oregano': all(bg(), oregano(30, 100, 2), path('M60 100 L112 100 L86 52 Z', '#f6d07a', C.ink, 1.4), path('M64 96 L108 96 L86 58 Z', '#e85a3a', null), ...[[80, 82], [92, 86], [86, 72]].map(([px, py]) => circle(px!, py!, 3, '#f6e0a0', C.ink, 0.6)), dots(70, 70, 32, 24, 30, '#4a7a3a', 131, 0.8)),
  /** salvia: a sage plant with soft, grey-green, velvety oval leaves and a short spike of violet flowers. */
  'blom.salvia': all(bg(), rect(4, 104, 112, 8, '#8a7a5a', 0, null), salvia(58, 106, 2.1)),
  /** mynta: sprigs of fresh green mint with toothed leaves in pairs, in a glass of water with ice cubes. */
  'blom.mynta': all(bg(), table(96), path('M44 96 L40 50 L76 50 L72 96 Z', GLASS, C.ink, 1.6), rect(42, 60, 32, 34, '#cfeaf6', 0, null), rect(48, 66, 8, 8, WHITE, 1, '#9ac8e0', 0.8), rect(60, 72, 8, 8, WHITE, 1, '#9ac8e0', 0.8), myntaSprig(58, 70, 1.4), path('M44 96 L40 50 L76 50 L72 96 Z', 'none', C.ink, 1.6), myntaSprig(94, 96, 1)),
  /** pepparmynta: a peppermint plant with dark green leaves and purplish stems, a steaming cup of peppermint tea and a white mint sweet. */
  'blom.pepparmynta': all(bg(), table(96), myntaSprig(30, 96, 1.8, '#2f8a3f', '#7a3a6a'), mug(76, 96, WHITE, '#a8c890'), steam(76, 78), leaf(72, 84, 6, 2, -20, '#2f8a3f'), at(102, 92, 1, circle(0, 0, 5, WHITE, C.ink, 1), path('M-5 0 L-9 -3 L-9 3 Z M5 0 L9 -3 L9 3 Z', '#c8e8d0', C.ink, 0.8))),
  /** kamomill: chamomile – small flowers with white petals folding backwards around a domed yellow centre and feathery leaves – with a cup of chamomile tea. */
  'blom.kamomill': all(bg(), table(96), kamomill(36, 96, 2.4), mug(88, 96, WHITE, '#e8d070'), steam(88, 78), bloom(85, 83, 10, 4, 0.8, WHITE, YEL, 1.2)),
  /** ringblomma: a bright orange pot marigold with many petals, beside an open jar of orange-yellow salve. */
  'blom.ringblomma': all(bg(), table(96), ringblomma(40, 96, 2.2), jar(88, 96, '#f6c060'), ellipse(88, 82, 6, 1.6, '#f0a030', C.ink, 0.6)),
  /** johannesört: St John's wort – clusters of small yellow star-shaped flowers with many thin stamens on a reddish stem with paired leaves full of tiny light dots. */
  'blom.johannesört': all(bg(SKY), lawn(100, MEADOW), johannesort(58, 106, 2.4)),
  /** örtte: a glass teapot and a cup of tea with loose herb leaves and small flowers floating in the hot water, with steam rising. */
  'blom.örtte': all(bg(), table(96), path('M30 96 C18 90 18 66 34 60 L58 60 C74 66 74 90 62 96 Z', GLASS, C.ink, 1.6), path('M24 80 C26 92 34 95 40 95 L54 95 C62 94 68 88 68 80 Z', '#e8d890', null), leaf(36, 86, 6, 2, -20), leaf(52, 82, 6, 2, -160), bloom(44, 90, 8, 4, 0.8, WHITE, YEL, 1.2), path('M30 96 C18 90 18 66 34 60 L58 60 C74 66 74 90 62 96 Z', 'none', C.ink, 1.6),
    rect(38, 54, 16, 6, GLASS, 2, C.ink, 1.2), path('M70 72 C80 70 82 64 86 60', 'none', C.ink, 2), mug(96, 96, WHITE, '#e8d890'), leaf(92, 84, 5, 1.6, -20), steam(96, 78)),
  /** huskur: a grandmother hands a steaming cup to a sick child sitting wrapped in a blanket; a honey jar and a lemon stand on the table beside them. */
  'blom.huskur': all(bg(), fig(30, '#8a6ab8', 'smile', { hair: '#c8c8c8', hairStyle: 'long' }), path('M66 112 L66 72 C66 62 100 62 100 72 L100 112 Z', '#7aa8d8', C.ink, 1.4), circle(83, 56, 10, C.skin, C.ink, 1.6), path('M73 54 C73 42 93 42 93 54 C88 50 78 50 73 54 Z', C.hair, C.ink, 1), circle(79, 56, 1, C.ink, null), circle(87, 56, 1, C.ink, null), path('M80 61 q3 -1.6 6 0', 'none', C.ink, 1), ellipse(83, 59, 2, 1, '#f08080', null), rect(74, 46, 18, 4, WHITE, 1, C.ink, 0.8),
    arm(42, 46, 56, 64), mug(60, 70, WHITE, '#e8c060'), steam(60, 54), rect(4, 96, 30, 4, WOOD, 1, C.ink, 1), jar(14, 96, '#f2b630'), ellipse(28, 92, 5, 4, YEL, C.ink, 1)),
  /** naturläkemedel: a medicine box with a green leaf on it and a blister of tablets beside a fresh plant, with a round green approval stamp with a tick. */
  'blom.naturläkemedel': all(bg(), table(96), box(18, 96, 40, 30, WHITE), leaf(28, 80, 16, 6, -40, LEAF), rect(64, 82, 26, 14, '#d8dce4', 2, C.ink, 1), ...range(6).map((i) => circle(69 + (i % 3) * 8, 86 + Math.floor(i / 3) * 6, 2.2, WHITE, C.ink, 0.6)), johannesort(100, 96, 1.1), check(44, 52, 1.4)),

  // ── 2816 Giftiga växter ──
  /** giftväxt: a plant with shiny black berries and a red-bordered warning triangle with an exclamation mark beside it. */
  'blom.giftväxt': all(bg(), ground, stem('M50 112 L50 40', 2.4), ...range(4).map((i) => leaf(50, 100 - i * 14, 14, 4, i % 2 ? -20 : -160, '#3f8a3a')), ...[[46, 42], [54, 44], [50, 36], [42, 50], [58, 52]].map(([bx, by]) => all(circle(bx!, by!, 4, '#2a2a3a', C.ink, 1), circle(bx! - 1.4, by! - 1.4, 1, WHITE, null))), warn(92, 52, 2)),
  /** förgiftning: a sick person, pale green in the face, holding the stomach beside a plant with red berries; one berry has a bite out of it and a warning triangle stands near. */
  'blom.förgiftning': all(bg(), ground, P({ x: 46, top: '#e8a040', mood: 'sick', skin: '#cfe0b0' }), arm(36, 50, 46, 74), arm(56, 50, 46, 76), stem('M92 112 L92 70', 2), leaf(92, 96, 12, 3, -160), ...[[88, 72], [96, 74], [92, 66]].map(([bx, by]) => circle(bx!, by!, 3.4, RED, C.ink, 0.8)), path('M84 104 a4 4 0 1 1 6 0 l-2 -2 Z', RED, C.ink, 0.8), warn(100, 36, 1.2), line('M22 30 q4 -3 0 -6 M70 28 q4 -3 0 -6', '#8ab060', 1.4)),
  /** förtära: a close-up face putting a red berry into the open mouth; an arrow shows the berry going into the mouth. */
  'blom.förtära': all(bg(), circle(56, 60, 36, C.skin, C.ink, 2.2), path('M20 52 C18 18 94 18 92 52 C82 32 30 32 20 52 Z', C.hair, C.ink, 2), circle(42, 54, 3, C.ink, null), circle(70, 54, 3, C.ink, null), ellipse(56, 78, 9, 7, '#a83a3a', C.ink, 1.8),
    circle(98, 70, 5, RED, C.ink, 1), line('M98 65 L99 61', STEM, 1.2), arrow(92, 72, 68, 78, HL, 2.6)),
  /** fingerborgsblomma: a tall foxglove with a long row of pink tube-shaped flowers hanging on one side of the stem, spotted inside, above big leaves. */
  'blom.fingerborgsblomma': all(bg(SKY), lawn(104), fingerborg(52, 108, 1.9)),
  /** stormhatt: a tall monkshood with a spike of deep blue flowers shaped like little hoods or helmets and deeply divided leaves. */
  'blom.stormhatt': all(bg(SKY), lawn(104), stormhatt(56, 108, 1.9)),
  /** odört: cowbane – a plant with white flowers in a flat umbrella-shaped cluster and finely divided leaves – growing in wet ground at the edge of a lake; a warning triangle beside it. */
  'blom.odört': all(bg(SKY), rect(4, 92, 112, 20, WATER, 0, null), line('M70 98 q6 -2 12 0 M86 106 q6 -2 12 0', WATER2, 0.8), path('M4 92 L50 92 C56 100 52 106 44 112 L4 112 Z', '#7a8a5a', null), odort(40, 104, 1.6), warn(96, 40, 1.4)),
  /** tibast: a mezereon twig with small pink flowers sitting straight on the bare stem in early spring, and, in a second picture beside it, the same twig in summer with leaves and shiny red berries. */
  'blom.tibast': all(bg(), ground, tibastTwig(36, 108, 1.8), line('M64 20 L64 108', C.grey2, 1.4, '3 3'), at(90, 108, 1.8, line('M0 0 L0 -44', BARK, 2.6), ...range(5).map((i) => circle(i % 2 ? 2.6 : -2.6, -12 - i * 5, 2, RED, C.ink, 0.6)), leaf(0, -38, 9, 2.6, -150), leaf(0, -40, 9, 2.6, -30), leaf(0, -44, 8, 2.4, -90))),
  /** besksöta: bittersweet nightshade climbing a fence by a lake, with violet flowers that have a yellow cone in the middle and hanging shiny red oval berries. */
  'blom.besksöta': all(bg(SKY), fence(8, 112, 108), besksota(56, 108, 2)),
  /** jätteloka: giant hogweed – an enormous plant with huge white umbrella-shaped flower heads and big jagged leaves – much taller than a person standing beside it, in strong sun. */
  'blom.jätteloka': all(bg(SKY), sunAt(102, 18, 6), lawn(104), jatteloka(50, 108, 1.1), fig(96, '#3a7ad0', 'shock', { h: 0.48 })),
  /** växtsaft: a broken plant stem with drops of sap oozing out of the broken end, ringed in orange. */
  'blom.växtsaft': all(bg(), ground, stem('M50 112 L50 50', 5), leaf(50, 92, 16, 4, -160), path('M47 50 L49 46 L51 49 L53 45 L53 50 Z', '#b0d890', C.ink, 1), ...[[52, 56], [55, 64], [54, 74]].map(([dx, dy], i) => path(`M${dx} ${dy! - 4} C${dx! + 3} ${dy} ${dx! + 2} ${dy! + 4} ${dx} ${dy! + 4} C${dx! - 2} ${dy! + 4} ${dx! - 3} ${dy} ${dx} ${dy! - 4} Z`, i % 2 ? '#e8f0c8' : '#d8e8a8', C.ink, 0.8)),
    rot(84, 40, 40, 1, stem('M0 0 L0 -26', 5), leaf(0, -14, 14, 4, -30)), ring(54, 60, 12, 20)),

  // ── 2817 Växtbestämning ──
  /** växtbestämning: a person crouching in the grass looks closely at a flower with an open plant book in one hand; a question mark changes into a tick over the flower. */
  'blom.växtbestämning': all(bg(SKY), lawn(104), fig(34, '#3a8a6a', 'calm'), book(54, 70, 0.9, all(at(-8, -10, 0.3, bloom(0, 0, 5, 20, 6, YEL, GOLD, 5)), textLines(4, -14, 10, 4))), stem('M84 104 L84 76'), bloom(84, 70, 5, 12, 3.4, YEL, GOLD, 3), qmark(78, 34, 1.1), arrow(88, 34, 96, 34, HL, 2), check(104, 34, 1.1)),
  /** artbestämma: three similar blue flowers; a magnifying glass picks out the one that matches the picture in an open book, and a tick links the book picture with that flower. */
  'blom.artbestämma': all(bg(), ground, ...[20, 44, 68].map((px, i) => all(stem(`M${px} 112 L${px} 86`), bloom(px, 80, [6, 5, 8][i]!, 12, 3, BLUE, [WHITE, YEL, WHITE][i]!, 2.6, i * 10))), lupp(44, 80, 12), ring(44, 80, 18), book(94, 66, 1.2, all(at(-8, -10, 0.4, bloom(0, 0, 5, 20, 6, BLUE, YEL, 5)), textLines(4, -15, 9, 4))), check(94, 86, 1.1), dotted('M84 82 L62 82', HL)),
  /** släkte: three stacked levels: a wide grey box at the top (the family), three boxes in the middle row (genera) and plants at the bottom (species); only the middle genus box is coloured and ringed together with its three close relatives – three bell flowers of the same shape in different colours – while the other genera and their different flowers are grey. */
  'blom.släkte': all(bg(), greyed(rect(10, 6, 100, 12, '#f6d8a0', 3, C.ink, 1.4), line('M60 18 L60 24 M20 24 L100 24 M20 24 L20 30 M60 24 L60 30 M100 24 L100 30', C.ink, 1.4),
    rect(8, 30, 24, 10, '#f6e8b0', 3, C.ink, 1.2), rect(88, 30, 24, 10, '#f6e8b0', 3, C.ink, 1.2), line('M20 40 L20 66 M100 40 L100 66', C.ink, 1.2), stem('M20 108 L20 82'), umbel(20, 82, 9, WHITE, 7), stem('M100 108 L100 80'), bloom(100, 76, 14, 10, 1.4, WHITE, YEL, 3)),
    rect(46, 30, 28, 12, '#f6c0d8', 3, C.ink, 1.6), at(60, 36, 0.5, bell(0, -6, 1.2, VIOLET)), line('M60 42 L60 50 M42 50 L78 50 M42 50 L42 58 M60 50 L60 58 M78 50 L78 58', C.ink, 1.6),
    ...[[38, VIOLET], [56, SKYBLUE], [74, MAGENTA]].map(([px, col]) => all(stem(`M${px} 108 L${px} 66 Q${px as number + 2} 62 ${px as number + 4} 64`, 1.4), leaf(px as number, 96, 8, 2, -30), at(px as number + 4, 64, 1, bell(0, 0, 0.95, col as string)))), ring(60, 70, 24, 44), ground),
  /** växtfamilj: one big orange frame shaped like an umbrella roof gathers several clearly different plants – tall and short, white, yellow and pink – that all share one feature: umbrella-shaped flower heads; outside the frame, grey, a daisy and a bell flower that do not belong. */
  'blom.växtfamilj': all(bg(), ground, path('M14 108 L14 34 C30 10 90 10 106 34 L106 108 Z', '#fff4e8', HL, 2.6),
    stem('M30 108 L30 50', 2), divLeaf(30, 90, 10, -150, LEAF), umbel(30, 50, 12, WHITE, 9), stem('M56 108 L56 70', 1.6), leaf(56, 96, 9, 2, -30), umbel(56, 70, 9, '#e8e060', 7), stem('M80 108 L80 40', 2.4), palmLeaf(80, 84, 1.2), umbel(80, 40, 14, '#f4b8cc', 11), stem('M98 108 L98 78', 1.4), umbel(98, 78, 6, WHITE, 6),
    greyed(stem('M6 112 L6 96', 1.2), bloom(6, 92, 10, 6, 1, WHITE, YEL, 2), stem('M114 112 L114 98', 1.2), at(114, 92, 1, bell(0, 0, 0.6, SKYBLUE)))),
  /** vetenskapligt namn: one flower at the bottom; above it, three speech bubbles from different countries, each with a different flag (coloured stripes, no text) and a different scribbled name, all send dashed arrows to one and the same shared label: a two-word italic scribble with a small open book, tied to the flower. */
  'blom.vetenskapligt-namn': all(bg(), ground,
    ...[[20, ['#2a5aa8', '#f2c14e', '#2a5aa8']], [60, [WHITE, RED, WHITE]], [100, ['#2a8a4a', WHITE, '#d64545']]].map(([bx, cols], i) => all(
      path(`M${bx as number - 17} 8 L${bx as number + 17} 8 L${bx as number + 17} 28 L${bx as number + 4} 28 L${bx} 34 L${bx as number - 3} 28 L${bx as number - 17} 28 Z`, WHITE, C.ink, 1.4),
      ...(cols as string[]).map((c, j) => rect(bx as number - 14, 11 + j * 4, 10, 4, c, 0, null)), rect(bx as number - 14, 11, 10, 12, 'none', 0, C.ink, 0.8),
      path(i === 0 ? `M${bx as number - 1} 18 c2 -4 3 -4 4 0 c1 3 2 3 3 0 c1 -3 2 -3 4 0` : i === 1 ? `M${bx as number - 1} 18 l3 -4 l3 4 l3 -4 l3 4` : `M${bx as number - 1} 16 c3 0 3 4 6 4 c3 0 3 -4 6 -4`, 'none', '#5a5a6a', 1.2))),
    dotted('M20 36 L44 52', HL), dotted('M60 36 L60 50', HL), dotted('M100 36 L76 52', HL), arrow(40, 49, 44, 52, HL, 2), arrow(60, 46, 60, 51, HL, 2), arrow(80, 49, 76, 52, HL, 2),
    rect(30, 52, 60, 20, '#fff8e0', 3, HL, 2.4), book(40, 68, 0.5), path('M48 64 c2 -6 4 -6 5 0 c1 4 3 4 4 0 c1 -4 3 -4 4 0', 'none', C.navy, 1.6), path('M66 64 c1 -4 3 -4 4 0 c1 4 3 4 4 0 c1 -4 3 -4 4 0 c1 4 2 3 3 0', 'none', C.navy, 1.6),
    line('M60 72 L60 80', C.ink, 1), vitsippa(58, 112, 1.0)),
  /** bladform: a row of different leaf shapes – round, heart-shaped, needle-thin, lobed and divided into many small leaflets – with one shape ringed to show that the shape is what you look at. */
  'blom.bladform': all(bg(), circle(20, 40, 10, LEAF, C.ink, 1.2), line('M20 50 L20 56', STEM, 1.4), path('M50 54 C38 44 36 30 44 28 C48 28 50 32 50 34 C50 32 52 28 56 28 C64 30 62 44 50 54 Z', LEAF, C.ink, 1.2), line('M84 26 L84 56', LEAF2, 2.4), path('M104 56 L104 26 M104 50 L96 44 M104 50 L112 44 M104 40 L97 34 M104 40 L111 34 M104 32 L100 26 M104 32 L108 26', 'none', LEAF, 3),
    path('M34 104 C22 100 20 88 26 84 C22 78 28 72 34 76 C36 68 44 68 46 76 C52 72 58 78 54 84 C60 88 58 100 46 104 Z', LEAF, C.ink, 1.2), line('M40 104 L40 110', STEM, 1.4), divLeaf(70, 90, 40, 0, LEAF), ring(40, 90, 22, 20)),
  /** tandad: a leaf whose edge has many small sharp teeth like a saw, ringed in orange; beside it, grey, a leaf with a completely smooth edge as contrast. */
  'blom.tandad': all(bg(), toothLeaf(10, 60, 66, 22, 0, LEAF, 9), ring(43, 60, 38, 30), line('M10 60 L4 60', STEM, 2), greyed(leaf(86, 60, 28, 10, 0, LEAF))),
  /** flora (2): an open field guide with pictures of different flowers and lines of text on its pages, with a real flower lying beside it. */
  'blom.flora.2': all(bg(), at(60, 96, 2.8, path('M0 0 L-18 -3 L-18 -26 L0 -23 Z', WHITE, C.ink, 0.6), path('M0 0 L18 -3 L18 -26 L0 -23 Z', WHITE, C.ink, 0.6), line('M0 0 L0 -23', C.ink, 0.6),
    at(-12, -18, 0.2, vitsippa(0, 20, 1)), at(-6, -9, 0.2, blasippa(0, 20, 1)), textLines(-16, -22, 6, 3), textLines(-16, -12, 6, 3), at(8, -18, 0.2, blaklocka(0, 20, 1)), at(13, -9, 0.2, gullviva(0, 20, 1)), textLines(3, -22, 6, 3), textLines(3, -12, 6, 3))),
  /** bestämningsnyckel: a branching diagram: from one start point the path splits again and again in two (left: toothed leaf, right: smooth leaf, and so on) and ends at one single flower, which is ringed. */
  'blom.bestämningsnyckel': all(bg(), circle(60, 14, 5, C.navy, null), line('M60 19 L60 26 M30 26 L90 26 M30 26 L30 34 M90 26 L90 34', C.ink, 1.6), toothLeaf(20, 42, 18, 5, 0, LEAF, 5), at(90, 42, 1, leaf(-9, 0, 18, 5, 0, LEAF)), greyed(line('M90 50 L90 62', C.ink, 1.6), cross(90, 70, 1)),
    line('M30 50 L30 58 M14 58 L46 58 M14 58 L14 64 M46 58 L46 64', C.ink, 1.6), bloom(14, 72, 5, 10, 3, WHITE, YEL, 2.4), bloom(46, 72, 6, 10, 2.6, BLUE, WHITE, 2.4), greyed(line('M14 80 L14 92', C.ink, 1.4), cross(14, 100, 0.9)), line('M46 80 L46 92', HL, 2.4), at(46, 108, 1, stem('M0 0 L0 -8'), bloom(0, -12, 7, 12, 3, BLUE, WHITE, 2.6)), ring(46, 98, 12, 14)),
  /** förväxlingsart: two plants that look almost the same (both with white umbrella-shaped flowers) side by side with an "≈" between them; the left one has a green tick, the right one a red warning triangle. */
  'blom.förväxlingsart': all(bg(SKY), lawn(104), dill(30, 108, 1.6), odort(90, 108, 1.4), line('M54 60 q3 -3 6 0 q3 3 6 0 M54 68 q3 -3 6 0 q3 3 6 0', C.ink, 1.8), check(30, 20, 1.2), warn(90, 20, 1.2)),
  /** pressa (2): flowers lying flat between the pages of an open book and a heavy stack of books pressing down on another book with a flower sticking out; an arrow pushes down. */
  'blom.pressa.2': all(bg(), table(96), rect(14, 84, 44, 12, '#d8c8a0', 2, C.ink, 1.2), line('M14 90 L58 90', C.ink, 0.6), at(40, 86, 0.6, leaf(0, 0, 12, 3, -10, '#7aa860')), rect(16, 72, 40, 12, '#c84a3a', 2, C.ink, 1.2), rect(18, 60, 36, 12, '#3a6aa8', 2, C.ink, 1.2), rect(20, 50, 32, 10, '#4a8a5a', 2, C.ink, 1.2), arrow(36, 20, 36, 44, HL, 3),
    at(88, 92, 1, path('M-26 0 L0 -4 L26 0 L26 -4 L0 -8 L-26 -4 Z', WHITE, C.ink, 1.2)), at(76, 88, 0.9, bloom(0, 0, 6, 12, 3, VIOLET, YEL, 2.4)), at(96, 88, 0.9, bloom(0, 0, 14, 10, 1.4, WHITE, YEL, 2.4)), line('M76 88 L72 96 M96 88 L100 96', STEM, 1)),
  /** herbarium: a large sheet of paper with a pressed, flat plant fastened with small strips of tape and a label in the corner, on top of a stack of more such sheets. */
  'blom.herbarium': all(bg(), rect(26, 18, 74, 92, '#e8e0cc', 2, C.ink, 1), rect(22, 14, 74, 92, WHITE, 2, C.ink, 1.4), at(52, 92, 1.6, stem('M0 0 Q2 -20 0 -40', 1.4, '#6a8a4a'), leaf(0, -10, 12, 3, -160, '#7a9a5a'), leaf(0, -18, 12, 3, -20, '#7a9a5a'), bloom(0, -44, 5, 10, 3, '#b090d0', '#e0d070', 2.4)),
    ...[[40, 88, -20], [62, 64, 20], [50, 30, -10]].map(([tx, ty, a]) => rot(tx!, ty!, a!, 1, rect(-5, -2, 10, 4, 'rgba(240,230,190,0.9)', 0.5, '#b8a880', 0.6))), rect(70, 88, 22, 14, '#f6f0dc', 1, C.ink, 1), textLines(73, 92, 16, 3)),
  /** inventera: a person with a clipboard stands by a square frame laid on the meadow and counts the plants inside it, making tally marks. */
  'blom.inventera': all(bg(SKY), lawn(96, MEADOW), fig(26, '#d06a3a', 'calm'), rect(36, 60, 18, 24, '#d8b88a', 2, C.ink, 1.4), rect(39, 64, 12, 18, WHITE, 0, null), line('M41 68 L41 74 M43 68 L43 74 M45 68 L45 74 M47 68 L47 74 M40 73 L48 69 M41 77 L41 81 M43 77 L43 81', C.ink, 0.9), path('M60 112 L76 98 L116 98 L100 112 Z', 'none', HL, 2.4),
    bloom(76, 104, 6, 6, 1.8, WHITE, YEL, 1.4), bloom(94, 102, 5, 6, 2, YEL, GOLD, 1.2), bloom(86, 108, 5, 6, 2, BLUE, WHITE, 1.2), tuft(100, 108, 6), tuft(80, 110, 5)),
  /** exkursion: a small group of people with backpacks walks behind a guide through a meadow; the guide holds up a flower to show it to them. */
  'blom.exkursion': all(bg(SKY), lawn(100, MEADOW), fig(26, '#3a8a6a', 'smile', { h: 0.9 }), arm(36, 46, 42, 30), stem('M42 30 L42 20', 1.4), bloom(42, 18, 5, 8, 2.4, YEL, GOLD, 2), fig(62, '#d06a3a', 'smile', { h: 0.82, hairStyle: 'long' }), rect(72, 50, 6, 14, '#5a7ad0', 2, C.ink, 1), fig(86, '#8a6ab8', 'smile', { h: 0.8 }), fig(106, '#e0b030', 'smile', { h: 0.78, hairStyle: 'long' }), prastkrage(10, 112, 0.5), blaklocka(48, 112, 0.5)),
};
