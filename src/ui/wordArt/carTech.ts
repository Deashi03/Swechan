/**
 * Teknik & digital värld → Transportteknik → Bilens teknik, 4211–4217 (0.60): combustion engines, gearbox and
 * transmission, brakes, steering and suspension, the car's electrical system, the exhaust system and fault finding.
 * Recurring signs: the part that the word names is orange (or framed or ringed in orange); grey parts show what the
 * word is not. Cars are blue, steel parts light grey, oil amber, coolant turquoise, heat red-orange, electricity a
 * yellow bolt, cold light blue, sound short curved strokes. Words that are easy to mix up get clearly different
 * scenes: bensinmotor (a cylinder with a spark and a green pump nozzle) and dieselmotor (no spark, glowing hot air,
 * a lorry and a black nozzle); tändstift (one plug close up); vevaxel (the orange crank under grey pistons) and kamrem
 * (a toothed belt round three pulleys); motorolja (a can pouring) and oljesticka (the stick held up with the mark);
 * tomgång (a parked car, needle low) and rusa (the needle in the red, the engine shaking); framhjulsdrift (front
 * wheels orange) and fyrhjulsdrift (all four orange, in snow); bromsskiva (the disc turning), bromsbelägg (two pads
 * pressed in), bromsok (the clamp); ABS-broms (a curve round a cone on ice) and låsa sig (a locked wheel with skid
 * marks); helljus (long beams on an empty road) and blända av (the beam goes short when a car comes); katalysator
 * (a honeycomb, coloured gas becomes clear) and partikelfilter (black soot caught); knacka (a hit at the piston),
 * hacka (a car that jerks), skramla (a loose pipe shaking) and tjuta (a high, tight wave from a belt).
 * Digits and code signs only; no letters, no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, sparkle, waBob, waGrow, waIn, waPulse, waShake, waSpin, waSway, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const CAR = '#3a6ab0';
const GLASS = '#bfe3f5';
const TYRE = '#2b2b30';
const RIM = '#c8ced4';
const STEEL = '#b8c0c8';
const STEEL2 = '#8d949b';
const DARKM = '#5a5d68';
const OIL = '#d9a420';
const COOL = '#3fbcc8';
const HOT = '#e4572e';
const ROAD = '#8a8f98';
const NIGHT = '#1f2a44';
const LAMP = '#ffe08a';
const RED = '#e8302c';
const ICE = '#d7eef8';
const SNOW = '#f4f8fb';
const GRASS = '#9fcf8a';
const SOOT = '#2e2e36';
const f1 = (n: number) => +n.toFixed(1);
const rad = (d: number) => (d * Math.PI) / 180;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const bg = (col: string = '#eef3f6') => rect(0, 0, 120, 120, col, 0, null);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 5, col, 2.6);
const cross = (x: number, y: number, s = 6, col: string = RED) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 3);
const tick = (x: number, y: number, s = 1, col: string = C.green) => line(`M${x - 4 * s} ${y} L${x - 1 * s} ${y + 3 * s} L${x + 5 * s} ${y - 4 * s}`, col, 2.8);
const bolt = (x: number, y: number, s = 1, col: string = C.yellow) => g(`translate(${x} ${y}) scale(${s})`, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', col, C.ink, 1.4));
const burst = (x: number, y: number, r = 10, col: string = C.yellow) => {
  const pts = range(16).map((i) => { const a = (i * Math.PI) / 8, rr = i % 2 ? r * 0.45 : r; return `${f1(x + Math.cos(a) * rr)} ${f1(y + Math.sin(a) * rr)}`; });
  return path(`M${pts.join(' L')} Z`, col, C.ink, 1.2);
};
const puff = (x: number, y: number, s = 1, col: string = C.grey2) => g(`translate(${x} ${y}) scale(${s})`, path('M-8 0 C-14 0 -14 -8 -8 -8 C-8 -14 0 -16 3 -11 C8 -15 15 -11 12 -5 C17 -4 16 3 10 3 Z', col, C.ink, 1.1));
const flake = (x: number, y: number, s = 1, col = '#5aa9d6') => g(`translate(${x} ${y}) scale(${s})`, line('M0 -7 L0 7 M-6 -3.5 L6 3.5 M-6 3.5 L6 -3.5', col, 2));
const heat = (x: number, y: number, h = 14, col: string = HOT) => line(`M${x} ${y} C${x - 4} ${y - h / 4} ${x + 4} ${y - h / 2} ${x} ${y - (3 * h) / 4} C${x - 3} ${y - h} ${x} ${y - h} ${x} ${y - h}`, col, 2);
/** Sound: n short arcs opening to the right (dir 1) or left (dir -1). */
const sound = (x: number, y: number, n = 3, dir = 1, col: string = C.ink, tight = false) => all(...range(n).map((i) => {
  const r = 5 + i * (tight ? 3 : 5), h = tight ? r * 0.5 : r * 0.8;
  return line(`M${f1(x + dir * r * 0.5)} ${f1(y - h)} Q${f1(x + dir * r)} ${y} ${f1(x + dir * r * 0.5)} ${f1(y + h)}`, col, tight ? 1.6 : 2);
}));
const zig = (x: number, y: number, w = 16, col: string = C.ink) => line(`M${x} ${y} l${w / 6} -4 l${w / 6} 8 l${w / 6} -8 l${w / 6} 8 l${w / 6} -8 l${w / 6} 4`, col, 1.6);
const clock = (x: number, y: number, r = 10, deg = 60) => all(circle(x, y, r, C.white, C.ink, 1.6), line(`M${x} ${y} L${x} ${y - r * 0.6}`, C.ink, 1.6), g(`translate(${x} ${y}) rotate(${deg})`, line(`M0 0 L0 ${-r * 0.8}`, C.red, 1.4)), circle(x, y, 1.3, C.ink, null));

// ── Car parts ────────────────────────────────────────────────────────
/** Wheel seen from the side: tyre, rim (orange when hl) and five spokes. */
const tyre = (x: number, y: number, r: number, o: { rim?: string; spokes?: boolean } = {}) => all(circle(x, y, r, TYRE, C.ink, 1.6), circle(x, y, r * 0.62, o.rim ?? RIM, C.ink, 1.2),
  o.spokes === false ? '' : all(...range(5).map((i) => { const a = rad(i * 72 - 90); return line(`M${f1(x + Math.cos(a) * r * 0.16)} ${f1(y + Math.sin(a) * r * 0.16)} L${f1(x + Math.cos(a) * r * 0.56)} ${f1(y + Math.sin(a) * r * 0.56)}`, STEEL2, r * 0.12); })),
  circle(x, y, r * 0.16, DARKM, C.ink, 1));
/** Car from the side, front to the right; wheels touch y + 5 (use y = 107 for the ground). */
const carSide = (x: number, y: number, s = 1, o: { col?: string; head?: string; rear?: string; win?: string } = {}) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-46 -6 L-46 -20 L-40 -22 L-26 -38 L14 -38 L28 -22 L46 -18 L48 -6 Z', o.col ?? CAR, C.ink, 1.8), path('M-22 -34 L-4 -34 L-4 -22 L-34 -22 Z', o.win ?? GLASS, C.ink, 1), path('M0 -34 L12 -34 L22 -22 L0 -22 Z', o.win ?? GLASS, C.ink, 1),
  rect(40, -16, 7, 5, o.head ?? '#f6f2d8', 1.4, C.ink, 0.8), rect(-47, -17, 5, 5, o.rear ?? '#c43a32', 1, C.ink, 0.6), tyre(-28, -4, 9), tyre(30, -4, 9));
