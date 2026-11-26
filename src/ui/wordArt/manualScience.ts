/**
 * Kvalitetsplanen B5 – det manuella bildspåret, Evolution, Rymden och Kemi/energi/teknik (R06–R07).
 * Naturvetenskapliga ord ritas som egna diagram och små förlopp: generationer i rad, en kedja av nivåer,
 * en strimma av ett spektrum, ett snitt genom ett membran, en bana mot jorden. Varje bild skiljer sig
 * från grannorden i samma modul (t.ex. *gren* mot *stamträd*, *tertiärkonsument* mot *topprovdjur*,
 * *blåförskjutning* mot *rödförskjutning*). Orange visar det ordet betyder, grått det som ordet inte är.
 * Bara siffror, enheter och kemiska tecken; inga ord.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, sparkle, waGrow, waIn, waPulse, waShake, type Svg } from './kit';
import { HL, T, bolt } from './people';
import { P, greyed } from './blindFix';
import { figure } from './figures';
import { SOFT, check, cross } from './manualPhilosophy';

const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const f1 = (n: number) => +n.toFixed(1);
const NIGHT = '#1f2a44';
const RAINBOW = ['#8a4fd6', '#3b6fd6', '#3bb0d6', '#4fbf5a', '#f2d33c', '#ef8a3c', '#d64545'];
const bg = (col: string) => rect(0, 0, 120, 120, col, 0, null);
const stars = (n: number, y0 = 0, y1 = 120) => all(...range(n).map((i) => circle(f1(6 + ((i * 37) % 108)), f1(y0 + ((i * 53) % Math.max(1, y1 - y0))), i % 3 ? 0.9 : 1.4, C.white, null)));
const earth = (x: number, y: number, r: number) => all(circle(x, y, r, '#5a9fd8', C.ink, 1.6), path(`M${f1(x - r * 0.6)} ${f1(y - r * 0.2)} C${f1(x - r * 0.2)} ${f1(y - r * 0.8)} ${f1(x + r * 0.3)} ${f1(y - r * 0.3)} ${f1(x)} ${f1(y + r * 0.2)} C${f1(x - r * 0.3)} ${f1(y + r * 0.5)} ${f1(x - r * 0.7)} ${f1(y + r * 0.2)} ${f1(x - r * 0.6)} ${f1(y - r * 0.2)} Z`, '#6fbf73', null), path(`M${f1(x + r * 0.35)} ${f1(y + r * 0.1)} C${f1(x + r * 0.7)} ${f1(y + r * 0.1)} ${f1(x + r * 0.7)} ${f1(y + r * 0.6)} ${f1(x + r * 0.4)} ${f1(y + r * 0.6)} Z`, '#6fbf73', null));
const sunDisc = (x: number, y: number, r: number) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 3))} ${f1(y + Math.sin(a) * (r + 3))} L${f1(x + Math.cos(a) * (r + 8))} ${f1(y + Math.sin(a) * (r + 8))}`, C.gold, 2); }), circle(x, y, r, C.yellow, C.ink, 1.4));
/** Small side-view bird; `tail` is the radius of a fanned tail behind it (0 = plain). */
const bird = (x: number, y: number, s: number, body: string, tail = 0, tailCol: string = HL) => g(`translate(${x} ${y}) scale(${s})`,
  tail ? all(path(`M-6 0 L${f1(-6 - tail * 0.9)} ${f1(-tail)} A${tail} ${tail} 0 0 0 ${f1(-6 - tail * 1.1)} ${f1(tail * 0.3)} Z`, tailCol, C.ink, 1.2), ...range(3).map((i) => circle(f1(-6 - tail * (0.55 + i * 0.12)), f1(-tail * (0.75 - i * 0.4)), f1(Math.max(1.2, tail * 0.1)), C.navy, null))) : path('M-7 0 L-16 3 L-8 4 Z', body, C.ink, 1.2),
  line('M-2 6 L-3 13 M3 6 L4 13', C.ink, 1.4), ellipse(0, 0, 9, 6.5, body, C.ink, 1.4), circle(8, -6, 4.4, body, C.ink, 1.4), circle(9.4, -7, 0.9, C.ink, null), path('M12 -6 L16 -5 L12 -4 Z', C.yellow, C.ink, 0.8));
