/**
 * Teknik & digital värld → Byggnad & infrastruktur → Vägar & broar, 4141–4147 (0.59): road layers, asphalt and
 * surfacing, junctions and interchanges, bridge types, tunnels, road works and road maintenance.
 * Recurring signs: the part that the word names is outlined in orange (ring or frame) and grey parts show what
 * the word is not. Asphalt is near-black, gravel beige, crushed stone blue-grey, rock brown-grey, water blue.
 * Words that are easy to mix up get clearly different scenes: the three road layers share one cross-section, but
 * slitlager has a tyre on the top black layer, bärlager weight arrows into the middle layer and
 * förstärkningslager big stones with frost below; grusväg (a pale road with a dust cloud in a forest) and
 * oljegrus (a dark speckled road by a red cottage); mitträcke (a close-up of the wire barrier) and mötesfri väg
 * (the whole 2+1 road seen from above); flaggvakt (a person with a red/green disc) and lotsbil (a car with a
 * yellow roof lamp leading a queue); vägbom (a still barrier arm) and stänga av (the arm swinging down in front
 * of a car); pylon (the tower framed) and snedkabelbro (the whole bridge with the cable fan); spännvidd (a
 * horizontal arrow between piers) and segelfri höjd (a vertical arrow from water to deck above a mast).
 * Digits and code signs only; no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waBob, waGrow, waIn, waPulse, waShake, waSpin, type Svg } from './kit';
import { HL } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const ASPH = '#3b3c44';
const ASPH2 = '#55565f';
const OLDASPH = '#7c7e86';
const GRAVEL = '#d8c39a';
const STONE = '#9aa6b4';
const STONE2 = '#7d8a99';
const ROCK = '#9a8f84';
const ROCK2 = '#7b7066';
const CLAY = '#b98d62';
const GRASS = '#7fb36a';
const WATER = '#8cc7e8';
const CONC = '#c2c2bb';
const STEEL = '#8e9fb3';
const SKY = '#e6f1f8';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 5, col, 2.6);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const sky = (h = 112) => rect(0, 0, 120, h, SKY, 0, null);
const cross = (x: number, y: number, s = 6, col: string = C.red) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 3);
const check = (x: number, y: number, s = 1, col: string = C.green) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 8, C.white, col, 2), line('M-4 0 L-1 3 L4 -3', col, 2.4));
const flake = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 -6 L0 6 M-5 -3 L5 3 M-5 3 L5 -3', '#5aa7d6', 1.6));
const dust = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 6, '#e8dcc2', null), circle(8, -3, 7, '#efe5d0', null), circle(15, 1, 5, '#f3ebdb', null));
const steam = (x: number, y: number) => all(circle(x, y, 4, '#e2e2e2', null), circle(x + 4, y - 6, 5, '#ececec', null), circle(x + 1, y - 13, 4, '#f2f2f2', null));
/** Small pebbles (angular when sharp = true) scattered in a box. */
const stones = (x: number, y: number, w: number, h: number, r: number, col: string, sharp = false, n = 0) => {
  const out: Svg[] = []; const cols = Math.max(1, Math.floor(w / (r * 2.4))); const rows = Math.max(1, Math.floor(h / (r * 2.2)));
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const cx = f1(x + r * 1.2 + i * (w - r * 2.4) / Math.max(1, cols - 1) + ((j + n) % 2 ? r * 0.6 : 0)); const cy = f1(y + r * 1.1 + j * (h - r * 2.2) / Math.max(1, rows - 1));
    if (cx > x + w - r * 0.5) continue;
    out.push(sharp ? path(`M${f1(cx - r)} ${f1(cy + r * 0.6)} L${f1(cx - r * 0.5)} ${f1(cy - r)} L${f1(cx + r * 0.8)} ${f1(cy - r * 0.7)} L${f1(cx + r)} ${f1(cy + r * 0.5)} Z`, col, C.ink, 0.8) : ellipse(cx, cy, r, r * 0.8, col, C.ink, 0.7));
  }
  return all(...out);
};
/** Road cross-section: top black wearing course, middle crushed-stone base, thick bottom of large stones, soil below. */
const xsec = (hl: 0 | 1 | 2 | -1) => all(
  rect(0, 98, 120, 14, CLAY, 0, null),
  rect(6, 66, 108, 32, '#c9bfae', 0, C.ink, 1.2), stones(6, 66, 108, 32, 5.4, STONE2, true),
  rect(10, 50, 100, 16, '#d6d1c6', 0, C.ink, 1.2), stones(10, 50, 100, 16, 2.6, STONE, true, 1),
  rect(14, 42, 92, 8, ASPH, 1, C.ink, 1.4),
  hl === 0 ? frame(10, 39, 100, 14) : hl === 1 ? frame(7, 48, 106, 20) : hl === 2 ? frame(3, 63, 114, 38) : '');
/** Car from the side, wheels on y. */
const car = (x: number, y: number, col: string = C.red, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-26 -6 L-26 -15 L-15 -17 L-8 -26 L10 -26 L19 -17 L27 -15 L27 -6 Z', col, C.ink, 1.4), path('M-5 -24 L3 -24 L3 -18 L-11 -18 Z M6 -24 L9 -24 L15 -18 L6 -18 Z', '#dff1fb', C.ink, 1),
  circle(-15, -6, 5.4, C.dark, C.ink, 1.2), circle(17, -6, 5.4, C.dark, C.ink, 1.2), circle(-15, -6, 2, C.silver, null), circle(17, -6, 2, C.silver, null));
/** Car seen from above, centred, pointing up (rot rotates). */
const carTop = (x: number, y: number, col: string = C.red, rot = 0, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-6, -10, 12, 20, col, 3.5, C.ink, 1.2), rect(-4.5, -6, 9, 5, '#dff1fb', 1.5, C.ink, 0.8), rect(-4.5, 4, 9, 3, '#dff1fb', 1, C.ink, 0.8));
/** Truck from the side, wheels on y. */
const truck = (x: number, y: number, col: string = C.orange, s = 1, load: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-30, -28, 36, 20, col, 2, C.ink, 1.4), load, path('M6 -24 L19 -24 L27 -16 L27 -8 L6 -8 Z', col, C.ink, 1.4), path('M10 -21 L18 -21 L23 -15 L10 -15 Z', '#dff1fb', C.ink, 1),
  circle(-20, -7, 5.4, C.dark, C.ink, 1.2), circle(-6, -7, 5.4, C.dark, C.ink, 1.2), circle(18, -7, 5.4, C.dark, C.ink, 1.2));
