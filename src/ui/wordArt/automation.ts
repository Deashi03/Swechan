/**
 * Teknik & digital värld → Elektronik & energi → Styrning & automation, 3961–3967 (0.57): sensors, control
 * loops, thermostats, programmable control systems, industrial robots, feedback and stability, smart homes.
 * Recurring signs: the part that the word names is outlined in orange (ring, frame or arrow) and grey parts show
 * what the word is not. Signals are blue dots or a blue square wave. Words that are easy to mix up get clearly
 * different scenes: ventil i rör (a red hand wheel on a pipe with flowing water) and ställdon (a dark motor box with a
 * gear and a signal cable, the valve under it grey); ingång (a wire from a sensor going INTO a box, green arrow)
 * and utgång (a wire going OUT of the box to a lit lamp, orange arrow); industrirobot (a big orange arm behind
 * its fence at a car body), kollaborativ robot (a small white arm handing a part to a person, no fence) and
 * skyddsstängsel (the mesh fence in front, the robot grey behind it); stabil (a flat line on a graph) and
 * självreglerande (a closed loop of arrows around a thermometer that stays in the middle, a hand crossed out).
 * Digits and the code signs { } = only; no unit letters, no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waBob, waGrow, waIn, waPulse, waShake, waSpin, waSway, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const BLUE = '#3f7fc8';
const WATER = '#8cc7e8';
const PIPE = '#9aa3ad';
const ROBOT = '#ef8a3c';
const NIGHT = '#2f3b5c';
const GRASS = '#7cc36e';
const SCREEN = '#dfe9d8';
const pts = (a: [number, number][]) => a;
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 5, col, 2.6);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const wall = (col = '#efe8dc') => rect(0, 0, 120, 112, col, 0, null);
const sig = (x: number, y: number, r = 2.6) => circle(x, y, r, BLUE, C.ink, 0.8);
const cross = (x: number, y: number, s = 6, col: string = C.red) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 3);
const bolt = (x: number, y: number, s = 1, col: string = C.yellow) => g(`translate(${x} ${y}) scale(${s})`, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', col, C.ink, 1.4));
const heat = (x: number, y: number, n = 3, col: string = C.red, gap = 8) => line(range(n).map((i) => `M${x + i * gap} ${y} c-3 -4 3 -6 0 -10 c-3 -4 3 -6 0 -10`).join(' '), col, 1.8);
const flake = (x: number, y: number, s = 1, col = '#5aa7d6') => g(`translate(${x} ${y}) scale(${s})`, line('M0 -8 L0 8 M-7 -4 L7 4 M-7 4 L7 -4 M-2 -6 L0 -4 L2 -6 M-2 6 L0 4 L2 6', col, 1.8));
const warn = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -12 L12 9 L-12 9 Z', C.yellow, C.ink, 1.6), line('M0 -5 L0 2', C.ink, 2.4), circle(0, 5.5, 1.3, C.ink, null));
const display = (x: number, y: number, w: number, h: number, txt: string, col: string = C.ink) => all(rect(x, y, w, h, SCREEN, 2, C.ink, 1.6), T(x + w / 2, y + h * 0.75, txt, h * 0.62, col));
const sun = (x: number, y: number, r = 7) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 3))} ${f1(y + Math.sin(a) * (r + 3))} L${f1(x + Math.cos(a) * (r + 7))} ${f1(y + Math.sin(a) * (r + 7))}`, C.gold, 2); }), circle(x, y, r, C.yellow, C.ink, 1.6));
const moon = (x: number, y: number, r = 8) => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${x + r * 0.9} ${y + r * 0.45} A${r * 0.75} ${r * 0.75} 0 1 1 ${x} ${y - r} Z`, '#f3e6a6', C.ink, 1.4);
/** Horizontal pipe from x1 to x2 at height y. */
const pipe = (x1: number, x2: number, y: number, h = 12, col: string = PIPE) => all(rect(x1, y - h / 2, x2 - x1, h, col, 2, C.ink, 1.6), line(`M${x1 + 2} ${y - h / 2 + 3} L${x2 - 2} ${y - h / 2 + 3}`, C.white, 1.2));
/** Thermometer: bulb at (x, y), tube up `h`; level 0–1. */
const thermo = (x: number, y: number, h: number, level: number, col: string = C.red) => all(rect(x - 4, y - h, 8, h, C.white, 4, C.ink, 1.6), rect(x - 2, f1(y - h * level), 4, f1(h * level), col, 2, null), circle(x, y + 2, 6, col, C.ink, 1.6));
/** Thermostat dial on a white plate; `deg` turns the pointer. */
const dial = (x: number, y: number, r = 16, deg = 0) => all(rect(x - r - 6, y - r - 6, 2 * r + 12, 2 * r + 12, C.white, 7, C.ink, 1.8), circle(x, y, r, '#eef1f4', C.ink, 1.8),
  ...range(7).map((i) => { const a = ((-210 + i * 40) * Math.PI) / 180; return line(`M${f1(x + Math.cos(a) * (r - 2))} ${f1(y + Math.sin(a) * (r - 2))} L${f1(x + Math.cos(a) * (r - 6))} ${f1(y + Math.sin(a) * (r - 6))}`, i < 3 ? BLUE : C.red, 1.6); }),
  g(`translate(${x} ${y}) rotate(${deg})`, circle(0, 0, r * 0.55, C.dark, C.ink, 1.4), line(`M0 0 L0 ${-r * 0.5}`, C.white, 2.4)));
/** Small sensor box with a probe going down. */
const sensorBox = (x: number, y: number, col: string = C.white) => all(rect(x - 9, y - 7, 18, 14, col, 3, C.ink, 1.6), circle(x + 4, y - 2, 1.6, C.green, null), rect(x - 2, y + 7, 4, 10, C.silver, 1, C.ink, 1.2));
/** Lamp hanging from the ceiling at (x, y = shade top). */
const lamp = (x: number, y: number, lit: boolean, col: string = C.white) => all(line(`M${x} 0 L${x} ${y}`, C.dark, 1.6), lit ? path(`M${x - 10} ${y + 10} L${x - 24} ${y + 44} L${x + 24} ${y + 44} L${x + 10} ${y + 10} Z`, 'rgba(242,193,78,0.3)', null) : '',
  path(`M${x - 4} ${y} L${x + 4} ${y} L${x + 12} ${y + 10} L${x - 12} ${y + 10} Z`, col, C.ink, 1.6), circle(x, y + 12, 3.5, lit ? C.yellow : C.grey2, C.ink, 1.2));
