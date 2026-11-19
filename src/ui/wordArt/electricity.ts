/**
 * Matematik & naturvetenskap → Fysik → Elektricitet & magnetism, 3341–3347 (0.50): electric charge, current
 * and voltage, resistance and conductors, electric fields, magnetic fields, electromagnetic induction and
 * electric circuits.
 * Recurring signs: the part that the word names is orange (arrow, ring, bracket, wire or object) and a grey
 * reference shows what the word is not. Positive charges are red rings with +, negative charges blue rings
 * with −, electrons small blue dots. Magnets are red at the north end and blue at the south end. Words in a
 * contrast pair share one layout where only the marked part differs: attrahera/repellera (two charge pairs),
 * ström/spänning (battery and lamp loop: moving electrons or a bracket over the battery), pluspol/minuspol
 * (one battery, ring at either end), ledare/isolator (one cable: copper core or plastic sheath),
 * nordpol/sydpol (one bar magnet, ring at either end), seriekoppling/parallellkoppling (battery and two
 * lamps: one path or two) and grenuttag/överbelastning (one power strip: two plugs or full and hot).
 * Digits, maths signs and the variable names U, R, I, F, k, q and r only; no words, no brands.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, star, waIn, waPulse, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const BLUE = '#3f7fc8';
const PINK = '#f9d6d6';
const ICE = '#d7e6f7';
const COPPER = '#c8743a';
const GLOW = 'rgba(242,193,78,0.35)';
const SOFT = 'rgba(228,87,46,0.16)';
const f1 = (n: number) => +n.toFixed(1);
const rad = (d: number) => (d * Math.PI) / 180;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const wire = (d: string, col: string = C.dark, sw = 2.4) => line(d, col, sw);
/** A charge: red ring with + or blue ring with −. */
const chg = (x: number, y: number, plus: boolean, r = 8) => all(circle(x, y, r, plus ? PINK : ICE, plus ? C.red : BLUE, 1.8),
  line(plus ? `M${f1(x - r * 0.5)} ${y} L${f1(x + r * 0.5)} ${y} M${x} ${f1(y - r * 0.5)} L${x} ${f1(y + r * 0.5)}` : `M${f1(x - r * 0.5)} ${y} L${f1(x + r * 0.5)} ${y}`, plus ? C.red : BLUE, 2.2));
const el = (x: number, y: number, r = 2.6) => circle(x, y, r, BLUE, C.ink, 0.8);
const minus = (x: number, y: number, s = 3, col: string = BLUE) => line(`M${x - s} ${y} L${x + s} ${y}`, col, 1.8);
const plus = (x: number, y: number, s = 3, col: string = C.red) => line(`M${x - s} ${y} L${x + s} ${y} M${x} ${y - s} L${x} ${y + s}`, col, 1.8);
const zig = (x1: number, y1: number, x2: number, y2: number, col: string = C.gold, sw = 2.4) => {
  const dx = (x2 - x1) / 4, dy = (y2 - y1) / 4, nx = -dy * 0.45, ny = dx * 0.45;
  return line(`M${x1} ${y1} L${f1(x1 + dx + nx)} ${f1(y1 + dy + ny)} L${f1(x1 + 2 * dx - nx)} ${f1(y1 + 2 * dy - ny)} L${f1(x1 + 3 * dx + nx)} ${f1(y1 + 3 * dy + ny)} L${x2} ${y2}`, col, sw);
};
const bolt = (x: number, y: number, s = 1, col: string = C.yellow) => g(`translate(${x} ${y}) scale(${s})`, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', col, C.ink, 1.4));
const heat = (x: number, y: number, n = 3, col: string = C.red, gap = 8) => line(range(n).map((i) => `M${x + i * gap} ${y} c-3 -4 3 -6 0 -10 c-3 -4 3 -6 0 -10`).join(' '), col, 1.8);
/** Battery lying down from x to x+w, centre y; + knob on the right. */
const batt = (x: number, y: number, w = 40, h = 16) => all(rect(x, y - h / 2, w * 0.68, h, C.dark, 2, C.ink, 1.6), rect(x + w * 0.68, y - h / 2, w * 0.32, h, C.gold, 2, C.ink, 1.6),
  rect(x + w, y - h * 0.2, 4, h * 0.4, C.silver, 1, C.ink, 1.2), plus(x + w * 0.84, y, h * 0.2, C.ink), minus(x + w * 0.14, y, h * 0.2, C.white));
/** Light bulb (glass up) at (x, y). */
const bulb = (x: number, y: number, lit = true, r = 10) => all(lit ? circle(x, y, r + 7, GLOW, null) : '', lit ? line(range(7).map((i) => { const a = rad(-90 + (i - 3) * 30); return `M${f1(x + Math.cos(a) * (r + 3))} ${f1(y + Math.sin(a) * (r + 3))} L${f1(x + Math.cos(a) * (r + 8))} ${f1(y + Math.sin(a) * (r + 8))}`; }).join(' '), C.gold, 2) : '',
  circle(x, y, r, lit ? C.yellow : C.white, C.ink, 1.6), rect(x - r * 0.45, y + r - 1, r * 0.9, r * 0.6, C.grey, 1, C.ink, 1.2), path(`M${x - 3} ${y + 4} L${x - 3} ${y} C${x - 3} ${y - 4} ${x + 3} ${y - 4} ${x + 3} ${y} L${x + 3} ${y + 4}`, 'none', C.dark, 1));
/** Bar magnet from x to x+w at centre y, rotated rot degrees; red north half first (left) unless flip. */
const bar = (x: number, y: number, w: number, h: number, rot = 0) => g(`rotate(${rot} ${x + w / 2} ${y})`, rect(x, y - h / 2, w / 2, h, C.red, 2, C.ink, 1.6), rect(x + w / 2, y - h / 2, w / 2, h, BLUE, 2, C.ink, 1.6));
const clip = (x: number, y: number, rot = 0, col: string = C.silver) => g(`translate(${x} ${y}) rotate(${rot})`, path('M-3 -8 L-3 6 C-3 9 3 9 3 6 L3 -6 C3 -8 1 -8 1 -6 L1 4', 'none', C.ink, 2.6), path('M-3 -8 L-3 6 C-3 9 3 9 3 6 L3 -6 C3 -8 1 -8 1 -6 L1 4', 'none', col, 1.4));
/** Copper coil, horizontal, from x1 to x2 at centre y. */
const coil = (x1: number, x2: number, y: number, n: number, h = 14, col: string = COPPER, sw = 2.4) => {
  const step = (x2 - x1) / n;
  return all(...range(n).map((i) => all(ellipse(f1(x1 + step * (i + 0.5)), y, f1(step * 0.55), h, 'none', C.ink, sw + 1.4), ellipse(f1(x1 + step * (i + 0.5)), y, f1(step * 0.55), h, 'none', col, sw))));
};
/** Small round gauge with a needle; a = needle angle (0 = up). */
const gauge = (x: number, y: number, r: number, a: number, col: string = HL) => all(circle(x, y, r, C.white, C.ink, 1.8), path(`M${x - r * 0.7} ${y - r * 0.2} A${r * 0.75} ${r * 0.75} 0 0 1 ${x + r * 0.7} ${y - r * 0.2}`, 'none', C.grey, 1.2),
  line(`M${x} ${y + r * 0.3} L${f1(x + Math.sin(rad(a)) * r * 0.8)} ${f1(y + r * 0.3 - Math.cos(rad(a)) * r * 0.8)}`, col, 2.2), circle(x, y + r * 0.3, 1.8, C.ink, null));
/** Simple side-view person, feet at (x, y); arm reaches to (ax, ay) relative to the shoulder. */
const kid = (x: number, y: number, top: string, ax = 14, ay = 10, s = 1, hairUp = false) => g(`translate(${x} ${y}) scale(${s})`,
  line('M-4 0 L-3 -24 M4 0 L3 -24', C.navy, 6), rect(-8, -50, 16, 28, top, 5, C.ink, 1.6), line(`M0 -46 L${ax} ${-46 + ay}`, C.ink, 6.2), line(`M0 -46 L${ax} ${-46 + ay}`, C.skin, 4),
  hairUp ? line(range(9).map((i) => { const a = rad(-160 + i * 17.5); return `M${f1(Math.cos(a) * 7)} ${f1(-60 + Math.sin(a) * 7)} L${f1(Math.cos(a) * 19)} ${f1(-60 + Math.sin(a) * 19)}`; }).join(' '), C.hair, 2) : path('M-8 -61 C-8 -72 8 -72 8 -61 C4 -65 -4 -65 -8 -61 Z', C.hair, null),
  circle(0, -60, 8, C.skin, C.ink, 1.6), circle(3, -61, 1, C.ink, null));
const house = (x: number, y: number, s = 1, col: string = C.white) => g(`translate(${x} ${y}) scale(${s})`, rect(-9, -12, 18, 12, col, 1, C.ink, 1.4), path('M-11 -12 L0 -21 L11 -12 Z', C.red, C.ink, 1.4), rect(-3, -6, 6, 6, C.yellow, 0, C.ink, 1));
const pylon = (x: number, y: number, h = 44, col: string = C.grey) => all(line(`M${x - 8} ${y} L${x} ${y - h} L${x + 8} ${y} M${x - 5} ${y - h * 0.35} L${x + 5} ${y - h * 0.35} M${x - 10} ${y - h * 0.75} L${x + 10} ${y - h * 0.75} M${x - 6} ${y - h * 0.55} L${x + 6} ${y - h * 0.55}`, col, 2));
const socketFace = (x: number, y: number, r = 7) => all(circle(x, y, r, C.white, C.ink, 1.4), circle(x - r * 0.35, y, 1.3, C.ink, null), circle(x + r * 0.35, y, 1.3, C.ink, null));
const plug = (x: number, y: number, col: string = C.dark) => all(circle(x, y, 6.5, col, C.ink, 1.4), line(`M${x} ${y - 6} L${x} ${y - 16}`, col, 3));
const nail = (x1: number, x2: number, y: number) => all(path(`M${x1} ${y - 3} L${x2 - 6} ${y - 2} L${x2} ${y} L${x2 - 6} ${y + 2} L${x1} ${y + 3} Z`, C.silver, C.ink, 1.4), rect(x1 - 3, y - 6, 3, 12, C.grey, 1, C.ink, 1.2));
const chip = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ...range(5).map((i) => line(`M${-12 + i * 6} -14 L${-12 + i * 6} -18 M${-12 + i * 6} 14 L${-12 + i * 6} 18`, C.silver, 2)), rect(-16, -14, 32, 28, C.black, 2, C.ink, 1.6), circle(-10, -8, 2, C.dark, null));
const resistor = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, line('M-26 0 L26 0', C.silver, 2), rect(-14, -6, 28, 12, C.beige, 5, C.ink, 1.6),
  rect(-9, -6, 3, 12, C.brown, 0, null), rect(-3, -6, 3, 12, C.black, 0, null), rect(3, -6, 3, 12, C.red, 0, null), rect(9, -6, 2, 12, C.gold, 0, null));
