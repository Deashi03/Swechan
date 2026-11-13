/**
 * Historia & humaniora → Religion & idéhistoria → Religiösa grundbegrepp, 2101–2107 (0.38): faith and
 * conviction, holy texts, rituals and ceremonies, prayer and meditation, temples and sanctuaries,
 * religious leaders, and festivals and traditions. The pictures are neutral, general and respectful:
 * no religion is ranked above another, and no holy person is drawn as a portrait or caricature. Shared
 * signs: the holy is a soft golden glow with short rays; the divine is a glow above a cloud (never a
 * face); a person praying kneels with joined hands; a meditating person sits cross-legged with closed
 * eyes; a priest wears a long black robe with a white collar; a monk wears a saffron robe; holy books
 * and scrolls have wavy lines, never real script. Several faiths appear side by side as simple signs
 * (cross, crescent, six-pointed star, eight-spoked wheel, lotus) – never a swastika or manji. The thing
 * the word names is ringed or outlined in orange; a grey copy stands beside it where a contrast helps.
 * Digits only; no words, no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { type Build } from './figures';
import { HL, cloud } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Colours ──────────────────────────────────────────────────────────
const GOLD = C.gold;
const GLOW = '#fff1b8';
const ROBE = '#2e2e36';
const SAFF = '#e08a2c';
const WHITE = '#f3efe6';
const STONE = '#d6cdbb';
const STONE2 = '#b3a891';
const WOOD = '#8a5a2e';
const RED = '#c8372d';
const TEAL = '#3f8f8a';
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
const collar = () => rect(-3.5, -43, 7, 4.5, C.white, 1, C.ink, 0.8);
/** A priest: long black robe with a white collar. */
const priest = (x: number, h = 1, mood: Mood = 'smile', extra: Svg = '') => all(fig(x, ROBE, mood, { h, bottom: ROBE }), on(x, h, collar(), extra));
const shave = () => path('M-10 -58 C-10 -68 10 -68 10 -58 C6 -62 -6 -62 -10 -58 Z', C.skin, C.ink, 1.6);
/** A monk in a saffron robe with a shaved head. */
const monk = (x: number, h = 1, mood: Mood = 'calm') => all(fig(x, SAFF, mood, { h, bottom: SAFF }), on(x, h, shave(), path('M-14 -42 L14 -20 L14 -14 L-14 -36 Z', '#c4701c', null)));
const robeW = (x: number, h = 1, mood: Mood = 'calm', more: Partial<Build> = {}) => fig(x, WHITE, mood, { h, bottom: WHITE, ...more });
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
/** The divine: a glow resting on a cloud. */
const divine = (x: number, y: number, s = 1) => at(x, y, s, glow(0, -8, 9), cloud(0, 6, 1.1, C.white));
const crossS = (x: number, y: number, s = 1, col: string = '#8a5a3a') => at(x, y, s, rect(-1.8, -9, 3.6, 18, col, 0.6, C.ink, 0.9), rect(-6.5, -4.5, 13, 3.6, col, 0.6, C.ink, 0.9));
const crescent = (x: number, y: number, s = 1, col: string = TEAL) => at(x, y, s, path('M2 -8 A8 8 0 1 0 2 8 A6.4 6.4 0 1 1 2 -8 Z', col, C.ink, 1), path('M5.5 -2 L6.5 0.4 L9 0.4 L7 2 L7.7 4.4 L5.5 3 L3.3 4.4 L4 2 L2 0.4 L4.5 0.4 Z', col, null));
const starS = (x: number, y: number, s = 1, col: string = '#3f6fb5') => at(x, y, s, path('M0 -9 L7.8 4.5 L-7.8 4.5 Z', 'none', col, 2), path('M0 9 L7.8 -4.5 L-7.8 -4.5 Z', 'none', col, 2));
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
/** Open book seen from above-front, centre (x, y). */
const book = (x: number, y: number, s = 1, cover: string = '#7a2f2a', o: { glow?: boolean } = {}) => at(x, y, s,
  o.glow ? all(ellipse(0, -4, 34, 22, GLOW, null), rays(0, -8, 26, 34, 10)) : '',
  path('M-26 -12 L0 -9 L26 -12 L26 8 L0 11 L-26 8 Z', cover, C.ink, 1.4),
  path('M-24 -14 C-14 -17 -6 -15 0 -11 L0 9 C-6 5 -14 4 -24 6 Z', PAGE, C.ink, 1.2), path('M24 -14 C14 -17 6 -15 0 -11 L0 9 C6 5 14 4 24 6 Z', PAGE, C.ink, 1.2),
  lines(-21, -9, 17, 4, 3.6), lines(4, -9, 17, 4, 3.6));
const scroll = (x: number, y: number, s = 1, col: string = PAGE, o: { old?: boolean } = {}) => at(x, y, s,
  rect(-18, -14, 36, 28, col, 1, C.ink, 1.3), lines(-14, -8, 28, 5, 4),
  ellipse(-18, 0, 3, 15, '#c9a46a', C.ink, 1.2), ellipse(18, 0, 3, 15, '#c9a46a', C.ink, 1.2),
  o.old ? all(line('M-6 -14 L-3 -6 L-7 2', '#8a6a3a', 1), line('M10 14 L7 6', '#8a6a3a', 1)) : '');
