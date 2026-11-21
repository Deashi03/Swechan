/**
 * Teknik & digital värld → Elektronik & energi → Elproduktion, 3931–3937 (0.57): hydro power, wind power,
 * solar cells, nuclear power, gas turbines, efficiency and the environmental impact of the energy system.
 * Recurring signs: the part that the word names is outlined in orange (ring or frame) and grey parts show
 * what the word is not. Electricity is a yellow bolt, heat is red (pipes, wavy lines), cold water is blue.
 * Moving parts (rotor blades, wheels, bolts on a cable, drops) are animated with kit.ts; the base state is
 * the poster frame. Digits only (elområde 1–4, a meter, years); no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waBob, waGrow, waIn, waPulse, waSpin, type Svg } from './kit';
import { HL, T, bolt } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const WATER = '#6fb3dc';
const WATER2 = '#4a93c4';
const CONCRETE = '#c7c2b8';
const HOT = '#d64545';
const COLD = '#3f7fc4';
const PANEL = '#2f5d9a';
const STEAM = '#eef1f4';
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const f1 = (n: number) => +n.toFixed(1);
const rad = (d: number) => (d * Math.PI) / 180;
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const waves = (x1: number, x2: number, y: number, col: string = C.white, amp = 1.6) =>
  line(`M${x1} ${y} ` + range(Math.floor((x2 - x1) / 8)).map(() => `q2 ${-amp} 4 0 q2 ${amp} 4 0`).join(' '), col, 1.2);
const tree = (x: number, y: number, s = 1) => at(x, y, s, rect(-1.5, -6, 3, 6, C.brown, 0.5, null), path('M0 -22 L7 -6 L-7 -6 Z', C.green, C.ink, 1));
const hills = (y: number) => path(`M0 ${y} C20 ${y - 10} 36 ${y - 12} 56 ${y - 4} C74 ${y - 14} 96 ${y - 10} 120 ${y - 2} L120 120 L0 120 Z`, '#cfe3b8', null);
const mountains = (y: number) => path(`M0 ${y} L18 ${y - 22} L30 ${y - 10} L48 ${y - 30} L66 ${y - 8} L84 ${y - 26} L104 ${y - 6} L120 ${y - 18} L120 ${y + 10} L0 ${y + 10} Z`, '#b9c3cf', C.ink, 1.2);
const snowcaps = (y: number) => path(`M42 ${y - 24} L48 ${y - 30} L54 ${y - 22} Z M79 ${y - 20} L84 ${y - 26} L90 ${y - 19} Z`, C.white, null);
/** House facing us, ground at y; `roof` draws on the right roof slope (local coordinates around the house). */
const house = (x: number, y: number, s = 1, wall: string = C.beige, roof: Svg = '', lit = false) => at(x, y, s,
  rect(-16, -22, 32, 22, wall, 1, C.ink, 1.6), path('M-20 -22 L0 -40 L20 -22 Z', C.red, C.ink, 1.6), roof,
  rect(-11, -17, 8, 7, lit ? C.yellow : '#bfe3f5', 1, C.ink, 1), rect(3, -17, 8, 7, lit ? C.yellow : '#bfe3f5', 1, C.ink, 1), rect(-4, -12, 8, 12, C.brown, 1, C.ink, 1));
/** Solar panels on the right roof slope of house(). */
const roofPanels = (col: string = PANEL) => all(path('M3 -37 L17 -24.5 L11 -24.5 L-2 -36 Z', col, C.ink, 0.8), path('M-2 -36 L11 -24.5 L5 -24.5 L-7 -35 Z', col, C.ink, 0.8), line('M1 -35 L13 -25 M-4 -34.5 L8 -25', '#9cc2ea', 0.6));
/** Lattice pylon standing on y. */
const pylon = (x: number, y: number, s = 1) => at(x, y, s, line('M-7 0 L-2 -34 L2 -34 L7 0 M-5 -12 L5 -12 M-4 -22 L4 -22 M-5 -12 L4 -22 M5 -12 L-4 -22 M-12 -30 L12 -30 M-9 -24 L9 -24', C.dark, 1.4));
/** Wind turbine: tower foot at (x, y), hub height h, blade length L; `blades` can be replaced (e.g. animated). */
const hubAt = (x: number, y: number, h: number) => [x, y - h] as const;
const bladeSet = (cx: number, cy: number, L: number, cols: string[] = [C.white, C.white, C.white], rot = 0) => all(
  circle(cx, cy, L, 'none', null), // keeps the bounding box centred on the hub (for spinning)
  ...range(3).map((i) => g(`rotate(${rot + i * 120} ${cx} ${cy})`, path(`M${cx - 1.6} ${cy} C${cx - 3} ${cy - L * 0.3} ${cx - 1.2} ${cy - L * 0.8} ${cx} ${cy - L} C${cx + 1.6} ${cy - L * 0.7} ${cx + 3} ${cy - L * 0.3} ${cx + 1.6} ${cy} Z`, cols[i]!, C.ink, 1))));
const turbine = (x: number, y: number, h: number, L: number, blades: Svg | null = null, body: string = C.white) => {
  const [cx, cy] = hubAt(x, y, h);
  return all(path(`M${x - h * 0.03 - 1} ${y} L${x - 0.8} ${cy} L${x + 0.8} ${cy} L${x + h * 0.03 + 1} ${y} Z`, body, C.ink, 1.1),
    rect(cx - 2, cy - 2.6, L * 0.22 + 4, 5.2, body, 1.5, C.ink, 1), blades ?? bladeSet(cx, cy, L), circle(cx, cy, Math.max(1.6, L * 0.08), C.grey2, C.ink, 1));
};
const spinning = (name: string, x: number, y: number, h: number, L: number, dur = 3) => {
  const [cx, cy] = hubAt(x, y, h);
  return turbine(x, y, h, L, waSpin(name, dur, bladeSet(cx, cy, L)));
};
/** Small power-station icon: hall with a bolt sign, ground at y. */
const station = (x: number, y: number, s = 1, col: string = '#d8d2c6') => at(x, y, s, rect(-14, -18, 28, 18, col, 1, C.ink, 1.4), path('M-16 -18 L16 -18 L12 -24 L-12 -24 Z', C.dark, C.ink, 1.2),
  rect(-10, -13, 6, 6, '#bfe3f5', 1, C.ink, 0.8), rect(4, -13, 6, 6, '#bfe3f5', 1, C.ink, 0.8), bolt(0, -32, 0.55));
