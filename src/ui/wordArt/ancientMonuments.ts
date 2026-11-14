/**
 * Historia & humaniora → Arkeologi & kulturarv → Fornlämningar, 2311–2317 (0.40): grave mounds and grave fields, rune
 * stones and inscriptions, rock carvings, hill forts, cult sites, settlements and hearths, and protecting ancient
 * monuments. Recurring signs: grey granite stones, green grass mounds, red rock-carving lines, people of the past in
 * brown fur or wool clothes, a modern archaeologist in a sun hat, and an orange highlight ring on the thing that the
 * word names. Rune marks are loose strokes that spell nothing. Digits only; no words, no brands, no pointing fingers.
 * Abstract words are small symbolic scenes with a grey reference beside them as contrast.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const STONE = '#a8a6a0';
const STONE2 = '#8c8a84';
const ROCK = '#b4ada2';
const GRASS = '#8cc96a';
const GRASS2 = '#6aa84f';
const SOIL = '#9a7048';
const SOIL2 = '#6e4c30';
const SKY = '#e4f1fa';
const SEA = '#8fc6e6';
const WOOD = '#a0673d';
const FUR = '#a8784a';
const FUR2 = '#7d5634';
const RED = '#d6402e';
const ASH = '#6b6b70';
const BONE = '#f4eedc';
const CLAY = '#c4703e';
const LEAF = '#5aa66a';
const LICHEN = '#d9c23a';
const GOOD = '#3a9a5a';
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);

// ── Scenery ──────────────────────────────────────────────────────────
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const field = (y = 96, col: string = GRASS) => rect(4, y, 112, 112 - y, col, 0, null);
const tufts = (pts: number[][], col: string = GRASS2) => line(pts.map(([x, y]) => `M${x} ${y} l-2 -4 M${x} ${y} l0 -5 M${x} ${y} l2 -4`).join(' '), col, 1.2);
const mound = (x: number, y: number, w = 40, h = 22, col: string = GRASS) => all(path(`M${x - w} ${y} C${x - w * 0.6} ${f1(y - h * 1.3)} ${x + w * 0.6} ${f1(y - h * 1.3)} ${x + w} ${y} Z`, col, C.ink, 1.6), tufts([[x - w * 0.45, y - h * 0.5], [x, y - h * 0.82], [x + w * 0.45, y - h * 0.5]]));
const tree = (x: number, y = 112, s = 1, col: string = LEAF) => at(x, y, s, rect(-2.5, -18, 5, 18, C.brown, 1, C.ink, 1.2), circle(0, -26, 12, col, C.ink, 1.4), circle(-7, -20, 7, col, null), circle(7, -21, 7, col, null));
const oak = (x: number, y = 112, s = 1) => at(x, y, s, path('M-4 0 L-3 -22 L-8 -30 M3 0 L3 -24 L9 -32', 'none', C.brown, 3.4), path('M-4 0 L-3 -22 L3 -24 L3 0 Z', C.brown, C.ink, 1.2),
  circle(-10, -34, 10, '#4f9d58', C.ink, 1.3), circle(10, -36, 11, '#4f9d58', C.ink, 1.3), circle(0, -44, 12, '#5aa866', C.ink, 1.3), circle(-2, -32, 8, '#5aa866', null));
const spruce = (x: number, y = 112, s = 1, col = '#3f7f52') => at(x, y, s, rect(-2, -8, 4, 8, C.brown, 0.5, C.ink, 1), path('M0 -46 L10 -30 L5 -30 L13 -18 L7 -18 L15 -7 L-15 -7 L-7 -18 L-13 -18 L-5 -30 L-10 -30 Z', col, C.ink, 1.4));
const sapling = (x: number, y = 112, s = 1) => at(x, y, s, line('M0 0 L0 -18 M0 -8 L-5 -14 M0 -11 L5 -17', '#7a5a34', 1.4), circle(0, -20, 4, '#6fbf5a', C.ink, 0.9), circle(-5, -15, 3.2, '#6fbf5a', C.ink, 0.9), circle(5, -18, 3.2, '#6fbf5a', C.ink, 0.9));
const sunD = (x: number, y: number, r = 7) => all(...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 6))} ${f1(y + Math.sin(a) * (r + 6))}`, C.gold, 2); }), circle(x, y, r, C.yellow, C.ink, 1.4));
const waves = (x1: number, x2: number, y: number, col = '#5a9ccc') => line(Array.from({ length: Math.floor((x2 - x1) / 10) }, (_, i) => `M${x1 + i * 10} ${y} q2.5 -2.5 5 0 t5 0`).join(' '), col, 1.2);
const cloud = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', col, C.ink, 1.2));
const rain = (x: number, y: number, w = 30) => line(Array.from({ length: Math.floor(w / 6) }, (_, i) => `M${x + i * 6} ${y} l-2 6`).join(' '), '#5aa7d6', 1.4);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.4);
const dash = (d: string, col: string = HL, w = 1.6, da = '3 3') => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-dasharray="${da}" stroke-linecap="round"/>`;
const ban = (x: number, y: number, r = 10, w = 2.6) => all(circle(x, y, r, 'none', C.red, w), line(`M${f1(x - r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r * 0.7)} ${f1(y - r * 0.7)}`, C.red, w));
const okC = (x: number, y: number, r = 7) => all(circle(x, y, r, GOOD, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, f1(r * 0.24)));

// ── Stones and graves ────────────────────────────────────────────────
/** An upright stone (feet at y). */
const stoneUp = (x: number, y: number, h: number, w = 6, col: string = STONE) => path(`M${x - w} ${y} L${f1(x - w * 0.8)} ${f1(y - h * 0.8)} C${f1(x - w * 0.6)} ${y - h} ${f1(x + w * 0.6)} ${y - h} ${f1(x + w * 0.8)} ${f1(y - h * 0.8)} L${x + w} ${y} Z`, col, C.ink, 1.3);
/** A low boulder. */
const boulder = (x: number, y: number, s = 1, col: string = STONE) => at(x, y, s, path('M-8 0 L-7 -5 L-2 -8 L4 -7 L8 -3 L8 0 Z', col, C.ink, 1.1));
/** A pile of stones (cairn) with its base centred at (x, y). */
const cairn = (x: number, y: number, w = 30, h = 20) => {
  const out: Svg[] = [path(`M${x - w} ${y} C${f1(x - w * 0.6)} ${f1(y - h * 1.35)} ${f1(x + w * 0.6)} ${f1(y - h * 1.35)} ${x + w} ${y} Z`, STONE2, C.ink, 1.6)];
  for (let r = 0; r < 4; r++) {
    const yy = y - 3 - r * (h / 4.2), half = w * Math.sqrt(Math.max(0.05, 1 - (r / 4.2) ** 2)) - 4;
    for (let xx = x - half; xx <= x + half; xx += 7) out.push(ellipse(f1(xx + (r % 2) * 3), f1(yy), 3.6, 2.6, r % 2 ? STONE : '#bdbab2', C.ink, 0.8));
  }
  return all(...out);
};
/** A rune stone with a red band and loose rune strokes. */
const runestone = (x: number, y: number, s = 1, band: string = RED, runes = true) => at(x, y, s, path('M-16 0 L-18 -40 C-18 -58 18 -58 18 -40 L16 0 Z', STONE, C.ink, 1.8),
  path('M-11 -2 L-13 -38 C-13 -50 13 -50 13 -38 L11 -6 C10 -4 6 -2 4 -4', 'none', band, 4), path('M4 -4 L8 -8 L9 -2 Z', band, null),
  runes ? line('M-12 -34 l2 -3 l2 3 M-12 -26 l0 -4 l2 2 M-12 -18 l3 -3 M-11 -10 l0 -4 l2 2 M10 -36 l-2 -3 M10 -28 l0 -4 l-2 2 M10 -20 l-3 -3 M9 -12 l0 -4', C.ink, 0.9) : '',
  line('M-5 -36 L5 -36 M0 -41 L0 -27', C.ink, 1.2), line('M-6 -22 l0 -6 l3 3 M0 -22 l3 -6 l3 6 M-6 -12 l0 -6 l3 3 l3 -3 l0 6', C.ink, 1.1));
