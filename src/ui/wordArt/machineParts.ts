/**
 * Teknik & digital värld → Maskiner & tillverkning → Mekanikens maskindelar, 4011–4017 (0.58): gears and gearboxes,
 * shafts and bearings, belts and chains, springs and dampers, screws and nuts, hydraulics and pneumatics.
 * Recurring signs: the part that the word names is orange or outlined in orange (ring, frame or arrow) and grey
 * parts show what the word is not. Oil is amber, compressed air is blue dots or blue streams. Words that are easy to
 * mix up get clearly different scenes: hjul (a wheelbarrow, its wheel ringed), axel (a long orange bar between two
 * wheels seen from behind), nav (the orange centre of a bicycle wheel) and lager (a ball bearing seen from the front);
 * kula (glass marbles and a steel ball lying still) and rulla (a barrel rolling down a ramp); remskiva (one grooved
 * wheel, the belt grey), rem (an orange belt between a motor and a machine) and tandrem (a belt with teeth); slak (a
 * sagging orange chain) and spänna (a wrench pulls the wheel back until the chain is straight); bult (a bolt through
 * two plates), bricka (the orange ring under the nut) and gänga (the spiral on a screw under a magnifier);
 * hydraulik (a small and a big piston, amber oil) and pneumatik (a compressor, a blue hose and a cylinder);
 * pysa (air leaving a tyre), luftbroms (a puff at a truck wheel) and luftfjädring (a bus that kneels at the kerb).
 * Digits, the colon and the code signs only; no unit letters, no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waGrow, waIn, waPulse, waShake, waSpin, waSway, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const OIL = '#d9a420';
const AIR = '#5aa7d6';
const STEEL = '#b8c0c8';
const RUST = '#b5651d';
const ICE = '#d7eef8';
const MACH = '#5b7fa6';
const f1 = (n: number) => +n.toFixed(1);
const rad = (d: number) => (d * Math.PI) / 180;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 5, col, 2.6);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const wall = (col = '#efe8dc') => rect(0, 0, 120, 112, col, 0, null);
const floor = (col = '#d8d2c6') => rect(0, 100, 120, 20, col, 0, null);
const dot = (x: number, y: number, r = 2.4, col: string = AIR) => circle(x, y, r, col, C.ink, 0.6);
const drop = (x: number, y: number, s = 1, col: string = OIL) => path(`M${x} ${y - 5 * s} C${x + 4 * s} ${y} ${x + 3 * s} ${y + 4 * s} ${x} ${y + 4 * s} C${x - 3 * s} ${y + 4 * s} ${x - 4 * s} ${y} ${x} ${y - 5 * s} Z`, col, C.ink, 0.8);
const cross = (x: number, y: number, s = 6, col: string = C.red) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 3);
const burst = (x: number, y: number, r = 10, col: string = C.yellow) => {
  const pts = range(16).map((i) => { const a = rad(i * 22.5), rr = i % 2 ? r * 0.45 : r; return `${f1(x + Math.cos(a) * rr)} ${f1(y + Math.sin(a) * rr)}`; });
  return path(`M${pts.join(' L')} Z`, col, C.ink, 1.4);
};
const heat = (x: number, y: number, n = 3, col: string = C.red, gap = 8) => line(range(n).map((i) => `M${x + i * gap} ${y} c-3 -4 3 -6 0 -10 c-3 -4 3 -6 0 -10`).join(' '), col, 1.8);
/** Gear: centre, outer radius, number of teeth, colour, rotation of the first tooth (degrees). */
const gear = (cx: number, cy: number, r: number, teeth: number, col: string, rot = 0, hole = true) => {
  const pts: string[] = [];
  for (let i = 0; i < teeth * 4; i++) { const a = rad(rot + (i * 360) / (teeth * 4)), rr = i % 4 < 2 ? r : r - 5; pts.push(`${i ? 'L' : 'M'}${f1(cx + Math.cos(a) * rr)} ${f1(cy + Math.sin(a) * rr)}`); }
  return all(path(pts.join(' ') + ' Z', col, C.ink, 1.6), hole ? all(circle(cx, cy, r * 0.42, C.white, C.ink, 1.4), circle(cx, cy, r * 0.16, C.dark, null)) : '');
};
/** Bicycle wheel seen from the side. */
const cycWheel = (x: number, y: number, r: number, hub: string = C.dark, n = 10) => all(circle(x, y, r, 'none', C.dark, 4), circle(x, y, r - 3, 'none', C.silver, 1),
  line(range(n).map((i) => { const a = rad(i * (180 / n)); return `M${f1(x - Math.cos(a) * (r - 3))} ${f1(y - Math.sin(a) * (r - 3))} L${f1(x + Math.cos(a) * (r - 3))} ${f1(y + Math.sin(a) * (r - 3))}`; }).join(' '), C.silver, 0.8), circle(x, y, 3, hub, C.ink, 1));
/** Chain along a path: dark band with silver links. */
const chainD = (d: string, col: string = C.dark) => line(d, C.ink, 5) + line(d, col, 3.4) + line(d, C.silver, 1.4, '2.5 2');
/** Belt along a path. */
const beltD = (d: string, col: string = C.dark) => line(d, C.ink, 5.6) + line(d, col, 3.8);
const pulley = (x: number, y: number, r: number, col: string = STEEL) => all(circle(x, y, r, col, C.ink, 1.6), circle(x, y, r - 3, 'none', C.ink, 0.8), circle(x, y, f1(r * 0.28), C.dark, null));
/** Palm seen from the side (no pointing finger), wrist at (x, y). */
const palm = (x: number, y: number, rot = 0, sleeve: string = C.navy) => g(`translate(${x} ${y}) rotate(${rot})`, path('M0 0 L14 -2 C20 -3 26 -2 30 0 C32 2 30 5 26 5 L20 5 C22 7 21 10 18 10 L4 10 C0 10 -2 6 0 0 Z', C.skin, C.ink, 1.4), rect(-12, -1, 14, 11, sleeve, 2, C.ink, 1.4));
/** Fist around a handle, centred at (x, y). */
const fist = (x: number, y: number, sleeveDx = 0, sleeveDy = 12, sleeve: string = C.navy) => all(line(`M${x} ${y} L${x + sleeveDx} ${y + sleeveDy}`, C.ink, 11), line(`M${x} ${y} L${x + sleeveDx} ${y + sleeveDy}`, sleeve, 8.6), circle(x, y, 6.5, C.skin, C.ink, 1.4), line(`M${x - 3} ${y - 3} L${x + 3} ${y - 3} M${x - 3} ${y} L${x + 3} ${y}`, C.skin2, 1));
/** Hexagon nut seen from above. */
const hexNut = (x: number, y: number, r: number, col: string = STEEL) => all(path(range(6).map((i) => `${i ? 'L' : 'M'}${f1(x + Math.cos(rad(i * 60)) * r)} ${f1(y + Math.sin(rad(i * 60)) * r)}`).join(' ') + ' Z', col, C.ink, 1.6), circle(x, y, f1(r * 0.48), C.white, C.ink, 1.2));
/** Nut seen from the side: a short wide block. */
const sideNut = (x: number, y: number, w: number, h: number, col: string = STEEL) => all(rect(x - w / 2, y - h / 2, w, h, col, 1.5, C.ink, 1.4), line(`M${x - w / 6} ${y - h / 2} L${x - w / 6} ${y + h / 2} M${x + w / 6} ${y - h / 2} L${x + w / 6} ${y + h / 2}`, C.ink, 0.9));
/** Threaded shank, vertical, from y1 to y2 at x. */
const shank = (x: number, y1: number, y2: number, w: number, col: string = STEEL, thread: string = C.ink) => all(rect(x - w / 2, y1, w, y2 - y1, col, 1, C.ink, 1.4),
  line(range(Math.floor((y2 - y1) / 4)).map((i) => `M${x - w / 2} ${y1 + 3 + i * 4} L${x + w / 2} ${y1 + 1 + i * 4}`).join(' '), thread, 1));