/** Car from above, front up, centre (x, y). hl = [front left, front right, rear left, rear right]. */
const carTop = (x: number, y: number, s = 1, o: { col?: string; hl?: boolean[]; rot?: number } = {}) => {
  const hl = o.hl ?? [false, false, false, false];
  const w = (cx: number, cy: number, on: boolean) => rect(cx - 3.5, cy - 7, 7, 14, on ? HL : TYRE, 2, C.ink, 1);
  return g(`translate(${x} ${y}) rotate(${o.rot ?? 0}) scale(${s})`, w(-17, -17, hl[0]!), w(17, -17, hl[1]!), w(-17, 19, hl[2]!), w(17, 19, hl[3]!),
    rect(-15, -32, 30, 64, o.col ?? CAR, 8, C.ink, 1.6), rect(-11, -16, 22, 11, GLASS, 2, C.ink, 0.8), rect(-11, 14, 22, 8, GLASS, 2, C.ink, 0.8));
};
/** Car from behind (rear view), wheels at y. */
const carRear = (x: number, y: number, s = 1, o: { col?: string; lights?: string; third?: boolean } = {}) => g(`translate(${x} ${y}) scale(${s})`,
  rect(-36, -6, 12, 10, TYRE, 2, C.ink, 1.2), rect(24, -6, 12, 10, TYRE, 2, C.ink, 1.2), path('M-38 -2 L-38 -24 L-26 -46 L26 -46 L38 -24 L38 -2 Z', o.col ?? CAR, C.ink, 1.8),
  path('M-22 -42 L22 -42 L30 -27 L-30 -27 Z', GLASS, C.ink, 1.1), rect(-35, -20, 12, 7, o.lights ?? '#c43a32', 1.5, C.ink, 1), rect(23, -20, 12, 7, o.lights ?? '#c43a32', 1.5, C.ink, 1),
  o.third ? rect(-8, -45, 16, 3, o.lights ?? '#c43a32', 1, C.ink, 0.8) : '', rect(-12, -14, 24, 8, C.white, 1, C.ink, 0.8));
const road = (y = 98) => all(rect(0, y, 120, 120 - y, ROAD, 0, null), line(`M0 ${y + 8} L120 ${y + 8}`, C.white, 1.4, '8 6'));
/** Engine cylinder in cut-away: piston top at py; crank pin circle under it. */
const cyl = (x: number, y: number, py: number, o: { plug?: boolean; fire?: string; wall?: string; piston?: string } = {}) => all(
  rect(x - 13, y - 34, 26, 40, o.wall ?? '#dfe3e7', 2, C.ink, 1.6), rect(x - 10, y - 32, 20, 36, '#f6f2ea', 1, null),
  o.fire ? path(`M${x - 10} ${y - 32} L${x + 10} ${y - 32} L${x + 10} ${py} L${x - 10} ${py} Z`, o.fire, null) : '',
  o.plug ? all(rect(x - 3, y - 44, 6, 12, C.white, 1.5, C.ink, 1.2), rect(x - 4, y - 36, 8, 4, STEEL2, 1, C.ink, 0.8)) : '',
  rect(x - 10, py, 20, 10, o.piston ?? STEEL, 2, C.ink, 1.4), line(`M${x - 10} ${py + 3} L${x + 10} ${py + 3}`, C.ink, 0.8), line(`M${x} ${py + 8} L${x} ${y + 14}`, STEEL2, 4), circle(x, y + 14, 4, DARKM, C.ink, 1.2));
/** Engine block seen from the front-side. */
const engine = (x: number, y: number, s = 1, col: string = '#9aa3ad') => g(`translate(${x} ${y}) scale(${s})`, rect(-26, -22, 52, 34, col, 4, C.ink, 1.8), rect(-30, -30, 60, 10, '#7a838d', 3, C.ink, 1.6),
  ...range(4).map((i) => circle(-18 + i * 12, -25, 3, DARKM, C.ink, 0.8)), rect(-20, 12, 40, 6, DARKM, 2, C.ink, 1.2), ...range(3).map((i) => line(`M${-18 + i * 18} -12 L${-18 + i * 18} 6`, '#7a838d', 1.4)));
/** Three pedals seen from the driver's seat: clutch, brake, gas (only the gas and brake when two). */
const pedals = (hl: 'clutch' | 'brake' | 'gas' | null, three = true) => {
  const p = (x: number, w: number, on: boolean, h = 24) => all(line(`M${x} 30 L${x} ${80 - h / 2}`, DARKM, 3), rect(x - w / 2, 80 - h / 2, w, h, on ? HL : '#5a5d68', 3, C.ink, on ? 2 : 1.2));
  return all(rect(0, 0, 120, 120, '#3a3a44', 0, null), rect(0, 96, 120, 24, '#2b2b30', 0, null), rect(0, 20, 120, 10, '#2b2b30', 0, null),
    three ? p(26, 22, hl === 'clutch') : '', p(three ? 60 : 50, 24, hl === 'brake'), p(three ? 94 : 88, 12, hl === 'gas', 34));
};
const shoe = (x: number, y: number, col: string = '#2f4a7a') => g(`translate(${x} ${y})`, path('M-8 -34 L6 -34 L7 0 L-9 0 Z', col, C.ink, 1.4), path('M-12 0 L10 0 L12 12 L-14 12 Z', '#5a3a2a', C.ink, 1.4));
/** H gear gate seen from above with the knob at (kx, ky). */
const gate = (x: number, y: number, kx: number, ky: number, o: { knob?: string; digits?: boolean } = {}) => all(rect(x - 30, y - 30, 60, 60, '#3a3a44', 6, C.ink, 1.6),
  line(`M${x - 18} ${y - 18} L${x - 18} ${y + 18} M${x} ${y - 18} L${x} ${y + 18} M${x + 18} ${y - 18} L${x + 18} ${y + 18} M${x - 18} ${y} L${x + 18} ${y}`, '#7a838d', 4),
  o.digits === false ? '' : all(T(x - 18, y - 21, '1', 7, C.white), T(x - 18, y + 27, '2', 7, C.white), T(x, y - 21, '3', 7, C.white), T(x, y + 27, '4', 7, C.white), T(x + 18, y - 21, '5', 7, C.white)),
  circle(kx, ky, 7, o.knob ?? C.dark, C.ink, 1.6));
const gauge = (x: number, y: number, r: number, frac: number, o: { red?: boolean; col?: string } = {}) => {
  const a = Math.PI * (1 - frac);
  return all(circle(x, y, r, '#1f2430', C.ink, 1.6), path(`M${f1(x - r * 0.8)} ${y} A${f1(r * 0.8)} ${f1(r * 0.8)} 0 0 1 ${f1(x + r * 0.8)} ${y}`, 'none', '#5a5d68', 2),
    o.red ? path(`M${f1(x + r * 0.8 * Math.cos(rad(35)))} ${f1(y - r * 0.8 * Math.sin(rad(35)))} A${f1(r * 0.8)} ${f1(r * 0.8)} 0 0 1 ${f1(x + r * 0.8)} ${y}`, 'none', RED, 2.6) : '',
    line(`M${x} ${y} L${f1(x + Math.cos(a) * r * 0.74)} ${f1(y - Math.sin(a) * r * 0.74)}`, o.col ?? '#7ef0a0', 2), circle(x, y, 2, o.col ?? '#7ef0a0', null));
};
/** Brake disc with hub seen from the side. */
const disc = (x: number, y: number, r: number, col: string = STEEL) => all(circle(x, y, r, col, C.ink, 1.6), circle(x, y, r * 0.45, '#9aa3ad', C.ink, 1.2), ...range(5).map((i) => { const a = rad(i * 72); return circle(f1(x + Math.cos(a) * r * 0.28), f1(y + Math.sin(a) * r * 0.28), r * 0.06, C.ink, null); }),
  ...range(10).map((i) => { const a = rad(i * 36 + 18); return circle(f1(x + Math.cos(a) * r * 0.72), f1(y + Math.sin(a) * r * 0.72), r * 0.05, '#8d949b', null); }));
const caliper = (x: number, y: number, s = 1, col: string = RED) => g(`translate(${x} ${y}) scale(${s})`, path('M-12 -14 C-4 -20 4 -20 12 -14 L14 10 L6 10 L4 -6 L-4 -6 L-6 10 L-14 10 Z', col, C.ink, 1.6));
/** Moose silhouette standing at (x, 112-ish), facing left. */
const moose = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-14 -30 L14 -30 C20 -30 22 -26 22 -20 L22 0 L18 0 L17 -16 L-10 -16 L-11 0 L-15 0 L-15 -22 L-24 -30 L-30 -30 L-30 -36 L-22 -40 L-14 -36 Z', '#6b4a32', C.ink, 1.4),
  path('M-26 -40 C-32 -48 -38 -48 -40 -44 M-26 -40 C-24 -50 -18 -52 -14 -48', 'none', '#8a6a4a', 3));