/** Standing person, feet at (x, 112); arms to (lx, ly), (rx, ry) relative to the neck; vest = high-vis. */
const person = (x: number, top: string, o: { s?: number; l?: [number, number]; r?: [number, number]; hat?: string; vest?: boolean } = {}) => {
  const s = o.s ?? 1, [lx, ly] = o.l ?? [-12, 22], [rx, ry] = o.r ?? [12, 22];
  return g(`translate(${x} 112) scale(${s})`, line('M-5 0 L-4 -26 M5 0 L4 -26', C.navy, 7), rect(-11, -56, 22, 32, top, 6, C.ink, 1.6),
    o.vest ? all(rect(-11, -56, 22, 32, C.orange, 6, C.ink, 1.6), line('M-11 -40 L11 -40 M-11 -34 L11 -34', '#f4f4ee', 2.4)) : '',
    line(`M-9 -52 L${lx} ${-56 + ly}`, C.ink, 6.4), line(`M-9 -52 L${lx} ${-56 + ly}`, o.vest ? C.orange : top, 4.4), circle(lx, -56 + ly, 3.2, C.skin, C.ink, 1.2),
    line(`M9 -52 L${rx} ${-56 + ry}`, C.ink, 6.4), line(`M9 -52 L${rx} ${-56 + ry}`, o.vest ? C.orange : top, 4.4), circle(rx, -56 + ry, 3.2, C.skin, C.ink, 1.2),
    circle(0, -67, 10, C.skin, C.ink, 1.6), o.hat ? path('M-12 -70 C-12 -84 12 -84 12 -70 L14 -69 L-14 -69 Z', o.hat, C.ink, 1.6) : path('M-10 -68 C-10 -81 10 -81 10 -68 C6 -73 -6 -73 -10 -68 Z', C.hair, null),
    circle(-3.5, -66, 1.2, C.ink, null), circle(3.5, -66, 1.2, C.ink, null), path('M-3 -61 C-1 -59 1 -59 3 -61', 'none', C.ink, 1.2));
};
/** Palm seen from the side (no pointing finger), wrist at (x, y). */
const palm = (x: number, y: number, rot = 0, sleeve: string = C.navy) => g(`translate(${x} ${y}) rotate(${rot})`, path('M0 0 L14 -2 C20 -3 26 -2 30 0 C32 2 30 5 26 5 L20 5 C22 7 21 10 18 10 L4 10 C0 10 -2 6 0 0 Z', C.skin, C.ink, 1.4), rect(-12, -1, 14, 11, sleeve, 2, C.ink, 1.4));
/** Traffic cone, base centre at (x, y). */
const cone = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-9, -3, 18, 3, C.orange, 1, C.ink, 1.2), path('M-6 -3 L-1.6 -24 L1.6 -24 L6 -3 Z', C.orange, C.ink, 1.2), path('M-4.3 -11 L4.3 -11 L3.6 -15 L-3.6 -15 Z', C.white, null));
/** Perspective road from the bottom (wide) to the horizon at y = hy. */
const road = (hy = 40, col: string = ASPH, edge = true, centre = true) => all(
  path(`M8 112 L52 ${hy} L68 ${hy} L112 112 Z`, col, C.ink, 1.4),
  edge ? line(`M18 112 L54 ${hy} M102 112 L66 ${hy}`, C.white, 1.6) : '',
  centre ? line(`M60 112 L60 ${hy}`, C.white, 2, '7 6') : '');
const grassBg = (hy = 40) => all(rect(0, 0, 120, hy, SKY, 0, null), rect(0, hy, 120, 112 - hy, GRASS, 0, null));
/** Bridge pier (concrete) from deck y to the bottom. */
const pier = (x: number, y: number, w = 8, y2 = 112) => rect(x - w / 2, y, w, y2 - y, CONC, 1, C.ink, 1.4);
const deck = (x1: number, x2: number, y: number, h = 7, col: string = CONC) => rect(x1, y, x2 - x1, h, col, 1, C.ink, 1.6);
const river = (y = 96) => all(rect(0, y, 120, 112 - y, WATER, 0, null), line(`M8 ${y + 6} q6 -3 12 0 t12 0 M60 ${y + 10} q6 -3 12 0 t12 0`, C.white, 1.2));
const boat = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-14 0 L14 0 L10 6 L-10 6 Z', C.white, C.ink, 1.4), line('M0 0 L0 -34', C.dark, 1.6), path('M0 -32 L12 -4 L0 -4 Z', '#f5f0e0', C.ink, 1.2));
const mountain = (col: string = ROCK) => path('M0 112 L0 60 L22 34 L42 46 L64 18 L92 40 L120 30 L120 112 Z', col, C.ink, 1.6);
const portal = (x: number, y: number, r: number) => all(path(`M${x - r - 5} ${y} L${x - r - 5} ${y - r} A${r + 5} ${r + 5} 0 0 1 ${x + r + 5} ${y - r} L${x + r + 5} ${y} Z`, CONC, C.ink, 1.6), path(`M${x - r} ${y} L${x - r} ${y - r + 2} A${r} ${r} 0 0 1 ${x + r} ${y - r + 2} L${x + r} ${y} Z`, '#1f2027', C.ink, 1.2));
/** Rock texture lines in a box. */
const rockLines = (x: number, y: number, w: number, h: number) => line(range(Math.floor(w / 18)).map((i) => `M${x + 6 + i * 18} ${y + 4 + (i % 3) * 6} l8 5 l-3 7`).join(' ') + ' ' + range(Math.floor(w / 22)).map((i) => `M${x + 12 + i * 22} ${y + h - 10 - (i % 2) * 8} l6 -4 l5 3`).join(' '), ROCK2, 1.2);
const excavator = (x: number, y: number, s = 1, armRot = 0) => g(`translate(${x} ${y}) scale(${s})`, rect(-22, -10, 40, 10, C.dark, 4, C.ink, 1.4), ...[-16, -6, 4, 12].map((cx) => circle(cx, -5, 3, C.grey, null)),
  rect(-18, -26, 30, 16, C.yellow, 2, C.ink, 1.4), rect(-16, -38, 14, 14, C.yellow, 2, C.ink, 1.4), rect(-14, -36, 10, 8, '#dff1fb', 1, C.ink, 1),
  g(`translate(10 -22) rotate(${armRot})`, line('M0 0 L22 -18 L38 2', C.ink, 6), line('M0 0 L22 -18 L38 2', C.yellow, 4), path('M34 0 L46 4 L42 14 L32 10 Z', C.dark, C.ink, 1.2)));
const coin = (x: number, y: number) => all(ellipse(x, y, 9, 3.4, C.gold, C.ink, 1.2), line(`M${x - 9} ${y} L${x - 9} ${y + 3} M${x + 9} ${y} L${x + 9} ${y + 3}`, C.ink, 1.2), path(`M${x - 9} ${y + 3} A9 3.4 0 0 0 ${x + 9} ${y + 3}`, 'none', C.ink, 1.2));
const coins = (x: number, y: number, n: number) => all(...range(n).map((i) => coin(x, y - i * 4)));
const lamp = (x: number, y: number) => all(rect(x - 4, y - 3, 8, 4, C.yellow, 1.5, C.ink, 1), line(`M${x - 8} ${y - 6} l-3 -2 M${x + 8} ${y - 6} l3 -2 M${x} ${y - 7} l0 -3`, C.gold, 1.6));
/** Red-white barrier arm from a post at (x, y), length len, rotated (0 = horizontal to the right). */
const barrier = (x: number, y: number, len: number, rot = 0) => all(rect(x - 4, y - 4, 8, 112 - y + 4, C.grey, 1, C.ink, 1.4),
  g(`translate(${x} ${y}) rotate(${rot})`, rect(0, -3.5, len, 7, C.white, 2, C.ink, 1.4), ...range(Math.floor(len / 14)).map((i) => rect(6 + i * 14, -3.5, 7, 7, C.red, 0, null)), rect(0, -3.5, len, 7, 'none', 2, C.ink, 1.4)), circle(x, y, 4, C.dark, C.ink, 1.2));

