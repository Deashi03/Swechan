/**
 * Teknik & digital värld → Datorer & internet → Nätverk & uppkoppling, 3741–3747 (0.54): Wi-Fi and router,
 * mobile data, IP addresses, bandwidth and latency, wireless coverage, network problems and home network security.
 * Recurring signs: the part that the word names is outlined in orange (ring or frame) and grey parts show what
 * the word is not. Wi-Fi is the usual fan of arcs, mobile signal the four bars. Contrast pairs share a layout:
 * trådbunden (orange cable, grey crossed fan) beside the plain cable close-up for nätverkskabel; bandbredd (wide
 * orange pipe over a narrow grey one) and svarstid (round trip and stopwatch); buffra (spinning loading ring)
 * and seg (snail on a slow progress bar); räckvidd (radius from a router) and täckning (coloured map areas).
 * Digits and dots only (192.168.1.25, 0,001); no words, no brands, no logos.
 */
import { C, all, arrow, circle, g, line, path, rect, type Svg } from './kit';
import { HL, T, globe, padlock, box } from './people';
import { P, greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const SCR = '#bfe3f5';
const SOIL = '#b98b5e';
const GRASS = '#9fcf8a';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const cross = (x: number, y: number, r: number, col: string = C.red) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 3);
const check = (x: number, y: number, r = 7) => all(circle(x, y, r, C.green, C.ink, 1.4), line(`M${x - r * 0.45} ${y} L${x - r * 0.1} ${y + r * 0.4} L${x + r * 0.5} ${y - r * 0.35}`, C.white, 2));

/** Wi-Fi fan: dot at (x, y), `n` of three arcs in colour (the rest grey). */
const fan = (x: number, y: number, s = 1, col: string = HL, n = 3) => all(circle(x, y, 2.2 * s, n > 0 ? col : C.grey2, null),
  ...[1, 2, 3].map((i) => { const r = (4 + i * 6) * s, d = f1(r * 0.707); return line(`M${f1(x - d)} ${f1(y - d)} A${f1(r)} ${f1(r)} 0 0 1 ${f1(x + d)} ${f1(y - d)}`, i <= n ? col : C.grey2, 2.6 * s); }));
/** Mobile signal bars, bottom-left at (x, y); `k` of four filled. */
const bars = (x: number, y: number, s = 1, k = 4, col: string = C.ink) => all(...range(4).map((i) => rect(f1(x + i * 6 * s), f1(y - (5 + i * 4) * s), f1(4.4 * s), f1((5 + i * 4) * s), i < k ? col : 'none', 0.8, i < k ? null : C.grey, 1)));
/** Radio waves to the right (or left) of (x, y). */
const waves = (x: number, y: number, s = 1, col: string = C.sky, dir = 1) => all(...[1, 2, 3].map((i) => { const r = i * 6 * s; return line(`M${f1(x + dir * r * 0.5)} ${f1(y - r * 0.87)} A${f1(r)} ${f1(r)} 0 0 ${dir > 0 ? 1 : 0} ${f1(x + dir * r * 0.5)} ${f1(y + r * 0.87)}`, col, 2.2); }));
/** Home router, centre of its base at (x, y): white box, two antennas, green lights. */
const router = (x: number, y: number, s = 1, lights: string = C.green) => at(x, y, s, line('M-15 -10 L-19 -32 M15 -10 L19 -32', C.dark, 3), circle(-19, -32, 1.8, C.dark, null), circle(19, -32, 1.8, C.dark, null),
  rect(-24, -12, 48, 12, C.white, 3, C.ink, 1.8), ...range(4).map((i) => circle(-14 + i * 7, -6, 1.6, lights, null)), rect(-20, 0, 6, 2, C.grey, 0.5, null), rect(14, 0, 6, 2, C.grey, 0.5, null));
/** Laptop, base centre at (x, y); `scr` drawn in local coordinates inside the screen (x −23…23, y −37…−9). */
const laptop = (x: number, y: number, s = 1, scr: Svg = '', bg: string = SCR) => at(x, y, s,
  rect(-26, -40, 52, 34, C.dark, 3, C.ink, 1.8), rect(-23, -37, 46, 28, bg, 1, null), scr,
  path('M-32 0 L32 0 L28 -6 L-28 -6 Z', C.silver, C.ink, 1.6), line('M-6 -3 L6 -3', C.ink, 1));
