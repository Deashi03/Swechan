/**
 * Teknik & digital värld → Maskiner & tillverkning → Produktionsmetoder, 4041–4047 (0.58): casting, forging and
 * rolling, milling and turning, injection moulding, 3D printing, assembly and quality control.
 * Recurring signs: the thing the word names is outlined in orange (ring, frame or arrow) and grey parts show what
 * the word is not. Molten or glowing metal is orange-yellow, plastic is green or blue, steel is light grey.
 * Words that are easy to mix up get clearly different scenes: gjutning (glowing metal poured into a sand mould)
 * and hälla (water poured from a jug into a glass in a kitchen); smältugn (a big furnace with three electrodes),
 * degel (a small cup held by tongs) and slagg (a rake skimming the grey crust off the metal); smidning (a hammer
 * striking a glowing bar on an anvil) and ässja (the coal hearth with its hood, no hammer); valsa (close-up: a slab
 * squeezed thin between two turning rollers) and valsverk (a whole hall seen from outside the line, a long strip and
 * a coil); stång (round rods) and göt (stacked blocks); fräsa (a vertical cutter
 * above a flat block that moves) and svarva (a horizontal round bar that turns, the tool slides along it);
 * formsprutning (a machine with a hopper and a screw pushing green plastic into a mould) and hålrum (the empty space
 * inside a cut mould); 3D-skrivare (the whole machine), 3D-utskrift (close-up: layers appear one by one) and
 * byggplatta (a bent plate that releases a print); montering (a factory: a door slides onto a car body) and sätta
 * ihop (two hands push two wooden parts together at home); kvalitetskontroll (a person sorting parts at a belt) and
 * inspektera (a magnifier sweeping over one part); defekt (a crack) and felfri (sparkles and a tick).
 * Digits and the code signs { } only; no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waBob, waGrow, waIn, waPulse, waSpin, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const MOLTEN = '#ff9a1f';
const GLOW = '#ffd23f';
const STEEL = '#b8c0c8';
const SAND = '#cfa86a';
const BRICK = '#b5543a';
const PLASTIC = '#4fae5f';
const PLASTIC2 = '#3f7fc8';
const CARD = '#d6a96b';
const WATER = '#8cc7e8';
const P2 = (a: [number, number][]) => a;
const P3 = (a: [number, number, number][]) => a;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const f1 = (n: number) => +n.toFixed(1);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 5, col, 2.6);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const wall = (col = '#efe8dc') => rect(0, 0, 120, 112, col, 0, null);
const floor = (col = '#d8d2c6') => rect(0, 100, 120, 20, col, 0, null);
const tick = (x: number, y: number, s = 1, col: string = C.green) => g(`translate(${x} ${y}) scale(${s})`, line('M-6 0 L-2 5 L7 -6', col, 3.4));
const cross = (x: number, y: number, s = 6, col: string = C.red) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 3);
const heat = (x: number, y: number, n = 3, col: string = C.red, gap = 8) => line(range(n).map((i) => `M${x + i * gap} ${y} c-3 -4 3 -6 0 -10 c-3 -4 3 -6 0 -10`).join(' '), col, 1.8);
const spark = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 -6 L0 6 M-6 0 L6 0 M-4 -4 L4 4 M4 -4 L-4 4', GLOW, 1.8));
const flame = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 0 C-8 -4 -6 -14 0 -20 C2 -12 8 -12 6 -4 C5 -1 3 0 0 0 Z', C.orange, C.ink, 1), path('M0 -2 C-3 -4 -3 -9 0 -12 C1 -8 4 -7 2 -3 Z', C.yellow, null));
const warn = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -12 L12 9 L-12 9 Z', C.yellow, C.ink, 1.6), line('M0 -5 L0 2', C.ink, 2.4), circle(0, 5.5, 1.3, C.ink, null));
const sparkle = (x: number, y: number, r = 5, col: string = C.gold) => path(`M${x} ${y - r} L${x + r * 0.25} ${y - r * 0.25} L${x + r} ${y} L${x + r * 0.25} ${y + r * 0.25} L${x} ${y + r} L${x - r * 0.25} ${y + r * 0.25} L${x - r} ${y} L${x - r * 0.25} ${y - r * 0.25} Z`, col, null);
/** Palm seen from the side (no pointing finger), wrist at (x, y). */
const palm = (x: number, y: number, rot = 0, sleeve: string = C.navy) => g(`translate(${x} ${y}) rotate(${rot})`, path('M0 0 L14 -2 C20 -3 26 -2 30 0 C32 2 30 5 26 5 L20 5 C22 7 21 10 18 10 L4 10 C0 10 -2 6 0 0 Z', C.skin, C.ink, 1.4), rect(-12, -1, 14, 11, sleeve, 2, C.ink, 1.4));
/** Standing person, feet at (x, 112); arms from the shoulders to (lx, ly) and (rx, ry) relative to the neck. */
const person = (x: number, top: string, o: { s?: number; l?: [number, number]; r?: [number, number]; hat?: string; hair?: string; y?: number; glasses?: boolean; legs?: string } = {}) => {
  const s = o.s ?? 1, [lx, ly] = o.l ?? [-12, 22], [rx, ry] = o.r ?? [12, 22];
  return g(`translate(${x} ${o.y ?? 112}) scale(${s})`, line('M-5 0 L-4 -26 M5 0 L4 -26', o.legs ?? C.navy, 7), rect(-11, -56, 22, 32, top, 6, C.ink, 1.6),
    line(`M-9 -52 L${lx} ${-56 + ly}`, C.ink, 6.4), line(`M-9 -52 L${lx} ${-56 + ly}`, top, 4.4), circle(lx, -56 + ly, 3.2, C.skin, C.ink, 1.2),
    line(`M9 -52 L${rx} ${-56 + ry}`, C.ink, 6.4), line(`M9 -52 L${rx} ${-56 + ry}`, top, 4.4), circle(rx, -56 + ry, 3.2, C.skin, C.ink, 1.2),
    circle(0, -67, 10, C.skin, C.ink, 1.6), o.hat ? path('M-12 -70 C-12 -84 12 -84 12 -70 L14 -69 L-14 -69 Z', o.hat, C.ink, 1.6) : path('M-10 -68 C-10 -81 10 -81 10 -68 C6 -73 -6 -73 -10 -68 Z', o.hair ?? C.hair, null),
    o.glasses ? all(rect(-8, -69, 16, 6, 'rgba(191,227,245,0.8)', 2, C.ink, 1.2)) : all(circle(-3.5, -66, 1.2, C.ink, null), circle(3.5, -66, 1.2, C.ink, null)), path('M-3 -61 C-1 -59 1 -59 3 -61', 'none', C.ink, 1.2));
};
/** Tilted ladle/crucible with molten metal, lip at (x, y). */
const ladle = (x: number, y: number, deg = 0, s = 1) => g(`translate(${x} ${y}) rotate(${deg}) scale(${s})`, path('M-26 -18 L4 -18 L0 6 C-2 10 -22 10 -24 6 Z', C.dark, C.ink, 1.8), path('M-24 -15 L2 -15 L1 -10 L-24 -10 Z', MOLTEN, null), line('M-26 -18 L-40 -26', C.dark, 4));
/** Sand mould seen in section: box from x to x+w, top y, cavity drawn by `cav` (filled with `fill`). */
const sandBox = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, SAND, 2, C.ink, 1.8), ...range(10).map((i) => circle(x + 6 + ((i * 37) % (w - 10)), y + 6 + ((i * 23) % (h - 10)), 0.9, '#a0804a', null)));
/** Anvil, top surface at y. */
const anvil = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-26 0 L22 0 L22 8 L10 10 L8 22 L18 30 L-18 30 L-8 22 L-10 10 L-20 8 C-30 6 -36 2 -36 0 Z', '#5a5f6a', C.ink, 1.8), line('M-24 3 L20 3', '#7d838e', 1.2));
/** Hammer, head at (x, y), handle going down-right. */
const hammer = (x: number, y: number, deg = 0) => g(`translate(${x} ${y}) rotate(${deg})`, rect(-2, 0, 4, 34, C.brown, 2, C.ink, 1.4), rect(-10, -7, 20, 10, '#6b7079', 2, C.ink, 1.6));
/** Steel roller seen from the side (a circle with an axle). */
const roller = (x: number, y: number, r: number) => all(circle(x, y, r, STEEL, C.ink, 1.8), circle(x, y, r * 0.25, C.dark, C.ink, 1.2), line(`M${x - r * 0.6} ${y - r * 0.5} L${x - r * 0.3} ${y - r * 0.7}`, C.white, 1.6));
/** Round rod lying horizontally from x1 to x2 at y. */
const rod = (x1: number, x2: number, y: number, r = 4, col: string = STEEL) => all(rect(x1, y - r, x2 - x1, 2 * r, col, 1, C.ink, 1.4), ellipse(x2, y, r * 0.55, r, '#d9dee3', C.ink, 1.2), line(`M${x1 + 2} ${y - r * 0.4} L${x2 - 2} ${y - r * 0.4}`, C.white, 1));
/** Ingot (trapezoid block) with top face. */
const ingot = (x: number, y: number, col: string = STEEL) => all(path(`M${x - 16} ${y} L${x + 16} ${y} L${x + 12} ${y - 10} L${x - 12} ${y - 10} Z`, col, C.ink, 1.4), path(`M${x - 12} ${y - 10} L${x + 12} ${y - 10} L${x + 8} ${y - 14} L${x - 8} ${y - 14} Z`, '#dde2e6', C.ink, 1.2));
/** Bench vice holding a block. */
const vice = (x: number, y: number) => all(rect(x - 26, y, 52, 8, '#5b6b8a', 2, C.ink, 1.6), rect(x - 26, y - 18, 10, 18, '#5b6b8a', 2, C.ink, 1.6), rect(x + 16, y - 18, 10, 18, '#5b6b8a', 2, C.ink, 1.6), rect(x + 26, y - 12, 14, 4, C.silver, 1, C.ink, 1.2), circle(x + 41, y - 10, 3, C.dark, null));
/** Milling cutter (vertical end mill) at (x, y = tip). */
const endMill = (x: number, y: number) => all(rect(x - 6, y - 40, 12, 22, C.silver, 2, C.ink, 1.4), rect(x - 5, y - 18, 10, 18, '#9aa3ad', 1, C.ink, 1.4), line(`M${x - 5} ${y - 14} L${x + 5} ${y - 18} M${x - 5} ${y - 8} L${x + 5} ${y - 12} M${x - 5} ${y - 2} L${x + 5} ${y - 6}`, C.ink, 1.2));
/** Curly metal chip. */
const chip = (x: number, y: number, s = 1, col: string = '#c9a24a') => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 C4 -6 10 -2 8 3 C6 8 0 6 1 1 C2 -3 6 -2 5 1', col, 1.8));
/** Injection mould halves in section with an open cavity; `fill` colours the cavity. */
const mould = (x: number, y: number, fill: string = 'none') => all(rect(x, y, 22, 40, '#8f99a3', 2, C.ink, 1.6), rect(x + 22, y, 22, 40, '#a7b0b9', 2, C.ink, 1.6),
  path(`M${x + 14} ${y + 10} L${x + 30} ${y + 10} L${x + 30} ${y + 30} L${x + 14} ${y + 30} L${x + 14} ${y + 26} L${x + 26} ${y + 26} L${x + 26} ${y + 14} L${x + 14} ${y + 14} Z`, fill === 'none' ? '#f4f1ea' : fill, C.ink, 1.2));
