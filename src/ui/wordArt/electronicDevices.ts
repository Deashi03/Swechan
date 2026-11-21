/**
 * Teknik & digital värld → Elektronik & energi → Elektroniska apparater, 3921–3927 (0.57): batteries and
 * chargers, switches and sensors, circuit boards, screens and indicators, speakers and microphones, remote
 * controls and troubleshooting an appliance.
 * Recurring signs: the part that the word names is outlined in orange (ring or frame) and grey parts show
 * what the word is not. Contrast pairs share one layout where only the marked part differs:
 * urladdad/fulladdad (one big battery icon, empty or full), lödkolv/lödtenn (one soldering bench: the iron
 * or the solder spool) and tänd/släckt (one lamp, lit or dark, with the other state small and grey).
 * Digits, maths signs and the power symbol only; no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, sparkle, waGrow, waIn, waPulse, waShake, type Svg } from './kit';
import { HL } from './people';
import { greyed } from './blindFix';
import { figure } from './figures';

// ── Palette and basics ───────────────────────────────────────────────
const SCR = '#bfe3f5';
const PCB = '#3c8a55';
const TRACE = '#7fc49a';
const COPPER = '#d9a35f';
const NIGHT = '#26303d';
const GLOW = '#fff3b0';
const ALU = '#cfd5db';
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (x: number, y: number, deg: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${deg}) scale(${s})`, ...k);
const bench = (y = 84, x1 = 4, x2 = 116) => all(rect(x1, y, x2 - x1, 6, C.tan, 2, C.ink, 1.8), line(`M${x1 + 8} ${y + 6} L${x1 + 8} 112 M${x2 - 8} ${y + 6} L${x2 - 8} 112`, C.brown, 3));
const rays = (x: number, y: number, r1: number, r2: number, n = 8, col: string = C.gold, from = 0, to = 360) => line(range(n).map((i) => {
  const a = ((from + ((to - from) * i) / (n - (to - from === 360 ? 0 : 1))) * Math.PI) / 180;
  return `M${(x + Math.cos(a) * r1).toFixed(1)} ${(y + Math.sin(a) * r1).toFixed(1)} L${(x + Math.cos(a) * r2).toFixed(1)} ${(y + Math.sin(a) * r2).toFixed(1)}`;
}).join(' '), col, 2.2);
/** Arcs (signal, detection) opening towards angle `dir` (degrees). */
const arcs = (x: number, y: number, dir: number, n = 3, col: string = HL, gap = 7, spread = 40) => all(...range(n).map((i) => {
  const r = 6 + i * gap, a1 = ((dir - spread) * Math.PI) / 180, a2 = ((dir + spread) * Math.PI) / 180;
  return path(`M${(x + Math.cos(a1) * r).toFixed(1)} ${(y + Math.sin(a1) * r).toFixed(1)} A${r} ${r} 0 0 1 ${(x + Math.cos(a2) * r).toFixed(1)} ${(y + Math.sin(a2) * r).toFixed(1)}`, 'none', col, 2.2);
}));
const bolt = (x: number, y: number, s = 1, col: string = C.yellow) => at(x, y, s, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', col, C.ink, 1.4));
const cross = (x: number, y: number, r: number, col: string = C.red) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 3.4);

// ── Things ───────────────────────────────────────────────────────────
/** Cylinder battery (AA), centre (x, y), standing; + at the top. */
const aa = (x: number, y: number, s = 1, body: string = C.black, band: string = C.gold, deg = 0) => rot(x, y, deg, s,
  rect(-3.5, -26, 7, 5, C.silver, 1, C.ink, 1.2), rect(-9, -22, 18, 44, body, 3, C.ink, 1.6), rect(-9, -22, 18, 13, band, 2, C.ink, 1.2),
  line('M-3.5 -15.5 L3.5 -15.5 M0 -19 L0 -12', C.ink, 1.8), line('M-3.5 15 L3.5 15', C.white, 1.8));
/** Battery icon lying down, top-left (x, y); level 0–1. */
const batIcon = (x: number, y: number, w: number, h: number, level: number, col: string = C.green, outline: string = C.ink) => all(
  rect(x, y, w, h, C.white, h * 0.18, outline, 2.6), rect(x + w, y + h * 0.3, w * 0.07, h * 0.4, outline, 1.5, null),
  level > 0 ? rect(x + 4, y + 4, Math.max(3, (w - 8) * level), h - 8, col, h * 0.1, null) : '');
/** Phone, centre (x, y); `scr` in local coordinates (x −8.5…8.5, y −15…13). */
const phone = (x: number, y: number, s = 1, scr: Svg = '', bg: string = SCR) => at(x, y, s, rect(-10, -18, 20, 36, C.dark, 3.4, C.ink, 1.4), rect(-8.5, -15, 17, 28, bg, 1, null), scr, circle(0, 15.5, 1.2, C.grey, null));
/** Wall plug charger with a cable going right to (x2, y2). */
const charger = (x: number, y: number, x2: number, y2: number, col: string = C.white) => all(
  path(`M${x + 8} ${y + 4} C${x + 30} ${y + 10} ${x2 - 20} ${y2 + 10} ${x2} ${y2}`, 'none', C.ink, 2.4),
  rect(x - 8, y - 8, 16, 16, col, 3, C.ink, 1.6), line(`M${x - 3} ${y - 12} L${x - 3} ${y - 8} M${x + 3} ${y - 12} L${x + 3} ${y - 8}`, C.silver, 2.2));
/** Remote control, centre (x, y), standing; local y −30…30. */
const remote = (x: number, y: number, s = 1, deg = 0, extra: Svg = '', body: string = C.dark) => rot(x, y, deg, s,
  rect(-9, -30, 18, 60, body, 7, C.ink, 1.6), circle(0, -23, 2.6, C.red, null),
  ...range(9).map((i) => circle(-5 + (i % 3) * 5, -13 + Math.floor(i / 3) * 5, 1.6, C.grey2, null)),
  rect(-6, 4, 12, 9, C.grey, 2.5, null), circle(0, 21, 3.2, C.grey, null), extra);
/** Flat-screen TV, screen top-left (x, y); stand below. */
const tv = (x: number, y: number, w: number, h: number, scr: Svg = '', bg: string = SCR) => all(
  rect(x + w / 2 - 3, y + h, 6, 6, C.grey, 1, C.ink, 1.2), rect(x + w / 2 - 14, y + h + 5, 28, 3, C.grey, 1, C.ink, 1.2),
  rect(x, y, w, h, C.dark, 3, C.ink, 1.8), rect(x + 3, y + 3, w - 6, h - 6, bg, 1, null), scr);
