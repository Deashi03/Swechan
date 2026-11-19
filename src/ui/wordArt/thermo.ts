/**
 * Matematik & naturvetenskap → Fysik → Värmelära & termodynamik, 3351–3357 (0.50): temperature and heat,
 * states of matter, heat capacity, conduction and insulation, the laws of thermodynamics, entropy and heat
 * engines.
 * Recurring signs: heat is drawn as orange wavy arrows, hot is red and cold is blue; the part that the word
 * names is orange (ring, frame, arrow or object) and a grey reference shows what the word is not. Words in a
 * contrast pair share one layout where only the marked part differs: celsiusskala/kelvin (the same
 * thermometer between an ice cube and a boiling pot, with 0/100 or 273/373), kustklimat (mirrors the
 * existing inlandsklimat: house by the sea, summer and winter thermometers close together), entropi/
 * oordning (ordered and spread particles versus a messy and a tidy shelf).
 * Digits and maths signs only; no words, no brands.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, waGrow, waIn, waPulse, type Svg } from './kit';
import { HL, T } from './people';
import { figure } from './figures';
import { greyed } from './blindFix';
import { house } from './homeKit';

// ── Palette and basics ───────────────────────────────────────────────
const HOT = '#d64545';
const COLD = '#3f8fd2';
const ICE = '#dff1fb';
const WATER = '#8cc7e8';
const STEEL = '#b8c0c8';
const IRON = '#3d3f4a';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const rad = (d: number) => (d * Math.PI) / 180;
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const num = (x: number, y: number, s: string, size = 9, col: string = C.ink) => T(x, y, s, size, col);
/** Upright thermometer: bulb centre (x, y), tube height h, liquid level 0–1. */
const therm = (x: number, y: number, h: number, level: number, col: string = HOT, ticks = 0) => all(
  rect(x - 3.4, y - h, 6.8, h, C.white, 3.4, C.ink, 1.3),
  rect(x - 1.6, f1(y - 4 - (h - 8) * level), 3.2, f1(4 + (h - 8) * level), col, 1, null),
  circle(x, y + 2, 5.4, col, C.ink, 1.3),
  ticks ? line(range(ticks).map((i) => `M${x + 3.4} ${f1(y - 6 - ((h - 10) * i) / (ticks - 1))} l3 0`).join(' '), C.ink, 0.9) : '');
