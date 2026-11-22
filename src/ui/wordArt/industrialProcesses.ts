/**
 * Teknik & digital värld → Maskiner & tillverkning → Industriella processer, 4051–4057 (0.58): production lines,
 * warehouses and logistics, maintenance and service, efficiency, automated factories, work environment risks and
 * sustainable industry. Recurring signs: the part that the word names is orange or outlined in orange (ring, frame
 * or arrow) and grey parts show what the word is not. Products on a line are tan boxes, money is gold coins, energy
 * is a yellow bolt, data is blue dots. Words that are easy to mix up get clearly different scenes: produktionslinje
 * (the whole line framed, parts become boxes), arbetsstation (one place on the line framed, the rest grey),
 * arbetsmoment (a close-up of one step: a screwdriver turning, step 2 of 3) and takt (boxes at even gaps and a
 * clock); slöseri (coins and a clock falling into a bin), spill (the cut-up sheet left over) and överproduktion (a
 * pile of boxes that grows next to one customer); arbetsolycka (a fall with a burst, on the spot), belastningsskada
 * (red zigzags in a bent back, slowly) and ensidigt arbete (the same hand movement over and over, a loop arrow);
 * klämrisk (two press plates closing near a hand), fallrisk (a ladder that sways) and maskinskydd (a yellow mesh
 * cover around a gear); fossilfritt stål (steel beams, hydrogen bubbles and a water drop, coal crossed out). Digits and code signs only; no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waBob, waGrow, waIn, waPulse, waShake, waSpin, waSway, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const BLUE = '#3f7fc8';
const MACH = '#5b7fa6';
const STEEL = '#b8c0c8';
const WOOD = '#c99a62';
const VEST = '#d7f23a';
const LEAF = '#4f9d69';
const SCREEN = '#dfe9d8';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 5, col, 2.6);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const wall = (col = '#efe8dc') => rect(0, 0, 120, 112, col, 0, null);
const floor = (col = '#d8d2c6') => rect(0, 100, 120, 20, col, 0, null);
const cross = (x: number, y: number, s = 6, col: string = C.red) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 3);
const tick = (x: number, y: number, s = 1, col: string = C.green) => line(`M${x - 4 * s} ${y} L${x - 1 * s} ${y + 3 * s} L${x + 5 * s} ${y - 4 * s}`, col, 2.6);
const warn = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -12 L12 9 L-12 9 Z', C.yellow, C.ink, 1.6), line('M0 -5 L0 2', C.ink, 2.4), circle(0, 5.5, 1.3, C.ink, null));
const bolt = (x: number, y: number, s = 1, col: string = C.yellow) => g(`translate(${x} ${y}) scale(${s})`, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', col, C.ink, 1.4));
const burst = (x: number, y: number, r = 10, col: string = C.yellow) => {
  const pts = range(16).map((i) => { const a = (i * Math.PI) / 8, rr = i % 2 ? r * 0.45 : r; return `${f1(x + Math.cos(a) * rr)} ${f1(y + Math.sin(a) * rr)}`; });
  return path(`M${pts.join(' L')} Z`, col, C.ink, 1.4);
};
const coin = (x: number, y: number, r = 6) => all(circle(x, y, r, C.gold, C.ink, 1.4), circle(x, y, r * 0.6, 'none', '#b88a1e', 1.2));
const coinStack = (x: number, y: number, n: number) => all(...range(n).map((i) => all(ellipse(x, y - i * 4, 8, 3.2, C.gold, C.ink, 1.2))));
const clock = (x: number, y: number, r = 10, deg = 60) => all(circle(x, y, r, C.white, C.ink, 1.8), ...range(4).map((i) => { const a = (i * Math.PI) / 2; return line(`M${f1(x + Math.cos(a) * (r - 2))} ${f1(y + Math.sin(a) * (r - 2))} L${f1(x + Math.cos(a) * (r - 4))} ${f1(y + Math.sin(a) * (r - 4))}`, C.ink, 1.2); }),
  line(`M${x} ${y} L${x} ${y - r * 0.6}`, C.ink, 1.8), g(`translate(${x} ${y}) rotate(${deg})`, line(`M0 0 L0 ${-r * 0.8}`, C.red, 1.4)), circle(x, y, 1.4, C.ink, null));
const smoke = (x: number, y: number, s = 1, col: string = C.grey) => g(`translate(${x} ${y}) scale(${s})`, path('M-8 0 C-14 0 -14 -8 -8 -8 C-8 -14 0 -16 3 -11 C8 -15 15 -11 12 -5 C17 -4 16 3 10 3 Z', col, C.ink, 1.2));
const drop = (x: number, y: number, s = 1, col: string = '#8cc7e8') => path(`M${x} ${y - 5 * s} C${x + 4 * s} ${y} ${x + 3 * s} ${y + 4 * s} ${x} ${y + 4 * s} C${x - 3 * s} ${y + 4 * s} ${x - 4 * s} ${y} ${x} ${y - 5 * s} Z`, col, C.ink, 0.9);
const dot = (x: number, y: number, r = 2.4, col: string = BLUE) => circle(x, y, r, col, C.ink, 0.6);
const display = (x: number, y: number, w: number, h: number, txt: string, col: string = C.ink) => all(rect(x, y, w, h, SCREEN, 2, C.ink, 1.6), T(x + w / 2, y + h * 0.75, txt, h * 0.62, col));
/** Cardboard box standing on y. */
const box = (x: number, y: number, w = 16, h = 12, col: string = C.tan) => all(rect(x - w / 2, y - h, w, h, col, 1, C.ink, 1.4), line(`M${x - w / 2} ${y - h + 4} L${x + w / 2} ${y - h + 4}`, '#a0673d', 1.1));
/** Wooden pallet seen from the side, top at y. */
const pallet = (x: number, y: number, w = 36) => all(rect(x - w / 2, y, w, 3, WOOD, 0.5, C.ink, 1.2), rect(x - w / 2, y + 3, 5, 4, WOOD, 0.5, C.ink, 1), rect(x - 2.5, y + 3, 5, 4, WOOD, 0.5, C.ink, 1), rect(x + w / 2 - 5, y + 3, 5, 4, WOOD, 0.5, C.ink, 1), rect(x - w / 2, y + 7, w, 2.5, WOOD, 0.5, C.ink, 1));
/** Conveyor belt from x1 to x2, top surface at y. */
const conveyor = (x1: number, x2: number, y: number) => all(rect(x1, y, x2 - x1, 7, C.dark, 3.5, C.ink, 1.6), ...range(Math.floor((x2 - x1) / 12)).map((i) => circle(x1 + 6 + i * 12, y + 3.5, 2, C.grey, null)),
  line(`M${x1 + 6} ${y + 7} L${x1 + 6} 112 M${x2 - 6} ${y + 7} L${x2 - 6} 112`, C.grey, 3));
