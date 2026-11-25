/**
 * Teknik & digital värld → Transportteknik → Flygteknik, 4241–4247 (0.60): the parts of an aeroplane, lift and wing
 * profiles, jet engines, propeller aircraft, cockpit instruments, navigation and flight safety.
 * Recurring signs: the part that the word names is orange (or framed or ringed in orange); grey parts show what the
 * word is not. Aeroplanes are white with a blue tail, sky light blue, grass green, asphalt grey, fuel amber, heat and
 * flames red-orange, ice light blue, radio waves short arcs. Words that are easy to mix up get clearly different
 * scenes: höjdroder (the tail from the side, the orange flap goes up and down) and sidroder (the tail from above, the
 * orange flap swings left and right); passagerarplan (windows and people on the stairs), fraktplan (no windows, boxes
 * loaded through the nose) and lastrum (the plane cut open, suitcases under the cabin floor); vingprofil (a wing cut
 * through, framed), lyftkraft (a big arrow up from the wing), anfallsvinkel (the orange angle between wing and wind),
 * överstegring (whirls above a steep wing that falls) and undertryck (a jar with few particles inside); lyfta (wheels
 * leave the runway) and stiga (high above the clouds, the plane rises along a scale); jetmotor (the whole engine cut
 * open, framed), brännkammare (only the middle burns) and luftintag (the engine from the front); avgasstråle (a hot
 * stream behind an airliner engine) and efterbrännare (a fighter with a long flame); propeller (close up, spinning),
 * kolvmotor (a piston moving) and turbopropmotor (a turbine behind the propeller); flygfält (seen from above in the
 * forest), landningsbana (the runway in front of the plane) and flygklubb (a club house and members); flygolycka (a
 * broken plane), nödlanda (a whole plane coming down on a field) and motorhaveri (smoke from one engine in the air).
 * Digits and code signs only; no letters, no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waBob, waGrow, waIn, waPulse, waShake, waSpin, waSway, type Svg } from './kit';
import { HL, T, cloud, sun } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const SKY = '#dcefff';
const BODY = '#f4f6f8';
const TAIL = '#3a6ab0';
const WIN = '#2f4a7a';
const CABW = '#8fbde0';
const WINGC = '#c9d2da';
const STEEL = '#b8c0c8';
const STEEL2 = '#8d949b';
const DARKM = '#5a5d68';
const GRASS = '#9fcf8a';
const FOREST = '#5f9a5a';
const ASPH = '#6f747c';
const FUEL = '#d9a420';
const HOT = '#e4572e';
const FLAME = '#ffb347';
const ICE = '#d7eef8';
const ICEB = '#5aa9d6';
const RED = '#e8302c';
const PANEL = '#2b2b30';
const GLOW = '#7ef0a0';
const BOX = '#d4a373';
const f1 = (n: number) => +n.toFixed(1);
const rad = (d: number) => (d * Math.PI) / 180;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const bg = (col: string = SKY) => rect(0, 0, 120, 120, col, 0, null);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 5, col, 2.6);
const cross = (x: number, y: number, s = 6, col: string = RED) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 3);
const tick = (x: number, y: number, s = 1, col: string = C.green) => line(`M${x - 4 * s} ${y} L${x - 1 * s} ${y + 3 * s} L${x + 5 * s} ${y - 4 * s}`, col, 2.8);
const puff = (x: number, y: number, s = 1, col: string = C.grey2) => g(`translate(${x} ${y}) scale(${s})`, path('M-8 0 C-14 0 -14 -8 -8 -8 C-8 -14 0 -16 3 -11 C8 -15 15 -11 12 -5 C17 -4 16 3 10 3 Z', col, C.ink, 1.1));
const flake = (x: number, y: number, s = 1, col = ICEB) => g(`translate(${x} ${y}) scale(${s})`, line('M0 -7 L0 7 M-6 -3.5 L6 3.5 M-6 3.5 L6 -3.5', col, 2));
const burst = (x: number, y: number, r = 10, col: string = C.yellow) => {
  const pts = range(16).map((i) => { const a = (i * Math.PI) / 8, rr = i % 2 ? r * 0.45 : r; return `${f1(x + Math.cos(a) * rr)} ${f1(y + Math.sin(a) * rr)}`; });
  return path(`M${pts.join(' L')} Z`, col, C.ink, 1.2);
};
const heat = (x: number, y: number, h = 14, col: string = HOT) => line(`M${x} ${y} C${x - 4} ${y - h / 4} ${x + 4} ${y - h / 2} ${x} ${y - (3 * h) / 4} C${x - 3} ${y - h} ${x} ${y - h} ${x} ${y - h}`, col, 2);
/** Radio waves: n arcs opening to the right (dir 1) or left (dir -1), or up (dir 0). */
const waves = (x: number, y: number, n = 3, dir = 1, col: string = C.ink) => all(...range(n).map((i) => {
  const r = 5 + i * 5;
  if (dir === 0) return line(`M${f1(x - r * 0.8)} ${f1(y - r * 0.5)} Q${x} ${f1(y - r * 1.1)} ${f1(x + r * 0.8)} ${f1(y - r * 0.5)}`, col, 2);
  return line(`M${f1(x + dir * r * 0.5)} ${f1(y - r * 0.8)} Q${f1(x + dir * r)} ${y} ${f1(x + dir * r * 0.5)} ${f1(y + r * 0.8)}`, col, 2);
}));
/** Rotation about the point (hx, hy): an invisible circle of radius r centres the box (spin uses fill-box). */
const pivot = (name: string, keyframes: string, dur: number, hx: number, hy: number, r: number, ...kids: Svg[]) =>
  moving(name, keyframes, { dur, spin: true }, circle(hx, hy, r, 'none', null), ...kids);
const swing = (deg: number) => `0%,100%{transform:rotate(${-deg}deg)}50%{transform:rotate(${deg}deg)}`;
const clouds = (...pts: [number, number, number][]) => all(...pts.map(([x, y, s]) => cloud(x, y, s, C.white)));
const grass = (y = 100) => rect(0, y, 120, 120 - y, GRASS, 0, null);
const runwaySide = (y = 104) => all(rect(0, y, 120, 120 - y, ASPH, 0, null), line(`M4 ${y + 8} L116 ${y + 8}`, C.white, 1.6, '9 7'));

// ── People ───────────────────────────────────────────────────────────
/** Standing person, feet at (x, y=112). */
const person = (x: number, top: string, o: { s?: number; l?: [number, number]; r?: [number, number]; hat?: string; y?: number; vest?: boolean; ears?: boolean } = {}) => {
  const s = o.s ?? 1, [lx, ly] = o.l ?? [-12, 22], [rx, ry] = o.r ?? [12, 22];
  return g(`translate(${x} ${o.y ?? 112}) scale(${s})`, line('M-5 0 L-4 -26 M5 0 L4 -26', C.navy, 7), rect(-11, -56, 22, 32, top, 6, C.ink, 1.6),
    o.vest ? all(rect(-11, -50, 22, 20, '#f2e44a', 3, C.ink, 1), line('M-11 -40 L11 -40', '#c9ced4', 2)) : '',
    line(`M-9 -52 L${lx} ${-56 + ly}`, C.ink, 6.4), line(`M-9 -52 L${lx} ${-56 + ly}`, top, 4.4), circle(lx, -56 + ly, 3.2, C.skin, C.ink, 1.2),
    line(`M9 -52 L${rx} ${-56 + ry}`, C.ink, 6.4), line(`M9 -52 L${rx} ${-56 + ry}`, top, 4.4), circle(rx, -56 + ry, 3.2, C.skin, C.ink, 1.2),
    circle(0, -67, 10, C.skin, C.ink, 1.6), o.hat ? path('M-12 -70 C-12 -84 12 -84 12 -70 L14 -69 L-14 -69 Z', o.hat, C.ink, 1.6) : path('M-10 -68 C-10 -81 10 -81 10 -68 C6 -73 -6 -73 -10 -68 Z', C.hair, null),
    o.ears ? all(path('M-12 -74 C-12 -84 12 -84 12 -74', 'none', C.dark, 2.4), rect(-15, -72, 5, 9, C.dark, 2, C.ink, 1), rect(10, -72, 5, 9, C.dark, 2, C.ink, 1)) : '',
    circle(-3.5, -66, 1.2, C.ink, null), circle(3.5, -66, 1.2, C.ink, null), path('M-3 -61 C-1 -59 1 -59 3 -61', 'none', C.ink, 1.2));
};
/** Head seen from behind with a headset. */
const headBack = (x: number, y: number, s = 1, cap = false) => g(`translate(${x} ${y}) scale(${s})`, rect(-12, 8, 24, 16, C.navy, 5, C.ink, 1.4), circle(0, 0, 9, C.hair, C.ink, 1.4),
  cap ? path('M-10 -2 C-10 -12 10 -12 10 -2 Z', C.navy, C.ink, 1.2) : '', path('M-10 -2 C-10 -13 10 -13 10 -2', 'none', C.dark, 2.2), rect(-12, -3, 4, 7, C.dark, 1.5, null), rect(8, -3, 4, 7, C.dark, 1.5, null));
/** Head in profile facing right, with a headset and microphone. */
const headSide = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(0, 0, 9, C.skin, C.ink, 1.4), path('M-9 -1 C-9 -12 6 -12 8 -5 C2 -7 -4 -6 -9 -1 Z', C.hair, null),
  circle(4, -1, 1.1, C.ink, null), path('M-6 -9 C-2 -13 4 -12 5 -8', 'none', C.dark, 2), rect(-5, -3, 5, 7, C.dark, 1.5, C.ink, 0.8), line('M-1 4 C2 8 6 8 9 6', C.dark, 1.4), circle(9, 6, 1.4, C.dark, null));

