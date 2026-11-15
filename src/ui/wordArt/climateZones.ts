/**
 * Natur & geografi → Väder & klimat → Klimatzoner, 2641–2647 (0.43): tropical, dry, temperate, continental,
 * polar and mountain climates and the seasons. Recurring signs: a globe with coloured latitude bands (red =
 * tropical, yellow = dry, green = temperate, blue-green = continental, white = polar), thermometers (red high,
 * blue low), a strip of twelve month boxes, sun paths over the horizon and an orange highlight on the part the
 * word names. Adjectives (tropisk, arid, tempererad, polar, nederbördsfattig, sträng) are comparisons with a
 * grey reference. Digits only; no words, no brands, no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL } from './people';
import { P, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const SKY = '#d6ecf8';
const NIGHT = '#24314f';
const SEA = '#5fa3d0';
const SEA2 = '#3c7fb0';
const LAND = '#8cc96a';
const LAND2 = '#5f9e48';
const SAND = '#e8c983';
const SAND2 = '#d4a95a';
const DRYG = '#cdb46a';
const SNOW = '#f7f8fa';
const ICE2 = '#b9def2';
const ROCK = '#9a8a78';
const WARM = '#e0603a';
const COLD = '#3c7fb0';
const RAIN = '#3f8fd0';
const TROP = '#e2684a';
const DRYZ = '#f0c94e';
const TEMP = '#7cc063';
const CONT = '#4fa39a';
const POLZ = '#f4f7fa';
const O2 = '#d64545';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const num = (x: number, y: number, n: string, size = 9, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${n}</text>`;
const rad = (d: number) => (d * Math.PI) / 180;

// ── Scenery ──────────────────────────────────────────────────────────
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const field = (y = 96, col: string = LAND) => all(rect(4, y, 112, 112 - y, col, 0, null), line(`M4 ${y} L116 ${y}`, C.ink, 1));
const sun = (x: number, y: number, r = 7) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 5.5))} ${f1(y + Math.sin(a) * (r + 5.5))}`, C.gold, 1.8); }), circle(x, y, r, C.yellow, C.ink, 1.2));
const moon = (x: number, y: number, r = 6) => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${x} ${y + r} A${f1(r * 0.75)} ${r} 0 1 1 ${x} ${y - r} Z`, '#f4e7a1', C.ink, 1.1);
const cloud = (x: number, y: number, s = 1, fill: string = C.white) => at(x, y, s, path('M-22 8 C-31 8 -31 -4 -20 -4 C-21 -14 -7 -18 -2 -9 C2 -21 22 -19 20 -4 C31 -5 31 8 22 8 Z', fill, C.ink, f1(1.3 / s)));
const rain = (x1: number, x2: number, y1: number, y2: number, n: number, col: string = RAIN, sw = 1.4) => all(...range(n).map((i) => { const x = x1 + ((x2 - x1) * (i + 0.5)) / n, y = y1 + ((i * 7) % Math.max(1, y2 - y1 - 6)); return line(`M${f1(x)} ${f1(y)} l-2 6`, col, sw); }));
const flake = (x: number, y: number, r = 3, col: string = '#9cc7ea') => line(`M${x - r} ${y} L${x + r} ${y} M${f1(x - r / 2)} ${f1(y - r * 0.87)} L${f1(x + r / 2)} ${f1(y + r * 0.87)} M${f1(x - r / 2)} ${f1(y + r * 0.87)} L${f1(x + r / 2)} ${f1(y - r * 0.87)}`, col, 1.3);
const palm = (x: number, y = 112, s = 1) => at(x, y, s, path('M-1.5 0 C-2 -12 0 -24 3 -34 L6 -33 C3 -24 2 -12 2.5 0 Z', C.brown, C.ink, 1), path('M4 -34 C-6 -40 -16 -36 -20 -28 C-12 -34 -4 -34 4 -34 Z M4 -34 C14 -42 24 -38 26 -30 C18 -36 10 -35 4 -34 Z M4 -34 C0 -46 8 -52 14 -50 C8 -46 6 -40 4 -34 Z M4 -34 C-6 -46 -14 -44 -16 -40 C-8 -42 -2 -40 4 -34 Z', LAND2, C.ink, 1));
const dtree = (x: number, y = 112, s = 1, col: string = LAND2) => at(x, y, s, rect(-2, -14, 4, 14, C.brown, 1, C.ink, 1), circle(0, -21, 9, col, C.ink, 1.2));
const bare = (x: number, y = 112, s = 1) => at(x, y, s, line('M0 0 L0 -26 M0 -12 L-8 -22 M0 -16 L7 -26 M0 -22 L-4 -30 M-8 -22 L-11 -26 M7 -26 L10 -29', C.brown, 2.2));
const fir = (x: number, y = 112, s = 1, col: string = '#3f7d4e', snow = false) => at(x, y, s, rect(-1.5, -6, 3, 6, C.brown, 0, null), path('M0 -30 L9 -6 L-9 -6 Z', col, C.ink, 1), snow ? path('M0 -30 L3.5 -21 L-3.5 -21 Z', SNOW, null) : '');
const cactus = (x: number, y = 112, s = 1) => at(x, y, s, path('M-4 0 L-4 -30 C-4 -36 4 -36 4 -30 L4 0 Z', '#5f9e48', C.ink, 1.2), path('M-4 -14 L-9 -14 C-12 -14 -12 -17 -12 -18 L-12 -24 C-12 -27 -8 -27 -8 -24 L-8 -18 L-4 -18', '#5f9e48', C.ink, 1.1), path('M4 -18 L9 -18 C12 -18 12 -21 12 -22 L12 -28 C12 -31 8 -31 8 -28 L8 -22 L4 -22', '#5f9e48', C.ink, 1.1), line('M-1.5 -28 l-2 -1 M1.5 -22 l2 -1 M-1.5 -14 l-2 -1 M1.5 -8 l2 -1', C.ink, 0.7));
const house = (x: number, y: number, s = 1, wall: string = '#e8d9c0', roof: string = '#b84a3a') => at(x, y, s, rect(-9, -12, 18, 12, wall, 0, C.ink, 1.1), path('M-11 -12 L0 -21 L11 -12 Z', roof, C.ink, 1.1), rect(-2.5, -7, 5, 7, C.dark, 0, null));
const dunes = (y: number, col: string = SAND) => all(path(`M4 ${y} C20 ${y - 14} 34 ${y - 14} 50 ${y} C64 ${y - 10} 80 ${y - 16} 96 ${y - 2} C104 ${y - 8} 112 ${y - 6} 116 ${y - 2} L116 112 L4 112 Z`, col, C.ink, 1.1), path(`M20 ${y - 6} C30 ${y - 9} 40 ${y - 6} 46 ${y - 1}`, 'none', SAND2, 1.2));
const cracks = (x1: number, x2: number, y: number) => line(range(Math.round((x2 - x1) / 16)).map((i) => { const x = x1 + 8 + i * 16; return `M${x} ${y + 2} l3 4 l-2 4 M${x + 3} ${y + 6} l5 1`; }).join(' '), '#9a7a44', 1);
const tuft = (x: number, y: number, col: string = LAND2) => line(`M${x - 3} ${y} l-1 -5 M${x} ${y} l0 -7 M${x + 3} ${y} l1 -5`, col, 1.4);
const mountain = (x1: number, x2: number, px: number, py: number, base = 112, col: string = ROCK, snowY = 0) => all(path(`M${x1} ${base} L${px} ${py} L${x2} ${base} Z`, col, C.ink, 1.3), snowY ? path(`M${f1(px - ((px - x1) * (snowY - py)) / (base - py))} ${snowY} L${px} ${py} L${f1(px + ((x2 - px) * (snowY - py)) / (base - py))} ${snowY} L${f1(px + 4)} ${snowY - 3} L${px} ${snowY + 2} L${f1(px - 5)} ${snowY - 3} Z`, SNOW, C.ink, 1) : '');
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const box = (x: number, y: number, w: number, h: number, col: string = HL, sw = 2.4) => rect(x, y, w, h, 'none', 3, col, sw);
/** Thermometer with the bulb at (x, y); level 0–1. */
const thermo = (x: number, y: number, level: number, col: string = C.red, s = 1) => at(x, y, s, rect(-3, -34, 6, 34, C.white, 3, C.ink, 1.2), rect(-1.4, f1(-2 - 29 * level), 2.8, f1(2 + 29 * level), col, 1, null), circle(0, 2, 5, col, C.ink, 1.2), line('M3 -28 l2.4 0 M3 -21 l2.4 0 M3 -14 l2.4 0 M3 -7 l2.4 0', C.ink, 0.8));
/** Rain gauge (glass with scale) filled 0–1. */
const gauge = (x: number, y: number, level: number) => all(rect(x - 8, y - 36, 16, 36, 'rgba(220,240,252,0.7)', 2, C.ink, 1.3), rect(x - 7, f1(y - 1 - 34 * level), 14, f1(34 * level), RAIN, 1, null), path(`M${x - 12} ${y - 42} L${x + 12} ${y - 42} L${x + 8} ${y - 36} L${x - 8} ${y - 36} Z`, C.silver, C.ink, 1.1), line(`M${x - 8} ${y - 9} l4 0 M${x - 8} ${y - 18} l4 0 M${x - 8} ${y - 27} l4 0`, C.ink, 0.8));
/** Rosette (record medal) with a number. */
const rosette = (x: number, y: number, n: string, col: string) => all(path(`M${x - 6} ${y + 6} L${x - 10} ${y + 22} L${x - 4} ${y + 18} L${x} ${y + 24} L${x + 2} ${y + 8} Z M${x + 6} ${y + 6} L${x + 10} ${y + 22} L${x + 4} ${y + 18} L${x} ${y + 24} L${x - 2} ${y + 8} Z`, col, C.ink, 1), ...range(12).map((i) => { const a = (i / 12) * Math.PI * 2; return circle(f1(x + Math.cos(a) * 11), f1(y + Math.sin(a) * 11), 3.6, C.gold, C.ink, 0.8); }), circle(x, y, 11, C.yellow, C.ink, 1.2), num(x, y + 3.5, n, n.length > 3 ? 7 : 9));
/** Twelve month boxes; `on` lists the highlighted months (0 = January). */
const months = (y: number, on: number[], colOn: string, colOff: string = C.white, x0 = 10, w = 8.4) => all(...range(12).map((i) => rect(f1(x0 + i * w), y, f1(w - 1.2), 9, on.includes(i) ? colOn : colOff, 1.5, C.ink, 0.9)), box(f1(x0 + Math.min(...on) * w - 1.6), y - 2, f1((Math.max(...on) - Math.min(...on) + 1) * w + 2), 13));
/** Globe with latitude band helpers. */
const globeBase = (cx: number, cy: number, r: number, col: string = SEA) => circle(cx, cy, r, col, C.ink, 1.5);
const latY = (cy: number, r: number, lat: number) => f1(cy - r * Math.sin(rad(lat)));
const latW = (r: number, lat: number) => f1(r * Math.cos(rad(lat)));
const band = (cx: number, cy: number, r: number, a: number, b: number, col: string, stroke: string | null = null, sw = 2.6) => {
  const ya = latY(cy, r, a), yb = latY(cy, r, b), wa = latW(r, a), wb = latW(r, b);
  return path(`M${f1(cx - wa)} ${ya} A${r} ${r} 0 0 1 ${f1(cx - wb)} ${yb} L${f1(cx + wb)} ${yb} A${r} ${r} 0 0 1 ${f1(cx + wa)} ${ya} Z`, col, stroke, sw);
};
const cap = (cx: number, cy: number, r: number, lat: number, col: string, north = true) => {
  const y = north ? latY(cy, r, lat) : latY(cy, r, -lat), w = latW(r, lat);
  return path(`M${f1(cx - w)} ${y} A${r} ${r} 0 0 ${north ? 1 : 0} ${f1(cx + w)} ${y} Z`, col, null);
};
const latLine = (cx: number, cy: number, r: number, lat: number, col: string = C.ink, sw = 1, dash?: string) => line(`M${f1(cx - latW(r, lat))} ${latY(cy, r, lat)} L${f1(cx + latW(r, lat))} ${latY(cy, r, lat)}`, col, sw, dash);
/** Globe in climate colours. */
const zoneGlobe = (cx: number, cy: number, r: number) => all(globeBase(cx, cy, r), band(cx, cy, r, -23, 23, TROP), band(cx, cy, r, 23, 35, DRYZ), band(cx, cy, r, -35, -23, DRYZ), band(cx, cy, r, 35, 50, TEMP), band(cx, cy, r, -50, -35, TEMP), band(cx, cy, r, 50, 66, CONT), cap(cx, cy, r, 66, POLZ), cap(cx, cy, r, 66, POLZ, false), circle(cx, cy, r, 'none', C.ink, 1.5));
/** A tilted earth with its axis (deg from vertical). */
const tiltedEarth = (cx: number, cy: number, r: number, tilt: number, axisCol: string = C.ink, axisW = 1.6) => g(`rotate(${tilt} ${cx} ${cy})`, globeBase(cx, cy, r), cap(cx, cy, r, 66, SNOW), cap(cx, cy, r, 66, SNOW, false), latLine(cx, cy, r, 0, C.ink, 0.9, '3 2'), circle(cx, cy, r, 'none', C.ink, 1.5), line(`M${cx} ${cy - r - 10} L${cx} ${cy + r + 10}`, axisCol, axisW));
/** Sun path over the horizon from x1 to x2, peaking at height h above y. */
const sunPath = (x1: number, x2: number, y: number, h: number, col: string = C.gold, sw = 1.6) => line(`M${x1} ${y} Q${f1((x1 + x2) / 2)} ${f1(y - 2 * h)} ${x2} ${y}`, col, sw, '3 2');
/** Analogue clock. */
const clock = (x: number, y: number, r: number, hour: number, minute = 0) => {
  const ha = rad((hour % 12) * 30 + minute * 0.5 - 90), ma = rad(minute * 6 - 90);
  return all(circle(x, y, r, C.white, C.ink, 1.3), ...range(12).map((i) => { const a = rad(i * 30); return line(`M${f1(x + Math.cos(a) * r * 0.8)} ${f1(y + Math.sin(a) * r * 0.8)} L${f1(x + Math.cos(a) * r * 0.92)} ${f1(y + Math.sin(a) * r * 0.92)}`, C.ink, 0.8); }), line(`M${x} ${y} L${f1(x + Math.cos(ha) * r * 0.5)} ${f1(y + Math.sin(ha) * r * 0.5)}`, C.ink, 1.6), line(`M${x} ${y} L${f1(x + Math.cos(ma) * r * 0.75)} ${f1(y + Math.sin(ma) * r * 0.75)}`, C.ink, 1.1));
};
/** Day/night disc: share of day (0–1), day half on top. */
const dayDisc = (x: number, y: number, r: number, day = 0.5) => {
  const ang = Math.PI * day; // day sector centred at the top
  const s = -Math.PI / 2 - ang, e = -Math.PI / 2 + ang;
  const P1 = `${f1(x + Math.cos(s) * r)} ${f1(y + Math.sin(s) * r)}`, P2 = `${f1(x + Math.cos(e) * r)} ${f1(y + Math.sin(e) * r)}`;
  return all(circle(x, y, r, NIGHT, C.ink, 1.3), path(`M${x} ${y} L${P1} A${r} ${r} 0 ${day > 0.5 ? 1 : 0} 1 ${P2} Z`, C.yellow, C.ink, 1.1), sun(x, f1(y - r * 0.55), 3), moon(x, f1(y + r * 0.55), 3));
};
const leaf = (x: number, y: number, rot: number, col: string = C.orange) => g(`translate(${x} ${y}) rotate(${rot})`, path('M0 -4 C3 -2 3 2 0 4 C-3 2 -3 -2 0 -4 Z', col, C.ink, 0.7));
const tulip = (x: number, y = 112, col: string = C.red) => all(line(`M${x} ${y} L${x} ${y - 14}`, LAND2, 1.6), path(`M${x - 2} ${y - 6} C${x - 8} ${y - 8} ${x - 6} ${y - 12} ${x} ${y - 8}`, LAND2, C.ink, 0.6), path(`M${x - 4} ${y - 14} L${x - 4} ${y - 20} L${x - 1.5} ${y - 17} L${x} ${y - 21} L${x + 1.5} ${y - 17} L${x + 4} ${y - 20} L${x + 4} ${y - 14} C${x + 4} ${y - 11} ${x - 4} ${y - 11} ${x - 4} ${y - 14} Z`, col, C.ink, 0.9));
const o2 = (x: number, y: number) => all(circle(x - 2.6, y, 3, O2, C.ink, 0.8), circle(x + 2.6, y, 3, O2, C.ink, 0.8));
const bear = (x: number, y: number, s = 1, col: string = SNOW) => at(x, y, s, path('M-22 0 L-22 -8 C-24 -16 -14 -20 -4 -18 C6 -20 14 -18 18 -14 L26 -16 C30 -16 32 -12 30 -10 L24 -6 L20 0 L14 0 L14 -6 L2 -6 L0 0 L-6 0 L-8 -6 L-14 -6 L-14 0 Z', col, C.ink, 1.3), circle(27, -13.5, 0.9, C.ink, null), circle(30.6, -11, 0.9, C.ink, null), path('M22 -17 C22 -20 25 -20 25 -17', col, C.ink, 1));
const pineapple = (x: number, y = 112, s = 1) => at(x, y, s, ellipse(0, -8, 6, 8, C.yellow, C.ink, 1.1), line('M-4 -13 L4 -3 M-5 -6 L1 -15 M4 -13 L-4 -3 M5 -6 L-1 -15', '#b88a20', 0.8), path('M0 -16 L-5 -26 L-1 -20 L0 -28 L1 -20 L5 -26 Z', LAND2, C.ink, 0.9));
const parrot = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 C-6 -2 -7 -10 -2 -13 C2 -15 6 -12 5 -8 L4 2 L1 12 L-2 12 Z', C.red, C.ink, 1), path('M-3 -4 C-8 0 -6 8 0 8 Z', '#3f8fd0', C.ink, 0.8), path('M5 -10 L9 -8 L5 -6 Z', C.yellow, C.ink, 0.8), circle(1.5, -10, 1, C.ink, null));
const penguin = (x: number, y = 112, s = 1) => at(x, y, s, ellipse(0, -11, 6, 11, C.black, C.ink, 1), ellipse(0, -9, 3.8, 8, C.white, null), circle(0, -21, 4.6, C.black, C.ink, 1), circle(-1.4, -21.6, 0.9, C.white, null), circle(1.4, -21.6, 0.9, C.white, null), path('M-1.2 -19.6 L1.2 -19.6 L0 -17.6 Z', C.orange, null), path('M-3 0 L-1 -1 L-1 1 Z M1 1 L1 -1 L3 0 Z', C.orange, C.ink, 0.6));
const dove = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 0, 8, 5, '#b8bec6', C.ink, 1), circle(7, -4, 3.4, '#b8bec6', C.ink, 1), path('M10 -4 L13 -3 L10 -2 Z', C.orange, null), path('M-2 -2 C-4 -9 2 -10 4 -3 Z', '#9aa3ad', C.ink, 0.8), line('M-2 5 L-2 8 M2 5 L2 8', C.ink, 1));
const icicles = (x1: number, x2: number, y: number) => all(...range(Math.round((x2 - x1) / 7)).map((i) => path(`M${x1 + i * 7} ${y} L${x1 + i * 7 + 5} ${y} L${f1(x1 + i * 7 + 2.5)} ${y + 6 + (i % 3) * 4} Z`, ICE2, C.ink, 0.7)));

