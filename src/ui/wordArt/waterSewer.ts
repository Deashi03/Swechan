/**
 * Teknik & digital värld → Byggnad & infrastruktur → Vatten & avlopp, 4131–4137 (0.59): waterworks, water mains,
 * sewers, sewage treatment, storm water, pumping stations, leaks and blockages.
 * Recurring signs: the part that the word names is outlined in orange (ring or frame) and grey parts show what the
 * word is not. Clean water and drinking-water pipes are blue, sewage and sewer pipes brown, rain grey-blue, soil
 * light brown under a green grass line. Pairs that are easy to mix up share one layout where only the marked part
 * differs: huvudledning/servisledning (the thick pipe under the street or the thin branch to one house),
 * brunnslock (a round solid iron lid) and gatubrunn (a rectangular grating by the kerb), sandfilter (water running
 * down through sand), sandfång (coarse sand lying in a flowing channel) and sedimentera (fine particles sinking in
 * still water), biologisk rening (bubbles and bacteria) and kemisk rening (a dosing can and flakes that sink),
 * avrinning (water running off a hard surface) and infiltrera (water sinking down through the soil), självfall (a
 * sloping pipe without a pump) and tryckledning (a pump pushing water up a hill).
 * Digits only; no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waGrow, waIn, waPulse, waShake, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const WATER = '#8cc7e8';
const DEEP = '#4f8fc0';
const MURKY = '#9a9a6a';
const SEW = '#8a6a3a';
const SLUDGE = '#5b4128';
const SOIL = '#d2b48a';
const SOIL2 = '#b8946a';
const GRASS = '#6fae5a';
const ASPH = '#62666e';
const ASPH2 = '#80858d';
const BLUEP = '#3f7fc4';
const BROWNP = '#b5652f';
const IRON = '#4a4d55';
const RUST = '#b2582a';
const CONC = '#bdbdb5';
const SKY = '#e4f1f8';
const BRICK = '#c4704f';
const FAT = '#f2e3a6';
const UV = '#9b6bff';
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const tup = (a: number[][]) => a as [number, number, number][];
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 5, col, 2.6);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const check = (x: number, y: number, s = 1, col: string = C.green) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 8, C.white, col, 2), line('M-4 0 L-1 3 L4 -3', col, 2.4));
const cross = (x: number, y: number, s = 6, col: string = C.red) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 3);
const drop = (x: number, y: number, s = 1, col: string = WATER) => path(`M${x} ${y - 5 * s} C${x + 4 * s} ${y} ${x + 3 * s} ${y + 4 * s} ${x} ${y + 4 * s} C${x - 3 * s} ${y + 4 * s} ${x - 4 * s} ${y} ${x} ${y - 5 * s} Z`, col, C.ink, 0.8);
/** Thick pipe along a path: dark outline and coloured core. */
const pipe = (d: string, col: string, w = 8) => all(line(d, C.ink, w + 2.4), line(d, col, w));
/** Sky above and soil below the grass line at y. */
const section = (y: number, sky: string = SKY) => all(rect(0, 0, 120, y, sky, 0, null), rect(0, y, 120, 112 - y, SOIL, 0, null), line(`M0 ${y} L120 ${y}`, GRASS, 3),
  ...tup([[14, y + 14, 0], [44, y + 26, 0], [80, y + 12, 0], [100, y + 30, 0], [30, y + 36, 0], [64, y + 34, 0]]).filter(([, yy]) => yy < 110).map(([x, yy]) => circle(x, yy, 1.4, SOIL2, null)));
