/**
 * Historia & humaniora → Religion & idéhistoria → Judendom & andra traditioner, 2141–2147 (0.38): Jewish
 * history, the Torah and the Talmud, the synagogue and the Sabbath, the Jewish festivals, Sikhism, traditional
 * African religions and indigenous religious traditions (above all the Sami). The pictures are neutral and
 * respectful and are built from objects, buildings and ordinary people: a blue six-pointed star, a golden
 * seven-armed menorah, a Torah scroll on two wooden rollers, a small round kippah, a Sikh turban and steel
 * bracelet, a carved wooden mask, a Sami drum and a lavvu. Persecution and the Holocaust are never shown as
 * violence: exile is a lonely walk away from a city, the ghetto is a walled district. The divine is a glow
 * above a cloud, never a face. Hebrew and other script appear only as loose square strokes, never as real
 * letters. No swastika or manji. A grey copy stands beside the coloured one where the contrast carries the
 * meaning. Digits only; no words in the pictures and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { type Build } from './figures';
import { HL, cloud, heart } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Colours ──────────────────────────────────────────────────────────
const GOLD = C.gold;
const GLOW = '#fff1b8';
const BLUE = '#2f5fa8';
const WOOD = '#9a6634';
const WOOD2 = '#6e4420';
const PARCH = '#f3e6c4';
const PARCH2 = '#e2cf9f';
const VELVET = '#7a2747';
const STONE2 = '#b3a891';
const SAND = '#ecd49a';
const LEAF = '#5f9e58';
const LEAF2 = '#3f7a3c';
const NIGHT = '#2c3557';
const SAFF = '#ef9a2c';
const STEEL = '#aeb6bf';
const SAMI_B = '#2f5fb0';
const SAMI_R = '#c8372d';
const SAMI_Y = '#f2c14e';
const SAMI_G = '#3f8f4f';
const GREY = '#8d949c';
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);

// ── Figures ──────────────────────────────────────────────────────────
const ground = line('M4 112 L116 112', C.grey2, 2);
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, hy: f1(ty - 56 * s), sy: f1(ty - 38 * s), sl: f1(x - 13 * s), sr: f1(x + 13 * s) }; };
const lo = (d: string, col: string, w: number) => line(d, C.ink, w + 2) + line(d, col, w);
/** A sleeved arm from the shoulder (side −1 = picture-left) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number, col: string, skin: string = C.skin) => {
  const q = geo(x, h), sx = side < 0 ? q.sl : q.sr, w = 5 * Math.max(0.7, h);
  return all(lo(`M${sx} ${q.sy} L${tx} ${ty}`, col, w), circle(tx, ty, 3 * Math.max(0.6, h), skin, C.ink, 1.2));
};
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
// head wear in standing-figure coordinates (head centre 0,−56)
const kippahL = (col: string = BLUE) => path('M-7 -64.5 C-6.5 -70.5 6.5 -70.5 7 -64.5 Z', col, C.ink, 1.1);
const beardL = (col: string = '#4a3a2e') => path('M-8 -53 C-8 -40 8 -40 8 -53 C4 -49.5 -4 -49.5 -8 -53 Z', col, C.ink, 1);
const longBeardL = (col: string = '#4a3a2e') => path('M-8.5 -54 C-9 -34 9 -34 8.5 -54 C4 -49.5 -4 -49.5 -8.5 -54 Z', col, C.ink, 1);
/** Sikh turban: a pointed wrap with folds. */
const turbanL = (col: string = '#e8732c') => all(path('M-11.5 -58 C-13 -68 -8 -76 0 -77 C8 -76 13 -68 11.5 -58 C6 -61 -6 -61 -11.5 -58 Z', col, C.ink, 1.3),
  path('M-10 -62 C-4 -70 4 -72 9 -70 M-9 -66.5 C-3 -73 3 -74.5 7 -74', 'none', C.ink, 0.8), path('M-2 -77 L0 -61', 'none', C.ink, 0.8));
const scarfL = (col: string) => path('M-12.5 -54 C-14 -72 14 -72 12.5 -54 L13 -42 C6 -40 -6 -40 -13 -42 Z', col, C.ink, 1.2);
/** Tallit (white prayer shawl with blue stripes) over the shoulders. */
const tallitL = () => all(path('M-15 -42 L15 -42 L13 -6 L5 -6 L4 -38 L-4 -38 L-5 -6 L-13 -6 Z', '#f6f3ea', C.ink, 1.2), line('M-14 -14 L-5 -14 M5 -14 L14 -14 M-14 -18 L-5 -18 M5 -18 L14 -18', BLUE, 1.6));
const man = (x: number, h = 1, top: string = C.dark, mood: Mood = 'smile', extra: Svg = '') => all(fig(x, top, mood, { h, bottom: C.dark }), on(x, h, kippahL(), extra));
const rabbi = (x: number, h = 1, mood: Mood = 'smile') => all(fig(x, C.black, mood, { h, bottom: C.black }), on(x, h, longBeardL(), path('M-12 -66 C-12 -73 12 -73 12 -66 L16 -64 L-16 -64 Z', C.black, C.ink, 1.2), rect(-3, -42, 6, 22, C.white, 1, C.ink, 0.8)));
const sikhMan = (x: number, h = 1, top: string = C.white, tc = '#e8732c', mood: Mood = 'smile') => all(fig(x, top, mood, { h, bottom: '#4a5a7a', skin: '#c98b5e' }), on(x, h, turbanL(tc), beardL('#2b2a33')));
/** A small bust (head and shoulders) for groups. */
const bust = (x: number, y: number, top: string, s = 1, hat: Svg = '', skin: string = C.skin) => at(x, y, s,
  path('M-8 12 C-8 4 8 4 8 12 Z', top, C.ink, 1.2), circle(0, 0, 5.4, skin, C.ink, 1.2),
  path('M-5.4 -1 C-5.4 -8 5.4 -8 5.4 -1 C3 -4 -3 -4 -5.4 -1 Z', C.hair, null), circle(-2, 0, 0.8, C.ink, null), circle(2, 0, 0.8, C.ink, null), hat);
// seated cross-legged figure, facing the viewer; local: ground 0, head centre (0, −52)
const sitL = (top: string, o: { skin?: string; hat?: Svg; mood?: 'smile' | 'calm'; bottom?: string } = {}) => all(
  path('M-24 0 C-24 -10 -12 -12 0 -10 C12 -12 24 -10 24 0 Z', o.bottom ?? '#6b7a8a', C.ink, 1.6),
  path('M-13 -36 L13 -36 C15 -24 16 -14 14 -8 L-14 -8 C-16 -14 -15 -24 -13 -36 Z', top, C.ink, 1.8),
  rect(-3.5, -43, 7, 7, o.skin ?? C.skin, 2, C.ink, 1.4), circle(0, -52, 10, o.skin ?? C.skin, C.ink, 1.8),
  path('M-10 -54 C-10 -66 10 -66 10 -54 C6 -59 -6 -59 -10 -54 Z', C.hair, C.ink, 1.4),
  o.mood === 'calm' ? path('M-5.5 -52 Q-3.6 -55 -1.8 -52 M1.8 -52 Q3.6 -55 5.5 -52', 'none', C.ink, 1.2) : all(circle(-3.4, -52, 1.2, C.ink, null), circle(3.4, -52, 1.2, C.ink, null)),
  line('M-3 -47.5 Q0 -45 3 -47.5', C.ink, 1.2), o.hat ?? '');
const sit = (x: number, y: number, s: number, top: string, o: { skin?: string; hat?: Svg; mood?: 'smile' | 'calm'; bottom?: string } = {}) => at(x, y, s, sitL(top, o));
const say = (cx: number, cy: number, w: number, h: number, tx: number, ty: number, inner: Svg = '') => {
  const L = cx - w / 2, R = cx + w / 2, Tp = cy - h / 2, B = cy + h / 2; let a: number[], b: number[];
  if (tx < L || tx > R) { const e = tx < L ? L : R, by = Math.max(Tp + 5, Math.min(B - 5, ty)); a = [e, by - 4]; b = [e, by + 4]; }
  else { const e = ty > cy ? B : Tp, bx = Math.max(L + 6, Math.min(R - 6, tx)); a = [bx - 4, e]; b = [bx + 4, e]; }
  return all(path(`M${a[0]} ${a[1]} L${tx} ${ty} L${b[0]} ${b[1]} Z`, C.white, C.ink, 1.4), rect(L, Tp, w, h, C.white, 5, C.ink, 1.4), path(`M${a[0]} ${a[1]} L${tx} ${ty} L${b[0]} ${b[1]} Z`, C.white, null), inner);
};
const note = (x: number, y: number, s = 1, col: string = C.navy) => at(x, y, s, path('M0 6 L0 -10 L8 -12 L8 4', 'none', col, 2), ellipse(-2.5, 6, 3.4, 2.6, col, null), ellipse(5.5, 4, 3.4, 2.6, col, null));
const bkip = (col: string = BLUE) => path('M-4.2 -4.6 C-3.8 -8.2 3.8 -8.2 4.2 -4.6 Z', col, C.ink, 0.9);
const no = (x: number, y: number, r = 9) => all(circle(x, y, r, 'none', C.red, 2.4), line(`M${f1(x - r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r * 0.7)} ${f1(y - r * 0.7)}`, C.red, 2.4));

