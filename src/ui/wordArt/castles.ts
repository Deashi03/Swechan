/**
 * Historia & humaniora → Krig och försvar → Medeltida slott & fästningar, 2011–2017 (0.37): the parts of a
 * castle, ring walls and towers, moats and drawbridges, the bailey and the keep, defending a fortress,
 * kinds of castles and life inside the walls. The pictures are built from a few recurring signs: grey-beige
 * stone blocks with merlons, square and round towers, dark arched openings, blue water, green hills and
 * small figures (soldiers with a silver helmet and a spear). The part that carries the word is drawn in a
 * warm orange fill or outlined with the accent colour while the rest stays stone-coloured or grey. Digits
 * only; no words in the pictures and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, star, type Svg } from './kit';
import { type Build } from './figures';
import { HL, arm, cloud, shield } from './people';
import { P as F, type Mood, greyed } from './blindFix';
import { checkIcon } from './labelIcons';

// ── Colours ──────────────────────────────────────────────────────────
const STONE = '#cfc6b4';
const STONE2 = '#a99f8e';
const OPEN = '#4a3a2e';
const WOOD = '#a8743f';
const WOOD2 = '#7a4a20';
const ROOF = '#b5523b';
const WATER = '#9fd0ea';
const WATER2 = '#4d8fc0';
const GRASS = '#9fcb84';
const GRASS2 = '#6f9a4f';
const EARTH = '#b08a5a';
const LIME = '#efe4c2';
const HLF = '#f6b48f';
const IRON = '#5b6068';
const GOLD = C.gold;
const RED = '#c8372d';
const ROYAL = '#7b3fa0';
const NIGHT = '#2f3a5a';
const GREEN_ARMS = '#4f7a3a';
const f1 = (n: number) => n.toFixed(1);

// ── Basics ───────────────────────────────────────────────────────────
const ground = line('M4 112 L116 112', C.grey2, 2);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const lo = (d: string, col: string, w: number) => line(d, C.ink, w + 2) + line(d, col, w);
const cross = (x: number, y: number, s = 1, col: string = RED) => line(`M${x - 6 * s} ${y - 6 * s} L${x + 6 * s} ${y + 6 * s} M${x + 6 * s} ${y - 6 * s} L${x - 6 * s} ${y + 6 * s}`, col, 2.6 * s);
const check = (x: number, y: number, s = 1) => checkIcon(x, y, s, C.green);
const noSign = (x: number, y: number, r = 8) => all(circle(x, y, r, 'none', RED, 2.6), line(`M${f1(x - r * 0.7)} ${f1(y - r * 0.7)} L${f1(x + r * 0.7)} ${f1(y + r * 0.7)}`, RED, 2.6));
const palm = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, ...[-4.6, -1.6, 1.4, 4.4].map((d, i) => rect(d - 1.3, -9 + Math.abs(i - 1.5) * 1.2, 2.6, 9, C.skin, 1.3, C.ink, 0.9)), path('M-5.5 -1 L5.5 -1 L5 5 C4 8 -4 8 -5 5 Z', C.skin, C.ink, 1));
const tree = (x: number, y: number, s = 1, col: string = '#5f9e58') => at(x, y, s, rect(-2, -14, 4, 14, WOOD2, 1, C.ink, 1), circle(0, -20, 10, col, C.ink, 1.4));
const moon = (x: number, y: number, r = 6) => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${f1(x + r * 0.9)} ${f1(y + r * 0.4)} A${f1(r * 0.8)} ${f1(r * 0.8)} 0 1 1 ${x} ${y - r} Z`, '#f3e6a1', C.ink, 1.1);
const flame = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -16 C8 -6 12 0 10 6 C8 13 -8 13 -10 6 C-12 0 -6 -4 -4 -10 C-2 -4 0 -4 0 -16 Z', C.orange, C.ink, 1.2), path('M0 -2 C4 2 4 8 0 9 C-4 8 -4 2 0 -2 Z', C.yellow, null));
const smoke = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 C-6 -6 6 -10 0 -16 C-6 -22 6 -26 0 -32', 'none', '#9aa3ad', 2.4));
const waves = (y: number, x1 = 4, x2 = 116, col: string = WATER2) => line(`M${x1} ${y} ${Array.from({ length: Math.floor((x2 - x1) / 12) }, () => 'q3 -3 6 0 q3 3 6 0').join(' ')}`, col, 1.4);
const water = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, WATER, 1, C.ink, 1.3), waves(y + h / 2, x + 3, x + w - 3));
const hill = (x1: number, x2: number, top: number, col: string = GRASS) => path(`M${x1} 112 C${x1 + (x2 - x1) * 0.25} ${top} ${x1 + (x2 - x1) * 0.75} ${top} ${x2} 112 Z`, col, C.ink, 1.5);

// ── Masonry and buildings ────────────────────────────────────────────
/** Merlons standing on the line y between x1 and x2. */
const merl = (x1: number, x2: number, y: number, col: string = STONE, w = 5, h = 5) => {
  const n = Math.max(1, Math.round((x2 - x1 + 3.5) / (w + 3.5)));
  const gap = n > 1 ? (x2 - x1 - n * w) / (n - 1) : 0;
  return all(...Array.from({ length: n }, (_, i) => rect(+f1(x1 + i * (w + gap)), y - h, w, h + 0.6, col, 0.4, C.ink, 1.1)));
};
/** Thin horizontal joints that read as stone courses. */
const courses = (x: number, y: number, w: number, h: number, step = 7) => all(...Array.from({ length: Math.max(0, Math.floor((h - 1) / step)) }, (_, i) => line(`M${x + 1.5} ${f1(y + (i + 1) * step)} L${x + w - 1.5} ${f1(y + (i + 1) * step)}`, STONE2, 0.7)));
/** A wall block with merlons on top. */
const block = (x: number, y: number, w: number, h: number, col: string = STONE, cren = true) => all(cren ? merl(x, x + w, y, col) : '', rect(x, y, w, h, col, 0.4, C.ink, 1.5), courses(x, y, w, h));
const archOpen = (cx: number, base: number, w: number, h: number, col: string = OPEN) => path(`M${cx - w / 2} ${base} L${cx - w / 2} ${base - h + w / 2} A${w / 2} ${w / 2} 0 0 1 ${cx + w / 2} ${base - h + w / 2} L${cx + w / 2} ${base} Z`, col, C.ink, 1.2);
const slit = (cx: number, cy: number, h = 8, w = 2.4) => rect(cx - w / 2, cy - h / 2, w, h, OPEN, 1, null);
const win = (cx: number, cy: number, w = 5, h = 8, col = '#5a6a80') => path(`M${cx - w / 2} ${cy + h / 2} L${cx - w / 2} ${cy - h / 2 + w / 2} A${w / 2} ${w / 2} 0 0 1 ${cx + w / 2} ${cy - h / 2 + w / 2} L${cx + w / 2} ${cy + h / 2} Z`, col, C.ink, 0.9);
/** A square tower standing on `base`, centred on cx; with merlons or a pointed roof. */
const tower = (cx: number, base: number, w: number, h: number, col: string = STONE, o: { cone?: string; slits?: number[] } = {}) => all(
  o.cone ? path(`M${cx - w / 2 - 2} ${base - h} L${cx} ${f1(base - h - w * 0.9)} L${cx + w / 2 + 2} ${base - h} Z`, o.cone, C.ink, 1.4) : merl(cx - w / 2, cx + w / 2, base - h, col, 4, 5),
  rect(cx - w / 2, base - h, w, h, col, 0.4, C.ink, 1.5), courses(cx - w / 2, base - h, w, h, 8), ...(o.slits ?? [0.35]).map((t) => slit(cx, base - h * (1 - t))));
/** A round tower (a cylinder seen from the front). */
const roundTower = (cx: number, base: number, w: number, h: number, col: string = STONE, cone?: string) => {
  const r = w / 2, ry = f1(w * 0.16);
  return all(
    cone ? path(`M${cx - r - 2} ${base - h} L${cx} ${f1(base - h - w)} L${cx + r + 2} ${base - h} Z`, cone, C.ink, 1.4) : merl(cx - r, cx + r, base - h, col, 4, 5),
    path(`M${cx - r} ${base} L${cx - r} ${base - h} A${r} ${ry} 0 0 0 ${cx + r} ${base - h} L${cx + r} ${base} A${r} ${ry} 0 0 1 ${cx - r} ${base} Z`, col, C.ink, 1.5),
    line(`M${f1(cx - r * 0.55)} ${base - h + 3} L${f1(cx - r * 0.55)} ${base - 1}`, STONE2, 1), line(`M${f1(cx + r * 0.6)} ${base - h + 3} L${f1(cx + r * 0.6)} ${base - 1}`, STONE2, 1.6),
    line(`M${f1(cx + r * 0.82)} ${base - h + 3} L${f1(cx + r * 0.82)} ${base - 1}`, STONE2, 1.6), slit(cx, base - h * 0.62));
};
type CP = { wall?: string; tl?: string | null; tr?: string | null; keep?: string | null; gate?: string; round?: boolean };
/** A small castle: curtain wall with a gate, two corner towers and a keep behind (local base 0). */
const castleL = (o: CP = {}) => all(
  o.keep === null ? '' : tower(0, -20, 22, 50, o.keep ?? STONE, { slits: [0.25] }),
  block(-30, -32, 60, 32, o.wall ?? STONE), archOpen(0, 0, 13, 21, o.gate ?? OPEN),
  o.tl === null ? '' : o.round ? roundTower(-36, 0, 16, 52, o.tl ?? STONE) : tower(-36, 0, 15, 52, o.tl ?? STONE),
  o.tr === null ? '' : o.round ? roundTower(36, 0, 16, 52, o.tr ?? STONE) : tower(36, 0, 15, 52, o.tr ?? STONE));
