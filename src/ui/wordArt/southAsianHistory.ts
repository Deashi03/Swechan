/**
 * Historia & humaniora → Civilisationer & världsdelars historia → Sydasiens historia, 2421–2427 (0.41): the Indus
 * civilisation, the ancient Indian kingdoms, the Maurya and Gupta empires, the sultanates and the Mughals, colonial
 * India, the independence movements and the modern states of South Asia. Recurring signs: warm sand and brick
 * colours, a blue river, green fields, figures in kurta and turban or sari, white marble and gold for the courts,
 * and an orange highlight ring on the thing that the word names. Scripts are loose strokes that spell nothing;
 * flags are plain colour fields. Digits only; no words, no brands, no pointing fingers. Abstract words are small
 * symbolic scenes with a grey reference beside them as contrast.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { type Build } from './figures';
import { HL, arm, note } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const SKY = '#e4f1fa';
const SAND = '#ecd49a';
const SAND2 = '#d9b56e';
const GRASS = '#8cc96a';
const GRASS2 = '#6aa84f';
const RIVER = '#7dbbe3';
const RIVER2 = '#4a90c4';
const BRICK = '#c4703e';
const BRICK2 = '#9a5530';
const STONE = '#cfc6b4';
const MARBLE = '#f6f3ec';
const SAFFRON = '#ef8a3c';
const RED = '#c8372d';
const GOLD = C.gold;
const GREEN = '#2f8a6a';
const PAPER = '#f3e6c4';
const STORM = '#7d8794';
const WOOD = '#a0673d';
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);

// ── Scenery ──────────────────────────────────────────────────────────
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const field = (y = 96, col: string = GRASS) => rect(4, y, 112, 112 - y, col, 0, null);
const sunD = (x: number, y: number, r = 7) => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 6))} ${f1(y + Math.sin(a) * (r + 6))}`, GOLD, 2); }), circle(x, y, r, C.yellow, C.ink, 1.4));
const cloud = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', col, C.ink, 1.2));
const rain = (x: number, y: number, w = 30, len = 8, col = '#5aa7d6') => line(Array.from({ length: Math.floor(w / 5) }, (_, i) => `M${x + i * 5} ${y + (i % 2) * 3} l-3 ${len}`).join(' '), col, 1.5);
const waves = (x1: number, x2: number, y: number, col = RIVER2) => line(Array.from({ length: Math.floor((x2 - x1) / 10) }, (_, i) => `M${x1 + i * 10} ${y} q2.5 -2.5 5 0 t5 0`).join(' '), col, 1.1);
const tree = (x: number, y = 112, s = 1, col = '#5aa66a') => at(x, y, s, rect(-2.5, -18, 5, 18, C.brown, 1, C.ink, 1.2), circle(0, -26, 12, col, C.ink, 1.4), circle(-7, -20, 7, col, null), circle(7, -21, 7, col, null));
const crop = (x: number, y: number, s = 1, col = GRASS2) => at(x, y, s, line('M0 0 L0 -10 M0 -4 L-4 -8 M0 -6 L4 -10 M0 -8 L-3 -12', col, 1.4));
const deadCrop = (x: number, y: number, s = 1) => at(x, y, s, line('M0 0 L0 -7 L-4 -4 M0 -5 L4 -3', '#a08a5a', 1.4));
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.4);
const dash = (d: string, col: string = HL, w = 1.6, da = '3 3') => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-dasharray="${da}" stroke-linecap="round"/>`;
const ban = (x: number, y: number, r = 10, w = 2.6) => all(circle(x, y, r, 'none', C.red, w), line(`M${f1(x - r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r * 0.7)} ${f1(y - r * 0.7)}`, C.red, w));
const okC = (x: number, y: number, r = 7) => all(circle(x, y, r, '#3a9a5a', C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, f1(r * 0.24)));
const qmark = (x: number, y: number, s = 1, col: string = C.navy) => at(x, y, s, path('M-4 -6 C-4 -11 4 -11 4 -6 C4 -2 0 -2 0 2', 'none', col, 2.2), circle(0, 6, 1.4, col, null));

// ── Buildings and objects ────────────────────────────────────────────
/** A flat-roofed brick house with its base at (x, y). */
const brickHouse = (x: number, y: number, w = 22, h = 16, col: string = BRICK, door = true) => all(rect(x - w / 2, y - h, w, h, col, 1, C.ink, 1.3),
  line(Array.from({ length: Math.floor(h / 4) }, (_, i) => `M${x - w / 2} ${y - h + 4 + i * 4} L${x + w / 2} ${y - h + 4 + i * 4}`).join(' '), BRICK2, 0.6),
  rect(x - w / 2 - 1, y - h - 2.4, w + 2, 2.6, BRICK2, 0.5, C.ink, 1), door ? rect(x - 2.6, y - 7, 5.2, 7, '#5a3a24', 1, C.ink, 0.8) : '');
/** A ruined brick wall (broken top) with its base at (x, y). */
const ruin = (x: number, y: number, w = 22, h = 16) => all(path(`M${x - w / 2} ${y} L${x - w / 2} ${y - h} L${f1(x - w * 0.2)} ${y - h} L${f1(x - w * 0.1)} ${f1(y - h * 0.6)} L${f1(x + w * 0.15)} ${f1(y - h * 0.75)} L${f1(x + w * 0.25)} ${f1(y - h * 0.4)} L${x + w / 2} ${f1(y - h * 0.5)} L${x + w / 2} ${y} Z`, '#b9875e', C.ink, 1.3),
  line(Array.from({ length: Math.floor(h / 4) - 1 }, (_, i) => `M${x - w / 2} ${y - 4 - i * 4} L${f1(x + w * (i > 1 ? 0 : 0.5))} ${y - 4 - i * 4}`).join(' '), '#8a6040', 0.6));
const weeds = (pts: number[][]) => line(pts.map(([x, y]) => `M${x} ${y} l-2 -5 M${x} ${y} l0 -6 M${x} ${y} l2 -5`).join(' '), GRASS2, 1.2);
/** Abstract script signs in a row (they spell nothing). */
const signs = (x: number, y: number, n: number, step = 8, h = 8, col: string = C.ink, sw = 1.3) => {
  const forms = [
    (a: number) => `M${a} ${y} L${a} ${y - h} M${a - 2} ${y - h} L${a + 2} ${y - h}`,
    (a: number) => `M${a - 3} ${y - h / 2} C${a - 1} ${y - h} ${a + 3} ${y - h} ${a + 3} ${y - h / 2} C${a + 3} ${y} ${a - 1} ${y} ${a - 3} ${y - h / 2} L${a - 4} ${y - h + 1} M${a - 3} ${y - h / 2} L${a - 4} ${y - 1}`,
    (a: number) => `M${a - 3} ${y} L${a - 3} ${y - h} L${a + 3} ${y - h} L${a + 3} ${y} M${a - 3} ${y - h / 2} L${a + 3} ${y - h / 2}`,
    (a: number) => `M${a - 3} ${y} L${a} ${y - h} L${a + 3} ${y} M${a} ${y - h} L${a} ${y - h - 2}`,
    (a: number) => `M${a - 2} ${y} L${a - 2} ${y - h} M${a + 2} ${y} L${a + 2} ${y - h}`,
    (a: number) => `M${a} ${y} L${a} ${y - h} M${a - 3} ${y - h + 2} L${a + 3} ${y - h + 5} M${a + 3} ${y - h + 2} L${a - 3} ${y - h + 5}`,
    (a: number) => `M${a - 3} ${y - 1} C${a - 3} ${y - h} ${a + 3} ${y - h} ${a + 3} ${y - 1}`,
  ];
  return line(Array.from({ length: n }, (_, i) => forms[(i * 3 + n) % forms.length]!(x + i * step)).join(' '), col, sw);
};
/** Hanging-stroke script under a top line (looks like an Indian script but is no real writing). */
const hangScript = (x: number, y: number, w: number, col: string = C.ink) => all(line(`M${x} ${y} L${x + w} ${y}`, col, 1.3),
  line(Array.from({ length: Math.floor(w / 6) }, (_, i) => { const a = x + 2 + i * 6; return ['M A Y l0 6', 'M A Y c2.4 1 2.4 4 0 5', 'M A Y l2 3 l-2 3', 'M A Y m-1.6 0 l0 3.6 c0 2.4 3.2 2.4 3.2 0 l0 -3.6'][i % 4]!.replace('A', `${a}`).replace('Y', `${y}`); }).join(' '), col, 1.1));