const led = (x: number, y: number, col: string = C.red, lit = true, s = 1) => g(`translate(${x} ${y}) scale(${s})`, lit ? circle(0, -8, 13, 'rgba(214,69,69,0.22)', null) : '', line('M-3 4 L-3 22 M3 4 L3 18', C.silver, 2),
  path('M-6 4 L-6 -8 C-6 -16 6 -16 6 -8 L6 4 Z', col, C.ink, 1.4), rect(-8, 2, 16, 3, col, 1, C.ink, 1.2), path('M-3 -10 C-3 -13 0 -14 1 -14', 'none', 'rgba(255,255,255,0.7)', 1.4));
const capacitor = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M-3 10 L-3 24 M3 10 L3 24', C.silver, 2), rect(-8, -14, 16, 26, BLUE, 4, C.ink, 1.6), rect(3, -14, 4, 26, '#9cc0e8', 0, null), ellipse(0, -14, 8, 2.4, C.silver, C.ink, 1.2));
const sun = (x: number, y: number, r: number) => all(...range(12).map((i) => { const a = rad(i * 30); return line(`M${f1(x + Math.cos(a) * (r + 3))} ${f1(y + Math.sin(a) * (r + 3))} L${f1(x + Math.cos(a) * (r + 9))} ${f1(y + Math.sin(a) * (r + 9))}`, C.gold, 2.4); }), circle(x, y, r, C.yellow, C.ink, 1.6));
const earth = (x: number, y: number, r: number) => all(circle(x, y, r, '#8cc7e8', C.ink, 1.6), path(`M${x - r * 0.6} ${y - r * 0.3} C${x - r * 0.2} ${y - r * 0.6} ${x + r * 0.1} ${y - r * 0.1} ${x - r * 0.1} ${y + r * 0.3} C${x - r * 0.4} ${y + r * 0.5} ${x - r * 0.7} ${y + r * 0.1} ${x - r * 0.6} ${y - r * 0.3} Z M${x + r * 0.3} ${y + r * 0.2} C${x + r * 0.6} ${y} ${x + r * 0.8} ${y + r * 0.4} ${x + r * 0.5} ${y + r * 0.6} Z`, C.green, null));