/** Palm seen from the side (no pointing finger), wrist at (x, y). */
const palm = (x: number, y: number, rot = 0, sleeve: string = C.navy) => g(`translate(${x} ${y}) rotate(${rot})`, path('M0 0 L14 -2 C20 -3 26 -2 30 0 C32 2 30 5 26 5 L20 5 C22 7 21 10 18 10 L4 10 C0 10 -2 6 0 0 Z', C.skin, C.ink, 1.4), rect(-12, -1, 14, 11, sleeve, 2, C.ink, 1.4));
/** Standing person, feet at (x, 112); arms from the shoulders to (lx, ly) and (rx, ry) relative to the neck. */
const person = (x: number, top: string, o: { s?: number; l?: [number, number]; r?: [number, number]; hat?: string; hair?: string; y?: number } = {}) => {
  const s = o.s ?? 1, [lx, ly] = o.l ?? [-12, 22], [rx, ry] = o.r ?? [12, 22];
  return g(`translate(${x} ${o.y ?? 112}) scale(${s})`, line('M-5 0 L-4 -26 M5 0 L4 -26', C.navy, 7), rect(-11, -56, 22, 32, top, 6, C.ink, 1.6),
    line(`M-9 -52 L${lx} ${-56 + ly}`, C.ink, 6.4), line(`M-9 -52 L${lx} ${-56 + ly}`, top, 4.4), circle(lx, -56 + ly, 3.2, C.skin, C.ink, 1.2),
    line(`M9 -52 L${rx} ${-56 + ry}`, C.ink, 6.4), line(`M9 -52 L${rx} ${-56 + ry}`, top, 4.4), circle(rx, -56 + ry, 3.2, C.skin, C.ink, 1.2),
    circle(0, -67, 10, C.skin, C.ink, 1.6), o.hat ? path('M-12 -70 C-12 -84 12 -84 12 -70 L14 -69 L-14 -69 Z', o.hat, C.ink, 1.6) : path('M-10 -68 C-10 -81 10 -81 10 -68 C6 -73 -6 -73 -10 -68 Z', o.hair ?? C.hair, null),
    circle(-3.5, -66, 1.2, C.ink, null), circle(3.5, -66, 1.2, C.ink, null), path('M-3 -61 C-1 -59 1 -59 3 -61', 'none', C.ink, 1.2));
};
/** Industrial robot arm: base at (x, 112), joint angles a1 (from vertical) and a2, length scale s. */
const robotArm = (x: number, a1: number, a2: number, s = 1, col: string = ROBOT, tool: Svg = '') => g(`translate(${x} 112) scale(${s})`,
  rect(-16, -10, 32, 10, C.dark, 2, C.ink, 1.6), rect(-10, -20, 20, 12, col, 3, C.ink, 1.6),
  g(`translate(0 -20) rotate(${a1})`, rect(-6, -46, 12, 48, col, 5, C.ink, 1.6), circle(0, 0, 6, C.dark, C.ink, 1.4),
    g(`translate(0 -44) rotate(${a2})`, rect(-5, -40, 10, 42, col, 5, C.ink, 1.6), circle(0, 0, 5, C.dark, C.ink, 1.4), g('translate(0 -40)', tool))));
const claw = (open = 6, col: string = C.dark) => all(rect(-7, -6, 14, 6, col, 2, C.ink, 1.2), line(`M-4 -6 L${-4 - open / 2} -14 L-3 -18 M4 -6 L${4 + open / 2} -14 L3 -18`, C.ink, 3.4), line(`M-4 -6 L${-4 - open / 2} -14 L-3 -18 M4 -6 L${4 + open / 2} -14 L3 -18`, C.silver, 1.8));
/** Car body seen from the side (no wheels = in production). */
const carBody = (x: number, y: number, s = 1, col: string = C.sky, wheels = false) => g(`translate(${x} ${y}) scale(${s})`, path('M-30 0 L-30 -10 L-18 -12 L-8 -24 L14 -24 L24 -12 L32 -10 L32 0 Z', col, C.ink, 1.6), path('M-6 -21 L4 -21 L4 -13 L-13 -13 Z M8 -21 L13 -21 L19 -13 L8 -13 Z', '#dff1fb', C.ink, 1.2),
  wheels ? all(circle(-18, 0, 6, C.dark, C.ink, 1.4), circle(20, 0, 6, C.dark, C.ink, 1.4)) : '');
/** Mesh fence panel. */
const mesh = (x: number, y: number, w: number, h: number, col: string = C.yellow) => all(rect(x, y, w, h, 'rgba(255,255,255,0.15)', 1, col, 3),
  line([...range(Math.floor(w / 8)).map((i) => `M${x + 8 + i * 8} ${y} L${x + 8 + i * 8} ${y + h}`), ...range(Math.floor(h / 8)).map((i) => `M${x} ${y + 8 + i * 8} L${x + w} ${y + 8 + i * 8}`)].join(' '), C.dark, 1));
