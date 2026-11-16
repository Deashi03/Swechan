/**
 * Natur & geografi → Djurvärlden → Fiskar & vattenlevande djur, 2721–2727 (0.44): Swedish freshwater fish and
 * angling, sea fish and fishing, sharks and rays, crustaceans, molluscs, the anatomy of a fish and life on a coral
 * reef.
 * Recurring signs: species are drawn from the side (fish, sharks) or from above (rays, flatfish, crabs) with the
 * features that tell them apart (the duck-bill snout of the pike, the red belly of the char, the black blotch of
 * the haddock, the hammer head …); light blue fresh water and darker blue sea; a sandy bottom; tiny divers or boats
 * for scale; an orange ring or orange colour on the part that the word names (anatomy). Digits only; no words,
 * no brands, no pointing fingers. Abstract words are small symbolic scenes with a grey reference as contrast.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { type Build } from './figures';
import { HL, arm } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const SKY = '#e2eff8';
const FRESH = '#bfe2f4';
const SEA = '#8fc6e8';
const SEA2 = '#3f86c0';
const DEEP = '#1d3f66';
const LAND = '#8cc96a';
const LAND2 = '#5f9e48';
const SPRUCE = '#3f7a4a';
const SAND = '#e9d5a1';
const SAND2 = '#d8bf82';
const ROCK = '#9a8a78';
const ROCK2 = '#7a6c5c';
const REED = '#8aa84e';
const WOOD = '#a0673d';
const WOOD2 = '#7a4a26';
const WEED = '#4f9a5a';
const SILVER = '#c9d2da';
const SHARK = '#8e9aa6';
const BONE = '#f4f1e6';
const CART = '#bfe3f0';
const GILL = '#d9475a';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const atR = (x: number, y: number, s: number, rot: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, ...k);
const flip = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${-s} ${s})`, ...k);
const num = (x: number, y: number, n: string, size = 9, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${n}</text>`;
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.4);
const ban = (x: number, y: number, r = 7, w = 2.4) => all(circle(x, y, r, 'none', C.red, w), line(`M${f1(x - r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r * 0.7)} ${f1(y - r * 0.7)}`, C.red, w));

// ── Scenery ──────────────────────────────────────────────────────────
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const water = (col: string = FRESH) => rect(4, 4, 112, 108, col, 3, null);
const sandFloor = (y = 98, col: string = SAND) => path(`M4 ${y} C30 ${y - 4} 60 ${y + 3} 90 ${y - 2} C100 ${y - 3} 110 ${y - 1} 116 ${y} L116 112 L4 112 Z`, col, null);
const mudFloor = (y = 100) => sandFloor(y, '#b49a72');
const waves = (x1: number, x2: number, y: number, col: string = C.white, sw = 1.1) => line(range(Math.max(1, Math.floor((x2 - x1) / 10))).map((i) => `M${x1 + i * 10} ${y} q2.5 -2.5 5 0 t5 0`).join(' '), col, sw);
const surface = (y: number, col: string = SEA, sky: string = SKY) => all(rect(4, 4, 112, y - 4, sky, 3, null), rect(4, y, 112, 112 - y, col, 0, null), line(`M4 ${y} L116 ${y}`, '#ffffff', 1.4), waves(6, 112, y + 3, '#ffffff', 0.9));
const bubbles = (x: number, y: number, n = 3) => all(...range(n).map((i) => circle(x + (i % 2) * 3, y - i * 6, 1.4 + (i % 2) * 0.6, 'none', '#ffffff', 0.9)));
const reed = (x: number, y: number, h: number) => all(line(`M${x} ${y} L${x + 1} ${y - h}`, REED, 1.6), ellipse(x + 1, y - h + 4, 1.6, 4, '#8a6a3a', null));
const weed = (x: number, y: number, h: number, col: string = WEED) => line(`M${x} ${y} C${x - 4} ${y - h * 0.3} ${x + 4} ${y - h * 0.6} ${x} ${y - h}`, col, 2.2);
const stone = (x: number, y: number, rx: number, ry: number, col: string = ROCK) => ellipse(x, y, rx, ry, col, C.ink, 1);
const spruce = (x: number, y = 112, s = 1, col: string = SPRUCE) => at(x, y, s, rect(-1.5, -6, 3, 6, C.brown, 0, C.ink, 0.8), path('M0 -34 L9 -14 L5 -14 L11 -6 L-11 -6 L-5 -14 L-9 -14 Z', col, C.ink, 1.1));
const sun = (x: number, y: number, r = 6) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 5))} ${f1(y + Math.sin(a) * (r + 5))}`, C.gold, 1.6); }), circle(x, y, r, C.yellow, C.ink, 1.1));
const cloud = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', col, C.ink, 1.2));
const thermo = (x: number, y: number, lvl: number, col: string = C.red) => all(rect(x - 2.5, y - 24, 5, 24, C.white, 2.5, C.ink, 1.1), rect(x - 1.2, f1(y - lvl), 2.4, lvl, col, 1, null), circle(x, y + 2, 4, col, C.ink, 1.1));
const lens = (x: number, y: number, r: number, inner: Svg, hx = 1, hy = 1) => all(circle(x, y, r, '#f4fbff', C.ink, 1.6), inner, line(`M${f1(x + r * 0.7 * hx)} ${f1(y + r * 0.7 * hy)} L${f1(x + r * 1.25 * hx)} ${f1(y + r * 1.25 * hy)}`, C.dark, 4));
const seagull = (x: number, y: number, s = 1) => at(x, y, s, path('M-7 0 Q-3.5 -4 0 0 Q3.5 -4 7 0', 'none', C.ink, 1.3));

// ── Fish builder (side view, head to the left, centred on 0 0) ──────
type Fin = [x1: number, x2: number, h: number, col?: string];
type FishO = {
  L?: number; H?: number; B?: number; col: string; belly?: string; tail?: 'fork' | 'round' | 'square' | 'moon' | 'none'; tailCol?: string; T?: number;
  dorsal?: Fin[]; anal?: Fin[]; pelvic?: boolean; pect?: string | false; finCol?: string; eye?: number; iris?: string; snout?: 'duck' | 'big' | 'small' | 'down';
  marks?: Svg; over?: Svg; gill?: boolean; spiny?: boolean;
};
function fishSide(o: FishO): Svg {
  const L = o.L ?? 30, H = o.H ?? 10, B = o.B ?? H * 0.85, tx = f1(L * 0.78), T = o.T ?? H * 0.95, fc = o.finCol ?? o.col, tc = o.tailCol ?? fc;
  const bodyD = `M${-L} 0 C${f1(-L * 0.75)} ${f1(-H * 1.05)} ${f1(L * 0.35)} ${f1(-H * 1.02)} ${tx} ${f1(-H * 0.22)} L${tx} ${f1(B * 0.22)} C${f1(L * 0.35)} ${f1(B * 1.02)} ${f1(-L * 0.75)} ${f1(B * 1.05)} ${-L} 0 Z`;
  const tails: Record<string, string> = {
    fork: `M${f1(tx - 2)} 0 L${f1(tx + T)} ${f1(-T)} L${f1(tx + T * 0.55)} 0 L${f1(tx + T)} ${f1(T)} Z`,
    moon: `M${f1(tx - 2)} 0 L${f1(tx + T * 0.7)} ${f1(-T * 1.3)} C${f1(tx + T * 0.5)} ${f1(-T * 0.4)} ${f1(tx + T * 0.5)} ${f1(T * 0.4)} ${f1(tx + T * 0.7)} ${f1(T * 1.3)} Z`,
    round: `M${f1(tx - 2)} ${f1(-H * 0.25)} C${f1(tx + T * 1.3)} ${f1(-T * 1.1)} ${f1(tx + T * 1.3)} ${f1(T * 1.1)} ${f1(tx - 2)} ${f1(B * 0.25)} Z`,
    square: `M${f1(tx - 2)} ${f1(-H * 0.25)} L${f1(tx + T)} ${f1(-T)} L${f1(tx + T * 0.92)} 0 L${f1(tx + T)} ${f1(T)} L${f1(tx - 2)} ${f1(B * 0.25)} Z`,
    none: '',
  };
  const fins = (o.dorsal ?? []).map(([a, b, h, col]) => path(`M${a} ${f1(-H * 0.55)} L${f1(a + (b - a) * (o.spiny ? 0.15 : 0.3))} ${f1(-H - h)} ${o.spiny ? `L${f1(a + (b - a) * 0.5)} ${f1(-H - h * 0.8)} ` : ''}L${b} ${f1(-H * 0.7)} Z`, col ?? fc, C.ink, 1));
  const anals = (o.anal ?? []).map(([a, b, h, col]) => path(`M${a} ${f1(B * 0.55)} L${f1(a + (b - a) * 0.35)} ${f1(B + h)} L${b} ${f1(B * 0.6)} Z`, col ?? fc, C.ink, 1));
  const pelvic = o.pelvic === false ? '' : path(`M${f1(-L * 0.35)} ${f1(B * 0.75)} L${f1(-L * 0.25)} ${f1(B + 5)} L${f1(-L * 0.1)} ${f1(B * 0.8)} Z`, fc, C.ink, 1);
  const eyeR = o.eye ?? Math.max(1.6, H * 0.2), ex = f1(-L * 0.72), ey = f1(-H * 0.28);
  const mouth = o.snout === 'big' ? path(`M${-L} 0 L${f1(-L * 0.7)} ${f1(B * 0.2)} L${-L} ${f1(B * 0.35)}`, '#7a3a3a', C.ink, 0.9)
    : o.snout === 'down' ? line(`M${f1(-L + 0.5)} ${f1(B * 0.2)} L${f1(-L * 0.88)} ${f1(B * 0.3)}`, C.ink, 1)
    : line(`M${-L} ${f1(B * 0.05)} L${f1(-L * 0.86)} ${f1(B * 0.1)}`, C.ink, 1);
  const belly = o.belly ? path(`M${f1(-L * 0.9)} ${f1(B * 0.22)} C${f1(-L * 0.5)} ${f1(B * 0.98)} ${f1(L * 0.4)} ${f1(B * 0.98)} ${f1(tx - 1)} ${f1(B * 0.2)} C${f1(L * 0.3)} ${f1(B * 0.42)} ${f1(-L * 0.4)} ${f1(B * 0.46)} ${f1(-L * 0.9)} ${f1(B * 0.22)} Z`, o.belly, null) : '';
  const pect = o.pect === false ? '' : path(`M${f1(-L * 0.5)} ${f1(B * 0.15)} C${f1(-L * 0.38)} ${f1(B * 0.05)} ${f1(-L * 0.22)} ${f1(B * 0.35)} ${f1(-L * 0.3)} ${f1(B * 0.62)} C${f1(-L * 0.4)} ${f1(B * 0.5)} ${f1(-L * 0.48)} ${f1(B * 0.35)} ${f1(-L * 0.5)} ${f1(B * 0.15)} Z`, o.pect ?? fc, C.ink, 0.9);
  return all(...fins, ...anals, pelvic, (o.tail ?? 'fork') === 'none' ? '' : path(tails[o.tail ?? 'fork']!, tc, C.ink, 1.1), path(bodyD, o.col, C.ink, 1.3), belly, o.marks ?? '',
    o.gill === false ? '' : path(`M${f1(-L * 0.56)} ${f1(-H * 0.7)} C${f1(-L * 0.48)} ${f1(-H * 0.2)} ${f1(-L * 0.48)} ${f1(B * 0.3)} ${f1(-L * 0.58)} ${f1(B * 0.75)}`, 'none', C.ink, 0.9),
    pect, circle(ex, ey, eyeR, o.iris ?? C.white, C.ink, 0.8), circle(f1(ex - eyeR * 0.15), ey, f1(eyeR * 0.5), C.ink, null), mouth, o.over ?? '');
}
const fishAt = (x: number, y: number, s: number, o: FishO, right = false) => (right ? flip(x, y, s, fishSide(o)) : at(x, y, s, fishSide(o)));
const spots = (pts: number[][], col: string, r = 1.2) => all(...pts.map(([x, y, rr]) => circle(x!, y!, rr ?? r, col, null)));
const bars = (xs: number[], top: number, bot: number, col: string, w = 2.6) => all(...xs.map((x) => line(`M${x} ${top} L${x - 1} ${bot}`, col, w)));
/** A small generic fish (for crowds), head left. */
const minnow = (x: number, y: number, s = 1, col: string = SILVER, right = false) => g(`translate(${x} ${y}) scale(${right ? -s : s} ${s})`, path('M-6 0 C-3 -3.4 3 -3.4 5 0 C3 3.4 -3 3.4 -6 0 Z M5 0 L9 -3 L8 0 L9 3 Z', col, C.ink, 0.7), circle(-3.6, -0.6, 0.7, C.ink, null));