/** Small machine box over a line. */
const station = (x: number, y: number, w = 22, h = 20, col: string = MACH) => all(rect(x - w / 2, y, w, h, col, 3, C.ink, 1.6), rect(x - w / 2 + 4, y + 4, w - 8, 6, SCREEN, 1, C.ink, 1), circle(x + w / 2 - 5, y + h - 5, 2, C.green, null), line(`M${x} ${y + h} L${x} ${y + h + 6}`, C.dark, 3));
/** Forklift seen from the side, rear wheel at x, wheels on y, forks at height fy (relative), pointing right. */
const forklift = (x: number, y: number, s = 1, fy = 0, load: Svg = '', col: string = C.yellow, driver = true) => g(`translate(${x} ${y}) scale(${s})`,
  rect(-4, -20, 28, 14, col, 3, C.ink, 1.6), path('M0 -20 L2 -40 L20 -40 L22 -20', 'none', C.dark, 2.4), driver ? all(circle(10, -30, 5, C.skin, C.ink, 1.2), rect(6, -26, 9, 8, VEST, 2, C.ink, 1)) : '',
  rect(26, -46, 3, 40, C.dark, 1, C.ink, 1), g(`translate(0 ${-fy})`, line('M28 -8 L44 -8', C.dark, 3), load), circle(2, -4, 5, C.dark, C.ink, 1.4), circle(20, -4, 5, C.dark, C.ink, 1.4));
/** Lorry seen from the side, cab right, wheels on y. */
const lorry = (x: number, y: number, s = 1, col: string = C.white, cab: string = BLUE) => g(`translate(${x} ${y}) scale(${s})`, rect(-40, -38, 56, 32, col, 2, C.ink, 1.6), path('M16 -28 L30 -28 L38 -16 L38 -6 L16 -6 Z', cab, C.ink, 1.6), path('M20 -25 L28 -25 L33 -17 L20 -17 Z', '#dff1fb', C.ink, 1),
  circle(-28, -4, 6, C.dark, C.ink, 1.4), circle(-14, -4, 6, C.dark, C.ink, 1.4), circle(28, -4, 6, C.dark, C.ink, 1.4));
/** Factory building, floor at 112, from x with width w. */
const factory = (x: number, w: number, col = '#c9ced4', chimney = true) => all(chimney ? rect(x + w - 16, 40, 9, 40, '#a35d43', 1, C.ink, 1.6) : '',
  path(`M${x} 112 L${x} 66 L${x + w / 3} 54 L${x + w / 3} 66 L${f1(x + (2 * w) / 3)} 54 L${f1(x + (2 * w) / 3)} 66 L${x + w} 54 L${x + w} 112 Z`, col, C.ink, 1.8),
  ...range(Math.floor(w / 14)).map((i) => rect(x + 5 + i * 14, 76, 8, 8, '#dff1fb', 1, C.ink, 1)), rect(x + w / 2 - 6, 94, 12, 18, C.dark, 1, C.ink, 1.4));
/** Standing person, feet at (x, y=112); arms from the shoulders to (lx, ly) and (rx, ry) relative to the neck. */
const person = (x: number, top: string, o: { s?: number; l?: [number, number]; r?: [number, number]; hat?: string; hair?: string; y?: number; legs?: string } = {}) => {
  const s = o.s ?? 1, [lx, ly] = o.l ?? [-12, 22], [rx, ry] = o.r ?? [12, 22];
  return g(`translate(${x} ${o.y ?? 112}) scale(${s})`, line('M-5 0 L-4 -26 M5 0 L4 -26', o.legs ?? C.navy, 7), rect(-11, -56, 22, 32, top, 6, C.ink, 1.6),
    line(`M-9 -52 L${lx} ${-56 + ly}`, C.ink, 6.4), line(`M-9 -52 L${lx} ${-56 + ly}`, top, 4.4), circle(lx, -56 + ly, 3.2, C.skin, C.ink, 1.2),
    line(`M9 -52 L${rx} ${-56 + ry}`, C.ink, 6.4), line(`M9 -52 L${rx} ${-56 + ry}`, top, 4.4), circle(rx, -56 + ry, 3.2, C.skin, C.ink, 1.2),
    circle(0, -67, 10, C.skin, C.ink, 1.6), o.hat ? path('M-12 -70 C-12 -84 12 -84 12 -70 L14 -69 L-14 -69 Z', o.hat, C.ink, 1.6) : path('M-10 -68 C-10 -81 10 -81 10 -68 C6 -73 -6 -73 -10 -68 Z', o.hair ?? C.hair, null),
    circle(-3.5, -66, 1.2, C.ink, null), circle(3.5, -66, 1.2, C.ink, null), path('M-3 -61 C-1 -59 1 -59 3 -61', 'none', C.ink, 1.2));
};
/** Industrial robot arm: base at (x, 112), joint angles a1 (from vertical) and a2, length scale s. */
const robotArm = (x: number, a1: number, a2: number, s = 1, col: string = C.orange, tool: Svg = '') => g(`translate(${x} 112) scale(${s})`,
  rect(-16, -10, 32, 10, C.dark, 2, C.ink, 1.6), rect(-10, -20, 20, 12, col, 3, C.ink, 1.6),
  g(`translate(0 -20) rotate(${a1})`, rect(-6, -46, 12, 48, col, 5, C.ink, 1.6), circle(0, 0, 6, C.dark, C.ink, 1.4),
    g(`translate(0 -44) rotate(${a2})`, rect(-5, -40, 10, 42, col, 5, C.ink, 1.6), circle(0, 0, 5, C.dark, C.ink, 1.4), g('translate(0 -40)', tool))));
