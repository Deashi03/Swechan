/**
 * Teknik & digital värld → Transportteknik → Framtidens transporter, 4261–4267 (0.60): self-driving vehicles, driver
 * assistance, electric public transport, hydrogen vehicles, drone deliveries, mobility services and energy-efficient
 * freight planning.
 * Recurring signs: the part that the word names is orange (or framed or ringed in orange); grey things show what the
 * word is not. Cars are blue, buses teal, lorries yellow-orange with a white box, electricity a yellow bolt, hydrogen
 * two light-blue balls joined, oxygen two red balls, water a blue drop, exhaust a grey cloud, sound short curved
 * strokes. Words that are easy to mix up get clearly different scenes: lidar (a spinning top that paints dots on a
 * pedestrian) and fordon (four different vehicles in a row); adaptiv farthållare (a bracket that keeps the gap to the
 * car in front), filhållningsassistent (a car steered back between the lane lines), kollisionsvarning (a red triangle
 * on the windscreen, the car in front far too close), död vinkel (a shaded wedge beside the car that the mirror cones
 * do not reach), backkamera (a screen with coloured guide lines) and parkeringssensor (arcs from the bumper to a
 * post); eldriven (plug and bolt), utsläppsfri (a crossed-out exhaust cloud) and tystgående (no sound, a bird is
 * heard) each against a grey diesel bus; bränslecell (molecules in, bolt and water out), elektrolys (bubbles from
 * two wires in a glass) and grön vätgas (wind and sun filling a green tank); drönarpilot (a person with a remote
 * control), inom synhåll (an eye's view cone with one drone inside and one outside); tomkörning (an empty lorry
 * driving) and returlast (orange boxes on the way back).
 * Digits and code signs only; no letters, no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waBob, waGrow, waIn, waPulse, waSpin, waSway, type Svg } from './kit';
import { HL, padlock } from './people';
import { figure } from './figures';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const CAR = '#3a6ab0';
const BUS = '#2f9a9a';
const LORRY = '#e4a43c';
const GLASS = '#bfe3f5';
const TYRE = '#2b2b30';
const RIM = '#c8ced4';
const ROAD = '#8a8f98';
const H2 = '#9fd3f2';
const O2 = '#e86a5a';
const WATER = '#5aa9e6';
const SMOKE = '#6b6f78';
const RED = '#e8302c';
const GREEN = '#3fa45b';
const GRASS = '#9fcf8a';
const NIGHT = '#1f2a44';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const bg = (col: string = '#eef3f6') => rect(0, 0, 120, 120, col, 0, null);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 5, col, 2.6);
const cross = (x: number, y: number, s = 6, col: string = RED) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 3);
const tick = (x: number, y: number, s = 1, col: string = GREEN) => line(`M${x - 4 * s} ${y} L${x - 1 * s} ${y + 3 * s} L${x + 5 * s} ${y - 4 * s}`, col, 2.8);
const bolt = (x: number, y: number, s = 1, col: string = C.yellow) => g(`translate(${x} ${y}) scale(${s})`, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', col, C.ink, 1.4));
const puff = (x: number, y: number, s = 1, col: string = SMOKE) => g(`translate(${x} ${y}) scale(${s})`, path('M-8 0 C-14 0 -14 -8 -8 -8 C-8 -14 0 -16 3 -11 C8 -15 15 -11 12 -5 C17 -4 16 3 10 3 Z', col, C.ink, 1.1));
const drop = (x: number, y: number, s = 1, col: string = WATER) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -7 C4 -2 5 1 5 3 C5 6 3 8 0 8 C-3 8 -5 6 -5 3 C-5 1 -4 -2 0 -7 Z', col, C.ink, 1.1));
const leaf = (x: number, y: number, s = 1, col: string = GREEN) => g(`translate(${x} ${y}) scale(${s})`, path('M-8 6 C-8 -6 2 -10 10 -10 C10 0 4 8 -8 6 Z', col, C.ink, 1.2), line('M-8 6 L4 -4', '#2b6b3b', 1.2));
/** n short arcs opening to the right (dir 1) or left (dir -1). */
const sound = (x: number, y: number, n = 3, dir = 1, col: string = C.ink, sw = 2) => all(...range(n).map((i) => {
  const r = 5 + i * 5, h = r * 0.8;
  return line(`M${f1(x + dir * r * 0.5)} ${f1(y - h)} Q${f1(x + dir * r)} ${y} ${f1(x + dir * r * 0.5)} ${f1(y + h)}`, col, sw);
}));
const clock = (x: number, y: number, r = 10, deg = 60) => all(circle(x, y, r, C.white, C.ink, 1.6), ...range(12).map((i) => { const a = (i * Math.PI) / 6; return line(`M${f1(x + Math.cos(a) * r * 0.78)} ${f1(y + Math.sin(a) * r * 0.78)} L${f1(x + Math.cos(a) * r * 0.9)} ${f1(y + Math.sin(a) * r * 0.9)}`, C.ink, 0.9); }),
  line(`M${x} ${y} L${x} ${y - r * 0.55}`, C.ink, 1.6), g(`translate(${x} ${y}) rotate(${deg})`, line(`M0 0 L0 ${-r * 0.8}`, RED, 1.4)), circle(x, y, 1.3, C.ink, null));
const coin = (x: number, y: number, r = 5) => all(circle(x, y, r, C.gold, C.ink, 1.2), circle(x, y, r * 0.55, 'none', '#b88a20', 1));
const road = (y: number, col: string = ROAD) => all(rect(0, y, 120, 120 - y, col, 0, null), line(`M4 ${y + (120 - y) / 2} L116 ${y + (120 - y) / 2}`, C.white, 2, '8 7'));
const tree = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-2, -10, 4, 10, '#8a5a32', 1, C.ink, 1), circle(0, -18, 10, GREEN, C.ink, 1.3));
const house = (x: number, y: number, s = 1, col: string = '#e8d6b8') => g(`translate(${x} ${y}) scale(${s})`, rect(-16, -22, 32, 22, col, 1, C.ink, 1.6), path('M-20 -22 L0 -38 L20 -22 Z', '#c4543a', C.ink, 1.6), rect(-5, -13, 10, 13, '#8a5a32', 1, C.ink, 1.2), rect(7, -18, 7, 7, GLASS, 1, C.ink, 1));
/** Hydrogen (two light-blue balls) or oxygen (two red balls). */
const mol = (x: number, y: number, s = 1, col: string = H2) => g(`translate(${x} ${y}) scale(${s})`, line('M-4 0 L4 0', C.ink, 2), circle(-4.5, 0, 4.2, col, C.ink, 1.2), circle(4.5, 0, 4.2, col, C.ink, 1.2));
/** A package with tape. */
const parcel = (x: number, y: number, w = 14, h = 11, col: string = '#d4a373') => all(rect(x - w / 2, y - h / 2, w, h, col, 1, C.ink, 1.4), line(`M${x} ${y - h / 2} L${x} ${y + h / 2}`, '#a0673d', 2));
/** Small seated head and shoulders. */
const bust = (x: number, y: number, s = 1, top: string = C.sky, o: { hair?: string; eyes?: 'open' | 'sleepy' } = {}) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-10 14 C-10 4 10 4 10 14 Z', top, C.ink, 1.3), circle(0, -2, 7, C.skin, C.ink, 1.3), path('M-7 -3 C-7 -11 7 -11 7 -3 C4 -7 -4 -7 -7 -3 Z', o.hair ?? C.hair, C.ink, 1),
  o.eyes === 'sleepy' ? line('M-4.2 -1 L-1.4 -0.6 M1.4 -0.6 L4.2 -1', C.ink, 1.1) : all(circle(-2.6, -1.4, 0.9, C.ink, null), circle(2.6, -1.4, 0.9, C.ink, null)));