const coin = (x: number, y: number, r = 4) => all(circle(x, y, r, C.gold, C.ink, 1), circle(x, y, r * 0.55, 'none', '#b58a22', 0.8));
const coinStack = (x: number, y: number, n: number) => all(...range(n).map((i) => all(ellipse(x, y - i * 3, 6, 2.2, C.gold, C.ink, 0.8))));
const heat = (x: number, y: number, s = 1, col: string = HOT) => at(x, y, s, line('M-5 6 C-8 2 -2 -2 -5 -6 M0 6 C-3 2 3 -2 0 -6 M5 6 C2 2 8 -2 5 -6', col, 1.6));
const clock = (x: number, y: number, r: number, arc = 0) => all(circle(x, y, r, C.white, C.ink, 1.4),
  arc ? path(arc >= 360 ? `M${x} ${y - r + 2} A${r - 2} ${r - 2} 0 1 1 ${f1(x - 0.01)} ${y - r + 2}` : `M${x} ${y - r + 2} A${r - 2} ${r - 2} 0 ${arc > 180 ? 1 : 0} 1 ${f1(x + Math.sin(rad(arc)) * (r - 2))} ${f1(y - Math.cos(rad(arc)) * (r - 2))}`, 'none', HL, 2.4) : '',
  line(`M${x} ${y} L${x} ${y - r * 0.6} M${x} ${y} L${x + r * 0.45} ${y}`, C.ink, 1.4), ...range(4).map((i) => circle(f1(x + Math.sin(rad(i * 90)) * (r - 4)), f1(y - Math.cos(rad(i * 90)) * (r - 4)), 0.9, C.ink, null)));
const flame = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -12 C6 -6 8 0 4 6 C2 8 -2 8 -4 6 C-8 0 -4 -4 0 -12 Z', C.orange, C.ink, 1), path('M0 -4 C3 -1 3 3 1 5 C-1 6 -3 4 -2 1 C-2 -1 -1 -2 0 -4 Z', C.yellow, null));
const drop = (x: number, y: number, s = 1, col: string = WATER) => path(`M${x} ${y - 6 * s} C${x + 5 * s} ${y} ${x + 4 * s} ${y + 5 * s} ${x} ${y + 5 * s} C${x - 4 * s} ${y + 5 * s} ${x - 5 * s} ${y} ${x} ${y - 6 * s} Z`, col, C.ink, 0.9);
const trefoil = (x: number, y: number, r: number) => all(circle(x, y, r, C.yellow, C.ink, 1.2), circle(x, y, r * 0.16, C.ink, null),
  ...range(3).map((i) => g(`rotate(${i * 120 - 90} ${x} ${y})`, path(`M${f1(x + r * 0.26)} ${f1(y - r * 0.15)} L${f1(x + r * 0.85)} ${f1(y - r * 0.5)} A${r * 0.98} ${r * 0.98} 0 0 1 ${f1(x + r * 0.85)} ${f1(y + r * 0.5)} L${f1(x + r * 0.26)} ${f1(y + r * 0.15)} Z`, C.ink, null))));
/** Simple standing person (front), feet on y. */
const worker = (x: number, y: number, s = 1, top: string = C.orange, helmet: string = C.yellow, extra: Svg = '') => at(x, y, s,
  path('M-6 0 L-5 -18 L5 -18 L6 0 L2 0 L0 -10 L-2 0 Z', C.navy, C.ink, 1.2), path('M-8 -18 L-7 -34 C-6 -38 6 -38 7 -34 L8 -18 Z', top, C.ink, 1.3),
  line('M-7 -32 L-12 -20 M7 -32 L12 -20', C.ink, 4), line('M-7 -32 L-12 -20 M7 -32 L12 -20', top, 2.6), circle(-12, -19, 2, C.skin, C.ink, 0.8), circle(12, -19, 2, C.skin, C.ink, 0.8),
  rect(-2, -40, 4, 4, C.skin, 1, null), circle(0, -45, 6, C.skin, C.ink, 1.3), path('M-7 -46 C-7 -55 7 -55 7 -46 L9 -45 L-9 -45 Z', helmet, C.ink, 1.2), extra);