/** Spanner: jaw at (x, y), handle towards angle deg. */
const spanner = (x: number, y: number, deg: number, len = 40, col: string = STEEL) => g(`translate(${x} ${y}) rotate(${deg})`, rect(4, -4, len, 8, col, 4, C.ink, 1.6), path('M-8 -9 L6 -9 L6 9 L-8 9 L-8 4 L0 4 L0 -4 L-8 -4 Z', col, C.ink, 1.6));
/** Small car seen from the side, wheels on y. */
const car = (x: number, y: number, s = 1, col: string = C.sky) => g(`translate(${x} ${y}) scale(${s})`, path('M-30 -6 L-30 -16 L-18 -18 L-8 -30 L14 -30 L24 -18 L32 -16 L32 -6 Z', col, C.ink, 1.6),
  path('M-6 -27 L4 -27 L4 -19 L-13 -19 Z M8 -27 L13 -27 L19 -19 L8 -19 Z', '#dff1fb', C.ink, 1.2), circle(-18, -6, 6, C.dark, C.ink, 1.4), circle(20, -6, 6, C.dark, C.ink, 1.4), circle(-18, -6, 2, C.silver, null), circle(20, -6, 2, C.silver, null));
/** Cog tooth outline: fills one tooth of gear(cx, cy, r, teeth, …, rot) in colour. */
const tooth = (cx: number, cy: number, r: number, teeth: number, rot: number, k: number, col: string = HL) => {
  const step = 360 / (teeth * 4), a0 = rot + k * 4 * step;
  const p = (a: number, rr: number) => `${f1(cx + Math.cos(rad(a)) * rr)} ${f1(cy + Math.sin(rad(a)) * rr)}`;
  return path(`M${p(a0 - step, r - 5)} L${p(a0, r)} L${p(a0 + step, r)} L${p(a0 + 2 * step, r - 5)} Z`, col, C.ink, 1.4);
};
/** Coil spring, vertical, from y1 (top) to y2. */
const coil = (x: number, y1: number, y2: number, w: number, n: number, col: string = HL, sw = 2.6) => {
  const step = (y2 - y1) / n;
  return line(`M${x} ${y1} ` + range(n).map((i) => `L${x + (i % 2 ? -w : w)} ${f1(y1 + step * (i + 0.5))}`).join(' ') + ` L${x} ${y2}`, col, sw);
};
/** Pipe flange seen from the side. */
const flange = (x: number, y: number, h: number, col: string = STEEL) => rect(x - 3, y - h / 2, 6, h, col, 1, C.ink, 1.4);

