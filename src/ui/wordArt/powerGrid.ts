/**
 * Teknik & digital värld → Elektronik & energi → Elnät & elkraft, 3941–3947 (0.57): transformers, high and low
 * voltage, power lines, substations, frequency and alternating current, grid balance and power cuts.
 * Recurring signs: the part that the word names is outlined or drawn in orange; grey parts show what the word is
 * not. Electricity is a yellow bolt, high voltage a big bolt and low voltage a small one. Words in a contrast pair
 * share one layout where only the marked part differs: högspänning/lågspänning (a pylon line and a house:
 * the line or the socket), luftledning/jordkabel (one ground cross-section: the wire in the air or the cable in
 * the ground), transformatorstation/nätstation (big fenced yard outside town or a little hut between houses).
 * Digits and maths signs only; no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waIn, waPulse, waShake, waSpin, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const STEEL = '#8d96a0';
const WOOD = '#9a6a42';
const SOIL = '#b98b5e';
const SOIL2 = '#a3784f';
const GRASS = '#7dbb6a';
const NIGHT = '#27324a';
const LIT = '#ffe08a';
const CU = '#d9883f';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
/** Lightning bolt centred at (x, y). */
const bolt = (x: number, y: number, s = 1, col: string = C.yellow) => at(x, y, s, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', col, C.ink, 1.4));
/** Sine path from (x0, y0) over width w, amplitude a, n cycles. */
const sine = (x0: number, y0: number, w: number, a: number, n: number, steps = 48) =>
  'M' + range(steps + 1).map((i) => `${f1(x0 + (w * i) / steps)} ${f1(y0 - a * Math.sin((i / steps) * n * 2 * Math.PI))}`).join(' L');
/** Steel lattice pylon standing on y, top at y − h; returns the drawing. Arm tips: (x ± 16, y − h + 8). */
const pylon = (x: number, y: number, h: number, col: string = STEEL) => {
  const t = y - h;
  const legs = `M${x - 10} ${y} L${x - 3} ${t} M${x + 10} ${y} L${x + 3} ${t}`;
  const lat = range(5).map((i) => { const y1 = y - (h * i) / 5, y2 = y - (h * (i + 1)) / 5, w1 = 10 - (7 * i) / 5, w2 = 10 - (7 * (i + 1)) / 5; return `M${f1(x - w1)} ${f1(y1)} L${f1(x + w2)} ${f1(y2)} M${f1(x + w1)} ${f1(y1)} L${f1(x - w2)} ${f1(y2)}`; }).join(' ');
  return all(line(lat, col, 1.1), line(legs, col, 2.2), line(`M${x - 17} ${t + 8} L${x + 17} ${t + 8} M${x - 12} ${t + 16} L${x + 12} ${t + 16}`, col, 2.2), line(`M${x - 3} ${t} L${x} ${t - 4} L${x + 3} ${t}`, col, 1.6),
    ...[-16, 16].map((d) => line(`M${x + d} ${t + 8} L${x + d} ${t + 12}`, C.white, 2.2)));
};
/** Wooden pole with cross-arm and two insulators; ground at y, top at y − h. Wire points: (x ± 11, y − h + 2). */
const pole = (x: number, y: number, h: number, col: string = WOOD) => all(rect(x - 2.5, y - h, 5, h, col, 1, C.ink, 1.2), rect(x - 14, y - h + 6, 28, 3.5, col, 1, C.ink, 1),
  ...[-11, 11].map((d) => all(rect(x + d - 1.6, y - h + 1, 3.2, 5.5, C.white, 1, C.ink, 0.8))));
/** Sagging wire between two points. */
const sag = (x1: number, y1: number, x2: number, y2: number, dip = 8, col: string = C.ink, sw = 1.4) => line(`M${x1} ${y1} Q${f1((x1 + x2) / 2)} ${f1(Math.max(y1, y2) + dip)} ${x2} ${y2}`, col, sw);
/** Small house standing on y, centre x; windows lit or dark. */
const house = (x: number, y: number, s = 1, lit = true, wall: string = C.beige, roof: string = C.red) => at(x, y, s,
  rect(-14, -20, 28, 20, wall, 1, C.ink, 1.4), path('M-17 -19 L0 -33 L17 -19 Z', roof, C.ink, 1.4), rect(-10, -15, 8, 7, lit ? LIT : NIGHT, 1, C.ink, 1), rect(3, -15, 8, 7, lit ? LIT : NIGHT, 1, C.ink, 1), rect(-3, -9, 6, 9, C.brown, 1, C.ink, 1));
/** Transformer: tank with cooling fins and three bushings, standing on y, centre x. */
const transformer = (x: number, y: number, s = 1, col = '#7f8c99') => at(x, y, s,
  ...range(4).map((i) => rect(-24 + i * 3.2, -30, 2.2, 24, '#6b7681', 0.5, C.ink, 0.6)), ...range(4).map((i) => rect(12.6 + i * 3.2, -30, 2.2, 24, '#6b7681', 0.5, C.ink, 0.6)),
  rect(-12, -34, 24, 34, col, 2, C.ink, 1.4), rect(-14, -36, 28, 4, '#6b7681', 1, C.ink, 1),
  ...[-7, 0, 7].map((d) => all(rect(d - 1.8, -48, 3.6, 12, C.white, 1, C.ink, 0.9), line(`M${d - 2.4} -44 L${d + 2.4} -44 M${d - 2.4} -40 L${d + 2.4} -40`, C.grey, 0.8))));
/** Yellow warning triangle with a bolt. */
const warnSign = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -14 L13 9 L-13 9 Z', C.yellow, C.ink, 1.6), path('M1 -6 L-4 2 L0 2 L-2 7 L4 -1 L0 -1 Z', C.ink, null));
/** Swedish wall socket, centre (x, y). */
const socket = (x: number, y: number, s = 1) => at(x, y, s, rect(-12, -12, 24, 24, C.white, 4, C.ink, 1.4), circle(0, 0, 8.5, '#e9ecef', C.ink, 1.1), circle(-3.5, 0, 1.6, C.ink, null), circle(3.5, 0, 1.6, C.ink, null), rect(-1.5, -8.5, 3, 2.2, C.silver, 0.5, null), rect(-1.5, 6.3, 3, 2.2, C.silver, 0.5, null));
/** Simple standing person (side-neutral), feet on y. */
const worker = (x: number, y: number, top: string = C.orange, hat: string = C.yellow, s = 1) => at(x, y, s,
  line('M-3 0 L-2 -16 M3 0 L2 -16', C.navy, 4.4), path('M-6 -16 L-7 -34 C-7 -38 7 -38 7 -34 L6 -16 Z', top, C.ink, 1.2), line('M-6 -32 L-10 -20 M6 -32 L10 -20', top, 3.6),
  circle(0, -42, 5.6, C.skin, C.ink, 1.2), path('M-6.5 -43 C-6.5 -51 6.5 -51 6.5 -43 Z', hat, C.ink, 1.2), line('M-8 -43 L8 -43', C.ink, 1.2));
/** Tree (spruce), base on y. */
const spruce = (x: number, y: number, s = 1, col = '#3f7d4f') => at(x, y, s, rect(-1.5, -6, 3, 6, C.brown, 0.5, null), path('M0 -30 L-7 -16 L-4 -16 L-9 -6 L9 -6 L4 -16 L7 -16 Z', col, C.ink, 1));
/** Sweden outline: right and left edges as (y, x) pairs. */
const SE_R: [number, number][] = [[4, 74], [10, 82], [20, 84], [30, 80], [40, 78], [50, 74], [60, 76], [70, 74], [80, 72], [90, 68], [100, 66], [108, 62], [112, 60], [115, 54]];
const SE_L: [number, number][] = [[4, 74], [10, 66], [20, 58], [30, 52], [40, 46], [50, 42], [60, 40], [70, 38], [80, 36], [90, 34], [100, 36], [108, 38], [115, 44]];
const edge = (pts: [number, number][], y: number) => { for (let i = 1; i < pts.length; i++) { const [y0, x0] = pts[i - 1]!, [y1, x1] = pts[i]!; if (y <= y1) return x0 + ((x1 - x0) * (y - y0)) / (y1 - y0); } return pts[pts.length - 1]![1]; };
const zone = (y0: number, y1: number, fill: string, stroke: string | null = C.ink) => {
  const ys = range(Math.ceil((y1 - y0) / 2) + 1).map((i) => Math.min(y1, y0 + i * 2));
  const d = 'M' + ys.map((y) => `${f1(edge(SE_R, y))} ${y}`).join(' L') + ' L' + [...ys].reverse().map((y) => `${f1(edge(SE_L, y))} ${y}`).join(' L') + ' Z';
  return path(d, fill, stroke, 1.4);
};
const sweden = (fill = '#e7efe1') => zone(4, 115, fill);
/** Stopwatch, centre (x, y). */
const stopwatch = (x: number, y: number, s = 1) => at(x, y, s, rect(-3, -15, 6, 4, C.grey, 1, C.ink, 1), circle(0, 0, 11, C.white, C.ink, 1.6), line('M0 0 L0 -7 M0 0 L5 3', C.ink, 1.6));
/** Coin with "kr". */
const coin = (x: number, y: number, r = 7) => all(circle(x, y, r, C.gold, C.ink, 1.3), circle(x, y, r - 2.2, 'none', '#b88c22', 0.8), T(x, y + r * 0.35, 'kr', r * 0.95, '#7a5a12'));
/** Wind turbine, base on y. */
const turbine = (x: number, y: number, h: number, s = 1, col: string = C.white) => all(path(`M${x - 2.4} ${y} L${x - 1.2} ${y - h} L${x + 1.2} ${y - h} L${x + 2.4} ${y} Z`, col, C.ink, 1),
  ...[0, 120, 240].map((a) => g(`rotate(${a} ${x} ${y - h})`, path(`M${x} ${y - h} L${x - 2.2} ${y - h - 4} L${x} ${y - h - 22 * s} L${x + 1.6} ${y - h - 4} Z`, col, C.ink, 0.9))), circle(x, y - h, 2.2, C.grey2, C.ink, 0.9));

// ── Shared layouts ───────────────────────────────────────────────────
/** högspänning/lågspänning: a pylon line on the left feeding a house on the right (interior socket in an inset). */
const voltage = (high: boolean) => {
  const line1 = all(pylon(30, 112, 78, high ? '#5d6875' : STEEL), sag(-4, 46, 14, 42, 4, high ? C.ink : C.grey, high ? 2 : 1.4), sag(46, 42, 120, 46, 6, high ? C.ink : C.grey, high ? 2 : 1.4));
  const home = all(house(92, 112, 1.2, true), line('M96 112 L96 82', C.grey, 1));
  if (high) return all(ground(), greyed(home), line1, bolt(30, 22, 1.5, C.yellow), bolt(82, 48, 1.1), bolt(8, 50, 1.1), frame(2, 6, 112, 52));
  return all(ground(), greyed(line1), house(92, 112, 1.2, true), rect(60, 54, 56, 42, C.white, 4, C.ink, 1.4), rect(62, 56, 52, 38, '#f3ece0', 3, null), socket(76, 76, 0.9),
    path('M84 76 C90 76 92 70 98 70', 'none', C.ink, 1.4), rect(96, 64, 6, 10, C.white, 1, C.ink, 1), path('M99 64 L99 60 M94 60 L104 60 L101 66 L97 66 Z', LIT, C.ink, 1), bolt(108, 80, 0.55), ring(76, 76, 15));
};
/** luftledning/jordkabel: one landscape cross-section with poles above ground and a cable in a trench. */
const lineOrCable = (air: boolean) => {
  const sky = all(pole(24, 66, 40), pole(96, 66, 40), sag(-4, 30, 13, 28, 4), sag(35, 28, 85, 28, 9, air ? HL : C.ink, air ? 2.6 : 1.4), sag(107, 28, 124, 30, 4));
  const soil = all(rect(0, 66, 120, 50, SOIL, 0, null), rect(0, 64, 120, 4, GRASS, 0, null), path('M44 66 L52 96 L68 96 L76 66 Z', SOIL2, null), ...range(8).map((i) => circle(8 + i * 15, 80 + (i % 3) * 9, 1.6, '#8c6643', null)));
  const cable = all(rect(10, 88, 100, 6, air ? C.dark : HL, 3, C.ink, 1.2), circle(60, 91, 2, C.dark, null));
  return air ? all(soil, greyed(cable), sky) : all(soil, cable, greyed(sky), frame(6, 82, 108, 18));
};
/** transformatorstation/nätstation. */
const fence = (x1: number, x2: number, y: number, h: number) => all(line(range(Math.floor((x2 - x1) / 6) + 1).map((i) => `M${x1 + i * 6} ${y} L${x1 + i * 6} ${y - h}`).join(' '), '#7a838c', 1),
  line(`M${x1} ${y - h} L${x2} ${y - h} M${x1} ${y - h / 2} L${x2} ${y - h / 2}`, '#7a838c', 1.2), line(range(Math.floor((x2 - x1) / 6)).map((i) => `M${x1 + i * 6} ${y} L${x1 + i * 6 + 6} ${y - h} M${x1 + i * 6 + 6} ${y} L${x1 + i * 6} ${y - h}`).join(' '), '#a7afb7', 0.5));
const kiosk = (x: number, y: number, s = 1, col = '#5f8f6a') => at(x, y, s, rect(-14, -26, 28, 26, col, 1.5, C.ink, 1.4), path('M-16 -26 L16 -26 L13 -31 L-13 -31 Z', '#4d7556', C.ink, 1.2),
  rect(-9, -21, 10, 19, '#4d7556', 1, C.ink, 1), line('M4 -20 L11 -20 M4 -17 L11 -17 M4 -14 L11 -14', '#4d7556', 1.4), warnSign(-4, -12, 0.32));

// ── Motifs ───────────────────────────────────────────────────────────
export const GRID_MOTIFS: Record<string, Svg> = {
  // ── 3941 Transformatorer ─────────────────────────────────────────
  'grid.transformera.2': all(
    rect(42, 26, 36, 56, 'none', 3, '#59626c', 7), line('M42 30 L42 78 M78 30 L78 78', '#59626c', 7),
    ...range(7).map((i) => ellipse(42, 32 + i * 7, 8, 3.2, 'none', CU, 2.4)), ...range(3).map((i) => ellipse(78, 44 + i * 9, 8, 3.2, 'none', CU, 2.4)),
    line('M34 36 L6 36 M34 74 L6 74', C.ink, 1.6), line('M86 46 L114 46 M86 64 L114 64', C.ink, 1.6),
    waIn('grid-tr-a', -10, 0, path(sine(4, 98, 32, 12, 2), 'none', HL, 2.6)), waIn('grid-tr-b', -10, 0, path(sine(84, 98, 32, 4, 2), 'none', HL, 2.6)),
    bolt(18, 18, 1.2), bolt(100, 26, 0.6), arrow(44, 104, 76, 104, HL, 3)),
  'grid.höja.2': all(ground(), rect(44, 20, 32, 92, C.white, 4, C.ink, 1.6), rect(48, 40, 24, 70, HL, 2, null), line('M40 74 L80 74', C.grey, 2, '4 3'),
    ...range(8).map((i) => line(`M76 ${30 + i * 10} L82 ${30 + i * 10}`, C.ink, 1.2)),
    waIn('grid-hoj', 0, 26, arrow(98, 92, 98, 34, HL, 4), rect(46, 37, 28, 4, C.dark, 1.5, null)), greyed(rect(18, 74, 16, 36, C.grey, 2, C.ink, 1.2))),
  'grid.nätadapter': all(rect(4, 36, 18, 44, C.white, 3, C.ink, 1.4), socket(13, 58, 0.62),
    rect(20, 54, 10, 8, C.dark, 2, C.ink, 1), path('M30 58 C40 58 40 76 48 76', 'none', C.dark, 2.4),
    rect(46, 64, 32, 22, C.black, 4, C.ink, 1.6), circle(72, 70, 1.6, C.green, null), line('M52 80 L64 80', '#555a66', 1.2),
    path('M78 75 C88 75 88 94 98 94', 'none', C.dark, 2.4), greyed(path('M94 98 L120 98 L118 94 L96 94 Z', C.silver, C.ink, 1.2), rect(98, 70, 20, 24, C.dark, 2, C.ink, 1.2)),
    frame(42, 60, 40, 30)),
  'grid.kylning': all(ground(), transformer(52, 112, 1.6),
    waSpin('grid-kyl-fan', 1.4, g('translate(100 54)', circle(0, 0, 12, '#dfe6ec', C.ink, 1.4), ...[0, 90, 180, 270].map((a) => g(`rotate(${a})`, path('M0 0 C3 -4 3 -9 0 -10 C-2 -7 -2 -3 0 0 Z', '#7fb7d9', C.ink, 0.8))), circle(0, 0, 2, C.grey, null))),
    waIn('grid-kyl-in', 10, 0, arrow(118, 80, 92, 80, '#3f8fd0', 3), arrow(118, 92, 92, 92, '#3f8fd0', 3)),
    waIn('grid-kyl-up', 0, 8, line('M20 28 C16 22 24 18 20 12 M30 30 C26 24 34 20 30 14', C.red, 2))),
  // ── 3942 Hög- och lågspänning ────────────────────────────────────
  'grid.högspänning': voltage(true),
  'grid.lågspänning': voltage(false),
  'grid.kilovolt': all(bolt(28, 52, 2.4, HL), T(28, 96, '1', 18), T(60, 62, '=', 22),
    ...range(20).map((i) => bolt(78 + (i % 4) * 9, 22 + Math.floor(i / 4) * 12, 0.42, C.grey2)), T(91, 96, '1000', 15), ring(28, 54, 26)),
  'grid.livsfara': all(path('M60 8 L112 102 L8 102 Z', C.yellow, C.ink, 3), path('M60 20 L102 96 L18 96 Z', 'none', C.ink, 1.2),
    path('M58 30 L44 58 L54 58 L46 82 L70 50 L60 50 Z', C.ink, null),
    g('translate(78 70) rotate(28)', circle(0, -10, 4.4, C.ink, null), line('M0 -5 L0 8 M0 8 L-4 16 M0 8 L5 15 M0 -2 L-7 4 M0 -2 L7 -6', C.ink, 2.6)),
    line('M64 56 L70 60 M66 50 L73 52', C.ink, 1.6)),
  'grid.säkerhetsavstånd': all(ground(), greyed(pole(14, 112, 60)), line('M25 54 C34 70 30 96 40 110 L60 111', C.ink, 1.6),
    ...[[60, 104], [56, 98], [64, 98]].map(([x, y]) => line(`M${x} ${y} l3 -4 M${x} ${y} l-3 -3`, C.yellow, 2)), bolt(58, 98, 0.6),
    worker(102, 112, C.sky, C.yellow, 1), arrow(66, 72, 94, 72, HL, 2.6), arrow(94, 72, 66, 72, HL, 2.6), line('M64 64 L64 80 M96 64 L96 80', HL, 2)),
  'grid.elsäkerhet': all(greyed(house(60, 112, 2.4, true)), path('M60 26 L86 36 C86 62 76 78 60 88 C44 78 34 62 34 36 Z', '#3f7fc8', C.ink, 2), bolt(54, 54, 1.4), line('M60 66 L66 72 L78 56', C.white, 4)),
  // ── 3943 Kraftledningar ──────────────────────────────────────────
  'grid.stamnät': all(sweden(), path('M72 12 C64 30 56 48 50 66 C46 82 44 96 48 110', 'none', HL, 4), path('M78 20 C74 40 70 58 66 74 C62 88 58 100 54 108', 'none', HL, 4),
    line('M50 66 L66 74 M54 40 L62 40 L74 42', HL, 3), greyed(line('M42 96 L48 100 M56 92 L60 98 M60 84 L66 88 M44 80 L48 84', C.grey, 1)), pylon(102, 112, 44, '#5d6875')),
  'grid.lokalnät': all(ground(), greyed(pylon(18, 70, 60), sag(-4, 18, 1, 18, 2), sag(35, 18, 60, 22, 4)), kiosk(46, 112, 0.9),
    house(80, 82, 0.8), house(106, 82, 0.8), house(80, 112, 0.8), house(106, 112, 0.8), line('M58 108 L66 108 L66 74 L72 74 M66 74 L66 70 L98 70 L98 74 M66 108 L72 108 M66 100 L98 100 L98 104', HL, 2.4)),
  'grid.nätägare': all(ground(), rect(6, 54, 30, 58, '#c9d6e3', 2, C.ink, 1.4), ...range(6).map((i) => rect(10 + (i % 2) * 14, 60 + Math.floor(i / 2) * 14, 8, 8, LIT, 1, C.ink, 0.8)),
    circle(21, 30, 7, 'none', HL, 3), line('M21 37 L21 52 M21 46 L26 46 M21 51 L25 51', HL, 3),
    house(64, 112, 0.75), house(88, 112, 0.75), house(108, 96, 0.6), line('M36 70 L64 82 M36 70 L88 82 M36 70 L108 74', C.ink, 1.4),
    path('M50 68 C60 50 116 52 116 72 C116 100 112 116 92 116 L50 116 Z', 'none', HL, 2.6)),
  'grid.elstolpe': all(rect(0, 104, 120, 16, GRASS, 0, null), ground(104), pole(60, 106, 92), sag(-4, 20, 49, 16, 6), sag(71, 16, 124, 20, 6),
    line('M60 106 L60 112', WOOD, 5), path('M52 106 C56 102 64 102 68 106', 'none', '#5c9a4d', 1.6)),
  'grid.luftledning': lineOrCable(true),
  'grid.jordkabel': lineOrCable(false),
  'grid.isolator.2': all(rect(54, 76, 12, 44, WOOD, 1, C.ink, 1.4), rect(12, 70, 96, 9, WOOD, 1.5, C.ink, 1.4),
    greyed(rect(18, 58, 6, 12, C.white, 1, C.ink, 1)), line('M-4 54 L120 54', C.ink, 1.8),
    ...range(4).map((i) => ellipse(84, 66 - i * 4, 9 - (i % 2), 2.8, i % 2 ? '#e9f1ee' : '#bfe0d2', C.ink, 1)), rect(81, 40, 6, 14, '#d9e4e0', 1, C.ink, 1), ring(84, 58, 17)),
  'grid.överföring.2': all(ground(), rect(2, 76, 26, 36, '#9aa7b4', 1, C.ink, 1.4), path('M2 76 L8 62 L22 62 L28 76 Z', '#7e8b98', C.ink, 1.2), bolt(15, 92, 0.8),
    pylon(48, 112, 62), pylon(84, 112, 62), line('M10 62 L32 58 M64 58 L68 58 M100 58 L112 66', C.ink, 1.4), sag(32, 58, 64, 58, 6, C.ink, 1.6), sag(68, 58, 100, 58, 6, C.ink, 1.6),
    rect(100, 80, 18, 32, C.beige, 1, C.ink, 1.2), rect(106, 70, 12, 42, '#c9d6e3', 1, C.ink, 1.2), ...range(3).map((i) => rect(109, 74 + i * 9, 6, 5, LIT, 0.5, null)),
    waIn('grid-ovf-a', -36, 0, bolt(48, 26, 0.7, HL), bolt(84, 26, 0.7, HL)), arrow(20, 14, 100, 14, HL, 3)),
  'grid.ledningsgata': all(rect(0, 0, 120, 120, '#cfe5c2', 0, null), ...range(12).map((i) => spruce(8 + (i % 3) * 13, 40 + Math.floor(i / 3) * 22, 0.9)), ...range(12).map((i) => spruce(86 + (i % 3) * 13, 40 + Math.floor(i / 3) * 22, 0.9)),
    rect(40, 0, 40, 120, '#e3edc9', 0, null), pylon(60, 106, 70), line('M44 44 L44 0 M76 44 L76 0', C.ink, 1.2), path('M40 112 L40 118 L80 118 L80 112', 'none', HL, 2.6), line('M40 4 L40 116 M80 4 L80 116', HL, 2, '5 4')),
  'grid.montör': all(rect(0, 106, 120, 14, GRASS, 0, null), rect(57, 8, 7, 104, WOOD, 1, C.ink, 1.2), rect(40, 18, 42, 4, WOOD, 1, C.ink, 1), sag(-4, 14, 44, 16, 4), sag(78, 16, 124, 14, 4),
    g('translate(48 76)', line('M0 0 L-3 18 M6 0 L8 18', C.navy, 5), path('M-4 0 L-5 -22 C-5 -26 9 -26 9 -22 L8 0 Z', C.orange, C.ink, 1.2), line('M-5 -10 L12 -8', C.dark, 2.4),
      line('M8 -20 L12 -38 M-2 -20 L14 -32', C.orange, 3.6), circle(13, -39, 2.6, C.skin, C.ink, 0.8), circle(14, -33, 2.6, C.skin, C.ink, 0.8),
      circle(2, -31, 5.6, C.skin, C.ink, 1.2), path('M-4.5 -32 C-4.5 -40 8.5 -40 8.5 -32 Z', C.yellow, C.ink, 1.2), line('M-6 -32 L10 -32', C.ink, 1.2)),
    line('M42 66 C50 70 60 70 66 64', C.dark, 2), rect(60, 36, 4, 6, C.grey, 1, C.ink, 0.8)),
  // ── 3944 Elstationer ─────────────────────────────────────────────
  'grid.transformatorstation': all(ground(), greyed(house(110, 112, 0.5), house(96, 112, 0.4)), line('M10 30 L10 6 M50 30 L50 6 M90 30 L90 6', STEEL, 2), line('M6 30 L94 30', STEEL, 2.6),
    sag(-4, 12, 10, 30, 3), sag(-4, 20, 10, 30, 3), transformer(30, 102, 1), transformer(70, 102, 1), line('M30 54 L30 30 M70 54 L70 30', C.ink, 1), fence(4, 96, 112, 22), frame(2, 4, 96, 110)),
  'grid.nätstation': all(ground(), house(20, 112, 0.9), house(100, 112, 0.9), kiosk(60, 112, 1.2), line('M44 112 L36 112 M76 112 L84 112', HL, 2.4), frame(38, 70, 44, 44), line('M74 112 L74 116 L116 116', C.dark, 1, '3 2')),
  'grid.koppla-bort.2': all(ground(), greyed(pylon(18, 112, 70)), sag(34, 50, 50, 60, 2), rect(46, 56, 10, 14, C.dark, 2, C.ink, 1.2), line('M56 60 L60 60 M56 66 L60 66', C.silver, 2.4),
    moving('grid-kb', '0%,20%{transform:translate(16px,0)}60%,100%{transform:translate(0,0)}', { dur: 3 }, rect(68, 56, 10, 14, C.dark, 2, C.ink, 1.2), path('M78 63 C88 63 90 80 98 84', 'none', C.ink, 1.6)),
    house(100, 112, 1, false, C.grey2, C.grey), arrow(66, 44, 82, 44, HL, 3), line('M62 50 L62 78', HL, 2, '3 3')),
  'grid.elförsörjning': all(ground(), pylon(16, 112, 64), sag(32, 56, 52, 60, 3, HL, 2.4), line('M52 60 L60 70 L118 70', HL, 2.4),
    ...[[54, 30], [68, 48], [82, 22], [98, 40]].map(([x, h]) => all(rect(x!, 112 - h! - 30, 14, h! + 30, '#c9d6e3', 1, C.ink, 1.2), ...range(Math.floor((h! + 24) / 9)).map((i) => rect(x! + 3, 112 - h! - 26 + i * 9, 8, 5, LIT, 0.5, null)))),
    ring(16, 56, 14)),
  // ── 3945 Frekvens och växelström ─────────────────────────────────
  'grid.period.3': all(rect(4, 18, 112, 70, '#f9f7f1', 3, C.grey2, 1), line('M8 53 L114 53', C.grey, 1), greyed(path(sine(8, 53, 104, 24, 3), 'none', C.ink, 2)),
    path(sine(42.67, 53, 34.67, 24, 1, 24), 'none', HL, 3.4), line('M42.7 92 L77.3 92 M42.7 86 L42.7 98 M77.3 86 L77.3 98', HL, 2.4), stopwatch(60, 108, 0.7)),
  'grid.sinuskurva': all(rect(6, 14, 108, 78, C.dark, 5, C.ink, 1.8), rect(12, 20, 76, 66, '#163a2a', 2, null),
    line(range(7).map((i) => `M${12 + i * 12.7} 20 L${12 + i * 12.7} 86`).join(' ') + ' ' + range(5).map((i) => `M12 ${20 + i * 16.5} L88 ${20 + i * 16.5}`).join(' '), '#2c5a43', 0.6),
    path(sine(12, 53, 76, 24, 2), 'none', '#ffb067', 3), ...[0, 1, 2].map((i) => circle(101, 32 + i * 20, 5, C.grey2, C.ink, 1.2)), rect(30, 92, 60, 6, C.grey, 1, C.ink, 1), frame(9, 17, 82, 72)),
  'grid.synkron': all(...[[30, 40], [80, 40]].map(([x, y], i) => all(circle(x!, y!, 18, C.white, C.ink, 1.6), waSpin(`grid-syn-${i}`, 2, g(`translate(${x} ${y})`, line('M0 0 L0 -15', HL, 3.4), circle(0, -15, 3, HL, null), circle(0, 0, 3, C.ink, null))))),
    greyed(circle(55, 88, 16, C.white, C.ink, 1.6), line('M55 88 L67 96', C.ink, 3)), path(sine(8, 70, 104, 4, 2), 'none', HL, 2), ring(30, 40, 22), ring(80, 40, 22)),
  // ── 3946 Elnätets balans ─────────────────────────────────────────
  'grid.spotpris': all(rect(30, 6, 60, 108, C.dark, 7, C.ink, 1.8), rect(34, 14, 52, 90, '#eef3f7', 2, null),
    ...range(8).map((i) => { const h = [16, 12, 10, 22, 40, 30, 20, 46][i]!; return rect(37 + i * 6, 92 - h, 4.6, h, i === 7 ? HL : '#8fb8d8', 1, null); }), line('M36 92 L84 92', C.ink, 1),
    coin(80, 32, 8), stopwatch(46, 28, 0.6), line('M85 35 L85 44', HL, 2)),
  'grid.energilager': all(ground(), greyed(turbine(16, 112, 60)), ...[0, 1].map((i) => all(rect(34 + i * 40, 74, 36, 38, '#e8ece9', 2, C.ink, 1.4), line(range(5).map((k) => `M${40 + i * 40 + k * 6} 78 L${40 + i * 40 + k * 6} 108`).join(' '), '#c7cfd0', 1))),
    rect(46, 34, 52, 26, C.white, 4, C.ink, 1.6), rect(98, 42, 5, 10, C.white, 1, C.ink, 1.2), ...range(4).map((i) => rect(50 + i * 11.5, 38, 9, 18, HL, 1.5, null)),
    waIn('grid-el-in', -12, 0, arrow(22, 46, 42, 46, '#3f8fd0', 2.6)), arrow(72, 62, 72, 72, HL, 2.6)),
  // ── 3947 Strömavbrott ────────────────────────────────────────────
  'grid.slå-ut.2': all(rect(0, 0, 120, 120, '#d8dde4', 0, null), ground(), pole(20, 112, 44), pole(100, 112, 44), sag(31, 70, 89, 70, 8),
    g('translate(22 112) rotate(62)', rect(-3, -64, 6, 64, C.brown, 1, C.ink, 1), path('M0 -76 L-12 -50 L-6 -50 L-14 -32 L14 -32 L6 -50 L12 -50 Z', '#3f7d4f', C.ink, 1)),
    house(108, 112, 0.6, false, C.grey2, C.grey), waPulse('grid-slaut', bolt(62, 60, 1.3, HL), line('M52 52 L46 46 M72 52 L78 46 M54 68 L48 72', HL, 2.4)),
    waIn('grid-slaut-w', -10, 0, line('M4 16 L34 16 M10 26 L44 26 M2 36 L24 36', C.grey, 2))),
  'grid.hushåll': all(ground(), path('M14 112 L14 50 L60 18 L106 50 L106 112 Z', '#f6ead6', C.ink, 1.8), rect(30, 92, 60, 4, C.tan, 1, C.ink, 1.2),
    ...[[40, 78, C.green, false], [60, 74, C.orange, true], [80, 80, C.denim, false]].map(([x, y, c, l]) => g(`translate(${x} ${y})`, path('M-8 14 C-8 4 8 4 8 14 Z', String(c), C.ink, 1.2), circle(0, -2, 6, C.skin, C.ink, 1.2), path(l ? 'M-6 -3 C-7 -11 7 -11 6 -3 L7 6 L4 0 L-4 0 L-7 6 Z' : 'M-6 -3 C-6 -10 6 -10 6 -3 C3 -6 -3 -6 -6 -3 Z', C.hair, null))),
    path('M10 112 L10 48 L60 13 L110 48 L110 112', 'none', HL, 2.6)),
  'grid.avbrottsersättning': all(ground(), house(28, 112, 1.3, false, C.grey2, C.grey), circle(28, 22, 13, C.white, C.ink, 1.6), line('M28 22 L28 13 M28 22 L34 26', C.ink, 1.6), T(28, 46, '12+', 9),
    arrow(52, 72, 74, 72, HL, 3), rect(78, 58, 34, 20, '#cfe6c8', 2, C.ink, 1.4), circle(95, 68, 5, 'none', '#5d8a54', 1.2), coin(84, 92, 7), coin(100, 96, 7), coin(92, 104, 7), frame(74, 54, 42, 58)),
  'grid.elverk': all(ground(), line('M20 112 L20 54 L100 54 L100 112 M20 80 L100 80', C.dark, 3), rect(28, 62, 44, 18, C.red, 3, C.ink, 1.4), rect(30, 82, 40, 26, '#5a5d68', 3, C.ink, 1.4),
    circle(50, 95, 8, '#3f424d', C.ink, 1), rect(74, 84, 22, 22, C.yellow, 2, C.ink, 1.2), socket(85, 95, 0.4), circle(42, 60, 3, C.dark, null), line('M100 64 L108 64', C.dark, 3),
    moving('grid-elv-puff', '0%{transform:translate(0,4px);opacity:.2}60%,100%{transform:translate(0,0);opacity:1}', { dur: 2 }, circle(112, 52, 4, C.grey2, null), circle(116, 44, 3, C.grey2, null)),
    waShake('grid-elv', line('M20 116 L100 116', C.grey, 1))),
  'grid.mörklagd': all(rect(0, 0, 120, 112, NIGHT, 0, null), circle(96, 18, 8, '#f3eac2', null), circle(100, 15, 7, NIGHT, null), ...[[14, 14], [40, 26], [70, 10], [22, 40]].map(([x, y]) => circle(x!, y!, 1.2, '#f3eac2', null)),
    ...[18, 46, 74, 102].map((x, i) => house(x, 112, 0.9 + (i % 2) * 0.15, false, '#4a5568', '#3a4356')), line('M0 112 L120 112', '#4a5568', 2), greyed(rect(58, 52, 3, 60, C.grey, 1, null), path('M54 50 L66 50 L63 56 L57 56 Z', LIT, null))),
};
