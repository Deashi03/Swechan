/**
 * Teknik & digital värld → Transportteknik → Tåg & spårfordon, 4231–4237 (0.60):
 * locomotives and multiple units, switches, train brakes, signalling, train traffic control, railway maintenance and
 * high-speed trains – seen from the vehicle and the journey.
 * Recurring signs: the part that the word names is orange (or framed or ringed in orange); grey parts show what the
 * word is not. Rails are steel grey, sleepers concrete grey, passenger trains blue, the generic locomotive dark green,
 * freight wagons brown, electricity a yellow bolt, ice light blue and heat red-orange. Words that are easy to mix up
 * get clearly different scenes: tåg (a whole long train in a landscape), lok (a green locomotive pulling grey wagons,
 * no wire and no smoke), motorvagn (a cut-away car with orange motors under the floor and people inside), tågsätt (two
 * coupled units, an orange bracket over one of them), personvagn (one car with faces, the neighbours grey) and godsvagn
 * (one wagon with logs); styrvagn (the front car with a driver, the locomotive pushing from behind) and dubbeldäckare
 * (a tall car with two rows of faces); växeltunga (a close-up of the orange tongue), lägga om (the whole switch with
 * the tongues swinging, no train), byta spår (a train following a dashed path from one track to the other) and veva
 * (a hand turning a crank); stickspår (a short track that ends at a buffer stop) and vända (a train with a U-turn
 * arrow at the end of the line); bromsspak (a lever in the cab), bromsprov (a brake block that closes on a wheel and a
 * tick), nödbroms (the red handle on the wall), glidskydd (a rolling orange wheel next to a grey wheel that slides)
 * and hjulplatta (a wheel with a flat spot); försignal (a small signal far before a grey main signal), ATC (the speed
 * screen in the cab), balis (a yellow box between the rails sending waves up), tvångsbromsa (a screen and the wheels
 * braking by themselves in front of a red light), kvittera (a hand pressing a button next to a blinking lamp) and
 * blocksträcka (a track divided into sections, one of them orange); avgångssignal (a train guard raising a green disc),
 * radiokontakt (radio waves between a cab and a traffic controller) and klartecken (a green tick in a speech bubble);
 * höghastighetsbana (a straight empty line to the horizon), topphastighet (a gauge at its end stop), aerodynamisk (a
 * drop shape against a grey box), tryckvåg (rings out of a tunnel) and nos (the long front of a train).
 * Digits and code signs only; no words, no brands, no logos.
 */
import { C, all, arrow, circle, g, line, moving, path, rect, waGrow, waIn, waPulse, waShake, waSpin, waSway, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const STEEL = '#8d949b';
const STEEL2 = '#b8c0c8';
const CONC = '#cfcac0';
const STONE = '#b3aa9b';
const GRASS = '#9fcf8a';
const TRAIN = '#3f7fc8';
const LOCO = '#3d7a55';
const WAGON = '#9a6a45';
const GLASS = '#dff1fb';
const ICE = '#bfe6f7';
const HEAT = '#e4572e';
const VEST = '#f28c28';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 5, col, 2.6);
const sky = (col = '#e3f1f8') => rect(0, 0, 120, 120, col, 0, null);
const grass = (y = 100) => rect(0, y, 120, 120 - y, GRASS, 0, null);
const cross = (x: number, y: number, s = 6, col: string = C.red) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 3);
const tick = (x: number, y: number, s = 1, col: string = C.green) => line(`M${x - 4 * s} ${y} L${x - 1 * s} ${y + 3 * s} L${x + 5 * s} ${y - 4 * s}`, col, 2.8);
const bolt = (x: number, y: number, s = 1, col: string = C.yellow) => g(`translate(${x} ${y}) scale(${s})`, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', col, C.ink, 1.4));
const drop = (x: number, y: number, s = 1, col: string = '#8cc7e8') => path(`M${x} ${y - 5 * s} C${x + 4 * s} ${y} ${x + 3 * s} ${y + 4 * s} ${x} ${y + 4 * s} C${x - 3 * s} ${y + 4 * s} ${x - 4 * s} ${y} ${x} ${y - 5 * s} Z`, col, C.ink, 0.8);
const sparks = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L-9 -6 M0 0 L-11 -1 M0 0 L-8 4 M0 0 L-4 -9 M0 0 L-13 -4', C.yellow, 1.8), line('M0 0 L-6 -3 M0 0 L-7 2', C.orange, 1.4));
const waves = (x: number, y: number, n = 3, col: string = HL, dir = 1) => all(...range(n).map((i) => path(`M${x + dir * (6 + i * 6)} ${y - 6 - i * 4} C${x + dir * (10 + i * 7)} ${y - 2} ${x + dir * (10 + i * 7)} ${y + 2} ${x + dir * (6 + i * 6)} ${y + 6 + i * 4}`, 'none', col, 2.2)));
/** Standing person, feet at (x, y=112); arms from the shoulders to (lx, ly) and (rx, ry) relative to the neck. */
const person = (x: number, top: string, o: { s?: number; l?: [number, number]; r?: [number, number]; hat?: string; hair?: string; y?: number; legs?: string } = {}) => {
  const s = o.s ?? 1, [lx, ly] = o.l ?? [-12, 22], [rx, ry] = o.r ?? [12, 22];
  return g(`translate(${x} ${o.y ?? 112}) scale(${s})`, line('M-5 0 L-4 -26 M5 0 L4 -26', o.legs ?? C.navy, 7), rect(-11, -56, 22, 32, top, 6, C.ink, 1.6),
    line(`M-9 -52 L${lx} ${-56 + ly}`, C.ink, 6.4), line(`M-9 -52 L${lx} ${-56 + ly}`, top, 4.4), circle(lx, -56 + ly, 3.2, C.skin, C.ink, 1.2),
    line(`M9 -52 L${rx} ${-56 + ry}`, C.ink, 6.4), line(`M9 -52 L${rx} ${-56 + ry}`, top, 4.4), circle(rx, -56 + ry, 3.2, C.skin, C.ink, 1.2),
    circle(0, -67, 10, C.skin, C.ink, 1.6), o.hat ? path('M-12 -70 C-12 -84 12 -84 12 -70 L14 -69 L-14 -69 Z', o.hat, C.ink, 1.6) : path('M-10 -68 C-10 -81 10 -81 10 -68 C6 -73 -6 -73 -10 -68 Z', o.hair ?? C.hair, null),
    circle(-3.5, -66, 1.2, C.ink, null), circle(3.5, -66, 1.2, C.ink, null), path('M-3 -61 C-1 -59 1 -59 3 -61', 'none', C.ink, 1.2));
};
/** A hand seen from the side, the fingers closed around something at (x, y). */
const fist = (x: number, y: number, s = 1, rot = 0, sleeve: string = C.navy) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  rect(-26, -6, 16, 12, sleeve, 2, C.ink, 1.4), path('M-11 -7 L2 -7 C7 -7 8 -3 8 0 C8 4 6 7 2 7 L-11 7 Z', C.skin, C.ink, 1.4), line('M-2 -7 L-2 7 M3 -6 L3 6', C.ink, 0.8));