/** Wavy heat arrow from (x1, y1) to (x2, y2). */
const heat = (x1: number, y1: number, x2: number, y2: number, col: string = HL, sw = 2.4) => {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len, n = Math.max(2, Math.round(len / 8));
  const pts = range(n + 1).map((i) => { const t = i / n, w = i === 0 || i === n ? 0 : (i % 2 ? 2.6 : -2.6); return `${f1(x1 + dx * t * 0.86 + nx * w)} ${f1(y1 + dy * t * 0.86 + ny * w)}`; });
  const ex = f1(x1 + dx * 0.86), ey = f1(y1 + dy * 0.86), h = 6;
  return all(line('M' + pts.join(' L'), col, sw), path(`M${x2} ${y2} L${f1(ex + nx * h * 0.6)} ${f1(ey + ny * h * 0.6)} L${f1(ex - nx * h * 0.6)} ${f1(ey - ny * h * 0.6)} Z`, col, col, 1.2));
};
const flame = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 0 C-8 0 -9 -8 -5 -13 C-4 -9 -2 -9 -2 -11 C-2 -16 1 -19 3 -22 C3 -16 9 -12 8 -6 C8 -2 5 0 0 0 Z', C.orange, C.ink, 1.2), path('M0 -1 C-3 -1 -4 -4 -2 -7 C-1 -5 1 -6 1 -8 C3 -6 4 -3 3 -2 C2 -1 1 -1 0 -1 Z', C.yellow, null));
const steam = (x: number, y: number, col: string = C.grey2) => line(`M${x - 5} ${y} C${x - 8} ${y - 5} ${x - 2} ${y - 8} ${x - 5} ${y - 13} M${x + 3} ${y} C${x} ${y - 5} ${x + 6} ${y - 8} ${x + 3} ${y - 13}`, col, 1.8);
const iceCube = (x: number, y: number, s = 1, col: string = ICE) => g(`translate(${x} ${y}) scale(${s})`, path('M-8 -4 L0 -8 L8 -4 L8 6 L0 10 L-8 6 Z', col, C.ink, 1.3), line('M-8 -4 L0 0 L8 -4 M0 0 L0 10', C.ink, 1), line('M-5 -3 L-2 -5', C.white, 1.4));
const pot = (x: number, y: number, w = 30, col: string = STEEL, water = true) => all(rect(x - w / 2, y - 18, w, 18, col, 3, C.ink, 1.6), line(`M${x - w / 2 - 6} ${y - 14} L${x - w / 2} ${y - 14} M${x + w / 2} ${y - 14} L${x + w / 2 + 6} ${y - 14}`, C.ink, 2.4), water ? ellipse(x, y - 18, w / 2 - 1, 2.6, WATER, C.ink, 1) : '');
const bubbles = (x: number, y: number) => all(circle(x - 6, y - 4, 1.8, C.white, C.ink, 0.8), circle(x + 2, y - 7, 2.2, C.white, C.ink, 0.8), circle(x + 7, y - 3, 1.6, C.white, C.ink, 0.8));
const dotP = (x: number, y: number, col: string, r = 3) => circle(x, y, r, col, C.ink, 0.9);
/** Short motion strokes around a particle. */
const jig = (x: number, y: number, len: number, col: string = C.ink) => line(`M${f1(x - 4 - len)} ${y} L${x - 5} ${y} M${x + 5} ${y} L${f1(x + 4 + len)} ${y} M${x} ${f1(y - 4 - len * 0.6)} L${x} ${y - 5}`, col, 1);
const jar = (x: number, y: number, w: number, h: number, fill = 'none') => all(rect(x, y, w, h, fill, 3, C.ink, 1.6));
const glass = (x: number, y: number, w = 22, h = 30, fill: string = WATER, lvl = 0.75) => all(path(`M${x - w / 2} ${y - h} L${x - w / 2 + 2} ${y} L${x + w / 2 - 2} ${y} L${x + w / 2} ${y - h}`, ICE, null), path(`M${f1(x - w / 2 + 2 * (1 - lvl) + 0.4)} ${f1(y - h * lvl)} L${x - w / 2 + 2} ${y} L${x + w / 2 - 2} ${y} L${f1(x + w / 2 - 2 * (1 - lvl) - 0.4)} ${f1(y - h * lvl)} Z`, fill, null), path(`M${x - w / 2} ${y - h} L${x - w / 2 + 2} ${y} L${x + w / 2 - 2} ${y} L${x + w / 2} ${y - h}`, 'none', C.ink, 1.5));
const snow = (x: number, y: number, r = 4, col: string = COLD) => line(range(3).map((i) => { const a = rad(i * 60); return `M${f1(x - Math.cos(a) * r)} ${f1(y - Math.sin(a) * r)} L${f1(x + Math.cos(a) * r)} ${f1(y + Math.sin(a) * r)}`; }).join(' '), col, 1.4);
const sunS = (x: number, y: number, r = 6) => all(line(range(8).map((i) => { const a = rad(i * 45); return `M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 6))} ${f1(y + Math.sin(a) * (r + 6))}`; }).join(' '), C.gold, 1.8), circle(x, y, r, C.yellow, C.ink, 1.3));
const gear = (x: number, y: number, r: number, col: string = STEEL) => all(path(range(16).map((i) => { const a = rad(i * 22.5), rr = i % 2 ? r : r + 4; return `${i ? 'L' : 'M'}${f1(x + Math.cos(a) * rr)} ${f1(y + Math.sin(a) * rr)}`; }).join(' ') + ' Z', col, C.ink, 1.4), circle(x, y, r * 0.35, C.white, C.ink, 1.2));
/** Curved arrow around (cx, cy). */
const arc = (cx: number, cy: number, r: number, a1: number, a2: number, col: string = HL, sw = 2.4) => {
  const p = (a: number) => [f1(cx + Math.cos(rad(a)) * r), f1(cy - Math.sin(rad(a)) * r)] as const;
  const [x1, y1] = p(a1), [x2, y2] = p(a2), large = Math.abs(a2 - a1) > 180 ? 1 : 0, sweep = a2 > a1 ? 0 : 1;
  const [tx, ty] = p(a2 + (a2 > a1 ? -14 : 14)), ang = Math.atan2(y2 - ty, x2 - tx), h = 6 + sw;
  return all(path(`M${x1} ${y1} A${r} ${r} 0 ${large} ${sweep} ${x2} ${y2}`, 'none', col, sw), path(`M${x2} ${y2} L${f1(x2 - h * Math.cos(ang - 0.5))} ${f1(y2 - h * Math.sin(ang - 0.5))} L${f1(x2 - h * Math.cos(ang + 0.5))} ${f1(y2 - h * Math.sin(ang + 0.5))} Z`, col, null));
};
const cross = (x: number, y: number, r: number, col: string = HOT) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 3);
const mug = (x: number, y: number, col: string = HOT) => all(path(`M${x - 9} ${y - 18} L${x + 9} ${y - 18} L${x + 8} ${y} L${x - 8} ${y} Z`, col, C.ink, 1.5), path(`M${x + 9} ${y - 14} C${x + 15} ${y - 14} ${x + 15} ${y - 5} ${x + 8} ${y - 5}`, 'none', C.ink, 1.6), ellipse(x, y - 18, 8.6, 2, '#7a4a2a', C.ink, 1));

// ── Shared layouts ───────────────────────────────────────────────────
/** Thermometer between an ice cube (lower left) and a boiling pot (upper right); labels at the two marks and optionally at the bottom. */
const scaleScene = (low: string, high: string, bottom: string | null) => all(ground(),
  rect(52, 8, 16, 100, C.white, 6, C.ink, 1.6), rect(57.5, 40, 5, 64, HOT, 2, null), circle(60, 100, 7, HOT, C.ink, 1.4),
  line(range(11).map((i) => `M68 ${f1(24 + i * 7.2)} l${i % 5 ? 3 : 6} 0`).join(' '), C.ink, 1),
  line('M48 24 L72 24 M48 60 L72 60', HL, 2.6),
  iceCube(26, 64, 1.3), line('M36 60 L46 60', C.grey, 1.4, '2 2'), num(30, 50, low, 11, HL),
  flame(96, 46, 0.9), pot(96, 36, 30), bubbles(96, 22), steam(96, 14), line('M74 24 L80 24', C.grey, 1.4, '2 2'), num(100, 64, high, 11, HL),
  bottom !== null ? all(line('M48 106 L54 106', HL, 2.6), num(34, 109, bottom, 11, HL)) : '');