// Species (local coordinates)
const PIKE: FishO = { L: 46, H: 7, B: 7, col: '#7f9a4a', belly: '#e8e2b8', tail: 'fork', T: 9, finCol: '#9a8a4a', dorsal: [[22, 33, 6]], anal: [[22, 32, 5]], snout: 'big',
  marks: spots([[-20, -2], [-10, -4], [0, -1], [10, -4], [20, -2], [-14, 3], [-4, 4], [6, 2], [16, 3], [26, -1]], '#e3e6a8', 1.5), over: path('M-46 0 L-36 -3 M-46 0 L-36 2', 'none', C.ink, 0.6) };
const PERCH_MARKS = bars([-12, -4, 4, 12, 19], -9, 4, '#3f5a2a', 3);
const ZANDER: FishO = { L: 36, H: 8, B: 7, col: '#9aa58e', belly: '#eef0e6', tail: 'fork', T: 8, finCol: '#b9b8a0', spiny: true, dorsal: [[-14, 2, 8], [6, 22, 6]], anal: [[12, 22, 5]], eye: 3, iris: '#e6eef0', snout: 'big',
  marks: all(bars([-10, -2, 6, 14], -7, 1, 'rgba(60,70,60,0.35)', 3), spots([[-12, -9.4], [-6, -10.4], [0, -10.2], [10, -9.6], [16, -9.4]], C.ink, 0.7)) };
const ROACH: FishO = { L: 22, H: 7, B: 6, col: SILVER, belly: '#f2f4f6', tail: 'fork', T: 7, finCol: '#d8564a', dorsal: [[-4, 6, 5]], anal: [[4, 12, 4]], iris: '#d8302a', eye: 2.2 };
const BREAM: FishO = { L: 26, H: 15, B: 13, col: '#b59a5a', belly: '#d9c48c', tail: 'fork', T: 9, finCol: '#6e6a5a', dorsal: [[-2, 8, 6]], anal: [[0, 18, 4]], snout: 'down', eye: 2.4,
  marks: line('M-22 -2 C-10 -8 8 -8 18 -2', 'rgba(255,240,200,0.6)', 1.2) };
const TROUT: FishO = { L: 30, H: 8, B: 7, col: '#8a7a4a', belly: '#e9dcb0', tail: 'square', T: 8, finCol: '#8a7a4a', dorsal: [[-6, 6, 6], [16, 19, 2.5]], anal: [[10, 18, 4]],
  marks: all(spots([[-18, -4], [-10, -6], [-2, -3], [6, -6], [12, -2], [-14, 1], [2, 0], [10, 2]], '#3a2a1a', 1.2), spots([[-6, -1], [4, 3], [14, -5], [-16, -1], [8, -2]], '#d8402a', 1.3)) };
const CHAR: FishO = { L: 30, H: 8, B: 7, col: '#5f7a6a', belly: '#e9603a', tail: 'square', T: 8, finCol: '#e9603a', dorsal: [[-6, 6, 6, '#5f7a6a'], [16, 19, 2.5, '#5f7a6a']], anal: [[10, 18, 4]],
  marks: spots([[-18, -4], [-10, -6], [-2, -3], [6, -6], [12, -3], [18, -4], [-6, -1], [2, -1]], '#f2e8c8', 1.1),
  over: all(line('M-9.6 7 L-7.5 11.6', C.white, 1.3), line('M10 7 L13.5 11', C.white, 1.3)) };
const COD: FishO = { L: 32, H: 9, B: 8, col: '#a8a07a', belly: '#f0ead8', tail: 'square', T: 8, finCol: '#a8a07a', dorsal: [[-12, -2, 5], [0, 10, 4], [12, 20, 4]], anal: [[0, 10, 4], [12, 20, 4]],
  marks: all(spots([[-18, -5], [-8, -6], [2, -5], [12, -4], [-14, -1], [-2, -2], [8, -1]], '#7a704a', 1), line('M-24 -3 C-8 -5 10 -3 24 -1', '#f4eedc', 1.2)),
  over: line('M-30 3 L-29 7', C.ink, 1) };
const HADDOCK: FishO = { ...COD, col: '#8a929c', belly: '#eef0f2', finCol: '#6a727c', marks: all(line('M-24 -3 C-8 -5 10 -3 24 -1', C.ink, 1.6), ellipse(-14, -2, 3.2, 2.4, C.ink, null)), over: line('M-30 3 L-29 6', C.ink, 0.8) };
const HERRING: FishO = { L: 22, H: 5, B: 5, col: '#5a86b0', belly: '#e6edf2', tail: 'fork', T: 6, finCol: '#9ab0c4', dorsal: [[-2, 6, 4]], anal: [[8, 14, 2]], pelvic: false };
const MACKEREL: FishO = { L: 30, H: 6, B: 6, col: '#3a8a8a', belly: '#eef2f2', tail: 'fork', T: 8, finCol: '#4a7a8a', dorsal: [[-10, -2, 5], [6, 12, 3]], anal: [[6, 12, 3]],
  marks: line('M-16 -5 q3 4 6 0 t6 0 t6 0 t6 0 t6 0 M-14 -2 q3 3 6 0 t6 0 t6 0 t6 0', '#1e3a4a', 1.1) };
const TUNA: FishO = { L: 34, H: 10, B: 9, col: '#2f4a7a', belly: '#e8eef4', tail: 'moon', T: 10, finCol: '#2f4a7a', dorsal: [[-6, 6, 6], [14, 20, 4, C.yellow]], anal: [[14, 20, 4, C.yellow]],
  marks: spots([[20, -5, 0.9], [23, -4, 0.9], [20, 5, 0.9], [23, 4, 0.9]], C.yellow) };
const SALMON: FishO = { L: 32, H: 8, B: 7, col: '#9aa8b8', belly: '#eef0f4', tail: 'square', T: 8, finCol: '#8a98a8', dorsal: [[-6, 6, 6], [16, 19, 2.5]], anal: [[10, 18, 4]], marks: spots([[-14, -5], [-6, -6], [2, -6], [10, -5], [-10, -2], [6, -3]], '#3a3a4a', 0.9) };
const generic = (col: string = '#7aa86a'): FishO => ({ L: 24, H: 7, B: 6, col, belly: '#eef0e0', tail: 'fork', T: 7, dorsal: [[-6, 6, 5]], anal: [[6, 12, 3]] });
const PERCH: FishO = { L: 26, H: 9, B: 8, col: '#8fa85a', belly: '#eef0d8', tail: 'fork', T: 8, finCol: '#e86a3a', spiny: true, dorsal: [[-10, 4, 7, '#a0a870'], [6, 16, 5, '#a0a870']], anal: [[8, 16, 4]], marks: PERCH_MARKS };

// Sharks and rays
type SharkO = { col?: string; belly?: string; L?: number; mouth?: 'open' | 'gape' | 'none'; marks?: Svg; head?: 'hammer' | 'wide' | 'pointed'; spines?: boolean; over?: Svg; teeth?: boolean };
function sharkSide(o: SharkO = {}): Svg {
  const col = o.col ?? SHARK, bel = o.belly ?? '#f2f4f6';
  const body = o.head === 'wide' ? 'M-44 -2 C-44 -8 -30 -12 -8 -11 C14 -10 28 -6 38 -2 L38 2 C28 5 10 9 -10 9 C-30 9 -44 6 -44 -2 Z'
    : 'M-44 1 C-40 -6 -26 -11 -6 -11 C14 -10 28 -6 38 -2 L38 2 C28 5 10 9 -10 9 C-28 9 -40 6 -44 1 Z';
  const bellyD = o.head === 'wide' ? 'M-42 3 C-30 9 0 10 20 6 C30 4 36 2 38 2 C26 7 6 10 -12 9 C-30 9 -40 6 -42 3 Z' : 'M-42 3 C-28 8 0 9 20 6 C30 4 36 2 38 2 C26 7 6 10 -12 9 C-30 9 -40 6 -42 3 Z';
  return all(
    path('M-8 -10 L2 -30 L10 -10 Z', col, C.ink, 1.2), path('M20 -7 L24 -14 L27 -6 Z', col, C.ink, 1),
    path('M36 -2 L52 -22 L46 0 L50 10 L36 2 Z', col, C.ink, 1.2), path('M14 7 L18 13 L22 6 Z', col, C.ink, 1),
    o.spines ? all(path('M-9 -10 L-6 -18 L-5 -10 Z', C.white, C.ink, 0.8), path('M19 -7 L21 -13 L22 -7 Z', C.white, C.ink, 0.8)) : '',
    path(body, col, C.ink, 1.3), path(bellyD, bel, null),
    o.head === 'hammer' ? all(path('M-36 -2 L-46 -14 L-50 -12 L-44 0 L-50 10 L-46 12 L-36 4 Z', col, C.ink, 1.2), circle(-48, -12, 1.4, C.ink, null), circle(-48, 10, 1.4, C.ink, null)) : circle(-34, -4, o.head === 'wide' ? 1.4 : 1.8, C.ink, null),
    ...range(5).map((i) => line(`M${-24 + i * 3} -4 C${-25 + i * 3} 0 ${-25 + i * 3} 3 ${-24 + i * 3} 6`, C.ink, 0.8)),
    path('M-12 6 L-2 16 L2 8 Z', col, C.ink, 1),
    o.mouth === 'open' ? all(path('M-44 2 L-30 4 L-42 9 Z', '#7a2a32', C.ink, 1), o.teeth !== false ? line('M-42 3 l1 1.4 l1 -1.2 l1 1.4 l1 -1.2 l1 1.4 l1 -1.2 l1 1.4 l1 -1.2 l1 1.4', C.white, 0.8) : '')
      : o.mouth === 'gape' ? all(ellipse(-41, 2, 5, 8, '#3a2a32', C.ink, 1.2), ...range(4).map((i) => line(`M-44 ${-3 + i * 3.4} L-38 ${-3 + i * 3.4}`, '#b8a0a8', 0.6)))
      : o.mouth === 'none' ? '' : line('M-41 4 C-38 5 -34 5 -31 4', C.ink, 1),
    o.marks ?? '', o.over ?? '');
}
const sharkAt = (x: number, y: number, s: number, o: SharkO = {}, right = false) => (right ? flip(x, y, s, sharkSide(o)) : at(x, y, s, sharkSide(o)));
/** A ray seen from above, nose up; centred on 0 0. */
function rayTop(o: { col?: string; w?: number; h?: number; marks?: Svg; tail?: number; barb?: boolean; horns?: boolean; thorns?: boolean; over?: Svg } = {}): Svg {
  const col = o.col ?? '#8a7a64', w = o.w ?? 34, h = o.h ?? 24, tl = o.tail ?? 40;
  const shape = o.horns ? `M0 ${-h * 0.6} C${w * 0.3} ${-h * 0.7} ${w * 0.7} ${-h * 0.2} ${w} ${h * 0.1} C${w * 0.6} ${h * 0.25} ${w * 0.25} ${h * 0.55} 0 ${h * 0.6} C${-w * 0.25} ${h * 0.55} ${-w * 0.6} ${h * 0.25} ${-w} ${h * 0.1} C${-w * 0.7} ${-h * 0.2} ${-w * 0.3} ${-h * 0.7} 0 ${-h * 0.6} Z`
    : `M0 ${-h} C${w * 0.3} ${-h * 0.6} ${w * 0.8} ${-h * 0.1} ${w} ${h * 0.1} C${w * 0.6} ${h * 0.4} ${w * 0.25} ${h * 0.7} 0 ${h * 0.75} C${-w * 0.25} ${h * 0.7} ${-w * 0.6} ${h * 0.4} ${-w} ${h * 0.1} C${-w * 0.8} ${-h * 0.1} ${-w * 0.3} ${-h * 0.6} 0 ${-h} Z`;
  return all(line(`M0 ${h * 0.6} L0 ${h * 0.6 + tl}`, C.ink, 3.4), line(`M0 ${h * 0.6} L0 ${h * 0.6 + tl}`, col, 2),
    o.barb ? path(`M-2.6 ${h * 0.6 + tl * 0.4} L0 ${h * 0.6 + tl * 0.4 + 14} L2.6 ${h * 0.6 + tl * 0.4} Z`, C.white, C.ink, 0.9) : '',
    path(f1s(shape), col, C.ink, 1.4), o.marks ?? '',
    o.horns ? all(path(`M-6 ${-h * 0.55} L-8 ${-h * 0.95} L-3 ${-h * 0.6} Z`, col, C.ink, 1), path(`M6 ${-h * 0.55} L8 ${-h * 0.95} L3 ${-h * 0.6} Z`, col, C.ink, 1)) : '',
    o.thorns ? all(...range(6).map((i) => path(`M-1.2 ${-h * 0.3 + i * 5} L0 ${-h * 0.3 + i * 5 - 3} L1.2 ${-h * 0.3 + i * 5} Z`, '#f2e6c8', C.ink, 0.6))) : '',
    circle(-4, -h * 0.35, 1.3, C.ink, null), circle(4, -h * 0.35, 1.3, C.ink, null), o.over ?? '');
}
const f1s = (d: string) => d.replace(/-?\d+\.\d+/g, (m) => String(f1(+m)));
const rayAt = (x: number, y: number, s: number, o: Parameters<typeof rayTop>[0] = {}, rot = 0) => atR(x, y, s, rot, rayTop(o));

