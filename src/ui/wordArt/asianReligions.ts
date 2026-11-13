/**
 * Historia & humaniora → Religion & idéhistoria → Asiatiska religioner, 2131–2137 (0.38): Buddhism's
 * basic ideas and schools, Hindu traditions, Shinto rituals, Confucian and Taoist ideas, and religion in
 * Japan. The pictures are neutral and respectful: holy figures appear only as golden statues or as
 * symbols, never as caricatures, and there is never a swastika or manji – Buddhism is shown with the
 * eight-spoked wheel, the lotus, stupas and pagodas; Hinduism with a temple tower, oil lamps and marigold
 * garlands; Shinto with the red torii, the straw rope with zigzag papers and the offering box; Confucian
 * ideas with a scholar in a black hat; Taoist ideas with the yin-yang sign, mountains and water. The
 * shared base (figures, holy signs, buildings) follows religionBasics.ts. The thing the word names is
 * ringed or outlined in orange; a grey copy stands beside it where a contrast helps. Digits only; no
 * words, no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, heart, line, path, rect, sparkle, type Svg } from './kit';
import { type Build } from './figures';
import { HL, cloud } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Colours ──────────────────────────────────────────────────────────
const GOLD = C.gold;
const GLOW = '#fff1b8';
const SAFF = '#e08a2c';
const STONE2 = '#b3a891';
const WOOD = '#8a5a2e';
const RED = '#c8372d';
const NIGHT = '#2c3557';
const LEAF = '#5f9e58';
const PAGE = '#fbf6e8';
const f1 = (n: number) => +n.toFixed(1);

// ── Figures ──────────────────────────────────────────────────────────
const ground = line('M4 112 L116 112', C.grey2, 2);
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, hy: f1(ty - 56 * s), sy: f1(ty - 38 * s), sl: f1(x - 13 * s), sr: f1(x + 13 * s) }; };
const lo = (d: string, col: string, w: number) => line(d, C.ink, w + 2) + line(d, col, w);
/** A sleeved arm from the shoulder (side −1 = picture-left) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number, col: string) => {
  const q = geo(x, h), sx = side < 0 ? q.sl : q.sr, w = 5 * Math.max(0.7, h);
  return all(lo(`M${sx} ${q.sy} L${tx} ${ty}`, col, w), circle(tx, ty, 3 * Math.max(0.6, h), C.skin, C.ink, 1.2));
};
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const shave = () => path('M-10 -58 C-10 -68 10 -68 10 -58 C6 -62 -6 -62 -10 -58 Z', C.skin, C.ink, 1.6);
/** A monk in a saffron robe with a shaved head. */
const monk = (x: number, h = 1, mood: Mood = 'calm') => all(fig(x, SAFF, mood, { h, bottom: SAFF }), on(x, h, shave(), path('M-14 -42 L14 -20 L14 -14 L-14 -36 Z', '#c4701c', null)));
// kneeling figure facing right; local: ground 0, head centre (6, −58)
const kneelL = (top: string, bottom: string, pray: boolean, sk: string = C.skin, hr: string = C.hair, eyes = 'open') => all(
  lo('M-4 -22 L-2 -4 L-18 -4', bottom, 8), ellipse(-21, -3, 4, 3, C.black, C.ink, 1),
  lo('M-4 -22 L11 -22 L12 -3', bottom, 8), ellipse(15, -1.5, 5, 2.6, C.black, C.ink, 1),
  path('M-12 -50 L4 -52 C8 -40 6 -30 4 -19 L-12 -19 C-14 -30 -14 -40 -12 -50 Z', top, C.ink, 1.8),
  circle(6, -58, 9, sk, C.ink, 1.8), path('M-3 -60 C-3 -72.5 15 -72.5 15 -60 C10 -64 2 -64 -3 -60 Z', hr, C.ink, 1.4),
  eyes === 'closed' ? line('M8.6 -58 Q10.5 -56.4 12.4 -58', C.ink, 1.1) : circle(10.5, -57.5, 1.1, C.ink, null), line('M8 -52.6 Q10.5 -51 13 -52.8', C.ink, 1.1),
  pray ? all(lo('M0 -46 L14 -42 L17 -50', top, 5.5), path('M15 -50 L19 -58 L21 -49 Z', sk, C.ink, 1)) : all(lo('M0 -46 L18 -40', top, 6), circle(19, -40, 3, sk, C.ink, 1.2)));
const kneel = (x: number, s: number, top: string, o: { flip?: boolean; grey?: boolean; pray?: boolean; bottom?: string; eyes?: string } = {}) => {
  const k = g(`translate(${x} 112) scale(${o.flip ? -s : s} ${s})`, kneelL(o.grey ? C.grey : top, o.grey ? C.grey : (o.bottom ?? '#4a4f6a'), o.pray ?? true, o.grey ? C.grey2 : C.skin, o.grey ? C.grey : C.hair, o.eyes));
  return o.grey ? greyed(k) : k;
};
// bowing figure facing right; local: feet at 0
const bowL = (top: string, bottom: string) => all(
  lo('M-2 0 L-2 -26', bottom, 8), ellipse(1, -1.5, 5, 2.6, C.black, C.ink, 1),
  path('M-8 -30 L4 -24 L26 -36 L18 -46 Z', top, C.ink, 1.6),
  circle(30, -40, 8, C.skin, C.ink, 1.6), path('M24 -46 C28 -52 38 -48 37 -40 C34 -44 28 -46 24 -46 Z', C.hair, C.ink, 1.2),
  lo('M18 -40 L22 -22', top, 5), circle(22, -21, 2.8, C.skin, C.ink, 1));
const bow = (x: number, s: number, top: string, o: { flip?: boolean; bottom?: string } = {}) => g(`translate(${x} 112) scale(${o.flip ? -s : s} ${s})`, bowL(top, o.bottom ?? '#4a4f6a'));
/** Cross-legged meditating figure seen from the front; base at (x, y). */
const sitter = (x: number, y: number, s: number, top: string, o: { grey?: boolean; feet?: boolean; mood?: 'calm' | 'smile' | 'frown'; shaved?: boolean } = {}) => {
  const sk = o.grey ? C.grey2 : C.skin, tp = o.grey ? C.grey : top, hr = o.grey ? C.grey : C.hair;
  const k = at(x, y, s,
    path('M-26 0 C-28 -10 -14 -14 0 -10 C14 -14 28 -10 26 0 Z', tp, C.ink, 1.6),
    o.feet ? all(ellipse(-9, -8, 6, 3, sk, C.ink, 1), ellipse(9, -8, 6, 3, sk, C.ink, 1)) : line('M-14 -5 L14 -5', C.ink, 1),
    path('M-14 -44 L14 -44 C16 -30 16 -18 14 -10 L-14 -10 C-16 -18 -16 -30 -14 -44 Z', tp, C.ink, 1.8),
    lo('M-13 -42 L-22 -24 L-17 -10', tp, 5), lo('M13 -42 L22 -24 L17 -10', tp, 5), circle(-17, -9, 3, sk, C.ink, 1.1), circle(17, -9, 3, sk, C.ink, 1.1),
    rect(-3.5, -50, 7, 7, sk, 2, C.ink, 1.4), circle(0, -58, 10, sk, C.ink, 1.8),
    o.shaved ? '' : path('M-10 -60 C-10 -73 10 -73 10 -60 C6 -65 -6 -65 -10 -60 Z', hr, C.ink, 1.6),
    o.mood === 'frown' ? all(circle(-3.4, -58, 1.2, C.ink, null), circle(3.4, -58, 1.2, C.ink, null), path('M-3 -52 Q0 -54.4 3 -52', 'none', C.ink, 1.3))
      : all(path('M-5.6 -58 Q-3.6 -56 -1.6 -58 M1.6 -58 Q3.6 -56 5.6 -58', 'none', C.ink, 1.2), path('M-3 -53.4 Q0 -51 3 -53.4', 'none', C.ink, 1.2)));
  return o.grey ? greyed(k) : k;
};
/** A small bust (head and shoulders) for groups and crowds. */
const bust = (x: number, y: number, top: string, s = 1, grey = false, hat: Svg = '') => at(x, y, s,
  path('M-8 12 C-8 4 8 4 8 12 Z', grey ? C.grey : top, C.ink, 1.2), circle(0, 0, 5.4, grey ? C.grey2 : C.skin, C.ink, 1.2),
  path('M-5.4 -1 C-5.4 -8 5.4 -8 5.4 -1 C3 -4 -3 -4 -5.4 -1 Z', grey ? C.grey : C.hair, null), circle(-2, 0, 0.8, C.ink, null), circle(2, 0, 0.8, C.ink, null), hat);
const say = (cx: number, cy: number, w: number, h: number, tx: number, ty: number, inner: Svg = '') => {
  const L = cx - w / 2, R = cx + w / 2, Tp = cy - h / 2, B = cy + h / 2; let a: number[], b: number[];
  if (tx < L || tx > R) { const e = tx < L ? L : R, by = Math.max(Tp + 5, Math.min(B - 5, ty)); a = [e, by - 4]; b = [e, by + 4]; }
  else { const e = ty > cy ? B : Tp, bx = Math.max(L + 6, Math.min(R - 6, tx)); a = [bx - 4, e]; b = [bx + 4, e]; }
  return all(path(`M${a[0]} ${a[1]} L${tx} ${ty} L${b[0]} ${b[1]} Z`, C.white, C.ink, 1.4), rect(L, Tp, w, h, C.white, 5, C.ink, 1.4), path(`M${a[0]} ${a[1]} L${tx} ${ty} L${b[0]} ${b[1]} Z`, C.white, null), inner);
};
const think = (cx: number, cy: number, w: number, h: number, tx: number, ty: number, inner: Svg = '') => all(
  circle(tx, ty, 1.6, C.white, C.ink, 1), circle(f1((tx * 2 + cx) / 3), f1((ty * 2 + cy + h / 2) / 3), 2.6, C.white, C.ink, 1.1),
  ellipse(cx, cy, w / 2, h / 2, C.white, C.ink, 1.4), inner);