/** Speaker cabinet, top-left (x, y). */
const speaker = (x: number, y: number, w: number, h: number, body: string = C.dark) => all(
  rect(x, y, w, h, body, 3, C.ink, 1.8), circle(x + w / 2, y + h * 0.28, w * 0.2, '#4a4d58', C.ink, 1.2), circle(x + w / 2, y + h * 0.28, w * 0.07, C.grey, null),
  circle(x + w / 2, y + h * 0.68, w * 0.32, '#4a4d58', C.ink, 1.4), circle(x + w / 2, y + h * 0.68, w * 0.12, C.grey, C.ink, 0.8));
/** Hand-held microphone, head at (x, y), handle down-right by `deg`. */
const mic = (x: number, y: number, s = 1, deg = 20) => rot(x, y, deg, s,
  path('M-4 6 L4 6 L2.6 34 L-2.6 34 Z', C.dark, C.ink, 1.4), circle(0, 0, 8, C.silver, C.ink, 1.6),
  line('M-6 -3 L6 -3 M-7 1 L7 1 M-6 5 L6 5 M-3 -7 L-3 7 M1 -8 L1 8 M5 -6 L5 6', C.grey, 0.8));
/** Green circuit board with chips and traces, top-left (x, y). */
const pcb = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, PCB, 3, C.ink, 1.8),
  line(`M${x + 6} ${y + h * 0.3} L${x + w * 0.35} ${y + h * 0.3} L${x + w * 0.45} ${y + h * 0.18} M${x + 6} ${y + h * 0.78} L${x + w * 0.3} ${y + h * 0.78} L${x + w * 0.4} ${y + h * 0.9} M${x + w - 6} ${y + h * 0.55} L${x + w * 0.72} ${y + h * 0.55} L${x + w * 0.64} ${y + h * 0.68}`, TRACE, 1.3));
/** Chip with pins, centre (x, y), size `sz`. */
const chip = (x: number, y: number, sz: number, body: string = C.black, pins = 5) => all(
  line(range(pins).map((i) => { const d = -sz / 2 + (sz * (i + 0.5)) / pins; return `M${(x + d).toFixed(1)} ${(y - sz / 2 - 3).toFixed(1)} L${(x + d).toFixed(1)} ${(y - sz / 2).toFixed(1)} M${(x + d).toFixed(1)} ${(y + sz / 2).toFixed(1)} L${(x + d).toFixed(1)} ${(y + sz / 2 + 3).toFixed(1)} M${(x - sz / 2 - 3).toFixed(1)} ${(y + d).toFixed(1)} L${(x - sz / 2).toFixed(1)} ${(y + d).toFixed(1)} M${(x + sz / 2).toFixed(1)} ${(y + d).toFixed(1)} L${(x + sz / 2 + 3).toFixed(1)} ${(y + d).toFixed(1)}`; }).join(' '), C.silver, 1.6),
  rect(x - sz / 2, y - sz / 2, sz, sz, body, 1.5, C.ink, 1.2), circle(x - sz / 2 + 3, y - sz / 2 + 3, 1, C.grey, null));
/** Resistor, horizontal, centre (x, y). */
const resistor = (x: number, y: number) => all(line(`M${x - 9} ${y} L${x + 9} ${y}`, C.silver, 1.6), rect(x - 5, y - 2.5, 10, 5, '#e8d2a8', 2.5, C.ink, 1), line(`M${x - 2} ${y - 2.5} L${x - 2} ${y + 2.5} M${x + 1} ${y - 2.5} L${x + 1} ${y + 2.5}`, C.red, 1.2));
/** Soldering iron: tip at (x, y), handle up-right. */
const iron = (x: number, y: number, s = 1, deg = -40) => rot(x, y, deg, s, path('M0 0 L-2 -10 L2 -10 Z', C.silver, C.ink, 1), rect(-2.6, -26, 5.2, 16, C.silver, 1, C.ink, 1.2),
  rect(-5, -58, 10, 32, C.red, 4, C.ink, 1.4), line('M-3 -50 L3 -50 M-3 -46 L3 -46 M-3 -42 L3 -42', C.ink, 0.9), path('M0 -58 C0 -66 8 -70 14 -72', 'none', C.ink, 2));
/** Solder spool with a wire end reaching to (wx, wy). */
const spool = (x: number, y: number, wx: number, wy: number, s = 1) => all(path(`M${x + 8 * s} ${y} C${x + 20 * s} ${y - 6} ${wx + 10} ${wy - 10} ${wx} ${wy}`, 'none', '#b8bec4', 2.4),
  circle(x, y, 13 * s, C.silver, C.ink, 1.6), circle(x, y, 9 * s, '#aeb4ba', C.ink, 1), circle(x, y, 3.5 * s, C.dark, C.ink, 1));
/** A thumb pressing down; the tip is at (x, y). */
const thumbDown = (x: number, y: number, s = 1, sleeve: string = C.sky) => at(x, y, s, rect(-9, -40, 18, 10, sleeve, 2, C.ink, 1.2), rect(-11, -32, 22, 18, C.skin, 6, C.ink, 1.3),
  line('M-6 -26 L-6 -20 M0 -27 L0 -20 M6 -26 L6 -20', C.ink, 0.8), path('M-4 -16 L-5 -3 C-5 1 5 1 5 -3 L4 -16 Z', C.skin, C.ink, 1.3), path('M-2.6 -2.5 C-2.6 -0.5 2.6 -0.5 2.6 -2.5', 'none', C.ink, 0.6));
/** Power symbol (circle broken at the top with a bar). */
const power = (x: number, y: number, r: number, col: string = C.ink, sw = 2.4) => all(path(`M${(x - r * 0.62).toFixed(1)} ${(y - r * 0.78).toFixed(1)} A${r} ${r} 0 1 0 ${(x + r * 0.62).toFixed(1)} ${(y - r * 0.78).toFixed(1)}`, 'none', col, sw), line(`M${x} ${y - r - 1} L${x} ${y - r * 0.15}`, col, sw));
/** Table lamp, base centre (x, y); lit adds the yellow shade and light rays. */
const lamp = (x: number, y: number, s: number, lit: boolean) => at(x, y, s,
  lit ? path('M-30 -46 L30 -46 L46 2 L-46 2 Z', 'rgba(255,228,120,0.35)', null) : '',
  rect(-14, -3, 28, 5, C.dark, 2, C.ink, 1.4), line('M0 -3 L0 -34', C.dark, 3),
  circle(0, -40, 7, lit ? C.yellow : '#8a8f99', C.ink, 1.4), path('M-16 -46 L16 -46 L22 -66 L-22 -66 Z', lit ? '#f6d77a' : '#7b808a', C.ink, 1.8),
  lit ? rays(0, -40, 26, 34, 5, C.gold, 20, 160) : '');
