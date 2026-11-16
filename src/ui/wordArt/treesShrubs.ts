/**
 * Natur & geografi → Växter & svampar → Träd & buskar, 2801–2807 (0.45): Swedish deciduous trees, conifers,
 * fruit trees, ornamental shrubs, the parts of a tree, annual rings and growth, and the tree species of the forest.
 * Recurring signs: a tree species is drawn with its typical shape and a white magnifier disc that shows its leaf,
 * needle or fruit up close; an orange ring, oval or arrow marks the part that the word names. Abstract words are
 * small symbolic scenes with a grey reference beside them as contrast. Digits only; no words, no brands, no
 * pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, star, type Svg } from './kit';
import { HL, arm } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const SKY = '#e2eff8';
const GRASS = '#8cc96a';
const GRASS2 = '#6fae55';
const LEAF = '#5aa04a';
const LEAF2 = '#3f8a3e';
const LIGHT = '#a9dc6a';
const NEEDLE = '#2f6b45';
const NEEDLE2 = '#3f7a4a';
const BARK = '#8a5a34';
const BARK2 = '#6e4526';
const PINEBARK = '#c8643a';
const BIRCH = '#f4f1ea';
const SNOW = '#f7f8fa';
const AUT_Y = '#e8b830';
const AUT_O = '#e8792e';
const AUT_R = '#c8402e';
const BERRY = '#d6332a';
const APPLE = '#d8433a';
const PEAR = '#c2cf4a';
const PLUM = '#6a3f8a';
const BLOSSOM = '#f7c6d6';
const LILAC = '#a77fd0';
const SOIL = '#8a6a48';
const WOODL = '#f0d8a8';
const WOODD = '#b07a44';
const AMBER = '#e8a22a';
const WALL = '#e8d9c0';
const ROOF = '#b84a3a';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (x: number, y: number, a: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${a}) scale(${s})`, ...k);
const num = (x: number, y: number, n: string, size = 9, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${n}</text>`;

// ── Scenery ──────────────────────────────────────────────────────────
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const field = (y = 100, col: string = GRASS) => rect(4, y, 112, 112 - y, col, 0, null);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.4);
const sun = (x: number, y: number, r = 7) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 6))} ${f1(y + Math.sin(a) * (r + 6))}`, C.gold, 1.8); }), circle(x, y, r, C.yellow, C.ink, 1.2));
const cloud = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', col, C.ink, 1.2));
const rain = (x: number, y: number, n = 4) => line(range(n).map((i) => `M${x + i * 7} ${y + (i % 2) * 4} l-2 6`).join(' '), '#4f9ccc', 1.6);
const flake = (x: number, y: number, s = 1) => at(x, y, s, line('M0 -4 L0 4 M-3.5 -2 L3.5 2 M-3.5 2 L3.5 -2', '#7fb3d9', 1.2));
const mountain = (x: number, y: number, w: number, h: number, col = '#9a8a78') => all(path(`M${x - w / 2} ${y} L${x} ${y - h} L${x + w / 2} ${y} Z`, col, C.ink, 1.3), path(`M${f1(x - w * 0.14)} ${f1(y - h * 0.72)} L${x} ${y - h} L${f1(x + w * 0.14)} ${f1(y - h * 0.72)} L${f1(x + w * 0.05)} ${f1(y - h * 0.78)} L${f1(x - w * 0.04)} ${f1(y - h * 0.7)} Z`, SNOW, C.ink, 0.9));
const house = (x: number, y: number, s = 1, col: string = WALL, roof: string = ROOF) => at(x, y, s, rect(-12, -16, 24, 16, col, 0, C.ink, 1.1), path('M-14 -16 L0 -28 L14 -16 Z', roof, C.ink, 1.1), rect(-3, -9, 6, 9, C.dark, 0, null), rect(5, -12, 5, 5, '#bfe3f5', 0, C.ink, 0.8));
const okC = (x: number, y: number, r = 7) => all(circle(x, y, r, '#3a9a5a', C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, f1(r * 0.24)));
/** The white magnifier disc that shows a detail; (fx, fy) is the spot on the tree it comes from. */
const zoom = (cx: number, cy: number, r: number, fx: number, fy: number, inner: Svg) => all(
  line(`M${fx} ${fy} L${f1(cx - r * 0.7)} ${f1(cy + r * 0.7)}`, C.grey, 1.2, '2 2'), circle(fx, fy, 3, 'none', C.grey, 1.2),
  circle(cx, cy, r, C.white, C.ink, 1.6), inner);

// ── Trees ────────────────────────────────────────────────────────────
/** A cloudy crown made of overlapping discs with one outline. */
const blob = (pts: number[][], col: string, sw = 1.3) => all(...pts.map(([x, y, r]) => circle(x!, y!, r!, col, C.ink, sw)), ...pts.map(([x, y, r]) => circle(x!, y!, f1(r! - sw), col, null)));
const crownPts = (x: number, y: number, r: number, wide = 1, tall = 1) => [[x, y, r], [x - r * 0.75 * wide, y + r * 0.25, r * 0.7], [x + r * 0.75 * wide, y + r * 0.25, r * 0.7], [x - r * 0.4 * wide, y - r * 0.55 * tall, r * 0.68], [x + r * 0.4 * wide, y - r * 0.55 * tall, r * 0.68]];
const crown = (x: number, y: number, r: number, col: string = LEAF, wide = 1, tall = 1) => blob(crownPts(x, y, r, wide, tall), col);
const trunk = (x: number, y: number, w: number, h: number, col: string = BARK) => path(`M${f1(x - w / 2)} ${y} L${f1(x - w * 0.32)} ${f1(y - h)} L${f1(x + w * 0.32)} ${f1(y - h)} L${f1(x + w / 2)} ${y} Z`, col, C.ink, 1.2);
/** A plain deciduous tree with its foot at (x, y). */
const decid = (x: number, y = 112, s = 1, col: string = LEAF, tr: string = BARK) => at(x, y, s, trunk(0, 0, 8, 30, tr), line('M0 -20 L-9 -30 M0 -24 L8 -33', tr, 2.6), crown(0, -42, 15, col));
const oak = (x: number, y = 112, s = 1, col: string = LEAF2) => at(x, y, s, trunk(0, 0, 12, 26, BARK2), line('M-2 -22 L-14 -30 M2 -22 L14 -32', BARK2, 3.4), crown(0, -40, 15, col, 1.5, 0.8));
const birch = (x: number, y = 112, s = 1, col: string = LIGHT) => at(x, y, s, trunk(0, 0, 6, 46, BIRCH), line('M-2 -8 L1 -8 M0 -16 L2.5 -16 M-2.5 -24 L0 -24 M0 -32 L2 -32 M-1.5 -40 L1 -40', C.ink, 1.4),
  blob([[0, -50, 10], [-8, -42, 8], [8, -42, 8], [-5, -58, 7], [5, -58, 7], [-11, -34, 5], [11, -34, 5]], col), line('M-9 -40 C-12 -34 -12 -30 -13 -26 M9 -40 C12 -34 12 -30 13 -26', LEAF2, 1));
const spruce = (x: number, y = 112, s = 1, col: string = NEEDLE) => at(x, y, s, rect(-2, -8, 4, 8, BARK, 0, C.ink, 0.9),
  path('M0 -62 L7 -48 L4 -48 L12 -32 L7 -32 L16 -16 L10 -16 L19 -8 L-19 -8 L-10 -16 L-16 -16 L-7 -32 L-12 -32 L-4 -48 L-7 -48 Z', col, C.ink, 1.2));
const pine = (x: number, y = 112, s = 1, col: string = NEEDLE2) => at(x, y, s, path('M-3 0 L-2 -46 L2 -46 L3 0 Z', BARK, C.ink, 1.1), path('M-2 -46 L-1.6 -30 L1.6 -30 L2 -46 Z', PINEBARK, null),
  line('M0 -40 L-10 -50 M0 -44 L9 -52', PINEBARK, 2), blob([[0, -56, 9], [-12, -52, 7], [12, -54, 7], [-6, -62, 6], [7, -62, 6]], col));
/** A bare deciduous tree (winter). */
const bare = (x: number, y = 112, s = 1, col: string = BARK) => at(x, y, s, trunk(0, 0, 7, 32, col), line('M0 -30 L-12 -48 M0 -30 L12 -50 M0 -26 L0 -54 M-7 -40 L-16 -42 M7 -42 L16 -40 M-12 -48 L-14 -56 M12 -50 L16 -56', col, 2.2));
/** Fruit tree: round crown with fruit discs. */
const fruitTree = (x: number, y = 112, s = 1, fruit: Svg[] = []) => at(x, y, s, trunk(0, 0, 8, 26, BARK), line('M0 -18 L-10 -28 M0 -22 L9 -30', BARK, 2.6), crown(0, -40, 15, LEAF, 1.3, 0.9), ...fruit);
const dots = (pts: number[][], col: string, r = 2.6) => all(...pts.map(([x, y]) => circle(x!, y!, r, col, C.ink, 0.9)));
const FRUIT_PTS = [[-14, -36], [-6, -46], [4, -38], [12, -48], [16, -34], [-2, -30], [-16, -48], [8, -28]];
const apple = (x: number, y: number, s = 1, col: string = APPLE) => at(x, y, s, path('M0 -7 C-4 -10 -10 -8 -10 -1 C-10 6 -5 10 0 8 C5 10 10 6 10 -1 C10 -8 4 -10 0 -7 Z', col, C.ink, 1.2), line('M0 -7 L1 -12', BARK2, 1.4), path('M1 -10 C4 -14 8 -12 8 -11 C6 -9 3 -9 1 -10 Z', LEAF, C.ink, 0.8));
const pear = (x: number, y: number, s = 1, col: string = PEAR) => at(x, y, s, path('M0 -11 C-3 -11 -4 -6 -5 -3 C-10 0 -10 10 0 10 C10 10 10 0 5 -3 C4 -6 3 -11 0 -11 Z', col, C.ink, 1.2), line('M0 -11 L1 -15', BARK2, 1.4));
const plum = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 0, 7, 8, PLUM, C.ink, 1.2), path('M0 -7 C-2 -2 -2 3 0 7', 'none', '#4a2a66', 1), line('M0 -8 L1 -12', BARK2, 1.3));
const cherry = (x: number, y: number, s = 1) => at(x, y, s, line('M-4 2 C-3 -6 0 -10 3 -12 M4 3 C4 -4 3 -9 3 -12', LEAF2, 1.2), circle(-4, 4, 3.6, '#c0182a', C.ink, 1), circle(4, 5, 3.6, '#c0182a', C.ink, 1));

