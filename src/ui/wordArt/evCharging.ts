/**
 * Teknik & digital värld → Transportteknik → Elbilar & laddning, 4221–4227 (0.60): electric motors, battery packs,
 * battery chemistry, charging connectors, fast charging, regenerative braking, and range and energy use.
 * Recurring signs: the part that the word names is orange (or framed or ringed in orange); grey parts show what the
 * word is not. Cars are blue, electricity is a yellow bolt, battery charge is green bars, cold is light blue, heat
 * red-orange and copper coils brown-orange. Words that are easy to mix up get clearly different scenes:
 * rotor (the orange inner part spinning inside a grey ring) and stator (the orange ring with glowing coils, the grey
 * rotor lifted out beside it); drivlina (the orange line from the motor to the wheels) and bakhjulsdrift (a car from
 * above with only the rear wheels orange and turning); kilowatt (a power dial whose needle swings up); batteripaket (the whole flat box in the floor of a car) and cell (one cell lifted out of a grid);
 * laddnivå (a battery icon filled to a marked level) and batterihälsa (a battery with a heart and a pulse line);
 * anod (the left plate with a minus sign), katod (the right plate with a plus sign) and elektrolyt (the liquid
 * between grey plates); snabbladdning (a big charger, a stopwatch and bars that fill fast) and normalladdning (a
 * house at night, a moon and bars that fill slowly); laddstation (a roof with several chargers), laddplats (one
 * painted parking space seen from above) and laddstopp (a route with a pause on the way); släppa gasen (a foot
 * lifting off the pedal) and enpedalskörning (only one pedal in use, the brake pedal greyed, and the digit 1).
 * Digits and code signs only; no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waIn, waPulse, waShake, waSpin, waSway, type Svg } from './kit';
import { HL } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const CAR = '#3f7fc8';
const GLASS = '#dff1fb';
const ROAD = '#8a8f98';
const STEEL = '#8d949b';
const STEEL2 = '#c0c6cc';
const COPPER = '#c8743a';
const CHARGE = '#5cc06a';
const SCREEN = '#14233f';
const ICE = '#bfe6f7';
const HEAT = '#e4572e';
const NIGHT = '#27345a';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 5, col, 2.6);
const sky = (col = '#e3f1f8') => rect(0, 0, 120, 120, col, 0, null);
const road = (y = 98) => all(rect(0, y, 120, 120 - y, ROAD, 0, null), line(`M0 ${y + 8} L120 ${y + 8}`, C.white, 1.6, '8 6'));
const cross = (x: number, y: number, s = 6, col: string = C.red) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 3);
const tick = (x: number, y: number, s = 1, col: string = C.green) => line(`M${x - 4 * s} ${y} L${x - 1 * s} ${y + 3 * s} L${x + 5 * s} ${y - 4 * s}`, col, 2.8);
const bolt = (x: number, y: number, s = 1, col: string = C.yellow) => g(`translate(${x} ${y}) scale(${s})`, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', col, C.ink, 1.4));
const flake = (x: number, y: number, s = 1, col = '#5aa9d6') => g(`translate(${x} ${y}) scale(${s})`, line('M0 -7 L0 7 M-6 -3.5 L6 3.5 M-6 3.5 L6 -3.5', col, 2), line('M-2 -5 L0 -3 L2 -5 M-2 5 L0 3 L2 5', col, 1.4));
const heatWave = (x: number, y: number, h = 14, col: string = HEAT) => line(`M${x} ${y} C${x - 4} ${y - h / 4} ${x + 4} ${y - h / 2} ${x} ${y - (3 * h) / 4} C${x - 3} ${y - h} ${x} ${y - h} ${x} ${y - h}`, col, 2);
const coin = (x: number, y: number, r = 5) => all(circle(x, y, r, C.gold, C.ink, 1.2), circle(x, y, r * 0.55, 'none', '#b88a20', 1));
const moon = (x: number, y: number, r = 9) => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${x + r} ${y + r * 0.2} A${r * 0.75} ${r * 0.75} 0 1 1 ${x} ${y - r} Z`, '#f6e08a', C.ink, 1.2);
const star = (x: number, y: number) => path(`M${x} ${y - 3} L${x + 1} ${y - 1} L${x + 3} ${y} L${x + 1} ${y + 1} L${x} ${y + 3} L${x - 1} ${y + 1} L${x - 3} ${y} L${x - 1} ${y - 1} Z`, '#f6e08a', null);
const clock = (x: number, y: number, r = 10, face: string = C.white) => all(circle(x, y, r, face, C.ink, 1.8), ...range(4).map((i) => { const a = (i * Math.PI) / 2; return line(`M${f1(x + Math.cos(a) * (r - 2))} ${f1(y + Math.sin(a) * (r - 2))} L${f1(x + Math.cos(a) * (r - 4))} ${f1(y + Math.sin(a) * (r - 4))}`, C.ink, 1.2); }), circle(x, y, 1.4, C.ink, null));
const hand = (x: number, y: number, deg: number, len: number, col: string = C.ink, w = 1.8) => g(`translate(${x} ${y}) rotate(${deg})`, line(`M0 0 L0 ${-len}`, col, w));
/** Battery icon lying down from (x, y) with size w×h; n of `of` bars green. */
const battery = (x: number, y: number, w: number, h: number, n: number, of = 5, col: string = CHARGE, outline: string = C.ink) => {
  const bw = (w - 6 - (of - 1) * 2) / of;
  return all(rect(x, y, w, h, C.white, 3, outline, 2), rect(x + w, y + h * 0.3, 4, h * 0.4, outline, 1, null),
    ...range(of).map((i) => rect(f1(x + 3 + i * (bw + 2)), y + 3, f1(bw), h - 6, i < n ? col : '#e6e8ea', 1.5, null)));
};
/** Standing person, feet at (x, y=112); arms from the shoulders to (lx, ly) and (rx, ry) relative to the neck. */
const person = (x: number, top: string, o: { s?: number; l?: [number, number]; r?: [number, number]; hair?: string; y?: number; legs?: string; face?: 'smile' | 'worry' } = {}) => {
  const s = o.s ?? 1, [lx, ly] = o.l ?? [-12, 22], [rx, ry] = o.r ?? [12, 22];
  return g(`translate(${x} ${o.y ?? 112}) scale(${s})`, line('M-5 0 L-4 -26 M5 0 L4 -26', o.legs ?? C.navy, 7), rect(-11, -56, 22, 32, top, 6, C.ink, 1.6),
    line(`M-9 -52 L${lx} ${-56 + ly}`, C.ink, 6.4), line(`M-9 -52 L${lx} ${-56 + ly}`, top, 4.4), circle(lx, -56 + ly, 3.2, C.skin, C.ink, 1.2),
    line(`M9 -52 L${rx} ${-56 + ry}`, C.ink, 6.4), line(`M9 -52 L${rx} ${-56 + ry}`, top, 4.4), circle(rx, -56 + ry, 3.2, C.skin, C.ink, 1.2),
    circle(0, -67, 10, C.skin, C.ink, 1.6), path('M-10 -68 C-10 -81 10 -81 10 -68 C6 -73 -6 -73 -10 -68 Z', o.hair ?? C.hair, null),
    circle(-3.5, -66, 1.2, C.ink, null), circle(3.5, -66, 1.2, C.ink, null),
    o.face === 'worry' ? path('M-3 -59 C-1 -61 1 -61 3 -59', 'none', C.ink, 1.2) : path('M-3 -61 C-1 -59 1 -59 3 -61', 'none', C.ink, 1.2));
};