/** Toy brick seen at an angle. */
const brick = (x: number, y: number, w: number, col: string) => all(rect(x, y, w, 10, col, 1, C.ink, 1.4), ...range(Math.round(w / 8)).map((i) => rect(x + 2 + i * 8, y - 3, 5, 3, col, 1, C.ink, 1)));
/** Bookshelf (front). */
const shelf = (x: number, y: number, col: string = '#e9d3a9') => all(rect(x, y, 34, 50, col, 1, C.ink, 1.6), line(`M${x} ${y + 17} L${x + 34} ${y + 17} M${x} ${y + 33} L${x + 34} ${y + 33}`, C.ink, 1.6),
  rect(x + 4, y + 5, 4, 12, C.red, 0, C.ink, 0.8), rect(x + 9, y + 7, 4, 10, PLASTIC2, 0, C.ink, 0.8), rect(x + 6, y + 22, 4, 11, C.green, 0, C.ink, 0.8));
/** Cardboard box (front + top) */
const cardbox = (x: number, y: number, w: number, h: number, d = 6) => all(rect(x, y, w, h, CARD, 1, C.ink, 1.6), path(`M${x} ${y} L${x + d} ${y - d} L${x + w + d} ${y - d} L${x + w} ${y} Z`, '#e4bd84', C.ink, 1.4), path(`M${x + w} ${y} L${x + w + d} ${y - d} L${x + w + d} ${y + h - d} L${x + w} ${y + h} Z`, '#c2915a', C.ink, 1.4));
/** Small factory with a chimney. */
const factory = (x: number, y: number, s = 1, col: string = '#d9cbb3') => g(`translate(${x} ${y}) scale(${s})`, path('M0 0 L0 -18 L10 -26 L10 -18 L20 -26 L20 -18 L30 -26 L30 0 Z', col, C.ink, 1.4), rect(22, -38, 5, 14, C.grey, 0, C.ink, 1.2), rect(4, -10, 6, 10, C.dark, 0, null));
/** House outline. */
const houseS = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(0, -18, 26, 18, '#f3e3c3', 1, C.ink, 1.4), path('M-3 -17 L13 -30 L29 -17 Z', C.red, C.ink, 1.4), rect(10, -10, 6, 10, C.brown, 0, null));
/** Kettle. */
const kettle = (x: number, y: number, col: string = C.white) => g(`translate(${x} ${y})`, path('M-10 0 L-8 -16 C-6 -20 6 -20 8 -16 L10 0 Z', col, C.ink, 1.4), line('M8 -12 L14 -16', C.ink, 2), path('M-8 -16 C-14 -14 -14 -4 -9 -3', 'none', C.ink, 1.6), rect(-12, 0, 24, 3, C.dark, 1, null));
/** Spool of filament. */
const spool = (x: number, y: number, r: number, col: string) => all(circle(x, y, r, '#3d3f4a', C.ink, 1.6), circle(x, y, r * 0.8, col, C.ink, 1.2), ...range(3).map((i) => circle(x, y, r * (0.75 - i * 0.12), 'none', 'rgba(0,0,0,0.25)', 0.8)), circle(x, y, r * 0.3, '#eee', C.ink, 1.2), circle(x, y, r * 0.12, C.dark, null));
/** 3D printer frame (front), base at y=104. */
const printer = (x: number, w: number, top: number, objH = 14, col: string = PLASTIC) => all(rect(x, top, 6, 104 - top, C.dark, 1, C.ink, 1.4), rect(x + w - 6, top, 6, 104 - top, C.dark, 1, C.ink, 1.4), rect(x - 4, 100, w + 8, 8, C.dark, 2, C.ink, 1.6),
  rect(x + 6, top + 18, w - 12, 4, C.silver, 1, C.ink, 1.2), rect(x + w / 2 - 7, top + 14, 14, 12, C.grey, 2, C.ink, 1.4), path(`M${x + w / 2 - 3} ${top + 26} L${x + w / 2 + 3} ${top + 26} L${x + w / 2} ${top + 31} Z`, C.dark, null),
  rect(x + 10, 94, w - 20, 5, '#e0e4e8', 1, C.ink, 1.2), rect(x + w / 2 - 8, 94 - objH, 16, objH, col, 1, C.ink, 1.2), rect(x, top - 4, w, 5, C.dark, 1, C.ink, 1.4));