// ── Leaves (pointing up, about 24 px long at scale 1) ───────────────
const vein = 'M0 11 L0 -9';
const leafOval = (x: number, y: number, a = 0, s = 1, col: string = LEAF) => rot(x, y, a, s, line('M0 11 L0 15', LEAF2, 1.4), path('M0 11 C-8 5 -8 -6 0 -13 C8 -6 8 5 0 11 Z', col, C.ink, 1.2), line(vein, LEAF2, 0.9));
const leafBirch = (x: number, y: number, a = 0, s = 1, col: string = LIGHT) => rot(x, y, a, s, line('M0 9 L0 14', LEAF2, 1.3), path('M0 9 C-5 8 -10 3 -9 1 L-7 -1 L-6 -4 L-4 -6 L-3 -9 L0 -13 L3 -9 L4 -6 L6 -4 L7 -1 L9 1 C10 3 5 8 0 9 Z', col, C.ink, 1.2), line('M0 9 L0 -10', LEAF2, 0.9));
const leafMaple = (x: number, y: number, a = 0, s = 1, col: string = LEAF) => rot(x, y, a, s, line('M0 6 L0 14', LEAF2, 1.4), path('M0 6 L-4 7 L-3 3 L-11 2 L-9 -1 L-12 -6 L-6 -5 L-6 -10 L-2 -7 L0 -14 L2 -7 L6 -10 L6 -5 L12 -6 L9 -1 L11 2 L3 3 L4 7 Z', col, C.ink, 1.2), line('M0 6 L0 -11 M0 4 L-9 -3 M0 4 L9 -3', LEAF2, 0.8));
const leafHeart = (x: number, y: number, a = 0, s = 1, col: string = LEAF) => rot(x, y, a, s, line('M0 6 L0 13', LEAF2, 1.4), path('M0 -13 C5 -9 11 -3 10 3 C9 9 3 10 0 6 C-3 10 -9 9 -10 3 C-11 -3 -5 -9 0 -13 Z', col, C.ink, 1.2), line('M0 6 L0 -10 M0 4 L-6 -2 M0 4 L6 -2', LEAF2, 0.8));
const leafRound = (x: number, y: number, a = 0, s = 1, col: string = LEAF) => rot(x, y, a, s, line('M0 8 L0 14', LEAF2, 1.4), path('M0 8 C-9 8 -11 -4 -5 -9 C-2 -11 2 -11 5 -9 C11 -4 9 8 0 8 Z', col, C.ink, 1.2), line('M0 8 L0 -8', LEAF2, 0.8));
const leafElm = (x: number, y: number, a = 0, s = 1, col: string = LEAF) => rot(x, y, a, s, line('M1 10 L1 14', LEAF2, 1.4), path('M1 10 C-10 8 -9 -4 -6 -7 L-4 -10 L-1 -12 L1 -15 L3 -11 L6 -9 L7 -5 L8 -1 L7 4 C6 8 4 10 1 10 Z', col, C.ink, 1.2), line('M1 10 L1 -12 M1 4 L-6 0 M1 0 L6 -4 M1 -4 L-5 -7', LEAF2, 0.8));
const leaflet = (x: number, y: number, a: number, s: number, col: string) => rot(x, y, a, s, path('M0 0 C-2 -2 -2 -7 0 -10 C2 -7 2 -2 0 0 Z', col, C.ink, 0.9));
/** Compound leaf: n pairs of leaflets on a stalk, plus one at the tip. */
const leafPinnate = (x: number, y: number, a = 0, s = 1, col: string = LEAF, n = 4) => rot(x, y, a, s, line('M0 16 L0 -14', LEAF2, 1.4),
  ...range(n).flatMap((i) => [leaflet(0, 10 - i * 6.5, -70, 1, col), leaflet(0, 10 - i * 6.5, 70, 1, col)]), leaflet(0, -13, 0, 1, col));
const acorn = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 3, 4.6, 6.4, '#b8823e', C.ink, 1.1), path('M-5.4 -1 C-5.4 -6 5.4 -6 5.4 -1 Z', '#7a5a34', C.ink, 1.1), line('M-4 -3 L4 -3 M-3 -1.5 L3 -1.5', '#5a4024', 0.6), line('M0 -5 L0 -8', '#5a4024', 1.3));
const berryCluster = (x: number, y: number, s = 1, col: string = BERRY) => at(x, y, s, line('M0 -10 L-6 -2 M0 -10 L0 0 M0 -10 L6 -2', LEAF2, 1), ...[[-6, 0], [-2, 2], [2, 0], [6, 1], [-4, 5], [1, 6], [5, 5], [-1, -3], [4, -3], [-5, -4]].map(([bx, by]) => circle(bx!, by!, 2.3, col, C.ink, 0.8)));
const cone = (x: number, y: number, s = 1, a = 0) => rot(x, y, a, s, ellipse(0, 0, 5, 12, '#9a6a3a', C.ink, 1.2), ...range(5).map((i) => line(`M-4.5 ${-8 + i * 4} Q0 ${-6 + i * 4} 4.5 ${-8 + i * 4}`, '#5a3a1e', 0.9)), line('M0 -12 L0 -16', BARK2, 1.4));
const needleTwig = (x: number, y: number, a = 0, s = 1, col: string = NEEDLE, len = 5) => rot(x, y, a, s, line('M0 14 L0 -14', BARK, 1.6), ...range(9).flatMap((i) => [line(`M0 ${12 - i * 3} l-${len} -3`, col, 1.4), line(`M0 ${12 - i * 3} l${len} -3`, col, 1.4)]));
const flower5 = (x: number, y: number, r: number, col: string, mid: string = C.yellow) => all(...range(5).map((i) => { const a = (i / 5) * Math.PI * 2 - Math.PI / 2; return circle(f1(x + Math.cos(a) * r), f1(y + Math.sin(a) * r), f1(r * 0.75), col, C.ink, 0.8); }), circle(x, y, f1(r * 0.55), mid, C.ink, 0.8));
const rose = (x: number, y: number, s = 1, col: string = '#d6304a') => at(x, y, s, circle(0, 0, 9, col, C.ink, 1.2), path('M-5 -2 C-4 -7 4 -7 5 -2 M-3 2 C-4 -3 3 -5 4 0 M-6 3 C-3 7 3 7 6 3', 'none', '#8a1a2e', 1.1));
const flowerBush = (x: number, y: number, col: string) => all(blob([[x, y, 11], [x - 9, y + 5, 8], [x + 9, y + 5, 8]], LEAF), dots([[x - 6, y - 4], [x + 4, y - 7], [x + 8, y + 2], [x - 10, y + 4], [x, y + 2]], col, 2.6));
const thorn =(x: number, y: number, a: number, s = 1) => rot(x, y, a, s, path('M-2 0 L0 -5 L2 0 Z', '#7a4a26', C.ink, 0.7));
/** A wooden board seen from the end: annual rings. light/dark index to highlight. */
const rings = (x: number, y: number, r: number, n: number, hl: 'none' | 'light' | 'dark' = 'none') => {
  const out: Svg[] = [circle(x, y, r + 3, BARK, C.ink, 1.4)];
  for (let i = n; i >= 1; i--) {
    const rr = f1((r * i) / n);
    out.push(circle(x, y, rr, '#c99a5c', null), circle(x, y, f1(rr - (r / n) * 0.62), WOODL, null));
  }
  out.push(circle(x, y, 1.6, '#c99a5c', null));
  if (hl === 'light') { const rr = f1((r * 3) / n - (r / n) * 0.32); out.push(circle(x, y, rr, 'none', HL, 2.6)); }
  if (hl === 'dark') { const rr = f1((r * 3) / n - (r / n) * 0.0); out.push(circle(x, y, rr, 'none', HL, 2.6)); }
  return all(...out);
};

// ── People ───────────────────────────────────────────────────────────
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: f1(ty - 38 * s), sl: f1(x - 13 * s), sr: f1(x + 13 * s) }; };
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };
const fig = (x: number, top: string, mood: Mood = 'smile', h = 1, more: Record<string, unknown> = {}) => F({ x, top, mood, h, ...more });
const saw = (x: number, y: number, a = 0, s = 1) => rot(x, y, a, s, path('M0 -3 L30 -2 L30 4 L0 6 Z', C.silver, C.ink, 1.1), line(range(10).map((i) => `M${2 + i * 3} 6 l1.5 2 l1.5 -2`).join(' '), C.ink, 0.8), rect(-10, -4, 11, 9, C.red, 3, C.ink, 1.1));

