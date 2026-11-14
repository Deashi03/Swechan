/**
 * Historia & humaniora → Arkeologi & kulturarv → Historiska föremål, 2321–2327 (0.40): ceramics and
 * vessels, metal objects and jewellery, coins and means of payment, weapons and tools, textiles and leather,
 * written sources, and the function and provenance of objects.
 * Recurring signs: clay in warm terracotta, bronze in orange-brown, iron in dark grey, silver in pale grey
 * with a shine, gold in yellow, parchment in cream, a museum worker in a blue top and a monk in a brown
 * robe. The thing the word names is in full colour and often marked with an orange ring; a grey copy is the
 * contrast. No words or letters (only digits), no brands, no pointing fingers, no religious symbols.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { type Build } from './figures';
import { HL, arm } from './people';
import { P as F, type Mood, drop, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const CLAY = '#c4703e';
const CLAY2 = '#9a5228';
const BRONZE = '#c98b3a';
const BRONZE2 = '#9a6424';
const IRON = '#565b64';
const RUST = '#a4532a';
const SILVER = '#d3d8de';
const SILVER2 = '#9aa3ad';
const GOLD = '#f2c14e';
const GOLD2 = '#c9952a';
const PATINA = '#5fb3a0';
const WOOD = '#a0673d';
const PARCH = '#f3e6c4';
const WAX = '#c43b30';
const SOIL = '#8a6040';
const SOIL2 = '#6e4a30';
const ROBE = '#8a5a34';
const WOOL = '#efe6d2';
const GLAZE = '#3f7fbf';
const WALL = '#f3ede2';
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (x: number, y: number, r: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${r}) scale(${s})`, ...k);

// ── Figures ──────────────────────────────────────────────────────────
const ground = line('M4 112 L116 112', C.grey2, 2);
const room = (col: string = WALL) => rect(4, 4, 112, 108, col, 3, null);
const soil = (y = 82) => all(rect(4, y, 112, 112 - y, SOIL, 0, null), line(`M4 ${y} L116 ${y}`, SOIL2, 2), ...[[14, 6], [40, 14], [70, 8], [96, 18], [28, 22], [84, 26]].map(([x, d]) => ellipse(x!, y + d!, 2.4, 1.4, SOIL2, null)));
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: f1(ty - 38 * s), sl: f1(x - 13 * s), sr: f1(x + 13 * s) }; };
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
/** A monk: brown robe to the feet with a hood behind the head and a rope belt. */
const monk = (x: number, h = 1, mood: Mood = 'calm') => all(fig(x, ROBE, mood, { h, bottom: ROBE }),
  on(x, h, path('M-14 -42 L14 -42 L18 48 L-18 48 Z', ROBE, C.ink, 1.6), path('M-12 -44 C-14 -56 -8 -66 0 -67 C8 -66 14 -56 12 -44 Z', '#6e4426', C.ink, 1.4), circle(0, -56, 9.4, C.skin, C.ink, 1.6),
    circle(-3.2, -56, 1.1, C.ink, null), circle(3.2, -56, 1.1, C.ink, null), path('M-3 -51.5 Q0 -49.5 3 -51.5', 'none', C.ink, 1.2), line('M-14 -8 L14 -8', '#e6d3a0', 2.4)));
/** A cloak (mantel) over the shoulders of the figure at x. */
const cloakOn = (x: number, h: number, col: string) => on(x, h, path('M-16 -44 C-24 -20 -26 10 -22 30 L22 30 C26 10 24 -20 16 -44 C8 -38 -8 -38 -16 -44 Z', col, C.ink, 1.6), line('M-14 -40 L0 -30 L14 -40', C.ink, 1.2));

// ── Vessels ──────────────────────────────────────────────────────────
/** A round-bellied clay pot standing on (x, y). */
const pot = (x: number, y: number, s = 1, col: string = CLAY, deco: Svg = '') => at(x, y, s, path('M-9 -28 L9 -28 L8 -22 C17 -18 18 -4 9 0 L-9 0 C-18 -4 -17 -18 -8 -22 Z', col, C.ink, 1.6), ellipse(0, -28, 9, 2.4, CLAY2, C.ink, 1.2), deco);
/** Zigzag decoration for pot(). */
const zig = (col: string = C.ink) => all(line('M-14 -16 L-10 -11 L-6 -16 L-2 -11 L2 -16 L6 -11 L10 -16 L14 -11', col, 1.4), line('M-13 -7 L13 -7', col, 1.2), line('M-12 -19 L12 -19', col, 1.2));
/** A jug with a handle (hänkel) on the picture-right side. */
const jug = (x: number, y: number, s = 1, col: string = CLAY, handle: string = col) => at(x, y, s, path('M8 -24 C18 -24 20 -10 9 -6', 'none', C.ink, 5.4), path('M8 -24 C18 -24 20 -10 9 -6', 'none', handle, 3),
  path('M-6 -32 L6 -32 L5 -24 C14 -18 14 -4 8 0 L-8 0 C-14 -4 -14 -18 -5 -24 Z', col, C.ink, 1.6), path('M-6 -32 L-10 -35 L-5 -33 Z', col, C.ink, 1.1));
/** A tall beaker without a handle. */
const beaker = (x: number, y: number, s = 1, col: string = CLAY) => at(x, y, s, path('M-9 -30 L9 -30 C8 -22 5 -18 6 -12 C8 -6 6 0 0 0 C-6 0 -8 -6 -6 -12 C-5 -18 -8 -22 -9 -30 Z', col, C.ink, 1.6),
  line('M-7 -25 L7 -25 M-6 -21 L6 -21', C.ink, 1), line('M-6 -10 L-3 -6 L0 -10 L3 -6 L6 -10', C.ink, 1));
const bowl = (x: number, y: number, s = 1, col: string = CLAY) => at(x, y, s, path('M-14 -10 L14 -10 C13 -2 7 0 0 0 C-7 0 -13 -2 -14 -10 Z', col, C.ink, 1.6), ellipse(0, -10, 14, 2.6, CLAY2, C.ink, 1.1));
const vase = (x: number, y: number, s = 1, col: string = CLAY) => at(x, y, s, path('M-4 -34 L4 -34 L3 -26 C12 -20 12 -4 6 0 L-6 0 C-12 -4 -12 -20 -3 -26 Z', col, C.ink, 1.6));
/** A shard (piece of a pot) with a bit of zigzag on it. */
const shard = (x: number, y: number, s = 1, r = 0, col: string = CLAY) => rot(x, y, r, s, path('M-8 -6 L6 -8 L9 2 L-2 7 L-9 3 Z', col, C.ink, 1.3), line('M-6 -2 L-3 1 L0 -2 L3 1 L6 -2', C.ink, 1));
const table = (y = 84, x1 = 8, x2 = 112) => all(rect(x1, y, x2 - x1, 6, C.tan, 2, C.ink, 1.6), line(`M${x1 + 8} ${y + 6} L${x1 + 8} 112 M${x2 - 8} ${y + 6} L${x2 - 8} 112`, WOOD, 3));
const shelf = (y: number) => all(rect(8, y, 104, 4, WOOD, 1, C.ink, 1.3));
const motion = (x: number, y: number, rx: number) => all(path(`M${x - rx} ${y} A${rx} ${f1(rx * 0.3)} 0 0 0 ${x + rx} ${y}`, 'none', HL, 1.6), arrow(x + rx - 4, y + 1, x + rx + 2, y - 2, HL, 1.6));
const fire = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -22 C7 -15 9 -7 5 -2 C3 0 -3 0 -5 -2 C-9 -7 -6 -15 0 -22 Z', C.orange, C.ink, 1.2), path('M0 -13 C3 -9 4 -5 2 -2 C1 -1 -1 -1 -2 -2 C-4 -5 -3 -9 0 -13 Z', C.yellow, null));
const heat = (x: number, y: number) => line(`M${x} ${y} c-3 -4 3 -6 0 -10 c-3 -4 3 -6 0 -10`, C.orange, 1.6);
const ringMark = (x: number, y: number, r: number) => circle(x, y, r, 'none', HL, 2.4);
const tick = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 7, '#3a9a5a', C.ink, 1.2), path('M-3.2 0 L-0.8 2.6 L3.6 -2.8', 'none', C.white, 1.8));
const cross = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 7, C.red, C.ink, 1.2), line('M-3 -3 L3 3 M3 -3 L-3 3', C.white, 1.8));
const num = (x: number, y: number, n: string, size = 9, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${n}</text>`;
const qm = (x: number, y: number, size = 14, col: string = HL) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">?</text>`;
const glass = (x: number, y: number, r = 11, inner: Svg = '') => all(circle(x, y, r, 'rgba(230,245,255,0.85)', C.ink, 2), inner, line(`M${f1(x + r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r * 1.5)} ${f1(y + r * 1.5)}`, C.dark, 4));

// ── Metal things ─────────────────────────────────────────────────────
const shine = (x: number, y: number, r = 3) => sparkle(x, y, r, C.white);
const coinS = (x: number, y: number, r = 6, col: string = SILVER, edge: string = SILVER2) => all(circle(x, y, r, col, C.ink, 1.2), circle(x, y, f1(r * 0.62), 'none', edge, 1), circle(x, y, f1(r * 0.22), edge, null));
const coinSide = (x: number, y: number, w = 7, col: string = SILVER) => all(ellipse(x, y, w, 2, col, C.ink, 1), ellipse(x, y - 1.2, w, 2, col, C.ink, 1));
const coinStack = (x: number, y: number, n: number, col: string = SILVER) => all(...Array.from({ length: n }, (_, i) => coinSide(x, y - i * 2.6, 7, col)));
/** A twisted ring of metal seen from the front (armring, halsring). */
const twistRing = (x: number, y: number, rx: number, ry: number, col: string, col2: string, sw = 5) => all(ellipse(x, y, rx, ry, 'none', C.ink, sw + 2), ellipse(x, y, rx, ry, 'none', col, sw),
  ...Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; const cx = x + Math.cos(a) * rx, cy = y + Math.sin(a) * ry; return line(`M${f1(cx - 1.6)} ${f1(cy - 1.6)} L${f1(cx + 1.6)} ${f1(cy + 1.6)}`, col2, 1.2); }));
