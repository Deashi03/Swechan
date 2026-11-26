/**
 * Kvalitetsplanen B5 – det manuella bildspåret, Djur, Växter & svampar och Länder & geografi (R05).
 * Djurord ritas med egna enkla djur (fåglar, fiskar, vargar, sköldpaddor), växt- och svampord med
 * närbilder och kontrastpar (frisk/vissen, fast/murken, ätlig/giftig), geografiord med egna kartor och
 * påhittade länder utan riktiga gränser eller flaggor. Orange visar det ordet betyder, grått det som ordet
 * inte är. Bara siffror, enheter och tecken; inga ord.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waGrow, waIn, waPulse, waShake, waSway, type Svg } from './kit';
import { HL, T, flake, heart } from './people';
import { greyed } from './blindFix';
import { figure } from './figures';
import { SOFT, check, cross, qm } from './manualPhilosophy';

const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const sky = (col = '#d6ecf7') => rect(0, 0, 120, 120, col, 0, null);
const grass = (y = 98, col = '#cfe8b9') => rect(0, y, 120, 120 - y, col, 0, null);
const sea = (y: number, col = '#8fc7e8') => rect(0, y, 120, 120 - y, col, 0, null);
const panel = (x: number, y: number, w: number, h: number, bg: string, stroke: string = C.grey2, sw = 1.4) => rect(x, y, w, h, bg, 4, stroke, sw);

/** Side view of a small bird facing right. */
const bird = (x: number, y: number, s = 1, col: string = C.brown, breast: string = C.beige) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-14 -2 L-24 -6 L-22 2 Z', col, C.ink, 1.2), ellipse(-2, 0, 13, 9, col, C.ink, 1.4), path('M-2 2 C2 8 10 6 10 0 Z', breast, null), circle(10, -7, 6.5, col, C.ink, 1.4),
  path('M16 -8 L22 -6 L16 -4 Z', C.yellow, C.ink, 1), circle(11.5, -8, 1.3, C.ink, null), path('M-10 -4 C-4 -10 4 -8 6 -2 C0 -2 -6 0 -10 -4 Z', 'rgba(0,0,0,0.15)', C.ink, 1),
  line('M-2 8 L-3 14 M3 8 L4 14', C.ink, 1.2));
/** A bird in flight (simple "m" shape). */
const flyer = (x: number, y: number, s = 1, col: string = C.ink) => line(`M${x - 6 * s} ${y} Q${x - 3 * s} ${y - 4 * s} ${x} ${y} Q${x + 3 * s} ${y - 4 * s} ${x + 6 * s} ${y}`, col, 1.8);
/** Side view of a fish facing right. */
const fish = (x: number, y: number, s = 1, col: string = C.silver, flip = false) => g(`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`,
  path('M-14 0 L-22 -7 L-22 7 Z', col, C.ink, 1.2), ellipse(0, 0, 15, 7, col, C.ink, 1.4), circle(9, -1.5, 1.4, C.ink, null), line('M4 -5 C6 -2 6 2 4 5', C.ink, 1));
/** A four-legged animal (wolf/fox shape) facing right; feet at y. */
const beast = (x: number, y: number, s = 1, col: string = C.grey, low = false) => g(`translate(${x} ${y}) scale(${s})`,
  path(low ? 'M-18 -12 C-28 -10 -30 -4 -34 -2' : 'M-18 -22 C-26 -24 -30 -30 -32 -36', 'none', C.ink, 4), path(low ? 'M-18 -12 C-28 -10 -30 -4 -34 -2' : 'M-18 -22 C-26 -24 -30 -30 -32 -36', 'none', col, 2.6),
  ...(low ? [line('M-14 -6 L-18 0 M-6 -6 L-6 0 M6 -6 L4 0 M14 -6 L16 0', C.ink, 3), ellipse(0, -9, 20, 7, col, C.ink, 1.4), path('M16 -10 L30 -8 L32 -4 L18 -2 Z', col, C.ink, 1.2), path('M18 -10 L20 -15 L24 -10 Z', col, C.ink, 1), circle(26, -7, 1, C.ink, null)]
    : [line('M-14 -14 L-15 0 M-7 -14 L-7 0 M7 -14 L7 0 M14 -14 L15 0', C.ink, 3.4), ellipse(0, -20, 20, 9, col, C.ink, 1.4), path('M14 -26 L22 -38 L34 -34 L36 -28 L24 -24 Z', col, C.ink, 1.4), path('M22 -37 L22 -46 L28 -38 Z', col, C.ink, 1.2), circle(28, -33, 1.3, C.ink, null), circle(35.5, -29, 1.4, C.ink, null)]));