export const PRODM_MOTIFS: Record<string, Svg> = {
  // ── 4041 Gjutning ──
  'prodm.gjutning': all(wall('#ece4d6'), floor(), sandBox(40, 62, 66, 44), path('M60 62 L66 62 L64 72 L62 72 Z', '#f4f1ea', C.ink, 1),
    path('M58 80 L90 80 L90 96 L58 96 Z', '#3d2f22', C.ink, 1.2), waGrow('pgjf', path('M58 80 L90 80 L90 96 L58 96 Z', MOLTEN, C.ink, 1.2), path('M62 72 L64 72 L64 80 L62 80 Z', MOLTEN, null)),
    ladle(54, 30, 32), moving('pgjs', '0%,100%{opacity:1}50%{opacity:.55}', { dur: 0.8 }, path('M52 34 C58 40 62 48 63 62 L65 62 C64 48 60 38 55 32 Z', GLOW, C.orange, 1)), heat(70, 50, 3, C.orange), frame(36, 58, 74, 52)),
  'prodm.hälla': all(wall('#f3efe6'), rect(6, 86, 108, 6, C.tan, 2, C.ink, 1.6), line('M14 92 L14 112 M106 92 L106 112', C.brown, 3),
    path('M78 60 L104 60 L102 86 L80 86 Z', 'rgba(191,227,245,0.5)', C.ink, 1.6), waGrow('phal', path('M80 74 L102 74 L102 86 L80 86 Z', WATER, null)),
    g('translate(46 34) rotate(-38)', path('M-14 -16 L14 -16 L12 20 L-12 20 Z', C.white, C.ink, 1.8), path('M14 -16 L22 -20 L16 -10', C.white, C.ink, 1.6), path('M-14 -8 C-26 -6 -26 10 -13 10', 'none', C.ink, 2.2)),
    moving('phas', '0%{transform:translateY(-8px);opacity:.2}50%,100%{transform:translateY(0);opacity:1}', { dur: 1.4 }, path('M64 26 C76 30 86 44 88 72 L92 72 C90 44 80 28 66 22 Z', WATER, C.ink, 0.8)), arrow(70, 12, 92, 30, HL, 2.6)),
  'prodm.smältugn': all(wall('#3b3640'), floor('#5b5560'), path('M26 50 L94 50 L90 100 L30 100 Z', '#5a5f6a', C.ink, 2), path('M32 56 L88 56 L85 94 L35 94 Z', BRICK, C.ink, 1.2),
    waPulse('psmu', path('M36 64 L84 64 L82 92 L38 92 Z', MOLTEN, null), line('M38 64 L82 64', GLOW, 2)), rect(22, 40, 76, 10, C.dark, 3, C.ink, 1.8),
    ...[42, 60, 78].map((x) => rect(x - 3, 10, 6, 34, '#2e2e36', 1, C.ink, 1.4)), waPulse('psmb', spark(42, 46, 0.8), spark(60, 46, 0.9), spark(78, 46, 0.8)), frame(18, 6, 84, 98)),
  'prodm.degel': all(wall('#ece4d6'), rect(20, 92, 80, 20, BRICK, 2, C.ink, 1.6), flame(44, 92, 1), flame(60, 92, 1.2), flame(76, 92, 1),
    path('M44 50 L76 50 L72 84 C70 88 50 88 48 84 Z', '#9b4a33', C.ink, 2), waBob('pdeg', 1.5, ellipse(60, 54, 15, 3.5, MOLTEN, C.ink, 1)), heat(52, 44, 3, C.orange),
    line('M44 62 L18 40 M76 62 L102 40', C.dark, 3.4), line('M18 40 L10 32 M102 40 L110 32', C.dark, 4), ring(60, 66, 26)),
  'prodm.gjutjärn': all(wall('#f3efe6'), rect(10, 88, 100, 24, '#e9e9ee', 2, C.ink, 1.6), ellipse(52, 88, 26, 5, C.dark, C.ink, 1.2),
    ellipse(52, 80, 30, 9, '#2e2e36', C.ink, 2), ellipse(52, 78, 25, 6, '#45454f', null), rect(80, 74, 32, 7, '#2e2e36', 3, C.ink, 1.6), circle(107, 77.5, 2, C.white, null),
    ellipse(52, 77, 13, 3.5, '#f2c46b', C.ink, 1), ring(52, 79, 36)),
  'prodm.slagg': all(wall('#3b3640'), path('M16 50 L104 50 L98 104 L22 104 Z', '#5a5f6a', C.ink, 2), path('M20 56 L100 56 L96 100 L24 100 Z', MOLTEN, null),
    path('M20 56 L100 56 L99 66 L21 66 Z', '#7a7470', C.ink, 1), ...range(7).map((i) => circle(28 + i * 11, 61, 2, '#58534f', null)),
    moving('pslg', '0%{transform:translateX(30px)}70%,100%{transform:translateX(0)}', { dur: 2.6 }, line('M40 60 L84 18', C.dark, 3.4), rect(30, 56, 18, 6, C.dark, 1, C.ink, 1.2), path('M48 52 L28 52 L26 58 L46 58 Z', '#7a7470', C.ink, 1)),
    arrow(110, 40, 100, 58, HL, 2.6), frame(16, 52, 88, 18)),

  // ── 4042 Smidning och valsning ──
  'prodm.smidning': all(wall('#ece4d6'), floor(), anvil(56, 70), rect(30, 62, 48, 7, MOLTEN, 3, C.ink, 1.4), rect(30, 62, 16, 7, '#7d838e', 2, C.ink, 1.4), ring(64, 66, 14),
    moving('psmh', '0%,100%{transform:translateY(-22px) rotate(-18deg)}45%,55%{transform:translateY(0) rotate(0)}', { dur: 1.2, spin: true }, hammer(64, 54, -40)),
    moving('psms', '0%,40%{opacity:0}50%{opacity:1}70%,100%{opacity:0}', { dur: 1.2 }, spark(52, 56, 0.8), spark(78, 54, 0.7), spark(70, 46, 0.6))),
  'prodm.ässja': all(wall('#ece4d6'), floor(), path('M36 6 L84 6 L98 36 L22 36 Z', '#6b6f78', C.ink, 1.8), rect(52, 0, 16, 8, '#6b6f78', 0, C.ink, 1.4),
    rect(18, 58, 84, 42, BRICK, 2, C.ink, 1.8), ...range(4).map((i) => line(`M18 ${68 + i * 10} L102 ${68 + i * 10}`, '#8e3f2a', 1)), rect(28, 50, 64, 10, '#3d3f4a', 2, C.ink, 1.6),
    waPulse('pass', ...range(8).map((i) => circle(32 + i * 8, 52, 4, i % 2 ? MOLTEN : C.red, C.ink, 0.8))), flame(46, 50, 0.8), flame(66, 50, 1), rod(58, 112, 50, 2.6, '#7d838e'), rect(58, 47.4, 12, 5.2, MOLTEN, 2, null),
    path('M4 76 L16 70 L16 92 L4 86 Z', C.brown, C.ink, 1.4), frame(14, 44, 92, 60)),
  'prodm.stång': all(wall('#eef0f2'), rod(10, 104, 50, 5), rod(16, 108, 64, 5), rod(10, 102, 78, 5), rect(36, 42, 6, 44, C.brown, 1, C.ink, 1.2), rect(78, 42, 6, 44, C.brown, 1, C.ink, 1.2),
    arrow(14, 98, 104, 98, HL, 2.6), arrow(104, 98, 14, 98, HL, 2.6), ground()),
  'prodm.göt': all(wall('#eef0f2'), rect(14, 96, 92, 6, C.brown, 1, C.ink, 1.4), ingot(32, 96), ingot(60, 96), ingot(88, 96), ingot(46, 82), ingot(74, 82), ingot(60, 68, '#e8a24a'), ring(60, 62, 18), ground()),
  'prodm.valsa': all(wall('#3b3640'), roller(60, 32, 22), roller(60, 88, 22), waSpin('pvr1', 2.4, line('M60 16 L60 22 M44 32 L50 32', C.ink, 1.6)), arrow(82, 20, 84, 34, HL, 2.6), arrow(82, 100, 84, 86, HL, 2.6),
    moving('pvsl', '0%{transform:translateX(-14px)}100%{transform:translateX(10px)}', { dur: 2.4 }, rect(2, 50, 52, 20, MOLTEN, 2, C.ink, 1.4), rect(60, 57, 56, 6, MOLTEN, 1, C.ink, 1.2)), heat(16, 44, 3, GLOW)),
  'prodm.valsverk': all(rect(0, 0, 120, 112, '#d9dde2', 0, null), path('M4 40 L60 18 L116 40 L116 104 L4 104 Z', '#c7ccd2', C.ink, 2), rect(8, 44, 104, 60, '#3b3640', 1, C.ink, 1.4),
    ...[26, 50, 74].map((x) => all(rect(x - 7, 62, 14, 30, '#6b7079', 1, C.ink, 1.2), circle(x, 72, 4, STEEL, C.ink, 1), circle(x, 82, 4, STEEL, C.ink, 1))),
    waIn('pvwl', -20, 0, rect(10, 76, 84, 2.4, MOLTEN, 0, null)), circle(102, 80, 9, MOLTEN, C.ink, 1.4), circle(102, 80, 5, 'none', '#c9681a', 1), circle(102, 80, 2, C.dark, null),
    person(16, '#e2c33b', { s: 0.32, y: 102, hat: C.yellow }), frame(6, 58, 108, 38)),
  'prodm.smidesjärn': all(rect(0, 0, 120, 112, '#e6f1e1', 0, null), rect(4, 30, 16, 82, '#b7aea0', 1, C.ink, 1.6), rect(100, 30, 16, 82, '#b7aea0', 1, C.ink, 1.6),
    line('M24 40 L96 40 M24 104 L96 104', C.black, 3), ...range(7).map((i) => line(`M${30 + i * 10} 40 L${30 + i * 10} 104 M${30 + i * 10} 40 L${30 + i * 10} 32`, C.black, 2.2)),
    ...range(7).map((i) => path(`M${30 + i * 10} 32 L${28 + i * 10} 28 L${30 + i * 10} 24 L${32 + i * 10} 28 Z`, C.black, null)),
    ...[35, 55, 75].map((x) => line(`M${x} 60 C${x - 6} 60 ${x - 6} 52 ${x} 52 C${x + 4} 52 ${x + 4} 57 ${x + 1} 57 M${x + 10} 80 C${x + 16} 80 ${x + 16} 88 ${x + 10} 88 C${x + 6} 88 ${x + 6} 83 ${x + 9} 83`, C.black, 2)), frame(22, 20, 76, 88), ground()),

  // ── 4043 Fräsning och svarvning ──
  'prodm.industritekniker': all(wall('#e9edf2'), floor(), rect(66, 34, 48, 68, '#9aa3ad', 3, C.ink, 1.8), rect(72, 42, 26, 24, '#cfe8f5', 2, C.ink, 1.4), rect(102, 44, 8, 30, C.dark, 1, C.ink, 1.2), circle(106, 50, 2, C.green, null), circle(106, 58, 2, C.red, null),
    person(38, PLASTIC2, { l: [-6, 20], r: [10, 18], glasses: true, legs: PLASTIC2 }), rect(42, 56, 14, 18, C.dark, 2, C.ink, 1.2), rect(44, 58, 10, 13, '#bfe3f5', 1, null), ring(38, 66, 30)),
  'prodm.CNC-maskin': all(wall('#e9edf2'), floor(), rect(10, 20, 82, 86, '#dfe3e8', 4, C.ink, 2), rect(18, 30, 56, 48, '#bfe3f5', 3, C.ink, 1.6), endMill(46, 60), rect(30, 62, 32, 10, STEEL, 1, C.ink, 1.2),
    rect(96, 26, 20, 56, C.dark, 3, C.ink, 1.6), rect(99, 30, 14, 14, '#dfe9d8', 1, null), T(106, 40, '{ }', 7, C.ink), ...range(6).map((i) => circle(102 + (i % 2) * 8, 52 + Math.floor(i / 2) * 8, 2.4, i === 0 ? C.green : C.grey2, C.ink, 0.8)),
    rect(18, 84, 56, 6, C.grey, 1, C.ink, 1.2), frame(6, 16, 112, 94)),
  'prodm.arbetsstycke': all(wall('#e9edf2'), rect(10, 92, 100, 20, C.tan, 2, C.ink, 1.6), vice(56, 84), rect(38, 60, 36, 24, '#e8a24a', 1, C.ink, 1.6), line('M40 64 L72 64', '#f5c27a', 1.4),
    greyed(endMill(56, 50)), ring(56, 72, 24)),
  'prodm.svarva': all(wall('#e9edf2'), rect(4, 34, 22, 52, '#5b6b8a', 3, C.ink, 1.8), rect(24, 46, 10, 28, C.dark, 2, C.ink, 1.6), rect(34, 52, 72, 16, STEEL, 2, C.ink, 1.6), rect(104, 56, 12, 8, C.dark, 1, C.ink, 1.2),
    moving('psvs', '0%{transform:translateY(0)}100%{transform:translateY(8px)}', { dur: 0.35 }, line('M40 52 L36 60 M50 52 L46 60 M60 52 L56 60 M70 52 L66 60 M80 52 L76 60 M90 52 L86 60 M100 52 L96 60', '#8f99a3', 1.4)),
    rect(34, 52, 72, 16, 'none', 2, C.ink, 1.6), path('M28 40 C34 30 34 90 28 80', 'none', HL, 2.6), arrow(30, 80, 26, 86, HL, 2.6),
    moving('psvt', '0%{transform:translateX(30px)}100%{transform:translateX(0)}', { dur: 3 }, path('M70 86 L78 70 L86 86 Z', C.yellow, C.ink, 1.4), rect(72, 86, 12, 18, C.dark, 1, C.ink, 1.2), chip(80, 78, 1)), ground()),
  'prodm.skärverktyg': all(wall('#e9edf2'), greyed(rect(4, 18, 70, 40, STEEL, 2, C.ink, 1.6)), rect(60, 64, 54, 18, C.dark, 2, C.ink, 1.6), path('M60 64 L44 58 L54 74 L60 74 Z', C.yellow, C.ink, 1.6), chip(40, 48, 1.4), ring(52, 64, 14), arrow(96, 40, 66, 58, HL, 2.6), ground()),
  'prodm.spån': all(rect(0, 0, 120, 112, '#e9edf2', 0, null), rect(0, 88, 120, 24, '#cfcac0', 0, null), ...P3([[30, 84, 1.6], [46, 80, 1.8], [62, 86, 1.6], [76, 80, 1.7], [40, 92, 1.5], [58, 94, 1.6], [86, 90, 1.5], [52, 72, 1.6], [70, 70, 1.4]]).map(([x, y, s]) => chip(x, y, s, '#b8c0c8')),
    ...P2([[24, 96], [92, 98], [66, 100]]).map(([x, y]) => chip(x, y, 1.4, '#c9a24a')), ellipse(58, 86, 44, 22, 'none', HL, 2.6)),
  'prodm.fräsa.2': all(wall('#e9edf2'), rect(0, 96, 120, 16, '#8f99a3', 0, C.ink, 1.4), rect(50, 0, 20, 24, C.dark, 2, C.ink, 1.6),
    moving('pfrm', '0%{transform:translateY(0)}100%{transform:translateY(6px)}', { dur: 0.3 }, endMill(60, 70)), endMill(60, 70), arrow(36, 36, 48, 30, HL, 2.6), path('M38 30 C44 22 76 22 82 30', 'none', HL, 2.2),
    moving('pfrb', '0%{transform:translateX(30px)}100%{transform:translateX(-10px)}', { dur: 3 }, path('M20 70 L104 70 L104 94 L20 94 Z', '#e8a24a', C.ink, 1.6), rect(20, 70, 34, 6, '#f6d3a0', 0, C.ink, 1)),
    waIn('pfrc', 10, -6, chip(76, 60, 1), chip(84, 66, 0.9))),
  'prodm.skärvätska': all(wall('#e9edf2'), rect(0, 94, 120, 18, '#8f99a3', 0, C.ink, 1.4), endMill(50, 76), rect(20, 76, 80, 18, '#e8a24a', 1, C.ink, 1.6),
    path('M96 14 C92 30 84 40 72 50', 'none', C.dark, 6), path('M96 14 C92 30 84 40 72 50', 'none', C.grey, 3.6), rect(66, 48, 10, 6, C.dark, 2, C.ink, 1.2),
    path('M68 54 L56 70 L62 72 L72 56 Z', 'rgba(90,167,214,0.7)', C.ink, 0.8), ...P2([[50, 82], [58, 84], [44, 86], [64, 80]]).map(([x, y]) => circle(x, y, 2, WATER, C.ink, 0.6)), arrow(100, 62, 72, 64, HL, 2.6)),

  // ── 4044 Formsprutning ──
  'prodm.verktygsmakare': all(wall('#e9edf2'), rect(4, 76, 112, 8, C.tan, 2, C.ink, 1.6), line('M10 84 L10 112 M110 84 L110 112', C.brown, 3), mould(56, 36),
    g('translate(102 0)', person(0, '#6b8f5b', { l: [-26, 18], r: [-14, 26], s: 0.92 })), rect(76, 40, 8, 4, C.silver, 1, C.ink, 1), ring(78, 56, 28)),
  'prodm.granulat': all(wall('#eef0f2'), path('M10 30 L48 22 L56 70 L18 78 Z', '#e9e2d0', C.ink, 1.8), path('M48 22 L56 70 L62 66 Z', '#d6cdb6', C.ink, 1.4),
    waIn('pgrn', -14, -16, ...range(10).map((i) => ellipse(60 + (i % 4) * 7, 60 + Math.floor(i / 4) * 8, 2.6, 2, PLASTIC2, C.ink, 0.6))),
    path('M50 104 C56 88 96 86 108 104 Z', PLASTIC2, C.ink, 1.4), ...range(14).map((i) => ellipse(58 + (i % 7) * 7, 100 - Math.floor(i / 7) * 6, 2.6, 2, '#5b93d6', C.ink, 0.6)), ellipse(80, 96, 34, 16, 'none', HL, 2.6), ground()),
  'prodm.formsprutning': all(wall('#eef0f2'), path('M14 14 L34 14 L28 32 L20 32 Z', '#c7ccd2', C.ink, 1.6), ...range(5).map((i) => circle(18 + i * 3.6, 18, 2, PLASTIC, null)),
    rect(8, 32, 64, 16, '#9aa3ad', 3, C.ink, 1.8), ...[20, 36, 52].map((x) => rect(x, 30, 8, 20, C.red, 1, C.ink, 1)), path('M72 36 L80 40 L72 44 Z', C.dark, C.ink, 1.2),
    mould(78, 20, PLASTIC), waGrow('pfsg', path('M92 30 L108 30 L108 50 L92 50 L92 46 L104 46 L104 34 L92 34 Z', PLASTIC, C.ink, 1.2)),
    moving('pfss', '0%{transform:translateX(-10px)}100%{transform:translateX(0)}', { dur: 1.6 }, line('M14 40 L66 40', C.dark, 2), path('M18 34 L22 46 M28 34 L32 46 M38 34 L42 46 M48 34 L52 46 M58 34 L62 46', 'none', C.dark, 2)),
    rect(4, 60, 116, 8, C.dark, 2, C.ink, 1.4), line('M14 68 L14 106 M106 68 L106 106', C.dark, 4), frame(74, 16, 44, 44), ground()),
  'prodm.hålrum': all(wall('#eef0f2'), rect(14, 20, 92, 80, '#9aa3ad', 3, C.ink, 2), ...range(9).map((i) => line(`M${14 + i * 12} 100 L${26 + i * 12} 88`, '#7d868f', 1)),
    path('M38 36 L82 36 L82 46 L74 46 L70 84 L50 84 L46 46 L38 46 Z', '#f8f6f0', C.ink, 1.8), path('M38 36 L82 36 L82 46 L74 46 L70 84 L50 84 L46 46 L38 46 Z', 'none', HL, 2.6), line('M60 6 L60 36', C.dark, 4), arrow(104, 10, 80, 50, HL, 2.6)),
  'prodm.cykeltid': all(circle(60, 60, 40, 'none', HL, 3), arrow(96, 48, 98, 62, HL, 3), arrow(24, 72, 22, 58, HL, 3), arrow(48, 22, 62, 20, HL, 3), arrow(72, 98, 58, 100, HL, 3),
    circle(60, 62, 20, C.white, C.ink, 2), rect(56, 36, 8, 6, C.dark, 1, null), line('M60 62 L60 48', C.red, 2.4), path('M60 62 L60 42 A20 20 0 0 1 77 52 Z', 'rgba(228,87,46,0.25)', null), T(60, 76, '12', 9),
    g('translate(60 10)', rect(-8, -6, 7, 12, '#9aa3ad', 1, C.ink, 1), rect(1, -6, 7, 12, '#9aa3ad', 1, C.ink, 1)), g('translate(106 60)', rect(-6, -6, 12, 12, '#9aa3ad', 1, C.ink, 1), rect(-3, -3, 6, 6, PLASTIC, 0, null)),
    g('translate(60 110)', rect(-10, -6, 7, 12, '#9aa3ad', 1, C.ink, 1), rect(3, -6, 7, 12, '#9aa3ad', 1, C.ink, 1), rect(-2, -3, 4, 6, PLASTIC, 0, null)), g('translate(14 60)', ...range(3).map((i) => circle(-4 + i * 4, 0, 2, PLASTIC, null)))),
  'prodm.massproducera': all(wall('#eef0f2'), rect(2, 40, 30, 48, '#9aa3ad', 3, C.ink, 1.8), circle(17, 54, 5, C.white, C.ink, 1.2), rect(32, 82, 86, 8, C.dark, 3, C.ink, 1.6), ...range(5).map((i) => circle(40 + i * 18, 90, 3, C.grey, C.ink, 1)),
    ...range(5).map((i) => moving(`pmp${i}`, `0%,${i * 14}%{opacity:0;transform:translateX(-14px)}${i * 14 + 12}%,100%{opacity:1;transform:translateX(0)}`, { dur: 4 }, g(`translate(${42 + i * 16} 82)`, path('M-6 0 L-5 -14 L5 -14 L6 0 Z', PLASTIC2, C.ink, 1.2), rect(-6, -17, 12, 3, PLASTIC2, 1, C.ink, 1)))),
    line('M32 100 L118 100', HL, 2.6), arrow(90, 100, 116, 100, HL, 2.6), ground()),
  'prodm.byggkloss': all(rect(0, 0, 120, 112, '#fbf3df', 0, null), brick(20, 92, 32, C.red), brick(56, 92, 40, PLASTIC2), brick(28, 79, 24, C.yellow), brick(54, 79, 32, PLASTIC), brick(40, 66, 32, C.red), brick(48, 53, 16, PLASTIC2), brick(88, 70, 16, C.yellow), ring(60, 78, 36), ground(102)),
  'prodm.engångsartikel': all(wall('#f3efe6'), path('M18 50 L40 50 L37 92 L21 92 Z', C.white, C.ink, 1.6), line('M32 50 L38 28 L44 28', C.red, 2.4), g('translate(56 46)', rect(-2, 8, 4, 38, C.white, 1, C.ink, 1.2), path('M-6 -6 L-6 6 C-6 12 6 12 6 6 L6 -6 M-2 -6 L-2 6 M2 -6 L2 6', 'none', C.ink, 1.4)),
    ellipse(30, 100, 22, 5, C.white, C.ink, 1.4), arrow(66, 72, 84, 72, HL, 2.6), path('M88 62 L110 62 L106 104 L92 104 Z', C.grey, C.ink, 1.6), rect(86, 56, 26, 6, C.dark, 1, C.ink, 1.2), T(36, 20, '1', 14, HL), circle(36, 15, 10, 'none', HL, 2.2), ground()),

  // ── 4045 3D-utskrift ──
  'prodm.3D-skrivare': all(wall('#eef0f2'), rect(4, 108, 112, 4, C.tan, 0, null), printer(20, 72, 12, 16), spool(104, 40, 12, C.red), line('M104 40 C104 18 70 18 60 26', C.red, 1.4), frame(10, 4, 108, 108)),
  'prodm.filament': all(wall('#eef0f2'), waSpin('pfil', 4, spool(52, 58, 34, C.red)), line('M86 58 C96 58 104 72 110 96', C.red, 2.2), ring(52, 58, 40), ground()),
  'prodm.byggplatta': all(wall('#eef0f2'), path('M14 78 C40 62 80 62 106 78 L106 84 C80 68 40 68 14 84 Z', '#e0e4e8', C.ink, 1.6), palm(2, 80, -20, C.purple), g('translate(118 80) scale(-1 1)', palm(0, 0, -20, C.purple)),
    waBob('pbyp', 6, g('translate(60 58) rotate(-6)', path('M-12 6 L-10 -10 L10 -10 L12 6 Z', PLASTIC, C.ink, 1.4), line('M-11 -2 L11 -2 M-11 2 L11 2', '#2f7a3f', 0.8))), arrow(84, 50, 74, 40, HL, 2.4),
    path('M14 78 C40 62 80 62 106 78', 'none', HL, 3), ground()),
  'prodm.lager-förråd.2': all(rect(0, 0, 120, 70, '#dfeefa', 0, null), rect(0, 70, 120, 42, '#8a6a4a', 0, C.ink, 1), ...range(6).map((i) => circle(10 + i * 20, 92 + (i % 2) * 8, 2.4, '#6e543a', null)),
    path('M0 48 C20 44 40 50 60 46 C80 42 100 48 120 46 L120 70 L0 70 Z', C.white, C.ink, 1.6), ...range(6).map((i) => circle(14 + i * 19, 20 + (i % 3) * 8, 2, C.white, C.grey2, 0.8)),
    line('M104 46 L112 46 L112 70 L104 70', HL, 2.6), arrow(112, 50, 112, 66, HL, 2.2), arrow(112, 66, 112, 50, HL, 2.2), rect(4, 44, 96, 28, 'none', 4, HL, 2.2)),
  'prodm.stödmaterial': all(wall('#eef0f2'), rect(8, 96, 104, 8, '#e0e4e8', 1, C.ink, 1.4), greyed(rect(14, 40, 20, 56, PLASTIC, 1, C.ink, 1.4), rect(14, 30, 92, 12, PLASTIC, 1, C.ink, 1.4)),
    ...range(8).map((i) => line(`M${40 + i * 8.5} 42 L${40 + i * 8.5} 96`, HL, 1.6)), ...range(6).map((i) => line(`M38 ${50 + i * 8} L106 ${50 + i * 8}`, HL, 1, '3 3')), frame(36, 40, 72, 58)),
  'prodm.3D-utskrift': all(wall('#eef0f2'), rect(10, 100, 100, 8, '#e0e4e8', 1, C.ink, 1.4),
    ...range(7).map((i) => moving(`p3u${i}`, `0%,${i * 12}%{opacity:0}${i * 12 + 6}%,100%{opacity:1}`, { dur: 5 }, rect(f1(36 + i * 1.5), 92 - i * 8, f1(48 - i * 3), 8, i % 2 ? '#2f8a4a' : PLASTIC, 2, C.ink, 1))),
    moving('p3un', '0%{transform:translate(-14px,48px)}100%{transform:translate(0,0)}', { dur: 5 }, g('translate(60 0)', rect(-10, 22, 20, 16, C.grey, 2, C.ink, 1.4), path('M-4 38 L4 38 L0 44 Z', C.dark, null))), heat(46, 6, 3, C.orange)),
  'prodm.additiv-tillverkning': all(greyed(rect(6, 40, 44, 44, '#e8a24a', 1, C.ink, 1.6), path('M28 40 L50 40 L50 62 L28 62 Z', '#f8f6f0', C.ink, 1.2), chip(42, 30, 1.2), chip(52, 34, 1), T(28, 104, '−', 16)),
    line('M60 20 L60 104', C.grey2, 1.6, '4 4'), ...range(4).map((i) => rect(72, 84 - i * 12, 36, 11, PLASTIC, 2, C.ink, 1.2)), waIn('padt', 0, -16, rect(72, 36, 36, 11, PLASTIC, 2, C.ink, 1.2)), T(90, 30, '+', 18, HL), frame(66, 16, 48, 82)),
  'prodm.skräddarsy': all(rect(0, 0, 120, 112, '#f3efe6', 0, null), path('M44 20 C60 10 76 22 76 44 C76 64 72 84 66 98 C62 106 48 106 46 96 C44 84 38 60 38 44 C38 32 40 24 44 20 Z', C.skin, C.ink, 1.8),
    moving('pskr', '0%,20%{transform:translateX(44px);opacity:.2}70%,100%{transform:translateX(0);opacity:1}', { dur: 3 }, path('M45 24 C59 15 73 25 73 44 C73 63 69 82 64 95 C60 102 50 102 48 94 C46 82 41 60 41 44 C41 33 42 27 45 24 Z', 'rgba(239,138,60,0.75)', HL, 2.2)),
    greyed(rect(90, 30, 22, 66, C.orange, 10, C.ink, 1.4)), cross(101, 63, 8), tick(26, 20, 1.2)),

  // ── 4046 Montering ──
  'prodm.montering': all(wall('#e9edf2'), floor(), rect(0, 96, 120, 6, C.dark, 0, null), g('translate(54 92) scale(1.25)', path('M-30 0 L-30 -10 L-18 -12 L-8 -24 L14 -24 L24 -12 L32 -10 L32 0 Z', C.sky, C.ink, 1.6)), rect(26, 84, 20, 6, C.dark, 1, null), rect(70, 84, 20, 6, C.dark, 1, null),
    moving('pmnt', '0%{transform:translateX(26px);opacity:.3}60%,100%{transform:translateX(0);opacity:1}', { dur: 2.6 }, path('M46 64 L66 64 L66 82 L46 82 Z', '#6fb3dc', C.ink, 1.6), path('M50 66 L60 66 L60 72 L50 72 Z', '#dff1fb', C.ink, 1)),
    g('translate(100 0)', person(0, C.orange, { l: [-22, 20], r: [-18, 28], hat: C.yellow, s: 0.9 })), frame(42, 60, 28, 26)),
  'prodm.sätta-ihop': all(wall('#f3efe6'), rect(6, 84, 108, 6, C.tan, 2, C.ink, 1.6), line('M14 90 L14 112 M106 90 L106 112', C.brown, 3),
    waIn('psi1', -12, 0, rect(22, 54, 34, 14, '#d8b383', 1, C.ink, 1.6), rect(56, 58, 8, 6, '#d8b383', 0, C.ink, 1.2), palm(10, 58, 0, C.green)),
    waIn('psi2', 12, 0, rect(64, 54, 34, 14, '#c9a06d', 1, C.ink, 1.6), rect(62, 58, 4, 6, '#8a6a4a', 0, null), g('translate(110 58) scale(-1 1)', palm(0, 0, 0, C.green))), arrow(40, 40, 54, 40, HL, 2.6), arrow(80, 40, 66, 40, HL, 2.6)),
  'prodm.platt-paket': all(wall('#efe8dc'), floor(), g('translate(8 22) rotate(-8)', cardbox(10, 20, 74, 70, 4)), g('translate(8 22) rotate(-8)', g('translate(47 55)', rect(-13, -22, 26, 40, 'none', 1, C.brown, 1.4), line('M-13 -8 L13 -8 M-13 6 L13 6', C.brown, 1.4))),
    greyed(shelf(96, 50)), line('M90 30 L98 30 M90 26 L90 34 M98 26 L98 34', HL, 2.2), arrow(104, 22, 96, 28, HL, 2.4), frame(14, 30, 86, 74)),
  'prodm.monteringsanvisning': all(rect(0, 0, 120, 112, '#efe8dc', 0, null), rect(14, 8, 92, 100, C.white, 2, C.ink, 1.8), line('M60 12 L60 104 M18 58 L102 58', C.grey2, 1.2),
    T(22, 22, '1', 9), T(64, 22, '2', 9), T(22, 70, '3', 9), T(64, 70, '4', 9),
    rect(28, 30, 22, 4, C.tan, 0, C.ink, 1), rect(28, 38, 22, 4, C.tan, 0, C.ink, 1), rect(28, 46, 4, 8, C.silver, 0, C.ink, 0.8),
    rect(72, 30, 4, 22, C.tan, 0, C.ink, 1), rect(92, 30, 4, 22, C.tan, 0, C.ink, 1), arrow(84, 30, 84, 40, C.ink, 1.6),
    rect(30, 76, 20, 24, 'none', 0, C.ink, 1.4), line('M30 88 L50 88', C.ink, 1.4), g('translate(74 74) scale(0.6)', shelf(0, 0)), frame(10, 4, 100, 108)),
  'prodm.färdigmonterad': all(rect(0, 0, 120, 112, '#efe8dc', 0, null), floor(), g('translate(70 40) scale(1.2)', shelf(0, 0)), tick(102, 28, 1.4), ring(90, 70, 34),
    greyed(rect(6, 94, 40, 5, C.tan, 0, C.ink, 1), rect(8, 88, 36, 5, C.tan, 0, C.ink, 1), rect(10, 82, 30, 5, C.tan, 0, C.ink, 1), circle(16, 76, 2, C.silver, C.ink, 0.8), circle(24, 77, 2, C.silver, C.ink, 0.8))),

  // ── 4047 Kvalitetskontroll ──
  'prodm.kvalitetskontroll': all(wall('#e9edf2'), floor(), rect(0, 80, 92, 8, C.dark, 3, C.ink, 1.6), ...range(4).map((i) => circle(10 + i * 24, 88, 3, C.grey, C.ink, 1)),
    ...[14, 34, 54].map((x) => all(rect(x - 6, 68, 12, 12, STEEL, 1, C.ink, 1.2), tick(x, 60, 0.8))), rect(68, 68, 12, 12, STEEL, 1, C.ink, 1.2), cross(74, 60, 4),
    path('M96 92 L118 92 L114 112 L100 112 Z', C.red, C.ink, 1.4), arrow(80, 70, 102, 88, C.red, 2.2), g('translate(104 0)', person(0, C.white, { l: [-16, 14], r: [-6, 30], s: 0.82, y: 80 })), rect(84, 30, 12, 16, '#e9d3a9', 1, C.ink, 1.2), frame(2, 52, 84, 30)),
  'prodm.inspektera': all(wall('#e9edf2'), rect(10, 70, 100, 20, STEEL, 2, C.ink, 1.8), line('M14 70 C30 64 46 76 60 70 C74 64 90 76 106 70', C.dark, 2), ...range(9).map((i) => circle(18 + i * 11, 70, 2, '#7d868f', null)), ground(),
    moving('pins', '0%,100%{transform:translateX(-26px)}50%{transform:translateX(26px)}', { dur: 3.4 }, circle(60, 60, 16, 'rgba(191,227,245,0.45)', C.ink, 2.4), circle(60, 60, 13, 'none', HL, 2), line('M71 72 L86 90', C.brown, 6), line('M71 72 L86 90', C.ink, 1))),
  'prodm.defekt': all(rect(0, 0, 120, 112, '#f6f2ea', 0, null), greyed(rect(8, 40, 40, 50, STEEL, 4, C.ink, 1.6), circle(28, 54, 5, '#f6f2ea', C.ink, 1.2)),
    rect(62, 30, 48, 62, STEEL, 4, C.ink, 1.8), circle(86, 46, 6, '#f6f2ea', C.ink, 1.4), line('M74 30 L80 46 L72 58 L82 70 L76 92', C.ink, 2.4), line('M74 30 L80 46 L72 58 L82 70 L76 92', C.red, 1.2), ring(78, 62, 22), warn(104, 16, 0.9)),
  'prodm.felfri': all(rect(0, 0, 120, 112, '#f6f2ea', 0, null), greyed(rect(8, 40, 36, 48, STEEL, 4, C.ink, 1.6), line('M14 50 L28 58 M20 72 L36 66', C.ink, 1.4)),
    rect(58, 28, 50, 62, '#d9dee3', 4, C.ink, 1.8), line('M64 34 L76 34', C.white, 2.4), sparkle(70, 60, 6), sparkle(96, 44, 5), sparkle(92, 78, 4), ring(83, 59, 38), tick(100, 100, 1.4)),
  'prodm.kvalitetssäkring': all(path('M60 6 L106 20 C106 60 90 92 60 108 C30 92 14 60 14 20 Z', 'rgba(228,87,46,0.08)', HL, 3),
    ...P2([[40, 34], [60, 58], [80, 82]]).map(([x, y], i) => all(rect(x - 12, y - 9, 24, 18, C.white, 3, C.ink, 1.6), tick(x, y, 0.9), i < 2 ? arrow(x + 6, y + 10, x + 14, y + 14, C.ink, 1.8) : '')),
    greyed(T(30, 90, '?', 12))),
  'prodm.certifiering': all(wall('#e9edf2'), greyed(factory(8, 104, 1.1)), rect(46, 14, 64, 82, C.white, 2, C.ink, 1.8), ...range(5).map((i) => line(`M54 ${28 + i * 9} L${i % 2 ? 92 : 102} ${28 + i * 9}`, C.grey2, 2)),
    path('M80 78 L74 104 L80 98 L86 104 Z M92 78 L98 104 L92 98 L86 104 Z', C.red, C.ink, 1), circle(86, 76, 11, C.gold, C.ink, 1.6), circle(86, 76, 7, 'none', C.ink, 1), tick(86, 76, 0.6, C.ink), ring(86, 76, 16)),
  'prodm.spårbarhet': all(rect(0, 0, 120, 112, '#f6f2ea', 0, null), factory(6, 50, 0.9), g('translate(46 50)', rect(-10, -14, 24, 14, C.white, 1, C.ink, 1.3), rect(14, -10, 10, 10, C.white, 1, C.ink, 1.3), circle(-4, 2, 3, C.dark, null), circle(18, 2, 3, C.dark, null)),
    cardbox(78, 70, 30, 26, 4), rect(82, 78, 22, 9, C.white, 1, C.ink, 1), T(93, 85.5, '0427', 6.5), rect(10, 56, 16, 6, C.white, 1, C.ink, 0.8), T(18, 61, '0427', 4.6),
    line('M84 70 C76 60 70 58 66 56 M34 56 C30 58 26 60 24 64', HL, 2.4, '4 3'), arrow(74, 60, 64, 56, HL, 2.4), arrow(34, 56, 26, 62, HL, 2.4),
    circle(93, 82, 16, 'none', HL, 2.6), line('M104 94 L114 106', HL, 4), ground(98)),
  'prodm.återkalla.3': all(rect(0, 0, 120, 112, '#e6f1e1', 0, null), factory(6, 90, 1.1), houseS(86, 90, 1.1), ground(90),
    line('M90 100 L28 100', HL, 2.6, '5 4'), arrow(40, 100, 24, 100, HL, 3),
    moving('pakr', '0%{transform:translateX(52px)}80%,100%{transform:translateX(0)}', { dur: 3.2 }, kettle(54, 82), warn(54, 56, 0.8))),
};