const particlesIn = (x: number, y: number, w: number, h: number, pts: [number, number][], col: string, motion = 0, mcol: string = C.ink) => all(...pts.map(([px, py]) => all(motion ? jig(x + px, y + py, motion, mcol) : '', dotP(x + px, y + py, col))), jar(x, y, w, h));
const GRID: [number, number][] = range(12).map((i) => [7 + (i % 4) * 8, 9 + Math.floor(i / 4) * 8]);
const SPREAD: [number, number][] = [[6, 8], [26, 6], [16, 18], [34, 20], [8, 30], [24, 34], [36, 40], [12, 46], [30, 52], [18, 58], [6, 56], [34, 8]];
const shelf = (x: number, y: number, col: string = C.tan) => all(rect(x, y, 40, 4, col, 1, C.ink, 1.2), rect(x, y + 26, 40, 4, col, 1, C.ink, 1.2), line(`M${x + 2} ${y + 4} L${x + 2} ${y + 26} M${x + 38} ${y + 4} L${x + 38} ${y + 26}`, C.brown, 2));
const book = (x: number, y: number, col: string, rot = 0, w = 6, h = 20) => g(`translate(${x} ${y}) rotate(${rot})`, rect(-w / 2, -h, w, h, col, 1, C.ink, 1.1), line(`M${-w / 2 + 1.4} ${-h + 4} l${w - 2.8} 0`, C.white, 1));
const radiator = (x: number, y: number, n = 6, col: string = C.white) => all(...range(n).map((i) => rect(x + i * 8, y, 7, 34, col, 3, C.ink, 1.3)), line(`M${x} ${y + 6} L${x + n * 8 - 1} ${y + 6} M${x} ${y + 28} L${x + n * 8 - 1} ${y + 28}`, C.ink, 1));
const factory = (x: number, y: number, col: string = '#c9b9a6') => all(rect(x, y - 30, 46, 30, col, 1, C.ink, 1.6), path(`M${x} ${y - 30} L${x + 10} ${y - 40} L${x + 10} ${y - 30} L${x + 20} ${y - 40} L${x + 20} ${y - 30} L${x + 30} ${y - 40} L${x + 30} ${y - 30} Z`, col, C.ink, 1.4), rect(x + 34, y - 58, 8, 28, '#9e8f80', 1, C.ink, 1.4), ...range(3).map((i) => rect(x + 5 + i * 12, y - 20, 8, 8, '#cfe8f7', 1, C.ink, 1)));

