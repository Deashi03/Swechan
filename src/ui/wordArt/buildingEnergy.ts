/**
 * Teknik & digital värld → Elektronik & energi → Energi i byggnader, 3951–3957 (0.57): heating systems, heat pumps,
 * district heating, insulation and heat loss, ventilation, smart electricity meters and saving energy at home.
 * Recurring signs: hot water and warm air are red, cold water and cold air are blue, the part the word names is
 * outlined in orange (ring or frame) and grey parts show what the word is not. Electricity is a yellow bolt.
 * Words that are easy to mix up get clearly different scenes: luftvärmepump (the indoor unit blowing warm air in a
 * room) and utedel (the outdoor box on the façade in the snow); elmätare (the whole meter in its cabinet) and
 * mätarställning (a close-up of the digits being written down); täta (a sealant gun closing a crack) and
 * tätningslist (a roll of foam strip); självdrag (warm air rising through the roof, no fan) and korsdrag (wind
 * straight through a room between two open windows); nätavgift (a bill to the power line) and effektavgift (one
 * tall bar when several appliances run at once) and spotpris (a price curve over day and night).
 * Digits and the code signs + − = × only; no unit letters, no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waIn, waPulse, waShake, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const BLUE = '#3f7fc8';
const HOT = '#e0533a';
const ICE = '#dcefff';
const WALL = '#efe8dc';
const BRICK = '#c98a6b';
const METAL = '#b8c0c8';
const WOOD = '#c99a62';
const GLOW = 'rgba(242,193,78,0.35)';
const WARMTINT = 'rgba(239,138,60,0.18)';
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const f1 = (n: number) => +n.toFixed(1);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 5, col, 2.6);
const ground = (y = 112, col: string = C.grey2) => line(`M4 ${y} L116 ${y}`, col, 2);
const cross = (x: number, y: number, s = 6, col: string = C.red) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 3);
const bolt = (x: number, y: number, s = 1, col: string = C.yellow) => g(`translate(${x} ${y}) scale(${s})`, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', col, C.ink, 1.4));
/** Wavy heat lines rising from (x, y). */
const heat = (x: number, y: number, n = 3, col: string = HOT, gap = 8, sw = 1.8) => line(range(n).map((i) => `M${x + i * gap} ${y} c-3 -4 3 -6 0 -10 c-3 -4 3 -6 0 -10`).join(' '), col, sw);
/** Horizontal wavy air stream from x1 to x2 at y. */
const air = (x1: number, x2: number, y: number, col: string = BLUE, sw = 2.2) => {
  const n = Math.max(1, Math.round((x2 - x1) / 12));
  const step = (x2 - x1) / n;
  return line(`M${x1} ${y} ` + range(n).map((i) => `q${f1(step / 4)} ${i % 2 ? 3 : -3} ${f1(step / 2)} 0 t${f1(step / 2)} 0`).join(' '), col, sw);
};
const snow = (x: number, y: number, r = 3, col: string = BLUE) => line(`M${x - r} ${y} L${x + r} ${y} M${x - r / 2} ${f1(y - r * 0.87)} L${x + r / 2} ${f1(y + r * 0.87)} M${x - r / 2} ${f1(y + r * 0.87)} L${x + r / 2} ${f1(y - r * 0.87)}`, col, 1.4);
const flame = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 0 C-9 0 -10 -10 -5 -16 C-4 -10 -1 -10 -1 -14 C-1 -20 3 -24 4 -28 C6 -20 12 -14 9 -6 C8 -2 5 0 0 0 Z', C.orange, C.ink, 1.4), path('M0 -1 C-4 -1 -5 -6 -2 -9 C-1 -6 1 -6 1 -9 C3 -6 5 -3 3 -1 Z', C.yellow, null));
const drop = (x: number, y: number, s = 1, col: string = BLUE) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -6 C3 -2 4 1 4 2 C4 5 2 6 0 6 C-2 6 -4 5 -4 2 C-4 1 -3 -2 0 -6 Z', col, C.ink, 1));
const coin = (x: number, y: number, r = 6) => all(circle(x, y, r, C.gold, C.ink, 1.4), circle(x, y, r * 0.6, 'none', '#b8862a', 1.2));
const coins = (x: number, y: number, n: number, r = 6) => all(...range(n).map((i) => ellipse(x, y - i * 3.4, r, r * 0.45, C.gold, C.ink, 1.2)));
const clock = (x: number, y: number, r: number, h = 0, m = 0) => {
  const a = (d: number) => ((d - 90) * Math.PI) / 180;
  return all(circle(x, y, r, C.white, C.ink, 1.6), ...range(12).map((i) => circle(f1(x + Math.cos(a(i * 30)) * r * 0.78), f1(y + Math.sin(a(i * 30)) * r * 0.78), 0.8, C.ink, null)),
    line(`M${x} ${y} L${f1(x + Math.cos(a(h)) * r * 0.5)} ${f1(y + Math.sin(a(h)) * r * 0.5)}`, C.ink, 2), line(`M${x} ${y} L${f1(x + Math.cos(a(m)) * r * 0.75)} ${f1(y + Math.sin(a(m)) * r * 0.75)}`, C.ink, 1.4));
};
/** Thermometer: bulb at the bottom, fill 0–1. */
const thermo = (x: number, y: number, h: number, level: number, col: string = HOT) => all(rect(x - 4, y - h, 8, h, C.white, 4, C.ink, 1.4), rect(x - 2, f1(y - 4 - (h - 8) * level), 4, f1((h - 8) * level + 4), col, 2, null), circle(x, y + 2, 6, col, C.ink, 1.4),
  line(range(4).map((i) => `M${x + 4} ${f1(y - 8 - i * (h - 12) / 3)} l3 0`).join(' '), C.ink, 1));
/** Radiator (element): vertical fins. */
const radiator = (x: number, y: number, w: number, h: number, col: string = C.white, fins = 6) => all(rect(x, y, w, h, col, 3, C.ink, 1.6), line(range(fins - 1).map((i) => `M${f1(x + (w / fins) * (i + 1))} ${y + 3} L${f1(x + (w / fins) * (i + 1))} ${y + h - 3}`).join(' '), C.grey, 1.2),
  line(`M${x + 4} ${y + h} L${x + 4} ${y + h + 4} M${x + w - 4} ${y + h} L${x + w - 4} ${y + h + 4}`, C.ink, 2));