/** A flatfish seen from above, head to the left; centred on 0 0. */
const flatfish = (col: string, fringe: string, marks: Svg = '') => all(path('M20 -4 L32 -11 L30 0 L32 11 L20 4 Z', fringe, C.ink, 1),
  ellipse(-2, 0, 26, 15, fringe, C.ink, 1.1), ...range(15).map((i) => { const x = -24 + i * 3.2, dy = 15 * Math.sqrt(Math.max(0, 1 - ((x + 2) / 26) ** 2)) * 0.92; return line(`M${f1(x)} ${f1(-dy)} L${f1(x)} ${f1(dy)}`, 'rgba(0,0,0,0.18)', 0.7); }),
  ellipse(-2, 0, 21, 11, col, C.ink, 1), line('M-14 -1 C0 -2 10 -1 19 0', 'rgba(0,0,0,0.3)', 0.9), marks,
  circle(-16, -4, 2, C.white, C.ink, 0.7), circle(-12, -6.6, 2, C.white, C.ink, 0.7), circle(-16.4, -4, 0.9, C.ink, null), circle(-12.4, -6.6, 0.9, C.ink, null), path('M-23 1 Q-21 4 -19 2', 'none', C.ink, 0.9));
/** A hammerhead seen from above, head to the left; centred on 0 0. */
const hammerTop = (col: string = SHARK) => all(path('M30 0 L46 -10 L42 0 L46 6 Z', col, C.ink, 1.1), path('M-10 -3 L4 -20 L8 -4 Z M-10 3 L4 20 L8 4 Z', col, C.ink, 1.1), path('M18 -2 L24 -8 L26 -1 Z M18 2 L24 8 L26 1 Z', col, C.ink, 0.9),
  path('M-30 0 C-28 -7 0 -8 32 -2 L32 2 C0 8 -28 7 -30 0 Z', col, C.ink, 1.3), line('M-6 0 L8 0', '#6e7a86', 3),
  path('M-36 -20 C-31 -21 -29 -19 -29 -15 L-30 -4 L-30 4 L-29 15 C-29 19 -31 21 -36 20 C-38 12 -38 -12 -36 -20 Z', col, C.ink, 1.3), circle(-35, -18, 1.6, C.ink, null), circle(-35, 18, 1.6, C.ink, null));

// Crustaceans (top view, head up, centred on 0 0)
function crayfishTop(o: { col?: string; claw?: string; spot?: string; antenna?: string; s?: number; clawHL?: boolean } = {}): Svg {
  const col = o.col ?? '#6a5a3a', cl = o.claw ?? col, an = o.antenna ?? C.ink;
  const leg = (y: number, side: -1 | 1) => line(`M${side * 5} ${y} L${side * 12} ${y - 2} L${side * 15} ${y + 4}`, C.ink, 1);
  const claw = (side: -1 | 1) => all(line(`M${side * 5} -6 L${side * 12} -14 L${side * 12} -22`, C.ink, 3.6), line(`M${side * 5} -6 L${side * 12} -14 L${side * 12} -22`, col, 2.2),
    path(`M${side * 9} -22 C${side * 6} -30 ${side * 8} -40 ${side * 12} -42 C${side * 13} -36 ${side * 13} -32 ${side * 12} -30 C${side * 16} -34 ${side * 18} -40 ${side * 16} -44 C${side * 20} -40 ${side * 20} -28 ${side * 15} -22 Z`, cl, o.clawHL ? HL : C.ink, o.clawHL ? 2 : 1.1),
    o.spot ? circle(side * 13, -24, 2.2, o.spot, C.ink, 0.6) : '');
  return all(line('M-2 -18 C-10 -34 -18 -46 -24 -52 M2 -18 C10 -34 18 -46 24 -52', an, o.antenna ? 2.2 : 0.9),
    ...[-2, 2, 6, 10].flatMap((y) => [leg(y, -1), leg(y, 1)]), claw(-1), claw(1),
    path('M-6 -18 C-7 -10 -7 4 -5 8 L5 8 C7 4 7 -10 6 -18 C4 -21 -4 -21 -6 -18 Z', col, C.ink, 1.2),
    ...range(5).map((i) => path(`M-5 ${8 + i * 4.4} L5 ${8 + i * 4.4} L4.6 ${12 + i * 4.4} L-4.6 ${12 + i * 4.4} Z`, col, C.ink, 0.9)),
    path('M-4.6 30 L-9 38 L0 36 L9 38 L4.6 30 Z', col, C.ink, 1), circle(-2.4, -18, 1, C.ink, null), circle(2.4, -18, 1, C.ink, null));
}
const crayAt = (x: number, y: number, s: number, o: Parameters<typeof crayfishTop>[0] = {}, rot = 0) => atR(x, y, s, rot, crayfishTop(o));
function crabTop(o: { col?: string; w?: number; clawHL?: boolean } = {}): Svg {
  const col = o.col ?? '#c8502a', w = o.w ?? 18;
  const leg = (i: number, side: -1 | 1) => line(`M${side * (w - 4)} ${-2 + i * 4} L${side * (w + 6)} ${-6 + i * 5} L${side * (w + 10)} ${2 + i * 5}`, C.ink, 1.6);
  const leg2 = (i: number, side: -1 | 1) => line(`M${side * (w - 4)} ${-2 + i * 4} L${side * (w + 6)} ${-6 + i * 5} L${side * (w + 10)} ${2 + i * 5}`, col, 0.9);
  const claw = (side: -1 | 1) => all(line(`M${side * (w - 6)} -8 L${side * (w + 2)} -16`, C.ink, 3.4), line(`M${side * (w - 6)} -8 L${side * (w + 2)} -16`, col, 2),
    path(`M${side * (w - 2)} -16 C${side * (w - 4)} -24 ${side * (w + 2)} -30 ${side * (w + 4)} -28 L${side * (w + 2)} -22 L${side * (w + 8)} -26 C${side * (w + 10)} -20 ${side * (w + 8)} -14 ${side * (w + 2)} -14 Z`, col, o.clawHL ? HL : C.ink, o.clawHL ? 2.2 : 1.1));
  return all(...range(4).flatMap((i) => [leg(i, -1), leg2(i, -1), leg(i, 1), leg2(i, 1)]), claw(-1), claw(1),
    path(`M${-w} -2 C${-w} -14 ${w} -14 ${w} -2 C${w} 8 ${w * 0.5} 12 0 12 C${-w * 0.5} 12 ${-w} 8 ${-w} -2 Z`, col, C.ink, 1.3),
    line(`M-5 -10 L-5 -14 M5 -10 L5 -14`, C.ink, 1), circle(-5, -14.5, 1.4, C.ink, null), circle(5, -14.5, 1.4, C.ink, null), path('M-6 0 Q0 3 6 0', 'none', 'rgba(0,0,0,0.25)', 1));
}
const crabAt = (x: number, y: number, s: number, o: Parameters<typeof crabTop>[0] = {}) => at(x, y, s, crabTop(o));
/** Shrimp-like crustacean, side view, head left. */
const shrimpSide = (col: string, s = 1, claws = false) => at(0, 0, s, line('M-14 -4 C-24 -14 -30 -16 -36 -14 M-14 -2 C-26 -8 -32 -6 -38 -4', C.ink, 0.8),
  claws ? all(line('M-12 4 L-24 6 L-30 4', C.ink, 1.6), path('M-30 4 L-40 2 L-40 6 Z', col, C.ink, 0.9)) : '',
  ...range(5).map((i) => line(`M${-8 + i * 4} 4 l-1 6`, C.ink, 0.8)),
  path('M-16 0 C-16 -6 -6 -8 4 -6 C14 -4 20 2 22 8 L16 10 C14 6 10 4 4 4 L-12 4 C-15 4 -16 2 -16 0 Z', col, C.ink, 1.1), ...range(4).map((i) => line(`M${2 + i * 4} -5 L${0 + i * 4} 4`, 'rgba(0,0,0,0.2)', 0.8)),
  path('M16 10 L22 8 L26 14 L18 14 Z', col, C.ink, 0.9), circle(-12, -3, 1.2, C.ink, null));

// Molluscs
const musselShell = (col: string = '#2f3550', open = false) => all(path('M-20 6 C-24 -6 -10 -16 6 -14 C18 -12 22 -2 18 6 C10 10 -10 12 -20 6 Z', col, C.ink, 1.4), path('M-16 4 C-8 -4 4 -8 14 -4', 'none', '#5a6b9a', 1.2),
  open ? path('M-20 6 C-14 16 8 16 18 6 C8 10 -8 11 -20 6 Z', '#f0b37e', C.ink, 1) : '');
const oysterShell = (open = false) => open ? all(path('M-22 0 C-24 -14 -6 -18 10 -14 C22 -10 26 2 18 10 C8 16 -14 14 -22 0 Z', '#a8a29a', C.ink, 1.4), path('M-18 0 C-18 -10 -4 -13 8 -10 C18 -7 20 2 14 7 C6 11 -12 10 -18 0 Z', '#f2efe6', null), path('M-10 -2 C-6 -8 6 -8 8 -2 C8 4 -6 6 -10 -2 Z', '#d8d2bc', C.ink, 0.8))
  : all(path('M-22 0 C-24 -14 -6 -18 10 -14 C22 -10 26 2 18 10 C8 16 -14 14 -22 0 Z', '#9a948a', C.ink, 1.4), line('M-16 -4 C-8 -10 6 -10 14 -4 M-18 2 C-8 -4 8 -4 18 2 M-14 7 C-4 3 8 3 14 7', '#c8c2b6', 1.2));
const scallop = (col: string = '#e8a070') => all(path('M-6 12 L-10 16 L10 16 L6 12 Z', col, C.ink, 1), path('M0 12 C-14 12 -20 -2 -16 -10 C-10 -18 10 -18 16 -10 C20 -2 14 12 0 12 Z', col, C.ink, 1.4), ...[-12, -6, 0, 6, 12].map((x) => line(`M0 12 L${x} -14`, 'rgba(0,0,0,0.25)', 1.1)));
const snail = (col: string = '#8a6a4a', body: string = '#c8b49a') => all(path('M-18 10 C-18 4 -10 2 0 4 L16 6 C20 7 22 10 20 12 L-16 12 C-18 12 -18 11 -18 10 Z', body, C.ink, 1.1), line('M18 7 L22 0 M15 6 L17 -1', C.ink, 1), circle(22, 0, 1, C.ink, null), circle(17, -1, 1, C.ink, null),
  circle(-2, -4, 12, col, C.ink, 1.3), path('M-2 -4 m0 -9 a9 9 0 1 1 -8 5 a6 6 0 1 1 6 7 a3 3 0 1 1 1 -5', 'none', C.ink, 1));