// ── Railway parts ────────────────────────────────────────────────────
/** Track seen from above between x1 and x2, centre line y. */
const trackTop = (x1: number, x2: number, y: number, o: { gap?: number; rail?: string; sl?: string; step?: number } = {}) => {
  const gp = o.gap ?? 5, st = o.step ?? 7;
  return all(...range(Math.floor((x2 - x1) / st) + 1).map((i) => rect(x1 + i * st - 1.5, y - gp - 4, 3, 2 * gp + 8, o.sl ?? CONC, 0.5, C.ink, 0.6)),
    line(`M${x1} ${y - gp} L${x2} ${y - gp} M${x1} ${y + gp} L${x2} ${y + gp}`, o.rail ?? STEEL, 2.4));
};
/** Track seen from the side, rail top at y. */
const trackSide = (x1: number, x2: number, y: number, rail: string = STEEL) => all(path(`M${x1} ${y + 9} L${x1 + 4} ${y + 3} L${x2 - 4} ${y + 3} L${x2} ${y + 9} Z`, STONE, C.ink, 1),
  ...range(Math.floor((x2 - x1 - 6) / 10) + 1).map((i) => rect(x1 + 4 + i * 10, y + 2, 6, 3, CONC, 0.5, C.ink, 0.6)), rect(x1, y - 1, x2 - x1, 3, rail, 0.5, C.ink, 0.8));
const wheels = (xs: number[], y: number, r = 3) => all(...xs.map((cx) => all(circle(cx, y - r + 1, r, C.dark, C.ink, 1), circle(cx, y - r + 1, r * 0.35, STEEL2, null))));
/** Passenger car seen from the side: x, wheels on y, width w, height h. */
const car = (x: number, y: number, w: number, o: { col?: string; heads?: boolean; h?: number; nose?: 'l' | 'r' | 'both'; cab?: boolean; windows?: boolean } = {}) => {
  const col = o.col ?? TRAIN, h = o.h ?? 26, top = y - 4 - h, n = Math.max(1, Math.floor((w - 12) / 10));
  const r = o.nose === 'r' || o.nose === 'both', l = o.nose === 'l' || o.nose === 'both';
  const body = `M${x + (l ? 8 : 0)} ${top} L${x + w - (r ? 8 : 0)} ${top} ${r ? `C${x + w - 2} ${top} ${x + w} ${top + 8} ${x + w} ${top + 14}` : ''} L${x + w} ${y - 4} L${x} ${y - 4} L${x} ${top + (l ? 14 : 0)} ${l ? `C${x} ${top + 8} ${x + 2} ${top} ${x + 8} ${top}` : ''} Z`;
  return all(path(body, col, C.ink, 1.5),
    o.windows === false ? '' : all(...range(n).map((i) => rect(x + 6 + i * 10, top + 4, 7, 8, GLASS, 1.5, C.ink, 0.8))),
    o.heads ? all(...range(n).map((i) => all(circle(x + 9.5 + i * 10, top + 9, 2, C.skin, null), rect(x + 7.5 + i * 10, top + 10.5, 4, 1.5, i % 2 ? C.red : C.green, 0.5, null)))) : '',
    line(`M${x} ${y - 11} L${x + w} ${y - 11}`, C.white, 1.4),
    wheels([x + 6, x + 13, x + w - 13, x + w - 6], y));
};
/** Generic locomotive (dark green, cab windows at both ends, no wire, no smoke), wheels on y. */
const loco = (x: number, y: number, w = 40, col: string = LOCO) => all(path(`M${x} ${y - 4} L${x} ${y - 28} L${x + w} ${y - 28} L${x + w} ${y - 4} Z`, col, C.ink, 1.6),
  rect(x + 3, y - 24, 8, 9, GLASS, 1.5, C.ink, 0.8), rect(x + w - 11, y - 24, 8, 9, GLASS, 1.5, C.ink, 0.8), rect(x + 14, y - 22, w - 28, 5, C.yellow, 1, C.ink, 0.8),
  line(`M${x} ${y - 11} L${x + w} ${y - 11}`, C.yellow, 1.6), wheels([x + 7, x + 15, x + w - 15, x + w - 7], y));
/** Log wagon. */
const logWagon = (x: number, y: number, w = 36, col: string = WAGON) => all(rect(x, y - 12, w, 8, col, 1, C.ink, 1.4), rect(x + 2, y - 24, 2.5, 12, C.dark, 0.5, null), rect(x + w - 4.5, y - 24, 2.5, 12, C.dark, 0.5, null),
  ...range(5).map((i) => circle(x + 7 + (i % 3) * 10 + (i > 2 ? 5 : 0), y - 15 - (i > 2 ? 6 : 0), 3.4, '#c99a62', C.ink, 0.9)), wheels([x + 6, x + w - 6], y));
const coupler = (x: number, y: number, col: string = C.dark) => rect(x - 3, y - 10, 6, 3, col, 1, C.ink, 0.8);
/** Railway signal mast at x, feet on y. */
const signal = (x: number, y: number, lit: 'red' | 'green' | 'yellow' | 'none' = 'red', s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-1.6, -50, 3.2, 50, C.dark, 1, null), rect(-7, -74, 14, 26, C.black, 4, C.ink, 1.4),
  circle(0, -67, 4.2, lit === 'red' ? C.red : lit === 'yellow' ? C.yellow : '#5a3a3a', C.ink, 0.8), circle(0, -55, 4.2, lit === 'green' ? '#3cc46a' : '#2f4a3a', C.ink, 0.8));
const platform = (x1: number, x2: number, y: number, col = '#d8d2c6') => all(rect(x1, y, x2 - x1, 120 - y, col, 0, C.ink, 1.2), line(`M${x1} ${y + 3} L${x2} ${y + 3}`, C.white, 2, '5 3'));
const screen = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x, y, w, h, C.dark, 3, C.ink, 1.6), rect(x + 3, y + 3, w - 6, h - 6, '#14233f', 1.5, null), inner);
/** Train seen from above, centre (x, y), length l. */
const trainTop = (x: number, y: number, l = 30, dir = 1, col: string = TRAIN) => g(`translate(${x} ${y}) scale(${dir} 1)`,
  path(`M${-l / 2} -5 L${l / 2 - 6} -5 C${l / 2 - 1} -5 ${l / 2} -2 ${l / 2} 0 C${l / 2} 2 ${l / 2 - 1} 5 ${l / 2 - 6} 5 L${-l / 2} 5 Z`, col, C.ink, 1.4), line(`M${-l / 2 + 3} 0 L${l / 2 - 8} 0`, C.white, 1.2));