const scroll = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x - w / 2, y - h / 2, w, h, PAPER, 1, C.ink, 1.3), rect(x - w / 2 - 2, y - h / 2 - 2, 4, h + 4, '#c9a86a', 2, C.ink, 1), rect(x + w / 2 - 2, y - h / 2 - 2, 4, h + 4, '#c9a86a', 2, C.ink, 1), inner);
const crown = (x: number, y: number, s = 1, col: string = GOLD) => at(x, y, s, path('M-8 4 L-9 -5 L-4 -1 L0 -7 L4 -1 L9 -5 L8 4 Z', col, C.ink, 1.2), circle(0, -1, 1.3, RED, null));
const coin = (x: number, y: number, r = 3) => all(circle(x, y, r, GOLD, C.ink, 0.9), circle(x, y, r * 0.5, 'none', '#b88a20', 0.7));
const flag = (x: number, y: number, col: string, col2: string | null = null, h = 30) => all(line(`M${x} ${y} L${x} ${y - h}`, C.dark, 1.6), rect(x, y - h, 18, 12, col, 0.5, C.ink, 1), col2 ? circle(x + 8, y - h + 6, 3, col2, null) : '');
/** A small domed building (mosque/tomb) with base at (x, y). */
const dome = (x: number, y: number, s = 1, col: string = MARBLE, domeCol: string = MARBLE) => at(x, y, s, rect(-14, -18, 28, 18, col, 1, C.ink, 1.3), path('M-10 -18 C-12 -32 12 -32 10 -18 Z', domeCol, C.ink, 1.3), line('M0 -30 L0 -35', C.ink, 1.2), path('M-4 0 L-4 -9 C-4 -13 4 -13 4 -9 L4 0 Z', '#7a6a58', C.ink, 1));
const minaret = (x: number, y: number, h = 40, col: string = MARBLE) => all(rect(x - 2.6, y - h, 5.2, h, col, 1, C.ink, 1.1), rect(x - 3.6, y - h * 0.62, 7.2, 2, col, 0.5, C.ink, 0.9), path(`M${x - 3} ${y - h} C${x - 3} ${y - h - 5} ${x + 3} ${y - h - 5} ${x + 3} ${y - h} Z`, col, C.ink, 1));
/** A tiny person icon (crowds), feet at (x, y). */
const tiny = (x: number, y: number, s = 1, col: string = C.denim) => at(x, y, s, circle(0, -11, 2.6, C.skin, C.ink, 0.7), path('M-3 -8 L3 -8 L3.5 -2 L2 -2 L2 0 L-2 0 L-2 -2 L-3.5 -2 Z', col, C.ink, 0.7));
/** A country shape (blob) centred at (x, y). */
const LAND_D = 'M-26 -20 C-14 -30 4 -26 14 -28 C26 -30 30 -16 26 -6 C34 2 28 16 18 20 C8 28 -6 26 -14 22 C-26 18 -32 6 -28 -4 C-32 -10 -30 -16 -26 -20 Z';
const land = (x: number, y: number, s = 1, col: string = GRASS, sw = 1.6) => at(x, y, s, path(LAND_D, col, C.ink, sw));