function octopus(col: string = '#d9634a', o: { hlArm?: boolean; suckers?: boolean } = {}): Svg {
  const arms = [[-22, 22, -28, 34], [-14, 26, -16, 40], [-6, 28, -4, 42], [2, 28, 6, 42], [10, 26, 16, 40], [18, 22, 28, 34], [-26, 14, -36, 18], [24, 14, 36, 18]];
  return all(...arms.map(([cx, cy, ex, ey], i) => all(line(`M${i < 6 ? -14 + i * 5.6 : (i === 6 ? -14 : 14)} 6 C${cx} ${cy} ${ex! + 6} ${ey! - 2} ${ex} ${ey}`, C.ink, 6), line(`M${i < 6 ? -14 + i * 5.6 : (i === 6 ? -14 : 14)} 6 C${cx} ${cy} ${ex! + 6} ${ey! - 2} ${ex} ${ey}`, o.hlArm && i === 5 ? HL : col, 4.2))),
    path('M-16 6 C-22 -10 -14 -28 0 -28 C14 -28 22 -10 16 6 C8 10 -8 10 -16 6 Z', col, C.ink, 1.4), circle(-6, 0, 3, C.white, C.ink, 0.8), circle(6, 0, 3, C.white, C.ink, 0.8), rect(-7.5, -0.8, 3, 1.6, C.ink, 0.6, null), rect(4.5, -0.8, 3, 1.6, C.ink, 0.6, null),
    o.suckers ? all(...[[-27, 31], [-30, 25], [-24, 22], [26, 31], [29, 25], [23, 22]].map(([x, y]) => circle(x!, y!, 1.2, '#f6c0a8', C.ink, 0.5))) : '');
}
function squid(col: string = '#e8b0a0', hlTent = false): Svg {
  return all(path('M-6 -46 L0 -58 L6 -46 Z', col, C.ink, 1.1), path('M-6 -48 L-14 -36 L-5 -38 Z M6 -48 L14 -36 L5 -38 Z', col, C.ink, 1),
    path('M-7 -48 C-9 -30 -8 -10 -7 0 L7 0 C8 -10 9 -30 7 -48 C4 -54 -4 -54 -7 -48 Z', col, C.ink, 1.3), ...range(5).map((i) => circle(-3 + (i % 3) * 3, -40 + i * 7, 0.9, '#c86a5a', null)),
    ellipse(0, 3, 7, 5, col, C.ink, 1.1), circle(-4, 3, 1.8, C.white, C.ink, 0.6), circle(4, 3, 1.8, C.white, C.ink, 0.6),
    ...range(8).map((i) => line(`M${-5 + i * 1.4} 7 C${-8 + i * 2.2} 14 ${-9 + i * 2.6} 18 ${-10 + i * 2.8} 22`, C.ink, 1.8)), ...range(8).map((i) => line(`M${-5 + i * 1.4} 7 C${-8 + i * 2.2} 14 ${-9 + i * 2.6} 18 ${-10 + i * 2.8} 22`, col, 0.9)),
    line('M-2 8 C-8 22 -14 30 -16 40 M2 8 C8 22 14 30 16 40', C.ink, 2.6), line('M-2 8 C-8 22 -14 30 -16 40 M2 8 C8 22 14 30 16 40', hlTent ? HL : col, 1.4),
    ellipse(-16, 41, 2.4, 3.4, hlTent ? HL : col, C.ink, 0.8), ellipse(16, 41, 2.4, 3.4, hlTent ? HL : col, C.ink, 0.8));
}

// Reef
const branchCoral = (x: number, y: number, s = 1, col: string = '#f08a6a') => at(x, y, s, line('M0 0 L0 -14 M0 -8 L-7 -16 L-8 -24 M-7 -16 L-12 -20 M0 -14 L5 -22 L4 -30 M5 -22 L11 -26 L12 -32 M0 -10 L8 -12', C.ink, 4.6), line('M0 0 L0 -14 M0 -8 L-7 -16 L-8 -24 M-7 -16 L-12 -20 M0 -14 L5 -22 L4 -30 M5 -22 L11 -26 L12 -32 M0 -10 L8 -12', col, 3));
const brainCoral = (x: number, y: number, s = 1, col: string = '#d8b45a') => at(x, y, s, path('M-14 0 C-14 -14 14 -14 14 0 Z', col, C.ink, 1.2), path('M-10 -2 q2 -4 4 0 t4 0 t4 0 t4 0 M-8 -7 q2 -3 4 0 t4 0 t4 0', 'none', 'rgba(0,0,0,0.3)', 0.9));
const fanCoral = (x: number, y: number, s = 1, col: string = '#b05aa8') => at(x, y, s, path('M0 0 C-16 -6 -18 -26 -8 -32 C0 -36 8 -34 12 -28 C18 -18 12 -6 0 0 Z', col, C.ink, 1.1), line('M0 0 L-8 -26 M0 0 L0 -32 M0 0 L8 -26 M0 0 L-12 -14 M0 0 L12 -16', 'rgba(0,0,0,0.25)', 0.9));
const anemone = (x: number, y: number, s = 1, col: string = '#c86ab0', tip: string = '#f2a0d8') => at(x, y, s, rect(-8, -8, 16, 8, '#8a5a8a', 2, C.ink, 1.1),
  ...range(11).map((i) => { const a = -Math.PI + (i / 10) * Math.PI, ex = f1(Math.cos(a) * 16), ey = f1(-8 + Math.sin(a) * 18); return all(line(`M${f1(Math.cos(a) * 6)} -8 Q${f1(ex * 0.6 + 3)} ${f1(ey - 4)} ${ex} ${ey}`, C.ink, 3.6), line(`M${f1(Math.cos(a) * 6)} -8 Q${f1(ex * 0.6 + 3)} ${f1(ey - 4)} ${ex} ${ey}`, col, 2.2), circle(ex, ey, 1.6, tip, null)); }));
const clownfish = (x: number, y: number, s = 1, right = false) => fishAt(x, y, s, { L: 14, H: 6, B: 5.4, col: '#f08a2a', tail: 'round', T: 6, finCol: '#f08a2a', dorsal: [[-6, 6, 4]], anal: [[2, 8, 3]], eye: 1.8,
  marks: all(path('M-8 -6 C-6 -2 -6 2 -8 5 L-5 5 C-3 2 -3 -2 -5 -6 Z', C.white, C.ink, 0.7), path('M1 -6.6 C3 -2 3 2 1 5.6 L4 5.4 C6 2 6 -2 4 -6.4 Z', C.white, C.ink, 0.7), path('M9 -3 C10 -1 10 1 9 3 L11 2 C12 1 12 -1 11 -2 Z', C.white, C.ink, 0.6)) }, right);
const starfish = (x: number, y: number, s = 1, col: string = '#e0603a', rot = 0) => atR(x, y, s, rot, path(f1s(range(10).map((i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 6 : 16; return `${i ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`; }).join(' ') + ' Z'), col, C.ink, 1.3),
  ...range(5).map((i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5; return all(...[4, 8, 12].map((r) => circle(f1(Math.cos(a) * r), f1(Math.sin(a) * r), 0.9, '#f8c0a0', null))); }));
const urchin = (x: number, y: number, s = 1, col: string = '#4a2a5a') => at(x, y, s, ...range(20).map((i) => { const a = (i / 20) * Math.PI * 2; return line(`M${f1(Math.cos(a) * 6)} ${f1(Math.sin(a) * 6)} L${f1(Math.cos(a) * 16)} ${f1(Math.sin(a) * 16)}`, col, 1.3); }), circle(0, 0, 8, col, C.ink, 1.2));
const jelly = (x: number, y: number, s = 1, col: string = 'rgba(214,170,230,0.75)') => at(x, y, s, ...range(6).map((i) => line(`M${-9 + i * 3.6} 2 C${-11 + i * 3.6} 12 ${-7 + i * 3.6} 20 ${-10 + i * 3.6} 30`, '#b48ac8', 1)),
  path('M-6 2 C-8 10 -4 14 -6 20 M0 2 C2 10 -2 14 1 22 M6 2 C8 10 4 14 6 20', 'none', '#9a6ab4', 2), path('M-14 2 C-14 -12 14 -12 14 2 C10 4 -10 4 -14 2 Z', col, C.ink, 1.2), path('M-6 -3 C-4 -6 4 -6 6 -3', 'none', '#9a6ab4', 1.2));
const reefBg = (extra: Svg = '') => all(water('#7fcbe6'), rect(4, 4, 112, 10, '#b8e4f4', 3, null), sandFloor(100, '#f2e2b4'), extra);