// ── Aeroplanes ───────────────────────────────────────────────────────
type Part = 'body' | 'nose' | 'fin' | 'gear' | 'wing' | 'engine';
/** Airliner from the side, nose to the right, centre (x, y). hl paints one part orange and the rest light grey. */
const planeSide = (x: number, y: number, s = 1, o: { hl?: Part; win?: boolean; gear?: boolean; engine?: boolean; door?: boolean } = {}) => {
  const hl = o.hl, dim = (p: Part, col: string) => (hl ? (hl === p ? HL : '#e3e7eb') : col);
  const bodyCol = hl ? (hl === 'body' ? HL : '#eef1f4') : BODY;
  return g(`translate(${x} ${y}) scale(${s})`,
    path('M-34 -9 L-52 -11 L-58 -36 L-49 -36 Z', dim('fin', TAIL), C.ink, 1.4),
    path('M-52 -11 L-40 -9 L36 -9 C46 -9 53 -5 55 0 C53 5 46 7 36 7 L-30 7 C-40 7 -48 2 -52 -5 Z', bodyCol, C.ink, 1.6),
    hl === 'nose' ? path('M42 -9 C48 -8 53 -5 55 0 C53 5 48 7 42 7 Z', HL, C.ink, 1.4) : '',
    ellipse(-46, -6, 10, 2.2, dim('fin', '#9fb4cc'), C.ink, 1),
    path('M43 -6 L49 -5 L51.5 -2 L44 -2 Z', WIN, null),
    o.win === false ? '' : all(...range(11).map((i) => circle(-28 + i * 6, -3, 1.2, hl && hl !== 'body' ? '#c4ccd4' : CABW, null))),
    o.door ? rect(34, -7, 4, 11, 'none', 1, C.ink, 0.9) : '',
    path('M14 1 L0 1 L-22 9 L-12 9 Z', dim('wing', WINGC), C.ink, 1.2),
    o.engine === false ? '' : all(rect(-6, 6, 20, 7, dim('engine', '#dfe3e7'), 3.5, C.ink, 1.2), ellipse(14, 9.5, 1.6, 3.5, DARKM, null)),
    o.gear ? all(line('M34 7 L34 15 M-6 9 L-6 15', DARKM, 2), circle(34, 17, 3, dim('gear', '#2b2b30'), C.ink, 1), circle(-6, 17, 3, dim('gear', '#2b2b30'), C.ink, 1), circle(-1, 17, 3, dim('gear', '#2b2b30'), C.ink, 1)) : '');
};
/** Airliner from above, nose up, centre (x, y). */
const planeTop = (x: number, y: number, s = 1, o: { wings?: string; flap?: string; aileron?: string; body?: string; rot?: number } = {}) => g(`translate(${x} ${y}) rotate(${o.rot ?? 0}) scale(${s})`,
  path('M6 -6 L52 14 L52 20 L6 10 Z M-6 -6 L-52 14 L-52 20 L-6 10 Z', o.wings ?? WINGC, C.ink, 1.4),
  o.flap ? path('M8 10.4 L26 14.4 L26 17.6 L8 13.6 Z M-8 10.4 L-26 14.4 L-26 17.6 L-8 13.6 Z', o.flap, C.ink, 1) : '',
  o.aileron ? path('M34 16.2 L50 19.8 L50 23 L34 19.4 Z M-34 16.2 L-50 19.8 L-50 23 L-34 19.4 Z', o.aileron, C.ink, 1) : '',
  rect(16, 0, 7, 14, '#dfe3e7', 3, C.ink, 1), rect(-23, 0, 7, 14, '#dfe3e7', 3, C.ink, 1),
  path('M5 38 L22 47 L22 51 L5 48 Z M-5 38 L-22 47 L-22 51 L-5 48 Z', '#d5dbe1', C.ink, 1.2),
  path('M0 -50 C5 -48 6 -40 6 -30 L6 38 C6 46 3 52 0 54 C-3 52 -6 46 -6 38 L-6 -30 C-6 -40 -5 -48 0 -50 Z', o.body ?? BODY, C.ink, 1.6),
  path('M-4 -40 L4 -40 L3 -36 L-3 -36 Z', WIN, null), line('M0 40 L0 54', TAIL, 2.4));
/** Small high-wing propeller plane from the side, nose right; wheels at y + 13. */
const smallPlane = (x: number, y: number, s = 1, o: { col?: string; prop?: string; float?: boolean; noGear?: boolean } = {}) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-30 -4 L-38 -18 L-32 -18 L-22 -5 Z', o.col ?? RED, C.ink, 1.3),
  path('M-36 -4 C-30 -6 -10 -8 10 -8 L22 -6 C26 -4 26 4 22 5 L-10 5 C-24 4 -32 1 -36 -4 Z', BODY, C.ink, 1.5),
  path('M-4 -8 L8 -8 L12 -2 L-2 -2 Z', CABW, C.ink, 1), rect(-14, -12, 30, 4, o.col ?? RED, 2, C.ink, 1.2), line('M2 -8 L-2 2', DARKM, 1.2),
  ellipse(-32, -3, 7, 1.6, o.col ?? RED, C.ink, 1), rect(24, -2, 4, 4, DARKM, 1, null), ellipse(29, 0, 1.6, 11, o.prop ?? 'rgba(90,93,104,.35)', C.ink, 1),
  o.float ? all(line('M-8 5 L-10 14 M12 5 L14 14', DARKM, 1.6), path('M-22 14 L26 14 C30 14 30 19 24 19 L-20 19 C-24 19 -24 14 -22 14 Z', '#e9ecef', C.ink, 1.3))
    : o.noGear ? '' : all(line('M8 5 L10 11 M-14 4 L-14 11', DARKM, 1.6), circle(10, 12, 2.6, '#2b2b30', null), circle(-14, 12, 2.4, '#2b2b30', null)));
/** Fighter jet from the side, nose right. */
const fighter = (x: number, y: number, s = 1, col = '#8d949b') => g(`translate(${x} ${y}) scale(${s})`,
  path('M-30 -3 L-38 -18 L-30 -18 L-20 -4 Z', col, C.ink, 1.3), path('M-34 -4 L14 -6 C26 -6 36 -2 40 0 C36 2 26 3 14 3 L-34 3 Z', col, C.ink, 1.5),
  path('M8 -6 C12 -10 20 -9 24 -5 Z', '#5a7a9a', C.ink, 1), path('M-6 0 L-22 0 L-28 8 L-2 3 Z', '#7a828a', C.ink, 1.2), rect(-38, -3, 5, 6, DARKM, 1, C.ink, 1));
/** Wing profile (airfoil) from the side, leading edge at (x, y), chord length L, angle deg (nose up = positive). */
const airfoil = (x: number, y: number, L = 70, deg = 0, col: string = '#eef1f4', stroke: string = C.ink) => g(`translate(${x} ${y}) rotate(${-deg})`,
  path(`M0 0 C0 ${f1(-L * 0.16)} ${f1(L * 0.3)} ${f1(-L * 0.2)} ${f1(L * 0.55)} ${f1(-L * 0.13)} C${f1(L * 0.8)} ${f1(-L * 0.07)} ${L} ${f1(-L * 0.01)} ${L} 0 C${f1(L * 0.7)} ${f1(L * 0.03)} ${f1(L * 0.3)} ${f1(L * 0.08)} ${f1(L * 0.08)} ${f1(L * 0.06)} C${f1(L * 0.02)} ${f1(L * 0.05)} 0 ${f1(L * 0.03)} 0 0 Z`, col, stroke, 2));
/** Cut-away jet engine, intake left, exhaust right, centre (x, y). parts: which section is orange. */
const jetCut = (x: number, y: number, s = 1, o: { hl?: 'burner' | 'all'; flame?: boolean } = {}) => {
  const burner = o.hl === 'burner';
  return g(`translate(${x} ${y}) scale(${s})`,
    path('M-46 -20 C-40 -24 30 -22 40 -14 L48 -8 L48 8 L40 14 C30 22 -40 24 -46 20 Z', '#e3e7eb', C.ink, 1.8),
    rect(-44, -18, 6, 36, STEEL, 2, C.ink, 1.2), ...range(4).map((i) => line(`M-41 ${-16 + i * 11} L-41 ${-10 + i * 11}`, DARKM, 2)),
    ...range(5).map((i) => line(`M${-32 + i * 5} ${-12 + i} L${-32 + i * 5} ${12 - i}`, STEEL2, 2.4)),
    rect(-6, -10, 18, 20, burner ? HL : '#f3d9c4', 3, C.ink, 1.4), o.flame === false ? '' : all(path('M-2 6 C-4 0 0 -4 2 -6 C3 -2 6 -1 6 3 C6 6 4 8 2 8 C0 8 -2 7 -2 6 Z', FLAME, C.ink, 0.8), path('M6 6 C5 2 8 0 9 -2 C10 1 11 3 10 5 C10 7 8 8 7 8 Z', FLAME, C.ink, 0.8)),
    ...range(3).map((i) => line(`M${16 + i * 5} ${-10 + i} L${16 + i * 5} ${10 - i}`, STEEL2, 2.4)),
    path('M32 -6 L44 -2 L44 2 L32 6 Z', DARKM, C.ink, 1));
};
/** Round instrument dial. */
const dial = (x: number, y: number, r: number, inner: Svg = '', rim: string = '#3a3a44') => all(circle(x, y, r + 3, rim, C.ink, 1.4), circle(x, y, r, '#1f2430', null), inner);
const needle = (x: number, y: number, len: number, deg: number, col: string = GLOW) => all(line(`M${x} ${y} L${f1(x + Math.sin(rad(deg)) * len)} ${f1(y - Math.cos(rad(deg)) * len)}`, col, 2.2), circle(x, y, 2, col, null));
const ticks = (x: number, y: number, r: number, n: number, from = 0, to = 360, col = '#c9ced4') => all(...range(n).map((i) => {
  const a = rad(from + ((to - from) * i) / (to - from === 360 ? n : n - 1));
  return line(`M${f1(x + Math.sin(a) * r * 0.78)} ${f1(y - Math.cos(a) * r * 0.78)} L${f1(x + Math.sin(a) * r * 0.95)} ${f1(y - Math.cos(a) * r * 0.95)}`, col, 1.4);
}));
const drop = (x: number, y: number, s = 1, col: string = FUEL) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -9 C4 -3 6 0 6 3 C6 7 3 9 0 9 C-3 9 -6 7 -6 3 C-6 0 -4 -3 0 -9 Z', col, C.ink, 1.2));
const tower = (x: number, s = 1, glass: string = CABW) => g(`translate(${x} 112) scale(${s})`, path('M-6 0 L-4 -60 L4 -60 L6 0 Z', '#d5dbe1', C.ink, 1.5),
  path('M-14 -60 L14 -60 L11 -72 L-11 -72 Z', glass, C.ink, 1.5), rect(-15, -76, 30, 5, '#9aa3ad', 1.5, C.ink, 1.2), line('M0 -76 L0 -86', C.ink, 1.4), circle(0, -87, 1.6, RED, null));