const bufferStop = (x: number, y: number) => all(rect(x - 3, y - 9, 6, 18, C.red, 1, C.ink, 1.2), rect(x - 3, y - 3, 6, 6, C.white, 0, null), rect(x - 3, y - 9, 6, 18, 'none', 1, C.ink, 1.2));
/** A wheel on a rail seen from the side, centre (x, y), radius r. */
const bigWheel = (x: number, y: number, r: number, col: string = C.dark) => all(circle(x, y, r, col, C.ink, 1.8), circle(x, y, r * 0.72, STEEL, C.ink, 1), circle(x, y, r * 0.2, C.dark, C.ink, 1));
const gauge = (x: number, y: number, r: number, deg: number, o: { arc?: string; face?: string; digits?: boolean } = {}) => all(circle(x, y, r, o.face ?? '#14233f', C.ink, 1.8),
  ...range(9).map((i) => { const a = Math.PI * (0.75 + i * 0.1875); return line(`M${f1(x + Math.cos(a) * (r - 3))} ${f1(y + Math.sin(a) * (r - 3))} L${f1(x + Math.cos(a) * (r - 7))} ${f1(y + Math.sin(a) * (r - 7))}`, C.white, 1.2); }),
  o.arc ? path(`M${f1(x + Math.cos(Math.PI * 2.05) * (r - 4))} ${f1(y + Math.sin(Math.PI * 2.05) * (r - 4))} A${r - 4} ${r - 4} 0 0 1 ${f1(x + Math.cos(Math.PI * 2.25) * (r - 4))} ${f1(y + Math.sin(Math.PI * 2.25) * (r - 4))}`, 'none', o.arc, 4) : '',
  g(`translate(${x} ${y}) rotate(${deg})`, line(`M0 0 L${r - 6} 0`, C.red, 2.4)), circle(x, y, 2.6, C.white, C.ink, 1));
const house = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-12, -18, 24, 18, '#f1e3c8', 1, C.ink, 1.4), path('M-15 -17 L0 -30 L15 -17 Z', C.red, C.ink, 1.4), rect(-4, -10, 7, 10, C.brown, 1, C.ink, 1), rect(5, -14, 5, 5, GLASS, 1, C.ink, 0.8));