const castle = (x: number, base: number, s = 1, o: CP = {}) => at(x, base, s, castleL(o));
/** A simple house with a pitched roof (local base 0). */
const house = (x: number, base: number, s = 1, wall: string = LIME, roof: string = ROOF) => at(x, base, s, path('M-13 -18 L0 -30 L13 -18 Z', roof, C.ink, 1.3), rect(-11, -18, 22, 18, wall, 0.5, C.ink, 1.3), rect(-3, -9, 6, 9, WOOD2, 0.5, null), rect(-8.5, -14, 4, 4, '#5a6a80', 0.5, null));
const church = (x: number, base: number, s = 1, col: string = LIME) => at(x, base, s, rect(-14, -20, 22, 20, col, 0.5, C.ink, 1.3), path('M-16 -20 L-3 -30 L10 -20 Z', ROOF, C.ink, 1.3), rect(8, -40, 10, 40, col, 0.5, C.ink, 1.3), path('M6 -40 L13 -56 L20 -40 Z', ROOF, C.ink, 1.3), line('M13 -56 L13 -63 M10 -60 L16 -60', C.ink, 1.4));

// ── Figures ──────────────────────────────────────────────────────────
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, 3 * Math.max(0.5, h), C.skin, C.ink, 1.1)); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
/** Like `on`, but for a figure whose feet stand on another line than the ground. */
const lift = (dy: number, ...k: Svg[]) => g(`translate(0 ${dy})`, ...k);
const helmetL = (col: string = C.silver) => all(path('M-11 -55 C-11 -71 11 -71 11 -55 Z', col, C.ink, 1.3), line('M0 -68 L0 -55', '#8d949c', 1.2));
const furHatL = () => all(path('M-9 -61 C-9 -73 9 -73 9 -61 Z', RED, C.ink, 1.1), rect(-10.5, -64, 21, 5, '#6b4a2e', 2.5, C.ink, 1));
const chainL = () => all(path('M-11 -40 C-7 -27 7 -27 11 -40', 'none', GOLD, 2.6), circle(0, -28.5, 3, GOLD, C.ink, 0.9));
/** A soldier: helmet, a tunic and (optionally) a spear held at the side. */
const soldier = (x: number, h = 1, o: { spear?: -1 | 1; top?: string; mood?: Mood; grey?: boolean } = {}) => {
  const q = geo(x, h), side = o.spear ?? 0;
  const sx = x + side * 21 * q.s, hy = q.sy + 30 * q.s;
  const k = all(side ? lo(`M${f1(sx)} 112 L${f1(sx)} ${f1(q.ty - 74 * q.s)}`, WOOD, Math.max(1.4, 2.4 * h)) : '', side ? path(`M${f1(sx - 3 * q.s)} ${f1(q.ty - 74 * q.s)} L${f1(sx)} ${f1(q.ty - 86 * q.s)} L${f1(sx + 3 * q.s)} ${f1(q.ty - 74 * q.s)} Z`, C.silver, C.ink, 1) : '',
    fig(x, o.top ?? '#5a6a80', o.mood ?? 'calm', { h, bottom: C.dark }), on(x, h, helmetL()), side ? circle(+f1(sx), hy, 3 * Math.max(0.5, h), C.skin, C.ink, 1) : '');
  return o.grey ? greyed(k) : k;
};
const arrowShaft = (x1: number, y1: number, x2: number, y2: number, col: string = WOOD2) => { const a = Math.atan2(y2 - y1, x2 - x1), c = Math.cos(a), s = Math.sin(a); return all(line(`M${x1} ${y1} L${x2} ${y2}`, col, 1.6), path(`M${f1(x2 + c * 4)} ${f1(y2 + s * 4)} L${f1(x2 - s * 2.4)} ${f1(y2 + c * 2.4)} L${f1(x2 + s * 2.4)} ${f1(y2 - c * 2.4)} Z`, C.silver, C.ink, 0.8), line(`M${f1(x1)} ${f1(y1)} l${f1(-c * 3 - s * 2.5)} ${f1(-s * 3 + c * 2.5)} M${f1(x1)} ${f1(y1)} l${f1(-c * 3 + s * 2.5)} ${f1(-s * 3 - c * 2.5)}`, RED, 1.2)); };
const horseL = (col: string = '#9a6438') => all(
  lo('M-14 -22 L-15 -1 M-7 -22 L-7 -1 M9 -22 L9 -1 M15 -22 L17 -1', col, 3.6),
  ellipse(0, -30, 20, 10, col, C.ink, 1.6), path('M14 -36 L22 -52 C24 -56 30 -56 32 -52 L34 -46 C34 -43 31 -42 29 -44 L24 -42 L20 -28 Z', col, C.ink, 1.6),
  circle(27, -50, 1.1, C.ink, null), path('M18 -46 L21 -56 L26 -54', 'none', '#4a2e1a', 2.4), path('M-19 -32 C-27 -30 -28 -18 -25 -12', 'none', '#4a2e1a', 3));
/** A rider in armour on a horse, facing right (local: ground 0). */
const knightRider = (cloth: string, lance = false) => all(horseL(), path('M-16 -38 C-10 -30 10 -30 16 -38 L14 -24 L-14 -24 Z', cloth, C.ink, 1.2),
  lo('M-1 -40 L4 -24', C.silver, 4), path('M-7 -40 L5 -40 L4 -60 L-6 -60 Z', C.silver, C.ink, 1.4), circle(-1, -66, 6.5, C.silver, C.ink, 1.4), rect(-1, -68, 7, 2, OPEN, 0.5, null),
  path('M-1 -73 C3 -80 9 -78 8 -72', 'none', cloth, 2.4),
  lance ? all(lo('M0 -50 L62 -58', LIME, 2.8), path('M0 -46 L-6 -52 L-4 -56 L3 -54 Z', IRON, C.ink, 1)) : '', g('translate(-8 -48) scale(0.55)', shield(0, 0, 1, cloth)));

// ── Interior pieces ──────────────────────────────────────────────────
const table = (y = 84, x1 = 10, x2 = 110) => all(rect(x1, y, x2 - x1, 6, '#b98a52', 2, C.ink, 1.6), line(`M${x1 + 8} ${y + 6} L${x1 + 8} 112 M${x2 - 8} ${y + 6} L${x2 - 8} 112`, WOOD2, 3));
const bust = (x: number, y: number, top: string, hat: Svg = '', s = 1, grey = false) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-8 12 C-8 4 8 4 8 12 Z', grey ? C.grey : top, C.ink, 1.2), circle(0, 0, 5.4, grey ? C.grey2 : C.skin, C.ink, 1.2),
  path('M-5.4 -1 C-5.4 -8 5.4 -8 5.4 -1 C3 -4 -3 -4 -5.4 -1 Z', grey ? C.grey : C.hair, null), circle(-2, 0, 0.8, C.ink, null), circle(2, 0, 0.8, C.ink, null), hat);