/** Street seen in cross-section: asphalt on top of soil at y. */
const street = (y: number) => all(rect(0, 0, 120, y - 4, SKY, 0, null), rect(0, y - 4, 120, 6, ASPH, 0, null), rect(0, y + 2, 120, 110 - y, SOIL, 0, null), line(`M8 ${y - 4} L20 ${y - 4} M40 ${y - 4} L52 ${y - 4} M72 ${y - 4} L84 ${y - 4}`, C.white, 1.2));
/** Small house, ground line at y, centred at x. */
const house = (x: number, y: number, s = 1, col = '#f0dcc0', roof: string = C.red) => g(`translate(${x} ${y}) scale(${s})`, rect(-16, -26, 32, 26, col, 1, C.ink, 1.6), path('M-20 -24 L0 -40 L20 -24 Z', roof, C.ink, 1.6), rect(-5, -14, 10, 14, C.brown, 1, C.ink, 1.2), rect(6, -21, 7, 7, '#cfe6f5', 1, C.ink, 1));
/** Rain: short slanted strokes in a box. */
const rain = (x0: number, y0: number, w: number, h: number, n = 10, col = '#6f9fc4') => line(range(n).map((i) => { const x = x0 + ((i * 37) % w), y = y0 + ((i * 23) % h); return `M${x} ${y} l-3 7`; }).join(' '), col, 1.8);
const cloud = (x: number, y: number, s = 1, col: string = C.grey2) => g(`translate(${x} ${y}) scale(${s})`, path('M-16 6 C-24 6 -24 -6 -15 -6 C-14 -16 -2 -18 2 -10 C6 -18 20 -14 17 -4 C24 -4 24 6 17 6 Z', col, C.ink, 1.4));
const sun = (x: number, y: number, r = 7) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${(x + Math.cos(a) * (r + 3)).toFixed(1)} ${(y + Math.sin(a) * (r + 3)).toFixed(1)} l${(Math.cos(a) * 4).toFixed(1)} ${(Math.sin(a) * 4).toFixed(1)}`, C.gold, 2); }), circle(x, y, r, C.yellow, C.ink, 1.4));
const tree = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-3, -16, 6, 16, C.brown, 1, C.ink, 1.2), path('M0 -46 C16 -46 22 -34 18 -24 C22 -16 14 -10 6 -12 C2 -8 -6 -8 -8 -12 C-18 -10 -22 -20 -16 -26 C-22 -36 -12 -46 0 -46 Z', C.green, C.ink, 1.4));
const waves = (x: number, y: number, w: number, col: string = C.white) => line(range(Math.floor(w / 12)).map((i) => `M${x + i * 12} ${y} q3 -3 6 0 t6 0`).join(' '), col, 1.4);
/** Standing person, feet at (x, 112); arms from the shoulders to (lx, ly) and (rx, ry) relative to the neck. */
const person = (x: number, top: string, o: { s?: number; l?: [number, number]; r?: [number, number]; hat?: string; hair?: string; y?: number } = {}) => {
  const s = o.s ?? 1, [lx, ly] = o.l ?? [-12, 22], [rx, ry] = o.r ?? [12, 22];
  return g(`translate(${x} ${o.y ?? 112}) scale(${s})`, line('M-5 0 L-4 -26 M5 0 L4 -26', C.navy, 7), rect(-11, -56, 22, 32, top, 6, C.ink, 1.6),
    line(`M-9 -52 L${lx} ${-56 + ly}`, C.ink, 6.4), line(`M-9 -52 L${lx} ${-56 + ly}`, top, 4.4), circle(lx, -56 + ly, 3.2, C.skin, C.ink, 1.2),
    line(`M9 -52 L${rx} ${-56 + ry}`, C.ink, 6.4), line(`M9 -52 L${rx} ${-56 + ry}`, top, 4.4), circle(rx, -56 + ry, 3.2, C.skin, C.ink, 1.2),
    circle(0, -67, 10, C.skin, C.ink, 1.6), o.hat ? path('M-12 -70 C-12 -84 12 -84 12 -70 L14 -69 L-14 -69 Z', o.hat, C.ink, 1.6) : path('M-10 -68 C-10 -81 10 -81 10 -68 C6 -73 -6 -73 -10 -68 Z', o.hair ?? C.hair, null),
    circle(-3.5, -66, 1.2, C.ink, null), circle(3.5, -66, 1.2, C.ink, null), path('M-3 -61 C-1 -59 1 -59 3 -61', 'none', C.ink, 1.2));
};
/** Palm seen from the side (no pointing finger), wrist at (x, y). */
const palm = (x: number, y: number, rot = 0, sleeve: string = C.navy) => g(`translate(${x} ${y}) rotate(${rot})`, path('M0 0 L14 -2 C20 -3 26 -2 30 0 C32 2 30 5 26 5 L20 5 C22 7 21 10 18 10 L4 10 C0 10 -2 6 0 0 Z', C.skin, C.ink, 1.4), rect(-12, -1, 14, 11, sleeve, 2, C.ink, 1.4));
/** Truck cab facing right with a flat bed; wheels on y. */
const truckCab = (x: number, y: number, col: string = C.orange) => g(`translate(${x} ${y})`, path('M0 -8 L0 -30 L16 -30 L26 -18 L26 -8 Z', col, C.ink, 1.6), path('M4 -27 L14 -27 L21 -18 L4 -18 Z', '#dff1fb', C.ink, 1.1), circle(14, -8, 6, C.dark, C.ink, 1.4), circle(14, -8, 2.2, C.silver, null));
/** Bacterium: green capsule with tail, centred. */
const bacterium = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M7 0 C12 2 14 -3 18 -1', 'none', C.ink, 1), ellipse(0, 0, 8, 4.6, '#7cc576', C.ink, 1.2), circle(-3, -1, 1, C.ink, null), circle(1, 1.4, 1, C.ink, null));
/** Pump seen from the side: motor on top of a pump body. */
const pumpUnit = (x: number, y: number, s = 1, col: string = C.navy) => g(`translate(${x} ${y}) scale(${s})`, rect(-8, -26, 16, 14, col, 3, C.ink, 1.4), line('M-6 -22 L6 -22 M-6 -18 L6 -18', '#6d86b5', 1), path('M-10 -12 L10 -12 L12 0 L-12 0 Z', C.grey, C.ink, 1.4), circle(0, -6, 3, C.dark, null));
/** Round iron manhole lid seen from above (ellipse), centred. */
const lid = (x: number, y: number, rx = 18, ry = 8) => all(ellipse(x, y, rx, ry, IRON, C.ink, 1.6), ellipse(x, y, rx * 0.72, ry * 0.72, 'none', '#6c707a', 1.2), line(`M${x - rx * 0.6} ${y} L${x + rx * 0.6} ${y} M${x} ${y - ry * 0.6} L${x} ${y + ry * 0.6}`, '#6c707a', 1.2));
/** Grating seen from above: rectangle with bars. */
const grating = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, IRON, 1.5, C.ink, 1.6), line(range(Math.floor(w / 5)).map((i) => `M${x + 4 + i * 5} ${y + 2} L${x + 4 + i * 5} ${y + h - 2}`).join(' '), '#1f2026', 2));
/** Water tap on a short pipe from the left, spout at (x, y). */
const tap = (x: number, y: number) => all(rect(x - 22, y - 12, 16, 6, C.silver, 2, C.ink, 1.2), rect(x - 8, y - 16, 10, 12, C.silver, 2, C.ink, 1.2), rect(x - 6, y - 21, 6, 5, C.red, 1, C.ink, 1), path(`M${x + 2} ${y - 12} L${x + 6} ${y - 12} L${x + 6} ${y - 4} L${x + 2} ${y - 4} Z`, C.silver, C.ink, 1.1));
const bottle = (x: number, y: number, fill: string = WATER, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-7 0 L7 0 L7 -20 C7 -24 3 -24 3 -28 L-3 -28 C-3 -24 -7 -24 -7 -20 Z', 'rgba(220,240,252,0.7)', C.ink, 1.4), path('M-6.4 -0.6 L6.4 -0.6 L6.4 -14 L-6.4 -14 Z', fill, null), rect(-4, -33, 8, 5, C.navy, 1, C.ink, 1));
const glass = (x: number, y: number, fill: string = WATER, h = 22) => all(path(`M${x - 8} ${y - h} L${x + 8} ${y - h} L${x + 6} ${y} L${x - 6} ${y} Z`, 'rgba(220,240,252,0.6)', C.ink, 1.4), path(`M${x - 7.4} ${y - h + 6} L${x + 7.4} ${y - h + 6} L${x + 5.6} ${y - 0.6} L${x - 5.6} ${y - 0.6} Z`, fill, null));
const coin = (x: number, y: number, r = 5) => all(circle(x, y, r, C.gold, C.ink, 1.2), circle(x, y, r * 0.55, 'none', '#b88a20', 1));
const snowflake = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 -6 L0 6 M-5 -3 L5 3 M-5 3 L5 -3', '#5aa7d6', 1.6));
/** Toilet seen from the side, floor at y. */
const toilet = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(4, -34, 10, 18, C.white, 2, C.ink, 1.4), path('M-12 -16 L14 -16 L12 -10 C10 -4 2 -2 0 -2 L0 0 L-6 0 L-6 -4 C-10 -6 -12 -10 -12 -16 Z', C.white, C.ink, 1.4));
const sink = (x: number, y: number) => all(path(`M${x - 12} ${y} L${x + 12} ${y} L${x + 9} ${y + 8} L${x - 9} ${y + 8} Z`, C.white, C.ink, 1.4), path(`M${x + 6} ${y} L${x + 6} ${y - 8} L${x + 1} ${y - 8}`, 'none', C.silver, 2.4));
/** Stink lines (wavy, green) rising from (x, y). */
const stink = (x: number, y: number, col = '#8fae3a') => line(`M${x - 6} ${y} c-4 -5 4 -9 0 -14 c-4 -5 4 -9 0 -14 M${x + 4} ${y} c-4 -5 4 -9 0 -14 c-4 -5 4 -9 0 -14`, col, 2.2);
/** Pill and capsule. */
const capsule = (x: number, y: number, rot = 0, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-6 -3 L0 -3 L0 3 L-6 3 C-9 3 -9 -3 -6 -3 Z', C.red, C.ink, 1), path('M0 -3 L6 -3 C9 -3 9 3 6 3 L0 3 Z', C.white, C.ink, 1));
const pill = (x: number, y: number, r = 3.4, col: string = C.white) => all(circle(x, y, r, col, C.ink, 1), line(`M${x - r * 0.6} ${y} L${x + r * 0.6} ${y}`, C.grey, 0.8));
/** Fish (contrast element). */
const fish = (x: number, y: number, s = 1, col: string = C.orange) => g(`translate(${x} ${y}) scale(${s})`, path('M-10 0 C-4 -7 6 -7 10 0 C6 7 -4 7 -10 0 Z', col, C.ink, 1.2), path('M10 0 L16 -5 L16 5 Z', col, C.ink, 1.2), circle(-5, -1, 1, C.ink, null));
/** Waterworks building: low hall with a pipe going in. */
const plant = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-22, -28, 44, 28, '#d9d4c8', 1, C.ink, 1.6), path('M-24 -28 L24 -28 L20 -36 L-20 -36 Z', '#7d8794', C.ink, 1.4), ...[-14, -2, 10].map((xx) => rect(xx, -22, 8, 8, '#cfe6f5', 1, C.ink, 1)), rect(-4, -12, 8, 12, C.navy, 1, C.ink, 1.2));
/** Wallet-free bill: paper with lines. */
const bill = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -18, 28, 36, C.white, 2, C.ink, 1.4), line('M-9 -10 L9 -10 M-9 -4 L9 -4 M-9 2 L3 2', C.grey, 1.6), line('M-9 11 L9 11', C.ink, 1.4));

export const WATSEW_MOTIFS: Record<string, Svg> = {
  // ── 4131 Vattenverk ──
  'watsew.ytvatten': all(rect(0, 0, 120, 112, SKY, 0, null), sun(100, 16), path('M0 50 C20 44 30 52 50 48 C70 44 90 50 120 46 L120 112 L0 112 Z', GRASS, C.ink, 1.4),
    path('M10 64 C24 54 60 52 96 58 C110 62 112 74 96 80 C70 88 30 88 14 80 C4 76 2 70 10 64 Z', WATER, C.ink, 1.6), waves(24, 68, 60), waves(32, 76, 48),
    path('M96 58 C104 52 112 42 120 40', 'none', WATER, 5), path('M96 58 C104 52 112 42 120 40', 'none', C.ink, 0.8), frame(4, 52, 112, 40),
    greyed(rect(0, 96, 120, 16, SOIL, 0, null), ...range(10).map((i) => circle(6 + i * 12, 104, 2.2, WATER, null)))),
  'watsew.råvatten': all(rect(0, 0, 120, 112, SKY, 0, null), rect(0, 70, 46, 42, WATER, 0, null), waves(4, 78, 36), plant(96, 70, 0.9), rect(0, 70, 120, 4, GRASS, 0, null),
    pipe('M10 92 L60 92 L60 70 L76 70', '#d9e7c8', 12), ...tup([[18, 92, 1.6], [28, 91, 1.2], [38, 93, 1.4], [50, 92, 1.1], [60, 84, 1.3], [60, 76, 1.2], [68, 70, 1.4]]).map(([x, y, r]) => circle(x, y, r, '#7a6b3a', null)),
    path('M12 88 C20 90 30 86 46 90 L58 90', 'none', MURKY, 3), frame(6, 82, 60, 20),
    greyed(glass(104, 100, WATER, 18)), arrow(86, 92, 94, 92, C.ink, 1.6)),
  'watsew.vattenskyddsområde': all(rect(0, 0, 120, 112, SKY, 0, null), rect(0, 40, 120, 72, GRASS, 0, null), path('M0 100 L120 86 L120 98 L0 112 Z', ASPH, null), line('M4 104 L20 102 M40 99 L56 97 M76 95 L92 93', C.white, 1.4),
    ellipse(70, 60, 34, 12, WATER, C.ink, 1.4), waves(52, 60, 36), tree(30, 54, 0.6), tree(108, 50, 0.55), ellipse(70, 60, 46, 22, 'none', HL, 2.4), line('M70 38 L70 33', HL, 0),
    rect(12, 66, 3, 30, C.grey, 0, C.ink, 1), rect(2, 52, 24, 18, '#2f6fb5', 2, C.ink, 1.4), rect(4.5, 54.5, 19, 13, 'none', 1.5, C.white, 1.2), drop(14, 62, 1.1, C.white)),
  'watsew.sandfilter': all(rect(14, 10, 92, 96, '#e9eef2', 3, C.ink, 1.8), rect(16, 20, 88, 22, '#b9c79a', 0, null), ...tup([[26, 28, 1.4], [44, 34, 1.2], [62, 26, 1.5], [80, 32, 1.3], [94, 28, 1.2]]).map(([x, y, r]) => circle(x, y, r, '#6f6a3a', null)), waves(20, 22, 80, '#e6ebd6'),
    rect(16, 42, 88, 36, '#ecd49a', 0, null), ...range(40).map((i) => circle(19 + ((i * 29) % 84), 45 + ((i * 17) % 31), 1.1, '#c7a35a', null)),
    rect(16, 78, 88, 14, '#a7a39c', 0, null), ...range(14).map((i) => ellipse(21 + ((i * 23) % 80), 81 + ((i * 7) % 9), 3, 2, '#86827a', C.ink, 0.5)), frame(12, 40, 96, 40),
    rect(54, 92, 12, 14, CONC, 0, C.ink, 1.2), ...[0, 1].map((i) => moving(`wssf${i}x`, '0%{transform:translate(0,-8px);opacity:0}30%{opacity:1}100%{transform:translate(0,6px);opacity:0}', { dur: 1.4, delay: i * 0.7 }, drop(60, 100 + i * 5, 0.8))), arrow(8, 22, 8, 92, C.ink, 1.6)),
  'watsew.uv-ljus': all(rect(4, 54, 112, 34, WATER, 4, C.ink, 1.8), waves(10, 62, 96), waves(16, 78, 84), rect(10, 32, 100, 12, '#f1ecff', 6, C.ink, 1.6), rect(14, 35, 92, 6, UV, 3, null),
    waPulse('wsuv', ...range(7).map((i) => line(`M${20 + i * 13} 46 L${16 + i * 13} 56`, UV, 2.2))), frame(6, 28, 108, 20),
    ...tup([[26, 70, 0], [58, 74, 20], [92, 68, -15]]).map(([x, y, r]) => all(greyed(bacterium(x, y, 0.9, r)), cross(x, y, 6, C.red))), arrow(4, 98, 30, 98, C.ink, 1.6)),
  'watsew.vattentorn': all(rect(0, 0, 120, 112, SKY, 0, null), path('M0 96 C30 80 70 80 120 96 L120 112 L0 112 Z', GRASS, C.ink, 1.4), rect(52, 40, 16, 46, '#d9d4c8', 1, C.ink, 1.6),
    path('M34 22 C34 12 86 12 86 22 L80 42 L40 42 Z', '#e6e1d6', C.ink, 1.8), path('M38 30 L82 30 L80 40 L40 40 Z', WATER, null), waves(42, 32, 36), ring(60, 28, 30),
    pipe('M60 86 L60 100 L18 100', BLUEP, 3), pipe('M60 100 L102 100', BLUEP, 3), house(16, 104, 0.5), house(104, 104, 0.5)),
  'watsew.vattenprov': all(rect(0, 0, 120, 112, '#eef3f7', 0, null), tap(56, 30), line('M60 30 L60 50', WATER, 3), bottle(60, 84, WATER, 1.2), rect(54, 70, 12, 8, C.white, 1, C.ink, 0.8), palm(36, 74, 0, C.green), frame(46, 40, 28, 48),
    rect(84, 88, 30, 6, C.tan, 1, C.ink, 1.2), ...[90, 98, 106].map((x) => all(rect(x - 3, 66, 6, 22, 'rgba(220,240,252,0.7)', 3, C.ink, 1.1), rect(x - 2.4, 76, 4.8, 11, WATER, 2, null))), rect(0, 104, 120, 8, C.tan, 0, null)),
  'watsew.vattenkvalitet': all(path('M60 14 C76 34 88 50 88 66 C88 84 74 96 60 96 C46 96 32 84 32 66 C32 50 44 34 60 14 Z', WATER, C.ink, 2), line('M44 64 C44 76 50 84 58 86', C.white, 2.4),
    path('M40 76 A20 20 0 0 1 80 76', 'none', C.red, 5), path('M53 57 A20 20 0 0 1 80 76', 'none', C.yellow, 5), path('M68 58 A20 20 0 0 1 80 76', 'none', C.green, 5), line('M60 76 L74 64', C.ink, 2.4), circle(60, 76, 3, C.ink, null),
    check(88, 26, 1.1), greyed(glass(108, 108, MURKY, 18), circle(105, 100, 1.4, SLUDGE, null), circle(110, 96, 1.2, SLUDGE, null))),

  // ── 4132 Vattenledningar ──
  'watsew.huvudledning': all(street(40), house(24, 36, 0.8), house(96, 36, 0.8), pipe('M24 37 L24 84', BLUEP, 3), pipe('M96 37 L96 84', BLUEP, 3),
    pipe('M0 88 L120 88', BLUEP, 14), line('M0 84 L120 84', '#8db8e4', 1.6), frame(2, 76, 116, 24)),
  'watsew.servisledning': all(street(40), house(24, 36, 0.8), house(96, 36, 0.8), greyed(pipe('M0 88 L120 88', BLUEP, 14), pipe('M24 37 L24 84', BLUEP, 3)),
    pipe('M96 37 L96 60 L80 60 L80 84', BLUEP, 4), ...range(3).map((i) => moving(`wssv${i}`, '0%{transform:translate(0,22px);opacity:0}30%,70%{opacity:1}100%{transform:translate(0,-4px);opacity:0}', { dur: 1.8, delay: i * 0.6 }, circle(80, 62, 1.6, C.white, null))), frame(74, 32, 30, 56), circle(80, 84, 3, C.white, C.ink, 1.2)),
  'watsew.förbindelsepunkt': all(rect(0, 0, 120, 112, SOIL, 0, null), rect(0, 0, 54, 112, 'rgba(79,143,192,0.25)', 0, null), rect(54, 0, 66, 112, 'rgba(111,174,90,0.25)', 0, null), line('M54 6 L54 108', C.ink, 1.6, '5 4'),
    pipe('M0 80 L18 80', BLUEP, 12), pipe('M12 80 L12 60 L54 60', BLUEP, 4), pipe('M54 60 L96 60 L96 30', BLUEP, 4), house(96, 30, 0.8), path('M8 18 L26 18 L26 34 L8 34 Z', '#d9d4c8', C.ink, 1.4), path('M6 18 L17 10 L28 18 Z', '#7d8794', C.ink, 1.2),
    rect(48, 54, 12, 12, C.dark, 2, C.ink, 1.4), circle(54, 60, 3, C.red, null), ring(54, 60, 12)),
  'watsew.kommunalt-vatten': all(rect(0, 0, 120, 112, SKY, 0, null), rect(0, 96, 120, 16, SOIL, 0, null), rect(6, 44, 38, 52, '#e6e1d6', 1, C.ink, 1.6), path('M2 44 L25 28 L48 44 Z', '#7d8794', C.ink, 1.6),
    ...[12, 22, 32].map((x) => rect(x, 52, 4, 32, C.white, 0, C.ink, 0.8)), line('M25 28 L25 14', C.ink, 1.4), path('M25 14 L36 17 L25 20 Z', C.navy, null),
    pipe('M25 96 L25 104 L92 104 L92 70', BLUEP, 4), tap(98, 64), line('M102 64 L102 76', WATER, 2.4), glass(102, 90, WATER, 14), frame(4, 26, 112, 82),
    greyed(g('translate(76 30)', rect(-9, -4, 18, 14, CONC, 2, C.ink, 1.2), path('M-9 -4 L0 -16 L9 -4', 'none', C.brown, 2)))),
  'watsew.anslutningsavgift': all(rect(0, 0, 120, 112, SKY, 0, null), rect(0, 70, 120, 42, SOIL, 0, null), line('M0 70 L120 70', GRASS, 3), house(86, 70, 0.9),
    pipe('M0 98 L54 98', BLUEP, 9), pipe('M64 98 L86 98 L86 70', BLUEP, 4), line('M54 98 L64 98', HL, 2.6, '2 2'),
    bill(26, 38, 1), ...[0, 1, 2].map((i) => coin(46, 56 - i * 5, 6)), T(26, 34, '1', 13), arrow(40, 64, 54, 88, HL, 2.6), frame(8, 16, 50, 50)),
  'watsew.plaströr': all(rect(0, 0, 120, 112, '#eef3f7', 0, null), ...[0, 1, 2].map((i) => g(`translate(34 ${66 - i * 2})`, circle(0, 0, 26 - i * 6, 'none', C.ink, 6.4), circle(0, 0, 26 - i * 6, 'none', BLUEP, 4.4))),
    ...[0, 1, 2].map((i) => all(rect(64, 80 + i * 9, 50, 8, BLUEP, 4, C.ink, 1.4), ellipse(114, 84 + i * 9, 2.6, 4, '#2a5f9a', C.ink, 1))), frame(4, 34, 112, 76),
    greyed(rect(70, 46, 40, 9, RUST, 2, C.ink, 1.4))),
  'watsew.frysa-sönder': all(rect(0, 0, 120, 112, '#dfeaf3', 0, null), ...tup([[14, 14, 1], [104, 18, 1.2], [30, 36, 0.8], [90, 40, 0.9]]).map(([x, y, s]) => snowflake(x, y, s)),
    pipe('M0 64 L120 64', C.silver, 18), rect(0, 57, 120, 14, '#d6eefc', 0, null), line('M4 60 L116 60 M4 68 L116 68', C.white, 1.2),
    waShake('wsfz', path('M54 54 L58 62 L54 66 L60 74', 'none', C.ink, 2.2), path('M64 54 L62 60 L66 66 L62 74', 'none', C.ink, 2)),
    moving('wsfz2', '0%,40%{opacity:0;transform:scale(.3)}70%,100%{opacity:1;transform:scale(1)}', { dur: 2.6, spin: true }, path('M58 54 C56 40 50 32 44 26 M60 54 C60 40 62 30 66 22 M62 54 C66 42 74 34 80 30', 'none', WATER, 3), ...tup([[44, 26, 1], [66, 20, 1], [80, 30, 1]]).map(([x, y]) => drop(x, y, 0.9))),
    ring(60, 64, 18), rect(0, 104, 120, 8, '#f6f8fb', 0, null)),

  // ── 4133 Avloppsledningar ──
  'watsew.avloppsledning': all(rect(0, 0, 120, 70, '#f3ece0', 0, null), rect(0, 70, 120, 42, SOIL, 0, null), line('M0 70 L120 70', C.ink, 1.6), toilet(26, 68, 1), sink(70, 44),
    pipe('M24 68 L24 82 L110 96', BROWNP, 6), pipe('M70 52 L70 86', BROWNP, 4), frame(16, 74, 100, 30), greyed(pipe('M100 70 L100 20 L80 20', BLUEP, 3))),
  'watsew.spillvatten': all(rect(0, 0, 120, 112, '#f3ece0', 0, null), toilet(16, 48, 0.8), sink(46, 30), rect(66, 20, 22, 28, C.white, 3, C.ink, 1.4), circle(77, 36, 7, '#cfe6f5', C.ink, 1.2),
    pipe('M12 48 L12 60 L110 60', BROWNP, 5), pipe('M46 38 L46 60', BROWNP, 3), pipe('M77 48 L77 60', BROWNP, 3),
    path('M100 62 L110 62 C112 74 108 88 104 100 L96 100 C100 88 102 76 100 62 Z', SEW, C.ink, 1.2), ellipse(98, 104, 18, 5, SEW, C.ink, 1.2), ...tup([[92, 103, 1.4], [102, 105, 1.2], [104, 82, 1]]).map(([x, y, r]) => circle(x, y, r, SLUDGE, null)), ring(100, 92, 18),
    greyed(cloud(30, 86, 0.8), rain(16, 94, 30, 12, 6))),
  'watsew.självfall': all(section(30), house(18, 30, 0.8), pipe('M18 31 L18 46 L112 92', BROWNP, 7),
    ...range(6).map((i) => moving(`wssf${i}`, `0%{transform:translate(-14px,-6.8px);opacity:0}25%,75%{opacity:1}100%{transform:translate(14px,6.8px);opacity:0}`, { dur: 1.6, delay: i * 0.25 }, circle(30 + i * 14, f(52 + i * 14 * 0.49), 2.2, SEW, null))),
    arrow(48, 74, 84, 92, HL, 2.6), greyed(pumpUnit(100, 54, 0.8), cross(100, 46, 9, C.red)), frame(10, 40, 106, 58)),
  'watsew.brunnslock': all(rect(0, 0, 120, 112, ASPH2, 0, null), ...range(30).map((i) => circle(4 + ((i * 37) % 112), 4 + ((i * 53) % 104), 0.9, ASPH, null)),
    circle(60, 56, 36, IRON, C.ink, 2), circle(60, 56, 30, 'none', '#6c707a', 1.6), ...range(5).map((i) => line(`M${36 + i * 12} ${36 + Math.abs(2 - i) * 4} L${36 + i * 12} ${76 - Math.abs(2 - i) * 4}`, '#6c707a', 2)),
    circle(60, 56, 6, '#575a63', C.ink, 1.2), ring(60, 56, 41), path('M96 104 C100 96 110 96 116 100', 'none', C.dark, 7)),
  'watsew.avloppslukt': all(rect(0, 0, 120, 112, '#e9f0f3', 0, null), rect(0, 92, 120, 20, '#cfd8dc', 0, null), line(range(8).map((i) => `M${i * 16} 92 L${i * 16 - 6} 112`).join(' '), '#b8c3c8', 1), grating(46, 94, 22, 6),
    waPulse('wslu', stink(56, 90), stink(44, 74), stink(68, 70)), person(98, C.lilac, { l: [-4, -4], r: [10, 22], hair: C.hair }), path('M90 46 C92 42 96 42 96 46', 'none', C.ink, 1.2), ring(56, 82, 22)),
  'watsew.relining': all(rect(0, 0, 120, 112, '#f2eee6', 0, null), rect(6, 38, 108, 40, RUST, 4, C.ink, 1.8), ...tup([[20, 44, 3], [44, 72, 4], [80, 42, 3], [100, 70, 3]]).map(([x, y, r]) => circle(x, y, r, '#8a3f1c', null)),
    rect(6, 46, 108, 24, '#4a3a2f', 2, null),
    moving('wsrl', '0%{transform:translate(-70px,0)}60%,100%{transform:translate(0,0)}', { dur: 3 }, rect(6, 47, 108, 22, '#e9f2fb', 3, C.ink, 1.4), line('M10 53 L110 53', C.white, 1.6), ellipse(114, 58, 3, 11, '#bcd3ea', C.ink, 1.2)),
    frame(2, 42, 116, 32), path('M6 38 L14 32 M30 78 L26 86', 'none', C.ink, 1.4), ellipse(6, 58, 4, 20, '#3a2a22', C.ink, 1.4)),
  'watsew.rotinträngning': all(section(36), tree(30, 36, 1), pipe('M0 86 L120 86', CONC, 18), line('M0 82 L120 82', '#d6d6cf', 1.4), line('M58 77 L62 86 L58 95', C.ink, 1.6),
    path('M30 36 C32 50 44 62 58 78 M30 36 C26 50 18 60 10 70 M30 36 C40 46 54 52 74 60', 'none', '#5a3a1c', 2.6),
    waGrow('wsrt', path('M58 80 C66 82 72 80 80 86 C86 90 92 84 100 88 C104 90 108 86 112 88 M60 84 C66 90 74 88 82 92 C88 94 94 92 98 94 M64 82 C70 78 76 82 84 80', 'none', '#5a3a1c', 2.6)), ring(78, 86, 24)),
  'watsew.rörinspektion': all(rect(0, 0, 120, 112, '#f2eee6', 0, null), rect(4, 70, 112, 26, '#d9cbb3', 4, C.ink, 1.6), rect(4, 74, 112, 18, '#6f5a3e', 2, null), line('M80 74 L84 82 L80 92', '#f2eee6', 1.6),
    moving('wsri', '0%{transform:translate(-40px,0)}65%,100%{transform:translate(0,0)}', { dur: 3 }, line('M0 83 L64 83', C.dark, 2.4), rect(64, 78, 12, 10, C.dark, 2, C.ink, 1.2), circle(76, 83, 3, C.yellow, C.ink, 1), path('M79 79 L90 74 L90 92 L79 87 Z', 'rgba(255,240,150,0.5)', null)),
    rect(20, 12, 56, 42, C.dark, 3, C.ink, 1.6), rect(24, 16, 48, 34, '#2b2420', 1, null), circle(48, 33, 14, '#6f5a3e', C.ink, 1.2), circle(48, 33, 6, '#2b2420', null), line('M54 22 L50 30 L56 38', C.white, 1.6), rect(44, 54, 8, 10, C.dark, 1, C.ink, 1.2), frame(16, 8, 64, 50)),
  'watsew.enskilt-avlopp': all(section(46), house(22, 46, 0.9), pipe('M22 47 L22 62 L48 62', BROWNP, 4), rect(48, 54, 26, 20, CONC, 3, C.ink, 1.6), lid(61, 52, 7, 2.5),
    pipe('M74 64 L84 64 L84 84 L116 84', '#d9cbb3', 3), line(range(6).map((i) => `M${88 + i * 5} 86 l0 5`).join(' '), WATER, 1.4), frame(6, 22, 112, 76),
    greyed(g('translate(104 34)', rect(-10, -16, 20, 16, '#d9d4c8', 1, C.ink, 1.2), rect(-6, -26, 4, 10, '#d9d4c8', 1, C.ink, 1)), cross(104, 26, 8, C.red))),
  'watsew.slamavskiljare': all(section(30), lid(40, 28, 8, 3), lid(80, 28, 8, 3), rect(18, 36, 84, 64, CONC, 4, C.ink, 1.8), line('M46 36 L46 88 M74 36 L74 88', C.grey, 3),
    rect(20, 50, 80, 36, '#9db3a0', 0, null), rect(20, 82, 80, 16, SLUDGE, 0, null), path('M20 82 C30 78 40 84 50 80 S70 84 80 80 S96 84 100 82', 'none', '#7b5a38', 1.6),
    ...range(5).map((i) => moving(`wsav${i}`, '0%{transform:translate(0,-24px);opacity:0}25%{opacity:1}100%{transform:translate(0,0);opacity:1}', { dur: 3, delay: i * 0.5 }, circle(28 + i * 16, 78, 1.8, SLUDGE, null))), pipe('M0 46 L20 46', BROWNP, 4), pipe('M100 54 L120 54', '#d9cbb3', 4), line('M40 30 L40 36 M80 30 L80 36', C.grey, 3), ring(60, 70, 44)),
  'watsew.slamtömning': all(section(76), lid(98, 78, 9, 3), rect(88, 82, 20, 26, CONC, 2, C.ink, 1.4), rect(90, 96, 16, 10, SLUDGE, 0, null),
    truckCab(52, 76, C.orange), ellipse(26, 52, 26, 14, '#d9dee4', C.ink, 1.6), rect(2, 62, 50, 6, C.dark, 1, C.ink, 1.2), circle(14, 68, 6, C.dark, C.ink, 1.4), circle(36, 68, 6, C.dark, C.ink, 1.4),
    pipe('M48 50 C70 40 92 50 96 98', '#3d3f4a', 4),
    ...range(4).map((i) => moving(`wsst${i}`, '0%{transform:translate(18px,40px);opacity:0}30%,70%{opacity:1}100%{transform:translate(0,0);opacity:0}', { dur: 1.8, delay: i * 0.45 }, circle(72, 46, 2.4, SLUDGE, null))), ring(96, 92, 16)),

  // ── 4134 Reningsverk ──
  'watsew.reningssteg': all(...[0, 1, 2].map((i) => all(rect(6 + i * 38, 70 - i * 18, 32, 24, [SEW, '#a9b38a', WATER][i]!, 2, C.ink, 1.6), T(22 + i * 38, 66 - i * 18 - 6, String(i + 1), 13))),
    arrow(36, 70, 46, 62, C.ink, 2), arrow(74, 52, 84, 44, C.ink, 2), path('M6 94 L44 94 L44 76 L82 76 L82 58 L114 58', 'none', HL, 2.6), ground(104), drop(98, 30, 1.6), check(110, 22, 0.9)),
  'watsew.galler': all(rect(0, 0, 120, 112, '#e9eef2', 0, null), rect(0, 60, 120, 52, '#9db3a0', 0, null), waves(4, 66, 40, '#c7d6c9'), waves(80, 66, 36, '#c7d6c9'), arrow(10, 86, 34, 86, C.white, 2),
    ...range(8).map((i) => rect(48 + i * 4.5, 20, 3, 92, IRON, 1, C.ink, 0.8)), rect(44, 16, 40, 6, IRON, 1, C.ink, 1.2),
    path('M40 64 C44 60 50 62 52 70 L50 82 C46 80 42 74 40 64 Z', C.white, C.ink, 1.2), rect(44, 86, 8, 16, '#7fbf8f', 3, C.ink, 1.1), path('M42 42 L52 46 L50 54 L40 50 Z', C.pink, C.ink, 1), frame(36, 14, 52, 96)),
  'watsew.sandfång': all(rect(0, 0, 120, 112, '#e9eef2', 0, null), rect(4, 40, 112, 66, CONC, 2, C.ink, 1.8), rect(8, 44, 104, 46, '#a8b8a4', 0, null), arrow(14, 54, 46, 54, C.white, 2.4), arrow(70, 54, 102, 54, C.white, 2.4),
    path('M8 106 L8 92 C30 86 50 84 70 88 C90 92 104 92 112 90 L112 106 Z', '#e2c27a', C.ink, 1.2), ...range(26).map((i) => ellipse(12 + ((i * 31) % 98), 94 + ((i * 7) % 10), 2.4, 1.8, i % 3 ? '#c9a35a' : '#9a8a6a', C.ink, 0.5)),
    ...tup([[30, 70, 0], [60, 76, 0], [90, 72, 0]]).map(([x, y]) => all(ellipse(x, y, 2.4, 1.8, '#c9a35a', C.ink, 0.5), line(`M${x} ${y + 4} l0 6`, C.ink, 1, '1.5 1.5'))), frame(4, 84, 112, 26)),
  'watsew.sedimentera': all(rect(16, 14, 88, 92, 'rgba(220,240,252,0.8)', 3, C.ink, 1.8), rect(18, 30, 84, 74, '#d6e2d0', 0, null),
    ...range(12).map((i) => moving(`wssd${i}`, '0%{transform:translate(0,-46px);opacity:0}20%{opacity:1}100%{transform:translate(0,0);opacity:1}', { dur: 4, delay: (i % 4) * 0.8 }, circle(24 + ((i * 29) % 74), 90 - ((i * 11) % 14), 1.6, SEW, null))),
    path('M18 104 L18 96 C40 92 70 94 102 96 L102 104 Z', SLUDGE, null), frame(14, 88, 92, 20), ...[40, 60, 80].map((x) => line(`M${x} 44 l0 12`, '#7b5a38', 1.2, '2 2')), line('M110 40 L110 92', C.ink, 1.6), path('M106 86 L110 94 L114 86', 'none', C.ink, 1.6)),
  'watsew.biologisk-rening': all(rect(4, 30, 112, 78, CONC, 3, C.ink, 1.8), rect(8, 40, 104, 64, '#a9c3a0', 0, null), waves(12, 44, 96, '#d3e3cc'),
    ...range(10).map((i) => moving(`wsbr${i}`, '0%{transform:translate(0,30px);opacity:0}30%{opacity:1}100%{transform:translate(0,-10px);opacity:0}', { dur: 2.4, delay: i * 0.24 }, circle(14 + i * 10, 80, 2.2, C.white, '#7fa0b0', 0.8))),
    bacterium(36, 66, 1.4, -10), bacterium(78, 84, 1.4, 15), bacterium(92, 60, 1.2, -20), ...tup([[48, 62], [52, 66], [66, 86], [100, 66]]).map(([x, y]) => circle(x, y, 1.4, SEW, null)),
    line(range(10).map((i) => `M${14 + i * 10} 100 l0 3`).join(' '), C.grey, 2), pipe('M4 104 L116 104', C.grey, 2), ring(36, 66, 16)),
  'watsew.kemisk-rening': all(rect(4, 46, 112, 62, CONC, 3, C.ink, 1.8), rect(8, 54, 104, 50, '#b9c9b4', 0, null), rect(18, 8, 26, 30, '#f2c14e', 3, C.ink, 1.6), rect(24, 2, 14, 6, C.dark, 1, C.ink, 1),
    line('M31 38 L31 48', C.dark, 2), moving('wskr', '0%{transform:translate(0,-8px);opacity:0}40%{opacity:1}100%{transform:translate(0,10px);opacity:0}', { dur: 1.4 }, drop(31, 52, 0.8, '#f2c14e')),
    ...tup([[50, 64], [66, 70], [82, 62], [96, 74], [58, 80], [88, 86]]).map(([x, y]) => path(`M${x - 4} ${y} C${x - 4} ${y - 4} ${x + 4} ${y - 5} ${x + 5} ${y} C${x + 3} ${y + 4} ${x - 3} ${y + 4} ${x - 4} ${y} Z`, '#c9a35a', C.ink, 0.8)),
    ...[56, 76, 96].map((x) => line(`M${x} 90 l0 6`, C.ink, 1.2, '1.5 1.5')), rect(8, 98, 104, 6, SLUDGE, 0, null), frame(14, 0, 34, 52)),
  'watsew.rötkammare': all(rect(0, 0, 120, 112, SKY, 0, null), path('M36 108 C20 90 20 40 36 20 C44 10 56 10 64 20 C80 40 80 90 64 108 Z', '#c9ccd2', C.ink, 1.8), line('M30 40 L70 40 M26 70 L74 70', '#a7abb3', 1.4),
    pipe('M50 14 L50 6 L96 6 L96 40', C.yellow, 3), rect(86, 40, 22, 22, C.dark, 2, C.ink, 1.4), path('M97 58 C91 58 90 50 94 46 C95 50 97 50 97 48 C97 44 100 42 101 40 C103 44 105 48 104 52 C104 56 101 58 97 58 Z', C.orange, C.ink, 1),
    ring(50, 62, 40), ground()),
  'watsew.läkemedelsrest': all(rect(0, 0, 120, 112, '#eef5f8', 0, null), path('M56 8 C74 32 92 52 92 72 C92 94 74 106 56 106 C38 106 20 94 20 72 C20 52 38 32 56 8 Z', WATER, C.ink, 2),
    capsule(46, 66, 20, 1), capsule(68, 84, -30, 1), pill(64, 58, 3.6, C.yellow), pill(44, 88, 3.6), pill(74, 70, 3, C.pink), ring(56, 74, 30),
    greyed(fish(104, 100, 0.9))),
  'watsew.slam.2': all(rect(0, 0, 120, 112, '#eef1f4', 0, null), pipe('M0 30 L46 30 L46 44', C.grey, 8), path('M42 46 C40 60 46 70 44 80', 'none', SLUDGE, 7), path('M42 46 C40 60 46 70 44 80', 'none', '#7b5a38', 2),
    path('M14 108 L20 78 L100 78 L106 108 Z', '#3f7f4a', C.ink, 1.8), path('M22 80 C30 66 44 62 52 66 C62 58 82 62 98 80 Z', SLUDGE, C.ink, 1.4), path('M40 70 C44 68 48 68 50 70 M70 68 C74 66 80 68 82 70', 'none', '#8a6a48', 1.6), circle(62, 72, 2, '#a68660', null),
    ring(60, 74, 34), ground()),

  // ── 4135 Dagvatten ──
  'watsew.hårdgjord': all(rect(0, 0, 120, 30, '#dde6ee', 0, null), cloud(60, 14, 1), rain(30, 24, 60, 12, 8), rect(0, 40, 120, 72, SOIL, 0, null),
    rect(0, 40, 82, 14, ASPH, 0, C.ink, 1.4), line('M10 47 L24 47 M40 47 L54 47', C.white, 1.6), ...tup([[20, 38], [44, 37], [66, 38]]).map(([x, y]) => all(drop(x, y, 0.8), arrow(x + 4, y + 1, x + 14, y + 1, DEEP, 1.4))),
    frame(2, 34, 80, 24), greyed(rect(86, 40, 34, 8, GRASS, 0, null), ...[94, 104, 112].map((x) => line(`M${x} 50 l0 18`, DEEP, 1.4, '2 2')))),
  'watsew.avrinning': all(rect(0, 0, 120, 112, '#dde6ee', 0, null), cloud(30, 14, 0.9), rain(14, 22, 36, 14, 7), path('M0 44 L84 82 L120 82 L120 112 L0 112 Z', ASPH, C.ink, 1.4), rect(84, 82, 36, 30, SOIL, 0, null),
    ...range(6).map((i) => moving(`wsar${i}`, '0%{transform:translate(-22px,-10px);opacity:0}25%,75%{opacity:1}100%{transform:translate(22px,10px);opacity:0}', { dur: 1.8, delay: i * 0.3 }, drop(18 + i * 12, 48 + i * 5.4, 0.9))),
    grating(88, 80, 20, 5), arrow(64, 70, 86, 80, DEEP, 2.4), frame(4, 40, 112, 46)),
  'watsew.rännsten': all(rect(0, 0, 120, 40, '#dde6ee', 0, null), path('M0 40 L120 40 L120 70 L0 70 Z', '#c9c4bb', C.ink, 1.2), line('M0 55 L120 55', '#b5afa5', 1), path('M0 70 L120 70 L120 76 L0 76 Z', '#9e9a92', C.ink, 1.2),
    path('M0 76 L120 76 L120 88 L0 88 Z', '#8f949c', null), path('M0 88 L120 88 L120 112 L0 112 Z', ASPH, null), path('M0 80 C30 78 60 84 120 80 L120 86 L0 86 Z', WATER, null), moving('wsrn', '0%{transform:translate(-12px,0)}100%{transform:translate(0,0)}', { dur: 1.2 }, waves(6, 82, 84)), grating(94, 77, 20, 10), arrow(30, 98, 60, 98, C.white, 2), frame(2, 74, 116, 16)),
  'watsew.gatubrunn': all(rect(0, 0, 120, 112, ASPH2, 0, null), rect(0, 0, 26, 112, '#c9c4bb', 0, C.ink, 1.2), rect(26, 0, 6, 112, '#9e9a92', 0, C.ink, 1), grating(40, 40, 40, 30),
    path('M32 20 C40 30 44 36 48 42 M32 90 C40 82 46 76 50 70 M100 30 C92 36 86 40 80 44', 'none', WATER, 3), ...tup([[46, 46], [64, 52], [56, 64]]).map(([x, y], i) => moving(`wsgb${i}`, '0%{transform:translate(0,-10px);opacity:0}40%{opacity:1}100%{transform:translate(0,4px);opacity:0}', { dur: 1.4, delay: i * 0.45 }, drop(x, y, 0.8))), ring(60, 55, 30)),
  'watsew.regnbädd': all(rect(0, 0, 120, 112, '#dde6ee', 0, null), cloud(84, 14, 0.8), rain(70, 22, 34, 12, 6), rect(0, 60, 120, 52, SOIL, 0, null), rect(0, 54, 40, 8, ASPH, 0, C.ink, 1.2), rect(40, 54, 4, 6, '#9e9a92', 0, null),
    path('M44 60 C52 76 92 76 104 60 Z', '#7a5a3a', C.ink, 1.4), path('M50 66 C60 72 86 72 98 66', 'none', WATER, 3), ...[56, 68, 80, 92].map((x) => all(line(`M${x} 66 L${x} 48`, '#3f7f4a', 2), ellipse(x - 3, 52, 4, 2, GRASS, null), ellipse(x + 3, 48, 4, 2, GRASS, null))),
    rect(104, 54, 16, 8, GRASS, 0, null), waIn('wsrb2', -14, -4, arrow(20, 52, 46, 60, DEEP, 2)), waGrow('wsrb3', path('M50 66 C60 72 86 72 98 66', 'none', WATER, 3)), ring(74, 62, 30)),
  'watsew.infiltrera.2': all(rect(0, 0, 120, 30, '#dde6ee', 0, null), rain(20, 6, 80, 18, 10), rect(0, 30, 120, 82, SOIL, 0, null), line('M0 30 L120 30', GRASS, 4), line(range(20).map((i) => `M${3 + i * 6} 30 l-1 -4`).join(' '), GRASS, 1.4),
    rect(0, 94, 120, 18, '#9fc4dc', 0, null), waves(6, 98, 108, '#cfe3ef'), ...range(6).map((i) => moving(`wsin${i}`, '0%{transform:translate(0,-40px);opacity:0}25%{opacity:1}100%{transform:translate(0,14px);opacity:0}', { dur: 2.6, delay: i * 0.4 }, drop(14 + i * 18, 64, 0.9))),
    arrow(108, 40, 108, 88, DEEP, 2), frame(4, 34, 112, 58)),
  'watsew.dagvattendamm': all(rect(0, 0, 120, 112, '#dde6ee', 0, null), rect(0, 40, 120, 72, GRASS, 0, null), ...[10, 26, 42].map((x) => rect(x, 22, 12, 18, '#d9d4c8', 1, C.ink, 1.2)),
    pipe('M30 40 L30 56 L40 62', CONC, 6), ellipse(70, 80, 42, 20, WATER, C.ink, 1.6), ...range(3).map((i) => moving(`wsdd${i}`, '0%{transform:translate(-6px,-4px);opacity:0}30%{opacity:1}100%{transform:translate(6px,6px);opacity:0}', { dur: 1.5, delay: i * 0.5 }, drop(44, 66, 0.8))), waves(46, 80, 48), ...[34, 38, 102, 106].map((x) => line(`M${x} 80 l0 -14`, '#3f7f4a', 1.8)),
    path('M76 74 C80 70 86 70 88 74 L92 72 L90 76 C88 80 80 80 76 76 Z', C.white, C.ink, 1), ring(70, 80, 46)),
  'watsew.fördröja': all(rect(0, 0, 120, 112, '#eef3f7', 0, null), cloud(26, 14, 0.9), rain(12, 22, 30, 10, 6), pipe('M0 44 L28 44 L28 56', DEEP, 12), path('M14 58 L106 58 L100 100 L20 100 Z', CONC, C.ink, 1.6), rect(20, 66, 82, 32, WATER, 0, null), waves(24, 70, 72),
    pipe('M100 92 L120 92', DEEP, 3), ...range(3).map((i) => moving(`wsfd${i}`, '0%{transform:translate(-8px,0);opacity:0}30%,70%{opacity:1}100%{transform:translate(10px,0);opacity:0}', { dur: 3.6, delay: i * 1.2 }, drop(112, 100, 0.8))),
    circle(82, 30, 12, C.white, C.ink, 1.6), line('M82 30 L82 22 M82 30 L88 32', C.ink, 1.8), frame(12, 54, 108, 50)),
  'watsew.källaröversvämning': all(rect(0, 0, 120, 50, '#dde6ee', 0, null), cloud(96, 12, 0.8), rain(80, 20, 30, 12, 5), rect(0, 50, 120, 62, SOIL, 0, null), line('M0 50 L120 50', GRASS, 3),
    rect(14, 10, 70, 40, '#f0dcc0', 0, C.ink, 1.6), rect(14, 54, 70, 50, '#ece6da', 0, C.ink, 1.8), line('M14 54 L84 54', C.ink, 2.4),
    moving('wskv', '0%{transform:translate(0,30px)}70%,100%{transform:translate(0,0)}', { dur: 3.4 }, rect(15.5, 72, 67, 30.5, 'rgba(140,199,232,0.85)', 0, null), waves(18, 74, 60), rect(30, 66, 14, 10, C.tan, 1, C.ink, 1.2)),
    circle(50, 102, 3, C.dark, null), frame(10, 52, 78, 56)),
  'watsew.backventil': all(rect(0, 0, 120, 112, '#f2eee6', 0, null), pipe('M4 60 L116 60', C.grey, 30), rect(4, 48, 112, 24, '#ece6da', 0, null), rect(60, 48, 56, 24, SEW, 0, null),
    path('M56 46 L56 74', 'none', C.ink, 4), path('M56 46 C62 52 62 68 56 74', '#3d3f4a', C.ink, 1.6), circle(56, 46, 3, C.dark, null), arrow(108, 60, 76, 60, C.white, 2.6), cross(42, 60, 7, C.red),
    house(26, 34, 0.8), ring(56, 60, 20)),

  // ── 4136 Pumpstationer ──
  'watsew.pumpstation': all(section(52), rect(10, 28, 36, 24, BRICK, 1, C.ink, 1.6), path('M6 28 L28 16 L50 28 Z', '#7d8794', C.ink, 1.4), rect(24, 38, 8, 14, C.dark, 1, C.ink, 1.2),
    rect(12, 56, 32, 48, CONC, 2, C.ink, 1.6), rect(14, 82, 28, 20, SEW, 0, null), pumpUnit(22, 102, 0.8), pumpUnit(36, 102, 0.8), pipe('M0 92 L12 92', BROWNP, 4), pipe('M36 82 L36 70 L120 40', BROWNP, 4), ...range(4).map((i) => moving(`wsps${i}`, '0%{transform:translate(-10px,3.6px);opacity:0}30%,70%{opacity:1}100%{transform:translate(10px,-3.6px);opacity:0}', { dur: 1.4, delay: i * 0.35 }, circle(56 + i * 16, f(62.9 - i * 5.7), 1.6, '#e9d3b0', null))), ring(28, 72, 30)),
  'watsew.tryckledning': all(section(80), path('M0 80 C40 80 70 30 120 24 L120 112 L0 112 Z', GRASS, null), path('M0 82 C40 82 70 32 120 26 L120 112 L0 112 Z', SOIL, null),
    pumpUnit(16, 100, 1), pipe('M24 96 C50 96 74 50 116 40', BROWNP, 6), ...range(4).map((i) => moving(`wstl${i}`, '0%{transform:translate(-10px,8px);opacity:0}30%,70%{opacity:1}100%{transform:translate(10px,-8px);opacity:0}', { dur: 1.6, delay: i * 0.4 }, arrow(44 + i * 18, 88 - i * 13, 54 + i * 18, 80 - i * 13, HL, 2))),
    circle(30, 82, 7, C.white, C.ink, 1.4), line('M30 82 L34 78', C.red, 1.6), frame(8, 34, 112, 74)),
  'watsew.brädda': all(rect(0, 0, 120, 60, '#dde6ee', 0, null), rect(0, 60, 120, 52, WATER, 0, null), waves(60, 72, 56), rect(0, 40, 40, 72, CONC, 1, C.ink, 1.6), rect(4, 44, 32, 30, SEW, 0, null),
    path('M36 44 C46 46 50 56 52 64', 'none', SEW, 7), path('M36 44 C46 46 50 56 52 64', 'none', C.ink, 0.8),
    waGrow('wsbd', path('M48 64 C60 60 80 66 92 74 C80 82 60 82 50 76 Z', 'rgba(138,106,58,0.7)', null)), ...tup([[66, 70, 1.4], [78, 74, 1.2], [58, 74, 1.1]]).map(([x, y, r]) => circle(x, y, r, SLUDGE, null)), cloud(90, 16, 0.8), rain(76, 24, 30, 12, 5), ring(52, 62, 22)),
  'watsew.igensatt': all(rect(0, 0, 120, 112, '#f2eee6', 0, null), pipe('M4 46 L116 46', C.grey, 30), rect(4, 34, 112, 24, '#ece6da', 0, null), rect(4, 34, 44, 24, WATER, 0, null),
    path('M48 34 C54 40 50 46 56 50 C52 54 56 58 50 58 L76 58 C70 54 74 50 70 46 C74 40 70 36 76 34 Z', C.white, C.ink, 1.2), path('M54 38 L70 42 M52 48 L72 50', 'none', '#c9c4bb', 1.4), path('M60 34 L76 34 L76 58 L66 58 C62 50 62 42 60 34 Z', FAT, C.ink, 1), cross(94, 46, 6, C.red), frame(44, 30, 36, 32),
    greyed(pipe('M4 92 L116 92', C.grey, 16), rect(4, 86, 112, 12, WATER, 0, null), arrow(30, 92, 90, 92, C.white, 2))),
  'watsew.drifttekniker': all(rect(0, 0, 120, 112, '#eef1f4', 0, null), rect(72, 30, 40, 50, '#d9dee4', 2, C.ink, 1.6), rect(76, 34, 32, 20, '#1f2b3a', 1, null), line('M78 50 L86 44 L92 48 L100 38 L106 40', C.green, 1.6), circle(82, 62, 3, C.red, null), circle(92, 62, 3, C.green, null), circle(102, 62, 3, C.yellow, null),
    rect(72, 80, 40, 32, '#c9ced4', 0, C.ink, 1.2), person(44, C.orange, { r: [16, 10], l: [-10, 18], hat: C.yellow }), rect(52, 50, 12, 16, C.dark, 2, C.ink, 1.2), rect(54, 52, 8, 12, '#bfe3f5', 1, null), line('M38 70 L50 70', C.white, 1.6), ground()),

  // ── 4137 Läckor och stopp ──
  'watsew.fuktfläck': all(rect(0, 0, 120, 30, '#ece9e2', 0, null), rect(0, 30, 120, 82, '#f6f2ea', 0, null), line('M0 30 L120 30', C.ink, 1.6),
    path('M30 30 C30 44 40 52 54 50 C62 58 78 56 84 46 C94 46 98 36 96 30 Z', '#c9b48a', null), path('M38 30 C40 40 48 44 56 42 C64 48 74 46 78 38 C84 38 88 34 88 30 Z', '#a8915f', null), path('M30 30 C30 44 40 52 54 50 C62 58 78 56 84 46 C94 46 98 36 96 30', 'none', '#8a734a', 1.2),
    drop(60, 62, 1), drop(60, 80, 0.8), ring(62, 40, 30), rect(0, 104, 120, 8, C.tan, 0, null)),
  'watsew.läckagevakt': all(rect(0, 0, 120, 112, '#eef1f4', 0, null), rect(10, 20, 56, 82, C.white, 4, C.ink, 1.6), rect(10, 20, 56, 12, '#e3e7ea', 4, C.ink, 1.2), circle(38, 64, 22, '#cfe6f5', C.ink, 1.6), circle(38, 64, 15, '#a9d3ef', null),
    ellipse(76, 104, 24, 4, WATER, null), circle(84, 98, 8, C.white, C.ink, 1.6), circle(84, 98, 3, C.red, null),
    waPulse('wslv', path('M96 90 C100 94 100 102 96 106 M102 86 C108 92 108 104 102 110', 'none', HL, 2), path('M72 90 C68 94 68 102 72 106', 'none', HL, 2)), ring(84, 98, 14), rect(0, 108, 120, 4, C.tan, 0, null)),
  'watsew.fettpropp': all(rect(0, 0, 120, 112, '#f2eee6', 0, null), g('translate(30 20) rotate(25)', ellipse(0, 0, 18, 6, C.dark, C.ink, 1.4), rect(16, -2, 24, 4, C.dark, 2, C.ink, 1)), path('M20 28 C22 34 20 40 22 46', 'none', '#e7c86a', 3),
    path('M6 46 L50 46 L46 54 L10 54 Z', C.silver, C.ink, 1.4), pipe('M28 54 L28 76 L116 76', C.grey, 18), rect(30, 68, 86, 16, '#ece6da', 0, null),
    path('M64 67 C70 70 66 76 72 80 C68 84 74 86 70 86 L96 86 C92 82 98 78 94 74 C98 70 92 68 96 67 Z', FAT, C.ink, 1.2), path('M72 72 C78 70 84 74 90 72', 'none', '#d6c27a', 1.2), ring(82, 76, 20)),
  'watsew.spolbil': all(rect(0, 0, 120, 112, '#dde6ee', 0, null), rect(0, 90, 120, 22, ASPH, 0, null), ellipse(46, 54, 40, 20, C.orange, C.ink, 1.6), line('M14 54 L78 54', '#d9772e', 1.2),
    path('M86 76 L86 44 L102 44 L112 58 L112 76 Z', C.orange, C.ink, 1.6), path('M90 48 L100 48 L107 58 L90 58 Z', '#dff1fb', C.ink, 1.1), rect(4, 74, 108, 6, C.dark, 1, C.ink, 1.2),
    ...[20, 40, 98].map((x) => all(circle(x, 82, 7, C.dark, C.ink, 1.4), circle(x, 82, 2.4, C.silver, null))), circle(14, 40, 8, C.dark, C.ink, 1.2), circle(14, 40, 4, C.grey, null),
    pipe('M10 46 C2 60 4 80 12 94', C.dark, 3), ellipse(14, 96, 10, 3, IRON, C.ink, 1.2), ground()),
  'watsew.rörbrott': all(rect(0, 0, 120, 70, '#dde6ee', 0, null), rect(0, 70, 120, 6, ASPH, 0, null), rect(0, 76, 120, 36, SOIL, 0, null), pipe('M0 96 L52 96 M68 96 L120 96', BLUEP, 12),
    path('M52 90 L56 96 L52 102 M68 90 L64 96 L68 102', 'none', C.ink, 1.6), path('M54 70 L58 74 L62 70 L66 74', 'none', C.ink, 1.6),
    moving('wsrb', '0%{transform:scale(1,.2);opacity:.3}40%,100%{transform:scale(1,1);opacity:1}', { dur: 1.6 }, path('M60 92 C50 70 42 40 34 24 M60 92 C60 70 60 40 60 16 M60 92 C70 70 78 40 86 24', 'none', WATER, 5)),
    ...tup([[34, 22], [60, 14], [86, 22], [44, 36], [76, 36]]).map(([x, y]) => drop(x, y, 1.1)), ellipse(30, 70, 24, 3, WATER, null), ellipse(92, 70, 24, 3, WATER, null), ring(60, 92, 14)),
  'watsew.nödvatten': all(rect(0, 0, 120, 112, '#eef3f7', 0, null), rect(4, 30, 60, 56, C.white, 6, C.ink, 1.8), rect(8, 34, 52, 30, WATER, 4, null), waves(12, 40, 44), drop(34, 74, 1.4, BLUEP),
    rect(4, 86, 60, 6, C.dark, 1, C.ink, 1.2), circle(18, 98, 6, C.dark, C.ink, 1.4), circle(50, 98, 6, C.dark, C.ink, 1.4), rect(64, 66, 10, 6, C.silver, 1, C.ink, 1.2), line('M72 72 L72 80', WATER, 2.4),
    bottle(72, 102, WATER, 0.8), person(98, C.green, { l: [-20, 30], r: [10, 24] }), frame(0, 26, 82, 82)),
  'watsew.spola.2': all(rect(0, 0, 120, 112, '#f2eee6', 0, null), pipe('M4 60 L116 60', C.grey, 28), rect(4, 49, 112, 22, '#ece6da', 0, null), pipe('M0 30 C10 30 16 46 16 60', '#2f4a7a', 3), rect(10, 56, 16, 8, C.dark, 2, C.ink, 1.2),
    ...range(5).map((i) => moving(`wssp${i}`, '0%{transform:translate(-20px,0);opacity:0}30%{opacity:1}100%{transform:translate(30px,0);opacity:0}', { dur: 1, delay: i * 0.2 }, line(`M${34 + i * 10} ${54 + (i % 3) * 5} l12 0`, DEEP, 3))),
    waIn('wssp9', -16, 0, path('M90 52 C98 50 96 58 104 56 C110 60 104 66 98 66 C92 70 88 62 90 52 Z', FAT, C.ink, 1), circle(110, 54, 2, SLUDGE, null), circle(112, 66, 2, SLUDGE, null)), frame(26, 44, 92, 32)),
};

function f(n: number): number { return +n.toFixed(1); }