/** House cross-section: walls and roof; inside filled. */
const house = (x: number, y: number, w: number, h: number, fill: string = C.white, roof: string = C.red) => all(rect(x, y, w, h, fill, 0, C.ink, 2), path(`M${x - 6} ${y} L${x + w / 2} ${y - h * 0.55} L${x + w + 6} ${y} Z`, roof, C.ink, 2));
const win = (x: number, y: number, w: number, h: number, glass = '#cfe8f5') => all(rect(x, y, w, h, glass, 1, C.ink, 1.6), line(`M${x + w / 2} ${y} L${x + w / 2} ${y + h} M${x} ${y + h / 2} L${x + w} ${y + h / 2}`, C.ink, 1.2));
const wall = (col: string = WALL) => rect(0, 0, 120, 112, col, 0, null);
/** Simple person; arms go from the shoulders to the given hand points (relative to the hip point x, y). */
const man = (x: number, y: number, s: number, top: string, hands: [number, number, number, number] = [-12, 22, 12, 22], hair: string = C.hair, cap?: string) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-8 0 L-8 34 L-2 34 L0 8 L2 34 L8 34 L8 0 Z', C.navy, C.ink, 1.6), path('M-9 32 L-1 32 L-1 36 L-11 36 Z M1 32 L9 32 L11 36 L1 36 Z', C.black, null),
  line(`M-8 -22 L${hands[0]} ${hands[1] - 30}`, top, 5), line(`M8 -22 L${hands[2]} ${hands[3] - 30}`, top, 5), circle(hands[0], hands[1] - 30, 3, C.skin, C.ink, 1.2), circle(hands[2], hands[3] - 30, 3, C.skin, C.ink, 1.2),
  path('M-10 -24 L10 -24 L9 2 L-9 2 Z', top, C.ink, 1.6), rect(-2.5, -29, 5, 6, C.skin, 1, null), circle(0, -35, 8, C.skin, C.ink, 1.6),
  cap ? path('M-9 -37 C-9 -46 9 -46 9 -37 L13 -37 L13 -35 L-9 -35 Z', cap, C.ink, 1.2) : path('M-8 -37 C-8 -46 8 -46 8 -37 C5 -41 -5 -41 -8 -37 Z', hair, null),
  circle(-3, -35, 1, C.ink, null), circle(3, -35, 1, C.ink, null), line('M-2.5 -31 Q0 -29.5 2.5 -31', C.ink, 1));
const socket = (x: number, y: number, r = 7) => all(rect(x - r - 3, y - r - 3, 2 * r + 6, 2 * r + 6, C.white, 4, C.ink, 1.4), circle(x, y, r, '#eceff2', C.ink, 1.2), circle(x - r * 0.38, y, r * 0.14, C.ink, null), circle(x + r * 0.38, y, r * 0.14, C.ink, null));
/** Outdoor unit of a heat pump: box with a round fan grille. */
const outdoorUnit = (x: number, y: number, s = 1, col: string = '#eef1f4') => g(`translate(${x} ${y}) scale(${s})`, rect(-26, -18, 52, 36, col, 3, C.ink, 1.8), circle(-6, 0, 13, '#d4dae0', C.ink, 1.4),
  line('M-19 0 L7 0 M-6 -13 L-6 13 M-15 -9 L3 9 M-15 9 L3 -9', C.grey, 1), circle(-6, 0, 3, C.dark, null), rect(12, -12, 10, 24, '#dfe4e9', 1, C.ink, 1), line('M14 -6 L20 -6 M14 -1 L20 -1 M14 4 L20 4', C.grey, 1));
/** Indoor unit of an air heat pump: long white box with a flap. */
const indoorUnit = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-30, -9, 60, 18, C.white, 6, C.ink, 1.8), line('M-26 5 L26 5', C.grey, 1.4), circle(22, -3, 1.4, C.green, null));
/** Boiler (panna): tall cabinet with a fire window. */
const boiler = (x: number, y: number, s = 1, fire = true) => g(`translate(${x} ${y}) scale(${s})`, rect(-16, -44, 32, 44, C.white, 3, C.ink, 1.8), rect(-10, -24, 20, 16, C.dark, 3, C.ink, 1.4),
  fire ? flame(0, -9, 0.45) : '', circle(-8, -36, 3, C.silver, C.ink, 1), circle(0, -36, 3, C.silver, C.ink, 1), rect(6, -39, 6, 6, '#dfe9d8', 1, C.ink, 1));
const fridge = (x: number, y: number, w: number, h: number, col: string = C.white) => all(rect(x, y, w, h, col, 4, C.ink, 1.8), line(`M${x} ${y + h * 0.36} L${x + w} ${y + h * 0.36}`, C.ink, 1.4), line(`M${x + w - 6} ${y + 6} L${x + w - 6} ${y + h * 0.3} M${x + w - 6} ${y + h * 0.44} L${x + w - 6} ${y + h * 0.6}`, C.grey, 2.4));
const washer = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-20, -24, 40, 48, C.white, 4, C.ink, 1.8), line('M-20 -14 L20 -14', C.ink, 1.2), circle(0, 6, 12, '#cfe8f5', C.ink, 1.6), circle(0, 6, 8, 'none', C.grey, 1), circle(12, -19, 3, C.silver, C.ink, 1));
const stove = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-18, -20, 36, 40, C.white, 3, C.ink, 1.8), ellipse(-8, -16, 6, 2, C.dark, null), ellipse(8, -16, 6, 2, C.dark, null), rect(-12, -6, 24, 18, C.dark, 2, C.ink, 1.2));
const carPlug = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-20 8 L-16 -4 L12 -4 L20 8 Z', '#7fb3d5', C.ink, 1.6), rect(-22, 6, 44, 10, '#7fb3d5', 4, C.ink, 1.6), circle(-12, 16, 5, C.dark, C.ink, 1.2), circle(12, 16, 5, C.dark, C.ink, 1.2), line('M22 8 C30 8 30 -6 26 -12', C.dark, 2), bolt(28, -16, 0.5));
const tv = (x: number, y: number, s = 1, screen: string = C.dark) => g(`translate(${x} ${y}) scale(${s})`, rect(-30, -20, 60, 36, C.black, 3, C.ink, 1.8), rect(-27, -17, 54, 30, screen, 1, null), line('M-8 22 L8 22 M0 16 L0 22', C.ink, 2.4));
const pylon = (x: number, y: number, s = 1, col: string = C.dark) => g(`translate(${x} ${y}) scale(${s})`, line('M-8 0 L0 -40 L8 0 M-5 -14 L5 -14 M-3 -26 L3 -26 M-12 -32 L12 -32 M-10 -38 L10 -38 M-6 -14 L6 -26 M6 -14 L-6 -26', col, 1.8));
const bill = (x: number, y: number, w: number, h: number) => all(path(`M${x} ${y} L${x + w} ${y} L${x + w} ${y + h} L${x + w - 6} ${y + h - 4} L${x + w - 12} ${y + h} L${x + w - 18} ${y + h - 4} L${x} ${y + h} Z`, C.white, C.ink, 1.6), line(range(3).map((i) => `M${x + 6} ${y + 14 + i * 7} L${x + w - 8} ${y + 14 + i * 7}`).join(' '), C.grey2, 2));
const phone = (x: number, y: number, s = 1, screen: Svg = '') => g(`translate(${x} ${y}) scale(${s})`, rect(-10, -18, 20, 36, C.dark, 3, C.ink, 1.6), rect(-8, -14, 16, 26, '#dff1fb', 1, null), screen);
const leaf = (x: number, y: number, s = 1, col: string = C.green) => g(`translate(${x} ${y}) scale(${s})`, path('M0 8 C-10 0 -6 -10 6 -10 C8 0 6 6 0 8 Z', col, C.ink, 1.2), line('M0 8 L4 -4', C.ink, 1));
const wifi = (x: number, y: number, s = 1, col: string = BLUE) => g(`translate(${x} ${y}) scale(${s})`, path('M-12 -6 C-6 -12 6 -12 12 -6', 'none', col, 2.4), path('M-8 -2 C-4 -6 4 -6 8 -2', 'none', col, 2.4), circle(0, 3, 2, col, null));