const bFur = all(path('M-5 -4 C-5 -10 5 -10 5 -4 Z', RED, C.ink, 0.9), rect(-6, -6, 12, 3, '#6b4a2e', 1.5, C.ink, 0.8));
const mug = (x: number, y: number, s = 1) => at(x, y, s, path('M-6 -10 L6 -10 L5 6 L-5 6 Z', WOOD, C.ink, 1.3), path('M6 -6 C11 -6 11 2 5 2', 'none', C.ink, 1.4), path('M-6 -10 C-6 -14 6 -14 6 -10', '#fbf6e6', C.ink, 0.9));
const sack = (x: number, y: number, s = 1, col = '#d9c08a') => at(x, y, s, path('M-8 10 C-11 0 -9 -6 -4 -8 L-5 -12 L5 -12 L4 -8 C9 -6 11 0 8 10 Z', col, C.ink, 1.3), line('M-5 -8.5 L5 -8.5', '#8a6a3a', 1.4));
const bread = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 0, 9, 5, '#d79a52', C.ink, 1.2), line('M-4 -3 L-2 1 M0 -4 L2 0 M4 -3 L6 1', '#9a6428', 1));
const ham = (x: number, y: number, s = 1) => at(x, y, s, line('M0 -12 L0 -6', C.ink, 1), path('M-5 -6 C-8 2 -6 12 0 12 C6 12 8 2 5 -6 Z', '#c97a5a', C.ink, 1.1), circle(0, 7, 2.4, '#f3ead7', C.ink, 0.6));
const fishDry = (x: number, y: number, s = 1) => at(x, y, s, line('M0 -12 L0 -8', C.ink, 1), path('M0 -8 C4 -4 4 6 0 10 C-4 6 -4 -4 0 -8 Z', '#c9b48a', C.ink, 1), path('M0 10 L-3 14 L3 14 Z', '#c9b48a', C.ink, 0.8));
const shovel = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, lo('M0 -26 L0 4', WOOD, 2), path('M-5 4 L5 4 L4 14 C2 17 -2 17 -4 14 Z', IRON, C.ink, 1));
const torchL = () => all(lo('M0 0 L0 22', WOOD2, 2.4), path('M-3.4 -2 L3.4 -2 L2.6 4 L-2.6 4 Z', '#6b4a2e', C.ink, 0.9), flame(0, -6, 0.75));
const coatOfArms = (x: number, y: number, s = 1, col: string = RED) => all(g(`translate(${x} ${y}) scale(${s})`, shield(0, 0, 1, col)), line(`M${x} ${y - 12 * s} L${x} ${y + 12 * s} M${x - 10 * s} ${y - 2 * s} L${x + 10 * s} ${y - 2 * s}`, GOLD, 1.6 * s));

/** Cross-section of a castle wall (outside on the left): `walk` and `parapet` take fill colours. */
const wallSection = (walk: string, parapet: string) => all(
  rect(0, 0, 120, 120, '#eef4f8', 18, null),
  path('M34 112 L34 64 L86 64 L86 112 Z', STONE, C.ink, 1.6), courses(34, 64, 52, 48, 9),
  rect(34, 56, 52, 9, walk, 0.5, C.ink, 1.6),
  lift(-56, soldier(46, 0.42, { spear: 1 })),
  path('M24 65 L34 65 L34 36 L24 36 Z', parapet, C.ink, 1.6), rect(23, 31, 12, 6, parapet, 0.5, C.ink, 1.2),
  line('M4 112 L34 112 M86 112 L116 112', C.grey2, 2));