/** Kettle, base centre (x, y). */
const kettle = (x: number, y: number, s = 1, body: string = C.white) => at(x, y, s, rect(-24, -4, 48, 6, C.dark, 2, C.ink, 1.4),
  path('M-16 -4 L-18 -40 C-18 -48 14 -48 14 -40 L16 -4 Z', body, C.ink, 1.8), path('M-18 -36 L-28 -42 L-26 -34 L-17 -28', body, C.ink, 1.6),
  path('M14 -38 C26 -38 28 -12 15 -10', 'none', C.ink, 4), path('M14 -38 C26 -38 28 -12 15 -10', 'none', C.dark, 2.4), rect(-12, -30, 4, 16, '#9fd3ee', 1.5, C.ink, 0.8));
/** Coffee maker, base centre (x, y); `lampCol` is the colour of the small lamp by the switch. */
const coffeeMaker = (x: number, y: number, s = 1, lampCol: string = C.green) => at(x, y, s, rect(-22, -50, 44, 12, C.dark, 3, C.ink, 1.6),
  rect(14, -38, 8, 38, C.dark, 1, C.ink, 1.4), rect(-22, -4, 44, 6, C.dark, 2, C.ink, 1.4), path('M-16 -30 L8 -30 L6 -6 C6 -2 -14 -2 -14 -6 Z', 'rgba(191,227,245,0.6)', C.ink, 1.4),
  path('M-15 -16 L7 -16 L6 -6 C6 -2 -14 -2 -14 -6 Z', '#6b4a32', null), rect(15, -30, 6, 4, C.grey, 1, null), circle(18, -20, 2.4, lampCol, C.ink, 0.8));
/** Head and shoulders seen from the front, centre of the head (x, y). */
const bust = (x: number, y: number, s: number, top: string, long = false) => at(x, y, s,
  path('M-26 50 C-26 26 -16 20 0 20 C16 20 26 26 26 50 Z', top, C.ink, 2), rect(-5, 12, 10, 10, C.skin, 2, C.ink, 1.4),
  long ? path('M-15 2 C-18 18 -10 20 0 18 C10 20 18 18 15 2 Z', C.hair, C.ink, 1.4) : '',
  circle(0, 0, 14, C.skin, C.ink, 2), path('M-14 -2 C-14 -20 14 -20 14 -2 C9 -9 -9 -9 -14 -2 Z', C.hair, C.ink, 1.8),
  circle(-5, 0, 1.4, C.ink, null), circle(5, 0, 1.4, C.ink, null), line('M-4 7 Q0 9.5 4 7', C.ink, 1.4));
/** Amplifier box with knobs, top-left (x, y). */
const amp = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, C.dark, 3, C.ink, 1.8), rect(x + 3, y + 3, w - 6, h * 0.35, '#4a4d58', 2, null),
  ...range(4).map((i) => all(circle(x + w * (0.18 + i * 0.21), y + h * 0.7, h * 0.13, C.silver, C.ink, 1), line(`M${x + w * (0.18 + i * 0.21)} ${y + h * 0.7} L${x + w * (0.18 + i * 0.21) + 2} ${y + h * 0.7 - h * 0.1}`, C.ink, 1.2))),
  circle(x + w - 6, y + h * 0.24, 1.8, C.red, null));
/** Snow flake. */
const flake = (x: number, y: number, s = 1) => at(x, y, s, line('M0 -6 L0 6 M-5 -3 L5 3 M-5 3 L5 -3', '#7fb6dc', 1.6));
/** Car seen from the side, wheels on y. */
const car = (x: number, y: number, s = 1, body: string = C.red) => at(x, y, s, path('M-30 -8 L-26 -20 L-14 -22 L-6 -34 L18 -34 L26 -22 L32 -20 L34 -8 Z', body, C.ink, 1.8),
  path('M-3 -31 L8 -31 L8 -23 L-10 -23 Z M11 -31 L17 -31 L23 -23 L11 -23 Z', SCR, C.ink, 1.1), circle(-17, -6, 7, C.dark, C.ink, 1.6), circle(-17, -6, 2.8, C.grey, null), circle(21, -6, 7, C.dark, C.ink, 1.6), circle(21, -6, 2.8, C.grey, null));
/** The common bench layout for lödkolv/lödtenn. */
const solderBench = (ironOn: boolean) => {
  const board = all(pcb(30, 62, 54, 26), resistor(46, 76), chip(70, 72, 10, C.black, 3));
  const ir = iron(57, 78, 1.15, 38);
  const sp = spool(96, 98, 60, 79, 1.1);
  return all(bench(88), board, circle(57, 78, 2.4, '#b8bec4', null), ironOn ? all(ir, greyed(sp), frame(50, 6, 64, 78)) : all(greyed(ir), sp, ring(96, 98, 18)), path('M58 74 C56 66 62 62 58 54', 'none', C.grey2, 1.4));
};
/** The common layout for tänd/släckt: a big lamp in the given state and a small grey lamp in the other. */
const lampState = (lit: boolean) => all(
  lit ? '' : rect(6, 6, 108, 106, '#3a4150', 14, null),
  ground(), lamp(50, 108, 1.2, lit), lit ? '' : path('M42 40 L46 44 M58 40 L54 44', 'none', '#c9ced4', 1.2),
  greyed(lamp(100, 108, 0.45, !lit)));
/** urladdad/fulladdad: one big battery icon. */
const charge = (full: boolean) => all(
  batIcon(14, 34, 80, 40, full ? 1 : 0.08, full ? C.green : C.red, C.ink),
  full ? all(sparkle(20, 22, 6, C.gold), sparkle(100, 22, 5, C.gold), bolt(54, 54, 1.3, C.white)) : all(line('M54 46 L54 58', C.red, 4), circle(54, 64, 2.4, C.red, null)),
  greyed(batIcon(78, 90, 26, 13, full ? 0.08 : 1, C.grey)), frame(8, 28, 100, 52));