/** Phone, centre (x, y); `scr` in local coordinates (x −8.5…8.5, y −15…13). */
const phone = (x: number, y: number, s = 1, scr: Svg = '', bg: string = SCR) => at(x, y, s, rect(-10, -18, 20, 36, C.dark, 3.4, C.ink, 1.4), rect(-8.5, -15, 17, 28, bg, 1, null), scr, circle(0, 15.5, 1.2, C.grey, null));
/** Tablet, centre (x, y). */
const tablet = (x: number, y: number, s = 1, scr: Svg = '') => at(x, y, s, rect(-18, -13, 36, 26, C.dark, 3, C.ink, 1.4), rect(-15.5, -10.5, 31, 21, SCR, 1, null), scr);
/** Printer, base centre (x, y). */
const printer = (x: number, y: number, s = 1) => at(x, y, s, rect(-12, -26, 24, 8, C.white, 1, C.ink, 1.2), rect(-18, -20, 36, 20, C.silver, 3, C.ink, 1.6), rect(-12, -6, 24, 3, C.dark, 1, null), circle(12, -14, 1.6, C.green, null));
/** Flat TV on a small stand, base centre (x, y). */
const tv = (x: number, y: number, s = 1, scr: Svg = '') => at(x, y, s, rect(-4, -6, 8, 6, C.grey, 1, C.ink, 1), rect(-26, -38, 52, 32, C.black, 2, C.ink, 1.8), rect(-23, -35, 46, 26, SCR, 1, null), scr);
/** Server tower, base (x, y). */
const server = (x: number, y: number, s = 1) => at(x, y, s, rect(-12, -44, 24, 44, C.dark, 2, C.ink, 1.6), ...range(5).map((i) => all(rect(-9, -40 + i * 8, 18, 5, '#555865', 1, null), circle(6, -37.5 + i * 8, 1.1, C.green, null))));
/** House outline, ground-floor left corner (x, y). */
const house = (x: number, y: number, w: number, h: number, wall: string = C.beige, roof: string = C.red, stroke: string = C.ink) => all(rect(x, y - h, w, h, wall, 1, stroke, 1.8), path(`M${x - 4} ${y - h} L${x + w / 2} ${y - h - w * 0.4} L${x + w + 4} ${y - h} Z`, roof, stroke, 1.8));
/** Lattice mobile mast, foot centre (x, y), height h. */
const mast = (x: number, y: number, h = 60, col: string = '#8c939b') => all(line(`M${x - h * 0.13} ${y} L${x} ${y - h} L${x + h * 0.13} ${y}`, col, 2.6),
  line(range(5).map((i) => { const a = y - (i + 0.5) * h / 6, b = y - (i + 1.3) * h / 6, wa = h * 0.13 * (a - y + h) / h, wb = h * 0.13 * (b - y + h) / h; return `M${f1(x - wa)} ${f1(a)} L${f1(x + wb)} ${f1(b)} M${f1(x + wa)} ${f1(a)} L${f1(x - wb)} ${f1(b)}`; }).join(' '), col, 1.2),
  rect(x - 7, y - h - 2, 4, 12, C.white, 1, C.ink, 1), rect(x + 3, y - h - 2, 4, 12, C.white, 1, C.ink, 1));
/** Stopwatch, centre (x, y), radius r; `inner` drawn on top. */
const stopwatch = (x: number, y: number, r: number, inner: Svg = '') => all(rect(x - 4, y - r - 7, 8, 5, C.grey, 1, C.ink, 1.2), line(`M${f1(x + r * 0.7)} ${f1(y - r * 0.7)} L${f1(x + r * 0.85)} ${f1(y - r * 0.85)}`, C.ink, 3), circle(x, y, r, C.white, C.ink, 2), inner);
/** RJ45 plug pointing right, tip at (x, y). */
const plug = (x: number, y: number, s = 1, col: string = C.sky) => at(x, y, s, rect(-16, -5, 8, 10, col, 2, C.ink, 1.2), rect(-9, -6, 10, 12, 'rgba(230,240,248,0.9)', 1.5, C.ink, 1.2), line('M-7 -4 L0 -4 M-7 -2 L0 -2 M-7 0 L0 0 M-7 2 L0 2', C.gold, 0.9), rect(-8, 5, 6, 3, 'rgba(230,240,248,0.9)', 1, C.ink, 0.8));
/** Snail facing right, body centre (x, y). */
const snail = (x: number, y: number, s = 1) => at(x, y, s, path('M-16 6 C-16 2 -8 1 2 2 L14 3 C18 4 19 7 17 8 L-14 8 Z', '#d8c4a6', C.ink, 1.2), line('M15 4 L19 -4 M12 3 L14 -5', C.ink, 1), circle(19, -4, 1, C.ink, null), circle(14, -5, 1, C.ink, null),
  circle(-4, -4, 9, '#a0784e', C.ink, 1.4), path('M-4 -4 m-5 0 a5 5 0 1 1 5 5 a3 3 0 1 1 -3 -3', 'none', C.ink, 1.1));
