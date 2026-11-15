/**
 * Historia & humaniora → Civilisationer & världsdelars historia → Östasiens historia, 2411–2417 (0.41): Chinese
 * dynasties, Japan's prehistoric periods, the samurai age, Edo society, the Meiji restoration, Korea's historical
 * kingdoms and modern East Asian history. Recurring signs: Chinese emperors in yellow robes with a flat crown board,
 * red palace halls with golden roofs, Japanese figures in kimono with a topknot, a helmet or a tall black court hat,
 * white Japanese castles on grey stone bases, brown clay for prehistoric finds, simple maps of Japan and the Korean
 * peninsula with a highlighted part, and an orange highlight ring on the thing that the word names. Digits only; no
 * letters, no real flags or brands, no pointing fingers. Abstract words are small symbolic scenes with a grey
 * reference beside them as contrast.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, star, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const SKY = '#e4f1fa';
const GRASS = '#8cc96a';
const GRASS2 = '#6aa84f';
const SEA = '#8fc6e6';
const SEA2 = '#5a9ccc';
const SAND = '#ecd9a8';
const STONE = '#a8a6a0';
const STONE2 = '#8c8a84';
const WOOD = '#a0673d';
const CLAY = '#c4703e';
const CLAY2 = '#9a5530';
const TERRA = '#b9825a';
const BRONZE = '#5f9a86';
const BRONZE2 = '#3f7a68';
const IMP = '#f2c230';
const IMP2 = '#c99a18';
const RED = '#c8372d';
const RED2 = '#9a2a22';
const ROOF = '#3d4450';
const WALLW = '#f6f3ea';
const STRAW = '#d9b45a';
const STRAW2 = '#a8843a';
const LAND2 = '#a8c98a';
const JADE = '#4fa38a';
const CELADON = '#8fc4b0';
const PAPER = '#f3e3b8';
const IRON = '#5b6270';
const OLIVE = '#6b7a3a';
const GOOD = '#3a9a5a';
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);

// ── Scenery ──────────────────────────────────────────────────────────
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const field = (y = 96, col: string = GRASS) => rect(4, y, 112, 112 - y, col, 0, null);
const ground = line('M4 112 L116 112', C.grey2, 2);
const sea = (y: number, col: string = SEA) => rect(4, y, 112, 112 - y, col, 0, null);
const waves = (x1: number, x2: number, y: number, col: string = SEA2) => line(Array.from({ length: Math.floor((x2 - x1) / 10) }, (_, i) => `M${x1 + i * 10} ${y} q2.5 -2.5 5 0 t5 0`).join(' '), col, 1.2);
const cloud = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', col, C.ink, 1.2));
const sunD = (x: number, y: number, r = 7) => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 6))} ${f1(y + Math.sin(a) * (r + 6))}`, C.gold, 2); }), circle(x, y, r, C.yellow, C.ink, 1.4));
const hill = (x: number, y: number, w: number, h: number, col: string = GRASS2) => path(`M${x - w} ${y} C${f1(x - w * 0.5)} ${y - h} ${f1(x + w * 0.5)} ${y - h} ${x + w} ${y} Z`, col, C.ink, 1.2);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.4);
const dash = (d: string, col: string = HL, w = 1.6, da = '3 3') => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-dasharray="${da}" stroke-linecap="round"/>`;
const ban = (x: number, y: number, r = 10, w = 2.6) => all(circle(x, y, r, 'none', C.red, w), line(`M${f1(x - r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r * 0.7)} ${f1(y - r * 0.7)}`, C.red, w));
const okC = (x: number, y: number, r = 7) => all(circle(x, y, r, GOOD, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, f1(r * 0.24)));
const rain = (x: number, y: number, w = 30, col = '#5aa7d6') => line(Array.from({ length: Math.floor(w / 6) }, (_, i) => `M${x + i * 6} ${y} l-2 6`).join(' '), col, 1.4);
const lines = (x: number, y: number, w: number, n: number, gap = 4, col: string = C.grey) => line(Array.from({ length: n }, (_, i) => `M${x} ${y + i * gap} L${x + w - (i === n - 1 ? w * 0.35 : 0)} ${y + i * gap}`).join(' '), col, 1.2);

// ── People ───────────────────────────────────────────────────────────
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, hy: f1(ty - 56 * s), sy: f1(ty - 38 * s), sl: f1(x - 13 * s), sr: f1(x + 13 * s) }; };
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; torso −42…2; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
/** Figures drawn standing at x = 60 on y = 112, placed with their feet at (x, y) and scaled by s. */
const stand = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s}) translate(-60 -112)`, ...k);
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** A long robe with wide sleeves and a belt (figure coordinates); hands at (±22, −6). */
const robe = (col: string, trim: string = PAPER, belt: string = ROOF) => all(
  path('M-14 -42 L14 -42 C17 -10 19 20 20 46 L-20 46 C-19 20 -17 -10 -14 -42 Z', col, C.ink, 2),
  path('M-14 -41 L-27 -16 L-25 -4 L-15 -8 Z M14 -41 L27 -16 L25 -4 L15 -8 Z', col, C.ink, 1.8),
  path('M-6 -42 L4 -22 M6 -42 L-1 -30', 'none', trim, 2), rect(-15, -16, 30, 5, belt, 0, C.ink, 1),
  circle(-22, -5, 3.2, C.skin, C.ink, 1.2), circle(22, -5, 3.2, C.skin, C.ink, 1.2));
/** A person in a robe (no arms of the base figure visible). */
const robed = (x: number, col: string, mood: Mood = 'calm', more: Partial<Build> = {}, ...extra: Svg[]) => { const h = more.h ?? 1; return all(fig(x, col, mood, { bottom: col, ...more }), on(x, h, robe(col, more.grey ? C.grey2 : PAPER), ...extra)); };
/** Head wear (figure coordinates). */
const crownE = all(rect(-6, -72, 12, 7, C.black, 1, C.ink, 1), rect(-15, -75, 30, 3, C.black, 1, C.ink, 1), line('M-13 -72 L-13 -64 M-9 -72 L-9 -65 M9 -72 L9 -65 M13 -72 L13 -64', IMP2, 1.2), ...[-13, -9, 9, 13].map((d) => circle(d, d * d > 100 ? -64 : -65, 1.1, RED, null)));
const phoenixCrown = all(path('M-10 -64 C-12 -74 12 -74 10 -64 Z', IMP, C.ink, 1.1), path('M-4 -72 L0 -80 L4 -72 Z M-11 -68 L-16 -74 M11 -68 L16 -74', IMP, C.ink, 1), circle(0, -71, 1.6, RED, null), circle(-16, -74, 1.4, RED, null), circle(16, -74, 1.4, RED, null));
const topknot = (col: string = C.hair) => all(path('M-10 -58 C-10 -68 10 -68 10 -58 C6 -62 -6 -62 -10 -58 Z', col, C.ink, 1.2), rect(-1.6, -72, 3.2, 8, col, 1, C.ink, 0.8));
const kabuto = all(path('M-13 -57 C-13 -73 13 -73 13 -57 Z', IRON, C.ink, 1.3), path('M-15 -58 L-18 -50 L-11 -52 Z M15 -58 L18 -50 L11 -52 Z', IRON, C.ink, 1.1), path('M-2 -68 L-12 -82 L-5 -68 Z M2 -68 L12 -82 L5 -68 Z', C.gold, C.ink, 0.9), circle(0, -68, 2.2, C.gold, C.ink, 0.8));
const eboshi = path('M-8 -63 L-7 -82 C-3 -85 4 -84 7 -79 L8 -63 Z', C.black, C.ink, 1.1);
const kasa = (col: string = STRAW) => all(path('M-18 -61 L0 -75 L18 -61 Z', col, C.ink, 1.3), line('M-9 -68 L-4 -61 M9 -68 L4 -61', STRAW2, 0.8));
const armor = (col: string = RED) => all(rect(-14, -40, 28, 32, col, 3, C.ink, 1.8), line('M-14 -32 L14 -32 M-14 -24 L14 -24 M-14 -16 L14 -16', RED2, 1.2), path('M-16 -42 L-24 -36 L-20 -28 L-13 -34 Z M16 -42 L24 -36 L20 -28 L13 -34 Z', col, C.ink, 1.2),
  path('M-15 -8 L-17 8 L-5 8 L-4 -8 Z M15 -8 L17 8 L5 8 L4 -8 Z', col, C.ink, 1.2), line('M-16 0 L-5 0 M16 0 L5 0', RED2, 1));
/** Two swords at the left hip (figure coordinates). */
const swords = all(line('M-22 -2 L14 -16', C.black, 3.2), line('M-18 -6 L10 -18', C.black, 2.6), line('M12 -16 L16 -17 M8 -18 L12 -19', C.gold, 2.6));
const fan = (x: number, y: number, s = 1, col: string = C.gold) => at(x, y, s, path('M0 0 L-10 -12 C-4 -16 4 -16 10 -12 Z', col, C.ink, 1), line('M0 0 L-5 -14 M0 0 L0 -15 M0 0 L5 -14', C.ink, 0.6));
const mon = (x: number, y: number, r = 4, col: string = C.white) => all(circle(x, y, r, col, C.ink, 0.9), circle(x, y, f1(r * 0.45), 'none', C.ink, 0.8), line(`M${x - r * 0.7} ${y} L${x + r * 0.7} ${y} M${x} ${y - r * 0.7} L${x} ${y + r * 0.7}`, C.ink, 0.6));
const banner = (x: number, y: number, h = 34, col: string = C.navy) => all(line(`M${x} ${y} L${x} ${y - h}`, WOOD, 1.8), rect(x + 1, y - h, 9, h * 0.62, col, 0.5, C.ink, 1), mon(x + 5.5, y - h + 8, 3));

// ── Buildings and things ─────────────────────────────────────────────
/** A Chinese palace hall with red columns and a double golden roof, base at (x, y). */
const hallC = (x: number, y: number, s = 1) => at(x, y, s, rect(-34, -6, 68, 6, C.white, 0, C.ink, 1.3), rect(-28, -30, 56, 24, RED, 0, C.ink, 1.3), ...[-22, -11, 0, 11, 22].map((d) => rect(d - 1.6, -30, 3.2, 24, RED2, 0, null)),
  rect(-6, -22, 12, 16, '#5a1e18', 0, C.ink, 1), path('M-42 -30 C-30 -34 30 -34 42 -30 L30 -40 L-30 -40 Z', IMP, C.ink, 1.4), rect(-26, -46, 52, 6, RED, 0, C.ink, 1.1), path('M-36 -46 C-24 -49 24 -49 36 -46 L24 -56 L-24 -56 Z', IMP, C.ink, 1.4), line('M-24 -56 L24 -56', IMP2, 2.4));
/** Japanese castle keep on a stone base, base at (x, y). */
const castleJ = (x: number, y: number, s = 1) => at(x, y, s, path('M-30 0 L-24 -18 L24 -18 L30 0 Z', STONE, C.ink, 1.4), line('M-27 -9 L27 -9 M-12 -18 L-14 0 M8 -18 L9 0', STONE2, 0.9),
  rect(-19, -34, 38, 16, WALLW, 0, C.ink, 1.2), path('M-27 -33 L27 -33 L18 -42 L-18 -42 Z', ROOF, C.ink, 1.3), rect(-13, -52, 26, 10, WALLW, 0, C.ink, 1.1), path('M-20 -51 L20 -51 L11 -59 L-11 -59 Z', ROOF, C.ink, 1.2),
  rect(-8, -68, 16, 9, WALLW, 0, C.ink, 1), path('M-14 -67 L14 -67 L6 -75 L-6 -75 Z', ROOF, C.ink, 1.1), path('M-5 -76 L-7 -80 L-3 -77 Z M5 -76 L7 -80 L3 -77 Z', C.gold, null),
  ...[-12, -4, 4, 12].map((d) => rect(d - 2, -30, 4, 5, ROOF, 0.5, null)), ...[-6, 2].map((d) => rect(d, -49, 4, 4, ROOF, 0.5, null)));
/** A small Japanese wooden house with a dark roof, base at (x, y). */
const houseJ = (x: number, y: number, s = 1, wall: string = '#e9dcc0') => at(x, y, s, rect(-14, -14, 28, 14, wall, 0, C.ink, 1.1), line('M-14 -7 L14 -7 M-5 -14 L-5 0 M5 -14 L5 0', WOOD, 0.9), path('M-19 -14 L19 -14 L13 -22 L-13 -22 Z', ROOF, C.ink, 1.1));
const lantern = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 0, 4.4, 6, '#f2e6c8', C.ink, 1), line('M-4 -3 L4 -3 M-4 3 L4 3', '#c8372d', 1), rect(-2.4, -8, 4.8, 2.4, C.black, 0.5, null), rect(-2.4, 5.6, 4.8, 2.4, C.black, 0.5, null));
/** A stretch of the Great Wall along a path given by points, with crenellations. */
const wallTower = (x: number, y: number, s = 1) => at(x, y, s, rect(-9, -20, 18, 20, '#c9b48a', 0, C.ink, 1.2), ...[-9, -4, 1, 6].map((d) => rect(d, -24, 3, 4, '#c9b48a', 0, C.ink, 0.8)), rect(-3, -14, 6, 7, '#5a4a3a', 2, null), path('M-11 -24 L11 -24 L7 -30 L-7 -30 Z', ROOF, C.ink, 1));
/** A terracotta soldier, feet at (x, y). */
const terra = (x: number, y: number, s = 1, col: string = TERRA) => at(x, y, s, path('M-7 -30 L7 -30 L9 0 L-9 0 Z', col, C.ink, 1.1), line('M-7 -22 L7 -22 M-7 -14 L7 -14', '#8a5a3a', 0.8), circle(0, -36, 5.4, col, C.ink, 1.1), path('M-4 -40 C-3 -44 3 -44 4 -40 L2 -43 L0 -46 L-2 -43 Z', col, C.ink, 0.8),
  circle(-1.8, -36.5, 0.6, C.ink, null), circle(1.8, -36.5, 0.6, C.ink, null), path('M-9 -28 L-11 -14 L-8 -13 M9 -28 L11 -14 L8 -13', 'none', C.ink, 1.1));
const camel = (x: number, y: number, s = 1, flip = false) => g(`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`, ...[-12, -6, 8, 12].map((d) => line(`M${d} -10 L${d} 4`, '#b8925a', 2.6)), path('M-16 -10 C-16 -18 -12 -20 -8 -22 C-6 -28 0 -28 2 -22 C4 -28 10 -28 12 -22 C16 -20 16 -14 14 -10 Z', '#c9a36a', C.ink, 1.2),
  path('M14 -14 L20 -26 L26 -26 L27 -23 L22 -22 L18 -12 Z', '#c9a36a', C.ink, 1.1), circle(23, -25, 0.8, C.ink, null));
const bolt = (x: number, y: number, col: string) => all(ellipse(x, y, 5, 3.6, col, C.ink, 1), ellipse(x + 4, y, 1.6, 3.6, col, C.ink, 0.9), path(`M${x - 3} ${y - 1} q3 -2 6 0`, 'none', 'rgba(255,255,255,0.6)', 1));
/** Flat bronze bell (dotaku), centred at (x, y) bottom. */
const dotaku = (x: number, y: number, s = 1) => at(x, y, s, path('M-14 0 L-10 -40 C-10 -50 10 -50 10 -40 L14 0 Z', BRONZE, C.ink, 1.6), path('M-10 -40 C-10 -60 10 -60 10 -40', 'none', BRONZE2, 4), path('M-10 -40 C-10 -60 10 -60 10 -40', 'none', C.ink, 1),
  path('M-14 0 L-18 -4 L-15 -14 M14 0 L18 -4 L15 -14', 'none', BRONZE2, 2.2), line('M-12 -12 L12 -12 M-11 -26 L11 -26 M0 -40 L0 -26 M0 -12 L0 0', BRONZE2, 1.4),
  path('M-8 -20 l2 -3 l2 3 M2 -20 l2 -3 l2 3 M-7 -6 l3 -2 l3 2 M3 -6 l3 -2 l3 2 M-6 -34 q2 -3 4 0 M2 -34 q2 -3 4 0', 'none', '#e9f4ee', 0.9));
/** A raised storehouse on stilts with a thatched roof, base at (x, y). */
const storehouse = (x: number, y: number, s = 1) => at(x, y, s, ...[-14, -5, 5, 14].map((d) => rect(d - 1.6, -22, 3.2, 22, WOOD, 0, C.ink, 1)), ...[-14, -5, 5, 14].map((d) => ellipse(d, -20, 3.4, 1.4, '#7a5030', C.ink, 0.6)),
  rect(-18, -40, 36, 18, '#c08a52', 0, C.ink, 1.3), line('M-18 -34 L18 -34 M-18 -28 L18 -28', '#8a5a34', 0.8), path('M-24 -40 L0 -62 L24 -40 Z', STRAW, C.ink, 1.4), line('M-14 -46 L-10 -40 M-4 -54 L0 -46 M8 -50 L12 -44', STRAW2, 0.9),
  line('M20 0 L28 -22 M24 0 L32 -22 M21 -4 L25 -4 M22.6 -9 L26.6 -9 M24.3 -14 L28.3 -14 M26 -19 L30 -19', WOOD, 1.4));
/** A Jomon pot with a flame-like rim and cord pattern, base at (x, y). */
const jomonPot = (x: number, y: number, s = 1, cord = true) => at(x, y, s, path('M-10 0 C-14 -10 -14 -24 -12 -34 L12 -34 C14 -24 14 -10 10 0 Z', CLAY, C.ink, 1.5),
  path('M-14 -34 C-16 -42 -10 -46 -8 -40 C-6 -48 0 -50 0 -42 C2 -50 8 -48 8 -40 C10 -46 16 -42 14 -34 Z', CLAY, C.ink, 1.3), cord ? line(Array.from({ length: 6 }, (_, i) => `M-11 ${-30 + i * 5} l3 2 l3 -2 l3 2 l3 -2 l3 2 l3 -2 l3 2`).join(' '), CLAY2, 1) : '');
/** A dogu clay figure with big goggle eyes, feet at (x, y). */
const dogu = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 0 L-12 -6 L-10 -14 L-4 -12 L4 -12 L10 -14 L12 -6 L8 0 Z', TERRA, C.ink, 1.3), path('M-12 -14 C-14 -24 -10 -36 -8 -36 L8 -36 C10 -36 14 -24 12 -14 Z', TERRA, C.ink, 1.4),
  path('M-12 -32 L-22 -26 L-20 -20 L-11 -24 Z M12 -32 L22 -26 L20 -20 L11 -24 Z', TERRA, C.ink, 1.2), ellipse(0, -46, 13, 11, TERRA, C.ink, 1.4), ellipse(-5.5, -46, 4.6, 2.8, '#e8c9a8', C.ink, 1), ellipse(5.5, -46, 4.6, 2.8, '#e8c9a8', C.ink, 1),
  line('M-9 -46 L-2 -46 M2 -46 L9 -46', C.ink, 1), path('M-10 -56 C-6 -62 6 -62 10 -56', 'none', CLAY2, 2.4), line('M-8 -30 l4 3 l4 -3 l4 3 l4 -3 M-8 -22 l4 3 l4 -3 l4 3 l4 -3', CLAY2, 1));
/** A haniwa figure: a cylinder with hole eyes and mouth, base at (x, y). */
const haniwa = (x: number, y: number, s = 1) => at(x, y, s, path('M-7 0 L-6 -26 C-6 -36 6 -36 6 -26 L7 0 Z', CLAY, C.ink, 1.3), ellipse(-2.6, -28, 1.4, 1.8, '#3a2216', null), ellipse(2.6, -28, 1.4, 1.8, '#3a2216', null), ellipse(0, -23, 1.6, 1.4, '#3a2216', null),
  path('M-6 -16 C-12 -18 -12 -10 -8 -8 M6 -16 C12 -14 12 -22 8 -24', 'none', CLAY, 3), path('M-6 -16 C-12 -18 -12 -10 -8 -8 M6 -16 C12 -14 12 -22 8 -24', 'none', C.ink, 0.6), path('M-7 -34 C-8 -40 8 -40 7 -34', 'none', CLAY2, 2));
const haniwaHorse = (x: number, y: number, s = 1) => at(x, y, s, ...[-9, -4, 5, 10].map((d) => rect(d - 2, -12, 4, 12, CLAY, 1, C.ink, 1)), ellipse(0, -15, 13, 6, CLAY, C.ink, 1.2), path('M10 -18 L16 -30 L22 -28 L18 -16 Z', CLAY, C.ink, 1.1), circle(18, -27, 0.9, '#3a2216', null));
/** A Japanese merchant/craftsman/farmer token for social-order pictures (figure coordinates, small). */
const ricePlants = (x: number, y: number, n = 6, gap = 10) => all(...Array.from({ length: n }, (_, i) => line(`M${x + i * gap} ${y} l-3 -8 M${x + i * gap} ${y} l0 -10 M${x + i * gap} ${y} l3 -8`, '#4f9d3a', 1.4)));
const scroll = (x: number, y: number, w = 40, h = 30, inner: Svg = '') => all(rect(x - w / 2, y - h / 2, w, h, PAPER, 1, C.ink, 1.3), rect(x - w / 2 - 3, y - h / 2 - 3, w + 6, 4, WOOD, 2, C.ink, 1), rect(x - w / 2 - 3, y + h / 2 - 1, w + 6, 4, WOOD, 2, C.ink, 1), inner);
const throne = (x: number, y: number, s = 1) => at(x, y, s, rect(-16, -30, 32, 30, IMP2, 3, C.ink, 1.4), rect(-20, -8, 40, 8, RED, 2, C.ink, 1.3), path('M-16 -30 C-18 -38 -10 -40 -8 -34 M16 -30 C18 -38 10 -40 8 -34', 'none', IMP2, 3));
const coin = (x: number, y: number, r = 3) => all(circle(x, y, r, C.gold, C.ink, 0.9), rect(x - r * 0.3, y - r * 0.3, r * 0.6, r * 0.6, 'none', 0, '#b88a20', 0.7));
const ballotBox = (x: number, y: number, s = 1) => at(x, y, s, rect(-14, -20, 28, 20, C.white, 2, C.ink, 1.4), rect(-8, -22, 16, 3, C.dark, 1, null), path('M-4 -30 L6 -28 L5 -21 L-5 -23 Z', PAPER, C.ink, 1));
const flagGen = (x: number, y: number, h = 30, col: string = RED, starCol: string = C.yellow) => all(line(`M${x} ${y} L${x} ${y - h}`, C.grey, 1.8), path(`M${x} ${y - h} L${x + 22} ${y - h} L${x + 22} ${y - h + 14} L${x} ${y - h + 14} Z`, col, C.ink, 1.1), star(x + 6, y - h + 5, 3, starCol));
const tank = (x: number, y: number, s = 1, col: string = OLIVE) => at(x, y, s, rect(-18, -8, 36, 8, C.dark, 4, C.ink, 1.2), ...[-12, -4, 4, 12].map((d) => circle(d, -4, 2.4, C.grey, C.ink, 0.6)), path('M-14 -8 L-12 -16 L12 -16 L14 -8 Z', col, C.ink, 1.2), rect(-6, -22, 14, 6, col, 2, C.ink, 1), line('M8 -19 L24 -21', C.ink, 2.4));
const soldier = (x: number, col: string = OLIVE, mood: Mood = 'calm', h = 1) => all(fig(x, col, mood, { h, bottom: col }), on(x, h, path('M-11 -60 C-11 -72 11 -72 11 -60 L13 -59 L-13 -59 Z', col, C.ink, 1.2)));
/** Simple maps (fill colours passed in). */
const JAPAN = { hok: 'M84 16 C92 10 106 12 108 20 C104 28 96 30 90 28 C86 26 82 22 84 16 Z', hon: 'M26 90 C38 82 52 78 62 68 C70 60 76 48 82 38 C86 32 92 32 92 38 C90 50 84 62 76 72 C66 84 50 92 34 98 Z', shi: 'M36 98 C42 94 52 94 56 98 C52 102 42 104 36 98 Z', kyu: 'M14 94 C18 88 28 90 28 98 C26 106 18 106 14 102 Z' };
const japanMap = (hon: string = LAND2, hok: string = LAND2, shi: string = LAND2, kyu: string = LAND2) => all(path(JAPAN.hok, hok, C.ink, 1.3), path(JAPAN.hon, hon, C.ink, 1.3), path(JAPAN.shi, shi, C.ink, 1.3), path(JAPAN.kyu, kyu, C.ink, 1.3));
const KOREA = 'M40 20 C52 16 70 18 78 24 C76 34 82 44 80 56 C78 70 74 84 68 94 C60 100 50 98 46 90 C48 80 42 72 44 62 C46 52 38 44 40 34 Z';
const fence = (y: number, col: string = C.grey) => all(line(`M4 ${y} L116 ${y}`, col, 1.6), line(Array.from({ length: 12 }, (_, i) => `M${8 + i * 10} ${y - 6} L${8 + i * 10} ${y + 2}`).join(' '), col, 1.4), line(`M4 ${y - 4} L116 ${y - 4}`, col, 1));
const shinkansen = (x: number, y: number, s = 1) => at(x, y, s, path('M-50 0 L30 0 C46 0 54 -6 56 -10 C50 -18 36 -22 20 -22 L-50 -22 Z', C.white, C.ink, 1.6), path('M-50 -8 L40 -8 C46 -8 50 -9 53 -10 L56 -10 C54 -6 46 0 30 0 L-50 0 Z', '#2f5fb0', null),
  path('M-50 0 L30 0 C46 0 54 -6 56 -10 C50 -18 36 -22 20 -22 L-50 -22 Z', 'none', C.ink, 1.6), path('M28 -19 C38 -18 46 -15 50 -12 L36 -12 Z', '#2b3a55', C.ink, 0.8), ...[-44, -34, -24, -14, -4, 6].map((d) => rect(d, -18, 7, 5, '#bfe3f5', 1, C.ink, 0.7)));
const turtleShip = (x: number, y: number, s = 1) => at(x, y, s, path('M-34 -4 C-24 6 24 6 34 -4 L30 -10 L-30 -10 Z', '#8a5a34', C.ink, 1.4), path('M-30 -10 C-26 -30 26 -30 30 -10 Z', '#7a6a4a', C.ink, 1.5),
  ...Array.from({ length: 6 }, (_, i) => path(`M${-22 + i * 8} -10 C${-21 + i * 8} -20 ${-15 + i * 8} -24 ${-13 + i * 8} -24`, 'none', '#5a4a30', 1)), ...Array.from({ length: 9 }, (_, i) => { const t = -0.8 + i * 0.2, xx = f1(t * 28), yy = f1(-10 - 18 * (1 - t * t)); return path(`M${xx - 1.4} ${yy} L${xx} ${yy - 4} L${xx + 1.4} ${yy} Z`, C.silver, C.ink, 0.6); }),
  path('M30 -12 L40 -18 L44 -14 L40 -10 L34 -8 Z', RED, C.ink, 1.1), circle(39, -15, 1, C.white, null), path('M40 -18 L42 -24 M42 -16 L48 -18', 'none', RED, 1.2), ...[-18, -6, 6, 18].map((d) => line(`M${d} -4 L${d - 4} 6`, WOOD, 1.6)));
const junk = (x: number, y: number, s = 1, broken = false) => at(x, y, s, path('M-20 -4 C-12 4 12 4 20 -4 L18 -8 L-18 -8 Z', '#6b4a2e', C.ink, 1.2), line(broken ? 'M0 -8 L6 -26' : 'M0 -8 L0 -30', WOOD, 1.8), path(broken ? 'M6 -26 L14 -20 L8 -12 Z' : 'M0 -30 L14 -26 L12 -12 L0 -12 Z', '#c9a36a', C.ink, 1));

// ── Motifs ───────────────────────────────────────────────────────────
export const EAST_ASIAN_HISTORY_MOTIFS: Record<string, Svg> = {
  // 2411 Kinas dynastier
  'ostas.störta.2': all(bg('#f3ece2'), field(100, '#d8c9a8'), rect(70, 70, 34, 30, IMP2, 3, C.ink, 1.4), rect(66, 92, 42, 8, RED, 2, C.ink, 1.3),
    g('translate(76 96) rotate(55) scale(0.46) translate(-60 -112)', robed(60, IMP, 'shock', {}, crownE)), at(104, 26, 1, rect(-6, -4, 12, 6, C.black, 1, C.ink, 1), rect(-11, -6, 22, 2.4, C.black, 1, null)), arrow(98, 34, 110, 18, HL, 2),
    fig(20, '#8a5a34', 'angry', { h: 0.62, bottom: '#6b4a2e' }), reach(20, 0.62, 1, 46, 74), fig(40, '#5a7a4a', 'angry', { h: 0.66, bottom: '#4a5a3a' }), reach(40, 0.66, 1, 64, 70), line('M46 74 L64 70 L78 62', C.brown, 2), arrow(44, 30, 72, 44, HL, 2.6)),
  'ostas.kejsarinna': all(bg('#f6eedc'), rect(4, 96, 112, 16, RED, 0, null), throne(60, 100, 1.5), robed(60, IMP, 'calm', { h: 0.86, hairStyle: 'long' }, phoenixCrown, path('M-8 -30 C-4 -26 4 -26 8 -30 M-8 -20 C-4 -16 4 -16 8 -20', 'none', RED, 1.4)),
    fan(28, 60, 1.2, RED), fan(92, 60, 1.2, RED), line('M28 60 L28 96 M92 60 L92 96', WOOD, 2), sparkle(60, 14, 3)),
  'ostas.himmelens-mandat': all(bg('#fdf3d2'), path('M4 4 L116 4 L116 34 C90 26 30 26 4 34 Z', '#bfe3f5', null), cloud(36, 18, 1.2), cloud(86, 16, 1.1), sunD(60, 18, 7),
    path('M50 30 L44 66 M60 30 L60 66 M70 30 L76 66', 'none', 'rgba(242,193,78,0.9)', 3), scroll(60, 42, 24, 12, line('M52 40 L68 40 M52 44 L64 44', IMP2, 1.2)), arrow(60, 50, 60, 62, HL, 2.4),
    robed(60, IMP, 'calm', { h: 0.6 }, crownE), greyed(at(98, 72, 0.5, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', C.grey, C.ink, 1.2), path('M2 6 L-4 18 L2 18 L-2 30', 'none', C.yellow, 3)), stand(98, 112, 0.36, robed(60, IMP, 'frown', {}, crownE))), ground),
  'ostas.Kinesiska-muren': all(bg(), hill(20, 112, 40, 70, '#7fb36a'), hill(84, 112, 50, 86, GRASS2), hill(116, 112, 30, 40, '#7fb36a'),
    path('M4 98 C20 86 30 62 46 60 C60 58 66 36 80 34 C92 32 100 46 116 44', 'none', '#7a6a4a', 9), path('M4 98 C20 86 30 62 46 60 C60 58 66 36 80 34 C92 32 100 46 116 44', 'none', '#d4bf92', 6.4),
    dash('M4 96 C20 84 30 60 46 58 C60 56 66 34 80 32 C92 30 100 44 116 42', '#7a6a4a', 1.6, '2 2'), wallTower(46, 62, 0.8), wallTower(80, 36, 0.8), wallTower(18, 90, 0.7), cloud(28, 22, 0.7), cloud(104, 18, 0.6)),
  'ostas.terrakottaarmé': all(bg('#efe2cc'), rect(4, 20, 112, 92, '#c9a87e', 0, null), rect(4, 20, 112, 6, '#a8865c', 0, null), ...[0, 1, 2].map((r) => all(...Array.from({ length: 6 }, (_, i) => terra(f1(16 + i * 18 + (r % 2) * 4), 60 + r * 22, 0.82 - r * 0.0)))), line('M4 62 L116 62 M4 84 L116 84', '#a8865c', 1)),
  'ostas.Sidenvägen': all(bg('#fdf3d2'), field(70, SAND), path('M4 80 C30 70 50 92 70 80 C90 70 104 86 116 78', 'none', '#d9c08a', 3), hallC(16, 64, 0.32), at(104, 64, 0.5, rect(-14, -20, 28, 20, '#efe6d2', 0, C.ink, 1.2), path('M-12 -20 C-12 -36 12 -36 12 -20 Z', '#e8c87a', C.ink, 1.2), line('M-8 0 L-8 -18 M0 0 L0 -18 M8 0 L8 -18', '#c9b48a', 1.6)),
    dash('M24 62 C40 52 80 52 98 60', HL, 1.8, '4 3'), camel(40, 98, 1), camel(78, 96, 1), bolt(36, 76, '#d64545'), bolt(44, 76, '#3f6fb5'), bolt(74, 74, IMP), bolt(82, 74, '#4f9d69'), sunD(60, 20, 6)),
  'ostas.eunuck': all(bg('#f6eedc'), rect(4, 96, 112, 16, RED, 0, null), throne(84, 100, 1.2), robed(84, IMP, 'calm', { h: 0.78 }, crownE),
    robed(34, '#4a5a8a', 'calm', { h: 0.72 }, rect(-9, -70, 18, 6, C.black, 1, C.ink, 1)), at(52, 70, 1, line('M0 0 L0 -14', WOOD, 1.6), path('M0 -14 C-4 -20 -2 -28 2 -30 C2 -24 4 -18 0 -14 Z', C.white, C.ink, 0.8)), ring(34, 52, 16)),
  'ostas.Förbjudna-staden': all(bg(), rect(4, 76, 112, 36, '#e9ddc4', 0, null), rect(4, 88, 112, 8, RED, 0, C.ink, 1.2), path('M4 88 L116 88 L116 84 L4 84 Z', IMP, C.ink, 1), hallC(60, 76, 1.2), hallC(16, 82, 0.4), hallC(104, 82, 0.4),
    rect(50, 96, 20, 16, '#5a1e18', 0, C.ink, 1), ...[54, 58, 62, 66].map((x) => circle(x, 102, 0.9, C.gold, null))),
  // 2412 Japans förhistoriska perioder
  'ostas.snörmönster': all(bg('#f3ece2'), jomonPot(40, 104, 1.6, true), at(90, 52, 1, rect(-16, -3, 32, 6, '#d9b45a', 3, C.ink, 1.2), line('M-12 -3 l3 6 M-6 -3 l3 6 M0 -3 l3 6 M6 -3 l3 6 M12 -3 l2 4', STRAW2, 1.2)), circle(76, 52, 3, C.skin, C.ink, 1.2), circle(104, 52, 3, C.skin, C.ink, 1.2), arrow(90, 60, 90, 66, HL, 1.8),
    path('M80 70 C86 66 94 66 100 70', 'none', '#c9a36a', 3), line('M78 74 l3 2 l3 -2 l3 2 l3 -2 l3 2 l3 -2 l3 2 l3 -2', '#7a3e1e', 1.4), ring(40, 76, 22)),
  'ostas.lerfigur': all(bg('#f3ece2'), rect(30, 98, 60, 14, '#d9cbb0', 2, C.ink, 1.3), dogu(60, 98, 1.25), sparkle(26, 36, 3), sparkle(94, 40, 3)),
  'ostas.fastland': all(sea(4), waves(10, 50, 70), waves(14, 50, 90), path('M60 4 L116 4 L116 112 L72 112 C66 96 76 84 68 70 C62 56 72 44 64 30 C60 20 66 12 60 4 Z', LAND2, C.ink, 1.6),
    path('M18 64 C24 58 34 60 34 68 C32 76 22 76 18 70 Z', LAND2, C.ink, 1.3), at(46, 66, 0.6, path('M-12 0 C-6 4 6 4 12 0 L10 -4 L-10 -4 Z', WOOD, C.ink, 1.2), line('M0 -4 L0 -16', WOOD, 1.4), path('M0 -16 L8 -8 L0 -8 Z', C.white, C.ink, 0.8)), arrow(52, 64, 66, 62, HL, 2.4), ring(92, 56, 22)),
  'ostas.risodling': all(bg(), hill(100, 50, 40, 26, '#7fb36a'), rect(4, 50, 112, 62, '#a8d4e0', 0, null), ...[58, 70, 84, 100].map((y) => waves(8, 112, y, '#7ab4c8')), ...[60, 74, 90, 106].map((y, r) => ricePlants(10 + r * 2, y, 6, 9)),
    stand(84, 104, 0.7, fig(60, '#5a7aa8', 'calm', { bottom: '#3f5a80' }), on(60, 1, kasa())), reach(84, 0.7, -1, 74, 100), sunD(20, 20, 6)),
  'ostas.bronsklocka': all(bg('#f3ece2'), rect(36, 100, 48, 12, '#d9cbb0', 2, C.ink, 1.3), dotaku(60, 100, 1.3), sparkle(28, 44, 3)),
  'ostas.förrådshus': all(bg(), field(92), storehouse(56, 100, 1.2), at(30, 102, 1, ellipse(0, 0, 7, 5, STRAW, C.ink, 1), ellipse(10, 2, 7, 5, STRAW, C.ink, 1)), at(98, 108, 0.8, path('M-6 0 C-6 -6 6 -6 6 0 Z', C.grey, C.ink, 1), circle(7, -3, 2.4, C.grey, C.ink, 0.8), line('M-6 0 L-12 2', C.ink, 1)), ban(98, 102, 9, 2)),
  'ostas.klan': all(bg('#f3ece2'), field(100, '#c9b88a'), banner(10, 100, 50), banner(104, 100, 50), ...[22, 40, 80, 96].map((x, i) => stand(x, 104, 0.5, robed(60, C.navy, 'calm', { hairStyle: i % 2 ? 'long' : 'short' }, mon(0, -30, 5))) ),
    stand(60, 108, 0.72, robed(60, C.navy, 'calm', { hair: '#d0d0d0' }, mon(0, -30, 5), path('M-7 -53 C-6 -42 6 -42 7 -53 Z', '#e2e2e2', C.ink, 1))), oval(60, 76, 52, 30)),
  'ostas.nyckelhålsformad': all(bg(), field(4, GRASS), path('M40 18 L80 18 L72 52 C84 58 86 76 78 88 C70 100 50 100 42 88 C34 76 36 58 48 52 Z', SEA, C.ink, 1.4), path('M46 24 L74 24 L68 54 C78 60 80 74 74 84 C68 94 52 94 46 84 C40 74 42 60 52 54 Z', '#5f9a46', C.ink, 1.6), ring(60, 70, 34),
    greyed(at(102, 26, 1, circle(0, 0, 13, SEA, C.ink, 1.2), circle(0, 0, 9, '#5f9a46', C.ink, 1.4)))),
  'ostas.gravfigur': all(bg(), path('M4 112 L4 86 C30 66 90 66 116 86 L116 112 Z', '#7fb36a', C.ink, 1.4), haniwa(28, 98, 1.3), haniwa(52, 90, 1.3), haniwaHorse(86, 94, 1.2), ring(52, 70, 22)),
  // 2413 Japans samurajtid
  'ostas.samuraj': all(bg('#f3ece2'), ground, fig(60, RED, 'calm', { bottom: '#3d3f4a' }), on(60, 1, armor(RED), topknot(), swords), castleJ(100, 112, 0.42)),
  'ostas.krigarklass': all(bg('#f3ece2'), path('M60 14 L96 50 L24 50 Z', '#e9c46a', C.ink, 1.4), at(60, 44, 0.9, line('M-14 -2 L10 -14', C.black, 3), line('M-10 -6 L14 -10', C.black, 2.4)), at(60, 34, 0.55, kabuto),
    greyed(rect(18, 54, 84, 18, '#d9cbb0', 0, C.ink, 1.2), rect(10, 76, 100, 18, '#d9cbb0', 0, C.ink, 1.2), ...[26, 42, 58, 74, 90].map((x) => stand(x, 72, 0.18, fig(60, C.grey, 'calm'))), ...[18, 34, 50, 66, 82, 98].map((x) => stand(x, 94, 0.18, fig(60, C.grey, 'calm')))), ring(60, 36, 20)),
  'ostas.hovadel': all(bg('#f6eedc'), field(98, '#e9ddc4'), hallC(96, 98, 0.5), robed(46, '#8a6bbf', 'calm', { h: 0.9 }, eboshi, path('M-20 -10 L20 -10 L22 46 L-22 46 Z', '#c7b3e6', C.ink, 1.2), path('M-14 -41 L-27 -16 L-25 -4 L-15 -8 Z M14 -41 L27 -16 L25 -4 L15 -8 Z', '#c84a7a', C.ink, 1.4)), fan(28, 84, 1, C.white)),
  'ostas.shogun': all(bg('#f3ece2'), rect(4, 20, 112, 50, C.white, 0, null), line('M4 20 L116 20 M4 70 L116 70', C.ink, 1.2), mon(30, 44, 9), mon(90, 44, 9), field(96, '#c9b88a'),
    rect(48, 92, 24, 6, WOOD, 1, C.ink, 1), fig(60, RED, 'calm', { h: 0.82, bottom: '#3d3f4a' }), on(60, 0.82, armor(RED), kabuto), reach(60, 0.82, 1, 80, 62), fan(84, 60, 1.1, C.gold),
    stand(20, 112, 0.42, robed(60, '#3d4a6a', 'calm', {}, topknot())), stand(100, 112, 0.42, robed(60, '#3d4a6a', 'calm', {}, topknot())), ring(60, 50, 16)),
  'ostas.shogunat': all(sea(4), japanMap('#b9d89a', '#b9d89a', '#b9d89a', '#b9d89a'), ...[[96, 22], [86, 40], [22, 98], [46, 98], [50, 88]].map(([x, y]) => all(dash(`M70 62 L${x} ${y}`, RED, 1.4, '3 2'), circle(x!, y!, 2.6, RED, C.ink, 0.8))),
    castleJ(70, 70, 0.3), at(70, 74, 0.5, kabuto), ring(70, 54, 19),
    greyed(at(18, 66, 1, houseJ(0, 0, 0.8), stand(0, -12, 0.22, robed(60, '#c9c0a8', 'calm', {}, eboshi)))), dash('M28 62 L54 66', C.grey, 1, '1 3'),
    ...[[82, 108], [96, 108], [110, 108]].map(([x, y]) => stand(x!, y!, 0.22, robed(60, '#3d4a6a', 'calm', {}, topknot()))), rect(74, 108, 42, 4, WOOD, 1, C.ink, 0.8)),
  'ostas.tyfon': all(rect(4, 4, 112, 108, '#9ab0c0', 3, null), sea(70, '#5f8fae'), path('M60 34 m-26 0 a26 18 0 1 1 52 0 a20 13 0 1 1 -40 2 a13 8 0 1 1 26 -2', 'none', C.white, 3.4), circle(60, 34, 4, '#9ab0c0', C.ink, 1),
    path('M4 76 C20 62 30 86 46 72 C62 58 72 86 88 70 C100 60 110 74 116 66 L116 84 L4 84 Z', '#3f6f90', null), junk(30, 86, 0.9, true), junk(84, 92, 0.8, true), rain(10, 54, 100, '#e4f1fa'), rain(14, 62, 96, '#e4f1fa'), waves(8, 112, 100, C.white)),
  'ostas.hederskodex': all(bg('#f3ece2'), scroll(46, 60, 50, 60, all(at(34, 46, 0.8, line('M-10 6 L10 -6', C.black, 2.6)), circle(58, 46, 5, RED, C.ink, 1), lines(26, 62, 40, 4, 6, '#5a4a3a'))),
    stand(98, 112, 0.6, fig(60, '#3d4a6a', 'calm', { bottom: '#2f3a55' }), on(60, 1, topknot(), swords)), okC(98, 30, 7)),
  'ostas.länsfurste': all(bg(), field(90), castleJ(86, 90, 0.72), banner(10, 112, 44, C.navy), banner(30, 112, 44, C.navy), stand(52, 112, 0.7, robed(60, C.navy, 'calm', {}, topknot(), mon(0, -30, 5), swords)),
    stand(22, 112, 0.42, robed(60, '#5a6a8a', 'calm', {}, topknot())), ring(52, 60, 16)),
  // 2414 Edo-periodens samhälle
  'ostas.ståndssamhälle': all(bg('#f3ece2'), path('M14 112 L14 26 L106 26 L106 112 Z', '#efe2c4', C.ink, 1.6), path('M10 26 L60 8 L110 26 Z', ROOF, C.ink, 1.4),
    ...[48, 70, 92].map((y) => rect(14, y - 2, 92, 4, '#8a6a3a', 0, C.ink, 1.1)),
    ...[24, 42, 60, 78, 96].map((x) => stand(x, 46, 0.18, fig(60, RED, 'calm', { bottom: '#3d3f4a' }), on(60, 1, topknot()))),
    ...[24, 42, 60, 78, 96].map((x) => stand(x, 68, 0.18, fig(60, '#5a7aa8', 'calm'), on(60, 1, kasa()))),
    ...[24, 42, 60, 78, 96].map((x) => stand(x, 90, 0.18, fig(60, '#7a5a3a', 'calm'))),
    ...[24, 42, 60, 78, 96].map((x) => stand(x, 112, 0.18, fig(60, '#4f9d69', 'calm'))),
    ...[48, 70, 92].map((y, i) => at(i % 2 ? 36 : 84, y, 0.9, rect(-5, -3, 10, 8, C.gold, 1.5, C.ink, 1), path('M-3 -3 L-3 -7 C-3 -11 3 -11 3 -7 L3 -3', 'none', C.ink, 1.4)))),
  'ostas.fredstid': all(bg(), field(84), at(30, 84, 1, rect(-3, -30, 6, 30, '#7a5a3a', 1, C.ink, 1), circle(0, -38, 16, '#f6c9d4', C.ink, 1.3), circle(-10, -30, 9, '#f6c9d4', null), circle(10, -31, 9, '#f6c9d4', null)), rect(42, 92, 40, 8, '#c84a4a', 1, C.ink, 1),
    stand(50, 96, 0.5, robed(60, '#4f9d69', 'laugh', {}, topknot())), stand(74, 96, 0.5, robed(60, '#c84a7a', 'smile', { hairStyle: 'long' })), at(62, 90, 0.6, line('M-14 2 L14 -2', C.black, 3)),
    greyed(at(100, 30, 0.6, line('M-12 -12 L12 12 M12 -12 L-12 12', C.black, 4), circle(0, 0, 4, C.grey, null))), ban(100, 30, 12, 2.4)),
  'ostas.borgstad': all(bg(), field(60, '#9ccc7a'), hill(60, 76, 34, 26, GRASS2), castleJ(60, 64, 0.62), ...[[14, 88], [30, 96], [50, 100], [70, 100], [90, 96], [106, 88], [22, 108], [44, 112], [76, 112], [98, 108]].map(([x, y]) => houseJ(x!, y!, 0.55)), oval(60, 84, 54, 26)),
  'ostas.värdshus': all(bg(), field(100, '#d9c08a'), at(50, 100, 1.2, rect(-30, -34, 60, 34, '#e9dcc0', 0, C.ink, 1.3), line('M-30 -17 L30 -17 M-10 -34 L-10 0 M10 -34 L10 0', WOOD, 1.2), path('M-38 -34 L38 -34 L28 -46 L-28 -46 Z', ROOF, C.ink, 1.3), rect(-8, -16, 16, 10, '#3d4a6a', 0, C.ink, 1), line('M-3 -16 L-3 -6 M3 -16 L3 -6', '#5a6a8a', 1)),
    lantern(20, 76, 1.4), lantern(80, 76, 1.4), stand(100, 112, 0.5, fig(60, '#7a5a3a', 'smile'), on(60, 1, kasa()), line('M20 -30 L20 48', WOOD, 2.4)), arrow(90, 104, 70, 104, HL, 2.2)),
  'ostas.träsnitt': all(bg('#f3ece2'), rect(8, 56, 46, 40, '#c08a52', 2, C.ink, 1.4), path('M14 86 C20 70 30 66 40 72 C34 72 30 78 34 84 C40 80 46 84 48 90 L14 90 Z', '#9a6a3a', C.ink, 1), line('M12 60 l6 4 M44 62 l6 4', '#9a6a3a', 1),
    rect(64, 30, 46, 60, C.white, 1, C.ink, 1.4), path('M68 80 C74 60 86 52 98 60 C90 60 86 66 90 72 C96 66 104 70 106 78 L106 86 L68 86 Z', '#2f5fa0', C.ink, 1), path('M90 72 l2 -3 l2 2 l2 -3 l2 2', 'none', C.white, 1.2), path('M80 50 L86 40 L92 50 Z', C.white, C.ink, 1), arrow(56, 74, 64, 70, HL, 2.4), circle(30, 104, 6, '#5a3a1a', C.ink, 1)),
  'ostas.tempelskola': all(bg('#f6eedc'), rect(4, 80, 112, 32, '#d9c9a0', 0, null), line('M4 92 L116 92 M40 80 L40 112 M80 80 L80 112', '#b8a478', 1), path('M4 4 L116 4 L116 20 L4 20 Z', ROOF, null), rect(4, 20, 112, 4, WOOD, 0, null),
    ...[26, 60, 94].map((x, i) => all(rect(x - 14, 84, 28, 6, WOOD, 1, C.ink, 1.1), stand(x, 92, 0.34, robed(60, ['#d64545', '#3f6fb5', '#4f9d69'][i]!, 'calm', { hairStyle: i === 1 ? 'long' : 'short' })), rect(x - 6, 80, 12, 4, C.white, 0.5, C.ink, 0.6), line(`M${x + 6} 74 L${x + 10} 82`, C.black, 1.4))),
    stand(104, 80, 0.4, robed(60, '#5a5a6a', 'smile', { hair: '#d0d0d0' })), scroll(22, 46, 16, 20, lines(16, 40, 12, 3, 5, C.ink))),
  // 2415 Meijirestaurationen
  'ostas.ojämlik': all(bg('#f3ece2'), field(104, '#d9cbb0'), rect(14, 58, 26, 46, C.gold, 2, C.ink, 1.4), line('M14 70 L40 70 M14 82 L40 82 M14 94 L40 94', '#b88a20', 1.2),
    stand(27, 58, 0.42, fig(60, '#8a6bbf', 'laugh')), at(27, 14, 1, coin(-5, 0), coin(5, 0), coin(0, -5)),
    stand(58, 112, 0.42, fig(60, '#9a8a7a', 'frown')), at(68, 106, 1, path('M-6 -4 L6 -4 C6 2 2 4 0 4 C-2 4 -6 2 -6 -4 Z', '#c9b8a0', C.ink, 1)), ring(42, 72, 34),
    greyed(rect(82, 92, 12, 12, C.gold, 1, C.ink, 1), rect(100, 92, 12, 12, C.gold, 1, C.ink, 1), stand(88, 92, 0.3, fig(60, C.grey, 'smile')), stand(106, 92, 0.3, fig(60, C.grey, 'smile'))), okC(97, 30, 6)),
  'ostas.kejsarmakt': all(bg('#fdf3d2'), ...Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return line(`M${f1(60 + Math.cos(a) * 24)} ${f1(46 + Math.sin(a) * 24)} L${f1(60 + Math.cos(a) * 52)} ${f1(46 + Math.sin(a) * 52)}`, 'rgba(242,193,78,0.8)', 3); }),
    throne(60, 92, 1.3), stand(60, 92, 0.62, robed(60, '#2f3a55', 'calm', {}, rect(-9, -72, 18, 8, C.black, 1, C.ink, 1))), ...[14, 30, 90, 106].map((x) => stand(x, 112, 0.3, robed(60, '#7a6a5a', 'calm', {}))), field(108, '#e9ddc4'), ring(60, 50, 22)),
  'ostas.restauration': all(bg('#f3ece2'), stand(30, 112, 0.66, fig(60, RED, 'calm', { bottom: '#3d3f4a', grey: true }), on(60, 1, kabuto)), stand(90, 112, 0.66, robed(60, '#2f3a55', 'smile', {}, rect(-9, -72, 18, 8, C.black, 1, C.ink, 1))),
    at(60, 40, 1, circle(0, 0, 9, IMP, C.ink, 1.3), ...Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return ellipse(f1(Math.cos(a) * 11), f1(Math.sin(a) * 11), 4, 2.4, IMP, C.ink, 0.6); }), circle(0, 0, 4, IMP2, null)),
    path('M40 54 C46 66 74 66 80 54', 'none', HL, 2.4), path('M76 52 L81 54 L78 59', 'none', HL, 2.4), path('M80 28 C74 16 46 16 40 28', 'none', C.grey, 1.6), path('M44 30 L40 28 L41 24', 'none', C.grey, 1.6)),
  'ostas.prefektur': all(sea(4), japanMap(LAND2, LAND2, LAND2, LAND2), line('M40 86 L46 94 M54 76 L60 86 M64 66 L72 74 M74 52 L84 58 M80 44 L90 44', C.ink, 1), path('M54 76 L60 86 L46 94 L40 86 C46 82 50 80 54 76 Z', HL, C.ink, 1.2), ring(50, 86, 12)),
  'ostas.studieresa': all(bg(), field(96, '#cfcac0'), at(30, 96, 1, rect(-24, -40, 48, 40, '#efe6d2', 0, C.ink, 1.2), path('M-28 -40 L0 -54 L28 -40 Z', '#c9b48a', C.ink, 1.2), ...[-16, -6, 4, 14].map((d) => rect(d - 2, -36, 4, 34, '#d9cbb0', 0, C.ink, 0.8))),
    stand(66, 112, 0.6, fig(60, C.dark, 'smile', { bottom: C.dark }), on(60, 1, path('M-11 -62 L11 -62 L9 -72 L-9 -72 Z', C.black, C.ink, 1))), stand(92, 112, 0.6, robed(60, '#3d4a6a', 'calm', {}, topknot())),
    reach(66, 0.6, 1, 74, 80), rect(72, 72, 10, 12, C.white, 1, C.ink, 1), at(100, 30, 0.7, path('M-30 0 L30 0 L24 10 L-24 10 Z', C.dark, C.ink, 1.2), rect(-8, -14, 6, 14, RED, 1, C.ink, 1), line('M6 -10 L6 0 M6 -10 L16 0', C.ink, 1.2)), dash('M100 46 C80 60 60 40 40 52', HL, 1.4)),
  // 2416 Koreas historiska kungadömen
  'ostas.guldkrona': all(bg('#2f3340'), at(60, 92, 1.4, rect(-26, -10, 52, 10, C.gold, 1, C.ink, 1.4), ...[-18, 0, 18].map((d) => path(`M${d - 2} -10 L${d - 2} -46 L${d + 2} -46 L${d + 2} -10 M${d} -22 L${d - 8} -30 M${d} -22 L${d + 8} -30 M${d} -34 L${d - 7} -42 M${d} -34 L${d + 7} -42`, 'none', C.gold, 2.4)),
    ...[-24, -12, 12, 24].map((d) => line(`M${d} -10 L${d} -2`, C.gold, 1)), ...[-20, -10, 0, 10, 20].map((d, i) => all(line(`M${d} 0 L${d} ${8 + (i % 2) * 4}`, C.gold, 0.8), path(`M${d - 1.6} ${8 + (i % 2) * 4} C${d - 3} ${12 + (i % 2) * 4} ${d + 3} ${12 + (i % 2) * 4} ${d + 1.6} ${8 + (i % 2) * 4} Z`, JADE, C.ink, 0.5)))), sparkle(22, 26, 3, C.yellow), sparkle(98, 30, 3, C.yellow)),
  'ostas.seladon': all(bg('#f3ece2'), rect(34, 100, 52, 12, WOOD, 2, C.ink, 1.3), path('M52 100 C40 92 36 70 46 54 C50 46 48 40 52 34 L68 34 C72 40 70 46 74 54 C84 70 80 92 68 100 Z', CELADON, C.ink, 1.6), rect(50, 28, 20, 6, CELADON, 2, C.ink, 1.3),
    path('M52 70 l8 -6 l8 6 M56 66 l-6 -4 M64 66 l6 -4', 'none', C.white, 1.3), circle(60, 82, 3, 'none', '#5a8a7a', 1), path('M48 56 C52 54 54 58 52 60 M70 56 C68 54 66 58 68 60', 'none', '#5a8a7a', 1), sparkle(84, 50, 3)),
  'ostas.rörliga-typer': all(bg('#f3ece2'), rect(8, 54, 60, 50, WOOD, 2, C.ink, 1.4), ...Array.from({ length: 5 }, (_, r) => all(...Array.from({ length: 6 }, (_, c) => all(rect(12 + c * 9, 58 + r * 9, 8, 8, '#8a8f98', 1, C.ink, 0.8), line(`M${14 + c * 9} ${60 + r * 9} L${18 + c * 9} ${64 + r * 9} M${18 + c * 9} ${60 + r * 9} L${15 + c * 9} ${63 + r * 9}`, C.ink, 0.6))))),
    at(42, 30, 1, rect(-4, -4, 8, 8, '#8a8f98', 1, C.ink, 1), line('M-2 -2 L2 2 M2 -2 L-1 1', C.ink, 0.8)), arrow(46, 40, 48, 54, HL, 2), rect(78, 40, 34, 46, PAPER, 1, C.ink, 1.3), ...Array.from({ length: 5 }, (_, r) => line(`M84 ${48 + r * 7} l3 3 m2 -3 l-3 3 m6 -3 l3 3 m2 -3 l-2 3 m6 -3 l3 3 m2 -3 l-3 3`, C.ink, 0.9)), arrow(68, 70, 78, 64, HL, 2.2)),
  'ostas.regnmätare': all(rect(4, 4, 112, 108, '#b8c8d4', 3, null), field(96, '#a0a8a0'), cloud(40, 20, 1.2, '#e4ecf2'), cloud(84, 16, 1, '#e4ecf2'), rain(20, 34, 80, '#3f7fb0'), rain(24, 46, 80, '#3f7fb0'),
    rect(40, 80, 40, 20, STONE, 2, C.ink, 1.4), path('M50 80 L50 46 L70 46 L70 80 Z', BRONZE, C.ink, 1.5), ellipse(60, 46, 10, 3, '#9fd0ec', C.ink, 1.2), line('M50 56 L54 56 M50 64 L54 64 M50 72 L54 72', BRONZE2, 1.4), at(90, 104, 1, rect(-2, -40, 4, 40, '#e8d8b0', 1, C.ink, 1), line('M-2 -32 L2 -32 M-2 -24 L2 -24 M-2 -16 L2 -16 M-2 -8 L2 -8', C.ink, 1)), ring(60, 62, 22)),
  'ostas.tribut': all(bg('#f6eedc'), rect(4, 96, 112, 16, RED, 0, null), throne(92, 100, 1.1), robed(92, IMP, 'calm', { h: 0.74 }, crownE),
    stand(36, 112, 0.6, robed(60, '#3f6f8a', 'calm', {}, rect(-9, -70, 18, 6, C.black, 1, C.ink, 1))), at(62, 96, 1, rect(-10, -12, 20, 12, RED2, 1, C.ink, 1.2), rect(-12, -14, 24, 3, C.gold, 1, C.ink, 0.9)), bolt(60, 80, '#3f6fb5'), bolt(66, 74, '#d64545'),
    arrow(46, 70, 70, 70, HL, 2.4)),
  'ostas.sköldpaddsskepp': all(bg(), sea(76), waves(8, 112, 84), waves(12, 112, 96), waves(6, 112, 106), turtleShip(56, 86, 1.25), cloud(22, 24, 0.7), cloud(96, 20, 0.6)),
  // 2417 Modern östasiatisk historia
  'ostas.annektera': all(sea(4), path('M4 40 C30 30 60 34 84 30 L84 112 L4 112 Z', '#d98a6a', C.ink, 1.4), path('M84 30 C96 28 108 34 116 30 L116 112 L84 112 Z', '#d98a6a', C.ink, 1.4), dash('M84 30 L84 112', C.ink, 1.4, '3 3'),
    arrow(54, 70, 100, 70, HL, 3), greyed(at(100, 18, 1, rect(-14, -8, 28, 16, '#a8c98a', 2, C.ink, 1), rect(-30, -8, 14, 16, '#d98a6a', 2, C.ink, 1), line('M-16 -8 L-16 8', C.ink, 1.4))), arrow(78, 18, 86, 18, C.grey, 1.6)),
  'ostas.kolonialstyre': all(bg(), field(92, '#d9c08a'), at(62, 92, 1, rect(-34, -34, 68, 34, '#efe6d2', 0, C.ink, 1.4), path('M-40 -34 L0 -50 L40 -34 Z', '#c9b48a', C.ink, 1.4), ...[-26, -14, 14, 26].map((d) => rect(d - 2.4, -32, 4.8, 30, '#d9cbb0', 0, C.ink, 0.9)), rect(-8, -22, 16, 22, '#5a4a3a', 0, C.ink, 1)),
    flagGen(62, 42, 30, '#3f6fb5', C.white), stand(62, 92, 0.34, fig(60, C.dark, 'calm', { bottom: C.dark }), on(60, 1, path('M-11 -62 L11 -62 L9 -70 L-9 -70 Z', C.black, C.ink, 1))),
    ...[[16, 112], [30, 112], [94, 112], [108, 112]].map(([x, y]) => stand(x!, y!, 0.3, fig(60, '#7a8a6a', 'frown'))), at(14, 40, 0.6, line('M0 0 L0 -26', '#7a5a3a', 3), path('M0 -26 C-10 -30 -14 -24 -16 -20 M0 -26 C10 -30 14 -24 16 -20 M0 -26 C-4 -36 4 -36 6 -32', 'none', '#4f9d3a', 3)),
    at(104, 22, 0.8, rect(-10, -10, 20, 18, C.white, 1, C.ink, 1), rect(-10, -10, 20, 5, RED, 0, null), rect(-7, -9, 20, 18, 'none', 1, C.ink, 0.8), rect(-4, -8, 20, 18, 'none', 1, C.ink, 0.8)), arrow(48, 70, 30, 84, HL, 2), arrow(76, 70, 94, 84, HL, 2)),
  'ostas.folkrepublik': all(bg('#f3ece2'), rect(22, 58, 76, 34, '#e9e2d0', 0, C.ink, 1.4), path('M16 58 L104 58 L94 46 L26 46 Z', '#c9573c', C.ink, 1.3), ...[30, 42, 54, 66, 78, 90].map((x) => rect(x - 2.4, 60, 4.8, 32, '#d9cbb0', 0, C.ink, 0.9)),
    circle(60, 24, 16, C.white, C.ink, 1.4), ...[[52, 18], [60, 16], [68, 18], [50, 28], [58, 26], [66, 28], [56, 34], [64, 34]].map(([x, y]) => circle(x!, y!, 2.6, [C.orange, C.denim, C.green, C.purple][(x! + y!) % 4]!, C.ink, 0.6)), arrow(60, 42, 60, 48, HL, 2),
    ...[14, 28, 42, 56, 70, 84, 98, 108].map((x, i) => stand(x, 112, 0.24, fig(60, ['#3f6fb5', '#4f9d69', '#ef8a3c', '#8a6bbf'][i % 4]!, 'smile'))), field(110, '#d9cbb0'),
    greyed(at(100, 22, 1, path('M-8 0 L-8 -8 L-4 -4 L0 -10 L4 -4 L8 -8 L8 0 Z', C.gold, C.ink, 1))), ban(100, 18, 10, 2.2)),
  'ostas.kulturrevolutionen': all(bg('#f3ece2'), rect(4, 4, 112, 26, RED, 0, null), ...[20, 50, 80, 104].map((x) => star(x, 17, 4, C.yellow)),
    ...[24, 52, 80].map((x, i) => all(fig(x, OLIVE, 'angry', { h: 0.7, bottom: OLIVE, hairStyle: i === 1 ? 'long' : 'short' }), on(x, 0.7, rect(-15, -34, 6, 5, RED, 0, null)), reach(x, 0.7, 1, x + 12, 46), rect(x + 9, 38, 7, 9, RED, 1, C.ink, 1))),
    at(104, 106, 0.8, rect(-10, -4, 20, 4, STONE, 1, C.ink, 1), path('M-6 -4 L-6 -22 C-6 -30 6 -30 6 -22 L6 -4 Z', STONE, C.ink, 1.2), line('M-6 -14 L2 -16 L6 -12', C.ink, 1.4))),
  'ostas.delning': all(sea(4), path(KOREA, '#a8c98a', C.ink, 1.4), path('M40 20 C52 16 70 18 78 24 C76 34 82 44 80 54 L42 50 C46 44 38 40 40 34 Z', '#d98a6a', C.ink, 1.4), line('M36 51 L84 55', C.ink, 2.6), dash('M30 50 L90 56', HL, 2.4, '4 3'),
    stand(98, 44, 0.24, fig(60, C.grey, 'frown')), stand(98, 76, 0.24, fig(60, C.grey, 'frown', { hairStyle: 'long' })), line('M98 50 L98 60', C.ink, 0.8)),
  'ostas.Koreakriget': all(bg('#e9e4d8'), path(KOREA, '#cfd8b8', C.ink, 1.4), line('M42 52 L82 56', C.ink, 1.6), arrow(56, 34, 58, 86, '#c8372d', 3), arrow(70, 86, 66, 40, '#3f6fb5', 3), tank(30, 104, 0.7), soldier(98, OLIVE, 'calm', 0.5), T(30, 18, '1950', 10, C.ink), T(92, 18, '1953', 10, C.ink), line('M44 15 L78 15', C.ink, 1.4)),
  'ostas.demilitariserad-zon': all(bg(), rect(4, 40, 112, 72, GRASS, 0, null), rect(4, 62, 112, 22, '#b9dc94', 0, null), fence(62), fence(84), ...[[26, 72], [60, 70], [92, 74]].map(([x, y]) => all(path(`M${x} ${y} l-3 -2 l3 -1 l3 1 Z`, C.white, C.ink, 0.6))), sparkle(46, 74, 2.4, C.white),
    stand(30, 58, 0.36, soldier(60, OLIVE)), stand(90, 58, 0.36, soldier(60, OLIVE)), stand(30, 112, 0.36, soldier(60, '#5a6a8a')), stand(90, 112, 0.36, soldier(60, '#5a6a8a')), ban(108, 73, 6, 1.8), line('M104 70 L112 76', C.black, 1.4)),
  'ostas.höghastighetståg': all(bg(), path('M60 66 L84 30 L108 66 Z', '#8fa4c0', C.ink, 1.3), path('M77 40 L84 30 L91 40 L87 38 L84 41 L80 38 Z', C.white, null), field(80, '#9ccc7a'), rect(4, 84, 112, 6, C.grey, 0, C.ink, 1), line('M4 90 L116 90', C.dark, 1.6),
    shinkansen(54, 84, 0.95), line('M4 64 L22 64 M8 70 L24 70 M2 76 L18 76', C.grey, 1.6)),
  'ostas.demokratisering': all(bg('#f3ece2'), greyed(stand(24, 112, 0.56, soldier(60, C.grey, 'angry')), at(24, 30, 0.8, path('M-6 -4 L-6 -12 C-6 -20 6 -20 6 -12 L6 -4', 'none', C.ink, 2), rect(-9, -4, 18, 14, C.grey, 2, C.ink, 1.2))),
    arrow(42, 70, 60, 70, HL, 3), ballotBox(90, 100, 1.2), stand(74, 112, 0.5, fig(60, '#ef8a3c', 'smile', { hairStyle: 'long' })), reach(74, 0.5, 1, 86, 68), stand(108, 112, 0.5, fig(60, '#4f9d69', 'smile')), sparkle(90, 50, 3)),
};