const lectern = (x: number, y: number, s = 1) => at(x, y, s, path('M-4 0 L4 0 L3 -30 L-3 -30 Z', WOOD, C.ink, 1.3), rect(-12, 0, 24, 3, WOOD, 1, C.ink, 1.2), path('M-16 -30 L16 -30 L12 -38 L-12 -38 Z', WOOD, C.ink, 1.3));
const fruit = (x: number, y: number) => all(circle(x - 5, y, 4, RED, C.ink, 1), circle(x + 3, y - 1, 4, C.orange, C.ink, 1), circle(x - 1, y - 6, 3.6, C.yellow, C.ink, 1), line(`M${x - 1} ${y - 9.6} l1 -2`, LEAF, 1.2));
const plateF = (x: number, y: number) => all(ellipse(x, y + 2, 12, 3.4, C.white, C.ink, 1.2), fruit(x, y - 2));
const flower = (x: number, y: number, s = 1, col: string = C.pink) => at(x, y, s, line('M0 0 L0 12', LEAF, 1.6), ...[0, 72, 144, 216, 288].map((d) => { const a = d * Math.PI / 180; return circle(f1(Math.cos(a) * 3.4), f1(Math.sin(a) * 3.4), 2.6, col, C.ink, 0.7); }), circle(0, 0, 2, C.yellow, null));
const vase = (x: number, y: number, s = 1) => at(x, y, s, path('M-4 0 L4 0 L5 -8 C5 -12 -5 -12 -5 -8 Z', '#7aa0c4', C.ink, 1), flower(-3, -22, 0.8), flower(3, -24, 0.8, C.yellow));
const coin = (x: number, y: number, r = 4) => all(circle(x, y, r, GOLD, C.ink, 1), circle(x, y, r * 0.55, 'none', '#b88a20', 0.8));
const altar = (x: number, y: number, s = 1, cloth: string = WHITE) => at(x, y, s, rect(-24, -22, 48, 22, STONE, 1, C.ink, 1.5), path('M-26 -24 L26 -24 L26 -14 L16 -10 L-16 -10 L-26 -14 Z', cloth, C.ink, 1.3), line('M-16 -10 L-16 -24 M16 -10 L16 -24', GOLD, 1.4));
const grave = (x: number, y: number, s = 1, col: string = '#b8b4ac') => at(x, y, s, path('M-10 0 L-10 -18 C-10 -28 10 -28 10 -18 L10 0 Z', col, C.ink, 1.4), line('M-5 -16 L5 -16 M-5 -11 L5 -11', '#8a8680', 1.1), rect(-14, -2, 28, 4, '#9a9590', 1, C.ink, 1));
const tree = (x: number, y: number, s = 1, col: string = LEAF) => at(x, y, s, rect(-2, -14, 4, 14, '#7a4a20', 1, C.ink, 1), circle(0, -22, 10, col, C.ink, 1.4));
const globe = (x: number, y: number, r: number) => all(circle(x, y, r, '#a8d4ef', C.ink, 1.6),
  path(`M${x - r * 0.7} ${y - r * 0.4} C${x - r * 0.3} ${y - r * 0.7} ${x} ${y - r * 0.3} ${x - r * 0.2} ${y} C${x - r * 0.4} ${y + r * 0.3} ${x - r * 0.6} ${y + r * 0.1} ${x - r * 0.7} ${y - r * 0.4} Z`, '#8cc47a', C.ink, 1),
  path(`M${x + r * 0.1} ${y - r * 0.6} C${x + r * 0.5} ${y - r * 0.8} ${x + r * 0.8} ${y - r * 0.3} ${x + r * 0.6} ${y + r * 0.1} C${x + r * 0.5} ${y + r * 0.6} ${x + r * 0.2} ${y + r * 0.7} ${x + r * 0.1} ${y + r * 0.3} C${x + r * 0.3} ${y} ${x} ${y - r * 0.3} ${x + r * 0.1} ${y - r * 0.6} Z`, '#8cc47a', C.ink, 1));
const beads = (cx: number, cy: number, rx: number, ry: number, n: number, col: string = '#8a4a2a', r = 2.4) => all(...Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return circle(f1(cx + Math.cos(a) * rx), f1(cy + Math.sin(a) * ry), r, col, C.ink, 0.8); }));
const moonPh = (x: number, y: number, r: number, k: number) => {
  // k: 0 new, 0.25 waxing crescent, 0.5 half, 0.75 gibbous, 1 full
  if (k <= 0.02) return circle(x, y, r, NIGHT, C.ink, 0.8);
  if (k >= 0.98) return circle(x, y, r, '#f3e6a1', C.ink, 0.8);
  const sweep = k > 0.5 ? 1 : 0, ex = f1(Math.abs(1 - 2 * k) * r);
  return all(circle(x, y, r, NIGHT, C.ink, 0.8), path(`M${x} ${y - r} A${r} ${r} 0 0 1 ${x} ${y + r} A${ex} ${r} 0 0 ${sweep} ${x} ${y - r} Z`, '#f3e6a1', null));
};

// ── Buildings ────────────────────────────────────────────────────────
const church = (x: number, y: number, s = 1, col: string = WHITE) => at(x, y, s,
  rect(-24, -26, 36, 26, col, 1, C.ink, 1.6), path('M-27 -26 L-6 -40 L15 -26 Z', '#8a5a3a', C.ink, 1.6),
  rect(12, -52, 14, 52, col, 1, C.ink, 1.6), path('M10 -52 L19 -70 L28 -52 Z', '#8a5a3a', C.ink, 1.6), line('M19 -70 L19 -79 M15 -75.5 L23 -75.5', C.ink, 1.8),
  path('M-10 0 L-10 -10 C-10 -16 -2 -16 -2 -10 L-2 0 Z', '#6b4a2e', C.ink, 1.2), path('M16 -40 C16 -45 22 -45 22 -40 L22 -34 L16 -34 Z', '#5a6a80', C.ink, 1));
const domeHouse = (x: number, y: number, s = 1, col: string = '#e9e1cf', dome: string = TEAL, tower = true) => at(x, y, s,
  rect(-22, -24, 44, 24, col, 1, C.ink, 1.6), path('M-16 -24 C-16 -46 16 -46 16 -24 Z', dome, C.ink, 1.6), line('M0 -42 L0 -48', C.ink, 1.6), circle(0, -50, 2, GOLD, C.ink, 0.8),
  tower ? all(rect(24, -54, 8, 54, col, 1, C.ink, 1.4), path('M23 -54 L28 -64 L33 -54 Z', dome, C.ink, 1.3)) : '',
  path('M-5 0 L-5 -12 C-5 -18 5 -18 5 -12 L5 0 Z', '#6b4a2e', C.ink, 1.2));
const torii = (x: number, y: number, s = 1) => at(x, y, s, lo('M-14 0 L-12 -30 M14 0 L12 -30', RED, 3.4), path('M-22 -34 C-10 -31 10 -31 22 -34 L21 -30 C10 -28 -10 -28 -21 -30 Z', RED, C.ink, 1.3), lo('M-16 -25 L16 -25', RED, 2.4));
const shrine = (x: number, y: number, s = 1) => at(x, y, s, rect(-14, -16, 28, 16, '#d9b07a', 0, C.ink, 1.4), path('M-22 -16 L0 -30 L22 -16 Z', '#5a6a5a', C.ink, 1.5), line('M-8 -32 L-4 -27 M8 -32 L4 -27', C.ink, 1.4), rect(-6, -10, 12, 10, '#7a4a20', 0.5, C.ink, 1), line('M-10 -14 L10 -14', C.white, 1.4));
const greekTemple = (x: number, y: number, s = 1, col: string = '#efe7d6') => at(x, y, s,
  path('M-28 -38 L0 -50 L28 -38 Z', col, C.ink, 1.5), rect(-28, -38, 56, 4, col, 0, C.ink, 1.3),
  ...[-22, -11, 0, 11, 22].map((d) => rect(d - 2.5, -34, 5, 30, col, 0, C.ink, 1.2)), rect(-30, -4, 60, 4, col, 0, C.ink, 1.3));