/** Wall power socket on a wall at (x, y). */
const socket = (x: number, y: number, s = 1) => at(x, y, s, rect(-7, -7, 14, 14, C.white, 3, C.ink, 1.2), circle(0, 0, 4.5, '#e9e9e4', C.ink, 0.8), circle(-1.8, 0, 0.9, C.ink, null), circle(1.8, 0, 0.9, C.ink, null));
/** Little sticker with a barcode. */
const sticker = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x, y, w, h, C.white, 2, C.ink, 1.2), line(range(Math.floor(w / 3)).map((i) => `M${x + 3 + i * 2.6} ${y + h - 9} L${x + 3 + i * 2.6} ${y + h - 3}`).join(' '), C.ink, i0w(w)), inner);
function i0w(w: number) { return w > 30 ? 1.2 : 0.9; }
/** Smiling face for a screen (video call). */
const callFace = (x: number, y: number, s = 1, frozen = false) => at(x, y, s, circle(0, 4, 8, '#7ab0e8', null), circle(0, -5, 5.5, C.skin, C.ink, 0.8), path('M-5.5 -6 C-5 -12 5 -12 5.5 -6 C3 -9 -3 -9 -5.5 -6 Z', C.hair, null),
  frozen ? line('M-2.8 -5.4 L-1.2 -5.4 M1.2 -5.4 L2.8 -5.4', C.ink, 0.9) : all(circle(-2, -5.4, 0.7, C.ink, null), circle(2, -5.4, 0.7, C.ink, null)), path(frozen ? 'M-1.6 -2.4 L1.6 -2.4' : 'M-1.8 -2.8 Q0 -1.4 1.8 -2.8', 'none', C.ink, 0.8));
/** Simple country silhouette path around centre. */
const country = (x: number, y: number, s: number, fill: string, stroke: string = C.ink) => at(x, y, s, path('M-14 -30 C-4 -34 6 -28 10 -20 C16 -12 12 -4 16 4 C20 14 12 26 2 30 C-6 32 -12 24 -10 16 C-8 8 -18 4 -18 -6 C-18 -16 -20 -26 -14 -30 Z', fill, stroke, 1.6));