const paper = (x: number, y: number, w = 30, h = 38, inner: Svg = '') => all(rect(x, y, w, h, C.white, 2, C.ink, 1.4), inner);
const box = (x: number, y: number, w = 14, h = 12) => all(rect(x - w / 2, y - h / 2, w, h, BOX, 1, C.ink, 1.2), line(`M${x} ${y - h / 2} L${x} ${y + h / 2}`, '#b0844f', 1.4));
const suitcase = (x: number, y: number, col: string, w = 12, h = 10) => all(rect(x - w / 2, y - h / 2, w, h, col, 2, C.ink, 1.1), rect(x - 2.5, y - h / 2 - 2, 5, 2.4, 'none', 1, C.ink, 1));
const windsock = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L0 -30', C.ink, 1.8), path('M0 -30 L20 -27 L20 -21 L0 -18 Z', C.white, C.ink, 1.2),
  path('M5 -29.2 L10 -28.5 L10 -19.5 L5 -18.8 Z M15 -27.8 L20 -27 L20 -21 L15 -20.2 Z', HL, null));
const house = (x: number, y: number, s = 1, col = '#b5413a') => g(`translate(${x} ${y}) scale(${s})`, rect(-16, -18, 32, 18, col, 1, C.ink, 1.4), path('M-19 -18 L0 -32 L19 -18 Z', '#5a5d68', C.ink, 1.4),
  rect(-11, -13, 7, 6, CABW, 1, C.white, 1.2), rect(4, -12, 6, 12, '#f6f2ea', 1, C.ink, 1));
const tree = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -24 L9 -6 L4 -6 L11 6 L-11 6 L-4 -6 L-9 -6 Z', FOREST, C.ink, 1.1), rect(-1.5, 6, 3, 5, '#7a5a3a', 0.5, null));
const bird = (x: number, y: number, s = 1, col: string = C.ink) => g(`translate(${x} ${y}) scale(${s})`, path('M-8 -2 Q-4 -7 0 -1 Q4 -7 8 -2', 'none', col, 2.2));