// ── Cars and charging equipment ──────────────────────────────────────
/** Car seen from the side, wheels standing on y, centre x; front to the right. port: charging flap at the rear. */
const evSide = (x: number, y: number, s = 1, o: { col?: string; port?: boolean; lights?: boolean; wheels?: string } = {}) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-46 -9 L-46 -23 L-38 -26 L-24 -41 L14 -41 L30 -26 L46 -22 L48 -9 Z', o.col ?? CAR, C.ink, 1.8),
  path('M-21 -37 L-4 -37 L-4 -26 L-33 -26 Z', GLASS, C.ink, 1), path('M0 -37 L12 -37 L24 -26 L0 -26 Z', GLASS, C.ink, 1), line('M-2 -26 L-2 -10', C.ink, 0.8),
  rect(40, -19, 7, 5, o.lights ? '#ffe08a' : '#f6f2d8', 1.4, C.ink, 0.8), rect(-46, -20, 4, 5, C.red, 1, C.ink, 0.6),
  o.port ? rect(-40, -22, 6, 5, '#2b2b30', 1, C.ink, 0.8) : '',
  circle(-28, -9, 9, o.wheels ?? C.dark, C.ink, 1.4), circle(30, -9, 9, o.wheels ?? C.dark, C.ink, 1.4), circle(-28, -9, 3.6, STEEL2, null), circle(30, -9, 3.6, STEEL2, null));
/** Car seen from above, centre (x, y), front up. drive: which wheels are orange. */
const evTop = (x: number, y: number, s = 1, drive: 'front' | 'rear' | 'all' | 'none' = 'none', col: string = CAR) => {
  const wc = (front: boolean) => (drive === 'all' || (drive === 'front' && front) || (drive === 'rear' && !front) ? HL : C.dark);
  return g(`translate(${x} ${y}) scale(${s})`,
    rect(-25, -34, 9, 18, wc(true), 3, C.ink, 1.4), rect(16, -34, 9, 18, wc(true), 3, C.ink, 1.4), rect(-25, 16, 9, 18, wc(false), 3, C.ink, 1.4), rect(16, 16, 9, 18, wc(false), 3, C.ink, 1.4),
    rect(-18, -46, 36, 92, col, 12, C.ink, 1.8), path('M-14 -22 L14 -22 L11 -10 L-11 -10 Z', GLASS, C.ink, 1), path('M-12 26 L12 26 L14 34 L-14 34 Z', GLASS, C.ink, 1),
    rect(-11, -8, 22, 32, '#5f93d6', 4, C.ink, 0.8), ellipse(-11, -43, 4.5, 2.6, '#ffe08a', C.ink, 0.8), ellipse(11, -43, 4.5, 2.6, '#ffe08a', C.ink, 0.8),
    rect(-15, 43, 7, 3, C.red, 1, null), rect(8, 43, 7, 3, C.red, 1, null));
};
/** Turning arrows beside a wheel at (x, y) of a car seen from above. */
const turnMarks = (name: string, x: number, y: number) => moving(name, '0%{transform:translate(0,6px);opacity:0}40%{opacity:1}100%{transform:translate(0,-6px);opacity:0}', { dur: 1.1 },
  line(`M${x - 4} ${y + 2} L${x} ${y - 3} L${x + 4} ${y + 2}`, HL, 2.2), line(`M${x - 4} ${y + 8} L${x} ${y + 3} L${x + 4} ${y + 8}`, HL, 2.2));
/** Tall fast charger, feet on y, centre x; cable to the left. */
const fastCharger = (x: number, y: number, s = 1, col = '#e9edf0', cable = true) => g(`translate(${x} ${y}) scale(${s})`,
  rect(-12, -62, 24, 62, col, 4, C.ink, 1.8), rect(-8, -56, 16, 12, SCREEN, 2, null), bolt(0, -32, 0.7), rect(-14, -2, 28, 4, C.dark, 1, null),
  cable ? path('M-12 -24 C-26 -22 -30 -6 -22 2', 'none', C.dark, 3) : '');
/** Wall box with a green lamp, centre (x, y). */
const wallbox = (x: number, y: number, s = 1, col = C.white) => g(`translate(${x} ${y}) scale(${s})`,
  rect(-11, -15, 22, 30, col, 5, C.ink, 1.8), circle(0, -7, 2.4, '#3cc46a', C.ink, 0.8), bolt(0, 5, 0.5));
/** Type 2 plug face, centre (x, y): round with a flat top and seven pins. */
const plugFace = (x: number, y: number, r = 14, col = '#2b2b30') => g(`translate(${x} ${y})`,
  path(`M${-r * 0.75} ${-r * 0.66} L${r * 0.75} ${-r * 0.66} A${r} ${r} 0 1 1 ${-r * 0.75} ${-r * 0.66} Z`, col, C.ink, 1.6),
  ...([[-0.45, -0.25], [0, -0.3], [0.45, -0.25], [-0.55, 0.2], [0, 0.15], [0.55, 0.2], [0, 0.6]] as [number, number][]).map(([a, b]) => circle(f1(a * r), f1(b * r), f1(r * 0.13), STEEL2, C.ink, 0.6)));
/** Phone, centre (x, y). */
const phone = (x: number, y: number, inner: Svg = '', s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -24, 28, 48, C.dark, 4, C.ink, 1.6), rect(-11, -19, 22, 37, '#eef6f2', 1.5, null), inner);
/** Electric motor cross-section, centre (x, y). parts: which part is the word. */
const motorSection = (x: number, y: number, r: number, statorCol: string, coilCol: string) => all(
  circle(x, y, r, statorCol, C.ink, 2), circle(x, y, r * 0.62, '#f6f2ea', C.ink, 1.4),
  ...range(8).map((i) => { const a = (i * Math.PI) / 4; return g(`translate(${f1(x + Math.cos(a) * r * 0.8)} ${f1(y + Math.sin(a) * r * 0.8)}) rotate(${i * 45 + 90})`, rect(-5, -4, 10, 8, coilCol, 2, C.ink, 1), line('M-3 -2 L3 -2 M-3 1 L3 1', '#7a4220', 0.8)); }));
const rotorPart = (x: number, y: number, r: number, col: string) => all(circle(x, y, r, col, C.ink, 1.8),
  ...range(4).map((i) => g(`translate(${x} ${y}) rotate(${i * 90})`, rect(-r * 0.3, -r * 0.92, r * 0.6, r * 0.32, i % 2 ? '#d64545' : '#3f6fb5', 1.5, C.ink, 0.8))),
  circle(x, y, r * 0.22, STEEL, C.ink, 1.2));
/** Battery cell (two plates and electrolyte) for anod, katod and elektrolyt. part = the word. */
const cellDiagram = (part: 'anod' | 'katod' | 'elektrolyt', name: string) => all(sky('#f3f6f8'),
  rect(14, 24, 92, 74, part === 'elektrolyt' ? '#9fd3ee' : '#dbeef8', 6, part === 'elektrolyt' ? HL : C.ink, part === 'elektrolyt' ? 2.8 : 1.6),
  g('', rect(20, 30, 18, 62, part === 'anod' ? '#3a3a44' : '#c9ced4', 2, part === 'anod' ? HL : C.ink, part === 'anod' ? 2.8 : 1.2),
    part === 'anod' ? all(...range(7).map((i) => line(`M22 ${36 + i * 8} L36 ${36 + i * 8}`, '#6a6a74', 1.2))) : ''),
  rect(82, 30, 18, 62, part === 'katod' ? HL : '#c9ced4', 2, C.ink, part === 'katod' ? 1.8 : 1.2),
  part === 'katod' ? all(...range(6).map((i) => circle(87 + (i % 2) * 8, 38 + Math.floor(i / 2) * 18, 3, '#3f6fb5', C.ink, 0.6))) : '',
  line('M29 30 L29 14 M91 30 L91 14', C.ink, 2.4), circle(29, 11, 7, part === 'anod' ? C.white : '#eef0f2', part === 'anod' ? HL : C.ink, part === 'anod' ? 2.4 : 1.2), line('M25 11 L33 11', C.ink, 2.4),
  circle(91, 11, 7, part === 'katod' ? C.white : '#eef0f2', part === 'katod' ? HL : C.ink, part === 'katod' ? 2.4 : 1.2), line('M87 11 L95 11 M91 7 L91 15', C.ink, 2.4),
  moving(name, '0%{transform:translate(-26px,0)}100%{transform:translate(18px,0)}', { dur: 2.4 }, ...([[56, 44], [62, 62], [52, 80], [66, 52], [58, 72]] as [number, number][]).map(([cx, cy]) => circle(cx, cy, 3.2, part === 'elektrolyt' ? C.yellow : '#f2d06a', C.ink, 0.8))));