// ── Shared layouts ───────────────────────────────────────────────────
/** Sweden as four electricity price areas (1 north … 4 south); `hi` marks one area. */
const SWEDEN: [number, number][] = [[79, 5], [88, 12], [90, 22], [84, 30], [79, 42], [74, 52], [72, 60], [70, 68], [72, 76], [68, 84], [64, 92], [60, 100], [54, 108], [46, 112], [40, 106], [38, 98], [34, 90], [36, 80], [42, 70], [46, 60], [52, 50], [58, 40], [64, 30], [70, 18]];
const areaCols = ['#cfe3f5', '#bfe0c9', '#f6e2a8', '#f6c9b5'];
const priceAreas = (hi = 0) => {
  const cuts = [38, 66, 90];
  const clipped = (ylo: number, yhi: number) => {
    // clip the outline to a horizontal band (Sutherland–Hodgman for two horizontal lines)
    const clip = (pts: [number, number][], yc: number, keepBelow: boolean) => {
      const out: [number, number][] = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]!, b = pts[(i + 1) % pts.length]!;
        const ina = keepBelow ? a[1] >= yc : a[1] <= yc, inb = keepBelow ? b[1] >= yc : b[1] <= yc;
        if (ina) out.push(a);
        if (ina !== inb) { const t = (yc - a[1]) / (b[1] - a[1]); out.push([f1(a[0] + t * (b[0] - a[0])), yc]); }
      }
      return out;
    };
    return clip(clip(SWEDEN, ylo, true), yhi, false);
  };
  const bands = [[0, cuts[0]!], [cuts[0]!, cuts[1]!], [cuts[1]!, cuts[2]!], [cuts[2]!, 120]] as const;
  const labels: [number, number][] = [[78, 26], [64, 54], [56, 80], [50, 102]];
  return all(...bands.map(([lo, hi2], i) => path('M' + clipped(lo, hi2).map(([x, y]) => `${x} ${y}`).join(' L') + ' Z', areaCols[i]!, i + 1 === hi ? HL : C.ink, i + 1 === hi ? 2.6 : 1.2)),
    ...labels.map(([x, y], i) => T(x, y + 4, String(i + 1), 11, i + 1 === hi ? HL : C.ink)));
};
/** Hydro scene: lake behind a dam on the left, power station below the dam, river out to the right. */
const hydro = (mark: 'station' | 'lake') => {
  const lake = all(rect(4, 40, 40, 62, WATER, 0, null), waves(6, 40, 46), waves(8, 40, 56, '#a7d2ec'));
  const dam = path('M40 36 L50 36 L60 102 L40 102 Z', CONCRETE, C.ink, 1.6);
  const pipe = line('M42 92 L64 94', C.dark, 4);
  const hall = all(rect(58, 76, 34, 26, '#e3ddd2', 1, C.ink, 1.6), path('M56 76 L94 76 L90 70 L60 70 Z', C.dark, C.ink, 1.2), rect(62, 82, 8, 8, '#bfe3f5', 1, C.ink, 1), rect(74, 82, 8, 8, '#bfe3f5', 1, C.ink, 1),
    circle(86, 86, 3, C.grey, C.ink, 1), line('M86 86 L86 83 M86 86 L89 87', C.ink, 1));
  const river = all(path('M92 98 L116 96 L116 106 L92 104 Z', WATER2, null), waves(94, 114, 100), mark === 'station' ? waIn('pg-vkv-vatten', -16, 0, arrow(96, 102, 112, 101, C.white, 1.8)) : '');
  const lines = all(line('M90 72 L104 62 L116 58', C.dark, 1.2), pylon(104, 102, 1.2), bolt(108, 36, 0.8));
  return all(mountains(40), snowcaps(40), rect(0, 102, 120, 18, '#cfe3b8', 0, null), ground(),
    mark === 'station' ? all(lake, dam, pipe, hall, river, lines, frame(54, 66, 42, 40))
      : all(lake, path('M4 40 L44 40', 'none', WATER2, 1), greyed(dam, hall, lines), river, line('M42 52 L52 52 M42 64 L54 64 M42 76 L56 76', C.white, 1, '2 2'), path('M4 40 L41 40 L41 102 L4 102 Z', 'none', HL, 2.6)));
};
/** Weather → output, one panel: wind (or still air) above a turbine, a lamp below. */
const weatherPanel = (x: number, windy: boolean, name: string) => all(
  windy ? waPulse(`${name}-vind`, line(`M${x - 22} 18 C${x - 12} 14 ${x - 4} 22 ${x + 6} 16 M${x - 24} 28 C${x - 14} 24 ${x - 6} 32 ${x + 4} 26`, C.denim, 1.8)) : all(circle(x - 10, 20, 7, C.yellow, C.ink, 1.2), line(`M${x - 24} 30 L${x + 6} 30`, C.grey, 1.4, '2 3')),
  windy ? spinning(name, x + 8, 92, 44, 16, 2) : turbine(x + 8, 92, 44, 16),
  line(`M${x + 8} 92 L${x + 8} 98 L${x - 8} 98 L${x - 8} 92`, C.ink, 1.2),
  windy ? all(...[-1, 0, 1].map((i) => line(`M${x - 8 + i * 9} 74 l${i * 2} -4`, C.gold, 2)), circle(x - 8, 82, 7, C.yellow, C.ink, 1.4)) : circle(x - 8, 82, 7, C.grey2, C.ink, 1.4),
  rect(x - 11, 88, 6, 4, C.grey, 1, C.ink, 1));