const plainHouse = (x: number, y: number, s = 1, col: string = '#e8d8b8') => at(x, y, s, rect(-14, -18, 28, 18, col, 0, C.ink, 1.3), path('M-17 -18 L0 -30 L17 -18 Z', '#a0673d', C.ink, 1.3), rect(-4, -10, 8, 10, '#6b4220', 0, null), rect(-11, -14, 5, 5, '#bfe3f5', 0.5, null), rect(6, -14, 5, 5, '#bfe3f5', 0.5, null));

export const RELIGION_BASICS_MOTIFS: Record<string, Svg> = {
  // ── Tro och övertygelse ──────────────────────────────────────────
  'relb.religion': all(ground, kneel(46, 0.9, C.green), divine(60, 26, 0.9),
    crossS(18, 30, 1.1), crescent(102, 30, 1.1), starS(16, 62, 1), wheel(104, 62, 1), lotus(98, 92, 0.9)),
  'relb.tro': all(ground, fig(46, C.sky, 'calm', { h: 0.9, hairStyle: 'long' }), reach(46, 0.9, -1, 45, 78, C.sky), on(46, 0.9, path('M-5.6 -55 Q-3.6 -58 -1.6 -55 M1.6 -55 Q3.6 -58 5.6 -55', 'none', C.ink, 1.2)),
    divine(92, 26, 0.85), line('M60 40 C70 36 76 34 82 32', GOLD, 1.4, '3 3'), at(46, 82, 1, path('M0 5 C-8 0 -7 -6 -3 -6 C-1 -6 0 -5 0 -4 C0 -5 1 -6 3 -6 C7 -6 8 0 0 5 Z', C.red, C.ink, 1)), sparkle(70, 52, 3), sparkle(80, 60, 2.4)),
  'relb.gudom': all(ground, glow(60, 34, 14), cloud(60, 54, 2, C.white), ...[0, 1, 2].map((i) => bow(20 + i * 34, 0.62, [C.green, C.orange, C.sky][i]!))),
  'relb.världsreligion': all(globe(60, 62, 34), at(42, 50, 0.8, crossS(0, 0)), at(76, 48, 0.8, crescent(0, 0)), at(52, 80, 0.8, wheel(0, 0)), at(78, 76, 0.8, starS(0, 0)),
    ...[[20, 24], [100, 24], [16, 100], [104, 100]].map(([x, y]) => all(bust(x!, y!, C.orange, 0.8))), arrow(32, 32, 40, 40, HL, 2), arrow(88, 32, 80, 40, HL, 2), arrow(28, 94, 36, 88, HL, 2), arrow(92, 94, 84, 88, HL, 2)),
  'relb.polyteism': all(ground, cloud(60, 50, 2.6, C.white), ...[[24, 36], [42, 26], [60, 34], [78, 26], [96, 36]].map(([x, y]) => glow(x!, y!, 5)),
    at(20, 36, 0.5, path('M-4 0 Q0 -4 4 0 Q8 4 12 0', 'none', '#3f6fb5', 2)), path('M42 22 L39 27 L43 27 L40 32', 'none', C.ink, 1.2), at(60, 34, 0.35, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', C.red, C.ink, 1)), path('M75 28 C76 22 80 22 81 28 Z', LEAF, C.ink, 0.8), circle(96, 36, 2.4, C.orange, null),
    kneel(48, 0.66, C.green), dashBox(10, 12, 100, 36)),
  'relb.monoteism': all(ground, glow(42, 30, 12), cloud(42, 46, 1.6, C.white), ring(42, 32, 24), kneel(32, 0.7, C.green),
    greyed(cloud(94, 40, 1.2, C.white), ...[[84, 30], [94, 24], [104, 30]].map(([x, y]) => circle(x!, y!, 4, '#ffe27a', C.ink, 1))), line('M80 18 L108 50', RED, 2.4)),
  'relb.själ': all(ground, rect(14, 96, 60, 10, '#c9ced4', 3, C.ink, 1.4), greyed(circle(24, 92, 6, C.skin, C.ink, 1.2), path('M30 92 L70 92 L70 98 L30 98 Z', C.sky, C.ink, 1.2)),
    `<g opacity="0.75">${path('M56 76 C56 64 70 64 70 76 L72 90 L54 90 Z', '#eef6fb', '#7fb2d6', 1.6)}${circle(63, 58, 7, '#eef6fb', '#7fb2d6', 1.6)}</g>`,
    path('M62 50 C60 40 66 34 64 26 M68 50 C70 40 76 36 74 28', 'none', '#7fb2d6', 1.4, ), arrow(84, 70, 84, 40, HL, 2.4), glow(90, 22, 7)),
  'relb.liv-efter-döden': all(ground, grave(26, 110, 1.3), flower(12, 100, 0.8), arrow(44, 78, 62, 54, HL, 3), cloud(86, 44, 1.7, C.white), glow(100, 18, 6),
    g('translate(0 -72)', fig(84, C.sky, 'smile', { h: 0.4 }))),
  'relb.bekänna-sig-till': all(ground, fig(44, C.green, 'smile'), reach(44, 1, 1, 52, 72, C.green), say(88, 34, 34, 28, 54, 40, all(crescent(80, 34, 0.8), starS(96, 34, 0.7))), ring(80, 34, 9),
    domeHouse(94, 112, 0.6)),
  'relb.konvertera': all(ground, greyed(church(24, 112, 0.7)), domeHouse(96, 112, 0.7), fig(60, C.orange, 'smile', { h: 0.8 }), arrow(40, 60, 82, 60, HL, 3)),
  'relb.from': all(ground, kneel(40, 1, '#6b5a8a', { pray: true, eyes: 'closed' }), beads(64, 70, 4, 7, 10, '#8a4a2a', 1.2), glow(46, 30, 4), greyed(fig(96, C.grey, 'smile', { h: 0.9 }))),
  // ── Heliga texter ────────────────────────────────────────────────
  'relb.helig-skrift': all(ground, lectern(60, 112, 1.2), book(60, 62, 1, '#7a2f2a', { glow: true })),
  'relb.profet': all(ground, path('M4 112 C24 84 52 80 70 112 Z', '#c9b98a', C.ink, 1.4), robeW(38, 0.75, 'calm', { hair: '#7a6a5a' }), on(38, 0.75, path('M-7.5 -53 C-7 -41 7 -41 7.5 -53 C4 -50 -4 -50 -7.5 -53 Z', '#bdb4a8', C.ink, 1)),
    reach(38, 0.75, -1, 22, 52, WHITE), reach(38, 0.75, 1, 54, 52, WHITE), divine(46, 20, 0.7), line('M42 30 L40 44 M48 30 L48 44 M54 30 L56 44', GOLD, 1.4),
    ...[0, 1, 2].map((i) => bust(80 + i * 13, 100 - (i % 2) * 4, [C.orange, C.green, C.sky][i]!, 0.9)), say(96, 72, 26, 14, 52, 66, lines(88, 70, 16, 2, 4))),
  'relb.uppenbarelse': all(ground, path('M8 112 L40 70 L70 112 Z', '#c9b98a', C.ink, 1.4), path('M30 10 L50 10 L54 84 L26 84 Z', GLOW, null), rays(40, 12, 8, 16, 10), circle(40, 12, 7, '#ffe27a', GOLD, 1.2),
    fig(40, WHITE, 'shock', { h: 0.5, bottom: WHITE }), sparkle(26, 60, 4), sparkle(56, 52, 4), sparkle(54, 74, 3), think(90, 52, 34, 26, 50, 74, scroll(90, 52, 0.6))),
  'relb.muntlig-tradition': all(ground, fig(18, '#8a7a6a', 'smile', { h: 0.9, hair: '#d0d0d0' }), fig(60, C.green, 'smile', { h: 0.72 }), fig(98, C.orange, 'smile', { h: 0.5 }),
    say(40, 30, 20, 14, 26, 44, lines(33, 28, 14, 2, 4)), say(80, 52, 20, 14, 66, 62, lines(73, 50, 14, 2, 4)), arrow(30, 16, 54, 16, HL, 2), arrow(70, 38, 92, 38, HL, 2)),
  'relb.skriva-ner': all(ground, fig(24, '#8a7a6a', 'smile', { h: 0.85, hair: '#d0d0d0' }), say(30, 22, 24, 14, 26, 38, lines(22, 20, 16, 2, 4)), arrow(44, 22, 62, 54, HL, 2.2),
    rect(52, 82, 60, 6, C.tan, 2, C.ink, 1.4), line('M60 88 L60 112 M104 88 L104 112', C.brown, 3), scroll(82, 70, 0.9), lines(70, 66, 12, 2, 4, C.ink),
    line('M98 50 L84 68', '#7a4a20', 2), path('M98 50 C106 40 112 42 104 54 Z', C.white, C.ink, 1), circle(88, 66, 3, C.skin, C.ink, 1)),
  'relb.vers': all(rect(26, 12, 68, 96, PAGE, 3, C.ink, 1.6), ...[0, 1, 2, 3, 4].map((i) => all(`<text x="34" y="${30 + i * 16}" font-family="system-ui,sans-serif" font-weight="800" font-size="9" text-anchor="middle" fill="${C.ink}">${i + 1}</text>`, lines(40, 26 + i * 16, 46, 2, 4))),
    dashBox(28, 48, 64, 14)),
  'relb.översättning': all(rect(8, 30, 40, 54, PAGE, 3, C.ink, 1.4), rect(72, 30, 40, 54, PAGE, 3, C.ink, 1.4),
    ...[0, 1, 2, 3, 4].map((i) => all(...[0, 1, 2, 3].map((j) => (i + j) % 2 ? circle(16 + j * 8, 40 + i * 9, 2, 'none', C.ink, 1.1) : path(`M${14 + j * 8} ${42 + i * 9} L${16 + j * 8} ${38 + i * 9} L${18 + j * 8} ${42 + i * 9}`, 'none', C.ink, 1.1)))),
    lines(78, 40, 28, 5, 9, C.ink), arrow(52, 57, 68, 57, HL, 3)),
  'relb.urtext': all(scroll(32, 52, 1.1, '#e8d6a8', { old: true }), ring(32, 52, 28), arrow(58, 46, 74, 30, HL, 2), arrow(60, 58, 76, 60, HL, 2), arrow(58, 70, 74, 88, HL, 2),
    greyed(book(96, 26, 0.5, '#3f6fb5'), book(98, 62, 0.5, LEAF), book(96, 96, 0.5, C.orange))),
  'relb.legend': all(rect(4, 4, 112, 108, NIGHT, 14, null), ground, at(36, 106, 1, path('M-10 0 L0 -12 L10 0 Z', '#8a5a2e', C.ink, 1), flame(0, -10, 1)), fig(18, '#8a7a6a', 'smile', { h: 0.62, hair: '#d0d0d0' }), fig(58, C.green, 'smile', { h: 0.45 }),
    think(84, 34, 52, 40, 30, 60, all(at(76, 48, 0.9, rect(-8, -18, 16, 18, '#c9c1b2', 0, C.ink, 1), ...[-8, -2, 4].map((d) => rect(d, -22, 4, 4, '#c9c1b2', 0, C.ink, 0.8))), at(96, 46, 0.9, circle(0, -12, 4, C.skin, C.ink, 1), path('M-4 -16 L-4 -21 L-1.5 -18 L0 -22 L1.5 -18 L4 -21 L4 -16 Z', GOLD, C.ink, 0.8), path('M-5 -8 L5 -8 L6 4 L-6 4 Z', RED, C.ink, 1)), sparkle(70, 24, 3, GOLD), sparkle(100, 24, 3, GOLD)))),
  'relb.bokstavligt': all(rect(6, 26, 46, 56, PAGE, 3, C.ink, 1.4), at(29, 58, 0.7, path('M-20 14 L0 -14 L20 14 Z', '#9a8f7a', C.ink, 1.4), path('M-6 -6 L0 -14 L6 -6 Z', C.white, null)), lines(12, 74, 34, 1),
    `<text x="62" y="62" font-family="system-ui,sans-serif" font-weight="800" font-size="18" text-anchor="middle" fill="${HL}">=</text>`,
    at(92, 82, 1.1, path('M-22 14 L0 -22 L22 14 Z', '#9a8f7a', C.ink, 1.6), path('M-8 -9 L0 -22 L8 -9 Z', C.white, null)), ring(92, 72, 26)),
  'relb.liknelse.2': all(ground, robeW(22, 0.85, 'smile'), reach(22, 0.85, 1, 34, 70, WHITE), ...[0, 1].map((i) => bust(100 + i * 0, 100 - i * 24, [C.orange, C.green][i]!, 0.9)), bust(86, 100, C.sky, 0.9),
    say(70, 36, 52, 38, 32, 48, all(path('M48 50 L94 50 L94 54 L48 54 Z', '#b08a5a', null), bust(56, 40, '#b98a52', 0.8), ...[0, 1, 2, 3].map((i) => circle(66 + i * 5, 34 + (i % 2) * 3, 1.3, '#7a4a20', null)), at(86, 38, 0.6, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', C.red, C.ink, 1))))),
  // ── Ritualer och ceremonier ──────────────────────────────────────
  'relb.ritual.2': all(ground, altar(76, 112, 0.9), candle(68, 90, 0.9), candle(84, 90, 0.9), kneel(36, 0.85, '#6b5a8a', { pray: true, eyes: 'closed' }), smokeC(76, 70, 0.6), sparkle(56, 42, 3), sparkle(96, 50, 3)),
  'relb.ceremoni': all(ground, at(60, 112, 1, path('M-26 0 L-26 -50 C-26 -76 26 -76 26 -50 L26 0', 'none', '#c9a46a', 4), flower(-26, -50, 1.2), flower(26, -50, 1.2, C.yellow), flower(0, -74, 1.2)),
    priest(60, 0.82), fig(42, C.white, 'smile', { h: 0.72, hairStyle: 'long', bottom: C.white }), fig(78, C.navy, 'smile', { h: 0.76 }), ...[0, 1, 2].map((i) => bust(12, 76 + i * 14, [C.orange, C.green, C.sky][i]!, 0.8)), ...[0, 1, 2].map((i) => bust(108, 76 + i * 14, [C.pink, C.yellow, C.mint][i]!, 0.8))),
  'relb.förrätta': all(ground, priest(60, 0.95, 'smile', all(rect(-10, -36, 20, 14, '#7a2f2a', 1, C.ink, 1), lines(-8, -32, 16, 2, 4))), reach(60, 0.95, -1, 52, 70, ROBE), reach(60, 0.95, 1, 68, 70, ROBE), ring(60, 50, 22),
    fig(22, C.white, 'smile', { h: 0.72, hairStyle: 'long', bottom: C.white }), fig(98, C.navy, 'smile', { h: 0.76 })),
  'relb.rituell': all(ground, robeW(40, 1, 'calm', { top: '#f6efe2' }), on(40, 1, path('M-14 -42 L-4 -42 L-4 2 L-14 2 Z', RED, C.ink, 1), path('M4 -42 L14 -42 L14 2 L4 2 Z', RED, C.ink, 1), ...[-34, -22, -10].map((y) => all(circle(-9, y, 2, GOLD, null), circle(9, y, 2, GOLD, null))), path('M-8 -64 L0 -76 L8 -64 Z', GOLD, C.ink, 1)), ring(40, 74, 30),
    greyed(fig(96, C.grey, 'smile', { h: 0.9 }))),
  'relb.symbolisk': all(candle(28, 76, 1.8), arrow(46, 58, 72, 58, HL, 3), glow(92, 58, 12), sparkle(78, 30, 4), sparkle(108, 86, 4), ground),
  'relb.altare': all(ground, rect(10, 10, 100, 70, '#efe6d2', 6, null), path('M30 80 L30 30 C30 14 90 14 90 30 L90 80', 'none', STONE2, 3), altar(60, 112, 1.5), dashBox(18, 72, 84, 38), candle(44, 72, 1), candle(76, 72, 1), vase(60, 76, 1)),
  'relb.offer': all(ground, at(60, 112, 1, rect(-26, -24, 52, 24, STONE2, 2, C.ink, 1.5), line('M-26 -12 L26 -12 M-10 -24 L-10 -12 M10 -12 L10 0', '#8a7f6a', 1.2)), plateF(48, 82), at(74, 86, 1, path('M-8 0 L-4 -10 L0 -2 L4 -12 L8 0 Z', '#e0c060', C.ink, 1)), smokeC(60, 72, 0.9), divine(60, 22, 0.8), ring(60, 82, 22)),
  'relb.rökelse': all(ground, at(60, 104, 1.4, path('M-14 0 C-14 8 14 8 14 0 Z', '#7a5a3a', C.ink, 1.3), ellipse(0, 0, 14, 3, '#d8c8a0', C.ink, 1.2)), line('M52 102 L48 60 M60 102 L60 56 M68 102 L72 60', '#8a4a2a', 2), circle(48, 60, 1.6, C.orange, null), circle(60, 56, 1.6, C.orange, null), circle(72, 60, 1.6, C.orange, null),
    smokeC(48, 56, 1.3), smokeC(60, 52, 1.5), smokeC(72, 56, 1.3)),
  'relb.rening': all(ground, at(40, 112, 1, rect(-26, -30, 52, 30, STONE, 3, C.ink, 1.5), ellipse(0, -30, 26, 5, '#8cc7e8', C.ink, 1.3)), line('M60 24 L44 46', WOOD, 2.4), path('M38 44 L50 44 L48 54 L40 54 Z', WOOD, C.ink, 1.2), line('M44 56 L44 66 M40 58 L40 66 M48 58 L48 64', '#5aa7d6', 1.6),
    fig(86, C.sky, 'smile', { h: 0.95 }), reach(86, 0.95, -1, 46, 70, C.sky), reach(86, 0.95, 1, 54, 74, C.sky), sparkle(30, 66, 3, '#5aa7d6')),
  'relb.välsigna': all(ground, priest(36, 1, 'calm'), reach(36, 1, 1, 70, 52, ROBE), path('M66 52 L70 44 L74 52 Z', C.skin, C.ink, 1), kneel(80, 0.8, C.sky, { flip: true, pray: true }), sparkle(76, 38, 4), sparkle(88, 34, 3), sparkle(68, 30, 3), ring(72, 48, 14)),
  'relb.välsignelse': all(ground, path('M30 20 L90 20 L100 96 L20 96 Z', GLOW, null), divine(60, 22, 0.8), ...[[40, 50], [60, 44], [80, 50], [48, 70], [72, 68]].map(([x, y]) => sparkle(x!, y!, 4)), fig(48, C.orange, 'smile', { h: 0.62, hairStyle: 'long' }), fig(72, C.green, 'smile', { h: 0.66 })),
  'relb.procession': all(ground, ...[0, 1, 2, 3, 4].map((i) => all(fig(14 + i * 23, i === 2 ? WHITE : [C.orange, C.sky, WHITE, C.green, C.pink][i]!, 'calm', { h: 0.6, bottom: i === 2 ? WHITE : undefined }), candle(f1(22 + i * 23), 82, 0.7))),
    lo('M50 74 L50 30', WOOD, 2), path('M50 30 L70 34 L50 40 Z', GOLD, C.ink, 1), arrow(84, 24, 112, 24, HL, 2.6)),
  'relb.övergångsrit': all(ground, fig(14, C.pink, 'smile', { h: 0.38 }), fig(40, C.sky, 'smile', { h: 0.62 }), fig(70, C.green, 'smile', { h: 0.92 }), fig(102, '#8a7a6a', 'smile', { h: 0.88, hair: '#d0d0d0' }),
    ...[27, 55, 86].map((x) => all(path(`M${x - 6} 112 L${x - 6} 40 C${x - 6} 30 ${x + 6} 30 ${x + 6} 40 L${x + 6} 112`, 'none', GOLD, 2.2), sparkle(x, 26, 3))), arrow(10, 16, 110, 16, HL, 2.4)),
  // ── Bön och meditation ───────────────────────────────────────────
  'relb.be': all(ground, kneel(52, 1.1, C.green, { pray: true, eyes: 'closed' }), divine(92, 24, 0.7), path('M74 44 C80 40 82 36 84 34', 'none', GOLD, 1.4, )),
  'relb.bön': all(ground, kneel(36, 0.95, C.green, { pray: true, eyes: 'closed' }), ...[0, 1, 2].map((i) => lines(58 + i * 6, 64 - i * 16, 24, 1, 4, '#b08a20')), path('M60 74 C70 60 76 46 86 30', 'none', GOLD, 1.2, ), divine(94, 20, 0.6), dashBox(54, 30, 40, 40)),
  'relb.tillbe': all(ground, glow(60, 26, 12), ...[0, 1, 2].map((i) => kneel(18 + i * 30, 0.62, [C.green, C.orange, C.sky][i]!, { pray: true, eyes: 'closed' })), ...[0, 1, 2].map((i) => line(`M${f1(30 + i * 30)} 66 L${f1(48 + i * 6)} 44`, GOLD, 1))),
  'relb.knäböja': all(ground, kneel(40, 1.05, C.orange, { pray: false }), ring(40, 98, 18), greyed(fig(96, C.grey, 'smile', { h: 0.9 }))),
  'relb.knäppa-händerna': all(at(42, 66, 1.05, lo('M-26 40 L-8 6', C.sky, 9), lo('M26 40 L8 6', C.sky, 9), path('M-8 8 C-10 -6 -6 -20 0 -24 C6 -20 10 -6 8 8 Z', C.skin, C.ink, 1.4), line('M0 -22 L0 6', C.ink, 1), line('M-6 -2 L6 -6 M-6 -8 L6 -12 M-6 4 L6 0', C.skin2, 1)), ring(42, 58, 20),
    greyed(at(96, 70, 0.9, path('M-16 0 C-18 -10 -14 -20 -8 -20 L-6 4 Z', C.skin, C.ink, 1.2), path('M16 0 C18 -10 14 -20 8 -20 L6 4 Z', C.skin, C.ink, 1.2)))),
  'relb.andakt': all(ground, rect(4, 4, 112, 108, '#efe6d2', 14, null), ground, candle(60, 70, 1.4), lectern(60, 112, 0.7), ...[0, 1, 2, 3].map((i) => bust(22 + i * 25 - (i > 1 ? 0 : 0), 96, [C.orange, C.green, C.sky, C.pink][i]!, 1)), sparkle(38, 44, 3), sparkle(84, 44, 3)),
  'relb.radband': all(at(60, 56, 1, beads(0, 0, 26, 20, 18, '#8a4a2a', 3.2), line('M0 20 L0 38', '#5a3a1a', 1.6), circle(0, 30, 3.4, '#8a4a2a', C.ink, 1), path('M-4 40 L4 40 L0 48 Z', '#5a3a1a', null)),
    at(60, 96, 1.2, path('M-16 0 C-16 -8 16 -8 16 0 L12 8 L-12 8 Z', C.skin, C.ink, 1.3)), ring(60, 56, 34)),
  'relb.mantra': all(ground, sitter(40, 110, 0.9, SAFF, { shaved: true }), ...[0, 1, 2].map((i) => say(90, 22 + i * 26, 26, 16, 52, 60, lines(80, 20 + i * 26, 20, 1, 4, C.ink))), path('M108 30 C116 46 116 66 108 76', 'none', HL, 2), path('M106 72 L108 78 L112 72', 'none', HL, 2)),
  'relb.meditation': all(ground, sitter(60, 110, 1.15, C.mint), ellipse(60, 66, 44, 52, 'none', '#b8dccb', 2), sparkle(20, 30, 3, '#7fb2a0'), sparkle(100, 30, 3, '#7fb2a0')),
  'relb.lotusställning': all(ground, sitter(60, 110, 1.3, '#7aa0c4', { feet: true }), ring(60, 100, 30), lotus(102, 30, 1.2)),
  'relb.inre-frid': all(greyed(cloud(20, 24, 1.2, C.grey), cloud(100, 26, 1.2, C.grey), path('M10 40 L16 48 L12 48 L18 58', 'none', C.ink, 1.6), path('M104 44 L110 52 L106 52 L112 62', 'none', C.ink, 1.6)),
    ellipse(60, 70, 34, 40, '#e6f3ee', '#9ccfb8', 2), sitter(60, 104, 0.95, C.mint), ground),
  // ── Tempel och helgedomar ────────────────────────────────────────
  'relb.helgedom': all(ground, tree(14, 112, 1.2), tree(106, 112, 1.2), torii(34, 112, 1.1), shrine(80, 112, 1.3), line('M44 112 L66 112', '#c9b98a', 4)),
  'relb.gudshus': all(ground, domeHouse(44, 112, 1.2), dashBox(14, 50, 64, 62), ...[0, 1].map((i) => fig(92 + i * 14, [C.orange, C.green][i]!, 'smile', { h: 0.5 })), arrow(86, 96, 62, 104, HL, 2)),
  'relb.kupol': all(ground, at(60, 112, 1.6, rect(-26, -20, 52, 20, '#e9e1cf', 1, C.ink, 1.3), path('M-20 -20 C-20 -50 20 -50 20 -20 Z', '#d8b04a', C.ink, 1.3), line('M0 -45 L0 -52', C.ink, 1.4), ...[-18, -6, 6, 18].map((d) => path(`M${d - 3} 0 L${d - 3} -10 C${d - 3} -14 ${d + 3} -14 ${d + 3} -10 L${d + 3} 0 Z`, '#6b4a2e', C.ink, 0.9))), ring(60, 64, 36)),
  'relb.gudabild': all(ground, at(60, 112, 1, rect(-22, -16, 44, 16, STONE2, 1, C.ink, 1.4)), glow(60, 54, 22),
    at(60, 96, 1, path('M-24 0 C-26 -10 -12 -14 0 -10 C12 -14 26 -10 24 0 Z', GOLD, C.ink, 1.4), path('M-13 -44 L13 -44 C15 -30 15 -18 13 -10 L-13 -10 C-15 -18 -15 -30 -13 -44 Z', GOLD, C.ink, 1.6), circle(0, -54, 10, GOLD, C.ink, 1.6), path('M-5 -54 Q-3 -52 -1 -54 M1 -54 Q3 -52 5 -54', 'none', C.ink, 1.1), path('M-6 -64 C-4 -70 4 -70 6 -64 Z', GOLD, C.ink, 1.2), lo('M-12 -42 L-18 -22 L-8 -12', GOLD, 4), lo('M12 -42 L18 -22 L8 -12', GOLD, 4)),
    plateF(24, 100), candle(100, 108, 0.8)),
  'relb.offergåva': all(ground, shrine(60, 76, 1.2), rect(20, 76, 80, 6, WOOD, 2, C.ink, 1.3), line('M28 82 L28 112 M92 82 L92 112', '#6b4220', 3), plateF(42, 104), vase(74, 110, 1.1), coin(58, 106, 4), ring(58, 102, 26)),
  'relb.relik': all(ground, glow(60, 60, 26), at(60, 98, 1.3, rect(-20, -26, 40, 26, GOLD, 2, C.ink, 1.5), path('M-22 -26 L0 -38 L22 -26 Z', GOLD, C.ink, 1.4), rect(-12, -20, 24, 14, '#d8eef8', 1, C.ink, 1), path('M-8 -13 C-6 -16 -3 -16 -2 -13 L4 -13 C5 -16 8 -16 9 -13 C8 -10 5 -10 4 -12 L-2 -12 C-3 -10 -6 -10 -8 -13 Z', WHITE, C.ink, 0.8), ...[-16, 16].map((d) => circle(d, -6, 2, RED, null))), ring(60, 76, 30)),
  'relb.vigd': all(ground, path('M8 112 L20 84 L100 84 L112 112 Z', '#b9cf8e', null), path('M8 112 L20 84 L100 84 L112 112', 'none', HL, 2.2, ), ...[[30, 98], [60, 92], [88, 100], [44, 106], [76, 106]].map(([x, y]) => sparkle(x!, y!, 3.4)), priest(60, 0.66), reach(60, 0.66, 1, 78, 64, ROBE), line('M80 66 L88 76 M84 64 L92 72', '#5aa7d6', 1.4), glow(60, 24, 6)),
  'relb.bönerum': all(rect(6, 8, 108, 104, '#eef0f2', 6, C.ink, 1.6), rect(74, 18, 32, 20, '#bfe3f5', 2, C.ink, 1.2), path('M80 30 L98 24 L100 26 L92 30 L96 34 L94 35 L88 32 L82 33 Z', C.white, C.ink, 0.9),
    rect(12, 98, 36, 10, '#3f8f6a', 2, C.ink, 1.2), rect(56, 98, 36, 10, '#b84a3a', 2, C.ink, 1.2), kneel(30, 0.7, C.sky, { pray: true }), sitter(76, 98, 0.55, C.orange), dashBox(9, 11, 102, 98)),
  'relb.vallfärdsort': all(path('M4 112 C20 100 40 104 60 92 C80 80 100 86 116 76 L116 112 Z', '#d9e6b8', null), glow(60, 34, 9), domeHouse(60, 64, 0.6, '#e9e1cf', GOLD, false), ring(60, 50, 22),
    ...[[10, 104], [22, 98], [34, 94], [110, 96], [98, 88], [86, 82]].map(([x, y]) => g(`translate(0 ${y! - 112})`, fig(x!, [C.orange, C.green, C.sky, C.pink, C.yellow, C.mint][(x! + y!) % 6]!, 'smile', { h: 0.24 }))),
    line('M16 104 C30 92 40 84 48 74', '#9a8f78', 1.4, '3 3'), line('M104 92 C92 84 82 76 72 72', '#9a8f78', 1.4, '3 3')),
  // ── Religiösa ledare ─────────────────────────────────────────────
  'relb.präst': all(ground, church(96, 112, 0.7), priest(46, 1.05, 'smile'), on(46, 1.05, ring(0, -41, 7))),
  'relb.prästinna': all(ground, greekTemple(78, 112, 1.1), fig(34, WHITE, 'calm', { hairStyle: 'long', bottom: WHITE, hair: '#4a3020' }), on(34, 1, path('M-11 -66 C-6 -70 6 -70 11 -66', 'none', GOLD, 2.4)), reach(34, 1, 1, 52, 66, WHITE),
    at(58, 70, 1, path('M-8 0 L8 0 L5 8 L-5 8 Z', '#c9a46a', C.ink, 1.2)), flame(58, 64, 1)),
  'relb.prästerskap': all(ground, ...[0, 1, 2, 3, 4].map((i) => priest(14 + i * 23, 0.62 + (i % 2) * 0.06)), dashBox(4, 40, 112, 72)),
  'relb.andlig-ledare': all(ground, rect(36, 74, 48, 8, WOOD, 2, C.ink, 1.3), g('translate(0 -36)', robeW(60, 0.66, 'smile', { hair: '#d0d0d0' })), glow(60, 22, 5),
    ...[0, 1, 2, 3, 4].map((i) => bust(14 + i * 23, 100, [C.orange, C.green, C.sky, C.pink, C.yellow][i]!, 1)), ...[0, 1, 2, 3, 4].map((i) => line(`M${14 + i * 23} 92 L${f1(14 + i * 23 + (60 - 14 - i * 23) * 0.15)} 86`, '#9a8f78', 1, '2 2'))),
  'relb.predikan': all(ground, at(36, 112, 1, rect(-14, -40, 28, 40, WOOD, 2, C.ink, 1.4), rect(-18, -44, 36, 6, WOOD, 2, C.ink, 1.4)), g('translate(0 -10)', priest(36, 0.72)), say(76, 26, 38, 22, 46, 42, lines(62, 22, 28, 3, 4)),
    ...[0, 1, 2].map((i) => bust(66 + i * 18, 100, [C.orange, C.green, C.sky][i]!, 1)), rect(56, 104, 62, 6, WOOD, 2, C.ink, 1.2)),
  'relb.församling': all(ground, church(96, 112, 0.8), ...[0, 1, 2, 3, 4, 5].map((i) => bust(14 + (i % 3) * 18, 82 + Math.floor(i / 3) * 18, [C.orange, C.green, C.sky, C.pink, C.yellow, C.mint][i]!, 1)), priest(70, 0.62), dashBox(4, 70, 74, 42)),
  'relb.grundare': all(ground, fig(28, WHITE, 'smile', { h: 0.85, bottom: WHITE, hair: '#7a6a5a' }), reach(28, 0.85, 1, 44, 100, WHITE), circle(46, 104, 3, '#7a4a20', C.ink, 1), ring(28, 68, 26),
    tree(86, 112, 2.2, LEAF), ...[[78, 56], [94, 52], [86, 40], [74, 44], [98, 64]].map(([x, y]) => bust(x!, y!, C.orange, 0.5))),
  'relb.lärjunge': all(ground, robeW(26, 0.9, 'smile', { hair: '#7a6a5a' }), ...[0, 1, 2].map((i) => fig(58 + i * 20, [C.green, C.orange, C.sky][i]!, 'smile', { h: 0.72 })), ring(58, 66, 14), say(58, 18, 26, 14, 30, 30, lines(50, 16, 16, 2, 4))),
  'relb.efterföljare': all(ground, greyed(robeW(14, 0.8)), ...[0, 1, 2, 3, 4].map((i) => fig(34 + i * 18, [C.green, C.orange, C.sky, C.pink, C.yellow][i]!, 'smile', { h: 0.6 })),
    ...[0, 1, 2, 3, 4].map((i) => scroll(f1(34 + i * 18), 76, 0.28)), arrow(30, 28, 112, 28, HL, 3)),
  'relb.vördnad': all(ground, monk(92, 0.9, 'calm'), on(92, 0.9, path('M-7.5 -53 C-7 -41 7 -41 7.5 -53 C4 -50 -4 -50 -7.5 -53 Z', '#e2e2e2', C.ink, 1)), bow(14, 0.62, C.green), bow(42, 0.62, C.orange), sparkle(66, 50, 3), sparkle(72, 34, 3)),
  'relb.kallelse.2': all(ground, line('M60 112 L48 70 M60 112 L84 70', '#c9b98a', 6), church(92, 70, 0.4), greyed(plainHouse(40, 70, 0.8)), fig(60, C.sky, 'smile', { h: 0.62 }), path('M74 16 L96 16 L92 56 L78 56 Z', GLOW, null), divine(86, 18, 0.6), arrow(70, 64, 86, 52, HL, 2.4)),
  // ── Högtider och traditioner ─────────────────────────────────────
  'relb.tradition': all(ground, fig(20, '#8a7a6a', 'smile', { h: 0.9, hair: '#d0d0d0', hairStyle: 'long' }), fig(60, C.green, 'smile', { h: 0.82, hairStyle: 'long' }), fig(98, C.orange, 'smile', { h: 0.56, hairStyle: 'long' }),
    ...[20, 60, 98].map((x, i) => candle(x + 12 * [0.9, 0.82, 0.56][i]!, 72 + i * 6, 0.7)), arrow(32, 22, 50, 22, HL, 2), arrow(72, 30, 90, 30, HL, 2)),
  'relb.månkalender': all(rect(10, 14, 100, 90, C.white, 4, C.ink, 1.6), rect(10, 14, 100, 14, '#7a6ab0', 4, C.ink, 1.6), ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => moonPh(24 + (i % 4) * 24, 42 + Math.floor(i / 4) * 22, 7, [0, 0.12, 0.25, 0.4, 0.5, 0.62, 0.75, 0.88, 1, 0.75, 0.5, 0.25][i]!)), ring(24, 42, 10)),
  'relb.högtidlighålla': all(ground, at(60, 112, 1, rect(-18, -40, 36, 40, STONE, 1, C.ink, 1.4), path('M-22 -40 L22 -40 L18 -46 L-18 -46 Z', STONE, C.ink, 1.3)), at(60, 82, 1, circle(0, 0, 11, 'none', LEAF, 5), ...[0, 60, 120, 180, 240, 300].map((d) => { const a = d * Math.PI / 180; return circle(f1(Math.cos(a) * 11), f1(Math.sin(a) * 11), 2, RED, null); })),
    candle(30, 112, 1.2), candle(90, 112, 1.2), priest(14, 0.62, 'calm'), fig(106, C.navy, 'calm', { h: 0.62 }), sparkle(60, 56, 3)),
  'relb.minnesdag': all(rect(4, 4, 112, 108, '#e3e6ee', 14, null), ground, grave(46, 112, 2), candle(24, 112, 1.1), candle(70, 112, 1.1), flower(84, 98, 1.2), flower(92, 100, 1.1, C.yellow)),
  'relb.fasta-verb': all(ground, `<circle cx="96" cy="22" r="9" fill="${C.yellow}" stroke="${C.ink}" stroke-width="1.4"/>`, rays(96, 22, 11, 16, 8), fig(36, C.sky, 'calm', { h: 0.95 }), reach(36, 0.95, 1, 60, 56, C.sky), at(64, 54, 1, ...[-4.6, -1.6, 1.4, 4.4].map((d) => rect(d - 1.3, -9, 2.6, 9, C.skin, 1.3, C.ink, 0.9))),
    rect(56, 84, 56, 6, C.tan, 2, C.ink, 1.4), line('M62 90 L62 112 M106 90 L106 112', C.brown, 3), plateF(84, 80), noSign(84, 72, 14)),
  'relb.festmåltid': all(ground, rect(8, 76, 104, 6, C.tan, 2, C.ink, 1.4), line('M16 82 L16 112 M104 82 L104 112', C.brown, 3), ...[0, 1, 2, 3].map((i) => bust(22 + i * 25, 58, [C.orange, C.green, C.sky, C.pink][i]!, 1.1)),
    ellipse(60, 72, 14, 4, C.white, C.ink, 1.2), path('M48 70 C48 60 72 60 72 70 Z', '#c98a3e', C.ink, 1.2), plateF(28, 72), plateF(92, 72), ...[40, 80].map((x) => candle(x, 74, 0.6)), sparkle(60, 46, 3)),
  'relb.skördefest': all(ground, ...[0, 1, 2].map((i) => at(16 + i * 10, 112, 1, line('M0 0 L0 -34', '#d8a92c', 2), ellipse(0, -38, 2.4, 6, '#d8a92c', C.ink, 0.8))),
    at(60, 108, 1.2, path('M-18 -10 L18 -10 L14 6 L-14 6 Z', '#c9a46a', C.ink, 1.3), fruit(-6, -12), fruit(8, -14)), fig(92, C.orange, 'laugh', { h: 0.82 }), reach(92, 0.82, -1, 76, 44, C.orange), reach(92, 0.82, 1, 108, 44, C.orange),
    ...[[20, 20], [44, 28], [106, 18]].map(([x, y]) => path(`M${x} ${y} C${x! + 4} ${y! - 4} ${x! + 8} ${y} ${x! + 4} ${y! + 4} C${x} ${y! + 6} ${x! - 2} ${y! + 2} ${x} ${y} Z`, C.orange, C.ink, 0.8))),
  'relb.ljusfest': all(rect(4, 4, 112, 108, NIGHT, 14, null), ground, ...[0, 1, 2, 3, 4, 5, 6].map((i) => all(circle(f1(16 + i * 15), f1(96 - (i % 2) * 6), 9, 'rgba(255,226,122,0.35)', null), candle(f1(16 + i * 15), f1(108 - (i % 2) * 6), 0.9))),
    ...[[20, 24], [56, 16], [96, 28]].map(([x, y]) => sparkle(x!, y!, 3, '#fff1b8'))),
};