const hammer = (x: number, y: number, s = 1, r = 0) => rot(x, y, r, s, rect(-2, -2, 4, 26, WOOD, 1.5, C.ink, 1.2), rect(-8, -8, 16, 8, IRON, 1.5, C.ink, 1.3));
const anvil = (x: number, y: number, s = 1, col: string = IRON) => at(x, y, s, path('M-18 -24 L14 -24 L24 -20 L12 -18 L8 -12 L6 -4 L12 0 L-12 0 L-6 -4 L-8 -12 L-16 -16 Z', col, C.ink, 1.6), line('M-16 -22 L12 -22', '#8a9099', 1.2));
const glowBar = (x1: number, y1: number, x2: number, y2: number) => all(line(`M${x1} ${y1} L${x2} ${y2}`, C.ink, 5.4), line(`M${x1} ${y1} L${x2} ${y2}`, C.orange, 3.6), line(`M${x1} ${y1} L${x2} ${y2}`, C.yellow, 1.2));
const sparks = (x: number, y: number) => all(...[[-10, -8], [-4, -12], [4, -12], [10, -7], [12, 0], [-12, 0]].map(([a, b]) => line(`M${x + a! * 0.4} ${y + b! * 0.4} L${x + a!} ${y + b!}`, C.orange, 1.6)));
const tongs = (x1: number, y1: number, x2: number, y2: number) => all(line(`M${x1} ${y1} L${x2} ${y2 - 1.6}`, IRON, 2.2), line(`M${x1} ${y1 + 3} L${x2} ${y2 + 1.6}`, IRON, 2.2));
const axeI = (x: number, y: number, s = 1, r = 0, head: string = IRON) => rot(x, y, r, s, rect(-2.2, -4, 4.4, 40, WOOD, 2, C.ink, 1.2), path('M-3 -6 L6 -8 C10 -10 14 -12 16 -14 C18 -6 18 4 16 10 C14 8 10 6 6 4 L-3 4 Z', head, C.ink, 1.3));
const roundShield = (x: number, y: number, r = 22, col: string = '#c94a3a', boss: string = IRON) => all(circle(x, y, r, col, C.ink, 2), circle(x, y, f1(r * 0.86), 'none', '#7a3a2a', 1), line(`M${x - r} ${y} L${x + r} ${y} M${x} ${y - r} L${x} ${y + r}`, '#8a3a2a', 1),
  circle(x, y, f1(r * 0.32), boss, C.ink, 1.6), circle(f1(x - r * 0.1), f1(y - r * 0.1), f1(r * 0.1), 'rgba(255,255,255,0.45)', null));

// ── Writing ──────────────────────────────────────────────────────────
const scrib = (x: number, y: number, w: number, n: number, gap = 5, col: string = C.dark) => all(...Array.from({ length: n }, (_, i) => line(`M${x} ${y + i * gap} q${f1(w * 0.12)} -2 ${f1(w * 0.25)} 0 t${f1(w * 0.25)} 0 t${f1(w * 0.25)} 0 t${f1(w * 0.25 - (i === n - 1 ? w * 0.3 : 0))} 0`, col, 1)));
const page = (x: number, y: number, w: number, h: number, n = 0, col: string = PARCH) => all(rect(x, y, w, h, col, 1.5, C.ink, 1.4), n ? scrib(x + 4, y + 7, w - 8, n) : '');
const quill = (x: number, y: number, s = 1, r = 0) => rot(x, y, r, s, path('M0 0 C-2 -10 2 -30 14 -40 C10 -28 8 -12 2 0 Z', C.white, C.ink, 1.2), line('M0 0 L10 -32', C.grey, 0.8), line('M0 0 L-1 4', C.ink, 1.6));
const inkwell = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 0 L-9 -10 C-9 -13 9 -13 9 -10 L8 0 Z', C.dark, C.ink, 1.4), rect(-4, -16, 8, 5, C.dark, 1, C.ink, 1.2), ellipse(0, -16, 4, 1.4, '#14141a', null));
const seal = (x: number, y: number, r = 7, col: string = WAX) => all(path(`M${x - r} ${y} C${x - r} ${y - r * 1.1} ${x + r} ${y - r * 1.1} ${x + r} ${y} C${x + r * 1.15} ${y + r * 0.6} ${x + r * 0.4} ${y + r * 1.1} ${x} ${y + r} C${x - r * 0.5} ${y + r * 1.1} ${x - r * 1.15} ${y + r * 0.6} ${x - r} ${y} Z`, col, C.ink, 1.2),
  circle(x, y, f1(r * 0.6), 'none', '#8a2420', 1.2), path(`M${x - r * 0.3} ${y + r * 0.2} L${x} ${y - r * 0.35} L${x + r * 0.3} ${y + r * 0.2}`, 'none', '#8a2420', 1.1));
const crown = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 4 L-8 -4 L-4 0 L0 -6 L4 0 L8 -4 L8 4 Z', GOLD, C.ink, 1.1));
const swords = (x: number, y: number, s = 1) => at(x, y, s, line('M-7 -7 L7 7 M7 -7 L-7 7', SILVER2, 2.4), line('M-5 3 L-2 6 M5 3 L2 6', WOOD, 2));
const ship = (x: number, y: number, s = 1) => at(x, y, s, path('M-16 -2 C-12 4 12 4 16 -2 Z', WOOD, C.ink, 1.2), path('M-20 -8 C-18 -4 -16 -2 -16 -2 M20 -8 C18 -4 16 -2 16 -2', 'none', C.ink, 1.2), line('M0 -2 L0 -18', C.ink, 1.2), path('M-8 -16 L8 -16 L8 -6 L-8 -6 Z', '#e8d8b0', C.ink, 1), line('M-8 -12 L8 -12', C.red, 1.4));
const house = (x: number, y: number, s = 1) => at(x, y, s, rect(-12, -14, 24, 14, '#d9b98a', 1, C.ink, 1.3), path('M-15 -14 L0 -24 L15 -14 Z', '#8a5a34', C.ink, 1.3), rect(-3, -8, 6, 8, '#6e4426', 0.5, C.ink, 0.8));
const museum = (x: number, y: number, s = 1) => at(x, y, s, path('M-22 -26 L0 -38 L22 -26 Z', '#e6e0d2', C.ink, 1.4), rect(-20, -26, 40, 4, '#e6e0d2', 0.5, C.ink, 1.2), ...[-15, -5, 5, 15].map((c) => rect(c - 2, -22, 4, 20, '#f4f0e6', 0.5, C.ink, 1)), rect(-22, -2, 44, 4, '#d8d0c0', 0.5, C.ink, 1.2));

