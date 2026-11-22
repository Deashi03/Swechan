/**
 * Teknik & digital värld → Maskiner & tillverkning → Materialteknik, 4031–4037 (0.58): steel and alloys,
 * aluminium and copper, wood, ceramics and glass, composites, corrosion and wear, materials testing.
 * Recurring signs: the part that the word names is outlined in orange (ring or frame) and grey parts show what
 * the word is not. Glowing metal is orange-yellow, steel blue-grey, copper red-brown, aluminium light silver,
 * glass pale blue. Words that are easy to mix up get clearly different scenes: lövträ (a dark board in front of a
 * broad-leaved tree) and barrträ (a pale board in front of a fir); ådring (the wavy lines under a magnifier) and
 * kvist (one dark round spot under the magnifier, no lines); spånskiva (a board edge full of chips) and limträ
 * (a beam built of glued layers in a hall roof); glas (light shining through bottle, glass and pane), härdat glas
 * (a pane crumbled into small cubes, a grey sharp shard beside it) and splittras (a glass flying apart in
 * shards); cement (a sack with grey powder) and betong (a hard speckled block from a wheelbarrow); korrosion
 * (three metals attacked in three colours), rostskydd (a spray under a car) and förzinka (steel lowered into a
 * grey bath); slita (a shoe sole rubbed thin) and utmattning (a strip bent to and fro until a crack appears);
 * dragprov (the machine pulling a test bar) and brott (a close-up of a snapped bar with fragments).
 * Digits and the code signs only; no unit letters, no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waGrow, waIn, waPulse, waSway, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const STEEL = '#8e9fb3';
const STEEL2 = '#6f8197';
const HOT = '#ffb238';
const GLOW = '#ff7a1a';
const COPPER = '#c4703a';
const PATINA = '#6cc3a0';
const ALU = '#d9dee4';
const GLASS = 'rgba(160,210,235,0.55)';
const WOOD = '#d9a866';
const WOOD2 = '#b07a3e';
const DARKWOOD = '#8a5a2b';
const CONCRETE = '#b5b5ad';
const ZINC = '#a9b6c2';
const WATER = '#8cc7e8';
const f1 = (n: number) => +n.toFixed(1);
/** Numeric tuples for map() with destructuring. */
const tup = (a: number[][]) => a as [number, number, number][];
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 5, col, 2.6);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const wall = (col = '#efe8dc') => rect(0, 0, 120, 112, col, 0, null);
const check = (x: number, y: number, s = 1, col: string = C.green) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 8, C.white, col, 2), line('M-4 0 L-1 3 L4 -3', col, 2.4));
const cross = (x: number, y: number, s = 6, col: string = C.red) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 3);
const flame = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 0 C-8 0 -9 -9 -4 -14 C-4 -9 -1 -9 -1 -12 C-1 -17 3 -20 4 -24 C6 -18 10 -12 9 -6 C8 -2 5 0 0 0 Z', GLOW, C.ink, 1.2), path('M0 -2 C-4 -2 -4 -7 -1 -9 C0 -6 2 -6 2 -9 C5 -6 5 -2 0 -2 Z', C.yellow, null));
const smoke = (x: number, y: number) => all(circle(x, y, 5, '#d5d5d5', null), circle(x + 6, y - 6, 6, '#e2e2e2', null), circle(x + 2, y - 14, 5, '#ececec', null));
const drop = (x: number, y: number, s = 1, col: string = WATER) => path(`M${x} ${y - 5 * s} C${x + 4 * s} ${y} ${x + 3 * s} ${y + 4 * s} ${x} ${y + 4 * s} C${x - 3 * s} ${y + 4 * s} ${x - 4 * s} ${y} ${x} ${y - 5 * s} Z`, col, C.ink, 0.8);
const magnifier = (x: number, y: number, r = 22) => all(line(`M${x + r * 0.7} ${y + r * 0.7} L${x + r * 1.3} ${y + r * 1.3}`, C.dark, 6), circle(x, y, r, 'none', C.dark, 4));
/** Palm seen from the side (no pointing finger), wrist at (x, y). */
const palm = (x: number, y: number, rot = 0, sleeve: string = C.navy) => g(`translate(${x} ${y}) rotate(${rot})`, path('M0 0 L14 -2 C20 -3 26 -2 30 0 C32 2 30 5 26 5 L20 5 C22 7 21 10 18 10 L4 10 C0 10 -2 6 0 0 Z', C.skin, C.ink, 1.4), rect(-12, -1, 14, 11, sleeve, 2, C.ink, 1.4));
/** Standing person, feet at (x, 112); arms from the shoulders to (lx, ly) and (rx, ry) relative to the neck. */
const person = (x: number, top: string, o: { s?: number; l?: [number, number]; r?: [number, number]; hat?: string; hair?: string } = {}) => {
  const s = o.s ?? 1, [lx, ly] = o.l ?? [-12, 22], [rx, ry] = o.r ?? [12, 22];
  return g(`translate(${x} 112) scale(${s})`, line('M-5 0 L-4 -26 M5 0 L4 -26', C.navy, 7), rect(-11, -56, 22, 32, top, 6, C.ink, 1.6),
    line(`M-9 -52 L${lx} ${-56 + ly}`, C.ink, 6.4), line(`M-9 -52 L${lx} ${-56 + ly}`, top, 4.4), circle(lx, -56 + ly, 3.2, C.skin, C.ink, 1.2),
    line(`M9 -52 L${rx} ${-56 + ry}`, C.ink, 6.4), line(`M9 -52 L${rx} ${-56 + ry}`, top, 4.4), circle(rx, -56 + ry, 3.2, C.skin, C.ink, 1.2),
    circle(0, -67, 10, C.skin, C.ink, 1.6), o.hat ? path('M-12 -70 C-12 -84 12 -84 12 -70 L14 -69 L-14 -69 Z', o.hat, C.ink, 1.6) : path('M-10 -68 C-10 -81 10 -81 10 -68 C6 -73 -6 -73 -10 -68 Z', o.hair ?? C.hair, null),
    circle(-3.5, -66, 1.2, C.ink, null), circle(3.5, -66, 1.2, C.ink, null), path('M-3 -61 C-1 -59 1 -59 3 -61', 'none', C.ink, 1.2));
};
/** Factory hall with a saw-tooth roof, chimneys and an open glowing door. */
const factory = (col: string, chimneys: number[]) => all(...chimneys.map((x) => all(rect(x, 22, 9, 40, C.dark, 1, C.ink, 1.6), rect(x, 26, 9, 4, C.red, 0, null), smoke(x + 4, 16))),
  path('M8 60 L8 112 L112 112 L112 60 L96 48 L96 60 L80 48 L80 60 L64 48 L64 60 L48 48 L48 60 L32 48 L32 60 L16 48 L16 60 Z', col, C.ink, 1.8));