// ── Motifs ───────────────────────────────────────────────────────────
export const TREES_SHRUBS_MOTIFS: Record<string, Svg> = {
  // 2801 Svenska lövträd
  'trad.lövträd': all(bg(), field(), decid(26, 106, 1.05, LEAF), birch(60, 104, 0.95), oak(94, 106, 0.95), greyed(spruce(110, 110, 0.5)),
    zoom(24, 22, 14, 26, 56, all(leafOval(18, 23, -20, 0.6), leafMaple(29, 21, 15, 0.55)))),
  'trad.björk': all(bg(), field(), birch(40, 108, 1.55), birch(84, 106, 1.05), zoom(92, 26, 18, 52, 30, leafBirch(92, 26, 10, 1.1))),
  'trad.lönn': all(bg(), field(), at(42, 110, 1.35, trunk(0, 0, 8, 30, BARK), line('M0 -20 L-9 -30 M0 -24 L8 -33', BARK, 2.6), crown(0, -42, 15, LEAF, 1.2)), zoom(92, 28, 20, 56, 48, leafMaple(92, 27, 0, 1.25))),
  'trad.lind': all(bg(), field(), at(40, 110, 1.3, trunk(0, 0, 8, 26, BARK), blob([[0, -46, 14], [-9, -36, 11], [9, -36, 11], [0, -60, 11], [-6, -26, 8], [6, -26, 8]], LEAF)), zoom(92, 28, 20, 52, 50, leafHeart(92, 28, 0, 1.2))),
  'trad.ask.2': all(bg(), field(), at(38, 110, 1.3, trunk(0, 0, 7, 36, '#9a8a7a'), line('M0 -30 L-12 -44 M0 -32 L12 -46', '#9a8a7a', 2.4), blob([[-12, -50, 9], [12, -52, 9], [0, -60, 10], [-4, -46, 7], [6, -44, 7]], LEAF)), zoom(90, 30, 22, 50, 50, leafPinnate(90, 30, 20, 1.15, LEAF, 4))),
  'trad.alm': all(bg(), field(), at(40, 110, 1.25, trunk(0, 0, 9, 22, BARK2), line('M0 -20 L-16 -40 M0 -20 L16 -42 M0 -22 L0 -44', BARK2, 3), blob([[-18, -48, 10], [18, -50, 10], [0, -56, 11], [-9, -58, 8], [9, -58, 8]], LEAF2)),
    zoom(90, 30, 22, 54, 44, all(leafElm(84, 32, -15, 1.1), circle(100, 22, 5, '#d8e6a0', C.ink, 0.9), circle(100, 22, 1.6, '#8a7a3a', null), circle(102, 38, 5, '#d8e6a0', C.ink, 0.9), circle(102, 38, 1.6, '#8a7a3a', null)))),
  'trad.asp': all(bg(), field(), at(36, 110, 1.3, trunk(0, 0, 6, 34, '#a8b0a0'), blob([[0, -46, 9], [0, -60, 8], [-6, -38, 7], [6, -38, 7], [0, -70, 5]], '#8ec05a')),
    zoom(88, 32, 22, 46, 44, all(leafRound(84, 34, -18, 1), leafRound(96, 26, 22, 0.8), line('M70 22 q3 -3 6 0 M70 44 q3 -3 6 0 M104 42 q3 -3 6 0', C.grey, 1.2))), line('M12 22 C20 18 28 26 36 22 M8 32 C16 28 24 36 32 32', '#7fb3d9', 1.8)),
  'trad.rönn': all(bg(), field(), at(38, 110, 1.25, trunk(0, 0, 6, 30, '#9a8a7a'), line('M0 -26 L-10 -38 M0 -28 L10 -40', '#9a8a7a', 2), blob([[0, -48, 12], [-11, -40, 9], [11, -40, 9], [0, -60, 8]], LEAF), berryCluster(-8, -40, 0.55), berryCluster(8, -46, 0.55), berryCluster(-2, -56, 0.5)),
    zoom(90, 30, 22, 50, 54, all(leafPinnate(82, 32, -25, 0.95, LEAF, 4), berryCluster(98, 34, 0.9)))),
  'trad.hassel': all(bg(), field(), ...[-14, -6, 2, 10, 16].map((dx, i) => line(`M${44 + dx * 0.3} 110 L${44 + dx} ${60 - (i % 2) * 8}`, BARK, 2.4)), blob([[44, 58, 14], [30, 68, 11], [58, 68, 11], [36, 52, 10], [52, 50, 10]], LEAF),
    zoom(90, 30, 22, 54, 56, all(leafRound(82, 30, -20, 1.05), at(98, 36, 1, path('M-5 4 C-7 -4 -3 -8 0 -8 C3 -8 7 -4 5 4 Z', '#c8e090', C.ink, 0.9), ellipse(0, 4, 4.4, 5, '#b8823e', C.ink, 1))))),
  'trad.löv': all(bg(), line('M4 22 C30 26 60 22 100 14', BARK, 3), line('M60 22 L60 34', LEAF2, 1.6), leafOval(60, 64, 0, 3.2, LEAF), leafOval(24, 34, -30, 0.8), leafOval(92, 26, 25, 0.8), ring(60, 62, 34)),
  'trad.lövsprickning': all(bg(), sun(100, 18), line('M4 80 C30 74 60 70 110 56', BARK, 3.4), line('M40 72 L46 52 M78 64 L86 44', BARK, 2.4),
    ...[[46, 52], [86, 44], [108, 57]].map(([x, y]) => all(ellipse(x!, y!, 3, 5, '#7a9a4a', C.ink, 0.9), leafOval(x! - 4, y! - 6, -30, 0.45, LIGHT), leafOval(x! + 4, y! - 6, 30, 0.45, LIGHT))),
    ellipse(22, 78, 3, 5, '#7a9a4a', C.ink, 0.9), ellipse(62, 70, 3, 5, '#7a9a4a', C.ink, 0.9), ring(86, 40, 13), field(104, GRASS), ...[12, 30, 100].map((x) => all(line(`M${x} 104 L${x} 98`, LEAF2, 1.2), circle(x, 97, 2, C.white, C.ink, 0.6)))),
  'trad.gulna': all(bg(), leafOval(24, 60, -10, 1.9, LEAF), arrow(44, 60, 56, 60, HL, 2.6), leafOval(72, 60, 0, 1.9, '#b8c040'), arrow(88, 60, 98, 60, HL, 2.6), leafOval(106, 60, 10, 1.6, AUT_Y), line('M10 96 L110 96', C.grey2, 1.4), num(24, 108, '7', 9, C.grey), num(72, 108, '9', 9, C.grey), num(106, 108, '10', 9, C.grey)),
  'trad.höstfärg': all(bg('#f4ead8'), field(100, '#c9b86a'), decid(28, 106, 1.1, AUT_Y), decid(64, 104, 1.2, AUT_R), decid(98, 106, 1.05, AUT_O),
    leafMaple(46, 96, 30, 0.5, AUT_R), leafOval(80, 100, -40, 0.45, AUT_Y), leafOval(14, 98, 60, 0.4, AUT_O), leafMaple(110, 100, -20, 0.45, AUT_Y)),
  'trad.ollon': all(bg(), field(96, '#a9c46a'), line('M4 18 C40 24 70 20 116 12', BARK2, 3), at(40, 34, 1, path('M0 0 C-3 4 -8 2 -10 8 C-6 10 -8 16 -4 20 C-1 18 2 22 4 20 C2 16 6 12 3 8 C6 4 3 0 0 0 Z', LEAF2, C.ink, 1)),
    acorn(60, 60, 2.6), acorn(92, 70, 1.8), acorn(28, 80, 1.6), ring(60, 60, 22)),
  'trad.rönnbär': all(bg(), line('M4 26 C40 30 70 24 116 18', '#9a8a7a', 2.6), leafPinnate(26, 40, -60, 1, LEAF, 4), leafPinnate(96, 40, 60, 1, LEAF, 4), berryCluster(60, 60, 2.6), ring(60, 62, 30)),

  // 2802 Barrträd
  'trad.barrträd': all(bg(), field(), spruce(28, 108, 1.25), pine(64, 108, 1.15), spruce(98, 108, 1.05, NEEDLE2), greyed(decid(112, 112, 0.45)), zoom(98, 24, 14, 64, 56, needleTwig(98, 24, 30, 0.7))),
  'trad.gran': all(bg(), field(), spruce(46, 110, 1.65), cone(30, 62, 0.55), cone(58, 56, 0.55), cone(40, 80, 0.55), zoom(94, 32, 20, 56, 60, all(needleTwig(90, 32, 20, 0.9, NEEDLE, 3.6), cone(102, 36, 0.8)))),
  'trad.tall': all(bg(), field(), pine(42, 110, 1.7), zoom(94, 34, 20, 48, 30, all(rot(92, 36, 20, 1, line('M0 14 L0 -14', BARK, 1.6), ...range(6).flatMap((i) => [line(`M0 ${10 - i * 4} l-8 -6`, NEEDLE2, 1.3), line(`M0 ${10 - i * 4} l8 -6`, NEEDLE2, 1.3)]))))),
  'trad.kotte': all(bg(), field(96, '#a9c46a'), needleTwig(30, 30, -60, 1.1), cone(60, 64, 2.6, 10), cone(96, 86, 1.2, -60), ring(62, 64, 34)),
  'trad.kåda': all(bg(), rect(30, 4, 60, 108, BARK, 0, C.ink, 1.4), ...range(8).map((i) => line(`M${36 + (i % 4) * 14} ${10 + i * 12} q4 4 0 10`, BARK2, 1.4)),
    path('M54 40 C50 46 48 60 52 66 C54 70 62 70 64 64 C66 56 62 46 58 40 Z', AMBER, C.ink, 1.2), path('M57 66 C55 74 56 80 58 82 C60 80 61 74 59 66 Z', AMBER, C.ink, 1), ellipse(58, 86, 3, 4, AMBER, C.ink, 1), circle(56, 52, 2, '#f8d890', null), ring(58, 62, 24)),
  'trad.vintergrön': all(bg('#dde8f2'), rect(4, 96, 112, 16, SNOW, 0, null), spruce(36, 104, 1.5), path('M22 70 L36 52 L50 70 Z M18 88 L36 76 L54 88 Z', 'none', SNOW, 2), greyed(bare(88, 104, 1.2)), flake(14, 20), flake(60, 14), flake(104, 24), flake(76, 40), ring(36, 66, 30)),
  'trad.barra': all(rect(4, 4, 112, 108, '#f3eadb', 3, null), rect(4, 96, 112, 16, '#c9a27a', 0, null), greyed(spruce(56, 90, 1.2)), rect(46, 88, 20, 12, ROOF, 2, C.ink, 1.2),
    ...range(26).map((i) => line(`M${12 + ((i * 37) % 92)} ${100 + ((i * 13) % 10)} l${i % 2 ? 3 : -3} 1`, NEEDLE, 1.4)), ...range(8).map((i) => line(`M${36 + ((i * 23) % 44)} ${50 + ((i * 17) % 40)} l${i % 2 ? 2 : -2} 3`, NEEDLE, 1.4)), arrow(92, 56, 92, 86, HL, 2.6), arrow(22, 56, 22, 86, HL, 2.6)),
  'trad.enbuske': all(bg(), field(96, '#c9c48a'), ...[[18, 100], [104, 104]].map(([x, y]) => ellipse(x!, y!, 8, 4, '#9a8a78', C.ink, 1)),
    path('M60 106 C42 106 40 80 46 58 C50 40 56 26 60 22 C64 26 72 40 74 58 C80 80 78 106 60 106 Z', '#4a7a6a', C.ink, 1.3), ...range(14).map((i) => line(`M${50 + (i % 4) * 7} ${36 + i * 5} l3 -4`, '#2f5a4a', 1.2)), dots([[54, 60], [66, 72], [58, 86], [68, 50]], '#3a4a7a', 2),
    zoom(96, 30, 16, 66, 56, all(needleTwig(92, 30, 30, 0.6, '#4a7a6a', 4), dots([[102, 32], [98, 38]], '#3a4a7a', 2.6)))),
  'trad.enbär': all(bg(), needleTwig(60, 40, 70, 1.6, '#4a7a6a', 5), dots([[44, 54], [56, 60], [70, 56], [62, 48], [80, 62]], '#3a4a7a', 5), ...[[44, 54], [56, 60], [70, 56], [62, 48], [80, 62]].map(([x, y]) => circle(x! - 1.6, y! - 1.6, 1.2, '#8a9ac8', null)),
    path('M40 86 L80 86 L76 110 L44 110 Z', '#e8e0d0', C.ink, 1.2), dots([[52, 92], [60, 94], [68, 92], [56, 100], [64, 100]], '#3a4a7a', 2.6), ring(62, 56, 26)),
  'trad.lärk': all(bg('#f4ead8'), field(100, '#c9b86a'), at(46, 110, 1.6, rect(-2, -8, 4, 8, BARK, 0, C.ink, 0.9), path('M0 -62 L8 -46 L4 -46 L13 -30 L7 -30 L17 -12 L-17 -12 L-7 -30 L-13 -30 L-4 -46 L-8 -46 Z', AUT_Y, C.ink, 1.2)),
    ...range(16).map((i) => line(`M${20 + ((i * 29) % 56)} ${88 + ((i * 11) % 20)} l2 2`, '#c89a20', 1.4)), greyed(spruce(98, 110, 1.0)), zoom(96, 28, 16, 50, 50, all(line('M84 34 L108 22', BARK, 1.6), ...[[90, 31], [100, 26]].map(([x, y]) => all(...range(7).map((i) => line(`M${x} ${y} l${f1(Math.cos(-2.6 + i * 0.35) * 7)} ${f1(Math.sin(-2.6 + i * 0.35) * 7)}`, AUT_Y, 1.3))))))),
  'trad.idegran': all(bg(), field(), path('M10 110 C8 90 12 70 30 62 C46 56 58 66 60 80 C66 66 82 58 96 66 C110 74 112 96 110 110 Z', '#2a4a34', C.ink, 1.3), dots([[30, 80], [50, 74], [84, 78], [96, 92], [24, 96]], BERRY, 2.4),
    zoom(90, 30, 22, 60, 76, all(line('M70 36 L110 24', BARK, 1.6), ...range(8).flatMap((i) => [line(`M${74 + i * 4.4} ${f1(35 - i * 1.3)} l-1 -7`, '#2a4a34', 2.2), line(`M${74 + i * 4.4} ${f1(35 - i * 1.3)} l1 7`, '#2a4a34', 2.2)]), circle(86, 40, 4, BERRY, C.ink, 1), circle(86, 40, 1.6, '#3a2a2a', null), circle(98, 37, 4, BERRY, C.ink, 1), circle(98, 37, 1.6, '#3a2a2a', null)))),
  'trad.tuja': all(bg(), field(96), house(60, 84, 1.5), ...[14, 30, 46, 62, 78, 94, 108].map((x) => all(path(`M${x} 112 C${x - 8} 112 ${x - 8} 90 ${x - 5} 76 C${x - 3} 66 ${x} 58 ${x} 58 C${x} 58 ${x + 3} 66 ${x + 5} 76 C${x + 8} 90 ${x + 8} 112 ${x} 112 Z`, '#4f8a4a', C.ink, 1.1), line(`M${x - 3} 70 L${x} 66 M${x - 4} 84 L${x} 80 L${x + 4} 84 M${x - 4} 98 L${x} 94 L${x + 4} 98`, '#2f6a3a', 0.9)))),
  'trad.julgran': all(rect(4, 4, 112, 108, '#f3eadb', 3, null), rect(4, 100, 112, 12, '#c9a27a', 0, null), spruce(60, 96, 1.35), rect(52, 94, 16, 10, ROOF, 2, C.ink, 1.2), star(60, 14, 7),
    dots([[50, 74], [70, 70], [60, 54], [44, 88], [76, 86], [56, 38]], C.red, 3), dots([[62, 80], [52, 60], [68, 46]], C.gold, 3), line('M42 66 Q60 72 78 62 M38 82 Q60 90 82 80', C.yellow, 1.4, '1 3'),
    rect(14, 92, 18, 14, '#4f8ac0', 1, C.ink, 1.2), line('M23 92 L23 106 M14 99 L32 99', C.yellow, 2), rect(88, 94, 16, 12, '#c84a8a', 1, C.ink, 1.2), line('M96 94 L96 106', C.yellow, 2)),
  'trad.granris': all(bg(), rect(4, 70, 112, 42, '#d9d2c4', 0, null), house(98, 70, 2.4), rect(64, 70, 10, 42, '#a8a29a', 0, C.ink, 1),
    ...[[18, 90, -20], [30, 96, 15], [44, 92, -5], [26, 104, 30], [50, 104, -25]].map(([x, y, a]) => needleTwig(x!, y!, a! + 90, 0.9, NEEDLE, 5)), oval(34, 98, 26, 14), flake(20, 30), flake(52, 22)),

  // 2803 Fruktträd
  'trad.fruktträd': all(bg(), field(), fruitTree(36, 108, 1.4, [apple(-12, -38, 0.4), pear(4, -48, 0.4), plum(14, -34, 0.4), apple(-4, -30, 0.4), cherry(-14, -48, 0.5)]),
    apple(88, 40, 1.2), pear(104, 62, 1), plum(84, 70, 1.1), cherry(100, 90, 1.2)),
  'trad.fruktträdgård': all(bg(), field(66, GRASS), ...[[18, 76], [46, 76], [74, 76], [102, 76]].map(([x, y]) => fruitTree(x!, y!, 0.55, [dots(FRUIT_PTS.slice(0, 5), APPLE, 3)])),
    ...[[24, 106], [56, 106], [88, 106]].map(([x, y]) => fruitTree(x!, y!, 0.7, [dots(FRUIT_PTS.slice(0, 6), APPLE, 3)])), line('M4 70 L116 70', '#a07a4a', 1.4), ...range(12).map((i) => line(`M${8 + i * 10} 64 L${8 + i * 10} 72`, '#a07a4a', 1.4))),
  'trad.äppelträd': all(bg(), field(), fruitTree(44, 110, 1.6, [dots(FRUIT_PTS, APPLE, 3)]), zoom(96, 30, 18, 60, 52, apple(96, 32, 1.3))),
  'trad.päronträd': all(bg(), field(), fruitTree(44, 110, 1.6, FRUIT_PTS.map(([x, y]) => pear(x!, y!, 0.3))), zoom(96, 30, 18, 60, 52, pear(96, 32, 1.3))),
  'trad.körsbärsträd': all(bg(), field(100, '#a8d070'), at(42, 110, 1.6, trunk(0, 0, 8, 26, BARK2), line('M0 -18 L-12 -30 M0 -22 L11 -32', BARK2, 2.6), crown(0, -40, 15, BLOSSOM, 1.3, 0.9), ...FRUIT_PTS.map(([x, y]) => flower5(x!, y!, 1.6, C.white, '#e88aa8'))),
    ...[[20, 104], [70, 102], [86, 108]].map(([x, y]) => flower5(x!, y!, 1.6, BLOSSOM, C.white)), zoom(96, 30, 18, 62, 52, all(flower5(90, 26, 4, BLOSSOM, '#e88aa8'), cherry(102, 36, 1)))),
  'trad.plommonträd': all(bg(), field(), fruitTree(44, 110, 1.6, FRUIT_PTS.map(([x, y]) => plum(x!, y!, 0.36))), zoom(96, 30, 18, 60, 52, plum(96, 32, 1.4))),
  'trad.bära-frukt': all(bg(), field(), greyed(at(26, 106, 1.1, trunk(0, 0, 7, 24, BARK), crown(0, -36, 13, LEAF, 1.2, 0.9))), arrow(46, 70, 62, 70, HL, 2.8),
    fruitTree(88, 108, 1.3, [dots(FRUIT_PTS, APPLE, 3.4)]), oval(88, 56, 26, 22)),
  'trad.kart': all(bg(), line('M4 24 C40 30 70 24 116 18', BARK, 3), line('M40 28 L40 40', BARK2, 1.4), apple(40, 52, 1.1, '#9ac24a'), ring(40, 52, 18), greyed(line('M84 22 L84 34', BARK2, 1.4), apple(84, 52, 2)),
    path('M30 86 C34 78 46 78 50 86', 'none', C.ink, 1.2), at(40, 96, 1, circle(0, 0, 8, C.skin, C.ink, 1.2), circle(-3, -2, 1, C.ink, null), circle(3, -2, 1, C.ink, null), path('M-3 4 q1.5 -2 3 0 q1.5 2 3 0', 'none', C.ink, 1))),
  'trad.fallfrukt': all(bg(), field(84, GRASS2), at(30, 92, 1.3, trunk(0, 0, 8, 26, BARK), crown(0, -40, 15, LEAF, 1.2, 0.9), dots([[-10, -36], [6, -44], [12, -32]], APPLE, 3)), arrow(52, 50, 58, 76, HL, 2.2), arrow(70, 44, 80, 72, HL, 2.2),
    apple(60, 96, 0.9), apple(80, 92, 0.8), apple(96, 102, 0.9), apple(44, 104, 0.8, '#c8603a'), apple(108, 90, 0.7)),
  'trad.kärnhus': all(bg(), path('M60 22 C46 12 18 18 18 54 C18 88 40 104 60 98 C80 104 102 88 102 54 C102 18 74 12 60 22 Z', '#fbf3d8', C.ink, 1.6), path('M60 22 C46 12 18 18 18 54 C18 88 40 104 60 98', 'none', APPLE, 3),
    path('M60 98 C80 104 102 88 102 54 C102 18 74 12 60 22', 'none', APPLE, 3), line('M60 22 L62 10', BARK2, 2), path('M60 38 C50 44 48 66 60 76 C72 66 70 44 60 38 Z', '#efe0a8', '#c8b070', 1.2), ellipse(55, 56, 2.6, 4, '#5a3a1e', C.ink, 0.6), ellipse(65, 56, 2.6, 4, '#5a3a1e', C.ink, 0.6), oval(60, 57, 17, 24)),
  'trad.kärna.2': all(bg(), path('M40 30 C30 22 12 26 12 52 C12 76 28 88 40 84 C52 88 68 76 68 52 C68 26 50 22 40 30 Z', '#fbf3d8', C.ink, 1.4), path('M40 30 C30 22 12 26 12 52 C12 76 28 88 40 84 C52 88 68 76 68 52 C68 26 50 22 40 30 Z', 'none', APPLE, 2.6),
    path('M40 42 C33 46 32 60 40 66 C48 60 47 46 40 42 Z', '#efe0a8', '#c8b070', 1), ellipse(36, 54, 2.2, 3.4, '#5a3a1e', C.ink, 0.6), ellipse(44, 54, 2.2, 3.4, '#5a3a1e', C.ink, 0.6), arrow(56, 58, 76, 62, HL, 2.4),
    ...[[90, 52, -20], [100, 64, 15], [86, 72, 40]].map(([x, y, a]) => rot(x!, y!, a!, 1, path('M0 -9 C5 -5 5 5 0 9 C-5 5 -5 -5 0 -9 Z', '#5a3a1e', C.ink, 1.1), path('M-1 -5 C1 -3 1 0 -1 3', 'none', '#8a6a4a', 0.9))), ring(94, 62, 20)),
  'trad.äppelsort': all(bg(), rect(10, 84, 100, 8, C.tan, 2, C.ink, 1.2), apple(26, 66, 1.4, APPLE), apple(60, 66, 1.4, '#a8cc4a'), at(94, 66, 1.4, path('M0 -7 C-4 -10 -10 -8 -10 -1 C-10 6 -5 10 0 8 C5 10 10 6 10 -1 C10 -8 4 -10 0 -7 Z', '#f0c040', C.ink, 1.2), path('M-8 2 C-4 -6 4 -6 8 0 C6 6 -6 8 -8 2 Z', '#e86040', null), line('M0 -7 L1 -12', BARK2, 1.4)),
    ...[26, 60, 94].map((x, i) => all(line(`M${x} 92 L${x} 100`, C.ink, 1), rect(x - 8, 100, 16, 9, C.white, 1, C.ink, 1), num(x, 107.5, String(i + 1), 7)))),
  'trad.ympa': all(bg(), field(), rect(52, 50, 12, 62, BARK, 2, C.ink, 1.3), path('M52 50 L58 38 L64 50 Z', BARK, C.ink, 1.2), line('M58 40 L58 14', '#7a5a34', 3.4), leafOval(50, 24, -50, 0.6), leafOval(66, 18, 40, 0.6),
    rect(50, 38, 16, 14, '#e8e0a0', 1, C.ink, 1.2), line('M50 42 L66 40 M50 46 L66 44 M50 50 L66 48', '#a89a50', 1), ring(58, 44, 14), rot(92, 70, -30, 1, rect(-3, -18, 6, 18, C.silver, 1, C.ink, 1), rect(-4, 0, 8, 16, BARK2, 2, C.ink, 1.1))),
  'trad.spaljé': all(bg(), rect(4, 10, 112, 102, WALL, 0, null), ...range(6).map((i) => line(`M4 ${20 + i * 16} L116 ${20 + i * 16}`, '#d7c49a', 0.8)), field(104, GRASS2),
    ...range(4).map((i) => line(`M14 ${34 + i * 18} L106 ${34 + i * 18}`, '#8a6a4a', 1.6)), ...range(6).map((i) => line(`M${14 + i * 18.4} 30 L${14 + i * 18.4} 100`, '#8a6a4a', 1.6)),
    line('M60 106 L60 30', BARK, 4), ...[34, 52, 70, 88].map((y) => line(`M18 ${y} L102 ${y}`, BARK, 2.6)), ...[[30, 34], [84, 52], [40, 70], [76, 88], [96, 34], [24, 52]].map(([x, y]) => pear(x!, y! + 7, 0.55)), ...[[44, 34], [70, 52], [90, 70], [30, 88]].map(([x, y]) => leafOval(x!, y! - 5, 20, 0.4))),

  // 2804 Prydnadsbuskar
  'trad.buske': all(bg(), field(), greyed(decid(92, 112, 1.25)), blob([[42, 92, 16], [26, 98, 11], [58, 98, 11], [34, 84, 11], [50, 84, 11]], LEAF), ...[34, 42, 50].map((x) => line(`M${x} 112 L${x + (x - 42) * 0.3} 104`, BARK, 2)), oval(42, 94, 30, 20)),
  'trad.prydnadsbuske': all(bg(), field(90), house(60, 90, 2.4), flowerBush(20, 98, '#e88aa8'), flowerBush(100, 98, LILAC), rect(50, 98, 20, 14, '#c9b89a', 0, null)),
  'trad.blomma-verb': all(bg(), field(), greyed(line('M28 106 L28 60', LEAF2, 2.4), path('M28 48 C22 54 22 62 28 64 C34 62 34 54 28 48 Z', '#e88aa8', C.ink, 1.1)), arrow(44, 62, 64, 62, HL, 2.8),
    line('M88 106 L88 60', LEAF2, 2.4), leafOval(80, 84, -50, 0.6), flower5(88, 48, 7, '#e86a9a', C.yellow), sun(108, 16, 5)),
  'trad.syren': all(bg(), field(), blob([[56, 74, 22], [32, 82, 16], [80, 82, 16], [44, 60, 14], [70, 60, 14]], LEAF),
    ...[[40, 56], [64, 50], [84, 66], [28, 76], [56, 72], [74, 84], [46, 86]].map(([x, y]) => at(x!, y!, 1, path('M0 -12 C5 -6 6 2 0 6 C-6 2 -5 -6 0 -12 Z', LILAC, C.ink, 1), dots([[-2, -6], [2, -3], [-1, 0], [1, -9]], '#c8a8e8', 1.3))),
    zoom(100, 24, 14, 64, 50, at(100, 26, 1.4, path('M0 -12 C5 -6 6 2 0 6 C-6 2 -5 -6 0 -12 Z', LILAC, C.ink, 0.8), ...[[-2, -6], [2, -3], [-1, 0], [1, -9]].map(([x, y]) => flower5(x!, y!, 1, '#d8c0f0', C.white))))),
  'trad.ros': all(bg(), line('M60 110 C58 90 62 70 60 46', LEAF2, 3.4), thorn(59, 92, -80), thorn(61, 78, 80), thorn(59, 62, -80), leafOval(46, 80, -60, 0.9), leafOval(74, 66, 60, 0.9), rose(60, 36, 2.4)),
  'trad.taggig': all(bg(), line('M36 110 C34 80 38 50 36 20', '#6a8a3a', 4), ...range(8).map((i) => thorn(i % 2 ? 38 : 34, 100 - i * 10, i % 2 ? 80 : -80, 1.6)), ring(36, 60, 22),
    greyed(line('M90 110 C88 80 92 50 90 20', '#6a8a3a', 4)), at(62, 40, 1, path('M-6 0 L-14 -4 M-6 4 L-14 6', 'none', HL, 1.6))),
  'trad.nypon': all(bg(), line('M4 30 C40 36 70 30 116 22', '#7a4a3a', 3), thorn(30, 33, -10), thorn(80, 29, -10), leafPinnate(20, 50, -80, 0.8, LEAF, 3),
    ...[[50, 60, 2.2], [76, 66, 2], [94, 52, 1.6]].map(([x, y, s]) => at(x!, y!, s!, line('M0 -12 L0 -8', '#7a4a3a', 1.2), ellipse(0, 0, 5, 7.6, '#e0402a', C.ink, 1), path('M-3 7 L0 11 L3 7', 'none', '#3a2a1a', 1.1))), ring(62, 62, 26)),
  'trad.hagtorn': all(bg(), line('M4 70 C40 64 76 72 116 60', '#6a4a30', 3), ...[[20, 68, -100], [44, 66, 80], [70, 69, -100], [96, 64, 80]].map(([x, y, a]) => thorn(x!, y!, a!, 2)),
    ...[[30, 50], [58, 48], [86, 44]].map(([x, y]) => all(flower5(x!, y!, 3.4, C.white, '#e8d0a0'), flower5(x! + 8, y! + 6, 3, C.white, '#e8d0a0'))), ...[[34, 88], [80, 86]].map(([x, y]) => dots([[x!, y!], [x! + 6, y! + 2], [x! + 3, y! + 7]], BERRY, 3)), leafOval(60, 90, 30, 0.7), ring(44, 66, 10)),
  'trad.forsythia': all(bg(), field(), ...[-30, -18, -6, 6, 18, 30].map((a) => rot(60, 110, a, 1, line('M0 0 C-2 -30 2 -60 0 -84', BARK, 2), ...range(9).map((i) => rot(0, -14 - i * 8, 0, 1, ...[-1, 1].map((d) => path(`M0 0 L${d * 5} -2 L${d * 3} 2 Z`, C.yellow, C.ink, 0.6)))))), zoom(102, 22, 13, 74, 40, all(...range(4).map((i) => rot(102, 22, i * 90 + 45, 1, path('M0 0 L-2 -8 L2 -8 Z', C.yellow, C.ink, 0.7)))))),
  'trad.hortensia': all(bg(), field(), blob([[60, 84, 24], [34, 90, 16], [86, 90, 16]], LEAF2), ...[[42, 70, '#7aa8e8'], [66, 64, '#e88ab8'], [84, 78, '#7aa8e8'], [30, 88, '#e88ab8'], [58, 90, '#7aa8e8']].map(([x, y, c]) => all(circle(x as number, y as number, 11, c as string, C.ink, 1.2), ...range(6).map((i) => { const a = i * 1.05; return flower5(f1((x as number) + Math.cos(a) * 6), f1((y as number) + Math.sin(a) * 6), 1.4, C.white, c as string); })))),
  'trad.spirea': all(bg(), field(), ...[-60, -40, -20, 20, 40, 60].map((a) => rot(60, 108, a, 1, line('M0 0 C0 -24 10 -44 26 -52', BARK, 1.8), ...range(8).map((i) => circle(f1(1 + i * 3.2 + i * i * 0.1), f1(-10 - i * 5.6 + i * i * 0.25), 2.4, C.white, C.ink, 0.6)))), flake(100, 16, 0)),
  'trad.snöbär': all(bg('#e6e8ee'), field(100, '#b8b8a0'), ...[-40, -20, 0, 20, 40].map((a) => rot(60, 108, a, 1, line('M0 0 C-2 -26 2 -50 0 -70', '#8a7a6a', 1.8))), dots([[34, 54], [42, 60], [48, 40], [60, 46], [66, 36], [74, 54], [84, 46], [80, 62], [52, 64], [38, 44]], C.white, 4.4), zoom(98, 24, 14, 66, 40, dots([[94, 24], [102, 22], [98, 30]], C.white, 4))),
  'trad.buxbom': all(bg(), field(96), rect(10, 90, 100, 8, '#c9b89a', 0, null), ...[[20, 82], [44, 82], [68, 82], [92, 82]].map(([x, y]) => all(rect(x! - 10, y! - 6, 20, 14, '#3f7a3a', 4, C.ink, 1.2), ...range(8).map((i) => circle(x! - 7 + (i % 4) * 4.6, y! - 3 + Math.floor(i / 4) * 6, 1.2, '#5f9a4a', null)))),
    circle(30, 54, 14, '#3f7a3a', C.ink, 1.2), circle(86, 56, 12, '#3f7a3a', C.ink, 1.2), rect(28, 68, 4, 8, BARK, 0, null), rect(84, 68, 4, 8, BARK, 0, null), zoom(60, 30, 14, 36, 50, all(line('M50 36 L70 24', BARK, 1.4), ...[[54, 33], [60, 30], [66, 26]].map(([x, y]) => all(ellipse(x!, y! - 4, 2.4, 3.6, '#3f7a3a', C.ink, 0.7), ellipse(x!, y! + 4, 2.4, 3.6, '#3f7a3a', C.ink, 0.7)))))),
  'trad.häck': all(bg(), field(96), house(92, 70, 1.6), path('M4 112 L4 72 C10 68 20 70 28 68 C40 66 56 70 70 68 C84 66 100 70 116 68 L116 112 Z', LEAF2, C.ink, 1.3), ...range(18).map((i) => circle(10 + (i % 9) * 12, 80 + Math.floor(i / 9) * 14, 3, '#5aa04a', null)), rect(4, 108, 112, 4, GRASS, 0, null)),
  'trad.häcksax': all(bg(), rot(60, 64, -25, 1, rect(-40, -3, 44, 6, C.silver, 2, C.ink, 1.3), rect(-40, 4, 44, 6, C.silver, 2, C.ink, 1.3), circle(6, 4, 4, C.grey, C.ink, 1.2), rect(8, -2, 30, 6, C.red, 3, C.ink, 1.2), rect(8, 6, 30, 6, C.red, 3, C.ink, 1.2)),
    path('M4 112 L4 92 C30 88 60 92 116 90 L116 112 Z', LEAF2, C.ink, 1.2), ...range(6).map((i) => leafOval(14 + i * 18, 102, i * 30, 0.35))),

  // 2805 Trädets delar
  'trad.träd': all(bg(), field(), decid(60, 110, 1.45)),
  'trad.stam': all(bg(), field(), greyed(at(60, 110, 1.45, line('M0 -20 L-9 -30 M0 -24 L8 -33', BARK, 2.6), crown(0, -42, 15, LEAF))), at(60, 110, 1.45, trunk(0, 0, 8, 30, BARK)), oval(60, 88, 12, 26)),
  'trad.rot': all(bg(), rect(4, 4, 112, 52, SKY, 3, null), rect(4, 56, 112, 56, SOIL, 0, null), line('M4 56 L116 56', C.ink, 1.2), greyed(at(60, 56, 0.7, trunk(0, 0, 8, 30, BARK), crown(0, -38, 13, LEAF))),
    line('M60 56 C56 70 40 76 24 90 M60 56 C62 74 58 90 60 106 M60 56 C66 70 82 78 98 92 M48 70 L36 66 M72 70 L86 66 M42 80 L44 94 M78 82 L76 98', '#d9b88a', 3), oval(60, 82, 44, 26)),
  'trad.pålrot': all(bg(), rect(4, 4, 112, 48, SKY, 3, null), rect(4, 52, 112, 60, SOIL, 0, null), line('M4 52 L116 52', C.ink, 1.2), pine(36, 52, 0.75), path('M33 52 L36 108 L39 52 Z', '#d9b88a', C.ink, 1), line('M36 60 L26 64 M36 70 L46 74', '#d9b88a', 1.6), oval(36, 82, 9, 28),
    greyed(spruce(88, 52, 0.7), line('M88 52 C80 56 70 56 64 58 M88 52 C96 56 106 56 112 58 M88 52 L88 60', '#d9b88a', 2.4))),
  'trad.gren': all(bg(), field(), greyed(at(52, 110, 1.45, trunk(0, 0, 8, 30, BARK), crown(0, -42, 15, LEAF))), line('M54 74 L84 54 L106 48', BARK, 4), blob([[104, 44, 7], [94, 48, 6]], LEAF), oval(84, 56, 24, 12)),
  'trad.trädkrona': all(bg(), field(), at(60, 110, 1.45, trunk(0, 0, 8, 30, BARK), line('M0 -20 L-9 -30 M0 -24 L8 -33', BARK, 2.6), crown(0, -42, 15, LEAF)), oval(60, 44, 40, 30)),
  'trad.trädtopp': all(bg(), field(), spruce(60, 112, 1.65), at(60, 12, 1, path('M-5 2 C-4 -3 4 -3 6 0 L10 -1 L6 3 C2 5 -3 5 -5 2 Z', '#2e2e36', C.ink, 0.8)), ring(60, 14, 10)),
  'trad.knopp': all(bg(), line('M10 100 C40 80 70 60 104 20', BARK, 4), line('M50 74 L42 54 M76 50 L88 40', BARK, 2.4), ...[[42, 52, -20], [90, 38, 50], [104, 18, 40], [62, 64, 60]].map(([x, y, a]) => rot(x!, y!, a!, 1.4, path('M0 4 C-4 2 -4 -6 0 -10 C4 -6 4 2 0 4 Z', '#8a6a3a', C.ink, 1), path('M0 4 C-2 0 -1 -6 0 -10', 'none', '#5a8a3a', 0.9))), ring(42, 48, 12), ring(90, 34, 12)),
  'trad.lövverk': all(bg(LEAF2), ...range(30).map((i) => leafOval(8 + ((i * 37) % 108), 8 + ((i * 23) % 100), (i * 47) % 360, 0.9, i % 3 ? LEAF : LIGHT)),
    ...[[30, 4, 50, 110], [64, 4, 72, 110]].map(([x1, y1, x2, y2]) => path(`M${x1} ${y1} L${x1! + 8} ${y1} L${x2! + 10} ${y2} L${x2} ${y2} Z`, 'rgba(255,240,150,0.45)', null)), sun(64, 10, 6)),
  'trad.sav': all(bg(), field(), at(46, 112, 1, trunk(0, 0, 30, 108, BIRCH)), line('M40 20 L46 20 M48 40 L54 40 M38 60 L44 60 M50 82 L56 82', C.ink, 1.6), line('M60 58 L74 62', C.grey, 3), path('M74 62 L80 64', 'none', C.grey, 2),
    path('M74 78 L92 78 L90 106 L76 106 Z', 'rgba(220,240,252,0.8)', C.ink, 1.3), rect(76, 92, 14, 14, '#e8f0f4', 0, null), circle(80, 68, 1.8, '#bfe3f5', C.ink, 0.6), circle(81, 73, 1.6, '#bfe3f5', C.ink, 0.6), ring(80, 70, 10), arrow(46, 100, 46, 70, HL, 2.2)),
  'trad.ihålig': all(bg(), field(), at(40, 112, 1, path('M-14 0 L-11 -70 L11 -70 L14 0 Z', BARK, C.ink, 1.4), ellipse(0, -40, 7, 12, '#2e2214', C.ink, 1.2), crown(0, -78, 13, LEAF2)),
    ellipse(40, -40 + 112, 9, 14, 'none', HL, 2.4), at(96, 112, 1, rect(-12, -40, 24, 40, WOODL, 0, C.ink, 1.3), ellipse(0, -40, 12, 5, WOODL, C.ink, 1.2), ellipse(0, -40, 7, 3, '#2e2214', null)), oval(96, 72, 14, 9), greyed(at(96, 30, 1, circle(0, 0, 9, WOODL, C.ink, 1.2), circle(0, 0, 5, '#c99a5c', null)))),

  // 2806 Årsringar och tillväxt
  'trad.tillväxt.2': all(bg(), field(), at(18, 110, 0.25, trunk(0, 0, 8, 30, BARK), crown(0, -42, 15, LEAF)), at(48, 110, 0.6, trunk(0, 0, 8, 30, BARK), crown(0, -42, 15, LEAF)), at(90, 110, 1.15, trunk(0, 0, 8, 30, BARK), crown(0, -42, 15, LEAF)),
    path('M14 92 C40 80 70 50 100 20', 'none', HL, 2.4), path('M100 20 L90 22 L97 29 Z', HL, HL, 1)),
  'trad.skott.2': all(bg(), line('M20 110 L40 70 L48 40', NEEDLE2, 4), needleTwig(40, 70, -30, 1.1, NEEDLE, 6), line('M48 40 L52 14', '#b8e070', 3), ...range(5).flatMap((i) => [line(`M${f1(49 + i * 0.7)} ${36 - i * 5} l-4 -3`, '#b8e070', 1.4), line(`M${f1(49 + i * 0.7)} ${36 - i * 5} l4 -3`, '#b8e070', 1.4)]),
    oval(51, 26, 10, 18), greyed(leafOval(92, 70, 10, 1.6))),
  'trad.vårved': all(bg(), rings(60, 60, 44, 5, 'light')),
  'trad.sommarved': all(bg(), rings(60, 60, 44, 5, 'dark')),
  'trad.åldersbestämma': all(bg(), rings(46, 62, 38, 5), ...range(5).map((i) => num(f1(46 + ((38 * (i + 0.5)) / 5)), 64, String(i + 1), 6.5)), at(98, 30, 1, circle(0, 0, 9, '#eaf6ff', C.ink, 1.8), line('M6 6 L14 14', C.ink, 3)),
    path('M84 66 C84 54 112 54 112 66 L112 92 L84 92 Z', C.white, C.ink, 1.2), num(98, 84, '5', 16, HL)),
  'trad.gynnsam': all(bg(), rect(10, 74, 100, 8, C.grey2, 2, C.ink, 1.2), path('M16 74 A44 44 0 0 1 60 30', 'none', C.ink, 14), path('M16 74 A44 44 0 0 1 60 30', 'none', '#7cc86a', 11), path('M60 30 A44 44 0 0 1 104 74', 'none', C.ink, 14), path('M60 30 A44 44 0 0 1 104 74', 'none', C.grey2, 11),
    sun(38, 44, 6), cloud(54, 50, 0.4), rain(49, 55, 3), greyed(flake(76, 46, 1.6), flake(86, 56, 1.4), rect(78, 62, 18, 6, '#c9b88a', 0, C.ink, 0.8), line('M80 62 l3 3 l-2 3 M88 62 l2 3 l-2 3', C.ink, 0.7)),
    line('M60 74 L27 55', C.ink, 3), circle(60, 74, 4.5, C.dark, C.ink, 1.2), okC(24, 26, 7), field(100, GRASS), line('M26 100 L26 90', LEAF2, 1.6), leafOval(23, 92, -45, 0.4), leafOval(29, 90, 45, 0.4), greyed(line('M96 100 L96 92', LEAF2, 1.4), path('M96 92 C92 94 90 98 90 100 M96 94 C100 96 102 99 102 101', 'none', '#8a8a4a', 1.2))),
  'trad.frodas': all(bg(), line('M78 8 L78 108', C.grey2, 1.2, '3 3'), rect(4, 96, 74, 16, SOIL, 0, null), rect(78, 96, 38, 16, '#c9b88a', 0, null),
    ...[[17, 104, 1], [30, 100, 1.2], [42, 104, 1.1], [58, 100, 1.2], [70, 106, 0.9], [18, 84, 0.9], [34, 80, 1.1], [52, 82, 1], [66, 86, 0.9], [26, 64, 0.8], [44, 62, 0.9], [60, 66, 0.8], [16, 70, 0.7], [36, 46, 0.7], [54, 46, 0.6]].map(([x, y, s], i) => at(x!, y!, s!,
      ...[-40, -15, 15, 40].map((a) => rot(0, 0, a, 1, line('M0 0 L0 -12', LEAF2, 1.4), leafOval(0, -14, 0, 0.55, i % 3 ? LEAF : LIGHT))), ellipse(-2, -16, 1.2, 2.4, 'rgba(255,255,255,0.7)', null), i % 4 ? '' : flower5(0, -20, 1.8, '#e86a9a'))),
    ...[[14, 30], [64, 24], [30, 20], [70, 50]].map(([x, y]) => sparkle(x!, y!, 5, C.gold)),
    greyed(line('M98 100 L98 84', LEAF2, 1.6), path('M98 86 C93 88 90 93 90 97 M98 88 C103 90 106 95 106 99', 'none', '#8a8a4a', 1.4))),
  'trad.uråldrig': all(bg(), field(), at(50, 112, 1, path('M-22 0 C-16 -10 -18 -30 -14 -46 C-12 -54 -16 -60 -10 -62 L10 -62 C16 -58 12 -50 14 -44 C18 -28 16 -10 24 0 Z', BARK2, C.ink, 1.4), path('M-10 -10 C-6 -20 -12 -30 -6 -40 M4 -8 C8 -22 2 -34 8 -48', 'none', '#4a2e18', 1.2), ellipse(-2, -30, 4, 7, '#2e2214', null),
    line('M-8 -60 L-30 -74 M8 -60 L30 -78 M0 -62 L2 -82', BARK2, 4), blob([[-30, -80, 11], [30, -82, 11], [0, -88, 12], [-14, -92, 8], [16, -92, 8]], LEAF2)), fig(92, C.orange, 'smile', 0.42), greyed(at(108, 112, 0.35, trunk(0, 0, 8, 30, BARK), crown(0, -42, 15, LEAF)))),
  'trad.diameter': all(bg(), at(60, 112, 1, rect(-40, -44, 80, 44, BARK, 0, C.ink, 1.4)), rings(60, 62, 36, 6), path('M24 62 L96 62', 'none', HL, 2.6), path('M24 62 L31 58 L31 66 Z M96 62 L89 58 L89 66 Z', HL, HL, 1), circle(60, 62, 2.4, C.ink, null)),
  'trad.fälla.3': all(bg(), field(), rect(26, 98, 14, 8, WOODL, 2, C.ink, 1.2), rot(34, 100, 32, 1, rect(-6, -78, 12, 78, BARK, 1, C.ink, 1.3), crown(0, -88, 14, LEAF)), path('M70 26 C84 34 92 50 96 66', 'none', HL, 2.4), path('M96 66 L90 58 L99 58 Z', HL, HL, 1),
    fig(102, C.orange, 'calm', 0.65), saw(64, 100, 0, 0.7), reach(102, 0.65, -1, 74, 101)),
  'trad.såga': all(bg(), rect(4, 100, 112, 12, '#c9b89a', 0, null), line('M24 108 L34 82 L44 108 M76 108 L86 82 L96 108', BARK2, 3), rect(14, 72, 92, 12, WOODD, 2, C.ink, 1.3), ellipse(106, 78, 3, 6, WOODL, C.ink, 1),
    rot(60, 64, 50, 1, saw(0, 0, 0, 1)), line('M58 84 L56 96 M62 86 L64 98 M60 88 L60 100', '#d8b880', 1.4), path('M52 64 L68 64', 'none', HL, 0), arrow(72, 30, 58, 46, HL, 2.2), arrow(66, 54, 80, 38, HL, 2.2)),

  // 2807 Skogens trädslag
  'trad.trädslag': all(bg(), field(), spruce(22, 104, 1.1), pine(58, 104, 1.05), birch(96, 104, 0.95), ...[22, 58, 96].map((x, i) => all(rect(x - 7, 104, 14, 8, C.white, 1, C.ink, 1), num(x, 111, String(i + 1), 7)))),
  'trad.skogsmark': all(rect(4, 4, 112, 108, '#cfe6b8', 3, null), path('M12 10 C40 6 80 16 108 12 C112 40 104 70 110 104 C80 108 40 100 10 106 C6 70 14 40 12 10 Z', '#4f8a4a', C.ink, 1.4), ...range(28).map((i) => circle(18 + (i % 7) * 14, 20 + Math.floor(i / 7) * 22, 4.4, i % 3 ? NEEDLE : LEAF, C.ink, 0.6)),
    path('M60 54 C70 50 84 56 82 66 C80 74 64 74 58 66 Z', '#7cc0e6', C.ink, 1), rect(20, 76, 12, 10, '#e8d070', 0, C.ink, 0.8), house(96, 94, 0.5)),
  'trad.blandskog': all(bg(), field(96, GRASS2), spruce(14, 100, 0.8), birch(32, 104, 0.8), pine(52, 102, 0.85), decid(72, 104, 0.85, LEAF), spruce(90, 104, 0.9), birch(108, 102, 0.75), spruce(26, 112, 0.6), decid(62, 112, 0.6, LIGHT), pine(98, 112, 0.6)),
  'trad.granskog': all(bg('#cfdbe4'), field(90, '#4a6a3a'), ...[[14, 96, 1.1], [26, 98, 1.3], [42, 96, 1.2], [60, 98, 1.35], [78, 96, 1.2], [96, 98, 1.3], [106, 96, 1.1], [16, 112, 1], [50, 112, 1.05], [86, 112, 1], [110, 112, 0.9]].map(([x, y, s]) => spruce(x!, y!, s!, (x! + y!) % 3 ? NEEDLE : '#24583a'))),
  'trad.tallskog': all(bg(), field(88, '#d8d0a0'), ...[[22, 106, 1.3], [46, 102, 1.4], [72, 106, 1.3], [98, 102, 1.35]].map(([x, y, s]) => pine(x!, y!, s!)), ...[[24, 108], [58, 106], [88, 110]].map(([x, y]) => ellipse(x!, y!, 6, 2, '#b8b070', null)), sun(104, 14, 5)),
  'trad.bokskog': all(bg('#e6f2d8'), field(96, '#c8a870'), ...[[16, 112], [44, 108], [76, 112], [104, 108]].map(([x, y]) => all(path(`M${x! - 5} ${y} L${x! - 3} 30 L${x! + 3} 30 L${x! + 5} ${y} Z`, '#a8acaa', C.ink, 1.2), line(`M${x} 46 L${x! - 12} 30 M${x} 50 L${x! + 12} 34`, '#a8acaa', 2.4))),
    blob([[18, 22, 13], [40, 18, 13], [62, 22, 13], [84, 18, 13], [102, 22, 13], [28, 32, 9], [72, 32, 9], [94, 32, 9]], '#9ad05a'), zoom(60, 70, 13, 44, 30, leafOval(60, 70, 0, 0.8, '#8ac04a'))),
  'trad.ädellövträd': all(bg(), field(), oak(24, 108, 0.95), at(62, 108, 1.0, trunk(0, 0, 8, 30, '#a8acaa'), crown(0, -44, 15, '#8ac04a', 1.2)), decid(98, 108, 0.95, LEAF2),
    ...[[24, 16], [62, 12], [98, 16]].map(([x, y]) => circle(x!, y!, 9, C.white, C.ink, 1.2)), at(24, 16, 0.7, path('M0 9 C-3 6 -7 6 -6 2 C-9 0 -7 -4 -4 -3 C-5 -7 -2 -9 0 -10 C2 -9 5 -7 4 -3 C7 -4 9 0 6 2 C7 6 3 6 0 9 Z', LEAF2, C.ink, 0.9)), leafOval(62, 12, 0, 0.6, '#8ac04a'), leafHeart(98, 16, 0, 0.6), sun(110, 40, 4)),
  'trad.fjällbjörk': all(bg(), mountain(30, 70, 60, 56), mountain(82, 70, 70, 48), path('M4 112 L4 70 C40 64 80 66 116 72 L116 112 Z', '#9ab86a', C.ink, 1.2),
    ...[[24, 104, 1], [54, 100, 1.1], [86, 106, 0.95]].map(([x, y, s]) => at(x!, y!, s!, path('M-2 0 C-4 -8 4 -12 0 -18 C-3 -22 2 -26 1 -30 L3 -30 C4 -24 0 -22 3 -18 C7 -12 0 -8 2 0 Z', BIRCH, C.ink, 1), line('M0 -18 L-8 -24 M2 -24 L9 -28', BIRCH, 1.6), blob([[0, -34, 7], [-7, -28, 5], [8, -30, 5]], LIGHT))), line('M4 80 L116 80', HL, 0)),
  'trad.urskog': all(bg('#cfdbc4'), field(88, '#5a7a4a'), spruce(14, 100, 1.2), spruce(40, 96, 1.5), greyed(spruce(64, 98, 1.0)), spruce(88, 98, 1.35), spruce(110, 100, 1.1), spruce(56, 112, 0.5), spruce(100, 112, 0.4),
    rot(54, 104, 8, 1, rect(-30, -4, 60, 8, '#7a6a5a', 3, C.ink, 1.2)), ...[[30, 102], [52, 106], [72, 102]].map(([x, y]) => ellipse(x!, y!, 5, 2, '#7ab84a', null)), at(80, 108, 1, rect(-3, -22, 6, 22, '#6a5a4a', 1, C.ink, 1), line('M-3 -22 L-6 -28 M3 -22 L5 -30', '#6a5a4a', 1.4))),
  'trad.glänta': all(bg(NEEDLE), ellipse(60, 66, 40, 30, '#b8e07a', C.ink, 1.4), ...range(16).map((i) => { const a = (i / 16) * Math.PI * 2; return spruce(f1(60 + Math.cos(a) * 46), f1(76 + Math.sin(a) * 36), 0.55); }),
    ...[[48, 60], [70, 72], [56, 78], [76, 58]].map(([x, y]) => flower5(x!, y!, 1.6, C.white)), sun(60, 60, 5), oval(60, 66, 42, 32)),
  'trad.skogsbryn': all(bg(), rect(4, 80, 112, 32, '#b8d880', 0, null), ...[[10, 96], [24, 98], [38, 96], [14, 112], [32, 112], [48, 110]].map(([x, y]) => spruce(x!, y!, 0.8)), ...[[58, 104], [56, 90]].map(([x, y]) => blob([[x!, y!, 6], [x! + 5, y! + 2, 4]], LEAF)),
    line('M62 30 L62 110', HL, 2.4, '4 3'), at(84, 102, 0.9, ellipse(0, -10, 10, 6, '#b07a44', C.ink, 1.1), line('M-6 -6 L-7 6 M6 -6 L7 6 M-3 -6 L-3 6 M3 -6 L4 6', '#7a4a26', 1.6), circle(10, -18, 4, '#b07a44', C.ink, 1.1), line('M12 -22 L14 -27 M8 -22 L7 -27', '#7a4a26', 1.2)),
    ...[[96, 90], [106, 96], [76, 92]].map(([x, y]) => flower5(x!, y!, 1.6, C.yellow, AUT_O))),
  'trad.tät.2': all(bg(), line('M60 8 L60 108', C.grey2, 1.2, '3 3'), field(100, GRASS2), ...range(9).map((i) => spruce(8 + i * 6, 108 - (i % 2) * 4, 0.8, i % 2 ? NEEDLE : '#24583a')), oval(32, 72, 28, 36),
    greyed(spruce(72, 108, 0.8), spruce(104, 108, 0.8))),
};