const box = (x: number, y: number, w = 16, h = 12, col: string = C.tan) => all(rect(x - w / 2, y - h, w, h, col, 1, C.ink, 1.4), line(`M${x - w / 2} ${y - h + 4} L${x + w / 2} ${y - h + 4}`, '#a0673d', 1.1));
/** House outline (front), floor at y=112. */
const house = (x: number, w: number, roof: string = C.red, wallCol: string = '#f3e3c3') => all(rect(x, 60, w, 52, wallCol, 1, C.ink, 1.8), path(`M${x - 6} 62 L${x + w / 2} 30 L${x + w + 6} 62 Z`, roof, C.ink, 1.8));
/** Control box with terminals left and right. */
const ctrlBox = (x: number, y: number) => all(rect(x, y, 36, 40, C.white, 3, C.ink, 1.8), rect(x + 6, y + 6, 24, 10, SCREEN, 1, C.ink, 1.2),
  ...range(3).map((i) => all(rect(x - 5, y + 12 + i * 9, 6, 6, C.silver, 1, C.ink, 1.2), rect(x + 35, y + 12 + i * 9, 6, 6, C.silver, 1, C.ink, 1.2))));
const gear = (x: number, y: number, r: number, col: string = C.grey) => all(...range(8).map((i) => g(`translate(${x} ${y}) rotate(${i * 45})`, rect(-2.5, -r - 3, 5, 5, col, 1, C.ink, 1.2))), circle(x, y, r, col, C.ink, 1.6), circle(x, y, r * 0.35, C.white, C.ink, 1.2));
/** Sliding graph: axes in a frame. */
const axes = (x = 10, y = 14, w = 100, h = 84) => all(rect(x, y, w, h, C.white, 4, C.ink, 1.8), line(`M${x + 10} ${y + 8} L${x + 10} ${y + h - 10} L${x + w - 6} ${y + h - 10}`, C.ink, 1.8));