export const MPART_MOTIFS: Record<string, Svg> = {
  // ── 4011 Kugghjul och växlar ──
  'mpart.maskin': all(wall('#eef1f4'), floor(), rect(18, 58, 62, 46, MACH, 3, C.ink, 1.8), rect(26, 22, 46, 36, MACH, 3, C.ink, 1.8), rect(44, 58, 10, 18, C.grey, 1, C.ink, 1.4),
    rect(30, 64, 18, 14, C.dark, 2, C.ink, 1.2), circle(35, 71, 2.6, C.green, null), circle(43, 71, 2.6, C.red, null), rect(30, 28, 34, 10, '#dfe9d8', 1, C.ink, 1.2),
    waSpin('mpmas', 3, g('translate(96 54)', circle(0, 0, 15, STEEL, C.ink, 1.8), line('M-13 0 L13 0 M0 -13 L0 13 M-9 -9 L9 9 M-9 9 L9 -9', C.ink, 1.4), circle(0, 0, 3, C.dark, null))),
    beltD('M72 40 L96 39 M72 46 L96 69', C.dark), rect(18, 100, 62, 4, C.dark, 0, null), rect(84, 92, 30, 8, C.dark, 2, C.ink, 1.2),
    moving('mpmasb', '0%{transform:translate(-14px,0);opacity:0}30%,100%{transform:translate(0,0);opacity:1}', { dur: 2.6 }, rect(100, 78, 8, 14, '#9ad0a8', 3, C.ink, 1.2)), frame(12, 16, 102, 90)),
  'mpart.kugge': all(gear(56, 64, 36, 10, C.silver, -94.5), tooth(56, 64, 36, 10, -94.5, 0), ring(56, 26, 11), arrow(98, 14, 72, 24, HL, 3),
    greyed(gear(103, 98, 14, 6, C.grey, 0))),
  'mpart.snurra.2': all(wall('#f3efe6'), rect(20, 92, 72, 16, C.brown, 2, C.ink, 1.6), rect(50, 66, 12, 28, C.grey, 1, C.ink, 1.4),
    waSpin('mpsnu', 2.4, g('translate(56 56)', circle(0, 0, 26, 'none', C.dark, 4), line(range(4).map((i) => { const a = rad(i * 45); return `M${f1(-Math.cos(a) * 24)} ${f1(-Math.sin(a) * 24)} L${f1(Math.cos(a) * 24)} ${f1(Math.sin(a) * 24)}`; }).join(' '), C.silver, 2))),
    circle(56, 56, 5, C.dark, C.ink, 1.2), line('M56 56 L82 40', C.ink, 4), line('M56 56 L82 40', C.silver, 2), rect(80, 30, 6, 12, C.red, 3, C.ink, 1.2), fist(83, 36, 18, 16),
    path('M26 22 A34 34 0 0 1 86 16', 'none', HL, 3), arrow(80, 12, 90, 20, HL, 3)),
  'mpart.utväxling': all(rect(6, 6, 108, 108, C.white, 6, C.grey2, 1.4),
    moving('mputb', '0%{transform:rotate(0)}100%{transform:rotate(-120deg)}', { dur: 6, spin: true }, gear(40, 70, 30, 15, C.silver, 0)),
    moving('mputs', '0%{transform:rotate(0)}100%{transform:rotate(360deg)}', { dur: 6, spin: true }, gear(78, 70, 13, 6, HL, 15)),
    T(40, 30, '1', 18), T(60, 30, ':', 18), T(78, 30, '3', 18, HL), path('M28 104 A28 28 0 0 0 52 104', 'none', C.grey, 2), arrow(92, 86, 90, 92, HL, 2.4), path('M66 82 A16 16 0 1 0 92 84', 'none', HL, 2)),
  'mpart.kuggstång': all(wall('#eef1f4'), moving('mpkst', '0%,100%{transform:translate(8px,0)}50%{transform:translate(-8px,0)}', { dur: 3 },
      rect(6, 80, 108, 12, HL, 2, C.ink, 1.8), ...range(13).map((i) => path(`M${10 + i * 8} 80 L${12 + i * 8} 74 L${15 + i * 8} 74 L${17 + i * 8} 80 Z`, HL, C.ink, 1.2))),
    gear(60, 58, 18, 8, C.silver, 0), arrow(40, 102, 14, 102, C.ink, 2.4), arrow(80, 102, 106, 102, C.ink, 2.4), path('M48 34 A16 16 0 0 1 72 34', 'none', C.grey, 2)),
  'mpart.urverk': all(ellipse(20, 60, 12, 36, '#e7c86a', C.ink, 1.8), circle(66, 60, 44, '#e7c86a', C.ink, 2), circle(66, 60, 38, '#f6f0dc', C.ink, 1.6), rect(62, 8, 8, 10, '#e7c86a', 2, C.ink, 1.4), circle(66, 6, 5, 'none', C.ink, 2),
    waSpin('mpurv1', 4, gear(54, 52, 16, 10, C.gold, 0)), moving('mpurv2', '0%{transform:rotate(0)}100%{transform:rotate(-360deg)}', { dur: 3, spin: true }, gear(78, 68, 11, 7, STEEL, 10)), gear(60, 82, 8, 6, '#d98c5f', 0), gear(84, 44, 7, 6, C.gold, 0),
    circle(66, 60, 3, C.dark, null), line('M66 60 L66 30 M66 60 L86 66', C.dark, 2.4), ring(66, 60, 50)),
  'mpart.växel.2': all(rect(14, 10, 92, 92, '#3d3f4a', 10, C.ink, 2), line('M34 30 L34 82 M60 30 L60 82 M86 30 L86 82 M34 56 L86 56', '#c9ced4', 3.4),
    T(34, 24, '1', 12, C.white), T(34, 97, '2', 12, C.white), T(72, 24, '3', 12, HL), T(60, 97, '4', 12, C.white), T(86, 24, '5', 12, C.white),
    circle(60, 32, 8, C.black, C.ink, 1.8), circle(58, 30, 2.4, '#6d7280', null), ring(60, 32, 12)),
  'mpart.växellåda': all(wall('#eef1f4'), greyed(rect(2, 46, 18, 40, C.grey, 3, C.ink, 1.4), circle(108, 66, 12, C.dark, C.ink, 1.4)), line('M18 60 L32 60 M88 76 L104 76', C.dark, 4),
    rect(30, 34, 60, 56, '#c9ced4', 6, C.ink, 2), rect(36, 40, 48, 44, '#eef1f4', 4, C.ink, 1, ), line('M38 60 L82 60 M38 76 L82 76', C.dark, 2.2),
    gear(46, 60, 9, 8, C.gold, 0), gear(62, 60, 7, 6, STEEL, 0), gear(76, 60, 8, 7, '#d98c5f', 0), gear(46, 76, 6, 6, STEEL, 0), gear(62, 76, 9, 8, '#d98c5f', 0), gear(76, 76, 7, 6, C.gold, 0), frame(24, 28, 72, 68)),
  'mpart.växla.3': all(wall('#eef6f0'), gear(30, 82, 18, 12, C.silver, 0), circle(30, 82, 4, C.dark, null),
    g('translate(90 74)', gear(0, 0, 16, 12, '#dfe3e7', 0, false), gear(0, 0, 12, 9, '#cdd3d8', 0, false), gear(0, 0, 8, 6, '#bcc3c9', 0, false), circle(0, 0, 3, C.dark, null)),
    chainD('M30 64 L90 66 M30 100 L90 82'), moving('mpvx', '0%,30%{transform:translate(0,-8px)}70%,100%{transform:translate(0,0)}', { dur: 2.8 }, path('M90 66 A8 8 0 0 1 90 82', 'none', HL, 4)),
    arrow(108, 50, 108, 64, HL, 2.6), line('M8 22 L70 22', C.dark, 5), rect(54, 14, 12, 16, C.grey, 2, C.ink, 1.2), palm(34, 18, 0, C.green), moving('mpvxl', '0%,30%{transform:translate(0,0)}60%,100%{transform:translate(4px,0)}', { dur: 2.8 }, rect(66, 18, 10, 6, HL, 2, C.ink, 1.2))),
  'mpart.koppling': all(rect(0, 0, 120, 120, '#4a4d58', 0, null), rect(0, 96, 120, 24, '#2f3038', 0, null),
    line('M30 0 L30 74 M60 0 L60 52 M88 0 L88 52', C.grey, 4), rect(18, 74, 24, 12, C.silver, 3, C.ink, 1.6), rect(50, 52, 20, 12, '#8d949b', 3, C.ink, 1.4), rect(80, 52, 16, 22, '#8d949b', 3, C.ink, 1.4),
    path('M8 120 L10 96 C12 86 24 84 34 88 L44 92 C48 94 46 100 40 100 L22 102 L22 120 Z', '#334a7a', C.ink, 1.6), ring(30, 80, 15), arrow(10, 40, 10, 70, HL, 3)),

  // ── 4012 Axlar och lager ──
  'mpart.hjul': all(wall('#eef6ea'), ground(), path('M44 58 L104 58 L96 80 L50 80 Z', C.green, C.ink, 1.8), line('M100 64 L118 52 M98 74 L116 70', C.brown, 4), line('M52 80 L60 108 M90 80 L86 108', C.grey, 3),
    line('M50 70 L30 92', C.grey, 3), circle(30, 92, 18, C.dark, C.ink, 1.6), circle(30, 92, 12, '#d9dee3', C.ink, 1.2), waSpin('mphju', 2.4, g('translate(30 92)', line('M-11 0 L11 0 M0 -11 L0 11 M-8 -8 L8 8 M-8 8 L8 -8', C.grey, 1.6))), circle(30, 92, 3, C.dark, null), ring(30, 92, 23)),
  'mpart.axel.2': all(wall('#f3efe6'), ground(), rect(28, 34, 64, 34, C.tan, 3, C.ink, 1.8), greyed(line('M44 68 L44 78 M76 68 L76 78', C.dark, 3)),
    rect(10, 66, 18, 46, C.dark, 6, C.ink, 1.6), rect(92, 66, 18, 46, C.dark, 6, C.ink, 1.6), rect(14, 74, 10, 30, '#6d7280', 3, null), rect(96, 74, 10, 30, '#6d7280', 3, null),
    rect(22, 84, 76, 8, HL, 3, C.ink, 1.8), moving('mpaxl', '0%{transform:translate(-20px,0)}100%{transform:translate(20px,0)}', { dur: 1.2 }, line('M56 85 L52 91 M64 85 L60 91', C.ink, 1.4)), arrow(60, 106, 60, 96, HL, 2.6)),
  'mpart.nav': all(cycWheel(60, 60, 46, C.dark, 12), circle(60, 60, 10, HL, C.ink, 1.8), circle(60, 60, 3, C.dark, null), ring(60, 60, 16)),
  'mpart.lager.4': all(rect(6, 6, 108, 108, '#eef1f4', 6, null), circle(60, 60, 44, STEEL, C.ink, 2), circle(60, 60, 36, '#dfe3e7', C.ink, 1.4),
    waSpin('mplag', 6, g('translate(60 60)', ...range(10).map((i) => { const a = rad(i * 36); return all(circle(f1(Math.cos(a) * 29), f1(Math.sin(a) * 29), 6, '#e9edf1', C.ink, 1.4), circle(f1(Math.cos(a) * 29 - 2), f1(Math.sin(a) * 29 - 2), 1.6, C.white, null)); }))),
    circle(60, 60, 22, STEEL, C.ink, 1.8), circle(60, 60, 13, C.dark, C.ink, 1.4), ring(60, 60, 50)),
  'mpart.kula': all(wall('#f3efe6'), rect(4, 86, 112, 26, C.tan, 2, C.ink, 1.6),
    ...[[26, 76, '#5aa7d6'], [46, 80, '#4f9d69'], [92, 78, '#d64545']].map(([x, y, c]) => all(circle(x as number, y as number, 8, c as string, C.ink, 1.4), path(`M${(x as number) - 5} ${y} C${(x as number) - 1} ${(y as number) - 5} ${(x as number) + 2} ${(y as number) + 4} ${(x as number) + 6} ${(y as number) - 1}`, 'none', C.white, 1.4), circle((x as number) - 3, (y as number) - 3, 2, 'rgba(255,255,255,0.8)', null))),
    circle(68, 70, 14, STEEL, C.ink, 1.6), circle(63, 65, 4, 'rgba(255,255,255,0.85)', null), ring(68, 70, 19)),
  'mpart.rulla': all(wall('#eef6ea'), path('M4 52 L80 106 L4 106 Z', '#c9b48a', C.ink, 1.6), ground(),
    moving('mprul', '0%{transform:translate(-64px,-44px) rotate(-300deg)}70%,100%{transform:translate(0,0) rotate(0)}', { dur: 3, spin: true },
      g('translate(94 94)', circle(0, 0, 17, C.brown, C.ink, 1.8), circle(0, 0, 12, '#c58b52', C.ink, 1.2), line('M-12 0 L12 0 M0 -12 L0 12', '#7a4c27', 1.6))),
    path('M30 72 C48 82 60 92 72 98', 'none', HL, 2.6, ), arrow(64, 94, 74, 100, HL, 2.6)),
  'mpart.smörja': all(wall('#f2f0ea'), gear(58, 86, 20, 14, C.silver, 0), chainD('M58 66 L118 66 M58 106 L118 106'),
    g('translate(26 22) rotate(25)', path('M0 0 L28 0 L30 22 L-2 22 Z', C.red, C.ink, 1.6), path('M28 4 L52 -4 L53 0 L30 10 Z', STEEL, C.ink, 1.4), path('M4 0 C4 -10 22 -10 24 0', 'none', C.ink, 2.4)),
    waIn('mpsmo', 0, -14, drop(76, 50, 1.1), drop(76, 60, 0.9)), ring(76, 66, 8)),
  'mpart.olja.3': all(rect(0, 0, 120, 120, '#e3e7eb', 0, null), path('M6 80 L18 62 L102 62 L114 80 L114 112 L6 112 Z', '#8d949b', C.ink, 1.8), rect(22, 70, 76, 30, '#6d7280', 4, C.ink, 1.4),
    rect(62, 62, 14, 8, C.gold, 2, C.ink, 1.4), g('translate(80 12) rotate(40)', rect(0, 0, 22, 34, OIL, 4, C.ink, 1.6), rect(7, -6, 8, 7, C.dark, 1, C.ink, 1.2), drop(11, 18, 1.6, '#fff4cf')),
    waIn('mpolj', 0, -10, line('M70 46 L69 62', OIL, 4), drop(69, 56, 1)), ring(69, 66, 11)),
  'mpart.fett.2': all(wall('#f2f0ea'), circle(40, 74, 26, STEEL, C.ink, 1.8), circle(40, 74, 12, C.dark, C.ink, 1.4), path('M30 52 C34 44 48 44 52 52 C48 56 34 56 30 52 Z', '#e0b84a', C.ink, 1.4),
    g('translate(92 22) rotate(35)', rect(-8, 0, 16, 46, C.white, 3, C.ink, 1.6), rect(-6, 46, 12, 8, '#3f7fc8', 1, C.ink, 1.2), path('M-8 0 L8 0 L4 -8 L-4 -8 Z', C.white, C.ink, 1.4)), path('M58 34 C52 40 48 44 46 48', 'none', '#e0b84a', 5)),
  'mpart.överhettas': all(wall('#fbeee6'), rect(18, 56, 68, 48, '#8d949b', 4, C.ink, 1.8), ...range(5).map((i) => rect(22 + i * 12, 46, 8, 10, '#8d949b', 1, C.ink, 1.2)), rect(30, 70, 44, 20, '#6d7280', 3, null),
    rect(92, 30, 10, 60, C.white, 5, C.ink, 1.6), rect(94, 34, 6, 56, C.red, 3, null), circle(97, 94, 8, C.red, C.ink, 1.6),
    waPulse('mpovh', heat(32, 40, 4, C.red, 12), path('M44 62 C40 52 52 50 50 40', 'none', C.grey, 3)), ground()),
  'mpart.kärva': all(wall('#eef1f4'), rect(26, 20, 64, 92, C.tan, 2, C.ink, 1.8), rect(70, 56, 16, 36, STEEL, 3, C.ink, 1.6), circle(78, 66, 3, C.dark, null),
    waShake('mpkar', g('translate(78 66)', rect(-2, -2, 22, 5, C.gold, 2, C.ink, 1.2), circle(26, 0, 7, C.gold, C.ink, 1.4)), fist(104, 66, 10, 16)),
    line('M88 50 L94 44 M96 54 L104 50 M90 82 L96 88', C.red, 2.4), path('M98 36 A14 14 0 0 1 112 50', 'none', C.grey, 2.4), cross(110, 30, 4)),
  'mpart.glappa.2': all(wall('#eef6ea'), ground(), rect(4, 58, 60, 8, C.grey, 2, C.ink, 1.4), greyed(ellipse(70, 62, 8, 40, 'none', C.dark, 3)),
    waSway('mpgla', 10, g('translate(70 62)', ellipse(0, 0, 10, 40, C.dark, C.ink, 1.6), ellipse(0, 0, 5, 28, '#6d7280', null), circle(0, 0, 4, C.silver, C.ink, 1))),
    arrow(92, 30, 108, 26, HL, 2.6), arrow(92, 96, 108, 100, HL, 2.6), line('M84 46 L90 44 M84 80 L90 82', HL, 2)),

  // ── 4013 Remmar och kedjor ──
  'mpart.rem.2': all(wall('#eef1f4'), floor(), rect(10, 70, 32, 30, MACH, 3, C.ink, 1.6), rect(70, 20, 44, 80, C.white, 4, C.ink, 1.8), circle(92, 76, 14, '#cfe8f5', C.ink, 1.4),
    beltD('M26 72 L84 26 M26 88 L94 58', HL), waSpin('mprem1', 1.2, pulley(26, 80, 8)), waSpin('mprem2', 3, pulley(90, 42, 16))),
  'mpart.remskiva': all(rect(6, 6, 108, 108, '#eef1f4', 6, null), beltD('M8 40 C30 34 40 30 60 30 C80 30 88 46 90 60', C.grey),
    circle(60, 62, 34, STEEL, C.ink, 2), circle(60, 62, 28, '#dfe3e7', C.ink, 1.4), circle(60, 62, 24, STEEL, C.ink, 1.2), circle(60, 62, 8, C.dark, C.ink, 1.2), ring(60, 62, 40)),
  'mpart.tandrem': all(rect(6, 6, 108, 108, '#f2f0ea', 6, null), gear(30, 70, 16, 12, STEEL, 0), gear(90, 50, 16, 12, STEEL, 0),
    path('M30 52 L90 32 A18 18 0 0 1 90 68 L30 88 A18 18 0 0 1 30 52 Z', 'none', C.ink, 7), path('M30 52 L90 32 A18 18 0 0 1 90 68 L30 88 A18 18 0 0 1 30 52 Z', 'none', HL, 5),
    path('M30 52 L90 32 A18 18 0 0 1 90 68 L30 88 A18 18 0 0 1 30 52 Z', 'none', C.ink, 1.6, ), line('M40 49 L42 53 M50 46 L52 50 M60 43 L62 47 M70 39 L72 43 M80 36 L82 40 M40 84 L42 80 M50 81 L52 77 M60 78 L62 74 M70 75 L72 71 M80 71 L82 67', C.ink, 1.8), ring(60, 44, 10, C.yellow)),
  'mpart.länk.2': all(rect(6, 6, 108, 108, '#f2f0ea', 6, null), ...range(7).map((i) => i === 3 ? '' : (i % 2 ? ellipse(12 + i * 16, 60, 11, 6, 'none', C.dark, 4) : ellipse(12 + i * 16, 60, 11, 8, 'none', C.grey, 4))),
    ellipse(60, 60, 12, 8, 'none', C.ink, 6), ellipse(60, 60, 12, 8, 'none', HL, 4), ring(60, 60, 18)),
  'mpart.kedjehjul': all(wall('#eef6ea'), chainD('M60 28 L118 34 M60 92 L118 80'), gear(60, 60, 32, 18, HL, 0), circle(60, 60, 6, C.dark, null),
    line('M60 60 L34 96', C.ink, 7), line('M60 60 L34 96', C.silver, 5), rect(22, 94, 22, 7, C.dark, 2, C.ink, 1.2)),
  'mpart.kedjeskydd': all(wall('#eef6ea'), ground(), cycWheel(26, 86, 24), cycWheel(98, 86, 24), line('M26 86 L54 86 L44 56 L26 86 M54 86 L84 58 L44 56 M84 58 L98 86 M44 56 L42 48 M84 58 L88 44', C.navy, 3.4),
    path('M44 78 C44 72 52 72 56 74 L98 80 C104 82 104 90 98 92 L56 96 C50 96 44 92 44 88 Z', HL, C.ink, 1.6), rect(36, 44, 14, 5, C.dark, 2, null), line('M82 44 L94 44', C.dark, 3)),
  'mpart.spänna.2': all(wall('#eef1f4'), gear(28, 64, 16, 12, C.silver, 0), greyed(path('M28 48 C52 60 70 60 94 48 M28 80 C52 98 70 98 94 80', 'none', C.dark, 2, )),
    waIn('mpspa', -10, 0, gear(94, 64, 12, 9, C.silver, 0), spanner(94, 64, 40, 38)), chainD('M28 48 L94 52 M28 80 L94 76', HL), arrow(78, 104, 106, 104, HL, 3)),
  'mpart.slak': all(wall('#eef1f4'), gear(24, 52, 14, 11, C.silver, 0), gear(96, 52, 12, 9, C.silver, 0), greyed(line('M24 38 L96 40 M24 66 L96 64', C.dark, 2, '4 3')),
    chainD('M24 38 L96 40'), chainD('M24 66 C44 104 76 104 96 64', HL), arrow(60, 76, 60, 92, HL, 2.6)),
  'mpart.slira': all(rect(0, 0, 120, 92, '#dfeef6', 0, null), rect(0, 92, 120, 28, ICE, 0, null), line('M6 98 L40 96 M60 104 L110 100', C.white, 2), car(66, 92, 1.4, C.red),
    waSpin('mpsli', 0.6, g('translate(41 84)', line('M-6 0 L6 0 M0 -6 L0 6', C.silver, 2))), path('M18 88 C10 84 8 76 12 70', 'none', AIR, 2.4), circle(14, 96, 2, C.white, AIR, 1), circle(8, 92, 2.4, C.white, AIR, 1), circle(20, 100, 1.6, C.white, AIR, 1),
    arrow(66, 30, 96, 30, C.grey, 3), cross(82, 30, 6), path('M30 74 A14 14 0 1 1 54 78', 'none', HL, 2.6)),
  'mpart.transportband': all(wall('#eef1f4'), rect(0, 70, 120, 42, '#cfd5db', 0, null), rect(4, 66, 112, 14, C.dark, 7, C.ink, 1.8), ...range(7).map((i) => circle(14 + i * 15.5, 73, 4, '#6d7280', C.ink, 0.8)), rect(10, 80, 100, 26, C.grey, 2, C.ink, 1.4),
    moving('mptra', '0%{transform:translate(-40px,0)}100%{transform:translate(40px,0)}', { dur: 4 },
      rect(28, 44, 26, 22, C.red, 3, C.ink, 1.6), path('M36 44 L36 38 L46 38 L46 44', 'none', C.ink, 2), rect(64, 36, 22, 30, C.navy, 3, C.ink, 1.6), path('M70 36 L70 30 L80 30 L80 36', 'none', C.ink, 2)),
    arrow(44, 96, 76, 96, HL, 3)),

  // ── 4014 Fjädrar och dämpare ──
  'mpart.fjädra': all(wall('#f3efe6'), ground(), rect(28, 100, 44, 12, C.grey, 2, C.ink, 1.4),
    moving('mpfjd', '0%,100%{transform:translate(0,0)}25%{transform:translate(0,10px)}55%{transform:translate(0,-4px)}75%{transform:translate(0,2px)}', { dur: 2 }, rect(22, 48, 56, 12, HL, 3, C.ink, 1.8)),
    coil(38, 60, 100, 7, 8, C.dark, 2.6), coil(62, 60, 100, 7, 8, C.dark, 2.6), arrow(90, 44, 90, 66, HL, 2.8), arrow(102, 66, 102, 44, HL, 2.8),
    greyed(rect(94, 84, 22, 6, C.brown, 1, C.ink, 1.2), line('M98 90 L98 112 M112 90 L112 112', C.brown, 3))),
  'mpart.resår.2': all(wall('#eef1f4'), rect(8, 40, 104, 56, '#f4f0fa', 10, C.ink, 2), path('M8 50 C8 42 14 40 22 40 L98 40 C106 40 112 42 112 50 L112 56 L8 56 Z', C.lilac, C.ink, 1.6),
    rect(16, 58, 88, 34, C.white, 2, C.grey2, 1), ...range(6).map((i) => coil(24 + i * 14.4, 60, 90, 4.4, 7, HL, 2.2)), line('M8 104 L112 104', C.brown, 6)),
  'mpart.dörrstängare': all(wall('#eef1f4'), floor(), rect(14, 10, 8, 94, C.brown, 1, C.ink, 1.4), path('M22 14 L74 22 L74 104 L22 104 Z', C.tan, C.ink, 1.8), circle(66, 64, 3, C.gold, C.ink, 1),
    rect(30, 16, 26, 10, C.dark, 3, C.ink, 1.4), line('M54 21 L66 12 L22 12', C.silver, 3), ring(42, 18, 16), path('M96 40 A40 40 0 0 0 84 92', 'none', C.grey, 2.4), arrow(90, 84, 80, 96, C.grey, 2.4)),
  'mpart.stöt': all(rect(0, 0, 120, 120, '#e8f1f6', 0, null), path('M0 96 L48 96 L52 108 L70 108 L74 96 L120 96 L120 120 L0 120 Z', '#8d949b', C.ink, 1.6),
    waShake('mpsto', car(80, 92, 1.4, C.sky)), burst(56, 100, 12), line('M40 50 L48 56 M38 62 L46 64 M108 46 L100 52', C.red, 2.4)),
  'mpart.gropig': all(rect(0, 0, 120, 120, '#cfe7c8', 0, null), path('M44 0 L76 0 L118 120 L2 120 Z', '#9a8a74', C.ink, 1.6),
    ...[[56, 18, 4, 2], [66, 34, 6, 2.6], [50, 46, 7, 3], [74, 60, 9, 3.6], [42, 72, 10, 4], [66, 86, 13, 5], [36, 102, 13, 5], [86, 106, 12, 5]].map(([x, y, rx, ry]) => ellipse(x!, y!, rx!, ry!, '#5c4e3e', C.ink, 1)),
    ellipse(66, 86, 9, 3, '#8cc7e8', null), frame(26, 8, 68, 106)),
  'mpart.fjädring': all(rect(0, 0, 120, 120, '#e8f1f6', 0, null), path('M0 18 L120 18 L120 40 L0 40 Z', C.red, C.ink, 1.8), path('M0 104 C30 104 40 94 60 94 C80 94 90 104 120 104 L120 120 L0 120 Z', '#8d949b', C.ink, 1.6),
    circle(60, 76, 18, C.dark, C.ink, 1.6), circle(60, 76, 8, C.silver, C.ink, 1.2), rect(56, 40, 8, 28, C.grey, 2, C.ink, 1.2), coil(60, 40, 64, 10, 8, HL, 3), frame(42, 36, 36, 34), arrow(98, 92, 98, 70, HL, 2.6)),

  // ── 4015 Skruvar och muttrar ──
  'mpart.bult': all(rect(6, 6, 108, 108, '#f2f0ea', 6, null), rect(10, 46, 100, 14, C.tan, 1, C.ink, 1.6), rect(10, 60, 100, 14, '#c9ced4', 1, C.ink, 1.6),
    shank(60, 36, 92, 12, HL), path('M44 26 L76 26 L76 38 L44 38 Z', HL, C.ink, 1.8), line('M54 26 L54 38 M66 26 L66 38', C.ink, 1), greyed(sideNut(60, 82, 30, 12))),
  'mpart.bricka.2': all(rect(6, 6, 108, 108, '#f2f0ea', 6, null), rect(8, 70, 66, 16, '#c9ced4', 1, C.ink, 1.6), greyed(shank(40, 30, 104, 10)), greyed(sideNut(40, 56, 24, 12)),
    rect(22, 64, 36, 6, HL, 2, C.ink, 1.6), circle(92, 44, 16, HL, C.ink, 1.8), circle(92, 44, 7, '#f2f0ea', C.ink, 1.4), ring(92, 44, 21), ring(40, 67, 22)),
  'mpart.gänga': all(rect(6, 6, 108, 108, '#f2f0ea', 6, null), path('M8 44 L20 44 L20 76 L8 76 Z', STEEL, C.ink, 1.6), rect(20, 50, 84, 20, STEEL, 2, C.ink, 1.6), path('M104 50 L114 60 L104 70 Z', STEEL, C.ink, 1.4),
    line(range(10).map((i) => `M${26 + i * 8} 70 L${32 + i * 8} 50`).join(' '), HL, 2.6), circle(62, 60, 22, 'rgba(255,255,255,0.25)', C.ink, 2.4), line('M78 76 L96 96', C.ink, 6), line('M78 76 L96 96', C.brown, 4)),
  'mpart.skruva': all(wall('#f2f0ea'), rect(6, 84, 108, 28, C.tan, 2, C.ink, 1.6), line('M10 92 L110 92 M10 102 L110 102', '#b58a5a', 1),
    waIn('mpskr', 0, -12, shank(60, 70, 94, 6), path('M52 66 L68 66 L60 74 Z', STEEL, C.ink, 1.4), rect(57, 18, 6, 48, STEEL, 2, C.ink, 1.4), rect(52, 4, 16, 22, C.red, 5, C.ink, 1.6), fist(60, 14, 18, 8)),
    path('M38 30 A22 10 0 0 0 82 30', 'none', HL, 2.6), arrow(78, 36, 84, 30, HL, 2.6)),
  'mpart.lös.2': all(wall('#eef1f4'), rect(30, 10, 60, 102, C.tan, 2, C.ink, 1.8), rect(40, 46, 12, 26, STEEL, 3, C.ink, 1.4),
    waSway('mplos', 14, g('translate(46 58)', rect(-2, -3, 32, 7, STEEL, 3, C.ink, 1.6))), circle(46, 52, 1.6, C.dark, null),
    g('translate(54 92) rotate(30)', shank(0, 0, 12, 4)), line('M80 46 L86 42 M80 70 L86 74 M84 58 L92 58', HL, 2.4),
    greyed(g('translate(96 26) scale(0.5)', rect(-6, -10, 12, 26, STEEL, 3, C.ink, 1.4), rect(0, -3, 32, 7, STEEL, 3, C.ink, 1.6)))),
  'mpart.fäste': all(wall('#efe8dc'), rect(84, 22, 12, 60, HL, 2, C.ink, 1.8), ...[30, 74].map((y) => circle(90, y, 2, C.dark, null)), line('M84 44 L64 44 M84 60 L64 60', C.ink, 6), line('M84 44 L64 44 M84 60 L64 60', HL, 4),
    greyed(rect(8, 22, 56, 58, C.dark, 3, C.ink, 1.8), rect(12, 26, 48, 50, '#5c6f86', 1, null)), frame(60, 16, 42, 72)),
  'mpart.nita': all(wall('#f2f0ea'), rect(8, 78, 68, 12, '#c9ced4', 1, C.ink, 1.6), rect(44, 88, 68, 12, '#9aa3ad', 1, C.ink, 1.6), rect(56, 72, 8, 32, HL, 2, C.ink, 1.4), ellipse(60, 72, 8, 4, HL, C.ink, 1.4), ellipse(60, 104, 8, 4, HL, C.ink, 1.4),
    moving('mpnit', '0%,100%{transform:rotate(0)}40%{transform:rotate(-24deg)}55%{transform:rotate(4deg)}', { dur: 1.6 }, g('translate(104 50)', rect(-50, -6, 54, 8, C.brown, 3, C.ink, 1.6), rect(-58, -16, 18, 26, C.dark, 3, C.ink, 1.6), fist(-8, -2, 14, 14))),
    burst(60, 66, 6, C.yellow)),
  'mpart.rosta-fast': all(wall('#eef1f4'), rect(8, 76, 104, 16, '#8d949b', 1, C.ink, 1.6), shank(46, 56, 76, 10, '#a86b3a'),
    hexNut(46, 62, 12, RUST), ...[[42, 58], [50, 66], [44, 68], [52, 58]].map(([x, y]) => circle(x!, y!, 1.8, '#7a3d0f', null)),
    waShake('mprost', spanner(46, 62, -20, 50), fist(96, 44, 12, 16)), line('M66 30 L72 24 M78 34 L84 30 M60 40 L64 34', C.red, 2.4), cross(30, 34, 5)),

  // ── 4016 Hydraulik ──
  'mpart.hydraulik': all(rect(6, 6, 108, 108, C.white, 6, C.grey2, 1.4), path('M12 50 L32 50 L32 96 L76 96 L76 60 L110 60 L110 108 L12 108 Z', OIL, C.ink, 1.8),
    moving('mphyd1', '0%{transform:translate(0,-8px)}60%,100%{transform:translate(0,0)}', { dur: 2.6 }, rect(14, 40, 16, 8, C.dark, 1, C.ink, 1.2), rect(19, 18, 6, 22, C.grey, 1, C.ink, 1.2)), arrow(22, 6, 22, 16, HL, 3),
    moving('mphyd2', '0%{transform:translate(0,4px)}60%,100%{transform:translate(0,0)}', { dur: 2.6 }, rect(78, 52, 30, 8, C.dark, 1, C.ink, 1.2), car(93, 50, 0.6, C.sky)), arrow(116, 50, 116, 32, HL, 3), ...[[50, 102], [60, 102], [92, 84], [100, 96], [22, 76]].map(([x, y]) => drop(x!, y!, 0.8, '#fff4cf'))),
  'mpart.slang.1': all(rect(0, 0, 120, 120, '#d9efd2', 0, null), ellipse(40, 90, 30, 14, 'none', C.ink, 7.6), ellipse(40, 90, 30, 14, 'none', C.green, 5.4), ellipse(40, 86, 22, 10, 'none', C.ink, 7.6), ellipse(40, 86, 22, 10, 'none', C.green, 5.4),
    path('M68 90 C84 90 86 70 92 60', 'none', C.ink, 7.6), path('M68 90 C84 90 86 70 92 60', 'none', C.green, 5.4), rect(88, 50, 10, 12, C.yellow, 2, C.ink, 1.4),
    waIn('mpsla', -8, 8, path('M96 50 C100 30 108 24 116 22 M98 50 C106 36 112 34 118 36', 'none', AIR, 2.4), drop(108, 30, 0.9, AIR), drop(114, 44, 0.9, AIR))),
  'mpart.cylinder.2': all(rect(6, 6, 108, 108, '#eef1f4', 6, null), g('translate(18 92) rotate(-30)', rect(0, -10, 56, 20, HL, 4, C.ink, 1.8), circle(-2, 0, 7, C.dark, C.ink, 1.4),
      moving('mpcyl', '0%{transform:translate(-30px,0)}60%,100%{transform:translate(0,0)}', { dur: 2.6 }, rect(54, -4, 40, 8, C.silver, 2, C.ink, 1.6), circle(96, 0, 6, C.dark, C.ink, 1.4))),
    path('M30 70 C26 56 40 44 54 52', 'none', C.ink, 4.6), path('M30 70 C26 56 40 44 54 52', 'none', C.dark, 3)),
  'mpart.hydraulolja': all(wall('#eef1f4'), floor(), rect(60, 52, 54, 48, C.yellow, 4, C.ink, 1.8), rect(70, 40, 12, 12, C.dark, 2, C.ink, 1.4), circle(100, 70, 8, C.white, C.ink, 1.4), line('M100 70 L104 65', C.red, 2),
    g('translate(16 10) rotate(35)', rect(0, 0, 30, 40, OIL, 6, C.ink, 1.8), rect(22, -6, 8, 8, C.dark, 1, C.ink, 1.2), path('M4 6 C-6 10 -6 26 4 30', 'none', C.ink, 3), drop(15, 22, 1.8, '#fff4cf')),
    waIn('mphyo', -6, -10, path('M56 40 C66 36 74 38 76 42', 'none', OIL, 4), drop(76, 46, 1)), ring(76, 42, 12)),
  'mpart.packning.2': all(rect(6, 6, 108, 108, '#eef1f4', 6, null), rect(4, 48, 34, 24, STEEL, 0, C.ink, 1.6), rect(82, 48, 34, 24, STEEL, 0, C.ink, 1.6), flange(40, 60, 44), flange(80, 60, 44),
    ellipse(60, 60, 7, 22, C.dark, C.ink, 1.6), ellipse(60, 60, 3, 13, '#eef1f4', null), ring(60, 60, 26), arrow(48, 100, 56, 86, C.grey, 2), arrow(72, 100, 64, 86, C.grey, 2)),
  'mpart.oljefläck': all(rect(0, 0, 120, 120, '#d6d0c4', 0, null), ellipse(58, 100, 34, 9, '#2f2a35', null), ellipse(52, 98, 14, 3, '#6a5aa8', null), ellipse(68, 101, 10, 2.4, '#3f8f8a', null),
    car(60, 84, 1.5, C.green), waIn('mpofl', 0, -10, drop(64, 90, 1.2, '#2f2a35')), ring(58, 100, 38)),
  'mpart.press.3': all(wall('#eef1f4'), floor(), rect(14, 14, 12, 90, MACH, 2, C.ink, 1.6), rect(94, 14, 12, 90, MACH, 2, C.ink, 1.6), rect(14, 8, 92, 16, MACH, 3, C.ink, 1.6), rect(24, 80, 72, 20, C.dark, 2, C.ink, 1.6),
    moving('mppre', '0%,100%{transform:translate(0,-16px)}50%,70%{transform:translate(0,0)}', { dur: 2.4 }, rect(56, 24, 8, 30, C.silver, 1, C.ink, 1.4), rect(34, 54, 52, 12, HL, 2, C.ink, 1.6)),
    path('M38 72 L82 72 L78 80 L42 80 Z', STEEL, C.ink, 1.4)),
  'mpart.skopa.2': all(rect(0, 0, 120, 120, '#e3eef6', 0, null), rect(0, 96, 120, 24, '#b08a5a', 0, null), greyed(rect(2, 30, 30, 40, C.yellow, 3, C.ink, 1.6)), line('M28 40 L76 22 L92 56', C.ink, 10), line('M28 40 L76 22 L92 56', C.yellow, 7),
    moving('mpsko', '0%{transform:translate(0,22px)}60%,100%{transform:translate(0,0)}', { dur: 2.8 }, path('M74 56 L108 56 L104 86 C96 96 80 96 72 84 Z', HL, C.ink, 2), ...[[80, 54], [90, 50], [100, 54], [86, 46]].map(([x, y]) => circle(x!, y!, 5, '#9aa3ad', C.ink, 1)), line('M72 84 L68 92 M80 90 L78 98 M90 92 L90 100', C.ink, 2)), frame(64, 38, 52, 64)),

  // ── 4017 Pneumatik ──
  'mpart.tryckluft.2': all(wall('#eef1f4'), rect(66, 64, 46, 24, '#8d949b', 3, C.ink, 1.6), ...[[74, 62], [84, 60], [96, 62]].map(([x, y]) => circle(x!, y!, 1.6, C.brown, null)),
    path('M4 30 C10 10 24 14 26 26', 'none', C.ink, 5), path('M4 30 C10 10 24 14 26 26', 'none', C.yellow, 3), g('translate(20 24)', rect(0, 0, 14, 22, C.dark, 3, C.ink, 1.4), rect(10, 2, 26, 7, C.grey, 2, C.ink, 1.2)),
    waIn('mptrl', -16, -6, line('M58 32 L76 52 M60 26 L86 48 M54 36 L70 56', AIR, 2.6), dot(80, 50, 1.8), dot(90, 46, 1.8)), waIn('mptrd', -10, 10, circle(100, 52, 1.6, C.brown, null), circle(108, 46, 1.4, C.brown, null))),
  'mpart.komprimera.2': all(rect(6, 6, 108, 108, C.white, 6, C.grey2, 1.4),
    greyed(rect(12, 24, 34, 80, 'rgba(140,199,232,0.25)', 2, C.ink, 1.6), rect(14, 26, 30, 6, C.dark, 1, null), ...range(8).map((i) => dot(18 + (i % 3) * 11, 40 + Math.floor(i / 3) * 22, 2.4, C.grey))),
    arrow(52, 64, 64, 64, HL, 2.6), rect(72, 24, 34, 80, 'rgba(140,199,232,0.25)', 2, C.ink, 1.6),
    moving('mpkom', '0%{transform:translate(0,-38px)}60%,100%{transform:translate(0,0)}', { dur: 2.8 }, rect(74, 62, 30, 8, C.dark, 1, null), rect(86, 20, 6, 42, C.grey, 1, C.ink, 1.2)),
    ...range(8).map((i) => dot(78 + (i % 4) * 7, 76 + Math.floor(i / 4) * 12 + (i % 2) * 4, 2.4)), frame(68, 70, 42, 38)),
  'mpart.pneumatik': all(rect(6, 6, 108, 108, '#eef1f4', 6, null), rect(10, 62, 28, 34, MACH, 3, C.ink, 1.6), circle(24, 54, 8, C.white, C.ink, 1.4), line('M24 54 L28 50', C.red, 2),
    path('M38 80 C54 80 54 40 70 40', 'none', C.ink, 6), path('M38 80 C54 80 54 40 70 40', 'none', AIR, 4), waIn('mppnd', -24, 30, dot(48, 66, 2), dot(56, 48, 2)),
    rect(70, 32, 22, 16, STEEL, 2, C.ink, 1.6), moving('mppnr', '0%{transform:translate(-14px,0)}50%,100%{transform:translate(0,0)}', { dur: 2.4 }, rect(92, 37, 10, 6, C.silver, 1, C.ink, 1.2), rect(102, 28, 6, 24, C.dark, 1, C.ink, 1.2)),
    rect(60, 96, 52, 6, C.dark, 2, null), frame(64, 24, 50, 32)),
  'mpart.tryckmätare': all(wall('#eef1f4'), rect(52, 88, 16, 24, STEEL, 1, C.ink, 1.6), rect(0, 104, 120, 8, '#8d949b', 0, C.ink, 1.4), circle(60, 54, 38, C.white, C.ink, 2.6), circle(60, 54, 32, '#f8f8f4', C.ink, 1),
    ...range(9).map((i) => { const a = rad(135 + i * 33.75); return line(`M${f1(60 + Math.cos(a) * 30)} ${f1(54 + Math.sin(a) * 30)} L${f1(60 + Math.cos(a) * 24)} ${f1(54 + Math.sin(a) * 24)}`, i > 6 ? C.red : C.ink, 1.8); }),
    path(`M${f1(60 + Math.cos(rad(135)) * 31)} ${f1(54 + Math.sin(rad(135)) * 31)} A31 31 0 0 1 ${f1(60 + Math.cos(rad(-45 + 0)) * 31)} ${f1(54 + Math.sin(rad(-45)) * 31)}`, 'none', C.grey2, 0.8),
    moving('mptmm', '0%{transform:rotate(-80deg)}60%,100%{transform:rotate(0)}', { dur: 3 }, line('M60 54 L80 36', HL, 3.4)), circle(60, 54, 4, C.dark, null), T(40, 80, '0', 8), T(80, 80, '10', 8), ring(60, 54, 44)),
  'mpart.pysa': all(wall('#eef6ea'), ground(), path('M18 66 C18 40 36 22 56 22 C76 22 94 40 94 66 C94 88 86 104 76 110 L36 110 C26 104 18 88 18 66 Z', C.dark, C.ink, 1.8), circle(56, 66, 22, '#d9dee3', C.ink, 1.4), circle(56, 66, 6, C.grey, C.ink, 1.2),
    line(range(8).map((i) => { const a = rad(i * 22.5); return `M${f1(56 - Math.cos(a) * 20)} ${f1(66 - Math.sin(a) * 20)} L${f1(56 + Math.cos(a) * 20)} ${f1(66 + Math.sin(a) * 20)}`; }).join(' '), C.grey, 0.8), rect(54, 40, 4, 8, C.silver, 1, C.ink, 1),
    circle(92, 56, 2.6, '#f6f2ea', C.ink, 1), waIn('mppys', -12, 6, path('M96 52 C102 46 98 40 104 36 M98 58 C106 56 106 50 112 50 M97 62 C104 64 108 60 114 64', 'none', AIR, 2.6), dot(108, 40, 1.8), dot(116, 56, 1.8)), ring(92, 56, 9)),
  'mpart.spikpistol': all(wall('#efe8dc'), rect(6, 86, 108, 18, C.tan, 2, C.ink, 1.6), line('M10 95 L110 95', '#b58a5a', 1), ...[22, 36].map((x) => circle(x, 86, 3, STEEL, C.ink, 1)),
    g('translate(52 20)', path('M0 0 L40 0 L44 16 L18 16 L18 40 L8 44 L8 16 L0 16 Z', '#d64545', C.ink, 1.8), rect(-6, 16, 22, 50, C.dark, 3, C.ink, 1.6), path('M40 6 C56 6 62 14 70 8', 'none', AIR, 3)),
    waIn('mpspi', 0, -14, rect(55, 84, 4, 12, STEEL, 1, C.ink, 1)), burst(57, 86, 6, C.yellow), path('M20 60 C10 50 14 40 24 40', 'none', AIR, 3)),
  'mpart.sugkopp.2': all(rect(0, 0, 120, 120, '#cfe8f5', 0, null), rect(6, 6, 108, 108, '#e8f5fb', 2, C.white, 4), line('M20 20 L40 40 M70 14 L100 44', C.white, 3),
    path('M44 44 C44 34 76 34 76 44 L68 50 L52 50 Z', '#f2c14e', C.ink, 1.8), rect(56, 50, 8, 10, '#f2c14e', 1, C.ink, 1.4), path('M60 60 L60 74 C60 82 70 82 70 74', 'none', C.ink, 3), rect(50, 76, 30, 34, C.red, 2, C.ink, 1.6), ring(60, 44, 22)),
  'mpart.luftbroms': all(rect(0, 0, 120, 120, '#e3e7eb', 0, null), rect(0, 104, 120, 16, '#8d949b', 0, null), rect(0, 20, 120, 40, '#3f7fc8', 2, C.ink, 1.8), circle(60, 78, 28, C.dark, C.ink, 1.8), circle(60, 78, 14, C.silver, C.ink, 1.4),
    rect(86, 54, 22, 18, C.grey, 8, C.ink, 1.6), path('M108 60 C116 60 116 40 106 36', 'none', C.ink, 3.4), waGrow('mplbr', g('translate(100 90) scale(1.8)', path('M-10 6 C-16 6 -16 -2 -10 -2 C-10 -8 -2 -10 2 -6 C6 -10 14 -8 12 -2 C18 -2 18 6 12 6 Z', C.white, AIR, 1.4)), line('M96 74 L90 84 M104 74 L106 84 M110 72 L116 80', AIR, 2.2)), ring(97, 63, 16)),
  'mpart.luftfjädring': all(rect(0, 0, 120, 120, '#e8f1f6', 0, null), rect(0, 100, 50, 20, '#c9ced4', 0, C.ink, 1.4), rect(50, 106, 70, 14, '#8d949b', 0, null),
    moving('mplfj', '0%{transform:translate(0,-8px)}60%,100%{transform:translate(0,0)}', { dur: 2.8 }, rect(8, 14, 108, 64, C.green, 6, C.ink, 1.8), rect(14, 22, 30, 26, '#dff1fb', 2, C.ink, 1.2), rect(50, 22, 24, 50, '#dff1fb', 2, C.ink, 1.2), rect(80, 22, 30, 26, '#dff1fb', 2, C.ink, 1.2)),
    circle(94, 98, 11, C.dark, C.ink, 1.6), circle(94, 98, 4, C.silver, null), path('M86 78 C83 80 83 82 86 83 C83 84 83 86 86 87 L102 87 C105 86 105 84 102 83 C105 82 105 80 102 78 Z', C.dark, C.ink, 1.4), ring(94, 83, 12), arrow(28, 82, 28, 96, HL, 2.8)),
};