/** Phone with a battery bar on the screen that fills up segment by segment (snabbladda). */
const fastFill = () => all(...range(4).map((i) => moving(`ed-snabb-${i}`, `0%,${8 + i * 10}%{opacity:0}${12 + i * 10}%,100%{opacity:1}`, { dur: 1.8 }, rect(-6.5 + i * 3.4, -2, 2.8, 6, C.green, 0.5, null))));

export const ELDEV_MOTIFS: Record<string, Svg> = {
  // ── 3921 Batterier och laddare ───────────────────────────────────
  'eldev.engångsbatteri': all(aa(46, 60, 1.5), greyed(charger(92, 40, 108, 82), rect(84, 74, 26, 18, C.white, 3, C.ink, 1.4)), cross(97, 58, 13), ring(46, 60, 38)),
  'eldev.uppladdningsbar': all(
    path('M60 18 A40 40 0 0 1 98 64', 'none', HL, 3.4), arrow(97, 58, 98, 68, HL, 3.4), path('M60 102 A40 40 0 0 1 22 56', 'none', HL, 3.4), arrow(23, 62, 22, 52, HL, 3.4),
    aa(60, 60, 1.35, C.green, C.mint), bolt(60, 70, 0.7, C.yellow), greyed(aa(104, 96, 0.45))),
  'eldev.urladdad': charge(false),
  'eldev.fulladdad': charge(true),
  'eldev.snabbladda': all(charger(18, 92, 50, 98), phone(60, 64, 2.4, all(rect(-8, -3, 16, 8, C.white, 1, C.ink, 0.8), rect(8, -0.5, 1.4, 3, C.ink, 0, null), fastFill())),
    bolt(96, 34, 1.4), bolt(106, 50, 1.1), line('M84 70 L106 70 M88 78 L110 78 M84 86 L100 86', HL, 2.6)),
  'eldev.litiumjonbatteri': all(greyed(rect(70, 14, 40, 84, C.dark, 7, C.ink, 1.6), rect(74, 18, 32, 76, '#5a5d68', 4, null)),
    rot(46, 58, -8, 1, rect(-26, -40, 52, 80, '#9fb8d0', 5, C.ink, 2), rect(-26, -40, 52, 14, '#7f9ab4', 4, C.ink, 1.4), rect(-8, -46, 16, 6, C.gold, 1, C.ink, 1.2),
      line('M-6 0 L6 0 M0 -6 L0 6', C.ink, 2.4), line('M-6 22 L6 22', C.ink, 2.4)), arrow(82, 50, 76, 50, HL, 2.6), frame(14, 12, 64, 96)),
  'eldev.knappcell': all(greyed(circle(84, 82, 24, C.silver, C.ink, 1.8), circle(84, 82, 18, '#e8ebee', C.ink, 1), circle(84, 82, 10, '#c9ced4', C.ink, 0.8)),
    circle(44, 50, 28, C.silver, C.ink, 2), circle(44, 50, 22, '#dfe3e7', C.ink, 1.2), line('M36 50 L52 50 M44 42 L44 58', C.ink, 3), path('M16 54 C16 72 72 72 72 54', 'none', '#9aa3ad', 2.4), ring(44, 52, 34)),
  'eldev.batterifack': all(rot(48, 60, 0, 1.6, rect(-14, -32, 28, 64, C.dark, 8, C.ink, 1.6), rect(-10, -4, 20, 30, '#4a4d58', 2, C.ink, 1.2)),
    aa(42, 82, 0.58, C.black, C.gold), aa(54, 82, 0.58, C.black, C.gold, 180), rot(92, 78, 18, 1, rect(-12, -18, 24, 36, C.dark, 4, C.ink, 1.6), line('M-6 -12 L6 -12', C.grey, 1.4)), frame(28, 50, 40, 56)),
  'eldev.batteriholk': all(ground(), line('M60 112 L60 72', C.grey, 4), rect(38, 30, 44, 44, C.green, 5, C.ink, 2), path('M34 32 L60 14 L86 32 Z', '#3e7f52', C.ink, 2),
    rect(48, 38, 24, 5, C.dark, 2, null), rect(48, 52, 24, 13, C.white, 2, C.ink, 1.2), rect(51, 55, 14, 7, C.green, 1, C.ink, 0.8), rect(65, 57, 2.4, 3, C.ink, 0, null),
    waIn('ed-holk', 0, -24, aa(60, 37, 0.42, C.black, C.gold, 90)), frame(32, 10, 56, 68)),
  // ── 3922 Strömbrytare och sensorer ──────────────────────────────
  'eldev.strömknapp': all(greyed(rect(6, 70, 108, 30, C.silver, 4, C.ink, 1.6), ...range(9).map((i) => rect(12 + i * 11, 78, 9, 7, '#e8ebee', 1, C.ink, 0.5))),
    circle(60, 46, 26, '#e8ebee', C.ink, 2), circle(60, 46, 20, C.white, C.ink, 1.2), power(60, 47, 10, C.green, 3.4), ring(60, 46, 32)),
  'eldev.viloläge': all(rect(12, 14, 96, 64, C.dark, 4, C.ink, 1.8), rect(16, 18, 88, 56, NIGHT, 2, null),
    path('M66 30 C54 30 50 46 58 54 C64 60 76 58 80 50 C72 54 62 48 64 40 C65 35 66 32 66 30 Z', C.yellow, C.ink, 1.2), sparkle(38, 34, 4, C.white), sparkle(88, 60, 3, C.white), sparkle(42, 58, 2.6, C.white),
    rect(54, 78, 12, 18, C.grey, 1, C.ink, 1.2), rect(40, 96, 40, 5, C.grey, 2, C.ink, 1.2), waPulse('ed-vila', circle(100, 74, 2.6, C.orange, null), ring(100, 74, 6, '#f6b48a')), ground(108)),
  'eldev.rörelsesensor': all(ground(), rect(4, 8, 30, 104, '#d8cfc0', 1, C.ink, 1.4), rect(34, 18, 12, 30, C.dark, 2, C.ink, 1.4), path('M46 22 L58 18 L58 40 L46 36 Z', C.yellow, C.ink, 1.2),
    path('M58 18 L96 8 M58 40 L100 56', 'none', C.gold, 1.6, ), circle(40, 54, 4.5, C.white, C.ink, 1.4), arcs(40, 54, 25, 4, HL, 9, 30),
    figure({ x: 86, top: C.orange, hairStyle: 'long', h: 0.62 }), ring(40, 54, 8)),
  'eldev.känna-av.3': all(ground(104), greyed(rect(4, 34, 40, 70, C.white, 4, C.ink, 1.6), circle(24, 64, 13, '#dfe4ea', C.ink, 1.4)),
    path('M50 104 C46 96 66 92 84 96 C104 98 108 104 100 104 Z', '#9fd3ee', C.ink, 1.2), rect(70, 92, 20, 8, C.white, 3, C.ink, 1.6), circle(80, 96, 1.8, C.green, null),
    waPulse('ed-kanna-av', arcs(80, 92, -90, 3, HL, 8, 50)), moving('ed-kanna-av-drop', '0%{transform:translate(0,-28px);opacity:0}40%,100%{transform:translate(0,0);opacity:1}', { dur: 2.4 }, path('M62 82 C66 88 66 92 62 92 C58 92 58 88 62 82 Z', '#5aa7d6', C.ink, 1)),
    path('M96 44 L96 64', 'none', HL, 4), circle(96, 72, 2.6, HL, null)),
  'eldev.beröringskänslig.2': all(rect(6, 56, 108, 52, '#2e3038', 6, C.ink, 1.8), ...[[30, 82], [60, 82]].map(([x, y]) => all(circle(x!, y!, 9, 'none', '#6c707c', 1.6), line(`M${x! - 4} ${y} L${x! + 4} ${y}`, '#6c707c', 1.6))),
    circle(90, 82, 9, 'none', '#f6b48a', 1.8), line('M86 82 L94 82 M90 78 L90 86', '#f6b48a', 1.8), waPulse('ed-touch', ring(90, 82, 14), ring(90, 82, 20, '#f6b48a')),
    thumbDown(90, 80, 1.1), greyed(circle(26, 28, 13, C.silver, C.ink, 1.6), line('M26 18 L26 26', C.ink, 2.4)), cross(26, 28, 15, C.grey)),
  'eldev.överhettningsskydd': all(ground(104), kettle(42, 102, 1.2), line('M14 44 C18 36 12 30 16 22 M26 40 C30 32 24 26 28 18', C.red, 2),
    rect(84, 22, 10, 50, C.white, 5, C.ink, 1.6), rect(87, 30, 4, 40, C.red, 2, null), circle(89, 76, 8, C.red, C.ink, 1.6),
    path('M70 100 C78 100 80 92 88 92', 'none', C.ink, 2.4), path('M98 92 C104 92 108 98 114 98', 'none', C.ink, 2.4), line('M90 86 L94 90 L90 94 L94 98', HL, 2.4), ring(93, 92, 9)),
  'eldev.nödstopp': all(ground(), greyed(rect(4, 54, 70, 40, C.grey, 3, C.ink, 1.6), rect(8, 94, 8, 18, C.grey, 1, null), rect(62, 94, 8, 18, C.grey, 1, null), ...range(4).map((i) => circle(14 + i * 16, 74, 6, C.dark, C.ink, 1))),
    rect(78, 52, 34, 34, C.yellow, 3, C.ink, 1.8), path('M80 52 L88 52 L80 60 Z M112 78 L112 86 L104 86 Z', C.dark, null), rect(84, 46, 22, 8, '#a83232', 2, C.ink, 1.2),
    ellipse(95, 44, 15, 8, C.red, C.ink, 1.8), ellipse(93, 41, 6, 2.6, '#f08a8a', null), rect(90, 86, 10, 26, C.grey, 1, C.ink, 1.2), ring(95, 54, 22)),
  // ── 3923 Kretskort ───────────────────────────────────────────────
  'eldev.elektronikmontör': all(figure({ x: 60, top: C.denim, hairStyle: 'long' }), bench(80), pcb(34, 70, 40, 10), chip(48, 75, 6, C.black, 3),
    rot(84, 62, 0, 1, iron(0, 12, 0.6)), rect(10, 60, 14, 20, C.grey, 2, C.ink, 1.2), path('M17 60 L28 34 L40 30', 'none', C.dark, 2.4), ellipse(44, 28, 12, 7, '#d6eef9', C.ink, 1.6),
    line('M52 24 L62 18', C.ink, 1), rect(54, 34, 12, 4, '#bfe3f5', 1, C.ink, 0.8)),
  'eldev.plocka-isär': all(ground(108), greyed(rect(36, 54, 48, 40, C.tan, 5, C.ink, 1.6)),
    waIn('ed-isar-lock', 22, 12, rot(22, 40, -18, 1, rect(-16, -14, 32, 28, C.tan, 4, C.ink, 1.6), circle(-6, 0, 7, '#a0673d', C.ink, 1), line('M4 -6 L12 -6 M4 0 L12 0 M4 6 L12 6', C.ink, 1.2))),
    waIn('ed-isar-kort', -10, 16, pcb(70, 18, 40, 26), chip(84, 30, 8, C.black, 3)),
    waIn('ed-isar-ratt', -14, -10, circle(98, 76, 7, C.dark, C.ink, 1.4), line('M98 70 L98 74', C.white, 1.6)),
    waIn('ed-isar-skruv', 10, -14, ...[[30, 98], [42, 102], [80, 102]].map(([x, y]) => all(circle(x!, y!, 2.6, C.silver, C.ink, 1), line(`M${x! - 1.6} ${y} L${x! + 1.6} ${y}`, C.ink, 0.8)))),
    rot(58, 74, 30, 1, rect(-3, -26, 6, 22, C.yellow, 2, C.ink, 1.2), rect(-1.4, -4, 2.8, 16, C.silver, 0.5, C.ink, 0.8)),
    arrow(52, 50, 38, 40, HL, 2.4), arrow(70, 48, 80, 42, HL, 2.4), arrow(76, 80, 90, 78, HL, 2.4)),
  'eldev.kretskort': all(pcb(8, 18, 104, 80), chip(40, 46, 22, C.black, 6), chip(84, 40, 12, C.black, 4), resistor(28, 78), resistor(56, 82), resistor(86, 70),
    rect(72, 58, 8, 12, '#3f6fb5', 1.5, C.ink, 1), ellipse(96, 86, 6, 6, '#3f6fb5', C.ink, 1.2), ...range(4).map((i) => circle(16, 26 + i * 6, 1.6, C.gold, null)), frame(4, 14, 112, 88)),
  'eldev.ledningsbana': all(rect(4, 14, 112, 92, PCB, 4, C.ink, 1.8), line('M20 34 L50 34 L58 26 L100 26 M20 90 L40 90 L50 80 L100 80 M84 40 L84 66', TRACE, 2.4),
    chip(24, 60, 18, C.black, 4), chip(96, 60, 18, C.black, 4),
    line('M36 60 L50 60 L58 52 L72 52 L76 60 L84 60', '#f6b48a', 5), line('M36 60 L50 60 L58 52 L72 52 L76 60 L84 60', COPPER, 3),
    moving('ed-bana', '0%{transform:translate(-30px,0);opacity:0}20%{opacity:1}80%{opacity:1}100%{transform:translate(30px,0);opacity:0}', { dur: 2 }, circle(60, 52, 2.6, C.yellow, null)),
    rect(30, 42, 60, 26, 'none', 4, HL, 2.6)),
  'eldev.lödtenn': solderBench(false),
  'eldev.kontaktdon': all(pcb(6, 56, 108, 50), chip(28, 82, 16, C.black, 4), rect(64, 74, 36, 10, C.black, 1, C.ink, 1.2), ...range(7).map((i) => rect(67 + i * 4.6, 77, 2, 4, C.gold, 0.4, null)),
    waIn('ed-kontaktdon', 0, -16, rect(62, 56, 40, 14, '#e8ebee', 2, C.ink, 1.6), ...range(8).map((i) => line(`M${66 + i * 4.6} 56 L${66 + i * 4.6} 14`, ['#d64545', '#9aa3ad', '#9aa3ad', '#9aa3ad', '#9aa3ad', '#9aa3ad', '#9aa3ad', '#9aa3ad'][i]!, 2.4))),
    arrow(108, 30, 108, 50, HL, 2.6), frame(58, 52, 48, 34)),
  'eldev.kylfläns': all(greyed(pcb(6, 84, 108, 26)), chip(60, 82, 34, C.black, 6),
    rect(28, 58, 64, 14, ALU, 2, C.ink, 1.6), ...range(8).map((i) => rect(30 + i * 8, 22, 4, 38, ALU, 1, C.ink, 1.2)),
    waPulse('ed-kylflans', line('M36 18 C32 12 40 8 36 2 M60 18 C56 12 64 8 60 2 M84 18 C80 12 88 8 84 2', C.red, 2)), frame(24, 18, 72, 58)),
  'eldev.antistatisk': all(greyed(pcb(64, 72, 50, 32), chip(88, 88, 12, C.black, 3)),
    path('M4 52 C20 46 36 44 52 46 L52 72 C36 72 20 74 4 80 Z', C.skin, C.ink, 2), rect(30, 42, 14, 36, '#4f7fbf', 3, C.ink, 1.6), rect(33, 54, 8, 10, C.silver, 1, C.ink, 1),
    path('M40 62 C56 66 50 86 60 92 C66 96 66 104 62 110', 'none', C.ink, 2), path('M58 106 L66 106 M59 109 L65 109 M60.5 112 L63.5 112', 'none', C.ink, 2),
    line('M72 40 L66 50 L72 50 L66 60', C.yellow, 2.4), cross(69, 50, 11, HL), frame(26, 38, 22, 44)),
  // ── 3924 Skärmar och indikatorer ────────────────────────────────
  'eldev.display': all(ground(), rect(6, 34, 108, 64, C.white, 5, C.ink, 2), rect(12, 40, 66, 52, '#2e3038', 3, C.ink, 1.4), rect(16, 44, 58, 44, '#3a3c46', 2, null),
    rect(82, 40, 28, 52, '#e8ebee', 2, C.ink, 1.2), rect(86, 44, 20, 12, '#1c2a22', 1.5, C.ink, 1), `<text x="96" y="53.5" font-family="ui-monospace,monospace" font-weight="700" font-size="8" text-anchor="middle" fill="#7cf29a">1:30</text>`,
    ...range(6).map((i) => circle(90 + (i % 2) * 12, 64 + Math.floor(i / 2) * 9, 3, C.white, C.ink, 1)), frame(82, 40, 28, 18)),
  'eldev.bakgrundsbelysning': all(rect(4, 10, 112, 100, '#2a2f3a', 14, null),
    greyed(rect(12, 30, 42, 60, '#4a4d58', 8, C.ink, 1.6), rect(18, 44, 30, 22, '#3a3d45', 2, null), `<text x="33" y="60" font-family="ui-monospace,monospace" font-weight="700" font-size="12" text-anchor="middle" fill="#4f535c">8:15</text>`),
    rect(66, 30, 42, 60, '#4a4d58', 8, C.ink, 1.6), rect(68, 40, 38, 30, 'rgba(255,243,176,0.4)', 4, null), rect(72, 44, 30, 22, GLOW, 2, null), `<text x="87" y="60" font-family="ui-monospace,monospace" font-weight="700" font-size="12" text-anchor="middle" fill="#2b2a33">8:15</text>`,
    rays(87, 55, 26, 32, 8, '#f6d77a'), frame(70, 42, 34, 26)),
  'eldev.kontrollampa': all(ground(), coffeeMaker(54, 108, 1.6, C.green), circle(83, 76, 6, 'rgba(120,230,140,0.45)', null), ring(83, 76, 10)),
  'eldev.tänd': lampState(true),
  'eldev.släckt': lampState(false),
  'eldev.batteriindikator': all(greyed(phone(36, 74, 2.3, all(...range(4).map((i) => rect(-6.5, -6 + i * 4, 13, 2.4, C.grey, 0.6, null))))),
    rect(14, 32, 44, 6, '#e8ebee', 1, null), path('M52 36 L58 37', 'none', C.ink, 1.6), circle(80, 38, 24, C.white, C.ink, 2.2), batIcon(64, 30, 28, 16, 0.7, C.green), path('M97 56 L107 68', 'none', C.ink, 5), ring(80, 38, 28)),
  // ── 3925 Högtalare och mikrofoner ───────────────────────────────
  'eldev.ljudtekniker': all(figure({ x: 60, top: C.dark }), path('M49 30 C49 14 71 14 71 30', 'none', C.dark, 3), rect(46, 27, 6, 10, C.dark, 3, null), rect(68, 27, 6, 10, C.dark, 3, null),
    rect(14, 74, 92, 20, '#5a5d68', 3, C.ink, 1.8), ...range(8).map((i) => all(line(`M${22 + i * 11} 78 L${22 + i * 11} 90`, C.ink, 1.2), rect(19 + i * 11, 80 + (i * 5) % 8, 6, 3, [C.red, C.yellow, C.green, C.white][i % 4]!, 1, C.ink, 0.6))),
    greyed(speaker(4, 22, 18, 30), speaker(98, 22, 18, 30))),
  'eldev.ljudanläggning': all(ground(), line('M20 112 L20 70 M12 112 L20 98 L28 112 M100 112 L100 70 M92 112 L100 98 L108 112', C.dark, 2.4), speaker(8, 26, 24, 44), speaker(88, 26, 24, 44),
    amp(40, 78, 40, 20), rect(40, 98, 40, 14, '#5a5d68', 2, C.ink, 1.4), ...range(5).map((i) => line(`M${46 + i * 7} 100 L${46 + i * 7} 110`, C.ink, 1)), mic(60, 48, 0.8, 0),
    path('M32 60 C36 74 40 80 44 80 M88 60 C84 74 80 80 76 80', 'none', C.ink, 1.4), frame(4, 22, 112, 90)),
  'eldev.mikrofonstativ': all(ground(), mic(60, 18, 0.9, 0), rect(56, 36, 8, 6, C.dark, 1, C.ink, 1),
    line('M60 42 L60 98 M60 98 L40 112 M60 98 L80 112 M60 98 L60 112', C.ink, 4.4), line('M60 42 L60 98 M60 98 L40 112 M60 98 L80 112 M60 98 L60 112', C.silver, 2.6), rect(56, 64, 8, 5, C.dark, 1, null),
    rect(48, 38, 24, 76, 'none', 4, HL, 2.6)),
  'eldev.rundgång': all(ground(), greyed(figure({ x: 22, top: C.green, h: 0.8 })), speaker(78, 46, 34, 62), mic(54, 50, 0.9, -30),
    path('M66 38 C76 22 96 24 98 38', 'none', HL, 2.6), arrow(96, 32, 98, 40, HL, 2.6), path('M80 66 C70 74 64 72 60 64', 'none', HL, 2.6), arrow(64, 70, 59, 63, HL, 2.6),
    waGrow('ed-rundgang', line('M84 18 L90 10 L94 18 L100 8 L104 18 L110 6', C.red, 2.6))),
  'eldev.spraka.2': all(ground(), speaker(30, 26, 44, 82), path('M74 96 C88 100 90 108 104 106', 'none', C.ink, 2.4), path('M108 104 C112 102 114 104 116 102', 'none', C.ink, 2.4),
    waShake('ed-spraka', line('M84 30 L90 36 L86 40 L94 46 M86 56 L96 58 L90 64 L100 66', HL, 2.6), sparkle(96, 26, 5, C.yellow), sparkle(102, 50, 4, C.yellow), sparkle(84, 72, 3.6, C.yellow)), ring(106, 104, 7)),
  'eldev.parkoppla': all(phone(26, 62, 2.2), at(94, 64, 1, path('M-16 2 C-16 -26 16 -26 16 2', 'none', C.ink, 5), path('M-16 2 C-16 -26 16 -26 16 2', 'none', C.dark, 3), rect(-22, -2, 11, 18, C.dark, 5, C.ink, 1.6), rect(11, -2, 11, 18, C.dark, 5, C.ink, 1.6), rect(-19, 1, 5, 12, '#5a5d68', 2.5, null), rect(14, 1, 5, 12, '#5a5d68', 2.5, null)),
    line('M44 62 L70 62', C.grey, 2, '3 4'), waIn('ed-parkoppla', -14, 0, ellipse(54, 46, 8, 5, 'none', HL, 3), ellipse(64, 46, 8, 5, 'none', HL, 3)),
    waPulse('ed-parkoppla-sig', arcs(44, 62, 0, 2, C.sky, 6, 35), arcs(70, 62, 180, 2, C.sky, 6, 35))),
  'eldev.mygga.2': all(bust(50, 46, 1.6, C.navy, true), path('M42 78 L50 96 L58 78', 'none', C.white, 2.4), rect(58, 84, 6, 9, C.dark, 2, C.ink, 1), path('M61 93 C62 104 70 104 74 112', 'none', C.ink, 1.4),
    circle(96, 40, 18, C.white, C.ink, 2), rect(90, 30, 12, 18, C.dark, 4, C.ink, 1.4), rect(92, 46, 8, 6, C.silver, 1, C.ink, 1), line('M74 52 L82 48 M78 84 L68 90', C.ink, 1.2), ring(61, 88, 9), ring(96, 40, 22)),
  'eldev.förstärkare.2': all(ground(), amp(30, 52, 56, 30), speaker(94, 40, 22, 72), path('M8 70 C14 70 18 68 30 68', 'none', C.ink, 2.4), path('M86 70 C90 70 92 72 94 72', 'none', C.ink, 2.4),
    path('M4 52 C8 48 12 56 16 52 C20 48 24 56 28 52', 'none', C.sky, 2), path('M38 30 C44 14 50 46 56 30 C62 14 68 46 74 30 C80 14 86 46 92 30', 'none', HL, 2.6), frame(26, 48, 64, 38)),
  // ── 3926 Fjärrkontroller ────────────────────────────────────────
  'eldev.universalfjärrkontroll': all(tv(6, 8, 42, 28, rect(9, 11, 36, 22, '#8fd0f2', 1, null)), rect(52, 26, 26, 8, C.dark, 2, C.ink, 1.4), circle(73, 30, 1.4, C.green, null), speaker(92, 10, 20, 28),
    remote(60, 86, 0.9, 0, '', C.silver), arrow(56, 58, 32, 44, HL, 2.6), arrow(62, 56, 64, 40, HL, 2.6), arrow(68, 58, 96, 44, HL, 2.6), frame(48, 56, 24, 60)),
  'eldev.smart-tv': all(tv(8, 14, 104, 66, all(...range(8).map((i) => rect(16 + (i % 4) * 23, 24 + Math.floor(i / 4) * 24, 19, 19, [C.red, C.yellow, C.green, C.purple, C.orange, C.denim, C.pink, C.mint][i]!, 3, C.ink, 0.8)),
    circle(25.5, 33.5, 4, C.white, null), path('M44 30 L44 38 L51 34 Z', C.white, null))), ground(96), frame(4, 10, 112, 74)),
  'eldev.zappa': all(tv(14, 10, 92, 56, all(
    moving('ed-zappa-1', '0%,30%{opacity:1}34%,100%{opacity:0}', { dur: 2.4 }, rect(17, 13, 86, 50, '#8fd0f2', 1, null), path('M17 63 L40 40 L60 56 L80 36 L103 63 Z', C.green, null)),
    moving('ed-zappa-2', '0%,33%{opacity:0}36%,63%{opacity:1}66%,100%{opacity:0}', { dur: 2.4 }, rect(17, 13, 86, 50, '#f6c9d4', 1, null), circle(60, 38, 12, C.skin, C.ink, 1), path('M48 30 C48 20 72 20 72 30', C.hair, null)),
    rect(17, 13, 86, 50, '#f2c14e', 1, null), rect(36, 40, 48, 12, C.green, 1, null), circle(60, 30, 5, C.white, C.ink, 0.8))),
    ...[0, 1, 2].map((i) => rect(36 + i * 18, 76, 12, 4, i === 2 ? HL : C.grey2, 1, null)), remote(60, 102, 0.62, 90), thumbDown(52, 99, 0.5)),
  'eldev.volymknapp': all(rot(46, 60, 0, 1.55, rect(-11, -34, 22, 68, C.dark, 8, C.ink, 1.6), circle(0, -26, 3, C.red, null), rect(-5, -12, 10, 26, '#5a5d68', 5, C.ink, 1),
    line('M-2.6 -6 L2.6 -6 M0 -8.6 L0 -3.4', C.white, 1.6), line('M-2.6 8 L2.6 8', C.white, 1.6), ...range(6).map((i) => circle(-5 + (i % 3) * 5, 20 + Math.floor(i / 3) * 6, 1.6, C.grey2, null))),
    rect(36, 39, 20, 44, 'none', 6, HL, 2.6), arcs(70, 50, 0, 3, C.sky, 8, 35)),
  'eldev.knappsats': all(rect(4, 6, 50, 106, '#8a5a3c', 2, C.ink, 1.6), circle(46, 62, 3, C.gold, C.ink, 1), rect(54, 6, 62, 106, '#e3d9c8', 1, null),
    rect(66, 26, 40, 58, C.silver, 4, C.ink, 1.8), ...range(12).map((i) => { const x = 72 + (i % 3) * 11, y = 34 + Math.floor(i / 3) * 11; return all(rect(x, y, 8, 8, C.white, 2, C.ink, 0.8), `<text x="${x + 4}" y="${y + 6.6}" font-family="system-ui,sans-serif" font-weight="700" font-size="6.5" text-anchor="middle" fill="#2b2a33">${['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'][i]}</text>`); }),
    frame(62, 22, 48, 66)),
  'eldev.tv-box': all(greyed(tv(16, 6, 88, 54, rect(19, 9, 82, 48, '#8fd0f2', 1, null))), rect(8, 74, 104, 6, C.tan, 1, C.ink, 1.4), line('M14 80 L14 112 M106 80 L106 112', C.brown, 3),
    rect(38, 60, 44, 14, C.dark, 3, C.ink, 1.6), circle(76, 67, 1.8, C.green, null), line('M44 67 L60 67', C.grey, 1.4), path('M60 60 C60 56 60 56 60 56', 'none', C.ink, 2), frame(34, 56, 52, 22)),
  'eldev.radiostyrd': all(ground(), rect(54, 40, 10, 72, '#d8cfc0', 1, C.ink, 1.4), car(92, 112, 0.7, C.orange), line('M100 90 L106 72', C.ink, 1.6), circle(106, 72, 1.6, C.ink, null),
    rect(10, 56, 30, 22, C.dark, 4, C.ink, 1.6), circle(18, 67, 4, C.grey, C.ink, 1), circle(32, 67, 4, C.grey, C.ink, 1), line('M36 56 L40 30', C.ink, 1.8), circle(40, 30, 2, C.ink, null),
    arcs(40, 30, 0, 3, HL, 8, 40), path('M66 32 C78 40 90 56 104 70', 'none', HL, 2, ), greyed(car(26, 112, 0.42, C.grey), line('M40 108 L52 104', C.ink, 1))),
  'eldev.fjärrstart': all(rect(4, 6, 112, 106, '#dde8f2', 14, null), ground(), rect(4, 14, 40, 70, '#e3d9c8', 2, C.ink, 1.4), rect(12, 24, 24, 26, SCR, 1, C.ink, 1.2), phone(24, 66, 0.9, circle(0, -2, 5, HL, null)),
    arcs(34, 64, -10, 3, HL, 7, 30), car(84, 110, 0.85, C.denim), path('M54 92 C60 84 56 78 62 72', 'none', C.red, 1.6), path('M62 96 C68 88 64 82 70 76', 'none', C.red, 1.6),
    flake(56, 20), flake(80, 30), flake(104, 16), flake(96, 50), flake(66, 44), frame(52, 72, 64, 40)),
  // ── 3927 Felsöka en apparat ─────────────────────────────────────
  'eldev.lukta-bränt': all(ground(), rect(60, 84, 56, 6, C.tan, 1, C.ink, 1.4), coffeeMaker(92, 84, 1, C.red),
    waGrow('ed-brant', path('M88 30 C80 22 92 16 86 8 M96 30 C104 22 92 14 100 6', 'none', '#5a5d68', 3), path('M84 34 C86 30 98 30 100 34', 'none', '#5a5d68', 3)),
    bust(34, 50, 1.3, C.green), path('M50 50 L56 52 L50 54', 'none', C.ink, 1.6), line('M24 42 L30 44 M38 44 L44 42', C.ink, 1.6),
    path('M58 46 C66 42 70 44 74 40 M58 52 C66 52 70 50 76 48', 'none', '#7b808a', 1.4, )),
  'eldev.reparatör': all(figure({ x: 46, top: C.denim }), rect(4, 76, 112, 36, '#8a6a52', 2, C.ink, 1.8), rect(4, 72, 112, 6, '#a07e62', 2, C.ink, 1.4),
    rect(62, 62, 18, 10, C.dark, 2, C.ink, 1.2), rect(82, 62, 18, 10, '#4a4d58', 2, C.ink, 1.2), rect(84, 64, 14, 6, PCB, 1, null), chip(91, 67, 3, C.black, 2),
    rot(104, 60, 40, 1, rect(-2, -14, 4, 12, C.red, 1.5, C.ink, 1), rect(-0.8, -2, 1.6, 10, C.silver, 0.4, null)), circle(28, 64, 3, C.silver, C.ink, 1), circle(20, 66, 2, C.silver, C.ink, 1)),
};