// ── People ───────────────────────────────────────────────────────────
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: f1(ty - 38 * s), sl: f1(x - 13 * s), sr: f1(x + 13 * s) }; };
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
/** Figures drawn standing at x = 60 on y = 112, placed with their feet at (x, y) and scaled by s. */
const stand = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s}) translate(-60 -112)`, ...k);
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
const turbanL = (col: string = C.white) => all(path('M-11 -59 C-13 -75 13 -75 11 -59 C6 -62 -6 -62 -11 -59 Z', col, C.ink, 1.3), path('M-10 -64 C-4 -68 4 -68 10 -64 M-8 -69 C-3 -72 3 -72 8 -69', 'none', 'rgba(0,0,0,0.18)', 1));
const beardL = (col: string = '#3b2f2f') => path('M-7.5 -53 C-7 -43 7 -43 7.5 -53 C4 -50 -4 -50 -7.5 -53 Z', col, C.ink, 1);
/** A long coat (kurta/sherwani) over the figure, knee length. */
const kurtaL = (col: string, trim: string | null = null) => all(path('M-13 -41 L13 -41 L16 24 L-16 24 Z', col, C.ink, 1.4), trim ? line('M0 -41 L0 24', trim, 1.4) : '');
const sariL = (col: string, border: string = GOLD) => all(path('M-13 -41 L13 -41 L17 48 L-17 48 Z', col, C.ink, 1.4), path('M-13 -41 L13 -12 L13 -2 L-13 -30 Z', col, C.ink, 1.1), line('M-13 -30 L13 -2 M-17 46 L17 46', border, 1.6));
/** A man in a long kurta and a turban. */
const tman = (x: number, h = 1, coat: string = C.white, turban: string = SAFFRON, mood: Mood = 'smile', beard = false) => all(fig(x, coat, mood, { h, bottom: '#e8e2d4' }), on(x, h, kurtaL(coat), turbanL(turban), beard ? beardL() : ''));
/** A woman in a sari. */
const sari = (x: number, h = 1, col: string = C.pink, mood: Mood = 'smile') => all(fig(x, col, mood, { h, bottom: col, hairStyle: 'long' }), on(x, h, sariL(col), circle(0, -60, 0.9, RED, null)));
/** A thin, bare-headed man in a white dhoti and shawl (independence era). */
const dhotiMan = (x: number, h = 1, mood: Mood = 'calm') => all(fig(x, C.white, mood, { h, bottom: C.white, hair: '#e8e2d4' }), on(x, h, path('M-13 -41 L13 -41 L12 2 L-12 2 Z', C.white, C.ink, 1.3), path('M-13 -41 L8 -41 L-10 -6 Z', '#f1ead8', C.ink, 1), circle(-3.4, -56, 2.6, 'none', C.ink, 0.9), circle(3.4, -56, 2.6, 'none', C.ink, 0.9), line('M-0.8 -56 L0.8 -56', C.ink, 0.9)));
// seated cross-legged figure, facing the viewer; local: ground 0, head centre (0, −52)
const sitL = (top: string, o: { head?: Svg; mood?: 'smile' | 'calm' | 'frown'; skin?: string; hair?: string } = {}) => all(
  path('M-24 0 C-24 -10 -12 -12 0 -10 C12 -12 24 -10 24 0 Z', '#e8e2d4', C.ink, 1.6),
  path('M-13 -36 L13 -36 C15 -24 16 -14 14 -8 L-14 -8 C-16 -14 -15 -24 -13 -36 Z', top, C.ink, 1.8),
  rect(-3.5, -43, 7, 7, o.skin ?? C.skin, 2, C.ink, 1.4), circle(0, -52, 10, o.skin ?? C.skin, C.ink, 1.8),
  path('M-10 -54 C-10 -66 10 -66 10 -54 C6 -59 -6 -59 -10 -54 Z', o.hair ?? C.hair, C.ink, 1.4),
  o.mood === 'calm' ? path('M-5.5 -52 Q-3.6 -55 -1.8 -52 M1.8 -52 Q3.6 -55 5.5 -52', 'none', C.ink, 1.2) : all(circle(-3.4, -52, 1.2, C.ink, null), circle(3.4, -52, 1.2, C.ink, null)),
  o.mood === 'frown' ? path('M-3 -46 Q0 -48.5 3 -46', 'none', C.ink, 1.2) : line('M-3 -47.5 Q0 -45 3 -47.5', C.ink, 1.2), o.head ?? '');
const sit = (x: number, y: number, s: number, top: string, o: { head?: Svg; mood?: 'smile' | 'calm' | 'frown'; skin?: string; hair?: string } = {}) => at(x, y, s, sitL(top, o));
const sTurban = (col: string) => g('translate(0 4)', turbanL(col));
const handS = (x: number, y: number, r = 3) => circle(x, y, r, C.skin, C.ink, 1.1);
const palm = (x: number, y: number, s = 1) => at(x, y, s, ...[-4.6, -1.6, 1.4, 4.4].map((d, i) => rect(d - 1.3, -9 + Math.abs(i - 1.5) * 1.2, 2.6, 9, C.skin, 1.3, C.ink, 0.9)), path('M-5.5 -1 L5.5 -1 L5 5 C4 8 -4 8 -5 5 Z', C.skin, C.ink, 1), path('M-5.4 1 L-9 -3 C-10 -4 -11 -2 -10 -1 L-5 5', C.skin, C.ink, 1));
/** A soldier's rifle, held upright (muzzle up), centred at x with butt at y. */
const rifle = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-1, -34, 2, 26, C.dark, 0.5, C.ink, 0.6), path('M-2 -8 L2 -8 L3 2 L-3 2 Z', WOOD, C.ink, 0.8));
const bowl = (x: number, y: number, s = 1, food = false) => at(x, y, s, path('M-8 -4 C-8 4 8 4 8 -4 Z', '#c9a86a', C.ink, 1.2), food ? path('M-7 -4 C-6 -8 6 -8 7 -4 Z', C.white, C.ink, 0.8) : line('M-6 -4 L6 -4', C.ink, 0.8));
const fire = (x: number, y: number, s = 1) => at(x, y, s, line('M-10 0 L10 -4 M-10 -4 L10 0', C.brown, 3.4), path('M0 -24 C7 -16 9 -8 5 -3 C3 -1 -3 -1 -5 -3 C-9 -8 -6 -16 0 -24 Z', C.orange, C.ink, 1.2), path('M0 -14 C3 -10 4 -6 2 -4 C1 -3 -1 -3 -2 -4 C-4 -6 -3 -10 0 -14 Z', C.yellow, null));

// ── Motifs ───────────────────────────────────────────────────────────
export const SOUTH_ASIAN_HISTORY_MOTIFS: Record<string, Svg> = {
  // 2421 Induskulturen
  'sydas.civilisation': all(bg(), field(84, GRASS),
    greyed(at(20, 84, 1, path('M-14 0 L0 -18 L14 0 Z', '#b08a5a', C.ink, 1.3), path('M-3 0 L-3 -7 L3 -7 L3 0 Z', '#5a3a24', null))),
    arrow(32, 70, 42, 70, HL, 2.6),
    rect(44, 70, 70, 14, STONE, 1, C.ink, 1.3), brickHouse(54, 70, 14, 12), brickHouse(70, 70, 14, 18), brickHouse(86, 70, 14, 12), brickHouse(102, 70, 14, 16),
    path('M66 52 L74 52 L72 44 L68 44 Z', BRICK2, C.ink, 1), at(60, 34, 1, rect(-6, -8, 12, 12, '#d8c39a', 1.5, C.ink, 1), signs(-3, 1, 2, 6, 6, C.ink, 1)),
    ...[50, 60, 70, 80, 90, 100, 110].map((x) => crop(x, 102, 0.9)), rect(44, 104, 70, 6, RIVER, 2, C.ink, 1), at(96, 40, 0.9, path('M-8 6 L8 6 M0 6 L0 -6 M-8 -6 L8 -6 M-8 -6 L-10 0 L-6 0 Z M8 -6 L6 0 L10 0 Z', 'none', C.ink, 1.3)),
    stand(80, 98, 0.32, tman(60, 1, C.white, SAFFRON)), stand(92, 98, 0.32, sari(60, 1, C.pink)), oval(79, 76, 37, 34)),
  'sydas.flodkultur': all(bg(), rect(4, 40, 112, 72, SAND, 0, null), sunD(98, 20, 6),
    path('M40 40 C30 60 70 70 54 86 C44 98 56 106 62 112 L84 112 C78 104 66 98 76 86 C92 68 52 58 60 40 Z', RIVER, C.ink, 1.4), waves(56, 76, 84), waves(52, 70, 100),
    rect(10, 60, 26, 16, GRASS, 1, C.ink, 1), rect(14, 82, 26, 16, GRASS, 1, C.ink, 1), rect(84, 66, 28, 16, GRASS, 1, C.ink, 1), rect(90, 88, 22, 14, GRASS, 1, C.ink, 1),
    ...[16, 22, 28, 20, 26, 32].map((x, i) => crop(x, i < 3 ? 74 : 96, 0.7)), ...[90, 96, 102, 108].map((x) => crop(x, 80, 0.7)),
    brickHouse(22, 56, 12, 9), brickHouse(34, 56, 10, 12), brickHouse(96, 62, 12, 10),
    at(64, 70, 0.8, path('M-10 0 C-6 4 6 4 10 0 Z', WOOD, C.ink, 1), line('M0 0 L0 -12', WOOD, 1.2), path('M0 -12 L8 -4 L0 -4 Z', C.white, C.ink, 0.8)),
    path('M4 40 L20 32 L34 38 L50 30 L70 36 L90 30 L116 36 L116 40 L4 40 Z', SAND2, C.ink, 1)),
  'sydas.flodslätt': all(bg(), path('M4 52 L18 36 L32 50 L44 40 L52 52 Z', '#9aa88a', C.ink, 1.2), path('M76 52 L88 38 L100 48 L108 40 L116 50 L116 52 Z', '#9aa88a', C.ink, 1.2),
    rect(4, 52, 112, 60, GRASS, 0, null), path('M60 52 C40 62 84 72 52 84 C30 92 70 100 64 112 L80 112 C86 98 46 94 68 84 C96 72 52 64 70 52 Z', RIVER, C.ink, 1.3),
    ...[[18, 70], [28, 92], [94, 66], [102, 96], [12, 104], [90, 84]].map(([x, y]) => crop(x!, y!, 0.8)), brickHouse(24, 80, 10, 7), brickHouse(98, 78, 10, 7), tree(108, 66, 0.4), tree(14, 64, 0.4),
    line('M8 58 L112 58', HL, 2), path('M8 58 l5 -3 l0 6 Z M112 58 l-5 -3 l0 6 Z', HL, null)),
  'sydas.bevattning': all(bg(), field(60, '#c9a874'), rect(4, 60, 22, 52, RIVER, 0, C.ink, 1.2), waves(6, 24, 72), waves(6, 24, 92),
    rect(26, 76, 90, 7, RIVER, 0, C.ink, 1), rect(56, 83, 6, 29, RIVER, 0, C.ink, 1), rect(92, 83, 6, 29, RIVER, 0, C.ink, 1),
    ...[34, 42, 50, 68, 76, 84, 104, 110].flatMap((x) => [crop(x, 96, 0.9), crop(x, 108, 0.9)]),
    arrow(30, 79, 50, 79, '#1f6fae', 2.2), arrow(59, 86, 59, 100, '#1f6fae', 2.2), arrow(95, 86, 95, 100, '#1f6fae', 2.2),
    stand(80, 74, 0.5, tman(60, 1, C.white, SAFFRON), reach(60, 1, 1, 78, 70)), line('M70 54 L84 74', WOOD, 2), path('M80 72 L88 74 L86 78 Z', C.grey, C.ink, 0.8), sunD(100, 18, 6), oval(70, 90, 46, 20)),
  'sydas.skrift': all(bg('#f3ece2'), at(60, 62, 1, rect(-40, -34, 80, 60, '#d8c39a', 6, C.ink, 1.8), rect(-34, -28, 68, 48, '#cdb487', 4, null),
    signs(-28, -16, 8, 8, 9, C.ink, 1.6), signs(-28, 0, 8, 8, 9, C.ink, 1.6), signs(-28, 16, 6, 8, 9, C.ink, 1.6)),
    at(98, 102, 1, line('M-14 6 L6 -10', WOOD, 3), path('M6 -10 L10 -14 L9 -9 Z', C.dark, C.ink, 0.8)), oval(60, 62, 46, 38)),
  'sydas.dechiffrera': all(bg('#f3ece2'), rect(8, 30, 46, 46, '#d8c39a', 4, C.ink, 1.6), signs(14, 46, 4, 10, 9, C.ink, 1.6), signs(14, 66, 4, 10, 9, C.ink, 1.6),
    qmark(31, 22, 0.9), arrow(56, 52, 70, 52, HL, 2.6),
    rect(72, 30, 40, 46, C.white, 2, C.ink, 1.4), signs(78, 46, 1, 8, 9, C.ink, 1.6), line('M86 42 L92 42', C.ink, 1), at(102, 42, 0.5, path('M-10 0 C-4 -6 6 -6 10 0 C6 6 -4 6 -10 0 Z M10 0 L16 -5 L16 5 Z', RIVER2, C.ink, 1.4)),
    signs(78, 64, 1, 8, 9, C.ink, 1.6), line('M86 60 L92 60', C.ink, 1), at(102, 62, 0.45, circle(0, -6, 4, C.skin, C.ink, 1.4), line('M0 -2 L0 8 M-6 2 L6 2 M0 8 L-4 14 M0 8 L4 14', C.ink, 2)), okC(108, 28, 5),
    stand(34, 112, 0.42, tman(60, 1, C.denim, C.white, 'smile')), at(48, 90, 0.9, line('M7 7 L15 15', C.dark, 3.4), circle(0, 0, 9, 'rgba(180,220,245,0.45)', C.ink, 2))),
  'sydas.monsun': all(bg('#cdd5dd'), cloud(30, 22, 1.5, STORM), cloud(82, 18, 1.7, STORM), cloud(60, 32, 1.2, '#8f99a6'),
    rain(14, 40, 100, 10, '#3f86c4'), rain(12, 56, 100, 10, '#3f86c4'),
    arrow(8, 50, 36, 44, C.white, 3), path('M4 96 L116 96 L116 112 L4 112 Z', '#9bc3e0', null), waves(8, 112, 102), waves(12, 108, 108), field(96, 'rgba(140,201,106,0.35)'),
    ...[20, 34, 92, 104].map((x) => crop(x, 104, 0.9)), stand(62, 108, 0.5, sari(60, 1, '#d9a23a', 'calm')), at(60, 70, 1, path('M-16 0 C-16 -12 16 -12 16 0 Z', RED, C.ink, 1.3), line('M0 0 L0 16', C.dark, 1.4))),
  'sydas.övergiven': all(bg('#efe8da'), field(90, '#cbb98c'), greyed(at(16, 52, 0.55, brickHouse(0, 0, 22, 18), fig(16, C.denim, 'smile', { h: 0.5 }))),
    ruin(50, 96, 26, 26), ruin(84, 98, 30, 34), ruin(106, 90, 14, 14), path('M60 96 L72 96 L70 92 L62 92 Z', '#b9875e', C.ink, 1), circle(66, 102, 2.6, '#b9875e', C.ink, 0.8), circle(40, 104, 2, '#b9875e', C.ink, 0.8),
    weeds([[42, 98], [58, 100], [74, 100], [96, 100], [110, 96], [30, 106], [88, 108]]), tree(28, 96, 0.45, '#9cae6a'),
    path('M78 30 q3 -3 6 0 q3 -3 6 0', 'none', C.ink, 1.2), oval(78, 84, 38, 22)),
  // 2422 Antikens indiska riken
  'sydas.sanskrit': all(bg('#f6eedc'), at(60, 34, 1, rect(-46, -8, 92, 16, '#e8cf8e', 4, C.ink, 1.4), circle(-30, 0, 1.6, C.brown, null), circle(30, 0, 1.6, C.brown, null), hangScript(-40, -3, 22), hangScript(-22, -3, 20), hangScript(6, -3, 20), hangScript(26, -3, 14)),
    at(60, 56, 1, rect(-46, -8, 92, 16, '#e8cf8e', 4, C.ink, 1.4), hangScript(-40, -3, 30), hangScript(-6, -3, 34), hangScript(30, -3, 10)),
    sit(36, 112, 0.6, C.white, { head: sTurban(SAFFRON), mood: 'calm' }), sit(84, 112, 0.6, '#f3ead7', { head: sTurban('#e8732c'), mood: 'calm' }),
    note(56, 84, 0.8, C.navy), note(66, 76, 0.7, C.navy), oval(60, 45, 52, 22)),
  'sydas.hymn': all(bg('#f6e4c4'), field(98, '#d9b56e'), sunD(60, 20, 9), fire(60, 102, 1.1),
    sit(26, 112, 0.55, C.white, { head: g('translate(0 4)', circle(0, -62, 3, C.hair, null)), mood: 'calm' }), sit(94, 112, 0.55, C.white, { head: g('translate(0 4)', circle(0, -62, 3, C.hair, null)), mood: 'calm' }),
    note(30, 62, 0.9, C.navy), note(40, 50, 0.8, C.navy), note(86, 60, 0.9, C.navy), note(76, 48, 0.8, C.navy), arrow(42, 42, 52, 32, HL, 2), arrow(78, 42, 68, 32, HL, 2)),
  'sydas.brahman': all(bg('#f6e4c4'), field(98, '#d9b56e'), at(30, 104, 1, rect(-16, -6, 32, 6, BRICK, 1, C.ink, 1.2)), fire(30, 98, 0.8),
    fig(68, C.white, 'calm', { bottom: '#f1ead8', hair: C.skin }), on(68, 1, path('M-13 -41 L13 -41 L12 2 L-12 2 Z', C.skin, C.ink, 1.3), line('M-10 -40 L10 -4', C.white, 1.8), path('M-12 -2 L12 -2 L14 46 L-14 46 Z', '#f1ead8', C.ink, 1.3), circle(0, -67, 2.4, C.hair, null), line('M-3 -63 L3 -63 M-3 -62 L3 -62', RED, 0.8)),
    reach(68, 1, -1, 44, 78), at(42, 78, 0.8, path('M-6 -4 L6 -4 L4 4 L-4 4 Z', GOLD, C.ink, 1)), line('M38 82 L34 90', '#e9c46a', 1.6),
    at(100, 40, 1, path('M0 -22 L14 6 L-14 6 Z', C.grey2, C.ink, 1.2), path('M0 -22 L5 -12 L-5 -12 Z', SAFFRON, C.ink, 1), line('M-7 -6 L7 -6 M-10 0 L10 0', C.ink, 0.8)), ring(100, 22, 8)),
  'sydas.jainism': all(bg('#f4f1ea'), field(100, '#e0d4b4'), at(30, 46, 2.2, palm(0, 0, 1)), at(30, 46, 1, circle(0, 4, 5, 'none', RED, 1.6), line('M0 -1 L0 9 M-5 4 L5 4 M-3.5 0.5 L3.5 7.5 M3.5 0.5 L-3.5 7.5', RED, 0.9)),
    fig(80, C.white, 'calm', { bottom: C.white, hair: C.skin }), on(80, 1, path('M-13 -41 L13 -41 L16 46 L-16 46 Z', C.white, C.ink, 1.3), rect(-6, -54, 12, 6, C.white, 2, C.ink, 1)),
    reach(80, 1, -1, 62, 92), line('M62 92 L56 108', WOOD, 1.6), path('M50 108 C52 104 60 104 62 108 Z', '#e8dcc0', C.ink, 1),
    ...[[36, 108], [42, 107], [46, 109]].map(([x, y]) => all(ellipse(x!, y!, 1.6, 1, C.dark, null), ellipse(x! + 2, y!, 1.2, 0.9, C.dark, null))), ring(42, 106, 7)),
  'sydas.epos': all(bg('#f6eedc'), path('M8 96 L112 96 L112 108 L8 108 Z', PAPER, C.ink, 1.3), ...Array.from({ length: 8 }, (_, i) => hangScript(12 + i * 12.5, 100, 9)), rect(108, 92, 6, 20, '#c9a86a', 3, C.ink, 1),
    sit(26, 96, 0.5, SAFFRON, { head: sTurban(C.white), mood: 'smile' }),
    path('M44 14 L112 14 L112 66 L56 66 L46 74 L48 66 L44 66 Z', C.white, C.ink, 1.4),
    at(66, 56, 0.5, path('M-14 0 L14 0 L10 -10 L-10 -10 Z', WOOD, C.ink, 1.4), circle(-6, 2, 5, 'none', C.ink, 1.6), circle(8, 2, 5, 'none', C.ink, 1.6), path('M14 -6 L26 -12 L30 -2 L22 2 Z', '#d9c4a0', C.ink, 1.2)),
    at(96, 58, 0.36, fig(0, RED, 'angry', { h: 1 })), at(92, 30, 0.5, path('M0 -18 C10 -8 10 8 0 18', 'none', WOOD, 2.4), line('M0 -18 L0 18', C.ink, 0.8), line('M-12 0 L10 0', C.ink, 1.4)), sunD(58, 26, 5)),
  // 2423 Maurya- och Guptarikena
  'sydas.edikt': all(bg('#f3ead7'), field(96, '#d9c49a'), rect(70, 62, 46, 8, STONE, 1, C.ink, 1.2),
    tman(92, 0.8, '#7a3b8a', GOLD, 'calm'), on(92, 0.8, crown(0, -78, 1.1)), reach(92, 0.8, -1, 70, 48), scroll(62, 46, 18, 22, line('M56 40 L68 40 M56 45 L68 45 M56 50 L66 50', C.ink, 0.9)), circle(62, 60, 3, RED, C.ink, 0.8),
    stand(18, 112, 0.42, tman(60, 1, C.white, SAFFRON)), stand(36, 112, 0.42, sari(60, 1, C.pink)), stand(52, 112, 0.4, tman(60, 1, '#cfe3c6', C.white)),
    arrow(52, 32, 30, 22, HL, 2), arrow(62, 30, 62, 14, HL, 2), at(22, 18, 0.5, brickHouse(0, 0, 18, 12)), at(66, 10, 0.4, brickHouse(0, 0, 18, 12)), oval(62, 48, 14, 18)),
  'sydas.blomstra': all(bg(), field(92, GRASS),
    greyed(at(22, 92, 0.8, line('M0 0 L0 -26 C-2 -30 -8 -30 -10 -24 M0 -16 L8 -20', '#8a7a5a', 2), path('M-10 -24 C-14 -26 -14 -20 -10 -20', '#c0b090', C.ink, 1), rect(-12, -2, 24, 4, WOOD, 1, C.ink, 1))),
    at(78, 92, 1, line('M0 0 L0 -50 M0 -30 L-14 -40 M0 -20 L14 -32 M0 -40 L10 -52', '#4f8a3a', 2.6), ...[[0, -54], [-16, -42], [16, -34], [12, -56], [-8, -30]].map(([x, y]) => all(...[0, 72, 144, 216, 288].map((a) => g(`translate(${x} ${y}) rotate(${a})`, ellipse(0, -4, 2.6, 4, C.pink, C.ink, 0.8))), circle(x!, y!, 2, C.yellow, C.ink, 0.6)))),
    brickHouse(56, 108, 16, 12), brickHouse(100, 108, 16, 12), coin(48, 100, 3), coin(54, 98, 3), coin(106, 98, 3), arrow(112, 86, 112, 40, HL, 2.6), sparkle(96, 30, 4), sparkle(60, 30, 3)),
  'sydas.decimalsystem': all(bg('#f6f3ec'), ...[0, 1, 2].map((i) => all(rect(14 + i * 32, 18, 28, 54, C.white, 2, C.ink, 1.3))),
    at(28, 30, 1, rect(-8, -8, 16, 16, '#7fb3e0', 1, C.ink, 1), line('M-8 -4 L8 -4 M-8 0 L8 0 M-8 4 L8 4 M-4 -8 L-4 8 M0 -8 L0 8 M4 -8 L4 8', C.ink, 0.5)),
    at(28, 50, 1, rect(-8, -8, 16, 16, '#7fb3e0', 1, C.ink, 1), line('M-8 -4 L8 -4 M-8 0 L8 0 M-8 4 L8 4 M-4 -8 L-4 8 M0 -8 L0 8 M4 -8 L4 8', C.ink, 0.5)),
    circle(60, 44, 8, 'none', C.grey, 1.4), ...Array.from({ length: 7 }, (_, i) => rect(82 + (i % 4) * 6, 30 + Math.floor(i / 4) * 8, 5, 5, '#f2c14e', 1, C.ink, 0.8)),
    `<text x="28" y="96" font-family="system-ui,sans-serif" font-weight="800" font-size="24" text-anchor="middle" fill="${C.ink}">2</text>`,
    `<text x="60" y="96" font-family="system-ui,sans-serif" font-weight="800" font-size="24" text-anchor="middle" fill="${HL}">0</text>`,
    `<text x="92" y="96" font-family="system-ui,sans-serif" font-weight="800" font-size="24" text-anchor="middle" fill="${C.ink}">7</text>`,
    line('M10 102 L110 102', C.ink, 1.2), ring(60, 88, 11)),
  // 2424 Sultanat och mogulvälde
  'sydas.sultanat': all(bg(), land(60, 66, 1.55, '#e8d7a8', 1.8), dash('M20 66 C30 40 90 40 100 66 C90 92 30 92 20 66 Z', HL, 2, '4 3'),
    dome(40, 86, 0.6, '#efe6d2', GREEN), minaret(54, 88, 26), dome(84, 90, 0.5, '#efe6d2', GREEN),
    rect(48, 34, 24, 34, RED, 3, C.ink, 1.3), stand(60, 74, 0.42, tman(60, 1, '#2f6fb0', C.white, 'calm', true)), rect(44, 70, 32, 6, GOLD, 2, C.ink, 1.3)),
  'sydas.stormogul': all(bg('#f3e6c4'), at(60, 70, 1, ...Array.from({ length: 9 }, (_, i) => { const a = -Math.PI + (i / 8) * Math.PI; return all(line(`M0 0 L${f1(Math.cos(a) * 44)} ${f1(Math.sin(a) * 44)}`, GREEN, 2), circle(f1(Math.cos(a) * 44), f1(Math.sin(a) * 44), 5, '#2f6fb0', C.ink, 1), circle(f1(Math.cos(a) * 44), f1(Math.sin(a) * 44), 2, GOLD, null)); })),
    rect(28, 92, 64, 14, GOLD, 2, C.ink, 1.4), ...[36, 48, 60, 72, 84].map((x) => circle(x, 99, 2, RED, null)),
    tman(60, 0.95, '#e9d8a6', C.white, 'calm', true), on(60, 0.95, circle(0, -70, 3, RED, C.ink, 0.8), path('M1 -72 C4 -82 10 -86 8 -92', 'none', C.white, 2.6), line('M-8 -30 C-4 -24 4 -24 8 -30 M-9 -26 C-4 -19 4 -19 9 -26', C.white, 1.6), line('M-13 -10 L13 -10', GOLD, 2.4)),
    reach(60, 0.95, 1, 74, 70), circle(76, 66, 3, C.pink, C.ink, 0.8), line('M75 68 L74 72', GREEN, 1), ring(60, 46, 16)),
  'sydas.miniatyrmålning': all(bg('#efe6d2'), rect(20, 24, 62, 70, '#2f6fb0', 2, C.ink, 1.6), rect(24, 28, 54, 62, GOLD, 1, C.ink, 1), rect(28, 32, 46, 54, '#f3ead7', 1, C.ink, 1),
    ...Array.from({ length: 10 }, (_, i) => circle(26 + i * 5.6, 30, 1.2, RED, null)), ...Array.from({ length: 10 }, (_, i) => circle(26 + i * 5.6, 88, 1.2, RED, null)),
    rect(28, 70, 46, 16, '#a8c98a', 0, null), tree(36, 72, 0.38, '#3f7f52'), tree(66, 70, 0.32, '#3f7f52'),
    at(52, 74, 0.5, ellipse(0, -10, 12, 6, C.white, C.ink, 1), line('M-8 -6 L-9 4 M-4 -6 L-4 4 M5 -6 L5 4 M9 -6 L10 4', C.ink, 1.6), path('M10 -14 L18 -20 L20 -14 L14 -10 Z', C.white, C.ink, 1), circle(0, -24, 4, C.skin, C.ink, 1), path('M-4 -20 L4 -20 L4 -12 L-4 -12 Z', RED, C.ink, 0.8), path('M-4 -27 C-4 -32 4 -32 4 -27 Z', C.white, C.ink, 0.8)),
    sunD(64, 42, 3), at(98, 90, 1, line('M-6 14 L10 -24', WOOD, 2.4), path('M10 -24 L13 -32 L12 -23 Z', C.dark, C.ink, 0.8)), at(104, 54, 1, line('M6 6 L12 12', C.dark, 3), circle(0, 0, 8, 'rgba(180,220,245,0.45)', C.ink, 1.8)), ring(51, 59, 30)),
  'sydas.mausoleum': all(bg(), field(96, GRASS), rect(10, 92, 100, 6, MARBLE, 1, C.ink, 1.2), minaret(16, 92, 46), minaret(104, 92, 46),
    rect(30, 54, 60, 38, MARBLE, 1, C.ink, 1.4), path('M40 54 C34 22 86 22 80 54 Z', MARBLE, C.ink, 1.4), line('M60 28 L60 18', C.ink, 1.4), circle(60, 16, 2, GOLD, C.ink, 0.8),
    path('M44 92 L44 70 C44 60 76 60 76 70 L76 92 Z', '#3d3a46', C.ink, 1.3), rect(48, 80, 24, 10, '#e9e4d6', 2, C.ink, 1.1), line('M50 83 L70 83', GOLD, 1), ring(60, 84, 16)),
  'sydas.storslagen': all(bg('#e4f1fa'), greyed(at(16, 100, 0.5, path('M-12 0 L-12 -12 L0 -20 L12 -12 L12 0 Z', '#c0a888', C.ink, 1.2))),
    rect(28, 100, 88, 8, MARBLE, 1, C.ink, 1.2), rect(38, 46, 72, 54, '#f0e2c4', 1, C.ink, 1.5), path('M54 46 C46 6 102 6 94 46 Z', MARBLE, C.ink, 1.5), minaret(34, 100, 64, MARBLE), minaret(111, 100, 64, MARBLE),
    ...[46, 60, 88, 102].map((x) => path(`M${x - 4} 96 L${x - 4} 74 C${x - 4} 68 ${x + 4} 68 ${x + 4} 74 L${x + 4} 96 Z`, '#8a7a68', C.ink, 1)), path('M66 100 L66 66 C66 54 82 54 82 66 L82 100 Z', '#6a5a4a', C.ink, 1.2),
    stand(74, 110, 0.18, fig(60, C.denim, 'shock')), sparkle(52, 20, 4), sparkle(100, 24, 3.4), sparkle(28, 30, 3), arrow(18, 76, 18, 30, HL, 2.6)),
  // 2425 Kolonialt Indien
  'sydas.råvara.2': all(bg(), field(96, GRASS), at(20, 58, 1, line('M0 14 L0 -6 M0 2 L-6 -4 M0 4 L6 -2', '#5a8a3a', 1.6), circle(0, -8, 4, C.white, C.ink, 1), circle(-7, -5, 3.4, C.white, C.ink, 1), circle(7, -3, 3.4, C.white, C.ink, 1)),
    at(20, 90, 1, ellipse(0, 0, 12, 4, '#b07a44', C.ink, 1.2), rect(-12, -10, 24, 10, '#b07a44', 0, null), ellipse(0, -10, 12, 4, '#d4a373', C.ink, 1.2), circle(0, -10, 3, 'none', '#8a5a2a', 0.8), line('M-12 -10 L-12 0 M12 -10 L12 0', C.ink, 1.2)),
    at(24, 32, 1, path('M-10 4 L-6 -6 L4 -8 L10 -2 L6 6 Z', '#6b6b70', C.ink, 1.2), circle(-2, -2, 1.4, '#a0a0a8', null)), oval(22, 62, 18, 44),
    arrow(42, 62, 58, 62, HL, 2.8), at(82, 96, 1, rect(-22, -30, 44, 30, '#b5462e', 1, C.ink, 1.4), path('M-22 -30 L-14 -38 L-14 -30 L-6 -38 L-6 -30 L2 -38 L2 -30', '#b5462e', C.ink, 1.2), rect(10, -52, 6, 22, '#8a3020', 1, C.ink, 1), path('M13 -56 C9 -60 17 -64 13 -68', 'none', C.grey, 2.2)),
    at(104, 66, 0.8, rect(-10, -6, 20, 12, '#e8d7b8', 3, C.ink, 1.2), path('M-10 -6 C-14 -6 -14 6 -10 6', '#e8d7b8', C.ink, 1.2))),
  'sydas.sepoy': all(bg(), field(100, '#c9b48a'), fig(60, RED, 'calm', { bottom: C.white }), on(60, 1, path('M-11 -59 C-12 -76 12 -76 11 -59 Z', '#2f3a6a', C.ink, 1.3), rect(-11, -62, 22, 3, C.white, 1, C.ink, 0.8), line('M-13 -40 L13 -10 M13 -40 L-13 -10', C.white, 2.2), rect(-13, -6, 26, 4, C.white, 1, C.ink, 0.8), beardL()),
    reach(60, 1, 1, 80, 78), rifle(82, 104, 1.6), oval(60, 64, 30, 48)),
  'sydas.vicekung': all(bg(), field(100, '#c9d8a8'), at(60, 100, 1, rect(-52, -40, 104, 40, '#efe6d2', 1, C.ink, 1.3), path('M-20 -40 C-24 -62 24 -62 20 -40 Z', '#efe6d2', C.ink, 1.3), ...[-40, -26, 26, 40].map((x) => rect(x - 3, -34, 6, 34, C.white, 1, C.ink, 1))),
    fig(60, C.white, 'calm', { bottom: C.navy }), on(60, 1, path('M-11 -60 C-12 -74 12 -74 11 -60 Z', C.white, C.ink, 1.3), path('M0 -74 C-4 -84 6 -88 2 -96', 'none', C.white, 3), line('M-13 -40 L13 -6', '#2f6fb0', 3.2), circle(-6, -30, 2, GOLD, C.ink, 0.6), circle(-6, -24, 2, GOLD, C.ink, 0.6)),
    at(100, 20, 1, circle(0, 0, 11, C.white, C.ink, 1.2), crown(0, 1, 0.9)), dash('M89 24 L72 40', HL, 1.8), ring(60, 70, 34)),
  'sydas.furstestat': all(bg(), land(60, 60, 1.6, '#f0b8b0', 1.8),
    at(42, 48, 1, path('M-10 -8 C-2 -12 8 -8 10 -2 C12 6 4 12 -4 10 C-12 8 -14 -2 -10 -8 Z', '#f2c14e', C.ink, 1.3), crown(0, 0, 0.7)),
    at(80, 72, 1, path('M-8 -6 C0 -10 8 -6 8 0 C8 6 2 9 -4 8 C-10 6 -10 -2 -8 -6 Z', '#9ad0a0', C.ink, 1.2), crown(0, 0, 0.55)),
    at(52, 84, 1, path('M-6 -4 C0 -7 6 -4 6 0 C6 4 0 6 -4 5 C-8 3 -8 -2 -6 -4 Z', '#b3a6e0', C.ink, 1.1)), at(86, 42, 1, path('M-5 -4 C0 -6 6 -3 5 1 C4 5 -2 6 -5 3 C-7 1 -7 -2 -5 -4 Z', '#9ad0a0', C.ink, 1.1)),
    at(100, 100, 0.8, circle(0, 0, 10, C.white, C.ink, 1.2), crown(0, 1, 0.8)), dash('M92 94 L84 80', C.grey, 1.4), ring(42, 46, 16)),
  'sydas.maharadja': all(bg('#f3e6c4'), at(60, 104, 1, rect(-52, -50, 104, 50, '#f0d8b8', 1, C.ink, 1.3), ...[-36, 0, 36].map((x) => path(`M${x - 10} -50 C${x - 12} -64 ${x + 12} -64 ${x + 10} -50 Z`, '#f0d8b8', C.ink, 1.2)), ...[-36, -12, 12, 36].map((x) => path(`M${x - 5} 0 L${x - 5} -26 C${x - 5} -32 ${x + 5} -32 ${x + 5} -26 L${x + 5} 0 Z`, '#c89a70', C.ink, 1))),
    tman(60, 1, '#f2c14e', '#d64545', 'smile', false), on(60, 1, circle(0, -68, 3, '#3aa6a0', C.ink, 0.8), path('M1 -70 C4 -80 10 -84 8 -90', 'none', C.white, 2.4), line('M-8 -32 C-4 -26 4 -26 8 -32 M-9 -28 C-4 -21 4 -21 9 -28 M-10 -24 C-4 -16 4 -16 10 -24', C.white, 1.6), path('M-6 -50 C-3 -48 3 -48 6 -50', 'none', C.ink, 1.2)),
    reach(60, 1, 1, 78, 74), line('M78 74 L92 92', C.silver, 2.4), line('M74 70 L82 78', GOLD, 3), ring(60, 46, 16)),
  'sydas.hungersnöd': all(bg('#f6e7c8'), sunD(100, 18, 8), field(70, '#d9b980'), line('M10 80 L22 86 L18 94 M40 76 L46 84 L58 86 M70 90 L82 84 L96 92 M90 74 L104 78', '#9a7a4a', 1.2),
    ...[16, 30, 52, 66, 84, 104].map((x) => deadCrop(x, 78, 1)),
    stand(34, 112, 0.6, sari(60, 1, '#b5a68a', 'frown'), reach(60, 1, 1, 80, 76)), bowl(82, 78, 1.1, false), stand(74, 112, 0.42, fig(60, '#b5a68a', 'frown', { w: 0.8 }), reach(60, 1, 1, 80, 72)), bowl(80, 72, 0.9, false),
    greyed(at(104, 100, 1, bowl(0, 0, 1, true))), oval(81, 76, 12, 10)),
  // 2426 Självständighetsrörelser
  'sydas.massaker': all(bg('#efe8da'), rect(4, 40, 112, 72, '#d8c9a8', 0, null), rect(4, 30, 112, 12, '#b9875e', 0, C.ink, 1.2), line('M4 36 L116 36', '#8a6040', 0.6),
    ...Array.from({ length: 12 }, (_, i) => tiny(40 + (i % 6) * 12, 74 + Math.floor(i / 6) * 18, 1.3, [C.white, '#f2c14e', C.pink, '#9ad0a0'][i % 4]!)),
    ...[46, 70, 94].map((x) => palm(x, 50, 0.7)),
    greyed(...[0, 1, 2].map((i) => stand(14, 76 + i * 16, 0.34, fig(60, C.grey, 'angry'), rifle(74, 72, 1.6, 80)))),
    line('M22 70 L32 70 M22 76 L32 74', C.dark, 0.8), ...[[60, 34], [84, 36], [100, 33], [70, 38]].map(([x, y]) => circle(x!, y!, 1.4, '#3a2a1a', null)), ring(70, 82, 30)),
  'sydas.spinnrock': all(bg('#f6eedc'), field(104, '#d9c49a'), at(76, 74, 1, circle(0, 0, 22, 'none', WOOD, 3), ...[0, 30, 60, 90, 120, 150].map((a) => line(`M${f1(Math.cos((a * Math.PI) / 180) * 22)} ${f1(Math.sin((a * Math.PI) / 180) * 22)} L${f1(-Math.cos((a * Math.PI) / 180) * 22)} ${f1(-Math.sin((a * Math.PI) / 180) * 22)}`, WOOD, 1.4)), circle(0, 0, 3, WOOD, C.ink, 1), line('M0 0 L0 30 M-16 30 L16 30', WOOD, 3)),
    line('M98 74 L112 74', C.white, 1.6), path('M54 76 L60 74 M54 76 L30 82', 'none', '#f4f1ea', 1.2), line('M76 74 L106 72', C.ink, 0.6),
    sit(30, 112, 0.6, C.white, { mood: 'calm', head: g('translate(0 4)', circle(0, -56, 0.1, C.skin, null)), hair: '#e8e2d4' }), handS(44, 80), at(28, 84, 1, ellipse(0, 0, 6, 4, '#f4f1ea', C.ink, 0.9)), ring(76, 74, 26)),
  'sydas.protestmarsch': all(bg(), path('M4 112 L52 54 L68 54 L116 112 Z', '#d9c49a', C.ink, 1.2), path('M4 54 L52 54 L4 112 Z M68 54 L116 54 L116 112 Z', GRASS, null), sunD(98, 22, 6),
    ...[[56, 58, 0.14], [62, 60, 0.14], [54, 64, 0.18], [64, 66, 0.18], [52, 74, 0.24], [68, 76, 0.24]].map(([x, y, s]) => stand(x!, y!, s!, fig(60, [C.white, '#f2c14e', C.pink][Math.round(x! + y!) % 3]!, 'calm'))),
    stand(56, 98, 0.36, dhotiMan(60, 1, 'calm'), reach(60, 1, 1, 82, 94)), line('M82 70 L82 112', WOOD, 1.6),
    stand(36, 108, 0.36, fig(60, C.white, 'smile'), reach(60, 1, 1, 46, 60)), stand(86, 112, 0.36, sari(60, 1, '#f2c14e')), line('M46 60 L46 92', WOOD, 1.4), rect(46, 52, 22, 12, '#3a9a5a', 1, C.ink, 1),
    arrow(100, 94, 82, 64, HL, 2.4)),
  'sydas.hungerstrejk': all(bg('#f6eedc'), field(104, '#d9c49a'), sit(44, 108, 0.75, C.white, { mood: 'frown' }), at(44, 108, 0.75, line('M-15 -30 L11 -21 M15 -30 L-11 -21', C.ink, 7.4), line('M-15 -30 L11 -21 M15 -30 L-11 -21', C.skin, 5), circle(11, -21, 3, C.skin, C.ink, 1), circle(-11, -21, 3, C.skin, C.ink, 1)),
    at(86, 100, 1, ellipse(0, 0, 14, 5, C.white, C.ink, 1.3), path('M-9 -2 C-8 -8 8 -8 9 -2 Z', '#e9b44c', C.ink, 1), circle(-3, -5, 2, '#5aa66a', null)), ban(86, 96, 15, 2.6),
    at(84, 36, 1, rect(-20, -16, 40, 32, C.white, 2, C.ink, 1.3), rect(-20, -16, 40, 7, RED, 2, C.ink, 1.1), ...[1, 2, 3, 4, 5, 6].map((n) => all(`<text x="${-14 + ((n - 1) % 3) * 13}" y="${2 + Math.floor((n - 1) / 3) * 10}" font-family="system-ui,sans-serif" font-weight="700" font-size="7" text-anchor="middle" fill="${C.ink}">${n}</text>`, line(`M${-18 + ((n - 1) % 3) * 13} ${-4 + Math.floor((n - 1) / 3) * 10} l7 6 M${-11 + ((n - 1) % 3) * 13} ${-4 + Math.floor((n - 1) / 3) * 10} l-7 6`, RED, 1)))),
    ring(86, 96, 18)),
  // 2427 Sydasiens moderna stater
  'sydas.premiärminister': all(bg('#e9eef4'), at(60, 60, 1, rect(-50, -20, 100, 24, '#efe6d2', 1, C.ink, 1.2), path('M-16 -20 C-18 -36 18 -36 16 -20 Z', '#efe6d2', C.ink, 1.2), ...[-40, -30, -20, 20, 30, 40].map((x) => rect(x - 2, -16, 4, 20, C.white, 1, C.ink, 0.8))),
    flag(16, 104, SAFFRON, null, 46), rect(16, 66, 18, 4, C.white, 0, null), rect(16, 70, 18, 4, '#3a9a5a', 0, C.ink, 0.6),
    tman(60, 1, C.white, C.white, 'smile'), on(60, 1, path('M-13 -41 L13 -41 L12 0 L-12 0 Z', '#3a4a6a', C.ink, 1.3), path('M-11 -59 C-12 -70 12 -70 11 -59 Z', C.white, C.ink, 1.1)),
    rect(42, 82, 36, 30, WOOD, 2, C.ink, 1.4), line('M60 82 L66 70', C.dark, 1.4), circle(66, 69, 2.4, C.dark, null),
    stand(98, 112, 0.5, fig(60, '#3a4a6a', 'smile')), ring(60, 50, 16)),
  'sydas.folkrik': all(bg(), greyed(land(28, 66, 0.8, GRASS), tiny(24, 66, 1, C.grey), tiny(34, 72, 1, C.grey)),
    land(78, 62, 1.1, GRASS, 1.6), ...Array.from({ length: 24 }, (_, i) => tiny(58 + (i % 6) * 8, 48 + Math.floor(i / 6) * 10, 0.95, [C.white, '#f2c14e', C.pink, C.denim][i % 4]!)), oval(78, 62, 36, 32)),
  'sydas.befolkningstillväxt': all(bg('#f6f3ec'), line('M14 104 L110 104 M14 104 L14 20', C.ink, 1.4),
    ...[0, 1, 2, 3, 4].flatMap((c) => Array.from({ length: 1 + c * 2 }, (_, r) => tiny(26 + c * 20, 102 - r * 9, 0.75, [C.denim, C.pink, '#f2c14e'][(r + c) % 3]!))),
    arrow(22, 90, 104, 24, HL, 3)),
};
