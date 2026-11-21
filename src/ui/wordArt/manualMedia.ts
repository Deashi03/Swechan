/**
 * Kvalitetsplanen B5 – det manuella bildspåret, Medier & samhällsdebatt. Medieord ritas med tidningar,
 * skärmar, mikrofoner, pratbubblor och vågar, och kontrastpar för saklig mot vinklad framställning.
 * Orange visar det ordet betyder, grått det som ordet inte är. Bara siffror, tecken och symboler; inga ord.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, star, waIn, type Svg } from './kit';
import { HL, T, heart, bubble } from './people';
import { greyed } from './blindFix';
import { figure } from './figures';
import { SOFT, bust, check, cross, scale } from './manualPhilosophy';

const range = (n: number) => Array.from({ length: n }, (_, i) => i);
/** Folded newspaper; `pic` = colour of the photo block. */
const paper = (x: number, y: number, w: number, h: number, pic: string = C.sky, head: string = C.ink) => all(rect(x, y, w, h, C.white, 2, C.ink, 1.6), rect(x + 4, y + 4, w - 8, 6, head, 1, null),
  rect(x + 4, y + 14, w * 0.45, h * 0.35, pic, 1, null), ...range(5).map((i) => line(`M${x + w * 0.55} ${y + 16 + i * 5} L${x + w - 4} ${y + 16 + i * 5}`, C.grey2, 1.6)), ...range(3).map((i) => line(`M${x + 4} ${y + h * 0.55 + i * 6} L${x + w - 4} ${y + h * 0.55 + i * 6}`, C.grey2, 1.6)));
const screen = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, C.dark, 3, C.ink, 1.6), rect(x + 3, y + 3, w - 6, h - 6, '#d6ecf7', 1, null));
const mic = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-4, -12, 8, 14, C.dark, 4, C.ink, 1), line('M0 2 L0 12', C.ink, 1.6));
const lock = (x: number, y: number, s = 1, col: string = C.gold) => g(`translate(${x} ${y}) scale(${s})`, path('M-7 -2 L-7 -10 C-7 -20 7 -20 7 -10 L7 -2', 'none', C.ink, 3), rect(-11, -2, 22, 18, col, 3, C.ink, 1.6), circle(0, 6, 2.2, C.ink, null));