export const TRAINV_MOTIFS: Record<string, Svg> = {
  // ── 4231 Lok och motorvagnar ──
  'trainv.tåg': all(sky(), path('M0 70 C30 58 60 66 90 56 C104 52 114 54 120 56 L120 100 L0 100 Z', '#cfe6bf', null), grass(98), trackSide(0, 120, 96),
    car(4, 96, 36, { nose: 'l' }), car(42, 96, 36), car(80, 96, 36, { nose: 'r' }), coupler(41, 96), coupler(79, 96),
    waIn('trainvtag', -14, 0, line('M-2 70 L-12 70 M-2 78 L-16 78 M-2 86 L-10 86', C.grey, 1.8)), frame(2, 60, 116, 38)),
  'trainv.lok': all(sky(), grass(100), trackSide(0, 120, 98), greyed(car(2, 98, 34, { windows: false }), car(38, 98, 30, { windows: false })), coupler(70, 98),
    loco(72, 98, 44), arrow(80, 50, 108, 50, C.ink, 2.6), ring(94, 82, 26)),
  'trainv.spårfordon': all(sky('#eef3f6'),
    trackSide(0, 120, 36, HL), car(30, 36, 50, { col: C.yellow, nose: 'both', h: 18 }), line('M50 14 L56 8 L52 3 M62 14 L56 8 M47 3 L58 3', C.dark, 1.4),
    trackSide(0, 120, 72, HL), car(8, 72, 104, { nose: 'r', h: 22 }),
    trackSide(0, 120, 108, HL), car(34, 108, 52, { col: C.red, nose: 'both', h: 20 })),
  'trainv.motorvagn': all(sky(), grass(100), trackSide(0, 120, 98), car(4, 98, 56, { heads: true, nose: 'l' }), car(62, 98, 56, { heads: true, nose: 'r' }), coupler(61, 98),
    ...[18, 42, 76, 100].map((x) => all(rect(x - 7, 84, 14, 6, HL, 1.5, C.ink, 1.2), waSpin(`trainvmv${x}`, 2, circle(x, 87, 2.2, C.white, C.ink, 0.8), line(`M${x - 2} 87 L${x + 2} 87`, C.ink, 0.8)))),
    bolt(60, 34, 0.8)),
  'trainv.tågsätt': all(sky(), grass(100), trackSide(0, 120, 98), car(2, 98, 28, { nose: 'l', h: 22 }), car(31, 98, 28, { nose: 'r', h: 22 }), coupler(30, 98),
    greyed(car(62, 98, 28, { nose: 'l', h: 22 }), car(91, 98, 28, { nose: 'r', h: 22 })), coupler(61, 98, HL),
    line('M2 62 L2 56 L59 56 L59 62', HL, 2.6), circle(61, 88, 5, 'none', C.ink, 1.2)),
  'trainv.förarhytt': all(rect(0, 0, 120, 120, '#d9dde2', 0, null), path('M10 10 L110 10 L104 62 L16 62 Z', '#cfe7f5', C.ink, 2), path('M10 10 L110 10 L104 62 L16 62 Z', 'none', HL, 2.6),
    path('M60 26 L36 62 M60 26 L84 62', 'none', STEEL, 2.2), ...range(5).map((i) => line(`M${f1(56 - i * 4.6)} ${30 + i * 7} L${f1(64 + i * 4.6)} ${30 + i * 7}`, CONC, 1.6)), path('M16 40 C40 34 80 34 104 40', 'none', '#9fcf8a', 6),
    rect(6, 64, 108, 22, C.dark, 3, C.ink, 1.6), screen(14, 67, 24, 14, line('M18 77 L24 72 L30 75 L35 70', '#7fd0ff', 1.4)), screen(82, 67, 24, 14, circle(94, 74, 4, 'none', '#7fd0ff', 1.4)),
    rect(52, 70, 14, 6, C.grey, 1, C.ink, 1), circle(59, 69, 3, C.red, C.ink, 1),
    circle(60, 98, 13, C.hair, C.ink, 1.6), path('M38 120 C38 106 82 106 82 120 Z', C.navy, C.ink, 1.6)),
  'trainv.personvagn': all(sky(), platform(0, 120, 100), greyed(car(-24, 98, 30, {}), car(98, 98, 30, {})), car(8, 98, 88, { heads: true }), frame(6, 62, 92, 38)),
  'trainv.godsvagn': all(sky(), grass(100), trackSide(0, 120, 98), greyed(logWagon(-20, 98, 30), logWagon(104, 98, 30)), logWagon(20, 98, 80), frame(16, 64, 88, 36)),
  'trainv.styrvagn': all(sky(), grass(100), trackSide(0, 120, 98), greyed(loco(0, 98, 30)), coupler(31, 98), car(33, 98, 40, { heads: true }), coupler(74, 98),
    car(76, 98, 42, { nose: 'r', heads: false }), circle(110, 75, 2.6, C.skin, C.ink, 1), ring(98, 80, 20), arrow(30, 50, 46, 50, C.grey, 2.4), arrow(84, 46, 112, 46, C.ink, 2.6)),
  'trainv.dubbeldäckare': all(sky(), platform(0, 120, 100), greyed(car(-30, 98, 32, { h: 22 })),
    path('M8 96 L8 40 L104 40 C112 40 114 48 114 56 L114 96 Z', TRAIN, C.ink, 1.6),
    ...[0, 1].map((r) => all(...range(8).map((i) => all(rect(12 + i * 11, 46 + r * 24, 8, 10, GLASS, 1.5, C.ink, 0.8), circle(16 + i * 11, 51 + r * 24, 2.2, C.skin, null))))),
    line('M8 66 L114 66', C.white, 1.6), wheels([16, 26, 94, 104], 100), frame(5, 37, 112, 64)),
  'trainv.batteritåg': all(sky(), grass(100), trackSide(0, 120, 98), line('M0 30 L44 30', C.dark, 1.8), rect(40, 26, 4, 8, C.grey, 1, C.ink, 1), car(30, 98, 82, { nose: 'r' }),
    g('translate(56 78)', rect(0, -9, 26, 14, C.white, 2, C.ink, 1.6), rect(26, -5, 3, 6, C.ink, 1, null), ...range(3).map((i) => waPulse(`trainvbat${i}`, rect(3 + i * 7.5, -6, 6, 8, C.green, 1, null)))), ring(69, 75, 18),
    arrow(70, 44, 104, 44, C.ink, 2.4)),
  'trainv.koppla-isär': all(sky(), grass(100), trackSide(0, 120, 98), car(2, 98, 54, { nose: 'l' }), rect(56, 86, 6, 3, HL, 1, C.ink, 0.8),
    moving('trainvkis', '0%,20%{transform:translate(-8px,0)}80%,100%{transform:translate(0,0)}', { dur: 2.8 }, rect(66, 86, 6, 3, HL, 1, C.ink, 0.8), car(72, 98, 46, { nose: 'r' })),
    arrow(52, 54, 40, 54, C.ink, 2.4), arrow(76, 54, 88, 54, C.ink, 2.4), ring(64, 87, 10)),

  // ── 4232 Spårväxlar ──
  'trainv.växeltunga': all(rect(0, 0, 120, 120, STONE, 0, null), ...range(9).map((i) => rect(4 + i * 14, 20, 6, 84, CONC, 1, C.ink, 0.8)),
    line('M0 36 L120 36', STEEL, 5), line('M0 88 L120 88', STEEL, 5), line('M0 36 L120 36 M0 88 L120 88', STEEL2, 1.6), line('M54 82 C80 76 100 66 120 58', STEEL, 4),
    path('M18 82 L84 84 L84 88 L18 86 Z', HL, C.ink, 1.4), ring(30, 84, 14), arrow(30, 66, 30, 76, C.ink, 2.2), arrow(30, 102, 30, 92, C.grey, 2)),
  'trainv.lägga-om.4': all(rect(0, 0, 120, 120, GRASS, 0, null), trackTop(0, 120, 74), g('rotate(-24 50 74)', trackTop(50, 130, 74)),
    g('translate(30 74)', moving('trainvlom', '0%,30%{transform:rotate(-9deg)}60%,100%{transform:rotate(0)}', { dur: 2.6 }, path('M0 -5 L36 -11 L36 -8 L0 -2 Z M0 5 L36 5 L36 8 L0 8 Z', HL, C.ink, 1))),
    path('M42 40 C54 30 66 30 74 38', 'none', C.ink, 2.2), arrow(70, 34, 76, 42, C.ink, 2.2), path('M74 104 C62 112 50 112 42 106', 'none', C.ink, 2.2), arrow(46, 110, 40, 104, C.ink, 2.2), ring(48, 72, 22)),
  'trainv.byta-spår': all(rect(0, 0, 120, 120, GRASS, 0, null), trackTop(0, 120, 40), trackTop(0, 120, 84), g('rotate(-34 30 84)', trackTop(30, 110, 84)),
    line('M4 84 L30 84 L96 40 L116 40', HL, 2.4, '5 4'),
    moving('trainvbyt', '0%{transform:translate(-28px,19px)}100%{transform:translate(0,0)}', { dur: 3 }, g('rotate(-34 63 62)', trainTop(63, 62, 30, 1))), arrow(92, 26, 112, 26, C.ink, 2.4)),
  'trainv.stickspår': all(rect(0, 0, 120, 120, GRASS, 0, null), trackTop(0, 120, 34), path('M16 34 C34 34 38 76 56 76', 'none', STEEL, 2.4), trackTop(52, 96, 76, { rail: HL }), bufferStop(100, 76),
    greyed(trainTop(76, 76, 30, 1, C.yellow)), frame(46, 60, 66, 32), ring(100, 76, 11)),
  'trainv.vända.2': all(rect(0, 0, 120, 120, GRASS, 0, null), trackTop(0, 110, 60), bufferStop(112, 60),
    moving('trainvvan', '0%{transform:translate(-30px,0)}45%,55%{transform:translate(0,0)}100%{transform:translate(-30px,0)}', { dur: 3.6 }, trainTop(80, 60, 34, 1)),
    path('M50 44 L90 44 C104 44 104 26 90 26 L36 26', 'none', HL, 3), arrow(44, 26, 30, 26, HL, 3)),
  'trainv.veva': all(rect(0, 0, 120, 120, STONE, 0, null), ...range(6).map((i) => rect(4 + i * 20, 70, 8, 44, CONC, 1, C.ink, 0.8)), line('M0 82 L120 82 M0 104 L120 104', STEEL, 4),
    rect(20, 50, 34, 22, C.grey, 2, C.ink, 1.6), circle(54, 58, 3, C.dark, C.ink, 1),
    g('translate(54 58)', moving('trainvveva', '0%{transform:rotate(-360deg)}100%{transform:rotate(0)}', { dur: 2.4 }, line('M0 0 L22 -16', C.dark, 4), line('M22 -16 L22 -28', C.dark, 4), rect(18, -34, 8, 10, HL, 2, C.ink, 1.2), g('translate(22 -30)', fist(0, 0, 1, -80, VEST)))),
    path('M70 70 C84 76 98 64 96 48', 'none', HL, 2.2), arrow(97, 52, 96, 44, HL, 2.4)),
  'trainv.krängning': all(sky(), rect(0, 100, 120, 20, STONE, 0, null), line('M24 100 L96 100', STEEL, 4), line('M60 18 L60 100', C.grey, 1.4, '4 3'),
    waSway('trainvkrang', 4, g('rotate(10 60 100)', path('M30 98 L30 40 C30 28 90 28 90 40 L90 98 Z', TRAIN, C.ink, 1.8), rect(38, 42, 44, 22, GLASS, 3, C.ink, 1.2), circle(50, 54, 4, C.skin, null), circle(70, 54, 4, C.skin, null), line('M30 78 L90 78', C.white, 2))),
    path('M60 36 A64 64 0 0 1 72 38', 'none', HL, 3), arrow(96, 46, 108, 58, HL, 2.6)),
  'trainv.hastighetsbegränsning': all(sky(), grass(100), trackSide(0, 120, 98), g('translate(96 0)', rect(-1.6, 40, 3.2, 58, C.grey, 1, null), circle(0, 34, 15, C.white, C.red, 4), T(0, 39, '40', 13, C.ink)), ring(96, 34, 19),
    car(0, 98, 64, { nose: 'r' }), arrow(70, 56, 80, 56, C.ink, 2.4), line('M58 50 L66 50 M54 62 L64 62', C.grey, 1.6)),

  // ── 4233 Tågbromsar ──
  'trainv.bromsspak': all(rect(0, 0, 120, 120, '#d9dde2', 0, null), rect(0, 70, 120, 50, C.dark, 0, C.ink, 1.6), screen(8, 16, 34, 24, line('M14 32 L22 26 L30 30 L36 22', '#7fd0ff', 1.4)), screen(78, 16, 34, 24, circle(95, 28, 7, 'none', '#7fd0ff', 1.4)),
    path('M40 84 A26 26 0 0 1 80 84', 'none', C.grey, 4), ...range(5).map((i) => { const a = Math.PI * (1.15 + i * 0.175); return line(`M${f1(60 + Math.cos(a) * 26)} ${f1(96 + Math.sin(a) * 26)} L${f1(60 + Math.cos(a) * 31)} ${f1(96 + Math.sin(a) * 31)}`, C.white, 1.6); }),
    g('translate(60 96)', moving('trainvspak', '0%,20%{transform:rotate(40deg)}70%,100%{transform:rotate(0)}', { dur: 2.6 }, line('M0 0 L-16 -30', C.grey, 5), circle(-16, -32, 7, HL, C.ink, 1.6), fist(-16, -32, 0.9, -30))),
    circle(60, 96, 6, C.grey, C.ink, 1.4), arrow(62, 54, 40, 50, C.ink, 2.2), ring(46, 66, 13)),
  'trainv.bromsprov': all(sky('#eef3f6'), trackSide(0, 120, 100), bigWheel(48, 74, 24),
    moving('trainvbprov', '0%,20%{transform:translate(10px,0)}60%,100%{transform:translate(0,0)}', { dur: 2.6 }, path('M74 58 L80 58 L80 90 L74 90 C78 80 78 68 74 58 Z', HL, C.ink, 1.4), line('M80 74 L92 74', C.dark, 3)),
    person(104, VEST, { s: 0.6, r: [10, 6], hat: C.yellow }), circle(100, 22, 9, C.white, C.green, 2.4), tick(100, 22, 1.2)),
  'trainv.nödbroms': all(rect(0, 0, 120, 120, '#e6e9ec', 0, null), rect(0, 0, 18, 120, GLASS, 0, C.ink, 1.2), rect(26, 18, 70, 84, C.white, 4, C.ink, 1.6), rect(30, 22, 62, 76, 'none', 3, C.yellow, 3),
    g('translate(61 36) scale(1.2)', path('M0 -10 L10 7 L-10 7 Z', C.yellow, C.ink, 1.4), line('M0 -4 L0 2', C.ink, 2), circle(0, 4.5, 1, C.ink, null)),
    rect(42, 62, 38, 12, C.red, 4, C.ink, 1.6), line('M50 74 L50 82 M72 74 L72 82', C.dark, 2.4), fist(66, 68, 1, 0, C.green), frame(22, 14, 78, 92)),
  'trainv.glidskydd': all(rect(0, 0, 120, 120, '#eef6fb', 0, null), line('M0 96 L120 96', STEEL, 5), rect(0, 94, 120, 3, ICE, 0, null),
    greyed(bigWheel(30, 74, 20), line('M6 98 L50 98', C.dark, 1.6), line('M10 101 L44 101', C.dark, 1), cross(30, 40, 7)),
    waSpin('trainvglid', 1.8, g('', bigWheel(88, 74, 20), line('M88 56 L88 92 M70 74 L106 74', C.dark, 1.6))), ring(88, 74, 24),
    rect(80, 20, 16, 12, C.dark, 2, C.ink, 1.2), line('M88 32 L88 48', HL, 1.6, '2 2'), path('M64 52 C66 44 76 42 80 46', 'none', HL, 2), arrow(76, 44, 80, 48, HL, 2)),
  'trainv.hjulplatta': all(sky('#eef3f6'), trackSide(0, 120, 98), path('M33 97 L87 97 A30 30 0 1 0 33 97 Z', C.dark, C.ink, 1.8), circle(60, 72, 19, STEEL, C.ink, 1), circle(60, 72, 6, C.dark, C.ink, 1),
    line('M33 97 L87 97', HL, 3.4), ring(60, 96, 18), waShake('trainvplatta', line('M18 84 L10 80 M18 92 L8 92 M102 84 L110 80 M102 92 L112 92', C.ink, 1.8))),

  // ── 4234 Signalsystem ──
  'trainv.försignal': all(sky(), grass(100), trackSide(0, 120, 98), g('translate(40 0)', rect(-1.4, 64, 2.8, 34, C.dark, 1, null), rect(-6, 50, 12, 16, C.black, 3, C.ink, 1.2), waPulse('trainvfsig', circle(0, 58, 3.6, C.yellow, C.ink, 0.8))), ring(40, 58, 11),
    greyed(signal(100, 98, 'red', 0.9)), line('M48 40 C64 30 82 30 96 38', HL, 2, '4 3'), arrow(92, 36, 98, 40, HL, 2), g('translate(-62 0)', car(0, 98, 58, { nose: 'r' }))),
  'trainv.ATC': all(rect(0, 0, 120, 120, '#d9dde2', 0, null), rect(4, 8, 112, 82, C.dark, 6, C.ink, 2), rect(10, 14, 100, 70, '#14233f', 3, null),
    gauge(46, 50, 30, -30, { arc: C.red }), path(`M${f1(46 + Math.cos(Math.PI * 1.85) * 26)} ${f1(50 + Math.sin(Math.PI * 1.85) * 26)} l5 -2 l-1 5 Z`, C.yellow, null), T(46, 72, '80', 10, C.white),
    rect(84, 22, 20, 14, '#0e1a30', 2, '#7fd0ff', 1), T(94, 33, '120', 8, '#7fd0ff'), rect(84, 44, 20, 14, '#0e1a30', 2, C.yellow, 1), T(94, 55, '80', 8, C.yellow),
    g('translate(94 72) scale(0.5)', path('M-14 6 L-14 -6 L10 -6 C14 -6 16 -2 16 2 L16 6 Z', C.white, null)),
    rect(30, 96, 60, 12, C.grey, 3, C.ink, 1.4), ...range(4).map((i) => circle(40 + i * 13, 102, 3, i === 3 ? C.yellow : C.white, C.ink, 1)), frame(2, 6, 116, 86)),
  'trainv.balis': all(rect(0, 0, 120, 120, STONE, 0, null), ...range(6).map((i) => { const y = 116 - i * 12, w = 34 - i * 3; return rect(60 - w, y, 2 * w, 4, CONC, 1, C.ink, 0.6); }), path('M36 120 L54 50 M84 120 L66 50', 'none', STEEL, 3.6),
    path('M50 96 L70 96 L68 82 L52 82 Z', C.yellow, C.ink, 1.6), ring(60, 89, 16),
    waPulse('trainvbalis', path('M52 74 C56 70 64 70 68 74 M48 66 C54 60 66 60 72 66 M44 58 C52 50 68 50 76 58', 'none', HL, 2.2)),
    path('M14 6 L106 6 L100 40 L20 40 Z', TRAIN, C.ink, 1.6), rect(30, 12, 60, 14, GLASS, 2, C.ink, 1), wheels([30, 90], 46, 4)),
  'trainv.tvångsbromsa': all(sky(), grass(100), trackSide(0, 120, 98), signal(108, 98, 'red', 0.85),
    moving('trainvtvb', '0%{transform:translate(-40px,0)}60%,100%{transform:translate(0,0)}', { dur: 2.8 }, car(10, 98, 74, { nose: 'r' }), sparks(26, 96, 0.8), sparks(78, 96, 0.8)),
    g('translate(10 10)', screen(0, 0, 40, 26, all(circle(20, 13, 8, 'none', C.red, 2.4), line('M14 13 L26 13', C.red, 3)))),
    waPulse('trainvtvbl', rect(10, 10, 40, 26, 'none', 3, C.red, 2.4)), line('M30 36 L40 80', HL, 1.6, '3 2'), ring(30, 23, 22)),
  'trainv.kvittera.2': all(rect(0, 0, 120, 120, C.dark, 0, null), rect(10, 12, 100, 96, '#565a66', 6, C.ink, 1.6),
    circle(38, 40, 12, '#3a2f10', C.ink, 1.4), waPulse('trainvkvl', circle(38, 40, 10, C.yellow, null), path('M38 33 L38 42 M38 46 L38 47', 'none', C.ink, 2.4)),
    circle(80, 74, 13, C.white, C.ink, 1.8), circle(80, 74, 9, '#e8eef2', C.ink, 1),
    moving('trainvkvh', '0%,20%{transform:translate(8px,-10px)}55%,100%{transform:translate(0,0)}', { dur: 2.6 }, g('translate(80 74) rotate(-35)', path('M-6 -4 L6 -4 L6 18 L-6 18 Z', C.skin, C.ink, 1.4), rect(-8, 18, 16, 16, C.navy, 2, C.ink, 1.4), line('M-6 4 L6 4', C.ink, 0.8))),
    circle(84, 32, 9, C.white, C.green, 2.2), tick(84, 32, 1.1), ring(80, 74, 17)),
  'trainv.blocksträcka': all(rect(0, 0, 120, 120, GRASS, 0, null), trackTop(0, 120, 64), rect(40, 50, 40, 28, '#f9d8c8', 2, null), trackTop(40, 80, 64, { rail: HL }), rect(40, 50, 40, 28, 'none', 2, HL, 3),
    ...[40, 80].map((x) => line(`M${x} 44 L${x} 84`, C.ink, 1.6, '3 2')),
    trainTop(60, 64, 26, 1), g('translate(40 30)', rect(-4, -10, 8, 16, C.black, 2, C.ink, 1), circle(0, -5, 2.6, C.red, null)), g('translate(80 30)', rect(-4, -10, 8, 16, C.black, 2, C.ink, 1), circle(0, 1, 2.6, '#3cc46a', null)),
    g('translate(120 0) scale(-1 1)', greyed(trainTop(104, 64, 22, -1, C.red))), line('M2 96 L38 96 M42 96 L78 96 M82 96 L118 96', C.grey, 2), line('M42 96 L78 96', HL, 3)),
  'trainv.tyfon.2': all(sky(), grass(100), trackSide(0, 120, 98), path('M6 96 L6 50 L56 50 C72 50 80 66 82 84 L82 96 Z', TRAIN, C.ink, 1.6), path('M58 54 C68 56 74 66 76 76 L60 76 Z', GLASS, C.ink, 1), wheels([16, 26, 60, 70], 98),
    rect(44, 42, 14, 6, HL, 2, C.ink, 1.2), path('M58 42 L64 38 L64 52 L58 48 Z', HL, C.ink, 1.2), ring(56, 45, 12),
    waPulse('trainvtyf', waves(64, 45, 3, HL, 1)), line('M90 86 L118 86', C.grey, 1.4)),

  // ── 4235 Tågtrafikledning ──
  'trainv.tågnummer': all(sky(), grass(100), trackSide(0, 120, 98), path('M18 96 L18 36 L78 36 C96 36 104 58 106 80 L106 96 Z', TRAIN, C.ink, 1.8), path('M80 42 C92 46 98 58 100 70 L82 70 Z', GLASS, C.ink, 1),
    rect(30, 44, 40, 16, C.black, 2, C.ink, 1.4), T(50, 56, '537', 12, C.yellow), frame(26, 40, 48, 24), wheels([28, 40, 84, 96], 98), line('M18 80 L106 80', C.white, 2)),
  'trainv.avgångssignal': all(sky(), platform(0, 120, 100), car(-30, 98, 92, { nose: 'r' }), rect(40, 72, 12, 24, '#2a4f86', 1, C.ink, 1.2),
    person(86, C.navy, { hat: C.navy, r: [14, -20] }), line('M100 -2 L100 14', C.dark, 2.4), g('translate(100 26)', line('M0 14 L0 -2', C.dark, 2.4), circle(0, -10, 9, '#3cc46a', C.ink, 1.6), circle(0, -10, 4, C.white, null)),
    ring(100, 16, 14)),
  'trainv.radiokontakt': all(rect(0, 0, 120, 120, '#e9edf1', 0, null), rect(4, 40, 46, 60, TRAIN, 4, C.ink, 1.6), rect(10, 46, 34, 22, GLASS, 2, C.ink, 1), circle(26, 62, 7, C.skin, C.ink, 1.2), path('M19 56 C19 49 33 49 33 56 Z', C.hair, null),
    rect(32, 58, 5, 9, C.dark, 1.5, C.ink, 1), circle(102, 52, 9, C.skin, C.ink, 1.4), path('M93 50 C93 40 111 40 111 50', 'none', C.dark, 2.2), circle(93, 52, 2.6, C.dark, null), line('M93 54 L98 58', C.dark, 1.6),
    rect(88, 64, 28, 24, C.green, 5, C.ink, 1.4), rect(78, 92, 40, 6, '#b98652', 1, C.ink, 1.2), screen(78, 14, 34, 20, line('M82 26 L106 26', '#7fd0ff', 1.4)),
    waPulse('trainvradio', path('M50 50 C54 46 54 40 50 36 M56 54 C62 46 62 34 56 28 M84 50 C80 46 80 40 84 36 M78 54 C72 46 72 34 78 28', 'none', HL, 2.4)), line('M60 42 L74 42', HL, 1.6, '3 3')),
  'trainv.klartecken': all(rect(0, 0, 120, 120, '#eef1f4', 0, null), path('M30 10 L104 10 C110 10 112 14 112 18 L112 54 C112 60 108 62 104 62 L52 62 L38 76 L40 62 L30 62 C24 62 22 58 22 54 L22 18 C22 14 24 10 30 10 Z', C.white, C.ink, 2),
    circle(67, 36, 18, '#3cc46a', C.ink, 1.8), line('M57 36 L64 43 L78 28', C.white, 4.4), ring(67, 36, 22),
    grass(104), trackSide(0, 120, 104), g('translate(-10 6)', car(0, 98, 60, { nose: 'r' })), arrow(64, 84, 86, 84, C.ink, 2.4)),
  'trainv.personalbrist': all(rect(0, 0, 120, 120, '#eef1f4', 0, null),
    person(18, C.navy, { s: 0.62, y: 100, hat: C.navy }), ...[44, 70, 96].map((x) => g(`translate(${x} 100) scale(0.62)`, rect(-11, -56, 22, 32, 'none', 6, C.grey, 2, ), line('M-5 0 L-4 -26 M5 0 L4 -26', C.grey, 2), circle(0, -67, 10, 'none', C.grey, 2))),
    ...[44, 70, 96].map((x) => T(x, 72, '?', 12, HL)), frame(30, 46, 82, 58), line('M4 108 L116 108', C.grey, 2)),

  // ── 4236 Järnvägsunderhåll ──
  'trainv.avstängning': all(rect(0, 0, 120, 120, GRASS, 0, null), trackTop(0, 120, 60), rect(46, 34, 6, 52, C.grey, 1, C.ink, 1), rect(68, 34, 6, 52, C.grey, 1, C.ink, 1),
    g('translate(60 48)', rect(-24, -6, 48, 12, C.white, 2, C.ink, 1.6), ...range(4).map((i) => rect(-24 + i * 12, -6, 6, 12, C.red, 0, null)), rect(-24, -6, 48, 12, 'none', 2, C.ink, 1.6)),
    circle(60, 76, 9, C.red, C.ink, 1.4), line('M55 76 L65 76', C.white, 3), greyed(trainTop(18, 60, 30, 1)), frame(36, 28, 48, 64), line('M100 30 L100 90', C.grey, 1)),
  'trainv.mättåg': all(sky(), grass(100), trackSide(0, 120, 98), line('M0 22 L120 22', C.dark, 1.8),
    path('M8 94 L8 48 L94 48 C106 48 112 58 112 72 L112 94 Z', C.yellow, C.ink, 1.8), rect(14, 54, 60, 12, GLASS, 2, C.ink, 1), path('M96 54 C104 56 108 62 108 68 L96 68 Z', GLASS, C.ink, 1), wheels([18, 28, 92, 102], 98),
    waPulse('trainvmat', line('M40 94 L34 100 M40 94 L46 100 M80 94 L74 100 M80 94 L86 100', C.red, 1.6), line('M60 48 L60 24 M60 48 L50 24 M60 48 L70 24', C.red, 1.4, '3 2')),
    rect(56, 44, 8, 4, C.dark, 1, null), ring(60, 34, 16), line('M78 80 L88 76 L96 82 L104 74', C.dark, 1.4)),
  'trainv.rälsslipning': all(sky('#2f3550'), rect(0, 104, 120, 16, STONE, 0, null), trackSide(0, 120, 100), path('M10 96 L10 52 L90 52 L90 96 Z', C.yellow, C.ink, 1.8), rect(16, 58, 26, 14, GLASS, 2, C.ink, 1), wheels([20, 32, 70, 82], 100),
    waSpin('trainvslip', 0.8, g('', circle(56, 92, 8, STEEL, C.ink, 1.4), line('M50 92 L62 92 M56 86 L56 98', C.dark, 1.2))),
    waPulse('trainvslipsp', sparks(48, 98, 1.3), sparks(46, 96, 0.9)), ring(56, 94, 13), line('M94 100 L118 100', HL, 2.4)),
  'trainv.avisning': all(rect(0, 0, 120, 120, '#dfe3e7', 0, null), rect(0, 104, 120, 16, '#9aa3ad', 0, null), car(4, 100, 80, { nose: 'r' }),
    ...[20, 34, 48, 62].map((x) => path(`M${x - 4} 96 L${x + 4} 96 L${x} 104 Z`, ICE, '#5aa9d6', 1)),
    person(102, VEST, { s: 0.7, hat: C.yellow, l: [-18, 10] }), line('M92 84 L80 92', C.dark, 3),
    waIn('trainvavis', 16, -6, drop(70, 96, 1, HEAT), drop(60, 98, 1, HEAT), drop(50, 96, 1, HEAT), drop(40, 99, 1, HEAT)), line('M80 90 C70 84 56 86 40 94', HEAT, 1.6, '3 3'), ring(48, 96, 20)),
  'trainv.översyn': all(rect(0, 0, 120, 120, '#e6e2da', 0, null), rect(0, 104, 120, 16, '#8f959c', 0, null), rect(14, 58, 6, 46, VEST, 1, C.ink, 1.2), rect(96, 58, 6, 46, VEST, 1, C.ink, 1.2),
    car(6, 62, 108, {}), g('translate(30 96)', rect(-12, -4, 24, 6, C.dark, 1, C.ink, 1), circle(-7, 3, 5, C.dark, C.ink, 1), circle(7, 3, 5, C.dark, C.ink, 1)),
    g('translate(78 98) rotate(-30)', rect(-2, -12, 4, 18, C.grey, 1, C.ink, 1), path('M-6 -16 L6 -16 L4 -10 L-4 -10 Z', C.grey, C.ink, 1)), person(60, C.navy, { s: 0.55, y: 104, r: [14, -10] }), frame(4, 26, 112, 80)),

  // ── 4237 Höghastighetståg ──
  'trainv.höghastighetsbana': all(sky(), path('M0 46 C30 40 90 40 120 46 L120 120 L0 120 Z', GRASS, null),
    path('M20 120 L58 44 L62 44 L100 120 Z', STONE, C.ink, 1), path('M34 120 L59 44 M86 120 L61 44', 'none', HL, 3), path('M46 120 L59.6 44 M74 120 L60.4 44', 'none', STEEL, 1.6),
    ...range(6).map((i) => { const y = 50 + i * i * 2.4, w = 2 + i * 6; return line(`M${f1(60 - w)} ${f1(y)} L${f1(60 + w)} ${f1(y)}`, CONC, 0.6 + i * 0.5); }),
    line('M10 120 L56 46 M110 120 L64 46', C.grey, 1.2, '2 2'), ...[0, 1, 2].map((i) => all(line(`M${14 + i * 14} ${110 - i * 22} L${14 + i * 14} ${82 - i * 22}`, C.grey, 1.6), line(`M${106 - i * 14} ${110 - i * 22} L${106 - i * 14} ${82 - i * 22}`, C.grey, 1.6)))),
  'trainv.topphastighet': all(rect(0, 0, 120, 120, '#eef1f4', 0, null), gauge(60, 66, 46, 44, { arc: HL }),
    circle(60, 66, 46, 'none', C.ink, 2), ring(94, 94, 14), g('translate(54 92) scale(0.6)', path('M-14 8 L-14 -4 L12 -4 C20 -4 26 2 28 8 Z', C.white, C.ink, 1.6)),
    T(94, 116, '320', 10, HL)),
  'trainv.aerodynamisk': all(rect(0, 0, 120, 120, '#eef6fb', 0, null),
    ...[26, 34, 42].map((y, i) => line(`M4 ${y} C30 ${y - 2 - i * 2} 50 ${y - 6 + i * 4} 116 ${y}`, '#5aa9d6', 1.6)), path('M34 34 C34 22 56 20 92 34 C56 48 34 46 34 34 Z', HL, C.ink, 1.8),
    greyed(rect(36, 72, 30, 26, C.grey, 2, C.ink, 1.6), line('M4 78 L34 78 M4 86 L34 86 M4 94 L34 94', '#5aa9d6', 1.6), path('M70 76 C80 70 86 80 78 84 C72 88 72 80 78 80 M72 92 C84 88 90 98 80 100 C74 102 74 94 80 96', 'none', '#5aa9d6', 1.6))),
  'trainv.tryckvåg': all(sky(), path('M20 112 L20 70 C30 40 92 40 102 70 L102 112 Z', '#8fb57a', C.ink, 1.6), path('M28 112 L28 84 C28 74 40 74 40 84 L40 112 Z', '#2e2e36', C.ink, 1.4), path('M82 112 L82 84 C82 74 94 74 94 84 L94 112 Z', '#2e2e36', C.ink, 1.4),
    g('translate(-56 0)', car(0, 112, 84, { nose: 'r' })),
    waGrow('trainvtryck', path('M96 90 C104 92 104 104 96 106 M100 82 C114 88 114 108 100 112 M104 74 C122 82 122 112 104 118', 'none', HL, 2.6)), line('M40 100 L82 100', HL, 1.6, '4 3'), arrow(70, 100, 80, 100, HL, 2)),
  'trainv.nos.2': all(sky(), grass(100), trackSide(0, 120, 98), greyed(path('M0 94 L0 56 L50 56 L50 94 Z', C.white, C.ink, 1.6), line('M0 80 L50 80', TRAIN, 3)),
    path('M50 94 L50 56 L66 56 C88 58 106 74 118 92 L118 94 Z', C.white, C.ink, 1.8), path('M70 60 C80 62 88 68 92 74 L76 74 Z', '#14233f', C.ink, 1), line('M50 80 L112 80', TRAIN, 3), wheels([12, 22, 62, 72], 98),
    path('M62 54 C90 56 110 74 120 92', 'none', HL, 3), ring(92, 76, 26)),
  'trainv.bullerskydd': all(sky(), grass(100), trackSide(0, 54, 98), car(-10, 98, 52, { nose: 'r' }), rect(58, 50, 8, 52, HL, 1, C.ink, 1.6), ...range(4).map((i) => line(`M58 ${58 + i * 11} L66 ${58 + i * 11}`, C.ink, 0.8)),
    waves(42, 70, 2, C.red, 1), cross(52, 54, 4), house(96, 100, 1.1), path('M70 70 C74 66 74 62 70 58', 'none', C.grey, 1.2), frame(54, 46, 16, 58)),
  'trainv.tidsvinst': all(rect(0, 0, 120, 120, '#eef1f4', 0, null), rect(10, 30, 96, 14, C.grey, 3, C.ink, 1.4), g('translate(0 0) scale(1)', rect(10, 66, 62, 14, TRAIN, 3, C.ink, 1.4)), rect(72, 66, 34, 14, 'none', 3, HL, 2.6),
    line('M72 60 L72 88 M106 60 L106 88', HL, 1.6, '3 2'), circle(89, 100, 9, C.white, HL, 2.4), line('M89 100 L89 94 M89 100 L94 102', C.ink, 1.6), arrow(102, 73, 76, 73, HL, 2.2),
    g('translate(98 37) scale(0.45)', path('M-14 6 L-14 -6 L10 -6 C14 -6 16 -2 16 2 L16 6 Z', C.dark, null)), g('translate(64 73) scale(0.45)', path('M-14 6 L-14 -6 L10 -6 C18 -6 22 0 22 6 Z', C.white, null))),
};