// ── Shared layouts ───────────────────────────────────────────────────
/** Two pairs of charges: the marked pair on top, the other pair greyed below. */
const pairs = (attract: boolean) => {
  const att = (y: number, col: string, mv = false) => all(mv ? waIn('b4-elm-attrahera-1', -12, 0, chg(26, y, true, 11)) : chg(26, y, true, 11), mv ? waIn('b4-elm-attrahera-2', 12, 0, chg(94, y, false, 11)) : chg(94, y, false, 11), arrow(40, y, 54, y, col, 3.4), arrow(80, y, 66, y, col, 3.4));
  const rep = (y: number, col: string, mv = false) => all(mv ? waIn('b4-elm-repellera-1', 12, 0, chg(40, y, false, 11)) : chg(40, y, false, 11), mv ? waIn('b4-elm-repellera-2', -12, 0, chg(80, y, false, 11)) : chg(80, y, false, 11), arrow(28, y, 8, y, col, 3.4), arrow(92, y, 112, y, col, 3.4));
  return attract ? all(rect(4, 10, 112, 50, C.white, 6, HL, 2), att(35, HL, true), greyed(rep(88, C.grey)))
    : all(rect(4, 10, 112, 50, C.white, 6, HL, 2), rep(35, HL, true), greyed(att(88, C.grey)));
};
/** Battery at the bottom and a lamp at the top of a rectangular loop. */
const loop = (mode: 'current' | 'voltage') => {
  const w = mode === 'current' ? HL : C.dark;
  return all(wire('M60 26 L18 26 L18 92 L40 92 M84 92 L102 92 L102 26 L60 26', w, mode === 'current' ? 3 : 2.4), bulb(60, 20, true, 10), batt(40, 92, 40, 18),
    mode === 'current' ? all(...[[18, 44], [18, 66], [30, 26], [90, 26], [102, 50], [102, 72], [92, 92], [28, 92]].map(([x, y]) => el(x!, y!, 3.2)),
      arrow(102, 40, 102, 58, HL, 2.6), arrow(36, 26, 22, 26, HL, 2.6), arrow(18, 64, 18, 82, HL, 2.6), arrow(88, 92, 98, 92, HL, 2.6))
      : all(line('M38 74 L38 66 L86 66 L86 74', HL, 3), arrow(48, 66, 40, 66, HL, 2.6), arrow(76, 66, 84, 66, HL, 2.6), rect(46, 50, 30, 14, C.white, 3, HL, 2), T(61, 61, '1,5', 10, HL)));
};
/** One battery; ring around the plus end or the minus end. */
const poles = (plusEnd: boolean) => all(rect(16, 46, 60, 30, C.dark, 4, C.ink, 2), rect(76, 46, 26, 30, C.gold, 4, C.ink, 2), rect(102, 54, 7, 14, C.silver, 2, C.ink, 1.6),
  plus(90, 61, 6, C.ink), minus(28, 61, 6, C.white),
  plusEnd ? all(ring(100, 61, 16), arrow(100, 104, 100, 82, HL, 3.4), greyed(ring(16, 61, 12))) : all(ring(16, 61, 16), arrow(16, 104, 16, 82, HL, 3.4), greyed(ring(104, 61, 12))));
/** A cable with a stripped end: copper core (conductor) or plastic sheath (insulator) marked. */
const cable = (core: boolean) => {
  const sheath = path('M6 46 L84 46 C90 46 90 76 84 76 L6 76 Z', '#5aa0d8', core ? C.ink : HL, core ? 1.6 : 3);
  const copper = rect(84, 55, 30, 12, COPPER, 3, core ? HL : C.ink, core ? 2.6 : 1.4);
  return all(sheath, path('M84 46 C78 46 78 76 84 76', 'none', '#3b7fb8', 1.6), copper, line('M90 58 L112 58 M90 64 L112 64', '#e9a36b', 1),
    core ? all(...[92, 100, 108].map((x) => el(x, 61, 2.4)), arrow(90, 88, 116, 88, HL, 3), ...[20, 40, 60].map((x) => greyed(el(x, 61, 2.4))))
      : all(...[24, 48, 72].map((x) => all(arrow(x, 58, x, 36, C.grey, 2), line(`M${x - 6} 44 L${x + 6} 44`, HL, 3))), ...[24, 48, 72].map((x) => line(`M${x - 4} 24 L${x + 4} 32 M${x + 4} 24 L${x - 4} 32`, HL, 2.4)), greyed(...[92, 100, 108].map((x) => el(x, 61, 2.4)))));
};
/** One bar magnet; ring around the north (red) or south (blue) end; compass needle points the same way. */
const magnetEnd = (north: boolean) => all(bar(14, 62, 92, 26), north ? all(ring(24, 62, 18), arrow(24, 106, 24, 84, HL, 3.4)) : all(ring(96, 62, 18), arrow(96, 106, 96, 84, HL, 3.4)),
  g('translate(60 22)', circle(0, 0, 13, C.white, C.ink, 1.6), path('M0 0 L-10 -2 L0 -4 Z', north ? C.red : C.grey2, C.ink, 0.8), path('M0 0 L10 -2 L0 -4 Z', north ? C.grey2 : BLUE, C.ink, 0.8)),
  north ? clip(26, 86, 10) : clip(94, 86, -10));
/** Battery and two lamps: in one row (series) or on two branches (parallel). */
const twoLamps = (series: boolean) => series
  ? all(wire('M18 96 L18 30 L102 30 L102 96 L84 96 M40 96 L18 96', HL, 3), bulb(44, 24, true, 9), bulb(76, 24, true, 9), batt(40, 96, 40, 16), waIn('b4-elm-seriekoppling-1', -6, 0, arrow(56, 30, 64, 30, HL, 2.4)), waIn('b4-elm-seriekoppling-2', 0, -8, arrow(102, 50, 102, 66, HL, 2.4)))
  : all(wire('M18 96 L18 22 L102 22 L102 96 L84 96 M40 96 L18 96 M18 56 L102 56', HL, 3), bulb(60, 16, true, 8), bulb(60, 50, true, 8), batt(40, 96, 40, 16),
    waIn('b4-elm-parallellkoppling-1', -8, 0, arrow(30, 22, 44, 22, HL, 2.4)), waIn('b4-elm-parallellkoppling-2', -8, 0, arrow(30, 56, 44, 56, HL, 2.4)), circle(18, 56, 3, C.ink, null), circle(102, 56, 3, C.ink, null));