// People
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: f1(ty - 38 * s), sl: f1(x - 13 * s), sr: f1(x + 13 * s) }; };
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };
const stand = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s}) translate(-60 -112)`, ...k);
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** A swimmer seen from the side, head to the left; centred on the chest. */
const swimmer = (o: { mask?: boolean; snorkel?: boolean; tank?: boolean; suit?: string } = {}) => {
  const suit = o.suit ?? '#2f4a7a';
  return all(o.tank ? rect(-6, -11, 18, 6, '#e0b23c', 3, C.ink, 1) : '', path('M-8 -5 L20 -5 L22 4 L-8 5 Z', suit, C.ink, 1.2), line('M20 -2 L34 -4 M20 2 L34 6', C.ink, 4.6), line('M20 -2 L34 -4 M20 2 L34 6', suit, 3.2),
    path('M33 -7 L42 -10 L40 -2 Z M33 3 L42 4 L38 10 Z', '#3a3a3a', C.ink, 0.8), line('M-4 4 L-14 12', C.ink, 4), line('M-4 4 L-14 12', suit, 2.6), circle(-14, 12, 2, C.skin, C.ink, 0.8),
    circle(-14, -2, 6, C.skin, C.ink, 1.1), path('M-20 -4 C-20 -10 -8 -10 -8 -4 Z', C.hair, null), o.mask ? all(rect(-21, -4, 8, 5, '#9fd8f0', 1.5, C.ink, 1), line('M-13 -2 L-8 -3', C.ink, 1.2)) : '',
    o.snorkel ? all(line('M-18 1 L-20 2 L-20 -16', C.ink, 2.6), line('M-18 1 L-20 2 L-20 -16', C.yellow, 1.4)) : '', o.tank ? line('M-6 -8 C-14 -10 -16 -6 -17 0', C.ink, 1) : '');
};

// Fish anatomy diagram: a perch-like fish with one part highlighted.
type Part = 'fins' | 'dorsal' | 'pect' | 'tail' | 'gill' | 'operc' | 'blad' | 'lat' | 'none';
const anat = (p: Part, extra: Svg = '') => {
  const base = '#a6b87a', hi = (k: Part) => (p === k || (p === 'fins' && ['dorsal', 'pect', 'tail'].includes(k)) ? HL : '#c8c8a0');
  return at(58, 60, 1.6, fishSide({ L: 30, H: 12, B: 11, col: base, belly: '#eef0d8', tail: 'fork', T: 11, finCol: p === 'fins' ? HL : '#c8c8a0', tailCol: hi('tail'), spiny: true,
    dorsal: [[-14, 6, 8, hi('dorsal')], [8, 20, 6, hi('dorsal')]], anal: [[8, 18, 5]], pect: hi('pect'), gill: p !== 'operc' && p !== 'gill',
    marks: all(p === 'lat' ? line('M-18 -3 C-6 -6 8 -5 23 -1', HL, 2) : line('M-18 -3 C-6 -6 8 -5 23 -1', '#6e7e4e', 0.9, '1.5 1.5'),
      p === 'blad' ? all(ellipse(2, -2, 12, 4.4, 'rgba(255,255,255,0.0)', null), path('M-16 -2 C-14 -9 18 -8 18 -2 C18 3 -14 4 -16 -2 Z', '#f2f4f8', HL, 1.6)) : '',
      p === 'operc' ? path('M-18 -9 C-14 -4 -14 4 -18 9 C-22 6 -23 -6 -18 -9 Z', HL, C.ink, 0.9) : '',
      p === 'gill' ? all(path('M-16 -8 C-11 -3 -11 3 -16 8 L-19 8 C-22 4 -22 -4 -19 -8 Z', GILL, C.ink, 0.8), ...range(4).map((i) => line(`M-18 ${-6 + i * 4} L-13.5 ${-6 + i * 4}`, '#8a1f2a', 0.7)), path('M-21 -10 C-27 -6 -27 6 -21 10 C-22 4 -22 -4 -21 -10 Z', '#c8c8a0', C.ink, 0.8)) : '') }), extra);
};

// ── Motifs ───────────────────────────────────────────────────────────
export const AQUATIC_MOTIFS: Record<string, Svg> = {
  // 2721 Sötvattensfiskar
  'fisk.sötvattensfisk': all(bg(), spruce(14, 50, 0.8), spruce(26, 50, 0.6), spruce(100, 50, 0.7), rect(4, 50, 112, 4, LAND2, 0, null), rect(4, 54, 112, 58, FRESH, 0, null), line('M4 54 L116 54', C.white, 1.4), mudFloor(102),
    reed(10, 102, 50), reed(16, 104, 42), reed(108, 102, 46), fishAt(52, 74, 1.1, PERCH), fishAt(84, 92, 0.9, ROACH, true), weed(30, 104, 18), weed(96, 104, 14), oval(60, 82, 42, 22)),
  'fisk.gädda': all(water(FRESH), mudFloor(104), ...[10, 18, 26, 98, 106].map((x, i) => reed(x, 106, 70 + (i % 2) * 14)), fishAt(56, 62, 0.95, PIKE)),
  'fisk.rovfisk': all(water(FRESH), mudFloor(104), weed(14, 106, 30), weed(104, 106, 26), fishAt(40, 58, 0.8, { ...PIKE, snout: 'big', over: all(path('M-46 0 L-34 -4 L-34 5 Z', '#7a2a2a', C.ink, 0.9), line('M-44 -0.6 l1.5 -1.6 l1.5 1.4 l1.5 -1.6 l1.5 1.4 l1.5 -1.6', C.white, 0.7)) }, true),
    minnow(92, 52, 1.1), minnow(100, 62, 1), minnow(90, 70, 0.9), arrow(66, 58, 80, 58, HL, 2.4), line('M100 46 l4 -2 M102 50 l5 0', C.ink, 0.8)),
  'fisk.gös': all(water('#d4e0d0'), ...range(14).map((i) => circle(10 + (i * 37) % 100, 12 + (i * 23) % 80, 0.9, 'rgba(110,100,70,0.35)', null)), mudFloor(104), fishAt(58, 60, 1.25, ZANDER)),
  'fisk.mört': all(water(FRESH), weed(18, 112, 30), weed(102, 112, 26), fishAt(54, 56, 1.6, ROACH), minnow(96, 92, 0.9, SILVER), minnow(20, 90, 0.8, SILVER, true)),
  'fisk.braxen': all(water(FRESH), mudFloor(100), weed(16, 104, 24), fishAt(58, 58, 1.35, BREAM)),
  'fisk.öring': all(water(FRESH), stone(24, 104, 14, 6), stone(90, 106, 18, 6, ROCK2), stone(58, 108, 10, 4), fishAt(58, 58, 1.45, TROUT), line('M8 20 L24 20 M14 30 L32 30', '#ffffff', 1.2)),
  'fisk.röding': all(water('#cfe6f2'), stone(24, 106, 14, 6, ROCK2), fishAt(58, 56, 1.45, CHAR), at(98, 22, 0.6, path('M-20 10 L0 -14 L20 10 Z', '#e6ecf0', C.ink, 1))),
  'fisk.ål': all(water(FRESH), mudFloor(100), stone(96, 98, 12, 6), path('M14 70 C24 56 34 56 42 66 C50 76 60 78 70 66 C78 56 88 54 98 62', 'none', C.ink, 9), path('M14 70 C24 56 34 56 42 66 C50 76 60 78 70 66 C78 56 88 54 98 62', 'none', '#6a5a3a', 7),
    path('M24 60 C34 56 42 64 50 72 C58 76 66 74 74 64 C82 56 92 56 98 62', 'none', '#cdb88a', 1.6), path('M98 62 L104 62', 'none', C.ink, 1), circle(18, 66, 1.4, C.ink, null), line('M12 70 L16 69', C.ink, 1)),
  'fisk.vandra.2': all(rect(4, 4, 112, 108, LAND, 3, null), path('M4 62 C22 64 34 80 30 112 L4 112 Z', SEA2, C.ink, 1.2), waves(6, 26, 80), waves(6, 24, 96), ellipse(100, 18, 13, 8, FRESH, C.ink, 1.2),
    line('M26 88 C46 84 48 64 62 56 C78 48 82 32 92 22', C.ink, 9), line('M26 88 C46 84 48 64 62 56 C78 48 82 32 92 22', FRESH, 7), spruce(90, 70, 0.5), spruce(102, 78, 0.6), spruce(20, 30, 0.5), spruce(34, 40, 0.6),
    ...[[18, 94, -10], [52, 70, -50], [80, 38, -50]].map(([x, y, r]) => atR(x!, y!, 0.42, r! + 180, fishSide(SALMON))), arrow(30, 100, 44, 92, HL, 2.4), arrow(64, 72, 74, 60, HL, 2.4), arrow(90, 44, 98, 32, HL, 2.4)),
  'fisk.rom': all(water(FRESH), weed(30, 112, 70, '#5a9a4a'), weed(60, 112, 60, '#5a9a4a'), ...range(26).map((i) => circle(36 + (i % 6) * 5.4 + ((i / 6) | 0) % 2 * 2.6, 46 + ((i / 6) | 0) * 5, 2.4, '#f2a24a', C.ink, 0.6)), ring(50, 56, 22), fishAt(92, 88, 0.6, PERCH, true)),
  'fisk.yngel': all(water(FRESH), sandFloor(96, SAND), reed(12, 98, 50), reed(18, 100, 40), ...[[40, 50], [54, 44], [68, 52], [48, 62], [62, 66], [78, 60], [86, 46], [72, 38], [36, 70], [90, 74]].map(([x, y], i) => g(`translate(${x} ${y}) scale(${i % 2 ? -1 : 1} 1)`, path('M-4 0 C-2 -2 2 -2 3 0 C2 2 -2 2 -4 0 Z M3 0 L6 -2 L6 2 Z', 'rgba(200,210,200,0.9)', C.ink, 0.5), circle(-2.4, -0.2, 0.8, C.ink, null))), oval(62, 56, 34, 22)),
  'fisk.spö': all(bg(), line('M16 104 L104 18', C.ink, 4), line('M16 104 L104 18', '#3a5a8a', 2.4), rect(10, 98, 16, 6, '#3a3a3a', 2, null), at(36, 92, 1, circle(0, 0, 6, '#c0c6cc', C.ink, 1.2), circle(0, 0, 2, C.dark, null), line('M4 -2 L8 -4', C.ink, 1.4)),
    ...[40, 60, 80].map((t) => circle(f1(16 + t * 0.88), f1(104 - t * 0.86), 1.6, 'none', C.ink, 0.9)), line('M104 18 C106 40 106 60 104 84', '#9aa3ad', 0.9), path('M104 84 C104 90 98 90 99 86', 'none', C.ink, 1.2), ring(60, 60, 50)),
  'fisk.bete': all(bg('#f3ede2'), line('M60 10 L60 52', '#9aa3ad', 1), path('M60 52 L60 86 C60 96 44 96 44 86 L44 82 L48 86', 'none', C.ink, 2.2), ...[[60, 60], [60, 70], [58, 79]].map(([x, y]) => ellipse(x!, y!, 5, 4, '#f2c84a', '#c89a2a', 1)), ring(59, 70, 16),
    at(92, 96, 1, path('M-10 0 L10 0 L8 -12 L-8 -12 Z', '#f2c84a', C.ink, 1), ...range(5).map((i) => circle(-6 + i * 3, -6, 1.6, '#f6dc7a', null))), at(24, 98, 1, path('M-12 0 C-12 -10 12 -10 12 0 Z', '#e6c48a', C.ink, 1))),
  'fisk.meta': all(bg(), rect(4, 70, 112, 42, FRESH, 0, null), line('M4 70 L116 70', C.white, 1.2), rect(4, 62, 44, 6, WOOD, 1, C.ink, 1.1), line('M12 68 L12 112 M40 68 L40 112', WOOD2, 3),
    stand(26, 62, 0.55, fig(60, C.orange, 'smile', { hairStyle: 'long' }), reach(60, 1, 1, 82, 66)), line('M30 42 L80 12', C.ink, 2.4), line('M80 12 L96 66', '#9aa3ad', 0.8), line('M96 72 L96 92', '#9aa3ad', 0.8),
    at(96, 70, 1, path('M0 -6 L2 0 L0 5 L-2 0 Z', C.red, C.ink, 0.8), rect(-2, -1, 4, 2, C.white, 0, null)), fishAt(84, 96, 0.5, PERCH, true), path('M96 92 c0 3 -3 3 -3 1', 'none', C.ink, 0.9)),
  'fisk.flöte': all(bg(), rect(4, 58, 112, 54, FRESH, 0, null), line('M4 58 L116 58', C.white, 1.4), ellipse(60, 58, 26, 4, 'none', '#ffffff', 1.2), ellipse(60, 58, 36, 6, 'none', '#ffffff', 0.9),
    line('M60 8 L60 40', '#9aa3ad', 1), at(60, 52, 2.6, path('M0 -8 L3 -1 L0 8 L-3 -1 Z', C.red, C.ink, 0.6), path('M-3 -1 L3 -1 L0 8 Z', C.white, C.ink, 0.6), line('M0 -8 L0 -12', C.ink, 0.6)),
    line('M60 74 L60 94', '#9aa3ad', 0.9), path('M60 94 c0 4 -4 4 -4 1', 'none', C.ink, 1.2), fishAt(84, 98, 0.6, ROACH), ring(60, 52, 18)),

  // 2722 Havsfiskar
  'fisk.havsfisk': all(surface(30, SEA), at(26, 30, 1, path('M-6 0 L-4 -20 L4 -20 L6 0 Z', C.white, C.ink, 1.1), rect(-5, -26, 10, 6, C.red, 1, C.ink, 1), path('M-6 -26 L0 -30 L6 -26 Z', C.dark, null)), path('M4 30 L30 30 L34 38 L4 40 Z', ROCK, C.ink, 1),
    sandFloor(102, SAND2), weed(98, 104, 18, '#6a7a3a'), fishAt(64, 66, 1.15, COD), oval(64, 68, 44, 22)),
  'fisk.kolja': all(water(SEA), sandFloor(104, SAND2), fishAt(60, 58, 1.4, HADDOCK), ring(40, 55, 8)),
  'fisk.stim': all(water(SEA), ...range(30).map((i) => { const r = (i / 6) | 0, c = i % 6; return minnow(18 + c * 15 + (r % 2) * 7, 22 + r * 15 + (c % 2) * 3, 1, '#7aa0c4'); })),
  'fisk.plattfisk': all(water(SEA), sandFloor(40, SAND), at(40, 58, 1, flatfish('#a48a64', '#b89c74')), at(76, 92, 1.05, flatfish('#8a7a5a', '#a08e6a', spots([[-4, -4], [6, 3], [-8, 4]], '#ef6a2a', 1.8))), ring(23, 52, 8), ring(58, 86, 8)),
  'fisk.flundra': all(surface(24, '#a6cfe0'), sandFloor(76, SAND), stone(98, 84, 10, 4), at(58, 92, 1.55, flatfish('#6e5e40', '#857252', spots([[-6, -4], [4, 3], [10, -4], [-2, 5]], '#5a4a30', 1.8)))),
  'fisk.rödspätta': all(water(SEA), sandFloor(70, SAND), at(58, 86, 1.75, flatfish('#9a7a52', '#ac8e66', spots([[-6, -6], [4, -6], [12, -2], [-8, 3], [2, 2], [10, 5], [-1, 8], [14, 3]], '#ef6a2a', 2)))),
  'fisk.marulk': all(water('#6a9ab8'), sandFloor(96, '#c8b88a'), at(58, 76, 1.3, path('M-30 4 C-34 -14 -10 -22 8 -12 C16 -8 24 -4 36 -2 L44 -8 L42 4 L44 14 L36 8 C22 10 12 14 0 14 C-16 16 -30 16 -30 4 Z', '#7a6a52', C.ink, 1.3),
    path('M-30 4 C-20 10 -6 10 4 4', 'none', C.ink, 1.2), path('M-30 4 C-20 12 -6 12 4 4 C-6 16 -24 16 -30 4 Z', '#4a2a2a', null), line('M-28 5 l2 2 l2 -2 l2 2 l2 -2 l2 2 l2 -2 l2 2 l2 -2 l2 2 l2 -2 l2 2 l2 -2 l2 2', C.white, 0.8),
    path('M-14 -16 C-18 -26 -26 -30 -32 -26', 'none', C.ink, 1), circle(-33, -25, 2.2, '#f2e05a', C.ink, 0.6), circle(-6, -12, 2, C.white, C.ink, 0.6), circle(-6, -12, 0.9, C.ink, null),
    ...range(6).map((i) => line(`M${-26 + i * 9} 14 l-2 3 M${-24 + i * 9} 14 l2 3`, '#5a4a3a', 0.8))), minnow(14, 40, 0.9, '#c8d2da', true)),
  'fisk.fiskare': all(bg(), rect(4, 86, 112, 26, SEA, 0, null), waves(8, 108, 92), path('M6 78 L114 78 L106 100 L14 100 Z', '#2f6a9a', C.ink, 1.3),
    stand(54, 80, 0.62, F({ x: 60, top: '#f2c14e', bottom: '#f2c14e', mood: 'smile' }), path('M50 16 C49 7 53 5 60 5 C67 5 71 7 70 16 Z', '#f2c14e', C.ink, 1.4), path('M45 16 L75 16 L71 20 L49 20 Z', '#e0b23c', C.ink, 1.2), reach(60, 1, -1, 30, 62), reach(60, 1, 1, 90, 62)),
    at(54, 70, 0.65, fishSide({ ...COD, L: 26 })), seagull(92, 22), seagull(104, 30, 0.8)),
  'fisk.fiskebåt': all(bg(), rect(4, 74, 112, 38, SEA, 0, null), waves(8, 108, 86), waves(14, 104, 100), path('M10 64 L104 64 L96 84 L20 84 Z', '#2f6a9a', C.ink, 1.4), line('M14 70 L100 70', C.white, 1.4),
    rect(62, 40, 26, 24, C.white, 1, C.ink, 1.2), rect(66, 44, 8, 7, '#9fd8f0', 1, C.ink, 0.8), rect(77, 44, 8, 7, '#9fd8f0', 1, C.ink, 0.8), line('M40 64 L40 18 M40 22 L18 50 M40 30 L22 58', C.ink, 1.6),     path('M16 48 C18 54 22 60 26 62 L22 64 C18 60 14 54 14 50 Z', '#e0b23c', C.ink, 0.8), rect(74, 32, 4, 8, C.red, 0, C.ink, 0.8), seagull(26, 16), seagull(92, 14, 0.9), seagull(104, 26, 0.7)),
  'fisk.trål': all(surface(18, SEA2, SKY), path('M10 16 L34 16 L30 22 L14 22 Z', '#2f6a9a', C.ink, 1.1), rect(20, 8, 8, 8, C.white, 1, C.ink, 0.9), line('M30 20 L60 46 M28 22 L60 82', C.ink, 1),
    path('M60 40 L60 88 C80 82 96 74 112 68 L112 58 C96 52 80 46 60 40 Z', 'rgba(255,255,255,0.18)', C.ink, 1.2), line('M64 41 L64 87 M72 43 L72 84 M80 46 L80 81 M88 49 L88 78 M96 52 L96 75 M104 55 L104 72 M60 52 L112 60 M60 64 L112 64 M60 76 L112 67', '#d8e4ee', 0.7),
    ...[[84, 60], [96, 64], [90, 70], [102, 62], [76, 66]].map(([x, y]) => minnow(x!, y!, 0.9, '#c8d2da')), circle(60, 40, 2.4, C.yellow, C.ink, 0.8), rect(56, 86, 8, 4, C.dark, 1, null), minnow(30, 70, 0.9, '#c8d2da', true)),
  'fisk.fiskebestånd': all(water(SEA), line('M10 12 L110 12 L110 100 L10 100 Z', HL, 2, '5 3'), ...range(16).map((i) => fishAt(22 + (i % 4) * 24, 24 + ((i / 4) | 0) * 21, 0.32, COD, i % 3 === 0)),
    ),
  'fisk.överfiske': all(water(SEA), path('M30 6 L30 50 C50 46 70 38 92 30 L92 20 C70 16 50 10 30 6 Z', 'rgba(255,255,255,0.25)', C.ink, 1.1), line('M36 7 L36 49 M46 9 L46 47 M56 11 L56 43 M66 13 L66 40 M76 16 L76 36 M30 20 L92 25 M30 34 L92 27', '#d8e4ee', 0.6),
    ...range(14).map((i) => minnow(40 + (i % 5) * 10, 18 + ((i / 5) | 0) * 9, 0.75, '#a8b4bc')), line('M30 6 L4 4', C.ink, 1), greyed(...range(6).map((i) => minnow(24 + i * 16, 76 + (i % 2) * 12, 1, 'none'))), minnow(62, 96, 1.1, '#7aa0c4'),
    arrow(108, 62, 108, 100, C.red, 2.6)),
  'fisk.fiskekvot': all(bg('#f3ede2'), line('M10 104 L110 104', C.ink, 1.6), ...range(4).map((i) => all(rect(14 + i * 22, 104 - 18, 18, 18, '#7ab0d8', 2, C.ink, 1), at(23 + i * 22, 95, 0.4, fishSide(COD)))), ...range(3).map((i) => all(rect(14 + i * 22, 104 - 36, 18, 18, '#7ab0d8', 2, C.ink, 1), at(23 + i * 22, 77, 0.4, fishSide(COD)))),
    line('M8 64 L112 64', HL, 2.6, '5 3'), greyed(rect(80, 50, 18, 18, '#7ab0d8', 2, C.ink, 1), at(89, 59, 0.4, fishSide(COD))), ban(89, 59, 10), at(100, 30, 0.7, path('M-12 -4 L12 -4 L8 3 L-9 3 Z', '#2f6a9a', C.ink, 1.2), rect(-3, -11, 7, 7, C.white, 1, C.ink, 0.9))),

  // 2723 Hajar och rockor
  'fisk.haj': all(water(SEA), sandFloor(104, SAND2), sharkAt(58, 56, 1.1)),
  'fisk.rocka': all(water(SEA), sandFloor(86, SAND), rayAt(58, 46, 1.1, { col: '#9a8a70', tail: 44 })),
  'fisk.broskfisk': all(water('#2a3a52'), at(58, 42, 0.95, sharkSide({ col: 'rgba(160,180,200,0.35)', belly: 'rgba(200,215,230,0.25)' }), line('M-34 0 L38 0', CART, 3), ...range(12).map((i) => line(`M${-26 + i * 5} -4 L${-26 + i * 5} 4`, CART, 1.4)), path('M-44 0 C-44 -6 -36 -8 -32 -6 C-34 -2 -34 2 -32 6 C-36 8 -44 6 -44 0 Z', CART, null), line('M2 -10 L4 -26 M-4 4 L-2 14', CART, 1.6)),
    ring(58, 42, 46), greyed(at(60, 92, 0.6, fishSide({ ...generic('rgba(200,200,200,0.4)'), L: 26, marks: all(line('M-22 0 L20 0', BONE, 2), ...range(9).map((i) => line(`M${-16 + i * 4} -6 L${-16 + i * 4} 6`, BONE, 1))) })))),
  'fisk.tandrad': all(water('#2f5a7a'), at(60, 60, 1, path('M-50 -20 C-30 -40 30 -40 50 -20 L50 20 C30 40 -30 40 -50 20 Z', SHARK, C.ink, 1.3), path('M-42 -10 C-20 -26 20 -26 42 -10 L42 10 C20 26 -20 26 -42 10 Z', '#7a2a32', C.ink, 1.2),
    ...[0, 1, 2].map((r) => all(path(range(9).map((i) => `${i ? 'L' : 'M'}${-36 + i * 9} ${-12 - r * 4 + (Math.abs(i - 4) * 0.8)} L${-31.5 + i * 9} ${-4 - r * 4 + (Math.abs(i - 4) * 0.8)}`).join(' ') + ` L36 ${-12 - r * 4 + 3.2}`, 'none', r === 0 ? C.white : '#e8e0d8', 1.4),
      path(range(9).map((i) => `${i ? 'L' : 'M'}${-36 + i * 9} ${12 + r * 4 - (Math.abs(i - 4) * 0.8)} L${-31.5 + i * 9} ${4 + r * 4 - (Math.abs(i - 4) * 0.8)}`).join(' ') + ` L36 ${12 + r * 4 - 3.2}`, 'none', r === 0 ? C.white : '#e8e0d8', 1.4)))), oval(60, 46, 40, 12)),
  'fisk.vithaj': all(water('#5a8ab0'), sharkAt(62, 56, 1.15, { col: '#7a8692', belly: C.white, mouth: 'open' }), at(18, 96, 0.35, swimmer({ mask: true, tank: true }))),
  'fisk.hammarhaj': all(water(SEA), sandFloor(104, SAND2), at(58, 56, 1.35, hammerTop())),
  'fisk.plankton': all(water(SEA), ...range(30).map((i) => circle(8 + (i * 31) % 104, 10 + (i * 17) % 96, 0.8, '#e8f4fa', null)), lens(56, 54, 36, all(
    at(42, 44, 1.4, ellipse(0, 0, 4, 2.4, '#e8c86a', C.ink, 0.7), line('M-4 0 L-10 -4 M-4 0 L-10 3 M0 2 L-2 6 M2 2 L2 6', C.ink, 0.6), circle(-2.4, -0.6, 0.6, C.red, null)),
    at(66, 40, 1.2, path('M-6 -6 L6 -6 L6 6 L-6 6 Z', 'rgba(140,200,120,0.6)', C.ink, 0.7), line('M-6 0 L6 0 M0 -6 L0 6', '#5a9a4a', 0.5)),
    at(58, 68, 1.3, ellipse(0, 0, 3, 5, '#c8e0a0', C.ink, 0.7), line('M0 -5 L0 -10 M0 5 L0 10', C.ink, 0.6)), at(44, 66, 1, circle(0, 0, 4, 'rgba(120,180,220,0.5)', C.ink, 0.6), circle(0, 0, 1.2, '#5a9a4a', null)),
    at(70, 58, 1.2, path('M-4 0 C-4 -3 4 -3 4 0 C4 3 -4 3 -4 0 Z', '#f2a0b0', C.ink, 0.6), line('M-4 0 L-8 -3 M-4 0 L-8 3', C.ink, 0.5))), 1, 1)),
  'fisk.valhaj': all(water('#3f86c0'), at(64, 56, 1.15, sharkSide({ col: '#4a5a6a', belly: '#d8dce0', head: 'wide', mouth: 'gape', marks: spots([[-30, -6], [-22, -8], [-14, -8], [-6, -9], [2, -8], [10, -7], [18, -5], [-26, -2], [-16, -3], [-6, -4], [4, -3], [14, -2], [24, -2]], C.white, 1) })), at(20, 22, 0.25, swimmer({ mask: true, snorkel: true }))),
  'fisk.brugd': all(surface(20, '#6a9ab8'), at(30, 18, 0.5, path('M-12 -4 L12 -4 L8 3 L-9 3 Z', C.red, C.ink, 1.2), rect(-3, -12, 7, 8, C.white, 1, C.ink, 1)), at(64, 64, 1.1, sharkSide({ col: '#6a6a6a', belly: '#9a9a9a', mouth: 'gape' })),
    ...range(14).map((i) => circle(6 + (i * 7) % 20, 50 + (i * 11) % 30, 0.9, '#f2f2d8', null)), arrow(8, 66, 14, 66, '#f2f2d8', 1)),
  'fisk.pigghaj': all(water(SEA), sandFloor(104, SAND2), sharkAt(60, 60, 0.95, { col: '#7a8490', spines: true, marks: spots([[-20, -6], [-8, -8], [4, -8], [14, -6], [24, -4], [-14, -3], [8, -4]], C.white, 1.1) }), ring(52, 38, 6), ring(84, 49, 5)),
  'fisk.gadd': all(water(SEA), sandFloor(70, SAND), rayAt(28, 30, 0.55, { col: '#7a6a5a', tail: 120 }, -50), g('translate(62 59) rotate(-50) scale(1.6)', path('M-2.6 -8 L0 12 L2.6 -8 Z', C.white, C.ink, 1), line('M-2 -4 l-1.6 1 M-1.4 0 l-1.6 1 M-0.8 4 l-1.6 1 M2 -4 l1.6 1 M1.4 0 l1.6 1 M0.8 4 l1.6 1', C.ink, 0.6)), ring(62, 59, 16)),
  'fisk.stingrocka': all(water('#7fcbe6'), sandFloor(70, '#f2e2b4'), rayAt(56, 50, 0.95, { col: '#7a6a5a', tail: 52, barb: true, marks: spots([[-14, -6], [12, -4], [-6, 4], [8, 8]], '#5a4a3a', 2) }, 18)),
  'fisk.mantarocka': all(water('#3f86c0'), rayAt(58, 54, 1.4, { col: '#2f3a4a', w: 38, h: 26, tail: 18, horns: true }), at(100, 98, 0.28, swimmer({ mask: true, snorkel: true }))),
  'fisk.knaggrocka': all(water(SEA), sandFloor(86, SAND2), rayAt(58, 48, 1.1, { col: '#a08560', tail: 44, thorns: true, marks: spots([[-18, -2], [-10, 6], [12, -2], [20, 4], [-4, 10], [6, 10]], '#e8d8b0', 2.4) })),
  'fisk.utrotningshotad': all(bg('#eef4f8'), greyed(...range(8).map((i) => sharkAt(16 + (i % 2) * 22, 22 + ((i / 2) | 0) * 24, 0.22, { mouth: 'none' }))), line('M60 10 L60 108', C.grey2, 1.4),
    ...[[70, 12], [92, 12], [70, 36], [92, 36], [70, 60]].map(([x, y]) => g(`translate(${x} ${y})`, path('M-8 6 C-4 2 4 2 8 6 C4 10 -4 10 -8 6 Z', 'none', C.grey, 1, ), line('M-8 6 L8 6', 'none', 0))),
    ...[[78, 20], [100, 20], [78, 44], [100, 44], [78, 68]].map(([x, y]) => at(x!, y!, 0.22, path('M-44 1 C-40 -6 -26 -11 -6 -11 C14 -10 28 -6 38 -2 L52 -22 L46 0 L50 10 L38 2 C28 5 10 9 -10 9 C-28 9 -40 6 -44 1 Z', 'none', C.grey, 4).replace('stroke-width="4"', 'stroke-width="4" stroke-dasharray="8 6"'))),
    sharkAt(98, 70, 0.24), arrow(70, 84, 110, 104, C.red, 2.6)),

  // 2724 Kräftdjur
  'fisk.kräftdjur': all(water(SEA), sandFloor(96, SAND), crabAt(36, 82, 0.8, { col: '#c8502a' }), crayAt(82, 64, 0.75, { col: '#2f4a6a' }, 20), at(34, 40, 1, shrimpSide('#f2a08a', 0.9)), oval(60, 62, 52, 44)),
  'fisk.skal.2': all(bg('#f3ede2'), crayAt(36, 62, 0.95, { col: '#c8a888' }), crayAt(36, 62, 0.95, { col: 'none' }), at(86, 74, 1, musselShell('#2f3550'), path('M-20 6 C-14 16 8 16 18 6 C8 10 -8 11 -20 6 Z', '#e0d8ec', C.ink, 1)), oval(36, 60, 22, 48), oval(86, 74, 26, 16)),
  'fisk.krabba': all(water(SEA), sandFloor(80, SAND), stone(98, 96, 14, 6), crabAt(56, 72, 1.25)),
  'fisk.klo.2': all(water(SEA), sandFloor(90, SAND), at(70, 70, 1.5, crabTop({ col: '#c8502a' })), ring(37, 35, 15)),
  'fisk.känselspröt': all(water(FRESH), mudFloor(100), crayAt(60, 70, 1.1, { col: '#6a5a3a', antenna: HL })),
  'fisk.ömsa': all(water(FRESH), mudFloor(100), greyed(crayAt(34, 64, 0.85, { col: 'rgba(220,210,190,0.7)' })), crayAt(86, 62, 0.95, { col: '#6a5a3a' }), arrow(50, 40, 70, 40, HL, 2.4)),
  'fisk.flodkräfta': all(water(FRESH), stone(20, 100, 14, 7), stone(98, 104, 16, 6, ROCK2), crayAt(60, 64, 1.15, { col: '#4a3a2a', claw: '#5a3a2a', spot: '#c8402a' })),
  'fisk.signalkräfta': all(water(FRESH), mudFloor(100), crayAt(60, 64, 1.15, { col: '#7a5a3a', spot: '#e8f4f0' }), ring(45, 36.4, 7), ring(75, 36.4, 7)),
  'fisk.kräftpest': all(water(FRESH), mudFloor(98), g('rotate(180 40 78)', crayAt(40, 78, 0.6, { col: '#8a7a6a' })), greyed(crayAt(86, 90, 0.45, { col: '#8a7a6a' }, 90)), lens(80, 40, 22, all(...range(9).map((i) => all(circle(68 + (i % 3) * 12, 30 + ((i / 3) | 0) * 10, 2.6, '#c8402a', C.ink, 0.5), line(`M${68 + (i % 3) * 12} ${32.6 + ((i / 3) | 0) * 10} l2 4`, '#c8402a', 0.8)))), -1, 1), ban(18, 20, 8)),
  'fisk.mjärde': all(water(FRESH), mudFloor(100), line('M86 20 L86 8 M86 20 C80 40 76 60 76 80', '#c8b088', 1.2), at(86, 12, 1, path('M-5 -4 L5 -4 L5 4 L-5 4 Z', C.red, C.ink, 0.9)), at(56, 86, 1, rect(-30, -14, 60, 28, 'rgba(255,255,255,0.15)', 10, C.ink, 1.3),
    ...range(7).map((i) => line(`M${-24 + i * 8} -14 L${-24 + i * 8} 14`, '#5a6a5a', 0.7)), line('M-30 -5 L30 -5 M-30 5 L30 5', '#5a6a5a', 0.7), path('M-30 -14 L-18 -4 L-18 4 L-30 14', 'rgba(255,255,255,0.3)', C.ink, 1), ellipse(4, 2, 5, 3, '#c8a06a', C.ink, 0.7)),
    crayAt(14, 88, 0.35, { col: '#6a5a3a' }, -90)),
  'fisk.strandkrabba': all(surface(26, '#a6cfe0'), stone(28, 96, 22, 10, ROCK2), path('M4 104 C30 100 80 106 116 102 L116 112 L4 112 Z', SAND, null), weed(80, 106, 20, '#7a6a2a'), crabAt(32, 82, 0.62, { col: '#4a6a3a' }), line('M32 26 L32 64', '#c8b088', 1), ellipse(32, 66, 2.4, 1.6, '#e8d0b0', C.ink, 0.6),
    at(80, 72, 0.5, crabTop({ col: '#6a7a3a' }))),
  'fisk.havskräfta': all(water('#6a9ab8'), mudFloor(98), at(60, 60, 1, line('M-4 -18 C-10 -34 -18 -46 -24 -52 M4 -18 C10 -34 18 -46 24 -52', C.ink, 0.8), line('M-5 -6 L-12 -14 L-16 -40 M5 -6 L12 -14 L16 -40', C.ink, 3), line('M-5 -6 L-12 -14 L-16 -40 M5 -6 L12 -14 L16 -40', '#f2b0a0', 1.8),
    path('M-16 -40 L-20 -50 L-14 -44 Z M16 -40 L20 -50 L14 -44 Z', '#f2b0a0', C.ink, 0.8), crayfishTop({ col: '#f2b0a0', claw: 'none' }))),
  'fisk.krill': all(water('#2f5a8a'), ...[[20, 30, 0.35], [40, 20, 0.3], [94, 22, 0.32], [100, 90, 0.34], [24, 92, 0.3], [70, 100, 0.28]].map(([x, y, s]) => at(x!, y!, s!, shrimpSide('rgba(242,140,130,0.85)'))), lens(58, 58, 30, at(58, 58, 1.1, shrimpSide('rgba(242,140,130,0.9)')), 1, 1)),
  'fisk.havstulpan': all(surface(30, '#a6cfe0'), path('M4 112 L4 62 C30 50 70 50 116 70 L116 112 Z', ROCK, C.ink, 1.3),
    ...[[20, 68], [36, 62], [52, 60], [70, 62], [86, 68], [102, 74], [28, 82], [46, 78], [64, 80], [82, 84], [100, 90]].map(([x, y], i) => at(x!, y!, i === 3 ? 1.5 : 1, path('M-6 0 L-3 -8 L3 -8 L6 0 Z', '#f2f0e8', C.ink, 1), path('M-2 -8 L0 -6 L2 -8', 'none', C.ink, 0.6))),
    at(70, 50, 1.5, line('M0 -2 C-4 -8 -6 -12 -4 -16 M0 -2 C0 -8 2 -12 4 -16 M0 -2 C4 -6 8 -8 8 -12', '#c89a6a', 1)), ring(70, 54, 14)),

  // 2725 Blötdjur
  'fisk.blötdjur': all(water(SEA), sandFloor(96, SAND), at(28, 90, 0.7, snail('#a07a50')), at(86, 92, 0.65, musselShell('#2f3550')), at(58, 44, 0.75, octopus()), oval(60, 64, 52, 46)),
  'fisk.ryggradslös': all(bg('#eef4f8'),
    greyed(at(58, 30, 1.25, path('M-36 0 C-30 -14 22 -16 30 -3 L42 -12 L40 0 L42 12 L30 3 C22 16 -30 14 -36 0 Z', '#dfe6ec', C.ink, 1.3), line('M-28 0 L34 0', C.ink, 1.2),
      ...range(12).map((i) => rect(-27 + i * 5, -2.4, 4, 4.8, BONE, 1, C.ink, 0.8)), ...range(11).map((i) => line(`M${-24.5 + i * 5} -2 L${-22 + i * 5} -10 M${-24.5 + i * 5} 2 L${-22 + i * 5} 10`, C.ink, 0.9)),
      path('M-36 0 C-34 -6 -30 -8 -26 -6 L-26 6 C-30 8 -34 6 -36 0 Z', BONE, C.ink, 0.9), circle(-31, -2, 1.4, C.ink, null))),
    line('M8 56 L112 56', C.grey2, 1.4),
    at(30, 86, 1, ...range(6).map((i) => rect(-21 + i * 7, -5, 6, 10, BONE, 1.5, C.ink, 1)), line('M-22 0 L22 0', C.ink, 0.8), line('M-24 -14 L24 14 M-24 14 L24 -14', C.red, 3.6)),
    at(86, 76, 0.72, octopus()), ellipse(86, 70, 15, 15, 'none', HL, 2.4)),
  'fisk.blåmussla': all(water(SEA), path('M4 112 L4 80 C30 70 80 70 116 84 L116 112 Z', ROCK, C.ink, 1.3), ...[[30, 76, -20], [46, 72, 10], [62, 74, -30], [80, 78, 20], [96, 82, -10], [40, 88, 30], [70, 90, -10]].map(([x, y, r]) => atR(x!, y!, 0.75, r!, musselShell('#1f2a4a'))), at(58, 40, 1.4, musselShell('#1f2a4a', true))),
  'fisk.filtrera.2': all(water(SEA), sandFloor(96, SAND), at(60, 76, 1.5, musselShell('#2f3550', true)), ...range(12).map((i) => circle(10 + (i % 4) * 7, 50 + ((i / 4) | 0) * 7, 1.2, '#8a7a4a', null)), arrow(26, 66, 40, 72, '#8a7a4a', 2), arrow(80, 72, 100, 62, HL, 2.6), ...range(3).map((i) => circle(98 + i * 5, 50 - i * 4, 1.6, 'none', '#ffffff', 0.9))),
  'fisk.ostron': all(bg('#f3ede2'), ellipse(60, 84, 48, 14, '#e8eef2', C.ink, 1.2), ...range(10).map((i) => rect(18 + i * 8, 80 + (i % 2) * 3, 6, 4, '#ffffff', 1, '#c8d8e4', 0.6)), at(42, 74, 1.1, oysterShell(true)), at(82, 66, 1, oysterShell(false))),
  'fisk.kammussla': all(water(SEA), sandFloor(100, SAND), at(60, 56, 1.8, scallop()), line('M98 44 L110 40 M98 52 L112 52 M98 60 L110 64', '#ffffff', 1.4), bubbles(24, 40, 3)),
  'fisk.flodpärlmussla': all(water('#cfe6f2'), stone(18, 102, 12, 6), stone(100, 104, 14, 6, ROCK2), path('M4 104 C30 100 80 106 116 102 L116 112 L4 112 Z', '#b49a72', null),
    at(58, 80, 1.6, path('M-24 6 C-26 -6 -10 -12 8 -10 C20 -8 26 -2 22 6 C10 10 -12 12 -24 6 Z', '#3a2a1a', C.ink, 1.3), path('M-24 6 C-16 16 10 16 22 6 C10 10 -12 11 -24 6 Z', '#f2e6d8', C.ink, 1), circle(-2, 9, 3, '#f6f4f0', C.ink, 0.7), circle(-3, 8, 0.8, C.white, null)), ring(55, 94, 8)),
  'fisk.snäcka.2': all(water(SEA), path('M4 112 L4 84 C30 76 80 76 116 86 L116 112 Z', ROCK, C.ink, 1.2), at(60, 70, 1.8, snail('#7a5a3a', '#c8b49a')), weed(16, 86, 20, '#7a6a2a')),
  'fisk.bläckfisk': all(water(SEA), sandFloor(100, SAND), stone(98, 98, 14, 7), at(56, 46, 1.25, octopus())),
  'fisk.tentakel': all(water('#3f86c0'), at(60, 64, 1, squid('#e8b0a0', true)), minnow(30, 104, 1.1, '#c8d2da')),
  'fisk.sugkopp': all(water(SEA), path('M10 100 C30 60 70 40 112 30 L112 52 C76 58 46 76 30 106 Z', '#d9634a', C.ink, 1.4), ...range(8).map((i) => circle(f1(30 + i * 10.4), f1(94 - i * 7.4 - (i > 4 ? (i - 4) * 1.5 : 0)), 4.4 - i * 0.25, '#f6c0a8', C.ink, 0.9)), ...range(8).map((i) => circle(f1(30 + i * 10.4), f1(94 - i * 7.4 - (i > 4 ? (i - 4) * 1.5 : 0)), 1.6 - i * 0.08, '#d98a7a', null)), ring(51, 79, 9)),
  'fisk.bläck.2': all(water(SEA), sandFloor(102, SAND), path('M10 64 C4 50 14 36 28 40 C34 28 52 30 54 44 C66 46 66 64 54 68 C50 80 30 82 24 72 C12 76 4 70 10 64 Z', '#1f1a24', HL, 2), at(92, 40, 0.6, octopus()), arrow(66, 46, 82, 40, C.dark, 1.6)),
  'fisk.kalmar': all(water(SEA), atR(56, 58, 0.9, 90, squid())),

  // 2726 Fiskarnas anatomi
  'fisk.ryggradsdjur': all(bg('#eef4f8'), at(30, 34, 0.6, fishSide({ ...generic('#9ab0c8'), L: 24, marks: line('M-18 0 L18 0', HL, 2.4) })),
    at(88, 32, 1, ellipse(0, 0, 14, 8, '#c8a06a', C.ink, 1.1), circle(-14, -6, 5, '#c8a06a', C.ink, 1.1), path('M-19 -6 L-24 -5 L-19 -4 Z', C.orange, null), path('M12 -2 L22 -6 L20 2 Z', '#a8804a', C.ink, 1), line('M-12 -4 C-4 -2 6 -2 12 -2', HL, 2.2), line('M-2 8 L-2 14 M4 8 L4 14', C.ink, 1.2)),
    stand(60, 112, 0.5, F({ x: 60, top: 'rgba(160,190,220,0.8)', mood: 'smile' })), line('M60 72 L60 96', HL, 2.4)),
  'fisk.fena': all(water(FRESH), anat('fins')),
  'fisk.ryggfena': all(water(FRESH), anat('dorsal')),
  'fisk.bröstfena': all(water(FRESH), anat('pect'), ring(40, 66, 9)),
  'fisk.stjärtfena': all(water(FRESH), anat('tail')),
  'fisk.fjäll.2': all(bg('#eef4f8'), at(60, 60, 1, ...range(5).flatMap((r) => range(6).map((c) => path(`M${-40 + c * 16 + (r % 2) * 8} ${-36 + r * 14} C${-28 + c * 16 + (r % 2) * 8} ${-38 + r * 14} ${-28 + c * 16 + (r % 2) * 8} ${-22 + r * 14} ${-40 + c * 16 + (r % 2) * 8} ${-22 + r * 14}`, '#c8d2da', C.ink, 1))),
    g('rotate(-20 12 0)', path('M4 -8 C18 -10 18 8 4 6 Z', '#e8eef4', HL, 2), path('M7 -5 C14 -5 14 4 7 3', 'none', '#9aa8b4', 0.6), path('M8 -3 C11 -3 11 2 8 1', 'none', '#9aa8b4', 0.6))), at(22, 100, 0.4, fishSide(SALMON))),
  'fisk.gäle': all(water(FRESH), anat('gill'), ring(30, 60, 12)),
  'fisk.gällock': all(water(FRESH), anat('operc')),
  'fisk.simblåsa': all(water(FRESH), anat('blad')),
  'fisk.sidolinje': all(water(FRESH), anat('lat'), ...[0, 1, 2].map((i) => path(`M${100 + i * 5} ${34 + i * 2} C${104 + i * 5} ${42} ${104 + i * 5} ${48} ${100 + i * 5} ${56 - i * 2}`, 'none', '#ffffff', 1.4)), minnow(112, 46, 0.8, '#c8d2da')),
  'fisk.fiskben': all(bg('#f3ede2'), ellipse(60, 66, 52, 30, C.white, C.ink, 1.4), at(60, 64, 1, path('M-36 0 C-36 -10 -26 -12 -22 -8 L-22 8 C-26 12 -36 10 -36 0 Z', '#d8c8a0', C.ink, 1), circle(-30, -2, 1.6, C.ink, null), line('M-22 0 L24 0', BONE, 2.6), line('M-22 0 L24 0', C.ink, 0.6),
    ...range(10).map((i) => line(`M${-18 + i * 4.4} 0 L${-14 + i * 4.4} -12 M${-18 + i * 4.4} 0 L${-14 + i * 4.4} 12`, '#c8c0a8', 1.2)), path('M24 0 L34 -10 L32 0 L34 10 Z', '#d8c8a0', C.ink, 1)), ring(70, 64, 16)),
  'fisk.rensa.2': all(bg('#f3ede2'), rect(12, 76, 96, 30, '#d8b080', 3, C.ink, 1.3), at(60, 82, 1.1, fishSide({ ...COD, L: 30, over: path('M-12 6 L14 4', 'none', C.red, 1.6) })), at(68, 84, 1, path('M-14 4 C-6 8 6 8 14 4', '#c84a4a', null)),
    line('M86 74 L104 56', C.ink, 3), line('M86 74 L98 62', '#c0c6cc', 4), circle(104, 56, 3, C.skin, C.ink, 1.1), circle(28, 72, 4, C.skin, C.ink, 1.1), line('M28 72 L14 52', C.skin, 6), line('M104 56 L114 40', C.skin, 6)),
  'fisk.växelvarm': all(bg('#f6f2ea'), rect(4, 4, 56, 54, '#bfe0f4', 3, null), rect(4, 58, 56, 54, '#f6c8a8', 0, null), fishAt(26, 30, 0.6, generic('#7a9ab8')), thermo(50, 44, 4, '#5aa7d6'), fishAt(26, 86, 0.6, generic('#d88a5a')), thermo(50, 100, 18, C.red),
    line('M60 4 L60 112', C.ink, 1.2), greyed(rect(60, 4, 56, 54, '#bfe0f4', 0, null), rect(60, 58, 56, 54, '#f6c8a8', 0, null), at(80, 32, 1, ellipse(0, 0, 9, 6, '#c8a06a', C.ink, 1), circle(-9, -5, 4, '#c8a06a', C.ink, 1)), thermo(104, 44, 12, C.orange), at(80, 88, 1, ellipse(0, 0, 9, 6, '#c8a06a', C.ink, 1), circle(-9, -5, 4, '#c8a06a', C.ink, 1)), thermo(104, 100, 12, C.orange))),
  'fisk.strömlinjeformad': all(bg('#eef4f8'), fishAt(54, 36, 1.05, TUNA), ...[[14, 22, 98, 22], [10, 36, 16, 36], [14, 50, 98, 50]].map(([a, b, c, d]) => path(`M${a} ${b} C${(a! + c!) / 2} ${b! + (b! < 36 ? -8 : b! > 36 ? 8 : 0)} ${(a! + c!) / 2} ${b! + (b! < 36 ? -8 : b! > 36 ? 8 : 0)} ${c} ${d}`, 'none', HL, 1.6)),
    line('M8 64 L112 64', C.grey2, 1.2), greyed(rect(30, 74, 40, 28, '#8a929c', 3, C.ink, 1.2), path('M76 80 c6 -4 10 4 4 6 c-6 2 -2 10 4 6 M80 94 c6 -4 10 4 4 6', 'none', C.ink, 1.2), line('M8 80 L28 80 M8 96 L28 96', C.ink, 1.2))),

  // 2727 Liv i korallrev
  'fisk.korallrev': reefBg(all(branchCoral(18, 100, 1, '#f08a6a'), brainCoral(44, 102, 1.2), fanCoral(68, 100, 1.1), branchCoral(96, 102, 1.1, '#f2c84a'), anemone(108, 104, 0.6), brainCoral(84, 106, 0.8, '#9ad08a'),
    clownfish(36, 52, 0.9), fishAt(80, 38, 0.6, { ...generic('#3a7ad8'), marks: line('M-14 -2 L14 -2', C.yellow, 2) }), fishAt(60, 70, 0.5, { ...generic(C.yellow), tail: 'round' }, true), minnow(96, 64, 1, '#a8d8f0'), minnow(102, 70, 1, '#a8d8f0'))),
  'fisk.polyp': reefBg(all(branchCoral(30, 100, 1.4, '#f2a07a'), lens(74, 50, 30, all(...[[62, 40], [80, 38], [70, 58], [88, 56]].map(([x, y]) => at(x!, y!, 1, rect(-3, 0, 6, 10, '#f2a07a', 1, C.ink, 0.7), ...range(8).map((i) => { const a = -Math.PI + (i / 7) * Math.PI; return line(`M0 0 L${f1(Math.cos(a) * 7)} ${f1(Math.sin(a) * 7)}`, '#f6d0b8', 1.2); }), circle(0, 0, 1.4, '#c86a4a', null)))), -1, 1))),
  'fisk.alg': all(water(FRESH), stone(36, 100, 26, 10, ROCK2), stone(90, 104, 22, 8), ...range(14).map((i) => line(`M${16 + i * 3.6} ${96 - (i % 3)} c-2 -6 2 -10 0 -${14 + (i % 4) * 4}`, '#3a9a4a', 1.6)), ...range(9).map((i) => line(`M${76 + i * 3.4} ${100} c-2 -6 2 -8 0 -${10 + (i % 3) * 3}`, '#3a9a4a', 1.6)),
    lens(70, 38, 22, all(...[[62, 32], [72, 28], [78, 40], [64, 44], [70, 38]].map(([x, y]) => all(circle(x!, y!, 3.4, '#9ad06a', C.ink, 0.7), circle(x!, y!, 1, '#3a7a2a', null)))), -1, 1)),
  'fisk.havsanemon': reefBg(all(stone(60, 104, 34, 8, ROCK2), anemone(60, 96, 2))),
  'fisk.clownfisk': reefBg(all(anemone(80, 104, 1.1), clownfish(54, 54, 2.2))),
  'fisk.symbios': reefBg(all(anemone(60, 104, 1.8), clownfish(60, 62, 1), path('M38 52 C30 36 40 22 54 26', 'none', HL, 2.2), arrow(48, 25, 56, 27, HL, 2.2), path('M82 52 C90 36 80 22 66 26', 'none', HL, 2.2), arrow(72, 25, 64, 27, HL, 2.2))),
  'fisk.papegojfisk': reefBg(all(branchCoral(20, 100, 1.1, '#f0a07a'), brainCoral(96, 102, 1.3), fishAt(64, 56, 1.2, { L: 30, H: 11, B: 10, col: '#3ab0a0', belly: '#9ad8c8', tail: 'moon', T: 9, finCol: '#d85aa8', dorsal: [[-14, 18, 4]], anal: [[4, 18, 4]], eye: 2.4,
    marks: all(line('M-20 -6 C-10 -10 10 -10 20 -6 M-20 4 C-10 8 10 8 20 4', '#f2c84a', 1), path('M-24 -2 C-20 -6 -16 -6 -14 -2', 'none', '#d85aa8', 1.4)), over: all(path('M-30 0 C-30 -4 -27 -6 -24 -5 L-24 5 C-27 6 -30 4 -30 0 Z', '#f2f0e8', C.ink, 1), line('M-30 0 L-24 0', C.ink, 0.8)) }),
    ...range(8).map((i) => circle(98 + (i % 3) * 4, 64 + ((i / 3) | 0) * 4, 1, '#ffffff', null)))),
  'fisk.sjöstjärna': all(water(SEA), sandFloor(60, SAND), starfish(60, 80, 1.6, '#e0603a', 10), stone(104, 100, 8, 4)),
  'fisk.sjöborre': all(water(SEA), path('M4 112 L4 84 C30 78 80 78 116 86 L116 112 Z', ROCK, C.ink, 1.2), urchin(60, 66, 1.9)),
  'fisk.manet': all(water('#3f86c0'), jelly(60, 40, 2), bubbles(100, 90, 3)),
  'fisk.korallblekning': all(water('#7fcbe6'), rect(4, 4, 112, 10, '#b8e4f4', 3, null), sandFloor(100, '#f2e2b4'), branchCoral(26, 100, 1.4, '#f8f8f4'), brainCoral(58, 102, 1.4, '#f4f4ee'), fanCoral(88, 100, 1.2, '#f2f2ec'),
    thermo(106, 40, 22, C.red), sun(22, 22, 5), greyed(at(70, 34, 0.5, branchCoral(0, 20, 1, '#f08a6a'), brainCoral(24, 22, 1, '#d8b45a'))), arrow(62, 40, 62, 56, C.dark, 1.6)),
  'fisk.havsförsurning': all(surface(40, SEA), at(24, 40, 1, rect(-10, -16, 20, 16, '#9aa3ad', 1, C.ink, 1), rect(2, -28, 5, 12, '#7a8290', 0, C.ink, 1), circle(5, -32, 4, '#c9ced4', null), circle(9, -36, 5, '#c9ced4', null)),
    ...[[46, 18], [66, 24], [86, 16]].map(([x, y]) => at(x!, y!, 1, circle(0, 0, 3.4, C.dark, C.ink, 0.7), circle(-6, 0, 2.6, C.red, C.ink, 0.7), circle(6, 0, 2.6, C.red, C.ink, 0.7))), arrow(66, 30, 66, 52, C.dark, 1.8), sandFloor(100, SAND),
    at(46, 88, 1.2, path('M0 12 C-14 12 -20 -2 -16 -10 C-10 -18 10 -18 16 -10 C20 -2 14 12 0 12 Z', 'none', C.ink, 1.3, ).replace('<path', '<path stroke-dasharray="3 2"'), path('M-10 2 C-6 -6 6 -6 10 2', 'none', '#9aa3ad', 1)),
    branchCoral(88, 102, 1, '#e8d8d0'), ring(46, 86, 20)),
  'fisk.snorkla': all(rect(4, 4, 112, 36, SKY, 3, null), rect(4, 40, 112, 72, '#7fcbe6', 0, null), line('M4 40 L116 40', '#ffffff', 1.6), sun(98, 18, 5), at(56, 44, 1.5, swimmer({ mask: true, snorkel: true, suit: '#d85a6a' })),
    sandFloor(104, '#f2e2b4'), brainCoral(30, 106, 1), branchCoral(90, 106, 1, '#f2c84a'), clownfish(70, 88, 0.7)),
};
void num; void DEEP; void LAND; void cloud; void seagull; void SALMON; void MACKEREL; void HERRING; void TUNA; void range; void stand;