// ── More things ──────────────────────────────────────────────────────
const bar = (x: number, y: number, s: number, col: string, top: string) => at(x, y, s, path('M-14 0 L14 0 L10 -9 L-10 -9 Z', col, C.ink, 1.4), path('M-10 -9 L10 -9 L8 -11 L-8 -11 Z', top, C.ink, 1));
/** An oval domed brooch (spännbuckla). */
const brooch = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 0, 13, 9, BRONZE2, C.ink, 1.6), ellipse(0, -1, 10, 6.6, BRONZE, C.ink, 1.2), ellipse(0, -2, 5, 3, '#e8b468', C.ink, 0.9),
  ...[[-7, -2], [7, -2], [0, 4], [0, -7]].map(([a, b]) => circle(a!, b!, 1.2, BRONZE2, null)), circle(-3, -4, 1.2, 'rgba(255,255,255,0.6)', null));
const spiral = (x: number, y: number, r: number) => path(`M${x} ${y} m${f1(-r * 0.25)} 0 a${f1(r * 0.25)} ${f1(r * 0.25)} 0 1 1 ${f1(r * 0.5)} 0 a${f1(r * 0.5)} ${f1(r * 0.5)} 0 1 1 ${f1(-r)} 0 a${f1(r * 0.75)} ${f1(r * 0.75)} 0 1 1 ${f1(r * 1.5)} 0`, 'none', GOLD2, 1.1);
/** An iron knife in three states: 0 whole, 1 rusty, 2 crumbled. */
const knife = (x: number, y: number, state: 0 | 1 | 2) => at(x, y, 1,
  state === 2 ? all(path('M-12 -2 L-6 -3 L-5 2 L-12 2 Z', RUST, C.ink, 1), path('M-3 -3 L3 -2 L2 2 L-3 2 Z', RUST, C.ink, 1), path('M5 -2 L9 -1 L8 2 L5 1 Z', RUST, C.ink, 1), circle(12, 4, 1.4, RUST, null), circle(-8, 6, 1.2, RUST, null))
    : all(path('M-14 -2 L10 -3 L14 0 L-14 3 Z', state === 0 ? '#9aa3ad' : RUST, C.ink, 1.3), state === 1 ? all(circle(-6, 0, 1.6, '#7a3a1a', null), circle(4, -1, 1.4, '#7a3a1a', null), path('M8 -3 L10 0 L7 1 Z', '#e6f2f8', null)) : '', rect(-24, -2.4, 10, 5, WOOD, 1.5, C.ink, 1)));
/** A large silver coin with a simple profile head (no letters). */
const coinBig = (x: number, y: number, r: number) => all(circle(x, y, r, SILVER, C.ink, 1.8), circle(x, y, f1(r * 0.84), 'none', SILVER2, 1.2), ...Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return circle(f1(x + Math.cos(a) * r * 0.92), f1(y + Math.sin(a) * r * 0.92), f1(r * 0.04), SILVER2, null); }),
  at(x, y, r / 22, path('M-6 12 C-10 4 -10 -6 -4 -11 C2 -15 10 -12 10 -5 L12 -1 L9 0 L10 4 L7 5 C7 9 4 10 0 10 L0 13 Z', SILVER2, C.ink, 1.2), path('M-6 -10 C-2 -16 8 -14 10 -7 C4 -10 -2 -9 -6 -10 Z', '#7f8892', null)));
/** A few pieces of hacksilver. */
const hackPieces = (x: number, y: number) => all(path(`M${x - 14} ${y} a7 7 0 0 1 12 -4`, 'none', SILVER, 3.4), path(`M${x - 14} ${y} a7 7 0 0 1 12 -4`, 'none', C.ink, 0.6), path(`M${x} ${y + 2} A6 6 0 0 1 ${x + 12} ${y + 2} Z`, SILVER, C.ink, 1.1),
  rect(x - 10, y + 6, 10, 4, SILVER, 1, C.ink, 1), path(`M${x + 4} ${y + 8} L${x + 14} ${y + 6} L${x + 12} ${y + 12} Z`, SILVER, C.ink, 1), shine(x - 4, y - 4, 2.4));
const basket = (x: number, y: number) => at(x, y, 1, circle(-6, -14, 5, '#d9a057', C.ink, 1), ellipse(5, -13, 7, 3.4, '#9fb4c8', C.ink, 1), circle(0, -18, 4, C.red, C.ink, 1),
  path('M-14 -10 L14 -10 L10 4 L-10 4 Z', '#c9a06a', C.ink, 1.4), line('M-12 -5 L12 -5 M-11 0 L11 0', '#8a6a3a', 1));
/** A small head-and-shoulders person (for circulation scenes). */
const mini = (x: number, y: number, col: string) => all(path(`M${x - 10} ${y + 14} C${x - 10} ${y + 4} ${x + 10} ${y + 4} ${x + 10} ${y + 14} Z`, col, C.ink, 1.4), circle(x, y, 6, C.skin, C.ink, 1.4), path(`M${x - 6} ${y - 1} C${x - 6} ${y - 9} ${x + 6} ${y - 9} ${x + 6} ${y - 1} C${x + 3} ${y - 4} ${x - 3} ${y - 4} ${x - 6} ${y - 1} Z`, C.hair, null));
/** A balance scale centred on x; left pan holds `l`, right pan `r`. */
const scale = (x: number, l: Svg, r: Svg) => all(rect(x - 14, 104, 28, 6, WOOD, 2, C.ink, 1.3), line(`M${x} 104 L${x} 36`, BRONZE2, 3), line(`M${x - 32} 36 L${x + 32} 36`, BRONZE, 3), circle(x, 36, 3, BRONZE2, C.ink, 1),
  line(`M${x - 32} 36 L${x - 40} 64 M${x - 32} 36 L${x - 24} 64 M${x + 32} 36 L${x + 24} 64 M${x + 32} 36 L${x + 40} 64`, C.ink, 0.9), path(`M${x - 42} 64 L${x - 22} 64 C${x - 24} 70 ${x - 40} 70 ${x - 42} 64 Z`, BRONZE, C.ink, 1.2), path(`M${x + 22} 64 L${x + 42} 64 C${x + 40} 70 ${x + 24} 70 ${x + 22} 64 Z`, BRONZE, C.ink, 1.2), l, r);
/** A flattened spherical weight (viktlod). */
const weight = (x: number, y: number, r: number) => all(ellipse(x, y, r, f1(r * 0.8), '#b07a3a', C.ink, 1.3), ellipse(x, f1(y - r * 0.8), f1(r * 0.4), f1(r * 0.16), '#e0a85a', C.ink, 0.8), circle(f1(x - r * 0.4), f1(y - r * 0.2), f1(r * 0.16), 'rgba(255,255,255,0.5)', null));
const sickle = (x: number, y: number) => at(x, y, 1, rect(-2, 0, 4, 14, WOOD, 1.5, C.ink, 1.2), path('M0 0 C10 -4 22 -14 18 -28 C26 -16 18 -2 2 4 Z', '#8a9099', C.ink, 1.3));
const weightLoom = (x: number, y: number) => all(line(`M${x} 86 L${x} ${y - 6}`, C.ink, 0.8), circle(x, y, 6, '#b08a6a', C.ink, 1.3), circle(x, y, 2, WALL, C.ink, 0.8));
/** A speech bubble with sound waves, tail to the picture-left. */
const say = (x: number, y: number) => all(path(`M${x - 14} ${y - 10} L${x + 14} ${y - 10} L${x + 14} ${y + 8} L${x - 4} ${y + 8} L${x - 12} ${y + 14} L${x - 10} ${y + 8} L${x - 14} ${y + 8} Z`, C.white, C.ink, 1.4),
  line(`M${x - 9} ${y - 1} q3 -5 6 0 t6 0 t6 0`, C.navy, 1.6));