const fish = (x: number, y: number, len: number, col: string, spots = false) => all(path(`M${x - len / 2} ${y} L${x - len / 2 - 8} ${y - 6} L${x - len / 2 - 8} ${y + 6} Z`, col, C.ink, 1.2), ellipse(x, y, len / 2, Math.min(7, len / 4), col, C.ink, 1.3), circle(x + len / 2 - 5, y - 1.5, 1.2, C.ink, null),
  spots ? all(...range(4).map((i) => circle(x - len / 3 + i * (len / 6), y + (i % 2 ? 2 : -2), 1.4, '#e8f0c0', null))) : '');
const insect = (x: number, y: number, s = 1, col = '#7a9a3a') => g(`translate(${x} ${y}) scale(${s})`, line('M-3 2 L-6 6 M0 2 L0 7 M3 2 L6 6', C.ink, 1), ellipse(0, 0, 6, 3, col, C.ink, 1), circle(6, -1, 2.2, col, C.ink, 1), path('M-4 -2 L2 -6 L4 -2 Z', '#c9d98a', C.ink, 0.6));
const galaxy = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ellipse(0, 0, 9, 5, '#c7b3e6', null), path('M-8 2 C-4 -6 6 -5 4 0 C2 4 -4 3 -2 0', 'none', C.white, 1.4), circle(0, 0, 2, C.white, null));
const strip = (x: number, y: number, w: number, h: number) => all(...RAINBOW.map((c, i) => rect(f1(x + (i * w) / 7), y, f1(w / 7 + 0.4), h, c, 0, null)), rect(x, y, w, h, 'none', 1, C.ink, 1.4));
const pieSlice = (cx: number, cy: number, r: number, from: number, to: number, fill: string) => {
  const a0 = from * Math.PI * 2 - Math.PI / 2, a1 = to * Math.PI * 2 - Math.PI / 2;
  return path(`M${cx} ${cy} L${f1(cx + r * Math.cos(a0))} ${f1(cy + r * Math.sin(a0))} A${r} ${r} 0 ${to - from > 0.5 ? 1 : 0} 1 ${f1(cx + r * Math.cos(a1))} ${f1(cy + r * Math.sin(a1))} Z`, fill, C.ink, 1.2);
};
const tomato = (x: number, y: number, r: number) => all(circle(x, y, r, C.red, C.ink, 1.6), path(`M${x - r * 0.45} ${y - r * 0.85} L${x} ${y - r * 0.6} L${x + r * 0.45} ${y - r * 0.85} L${x + r * 0.2} ${y - r * 0.55} L${x} ${y - r * 1.05} L${x - r * 0.2} ${y - r * 0.55} Z`, C.green, C.ink, 1));
const log = (x: number, y: number, body: string, end: string, rings: string) => all(path(`M${x} ${y} L${x + 60} ${y} L${x + 60} ${y + 26} L${x} ${y + 26} Z`, body, C.ink, 1.6), ellipse(x, y + 13, 7, 13, body, C.ink, 1.6), ellipse(x + 60, y + 13, 7, 13, end, C.ink, 1.6), ellipse(x + 60, y + 13, 4, 8, 'none', rings, 1.2), ellipse(x + 60, y + 13, 1.6, 3.4, 'none', rings, 1.2));