/** Ladle tipped to the right, pouring glowing metal down to (x2, y2). */
const ladle = (x: number, y: number, x2: number, y2: number) => all(path(`M${x + 12} ${y + 2} C${x + 22} ${y + 6} ${x2} ${y2 - 18} ${x2} ${y2}`, 'none', HOT, 5), path(`M${x + 12} ${y + 2} C${x + 22} ${y + 6} ${x2} ${y2 - 18} ${x2} ${y2}`, 'none', C.yellow, 2),
  g(`translate(${x} ${y}) rotate(25)`, path('M-14 -10 L14 -10 L11 12 C10 16 -10 16 -11 12 Z', C.dark, C.ink, 1.6), ellipse(0, -10, 14, 4, GLOW, C.ink, 1.4)));
/** Crucible (cup for molten metal) with glowing content. */
const crucible = (x: number, y: number, s = 1, melt: string = GLOW) => g(`translate(${x} ${y}) scale(${s})`, path('M-14 -12 L14 -12 L10 12 L-10 12 Z', C.dark, C.ink, 1.6), ellipse(0, -12, 14, 4, melt, C.ink, 1.4));
/** Ingot (trapezoid bar) seen in perspective. */
const ingot = (x: number, y: number, col: string, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-14 0 L14 0 L10 -8 L-10 -8 Z', col, C.ink, 1.4), path('M-10 -8 L10 -8 L8 -11 L-8 -11 Z', C.white, C.ink, 1), line('M-6 -4 L6 -4', C.white, 1.2));
/** I-beam seen from the side, length len, centred at (x, y); the I profile shows at the right end. */
const ibeam = (x: number, y: number, len: number, col: string = STEEL) => all(rect(x - len / 2, y - 7, len, 14, col, 1, C.ink, 1.6), line(`M${x - len / 2 + 2} ${y - 4} L${x + len / 2 - 2} ${y - 4} M${x - len / 2 + 2} ${y + 4} L${x + len / 2 - 2} ${y + 4}`, STEEL2, 1.4),
  path(`M${x + len / 2} ${y - 7} L${x + len / 2 + 10} ${y - 7} L${x + len / 2 + 10} ${y - 4} L${x + len / 2 + 6.5} ${y - 4} L${x + len / 2 + 6.5} ${y + 4} L${x + len / 2 + 10} ${y + 4} L${x + len / 2 + 10} ${y + 7} L${x + len / 2} ${y + 7} Z`, STEEL2, C.ink, 1.4));
/** Hammer, head centre at (x, y), rotated. */
const hammer = (x: number, y: number, rot = 0) => g(`translate(${x} ${y}) rotate(${rot})`, rect(-3, 0, 6, 36, C.tan, 2, C.ink, 1.4), rect(-12, -8, 24, 10, C.dark, 2, C.ink, 1.6));
/** Board (plank) from (x, y), width w, height h, with grain lines. */
const board = (x: number, y: number, w: number, h: number, col: string = WOOD, grain = true, gcol: string = WOOD2) => all(rect(x, y, w, h, col, 1.5, C.ink, 1.6),
  grain ? line(range(Math.max(1, Math.floor(h / 5))).map((i) => { const yy = f1(y + 3 + i * 5); return `M${x + 3} ${yy} C${f1(x + w * 0.3)} ${f1(yy - 2)} ${f1(x + w * 0.6)} ${f1(yy + 2)} ${x + w - 3} ${yy}`; }).join(' '), gcol, 1) : '');
/** Broad-leaved tree and fir tree silhouettes. */
const leafTree = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-3, -14, 6, 16, C.brown, 1, C.ink, 1.2), path('M0 -46 C16 -46 22 -34 18 -24 C22 -16 14 -10 6 -12 C2 -8 -6 -8 -8 -12 C-18 -10 -22 -20 -16 -26 C-22 -36 -12 -46 0 -46 Z', C.green, C.ink, 1.4));
const firTree = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-3, -10, 6, 12, C.brown, 1, C.ink, 1.2), path('M0 -50 L10 -34 L5 -34 L15 -20 L8 -20 L19 -8 L-19 -8 L-8 -20 L-15 -20 L-5 -34 L-10 -34 Z', '#2f7a4a', C.ink, 1.4));
/** Simple car from the side, wheels on y. */
const car = (x: number, y: number, col: string = C.red, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-34 -8 L-34 -20 L-20 -22 L-10 -34 L14 -34 L26 -22 L36 -20 L36 -8 Z', col, C.ink, 1.6), path('M-7 -31 L4 -31 L4 -23 L-15 -23 Z M8 -31 L13 -31 L21 -23 L8 -23 Z', '#dff1fb', C.ink, 1.2),
  circle(-20, -8, 7, C.dark, C.ink, 1.4), circle(22, -8, 7, C.dark, C.ink, 1.4), circle(-20, -8, 2.5, C.silver, null), circle(22, -8, 2.5, C.silver, null));
/** Dog-bone test bar (tensile specimen), centred, vertical, length h. */
const testBar = (x: number, y: number, h: number, col: string = STEEL, gap = 0) => {
  const half = (y0: number, y1: number, top: boolean) => path(top
    ? `M${x - 9} ${y0} L${x + 9} ${y0} L${x + 9} ${y0 + 14} L${x + 4} ${y0 + 22} L${x + 4} ${y1} L${x - 4} ${y1} L${x - 4} ${y0 + 22} L${x - 9} ${y0 + 14} Z`
    : `M${x - 9} ${y1} L${x + 9} ${y1} L${x + 9} ${y1 - 14} L${x + 4} ${y1 - 22} L${x + 4} ${y0} L${x - 4} ${y0} L${x - 4} ${y1 - 22} L${x - 9} ${y1 - 14} Z`, col, C.ink, 1.4);
  const top = y - h / 2, bot = y + h / 2;
  return gap ? all(half(top, y - gap / 2, true), half(y + gap / 2, bot, false)) : all(half(top, y, true), half(y, bot, false), line(`M${x - 4} ${y} L${x + 4} ${y}`, col, 1.6));
};
/** Shoe from the side, sole bottom at y. */
const shoe = (x: number, y: number, worn = false) => g(`translate(${x} ${y})`, path('M-26 -4 L-26 -20 C-26 -26 -14 -28 -8 -24 L6 -16 C16 -12 26 -12 28 -6 L28 -4 Z', C.navy, C.ink, 1.6), line('M-8 -24 L-4 -18 M-2 -20 L2 -15', C.white, 1.4),
  worn ? path('M-26 -4 L28 -4 L28 -1 C20 1 0 1 -18 0 L-26 -2 Z', C.dark, C.ink, 1.2) : all(rect(-26, -4, 54, 5, C.dark, 1, C.ink, 1.2), line(range(9).map((i) => `M${-22 + i * 6} 1 l0 3`).join(' '), C.dark, 2.4)));
/** Truck from the side, wheels on y. */
const truck = (x: number, y: number, col: string = C.orange, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-30, -30, 38, 22, col, 2, C.ink, 1.6), path('M8 -24 L22 -24 L30 -16 L30 -8 L8 -8 Z', col, C.ink, 1.6), path('M12 -21 L20 -21 L26 -15 L12 -15 Z', '#dff1fb', C.ink, 1.2),
  circle(-20, -8, 6, C.dark, C.ink, 1.4), circle(-4, -8, 6, C.dark, C.ink, 1.4), circle(20, -8, 6, C.dark, C.ink, 1.4));