const floe = (x: number, y: number, w: number, h: number) => path(`M${x} ${y} l${f1(w * 0.3)} ${f1(-h * 0.4)} l${f1(w * 0.45)} ${f1(-h * 0.1)} l${f1(w * 0.25)} ${f1(h * 0.5)} l${f1(-w * 0.2)} ${f1(h * 0.5)} l${f1(-w * 0.6)} ${f1(h * 0.1)} Z`, SNOW, C.ink, 1.1);
const arc = (x: number, y: number, r: number, a0: number, a1: number, col: string = HL, sw = 2.4) => line(`M${f1(x + Math.cos(rad(a0)) * r)} ${f1(y - Math.sin(rad(a0)) * r)} A${r} ${r} 0 0 0 ${f1(x + Math.cos(rad(a1)) * r)} ${f1(y - Math.sin(rad(a1)) * r)}`, col, sw);

// ── Shared scenes ────────────────────────────────────────────────────
const equinox = (spring: boolean) => all(bg(), field(100, spring ? LAND : '#b9a35a'), dayDisc(60, 44, 26, 0.5), line('M32 44 L88 44', HL, 2.6), spring ? all(tulip(20, 106), tulip(30, 108, C.yellow), tulip(96, 106, C.pink), dtree(106, 106, 0.7, '#b6dc8a')) : all(bare(20, 104, 0.9), leaf(28, 70, 20), leaf(14, 84, -30, C.red), leaf(30, 92, 60, C.gold), dtree(100, 106, 0.8, C.orange), leaf(92, 92, 40), leaf(108, 98, -20, C.red)));
const solstice = (summer: boolean, hl: boolean) => all(bg(summer ? SKY : '#cdd9e6'), field(96, summer ? LAND : SNOW), sunPath(10, 110, 96, summer ? 34 : 12, hl ? HL : C.grey, hl ? 2.2 : 1.4), sun(60, summer ? 34 : 78, summer ? 7 : 5));

