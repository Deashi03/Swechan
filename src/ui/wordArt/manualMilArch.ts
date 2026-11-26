/**
 * Kvalitetsplanen B5 – det manuella bildspåret, vardag, hälsa, samhälle, militärhistoria och arkeologi
 * (R01–R04). Varje bild är handritad för att skilja sig från grannorden i samma modul: närbilder
 * (bacon som knäcks, smördegens lager), kontrastpar (orange = det ordet betyder, grått/överkryssat = det
 * ordet inte är), kartor och genomskärningar för militärhistoria och jordlager, lappar och tidslinjer
 * för arkeologi och källor. Terrorism ritas återhållsamt: rädda civila och en grå smäll, aldrig vapen
 * eller skadade. Bara siffror, tecken och enheter; inga ord.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, star, waBob, waGrow, waIn, waPulse, waShake, type Svg } from './kit';
import { HL, T, brokenHeart, heart, mini, thought } from './people';
import { P, greyed } from './blindFix';
import { figure } from './figures';
import { SOFT, bust, check, cross, face } from './manualPhilosophy';

const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const f1 = (n: number) => +n.toFixed(1);
const ground = (y = 104, col = '#cfe8b9') => rect(0, y, 120, 120 - y, col, 0, null);
const crown = (x: number, y: number, s = 1, col: string = C.gold) => g(`translate(${x} ${y}) scale(${s})`, path('M-12 6 L-12 -6 L-6 0 L0 -10 L6 0 L12 -6 L12 6 Z', col, C.ink, 1.2));
const house = (x: number, y: number, s = 1, col: string = C.red, wall: string = C.white) => g(`translate(${x} ${y}) scale(${s})`, path('M-16 0 L0 -14 L16 0 Z', col, C.ink, 1.4), rect(-13, 0, 26, 18, wall, 1, C.ink, 1.4), rect(-4, 7, 8, 11, C.brown, 1, null));
const pot = (x: number, y: number, s = 1, col = '#c97b4a') => g(`translate(${x} ${y}) scale(${s})`, path('M-8 -16 L8 -16 L7 -12 C16 -8 16 10 8 14 L-8 14 C-16 10 -16 -8 -7 -12 Z', col, C.ink, 1.6), line('M-11 -2 L11 -2 M-10 4 L10 4', '#8a4a2a', 1.2));
const scroll = (x: number, y: number, w: number, h: number, col = '#f4e7c8') => all(rect(x, y, w, h, col, 2, C.ink, 1.6), ellipse(x, y + h / 2, 4, h / 2 + 2, '#e6d3a8', C.ink, 1.4), ellipse(x + w, y + h / 2, 4, h / 2 + 2, '#e6d3a8', C.ink, 1.4));
const scribble = (x: number, y: number, w: number, n: number, col: string = C.ink, gap = 7) => all(...range(n).map((i) => line(`M${x} ${y + i * gap} c${f1(w * 0.15)} -3 ${f1(w * 0.25)} 3 ${f1(w * 0.4)} 0 s${f1(w * 0.25)} 3 ${f1(w * 0.4)} 0 l${f1(w * 0.2)} 0`, col, 1.2)));
const helmet = (x: number, h = 1, col = '#8a8f96') => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${f1(s)})`, path('M-12 -57 C-12 -74 12 -74 12 -57 L15 -57 L15 -54 L-15 -54 L-15 -57 Z', col, C.ink, 1.6)); };
const soldier = (x: number, h = 1, top = '#5a7a4a', col = '#7c8a5a') => all(figure({ x, h, top, bottom: '#4a5a3a' }), helmet(x, h, col));
const horse = (x: number, y: number, s = 1, col = '#8a5a3a') => g(`translate(${x} ${y}) scale(${s})`,
  line('M-16 -20 L-18 0 M-8 -20 L-10 0 M10 -20 L12 0 M18 -20 L20 0', col, 4), line('M-16 -20 L-18 0 M-8 -20 L-10 0 M10 -20 L12 0 M18 -20 L20 0', C.ink, 0.6),
  path('M-22 -24 C-30 -22 -32 -10 -30 -4', 'none', C.hair, 3),
  ellipse(0, -28, 24, 10, col, C.ink, 1.6), path('M16 -34 L26 -54 L36 -50 L38 -44 L28 -42 L22 -26 Z', col, C.ink, 1.6), path('M24 -54 L22 -36', 'none', C.hair, 2.4), circle(31, -48, 1.2, C.ink, null));
const map = (x: number, y: number, w: number, h: number) => rect(x, y, w, h, '#f1e4c4', 3, C.ink, 1.6);
const mountains = (x: number, y: number, n: number, s = 1) => all(...range(n).map((i) => path(`M${f1(x + i * 14 * s)} ${y} l${f1(7 * s)} ${f1(-12 * s)} l${f1(7 * s)} ${f1(12 * s)} Z`, '#a99a84', C.ink, 1.2)));
const tower = (x: number, y: number, w = 16, h = 40, col = '#c9c1b4') => all(rect(x, y, w, h, col, 0, C.ink, 1.6), ...range(3).map((i) => rect(x + i * (w / 3) + 1, y - 5, w / 3 - 2, 5, col, 0, C.ink, 1.2)));
const flagOn = (x: number, y: number, col: string, col2?: string, h = 30) => all(line(`M${x} ${y} L${x} ${y + h}`, C.ink, 2), rect(x, y, 20, 12, col, 1, C.ink, 1.2), col2 ? rect(x, y + 6, 20, 6, col2, 0, null) : '');
const magnifier = (x: number, y: number, r = 12) => all(line(`M${f1(x + r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r * 1.5)} ${f1(y + r * 1.5)}`, C.brown, 4), circle(x, y, r, 'rgba(214,236,247,0.55)', C.ink, 2));
const gear = (x: number, y: number, r = 12, col: string = HL) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return rect(f1(x + Math.cos(a) * r - 3), f1(y + Math.sin(a) * r - 3), 6, 6, col, 1, C.ink, 1); }), circle(x, y, r, col, C.ink, 1.6), circle(x, y, r * 0.4, C.white, C.ink, 1.2));
const axeHead = (x: number, y: number, s = 1, col = '#7f8a6a') => g(`translate(${x} ${y}) scale(${s})`, path('M-10 -4 L6 -6 C12 -10 16 -6 16 0 C16 6 12 10 6 6 L-10 4 Z', col, C.ink, 1.4), circle(-5, 0, 2, '#4a4a40', null));
const sword = (x: number, y: number, s = 1, blade = '#b9c0c6') => g(`translate(${x} ${y}) scale(${s})`, path('M-30 -3 L22 -3 L30 0 L22 3 L-30 3 Z', blade, C.ink, 1.4), rect(-34, -9, 4, 18, C.brown, 1, C.ink, 1.2), rect(-46, -2.5, 12, 5, C.brown, 1, C.ink, 1.2));
const laurel = (x: number, y: number, r: number) => all(...[-1, 1].map((d) => all(path(`M${x} ${y + r} C${x + d * r * 1.3} ${y + r * 0.6} ${x + d * r * 1.3} ${y - r * 0.8} ${x + d * r * 0.4} ${y - r}`, 'none', C.green, 2.4), ...range(5).map((i) => { const a = Math.PI / 2 + d * (0.3 + i * 0.5); return ellipse(f1(x + Math.cos(a) * r * 1.0 * d * d), f1(y + Math.sin(a) * r), 5, 2.4, C.green, C.ink, 0.8); }))));

export const MANUAL_MILARCH_MOTIFS: Record<string, Svg> = {
  // Krispigt och knaprigt – knaprig: ljudet när man tuggar. Närbild av en mun som biter i knäckebröd med stora ljudtaggar; en mjuk grå bulle är tyst.
  'mana.knaprig': all(
    path('M6 56 C24 26 72 26 90 56 C72 88 24 88 6 56 Z', '#d65a5a', C.ink, 2), ellipse(48, 57, 34, 17, '#5a2a2a', null),
    ...range(6).map((i) => rect(22 + i * 9, 41, 8, 9, C.white, 2, C.ink, 1)), ...range(6).map((i) => rect(22 + i * 9, 65, 8, 9, C.white, 2, C.ink, 1)),
    g('rotate(-6 80 57)', rect(56, 50, 58, 15, '#d9b071', 2, C.ink, 1.6), ...range(8).map((i) => circle(66 + (i % 4) * 12, 54 + Math.floor(i / 4) * 7, 1.4, '#a8783a', null)), path('M56 50 L60 54 L55 57 L60 61 L56 65', 'none', C.ink, 1.4)),
    ...[[40, 92], [52, 98], [62, 90]].map(([x, y]) => path(`M${x} ${y} l5 -2 l1 5 Z`, '#d9b071', C.ink, 0.8)),
    waShake('b5a-knaprig-1', ...[[48, 10, 0], [20, 18, -40], [78, 16, 40]].map(([x, y, r]) => g(`rotate(${r} ${x} ${y! + 8})`, path(`M${x! - 10} ${y! + 10} L${x! - 6} ${y} L${x! - 1} ${y! + 8} L${x! + 3} ${y! - 2} L${x! + 7} ${y! + 8} L${x! + 11} ${y! + 2}`, 'none', HL, 3)))),
    greyed(ellipse(100, 104, 14, 9, '#e6c89a', C.ink, 1.4), path('M88 102 C94 92 106 92 112 102', 'none', '#c9a06a', 1.4)), cross(100, 88, HL, 0.7)),
  // Frasighet – egenskapen: genomskärning av tunna, luftiga smördegslager under förstoringsglas, flagor som faller.
  'mana.frasighet': all(
    rect(14, 52, 70, 46, '#f2d49a', 4, C.ink, 1.8), ...range(9).map((i) => line(`M16 ${56 + i * 4.6} C30 ${54 + i * 4.6} 50 ${58 + i * 4.6} 82 ${56 + i * 4.6}`, '#c98a3a', 1.4)),
    path('M14 52 C30 46 60 46 84 52', 'none', '#b8702e', 3),
    waIn('b5a-frasighet-1', 0, -14, ...[[24, 106], [44, 110], [64, 104], [34, 114]].map(([x, y]) => path(`M${x} ${y} l6 -2 l2 3 l-6 2 Z`, '#e3b46a', C.ink, 0.8))),
    line('M92 52 L100 44', C.brown, 4), circle(84, 36, 20, '#fbf3df', C.ink, 2.2), ...range(7).map((i) => line(`M68 ${26 + i * 3.2} C78 ${24 + i * 3.2} 90 ${28 + i * 3.2} 100 ${26 + i * 3.2}`, '#c98a3a', 1)), circle(84, 36, 20, 'none', HL, 2.6)),
  // Veckodagar – veckovis: samma veckodag markerad vecka efter vecka, +7 mellan varje.
  'mana.veckovis': all(
    rect(10, 12, 84, 96, C.white, 4, C.ink, 1.8), rect(10, 12, 84, 14, C.red, 4, C.ink, 1.8),
    ...range(4).flatMap((r) => range(7).map((c) => rect(14 + c * 11.2, 32 + r * 19, 9, 13, c === 2 ? SOFT : '#eef0f2', 2, C.grey2, 0.8))),
    ...range(4).map((r) => circle(14 + 2 * 11.2 + 4.5, 38.5 + r * 19, 5, HL, C.ink, 1.2)),
    ...range(3).map((r) => all(path(`M${f1(14 + 2 * 11.2 - 2)} ${f1(40 + r * 19)} C${f1(14 + 2 * 11.2 - 10)} ${f1(46 + r * 19)} ${f1(14 + 2 * 11.2 - 10)} ${f1(50 + r * 19)} ${f1(14 + 2 * 11.2 - 2)} ${f1(56 + r * 19)}`, 'none', HL, 1.8), T(8, 52 + r * 19, '+7', 7, HL))),
    path('M104 40 C116 50 116 80 104 92', 'none', HL, 3), path('M100 88 L104 94 L109 88', 'none', HL, 3)),
  // Före och efter – så fort: lampan slår om till grönt och löparen springer i samma ögonblick (0 s).
  'mana.så-fort': all(
    ground(104, '#e7e2d8'), line('M0 104 L120 104', C.grey2, 2),
    rect(10, 18, 18, 50, C.dark, 3, C.ink, 1.6), line('M19 68 L19 104', C.ink, 3), circle(19, 28, 6, '#7a4a4a', null), circle(19, 43, 6, '#7a6a3a', null),
    waPulse('b5a-sa-fort-1', circle(19, 58, 6.5, '#4fd67a', C.ink, 1.2)), arrow(32, 50, 56, 50, HL, 2.6), T(44, 42, '0 s', 12, HL),
    waIn('b5a-sa-fort-2', -22, 0, g('rotate(14 84 104)', P({ x: 84, h: 0.8, top: C.orange, mood: 'laugh' })), line('M60 70 L68 70 M58 80 L68 80 M62 90 L70 90', C.grey, 2))),
  // Leveransalternativ – leverans: själva leveransen som har kommit – paketet vid dörren, kvittens med bock och spårningen klar.
  'mana.leverans': all(
    rect(10, 20, 44, 88, '#8a5a3a', 2, C.ink, 1.8), circle(46, 66, 2.6, C.gold, C.ink, 1), rect(4, 106, 58, 6, '#c9b48a', 2, C.ink, 1),
    waIn('b5a-leverans-1', 0, -14, rect(26, 84, 26, 22, C.tan, 1, C.ink, 1.6), line('M26 91 L52 91 M39 84 L39 106', C.brown, 1.4)),
    rect(68, 40, 44, 56, C.white, 2, C.ink, 1.6), ...range(3).map((i) => rect(74, 48 + i * 8, 32, 3, C.grey2, 1, null)), line('M74 80 c4 -6 8 6 12 0 s8 -6 12 0', C.navy, 1.6),
    waPulse('b5a-leverans-2', circle(102, 86, 9, C.green, C.ink, 1.2), check(102, 86, C.white, 0.6)),
    ...range(4).map((i) => circle(72 + i * 12, 20, 4, HL, C.ink, 1)), line('M76 20 L80 20 M88 20 L92 20 M100 20 L104 20', HL, 2)),
  // Kundtjänst – vänligen: en artig uppmaning – kyparen bugar och ber med öppen hand gästen att sätta sig.
  'mana.vänligen': all(
    ground(108, '#ece6da'),
    P({ x: 24, h: 0.82, top: C.purple, hairStyle: 'long', mood: 'smile' }),
    rect(50, 76, 26, 4, C.brown, 1, C.ink, 1.2), line('M53 80 L53 108 M73 80 L73 108 M73 76 L73 54', C.brown, 3),
    g('rotate(12 96 112)', P({ x: 96, h: 0.9, top: C.white, bottom: C.black, mood: 'smile' }), path('M86 52 L96 76 L106 52', 'none', C.black, 3)),
    path('M66 66 L80 64 C84 64 84 70 80 70 L66 72 Z', C.skin, C.ink, 1.2), line('M80 66 L88 62 M80 68 L88 66 M80 70 L87 70', C.ink, 0.8),
    path('M40 20 C44 10 56 10 60 20', 'none', HL, 2), path('M44 22 L56 22 C60 22 60 30 50 32 C40 30 40 22 44 22 Z', SOFT, HL, 1.6), path('M46 26 Q50 30 54 26', 'none', HL, 1.6)),
  // Fråga efter rätt linje – varifrån: pilen kommer FRÅN ett frågetecken (ursprunget) TILL personen.
  'mana.varifrån': all(
    ground(104, '#e7e2d8'), figure({ x: 94, h: 0.82, top: C.green }),
    circle(26, 34, 18, SOFT, HL, 2.6, ), T(26, 43, '?', 26, HL),
    waIn('b5a-varifran-1', -30, -20, path('M40 46 C56 70 66 76 80 76', 'none', HL, 3), path('M74 70 L82 76 L74 82', 'none', HL, 3)),
    line('M8 34 L2 34 M26 12 L26 6 M8 18 L4 14', HL, 2), greyed(arrow(100, 50, 112, 30, C.grey, 2))),
  // Avstånd – en bit: kort sträcka till huset (orange), inte den långa vägen till berget (grå).
  'mana.en-bit': all(
    ground(100), line('M0 100 L120 100', C.grey2, 2),
    figure({ x: 16, h: 0.6, top: C.orange }), house(56, 82, 0.9),
    greyed(mountains(88, 100, 2, 1.2), line('M14 22 L108 22 M14 18 L14 26 M108 18 L108 26', C.grey, 2), T(80, 16, '10 km', 9, C.grey)), cross(96, 20, HL, 0.7),
    line('M14 46 L56 46 M14 41 L14 51 M56 41 L56 51', HL, 3), T(35, 40, '300 m', 10, HL)),
  // Motion – vardagsrörelse: en person promenerar till jobbet med stegräknare och pulserande hjärta; en grå person sitter i bilen.
  'mana.motion': all(
    rect(0, 0, 120, 120, '#eef6fb', 0, null), ground(104, '#d8ecc8'), rect(0, 104, 120, 6, '#c9c1b4', 0, null),
    path('M86 104 L86 30 L116 30 L116 104 Z', '#c9ced4', C.ink, 1.4), ...range(4).map((i) => rect(92 + (i % 2) * 12, 38 + Math.floor(i / 2) * 18, 8, 10, '#bfe3f5', 0, C.ink, 0.8)), rect(96, 86, 10, 18, C.brown, 1, null),
    waIn('b5a-motion-1', -16, 0, P({ x: 50, h: 0.8, top: C.orange, mood: 'smile' }), rect(60, 70, 8, 6, C.dark, 2, C.ink, 0.8)),
    rect(4, 10, 34, 22, C.dark, 4, C.ink, 1.4), T(21, 25, '8 000', 9, '#7fe0a0'), waPulse('b5a-motion-h', heart(48, 20, 0.8, C.red)),
    greyed(rect(4, 84, 30, 14, C.grey, 4, C.ink, 1.2), path('M8 84 L12 76 L28 76 L32 84 Z', C.grey2, C.ink, 1), circle(12, 98, 4, C.dark, null), circle(28, 98, 4, C.dark, null), bust(19, 76, 0.2, C.grey, false, true)), cross(19, 68, HL, 0.8)),
  // Känslors styrkegrader – extremt: termometern spricker – kvicksilvret skjuter ut ovanför toppen, långt bortom skalan.
  'mana.extremt': all(
    rect(48, 30, 24, 70, C.white, 12, C.ink, 2), circle(60, 100, 14, C.red, C.ink, 2), rect(56, 34, 8, 66, C.red, 4, null),
    ...range(5).map((i) => line(`M72 ${44 + i * 11} L80 ${44 + i * 11}`, C.ink, 1.6)),
    greyed(rect(24, 58, 8, 42, C.grey, 3, null), circle(28, 100, 7, C.grey, C.ink, 1), rect(22, 40, 12, 60, 'none', 6, C.ink, 1.4)),
    path('M52 34 L56 28 L60 34 L64 26 L68 34', 'none', C.ink, 1.6),
    waShake('b5a-extremt-1', ...[[60, 14, 6], [44, 18, 4], [76, 16, 4], [52, 6, 3], [70, 4, 3]].map(([x, y, r]) => circle(x!, y!, r!, C.red, C.ink, 1)), line('M40 30 L32 24 M80 30 L88 24 M60 22 L60 20', HL, 2.4)),
    line('M86 40 l6 -4 M88 50 l8 0 M34 52 l-6 0', HL, 2)),
  // Avund och svartsjuka – otrogen: mannen håller en annan i handen bakom partnerns rygg, brustet hjärta.
  'mana.otrogen': all(
    P({ x: 24, h: 0.9, top: C.purple, hairStyle: 'long', mood: 'frown' }), circle(8, 72, 2.4, 'none', C.gold, 1.6),
    P({ x: 62, h: 0.92, top: C.green, mood: 'blush' }),
    P({ x: 98, h: 0.88, top: C.pink, hairStyle: 'long', mood: 'love' }),
    circle(80, 72, 4, C.skin, C.ink, 1.2), heart(80, 54, 0.6, C.pink),
    brokenHeart(24, 18, 1.2)),
  // Umgås – ha det trevligt: vänner som skrattar på en filt i solen, guppar i takt.
  'mana.ha-det-trevligt': all(
    rect(0, 0, 120, 120, '#e3f2fa', 0, null), ground(96),
    ellipse(60, 108, 54, 9, '#f6c9d4', C.ink, 1.2), ...range(5).map((i) => line(`M${20 + i * 20} 101 L${16 + i * 20} 116`, C.white, 2)),
    waBob('b5a-trevligt-1', 3, P({ x: 28, h: 0.75, top: C.orange, mood: 'laugh' })),
    moving('b5a-trevligt-2', '0%,100%{transform:translate(0,0)}50%{transform:translate(0,-3px)}', { dur: 2.2, delay: 0.7 }, P({ x: 60, h: 0.78, top: C.green, hairStyle: 'long', mood: 'laugh' })),
    waBob('b5a-trevligt-3', 2, P({ x: 92, h: 0.75, top: C.purple, mood: 'laugh' })),
    circle(104, 18, 9, C.yellow, C.ink, 1.4), path('M40 22 L40 10 L46 8 L46 20', 'none', C.navy, 2), ellipse(38, 22, 3, 2, C.navy, null), ellipse(44, 20, 3, 2, C.navy, null), path('M74 20 L74 10', 'none', C.navy, 2), ellipse(72, 20, 3, 2, C.navy, null)),
  // Omtanke – ömsint: en vuxen som varsamt vaggar en bebis, mjukt sken och hjärtan.
  'mana.ömsint': all(
    circle(60, 62, 46, SOFT, null),
    P({ x: 60, h: 1, top: C.orange, hairStyle: 'long', mood: 'calm' }),
    path('M40 74 C46 66 74 66 80 74 C76 86 44 86 40 74 Z', C.white, C.ink, 1.6), circle(70, 70, 6, C.skin, C.ink, 1.4), path('M65 68 C66 63 74 63 75 68', 'none', C.hair, 1.6),
    path('M38 72 C46 84 70 86 82 72', 'none', C.skin, 5), path('M38 72 C46 84 70 86 82 72', 'none', C.ink, 0.6),
    waBob('b5a-omsint-1', 4, heart(22, 30, 0.8, C.pink), heart(98, 24, 0.7, C.pink), heart(104, 46, 0.5, C.pink))),
  // Minnesförändringar – demenssjuk: äldre människa med käpp vars minne är ett pussel där bitar fattas.
  'mana.demenssjuk': all(
    ground(108, '#ece6da'),
    figure({ x: 34, h: 0.82, top: C.lilac, hair: '#e6e6e6', face: 'neutral' }), line('M50 76 L54 108', C.brown, 3), path('M50 76 C50 70 56 70 56 74', 'none', C.brown, 3),
    thought(84, 36, 56, all(...range(3).flatMap((r) => range(3).map((c) => (r * 3 + c) % 4 === 1 ? rect(68 + c * 11, 25 + r * 8, 10, 7, 'none', 1, C.grey, 0.8, ) : rect(68 + c * 11, 25 + r * 8, 10, 7, C.sky, 1, C.ink, 0.8))))),
    waIn('b5a-demens-1', -10, 6, rect(106, 54, 9, 7, C.sky, 1, C.ink, 0.8), rect(98, 66, 9, 7, C.sky, 1, C.ink, 0.8)), T(104, 92, '?', 16, HL)),
  // Beskriva en stadsdel – trivsam: en bostadsgård där många hushåll trivs, och en kalender full av glada dagar. Ingen text.
  'mana.trivsam': all(
    rect(0, 0, 120, 120, '#eaf5fb', 0, null),
    rect(4, 18, 76, 62, '#f6e3b4', 1, C.ink, 1.6), ...range(2).flatMap((r) => range(4).map((c) => all(rect(9 + c * 18, 26 + r * 26, 12, 12, '#bfe3f5', 1, C.ink, 1), rect(7 + c * 18, 38 + r * 26, 16, 3, C.brown, 0, null)))),
    ...[[15, 34], [51, 34], [33, 60], [69, 60]].map(([x, y]) => face(x!, y!, 'glad', C.yellow)),
    rect(0, 80, 120, 40, '#d8ecc8', 0, null), line('M94 104 L94 74', C.brown, 4), circle(94, 64, 14, '#5fae6e', C.ink, 1.4),
    rect(14, 96, 30, 4, C.brown, 1, C.ink, 1), mini(22, 92, C.green), mini(36, 92, C.purple, true),
    P({ x: 64, h: 0.4, top: C.orange, mood: 'laugh' }), circle(76, 106, 4, C.red, C.ink, 1), P({ x: 108, h: 0.36, top: C.sky, mood: 'laugh' }),
    rect(84, 4, 32, 30, C.white, 2, C.ink, 1.4), rect(84, 4, 32, 7, C.red, 2, C.ink, 1.2), ...range(6).map((i) => all(circle(90 + (i % 3) * 10, 17 + Math.floor(i / 3) * 10, 3.6, C.yellow, C.ink, 0.8), path(`M${88.4 + (i % 3) * 10} ${17.8 + Math.floor(i / 3) * 10} q1.6 1.6 3.2 0`, 'none', C.ink, 0.8)))),
  // Medborgarservice – navet: kommunhuset i mitten med telefon, skärm, disk och post runt om till invånarna.
  'mana.medborgarservice': all(
    ...[[22, 22], [98, 22], [22, 92], [98, 92]].map(([x, y]) => line(`M60 58 L${x} ${y}`, HL, 2.4)),
    path('M38 50 L60 36 L82 50 Z', C.white, C.ink, 1.6), rect(40, 50, 40, 26, C.white, 1, C.ink, 1.6), ...range(4).map((i) => rect(44 + i * 9, 54, 4, 18, '#e6d3b3', 0, C.ink, 0.8)), flagOn(60, 22, C.sky, C.yellow, 14),
    ...[[22, 22], [98, 22], [22, 92], [98, 92]].map(([x, y]) => circle(x!, y!, 15, C.white, HL, 2.4)),
    rect(16, 13, 12, 18, C.dark, 2, C.ink, 1), rect(18, 16, 8, 11, C.sky, 1, null),
    rect(88, 15, 20, 13, C.dark, 2, C.ink, 1), rect(90, 17, 16, 9, C.sky, 1, null), line('M98 28 L98 31 M93 31 L103 31', C.ink, 1.4),
    rect(12, 92, 20, 6, C.tan, 1, C.ink, 1), bust(22, 84, 0.3, C.navy),
    rect(89, 86, 18, 12, C.white, 1, C.ink, 1.2), path('M89 86 L98 93 L107 86', 'none', C.ink, 1),
    mini(48, 104, C.green), mini(60, 104, C.orange, true), mini(72, 104, C.purple)),
  // Folkbokföring – vara skriven: personens rad i registret är kopplad till husnummer 12.
  'mana.vara-skriven': all(
    ground(104, '#e7e2d8'), house(30, 76, 1.4, C.red),
    rect(10, 56, 16, 10, C.white, 1, HL, 2), T(18, 64, '12', 8, HL),
    rect(64, 20, 48, 70, C.white, 2, C.ink, 1.6), bust(76, 36, 0.4, C.green), rect(86, 32, 22, 4, C.grey2, 1, null), rect(86, 40, 16, 4, C.grey2, 1, null),
    rect(70, 56, 36, 12, SOFT, 2, HL, 1.6), T(88, 65, '12', 9, HL), ...range(2).map((i) => rect(70, 74 + i * 7, 36, 3, C.grey2, 1, null)),
    circle(100, 82, 6, 'none', C.red, 1.6),
    waPulse('b5a-skriven-1', line('M26 61 C40 40 54 62 70 62', HL, 2.4, '3 3'))),
  // Inflyttning och utflyttning – utflyttning: människor lämnar orten med väskor, pilarna pekar ut, −3.
  'mana.utflyttning.2': all(
    path('M14 24 C34 8 64 12 72 30 C80 48 76 82 60 96 C42 108 14 98 10 78 C6 60 2 40 14 24 Z', '#e3f1e6', C.ink, 1.8),
    house(30, 50, 0.6), house(48, 72, 0.6, C.yellow), greyed(house(28, 82, 0.5, C.grey2)),
    waIn('b5a-utflytt-1', -22, 0, mini(90, 40, C.orange), rect(98, 44, 7, 7, C.red, 1, C.ink, 1), mini(96, 76, C.green, true), rect(104, 80, 7, 7, C.navy, 1, C.ink, 1)),
    arrow(62, 40, 112, 26, HL, 2.4), arrow(66, 72, 114, 96, HL, 2.4),
    T(100, 14, '−3', 14, HL)),
  // Invandring – ursprungsland: landet med den påhittade flaggan där personen kommer ifrån; samma flagga i passet.
  'mana.ursprungsland.2': all(
    path('M8 30 C20 16 44 20 48 34 C52 50 40 66 24 64 C10 62 2 46 8 30 Z', SOFT, HL, 2.4), flagOn(20, 24, C.orange, C.white, 22), path('M32 46 C32 40 40 40 40 46 C40 50 36 54 36 56 C36 54 32 50 32 46 Z', HL, C.ink, 1), circle(36, 46, 1.6, C.white, null),
    path('M66 60 C80 48 108 52 112 70 C116 90 98 106 80 102 C64 98 56 76 66 60 Z', '#e3f1e6', C.ink, 1.6),
    line('M44 52 C56 70 66 70 76 72', HL, 2.4, '4 3'),
    figure({ x: 88, h: 0.5, top: C.green }),
    rect(98, 70, 12, 16, C.navy, 1, C.ink, 1.2), rect(100, 73, 8, 5, C.orange, 0, null), rect(100, 78, 8, 3, C.white, 0, null)),
  // Kavalleri – beriden: en hel patrull där alla sitter till häst (orange märke på gruppen), mot en grå grupp till fots.
  'mana.beriden': all(
    ground(110, '#e8dcc0'),
    greyed(g('translate(0 -66)', ...[70, 84, 98].map((x) => figure({ x, h: 0.4, grey: true })))), cross(84, 28, HL, 1),
    rect(2, 54, 114, 58, SOFT, 8, HL, 2.4), star(12, 64, 6, HL),
    ...[[30, 110], [62, 104], [94, 110]].map(([x, y]) => all(horse(x!, y!, 0.62), line(`M${x! - 2} ${y! - 18} L${x! - 6} ${y! - 8}`, C.navy, 3.4), path(`M${x! - 8} ${y! - 20} L${x! + 4} ${y! - 20} L${x! + 2} ${y! - 34} L${x! - 6} ${y! - 34} Z`, C.navy, C.ink, 1.2), circle(x! - 2, y! - 39, 5, C.skin, C.ink, 1.2), path(`M${x! - 8} ${y! - 41} C${x! - 8} ${y! - 48} ${x! + 4} ${y! - 48} ${x! + 4} ${y! - 41} Z`, C.dark, C.ink, 1)))),
  // Befäl och formationer – befäl: ledningskedjan, en högst upp med stjärna, order nedåt genom leden.
  'mana.befäl': all(
    line('M60 34 L32 58 M60 34 L88 58 M32 58 L18 90 M32 58 L46 90 M88 58 L74 90 M88 58 L102 90', HL, 2.4),
    waIn('b5a-befal-1', 0, -10, path('M57 44 L60 50 L63 44', 'none', HL, 2.4)),
    circle(60, 20, 16, SOFT, HL, 2.4), bust(60, 16, 0.5, '#5a7a4a'), star(60, 30, 4, C.gold),
    ...[32, 88].map((x) => bust(x, 56, 0.4, '#7c8a5a')),
    ...[18, 46, 74, 102].map((x) => bust(x, 90, 0.36, C.grey2)),
    line('M10 112 L110 112', C.grey2, 2)),
  // Taktik – stridens drag på en griffeltavla: kryss och ringar, tångrörelse runt fienden.
  'mana.taktik': all(
    rect(6, 12, 108, 82, '#2f5a43', 4, C.brown, 4),
    ...[[70, 46], [80, 46], [70, 58], [80, 58]].map(([x, y]) => circle(x!, y!, 4, 'none', C.white, 1.8)),
    ...[[24, 30], [24, 52], [24, 74], [36, 52]].map(([x, y]) => line(`M${x! - 4} ${y! - 4} L${x! + 4} ${y! + 4} M${x! + 4} ${y! - 4} L${x! - 4} ${y! + 4}`, C.white, 1.8)),
    path('M30 28 C56 14 96 18 96 44', 'none', HL, 2.6), path('M90 40 L96 48 L101 40', 'none', HL, 2.6),
    path('M30 76 C56 92 96 88 96 64', 'none', HL, 2.6), path('M90 68 L96 60 L101 68', 'none', HL, 2.6),
    line('M42 52 L60 52', C.yellow, 2, '3 3'),
    rect(40, 96, 16, 4, C.white, 1, C.ink, 1), line('M30 100 L22 116 M90 100 L98 116', C.brown, 3)),
  // Fästningens försvar – försvarsverk: hela försvarssystemet i genomskärning, vallgrav, pålar, vall, mur och torn.
  'mana.försvarsverk': all(
    rect(0, 0, 120, 120, '#e8f3f8', 0, null), ground(100, '#c9b48a'),
    path('M14 100 C18 112 34 112 38 100 Z', '#6fb3dd', C.ink, 1.2),
    ...range(4).map((i) => line(`M${41 + i * 3} 100 L${45 + i * 3} 88`, C.brown, 2)),
    path('M52 100 C56 82 66 82 70 100 Z', '#a88a5a', C.ink, 1.4),
    rect(72, 64, 22, 36, '#c9c1b4', 0, C.ink, 1.6), ...range(3).map((i) => rect(73 + i * 7.3, 59, 5, 5, '#c9c1b4', 0, C.ink, 1)), tower(94, 40, 18, 60),
    path('M14 34 L14 28 L112 28 L112 34', 'none', HL, 3),
    ...[[30, 50], [44, 66]].map(([x, y]) => all(arrow(x! - 24, y! - 6, x! + 10, y!, C.grey, 1.6))), line('M72 62 l-6 -8 M72 76 l-6 4', C.grey, 1.4)),
  // Fästningens försvar – hålla stånd: en liten styrka står kvar medan anfall efter anfall kommer, dag och natt om och om igen.
  'mana.hålla-stånd': all(
    ground(100, '#d8c9a8'), path('M60 100 C70 84 110 84 120 100 Z', '#c9b48a', null),
    ...[74, 90, 106].map((x) => all(figure({ x, h: 0.5, top: '#5a7a4a', bottom: '#4a5a3a' }), helmet(x, 0.5), g(`translate(${x - 9} 86) scale(0.6)`, path('M0 -16 L14 -11 C14 4 8 12 0 17 C-8 12 -14 4 -14 -11 Z', HL, C.ink, 2)))),
    ...range(3).map((i) => moving(`b5a-halla-${i}`, '0%{transform:translate(-40px,0);opacity:0}20%{opacity:1}55%{transform:translate(0,0);opacity:1}70%,100%{transform:translate(-6px,6px);opacity:0}', { dur: 2.4, delay: i * 0.8 }, arrow(18, 66 + i * 12, 58, 70 + i * 6, C.grey, 2.2))),
    line('M6 22 L114 22', C.grey, 1.6), ...range(5).map((i) => i % 2 === 0 ? circle(14 + i * 23, 22, 6, C.yellow, C.ink, 1) : path(`M${14 + i * 23 + 2} 15 A7 7 0 1 0 ${14 + i * 23 + 2} 29 A5 5 0 1 1 ${14 + i * 23 + 2} 15 Z`, '#8a9ac8', C.ink, 1)), arrow(6, 36, 110, 36, HL, 2), check(108, 50, C.green, 0.8)),
  // Kastell och borgtyper – befästa: samma by förstärks – först oskyddad (vänster), sedan med vall och palissad som växer runt den (höger).
  'mana.befästa': all(
    rect(2, 22, 52, 76, C.white, 4, C.grey2, 1.4), path('M4 96 C14 74 42 74 52 96 Z', '#b9d39a', C.ink, 1.2), house(20, 70, 0.45), house(36, 68, 0.45, C.yellow), line('M10 82 C14 66 42 66 46 82', C.grey, 1.4, '3 3'),
    arrow(56, 60, 64, 60, HL, 2.4), T(60, 52, '+', 14, HL),
    rect(66, 22, 52, 76, SOFT, 4, HL, 2.4), path('M68 96 C78 74 106 74 116 96 Z', '#b9d39a', C.ink, 1.2), house(84, 70, 0.45), house(100, 68, 0.45, C.yellow),
    waGrow('b5a-befasta-1', path('M70 96 C72 86 112 86 114 96', 'none', '#a88a5a', 6), ...range(9).map((i) => { const x = 72 + i * 5; const y = 94 - Math.sin((i / 8) * Math.PI) * 8; return path(`M${x} ${f1(y)} l0 -9 l2 -3 l2 3 l0 9 Z`, C.brown, C.ink, 0.8); })),
    ...[[74, 30], [92, 26], [110, 30]].map(([x, y]) => T(x!, y! + 6, '+', 12, HL))),
  // Belägringens mål – strategisk: kartan där borgen i det enda passet styr alla vägar, 1–2–3 mot kronan.
  'mana.strategisk': all(
    map(6, 10, 108, 100), mountains(10, 62, 3, 1.1), mountains(64, 62, 3, 1.1),
    line('M14 100 C30 86 50 80 60 66 M106 100 C92 88 72 80 60 66 M60 66 C60 50 60 40 60 22', C.brown, 2, '4 3'),
    circle(60, 58, 9, SOFT, HL, 2.4), tower(54, 52, 12, 12, '#c9c1b4'),
    arrow(20, 98, 52, 68, HL, 2), T(24, 86, '1', 10, HL), T(66, 44, '2', 10, HL), crown(60, 22, 0.8), T(76, 24, '3', 10, HL)),
  // Belägringens mål – övertag: striden pågår (dammoln), frontmätaren står bara en bit över på den orange sidan, timglaset rinner fortfarande.
  'mana.övertag': all(
    rect(8, 18, 104, 20, C.white, 4, C.ink, 1.6), rect(8, 18, 62, 20, HL, 4, null), rect(70, 18, 42, 20, C.grey2, 0, null), rect(8, 18, 104, 20, 'none', 4, C.ink, 1.6), line('M60 12 L60 44', C.ink, 2, '3 3'),
    path('M70 10 L74 4 L66 4 Z', C.ink, null), path('M70 46 L74 52 L66 52 Z', C.ink, null),
    ground(108, '#e2d6b8'),
    waShake('b5a-overtag-1', ellipse(56, 88, 30, 14, '#d9cdb4', C.ink, 1), ellipse(76, 82, 18, 10, '#e2d8c2', C.ink, 1), line('M48 72 L72 96 M72 72 L48 96', C.grey, 3), line('M60 66 L60 70 M42 84 L38 84 M78 84 L82 84', C.ink, 1.4)),
    figure({ x: 18, h: 0.4, top: C.orange }), greyed(figure({ x: 102, h: 0.4, grey: true })),
    path('M100 58 L112 58 L106 66 Z M100 74 L112 74 L106 66 Z', '#f6e3b4', C.ink, 1.2), path('M104 72 L108 72 L106 69 Z', C.tan, null)),
  // Kontravallation – kringvärn: närbild uppifrån av själva formen – soldater i tät ring, ryggarna inåt och sköldarna utåt.
  'mana.kringvärn': all(
    rect(0, 0, 120, 120, '#e3ecd2', 0, null),
    ...range(10).map((i) => { const a = (i / 10) * Math.PI * 2; const c = Math.cos(a), s = Math.sin(a); return all(
      line(`M${f1(60 + c * 34)} ${f1(60 + s * 34)} L${f1(60 + c * 54)} ${f1(60 + s * 54)}`, C.brown, 2.2),
      ellipse(f1(60 + c * 24), f1(60 + s * 24), 7, 7, '#5a7a4a', C.ink, 1.2), circle(f1(60 + c * 24), f1(60 + s * 24), 4.6, '#8a8f96', C.ink, 1),
      g(`rotate(${f1((a * 180) / Math.PI)} ${f1(60 + c * 33)} ${f1(60 + s * 33)})`, rect(f1(60 + c * 33 - 2.5), f1(60 + s * 33 - 7), 5, 14, HL, 2, C.ink, 1.2))); }),
    circle(60, 60, 12, '#d9e4c4', C.grey2, 1, )),
  // Uniformer – menig: rangpyramiden, de många längst ner utan gradbeteckning (orange); befälen ovanför grå.
  'mana.menig': all(
    greyed(bust(60, 14, 0.4, C.navy), star(56, 26, 2.6, C.gold), star(64, 26, 2.6, C.gold), bust(42, 44, 0.38, C.navy), bust(78, 44, 0.38, C.navy)),
    line('M36 56 L46 56 M72 56 L82 56', C.grey, 2),
    rect(4, 66, 112, 46, SOFT, 5, HL, 2.4),
    ...range(5).map((i) => bust(16 + i * 22, 76, 0.42, C.navy)), ...range(5).map((i) => rect(10 + i * 22, 86, 12, 3, '#3a4a6a', 1, null))),
  // 1600-talets fältslag – segerrik: armén som vann, armarna i luften under lagerkransen, fiendens fana ligger i gräset.
  'mana.segerrik': all(
    ground(102, '#d8ecc8'), laurel(52, 20, 14),
    ...[24, 52, 80].map((x) => P({ x, h: 0.66, top: C.navy, mood: 'laugh' }) + line(`M${x - 8} 64 L${x - 15} 46 M${x + 8} 64 L${x + 15} 46`, C.navy, 4) + circle(x - 15, 45, 2.6, C.skin, C.ink, 1) + circle(x + 15, 45, 2.6, C.skin, C.ink, 1)),
    flagOn(98, 40, HL, C.yellow, 64), line('M98 40 L98 104', C.ink, 2),
    greyed(g('rotate(80 30 112)', flagOn(30, 82, C.grey, undefined, 30)))),
  // Skyttegravar – offensiv: en bred våg av pilar som går framåt från den egna skyttegraven längs hela fronten.
  'mana.offensiv': all(
    rect(0, 0, 120, 120, '#e9e2cf', 0, null),
    line('M14 10 L8 22 L14 34 L8 46 L14 58 L8 70 L14 82 L8 94 L14 106', '#7a5a3a', 5),
    greyed(line('M104 10 L110 22 L104 34 L110 46 L104 58 L110 70 L104 82 L110 94 L104 106', C.grey, 4)),
    ...range(5).map((i) => moving(`b5a-offensiv-${i}`, '0%{transform:translate(-30px,0);opacity:.2}60%,100%{transform:translate(0,0);opacity:1}', { dur: 2.6, delay: i * 0.12 }, arrow(28, 16 + i * 22, 90, 16 + i * 22, HL, 4)))),
  // Gerilla – terrorism: rädda civila flyr över ett torg, en grå smäll bakom husen och skräcken sprider sig.
  'mana.terrorism': all(
    rect(0, 0, 120, 120, '#eceae6', 0, null), ground(104, '#d9d5cc'),
    rect(6, 30, 26, 74, '#c9ced4', 0, C.ink, 1.2), rect(88, 22, 28, 82, '#c9ced4', 0, C.ink, 1.2), ...range(6).map((i) => rect(10 + (i % 2) * 10, 38 + Math.floor(i / 2) * 18, 6, 8, '#e8eef2', 0, null)),
    greyed(path('M60 14 L66 26 L80 22 L72 34 L84 42 L68 42 L66 56 L58 44 L46 50 L50 38 L36 32 L52 30 Z', C.dark, C.ink, 1.4)),
    waGrow('b5a-terror-1', circle(60, 36, 30, 'none', HL, 2), circle(60, 36, 44, 'none', HL, 1.4)),
    P({ x: 34, h: 0.55, top: C.green, mood: 'shock' }), P({ x: 60, h: 0.6, top: C.orange, hairStyle: 'long', mood: 'shock' }), P({ x: 86, h: 0.52, top: C.purple, mood: 'shock' }),
    line('M18 86 L8 86 M22 94 L10 94 M106 86 L114 86', C.grey, 2)),
  // Krigets lagar – paragrafen spänner ett skydd över civila, sårade och fångar; pilen från soldaten studsar.
  'mana.krigets-lagar': all(
    ground(108, '#e7e2d8'),
    path('M30 108 C30 52 114 52 114 108', SOFT, HL, 3),
    circle(72, 28, 14, C.white, HL, 2.6), T(72, 35, '§', 20, HL),
    house(54, 92, 0.8, C.red), bust(78, 92, 0.42, C.yellow, true), rect(90, 88, 18, 14, C.white, 1, C.ink, 1.2), path('M97 91 L101 91 L101 93 L103 93 L103 97 L101 97 L101 99 L97 99 L97 97 L95 97 L95 93 L97 93 Z', C.green, null),
    soldier(14, 0.6), arrow(22, 74, 34, 74, C.grey, 2), cross(36, 74, HL, 0.7)),
  // Utgrävningar – arkeologi: vetenskapen – bokhylla med kruka, jordlagerprofil på väggen och en tidslinje. Ingen som gräver.
  'mana.arkeologi': all(
    rect(4, 10, 50, 98, '#c99a6a', 2, C.ink, 1.8), ...range(3).map((r) => rect(8, 38 + r * 30, 42, 3, '#8a5a3a', 0, null)),
    ...range(3).flatMap((r) => range(5).map((c) => rect(10 + c * 7, 16 + r * 30, 6, 22, [C.navy, C.red, C.green, C.yellow, C.purple][(c + r) % 5]!, 1, C.ink, 0.8))),
    pot(44, 62, 0.5),
    rect(62, 10, 52, 54, C.white, 2, C.ink, 1.6), rect(66, 14, 44, 12, '#c9a878', 0, null), rect(66, 26, 44, 14, '#a88a5a', 0, null), rect(66, 40, 44, 20, '#7f6a4a', 0, null), circle(76, 20, 2.4, C.gold, null), pot(94, 34, 0.3), line('M80 50 L92 48', C.white, 2.4),
    line('M62 84 L114 84', C.ink, 2), ...[0, 1, 2, 3].map((i) => line(`M${64 + i * 16} 80 L${64 + i * 16} 88`, C.ink, 1.6)), pot(80, 76, 0.32), path('M110 80 L116 84 L110 88', 'none', C.ink, 2),
    rect(60, 96, 56, 12, '#efe6d6', 2, HL, 2)),
  // Utgrävningar – arkeologisk: ett vanligt vägbygge stoppas – den orange skylten med krukan visar att platsen är arkeologisk.
  'mana.arkeologisk': all(
    rect(0, 0, 120, 70, '#e3f2fa', 0, null), rect(0, 70, 120, 50, '#a88a5a', 0, null), rect(0, 92, 120, 28, '#6a6a6a', 0, null), line('M0 106 L120 106', C.white, 2, '8 6'),
    greyed(rect(70, 52, 40, 22, C.yellow, 3, C.ink, 1.4), circle(78, 80, 9, C.dark, C.ink, 1.2), rect(96, 72, 16, 16, C.dark, 2, C.ink, 1)),
    ...[60, 116].map((x) => path(`M${x - 5} 92 L${x} 76 L${x + 5} 92 Z`, C.orange, C.ink, 1)),
    line('M30 92 L30 50', C.ink, 2.4), rect(8, 14, 44, 40, HL, 4, C.ink, 1.8), circle(30, 34, 15, C.white, C.ink, 1.2), pot(30, 34, 0.6),
    circle(98, 26, 13, C.red, C.ink, 1.6), rect(90, 23, 16, 6, C.white, 1, null)),
  // Fynd och fyndplatser – lösfynd: en vandrare hittar av en slump ett mynt på stigen (orange ring) – ingen utgrävningsruta (grå, överkryssad).
  'mana.lösfynd': all(
    rect(0, 0, 120, 120, '#e3f2fa', 0, null), path('M0 80 C40 70 80 76 120 70 L120 120 L0 120 Z', '#cfe8b9', null), path('M20 120 C40 100 60 92 120 86 L120 96 C70 100 50 108 40 120 Z', '#d9c39a', null),
    P({ x: 40, h: 0.82, top: C.green, mood: 'shock' }), rect(22, 46, 8, 22, C.brown, 3, C.ink, 1.2), line('M58 70 L64 112', C.brown, 2.4),
    circle(80, 100, 5, C.gold, C.ink, 1.4), circle(80, 100, 13, 'none', HL, 3), line('M80 82 L80 78 M94 92 L98 90 M66 92 L62 90', C.gold, 2),
    greyed(rect(86, 12, 28, 24, '#a88a5a', 1, C.ink, 1), line('M93 12 L93 36 M100 12 L100 36 M107 12 L107 36 M86 24 L114 24', C.white, 1)), cross(100, 24, HL, 1)),
  // Datering av föremål – datering: krukan med frågetecken, tre metoder pekar på den (årsringar, jordlager, 14C), svaret ett ungefärligt spann.
  'mana.datering': all(
    pot(60, 56, 1.2), T(60, 62, '?', 20, HL),
    circle(18, 22, 13, '#e6c89a', C.ink, 1.4), ...[9, 6, 3].map((r) => circle(18, 22, r, 'none', '#a8783a', 1)),
    rect(88, 10, 26, 8, '#c9a878', 0, C.ink, 1), rect(88, 18, 26, 8, '#a88a5a', 0, C.ink, 1), rect(88, 26, 26, 8, '#7f6a4a', 0, C.ink, 1),
    circle(18, 82, 13, C.white, C.ink, 1.4), T(18, 87, '14C', 10, C.ink),
    ...[[30, 30, 42, 42], [88, 34, 76, 42], [30, 76, 42, 66]].map(([a, b, c, d], i) => moving(`b5a-datering-${i}`, '0%{opacity:0}30%,100%{opacity:1}', { dur: 2.4, delay: i * 0.4 }, arrow(a!, b!, c!, d!, HL, 2))),
    line('M56 100 L106 100 M56 95 L56 105 M106 95 L106 105', HL, 3), T(81, 116, '800–900', 10, HL)),
  // Tolka materiella spår – tyda på: skärvor, ben och en härd pekar mot en blek, streckad bild av en boplats, med frågetecken.
  'mana.tyda-på': all(
    rect(0, 84, 120, 36, '#c9a878', 0, null),
    ...range(7).map((i) => circle(f1(22 + Math.cos(i) * 10), f1(98 + Math.sin(i) * 5), 3, C.grey, C.ink, 0.8)), path('M18 98 L26 94 L28 100 Z', C.dark, null),
    path('M54 96 L62 92 L64 100 Z M68 100 L76 96 L74 104 Z', '#c97b4a', C.ink, 1), line('M92 98 L108 94 M94 94 L90 100 M106 92 L110 98', C.white, 3),
    waIn('b5a-tyda-1', 0, 14, line('M24 82 L44 60 M64 86 L60 62 M100 86 L78 60', HL, 2, '3 3')),
    `<g opacity="0.55">${all(path('M36 54 L60 30 L84 54 Z', 'none', C.ink, 1.6), rect(40, 54, 40, 2, 'none', 0, C.ink, 1.4), line('M42 56 L42 56', C.ink, 1))}</g>`,
    path('M36 54 L60 30 L84 54 L80 54 L80 56 L40 56 L40 54 Z', 'none', HL, 2, ), T(98, 34, '?', 18, HL)),
  // Skriftliga källor – skriftlig källa: pergament med text och årtal ger svaret (orange), inte kruka och ben (grå).
  'mana.skriftlig-källa': all(
    scroll(14, 18, 66, 70), scribble(22, 32, 52, 6), T(46, 82, '1350', 10, HL), rect(8, 12, 78, 82, 'none', 6, HL, 2.6),
    magnifier(84, 52, 12),
    greyed(pot(96, 96, 0.7), line('M76 108 L92 104', C.white, 3)), cross(96, 96, HL, 1)),
  // Föremåls funktion – funktion: yxan → kugghjulet (vad den gör) → vedträet som klyvs.
  'mana.funktion': all(
    rect(4, 38, 30, 34, C.white, 4, C.ink, 1.4), line('M10 66 L26 46', C.brown, 3), axeHead(26, 46, 0.6),
    arrow(36, 56, 46, 56, C.ink, 2), gear(60, 56, 10), arrow(74, 56, 84, 56, C.ink, 2),
    rect(86, 58, 30, 18, '#c9a878', 2, C.ink, 1.4), ellipse(101, 58, 15, 4, '#e6c89a', C.ink, 1.2), line('M101 54 L101 76', C.ink, 2), path('M96 40 L106 40 L101 52 Z', '#7f8a6a', C.ink, 1.2)),
  // Föremåls funktion – avsedd: den lilla stolen är gjord för barnet (bock), inte för den vuxne (grå).
  'mana.avsedd': all(
    ground(108, '#ece6da'),
    rect(30, 84, 24, 4, C.orange, 1, C.ink, 1.4), line('M32 88 L32 108 M52 88 L52 108', C.orange, 3), line('M32 84 L32 66 M32 68 L44 68', C.orange, 3),
    P({ x: 64, h: 0.5, top: C.yellow, mood: 'smile' }), arrow(50, 76, 58, 86, HL, 2), check(42, 50, C.green, 1),
    greyed(figure({ x: 98, h: 0.9, grey: true })), cross(98, 50, HL, 1.1)),
  // Konservering och restaurering – konservering: rosten växer (vänster), i montern med 50 % fukt står den still (höger).
  'mana.konservering': all(
    rect(4, 20, 50, 80, '#efe6d6', 4, C.grey2, 1.2), sword(30, 60, 0.6, '#9a8a7a'),
    waGrow('b5a-konserv-1', ...[[20, 60], [32, 58], [40, 62]].map(([x, y]) => circle(x!, y!, 3.4, '#a0522d', null))),
    arrow(56, 60, 64, 60, C.ink, 2),
    rect(66, 20, 50, 80, 'rgba(214,236,247,0.5)', 4, HL, 2.4), sword(92, 60, 0.6, '#9a8a7a'), ...[[82, 60], [94, 58]].map(([x, y]) => circle(x!, y!, 3, '#a0522d', null)),
    T(91, 38, '50 %', 10, HL), rect(84, 78, 4, 12, HL, 1, null), rect(92, 78, 4, 12, HL, 1, null), rect(66, 96, 50, 6, C.brown, 1, C.ink, 1)),
  // Byggnadsvård – kulturhistorisk: den gamla stugan med människor från tre sekler som levt där.
  'mana.kulturhistorisk': all(
    ground(108, '#d8ecc8'),
    path('M30 80 L60 58 L90 80 Z', '#7a4a3a', C.ink, 1.6), rect(34, 80, 52, 28, '#a8322a', 1, C.ink, 1.6), rect(56, 90, 10, 18, C.white, 1, C.ink, 1), rect(40, 86, 10, 8, C.white, 1, C.ink, 1), rect(72, 86, 10, 8, C.white, 1, C.ink, 1),
    ...[['#7a5a3a', 1700], ['#4a6a8a', 1850], [C.orange, 1950]].map(([c, y], i) => all(bust(20 + i * 40, 18, 0.45, c as string, i === 1), T(20 + i * 40, 46, String(y), 8, HL), line(`M${20 + i * 40} 50 L${48 + i * 12} 62`, HL, 1.4, '2 2'))),
    rect(2, 2, 116, 116, 'none', 6, HL, 2.4)),
  // Primärkällor – förstahandsuppgift: vittnet såg själv (ögat) och berättar direkt – en enda länk, 1.
  'mana.förstahandsuppgift': all(
    rect(0, 70, 40, 50, '#6fb3dd', 0, null), g('rotate(-20 20 66)', path('M4 66 L36 66 L30 76 L10 76 Z', C.brown, C.ink, 1.4), line('M20 66 L20 46', C.ink, 2), path('M20 48 L32 60 L20 60 Z', C.white, C.ink, 1)),
    line('M42 44 L28 54 M42 50 L30 62', HL, 1.6, '2 2'),
    P({ x: 56, h: 0.8, top: C.green, mood: 'shock' }), circle(52, 46, 3, 'none', HL, 1.4),
    path('M66 18 L100 18 L100 36 L80 36 L72 42 L74 36 L66 36 Z', SOFT, HL, 2), T(83, 33, '1', 14, HL),
    figure({ x: 98, h: 0.7, top: C.navy }), rect(104, 76, 10, 12, C.white, 1, C.ink, 1)),
  // Källkritik – tendentiös: boken framhäver den ena kungen i guld och svärtar den andra; pennan har en penningpung.
  'mana.tendentiös': all(
    path('M8 30 L60 36 L112 30 L112 96 L60 102 L8 96 Z', C.white, C.ink, 1.8), line('M60 36 L60 102', C.ink, 1.4),
    circle(34, 62, 22, SOFT, null), bust(34, 60, 0.7, C.purple), crown(34, 44, 0.8), star(16, 44, 3), star(52, 44, 3), star(18, 84, 3), star(50, 84, 3),
    greyed(bust(86, 72, 0.35, C.dark), crown(86, 64, 0.4, C.grey)), path('M76 54 C76 46 96 46 96 54 C100 54 100 60 96 60 L76 60 C72 60 72 54 76 54 Z', C.dark, null),
    line('M100 8 L80 26', C.ink, 2.4), path('M78 28 L82 22 L84 26 Z', C.ink, null), path('M104 6 C112 6 114 18 106 18 C98 18 100 6 104 6 Z', C.gold, C.ink, 1.2), T(106, 16, 'kr', 6, C.ink)),
  // Historiska tolkningar – historiesyn: glasögonen man ser historien genom; i ena glaset framsteg, i andra ett kretslopp.
  'mana.historiesyn': all(
    line('M4 92 L116 92', C.grey, 2), ...range(5).map((i) => line(`M${12 + i * 24} 88 L${12 + i * 24} 96`, C.grey, 1.6)),
    circle(36, 54, 24, '#eef6fb', C.ink, 3), circle(84, 54, 24, '#eef6fb', C.ink, 3), path('M58 50 C60 44 60 44 62 50', 'none', C.ink, 3), line('M12 50 L4 42 M108 50 L116 42', C.ink, 3),
    path('M20 66 L30 60 L38 62 L50 42', 'none', HL, 3), path('M44 42 L51 40 L51 48', 'none', HL, 3),
    path('M84 40 C96 40 98 66 84 68 C72 68 70 44 80 40', 'none', HL, 3), path('M76 36 L81 40 L76 45', 'none', HL, 3)),
  // Historiska tolkningar – historieskrivning: en penna skriver historien på en lång rulle – årtal och händelser i följd.
  'mana.historieskrivning': all(
    scroll(10, 26, 96, 52),
    line('M16 62 L100 62', C.ink, 1.6), ...[[24, 1500], [56, 1700], [88, 1900]].map(([x, y]) => all(line(`M${x} 58 L${x} 66`, C.ink, 1.6), T(x!, 74, String(y), 7, C.ink))),
    crown(24, 44, 0.6), path('M48 48 L64 48 L60 54 L52 54 Z', C.brown, C.ink, 1), line('M56 48 L56 36', C.ink, 1.2), path('M56 37 L63 46 L56 46 Z', C.white, C.ink, 0.8), rect(82, 40, 12, 14, '#a8322a', 0, C.ink, 1), rect(90, 32, 4, 10, C.grey, 0, C.ink, 1),
    waBob('b5a-hskriv-1', 3, path('M104 92 L116 66 L118 68 L108 94 Z', C.white, C.ink, 1.2), line('M104 92 L102 98', C.ink, 2)),
    line('M70 96 L100 96', HL, 2), rect(12, 88, 34, 8, C.navy, 1, C.ink, 1), rect(14, 96, 30, 8, C.red, 1, C.ink, 1), rect(10, 104, 36, 8, C.green, 1, C.ink, 1)),
};