export const AUTOM_MOTIFS: Record<string, Svg> = {
  // ── 3961 Mätgivare ──
  'autom.mätgivare': all(wall(), pipe(4, 116, 84, 16), line('M60 52 C60 40 76 40 80 30', C.dark, 2), display(70, 10, 40, 22, '55'),
    rect(54, 52, 12, 14, C.white, 2, C.ink, 1.6), rect(56, 66, 8, 10, C.silver, 1, C.ink, 1.4), rect(57.5, 76, 5, 10, C.dark, 1, null), ring(60, 64, 16),
    ...[20, 36, 92, 106].map((x) => circle(x, 84, 2, WATER, null))),
  'autom.signal.2': all(wall('#eef3f7'), sensorBox(20, 76), rect(86, 54, 28, 22, C.dark, 2, C.ink, 1.6), rect(89, 57, 22, 16, '#bfe3f5', 1, null), rect(96, 76, 8, 6, C.grey, 1, C.ink, 1.2),
    line('M30 70 L36 70 L36 60 L46 60 L46 70 L54 70 L54 60 L64 60 L64 70 L72 70 L72 60 L80 60', BLUE, 3), arrow(80, 65, 86, 65, BLUE, 2.4), frame(30, 50, 54, 28),
    waIn('as1', -40, 0, sig(78, 60), sig(66, 60)), line('M8 112 L112 112', C.grey2, 2)),
  'autom.mätområde': all(rect(8, 50, 104, 20, C.white, 3, C.ink, 1.8), greyed(rect(10, 52, 22, 16, '#d9d9d9', 1, null), rect(88, 52, 22, 16, '#d9d9d9', 1, null)), rect(32, 52, 56, 16, C.mint, 0, null),
    ...range(11).map((i) => line(`M${12 + i * 9.6} 70 L${12 + i * 9.6} ${i % 5 === 0 ? 78 : 75}`, C.ink, 1.4)), line('M32 44 L32 84 M88 44 L88 84', HL, 2.6), line('M32 90 L88 90', HL, 2.6), arrow(50, 90, 34, 90, HL, 2.6), arrow(70, 90, 86, 90, HL, 2.6),
    path('M60 40 L54 30 L66 30 Z', C.green, C.ink, 1.4), line('M60 40 L60 52', C.green, 2.4), greyed(path('M104 40 L98 30 L110 30 Z', C.grey, C.ink, 1.4), T(104, 26, '?', 10)), T(32, 104, '-30', 10), T(88, 104, '50', 10)),
  'autom.logga': all(axes(), sensorBox(102, 24), line('M102 31 L102 36', C.dark, 1.6),
    ...pts([[30, 74], [42, 66], [54, 70], [66, 58], [78, 62], [90, 50]]).map(([x, y], i) => moving(`alog${i}`, `0%,${i * 12}%{opacity:0;transform:scale(.3)}${i * 12 + 10}%,100%{opacity:1;transform:scale(1)}`, { dur: 4, spin: true }, circle(x, y, 3.4, BLUE, C.ink, 1))),
    line('M30 74 L42 66 L54 70 L66 58 L78 62 L90 50', BLUE, 1.4, '3 3'), circle(30, 32, 10, C.white, C.ink, 1.6), line('M30 32 L30 25 M30 32 L35 34', C.ink, 1.8), frame(16, 40, 84, 46)),

  // ── 3962 Reglerkretsar ──
  'autom.reglerkrets': all(circle(60, 60, 38, 'none', HL, 3), arrow(96, 52, 94, 64, HL, 3), arrow(30, 88, 22, 78, HL, 3), arrow(40, 26, 52, 22, HL, 3),
    circle(60, 22, 14, C.white, C.ink, 1.8), thermo(60, 28, 14, 0.5), circle(94, 82, 14, C.white, C.ink, 1.8), circle(94, 82, 8, 'none', C.red, 2), circle(94, 82, 4, 'none', C.red, 2), circle(94, 82, 1.5, C.red, null),
    circle(26, 82, 14, C.white, C.ink, 1.8), pipe(14, 38, 84, 6), circle(26, 78, 5, C.red, C.ink, 1.4), line('M26 73 L26 69', C.ink, 2), circle(60, 60, 9, C.white, C.ink, 1.4), line('M55 57 L65 57 M55 63 L65 63', C.ink, 2)),
  'autom.styra.3': all(wall(), rect(10, 70, 36, 30, C.dark, 4, C.ink, 1.8), circle(28, 78, 4, C.red, C.ink, 1.2),
    waSway('asty', 14, line('M28 78 L28 56', C.ink, 4), circle(28, 54, 6, C.red, C.ink, 1.6)), palm(4, 50, 0, C.green), ring(28, 64, 18),
    line('M46 90 C60 90 64 70 76 70', C.dark, 2.4), sig(56, 88), sig(66, 78),
    circle(92, 60, 22, C.white, C.ink, 1.8), waSpin('astyf', 1.2, g('translate(92 60)', ...range(3).map((i) => g(`rotate(${i * 120})`, path('M0 0 C4 -6 10 -16 2 -19 C-4 -16 -3 -6 0 0 Z', C.sky, C.ink, 1.2))))), circle(92, 60, 3, C.dark, null), rect(88, 82, 8, 26, C.grey, 1, C.ink, 1.4), ground()),
  'autom.börvärde': all(wall('#f5f1ea'), rect(48, 12, 24, 86, C.white, 12, C.ink, 2), rect(55, 58, 10, 36, C.red, 4, null), circle(60, 98, 11, C.red, C.ink, 2),
    ...range(8).map((i) => line(`M72 ${22 + i * 9} L78 ${22 + i * 9}`, C.ink, 1.4)),
    line('M44 31 L80 31', HL, 2.6), path('M80 31 L80 14 L98 20 L80 26', HL, C.ink, 1.4), T(98, 40, '21', 11, HL),
    greyed(line('M40 58 L56 58', C.ink, 2), T(28, 62, '19', 10)), arrow(40, 54, 40, 36, HL, 2.4)),
  'autom.ventil.4': all(wall('#eef3f7'), pipe(4, 116, 74, 16), rect(48, 62, 24, 24, C.silver, 3, C.ink, 1.6), rect(57, 46, 6, 16, C.grey, 1, C.ink, 1.4),
    ellipse(60, 44, 20, 6, C.red, C.ink, 1.8), line('M42 44 L78 44 M60 39 L60 49', C.ink, 1.4), ring(60, 56, 26),
    waIn('aven', -24, 0, ...[84, 96, 108].map((x) => path(`M${x} 70 L${x + 6} 74 L${x} 78 Z`, BLUE, null))), greyed(...[10, 22, 34].map((x) => path(`M${x} 70 L${x + 6} 74 L${x} 78 Z`, BLUE, null)))),
  'autom.ställdon': all(wall('#eef3f7'), greyed(pipe(4, 116, 92, 14), rect(50, 82, 20, 20, C.silver, 3, C.ink, 1.6)), rect(54, 70, 12, 12, C.grey, 1, C.ink, 1.4),
    rect(38, 34, 44, 36, C.dark, 5, C.ink, 1.8), waSpin('astd', 2.4, gear(60, 52, 9, C.gold)), frame(34, 30, 52, 44), line('M82 44 C96 44 98 24 112 20', BLUE, 2.4), sig(94, 38), sig(104, 26), bolt(104, 52, 0.8), arrow(30, 52, 30, 82, HL, 2.6), arrow(30, 82, 30, 54, HL, 2.6)),
  'autom.flottör': all(rect(18, 24, 84, 84, C.white, 6, C.ink, 2.2), rect(20, 58, 80, 48, WATER, 2, null), line('M20 58 L100 58', BLUE, 2),
    rect(80, 22, 10, 64, C.grey, 2, C.ink, 1.4), rect(78, 30, 14, 10, C.dark, 2, C.ink, 1.2),
    waBob('aflo', 5, line('M80 36 L44 54', C.ink, 3), circle(40, 56, 12, C.red, C.ink, 1.8), path('M32 52 C36 48 44 48 48 52', 'none', C.white, 1.6), ring(40, 56, 17)), ground()),
  'autom.farthållare': all(path('M4 112 L116 84 L116 112 Z', '#d7d2c8', C.ink, 1.6), line('M10 109 L110 85', C.white, 2, '6 6'), g('translate(60 92) rotate(-14)', carBody(0, 0, 0.9, C.sky, true)),
    circle(60, 34, 26, C.white, C.ink, 2), path('M38 40 A22 22 0 0 1 82 40', 'none', C.grey2, 5), ...range(9).map((i) => { const a = ((-200 + i * 27.5) * Math.PI) / 180; return line(`M${f1(60 + Math.cos(a) * 22)} ${f1(34 + Math.sin(a) * 22)} L${f1(60 + Math.cos(a) * 17)} ${f1(34 + Math.sin(a) * 17)}`, C.ink, 1.4); }),
    line('M60 34 L72 18', C.red, 3), circle(60, 34, 3.4, C.dark, null), T(60, 52, '80', 9), ring(60, 34, 30), arrow(88, 60, 104, 54, HL, 2.6)),
  'autom.automatisk': all(wall('#eef0f2'), rect(14, 16, 92, 96, '#d4d8dc', 2, C.ink, 1.8), rect(56, 18, 8, 8, C.dark, 2, C.ink, 1.2), circle(60, 22, 2, C.red, null),
    rect(16, 30, 26, 82, '#cfe8f5', 1, C.ink, 1.6), rect(78, 30, 26, 82, '#cfe8f5', 1, C.ink, 1.6), arrow(50, 46, 32, 46, HL, 3), arrow(70, 46, 88, 46, HL, 3),
    g('translate(60 0)', person(0, C.green, { s: 0.62 })), line('M50 30 L46 112 M70 30 L74 112', C.grey2, 1, '2 3')),
  'autom.slå-till.2': all(wall(), rect(8, 14, 34, 30, '#cfe8f5', 2, C.ink, 1.6), flake(18, 26, 0.9), flake(32, 34, 0.8), thermo(24, 100, 32, 0.15, BLUE),
    rect(50, 34, 52, 76, C.white, 5, C.ink, 2), rect(60, 72, 32, 26, C.dark, 3, C.ink, 1.6),
    waPulse('aslt', path('M76 96 C66 90 70 80 74 76 C74 84 80 84 80 78 C86 84 86 92 76 96 Z', C.orange, C.ink, 1.2), circle(92, 44, 4, C.green, C.ink, 1.2), circle(76, 86, 14, 'rgba(242,193,78,0.35)', null)),
    rect(60, 42, 26, 12, SCREEN, 1, C.ink, 1.2), frame(46, 30, 60, 84), ground()),

  // ── 3963 Termostater ──
  'autom.ställa-in.2': all(wall(), dial(60, 58, 26, 0), moving('asti', '0%,100%{transform:rotate(-70deg)}55%,90%{transform:rotate(0)}', { dur: 3, spin: true }, circle(60, 58, 14.3, C.dark, C.ink, 1.4), line('M60 58 L60 45', C.white, 2.4)),
    palm(16, 52, 0, C.purple), path('M30 22 A40 40 0 0 1 90 22', 'none', HL, 2.6), arrow(84, 18, 92, 26, HL, 2.6), T(60, 108, '20', 12)),
  'autom.nattsänkning': all(rect(0, 0, 120, 112, NIGHT, 0, null), moon(22, 22, 9), circle(48, 14, 1.4, C.white, null), circle(36, 34, 1, C.white, null), house(30, 64, '#6b4a3a', '#d8c9a6'),
    rect(40, 70, 22, 18, '#3d4a6a', 1, C.ink, 1.4), rect(66, 72, 20, 40, '#8a6a4a', 1, C.ink, 1.4),
    rect(96, 20, 18, 84, C.white, 9, C.ink, 1.8), moving('anat', '0%,30%{transform:translateY(-16px)}70%,100%{transform:translateY(0)}', { dur: 4 }, rect(101, 60, 8, 40, C.red, 4, null)), rect(101, 76, 8, 28, C.red, 3, null), circle(105, 104, 6, C.red, C.ink, 1.6),
    T(106, 16, '18', 9, C.white), arrow(90, 44, 90, 64, HL, 2.6), ground()),
  'autom.utegivare': all(rect(0, 0, 60, 112, '#e6eef5', 0, null), rect(60, 0, 60, 112, '#f3e3c3', 0, null), line('M60 0 L60 112', C.ink, 2.2), flake(16, 24), flake(36, 46, 0.8), flake(14, 70, 0.9),
    rect(40, 50, 16, 20, C.white, 3, C.ink, 1.6), ...range(3).map((i) => line(`M43 ${56 + i * 4} L53 ${56 + i * 4}`, C.grey, 1.2)), ring(48, 60, 16),
    line('M56 60 L74 60 L74 84', C.dark, 2), sig(66, 60), rect(72, 84, 40, 22, C.white, 3, C.ink, 1.6), ...range(5).map((i) => line(`M${78 + i * 7} 86 L${78 + i * 7} 104`, C.grey2, 2)), thermo(26, 100, 24, 0.2, BLUE), ground()),
  'autom.frostskydd': all(wall('#e6eef5'), path('M4 40 L30 18 L56 40 Z', C.white, C.ink, 1.6), rect(10, 40, 40, 30, '#c9a27a', 1, C.ink, 1.6), path('M4 40 L56 40 L56 44 L4 44 Z', C.white, null), flake(70, 14, 0.8), flake(110, 20, 0.7),
    rect(56, 40, 56, 64, C.white, 8, C.ink, 2), rect(64, 48, 40, 30, SCREEN, 3, C.ink, 1.4), flake(76, 63, 1.1), T(94, 70, '8', 16), frame(52, 36, 64, 72), circle(72, 92, 4, C.dark, null), circle(96, 92, 4, C.dark, null),
    pipe(4, 50, 92, 10), path('M24 97 L24 104 L22 108', 'none', '#b8dcf0', 2.4), ground()),
  'autom.överhettning': all(wall(), rect(20, 54, 64, 44, '#d64545', 6, C.ink, 2), rect(26, 60, 52, 32, '#f08a6a', 3, null), ...range(5).map((i) => line(`M${30 + i * 10} 62 L${30 + i * 10} 90`, C.red, 2)),
    moving('aovh', '0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(-6px);opacity:.4}', { dur: 1.2 }, heat(32, 48, 5, C.red, 9)),
    thermo(100, 98, 70, 0.98), circle(100, 22, 9, 'rgba(214,69,69,0.3)', null), warn(52, 82, 1), ground(), rect(28, 98, 6, 10, C.dark, 1, null), rect(70, 98, 6, 10, C.dark, 1, null)),
  'autom.bimetall': all(wall('#f5f1ea'), rect(8, 40, 14, 40, C.dark, 2, C.ink, 1.6),
    moving('abim', '0%,25%{transform:rotate(14deg)}65%,100%{transform:rotate(0)}', { dur: 4 }, g('translate(22 60)', path('M0 -5 C30 -6 60 -16 84 -34 L88 -29 C64 -10 32 0 0 1 Z', C.silver, C.ink, 1.4), path('M0 1 C32 0 64 -10 88 -29 L91 -24 C66 -4 34 6 0 7 Z', '#c8743a', C.ink, 1.4))),
    rect(100, 52, 12, 8, C.gold, 1, C.ink, 1.4), line('M106 60 L106 84', C.dark, 2), greyed(line('M100 56 L106 56', C.ink, 2)), heat(40, 100, 4, C.red, 12), path('M36 104 L90 104', C.grey, C.ink, 2), arrow(96, 44, 96, 26, HL, 2.6)),

  // ── 3964 Programmerbara styrsystem ──
  'autom.styrsystem': all(wall('#eef0f2'), rect(44, 42, 32, 34, C.dark, 4, C.ink, 1.8), rect(48, 46, 24, 10, SCREEN, 1, C.ink, 1), ...range(4).map((i) => circle(51 + i * 6, 66, 2, i % 2 ? C.green : C.yellow, null)), frame(40, 38, 40, 42),
    line('M44 52 L26 30 M76 52 L94 30 M44 68 L26 92 M76 68 L94 92', BLUE, 2.2), sig(35, 41), sig(85, 41), sig(35, 80), sig(85, 80),
    circle(20, 22, 10, C.white, C.ink, 1.6), circle(20, 21, 4, C.yellow, C.ink, 1.2), circle(100, 22, 10, C.white, C.ink, 1.6), gear(100, 22, 5, C.grey),
    circle(20, 98, 10, C.white, C.ink, 1.6), path('M14 98 L26 98 M20 92 L20 104', 'none', BLUE, 2), circle(100, 98, 10, C.white, C.ink, 1.6), rect(95, 92, 10, 12, '#a0673d', 1, C.ink, 1.2)),
  'autom.programmerbar': all(wall('#eef3f7'), rect(6, 30, 52, 34, C.dark, 3, C.ink, 1.8), rect(10, 34, 44, 26, '#21304a', 1, null), T(20, 50, '{', 13, C.yellow), T(44, 50, '}', 13, C.yellow), line('M24 42 L40 42 M26 48 L38 48 M24 54 L36 54', C.mint, 2), path('M0 64 L64 64 L60 70 L4 70 Z', C.grey, C.ink, 1.6),
    line('M58 66 C70 66 70 80 78 80', C.dark, 2.4), rect(78, 66, 30, 30, C.white, 3, C.ink, 1.8), ...range(3).map((i) => circle(86 + i * 7, 74, 2, C.green, null)),
    path('M92 46 A12 12 0 1 1 80 34', 'none', HL, 2.6), arrow(80, 34, 86, 30, HL, 2.6), frame(74, 62, 38, 38), ground()),
  'autom.styrskåp': all(wall('#ebe7e0'), rect(30, 10, 54, 98, '#c4c9ce', 3, C.ink, 2), rect(36, 16, 42, 86, '#eceff2', 2, C.ink, 1.4),
    ...range(4).map((i) => all(rect(38, 22 + i * 20, 38, 4, C.silver, 1, C.ink, 1), ...range(5).map((j) => rect(40 + j * 7, 26 + i * 20, 6, 10, j === 2 && i === 1 ? C.dark : C.white, 1, C.ink, 1)))),
    line('M44 102 L44 108 M58 102 L58 108 M70 102 L70 108', C.red, 1.6), path('M84 12 L110 20 L110 104 L84 108 Z', '#b0b6bc', C.ink, 2), warn(97, 50, 0.9), bolt(97, 52, 0.4, C.ink), circle(88, 62, 2, C.dark, null), ground()),
  'autom.ingång.2': all(wall('#eef0f2'), ctrlBox(64, 40), sensorBox(16, 30), line('M16 47 L16 61 L58 61', C.dark, 2.4), sig(30, 61), sig(44, 61),
    arrow(40, 76, 60, 64, C.green, 3), ring(61, 61, 9), greyed(rect(103, 54, 14, 4, C.grey, 1, null))),
  'autom.utgång.2': all(wall('#eef0f2'), ctrlBox(10, 40), line('M51 61 L92 61 L92 44', C.dark, 2.4), sig(66, 61), sig(80, 61), lamp(92, 24, true),
    arrow(64, 76, 84, 66, HL, 3), ring(49, 61, 9), greyed(rect(2, 54, 6, 4, C.grey, 1, null))),
  'autom.pump.2': all(wall('#eef3f7'), pipe(4, 40, 80, 14), pipe(80, 116, 52, 14), rect(84, 52, 12, 30, PIPE, 2, C.ink, 1.6),
    circle(58, 78, 22, C.navy, C.ink, 2), circle(58, 78, 9, C.silver, C.ink, 1.4), waSpin('apum', 1.2, g('translate(58 78)', ...range(4).map((i) => g(`rotate(${i * 90})`, line('M0 0 L0 -8', C.ink, 2))))),
    rect(40, 36, 36, 20, C.green, 4, C.ink, 1.8), ...range(4).map((i) => line(`M${46 + i * 7} 38 L${46 + i * 7} 54`, '#3c7a52', 1.4)), rect(54, 56, 8, 4, C.dark, 1, null),
    waIn('apuw', -20, 0, path('M14 76 L22 80 L14 84 Z', BLUE, null)), waIn('apuw2', 0, 18, path('M86 40 L90 30 L94 40 Z', BLUE, null)), ground()),
  'autom.operatör.2': all(wall('#e9edf2'), rect(6, 18, 34, 24, C.dark, 2, C.ink, 1.6), rect(9, 21, 28, 18, '#bfe3f5', 1, null), line('M12 34 L18 28 L24 32 L32 24', C.green, 1.6),
    rect(44, 12, 34, 26, C.dark, 2, C.ink, 1.6), rect(47, 15, 28, 20, '#bfe3f5', 1, null), rect(52, 20, 8, 10, C.red, 1, null), rect(64, 24, 8, 6, C.green, 1, null),
    rect(82, 18, 34, 24, C.dark, 2, C.ink, 1.6), rect(85, 21, 28, 18, '#bfe3f5', 1, null), circle(99, 30, 5, C.yellow, C.ink, 1),
    person(60, C.navy, { s: 0.8, y: 108, l: [-18, 26], r: [18, 26] }), rect(4, 76, 112, 6, C.tan, 2, C.ink, 1.6), line('M14 82 L14 112 M106 82 L106 112', C.brown, 3), rect(46, 70, 28, 6, C.grey2, 1, C.ink, 1.2), ground()),
  'autom.tidsstyrd': all(wall('#f2efe8'), circle(34, 52, 26, C.white, C.ink, 2.2), ...range(12).map((i) => { const a = (i * 30 * Math.PI) / 180; return line(`M${f1(34 + Math.sin(a) * 22)} ${f1(52 - Math.cos(a) * 22)} L${f1(34 + Math.sin(a) * 19)} ${f1(52 - Math.cos(a) * 19)}`, C.ink, 1.6); }),
    line('M34 52 L34 34 M34 52 L34 64', C.ink, 2.6), circle(34, 52, 2.4, C.ink, null), ring(34, 52, 30), line('M64 52 L80 52', HL, 2.6, '4 4'), arrow(76, 52, 82, 52, HL, 2.6),
    lamp(98, 30, true), T(34, 104, '6', 12)),
  'autom.driftstopp': all(wall('#ebe7e0'), rect(4, 78, 112, 10, C.dark, 3, C.ink, 1.6), ...range(6).map((i) => circle(14 + i * 18, 83, 3, C.grey, C.ink, 1)), box(30, 78), box(62, 78), box(94, 78),
    waShake('adri', gear(40, 40, 14, C.grey)), gear(66, 46, 9, C.grey), cross(40, 40, 10), circle(96, 30, 14, C.red, C.ink, 2), rect(90, 23, 4, 14, C.white, 1, null), rect(98, 23, 4, 14, C.white, 1, null),
    waPulse('adril', circle(96, 30, 19, 'none', C.red, 2)), line('M4 100 L116 100', C.grey2, 1), ground()),

  // ── 3965 Industrirobotar ──
  'autom.industrirobot': all(wall('#e9e6df'), carBody(86, 96, 1, C.sky), rect(54, 96, 64, 8, C.dark, 1, C.ink, 1.4), robotArm(28, 30, 80, 0.9, ROBOT, claw(4)), ground()),
  'autom.gripdon': all(wall('#eef0f2'), rect(46, 0, 28, 30, ROBOT, 4, C.ink, 1.8), rect(40, 30, 40, 14, C.dark, 3, C.ink, 1.8),
    path('M46 44 L40 76 L50 92 L56 90 L50 76 L54 44 Z', C.silver, C.ink, 1.8), path('M74 44 L80 76 L70 92 L64 90 L70 76 L66 44 Z', C.silver, C.ink, 1.8),
    ellipse(60, 92, 9, 12, '#fbf3e4', C.ink, 1.6), ring(60, 66, 30), rect(30, 108, 60, 4, C.tan, 1, C.ink, 1.2)),
  'autom.lyfta': all(wall(), person(60, C.green, { l: [-17, 14], r: [17, 14], y: 112 }), waBob('alyf', 10, box(60, 82, 34, 24)), arrow(96, 80, 96, 44, HL, 3), arrow(24, 80, 24, 44, HL, 3), ground()),
  'autom.svetsa': all(wall('#3d3f4a'), rect(10, 70, 50, 14, '#9aa3ad', 1, C.ink, 1.6), rect(60, 70, 50, 14, '#b9c2cc', 1, C.ink, 1.6), line('M40 77 L60 77', '#ffcf6b', 3),
    g('translate(60 70) rotate(-35)', rect(-4, -50, 8, 40, C.dark, 2, C.ink, 1.4), rect(-6, -60, 12, 12, ROBOT, 2, C.ink, 1.4), rect(-2, -10, 4, 8, C.silver, 1, C.ink, 1)),
    waPulse('asve', circle(62, 72, 12, 'rgba(255,240,170,0.8)', null), ...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(62 + Math.cos(a) * 6)} ${f1(72 + Math.sin(a) * 6)} L${f1(62 + Math.cos(a) * 16)} ${f1(72 + Math.sin(a) * 16)}`, C.yellow, 2); })),
    ...pts([[78, 96], [86, 90], [48, 94]]).map(([x, y]) => circle(x, y, 1.6, C.yellow, null)), ground(112)),
  'autom.löpande-band': all(wall('#ebe7e0'), rect(4, 72, 112, 14, C.dark, 7, C.ink, 1.8), ...range(7).map((i) => circle(12 + i * 16, 79, 4, C.grey, C.ink, 1.2)), line('M14 90 L14 112 M106 90 L106 112', C.grey, 4),
    moving('alob', '0%{transform:translateX(-24px)}100%{transform:translateX(0)}', { dur: 2.2 }, box(28, 72, 20, 16), box(60, 72, 20, 16), box(92, 72, 20, 16)), arrow(40, 52, 80, 52, HL, 3), ground()),
  'autom.precision': all(greyed(circle(28, 44, 20, C.white, C.ink, 1.6), circle(28, 44, 12, 'none', C.ink, 1.4), circle(28, 44, 4, C.ink, null), ...pts([[16, 34], [38, 52], [22, 58], [40, 30], [10, 48]]).map(([x, y]) => circle(x, y, 2.4, C.dark, null))),
    circle(80, 60, 32, C.white, C.ink, 2), circle(80, 60, 22, 'none', C.red, 2), circle(80, 60, 12, 'none', C.red, 2), circle(80, 60, 4, C.red, null),
    ...pts([[80, 60], [81, 61], [79, 59]]).map(([x, y]) => circle(x, y, 2, C.ink, null)), ring(80, 60, 8), arrow(80, 14, 80, 50, HL, 3)),
  'autom.skyddsstängsel': all(wall('#e9e6df'), greyed(robotArm(60, -20, 60, 0.8, C.grey, claw(4))), mesh(4, 36, 50, 74), mesh(66, 36, 50, 74), rect(54, 36, 12, 74, 'rgba(255,255,255,0.1)', 0, null),
    line('M54 40 L54 108 M66 40 L66 108', C.yellow, 3), warn(29, 60, 1), frame(2, 32, 116, 80), ground()),
  'autom.kollaborativ-robot': all(wall('#eef0f2'), rect(4, 80, 70, 8, C.tan, 2, C.ink, 1.6), line('M10 88 L10 112 M68 88 L68 112', C.brown, 3),
    g('translate(0 -32)', robotArm(30, 50, 50, 0.55, C.white, claw(4, C.grey))), rect(58, 54, 12, 8, C.gold, 1, C.ink, 1.2),
    person(92, C.purple, { l: [-24, 4], r: [-4, 30] }), ground()),
  'autom.automationstekniker': all(wall('#ebe7e0'), rect(74, 14, 40, 94, '#c4c9ce', 3, C.ink, 1.8), rect(78, 20, 32, 80, '#eceff2', 2, C.ink, 1.2), ...range(3).map((i) => rect(80, 26 + i * 22, 28, 6, C.silver, 1, C.ink, 1)),
    line('M84 32 L84 46 M92 32 L92 52 M100 54 L100 70', C.red, 1.6), person(40, C.orange, { hat: C.yellow, l: [-10, 34], r: [26, 12] }), rect(20, 58, 22, 14, C.dark, 2, C.ink, 1.4), rect(22, 60, 18, 10, '#bfe3f5', 1, null), line('M42 66 C56 66 62 40 80 36', C.dark, 1.6), ground()),

  // ── 3966 Återkoppling och stabilitet ──
  'autom.stabil.3': all(axes(), line('M20 50 L104 50', C.grey, 1.4, '4 4'), greyed(line('M20 70 L30 30 L40 80 L50 24 L60 82 L70 28 L80 78 L90 34 L100 72', C.ink, 1.8)),
    line('M20 76 C30 76 32 46 42 52 C50 56 56 50 104 50', HL, 3.2), frame(54, 40, 54, 20)),
  'autom.pendla.2': all(rect(0, 0, 60, 112, '#e3f0fb', 0, null), rect(60, 0, 60, 112, '#fde7dc', 0, null), flake(16, 96, 1.2), heat(96, 104, 3, C.red, 7), line('M30 10 L90 10', C.ink, 3),
    waSway('apen', 30, g('translate(60 10)', line('M0 0 L0 66', C.ink, 2.4), circle(0, 74, 10, HL, C.ink, 1.8))), greyed(path('M20 72 A44 44 0 0 0 100 72', 'none', C.ink, 1.6)), arrow(26, 84, 18, 76, HL, 2.6), arrow(94, 84, 102, 76, HL, 2.6)),
  'autom.självreglerande': all(wall('#f5f1ea'), circle(60, 58, 36, 'none', HL, 3), arrow(92, 46, 90, 60, HL, 3), arrow(28, 70, 30, 56, HL, 3), thermo(60, 80, 46, 0.5), line('M48 57 L72 57', C.green, 2.4),
    sun(16, 16, 6), flake(104, 16, 1.1), greyed(palm(84, 92, -10)), cross(100, 96, 8)),
  'autom.snöbollseffekt': all(rect(0, 0, 120, 112, '#e6eef5', 0, null), path('M0 30 L120 104 L120 112 L0 112 Z', C.white, C.ink, 1.8), circle(14, 32, 4, C.white, C.ink, 1.4), circle(40, 42, 8, C.white, C.ink, 1.6),
    waGrow('asnb', circle(86, 64, 18, C.white, C.ink, 2), path('M76 58 C80 54 88 54 92 58', 'none', C.grey2, 1.6)), arrow(30, 30, 60, 48, HL, 2.6), arrow(64, 40, 100, 58, HL, 2.6)),

  // ── 3967 Smarta hem ──
  'autom.röststyrning': all(wall(), lamp(96, 20, true), g('translate(-14 0)', person(40, C.green, { l: [-12, 22], r: [12, 22] })), path('M34 22 L58 22 L58 38 L40 38 L34 44 Z', C.white, C.ink, 1.6),
    line('M42 26 C44 28 44 32 42 34 M47 25 C50 28 50 32 47 35 M52 24 C56 28 56 32 52 36', BLUE, 1.6), rect(66, 80, 18, 28, C.dark, 7, C.ink, 1.8), circle(75, 84, 2, C.sky, null),
    waPulse('arost', ring(75, 94, 14), line('M86 76 C90 66 92 58 94 52', BLUE, 1.6, '3 3')), ground()),
  'autom.robotgräsklippare': all(rect(0, 0, 120, 60, '#cfe8f5', 0, null), rect(0, 60, 120, 52, GRASS, 0, null), ...range(4).map((i) => rect(0, 66 + i * 12, 60, 6, '#9fd68f', 0, null)),
    ...range(10).map((i) => line(`M${66 + i * 5} 76 l-1 -6 M${68 + i * 5} 90 l1 -6`, '#3d8b35', 1.4)),
    moving('agra', '0%{transform:translateX(-14px)}100%{transform:translateX(0)}', { dur: 3 }, path('M38 92 L44 76 L72 76 L80 92 Z', C.white, C.ink, 1.8), rect(48, 72, 16, 6, C.dark, 2, C.ink, 1.2), circle(46, 94, 5, C.dark, C.ink, 1.2), circle(74, 94, 5, C.dark, C.ink, 1.2)),
    path('M92 66 L104 54 L116 66 L116 84 L92 84 Z', C.grey, C.ink, 1.6), sun(20, 18)),
  'autom.hemlarm': all(house(10, 100, C.red), rect(22, 72, 24, 20, '#cfe8f5', 1, C.ink, 1.4), rect(70, 76, 22, 36, '#8a6a4a', 1, C.ink, 1.6),
    rect(94, 64, 16, 14, C.white, 3, C.ink, 1.6), waPulse('ahla', circle(102, 71, 4.5, C.red, C.ink, 1), line('M92 66 L86 62 M92 71 L84 71 M92 76 L86 80', C.red, 2)), ring(102, 71, 13),
    rect(56, 84, 10, 14, C.white, 2, C.ink, 1.2), ...range(4).map((i) => circle(59 + (i % 2) * 4, 88 + Math.floor(i / 2) * 5, 1.2, C.ink, null)), ground()),
  'autom.bekvämlighet': all(wall(), path('M18 112 L18 70 C18 62 26 60 30 66 L32 82 L76 82 L78 66 C82 60 90 62 90 70 L90 112 Z', C.purple, C.ink, 1.8),
    rect(30, 76, 48, 14, '#a58ad6', 4, C.ink, 1.4), circle(54, 54, 10, C.skin, C.ink, 1.6), path('M44 52 C44 40 64 40 64 52 C60 47 48 47 44 52 Z', C.hair, null), path('M50 57 C52 60 56 60 58 57', 'none', C.ink, 1.4),
    line('M50 52 l3 0 M55 52 l3 0', C.ink, 1.4), rect(44, 64, 20, 18, C.green, 5, C.ink, 1.4), line('M60 88 L104 92', C.navy, 7), rect(100, 86, 12, 8, C.black, 3, null),
    lamp(100, 10, true), circle(26, 104, 8, C.dark, C.ink, 1.4), ground()),
};