const claw = (open = 6, col: string = C.dark) => all(rect(-7, -6, 14, 6, col, 2, C.ink, 1.2), line(`M-4 -6 L${-4 - open / 2} -14 L-3 -18 M4 -6 L${4 + open / 2} -14 L3 -18`, C.ink, 3.4), line(`M-4 -6 L${-4 - open / 2} -14 L-3 -18 M4 -6 L${4 + open / 2} -14 L3 -18`, C.silver, 1.8));
const mesh = (x: number, y: number, w: number, h: number, col: string = C.yellow) => all(rect(x, y, w, h, 'rgba(255,255,255,0.15)', 1, col, 3),
  line([...range(Math.floor(w / 8)).map((i) => `M${x + 8 + i * 8} ${y} L${x + 8 + i * 8} ${y + h}`), ...range(Math.floor(h / 8)).map((i) => `M${x} ${y + 8 + i * 8} L${x + w} ${y + 8 + i * 8}`)].join(' '), C.dark, 1));
/** Gear wheel. */
const gear = (cx: number, cy: number, r: number, teeth: number, col: string) => {
  const pts: string[] = [];
  for (let i = 0; i < teeth * 4; i++) { const a = (i * 2 * Math.PI) / (teeth * 4), rr = i % 4 < 2 ? r : r - 5; pts.push(`${i ? 'L' : 'M'}${f1(cx + Math.cos(a) * rr)} ${f1(cy + Math.sin(a) * rr)}`); }
  return all(path(pts.join(' ') + ' Z', col, C.ink, 1.6), circle(cx, cy, r * 0.35, C.white, C.ink, 1.2));
};
/** Wrench, jaw at (x, y), handle towards angle deg. */
const spanner = (x: number, y: number, deg: number, len = 34, col: string = STEEL) => g(`translate(${x} ${y}) rotate(${deg})`, rect(4, -4, len, 8, col, 4, C.ink, 1.6), path('M-8 -9 L6 -9 L6 9 L-8 9 L-8 4 L0 4 L0 -4 L-8 -4 Z', col, C.ink, 1.6));
/** Trash bin. */
const bin = (x: number, y: number, s = 1, col: string = C.grey) => g(`translate(${x} ${y}) scale(${s})`, path('M-14 -30 L14 -30 L11 0 L-11 0 Z', col, C.ink, 1.6), rect(-16, -34, 32, 5, col, 2, C.ink, 1.6), line('M-5 -25 L-4 -4 M0 -25 L0 -4 M5 -25 L4 -4', C.ink, 1));
/** Calendar sheet with a grid of 3×3 days; marks: indices to tick. */
const calendar = (x: number, y: number, w: number, marks: number[], col: string = C.green) => {
  const c = w / 3;
  return all(rect(x, y, w, w + 8, C.white, 3, C.ink, 1.6), rect(x, y, w, 8, C.red, 3, C.ink, 1.6), ...range(9).map((i) => rect(x + 2 + (i % 3) * c, y + 10 + Math.floor(i / 3) * c, c - 4, c - 4, '#f1f1ec', 1, C.grey2, 0.8)),
    ...marks.map((i) => tick(x + c / 2 + (i % 3) * c, y + 8 + c / 2 + Math.floor(i / 3) * c, c / 12, col)));
};