export const BLDEN_MOTIFS: Record<string, Svg> = {
  // ── 3951 Uppvärmningssystem ──
  'blden.uppvärmningssystem': all(rect(0, 0, 120, 112, '#eaf3fa', 0, null), snow(10, 20), snow(16, 40), snow(8, 60), ground(),
    rect(20, 18, 92, 94, C.white, 0, C.ink, 2), path('M14 18 L66 4 L118 18 Z', C.red, C.ink, 2), line('M20 52 L112 52 M20 84 L112 84', C.ink, 1.6),
    boiler(38, 110, 0.55), line('M44 88 L44 86 L96 86 L96 70 M96 58 L96 56', HOT, 2.6), line('M44 100 L104 100 L104 66', BLUE, 2.2),
    radiator(84, 62, 20, 12, C.white, 5), radiator(56, 32, 20, 12, C.white, 5), line('M66 86 L66 46 L60 46 M70 46 L74 46 L74 86', HOT, 2.2), line('M78 100 L78 50', BLUE, 1.8),
    heat(60, 28, 3, HOT, 6, 1.4), heat(88, 58, 3, HOT, 6, 1.4), frame(24, 22, 84, 86)),
  'blden.panna.3': all(rect(0, 0, 120, 112, '#e9e1d6', 0, null), ...range(5).map((i) => line(`M0 ${16 + i * 18} L120 ${16 + i * 18}`, '#d8ccbc', 1.4)), ground(),
    boiler(60, 112, 1.6), line('M38 42 L38 30 L20 30 M48 42 L48 24 L20 24', HOT, 3.4), line('M82 42 L82 30 L104 30', BLUE, 3.4), ring(60, 76, 46)),
  'blden.vattenburen': all(path('M24 92 L24 28 L96 28 L96 92 Z', 'none', C.grey2, 9), path('M24 92 L24 28 L96 28', 'none', HOT, 5), path('M96 28 L96 92 L24 92', 'none', BLUE, 5),
    greyed(boiler(24, 104, 0.5), radiator(84, 50, 24, 26, C.white, 5)),
    moving('blden-vattenburen-1', '0%{transform:translate(0,40px);opacity:.2}50%,100%{transform:translate(0,0);opacity:1}', { dur: 2.8 }, drop(24, 50, 1.2, HOT), drop(24, 66, 1.2, HOT)),
    drop(46, 28, 1.2, HOT), drop(66, 28, 1.2, HOT), drop(60, 92, 1.2, BLUE), drop(80, 92, 1.2, BLUE), arrow(36, 20, 56, 20, HL, 2.6), arrow(84, 100, 64, 100, HL, 2.6), ring(60, 60, 50)),
  'blden.elvärme': all(wall(), ground(), rect(14, 52, 64, 34, C.white, 4, C.ink, 2), line(range(7).map((i) => `M${22 + i * 8} 58 L${22 + i * 8} 80`).join(' '), C.grey2, 1.6), circle(70, 58, 2, C.red, null),
    line('M78 80 C88 82 92 92 96 92', C.dark, 2.4), socket(102, 92, 6), bolt(46, 40, 0.9), heat(30, 46, 4, HOT, 10, 1.6), frame(8, 28, 102, 76)),
  'blden.kamin': all(wall('#f1e6da'), rect(0, 104, 120, 8, '#c9b49a', 0, null), ground(),
    rect(52, 4, 12, 40, C.black, 1, C.ink, 1.6), rect(36, 44, 44, 60, C.black, 6, C.ink, 2), rect(42, 56, 32, 28, '#3a2a22', 3, C.ink, 1.4), flame(58, 82, 0.8), flame(50, 82, 0.5), flame(66, 82, 0.5),
    line('M40 104 L36 110 M76 104 L80 110', C.ink, 2.4), ...[0, 1, 2].map((i) => all(ellipse(100, 98 - i * 8, 12, 4, WOOD, C.ink, 1.2), ellipse(89, 98 - i * 8, 3, 4, '#e2c08d', C.ink, 1))), ring(58, 66, 34)),
  'blden.värma-upp.2': all(house(14, 46, 92, 64, '#eef5fb'), ground(), win(24, 58, 22, 20), radiator(58, 86, 30, 16, C.white, 6), thermo(98, 100, 40, 0.75),
    moving('blden-varmaupp-1', '0%{opacity:0}60%,100%{opacity:1}', { dur: 3 }, rect(16, 48, 88, 60, WARMTINT, 0, null)),
    waIn('blden-varmaupp-2', 0, 14, heat(62, 80, 3, HOT, 10, 2.2)), snow(6, 34), snow(112, 34), frame(12, 44, 96, 66)),
  'blden.lufta.2': all(wall(), ground(), radiator(18, 44, 84, 46, C.white, 9), circle(96, 50, 3, C.silver, C.ink, 1.2),
    g('rotate(-20 100 44)', rect(98, 30, 4, 14, C.gold, 1, C.ink, 1), circle(100, 28, 5, 'none', C.gold, 2.4)),
    waIn('blden-lufta-1', -4, 14, circle(88, 38, 4, '#e3f1fb', BLUE, 1.8), circle(80, 26, 5, '#e3f1fb', BLUE, 1.8), circle(88, 12, 4, '#e3f1fb', BLUE, 1.8)),
    rect(80, 92, 26, 6, C.sky, 2, C.ink, 1), ring(96, 50, 10), line('M24 54 L60 54', C.grey2, 1, '3 3')),
  'blden.inomhustemperatur': all(rect(0, 0, 120, 112, '#e6f0f8', 0, null), snow(8, 14), snow(14, 34), snow(6, 54), ground(),
    house(26, 40, 88, 72, '#fff6ea'), win(34, 54, 22, 20), radiator(36, 92, 28, 12, C.white, 5),
    thermo(86, 96, 44, 0.7), T(86, 47, '21', 12, HOT), frame(72, 32, 30, 74), greyed(thermo(12, 104, 30, 0.15, BLUE))),

  // ── 3952 Värmepumpar ──
  'blden.luftvärmepump': all(wall('#f3eee5'), rect(0, 100, 120, 12, '#cbb79c', 0, null), indoorUnit(60, 20, 1.1),
    moving('blden-lvp-1', '0%{transform:translate(0,-8px);opacity:.2}60%,100%{transform:translate(0,0);opacity:1}', { dur: 2.6 }, path('M40 36 C36 46 44 52 38 62 M60 36 C56 46 64 52 58 62 M80 36 C76 46 84 52 78 62', 'none', HOT, 2.4)),
    path('M26 98 L26 82 C26 76 32 74 38 74 L82 74 C88 74 94 76 94 82 L94 98 Z', '#6f8fbf', C.ink, 1.8), rect(22, 82, 8, 18, '#6f8fbf', 3, C.ink, 1.4), rect(90, 82, 8, 18, '#6f8fbf', 3, C.ink, 1.4),
    rect(6, 40, 18, 26, '#cfe8f5', 1, C.ink, 1.4), greyed(outdoorUnit(15, 58, 0.25)), frame(24, 6, 72, 30)),
  'blden.utedel': all(rect(0, 0, 120, 112, '#e8f1f8', 0, null), rect(0, 0, 84, 96, '#c98a5a', 0, null), ...range(8).map((i) => line(`M0 ${12 * i + 6} L84 ${12 * i + 6}`, '#a86e44', 1.4)), line('M84 0 L84 96', C.ink, 1.8),
    rect(0, 96, 120, 16, C.white, 0, null), ground(96, '#bcc8d2'), outdoorUnit(52, 72, 1.1), line('M30 92 L30 98 M74 92 L74 98', C.dark, 3), line('M78 62 C90 62 90 40 80 36', C.dark, 2.4),
    snow(100, 20), snow(108, 44), snow(96, 62), path('M24 52 L80 52 L80 50 C60 46 40 46 24 50 Z', C.white, C.ink, 1), ring(52, 72, 36)),
  'blden.köldmedium': all(path('M20 30 L100 30 L100 90 L20 90 Z', 'none', C.grey, 7), path('M20 30 L100 30 L100 90 L20 90 Z', 'none', C.grey2, 4), greyed(rect(88, 50, 24, 20, C.dark, 3, C.ink, 1.4)),
    line('M20 90 L20 30 L60 30', BLUE, 4), line('M60 30 L100 30 M100 90 L60 90', HOT, 4), line('M60 90 L20 90', BLUE, 4), snow(20, 60, 6), heat(56, 108, 2, HOT, 10),
    circle(46, 60, 22, C.white, C.ink, 2), path('M26 62 C34 56 40 66 46 60 C52 54 58 64 66 60 L66 66 C64 76 30 78 26 66 Z', '#7fb8e6', null), ...[[36, 54], [50, 50], [56, 56]].map(([x, y]) => circle(x!, y!, 2.4, 'none', BLUE, 1.2)),
    line('M30 30 L38 44 M62 30 L54 44', C.ink, 1.2, '2 2'), ring(46, 60, 25), arrow(70, 22, 86, 22, C.ink, 2)),
  'blden.värmefaktor': all(bolt(16, 56, 1.3), T(16, 86, '1', 14), arrow(28, 56, 40, 56, C.ink, 2.4), rect(42, 38, 30, 36, C.white, 4, C.ink, 1.8), circle(57, 56, 9, '#d4dae0', C.ink, 1.2),
    arrow(57, 100, 57, 78, C.green, 2.4), line('M40 106 L74 106', C.brown, 3), arrow(76, 56, 86, 56, C.ink, 2.4),
    ...[36, 56, 76].map((y) => heat(92, y + 10, 3, HOT, 7, 2)), T(104, 104, '3', 16, HL), frame(86, 24, 32, 88)),
  'blden.bullra': all(rect(0, 0, 120, 112, '#e8f1f8', 0, null), ground(), rect(78, 18, 42, 94, '#d9c4a5', 0, C.ink, 1.6), rect(86, 30, 26, 30, '#cfe8f5', 1, C.ink, 1.4),
    g('translate(99 52)', circle(0, -6, 7, C.skin, C.ink, 1.4), path('M-7 -9 C-7 -16 7 -16 7 -9 C4 -12 -4 -12 -7 -9 Z', C.hair, null), path('M-9 8 L9 8 L8 2 L-8 2 Z', C.green, C.ink, 1.2), line('M-7 -6 L-11 -2 M7 -6 L11 -2', C.skin, 3), line('M-3 -3 Q0 -5 3 -3', C.ink, 1)),
    waShake('blden-bullra-1', outdoorUnit(36, 90, 0.85)), line('M60 70 l6 -4 l-2 6 l6 -4 M60 82 l8 -2 l-4 6 l8 -2 M14 66 l-6 -4 l2 6 l-6 -4', HL, 2.2), ring(36, 90, 26)),

  // ── 3953 Fjärrvärme ──
  'blden.avfallsförbränning': all(rect(0, 0, 120, 112, '#ebe6df', 0, null), ground(), rect(36, 46, 64, 66, C.grey, 3, C.ink, 2), rect(50, 70, 36, 30, '#3a2a22', 3, C.ink, 1.6),
    waPulse('blden-avfall-1', flame(62, 98, 0.7), flame(74, 98, 0.7), flame(68, 96, 0.9)), path('M36 46 L18 30 L36 30 Z', C.dark, C.ink, 1.4),
    waIn('blden-avfall-2', -10, -18, path('M14 18 C10 12 18 8 22 12 C26 8 32 14 28 20 C30 28 14 28 14 18 Z', C.black, C.ink, 1.2), path('M24 34 C20 28 28 24 32 28 C36 26 40 32 36 36 C36 42 24 42 24 34 Z', '#4b8a5a', C.ink, 1.2)),
    line('M100 60 L116 60', HOT, 4), heat(104, 56, 2, HOT, 8), frame(32, 42, 72, 70)),
  'blden.flis': all(rect(0, 0, 120, 112, '#eef2e6', 0, null), ground(), path('M8 108 C20 70 46 48 62 46 C80 46 104 74 114 108 Z', '#d8b07a', C.ink, 2),
    ...[[30, 92], [44, 76], [58, 62], [70, 70], [84, 86], [96, 98], [52, 96], [70, 92], [40, 102], [80, 104], [62, 82], [90, 76]].map(([x, y], i) => path(`M${x} ${y} l7 -2 l2 4 l-7 3 Z`, i % 2 ? '#b8874f' : '#e9c995', C.ink, 0.9)),
    line('M8 28 L44 20 M24 24 L30 12 M34 22 L44 12', C.brown, 3), leaf(30, 12, 0.6), leaf(44, 12, 0.6), ring(62, 82, 40)),
  'blden.rörledning': all(rect(0, 0, 120, 112, '#e9f2e4', 0, null), path('M0 80 L120 80 L120 112 L0 112 Z', '#9fc28a', null), line('M0 80 L120 80', C.ink, 1.4),
    rect(-4, 44, 128, 12, METAL, 6, C.ink, 1.8), rect(-4, 60, 128, 12, METAL, 6, C.ink, 1.8), ...[30, 90].map((x) => all(rect(x - 3, 42, 6, 32, '#8f99a3', 1, C.ink, 1.2), line(`M${x} 74 L${x - 8} 96 M${x} 74 L${x + 8} 96`, C.dark, 2.4))),
    arrow(50, 50, 70, 50, HOT, 2.4), arrow(70, 66, 50, 66, BLUE, 2.4), frame(2, 38, 116, 40)),
  'blden.värmeväxlare': all(wall('#f2eee8'), rect(42, 26, 36, 64, C.silver, 3, C.ink, 2), ...range(7).map((i) => line(`M46 ${32 + i * 8} L74 ${32 + i * 8}`, C.grey, 1.4)),
    line('M4 34 L42 34', HOT, 4), line('M42 82 L4 82', BLUE, 4), line('M116 82 L78 82', BLUE, 4), line('M78 34 L116 34', HOT, 4),
    arrow(10, 26, 30, 26, HOT, 2), arrow(30, 92, 10, 92, BLUE, 2), arrow(90, 92, 110, 92, BLUE, 2), arrow(110, 26, 90, 26, HOT, 2), greyed(rect(4, 50, 20, 16, C.white, 2, C.ink, 1)), radiator(94, 50, 20, 16, C.white, 4), frame(38, 22, 44, 72)),
  'blden.fjärrkyla': all(rect(0, 0, 120, 112, '#fff4dc', 0, null), circle(102, 14, 9, C.yellow, C.ink, 1.4), ground(), path('M0 86 C20 80 36 82 50 86 L50 112 L0 112 Z', '#6fa8dc', C.ink, 1.4), line('M6 96 l8 0 M22 102 l10 0', C.white, 1.6),
    rect(66, 30, 46, 82, '#dfe6ee', 2, C.ink, 1.8), ...range(4).map((r) => range(3).map((c) => rect(72 + c * 13, 38 + r * 16, 9, 10, '#bfe0f4', 1, C.ink, 1)).join('')), line('M30 92 L30 104 L66 104', BLUE, 4),
    snow(89, 100, 5), arrow(40, 98, 58, 98, BLUE, 2), frame(26, 24, 90, 86)),
  'blden.prishöjning': all(greyed(path('M14 86 L40 86 L48 94 L40 102 L14 102 Z', C.white, C.ink, 1.6), coin(26, 94, 4)),
    path('M52 40 L96 40 L108 56 L96 102 L52 102 Z', '#fff2cc', C.ink, 2), circle(98, 56, 3, C.white, C.ink, 1.2), coin(70, 70, 8), coin(70, 88, 8), coin(84, 80, 7),
    arrow(30, 76, 30, 20, HL, 4), line('M24 76 L36 76', HL, 2), ring(78, 72, 36)),

  // ── 3954 Isolering och värmeförlust ──
  'blden.mineralull': all(rect(0, 0, 120, 112, '#e9dcc6', 0, null), path('M0 30 L60 4 L120 30', 'none', C.brown, 6), ...[20, 60, 100].map((x) => rect(x - 3, 70, 6, 42, WOOD, 1, C.ink, 1.2)), rect(0, 108, 120, 4, WOOD, 0, null),
    path('M23 88 C34 80 46 82 57 88 L57 108 L23 108 Z', C.yellow, C.ink, 1.4), path('M63 96 C74 90 86 92 97 96 L97 108 L63 108 Z', C.yellow, C.ink, 1.4), line('M28 96 q4 -3 8 0 t8 0 M66 102 q4 -3 8 0 t8 0', '#c99b2a', 1.2),
    ellipse(84, 64, 16, 16, C.yellow, C.ink, 1.8), path('M84 48 C96 50 100 62 92 70 C86 74 80 70 82 64', 'none', '#c99b2a', 1.4), path('M68 64 L68 92 L100 92', 'none', C.ink, 1.4),
    g('translate(40 52)', path('M-10 -8 C-4 -12 6 -12 10 -8 C14 -4 14 4 10 6 L-8 6 C-12 4 -13 -4 -10 -8 Z', C.green, C.ink, 1.4)), ring(84, 66, 24)),
  'blden.köldbrygga': all(rect(0, 0, 40, 112, '#3b6fb6', 0, null), rect(80, 0, 40, 112, '#e9b98a', 0, null), rect(40, 0, 40, 112, '#f6e27a', 0, C.ink, 1.6), ...range(7).map((i) => line(`M42 ${8 + i * 16} q8 -6 18 0 t18 0`, '#d9c04a', 1.2)),
    rect(40, 48, 40, 14, '#9aa3ad', 0, C.ink, 1.6), path('M80 48 L120 48 L120 62 L80 62 Z', HOT, null), path('M40 48 L80 48 L80 62 L40 62 Z', 'rgba(224,83,58,0.55)', null),
    arrow(92, 55, 6, 55, HOT, 3), greyed(arrow(100, 24, 86, 24, HOT, 2), arrow(100, 92, 86, 92, HOT, 2)), ring(60, 55, 16)),
  'blden.täta': all(wall(), rect(14, 14, 60, 84, C.white, 2, C.ink, 2), rect(20, 20, 48, 72, '#cfe8f5', 1, C.ink, 1.4), rect(74, 14, 6, 84, '#d9cdb8', 0, C.ink, 1),
    line('M76 22 L76 90', C.white, 3), line('M76 22 L76 90', C.ink, 0.6, '1 2'),
    moving('blden-tata-1', '0%{transform:translate(0,-52px)}70%,100%{transform:translate(0,0)}', { dur: 3 }, g('translate(90 86) rotate(-30)', rect(-6, -24, 12, 30, C.orange, 3, C.ink, 1.4), path('M-2 -24 L2 -24 L1 -34 L-1 -34 Z', C.white, C.ink, 1), line('M-6 4 L-14 18', C.dark, 3))),
    greyed(arrow(116, 40, 96, 40, BLUE, 2.4), arrow(116, 60, 96, 60, BLUE, 2.4)), cross(106, 50, 5), ring(76, 56, 14)),
  'blden.tätningslist': all(wall(), rect(16, 6, 12, 106, C.white, 0, C.ink, 1.6), rect(24, 6, 6, 106, '#7d8790', 0, C.ink, 1), rect(30, 6, 6, 100, '#a9b2bb', 0, null),
    circle(80, 66, 26, '#7d8790', C.ink, 2), circle(80, 66, 18, '#a9b2bb', C.ink, 1.2), circle(80, 66, 11, C.white, C.ink, 1.4), path('M54 66 C46 66 36 60 33 50 L36 48', 'none', '#7d8790', 6),
    path('M58 72 L104 72', 'none', '#c9ced4', 1, ), ring(80, 66, 30)),
  'blden.glipa': all(wall('#f2ece2'), rect(0, 96, 120, 16, '#c9a77c', 0, null), line('M0 96 L120 96', C.ink, 1.4),
    rect(30, 0, 60, 88, '#a0673d', 2, C.ink, 2), rect(38, 10, 44, 30, '#b97c4f', 2, C.ink, 1.2), rect(38, 48, 44, 32, '#b97c4f', 2, C.ink, 1.2), circle(82, 50, 3, C.gold, C.ink, 1),
    air(4, 116, 92, BLUE, 2), arrow(96, 92, 112, 92, BLUE, 2.4), frame(28, 86, 64, 12)),
  'blden.kondens': all(rect(10, 8, 100, 96, C.white, 3, C.ink, 2), rect(16, 14, 88, 84, '#d6e9f5', 1, C.ink, 1.4), line('M60 14 L60 98', C.ink, 1.6),
    ...[[24, 24], [36, 36], [28, 52], [44, 22], [48, 62], [70, 30], [86, 26], [78, 50], [94, 44], [90, 68], [72, 76], [32, 80]].map(([x, y]) => drop(x!, y!, 0.7, '#8cc2ea')),
    line('M40 66 L40 92 M84 52 L84 92', '#8cc2ea', 2), rect(14, 96, 92, 6, '#8cc2ea', 2, null), snow(116, 20, 3), ring(60, 56, 46)),
  'blden.energideklaration': all(rect(22, 8, 76, 100, C.white, 3, C.ink, 2), path('M36 34 L50 22 L64 34 L64 46 L36 46 Z', '#f6d6b8', C.ink, 1.4), rect(46, 38, 8, 8, '#a0673d', 1, C.ink, 1),
    ...['#2e9e5b', '#7cc04a', '#c8d941', '#f2d33c', '#f2a93b', '#e86b2e', '#d43a2f'].map((c, i) => rect(32, 54 + i * 7, 20 + i * 6, 5, c, 1, null)), path('M90 75 L78 75 L74 78 L78 81 L90 81 Z', C.ink, null),
    circle(82, 26, 8, '#e9c46a', C.ink, 1.4), path('M78 32 L76 42 L82 38 L88 42 L86 32', '#e9c46a', C.ink, 1.2), frame(18, 4, 84, 108)),

  // ── 3955 Ventilation ──
  'blden.ventil.2': all(rect(0, 0, 120, 40, '#f4f1ec', 0, null), line('M0 40 L120 40', C.ink, 1.8), rect(0, 40, 120, 72, '#eae4da', 0, null),
    rect(40, 32, 40, 8, C.white, 2, C.ink, 1.6), ellipse(60, 44, 30, 7, C.white, C.ink, 2), ellipse(60, 44, 10, 3, '#c9ced4', C.ink, 1.2),
    moving('blden-ventil-1', '0%{transform:translate(0,22px);opacity:.2}60%,100%{transform:translate(0,0);opacity:1}', { dur: 2.4 }, arrow(30, 84, 40, 58, BLUE, 2.4), arrow(60, 90, 60, 60, BLUE, 2.4), arrow(90, 84, 80, 58, BLUE, 2.4)),
    ring(60, 44, 36)),
  'blden.luftkanal': all(rect(0, 0, 120, 112, '#e8dcc7', 0, null), path('M0 26 L60 2 L120 26', 'none', C.brown, 5), rect(0, 100, 120, 12, WOOD, 0, null),
    path('M6 52 L76 52 C90 52 96 58 96 72 L96 100', 'none', C.ink, 18), path('M6 52 L76 52 C90 52 96 58 96 72 L96 100', 'none', METAL, 14), line('M24 45 L24 59 M44 45 L44 59 M64 45 L64 59 M89 80 L103 80', C.grey, 1.4),
    arrow(14, 52, 34, 52, BLUE, 2.4), arrow(52, 52, 72, 52, BLUE, 2.4), frame(2, 40, 108, 66)),
  'blden.suga-ut': all(rect(0, 0, 120, 112, '#e6f1f2', 0, null), ...range(6).map((i) => line(`M0 ${18 * i + 8} L120 ${18 * i + 8}`, '#cfe0e2', 1)), ground(),
    rect(86, 14, 26, 26, C.white, 3, C.ink, 1.8), circle(99, 27, 9, '#d4dae0', C.ink, 1.2), line('M92 27 L106 27 M99 20 L99 34', C.grey, 1.2),
    path('M10 104 L10 78 L64 78 L64 104', 'none', C.ink, 2), rect(10, 70, 54, 10, C.white, 3, C.ink, 1.6),
    waIn('blden-sugaut-1', -46, 36, path('M54 36 C50 28 60 22 66 28 C72 22 82 28 78 36 C82 42 74 46 68 42 C62 48 50 44 54 36 Z', '#e9eef2', C.ink, 1.2)), arrow(82, 30, 88, 28, HL, 2.4),
    path('M24 66 C20 58 30 54 34 60 C40 54 48 60 44 66 Z', '#e9eef2', C.ink, 1), ring(99, 27, 16)),
  'blden.självdrag': all(rect(0, 0, 120, 112, '#e6f0f8', 0, null), snow(8, 30), snow(112, 40), ground(), house(24, 46, 72, 66, '#fff6ea'), rect(64, 6, 10, 26, BRICK, 1, C.ink, 1.6),
    win(32, 60, 16, 16), win(72, 60, 16, 16), rect(26, 98, 8, 6, C.white, 1, C.ink, 1), arrow(10, 101, 30, 101, BLUE, 2.4),
    moving('blden-sjalvdrag-1', '0%{transform:translate(0,40px);opacity:.2}60%,100%{transform:translate(0,0);opacity:1}', { dur: 3 }, arrow(56, 90, 66, 52, HOT, 2.6), arrow(69, 40, 69, 4, HOT, 2.6)),
    greyed(g('translate(104 90)', circle(0, 0, 8, '#d4dae0', C.ink, 1.2), line('M-6 0 L6 0 M0 -6 L0 6', C.grey, 1))), cross(104, 90, 8), frame(20, 0, 80, 110)),
  'blden.värmeåtervinning': all(rect(0, 0, 120, 112, '#f2eee8', 0, null), path('M60 30 L90 60 L60 90 L30 60 Z', C.silver, C.ink, 2), line('M38 52 L82 52 M38 60 L82 60 M38 68 L82 68', C.grey, 1),
    line('M4 30 L36 54', HOT, 5), line('M84 66 L116 90', '#e8a08f', 5), line('M4 90 L36 66', BLUE, 5), line('M84 54 L116 30', HOT, 5),
    moving('blden-vatervinning-1', '0%{transform:translate(-14px,10px);opacity:.2}60%,100%{transform:translate(0,0);opacity:1}', { dur: 2.6 }, arrow(96, 44, 110, 34, HOT, 2.4)),
    arrow(10, 86, 26, 74, BLUE, 2.4), arrow(10, 34, 26, 46, HOT, 2.4), arrow(96, 76, 110, 86, '#e8a08f', 2.4), ring(60, 60, 34)),
  'blden.korsdrag': all(wall('#f3eee5'), ground(), rect(4, 30, 22, 40, '#cfe8f5', 1, C.ink, 1.6), rect(94, 30, 22, 40, '#cfe8f5', 1, C.ink, 1.6), path('M26 30 L40 36 L40 74 L26 70 Z', '#e8f4fb', C.ink, 1.4), path('M94 30 L80 36 L80 74 L94 70 Z', '#e8f4fb', C.ink, 1.4),
    moving('blden-korsdrag-1', '0%{transform:translate(-40px,0);opacity:.2}60%,100%{transform:translate(0,0);opacity:1}', { dur: 2.2 }, air(16, 104, 40, BLUE, 2.4), air(16, 104, 52, BLUE, 2.4), air(16, 104, 64, BLUE, 2.4), arrow(100, 52, 114, 52, BLUE, 2.4)),
    path('M48 84 L72 84 L68 104 L52 104 Z', '#c47a4a', C.ink, 1.4), path('M60 84 C62 74 70 72 76 70 M60 84 C58 74 52 72 46 72', 'none', C.green, 2), frame(2, 26, 116, 50)),

  // ── 3956 Smarta elmätare ──
  'blden.elmätare': all(wall('#ece8e1'), rect(18, 10, 84, 96, '#d7dbe0', 3, C.ink, 2), rect(34, 24, 52, 62, C.white, 4, C.ink, 1.8), rect(40, 32, 40, 14, '#dfe9d8', 2, C.ink, 1.4), T(60, 43, '04387', 9),
    waPulse('blden-elmatare-1', circle(46, 56, 3, C.red, C.ink, 1)), circle(60, 56, 2, C.dark, null), rect(40, 66, 40, 12, C.grey2, 2, C.ink, 1), line('M46 86 L46 106 M60 86 L60 106 M74 86 L74 106', C.dark, 2.4), ring(60, 52, 36)),
  'blden.smart.2': all(greyed(g('translate(26 74)', path('M-12 -24 L12 -24 L18 0 L-18 0 Z', C.yellow, C.ink, 1.4), line('M0 0 L0 30', C.ink, 2), line('M-10 30 L10 30', C.ink, 2.4))),
    g('translate(82 74)', path('M-12 -24 L12 -24 L18 0 L-18 0 Z', C.yellow, C.ink, 1.4), line('M0 0 L0 30', C.ink, 2), line('M-10 30 L10 30', C.ink, 2.4)), wifi(82, 36, 1.3), circle(82, 66, 6, GLOW, null),
    phone(104, 20, 0.7, all(rect(-6, -8, 12, 12, C.white, 1, null), circle(0, -2, 3, C.yellow, C.ink, 0.8))), path('M90 30 C96 26 98 24 98 22', 'none', BLUE, 1.6, ), frame(56, 8, 62, 104)),
  'blden.mätarställning': all(rect(0, 0, 120, 112, '#eceff2', 0, null), rect(8, 14, 104, 36, C.white, 4, C.ink, 2), ...range(5).map((i) => rect(16 + i * 18, 20, 16, 24, i === 4 ? '#f6d6b8' : '#2e2e36', 2, C.ink, 1.2)),
    ...['0', '4', '3', '8', '7'].map((d, i) => T(24 + i * 18, 39, d, 16, i === 4 ? C.ink : C.white)), frame(10, 16, 100, 32),
    rect(28, 64, 56, 44, '#fffbe8', 2, C.ink, 1.6), line('M34 76 L78 76 M34 88 L78 88 M34 100 L78 100', '#c9d6e6', 1), T(52, 86, '04387', 10, C.navy), g('translate(92 80) rotate(30)', rect(-3, -22, 6, 30, C.yellow, 1, C.ink, 1.2), path('M-3 8 L0 14 L3 8 Z', '#f1c7a1', C.ink, 1))),
  'blden.elnätsföretag': all(rect(0, 0, 120, 112, '#eaf3fa', 0, null), ground(), pylon(18, 100, 1.4), pylon(70, 100, 1.1), line('M6 50 C30 62 50 62 62 58 M30 50 C46 58 62 60 78 58 M78 58 C90 66 100 74 106 80', C.dark, 1.2),
    house(92, 84, 22, 28, C.white), path('M30 112 L30 100 L60 100 L66 92 L76 92 L80 100 L84 100 L84 112 Z', C.orange, C.ink, 1.6), circle(42, 110, 5, C.dark, C.ink, 1), circle(74, 110, 5, C.dark, C.ink, 1),
    line('M56 92 L66 72', C.grey, 3), rect(62, 62, 12, 10, C.yellow, 1, C.ink, 1.2), man(68, 56, 0.35, C.orange, [-8, 10, 8, 10], C.hair, C.yellow), frame(4, 40, 112, 72)),
  'blden.nätavgift': all(bill(14, 18, 50, 74), pylon(39, 60, 0.7), line('M20 40 L58 40', C.dark, 1), coin(84, 86, 7), coin(96, 74, 7),
    arrow(70, 60, 92, 40, HL, 3), pylon(102, 40, 0.8), line('M84 10 C96 14 108 14 118 10', C.dark, 1.2), frame(10, 14, 58, 84), greyed(bolt(110, 96, 0.8))),
  'blden.effektavgift': all(line('M10 104 L114 104 M10 104 L10 20', C.ink, 1.8), ...[18, 22, 16, 30, 24, 72, 28, 20].map((h, i) => rect(16 + i * 12, 104 - h, 9, h, i === 5 ? HL : C.grey2, 1, C.ink, 1.2)),
    stove(40, 30, 0.45), washer(70, 30, 0.45), carPlug(100, 32, 0.45), path('M48 42 L74 30 M74 42 L76 34 M94 42 L80 34', 'none', HL, 1.4), coin(76, 22, 5), ring(80, 70, 18)),
  // ── 3957 Energibesparing i hemmet ──
  'blden.energibesparing': all(rect(0, 0, 120, 112, '#f2f7ee', 0, null), g('translate(30 40)', path('M-16 6 L0 -10 L16 6 L16 26 L-16 26 Z', C.white, C.ink, 1.8), rect(-4, 14, 8, 12, '#a0673d', 1, C.ink, 1)),
    bolt(70, 32, 1.6), arrow(70, 52, 70, 80, HL, 4), greyed(rect(88, 22, 10, 50, C.grey2, 1, C.ink, 1)), rect(102, 52, 10, 20, HL, 1, C.ink, 1.2), coins(30, 100, 5, 9), coins(52, 100, 3, 9), frame(4, 6, 112, 102)),
  'blden.energitjuv.2': all(wall('#eceff2'), ground(), fridge(30, 30, 50, 80, '#e6ecef'), path('M30 30 L80 30 L80 40 L30 40 Z', ICE, C.ink, 1), ...[[38, 48], [56, 52], [70, 46]].map(([x, y]) => snow(x!, y!, 4)),
    line('M80 96 C92 96 96 88 102 88', C.dark, 2.4), socket(108, 88, 5),
    moving('blden-energitjuv-1', '0%{transform:translate(16px,-4px);opacity:.2}60%,100%{transform:translate(0,0);opacity:1}', { dur: 2 }, bolt(92, 72, 0.6), bolt(98, 60, 0.6)), bolt(86, 50, 0.7), coin(16, 30, 5), coin(10, 48, 5), arrow(24, 60, 10, 70, HL, 2.2), frame(26, 26, 58, 86)),
  'blden.standbyläge': all(rect(0, 0, 120, 112, '#1f2a3d', 0, null), path('M98 10 A9 9 0 1 0 108 22 A7 7 0 1 1 98 10 Z', '#f2e6a6', null), rect(0, 92, 120, 20, '#3a3f4f', 0, null),
    tv(56, 58, 1.3), waPulse('blden-standby-1', circle(88, 76, 2.6, C.red, null), circle(88, 76, 6, 'rgba(214,69,69,0.35)', null)), rect(78, 96, 22, 8, C.dark, 3, C.ink, 1), ring(88, 76, 10)),
  'blden.avfrosta': all(wall('#eef2f5'), ground(), rect(20, 14, 64, 92, C.white, 4, C.ink, 2), rect(26, 20, 52, 76, ICE, 2, C.ink, 1.4), rect(26, 20, 52, 12, '#bfe0f4', 2, C.ink, 1), rect(26, 90, 52, 6, '#bfe0f4', 1, null),
    path('M84 14 L106 22 L106 100 L84 106 Z', '#f4f6f8', C.ink, 1.8), ...[34, 48, 62, 72].map((x) => path(`M${x} 32 l2 6 l2 -6`, '#bfe0f4', C.ink, 0.8)),
    moving('blden-avfrosta-1', '0%{transform:translate(0,-12px);opacity:.1}70%,100%{transform:translate(0,0);opacity:1}', { dur: 1.8 }, drop(38, 50, 0.8), drop(56, 58, 0.8), drop(70, 48, 0.8)),
    path('M30 108 L74 108 L70 100 L34 100 Z', '#8cc2ea', C.ink, 1.2), ring(52, 34, 26)),
  'blden.energimärkning': all(rect(26, 6, 68, 100, C.white, 3, C.ink, 2), rect(26, 6, 68, 12, '#2f4a7a', 3, C.ink, 1.4),
    ...['#2e9e5b', '#7cc04a', '#c8d941', '#f2d33c', '#f2a93b', '#e86b2e', '#d43a2f'].map((c, i) => path(`M32 ${24 + i * 10} L${50 + i * 5} ${24 + i * 10} L${55 + i * 5} ${28 + i * 10} L${50 + i * 5} ${32 + i * 10} L32 ${32 + i * 10} Z`, c, null)),
    path('M90 24 L74 24 L69 28 L74 32 L90 32 Z', C.ink, null), bolt(60, 98, 0.6), line('M34 96 L50 96 M70 96 L86 96', C.grey2, 2), frame(22, 2, 76, 108), greyed(washer(110, 90, 0.4))),
  'blden.ekoprogram': all(wall('#eef0f2'), ground(), rect(20, 14, 80, 98, C.white, 5, C.ink, 2), line('M20 40 L100 40', C.ink, 1.4), circle(60, 76, 24, '#cfe8f5', C.ink, 1.8), circle(60, 76, 16, 'none', C.grey, 1.2),
    circle(42, 27, 9, C.silver, C.ink, 1.4), line('M42 27 L48 22', C.ink, 2), ...range(6).map((i) => { const a = (-150 + i * 30) * Math.PI / 180; return circle(f1(42 + Math.cos(a) * 13), f1(27 + Math.sin(a) * 13), 1.2, C.ink, null); }),
    leaf(56, 24, 0.9), clock(84, 26, 9, 90, 0), drop(70, 22, 0.6), ring(54, 26, 12)),
  'blden.energirådgivare': all(wall('#f3eee5'), rect(0, 86, 120, 26, '#c9a77c', 0, null), rect(6, 74, 70, 6, '#a0673d', 1, C.ink, 1.4), line('M14 80 L14 104 M68 80 L68 104', '#a0673d', 3),
    man(92, 70, 1, C.green, [-14, 10, -18, 2], C.hair), rect(66, 34, 16, 20, C.white, 1, C.ink, 1.4), line('M70 40 L78 40 M70 45 L78 45', C.grey2, 1.4),
    greyed(man(22, 70, 0.9, C.sky, [10, 8, 12, 10]), man(48, 70, 0.9, C.purple, [-10, 8, -12, 10], C.hair)),
    g('translate(26 64)', path('M-12 6 L0 -6 L12 6 L12 14 L-12 14 Z', '#f6d6b8', C.ink, 1.2)), bolt(50, 66, 0.5),
    path('M76 4 L118 4 L118 26 L96 26 L90 32 L90 26 L76 26 Z', C.white, C.ink, 1.4), bolt(90, 15, 0.55), arrow(104, 8, 104, 22, HL, 2.2), frame(62, 0, 58, 110)),
};