/** A wrapped body (white cloth). */
const shroud = (x: number, y: number, s = 1) => at(x, y, s, path('M-18 -4 C-18 -8 14 -8 18 -4 C18 0 -18 0 -18 -4 Z', '#efe9dc', C.ink, 1.3), line('M-10 -7 L-10 -1 M-2 -7 L-2 -1 M6 -7 L6 -1', '#c8bfae', 1), circle(-20, -4, 3.6, '#efe9dc', C.ink, 1.2));
const skeleton = (x: number, y: number, s = 1) => at(x, y, s, circle(-18, 0, 3.6, BONE, C.ink, 1.1), circle(-19.2, -0.6, 0.8, C.ink, null), line('M-14 0 L6 0 M-10 -4 L-10 4 M-7 -4 L-7 4 M-4 -4 L-4 4 M-12 -2 L-6 -6 M-12 2 L-6 6 M6 0 L18 -3 M6 0 L18 3', BONE, 2.2), line('M-14 0 L6 0', C.ink, 0.4));
const pot = (x: number, y: number, s = 1, col: string = CLAY) => at(x, y, s, path('M-7 -12 L7 -12 L8 -8 C10 -2 6 0 0 0 C-6 0 -10 -2 -8 -8 Z', col, C.ink, 1.2), line('M-7 -9 L7 -9', '#8a4a24', 1));
const sword = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-1.6 -22 L1.6 -22 L1.2 6 L0 9 L-1.2 6 Z', C.silver, C.ink, 1), rect(-6, 6, 12, 2.6, C.gold, 1, C.ink, 0.9), rect(-1.4, 8.6, 2.8, 6, WOOD, 1, C.ink, 0.8), circle(0, 16, 1.8, C.gold, C.ink, 0.8));
const brooch = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 0, 6, 4, C.gold, C.ink, 1.1), circle(0, 0, 1.6, C.red, null), line('M-6 3 L6 -3', '#8a6a20', 1));
const beads = (x: number, y: number) => all(...[0, 1, 2, 3, 4].map((i) => circle(x + i * 3.4, y + Math.abs(i - 2) * 1.2, 1.6, ['#3f8fd0', '#e0b23c', '#d64545'][i % 3]!, C.ink, 0.6)));
const fire = (x: number, y: number, s = 1) => at(x, y, s, line('M-10 0 L10 -4 M-10 -4 L10 0', C.brown, 3.4), path('M0 -24 C7 -16 9 -8 5 -3 C3 -1 -3 -1 -5 -3 C-9 -8 -6 -16 0 -24 Z', C.orange, C.ink, 1.2), path('M0 -14 C3 -10 4 -6 2 -4 C1 -3 -1 -3 -2 -4 C-4 -6 -3 -10 0 -14 Z', C.yellow, null));
const smoke = (x: number, y: number, s = 1, col: string = C.grey2) => at(x, y, s, path('M0 0 C-4 -4 4 -8 0 -12 C-4 -16 4 -20 0 -24', 'none', col, 2.4));
const stonesRing = (x: number, y: number, r = 9, n = 9, col: string = STONE) => all(...Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return ellipse(f1(x + Math.cos(a) * r), f1(y + Math.sin(a) * r * 0.42), 3.2, 2.2, col, C.ink, 0.9); }));
/** Generic rune-like strokes in a row (spell nothing). */
const runeMarks = (x: number, y: number, n: number, step = 7, h = 8, col: string = C.ink, sw = 1.3) => {
  const forms = ['M0 0 L0 -H M0 -H L3 -H2', 'M0 0 L0 -H M0 -H2 L3 -H M0 -H3 L3 -H2', 'M0 0 L0 -H M-2 -H2 L2 -H3', 'M0 0 L0 -H M0 -H L3 -H3 L0 -H2', 'M-2 0 L0 -H L2 0', 'M0 0 L0 -H M-3 -H L3 0', 'M0 0 L0 -H M0 -H2 L-3 -H M0 -H2 L3 -H'];
  return line(Array.from({ length: n }, (_, i) => forms[(i * 3 + n) % forms.length]!.replace(/H3/g, f1(h * 0.33).toString()).replace(/H2/g, f1(h * 0.62).toString()).replace(/H/g, h.toString()).replace(/([ML])(-?[\d.]+) (-?[\d.]+)/g, (_, c: string, a: string, b: string) => `${c}${f1(x + i * step + +a)} ${f1(y + +b)}`)).join(' '), col, sw);
};