export const EVCHG_MOTIFS: Record<string, Svg> = {
  // ── 4221 Elmotorer ──
  'evchg.rotor': all(sky('#f3f6f8'), greyed(motorSection(60, 60, 46, '#9aa3ad', '#b08a6a')),
    waSpin('evcrotor', 3, rotorPart(60, 60, 25, HL)), ring(60, 60, 30), path('M90 22 C98 30 100 38 98 46', 'none', HL, 2.4), path('M98 46 L94 40 M98 46 L102 40', 'none', HL, 2.4)),
  'evchg.stator': all(sky('#f3f6f8'), motorSection(50, 54, 42, HL, COPPER),
    waPulse('evcstat', ...range(8).map((i) => { const a = (i * Math.PI) / 4; return circle(f1(50 + Math.cos(a) * 33.6), f1(54 + Math.sin(a) * 33.6), 6.5, 'none', C.yellow, 2); })),
    greyed(rotorPart(98, 96, 14, '#9aa3ad')), arrow(86, 86, 70, 72, C.grey, 2)),
  'evchg.permanentmagnet': all(sky('#f3f6f8'),
    g('translate(48 62)', path('M-22 -30 L-8 -30 L-8 4 C-8 14 8 14 8 4 L8 -30 L22 -30 L22 4 C22 32 -22 32 -22 4 Z', '#d64545', C.ink, 2), rect(-22, -36, 14, 10, C.white, 1, C.ink, 1.6), rect(8, -36, 14, 10, C.white, 1, C.ink, 1.6)),
    frame(20, 4, 56, 86),
    waPulse('evcmag', path('M33 20 C33 8 63 8 63 20', 'none', HL, 1.8), path('M27 18 C24 2 72 2 69 18', 'none', HL, 1.4)),
    ...([[34, 96, -20], [48, 100, 10], [62, 96, 30]] as [number, number, number][]).map(([cx, cy, r]) => g(`translate(${cx} ${cy}) rotate(${r})`, rect(-3, -9, 6, 18, 'none', 3, STEEL, 2))),
    g('translate(96 40)', rect(-9, -6, 18, 12, C.white, 2, C.ink, 1.4), line('M-4 6 L-4 12 M4 6 L4 12', C.ink, 2), path('M0 -6 C0 -16 10 -18 14 -26', 'none', C.ink, 1.6)), circle(96, 40, 16, 'none', C.red, 2.6), line('M85 51 L107 29', C.red, 2.6)),
  'evchg.kilowatt': all(sky('#f3f6f8'),
    path('M14 84 A46 46 0 0 1 106 84', 'none', '#d6dadf', 12), path('M14 84 A46 46 0 0 1 60 38', 'none', CHARGE, 12), path('M60 38 A46 46 0 0 1 106 84', 'none', HL, 12),
    ...range(9).map((i) => { const a = Math.PI - (i * Math.PI) / 8; return line(`M${f1(60 + Math.cos(a) * 34)} ${f1(84 - Math.sin(a) * 34)} L${f1(60 + Math.cos(a) * 28)} ${f1(84 - Math.sin(a) * 28)}`, C.ink, 1.6); }),
    moving('evckw', '0%{transform:rotate(-80deg)}60%,100%{transform:rotate(0deg)}', { dur: 2.8, spin: true }, g('translate(60 84) rotate(50)', path('M0 38 L0 -38', 'none', 'none', 0), line('M0 0 L0 -38', C.ink, 3.4))),
    circle(60, 84, 6, C.dark, C.ink, 1.4), bolt(60, 102, 0.9)),
  'evchg.drivlina': all(sky('#f3f6f8'), greyed(evTop(60, 60, 1, 'none')),
    rect(48, 76, 24, 14, HL, 3, C.ink, 1.6), line('M40 85 L80 85', HL, 4),
    rect(32, 76, 10, 18, HL, 3, C.ink, 1.4), rect(78, 76, 10, 18, HL, 3, C.ink, 1.4),
    waIn('evcdriv', 10, 0, circle(64, 85, 2, C.yellow, null), circle(72, 85, 2, C.yellow, null)), waIn('evcdriv2', -10, 0, circle(56, 85, 2, C.yellow, null), circle(48, 85, 2, C.yellow, null)),
    frame(28, 70, 64, 30)),
  'evchg.enväxlad': all(sky('#f3f6f8'),
    g('translate(40 56)', waSpin('evcgear', 4, all(...range(10).map((i) => g(`rotate(${i * 36})`, rect(-5, -30, 10, 9, HL, 1.5, C.ink, 1.2))), circle(0, 0, 23, HL, C.ink, 1.8), circle(0, 0, 7, C.white, C.ink, 1.4)))),
    circle(40, 56, 34, 'none', HL, 2.4),
    greyed(g('translate(92 34)', ...range(4).map((i) => all(circle(0, i * 16, 9 - i, '#9aa3ad', C.ink, 1.2), circle(0, i * 16, 3, C.white, null))))),
    cross(92, 58, 18, C.red)),
  'evchg.bakhjulsdrift': all(sky('#eaf0f3'), line('M60 4 L60 116', C.white, 2, '6 6'), evTop(60, 62, 0.95, 'rear'), rect(48, 92, 24, 12, HL, 3, C.ink, 1.2), line('M37 98 L48 98 M72 98 L83 98', HL, 3),
    turnMarks('evcrwd1', 30, 102), turnMarks('evcrwd2', 90, 102), arrow(60, 14, 60, 2, C.grey, 2.4)),
  'evchg.batteripaket': all(sky(), road(102), greyed(evSide(60, 104, 1.15)),
    rect(16, 80, 88, 12, HL, 3, C.ink, 2), ...range(10).map((i) => rect(19 + i * 8.4, 82.5, 6.4, 7, '#f6c09a', 1, C.ink, 0.6)), frame(12, 76, 96, 20)),
  'evchg.cell.4': all(sky('#f3f6f8'),
    greyed(rect(8, 58, 104, 50, '#c9ced4', 4, C.ink, 1.6), ...range(18).map((i) => all(circle(18 + (i % 9) * 11, 72 + Math.floor(i / 9) * 22, 5, '#9aa3ad', C.ink, 1), circle(18 + (i % 9) * 11, 72 + Math.floor(i / 9) * 22, 1.8, C.white, null)))),
    circle(62, 72, 5.5, '#f3f6f8', C.ink, 1, ),
    waIn('evccell', 0, 22, g('translate(62 30)', rect(-11, -22, 22, 44, HL, 5, C.ink, 2), ellipse(0, -22, 11, 4, '#f6c09a', C.ink, 1.4), rect(-4, -28, 8, 5, STEEL, 1, C.ink, 1), line('M-11 10 L11 10', '#b8401f', 1.4))),
    ring(62, 30, 28), line('M62 58 L62 66', HL, 1.6, '2 2')),
  'evchg.laddnivå': all(rect(0, 0, 120, 120, '#2b2b30', 0, null), rect(10, 22, 100, 70, SCREEN, 6, C.ink, 1.6),
    rect(22, 40, 70, 34, '#1d2d4d', 4, '#cfe8ff', 2.4), rect(92, 50, 6, 14, '#cfe8ff', 1, null), rect(26, 44, 42, 26, CHARGE, 2, null),
    line('M68 34 L68 80', HL, 3), path('M62 26 L74 26 L68 34 Z', HL, C.ink, 1),
    waPulse('evclvl', rect(66, 44, 4, 26, C.white, 1, null)), ...range(5).map((i) => line(`M${29 + i * 14} 76 L${29 + i * 14} 80`, '#cfe8ff', 1.4))),
  'evchg.underrede': all(rect(0, 0, 120, 120, '#e8e4dc', 0, null), rect(0, 108, 120, 12, '#b9b3a8', 0, null),
    rect(8, 40, 6, 70, STEEL, 1, C.ink, 1.2), rect(106, 40, 6, 70, STEEL, 1, C.ink, 1.2), rect(8, 54, 34, 4, STEEL, 1, C.ink, 1), rect(78, 54, 34, 4, STEEL, 1, C.ink, 1),
    evSide(60, 62, 0.95), rect(17, 48, 88, 6, HL, 2, C.ink, 1.4), line('M24 51 L98 51', '#b8401f', 1, '3 2'),
    person(56, '#4a6a9a', { s: 0.62, r: [10, -18], l: [-10, 18] }),
    path('M64 66 L52 56 L80 56 Z', 'rgba(255,230,140,.55)', null), frame(12, 44, 98, 14)),
  'evchg.batterihälsa': all(sky('#f3f6f8'), battery(14, 34, 84, 46, 4, 5, CHARGE),
    path('M56 46 C50 38 38 42 42 52 C44 58 56 66 56 66 C56 66 68 58 70 52 C74 42 62 38 56 46 Z', '#e85a6a', C.ink, 1.6),
    waPulse('evchealth', line('M10 98 L34 98 L40 88 L48 108 L54 92 L60 98 L110 98', HL, 2.6)), frame(8, 28, 102, 58)),
  'evchg.försämras': all(sky('#f3f6f8'),
    rect(14, 30, 80, 44, C.white, 4, C.ink, 2), rect(94, 42, 6, 20, C.ink, 1, null),
    ...range(5).map((i) => rect(19 + i * 15, 35, 12, 34, CHARGE, 2, null)),
    moving('evcworse1', '0%,25%{opacity:0}45%,100%{opacity:1}', { dur: 3.6 }, rect(79, 35, 12, 34, '#d6dadf', 2, null)),
    moving('evcworse2', '0%,50%{opacity:0}70%,100%{opacity:1}', { dur: 3.6 }, rect(64, 35, 12, 34, '#d6dadf', 2, null)),
    arrow(54, 84, 54, 108, C.red, 3.4), g('translate(86 96)', rect(-12, -10, 24, 20, C.white, 2, C.ink, 1.4), rect(-12, -10, 24, 6, C.red, 2, C.ink, 1.2)), g('translate(22 96)', rect(-12, -10, 24, 20, C.white, 2, C.ink, 1.4), rect(-12, -10, 24, 6, C.red, 2, C.ink, 1.2))),
  'evchg.batteribyte': all(rect(0, 0, 120, 120, '#e8e4dc', 0, null), rect(0, 108, 120, 12, '#b9b3a8', 0, null), rect(8, 30, 6, 80, STEEL, 1, C.ink, 1.2), rect(106, 30, 6, 80, STEEL, 1, C.ink, 1.2),
    evSide(60, 52, 0.95), moving('evcbyteold', '0%,20%{transform:translate(0,0);opacity:1}70%,100%{transform:translate(-40px,30px);opacity:0}', { dur: 3.4 }, greyed(rect(22, 54, 76, 10, '#7a7f88', 2, C.ink, 1.4))),
    waIn('evcbytenew', 40, 30, rect(22, 54, 76, 10, HL, 2, C.ink, 1.6), ...range(8).map((i) => rect(26 + i * 9, 56, 6, 6, '#f6c09a', 1, null))),
    rect(30, 98, 60, 6, STEEL, 2, C.ink, 1.2), line('M40 104 L40 108 M80 104 L80 108', C.dark, 3)),
  'evchg.andrahandsvärde': all(sky(), road(100), evSide(44, 100, 0.72, { col: '#6f95c4' }), path('M24 78 C28 80 30 76 33 79', 'none', C.ink, 1),
    path('M74 30 L104 30 L112 40 L104 50 L74 50 Z', '#f6e08a', HL, 2.4), circle(80, 40, 2.2, C.white, C.ink, 1), line('M88 36 L104 36 M88 44 L100 44', C.ink, 1.6),
    line('M62 60 C70 54 76 52 82 50', C.ink, 1, '2 2'),
    waIn('evcresale', 0, -12, coin(86, 74, 6), coin(98, 78, 6), coin(92, 66, 6)), arrow(56, 46, 70, 40, C.grey, 2)),

  // ── 4223 Batterikemi ──
  'evchg.anod': all(cellDiagram('anod', 'evcanod'), frame(16, 27, 26, 68)),
  'evchg.katod': all(cellDiagram('katod', 'evckatod'), frame(78, 27, 26, 68)),
  'evchg.elektrolyt': all(cellDiagram('elektrolyt', 'evcelyt'), ...([[50, 100], [60, 104], [70, 100]] as [number, number][]).map(([x, y]) => path(`M${x} ${y - 5} C${x + 4} ${y} ${x + 3} ${y + 4} ${x} ${y + 4} C${x - 3} ${y + 4} ${x - 4} ${y} ${x} ${y - 5} Z`, '#8cc7e8', C.ink, 0.8))),
  'evchg.grafit': all(sky('#f3f6f8'),
    g('translate(34 66) rotate(-35)', rect(-6, -40, 12, 60, C.yellow, 1, C.ink, 1.6), path('M-6 20 L6 20 L0 36 Z', '#e6c89a', C.ink, 1.4), path('M-2.4 30 L2.4 30 L0 36 Z', '#3a3a44', null)),
    moving('evcgraf', '0%{opacity:0}60%,100%{opacity:1}', { dur: 2.4 }, line('M50 96 C56 92 62 98 70 94', '#5a5d68', 2.6)),
    circle(86, 40, 26, C.white, HL, 2.6),
    ...range(3).map((k) => all(...range(3).map((i) => path(`M${70 + i * 11 + (k % 2) * 5} ${28 + k * 11} l5 -3 l5 3 l0 6 l-5 3 l-5 -3 Z`, 'none', '#3a3a44', 1.2)))),
    line('M60 92 L72 58', HL, 1.4, '2 2')),
  'evchg.nickel': all(sky('#f3f6f8'), ellipse(60, 100, 46, 8, '#d6dadf', null),
    ...([[34, 88], [48, 92], [62, 86], [76, 92], [90, 88], [42, 78], [56, 76], [70, 78], [84, 78], [62, 66]] as [number, number][]).map(([x, y]) => all(ellipse(x, y, 8, 6, '#d8dde2', C.ink, 1.4), path(`M${x - 4} ${y - 2} C${x - 2} ${y - 4} ${x + 2} ${y - 4} ${x + 4} ${y - 2}`, 'none', C.white, 1.4))),
    g('translate(92 34)', circle(0, 0, 14, '#c9ced4', C.ink, 1.6), circle(0, 0, 10, 'none', '#9aa3ad', 1.2)), waPulse('evcnick', path('M80 26 l3 -6 l3 6 l6 3 l-6 3 l-3 6 l-3 -6 l-6 -3 Z', C.white, null)), frame(22, 56, 78, 46)),
  'evchg.kobolt': all(sky('#f3f6f8'), path('M14 98 L22 70 L44 60 L66 66 L80 88 L70 104 L24 106 Z', '#8a7a6a', C.ink, 1.8),
    ...([[30, 82], [44, 74], [56, 88], [64, 76], [40, 94]] as [number, number][]).map(([x, y]) => path(`M${x} ${y - 7} L${x + 6} ${y} L${x} ${y + 7} L${x - 6} ${y} Z`, '#2346b0', C.ink, 1)),
    g('translate(96 74)', path('M-10 -20 L10 -20 C10 -12 16 -6 16 6 C16 22 -16 22 -16 6 C-16 -6 -10 -12 -10 -20 Z', C.white, C.ink, 1.6), path('M-12 0 C-6 -4 6 4 12 0 M-14 10 C-6 6 6 14 14 10', 'none', '#2346b0', 2.4)),
    waPulse('evckob', circle(44, 74, 10, 'none', '#7aa0ff', 1.6)), frame(10, 54, 74, 56)),
  'evchg.energitäthet': all(sky('#f3f6f8'), line('M60 30 L60 96', C.dark, 3), line('M20 52 L100 52', C.dark, 3), path('M50 104 L70 104 L60 94 Z', C.dark, C.ink, 1),
    greyed(rect(12, 54, 36, 28, C.white, 3, C.ink, 1.6), bolt(24, 68, 0.6), bolt(36, 68, 0.6)),
    rect(72, 54, 36, 28, C.white, 3, HL, 2.6), ...range(8).map((i) => bolt(78 + (i % 4) * 8, 61 + Math.floor(i / 4) * 14, 0.42)),
    waPulse('evcdens', rect(70, 52, 40, 32, 'none', 5, C.yellow, 1.6))),
  'evchg.laddcykel': all(sky('#f3f6f8'), battery(38, 8, 40, 20, 5, 5), battery(38, 92, 40, 20, 0, 5),
    waSpin('evccyc', 4, all(path('M24 60 A36 36 0 0 1 60 24', 'none', HL, 3), path('M96 60 A36 36 0 0 1 60 96', 'none', HL, 3), path('M60 24 L54 18 M60 24 L54 30', 'none', HL, 3), path('M60 96 L66 90 M60 96 L66 102', 'none', HL, 3))),
    bolt(60, 60, 1)),
  'evchg.natriumjonbatteri': all(sky('#f3f6f8'), g('translate(46 74)', rect(-20, -26, 40, 52, HL, 6, C.ink, 2), ellipse(0, -26, 20, 6, '#f6c09a', C.ink, 1.4), rect(-6, -34, 12, 6, STEEL, 1, C.ink, 1)),
    g('translate(92 30) rotate(30)', path('M-9 -8 L9 -8 L11 20 L-11 20 Z', C.white, C.ink, 1.6), path('M-9 -8 C-9 -18 9 -18 9 -8 Z', STEEL2, C.ink, 1.4), circle(-3, -12, 1, C.ink, null), circle(3, -12, 1, C.ink, null)),
    waIn('evcsalt', 18, -16, ...([[70, 46], [64, 52], [74, 54], [58, 44], [68, 38]] as [number, number][]).map(([x, y]) => rect(x - 2, y - 2, 4, 4, C.white, 0.5, C.ink, 0.8)))),

  // ── 4224 Laddkontakter ──
  'evchg.jordad': all(rect(0, 0, 120, 120, '#efe9df', 0, null), rect(16, 14, 72, 72, C.white, 10, C.ink, 2), circle(52, 50, 26, '#f3f3ee', C.ink, 1.6),
    circle(42, 50, 4, C.dark, null), circle(62, 50, 4, C.dark, null), rect(48, 22, 8, 7, HL, 1, C.ink, 1.2), rect(48, 71, 8, 7, HL, 1, C.ink, 1.2),
    path('M88 50 L102 50 L102 92', 'none', HL, 2.4), line('M92 92 L112 92 M95 98 L109 98 M99 104 L105 104', HL, 2.6),
    waPulse('evcjord', circle(52, 25.5, 7, 'none', C.yellow, 1.8), circle(52, 74.5, 7, 'none', C.yellow, 1.8))),
  'evchg.laddkontakt': all(sky('#f3f6f8'), path('M4 100 C30 104 34 80 44 70', 'none', C.dark, 6),
    g('translate(60 58) rotate(-20)', rect(-14, 6, 28, 36, '#3a3a44', 6, C.ink, 1.8), rect(-18, -14, 36, 22, '#2b2b30', 4, C.ink, 1.6)), plugFace(70, 32, 18),
    circle(60, 92, 7, C.skin, C.ink, 1.2), path('M54 88 C52 80 64 76 68 82', 'none', C.skin2, 3), ring(70, 32, 24)),
  'evchg.laddlucka': all(sky(), g('translate(0 0)', path('M0 28 L120 28 L120 112 L0 112 Z', CAR, C.ink, 1.8), path('M0 28 L70 28 L84 8 L120 8', 'none', C.ink, 1.6), path('M0 28 L66 28 L80 8 L0 8 Z', GLASS, C.ink, 1.2)),
    circle(30, 104, 26, C.dark, C.ink, 1.6), circle(30, 104, 10, STEEL2, null),
    rect(70, 44, 30, 26, '#1f2430', 4, C.ink, 1.4), plugFace(85, 57, 9, '#3a3a44'),
    moving('evcflap', '0%,20%{opacity:1}45%,100%{opacity:0}', { dur: 3.4 }, rect(70, 44, 30, 26, CAR, 4, C.ink, 1.6)),
    moving('evcflap2', '0%,20%{opacity:0}45%,100%{opacity:1}', { dur: 3.4 }, path('M100 44 L114 40 L114 74 L100 70 Z', HL, C.ink, 1.6)),
    frame(66, 38, 52, 38)),
  'evchg.koppla-ur': all(sky(), path('M0 30 L120 30 L120 112 L0 112 Z', CAR, C.ink, 1.8), path('M0 30 L60 30 L74 8 L0 8 Z', GLASS, C.ink, 1.2),
    rect(14, 46, 30, 26, '#1f2430', 4, C.ink, 1.4), plugFace(29, 59, 9, '#3a3a44'), path('M44 46 L58 42 L58 76 L44 72 Z', CAR, C.ink, 1.4),
    moving('evcunplug', '0%,15%{transform:translate(-30px,0)}65%,100%{transform:translate(0,0)}', { dur: 2.8 },
      g('translate(76 59)', rect(-8, -11, 26, 22, '#2b2b30', 4, C.ink, 1.6), rect(18, -6, 16, 12, '#3a3a44', 3, C.ink, 1.4), path('M34 0 C46 0 50 20 58 30', 'none', C.dark, 5), circle(4, -16, 7, C.skin, C.ink, 1.2), circle(4, 16, 7, C.skin, C.ink, 1.2))),
    circle(18, 112, 22, C.dark, C.ink, 1.6), circle(18, 112, 8, STEEL2, null), arrow(70, 92, 104, 92, HL, 3.4)),
  'evchg.laddbox': all(sky(), rect(0, 20, 76, 92, '#e8dccb', 0, C.ink, 1.6), path('M-4 22 L38 4 L80 22 Z', '#b55b45', C.ink, 1.6), rect(0, 108, 120, 12, '#b9b3a8', 0, null),
    wallbox(26, 56, 1.4), frame(8, 30, 36, 52), path('M26 77 C26 96 48 100 62 92', 'none', C.dark, 3),
    evSide(92, 108, 0.62, { port: true }), waPulse('evcbox', bolt(26, 63, 0.6))),

  // ── 4225 Snabbladdning ──
  'evchg.snabbladdning': all(sky(), road(102), fastCharger(18, 102, 1.05), evSide(78, 104, 0.7, { port: true }),
    rect(46, 14, 54, 22, C.white, 3, C.ink, 1.8), rect(100, 21, 4, 8, C.ink, 1, null),
    ...range(5).map((i) => moving(`evcfast${i}`, `0%,${8 + i * 12}%{opacity:0}${14 + i * 12}%,100%{opacity:1}`, { dur: 1.6 }, rect(49 + i * 10, 17, 8, 16, CHARGE, 1.5, null))),
    g('translate(28 22)', clock(0, 0, 10), hand(0, 0, 120, 7, C.red), rect(-2, -14, 4, 4, C.ink, 1, null)), bolt(64, 52, 1.1), bolt(80, 50, 0.8)),
  'evchg.normalladdning': all(rect(0, 0, 120, 120, NIGHT, 0, null), moon(100, 16, 9), star(20, 10), star(48, 20), star(76, 8),
    rect(0, 40, 56, 72, '#c9b9a0', 0, C.ink, 1.6), path('M-4 42 L28 22 L60 42 Z', '#7a4a3a', C.ink, 1.6), rect(8, 54, 14, 14, '#f6e08a', 1, C.ink, 1), rect(0, 108, 120, 12, '#5a5d68', 0, null),
    wallbox(40, 70, 0.9), path('M40 84 C42 100 60 102 66 96', 'none', C.dark, 2.6), evSide(88, 108, 0.6, { port: true }),
    rect(58, 30, 46, 18, C.white, 3, C.ink, 1.6), rect(104, 35, 3, 8, C.white, 1, null),
    ...range(4).map((i) => moving(`evcslow${i}`, `0%,${10 + i * 20}%{opacity:0}${18 + i * 20}%,100%{opacity:1}`, { dur: 6 }, rect(61 + i * 10.5, 33, 8.5, 12, CHARGE, 1.5, null)))),
  'evchg.laddstation': all(sky(), road(104), path('M4 30 L116 30 L112 38 L8 38 Z', C.white, C.ink, 1.6), line('M12 38 L12 104 M108 38 L108 104', STEEL, 3),
    ...[24, 48, 72, 96].map((x) => fastCharger(x, 100, 0.55, '#e9edf0', false)), evSide(36, 106, 0.32), evSide(84, 106, 0.32, { col: '#c84a3f' }),
    waPulse('evcstation', bolt(60, 24, 0.7)), frame(2, 26, 116, 82)),
  'evchg.laddplats': all(rect(0, 0, 120, 120, '#9a9fa8', 0, null), line('M24 10 L24 116 M96 10 L96 116', C.white, 3),
    rect(26, 12, 68, 102, 'rgba(92,192,106,.25)', 0, null), path('M64 40 L46 66 L58 66 L52 90 L74 60 L62 60 L68 40 Z', 'none', C.white, 3),
    g('translate(60 8)', rect(-10, -6, 20, 12, '#e9edf0', 2, C.ink, 1.4), bolt(0, 0, 0.45)), greyed(evTop(8, 70, 0.5), evTop(112, 70, 0.5)),
    rect(24, 4, 72, 112, 'none', 3, HL, 2.6), waPulse('evcplats', path('M64 40 L46 66 L58 66 L52 90 L74 60 L62 60 L68 40 Z', 'none', C.yellow, 1.4))),
  'evchg.kö': all(sky('#f4efe6'), rect(0, 108, 120, 12, '#d8d2c6', 0, null), rect(96, 30, 24, 80, '#c8d8e8', 2, C.ink, 1.6), rect(100, 40, 16, 14, GLASS, 1, C.ink, 1),
    person(84, C.green, { s: 0.7, r: [14, 4] }), person(64, C.red, { s: 0.7, hair: '#8a5a3a' }), person(44, '#f2c14e', { s: 0.7 }), person(24, C.purple, { s: 0.7, hair: '#c9a26a' }), person(6, '#4a6a9a', { s: 0.7 }),
    arrow(20, 30, 70, 30, HL, 3)),
  'evchg.laddeffekt': all(sky('#f3f6f8'), fastCharger(20, 108, 1.1, '#e9edf0', false), path('M33 80 C60 80 70 88 100 88', 'none', C.dark, 10), path('M33 80 C60 80 70 88 100 88', 'none', HL, 4),
    waIn('evceff', -40, 0, bolt(56, 70, 0.7), bolt(74, 76, 0.7), bolt(92, 78, 0.7)),
    g('translate(84 36)', path('M-26 0 A26 26 0 0 1 26 0', 'none', '#d6dadf', 8), path('M-26 0 A26 26 0 0 1 18 -18', 'none', HL, 8), line('M0 0 L16 -18', C.ink, 2.6), circle(0, 0, 3, C.dark, null))),
  'evchg.laddkurva': all(sky('#f3f6f8'), line('M16 14 L16 96 L110 96', C.ink, 2.4), battery(20, 100, 22, 10, 1, 4), battery(84, 100, 22, 10, 4, 4),
    path('M18 40 C30 30 50 30 82 32 C90 34 94 60 106 84', 'none', HL, 3.2), line('M82 20 L82 96', C.grey, 1.4, '3 3'),
    moving('evccurve', '0%{transform:translate(-60px,6px)}55%{transform:translate(0,0)}100%{transform:translate(22px,50px)}', { dur: 4 }, circle(84, 33, 4, C.yellow, C.ink, 1.2)),
    bolt(8, 30, 0.6)),
  'evchg.laddtid': all(sky('#f3f6f8'), clock(42, 52, 30), path('M42 22 A30 30 0 0 1 70 62', 'none', HL, 5),
    waSpin('evctime', 4, path('M42 74 L42 30', 'none', 'none', 0), line('M42 52 L42 30', C.red, 2.4)), circle(42, 52, 3, C.ink, null),
    battery(64, 88, 44, 20, 3, 5)),
  'evchg.laddapp': all(sky('#f3f6f8'), phone(60, 58, all(rect(-11, -19, 22, 26, '#d8ecd8', 1, null), path('M-11 -4 L11 -12 M-6 -19 L2 7', 'none', C.white, 2.4),
    g('translate(-3 -10)', path('M0 6 C-6 -1 -6 -8 0 -8 C6 -8 6 -1 0 6 Z', HL, C.ink, 1), bolt(0, -3, 0.25)), g('translate(5 0)', path('M0 6 C-6 -1 -6 -8 0 -8 C6 -8 6 -1 0 6 Z', '#9aa3ad', C.ink, 1)),
    rect(-8, 9, 16, 7, CHARGE, 3, C.ink, 0.8), path('M-2 10.5 L-2 14.5 L2 12.5 Z', C.white, null)), 2),
    waPulse('evcapp', circle(54, 38, 9, 'none', HL, 2)), circle(76, 92, 8, C.skin, C.ink, 1.2)),
  'evchg.laddkort': all(sky('#f3f6f8'), fastCharger(84, 112, 1.3, '#e9edf0', false), rect(76, 52, 16, 12, '#3a3a44', 2, C.ink, 1),
    g('translate(42 58) rotate(-10)', rect(-22, -14, 44, 28, HL, 4, C.ink, 1.8), rect(-16, -8, 9, 7, C.gold, 1, C.ink, 0.8), line('M-16 6 L10 6', C.white, 2)),
    waPulse('evccard', path('M66 50 C70 54 70 62 66 66 M70 46 C76 52 76 64 70 70', 'none', C.ink, 1.6)), circle(30, 76, 7, C.skin, C.ink, 1.2)),
  'evchg.laddinfrastruktur': all(rect(0, 0, 120, 120, '#e8f0e4', 0, null), path('M30 4 C40 20 34 40 46 56 C58 72 52 92 60 116', 'none', '#f2d06a', 5), path('M4 70 C30 64 60 60 116 40', 'none', '#f2d06a', 5), path('M70 4 C74 30 90 60 116 96', 'none', '#f2d06a', 4),
    ...([[34, 24], [46, 56], [56, 96], [18, 67], [86, 50], [74, 22], [96, 74], [108, 92]] as [number, number][]).map(([x, y], i) => g(`translate(${x} ${y})`, path('M0 8 C-7 0 -7 -8 0 -8 C7 -8 7 0 0 8 Z', i % 3 ? HL : '#3cc46a', C.ink, 1.2), bolt(0, -2, 0.3))),
    waPulse('evcinfra', circle(46, 56, 12, 'none', HL, 1.6), circle(96, 74, 12, 'none', HL, 1.6))),

  // ── 4226 Regenerativ bromsning ──
  'evchg.regenerativ-bromsning': all(sky(), road(100), evSide(64, 100, 1.05),
    rect(30, 76, 64, 8, CHARGE, 2, C.ink, 1.4), line('M2 60 L20 60 M6 70 L18 70 M2 80 L14 80', C.grey, 2),
    waIn('evcregen1', -6, 6, circle(40, 82, 2.4, C.yellow, C.ink, 0.6), circle(46, 80, 2.4, C.yellow, C.ink, 0.6)), waIn('evcregen2', 6, 6, circle(88, 82, 2.4, C.yellow, C.ink, 0.6), circle(82, 80, 2.4, C.yellow, C.ink, 0.6)),
    ring(34.6, 90.6, 13), ring(95.5, 90.6, 13), arrow(44, 26, 84, 26, HL, 3), bolt(64, 26, 0.8), battery(46, 40, 36, 16, 4, 5)),
  'evchg.släppa-gasen': all(rect(0, 0, 120, 120, '#3a3a44', 0, null), rect(0, 96, 120, 24, '#2b2b30', 0, null),
    g('translate(36 70)', rect(-14, -12, 28, 22, '#5a5d68', 3, C.ink, 1.4), line('M0 -12 L0 -36', '#5a5d68', 3)), g('translate(80 70)', rect(-8, -22, 16, 38, '#5a5d68', 3, HL, 2.6), line('M0 -22 L0 -40', '#5a5d68', 3)),
    moving('evcliftoff', '0%,15%{transform:translate(0,0)}60%,100%{transform:translate(0,-26px)}', { dur: 2.6 }, g('translate(82 74)', path('M-10 -40 L6 -40 L8 -4 C8 4 -12 4 -12 -4 Z', '#2f4a7a', C.ink, 1.4), path('M-14 -4 L10 -4 L12 8 L-16 8 Z', '#5a3a2a', C.ink, 1.4))),
    arrow(104, 70, 104, 34, HL, 3), g('translate(30 22)', circle(0, 0, 14, '#1f2430', C.ink, 1.4), moving('evcneedle', '0%,15%{transform:rotate(70deg)}60%,100%{transform:rotate(0deg)}', { dur: 2.6, spin: true }, path('M-10 8 L10 -8', 'none', 'none', 0), line('M0 0 L-10 -8', '#7ef0a0', 2.2)), circle(0, 0, 1.8, '#7ef0a0', null))),
  'evchg.rulla.3': all(sky(), rect(0, 96, 120, 24, '#9a9fa8', 0, null), rect(80, 20, 40, 76, '#d8d2c6', 0, C.ink, 1.6), rect(84, 30, 32, 8, '#3f6fb5', 1, null),
    moving('evcroll', '0%{transform:translate(-50px,0)}100%{transform:translate(0,0)}', { dur: 5 },
      g('translate(46 98)', rect(-40, -40, 70, 34, '#f2c14e', 6, C.ink, 1.8), ...range(4).map((i) => rect(-34 + i * 15, -34, 11, 12, GLASS, 1.5, C.ink, 0.8)), rect(18, -34, 10, 26, GLASS, 1.5, C.ink, 0.8),
        waSpin('evcrollw1', 3, circle(-24, -6, 7, C.dark, C.ink, 1.2), line('M-24 -12 L-24 0', STEEL2, 1.6)), waSpin('evcrollw2', 3, circle(16, -6, 7, C.dark, C.ink, 1.2), line('M16 -12 L16 0', STEEL2, 1.6)))),
    line('M2 70 L10 70 M2 78 L8 78', C.grey, 1.6)),
  'evchg.enpedalskörning': all(rect(0, 0, 120, 120, '#3a3a44', 0, null), rect(0, 96, 120, 24, '#2b2b30', 0, null),
    greyed(g('translate(36 70)', rect(-14, -12, 28, 22, '#5a5d68', 3, C.ink, 1.4), line('M0 -12 L0 -36', '#5a5d68', 3))), cross(36, 70, 10, '#ff8a7a'),
    g('translate(80 70)', rect(-8, -22, 16, 38, '#5a5d68', 3, HL, 2.6), line('M0 -22 L0 -40', '#5a5d68', 3)),
    waBobFoot(), circle(100, 22, 13, HL, C.ink, 1.4), path('M97 16 L101 13 L101 31 M97 31 L105 31', 'none', C.white, 2.6)),
  'evchg.ryckig': all(sky(), road(100),
    waShake('evcjerk', g('translate(0 0)', evSide(58, 100, 1), circle(52, 66, 5.5, C.skin, C.ink, 1.2), path('M47 64 C47 58 57 58 57 64', C.hair, null))),
    line('M6 60 L12 54 L18 60 L24 54 M6 76 L12 70 L18 76 L24 70', HL, 2.2), g('translate(98 36)', path('M-7 -6 L7 -6 L6 6 C6 9 -6 9 -6 6 Z', C.white, C.ink, 1.4), path('M7 -6 C12 -10 16 -4 18 2', 'none', '#7a4a2a', 2.4)),
    moving('evcspill', '0%{opacity:0;transform:translate(0,-4px)}50%,100%{opacity:1;transform:translate(0,0)}', { dur: 1.2 }, circle(116, 48, 2, '#7a4a2a', null), circle(112, 54, 1.6, '#7a4a2a', null))),
  'evchg.stadstrafik': all(sky(), rect(0, 20, 26, 80, '#c8b8a8', 0, C.ink, 1.4), rect(28, 34, 22, 66, '#d8cfc0', 0, C.ink, 1.4), rect(84, 26, 36, 74, '#b8c4cc', 0, C.ink, 1.4),
    ...range(6).map((i) => rect(4 + (i % 2) * 10, 28 + Math.floor(i / 2) * 18, 7, 9, GLASS, 1, C.ink, 0.6)), ...range(4).map((i) => rect(90 + (i % 2) * 14, 34 + Math.floor(i / 2) * 18, 9, 10, GLASS, 1, C.ink, 0.6)),
    road(96), line('M40 100 L40 116 M48 100 L48 116 M56 100 L56 116 M64 100 L64 116', C.white, 3),
    g('translate(72 56)', rect(-2, 0, 4, 40, C.dark, 1, null), rect(-6, -24, 12, 26, C.black, 3, C.ink, 1.2), circle(0, -17, 3.2, C.red, null), circle(0, -5, 3.2, '#2f4a3a', null)),
    moving('evccity', '0%,10%{transform:translate(-30px,0)}50%,70%{transform:translate(0,0)}100%{transform:translate(0,0)}', { dur: 4 }, evSide(18, 108, 0.36)), evSide(100, 112, 0.36, { col: '#c84a3f' })),

  // ── 4227 Räckvidd och energiförbrukning ──
  'evchg.takbox': all(sky(), road(100), evSide(60, 100, 1.05), path('M30 46 L36 36 L86 36 L92 46 Z', HL, C.ink, 1.8), line('M34 46 L88 46', '#b8401f', 1.4),
    line('M18 34 L28 38 M14 42 L26 44', '#9aa3ad', 1.6), rect(24, 46, 4, 4, C.dark, 1, null), rect(92, 46, 4, 4, C.dark, 1, null), frame(26, 30, 70, 20)),
  'evchg.förvärma': all(rect(0, 0, 120, 120, '#eef5fa', 0, null), rect(0, 100, 120, 20, C.white, 0, '#c8d8e4', 1), ...([[14, 14], [40, 24], [104, 12], [86, 30]] as [number, number][]).map(([x, y]) => flake(x, y, 0.7)),
    wallbox(12, 74, 0.8), path('M12 86 C14 100 22 100 26 94', 'none', C.dark, 2.4), evSide(70, 104, 0.95, { port: true }),
    moving('evcfrost', '0%,20%{opacity:1}70%,100%{opacity:0}', { dur: 3.4 }, path('M51 72 L67 72 L67 61 L40 61 Z', ICE, null), path('M71 72 L82 72 L92 61 L71 61 Z', ICE, null)),
    waPulse('evcwarm', heatWave(56, 56, 14), heatWave(66, 54, 16), heatWave(78, 56, 14)), g('translate(100 60)', phone(0, 0, all(clock(0, -4, 7), hand(0, -4, 60, 5)), 0.6))),
  'evchg.körstil': all(sky('#f3f6f8'), rect(0, 60, 120, 2, C.grey2, 0, null),
    greyed(path('M6 100 L16 80 L24 104 L34 76 L44 102 L52 82', 'none', C.dark, 3), cross(30, 112, 5)),
    path('M64 100 C74 88 84 112 94 100 C100 92 108 96 116 92', 'none', HL, 3.6), tick(90, 112, 1.2),
    g('translate(36 30)', circle(0, 0, 16, 'none', C.dark, 4), line('M-16 0 L16 0 M0 0 L0 16', C.dark, 3)), waSway('evcstyle', 8, g('translate(90 30)', circle(0, 0, 16, 'none', HL, 4), line('M-16 0 L16 0 M0 0 L0 16', HL, 3))),
    line('M60 8 L60 112', C.grey2, 1.4, '3 3')),
  'evchg.körläge': all(rect(0, 0, 120, 120, '#2b2b30', 0, null), circle(60, 66, 30, '#3a3a44', C.ink, 2), circle(60, 66, 18, '#5a5d68', C.ink, 1.6),
    g('translate(26 34)', path('M0 8 C-8 0 -4 -10 8 -10 C10 2 6 8 0 8 Z M0 8 L6 -4', CHARGE, C.ink, 1.4)), g('translate(60 22)', circle(0, 0, 6, '#9aa3ad', C.ink, 1.2)), g('translate(94 34)', path('M0 8 C-6 4 -4 -4 0 -10 C2 -4 8 -2 6 4 C5 7 2 8 0 8 Z', '#e4572e', C.ink, 1.2)),
    moving('evcmode', '0%,20%{transform:rotate(45deg)}60%,100%{transform:rotate(0deg)}', { dur: 3, spin: true }, g('translate(60 66) rotate(-45)', path('M0 26 L0 -26', 'none', 'none', 0), line('M0 0 L0 -26', HL, 4))),
    ring(26, 34, 13), circle(60, 66, 4, C.white, null)),
  'evchg.räckviddsångest': all(sky(), road(100), path('M60 100 L76 64 L84 64 L96 100 Z', '#9a9fa8', null), g('translate(86 52)', line('M0 0 L0 -20', C.dark, 2), path('M0 -20 L12 -16 L0 -12 Z', C.green, C.ink, 1)),
    rect(4, 60, 54, 44, '#2b2b30', 6, C.ink, 1.6), battery(10, 74, 34, 16, 1, 5, C.red, '#cfe8ff'), waPulse('evcanx', rect(13, 77, 5.6, 10, C.red, 1.5, null), circle(52, 66, 3, C.red, null)),
    g('translate(34 0)', circle(0, 36, 14, C.skin, C.ink, 1.6), path('M-14 34 C-14 18 14 18 14 34 C8 26 -8 26 -14 34 Z', C.hair, null), path('M-7 31 L-2 28 M7 31 L2 28', 'none', C.ink, 1.4), circle(-5, 36, 1.4, C.ink, null), circle(5, 36, 1.4, C.ink, null), path('M-5 44 C-2 41 2 41 5 44', 'none', C.ink, 1.4),
      moving('evcsweat', '0%{transform:translate(0,-4px);opacity:0}40%{opacity:1}100%{transform:translate(0,8px);opacity:0}', { dur: 1.6 }, path('M17 28 C20 33 19 36 17 36 C15 36 14 33 17 28 Z', '#8cc7e8', C.ink, 0.8)))),
  'evchg.laddstopp': all(rect(0, 0, 120, 120, '#e8f0e4', 0, null), path('M10 104 C30 96 40 80 56 66 C72 52 88 40 106 18', 'none', '#f2d06a', 6),
    circle(10, 104, 5, CAR, C.ink, 1.2), g('translate(106 18)', path('M0 0 L-14 0 L-7 -10 Z', C.white, C.ink, 1), path('M-12 0 L-2 -14 L8 0 Z', '#9aa3ad', C.ink, 1.2)),
    g('translate(56 66)', circle(0, 0, 14, HL, C.ink, 1.8), rect(-5, -6, 3.4, 12, C.white, 1, null), rect(1.6, -6, 3.4, 12, C.white, 1, null)), waPulse('evcstop', circle(56, 66, 19, 'none', HL, 2)),
    g('translate(84 94)', fastCharger(0, 14, 0.42, '#e9edf0', false), g('translate(16 6)', path('M-5 -5 L5 -5 L4 4 C4 6 -4 6 -4 4 Z', C.white, C.ink, 1), path('M-2 -8 C-1 -11 1 -11 0 -14', 'none', C.grey, 1))), line('M64 74 L78 88', HL, 1.4, '2 2')),
  'evchg.ruttplanerare': all(rect(0, 0, 120, 120, '#2b2b30', 0, null), rect(8, 14, 104, 80, '#dfe9e0', 5, C.ink, 1.8),
    path('M14 80 C30 60 44 70 56 50 C68 30 86 40 104 22', 'none', '#f6f2ea', 6), path('M14 80 C30 60 44 70 56 50 C68 30 86 40 104 22', 'none', HL, 3, ),
    ...([[34, 66], [72, 38]] as [number, number][]).map(([x, y]) => g(`translate(${x} ${y})`, circle(0, 0, 7, C.white, C.ink, 1.2), bolt(0, 0, 0.42))), circle(14, 80, 4, CAR, C.ink, 1), g('translate(104 22)', line('M0 0 L0 -12', C.ink, 1.6), path('M0 -12 L8 -9 L0 -6 Z', C.green, null)),
    waIn('evcroute', -20, 16, circle(56, 50, 3.4, C.yellow, C.ink, 1)), rect(40, 100, 40, 12, '#3a3a44', 3, C.ink, 1)),
};

/** Foot resting on the single (gas) pedal that rises and falls a little: the car is driven and stopped with one pedal. */
function waBobFoot(): Svg {
  return moving('evconefoot', '0%,100%{transform:translate(0,0)}50%{transform:translate(0,-12px)}', { dur: 2.6 },
    g('translate(82 74)', path('M-10 -40 L6 -40 L8 -4 C8 4 -12 4 -12 -4 Z', '#2f4a7a', C.ink, 1.4), path('M-14 -4 L10 -4 L12 8 L-16 8 Z', '#5a3a2a', C.ink, 1.4)));
}