/** Paper sheet with lines (no letters) and a seal. */
const certificate = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-20, -26, 40, 52, C.white, 2, C.ink, 1.6), rect(-16, -22, 32, 44, 'none', 1, C.gold, 1.2),
  line('M-11 -14 L11 -14 M-11 -8 L11 -8 M-11 -2 L5 -2', C.grey, 1.6), path('M4 10 L0 24 L6 20 L10 26 L12 10 Z', C.red, C.ink, 1), circle(8, 10, 7, C.gold, C.ink, 1.2), circle(8, 10, 4, 'none', C.white, 1));

export const MATR_MOTIFS: Record<string, Svg> = {
  // ── 4031 Stål och legeringar ──
  'matr.stålverk': all(rect(0, 0, 120, 112, '#e6eef5', 0, null), factory('#7d8794', [20, 36, 92]), rect(42, 70, 36, 42, '#3a2a22', 1, C.ink, 1.6), ladle(52, 80, 66, 106), ellipse(66, 107, 9, 3, HOT, C.ink, 1),
    ...tup([[8, 102], [16, 102], [12, 96]]).map(([x, y]) => g(`translate(${x} ${y})`, ellipse(0, 0, 4, 6, STEEL, C.ink, 1.2))), rect(86, 92, 22, 14, STEEL, 1, C.ink, 1.4), line('M86 97 L108 97 M86 101 L108 101', STEEL2, 1.2), ground()),
  'matr.legera': all(ingot(20, 30, STEEL, 1.1), circle(100, 26, 8, C.black, C.ink, 1.4), circle(94, 32, 5, C.black, C.ink, 1.2),
    waIn('mlg1', -12, -10, arrow(28, 38, 46, 58, HL, 3)), waIn('mlg2', 12, -10, arrow(94, 40, 76, 58, HL, 3)),
    crucible(60, 74, 1.3, GLOW), flame(48, 106, 0.6), flame(60, 106, 0.7), flame(72, 106, 0.6),
    moving('mlg3', '0%,40%{opacity:0}70%,100%{opacity:1}', { dur: 3 }, all(rect(92, 84, 22, 9, STEEL2, 1.5, C.ink, 1.4), ...tup([[96, 87], [101, 90], [106, 87], [110, 90]]).map(([x, y]) => circle(x, y, 1.2, C.black, null)))), arrow(78, 88, 90, 88, C.ink, 2)),
  'matr.hård': all(rect(14, 78, 44, 32, C.grey, 4, C.ink, 1.8), line('M20 86 L30 84 M36 96 L48 92', C.grey2, 1.4), hammer(36, 64, -20), line('M22 72 L16 66 M50 72 L56 66 M36 70 L36 62', C.gold, 2.2), ring(36, 82, 26),
    greyed(path('M72 98 C72 86 112 86 112 98 L112 108 L72 108 Z', C.lilac, C.ink, 1.6), path('M84 92 C88 100 96 100 100 92', 'none', C.ink, 1.6), palm(74, 80, 25, C.green)), ground()),
  'matr.seg.5': all(rect(6, 84, 30, 26, C.dark, 2, C.ink, 1.6), rect(10, 76, 22, 10, C.grey, 1, C.ink, 1.4), path('M18 76 L18 50 C18 30 34 26 50 34 L62 40', 'none', C.ink, 8), path('M18 76 L18 50 C18 30 34 26 50 34 L62 40', 'none', STEEL, 5.4), ring(26, 40, 16),
    greyed(line('M74 96 L94 92', C.sky, 5), line('M98 90 L114 86', C.sky, 5), line('M95 86 L97 82 M96 94 L99 97 M92 88 L90 84', C.ink, 1.4)), check(56, 64), ground()),
  'matr.härda.2': all(rect(58, 70, 50, 40, '#4a78a8', 3, C.ink, 1.8), rect(60, 72, 46, 8, WATER, 1, null), line('M60 76 Q70 73 82 76 T106 76', C.white, 1.2),
    moving('mhd', '0%{transform:translate(-24px,-26px)}45%,100%{transform:translate(0,0)}', { dur: 3 }, line('M30 30 L70 60 M34 26 L74 56', C.dark, 3), path('M70 56 L92 74 L88 80 L66 62 Z', GLOW, C.ink, 1.4), path('M74 60 L90 74', 'none', C.yellow, 2)),
    waGrow('mhd2', smoke(70, 58), smoke(92, 54)), ground()),
  'matr.balk': all(rect(0, 0, 120, 112, '#e6eef5', 0, null), line('M60 0 L60 30', C.dark, 2), path('M54 30 L66 30 L66 36 C66 42 58 44 56 38', 'none', C.dark, 3), line('M58 40 L30 52 M58 40 L86 52', C.dark, 1.6),
    ibeam(56, 58, 66), frame(18, 46, 84, 24), ...[20, 50, 80, 110].map((x) => rect(x - 3, 84, 6, 28, STEEL2, 1, C.ink, 1.2)), rect(14, 82, 100, 5, STEEL2, 1, C.ink, 1.2), ground()),

  // ── 4032 Aluminium och koppar ──
  'matr.lätt': all(rect(56, 30, 8, 76, C.dark, 2, C.ink, 1.6), rect(40, 104, 40, 6, C.dark, 2, C.ink, 1.4), line('M18 32 L102 48', C.ink, 3), circle(60, 40, 4, C.gold, C.ink, 1.4),
    line('M18 32 L10 56 M18 32 L26 56 M102 48 L94 72 M102 48 L110 72', C.ink, 1.2), path('M6 56 L30 56 C28 62 8 62 6 56 Z', C.silver, C.ink, 1.4), path('M90 72 L114 72 C112 78 92 78 90 72 Z', C.silver, C.ink, 1.4),
    path('M10 52 C14 40 24 34 30 36 C26 40 20 46 12 52 Z', C.white, C.ink, 1.2), line('M10 52 L28 37', C.ink, 0.8), ring(18, 48, 14),
    greyed(rect(94, 60, 16, 12, C.dark, 2, C.ink, 1.4))),
  'matr.bauxit': all(rect(0, 0, 120, 60, '#f3e3c8', 0, null), path('M0 40 L20 40 L20 48 L44 48 L44 56 L76 56 L76 48 L100 48 L100 40 L120 40 L120 112 L0 112 Z', '#c86a46', C.ink, 1.4), line('M20 48 L44 48 M44 56 L76 56 M76 48 L100 48', '#a5502f', 2),
    ...tup([[30, 96], [40, 92], [48, 98], [36, 104], [24, 104], [44, 106]]).map(([x, y]) => path(`M${x - 6} ${y + 3} L${x - 4} ${y - 4} L${x + 3} ${y - 6} L${x + 7} ${y} L${x + 4} ${y + 5} Z`, '#b24f2c', C.ink, 1.2)), ring(36, 98, 18),
    arrow(58, 96, 74, 96, C.ink, 2.4), greyed(ingot(94, 102, ALU, 1.2))),
  'matr.smältverk': all(rect(0, 0, 120, 112, '#e9eef3', 0, null), path('M96 8 L88 50 M96 8 L104 50 M90 30 L102 30 M92 20 L100 20', 'none', C.dark, 2), line('M96 12 C70 20 50 30 40 54', C.dark, 1.4), line('M96 12 C110 20 116 26 120 30', C.dark, 1.4),
    rect(10, 54, 70, 58, '#8c96a3', 1, C.ink, 1.8), rect(16, 44, 10, 12, C.dark, 1, C.ink, 1.4), smoke(21, 38), rect(30, 74, 18, 38, '#3a2a22', 1, C.ink, 1.4), rect(33, 96, 12, 8, HOT, 1, null), rect(56, 64, 16, 10, '#cfe6f5', 1, C.ink, 1.2),
    waPulse('msv', path('M40 48 L34 60 L40 60 L36 70 L46 56 L40 56 L44 48 Z', C.yellow, C.ink, 1)), ingot(98, 108, ALU), ingot(98, 98, ALU), ingot(98, 88, ALU), ground()),
  'matr.ledningsförmåga': all(line('M14 40 L100 40', COPPER, 6), line('M14 40 L100 40', '#e19a69', 2), circle(108, 40, 9, C.yellow, C.ink, 1.6), ...range(6).map((i) => line(`M${108 + Math.cos(i) * 12} ${40 + Math.sin(i * 1.3) * 12} l${f1(Math.cos(i) * 4)} ${f1(Math.sin(i * 1.3) * 4)}`, C.gold, 1.6)),
    ...range(6).map((i) => moving(`mlf${i}`, '0%{transform:translate(-14px,0);opacity:0}30%,70%{opacity:1}100%{transform:translate(14px,0);opacity:0}', { dur: 1.2, delay: i * 0.2 }, circle(20 + i * 14, 40, 2.4, C.yellow, C.ink, 0.8))), frame(8, 28, 112, 24),
    greyed(line('M14 84 L100 84', C.white, 6), circle(108, 84, 9, C.grey2, C.ink, 1.6), cross(108, 84, 4, C.grey))),
  'matr.kopparrör': all(wall('#eef1f4'), rect(8, 18, 104, 22, C.white, 2, C.ink, 1.6), rect(40, 22, 40, 12, '#cfe6f5', 6, C.ink, 1.4),
    path('M48 40 L48 66 C48 74 56 74 60 74 L60 98', 'none', C.ink, 7), path('M48 40 L48 66 C48 74 56 74 60 74 L60 98', 'none', COPPER, 4.6), path('M72 40 L72 60 L96 60 L96 98', 'none', C.ink, 7), path('M72 40 L72 60 L96 60 L96 98', 'none', COPPER, 4.6),
    rect(54, 96, 12, 6, C.silver, 1, C.ink, 1), rect(90, 96, 12, 6, C.silver, 1, C.ink, 1), line('M50 50 L50 64 M74 44 L74 56', '#f0b38a', 1.2), frame(40, 44, 64, 60), rect(0, 104, 120, 8, C.tan, 0, null)),
  'matr.ärga': all(rect(0, 0, 120, 112, '#e6eef5', 0, null), rect(30, 70, 60, 42, '#efe1c8', 1, C.ink, 1.6), rect(52, 88, 16, 24, C.brown, 1, C.ink, 1.4), path('M24 72 C24 36 96 36 96 72 Z', COPPER, C.ink, 1.8), rect(56, 18, 8, 20, COPPER, 1, C.ink, 1.4), path('M60 6 L64 18 L56 18 Z', COPPER, C.ink, 1.2),
    moving('mrg', '0%{opacity:0}60%,100%{opacity:1}', { dur: 4 }, path('M24 72 C24 36 96 36 96 72 Z', PATINA, C.ink, 1.8), rect(56, 18, 8, 20, PATINA, 1, C.ink, 1.4), path('M60 6 L64 18 L56 18 Z', PATINA, C.ink, 1.2), ...tup([[40, 60], [70, 52], [80, 64]]).map(([x, y]) => ellipse(x, y, 4, 2.4, COPPER, null))),
    ...tup([[12, 30], [104, 22], [16, 50]]).map(([x, y]) => drop(x, y, 0.9)), ground()),
  'matr.zink': all(path('M30 52 L90 52 L82 106 L38 106 Z', ZINC, C.ink, 1.8), path('M30 52 C30 40 90 40 90 52', 'none', C.dark, 2),
    ...tup([[44, 64], [62, 70], [76, 62], [50, 84], [70, 90], [58, 98], [46, 96], [74, 78]]).map(([x, y], i) => path(`M${x - 5} ${y} L${x} ${y - 4} L${x + 6} ${y - 1} L${x + 2} ${y + 4} Z`, i % 2 ? '#c4ced8' : '#93a2b0', '#7f8d9a', 0.8)),
    ingot(18, 108, ZINC, 0.9), ring(60, 78, 32), ground()),

  // ── 4033 Trä och träprodukter ──
  'matr.bräda': all(path('M18 112 L26 76 L34 112 M86 112 L94 76 L102 112', 'none', C.brown, 3), rect(16, 72, 20, 6, C.tan, 1, C.ink, 1.4), rect(84, 72, 20, 6, C.tan, 1, C.ink, 1.4), board(6, 60, 108, 12), frame(4, 56, 112, 20), ground()),
  'matr.lövträ': all(leafTree(60, 64, 1.2), board(14, 74, 92, 16, DARKWOOD, true, '#5e3b1a'), board(20, 92, 80, 14, '#9b6a3a', true, '#6b4321'), frame(10, 70, 100, 40), ground()),
  'matr.barrträ': all(firTree(60, 64, 1.2), board(14, 74, 92, 16, '#f0cf96', true, '#d7a865'), board(20, 92, 80, 14, '#ecc585', true, '#d29e58'), frame(10, 70, 100, 40), ground()),
  'matr.ådring': all(rect(6, 20, 108, 80, '#e2b878', 3, C.ink, 1.8), line(range(9).map((i) => { const y = 28 + i * 8; return `M8 ${y} C30 ${y - 6} 46 ${y + 8} 66 ${y} S100 ${y - 6} 112 ${y}`; }).join(' '), WOOD2, 1.8),
    circle(62, 58, 24, 'rgba(255,255,255,0.25)', null), line(range(5).map((i) => { const y = 42 + i * 8; return `M42 ${y} C52 ${y - 7} 62 ${y + 7} 82 ${y}`; }).join(' '), '#8a5426', 2.6), magnifier(62, 58, 24), ring(62, 58, 28)),
  'matr.kvist.2': all(rect(6, 20, 108, 80, '#ecc890', 3, C.ink, 1.8), line('M8 32 C40 30 80 34 112 32 M8 88 C40 90 80 86 112 88', '#d7aa6c', 1),
    circle(62, 58, 24, 'rgba(255,255,255,0.25)', null), ellipse(62, 58, 10, 8, '#5e3b1a', C.ink, 1.2), ellipse(62, 58, 5, 4, '#3d2510', null), magnifier(62, 58, 24), ring(62, 58, 28)),
  'matr.hyvla': all(board(6, 80, 108, 14, WOOD), rect(6, 94, 108, 18, C.tan, 0, null),
    moving('mhv', '0%{transform:translate(-40px,0)}70%,100%{transform:translate(0,0)}', { dur: 2.6 },
      path('M60 80 L104 80 L100 66 L66 66 Z', '#b5442f', C.ink, 1.6), rect(70, 58, 10, 10, C.brown, 3, C.ink, 1.4), circle(94, 62, 6, C.brown, C.ink, 1.4), path('M62 80 C56 70 46 66 44 74 C42 80 50 82 54 76', 'none', '#f0cf96', 3.4), path('M62 80 C56 70 46 66 44 74 C42 80 50 82 54 76', 'none', C.ink, 0.8)),
    line('M8 82 L54 82', C.white, 1.6), ground()),
  'matr.spånskiva': all(path('M10 40 L90 24 L110 34 L30 50 Z', '#e9cf9c', C.ink, 1.6), path('M10 40 L30 50 L30 66 L10 56 Z', '#d3b177', C.ink, 1.6), path('M30 50 L110 34 L110 50 L30 66 Z', '#dcbd85', C.ink, 1.6),
    ...range(28).map((i) => { const x = 34 + (i * 37) % 72, y = 54 - (x - 30) * 0.2 + ((i * 13) % 9); return path(`M${x} ${f1(y)} l3 -1.5 l1.5 2 l-3 1.5 Z`, i % 3 ? '#a8803f' : '#8a6328', null); }),
    ...range(16).map((i) => { const x = 22 + (i * 23) % 62, y = 30 + ((i * 17) % 16) - (x - 10) * 0.2; return path(`M${x} ${f1(y)} l4 -1 l1 2 l-4 1 Z`, '#c9a463', null); }), frame(26, 30, 90, 40), ground()),
  'matr.limträ': all(rect(0, 0, 120, 112, '#f4ecdf', 0, null), path('M8 112 L8 56 C30 30 90 30 112 56 L112 112', 'none', C.ink, 13), path('M8 112 L8 56 C30 30 90 30 112 56 L112 112', 'none', WOOD, 10.4),
    path('M8 112 L8 56 C30 30 90 30 112 56 L112 112', 'none', WOOD2, 0.9), circle(60, 82, 20, C.white, C.ink, 1.6), ...range(6).map((i) => rect(46, 70 + i * 4, 28, 4, i % 2 ? WOOD : '#e7bd7c', 0, '#8a5a2b', 0.8)), line('M46 70 L74 70 M46 94 L74 94', C.ink, 1.2), ring(60, 82, 22),
    line('M60 60 L60 46', HL, 1.6, '2 2'), ground()),
  'matr.pappersmassa': all(...range(5).map((i) => rect(8 + i * 7, 18 + (i % 2) * 6, 6, 4, WOOD, 1, C.ink, 0.8)), arrow(22, 30, 34, 46, C.ink, 2.2),
    path('M24 52 L80 52 L76 96 L28 96 Z', C.grey, C.ink, 1.8), path('M27 60 L77 60 L74 92 L30 92 Z', '#e8dcc4', null), path('M30 64 C40 60 50 68 60 62 S74 64 76 62', 'none', '#cdbf9e', 1.6), ring(52, 76, 20),
    arrow(82, 74, 94, 74, C.ink, 2.2), rect(96, 60, 18, 26, C.white, 1, C.ink, 1.4), rect(98, 58, 18, 26, C.white, 1, C.ink, 1.4), rect(60, 96, 8, 16, C.grey, 1, C.ink, 1.2), ground()),

  // ── 4034 Keramer och glas ──
  'matr.bränna.2': all(rect(14, 22, 92, 82, '#9c5b3c', 4, C.ink, 1.8), rect(24, 32, 72, 52, '#3a2a22', 3, C.ink, 1.4), rect(24, 32, 72, 52, 'rgba(255,140,40,0.35)', 3, null),
    path('M32 60 L48 60 L46 72 L34 72 Z', '#d9b38c', C.ink, 1.2), path('M56 52 C56 46 70 46 70 52 L68 72 L58 72 Z', '#d9b38c', C.ink, 1.2), path('M76 62 L90 62 L88 72 L78 72 Z', '#d9b38c', C.ink, 1.2), line('M26 72 L94 72', C.dark, 2),
    waPulse('mbr', flame(36, 98, 0.55), flame(60, 98, 0.65), flame(84, 98, 0.55)), rect(100, 34, 8, 40, C.white, 3, C.ink, 1.2), rect(102, 38, 4, 34, C.red, 1, null), ground()),
  'matr.glas': all(rect(0, 0, 120, 112, '#fbf6ea', 0, null), circle(14, 14, 8, C.yellow, C.ink, 1.4), ...[30, 58, 92].map((x) => line(`M20 20 L${x} 100`, 'rgba(242,193,78,0.6)', 3)),
    path('M22 104 L22 60 C22 52 30 50 30 44 L30 30 L38 30 L38 44 C38 50 46 52 46 60 L46 104 Z', GLASS, C.ink, 1.6), path('M54 70 L74 70 L72 104 L56 104 Z', GLASS, C.ink, 1.6), rect(82, 40, 30, 64, GLASS, 1, C.ink, 1.6),
    line('M26 64 L26 96 M58 74 L58 98 M86 46 L86 70', C.white, 2), ellipse(34, 30, 4, 1.2, C.white, C.ink, 1), ground()),
  'matr.keram': all(path('M10 70 L72 46 C80 44 84 50 78 54 L18 78 Z', '#f7f7f4', C.ink, 1.8), path('M10 70 L18 78 L4 84 C0 80 2 74 10 70 Z', C.black, C.ink, 1.4), ring(46, 60, 24),
    rect(70, 76, 40, 8, '#f3f1ec', 2, C.ink, 1.6), flame(82, 104, 0.6), flame(98, 104, 0.6), check(102, 64), ground()),
  'matr.glasblåsare': all(rect(0, 0, 120, 112, '#efe4d6', 0, null), rect(86, 40, 34, 72, '#8c5a3c', 3, C.ink, 1.8), circle(103, 70, 12, HOT, C.ink, 1.4), circle(103, 70, 7, C.yellow, null),
    person(34, C.navy, { l: [10, 6], r: [24, 8] }), line('M44 46 L80 52', C.dark, 2.6), circle(84, 53, 7, GLOW, C.ink, 1.4), circle(84, 53, 3.5, C.yellow, null), ellipse(40, 45, 3, 2, C.skin2, C.ink, 0.8), ground()),
  'matr.härdat-glas': all(rect(14, 16, 64, 82, '#cfe6f5', 1, C.ink, 1.8), line(range(8).map((i) => `M${14 + i * 8} 16 L${18 + i * 8} 98`).join(' ') + ' ' + range(10).map((i) => `M14 ${16 + i * 8} L78 ${19 + i * 8}`).join(' '), '#7fa9c2', 1),
    ...tup([[30, 104], [40, 108], [52, 105], [62, 108], [46, 101]]).map(([x, y]) => rect(x - 2.5, y - 2.5, 5, 5, '#cfe6f5', 1, C.ink, 0.8)), frame(10, 12, 72, 90),
    greyed(path('M92 98 L100 60 L106 72 L114 66 L108 98 Z', '#cfe6f5', C.ink, 1.4)), ground()),
  'matr.splittras': all(rect(30, 104, 60, 6, C.tan, 1, null), ...tup([[-34, -22, 0], [-20, -34, 30], [0, -40, 60], [22, -34, 100], [34, -20, 150], [-40, -6, 200], [40, -4, 250], [-14, -16, 300], [14, -18, 340]]).map(([dx, dy, r], i) =>
    moving(`msp${i}`, `0%,20%{transform:translate(${-dx}px,${-dy}px);opacity:0}25%{opacity:1}70%,100%{transform:translate(0,0);opacity:1}`, { dur: 2.4 }, g(`translate(${60 + dx} ${96 + dy}) rotate(${r})`, path('M-5 4 L0 -6 L6 3 Z', '#cfe6f5', C.ink, 1)))),
    line('M50 104 L46 98 M70 104 L74 98 M60 104 L60 96', C.gold, 1.6), path('M52 104 L56 100 L60 104 L64 99 L68 104 Z', '#cfe6f5', C.ink, 1), ground()),
  'matr.eldfast': all(rect(10, 22, 100, 86, C.white, 4, C.ink, 1.8), rect(18, 34, 84, 60, '#3d3f4a', 3, C.ink, 1.4), rect(18, 34, 84, 60, 'rgba(255,140,40,0.3)', 3, null), line('M24 40 L96 40', GLOW, 3), line('M24 88 L96 88', GLOW, 3),
    path('M32 62 L88 62 L84 80 L36 80 Z', GLASS, C.ink, 1.6), path('M35 64 L85 64 L83 72 L37 72 Z', '#f2c86c', null), ...tup([[44, 66], [56, 68], [70, 66], [78, 68]]).map(([x, y]) => circle(x, y, 2.2, '#c98a2b', null)), ring(60, 70, 30), circle(96, 28, 3, C.dark, null), ground()),

  // ── 4035 Kompositmaterial ──
  'matr.kompositmaterial': all(line(range(6).map((i) => `M${10 + i * 5} 20 L${10 + i * 5} 50`).join(' '), C.dark, 2), path('M76 24 C76 18 96 18 96 24 L96 46 C96 52 76 52 76 46 Z', '#e8b04a', C.ink, 1.6),
    line('M58 30 L58 42 M52 36 L64 36', C.ink, 3), arrow(60, 56, 60, 68, C.ink, 2.6),
    rect(16, 74, 88, 20, '#e8b04a', 2, C.ink, 1.8), line(range(10).map((i) => `M${22 + i * 8} 76 L${22 + i * 8} 92`).join(' '), C.dark, 2), rect(46, 62, 28, 12, C.dark, 2, C.ink, 1.4), check(108, 70), frame(12, 70, 96, 28), ground(108)),
  'matr.kolfiber': all(rect(10, 16, 56, 56, '#2b2b30', 3, C.ink, 1.8), ...range(7).flatMap((r) => range(7).map((c) => rect(13 + c * 7.6, 19 + r * 7.6, 6.4, 6.4, (r + c) % 2 ? '#45454d' : '#1e1e22', 0.6, null))), line('M14 22 L30 18', C.white, 1.4), frame(6, 12, 64, 64),
    path('M70 104 L84 74 L108 74 L96 104 Z M84 74 L76 60', 'none', '#2b2b30', 5), circle(70, 104, 1, C.ink, null), ground()),
  'matr.glasfiber': all(rect(0, 0, 120, 70, '#e6f2f8', 0, null), rect(0, 70, 120, 42, WATER, 0, null), path('M10 60 L110 60 L96 84 L24 84 Z', C.white, C.ink, 1.8), line('M30 52 L30 60 M30 52 L60 52', C.ink, 1.6),
    circle(66, 72, 16, '#f6f6ef', C.ink, 1.6), line(range(6).map((i) => `M${54 + i * 4} 60 L${56 + i * 4} 84`).join(' ') + ' M52 66 L80 68 M52 74 L80 76', '#a9c6d4', 1.4), ring(66, 72, 18), line('M4 92 C20 88 30 96 50 92 S90 88 116 94', C.white, 1.4)),
  'matr.harts': all(rect(10, 84, 100, 12, '#f6f3e8', 1, C.ink, 1.6), line(range(12).map((i) => `M${14 + i * 8} 85 L${14 + i * 8} 95`).join(' '), '#c7c2b0', 1.4), path('M40 84 C40 78 80 78 80 84 L80 90 L40 90 Z', 'rgba(232,176,74,0.8)', C.ink, 1.2),
    g('translate(78 40) rotate(-40)', rect(-10, -16, 20, 30, '#e8b04a', 3, C.ink, 1.6), rect(-4, -24, 8, 8, C.dark, 1, C.ink, 1.2)), path('M62 38 C58 50 60 64 60 78', 'none', '#d99a2b', 3.4), ring(60, 82, 16), ground()),
  'matr.betong': all(rect(10, 52, 56, 56, CONCRETE, 2, C.ink, 1.8), ...tup([[18, 60], [34, 66], [50, 58], [22, 80], [44, 84], [58, 76], [30, 96], [52, 100], [16, 100]]).map(([x, y], i) => ellipse(x, y, 3 + (i % 2), 2.2, i % 3 ? '#8f8f87' : '#c9c6bb', C.ink, 0.6)), frame(6, 48, 64, 64),
    path('M74 76 L112 76 L104 94 L80 94 Z', C.green, C.ink, 1.6), path('M76 76 C84 70 102 70 110 76 Z', '#9a9a92', C.ink, 1.2), circle(84, 102, 7, C.dark, C.ink, 1.4), line('M110 78 L118 70', C.dark, 3), ground()),
  'matr.cement': all(path('M20 108 L20 48 L30 40 L72 40 L82 48 L82 108 Z', '#efe3c8', C.ink, 1.8), path('M30 40 L36 30 L66 30 L72 40', 'none', C.ink, 1.6), rect(34, 62, 34, 22, '#d1c39f', 2, null), path('M72 56 C84 60 92 72 96 84', 'none', C.grey, 6),
    path('M76 108 C80 92 92 84 100 84 C108 84 116 96 118 108 Z', '#a9a9a3', C.ink, 1.4), waGrow('mce', circle(92, 80, 6, 'rgba(200,200,200,0.7)', null), circle(102, 76, 5, 'rgba(210,210,210,0.7)', null)), ring(98, 96, 18), ground()),
  'matr.armering': all(path('M8 104 L20 84 L112 84 L100 104 Z', '#d7c4a2', C.ink, 1.6), ...range(6).map((i) => line(`M${24 + i * 15} 88 L${12 + i * 15} 102`, C.ink, 3.4)), ...range(3).map((i) => line(`M${18 - i * 3} ${90 + i * 5} L${108 - i * 3} ${90 + i * 5}`, C.ink, 3.4)),
    ...range(6).map((i) => line(`M${24 + i * 15} 88 L${12 + i * 15} 102`, '#8a4b2b', 2, '2 1.5')), ...range(3).map((i) => line(`M${18 - i * 3} ${90 + i * 5} L${108 - i * 3} ${90 + i * 5}`, '#8a4b2b', 2, '2 1.5')),
    g('translate(64 40) rotate(-20)', rect(-40, -3, 80, 6, '#8a4b2b', 2, C.ink, 1.4), line(range(16).map((i) => `M${-38 + i * 5} -3 l2 6`).join(' '), '#5e3018', 1)), ring(64, 40, 22), ground()),
  'matr.gipsskiva': all(wall('#eef0f2'), ...[16, 44, 72].map((x) => rect(x, 20, 8, 92, WOOD, 1, C.ink, 1.4)), g('translate(64 66) rotate(8)', rect(0, -46, 44, 92, '#f1f1ee', 1, C.ink, 1.6)),
    circle(96, 30, 18, C.white, C.ink, 1.6), rect(84, 22, 24, 4, '#e9dcc0', 0, C.ink, 0.8), rect(84, 26, 24, 8, C.white, 0, '#c9c9c4', 0.8), rect(84, 34, 24, 4, '#e9dcc0', 0, C.ink, 0.8), ring(96, 30, 20), ground()),

  // ── 4036 Korrosion och slitage ──
  'matr.korrosion': all(
    // common threat: a rain cloud with salt, arrows to all three metals
    path('M30 26 C24 26 24 16 32 16 C34 8 46 6 50 13 C54 6 68 8 68 16 C76 16 76 26 70 26 Z', C.grey2, C.ink, 1.4),
    ...tup([[34, 34], [46, 38], [58, 34], [66, 39]]).map(([x, y]) => drop(x, y, 0.8)), ...tup([[40, 33], [53, 39], [62, 32]]).map(([x, y]) => rect(x - 1.6, y - 1.6, 3.2, 3.2, C.white, 0.5, C.ink, 0.7)),
    arrow(36, 44, 20, 60, C.dark, 2.2), arrow(48, 44, 48, 60, C.dark, 2.2), arrow(60, 44, 76, 60, C.dark, 2.2),
    // iron: red-brown rust
    rect(9, 66, 22, 38, STEEL, 2, C.ink, 1.4), ...tup([[15, 72, 3], [24, 80, 3.5], [14, 90, 2.5], [25, 97, 2.5]]).map(([x, y, r]) => ellipse(x, y, r, r * 0.7, '#b2582a', C.ink, 0.6)),
    // copper: green patina
    rect(37, 66, 22, 38, COPPER, 2, C.ink, 1.4), path('M37 68 C42 66 54 66 59 68 L59 80 C54 84 46 76 37 82 Z', PATINA, C.ink, 0.8), ...tup([[42, 92, 2.6], [53, 97, 2.2]]).map(([x, y, r]) => ellipse(x, y, r, r * 0.7, PATINA, C.ink, 0.6)),
    // aluminium / zinc: white powdery coating
    rect(65, 66, 22, 38, ALU, 2, C.ink, 1.4), ...tup([[70, 72], [79, 76], [73, 84], [82, 88], [69, 95], [78, 99], [84, 70]]).map(([x, y]) => circle(x, y, 2, C.white, C.grey, 0.9)),
    frame(4, 58, 88, 50),
    // grey healthy metal as the contrast (outside the group)
    greyed(rect(97, 72, 18, 32, '#c9ced4', 2, C.ink, 1.4), line('M100 78 L104 74', C.white, 1.6)), ground()),
  'matr.vägsalt': all(rect(0, 0, 120, 70, '#dfe8f0', 0, null), rect(0, 70, 120, 42, '#f4f7fa', 0, null), line('M0 92 L120 92', '#c5ced6', 2, '8 6'), truck(70, 96, C.orange),
    path('M40 88 L10 74 L10 104 Z', 'rgba(255,255,255,0.6)', C.grey2, 1), waIn('mvs', 20, -4, ...range(16).map((i) => circle(f1(12 + (i * 17) % 28), f1(78 + (i * 11) % 24), 2.2, C.white, C.ink, 0.9))), ring(24, 89, 18), ...tup([[100, 20], [20, 28], [60, 14]]).map(([x, y]) => circle(x, y, 2, C.white, null))),
  'matr.rostskydd': all(wall('#eef1f4'), car(60, 62, C.sky), rect(20, 64, 6, 48, C.grey, 1, C.ink, 1.2), rect(94, 64, 6, 48, C.grey, 1, C.ink, 1.2), rect(14, 62, 92, 4, C.dark, 1, C.ink, 1.2),
    g('translate(52 98) rotate(-30)', rect(-6, -12, 12, 22, C.red, 3, C.ink, 1.4), rect(-3, -18, 6, 6, C.dark, 1, C.ink, 1)), path('M58 84 L44 66 L72 66 Z', 'rgba(60,60,70,0.4)', null), rect(30, 62, 60, 4, C.black, 1, null), frame(26, 58, 68, 12), ground()),
  'matr.förzinka': all(rect(18, 74, 84, 36, C.dark, 3, C.ink, 1.8), rect(22, 78, 76, 10, ZINC, 1, null), line('M24 82 Q40 79 56 82 T96 82', C.white, 1.2), heatLines(),
    moving('mfz', '0%{transform:translate(0,-34px)}60%,100%{transform:translate(0,0)}', { dur: 3 }, line('M60 0 L60 40 M40 40 L60 30 L80 40', C.dark, 1.6), rect(36, 40, 48, 40, ZINC, 1, C.ink, 1.6), ...range(6).map((i) => path(`M${42 + (i * 13) % 36} ${50 + (i * 7) % 24} l4 -2 l3 3 l-4 2 Z`, '#c4ced8', null))),
    ground()),
  'matr.slita': all(rect(0, 100, 120, 12, '#b9b2a6', 0, null), ...range(10).map((i) => circle(8 + i * 12, 104 + (i % 2) * 3, 1.4, '#7d776c', null)),
    moving('msl', '0%,100%{transform:translate(-8px,0)}50%{transform:translate(8px,0)}', { dur: 1.2 }, shoe(60, 100, true)), path('M34 99 L40 99 M80 99 L86 99', 'none', C.grey, 2), frame(28, 92, 66, 12),
    greyed(g('translate(84 24) scale(0.55)', shoe(0, 30, false))), arrow(60, 40, 60, 60, C.ink, 2)),
  'matr.utmattning.2': all(rect(20, 82, 50, 26, C.dark, 2, C.ink, 1.6), rect(26, 72, 38, 12, C.grey, 1, C.ink, 1.4),
    waSway('mut', 18, g('translate(0 0)', rect(42, 26, 6, 48, STEEL, 1, C.ink, 1.4))), path('M42 68 L45 66 L43 64 L46 62', 'none', C.red, 2.2), ring(45, 66, 10),
    path('M26 24 C34 12 56 12 64 24', 'none', HL, 2.4), path('M26 24 L26 16 L33 20 Z M64 24 L57 20 L64 16 Z', HL, null), T(96, 40, '1000', 12), T(96, 54, '×', 12), ground()),

  // ── 4037 Materialprovning ──
  'matr.materialprovning': all(wall('#eef3f7'), rect(4, 80, 112, 6, C.grey, 1, C.ink, 1.4), rect(10, 86, 6, 26, C.grey, 0, C.ink, 1), rect(104, 86, 6, 26, C.grey, 0, C.ink, 1),
    rect(14, 14, 40, 66, '#d9dee4', 2, C.ink, 1.6), rect(20, 22, 28, 8, C.dark, 1, C.ink, 1.2), rect(20, 62, 28, 8, C.dark, 1, C.ink, 1.2), testBar(34, 46, 28, STEEL), line('M16 14 L16 80 M52 14 L52 80', C.dark, 3),
    rect(64, 30, 46, 34, C.white, 2, C.ink, 1.6), line('M70 58 L70 36 M70 58 L104 58', C.ink, 1.4), path('M70 58 C76 40 86 38 96 40 L100 50', 'none', C.red, 2), ...[70, 80, 90].map((x) => testBar(x, 72, 14, STEEL)), frame(8, 10, 106, 74)),
  'matr.provbit': all(rect(10, 86, 100, 10, C.white, 2, C.ink, 1.6), testBar(30, 62, 44, STEEL), testBar(60, 62, 44, STEEL), testBar(90, 62, 44, '#c9c9bf'),
    rect(50, 36, 20, 10, C.yellow, 1, C.ink, 1), line('M54 41 L66 41', C.ink, 1.4), ring(60, 62, 28), ground()),
  'matr.hållfasthet': all(rect(8, 82, 18, 30, C.grey, 1, C.ink, 1.6), rect(94, 82, 18, 30, C.grey, 1, C.ink, 1.6), path('M10 80 L110 80 Q60 88 10 80 Z', STEEL2, C.ink, 1.6), path('M10 76 L110 76 L110 80 Q60 88 10 80 Z', STEEL, C.ink, 1.6),
    rect(42, 44, 36, 32, C.dark, 3, C.ink, 1.6), path('M54 44 C54 34 66 34 66 44', 'none', C.dark, 3), arrow(60, 14, 60, 34, HL, 3), arrow(40, 18, 46, 34, HL, 3), arrow(80, 18, 74, 34, HL, 3), check(100, 54), frame(4, 40, 112, 50)),
  'matr.dragprov': all(rect(18, 6, 84, 10, C.dark, 2, C.ink, 1.6), rect(18, 104, 84, 8, C.dark, 2, C.ink, 1.6), line('M24 16 L24 104 M96 16 L96 104', C.grey, 5), line('M24 16 L24 104 M96 16 L96 104', C.ink, 0.6),
    moving('mdp', '0%{transform:translate(0,8px)}70%,100%{transform:translate(0,0)}', { dur: 2.8 }, rect(46, 16, 28, 16, STEEL2, 2, C.ink, 1.4), testBar(60, 46, 32, STEEL, 0)), rect(46, 80, 28, 16, STEEL2, 2, C.ink, 1.4), testBar(60, 76, 30, STEEL, 0),
    arrow(86, 46, 86, 26, HL, 3), arrow(86, 74, 86, 94, HL, 3), line('M56 62 L64 62', C.red, 2), line('M56 61 L52 58 M64 61 L68 58', C.gold, 1.4)),
  'matr.tåla.3': all(rect(0, 0, 120, 70, '#e6eef5', 0, null), rect(0, 90, 120, 22, WATER, 0, null), rect(14, 72, 12, 40, CONCRETE, 1, C.ink, 1.4), rect(94, 72, 12, 40, CONCRETE, 1, C.ink, 1.4), rect(4, 66, 112, 8, STEEL, 1, C.ink, 1.6),
    waIn('mtl', -60, 0, truck(64, 66, C.orange)), check(104, 30), frame(2, 62, 116, 16)),
  'matr.brott.2': all(rect(0, 0, 120, 112, '#f2eee6', 0, null), path('M6 50 L52 50 L56 46 L50 58 L56 64 L52 70 L6 70 Z', STEEL, C.ink, 1.6), path('M114 50 L68 50 L72 56 L64 60 L70 66 L66 70 L114 70 Z', STEEL, C.ink, 1.6),
    ...tup([[60, 40, 20], [62, 80, 70], [58, 30, 140]]).map(([x, y, r]) => g(`translate(${x} ${y}) rotate(${r})`, path('M-3 2 L0 -4 L4 1 Z', STEEL2, C.ink, 0.8))), line('M60 44 L60 36 M54 76 L50 84 M66 76 L70 84', C.gold, 1.6), ring(60, 60, 20), ground()),
  'matr.standard.2': all(rect(8, 18, 104, 20, C.white, 3, C.ink, 1.6), ...[30, 60, 90].map((x) => path(`M${x - 8} 24 L${x + 8} 24 L${x + 8} 28 L${x + 3} 28 L${x + 3} 34 L${x - 3} 34 L${x - 3} 28 L${x - 8} 28 Z`, 'none', C.ink, 1.2, )),
    ...[[30, C.red], [60, C.navy], [90, C.green]].map(([x, col]) => all(path(`M${(x as number) - 8} 60 L${(x as number) + 8} 60 L${(x as number) + 8} 64 L${(x as number) + 3} 64 L${(x as number) + 3} 84 L${(x as number) - 3} 84 L${(x as number) - 3} 64 L${(x as number) - 8} 64 Z`, col as string, C.ink, 1.4), check(x as number, 100, 0.8))),
    ...[30, 60, 90].map((x) => line(`M${x} 40 L${x} 54`, HL, 1.6, '2 2')), frame(4, 14, 112, 28)),
  'matr.certifierad': all(rect(0, 0, 120, 112, '#efe8dc', 0, null), person(36, '#2f4a7a', { r: [26, 2], l: [-12, 22] }), path('M24 40 L48 40 L48 54 L24 54 Z', C.dark, C.ink, 1.4), rect(28, 44, 16, 4, '#5b7a3a', 1, null), certificate(78, 52, 1.2), ring(78, 52, 38), ground()),
};

/** Heat shimmer above a molten bath. */
function heatLines(): Svg {
  return line('M30 70 c-3 -4 3 -6 0 -10 M50 70 c-3 -4 3 -6 0 -10 M70 70 c-3 -4 3 -6 0 -10 M90 70 c-3 -4 3 -6 0 -10', C.red, 1.4);
}
