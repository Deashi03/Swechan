/**
 * Kvalitetsplanen B5 – det manuella bildspåret, Kemi. Kemiord ritas som partikelbilder (atomkärna med
 * protoner och neutroner, elektronskal, joner med + och −, molekyler) och labbilder (bägare, pH-skala),
 * med kemisk notation som ledtråd (²H, Cl, +, −, pH 3, mol/l). Orange visar det ordet betyder, grått det
 * som ordet inte är. Bara siffror, kemiska tecken och symboler; inga ord.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, waGrow, waIn, waPulse, waShake, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';
import { SOFT, check, cross } from './manualPhilosophy';

const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const f1 = (n: number) => +n.toFixed(1);
const P = (x: number, y: number, r = 6) => all(circle(x, y, r, C.red, C.ink, 1.1), T(x, y + r * 0.45, '+', r * 1.3, C.white));
const N = (x: number, y: number, r = 6) => circle(x, y, r, C.grey2, C.ink, 1.1);
const E = (x: number, y: number, r = 3.4) => all(circle(x, y, r, C.sky, C.ink, 1), T(x, y + r * 0.5, '−', r * 1.8, C.ink));
const nucleus = (x: number, y: number, p: number, n: number, r = 6) => all(...range(p + n).map((i) => { const a = i * 2.4, d = i === 0 ? 0 : r * 0.9 * Math.sqrt(i); return i % 2 === 0 && i / 2 < p ? P(f1(x + d * Math.cos(a)), f1(y + d * Math.sin(a)), r) : (i % 2 === 1 && (i - 1) / 2 < n) || i / 2 >= p ? N(f1(x + d * Math.cos(a)), f1(y + d * Math.sin(a)), r) : P(f1(x + d * Math.cos(a)), f1(y + d * Math.sin(a)), r); }));
const shell = (x: number, y: number, r: number, n: number, col: string = C.grey2, start = 0) => all(circle(x, y, r, 'none', col, 1.4), ...range(n).map((i) => { const a = start + (i / n) * Math.PI * 2; return E(f1(x + r * Math.cos(a)), f1(y + r * Math.sin(a))); }));
const ion = (x: number, y: number, r: number, plus: boolean, col?: string) => all(circle(x, y, r, col ?? (plus ? '#f6c3b4' : '#c9e2f5'), C.ink, 1.6), T(x, y + r * 0.4, plus ? '+' : '−', r * 1.2, plus ? C.red : '#2f6db5'));
const beaker = (x: number, y: number, w: number, h: number, liquid: string, level = 0.6) => all(path(`M${x} ${y} L${x} ${y + h} L${x + w} ${y + h} L${x + w} ${y}`, 'rgba(230,243,251,0.6)', C.ink, 2), rect(x + 1.5, y + h * (1 - level), w - 3, h * level - 1.5, liquid, 2, null));
const molH2O = (x: number, y: number, s = 1, col: string = C.red) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 L-12 9 M0 0 L12 9', C.ink, 2), circle(-12, 9, 5, C.white, C.ink, 1.2), circle(12, 9, 5, C.white, C.ink, 1.2), circle(0, 0, 8, col, C.ink, 1.2));

export const MANUAL_CHEMISTRY_MOTIFS: Record<string, Svg> = {
  // Atomer och isotoper
  'mank.nukleon': all(circle(60, 60, 46, 'none', C.grey2, 1.4, ), E(106, 60), nucleus(60, 60, 4, 4, 8), circle(60, 60, 24, 'none', HL, 2.6), T(26, 108, 'p + n', 13, HL)),
  'mank.reaktiv': all(beaker(14, 46, 50, 56, '#8fc7e8', 0.6), waShake('b5-reaktiv-1', rect(30, 52, 16, 10, C.grey2, 2, C.ink, 1.2)), ...range(5).map((i) => waGrow(`b5-reaktiv-${i + 2}`, circle(24 + i * 8, 46 - (i % 2) * 8, 3, HL, null))), path('M90 30 L80 52 L90 52 L82 74 L104 46 L94 46 L102 30 Z', C.yellow, HL, 2)),
  'mank.halogen': all(...range(4).map((i) => rect(36, 14 + i * 24, 48, 22, i === 0 ? '#e6f5c9' : i === 1 ? '#d7f0c2' : i === 2 ? '#e8c39c' : '#c9b6dc', 2, HL, 2.4)), ...['F', 'Cl', 'Br', 'I'].map((s, i) => T(60, 31 + i * 24, s, 15, C.ink)), T(18, 64, '17', 14, HL)),
  'mank.deuterium': all(circle(60, 60, 40, 'none', C.grey2, 1.4), E(100, 60), P(56, 60, 9), N(70, 60, 9), circle(63, 60, 20, 'none', HL, 2.4), T(28, 30, '²H', 18, HL)),
  'mank.instabil': all(nucleus(46, 60, 7, 8, 6), waShake('b5-instabil-1', path('M18 32 C14 40 14 50 18 56 M74 32 C78 40 78 50 74 56', 'none', HL, 2.4)), waIn('b5-instabil-2', -20, 6, all(P(94, 40, 6), N(102, 46, 6))), T(98, 108, '!', 16, HL)),
  'mank.fullt-skal': all(circle(60, 60, 10, C.red, C.ink, 1.4), shell(60, 60, 22, 2), circle(60, 60, 40, SOFT, HL, 2.6), ...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return E(f1(60 + 40 * Math.cos(a)), f1(60 + 40 * Math.sin(a))); }), check(104, 14, C.green, 1)),
  // Joner och bindningar
  'mank.laddad': all(rect(96, 6, 18, 108, C.grey2, 2, C.ink, 1.4), path('M60 90 C40 90 30 70 30 52 C30 30 44 18 60 18 C76 18 90 30 90 52 C90 70 80 90 60 90 Z', '#f6c3b4', HL, 3), path('M60 90 L56 98 L64 98 Z', '#f6c3b4', C.ink, 1), line('M60 98 C58 106 64 110 60 118', C.ink, 1.2), ...[[44, 40], [60, 32], [76, 40], [48, 60], [72, 60], [60, 74]].map(([x, y]) => T(x!, y! + 4, '−', 14, '#2f6db5'))),
  'mank.positiv-jon': all(circle(36, 60, 10, C.red, C.ink, 1.4), shell(36, 60, 22, 1), arrow(48, 34, 70, 20, C.ink, 2), E(76, 16), arrow(62, 60, 74, 60, C.ink, 2.4), ion(96, 60, 16, true, '#f6c3b4'), circle(96, 60, 20, 'none', HL, 2.6), T(96, 98, 'Na⁺', 13, HL)),
  'mank.negativ-jon': all(E(16, 20), arrow(22, 26, 40, 40, C.ink, 2), circle(44, 60, 10, '#7fbf5a', C.ink, 1.4), shell(44, 60, 22, 7), arrow(70, 60, 80, 60, C.ink, 2.4), ion(98, 60, 15, false), circle(98, 60, 19, 'none', HL, 2.6), T(98, 98, 'Cl⁻', 13, HL)),
  'mank.gitter': all(...range(25).map((i) => { const x = 20 + (i % 5) * 20, y = 20 + Math.floor(i / 5) * 20; return all(i % 5 < 4 ? line(`M${x} ${y} L${x + 20} ${y}`, HL, 1.6) : '', i < 20 ? line(`M${x} ${y} L${x} ${y + 20}`, HL, 1.6) : '', circle(x, y, (i + Math.floor(i / 5)) % 2 ? 5 : 7.5, (i + Math.floor(i / 5)) % 2 ? '#c9e2f5' : '#f6c3b4', C.ink, 1.1)); })),
  'mank.leda-ström': all(rect(12, 50, 96, 16, C.gold, 3, C.ink, 1.6), ...range(6).map((i) => waIn(`b5-leda-strom-${i}`, -14, 0, E(22 + i * 15, 58, 3))), line('M12 58 L4 58 L4 96 L40 96 M80 96 L116 96 L116 58 L108 58', C.ink, 2), path('M50 96 C50 84 70 84 70 96 Z', C.yellow, C.ink, 1.4), rect(52, 96, 16, 8, C.grey, 1, C.ink, 1), waPulse('b5-leda-strom-7', ...range(5).map((i) => { const a = -Math.PI / 2 + (i - 2) * 0.5; return line(`M${f1(60 + 16 * Math.cos(a))} ${f1(88 + 16 * Math.sin(a))} L${f1(60 + 22 * Math.cos(a))} ${f1(88 + 22 * Math.sin(a))}`, HL, 2); }))),
  'mank.bindningsvinkel': all(molH2O(60, 40, 2.4, C.red), path('M46 60 A18 18 0 0 0 74 60', 'none', HL, 3), T(60, 108, '104,5°', 15, HL)),
  'mank.vinklad': all(molH2O(36, 40, 1.8, C.red), greyed(g('translate(84 92)', line('M-22 0 L22 0', C.grey, 2), circle(-22, 0, 7, C.grey2, C.grey, 1), circle(22, 0, 7, C.grey2, C.grey, 1), circle(0, 0, 9, C.grey2, C.grey, 1))), path('M14 58 L36 40 L58 58', 'none', HL, 3, ), cross(84, 74, C.grey, 0.8)),
  'mank.fettlöslig': all(beaker(14, 30, 92, 72, '#f6e3a3', 0.55), ...range(6).map((i) => circle(30 + i * 12, 78 + (i % 2) * 6, 3, '#e8a23a', null)), T(60, 22, 'A, D, E, K', 13, HL)),
  'mank.intermolekylär-kraft': all(molH2O(30, 50, 1.4, C.red), molH2O(88, 64, 1.4, C.red), line('M42 64 L74 58', HL, 2.4, '4 3'), arrow(56, 61, 46, 63, HL, 2), arrow(62, 60, 72, 58, HL, 2)),
  'mank.van-der-Waals-kraft': all(...[[30, 50], [90, 50]].map(([x, y]) => all(ellipse(x!, y!, 22, 14, '#e8e8e8', C.ink, 1.4), ellipse(x! + 6, y!, 10, 8, 'rgba(59,125,214,0.35)', null))), T(30, 80, 'δ+   δ−', 9), T(90, 80, 'δ+   δ−', 9), line('M52 50 L68 50', HL, 2.4, '2 3'), arrow(56, 50, 54, 50, HL, 2), arrow(64, 50, 66, 50, HL, 2), T(60, 108, 'He · He', 14, HL)),
  'mank.flyktig': all(beaker(30, 50, 40, 50, '#d6ecf7', 0.4), ...range(6).map((i) => waIn(`b5-flyktig-${i}`, 0, 20, circle(38 + (i % 3) * 12, 40 - Math.floor(i / 3) * 14, 3.4, HL, null))), path('M80 40 C84 30 92 30 96 40', 'none', C.grey, 1.6), T(96, 96, '20 °C', 12, HL)),
  // Reaktioner
  'mank.kemisk-förändring': all(rect(8, 40, 30, 34, C.grey, 3, C.ink, 1.6), T(23, 62, 'Fe', 13, C.white), arrow(42, 57, 62, 57, HL, 3.4), rect(66, 40, 46, 34, '#b5532f', 3, C.ink, 1.6), T(89, 62, 'Fe₂O₃', 11, C.white), T(60, 100, '≠', 22, HL)),
  'mank.bildas': all(...[[16, 40, C.red], [30, 58, C.sky]].map(([x, y, c]) => circle(x as number, y as number, 8, c as string, C.ink, 1.2)), arrow(44, 52, 60, 52, C.ink, 2.4), waGrow('b5-bildas-1', all(circle(84, 52, 10, C.red, C.ink, 1.2), circle(98, 52, 10, C.sky, C.ink, 1.2))), circle(91, 52, 22, 'none', HL, 2.4)),
  'mank.oxidation': all(circle(30, 60, 12, C.grey, C.ink, 1.6), T(30, 64, 'Mg', 9, C.white), E(52, 40), waIn('b5-oxidation-1', -12, 10, arrow(42, 50, 62, 32, HL, 2.6)), arrow(60, 66, 76, 66, C.ink, 2.4), circle(98, 66, 14, '#f6c3b4', C.ink, 1.6), T(98, 70, 'Mg²⁺', 9, HL), T(60, 108, '− e⁻', 13, HL)),
  'mank.reaktionshastighet': all(beaker(10, 56, 36, 44, '#8fc7e8', 0.6), ...range(2).map((i) => circle(22 + i * 10, 66, 2, C.white, null)), beaker(70, 56, 36, 44, '#8fc7e8', 0.6), ...range(9).map((i) => waIn(`b5-reaktionshastighet-${i}`, 0, 10, circle(76 + (i % 3) * 10, 52 - Math.floor(i / 3) * 10, 2.6, HL, null))), circle(28, 26, 12, C.white, C.ink, 1.6), line('M28 26 L28 18', C.ink, 1.6), circle(88, 26, 12, C.white, C.ink, 1.6), line('M88 26 L94 30', HL, 2), T(60, 112, 'mol/s', 11, HL)),
  // Syror och baser
  'mank.pH-värde': all(...range(15).map((i) => rect(4 + i * 7.5, 46, 7.5, 24, `hsl(${f1(i * 18)},75%,55%)`, 0, null)), rect(4, 46, 112, 24, 'none', 2, C.ink, 1.6), T(8, 84, '0', 10), T(60, 84, '7', 10), T(112, 84, '14', 10), path('M27 40 L23 32 L31 32 Z', HL, null), T(27, 26, 'pH 3', 13, HL)),
  'mank.försurning': all(path('M8 76 C30 70 90 70 112 76 L112 108 L8 108 Z', '#a8c8a0', C.ink, 1.4), cloud2(30, 22), cloud2(78, 18), ...range(6).map((i) => line(`M${20 + i * 14} 36 l-3 10`, '#9a8a3a', 2.2)), greyed(fishSmall(60, 92)), T(98, 98, 'pH ↓', 12, HL)),
  'mank.ta-ut-varandra': all(rect(10, 40, 30, 30, '#f6c3b4', 4, C.ink, 1.6), T(25, 61, 'H⁺', 13, C.red), T(48, 61, '+', 16), rect(56, 40, 30, 30, '#c9e2f5', 4, C.ink, 1.6), T(71, 61, 'OH⁻', 11, '#2f6db5'), T(94, 62, '=', 16), T(108, 62, '0', 18, HL), path('M25 74 C30 92 66 92 71 74', 'none', HL, 2)),
  'mank.lösning': all(beaker(20, 30, 80, 74, '#cfe6f6', 0.7), ...range(14).map((i) => circle(30 + (i * 29) % 60, 60 + (i * 17) % 40, 2.4, HL, null))),
  'mank.koncentration': all(beaker(10, 40, 40, 60, '#cfe6f6', 0.75), ...range(4).map((i) => circle(20 + (i * 9) % 22, 70 + (i * 11) % 24, 2.4, HL, null)), beaker(70, 40, 40, 60, '#cfe6f6', 0.75), ...range(16).map((i) => circle(78 + (i * 9) % 26, 60 + (i * 7) % 36, 2.4, HL, null)), T(30, 26, 'c', 14, GRc()), T(90, 26, 'c ↑', 14, HL), T(60, 116, 'mol/l', 11, HL)),
  'mank.förtvålning': all(path('M10 40 C10 30 34 30 34 40 L30 70 L14 70 Z', '#f6e3a3', C.ink, 1.4), T(48, 58, '+', 16), beaker(56, 36, 22, 34, '#c9e2f5', 0.7), T(67, 30, 'OH⁻', 9, '#2f6db5'), arrow(82, 54, 92, 54, C.ink, 2.4), rect(94, 44, 22, 22, '#f4d6e6', 5, C.ink, 1.4), ...range(4).map((i) => waGrow(`b5-fortvalning-${i}`, circle(100 + (i % 2) * 10, 80 + Math.floor(i / 2) * 12, 4, 'rgba(255,255,255,0.8)', C.sky, 1.2))), circle(105, 55, 16, 'none', HL, 2.4)),
};
function GRc(): string { return C.grey; }
function cloud2(x: number, y: number): Svg { return path(`M${x - 18} ${y + 8} C${x - 26} ${y + 8} ${x - 26} ${y - 4} ${x - 18} ${y - 4} C${x - 18} ${y - 14} ${x - 4} ${y - 16} ${x} ${y - 8} C${x + 4} ${y - 18} ${x + 20} ${y - 16} ${x + 20} ${y - 4} C${x + 28} ${y - 4} ${x + 28} ${y + 8} ${x + 20} ${y + 8} Z`, C.grey2, C.ink, 1.4); }
function fishSmall(x: number, y: number): Svg { return all(path(`M${x - 10} ${y} C${x - 4} ${y - 7} ${x + 6} ${y - 7} ${x + 10} ${y} C${x + 6} ${y + 7} ${x - 4} ${y + 7} ${x - 10} ${y} Z`, C.grey2, C.grey, 1.2), path(`M${x + 10} ${y} L${x + 17} ${y - 6} L${x + 17} ${y + 6} Z`, C.grey2, C.grey, 1.2)); }
