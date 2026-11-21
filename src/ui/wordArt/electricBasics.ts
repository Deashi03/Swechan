/**
 * Teknik & digital värld → Elektronik & energi → Elektriska grundkomponenter, 3911–3917 (0.57): voltage and
 * current in practice, resistors, capacitors, coils, diodes, transistors and circuit diagrams.
 * Recurring signs: the part that the word names is outlined in orange (ring, frame or arrow) and grey parts show
 * what the word is not. Electrons are small blue dots. Words that are easy to mix up get clearly different
 * scenes: volt (a socket and a display), ampere (a clamp meter around a wire with flowing electrons), watt (a
 * dim and a bright bulb); värmeutveckling (normal heat from a resistor) and varmgång (a scorched socket);
 * relä (a relay box between a small and a big circuit) and klicka (a seat-belt buckle that clicks).
 * Digits and the code signs + − = only; no unit letters, no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waIn, waPulse, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const BLUE = '#3f7fc8';
const COPPER = '#c8743a';
const PCB = '#3c8a55';
const GLOW = 'rgba(242,193,78,0.35)';
const WARM = '#ffd27a';
const COLD = '#d9ecff';
const SCORCH = '#7a4a2a';
const f1 = (n: number) => +n.toFixed(1);
const rad = (d: number) => (d * Math.PI) / 180;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 5, col, 2.6);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const wire = (d: string, col: string = C.dark, sw = 2.4) => line(d, col, sw);
const el = (x: number, y: number, r = 2.6) => circle(x, y, r, BLUE, C.ink, 0.8);
const bolt = (x: number, y: number, s = 1, col: string = C.yellow) => g(`translate(${x} ${y}) scale(${s})`, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', col, C.ink, 1.4));
const heat = (x: number, y: number, n = 3, col: string = C.red, gap = 8) => line(range(n).map((i) => `M${x + i * gap} ${y} c-3 -4 3 -6 0 -10 c-3 -4 3 -6 0 -10`).join(' '), col, 1.8);
const smoke = (x: number, y: number) => path(`M${x} ${y} C${x - 6} ${y - 8} ${x + 6} ${y - 12} ${x} ${y - 20} M${x + 8} ${y - 2} C${x + 2} ${y - 10} ${x + 14} ${y - 14} ${x + 8} ${y - 22}`, 'none', C.grey, 2.6);
const warn = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -12 L12 9 L-12 9 Z', C.yellow, C.ink, 1.6), line('M0 -5 L0 2', C.ink, 2.4), circle(0, 5.5, 1.3, C.ink, null));
const cross = (x: number, y: number, s = 6, col: string = C.red) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 3);
const wall = (col = '#efe8dc') => rect(0, 0, 120, 112, col, 0, null);

/** Swedish wall socket (round recess, two holes); `clips` adds the two earthing clips. */
const socket = (x: number, y: number, r = 16, clips = true) => all(rect(x - r - 5, y - r - 5, 2 * r + 10, 2 * r + 10, C.white, 6, C.ink, 1.8), circle(x, y, r, '#eceff2', C.ink, 1.6),
  circle(x - r * 0.38, y, r * 0.12, C.ink, null), circle(x + r * 0.38, y, r * 0.12, C.ink, null),
  clips ? all(rect(x - r * 0.22, y - r + 1, r * 0.44, r * 0.22, C.silver, 1, C.ink, 1), rect(x - r * 0.22, y + r * 0.78 - 1, r * 0.44, r * 0.22, C.silver, 1, C.ink, 1)) : '');
/** Round plug seen from the side, cable going down. */
const plugSide = (x: number, y: number, col: string = C.white) => all(rect(x - 7, y - 8, 14, 16, col, 4, C.ink, 1.6), line(`M${x} ${y + 8} C${x} ${y + 20} ${x - 6} ${y + 26} ${x - 10} ${y + 34}`, C.dark, 2.4));
/** Light bulb (glass up). */
const bulb = (x: number, y: number, lit = true, r = 10, glow: string = GLOW) => all(lit ? circle(x, y, r + 7, glow, null) : '',
  lit ? line(range(7).map((i) => { const a = rad(-90 + (i - 3) * 30); return `M${f1(x + Math.cos(a) * (r + 3))} ${f1(y + Math.sin(a) * (r + 3))} L${f1(x + Math.cos(a) * (r + 8))} ${f1(y + Math.sin(a) * (r + 8))}`; }).join(' '), C.gold, 2) : '',
  circle(x, y, r, lit ? C.yellow : C.white, C.ink, 1.6), rect(x - r * 0.45, y + r - 1, r * 0.9, r * 0.6, C.grey, 1, C.ink, 1.2));
/** Battery lying down from x to x+w, centre y; + knob on the right. */
const batt = (x: number, y: number, w = 40, h = 16) => all(rect(x, y - h / 2, w * 0.68, h, C.dark, 2, C.ink, 1.6), rect(x + w * 0.68, y - h / 2, w * 0.32, h, C.gold, 2, C.ink, 1.6),
  rect(x + w, y - h * 0.2, 4, h * 0.4, C.silver, 1, C.ink, 1.2), line(`M${x + w * 0.84 - 3} ${y} L${x + w * 0.84 + 3} ${y} M${x + w * 0.84} ${y - 3} L${x + w * 0.84} ${y + 3}`, C.ink, 1.6));
const resistor = (x: number, y: number, s = 1, rot = 0, bands: string[] = [C.brown, C.black, C.red, C.gold]) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, line('M-26 0 L26 0', C.silver, 2), rect(-14, -6, 28, 12, C.beige, 5, C.ink, 1.6),
  ...bands.map((c, i) => rect(-9 + i * 6, -6, i === 3 ? 2 : 3, 12, c, 0, null)));