/** Power strip with sockets; two plugs (normal) or full with an extra strip, hot cable and smoke. */
const strip = (over: boolean) => all(rect(0, 0, 120, 112, '#f3efe6', 0, null), rect(102, 70, 16, 26, C.white, 3, C.ink, 1.4), socketFace(110, 83, 6),
  path('M108 83 C96 83 96 104 80 104 L20 104', 'none', over ? C.red : C.dark, over ? 3.4 : 2.4),
  rect(10, 80, 72, 18, C.white, 5, C.ink, 1.8), ...[22, 38, 54, 70].map((x) => socketFace(x, 89, 6)),
  over ? all(...[22, 38, 54, 70].map((x, i) => all(plug(x, 89, [C.dark, C.white, C.dark, C.yellow][i]), line(`M${x} 73 C${x} 60 ${x + (i - 1.5) * 10} 50 ${x + (i - 1.5) * 12} 40`, C.dark, 2))),
    rect(8, 28, 44, 12, C.white, 4, C.ink, 1.4), ...[18, 30, 42].map((x) => plug(x, 34, C.dark)), heat(86, 100, 3, C.red, 7), path('M30 26 C24 18 34 14 28 6 M40 26 C34 18 44 14 38 6', 'none', C.grey, 3),
    waPulse('b4-elm-overbelastning-1', star(108, 50, 8, C.yellow), T(108, 54, '!', 10, HL)), rect(4, 74, 84, 30, 'none', 8, HL, 2.6))
    : all(plug(22, 89, C.dark), plug(54, 89, C.white), line('M22 73 C22 60 14 52 10 44 M54 73 C54 60 60 52 66 44', C.dark, 2), rect(4, 74, 84, 30, 'none', 8, HL, 2.6)));