const tree = (x: number, y: number, s = 1, crown: string = '#4f9d69') => g(`translate(${x} ${y}) scale(${s})`, rect(-3, -24, 6, 24, C.brown, 1, C.ink, 1.2), circle(0, -34, 14, crown, C.ink, 1.4));
const mushroom = (x: number, y: number, s = 1, cap: string = C.brown, stem: string = C.beige) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-5 0 L-4 -18 L4 -18 L5 0 Z', stem, C.ink, 1.4), path('M-18 -16 C-18 -34 18 -34 18 -16 Z', cap, C.ink, 1.6));
const flower = (x: number, y: number, col: string = C.pink, h = 22, s = 1) => all(line(`M${x} ${y} L${x} ${y - h}`, C.green, 2), g(`translate(${x} ${y - h}) scale(${s})`, ...range(5).map((i) => { const a = (i / 5) * Math.PI * 2; return circle(+(Math.cos(a) * 5).toFixed(1), +(Math.sin(a) * 5).toFixed(1), 4, col, C.ink, 0.8); }), circle(0, 0, 2.6, C.yellow, null)));
const bell = (x: number, y: number, col: string, s = 1) => all(line(`M${x} ${y} L${x} ${y - 30 * s} Q${x + 8 * s} ${y - 34 * s} ${x + 10 * s} ${y - 26 * s}`, C.green, 1.8), g(`translate(${x + 10 * s} ${y - 22 * s}) scale(${s})`, path('M-6 -4 C-6 -12 6 -12 6 -4 L8 6 L4 3 L0 6 L-4 3 L-8 6 Z', col, C.ink, 1.2)));
const sunIcon = (x: number, y: number, r: number) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${(x + Math.cos(a) * (r + 3)).toFixed(1)} ${(y + Math.sin(a) * (r + 3)).toFixed(1)} L${(x + Math.cos(a) * (r + 8)).toFixed(1)} ${(y + Math.sin(a) * (r + 8)).toFixed(1)}`, C.gold, 2); }), circle(x, y, r, C.yellow, C.ink, 1.2));
const thermo = (x: number, y: number, h: number, level: number, col: string) => all(rect(x - 4, y, 8, h, C.white, 4, C.ink, 1.4), circle(x, y + h + 4, 6, col, C.ink, 1.4), rect(x - 1.8, y + h - level, 3.6, level + 2, col, 1.5, null));
const country = (d: string, fill: string, stroke: string = C.ink, sw = 1.4) => path(d, fill, stroke, sw);
const pin = (x: number, y: number, col: string = HL) => all(path(`M${x} ${y} C${x - 8} ${y - 10} ${x - 8} ${y - 20} ${x} ${y - 20} C${x + 8} ${y - 20} ${x + 8} ${y - 10} ${x} ${y} Z`, col, C.ink, 1.2), circle(x, y - 14, 3, C.white, null));
const thumbUp = (x: number, y: number, s = 1, col: string = C.skin) => g(`translate(${x} ${y}) scale(${s})`,
  rect(-16, -2, 10, 26, C.sky, 2, C.ink, 1.4), path('M-6 0 C0 -6 2 -14 4 -22 C6 -28 14 -26 12 -18 L10 -8 L22 -8 C28 -8 28 0 24 2 C28 4 26 10 22 10 C26 12 24 18 20 18 C22 20 20 26 16 26 L-6 26 Z', col, C.ink, 1.6));
const turtle = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M-6 2 L-10 6 M6 2 L10 6 M-6 -4 L-10 -8 M6 -4 L10 -8', C.green, 2.4), ellipse(0, -1, 7, 6, '#7aa45a', C.ink, 1.2), circle(0, -9, 3, '#7aa45a', C.ink, 1));
const lichen = (x: number, y: number, s = 1, col = '#a9c49a') => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L-2 10 L-5 18 M-2 10 L2 18 M0 0 L3 8 L6 16 M3 8 L1 15', col, 2.2));

export const MANUAL_NATURE_MOTIFS: Record<string, Svg> = {
  // Däggdjur
  'mann.parningstid': all(rect(0, 0, 120, 120, C.paper, 0, null), ...range(12).map((i) => rect(6 + (i % 6) * 18, 62 + Math.floor(i / 6) * 22, 16, 18, i === 8 || i === 9 ? SOFT : C.white, 2, i === 8 || i === 9 ? HL : C.grey2, i === 8 || i === 9 ? 2.4 : 1.2)), ...range(12).map((i) => T(14 + (i % 6) * 18, 75 + Math.floor(i / 6) * 22, String(i + 1), 8, i === 8 || i === 9 ? HL : C.grey)),
    beast(30, 52, 0.62, C.brown), g('translate(108 0) scale(-1 1)', beast(30, 52, 0.62, '#c08a5a')), waPulse('b5-parningstid-1', heart(60, 14, 1.1, C.red)), path('M60 26 L60 34 M54 34 L66 34 L60 44 Z', HL, null)),
  'mann.varmblodig': all(rect(0, 0, 120, 120, '#e6f1f8', 0, null), rect(0, 96, 120, 24, C.white, 0, null), ...range(8).map((i) => flake(10 + (i * 29) % 104, 10 + (i * 17) % 40, 0.6)),
    path('M14 76 C10 54 50 46 60 62 L66 54 L72 60 L70 70 C70 84 50 92 36 90 C24 90 16 86 14 76 Z', C.orange, C.ink, 1.6), line('M22 90 L22 98 M34 92 L34 98 M48 92 L48 98 M60 88 L60 98', C.ink, 3), circle(66, 63, 1.4, C.ink, null),
    waPulse('b5-varmblodig-1', circle(40, 72, 10, C.red, null), path('M8 60 c-4 -4 4 -8 0 -12 M76 44 c-4 -4 4 -8 0 -12 M40 46 c-4 -4 4 -8 0 -12', 'none', HL, 2)),
    greyed(path('M80 104 C88 98 104 98 114 104', 'none', C.grey, 5), circle(112, 102, 3, C.grey, null), flake(98, 92, 0.5))),
  // Fåglar
  'mann.övervintra': all(panel(4, 14, 54, 86, '#e6f1f8'), panel(62, 14, 54, 86, '#e8f4d8'), rect(5, 78, 52, 21, C.white, 0, null), ellipse(31, 82, 16, 8, '#c08a5a', C.ink, 1.2), circle(27, 80, 6, C.brown, C.ink, 1), path('M16 82 l-3 -3 M20 78 l-2 -4 M40 78 l2 -4 M44 82 l3 -3', C.ink, '1'),
    ...range(5).map((i) => moving(`b5-overvintra-${i}`, '0%{transform:translate(0,-20px);opacity:0}30%{opacity:1}100%{transform:translate(0,30px);opacity:0}', { dur: 2.6, delay: i * 0.5 }, flake(12 + i * 10, 26 + (i % 2) * 10, 0.5))),
    arrow(52, 108, 70, 108, HL, 2.4), sunIcon(102, 30, 7), rect(63, 84, 52, 15, '#cfe8b9', 0, null), flower(104, 92, C.yellow, 12), g('translate(84 84)', ellipse(0, 0, 14, 7, '#c08a5a', C.ink, 1.2), circle(12, -2, 4, C.brown, C.ink, 1), circle(13, -3, 0.9, C.ink, null), line('M-8 6 L-8 9 M6 6 L6 9', C.ink, 2)), check(88, 62, C.green, 1.2)),
  'mann.flyttande': all(sky(), rect(4, 86, 112, 6, C.grey2, 3, null), rect(4, 86, 56, 6, HL, 3, null), circle(10, 89, 8, C.white, C.ink, 1.4), flake(10, 89, 0.7), circle(110, 89, 8, C.yellow, C.ink, 1.4),
    moving('b5-flyttande-1', '0%{transform:translate(-40px,0)}100%{transform:translate(40px,0)}', { dur: 4 }, flyer(56, 50, 2, C.ink), flyer(44, 58, 1.6, C.ink), flyer(68, 58, 1.6, C.ink), flyer(34, 66, 1.3, C.ink), flyer(78, 66, 1.3, C.ink)), line('M10 74 L110 74', HL, 1.6, '4 4'), path('M110 74 l-6 -4 l0 8 Z', HL, null)),
  'mann.flygfärdig': all(sky(), panel(4, 16, 40, 70, C.paper), path('M8 76 C14 86 34 86 40 76 Z', C.brown, C.ink, 1.4), greyed(circle(24, 66, 9, '#e8d9c4', C.ink, 1.2), circle(26, 56, 6, '#e8d9c4', C.ink, 1.2), path('M31 56 L35 58 L31 59 Z', C.yellow, null)), cross(24, 30, HL, 1),
    arrow(46, 54, 56, 54, C.grey, 2), path('M58 100 C66 112 102 112 110 100 Z', C.brown, C.ink, 1.6), line('M60 102 L108 102', '#6b4528', 1.6),
    g('translate(84 84)', ellipse(0, 0, 12, 9, C.brown, C.ink, 1.4), circle(8, -10, 6, C.brown, C.ink, 1.4), path('M14 -11 L19 -9 L14 -7 Z', C.yellow, C.ink, 1), circle(9, -11, 1.2, C.ink, null),
      waSway('b5-flygfardig-1', 14, path('M-4 -4 C-20 -26 -34 -20 -36 -12 C-28 -14 -16 -8 -4 0 Z', HL, C.ink, 1.4)), waSway('b5-flygfardig-2', 14, path('M4 -4 C14 -30 30 -28 34 -20 C24 -20 14 -12 6 0 Z', HL, C.ink, 1.4))), check(104, 28, C.green, 1.3)),
  // Kräldjur och groddjur
  'mann.frostfri': all(rect(0, 0, 120, 120, C.paper, 0, null), rect(18, 58, 84, 2, C.ink, 0, null), thermo(60, 14, 70, 34, HL), T(30, 72, '0 °C', 11, C.ink), rect(20, 22, 30, 32, SOFT, 4, null),
    greyed(flake(92, 82, 1.6)), cross(92, 82, HL, 1.8), check(30, 40, C.green, 1.3)),
  'mann.yttre-befruktning': all(sea(0, '#bfe0f0'), rect(0, 104, 120, 16, '#d9c79c', 0, null), fish(28, 34, 1.2, '#c0a080'), fish(92, 30, 1.2, C.silver, true),
    ...range(9).map((i) => circle(46 + (i % 3) * 9, 70 + Math.floor(i / 3) * 8, 3.4, C.orange, C.ink, 0.8)),
    ...range(5).map((i) => waIn(`b5-yttre-befruktning-${i}`, 14, -16, path(`M${68 + (i % 2) * 6} ${54 + i * 4} c2 -2 4 0 6 -2`, 'none', C.ink, 1.2), circle(66 + (i % 2) * 6, 55 + i * 4, 1.6, C.white, C.ink, 0.8))),
    ellipse(55, 78, 22, 16, 'none', HL, 2.4), path('M36 40 L48 64', C.orange, '1.4'), path('M84 38 L74 54', C.grey, '1.4')),
  // Djurens beteenden
  'mann.revirhävdande': all(grass(0, '#e2efd2'), rect(26, 26, 68, 68, SOFT, 6, HL, 2.6), bird(60, 64, 1.3, C.brown, C.red), ...[[60, 14], [60, 106], [12, 60], [108, 60]].map(([x, y], i) => waShake(`b5-revirhavdande-${i}`, T(x!, y! + 5, '!', 16, HL))),
    greyed(bird(12, 22, 0.6, C.grey), bird(110, 100, 0.6, C.grey), bird(108, 22, 0.6, C.grey)), path('M80 50 c4 -4 4 -10 0 -14 M86 54 c6 -6 6 -16 0 -22', 'none', HL, 1.8)),
  'mann.monogam': all(rect(0, 0, 120, 120, C.paper, 0, null), panel(4, 20, 50, 76, C.white), greyed(bird(18, 60, 0.6, C.brown), bird(40, 46, 0.5, '#c0a080'), bird(40, 66, 0.5, '#c0a080'), bird(40, 86, 0.5, '#c0a080')), cross(30, 14, HL, 1.1),
    panel(62, 20, 54, 76, SOFT, HL, 2.2), bird(76, 72, 0.7, C.brown), g('translate(166 0) scale(-1 1)', bird(64, 72, 0.7, '#c0a080')), heart(89, 44, 1, C.red), path('M66 92 C72 100 106 100 112 92 Z', C.brown, C.ink, 1.2), T(89, 116, '1 + 1', 11, HL), check(102, 14, C.green, 1)),
  'mann.dominant': all(grass(0, '#e8f0dc'), ellipse(48, 96, 16, 5, '#b85c4a', C.ink, 1.2), line('M40 94 L56 98', C.white, 2), beast(56, 104, 1.1, HL),
    greyed(beast(98, 110, 0.6, C.grey, true), beast(28, 112, 0.55, C.grey, true), g('translate(126 0) scale(-1 1)', beast(10, 82, 0.5, C.grey, true))), path('M56 34 L60 24 L64 34', 'none', HL, 2), line('M44 30 L40 22 M76 30 L80 22', HL, 2)),
  'mann.migration.2': all(rect(0, 0, 120, 120, '#e8f2ea', 0, null), panel(6, 4, 108, 22, '#e6f1f8'), flake(60, 15, 1), panel(6, 94, 108, 22, '#fbecc8'), sunIcon(60, 105, 5),
    path('M28 30 C14 50 14 70 28 90', 'none', HL, 3), path('M28 90 l-6 -6 l9 -2 Z', HL, null), path('M92 90 C106 70 106 50 92 30', 'none', HL, 3), path('M92 30 l6 6 l-9 2 Z', HL, null),
    waIn('b5-migration-1', 0, -14, flyer(16, 56, 1.3)), waIn('b5-migration-2', 0, 14, fish(104, 60, 0.45, C.silver)), beast(54, 72, 0.5, C.brown), beast(72, 66, 0.4, C.brown), line('M44 78 L84 50', C.grey, 1.2, '3 3')),
  'mann.instinkt': all(sky('#d6ecf7'), sea(70, '#5fa8d3'), path('M0 70 C40 66 80 74 120 70 L120 120 L0 120 Z', '#ead9a8', null), path('M0 80 L120 80 L120 70 C80 74 40 66 0 70 Z', '#5fa8d3', null),
    ...[[18, 108], [32, 112]].map(([x, y]) => all(path(`M${x! - 7} ${y} C${x! - 7} ${y! - 12} ${x! + 7} ${y! - 12} ${x! + 7} ${y} L${x! + 4} ${y! - 4} L${x} ${y} L${x! - 4} ${y! - 4} Z`, C.white, C.ink, 1))),
    ...range(3).map((i) => waIn(`b5-instinkt-${i}`, -10, 14, turtle(50 + i * 20, 98 - i * 6, 1))), arrow(48, 112, 110, 86, HL, 2.6), greyed(figure({ x: 104, h: 0.25 })), cross(104, 40, HL, 0.8)),
  // Träd, blommor, lavar
  'mann.frodas': all(sky(), rect(0, 100, 120, 20, '#8a5a3a', 0, null), greyed(line('M20 100 L20 80 C14 78 12 84 14 88', C.brown, 2), path('M20 84 C26 84 28 90 24 92', 'none', C.brown, 1.6)), cross(20, 66, HL, 0.8), sunIcon(104, 16, 7),
    waGrow('b5-frodas-1', g('translate(70 100)', line('M0 0 L0 -40 M0 -20 L-18 -36 M0 -24 L16 -42 M0 -34 L-8 -54', '#3f7a4f', 3), ...[[-20, -40], [18, -46], [-8, -58], [6, -60], [-28, -28], [26, -30], [0, -48], [12, -24], [-14, -18]].map(([x, y]) => ellipse(x!, y!, 8, 5, '#4f9d69', C.ink, 1)), flower(-24, -44, C.pink, 0), flower(20, -52, C.yellow, 0), flower(0, -66, C.pink, 0))),
    ...range(4).map((i) => path(`M${40 + i * 18} 112 c0 -3 3 -3 3 0`, 'none', C.green, 1.6))),
  'mann.släkte': all(rect(0, 0, 120, 120, C.paper, 0, null), rect(6, 18, 70, 92, SOFT, 14, HL, 2.6), bell(14, 100, C.purple, 1.1), bell(36, 100, C.lilac, 0.9), bell(54, 100, '#5d7fd6', 1.2),
    greyed(flower(96, 64, C.white, 26), path('M90 100 L90 82 M84 82 C84 72 96 72 96 82 Z', C.green, null), path('M86 100 C82 90 92 84 90 76 C96 84 98 90 94 100 Z', C.red, C.ink, 1)), line('M80 18 L80 110', C.grey2, 1.4, '3 3')),
  'mann.växtfamilj': all(rect(0, 0, 120, 120, C.paper, 0, null), path('M6 40 L60 8 L114 40 Z', SOFT, HL, 2.6), flower(60, 34, C.white, 0, 1.6), rect(6, 40, 108, 2, HL, 0, null),
    tree(24, 104, 1, '#4f9d69'), ...[[18, 64], [30, 70]].map(([x, y]) => flower(x!, y!, C.white, 0, 0.6)), circle(28, 86, 3, C.red, null), line('M60 104 L60 70', C.green, 2), ...range(3).map((i) => path(`M60 ${96 - i * 10} c-8 -2 -10 -8 -4 -8`, 'none', C.green, 2)), flower(60, 70, C.pink, 0, 1),
    path('M88 104 L100 92 L112 104 Z', C.green, null), ...[[92, 92], [108, 92]].map(([x, y]) => flower(x!, y!, C.white, 0, 0.6)), circle(100, 100, 3.6, C.red, C.ink, 0.8), line('M44 52 L32 60 M60 52 L60 66 M76 52 L94 82', HL, 1.4, '3 3')),
  'mann.indikatorart': all(panel(4, 14, 54, 92, '#dff0f8'), panel(62, 14, 54, 92, '#d9d6cf'), tree(31, 104, 1.4), ...range(4).map((i) => lichen(20 + i * 7, 62 + (i % 2) * 4, 0.8)), circle(30, 72, 18, 'none', HL, 2.4),
    rect(80, 24, 10, 16, C.grey, 1, C.ink, 1), ...range(3).map((i) => circle(86 + i * 6, 20 - i * 4, 4 + i, C.grey2, null)), tree(96, 104, 1.4, '#9ca88f'), check(30, 24, C.green, 1.2), cross(108, 50, HL, 1)),
  // Svampar
  'mann.livsfarlig': all(rect(0, 0, 120, 120, C.paper, 0, null), path('M14 84 A46 46 0 0 1 106 84', 'none', C.grey2, 14), path('M82 44 A46 46 0 0 1 106 84', 'none', C.red, 14), path('M14 84 A46 46 0 0 1 40 46', 'none', C.green, 14),
    waShake('b5-livsfarlig-1', line('M60 84 L96 56', C.ink, 3)), circle(60, 84, 5, C.ink, null), heart(98, 30, 1.2, C.red), path('M98 22 L95 30 L100 32 L97 40', 'none', C.white, 1.6), mushroom(30, 112, 0.7, '#e0e6c9')),
  'mann.förväxlingsrisk': all(grass(96), mushroom(32, 100, 1.3, '#c99a5e'), mushroom(88, 100, 1.3, '#c4a066'), check(32, 110, C.green, 0.9), T(88, 116, '☠', 10, C.ink), T(60, 78, '≈', 26, HL),
    path('M60 8 L76 36 L44 36 Z', C.yellow, HL, 2.4), T(60, 33, '!', 16, HL), circle(32, 70, 26, 'none', C.grey2, 1.2), circle(88, 70, 26, 'none', C.grey2, 1.2)),
  'mann.murken': all(rect(0, 0, 120, 120, C.paper, 0, null), greyed(rect(8, 22, 104, 22, C.tan, 6, C.ink, 1.6), line('M16 30 L50 30 M60 36 L100 36', C.brown, 1.2)), check(112, 18, C.green, 0.8),
    path('M8 70 L40 66 L46 72 L70 68 L74 74 L104 70 L112 76 L112 94 L8 94 Z', '#8a6a4a', HL, 2.2), ...range(7).map((i) => circle(18 + i * 13, 82 + (i % 2) * 4, 2.6, '#5a4030', null)),
    ...range(6).map((i) => moving(`b5-murken-${i}`, '0%{transform:translate(0,0);opacity:1}100%{transform:translate(0,16px);opacity:0}', { dur: 2.2, delay: i * 0.3 }, rect(20 + i * 14, 96, 4, 4, '#8a6a4a', 1, null)))),
  'mann.tumregel': all(rect(0, 0, 120, 120, C.paper, 0, null), thumbUp(28, 70, 1, C.skin), rect(58, 18, 54, 80, C.white, 4, C.ink, 1.6),
    ...range(3).map((i) => all(T(66, 38 + i * 22, String(i + 1), 11, HL), line(`M74 ${34 + i * 22} L104 ${34 + i * 22}`, C.grey, 3))), rect(54, 14, 62, 88, 'none', 6, HL, 2)),
  'mann.vid-minsta-tvekan': all(rect(0, 0, 120, 120, C.paper, 0, null), mushroom(26, 96, 1, '#c99a5e'), circle(30, 56, 16, 'none', C.ink, 2), line('M42 68 L52 78', C.ink, 4), waPulse('b5-vid-minsta-tvekan-1', qm(30, 62, 12, HL)),
    arrow(52, 50, 72, 50, C.ink, 2.4), circle(94, 50, 20, C.red, C.ink, 1.6), rect(82, 46, 24, 8, C.white, 1, null), T(60, 112, '1 %', 12, HL)),
  // Växters liv
  'mann.avge': all(sky('#e6f3ea'), grass(100), tree(60, 104, 1.5), ...range(7).map((i) => { const a = Math.PI + (i / 6) * Math.PI; return waIn(`b5-avge-${i}`, Math.round(-Math.cos(a) * 18), Math.round(-Math.sin(a) * 18), circle(+(60 + Math.cos(a) * 46).toFixed(1), +(54 + Math.sin(a) * 40).toFixed(1), 7, C.white, HL, 1.6), T(+(60 + Math.cos(a) * 46).toFixed(1), +(57 + Math.sin(a) * 40).toFixed(1), 'O₂', 7, HL)); })),
  'mann.förökning': all(rect(0, 0, 120, 120, C.paper, 0, null), path('M48 34 L72 34 L68 52 L52 52 Z', '#c0643a', C.ink, 1.4), line('M60 34 L60 16', C.green, 2), ellipse(54, 20, 6, 3, C.green, null), ellipse(66, 22, 6, 3, C.green, null),
    ...[[18, 96], [46, 104], [74, 104], [102, 96]].map(([x, y], i) => all(arrow(60, 56, x!, y! - 26, HL, 1.8), path(`M${x! - 9} ${y! - 14} L${x! + 9} ${y! - 14} L${x! + 7} ${y} L${x! - 7} ${y} Z`, '#c0643a', C.ink, 1.2),
      moving(`b5-forokning-${i}`, '0%,20%{transform:scale(0);opacity:0}60%,100%{transform:scale(1);opacity:1}', { dur: 3, delay: i * 0.25, spin: true }, line(`M${x} ${y! - 14} L${x} ${y! - 26}`, C.green, 1.8), ellipse(x! - 4, y! - 24, 4, 2, C.green, null), ellipse(x! + 4, y! - 22, 4, 2, C.green, null))))),
  'mann.hålla-sig': all(rect(0, 0, 120, 120, C.paper, 0, null), ...[0, 1, 2].map((i) => all(rect(6 + i * 38, 8, 32, 18, C.white, 2, C.ink, 1.2), T(22 + i * 38, 22, ['1', '30', '90'][i]!, 11, C.ink), circle(22 + i * 38, 46, 11, C.red, C.ink, 1.4), line(`M${22 + i * 38} 35 L${24 + i * 38} 30`, C.brown, 1.6), check(22 + i * 38, 66, C.green, 0.8))),
    rect(4, 4, 112, 72, 'none', 6, HL, 2), waPulse('b5-halla-sig-1', arrow(10, 82, 110, 82, HL, 2)), greyed(...[0, 1].map((i) => all(T(30 + i * 60, 98, ['1', '3'][i]!, 9, C.ink), path(`M${44 + i * 60} 104 C${40 + i * 60} 92 ${56 + i * 60} 92 ${52 + i * 60} 104 Z`, i ? '#8c8c70' : C.red, C.ink, 1))), arrow(60, 100, 80, 100, C.grey, 1.6)), cross(104, 108, HL, 0.6)),
  // Kartor och orientering
  'mann.sydlig': all(rect(0, 0, 120, 120, '#f6f2ea', 0, null), rect(0, 60, 120, 60, '#fde3c8', 0, null), circle(60, 48, 16, C.white, C.ink, 1.6), path('M60 34 L64 48 L60 62 L56 48 Z', C.grey, C.ink, 1), path('M60 48 L64 48 L60 62 L56 48 Z', HL, C.ink, 1),
    ...[44, 60, 76].map((x, i) => waIn(`b5-sydlig-${i}`, 0, 16, arrow(x, 112, x, 72, HL, 2.6))), sunIcon(102, 100, 6), T(60, 30, 'N', 8, C.grey)),
  'mann.i-verkligheten': all(rect(0, 0, 120, 120, C.paper, 0, null), greyed(rect(6, 10, 38, 38, C.white, 2, C.ink, 1.2), rect(14, 26, 8, 8, C.grey, 0, null), circle(32, 22, 5, C.grey, null), line('M8 40 L42 36', C.grey, 2)), arrow(44, 40, 58, 56, C.ink, 2.2),
    rect(54, 50, 62, 64, '#d6ecf7', 4, HL, 2.6), rect(55, 94, 60, 19, '#cfe8b9', 0, null), path('M64 94 L64 80 L72 72 L80 80 L80 94 Z', C.red, C.ink, 1.2), rect(69, 86, 6, 8, C.brown, 0, null), tree(100, 96, 0.9), figure({ x: 90, h: 0.3, top: C.yellow })),
  'mann.position': all(rect(0, 0, 120, 120, '#8fc7e8', 0, null), ...range(5).map((i) => line(`M${12 + i * 24} 0 L${12 + i * 24} 120 M0 ${12 + i * 24} L120 ${12 + i * 24}`, '#cfe6f3', 1)),
    line('M60 0 L60 120 M0 60 L120 60', HL, 1.6, '4 3'), path('M50 64 L70 64 L66 70 L54 70 Z', C.white, C.ink, 1.2), line('M60 64 L60 52', C.ink, 1.4), path('M60 52 L66 58 L60 58 Z', C.red, null),
    waPulse('b5-position-1', circle(60, 60, 16, 'none', HL, 3)), circle(60, 60, 26, 'none', HL, 1.4)),
  // Europa
  'mann.gränsa-till': all(rect(0, 0, 120, 120, '#bfe0f0', 0, null), country('M10 24 L56 18 L58 48 L60 88 L14 96 L6 60 Z', '#f6e3b4'),
    waIn('b5-gransa-till-1', 18, 0, country('M58 18 L96 24 L104 58 L94 84 L60 88 L58 48 Z', C.mint)), waPulse('b5-gransa-till-2', line('M58 18 L58 48 L60 88', HL, 5)),
    greyed(country('M86 96 L112 92 L114 114 L88 116 Z', C.grey2)), cross(100, 104, HL, 0.6), check(58, 106, C.green, 1)),
  'mann.dvärgstat': all(rect(0, 0, 120, 120, '#bfe0f0', 0, null), greyed(country('M0 10 L50 6 L54 60 L46 100 L0 104 Z', '#e6d3b3'), country('M58 4 L120 8 L120 100 L60 96 L62 60 Z', '#d9e8c8')),
    country('M53 58 L60 56 L62 62 L56 64 Z', HL, C.ink, 1), circle(57, 60, 7, 'none', HL, 1.6), line('M62 64 L78 80', C.ink, 1.4), circle(92, 92, 20, C.white, HL, 2.6),
    path('M80 104 L80 92 L86 86 L92 92 L92 104 Z', C.white, C.ink, 1), path('M94 104 L94 88 L100 82 L106 88 L106 104 Z', C.white, C.ink, 1), line('M100 82 L100 72', C.ink, 1), path('M100 72 L108 75 L100 78 Z', HL, null)),
  'mann.areal': all(rect(0, 0, 120, 120, '#e8f2f6', 0, null), country('M8 24 C24 8 56 14 62 30 C70 52 60 86 40 96 C20 102 4 84 6 62 C6 48 0 36 8 24 Z', HL, C.ink, 1.6),
    T(78, 64, '>', 24, C.ink), country('M92 54 C100 48 112 52 112 62 C112 72 100 76 94 70 C88 66 88 58 92 54 Z', SOFT, C.grey, 1.4), T(60, 116, 'km²', 12, HL)),
  'mann.regeringssäte': all(rect(0, 0, 120, 120, '#e8f2f6', 0, null), country('M10 50 C10 30 40 24 54 32 C70 40 66 70 56 90 C44 108 16 104 12 84 C10 72 10 62 10 50 Z', '#f6e3b4'),
    greyed(T(24, 58, '★', 18, C.ink)), pin(42, 82, HL), line('M48 66 L64 40', C.ink, 1.2, '3 2'),
    rect(62, 8, 54, 56, C.white, 6, HL, 2.4), path('M68 26 L89 14 L110 26 Z', C.white, C.ink, 1.2), rect(70, 26, 38, 4, C.ink, 0, null), rect(70, 40, 38, 8, C.tan, 2, C.ink, 1.2),
    ...range(4).map((i) => all(circle(74 + i * 10, 36, 3, C.skin, C.ink, 0.8), rect(71 + i * 10, 48, 6, 10, C.navy, 1, null)))),
  'mann.nordbo': all(rect(0, 0, 120, 120, '#bfe0f0', 0, null), greyed(country('M0 92 C20 84 50 86 80 90 L120 96 L120 120 L0 120 Z', '#e6d3b3')),
    country('M30 84 C24 64 34 44 50 30 C60 20 74 12 88 10 C90 22 80 30 76 44 C72 58 66 70 58 80 C50 86 40 88 30 84 Z', '#f8cfae', HL, 2.6), country('M80 46 C86 40 96 40 100 48 C102 60 96 72 88 70 C82 64 78 54 80 46 Z', '#f8cfae', HL, 2.4),
    flake(96, 18, 0.7), g('translate(-4 -16)', figure({ x: 60, h: 0.5, top: '#3f6fb5' })), ...range(3).map((i) => path(`M${36 + i * 8} 78 l3 -8 l3 8 Z`, '#3f7a4f', null))),
};