export const CLIMATE_ZONE_MOTIFS: Record<string, Svg> = {
  // 2641 Tropiskt klimat
  'klimz.klimatzon': all(bg(), zoneGlobe(60, 60, 44), band(60, 60, 44, 35, 50, 'none', HL, 3), band(60, 60, 44, -50, -35, 'none', HL, 3)),
  'klimz.tropisk': all(bg('#eef1f4'), globeBase(60, 34, 28), band(60, 34, 28, -23.4, 23.4, TROP), circle(60, 34, 28, 'none', C.ink, 1.5), band(60, 34, 28, -23.4, 23.4, 'none', HL, 3), arrow(60, 46, 60, 66, HL, 2.2), greyed(fir(104, 110, 1.2)), rect(8, 70, 80, 40, '#fbe6c8', 3, null), palm(26, 110, 0.95), parrot(36, 84, 0.8), pineapple(56, 110, 1.1), pineapple(74, 110, 0.8), box(8, 70, 80, 40)),
  'klimz.vändkrets': all(bg(), globeBase(60, 60, 44), band(60, 60, 44, -23.4, 23.4, '#f3b49a'), latLine(60, 60, 44, 0, C.grey, 1.2, '3 2'), latLine(60, 60, 44, 23.4, HL, 2.6), latLine(60, 60, 44, -23.4, HL, 2.6), circle(60, 60, 44, 'none', C.ink, 1.5), sun(104, f1(latY(60, 44, 23.4) - 14), 5), arrow(98, f1(latY(60, 44, 23.4) - 8), 86, f1(latY(60, 44, 23.4) - 2), C.gold, 2)),
  'klimz.medeltemperatur': all(bg('#f6f2ea'), line('M10 100 L110 100', C.ink, 1.2), ...[22, 30, 44, 58, 70, 78, 82, 76, 62, 46, 32, 24].map((h, i) => rect(12 + i * 8, 100 - h * 0.9, 6, h * 0.9, h > 52 ? WARM : COLD, 1, C.ink, 0.7)), line('M8 54 L112 54', HL, 2.6, '5 3'), thermo(104, 46, 0.5, HL, 0.6)),
  'klimz.regntid': all(bg('#b9c4cf'), cloud(40, 20, 0.9, '#8a96a4'), cloud(86, 24, 0.8, '#8a96a4'), rain(12, 112, 30, 70, 18, RAIN, 1.6), field(84, '#4f9d3a'), palm(30, 90, 0.9), palm(90, 90, 0.7), ellipse(64, 92, 16, 3, SEA, C.ink, 0.8), months(100, [5, 6, 7, 8], RAIN)),
  'klimz.torrtid': all(bg('#fbe6c8'), sun(90, 22, 8), field(84, DRYG), cracks(10, 110, 86), palm(30, 90, 0.8), tuft(56, 90, '#a88a3a'), tuft(74, 92, '#a88a3a'), months(100, [0, 1, 2, 3], SAND2)),
  // 2642 Torrt och aridt klimat
  'klimz.arid': all(bg('#eef1f4'), greyed(field(98, LAND), dtree(18, 100, 0.9), gauge(44, 106, 0.7), ...range(12).map((i) => { const a = rad(i * 30); return path(`M${f1(30 + Math.cos(a) * 14)} ${f1(30 + Math.sin(a) * 14 - 3)} l2 4 a2 2 0 1 1 -4 0 Z`, RAIN, C.ink, 0.6); })), line('M60 10 L60 110', C.grey2, 1.4, '3 3'), rect(62, 6, 52, 104, '#fbe6c8', 2, null), rect(62, 94, 52, 16, SAND, 0, null), cracks(62, 114, 96), ...range(12).map((i) => { const a = rad(i * 30); return circle(f1(88 + Math.cos(a) * 14), f1(30 + Math.sin(a) * 14), 3, C.white, C.ink, 0.8); }), sun(88, 30, 5), gauge(100, 104, 0), tuft(74, 98, '#a88a3a'), box(62, 6, 52, 104)),
  'klimz.ökenklimat': all(bg('#fbe2b4'), sun(88, 22, 9), cloud(32, 22, 0.5), line('M22 22 L42 22', C.red, 2.2), circle(32, 22, 12, 'none', C.red, 2.2), dunes(88), thermo(104, 102, 0.95, C.red, 0.7)),
  'klimz.halvöken': all(bg('#f6e6c4'), sun(96, 20, 7), rect(4, 80, 112, 32, '#d8c07c', 0, null), line('M4 80 L116 80', C.ink, 1), path('M70 80 C80 72 92 72 100 80 C106 74 112 76 116 80 Z', SAND, C.ink, 1), ...[[14, 92], [30, 100], [46, 88], [58, 104], [74, 94], [92, 102], [106, 92]].map(([x, y]) => tuft(x!, y!, '#7a9a3a')), at(38, 100, 1, circle(0, -4, 5, '#7a9a3a', C.ink, 1)), at(84, 90, 1, circle(0, -4, 4, '#7a9a3a', C.ink, 1))),
  'klimz.nederbördsfattig': all(bg('#f2efe8'), greyed(cloud(32, 22, 0.7, '#7a8290'), rain(16, 48, 32, 52, 7, RAIN, 1.6), gauge(32, 104, 0.85)), line('M60 10 L60 110', C.grey2, 1.4, '3 3'), cloud(88, 22, 0.5), line('M88 32 l-1.5 5', RAIN, 1.6), gauge(88, 104, 0.08), box(66, 8, 44, 102)),
  'klimz.regnskugga': all(bg(), rect(4, 92, 30, 20, SEA, 0, null), line('M4 92 L34 92', C.ink, 1), path('M30 112 L30 96 L60 30 L92 96 L116 96 L116 112 Z', ROCK, C.ink, 1.3), path('M30 98 L46 66 L34 98 Z', LAND2, null), rect(92, 96, 24, 16, SAND, 0, null), cloud(36, 30, 0.6, '#8a96a4'), rain(26, 50, 40, 70, 5), arrow(6, 40, 20, 34, COLD, 2), arrow(66, 30, 86, 46, WARM, 2), sun(104, 22, 6), box(76, 52, 38, 58)),
  'klimz.temperaturskillnad': all(bg('#f6f2ea'), sun(30, 18, 6), moon(90, 18, 6), thermo(30, 100, 0.9, C.red, 1.4), thermo(90, 100, 0.15, COLD, 1.4), line(`M38 ${f1(100 - 2.8 - 29 * 0.9 * 1.4)} L82 ${f1(100 - 2.8 - 29 * 0.9 * 1.4)} M38 ${f1(100 - 2.8 - 29 * 0.15 * 1.4)} L82 ${f1(100 - 2.8 - 29 * 0.15 * 1.4)}`, C.grey, 1, '3 2'), arrow(60, 70, 60, f1(100 - 29 * 0.9 * 1.4), HL, 2.6), arrow(60, 70, 60, f1(100 - 29 * 0.15 * 1.4 - 4), HL, 2.6)),
  'klimz.kaktus': all(bg('#fbe6c8'), sun(96, 20, 7), field(96, SAND), cactus(56, 104, 1.8), tuft(96, 104, '#a88a3a')),
  // 2643 Tempererat klimat
  'klimz.tempererad': all(bg('#f2f4f6'), greyed(globeBase(60, 60, 50, '#cfd6dc'), band(60, 60, 50, -20, 20, TROP), cap(60, 60, 50, 55, '#9cc7ea'), cap(60, 60, 50, 55, '#9cc7ea', false), palm(60, 74, 0.5), sun(80, 60, 3), flake(60, 15, 3, C.white), flake(60, 105, 3, C.white)), band(60, 60, 50, 25, 50, TEMP), band(60, 60, 50, -50, -25, '#b9dca8'), circle(60, 60, 50, 'none', C.ink, 1.5), band(60, 60, 50, 25, 50, 'none', HL, 3), band(60, 60, 50, -50, -25, 'none', HL, 2), tulip(34, 37, C.pink), sun(50, 31, 3), leaf(68, 31, 30), flake(86, 31, 3.4, C.white)),
  'klimz.havsklimat': all(bg('#cfdbe6'), rect(4, 70, 44, 42, SEA, 0, null), path('M8 80 q4 -3 8 0 q4 3 8 0 M14 92 q4 -3 8 0 q4 3 8 0 M6 104 q4 -3 8 0', 'none', C.white, 1.2), path('M48 112 L48 74 C52 70 56 70 60 72 L116 72 L116 112 Z', LAND, C.ink, 1.1), house(78, 92, 1.4), dtree(102, 96, 0.8), cloud(30, 24, 0.7, '#dfe4ea'), rain(16, 44, 34, 50, 4, RAIN, 1.2), arrow(14, 58, 44, 58, C.sky, 2.4), thermo(64, 66, 0.5, TEMP, 0.6)),
  'klimz.västvind': all(bg('#f7d9b0'), field(96), path('M4 96 A18 18 0 0 1 40 96 Z', C.orange, C.ink, 1.1), ...[46, 60, 74].map((y, i) => arrow(30 + i * 4, y, 72 + i * 4, y, HL, 2.6)), g('rotate(14 96 104)', dtree(96, 104, 1.1)), line('M84 76 q6 -2 10 2 M80 84 q6 -2 10 2', C.grey, 1.2)),
  'klimz.lövfällande': all(bg('#f2efe8'), greyed(fir(16, 104, 1.1)), dtree(48, 104, 1.2, C.orange), leaf(40, 88, 30), leaf(56, 94, -40, C.red), leaf(48, 100, 70, C.gold), arrow(66, 80, 80, 80, HL, 2.4), bare(98, 104, 1.1), leaf(92, 108, 10), leaf(104, 108, -20, C.red), leaf(98, 109, 50, C.gold)),
  'klimz.växtsäsong': all(bg(), field(84), ...[[18, 0.3], [40, 0.6], [62, 1], [84, 0.6]].map(([x, s]) => at(x!, 84, s!, line('M0 0 L0 -20', LAND2, 2), path('M0 -10 C-8 -14 -10 -20 -2 -18 Z M0 -14 C8 -18 10 -24 2 -22 Z', LAND2, C.ink, 0.8))), sun(102, 20, 6), months(98, [4, 5, 6, 7, 8], TEMP)),
  // 2644 Kontinentalt klimat
  'klimz.inlandsklimat': all(bg(), rect(4, 80, 14, 32, SEA, 0, null), path('M18 112 L18 80 L116 80 L116 112 Z', LAND, C.ink, 1.1), house(80, 104, 1.5), line('M18 108 L64 108', HL, 1.8, '3 2'), arrow(48, 108, 66, 108, HL, 1.8), sun(56, 22, 6), thermo(64, 66, 0.95, C.red, 0.8), flake(96, 18, 5), thermo(96, 66, 0.05, COLD, 0.8)),
  'klimz.köldrekord': all(bg('#dcebf6'), field(104, SNOW), flake(20, 20, 5), flake(98, 30, 4), flake(22, 60, 3), thermo(44, 100, 0.02, COLD, 2.1), rosette(86, 66, '-52,6', COLD)),
  'klimz.köldpol': all(bg('#e8f0f7'), globeBase(60, 64, 44), cap(60, 64, 44, 40, '#d7ebf7'), cap(60, 64, 44, 60, SNOW), circle(60, 64, 44, 'none', C.ink, 1.5), at(78, 34, 1, path('M0 0 C-6 -8 -6 -16 0 -16 C6 -16 6 -8 0 0 Z', COLD, C.ink, 1.2), flake(0, -10, 3, C.white)), ring(78, 30, 12), thermo(20, 108, 0.02, COLD, 0.7)),
  'klimz.tajga': all(bg('#dde8ef'), path('M4 70 C30 62 60 66 116 60 L116 112 L4 112 Z', SNOW, C.ink, 1), ...range(14).map((i) => fir(8 + i * 8, 72 - (i % 3), 0.4, '#2f6a40')), ...range(10).map((i) => fir(10 + i * 11, 88 + (i % 2) * 2, 0.65, '#3f7d4e', true)), ...range(7).map((i) => fir(12 + i * 16, 110, 0.95, '#2f6a40', true))),
  'klimz.sträng.2': all(bg('#eef1f4'), greyed(field(100, SNOW), P({ x: 28, top: C.sky }), flake(12, 30, 2.4), thermo(50, 96, 0.44, C.grey, 0.7)), line('M46 75.4 l-4 0', C.ink, 1), num(38, 78, '0', 6), line('M60 10 L60 110', C.grey2, 1.4, '3 3'), rect(62, 6, 52, 104, '#b9cfe2', 2, null), icicles(62, 114, 6), rect(62, 100, 52, 10, SNOW, 0, null), P({ x: 84, top: C.navy, mood: 'frown' }), path('M74 22 C74 10 94 10 94 22 Z', '#7a5a40', C.ink, 1.1), rect(75, 26, 18, 6, C.red, 2, C.ink, 1), line('M77 21.5 l3 0 M88 21.5 l3 0', C.white, 1.6), ...[[68, 44], [108, 48], [70, 72], [104, 80], [100, 36]].map(([x, y]) => flake(x!, y!, 4, C.white)), line('M66 56 l10 3 M66 62 l8 2', C.white, 1.6), thermo(108, 96, 0.02, COLD, 0.7), line('M104 75.4 l4 0', C.ink, 1), box(62, 6, 52, 104)),
  // 2645 Polarområdenas klimat
  'klimz.polar': all(bg('#eef1f4'), greyed(field(98, LAND), bear(30, 98, 0.8, C.brown), dove(32, 50, 1.2)), line('M60 10 L60 110', C.grey2, 1.4, '3 3'), rect(62, 6, 52, 104, '#d8e9f5', 2, null), rect(62, 98, 52, 12, SNOW, 0, null), bear(80, 98, 0.55), penguin(104, 98, 1.1), g('translate(0 -48)', P({ x: 80, h: 0.5, top: C.orange })), path('M73 38 C73 30 87 30 87 38 Z', '#c9b08a', C.ink, 1), ...range(5).map((i) => circle(74 + i * 3, 38, 1.6, '#e8dcc4', C.ink, 0.5)), flake(106, 30, 3, C.white), box(62, 6, 52, 104)),
  'klimz.polarklimat': all(bg('#dcebf6'), field(92, SNOW), path('M4 92 L30 80 L50 92 Z M66 92 L90 76 L116 92 Z', ICE2, C.ink, 1), flake(20, 24, 4), flake(52, 16, 3), flake(70, 36, 3), thermo(100, 70, 0.3, COLD, 1.3), line('M90 40 L110 40', HL, 2.2), num(90, 37, '10', 8, HL)),
  'klimz.polcirkel': all(bg(), globeBase(60, 62, 44), cap(60, 62, 44, 66.6, SNOW), cap(60, 62, 44, 66.6, SNOW, false), latLine(60, 62, 44, 0, C.grey, 1, '3 2'), latLine(60, 62, 44, 66.6, HL, 2.8), latLine(60, 62, 44, -66.6, HL, 2.8), circle(60, 62, 44, 'none', C.ink, 1.5), sun(106, 16, 5)),
  'klimz.polarnatt': all(bg(NIGHT), path('M4 112 L4 88 C30 84 70 86 116 84 L116 112 Z', '#c7d3e0', C.ink, 1), path('M20 88 A40 14 0 0 1 100 88', 'none', '#f0a46a', 3), ...[[16, 20], [40, 12], [70, 24], [96, 14], [108, 40], [28, 44]].map(([x, y]) => flake(x!, y!, 2, C.white)), clock(60, 46, 16, 12, 0), house(30, 104, 1.1, '#e8d9c0', '#6a3a30'), rect(28.5, 96, 3, 3, C.yellow, 0, null)),
  'klimz.havsis': all(bg('#cfe3f0'), rect(4, 56, 112, 56, SEA2, 0, null), floe(8, 72, 40, 12), floe(52, 70, 34, 10), floe(88, 74, 26, 10), floe(14, 96, 30, 12), floe(50, 98, 42, 14), floe(96, 100, 18, 10), line('M4 56 L116 56', C.ink, 1)),
  'klimz.isbjörn': all(bg('#d8e9f5'), rect(4, 90, 112, 22, SEA2, 0, null), path('M4 92 L80 92 L88 100 L76 106 L4 106 Z', SNOW, C.ink, 1.2), bear(46, 92, 1.4)),
  // 2646 Bergsklimat
  'klimz.bergsklimat': all(bg(), field(104), mountain(10, 110, 60, 14, 104, ROCK, 40), fir(22, 104, 0.6), fir(98, 104, 0.6), line('M70 22 l10 -2 M72 28 l10 -2', C.grey, 1.2), flake(80, 34, 3), thermo(18, 70, 0.75, C.red, 0.6), thermo(104, 44, 0.08, COLD, 0.6), arrow(104, 66, 104, 52, HL, 2)),
  'klimz.syrebrist': all(bg('#d6e4f0'), mountain(4, 116, 64, 44, 112, ROCK, 64), g('translate(4 -66) scale(1)', P({ x: 60, h: 0.42, top: C.red, mood: 'sick' })), path('M70 34 q4 -2 6 2', 'none', C.ink, 1.2), o2(88, 30), o2(30, 22), greyed(...[[12, 92], [24, 100], [100, 96], [108, 104], [16, 104], [94, 106]].map(([x, y]) => o2(x!, y!))), ring(60, 30, 18)),
  'klimz.höjdsjuka': all(bg('#d6e4f0'), mountain(4, 116, 60, 50, 112, ROCK, 70), g('translate(0 -62)', P({ x: 60, h: 0.5, top: C.orange, mood: 'sick' })), path('M62 18 c4 -4 8 0 4 3 c-3 2 -6 -1 -3 -3', 'none', HL, 1.6), path('M52 20 c-3 -3 -6 0 -3 2', 'none', HL, 1.4)),
  // 2647 Årstidernas variationer
  'klimz.jordaxel': all(bg(NIGHT), tiltedEarth(60, 60, 30, 23.4, HL, 3), line('M60 18 L60 102', C.grey2, 1, '3 3'), path('M44 30 A22 6 0 0 0 80 34', 'none', C.white, 1.2), arrow(76, 33, 80, 34, C.white, 1.2)),
  'klimz.lutning': all(bg('#f6f2ea'), field(100, LAND), line('M60 100 L60 20', C.grey, 1.4, '4 3'), line(`M60 100 L${f1(60 + 80 * Math.sin(rad(25)))} ${f1(100 - 80 * Math.cos(rad(25)))}`, C.brown, 5), arc(60, 100, 40, 90, 65, HL, 2.6)),
  'klimz.solhöjd': all(bg(), field(96), P({ x: 22, h: 0.45, top: C.green }), line('M28 82 L96 34', C.gold, 1.2, '3 2'), sun(98, 32, 7), line('M28 82 L110 82', C.grey, 1, '3 2'), arc(28, 82, 30, 0, 35, HL, 2.6)),
  'klimz.dagslängd': all(bg(), field(90), sunPath(16, 104, 90, 32), sun(16, 90, 5), sun(104, 90, 5), arrow(28, 102, 92, 102, HL, 2.4), arrow(92, 102, 28, 102, HL, 2.4), clock(60, 46, 10, 6, 0)),
  'klimz.vårdagjämning': equinox(true),
  'klimz.höstdagjämning': equinox(false),
  'klimz.solstånd': all(bg('#eef1f4'), line('M60 10 L60 110', C.grey2, 1.4, '3 3'), field(96, LAND), sunPath(8, 56, 96, 32, HL, 2), sun(32, 34, 5), sunPath(64, 112, 96, 10, HL, 2), sun(88, 78, 4), rect(64, 96, 48, 16, SNOW, 0, null)),
  'klimz.sommarsolstånd': all(solstice(true, true), dtree(18, 104, 0.8, '#b6dc8a'), dtree(102, 104, 0.8, '#b6dc8a'), months(100, [5], C.yellow)),
  'klimz.vintersolstånd': all(solstice(false, true), fir(18, 104, 0.8, '#3f7d4e', true), fir(102, 104, 0.8, '#3f7d4e', true), months(100, [11], '#9cc7ea')),
};