const led = (x: number, y: number, col: string = C.red, lit = true, s = 1) => g(`translate(${x} ${y}) scale(${s})`, lit ? circle(0, -8, 13, 'rgba(214,69,69,0.22)', null) : '', line('M-3 4 L-3 22 M3 4 L3 18', C.silver, 2),
  path('M-6 4 L-6 -8 C-6 -16 6 -16 6 -8 L6 4 Z', col, C.ink, 1.4), rect(-8, 2, 16, 3, col, 1, C.ink, 1.2));
const capacitor = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M-3 10 L-3 24 M3 10 L3 24', C.silver, 2), rect(-8, -14, 16, 26, BLUE, 4, C.ink, 1.6), rect(3, -14, 4, 26, '#9cc0e8', 0, null), ellipse(0, -14, 8, 2.4, C.silver, C.ink, 1.2));
const chip = (x: number, y: number, s = 1, col: string = C.black) => g(`translate(${x} ${y}) scale(${s})`, ...range(5).map((i) => line(`M${-12 + i * 6} -14 L${-12 + i * 6} -18 M${-12 + i * 6} 14 L${-12 + i * 6} 18`, C.silver, 2)), rect(-16, -14, 32, 28, col, 2, C.ink, 1.6), circle(-10, -8, 2, C.dark, null));
const coil = (x1: number, x2: number, y: number, n: number, h = 14, col: string = COPPER, sw = 2.4) => {
  const step = (x2 - x1) / n;
  return all(...range(n).map((i) => all(ellipse(f1(x1 + step * (i + 0.5)), y, f1(step * 0.55), h, 'none', C.ink, sw + 1.4), ellipse(f1(x1 + step * (i + 0.5)), y, f1(step * 0.55), h, 'none', col, sw))));
};
/** Small display with digits. */
const display = (x: number, y: number, w: number, h: number, txt: string, col: string = C.ink) => all(rect(x, y, w, h, '#dfe9d8', 2, C.ink, 1.6), T(x + w / 2, y + h * 0.75, txt, h * 0.62, col));
/** Breaker in a panel row: body top-left (x, y); lever up (on) or down (off). */
const breaker = (x: number, y: number, on = true, col: string = C.white) => all(rect(x, y, 14, 34, col, 2, C.ink, 1.4), rect(x + 4, y + 9, 6, 16, C.grey2, 1, C.ink, 1), rect(x + 3, on ? y + 9 : y + 17, 8, 8, C.dark, 1, C.ink, 1));
/** Palm seen from the side (no pointing finger), wrist at (x, y). */
const palm = (x: number, y: number, rot = 0) => g(`translate(${x} ${y}) rotate(${rot})`, path('M0 0 L14 -2 C20 -3 26 -2 30 0 C32 2 30 5 26 5 L20 5 C22 7 21 10 18 10 L4 10 C0 10 -2 6 0 0 Z', C.skin, C.ink, 1.4), rect(-12, -1, 14, 11, C.navy, 2, C.ink, 1.4));
const sine = (x: number, y: number, w: number, a: number, col: string = C.grey, sw = 2.2) => line(`M${x} ${y} C${x + w * 0.12} ${y - a * 1.3} ${x + w * 0.38} ${y - a * 1.3} ${x + w * 0.5} ${y} C${x + w * 0.62} ${y + a * 1.3} ${x + w * 0.88} ${y + a * 1.3} ${x + w} ${y}`, col, sw);
const ear = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-6 10 C-12 4 -10 -12 2 -12 C12 -12 14 0 6 4 C2 6 2 10 -2 12 C-4 13 -6 12 -6 10 Z', C.skin, C.ink, 1.6), path('M-2 -4 C0 -8 6 -6 4 -1', 'none', C.ink, 1.2));
const person = (x: number, y: number, top: string, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M-4 0 L-3 -22 M4 0 L3 -22', C.navy, 6), rect(-9, -48, 18, 28, top, 5, C.ink, 1.6),
  circle(0, -58, 9, C.skin, C.ink, 1.6), path('M-9 -59 C-9 -71 9 -71 9 -59 C5 -64 -5 -64 -9 -59 Z', C.hair, null));

// ── Shared layouts ───────────────────────────────────────────────────
/** Two bulbs side by side: a small dim one (grey) and a big bright one (marked), each with a tag. */
const twoLights = (small: string, big: string, cone = false) => all(
  greyed(cone ? path('M14 46 L4 104 L40 104 L30 46 Z', 'rgba(242,193,78,0.25)', null) : '', bulb(22, 36, true, 9), rect(10, 70, 24, 13, C.white, 2, C.ink, 1.2), T(22, 80, small, 9)),
  cone ? path('M80 50 L56 106 L114 106 L92 50 Z', 'rgba(242,193,78,0.45)', null) : '', bulb(86, 34, true, 15), rect(70, cone ? 84 : 72, 32, 16, C.white, 2, C.ink, 1.4), T(86, cone ? 97 : 85, big, 11), frame(62, 6, 52, cone ? 100 : 86));