// ── Motifs ───────────────────────────────────────────────────────────
export const THERMO_MOTIFS: Record<string, Svg> = {
  // ── 3351 Temperatur och värme ───────────────────────────────────
  /** värme (fysik): heat flowing out of a hot mug into two cold hands, orange wavy arrows. */
  'term.värme.2': all(ground(), rect(30, 96, 60, 16, C.tan, 2, C.ink, 1.4), mug(60, 96), steam(60, 72, C.grey2),
    g('translate(22 78)', path('M-12 -8 C-4 -12 6 -10 10 -4 C12 2 8 8 0 8 C-8 8 -14 2 -12 -8 Z', C.skin, C.ink, 1.3)), g('translate(98 78) scale(-1 1)', path('M-12 -8 C-4 -12 6 -10 10 -4 C12 2 8 8 0 8 C-8 8 -14 2 -12 -8 Z', C.skin, C.ink, 1.3)),
    heat(48, 84, 30, 80), heat(72, 84, 90, 80), heat(48, 74, 32, 66), heat(72, 74, 88, 66), snow(14, 60, 4), snow(106, 60, 4)),
  /** celsiusskala: thermometer between ice (0) and boiling water (100). */
  'term.celsiusskala': scaleScene('0', '100', null),
  /** kelvin: the same thermometer, 273 at the ice, 373 at the boiling water and 0 at the very bottom. */
  'term.kelvin': scaleScene('273', '373', '0'),
  /** absoluta nollpunkten: thermometer emptied to the bottom (−273) beside a box of particles standing completely still. */
  'term.absoluta-nollpunkten': all(ground(), therm(28, 96, 84, 0, COLD, 9), ring(28, 98, 10), num(52, 104, '−273', 10, HL),
    particlesIn(62, 22, 46, 46, GRID.map(([a, b]) => [a + 4, b + 4] as [number, number]), COLD), snow(70, 82, 5), snow(98, 86, 5), snow(84, 96, 4)),
  /** febertermometer: person in bed with a digital thermometer in the mouth; the display (38,5) is enlarged. */
  'term.febertermometer': all(rect(8, 82, 104, 14, C.brown, 2, C.ink, 2), line('M12 96 L12 108 M108 96 L108 108', C.brown, 4), rect(10, 66, 22, 18, C.white, 6, C.ink, 1.6),
    circle(34, 66, 9, C.skin, C.ink, 1.6), path('M25 64 C25 54 43 54 43 64 C39 60 29 60 25 64 Z', C.hair, null), circle(30, 69, 2, '#f08a8a', null), circle(38, 69, 2, '#f08a8a', null),
    path('M40 72 C60 64 96 66 110 72 L110 84 L40 84 Z', C.sky, C.ink, 1.8), g('translate(42 70) rotate(-22)', rect(0, -2, 26, 4.4, C.white, 2, C.ink, 1.3), rect(10, -1.4, 10, 3, '#cfe8f7', 1, null)),
    line('M62 60 L72 44', HL, 1.6, '3 2'), rect(58, 14, 54, 30, C.white, 6, C.ink, 1.8), rect(64, 19, 42, 20, '#d9f0d0', 3, C.ink, 1.1), num(85, 35, '38,5', 14, HOT)),
  /** värmerörelse: cold box with slow particles (grey) and hot box with fast particles (orange, long motion strokes). */
  'term.värmerörelse': all(ground(), greyed(particlesIn(6, 34, 46, 50, [[10, 10], [30, 12], [20, 26], [36, 34], [10, 40], [24, 42]], COLD, 1.5)), therm(28, 104, 14, 0.15, COLD),
    particlesIn(68, 34, 46, 50, [[10, 10], [30, 12], [20, 26], [36, 34], [10, 40], [24, 42]], HL, 7, HL), therm(90, 104, 14, 0.9, HOT), frame(64, 30, 54, 58)),
  /** termisk jämvikt: two blocks that touch, both the same orange; two thermometers at the same level with = between. */
  'term.termisk-jämvikt': all(ground(), greyed(rect(10, 8, 22, 14, HOT, 2, C.ink, 1.2), rect(32, 8, 22, 14, COLD, 2, C.ink, 1.2)), arrow(58, 15, 66, 15, C.grey, 2), rect(70, 8, 22, 14, C.orange, 2, C.ink, 1.2), rect(92, 8, 22, 14, C.orange, 2, C.ink, 1.2),
    rect(14, 70, 46, 42, C.orange, 3, C.ink, 1.8), rect(60, 70, 46, 42, C.orange, 3, C.ink, 1.8), therm(30, 64, 36, 0.55, C.orange, 6), therm(90, 64, 36, 0.55, C.orange, 6), num(60, 52, '=', 22, HL), waPulse('b4-term-termisk-jamvikt-1', line('M24 48 L36 48 M84 48 L96 48', HL, 2.4))),
  /** termostat: radiator under a window; the round knob with the numbers 1–5 is enlarged and ringed. */
  'term.termostat': all(ground(), rect(16, 10, 50, 36, '#cfe8f7', 2, C.ink, 1.6), line('M41 10 L41 46 M16 28 L66 28', C.ink, 1.2), radiator(12, 70, 7), line('M68 78 L74 78', C.ink, 3), circle(78, 78, 5, C.white, C.ink, 1.3),
    line('M82 74 L86 66', HL, 1.4, '3 2'), circle(90, 44, 18, C.white, C.ink, 1.8), circle(90, 44, 12, '#e8ecef', C.ink, 1.3), line('M90 44 L90 34', C.ink, 2.4),
    ...([['1', 148], ['2', 119], ['3', 90], ['4', 61], ['5', 32]] as [string, number][]).map(([n, a]) => num(f1(90 + Math.cos(rad(a)) * 23), f1(44 - Math.sin(rad(a)) * 23 + 3), n, 8)), ring(90, 44, 22)),

  // ── 3352 Aggregationstillstånd ──────────────────────────────────
  /** aggregationstillstånd: three jars – particles in a grid (solid), loose at the bottom (liquid), spread out (gas) – under one orange bracket. */
  'term.aggregationstillstånd': all(particlesIn(4, 40, 34, 46, range(9).map((i) => [7 + (i % 3) * 10, 22 + Math.floor(i / 3) * 9] as [number, number]), ICE), iceCube(21, 30, 0.8),
    particlesIn(43, 40, 34, 46, [[7, 38], [15, 36], [23, 39], [30, 36], [10, 30], [20, 29], [27, 30], [14, 22]], WATER), ellipse(60, 58, 13, 2, 'none', COLD, 1), particlesIn(82, 40, 34, 46, [[6, 8], [24, 12], [14, 24], [28, 32], [8, 38], [20, 6]], C.white, 3), steam(99, 36),
    line('M4 96 L4 102 L116 102 L116 96', HL, 2.6), num(21, 116, '1', 10, HL), num(60, 116, '2', 10, HL), num(99, 116, '3', 10, HL)),
  /** smältpunkt (omgång 2): a big thermometer dominates; two orange points on its scale (0 and 30) are linked to the small things that melt exactly there – an ice cube and a piece of chocolate, each with a drop. */
  'term.smältpunkt': all(ground(), rect(30, 6, 22, 98, C.white, 8, C.ink, 1.8), rect(37, 30, 8, 72, HOT, 3, null), circle(41, 100, 10, HOT, C.ink, 1.6),
    line(range(10).map((i) => `M52 ${16 + i * 8} l${i % 2 ? 4 : 7} 0`).join(' '), C.ink, 1.1),
    circle(41, 80, 5, HL, C.ink, 1.2), circle(41, 48, 5, HL, C.ink, 1.2), num(14, 84, '0', 12, HL), num(14, 52, '30', 12, HL),
    line('M47 80 L74 80 M47 48 L74 48', HL, 1.6, '3 2'),
    iceCube(86, 78, 0.8), path('M86 88 C89 92 89 95 86 96 C83 95 83 92 86 88 Z', WATER, C.ink, 0.8),
    rect(76, 40, 20, 12, '#6b3e26', 2, C.ink, 1.2), line('M83 40 L83 52 M89 40 L89 52 M76 46 L96 46', '#4e2b19', 0.9), path('M92 52 C95 56 95 59 92 60 C89 59 89 56 92 52 Z', '#6b3e26', C.ink, 0.8)),
  /** frysa (bli till is): a glass of water, an arrow, the same glass frozen to ice; thermometer below zero. */
  'term.frysa.2': all(ground(), greyed(glass(26, 110, 26, 40, WATER)), waIn('b4-term-frysa-2-1', -11, -0, arrow(44, 88, 62, 88, HL, 3)), glass(84, 110, 26, 40, ICE), path('M73 81 L95 81 L94 108 L74 108 Z', '#e8f6fd', null), line('M76 86 L82 92 M86 84 L90 96 M78 100 L84 98', '#9ccbe8', 1.2), glass(84, 110, 26, 40, 'none', 0),
    ring(84, 92, 22), therm(108, 62, 34, 0.1, COLD, 5), num(106, 20, '−5', 10, COLD), snow(84, 20, 6), snow(66, 30, 4)),
  /** sublimera: a solid block turns directly into gas; the arrow jumps over a greyed-out, crossed water drop. */
  'term.sublimera': all(ground(), rect(8, 82, 26, 26, '#eef6fa', 2, C.ink, 1.4), line('M12 86 L18 92', C.white, 1.6), greyed(path('M60 74 C66 84 68 90 60 94 C52 90 54 84 60 74 Z', WATER, C.ink, 1.3)), cross(60, 86, 9, C.grey),
    path('M24 76 C34 32 86 32 96 70', 'none', HL, 3), path('M96 70 L89 63 L99 62 Z', HL, null), waGrow('b4-term-sublimera-1', g('translate(98 92)', ellipse(0, 0, 16, 10, 'rgba(255,255,255,0.9)', C.grey, 1.4), ellipse(-8, -8, 9, 7, 'rgba(255,255,255,0.9)', C.grey, 1.4), ellipse(7, -9, 9, 7, 'rgba(255,255,255,0.9)', C.grey, 1.4)))),
  /** torris: a block of dry ice in a bowl with white fog flowing over the edge onto the table. */
  'term.torris': all(rect(4, 96, 112, 6, C.tan, 2, C.ink, 1.4), line('M14 102 L14 112 M106 102 L106 112', C.brown, 3), path('M30 70 L90 70 C88 92 76 96 60 96 C44 96 32 92 30 70 Z', '#3f6fb5', C.ink, 1.6),
    rect(40, 56, 18, 14, '#f4f8fb', 2, C.ink, 1.2), rect(56, 58, 16, 12, '#f4f8fb', 2, C.ink, 1.2), rect(48, 50, 14, 10, '#f4f8fb', 2, C.ink, 1.2),
    path('M24 72 C20 60 36 56 40 48 C44 40 58 44 60 36 C66 44 80 40 82 50 C92 54 98 64 94 72 C102 80 106 92 100 96 L20 96 C14 92 16 80 24 72 Z', 'rgba(240,244,248,0.82)', C.grey2, 1.2), path('M34 96 C30 90 40 88 38 82 M86 96 C90 90 82 86 86 80', 'none', C.white, 2), snow(16, 34, 5), snow(104, 30, 5)),

  // ── 3353 Värmekapacitet ─────────────────────────────────────────
  /** värmekapacitet: same flames, same time (clocks), same amount; water warms only a little (ringed), the grey block a lot. */
  'term.värmekapacitet': all(ground(), rect(8, 100, 44, 12, IRON, 2, C.ink, 1.4), rect(68, 100, 44, 12, IRON, 2, C.ink, 1.4), flame(24, 100, 0.6), flame(36, 100, 0.6), flame(84, 100, 0.6), flame(96, 100, 0.6),
    rect(14, 66, 32, 30, ICE, 2, C.ink, 1.5), rect(15, 72, 30, 23, WATER, 0, null), greyed(rect(74, 66, 32, 30, STEEL, 2, C.ink, 1.5)), therm(30, 54, 40, 0.15, HOT, 5), therm(90, 54, 40, 0.85, HOT, 5),
    ring(30, 70, 26), num(30, 8, '+1', 9, HL), num(90, 8, '+9', 9, C.grey)),
  /** joule: a hand lifts an apple one metre; the start position is greyed and the height is a bracket labelled 1 m. */
  'term.joule': all(ground(), greyed(circle(48, 100, 8, HOT, C.ink, 1.4)), line('M48 92 l1 -4', C.brown, 1.6), circle(48, 30, 8, HOT, C.ink, 1.4), line('M48 22 l1 -4', C.brown, 1.6), path('M49 20 C54 16 58 18 58 20 C54 22 52 22 49 20 Z', C.green, null),
    path('M40 40 C36 34 40 26 46 26 L56 30 C60 34 58 42 52 42 Z', C.skin, C.ink, 1.3), line('M52 42 L60 66', C.skin, 6), line('M52 42 L60 66', C.ink, 0.6), arrow(48, 84, 48, 46, HL, 3),
    line('M76 30 L76 100', HL, 2.4), line('M71 30 L81 30 M71 100 L81 100', HL, 2.4), num(96, 69, '1 m', 11, HL)),
  /** tillföra: a pot on a flame with a big orange arrow pointing down into it, marked +. */
  'term.tillföra': all(ground(), rect(28, 98, 64, 14, IRON, 2, C.ink, 1.4), flame(52, 98, 0.8), flame(68, 98, 0.8), pot(60, 92, 44), heat(60, 106, 60, 80, HL, 3),
    arrow(60, 8, 60, 58, HL, 5), num(82, 30, '+', 22, HL), therm(100, 70, 32, 0.6, HOT, 4)),
  /** temperaturhöjning: thermometer with the old level greyed and the new, higher level orange, arrow up and +10. */
  'term.temperaturhöjning': all(ground(), rect(48, 6, 24, 100, C.white, 8, C.ink, 1.6), rect(55, 30, 10, 74, HOT, 3, null), circle(60, 100, 10, HOT, C.ink, 1.5),
    line(range(9).map((i) => `M72 ${18 + i * 10} l5 0`).join(' '), C.ink, 1), line('M40 66 L80 66', C.grey, 2, '4 3'), line('M40 30 L80 30', HL, 2.8), waIn('b4-term-temperaturhojning-1', -0, 14, arrow(92, 64, 92, 32, HL, 3.4)), num(102, 54, '+10', 10, HL), num(28, 70, '20', 10, C.grey), num(28, 34, '30', 10, HL)),
  /** varmvattenberedare: tall white tank in the basement with a red hot pipe out to a shower and a blue cold pipe in. */
  'term.varmvattenberedare': all(ground(), rect(14, 20, 36, 88, C.white, 14, C.ink, 1.8), line('M14 36 L50 36 M14 92 L50 92', C.grey2, 1.2), circle(32, 60, 6, C.white, C.ink, 1.2), line('M32 60 L35 57', HOT, 1.6),
    line('M42 20 L42 10 L96 10 L96 30', HOT, 4), line('M24 108 L24 112 M50 100 L70 100 L70 112', COLD, 4), path('M88 30 L104 30 L100 36 L92 36 Z', STEEL, C.ink, 1.2), line('M92 40 l-2 8 M96 40 l0 8 M100 40 l2 8 M94 52 l-1 6 M98 52 l1 6', WATER, 1.6), heat(18, 70, 18, 46, HL, 1.8), ring(32, 64, 30)),
  /** gjutjärnsgryta: a heavy black pot with lid and side handles, steam, on a trivet. */
  'term.gjutjärnsgryta': all(rect(4, 100, 112, 6, C.tan, 2, C.ink, 1.4), line('M14 106 L14 112 M106 106 L106 112', C.brown, 3), path('M24 58 L96 58 L94 92 C94 98 26 98 26 92 Z', IRON, C.ink, 2), line('M16 64 L24 64 M96 64 L104 64', C.ink, 4),
    path('M22 58 C24 44 96 44 98 58 Z', '#4a4c58', C.ink, 1.8), rect(54, 40, 12, 6, '#4a4c58', 2, C.ink, 1.4), line('M30 54 C40 50 50 49 58 49', '#6b6e7c', 1.6), steam(40, 34), steam(80, 34), line('M30 98 L90 98', C.grey, 3)),
  /** kustklimat: house close to a large sea; summer and winter thermometers at nearly the same middle level (mirrors inlandsklimat). */
  'term.kustklimat': all(rect(0, 0, 120, 120, '#eef6fb', 0, null), path('M4 80 L64 80 L64 112 L4 112 Z', '#7fb6dd', null), path('M8 90 c4 -3 8 -3 12 0 c4 3 8 3 12 0 M28 100 c4 -3 8 -3 12 0 c4 3 8 3 12 0', 'none', C.white, 1.6),
    path('M64 112 L64 80 L116 80 L116 112 Z', '#c8d9a8', C.ink, 1.1), house(94, 102, 0.75), line('M50 86 L70 86', HL, 1.8, '3 2'), arrow(52, 86, 72, 86, HL, 1.8),
    sunS(36, 18, 6), therm(52, 60, 34, 0.58, HOT, 5), snow(96, 16, 5), therm(76, 60, 34, 0.42, COLD, 5), ring(64, 44, 26)),

  // ── 3354 Värmeledning och isolering ─────────────────────────────
  /** isolering (mot värme och kyla): cut-through wall with a thick yellow wool layer between two boards; inside heat bounces back from it. */
  'term.isolering.2': all(ground(), rect(36, 8, 10, 104, C.tan, 0, C.ink, 1.3), rect(46, 8, 26, 104, '#f2d36b', 0, C.ink, 1.3), path(range(13).map((i) => `M46 ${12 + i * 8} C52 ${8 + i * 8} 66 ${16 + i * 8} 72 ${12 + i * 8}`).join(' '), 'none', '#d9b34a', 1.1), rect(72, 8, 10, 104, '#d9d2c3', 0, C.ink, 1.3),
    heat(8, 40, 32, 40, HOT), heat(8, 70, 32, 70, HOT), path('M30 52 C24 52 20 56 20 60', 'none', HOT, 1.6), snow(98, 36, 6), snow(104, 70, 5), snow(94, 94, 4), frame(44, 6, 30, 108)),
  /** treglasfönster: a window seen from the side, three orange panes with air between; heat stays inside. */
  'term.treglasfönster': all(rect(0, 0, 120, 120, '#f6f2ea', 0, null), rect(36, 10, 48, 100, C.white, 2, C.ink, 1.8), rect(44, 18, 32, 84, '#e4f2fb', 1, null),
    line('M50 18 L50 102 M60 18 L60 102 M70 18 L70 102', HL, 3), line('M44 18 L76 18 M44 102 L76 102', C.ink, 1.4), heat(8, 50, 30, 50, HOT), path('M32 60 C26 64 22 64 18 62', 'none', HOT, 1.6), snow(100, 40, 5), snow(104, 76, 5)),
  /** värmeförlust: a house in snow with orange wavy heat escaping through the roof, the window and the walls. */
  'term.värmeförlust': all(rect(0, 0, 120, 120, '#e8f0f7', 0, null), rect(0, 100, 120, 20, C.white, 0, null), ground(100), house(60, 84, 1),
    heat(60, 38, 60, 8), heat(42, 44, 26, 26), heat(78, 44, 94, 26), heat(36, 70, 10, 66), heat(84, 70, 110, 66), snow(14, 14, 4), snow(104, 12, 4), snow(14, 88, 3)),
  /** golvvärme: floor cut through with a red pipe snaking under the tiles; bare feet and heat rising. */
  'term.golvvärme': all(rect(4, 86, 112, 8, '#e9e3d6', 0, C.ink, 1.3), line(range(7).map((i) => `M${4 + i * 16} 86 L${4 + i * 16} 94`).join(' '), C.ink, 0.8), rect(4, 94, 112, 18, '#c9c1b2', 0, C.ink, 1.3),
    path('M10 100 L106 100 C112 100 112 106 106 106 L14 106', 'none', HOT, 3), ring(60, 103, 10), heat(30, 84, 30, 64, HL, 1.8), heat(88, 84, 88, 64, HL, 1.8),
    g('translate(60 -26)', figure({ x: 0, h: 0.72, top: C.green, bottom: C.navy }))),

  // ── 3355 Termodynamikens huvudsatser ────────────────────────────
  /** termodynamik: flame → heat arrow → turning gear (work), with a thermometer: the field that links heat, energy and work. */
  'term.termodynamik': all(ground(), flame(20, 70, 1.4), heat(32, 60, 54, 60), gear(74, 60, 14), arc(74, 60, 26, 120, 30, HL, 2.2), arrow(96, 60, 112, 60, HL, 3), therm(20, 104, 14, 0.7, HOT), frame(4, 22, 112, 80, C.grey2)),
  /** huvudsats: four numbered cards 0–3 (equal thermometers, 100 = 100, hot → cold, empty thermometer); card 2 is framed. */
  'term.huvudsats': all(...[0, 1, 2, 3].map((i) => { const x = 4 + (i % 2) * 58, y = 4 + Math.floor(i / 2) * 58; return all(rect(x, y, 54, 54, i === 2 ? '#fff4ec' : C.white, 4, i === 2 ? C.ink : C.grey, 1.4), num(x + 9, y + 14, String(i), 11, i === 2 ? HL : C.grey)); }),
    greyed(therm(22, 50, 26, 0.5, C.orange), therm(42, 50, 26, 0.5, C.orange), num(90, 36, '100=100', 9), therm(90, 108, 26, 0, COLD)),
    rect(10, 80, 14, 14, HOT, 2, C.ink, 1.2), rect(40, 80, 14, 14, COLD, 2, C.ink, 1.2), heat(26, 87, 38, 87, HL, 2), frame(2, 60, 58, 58)),
  /** energiprincipen: closed frame; battery 100 → bulb with light 70 and heat 30; 100 = 70 + 30. */
  'term.energiprincipen': all(frame(4, 4, 112, 112, C.grey2), rect(12, 40, 24, 40, C.green, 3, C.ink, 1.4), rect(19, 35, 10, 5, C.dark, 1, null), num(24, 64, '100', 9, C.white), arrow(40, 60, 56, 60, C.grey, 2.4),
    circle(76, 54, 12, C.yellow, C.ink, 1.4), rect(70, 66, 12, 8, C.grey, 1, C.ink, 1.2), line('M76 34 L76 26 M90 42 L96 36 M62 42 L56 36', C.gold, 2), heat(88, 64, 104, 76, HOT, 2), num(76, 22, '70', 9, C.gold), num(106, 90, '30', 9, HOT), num(60, 108, '100 = 70 + 30', 11, HL)),
  /** inre energi: a closed box whose particles jiggle and are linked by little springs; the inside is orange. */
  'term.inre-energi': all(ground(), rect(14, 16, 92, 84, '#fff1e6', 4, null), ...[[30, 36], [56, 30], [84, 40], [40, 62], [70, 66], [28, 86], [90, 82], [58, 90]].map(([x, y]) => all(jig(x!, y!, 5, HL), dotP(x!, y!, C.orange, 4))),
    line('M34 38 C40 30 46 40 52 32 M44 60 C52 56 58 72 66 66 M32 84 C40 76 50 92 54 88', C.grey, 1.2), rect(14, 16, 92, 84, 'none', 4, C.ink, 3), frame(10, 12, 100, 92)),
  /** slutet system: pot with a lid (orange outline) on a flame – heat goes in, no steam out – beside a grey open pot with steam escaping. */
  'term.slutet-system': all(ground(), greyed(rect(4, 100, 44, 12, IRON, 2, C.ink, 1.4), flame(26, 100, 0.7), pot(26, 94, 32), steam(26, 66), steam(18, 56), arrow(26, 52, 26, 36, C.grey, 2)),
    rect(64, 100, 50, 12, IRON, 2, C.ink, 1.4), flame(89, 100, 0.7), pot(89, 94, 34, STEEL, false), path('M70 76 C72 68 106 68 108 76 Z', STEEL, C.ink, 1.4), rect(85, 66, 8, 4, C.dark, 1, null), heat(89, 110, 89, 86, HOT, 1.8),
    path('M66 96 L66 78 C68 64 110 64 112 78 L112 96', 'none', HL, 2.6), cross(89, 50, 6, HL)),
  /** evighetsmaskin: a wheel with weights on bent arms, a circular arrow around it and ∞ above. */
  'term.evighetsmaskin': all(ground(), path('M50 112 L60 66 L70 112', C.brown, C.ink, 1.4), circle(60, 66, 30, 'none', C.ink, 2.4),
    ...range(8).map((i) => { const a = rad(i * 45), x = f1(60 + Math.cos(a) * 30), y = f1(66 + Math.sin(a) * 30), bx = f1(60 + Math.cos(a + 0.5) * 36), by = f1(66 + Math.sin(a + 0.5) * 36); return all(line(`M60 66 L${x} ${y} L${bx} ${by}`, C.dark, 1.6), circle(bx, by, 4, C.grey, C.ink, 1.1)); }),
    circle(60, 66, 4, C.dark, C.ink, 1), arc(60, 66, 44, 160, 20, HL, 2.6), arc(60, 66, 44, -20, -160, HL, 2.6), num(60, 16, '∞', 22, HL)),

  // ── 3356 Entropi ────────────────────────────────────────────────
  /** entropi: particles packed in one corner (grey) → spread through the whole box (orange); an arrow up beside the right box. */
  'term.entropi': all(ground(), greyed(particlesIn(4, 30, 44, 70, GRID.slice(0, 9).map(([a, b]) => [a, b] as [number, number]), C.orange)), line('M28 30 L28 100', C.ink, 1, '2 3'), arrow(50, 65, 62, 65, HL, 3),
    particlesIn(66, 30, 44, 70, SPREAD.slice(0, 9).map(([a, b]) => [a + 2, b + 4] as [number, number]), C.orange), frame(62, 26, 52, 78), arrow(116, 70, 116, 34, HL, 2.4)),
  /** oordning: books and things scattered on the floor (orange frame) beside a tidy grey shelf. */
  'term.oordning': all(ground(), greyed(shelf(6, 30), book(12, 56, C.red), book(19, 56, C.green), book(26, 56, C.navy), book(33, 56, C.yellow), book(40, 56, C.purple), book(15, 30, C.navy), book(22, 30, C.red), book(29, 30, C.green)),
    book(66, 108, C.red, 70), book(84, 104, C.green, -30), book(100, 110, C.navy, 95), book(74, 90, C.yellow, 15), circle(104, 92, 5, HOT, C.ink, 1.1), path('M58 104 L66 96 L70 106 Z', C.purple, C.ink, 1.1), rect(88, 80, 12, 8, C.white, 1, C.ink, 1), line('M90 82 l8 0 M90 85 l6 0', C.grey, 0.8), path('M64 60 C70 54 78 66 84 58', 'none', C.grey, 1.4),
    frame(54, 46, 62, 66)),
  /** irreversibel: whole egg → broken egg; the arrow back is crossed out. */
  'term.irreversibel': all(ground(), rect(8, 96, 104, 4, C.tan, 1, C.ink, 1), ellipse(26, 78, 11, 15, '#fbf3e4', C.ink, 1.5),
    arrow(42, 70, 74, 70, HL, 3.4), path('M44 92 L76 92', 'none', C.grey, 2.4), path('M44 92 L51 88 L51 96 Z', C.grey, null), cross(60, 92, 7, HOT),
    path('M80 96 L84 84 L88 90 L92 82 L96 90 L98 96 Z', '#fbf3e4', C.ink, 1.3), path('M100 96 L102 86 L106 90 L108 96 Z', '#fbf3e4', C.ink, 1.2), ellipse(96, 98, 16, 3, '#fff8dc', null), circle(94, 97, 4, C.yellow, C.ink, 1), ring(94, 88, 18)),
  /** diffusion: three glasses in time order – a drop of ink, a spreading cloud, evenly coloured water. */
  'term.diffusion': all(ground(), glass(20, 110, 26, 44, WATER, 0.8), circle(20, 78, 3.6, '#2f4a7a', null), line('M20 60 L20 72', '#2f4a7a', 1.4, '2 2'),
    glass(60, 110, 26, 44, WATER, 0.8), path('M60 76 C48 80 50 92 56 96 C62 102 72 96 70 88 C68 80 66 76 60 76 Z', 'rgba(47,74,122,0.55)', null),
    glass(100, 110, 26, 44, 'rgba(47,74,122,0.45)', 0.8), arrow(34, 90, 46, 90, HL, 2.4), arrow(74, 90, 86, 90, HL, 2.4), frame(84, 68, 32, 46)),
  /** isbit: a glass of juice with ice cubes; one cube is enlarged beside it and ringed. */
  'term.isbit': all(ground(), rect(10, 100, 100, 4, C.tan, 1, C.ink, 1), glass(40, 100, 34, 52, '#f2a541', 0.85), iceCube(34, 62, 0.9), iceCube(46, 70, 0.8), iceCube(88, 70, 1.8), ring(88, 72, 24)),

  // ── 3357 Värmemaskiner ──────────────────────────────────────────
  /** värmemaskin: hot block (flame) at the top, heat down through a gear, work out to the side (orange), the rest down to a cold block. */
  'term.värmemaskin': all(rect(30, 4, 60, 22, HOT, 3, C.ink, 1.5), flame(60, 22, 0.7), heat(60, 28, 60, 44, HOT), gear(60, 60, 12), arrow(78, 60, 112, 60, HL, 4), heat(60, 76, 60, 92, C.grey), rect(30, 94, 60, 22, COLD, 3, C.ink, 1.5), snow(60, 105, 5, C.white)),
  /** förbränningsmotor: cut-through cylinder; fuel burns above the piston, which pushes a rod and turns the crank. */
  'term.förbränningsmotor': all(ground(), rect(36, 8, 48, 66, '#d4d8dc', 3, C.ink, 1.8), rect(42, 14, 36, 54, '#fdf3e7', 1, null), flame(60, 34, 1.1), line('M54 8 L54 2 M66 8 L66 2', C.ink, 2.4), path('M57 14 L60 22 L63 14', 'none', C.yellow, 1.6),
    rect(42, 42, 36, 16, STEEL, 2, C.ink, 1.5), line('M60 58 L68 84', C.dark, 4), circle(60, 90, 14, 'none', C.ink, 1.6), circle(68, 84, 3, C.dark, null), circle(60, 90, 3, C.dark, null), arc(60, 90, 20, 140, 40, HL, 2), heat(84, 30, 104, 30, HOT, 1.6), ring(60, 34, 16)),
  /** kolv: a cylinder seen through; the piston inside is orange with a double arrow up and down. */
  'term.kolv': all(ground(), rect(34, 10, 52, 80, '#e8ecef', 3, C.ink, 1.8), rect(38, 46, 44, 20, HL, 3, C.ink, 1.6), line('M38 52 L82 52 M38 58 L82 58', '#b8401f', 1.2), line('M60 66 L60 106', C.dark, 5),
    arrow(100, 62, 100, 32, C.grey, 2.4), arrow(100, 40, 100, 74, C.grey, 2.4), greyed(rect(38, 14, 44, 10, '#fdf3e7', 1, null))),
  /** värmepump: house in snow with a box with a fan on the outside wall; heat taken from the cold air goes into the house. */
  'term.värmepump': all(rect(0, 0, 120, 120, '#e8f0f7', 0, null), rect(0, 104, 120, 16, C.white, 0, null), ground(104), house(44, 88, 1),
    rect(80, 74, 30, 24, C.white, 3, C.ink, 1.6), circle(95, 86, 9, '#e8ecef', C.ink, 1.2), line('M95 77 L95 95 M86 86 L104 86', C.grey, 1.6), line('M80 90 L72 90', C.ink, 2.4), ring(95, 86, 18),
    heat(114, 50, 98, 66, COLD, 1.8), heat(76, 82, 58, 78, HL, 2.4), snow(104, 20, 5), snow(112, 36, 4), snow(82, 40, 3)),
  /** kompressor: the back of a fridge; the black rounded compressor at the bottom is ringed, warm air rises from the grille. */
  'term.kompressor': all(ground(), rect(24, 8, 72, 104, '#eef0f2', 3, C.ink, 1.8), path(range(8).map((i) => `M34 ${18 + i * 8} L86 ${18 + i * 8}`).join(' '), 'none', C.grey, 1.4), line('M34 18 L34 74 M86 18 L86 74', C.grey, 1.4),
    rect(38, 84, 30, 22, IRON, 10, C.ink, 1.6), line('M68 92 L82 92 L82 74', C.grey, 2), ring(53, 95, 20), heat(60, 16, 60, 2, HOT, 1.6), heat(40, 16, 34, 2, HOT, 1.6), heat(80, 16, 86, 2, HOT, 1.6)),
  /** spillvärme: a factory whose useful product goes out grey, while most of the heat escapes as orange waves into the air and the river. */
  'term.spillvärme': all(rect(0, 96, 120, 16, '#7fb6dd', 0, null), path('M4 102 c4 -3 8 -3 12 0 c4 3 8 3 12 0 M70 106 c4 -3 8 -3 12 0 c4 3 8 3 12 0', 'none', C.white, 1.4), ground(96), factory(22, 96),
    heat(62, 36, 62, 6), heat(48, 50, 30, 30), heat(74, 70, 100, 56), heat(40, 98, 40, 112), heat(56, 98, 70, 112), greyed(gear(98, 84, 6), arrow(70, 84, 88, 84, C.grey, 2))),
};