const steering = (x: number, y: number, r = 26, col: string = C.dark) => all(circle(x, y, r, 'none', col, 6), circle(x, y, r, 'none', C.ink, 1), circle(x, y, 7, col, C.ink, 1.2), line(`M${x - r} ${y} L${x - 7} ${y} M${x + 7} ${y} L${x + r} ${y} M${x} ${y + 7} L${x} ${y + r}`, col, 5));
const handOn = (x: number, y: number) => all(circle(x, y, 5, C.skin, C.ink, 1.2));
/** Standing person, feet at (x, y=112). */
const person = (x: number, top: string, o: { s?: number; l?: [number, number]; r?: [number, number]; hat?: string; y?: number } = {}) => {
  const s = o.s ?? 1, [lx, ly] = o.l ?? [-12, 22], [rx, ry] = o.r ?? [12, 22];
  return g(`translate(${x} ${o.y ?? 112}) scale(${s})`, line('M-5 0 L-4 -26 M5 0 L4 -26', C.navy, 7), rect(-11, -56, 22, 32, top, 6, C.ink, 1.6),
    line(`M-9 -52 L${lx} ${-56 + ly}`, C.ink, 6.4), line(`M-9 -52 L${lx} ${-56 + ly}`, top, 4.4), circle(lx, -56 + ly, 3.2, C.skin, C.ink, 1.2),
    line(`M9 -52 L${rx} ${-56 + ry}`, C.ink, 6.4), line(`M9 -52 L${rx} ${-56 + ry}`, top, 4.4), circle(rx, -56 + ry, 3.2, C.skin, C.ink, 1.2),
    circle(0, -67, 10, C.skin, C.ink, 1.6), o.hat ? path('M-12 -70 C-12 -84 12 -84 12 -70 L14 -69 L-14 -69 Z', o.hat, C.ink, 1.6) : path('M-10 -68 C-10 -81 10 -81 10 -68 C6 -73 -6 -73 -10 -68 Z', C.hair, null),
    circle(-3.5, -66, 1.2, C.ink, null), circle(3.5, -66, 1.2, C.ink, null), path('M-3 -61 C-1 -59 1 -59 3 -61', 'none', C.ink, 1.2));
};
/** Horizontal exhaust pipe at y from x1 to x2. */
const pipe = (x1: number, x2: number, y: number, col: string = STEEL2) => all(line(`M${x1} ${y} L${x2} ${y}`, C.ink, 7), line(`M${x1} ${y} L${x2} ${y}`, col, 5));
/** A small dashboard: dark arc with lamps. */
const dashBoard = (inner: Svg = '') => all(rect(0, 0, 120, 120, '#2b2b30', 0, null), path('M0 70 C30 54 90 54 120 70 L120 120 L0 120 Z', '#3a3a44', C.ink, 1.4), inner);
const lampIcon = (x: number, y: number, col: string, on = true) => all(circle(x, y, 6, on ? col : '#4a4a52', C.ink, 1), on ? circle(x, y, 9, 'none', col, 1) : '');
const horse = (x: number, y: number, s = 1, col: string = '#8a5a3a') => g(`translate(${x} ${y}) scale(${s})`, path('M-12 -6 C-12 -12 -4 -14 6 -12 L10 -20 L14 -22 L16 -18 L12 -10 L12 -6 L13 6 L10 6 L9 -2 L-6 -2 L-8 6 L-11 6 L-11 -2 C-15 -2 -16 -8 -12 -6 Z', col, C.ink, 1.1));
const socket = (x: number, y: number) => all(rect(x - 7, y - 9, 14, 18, C.white, 2, C.ink, 1.2), circle(x - 2.5, y, 1.4, C.ink, null), circle(x + 2.5, y, 1.4, C.ink, null));
const noSign = (x: number, y: number, r = 14) => all(circle(x, y, r, 'none', RED, 3.4), line(`M${f1(x - r * 0.7)} ${f1(y - r * 0.7)} L${f1(x + r * 0.7)} ${f1(y + r * 0.7)}`, RED, 3.4));
const paper = (x: number, y: number, w = 30, h = 38, inner: Svg = '') => all(rect(x, y, w, h, C.white, 2, C.ink, 1.4), ...range(4).map((i) => line(`M${x + 5} ${y + 8 + i * 6} L${x + w - 6} ${y + 8 + i * 6}`, C.grey2, 1.4)), inner);