export const ELBAS_MOTIFS: Record<string, Svg> = {
  // ── 3911 Spänning och ström ──
  'elbas.volt': all(wall(), socket(36, 70, 18), line('M29 70 L29 40 L43 40 L43 70', HL, 2.6), arrow(36, 44, 36, 24, HL, 3), display(60, 12, 50, 24, '230', C.ink), frame(56, 8, 58, 32), line('M43 46 L56 30', HL, 2),
    greyed(batt(66, 92, 34, 12), rect(64, 70, 30, 12, C.white, 2, C.ink, 1), T(79, 79, '1,5', 8))),
  'elbas.ampere': all(wire('M0 60 L120 60', C.dark, 10), wire('M0 60 L120 60', COPPER, 5), ...[14, 30, 46, 74, 90, 106].map((x, i) => waIn(`elbas-ampere-${i}`, -10, 0, el(x, 60, 2.4))),
    arrow(8, 44, 40, 44, HL, 3), g('translate(60 58)', path('M-14 -2 C-14 -18 14 -18 14 -2', 'none', C.yellow, 7), path('M-14 -2 C-14 -18 14 -18 14 -2', 'none', C.ink, 1.2), path('M-14 2 C-14 16 14 16 14 2', 'none', C.yellow, 7),
      rect(-12, 14, 24, 40, C.yellow, 5, C.ink, 1.8), display(-9, 20, 18, 12, '10', C.ink), circle(0, 44, 5, C.dark, C.ink, 1.2)), ring(60, 60, 22),
    greyed(wire('M0 100 L40 100', C.dark, 4), el(12, 100, 2), el(30, 100, 2))),
  'elbas.watt': twoLights('5', '60'),
  'elbas.jordat-uttag': all(wall(), socket(60, 56, 30, true), ring(60, 30, 9), ring(60, 82, 9), greyed(socket(100, 100, 7, false))),
  'elbas.strömförande': all(wall('#f3efe6'), wire('M0 40 C30 40 40 50 64 50', C.dark, 8), wire('M0 40 C30 40 40 50 64 50', '#5aa0d8', 5), rect(62, 46, 18, 8, COPPER, 2, C.ink, 1.2),
    waPulse('elbas-stromforande-1', circle(74, 50, 14, 'rgba(242,193,78,0.45)', null), bolt(90, 36, 1.1), bolt(88, 64, 0.8)), ring(72, 50, 18), warn(26, 18, 1),
    greyed(wire('M0 96 C30 96 40 100 64 100', C.dark, 8), rect(62, 96, 18, 8, COPPER, 2, C.ink, 1.2))),
  'elbas.propp.2': all(wall(), rect(14, 20, 40, 84, C.grey2, 4, C.ink, 1.8), circle(34, 46, 13, C.white, C.ink, 1.6), circle(34, 78, 13, C.white, C.ink, 1.6), circle(34, 46, 4, C.red, C.ink, 1), circle(34, 78, 4, C.grey, C.ink, 1),
    g('translate(84 52)', path('M-10 -22 L10 -22 L12 18 L-12 18 Z', '#f4f1ea', C.ink, 1.8), line('M-11 -10 L11 -10 M-11 -2 L12 -2 M-12 6 L12 6', C.grey, 1.2), circle(0, -26, 6, C.red, C.ink, 1.4), rect(-8, 18, 16, 8, C.silver, 2, C.ink, 1.4)), ring(84, 50, 30),
    palm(88, 92, -100), path('M64 30 A22 22 0 0 1 104 30', 'none', HL, 2.6), path('M104 30 L98 24 M104 30 L96 33', 'none', HL, 2.6)),
  'elbas.jordfelsbrytare': all(rect(6, 14, 108, 78, C.grey2, 4, C.ink, 1.8), breaker(14, 34), breaker(30, 34), breaker(46, 34, true, C.white),
    rect(66, 30, 40, 42, C.white, 3, C.ink, 1.6), rect(72, 40, 10, 20, C.grey2, 1, C.ink, 1), rect(73, 40, 8, 9, C.dark, 1, C.ink, 1), circle(96, 52, 6, C.yellow, C.ink, 1.4), frame(62, 26, 48, 50), arrow(96, 104, 96, 64, HL, 3)),
  'elbas.lösa-ut.2': all(rect(14, 50, 92, 58, C.grey2, 4, C.ink, 1.8), breaker(24, 62), breaker(44, 62),
    rect(66, 58, 22, 44, C.white, 2, C.ink, 1.6), rect(72, 64, 10, 30, C.grey2, 1, C.ink, 1), moving('elbas-losaut-1', '0%,35%{transform:translate(0,-16px)}55%,100%{transform:translate(0,0)}', { dur: 2.8 }, rect(70, 82, 14, 12, C.dark, 2, C.ink, 1.2)),
    arrow(98, 64, 98, 92, HL, 3), frame(62, 54, 30, 52), greyed(bulb(60, 22, false, 11)), line('M50 10 L44 4 M70 10 L76 4', C.grey, 1.6)),
  'elbas.skarvsladd': all(wall(), rect(0, 100, 120, 12, C.tan, 0, null), socket(104, 48, 8), g('translate(20 100)', line('M0 0 L0 -50', C.dark, 3), path('M-12 -50 L12 -50 L8 -66 L-8 -66 Z', C.yellow, C.ink, 1.6), ellipse(0, 0, 10, 3, C.dark, null)),
    greyed(line('M22 98 C30 98 34 96 36 92', C.dark, 2)), path('M36 92 C50 104 70 104 86 96 C96 90 100 70 104 58', 'none', HL, 3.4), rect(30, 88, 12, 8, C.white, 2, C.ink, 1.4), plugSide(104, 58, C.white)),
  'elbas.elinstallation': all(rect(0, 0, 120, 112, '#e9e1d2', 0, null), rect(10, 10, 100, 92, '#f5efe4', 2, C.grey, 1.2, ), rect(14, 30, 22, 30, C.grey2, 2, C.ink, 1.6), line(range(3).map((i) => `M${18 + i * 6} 36 L${18 + i * 6} 50`).join(' '), C.dark, 3),
    wire('M36 40 L60 40 L60 16 M60 40 L92 40 L92 60 M36 52 L50 52 L50 86 L82 86', HL, 2.6), circle(60, 14, 6, C.yellow, C.ink, 1.4), socket(92, 70, 7), rect(76, 80, 12, 14, C.white, 2, C.ink, 1.4), rect(79, 84, 6, 6, C.grey2, 1, null),
    greyed(g('translate(26 104)', line('M0 0 L0 -26', C.dark, 2), path('M-7 -26 L7 -26 L4 -34 L-4 -34 Z', C.yellow, C.ink, 1)))),
  // ── 3912 Motstånd ──
  'elbas.ohm': all(resistor(46, 66, 2.2), line('M70 52 L86 30', C.ink, 1.4), path('M84 18 L112 18 L112 38 L84 38 L78 28 Z', C.white, C.ink, 1.6), circle(84, 28, 1.6, C.ink, null), T(98, 33, '220', 10), frame(74, 12, 42, 32)),
  'elbas.färgkod.1': all(resistor(34, 34, 2), rect(70, 54, 44, 52, C.white, 2, C.ink, 1.6), ...[[C.black, '0'], [C.brown, '1'], [C.red, '2'], [C.orange, '3']].map(([c, d], i) => all(rect(76, 60 + i * 11, 12, 8, c!, 1, C.ink, 0.8), T(100, 67 + i * 11, d!, 9))),
    line('M18 48 L76 74 M30 48 L76 63 M42 48 L76 85', C.grey, 1), frame(66, 50, 52, 60), frame(8, 18, 52, 32)),
  'elbas.multimeter': all(g('translate(42 62)', rect(-24, -42, 48, 84, C.yellow, 7, C.ink, 2), display(-17, -34, 34, 18, '218'), circle(0, 10, 13, C.dark, C.ink, 1.4), line('M0 10 L8 2', C.white, 2.4),
    ...[-16, 0, 16].map((x) => circle(x, 33, 3, x < 0 ? C.black : x > 0 ? C.red : C.dark, C.ink, 1))), ring(42, 62, 50),
    path('M58 95 C76 110 92 104 98 86', 'none', C.red, 2.4), path('M26 95 C40 112 84 112 92 98', 'none', C.dark, 2.4), resistor(96, 78, 0.9, 70)),
  'elbas.potentiometer': all(g('translate(60 70)', rect(-26, -12, 52, 26, C.dark, 4, C.ink, 1.8), circle(0, 0, 18, '#5a5d68', C.ink, 1.6), rect(-6, -40, 12, 40, C.silver, 2, C.ink, 1.6),
    line('M-14 -40 L14 -40', C.ink, 1), ...[-16, 0, 16].map((x) => line(`M${x} 14 L${x} 34`, C.silver, 3))), path('M38 18 A26 18 0 0 1 82 18', 'none', HL, 3), path('M82 18 L76 12 M82 18 L74 22', 'none', HL, 3), ring(60, 62, 40)),
  'elbas.reglage': all(wall(), rect(10, 40, 100, 52, C.white, 6, C.ink, 2), line(range(6).map((i) => `M${20 + i * 12} 52 L${20 + i * 12} 82`).join(' '), C.grey2, 2.6),
    rect(88, 48, 14, 38, C.grey2, 4, C.ink, 1.4), ...range(5).map((i) => line(`M84 ${52 + i * 8} L86 ${52 + i * 8}`, C.ink, 1)), rect(86, 54, 18, 10, C.dark, 3, C.ink, 1.4), arrow(112, 82, 112, 54, HL, 3), frame(82, 44, 26, 46), heat(28, 36, 4, C.red, 14)),
  'elbas.värmeutveckling': all(rect(0, 70, 120, 42, PCB, 0, null), line('M0 70 L120 70', C.ink, 1.4), wire('M4 84 L34 84 M86 84 L116 84', C.silver, 2.4), resistor(60, 84, 1.6), arrow(8, 98, 30, 98, BLUE, 2.4),
    heat(44, 62, 4, C.red, 10), circle(60, 76, 30, 'rgba(214,69,69,0.12)', null), g('translate(100 36)', rect(-4, -22, 8, 34, C.white, 4, C.ink, 1.4), circle(0, 14, 7, C.red, C.ink, 1.4), rect(-1.5, -14, 3, 26, C.red, 1, null)), frame(30, 22, 60, 76)),
  'elbas.varmgång': all(wall(), socket(56, 58, 24), path('M36 40 C30 50 30 70 38 80 C46 86 70 86 76 78', 'none', SCORCH, 6), ellipse(48, 72, 8, 5, 'rgba(122,74,42,0.5)', null), plugSide(56, 58, C.white),
    heat(70, 30, 3, C.red, 8), smoke(40, 30), warn(98, 22, 1.1), ring(56, 58, 34)),
  // ── 3913 Kondensatorer ──
  'elbas.ladda-ur': all(capacitor(32, 52, 2), rect(26, 30, 6, 40, C.white, 1, C.ink, 1), rect(26, 62, 6, 8, HL, 0, null), wire('M26 102 L26 108 L94 108 L94 90 M38 102 L38 104 L60 104', C.dark, 2.2), resistor(80, 90, 0.8, 90),
    bulb(94, 50, true, 9), wire('M94 60 L94 80', C.dark, 2.2), ...[[52, 104], [70, 104], [94, 70]].map(([x, y], i) => waIn(`elbas-laddaur-${i}`, -12, 0, el(x!, y!, 2.6))), arrow(48, 92, 72, 92, HL, 3), greyed(...[0, 1, 2].map((i) => el(14, 30 + i * 10, 2.2)))),
  'elbas.farad': all(capacitor(78, 52, 2.6), ...range(6).map((i) => T(70 + (i % 2) * 14, 36 + Math.floor(i / 2) * 14, '+', 10, C.red)), frame(52, 6, 54, 102), greyed(capacitor(24, 76, 1), T(24, 70, '+', 8, C.red))),
  'elbas.superkondensator': all(rect(0, 0, 120, 112, '#e8f1f8', 0, null), ground(), rect(8, 54, 84, 44, C.green, 8, C.ink, 2), ...range(4).map((i) => rect(14 + i * 18, 62, 14, 14, '#bfe3f5', 2, C.ink, 1.2)),
    circle(24, 100, 7, C.dark, C.ink, 1.4), circle(76, 100, 7, C.dark, C.ink, 1.4), rect(20, 42, 44, 12, C.dark, 2, C.ink, 1.4), line('M38 44 L38 52 M46 44 L46 52', C.white, 2.4), frame(16, 38, 52, 20),
    line('M60 42 L80 22 L100 22', C.dark, 2.4), rect(98, 6, 6, 106, C.grey, 1, C.ink, 1.4), rect(84, 14, 22, 8, C.grey2, 1, C.ink, 1.2), bolt(90, 32, 0.7)),
  'elbas.spänningstopp': all(rect(6, 14, 108, 84, C.white, 3, C.ink, 1.6), line('M10 80 L110 80', C.grey2, 1), greyed(line('M14 70 L58 70', C.dark, 2)), line('M58 70 L64 70 L68 22 L72 70 L106 70', HL, 3), ring(68, 30, 12), bolt(30, 36, 1.2), line('M14 92 L14 18', C.ink, 1)),
  // ── 3914 Spolar ──
  'elbas.lindning': all(g('translate(52 62)', circle(0, 0, 40, C.silver, C.ink, 2), circle(0, 0, 30, '#e4e8ec', C.ink, 1.4), ...range(8).map((i) => { const a = rad(i * 45); return g(`translate(${f1(Math.cos(a) * 24)} ${f1(Math.sin(a) * 24)}) rotate(${i * 45 + 90})`, rect(-6, -5, 12, 10, COPPER, 3, C.ink, 1), line('M-6 -2 L6 -2 M-6 2 L6 2', '#e9a36b', 0.8)); }), circle(0, 0, 9, C.grey, C.ink, 1.4)),
    ring(52, 62, 34), g('translate(102 92)', ellipse(0, 0, 12, 14, '#b88a5a', C.ink, 1.6), ellipse(0, 0, 4, 5, C.paper, C.ink, 1)), path('M90 88 C80 80 76 70 74 66', 'none', COPPER, 2)),
  'elbas.järnkärna': all(greyed(coil(30, 90, 64, 6, 18)), waIn('elbas-jarnkarna-1', -30, 0, rect(14, 58, 92, 12, '#7d848c', 2, C.ink, 1.8), line('M20 61 L100 61', C.silver, 1.2)), frame(10, 52, 100, 24), arrow(14, 96, 42, 96, HL, 3)),
  'elbas.relä': all(rect(34, 30, 52, 52, 'rgba(191,227,245,0.5)', 4, C.ink, 2), coil(40, 62, 66, 4, 9), rect(40, 62, 22, 8, '#7d848c', 1, C.ink, 1), line('M66 50 L82 40', C.dark, 3), circle(84, 40, 2.4, C.gold, null), circle(84, 50, 2.4, C.gold, null),
    frame(30, 26, 60, 60), batt(4, 100, 22, 10), wire('M4 100 L4 66 L40 66 M30 100 L32 100 L32 74 L40 74', C.dark, 1.6), wire('M86 40 L100 40 L100 20 M86 50 L110 50 L110 96', C.dark, 3), bulb(100, 12, true, 8), rect(102, 96, 16, 12, C.grey, 2, C.ink, 1.2),
    line('M66 22 L70 16 M74 24 L80 18', HL, 2)),
  'elbas.klicka.2': all(rect(0, 0, 120, 112, '#eef0f2', 0, null), path('M4 60 L40 52 L40 74 L4 80 Z', C.grey, C.ink, 1.6), rect(40, 50, 26, 26, C.dark, 4, C.ink, 1.8), rect(46, 56, 14, 6, C.red, 2, C.ink, 1),
    waIn('elbas-klicka-1', 16, 0, path('M66 56 L84 56 L84 70 L66 70 Z', C.silver, C.ink, 1.6), path('M84 52 L116 44 L116 82 L84 74 Z', C.grey, C.ink, 1.6)), waPulse('elbas-klicka-2', line('M60 40 L56 30 M68 38 L70 26 M76 42 L84 34 M60 86 L56 96 M70 88 L72 100', HL, 2.6)), ring(66, 63, 22)),
  'elbas.magnetlås': all(wall(), rect(24, 14, 60, 98, '#8a6a4a', 2, C.ink, 2), rect(30, 20, 48, 86, '#a07d58', 2, C.ink, 1.2), rect(36, 10, 36, 9, C.silver, 2, C.ink, 1.6), frame(32, 6, 44, 17),
    ...[0, 1, 2].map((i) => path(`M${42 + i * 12} 24 C${40 + i * 12} 30 ${44 + i * 12} 30 ${42 + i * 12} 36`, 'none', HL, 1.6)), rect(92, 54, 14, 22, C.dark, 3, C.ink, 1.6), circle(99, 62, 3, C.green, null),
    g('translate(106 90)', ellipse(0, 0, 6, 8, C.navy, C.ink, 1.4), circle(0, -6, 2, 'none', C.ink, 1)), circle(72, 64, 2.6, C.gold, C.ink, 1)),
  'elbas.lyftmagnet': all(rect(0, 0, 120, 112, '#e8f1f8', 0, null), ground(), line('M8 112 L8 10 L104 10', '#e2a33a', 6), line('M8 30 L30 10', '#e2a33a', 4), path('M110 112 L74 112 L80 100 L104 100 Z', '#8b6b4a', C.ink, 1.4),
    moving('elbas-lyftmagnet-1', '0%,25%{transform:translate(0,30px)}65%,100%{transform:translate(0,0)}', { dur: 3 }, line('M90 10 L90 34', C.dark, 2), ellipse(90, 40, 22, 7, C.dark, C.ink, 1.8), rect(68, 40, 44, 6, C.dark, 1, C.ink, 1.4),
      path('M72 46 L86 46 L84 58 L74 56 Z M88 46 L106 46 L104 54 L92 60 Z', '#9a8c7c', C.ink, 1.4), rect(78, 58, 20, 8, '#7d848c', 1, C.ink, 1.2)), ring(90, 50, 26), bolt(60, 34, 0.8)),
  'elbas.hörslinga': all(rect(0, 0, 120, 112, '#f3efe6', 0, null), path('M6 104 L114 104 L104 78 L16 78 Z', '#d9c9ad', C.ink, 1.2), path('M14 100 L106 100 L98 82 L22 82 Z', 'none', HL, 2.6),
    ...[34, 56, 78].map((x) => all(rect(x - 6, 84, 12, 8, C.red, 2, C.ink, 1), line(`M${x - 5} 92 L${x - 5} 98 M${x + 5} 92 L${x + 5} 98`, C.ink, 1.2))), person(84, 82, C.purple, 0.6), circle(88, 47, 2, C.silver, C.ink, 0.8),
    rect(8, 10, 34, 34, C.white, 3, C.ink, 1.6), ear(25, 26, 1), path('M38 34 C46 30 46 22 38 18', 'none', C.ink, 1.4), path('M88 44 C96 40 96 32 90 28', 'none', HL, 1.6), path('M90 50 C102 44 100 26 92 22', 'none', HL, 1.6)),
  // ── 3915 Dioder ──
  'elbas.diod': all(g('translate(60 36)', line('M-48 0 L48 0', C.silver, 2.6), rect(-20, -9, 40, 18, C.black, 6, C.ink, 1.6), rect(10, -9, 5, 18, C.silver, 0, null)), ring(60, 36, 28),
    arrow(14, 78, 104, 78, HL, 4), greyed(arrow(104, 100, 60, 100, C.dark, 3)), line('M56 92 L56 108', C.red, 3.4), cross(80, 100, 5)),
  'elbas.likriktare': all(sine(4, 60, 30, 10, C.grey, 2.4), rect(40, 36, 40, 48, C.white, 4, C.ink, 1.8), path('M60 42 L74 60 L60 78 L46 60 Z', 'none', C.dark, 1.6), ...[[53, 51, 45], [67, 51, 135], [67, 69, 225], [53, 69, 315]].map(([x, y, r]) => g(`translate(${x} ${y}) rotate(${r})`, path('M-3 -3 L3 0 L-3 3 Z', C.dark, null), line('M3 -3 L3 3', C.dark, 1.4))),
    frame(36, 32, 48, 56), line('M86 52 L116 52', HL, 3), arrow(90, 66, 112, 66, HL, 2.4)),
  'elbas.LED-lampa': all(circle(60, 42, 38, GLOW, null), path('M60 8 C38 8 30 26 34 40 C36 50 46 56 46 66 L74 66 C74 56 84 50 86 40 C90 26 82 8 60 8 Z', '#fffaf0', C.ink, 2),
    ...range(9).map((i) => rect(f1(48 + (i % 3) * 9), f1(24 + Math.floor(i / 3) * 9), 5, 5, C.yellow, 1, C.ink, 0.8)), rect(46, 66, 28, 18, C.white, 2, C.ink, 1.6), line('M46 71 L74 71 M46 76 L74 76', C.grey2, 1.4),
    rect(50, 84, 20, 14, C.silver, 2, C.ink, 1.6), line('M50 88 L70 90 M50 93 L70 95', C.grey, 1.2), ring(60, 50, 48)),
  'elbas.lumen': twoLights('200', '800', true),
  'elbas.dimbar': all(rect(8, 70, 20, 36, C.white, 3, C.ink, 1.6), rect(15, 74, 6, 28, C.grey2, 2, C.ink, 1), rect(12, 76, 12, 8, C.dark, 2, C.ink, 1), arrow(34, 96, 34, 76, HL, 3),
    bulb(50, 30, false, 9), bulb(78, 30, true, 9, 'rgba(242,193,78,0.2)'), bulb(104, 30, true, 9), line('M50 50 L104 50', HL, 2.6), arrow(96, 50, 108, 50, HL, 2.6), circle(50, 50, 2.4, HL, null),
    path('M48 64 L108 64 L108 56 Z', 'rgba(242,193,78,0.6)', C.ink, 1.2), frame(40, 6, 76, 64)),
  'elbas.varmvit': all(rect(0, 0, 60, 112, '#5b4a3a', 0, null), path('M30 14 L4 104 L56 104 Z', WARM, null), circle(30, 12, 6, '#fff3c4', C.ink, 1.4), rect(10, 86, 40, 18, '#c96f4a', 4, C.ink, 1.4), frame(3, 3, 54, 106),
    greyed(rect(62, 0, 58, 112, '#3a4250', 0, null), path('M90 14 L66 104 L116 104 Z', COLD, null), circle(90, 12, 6, '#f2f8ff', C.ink, 1.4))),
  'elbas.ljusslinga': all(rect(14, 10, 92, 92, '#20314f', 4, C.ink, 2), line('M60 10 L60 102 M14 56 L106 56', C.white, 3), path('M14 20 C40 34 80 34 106 20', 'none', C.dark, 1.6),
    ...range(9).map((i) => { const t = (i + 0.5) / 9; const x = 14 + t * 92; const y = 20 + 4 * 14 * t * (1 - t) * 1.0; return all(circle(f1(x), f1(y + 3), 6, 'rgba(242,193,78,0.35)', null), circle(f1(x), f1(y + 3), 3, [C.yellow, C.red, C.green][i % 3]!, C.ink, 0.8)); }),
    frame(10, 6, 100, 100), rect(8, 100, 104, 8, C.white, 1, C.ink, 1.4)),
  'elbas.blinka.2': all(rect(0, 0, 120, 112, '#2a3140', 0, null), rect(38, 40, 44, 40, C.dark, 8, C.ink, 2), rect(44, 46, 32, 28, C.red, 6, C.ink, 1.4),
    waPulse('elbas-blinka-1', circle(60, 60, 30, 'rgba(214,69,69,0.45)', null), line('M60 30 L60 18 M86 42 L96 34 M86 78 L96 86 M34 42 L24 34 M34 78 L24 86', C.red, 3)), rect(54, 80, 12, 14, C.grey, 2, C.ink, 1.4), ring(60, 60, 34)),
  // ── 3916 Transistorer ──
  'elbas.transistor': all(g('translate(56 46)', path('M-18 10 L-18 -14 C-18 -28 18 -28 18 -14 L18 10 Z', C.black, C.ink, 1.8), line('M-18 4 L18 4', C.dark, 1.2), ...[-10, 0, 10].map((x) => line(`M${x} 10 L${x} 48`, C.silver, 3))), ring(56, 42, 30),
    arrow(14, 104, 44, 104, BLUE, 2), arrow(76, 74, 76, 106, HL, 6), line('M46 94 L56 94', C.ink, 1.6)),
  'elbas.elektronik': all(rect(0, 0, 120, 112, '#eef0f2', 0, null), rect(8, 30, 104, 64, PCB, 5, C.ink, 2), line('M14 50 L40 50 L46 40 M14 80 L36 80 M80 86 L106 86 L106 70', '#7fc49a', 1.6), chip(40, 64, 0.8), resistor(84, 44, 0.7), capacitor(96, 66, 0.7), led(24, 70, C.red, true, 0.7),
    rect(70, 70, 16, 16, C.dark, 1, C.ink, 1), frame(4, 26, 112, 72), g('translate(22 14)', rect(-8, -10, 16, 20, C.dark, 2, C.ink, 1.2), rect(-6, -8, 12, 14, '#bfe3f5', 1, null))),
  'elbas.mikrochip': all(circle(78, 44, 34, C.white, C.ink, 2), ...range(5).map((i) => line(`M${54 + i * 10} 22 L${54 + i * 10} 66 M48 ${24 + i * 10} L108 ${24 + i * 10}`, '#9ab0c4', 1)), rect(64, 30, 28, 28, '#c9a64a', 2, C.ink, 1.2),
    line('M54 70 L40 86', C.ink, 4), chip(24, 92, 0.55), line('M4 108 C14 100 22 98 26 96 M6 98 C14 94 18 92 22 90', C.grey, 2.4), path('M56 66 L28 88 L22 84', 'none', C.grey, 1.2), ring(24, 92, 16)),
  'elbas.nanometer': all(path('M4 30 C40 26 80 34 116 28 L116 58 C80 64 40 56 4 60 Z', '#6b4b33', C.ink, 1.6), line('M10 44 C50 40 80 48 112 42', '#8a6748', 1.4), circle(70, 86, 20, C.white, C.ink, 2), line('M84 100 L100 112', C.ink, 4),
    ...range(6).map((i) => line(`M${58 + i * 5} 76 L${58 + i * 5} 96`, C.gold, 1.2)), ring(70, 86, 23), line('M58 62 L58 70 M62 62 L62 70', HL, 1.6), arrow(20, 74, 20, 64, C.grey, 2), arrow(20, 14, 20, 26, C.grey, 2)),
  'elbas.chipbrist': all(rect(0, 0, 120, 112, '#eef0f2', 0, null), ground(), path('M8 92 L18 74 L58 72 L72 86 L76 96 L8 96 Z', '#9aa9bd', C.ink, 1.6), circle(22, 98, 7, C.dark, C.ink, 1.4), circle(62, 98, 7, C.dark, C.ink, 1.4), rect(30, 78, 16, 8, C.white, 1, C.ink, 1, ),
    rect(80, 40, 34, 26, C.tan, 2, C.ink, 1.6), ...[0, 1].map((i) => rect(86 + i * 14, 46, 10, 10, 'none', 1, C.ink, 1.2)).map((s) => s.replace('stroke-width="1.2"', 'stroke-width="1.2" stroke-dasharray="2 2"')), frame(76, 36, 42, 34),
    T(97, 30, '0', 14, HL), line('M38 78 L84 58', C.grey, 1, '3 3')),
  'elbas.chipfabrik': all(rect(0, 0, 120, 112, '#f2f6fa', 0, null), ground(), rect(6, 54, 50, 58, C.grey2, 2, C.ink, 1.6), path('M6 54 L20 44 L34 54 L48 44 L56 50 L56 54 Z', C.grey, C.ink, 1.4), ...range(3).map((i) => rect(12 + i * 15, 70, 10, 10, '#bfe3f5', 1, C.ink, 1)),
    g('translate(88 112)', line('M-5 0 L-4 -22 M5 0 L4 -22', C.white, 7), rect(-11, -52, 22, 32, C.white, 6, C.ink, 1.6), circle(0, -62, 10, C.white, C.ink, 1.6), rect(-6, -66, 12, 6, '#bfe3f5', 2, C.ink, 1)),
    circle(68, 50, 14, '#c9ced4', C.ink, 1.6), line('M58 44 L78 44 M56 50 L80 50 M58 56 L78 56 M62 40 L62 60 M68 36 L68 64 M74 40 L74 60', '#8fa1b3', 0.8), line('M80 58 L88 64', C.white, 4), frame(4, 34, 112, 76)),
  'elbas.transistorradio': all(rect(16, 36, 88, 60, C.red, 8, C.ink, 2), path('M30 36 C30 18 90 18 90 36', 'none', C.dark, 4), circle(42, 68, 18, C.dark, C.ink, 1.6), ...range(4).map((i) => line(`M${30 + i * 0} ${58 + i * 6} L${54} ${58 + i * 6}`, '#5a5d68', 1.6)),
    rect(66, 50, 30, 12, '#f4e9c8', 2, C.ink, 1.2), line('M70 56 L92 56', C.ink, 0.8), line('M80 52 L80 60', HL, 1.6), circle(80, 78, 7, C.silver, C.ink, 1.4), ring(60, 64, 50),
    g('translate(100 18)', path('M0 6 L0 -10 L8 -12 L8 4', 'none', C.navy, 2), ellipse(-2.5, 6, 3.4, 2.6, C.navy, null), ellipse(5.5, 4, 3.4, 2.6, C.navy, null))),
  // ── 3917 Kopplingsscheman ──
  'elbas.fas.2': all(wire('M0 60 L50 60', C.grey, 18), path('M50 52 C70 48 90 28 112 26', 'none', '#a0673d', 6), path('M50 60 C72 60 92 60 112 60', 'none', BLUE, 6), path('M50 68 C70 72 90 92 112 94', 'none', '#b6c94a', 6), path('M60 72 L64 75 M74 78 L78 82 M88 86 L92 90 M102 91 L106 94', 'none', C.yellow, 4),
    rect(108, 22, 10, 8, COPPER, 1, C.ink, 1), ring(100, 28, 13), bolt(92, 12, 0.8), greyed(rect(108, 56, 10, 8, COPPER, 1, C.ink, 1), rect(108, 90, 10, 8, COPPER, 1, C.ink, 1))),
  'elbas.krokodilklämma': all(batt(10, 86, 56, 22), g('translate(84 50) rotate(30)', path('M-20 -4 L10 -8 L10 -2 L-20 2 Z', C.red, C.ink, 1.6), path('M-20 6 L10 2 L10 8 L-20 10 Z', C.red, C.ink, 1.6), line('M-20 -1 l3 3 l3 -3 l3 3 l3 -3 l3 3 l3 -3', C.silver, 1.2), circle(4, 3, 3, C.silver, C.ink, 1)),
    path('M98 60 C110 70 112 90 104 106', 'none', C.red, 3), ring(72, 64, 22)),
  'elbas.skala-av': all(wire('M4 60 L58 60', '#5aa0d8', 12), rect(58, 55, 52, 10, COPPER, 3, C.ink, 1.4), line('M62 58 L106 58 M62 62 L106 62', '#e9a36b', 0.9),
    waIn('elbas-skalaav-1', -30, 0, rect(84, 54, 22, 12, '#5aa0d8', 3, C.ink, 1.6)), arrow(70, 84, 106, 84, HL, 3.4), g('translate(58 30)', path('M-18 -16 L0 -2 L-4 2 Z', C.red, C.ink, 1.4), path('M18 -16 L0 -2 L4 2 Z', C.red, C.ink, 1.4), circle(0, 0, 3, C.silver, C.ink, 1)), ring(84, 60, 20)),
  'elbas.eltejp': all(wire('M4 70 L116 70', C.dark, 10), ...range(5).map((i) => rect(44 + i * 6, 62, 6, 16, C.black, 1, '#555', 1)), path('M70 62 C80 50 86 40 88 36', 'none', C.black, 6),
    g('translate(92 30)', circle(0, 0, 18, C.black, C.ink, 1.8), circle(0, 0, 8, C.paper, C.ink, 1.4)), frame(40, 56, 40, 28), greyed(wire('M4 98 L116 98', C.dark, 6))),
  'elbas.lödkolv': all(g('translate(62 58) rotate(-25)', rect(-50, -7, 40, 14, C.red, 6, C.ink, 1.8), rect(-12, -4, 36, 8, C.silver, 2, C.ink, 1.4), path('M24 -3 L40 0 L24 3 Z', '#7d848c', C.ink, 1.2), circle(40, 0, 5, 'rgba(228,87,46,0.4)', null),
    path('M-50 0 C-60 0 -64 6 -66 14', 'none', C.dark, 2.4)), ring(92, 44, 12), smoke(96, 32), rect(16, 100, 50, 8, C.dark, 2, C.ink, 1.4), path('M24 100 C30 88 50 88 58 100', 'none', C.silver, 2), rect(0, 108, 120, 4, C.tan, 0, null)),
  'elbas.kopplingsdosa': all(rect(0, 0, 120, 30, '#efe8dc', 0, null), line('M0 30 L120 30', C.ink, 1.4), circle(60, 66, 34, C.white, C.ink, 2), circle(60, 66, 28, '#f1f1ee', C.grey, 1),
    wire('M26 54 C40 58 46 62 52 66 M30 84 C40 78 46 72 52 70 M94 58 C82 62 76 66 70 68', C.dark, 3), wire('M52 66 L56 68 M70 68 L64 68', '#a0673d', 3), rect(52, 62, 14, 10, C.yellow, 2, C.ink, 1.2),
    path('M28 98 L92 98', 'none', C.grey2, 1), ring(60, 66, 40), path('M88 26 L104 10', 'none', C.grey, 2)),
  'elbas.byggsats': all(path('M10 56 L110 56 L104 104 L16 104 Z', C.tan, C.ink, 2), path('M10 56 L24 36 L96 36 L110 56', 'none', C.ink, 1.6), rect(18, 64, 44, 32, C.white, 2, C.ink, 1.4), line('M24 72 L48 72 L48 88 L24 88 Z M30 72 L30 66', C.ink, 1.2),
    resistor(82, 70, 0.6), led(96, 80, C.red, false, 0.6), capacitor(76, 88, 0.5), rect(88, 92, 14, 6, PCB, 1, C.ink, 1), frame(6, 32, 108, 76), circle(36, 80, 3, 'none', C.ink, 1)),
  'elbas.felkoppling': all(rect(6, 14, 64, 80, C.white, 3, C.ink, 1.6), wire('M16 30 L60 30 L60 80 L16 80 Z', C.dark, 2), line('M30 26 L30 34 M36 28 L36 32', C.dark, 2), bulb(60, 56, false, 7),
    path('M16 50 L60 64 M16 64 L60 50', 'none', HL, 3), cross(38, 57, 7, C.red), frame(2, 10, 72, 88),
    greyed(rect(80, 58, 36, 40, C.white, 2, C.ink, 1.2), wire('M86 66 L110 66 L110 92 L86 92 Z', C.dark, 1.4), bulb(110, 78, true, 5))),
};