export const MANUAL_SCIENCE_MOTIFS: Record<string, Svg> = {
  // Återkoppling och stabilitet: ett system som svarar långsamt (snigel + långsam kurva mot ett snabbt steg).
  'mans.trög': all(rect(62, 8, 52, 40, C.white, 4, C.ink, 1.6), line('M68 14 L68 42 L110 42', C.ink, 1.4), line('M68 40 L76 40 L76 16 L108 16', C.grey, 2, '3 3'), line('M68 40 L76 40 C90 40 100 30 108 22', HL, 3),
    line('M4 108 L116 108', C.grey2, 2),
    moving('b5-trog-1', '0%{transform:translate(-28px,0)}100%{transform:translate(0,0)}', { dur: 7 },
      path('M14 106 C14 98 30 96 70 98 C80 98 84 92 86 86 L92 86 C92 96 88 106 80 106 Z', '#d8c3a5', C.ink, 1.6), line('M84 88 L82 74 M89 88 L92 74', C.ink, 1.4), circle(82, 73, 2, C.ink, null), circle(92, 73, 2, C.ink, null),
      circle(48, 80, 20, C.orange, C.ink, 1.8), path('M48 80 m0 -3 a3 3 0 1 1 -3 3 a7 7 0 1 1 7 7 a11 11 0 1 1 -11 -11 a15 15 0 0 1 14 4', 'none', C.ink, 1.4))),

  // Reningsverk: grundämnet fosfor (ruta 15 P och tändstickans huvud); kväve och kalium i grått.
  'mans.fosfor': all(rect(10, 10, 62, 70, '#fde6d6', 6, HL, 3), T(22, 26, '15', 12), T(41, 62, 'P', 40, HL), T(41, 75, '30,97', 9, C.ink, 600),
    line('M86 108 L100 44', '#d9b27c', 5), line('M86 108 L100 44', C.ink, 0.6), ellipse(101, 40, 5, 7, '#c0392b', C.ink, 1.2), waPulse('b5-fosfor-1', path('M101 32 C95 24 100 16 104 10 C108 18 110 26 101 32 Z', C.orange, '#e0a020', 1)),
    greyed(rect(10, 88, 26, 26, C.white, 3, C.grey, 1.4), T(23, 108, 'N', 14, C.grey), T(16, 96, '7', 7, C.grey), rect(42, 88, 26, 26, C.white, 3, C.grey, 1.4), T(55, 108, 'K', 14, C.grey), T(49, 96, '19', 7, C.grey))),

  // Cellmembranet: ämnen glider genom membranet från mycket till lite, utför, utan energi (överkryssad blixt).
  'mans.passiv-transport': all(rect(0, 0, 120, 54, '#fde6d6', 0, null), rect(0, 74, 120, 46, '#eef6fb', 0, null),
    ...range(15).map((i) => circle(f1(8 + i * 7.5), 58, 3, '#f2c14e', C.ink, 0.8)), ...range(15).map((i) => circle(f1(8 + i * 7.5), 70, 3, '#f2c14e', C.ink, 0.8)), ...range(15).map((i) => line(`M${f1(7 + i * 7.5)} 61 L${f1(7 + i * 7.5)} 67 M${f1(9 + i * 7.5)} 61 L${f1(9 + i * 7.5)} 67`, C.grey, 0.8)),
    ...range(14).map((i) => circle(f1(10 + ((i * 29) % 100)), f1(10 + ((i * 17) % 38)), 3.2, HL, C.ink, 0.8)), circle(18, 86, 3.2, HL, C.ink, 0.8), circle(100, 92, 3.2, HL, C.ink, 0.8),
    ...[34, 60, 86].map((x, i) => waIn(`b5-passiv-${i}`, 0, -26, circle(x, 84, 3.2, HL, C.ink, 0.8))), ...[34, 60, 86].map((x) => arrow(x, 40, x, 78, HL, 2.2)),
    rect(30, 94, 40, 22, C.white, 3, C.grey2, 1.2), path('M34 98 L66 112 L34 112 Z', C.grey2, null), circle(40, 98, 3.4, HL, C.ink, 1), arrow(44, 100, 58, 107, HL, 1.6),
    greyed(bolt(96, 106, 0.7)), cross(96, 106, HL, 0.9)),

  // Mutationer: en kopia av en sekvens där en enda bit blev fel (orange ring) – inte strålning eller blixt.
  'mans.kopieringsfel': all(...[0, 1, 2, 3, 4, 5, 6].map((i) => rect(8 + i * 15, 16, 13, 18, [C.red, C.yellow, C.green, C.sky, C.red, C.green, C.yellow][i]!, 2, C.ink, 1.2)), line('M8 38 L111 38', C.ink, 2.4),
    ...[0, 1, 2, 3, 4, 5, 6].map((i) => line(`M${14 + i * 15} 44 L${14 + i * 15} 64`, C.grey, 1.4, '2 3')), ...[0, 1, 2, 3, 4, 5, 6].map((i) => path(`M${10 + i * 15} 62 L${14 + i * 15} 68 L${18 + i * 15} 62 Z`, C.grey, null)),
    ...[0, 1, 2, 3, 4, 5, 6].map((i) => moving(`b5-kopiering-${i}`, '0%,10%{opacity:0}35%,100%{opacity:1}', { dur: 4, delay: i * 0.25 }, rect(8 + i * 15, 76, 13, 18, [C.red, C.yellow, C.green, C.sky, C.sky, C.green, C.yellow][i]!, 2, C.ink, 1.2))), line('M8 98 L111 98', C.ink, 2.4),
    circle(74.5, 85, 15, 'none', HL, 3), check(30, 110, C.green, 0.7), T(74, 116, '≠', 14, HL)),

  // Mutationer / AI-säkerhet: något som skadar – taggiga orange pilar mot en person som mår dåligt, hälsomätaren sjunker.
  'mans.skadlig': all(line('M4 112 L116 112', C.grey2, 2), rect(6, 64, 22, 34, C.dark, 3, C.ink, 1.6), path('M10 64 L10 58 L24 58 L24 64', C.dark, C.ink, 1.4), path('M10 52 C4 44 14 38 18 44 C20 34 32 38 28 46 C34 46 32 56 26 54', '#6b5a7a', C.ink, 1),
    ...[56, 70, 84].map((y, i) => waIn(`b5-skadlig-${i}`, -18, 0, path(`M32 ${y} L38 ${y - 5} L44 ${y + 3} L50 ${y - 5} L56 ${y + 3} L62 ${y - 3}`, 'none', HL, 2.8))), ...[56, 70, 84].map((y) => path(`M62 ${y - 7} L68 ${y - 2} L61 ${y + 2} Z`, HL, null)),
    waShake('b5-skadlig-4', P({ x: 90, h: 0.78, top: C.sky, mood: 'sick' })),
    rect(66, 8, 48, 12, C.white, 3, C.ink, 1.4), rect(68, 10, 10, 8, HL, 2, null), path('M70 14 L74 14', C.white, '1'), arrow(100, 22, 100, 34, HL, 2), path('M58 14 C52 8 46 14 52 20 L58 26 L64 20 C70 14 64 8 58 14 Z', C.red, C.ink, 1)),

  // Genuttryck: genen (orange del av DNA) läses av → budbärare → ett protein veckas ihop.
  'mans.genuttryck': all(line('M6 16 L114 16 M6 32 L114 32', C.ink, 2.2), ...range(14).map((i) => line(`M${10 + i * 7.6} 17 L${10 + i * 7.6} 31`, i >= 5 && i <= 9 ? HL : C.grey, 2.4)), rect(42, 10, 40, 28, 'none', 4, HL, 2.6),
    arrow(62, 42, 62, 52, C.ink, 2), waIn('b5-genuttryck-1', 0, -14, path('M42 60 q5 -6 10 0 t10 0 t10 0 t10 0', 'none', HL, 3)), arrow(62, 68, 62, 78, C.ink, 2),
    waGrow('b5-genuttryck-2', all(...[[48, 92], [56, 86], [64, 88], [72, 94], [70, 102], [60, 106], [50, 102], [58, 96]].map(([x, y], i) => circle(x!, y!, 4.4, [HL, C.yellow, C.mint, HL, C.lilac, C.yellow, C.mint, HL][i]!, C.ink, 1)))),
    rect(2, 2, 116, 116, 'none', 10, C.grey2, 1.4, )),

  // Genteknikens metoder: en tomat som fått en ny gen insatt (orange bit i DNA-stegen); en vanlig tomat i grått.
  'mans.genmodifierad': all(greyed(tomato(22, 92, 14)), tomato(74, 72, 34), rect(56, 60, 36, 28, C.white, 4, C.ink, 1.4), line('M60 66 L88 66 M60 82 L88 82', C.ink, 1.6), ...range(6).map((i) => line(`M${63 + i * 4.6} 67 L${63 + i * 4.6} 81`, i === 3 ? HL : C.grey, i === 3 ? 3.4 : 1.8)),
    waIn('b5-genmod-1', 0, -18, all(rect(72, 10, 10, 14, SOFT, 2, HL, 2), line('M77 12 L77 22', HL, 3))), arrow(77, 26, 77, 56, HL, 2.4), sparkle(100, 40, 4)),

  // Fossil och släktskap: trä som har blivit sten – samma stock först av trä, sedan grå och spräcklig.
  'mans.förstenad': all(log(22, 10, C.brown, '#e0b98a', '#8a5a2b'), ...range(4).map((i) => line(`M${30 + i * 12} 16 L${36 + i * 12} 30`, '#7a4e2a', 1.2)),
    arrow(52, 42, 52, 64, C.ink, 2.6), ...range(3).map((i) => line(`M${4 + i * 6} 50 L${18 + i * 6} 50`, '#c9a27a', 2)),
    log(22, 72, '#a5a9b0', '#d8c7e6', '#8a6bbf'), ...range(14).map((i) => circle(28 + ((i * 23) % 52), 76 + ((i * 11) % 20), 1.3, i % 2 ? C.white : C.dark, null)),
    rect(10, 66, 100, 40, 'none', 6, HL, 2.6), path('M96 110 L104 104 L110 110 Z', '#a5a9b0', C.ink, 1)),

  // Evolutionära träd: en hel gren (orange) med sina arter, resten av trädet grått.
  'mans.gren.2': all(line('M60 112 L60 88 M60 88 L32 62 M32 62 L18 28 M32 62 L46 28', C.grey, 3), circle(18, 22, 5, C.grey2, C.ink, 1), circle(46, 22, 5, C.grey2, C.ink, 1),
    line('M60 88 L90 58 M90 58 L74 28 M90 58 L104 28 M82 43 L88 28', HL, 4.6), circle(74, 22, 5, C.yellow, C.ink, 1), circle(88, 22, 5, C.sky, C.ink, 1), circle(104, 22, 5, C.green, C.ink, 1),
    path('M68 12 L68 8 L110 8 L110 12', 'none', HL, 2.4), path('M60 88 L60 112', 'none', C.grey, 3), rect(62, 2, 52, 84, SOFT, 8, null)),

  // Sexuell selektion: honan väljer hanen med störst stjärt, och över generationer växer stjärten (1 → 2 → 3).
  'mans.sexuell-selektion': all(bird(16, 30, 0.8, C.grey2, 5, C.grey), arrow(30, 30, 40, 30, C.ink, 1.6), bird(54, 30, 0.8, C.grey2, 9, '#f2b08a'), arrow(68, 30, 78, 30, C.ink, 1.6), waGrow('b5-sexsel-1', bird(98, 30, 0.8, C.grey2, 14, HL)),
    T(16, 12, '1', 10, C.grey), T(54, 12, '2', 10, C.grey), T(98, 12, '3', 10, HL),
    line('M4 112 L116 112', C.grey2, 2), bird(22, 100, 1, C.tan), greyed(bird(58, 98, 0.9, C.grey2, 5, C.grey)), cross(58, 76, HL, 0.6), bird(96, 98, 0.9, C.grey2, 14, HL), check(96, 70, C.green, 0.8), path('M30 88 C40 80 70 76 84 80', 'none', HL, 1.6, )),

  // Sexuell selektion: en stor, rak och praktfull gestalt med höjdpil och glans; en liten hopsjunken gestalt i grått.
  'mans.ståtlig': all(line('M4 112 L116 112', C.grey2, 2), rect(10, 4, 66, 108, SOFT, 8, null), path('M24 66 L62 66 L66 112 L20 112 Z', C.purple, C.ink, 1.6), figure({ x: 43, h: 1.05, w: 1.15, shoulders: 1.2, top: C.purple, bottom: C.navy }),
    ...range(3).map((i) => circle(43, 52 + i * 10, 1.8, C.gold, null)), sparkle(16, 20, 4), sparkle(70, 16, 4), arrow(6, 108, 6, 10, HL, 2),
    greyed(g('rotate(8 98 112)', figure({ x: 98, h: 0.55, grey: true, face: 'neutral' })))),

  // Näringsvävar: fyra nivåer uppåt; den tredje konsumenten (gäddan, tre prickar) är orange, topprovdjuret över den grått.
  'mans.tertiärkonsument': all(...[0, 1, 2, 3, 4].map((i) => rect(18, 92 - i * 22, 98, 18, i === 3 ? SOFT : '#eef4f8', 4, i === 3 ? HL : C.grey2, i === 3 ? 2.6 : 1.2)),
    ...range(4).map((i) => path(`M${50 + i * 14} 108 C${46 + i * 14} 100 ${54 + i * 14} 98 ${50 + i * 14} 94`, 'none', C.green, 2.4)),
    ...range(5).map((i) => circle(48 + i * 12, 79 + (i % 2) * 3, 2.2, '#c9b2e0', C.ink, 0.8)), fish(70, 59, 24, C.grey2), fish(70, 37, 52, '#6f9a4a', true), greyed(path('M48 16 C56 6 64 10 70 14 C76 10 84 6 92 16 C84 14 76 16 70 20 C64 16 56 14 48 16 Z', C.brown, C.ink, 1.2)),
    ...[1, 2, 3].map((n) => all(...range(n).map((j) => circle(9, 92 - n * 22 + 4 + j * 5, 1.8, n === 3 ? HL : C.grey, null)))), ...range(4).map((i) => line(`M14 ${88 - i * 22} L14 ${80 - i * 22}`, C.grey, 1.4))),

  // Populationsdynamik: under ett vanligt år några få insekter (grått); vid massförökning en svärm som äter upp fältet.
  'mans.massförökning': all(greyed(rect(4, 30, 34, 50, '#e6efd8', 4, C.grey, 1.2), path('M10 80 L10 64 M18 80 L18 60 M26 80 L26 66 M32 80 L32 62', 'none', C.green, 2), insect(16, 50, 0.9), insect(28, 42, 0.9)), arrow(40, 56, 50, 56, C.ink, 2.2),
    rect(52, 6, 64, 108, SOFT, 6, HL, 2.4), ...range(10).map((i) => line(`M${56 + i * 6} 112 L${56 + i * 6} ${106 - (i % 3) * 2}`, '#9aa86a', 2)),
    waGrow('b5-massforokning-1', all(...range(34).map((i) => insect(f1(60 + ((i * 29) % 52)), f1(14 + ((i * 41) % 86)), 0.75, i % 3 ? '#7a9a3a' : '#a0863a'))))),

  // Mars: ett kargt landskap där förstoringsglaset inte hittar något liv; groddar, djur och mikrober är överkryssade.
  'mans.livlös': all(bg('#e9e4dc'), path('M0 74 C30 68 80 72 120 66 L120 120 L0 120 Z', '#c8bfb2', null), ...[[16, 92], [40, 104], [98, 88], [108, 108], [70, 112]].map(([x, y]) => ellipse(x!, y!, 7, 4, '#a39a8e', C.ink, 1)),
    circle(60, 88, 18, 'rgba(255,255,255,0.35)', C.ink, 2.4), line('M73 101 L88 116', C.dark, 5), T(60, 94, '0', 16, HL),
    ...[[20, 28], [60, 28], [100, 28]].map(([x, y], i) => all(([path(`M${x} ${y! + 10} L${x} ${y! - 2} M${x} ${y! + 2} C${x! - 8} ${y! - 2} ${x! - 8} ${y! - 8} ${x! - 2} ${y! - 6} M${x} ${y} C${x! + 8} ${y! - 4} ${x! + 8} ${y! - 10} ${x! + 2} ${y! - 8}`, 'none', C.green, 2.4), insect(x!, y!, 1.6), all(ellipse(x!, y!, 9, 5, '#a8dcc0', C.ink, 1), circle(x! - 2, y!, 1.6, C.green, null), line(`M${x! + 9} ${y} l4 -3 M${x! + 9} ${y} l4 3`, C.ink, 0.8))][i]!), cross(x!, y!, HL, 1.3)))),

  // Asteroider och kometer: en rak streckad bana som går rakt in i jorden (sikte), med varning – smällen har inte skett än.
  'mans.kollisionskurs': all(bg(NIGHT), stars(22), earth(86, 86, 20), circle(86, 86, 26, 'none', HL, 2), line('M86 56 L86 66 M86 106 L86 116 M56 86 L66 86 M106 86 L116 86', HL, 2),
    line('M24 24 L80 80', HL, 2.6, '5 4'), waIn('b5-kollisionskurs-1', -12, -12, all(circle(24, 24, 9, '#8a8278', C.ink, 1.4), circle(21, 21, 2, '#6a6258', null), circle(27, 27, 1.6, '#6a6258', null))),
    path('M96 8 L112 34 L80 34 Z', C.yellow, C.ink, 1.6), T(96, 31, '!', 16, C.ink)),

  // Sol- och månförmörkelse: sol – jord – måne i rad (jorden i mitten), och jordens runda skugga glider över månen.
  'mans.månförmörkelse': all(bg(NIGHT), stars(16, 44, 112), sunDisc(14, 20, 8), path('M60 13 L108 16 L108 26 L60 29 Z', 'rgba(0,0,0,0.55)', null), earth(60, 21, 8), circle(100, 21, 5, '#b4553a', C.ink, 1), line('M26 21 L50 21', C.yellow, 1.4, '3 3'),
    `<clipPath id="b5-manform-clip"><circle cx="60" cy="78" r="28"/></clipPath>`, circle(60, 78, 28, '#f1ede0', C.ink, 1.6),
    `<g clip-path="url(#b5-manform-clip)">${moving('b5-manform-1', '0%{transform:translate(-70px,0)}70%,100%{transform:translate(0,0)}', { dur: 5 }, circle(36, 78, 40, 'rgba(150,50,30,0.82)', null))}</g>`, circle(60, 78, 28, 'none', HL, 2.6)),

  // Ekliptikan: närbild av punkten där solens bana (ekliptikan) korsar himmelsekvatorn – solen passerar den uppåt.
  'mans.vårpunkt': all(bg(NIGHT), stars(18), line('M4 66 L116 66', '#8cc7e8', 2.4), line('M4 90 L116 42', C.gold, 2.4, '6 4'), path('M90 66 A30 30 0 0 0 87.6 54.3', 'none', C.white, 1.4), T(102, 60, '23,4°', 9, C.white),
    circle(60, 66, 15, 'none', HL, 3), circle(60, 66, 4, HL, C.white, 1.4), waIn('b5-varpunkt-1', -16, 7, sunDisc(34, 77, 6)), arrow(42, 73.6, 52, 69.4, HL, 2), T(60, 96, '0°', 12, HL)),

  // Tidmätning: soltid mot klocktid – två orter i samma tidszon (grå klocka 12:00 för båda), men solen står högst i öst redan 11:40 och i väst först 12:20 (orange).
  'mans.soltid': all(bg('#d6ecf7'), rect(4, 70, 112, 26, '#e6efd8', 0, null), line('M4 66 L4 100 M116 66 L116 100', C.grey, 1.6, '4 3'),
    rect(40, 4, 40, 16, C.grey2, 3, C.grey, 1.2), T(60, 16, '12:00', 11, C.grey), line('M48 20 L30 30 M72 20 L90 30', C.grey, 1, '2 3'), arrow(104, 46, 76, 46, C.grey, 1.6),
    ...[30, 90].map((x) => line(`M${x - 24} 70 Q${x} -10 ${x + 24} 70`, C.gold, 1.4, '3 3')), ...[30, 90].map((x) => line(`M${x} 38 L${x} 76`, HL, 2.4, '4 3')),
    sunDisc(30, 30, 6), waIn('b5-soltid-1', 14, 14, sunDisc(90, 30, 6)), ...[30, 90].map((x) => all(circle(x, 30, 12, 'none', HL, 2.4), path(`M${x - 10} 80 L${x - 3} 74 L${x + 4} 80 Z`, C.red, C.ink, 1), rect(x - 8, 80, 10, 9, C.white, 1, C.ink, 1), path(`M${x + 3} 89 L${x + 3} 78 L${x + 10} 78 L${x + 10} 89 Z`, C.beige, C.ink, 1))),
    T(30, 112, '12:20', 13, HL), T(90, 112, '11:40', 13, HL)),

  // Universums expansion: en osynlig kraft (ljust lila dis, frågetecken) som trycker isär galaxerna allt snabbare; 68 % av universum.
  'mans.mörk-energi': all(bg(NIGHT), stars(18), circle(76, 46, 40, 'rgba(199,179,230,0.18)', null), circle(76, 46, 26, 'rgba(199,179,230,0.18)', null), galaxy(76, 46, 1),
    ...[[44, 18], [110, 16], [112, 76], [48, 72]].map(([x, y], i) => all(arrow(f1(76 + (x! - 76) * 0.3), f1(46 + (y! - 46) * 0.3), f1(76 + (x! - 76) * 0.75), f1(46 + (y! - 46) * 0.75), HL, 2), waIn(`b5-morkenergi-${i}`, f1((76 - x!) * 0.3), f1((46 - y!) * 0.3), galaxy(x!, y!, 0.8)))),
    T(66, 30, '?', 12, C.lilac), T(92, 64, '?', 12, C.lilac),
    pieSlice(26, 92, 18, 0, 0.68, HL), pieSlice(26, 92, 18, 0.68, 0.95, C.grey), pieSlice(26, 92, 18, 0.95, 1, C.grey2), T(64, 106, '68 %', 13, HL)),

  // Rödförskjutning: ljuskällan rör sig mot ögat, vågorna trängs ihop och blir blå; spektrallinjerna flyttas mot den blå änden.
  'mans.blåförskjutning': all(rect(0, 0, 120, 62, NIGHT, 0, null), ellipse(16, 32, 9, 6, C.white, C.ink, 1.4), circle(16, 32, 3.4, '#3b6fd6', null),
    path('M28 32 q2.5 -8 5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0', 'none', '#3b8ef0', 2.6), waIn('b5-blaforskjutning-1', 22, 0, all(sparkle(92, 32, 10, C.yellow), circle(92, 32, 6, C.yellow, C.ink, 1))), arrow(84, 48, 60, 48, HL, 2.6),
    strip(8, 76, 104, 18), ...[40, 62, 84].map((x) => line(`M${x} 70 L${x} 100`, C.grey2, 1, '2 2')), ...[30, 52, 74].map((x) => line(`M${x} 76 L${x} 94`, C.ink, 2.6)), ...[40, 62, 84].map((x) => arrow(x, 106, x - 9, 106, HL, 1.6)), rect(6, 72, 32, 26, 'none', 4, HL, 2.6)),

  // Spektroskopi: stjärnljus genom ett instrument med prisma blir ett spektrum med mörka linjer som jämförs med ett ämnes linjer (H matchar, Na inte).
  'mans.spektroskopi': all(sunDisc(12, 22, 6), line('M20 22 L36 22', C.yellow, 2.4), rect(36, 10, 30, 24, C.dark, 3, C.ink, 1.4), path('M51 15 L58 29 L44 29 Z', 'rgba(200,230,250,0.85)', C.white, 1), line('M66 20 L72 16 M66 22 L72 22 M66 24 L72 28', C.yellow, 1.2),
    strip(72, 12, 42, 20), ...[80, 93, 104].map((x) => line(`M${x} 12 L${x} 32`, C.ink, 2)),
    ...[80, 93, 104].map((x) => line(`M${x} 36 L${x} 50`, HL, 1.4, '2 2')), rect(72, 52, 42, 16, C.black, 1, HL, 2.2), ...[80, 93, 104].map((x, i) => line(`M${x} 53 L${x} 67`, ['#d64545', '#3bb0d6', '#8a4fd6'][i]!, 2.4)), T(56, 65, 'H', 15, HL), check(60, 80, HL, 0.9),
    greyed(rect(72, 84, 42, 16, C.black, 1, C.grey, 1.2), line('M98 85 L98 99 M100 85 L100 99', C.yellow, 2), T(56, 97, 'Na', 13, C.grey)), cross(60, 110, C.grey, 0.7)),
};