const heartS = (x: number, y: number) => path(`M${x} ${y + 4} C${x - 7} ${y - 1} ${x - 4} ${y - 6} ${x} ${y - 2} C${x + 4} ${y - 6} ${x + 7} ${y - 1} ${x} ${y + 4} Z`, C.red, C.ink, 1);
const goblet = (x: number, y: number) => at(x, y, 1, path('M-18 -60 L18 -60 C18 -38 8 -32 3 -30 L3 -10 L14 -4 L14 0 L-14 0 L-14 -4 L-3 -10 L-3 -30 C-8 -32 -18 -38 -18 -60 Z', GOLD, C.ink, 1.8),
  ...[[-8, -48, C.red], [0, -46, '#3f6fb5'], [8, -48, C.green]].map(([a, b, c]) => circle(a as number, b as number, 3, c as string, C.ink, 0.9)), line('M-16 -56 L16 -56', GOLD2, 1.2));
/** A map pin over (x, y). */
const pin = (x: number, y: number) => all(path(`M${x} ${y + 14} C${x - 4} ${y + 6} ${x - 9} ${y + 2} ${x - 9} ${y - 4} C${x - 9} ${y - 10} ${x - 5} ${y - 13} ${x} ${y - 13} C${x + 5} ${y - 13} ${x + 9} ${y - 10} ${x + 9} ${y - 4} C${x + 9} ${y + 2} ${x + 4} ${y + 6} ${x} ${y + 14} Z`, HL, C.ink, 1.4), circle(x, y - 4, 3.2, C.white, null));
const dashed = (d: string, col: string = C.ink, w = 1.4) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-dasharray="3 3" stroke-linecap="round"/>`;

export const HISTORICAL_OBJECT_MOTIFS: Record<string, Svg> = {
  // ── 2321 Keramik och kärl ──
  'fyn.keramik': all(room(), shelf(46), shelf(84), pot(26, 46, 0.9), vase(52, 46, 0.8, '#d98a52'), jug(80, 46, 0.85, CLAY2), bowl(100, 46, 0.6, GLAZE),
    bowl(24, 84, 0.8, '#e0a070'), pot(52, 84, 0.8, CLAY, zig()), beaker(76, 84, 0.8, CLAY2), vase(98, 84, 0.7, '#5a9a7a'), ground),
  'fyn.bägare': all(room('#f6f0e2'), fig(40, C.green, 'smile'), reach(40, 1, 1, 58, 22), beaker(60, 30, 0.7), table(84, 70, 112), greyed(jug(98, 84, 0.7, C.grey)), cross(98, 50, 0.8), tick(60, 6, 0.8), ground),
  'fyn.krukskärva': all(rect(4, 4, 112, 108, '#e6f2f8', 3, null), soil(54), shard(30, 74, 1.4, -10), shard(62, 90, 1.3, 25), shard(90, 70, 1.5, 70, CLAY2), shard(46, 100, 1, 140), shard(98, 98, 1.1, -40),
    ringMark(62, 90, 15), rot(28, 40, 30, 1, rect(-2, 0, 4, 14, WOOD, 1, C.ink, 1), path('M-6 -12 L6 -12 L0 2 Z', SILVER2, C.ink, 1.2))),
  'fyn.pussla-ihop': all(room(), table(92), at(60, 92, 1.8, path('M-9 -28 L9 -28 L8 -22 C17 -18 18 -4 9 0 L-9 0 C-18 -4 -17 -18 -8 -22 Z', CLAY, C.ink, 1), path('M-2 -22 L10 -20 L12 -10 L2 -8 Z', WALL, C.ink, 0.9), line('M-13 -12 L-3 -14 L-6 -4 M5 -2 L8 -12', C.ink, 0.9)),
    shard(98, 30, 1.3, 15), arrow(90, 36, 76, 58, HL, 2.4), path('M104 26 C110 22 116 26 114 32 L108 36 Z', C.skin, C.ink, 1.2), shard(20, 74, 1, -20), shard(30, 86, 0.9, 40)),
  'fyn.drejskiva': all(room(), rect(36, 92, 48, 20, '#8a8f99', 3, C.ink, 1.6), rect(56, 80, 8, 12, IRON, 1, C.ink, 1.2), ellipse(60, 78, 34, 7, '#b9bec6', C.ink, 1.8), path('M48 76 C46 62 52 54 54 50 L66 50 C68 54 74 62 72 76 Z', '#c98a5a', C.ink, 1.6),
    ellipse(60, 50, 6, 1.6, '#9a5a30', C.ink, 1), motion(60, 86, 40), ground),
  'fyn.dreja': all(room(), fig(60, C.denim, 'calm', { h: 1 }), rect(28, 84, 64, 28, '#8a8f99', 3, C.ink, 1.6), ellipse(60, 82, 30, 6, '#b9bec6', C.ink, 1.8), path('M50 80 C49 70 54 64 55 60 L65 60 C66 64 71 70 70 80 Z', '#c98a5a', C.ink, 1.6),
    reach(60, 1, -1, 50, 70), reach(60, 1, 1, 70, 70), motion(60, 92, 34)),
  'fyn.brännugn': all(rect(4, 4, 112, 108, '#dfeef6', 3, null), path('M16 112 L16 70 C16 36 104 36 104 70 L104 112 Z', '#b0866a', C.ink, 2), path('M38 112 L38 84 C38 68 82 68 82 84 L82 112 Z', '#2e2420', C.ink, 1.6),
    fire(48, 110, 0.7), fire(72, 110, 0.6), pot(52, 100, 0.55, '#e0a070'), bowl(70, 98, 0.5, '#e0a070'), rect(54, 20, 12, 20, '#8a6a5a', 1, C.ink, 1.4), heat(56, 16), heat(64, 14), ...[30, 60, 90].map((x) => line(`M${x} 52 L${x + 4} 60`, '#8a6a5a', 1))),
  'fyn.glasyr': all(room(), table(92), greyed(bowl(26, 92, 1.1, C.grey)), arrow(44, 80, 56, 80, HL, 2.6), at(84, 92, 1.8, path('M-14 -10 L14 -10 C13 -2 7 0 0 0 C-7 0 -13 -2 -14 -10 Z', GLAZE, C.ink, 1.2), ellipse(0, -10, 14, 2.6, '#2f5f9a', C.ink, 0.8),
    path('M-10 -7 C-6 -3 -2 -2 2 -2', 'none', 'rgba(255,255,255,0.7)', 1.4)), shine(72, 70, 4), shine(98, 76, 3), drop(84, 98, 1.2, GLAZE), ground),
  'fyn.dekor': all(room(), table(92), pot(40, 92, 1.5, CLAY, all(zig(C.ink), circle(-8, -3, 1.4, C.ink, null), circle(0, -3, 1.4, C.ink, null), circle(8, -3, 1.4, C.ink, null))), sparkle(22, 40, 4), sparkle(58, 34, 3),
    greyed(pot(92, 92, 1.1, C.grey))),
  'fyn.hänkel': all(room(), table(96), jug(56, 96, 2.2, CLAY, GOLD), ringMark(86, 60, 16)),

  // ── 2322 Metallföremål och smycken ──
  'fyn.ädelmetall': all(room(), table(84), bar(36, 84, 1.3, GOLD, '#f8dc8a'), bar(50, 72, 1.1, GOLD, '#f8dc8a'), bar(72, 84, 1.2, SILVER, '#eef1f4'), shine(28, 64, 4), shine(62, 60, 3), shine(80, 70, 3),
    greyed(path('M92 84 C88 78 92 70 100 72 C108 70 110 80 104 84 Z', IRON, C.ink, 1.2), ellipse(98, 77, 3, 2, RUST, null)), cross(100, 58, 0.8), ground),
  'fyn.guldsmed': all(room(), fig(32, C.navy, 'calm'), table(84), rect(50, 76, 22, 8, IRON, 1, C.ink, 1.2), reach(32, 1, 1, 52, 60), hammer(54, 60, 0.55, 60), twistRing(66, 72, 6, 3.4, GOLD, GOLD2, 2.4),
    glass(66, 52, 9), rect(84, 78, 24, 6, '#3a3a4a', 1, C.ink, 1), circle(90, 76, 3, 'none', GOLD, 1.8), circle(98, 76, 3, 'none', SILVER, 1.8), circle(104, 76, 2, GOLD, C.ink, 0.8), shine(74, 66, 3), ground),
  'fyn.armring': all(room('#f6efe4'), path('M4 50 L74 54 C84 52 96 50 104 56 C110 60 108 68 100 68 C92 70 84 68 74 66 L4 70 Z', C.skin, C.ink, 1.8), line('M100 58 L110 60 M100 62 L111 64', C.ink, 1),
    twistRing(70, 60, 6, 15, SILVER, SILVER2, 4.4), shine(62, 42, 4), shine(80, 78, 3), ground),
  'fyn.halsring': all(room('#eef3f6'), path('M18 112 C18 88 38 78 60 78 C82 78 102 88 102 112 Z', '#6f8fb5', C.ink, 2), rect(53, 60, 14, 20, C.skin, 3, C.ink, 1.6), circle(60, 44, 17, C.skin, C.ink, 2),
    path('M43 42 C42 22 78 22 77 42 C70 32 50 32 43 42 Z', C.hair, C.ink, 1.6), circle(54, 45, 1.6, C.ink, null), circle(66, 45, 1.6, C.ink, null), path('M55 52 Q60 55 65 52', 'none', C.ink, 1.4),
    path('M36 78 C40 96 80 96 84 78', 'none', C.ink, 9), path('M36 78 C40 96 80 96 84 78', 'none', GOLD, 6.4), ...[40, 47, 54, 66, 73, 80].map((x) => line(`M${x - 1.4} ${f1(80 + 12 * Math.sin(((x - 36) / 48) * Math.PI) - 1.6)} l2.8 3`, GOLD2, 1.2)),
    circle(55, 92, 3.6, GOLD, C.ink, 1.2), circle(65, 92, 3.6, GOLD, C.ink, 1.2), shine(42, 80, 4), shine(80, 84, 3)),
  'fyn.spännbuckla': all(room('#f3ede2'), path('M14 112 L18 30 C30 22 90 22 102 30 L106 112 Z', '#e9e1cc', C.ink, 2), path('M28 112 L30 40 L90 40 L92 112 Z', '#4f7fb0', C.ink, 1.8), line('M40 40 L36 20 M80 40 L84 20', '#4f7fb0', 3),
    path('M40 54 C48 76 72 76 80 54', 'none', C.ink, 0.8), ...[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((t, i) => circle(f1(40 + 40 * t), f1(54 + 66 * t * (1 - t)), 2.8, [C.yellow, C.red, C.sky, C.green][i % 4]!, C.ink, 0.8)),
    brooch(40, 50, 1.1), brooch(80, 50, 1.1), sparkle(24, 34, 3), sparkle(98, 36, 3)),
  'fyn.dräktnål': all(room('#eef3f6'), path('M4 30 C30 24 60 26 116 40 L116 112 L4 112 Z', '#7a5a8a', C.ink, 2), line('M20 50 C36 60 40 90 34 112 M70 46 C80 70 84 90 82 112', '#5a3a6a', 1.6),
    line('M30 36 L96 98', C.ink, 4.6), line('M30 36 L96 98', SILVER, 3), path('M50 46 C58 50 66 58 72 70 C64 66 56 60 50 56 Z', '#7a5a8a', C.ink, 1.2), circle(26, 32, 12, 'none', C.ink, 6), circle(26, 32, 12, 'none', SILVER, 4), circle(26, 32, 3, SILVER2, C.ink, 1), shine(16, 20, 4)),
  'fyn.filigran': all(room('#f6efe4'), line('M48 8 L52 22 M72 8 L68 22', GOLD2, 1.6), circle(60, 50, 30, GOLD, C.ink, 2), circle(60, 50, 25, 'none', GOLD2, 1.4), ...[[60, 36], [46, 48], [74, 48], [52, 64], [68, 64], [60, 50]].map(([x, y]) => spiral(x!, y!, 5)),
    glass(94, 92, 13, all(spiral(94, 92, 8), spiral(87, 86, 3), spiral(101, 98, 3))), ground),
  'fyn.förgylld': all(room(), table(96), at(24, 92, 0.8, path('M-14 -30 L14 -30 C14 -14 8 -8 3 -6 L3 0 L10 4 L-10 4 L-3 0 L-3 -6 C-8 -8 -14 -14 -14 -30 Z', BRONZE, C.ink, 1.6)), rot(40, 46, 30, 1, rect(-1.6, -4, 3.2, 20, WOOD, 1, C.ink, 1), path('M-3 -4 L3 -4 L2 -12 L-2 -12 Z', GOLD, C.ink, 1)), arrow(40, 74, 54, 74, HL, 2.6),
    at(78, 92, 1.5, path('M-14 -30 L14 -30 C14 -14 8 -8 3 -6 L3 0 L10 4 L-10 4 L-3 0 L-3 -6 C-8 -8 -14 -14 -14 -30 Z', GOLD, C.ink, 1.6), path('M-6 -22 C-4 -18 2 -18 4 -22 C2 -25 -4 -25 -6 -22 Z', BRONZE, C.ink, 0.9), line('M-11 -27 C-10 -18 -6 -12 -2 -10', 'rgba(255,255,255,0.7)', 1.4)), shine(66, 46, 4), shine(96, 52, 3),
    glass(96, 22, 11, all(rect(85, 20, 22, 9, BRONZE, 0, null), rect(85, 17, 22, 3, GOLD, 0, null))), line('M84 42 L80 56', C.ink, 0.8), ground),
  'fyn.ärg': all(room(), table(90), greyed(at(28, 90, 1, path('M-14 -26 L14 -26 L10 0 L-10 0 Z', BRONZE, C.ink, 1.4))), arrow(46, 74, 60, 74, C.grey, 2.2),
    at(86, 90, 1.5, path('M-14 -26 L14 -26 L10 0 L-10 0 Z', BRONZE, C.ink, 1.6), path('M-14 -26 L6 -26 C2 -22 6 -16 12 -16 L10.8 -6 C6 -8 0 -6 -2 0 L-10 0 L-11 -8 C-4 -14 -6 -20 -13 -24 Z', PATINA, null), path('M-14 -26 L14 -26 L10 0 L-10 0 Z', 'none', C.ink, 1.6)),
    ringMark(86, 70, 26), ground),
  'fyn.korrodera': all(rect(4, 4, 112, 108, '#e6f2f8', 3, null), soil(40), knife(26, 76, 0), arrow(42, 76, 50, 76, HL, 2.2), knife(66, 76, 1), arrow(82, 76, 88, 76, HL, 2.2), knife(102, 76, 2)),

  // ── 2323 Mynt och betalningsmedel ──
  'fyn.silvermynt': all(room('#2f3a52'), coinBig(54, 56, 26), coinS(96, 30, 9), coinS(98, 82, 10), coinS(24, 98, 8), coinStack(20, 40, 5), shine(40, 38, 5), shine(102, 76, 3)),
  'fyn.prägla.2': all(room(), rect(30, 86, 30, 26, IRON, 2, C.ink, 1.6), rect(36, 78, 18, 8, '#7a808a', 1, C.ink, 1.3), ellipse(45, 76, 9, 2.6, SILVER, C.ink, 1.2), rect(39, 52, 12, 22, '#7a808a', 1, C.ink, 1.3),
    hammer(58, 42, 1, -70), sparks(45, 76), arrow(68, 84, 80, 84, HL, 2.4), coinBig(98, 84, 13), ground),
  'fyn.myntverk': all(room('#efe6d6'), rect(46, 12, 28, 16, '#bfe3f5', 1, C.ink, 1.4), line('M60 12 L60 28', C.ink, 1), fig(24, C.denim, 'calm', { h: 0.84 }), rect(34, 92, 14, 20, IRON, 1, C.ink, 1.3), ellipse(41, 92, 4, 1.4, SILVER, C.ink, 0.8), reach(24, 0.84, 1, 40, 66), hammer(42, 62, 0.55, -50),
    fig(96, C.green, 'calm', { h: 0.84 }), rect(72, 92, 14, 20, IRON, 1, C.ink, 1.3), ellipse(79, 92, 4, 1.4, SILVER, C.ink, 0.8), reach(96, 0.84, -1, 80, 66), hammer(78, 62, 0.55, 50), coinStack(60, 108, 7), coinS(54, 74, 4), coinS(66, 70, 4), coinS(60, 60, 4)),
  'fyn.betalningsmedel': all(room(), coinS(22, 30, 9), rect(38, 22, 26, 15, '#9fcf9a', 2, C.ink, 1.3), circle(51, 29.5, 4, 'none', '#4f8f4a', 1), rect(12, 54, 24, 15, C.navy, 2, C.ink, 1.3), rect(14, 58, 20, 3, C.dark, 0, null), hackPieces(52, 62),
    arrow(70, 50, 84, 50, HL, 3), basket(98, 64), ground),
  'fyn.i-omlopp': all(room('#f6f2ea'), circle(60, 62, 34, 'none', HL, 2.4), arrow(90, 46, 93, 54, HL, 2.4), arrow(34, 92, 28, 84, HL, 2.4), arrow(72, 96, 62, 96.6, HL, 2.4),
    mini(60, 22, C.orange), mini(24, 78, C.green), mini(96, 78, C.denim), coinS(88, 38, 5), coinS(46, 96, 5), coinS(30, 46, 5)),
  'fyn.viktlod': all(room(), scale(60, hackPieces(32, 58), all(weight(94, 60, 4), weight(102, 61, 3))), weight(28, 104, 6), weight(44, 106, 4.4), path('M76 108 L80 100 L90 100 L94 108 Z', BRONZE, C.ink, 1.2), ringMark(36, 104, 16), ground),
  'fyn.hacksilver': all(room(), table(88), rect(56, 76, 34, 12, '#9a8a78', 1, C.ink, 1.3), twistRing(72, 72, 11, 4, SILVER, SILVER2, 3), axeI(92, 30, 0.8, 30),
    hackPieces(28, 80), shine(30, 68, 3), ground),
  'fyn.silverskatt': all(rect(4, 4, 112, 108, '#dfeef6', 3, null), soil(36), path('M30 36 C30 72 94 72 94 36', SOIL2, C.ink, 1.4), rot(52, 64, -60, 1.3, path('M-9 -28 L9 -28 L8 -22 C17 -18 18 -4 9 0 L-9 0 C-18 -4 -17 -18 -8 -22 Z', CLAY, C.ink, 1.4)),
    ...[[70, 74], [78, 80], [64, 82], [86, 72], [74, 88], [90, 84]].map(([x, y]) => coinS(x!, y!, 4.6)), twistRing(80, 60, 7, 3.4, SILVER, SILVER2, 2.4), shine(76, 68, 4), shine(94, 78, 3), sparkle(60, 20, 4, GOLD), sparkle(80, 16, 3, GOLD)),
  'fyn.gräva-ner': all(rect(4, 4, 112, 82, '#2f3a62', 3, null), circle(98, 20, 7, '#fff2c0', null), soil(86), path('M58 86 C58 104 90 104 90 86', '#3e2a1a', C.ink, 1.4),
    fig(34, C.brown, 'calm'), reach(34, 1, 1, 52, 60), line('M52 60 L70 96', WOOD, 3), path('M66 92 L78 95 L73 106 L64 102 Z', IRON, C.ink, 1.2), pot(102, 86, 0.6), arrow(96, 62, 80, 82, HL, 2.2)),
  'fyn.myntfynd': all(rect(4, 4, 112, 108, '#dfeef6', 3, null), soil(46), coinS(58, 80, 10, '#c9cfa8', SILVER2), ringMark(58, 80, 16), rot(86, 62, 40, 1, rect(-3, -18, 6, 18, WOOD, 1, C.ink, 1.2), rect(-5, 0, 10, 8, '#e8d8a8', 1, C.ink, 1.2)),
    line('M24 46 L24 76', C.ink, 1.6), path('M24 50 L40 55 L24 60 Z', C.yellow, C.ink, 1), num(30, 58, '1', 7), glass(30, 92, 9)),
  'fyn.falskmyntare': all(rect(4, 4, 112, 108, '#2f3550', 3, null), circle(60, 16, 6, 'rgba(242,193,78,0.5)', null), fig(34, C.dark, 'angry'), table(84), reach(34, 1, 1, 54, 74), rect(48, 76, 18, 8, '#8a8f99', 1, C.ink, 1.2), coinS(57, 72, 3.4),
    path('M88 44 A16 16 0 1 0 104 60 L88 60 Z', SILVER, C.ink, 1.6), path('M88 60 L88 44 A16 16 0 0 1 104 60 Z', '#c86a3a', C.ink, 1.6), path('M88 44 A16 16 0 0 1 104 60', 'none', SILVER, 1.6), cross(106, 34, 0.9)),

  // ── 2324 Vapen och verktyg ──
  'fyn.slipsten': all(room(), table(88), rect(26, 78, 60, 10, '#8f949c', 3, C.ink, 1.6), circle(80, 83, 2.4, WALL, C.ink, 1), rot(56, 70, -6, 1, path('M-22 0 L18 -2 L24 2 L-22 4 Z', SILVER, C.ink, 1.3), rect(-38, -2, 16, 6, WOOD, 2, C.ink, 1.2)),
    arrow(44, 56, 30, 56, HL, 1.8), arrow(68, 54, 82, 54, HL, 1.8), sparkle(74, 66, 3, C.white), at(98, 88, 1, path('M-8 0 L-9 -12 L9 -12 L8 0 Z', '#bfe3f5', C.ink, 1.2)), ground),
  'fyn.skära-redskap': all(rect(4, 4, 112, 108, '#e6f2f8', 3, null), ...[58, 66, 74, 82, 90, 98, 106].map((x) => all(line(`M${x} 112 L${x + 2} 64`, '#c9a03a', 1.8), ellipse(x + 2, 60, 2.6, 6, C.gold, C.ink, 0.9))),
    fig(28, C.brown, 'calm'), reach(28, 1, 1, 46, 78), sickle(46, 78), ground),
  'fyn.eldstål': all(room('#2f3550'), path('M28 104 C32 94 50 94 56 104 Z', '#c9a06a', C.ink, 1.2), fire(42, 102, 0.6), path('M74 50 C64 46 60 60 66 66 C70 70 84 68 88 60 Z', '#6f7480', C.ink, 1.3),
    path('M84 30 C96 30 102 40 98 46 L72 48 C70 42 72 32 84 30 Z', 'none', C.ink, 5), path('M84 30 C96 30 102 40 98 46 L72 48 C70 42 72 32 84 30 Z', 'none', IRON, 3), ringMark(86, 40, 17), sparks(62, 66), line('M58 72 L50 86 M62 74 L56 88', C.orange, 1.4)),
  'fyn.smida': all(room('#efe6d6'), fig(34, C.brown, 'angry'), on(34, 1, path('M-12 -36 L12 -36 L13 30 L-13 30 Z', '#6e4a30', C.ink, 1.4)), anvil(78, 112, 1.1), glowBar(64, 84, 98, 84), tongs(104, 96, 92, 85), reach(34, 1, 1, 56, 30), hammer(58, 30, 0.9, 200),
    path('M70 22 C80 28 84 44 80 60', 'none', HL, 1.8), sparks(82, 82)),
  'fyn.städ': all(room('#efe6d6'), rect(42, 100, 36, 12, WOOD, 1, C.ink, 1.4), anvil(58, 100, 2), hammer(100, 70, 0.6, 30), ringMark(58, 74, 34), ground),
  'fyn.sköldbuckla': all(room(), roundShield(60, 60, 42), ringMark(60, 60, 18), shine(54, 54, 3)),
  'fyn.ringbrynja': all(room(), line('M60 104 L60 20 M44 112 L60 104 L76 112', WOOD, 3), path('M30 30 L48 22 L72 22 L90 30 L96 56 L82 58 L80 44 L80 100 L40 100 L40 44 L38 58 L24 56 Z', '#b9bec6', C.ink, 2),
    ...Array.from({ length: 30 }, (_, i) => circle(44 + (i % 6) * 6.6, 34 + Math.floor(i / 6) * 13, 2.6, 'none', IRON, 1)), glass(98, 90, 11, all(...[[92, 86], [98, 86], [104, 86], [95, 92], [101, 92]].map(([x, y]) => circle(x!, y!, 3, 'none', IRON, 1.4))))),

  // ── 2325 Textilier och läder ──
  'fyn.sländtrissa': all(room(), fig(40, C.green, 'calm'), reach(40, 1, 1, 60, 28), path('M58 18 C64 12 72 18 66 26 C62 30 56 26 58 18 Z', WOOL, C.ink, 1.2), line('M64 28 L70 70', C.ink, 1), line('M70 66 L73 108', WOOD, 2.4),
    ellipse(71.6, 88, 9, 3, '#9a8f7a', C.ink, 1.4), ringMark(71.6, 88, 13), motion(72, 100, 10)),
  'fyn.vävtyngd': all(room(), line('M24 112 L34 12 M96 112 L86 12', WOOD, 4), rect(26, 10, 68, 6, WOOD, 2, C.ink, 1.3), rect(34, 16, 52, 30, '#b04a3a', 0, C.ink, 1.2), line('M34 26 L86 26 M34 36 L86 36', '#e0b04a', 2),
    ...[38, 44, 50, 56, 62, 68, 74, 80].map((x) => line(`M${x} 46 L${x} 84`, C.ink, 0.8)), ...[42, 54, 66, 78].map((x) => weightLoom(x, 92)), ringMark(60, 92, 26)),
  'fyn.växtfärg': all(room(), fire(46, 112, 0.8), path('M24 70 L68 70 L64 98 L28 98 Z', IRON, C.ink, 1.6), ellipse(46, 70, 22, 4, '#d6a020', C.ink, 1.2), line('M70 40 L114 40', WOOD, 3),
    ...([[80, C.yellow], [92, C.red], [104, '#3f6fb5']] as const).map(([x, c]) => path(`M${x} 40 C${x - 5} 54 ${x - 4} 64 ${x} 70 C${x + 4} 64 ${x + 5} 54 ${x} 40 Z`, c, C.ink, 1.2)),
    at(16, 66, 1, line('M0 0 L0 -18', C.green, 1.6), path('M0 -8 C-6 -10 -6 -14 -1 -12 Z', C.green, null), circle(0, -20, 4, C.yellow, C.ink, 1)), at(20, 50, 1, path('M-6 0 C-4 -8 4 -8 6 0 Z', '#3f9a4a', C.ink, 1), line('M0 0 L0 -6', C.ink, 0.6)),
    at(90, 100, 1, path('M-8 0 C-6 -6 6 -6 8 0', 'none', C.green, 3), line('M-6 0 L-8 8 M0 0 L0 9 M6 0 L8 8', C.red, 1.6)), ground),
  'fyn.mantel': all(room('#eef3f6'), cloakOn(60, 1, '#4f7f5a'), fig(60, '#b04a3a', 'smile'),
    on(60, 1, path('M-16 -44 C-24 -20 -26 10 -22 30 L-14 30 C-14 0 -12 -30 -10 -40 Z M16 -44 C24 -20 26 10 22 30 L14 30 C14 0 12 -30 10 -40 Z', '#4f7f5a', C.ink, 1.4), circle(11, -38, 4, SILVER, C.ink, 1.2)),
    line('M96 40 L110 40 M98 52 L112 52', C.grey2, 1.6), ground),
  'fyn.nålbindning': all(room(), path('M30 96 L30 54 C30 36 58 36 58 54 L58 66 C68 62 74 70 66 78 L58 84 L58 96 Z', '#c94a3a', C.ink, 1.8),
    ...Array.from({ length: 12 }, (_, i) => path(`M${34 + (i % 4) * 6} ${60 + Math.floor(i / 4) * 10} c-3 -6 6 -6 3 0`, 'none', '#8a2a20', 1.2)), line('M58 52 C70 40 84 40 90 46', '#c94a3a', 2),
    rot(92, 46, -30, 1, path('M-2 -16 L2 -16 L3 14 L0 18 L-3 14 Z', '#efe6d2', C.ink, 1.2), ellipse(0, -12, 1, 2.4, C.ink, null)), circle(98, 94, 12, '#c94a3a', C.ink, 1.6), line('M90 88 C96 94 102 94 108 90 M88 96 C96 102 104 100 108 96', '#8a2a20', 1)),
  'fyn.syl': all(room(), table(90), path('M18 90 L22 72 L92 70 L100 90 Z', '#8a5a34', C.ink, 1.6), ...[34, 44, 54, 64].map((x) => circle(x, 80, 1.6, '#3a2414', null)), rot(76, 58, 20, 1, rect(-4, -30, 8, 18, WOOD, 3, C.ink, 1.3), line('M0 -12 L0 20', IRON, 1.8)), ringMark(81, 78, 8), ground),
  'fyn.bennål': all(room('#f6efe4'), rot(60, 56, 35, 1, path('M-4 -42 C-4 -48 4 -48 4 -42 L2.6 38 L0 46 L-2.6 38 Z', '#efe6d2', C.ink, 1.6), ellipse(0, -38, 1.4, 3.4, C.ink, null)), path('M38 26 C30 18 20 24 14 18', 'none', '#c94a3a', 1.6),
    at(92, 98, 1, path('M-14 -4 C-18 -10 -12 -14 -8 -10 L8 -10 C12 -14 18 -10 14 -4 C18 2 12 6 8 2 L-8 2 C-12 6 -18 2 -14 -4 Z', '#f6f0e2', C.ink, 1.2)), ground),
  'fyn.förmultna': all(rect(4, 4, 112, 108, '#e6f2f8', 3, null), soil(40), rect(10, 66, 24, 18, '#6f8fb5', 2, C.ink, 1.4), line('M12 72 L32 72 M12 78 L32 78', '#4f6f95', 1), arrow(37, 76, 45, 76, HL, 2),
    path('M48 66 L72 66 L70 74 L72 84 L60 82 L48 84 L50 74 Z', '#8fa6c2', C.ink, 1.2), circle(56, 72, 2.4, SOIL, null), circle(65, 78, 2, SOIL, null), arrow(76, 76, 84, 76, HL, 2), dashed('M88 66 L110 66 L110 84 L88 84 Z', '#c9a888', 1.4),
    path('M24 100 c4 -4 8 4 12 0 c4 -4 8 4 12 0', 'none', '#d07a8a', 2.4)),

  // ── 2326 Skriftliga källor ──
  'fyn.skriftlig-källa': all(room(), fig(30, C.denim, 'calm'), table(90), at(64, 86, 1, path('M-24 0 L-22 -14 L0 -12 L22 -14 L24 0 L0 2 Z', PARCH, C.ink, 1.4), line('M0 -12 L0 2', C.ink, 1), scrib(-19, -9, 15, 2, 4), scrib(4, -9, 15, 2, 4)), reach(30, 1, 1, 44, 82),
    ellipse(80, 32, 32, 22, C.white, C.ink, 1.6), circle(58, 62, 3, C.white, C.ink, 1.2), circle(52, 70, 2, C.white, C.ink, 1), house(72, 46, 0.9), ship(96, 44, 0.7), path('M54 46 C64 44 100 44 108 46', 'none', '#7fb8dc', 1.6), sparkle(62, 20, 3)),
  'fyn.bläck': all(room(), table(92), inkwell(56, 92, 2.2), quill(74, 50, 1, 20), path('M73 56 C76 60 76 63 73 63 C70 63 70 60 73 56 Z', '#14141a', C.ink, 0.6), ellipse(88, 91, 9, 2, '#14141a', null), ground),
  'fyn.fjäderpenna': all(room(), table(92), page(22, 66, 68, 24, 0), scrib(28, 74, 34, 3), quill(66, 80, 1.3, 20), inkwell(102, 92, 0.9), ground),
  'fyn.vaxtavla': all(room(), table(96), rect(18, 50, 40, 46, WOOD, 2, C.ink, 1.6), rect(23, 55, 30, 36, '#e3c25a', 1, C.ink, 1), rect(62, 50, 40, 46, WOOD, 2, C.ink, 1.6), rect(67, 55, 30, 36, '#e3c25a', 1, C.ink, 1),
    scrib(26, 62, 24, 4, 6, '#7a5a20'), scrib(70, 62, 16, 2, 6, '#7a5a20'), rot(94, 44, 30, 1, rect(-1.4, -22, 2.8, 30, '#d8d0b8', 1, C.ink, 1), path('M-1.4 8 L0 12 L1.4 8 Z', IRON, C.ink, 0.8)), ground),
  'fyn.nedteckna': all(room(), fig(24, C.grey, 'smile', { hair: '#e6e6e6' }), say(48, 18), arrow(62, 28, 72, 52, HL, 2.2), monk(94, 0.9), table(88, 64, 112), page(68, 76, 24, 10, 0), quill(84, 80, 0.5, 20)),
  'fyn.krönika.2': all(room(), page(14, 10, 92, 98, 0), ...([[24, '1250'], [50, '1260'], [76, '1270']] as const).map(([y, n]) => all(num(28, y + 6, n, 9, C.navy), scrib(64, y + 2, 34, 2, 6))),
    crown(52, 28), swords(52, 54), ship(52, 86, 0.7), line('M14 44 L106 44 M14 70 L106 70', '#c9b48a', 1)),
  'fyn.urkund': all(room(), page(20, 14, 56, 70, 8), line('M48 84 L48 92', WAX, 1.6), seal(48, 98, 7), arrow(80, 50, 92, 62, HL, 2.2), house(100, 90), ground),
  'fyn.sigill': all(room(), table(96), rect(18, 70, 60, 26, PARCH, 1, C.ink, 1.4), path('M18 70 L48 86 L78 70', 'none', C.ink, 1.2), seal(48, 86, 10), at(72, 52, 1, path('M-8 -18 C-14 -10 -14 4 -4 8 L10 8 C16 0 14 -12 6 -18 Z', C.skin, C.ink, 1.4), circle(-6, 10, 5, 'none', GOLD, 2.4)),
    arrow(60, 66, 54, 76, HL, 2), sparkle(28, 60, 3), ground),
  'fyn.avskrift': all(room(), monk(96, 1), table(88), page(8, 72, 34, 16, 3, '#d9c393'), page(52, 72, 34, 16, 2), reach(96, 1, -1, 76, 78), quill(76, 78, 0.5, 20), arrow(30, 62, 60, 62, HL, 2.4)),

  // ── 2327 Föremåls funktion och proveniens ──
  'fyn.funktion': all(room(), rect(6, 70, 44, 6, '#d8d0c0', 1, C.ink, 1.2), at(26, 70, 1, path('M-12 0 C-12 -8 8 -8 14 -4 L20 -6 L16 0 Z', CLAY, C.ink, 1.4), ellipse(-1, -4, 5, 1.6, CLAY2, C.ink, 0.8)), qm(28, 50, 20), arrow(50, 60, 62, 60, HL, 3),
    rect(64, 14, 50, 94, '#2f3550', 3, C.ink, 1.4), circle(99, 64, 14, 'rgba(242,193,78,0.4)', null), ...[[-1, 0], [-0.7, -0.7], [0, -1], [0.7, -0.7], [1, 0]].map(([a, b]) => line(`M${f1(99 + a! * 9)} ${f1(58 + b! * 9)} L${f1(99 + a! * 13)} ${f1(58 + b! * 13)}`, GOLD, 1.8)),
    at(80, 80, 1, path('M-12 0 C-12 -8 8 -8 14 -4 L20 -6 L16 0 Z', CLAY, C.ink, 1.4), ellipse(-1, -4, 5, 1.6, CLAY2, C.ink, 0.8), path('M19 -6 C23 -12 22 -18 19 -22 C16 -18 15 -12 19 -6 Z', C.orange, C.ink, 1), path('M19 -8 C21 -11 20 -14 19 -16 C18 -14 17 -11 19 -8 Z', C.yellow, null)), rect(70, 80, 40, 4, WOOD, 1, C.ink, 1)),
  'fyn.avsedd': all(room(), fig(30, C.green, 'smile'), table(88, 40, 112), reach(30, 1, 1, 52, 80), at(66, 88, 1, rect(-12, -14, 24, 9, WOOD, 3, C.ink, 1.3), line('M-9 -5 L-9 0 M9 -5 L9 0', WOOD, 3), path('M9 -14 L12 -24 L20 -22 L16 -12 Z', WOOD, C.ink, 1.2), line('M-12 -12 L-17 -4', '#5a3a1e', 2), circle(15, -21, 0.9, C.ink, null)),
    ellipse(84, 30, 26, 20, C.white, C.ink, 1.6), circle(62, 54, 3, C.white, C.ink, 1.2), circle(56, 62, 2, C.white, C.ink, 1), mini(84, 26, C.yellow), heartS(98, 20), ground),
  'fyn.vardagsföremål': all(room(), rect(78, 14, 28, 22, '#bfe3f5', 1, C.ink, 1.4), circle(92, 25, 5, C.yellow, null), table(80), bowl(22, 80, 0.7, CLAY), at(40, 80, 1, rect(-1.4, -12, 2.8, 12, WOOD, 1, C.ink, 1), ellipse(0, -14, 3, 4, WOOD, C.ink, 1)),
    rot(58, 74, -80, 1, path('M-8 -2 L8 -2 L10 0 L8 2 L-8 2 Z', SILVER, C.ink, 1), rect(-16, -2.4, 9, 4.8, WOOD, 1, C.ink, 1)), at(76, 80, 1, rect(-10, -4, 20, 4, '#e6d3b3', 1, C.ink, 1), line('M-8 -4 L-8 -8 M-4 -4 L-4 -8 M0 -4 L0 -8 M4 -4 L4 -8 M8 -4 L8 -8', C.ink, 0.8)),
    jug(98, 80, 0.6), ground),
  'fyn.bruksspår': all(room(), rot(40, 66, -20, 1, path('M-30 -4 L20 -6 L30 0 L-30 4 Z', SILVER, C.ink, 1.4), rect(-48, -3, 18, 7, WOOD, 2, C.ink, 1.2), line('M0 -3 L4 2 M8 -4 L11 1 M16 -4 L18 0', C.dark, 0.8)),
    glass(84, 66, 22, all(path('M64 62 L104 58 L104 72 L64 74 Z', SILVER, C.ink, 1), ...[70, 76, 82, 88, 94].map((x) => line(`M${x} 62 L${x + 4} 72`, C.dark, 1.2)))), ground),
  'fyn.lyxföremål': all(room('#efe6f2'), rect(36, 92, 48, 10, '#7a3a6a', 4, C.ink, 1.4), goblet(60, 92), shine(46, 44, 4), shine(76, 52, 3), sparkle(28, 30, 4, GOLD), sparkle(94, 26, 3, GOLD), greyed(at(102, 104, 1, path('M-6 -12 L6 -12 L5 0 L-5 0 Z', C.grey, C.ink, 1.2))), ground),
  'fyn.tillverkningsort': all(rect(4, 4, 112, 108, '#e8f0dc', 3, null), path('M8 96 C40 86 70 102 112 90', 'none', '#c9b48a', 3), house(32, 80, 1.3), rect(44, 50, 6, 14, '#8a6a5a', 1, C.ink, 1), line('M47 46 c-2 -4 2 -6 0 -10', C.grey, 1.4),
    pin(32, 30), dashed('M54 74 C68 68 80 68 92 78'), pot(100, 100, 0.6), ground),
  'fyn.importvara': all(rect(4, 4, 112, 108, '#dff0fa', 3, null), path('M4 76 L116 76 L116 112 L4 112 Z', '#7fb8dc', null), path('M86 76 L116 70 L116 112 L98 112 Z', '#d9cdb4', C.ink, 1.4), house(106, 72, 0.7),
    ship(36, 78, 1.4), at(32, 64, 0.5, path('M-6 -34 L6 -34 L5 -26 C11 -20 11 -6 3 0 L-3 0 C-11 -6 -11 -20 -5 -26 Z', CLAY, C.ink, 2.4)), at(44, 64, 0.5, path('M-6 -34 L6 -34 L5 -26 C11 -20 11 -6 3 0 L-3 0 C-11 -6 -11 -20 -5 -26 Z', CLAY2, C.ink, 2.4)), arrow(62, 60, 88, 60, HL, 2.6)),
  'fyn.proveniens': all(room(), soil(98), path('M8 98 C8 108 28 108 28 98', SOIL2, null), pot(18, 104, 0.32), num(18, 92, '1', 9, HL), arrow(26, 90, 34, 80, HL, 2), fig(44, C.orange, 'smile', { h: 0.6 }), num(44, 52, '2', 9, HL), arrow(52, 76, 60, 76, HL, 2),
    fig(70, C.green, 'smile', { h: 0.6 }), num(70, 52, '3', 9, HL), arrow(78, 76, 86, 76, HL, 2), museum(102, 98, 0.5), pot(102, 94, 0.22), num(102, 70, '4', 9, HL)),
};