// ── Vehicles ─────────────────────────────────────────────────────────
const tyre = (x: number, y: number, r: number) => all(circle(x, y, r, TYRE, C.ink, 1.6), circle(x, y, r * 0.5, RIM, C.ink, 1), circle(x, y, r * 0.15, '#5a5d68', null));
/** Car from the side, front to the right; wheels touch y + 5. */
const carSide = (x: number, y: number, s = 1, o: { col?: string; win?: string; roof?: Svg; seat?: Svg } = {}) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-46 -6 L-46 -20 L-40 -22 L-26 -38 L14 -38 L28 -22 L46 -18 L48 -6 Z', o.col ?? CAR, C.ink, 1.8), path('M-22 -34 L-4 -34 L-4 -22 L-34 -22 Z', o.win ?? GLASS, C.ink, 1), path('M0 -34 L12 -34 L22 -22 L0 -22 Z', o.win ?? GLASS, C.ink, 1),
  o.seat ?? '', rect(40, -16, 7, 5, '#f6f2d8', 1.4, C.ink, 0.8), rect(-47, -17, 5, 5, '#c43a32', 1, C.ink, 0.6), tyre(-28, -4, 9), tyre(30, -4, 9), o.roof ?? '');
/** Car from above, front up, centre (x, y). */
const carTop = (x: number, y: number, s = 1, o: { col?: string; rot?: number } = {}) => g(`translate(${x} ${y}) rotate(${o.rot ?? 0}) scale(${s})`,
  ...[[-17, -17], [17, -17], [-17, 19], [17, 19]].map(([cx, cy]) => rect(cx! - 3.5, cy! - 7, 7, 14, TYRE, 2, C.ink, 1)),
  rect(-15, -32, 30, 64, o.col ?? CAR, 8, C.ink, 1.6), rect(-11, -16, 22, 11, GLASS, 2, C.ink, 0.8), rect(-11, 14, 22, 8, GLASS, 2, C.ink, 0.8));
/** Bus from the side, front to the right; wheels touch y. */
const busSide = (x: number, y: number, s = 1, o: { col?: string; roof?: Svg; side?: Svg; driver?: boolean } = {}) => g(`translate(${x} ${y}) scale(${s})`,
  rect(-48, -44, 96, 36, o.col ?? BUS, 6, C.ink, 1.8), ...range(5).map((i) => rect(-42 + i * 15, -39, 12, 13, GLASS, 1.5, C.ink, 0.9)), rect(33, -40, 12, 18, GLASS, 1.5, C.ink, 1),
  o.driver ? bust(38, -29, 0.55, C.navy) : '', rect(-14, -24, 10, 16, '#e0f0f4', 1, C.ink, 0.9), rect(42, -16, 5, 4, '#f6f2d8', 1, C.ink, 0.6), rect(-50, -14, 3, 3, SMOKE, 0.5, C.ink, 0.6),
  tyre(-28, -7, 7), tyre(30, -7, 7), o.side ?? '', o.roof ?? '');
/** Lorry from the side, cab to the right; fill = share of the box that holds boxes (null = closed box). */
const lorry = (x: number, y: number, s = 1, o: { fill?: number | null; box?: string; col?: string; empty?: boolean } = {}) => {
  const fill = o.fill ?? null;
  const inside = fill === null ? '' : all(rect(-44, -44, 64, 36, '#f4f1ea', 1, C.ink, 1.2),
    ...range(Math.round(fill * 8)).map((i) => { const cx = -36 + (i % 4) * 16, cy = i < 4 ? -16 : -32; return parcel(cx, cy, 14, 14, o.box ?? '#d4a373'); }),
    o.empty ? line('M-40 -40 L16 -12 M16 -40 L-40 -12', '#c9ced4', 1.2, '3 3') : '');
  return g(`translate(${x} ${y}) scale(${s})`, fill === null ? rect(-46, -46, 68, 40, C.white, 2, C.ink, 1.8) : rect(-46, -46, 68, 40, C.white, 2, C.ink, 1.8), inside,
    path('M24 -6 L24 -34 L38 -34 L48 -20 L48 -6 Z', o.col ?? LORRY, C.ink, 1.8), path('M28 -30 L37 -30 L44 -20 L28 -20 Z', GLASS, C.ink, 1), rect(-48, -8, 98, 4, '#5a5d68', 1, C.ink, 1),
    tyre(-32, -2, 7), tyre(-16, -2, 7), tyre(36, -2, 7));
};
/** Drone seen slightly from the side: body, four arms, rotors. */
const drone = (x: number, y: number, s = 1, col: string = '#5a5d68', spin = '') => g(`translate(${x} ${y}) scale(${s})`,
  line('M-20 -4 L-8 0 M20 -4 L8 0', C.ink, 2.4), line('M-14 -1 L-4 2 M14 -1 L4 2', C.ink, 1.6),
  ...[-20, 20].map((rx) => spin ? waSpin(`${spin}${rx < 0 ? 'l' : 'r'}`, 0.4, ellipse(rx, -6, 9, 2.2, 'rgba(160,170,180,0.8)', C.ink, 0.9)) : ellipse(rx, -6, 9, 2.2, '#c9ced4', C.ink, 0.9)),
  rect(-9, -3, 18, 8, col, 3, C.ink, 1.4), circle(0, 7, 2.4, C.dark, C.ink, 0.8), line('M-7 5 L-9 10 M7 5 L9 10', C.ink, 1.4));
/** Phone held upright with an arbitrary screen drawn in a 22×36 box centred on (0,0). */
const phoneWith = (x: number, y: number, s: number, screen: Svg) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -24, 28, 48, C.dark, 4, C.ink, 1.6), rect(-11, -19, 22, 36, '#eaf5fb', 1.5, null), screen, circle(0, 20.5, 1.6, '#8d949b', null));
const windTurbine = (x: number, y: number, s: number, name: string) => g(`translate(${x} ${y}) scale(${s})`, path('M-2 0 L-1 -44 L1 -44 L2 0 Z', C.white, C.ink, 1.2),
  g('translate(0 -44)', waSpin(name, 3, ...[0, 120, 240].map((d) => g(`rotate(${d})`, path('M-1.6 0 C-3 -8 -2 -20 0 -24 C2 -20 3 -8 1.6 0 Z', C.white, C.ink, 1.1))), circle(0, 0, 2.6, '#c9ced4', C.ink, 1))));
const scooter = (x: number, y: number, s = 1, col: string = GREEN, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, line('M-14 -2 L12 -2 L16 -30', col, 3.2), line('M10 -30 L22 -30', C.ink, 2.4), circle(-14, 0, 4.5, TYRE, C.ink, 1.2), circle(14, 0, 4.5, TYRE, C.ink, 1.2));
const bike = (x: number, y: number, s = 1, col: string = RED) => g(`translate(${x} ${y}) scale(${s})`, circle(-13, 0, 8, 'none', C.ink, 2), circle(13, 0, 8, 'none', C.ink, 2), line('M-13 0 L-4 -14 L9 -14 L13 0 M-4 -14 L0 0 L9 -14 M-6 -18 L-1 -18 M9 -14 L8 -20 L13 -21', col, 2.4));
const container = (x: number, y: number, w: number, h: number, col: string = '#3a8acb') => all(rect(x, y, w, h, col, 1, C.ink, 1.6), ...range(Math.floor(w / 6) - 1).map((i) => line(`M${x + 6 + i * 6} ${y + 3} L${x + 6 + i * 6} ${y + h - 3}`, 'rgba(0,0,0,0.25)', 1.2)));