// ── Motifs ───────────────────────────────────────────────────────────
export const POWGEN_MOTIFS: Record<string, Svg> = {
  // ── 3931 Vattenkraftverk ─────────────────────────────────────────
  'powgen.vattenkraftverk': hydro('station'),
  'powgen.vattenmagasin': hydro('lake'),
  // elproduktion: water turns the generator, and bolts run out along the cable to the houses
  'powgen.elproduktion': all(ground(), rect(4, 70, 30, 42, WATER, 0, null), waves(6, 32, 78), arrow(10, 92, 30, 92, C.white, 2.4),
    rect(30, 52, 48, 60, '#e3ddd2', 2, C.ink, 1.6), path('M28 52 L80 52 L74 44 L34 44 Z', C.dark, C.ink, 1.2),
    circle(54, 82, 16, C.grey2, C.ink, 1.6), waSpin('pg-elprod-rotor', 2.4, circle(54, 82, 13, 'none', null), ...range(6).map((i) => g(`rotate(${i * 60} 54 82)`, rect(52.5, 69, 3, 13, C.dark, 1, null)))), circle(54, 82, 3, C.gold, C.ink, 1),
    line('M78 64 L96 56 L116 56', C.dark, 1.6), pylon(98, 112, 1.3), house(112, 112, 0.5, C.beige, '', true),
    waIn('pg-elprod-bolt', -26, 8, bolt(92, 44, 0.8)), waIn('pg-elprod-bolt2', -30, 10, bolt(110, 70, 0.6)), ring(54, 82, 22)),
  // utbyggnad: grey stations that already exist, new ones grow up beside them, a crane builds
  'powgen.utbyggnad': all(ground(), greyed(station(18, 112, 0.9), station(44, 112, 0.9)),
    waGrow('pg-utbyggnad', station(72, 112, 0.9), station(100, 112, 0.9)),
    line('M86 112 L86 30 L116 30 M86 38 L94 30 M86 30 L66 30', C.orange, 2.4), line('M70 30 L70 54', C.ink, 1), rect(66, 54, 8, 5, C.dark, 1, null),
    frame(56, 52, 60, 64), arrow(30, 22, 62, 22, HL, 3), line('M14 22 L22 22 M18 18 L18 26', HL, 2.6)),
  'powgen.elområde': all(priceAreas(4), all(rect(88, 92, 26, 16, C.white, 2, C.ink, 1.2), coinStack(95, 104, 3), coinStack(105, 104, 4)), arrow(86, 100, 68, 100, HL, 2.2)),
  // ── 3932 Vindkraftverk ───────────────────────────────────────────
  'powgen.rotorblad': all(hills(108), ground(), (() => { const [cx, cy] = hubAt(60, 112, 66); return all(turbine(60, 112, 66, 40, bladeSet(cx, cy, 40, [HL, C.white, C.white], -20))); })(),
    ring(48, 26, 16)),
  'powgen.snurra': all(ground(), line('M60 112 L60 58', C.brown, 3),
    waSpin('pg-snurra', 1.4, circle(60, 52, 26, 'none', null), ...[C.red, C.yellow, C.sky, C.green].map((c, i) => g(`rotate(${i * 90} 60 52)`, path('M60 52 L60 28 C70 30 74 40 60 52 Z', c, C.ink, 1.3)))),
    circle(60, 52, 2.6, C.white, C.ink, 1), path('M60 16 A36 36 0 0 1 94 62', 'none', HL, 2.4), arrow(96, 56, 92, 68, HL, 2.4), path('M60 88 A36 36 0 0 1 26 42', 'none', HL, 2.4), arrow(24, 48, 28, 36, HL, 2.4),
    line('M6 40 C14 36 20 44 28 40 M4 54 C12 50 18 58 26 54', C.denim, 1.6)),
  'powgen.väderberoende': all(rect(4, 6, 54, 104, '#eaf4fb', 4, null), weatherPanel(30, true, 'pg-vader'), greyed(rect(62, 6, 54, 104, '#f1f1f1', 4, null), weatherPanel(88, false, 'pg-vader2')),
    line('M60 10 L60 108', C.grey2, 1.2, '3 3'), arrow(18, 34, 18, 66, HL, 2.2), frame(4, 6, 54, 104)),
  'powgen.vindpark': all(hills(96), rect(0, 96, 120, 24, '#cfe3b8', 0, null),
    spinning('pg-vindpark1', 22, 92, 40, 15, 3.4), spinning('pg-vindpark2', 52, 84, 48, 17, 3.1), spinning('pg-vindpark3', 86, 90, 42, 15, 3.6), turbine(104, 70, 22, 8), turbine(38, 64, 20, 7), turbine(70, 62, 18, 7),
    frame(4, 22, 112, 88)),
  'powgen.havsbaserad': all(rect(0, 74, 120, 46, WATER, 0, null), waves(4, 116, 84), waves(8, 112, 96), waves(4, 116, 108),
    greyed(path('M0 60 L22 58 L30 74 L0 74 Z', '#cfe3b8', C.ink, 1), turbine(12, 60, 26, 9)),
    ...[[50, 92, 56, 18], [86, 86, 48, 16], [108, 80, 32, 11]].map(([x, y, h, L], i) => all(rect(x! - 3, y! - 4, 6, 8, C.yellow, 1, C.ink, 1), i < 2 ? spinning(`pg-havs${i}`, x!, y! - 4, h!, L!, 3 + i * 0.4) : turbine(x!, y! - 4, h!, L!))),
    path('M36 74 L120 74', 'none', HL, 2.6)),
  'powgen.vindkrafttekniker': all(rect(0, 0, 120, 120, '#e6f2fa', 0, null), path('M10 108 C30 104 50 104 70 108', 'none', '#cfe3b8', 3), path('M70 120 L76 76 L84 76 L90 120 Z', C.white, C.ink, 1.4),
    rect(30, 60, 86, 18, C.white, 5, C.ink, 1.6), circle(116, 69, 7, C.grey2, C.ink, 1.2), line('M118 62 L120 36 M118 76 L120 104', C.ink, 3),
    worker(60, 60, 1, C.orange, C.yellow, all(line('M0 -26 L14 -40 L22 -48', C.ink, 1, '2 2'), path('M12 -21 l7 -2 l1 3 l-7 2 Z', C.grey, C.ink, 0.8))),
    rect(36, 52, 12, 8, C.red, 1, C.ink, 1), ring(60, 34, 30)),
  // ── 3933 Solceller ───────────────────────────────────────────────
  'powgen.solcellsanläggning': all(ground(), house(40, 112, 2, C.beige, roofPanels()), line('M72 70 L78 70 L78 82', C.ink, 1.6), rect(74, 82, 10, 12, C.silver, 1.5, C.ink, 1.2), rect(76, 84, 6, 3, C.green, 0.5, null),
    line('M84 88 L96 88 L96 66 L110 54', C.ink, 1.4), pylon(108, 112, 1.2), sunRays(14, 14),
    frame(30, 26, 58, 72)),
  'powgen.installera.2': all(ground(), house(44, 112, 2, C.beige, all(path('M3 -37 L17 -24.5 L11 -24.5 L-2 -36 Z', PANEL, C.ink, 0.8), line('M-7 -35 L5 -24.5', C.grey, 0.8, '1.4 1'))),
    waIn('pg-installera', 22, -22, path('M28 46 L52 68 L40 68 L16 46 Z', PANEL, HL, 2.2), line('M22 46 L46 68 M20 52 L40 52', '#9cc2ea', 0.8)),
    worker(96, 112, 1, C.navy, C.yellow, line('M12 -20 L20 -30', C.dark, 2.4)), line('M116 82 L108 82', C.dark, 2)),
  'powgen.växelriktare': all(rect(0, 0, 120, 120, '#ece6dc', 0, null), rect(36, 30, 48, 58, C.silver, 4, C.ink, 1.8), rect(44, 40, 32, 16, '#2f3a33', 2, C.ink, 1), line('M48 50 L54 44 L60 48 L68 42 L72 46', C.green, 1.4),
    circle(60, 70, 6, C.grey2, C.ink, 1.2), line('M36 78 L6 78 L6 30', C.ink, 1.6), rect(4, 16, 14, 12, PANEL, 1, C.ink, 1), line('M10 92 L28 92', C.denim, 2.4),
    line('M84 78 L112 78 L112 96', C.ink, 1.6), rect(106, 96, 12, 14, C.white, 2, C.ink, 1.2), circle(110, 103, 1.2, C.ink, null), circle(114, 103, 1.2, C.ink, null),
    line('M90 92 q3 -6 6 0 q3 6 6 0 q3 -6 6 0', C.red, 2.2), ring(60, 59, 34)),
  'powgen.mikroproducent': all(ground(), house(34, 112, 1.9, C.beige, roofPanels()), sunRays(14, 14), pylon(100, 112, 1.2),
    waIn('pg-mikro-el', -30, 0, bolt(78, 50, 0.8)), arrow(62, 62, 94, 62, HL, 2.6), waIn('pg-mikro-pengar', 30, 0, coin(78, 88, 5)), arrow(94, 96, 62, 96, C.gold, 2.6), frame(8, 32, 56, 82)),
  'powgen.återbetalningstid': all(line('M14 104 L114 104 M14 104 L14 14', C.ink, 1.6), line('M14 34 L114 34', HL, 1.6, '4 3'),
    greyed(rect(18, 34, 12, 70, C.grey, 1, C.ink, 1)), ...range(6).map((i) => rect(36 + i * 13, f1(104 - (i + 1) * 12.4), 10, f1((i + 1) * 12.4), i === 5 ? C.gold : '#f2dc93', 1, C.ink, 1)),
    ring(41 + 5 * 13, 34, 9), T(76, 116, '1 → 12', 9, C.ink), rect(18, 18, 12, 10, PANEL, 1, C.ink, 1)),
  'powgen.solfångare': all(ground(), rect(14, 58, 92, 54, C.beige, 1, C.ink, 1.6), path('M8 58 L60 22 L112 58 Z', C.red, C.ink, 1.6),
    path('M66 30 L100 54 L84 54 L52 32 Z', C.dark, C.ink, 1.2), line('M58 32 L90 54 M62 31 L94 54 M54 33 L86 54', C.grey, 0.8),
    line('M92 56 L92 74 L70 74 L70 90', HOT, 2.6), rect(60, 90, 20, 18, C.silver, 3, C.ink, 1.2), line('M80 98 L94 98 L94 84', HOT, 2.2), path('M90 84 L98 84 L96 80 L92 80 Z', C.grey, C.ink, 1),
    line('M90 88 l-2 6 M94 88 l0 6 M98 88 l2 6', WATER, 1.4), heat(102, 74, 0.8), circle(18, 16, 8, C.yellow, C.ink, 1.2), line('M30 22 C34 26 30 30 34 34 M38 18 C42 22 38 26 42 30', HOT, 1.6), ring(77, 42, 26)),
  // ── 3934 Kärnkraftverk ───────────────────────────────────────────
  'powgen.kärnkraftverk': all(rect(0, 92, 120, 28, WATER, 0, null), waves(4, 116, 100), waves(8, 112, 110), rect(0, 86, 120, 6, '#cfe3b8', 0, null),
    rect(10, 52, 30, 34, '#e9e4da', 2, C.ink, 1.6), path('M10 52 C10 34 40 34 40 52 Z', '#d8d2c6', C.ink, 1.6), rect(40, 62, 46, 24, '#dcd6ca', 1, C.ink, 1.6), ...range(5).map((i) => rect(44 + i * 8, 68, 5, 6, '#bfe3f5', 1, C.ink, 0.8)),
    rect(86, 70, 10, 16, C.grey2, 1, C.ink, 1.2), line('M96 72 L106 62 L118 60', C.dark, 1.2), pylon(108, 86, 1), frame(6, 30, 94, 60)),
  'powgen.kärnbränsle': all(rect(16, 10, 30, 98, '#dfe3e8', 2, C.ink, 1.6), ...range(5).map((i) => rect(19 + i * 5.4, 14, 3.4, 90, C.silver, 1.5, C.ink, 0.8)), rect(14, 30, 34, 4, C.grey, 1, C.ink, 1), rect(14, 70, 34, 4, C.grey, 1, C.ink, 1),
    circle(30, 54, 7, 'none', HL, 2), line('M36 50 L64 40', HL, 2), circle(84, 50, 30, C.white, HL, 2.6),
    ...range(4).map((i) => all(rect(72, 28 + i * 11, 24, 9, '#4d5a4a', 3, C.ink, 1), ellipse(96, 32.5 + i * 11, 2, 4.5, '#6b7a66', C.ink, 0.8)))),
  'powgen.kylvatten': all(rect(0, 84, 120, 36, WATER, 0, null), waves(4, 116, 96), waves(8, 112, 108), rect(0, 78, 120, 6, '#cfe3b8', 0, null),
    greyed(rect(30, 40, 30, 38, '#e9e4da', 2, C.ink, 1.4), path('M30 40 C30 24 60 24 60 40 Z', '#d8d2c6', C.ink, 1.4), rect(60, 54, 36, 24, '#dcd6ca', 1, C.ink, 1.4)),
    line('M18 104 L18 70 L34 70', COLD, 5), arrow(18, 100, 18, 80, C.white, 2), line('M90 70 L104 70 L104 104', HOT, 5), arrow(104, 80, 104, 100, C.white, 2),
    circle(12, 60, 5, COLD, C.ink, 1), rect(10.5, 44, 3, 14, C.white, 1.5, C.ink, 1), circle(110, 60, 5, HOT, C.ink, 1), rect(108.5, 44, 3, 14, C.white, 1.5, C.ink, 1), rect(109.2, 48, 1.6, 10, HOT, 0, null),
    frame(8, 64, 104, 46)),
  'powgen.strålning.2': all(rect(40, 66, 40, 42, C.grey2, 3, C.ink, 1.6), rect(54, 50, 12, 22, '#b6e36a', 3, C.ink, 1.4), trefoil(60, 88, 11),
    ...[-62, -30, 30, 62].map((d, i) => g(`rotate(${d} 60 56)`, waPulse(`pg-straln${i}`, line('M60 40 q-3 -4 0 -8 q3 -4 0 -8 q-3 -4 0 -8', HL, 2.2)))),
    rect(92, 70, 18, 30, C.yellow, 3, C.ink, 1.4), rect(95, 74, 12, 10, C.white, 1, C.ink, 1), line('M96 82 L105 76', HOT, 1.4), circle(101, 92, 3, C.dark, null)),
  'powgen.härdsmälta': all(path('M30 20 C30 8 90 8 90 20 L90 96 C90 112 30 112 30 96 Z', C.grey2, C.ink, 2), path('M36 26 L84 26 L84 94 C84 104 36 104 36 94 Z', '#f2f2f2', C.ink, 1),
    line('M36 80 L84 80', WATER, 1.4, '3 2'), waPulse('pg-hardsmalta-glod', ...range(5).map((i) => rect(42 + i * 8, 40, 5, 34, i % 2 ? C.orange : HOT, 1.5, C.ink, 0.8))),
    path('M40 92 C46 84 54 90 60 86 C66 90 74 84 80 92 C80 100 40 100 40 92 Z', HOT, C.ink, 1.2),
    moving('pg-hardsmalta-dropp', '0%{transform:translate(0,-14px);opacity:0}30%{opacity:1}100%{transform:translate(0,4px);opacity:1}', { dur: 1.8 }, drop(52, 82, 0.8, C.orange), drop(68, 80, 0.8, C.orange)),
    heat(18, 60, 1.1), heat(102, 60, 1.1), ring(60, 66, 34)),
  'powgen.jodtablett': all(rect(16, 30, 64, 46, C.silver, 4, C.ink, 1.6), ...range(6).map((i) => all(circle(28 + (i % 3) * 20, 44 + Math.floor(i / 3) * 18, 6.5, '#e6eaee', C.ink, 1), i === 5 ? circle(68, 62, 4.6, '#d8dde2', null) : circle(28 + (i % 3) * 20, 44 + Math.floor(i / 3) * 18, 4.6, C.white, C.ink, 0.8))),
    circle(88, 92, 6, C.white, C.ink, 1.2), line('M84 92 L92 92', C.grey, 1), path('M96 60 L112 60 L110 108 L98 108 Z', '#e4f2fb', C.ink, 1.4), rect(98.5, 74, 11, 32, WATER, 1, null),
    trefoil(102, 22, 8), ring(48, 53, 36)),
  // ── 3935 Gasturbiner ─────────────────────────────────────────────
  'powgen.gasturbin': all(rect(4, 62, 22, 26, C.dark, 3, C.ink, 1.4), line('M26 75 L34 75', C.ink, 3), path('M34 56 L58 50 L82 50 L104 58 L104 92 L82 100 L58 100 L34 94 Z', C.silver, C.ink, 1.8),
    ...range(5).map((i) => line(`M${38 + i * 4} ${58 + i * 1.2} L${38 + i * 4} ${92 - i * 1.2}`, C.denim, 2)), ellipse(66, 75, 8, 12, '#f6e0c4', C.ink, 1), flame(66, 78, 0.9),
    ...range(3).map((i) => line(`M${80 + i * 5} 56 L${80 + i * 5} 94`, C.dark, 2.2)), line('M34 75 L104 75', C.grey, 1.2),
    arrow(14, 44, 36, 56, COLD, 2.4), waIn('pg-gasturbin-ut', -10, 0, heat(112, 68, 0.9), heat(112, 84, 0.9)), bolt(14, 52, 0.7), frame(30, 44, 80, 62)),
  'powgen.driva.3': all(ground(), line('M6 22 L26 22 L26 34', C.grey, 5), waIn('pg-driva-vatten', 0, -10, line('M26 38 l0 8 M22 40 l0 6 M30 40 l0 6', WATER2, 2)),
    waSpin('pg-driva', 2, circle(32, 66, 22, C.white, C.ink, 1.6), ...range(8).map((i) => g(`rotate(${i * 45} 32 66)`, rect(29, 42, 6, 10, C.brown, 1, C.ink, 0.8)))), circle(32, 66, 4, C.dark, null),
    rect(14, 92, 36, 20, WATER, 2, null), line('M32 66 L76 66', C.dark, 3.4), rect(76, 52, 26, 28, C.grey2, 3, C.ink, 1.6), circle(89, 66, 7, C.dark, C.ink, 1),
    line('M102 60 L110 60 L110 40', C.ink, 1.4), waPulse('pg-driva-lampa', ...[-1, 0, 1].map((i) => line(`M${110 + i * 9} 22 l${i * 2} -4`, C.gold, 2))), circle(110, 32, 7, C.yellow, C.ink, 1.4),
    arrow(46, 82, 72, 82, HL, 2.6), ring(32, 66, 27)),
  'powgen.reservkraft': all(ground(), rect(36, 40, 50, 72, C.white, 2, C.ink, 1.6), rect(58, 44, 6, 16, C.red, 0, null), rect(53, 49, 16, 6, C.red, 0, null),
    ...range(6).map((i) => rect(42 + (i % 3) * 14, 64 + Math.floor(i / 3) * 18, 10, 10, C.yellow, 1, C.ink, 1)),
    greyed(pylon(14, 112, 1.1), line('M14 82 L24 70', C.dark, 1.2), line('M24 70 L30 64', C.dark, 1.2, '2 3')), path('M26 60 L32 66 L28 66 L34 72', 'none', C.grey, 1.6),
    rect(92, 88, 24, 24, C.green, 3, C.ink, 1.6), rect(96, 92, 16, 6, C.dark, 1, null), line('M92 100 L86 100', C.ink, 2), waPulse('pg-reserv', bolt(104, 76, 0.7)), frame(88, 64, 30, 50)),
  'powgen.planerbar': all(rect(14, 40, 56, 70, C.silver, 4, C.ink, 1.8), circle(42, 70, 16, C.white, C.ink, 1.6),
    ...range(7).map((i) => line(`M${f1(42 + Math.cos(rad(150 + i * 40)) * 19)} ${f1(70 + Math.sin(rad(150 + i * 40)) * 19)} L${f1(42 + Math.cos(rad(150 + i * 40)) * 22)} ${f1(70 + Math.sin(rad(150 + i * 40)) * 22)}`, C.ink, 1.2)),
    moving('pg-planerbar', '0%,15%{transform:rotate(-70deg)}55%,100%{transform:rotate(0)}', { dur: 3, spin: true }, circle(42, 70, 13, 'none', null), line('M42 70 L42 58', HL, 3)), circle(42, 70, 3, C.dark, null),
    rect(20, 96, 44, 8, C.white, 1, C.ink, 1), moving('pg-planerbar-stapel', '0%,15%{transform:scale(.2,1)}55%,100%{transform:scale(1,1)}', { dur: 3 }, rect(20, 96, 40, 8, C.green, 1, null)),
    clock(42, 22, 13), greyed(turbine(98, 108, 44, 14), path('M84 30 C80 22 92 16 96 22 C100 16 112 20 108 30 Z', C.grey2, C.ink, 1)), frame(10, 6, 64, 108)),
  'powgen.effekttopp': all(line('M12 100 L112 100 M12 100 L12 14', C.ink, 1.6), path('M12 84 C24 84 30 86 36 80 L44 30 L52 72 C62 76 72 70 84 58 C92 50 98 62 112 78', 'none', C.denim, 2.4),
    line('M44 30 L44 100', HL, 1.2, '3 3'), clock(44, 110, 7), ring(44, 32, 10), line('M20 12 L20 24 M14 18 L26 18 M16 14 L24 22 M24 14 L16 22', COLD, 1.4), circle(100, 22, 6, C.yellow, C.ink, 1)),
  // ── 3936 Elproduktionens verkningsgrad ───────────────────────────
  'powgen.kilowattimme': all(rect(14, 20, 50, 70, C.white, 4, C.ink, 1.8), rect(20, 30, 38, 16, C.dark, 2, C.ink, 1), ...['0', '0', '4', '2'].map((d, i) => T(25 + i * 9, 43, d, 11, i === 3 ? HL : C.white)),
    waBob('pg-kwh', 1.5, rect(48, 31, 9, 14, 'none', 1, HL, 1.6)), circle(39, 66, 10, C.grey2, C.ink, 1.2), line('M33 66 L45 66', C.ink, 1.2), rect(26, 96, 26, 6, C.grey, 1, C.ink, 1),
    clock(90, 34, 18, 360), rect(74, 76, 32, 30, '#f1f1f1', 3, C.ink, 1.4), ...range(4).map((i) => line(`M${80 + i * 7} 80 L${80 + i * 7} 102`, C.grey, 2)), heat(90, 66, 0.9), line('M64 88 L74 88', C.ink, 1.6)),
  'powgen.kyltorn': all(ground(), rect(0, 100, 120, 12, '#cfe3b8', 0, null), path('M14 100 C22 78 20 58 16 44 L48 44 C44 58 42 78 50 100 Z', '#e5e1d8', C.ink, 1.6), path('M58 100 C66 76 64 54 60 38 L94 38 C90 54 88 76 96 100 Z', '#e5e1d8', C.ink, 1.6),
    waBob('pg-kyltorn', 3, path('M16 44 C6 36 14 22 26 26 C30 14 46 16 46 28 C56 26 56 42 48 44 Z', STEAM, C.ink, 1.2), path('M60 38 C48 30 56 10 72 16 C78 2 98 6 96 20 C110 20 108 38 94 38 Z', STEAM, C.ink, 1.2)),
    rect(100, 82, 16, 18, '#dcd6ca', 1, C.ink, 1.2), frame(54, 34, 46, 70)),
  // utnyttja (använda väl): squeeze every drop out of the lemon
  'powgen.utnyttja.2': all(path('M34 66 L76 66 L72 110 L38 110 Z', '#e4f2fb', C.ink, 1.6), rect(39, 86, 32, 23, '#f6e08a', 1, null),
    moving('pg-utnyttja', '0%,100%{transform:translate(0,0)}50%{transform:translate(0,2px)}', { dur: 1.2 }, ellipse(55, 40, 20, 13, C.yellow, C.ink, 1.6), path('M73 37 l6 -2 l-1 6 Z', C.yellow, C.ink, 1),
      path('M40 26 C40 18 70 18 70 26 L72 46 C72 54 40 54 40 46 Z', C.skin, C.ink, 1.6), line('M48 22 L48 50 M56 21 L56 51 M64 22 L64 50', C.ink, 0.9), path('M40 34 C32 34 30 46 40 46', C.skin, C.ink, 1.4)),
    moving('pg-utnyttja-dropp', '0%{transform:translate(0,-6px);opacity:0}30%{opacity:1}100%{transform:translate(0,28px);opacity:0}', { dur: 1.4 }, drop(50, 60, 0.8, '#f2c14e'), drop(60, 62, 0.8, '#f2c14e')),
    ring(55, 86, 30)),
  'powgen.kraftvärmeverk': all(ground(), rect(36, 60, 40, 52, '#e3ddd2', 2, C.ink, 1.6), rect(62, 22, 10, 38, C.grey2, 1, C.ink, 1.4), path('M62 22 C58 12 70 6 76 14', 'none', C.grey, 1.6),
    line('M36 72 L24 64 L8 64', C.dark, 1.4), pylon(14, 112, 1.1), bolt(26, 50, 0.7),
    line('M76 96 L104 96 L104 104', HOT, 3.4), heat(92, 86, 0.8), house(106, 112, 0.55, C.beige), rect(42, 76, 10, 10, '#bfe3f5', 1, C.ink, 1), rect(56, 76, 10, 10, '#bfe3f5', 1, C.ink, 1),
    flame(56, 104, 0.7), frame(32, 18, 48, 96)),
  // ── 3937 Energisystemets miljöpåverkan ───────────────────────────
  'powgen.energisystem': all(...[[16, 'w'], [42, 't'], [68, 'n'], [96, 's']].map(([x, k]) => k === 'w' ? all(drop(+x!, 18, 1.4)) : k === 't' ? turbine(+x!, 30, 20, 8) : k === 'n' ? all(rect(+x! - 8, 16, 16, 14, '#e9e4da', 1, C.ink, 1.2), path(`M${+x! - 8} 16 C${+x! - 8} 8 ${+x! + 8} 8 ${+x! + 8} 16 Z`, '#d8d2c6', C.ink, 1.2)) : all(circle(+x!, 20, 7, C.yellow, C.ink, 1.2))),
    line('M16 34 L60 56 M42 34 L60 56 M68 34 L60 56 M96 34 L60 56', HL, 2), pylon(60, 78, 0.8),
    line('M60 78 L20 96 M60 78 L60 96 M60 78 L100 96', HL, 2), house(20, 112, 0.6), rect(48, 98, 24, 14, C.grey2, 1, C.ink, 1.2), path('M48 98 L54 92 L60 98 L66 92 L72 98', C.grey2, C.ink, 1), rect(90, 102, 22, 8, C.denim, 3, C.ink, 1.2), circle(95, 111, 2.6, C.dark, null), circle(107, 111, 2.6, C.dark, null),
    frame(4, 4, 112, 112)),
  'powgen.energikälla.2': all(circle(32, 46, 18, C.yellow, C.ink, 1.6), ...range(8).map((i) => line(`M${f1(32 + Math.cos(rad(i * 45)) * 22)} ${f1(46 + Math.sin(rad(i * 45)) * 22)} L${f1(32 + Math.cos(rad(i * 45)) * 28)} ${f1(46 + Math.sin(rad(i * 45)) * 28)}`, C.gold, 2.4)),
    waIn('pg-energikalla', -24, 0, arrow(64, 46, 86, 46, HL, 3)), bolt(100, 36, 1), flame(100, 62, 0.9), ring(32, 46, 32),
    greyed(turbine(30, 112, 22, 8), drop(56, 102, 1.3), rect(76, 92, 14, 18, C.dark, 2, C.ink, 1.2), line('M76 98 L90 98 M76 104 L90 104', C.grey, 1), path('M102 110 L102 96 L108 90 L114 96 L114 110 Z', '#d8d2c6', C.ink, 1))),
  'powgen.elmix': (() => {
    const slices: [number, string][] = [[40, WATER], [30, '#b6a1d9'], [22, '#a8dcc0'], [8, C.yellow]];
    let a0 = -90;
    const parts = slices.map(([pct, col]) => {
      const a1 = a0 + pct * 3.6, large = a1 - a0 > 180 ? 1 : 0;
      const p = path(`M60 62 L${f1(60 + Math.cos(rad(a0)) * 42)} ${f1(62 + Math.sin(rad(a0)) * 42)} A42 42 0 ${large} 1 ${f1(60 + Math.cos(rad(a1)) * 42)} ${f1(62 + Math.sin(rad(a1)) * 42)} Z`, col, C.ink, 1.4);
      a0 = a1; return p;
    });
    return all(...parts, drop(84, 74, 1.5, WATER2), all(rect(30, 66, 14, 12, '#e9e4da', 1, C.ink, 1), path('M30 66 C30 58 44 58 44 66 Z', '#d8d2c6', C.ink, 1)), turbine(44, 50, 18, 7), circle(62, 28, 4, C.yellow, C.ink, 1), ring(60, 62, 48));
  })(),
  'powgen.ingrepp.2': all(mountains(36), rect(0, 50, 120, 70, '#cfe3b8', 0, null), ...[[10, 70], [22, 62], [14, 92], [28, 84], [8, 112], [26, 108], [92, 66], [104, 58], [96, 90], [110, 84], [92, 112], [110, 110]].map(([x, y]) => tree(x!, y!, 1.2)),
    path('M40 50 L80 50 L84 120 L36 120 Z', '#c9a77c', null), ...[[48, 70], [70, 84], [52, 100], [74, 108]].map(([x, y]) => all(ellipse(x!, y!, 3.4, 1.6, '#e6d3b3', C.ink, 0.8))),
    waIn('pg-ingrepp', 0, 40, rect(50, 34, 26, 14, C.yellow, 2, C.ink, 1.4), rect(56, 26, 12, 9, C.yellow, 1, C.ink, 1.2), rect(58, 28, 8, 5, '#bfe3f5', 0.5, null), path('M76 40 L86 46 L86 52 L76 50 Z', C.grey, C.ink, 1), circle(54, 48, 3.4, C.dark, null), circle(70, 48, 3.4, C.dark, null)),
    path('M38 50 L82 50 L86 120 L34 120 Z', 'none', HL, 2.6)),
  'powgen.ursprungsgaranti': all(turbine(18, 96, 46, 14), arrow(34, 60, 46, 60, HL, 2.4), rect(48, 26, 40, 56, C.white, 2, C.ink, 1.6), ...range(4).map((i) => line(`M54 ${56 + i * 5} L${82 - (i % 2) * 8} ${56 + i * 5}`, C.grey, 1.2)),
    turbine(68, 50, 16, 6), circle(80, 78, 8, C.gold, C.ink, 1.2), path('M76 84 L74 96 L80 92 L86 96 L84 84', C.red, C.ink, 1), arrow(90, 60, 100, 60, HL, 2.4), house(108, 96, 0.55), ring(68, 54, 30)),
};
function sunRays(x: number, y: number): Svg { return all(circle(x, y, 7, C.yellow, C.ink, 1.2), ...range(8).map((i) => line(`M${f1(x + Math.cos(rad(i * 45)) * 10)} ${f1(y + Math.sin(rad(i * 45)) * 10)} L${f1(x + Math.cos(rad(i * 45)) * 14)} ${f1(y + Math.sin(rad(i * 45)) * 14)}`, C.gold, 1.8))); }