export const AVIAT_MOTIFS: Record<string, Svg> = {
  // ── 4241 Flygplanets delar ──
  'aviat.vinge.2': all(bg(), clouds([20, 104, 1], [100, 18, 0.8]), planeTop(60, 58, 1, { wings: HL })),
  'aviat.flygkropp': all(bg(), clouds([22, 98, 1], [98, 100, 0.8]), planeSide(60, 62, 0.98, { hl: 'body' })),
  'aviat.stjärtfena.2': all(bg(), clouds([96, 100, 1]), planeSide(66, 72, 0.98, { hl: 'fin' }), ring(17, 47, 14)),
  'aviat.höjdroder': all(bg(), g('translate(80 64) scale(1.3)', path('M30 -10 L-20 -10 C-28 -10 -32 -6 -34 -3 L-34 3 C-30 6 -26 7 -20 7 L30 7 Z', BODY, C.ink, 1.4),
      path('M10 -10 L-16 -10 L-26 -38 L-14 -38 Z', '#d5dbe1', C.ink, 1.2), path('M2 -1 C2 -3 -10 -3.6 -22 -2 L-22 2 C-10 3.4 2 3 2 1 Z', '#d5dbe1', C.ink, 1.2)),
    pivot('aviathojd', swing(16), 2.2, 51.4, 64, 14, path('M51.4 61.4 L38 62.6 C35 63.4 35 64.6 38 65.4 L51.4 66.6 Z', HL, C.ink, 1.6)),
    arrow(30, 50, 30, 38, HL, 2.6), arrow(30, 78, 30, 90, HL, 2.6),
    g('translate(28 18)', waSway('aviathojd2', 14, planeSide(0, 0, 0.26, { engine: false }))), ring(44, 64, 14)),
  'aviat.sidroder': all(bg('#cfe4f1'), path('M52 0 L68 0 L68 70 C68 84 64 94 60 98 C56 94 52 84 52 70 Z', BODY, C.ink, 1.6), path('M52 64 L16 84 L16 92 L54 82 Z M68 64 L104 84 L104 92 L66 82 Z', '#d5dbe1', C.ink, 1.4),
    line('M60 50 L60 92', TAIL, 4),
    pivot('aviatsid', swing(18), 2.2, 60, 92, 16, line('M60 92 L60 108', C.ink, 6.4), line('M60 92 L60 108', HL, 4.2)),
    path('M42 108 C48 116 72 116 78 108', 'none', HL, 2.4), arrow(76, 108, 80, 105, HL, 2.4), arrow(44, 108, 40, 105, HL, 2.4),
    g('translate(98 22)', waSway('aviatsid2', 16, planeTop(0, 0, 0.26))), ring(60, 100, 12)),
  'aviat.landningsställ': all(bg(), runwaySide(106), clouds([20, 22, 0.9]), planeSide(60, 66, 1, {}),
    g('translate(60 66)', moving('aviatland', '0%{transform:translate(0,-9px);opacity:.1}60%,100%{transform:translate(0,0);opacity:1}', { dur: 2.8 },
      line('M34 7 L34 18 M-6 9 L-6 18', DARKM, 2.4), circle(34, 20, 3.6, '#2b2b30', HL, 2), circle(-6, 20, 3.6, '#2b2b30', HL, 2), circle(0, 20, 3.6, '#2b2b30', HL, 2)))),
  'aviat.cockpit': all(rect(0, 0, 120, 120, '#3a3a44', 0, null), path('M8 14 L112 14 L104 54 L16 54 Z', '#bfe3f5', C.ink, 2), line('M60 14 L60 54', '#3a3a44', 5), line('M14 46 L106 46', C.white, 1, '4 4'),
    rect(8, 56, 104, 26, PANEL, 4, C.ink, 1.6), ...[20, 40, 80, 100].map((x) => rect(x - 8, 60, 16, 14, '#1f3550', 2, '#5a7a9a', 1)), rect(52, 60, 16, 18, '#1f3550', 2, '#5a7a9a', 1),
    ...[20, 40, 80, 100].map((x) => line(`M${x - 5} 69 L${x + 5} 65`, GLOW, 1.4)), headBack(34, 92, 1.1, true), headBack(86, 92, 1.1, true), frame(4, 10, 112, 104)),
  'aviat.lastrum': all(bg(), g('translate(60 60) scale(1.7)', path('M-30 -14 L30 -14 C34 -14 34 14 30 14 L-30 14 C-34 14 -34 -14 -30 -14 Z', BODY, C.ink, 1.2), line('M-31 1 L31 1', C.ink, 1.2),
      ...range(6).map((i) => all(rect(-26 + i * 9, -9, 6, 8, '#3a6ab0', 1.5, C.ink, 0.6), circle(-23 + i * 9, -11, 2.2, C.skin, C.ink, 0.6))),
      rect(-30, 2, 60, 11, '#f3e6cf', 1, null), suitcase(-22, 8, RED, 9, 7), suitcase(-11, 8, '#3a9a5a', 9, 7), suitcase(0, 8, C.navy, 9, 7), suitcase(11, 8, C.purple, 9, 7), suitcase(22, 8, C.gold, 9, 7)),
    frame(8, 62, 104, 22)),
  'aviat.vingspann': all(bg(), clouds([16, 104, 0.8]), planeTop(60, 66, 1, {}), line('M8 70 L8 92 M112 70 L112 92', C.ink, 1.4, '3 2'),
    line('M10 20 L110 20', HL, 3), path('M8 20 L16 15 L16 25 Z M112 20 L104 15 L104 25 Z', HL, null), line('M8 14 L8 84 M112 14 L112 84', HL, 1.6, '3 3'), T(60, 15, '36', 10, C.ink)),
  'aviat.passagerarplan': all(bg(), runwaySide(106), planeSide(66, 72, 0.98, { gear: true, door: true }), ...range(9).map((i) => circle(42 + i * 6 - 28, 69, 1.6, C.skin, null)),
    path('M98 64 L84 104 L92 104 L104 66 Z', '#d5dbe1', C.ink, 1.2), ...range(5).map((i) => line(`M${f1(99 - i * 3)} ${66 + i * 8} L${f1(104 - i * 3)} ${66 + i * 8}`, C.ink, 1)),
    person(88, C.green, { s: 0.42, y: 94 }), person(80, C.orange, { s: 0.42, y: 106 }), person(70, C.purple, { s: 0.42, y: 112 })),
  'aviat.fraktplan': all(bg(), runwaySide(106), g('translate(52 74) scale(0.98)', planeSide(0, 0, 1, { win: false, gear: true })), path('M100 64 L112 50 L114 56 L104 68 Z', BODY, C.ink, 1.3),
    rect(96, 82, 22, 6, '#e4c13c', 1, C.ink, 1.2), line('M100 88 L100 104 M114 88 L114 104', DARKM, 2), box(102, 76), box(112, 76), rect(78, 96, 40, 8, DARKM, 2, C.ink, 1), box(88, 90), waIn('aviatfrakt', 12, 0, box(100, 60, 12, 10)), ring(105, 72, 15)),
  'aviat.hangar': all(bg(), grass(102), path('M6 104 L6 50 C6 18 114 18 114 50 L114 104 Z', '#9aa3ad', C.ink, 2), path('M20 104 L20 56 C20 36 100 36 100 56 L100 104 Z', '#3a3a44', C.ink, 1.6),
    ...range(6).map((i) => line(`M${10 + i * 20} 46 L${10 + i * 20} 30`, '#7a838d', 1.4)), g('translate(64 92) scale(0.72)', planeSide(0, 0, 1, { gear: true })), frame(4, 16, 112, 92)),
  'aviat.flygtekniker': all(bg('#e9eef2'), rect(0, 104, 120, 16, '#c9ced4', 0, null), g('translate(86 62)', circle(0, 0, 28, '#dfe3e7', C.ink, 1.8), circle(0, 0, 22, '#3a3a44', C.ink, 1.2), ...range(10).map((i) => line(`M0 0 L${f1(Math.cos(rad(i * 36)) * 20)} ${f1(Math.sin(rad(i * 36)) * 20)}`, STEEL, 2.4)), circle(0, 0, 5, STEEL, C.ink, 1)),
    person(40, C.navy, { vest: true, ears: true, r: [22, 4], l: [-14, 16] }), g('translate(62 52) rotate(-30)', rect(-2, -14, 4, 20, STEEL2, 1, C.ink, 1), path('M-6 -16 C-6 -22 6 -22 6 -16 L2 -16 L2 -19 L-2 -19 L-2 -16 Z', STEEL2, C.ink, 1)),
    paper(14, 74, 14, 18, all(tick(21, 80, 0.7), tick(21, 87, 0.7)))),

  // ── 4242 Lyftkraft och vingprofiler ──
  'aviat.vingprofil': all(bg('#eef4f8'), airfoil(14, 66, 92, 0, '#fde3d3'), airfoil(14, 66, 92, 0, 'none', HL), g('translate(84 22)', planeTop(0, 0, 0.3)), line('M70 22 L98 22', HL, 1.6, '3 2'),
    path('M84 30 C80 40 72 46 62 50', 'none', C.grey, 1.6, ), arrow(66, 48, 62, 50, C.grey, 1.6), frame(6, 44, 108, 36)),
  'aviat.lyftkraft': all(bg(), airfoil(18, 80, 84, 6), ...[60, 70, 92, 102].map((y, i) => waIn(`aviatlyft${i}`, -24, 0, line(`M4 ${y} C40 ${y - (i < 2 ? 10 : -4)} 80 ${y - (i < 2 ? 8 : -2)} 116 ${y}`, '#7ab6d9', 1.6))),
    moving('aviatlyft', '0%{transform:translate(0,14px);opacity:.3}60%,100%{transform:translate(0,0);opacity:1}', { dur: 2.6 }, line('M58 70 L58 20', HL, 7), path('M46 26 L58 8 L70 26 Z', HL, C.ink, 1.2))),
  'aviat.undertryck': all(bg('#eef4f8'), ...range(26).map((i) => circle(f1(6 + ((i * 37) % 108)), f1(6 + ((i * 53) % 108)), 2, '#7a7f88', null)), rect(32, 32, 56, 64, '#fbfbf8', 8, C.ink, 2),
    path('M30 32 C46 40 74 40 90 32', 'none', C.ink, 3), circle(48, 76, 2, '#7a7f88', null), circle(72, 60, 2, '#7a7f88', null), line('M50 62 L70 62', ICEB, 5),
    waIn('aviatunder', -10, 0, arrow(10, 62, 28, 62, HL, 3)), waIn('aviatunder2', 10, 0, arrow(110, 62, 92, 62, HL, 3)), waIn('aviatunder3', 0, -10, arrow(60, 8, 60, 28, HL, 3))),
  'aviat.anfallsvinkel': all(bg(), ...[38, 54, 96, 110].map((y) => arrow(4, y, 26, y, C.grey, 2)), airfoil(30, 84, 80, 16), line('M30 84 L116 84', C.ink, 1.4, '4 3'), line('M30 84 L108 61.6', C.ink, 1.4, '4 3'),
    path('M30 84 L96 84 A66 66 0 0 0 93.4 65.8 Z', 'rgba(228,87,46,.35)', null), path('M96 84 A66 66 0 0 0 93.4 65.8', 'none', HL, 3)),
  'aviat.överstegring': all(bg(), moving('aviatover', '0%{transform:translate(0,-16px)}100%{transform:translate(0,6px)}', { dur: 2.6 }, airfoil(26, 74, 76, 28),
      ...[[60, 40], [80, 48], [98, 58], [74, 30]].map(([x, y]) => path(`M${x} ${y} c6 -6 12 0 6 6 c-4 4 -10 -2 -4 -6`, 'none', HL, 2.4))), line('M4 92 C40 96 80 100 116 100', '#7ab6d9', 1.6), line('M4 104 C40 106 80 110 116 110', '#7ab6d9', 1.6),
    arrow(14, 26, 14, 52, RED, 3)),
  'aviat.klaff.3': all(bg(), airfoil(6, 58, 88, 0), moving('aviatklaff', '0%,15%{transform:translate(-16px,-6px) rotate(0)}60%,100%{transform:translate(0,0)}', { dur: 2.8 }, g('translate(92 62) rotate(28)', path('M0 0 C4 -3 18 -2 24 0 C18 2 4 3 0 0 Z', HL, C.ink, 1.6))),
    ring(102, 68, 16), g('translate(30 22)', planeTop(0, 0, 0.28, { flap: HL }))),
  'aviat.skevroder': all(bg(), clouds([18, 100, 0.8], [104, 104, 0.7]), waSway('aviatskev', 12, g('translate(60 58)', line('M-50 2 L50 -2', C.ink, 6), line('M-50 2 L50 -2', WINGC, 4), circle(0, 0, 10, BODY, C.ink, 1.6), path('M-2 -8 L-3 -28 L3 -28 L2 -8 Z', TAIL, C.ink, 1.2),
      line('M-50 2 L-36 1.4', C.ink, 1.6), path('M-50 1 L-38 0.6 L-36 -6 L-48 -6 Z', HL, C.ink, 1.2), path('M50 -1 L38 -0.6 L36 6 L48 6 Z', HL, C.ink, 1.2), circle(-28, 8, 4, '#dfe3e7', C.ink, 1), circle(28, 8, 4, '#dfe3e7', C.ink, 1))),
    path('M24 22 C40 10 80 10 96 22', 'none', HL, 2.6), arrow(92, 18, 98, 24, HL, 2.6)),
  'aviat.lyfta.2': all(bg(), runwaySide(100), clouds([26, 24, 0.9]), moving('aviatlyfta', '0%{transform:translate(-56px,16px) rotate(10deg)}35%{transform:translate(-30px,14px) rotate(10deg)}100%{transform:translate(0,0) rotate(0)}', { dur: 3.2 },
      g('translate(76 70) rotate(-12)', planeSide(0, 0, 0.8, { gear: true }))), line('M58 100 L58 92 M96 98 L96 84', HL, 2, '3 2'), path('M40 96 L118 82', 'none', HL, 2.2, ), arrow(104, 84, 116, 82, HL, 2.2)),
  'aviat.stiga.2': all(bg('#cfe6fb'), rect(0, 86, 120, 34, '#eef6fc', 0, null), clouds([22, 92, 1.2], [70, 98, 1.3], [108, 90, 1]), line('M12 80 L12 12', C.ink, 2), ...range(7).map((i) => line(`M8 ${80 - i * 11} L16 ${80 - i * 11}`, C.ink, 1.6)),
    moving('aviatstiga', '0%{transform:translate(-14px,34px)}100%{transform:translate(0,0)}', { dur: 3 }, g('translate(70 40) rotate(-18)', planeSide(0, 0, 0.62)), path('M16 38 L24 34 L24 42 Z', HL, C.ink, 1)),
    arrow(36, 76, 36, 16, HL, 3)),
  'aviat.glidflyga': all(bg('#cfe6fb'), rect(0, 92, 120, 28, GRASS, 0, null), path('M0 98 L40 94 L80 100 L120 96 L120 120 L0 120 Z', '#b9dca0', null), line('M0 108 L120 104', '#8bbd76', 1.4),
    line('M8 18 C40 30 80 50 112 70', C.ink, 1.4, '4 4'),
    moving('aviatglid', '0%{transform:translate(-40px,-22px)}100%{transform:translate(0,0)}', { dur: 4.4 }, g('translate(70 46) rotate(12)', path('M-30 -1 C-20 -3 10 -4 20 -2 C24 -1 24 2 20 2 L-30 2 Z', BODY, C.ink, 1.4), path('M-28 -1 L-34 -10 L-30 -10 L-24 -1 Z', RED, C.ink, 1.1),
      path('M-4 -2 L4 -2 L6 1 L-2 1 Z', CABW, null), path('M-46 -2 L44 -4 L44 -2 L-46 0 Z', HL, C.ink, 1.1))), sun(98, 20, 7)),

  // ── 4243 Jetmotorer ──
  'aviat.jetmotor': all(bg('#eef4f8'), jetCut(62, 60, 1.1), waIn('aviatjet1', -12, 0, arrow(2, 50, 12, 50, ICEB, 2.6), arrow(2, 70, 12, 70, ICEB, 2.6)), waIn('aviatjet2', -12, 0, arrow(112, 60, 118, 60, HOT, 2.6)), frame(6, 30, 110, 60)),
  'aviat.jetplan': all(bg(), line('M2 52 L30 54 M2 60 L30 60', C.white, 3), planeSide(62, 56, 0.9, { hl: 'engine' }), puff(14, 66, 0.6, '#f1f3f5'), clouds([24, 100, 1], [98, 104, 0.9])),
  'aviat.luftintag': all(bg('#eef4f8'), circle(60, 60, 46, '#dfe3e7', C.ink, 2), circle(60, 60, 40, '#2b2b30', C.ink, 1.4), waSpin('aviatintag', 2, ...range(14).map((i) => path(`M60 60 L${f1(60 + Math.cos(rad(i * 25.7)) * 38)} ${f1(60 + Math.sin(rad(i * 25.7)) * 38)} L${f1(60 + Math.cos(rad(i * 25.7 + 12)) * 37)} ${f1(60 + Math.sin(rad(i * 25.7 + 12)) * 37)} Z`, STEEL, C.ink, 0.6))),
    circle(60, 60, 8, '#dfe3e7', C.ink, 1.4), path('M56 58 C58 56 62 56 64 58', 'none', C.ink, 1.2), circle(60, 60, 43, 'none', HL, 5)),
  'aviat.brännkammare': all(bg('#eef4f8'), greyed(jetCut(62, 60, 1.1, { flame: false })), g('translate(62 60) scale(1.1)', rect(-6, -10, 18, 20, HL, 3, C.ink, 1.6),
      waPulse('aviatbrann', path('M-2 6 C-4 0 0 -4 2 -6 C3 -2 6 -1 6 3 C6 6 4 8 2 8 C0 8 -2 7 -2 6 Z', C.yellow, C.ink, 0.8), path('M6 6 C5 2 8 0 9 -2 C10 1 11 3 10 5 C10 7 8 8 7 8 Z', C.yellow, C.ink, 0.8))), ring(65, 60, 18)),
  'aviat.avgasstråle': all(bg('#cfe4f1'), rect(0, 96, 120, 24, ASPH, 0, null), g('translate(26 56)', path('M-26 -16 L10 -16 L22 -8 L22 8 L10 16 L-26 16 Z', '#dfe3e7', C.ink, 1.8), path('M14 -6 L24 -3 L24 3 L14 6 Z', DARKM, C.ink, 1)),
    waPulse('aviatavgas', path('M50 52 L118 36 L118 76 L50 60 Z', 'rgba(239,138,60,.45)', HL, 1.6)), ...[64, 80, 96].map((x) => heat(x, 64, 14)), g('translate(100 104)', path('M-5 0 L0 -14 L5 0 Z', HL, C.ink, 1), rect(-7, 0, 14, 3, C.ink, 1, null)), cross(100, 86, 5)),
  'aviat.efterbrännare': all(bg('#2a3550'), ...range(8).map((i) => circle(f1(10 + ((i * 41) % 104)), f1(10 + ((i * 29) % 40)), 1, C.white, null)), fighter(78, 58, 1.1),
    waPulse('aviatefter', path('M36 54 L2 50 C-2 56 -2 60 2 66 L36 62 Z', FLAME, C.ink, 1), path('M36 56 L14 55 L14 61 L36 60 Z', C.yellow, null), ...[26, 16].map((x) => path(`M${x} 58 l3 -3 l3 3 l-3 3 Z`, C.white, null))), ring(34, 58, 10)),
  'aviat.flygbränsle': all(bg(), rect(0, 100, 120, 20, ASPH, 0, null), g('translate(30 96)', rect(-26, -26, 30, 26, '#e4c13c', 3, C.ink, 1.6), rect(4, -18, 18, 18, '#e4c13c', 3, C.ink, 1.6), rect(8, -14, 10, 7, '#bfe3f5', 1, C.ink, 1), circle(-16, 2, 5, '#2b2b30', null), circle(12, 2, 5, '#2b2b30', null), drop(-11, -13, 1, FUEL)),
    path('M58 0 L120 20 L120 44 L62 26 Z', WINGC, C.ink, 1.6), path('M28 72 C40 50 60 50 78 34', 'none', C.ink, 3.6), waIn('aviatfuel', -18, 18, drop(66, 42, 0.8)), ring(80, 34, 10)),
  'aviat.överljudsfart': all(bg(), rect(0, 104, 120, 16, GRASS, 0, null), ...[[64, 15], [46, 27], [28, 39]].map(([x, r]) => circle(x as number, 50, r as number, 'none', '#7a7f88', 1.4)),
    line('M90 50 L20 6 M90 50 L20 94', HL, 3), fighter(96, 50, 0.6), g('translate(44 108)', burst(0, -6, 8, C.yellow)), line('M60 100 l4 -6 M68 102 l6 -4', C.ink, 1.6)),

  // ── 4244 Propellerflygplan ──
  'aviat.propeller': all(bg(), circle(60, 60, 26, '#d5dbe1', C.ink, 1.8), waSpin('aviatprop', 0.9, ...[0, 120, 240].map((d) => g(`rotate(${d} 60 60)`, path('M56 58 C54 40 56 20 60 12 C64 20 66 40 64 58 Z', HL, C.ink, 1.4))), circle(60, 60, 50, 'none', null)),
    circle(60, 60, 9, C.white, C.ink, 1.6), path('M57 57 L60 54 L63 57', 'none', C.ink, 1)),
  'aviat.propellerflygplan': all(bg(), clouds([22, 98, 1], [100, 104, 0.8]), g('translate(56 58) scale(1.1)', path('M-40 -2 L-48 -18 L-40 -18 L-30 -3 Z', TAIL, C.ink, 1.3), path('M-44 -2 C-30 -6 20 -8 34 -6 C42 -4 42 4 34 5 L-30 5 C-38 4 -44 1 -44 -2 Z', BODY, C.ink, 1.5),
      ...range(6).map((i) => circle(-22 + i * 7, -2, 1.2, CABW, null)), path('M30 -5 L36 -4 L38 -1 L32 -1 Z', WIN, null), rect(-12, -12, 34, 4, WINGC, 2, C.ink, 1.2), rect(4, -10, 10, 8, '#dfe3e7', 3, C.ink, 1), ellipse(15, -6, 1.6, 13, 'rgba(228,87,46,.45)', HL, 1.6))),
  'aviat.kolvmotor': all(bg('#eef4f8'), rect(16, 30, 40, 74, '#c9ced4', 4, C.ink, 1.8), rect(22, 36, 28, 56, '#f6f2ea', 2, null),
    moving('aviatkolv', '0%,100%{transform:translate(0,0)}50%{transform:translate(0,22px)}', { dur: 1.2 }, rect(22, 42, 28, 14, HL, 2, C.ink, 1.6), line('M36 56 L36 80', STEEL2, 4)),
    circle(36, 96, 8, DARKM, C.ink, 1.2), line('M44 96 L90 96', STEEL2, 4), g('translate(96 96)', waSpin('aviatkolv2', 1.2, path('M-3 0 L-1 -40 L1 -40 L3 0 L1 40 L-1 40 Z', '#7a838d', C.ink, 1.2), circle(0, 0, 41, 'none', null)), circle(0, 0, 5, C.white, C.ink, 1.2)), frame(10, 24, 52, 86)),
  'aviat.turbopropmotor': all(bg('#eef4f8'), g('translate(66 60)', path('M-40 -18 C-30 -22 30 -22 40 -14 L44 0 L40 14 C30 22 -30 22 -40 18 Z', '#e3e7eb', C.ink, 1.8), ...range(4).map((i) => line(`M${-24 + i * 5} -12 L${-24 + i * 5} 12`, STEEL2, 2.4)),
      rect(-4, -9, 12, 18, '#f3d9c4', 2, C.ink, 1), rect(12, -12, 18, 24, HL, 3, C.ink, 1.6), ...range(3).map((i) => line(`M${15 + i * 6} -10 L${15 + i * 6} 10`, C.white, 2)), path('M30 10 L48 18 L48 24 L30 16 Z', DARKM, C.ink, 1), line('M-40 0 L-52 0', STEEL2, 4)),
    ellipse(14, 60, 3, 40, 'rgba(90,93,104,.35)', C.ink, 1.4), circle(14, 60, 5, C.white, C.ink, 1.2), ring(87, 60, 18)),
  'aviat.småflygplan': all(bg(), grass(96), smallPlane(62, 82, 1.2), person(18, C.navy, { s: 0.5 }), person(104, C.orange, { s: 0.5 })),
  'aviat.flyga.3': all(bg('#cfe6fb'), moving('aviatflyga', '0%{transform:translate(30px,0)}100%{transform:translate(-30px,0)}', { dur: 3.6 }, clouds([30, 30, 1], [100, 86, 1.1], [150, 40, 1], [70, 104, 0.8])),
    path('M14 58 C24 30 70 24 106 40 L106 104 L14 104 Z', '#3a3a44', C.ink, 1.6), path('M24 60 C32 38 66 34 96 44 L96 64 L24 64 Z', '#bfe3f5', C.ink, 1.4),
    headSide(56, 74, 1.4), rect(42, 88, 30, 18, C.navy, 6, C.ink, 1.4), line('M80 104 L80 86', C.ink, 3), circle(80, 84, 4, HL, C.ink, 1.2), line('M64 94 L78 86', C.navy, 5), circle(79, 86, 3.6, C.skin, C.ink, 1)),
  'aviat.flygklubb': all(bg(), grass(92), house(90, 92, 1), windsock(108, 70, 0.9), smallPlane(40, 86, 0.9, { col: C.navy }), person(30, C.green, { s: 0.45 }), person(52, C.orange, { s: 0.45 }), person(68, C.purple, { s: 0.45 }), frame(4, 50, 112, 66)),
  'aviat.flygcertifikat': all(bg('#eef1f4'), rect(14, 26, 92, 62, '#f8f3e3', 6, C.ink, 2), rect(22, 36, 24, 30, '#dfe3e7', 2, C.ink, 1.2), circle(34, 46, 6, C.skin, C.ink, 1.2), path('M26 64 C26 56 42 56 42 64 Z', C.navy, C.ink, 1),
    ...range(3).map((i) => line(`M54 ${42 + i * 8} L96 ${42 + i * 8}`, C.grey2, 2)), T(70, 82, '45', 10, C.ink), g('translate(88 76)', smallPlane(0, 0, 0.32, { noGear: true })), tick(98, 30, 1.6),
    g('translate(60 102)', path('M-30 0 C-22 -6 -12 -6 -6 -2 L6 -2 C12 -6 22 -6 30 0 C22 2 12 2 6 1 L-6 1 C-12 2 -22 2 -30 0 Z', C.gold, C.ink, 1.2), circle(0, 0, 4, HL, C.ink, 1))),
  'aviat.flygfält': all(rect(0, 0, 120, 120, FOREST, 0, null), ...range(14).map((i) => circle(f1(4 + ((i * 43) % 112)), f1(4 + ((i * 31) % 112)), 5, '#4c8448', null)), path('M8 30 L112 22 L114 98 L6 104 Z', GRASS, C.ink, 1.2),
    path('M14 78 L108 46 L110 54 L16 86 Z', '#cfe6b8', C.ink, 1.2), rect(22, 34, 16, 12, '#9aa3ad', 1, C.ink, 1), g('translate(78 62) rotate(-19)', planeTop(0, 0, 0.18, {})), windsock(96, 86, 0.6), frame(6, 20, 110, 86)),
  'aviat.landningsbana': all(bg(), rect(0, 70, 120, 50, GRASS, 0, null), path('M44 70 L76 70 L112 120 L8 120 Z', ASPH, C.ink, 1.4), ...range(3).map((i) => line(`M60 ${73 + i * 7} L60 ${77 + i * 7}`, C.white, 1.4 + i * 0.5)),
    ...range(6).map((i) => rect(22 + i * 13, 108, 8, 10, C.white, 0, null)), T(60, 103, '21', 10, C.white), ...range(4).map((i) => all(circle(f1(44 - i * 9), 70 + i * 13, 1.8, HL, null), circle(f1(76 + i * 9), 70 + i * 13, 1.8, HL, null))),
    g('translate(60 34)', planeSide(0, 0, 0.32, { gear: true })), clouds([18, 22, 0.8])),
  'aviat.taxa': all(bg(), rect(0, 96, 120, 24, ASPH, 0, null), line('M0 104 L120 104', C.yellow, 2.4), moving('aviattaxa', '0%{transform:translate(-30px,0)}100%{transform:translate(10px,0)}', { dur: 4.2 }, planeSide(52, 82, 0.82, { gear: true })),
    g('translate(104 108)', rect(-12, -20, 24, 12, C.yellow, 1, C.ink, 1.2), arrow(-6, -14, 6, -14, C.ink, 2), line('M-8 -8 L-8 0 M8 -8 L8 0', C.ink, 1.6)), line('M10 90 L22 90 M6 86 L18 86', C.grey, 1.6)),
  'aviat.sjöflygplan': all(bg(), rect(0, 74, 120, 46, '#7ab6d9', 0, null), path('M0 74 L18 66 L40 72 L60 64 L84 72 L120 66 L120 74 Z', FOREST, null), tree(14, 64, 0.6), tree(96, 62, 0.7), tree(106, 64, 0.5),
    waBob('aviatsjo', 2, smallPlane(60, 76, 1.2, { float: true, col: '#e4c13c' })), ...[88, 98, 108].map((y, i) => line(`M${10 + i * 6} ${y} q6 -3 12 0 q6 3 12 0 M${70 - i * 4} ${y} q6 -3 12 0 q6 3 12 0`, C.white, 1.4))),
  'aviat.helikopter': all(bg(), clouds([22, 100, 1]), g('translate(64 64)', path('M-14 -12 C-6 -18 14 -16 20 -6 C24 4 18 12 8 12 L-14 12 C-22 12 -22 -6 -14 -12 Z', RED, C.ink, 1.6), path('M2 -12 C12 -12 18 -6 19 2 L4 2 Z', CABW, C.ink, 1.1),
      path('M-18 -4 L-52 -6 L-52 -2 L-18 4 Z', RED, C.ink, 1.4), waSpin('aviatheli2', 0.6, line('M-52 -14 L-52 6', C.ink, 2.2), circle(-52, -4, 10, 'none', null)), line('M-12 12 L-14 22 M8 12 L10 22 M-22 22 L20 22', C.ink, 2.2), rect(-2, -20, 4, 8, DARKM, 1, C.ink, 1),
      moving('aviatheli', '0%,100%{transform:scale(1,1)}50%{transform:scale(-1,1)}', { dur: 0.5, spin: true }, line('M-46 -21 L46 -19', C.ink, 3.4), circle(0, -20, 1, 'none', null)))),
  'aviat.konstflygning': all(bg(), circle(60, 50, 32, 'none', '#ffffff', 5), circle(60, 50, 32, 'none', C.grey2, 1.4, ), path('M0 92 L28 84 L60 90 L92 82 L120 90 L120 120 L0 120 Z', GRASS, null),
    pivot('aviatkonst', '0%{transform:rotate(0)}100%{transform:rotate(-360deg)}', 3.2, 60, 50, 40, g('translate(60 18) rotate(180)', smallPlane(0, 0, 0.5, { noGear: true, col: HL }))),
    ...range(7).map((i) => all(circle(10 + i * 16, 104, 4, C.skin, C.ink, 1), rect(5 + i * 16, 108, 10, 8, [C.navy, C.green, C.orange, C.purple][i % 4]!, 3, C.ink, 1)))),

  // ── 4245 Flygplansinstrument ──
  'aviat.simulator': all(rect(0, 0, 120, 120, '#e3e7eb', 0, null), rect(0, 104, 120, 16, '#b8c0c8', 0, null), line('M34 104 L44 86 M86 104 L76 86 M60 104 L60 86', DARKM, 4),
    path('M18 86 L20 30 C30 16 90 16 100 30 L102 86 Z', C.white, C.ink, 2), path('M30 40 C40 30 80 30 90 40 L90 62 L30 62 Z', '#5aa7e0', C.ink, 1.4), path('M30 54 L90 50 L90 62 L30 62 Z', '#a0673d', null), clouds([50, 44, 0.5]),
    headBack(60, 74, 0.9, true), rect(14, 84, 92, 6, DARKM, 2, C.ink, 1.2), frame(12, 14, 96, 80)),
  'aviat.instrumentpanel': all(rect(0, 0, 120, 120, '#3a3a44', 0, null), path('M6 6 L114 6 L108 32 L12 32 Z', '#bfe3f5', C.ink, 1.6), rect(6, 36, 108, 72, PANEL, 6, C.ink, 1.6),
    ...[[24, 56], [60, 56], [96, 56], [24, 88], [96, 88]].map(([x, y], i) => dial(x!, y!, 11, needle(x!, y!, 9, [40, -60, 120, 200, 80][i]!))), rect(46, 76, 28, 24, '#1f3550', 3, '#5a7a9a', 1.2), line('M50 92 L56 86 L62 90 L70 80', GLOW, 1.6), frame(3, 33, 114, 78)),
  'aviat.flyghöjd': all(bg(), rect(0, 100, 120, 20, GRASS, 0, null), house(24, 100, 0.6), tree(44, 96, 0.6), clouds([30, 64, 0.9], [98, 74, 0.8]), planeSide(80, 22, 0.42), line('M80 30 L80 98', HL, 3), path('M74 34 L80 26 L86 34 Z M74 94 L80 102 L86 94 Z', HL, null), line('M70 100 L90 100', HL, 2)),
  'aviat.höjdmätare': all(bg('#3a3a44'), dial(60, 60, 42, all(ticks(60, 60, 42, 10), ...range(10).map((i) => T(f1(60 + Math.sin(rad(i * 36)) * 28), f1(64 - Math.cos(rad(i * 36)) * 28), String(i), 9, C.white)),
      g('translate(60 78) scale(0.9)', path('M-14 6 L-4 -8 L2 0 L6 -4 L14 6 Z', '#7a838d', null)), needle(60, 60, 34, 72, C.white), needle(60, 60, 20, 300, HL))), circle(60, 60, 45, 'none', HL, 2.6)),
  'aviat.knop.2': all(bg('#eef4f8'), rect(0, 90, 120, 30, '#7ab6d9', 0, null), g('translate(60 92)', path('M-26 -2 L26 -2 L20 10 L-22 10 Z', C.white, C.ink, 1.5), rect(-12, -12, 20, 10, '#dfe3e7', 1, C.ink, 1.2), line('M-4 -12 L-4 -24', C.ink, 1.4)),
    waIn('aviatknop', -24, 0, arrow(14, 70, 106, 70, HL, 3)), line('M14 64 L14 76 M106 64 L106 76', HL, 2), T(60, 62, '1852', 12, C.ink), g('translate(26 28)', circle(0, 0, 14, C.white, C.ink, 1.6), ticks(0, 0, 14, 12), line('M0 0 L0 -10', C.ink, 2), line('M0 0 L0 -7', C.ink, 2), circle(0, 0, 1.6, C.ink, null)),
    T(26, 52, '1', 10, C.ink), g('translate(92 30)', planeSide(0, 0, 0.3))),
  'aviat.konstgjord-horisont': all(bg('#3a3a44'), circle(60, 60, 46, '#3a3a44', C.ink, 1.4), g('translate(60 60)', waSway('aviathori', 14, g('rotate(-16)', path('M-42 0 A42 42 0 0 1 42 0 Z', '#5aa7e0', null), path('M-42 0 A42 42 0 0 0 42 0 Z', '#a0673d', null), line('M-42 0 L42 0', C.white, 2), ...[-12, -24].map((y) => line(`M-8 ${y} L8 ${y}`, C.white, 1.4)), ...[12, 24].map((y) => line(`M-8 ${y} L8 ${y}`, C.white, 1.4)))),
      path('M-26 0 L-8 0 L0 6 L8 0 L26 0', 'none', C.ink, 6), path('M-26 0 L-8 0 L0 6 L8 0 L26 0', 'none', HL, 3.6), circle(0, 0, 2.4, HL, null)), circle(60, 60, 44, 'none', '#1f2430', 4)),
  'aviat.bränslemätare': all(bg('#3a3a44'), dial(60, 64, 40, all(path('M26 64 A34 34 0 0 1 94 64', 'none', '#5a5d68', 4), path('M26 64 A34 34 0 0 1 32 46', 'none', RED, 4), ticks(60, 64, 40, 5, -90, 90), drop(60, 84, 1.1), needle(60, 64, 30, 0, FUEL))),
    g('translate(60 18)', rect(-20, -8, 40, 16, '#dfe3e7', 4, C.ink, 1.4), rect(-20, 0, 20, 8, FUEL, 0, null), rect(-20, -8, 40, 16, 'none', 4, C.ink, 1.4))),
  'aviat.styrspak': all(rect(0, 0, 120, 120, '#3a3a44', 0, null), rect(30, 92, 60, 20, PANEL, 6, C.ink, 1.6), waSway('aviatspak', 10, line('M60 100 L60 44', C.ink, 9), line('M60 100 L60 44', HL, 6), rect(50, 26, 20, 26, HL, 7, C.ink, 1.8), circle(56, 32, 2.4, RED, null),
      path('M48 42 C40 40 40 50 48 50 Z', C.skin, C.ink, 1.2), path('M72 42 C78 42 78 50 70 50', 'none', C.ink, 1.2)), arrow(88, 40, 88, 22, C.white, 2.4), arrow(88, 54, 88, 72, C.white, 2.4)),
  'aviat.gasreglage': all(rect(0, 0, 120, 120, '#3a3a44', 0, null), path('M20 112 L28 48 L92 48 L100 112 Z', PANEL, C.ink, 1.6), line('M44 104 L48 58 M76 104 L72 58', '#5a5d68', 4),
    moving('aviatgas', '0%,15%{transform:translate(0,22px)}60%,100%{transform:translate(0,0)}', { dur: 2.6 }, line('M48 76 L48 50', STEEL2, 4), line('M72 76 L72 50', STEEL2, 4), rect(40, 40, 40, 12, HL, 5, C.ink, 1.6), path('M38 30 C40 22 80 22 82 30 L82 42 L38 42 Z', C.skin, C.ink, 1.4)),
    arrow(104, 92, 104, 64, C.white, 2.4)),
  'aviat.instrumentflygning': all(rect(0, 0, 120, 120, '#3a3a44', 0, null), path('M6 8 L114 8 L106 50 L14 50 Z', '#c9ced4', C.ink, 1.6), moving('aviatifr', '0%{transform:translate(20px,0)}100%{transform:translate(-20px,0)}', { dur: 3 }, cloud(30, 26, 1.2, '#e3e7eb'), cloud(84, 32, 1.4, '#e3e7eb')),
    rect(8, 54, 104, 30, PANEL, 4, C.ink, 1.4), ...[30, 60, 90].map((x, i) => all(circle(x, 69, 10, '#1f2430', HL, 2), needle(x, 69, 8, [20, 70, -40][i]!))), headBack(60, 98, 1.2, true)),

  // ── 4246 Navigationssystem ──
  'aviat.navigation': all(bg('#eef4f8'), rect(10, 34, 78, 76, '#f8f3e3', 3, C.ink, 1.6), path('M10 60 C30 50 40 74 60 66 C70 62 80 70 88 64', 'none', '#7ab6d9', 6), line('M22 96 C34 70 56 58 76 44', HL, 2.6, '5 4'), circle(22, 96, 4, C.white, C.ink, 1.4),
    path('M76 36 C72 36 70 39 70 42 C70 47 76 52 76 52 C76 52 82 47 82 42 C82 39 80 36 76 36 Z', HL, C.ink, 1.3), g('translate(100 28)', circle(0, 0, 14, C.white, C.ink, 1.4), path('M0 -12 L4 0 L0 12 L-4 0 Z', '#c9ced4', C.ink, 1), path('M0 -12 L4 0 L-4 0 Z', RED, C.ink, 1)),
    g('translate(24 18)', rect(-5, -4, 10, 8, '#c9ced4', 1, C.ink, 1), rect(-15, -2, 9, 4, '#3a6ab0', 0.5, C.ink, 0.8), rect(6, -2, 9, 4, '#3a6ab0', 0.5, C.ink, 0.8))),
  'aviat.kurs.2': all(bg('#eef4f8'), circle(60, 62, 46, C.white, C.ink, 1.6), ticks(60, 62, 46, 36), ...[0, 90, 180, 270].map((d) => line(`M${f1(60 + Math.sin(rad(d)) * 30)} ${f1(62 - Math.cos(rad(d)) * 30)} L${f1(60 + Math.sin(rad(d)) * 44)} ${f1(62 - Math.cos(rad(d)) * 44)}`, C.ink, 2.4)),
    T(60, 38, '0', 8), T(84, 65, '90', 8), T(60, 92, '180', 8), T(36, 65, '270', 8), g('translate(60 62) rotate(60)', line('M0 0 L0 -40', HL, 3.4), path('M-6 -36 L0 -46 L6 -36 Z', HL, null), planeTop(0, 0, 0.26))),
  'aviat.flygrutt': all(bg('#9fcbe8'), path('M0 64 C14 50 30 64 40 54 C50 44 46 30 60 26 L60 0 L0 0 Z', '#bfdca6', C.ink, 1.2), path('M120 70 C100 66 94 84 76 88 C66 90 64 104 70 120 L120 120 Z', '#bfdca6', C.ink, 1.2),
    path('M24 30 C50 30 80 60 96 98', 'none', HL, 3, ), line('M24 30 C50 30 80 60 96 98', C.white, 1.2, '4 4'), circle(24, 30, 4, C.white, C.ink, 1.4), circle(96, 98, 4, C.white, C.ink, 1.4), g('translate(62 46) rotate(130)', planeTop(0, 0, 0.2))),
  'aviat.färdplan': all(bg('#eef1f4'), rect(22, 10, 76, 100, '#b08a5a', 6, C.ink, 1.6), rect(28, 20, 64, 86, C.white, 2, C.ink, 1.2), rect(48, 6, 24, 10, STEEL2, 2, C.ink, 1.2),
    rect(34, 26, 52, 26, '#dceaf2', 1, C.ink, 0.8), waIn('aviatfard', -10, 6, line('M38 46 C50 30 64 40 82 30', HL, 2.2, '3 2')), circle(38, 46, 2, C.ink, null), circle(82, 30, 2, C.ink, null),
    T(46, 66, '10:30', 8, C.ink), T(74, 66, '320', 8, C.ink), ...range(4).map((i) => line(`M34 ${74 + i * 8} L86 ${74 + i * 8}`, C.grey2, 2)), frame(18, 4, 84, 110)),
  'aviat.radiofyr': all(bg(), grass(100), g('translate(46 100)', path('M-10 0 L-3 -30 L3 -30 L10 0 Z', 'none', C.ink, 2), line('M-7 -10 L7 -10 M-5 -20 L5 -20 M-7 -10 L5 -20 M7 -10 L-5 -20', C.ink, 1.2), rect(-14, -4, 28, 6, '#dfe3e7', 1, C.ink, 1.2), circle(0, -32, 3, HL, C.ink, 1.2)),
    waPulse('aviatfyr', ...[12, 22, 32].map((r) => path(`M${46 - r} ${68 - r * 0.2} A${r} ${r} 0 0 1 ${46 + r} ${68 - r * 0.2}`, 'none', HL, 2))), g('translate(94 26)', planeSide(0, 0, 0.3)), line('M84 30 L56 56', C.ink, 1.2, '3 3')),
  'aviat.transponder': all(bg(), rect(0, 100, 120, 20, GRASS, 0, null), g('translate(66 30)', planeSide(0, 0, 0.62)), rect(64, 34, 12, 8, HL, 2, C.ink, 1.4),
    g('translate(22 100)', path('M-12 -4 C-12 -24 12 -24 12 -4 Z', '#dfe3e7', C.ink, 1.4), line('M0 -4 L0 6', C.ink, 2), rect(-8, 4, 16, 6, '#9aa3ad', 1, C.ink, 1)),
    waIn('aviattr1', -10, 10, arrow(28, 80, 56, 46, C.grey, 2.2)), waIn('aviattr2', 10, -10, arrow(74, 48, 46, 84, HL, 2.6)), rect(78, 70, 36, 18, C.white, 3, HL, 2), T(96, 83, '4512', 9, C.ink)),
  'aviat.flygtrafik': all(bg(), clouds([60, 100, 1]), ...[[22, 22, 0.32, 15], [70, 18, 0.28, -10], [98, 52, 0.34, 0], [40, 60, 0.3, 160], [84, 86, 0.26, -170], [18, 92, 0.28, 10]].map(([x, y, s, r], i) =>
    waIn(`aviattraf${i}`, i % 2 ? 10 : -10, 0, g(`translate(${x} ${y}) rotate(${r})`, line('M-60 0 L-20 0', C.white, 3), planeSide(0, 0, s as number))))),
  'aviat.flygledare': all(bg('#2f3a4e'), rect(0, 86, 120, 34, '#3a3a44', 0, null), rect(52, 26, 60, 46, '#123024', 4, C.ink, 1.6), circle(82, 49, 18, 'none', '#3fae6a', 1), circle(82, 49, 9, 'none', '#3fae6a', 1), line('M82 49 L96 38', '#7ef0a0', 1.6),
    ...[[70, 40], [92, 58], [76, 60]].map(([x, y]) => all(path(`M${x} ${y! - 2} L${x! + 2} ${y} L${x} ${y! + 2} L${x! - 2} ${y} Z`, '#7ef0a0', null), line(`M${x! + 2} ${y} L${x! + 8} ${y! - 4}`, '#7ef0a0', 0.8))),
    person(28, '#5a7a9a', { r: [18, 22], ears: true }), waves(44, 42, 2, 1, C.white)),
  'aviat.kontrolltorn': all(bg(), rect(0, 100, 120, 20, GRASS, 0, null), rect(0, 106, 120, 8, ASPH, 0, null), tower(42, 1.15, '#bfe3f5'), path('M26 39 L58 39 L54 26 L30 26 Z', 'none', HL, 2.6), smallPlane(92, 100, 0.5, { col: TAIL }), clouds([96, 28, 0.8])),
  'aviat.anropa': all(bg('#cfe6fb'), path('M0 30 C14 20 40 18 56 24 L56 104 L0 104 Z', '#3a3a44', C.ink, 1.6), path('M4 34 C18 26 38 26 50 30 L50 54 L4 54 Z', '#bfe3f5', C.ink, 1.2), headSide(26, 74, 1.3),
    waIn('aviatanrop', -16, 0, waves(46, 78, 3, 1, HL)), tower(100, 0.8, '#bfe3f5')),
  'aviat.anflygning': all(bg(), rect(0, 96, 120, 24, GRASS, 0, null), path('M50 100 L120 96 L120 106 L44 112 Z', ASPH, C.ink, 1.2), ...range(4).map((i) => circle(36 - i * 8, 104 + i, 1.8, HL, null)),
    line('M4 30 L58 98', C.ink, 1.4, '5 4'), moving('aviatanfl', '0%{transform:translate(-32px,-40px)}100%{transform:translate(0,0)}', { dur: 3.4 }, g('translate(38 72) rotate(8)', planeSide(0, 0, 0.5, { gear: true })))),
  'aviat.omdirigera': all(bg('#eef4f8'), rect(8, 8, 104, 104, '#f8f3e3', 3, C.ink, 1.4), circle(30, 92, 5, C.white, C.ink, 1.4), g('translate(88 30)', circle(0, 0, 5, C.white, C.ink, 1.4), cloud(0, -2, 1.3, '#c9ced4'), cross(0, 0, 7)),
    line('M30 92 C40 60 60 44 82 34', C.grey, 1.6, '4 3'), path('M50 58 C60 66 74 76 92 84', 'none', HL, 3), path('M86 78 L94 86 L84 88 Z', HL, null), circle(96, 88, 5, C.white, C.ink, 1.4),
    waIn('aviatomd', -14, -14, g('translate(66 68) rotate(120)', planeTop(0, 0, 0.18)))),

  // ── 4247 Flygsäkerhet ──
  'aviat.flygsäkerhet': all(bg('#eef4f8'), path('M60 10 L100 24 C100 66 84 92 60 110 C36 92 20 66 20 24 Z', HL, C.ink, 2), path('M60 20 L90 31 C90 64 78 84 60 98 C42 84 30 64 30 31 Z', C.white, null),
    planeTop(60, 56, 0.42), tick(86, 92, 2.2)),
  'aviat.flygolycka': all(bg('#d8dde2'), rect(0, 92, 120, 28, '#a8c890', 0, null), g('translate(36 90) rotate(-8)', path('M-30 -10 L20 -10 L22 8 L-26 8 C-32 4 -34 -2 -30 -10 Z', BODY, C.ink, 1.6), path('M-28 -10 L-34 -30 L-26 -30 L-18 -10 Z', TAIL, C.ink, 1.3), path('M22 -10 L26 -6 L22 -2 L26 2 L22 8', 'none', C.ink, 1.4)),
    g('translate(86 96) rotate(14)', path('M-20 -10 L10 -10 C20 -10 26 -4 26 0 C24 6 16 8 8 8 L-20 8 L-16 4 L-22 0 L-16 -4 Z', BODY, C.ink, 1.6), path('M10 -7 L16 -6 L18 -3 L12 -3 Z', WIN, null)), path('M50 98 L74 82 L80 88 L58 104 Z', WINGC, C.ink, 1.2),
    puff(64, 70, 1, '#7a7f88'), puff(54, 52, 1.2, '#8d949b'), puff(70, 36, 1.3, '#a8adb4'), path('M60 86 C56 80 62 76 60 70 C66 74 68 80 64 86 Z', FLAME, C.ink, 1)),
  'aviat.haverikommission': all(bg('#eef1f4'), rect(0, 100, 120, 20, '#c9ced4', 0, null), greyed(g('translate(84 92) rotate(10)', path('M-24 -8 L16 -8 L18 8 L-20 8 Z', BODY, C.ink, 1.4), path('M16 -8 L22 0 L16 8', 'none', C.ink, 1.2))),
    person(30, C.navy, { vest: true, r: [16, 6], l: [-12, 20] }), g('translate(52 58)', circle(0, 0, 10, '#dff0fb', C.ink, 2.2), line('M7 7 L16 16', C.ink, 4)), person(104, C.dark, { vest: true, s: 0.8, l: [-14, 10], r: [10, 20] }),
    paper(84, 32, 18, 24, all(...range(3).map((i) => line(`M88 ${40 + i * 5} L98 ${40 + i * 5}`, C.grey2, 1.6)), tick(94, 52, 0.6)))),
  'aviat.svart-låda': all(bg('#eef1f4'), greyed(planeSide(60, 22, 0.5)), g('translate(60 74)', rect(-34, -18, 52, 36, HL, 4, C.ink, 2), line('M-34 -6 L18 -6 M-34 6 L18 6', C.white, 3), path('M18 -12 L34 -12 C38 -12 38 12 34 12 L18 12 Z', '#d0d4d8', C.ink, 1.6),
    ellipse(34, 0, 3, 12, '#b8c0c8', C.ink, 1), rect(-30, 18, 8, 6, C.ink, 1, null), rect(10, 18, 8, 6, C.ink, 1, null)), line('M60 34 L60 52', C.ink, 1.2, '3 3')),
  'aviat.inspektion': all(bg('#eef1f4'), g('translate(46 60)', path('M-40 -18 C-30 -22 30 -22 38 -14 L42 0 L38 14 C30 22 -30 22 -40 18 Z', '#dfe3e7', C.ink, 1.8), ...range(5).map((i) => line(`M${-26 + i * 8} -12 L${-26 + i * 8} 12`, STEEL2, 2.4))),
    g('translate(56 54)', circle(0, 0, 16, 'rgba(223,240,251,.7)', C.ink, 2.4), line('M11 11 L24 24', C.ink, 5), path('M-6 -2 L-2 3 L6 -6', 'none', C.green, 2.6)), paper(84, 70, 28, 38, all(...range(3).map((i) => all(tick(92, 80 + i * 9, 0.7), line(`M98 ${80 + i * 9} L108 ${80 + i * 9}`, C.grey2, 1.6)))))),
  'aviat.motorhaveri': all(bg(), clouds([20, 100, 0.9]), waShake('aviatmotor', g('translate(64 58)', path('M-56 -16 L56 -24 L56 -16 L-56 -8 Z', WINGC, C.ink, 1.6), g('translate(10 2)', rect(-18, -8, 32, 18, '#dfe3e7', 8, C.ink, 1.6), ellipse(14, 1, 3, 8, DARKM, C.ink, 1)))),
    moving('aviatmotor2', '0%{transform:translate(0,0) scale(.6);opacity:.9}100%{transform:translate(-26px,-10px) scale(1.3);opacity:0}', { dur: 2 }, puff(52, 62, 1, '#4a4d55')), puff(36, 56, 1.1, '#5a5d68'), puff(20, 50, 1.2, '#7a7f88'),
    burst(80, 72, 7, C.yellow), cross(98, 84, 6)),
  'aviat.fågelkollision': all(bg(), clouds([24, 102, 0.9]), planeSide(78, 64, 1, { gear: false }), waIn('aviatfagel', -30, -10, bird(108, 54, 1.1), bird(100, 46, 0.9), bird(112, 42, 0.8)), burst(110, 62, 8, C.yellow), ring(112, 62, 12)),
  'aviat.isbildning': all(bg('#d7e6f0'), airfoil(10, 70, 100, 0, '#eef1f4'), waGrow('aviatis', path('M10 70 C10 52 28 44 44 44 L46 50 C30 50 18 56 16 70 Z', ICE, ICEB, 1.6), ...[[18, 52], [28, 46], [40, 44]].map(([x, y]) => path(`M${x} ${y} l2 -6 l2 6 Z`, ICE, ICEB, 1))),
    flake(70, 20), flake(96, 34, 0.8), flake(30, 22, 0.7), flake(100, 96), flake(60, 98, 0.8)),
  'aviat.avisa': all(bg('#dfe7ee'), rect(0, 100, 120, 20, '#e9eef2', 0, null), path('M44 0 L120 30 L120 52 L50 20 Z', WINGC, C.ink, 1.6), g('translate(26 98)', rect(-22, -22, 26, 22, '#e4c13c', 3, C.ink, 1.6), rect(4, -14, 16, 14, '#e4c13c', 3, C.ink, 1.6), circle(-14, 2, 5, '#2b2b30', null), circle(12, 2, 5, '#2b2b30', null),
      line('M-6 -22 L10 -60', C.ink, 4), rect(6, -68, 14, 10, '#e4c13c', 2, C.ink, 1.4)),
    waIn('aviatavisa', -14, 14, ...[[50, 30], [58, 26], [54, 38], [64, 34], [62, 44]].map(([x, y]) => drop(x!, y!, 0.6, HL))), path('M46 34 L58 22 L70 30 L66 46 Z', 'rgba(239,138,60,.35)', null), flake(100, 70), flake(86, 84, 0.8)),
  'aviat.start.2': all(bg(), rect(0, 66, 120, 54, GRASS, 0, null), path('M50 66 L70 66 L108 120 L12 120 Z', ASPH, C.ink, 1.4), ...range(4).map((i) => line(`M60 ${70 + i * 12} L60 ${76 + i * 12}`, C.white, 1.4 + i * 0.6)),
    moving('aviatstart', '0%{transform:translate(0,40px) scale(1.6)}100%{transform:translate(0,0) scale(1)}', { dur: 3.2 }, g('translate(60 40)', path('M-34 4 L34 4 L34 6 L-34 6 Z', WINGC, C.ink, 1.2), circle(0, 4, 6, BODY, C.ink, 1.4), path('M-1 -2 L-1 -12 L1 -12 L1 -2 Z', TAIL, C.ink, 1), circle(-16, 9, 2.8, '#dfe3e7', C.ink, 0.8), circle(16, 9, 2.8, '#dfe3e7', C.ink, 0.8))),
    path('M60 64 C60 56 60 52 60 48', 'none', HL, 2, ), arrow(60, 58, 60, 50, HL, 2.6)),
  'aviat.säkerhetsgenomgång': all(rect(0, 0, 120, 120, '#e9e4da', 0, null), rect(0, 96, 120, 24, '#8a8f98', 0, null), ...[[14, 2], [106, 2]].map(([x]) => all(rect(x! - 12, 66, 24, 34, C.navy, 6, C.ink, 1.4), circle(x!, 62, 8, C.hair, C.ink, 1.2))),
    person(60, C.red, { l: [-24, 4], r: [24, 4] }), path('M48 58 L72 58 L70 82 L50 82 Z', C.yellow, C.ink, 1.6), path('M54 58 C54 52 66 52 66 58', 'none', C.ink, 1.4), line('M36 52 L36 60', C.ink, 1.4), line('M84 52 L84 60', C.ink, 1.4),
    path('M8 18 L20 18 L20 30 L8 30 Z', C.green, C.ink, 1.2), arrow(10, 24, 18, 24, C.white, 2)),
  'aviat.nödlanda': all(bg('#d8e4ee'), rect(0, 90, 120, 30, '#c9d98a', 0, null), ...range(6).map((i) => line(`M0 ${96 + i * 4} L120 ${94 + i * 4}`, '#b5c472', 1)), line('M4 26 L70 92', C.ink, 1.2, '4 4'),
    moving('aviatnod', '0%{transform:translate(-36px,-40px)}100%{transform:translate(0,0)}', { dur: 3.4 }, g('translate(70 80) rotate(10)', planeSide(0, 0, 0.62, { gear: true })), puff(44, 64, 0.7, '#7a7f88'), puff(34, 54, 0.8, '#8d949b')),
    g('translate(104 104)', rect(-10, -8, 20, 8, C.white, 2, C.ink, 1.2), waPulse('aviatnod2', rect(-3, -12, 6, 4, RED, 1, C.ink, 0.8)), circle(-5, 1, 2.4, '#2b2b30', null), circle(5, 1, 2.4, '#2b2b30', null))),
};