export const FUTTR_MOTIFS: Record<string, Svg> = {
  // ── 4261 Självkörande fordon ──
  // fordon: four very different vehicles in a row, all framed together (the umbrella word)
  'futtr.fordon': all(bg(), rect(0, 100, 120, 20, ROAD, 0, null), carSide(30, 72, 0.5, { col: CAR }), lorry(88, 79, 0.48, {}), busSide(32, 111, 0.5, {}),
    g('translate(88 111) scale(0.5)', rect(-44, -40, 88, 30, '#e2e6ea', 8, C.ink, 1.8), ...range(4).map((i) => rect(-36 + i * 18, -34, 12, 12, GLASS, 1.5, C.ink, 0.9)), line('M-44 -18 L44 -18', RED, 3), circle(-26, -7, 5, TYRE, C.ink, 1.2), circle(26, -7, 5, TYRE, C.ink, 1.2), line('M-52 -2 L52 -2', C.ink, 2.2)),
    frame(4, 40, 112, 76)),
  // lidar: the spinning top on the roof paints a cloud of dots on a pedestrian
  'futtr.lidar': all(bg(), road(100), carSide(36, 95, 0.62, { roof: g('translate(-2 -42)', rect(-7, -2, 14, 6, '#5a5d68', 2, C.ink, 1.2), waSpin('futtrlid', 1.2, rect(-6, -11, 12, 9, HL, 3, C.ink, 1.4), line('M-6 -6.5 L6 -6.5', C.ink, 1))) }),
    waPulse('futtrlidb', line('M36 66 L92 50 M36 66 L94 72 M36 66 L92 92', '#e4572e', 1, '2 3')),
    ...[[96, 48], [93, 52], [99, 52], [96, 56], [92, 60], [100, 60], [94, 66], [98, 66], [95, 72], [97, 78], [93, 84], [99, 84], [92, 92], [100, 92], [96, 98], [90, 70], [102, 70]].map(([px, py]) => circle(px!, py!, 1.6, HL, null))),
  // automationsnivå: steps 0–5; the car stands on step 4, the hand leaves the wheel as the steps rise
  'futtr.automationsnivå': all(bg(), ...range(6).map((i) => rect(6 + i * 18, 100 - i * 12, 18, 12 + i * 12, i === 4 ? '#ffd9c7' : '#dfe5ea', 1, C.ink, 1.3)),
    ...range(6).map((i) => `<text x="${15 + i * 18}" y="${110 - i * 0}" font-family="system-ui,sans-serif" font-weight="800" font-size="9" text-anchor="middle" fill="${C.ink}">${i}</text>`),
    carSide(87, 46, 0.28), ring(87, 40, 14),
    g('translate(16 80)', circle(0, 0, 8, 'none', C.ink, 2.4), line('M-8 0 L8 0 M0 0 L0 8', C.ink, 2), path('M-6 -8 C-2 -12 4 -12 6 -8 L4 -4 L-4 -4 Z', C.skin, C.ink, 1)),
    g('translate(106 16)', circle(0, 0, 8, 'none', C.grey, 2.4), line('M-8 0 L8 0 M0 0 L0 8', C.grey, 2)), cross(106, 16, 5, C.grey)),
  // säkerhetsförare: a person at the front of a small self-driving bus, hand over the stop button, eyes on the road
  'futtr.säkerhetsförare': all(bg(), road(104), g('translate(54 104)', rect(-46, -66, 92, 60, BUS, 10, C.ink, 1.8), rect(14, -60, 28, 30, GLASS, 3, C.ink, 1.2), rect(-40, -60, 48, 22, GLASS, 3, C.ink, 1),
    rect(-6, -76, 16, 10, '#5a5d68', 3, C.ink, 1.2), bust(28, -42, 1, C.orange), circle(40, -32, 3.4, RED, C.ink, 1.2), line('M33 -36 L39 -33', C.skin, 3), tyre(-28, -6, 8), tyre(28, -6, 8)),
    ring(82, 64, 17), line('M94 58 L114 54', HL, 1.4, '3 3')),
  // robottaxi: a taxi with a sign but nobody behind the wheel; the person on the kerb has called it with the phone
  'futtr.robottaxi': all(bg(), road(100), carSide(48, 95, 0.72, { col: '#f2c14e', roof: all(rect(-8, -46, 16, 8, C.white, 2, C.ink, 1.2), ...range(4).map((i) => rect(-8 + i * 4, -42, 4, 4, i % 2 ? C.ink : C.white, 0, null)), circle(14, -42, 3.5, '#5a5d68', C.ink, 1)),
    seat: all(line('M2 -32 C2 -26 6 -24 8 -24', C.grey, 1.4, '2 2'), circle(8, -29, 4, 'none', C.grey, 1.2)) }),
    g('translate(104 0)', figure({ x: 0, h: 0.62, top: C.purple, hairStyle: 'long' })), phoneWith(92, 60, 0.34, all(circle(0, -2, 5, HL, null), path('M0 6 L-4 0 L4 0 Z', HL, null))), line('M88 52 C80 40 70 40 62 52', HL, 1.4, '3 3')),
  // fjärrövervaka: a person in a control room watches three buses on screens; signals come in from the bus outside
  'futtr.fjärrövervaka': all(bg('#e9eef2'), rect(0, 92, 120, 28, '#c9b79a', 0, null), rect(4, 86, 76, 6, '#8a5a32', 1, C.ink, 1.4),
    ...[0, 1, 2].map((i) => all(rect(6 + i * 25, 52, 22, 18, NIGHT, 2, C.ink, 1.4), busSide(17 + i * 25, 66, 0.16, {}))), line('M16 70 L16 86 M41 70 L41 86 M66 70 L66 86', C.ink, 1.4),
    g('translate(40 112) scale(0.8)', path('M-16 0 L-16 -28 C-16 -38 16 -38 16 -28 L16 0 Z', C.orange, C.ink, 1.6), circle(0, -46, 9, C.skin, C.ink, 1.4), path('M-9 -48 C-9 -58 9 -58 9 -48 C5 -52 -5 -52 -9 -48 Z', C.hair, C.ink, 1)),
    rect(84, 26, 32, 50, '#cfe8f3', 2, C.ink, 1.4), busSide(100, 66, 0.28, {}), waPulse('futtrfjo', sound(84, 44, 3, -1, HL, 1.8)), ring(41, 61, 20)),
  // ansvarsfråga: two cars that have hit each other, a big question mark, and arrows to maker, owner and software
  'futtr.ansvarsfråga': all(bg(), g('translate(60 92)', carTop(-14, 0, 0.5, { rot: 70 }), carTop(16, 2, 0.5, { col: '#c9ced4', rot: -20 }), path('M0 -10 L4 -2 L12 -4 L6 2 L10 10 L2 6 L-4 12 L-4 4 L-12 2 L-4 -2 Z', C.yellow, C.ink, 1)),
    `<text x="60" y="56" font-family="system-ui,sans-serif" font-weight="900" font-size="40" text-anchor="middle" fill="${HL}">?</text>`,
    g('translate(18 26)', rect(-12, -6, 24, 16, '#c9ced4', 1, C.ink, 1.2), path('M-12 -6 L-12 -14 L-4 -10 L-4 -14 L4 -10 L4 -14 L12 -10 L12 -6 Z', '#9aa3ad', C.ink, 1.2)),
    g('translate(60 12)', circle(0, 0, 5, C.skin, C.ink, 1.2), path('M-8 12 C-8 4 8 4 8 12 Z', C.sky, C.ink, 1.2), line('M10 4 L18 4 M14 4 L14 8 M17 4 L17 7', '#e0b23c', 2)),
    g('translate(102 26)', rect(-12, -10, 24, 18, NIGHT, 2, C.ink, 1.2), `<text x="0" y="3" font-family="ui-monospace,monospace" font-weight="800" font-size="10" text-anchor="middle" fill="#7fe0a0">{ }</text>`),
    line('M30 32 L44 44 M60 26 L60 30 M90 32 L76 44', C.ink, 1.4, '3 3')),
  // reagera (göra något direkt): a pedestrian steps out, the bus stops at once
  'futtr.reagera.3': all(bg(), road(100), rect(0, 96, 120, 4, '#c9ced4', 0, null), g('translate(96 0)', figure({ x: 0, h: 0.5, top: C.green })),
    waIn('futtrrea', -26, 0, busSide(44, 110, 0.6, { driver: true })), line('M2 106 L14 106 M4 112 L18 112', '#2e2e36', 2.4), path('M82 44 L90 30 L98 44 Z', C.yellow, C.ink, 1.4), line('M90 34 L90 39', C.ink, 2), circle(90, 41.5, 1, C.ink, null)),

  // ── 4262 Förarstödssystem ──
  // förarstödssystem: a car from above with its helpers around it: camera, radar arcs, a steering wheel and a shield
  'futtr.förarstödssystem': all(bg(), carTop(60, 62, 0.9), waPulse('futtrfss', line('M44 28 Q60 18 76 28 M40 22 Q60 8 80 22', HL, 2), line('M44 96 Q60 106 76 96', HL, 2)),
    g('translate(18 30)', rect(-9, -6, 14, 12, '#5a5d68', 2, C.ink, 1.2), path('M5 -4 L11 -7 L11 7 L5 4 Z', '#5a5d68', C.ink, 1.2)), g('translate(102 30)', circle(0, 0, 9, 'none', C.ink, 2.4), line('M-9 0 L9 0 M0 0 L0 9', C.ink, 2)),
    g('translate(18 92)', path('M0 -11 L10 -7 C10 3 6 9 0 12 C-6 9 -10 3 -10 -7 Z', GREEN, C.ink, 1.4), tick(0, 0, 0.9, C.white)), g('translate(102 92)', path('M-8 6 L0 -8 L8 6 Z', C.yellow, C.ink, 1.3), line('M0 -3 L0 1', C.ink, 1.6)),
    line('M28 32 L44 44 M92 32 L76 44 M28 88 L44 78 M92 88 L76 78', C.grey, 1.2, '3 3')),
  // adaptiv farthållare: own car keeps the same gap (orange bracket) to the car in front; a speedometer
  'futtr.adaptiv-farthållare': all(bg(), road(96), waIn('futtradf', -6, 0, carSide(28, 92, 0.42), carSide(96, 92, 0.42, { col: '#c9ced4' }), line('M50 66 L76 66', HL, 2.6), line('M50 60 L50 72 M76 60 L76 72', HL, 2.6)),
    g('translate(28 26)', path('M-16 6 A16 16 0 1 1 16 6', 'none', C.ink, 2.4), line('M0 0 L9 -9', RED, 2.4), circle(0, 0, 2.4, C.ink, null)), arrow(48, 34, 70, 34, CAR, 2.6)),
  // filhållningsassistent: a car drifting to the line is steered back into the middle of the lane
  'futtr.filhållningsassistent': all(bg(), rect(20, 0, 80, 120, ROAD, 0, null), line('M24 0 L24 120 M96 0 L96 120', C.white, 3), line('M60 0 L60 120', C.white, 2, '10 8'),
    waSway('futtrfil', 8, carTop(42, 66, 0.62, { rot: -12 })), line('M26 96 C30 80 38 74 42 64', C.grey, 1.8, '3 3'), arrow(32, 40, 44, 22, HL, 3),
    rect(22, 66, 6, 24, '#ffd9c7', 1, null), line('M24 66 L24 90', HL, 3), g('translate(42 50)', rect(-3, -2, 6, 4, '#5a5d68', 1, C.ink, 0.8))),
  // kollisionsvarning: from the driver's seat the car in front is far too close; a red triangle flashes and it beeps
  'futtr.kollisionsvarning': all(bg('#cfe3ee'), road(70), carSide(60, 92, 0.95, { col: '#c9ced4' }), path('M0 0 L120 0 L120 30 C90 24 30 24 0 30 Z', '#3d3f4a', null), path('M0 120 L0 92 C30 86 90 86 120 92 L120 120 Z', '#3d3f4a', C.ink, 1.4),
    waPulse('futtrkol', path('M60 30 L76 58 L44 58 Z', RED, C.ink, 1.6), line('M60 40 L60 49', C.white, 3), circle(60, 53, 1.8, C.white, null)), sound(80, 44, 2, 1, RED), sound(40, 44, 2, -1, RED)),
  // död vinkel: from above, the mirror view cones (yellow) do not reach the shaded wedge where a car is hiding
  'futtr.död-vinkel': all(bg(), rect(0, 0, 120, 120, ROAD, 0, null), line('M60 0 L60 120', C.white, 2, '10 8'),
    path('M74 46 L120 10 L120 40 Z', 'rgba(255,224,138,0.75)', null), path('M74 46 L116 120 L120 120 L120 80 Z', 'rgba(255,224,138,0.75)', null),
    path('M76 52 L120 46 L120 82 L92 100 Z', '#ffd9c7', HL, 1.8), carTop(84, 52, 0.62, { rot: 0 }), carTop(102, 82, 0.5, { col: '#c9ced4' }), circle(74, 46, 2.4, '#f2c14e', C.ink, 1)),
  // backkamera: the car's rear camera and the screen with coloured guide lines and a bike behind
  'futtr.backkamera': all(bg(), rect(0, 104, 120, 16, ROAD, 0, null), carSide(80, 100, 0.62), g('translate(52 74)', rect(-3, -3, 6, 5, '#5a5d68', 1, C.ink, 1), ring(0, 0, 6)),
    line('M50 74 L10 98 M50 74 L18 112', HL, 1.2, '2 3'), bike(18, 100, 0.55),
    rect(4, 6, 60, 44, NIGHT, 4, C.ink, 1.6), line('M14 48 L24 22 M54 48 L44 22', GREEN, 2), line('M18 38 L50 38', C.yellow, 2), line('M21 30 L47 30', RED, 2), g('translate(34 34) scale(0.6)', bike(0, 0, 0.6))),
  // parkeringssensor: round sensors in the rear bumper send arcs to a post; the closer, the more arcs
  'futtr.parkeringssensor': all(bg(), rect(0, 104, 120, 16, ROAD, 0, null), carSide(78, 100, 0.7), circle(46, 88, 2.4, HL, C.ink, 1), ring(46, 88, 6),
    waPulse('futtrpar', sound(40, 88, 3, -1, HL, 2)), rect(4, 58, 9, 50, C.yellow, 2, C.ink, 1.6), line('M4 70 L13 66 M4 84 L13 80 M4 98 L13 94', C.ink, 3)),
  // pipa: a smoke alarm on the ceiling makes short, high beeps
  'futtr.pipa': all(bg(), rect(0, 0, 120, 14, '#e2e6ea', 0, null), line('M0 14 L120 14', C.ink, 1.6), g('translate(60 22)', ellipse(0, 0, 22, 8, C.white, C.ink, 1.8), circle(0, 0, 4, RED, C.ink, 1)),
    waPulse('futtrpip', line('M30 44 L22 52 M40 46 L36 58 M60 48 L60 62 M80 46 L84 58 M90 44 L98 52', HL, 3)), g('translate(60 0)', figure({ x: 0, h: 0.52, top: C.sky })),
    line('M52 70 L48 66 M68 70 L72 66', C.skin, 3)),
  // trötthetsvarnare: a sleepy driver; the screen shows a coffee cup
  'futtr.trötthetsvarnare': all(bg('#cfe3ee'), path('M0 0 L120 0 L120 34 C90 28 30 28 0 34 Z', '#3d3f4a', null), road(60), bust(36, 86, 2.2, C.sky, { eyes: 'sleepy' }), path('M0 120 L0 104 L120 104 L120 120 Z', '#3d3f4a', null),
    rect(70, 64, 44, 32, NIGHT, 3, C.ink, 1.6), waPulse('futtrtrt', g('translate(92 82)', path('M-8 -8 L8 -8 L7 6 C7 9 -7 9 -7 6 Z', HL, C.ink, 1.4), path('M8 -5 C13 -5 13 2 7 2', 'none', HL, 2), line('M-3 -12 C-5 -15 -1 -17 -3 -20 M3 -12 C1 -15 5 -17 3 -20', C.white, 1.4)))),
  // alkolås: the driver blows into a small device on a cable; a green tick lets the car start, a bottle is crossed out
  'futtr.alkolås': all(bg(), g('translate(30 60)', circle(0, 0, 16, C.skin, C.ink, 1.6), path('M-16 -2 C-16 -22 16 -22 16 -2 C10 -10 -10 -10 -16 -2 Z', C.hair, C.ink, 1.2), circle(6, -2, 1.4, C.ink, null), ellipse(15, 6, 2.6, 2, '#c84a4a', C.ink, 0.8)),
    g('translate(60 66) rotate(-8)', rect(0, -8, 30, 18, '#5a5d68', 4, C.ink, 1.6), rect(-14, -2, 16, 5, C.white, 2, C.ink, 1.2), rect(6, -4, 16, 8, '#7fe0a0', 1, C.ink, 0.8)), line('M88 70 C100 80 96 100 108 104', C.ink, 2),
    ring(76, 64, 20), tick(100, 30, 1.6), g('translate(18 98)', path('M-4 -14 L4 -14 L4 -8 C8 -6 8 -2 8 2 L8 12 L-8 12 L-8 2 C-8 -2 -8 -6 -4 -8 Z', '#8a5a32', C.ink, 1.2), cross(0, 0, 10))),

  // ── 4263 Elektrifiering av kollektivtrafik ──
  // elektrifiera: a grey diesel bus with smoke becomes a teal bus with a bolt
  'futtr.elektrifiera': all(bg(), rect(0, 104, 120, 16, ROAD, 0, null), g('translate(4 0)', greyed(busSide(24, 64, 0.42, {})), puff(4, 54, 0.6)), arrow(48, 52, 66, 52, HL, 3),
    busSide(88, 104, 0.58, { side: bolt(-2, -24, 1.1) }), waGrow('futtrelf', bolt(100, 22, 1.4))),
  // dieselbuss: a bus with a black diesel nozzle and black smoke from the exhaust
  'futtr.dieselbuss': all(bg(), road(100), busSide(64, 102, 0.8, {}), puff(16, 84, 1, '#3d3f4a'), puff(8, 72, 0.7, '#3d3f4a'),
    g('translate(100 26)', rect(-7, -12, 14, 24, '#2b2b30', 3, C.ink, 1.4), path('M-7 -7 L-20 -11 L-20 -6 L-9 -2', '#5a5d68', C.ink, 1.2)), drop(84, 22, 1, '#e0b23c')),
  // eldriven: a big plug and bolt drive the bus; the grey bus beside it needs a fuel nozzle (crossed out)
  'futtr.eldriven': all(bg(), rect(0, 104, 120, 16, ROAD, 0, null), busSide(62, 104, 0.6, { side: bolt(0, -24, 1.2) }), line('M30 92 C20 92 16 70 22 54', C.ink, 2.6),
    g('translate(22 46)', rect(-8, -8, 16, 14, HL, 3, C.ink, 1.4), line('M-4 -8 L-4 -14 M4 -8 L4 -14', C.ink, 2.4)), bolt(22, 22, 1.4),
    greyed(g('translate(100 24)', rect(-7, -12, 14, 24, '#2b2b30', 3, C.ink, 1.4), path('M-7 -7 L-20 -11 L-20 -6 L-9 -2', '#5a5d68', C.ink, 1.2))), cross(96, 24, 10)),
  // utsläppsfri: nothing comes out of the bus (crossed-out cloud, a leaf); the small grey bus smokes
  'futtr.utsläppsfri': all(bg(), rect(0, 104, 120, 16, ROAD, 0, null), busSide(70, 104, 0.6, {}), greyed(puff(26, 82, 1.2)), cross(26, 80, 13), leaf(30, 54, 1.4),
    greyed(g('translate(0 0)', busSide(84, 36, 0.3, {}), puff(64, 26, 0.6))), ring(26, 80, 18)),
  // tystgående: the bus makes no sound and a bird can be heard; the grey bus is loud
  'futtr.tystgående': all(bg(), rect(0, 104, 120, 16, ROAD, 0, null), busSide(56, 104, 0.6, {}), g('translate(102 80)', path('M-8 0 C-8 -8 4 -10 8 -4 L14 -6 L10 0 C8 6 -4 6 -8 0 Z', C.yellow, C.ink, 1.2), circle(4, -5, 1, C.ink, null)),
    line('M106 66 L106 56 L112 54 L112 62', C.ink, 1.4), circle(104, 66, 2, C.ink, null), circle(110, 62, 2, C.ink, null), ring(56, 82, 30),
    greyed(busSide(26, 38, 0.3, {}), sound(42, 26, 3, 1, C.ink, 2.4))),
  // depåladdning: buses stand plugged in in the depot at night; the batteries fill up
  'futtr.depåladdning': all(bg(NIGHT), circle(100, 16, 7, '#f6f2d8', null), circle(96, 14, 6, NIGHT, null), rect(0, 34, 120, 86, '#3d3f4a', 0, null), path('M0 34 L60 18 L120 34 Z', '#5a5d68', C.ink, 1.4),
    ...[0, 1].map((i) => all(busSide(46, 70 + i * 40, 0.5, {}), rect(98, 44 + i * 40, 10, 22, '#c9ced4', 2, C.ink, 1.2), line(`M98 ${52 + i * 40} C86 ${52 + i * 40} 84 ${58 + i * 40} 72 ${58 + i * 40}`, C.ink, 1.8),
      rect(6, 40 + i * 40, 18, 9, C.white, 1.5, C.ink, 1), waGrow(`futtrdep${i}`, rect(7.5, 41.5 + i * 40, 13, 6, GREEN, 1, null)))), bolt(103, 40, 0.7)),
  // trådbuss: two poles on the roof reach two wires above the street
  'futtr.trådbuss': all(bg(), road(100), line('M0 42 L120 42 M0 47 L120 47', C.ink, 1.6), line('M10 0 L10 42 M110 0 L110 42 M10 12 L110 12', '#5a5d68', 2),
    busSide(60, 102, 0.8, { roof: all(line('M-14 -44 L16 -75', HL, 2.4), line('M-6 -44 L24 -69', HL, 2.4)) }), ring(76, 44, 9)),
  // elfärja: a ferry with a bolt lies at the quay; a charging arm reaches it, no smoke
  'futtr.elfärja': all(bg('#dff0f8'), rect(0, 82, 120, 38, '#5aa9e6', 0, null), rect(0, 70, 26, 50, '#9aa3ad', 0, C.ink, 1.6), rect(14, 36, 8, 34, '#c9ced4', 1, C.ink, 1.4), line('M18 40 C30 40 36 46 38 56', C.ink, 2.6),
    waBob('futtrfrj', 1.5, g('translate(74 84)', path('M-44 -10 L44 -10 L36 8 L-38 8 Z', C.white, C.ink, 1.8), rect(-30, -26, 52, 16, '#e2e6ea', 2, C.ink, 1.4), ...range(5).map((i) => rect(-26 + i * 10, -22, 6, 6, GLASS, 1, C.ink, 0.8)), rect(-20, -36, 24, 10, '#f2f4f6', 2, C.ink, 1.2), bolt(28, -2, 0.8))),
    line('M4 100 C14 96 24 104 34 100 M60 106 C70 102 80 110 90 106', C.white, 1.4)),

  // ── 4264 Vätgasfordon ──
  // bränslecell: hydrogen and oxygen go into the layered cell; electricity and water come out
  'futtr.bränslecell': all(bg(), g('translate(60 60)', rect(-20, -26, 40, 52, '#dfe5ea', 3, C.ink, 1.8), ...range(6).map((i) => rect(-16, -22 + i * 8, 32, 5, i % 2 ? '#b8c0c8' : '#8d949b', 1, C.ink, 0.6))), frame(36, 30, 48, 60),
    waIn('futtrbci', 12, 0, mol(16, 46), mol(16, 66)), arrow(26, 56, 38, 56, H2, 2.6), waIn('futtrbco', 0, 12, mol(60, 12, 1, O2)), arrow(60, 20, 60, 30, O2, 2.6),
    arrow(84, 50, 96, 50, C.yellow, 2.6), bolt(106, 50, 1), arrow(66, 92, 66, 100, WATER, 2.6), drop(66, 110, 1.1)),
  // vätgasbil: a car with the hydrogen sign and a tank under the floor; a water drop comes out at the back
  'futtr.vätgasbil': all(bg(), road(100), carSide(60, 92, 0.95, { seat: all(rect(-36, -12, 44, 8, H2, 3, C.ink, 1.2)) }), g('translate(60 52)', circle(0, 0, 10, C.white, C.ink, 1.4), mol(0, 0, 0.9)), drop(10, 92, 1),
    ring(60, 52, 13)),
  // vätgastank: a strong capsule-shaped tank, hydrogen inside, the gauge in the red
  'futtr.vätgastank': all(bg(), g('translate(54 70)', rect(-40, -20, 80, 40, '#dfe5ea', 20, C.ink, 2), line('M-20 -20 L-20 20 M20 -20 L20 20', '#b8c0c8', 1.4), mol(-6, -4, 1.1), mol(12, 6, 1.1), mol(-24, 6, 1)), rect(94, 66, 10, 8, '#5a5d68', 1, C.ink, 1.2),
    g('translate(100 38)', circle(0, 0, 12, C.white, C.ink, 1.6), path('M-9 6 A11 11 0 0 1 9 -6', 'none', RED, 3), line('M0 0 L8 -6', C.ink, 2), circle(0, 0, 1.6, C.ink, null)), line('M100 50 L100 66', C.ink, 2)),
  // vätgasstation: a pump with the hydrogen sign and a blue nozzle in a car
  'futtr.vätgasstation': all(bg(), rect(0, 104, 120, 16, '#c9ced4', 0, null), rect(10, 14, 100, 10, C.white, 2, C.ink, 1.6), line('M20 24 L20 104', '#8d949b', 3),
    g('translate(36 104)', rect(-12, -50, 24, 50, C.white, 3, C.ink, 1.6), circle(0, -36, 8, H2, C.ink, 1.2), mol(0, -36, 0.7, C.white), rect(-7, -22, 14, 8, NIGHT, 1, C.ink, 1)),
    line('M48 64 C56 64 60 74 66 78', C.ink, 2.4), rect(64, 74, 8, 6, '#3a8acb', 2, C.ink, 1.2), carSide(84, 99, 0.55)),
  // elektrolys: two wires from a battery go into a glass of water; bubbles rise from both wires
  'futtr.elektrolys': all(bg(), g('translate(60 82)', path('M-30 -30 L-30 26 C-30 30 30 30 30 26 L30 -30', '#d9eef9', C.ink, 2), rect(-29, -16, 58, 42, '#9fd3f2', 1, null)),
    line('M48 30 L48 98 M72 30 L72 98', C.ink, 3), rect(44, 8, 32, 14, '#5a5d68', 2, C.ink, 1.4), rect(44, 8, 8, 14, RED, 1, C.ink, 1), bolt(64, 15, 0.45),
    waIn('futtrely', 0, 26, ...[[44, 90], [52, 80], [46, 70], [50, 60], [68, 88], [76, 74], [70, 64]].map(([bx, by]) => circle(bx!, by!, 2.6, C.white, C.ink, 0.8))), mol(20, 50), mol(100, 50, 1, O2)),
  // grön vätgas: wind and sun make electricity that fills a green tank with hydrogen
  'futtr.grön-vätgas': all(bg(), rect(0, 100, 120, 20, GRASS, 0, null), windTurbine(22, 100, 1, 'futtrgrv'), g('translate(48 24)', circle(0, 0, 7, C.yellow, C.ink, 1.4)), arrow(40, 70, 58, 70, C.yellow, 2.6),
    g('translate(88 74)', rect(-22, -18, 44, 36, '#7fc98a', 16, C.ink, 2), mol(0, 0, 1.2)), leaf(104, 44, 1.2), ring(88, 74, 28)),
  // energibärare: energy from the sun goes into a tank that is carried away and becomes light at the other end
  'futtr.energibärare': all(bg(), g('translate(16 30)', circle(0, 0, 9, C.yellow, C.ink, 1.4)), arrow(26, 34, 40, 50, C.yellow, 2.4),
    g('translate(60 74)', lorry(0, 30, 0.5, {}), rect(-18, -12, 26, 16, H2, 8, C.ink, 1.6), mol(-5, -4, 0.8)), frame(36, 52, 40, 30), arrow(80, 50, 94, 34, C.yellow, 2.4),
    g('translate(104 26)', circle(0, 0, 8, C.yellow, C.ink, 1.6), rect(-4, 7, 8, 6, C.grey, 1, C.ink, 1.2), line('M-12 -10 L-9 -7 M12 -10 L9 -7 M0 -15 L0 -12', C.gold, 2))),
  // framställa (tillverka): a factory sends out gas bottles on a belt
  'futtr.framställa.2': all(bg(), rect(0, 100, 120, 20, '#c9ced4', 0, null), g('translate(32 100)', path('M-26 0 L-26 -30 L-14 -40 L-14 -30 L-2 -40 L-2 -30 L10 -40 L10 0 Z', '#c9b79a', C.ink, 1.6), rect(14, -60, 8, 60, '#9aa3ad', 1, C.ink, 1.4), rect(-20, -20, 8, 8, GLASS, 1, C.ink, 1), rect(-4, -20, 8, 8, GLASS, 1, C.ink, 1)),
    rect(56, 92, 60, 6, '#5a5d68', 3, C.ink, 1.2), waIn('futtrfra', -20, 0, ...[66, 84, 102].map((bx) => g(`translate(${bx} 92)`, rect(-5, -22, 10, 22, H2, 4, C.ink, 1.3), rect(-3, -26, 6, 4, '#5a5d68', 1, C.ink, 1)))), puff(52, 30, 0.7, C.white)),

  // ── 4265 Drönartransporter ──
  // drönarpilot: a person in an orange vest holds a remote control with two sticks; the drone is close above
  'futtr.drönarpilot': all(bg('#e4f1f8'), rect(0, 104, 120, 16, GRASS, 0, null), g('translate(56 0)', figure({ x: 0, h: 0.82, top: C.orange })), g('translate(56 66)', rect(-14, -7, 28, 14, '#5a5d68', 4, C.ink, 1.4), circle(-6, 0, 3, C.ink, null), circle(6, 0, 3, C.ink, null), line('M-6 0 L-8 -6 M6 0 L8 -6', C.ink, 1.6)),
    waBob('futtrdpl', 2, drone(92, 26, 1, '#5a5d68', 'futtrdplr')), line('M64 62 L86 34', HL, 1.2, '3 3'), ring(56, 66, 17)),
  // inom synhåll: the eye's view cone holds one drone (tick); the other is behind the hill (grey, cross)
  'futtr.inom-synhåll': all(bg('#e4f1f8'), path('M14 60 L110 20 L110 80 Z', 'rgba(255,224,138,0.7)', null), rect(0, 100, 120, 20, GRASS, 0, null), path('M64 100 C72 74 98 70 120 76 L120 100 Z', '#7fae6a', C.ink, 1.4),
    g('translate(14 60)', path('M-10 0 C-4 -8 4 -8 10 0 C4 8 -4 8 -10 0 Z', C.white, C.ink, 1.4), circle(1, 0, 3, C.ink, null)), drone(70, 46, 0.8), tick(70, 30, 1.2), greyed(drone(104, 88, 0.6)), cross(104, 76, 5)),
  // flygförbudszon: from above, a red zone round the runway; a drone at the edge is stopped
  'futtr.flygförbudszon': all(bg('#cfe3b8'), circle(60, 60, 44, 'rgba(232,48,44,0.18)', RED, 2.4), ...range(7).map((i) => line(`M${24 + i * 12} ${22 + (i % 2) * 2} L${16 + i * 12} 98`, 'rgba(232,48,44,0.25)', 1.4)),
    g('translate(60 60) rotate(-30)', rect(-40, -6, 80, 12, '#5a5d68', 1, C.ink, 1.4), line('M-34 0 L34 0', C.white, 1.6, '6 5')), g('translate(60 60) scale(0.9)', `<path d="M0 -10 L3 -2 L14 2 L14 5 L3 3 L2 10 L5 13 L5 15 L0 13 L-5 15 L-5 13 L-2 10 L-3 3 L-14 5 L-14 2 L-3 -2 Z" fill="${C.white}" stroke="${C.ink}" stroke-width="1"/>`),
    drone(104, 18, 0.55), cross(104, 18, 9)),
  // drönarleverans: a drone carries a box from the shop over the trees to a house
  'futtr.drönarleverans': all(bg('#e4f1f8'), rect(0, 100, 120, 20, GRASS, 0, null), tree(48, 100, 1), tree(62, 100, 0.8), house(96, 100, 0.9), g('translate(14 100) scale(0.6)', rect(-14, -30, 28, 30, '#e2e6ea', 1, C.ink, 1.6), path('M-16 -30 L16 -30 L14 -36 L-14 -36 Z', '#3a8acb', C.ink, 1.4)),
    line('M20 70 C40 30 70 26 92 54', C.grey, 1.4, '4 4'), waIn('futtrdlv', -30, 14, drone(64, 32, 0.8), line('M64 40 L64 46', C.ink, 1.2), parcel(64, 50, 14, 10))),
  // fira ner: the drone hovers and lets the box down on a rope
  'futtr.fira-ner': all(bg('#e4f1f8'), rect(0, 100, 120, 20, GRASS, 0, null), house(22, 100, 0.8), drone(66, 18, 1.1),
    moving('futtrfir', '0%{transform:translate(0,-46px)}70%,100%{transform:translate(0,0)}', { dur: 3 }, line('M66 26 L66 -30', C.ink, 1.4), parcel(66, 82, 16, 12)), line('M66 26 L66 76', C.ink, 1.4), arrow(90, 42, 90, 74, HL, 2.6)),
  // landningsplats: a marked square on a roof (circle and cross); the drone comes down on it
  'futtr.landningsplats': all(bg('#e4f1f8'), rect(16, 76, 88, 44, '#c9b79a', 0, C.ink, 1.6), ...range(4).map((i) => rect(24 + i * 20, 92, 12, 12, GLASS, 1, C.ink, 1)), path('M24 76 L96 76 L90 66 L30 66 Z', '#8d949b', C.ink, 1.6),
    ellipse(60, 70, 22, 4, '#3d3f4a', C.ink, 1), ellipse(60, 70, 13, 2.4, 'none', C.yellow, 1.6), line('M54 70 L66 70', C.yellow, 1.6), frame(34, 62, 52, 14), waBob('futtrlnd', 6, drone(60, 38, 1))),

  // ── 4266 Mobilitetstjänster ──
  // mobilitetstjänst: one app on the phone with bike, scooter, car and bus
  'futtr.mobilitetstjänst': all(bg(), phoneWith(60, 62, 1.9, all(rect(-9.5, -16, 9, 15, '#ffd9c7', 1.5, null), rect(0.5, -16, 9, 15, '#d8efd9', 1.5, null), rect(-9.5, 1, 9, 15, '#d6e4f5', 1.5, null), rect(0.5, 1, 9, 15, '#d4efef', 1.5, null),
    bike(-5, -6, 0.17), scooter(5, -4, 0.18), g('translate(-5 9)', rect(-3.5, -2, 7, 3, CAR, 1, null), circle(-2, 1.4, 1, TYRE, null), circle(2, 1.4, 1, TYRE, null)), g('translate(5 9)', rect(-3.5, -3, 7, 5, BUS, 1, null), circle(-2, 2.4, 0.9, TYRE, null), circle(2, 2.4, 0.9, TYRE, null)))), frame(36, 20, 48, 84)),
  // mikromobilitet: small, light vehicles (scooter, bike, monowheel) and a big grey bus for comparison
  'futtr.mikromobilitet': all(bg(), rect(0, 104, 120, 16, '#c9ced4', 0, null), scooter(24, 100, 1), bike(62, 100, 0.9), g('translate(100 100)', circle(0, -8, 8, TYRE, C.ink, 1.4), rect(-4, -20, 8, 10, HL, 2, C.ink, 1.2)), frame(4, 60, 112, 46),
    greyed(busSide(60, 46, 0.4, {}))),
  // låsa upp: the phone opens the padlock on the scooter
  'futtr.låsa-upp': all(bg(), rect(0, 104, 120, 16, '#c9ced4', 0, null), scooter(76, 100, 1.4), phoneWith(24, 60, 1, all(circle(0, -2, 6, '#d8efd9', C.ink, 0.8), tick(0, -2, 0.7))), waPulse('futtrlas', sound(40, 56, 2, 1, HL, 1.8)),
    waIn('futtrlau', 0, 6, padlock(84, 50, 1.2, true, HL))),
  // minutpris: every minute on the clock drops a coin
  'futtr.minutpris': all(bg(), clock(44, 50, 30, 90), line('M44 50 L44 20', RED, 3), path('M44 20 A30 30 0 0 1 50 20.6 L44 50 Z', '#ffd9c7', null), waIn('futtrmin', 0, -20, coin(96, 70, 7)), coin(96, 92, 7), coin(96, 106, 7), arrow(76, 42, 94, 58, HL, 2.6)),
  // felparkerad: the scooter lies across the pavement in front of a door, a pram cannot pass; the parking box is empty
  'futtr.felparkerad': all(bg(), rect(0, 96, 120, 24, '#c9ced4', 0, null), rect(0, 20, 120, 76, '#e8d6b8', 0, C.ink, 1.2), rect(40, 50, 24, 46, '#8a5a32', 1, C.ink, 1.4), scooter(54, 104, 1, GREEN, -78),
    cross(54, 86, 10), g('translate(100 104)', rect(-12, -20, 22, 14, C.purple, 5, C.ink, 1.3), circle(-8, -3, 3, TYRE, null), circle(6, -3, 3, TYRE, null), line('M-12 -18 L-18 -26', C.ink, 2)),
    rect(4, 100, 22, 16, 'none', 1, C.white, 1.6), tick(15, 108, 0.8, C.white)),
  // samåkning: four people in one car on the same road; the grey cars each have one person
  'futtr.samåkning': all(bg(), road(92), waIn('futtrsam', -20, 0, carSide(64, 92, 0.8, { seat: all(bust(-20, -28, 0.5, C.green), bust(-8, -28, 0.5, C.purple), bust(4, -28, 0.5, C.orange), bust(16, -28, 0.5, C.sky)) })),
    ring(64, 70, 34), greyed(carSide(28, 30, 0.3, { seat: bust(2, -28, 0.5) }), carSide(68, 30, 0.3, { seat: bust(2, -28, 0.5) }), carSide(104, 30, 0.3, { seat: bust(2, -28, 0.5) }))),
  // anropsstyrd trafik: a person at a house in the country calls with the phone; a minibus comes on the road
  'futtr.anropsstyrd-trafik': all(bg(), rect(0, 70, 120, 50, GRASS, 0, null), path('M0 108 C40 100 80 100 120 92', 'none', ROAD, 10), house(92, 70, 0.9), tree(14, 70, 0.9),
    g('translate(76 0)', figure({ x: 0, h: 0.42, top: C.purple })), phoneWith(80, 72, 0.22, circle(0, 0, 6, GREEN, null)), waPulse('futtranr', sound(84, 70, 2, 1, HL, 1.6)),
    waIn('futtranb', -24, 4, busSide(36, 108, 0.36, { col: '#f2c14e' })), line('M50 92 C60 86 70 82 76 76', HL, 1.4, '3 3')),

  // ── 4267 Energieffektiv transportplanering ──
  // åkeri: the company's yard with three lorries and a small office
  'futtr.åkeri': all(bg(), rect(0, 70, 120, 50, '#c9ced4', 0, null), g('translate(98 70)', rect(-18, -26, 36, 26, '#e8d6b8', 1, C.ink, 1.6), path('M-20 -26 L20 -26 L20 -32 L-20 -32 Z', '#3a8acb', C.ink, 1.4), rect(-6, -14, 10, 14, '#8a5a32', 1, C.ink, 1)),
    lorry(36, 70, 0.5, {}), lorry(40, 92, 0.5, {}), lorry(44, 114, 0.5, {}), frame(4, 32, 112, 84)),
  // transportbehov: the shop's boxes pile up and all need to be moved; the arrow of need grows
  'futtr.transportbehov': all(bg(), house(26, 100, 1, '#d6e4f5'), ...[[54, 96], [70, 96], [86, 96], [62, 82], [78, 82], [70, 68]].map(([bx, by]) => parcel(bx!, by!, 15, 13)),
    ...[[52, 52], [74, 40], [96, 52]].map(([ax, ay]) => arrow(70, 60, ax!, ay!, C.grey, 1.8)), waGrow('futtrtrb', arrow(104, 104, 104, 20, HL, 4)), rect(0, 104, 120, 16, '#c9ced4', 0, null)),
  // samlastning: three half-empty grey lorries become one full lorry with boxes of three colours
  'futtr.samlastning': all(bg(), greyed(lorry(24, 30, 0.32, { fill: 0.25 }), lorry(24, 60, 0.32, { fill: 0.25 }), lorry(24, 90, 0.32, { fill: 0.25 })), arrow(46, 30, 62, 56, HL, 2.2), arrow(46, 60, 62, 62, HL, 2.2), arrow(46, 90, 62, 68, HL, 2.2),
    g('translate(90 84) scale(0.55)', rect(-46, -46, 68, 40, C.white, 2, C.ink, 1.8), rect(-44, -44, 64, 36, '#f4f1ea', 1, C.ink, 1.2),
      waIn('futtrsml', -16, 0, ...range(8).map((i) => parcel(-36 + (i % 4) * 16, i < 4 ? -16 : -32, 14, 14, ['#d4a373', '#7fc98a', '#9fc0e8'][i % 3]))),
      path('M24 -6 L24 -34 L38 -34 L48 -20 L48 -6 Z', LORRY, C.ink, 1.8), path('M28 -30 L37 -30 L44 -20 L28 -20 Z', GLASS, C.ink, 1), rect(-48, -8, 98, 4, '#5a5d68', 1, C.ink, 1), tyre(-32, -2, 7), tyre(-16, -2, 7), tyre(36, -2, 7))),
  // fyllnadsgrad: the box of the lorry is three quarters full; the bar beside it shows how full
  'futtr.fyllnadsgrad': all(bg(), rect(0, 104, 120, 16, ROAD, 0, null), lorry(56, 104, 1, { fill: 0.75 }), rect(6, 10, 108, 12, C.white, 3, C.ink, 1.4), rect(7.5, 11.5, 78, 9, HL, 2, null),
    `<text x="104" y="40" font-family="system-ui,sans-serif" font-weight="800" font-size="12" text-anchor="end" fill="${C.ink}">75 %</text>`),
  // tomkörning: an empty lorry drives on (dashed, nothing inside)
  'futtr.tomkörning': all(bg(), road(100), waIn('futtrtom', -30, 0, lorry(60, 102, 1, { fill: 0, empty: true })), ring(42, 76, 26), puff(8, 92, 0.7)),
  // returlast: blue boxes go out on the upper road, orange boxes come back on the lower road
  'futtr.returlast': all(bg(), rect(0, 40, 120, 18, ROAD, 0, null), rect(0, 94, 120, 18, ROAD, 0, null), g('translate(104 6)', rect(-14, 0, 28, 24, '#e2e6ea', 1, C.ink, 1.4), path('M-16 0 L16 0 L14 -6 L-14 -6 Z', '#3a8acb', C.ink, 1.2)),
    lorry(44, 52, 0.4, { fill: 1, box: '#9fc0e8' }), arrow(70, 32, 88, 32, C.grey, 2), g('translate(84 106) scale(-0.4 0.4)', lorry(0, 0, 1, { fill: 1, box: HL })), arrow(56, 116, 36, 116, HL, 2.6), frame(58, 66, 54, 40)),
  // kombitransport: the crane lifts the container from the lorry onto the train wagon
  'futtr.kombitransport': all(bg(), rect(0, 106, 120, 14, '#c9ced4', 0, null), line('M0 106 L120 106', C.ink, 1.4), line('M64 10 L64 106 M112 10 L112 106 M60 10 L116 10', '#e4a43c', 3),
    g('translate(24 106)', path('M8 -6 L8 -30 L20 -30 L28 -18 L28 -6 Z', LORRY, C.ink, 1.6), rect(-22, -8, 50, 4, '#5a5d68', 1, C.ink, 1), tyre(-14, -2, 5), tyre(20, -2, 5)),
    waIn('futtrkom', -40, -10, container(70, 52, 40, 20), line('M90 14 L90 52', C.ink, 1.4)), rect(66, 88, 48, 6, '#5a5d68', 1, C.ink, 1.4), circle(74, 98, 4, TYRE, C.ink, 1), circle(106, 98, 4, TYRE, C.ink, 1), frame(66, 48, 48, 28)),
  // sista milen: a long grey route from the terminal; only the last bit to the door, by cargo bike, is orange
  'futtr.sista-milen': all(bg(), g('translate(18 40)', rect(-14, -14, 28, 20, '#e2e6ea', 1, C.ink, 1.4), path('M-16 -14 L16 -14 L14 -20 L-14 -20 Z', '#3a8acb', C.ink, 1.2)),
    line('M30 40 C60 40 70 60 50 74 C34 84 40 96 64 96', C.grey, 2.4, '5 4'), line('M64 96 L94 96', HL, 3.4), house(104, 108, 0.8),
    waIn('futtrsis', -14, 0, g('translate(80 100) scale(0.5)', rect(6, -24, 22, 16, '#d4a373', 2, C.ink, 1.6), circle(-14, 0, 8, 'none', C.ink, 2.2), circle(22, 0, 8, 'none', C.ink, 2.2), line('M-14 0 L-4 -16 L8 -16 L22 0 M-6 -20 L0 -20', HL, 2.6)))),
};