// ── Signs and objects ────────────────────────────────────────────────
const rays = (x: number, y: number, r1: number, r2: number, n = 12, col: string = GOLD, w = 1.6) => all(...Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * r1)} ${f1(y + Math.sin(a) * r1)} L${f1(x + Math.cos(a) * r2)} ${f1(y + Math.sin(a) * r2)}`, col, w); }));
const glow = (x: number, y: number, r: number) => all(circle(x, y, r * 1.5, GLOW, null), rays(x, y, r * 1.1, r * 1.7), circle(x, y, r, '#ffe27a', '#e0b23c', 1.4));
const divine = (x: number, y: number, s = 1) => at(x, y, s, glow(0, -8, 9), cloud(0, 6, 1.1, C.white));
/** Six-pointed star made of two triangles. */
const star6 = (x: number, y: number, r: number, col: string = BLUE, w = 2) => all(
  path(`M${x} ${f1(y - r)} L${f1(x + r * 0.866)} ${f1(y + r / 2)} L${f1(x - r * 0.866)} ${f1(y + r / 2)} Z`, 'none', col, w),
  path(`M${x} ${f1(y + r)} L${f1(x + r * 0.866)} ${f1(y - r / 2)} L${f1(x - r * 0.866)} ${f1(y - r / 2)} Z`, 'none', col, w));
const flame = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -9 C4 -4 4 0 0 1 C-4 0 -4 -4 0 -9 Z', '#ffd25a', '#e08a2c', 0.9));
/** Seven-armed menorah standing on (x, y); width ≈ 2·w. */
const menorah = (x: number, y: number, s = 1, lit = false, col: string = GOLD) => at(x, y, s,
  path('M-8 0 L8 0 L4 -6 L-4 -6 Z', col, C.ink, 1.3), lo('M0 -6 L0 -46', col, 3),
  ...[12, 24, 36].map((r) => lo(`M${-r} -46 L${-r} ${-46 + r} Q${-r} ${-34 + r} 0 ${-34 + r} Q${r} ${-34 + r} ${r} ${-46 + r} L${r} -46`, col, 2.6)),
  ...[-36, -24, -12, 0, 12, 24, 36].map((cx) => all(rect(cx - 3, -49, 6, 3.5, col, 1, C.ink, 0.9), lit ? flame(cx, -50, 0.75) : '')));
/** Nine-armed chanukka candlestick with n lit candles (counted from the right) plus the helper candle. */
const hanukkiah = (x: number, y: number, s = 1, n = 8, col: string = GOLD) => at(x, y, s,
  path('M-10 0 L10 0 L5 -6 L-5 -6 Z', col, C.ink, 1.3), lo('M0 -6 L0 -30', col, 3), lo('M-40 -30 L40 -30', col, 3),
  ...[-40, -30, -20, -10, 10, 20, 30, 40].map((cx, i) => all(rect(cx - 2.2, -42, 4.4, 12, i >= 8 - n ? '#9fc3e0' : C.white, 0.6, C.ink, 0.8), i >= 8 - n ? flame(cx, -43, 0.6) : '')),
  rect(-2.2, -50, 4.4, 20, '#9fc3e0', 0.6, C.ink, 0.8), flame(0, -51, 0.6));
const candle = (x: number, y: number, s = 1, lit = true, col: string = C.white) => at(x, y, s, rect(-3, -16, 6, 16, col, 1, C.ink, 1.1), line('M0 -16 L0 -18.5', C.ink, 1), lit ? flame(0, -19, 0.8) : '');
const stick = (x: number, y: number, s = 1, lit = true) => at(x, y, s, path('M-6 0 L6 0 L2 -4 L2 -10 L4 -12 L-4 -12 L-2 -10 L-2 -4 Z', C.silver, C.ink, 1.1), candle(0, -12, 1, lit));
/** Abstract square strokes (deliberately not real letters) in a row from x, right to left. */
const glyphs = (x: number, y: number, n: number, s = 1, col: string = C.ink) => all(...Array.from({ length: n }, (_, i) => {
  const gx = x - i * 7 * s, k = (i * 5 + Math.round(x + y)) % 3, a = (v: number) => f1(v * s);
  const d = k === 0 ? `M${f1(gx - 2.6 * s)} ${f1(y - 3 * s)} L${f1(gx + 2.6 * s)} ${f1(y - 3 * s)} M${gx} ${f1(y - 3 * s)} L${gx} ${f1(y + 3 * s)}`
    : k === 1 ? `M${f1(gx - 2.6 * s)} ${f1(y - 3 * s)} L${f1(gx + 2.6 * s)} ${f1(y - 3 * s)} M${gx} ${f1(y + 1.4 * s)} L${gx} ${f1(y + 3 * s)}`
    : `M${f1(gx - 1.6 * s)} ${f1(y - 3 * s)} L${f1(gx + 1.6 * s)} ${f1(y - 3 * s)} M${gx} ${f1(y - 3 * s)} L${gx} ${f1(y + a(1.2) + y * 0)}`;
  return line(d, col, 1.4 * s);
}));
/** Open Torah scroll: two rollers with handles and a parchment between, centre (x, y), width 2·w. */
const scroll = (x: number, y: number, w = 26, h = 30, rows = 4) => all(
  rect(x - w, y - h / 2, 2 * w, h, PARCH, 1, C.ink, 1.3),
  ...Array.from({ length: rows }, (_, i) => glyphs(x + w - 7, y - h / 2 + 7 + i * ((h - 10) / Math.max(1, rows - 1)), Math.floor((2 * w - 10) / 7), 0.8, '#4a3a2e')),
  ...[-1, 1].map((sd) => all(rect(x + sd * w - 4, y - h / 2 - 2, 8, h + 4, PARCH2, 4, C.ink, 1.3), lo(`M${x + sd * w} ${y - h / 2 - 9} L${x + sd * w} ${y + h / 2 + 9}`, WOOD, 2.6),
    ellipse(x + sd * w, y - h / 2 - 3, 5, 2, WOOD, C.ink, 1), ellipse(x + sd * w, y + h / 2 + 3, 5, 2, WOOD, C.ink, 1))));
/** A dressed Torah scroll (velvet mantle, two crowned handles). Base at (x, y). */
const dressed = (x: number, y: number, s = 1) => at(x, y, s,
  lo('M-6 -60 L-6 4 M6 -60 L6 4', WOOD, 2.6), path('M-14 -50 C-14 -56 14 -56 14 -50 L14 0 L-14 0 Z', VELVET, C.ink, 1.5),
  line('M-14 -6 L14 -6', GOLD, 2), star6(0, -28, 7, GOLD, 1.8), ...[-6, 6].map((cx) => all(path(`M${cx - 4} -60 L${cx - 4} -66 L${cx - 2} -63 L${cx} -67 L${cx + 2} -63 L${cx + 4} -66 L${cx + 4} -60 Z`, GOLD, C.ink, 1), circle(cx, -68, 1.4, GOLD, C.ink, 0.6))));
const book = (x: number, y: number, s = 1, cover: string = BLUE, mark: Svg = '') => at(x, y, s, rect(-11, -14, 22, 28, cover, 2, C.ink, 1.4), line('M-8 -14 L-8 14', C.ink, 1), mark);
const openBook = (x: number, y: number, s = 1, glyph = true) => at(x, y, s, path('M0 -2 C-8 -6 -16 -6 -22 -3 L-22 13 C-16 10 -8 10 0 14 C8 10 16 10 22 13 L22 -3 C16 -6 8 -6 0 -2 Z', PARCH, C.ink, 1.3), line('M0 -2 L0 14', C.ink, 1),
  glyph ? all(glyphs(-4, 3, 3, 0.7, '#4a3a2e'), glyphs(-4, 8, 3, 0.7, '#4a3a2e'), glyphs(18, 3, 3, 0.7, '#4a3a2e'), glyphs(18, 8, 3, 0.7, '#4a3a2e')) : all(line('M-18 3 L-4 3 M-18 8 L-4 8 M4 3 L18 3 M4 8 L18 8', '#8a7a62', 1)));
/** Braided challah loaf, centre (x, y). */
const challah = (x: number, y: number, s = 1, cover = false) => at(x, y, s,
  ellipse(0, 0, 24, 9, '#d0893a', C.ink, 1.4), ...[-15, -5, 5, 15].map((cx) => ellipse(cx, -1, 6, 6.5, '#e3a14e', C.ink, 1)), ...[-15, -5, 5, 15].map((cx) => path(`M${cx - 3} -4 Q${cx} -2 ${cx + 3} -5`, 'none', '#f6d48f', 1.2)),
  cover ? path('M-27 2 C-27 -16 27 -16 27 2 L22 4 L-22 4 Z', '#f6f3ea', C.ink, 1.3) + line('M-20 -4 L20 -4', BLUE, 1.5) : '');
const wineCup = (x: number, y: number, s = 1) => at(x, y, s, path('M-6 -16 L6 -16 C6 -8 3 -5 0 -5 C-3 -5 -6 -8 -6 -16 Z', C.silver, C.ink, 1.2), path('M-5.4 -13 L5.4 -13 C5 -8 2.6 -6 0 -6 C-2.6 -6 -5 -8 -5.4 -13 Z', '#8a1f3a', null), line('M0 -5 L0 -1', C.ink, 1.6), ellipse(0, 0, 5, 1.6, C.silver, C.ink, 1));
const table = (y = 86, x1 = 8, x2 = 112, cloth: string = C.white) => all(rect(x1, y, x2 - x1, 6, cloth, 2, C.ink, 1.6), line(`M${x1 + 8} ${y + 6} L${x1 + 8} 112 M${x2 - 8} ${y + 6} L${x2 - 8} 112`, WOOD, 3));
const matzah = (x: number, y: number, s = 1) => at(x, y, s, rect(-14, -10, 28, 20, '#ecd49a', 2, C.ink, 1.3), ...[-6, 0, 6].map((yy) => line(`M-11 ${yy} L11 ${yy}`, '#b38a4a', 1, '1 2.5')), path('M-14 -4 L-12 -6 M14 3 L12 5', 'none', '#b38a4a', 1));
const loaf = (x: number, y: number, s = 1, col: string = '#d0893a') => at(x, y, s, path('M-14 6 C-16 -10 16 -10 14 6 Z', col, C.ink, 1.3), path('M-6 -4 L-3 1 M1 -5 L4 0 M7 -3 L9 1', 'none', '#8a5a2a', 1));
/** Building facades. */
const synagogue = (x: number, y: number, s = 1) => at(x, y, s,
  rect(-34, -50, 68, 50, '#efe3c8', 2, C.ink, 1.6), path('M-38 -50 L0 -68 L38 -50 Z', '#c9a87a', C.ink, 1.6),
  circle(0, -54, 6, '#bfe0f5', C.ink, 1.2), star6(0, -54, 4.2, BLUE, 1.2),
  path('M-8 0 L-8 -20 C-8 -28 8 -28 8 -20 L8 0 Z', WOOD, C.ink, 1.3), line('M0 -26 L0 0', C.ink, 1),
  ...[-24, 16].map((wx) => path(`M${wx} -18 L${wx} -34 C${wx} -40 ${wx + 8} -40 ${wx + 8} -34 L${wx + 8} -18 Z`, '#9fc3e0', C.ink, 1.1)),
  menorah(0, -36, 0.17, false, GOLD));
const house = (x: number, y: number, s = 1, col: string = '#e6d3b3', roof: string = '#b5553a') => at(x, y, s, rect(-10, -14, 20, 14, col, 1, C.ink, 1.2), path('M-12 -14 L0 -24 L12 -14 Z', roof, C.ink, 1.2), rect(-3, -7, 6, 7, WOOD, 1, C.ink, 0.8));
const temple = (x: number, y: number, s = 1, col: string = '#e8dcbf') => at(x, y, s, rect(-16, -18, 32, 18, col, 1, C.ink, 1.2), rect(-20, -22, 40, 5, col, 1, C.ink, 1.2), ...[-12, -4, 4, 12].map((cx) => line(`M${cx} -17 L${cx} 0`, C.ink, 1)));
const goldDome = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 0 C-10 -6 -6 -12 0 -16 C6 -12 10 -6 8 0 Z', GOLD, C.ink, 1.1), line('M0 -16 L0 -21', C.ink, 1), circle(0, -22, 1.4, GOLD, C.ink, 0.6));
/** Khanda: a double-edged sword in a ring, flanked by two curved swords (drawn simply). */
const khanda = (x: number, y: number, s = 1, col: string = BLUE) => at(x, y, s,
  path('M0 -30 L3 -22 L3 8 L-3 8 L-3 -22 Z', col, C.ink, 1.2), rect(-7, 8, 14, 3, col, 1, C.ink, 1), rect(-1.6, 11, 3.2, 7, col, 1, C.ink, 0.9),
  circle(0, 0, 13, 'none', C.ink, 6.4), circle(0, 0, 13, 'none', col, 4),
  path('M-6 16 C-30 8 -30 -16 -16 -26 C-24 -14 -22 6 -4 14 Z', col, C.ink, 1.1), path('M6 16 C30 8 30 -16 16 -26 C24 -14 22 6 4 14 Z', col, C.ink, 1.1));
const kara = (x: number, y: number, r = 6) => all(circle(x, y, r, 'none', C.ink, 4.2), circle(x, y, r, 'none', STEEL, 2.6));
const scissors = (x: number, y: number, s = 1) => at(x, y, s, circle(-4, 6, 3, 'none', C.ink, 1.4), circle(4, 6, 3, 'none', C.ink, 1.4), line('M-2.5 3.5 L5 -8 M2.5 3.5 L-5 -8', STEEL, 2));
const tree = (x: number, s = 1, col: string = LEAF) => at(x, 112, s, rect(-3, -22, 6, 22, WOOD, 1, C.ink, 1.2), circle(0, -32, 14, col, C.ink, 1.4));
const pine = (x: number, s = 1) => at(x, 112, s, rect(-2, -8, 4, 8, WOOD, 0.5, C.ink, 1), path('M0 -40 L10 -18 L5 -18 L13 -8 L-13 -8 L-5 -18 L-10 -18 Z', LEAF2, C.ink, 1.2));
const mountain = (x: number, y: number, w: number, h: number, col: string = '#9ab0c0') => all(path(`M${x - w} ${y} L${x} ${y - h} L${x + w} ${y} Z`, col, C.ink, 1.5), path(`M${f1(x - w * 0.28)} ${f1(y - h * 0.72)} L${x} ${y - h} L${f1(x + w * 0.28)} ${f1(y - h * 0.72)} L${f1(x + w * 0.1)} ${f1(y - h * 0.66)} L${x} ${f1(y - h * 0.76)} L${f1(x - w * 0.12)} ${f1(y - h * 0.66)} Z`, C.white, null));
const wisp = (x: number, y: number, s = 1, col: string = '#9fd0e8') => at(x, y, s, path('M0 10 C-6 4 -6 -4 0 -8 C2 -10 6 -10 6 -6 C2 -6 2 -2 4 2 C6 6 4 10 0 10 Z', col, '#5a8fb0', 1), circle(1, -4, 0.9, '#2c3557', null), circle(4, -4.5, 0.9, '#2c3557', null));
const reindeer = (x: number, y: number, s = 1, flip = false) => g(`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`,
  line('M-10 0 L-10 -12 M-4 0 L-4 -12 M8 0 L8 -12 M13 0 L13 -12', '#6e5236', 2.6), ellipse(2, -16, 15, 7, '#8a6a48', C.ink, 1.3), path('M14 -20 L19 -32 L25 -30 L21 -18 Z', '#8a6a48', C.ink, 1.2),
  ellipse(24, -31, 5, 3.5, '#8a6a48', C.ink, 1.1), circle(25, -32, 0.9, C.ink, null),
  line('M20 -34 L16 -46 L12 -50 M16 -46 L20 -50 M18 -40 L13 -42 M22 -34 L24 -46 L22 -52 M24 -46 L28 -50', '#c8b08a', 1.8), ellipse(-12, -19, 3, 2, C.white, C.ink, 0.8));
/** Sami drum: an oval frame drum with simple figures. */
const samiDrum = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 0, 13, 17, '#e6c79a', C.ink, 1.6), ellipse(0, 0, 10.5, 14.5, 'none', '#a0703a', 1),
  line('M-10 -4 L10 -4', SAMI_R, 1.4), circle(0, 5, 3.2, 'none', SAMI_R, 1.3), line('M0 1.5 L0 -1 M3 5 L5 5 M-3 5 L-5 5 M0 8.5 L0 11', SAMI_R, 1),
  path('M-6 -12 L-6 -7 M-8 -10 L-4 -10 M-7 -6 L-6 -7 L-5 -6', 'none', SAMI_R, 1), path('M4 -12 L8 -12 L9 -9 M5 -12 L5 -9 M7 -12 L7 -9 M3.4 -13.4 L2.6 -15', 'none', SAMI_R, 1));
/** Gákti (Sami dress) band trims on a figure in standing-figure coordinates. */
const gaktiL = () => all(line('M-14 -40 L14 -40', SAMI_R, 3), line('M-13.5 -36 L13.5 -36', SAMI_Y, 1.8), line('M-12 -2 L12 -2', SAMI_R, 3), line('M-12 -6 L12 -6', SAMI_Y, 1.6), line('M-13 -18 L13 -18', SAMI_G, 1.6));
const samiFig = (x: number, h = 1, mood: Mood = 'smile', more: Partial<Build> = {}) => all(fig(x, SAMI_B, mood, { h, bottom: '#2b3a67', ...more }), on(x, h, gaktiL(), path('M-10 -60 C-10 -72 10 -72 10 -60 Z', SAMI_B, C.ink, 1.2), line('M-10 -61 L10 -61', SAMI_R, 2.2)));
const xMark = () => all(circle(0, 0, 4, C.white, C.red, 1.4), line('M-2 -2 L2 2 M2 -2 L-2 2', C.red, 1.4));
const okMark = () => all(circle(0, 0, 4, C.white, C.green, 1.4), path('M-2 0 L-0.5 1.8 L2.4 -1.6', 'none', C.green, 1.4));
const qMark = (x: number, y: number, s = 1) => at(x, y, s, path('M-3 -4 C-3 -8 3 -8 3 -4 C3 -1 0 -1 0 2', 'none', HL, 1.8), circle(0, 5, 1, HL, null));

// ── Motifs ───────────────────────────────────────────────────────────
export const JUDAISM_TRADITION_MOTIFS: Record<string, Svg> = {
  // 2141 Judisk historia
  'jud.judendom': all(greyed(at(16, 20, 1, rect(-2, -10, 4, 20, '#8a5a3a', 0.6, C.ink, 1), rect(-7, -5, 14, 4, '#8a5a3a', 0.6, C.ink, 1)), at(104, 20, 1, path('M2 -9 A9 9 0 1 0 2 9 A7 7 0 1 1 2 -9 Z', '#3f8f8a', C.ink, 1)),
    at(16, 100, 1, circle(0, 0, 9, 'none', C.ink, 2), circle(0, 0, 2, C.ink, null), line('M0 -9 L0 9 M-9 0 L9 0 M-6.4 -6.4 L6.4 6.4 M6.4 -6.4 L-6.4 6.4', C.ink, 1.2)), at(104, 100, 1, path('M0 -8 C6 -2 6 6 0 8 C-6 6 -6 -2 0 -8 Z M-10 2 C-4 0 -2 6 0 8 C-6 8 -10 6 -10 2 Z M10 2 C4 0 2 6 0 8 C6 8 10 6 10 2 Z', C.pink, C.ink, 1))),
    circle(60, 52, 36, GLOW, null), rays(60, 52, 32, 42, 16), star6(60, 46, 22, BLUE, 3.6), at(60, 94, 0.5, scroll(0, 0, 22, 22, 3)), menorah(32, 100, 0.3, true), menorah(88, 100, 0.3, true)),
  'jud.judisk': all(...[[22, 'book'], [60, 'box'], [98, 'cal']].map(([x, k]) => {
      const obj = (col: string, mark: boolean) => k === 'book' ? book(0, 0, 1, col, mark ? star6(0, 0, 5.5, GOLD, 1.4) : '')
        : k === 'box' ? all(rect(-12, -14, 24, 28, col, 2, C.ink, 1.4), rect(-8, -6, 16, 12, C.white, 1, C.ink, 1), mark ? star6(0, 0, 4.5, BLUE, 1.3) : '')
        : all(rect(-13, -14, 26, 28, C.white, 2, C.ink, 1.4), rect(-13, -14, 26, 8, col, 2, C.ink, 1.4), ...[0, 1, 2].map((r) => line(`M-9 ${-1 + r * 6} L9 ${-1 + r * 6}`, '#8a7a62', 1, '2 2')), mark ? star6(0, -10, 3, C.white, 1.2) : '');
      return all(greyed(at(+x!, 30, 0.8, obj('#9aa3ad', false))), arrow(+x!, 46, +x!, 60, GREY, 1.6), at(+x!, 88, 1.05, obj(k === 'book' ? BLUE : k === 'box' ? '#e8a64a' : '#3f8f4f', true)));
    }), ground),
  'jud.det-utlovade-landet': all(rect(4, 92, 56, 20, SAND, 0, null), path('M60 112 L60 84 C72 70 86 78 96 66 C104 58 112 64 116 60 L116 112 Z', '#9ccf7f', C.ink, 1.4),
    tree(86, 0.5), tree(104, 0.4), path('M66 96 C74 92 80 94 86 90', 'none', '#6aaed6', 3), glow(100, 30, 8),
    ...[14, 28, 42].map((x, i) => all(fig(x, [C.denim, '#c96b3c', C.purple][i]!, 'smile', { h: 0.42 }), at(x + 6, 82, 0.8, rect(-3, -4, 6, 6, '#c9a87a', 1, C.ink, 0.8)))), arrow(46, 70, 70, 60, HL, 2.4), ground),
  'jud.exil': all(greyed(temple(26, 94, 0.9), house(10, 94, 0.8), house(42, 94, 0.7), rect(4, 94, 48, 18, STONE2, 0, null)), line('M60 30 L60 112', HL, 1.8, '4 4'),
    fig(92, '#7a5aa8', 'frown', { h: 0.82 }), reach(92, 0.82, 1, 104, 82, '#7a5aa8'), lo('M104 82 L108 66', WOOD, 2), circle(108, 64, 6, '#c9a87a', C.ink, 1.1), arrow(76, 50, 110, 50, HL, 2.4), path('M78 40 C70 34 64 34 58 38', 'none', GREY, 1.4, ), ground),
  'jud.diaspora': all(circle(60, 60, 44, '#cfe6f5', C.ink, 1.6), path('M30 40 C40 30 54 34 58 44 C60 54 48 56 44 66 C40 74 30 70 26 60 Z M66 30 C78 26 92 34 94 46 C90 52 80 50 74 56 C68 50 64 40 66 30 Z M72 72 C82 68 92 74 90 86 C84 94 74 90 72 82 Z', '#b9d9a5', C.ink, 1.2),
    circle(60, 50, 6, '#ffe27a', C.ink, 1.2), ...[[30, 30], [92, 28], [100, 70], [76, 98], [24, 84], [40, 102]].map(([x, y]) => all(arrow(60, 50, x! + (60 - x!) * 0.2, y! + (50 - y!) * 0.2, HL, 1.8), circle(x!, y!, 6, C.white, C.ink, 1.1), star6(x!, y!, 4, BLUE, 1.2)))),
  'jud.getto': all(greyed(house(10, 112, 0.9), house(110, 112, 0.9), tree(10, 0.55)), rect(24, 52, 72, 60, '#c9b9a0', 0, null),
    ...[[34, 74], [48, 74], [62, 74], [76, 74], [88, 74], [34, 98], [48, 98], [72, 98], [88, 98]].map(([x, y]) => house(x!, y!, 0.62, '#e6d3b3', '#9a5a3a')),
    rect(20, 48, 6, 64, '#8a7a62', 1, C.ink, 1.4), rect(94, 48, 6, 64, '#8a7a62', 1, C.ink, 1.4), rect(20, 46, 80, 6, '#8a7a62', 1, C.ink, 1.4), path('M52 112 L52 98 L68 98 L68 112', 'none', C.ink, 1.4), ...[54, 58, 62, 66].map((x) => line(`M${x} 99 L${x} 112`, C.ink, 1.2)), ground),
  'jud.jiddisch': all(fig(26, '#7a5aa8', 'smile', { h: 0.84, hairStyle: 'long' }), fig(94, C.green, 'smile', { h: 0.86 }),
    say(42, 22, 48, 22, 30, 42, all(glyphs(60, 18, 6, 1, C.navy), glyphs(56, 27, 5, 1, C.navy))), say(80, 52, 48, 22, 92, 68, all(glyphs(98, 48, 6, 1, C.navy), glyphs(94, 57, 4, 1, C.navy))),
    star6(66, 22, 4, BLUE, 1.2), star6(104, 52, 4, BLUE, 1.2), ground),
  'jud.tora': all(circle(60, 52, 40, GLOW, null), rays(60, 52, 36, 46, 16), scroll(60, 56, 30, 34, 5), rect(36, 92, 48, 6, WOOD, 1, C.ink, 1.3), line('M44 98 L44 112 M76 98 L76 112', WOOD, 3), ground),
  'jud.hebreiska': all(rect(14, 22, 92, 62, PARCH, 3, C.ink, 1.6), glyphs(96, 36, 8, 1.4, C.navy), glyphs(96, 52, 6, 1.4, C.navy), glyphs(96, 68, 8, 1.4, C.navy), arrow(100, 96, 24, 96, HL, 2.8), circle(104, 96, 3.5, HL, null)),
  'jud.de-fem-Moseböckerna': all(...[16, 38, 60, 82, 104].map((x, i) => all(at(x, 70, 1, rect(-9, -26, 18, 52, ['#7a2747', '#2f5fa8', '#3f7a3c', '#9a6634', '#5a4a8a'][i]!, 2, C.ink, 1.4), line('M-9 -18 L9 -18 M-9 18 L9 18', GOLD, 1.6)), `<text x="${x}" y="74" font-family="system-ui,sans-serif" font-weight="800" font-size="13" text-anchor="middle" fill="#fff">${i + 1}</text>`)),
    path('M10 104 C30 112 90 112 110 104', 'none', HL, 2.2), ground),
  'jud.bud.2': all(at(28, 26, 0.55, scroll(0, 0, 24, 26, 3)), arrow(44, 34, 60, 50, HL, 2),
    ...Array.from({ length: 7 }, (_, i) => { const x = 10 + i * 15; return all(rect(x, 58, 14, 30, i === 6 ? '#fff1b8' : C.white, 2, C.ink, 1.3),
      i < 6 ? all(lo(`M${x + 4} 82 L${x + 10} 70`, WOOD, 2), rect(x + 7, 66, 6, 4, GREY, 1, C.ink, 0.8), at(x + 7, 63, 0.7, okMark()))
        : all(candle(x + 4, 84, 0.6), candle(x + 10, 84, 0.6), at(x + 7, 63, 0.7, xMark()))); }),
    rect(98, 54, 20, 38, 'none', 3, HL, 2.2), ground),
  'jud.torarulle': all(dressed(60, 104, 1.1), ground),
  'jud.pergament': all(rect(18, 20, 52, 66, WOOD, 2, C.ink, 1.6), rect(24, 26, 40, 54, '#f0e2c0', 2, C.ink, 1.2), ...[[24, 26], [64, 26], [24, 80], [64, 80]].map(([x, y]) => line(`M${x} ${y} L${x! + (x! < 40 ? -5 : 5)} ${y! + (y! < 50 ? -5 : 5)}`, C.ink, 1)),
    glyphs(58, 40, 5, 1, '#4a3a2e'), glyphs(58, 50, 4, 1, '#4a3a2e'), at(92, 104, 1, ellipse(0, -10, 14, 9, C.white, C.ink, 1.4), ...[-8, -2, 4, 9].map((cx) => circle(cx, -16, 4, C.white, C.ink, 1)), ellipse(14, -14, 5, 4, '#3d3f4a', C.ink, 1), line('M-8 -2 L-8 6 M8 -2 L8 6', C.ink, 2)), arrow(80, 82, 70, 68, HL, 2), ground),
  'jud.rabbin': all(rabbi(40, 0.95, 'smile'), reach(40, 0.95, 1, 62, 66, C.black), at(66, 66, 0.7, openBook(0, 0, 1)), fig(84, C.orange, 'smile', { h: 0.55 }), fig(104, C.green, 'smile', { h: 0.5, hairStyle: 'long' }), qMark(92, 50, 1.2), ground),
  'jud.Talmud': all(rect(24, 14, 72, 84, PARCH, 2, C.ink, 1.6), rect(46, 34, 28, 32, '#fff8e6', 1, C.ink, 1.2), ...[38, 44, 50, 56, 62].map((y) => line(`M50 ${y} L70 ${y}`, C.ink, 1.6)),
    ...[20, 26, 72, 78, 84, 90].map((y) => line(`M30 ${y} L90 ${y}`, '#8a7a62', 1)), ...[34, 40, 46, 52, 58, 64].map((y) => all(line(`M30 ${y} L42 ${y}`, '#8a7a62', 1), line(`M78 ${y} L90 ${y}`, '#8a7a62', 1))),
    bust(14, 100, C.dark, 1, bkip()), bust(106, 100, C.navy, 1, bkip('#7a2747')), say(16, 72, 14, 12, 14, 90, qMark(16, 72, 0.8)), say(104, 72, 14, 12, 106, 90, qMark(104, 72, 0.8))),
  'jud.kommentar.2': all(rect(30, 18, 60, 80, C.white, 2, C.ink, 1.4), ...[30, 38, 46, 54, 62, 70, 78, 86].map((y) => line(`M36 ${y} L84 ${y}`, GREY, 1.4)), rect(34, 43, 52, 6, 'none', 1, HL, 1.6),
    rect(92, 28, 24, 26, '#fff4c8', 2, C.ink, 1.2), ...[34, 40, 46].map((y) => line(`M96 ${y} L112 ${y}`, C.navy, 1.2)), line('M86 46 L92 41', HL, 1.6),
    rect(4, 60, 24, 26, '#fff4c8', 2, C.ink, 1.2), ...[66, 72, 78].map((y) => line(`M8 ${y} L24 ${y}`, C.navy, 1.2)), rect(34, 67, 40, 6, 'none', 1, HL, 1.6), line('M34 70 L28 72', HL, 1.6)),
  // 2143 Synagoga och sabbat
  'jud.synagoga': all(synagogue(60, 112, 1.2), ground),
  'jud.kantor': all(man(48, 0.95, C.navy, 'laugh', tallitL()), rect(78, 74, 26, 6, WOOD, 1, C.ink, 1.3), line('M91 80 L91 112', WOOD, 3), at(91, 72, 0.5, openBook(0, 0, 1)), note(70, 30, 1), note(86, 18, 0.9, BLUE), note(100, 34, 0.8), ground),
  'jud.toraskåp': all(rect(28, 26, 64, 86, WOOD, 2, C.ink, 1.6), rect(34, 32, 52, 74, '#4a2a1a', 1, C.ink, 1.2), ...[44, 60, 76].map((x) => dressed(x, 102, 0.62)), path('M34 32 L22 30 L22 108 L34 106 Z', WOOD2, C.ink, 1.2), path('M86 32 L98 30 L98 108 L86 106 Z', WOOD2, C.ink, 1.2),
    line('M60 6 L60 14', C.ink, 1.2), path('M54 14 L66 14 L63 22 L57 22 Z', C.silver, C.ink, 1.1), flame(60, 24, 0.6), ground),
  'jud.menora': all(circle(60, 56, 46, GLOW, null), menorah(60, 106, 1.25, true), ground),
  'jud.davidsstjärna': all(path('M30 12 C40 40 80 40 90 12', 'none', GOLD, 1.6), star6(60, 66, 30, BLUE, 6), star6(60, 66, 30, '#6aa0e0', 2.4)),
  'jud.kippa': all(circle(60, 66, 32, C.skin, C.ink, 2), path('M30 60 C28 30 92 30 90 60 C82 46 38 46 30 60 Z', '#4a3a2e', C.ink, 1.6), path('M40 46 C42 24 78 24 80 46 Z', BLUE, C.ink, 2), path('M46 38 C54 32 66 32 74 38', 'none', GOLD, 1.6),
    circle(48, 68, 2.4, C.ink, null), circle(72, 68, 2.4, C.ink, null), path('M50 82 Q60 90 70 82', 'none', C.ink, 1.8), circle(60, 34, 18, 'none', HL, 2)),
  'jud.bönbok': all(man(42, 0.95, C.navy, 'calm'), reach(42, 0.95, 1, 72, 64, C.navy), at(80, 62, 1.2, openBook(0, 0, 1, true)), book(100, 98, 0.7, VELVET, star6(0, 0, 5, GOLD, 1.3)), ground),
  'jud.sabbat': all(rect(76, 10, 36, 32, NIGHT, 2, C.ink, 1.4), path('M100 18 A7 7 0 1 0 104 32 A6 6 0 1 1 100 18 Z', '#f6e7a1', null), sparkle(84, 18, 2.4, '#f6e7a1'), sparkle(90, 30, 2, '#f6e7a1'),
    table(86), stick(22, 86, 1.3, true), stick(40, 86, 1.3, true), challah(70, 80, 0.62, true), wineCup(98, 86, 1.2), ground),
  'jud.challa': all(ellipse(60, 92, 50, 10, '#e6d3b3', C.ink, 1.4), challah(60, 80, 1.8), ground),
  // 2144 Judiska högtider
  'jud.rosh-hashana': all(table(88), path('M22 86 C14 70 30 62 38 70 C46 62 60 70 52 86 Z', C.red, C.ink, 1.5), line('M37 70 L39 62', WOOD2, 2), path('M40 64 C46 60 50 64 48 66 C44 66 42 66 40 64 Z', LEAF, C.ink, 1),
    path('M64 86 L64 70 C64 66 84 66 84 70 L84 86 Z', '#f2b33a', C.ink, 1.5), rect(66, 62, 16, 6, '#c98a2a', 1, C.ink, 1.1), line('M70 70 L70 80', '#c98a2a', 2),
    path('M60 40 C70 30 92 26 108 40 C104 44 100 46 96 44 C86 36 74 38 64 46 Z', '#e8d4a8', C.ink, 1.5), ...[0, 1, 2].map((i) => line(`M${70 + i * 10} ${34 - i} L${72 + i * 10} ${40 - i}`, '#b8a070', 1)), note(26, 30, 0.9), note(42, 20, 0.7, BLUE)),
  'jud.jom-kippur': all(fig(36, '#f6f3ea', 'calm', { h: 0.92, bottom: '#f6f3ea' }), on(36, 0.92, kippahL('#f6f3ea'), tallitL()), at(84, 72, 1, ellipse(0, 0, 16, 5, C.white, C.ink, 1.4)), no(84, 70, 14), at(104, 90, 1, path('M-5 -14 L5 -14 L4 0 L-4 0 Z', 'rgba(220,240,252,0.6)', C.ink, 1.2)), no(104, 84, 8), glow(24, 18, 6), ground),
  'jud.sukkot': all(rect(16, 50, 88, 62, '#f0e2c0', 0, C.ink, 1.4), line('M10 50 L110 50', LEAF2, 6), ...[18, 30, 44, 58, 72, 86, 100].map((x) => path(`M${x - 8} 52 C${x - 4} 42 ${x + 4} 42 ${x + 8} 52`, LEAF, C.ink, 1)), rect(10, 6, 100, 38, NIGHT, 0, null), sparkle(30, 20, 3, '#f6e7a1'), sparkle(72, 14, 3, '#f6e7a1'), sparkle(96, 28, 2.4, '#f6e7a1'),
    line('M16 50 L16 112 M104 50 L104 112', WOOD, 3), table(92, 26, 94), bust(40, 82, C.denim, 1, bkip()), bust(60, 80, '#c96b8a', 1), bust(80, 82, C.green, 0.9), circle(36, 60, 3, C.orange, C.ink, 0.8), circle(84, 60, 3, C.red, C.ink, 0.8), ground),
  'jud.lövhydda': all(rect(30, 52, 60, 60, '#f0e2c0', 0, C.ink, 1.4), line('M24 52 L96 52', LEAF2, 6), ...[32, 46, 60, 74, 88].map((x) => path(`M${x - 9} 54 C${x - 5} 42 ${x + 5} 42 ${x + 9} 54`, LEAF, C.ink, 1)), line('M30 52 L30 112 M90 52 L90 112', WOOD, 3),
    ...[[42, 62, C.orange], [56, 64, C.red], [70, 62, SAMI_Y], [80, 66, LEAF]].map(([x, y, c]) => all(line(`M${x} 54 L${x} ${+y! - 3}`, C.ink, 0.8), circle(+x!, +y!, 3.4, c as string, C.ink, 0.8))), greyed(house(110, 112, 0.6)), ground),
  'jud.pesach': all(path('M18 112 L18 74 M18 86 L8 76 M18 80 L28 68', 'none', WOOD2, 3), ...[[8, 74], [28, 66], [18, 70], [12, 64], [24, 78], [30, 74]].map(([x, y]) => circle(x!, y!, 4.6, C.pink, C.ink, 0.8)),
    rect(40, 30, 76, 66, C.white, 3, C.ink, 1.5), rect(40, 30, 76, 14, '#7fbf6a', 3, C.ink, 1.5), at(78, 22, 0.7, matzah(0, 0, 1)),
    ...Array.from({ length: 8 }, (_, i) => { const x = 46 + (i % 4) * 17, y = 50 + Math.floor(i / 4) * 22; return all(rect(x, y, 14, 18, '#ffe27a', 2, C.ink, 1.1),
      `<text x="${x + 7}" y="${y + 13}" font-family="system-ui,sans-serif" font-weight="800" font-size="10" text-anchor="middle" fill="${C.ink}">${i + 1}</text>`); }), ground),
  'jud.uttåget-ur-Egypten': all(rect(4, 70, 112, 42, SAND, 0, null), path('M4 30 L34 30 L34 112 L4 112 Z', '#6aaed6', C.ink, 1.4), path('M86 30 L116 30 L116 112 L86 112 Z', '#6aaed6', C.ink, 1.4),
    path('M34 30 C30 50 38 70 34 112 M86 30 C90 50 82 70 86 112', 'none', '#3f86c0', 2), ...[0, 1, 2, 3].map((i) => path(`M8 ${40 + i * 18} q6 -4 12 0 q6 4 12 0 M88 ${40 + i * 18} q6 -4 12 0 q6 4 12 0`, 'none', C.white, 1.4)),
    ...[[50, 0.36, C.denim], [60, 0.4, '#c96b3c'], [70, 0.34, C.purple]].map(([x, h, c]) => fig(+x!, c as string, 'smile', { h: +h! })), arrow(60, 64, 60, 36, HL, 2.4), greyed(path('M44 24 L56 8 L68 24 Z', '#d9b56e', C.ink, 1.2)), ground),
  'jud.osyrat-bröd': all(at(36, 72, 1.8, matzah(0, 0, 1)), greyed(loaf(92, 78, 1.6)), no(92, 72, 18), ground),
  'jud.sedermåltid': all(table(80), ellipse(50, 74, 26, 8, C.white, C.ink, 1.4), ...[[38, 72, LEAF], [50, 70, '#c98a5a'], [62, 72, C.red], [44, 77, '#e6d3b3'], [56, 77, '#f2b33a']].map(([x, y, c]) => circle(+x!, +y!, 3.4, c as string, C.ink, 0.8)),
    at(16, 76, 0.6, matzah(0, 0, 1)), wineCup(86, 80, 1), wineCup(102, 80, 1), bust(30, 50, C.denim, 1.2, bkip()), bust(96, 52, C.green, 0.9), say(96, 26, 16, 14, 96, 44, qMark(96, 26, 1)), ground),
  'jud.chanukka': all(rect(6, 8, 108, 70, NIGHT, 3, C.ink, 1.4), line('M60 8 L60 78 M6 44 L114 44', '#5a6a8a', 2), hanukkiah(60, 78, 1.1, 8), rect(4, 78, 112, 6, '#d6c6a8', 1, C.ink, 1.4),
    at(24, 104, 1, path('M-8 -8 L8 -8 L8 2 L0 10 L-8 2 Z', '#3f86c0', C.ink, 1.3), line('M0 -8 L0 -14', C.ink, 2)), at(92, 102, 1, ellipse(0, 0, 12, 7, '#d0893a', C.ink, 1.3), ellipse(0, -3, 4, 2, C.red, null)), ground),
  'jud.purim': all(fig(30, '#7a5aa8', 'laugh', { h: 0.7, hairStyle: 'long' }), on(30, 0.7, path('M-10 -66 L-10 -76 L-5 -70 L0 -78 L5 -70 L10 -76 L10 -66 Z', GOLD, C.ink, 1.2)),
    fig(66, C.red, 'laugh', { h: 0.62 }), on(66, 0.62, path('M-10 -60 L10 -60 L9 -55 L-9 -55 Z', C.black, null), circle(-4, -57, 1.8, C.white, null), circle(4, -57, 1.8, C.white, null), path('M-6 -74 L0 -88 L6 -74 Z', SAMI_Y, C.ink, 1.2)),
    at(98, 66, 1, lo('M0 0 L0 20', WOOD, 3), rect(-4, -14, 14, 14, SAMI_Y, 2, C.ink, 1.2), line('M3 -14 L3 0', C.ink, 1)), line('M108 54 l6 -4 M110 62 l6 0 M108 70 l6 4', HL, 1.6), sparkle(50, 22, 3, C.pink), sparkle(86, 28, 3, SAMI_Y), ground),
  // 2145 Sikhism
  'jud.sikhism': all(circle(60, 54, 44, GLOW, null), khanda(60, 58, 1.5, BLUE)),
  'jud.sikh': all(sikhMan(60, 1.05, C.white, '#e8732c', 'smile'), on(60, 1.05, kara(-17.5, -8, 4.6)), ground),
  'jud.gurdwara': all(rect(4, 96, 112, 16, '#bfe3f5', 0, null), rect(26, 50, 68, 46, C.white, 1, C.ink, 1.6), path('M60 50 C48 44 50 26 60 18 C70 26 72 44 60 50 Z', GOLD, C.ink, 1.4), line('M60 18 L60 10', C.ink, 1.2),
    goldDome(30, 50, 0.9), goldDome(90, 50, 0.9), path('M52 96 L52 78 C52 72 68 72 68 78 L68 96 Z', GOLD, C.ink, 1.2), ...[36, 80].map((x) => path(`M${x} 88 L${x} 74 C${x} 70 ${x + 6} 70 ${x + 6} 74 L${x + 6} 88 Z`, '#9fc3e0', C.ink, 1)),
    line('M110 96 L110 14', C.ink, 2), path('M110 14 L110 36 L92 25 Z', SAFF, C.ink, 1.2), ground),
  'jud.turban': all(greyed(fig(30, C.grey, 'smile', { h: 0.85 })), sikhMan(78, 1, '#3f6fb5', '#2f5fa8', 'smile'), on(78, 1, circle(0, -66, 16, 'none', HL, 2)), ground),
  'jud.oklippt': all(greyed(fig(28, C.grey, 'smile', { h: 0.82 }), scissors(46, 30, 1.2)), fig(82, '#e8732c', 'smile', { h: 0.92, skin: '#c98b5e', hairStyle: 'long', hair: '#2b2a33' }),
    on(82, 0.92, path('M-11 -56 C-16 -30 -12 -6 -8 4 L8 4 C12 -6 16 -30 11 -56 Z', '#2b2a33', C.ink, 1.4), circle(0, -55, 8.6, '#c98b5e', null), circle(-3.4, -56, 1.2, C.ink, null), circle(3.4, -56, 1.2, C.ink, null), line('M-3 -51.5 Q0 -49 3 -51.5', C.ink, 1.3), path('M-10 -58 C-10 -72 10 -72 10 -58 C6 -63 -6 -63 -10 -58 Z', '#2b2a33', C.ink, 1.4)),
    at(104, 40, 1.2, scissors(0, 0, 1)), no(104, 42, 12), ground),
  'jud.langar': all(rect(4, 100, 112, 12, '#e6d3b3', 0, null), ...[[14, C.denim, ''], [36, '#c96b8a', 'scarf'], [58, C.green, 'turban'], [80, C.orange, '']].map(([x, c, hat]) => all(sit(+x!, 104, 0.6, c as string, { hat: hat === 'turban' ? g('translate(0 4)', turbanL('#2f5fa8')) : hat === 'scarf' ? g('translate(0 4)', scarfL('#7a5aa8')) : '' }), at(+x!, 106, 1, ellipse(0, 0, 8, 2.6, C.silver, C.ink, 1), ellipse(0, -1, 5, 1.4, '#e8a64a', null)))),
    sikhMan(106, 0.7, C.white, SAFF, 'smile'), at(88, 40, 1, path('M-10 -6 L10 -6 L8 8 L-8 8 Z', C.silver, C.ink, 1.3), line('M-6 -10 C-3 -14 -7 -16 -4 -20 M2 -10 C5 -14 1 -16 4 -20', GREY, 1.2)), reach(106, 0.7, -1, 96, 44, C.white, '#c98b5e')),
  // 2146 Traditionella afrikanska religioner
  'jud.skapargud': all(divine(60, 26, 1.2), arrow(48, 40, 26, 64, HL, 2), arrow(60, 44, 60, 66, HL, 2), arrow(72, 40, 94, 64, HL, 2), circle(22, 82, 12, '#cfe6f5', C.ink, 1.4), path('M14 78 C20 72 26 76 28 82 C24 88 16 88 14 78 Z', '#b9d9a5', null), tree(60, 0.6), at(96, 100, 1, ellipse(0, -8, 12, 6, '#c98a5a', C.ink, 1.2), line('M-8 -4 L-8 4 M8 -4 L8 4', C.ink, 2), circle(12, -14, 4, '#c98a5a', C.ink, 1)), ground),
  'jud.andevärld': all(ellipse(60, 34, 54, 28, '#e6dcf5', '#7a5aa8', 1.6), ellipse(60, 34, 54, 28, 'none', C.white, 1.2), wisp(26, 34, 0.9, '#c7b3e6'), wisp(46, 22, 0.8, '#c7b3e6'), wisp(66, 38, 0.9, '#c7b3e6'), wisp(88, 26, 0.85, '#c7b3e6'), sparkle(36, 46, 2.4, GOLD), sparkle(78, 48, 2.4, GOLD), sparkle(100, 38, 2, GOLD),
    line('M60 64 L60 76', '#7a5aa8', 1.6, '3 3'), arrow(52, 74, 52, 64, '#7a5aa8', 1.6), arrow(68, 64, 68, 74, '#7a5aa8', 1.6),
    house(26, 112, 1.2), tree(96, 0.65), fig(62, C.denim, 'smile', { h: 0.36 }), ground),
  'jud.vörda': all(circle(60, 52, 22, GLOW, null), rays(60, 52, 20, 28, 12), at(60, 106, 0.85, rect(-16, -12, 32, 12, WOOD, 2, C.ink, 1.3)),
    sit(60, 94, 0.8, '#7a5aa8', { skin: '#8d5a3a', mood: 'smile', hat: path('M-10 -54 C-10 -66 10 -66 10 -54 C6 -59 -6 -59 -10 -54 Z', '#e8e8e8', C.ink, 1.2) }),
    ...[[8, 1], [112, -1]].map(([x, d]) => g(`translate(${x} 112) scale(${0.62 * d!} 0.62)`, lo('M-2 0 L-2 -26', '#3d3f4a', 8), path('M-8 -30 L4 -24 L26 -36 L18 -46 Z', d! > 0 ? '#c96b3c' : '#2f8a6a', C.ink, 1.6), circle(30, -40, 8, '#a8704a', C.ink, 1.6), path('M24 -46 C28 -52 38 -48 37 -40 C34 -44 28 -46 24 -46 Z', C.hair, C.ink, 1.2), lo('M18 -40 L22 -22', d! > 0 ? '#c96b3c' : '#2f8a6a', 5), circle(22, -21, 2.8, '#a8704a', C.ink, 1))), ground),
  'jud.mask': all(path('M60 10 C86 10 90 40 86 66 C82 90 72 104 60 108 C48 104 38 90 34 66 C30 40 34 10 60 10 Z', '#a8743f', C.ink, 2.2), path('M44 44 C48 38 56 40 56 46 C52 50 46 50 44 44 Z M76 44 C72 38 64 40 64 46 C68 50 74 50 76 44 Z', '#3d2a1a', C.ink, 1.2),
    path('M60 50 L56 74 L64 74 Z', '#8a5a2e', C.ink, 1.2), path('M50 86 C56 90 64 90 70 86', 'none', '#3d2a1a', 2.4), ...[24, 30].map((y) => path(`M44 ${y} L52 ${y - 4} L60 ${y} L68 ${y - 4} L76 ${y}`, 'none', C.white, 1.8)), path('M40 66 L46 62 M80 66 L74 62 M40 72 L46 68 M80 72 L74 68', 'none', C.white, 1.6), ...[10, 16, 22].map((d) => line(`M${60 - d} ${104 - d * 0.2} L${60 - d - 2} 116 M${60 + d} ${104 - d * 0.2} L${60 + d + 2} 116`, '#d9b56e', 2))),
  // 2147 Ursprungliga religiösa traditioner
  'jud.ursprunglig': all(at(22, 70, 1, path('M-14 0 C-18 -18 -4 -22 0 -16 C4 -22 18 -18 14 0 C12 12 4 16 0 14 C-4 16 -12 12 -14 0 Z', C.red, C.ink, 1.6), line('M0 -16 L2 -24', WOOD2, 2), path('M2 -22 C8 -28 12 -24 10 -21 C6 -20 4 -20 2 -22 Z', LEAF, C.ink, 1)), circle(22, 70, 25, 'none', HL, 2.4),
    arrow(48, 70, 58, 70, GREY, 1.8), greyed(at(70, 70, 0.9, path('M-14 0 C-18 -18 -4 -22 0 -16 C4 -22 18 -18 14 0 C12 12 4 16 0 14 C-4 16 -12 12 -14 0 Z', C.red, C.ink, 1.6), path('M14 -10 C6 -8 6 4 14 4 Z', '#fbf4e6', C.ink, 1.4), line('M0 -16 L2 -24', WOOD2, 2)),
      at(102, 70, 0.9, path('M-6 -14 C-2 -10 -2 10 -6 14 L6 14 C2 10 2 -10 6 -14 Z', '#fbf4e6', C.ink, 1.4), path('M-8 -16 C-6 -20 6 -20 8 -16 Z M-8 16 C-6 20 6 20 8 16 Z', C.red, C.ink, 1.2), line('M0 -18 L1 -24', WOOD2, 2))), arrow(82, 70, 90, 70, GREY, 1.8), ground),
  'jud.animism': all(fig(22, '#8a6a48', 'calm', { h: 0.78 }), circle(34, 46, 2, C.white, C.ink, 1), circle(40, 38, 3, C.white, C.ink, 1.1), ellipse(78, 36, 38, 30, C.white, C.ink, 1.6),
    at(58, 50, 0.45, rect(-3, -22, 6, 22, WOOD, 1, C.ink, 1.2), circle(0, -32, 14, LEAF, C.ink, 1.4)), heart(58, 30, 0.5), at(80, 54, 0.8, path('M-12 0 C-14 -12 -5 -16 3 -15 C12 -13 14 -5 12 0 Z', STONE2, C.ink, 1.3)), heart(80, 44, 0.5),
    at(98, 32, 0.7, ellipse(0, 0, 10, 5, '#6aaed6', C.ink, 1.2), path('M9 0 L15 -4 L15 4 Z', '#6aaed6', C.ink, 1), circle(-5, -1, 1, C.ink, null)), heart(98, 22, 0.5), at(76, 20, 0.6, ellipse(0, 0, 12, 6, '#c98a5a', C.ink, 1.2), circle(12, -6, 4, '#c98a5a', C.ink, 1)), heart(78, 12, 0.45), ground),
  'jud.besjälad': all(greyed(at(30, 112, 1.1, path('M-22 0 C-26 -24 -10 -34 4 -32 C20 -30 26 -14 22 0 Z', STONE2, C.ink, 1.6))), circle(88, 82, 26, GLOW, null), rays(88, 82, 26, 34, 12),
    at(88, 112, 1.1, path('M-22 0 C-26 -24 -10 -34 4 -32 C20 -30 26 -14 22 0 Z', '#c9b38a', C.ink, 1.6)), heart(88, 96, 1, '#f08aa0'), circle(88, 94, 9, 'none', GOLD, 1.4), ground),
  'jud.schaman': all(fig(44, '#8a6a48', 'calm', { h: 0.95, bottom: '#6e5236' }), on(44, 0.95, ...[-12, -6, 0, 6, 12].map((x) => line(`M${x} -2 L${x} 6`, '#6e5236', 1.6)), path('M-11 -62 C-11 -72 11 -72 11 -62 Z', '#c8372d', C.ink, 1.1)),
    at(78, 64, 1, circle(0, 0, 15, '#e6c79a', C.ink, 1.6), circle(0, 0, 12, 'none', '#a0703a', 1)), reach(44, 0.95, 1, 70, 66, '#8a6a48'), reach(44, 0.95, -1, 24, 58, '#8a6a48'), lo('M24 58 L18 46', WOOD, 2), line('M90 52 l6 -4 M92 62 l7 0 M90 72 l6 4', HL, 1.6), wisp(96, 26, 1), wisp(22, 24, 0.8), ground),
  'jud.trans': all(fig(44, '#c96b3c', 'calm', { h: 0.95 }), on(44, 0.95, path('M0 -82 C6 -82 6 -76 0 -76 C-8 -76 -8 -88 0 -88 C10 -88 10 -72 0 -72 C-12 -72 -12 -92 0 -92', 'none', '#7a5aa8', 2)),
    fig(98, C.green, 'shock', { h: 0.82 }), reach(98, 0.82, -1, 70, 30, C.green), line('M66 22 l-4 -4 M64 30 l-6 0 M66 38 l-4 4', HL, 1.6), qMark(104, 18, 1.4), ground),
  'jud.same': all(samiFig(48, 1, 'smile'), reindeer(80, 112, 0.9), ground),
  'jud.samisk': all(at(24, 96, 1.05, path('M-14 -16 L14 -16 C14 0 8 8 0 8 C-8 8 -14 0 -14 -16 Z', '#b07a3e', C.ink, 1.6), path('M14 -14 C24 -14 24 -2 12 -2', 'none', C.ink, 3), path('M14 -14 C24 -14 24 -2 12 -2', 'none', '#b07a3e', 1.6), line('M-13 -12 L13 -12', SAMI_R, 2.4), line('M-12 -9 L12 -9', SAMI_Y, 1.4)),
    at(72, 108, 1.05, path('M-14 0 L-14 -26 L4 -26 L4 -10 L16 -8 C22 -8 22 -2 18 0 Z', '#d9b07a', C.ink, 1.6), path('M18 -2 C22 -8 22 -14 18 -14', 'none', C.ink, 1.6), line('M-14 -22 L4 -22', SAMI_R, 2.6), line('M-14 -18 L4 -18', SAMI_Y, 1.4), line('M-14 -15 L4 -15', SAMI_G, 1.4), line('M-14 -12 L4 -12', SAMI_B, 1.6)),
    at(100, 70, 1, path('M-14 6 C-14 -18 14 -18 14 6 Z', SAMI_B, C.ink, 1.6), rect(-15, 2, 30, 6, SAMI_R, 1, C.ink, 1.2), line('M-15 5 L15 5', SAMI_Y, 1.4), path('M-8 -10 L8 -10', 'none', SAMI_G, 1.4)),
    rect(4, 30, 60, 8, SAMI_R, 1, C.ink, 1), line('M4 32 L64 32', SAMI_Y, 1.4), line('M4 35 L64 35', SAMI_G, 1.4), ...[10, 22, 34, 46, 58].map((x) => path(`M${x - 4} 34 L${x} 31 L${x + 4} 34 L${x} 37 Z`, SAMI_B, null)), ground),
  'jud.nåjd': all(rect(4, 4, 112, 50, NIGHT, 0, null), path('M10 30 C30 14 50 34 70 18 C86 8 100 22 112 14', 'none', '#7fe0a8', 4), path('M14 40 C34 26 54 44 74 30 C90 20 102 32 112 26', 'none', '#7fe0a8', 2),
    rect(4, 54, 112, 58, '#eef4f8', 0, null), samiFig(46, 0.95, 'calm'), at(80, 70, 1.3, samiDrum(0, 0, 1)), reach(46, 0.95, 1, 68, 72, SAMI_B), reach(46, 0.95, -1, 26, 60, SAMI_B), lo('M26 60 L20 50', '#c8b08a', 2.4), ground),
  'jud.offerplats': all(rect(4, 80, 112, 32, '#eef4f8', 0, null), path('M60 90 C70 82 100 84 116 88 L116 100 C96 102 74 100 60 90 Z', '#6aaed6', C.ink, 1.2), path('M14 112 C10 94 16 70 28 60 C36 54 46 58 50 70 C56 82 54 102 50 112 Z', STONE2, C.ink, 1.6), path('M28 66 C34 64 40 68 42 74', 'none', '#8d8470', 1.4),
    line('M56 112 L62 98 L58 92 M62 98 L68 94 M60 104 L66 106', '#c8b08a', 2.2), at(76, 110, 1, ellipse(0, 0, 7, 2.6, '#a8b8c8', C.ink, 1), path('M6 0 L10 -3 L10 3 Z', '#a8b8c8', C.ink, 0.8)), pine(102, 0.8), ground),
  'jud.jojk': all(samiFig(36, 0.95, 'laugh'), say(80, 40, 50, 40, 52, 56, all(mountain(76, 56, 16, 22, '#9ab0c0'), reindeer(90, 56, 0.35), note(64, 32, 0.6), note(98, 28, 0.6, BLUE))), ground),
  'jud.totempåle': all(rect(48, 26, 24, 86, WOOD, 2, C.ink, 1.6), path('M48 34 C30 26 20 30 14 22 C26 22 38 18 48 26 Z M72 34 C90 26 100 30 106 22 C94 22 82 18 72 26 Z', '#c8372d', C.ink, 1.3), path('M52 16 C52 6 68 6 68 16 L72 26 L48 26 Z', '#2f5fa8', C.ink, 1.4), path('M58 20 L60 28 L62 20 Z', SAMI_Y, C.ink, 1),
    ...[[50, '#2f8a6a'], [74, '#c8372d'], [96, '#2f5fa8']].map(([y, c]) => all(rect(50, +y! - 14, 20, 20, c as string, 2, C.ink, 1.2), circle(55, +y! - 7, 2.8, C.white, C.ink, 1), circle(65, +y! - 7, 2.8, C.white, C.ink, 1), circle(55, +y! - 7, 1.2, C.ink, null), circle(65, +y! - 7, 1.2, C.ink, null), rect(54, +y!, 12, 3, C.white, 1, C.ink, 0.8))), greyed(pine(22, 1), pine(100, 1.1)), ground),
};