export const INDUS_MOTIFS: Record<string, Svg> = {
  // ── 4051 Produktionslinjer ──
  'indus.produktionslinje': all(wall('#eef1f4'), conveyor(6, 114, 84), station(26, 44), station(60, 44), station(94, 44),
    moving('indpl', '0%{transform:translate(-30px,0);opacity:0}25%,100%{transform:translate(0,0);opacity:1}', { dur: 3 },
      rect(10, 76, 8, 8, STEEL, 1, C.ink, 1.2), path('M38 84 L38 74 L50 74 L50 84 Z', STEEL, C.ink, 1.2), rect(44, 70, 6, 4, C.dark, 1, C.ink, 1), box(78, 84, 14, 12, '#dfe3e7'), box(108, 84, 14, 14)),
    arrow(14, 30, 106, 30, HL, 2.6), frame(3, 38, 114, 72)),
  'indus.arbetsstation': all(wall('#eef1f4'), conveyor(4, 116, 92), greyed(station(20, 52), station(100, 52), box(14, 92, 10, 8), box(106, 92, 10, 8)),
    station(60, 40, 26, 22), box(60, 92, 14, 10), person(84, C.green, { s: 0.62, y: 112, l: [-22, 26], r: [-14, 30] }), frame(36, 30, 64, 80)),
  'indus.arbetsmoment': all(rect(0, 0, 120, 120, '#f3efe6', 0, null),
    ...[0, 1, 2].map((i) => all(rect(8 + i * 36, 8, 30, 22, i === 1 ? '#fde3d4' : C.white, 4, i === 1 ? HL : C.grey2, i === 1 ? 2.6 : 1.4), T(23 + i * 36, 25, String(i + 1), 15, i === 1 ? HL : C.grey))),
    rect(14, 48, 92, 58, C.sky, 4, C.ink, 1.8), rect(22, 56, 44, 42, '#dff1fb', 2, C.ink, 1.2), circle(84, 74, 3, STEEL, C.ink, 1),
    circle(84, 94, 3, STEEL, C.ink, 1), circle(84, 54, 3, STEEL, C.ink, 1),
    g('translate(84 74)', waSpin('indamsd', 1.2, line('M-3 0 L3 0 M0 -3 L0 3', C.ink, 1.4)), rect(4, -3, 12, 6, C.yellow, 1, C.ink, 1.2), rect(16, -5, 12, 10, C.red, 3, C.ink, 1.4)), ring(84, 74, 9)),
  'indus.takt.2': all(wall('#eef1f4'), conveyor(4, 116, 88), clock(60, 30, 16, 120),
    moving('indtakt', '0%{transform:translate(-30px,0)}100%{transform:translate(0,0)}', { dur: 3 },
      ...[-16, 14, 44, 74, 104].map((x) => box(x, 88, 14, 12)), ...[-1, 29, 59, 89].map((x) => line(`M${x} 70 L${x} 64`, HL, 2))),
    line('M14 68 L44 68', HL, 2, '3 2'), line('M74 68 L104 68', HL, 2, '3 2')),
  'indus.slutprodukt': all(wall('#eef1f4'), floor(), greyed(rect(6, 84, 20, 4, STEEL, 1, C.ink, 1.2), rect(6, 78, 20, 4, STEEL, 1, C.ink, 1.2), circle(40, 84, 6, STEEL, C.ink, 1.2), rect(34, 70, 12, 8, C.dark, 2, C.ink, 1.2)),
    arrow(50, 80, 62, 80, C.grey, 2.4), box(90, 100, 40, 54), rect(78, 54, 24, 18, C.white, 2, C.ink, 1.2), circle(90, 63, 5, '#dff1fb', C.ink, 1), ring(90, 74, 34)),
  'indus.ställa-om.2': all(wall('#eef1f4'), conveyor(4, 116, 92), rect(44, 22, 32, 36, MACH, 3, C.ink, 1.8), line('M60 58 L60 66', C.dark, 4),
    greyed(circle(16, 86, 6, C.grey, C.ink, 1.2), circle(32, 86, 6, C.grey, C.ink, 1.2)), rect(80, 80, 12, 12, HL, 1, C.ink, 1.2), rect(100, 80, 12, 12, HL, 1, C.ink, 1.2),
    moving('indsto', '0%,20%{transform:translate(0,-30px);opacity:0}60%,100%{transform:translate(0,0);opacity:1}', { dur: 3 }, rect(54, 66, 12, 12, HL, 1, C.ink, 1.6)),
    greyed(circle(26, 18, 7, C.grey, C.ink, 1.2)), path('M36 18 C46 6 74 6 84 18', 'none', HL, 2.6), arrow(80, 14, 86, 20, HL, 2.6), rect(88, 12, 12, 12, HL, 1, C.ink, 1.2)),

  // ── 4052 Lager och logistik ──
  'indus.pall.2': all(wall('#efe8dc'), floor(), pallet(60, 88, 76), box(36, 88, 24, 20), box(60, 88, 24, 20), box(84, 88, 24, 20), box(48, 68, 24, 20), box(72, 68, 24, 20),
    path('M18 86 L102 86 L102 100 L18 100 Z', 'none', HL, 2.6)),
  'indus.lossa.2': all(rect(0, 0, 120, 120, '#e8eef3', 0, null), rect(0, 70, 54, 50, '#b8b2a6', 0, C.ink, 1.4), rect(0, 20, 54, 50, C.white, 1, C.ink, 1.6), rect(2, 22, 50, 46, '#3d3f4a', 0, null),
    box(14, 68, 14, 12), box(28, 68, 14, 12), box(21, 56, 14, 12),
    moving('indlos', '0%{transform:translate(-40px,-12px)}70%,100%{transform:translate(0,0)}', { dur: 3.2 }, forklift(72, 112, 0.9, 6, all(pallet(36, -16, 18), box(36, -16, 14, 12)))),
    arrow(56, 40, 96, 40, HL, 3), line('M0 112 L120 112', C.grey2, 2)),
  'indus.truckförare': all(wall('#efe8dc'), floor(), greyed(pallet(100, 92, 20)), forklift(30, 104, 1.6, 0, '', C.yellow, true), ring(46, 54, 16)),
  'indus.pallställ': all(wall('#eef1f4'), floor(), ...[8, 60].map((x) => all(line(`M${x} 6 L${x} 104 M${x + 52} 6 L${x + 52} 104`, C.orange, 4), ...[34, 64, 96].map((y) => line(`M${x} ${y} L${x + 52} ${y}`, BLUE, 4)))),
    ...[8, 60].flatMap((x) => [34, 64, 96].map((y) => all(pallet(x + 26, y - 10, 30), box(x + 18, y - 10, 14, 14), box(x + 34, y - 10, 14, 14)))), frame(4, 2, 112, 104)),
  'indus.lagersaldo': all(wall('#eef1f4'), rect(6, 40, 52, 4, C.brown, 1, C.ink, 1.4), rect(6, 76, 52, 4, C.brown, 1, C.ink, 1.4), box(18, 40, 16, 14), box(36, 40, 16, 14), box(27, 76, 16, 14),
    rect(66, 24, 48, 64, C.dark, 6, C.ink, 1.8), rect(70, 30, 40, 50, SCREEN, 2, C.ink, 1.2), box(82, 54, 12, 10), T(100, 56, '3', 22, HL), ring(100, 48, 12), line('M58 58 L66 56', C.grey, 1.6, '3 2')),
  'indus.restnoterad': all(wall('#eef1f4'), rect(4, 70, 74, 4, C.brown, 1, C.ink, 1.4), box(16, 70, 18, 16, '#dccbb0'), box(64, 70, 18, 16, '#dccbb0'), rect(31, 52, 18, 18, 'none', 1, HL, 2.2), T(40, 66, '0', 12, HL), lorry(84, 106, 0.55), arrow(110, 96, 98, 96, C.grey, 2), calendar(84, 14, 28, [0, 1, 2, 3]), ring(40, 61, 15)),
  'indus.distributionscentral': all(rect(0, 0, 120, 120, '#e3eef6', 0, null), rect(0, 100, 120, 20, '#9aa3ad', 0, null), rect(18, 40, 84, 60, '#dfe3e7', 2, C.ink, 1.8), rect(14, 34, 92, 8, C.grey, 2, C.ink, 1.6),
    ...range(5).map((i) => rect(24 + i * 15, 76, 11, 24, '#8d949b', 1, C.ink, 1.2)), lorry(-8, 112, 0.5), lorry(108, 112, 0.5),
    arrow(6, 62, 22, 70, HL, 2.6), arrow(98, 70, 114, 62, HL, 2.6), frame(12, 30, 96, 72)),

  // ── 4053 Underhåll och service ──
  'indus.serva': all(wall('#eef1f4'), floor(), rect(14, 72, 6, 30, C.red, 1, C.ink, 1.4), rect(84, 72, 6, 30, C.red, 1, C.ink, 1.4), rect(8, 70, 88, 5, C.dark, 1, C.ink, 1.4),
    g('translate(52 68)', path('M-34 -6 L-34 -16 L-22 -18 L-12 -30 L10 -30 L20 -18 L30 -16 L30 -6 Z', C.sky, C.ink, 1.6), circle(-22, -6, 6, C.dark, C.ink, 1.4), circle(18, -6, 6, C.dark, C.ink, 1.4)),
    waSway('indserv', 25, spanner(40, 88, -30, 26)), rect(94, 18, 22, 30, C.white, 2, C.ink, 1.4), tick(101, 26, 0.8), tick(101, 34, 0.8), waPulse('indservt', tick(101, 42, 0.8)), line('M106 26 L113 26 M106 34 L113 34 M106 42 L113 42', C.grey, 1.2)),
  'indus.servicebok': all(rect(0, 0, 120, 120, '#f3efe6', 0, null), path('M60 22 L60 104 L10 98 L10 16 Z', C.white, C.ink, 1.8), path('M60 22 L60 104 L110 98 L110 16 Z', C.white, C.ink, 1.8),
    g('translate(35 40) scale(0.4)', path('M-30 -6 L-30 -16 L-18 -18 L-8 -30 L14 -30 L24 -18 L32 -16 L32 -6 Z', C.sky, C.ink, 3), circle(-18, -6, 6, C.dark, null), circle(20, -6, 6, C.dark, null)),
    ...range(4).map((i) => all(line(`M18 ${58 + i * 10} L50 ${59 + i * 10}`, C.grey2, 1.2), line(`M68 ${30 + i * 16} L86 ${30 + i * 16}`, C.grey, 1.4), circle(98, 28 + i * 16, 6, 'none', HL, 1.6), tick(98, 28 + i * 16, 0.6, HL))), frame(64, 18, 44, 76)),
  'indus.servicetekniker': all(wall('#eef6f0'), ground(), rect(62, 50, 54, 52, C.white, 4, C.ink, 1.8), path('M62 50 L62 102 L52 102 L52 66 Z', C.white, C.ink, 1.6), circle(76, 104, 7, C.dark, C.ink, 1.4), circle(104, 104, 7, C.dark, C.ink, 1.4),
    g('translate(84 72)', spanner(-10, 0, 0, 18, BLUE)), person(32, BLUE, { l: [-14, 28], r: [16, 30], legs: BLUE }), rect(38, 84, 22, 14, C.red, 2, C.ink, 1.4), line('M44 84 L44 80 L54 80 L54 84', C.ink, 1.6), ring(32, 62, 26)),
  'indus.slitdel': all(rect(0, 0, 120, 120, '#f3efe6', 0, null), path('M10 70 C10 40 50 40 50 70 L44 70 C44 50 16 50 16 70 Z', HL, C.ink, 1.8), ring(30, 60, 26),
    greyed(path('M70 70 C70 40 110 40 110 70 L107 70 C107 46 73 46 73 70 Z', '#8d949b', C.ink, 1.8)), line('M74 50 L78 52 M86 44 L87 47 M100 46 L98 49', C.ink, 1), arrow(80, 92, 40, 92, HL, 3)),
  'indus.haveri': all(wall('#eef1f4'), floor(), waShake('indhav', rect(26, 40, 64, 62, MACH, 4, C.ink, 1.8), rect(34, 48, 48, 16, '#f5d6d6', 2, C.ink, 1.2), cross(58, 56, 5), circle(80, 92, 3, C.red, null)),
    smoke(76, 32, 1.2), smoke(92, 22, 0.9), burst(30, 42, 8), gear(102, 100, 9, 6, STEEL), line('M88 82 L98 94', C.grey, 1.4, '3 2')),
  'indus.förebyggande-underhåll': all(wall('#eef6f0'), floor(), rect(10, 50, 50, 52, MACH, 4, C.ink, 1.8), rect(18, 58, 34, 14, SCREEN, 2, C.ink, 1.2), circle(50, 92, 4, C.green, C.ink, 1),
    path('M58 46 L70 40 L74 44 L64 52 Z', C.grey, C.ink, 1.2), drop(62, 54, 0.8, C.gold), calendar(72, 14, 38, [0, 3, 6]), greyed(rect(80, 76, 30, 24, MACH, 3, C.ink, 1.4), smoke(100, 70, 0.6)), cross(95, 88, 12)),

  // ── 4054 Effektivisering ──
  'indus.flöde.2': all(wall('#eef6ff'), line('M6 92 C30 92 30 52 60 52 C90 52 90 92 114 92', '#c9ced4', 16), line('M6 92 C30 92 30 52 60 52 C90 52 90 92 114 92', BLUE, 2, '4 4'),
    moving('indflo', '0%{transform:translate(-24px,0)}100%{transform:translate(0,0)}', { dur: 1.6 }, ...([[12, 94], [36, 72], [60, 56], [84, 72], [108, 94]] as const).map(([x, y]) => box(x, y, 12, 10))),
    station(30, 14, 18, 16), station(90, 14, 18, 16), arrow(98, 108, 114, 108, HL, 2.6)),
  'indus.nyckeltal': all(wall('#eef1f4'), rect(8, 14, 104, 84, C.white, 4, C.ink, 1.8), display(14, 22, 42, 26, '98', C.green), display(64, 22, 42, 26, '12'), display(14, 58, 42, 26, '3'),
    path('M68 82 L78 72 L88 76 L102 60', 'none', BLUE, 2.4), line('M66 62 L66 84 L106 84', C.ink, 1.2), ring(35, 35, 25), arrow(46, 108, 46, 100, HL, 2)),
  'indus.ledtid': all(rect(0, 0, 120, 120, '#f6f2ea', 0, null), rect(8, 54, 20, 26, C.white, 2, C.ink, 1.6), line('M12 62 L24 62 M12 68 L24 68 M12 74 L20 74', C.grey, 1.4), box(104, 80, 18, 16),
    line('M30 86 L94 86', C.grey, 2, '3 3'), path('M18 44 L18 36 L104 36 L104 44', 'none', HL, 3), clock(61, 22, 11, 150), waIn('indledt', -40, 0, arrow(36, 86, 92, 86, HL, 3))),
  'indus.slöseri': all(rect(0, 0, 120, 120, '#f6f2ea', 0, null), bin(60, 108, 1.4), moving('indslos', '0%{transform:translate(0,-30px);opacity:0}60%,100%{transform:translate(0,0);opacity:1}', { dur: 2.6 }, coin(52, 54), coin(68, 60), clock(60, 40, 9, 90)),
    greyed(coin(14, 20, 5), coin(26, 26, 5)), arrow(60, 6, 60, 22, HL, 2.6)),
  'indus.spill.2': all(wall('#eef1f4'), rect(6, 18, 62, 44, STEEL, 2, C.ink, 1.6), ...[0, 1, 2].flatMap((i) => [0, 1].map((j) => circle(18 + i * 19, 30 + j * 20, 7, '#eef1f4', C.ink, 1.2))),
    ...[0, 1, 2].map((i) => circle(86 + i * 4, 28 - i * 3, 7, STEEL, C.ink, 1.2)), bin(84, 108, 1.1), path('M70 80 L100 74 L96 92 L72 94 Z', HL, C.ink, 1.4), circle(80, 84, 3, '#eef1f4', C.ink, 0.8), circle(90, 82, 3, '#eef1f4', C.ink, 0.8),
    arrow(36, 66, 70, 82, HL, 2.6), ring(84, 84, 18)),
  'indus.överproduktion': all(wall('#eef1f4'), floor(), conveyor(4, 46, 74), box(30, 74, 12, 10),
    waGrow('indover', box(60, 100, 16, 12), box(76, 100, 16, 12), box(92, 100, 16, 12), box(68, 88, 16, 12), box(84, 88, 16, 12), box(76, 76, 16, 12)),
    person(106, C.green, { s: 0.55, l: [-12, 26], r: [12, 26] }), box(106, 84, 10, 8), ring(76, 88, 30)),
  'indus.standardisera': all(rect(0, 0, 120, 120, '#f6f2ea', 0, null), greyed(path('M8 18 L26 14 L28 32 L10 30 Z', C.grey, C.ink, 1.4), circle(18, 58, 10, C.grey, C.ink, 1.4), path('M8 98 L18 80 L30 98 Z', C.grey, C.ink, 1.4)),
    arrow(38, 60, 60, 60, HL, 3.4), waIn('indstd', -20, 0, rect(76, 12, 22, 22, HL, 2, C.ink, 1.6), rect(76, 48, 22, 22, HL, 2, C.ink, 1.6), rect(76, 84, 22, 22, HL, 2, C.ink, 1.6)), line('M106 12 L106 106', C.grey, 1.2, '3 2')),
  'indus.besparing': all(rect(0, 0, 120, 120, '#f6f2ea', 0, null), ground(106), greyed(rect(14, 22, 30, 84, C.grey, 2, C.ink, 1.6)), rect(56, 56, 30, 50, HL, 2, C.ink, 1.6), line('M44 22 L86 22', C.grey, 1.4, '3 2'),
    waBob('indbesp', 4, coinStack(101, 102, 5), coin(101, 70, 6), coin(101, 54, 6)), arrow(71, 26, 71, 52, LEAF, 2.6)),
  'indus.ständiga-förbättringar': all(rect(0, 0, 120, 120, '#f6f2ea', 0, null), path('M6 108 L6 92 L30 92 L30 76 L54 76 L54 60 L78 60 L78 44 L102 44 L102 28 L114 28 L114 108 Z', '#dfe3e7', C.ink, 1.6),
    ...[18, 42, 66, 90].map((x, i) => all(path(`M${x - 6} ${84 - i * 16} A7 7 0 1 1 ${x + 6} ${84 - i * 16}`, 'none', HL, 2), arrow(x + 4, 80 - i * 16, x + 6, 84 - i * 16, HL, 1.6))),
    waIn('indstf', -24, 16, person(104, C.green, { s: 0.4, y: 28, l: [-10, 14], r: [12, 10] }))),

  // ── 4055 Automatiserade fabriker ──
  'indus.robotarm': all(wall('#eef1f4'), floor(), waSway('indrarm', 8, robotArm(46, 20, 40, 1, C.orange, claw(8))), ring(46, 92, 11), ring(61, 51, 10), greyed(box(100, 100, 16, 12))),
  'indus.självkörande': all(wall('#eef1f4'), rect(0, 96, 120, 24, '#d8d2c6', 0, null), line('M0 104 L120 104', C.yellow, 3, '8 5'),
    moving('indsjk', '0%{transform:translate(-50px,0)}100%{transform:translate(10px,0)}', { dur: 4 }, rect(30, 82, 40, 14, C.orange, 3, C.ink, 1.6), circle(36, 98, 4, C.dark, C.ink, 1.2), circle(64, 98, 4, C.dark, C.ink, 1.2), box(50, 82, 20, 14),
      rect(68, 84, 4, 4, BLUE, 1, null), path('M74 80 A10 10 0 0 1 74 92 M78 76 A16 16 0 0 1 78 96', 'none', BLUE, 1.8)), ring(50, 86, 26)),
  'indus.smart-fabrik': all(rect(0, 0, 120, 120, '#e8f1f6', 0, null), ground(), factory(8, 104, '#dfe3e7', false), circle(60, 22, 10, BLUE, C.ink, 1.6), path('M55 21 A6 6 0 0 1 65 21 M52 17 A10 10 0 0 1 68 17', 'none', C.white, 1.6),
    ...[24, 60, 96].map((x) => all(rect(x - 8, 84, 16, 10, MACH, 2, C.ink, 1.2), line(`M${x} 84 L60 32`, BLUE, 1.4, '3 3'))), waPulse('indsmf', dot(42, 58), dot(78, 58), dot(60, 52)), frame(4, 6, 112, 106)),
  'indus.digital-tvilling': all(wall('#eef1f4'), floor(), rect(6, 56, 40, 44, MACH, 3, C.ink, 1.8), gear(26, 70, 9, 8, STEEL), rect(12, 86, 28, 6, C.dark, 1, null),
    rect(62, 30, 54, 44, C.dark, 4, C.ink, 1.8), rect(66, 34, 46, 36, '#14233f', 2, null), rect(76, 40, 26, 26, 'none', 2, '#7fd0ff', 1.4), circle(89, 49, 6, 'none', '#7fd0ff', 1.4), line('M80 60 L98 60', '#7fd0ff', 1.4), line('M86 74 L86 88 M78 88 L96 88', C.dark, 3),
    waIn('inddtw', -20, 0, dot(52, 52), dot(58, 46)), line('M46 60 L64 50', BLUE, 1.6, '3 3'), frame(60, 28, 58, 48)),
  'indus.arbetstillfälle': all(rect(0, 0, 120, 120, '#e8f1f6', 0, null), ground(), factory(4, 64, '#dfe3e7', true),
    waIn('indatf', -16, 0, ...[80, 96, 112].map((x) => all(circle(x, 82, 5, C.skin, C.ink, 1.2), path(`M${x - 7} 100 C${x - 7} 90 ${x + 7} 90 ${x + 7} 100 Z`, C.green, C.ink, 1.2)))),
    path('M96 50 L96 66 M88 58 L104 58', 'none', HL, 4)),
  'indus.omskola': all(rect(0, 0, 120, 120, '#f6f2ea', 0, null), ground(), greyed(spanner(14, 30, 30, 20)), cross(20, 34, 10), rect(48, 18, 24, 18, C.navy, 2, C.ink, 1.6), path('M60 18 L60 36', 'none', C.white, 1.2),
    rect(90, 20, 22, 16, C.dark, 2, C.ink, 1.4), rect(92, 22, 18, 10, SCREEN, 1, null), path('M28 40 C40 46 44 46 48 40 M74 30 C80 32 84 32 90 30', 'none', HL, 2.4), arrow(84, 30, 90, 30, HL, 2.4),
    moving('indoms', '0%{transform:translate(-60px,0)}100%{transform:translate(0,0)}', { dur: 3.6 }, person(88, C.green, { s: 0.62, l: [-12, 20], r: [12, 20] }))),

  // ── 4056 Arbetsmiljörisker ──
  'indus.arbetsolycka': all(wall('#efe8dc'), floor(), box(14, 100, 20, 16), g('translate(30 102) rotate(-25)', box(0, 0, 16, 12)),
    g('translate(22 100) rotate(75)', line('M-5 0 L-4 -26 M5 0 L4 -26', C.navy, 7), rect(-11, -56, 22, 32, C.orange, 6, C.ink, 1.6), circle(0, -67, 10, C.skin, C.ink, 1.6), path('M-12 -70 C-12 -84 12 -84 12 -70 L14 -69 L-14 -69 Z', C.yellow, C.ink, 1.6)),
    waPulse('indaol', burst(44, 82, 12, C.red)), warn(100, 22, 1.2), ring(60, 88, 32)),
  'indus.belastningsskada': all(wall('#f3efe6'), floor(), greyed(box(98, 100, 22, 18)),
    g('translate(50 112)', line('M-5 0 L-4 -26 M5 0 L4 -26', C.navy, 7), g('translate(0 -26) rotate(28)', rect(-11, -32, 22, 32, C.green, 6, C.ink, 1.6), circle(0, -42, 10, C.skin, C.ink, 1.6), path('M-10 -43 C-10 -56 10 -56 10 -43 C6 -48 -6 -48 -10 -43 Z', C.hair, null))),
    line('M46 84 L36 80', C.ink, 6.4), line('M46 84 L36 80', C.green, 4.4), circle(36, 80, 3.2, C.skin, C.ink, 1.2),
    waPulse('indbls', line('M30 74 L36 70 L32 66 L38 62 M26 86 L20 84 L24 80 L18 78 M42 66 L46 60 L42 56', C.red, 2.4)), ring(42, 80, 16)),
  'indus.ensidigt-arbete': all(wall('#eef1f4'), conveyor(4, 116, 90), ...[20, 40, 60, 80, 100].map((x) => all(rect(x - 6, 80, 12, 10, STEEL, 1, C.ink, 1.2), circle(x, 85, 2, C.dark, null))),
    moving('indens', '0%,100%{transform:translate(0,0)}50%{transform:translate(0,12px)}', { dur: 0.8 }, g('translate(60 48)', rect(-4, 0, 8, 18, C.yellow, 1, C.ink, 1.2), rect(-7, -18, 14, 18, C.red, 3, C.ink, 1.4), line('M0 -18 L0 -30', C.ink, 6), line('M0 -18 L0 -30', C.navy, 4))),
    path('M88 30 A16 16 0 1 1 72 14', 'none', HL, 2.6), arrow(78, 12, 72, 14, HL, 2.6), T(98, 64, '1000', 11, C.grey)),
  'indus.ergonomi': all(wall('#eef6f0'), floor(), rect(54, 60, 56, 5, C.tan, 1, C.ink, 1.6), line('M62 65 L62 100 M102 65 L102 100', C.dark, 3), rect(60, 54, 14, 6, STEEL, 1, C.ink, 1), person(84, C.green, { l: [-20, 22], r: [-10, 24] }),
    greyed(rect(4, 84, 34, 4, C.tan, 1, C.ink, 1.4), g('translate(22 112)', line('M-5 0 L-4 -26 M5 0 L4 -26', C.navy, 7), g('translate(0 -26) rotate(40)', rect(-11, -32, 22, 32, C.grey, 6, C.ink, 1.6), circle(0, -42, 10, C.skin, C.ink, 1.6)))),
    tick(84, 18, 2), frame(46, 6, 70, 106)),
  'indus.klämrisk': all(wall('#eef1f4'), floor(), rect(20, 4, 60, 14, C.dark, 2, C.ink, 1.6), rect(20, 82, 60, 18, C.dark, 2, C.ink, 1.6), rect(30, 18, 6, 64, STEEL, 1, C.ink, 1.2), rect(64, 18, 6, 64, STEEL, 1, C.ink, 1.2),
    moving('indklm', '0%,100%{transform:translate(0,0)}50%{transform:translate(0,22px)}', { dur: 1.8 }, rect(24, 26, 52, 12, '#8d949b', 2, C.ink, 1.6)),
    g('translate(78 70) rotate(180)', path('M0 0 L14 -2 C20 -3 26 -2 30 0 C32 2 30 5 26 5 L20 5 C22 7 21 10 18 10 L4 10 C0 10 -2 6 0 0 Z', C.skin, C.ink, 1.4), rect(-12, -1, 14, 11, C.navy, 2, C.ink, 1.4)),
    warn(100, 30, 1.3), ring(54, 66, 16)),
  'indus.fallrisk': all(wall('#eef1f4'), floor(), rect(80, 10, 36, 90, '#c9ced4', 2, C.ink, 1.6), ...[34, 64].map((y) => line(`M80 ${y} L116 ${y}`, BLUE, 3)),
    waSway('indfal', 6, g('translate(0 0)', line('M40 100 L56 26 M56 100 L72 26', C.brown, 3), ...range(6).map((i) => line(`M${f1(42 + i * 2.4)} ${88 - i * 12} L${f1(58 + i * 2.4)} ${88 - i * 12}`, C.brown, 2.4)),
      person(64, C.orange, { s: 0.55, y: 40, l: [-14, 18], r: [16, 8], hat: C.yellow }))), line('M34 40 L22 90', HL, 2.4, '4 3'), arrow(24, 82, 22, 92, HL, 2.4), warn(16, 18, 1.1)),
  'indus.maskinskydd': all(wall('#eef1f4'), floor(), rect(16, 40, 70, 60, MACH, 3, C.ink, 1.8), waSpin('indmsk', 4, gear(50, 66, 18, 10, STEEL)), mesh(26, 44, 50, 46),
    g('translate(112 70) rotate(180)', path('M0 0 L14 -2 C20 -3 26 -2 30 0 C32 2 30 5 26 5 L20 5 C22 7 21 10 18 10 L4 10 C0 10 -2 6 0 0 Z', C.skin, C.ink, 1.4), rect(-12, -1, 14, 11, C.navy, 2, C.ink, 1.4)), frame(22, 40, 58, 54)),

  // ── 4057 Hållbar industri ──
  'indus.fossilfritt-stål': all(rect(0, 0, 120, 120, '#eef6f0', 0, null), ground(), ...[0, 1, 2].map((i) => path(`M${10 + i * 6} ${104 - i * 12} L${64 + i * 6} ${104 - i * 12} L${64 + i * 6} ${96 - i * 12} L${10 + i * 6} ${96 - i * 12} Z`, STEEL, C.ink, 1.6)),
    greyed(path('M86 30 L98 24 L108 32 L104 42 L90 42 Z', C.black, C.ink, 1.4)), cross(97, 33, 12), waBob('indfst', 6, circle(86, 72, 5, '#dff1fb', BLUE, 1.6), circle(98, 64, 4, '#dff1fb', BLUE, 1.6), circle(92, 84, 3.4, '#dff1fb', BLUE, 1.6)), drop(104, 92, 1.6, '#8cc7e8'), frame(6, 66, 70, 42)),
  'indus.energiförbrukning': all(wall('#eef1f4'), rect(30, 12, 60, 80, C.white, 6, C.ink, 1.8), rect(38, 22, 44, 14, C.dark, 2, C.ink, 1.2), T(60, 33, '04857', 11, C.white), ellipse(60, 58, 20, 6, '#dfe3e7', C.ink, 1.4),
    moving('indenf', '0%{transform:translate(-18px,0)}100%{transform:translate(18px,0)}', { dur: 1.2 }, rect(58, 54, 4, 8, C.red, 1, null)), bolt(60, 78, 1), line('M60 92 L60 104 L108 104', C.dark, 3), factory(92, 26, '#dfe3e7', false), ring(60, 46, 34)),
  'indus.batterifabrik': all(rect(0, 0, 120, 120, '#e8f1f6', 0, null), ground(), factory(6, 96, '#dfe3e7', false), rect(36, 54, 40, 22, C.white, 3, C.ink, 1.6), rect(76, 60, 5, 10, C.white, 1, C.ink, 1.4), rect(40, 58, 22, 14, LEAF, 1, null), bolt(56, 65, 0.6),
    moving('indbat', '0%{transform:translate(-14px,0);opacity:0}40%,100%{transform:translate(0,0);opacity:1}', { dur: 2.4 }, rect(104, 98, 12, 8, LEAF, 1, C.ink, 1.2), rect(116, 100, 2, 4, C.ink, 0, null)), frame(2, 40, 106, 72)),
  'indus.miljökrav': all(rect(0, 0, 120, 120, '#eef6f0', 0, null), ground(), greyed(factory(4, 54, '#dfe3e7', true)), rect(62, 12, 50, 66, C.white, 3, C.ink, 1.8),
    ...[0, 1, 2].map((i) => all(rect(68, 22 + i * 14, 8, 8, C.white, 1, C.ink, 1.2), tick(72, 26 + i * 14, 0.7), line(`M80 ${26 + i * 14} L104 ${26 + i * 14}`, C.grey, 1.4))),
    circle(98, 70, 11, LEAF, C.ink, 1.6), path('M93 74 C93 64 101 62 104 64 C104 70 100 75 93 74 Z M93 74 L100 67', C.mint, C.ink, 1.2), frame(58, 8, 58, 78)),
  'indus.grön-omställning': all(rect(0, 0, 120, 120, '#eef6f0', 0, null), ground(), greyed(factory(2, 44, '#c9ced4', true), smoke(42, 34, 0.8)), arrow(50, 80, 64, 80, HL, 3.4),
    waIn('indgro', -20, 0, factory(68, 48, '#d6ecd9', false), line('M106 50 L106 24', C.dark, 2.4), g('translate(106 24)', waSpin('indgrow', 3, line('M0 0 L0 -14 M0 0 L12 7 M0 0 L-12 7', C.dark, 2.4)), circle(0, 0, 2, C.dark, null)), circle(80, 28, 6, C.yellow, C.ink, 1.2))),
};