export const MANUAL_MEDIA_MOTIFS: Record<string, Svg> = {
  // Nyheter
  'manm2.sensation': all(paper(22, 30, 76, 80, C.red, HL), T(60, 24, '!!!', 22, HL), ...[[14, 20], [106, 26], [12, 92], [108, 96]].map(([x, y]) => star(x!, y!, 6, C.yellow)), ...range(3).map((i) => bust(30 + i * 30, 112, 0.35, C.grey2))),
  'manm2.regional': all(path('M54 8 C62 12 70 22 66 36 C74 48 70 64 62 76 C58 90 50 104 42 112 C34 104 36 92 38 80 C30 66 34 50 40 40 C40 26 46 14 54 8 Z', '#eef2ee', C.grey, 1.6), path('M38 80 C44 72 58 72 62 76 C58 90 50 104 42 112 C34 104 36 92 38 80 Z', SOFT, HL, 2.6), circle(52, 30, 3, C.grey, null), circle(96, 30, 14, '#d6ecf7', C.grey, 1.2), T(96, 34, '·', 10, C.grey), arrow(70, 96, 88, 96, HL, 2), rect(88, 82, 26, 28, C.white, 2, HL, 2)),
  'manm2.värdeladdad': all(bubble(60, 26, 70, all(T(42, 32, '”', 18, C.ink), heart(56, 26, 0.7, HL), T(70, 32, '!', 16, HL), T(82, 32, '”', 18, C.ink)), true), scale(60, 54, 14, check(0, -2, C.green, 0.8), cross(0, -2, C.red, 0.8), HL)),
  'manm2.faktagranskning': all(bubble(30, 22, 44, T(30, 28, '50 %', 13, C.ink), true), path('M14 50 L46 50 L46 96 L14 96 Z', C.beige, C.ink, 1.6), T(30, 70, '50 %', 11), ...range(3).map((i) => line(`M18 ${78 + i * 5} L42 ${78 + i * 5}`, C.grey2, 1.4)), circle(84, 60, 22, 'rgba(255,255,255,0.6)', C.ink, 3.4), line('M100 76 L112 92', C.ink, 5), T(84, 66, '=', 18, HL), arrow(52, 40, 64, 52, C.ink, 2), arrow(52, 74, 64, 66, C.ink, 2), check(92, 104, C.green, 1.2)),
  'manm2.myt': all(...range(4).map((i) => all(bust(16 + i * 28, 96, 0.5, [C.green, C.sky, C.yellow, C.lilac][i]!), circle(16 + i * 28, 70, 8, C.white, C.ink, 1.2), check(16 + i * 28, 70, C.green, 0.5))), path('M40 14 L80 14 L80 50 L40 50 Z', C.beige, C.ink, 1.6), line('M60 14 L60 50', C.ink, 1.2), cross(60, 32, HL, 1.6)),
  'manm2.tendens': all(paper(6, 8, 36, 46), arrow(26, 58, 38, 70, C.ink, 2), scale(72, 38, 18, all(rect(-8, -10, 16, 10, HL, 2, C.ink, 1)), '', HL)),
  'manm2.framställa': all(figure({ x: 22, h: 0.6, top: C.green }), arrow(38, 70, 50, 70, C.ink, 2), screen(54, 14, 60, 80), g('translate(84 14) scale(0.68)', figure({ x: 0, h: 1, top: C.green })), star(72, 30, 6, C.yellow), star(98, 26, 6, C.yellow), rect(52, 12, 64, 84, 'none', 4, HL, 2.6)),
  'manm2.vinkla': all(screen(10, 28, 40, 34), figure({ x: 30, h: 0.3, top: C.green }), arrow(52, 46, 64, 46, C.ink, 2), g('rotate(-14 90 46)', screen(68, 28, 44, 36)), g('rotate(-14 90 46)', all(rect(74, 32, 18, 28, 'rgba(228,87,46,0.4)', 1, null))), waIn('b5-vinkla-1', 0, 0, line('M66 96 L114 76', HL, 3)), path('M60 100 A40 40 0 0 1 70 80', 'none', HL, 2.4)),
  'manm2.ensidig': all(scale(60, 24, 18, all(...range(3).map((i) => circle(-8 + i * 8, -4, 4, HL, C.ink, 1)), circle(0, -10, 4, HL, C.ink, 1)), '', HL), greyed(bust(98, 100, 0.5, C.grey)), cross(98, 80, C.grey, 0.8), bust(22, 100, 0.5, HL)),
  'manm2.källkritisk': all(path('M8 30 L30 30 L30 54 L8 54 Z', C.beige, C.ink, 1.4), screen(6, 62, 26, 20), path('M8 92 L30 92 L30 112 L8 112 Z', C.white, C.ink, 1.4), arrow(34, 42, 58, 58, C.ink, 2), arrow(34, 72, 58, 66, C.ink, 2), arrow(34, 100, 58, 74, C.grey, 2), cross(44, 94, C.red, 0.8), bust(84, 64, 1, C.sky, true), circle(84, 24, 14, 'rgba(255,255,255,0.6)', HL, 3), line('M94 34 L102 42', HL, 4), T(84, 30, '?', 14, HL)),
  'manm2.trend': all(rect(10, 14, 100, 92, C.white, 4, C.ink, 1.6), path('M18 94 L34 88 L50 90 L64 70 L78 50 L92 30 L102 22', 'none', HL, 3.4), T(30, 34, '#', 26, HL), ...range(4).map((i) => line(`M18 ${30 + i * 20} L104 ${30 + i * 20}`, C.grey2, 0.8))),
  'manm2.image': all(rect(44, 28, 32, 52, '#f4e7c8', 3, C.ink, 1.6), star(60, 46, 7, HL), ...[[16, 96], [40, 104], [80, 104], [104, 96]].map(([x, y]) => all(bust(x!, y!, 0.42, C.grey2), line(`M${x} ${y! - 10} L60 ${84}`, HL, 1.2, '3 3'))), thought(22, 30, 30, star(22, 30, 5, HL)), thought(98, 30, 30, star(98, 30, 5, HL))),
  'manm2.välgörenhet': all(rect(40, 40, 40, 50, C.tan, 3, C.ink, 1.6), rect(52, 40, 16, 4, C.ink, 1, null), heart(60, 66, 1.4, HL), waIn('b5-valgorenhet-1', 0, -16, circle(60, 26, 7, C.gold, C.ink, 1.2)), bust(16, 98, 0.6, C.green), bust(104, 98, 0.6, C.sky)),
  // Debatt
  'manm2.ledarskribent': all(rect(8, 10, 58, 98, C.white, 2, C.ink, 1.6), rect(12, 14, 50, 10, C.ink, 1, null), rect(12, 28, 18, 76, SOFT, 1, HL, 2.4), circle(21, 38, 6, C.skin, C.ink, 1), ...range(8).map((i) => line(`M14 ${50 + i * 6} L28 ${50 + i * 6}`, HL, 1.4)), ...range(10).map((i) => line(`M34 ${30 + i * 7} L60 ${30 + i * 7}`, C.grey2, 1.4)), bust(92, 56, 1, C.navy), rect(72, 80, 40, 10, '#8a5a3a', 2, C.ink, 1.2), path('M100 74 L110 60', C.dark, '2.4'), arrow(76, 44, 34, 40, HL, 2)),
  'manm2.argumentation': all(rect(36, 8, 48, 22, SOFT, 4, HL, 2.4), T(60, 24, '!', 16, HL), ...[0, 1, 2].map((i) => all(rect(10 + i * 36, 70, 28, 24, C.white, 3, C.ink, 1.4), T(24 + i * 36, 87, String(i + 1), 13), arrow(24 + i * 36, 68, 52 + i * 4, 34, HL, 2))), bust(60, 108, 0.4, C.green)),
  'manm2.ta-debatten': all(rect(0, 96, 120, 24, '#8a5a3a', 0, null), figure({ x: 86, h: 0.75, top: C.sky }), waIn('b5-ta-debatten-1', -24, 0, figure({ x: 46, h: 0.75, top: C.green })), arrow(58, 50, 72, 50, HL, 2.6), greyed(figure({ x: 12, h: 0.5, top: C.grey })), cross(12, 40, C.grey, 0.8)),
  'manm2.saklighet': all(bubble(60, 26, 70, all(T(46, 32, '3 + 4', 12), T(70, 32, '= 7', 12, C.ink)), true), scale(60, 54, 0, T(0, 2, '1', 10), T(0, 2, '1', 10), HL), greyed(T(100, 112, '!!!', 12, C.grey))),
  'manm2.polariserad': all(rect(4, 20, 52, 84, '#d6ecf7', 4, null), rect(64, 20, 52, 84, '#f6d3c6', 4, null), line('M60 10 L60 112', HL, 3.4), ...range(6).map((i) => bust(16 + (i % 3) * 16, 52 + Math.floor(i / 3) * 30, 0.4, C.sky)), ...range(6).map((i) => bust(76 + (i % 3) * 16, 52 + Math.floor(i / 3) * 30, 0.4, C.red)), arrow(48, 14, 22, 14, HL, 2), arrow(72, 14, 98, 14, HL, 2)),
  // Yttrandefrihet och ansvar
  'manm2.åsiktsfrihet': all(...[0, 1, 2].map((i) => all(bust(20 + i * 40, 86, 0.75, [C.green, C.sky, C.yellow][i]!, i === 1), thought(20 + i * 40, 36, 30, [check(20, 36, C.green, 0.7), cross(60, 36, C.red, 0.7), T(100, 42, '?', 12, HL)][i]!)))),
  'manm2.inskränkning': all(rect(10, 30, 100, 60, C.white, 4, C.ink, 1.8), waIn('b5-inskrankning-1', 20, 0, rect(10, 30, 40, 60, SOFT, 4, HL, 2.4)), waIn('b5-inskrankning-2', -20, 0, rect(70, 30, 40, 60, SOFT, 4, HL, 2.4)), bust(60, 58, 0.6, C.green), arrow(48, 104, 56, 104, HL, 2.4), arrow(72, 104, 64, 104, HL, 2.4)),
  'manm2.pressfrihet': all(paper(14, 30, 50, 64), mic(84, 60, 1.6), greyed(lock(100, 100, 0.8, C.grey2)), cross(100, 100, HL, 1.2), path('M18 22 L58 22', HL, '2.4'), path('M66 30 C72 18 80 14 90 16', 'none', HL, 2)),
  'manm2.ensamansvar': all(bust(60, 50, 1.3, HL), ...[[16, 96], [40, 104], [80, 104], [104, 96]].map(([x, y]) => bust(x!, y!, 0.45, C.grey2)), rect(42, 74, 36, 26, C.tan, 2, C.ink, 1.6), T(60, 92, '§', 14), T(98, 24, '1', 22, HL)),
  'manm2.upphovsrätt': all(rect(18, 22, 52, 66, C.white, 3, C.ink, 1.8), path('M24 76 L36 54 L46 66 L54 58 L64 76 Z', C.mint, null), circle(54, 36, 6, C.yellow, null), circle(88, 70, 22, SOFT, HL, 3), T(88, 79, '©', 26, HL), bust(30, 104, 0.4, C.green)),
  'manm2.förtal': all(bust(26, 70, 1, C.dark), bubble(74, 26, 56, all(bust(64, 26, 0.35, C.sky), cross(84, 26, HL, 0.9))), ...range(3).map((i) => bust(66 + i * 18, 96, 0.4, C.grey2)), T(104, 108, '§', 14, HL)),
  'manm2.förtala': all(bust(28, 66, 1, C.dark), waIn('b5-fortala-1', -14, 0, all(bubble(76, 24, 50, cross(76, 24, HL, 0.9)), arrow(46, 50, 64, 40, HL, 2.4))), bust(96, 86, 0.8, C.sky, true)),
  'manm2.kränkande': all(bust(30, 64, 1, C.dark), bubble(72, 24, 52, T(72, 31, '!#@', 13, HL)), bust(92, 84, 0.9, C.sky, true), path('M84 92 Q92 86 100 92', 'none', C.ink, 1.4), path('M100 66 C104 62 108 64 106 70', 'none', '#3b7dd6', 1.6)),
  'manm2.nedsättande': all(figure({ x: 34, top: C.dark, face: 'neutral' }), g('translate(90 0)', figure({ x: 0, h: 0.6, top: C.sky, face: 'neutral' })), arrow(50, 40, 80, 72, HL, 3), bubble(74, 20, 30, line('M64 24 L84 24', HL, 3))),
};
function thought(x: number, y: number, w: number, inner: Svg): Svg { return all(ellipse(x, y, w / 2, 12, C.white, C.ink, 1.4), circle(x - w / 4, y + 18, 3, C.white, C.ink, 1), inner); }