export const NETWORK_MOTIFS: Record<string, Svg> = {
  // ── 3741 Wi-Fi och router ────────────────────────────────────────
  'natv.wifi': all(ground(), fan(60, 50, 2.6), phone(24, 92, 1.1, fan(0, 2, 0.55, C.denim)), laptop(88, 112, 0.95, fan(0, -15, 0.75, C.denim)),
    greyed(path('M30 26 C20 24 14 30 18 36', 'none', C.dark, 3)), greyed(path('M90 22 C100 20 106 28 100 34', 'none', C.dark, 3))),
  'natv.router': all(rect(10, 92, 100, 8, C.tan, 2, C.ink, 1.8), line('M20 100 L20 112 M100 100 L100 112', C.brown, 3), router(60, 92, 1.7),
    waves(104, 62, 0.8, C.grey2), waves(16, 62, 0.8, C.grey2, -1), ring(60, 70, 38)),
  'natv.fiber.2': all(rect(4, 76, 112, 36, SOIL, 0, null), line('M4 76 L116 76', C.green, 3), house(64, 76, 46, 34),
    rect(78, 58, 10, 18, C.brown, 1, C.ink, 1.2), path('M4 96 L80 96 C88 96 90 92 90 84 L90 70', 'none', C.ink, 6), path('M4 96 L80 96 C88 96 90 92 90 84 L90 70', 'none', C.orange, 3.6),
    line('M10 96 L16 96 M28 96 L34 96 M46 96 L52 96 M64 96 L70 96', C.yellow, 2), rect(85, 62, 10, 10, C.white, 2, C.ink, 1.2), circle(90, 67, 1.6, C.green, null),
    circle(26, 38, 22, C.white, HL, 2.6), circle(26, 38, 12, C.orange, C.ink, 1.4), ...[[0, 0], [-5, -4], [5, -4], [-5, 4], [5, 4], [0, -7], [0, 7], [-8, 0], [8, 0]].map(([a, b]) => circle(26 + a!, 38 + b!, 1.8, C.yellow, null)),
    line('M42 52 L52 90', HL, 1.6, '3 3')),
  'natv.internetleverantör': all(ground(), rect(8, 30, 34, 82, '#7f93ad', 2, C.ink, 1.8), ...range(6).map((i) => all(rect(13, 36 + i * 12, 9, 7, SCR, 1, C.ink, 0.8), rect(28, 36 + i * 12, 9, 7, SCR, 1, C.ink, 0.8))),
    globe(25, 20, 9), ...[[84, 54], [84, 84], [84, 112]].map(([x, y]) => all(house(x! - 14, y!, 28, 16, C.beige, C.red), router(x!, y! - 3, 0.25))),
    line('M42 50 C58 50 60 38 70 38 M42 70 L70 70 M42 96 C58 96 60 100 70 100', HL, 2.2), frame(4, 6, 42, 108)),
  'natv.trådbunden': all(rect(4, 72, 66, 6, C.tan, 2, C.ink, 1.8), line('M12 78 L12 112 M62 78 L62 112', C.brown, 3), ground(), laptop(34, 72, 0.9), router(94, 112, 0.8),
    path('M58 70 C70 70 72 98 80 108 L84 108', 'none', C.ink, 4.4), path('M58 70 C70 70 72 98 80 108 L84 108', 'none', HL, 2.8),
    greyed(fan(94, 40, 1.4, C.dark)), cross(94, 32, 12)),
  'natv.nätverkskabel': all(path('M30 70 C10 70 8 98 30 100 C52 102 70 90 60 70 C52 54 76 40 92 52', 'none', C.ink, 6.4), path('M30 70 C10 70 8 98 30 100 C52 102 70 90 60 70 C52 54 76 40 92 52', 'none', '#5aa7d6', 4.4),
    g('rotate(37 92 52)', plug(110, 52, 1.6)), plug(46, 70, 1.6), ring(102, 60, 18)),
  'natv.uppkopplad': all(ground(), greyed(laptop(32, 112, 0.85, all(globe(0, -23, 9)))), cross(32, 70, 7), laptop(88, 112, 0.95, globe(0, -23, 10)), check(110, 54, 8), fan(88, 50, 0.9, C.green), frame(54, 40, 64, 76)),
  // ── 3742 Mobildata ───────────────────────────────────────────────
  'natv.mobildata': all(mast(22, 108, 56), waves(28, 52, 0.9, C.sky), ground(), phone(72, 64, 2.3, all(arrow(-3.5, 8, -3.5, -9, HL, 2.6), arrow(3.5, -9, 3.5, 8, C.denim, 2.6), bars(-7, -11, 0.45, 4))),
    greyed(fan(108, 104, 0.8, C.dark)), cross(108, 98, 6)),
  'natv.mobilnät': all(rect(4, 8, 112, 104, GRASS, 4, C.ink, 1.4), ...[[30, 34], [86, 34], [58, 78], [20, 92], [100, 92]].map(([x, y]) => all(circle(x!, y!, 24, 'rgba(239,138,60,0.18)', HL, 1.4), mast(x!, y! + 8, 18, C.dark))),
    phone(46, 54, 0.6), phone(76, 96, 0.6)),
  'natv.simkort': all(path('M28 22 L80 22 L96 38 L96 102 L28 102 Z', C.denim, C.ink, 2), rect(42, 46, 40, 32, C.gold, 5, C.ink, 1.6), line('M42 58 L56 58 M68 58 L82 58 M42 66 L56 66 M68 66 L82 66 M56 46 L56 78 M68 46 L68 78', '#9a7420', 1.4), ring(62, 62, 46)),
  'natv.surfzon': all(ground(), rect(4, 86, 112, 6, C.tan, 2, C.ink, 1.8), line('M12 92 L12 112 M108 92 L108 112', C.brown, 3), phone(26, 68, 1.3, bars(-6, -2, 0.45, 4)), ring(26, 68, 26),
    fan(26, 38, 1.2, HL), laptop(84, 86, 1, fan(0, -15, 0.8, HL)), arrow(44, 50, 60, 58, HL, 2.6)),
  'natv.roaming': all(rect(4, 10, 112, 100, GRASS, 4, C.ink, 1.4), rect(60, 10, 56, 100, '#c8e3b6', 0, null), line('M60 12 C56 40 64 70 60 108', C.ink, 2, '5 4'), house(14, 74, 26, 18),
    mast(96, 64, 40, C.dark), waves(98, 34, 0.7, C.sky, -1), phone(76, 70, 1, bars(-6, -2, 0.45, 4)), ring(76, 70, 18), line('M30 92 C46 100 60 90 70 80', HL, 2.2, '4 3'), arrow(64, 86, 70, 80, HL, 2.2)),
  'natv.mobilt-bredband': all(rect(4, 84, 112, 28, GRASS, 0, null), path('M78 84 L96 40 L116 84 Z', '#86b874', null), mast(100, 54, 30, C.dark), waves(92, 36, 0.8, C.sky, -1),
    house(10, 104, 58, 34, '#b84a3a', C.dark), rect(20, 82, 38, 18, '#f3e3b8', 1, C.ink, 1.4), rect(28, 92, 22, 7, C.white, 2, C.ink, 1.2), rect(34, 89, 10, 4, C.gold, 1, C.ink, 0.8), circle(46, 95.5, 1.2, C.green, null), ring(39, 92, 16),
    greyed(line('M4 108 L20 108', C.dark, 3)), cross(12, 108, 5)),
  // ── 3743 IP-adresser ─────────────────────────────────────────────
  'natv.IP-adress': all(ground(), laptop(46, 112, 1.25), line('M78 66 L86 50', C.ink, 1.4), path('M84 30 L114 30 L114 52 L84 52 L78 41 Z', C.white, C.ink, 1.6), circle(83, 41, 1.6, C.ink, null),
    T(99, 39, '192.168', 6.6), T(99, 48, '.1.25', 6.6), frame(74, 24, 44, 34)),
  'natv.enhet.2': all(ground(), greyed(router(60, 112, 0.7)), frame(6, 14, 30, 42), phone(21, 35, 0.9), frame(42, 10, 72, 50), laptop(78, 54, 0.9), frame(6, 66, 46, 42), tv(29, 104, 0.75), frame(76, 70, 38, 38), printer(95, 104, 0.85)),
  'natv.tilldela': all(ground(), router(24, 112, 0.9), ...[[66, 24, '2'], [86, 60, '3'], [96, 100, '4']].map(([x, y, n]) => all(arrow(40, 88, (x as number) - 16, (y as number) - 2, HL, 2.2), path(`M${(x as number) - 14} ${(y as number) - 8} L${(x as number) + 4} ${(y as number) - 8} L${(x as number) + 4} ${(y as number) + 6} L${(x as number) - 14} ${(y as number) + 6} L${(x as number) - 18} ${(y as number) - 1} Z`, '#ffe9c2', HL, 1.6), T((x as number) - 5, (y as number) + 3, `.${n as string}`, 9))),
    phone(104, 22, 0.6), laptop(108, 74, 0.35)),
  'natv.datapaket': all(laptop(22, 104, 0.7), server(102, 108, 0.9), line('M38 84 C50 40 70 40 88 62', C.grey2, 3, '4 4'),
    ...[[44, 62], [60, 46], [78, 50]].map(([x, y], i) => all(box(x!, y!, 16, 12), rect(x! - 4, y! - 2, 8, 5, C.white, 1, C.ink, 0.6), i === 1 ? ring(x!, y!, 13) : '')), arrow(84, 56, 92, 66, HL, 2.2)),
  'natv.lokalt-nätverk': all(path('M10 108 L10 48 L54 16 L98 48 L98 108 Z', '#fbf4e6', HL, 2.6), router(54, 96, 0.7), phone(26, 66, 0.7), laptop(78, 76, 0.55), tv(30, 104, 0.45),
    line('M46 88 L30 74 M62 88 L74 78 M46 92 L36 96', C.denim, 1.6, '3 2'), greyed(globe(110, 26, 8)), line('M66 88 C96 84 96 50 104 34', C.grey, 1.6, '3 3')),
  'natv.geoblockering': all(country(30, 60, 1.25, '#bfe0a8'), country(90, 60, 1.25, C.grey2), tv(30, 72, 0.6, path('M-5 -28 L-5 -16 L5 -22 Z', C.white, C.ink, 1)), tv(90, 72, 0.6, path('M-5 -28 L-5 -16 L5 -22 Z', C.white, C.ink, 1)),
    circle(90, 58, 13, 'none', C.red, 3), line('M81 67 L99 49', C.red, 3), frame(64, 16, 52, 90)),
  // ── 3744 Bandbredd och svarstid ──────────────────────────────────
  'natv.hastighetstest': all(phone(60, 62, 2.7, all(path('M-7 2 A7 7 0 0 1 7 2', 'none', C.grey2, 2.4), path('M-7 2 A7 7 0 0 1 4.9 -3', 'none', HL, 2.4), line('M0 2 L4 -3', C.ink, 1), circle(0, 2, 1, C.ink, null),
    rect(-5, 7, 10, 3.6, C.green, 1.8, null))), ring(60, 64, 26)),
  'natv.bandbredd': all(rect(10, 22, 100, 34, '#f6c39a', 5, C.ink, 2), ...range(12).map((i) => circle(18 + (i % 6) * 16 + (i > 5 ? 8 : 0), 32 + (i > 5 ? 14 : 0), 3.2, HL, null)), arrow(104, 39, 116, 39, HL, 2.4),
    line('M6 22 L6 56', HL, 2.4), line('M3 25 L6 22 L9 25 M3 53 L6 56 L9 53', HL, 2), greyed(rect(10, 82, 100, 10, C.grey2, 3, C.ink, 1.6), circle(40, 87, 2.6, C.dark, null), circle(80, 87, 2.6, C.dark, null))),
  'natv.svarstid': all(ground(), laptop(22, 112, 0.65), server(100, 112, 0.85), path('M40 84 C56 66 76 66 90 80', 'none', HL, 2.6), arrow(86, 76, 90, 80, HL, 2.6), path('M90 94 C76 104 56 104 40 96', 'none', C.denim, 2.6), arrow(44, 98, 40, 96, C.denim, 2.6),
    stopwatch(60, 34, 18, all(line('M60 34 L60 22', C.ink, 2), line('M60 34 L69 39', HL, 2.4), circle(60, 34, 2, C.ink, null))), ring(60, 32, 25)),
  'natv.millisekund': all(stopwatch(60, 66, 40, all(rect(34, 56, 52, 20, '#dfeee3', 3, C.ink, 1.4), T(60, 71, '0,001', 13), line('M60 34 L60 44', C.ink, 2), path('M60 26 A40 40 0 0 1 61 26', 'none', HL, 4))), ring(60, 66, 30)),
  'natv.buffra': all(tv(60, 100, 1.9, all(path('M-23 -9 L-10 -24 L-2 -15 L6 -26 L23 -9 Z', '#9fcf8a', null), circle(14, -28, 3, C.yellow, null), rect(-23, -35, 46, 26, 'rgba(40,40,50,0.35)', 1, null),
    ...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return circle(f1(Math.cos(a) * 6), f1(-22 + Math.sin(a) * 6), 1.3, i < 5 ? C.white : 'rgba(255,255,255,0.4)', null); }),
    rect(-20, -12.5, 40, 1.4, C.grey, 0.5, null), rect(-20, -12.5, 14, 1.4, HL, 0.5, null), circle(-6, -11.8, 1.4, HL, null))), ring(60, 58, 16)),
  'natv.seg.2': all(ground(), laptop(60, 112, 1.6, all(rect(-18, -26, 36, 5, C.white, 2, C.ink, 0.8), rect(-18, -26, 7, 5, C.green, 2, null))), snail(60, 44, 1.3), line('M28 44 L22 44 M30 50 L20 50', C.grey, 1.6)),
  // ── 3745 Trådlös täckning ────────────────────────────────────────
  'natv.räckvidd.3': all(rect(4, 6, 112, 106, '#efe6d6', 3, C.ink, 1.4), circle(46, 58, 38, 'rgba(140,199,232,0.25)', C.sky, 1.4), circle(46, 58, 24, 'none', C.sky, 1), router(46, 62, 0.55),
    arrow(46, 58, 79, 39, HL, 2.6), laptop(40, 92, 0.45), phone(100, 92, 0.8), cross(100, 92, 9, C.red)),
  'natv.hinder': all(ground(), router(16, 112, 0.6), waves(26, 76, 1.1, C.sky), rect(48, 24, 22, 88, '#b0a69a', 1, C.ink, 1.8), ...range(8).map((i) => line(`M48 ${34 + i * 10} L70 ${34 + i * 10} M${i % 2 ? 59 : 54} ${24 + i * 10} L${i % 2 ? 59 : 54} ${34 + i * 10}`, C.ink, 0.9)),
    frame(44, 20, 30, 94), greyed(waves(74, 76, 0.8, C.dark)), phone(102, 84, 1, bars(-6, -2, 0.45, 1))),
  'natv.förstärkare': all(rect(4, 10, 112, 102, '#efe6d6', 0, null), ground(), router(16, 112, 0.55), waves(24, 86, 0.6, C.grey2), socket(60, 80, 1), rect(53, 70, 14, 20, C.white, 3, C.ink, 1.6), circle(60, 76, 1.6, C.green, null), ring(60, 80, 16),
    waves(68, 80, 1.5, HL), laptop(102, 112, 0.6, fan(0, -18, 0.6, C.green))),
  'natv.störning.2': all(ground(), rect(4, 76, 112, 6, C.tan, 2, C.ink, 1.8), router(18, 76, 0.6), laptop(100, 76, 0.6), line('M30 56 C40 50 46 62 54 56', C.sky, 2.4), greyed(line('M70 56 C78 50 82 62 90 56', C.dark, 2.4)),
    rect(42, 82, 36, 22, C.white, 2, C.ink, 1.6), rect(46, 86, 20, 14, '#3d4250', 1, null), circle(72, 90, 1.4, C.ink, null), circle(72, 96, 1.4, C.ink, null),
    path('M60 76 L54 66 L64 60 L56 48 L66 40 M50 78 L44 70', 'none', HL, 2.6), ring(58, 56, 18)),
  'natv.täckning.2': all(path('M40 8 C60 4 74 14 76 30 C80 46 98 52 96 72 C94 92 76 110 56 108 C38 106 30 92 22 80 C12 66 20 54 26 42 C30 30 24 12 40 8 Z', C.white, C.ink, 1.8),
    circle(46, 30, 20, 'rgba(239,138,60,0.45)', null), circle(76, 72, 22, 'rgba(239,138,60,0.45)', null), circle(50, 94, 14, 'rgba(239,138,60,0.45)', null),
    mast(46, 34, 12, C.dark), mast(76, 76, 12, C.dark), phone(56, 40, 0.55, bars(-6, -2, 0.45, 4)), greyed(phone(30, 70, 0.55, bars(-6, -2, 0.45, 0))), ring(30, 70, 12, C.grey)),
  'natv.streck.2': all(phone(30, 70, 1.6), rect(18, 46, 24, 6, 'rgba(0,0,0,0.12)', 1, null), bars(20, 51, 0.45, 1), line('M42 46 L62 26 M42 52 L62 84', C.grey, 1.2, '3 3'), rect(62, 20, 52, 66, C.white, 6, C.ink, 1.6),
    bars(70, 76, 2.2, 1, C.ink), frame(66, 24, 44, 58)),
  'natv.mobilmast': all(rect(4, 92, 112, 20, GRASS, 0, null), path('M20 96 C40 80 80 80 100 96 Z', '#86b874', null), mast(60, 92, 78), waves(66, 22, 1, C.sky), waves(54, 22, 1, C.sky, -1),
    ...[[16, 100], [104, 100], [28, 104]].map(([x, y]) => all(line(`M${x} ${y} L${x} ${y! - 8}`, C.brown, 2), path(`M${x! - 5} ${y! - 6} L${x} ${y! - 18} L${x! + 5} ${y! - 6} Z`, C.green, C.ink, 1)))),
  // ── 3746 Nätverksproblem ─────────────────────────────────────────
  'natv.tappa-uppkopplingen': all(rect(4, 76, 112, 6, C.tan, 2, C.ink, 1.8), line('M12 82 L12 112 M108 82 L108 112', C.brown, 3), laptop(60, 76, 1.3, all(callFace(-6, -19, 1.2, true), greyed(fan(14, -24, 0.42, C.dark)), cross(14, -27, 3.4))),
    path('M26 22 L32 28 M96 20 L90 28', 'none', HL, 2), ring(78, 41, 9)),
  'natv.instabil.3': all(line('M8 96 L112 96', C.grey, 1.4), path('M10 86 L22 50 L32 82 L42 46 L52 88 L62 54 L72 90 L84 48 L94 86 L108 52', 'none', HL, 2.6),
    fan(22, 36, 0.6, C.green), greyed(fan(32, 72, 0.6, C.dark)), fan(42, 32, 0.6, C.green), greyed(fan(52, 76, 0.6, C.dark)), fan(62, 40, 0.6, C.green), greyed(fan(72, 78, 0.6, C.dark)), fan(84, 34, 0.6, C.green),
    frame(6, 20, 108, 80)),
  'natv.fabriksinställning': all(rect(14, 56, 70, 26, C.white, 4, C.ink, 2), ...range(3).map((i) => rect(22 + i * 14, 70, 8, 6, C.dark, 1, null)), circle(70, 70, 3, C.black, C.ink, 1),
    path('M100 98 L76 74 C74 72 76 70 78 72 L96 90 C100 94 104 90 100 86 L84 70', 'none', C.silver, 2.6), ring(70, 70, 10),
    path('M30 46 A26 26 0 1 1 82 46', 'none', HL, 2.6), arrow(82, 40, 82, 48, HL, 2.6), box(24, 100, 26, 18), router(24, 94, 0.28)),
  'natv.tekniker': all(rect(4, 10, 112, 102, '#efe6d6', 0, null), ground(), socket(98, 60, 1), router(98, 86, 0.45), rect(70, 98, 22, 12, C.red, 2, C.ink, 1.4), line('M76 98 L76 94 L86 94 L86 98', C.ink, 1.6),
    P({ x: 40, h: 0.86, top: C.navy, bottom: C.navy, mood: 'smile' }), path('M30 33 C32 24 48 24 50 33 L55 35 L28 35 Z', C.yellow, C.ink, 1.4), rect(28, 76, 24, 4, C.brown, 1, C.ink, 1), line('M56 74 L68 68', C.grey, 3)),
  // ── 3747 Hemnätverkets säkerhet ──────────────────────────────────
  'natv.standardlösenord': all(rect(10, 22, 100, 70, C.white, 6, C.ink, 2), circle(20, 32, 3, C.grey2, null), circle(100, 32, 3, C.grey2, null), circle(20, 82, 3, C.grey2, null), circle(100, 82, 3, C.grey2, null),
    sticker(28, 38, 64, 38, all(T(60, 56, '* * * *', 14), path('M34 46 L40 40 L40 44 L46 40 L46 50 L34 50 Z', C.grey, C.ink, 0.8))), frame(24, 34, 72, 46)),
  'natv.gästnätverk': all(ground(), router(60, 112, 0.7), fan(44, 70, 1, HL), fan(76, 70, 1, C.green), laptop(18, 112, 0.5), phone(18, 56, 0.6),
    P({ x: 100, h: 0.62, top: '#7ab0e8', mood: 'smile' }), phone(90, 82, 0.45), ring(76, 64, 16, C.green), line('M84 92 C60 96 40 96 26 92', C.grey, 1.4, '3 3'), cross(56, 95, 4)),
  'natv.snylta': all(ground(), rect(56, 14, 8, 98, '#b0a69a', 0, C.ink, 1.4), router(26, 112, 0.6), fan(26, 82, 1, HL), line('M44 66 C54 60 66 60 76 66', HL, 2.4, '3 3'),
    P({ x: 94, h: 0.7, top: C.purple, mood: 'laugh' }), laptop(96, 112, 0.5), path('M86 36 L90 32 M102 36 L98 32', 'none', C.ink, 1.4), ring(96, 98, 18)),
  'natv.föräldrakontroll': all(ground(), P({ x: 26, h: 0.86, top: C.green, mood: 'calm' }), phone(42, 64, 0.8, all(padlock(0, 0, 0.45))), arrow(52, 62, 70, 66, HL, 2.6),
    P({ x: 92, h: 0.55, top: C.orange, hairStyle: 'long', mood: 'smile' }), tablet(90, 70, 0.75, all(padlock(-6, 2, 0.4), circle(6, 0, 5, C.white, C.ink, 0.8), line('M6 0 L6 -3 M6 0 L8 1', C.ink, 0.8))), ring(90, 70, 18)),
  'natv.offentligt-wifi': all(rect(4, 8, 112, 104, '#f3e6d0', 0, null), ground(), rect(36, 14, 48, 30, C.dark, 3, C.ink, 1.6), fan(60, 38, 1.2, C.white), ring(60, 29, 22),
    rect(8, 86, 104, 6, C.brown, 2, C.ink, 1.6), line('M20 92 L20 112 M100 92 L100 112', C.brown, 3), laptop(32, 86, 0.5), laptop(86, 86, 0.5), circle(58, 82, 4, C.white, C.ink, 1.2), circle(66, 82, 4, C.white, C.ink, 1.2),
    P({ x: 14, h: 0.5, top: C.orange, hairStyle: 'long' }), P({ x: 106, h: 0.5, top: C.green })),
  'natv.VPN': all(ground(), laptop(18, 104, 0.55), globe(102, 74, 13), path('M34 74 C50 64 70 64 88 72', 'none', '#f6c39a', 16), path('M34 74 C50 64 70 64 88 72', 'none', HL, 1.6), padlock(60, 72, 0.8),
    greyed(P({ x: 60, h: 0.42 })), path('M48 104 C52 98 68 98 72 104', 'none', C.grey, 1.2), frame(28, 52, 66, 30)),
};