// ── Motifs ───────────────────────────────────────────────────────────
export const CASTLE_MOTIFS: Record<string, Svg> = {
  // ── 2011 Slottets byggnadsdelar ──
  'slott.byggnadsdel': all(castle(46, 112, 1, { tr: null, wall: C.grey2, tl: C.grey2, keep: C.grey2 }), line('M82 112 L82 60', C.grey2, 1.4, '3 3'),
    tower(100, 96, 15, 52, HLF), arrow(84, 52, 96, 40, HL, 2.2), line('M88 98 L112 98', C.grey2, 2), ground),
  'slott.huvudbyggnad': all(
    greyed(at(60, 112, 1, rect(-52, -30, 32, 30, LIME, 0.4, C.ink, 1.4), path('M-54 -30 L-50 -40 L-20 -40 L-20 -30 Z', ROOF, C.ink, 1.3), rect(20, -30, 32, 30, LIME, 0.4, C.ink, 1.4), path('M54 -30 L50 -40 L20 -40 L20 -30 Z', ROOF, C.ink, 1.3),
      ...[-44, -32, 28, 40].map((d) => win(d, -16, 5, 8)))),
    at(60, 112, 1, rect(-20, -62, 40, 62, HLF, 0.4, C.ink, 1.8), path('M-23 -62 L0 -80 L23 -62 Z', ROOF, C.ink, 1.6), ...[-10, 0, 10].flatMap((d) => [win(d, -48, 5, 9), win(d, -30, 5, 9)]), archOpen(0, 0, 9, 14, WOOD2)), ground),
  'slott.flygel': all(
    greyed(at(60, 112, 1, rect(-20, -62, 40, 62, LIME, 0.4, C.ink, 1.6), path('M-23 -62 L0 -80 L23 -62 Z', ROOF, C.ink, 1.4), ...[-10, 0, 10].flatMap((d) => [win(d, -48, 5, 9), win(d, -30, 5, 9)]), archOpen(0, 0, 9, 14, WOOD2),
      rect(-52, -30, 32, 30, LIME, 0.4, C.ink, 1.4), path('M-54 -30 L-50 -40 L-20 -40 L-20 -30 Z', ROOF, C.ink, 1.3), ...[-44, -32].map((d) => win(d, -16, 5, 8)))),
    at(60, 112, 1, rect(20, -30, 34, 30, HLF, 0.4, C.ink, 1.8), path('M56 -30 L52 -40 L20 -40 L20 -30 Z', ROOF, C.ink, 1.5), ...[29, 43].map((d) => win(d, -16, 5, 8))), arrow(94, 64, 110, 64, HL, 2.2), ground),
  'slott.sal': all(rect(4, 8, 112, 104, '#efe6d2', 2, C.ink, 1.4), ...[22, 60, 98].map((x) => win(x, 36, 12, 34, '#bcd7ea')), line('M4 70 L116 70', '#d8ccb2', 1),
    ...[14, 26, 38, 50, 62, 74, 86, 98, 108].map((x, i) => fig(x, [C.denim, '#c96b3c', C.green, '#b07aa1', RED, '#b98a52', C.navy, '#c96b3c', C.green][i]!, 'smile', { h: 0.36 + (i % 3) * 0.03, hairStyle: i % 2 ? 'long' : 'short' })), ground),
  'slott.riddarsal': all(rect(4, 8, 112, 104, '#e9dcc0', 2, C.ink, 1.4), ...[20, 46, 74, 100].map((x, i) => coatOfArms(x, 26, 0.75, [RED, C.navy, GREEN_ARMS, ROYAL][i]!)),
    ...[33, 87].map((x) => all(line(`M${x} 14 L${x} 50`, C.ink, 1), path(`M${x} 14 L${x + 9} 14 L${x + 9} 40 L${x + 4.5} 35 L${x} 40 Z`, x < 60 ? RED : C.navy, C.ink, 1))),
    table(92, 14, 106), ...[30, 52, 70, 90].map((x) => mug(x, 88, 0.55)), fig(60, C.silver, 'calm', { h: 0.62, bottom: C.silver }), on(60, 0.62, helmetL()), ground),
  'slott.kapell': all(greyed(block(4, 64, 40, 48), tower(10, 112, 14, 70)), at(80, 112, 1, rect(-24, -36, 40, 36, LIME, 0.5, C.ink, 1.6), path('M-28 -36 L-4 -54 L20 -36 Z', ROOF, C.ink, 1.6),
    rect(12, -66, 14, 66, LIME, 0.5, C.ink, 1.6), path('M10 -66 L19 -86 L28 -66 Z', ROOF, C.ink, 1.6), line('M19 -86 L19 -96 M14.5 -91.5 L23.5 -91.5', GOLD, 2.4),
    archOpen(-4, 0, 10, 18, WOOD2), win(-15, -20, 5, 10, '#bcd7ea'), win(7, -20, 5, 10, '#bcd7ea'), circle(19, -52, 3.4, '#e0b23c', C.ink, 1)), ground),
  'slott.valv': all(rect(4, 8, 112, 104, '#f2ece0', 0, null), path('M4 8 L116 8 L116 30 C100 30 76 34 60 60 C44 34 20 30 4 30 Z', STONE, C.ink, 1.4),
    rect(6, 60, 14, 52, STONE, 0.5, C.ink, 1.5), rect(100, 60, 14, 52, STONE, 0.5, C.ink, 1.5), rect(53, 60, 14, 52, STONE, 0.5, C.ink, 1.5),
    path('M20 60 C20 36 53 36 53 60', 'none', HL, 3.2), path('M67 60 C67 36 100 36 100 60', 'none', HL, 3.2), path('M13 60 C13 22 60 8 60 8 C60 8 107 22 107 60', 'none', STONE2, 1.4),
    fig(36, C.denim, 'smile', { h: 0.42 }), ground),
  'slott.vindeltrappa': all(roundTower(60, 112, 70, 92, '#e4dccb'), rect(56, 26, 8, 86, STONE2, 0.5, C.ink, 1.2),
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const y = 104 - i * 10.5, left = i % 2 === 0; return path(left ? `M56 ${y} L30 ${y + 4} L30 ${y - 2} L56 ${y - 6} Z` : `M64 ${y} L90 ${y + 4} L90 ${y - 2} L64 ${y - 6} Z`, HLF, C.ink, 1.1); }),
    line('M36 98 C20 80 100 66 84 46 C70 30 40 30 50 18', HL, 1.8, '3 3'), lift(-24, fig(80, C.denim, 'smile', { h: 0.3 })), ground),
  'slott.bjälke': all(greyed(...[0, 1, 2].map((i) => all(rect(70, 100 - i * 7, 44, 6, WOOD, 1, C.ink, 1), circle(70, 103 - i * 7, 3, '#d8a868', C.ink, 0.8)))),
    fig(22, C.denim, 'smile', { h: 0.62 }), fig(70, '#c96b3c', 'smile', { h: 0.62 }), rect(6, 64, 96, 10, '#c48a4c', 1, C.ink, 1.6), line('M10 69 L98 69', '#8a5a2e', 0.9), circle(102, 69, 4.4, '#e0b77a', C.ink, 1.1), circle(102, 69, 2, 'none', '#8a5a2e', 0.8),
    reach(22, 0.62, 1, 30, 74), reach(70, 0.62, -1, 64, 74), ground),
  'slott.murverk': all(rect(6, 10, 108, 102, '#e2d8c4', 1, C.ink, 1.6),
    ...[0, 1, 2, 3, 4, 5, 6].flatMap((r) => [0, 1, 2, 3, 4].map((c) => rect(8 + c * 21 + (r % 2 ? 10 : 0) - (r % 2 && c === 4 ? 10 : 0), 12 + r * 14, r % 2 && c === 4 ? 10 : 19, 12, [STONE, '#d9cfbb', '#c4baa6'][(r + c) % 3]!, 1.2, C.ink, 1)))),
  'slott.gråsten': all(rect(4, 40, 112, 50, '#e6e2da', 1, C.ink, 1.4), ...[[16, 52, 10, 9], [38, 50, 12, 8], [62, 53, 11, 10], [86, 50, 13, 9], [106, 54, 8, 9], [24, 72, 13, 10], [50, 74, 12, 9], [74, 72, 11, 11], [98, 75, 13, 10], [12, 82, 7, 6], [62, 84, 8, 5]].map(([x, y, rx, ry]) => ellipse(x!, y!, rx!, ry!, ['#9aa0a6', '#8b9097', '#a9aeb3'][(x! + y!) % 3]!, C.ink, 1.3)),
    rect(4, 96, 112, 16, GRASS, 1, C.ink, 1.2), ellipse(26, 102, 11, 7, '#8b9097', C.ink, 1.3), ellipse(96, 104, 8, 5, '#9aa0a6', C.ink, 1.2), ground),
  'slott.kalksten': all(rect(4, 30, 112, 82, '#f6f0de', 1, null), ...[0, 1, 2].flatMap((r) => [0, 1, 2, 3].map((c) => rect(6 + c * 27 + (r % 2 ? 13 : 0) - (r % 2 && c === 3 ? 13 : 0), 34 + r * 16, r % 2 && c === 3 ? 12 : 25, 14, '#ece2c2', 0.6, C.ink, 1.1))),
    rect(34, 84, 36, 22, '#efe6c8', 0.6, C.ink, 1.4), path('M46 92 C50 88 56 90 54 96 C52 100 46 98 48 94', 'none', '#b9a77a', 1.2), lo('M76 76 L66 90', IRON, 2), lo('M84 68 L76 76', WOOD, 3), line('M66 92 l-3 3 M70 94 l-1 4', '#d8cfb0', 1.2), ground),
  'slott.bygga-om': all(greyed(tower(22, 112, 22, 60, STONE)), arrow(40, 70, 58, 70, HL, 2.6),
    at(90, 112, 1, rect(-26, -40, 52, 40, LIME, 0.5, C.ink, 1.5), path('M-29 -40 L0 -58 L29 -40 Z', ROOF, C.ink, 1.5), ...[-16, -4, 8, 20].map((d) => win(d - 2, -24, 6, 10, '#7aa0c4')), archOpen(0, 0, 8, 12, WOOD2)),
    lo('M62 112 L62 52 M118 112 L118 52', WOOD, 1.4), lo('M62 80 L118 80 M62 60 L118 60', WOOD, 1.4), ground),
  // ── 2012 Ringmurar och torn ──
  'slott.stadsmur': all(...[[20, 70, ROOF], [36, 66, '#9a5a3a'], [76, 68, ROOF], [94, 70, '#9a5a3a']].map(([x, b, r]) => house(x as number, b as number, 0.9, LIME, r as string)), church(58, 66, 0.9),
    block(4, 70, 112, 42, HLF), tower(14, 112, 14, 50, HLF), tower(106, 112, 14, 50, HLF), archOpen(60, 112, 14, 22), ground),
  'slott.uppföra': all(block(10, 72, 40, 40, STONE, false), rect(50, 86, 22, 26, STONE, 0.4, C.ink, 1.5), rect(72, 98, 18, 14, STONE, 0.4, C.ink, 1.5), courses(50, 86, 22, 26), lo('M8 112 L8 52 M52 112 L52 52 M8 66 L52 66', WOOD, 1.6),
    lift(-46, fig(28, '#b98a52', 'smile', { h: 0.36 })), lift(-46, reach(28, 0.36, 1, 40, 98)), rect(37, 51, 9, 6, STONE, 0.5, C.ink, 1),
    fig(98, '#c96b3c', 'smile', { h: 0.5 }), reach(98, 0.5, -1, 86, 74), rect(78, 68, 10, 7, STONE, 0.5, C.ink, 1), arrow(76, 50, 60, 50, HL, 2.2), ground),
  'slott.omge': all(greyed(house(60, 76, 1.3)), ellipse(60, 70, 48, 30, 'none', HL, 4), ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = (i / 8) * Math.PI * 2; return rect(+f1(60 + Math.cos(a) * 48 - 3), +f1(70 + Math.sin(a) * 30 - 3), 6, 6, HLF, 0.5, C.ink, 1); }),
    path('M104 46 C110 54 110 62 108 70', 'none', HL, 2), path('M103 74 L108 72 L111 66', 'none', HL, 2), path('M16 94 C10 86 10 78 12 70', 'none', HL, 2), path('M17 66 L12 68 L9 74', 'none', HL, 2), ground),
  'slott.hörntorn': all(path('M12 96 L82 96 L108 76 L38 76 Z', '#e9e2d2', C.ink, 1.2), block(20, 56, 54, 26, C.grey2), block(42, 72, 72, 24, C.grey2),
    tower(30, 84, 13, 40, HLF), tower(98, 72, 11, 36, HLF), tower(16, 104, 15, 46, HLF), tower(88, 104, 15, 46, HLF), ground),
  'slott.rundtorn': all(greyed(tower(30, 112, 26, 70, STONE)), roundTower(84, 112, 30, 76, HLF, ROOF), ground),
  'slott.vakttorn': all(hill(4, 116, 90, GRASS), at(56, 100, 1, rect(-8, -58, 16, 58, STONE, 0.4, C.ink, 1.5), courses(-8, -58, 16, 58, 8), rect(-12, -64, 24, 6, STONE, 0.4, C.ink, 1.3), merl(-12, 12, -64, STONE, 4, 5)),
    lift(-70, fig(56, '#5a6a80', 'calm', { h: 0.3 })), on(56, 0.3, lift(-70 / 0.252, helmetL())), lift(-70, palm(62, 64, 0.5)), line('M66 22 L112 34', HL, 1.4, '3 3'), line('M66 26 L112 52', HL, 1.4, '3 3'),
    greyed(at(108, 48, 0.4, horseL())), ground),
  'slott.murkrön': all(rect(0, 0, 120, 120, '#eef4f8', 18, null), block(4, 38, 112, 74, STONE, false), rect(4, 28, 112, 12, HLF, 0.4, C.ink, 1.6), merl(4, 116, 28, HLF, 7, 8), ground),
  'slott.skyttegång': wallSection(HLF, STONE),
  'slott.bröstvärn': wallSection(STONE, HLF),
  'slott.tinne': all(rect(0, 0, 120, 120, '#eef4f8', 18, null), rect(4, 60, 112, 52, STONE, 0.4, C.ink, 1.5), courses(4, 60, 112, 52, 9),
    ...[6, 32, 58, 84].map((x) => rect(x, 36, 18, 25, x === 58 ? HLF : STONE, 0.4, C.ink, x === 58 ? 2 : 1.4)), rect(54, 32, 26, 33, 'none', 2, HL, 2.2), rect(110, 36, 6, 25, STONE, 0.4, C.ink, 1.4), ground),
  'slott.skottglugg': all(rect(4, 6, 112, 106, STONE, 1, C.ink, 1.6), courses(4, 6, 112, 106, 12), path('M54 20 L66 20 L64 92 L56 92 Z', '#f0e8d6', C.ink, 1.2), rect(57.5, 24, 5, 64, OPEN, 1, C.ink, 1.2),
    arrowShaft(62, 50, 100, 46), line('M104 42 l6 -2 M104 50 l6 2', HL, 1.4), ground),
  // ── 2013 Vallgravar och vindbryggor ──
  'slott.dike': all(rect(4, 60, 112, 52, GRASS, 1, null), path('M4 70 L40 70 L52 92 L68 92 L80 70 L116 70 L116 112 L4 112 Z', GRASS, C.ink, 1.4), path('M47 82 L73 82 L68 92 L52 92 Z', WATER, C.ink, 1), rect(84, 64, 32, 8, '#d9cfbb', 1, C.ink, 1.2), ...[12, 24, 96, 108].map((x) => line(`M${x} 70 l-2 -5 M${x + 2} 70 l2 -5`, GRASS2, 1.2)), tree(22, 70, 0.8), ground),
  'slott.vall': all(path('M4 112 C14 72 30 62 60 62 C90 62 106 72 116 112 Z', GRASS, HL, 2.6), path('M20 98 C30 80 44 74 60 74', 'none', GRASS2, 1.2), path('M100 98 C90 80 76 74 60 74', 'none', GRASS2, 1.2), ...[24, 40, 60, 80, 96].map((x) => line(`M${x} ${x === 60 ? 62 : x < 50 || x > 70 ? 74 : 64} l-2 -4 M${x + 2} ${x === 60 ? 62 : x < 50 || x > 70 ? 74 : 64} l2 -4`, GRASS2, 1.1)), lift(-52, soldier(60, 0.34, { spear: 1 })), ground),
  'slott.jordvall': all(path('M4 112 C16 80 34 72 62 72 C84 72 96 84 104 112 Z', EARTH, C.ink, 1.6), ...[[30, 96], [48, 86], [70, 90], [86, 100]].map(([x, y]) => ellipse(x!, y!, 3, 2, '#8a6a3a', null)),
    fig(104, '#b98a52', 'smile', { h: 0.62 }), reach(104, 0.62, -1, 90, 78), shovel(84, 74, 0.8, -50), path('M70 62 l4 -2 M66 66 l-3 -2 M74 66 l3 1', 'none', EARTH, 2), ground),
  'slott.vattenfylld': all(rect(4, 74, 112, 38, GRASS, 1, null), greyed(path('M8 76 L14 104 L46 104 L52 76 Z', '#d8c8a8', C.ink, 1.4)), cross(30, 60, 1),
    path('M66 76 L72 104 L104 104 L110 76 Z', WATER, C.ink, 1.6), waves(84, 68, 108), waves(94, 72, 104), check(88, 60, 1.6), line('M4 76 L116 76', C.ink, 1.2), ground),
  'slott.porttorn': all(greyed(block(4, 64, 38, 48), block(78, 64, 38, 48)), at(60, 112, 1, tower(0, 0, 38, 82, HLF, { slits: [0.2] }), archOpen(0, 0, 18, 34), win(0, -52, 6, 9, OPEN)), ground),
  'slott.fällgaller': all(rect(4, 8, 112, 104, STONE, 1, C.ink, 1.6), courses(4, 8, 112, 104, 12), archOpen(60, 112, 56, 86, '#3a332c'),
    g('', ...[38, 47, 56, 65, 74, 83].map((x) => line(`M${x} 28 L${x} 82`, IRON, 3)), ...[34, 46, 58, 70].map((y) => line(`M34 ${y} L86 ${y}`, IRON, 3)), ...[38, 47, 56, 65, 74, 83].map((x) => path(`M${x - 2.5} 82 L${x} 89 L${x + 2.5} 82 Z`, IRON, C.ink, 0.8))),
    arrow(100, 56, 100, 82, HL, 2.6), ground),
  'slott.vinsch': all(rect(18, 64, 6, 48, WOOD, 0.5, C.ink, 1.3), rect(62, 64, 6, 48, WOOD, 0.5, C.ink, 1.3), ellipse(43, 76, 20, 9, '#b98a52', C.ink, 1.6), ...[30, 38, 46, 54].map((x) => line(`M${x} 68 L${x} 84`, '#8a5a2e', 1)),
    lo('M68 76 L78 76 L78 90', IRON, 2.4), circle(78, 92, 2.6, WOOD2, C.ink, 1), ...[0, 1, 2, 3, 4, 5, 6].map((i) => ellipse(43, 66 - i * 7, 2, 3.6, 'none', IRON, 1.8)), circle(43, 14, 6, WOOD, C.ink, 1.3),
    fig(100, '#b98a52', 'smile', { h: 0.62 }), reach(100, 0.62, -1, 80, 92), path('M84 84 C90 84 92 92 86 96', 'none', HL, 2), path('M84 96 L86 96 L86 92', 'none', HL, 2), ground),
  'slott.fälla-ner': all(rect(4, 8, 30, 104, STONE, 0.4, C.ink, 1.5), courses(4, 8, 30, 104, 10), archOpen(19, 100, 18, 40), water(34, 100, 82, 12),
    g('rotate(-34 34 100)', rect(34, 93, 66, 7, WOOD, 1, C.ink, 1.5), ...[44, 54, 64, 74, 84].map((x) => line(`M${x} 93 L${x} 100`, WOOD2, 1))),
    line('M28 30 L88 62', IRON, 1.6), path('M94 40 C106 50 110 64 108 80', 'none', HL, 2.6), path('M102 76 L108 82 L112 74', 'none', HL, 2.6), ground),
  'slott.spärra.2': all(rect(4, 92, 112, 20, '#d9cfbb', 1, null), line('M4 92 L116 92', C.grey2, 1.2), lo('M44 112 L44 76 M76 112 L76 76', WOOD, 3), lo('M40 78 L80 98 M40 98 L80 78', RED, 3.4), lo('M38 84 L82 84', '#f3ead7', 3),
    soldier(92, 0.62, { spear: 1 }), greyed(fig(18, '#b98a52', 'frown', { h: 0.6 })), noSign(18, 30, 9), ground),
  'slott.tillträde.2': all(block(36, 30, 48, 82, STONE), archOpen(60, 112, 26, 50, '#f3e6c4'), fig(60, C.denim, 'smile', { h: 0.48 }), check(60, 22, 1.6),
    greyed(fig(16, '#b98a52', 'frown', { h: 0.55 })), cross(16, 34, 1), greyed(fig(104, '#c96b3c', 'frown', { h: 0.55, hairStyle: 'long' })), cross(104, 34, 1), ground),
  'slott.barbakan': all(greyed(block(4, 34, 112, 46, STONE), tower(60, 80, 30, 62, STONE, { slits: [0.25] })),
    block(30, 70, 60, 42, HLF), tower(30, 112, 12, 46, HLF), tower(90, 112, 12, 46, HLF), archOpen(60, 112, 14, 22), ground),
  // ── 2014 Borggård och kärntorn ──
  'slott.borggård': all(path('M60 14 L104 32 L110 78 L60 104 L12 80 L16 32 Z', STONE, C.ink, 2), path('M60 24 L96 38 L100 74 L60 94 L22 76 L25 38 Z', '#efe1b8', HL, 2.4),
    ...[[60, 14], [104, 32], [110, 78], [60, 104], [12, 80], [16, 32]].map(([x, y]) => circle(x!, y!, 7, STONE, C.ink, 1.6)), circle(60, 58, 6, '#7aa0c4', C.ink, 1.6), circle(60, 58, 3, OPEN, null),
    rect(30, 42, 14, 10, ROOF, 1, C.ink, 1.1), rect(78, 70, 14, 10, ROOF, 1, C.ink, 1.1), fig(44, C.denim, 'smile', { h: 0.2 }), fig(80, '#c96b3c', 'smile', { h: 0.2 })),
  'slott.kärntorn': all(greyed(block(4, 72, 112, 40, STONE), tower(10, 112, 14, 56), tower(110, 112, 14, 56)), at(60, 112, 1, tower(0, 0, 40, 98, HLF, { slits: [0.2, 0.45] }), archOpen(0, 0, 11, 16)), ground),
  'slott.bostadstorn': all(rect(30, 18, 60, 94, STONE, 0.4, C.ink, 1.8), merl(30, 90, 18, STONE, 6, 6), line('M30 50 L90 50 M30 80 L90 80', C.ink, 1.4),
    rect(36, 36, 30, 8, '#f3ead7', 2, C.ink, 1.1), rect(36, 30, 8, 7, C.white, 2, C.ink, 1), rect(46, 35, 20, 4, '#c97a5a', 1, null),
    table(70, 38, 70), mug(48, 66, 0.45), bust(78, 62, '#c96b3c', '', 0.8), path('M38 108 L38 92 L54 92 L54 108', 'none', C.ink, 1.4), flame(46, 106, 0.55), win(80, 96, 7, 12, '#7aa0c4'), smoke(84, 12, 0.6), ground),
  'slott.cistern': all(rect(4, 70, 112, 42, '#c9b48a', 0, null), line('M4 70 L116 70', C.ink, 1.4), cloud(24, 16, 1.1, C.grey2), line('M16 26 l-2 6 M24 28 l-2 6 M32 26 l-2 6', '#5aa7d6', 1.6),
    at(84, 70, 1, rect(-24, -36, 48, 36, LIME, 0.5, C.ink, 1.4), path('M-28 -36 L0 -52 L28 -36 Z', ROOF, C.ink, 1.4)), lo('M54 34 L54 82', IRON, 2), path('M30 80 L82 80 L82 108 L30 108 Z', STONE, C.ink, 1.8), rect(33, 88, 46, 18, WATER, 1, null), waves(94, 35, 77), line('M54 84 l0 4', '#5aa7d6', 1.6)),
  'slott.visthus': all(at(60, 112, 1, ...[-22, 22].map((d) => rect(d - 3, -20, 6, 20, WOOD2, 1, C.ink, 1.2)), rect(-28, -24, 56, 4, WOOD, 1, C.ink, 1.2), rect(-26, -62, 52, 38, WOOD, 0.5, C.ink, 1.6),
    ...[-56, -48, -40, -32].map((y) => line(`M-26 ${y} L26 ${y}`, WOOD2, 0.9)), path('M-32 -62 L0 -82 L32 -62 Z', '#6f6a5a', C.ink, 1.6), rect(-12, -56, 24, 30, '#3d2e22', 0.5, C.ink, 1.2),
    ham(-5, -42, 0.7), fishDry(5, -42, 0.7), sack(0, -32, 0.45)), ground),
  'slott.bod': all(at(60, 112, 1, rect(-26, -40, 52, 40, '#b98a52', 0.5, C.ink, 1.6), ...[-16, -6, 4, 14].map((x) => line(`M${x} -40 L${x} 0`, WOOD2, 0.9)), path('M-30 -40 L-26 -52 L26 -52 L30 -40 Z', '#6f6a5a', C.ink, 1.6),
    rect(-10, -28, 20, 28, '#3d2e22', 0.5, C.ink, 1.2)), shovel(56, 104, 0.6, 0), lo('M64 80 L64 112', WOOD, 1.6), path('M58 80 L70 80', 'none', IRON, 2), lo('M98 70 L104 112', WOOD, 1.6), ground),
  'slott.stall': all(at(60, 112, 1, rect(-40, -44, 80, 44, '#b5523b', 0.5, C.ink, 1.6), path('M-44 -44 L0 -66 L44 -44 Z', '#6f6a5a', C.ink, 1.6), rect(-16, -36, 32, 36, '#3d2e22', 0.5, C.ink, 1.3), line('M-16 -18 L16 -18', '#f3ead7', 2.4),
    g('translate(-2 -14) scale(0.8)', path('M14 -36 L22 -52 C24 -56 30 -56 32 -52 L34 -46 C34 -43 31 -42 29 -44 L24 -42 L20 -28 Z', '#9a6438', C.ink, 1.6), circle(27, -50, 1.1, C.ink, null), path('M18 -46 L21 -56 L26 -54', 'none', '#4a2e1a', 2.4)), path('M-34 -28 L-22 -28 L-24 -22 L-32 -22 Z', '#e8c870', C.ink, 1)),
    path('M84 112 C84 100 102 100 104 112 Z', '#e8c870', C.ink, 1.2), ground),
  'slott.bakugn': all(path('M14 112 L14 82 C14 46 106 46 106 82 L106 112 Z', '#c9a27a', C.ink, 1.8), path('M14 82 C14 46 106 46 106 82', 'none', '#a77a4f', 1), archOpen(60, 112, 34, 30, '#2e2420'), flame(52, 106, 0.6), flame(66, 107, 0.5),
    bread(34, 72, 0.9), bread(86, 72, 0.9), lo('M66 96 L114 84', WOOD, 2), ellipse(70, 95, 7, 3, WOOD, C.ink, 1), bread(70, 92, 0.6), ground),
  'slott.gårdsplan': all(path('M4 80 L116 80 L116 112 L4 112 Z', '#e8d9b0', null), rect(30, 82, 60, 28, '#efe1b8', 1, HL, 2.4),
    at(16, 82, 1, rect(-14, -26, 30, 26, '#b5523b', 0.5, C.ink, 1.4), path('M-17 -26 L1 -40 L19 -26 Z', '#6f6a5a', C.ink, 1.4)), at(104, 82, 1, rect(-16, -26, 30, 26, LIME, 0.5, C.ink, 1.4), path('M-19 -26 L-1 -40 L17 -26 Z', ROOF, C.ink, 1.4)),
    at(60, 80, 1, rect(-22, -24, 44, 24, '#b98a52', 0.5, C.ink, 1.4), path('M-25 -24 L0 -36 L25 -24 Z', '#6f6a5a', C.ink, 1.4)),
    ...[[44, 98], [56, 104], [76, 96]].map(([x, y]) => at(x!, y!, 0.7, ellipse(0, 0, 5, 4, C.white, C.ink, 1), circle(4, -4, 2.4, C.white, C.ink, 1), path('M6 -4 L8 -3 L6 -2 Z', C.orange, null))), fig(68, '#c96b3c', 'smile', { h: 0.3, hairStyle: 'long' })),
  // ── 2015 Fästningens försvar ──
  'slott.garnison': all(greyed(block(4, 50, 18, 62), block(98, 50, 18, 62), tower(12, 112, 16, 72), tower(108, 112, 16, 72)), rect(22, 98, 76, 14, '#e8d9b0', 0, null),
    ...[32, 46, 60, 74, 88].map((x, i) => soldier(x, 0.5, { spear: i % 2 ? -1 : 1 })), ground),
  'slott.vakt': all(greyed(block(4, 20, 56, 92, STONE)), archOpen(32, 112, 22, 40, OPEN), soldier(80, 0.9, { spear: 1 }), ground),
  'slott.vaktpost': all(greyed(block(4, 30, 30, 82, STONE), tower(80, 112, 20, 84)), at(54, 112, 1, rect(-14, -50, 28, 50, '#7a8a5a', 0.5, C.ink, 1.6), path('M-17 -50 L0 -64 L17 -50 Z', RED, C.ink, 1.5), rect(-11, -46, 22, 46, '#3d3a32', 0.5, null)),
    soldier(54, 0.5, { spear: 1 }), ground),
  'slott.vakthållning': all(rect(0, 0, 120, 120, NIGHT, 18, null), moon(100, 18, 8), ...[[20, 14], [44, 22], [76, 10]].map(([x, y]) => star(x!, y!, 2.4, '#f3e6a1')),
    block(4, 74, 112, 38, '#8a8676'), lift(-38, soldier(34, 0.5, { spear: -1 })), lift(-38, g('translate(46 52)', torchL())), lift(-38, soldier(84, 0.5, { spear: 1, grey: true })),
    path('M50 30 C58 22 66 22 72 30', 'none', '#f3e6a1', 1.8), path('M68 26 L72 30 L74 24', 'none', '#f3e6a1', 1.8), path('M72 40 C64 48 56 48 50 40', 'none', '#f3e6a1', 1.8), path('M54 44 L50 40 L48 46', 'none', '#f3e6a1', 1.8)),
  'slott.utkik': all(rect(0, 0, 120, 120, '#eaf3f8', 18, null), at(26, 112, 1, rect(-14, -50, 28, 50, STONE, 0.4, C.ink, 1.6), courses(-14, -50, 28, 50, 9), merl(-14, 14, -50, STONE, 5, 6)),
    lift(-50, fig(28, '#5a6a80', 'calm', { h: 0.36 }), on(28, 0.36, helmetL()), reach(28, 0.36, 1, 33, 84), palm(35, 81, 0.45, 90)),
    line('M40 32 L112 62', HL, 1.4, '3 3'), line('M40 34 L112 92', HL, 1.4, '3 3'), water(56, 92, 60, 20), at(92, 92, 0.42, path('M-34 -16 C-30 2 30 2 34 -16 Z', '#8a5a2e', C.ink, 1.6), line('M0 -16 L0 -62', '#5e3a1a', 2.6), path('M-16 -58 C-12 -46 -12 -32 -16 -22 L16 -22 C12 -32 12 -46 16 -58 Z', LIME, C.ink, 1.4)), ground),
  'slott.armborst': all(g('rotate(-12 60 60)', lo('M16 60 L96 60', WOOD, 6), path('M80 30 C90 40 90 80 80 90', 'none', IRON, 4.4), line('M80 30 L66 60 L80 90', C.ink, 1.2), arrowShaft(66, 56, 104, 56), rect(30, 62, 6, 12, WOOD2, 1, C.ink, 1), path('M16 54 L22 54 L22 66 L16 66 Z', WOOD2, C.ink, 1)), ground),
  'slott.försvarsverk': all(water(4, 100, 112, 12), castle(60, 100, 1.05, { wall: HLF, tl: HLF, tr: HLF, keep: STONE }), path('M8 30 C4 60 6 90 10 98 M112 30 C116 60 114 90 110 98', 'none', HL, 2.4), shield(14, 20, 0.8, C.navy)),
  'slott.hålla-stånd': all(block(4, 84, 112, 28, STONE), lift(-28, soldier(36, 0.62, {})), g('translate(56 60)', shield(0, 0, 1.15, C.navy)),
    ...[[100, 36, 70, 50], [108, 56, 72, 60], [100, 76, 70, 70]].map(([x1, y1, x2, y2]) => greyed(arrowShaft(x1!, y1!, x2!, y2!))), line('M72 44 l4 -4 M74 58 l5 -1 M72 72 l4 3', HL, 1.4),
    line('M24 78 L24 84 M48 78 L48 84', HL, 2.4), ground),
  'slott.slå-tillbaka': all(block(4, 56, 42, 56, STONE), lift(-56, soldier(26, 0.45, {}), reach(26, 0.45, 1, 50, 92)),
    g('rotate(26 52 112)', lo('M52 112 L52 30 M60 112 L60 30', WOOD, 2), ...[100, 88, 76, 64, 52, 40].map((y) => lo(`M52 ${y} L60 ${y}`, WOOD, 1.4))),
    greyed(fig(94, '#8a6a4a', 'shock', { h: 0.5 }), fig(110, '#8a6a4a', 'shock', { h: 0.46 })), arrow(72, 60, 112, 60, HL, 2.6), ground),
  // ── 2016 Kastell och borgtyper ──
  'slott.kastell': all(rect(0, 70, 120, 42, WATER, 0, null), waves(84, 4, 116), waves(100, 4, 116), path('M30 92 C30 80 70 78 74 92 Z', '#9a958a', C.ink, 1.4),
    at(52, 84, 0.75, roundTower(0, 0, 40, 34, HLF), roundTower(0, -34, 18, 18, HLF, ROOF)), greyed(at(100, 96, 0.45, path('M-34 -16 C-30 2 30 2 34 -16 Z', '#8a5a2e', C.ink, 1.6), line('M0 -16 L0 -62', '#5e3a1a', 2.6), path('M-16 -58 C-12 -46 -12 -32 -16 -22 L16 -22 C12 -32 12 -46 16 -58 Z', LIME, C.ink, 1.4))),
    path('M4 70 L16 70 C18 60 26 58 28 70', C.grey2, C.ink, 1), house(10, 72, 0.5)),
  'slott.citadell': all(...[[12, 112], [26, 108], [94, 108], [108, 112], [18, 92], [102, 92]].map(([x, b]) => greyed(house(x!, b!, 0.7))), greyed(block(4, 96, 112, 16, C.grey2, false)),
    at(60, 112, 1, path('M-30 0 L-36 -30 L-18 -40 L0 -34 L18 -40 L36 -30 L30 0 Z', HLF, C.ink, 1.8), tower(0, -30, 18, 30, HLF, { slits: [0.4] }), archOpen(0, 0, 9, 14)), ground),
  'slott.fornborg': all(hill(4, 116, 40, GRASS), path('M24 74 C30 50 90 50 96 74', 'none', '#8b9097', 7), ...[[28, 66], [38, 56], [50, 52], [62, 51], [74, 53], [86, 58], [94, 68]].map(([x, y]) => ellipse(x!, y!, 4.4, 3.4, '#9aa0a6', C.ink, 1)),
    ...[[48, 64], [70, 62]].map(([x, y]) => at(x!, y!, 0.45, ellipse(0, -2, 10, 6.5, C.white, C.ink, 1.3), ellipse(10, -5, 3.5, 3, C.dark, C.ink, 1))), tree(10, 108, 0.6), tree(112, 108, 0.6), ground),
  'slott.ringborg': all(rect(4, 4, 112, 108, GRASS, 2, null), circle(60, 58, 50, '#cdb98a', C.ink, 1.8), circle(60, 58, 40, '#b8d7a0', C.ink, 1.6), line('M10 58 L110 58 M60 8 L60 108', '#d9cfbb', 4),
    ...[[42, 40], [78, 40], [42, 76], [78, 76]].flatMap(([cx, cy]) => [rect(cx! - 12, cy! - 10, 24, 6, WOOD, 3, C.ink, 1), rect(cx! - 12, cy! + 4, 24, 6, WOOD, 3, C.ink, 1), rect(cx! - 14, cy! - 3, 6, 6, WOOD, 2, C.ink, 0.8), rect(cx! + 8, cy! - 3, 6, 6, WOOD, 2, C.ink, 0.8)])),
  'slott.borgkulle': all(water(4, 104, 112, 8), path('M14 104 C28 60 92 60 106 104 Z', '#9fb070', C.ink, 1.8), ...[30, 38, 46, 54, 62, 70, 78, 86].map((x) => path(`M${x} 70 L${x} 58 L${x + 2.5} 54 L${x + 5} 58 L${x + 5} 70 Z`, WOOD, C.ink, 1)),
    at(60, 68, 1, rect(-10, -36, 20, 36, WOOD, 0.5, C.ink, 1.5), ...[-28, -18, -8].map((y) => line(`M-10 ${y} L10 ${y}`, WOOD2, 0.9)), path('M-13 -36 L0 -48 L13 -36 Z', '#6f6a5a', C.ink, 1.4), rect(-3, -26, 6, 8, OPEN, 0.5, null)), ground),
  'slott.höjdborg': all(rect(0, 0, 120, 120, '#eaf3f8', 18, null), path('M4 112 L34 50 L46 32 L66 26 L80 36 L92 60 L116 112 Z', '#9a958a', C.ink, 1.8), path('M40 112 L52 94 L42 80 L58 64 L50 48', 'none', '#e8dcc0', 1.8),
    castle(58, 30, 0.42, { wall: HLF, tl: HLF, tr: HLF, keep: HLF }), tree(14, 112, 0.6), greyed(fig(30, '#8a6a4a', 'frown', { h: 0.28 })), ground),
  'slott.vattenborg': all(rect(0, 70, 120, 42, WATER, 0, null), waves(98, 4, 116), waves(106, 4, 116), ellipse(66, 86, 40, 8, '#b8a888', C.ink, 1.2), castle(66, 86, 0.6, { wall: HLF, tl: HLF, tr: HLF, keep: HLF, round: true }),
    lo('M4 92 L42 88', WOOD, 3), ...[10, 20, 30].map((x) => line(`M${x} 92 L${x} 100`, WOOD2, 1.6)), rect(0, 66, 14, 6, GRASS, 1, null)),
  'slott.borgruin': all(path('M10 112 L10 54 L16 50 L20 58 L26 46 L30 56 L30 112 Z', STONE, C.ink, 1.6), path('M30 112 L30 78 L44 72 L52 84 L62 80 L62 112 Z', STONE, C.ink, 1.6), path('M62 112 L62 30 L70 22 L78 34 L84 26 L90 40 L90 112 Z', STONE, C.ink, 1.6),
    path('M90 112 L90 88 L104 82 L110 94 L110 112 Z', STONE, C.ink, 1.6), courses(10, 54, 20, 58, 9), courses(62, 34, 28, 78, 9), win(76, 60, 8, 14, OPEN), slit(20, 80),
    ...[[40, 108], [48, 106], [100, 108], [56, 109]].map(([x, y]) => ellipse(x!, y!, 4, 2.6, STONE2, C.ink, 1)), ...[18, 46, 96].map((x) => line(`M${x} 112 l-2 -5 M${x + 2} 112 l2 -5`, GRASS2, 1.3)), ground),
  'slott.befästa': all(greyed(...[[14, 102], [30, 100], [44, 104]].map(([x, b]) => house(x!, b!, 0.7))), arrow(52, 80, 64, 80, HL, 2.4),
    ...[[80, 92], [96, 90], [110, 94]].map(([x, b]) => house(x!, b!, 0.55)), block(66, 94, 52, 18, HLF), tower(70, 112, 9, 28, HLF), tower(114, 112, 9, 28, HLF), ground),
  'slott.belägen': all(rect(8, 10, 104, 96, '#efe4c2', 2, C.ink, 1.6), path('M20 70 C30 56 50 60 54 74 C58 88 36 92 24 86 Z', WATER, C.ink, 1.2), path('M70 30 C80 24 96 26 100 36', 'none', '#9a958a', 2.4), path('M60 92 C74 84 90 90 104 82', 'none', '#c9a27a', 2),
    castle(84, 64, 0.32), path('M84 18 C74 18 72 30 84 44 C96 30 94 18 84 18 Z', HL, C.ink, 1.4), circle(84, 26, 3.6, C.white, null), tree(30, 40, 0.5), tree(40, 34, 0.45)),
  'slott.anlägga': all(rect(4, 84, 112, 28, '#e8d9b0', 0, null), line('M34 104 L98 104 L108 88 L44 88 Z', HL, 1.8, '4 3'), ...[[34, 104], [98, 104], [108, 88], [44, 88]].map(([x, y]) => lo(`M${x} ${y} L${x} ${y! - 9}`, WOOD, 1.6)),
    fig(18, ROYAL, 'smile', { h: 0.82, bottom: ROYAL }), on(18, 0.82, path('M-9 -63 L-9.5 -74 L-4.5 -68.5 L0 -76 L4.5 -68.5 L9.5 -74 L9 -63 Z', GOLD, C.ink, 1.3)), reach(18, 0.82, 1, 36, 58),
    rect(34, 48, 22, 16, '#f6ecd2', 1, C.ink, 1.1), path('M38 58 L44 52 L52 56', 'none', C.navy, 1), rect(39, 52, 6, 6, 'none', 0, ROOF, 0.9), fig(88, '#b98a52', 'smile', { h: 0.5 }), reach(88, 0.5, 1, 100, 86), shovel(102, 90, 0.6, 20), ground),
  'slott.höjd.2': all(rect(0, 0, 120, 120, '#eaf3f8', 18, null), path('M4 112 L4 100 C30 100 36 46 64 44 C92 46 96 100 116 100 L116 112 Z', GRASS, HL, 2.4), greyed(rect(4, 100, 112, 12, GRASS, 0, null)),
    house(64, 48, 0.8), arrow(108, 96, 108, 52, HL, 2.2), line('M100 46 L116 46', HL, 1.4, '3 3'), line('M100 100 L116 100', HL, 1.4, '3 3'), tree(22, 100, 0.5), ground),
  // ── 2017 Livet innanför murarna ──
  'slott.borgherre': all(greyed(castle(60, 70, 0.75)), fig(60, RED, 'smile', { h: 0.62, bottom: C.navy }), on(60, 0.62, furHatL(), chainL()), reach(60, 0.62, 1, 80, 82),
    circle(83, 88, 4, 'none', GOLD, 1.8), lo('M83 92 L83 100 M83 97 L87 97', GOLD, 1.2), greyed(fig(16, '#b98a52', 'smile', { h: 0.42 }), fig(104, '#c96b3c', 'smile', { h: 0.42, hairStyle: 'long' })), ground),
  'slott.väpnare': all(fig(32, C.silver, 'calm', { h: 0.95, bottom: C.silver }), on(32, 0.95, line('M-12 -34 L12 -34 M-12 -20 L12 -20', '#8d949c', 1.2)), g('translate(14 84) scale(0.9)', shield(0, 0, 1, RED)),
    fig(84, '#4f7a3a', 'smile', { h: 0.68, bottom: '#6b5a44' }), reach(84, 0.68, -1, 62, 52), reach(84, 0.68, 1, 98, 74), at(56, 102, 1, path('M-11 -55 C-11 -71 11 -71 11 -55 Z', C.silver, C.ink, 1.3)),
    lo('M98 74 L98 50', C.silver, 2), rect(94, 74, 8, 2.4, GOLD, 1, C.ink, 0.8), ground),
  'slott.tjänare': all(table(84, 4, 52), greyed(at(20, 112, 0.7, rect(-22, -60, 8, 60, WOOD, 2, C.ink, 1.4), rect(-22, -24, 32, 5, WOOD, 1.5, C.ink, 1.4)), bust(16, 64, RED, bFur, 1.3)),
    fig(84, '#efe6d2', 'smile', { h: 0.82, bottom: '#6b5a44' }), on(84, 0.82, path('M-9 -30 L9 -30 L11 4 L-11 4 Z', C.white, C.ink, 1.2)), reach(84, 0.82, -1, 62, 60), reach(84, 0.82, 1, 104, 60),
    ellipse(80, 58, 28, 3, C.silver, C.ink, 1.3), ellipse(72, 52, 9, 6, '#c97a5a', C.ink, 1.1), mug(92, 54, 0.45), ground),
  'slott.fackla': all(rect(0, 0, 120, 120, '#3a3a48', 18, null), archOpen(60, 112, 70, 100, '#55535e'), circle(60, 34, 30, 'rgba(242,193,78,0.25)', null),
    fig(60, '#8a6a4a', 'smile', { h: 0.8, bottom: '#5a4a3a' }), reach(60, 0.8, 1, 82, 46), g('translate(82 40)', torchL())),
  'slott.bonad': all(rect(4, 6, 112, 106, STONE, 1, C.ink, 1.4), courses(4, 6, 112, 106, 11), lo('M18 16 L102 16', WOOD2, 2.4), rect(22, 18, 76, 72, '#a8362e', 1, C.ink, 1.6), rect(27, 23, 66, 62, '#e8d6a8', 1, C.ink, 1),
    tree(42, 72, 0.9, '#4f7a3a'), at(72, 74, 0.55, horseL('#8a5a2e')), path('M30 30 L90 30', 'none', '#a8362e', 1.4), ...[26, 32, 38, 44, 50, 56, 62, 68, 74, 80, 86, 92].map((x) => line(`M${x} 90 L${x} 96`, GOLD, 1.4)), ground),
  'slott.gästabud': all(rect(4, 8, 112, 104, '#efe6d2', 2, null), ...[20, 40, 60, 80, 100].map((x, i) => bust(x, 66, [C.denim, '#c96b3c', RED, C.green, '#b07aa1'][i]!, i === 2 ? bFur : '', 1.4)), table(78, 6, 114),
    ellipse(60, 74, 14, 6, '#c9874f', C.ink, 1.2), path('M50 70 C54 64 66 64 70 70', 'none', '#a3622f', 1), ...[24, 42, 80, 98].map((x) => mug(x, 74, 0.5)), bread(36, 76, 0.5), bread(88, 76, 0.5), ...[30, 92].map((x) => all(rect(x - 1.6, 58, 3.2, 14, '#efe3c0', 0.5, C.ink, 0.8), path(`M${x} 50 C${x + 2.4} 54 ${x + 2.4} 56 ${x} 57 C${x - 2.4} 56 ${x - 2.4} 54 ${x} 50 Z`, C.orange, C.ink, 0.6))),
    ...[[18, 26], [40, 22], [80, 22], [102, 26]].map(([x, y]) => all(line(`M${x} 8 L${x} ${y! - 4}`, C.ink, 0.8), path(`M${x! - 5} ${y! - 4} L${x! + 5} ${y! - 4} L${x} ${y! + 6} Z`, [RED, C.navy, C.navy, RED][(x! / 20 | 0) % 4]!, C.ink, 0.9))), ground),
  'slott.falk': all(rect(0, 0, 120, 120, '#eaf3f8', 18, null), lo('M4 112 L40 86 L60 82', '#c7a46a', 14), path('M48 74 L72 74 L72 92 L52 94 Z', '#b07a3a', C.ink, 1.4),
    at(64, 54, 1.2, path('M-6 18 L-10 30 L2 30 Z', '#6b5a44', C.ink, 1), ellipse(0, 4, 11, 16, '#8a7a66', C.ink, 1.4), ellipse(2, 8, 6, 10, '#efe6d2', null), ...[2, 6, 10, 14].map((y) => line(`M-2 ${y} l3 1.4 M4 ${y} l3 1.4`, '#6b5a44', 0.8)),
      path('M-10 -2 C-18 8 -16 22 -6 26 C-8 14 -6 6 -2 -2 Z', '#6b5a44', C.ink, 1.2), circle(2, -14, 7.5, '#6b5a44', C.ink, 1.4), path('M-1 -10 C1 -6 5 -6 7 -10 L5 -14 Z', '#efe6d2', null),
      circle(5, -15, 2, '#f2c14e', C.ink, 0.8), circle(5.4, -15, 0.9, C.ink, null), path('M9 -14 L14 -12 L10 -9 Z', '#3d3f4a', C.ink, 0.8), path('M-4 19 L-4 23 M2 19 L2 23', 'none', C.yellow, 2.2))),
  'slott.tornerspel': all(rect(4, 100, 112, 12, '#e8d9b0', 0, null), lo('M4 92 L116 92', WOOD, 1.6), at(26, 112, 0.72, knightRider(RED, true)), at(94, 112, 0.72, g('scale(-1 1)', knightRider(C.navy, true))),
    ...[[30, 20, RED], [60, 14, GOLD], [90, 20, C.navy]].map(([x, y, c]) => all(line(`M${x} ${y} L${x} ${y as number + 16}`, C.ink, 1), path(`M${x} ${y} L${x as number + 10} ${y as number + 3} L${x} ${y as number + 6} Z`, c as string, C.ink, 0.9)))),
};