export const CARTK_MOTIFS: Record<string, Svg> = {
  // ── 4211 Förbränningsmotorer ──
  'cartk.bensinmotor': all(bg(), cyl(44, 80, 62, { plug: true, fire: '#ffd27a' }), waPulse('cartkbens', burst(44, 50, 8)), rect(16, 92, 56, 20, '#9aa3ad', 3, C.ink, 1.6),
    g('translate(92 66)', rect(-7, -12, 14, 24, '#3a9a5a', 3, C.ink, 1.4), path('M7 -7 L22 -11 L22 -6 L9 -2', '#5a5d68', C.ink, 1.2), path('M-7 10 C-14 22 -16 32 -16 46', 'none', C.ink, 2.6)), path('M86 84 C90 92 98 92 98 86 C98 82 92 76 92 76 C92 76 86 82 86 84 Z', '#3a9a5a', C.ink, 1), ring(44, 50, 12)),
  'cartk.dieselmotor': all(bg(), cyl(38, 80, 60, { fire: '#ffb08a' }), waPulse('cartkdies', heat(32, 64, 12), heat(44, 64, 12)), rect(10, 92, 56, 20, '#9aa3ad', 3, C.ink, 1.6),
    g('translate(90 108) scale(0.7)', rect(-36, -40, 34, 34, '#e4a43c', 3, C.ink, 1.6), rect(-30, -36, 18, 12, GLASS, 1, C.ink, 1), rect(-2, -48, 40, 42, '#c9ced4', 2, C.ink, 1.6), tyre(-24, -2, 8), tyre(24, -2, 8)),
    g('translate(96 40)', rect(-7, -12, 14, 24, '#2b2b30', 3, C.ink, 1.4), path('M-7 -7 L-22 -11 L-22 -6 L-9 -2', '#5a5d68', C.ink, 1.2)), ring(38, 58, 14)),
  'cartk.tändstift': all(bg(), g('translate(60 60) rotate(-20)', rect(-5, -48, 10, 12, DARKM, 2, C.ink, 1.2), rect(-9, -38, 18, 34, C.white, 6, C.ink, 1.6), path('M-14 -4 L14 -4 L16 6 L14 16 L-14 16 L-16 6 Z', STEEL, C.ink, 1.6),
    rect(-7, 16, 14, 20, STEEL, 1, C.ink, 1.4), ...range(5).map((i) => line(`M-7 ${19 + i * 3.6} L7 ${21 + i * 3.6}`, C.ink, 0.9)), line('M0 36 L0 44', STEEL2, 3), path('M-6 44 L6 44 L6 48', 'none', STEEL2, 3)),
    waPulse('cartktand', burst(80, 102, 9)), ring(60, 62, 46)),
  'cartk.vevaxel': all(bg(), ...[28, 52, 76, 100].map((x, i) => greyed(rect(x - 9, i % 2 ? 38 : 22, 18, 10, STEEL, 2, C.ink, 1.2), line(`M${x} ${i % 2 ? 48 : 32} L${x} ${i % 2 ? 84 : 70}`, STEEL2, 4))),
    path('M10 78 L22 78 L22 70 L34 70 L34 78 L46 78 L46 86 L58 86 L58 78 L70 78 L70 86 L82 86 L82 78 L94 78 L94 70 L106 70 L106 78 L114 78', 'none', C.ink, 7), path('M10 78 L22 78 L22 70 L34 70 L34 78 L46 78 L46 86 L58 86 L58 78 L70 78 L70 86 L82 86 L82 78 L94 78 L94 70 L106 70 L106 78 L114 78', 'none', HL, 4.4),
    waSpin('cartkvev', 2.6, path('M60 96 A14 8 0 1 1 46 104', 'none', HL, 2), path('M44 100 L46 105 L51 103', 'none', HL, 2))),
  'cartk.kamrem': all(bg(), rect(14, 16, 92, 92, '#9aa3ad', 8, C.ink, 1.6), waSpin('cartkkam1', 3, circle(38, 36, 13, STEEL, C.ink, 1.4), line('M38 25 L38 47 M27 36 L49 36', STEEL2, 2)), waSpin('cartkkam2', 3, circle(82, 36, 13, STEEL, C.ink, 1.4), line('M82 25 L82 47 M71 36 L93 36', STEEL2, 2)),
    waSpin('cartkkam3', 1.5, circle(60, 88, 9, STEEL, C.ink, 1.4), line('M60 80 L60 96 M52 88 L68 88', STEEL2, 2)),
    path('M25 36 C25 20 51 20 51 36 L69 36 C69 20 95 20 95 36 L69 88 C69 99 51 99 51 88 Z', 'none', C.ink, 6), path('M25 36 C25 20 51 20 51 36 L69 36 C69 20 95 20 95 36 L69 88 C69 99 51 99 51 88 Z', 'none', HL, 4),
    path('M25 36 C25 20 51 20 51 36 L69 36 C69 20 95 20 95 36 L69 88 C69 99 51 99 51 88 Z', 'none', C.ink, 1.2, )),
  'cartk.motorolja': all(bg(), engine(52, 88, 1.1), circle(52, 56, 6, C.dark, C.ink, 1.2), g('translate(86 28) rotate(-35)', rect(-14, -18, 28, 34, OIL, 4, C.ink, 1.6), rect(-5, -26, 10, 9, '#5a5d68', 2, C.ink, 1.2), rect(-9, -8, 18, 14, '#f6e6b0', 2, C.ink, 0.8), path('M-4 -2 C-1 -6 2 -6 4 -2 C2 2 -2 2 -4 -2 Z', OIL, null)),
    path('M66 40 C62 44 58 48 54 52', 'none', OIL, 4), waIn('cartkolja', 6, -6, path('M54 46 C57 50 56 53 54 53 C52 53 51 50 54 46 Z', OIL, C.ink, 0.8)), ring(52, 56, 11)),
  'cartk.oljesticka': all(bg(), engine(46, 96, 0.9), g('translate(74 22) rotate(18)', rect(-1.6, 0, 3.2, 70, STEEL, 1, C.ink, 1), circle(0, -4, 6, OIL, C.ink, 1.4), rect(-2.4, 50, 4.8, 20, OIL, 1, null), line('M-5 54 L5 54 M-5 66 L5 66', C.ink, 1.4)),
    circle(68, 18, 5, C.skin, C.ink, 1.2), ring(92, 80, 12)),
  'cartk.kylare.2': all(bg(), rect(18, 18, 84, 84, '#5a5d68', 6, C.ink, 1.8), rect(26, 26, 68, 68, '#c9ced4', 2, HL, 2.6), ...range(9).map((i) => line(`M${30 + i * 7.5} 28 L${30 + i * 7.5} 92`, '#8d949b', 1.4)),
    rect(30, 14, 60, 8, COOL, 2, C.ink, 1.2), rect(30, 98, 60, 8, COOL, 2, C.ink, 1.2), waIn('cartkkyl', -12, 0, arrow(6, 44, 22, 44, '#5aa7d6', 2.6), arrow(6, 60, 22, 60, '#5aa7d6', 2.6), arrow(6, 76, 22, 76, '#5aa7d6', 2.6)), flake(10, 30, 0.8),
    path('M90 18 C108 18 112 30 112 40', 'none', HOT, 3), path('M112 80 C112 96 104 102 90 102', 'none', COOL, 3)),
  'cartk.turbo': all(bg(), path('M60 60 m-26 0 a26 26 0 1 1 26 26 L60 104 L46 104 L46 82 A26 26 0 0 1 34 60 Z', HL, C.ink, 1.8), circle(60, 60, 14, '#dfe3e7', C.ink, 1.4), waSpin('cartkturb', 0.8, ...range(6).map((i) => line(`M60 60 L${f1(60 + Math.cos(rad(i * 60)) * 12)} ${f1(60 + Math.sin(rad(i * 60)) * 12)}`, STEEL2, 3))),
    puff(16, 100, 0.8, '#7a7f88'), arrow(10, 88, 34, 70, '#7a7f88', 3), waIn('cartkturb2', -8, 0, arrow(88, 40, 112, 26, '#5aa7d6', 3)), circle(60, 60, 3, DARKM, null)),
  'cartk.hästkraft': all(bg(), engine(60, 92, 1.2), horse(30, 40, 1.1), horse(60, 36, 1.1), horse(90, 40, 1.1), T(60, 104, '150', 12, C.white)),
  'cartk.tomgång': all(bg(), road(100), carSide(60, 105, 1), moving('cartktom', '0%{transform:translate(0,0) scale(.6);opacity:.9}100%{transform:translate(-14px,-10px) scale(1.1);opacity:0}', { dur: 2.4 }, puff(10, 98, 0.6)),
    g('translate(60 30)', gauge(0, 0, 18, 0.12))),
  'cartk.rusa.2': all(bg(), g('translate(30 30)', gauge(0, 0, 20, 0.92, { red: true, col: RED })), waShake('cartkrus', engine(64, 90, 1.2)), sound(98, 64, 3, 1, HOT), sound(28, 76, 3, -1, HOT), g('translate(98 26) scale(0.45)', gate(0, 0, 0, 0, { digits: false }))),

  // ── 4212 Växellåda och transmission ──
  'cartk.växelspak': all(rect(0, 0, 120, 120, '#3a3a44', 0, null), rect(30, 74, 60, 30, '#2b2b30', 6, C.ink, 1.6), path('M46 74 C46 70 74 70 74 74 L70 90 L50 90 Z', '#4a4a52', C.ink, 1.2), waSway('cartkvsp', 10, line('M60 84 L66 40', C.ink, 7), line('M60 84 L66 40', STEEL2, 4.4),
    circle(67, 34, 12, C.dark, C.ink, 1.8), line('M61 30 L61 38 M67 30 L67 38 M73 30 L73 38 M61 34 L73 34', C.white, 1.2)), ring(66, 50, 24)),
  'cartk.kopplingspedal': all(pedals('clutch'), moving('cartkkop', '0%,100%{transform:translate(0,-8px)}50%{transform:translate(0,0)}', { dur: 2.4 }, shoe(26, 80)), ring(26, 80, 20)),
  'cartk.lägga-i.2': all(rect(0, 0, 120, 120, '#2b2b30', 0, null), gate(60, 62, 42, 44, { knob: HL }), moving('cartklagg', '0%,20%{transform:translate(18px,18px)}45%{transform:translate(0,18px)}80%,100%{transform:translate(0,0)}', { dur: 3 }, circle(42, 44, 7, HL, C.ink, 1.6), circle(42, 44, 5, C.skin, null)), arrow(64, 22, 46, 22, C.white, 2)),
  'cartk.friläge': all(rect(0, 0, 120, 120, '#2b2b30', 0, null), gate(60, 52, 60, 52, { knob: 'none' }), waShake('cartkfri', circle(60, 52, 7, HL, C.ink, 1.6)), ring(60, 52, 12, C.white),
    g('translate(36 100)', circle(0, 0, 10, STEEL, C.ink, 1.2), ...range(8).map((i) => circle(f1(Math.cos(rad(i * 45)) * 10), f1(Math.sin(rad(i * 45)) * 10), 2.4, STEEL, C.ink, 0.8))), g('translate(84 100)', circle(0, 0, 10, STEEL, C.ink, 1.2), ...range(8).map((i) => circle(f1(Math.cos(rad(i * 45)) * 10), f1(Math.sin(rad(i * 45)) * 10), 2.4, STEEL, C.ink, 0.8))), line('M52 100 L68 100', RED, 2, '3 3')),
  'cartk.backväxel': all(bg(), road(100), moving('cartkback', '0%{transform:translate(20px,0)}100%{transform:translate(-14px,0)}', { dur: 3 }, carSide(64, 105, 0.9, { rear: '#fffbe0' }), path('M18 82 L4 76 L4 90 Z', '#fffbe0', null)), arrow(66, 50, 26, 50, HL, 3.4),
    g('translate(96 26)', rect(-16, -16, 32, 32, '#3a3a44', 4, C.ink, 1.2), line('M-8 -8 L-8 8 M8 -8 L8 8 M-8 0 L8 0 M8 8 L14 8', '#7a838d', 3), circle(14, 8, 5, HL, C.ink, 1.2))),
  'cartk.transmission': all(bg(), engine(20, 60, 0.55), circle(46, 56, 10, '#c9ced4', C.ink, 1.4), rect(60, 44, 22, 24, '#7a838d', 3, C.ink, 1.4), line('M82 56 L100 56', STEEL2, 4), tyre(106, 56, 12),
    waIn('cartktrans', -20, 0, arrow(28, 80, 50, 80, HL, 2.6), arrow(56, 80, 78, 80, HL, 2.6), arrow(84, 80, 104, 80, HL, 2.6)), frame(34, 38, 84, 50)),
  'cartk.drivaxel': all(bg('#e9eef2'), rect(48, 40, 24, 26, '#7a838d', 3, C.ink, 1.4), engine(60, 26, 0.5), line('M48 54 L22 74', C.ink, 7), line('M48 54 L22 74', HL, 4.4), greyed(line('M72 54 L98 74', C.ink, 7), line('M72 54 L98 74', STEEL2, 4.4)),
    waSpin('cartkdriv', 1.4, tyre(16, 82, 16)), tyre(104, 82, 16), ring(34, 64, 14)),
  'cartk.differential': all(rect(0, 0, 120, 120, GRASS, 0, null), path('M120 20 C60 20 30 50 30 120 L74 120 C74 76 88 64 120 64 Z', ROAD, null), carTop(60, 64, 1, { rot: -30 }),
    rect(38, 86, 44, 4, STEEL2, 1, C.ink, 0.8), circle(60, 88, 8, HL, C.ink, 1.6), circle(60, 88, 3.6, '#fff4e6', C.ink, 0.8), arrow(30, 104, 30, 96, C.grey, 2), arrow(90, 110, 90, 92, HL, 3), ring(60, 88, 13)),
  'cartk.framhjulsdrift': all(bg('#e9eef2'), carTop(60, 62, 1.3, { hl: [true, true, false, false] }), engine(60, 32, 0.32), waIn('cartkfram', 0, 10, arrow(52, 30, 42, 36, HL, 2.6), arrow(68, 30, 78, 36, HL, 2.6))),
  'cartk.fyrhjulsdrift': all(bg(SNOW), ...range(10).map((i) => flake(8 + (i * 31) % 106, 10 + (i * 47) % 100, 0.6)), carTop(60, 62, 1.3, { hl: [true, true, true, true] }),
    waIn('cartkfyr', 0, 10, arrow(52, 46, 42, 40, HL, 2.6), arrow(68, 46, 78, 40, HL, 2.6), arrow(52, 78, 42, 86, HL, 2.6), arrow(68, 78, 78, 86, HL, 2.6))),
  'cartk.rivstarta': all(bg(), road(100), waIn('cartkriv', -30, 0, carSide(70, 105, 0.9), line('M12 70 L26 70 M8 80 L24 80 M14 90 L26 90', C.grey, 2)), waPulse('cartkriv2', puff(30, 102, 0.9, '#e6e6ea'), puff(16, 96, 0.7, '#e6e6ea')), sound(52, 112, 2, -1, HOT, true)),

  // ── 4213 Bromssystem ──
  'cartk.bromspedal': all(pedals('brake', false), moving('cartkbrp', '0%,100%{transform:translate(0,-8px)}50%{transform:translate(0,0)}', { dur: 2.4 }, shoe(52, 80)), ring(50, 80, 20)),
  'cartk.bromsljus': all(bg(), road(104), carRear(60, 104, 1.1, { lights: RED, third: true }), waPulse('cartkbrl', circle(27, 85, 12, 'none', RED, 2), circle(93, 85, 12, 'none', RED, 2), circle(60, 54, 10, 'none', RED, 2)), ring(27, 85, 16)),
  'cartk.bromsskiva': all(bg(), tyre(60, 60, 48, { spokes: false, rim: '#e5e8eb' }), waSpin('cartkbrs', 2.6, disc(60, 60, 26, HL)), caliper(60, 30, 1.1, STEEL2)),
  'cartk.bromsbelägg': all(bg(), rect(52, 14, 16, 92, STEEL, 2, C.ink, 1.6), line('M60 18 L60 102', '#9aa3ad', 1), moving('cartkbelg', '0%,20%{transform:translate(-12px,0)}60%,100%{transform:translate(0,0)}', { dur: 2.4 }, rect(30, 36, 8, 48, DARKM, 1, C.ink, 1.2), rect(38, 38, 12, 44, HL, 2, C.ink, 1.6)),
    moving('cartkbelg2', '0%,20%{transform:translate(12px,0)}60%,100%{transform:translate(0,0)}', { dur: 2.4 }, rect(82, 36, 8, 48, DARKM, 1, C.ink, 1.2), rect(70, 38, 12, 44, HL, 2, C.ink, 1.6)), arrow(14, 60, 28, 60, C.grey, 2.4), arrow(106, 60, 92, 60, C.grey, 2.4)),
  'cartk.bromsok': all(bg(), waSpin('cartkbok', 3, disc(60, 72, 40)), moving('cartkbok2', '0%,100%{transform:translate(0,0)}50%{transform:translate(0,3px)}', { dur: 1.6 }, caliper(60, 40, 2.4, HL))),
  'cartk.bromsvätska': all(bg(), rect(8, 70, 104, 42, '#9aa3ad', 4, C.ink, 1.6), rect(40, 20, 40, 56, 'rgba(255,255,255,.75)', 6, C.ink, 1.8), rect(42, 40, 36, 34, '#f1d77a', 4, null), line('M40 36 L48 36 M40 52 L48 52', C.ink, 1.4), rect(50, 12, 20, 10, '#e4c13c', 2, C.ink, 1.4),
    path('M80 66 C96 66 100 80 108 92', 'none', C.ink, 3), waIn('cartkbv', 0, -8, path('M60 84 C64 90 63 94 60 94 C57 94 56 90 60 84 Z', '#f1d77a', C.ink, 0.9)), ring(60, 50, 30)),
  'cartk.ABS-broms': all(rect(0, 0, 120, 120, ICE, 0, null), ...range(6).map((i) => line(`M${10 + i * 20} ${20 + (i % 3) * 30} l10 6`, C.white, 2)), path('M28 112 C28 70 40 54 60 48 C80 42 86 30 86 6', 'none', HL, 3, ), arrow(86, 18, 86, 6, HL, 3),
    g('translate(46 58)', path('M-8 6 L0 -12 L8 6 Z', HL, C.ink, 1.2), rect(-10, 6, 20, 4, C.ink, 1, null)), carTop(30, 92, 0.8, { rot: 12 }), waPulse('cartkabs', circle(30, 92, 22, 'none', C.yellow, 1.6)), tick(100, 100, 2)),
  'cartk.låsa-sig': all(bg(ICE), rect(0, 96, 120, 24, '#bcd8e6', 0, null), line('M4 106 L64 106', SOOT, 4), waIn('cartklas', -24, 0, tyre(84, 86, 20), g('translate(84 86)', rect(-6, -2, 12, 9, C.gold, 2, C.ink, 1.2), path('M-4 -2 L-4 -6 C-4 -11 4 -11 4 -6 L4 -2', 'none', C.ink, 1.6))), puff(58, 98, 0.7, C.white), cross(84, 50, 7)),
  'cartk.nödbromsa': all(bg(), road(100), moose(98, 106, 0.9), waShake('cartknod', carSide(46, 105, 0.85)), line('M2 104 L20 104 M2 110 L24 110', SOOT, 3), burst(80, 40, 8, C.yellow), g('translate(20 26)', rect(-16, -16, 32, 32, '#3a3a44', 4, C.ink, 1.2), rect(-6, -4, 12, 12, HL, 2, C.ink, 1.2), path('M-4 -14 L4 -14 L4 -4 L-4 -4 Z', '#2f4a7a', C.ink, 1))),
  'cartk.motorbromsa': all(bg(), path('M0 40 L120 104 L120 120 L0 120 Z', ROAD, null), moving('cartkmob', '0%{transform:translate(-16px,-9px)}100%{transform:translate(16px,9px)}', { dur: 3.2 }, g('translate(48 64) rotate(28)', carSide(0, 0, 0.6))),
    g('translate(96 26)', rect(-18, -18, 36, 36, '#3a3a44', 4, C.ink, 1.2), T(-7, 4, '4', 10, C.white), T(9, 4, '3', 10, HL), arrow(-1, -8, 3, -8, HL, 1.6)), g('translate(22 26)', rect(-14, -16, 28, 32, '#3a3a44', 4, C.ink, 1.2), rect(-6, -10, 12, 18, '#5a5d68', 2, C.ink, 1), cross(0, -1, 8))),

  // ── 4214 Styrning och hjulupphängning ──
  'cartk.styra': all(bg('#cfe4f1'), path('M40 64 C50 40 80 30 120 30 L120 46 C90 46 66 54 62 64 Z', ROAD, null), rect(0, 64, 120, 56, '#3a3a44', 0, null), waSway('cartksty', 14, steering(60, 92, 28), handOn(34, 88), handOn(86, 88)), arrow(70, 52, 96, 40, HL, 2.6)),
  'cartk.servostyrning': all(bg(), steering(44, 34, 22), line('M44 56 L60 92', STEEL2, 6), rect(20, 92, 80, 10, STEEL, 2, C.ink, 1.4), rect(62, 66, 22, 18, HL, 3, C.ink, 1.6), bolt(73, 75, 0.6), waIn('cartkserv', 0, -6, arrow(74, 88, 90, 96, HL, 2.4), arrow(74, 88, 58, 96, HL, 2.4)),
    circle(24, 30, 4.6, C.skin, C.ink, 1.1), path('M94 28 C100 18 110 18 112 26 C104 26 100 30 94 28 Z', C.white, C.ink, 1), ring(73, 75, 15)),
  'cartk.dra-snett': all(rect(0, 0, 120, 120, GRASS, 0, null), rect(24, 0, 72, 120, ROAD, 0, null), line('M60 0 L60 120', C.white, 1.6, '8 6'), line('M42 110 L42 10', C.grey, 1.4, '3 3'),
    moving('cartkdra', '0%{transform:translate(-4px,20px)}100%{transform:translate(24px,-30px)}', { dur: 3 }, carTop(44, 72, 0.7)), arrow(46, 52, 72, 22, HL, 2.6), g('translate(100 100)', steering(0, 0, 11), circle(0, 0, 15, 'none', C.white, 0))),
  'cartk.hjulinställning': all(bg('#e9eef2'), g('translate(36 60) rotate(-8)', rect(-8, -26, 16, 52, TYRE, 4, C.ink, 1.4)), g('translate(84 60) rotate(8)', rect(-8, -26, 16, 52, TYRE, 4, C.ink, 1.4)), line('M36 20 L36 100 M84 20 L84 100', C.grey, 1.2, '3 3'),
    line('M32 34 L40 86', HL, 2), line('M88 34 L80 86', HL, 2), path('M36 30 A30 30 0 0 1 42 31', 'none', HL, 2), waPulse('cartkhji', line('M8 60 L112 60', RED, 1.2, '4 2')), rect(4, 52, 6, 16, C.dark, 1, null), rect(110, 52, 6, 16, C.dark, 1, null)),
  'cartk.fälg': all(bg(), tyre(60, 60, 46, { rim: HL }), ring(60, 60, 30, C.ink)),
  'cartk.hjulupphängning': all(bg('#e9eef2'), path('M0 10 L120 10 L120 34 L0 34 Z', CAR, C.ink, 1.6), waBob('cartkhup', 6, tyre(72, 86, 22), path('M40 38 L46 44 L34 50 L46 56 L34 62 L42 66', 'none', HL, 3), rect(52, 40, 6, 30, STEEL2, 1, C.ink, 1), line('M30 70 L72 86', C.ink, 6), line('M30 70 L72 86', HL, 3.6)),
    road(108), frame(24, 32, 72, 76)),
  'cartk.väghållning': all(rect(0, 0, 120, 120, GRASS, 0, null), path('M10 120 C10 60 50 30 120 30 L120 62 C70 62 44 80 44 120 Z', ROAD, null), path('M27 120 C27 74 58 46 120 46', 'none', C.white, 1.4, ), path('M27 120 C27 74 58 46 120 46', 'none', HL, 2.6), carTop(40, 70, 0.62, { rot: 40 }),
    greyed(carTop(96, 96, 0.55, { rot: 70 }), line('M76 82 L90 92', C.ink, 1.4, '3 2')), cross(104, 100, 6)),
  'cartk.kränga': all(bg(), road(104), waSway('cartkkra', 5, g('rotate(9 60 96)', carRear(60, 104, 1.1))), path('M18 40 C30 24 90 24 102 40', 'none', HL, 2.6), arrow(96, 36, 104, 44, HL, 2.6)),
  'cartk.svängradie': all(rect(0, 0, 120, 120, '#d8d2c6', 0, null), circle(60, 62, 40, 'none', C.white, 2, ), circle(60, 62, 40, 'none', C.grey, 1.4), circle(60, 62, 3, HL, null), line('M60 62 L100 62', HL, 3), carTop(100, 62, 0.55, { rot: 180 }), path('M60 22 A40 40 0 0 0 20 62', 'none', C.grey, 1.4, ), arrow(24, 40, 20, 52, C.grey, 2)),
  'cartk.antisladdsystem': all(rect(0, 0, 120, 120, ICE, 0, null), path('M10 120 C10 70 40 40 120 40', 'none', ROAD, 26), line('M10 120 C10 70 40 40 120 40', C.white, 1, '6 6'), carTop(36, 70, 0.62, { rot: 40, hl: [false, false, false, true] }),
    waPulse('cartkesc', circle(45, 82, 6, 'none', HL, 2)), greyed(path('M30 76 C40 90 60 96 76 92', 'none', C.ink, 1.4, )), cross(80, 94, 5),
    g('translate(94 92)', rect(-16, -14, 32, 28, '#2b2b30', 4, C.ink, 1.2), waPulse('cartkesc2', g('translate(0 -2) scale(0.5)', rect(-8, -14, 16, 22, C.yellow, 4, C.ink, 1), path('M-12 12 C-8 8 -4 16 0 12 M2 12 C6 8 10 16 14 12', 'none', C.yellow, 2.4))))),

  // ── 4215 Elektriska system i bilen ──
  'cartk.elsystem': all(bg(), carSide(60, 100, 1.15, { col: '#d6e2f2', win: '#eef6fb' }), path('M30 84 L52 84 L52 64 L86 64 L100 76 M52 64 L40 70 L8 74 M52 84 L70 92', 'none', C.ink, 3.4), path('M30 84 L52 84 L52 64 L86 64 L100 76 M52 64 L40 70 L8 74 M52 84 L70 92', 'none', C.yellow, 2),
    rect(22, 78, 16, 12, C.dark, 2, C.ink, 1.2), circle(100, 78, 4, LAMP, C.ink, 1), circle(8, 76, 3.4, RED, C.ink, 1), rect(64, 88, 10, 8, '#7a838d', 1, C.ink, 1), waPulse('cartkels', bolt(52, 46, 0.9)), frame(4, 40, 112, 72)),
  'cartk.bilbatteri': all(bg(), rect(20, 46, 80, 56, '#2e2e36', 4, C.ink, 1.8), rect(20, 46, 80, 12, '#46464f', 4, C.ink, 1.4), rect(32, 36, 12, 10, RED, 2, C.ink, 1.2), rect(76, 36, 12, 10, DARKM, 2, C.ink, 1.2), T(38, 74, '+', 16, RED), T(82, 74, '−', 16, C.white),
    path('M38 36 C38 20 20 20 10 18', 'none', RED, 3), path('M82 36 C82 20 100 20 110 18', 'none', '#1f1f24', 3), T(60, 94, '12', 10, C.white), ring(60, 74, 46)),
  'cartk.startmotor': all(bg(), circle(40, 62, 30, STEEL, C.ink, 1.6), waSpin('cartksta', 2.4, ...range(18).map((i) => circle(f1(40 + Math.cos(rad(i * 20)) * 30), f1(62 + Math.sin(rad(i * 20)) * 30), 2.6, STEEL, C.ink, 0.8)), line('M40 36 L40 88 M14 62 L66 62', STEEL2, 2)),
    rect(72, 52, 40, 22, HL, 6, C.ink, 1.6), rect(66, 56, 8, 14, STEEL2, 1, C.ink, 1), bolt(92, 40, 0.8), line('M92 30 C92 20 100 14 112 14', RED, 2.4)),
  'cartk.tändning': all(dashBoard(), waPulse('cartktnd', lampIcon(30, 90, RED), lampIcon(50, 84, C.yellow), lampIcon(70, 84, '#3ac06a'), lampIcon(90, 90, C.yellow)), g('translate(60 36)', circle(0, 0, 18, '#46464f', C.ink, 1.6), rect(-3, -10, 6, 20, STEEL, 1.5, C.ink, 1), g('rotate(50)', rect(-6, -26, 12, 16, DARKM, 3, C.ink, 1.2))), arrow(78, 16, 86, 26, HL, 2.4)),
  'cartk.säkringsdosa': all(bg(), rect(16, 22, 88, 78, '#2e2e36', 6, C.ink, 1.8), ...range(12).map((i) => { const c = [RED, '#3a8ad6', C.yellow, '#3ac06a'][i % 4]!; return rect(26 + (i % 6) * 12, 36 + Math.floor(i / 6) * 28, 8, 18, c, 2, C.ink, 1); }), path('M16 22 L104 22 L96 10 L24 10 Z', '#46464f', C.ink, 1.4), frame(12, 18, 96, 86)),
  'cartk.kablage': all(bg('#e9eef2'), ...[RED, '#3a8ad6', C.yellow, '#3ac06a', C.dark, C.white].map((c, i) => path(`M6 ${52 + i * 3} C40 ${44 + i * 3} 70 ${66 + i * 3} 114 ${54 + i * 3}`, 'none', c, 2.6)), ...[30, 60, 88].map((x) => rect(x - 3, 50, 6, 22, C.dark, 2, C.ink, 1)),
    path('M86 70 L100 96 M92 70 L112 90', 'none', '#3a8ad6', 2.4), path('M34 64 L22 92', 'none', RED, 2.4), ring(60, 62, 30)),
  'cartk.styrenhet': all(bg(), rect(42, 40, 36, 36, '#2e2e36', 4, C.ink, 1.8), rect(50, 48, 20, 20, '#46464f', 2, null), ...range(5).map((i) => line(`M${46 + i * 7} 36 L${46 + i * 7} 40 M${46 + i * 7} 76 L${46 + i * 7} 80`, STEEL, 2)),
    circle(16, 30, 7, '#8fd0f0', C.ink, 1.2), circle(16, 86, 7, '#8fd0f0', C.ink, 1.2), waIn('cartksty2', -10, 0, arrow(24, 34, 40, 50, C.grey, 2.2), arrow(24, 82, 40, 66, C.grey, 2.2)), waIn('cartksty3', -10, 0, arrow(80, 50, 96, 34, HL, 2.6), arrow(80, 66, 96, 82, HL, 2.6)),
    engine(106, 30, 0.3), disc(106, 88, 9), frame(38, 36, 44, 44)),
  'cartk.centrallås': all(bg(), carTop(70, 62, 1.1), g('translate(22 82)', rect(-9, -16, 18, 30, C.dark, 6, C.ink, 1.4), circle(0, -6, 4, HL, C.ink, 1), circle(0, 5, 4, '#7a838d', C.ink, 1), circle(0, 5, 4.6, C.skin, null)), waPulse('cartkcl', sound(28, 60, 3, 1, HL, true),
    ...[[52, 52], [88, 52], [52, 74], [88, 74]].map(([x, y]) => all(rect(x! - 4, y! - 1, 8, 7, C.gold, 1.5, C.ink, 1), path(`M${x! - 3} ${y! - 1} L${x! - 3} ${y! - 4} C${x! - 3} ${y! - 8} ${x! + 3} ${y! - 8} ${x! + 3} ${y! - 4} L${x! + 3} ${y! - 1}`, 'none', C.ink, 1.4))))),
  'cartk.fönsterhiss': all(bg(), path('M10 112 L10 54 L30 26 L110 26 L110 112 Z', CAR, C.ink, 1.8), path('M18 56 L34 34 L102 34 L102 56 Z', '#eef6fb', C.ink, 1.2), moving('cartkfh', '0%,15%{transform:translate(0,22px)}60%,100%{transform:translate(0,0)}', { dur: 3 }, path('M20 56 L35 35 L101 35 L101 56 Z', GLASS, HL, 2)),
    rect(10, 56, 100, 8, CAR, 0, null), rect(70, 72, 26, 14, C.dark, 3, C.ink, 1.2), path('M77 82 L83 76 L89 82 Z', C.white, null), circle(84, 80, 5, C.skin, C.ink, 1), arrow(108, 50, 108, 32, HL, 2.6)),
  'cartk.sätesvärme': all(rect(0, 0, 120, 120, '#3a3a44', 0, null), rect(70, 8, 46, 40, '#cfe4f1', 4, C.ink, 1.4), flake(84, 22, 0.9), flake(102, 34, 0.8), path('M24 104 L24 30 C24 18 54 18 54 30 L56 76 L96 76 C104 76 106 86 98 92 L30 108 Z', '#5a5d68', C.ink, 1.8),
    waPulse('cartksv', heat(38, 72, 16), heat(46, 72, 16), heat(66, 88, 12), heat(80, 88, 12)), path('M30 40 L48 40 M30 52 L48 52 M30 64 L48 64', 'none', HOT, 2), ring(56, 72, 34)),
  'cartk.motorvärmare': all(bg('#2a3448'), rect(0, 96, 120, 24, SNOW, 0, null), ...range(8).map((i) => flake(10 + i * 14, 12 + (i % 3) * 14, 0.6, C.white)), carSide(48, 104, 0.9), rect(104, 56, 10, 50, '#7a838d', 2, C.ink, 1.2), socket(109, 66),
    path('M90 90 C98 96 100 80 104 70', 'none', C.ink, 2.4), waPulse('cartkmv', heat(78, 82, 12), heat(86, 82, 12)), bolt(96, 52, 0.7), ring(84, 84, 12)),
  'cartk.helljus': all(bg(NIGHT), rect(0, 92, 120, 28, '#3a3f4a', 0, null), path('M44 92 L120 72 L120 104 Z', 'rgba(255,224,138,.55)', null), path('M44 92 L120 60 L120 112 Z', 'rgba(255,224,138,.25)', null), carSide(22, 104, 0.6, { head: LAMP }), ...range(5).map((i) => circle(20 + i * 22, 14 + (i % 2) * 8, 1.2, C.white, null)), ring(48, 94, 8)),
  'cartk.blända-av': all(bg(NIGHT), rect(0, 92, 120, 28, '#3a3f4a', 0, null), moving('cartkbl', '0%,30%{opacity:1}60%,100%{opacity:0}', { dur: 3.2 }, path('M30 94 L120 70 L120 108 Z', 'rgba(255,224,138,.5)', null)), path('M30 96 L70 100 L70 110 Z', 'rgba(255,224,138,.7)', null),
    carSide(16, 104, 0.45, { head: LAMP }), g('translate(102 102) scale(-0.45 0.45)', carSide(0, 0, 1, { head: LAMP, col: '#c84a3a' })), path('M86 98 L70 96 L70 100 Z', 'rgba(255,224,138,.6)', null), arrow(60, 60, 60, 80, HL, 2.6)),

  // ── 4216 Avgassystem ──
  'cartk.avgassystem': all(bg(), carSide(60, 92, 1.15, { col: '#d6e2f2', win: '#eef6fb' }), engine(96, 74, 0.32), pipe(96, 6, 100, HL), rect(56, 95, 16, 10, HL, 4, C.ink, 1.4), rect(18, 94, 22, 12, HL, 5, C.ink, 1.4), waIn('cartkavs', 20, 0, puff(4, 98, 0.5)), frame(2, 86, 108, 24)),
  'cartk.avgasrör': all(bg(), path('M0 20 L80 20 L104 60 L104 92 L0 92 Z', CAR, C.ink, 1.8), rect(10, 50, 22, 12, '#c43a32', 2, C.ink, 1), road(104), ellipse(30, 100, 12, 7, STEEL2, C.ink, 1.6), ellipse(30, 100, 7, 4, '#2b2b30', null), moving('cartkavr', '0%{transform:translate(0,0) scale(.5);opacity:1}100%{transform:translate(-20px,-4px) scale(1.2);opacity:0}', { dur: 2.2 }, puff(16, 98, 0.8)), ring(30, 100, 16)),
  'cartk.ljuddämpare': all(bg(), pipe(4, 34, 60), pipe(86, 116, 60), ellipse(60, 60, 28, 18, HL, C.ink, 1.8), line('M40 60 L80 60', '#c96a2e', 1.4), waPulse('cartkljd', sound(6, 40, 3, 1, HOT)), sound(104, 42, 1, 1, C.grey, true)),
  'cartk.katalysator.2': all(bg(), pipe(2, 28, 60), pipe(92, 118, 60), rect(28, 36, 64, 48, HL, 8, C.ink, 1.8), ...range(5).map((i) => line(`M${38 + i * 11} 42 L${38 + i * 11} 78`, '#fff4e6', 2)), ...range(3).map((i) => line(`M32 ${48 + i * 12} L88 ${48 + i * 12}`, '#fff4e6', 2)),
    waIn('cartkkat', -12, 0, circle(10, 44, 4, '#8a4a8a', C.ink, 0.8), circle(18, 38, 3.4, '#b5651d', C.ink, 0.8), circle(14, 78, 4, '#8a4a8a', C.ink, 0.8)), waIn('cartkkat2', -12, 0, circle(102, 44, 4, '#d9f1fb', C.ink, 0.8), circle(110, 38, 3.4, '#d9f1fb', C.ink, 0.8), circle(106, 78, 4, '#d9f1fb', C.ink, 0.8))),
  'cartk.partikelfilter': all(bg(), pipe(2, 30, 60), pipe(90, 118, 60), rect(30, 34, 60, 52, '#e9e4da', 10, HL, 2.6), ...range(5).map((i) => line(`M${38 + i * 11} 38 L${38 + i * 11} 82`, '#c9c2b4', 1.6)), ...range(18).map((i) => circle(f1(36 + (i * 17) % 22), f1(40 + (i * 23) % 42), 2, SOOT, null)),
    waIn('cartkpf', -12, 0, puff(14, 40, 0.8, '#4a4a52'), puff(12, 82, 0.7, '#4a4a52')), puff(106, 42, 0.6, C.white)),
  'cartk.avgasrening': all(bg(), carSide(56, 100, 0.8), greyed(puff(14, 60, 1.6, SOOT)), cross(14, 54, 10), arrow(30, 60, 82, 60, HL, 3), waGrow('cartkavr2', puff(100, 58, 1.2, C.white)), sparkle(108, 42, 5), tick(100, 80, 2)),
  'cartk.kväveoxid': all(bg('#e8dcc8'), rect(0, 0, 120, 120, 'rgba(160,110,60,.25)', 0, null), ...[[10, 60, 40], [30, 46, 50], [90, 40, 46], [104, 56, 36]].map(([x, h, w]) => rect(x! - w! / 2 + 10, 112 - h!, w! - 14, h!, '#9aa3ad', 1, C.ink, 1)), waGrow('cartkkvo', puff(60, 70, 2.2, '#b98b5e')),
    g('translate(60 40)', line('M-14 6 L0 0 L14 6', C.ink, 3), circle(0, 0, 9, '#3a6ad6', C.ink, 1.4), circle(-16, 7, 7, RED, C.ink, 1.2), circle(16, 7, 7, RED, C.ink, 1.2)), ring(60, 42, 26)),
  'cartk.miljöklass': all(bg(), ...range(6).map((i) => rect(10 + i * 17, 96 - i * 12, 15, 16 + i * 12, ['#d6453a', '#e8783a', '#efb43c', '#c8cf4a', '#7fbf4a', '#3a9a5a'][i]!, 2, C.ink, 1.2)), ...range(6).map((i) => T(17.5 + i * 17, 108, String(i + 1), 9, C.white)),
    g('translate(103 46) scale(0.36)', carSide(0, 0, 1)), ring(102.5, 72, 16)),
  'cartk.tomgångskörning': all(bg(), rect(60, 30, 56, 66, '#e6b98a', 2, C.ink, 1.6), path('M56 32 L88 12 L120 32 Z', '#c84a3a', C.ink, 1.6), ...range(3).map((i) => rect(66 + i * 16, 42, 10, 12, GLASS, 1, C.ink, 1)), road(100), carSide(46, 105, 0.8),
    moving('cartktgk', '0%{transform:translate(0,0) scale(.6);opacity:.9}100%{transform:translate(-10px,-10px) scale(1.2);opacity:0}', { dur: 2.4 }, puff(8, 98, 0.6)), clock(20, 40, 12, 120), noSign(92, 72, 12)),
  'cartk.ryka': all(bg(), road(104), path('M60 14 L120 14 L120 96 L60 96 Z', CAR, C.ink, 1.8), ellipse(70, 92, 10, 6, STEEL2, C.ink, 1.4), moving('cartkryk', '0%{transform:translate(0,0) scale(.5);opacity:1}100%{transform:translate(-30px,-40px) scale(1.6);opacity:0}', { dur: 2.6 }, puff(56, 88, 1, SOOT)),
    puff(40, 70, 1.2, '#4a4a52'), puff(24, 46, 1.4, '#6a6a72'), puff(14, 22, 1.2, '#8a8a92')),

  // ── 4217 Felsöka bilens funktioner ──
  'cartk.felkodsläsare': all(rect(0, 0, 120, 120, '#3a3a44', 0, null), rect(0, 0, 120, 34, '#2b2b30', 0, null), rect(16, 34, 20, 10, C.dark, 2, C.ink, 1.2), path('M26 44 C26 70 52 70 58 80', 'none', C.ink, 3), g('translate(78 82)', rect(-24, -30, 48, 60, '#e4a43c', 6, C.ink, 1.8), rect(-18, -24, 36, 22, '#1f2430', 2, null), T(0, -9, '0301', 9, '#7ef0a0'),
    circle(-10, 10, 4, C.dark, null), circle(10, 10, 4, C.dark, null), rect(-6, 18, 12, 6, C.dark, 2, null)), ring(78, 72, 36)),
  'cartk.missljud': all(bg(), road(104), carSide(48, 107, 0.9), waShake('cartkmis', zig(76, 60, 20, HOT)), T(92, 46, '?', 16, HOT), person(104, '#6aa36a', { s: 0.55, r: [8, -2] })),
  'cartk.knacka.2': all(bg(), cyl(60, 82, 56, { wall: '#c9ced4' }), waShake('cartkkna', burst(60, 50, 10, C.yellow)), ...[[30, 40], [90, 40]].map(([x, y]) => line(`M${x} ${y} l${x! < 60 ? -8 : 8} -4 M${x} ${y! + 8} l${x! < 60 ? -10 : 10} 0`, HOT, 2.4)), rect(32, 92, 56, 18, '#9aa3ad', 3, C.ink, 1.4), ring(60, 52, 18)),
  'cartk.hacka.4': all(bg(), road(100), moving('cartkhac', '0%{transform:translate(-20px,0)}20%{transform:translate(-8px,0)}30%{transform:translate(-10px,0)}50%{transform:translate(4px,0)}60%{transform:translate(2px,0)}80%{transform:translate(16px,0)}100%{transform:translate(14px,0)}', { dur: 2.4 }, carSide(60, 105, 0.85)),
    puff(10, 96, 0.5, '#6a6a72'), puff(22, 90, 0.35, '#6a6a72'), g('translate(30 30)', gauge(0, 0, 16, 0.5)), waShake('cartkhac2', line('M52 24 L60 32 L66 18 L74 34 L80 24', HOT, 2.4))),
  'cartk.skramla': all(bg(), rect(0, 10, 120, 40, CAR, 0, C.ink, 1.6), tyre(20, 52, 12), tyre(100, 52, 12), road(104), waShake('cartkskr', path('M30 62 L70 62 L90 84', 'none', C.ink, 7), path('M30 62 L70 62 L90 84', 'none', HL, 4.6), ellipse(92, 86, 6, 4, STEEL2, C.ink, 1)), line('M70 50 L72 62', C.ink, 1.4),
    zig(36, 78, 16, C.ink), zig(80, 98, 14, C.ink)),
  'cartk.tjuta': all(bg(), rect(14, 24, 70, 76, '#9aa3ad', 6, C.ink, 1.6), circle(38, 46, 12, STEEL, C.ink, 1.4), circle(58, 84, 10, STEEL, C.ink, 1.4), path('M26 46 C26 30 50 30 50 46 L68 84 C68 96 48 96 48 84 Z', 'none', HL, 4),
    waPulse('cartktju', path('M88 40 q3 -6 6 0 t6 0 t6 0 t6 0 M88 56 q3 -6 6 0 t6 0 t6 0 t6 0 M88 72 q3 -6 6 0 t6 0 t6 0 t6 0', 'none', HOT, 1.8))),
  'cartk.besikta': all(bg('#e9eef2'), rect(0, 96, 120, 24, '#9aa3ad', 0, null), rect(14, 96, 60, 10, '#5a5d68', 0, null), carSide(44, 92, 0.9), person(98, '#e4a43c', { s: 0.85, l: [-22, 10], r: [10, 24] }), paper(92, 84, 14, 18),
    waPulse('cartkbes', path('M78 62 L50 82 L62 92 Z', 'rgba(255,240,150,.6)', null)), rect(74, 58, 8, 6, C.dark, 1, C.ink, 1)),
  'cartk.ombesiktning': all(bg(), greyed(paper(8, 20, 40, 52, cross(28, 52, 9))), arrow(52, 46, 66, 46, HL, 3), g('translate(70 20)', rect(0, 0, 42, 40, C.white, 3, C.ink, 1.4), rect(0, 0, 42, 10, RED, 3, null), ...range(8).map((i) => rect(4 + (i % 4) * 9.5, 14 + Math.floor(i / 4) * 12, 7, 8, i === 5 ? HL : '#eef1f4', 1, C.ink, 0.6))),
    carSide(60, 105, 0.7), tick(102, 86, 2.2)),
  'cartk.körförbud': all(bg(), road(104), carSide(60, 105, 0.9), noSign(60, 78, 34), g('translate(98 26)', rect(-10, -8, 20, 16, C.gold, 3, C.ink, 1.2), rect(-3, 8, 6, 14, STEEL, 1, C.ink, 1)), cross(98, 32, 10)),
};