export const ROADB_MOTIFS: Record<string, Svg> = {
  // ── 4141 Vägens lager ──
  'roadb.vägbygge': all(sky(70), rect(0, 70, 120, 42, CLAY, 0, null), path('M0 90 L120 90 L120 104 L0 104 Z', GRAVEL, C.ink, 1.2), path('M0 90 L52 90 L52 104 L0 104 Z', ASPH, C.ink, 1.2), stones(54, 91, 66, 12, 2.2, STONE, true),
    truck(88, 90, C.orange, 0.9, path('M-30 -28 L6 -28 L6 -34 L-30 -40 Z', GRAVEL, C.ink, 1.2)), excavator(30, 90, 0.8, -10), cone(8, 104, 0.6), cone(112, 112, 0.6), ground()),
  'roadb.vägbana': all(grassBg(40), road(40), frame(6, 38, 108, 76), car(60, 96, C.red, 0.7), greyed(path('M0 112 L8 112 L48 40 L0 40 Z', GRASS, null), path('M112 112 L120 112 L120 40 L72 40 Z', GRASS, null))),
  'roadb.vägren': all(grassBg(40), road(40), path('M102 112 L66 40 L68 40 L112 112 Z', ASPH2, null), line('M102 112 L66 40', C.white, 2.2), car(98, 104, C.denim, 0.55), path('M110 100 l4 8 l-8 0 Z', C.red, C.ink, 1), path('M96 112 L66 46 L70 40 L114 112 Z', 'none', HL, 2.6)),
  'roadb.slitlager': all(sky(40), xsec(0), g('translate(60 30)', circle(0, 0, 13, C.dark, C.ink, 1.6), circle(0, 0, 6, C.silver, C.ink, 1.2), line('M-12 4 L12 4', C.grey, 1)), ...range(4).map((i) => circle(42 + i * 9, 38 - (i % 2) * 3, 1.3, ASPH2, null)), arrow(86, 34, 104, 34, C.grey, 2)),
  'roadb.bärlager': all(sky(40), xsec(1), truck(60, 40, C.green, 0.75), ...[36, 60, 84].map((x, i) => waIn(`rbb${i}`, 0, -10, arrow(x, 36, x, 58, HL, 3)))),
  'roadb.förstärkningslager': all(sky(40), xsec(2), ...[18, 42, 66, 90].map((x) => flake(x + 6, 106, 0.9)), greyed(car(60, 42, C.red, 0.6))),
  'roadb.makadam': all(path('M10 100 L30 54 L60 40 L92 56 L110 100 Z', '#c9cdd3', C.ink, 1.6), stones(18, 56, 88, 44, 4.4, STONE, true), path('M86 18 L96 70', 'none', C.brown, 3), path('M90 66 L104 64 L106 80 L94 82 Z', C.grey, C.ink, 1.4), ring(58, 70, 26),
    greyed(ellipse(104, 104, 9, 4, GRAVEL, C.ink, 1), circle(100, 103, 1.6, '#c4a670', null), circle(106, 104, 1.8, '#c4a670', null)), ground()),
  'roadb.markduk': all(rect(0, 70, 120, 42, CLAY, 0, null), path('M4 84 L84 84 L96 96 L16 96 Z', '#f0efe8', C.ink, 1.4), line('M24 88 L80 88 M28 92 L86 92', '#d6d4ca', 1), ellipse(92, 82, 8, 14, '#f0efe8', C.ink, 1.6), ellipse(92, 82, 3, 5, '#d6d4ca', C.ink, 1),
    path('M10 84 L34 84 L40 96 L14 96 Z', STONE, null), stones(10, 84, 28, 12, 2.4, STONE2, true), frame(2, 78, 108, 24), ground()),
  'roadb.packa.2': all(rect(0, 92, 120, 20, CLAY, 0, null), rect(0, 86, 60, 6, '#c9bfae', 0, C.ink, 1), stones(60, 80, 60, 12, 2.6, STONE, true),
    moving('rbp', '0%{transform:translate(18px,0)}100%{transform:translate(-6px,0)}', { dur: 3 }, waShake('rbp2', rect(46, 74, 28, 12, C.yellow, 2, C.ink, 1.4), rect(42, 84, 36, 4, C.dark, 1, C.ink, 1.2), line('M74 76 L100 44', C.ink, 3), line('M96 40 L104 48', C.ink, 3)),
      line('M44 92 l-4 4 M52 92 l-2 5 M70 92 l2 5 M78 92 l4 4', HL, 1.6)), arrow(30, 70, 14, 70, HL, 2.4), ground()),
  'roadb.slänt': all(sky(112), path('M0 50 L44 50 L84 96 L104 96 L120 82 L120 112 L0 112 Z', GRASS, C.ink, 1.4), rect(0, 44, 46, 6, ASPH, 0, C.ink, 1.2), car(22, 44, C.red, 0.55), path('M84 96 L104 96 L98 104 L90 104 Z', WATER, C.ink, 1),
    path('M44 50 L84 96', 'none', HL, 5), ...[54, 64, 74].map((x) => line(`M${x} ${f1(50 + (x - 44) * 1.15 - 4)} l2 -5 m2 6 l3 -4`, '#4f8a3e', 1.2))),
  'roadb.bärighet': all(sky(112), river(98), deck(10, 110, 70, 8), pier(30, 78, 8, 98), pier(90, 78, 8, 98), truck(64, 70, C.red, 0.95, rect(-30, -34, 36, 6, STONE, 1, C.ink, 1)), arrow(56, 18, 56, 34, C.dark, 3),
    path('M84 36 A18 18 0 0 1 116 36', 'none', C.ink, 2), path('M84 36 A18 18 0 0 1 92 23', 'none', C.green, 4), path('M108 23 A18 18 0 0 1 116 36', 'none', C.red, 4), line('M100 36 L110 25', C.ink, 2.4), circle(100, 36, 2.4, C.ink, null), ring(100, 30, 18)),

  // ── 4142 Asfalt och beläggning ──
  'roadb.beläggning': all(rect(0, 60, 120, 52, GRAVEL, 0, null), stones(0, 60, 120, 52, 3, '#c4a670', false), path('M0 60 L120 60 L120 86 L66 86 L54 74 L0 74 Z', ASPH, C.ink, 1.6), path('M66 86 L54 74 L60 70 L74 82 Z', ASPH2, C.ink, 1.2), frame(2, 56, 116, 22), greyed(rect(86, 92, 30, 14, GRAVEL, 2, C.ink, 1)), ground()),
  'roadb.asfaltverk': all(sky(112), rect(70, 20, 16, 56, C.silver, 3, C.ink, 1.6), rect(90, 30, 14, 46, C.silver, 3, C.ink, 1.6), path('M68 76 L104 76 L96 86 L76 86 Z', C.grey, C.ink, 1.4), steam(78, 14), steam(96, 24),
    g('translate(30 58) rotate(-12)', rect(-26, -9, 52, 18, C.orange, 9, C.ink, 1.6), line('M-14 -9 L-14 9 M0 -9 L0 9 M14 -9 L14 9', C.ink, 1.2)), rect(20, 66, 4, 18, C.dark, 0, null), rect(40, 62, 4, 22, C.dark, 0, null), truck(86, 112, C.green, 0.8, path('M-30 -28 L6 -28 L6 -32 L-30 -32 Z', ASPH, C.ink, 1)), ground()),
  'roadb.asfaltläggare': all(rect(0, 100, 120, 12, GRAVEL, 0, null), moving('rbal', '0%{transform:translate(16px,0)}100%{transform:translate(0,0)}', { dur: 4 },
    rect(0, 100, 64, 6, ASPH, 0, C.ink, 1.2), rect(56, 76, 30, 22, C.yellow, 3, C.ink, 1.6), path('M84 72 L112 66 L112 92 L86 92 Z', C.yellow, C.ink, 1.6), path('M88 74 L110 70 L110 80 L88 82 Z', ASPH, null), rect(60, 64, 14, 12, C.yellow, 2, C.ink, 1.4), rect(62, 66, 10, 6, '#dff1fb', 1, C.ink, 1),
    rect(48, 92, 14, 10, C.dark, 1, C.ink, 1.2), circle(70, 100, 5, C.dark, C.ink, 1.2), circle(82, 100, 5, C.dark, C.ink, 1.2), steam(30, 92), steam(10, 92)), frame(46, 60, 70, 46)),
  'roadb.hjulspår': all(grassBg(40), road(40, ASPH2, true, false), path('M34 112 L56 40 L57 40 L42 112 Z', ASPH, null), path('M78 112 L63 40 L64 40 L86 112 Z', ASPH, null), ellipse(38, 100, 5, 3, WATER, null), ellipse(82, 96, 4, 2.4, WATER, null), ellipse(44, 80, 3, 1.6, WATER, null),
    path('M28 112 L54 44 L60 44 L46 112 Z', 'none', HL, 2.2), path('M74 112 L60 44 L66 44 L92 112 Z', 'none', HL, 2.2)),
  'roadb.skarv.2': all(rect(0, 0, 60, 112, ASPH, 0, null), rect(60, 0, 60, 112, OLDASPH, 0, null), ...range(6).map((i) => circle(70 + (i * 13) % 44, 12 + i * 17, 1.4, '#9a9ca3', null)), line('M60 0 L60 112', '#24252b', 2.4),
    line('M20 0 L20 112', C.white, 2.4, '10 8'), line('M100 0 L100 112', '#d8d8d0', 2.4, '10 8'), ring(60, 56, 18), ring(60, 56, 18), ...[24, 56, 88].map((y) => circle(60, y, 1.6, '#1a1b20', null))),
  'roadb.vägmarkering': all(rect(0, 0, 120, 112, ASPH, 0, null), line('M60 6 L60 112', C.white, 4, '12 9'), line('M14 0 L14 112 M106 0 L106 112', C.white, 3), path('M84 46 L92 34 L100 46 L95 46 L95 62 L89 62 L89 46 Z', C.white, null), frame(6, 4, 108, 104)),
  'roadb.oljegrus': all(sky(56), rect(0, 56, 120, 56, GRASS, 0, null), rect(66, 30, 40, 26, '#b8332e', 1, C.ink, 1.6), path('M62 32 L86 14 L110 32 Z', C.dark, C.ink, 1.6), rect(78, 40, 10, 16, C.white, 0, C.ink, 1.2), rect(94, 38, 8, 8, C.white, 0, C.ink, 1.2),
    path('M0 92 C30 82 60 70 80 58 L92 58 C74 74 44 96 20 112 L0 112 Z', '#4a4740', C.ink, 1.4), ...range(14).map((i) => circle(10 + (i * 37) % 72, 70 + (i * 23) % 38, 1.2, '#8a8070', null)), ring(40, 88, 18)),
  'roadb.grusväg': all(sky(50), rect(0, 50, 120, 62, GRASS, 0, null), ...[10, 24, 96, 110].map((x) => path(`M${x} 50 L${x + 8} 30 L${x + 16} 50 Z`, '#2f7a4a', C.ink, 1.2)), path('M40 112 L56 50 L64 50 L80 112 Z', GRAVEL, C.ink, 1.4),
    ...range(10).map((i) => circle(50 + (i * 7) % 24, 60 + i * 5, 1, '#b49b6b', null)), car(62, 76, C.denim, 0.45), dust(58, 88, 1)),
  'roadb.uppfart': all(sky(112), rect(56, 38, 54, 40, '#efe1c8', 1, C.ink, 1.6), path('M50 40 L83 16 L116 40 Z', C.red, C.ink, 1.6), rect(62, 52, 26, 26, C.grey2, 1, C.ink, 1.4), line('M62 58 L88 58 M62 64 L88 64 M62 70 L88 70', C.grey, 1), rect(96, 54, 10, 10, '#dff1fb', 0, C.ink, 1.2),
    rect(0, 100, 120, 12, ASPH, 0, null), path('M60 78 L90 78 L94 100 L56 100 Z', '#cfc8bb', C.ink, 1.4), car(75, 96, C.green, 0.5), frame(52, 76, 46, 28), rect(0, 78, 56, 22, GRASS, 0, null), rect(98, 78, 22, 22, GRASS, 0, null)),
  'roadb.marksten': all(...range(6).flatMap((j) => range(5).map((i) => rect((j % 2 ? -10 : 0) + i * 24, 30 + j * 14, 22, 12, j % 3 === 1 ? '#b7a99a' : '#c9bcae', 1.5, C.ink, 1.2))), rect(88, 2, 22, 12, '#c9bcae', 1.5, C.ink, 1.2),
    palm(70, 10, 0, C.green), frame(2, 28, 116, 84)),

  // ── 4143 Korsningar och trafikplatser ──
  'roadb.stopplinje': all(rect(0, 0, 120, 112, GRASS, 0, null), rect(36, 0, 48, 112, ASPH, 0, null), rect(0, 34, 120, 40, ASPH, 0, null), line('M60 74 L60 112', C.white, 2, '7 6'), rect(60, 78, 24, 5, C.white, 0, null), carTop(72, 96, C.red),
    rect(90, 82, 8, 22, C.dark, 2, C.ink, 1.2), circle(94, 87, 2.6, C.red, null), circle(94, 93, 2.4, '#555', null), circle(94, 99, 2.4, '#555', null), frame(57, 75, 30, 11)),
  'roadb.svängfält': all(rect(0, 0, 120, 112, GRASS, 0, null), rect(30, 0, 66, 112, ASPH, 0, null), rect(0, 20, 120, 30, ASPH, 0, null), line('M52 50 L52 112', C.white, 2), line('M74 56 L74 112', C.white, 2, '6 5'),
    path('M62 92 L62 76 C62 70 58 68 54 68 L54 64 L48 70 L54 76 L54 72 C56 72 58 73 58 76 L58 92 Z', C.white, null), carTop(85, 92, C.denim), carTop(63, 106, C.red), frame(53, 58, 21, 54)),
  'roadb.trafikö': all(rect(0, 0, 120, 112, GRASS, 0, null), rect(38, 0, 44, 112, ASPH, 0, null), rect(0, 38, 120, 36, ASPH, 0, null), path('M56 84 L64 84 L66 112 L54 112 Z', '#9ccf86', C.ink, 1.4), rect(57, 88, 6, 4, C.white, 0, null),
    line('M60 92 L60 104', C.dark, 1.6), circle(60, 90, 4, C.denim, C.ink, 1), carTop(47, 100, C.red), carTop(73, 98, C.yellow, 180), ring(60, 96, 16)),
  'roadb.körriktning': all(rect(0, 0, 120, 112, ASPH, 0, null), line('M60 0 L60 112', C.yellow, 2.4), line('M10 0 L10 112 M110 0 L110 112', C.white, 2),
    ...[20, 70].map((y) => all(path(`M30 ${y + 28} L30 ${y + 10} L24 ${y + 10} L35 ${y} L46 ${y + 10} L40 ${y + 10} L40 ${y + 28} Z`, C.white, null), path(`M80 ${y} L80 ${y + 18} L74 ${y + 18} L85 ${y + 28} L96 ${y + 18} L90 ${y + 18} L90 ${y} Z`, C.white, null))),
    waIn('rbk1', 0, 14, carTop(22, 58, C.red, 0, 0.8)), waIn('rbk2', 0, -14, carTop(100, 54, C.denim, 180, 0.8))),
  'roadb.trafikplats': all(rect(0, 0, 120, 112, GRASS, 0, null), rect(48, 0, 24, 112, ASPH, 0, null), line('M60 0 L60 112', C.white, 1.4, '5 4'), path('M0 50 L120 50 L120 64 L0 64 Z', ASPH2, C.ink, 1.4), line('M48 50 L48 64 M72 50 L72 64', C.ink, 1.6),
    path('M76 112 C76 86 84 72 100 64 L106 64 C90 72 82 86 82 112 Z', ASPH, null), path('M44 0 C44 26 36 42 20 50 L14 50 C30 42 38 26 38 0 Z', ASPH, null), path('M76 0 C76 26 84 42 100 50 L106 50 C90 42 82 26 82 0 Z', ASPH, null), path('M44 112 C44 86 36 72 20 64 L14 64 C30 72 38 86 38 112 Z', ASPH, null),
    carTop(54, 22, C.red, 180, 0.7), carTop(66, 92, C.yellow, 0, 0.7), carTop(92, 57, C.denim, 90, 0.7), frame(10, 4, 100, 104)),
  'roadb.påfart': all(rect(0, 0, 120, 112, GRASS, 0, null), rect(20, 0, 50, 112, ASPH, 0, null), line('M45 0 L45 112', C.white, 2, '8 6'), path('M70 30 C74 50 92 80 110 112 L92 112 C80 86 72 64 70 50 Z', ASPH, C.ink, 1.2), line('M70 30 L70 50', C.white, 2, '4 3'),
    carTop(33, 40, C.grey, 0, 0.8), waIn('rbpf', 14, 26, carTop(80, 74, C.red, -25, 0.8)), arrow(90, 100, 76, 60, HL, 2.6), path('M70 26 C74 50 94 84 114 112 L88 112 C78 88 70 64 68 46 Z', 'none', HL, 2.4)),
  'roadb.planskild': all(sky(112), rect(0, 92, 120, 20, GRASS, 0, null), line('M0 102 L120 102', C.dark, 2), line('M0 106 L120 106', C.dark, 2), ...range(15).map((i) => line(`M${4 + i * 8} 100 L${4 + i * 8} 108`, C.brown, 2)),
    path('M0 46 L120 46 L120 54 L0 54 Z', ASPH, C.ink, 1.6), pier(36, 54, 7, 98), pier(84, 54, 7, 98), car(60, 46, C.red, 0.6), check(108, 28), path('M0 46 L120 46', 'none', HL, 3),
    greyed(g('translate(4 4) scale(0.36)', rect(0, 50, 100, 14, ASPH, 0, null), line('M50 40 L50 70 M44 40 L44 70', C.dark, 3), barrier(10, 40, 40, 0)), cross(24, 30, 5, C.grey))),
  'roadb.blixtlåsprincipen': all(rect(0, 0, 120, 112, GRASS, 0, null), path('M24 112 L24 50 L44 30 L44 0 L76 0 L76 30 L96 50 L96 112 Z', ASPH, C.ink, 1.4), line('M60 112 L60 54', C.white, 2, '6 5'),
    cone(68, 58, 0.5), cone(76, 66, 0.5), carTop(60, 14, C.red, 0, 0.75), carTop(60, 34, C.yellow, 0, 0.75),
    moving('rbz1', '0%{transform:translate(-12px,40px)}60%,100%{transform:translate(0,0)}', { dur: 3.5 }, carTop(42, 70, C.red, 0, 0.75)), moving('rbz2', '0%{transform:translate(12px,40px)}60%,100%{transform:translate(0,0)}', { dur: 3.5, delay: 0.6 }, carTop(78, 82, C.yellow, 0, 0.75)),
    carTop(42, 98, C.red, 0, 0.75), carTop(78, 104, C.yellow, 0, 0.75)),
  'roadb.mitträcke': all(sky(70), rect(0, 70, 120, 42, ASPH, 0, null), line('M0 72 L120 72', C.white, 2), ...range(6).map((i) => rect(8 + i * 21, 46, 4, 40, '#c8ccd2', 1, C.ink, 1.2)), line('M0 54 L120 52 M0 60 L120 58 M0 66 L120 64', '#6f7a88', 2),
    car(28, 104, C.red, 0.55), greyed(car(96, 92, C.denim, 0.45)), frame(2, 42, 116, 48)),
  'roadb.mötesfri-väg': all(rect(0, 0, 120, 112, GRASS, 0, null), rect(22, 0, 76, 112, ASPH, 0, null), path('M60 0 L60 40 L48 56 L48 112', 'none', '#b8c2cc', 3), path('M60 0 L60 40 L48 56 L48 112', 'none', '#6f7a88', 1, ), line('M80 0 L80 40', C.white, 1.6, '6 5'), line('M35 56 L35 112', C.white, 1.6, '6 5'),
    carTop(70, 16, C.red, 0, 0.7), carTop(89, 26, C.yellow, 0, 0.7), carTop(36, 86, C.denim, 180, 0.7), carTop(76, 92, C.green, 0, 0.7), check(108, 100, 0.9)),

  // ── 4144 Brotyper ──
  'roadb.balkbro': all(sky(112), river(90), rect(0, 40, 14, 72, GRASS, 0, C.ink, 1.2), rect(106, 40, 14, 72, GRASS, 0, C.ink, 1.2), deck(10, 110, 40, 10), pier(44, 50, 8, 112), pier(76, 50, 8, 112), car(60, 40, C.red, 0.55), frame(6, 36, 108, 62)),
  'roadb.bågbro': all(sky(112), river(96), path('M0 40 L120 40 L120 112 L104 112 L104 96 A20 26 0 0 0 64 96 L64 112 L56 112 L56 96 A20 26 0 0 0 16 96 L16 112 L0 112 Z', '#b9a98f', C.ink, 1.6),
    line('M0 50 L120 50', '#9c8c72', 1), ...range(9).map((i) => line(`M${8 + i * 13} 40 L${8 + i * 13} 50`, '#9c8c72', 1)), path('M16 96 A20 26 0 0 1 56 96', 'none', HL, 3), path('M64 96 A20 26 0 0 1 104 96', 'none', HL, 3), rect(0, 34, 120, 6, '#8f826f', 1, C.ink, 1.2)),
  'roadb.brofäste': all(sky(112), river(98), path('M0 50 L44 50 L44 112 L0 112 Z', GRASS, C.ink, 1.2), path('M36 50 L52 50 L52 112 L28 112 L28 70 Z', CONC, C.ink, 1.6), deck(44, 120, 44, 8), pier(100, 52, 8, 112), rect(0, 44, 48, 6, ASPH, 0, C.ink, 1.2), frame(24, 40, 32, 72)),
  'roadb.vajer': all(...range(7).map((i) => { const a = (i / 7) * Math.PI * 2; return circle(f1(60 + Math.cos(a) * 14), f1(40 + Math.sin(a) * 14), 7, STEEL, C.ink, 1.2); }), circle(60, 40, 7, STEEL, C.ink, 1.2), ring(60, 40, 26),
    path('M10 96 C30 88 40 104 60 96 C80 88 90 104 110 96', 'none', C.ink, 9), path('M10 96 C30 88 40 104 60 96 C80 88 90 104 110 96', 'none', STEEL, 6), line(range(10).map((i) => `M${16 + i * 10} ${i % 2 ? 92 : 94} l5 6`).join(' '), '#5f6f82', 1.4)),
  'roadb.snedkabelbro': all(sky(112), river(96), deck(0, 120, 70, 7), pier(30, 77, 6, 112), pier(90, 77, 6, 112), path('M28 14 L32 14 L33 70 L27 70 Z', CONC, C.ink, 1.4), path('M88 14 L92 14 L93 70 L87 70 Z', CONC, C.ink, 1.4),
    line([2, 10, 18, 42, 50, 58].map((x) => `M30 ${18 + Math.abs(x - 30) / 6} L${x} 70`).join(' ') + ' ' + [62, 70, 78, 102, 110, 118].map((x) => `M90 ${18 + Math.abs(x - 90) / 6} L${x} 70`).join(' '), C.dark, 1.2), frame(0, 8, 120, 72)),
  'roadb.pylon': all(sky(112), river(96), greyed(deck(0, 120, 74, 7), line([20, 30, 40, 80, 90, 100].map((x) => `M60 ${20 + Math.abs(x - 60) / 4} L${x} 74`).join(' '), C.dark, 1.2)), path('M56 8 L64 8 L66 96 L54 96 Z', CONC, C.ink, 1.8), rect(55, 30, 10, 3, '#a9a9a2', 0, null), frame(48, 4, 24, 96)),
  'roadb.spännvidd': all(sky(112), river(96), deck(0, 120, 60, 8), pier(24, 68, 9, 112), pier(96, 68, 9, 112), arrow(54, 84, 30, 84, HL, 2.6), arrow(66, 84, 90, 84, HL, 2.6), line('M24 76 L24 92 M96 76 L96 92', HL, 2), boat(60, 104, 0.4)),
  'roadb.segelfri-höjd': all(sky(112), river(96), deck(0, 120, 30, 9), pier(14, 39, 8, 112), pier(106, 39, 8, 112), boat(52, 96, 1), arrow(86, 64, 86, 41, HL, 2.6), arrow(86, 72, 86, 94, HL, 2.6), line('M78 39 L94 39 M78 96 L94 96', HL, 2)),
  'roadb.klaffbro': all(sky(112), river(96), rect(0, 66, 30, 46, CONC, 0, C.ink, 1.4), rect(90, 66, 30, 46, CONC, 0, C.ink, 1.4), rect(0, 60, 30, 6, ASPH, 0, C.ink, 1.2), rect(90, 60, 30, 6, ASPH, 0, C.ink, 1.2),
    moving('rbkl1', '0%,15%{transform:rotate(62deg)}55%,100%{transform:rotate(0)}', { dur: 4 }, g('rotate(-62 30 63)', rect(30, 60, 30, 6, CONC, 1, C.ink, 1.4))), moving('rbkl2', '0%,15%{transform:rotate(-62deg)}55%,100%{transform:rotate(0)}', { dur: 4 }, g('rotate(62 90 63)', rect(60, 60, 30, 6, CONC, 1, C.ink, 1.4))),
    `<style data-wa>.wa-rbkl1{transform-origin:30px 63px}.wa-rbkl2{transform-origin:90px 63px}</style>`, boat(60, 96, 0.9), car(14, 60, C.red, 0.4)),
  'roadb.pontonbro': all(sky(80), rect(0, 80, 120, 32, WATER, 0, null), waBob('rbpb', 2.5, ...[18, 46, 74, 102].map((x) => rect(x - 10, 78, 20, 10, C.grey, 3, C.ink, 1.4)), deck(4, 116, 72, 6, '#c9a46a'), line('M4 66 L116 66', C.brown, 1.6), ...[10, 40, 70, 100].map((x) => line(`M${x} 66 L${x} 72`, C.brown, 1.6))),
    line('M8 96 q6 -3 12 0 t12 0 M64 102 q6 -3 12 0 t12 0', C.white, 1.2), frame(2, 62, 116, 30)),
  'roadb.viadukt': all(sky(112), path('M0 50 L0 112 L120 112 L120 50 L96 50 C80 96 40 96 24 50 Z', GRASS, C.ink, 1.4), deck(0, 120, 42, 8), ...[22, 40, 60, 80, 98].map((x) => pier(x, 50, 6, x === 60 ? 92 : x === 40 || x === 80 ? 84 : 60)),
    rect(30, 30, 44, 12, C.red, 3, C.ink, 1.4), rect(34, 33, 8, 5, '#dff1fb', 1, null), rect(46, 33, 8, 5, '#dff1fb', 1, null), rect(58, 33, 8, 5, '#dff1fb', 1, null), frame(2, 38, 116, 58)),
  'roadb.räcke': all(sky(112), rect(0, 90, 120, 22, '#c9a46a', 0, C.ink, 1.4), ...range(7).map((i) => line(`M${8 + i * 17} 90 L${8 + i * 17} 54`, C.dark, 3)), line('M2 54 L118 54', C.dark, 5), line('M2 72 L118 72', C.dark, 2), river(100), palm(46, 50, 0, C.green), frame(2, 46, 116, 46)),

  // ── 4145 Tunnlar ──
  'roadb.bergtunnel': all(sky(112), mountain(), rockLines(0, 40, 120, 60), portal(60, 112, 18), path('M44 112 L50 112 L56 100 L64 100 L70 112 L76 112', 'none', C.white, 1.4), ring(60, 92, 26)),
  'roadb.tunnelrör': all(rect(0, 0, 120, 112, ROCK, 0, null), rockLines(0, 0, 120, 112), ...[34, 86].map((x) => all(circle(x, 60, 24, '#2a2b33', C.ink, 2), circle(x, 60, 24, 'none', CONC, 3), rect(x - 18, 70, 36, 6, ASPH2, 0, null))),
    carTop(34, 74, C.red, 0, 0.6), carTop(86, 74, C.denim, 0, 0.6), arrow(28, 40, 40, 40, C.white, 2), arrow(92, 40, 80, 40, C.white, 2), ring(86, 60, 29)),
  'roadb.tunnelmynning': all(sky(112), rect(0, 20, 120, 92, ROCK, 0, null), rockLines(0, 20, 120, 80), portal(60, 112, 32), path('M30 112 L48 112 L56 90 L64 90 L72 112 L90 112', 'none', C.white, 1.4), path('M20 112 L20 76 A40 40 0 0 1 100 76 L100 112', 'none', HL, 3)),
  'roadb.sprängning': all(rect(0, 0, 120, 112, ROCK, 0, null), rockLines(0, 0, 120, 112), path('M0 112 L0 30 L30 20 L30 112 Z', ROCK2, C.ink, 1.2),
    waGrow('rbsp', path('M36 60 L48 40 L54 54 L68 32 L72 52 L90 44 L80 62 L98 70 L78 76 L86 94 L66 82 L58 100 L52 80 L34 88 L44 72 L28 66 Z', C.yellow, C.ink, 1.4), path('M50 60 L58 50 L62 60 L72 56 L66 66 L74 74 L62 72 L56 82 L52 72 L44 74 L48 66 Z', C.orange, null)),
    moving('rbsp2', '0%{transform:translate(0,0);opacity:0}30%{opacity:1}100%{transform:translate(26px,-22px);opacity:0}', { dur: 2.4 }, path('M90 40 l6 -2 l2 6 l-6 2 Z', ROCK2, C.ink, 1)), moving('rbsp3', '0%{transform:translate(0,0);opacity:0}30%{opacity:1}100%{transform:translate(-18px,-28px);opacity:0}', { dur: 2.4 }, path('M40 44 l6 -2 l2 6 l-6 2 Z', ROCK2, C.ink, 1))),
  'roadb.bergbult': all(rect(0, 0, 120, 112, ROCK, 0, null), rockLines(0, 0, 120, 60), path('M0 112 L0 70 C20 50 100 50 120 70 L120 112 Z', '#2a2b33', null), path('M0 70 C20 50 100 50 120 70', 'none', C.ink, 2),
    ...([[24, 62], [60, 55], [96, 62]] as [number, number][]).map(([x, y]) => all(line(`M${x} ${y} L${x} ${y - 40}`, STEEL, 3.4), rect(x - 5, y - 1, 10, 4, C.dark, 1, C.ink, 1))), frame(52, 10, 16, 52)),
  'roadb.sprutbetong': all(rect(0, 0, 120, 112, ROCK, 0, null), rockLines(0, 0, 120, 112), path('M0 0 L50 0 L50 112 L0 112 Z', CONC, C.ink, 1.4), stones(4, 6, 42, 100, 1.4, '#a9a9a2', false),
    rect(82, 70, 34, 28, C.yellow, 3, C.ink, 1.4), circle(88, 102, 6, C.dark, C.ink, 1.2), circle(108, 102, 6, C.dark, C.ink, 1.2), line('M86 70 L66 46', C.ink, 4), line('M86 70 L66 46', C.yellow, 2.4), rect(58, 40, 10, 6, C.dark, 1, C.ink, 1),
    ...range(5).map((i) => moving(`rbsb${i}`, '0%{transform:translate(0,0);opacity:1}100%{transform:translate(-12px,-2px);opacity:0}', { dur: 0.9, delay: i * 0.18 }, circle(54 - i * 1, 42 + (i % 3) * 3, 1.8, '#a9a9a2', null))), frame(2, 2, 48, 108)),
  'roadb.tunnelborrmaskin': all(rect(0, 0, 120, 112, ROCK, 0, null), rockLines(0, 0, 120, 112), rect(30, 34, 90, 48, '#4d79a8', 2, C.ink, 1.8), line('M50 34 L50 82 M74 34 L74 82 M98 34 L98 82', '#3a5f88', 1.4), rect(116, 50, 4, 16, CONC, 0, null),
    circle(26, 58, 26, C.dark, C.ink, 1.8), waSpin('rbtb', 3, g('translate(26 58)', line('M-22 0 L22 0 M0 -22 L0 22 M-15 -15 L15 15 M-15 15 L15 -15', C.grey, 3), ...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return circle(f1(Math.cos(a) * 18), f1(Math.sin(a) * 18), 2.4, C.silver, C.ink, 0.8); }))), circle(26, 58, 5, C.yellow, C.ink, 1.2)),
  'roadb.sänktunnel': all(sky(30), rect(0, 30, 120, 70, WATER, 0, null), rect(0, 96, 120, 16, CLAY, 0, null), path('M30 96 L36 88 L84 88 L90 96 Z', '#9c7350', null), rect(6, 22, 40, 8, C.grey, 2, C.ink, 1.4), line('M26 30 L26 50', C.dark, 1.4),
    rect(0, 72, 26, 18, CONC, 2, C.ink, 1.4), rect(94, 72, 26, 18, CONC, 2, C.ink, 1.4), moving('rbst', '0%{transform:translate(0,-40px)}70%,100%{transform:translate(0,0)}', { dur: 4 }, rect(36, 72, 48, 18, CONC, 2, C.ink, 1.6), rect(42, 76, 36, 10, '#2a2b33', 4, null), line('M60 72 L60 32', C.dark, 1.4)), frame(32, 68, 56, 26)),
  'roadb.genomslag.2': all(rect(0, 0, 120, 112, ROCK, 0, null), rockLines(0, 0, 120, 112), path('M0 50 L120 50 L120 86 L0 86 Z', '#2a2b33', null),
    path('M52 50 L68 50 L68 86 L52 86 L52 78 L58 72 L55 64 L60 58 L54 54 Z', ROCK2, C.ink, 1.2), path('M68 50 L68 86 L66 86 L62 76 L65 66 L61 58 L66 52 Z', ROCK2, null),
    rect(57, 52, 6, 30, '#ffe9a8', 0, null), ...([[50, 84], [70, 85], [64, 83]] as [number, number][]).map(([x, y], i) => moving(`rbgs${i}`, '0%{transform:translate(0,-26px);opacity:0}50%,100%{transform:translate(0,0);opacity:1}', { dur: 2.6, delay: i * 0.3 }, path(`M${x - 3} ${y} l3 -4 l4 1 l1 3 Z`, ROCK2, C.ink, 0.8))),
    g('translate(0 -26)', person(40, C.navy, { s: 0.42, hat: C.yellow, vest: true, r: [24, 18] }), person(80, C.navy, { s: 0.42, hat: C.white, vest: true, l: [-24, 18] })), ring(60, 68, 22)),

  // ── 4146 Vägarbeten ──
  'roadb.köbildning': all(rect(0, 0, 120, 112, GRASS, 0, null), rect(36, 0, 48, 112, ASPH, 0, null), line('M60 0 L60 112', C.white, 2, '7 6'), cone(64, 14, 0.5), cone(72, 22, 0.5), cone(80, 30, 0.5),
    ...range(5).map((i) => waIn(`rbq${i}`, 0, 12, carTop(48, 30 + i * 18, [C.red, C.denim, C.yellow, C.green, C.grey][i]!, 0, 0.75))), frame(38, 18, 22, 94)),
  'roadb.trafikkon': all(rect(0, 100, 120, 12, ASPH, 0, null), cone(60, 106, 3.2), greyed(cone(16, 106, 1), cone(104, 106, 1)), ring(60, 70, 40)),
  'roadb.vägarbetare': all(sky(100), rect(0, 100, 120, 12, ASPH, 0, null), cone(98, 108, 0.7), person(50, C.navy, { vest: true, hat: C.yellow, r: [18, 30], l: [14, 34] }), line('M74 64 L86 108', C.brown, 3), path('M82 104 L94 104 L92 112 L84 112 Z', C.grey, C.ink, 1.2)),
  'roadb.flaggvakt': all(sky(100), rect(0, 100, 120, 12, ASPH, 0, null), person(36, C.navy, { vest: true, hat: C.white, r: [20, -6] }), line('M56 52 L56 30', C.dark, 2.4), circle(56, 22, 10, C.red, C.ink, 1.6), circle(56, 22, 6, 'none', C.white, 1.4),
    greyed(car(96, 104, C.denim, 0.6)), ring(46, 54, 30)),
  'roadb.lotsbil': all(rect(0, 0, 120, 112, GRASS, 0, null), rect(36, 0, 48, 112, ASPH, 0, null), rect(64, 20, 20, 70, '#cfc8bb', 0, null), cone(62, 30, 0.45), cone(62, 60, 0.45), cone(62, 88, 0.45),
    carTop(48, 26, C.white, 0, 0.9), waPulse('rblb', rect(43, 24, 10, 4, C.yellow, 1.5, C.ink, 1), line('M41 22 l-3 -2 M55 22 l3 -2', C.gold, 1.6)), ...[52, 74, 96].map((y, i) => carTop(48, y, [C.red, C.denim, C.green][i]!, 0, 0.75)), arrow(48, 10, 48, 2, HL, 2.4), frame(38, 10, 20, 32)),
  'roadb.stänga-av.2': all(sky(100), rect(0, 100, 120, 12, ASPH, 0, null), car(26, 104, C.red, 0.6), moving('rbsa', '0%,10%{transform:rotate(-80deg)}55%,100%{transform:rotate(0)}', { dur: 3.5 }, g('translate(0 0)', barrier(60, 70, 54, 0))),
    `<style data-wa>.wa-rbsa{transform-origin:60px 70px}</style>`, cone(110, 108, 0.6), cross(100, 40, 8)),
  'roadb.vägbom': all(sky(100), rect(0, 100, 120, 12, ASPH, 0, null), barrier(20, 72, 90, 0), circle(110, 72, 3, C.red, null), frame(12, 62, 104, 20)),
  'roadb.leda-om': all(rect(0, 0, 120, 112, GRASS, 0, null), rect(0, 50, 120, 16, ASPH, 0, null), path('M20 50 L20 18 L100 18 L100 50 L90 50 L90 28 L30 28 L30 50 Z', ASPH2, null), rect(52, 46, 16, 24, C.white, 2, C.ink, 1.4), cross(60, 58, 6),
    line('M10 58 L25 58 L25 23 L95 23 L95 58 L112 58', HL, 2.6, '5 4'), moving('rblo', '0%{transform:translate(-35px,35px)}30%{transform:translate(-35px,0)}70%{transform:translate(35px,0)}100%{transform:translate(35px,35px)}', { dur: 5 }, carTop(60, 23, C.red, 90, 0.6))),
  'roadb.körplåt': all(rect(0, 60, 120, 52, ASPH, 0, null), path('M30 82 L90 82 L94 104 L26 104 Z', '#5a4636', C.ink, 1.2), path('M24 78 L96 78 L100 100 L20 100 Z', STEEL, C.ink, 1.8), ...range(5).map((i) => circle(32 + i * 14, 89, 1.4, C.dark, null)), car(62, 82, C.red, 0.6), cone(110, 106, 0.6), frame(16, 74, 88, 30)),

  // ── 4147 Underhåll av vägar ──
  'roadb.väghållare': all(sky(112), rect(0, 96, 120, 16, ASPH, 0, null), line('M0 104 L120 104', C.white, 1.6, '7 6'), rect(66, 30, 46, 50, '#e4dccb', 1, C.ink, 1.6), ...range(3).flatMap((j) => range(3).map((i) => rect(72 + i * 14, 36 + j * 13, 8, 8, '#dff1fb', 1, C.ink, 1))), rect(84, 72, 10, 8, C.brown, 0, C.ink, 1),
    person(34, C.navy, { s: 0.85, vest: true, hat: C.white, r: [16, 18] }), rect(46, 64, 12, 16, C.white, 1, C.ink, 1.2), line('M48 68 L56 68 M48 72 L56 72', C.grey, 1), check(108, 18, 0.8), frame(4, 26, 112, 86)),
  'roadb.tjälskada': all(sky(40), rect(0, 52, 120, 60, CLAY, 0, null), path('M0 44 L30 44 C46 44 50 34 60 34 C70 34 74 44 90 44 L120 44 L120 52 L0 52 Z', ASPH, C.ink, 1.6), line('M56 36 L60 44 L57 50 M66 36 L64 42', C.white, 1.4),
    ...[[40, 64], [60, 60], [80, 64], [50, 80], [70, 82]].map(([x, y]) => flake(x!, y!, 1.1)), ellipse(60, 70, 34, 18, 'none', '#5aa7d6', 1.6, ), ring(60, 42, 18)),
  'roadb.potthål': all(grassBg(40), road(40, ASPH2), ellipse(52, 90, 18, 8, '#2a2b33', C.ink, 1.6), ellipse(52, 92, 13, 5, WATER, null), line('M34 90 l-4 -3 M70 90 l4 -2 M46 82 l-2 -4', C.ink, 1.2), ring(52, 90, 24)),
  'roadb.lappa.2': all(rect(0, 70, 120, 42, ASPH2, 0, null), ellipse(48, 92, 20, 8, '#2a2b33', C.ink, 1.4), waGrow('rbla', ellipse(48, 92, 20, 8, '#1f2027', C.ink, 1.4), steam(40, 84)), person(88, C.navy, { s: 0.8, vest: true, hat: C.yellow, l: [-22, 26], r: [-14, 30] }),
    line('M72 74 L58 92', C.brown, 3), path('M52 88 L62 86 L64 94 L54 96 Z', C.grey, C.ink, 1.2)),
  'roadb.halkbekämpning': all(sky(84), rect(0, 84, 120, 28, '#dbe9f3', 0, null), line('M0 96 L120 96', C.white, 1.6), truck(70, 98, C.orange, 1, path('M-30 -28 L6 -28 L6 -34 L-30 -38 Z', C.white, C.ink, 1)), waPulse('rbhb0', lamp(72, 70)),
    ...range(8).map((i) => moving(`rbhb${i + 1}`, '0%{transform:translate(0,0);opacity:1}100%{transform:translate(-14px,12px);opacity:0}', { dur: 1, delay: i * 0.12 }, circle(36 - (i % 4) * 3, 92 + (i % 3) * 2, 1.6, i % 2 ? C.white : '#c9b28a', C.ink, 0.5))),
    ellipse(20, 104, 16, 3, '#bde0f5', null)),
  'roadb.vägkant': all(sky(60), rect(0, 60, 120, 52, GRASS, 0, null), path('M0 112 L0 92 L120 76 L120 96 L60 104 Z', ASPH, C.ink, 1.4), line('M0 94 L120 78', C.white, 1.6),
    ...[[14, 84], [30, 80], [46, 78], [62, 74], [78, 72]].map(([x, y]) => all(line(`M${x} ${y} L${x} ${y! - 18}`, '#4f8a3e', 1.4), ellipse(x!, y! - 20, 2.6, 6, C.purple, null))), rect(98, 52, 4, 22, C.white, 1, C.ink, 1), rect(98, 54, 4, 4, C.black, 0, null),
    path('M0 92 L120 76 L120 60 L0 74 Z', 'none', HL, 2.6)),
  'roadb.dikesrensning': all(sky(60), rect(0, 60, 120, 52, GRASS, 0, null), path('M60 112 L68 84 L100 84 L108 112 Z', '#6a5a3e', C.ink, 1.2), rect(0, 76, 60, 8, ASPH, 0, C.ink, 1.2), path('M70 96 L98 96 L102 112 L66 112 Z', WATER, null),
    excavator(30, 76, 0.8, 0), moving('rbdr', '0%{transform:translate(14px,34px);opacity:.3}60%,100%{transform:translate(0,0);opacity:1}', { dur: 3.5 }, ellipse(72, 60, 8, 4, '#6a5a3e', C.ink, 1), line('M69 57 l2 -4 m3 4 l3 -3', '#4f8a3e', 1.2)), frame(58, 80, 54, 32)),
  'roadb.underhållsskuld': all(path('M4 96 L50 96 L46 104 L4 104 Z', ASPH2, C.ink, 1.4), line('M20 96 L24 104 M34 96 L30 102', C.white, 1.2), coins(30, 84, 2), arrow(52, 86, 66, 86, C.ink, 2.4),
    path('M70 96 L116 96 L116 104 L74 104 Z', ASPH2, C.ink, 1.4), line('M78 96 L84 104 M92 96 L88 102 M100 96 L106 104 M110 96 L108 102', C.white, 1.6), ellipse(94, 99, 6, 2, '#2a2b33', null), waGrow('rbus', coins(94, 84, 9)), ring(94, 66, 26)),
};