// ── People ───────────────────────────────────────────────────────────
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, hy: f1(ty - 56 * s), sy: f1(ty - 38 * s), sl: f1(x - 13 * s), sr: f1(x + 13 * s) }; };
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
/** A person of the past in brown fur/wool clothes with a zigzag hem. */
const old = (x: number, mood: Mood = 'smile', more: Partial<Build> = {}) => { const h = more.h ?? 1; return all(F({ x, top: FUR, bottom: FUR2, mood, ...more }), on(x, h, path('M-12 0 L-9 5 L-6 0 L-3 5 L0 0 L3 5 L6 0 L9 5 L12 0', more.grey ? C.grey : FUR, C.ink, 1.2))); };
/** A modern person. */
const now = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
const glasses = (x: number, h = 1) => on(x, h, circle(-3.6, -56, 2.8, 'none', C.ink, 1), circle(3.6, -56, 2.8, 'none', C.ink, 1), line('M-0.8 -56 L0.8 -56', C.ink, 1));
/** Placing a whole group elsewhere (and smaller). */
const move = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
/** Figures drawn standing at x = 60 on y = 112, placed with their feet at (x, y) and scaled by s. */
const stand = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s}) translate(-60 -112)`, ...k);
const hammer = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-1.2, -2, 2.4, 14, WOOD, 1, C.ink, 0.8), rect(-4.5, -6, 9, 5, C.grey, 1, C.ink, 1));
const chisel = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-1.2, -10, 2.4, 10, C.silver, 0.5, C.ink, 0.8), path('M-1.2 0 L1.2 0 L0 3 Z', C.silver, C.ink, 0.8));
const spade = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-1.6, -30, 3.2, 26, WOOD, 1, C.ink, 1), rect(-5, -33, 10, 3, WOOD, 1, C.ink, 1), path('M-6 -4 L6 -4 L6 6 C6 10 -6 10 -6 6 Z', C.silver, C.ink, 1.2));
const lens = (x: number, y: number, s = 1) => at(x, y, s, line('M7 7 L15 15', C.dark, 3.4), circle(0, 0, 9, 'rgba(180,220,245,0.45)', C.ink, 2));
const notebook = (x: number, y: number, inner: Svg = '') => all(rect(x - 9, y - 11, 18, 22, C.white, 1.5, C.ink, 1.2), inner);
const coinS = (x: number, y: number, r = 3) => all(circle(x, y, r, C.gold, C.ink, 0.9), circle(x, y, r * 0.5, 'none', '#b88a20', 0.7));
const cow = (x: number, y: number, s = 1, col = '#8a5a3a', flip = false) => g(`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`, ...[-12, -6, 8, 13].map((d) => rect(d - 2, -8, 4, 8, col, 1, C.ink, 1)), ellipse(0, -14, 17, 8, col, C.ink, 1.3), path('M14 -18 L24 -20 L26 -12 L18 -10 Z', col, C.ink, 1.2), line('M20 -20 L22 -25 M24 -20 L27 -24', '#e8dcc0', 1.6), circle(23, -16, 0.9, C.ink, null), line('M-17 -16 L-20 -8', C.ink, 1.2));
const ship = (x: number, y: number, s = 1, sail = true) => at(x, y, s, path('M-30 -6 C-20 4 20 4 30 -6 L26 -2 C14 6 -14 6 -26 -2 Z', '#8a5a34', C.ink, 1.4), path('M-30 -6 C-34 -12 -32 -18 -27 -20 C-26 -16 -28 -12 -26 -8', '#8a5a34', C.ink, 1.3), path('M30 -6 C34 -12 32 -18 27 -20', 'none', C.ink, 1.6),
  ...[-18, -9, 0, 9, 18].map((d) => circle(d, -3, 3, [C.red, C.gold, C.denim][Math.abs(d / 9) % 3]!, C.ink, 0.9)),
  sail ? all(line('M0 -6 L0 -40', WOOD, 2), path('M-16 -38 L16 -38 L14 -12 L-14 -12 Z', C.white, C.ink, 1.2), path('M-11 -38 L-10 -12 L-5 -12 L-5.5 -38 Z M0.5 -38 L0.5 -12 L5 -12 L5.5 -38 Z M11 -38 L10 -12', C.red, null), path('M-16 -38 L16 -38 L14 -12 L-14 -12 Z', 'none', C.ink, 1.2)) : '');
const carvShip = (x: number, y: number, s = 1, col = RED) => at(x, y, s, path('M-20 0 C-10 6 10 6 20 0', 'none', col, 2.2), line('M-20 0 L-24 -8 M20 0 L24 -8 M-22 3 L-26 6 M22 3 L26 6', col, 2), line('M-12 1 L-12 -6 M-6 3 L-6 -6 M0 3 L0 -6 M6 3 L6 -6 M12 1 L12 -6', col, 1.6));
const carvMan = (x: number, y: number, s = 1, col = RED) => at(x, y, s, circle(0, -14, 3, col, null), line('M0 -11 L0 0 M0 0 L-4 8 M0 0 L4 8 M-6 -8 L6 -8', col, 2));
const sunWheel = (x: number, y: number, r = 7, col = RED, sw = 2) => all(circle(x, y, r, 'none', col, sw), line(`M${x - r} ${y} L${x + r} ${y} M${x} ${y - r} L${x} ${y + r}`, col, sw * 0.9));
const elk = (x: number, y: number, s = 1, col = '#7a5034') => at(x, y, s, ...[-10, -5, 8, 12].map((d) => line(`M${d} -6 L${d} 8`, col, 2.6)), ellipse(0, -10, 15, 7, col, C.ink, 1.2), path('M12 -14 L20 -22 L28 -18 L26 -12 L16 -8 Z', col, C.ink, 1.2), line('M20 -22 L16 -32 M20 -22 L24 -32 M18 -27 L13 -28 M22 -27 L27 -29', '#c8a878', 1.8));
const bookLaw = (x: number, y: number, s = 1, col = '#7a3b3b') => at(x, y, s, rect(-11, -14, 22, 28, col, 2, C.ink, 1.4), line('M-8 -14 L-8 14', 'rgba(0,0,0,0.25)', 1.4), line('M2 -10 L2 2 M-4 -7 L8 -7 M-4 -7 L-6 -2 L-2 -2 Z M8 -7 L6 -2 L10 -2 Z M-1 2 L5 2', C.gold, 1.4));
const shieldS = (x: number, y: number, s = 1, col: string = C.navy) => at(x, y, s, path('M0 -16 L14 -11 C14 4 8 12 0 17 C-8 12 -14 4 -14 -11 Z', col, C.ink, 1.6));
const digger = (x: number, y: number, s = 1, col = '#f2b632') => at(x, y, s, rect(-24, -14, 30, 10, col, 2, C.ink, 1.4), rect(-16, -28, 16, 14, col, 2, C.ink, 1.4), rect(-13, -25, 9, 8, '#cfe8f5', 1, C.ink, 1), rect(-26, -4, 34, 6, C.dark, 3, C.ink, 1.2), ...[-20, -10, 0].map((d) => circle(d, -1, 2, C.grey, null)),
  path('M4 -18 L22 -34 L34 -20', 'none', col, 4), path('M4 -18 L22 -34 L34 -20', 'none', C.ink, 0.8), path('M30 -20 L40 -20 L38 -10 L30 -12 Z', C.grey, C.ink, 1.2));

// ── Motifs ───────────────────────────────────────────────────────────
export const ANCIENT_MONUMENT_MOTIFS: Record<string, Svg> = {
  // 2311 Gravhögar och gravfält
  'forn.begrava': all(bg(), field(70, GRASS), rect(4, 70, 112, 42, SOIL, 0, null), line('M4 70 L116 70', C.ink, 1.4), path('M30 70 L34 98 L86 98 L90 70 Z', SOIL2, C.ink, 1.4), shroud(60, 94, 1.4),
    path('M92 70 C96 58 112 58 116 70 Z', SOIL, C.ink, 1.2), stand(18, 70, 0.6, old(60, 'frown', { hairStyle: 'long' })), stand(102, 70, 0.6, old(60, 'calm'), reach(60, 1, -1, 34, 70)), spade(86, 66, 0.7, -40), circle(78, 74, 1.8, SOIL2, null), circle(74, 78, 1.4, SOIL2, null), circle(70, 82, 1.6, SOIL2, null)),
  'forn.gravfält': all(bg(), field(56, GRASS), sunD(100, 18, 6), tree(14, 64, 0.6), tree(108, 62, 0.55), mound(30, 80, 14, 9), mound(84, 72, 12, 7), mound(64, 100, 16, 10), stonesRing(52, 70, 9, 9), stonesRing(98, 92, 8, 8),
    stoneUp(20, 100, 18, 3.5), stoneUp(76, 88, 14, 3), stoneUp(44, 92, 10, 3), ...[[36, 62], [70, 60], [104, 76], [14, 84]].map(([a, b]) => boulder(a!, b!, 0.5)), tufts([[12, 108], [40, 110], [96, 108], [60, 66]])),
  'forn.röse': all(bg(), rect(4, 70, 112, 42, SEA, 0, null), waves(8, 50, 84), waves(10, 50, 98), ship(26, 92, 0.42, true), path('M44 112 L56 72 L70 56 L96 52 L116 62 L116 112 Z', ROCK, C.ink, 1.6), line('M60 80 L66 92 M86 70 L92 84 M100 64 L104 74', STONE2, 1.2),
    cairn(84, 56, 22, 16), tufts([[56, 100], [104, 96]]), cloud(30, 22, 0.8)),
  'forn.brandgrav': all(bg('#f3ece2'), rect(4, 74, 112, 38, SOIL, 0, null), line('M4 74 L116 74', C.ink, 1.4), path('M40 74 L44 100 L76 100 L80 74 Z', SOIL2, C.ink, 1.3), pot(60, 98, 1.5, CLAY), path('M50 80 C54 76 66 76 70 80 L68 84 L52 84 Z', ASH, C.ink, 0.8),
    ...[[54, 81], [58, 79], [62, 81], [66, 80]].map(([a, b]) => line(`M${a} ${b} l2.4 -1`, BONE, 1.6)), at(60, 52, 1, line('M-20 0 L20 0 M-18 -4 L18 -4 M-16 -8 L16 -8', C.brown, 3.4), path('M-12 -10 C-12 -14 12 -14 12 -10 Z', '#efe9dc', C.ink, 1)), at(60, 44, 1, path('M0 -28 C12 -16 14 -6 8 -2 C4 0 -4 0 -8 -2 C-14 -6 -12 -16 0 -28 Z', C.orange, C.ink, 1.2), path('M0 -16 C4 -11 5 -6 3 -4 C1 -3 -1 -3 -3 -4 C-5 -6 -4 -11 0 -16 Z', C.yellow, null)),
    smoke(76, 24, 0.7), arrow(92, 46, 92, 80, HL, 2.8), ring(60, 88, 20)),
  'forn.gravgåva': all(bg('#f3ece2'), rect(4, 30, 112, 82, SOIL, 0, null), field(22, GRASS), rect(4, 22, 112, 8, GRASS, 0, null), line('M4 30 L116 30', C.ink, 1.4), path('M14 56 L106 56 L104 96 L16 96 Z', SOIL2, C.ink, 1.4), skeleton(60, 78, 1.6),
    sword(28, 82, 0.9, 90), brooch(56, 70, 1.1), beads(64, 66), pot(94, 92, 1.1), sparkle(30, 70, 4), sparkle(96, 72, 4), sparkle(70, 60, 3.4), ring(28, 82, 12), ring(94, 86, 10), ring(60, 68, 9)),
  'forn.skeppssättning': all(bg(), rect(4, 30, 112, 16, SEA, 0, null), waves(8, 110, 38), at(96, 42, 0.32, ship(0, 0, 1, false)), field(46, GRASS), path('M8 80 C30 62 90 62 112 80 C90 98 30 98 8 80 Z', '#a4d888', null), dash('M8 80 C30 62 90 62 112 80 C90 98 30 98 8 80 Z', '#5a8a3a', 1.2, '3 3'),
    ...[-0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8].map((t) => stoneUp(f1(60 + 52 * t), f1(80 - 15.5 * (1 - t * t)), f1(7 + 13 * t * t), 2.8)),
    stoneUp(8, 82, 26, 3.4), stoneUp(112, 82, 26, 3.4),
    ...[-0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8].map((t) => stoneUp(f1(60 + 52 * t), f1(82 + 15.5 * (1 - t * t)), f1(8 + 14 * t * t), 3.2))),
  'forn.bautasten': all(bg(), field(88, GRASS), cloud(30, 24, 0.8), stoneUp(70, 106, 76, 9), line('M66 40 L68 60 M72 70 L74 88', STONE2, 1.2), now(36, C.denim, 'smile', { h: 0.62 }), tufts([[60, 108], [82, 110], [20, 108]]), line('M90 106 L90 30', HL, 1.6), line('M86 30 L94 30 M86 106 L94 106', HL, 1.6)),
  'forn.domarring': all(bg(), field(50, GRASS), tree(16, 60, 0.55), tree(104, 58, 0.5), oval(60, 84, 44, 18, 'rgba(228,87,46,0.45)'),
    ...Array.from({ length: 9 }, (_, i) => { const a = -Math.PI / 2 + (i / 9) * Math.PI * 2; const x = 60 + Math.cos(a) * 40, y = 84 + Math.sin(a) * 16; return { x, y }; }).sort((p, q) => p.y - q.y).map(({ x, y }) => stoneUp(f1(x), f1(y + 4), f1(14 + (y - 68) * 0.5), 3.6)),
    tufts([[60, 86], [50, 80], [70, 82]])),
  'forn.gånggrift': all(bg(), field(84, GRASS), path('M8 96 C20 46 100 46 112 96 Z', '#9fd27e', C.ink, 1.6), rect(28, 58, 64, 10, STONE2, 4, C.ink, 1.5), stoneUp(34, 92, 26, 7, STONE), stoneUp(86, 92, 26, 7, STONE),
    path('M48 112 L52 70 L68 70 L72 112 Z', '#3a2e26', C.ink, 1.4), rect(46, 66, 28, 6, STONE2, 2, C.ink, 1.2), stoneUp(46, 112, 40, 4, STONE), stoneUp(74, 112, 40, 4, STONE), rect(42, 96, 36, 5, STONE2, 2, C.ink, 1),
    stand(98, 112, 0.42, now(60, C.orange, 'smile')), arrow(92, 82, 76, 92, HL, 2.6)),
  // 2312 Runstenar och inskrifter
  'forn.vikingatid': all(bg(), rect(4, 54, 112, 30, SEA, 0, null), waves(8, 110, 62), waves(14, 110, 74), ship(58, 74, 1.1), rect(10, 90, 100, 6, C.grey2, 3, C.ink, 1), rect(46, 90, 34, 6, HL, 3, C.ink, 1), T(46, 108, '800', 9, C.ink), T(82, 108, '1050', 9, C.ink), line('M46 96 L46 100 M80 96 L80 100', C.ink, 1.2), cloud(22, 20, 0.7), cloud(96, 28, 0.6)),
  'forn.runa': all(bg('#f3ece2'), path('M14 98 L18 26 L102 22 L106 98 Z', STONE, C.ink, 2), line('M44 80 L44 40 M44 50 L58 40 M44 62 L58 52', RED, 5), line('M74 80 L74 40 L88 52 L88 80', C.ink, 3.6), ring(52, 60, 22)),
  'forn.runrad': all(bg('#f3ece2'), rect(8, 34, 104, 52, '#c9a46a', 3, C.ink, 1.6), line('M8 60 L112 60', '#a8844a', 1), runeMarks(16, 54, 8, 12.6, 14, C.ink, 1.8), runeMarks(16, 80, 8, 12.6, 14, C.ink, 1.8), arrow(14, 96, 106, 96, HL, 2.4), T(14, 24, '1', 9, C.grey), T(106, 24, '16', 9, C.grey)),
  'forn.rista': all(bg(), field(100, GRASS), path('M62 112 L60 46 C60 30 106 30 106 46 L104 112 Z', STONE, C.ink, 1.8), runeMarks(70, 62, 4, 8, 10, C.ink, 1.6), runeMarks(70, 80, 2, 8, 10, C.ink, 1.6),
    old(34, 'calm', { hairStyle: 'short' }), reach(34, 1, 1, 66, 84), reach(34, 1, 1, 58, 70), chisel(70, 86, 1, 70), hammer(58, 70, 0.9, -40), ...[[80, 80], [84, 86], [78, 92]].map(([a, b]) => line(`M${a} ${b} l3 -2`, STONE2, 1.4)), sparkle(80, 76, 3)),
  'forn.inskrift': all(bg('#f3ece2'), path('M10 104 L14 22 L106 18 L110 104 Z', STONE, C.ink, 2), rect(22, 32, 76, 60, 'rgba(255,255,255,0.18)', 2, null), runeMarks(26, 46, 9, 8, 9, C.ink, 1.5), runeMarks(26, 64, 9, 8, 9, C.ink, 1.5), runeMarks(26, 82, 7, 8, 9, C.ink, 1.5), rect(20, 30, 80, 62, 'none', 3, HL, 2.4)),
  'forn.runristare': all(bg(), field(100, GRASS), runestone(82, 108, 1.5), old(32, 'laugh', { hairStyle: 'short' }), reach(32, 1, 1, 52, 66), hammer(52, 66, 0.9, -30), reach(32, 1, -1, 14, 88), chisel(14, 92, 1, 0), ring(91, 101, 6)),
  'forn.runslinga': all(bg(), field(104, GRASS), at(60, 110, 1.9, path('M-16 0 L-18 -40 C-18 -58 18 -58 18 -40 L16 0 Z', STONE, C.ink, 1.4), path('M-11 -2 L-13 -38 C-13 -50 13 -50 13 -38 L11 -6 C10 -4 6 -2 4 -4', 'none', RED, 5), path('M-11 -2 L-14 2 L-8 2 Z', RED, C.ink, 0.6), path('M4 -4 L9 -9 L10 -1 Z', RED, C.ink, 0.6), circle(7.6, -5, 0.6, C.white, null),
    line('M-11 -34 l1.5 -2.5 l1.5 2.5 M-11.4 -26 l0 -3.4 l1.6 1.6 M-11.6 -18 l2.4 -2.4 M-11 -10 l0 -3.4 l1.6 1.6 M10.2 -36 l-1.5 -2.5 M10.4 -28 l0 -3.4 l-1.6 1.6 M10.4 -20 l-2.4 -2.4', C.white, 0.9)), arrow(34, 30, 86, 30, HL, 2.4)),
  'forn.ornamentik': all(bg(), field(104, GRASS), at(60, 110, 1.9, path('M-16 0 L-18 -40 C-18 -58 18 -58 18 -40 L16 0 Z', STONE, C.ink, 1.4),
    path('M-10 -4 C-14 -20 10 -24 6 -36 C2 -46 -12 -40 -8 -30 C-4 -20 14 -18 10 -6', 'none', RED, 3.2), path('M10 -4 C14 -20 -10 -24 -6 -36 C-2 -46 12 -40 8 -30 C4 -20 -14 -18 -10 -6', 'none', C.denim, 3.2), circle(6, -36, 2, RED, C.ink, 0.6), circle(-6, -36, 2, C.denim, C.ink, 0.6),
    path('M-12 -44 C-6 -50 6 -50 12 -44', 'none', C.gold, 2.4)), sparkle(24, 40, 4), sparkle(96, 52, 4)),
  'forn.färglägga': all(bg(), field(100, GRASS), at(76, 110, 1.6, path('M-16 0 L-18 -40 C-18 -58 18 -58 18 -40 L16 0 Z', STONE, C.ink, 1.6), path('M-11 -2 L-13 -38 C-13 -50 13 -50 13 -38', 'none', RED, 4), path('M13 -38 L11 -6 C10 -4 6 -2 4 -4', 'none', '#cfcac0', 4, ), dash('M13 -38 L11 -6', C.ink, 0.6, '2 2')),
    now(30, C.green, 'smile', { hairStyle: 'long' }), reach(30, 1, 1, 94, 50), rect(92, 44, 3, 12, WOOD, 1, C.ink, 0.8), path('M92 56 L95 56 L94.5 60 L92.5 60 Z', RED, C.ink, 0.6), at(48, 108, 1, path('M-7 -12 L7 -12 L6 0 L-6 0 Z', C.white, C.ink, 1.2), ellipse(0, -12, 7, 2, RED, C.ink, 1))),
  'forn.till-minne-av': all(bg(), field(100, GRASS), runestone(40, 108, 1.4), now(88, C.navy, 'frown', { h: 0.8 }), reach(88, 0.8, -1, 62, 76),
    path('M64 18 C64 8 104 8 104 18 C112 18 112 36 104 36 C104 46 64 46 64 36 C56 36 56 18 64 18 Z', C.white, C.ink, 1.3), circle(70, 50, 2.2, C.white, C.ink, 1), circle(66, 56, 1.6, C.white, C.ink, 1), greyed(move(84, 9, 0.28, F({ x: 0, top: FUR, mood: 'smile', h: 1 }))), sparkle(102, 16, 3), sparkle(68, 16, 2.6)),
  'forn.runolog': all(bg('#f3ece2'), field(100, '#c9d8b0'), runestone(84, 108, 1.4), now(34, C.purple, 'calm', { hairStyle: 'short' }), glasses(34), reach(34, 1, 1, 64, 58), lens(70, 58, 0.9), reach(34, 1, -1, 22, 80), notebook(14, 74, runeMarks(8, 70, 2, 6, 6, C.ink, 1)), okC(14, 90, 5)),
  // 2313 Hällristningar
  'forn.häll.2': all(bg(), field(60, GRASS), spruce(14, 76, 0.7), spruce(106, 74, 0.8), spruce(94, 70, 0.6), path('M8 104 C10 84 40 74 70 76 C96 78 114 88 112 104 Z', ROCK, C.ink, 1.8), path('M20 96 C40 86 70 84 100 92', 'none', '#cfc9be', 2), line('M34 90 L40 96 M78 88 L84 94', STONE2, 1),
    stand(50, 82, 0.4, now(60, C.red, 'smile', { hairStyle: 'long' })), stand(74, 80, 0.4, now(60, C.denim, 'smile')), tufts([[8, 110], [112, 110]])),
  'forn.motiv.2': all(bg('#efe7da'), rect(8, 10, 46, 40, '#8a5a34', 2, C.ink, 1.6), rect(12, 14, 38, 32, SKY, 1, null), rect(12, 34, 38, 12, SEA, 0, null), ship(31, 40, 0.42, true), rect(6, 8, 50, 44, 'none', 4, C.gold, 2.6),
    rect(66, 10, 46, 40, ROCK, 3, C.ink, 1.6), carvShip(89, 32, 0.9), carvMan(80, 46, 0.6), rect(64, 8, 50, 44, 'none', 4, C.gold, 2.6),
    rect(8, 62, 46, 40, C.white, 2, C.ink, 1.6), line('M20 90 C26 92 36 92 42 90 L46 84 M20 90 L16 84 M31 90 L31 70 M22 72 L40 72 L38 86 L24 86 Z', C.navy, 1.6), rect(6, 60, 50, 44, 'none', 4, C.gold, 2.6),
    greyed(rect(66, 62, 46, 40, C.white, 2, C.ink, 1.6), tree(80, 96, 0.6), tree(98, 98, 0.5), sunD(102, 72, 4)), sparkle(60, 56, 3.4), sparkle(60, 6, 3), sparkle(4, 56, 3)),
  'forn.skålgrop': all(bg(), field(84, GRASS), path('M8 108 C8 82 40 66 66 68 C94 70 114 86 112 108 Z', ROCK, C.ink, 1.8), ...[[30, 92], [42, 86], [54, 82], [66, 80], [78, 84], [90, 90], [46, 98], [60, 94], [74, 96], [88, 102], [34, 104], [100, 98]].map(([a, b]) => all(ellipse(a!, b!, 4, 2.4, '#7f786e', C.ink, 0.9), ellipse(a!, b! - 0.6, 2.6, 1.3, '#5f584e', null))), coinS(66, 79.4, 2.2), ring(66, 80, 9)),
  'forn.avbilda': all(bg(), field(96, GRASS), elk(14, 96, 0.8), path('M70 112 L72 34 L114 30 L114 112 Z', ROCK, C.ink, 1.6), at(90, 74, 0.8, line('M-16 -6 L-16 8 M-11 -6 L-11 8 M2 -6 L2 8 M6 -6 L6 8', RED, 2), ellipse(-6, -10, 15, 7, 'none', RED, 2.2), path('M6 -14 L14 -22 L22 -18 L20 -12 L10 -8', 'none', RED, 2.2), line('M14 -22 L10 -32 M14 -22 L18 -32', RED, 2)),
    stand(56, 112, 0.74, old(60, 'calm'), reach(60, 1, 1, 106, 60)), dash('M24 66 C40 44 70 44 86 58', HL, 1.4)),
  'forn.solhjul': all(bg(), field(90, GRASS), path('M6 108 C8 70 40 40 66 40 C96 42 114 70 114 108 Z', ROCK, C.ink, 1.8), sunWheel(60, 74, 20, RED, 3.4), carvMan(30, 98, 1.1), carvMan(90, 98, 1.1), sunD(100, 18, 7), dash('M94 24 L76 56', HL, 1.4)),
  'forn.plöja': all(bg(), field(62, '#c9a46a'), ...[72, 80, 88, 96, 104].map((y) => line(`M4 ${y} L${48 - (y - 66) * 0.3} ${y}`, '#8a6a3a', 1.4)), cow(84, 100, 1, '#8a5a3a'), cow(96, 92, 0.85, '#a8784a'), line('M50 92 L74 90', WOOD, 2.6),
    path('M36 100 L52 90 L50 98 L44 104 Z', WOOD, C.ink, 1.2), line('M44 104 L48 108', C.ink, 1.6), stand(30, 112, 0.62, old(60, 'calm'), reach(60, 1, 1, 86, 88)), sunD(100, 18, 6)),
  'forn.akrobat': all(bg('#f3ece2'), field(98, GRASS), dash('M18 96 C30 40 90 40 102 96', HL, 1.8, '4 4'), g('translate(60 26) rotate(150) translate(-60 -86)', now(60, C.red, 'laugh', { h: 0.6 })), now(16, C.denim, 'shock', { h: 0.5 }), now(104, C.green, 'laugh', { h: 0.5 }), sparkle(34, 30, 4), sparkle(88, 30, 4)),
  'forn.fruktbarhet': all(bg(), sunD(98, 16, 7), rect(64, 56, 52, 56, '#e9d07a', 0, null), ...[70, 78, 86, 94, 102, 110].map((x) => all(line(`M${x} 108 L${x} 62`, '#b8952a', 1.4), ellipse(x, 62, 2.4, 5, C.gold, C.ink, 0.6), ellipse(x - 2.6, 72, 2, 4, C.gold, C.ink, 0.6))), cow(84, 104, 0.6), cow(102, 104, 0.35, '#a8784a'),
    greyed(rect(4, 56, 56, 56, '#d8cfb8', 0, null), ...[12, 22, 32, 42, 52].map((x) => line(`M${x} 108 L${x - 2} 94 L${x - 6} 92`, '#8a7a5a', 1.4)), cloud(30, 30, 0.8, C.grey2)), line('M62 56 L62 112', C.ink, 1.4), sparkle(72, 44, 4)),
  'forn.hällmålning': all(bg('#f3ece2'), path('M4 4 L116 4 L116 112 L64 112 C60 90 70 60 54 40 C40 22 20 30 4 28 Z', ROCK, C.ink, 1.6), elk(72, 54, 0.8, '#c0442e'), at(96, 86, 1, circle(0, -14, 3, '#c0442e', null), line('M0 -11 L0 0 M0 0 L-4 8 M0 0 L4 8 M-6 -6 L6 -9', '#c0442e', 2.2)),
    old(28, 'calm', { h: 0.86 }), reach(28, 0.86, 1, 58, 58), rect(56, 50, 2.4, 10, WOOD, 1, C.ink, 0.6), circle(57, 49, 2, '#c0442e', null), at(42, 110, 1, ellipse(0, -4, 7, 4, '#8a6a4a', C.ink, 1), ellipse(0, -6, 5, 1.6, '#c0442e', null))),
  'forn.världsarv': all(bg(), field(96, GRASS), path('M14 110 C16 90 40 82 60 82 C82 82 104 90 106 110 Z', ROCK, C.ink, 1.6), carvShip(48, 98, 0.6), sunWheel(76, 96, 6, RED, 1.8), circle(60, 40, 24, '#bfe3f5', C.ink, 2),
    path('M44 30 C50 26 56 32 52 38 C48 44 42 40 44 30 Z M62 22 C70 20 78 28 74 36 C72 42 66 40 64 34 Z M60 48 C66 46 72 52 68 58 C64 60 58 56 60 48 Z', '#7fbf6a', C.ink, 1), line('M60 64 L60 80', C.ink, 1.4), shieldS(96, 50, 0.9, C.navy), path('M90 50 L95 55 L103 45', 'none', C.white, 2.4), sparkle(28, 22, 4)),
  // 2314 Fornborgar
  'forn.brant': all(bg(), field(104, GRASS), path('M56 112 L76 24 L92 24 L92 112 Z', ROCK, C.ink, 1.6), line('M70 50 L74 60 M66 74 L70 86', STONE2, 1.2), stand(78, 70, 0.36, g('rotate(-12 60 112)', now(60, C.orange, 'frown'))), arrow(72, 108, 82, 28, HL, 2.6),
    greyed(path('M4 112 L50 92 L50 112 Z', ROCK, C.ink, 1.4), stand(24, 101, 0.3, now(60, C.grey, 'smile')))),
  'forn.krön': all(bg(), field(104, GRASS), path('M4 112 C30 100 40 46 60 40 C80 46 92 100 116 112 Z', '#9fd27e', C.ink, 1.6), spruce(26, 104, 0.45), spruce(96, 106, 0.45), path('M44 50 C52 40 68 40 76 50', 'none', HL, 4), stand(60, 44, 0.3, now(60, C.red, 'laugh')), cloud(22, 26, 0.6)),
  'forn.stenvall': all(bg(), field(44, '#9fd27e'), spruce(14, 70, 0.6), spruce(108, 66, 0.6), spruce(96, 56, 0.45), path('M8 96 C30 80 54 76 66 70 C82 62 98 60 112 62', 'none', STONE2, 12), path('M8 96 C30 80 54 76 66 70 C82 62 98 60 112 62', 'none', STONE, 8),
    ...[[12, 93], [20, 88], [28, 84], [36, 81], [44, 79], [52, 77], [60, 73], [68, 69], [76, 66], [84, 63], [92, 62], [100, 61], [108, 62]].map(([a, b]) => ellipse(a!, b! - 1, 3.6, 2.6, '#bdbab2', C.ink, 0.8)), stand(70, 72, 0.36, now(60, C.denim, 'smile', { hairStyle: 'long' }))),
  'forn.bygd': all(bg(), field(40, GRASS), path('M4 40 C30 34 60 42 90 36 C104 34 112 36 116 38 L116 44 L4 44 Z', '#7aa85a', null), ...[[10, 60, 30, 14, '#e9d07a'], [46, 56, 30, 12, '#c9e08a'], [80, 62, 32, 14, '#e9d07a'], [20, 84, 36, 16, '#c9e08a'], [64, 82, 40, 18, '#e9d07a']].map(([x, y, w, h, c]) => rect(x as number, y as number, w as number, h as number, c as string, 1, C.ink, 0.8)),
    ...[[40, 76], [94, 98], [14, 104]].map(([x, y]) => at(x!, y!, 0.6, rect(-12, -12, 24, 12, '#c0563d', 1, C.ink, 1.2), path('M-14 -12 L0 -22 L14 -12 Z', '#7a3b2b', C.ink, 1.2))), at(78, 52, 0.7, rect(-6, -14, 12, 14, C.white, 1, C.ink, 1.2), path('M-6 -14 L0 -24 L6 -14 Z', '#6a6a72', C.ink, 1.2), line('M0 -24 L0 -30 M-2 -28 L2 -28', C.ink, 1)), tree(110, 112, 0.5), line('M4 74 C40 70 70 78 116 72', '#d8c49a', 2.2)),
  'forn.ta-skydd': all(bg('#dfe6ee'), path('M50 112 L64 48 L116 44 L116 112 Z', ROCK, C.ink, 1.6), path('M64 50 L116 46', 'none', STONE2, 8), path('M64 50 L116 46', 'none', STONE, 4), rect(74, 40, 10, 10, '#3a2e26', 1, null), cloud(30, 16, 0.9, C.grey2), rain(12, 28, 40),
    stand(36, 112, 0.5, old(60, 'shock', { hairStyle: 'long' })), stand(14, 112, 0.46, old(60, 'shock')), cow(50, 108, 0.45), arrow(40, 70, 70, 50, HL, 2.6), okC(100, 30, 6)),
  'forn.folkvandringstid': all(bg('#f3ece2'), rect(10, 92, 100, 6, C.grey2, 3, C.ink, 1), rect(48, 92, 24, 6, HL, 3, C.ink, 1), T(48, 110, '400', 9, C.ink), T(74, 110, '550', 9, C.ink),
    stand(22, 84, 0.4, old(60, 'frown')), stand(42, 84, 0.4, old(60, 'frown', { hairStyle: 'long' })), stand(62, 84, 0.4, old(60, 'frown')), at(78, 82, 0.6, rect(-10, -10, 20, 8, WOOD, 1, C.ink, 1), circle(-6, 0, 3, WOOD, C.ink, 1), circle(6, 0, 3, WOOD, C.ink, 1)), arrow(18, 42, 98, 42, HL, 2.4), at(96, 80, 0.9, rect(-5, -30, 10, 30, '#e8e2d4', 1, C.ink, 1.2), rect(-8, -34, 16, 5, '#e8e2d4', 1, C.ink, 1.2), line('M-5 -16 L5 -20', C.ink, 1.4)), at(108, 82, 0.6, g('rotate(70)', rect(-5, -30, 10, 30, '#e8e2d4', 1, C.ink, 1.2)))),
  'forn.överblicka': all(bg(), rect(4, 62, 112, 50, '#9fd27e', 0, null), path('M60 112 L74 70 L116 70 L116 112 Z', ROCK, C.ink, 1.4), ellipse(30, 86, 24, 8, SEA, C.ink, 1.2), line('M4 100 C20 96 40 104 60 98', '#d8c49a', 2.2), ship(28, 86, 0.25, false),
    stand(96, 72, 0.4, old(60, 'calm', { hairStyle: 'short' }), reach(60, 1, -1, 40, 50)), dash('M92 52 L8 74', HL, 1.4), dash('M92 52 L10 104', HL, 1.4), dash('M92 52 L40 112', HL, 1.4)),
  'forn.rasa': all(bg(), field(104, GRASS), ...[0, 1, 2].map((r) => all(...[0, 1, 2, 3].map((i) => rect(56 + i * 14 + (r % 2) * 7, 94 - r * 10, 13, 9, STONE, 1, C.ink, 1)))), at(68, 52, 1, g('rotate(20)', rect(0, 0, 13, 9, STONE, 1, C.ink, 1))), at(88, 44, 1, g('rotate(-30)', rect(0, 0, 13, 9, STONE, 1, C.ink, 1))), at(100, 62, 1, g('rotate(40)', rect(0, 0, 13, 9, STONE, 1, C.ink, 1))),
    line('M70 40 L66 34 M92 32 L94 26 M104 52 L110 48', C.grey, 1.6), circle(78, 74, 6, 'rgba(200,190,170,0.6)', null), circle(96, 72, 7, 'rgba(200,190,170,0.6)', null), arrow(84, 46, 84, 70, HL, 2.2),
    greyed(...[0, 1, 2, 3, 4].map((r) => all(rect(10 + (r % 2) * 7, 94 - r * 10, 13, 9, STONE, 1, C.ink, 1), rect(24 + (r % 2) * 7, 94 - r * 10, 13, 9, STONE, 1, C.ink, 1))))),
  // 2315 Kultplatser
  'forn.kultplats': all(bg('#f3ece2'), field(70, GRASS), oak(24, 98, 0.8), stoneUp(62, 92, 30, 6), at(84, 96, 1, rect(-10, -6, 20, 6, STONE2, 2, C.ink, 1.2), pot(0, -6, 0.6)), fire(98, 104, 0.6),
    stand(34, 104, 0.36, old(60, 'calm')), stand(46, 106, 0.36, old(60, 'calm', { hairStyle: 'long' })), stand(108, 100, 0.36, old(60, 'calm')), dash('M14 104 C30 112 90 112 112 98', HL, 1.6), oval(62, 92, 48, 18, 'rgba(228,87,46,0.5)')),
  'forn.fornnordisk': all(bg(), path('M30 104 C20 90 24 70 34 56 C40 44 52 30 64 22 C74 18 82 26 80 36 C76 48 70 54 72 66 C74 80 86 88 80 104 Z', '#c9e08a', C.ink, 1.4), path('M70 62 C74 58 80 60 78 66', 'none', C.ink, 0.8),
    at(48, 74, 1, ship(0, 0, 0.42, true)), at(66, 42, 1.1, path('M-10 -10 L10 -10 L8 -2 L2 -2 L2 8 L-2 8 L-2 -2 L-8 -2 Z', '#8a8a92', C.ink, 1.2), circle(0, -12, 2, 'none', C.ink, 1)), runestone(50, 100, 0.42),
    greyed(at(100, 96, 0.8, rect(-8, -30, 16, 30, C.grey2, 1, C.ink, 1.2), rect(-5, -26, 4, 4, C.white, 0.5, null), rect(1, -26, 4, 4, C.white, 0.5, null), rect(-5, -18, 4, 4, C.white, 0.5, null), rect(1, -18, 4, 4, C.white, 0.5, null)))),
  'forn.dyrka': all(bg('#fdf3dc'), field(92, GRASS), sunD(60, 28, 14), ...Array.from({ length: 10 }, (_, i) => { const a = Math.PI * (0.15 + i * 0.077); return line(`M${f1(60 - Math.cos(a) * 26)} ${f1(28 + Math.sin(a) * 26)} L${f1(60 - Math.cos(a) * 40)} ${f1(28 + Math.sin(a) * 40)}`, 'rgba(242,193,78,0.6)', 2); }),
    ...[24, 60, 96].map((x, i) => move(x, 72, 0.5, path('M-14 40 L-12 8 C-12 -6 12 -6 12 8 L14 40 Z', i === 1 ? FUR2 : FUR, C.ink, 2), circle(0, -14, 9, C.skin, C.ink, 1.6), path('M-9 -18 C-9 -26 9 -26 9 -18 Z', C.hair, null), line('M-10 2 L-22 -22 M10 2 L22 -22', C.skin, 5), circle(-22, -24, 3.4, C.skin, C.ink, 1.2), circle(22, -24, 3.4, C.skin, C.ink, 1.2)))),
  'forn.hednisk': all(bg(), field(96, GRASS), at(34, 100, 1, rect(-6, -48, 12, 48, '#a0673d', 3, C.ink, 1.6), circle(0, -50, 8, '#a0673d', C.ink, 1.6), circle(-3, -51, 1.4, C.ink, null), circle(3, -51, 1.4, C.ink, null), line('M-3 -46 L3 -46', C.ink, 1.2), line('M-6 -30 L6 -30 M-6 -22 L6 -22', '#7a4a28', 1.2)), pot(20, 106, 0.6), fire(50, 108, 0.5), sparkle(48, 40, 4),
    line('M62 30 L62 112', C.ink, 1.2), greyed(at(90, 108, 1, rect(-14, -32, 28, 32, C.white, 1, C.ink, 1.4), path('M-16 -32 L0 -48 L16 -32 Z', C.grey, C.ink, 1.4), rect(-4, -14, 8, 14, C.brown, 1, C.ink, 1), line('M0 -48 L0 -62 M-5 -57 L5 -57', C.ink, 2)))),
  'forn.kulthus': all(bg(), field(84, GRASS), at(36, 100, 0.8, rect(-38, -18, 76, 18, '#9a6a40', 1, C.ink, 1.4), path('M-42 -18 C-30 -34 30 -34 42 -18 Z', '#d2ac5e', C.ink, 1.4)), at(86, 104, 1, rect(-16, -26, 32, 26, '#b07a48', 1, C.ink, 1.6), path('M-20 -26 L0 -48 L20 -26 Z', '#7a4a28', C.ink, 1.6), path('M-2 -48 C-8 -56 -2 -60 2 -56 M2 -48 C8 -56 2 -60 -2 -56', 'none', C.ink, 1.6), rect(-6, -18, 12, 18, '#3a2e26', 1, C.ink, 1.2), at(0, -4, 0.4, path('M0 -14 C5 -9 6 -4 3 -1 C1 0 -1 0 -3 -1 C-6 -4 -5 -9 0 -14 Z', C.orange, null)), line('M-12 -22 L-8 -22 M8 -22 L12 -22', C.gold, 2)), ring(86, 86, 26), sparkle(110, 50, 3.4)),
  'forn.blot': all(bg('#f3ece2'), field(88, GRASS), fire(60, 100, 0.9), at(60, 82, 1, path('M-10 -10 L10 -10 L8 2 L-8 2 Z', C.dark, C.ink, 1.2), path('M-12 -10 C-12 -18 12 -18 12 -10', 'none', C.ink, 1.2)), line('M48 102 L48 80 M72 102 L72 80 M46 80 L74 80', WOOD, 2),
    stand(24, 104, 0.5, old(60, 'laugh'), reach(60, 1, 1, 80, 52), at(80, 50, 1.6, path('M-3 -6 L3 -6 L2 2 L-2 2 Z', '#c99a2a', C.ink, 0.8))), stand(90, 100, 0.46, old(60, 'laugh', { hairStyle: 'long' }), reach(60, 1, -1, 40, 52), at(40, 50, 1.6, path('M-3 -6 L3 -6 L2 2 L-2 2 Z', '#c99a2a', C.ink, 0.8))), at(98, 108, 0.6, ellipse(0, -10, 16, 10, '#f4a6b8', C.ink, 1.4), circle(14, -12, 5, '#f4a6b8', C.ink, 1.2), ...[-8, 6].map((d) => rect(d - 2, -2, 4, 4, '#f4a6b8', 1, C.ink, 1)))),
  'forn.lund': all(bg(), field(84, GRASS), oak(30, 96, 1), oak(62, 90, 1.1), oak(92, 98, 0.95), oak(48, 102, 0.8), stoneUp(78, 110, 12, 4), pot(70, 110, 0.5), tufts([[14, 108], [104, 108], [38, 110]]), oval(60, 64, 52, 40)),
  'forn.offerkälla': all(bg(), field(60, GRASS), ellipse(60, 90, 30, 12, SEA, C.ink, 1.6), ...[[30, 88], [36, 80], [48, 76], [62, 75], [76, 77], [88, 82], [90, 92], [80, 100], [66, 102], [50, 102], [36, 98]].map(([a, b]) => ellipse(a!, b!, 4.6, 3, STONE, C.ink, 1)), path('M60 88 C56 82 64 80 60 74', 'none', '#5a9ccc', 1.6), coinS(54, 92, 2.4), coinS(66, 94, 2.4), coinS(60, 96, 2.4),
    now(96, C.green, 'smile', { h: 0.62 }), reach(96, 0.62, -1, 80, 58), coinS(76, 60, 2.6), dash('M76 64 C70 72 66 80 64 88', C.grey, 1.2)),
  'forn.mosse': all(bg('#eef1e6'), rect(4, 56, 112, 56, '#8a7a4a', 0, null), ...[[24, 72, 16, 4], [72, 66, 22, 5], [44, 92, 22, 5], [96, 96, 14, 4]].map(([x, y, rx, ry]) => ellipse(x!, y!, rx!, ry!, '#5a6a5a', C.ink, 1)), ...[[12, 64], [40, 62], [56, 78], [90, 76], [20, 100], [76, 106], [110, 70], [66, 92]].map(([a, b]) => all(line(`M${a} ${b} l-2 -6 M${a} ${b} l0 -7 M${a} ${b} l2 -6`, '#6a8a3a', 1.4), circle(a!, b! - 8, 1.8, C.white, null))),
    g('translate(44 92) rotate(-30)', sword(0, -10, 1)), ring(44, 86, 10), spruce(104, 58, 0.4), spruce(16, 58, 0.35)),
  // 2316 Boplatser och härdar
  'forn.elda': all(bg('#2e3446'), field(98, '#4a5a3a'), stonesRing(64, 100, 14, 10), fire(64, 98, 1.3), old(30, 'smile', { h: 0.9 }), reach(30, 0.9, 1, 50, 84), line('M44 88 L60 80', WOOD, 3.4), sparkle(70, 52, 3), sparkle(56, 58, 2.4), path('M98 30 C102 26 106 30 104 34', 'none', C.white, 1)),
  'forn.sot': all(bg('#f3ece2'), field(96, '#b8a98a'), ellipse(60, 64, 34, 30, '#3a3a40', null), path('M40 104 L42 46 L78 46 L80 104 Z', STONE, C.ink, 1.6), path('M42 58 C50 48 70 48 78 58 L78 74 C66 64 54 64 42 74 Z', '#2e2e34', null), fire(60, 108, 0.7), smoke(60, 40, 0.8, '#4a4a50'),
    at(98, 74, 1, ellipse(0, 0, 9, 12, C.skin, C.ink, 1.3), ...[-6, -2, 2, 6].map((d) => all(rect(d - 1.8, -18, 3.6, 9, C.skin, 1.6, C.ink, 0.8), ellipse(d, -17, 1.8, 2, '#2e2e34', null))))),
  'forn.träkol': all(bg('#f3ece2'), field(96, '#cfc4ae'), ...[[34, 92], [48, 88], [62, 90], [76, 88], [90, 92], [42, 98], [56, 98], [70, 98], [84, 98], [50, 80], [66, 80], [58, 72]].map(([a, b], i) => path(`M${a! - 7} ${b} L${a! - 5} ${b! - 6} L${a! + 4} ${b! - 7} L${a! + 7} ${b! - 2} L${a! + 5} ${b} Z`, i % 3 ? '#2e2e34' : '#44444c', C.ink, 1)), line('M30 92 L36 90 M62 84 L66 82', '#5a5a64', 1)),
  'forn.skärvsten': all(bg('#f3ece2'), field(96, '#b8a98a'), fire(26, 100, 0.8), at(70, 104, 1, path('M-16 -24 L16 -24 L14 0 L-14 0 Z', '#8a6a44', C.ink, 1.4), ellipse(0, -24, 16, 4, '#8fc6e6', C.ink, 1.2)), smoke(64, 72, 0.6, C.grey), smoke(76, 70, 0.6, C.grey), line('M40 86 L64 72', WOOD, 2.2), line('M42 90 L66 76', WOOD, 2.2), circle(66, 74, 5, '#d86a3a', C.ink, 1.2),
    at(98, 104, 1, path('M-10 0 L-8 -8 L-2 -12 L6 -10 L10 -4 L10 0 Z', STONE, C.ink, 1.2), line('M-2 -12 L0 -6 L-4 0 M6 -10 L2 -4 L4 0', C.ink, 1.2)), ...[[104, 96], [88, 108], [110, 106]].map(([a, b]) => path(`M${a! - 4} ${b} L${a! - 2} ${b! - 4} L${a! + 3} ${b! - 3} L${a! + 4} ${b} Z`, STONE2, C.ink, 0.9)), ring(98, 98, 13)),
  'forn.kokgrop': all(bg(), field(48, GRASS), rect(4, 52, 112, 60, SOIL, 0, null), line('M4 52 L116 52', C.ink, 1.4), path('M24 52 C24 100 96 100 96 52 Z', SOIL2, C.ink, 1.4), ...[[36, 60], [48, 64], [60, 66], [72, 64], [84, 60], [42, 76], [56, 82], [70, 80], [82, 72], [52, 70], [68, 72]].map(([a, b]) => ellipse(a!, b!, 5, 3.6, '#d86a3a', C.ink, 0.9)),
    at(60, 72, 1, ellipse(0, 0, 12, 5, '#6aa84f', C.ink, 1.1), line('M-10 0 L10 0', '#3f7f3a', 0.8)), path('M24 52 C40 46 80 46 96 52', SOIL, C.ink, 1.2), smoke(48, 40, 0.6, C.grey), smoke(72, 40, 0.6, C.grey)),
  'forn.stolphål': all(bg('#f3ece2'), rect(4, 40, 112, 72, '#c9a46a', 0, null), dash('M14 50 L106 50 L106 100 L14 100 Z', C.grey, 1.2, '4 3'), ...[22, 42, 62, 82, 100].map((x) => all(circle(x, 56, 5, '#5a4030', C.ink, 1), circle(x, 94, 5, '#5a4030', C.ink, 1))),
    at(60, 30, 0.5, path('M-44 0 L-44 -14 L0 -30 L44 -14 L44 0 Z', '#d2ac5e', C.ink, 1.6), rect(-44, 0, 88, 14, '#9a6a40', 1, C.ink, 1.4)), dash('M22 37 L22 51 M100 37 L100 51', C.grey, 1), ring(62, 94, 9)),
  'forn.lerklining': all(bg('#f3ece2'), field(106, '#b8a98a'), ...[20, 36, 52, 68, 84, 100].map((x) => line(`M${x} 106 L${x} 20`, '#7a5a34', 3)), ...[28, 40, 52, 64, 76, 88, 100].map((y, i) => path(`M14 ${y} ${[20, 36, 52, 68, 84, 100].map((x, j) => `Q${x} ${y + ((i + j) % 2 ? 5 : -5)} ${x + 8} ${y}`).join(' ')}`, 'none', '#b08a5a', 2.6)),
    path('M14 20 L64 20 C70 40 58 60 66 80 C70 92 60 100 64 106 L14 106 Z', '#c99a6a', C.ink, 1.4), at(76, 70, 1, ellipse(0, 0, 9, 7, C.skin, C.ink, 1.3), ...[-5, -2, 1, 4].map((d) => rect(d - 1.4, -12, 2.8, 8, C.skin, 1.4, C.ink, 0.7)), ellipse(-2, -4, 6, 3, '#c99a6a', null)), line('M84 74 L104 84', C.skin, 6)),
  'forn.jordgolv': all(bg('#3d2e24'), path('M4 4 L60 0 L116 4 L116 70 L4 70 Z', '#5a4030', null), line('M4 70 L116 70', C.ink, 1.2), rect(4, 70, 112, 42, '#9a7048', 0, null), ...[[20, 84], [40, 100], [80, 94], [96, 82], [30, 106], [100, 104]].map(([a, b]) => ellipse(a!, b!, 3, 1.2, '#7a5636', null)), stonesRing(60, 88, 12, 9), fire(60, 88, 0.6), stand(96, 70, 0.4, old(60, 'smile')),
    oval(60, 92, 54, 18)),
  'forn.grophus': all(bg(), field(56, GRASS), rect(4, 60, 112, 52, SOIL, 0, null), line('M4 60 L116 60', C.ink, 1.4), path('M24 60 L26 96 L94 96 L96 60 Z', '#d8c49a', C.ink, 1.4), path('M18 62 L60 20 L102 62 Z', '#d2ac5e', C.ink, 1.6), line('M30 52 L60 22 M90 52 L60 22', '#a8843a', 1),
    at(78, 96, 0.7, line('M-14 0 L-10 -44 M14 0 L10 -44 M-12 -42 L12 -42', WOOD, 2.4), ...[-8, -4, 0, 4, 8].map((d) => line(`M${d} -42 L${d} -6`, '#b07a48', 1)), ...[-8, -2, 4, 8].map((d) => circle(d, -4, 2.2, STONE, C.ink, 0.6))), stand(48, 96, 0.4, old(60, 'calm', { hairStyle: 'long' }), reach(60, 1, 1, 120, 60))),
  'forn.flintavslag': all(bg('#f3ece2'), field(92, '#cfc4ae'), at(56, 72, 1, path('M-14 6 L-10 -10 L4 -16 L14 -4 L10 10 L-6 12 Z', '#6f7480', C.ink, 1.4), line('M-4 -8 L2 2 M4 -12 L8 0', '#9aa0aa', 1)), at(30, 56, 1, ellipse(0, 0, 9, 7, C.skin, C.ink, 1.3), ellipse(4, -4, 7, 5, STONE, C.ink, 1.1)), arrow(36, 60, 46, 66, C.grey, 2),
    ...[[78, 66, 20], [86, 80, -30], [74, 92, 60], [92, 96, 10], [100, 70, -60]].map(([a, b, r]) => g(`translate(${a} ${b}) rotate(${r})`, path('M-5 0 L0 -3 L6 0 L0 3 Z', '#8a909a', C.ink, 0.9))), ...[[78, 66], [86, 80], [74, 92], [92, 96], [100, 70]].map(([a, b]) => ring(a!, b!, 6)), line('M70 70 l4 -2 M70 76 l5 0', C.grey, 1.2)),
  'forn.avfallshög': all(bg(), field(84, GRASS), at(24, 96, 0.7, path('M-22 0 L0 -40 L22 0 Z', '#b08a5a', C.ink, 1.8), path('M-6 0 L-6 -10 C-6 -16 6 -16 6 -10 L6 0 Z', '#3d2a1a', C.ink, 1.2)), path('M50 108 C56 72 102 72 110 108 Z', '#a89070', C.ink, 1.6),
    ...[[64, 96, 20], [80, 92, -20], [94, 100, 40], [72, 104, -60], [88, 84, 10]].map(([a, b, r]) => g(`translate(${a} ${b}) rotate(${r})`, line('M-6 0 L6 0', BONE, 2.6), circle(-6, 0, 1.8, BONE, C.ink, 0.6), circle(6, 0, 1.8, BONE, C.ink, 0.6))), ...[[70, 88], [100, 94], [84, 104]].map(([a, b]) => path(`M${a! - 4} ${b} C${a! - 4} ${b! - 6} ${a! + 4} ${b! - 6} ${a! + 4} ${b} Z`, '#f0e2d0', C.ink, 0.8)), at(78, 82, 0.7, path('M-7 -8 L4 -8 L6 0 L-8 0 Z', CLAY, C.ink, 1))),
  // 2317 Skydda fornlämningar
  'forn.kulturmiljölag': all(bg('#eef3ef'), field(90, GRASS), mound(34, 108, 26, 14), runestone(80, 108, 0.9), bookLaw(60, 40, 1.4), dash('M44 60 C30 70 30 84 34 92 M76 60 C88 70 84 78 80 84', C.navy, 1.4), shieldS(30, 72, 0.6), shieldS(98, 72, 0.6)),
  'forn.skyddsområde': all(bg(), field(60, GRASS), mound(52, 94, 22, 13), stoneUp(70, 94, 12, 3), dash('M16 88 C16 62 92 62 92 88 C92 112 16 112 16 88 Z', C.red, 2.2, '5 3'), at(104, 106, 0.6, rect(-14, -16, 28, 16, '#c0563d', 1, C.ink, 1.2), path('M-16 -16 L0 -28 L16 -16 Z', '#7a3b2b', C.ink, 1.2)), okC(104, 72, 6), at(30, 74, 0.8, line('M0 0 L0 -14', C.ink, 1.4), rect(-6, -22, 12, 9, C.white, 1, C.ink, 1), circle(0, -17.5, 2.6, 'none', C.navy, 1))),
  'forn.markingrepp': all(bg(), rect(4, 72, 112, 40, SOIL, 0, null), field(68, GRASS), rect(4, 68, 112, 4, GRASS, 0, null), path('M60 72 L64 96 L100 96 L104 72 Z', SOIL2, C.ink, 1.4), digger(36, 74, 1), path('M14 72 C18 60 40 58 44 72 Z', SOIL, C.ink, 1.2), ring(82, 84, 18)),
  'forn.olovlig': all(bg('#2e3446'), field(92, '#4a5a3a'), mound(70, 112, 30, 16, '#5a7a4a'), at(100, 22, 1, circle(0, 0, 7, '#f4ecc8', null), circle(3, -2, 6, '#2e3446', null)), stand(38, 112, 0.8, now(60, C.dark, 'angry', { hairStyle: 'short' }), reach(60, 1, 1, 86, 92)), spade(60, 106, 0.7, 20), ban(88, 46, 12),
    greyed(at(18, 38, 0.8, rect(-9, -12, 18, 24, C.white, 1, C.ink, 1.2), line('M-5 -6 L5 -6 M-5 -2 L5 -2 M-5 2 L2 2', C.grey, 1), circle(4, 7, 3, C.red, null)))),
  'forn.vittra': all(bg(), field(100, GRASS), greyed(runestone(30, 108, 1.1)), at(86, 108, 1.1, path('M-16 0 L-18 -40 C-18 -48 -12 -54 -4 -56 L2 -52 L8 -56 C14 -54 18 -48 18 -40 L16 0 Z', STONE, C.ink, 1.8), path('M-11 -2 L-13 -38 C-13 -46 -6 -50 0 -48', 'none', '#e8a090', 3, ), line('M-6 -36 L-2 -28 L-6 -20 M6 -44 L10 -34 M2 -16 L8 -8', C.ink, 1.1), line('M-10 -24 l2 -2 M8 -24 l-2 -2', C.ink, 0.6)),
    ...[[104, 74], [108, 84], [102, 94]].map(([a, b]) => ellipse(a!, b!, 1.6, 1.2, STONE2, null)), cloud(86, 22, 0.7, C.grey2), rain(76, 32, 24)),
  'forn.lav': all(bg(), field(100, GRASS), path('M14 108 L18 40 C24 24 96 24 102 40 L106 108 Z', STONE, C.ink, 1.8), ...[[36, 54, 10, 7], [70, 46, 12, 8], [54, 78, 14, 9], [88, 74, 9, 7], [30, 92, 8, 6], [80, 98, 11, 6]].map(([x, y, rx, ry], i) => all(ellipse(x!, y!, rx!, ry!, i % 2 ? LICHEN : '#a8c47a', null), ...[0, 1, 2, 3].map((k) => circle(f1(x! + Math.cos(k * 1.7) * rx! * 0.7), f1(y! + Math.sin(k * 1.7) * ry! * 0.7), 2, i % 2 ? '#c4a82a' : '#8aa860', null)))),
    lens(70, 46, 1.4)),
  'forn.sly': all(bg(), field(76, GRASS), mound(60, 106, 40, 22), ...[[30, 104], [40, 96], [50, 90], [62, 88], [74, 90], [84, 96], [94, 104], [46, 104], [70, 100], [58, 98]].map(([a, b], i) => sapling(a!, b!, 0.9 + (i % 3) * 0.2)), now(104, C.orange, 'frown', { h: 0.6 }), oval(62, 86, 40, 18)),
};