// ── Holy signs ───────────────────────────────────────────────────────
const rays = (x: number, y: number, r1: number, r2: number, n = 12, col: string = GOLD, w = 1.6) => all(...Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * r1)} ${f1(y + Math.sin(a) * r1)} L${f1(x + Math.cos(a) * r2)} ${f1(y + Math.sin(a) * r2)}`, col, w); }));
const glow = (x: number, y: number, r: number) => all(circle(x, y, r * 1.5, GLOW, null), rays(x, y, r * 1.1, r * 1.7), circle(x, y, r, '#ffe27a', '#e0b23c', 1.4));
const crossS = (x: number, y: number, s = 1, col: string = '#8a5a3a') => at(x, y, s, rect(-1.8, -9, 3.6, 18, col, 0.6, C.ink, 0.9), rect(-6.5, -4.5, 13, 3.6, col, 0.6, C.ink, 0.9));
const wheel = (x: number, y: number, s = 1, col: string = GOLD) => at(x, y, s, circle(0, 0, 8, 'none', col, 2), circle(0, 0, 2, col, null), ...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M0 0 L${f1(Math.cos(a) * 8)} ${f1(Math.sin(a) * 8)}`, col, 1.4); }), ...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return circle(f1(Math.cos(a) * 10), f1(Math.sin(a) * 10), 1.3, col, null); }));
const lotus = (x: number, y: number, s = 1, col: string = '#ef9fb5') => at(x, y, s, path('M0 2 C-4 -4 -4 -10 0 -14 C4 -10 4 -4 0 2 Z', col, C.ink, 1), path('M0 2 C-8 0 -12 -6 -12 -10 C-6 -8 -2 -4 0 2 Z', col, C.ink, 1), path('M0 2 C8 0 12 -6 12 -10 C6 -8 2 -4 0 2 Z', col, C.ink, 1), ellipse(0, 3, 12, 2.4, LEAF, C.ink, 0.9));
const ring = (x: number, y: number, r: number) => circle(x, y, r, 'none', HL, 2.4);
const dashBox = (x: number, y: number, w: number, h: number) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="none" stroke="${HL}" stroke-width="2.2" stroke-dasharray="5 3"/>`;
const noSign = (x: number, y: number, r = 8) => all(circle(x, y, r, 'none', RED, 2.6), line(`M${f1(x - r * 0.7)} ${f1(y - r * 0.7)} L${f1(x + r * 0.7)} ${f1(y + r * 0.7)}`, RED, 2.6));

// ── Things ───────────────────────────────────────────────────────────
const flame = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -9 C5 -3 6 1 4 4 C2 7 -2 7 -4 4 C-6 1 -4 -3 0 -9 Z', C.orange, C.ink, 1), path('M0 -2 C2 0 2 3 0 4 C-2 3 -2 0 0 -2 Z', C.yellow, null));
const candle = (x: number, y: number, s = 1, lit = true) => at(x, y, s, rect(-3, -16, 6, 16, C.white, 1, C.ink, 1.2), line('M0 -16 L0 -19', C.ink, 1), lit ? flame(0, -22, 0.7) : '');
const smokeC = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 C-5 -5 5 -9 0 -14 C-5 -19 5 -23 0 -28', 'none', '#9aa3ad', 1.8));
const lines = (x: number, y: number, w: number, n: number, gap = 4, col: string = '#9a8f78') => all(...Array.from({ length: n }, (_, i) => path(`M${x} ${y + i * gap} q${f1(w / 6)} -1.4 ${f1(w / 3)} 0 t${f1(w / 3)} 0 t${f1(w / 3)} 0`, 'none', col, 1.1)));
const scroll = (x: number, y: number, s = 1, col: string = PAGE, o: { old?: boolean } = {}) => at(x, y, s,
  rect(-18, -14, 36, 28, col, 1, C.ink, 1.3), lines(-14, -8, 28, 5, 4),
  ellipse(-18, 0, 3, 15, '#c9a46a', C.ink, 1.2), ellipse(18, 0, 3, 15, '#c9a46a', C.ink, 1.2),
  o.old ? all(line('M-6 -14 L-3 -6 L-7 2', '#8a6a3a', 1), line('M10 14 L7 6', '#8a6a3a', 1)) : '');
const fruit = (x: number, y: number) => all(circle(x - 5, y, 4, RED, C.ink, 1), circle(x + 3, y - 1, 4, C.orange, C.ink, 1), circle(x - 1, y - 6, 3.6, C.yellow, C.ink, 1), line(`M${x - 1} ${y - 9.6} l1 -2`, LEAF, 1.2));
const plateF = (x: number, y: number) => all(ellipse(x, y + 2, 12, 3.4, C.white, C.ink, 1.2), fruit(x, y - 2));
const coin = (x: number, y: number, r = 4) => all(circle(x, y, r, GOLD, C.ink, 1), circle(x, y, r * 0.55, 'none', '#b88a20', 0.8));
const grave = (x: number, y: number, s = 1, col: string = '#b8b4ac') => at(x, y, s, path('M-10 0 L-10 -18 C-10 -28 10 -28 10 -18 L10 0 Z', col, C.ink, 1.4), line('M-5 -16 L5 -16 M-5 -11 L5 -11', '#8a8680', 1.1), rect(-14, -2, 28, 4, '#9a9590', 1, C.ink, 1));
const tree = (x: number, y: number, s = 1, col: string = LEAF) => at(x, y, s, rect(-2, -14, 4, 14, '#7a4a20', 1, C.ink, 1), circle(0, -22, 10, col, C.ink, 1.4));

// ── Buildings ────────────────────────────────────────────────────────
const torii = (x: number, y: number, s = 1) => at(x, y, s, lo('M-14 0 L-12 -30 M14 0 L12 -30', RED, 3.4), path('M-22 -34 C-10 -31 10 -31 22 -34 L21 -30 C10 -28 -10 -28 -21 -30 Z', RED, C.ink, 1.3), lo('M-16 -25 L16 -25', RED, 2.4));
const plainHouse = (x: number, y: number, s = 1, col: string = '#e8d8b8') => at(x, y, s, rect(-14, -18, 28, 18, col, 0, C.ink, 1.3), path('M-17 -18 L0 -30 L17 -18 Z', '#a0673d', C.ink, 1.3), rect(-4, -10, 8, 10, '#6b4220', 0, null), rect(-11, -14, 5, 5, '#bfe3f5', 0.5, null), rect(6, -14, 5, 5, '#bfe3f5', 0.5, null));

// ── Asian buildings and things ───────────────────────────────────────
const MAROON = '#8a2a2a';
const CLAY = '#b8693a';
const PINE = '#3f7a4a';
const SAND = '#ece2c8';
const BRONZE = '#9a7a3a';
const roofT = (w: number, y: number, col: string) => path(`M${-w} ${y} C${-w * 0.6} ${y - 3} ${w * 0.6} ${y - 3} ${w} ${y} L${w * 0.7} ${y - 6} L${-w * 0.7} ${y - 6} Z`, col, C.ink, 1.2);
/** Five-storey pagoda, base at (x, y). */
const pagoda = (x: number, y: number, s = 1, n = 5) => at(x, y, s,
  ...Array.from({ length: n }, (_, i) => all(rect(-9 + i, -12 - i * 13, 18 - 2 * i, 10, '#e8d7b5', 0, C.ink, 1), roofT(17 - i * 1.6, -12 - i * 13, '#4a4f5a'))),
  line(`M0 ${-12 - n * 13 + 6} L0 ${-12 - n * 13 - 10}`, BRONZE, 2), ...[0, 1, 2].map((k) => ellipse(0, -12 - n * 13 - k * 4, 2.6, 1, BRONZE, null)));
/** White dome stupa with a golden spire, base at (x, y). */
const stupaB = (x: number, y: number, s = 1) => at(x, y, s, rect(-26, -8, 52, 8, '#e9e4d8', 1, C.ink, 1.3), path('M-22 -8 C-22 -38 22 -38 22 -8 Z', '#f6f3ea', C.ink, 1.4),
  rect(-6, -36, 12, 6, '#e9e4d8', 0, C.ink, 1.1), path('M-4 -36 L0 -58 L4 -36 Z', GOLD, C.ink, 1.1), ...[-50, -45, -40].map((yy) => line(`M-3 ${yy} L3 ${yy}`, '#b88a20', 1)));
const flagCols = ['#3f6fb5', '#f3efe6', '#c8372d', '#4f9d69', '#f2c14e'];
/** A string of prayer flags from (x1, y1) to (x2, y2). */
const flags = (x1: number, y1: number, x2: number, y2: number, n = 8) => all(path(`M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.max(y1, y2) + 10} ${x2} ${y2}`, 'none', C.ink, 1),
  ...Array.from({ length: n }, (_, i) => { const t = (i + 0.5) / n, x = f1(x1 + (x2 - x1) * t), y = f1((1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * (Math.max(y1, y2) + 10) + t * t * y2); return rect(x - 3.5, y, 7, 9, flagCols[i % 5]!, 0.5, C.ink, 0.8); }));
const wheelP = (x: number, y: number, s = 1) => at(x, y, s, rect(-9, -14, 18, 26, GOLD, 4, C.ink, 1.4), line('M-9 -6 L9 -6 M-9 4 L9 4', '#b88a20', 1.2), ...[-5, 0, 5].map((d) => circle(d, -1, 1.3, MAROON, null)), rect(-2, 12, 4, 16, WOOD, 1, C.ink, 1), path('M-6 -16 L6 -16 L0 -22 Z', GOLD, C.ink, 1));
const diya = (x: number, y: number, s = 1) => at(x, y, s, path('M-12 -4 C-12 6 12 6 12 -4 L8 -4 C6 -1 -6 -1 -8 -4 Z', CLAY, C.ink, 1.3), path('M8 -4 L14 -7 L10 -2 Z', CLAY, C.ink, 1), flame(13, -12, 0.9));
const marigold = (x: number, y: number, r = 3, col: string = C.orange) => all(circle(x, y, r, col, C.ink, 0.7), circle(x, y, r * 0.4, '#d8701c', null));
const garland = (cx: number, cy: number, rx: number, ry: number, n = 14) => all(...Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return marigold(f1(cx + Math.cos(a) * rx), f1(cy + Math.sin(a) * ry), 3, i % 2 ? C.yellow : C.orange); }));
const cow = (x: number, y: number, s = 1) => at(x, y, s, path('M-26 -30 C-28 -40 14 -42 18 -32 L18 -16 L-26 -16 Z', '#f3efe6', C.ink, 1.4), ...[-22, -14, 6, 14].map((d) => rect(d, -17, 5, 17, '#f3efe6', 1, C.ink, 1.1)),
  path('M14 -36 C20 -44 32 -42 32 -30 C32 -24 22 -22 18 -26 Z', '#f3efe6', C.ink, 1.4), path('M20 -42 C18 -48 22 -50 22 -44 M28 -42 C30 -48 26 -50 26 -44', 'none', C.ink, 1.4), circle(26, -34, 1.2, C.ink, null), path('M-26 -30 C-32 -28 -32 -20 -30 -16', 'none', C.ink, 1.2), ellipse(-6, -32, 6, 4, '#c9b08a', null));
const yinyang = (x: number, y: number, r: number) => all(circle(x, y, r, C.white, C.ink, 1.6), path(`M${x} ${y - r} A${r / 2} ${r / 2} 0 0 1 ${x} ${y} A${r / 2} ${r / 2} 0 0 0 ${x} ${y + r} A${r} ${r} 0 0 1 ${x} ${y - r} Z`, C.black, null), circle(x, f1(y - r / 2), f1(r / 7), C.black, null), circle(x, f1(y + r / 2), f1(r / 7), C.white, null), circle(x, y, r, 'none', C.ink, 1.6));
const shimenawa = (x1: number, x2: number, y: number) => all(path(`M${x1} ${y} Q${(x1 + x2) / 2} ${y + 8} ${x2} ${y}`, 'none', '#c9a24a', 6), path(`M${x1} ${y} Q${(x1 + x2) / 2} ${y + 8} ${x2} ${y}`, 'none', '#8a6a2a', 1, ),
  ...[0.3, 0.5, 0.7].map((t) => { const xx = f1(x1 + (x2 - x1) * t), yy = f1(y + 8 * 2 * t * (1 - t) + 3); return path(`M${xx} ${yy} L${xx + 3} ${yy + 4} L${xx - 1} ${yy + 6} L${xx + 3} ${yy + 11}`, 'none', C.white, 2.4) + path(`M${xx} ${yy} L${xx + 3} ${yy + 4} L${xx - 1} ${yy + 6} L${xx + 3} ${yy + 11}`, 'none', C.ink, 0.6); }));
const saisen = (x: number, y: number, s = 1) => at(x, y, s, rect(-24, -20, 48, 20, '#8a5a2e', 1, C.ink, 1.5), ...[-16, -8, 0, 8, 16].map((d) => line(`M${d} -20 L${d} -14`, '#3d2a16', 2)), rect(-26, -22, 52, 4, '#a0703e', 1, C.ink, 1.2), line('M-18 -8 L18 -8', '#6b4220', 1));
const omamori = (x: number, y: number, s = 1, col: string = '#c8372d') => at(x, y, s, path('M-10 -12 L10 -12 L10 14 L0 18 L-10 14 Z', col, C.ink, 1.4), path('M-10 -12 L0 -16 L10 -12', 'none', C.ink, 1.2), path('M-4 -16 C-6 -24 6 -24 4 -16', 'none', '#e0b23c', 1.8), ...[-4, 2, 8].map((yy) => line(`M-6 ${yy} L6 ${yy}`, GOLD, 1)), circle(0, -2, 3, GOLD, null));
const ema = (x: number, y: number, s = 1, horse = false) => at(x, y, s, path('M-14 -6 L0 -14 L14 -6 L14 10 L-14 10 Z', '#e2c48a', C.ink, 1.3), line('M-4 -14 L-6 -22 M4 -14 L6 -22', '#c8372d', 1.2),
  horse ? path('M-8 6 L-6 -2 L2 -2 L6 -6 L8 -4 L5 0 L5 6 M-6 -2 L-6 6 M2 -2 L2 6', 'none', C.ink, 1.2) : lines(-10, -2, 20, 3, 4, '#5a3a1a'));
const mikoshi = (x: number, y: number, s = 1) => at(x, y, s, rect(-14, -18, 28, 16, '#1e1e24', 1, C.ink, 1.2), rect(-10, -14, 20, 10, GOLD, 0, null), path('M-20 -18 L0 -32 L20 -18 Z', '#1e1e24', C.ink, 1.3), path('M-2 -32 L0 -38 L2 -32 Z', GOLD, C.ink, 0.8), circle(0, -40, 2.4, GOLD, C.ink, 0.8), rect(-12, -2, 24, 3, '#1e1e24', 0, null));
const bell = (x: number, y: number, s = 1) => at(x, y, s, path('M-12 0 L-12 -22 C-12 -32 12 -32 12 -22 L12 0 Z', BRONZE, C.ink, 1.5), line('M-12 -12 L12 -12 M-12 -6 L12 -6', '#6b5426', 1.1), circle(-6, -18, 1.4, '#6b5426', null), circle(0, -18, 1.4, '#6b5426', null), circle(6, -18, 1.4, '#6b5426', null), rect(-3, -36, 6, 5, BRONZE, 1, C.ink, 1));
const roofJ = (x: number, y: number, w: number, col: string = '#4a4f5a') => path(`M${x - w} ${y} C${x - w * 0.5} ${y - 4} ${x + w * 0.5} ${y - 4} ${x + w} ${y} L${x + w * 0.65} ${y - 12} L${x - w * 0.65} ${y - 12} Z`, col, C.ink, 1.4);
const mountain = (x: number, y: number, w: number, h: number, col = '#9aa8b8', snow = true) => all(path(`M${x - w} ${y} L${x} ${y - h} L${x + w} ${y} Z`, col, C.ink, 1.3), snow ? path(`M${f1(x - w * 0.28)} ${f1(y - h * 0.72)} L${x} ${y - h} L${f1(x + w * 0.28)} ${f1(y - h * 0.72)} L${f1(x + w * 0.1)} ${f1(y - h * 0.66)} L${x} ${f1(y - h * 0.74)} L${f1(x - w * 0.1)} ${f1(y - h * 0.66)} Z`, C.white, null) : '');
const crown = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 0 L-8 -8 L-4 -4 L0 -10 L4 -4 L8 -8 L8 0 Z', GOLD, C.ink, 1));
const scholarHat = () => all(rect(-9, -72, 18, 7, C.black, 1, C.ink, 1), rect(-14, -70, 28, 2.4, C.black, 1, null));
/** A scholar in a long robe with a black hat. */
const scholar = (x: number, h = 1, col = '#5a6a8a', mood: Mood = 'calm', beard = false) => all(fig(x, col, mood, { h, bottom: col, hair: beard ? '#d0d0d0' : C.hair }), on(x, h, scholarHat(), beard ? path('M-7 -53 C-6 -40 6 -40 7 -53 C4 -50 -4 -50 -7 -53 Z', '#e2e2e2', C.ink, 1) : ''));
const gourd = (x: number, y: number, s = 1) => at(x, y, s, circle(0, -8, 10, '#d8a94a', C.ink, 1.4), circle(0, -24, 6.5, '#d8a94a', C.ink, 1.4), rect(-2, -34, 4, 4, '#8a5a2e', 1, C.ink, 1), line('M-6 -16 C-2 -14 2 -14 6 -16', '#a07a2a', 1.4));
const enso = (x: number, y: number, r: number) => path(`M${x + r * 0.2} ${y - r} A${r} ${r} 0 1 1 ${x - r * 0.35} ${y - r * 0.94}`, 'none', C.ink, 4);
const qmark = (x: number, y: number, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="16" text-anchor="middle" fill="${col}">?</text>`;
const digit = (x: number, y: number, t: string, size = 9, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${t}</text>`;
const water = (x: number, y: number, w: number) => all(rect(x, y, w, 112 - y, '#a8d4ef', 0, null), ...[0, 1].map((k) => path(`M${x + 4} ${y + 5 + k * 6} q4 -2 8 0 t8 0 t8 0`, 'none', '#6aa8cf', 1.1)));
const shrineHall = (x: number, y: number, s = 1) => at(x, y, s, rect(-20, -20, 40, 20, '#e9d8b4', 0, C.ink, 1.4), roofJ(0, -20, 28), line('M-8 -36 L-3 -30 M8 -36 L3 -30', C.ink, 1.4), rect(-6, -14, 12, 14, '#7a4a20', 0.5, C.ink, 1), shimenawa(-14, 14, -18));
const chapel = (x: number, y: number, s = 1) => at(x, y, s, rect(-14, -24, 28, 24, C.white, 1, C.ink, 1.4), path('M-17 -24 L0 -38 L17 -24 Z', '#c9ced4', C.ink, 1.4), crossS(0, -44, 0.7, C.ink), path('M-4 0 L-4 -10 C-4 -14 4 -14 4 -10 L4 0 Z', '#7aa0c4', C.ink, 1));
const tample = (x: number, y: number, s = 1) => at(x, y, s, rect(-20, -18, 40, 18, '#c8372d', 0, C.ink, 1.4), roofJ(0, -18, 30, '#3d3f4a'), rect(-24, -2, 48, 3, STONE2, 0, C.ink, 1), rect(-5, -12, 10, 12, '#5a3a1a', 0, null));
const hinduTemple = (x: number, y: number, s = 1) => at(x, y, s, rect(-22, -16, 44, 16, '#e8b87a', 0, C.ink, 1.4), path('M-12 -16 C-12 -40 -6 -54 0 -60 C6 -54 12 -40 12 -16 Z', '#e8a85a', C.ink, 1.4), ...[-26, -36, -46].map((yy) => line(`M-11 ${yy} L11 ${yy}`, '#b8783a', 1)), path('M-2 -60 L0 -66 L2 -60 Z', GOLD, C.ink, 0.8), path('M-24 -16 L-14 -24 L-14 -16 Z', '#e8a85a', C.ink, 1), path('M24 -16 L14 -24 L14 -16 Z', '#e8a85a', C.ink, 1), path('M-5 0 L-5 -8 C-5 -12 5 -12 5 -8 L5 0 Z', '#6b4220', null));
const butsudan = (x: number, y: number, s = 1) => at(x, y, s, rect(-24, -54, 48, 54, '#3d2a1a', 2, C.ink, 1.6), rect(-20, -50, 40, 46, '#6b4a2a', 1, null), rect(-30, -54, 6, 48, '#3d2a1a', 1, C.ink, 1.2), rect(24, -54, 6, 48, '#3d2a1a', 1, C.ink, 1.2),
  path('M-6 -30 C-8 -36 8 -36 6 -30 L6 -24 L-6 -24 Z', GOLD, C.ink, 1), circle(0, -40, 4, GOLD, C.ink, 1), circle(0, -40, 7, 'none', '#e0b23c', 1), rect(-16, -20, 32, 3, GOLD, 0, null), candle(-12, -20, 0.5), candle(12, -20, 0.5), plateF(0, -12));
const ship = (x: number, y: number, s = 1) => at(x, y, s, path('M-40 0 L40 0 L32 14 L-32 14 Z', '#a0673d', C.ink, 1.6), line('M-44 -4 L-40 0 M44 -4 L40 0', C.ink, 1.6), line('M0 0 L0 -44', '#6b4220', 2.4), path('M2 -42 L30 -38 L30 -10 L2 -6 Z', '#f3efe6', C.ink, 1.3), coin(16, -24, 5));
const sakura = (x: number, y: number, r: number, col: string = '#f6c9d4') => all(...[0, 72, 144, 216, 288].map((d) => { const a = d * Math.PI / 180; return circle(f1(x + Math.cos(a) * r * 0.55), f1(y + Math.sin(a) * r * 0.55), f1(r * 0.5), col, C.ink, 0.6); }), circle(x, y, f1(r * 0.25), '#e0708a', null));
const dove = (x: number, y: number, s = 1) => at(x, y, s, path('M-12 0 C-8 -8 4 -8 8 -2 L16 -6 L12 2 C6 8 -6 8 -12 0 Z', C.white, C.ink, 1.3), path('M-4 -4 C-2 -14 6 -16 8 -12 C4 -8 2 -4 -4 -4 Z', C.white, C.ink, 1.1), circle(10, -3, 0.9, C.ink, null), path('M-14 -2 L-18 -4 L-16 0 Z', '#e0b23c', null));

export const ASIAN_RELIGION_MOTIFS: Record<string, Svg> = {
  // ── Buddhismens grundbegrepp ─────────────────────────────────────
  'asrel.buddhism': all(ground, stupaB(26, 112, 0.7), pagoda(98, 112, 0.55), sitter(60, 110, 0.75, SAFF, { shaved: true }), wheel(60, 26, 1.7), ring(60, 26, 22), lotus(34, 50, 0.9), lotus(88, 46, 0.9)),
  'asrel.buddhist': all(ground, at(84, 112, 1, rect(-18, -14, 36, 14, STONE2, 1, C.ink, 1.3)), at(84, 98, 0.7, path('M-24 0 C-26 -10 -12 -14 0 -10 C12 -14 26 -10 24 0 Z', GOLD, C.ink, 1.4), path('M-13 -44 L13 -44 C15 -30 15 -18 13 -10 L-13 -10 C-15 -18 -15 -30 -13 -44 Z', GOLD, C.ink, 1.6), circle(0, -54, 10, GOLD, C.ink, 1.6), path('M-5 -54 Q-3 -52 -1 -54 M1 -54 Q3 -52 5 -54', 'none', C.ink, 1.1)),
    rays(84, 60, 26, 32, 10), kneel(36, 0.95, C.sky, { pray: true, eyes: 'closed' }), smokeC(60, 92, 0.6), line('M58 104 L60 92', '#8a4a2a', 1.6), wheel(24, 22, 1), ring(36, 74, 30)),
  'asrel.upplysning': all(ground, tree(30, 112, 2.2, PINE), glow(68, 46, 10), sitter(68, 110, 0.95, SAFF, { shaved: true }), circle(68, 54, 30, 'none', '#ffe27a', 3), sparkle(36, 40, 3), sparkle(100, 36, 4), sparkle(104, 74, 3)),
  'asrel.lidande': all(ground, cloud(46, 22, 2, C.grey), line('M30 34 L28 42 M42 36 L40 44 M54 34 L52 42 M64 36 L62 44', '#6aa8cf', 1.6), sitter(46, 110, 0.9, '#7a8a9a', { mood: 'frown' }), path('M50 52 C49 56 52 57 52 54 Z', '#6aa8cf', C.ink, 0.6), greyed(fig(98, C.grey, 'smile', { h: 0.8 })), ring(46, 78, 32)),
  'asrel.begär': all(ground, fig(36, C.orange, 'shock', { h: 0.9 }), reach(36, 0.9, 1, 62, 40, C.orange), reach(36, 0.9, -1, 16, 40, C.orange), coin(80, 22, 6), coin(96, 30, 5), at(86, 52, 0.8, rect(-10, -6, 20, 12, '#e6a0a0', 3, C.ink, 1.2), rect(-10, -9, 20, 4, C.white, 2, C.ink, 1), circle(0, -12, 2.4, C.red, null)), at(104, 60, 0.4, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', C.red, C.ink, 1)), at(100, 86, 0.9, rect(-8, -14, 16, 10, '#5a6a80', 1, C.ink, 1), rect(-10, -4, 20, 4, '#5a6a80', 1, C.ink, 1)), arrow(66, 36, 76, 28, HL, 2), arrow(66, 50, 76, 52, HL, 2), arrow(66, 66, 86, 76, HL, 2)),
  'asrel.den-åttafaldiga-vägen': all(ground, path('M8 112 C30 96 40 80 60 66 C76 54 86 44 96 34', 'none', '#d8c89a', 12), ...Array.from({ length: 8 }, (_, i) => { const t = i / 7, x = f1(14 + t * 76), y = f1(106 - t * 66); return all(ellipse(x, y, 6, 3.6, '#bfb59f', C.ink, 1), digit(x, y + 3, String(i + 1), 6)); }), wheel(104, 22, 1.3), glow(104, 22, 4), fig(20, C.sky, 'smile', { h: 0.4 })),
  'asrel.karma': all(line('M4 60 L116 60', C.grey2, 1.4, '4 3'), g('translate(0 -54)', fig(14, C.green, 'smile', { h: 0.5 }), fig(34, '#8a7a6a', 'smile', { h: 0.42, hair: '#d0d0d0' })), at(24, 38, 0.6, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', C.red, C.ink, 1)), arrow(44, 40, 52, 40, HL, 2), wheel(62, 40, 0.9), arrow(72, 40, 80, 40, HL, 2), g('translate(0 -54)', fig(98, C.green, 'laugh', { h: 0.36 })), circle(98, 12, 6, C.yellow, C.ink, 1.2), rays(98, 12, 8, 11, 8, '#e0a020', 1.2), sparkle(110, 30, 2.4), fig(14, C.purple, 'angry', { h: 0.5 }), reach(14, 0.5, 1, 28, 86, C.purple), coin(31, 86, 4.4), fig(36, '#8a7a6a', 'frown', { h: 0.42 }), arrow(44, 94, 52, 94, HL, 2), wheel(62, 94, 0.9), arrow(72, 94, 80, 94, HL, 2), fig(98, C.purple, 'frown', { h: 0.36 }), cloud(98, 66, 0.8, C.grey), line('M92 74 L91 78 M98 75 L97 79 M104 74 L103 78', '#6aa8cf', 1.2)),
  'asrel.återfödelse': all(circle(60, 60, 36, 'none', '#c9b98a', 2, ), arrow(84, 32, 92, 46, HL, 2.6), arrow(88, 86, 74, 94, HL, 2.6), arrow(34, 92, 26, 76, HL, 2.6), arrow(26, 40, 40, 26, HL, 2.6),
    g('translate(-30 -78)', fig(90, C.sky, 'smile', { h: 0.4 })), grave(98, 82, 0.9), at(20, 64, 1, ellipse(0, 0, 10, 7, '#f6e6d0', C.ink, 1.2), circle(6, -4, 5, C.skin, C.ink, 1.1)), g('translate(-4 -2)', fig(64, C.green, 'smile', { h: 0.3 })), wheel(60, 60, 1.1)),
  'asrel.nirvana': all(rect(4, 4, 112, 108, '#f3f6f8', 14, null), greyed(path('M50 96 A28 28 0 1 1 70 96', 'none', C.ink, 2.4), path('M66 92 L71 97 L64 100', 'none', C.ink, 2.2), g('translate(-36 -30)', fig(60, C.grey, 'smile', { h: 0.28 })), grave(84, 72, 0.6), at(36, 76, 0.7, ellipse(0, 0, 10, 7, '#f6e6d0', C.ink, 1.2), circle(6, -4, 5, C.skin, C.ink, 1.1)), g('translate(0 -2)', fig(60, C.grey, 'smile', { h: 0.24 }))), arrow(60, 46, 60, 22, HL, 3), circle(60, 16, 12, '#fffbe6', '#ffe27a', 2), rays(60, 16, 14, 20, 12, '#ffe27a', 1.4), lotus(60, 22, 0.6), at(100, 96, 1, rect(-3, -12, 6, 12, C.white, 1, C.ink, 1), line('M0 -12 L0 -15', C.ink, 1)), smokeC(100, 80, 0.5)),
  'asrel.förgänglig': all(ground, ...[[20, 'bud'], [60, 'bloom'], [100, 'wilt']].map(([x, k]) => all(line(`M${x} 112 L${x} 70`, LEAF, 2),
    k === 'bud' ? path(`M${x} 62 C${(x as number) - 5} 68 ${(x as number) + 5} 68 ${x} 62 C${(x as number) + 4} 66 ${(x as number) - 4} 66 ${x} 62 Z`, C.pink, C.ink, 1) + ellipse(x as number, 66, 4, 6, C.pink, C.ink, 1)
    : k === 'bloom' ? sakura(x as number, 62, 16) : greyed(path(`M${x} 70 C${(x as number) + 10} 70 ${(x as number) + 12} 82 ${(x as number) + 6} 86`, 'none', '#8a7a6a', 2), ellipse((x as number) + 6, 88, 5, 3, '#b8a49a', C.ink, 1)))),
    arrow(30, 70, 46, 70, HL, 2), arrow(76, 70, 92, 70, HL, 2), ...[[96, 104], [104, 108], [88, 108]].map(([x, y]) => ellipse(x!, y!, 2.6, 1.4, '#e6b8c4', null))),
  'asrel.lotusblomma': all(rect(4, 64, 112, 48, '#a8d4ef', 0, null), ellipse(26, 92, 16, 5, LEAF, C.ink, 1.2), ellipse(96, 100, 14, 4.4, LEAF, C.ink, 1.2), line('M60 88 L60 74', LEAF, 2.4), lotus(60, 74, 2.6), path('M14 76 q6 -2 12 0 M84 84 q6 -2 12 0', 'none', '#6aa8cf', 1.2)),
  // ── Buddhistiska riktningar ──────────────────────────────────────
  'asrel.novis': all(ground, monk(34, 1, 'calm'), monk(82, 0.62, 'smile'), on(82, 0.62, rect(-10, -36, 20, 14, '#7a2f2a', 1, C.ink, 1), lines(-8, -32, 16, 2, 4)), ring(82, 80, 24)),
  'asrel.theravadabuddhism': all(ground, wheel(60, 102, 1), path('M60 92 C54 78 40 70 28 62 M60 92 C62 80 70 70 92 60', 'none', '#c9b98a', 5), at(18, 60, 1, rect(-1.2, -36, 2.4, 36, '#8a6a3a', 1, C.ink, 0.8), ...[-20, -10, 0, 10, 20].map((d) => path(`M0 -36 Q${d / 2} -44 ${d} -32`, 'none', LEAF, 2.4))), at(38, 60, 0.42, rect(-26, -8, 52, 8, GOLD, 1, C.ink, 1.3), path('M-22 -8 C-22 -38 22 -38 22 -8 Z', GOLD, C.ink, 1.4), path('M-4 -34 L0 -64 L4 -34 Z', GOLD, C.ink, 1.1)), sitter(28, 58, 0.36, SAFF, { shaved: true }), at(28, 22, 0.5, rect(-18, -4, 36, 8, '#d8b878', 1, C.ink, 1), line('M-14 0 L14 0', '#8a6a3a', 0.8), circle(-12, 0, 1, C.ink, null), circle(12, 0, 1, C.ink, null)), ring(30, 46, 26), greyed(pagoda(84, 58, 0.25), at(102, 58, 0.5, rect(-16, -18, 32, 18, '#f3efe6', 0, C.ink, 1.2), rect(-16, -22, 32, 4, MAROON, 0, C.ink, 1)))),
  'asrel.mahayanabuddhism': all(rect(4, 84, 112, 28, '#a8d4ef', 0, null), path('M10 84 L110 84 L98 102 L22 102 Z', '#a0673d', C.ink, 1.6), line('M60 84 L60 18', '#6b4220', 2.6), path('M62 20 L100 26 L100 74 L62 78 Z', '#f3efe6', C.ink, 1.3), wheel(82, 50, 1.4),
    ...[0, 1, 2, 3, 4, 5].map((i) => bust(18 + i * 8 + (i > 2 ? 46 : 0), 74, [C.orange, C.green, C.sky, C.pink, C.yellow, C.mint][i]!, 0.85)), ...[0, 1].map((i) => bust(28 + i * 14, 62, [C.navy, C.red][i]!, 0.85))),
  'asrel.bodhisattva': all(ground, cloud(68, 48, 2.2, C.white), at(68, 44, 0.75, path('M-13 -44 L13 -44 L16 0 L-16 0 Z', GOLD, C.ink, 1.6), circle(0, -54, 10, GOLD, C.ink, 1.6), path('M-5 -54 Q-3 -52 -1 -54 M1 -54 Q3 -52 5 -54', 'none', C.ink, 1.1), circle(0, -54, 16, 'none', '#ffe27a', 2.4), lo('M-12 -40 L-30 -14', GOLD, 4)), circle(46, 34, 2.8, GOLD, C.ink, 1),
    ...[0, 1, 2].map((i) => bust(18 + i * 16, 100 - (i % 2) * 4, [C.orange, C.green, C.sky][i]!, 1.1)), arrow(44, 40, 36, 80, HL, 2.2), sparkle(96, 22, 3)),
  'asrel.sutra': all(ground, monk(30, 0.95, 'calm'), reach(30, 0.95, 1, 62, 64, SAFF), at(84, 66, 1, rect(-24, -16, 48, 32, '#f3e6c4', 1, C.ink, 1.3), ...[-18, -12, -6, 0, 6, 12, 18].map((d) => line(`M${d} -12 L${d} 12`, '#9a8f78', 1.1, '2 2')), ellipse(-24, 0, 3, 17, '#7a2f2a', C.ink, 1.1), ellipse(24, 0, 3, 17, '#7a2f2a', C.ink, 1.1)), ring(84, 66, 30)),
  'asrel.zenbuddhism': all(ground, rect(78, 30, 34, 82, '#e9e1cf', 0, C.ink, 1.4), at(56, 110, 1, path('M-20 0 C-22 -10 -10 -14 0 -10 C10 -14 22 -10 20 0 Z', '#3d3f4a', C.ink, 1.4), path('M-12 -42 L12 -42 C14 -30 14 -18 12 -10 L-12 -10 C-14 -18 -14 -30 -12 -42 Z', '#3d3f4a', C.ink, 1.6), circle(0, -52, 9, C.skin, C.ink, 1.6)), enso(36, 34, 20), sparkle(22, 70, 2.4, C.grey)),
  'asrel.koan': all(ground, monk(30, 0.95, 'smile'), reach(30, 0.95, 1, 52, 44, SAFF), path('M50 46 L54 34 L58 46 Z', C.skin, C.ink, 1), line('M60 34 C64 38 64 42 60 46 M64 32 C70 38 70 44 64 50', C.grey, 1.4), fig(92, C.sky, 'shock', { h: 0.75 }), think(96, 22, 26, 22, 92, 42, all(qmark(90, 28, HL), qmark(102, 28, HL)))),
  'asrel.tibetansk-buddhism': all(ground, mountain(28, 112, 40, 80), mountain(96, 112, 34, 64), at(64, 112, 1, rect(-26, -30, 52, 30, '#f3efe6', 0, C.ink, 1.4), rect(-26, -36, 52, 6, MAROON, 0, C.ink, 1.2), ...[-16, -4, 8, 20].map((d) => rect(d - 3, -24, 6, 8, '#2e2e36', 0.5, null)), path('M-8 -36 L0 -46 L8 -36 Z', GOLD, C.ink, 1)), flags(8, 40, 112, 30, 10)),
  'asrel.dalai-lama': all(ground, at(60, 112, 1, rect(-20, -26, 40, 26, '#c8a04a', 2, C.ink, 1.4)), fig(60, MAROON, 'smile', { h: 0.8, bottom: MAROON, hair: '#5a5a5a' }), on(60, 0.8, path('M-14 -42 L14 -42 L14 -36 L-14 -36 Z', '#e8b030', C.ink, 1), rect(-8, -59, 6, 4, 'none', 2, C.ink, 0.9), rect(2, -59, 6, 4, 'none', 2, C.ink, 0.9), line('M-2 -57 L2 -57', C.ink, 0.9)),
    bow(16, 0.45, C.green), bow(104, 0.45, C.sky, { flip: true }), path('M74 88 C80 92 84 98 82 104', 'none', C.white, 3), mountain(18, 50, 16, 26), mountain(102, 50, 16, 26)),
  'asrel.bönekvarn': all(ground, fig(34, '#6b5a8a', 'smile', { h: 0.95 }), reach(34, 0.95, 1, 66, 82, '#6b5a8a'), wheelP(70, 56, 1.5), path('M88 40 C98 46 98 62 88 68', 'none', HL, 2.4), path('M86 64 L88 70 L93 65', 'none', HL, 2.4)),
  'asrel.böneflagga': all(ground, mountain(60, 112, 54, 70), line('M10 112 L10 30 M110 112 L110 40', '#6b4220', 2.6), flags(10, 32, 110, 42, 10), path('M14 70 C24 66 34 72 44 66', 'none', '#9aa3ad', 1.4, ), path('M74 22 C84 18 94 24 104 18', 'none', '#9aa3ad', 1.4)),
  'asrel.stupa-noun': all(ground, stupaB(60, 112, 1.5), ellipse(60, 102, 50, 8, 'none', HL, 2, ), path('M100 98 L108 102 L100 106', 'none', HL, 2), fig(14, C.green, 'smile', { h: 0.4 }), fig(104, C.orange, 'smile', { h: 0.4 })),
  'asrel.pagod': all(ground, pagoda(60, 112, 1.2), tree(16, 112, 1, PINE), tree(104, 112, 1, PINE)),
  // ── Hinduismens traditioner ──────────────────────────────────────
  'asrel.hinduism': all(water(4, 92, 112), hinduTemple(60, 92, 0.95), cow(100, 92, 0.6), fig(22, '#f3efe6', 'calm', { h: 0.34 }), at(22, 40, 1, line('M0 14 L0 -10', '#7a6a5a', 2), path('M-7 -12 C-7 -2 7 -2 7 -12 M0 -14 L0 -6', 'none', '#7a6a5a', 2)), at(98, 30, 1, circle(0, 0, 8, 'none', '#d8a020', 2.4), ...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return path(`M${f1(Math.cos(a) * 8)} ${f1(Math.sin(a) * 8)} L${f1(Math.cos(a + 0.2) * 12)} ${f1(Math.sin(a + 0.2) * 12)}`, 'none', C.orange, 1.6); }), circle(0, 0, 2.4, '#d8a020', null)), lotus(60, 14, 0.9), dashBox(6, 6, 108, 104)),
  'asrel.hindu': all(ground, hinduTemple(92, 112, 0.75), fig(44, '#d84a6a', 'smile', { h: 1, hairStyle: 'long', bottom: '#d84a6a' }), on(44, 1, circle(0, -61, 1.6, C.red, null), path('M-14 -40 L14 -12 L14 -4 L-14 -32 Z', '#f2c14e', null)), reach(44, 1, 1, 64, 76, '#d84a6a'), diya(70, 76, 0.8)),
  'asrel.kast': all(...[0, 1, 2, 3].map((i) => all(path(`M${60 - 14 - i * 12} ${28 + i * 22} L${60 + 14 + i * 12} ${28 + i * 22} L${60 + 26 + i * 12} ${50 + i * 22} L${60 - 26 - i * 12} ${50 + i * 22} Z`, ['#e8c07a', '#d8a85a', '#c8904a', '#b8783a'][i]!, C.ink, 1.3),
    ...Array.from({ length: i + 2 }, (_, k) => bust(f1(60 + (k - (i + 1) / 2) * 13), 38 + i * 22, i === 2 ? C.green : C.grey2, 0.75, i !== 2)))), dashBox(14, 70, 92, 24)),
  'asrel.kastsystem': all(...[0, 1, 2, 3].map((i) => all(path(`M${60 - 14 - i * 12} ${28 + i * 22} L${60 + 14 + i * 12} ${28 + i * 22} L${60 + 26 + i * 12} ${50 + i * 22} L${60 - 26 - i * 12} ${50 + i * 22} Z`, ['#e8c07a', '#d8a85a', '#c8904a', '#b8783a'][i]!, C.ink, 1.3),
    ...Array.from({ length: i + 2 }, (_, k) => bust(f1(60 + (k - (i + 1) / 2) * 13), 38 + i * 22, [C.orange, C.green, C.sky, C.pink][i]!, 0.75)))), line('M60 6 L60 20', C.ink, 1.4), path('M52 12 L60 4 L68 12', 'none', C.ink, 1.4), noSign(100, 50, 7), arrow(96, 64, 96, 40, C.grey, 1.6), dashBox(6, 24, 108, 92)),
  'asrel.kastlös': all(greyed(...[0, 1, 2, 3].map((i) => path(`M${44 - 10 - i * 9} ${28 + i * 20} L${44 + 10 + i * 9} ${28 + i * 20} L${44 + 19 + i * 9} ${48 + i * 20} L${44 - 19 - i * 9} ${48 + i * 20} Z`, '#c8904a', C.ink, 1.3)), ...[0, 1, 2, 3].map((i) => bust(44, 36 + i * 20, C.grey, 0.7, true))), ground, fig(100, '#8a7a6a', 'frown', { h: 0.72 }), on(100, 0.72, line('M14 -20 L22 40', '#8a5a2e', 2.4), path('M16 38 L28 38 L24 48 L18 48 Z', '#c9a24a', C.ink, 1)), ring(100, 78, 22)),
  'asrel.guru': all(ground, at(32, 112, 1, rect(-24, -14, 48, 14, '#c9a46a', 1, C.ink, 1.3)), sitter(32, 98, 0.8, '#f3efe6', {}), at(32, 98, 0.8, path('M-7 -53 C-6 -40 6 -40 7 -53 C4 -50 -4 -50 -7 -53 Z', '#e2e2e2', C.ink, 1), path('M-10 -60 C-10 -73 10 -73 10 -60 C6 -65 -6 -65 -10 -60 Z', '#e2e2e2', C.ink, 1.4)), ...[0, 1, 2].map((i) => sitter(70 + i * 18, 110, 0.42, [C.orange, C.green, C.sky][i]!, {})), say(70, 30, 30, 16, 42, 46, lines(60, 28, 20, 2, 4))),
  'asrel.asket': all(ground, greyed(plainHouse(100, 112, 0.9), coin(92, 82, 4)), line('M88 72 L112 100', RED, 2.4), fig(46, SAFF, 'calm', { h: 1, w: 0.7, bottom: C.skin, hair: '#5a4a3a', hairStyle: 'long' }), on(46, 1, path('M-10 -64 C-14 -50 -12 -40 -14 -30 M10 -64 C14 -50 12 -40 14 -30', 'none', '#5a4a3a', 3), path('M-7 -50 C-6 -40 6 -40 7 -50', '#8a7a6a', C.ink, 1)), line('M22 40 L22 112', '#8a5a2e', 2.6), reach(46, 1, -1, 22, 64, SAFF)),
  'asrel.yoga': all(ground, rect(10, 106, 100, 6, '#8cc7a0', 2, C.ink, 1.2), at(60, 106, 1, lo('M0 0 L0 -40', '#3f6fb5', 6), lo('M0 -24 L-12 -30 L0 -38', '#3f6fb5', 6), path('M-10 -70 L10 -70 L8 -42 L-8 -42 Z', '#a8dcc0', C.ink, 1.6), circle(0, -80, 8, C.skin, C.ink, 1.6), path('M-8 -82 C-8 -92 8 -92 8 -82 C4 -86 -4 -86 -8 -82 Z', C.hair, C.ink, 1.2), lo('M-8 -68 L-4 -98', '#a8dcc0', 4.5), lo('M8 -68 L4 -98', '#a8dcc0', 4.5), path('M-4 -104 L4 -104 L2 -96 L-2 -96 Z', C.skin, C.ink, 1))),
  'asrel.helig-ko': all(ground, cow(58, 112, 1.6), garland(92, 66, 6, 8, 9), at(60, 112, 1, circle(38, -60, 1.6, C.red, null)), fig(12, '#d84a6a', 'smile', { h: 0.55, hairStyle: 'long' }), sparkle(40, 30, 3), sparkle(76, 28, 3)),
  'asrel.ickevåld': all(ground, ...[0, 1, 2].map((i) => all(fig(22 + i * 26, [C.white, C.sky, C.orange][i]!, 'calm', { h: 0.7 }), reach(22 + i * 26, 0.7, 1, 32 + i * 26, 46, [C.white, C.sky, C.orange][i]!))),
    lo('M92 54 L108 38', '#8a5a2e', 4), noSign(100, 46, 13), dove(98, 90)),
  'asrel.oljelampa': all(rect(4, 4, 112, 108, NIGHT, 14, null), ground, rays(88, 52, 14, 22, 10, '#ffe27a', 1.8), diya(56, 92, 2.4)),
  'asrel.girlang': all(ground, fig(60, '#f3efe6', 'smile', { h: 1.05 }), on(60, 1.05, ...Array.from({ length: 11 }, (_, i) => { const a = Math.PI * (0.05 + 0.9 * i / 10); return marigold(f1(Math.cos(a) * -13), f1(-44 + Math.sin(a) * 22), 3.2, i % 2 ? C.yellow : C.orange); })), ring(60, 66, 28)),
  // ── Shintoismens ritualer ────────────────────────────────────────
  'asrel.shintoism': all(ground, circle(86, 34, 16, '#e0402e', C.ink, 1.4), mountain(80, 112, 40, 52, '#9ab8a0', false), tree(18, 112, 1.6, PINE), shimenawa(8, 28, 76), torii(104, 112, 0.6), fig(52, C.white, 'calm', { h: 0.82, bottom: '#5a6a8a' }), reach(52, 0.82, 1, 70, 60, C.white), reach(52, 0.82, -1, 66, 62, C.white), path('M74 54 L78 52 M74 60 L79 60 M74 66 L78 68', 'none', HL, 1.6), sakura(34, 22, 6), sakura(48, 12, 5), sakura(64, 22, 5), dashBox(4, 4, 112, 108)),
  'asrel.ande': all(ground, mountain(26, 112, 26, 56, '#9ab8a0', false), rect(54, 50, 10, 62, '#bfe3f5', 0, null), line('M56 54 L56 110 M60 52 L60 108 M62 56 L62 110', '#7fb2d6', 1), tree(96, 112, 2, PINE), ...[[26, 44], [59, 38], [96, 52]].map(([x, y]) => `<g opacity="0.85">${path(`M${x! - 7} ${y! + 10} C${x! - 9} ${y! - 6} ${x! + 9} ${y! - 6} ${x! + 7} ${y! + 10} L${x! + 3} ${y! + 6} L${x} ${y! + 12} L${x! - 3} ${y! + 6} Z`, '#f2f8ff', '#8cb8e0', 1.6)}${circle(x! - 2.6, y!, 1.2, '#5a7aa0', null)}${circle(x! + 2.6, y!, 1.2, '#5a7aa0', null)}</g>` + sparkle(x! + 10, y! - 8, 2.4, '#8cb8e0')), ring(59, 42, 14), bow(70, 0.42, C.sky)),
  'asrel.helgedomsport': all(ground, path('M40 112 L52 66 L68 66 L80 112 Z', '#d8c89a', null), torii(60, 112, 2.6), tree(10, 112, 1.3, PINE), tree(110, 112, 1.3, PINE)),
  'asrel.halmrep': all(ground, at(60, 112, 1, rect(-14, -86, 28, 86, '#8a5a2e', 6, C.ink, 1.6), line('M-6 -70 L-6 -20 M6 -60 L6 -10', '#6b4220', 1.2)), shimenawa(28, 92, 50), ring(60, 56, 38), circle(28, 36, 16, PINE, C.ink, 1.2), circle(92, 36, 16, PINE, C.ink, 1.2)),
  'asrel.renhet': all(ground, line('M10 20 L74 20', '#8a5a2e', 3), at(42, 20, 1.8, path('M0 0 L8 6 L-2 12 L8 18 L-2 24 L6 30', 'none', C.white, 6), path('M0 0 L8 6 L-2 12 L8 18 L-2 24 L6 30', 'none', '#c9ced4', 0.8)), at(30, 112, 1, ellipse(0, -2, 14, 3, C.white, C.ink, 1), path('M-12 -2 L0 -26 L12 -2 Z', C.white, C.ink, 1.3)), sparkle(16, 84, 4, '#7fb2e0'), sparkle(58, 80, 4, '#7fb2e0'), sparkle(66, 40, 3.4, '#7fb2e0'), sparkle(22, 40, 3, '#7fb2e0'), dashBox(8, 10, 70, 100), greyed(at(98, 100, 1, path('M-14 -10 L-4 -18 L10 -14 L14 0 L4 10 L-12 6 Z', '#b8b0a0', C.ink, 1.3), circle(-2, -6, 3, '#6a5a3a', null), circle(6, 2, 2.4, '#6a5a3a', null), path('M-8 0 L0 -4 L6 -8', 'none', C.ink, 0.8)))),
  'asrel.offerlåda': all(ground, saisen(60, 112, 2), coin(60, 50, 5), coin(48, 38, 4), arrow(60, 58, 60, 70, HL, 2.2), line('M30 4 L30 40 M90 4 L90 40', '#c9a24a', 2), shimenawa(30, 90, 16)),
  'asrel.amulett': all(omamori(60, 62, 2.6), ring(60, 62, 44)),
  'asrel.spådom': all(ground, line('M10 46 L110 46', '#6b4220', 2), ...[18, 30, 42, 54, 66, 78, 90, 102].map((x, i) => path(`M${x} 46 l-3 6 l3 10 l3 -10 Z`, C.white, C.ink, 0.9) + (i % 3 === 0 ? '' : '')), fig(36, C.sky, 'smile', { h: 0.62 }), reach(36, 0.62, 1, 60, 80, C.sky), at(64, 80, 1, rect(-10, -14, 20, 28, C.white, 1, C.ink, 1.2), lines(-7, -9, 14, 5, 4, C.ink)), ring(64, 80, 20), line('M100 62 L100 112', '#6b4220', 2)),
  'asrel.votivtavla': all(ground, line('M8 26 L112 26', '#6b4220', 3), line('M10 26 L10 112 M110 26 L110 112', '#6b4220', 3), ema(32, 50, 1.4, true), ema(60, 54, 1.4), ema(88, 50, 1.4), ema(44, 86, 1.2), ema(76, 88, 1.2, true), ring(32, 50, 22)),
  'asrel.tempeljungfru': all(ground, fig(60, C.white, 'smile', { h: 1.05, bottom: '#c8372d', hairStyle: 'long' }), on(60, 1.05, path('M-14 -10 L14 -10 L18 46 L-18 46 Z', '#c8372d', C.ink, 1.4), path('M-6 -40 L0 -30 L6 -40', 'none', C.ink, 1), path('M-2 -66 L2 -66 L4 -60 L-4 -60 Z', C.white, C.ink, 0.6)), shrineHall(104, 112, 0.6)),
  'asrel.bärbar-helgedom': all(ground, mikoshi(60, 60, 1.6), line('M6 62 L114 62 M6 70 L114 70', '#3d2a1a', 3), ...[0, 1, 2, 3].map((i) => all(fig(18 + i * 28, C.white, 'laugh', { h: 0.55 }), on(18 + i * 28, 0.55, rect(-10, -70, 20, 4, C.white, 1, C.ink, 0.8)))), sparkle(14, 20, 3), sparkle(106, 20, 3)),
  // ── Konfucianismens idéer ────────────────────────────────────────
  'asrel.konfucianism': all(ground, scholar(36, 1, '#6a5a8a', 'calm', true), reach(36, 1, 1, 62, 64, '#6a5a8a'), scroll(70, 58, 0.6), ...[0, 1].map((i) => bow(78 + i * 22, 0.55, [C.green, C.sky][i]!, { flip: true })), yinyang(100, 22, 9)),
  'asrel.harmoni': all(ground, ...[0, 1, 2].map((i) => fig(30 + i * 30, [C.orange, C.green, C.sky][i]!, 'laugh', { h: [0.82, 0.7, 0.86][i]!, hairStyle: i === 1 ? 'long' : 'short' })), line('M38 72 L52 74 M68 74 L82 72', C.skin, 3), path('M14 26 C30 10 44 38 60 22 C76 8 90 36 106 20', 'none', '#7fb2a0', 2.2), ...[[22, 22], [46, 30], [70, 16], [96, 26]].map(([x, y]) => all(ellipse(x!, y! + 6, 3.6, 2.6, C.ink, null), line(`M${x! + 3.4} ${y! + 6} L${x! + 3.4} ${y! - 6}`, C.ink, 1.4))), at(104, 54, 1, path('M-8 -6 L0 -6 C0 -10 6 -10 6 -6 L8 -6 L8 6 L-8 6 Z', C.yellow, C.ink, 1.1)), at(104, 66, 1, path('M-8 -6 L0 -6 C0 -2 6 -2 6 -6 L8 -6 L8 6 L-8 6 Z', C.pink, C.ink, 1.1))),
  'asrel.härskare': all(ground, at(60, 112, 1, rect(-22, -34, 44, 34, '#c8372d', 2, C.ink, 1.4), rect(-24, -60, 48, 28, '#c8372d', 3, C.ink, 1.4)), fig(60, '#e0b23c', 'calm', { h: 0.8, bottom: '#e0b23c' }), on(60, 0.8, crown(0, -66, 1.3)), bow(14, 0.45, C.green), bow(106, 0.45, C.sky, { flip: true }), ring(60, 50, 26)),
  'asrel.vördnad-för-föräldrarna': all(ground, fig(26, '#8a7a6a', 'smile', { h: 0.82, hair: '#d0d0d0' }), fig(50, '#6a5a8a', 'smile', { h: 0.78, hair: '#d0d0d0', hairStyle: 'long' }), bow(80, 0.75, C.green, { flip: true }), at(66, 84, 1, ellipse(0, 0, 7, 2, C.white, C.ink, 1), path('M-4 0 L-3 -6 L3 -6 L4 0 Z', C.white, C.ink, 1)), path('M64 74 C62 70 66 68 64 64', 'none', C.grey, 1), heart(40, 26, 4), ring(38, 66, 30)),
  'asrel.förfädersdyrkan': all(ground, at(66, 112, 1, rect(-30, -34, 60, 34, '#6b4a2a', 2, C.ink, 1.4)), ...[0, 1, 2].map((i) => at(46 + i * 20, 78, 1, rect(-6, -20, 12, 20, '#3d2a1a', 1, C.ink, 1), rect(-4, -18, 8, 14, '#f3e6c4', 0, null), circle(0, -13, 2.6, C.grey, null))), line('M66 78 L66 70 M62 78 L60 70', '#8a4a2a', 1.4), smokeC(64, 68, 0.6), plateF(46, 80), kneel(16, 0.62, C.sky, { pray: true }), ring(66, 64, 22)),
  'asrel.ämbetsman': all(ground, rect(54, 82, 58, 6, '#8a5a2e', 2, C.ink, 1.4), line('M60 88 L60 112 M106 88 L106 112', '#6b4220', 3), scholar(36, 1, '#2f4a7a', 'calm'), reach(36, 1, 1, 62, 78, '#2f4a7a'), scroll(84, 74, 0.6), rect(98, 70, 8, 8, '#c8372d', 1, C.ink, 1), ring(36, 60, 30)),
  'asrel.ämbetsexamen': all(...[0, 1, 2].map((r) => all(...[0, 1, 2].map((c) => all(rect(10 + c * 36, 10 + r * 34, 30, 30, '#e8dcc0', 1, C.ink, 1.2), bust(25 + c * 36, 26 + r * 34, '#6a7a9a', 0.75), rect(16 + c * 36, 34 + r * 34, 18, 4, C.white, 0.5, C.ink, 0.6))))), dashBox(6, 6, 108, 106)),
  'asrel.medmänsklighet': all(ground, cloud(30, 16, 1.4, C.grey), cloud(92, 14, 1.2, C.grey), ...[[14, 30], [24, 38], [104, 28], [112, 40], [8, 50], [112, 60]].map(([x, y]) => line(`M${x} ${y} L${x! - 2} ${y! + 6}`, '#6aa8cf', 1.4)), fig(42, C.orange, 'smile', { h: 0.92 }), fig(80, '#6a5a8a', 'smile', { h: 0.84, hair: '#d0d0d0', skin: '#c99068' }), on(80, 0.84, line('M16 -20 L20 49', '#6b4220', 2.2)), reach(42, 0.92, 1, 56, 50, C.orange), line('M56 50 L58 26', C.ink, 1.6), path('M28 28 C34 8 82 8 88 28 Z', '#3f6fb5', C.ink, 1.4), heart(60, 40, 4)),
  'asrel.gyllene-regeln': all(ground, fig(22, C.green, 'smile', { h: 0.9 }), fig(98, C.orange, 'smile', { h: 0.9 }), path('M36 40 C50 28 70 28 84 40', 'none', GOLD, 2.6), path('M80 34 L85 41 L77 42', 'none', GOLD, 2.6), heart(60, 26, 5), path('M84 80 C70 92 50 92 36 80', 'none', GOLD, 2.6), path('M40 86 L35 79 L43 78', 'none', GOLD, 2.6), heart(60, 90, 5), digit(60, 64, '=', 18, GOLD)),
  // ── Taoismens begrepp ────────────────────────────────────────────
  'asrel.taoism': all(ground, mountain(30, 112, 34, 74, '#9ab8a0', false), mountain(88, 112, 30, 58, '#a8c4b0', false), water(4, 100, 112), path('M50 112 C56 96 64 88 70 76', 'none', '#d8c89a', 4), scholar(66, 0.4, '#f3efe6', 'calm', true), yinyang(98, 22, 12), cloud(30, 22, 1.2, C.white)),
  'asrel.yin-och-yang': all(yinyang(60, 60, 40)),
  'asrel.motsatspar': all(circle(28, 30, 12, C.yellow, C.ink, 1.4), rays(28, 30, 14, 19, 10), circle(92, 30, 12, NIGHT, C.ink, 1.4), path('M96 20 A11 11 0 1 0 96 40 A8 8 0 1 1 96 20 Z', '#f3e6a1', null), arrow(48, 30, 70, 30, HL, 2), arrow(70, 30, 48, 30, HL, 2),
    at(28, 84, 1, rect(-6, -22, 12, 28, C.white, 6, C.ink, 1.3), circle(0, 8, 8, C.red, C.ink, 1.3), rect(-2, -14, 4, 18, C.red, 1, null)), at(92, 84, 1, rect(-6, -22, 12, 28, C.white, 6, C.ink, 1.3), circle(0, 8, 8, '#5aa7d6', C.ink, 1.3), rect(-2, 0, 4, 6, '#5aa7d6', 1, null)), arrow(48, 86, 70, 86, HL, 2), arrow(70, 86, 48, 86, HL, 2)),
  'asrel.jämvikt': all(ground, at(48, 112, 1, path('M-10 0 L10 0 L2 -60 L-2 -60 Z', '#8a7a6a', C.ink, 1.3), line('M-38 -60 L38 -60', C.ink, 2.4), path('M-38 -60 L-46 -40 L-30 -40 Z', 'none', C.ink, 1), path('M38 -60 L30 -40 L46 -40 Z', 'none', C.ink, 1), ellipse(-38, -40, 10, 3, '#c9a24a', C.ink, 1), ellipse(38, -40, 10, 3, '#c9a24a', C.ink, 1)), yinyang(10, 64, 7), circle(86, 64, 7, C.black, C.ink, 1), ring(48, 52, 46),
    greyed(at(106, 112, 0.42, path('M-10 0 L10 0 L2 -60 L-2 -60 Z', '#8a7a6a', C.ink, 1.3), line('M-36 -72 L36 -48', C.ink, 3)))),
  'asrel.livsenergi': all(ground, fig(60, '#a8dcc0', 'calm', { h: 1.05 }), path('M60 100 C40 80 80 70 60 50 C44 36 76 28 60 12', 'none', '#7fb2e0', 3), path('M30 96 C20 80 34 66 24 54 M90 96 C100 80 86 66 96 54', 'none', '#7fb2e0', 2, ), sparkle(60, 12, 3, '#7fb2e0'), sparkle(24, 50, 2.4, '#7fb2e0'), sparkle(96, 50, 2.4, '#7fb2e0')),
  'asrel.enkelhet': all(ground, rect(8, 84, 50, 6, '#c9a46a', 1, C.ink, 1.3), line('M14 90 L14 112 M52 90 L52 112', '#8a5a2e', 3), ellipse(22, 80, 7, 3, C.white, C.ink, 1.1), path('M15 80 C15 87 29 87 29 80', C.white, C.ink, 1.1), rect(36, 72, 7, 10, '#a8c4b0', 1, C.ink, 1), line('M50 82 L50 66', LEAF, 1.4), circle(50, 64, 3, C.pink, C.ink, 0.8), ring(33, 82, 26), greyed(rect(64, 84, 50, 6, '#c9a46a', 1, C.ink, 1.3), line('M70 90 L70 112 M108 90 L108 112', '#8a5a2e', 3), rect(66, 70, 18, 14, '#a0673d', 1, C.ink, 1), rect(86, 64, 14, 20, '#5a6a80', 1, C.ink, 1), circle(104, 78, 6, C.red, C.ink, 1), rect(70, 56, 24, 14, '#c9a24a', 1, C.ink, 1), rect(74, 44, 12, 12, C.green, 1, C.ink, 1), circle(98, 56, 6, C.yellow, C.ink, 1), rect(88, 38, 14, 10, C.purple, 1, C.ink, 1), line('M80 44 L76 30 M96 38 L100 26', C.ink, 1.4))),
  'asrel.följsam': all(rect(4, 70, 112, 42, '#a8d4ef', 0, null), path('M30 112 C30 86 50 80 60 80 C74 80 86 88 86 112 Z', '#9a9a9a', C.ink, 1.4), path('M4 84 C20 82 26 76 30 70 M4 96 C18 96 24 92 28 88 M86 76 C96 74 104 80 116 82 M90 96 C100 96 108 96 116 98', 'none', '#2e6f9a', 2), arrow(8, 76, 26, 66, HL, 2), arrow(92, 70, 112, 74, HL, 2),
    path('M60 70 C62 50 70 36 84 26', 'none', LEAF, 2.4), ellipse(86, 24, 6, 2.4, LEAF, C.ink, 0.8), line('M70 18 C80 16 90 18 100 14', C.grey, 1.4, '3 3')),
  'asrel.odödlighet': all(ground, mountain(60, 112, 54, 90, '#9ab8a0', false), cloud(24, 62, 1.6, C.white), cloud(96, 52, 1.4, C.white), scholar(60, 0.42, '#f3efe6', 'smile', true), at(76, 66, 1, circle(0, 0, 5, '#f6a0a0', C.ink, 1), ellipse(4, -4, 3, 1.4, LEAF, null)), path('M42 18 C42 10 54 10 60 18 C66 26 78 26 78 18 C78 10 66 10 60 18 C54 26 42 26 42 18 Z', 'none', HL, 2.4)),
  'asrel.elixir': all(ground, gourd(60, 104, 2), path('M60 30 C54 24 66 18 60 12', 'none', '#b8dccb', 2), sparkle(34, 46, 3), sparkle(88, 40, 4), sparkle(92, 80, 3)),
  'asrel.tai-chi': all(ground, ...[0, 1].map((i) => all(fig(34 + i * 48, ['#f3efe6', '#c8372d'][i]!, 'calm', { h: 0.88, hair: '#d0d0d0' }), reach(34 + i * 48, 0.88, 1, 54 + i * 48, 50, ['#f3efe6', '#c8372d'][i]!), reach(34 + i * 48, 0.88, -1, 22 + i * 48, 74, ['#f3efe6', '#c8372d'][i]!))), line('M40 30 C50 20 60 22 64 30', C.grey, 1.4, '3 3'), tree(108, 112, 1, LEAF)),
  // ── Religion i Japan ─────────────────────────────────────────────
  'asrel.synkretism': all(ground, torii(18, 60, 0.6), tample(60, 58, 0.55), chapel(102, 60, 0.75), arrow(22, 66, 46, 84, HL, 2), arrow(60, 64, 60, 80, HL, 2), arrow(98, 66, 74, 84, HL, 2), fig(60, C.sky, 'smile', { h: 0.3 }), ellipse(60, 100, 22, 12, 'none', HL, 2)),
  'asrel.nyårsbesök': all(ground, shrineHall(60, 84, 1), saisen(60, 96, 0.8), ...[0, 1, 2, 3, 4].map((i) => bust(14 + i * 23, 104, [C.orange, C.navy, C.pink, C.green, C.red][i]!, 1)), at(100, 24, 1, rect(-12, -12, 24, 26, C.white, 2, C.ink, 1.2), rect(-12, -12, 24, 7, C.red, 2, C.ink, 1.2), digit(0, 10, '1', 12))),
  'asrel.tempelklocka': all(ground, at(60, 112, 1, line('M-36 0 L-30 -86 M36 0 L30 -86', '#6b4220', 4), roofJ(0, -84, 44)), line('M60 30 L60 38', C.ink, 2), bell(60, 74, 1.6), line('M8 62 L36 64', '#8a5a2e', 6), line('M10 54 L10 62 M22 54 L22 63', C.ink, 1), path('M38 52 L44 56 M38 64 L46 64 M38 76 L44 72', 'none', HL, 1.8)),
  'asrel.husaltare': all(ground, rect(20, 98, 80, 14, '#8a5a2e', 1, C.ink, 1.3), butsudan(60, 98, 1.2), ring(60, 66, 40)),
  'asrel.stenträdgård': all(rect(4, 30, 112, 82, SAND, 0, null), rect(4, 20, 112, 12, '#c8b07a', 0, C.ink, 1.2), ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => line(`M4 ${40 + i * 9} L116 ${40 + i * 9}`, '#cdbf9c', 1.2)), ...[[34, 64, 12, 8], [80, 84, 16, 10], [96, 52, 8, 6]].map(([x, y, rx, ry]) => all(ellipse(x!, y!, rx! + 6, ry! + 5, SAND, '#cdbf9c', 1.2), ellipse(x!, y!, rx! + 11, ry! + 9, 'none', '#cdbf9c', 1.2), path(`M${x! - rx!} ${y} C${x! - rx!} ${y! - ry! * 1.6} ${x! + rx!} ${y! - ry! * 1.6} ${x! + rx!} ${y} Z`, '#8a8a8a', C.ink, 1.3))), tree(110, 30, 0.6, PINE)),
  'asrel.lyckogud': all(rect(4, 92, 112, 20, '#a8d4ef', 0, null), ship(60, 90, 1.2), ...[0, 1, 2, 3, 4, 5, 6].map((i) => bust(f1(20 + i * 8 + (i > 3 ? 4 : 0)), 82, [C.red, C.green, C.yellow, C.sky, C.orange, C.purple, C.pink][i]!, 0.75)), ...[[16, 20], [104, 18], [92, 40]].map(([x, y]) => sparkle(x!, y!, 3))),
};