export const ELECTRICITY_MOTIFS: Record<string, Svg> = {
  // ── 3341 Elektrisk laddning ─────────────────────────────────────
  'elm.statisk-elektricitet': all(rect(0, 0, 120, 112, '#eef0f2', 0, null), g('translate(60 72)', path('M-34 40 C-34 20 -20 14 0 14 C20 14 34 20 34 40 Z', C.purple, C.ink, 1.8), circle(0, -10, 20, C.skin, C.ink, 2),
      line(range(13).map((i) => { const a = rad(-170 + i * 13.3); return `M${f1(Math.cos(a) * 19)} ${f1(-10 + Math.sin(a) * 19)} L${f1(Math.cos(a) * 46)} ${f1(-10 + Math.sin(a) * 46)}`; }).join(' '), C.hair, 2.4),
      circle(-7, -12, 2, C.ink, null), circle(7, -12, 2, C.ink, null), path('M-6 0 C-2 4 2 4 6 0', 'none', C.ink, 1.6)),
    ...[[18, 30], [100, 26], [30, 12], [88, 10]].map(([x, y]) => minus(x!, y!, 4, BLUE)), zig(10, 50, 20, 40, C.gold, 2), zig(110, 50, 100, 40, C.gold, 2)),
  'elm.ballong': all(rect(0, 0, 120, 112, '#eaf5fb', 0, null), path('M60 82 C56 92 64 100 58 110', 'none', C.ink, 1.4), ellipse(60, 46, 26, 32, C.red, C.ink, 2), path('M56 78 L64 78 L60 84 Z', C.red, C.ink, 1.4),
    path('M46 30 C48 24 54 20 58 20', 'none', 'rgba(255,255,255,0.7)', 3)),
  'elm.attrahera': pairs(true),
  'elm.repellera': pairs(false),
  'elm.gnista.2': all(ground(), ...[28, 92].map((x) => all(rect(x - 10, 100, 20, 12, C.dark, 2, C.ink, 1.4), line(`M${x} 100 L${x} 66`, C.grey, 4), circle(x, 56, 12, C.silver, C.ink, 1.8), circle(x - 4, 52, 3, C.white, null))),
    circle(60, 56, 18, GLOW, null), zig(40, 56, 80, 56, C.yellow, 4.2), zig(40, 56, 80, 56, HL, 1.4), star(60, 56, 6, C.white), line('M52 36 L56 42 M68 36 L64 42 M52 76 L56 70 M68 76 L64 70', C.gold, 2)),
  'elm.få-en-stöt': all(rect(70, 4, 50, 108, '#cdb79e', 2, C.ink, 1.8), rect(80, 54, 30, 8, C.silver, 4, C.ink, 1.6), circle(84, 58, 6, C.silver, C.ink, 1.6),
    path('M2 70 L46 62 C52 60 56 62 58 64 L66 62 C68 62 68 66 66 66 L56 70 L4 82 Z', C.skin, C.ink, 1.8), zig(68, 62, 78, 58, C.yellow, 3.4), star(73, 60, 4, C.white),
    line('M30 48 C38 40 48 40 56 46 M24 92 C34 100 46 98 54 92', HL, 2.4), waIn('b4-elm-fa-en-stot-1', 14, -3, arrow(40, 30, 16, 36, HL, 3)), T(40, 22, '!', 18, HL)),
  'elm.jorda': all(rect(0, 92, 120, 20, '#b9a07c', 0, null), line('M0 92 L120 92', C.ink, 1.4), rect(10, 32, 54, 60, C.white, 4, C.ink, 2), rect(10, 32, 54, 12, '#e4e8ee', 4, C.ink, 1.6), circle(37, 66, 16, '#bfe3f5', C.ink, 2), circle(37, 66, 10, 'none', C.grey, 1.4), circle(54, 38, 3, C.grey, C.ink, 1),
    path('M64 50 L86 50 L86 100', 'none', C.green, 4.6), path('M64 50 L86 50 L86 100', 'none', C.yellow, 2, ), line('M64 50 L86 50 L86 100', HL, 1, '3 3'),
    line('M72 100 L100 100 M76 105 L96 105 M81 110 L91 110', C.ink, 2.6), waIn('b4-elm-jorda-1', -0, -14, arrow(98, 56, 98, 88, HL, 3)), ...[[76, 44], [92, 66], [80, 84]].map(([x, y]) => minus(x!, y!, 3.4, BLUE))),
  'elm.elektroskop': all(path('M28 112 L28 56 C28 40 92 40 92 56 L92 112 Z', 'rgba(191,227,245,0.5)', C.ink, 2), rect(48, 36, 24, 10, C.brown, 2, C.ink, 1.6), line('M60 46 L60 82', C.gold, 3), circle(60, 30, 7, C.gold, C.ink, 1.6),
    path('M60 82 L46 104 L49 105 L60 86 Z', HL, C.ink, 1), path('M60 82 L74 104 L71 105 L60 86 Z', HL, C.ink, 1), arc2(60, 82, 18, 210, 330), ...[[52, 98], [68, 98]].map(([x, y]) => minus(x!, y!, 2.6, BLUE)),
    ellipse(30, 12, 16, 9, C.red, C.ink, 1.6), ...[[24, 12], [32, 10], [38, 14]].map(([x, y]) => minus(x!, y!, 2.4, C.white)), arrow(44, 18, 52, 24, C.grey, 2)),
  'elm.Coulombs-lag': all(rect(6, 6, 108, 30, C.white, 4, C.grey2, 1.2), T(60, 27, 'F = k · q₁q₂ / r²', 12, C.ink), chg(28, 74, true, 11), chg(92, 74, false, 11), arrow(40, 74, 52, 74, HL, 3), arrow(80, 74, 68, 74, HL, 3),
    T(27, 60, 'q₁', 9, C.grey), T(93, 60, 'q₂', 9, C.grey), line('M28 98 L92 98', C.grey, 1.6), line('M28 93 L28 103 M92 93 L92 103', C.grey, 1.6), T(60, 110, 'r', 10, C.grey)),
  // ── 3342 Ström och spänning ─────────────────────────────────────
  'elm.ström.2': loop('current'),
  'elm.spänning': loop('voltage'),
  'elm.pluspol': poles(true),
  'elm.minuspol': poles(false),
  'elm.likström': all(rect(6, 6, 108, 60, C.white, 4, C.grey2, 1.2), arrow(14, 46, 108, 46, C.ink, 1.6), arrow(16, 60, 16, 10, C.ink, 1.6), T(106, 60, 't', 9), T(10, 14, 'I', 9),
    line('M16 26 L104 26', HL, 3.4), batt(28, 92, 50, 20), wire('M18 92 L28 92 M82 92 L104 92', C.dark, 2.4), ...[88, 96].map((x) => arrow(x - 4, 82, x + 4, 82, HL, 2.2)), arrow(14, 82, 22, 82, HL, 2.2)),
  'elm.elnät': all(rect(0, 0, 120, 112, '#eaf5fb', 0, null), ground(), rect(4, 70, 22, 42, C.grey2, 1, C.ink, 1.6), rect(8, 56, 6, 14, C.grey, 0, C.ink, 1.2), bolt(15, 86, 0.8),
    pylon(42, 112, 50), pylon(70, 112, 44),
    line('M26 76 C34 72 38 68 42 66 C54 74 60 74 70 72 M70 72 C80 76 88 74 96 78 M70 72 C82 64 90 60 104 56 M70 72 C80 88 88 92 96 96', HL, 2),
    house(100, 112, 0.9), house(104, 78, 0.8), house(108, 62, 0.7), circle(96, 78, 2, HL, null), circle(104, 56, 2, HL, null)),
  // ── 3343 Resistans och ledare ───────────────────────────────────
  'elm.ledare.4': cable(true),
  'elm.isolator': cable(false),
  'elm.halvledare': all(rect(6, 20, 108, 80, '#3c8a55', 6, C.ink, 2), line('M14 40 L40 40 M14 80 L40 80 M80 40 L106 40 M80 80 L106 80 M60 28 L60 36 M60 84 L60 92', '#d4b26a', 2),
    chip(60, 60, 1.25), ring(60, 60, 30), resistor(22, 30, 0.4), greyed(capacitor(100, 88, 0.5))),
  'elm.resistans': all(wire('M4 60 L36 60', C.grey, 10), wire('M84 60 L116 60', C.grey, 10), path('M36 54 L84 57 L84 63 L36 66 Z', C.grey2, C.ink, 1), wire('M36 60 L84 60', HL, 3),
    ...[10, 22].map((x) => el(x, 60, 3)), ...[42, 50, 58, 66].map((x) => el(x, 60, 2.4)), ...[96, 108].map((x) => el(x, 60, 3)),
    heat(52, 46, 3, C.red, 8), bracket2(36, 84, 78), T(60, 100, '>', 14, HL), greyed(wire('M14 98 L46 98', C.grey, 8)), greyed(wire('M74 98 L106 98', C.grey, 8))),
  'elm.motstånd.2': all(rect(0, 70, 120, 42, '#3c8a55', 0, null), line('M0 70 L120 70', C.ink, 1.4), resistor(60, 44, 2), ring(60, 44, 34), line('M8 44 L8 84 M112 44 L112 84', C.silver, 2.4), circle(8, 86, 3, '#d4b26a', C.ink, 1), circle(112, 86, 3, '#d4b26a', C.ink, 1)),
  'elm.Ohms-lag': all(T(60, 22, 'U = R · I', 16, C.ink), path('M60 34 L110 106 L10 106 Z', SOFT, HL, 3), line('M30 78 L90 78 M60 78 L60 106', HL, 2.4), T(60, 68, 'U', 18, C.ink), T(36, 100, 'R', 16, C.ink), T(84, 100, 'I', 16, C.ink)),
  'elm.tvärsnittsarea': all(path('M10 60 L80 40 L80 84 L10 104 Z', '#e9a36b', C.ink, 1.6), path('M10 60 C-2 64 -2 100 10 104', 'none', C.ink, 1.6), ellipse(80, 62, 12, 22, 'rgba(228,87,46,0.55)', HL, 2.6), line('M74 50 L86 74 M72 60 L84 82 M76 44 L88 66', COPPER, 1),
    arrow(108, 30, 92, 50, HL, 3), greyed(path('M20 18 L60 10 L60 20 L20 28 Z', '#e9a36b', C.ink, 1.2), ellipse(60, 15, 3, 5, '#e9a36b', C.ink, 1))),
  'elm.glödtråd': all(circle(60, 46, 36, GLOW, null), path('M60 92 C40 92 40 80 36 72 C26 60 24 48 30 34 C38 16 82 16 90 34 C96 48 94 60 84 72 C80 80 80 92 60 92 Z', 'rgba(255,246,214,0.9)', C.ink, 2), rect(46, 92, 28, 16, C.grey, 2, C.ink, 1.6), line('M46 98 L74 98 M46 103 L74 103', C.ink, 1),
    line('M52 92 L50 56 M68 92 L70 56', C.dark, 1.6), path('M50 56 C52 48 54 64 56 56 C58 48 60 64 62 56 C64 48 66 64 68 56 C69 52 70 54 70 56', 'none', HL, 3), ring(60, 56, 16), line('M60 6 L60 0 M30 14 L26 10 M90 14 L94 10', C.gold, 2)),
  // ── 3344 Elektriska fält ────────────────────────────────────────
  'elm.elektriskt-fält': all(...[50, 42, 34, 26, 18].map((r, i) => circle(56, 58, r, `rgba(228,87,46,${0.08 + i * 0.07})`, null)), circle(56, 58, 50, 'none', HL, 2, ),
    chg(56, 58, true, 12), chg(84, 46, true, 5), arrow(89, 44, 104, 38, HL, 3.4), chg(64, 92, true, 5), arrow(66, 97, 70, 104, HL, 2.4), greyed(chg(110, 10, true, 5))),
  'elm.fältlinje': all(chg(24, 60, true, 11), chg(96, 60, false, 11), line('M35 60 L85 60 M32 68 C48 90 72 90 88 68 M28 50 C40 6 80 6 92 50 M28 70 C40 114 80 114 92 70', C.grey2, 1.6),
    path('M32 52 C48 30 72 30 88 52', 'none', HL, 4), arrow(54, 36.5, 66, 36.5, HL, 3.4), ...[[60, 60], [60, 84], [60, 17], [60, 103]].map(([x, y]) => arrow(x! - 3, y!, x! + 3, y!, C.grey2, 1.6))),
  'elm.kondensator': all(rect(0, 76, 120, 36, '#3c8a55', 0, null), line('M0 76 L120 76', C.ink, 1.4), capacitor(38, 52, 1.5), ring(38, 50, 30),
    greyed(line('M90 24 L90 64 M106 24 L106 64', C.ink, 3.4), line('M76 44 L90 44 M106 44 L118 44', C.ink, 2), ...[32, 44, 56].map((y) => all(plus(84, y, 2.6), minus(112, y, 2.6))))),
  'elm.van-de-graaff-generator': all(rect(0, 0, 120, 112, '#eef0f2', 0, null), ground(), rect(20, 98, 36, 14, C.dark, 3, C.ink, 1.6), rect(33, 44, 10, 54, C.white, 2, C.ink, 1.6), line('M38 50 L38 94', C.grey, 1.4),
    circle(38, 34, 22, C.silver, C.ink, 2), circle(30, 26, 6, C.white, null), ring(38, 34, 26), ...[[22, 14], [54, 14], [16, 40], [60, 40]].map(([x, y]) => minus(x!, y!, 3, BLUE)),
    kid(90, 112, C.green, -24, -14, 1, true)),
  'elm.åskmoln': all(rect(0, 0, 120, 112, '#c9d6e3', 0, null), path('M6 66 C2 56 10 46 22 48 C22 34 36 28 46 34 C50 20 70 18 76 30 C86 22 102 28 100 42 C114 42 118 60 106 66 Z', '#6c7380', C.ink, 2),
    path('M22 32 C30 14 50 10 60 8 C76 6 96 10 108 18 L96 22 C80 18 60 20 46 28 Z', '#8a919c', C.ink, 1.6), ...[[40, 24], [66, 16], [90, 18]].map(([x, y]) => plus(x!, y!, 3.4, C.white)), ...[[30, 60], [56, 62], [84, 60]].map(([x, y]) => minus(x!, y!, 3.4, C.white)),
    bolt(58, 86, 1.4), line('M14 76 l-3 8 M34 78 l-3 8 M86 78 l-3 8 M104 76 l-3 8', '#5aa7d6', 2), ring(60, 42, 54)),
  'elm.Faradays-bur': all(rect(0, 0, 120, 112, '#d9dfe8', 0, null), ground(), rect(24, 46, 72, 66, 'rgba(255,255,255,0.4)', 2, C.dark, 2.6), path('M20 46 L60 26 L100 46', 'none', C.dark, 2.6),
    line(range(5).map((i) => `M${36 + i * 12} ${46 - (i < 2 ? (i + 1) * 4 : i === 2 ? 14 : (5 - i) * 4) + 2} L${36 + i * 12} 112`).join(' ') + ' M24 68 L96 68 M24 90 L96 90 M24 112 L96 112', C.grey, 1.4),
    zig(60, 0, 60, 26, C.yellow, 4), arrow(30, 44, 22, 104, HL, 3), arrow(90, 44, 98, 104, HL, 3), kid(60, 112, C.orange, 10, 14, 0.8), star(60, 24, 5, C.white)),
  // ── 3345 Magnetfält ─────────────────────────────────────────────
  'elm.nordpol.2': magnetEnd(true),
  'elm.sydpol.2': magnetEnd(false),
  'elm.gem': all(rect(14, 24, 70, 84, C.white, 2, C.ink, 1.6), rect(22, 18, 70, 84, C.white, 2, C.ink, 1.6), line('M30 40 L80 40 M30 52 L84 52 M30 64 L78 64 M30 76 L84 76 M30 88 L70 88', C.grey2, 2),
    g('translate(86 34) scale(2.4) rotate(8)', path('M-3 -8 L-3 6 C-3 9 3 9 3 6 L3 -6 C3 -8 1 -8 1 -6 L1 4', 'none', C.ink, 2), path('M-3 -8 L-3 6 C-3 9 3 9 3 6 L3 -6 C3 -8 1 -8 1 -6 L1 4', 'none', C.silver, 1))),
  'elm.stavmagnet': all(bar(24, 56, 72, 22), ring(60, 56, 50), ...[[20, 46, -30], [18, 60, -80], [22, 70, -120], [100, 46, 30], [102, 60, 80], [98, 70, 120]].map(([x, y, r]) => clip(x!, y!, r!)), greyed(...[44, 76].map((x) => clip(x, 98, 0)))),
  'elm.hästskomagnet': g('translate(0 12)', all(path('M30 20 L30 64 C30 98 90 98 90 64 L90 20 L72 20 L72 64 C72 78 48 78 48 64 L48 20 Z', C.red, C.ink, 2), rect(30, 14, 18, 14, C.silver, 1, C.ink, 1.6), rect(72, 14, 18, 14, C.silver, 1, C.ink, 1.6)),
    path('M30 20 L30 64 C30 76 40 86 60 86 L60 70 C52 70 48 68 48 64 L48 20 Z', BLUE, null), path('M30 20 L30 64 C30 98 90 98 90 64 L90 20 L72 20 L72 64 C72 78 48 78 48 64 L48 20 Z', 'none', C.ink, 2),
    ...[[39, 4], [81, 4]].map(([x, y]) => clip(x!, y!, 180)), ring(60, 56, 46)),
  'elm.järnfilspån': all(rect(4, 14, 112, 84, C.white, 3, C.ink, 1.6), greyed(bar(36, 56, 48, 14)), rect(36, 49, 48, 14, 'rgba(251,251,248,0.6)', 0, null),
    ...[8, 18, 30].map((d) => line(`M36 56 C${36 - d} ${56 - d * 1.5} ${84 + d} ${56 - d * 1.5} 84 56 C${84 + d} ${56 + d * 1.5} ${36 - d} ${56 + d * 1.5} 36 56`, C.dark, 1.8, '2 3')),
    line('M10 56 L32 56 M88 56 L110 56 M14 40 L30 50 M14 72 L30 62 M106 40 L90 50 M106 72 L90 62', C.dark, 1.8, '2 3'), rect(4, 14, 112, 84, 'none', 3, HL, 2.6)),
  'elm.magnetisera': all(ground(), nail(10, 100, 92), ...[30, 54].map((x) => greyed(bar(x, 72, 30, 10))), bar(78, 72, 30, 10), waIn('b4-elm-magnetisera-1', -14, -0, arrow(30, 58, 96, 58, HL, 3)), waIn('b4-elm-magnetisera-2', -14, -0, arrow(30, 50, 96, 50, HL, 2)), clip(100, 104, 0), ring(98, 96, 12)),
  'elm.elektromagnet': all(nail(18, 102, 50), coil(34, 88, 50, 8, 11, HL, 2.2), wire('M34 50 C30 70 30 86 40 92 M88 50 C92 70 92 86 82 92', C.dark, 2), batt(40, 92, 40, 14), ...[[106, 62, 0], [100, 70, 20], [110, 72, -20]].map(([x, y, r]) => clip(x!, y!, r!))),
  'elm.solvind': all(rect(0, 0, 120, 112, '#0f2040', 0, null), ...range(12).map((i) => circle(f1(8 + ((i * 37) % 104)), f1(6 + ((i * 53) % 100)), 0.9, C.white, null)), sun(4, 56, 22),
    ...[38, 50, 62, 74].map((y, i) => all(...[36, 50, 64].map((x) => circle(x + (i % 2) * 6, y, 2.2, HL, null)), arrow(70 + (i % 2) * 6, y, 80 + (i % 2) * 6, y, HL, 1.8))),
    path('M84 30 C110 26 118 50 120 56 C118 62 110 86 84 82', 'none', '#8fd0ff', 1.6), path('M88 40 C104 38 110 50 112 56 C110 62 104 74 88 72', 'none', '#8fd0ff', 1.6), earth(100, 56, 9)),
  // ── 3346 Elektromagnetisk induktion ─────────────────────────────
  'elm.induktion.2': all(coil(44, 92, 46, 6, 16, COPPER, 2.4), wire('M47 62 C46 84 54 92 60 92 M89 62 C90 84 82 92 78 92', C.dark, 2), gauge(69, 92, 14, 40),
    bar(0, 46, 40, 14), waIn('b4-elm-induktion-2-1', -14, -0, arrow(10, 26, 36, 26, HL, 3.4)), path('M2 52 C-2 60 4 66 10 62 L18 54', C.skin, C.ink, 1.6), ring(69, 92, 18)),
  'elm.spole': all(rect(18, 46, 84, 20, C.beige, 3, C.ink, 1.4), coil(22, 98, 56, 9, 15, COPPER, 2.6), wire('M24 70 C16 88 10 96 6 104 M96 70 C104 88 110 96 114 104', COPPER, 2), ring(60, 56, 50)),
  'elm.generator': all(ground(), rect(54, 40, 60, 60, C.grey2, 8, C.ink, 2), circle(84, 70, 24, C.white, C.ink, 1.6), coil(66, 102, 70, 4, 18, COPPER, 1.6), bar(70, 70, 28, 10, -30),
    rect(10, 66, 44, 8, C.silver, 2, C.ink, 1.4), g('translate(14 70)', path('M0 -20 L6 0 L0 20 L-6 0 Z', C.grey, C.ink, 1.4)), arc2(84, 70, 30, 140, 40), bolt(84, 22, 1.2), wire('M114 60 L118 60 L118 22 L94 22', C.dark, 2), ring(84, 70, 34)),
  'elm.turbin': all(rect(0, 0, 120, 112, '#e8f1f8', 0, null), path('M0 24 L46 24 L46 44 L0 44 Z', '#5aa7d6', null), line('M0 24 L46 24 M0 44 L46 44', C.ink, 1.4), arrow(6, 34, 40, 34, C.white, 2.4),
    g('translate(72 62)', ...range(8).map((i) => g(`rotate(${i * 45})`, path('M0 -6 C8 -14 10 -30 2 -36 L-4 -34 C2 -26 0 -14 -4 -6 Z', C.silver, C.ink, 1.4))), circle(0, 0, 8, C.dark, C.ink, 1.6)),
    arc2(72, 62, 44, 120, 60), path('M46 34 C56 34 60 30 64 26', 'none', '#5aa7d6', 4), ring(72, 62, 40), line('M72 102 L72 112', C.dark, 4)),
  'elm.transformator': all(path('M30 26 L90 26 L90 98 L30 98 Z M42 38 L42 86 L78 86 L78 38 Z', C.grey, C.ink, 1.6), ...range(8).map((i) => line(`M24 ${32 + i * 8} L48 ${36 + i * 8}`, COPPER, 2.6)), ...range(3).map((i) => line(`M72 ${46 + i * 14} L96 ${50 + i * 14}`, HL, 3)),
    wire('M24 32 L6 32 M24 90 L6 90', C.dark, 2), wire('M96 50 L114 50 M96 78 L114 78', C.dark, 2), T(10, 66, '230', 9, C.ink), T(110, 70, '5', 11, HL), arrow(52, 108, 68, 108, HL, 2.4)),
  'elm.elmotor': all(rect(30, 46, 52, 40, C.silver, 8, C.ink, 2), rect(26, 50, 6, 32, C.grey, 2, C.ink, 1.4), line('M34 56 L78 56 M34 66 L78 66 M34 76 L78 76', C.grey, 1.2), rect(82, 62, 14, 6, C.dark, 1, C.ink, 1.2),
    g('translate(100 65)', path('M0 0 C-4 -10 -2 -26 6 -28 C10 -20 6 -8 0 0 Z M0 0 C4 10 2 26 -6 28 C-10 20 -6 8 0 0 Z', C.sky, C.ink, 1.4), circle(0, 0, 3, C.dark, null)), arc2(100, 65, 22, 120, 60),
    wire('M40 86 L40 100 M70 86 L70 100', C.red, 2), batt(30, 104, 50, 12), ring(56, 66, 34)),
  'elm.induktionshäll': all(path('M8 58 L112 58 L104 100 L16 100 Z', C.black, C.ink, 2), ellipse(40, 80, 18, 7, 'none', '#555b66', 1.4), ellipse(80, 80, 18, 7, 'none', HL, 1.6, ), ellipse(80, 80, 12, 4.6, 'none', HL, 1.2), ellipse(80, 80, 6, 2.4, 'none', HL, 1),
    path('M62 54 L62 34 C62 30 98 30 98 34 L98 54 C98 60 62 60 62 54 Z', C.silver, C.ink, 1.8), ellipse(80, 34, 18, 4, '#bfe3f5', C.ink, 1.4), line('M98 40 L112 36', C.dark, 3), heat(72, 28, 3, C.grey, 8), path('M68 62 C66 70 66 74 70 78 M92 62 C94 70 94 74 90 78', 'none', HL, 1.4, ), ring(80, 60, 28)),
  'elm.trådlös-laddning': all(rect(0, 76, 120, 36, C.tan, 0, null), line('M0 76 L120 76', C.ink, 1.4), ellipse(60, 80, 40, 9, C.dark, C.ink, 1.8), ellipse(60, 78, 36, 7, '#4a4f5a', null), circle(60, 78, 2, C.green, null),
    g('translate(60 62) rotate(-8)', rect(-28, -10, 56, 18, C.black, 4, C.ink, 1.8), rect(-24, -7, 48, 12, '#bfe3f5', 2, null), rect(-10, -4, 18, 6, C.white, 1, C.ink, 1), rect(-10, -4, 12, 6, C.green, 1, null), rect(8, -2.4, 2, 2.6, C.ink, 0, null)),
    path('M24 44 C36 30 84 30 96 44 M32 36 C42 24 78 24 88 36', 'none', HL, 2.2), wire('M100 82 C110 84 112 96 118 100', C.dark, 2.2), waPulse('b4-elm-tradlos-laddning-1', ring(60, 66, 40))),
  // ── 3347 Elektriska kretsar ─────────────────────────────────────
  'elm.komponent.2': all(rect(0, 70, 120, 42, C.tan, 0, null), line('M0 70 L120 70', C.ink, 1.4), resistor(30, 58, 0.9, -20), led(64, 52, C.red, false, 1.1), capacitor(96, 52, 1), chip(40, 92, 0.7), resistor(86, 94, 0.7, 10),
    ring(60, 72, 50)),
  'elm.strömkrets': all(wire('M60 24 L14 24 L14 94 L40 94 M84 94 L106 94 L106 70 M106 54 L106 24 L60 24', HL, 3.2), bulb(60, 18, true, 10), batt(40, 94, 40, 16),
    line('M106 70 L106 54', HL, 3.2), circle(106, 70, 3, C.ink, null), circle(106, 54, 3, C.ink, null), arrow(36, 24, 24, 24, HL, 2.6), arrow(14, 56, 14, 72, HL, 2.6), arrow(90, 94, 100, 94, HL, 2.6), arrow(106, 44, 106, 32, HL, 2.6)),
  'elm.lysdiod': all(circle(60, 46, 34, 'rgba(214,69,69,0.15)', null), led(60, 56, C.red, true, 2.8), line('M30 30 L22 24 M90 30 L98 24 M60 10 L60 2', C.red, 2)),
  'elm.seriekoppling': twoLamps(true),
  'elm.parallellkoppling': twoLamps(false),
  'elm.kopplingsschema': all(rect(8, 8, 100, 96, C.white, 2, C.ink, 1.8), line('M26 30 L90 30 L90 84 L66 84 M54 84 L26 84 L26 30', C.ink, 2), line('M54 76 L54 92 M60 80 L60 88', C.ink, 2.4), line('M60 84 L66 84', C.ink, 2),
    circle(58, 30, 8, C.white, C.ink, 2), line('M52 24 L64 36 M64 24 L52 36', C.ink, 1.6), line('M90 50 L84 62', C.ink, 2), circle(90, 50, 2, C.ink, null), circle(90, 64, 2, C.ink, null), line('M90 64 L90 84', C.ink, 2), ring(58, 58, 44),
    g('translate(104 96) rotate(-40)', rect(-3, -30, 6, 30, C.yellow, 1, C.ink, 1.2), path('M-3 0 L0 6 L3 0 Z', C.tan, C.ink, 1))),
  'elm.löda': all(rect(0, 74, 120, 38, '#3c8a55', 0, null), line('M0 74 L120 74', C.ink, 1.4), ...[20, 40, 60, 80].map((x) => circle(x, 92, 3, '#d4b26a', C.ink, 1)), wire('M10 66 C30 66 50 70 60 84', COPPER, 2.4),
    g('translate(62 84) rotate(-40)', line('M0 0 L0 -18', C.silver, 3), rect(-4, -40, 8, 22, C.silver, 2, C.ink, 1.4), rect(-6, -76, 12, 36, C.dark, 4, C.ink, 1.6)), circle(60, 86, 4, '#e6e6e6', C.ink, 1.2),
    path('M104 40 C96 50 84 60 68 82', 'none', '#c8ccd2', 2.6), path('M62 70 C58 62 66 58 62 50 M70 72 C66 64 74 60 70 52', 'none', C.grey2, 2), waPulse('b4-elm-loda-1', ring(62, 84, 12))),
  'elm.kortslutning': all(wire('M60 24 L14 24 L14 94 L40 94 M84 94 L106 94 L106 24 L60 24', C.dark, 2.4), greyed(bulb(60, 18, false, 10)), batt(40, 94, 40, 16), wire('M14 60 L106 60', HL, 4),
    circle(14, 60, 3, C.ink, null), circle(106, 60, 3, C.ink, null), star(60, 60, 9, C.yellow), waIn('b4-elm-kortslutning-1', -12, -0, arrow(30, 52, 50, 52, HL, 3)), waIn('b4-elm-kortslutning-2', -12, -0, arrow(70, 52, 90, 52, HL, 3)), heat(36, 86, 3, C.red, 9), path('M58 48 C54 40 62 36 58 28', 'none', C.grey, 2.4)),
  'elm.grenuttag': strip(false),
  'elm.överbelastning': strip(true),
};

/** Curved arrow (arc) around (cx, cy) from angle a1 to a2 (degrees, maths direction). */
function arc2(cx: number, cy: number, r: number, a1: number, a2: number, col: string = HL, sw = 2.4): Svg {
  const p = (a: number) => [f1(cx + Math.cos(rad(a)) * r), f1(cy - Math.sin(rad(a)) * r)] as const;
  const [x1, y1] = p(a1), [x2, y2] = p(a2), large = Math.abs(a2 - a1) > 180 ? 1 : 0, sweep = a2 > a1 ? 0 : 1;
  const [tx, ty] = p(a2 + (a2 > a1 ? -14 : 14)), ang = Math.atan2(y2 - ty, x2 - tx), h = 6 + sw;
  return all(path(`M${x1} ${y1} A${r} ${r} 0 ${large} ${sweep} ${x2} ${y2}`, 'none', col, sw),
    path(`M${x2} ${y2} L${f1(x2 - h * Math.cos(ang - 0.5))} ${f1(y2 - h * Math.sin(ang - 0.5))} L${f1(x2 - h * Math.cos(ang + 0.5))} ${f1(y2 - h * Math.sin(ang + 0.5))} Z`, col, null));
}
/** Horizontal bracket under a stretch from x1 to x2 at height y. */
function bracket2(x1: number, x2: number, y: number, col: string = HL): Svg {
  return all(line(`M${x1} ${y} L${x2} ${y}`, col, 2.4), line(`M${x1} ${y - 5} L${x1} ${y + 5} M${x2} ${y - 5} L${x2} ${y + 5}`, col, 2.4));
}
