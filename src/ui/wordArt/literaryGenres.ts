/**
 * Kultur & fritid → Språk & litteratur → Skönlitteraturens genrer, 4341–4347 (0.61): novels and short stories,
 * crime and thrillers, science fiction, fantasy, historical novels, books for children and young people, poetry.
 * Recurring signs: a genre is a book cover with its typical picture (magnifier, rocket, dragon, ship); the
 * part the word names is orange (orange ring, orange frame or orange fill) and grey drawings are the reference.
 * Contrast pairs share one layout where only the marked part differs: roman/novell (long path with many people
 * or one short scene), prosa/vers/strof (the same page), utopi/dystopi (the same town, bright or grey).
 * No brands and no letters that give the word away; Japanese only as dots counted 5-7-5 on a paper strip.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, sparkle, star, waBob, waGrow, waIn, waPulse, waShake, waSpin, type Svg } from './kit';
import { HL, T, bubble, cloud, ghost, heart, mini, note, sun, thought } from './people';
import { figure } from './figures';
import { P, greyed } from './blindFix';

// ── Basics ───────────────────────────────────────────────────────────
const OR = '#fbd3bd';
const PAGE = '#fffdf6';
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const check = (x: number, y: number, col: string = C.green) => line(`M${x - 6} ${y} L${x - 2} ${y + 5} L${x + 7} ${y - 6}`, col, 3);
const qmark = (x: number, y: number, s = 12, col: string = C.navy) => T(x, y, '?', s, col, 900);
/** Text lines on a page: n lines from (x, y), w wide. */
const lines = (x: number, y: number, w: number, n: number, gap = 5, col: string = C.grey2, sw = 1.6) => line(Array.from({ length: n }, (_, i) => `M${x} ${y + i * gap} L${x + w - (i % 4 === 3 ? w * 0.35 : 0)} ${y + i * gap}`).join(' '), col, sw);
/** Short poem lines of varying length, left aligned. */
const verse = (x: number, y: number, lens: number[], gap = 5, col: string = C.navy, sw = 1.6) => line(lens.map((l, i) => `M${x} ${y + i * gap} L${x + l} ${y + i * gap}`).join(' '), col, sw);
/** Closed book seen from the front: cover w×h centred at (x, y); `pic` is drawn on top in absolute coordinates. */
const cover = (x: number, y: number, w: number, h: number, col: string, ...pic: Svg[]) => all(
  rect(x - w / 2 + 3, y - h / 2 + 3, w, h, '#e9e2d0', 2, C.ink, 1.4), rect(x - w / 2, y - h / 2, w, h, col, 2, C.ink, 1.8), line(`M${x - w / 2 + 5} ${y - h / 2} L${x - w / 2 + 5} ${y + h / 2}`, 'rgba(0,0,0,0.22)', 2.4), ...pic);
/** Small closed book (spine visible) standing on a shelf. */
const spine = (x: number, y: number, w: number, h: number, col: string) => all(rect(x, y - h, w, h, col, 1, C.ink, 1.2), line(`M${x + 1.5} ${y - h + 4} L${x + w - 1.5} ${y - h + 4} M${x + 1.5} ${y - 5} L${x + w - 1.5} ${y - 5}`, 'rgba(255,255,255,0.6)', 1));
/** Open book centred at (x, y). */
const openBook = (x: number, y: number, s = 1, txt = true) => at(x, y, s,
  path('M0 -14 C-8 -18 -18 -16 -24 -13 L-24 12 C-18 9 -8 9 0 13 Z', PAGE, C.ink, 1.6), path('M0 -14 C8 -18 18 -16 24 -13 L24 12 C18 9 8 9 0 13 Z', PAGE, C.ink, 1.6),
  txt ? line('M-20 -8 L-5 -9 M-20 -3 L-5 -4 M-20 2 L-5 1 M5 -9 L20 -8 M5 -4 L20 -3 M5 1 L20 2', C.grey2, 1.4) : '');
/** Sheet of paper. */
const sheet = (x: number, y: number, w: number, h: number, ...k: Svg[]) => all(rect(x, y, w, h, PAGE, 2, C.ink, 1.6), ...k);
const magnifier = (x: number, y: number, s = 1, col: string = C.brown) => at(x, y, s, line('M6 6 L15 15', col, 4), circle(0, 0, 8, 'rgba(191,227,245,0.55)', C.ink, 2));
const foot = (x: number, y: number, rot = 0, col: string = C.dark) => g(`rotate(${rot} ${x} ${y})`, ellipse(x, y, 2.6, 4.4, col, null), circle(x - 1.4, y - 6, 1.1, col, null), circle(x + 1.2, y - 6.2, 1.1, col, null));
const rocket = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M0 -16 C7 -9 7 4 4 10 L-4 10 C-7 4 -7 -9 0 -16 Z', C.white, C.ink, 1.6), circle(0, -3, 3, C.sky, C.ink, 1.2), path('M-4 4 L-9 12 L-4 10 Z M4 4 L9 12 L4 10 Z', C.red, C.ink, 1.2), path('M-3 10 L0 17 L3 10 Z', C.orange, null));
const ringPlanet = (x: number, y: number, r: number, col: string = C.orange) => all(circle(x, y, r, col, C.ink, 1.6), ellipse(x, y, r * 1.7, r * 0.45, 'none', C.ink, 1.4), path(`M${x - r * 1.7} ${y} A${r * 1.7} ${r * 0.45} 0 0 0 ${x + r * 1.7} ${y}`, 'none', C.yellow, 2.2));
const dragon = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s,
  path('M-20 6 C-30 4 -34 -4 -30 -10 C-28 -4 -24 0 -18 0', 'none', col, 3.4),
  path('M-6 -6 L-18 -24 L-4 -16 L2 -26 L6 -12 Z', col === C.grey ? C.grey2 : C.mint, C.ink, 1.4),
  ellipse(-6, 2, 16, 9, col, C.ink, 1.6), path('M6 -2 C12 -8 14 -16 20 -16 C26 -16 28 -10 24 -8 L16 -6 C14 -2 12 2 8 4 Z', col, C.ink, 1.6),
  circle(21, -13, 1.4, C.ink, null), line('M-14 10 L-14 16 M2 10 L2 16', C.ink, 3), path('M-22 -2 L-18 -6 M-12 -9 L-8 -12', 'none', C.ink, 1));
const fire = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 C8 -6 16 -4 22 -8 C18 -2 24 2 20 6 C14 4 8 6 0 2 Z', C.orange, C.ink, 1.2), path('M4 0 C10 -3 14 -2 18 -4 C16 0 18 2 16 4 C12 2 8 3 4 1 Z', C.yellow, null));
const castle = (x: number, y: number, s = 1, col: string = C.grey2) => at(x, y, s, rect(-14, -18, 28, 18, col, 0, C.ink, 1.4), rect(-20, -28, 8, 28, col, 0, C.ink, 1.4), rect(12, -28, 8, 28, col, 0, C.ink, 1.4),
  path('M-21 -28 L-16 -36 L-11 -28 Z M11 -28 L16 -36 L21 -28 Z', C.red, C.ink, 1.2), path('M-4 0 L-4 -8 C-4 -12 4 -12 4 -8 L4 0 Z', C.dark, null));
const ship = (x: number, y: number, s = 1, col: string = C.brown) => at(x, y, s, path('M-18 0 L18 0 L13 8 L-13 8 Z', col, C.ink, 1.4), line('M0 0 L0 -26', C.ink, 1.6), path('M1 -24 L14 -6 L1 -6 Z', C.white, C.ink, 1.2), path('M-1 -22 L-12 -6 L-1 -6 Z', C.white, C.ink, 1.2));
const clockFace = (x: number, y: number, r: number, hands: Svg = '') => all(circle(x, y, r, C.white, C.ink, 1.8), ...[0, 3, 6, 9].map((i) => { const a = i * Math.PI / 6; return circle(x + Math.sin(a) * r * 0.78, y - Math.cos(a) * r * 0.78, 0.9, C.ink, null); }), hands || line(`M${x} ${y} L${x} ${y - r * 0.6} M${x} ${y} L${x + r * 0.45} ${y}`, C.ink, 1.8));
const moon = (x: number, y: number, r = 7, col: string = '#f6e7b4') => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${x} ${y + r} A${r * 0.7} ${r} 0 1 1 ${x} ${y - r} Z`, col, C.ink, 1.2);
const lamp = (x: number, y: number) => all(line(`M${x} ${y} L${x} ${y + 40}`, C.dark, 2), path(`M${x - 9} ${y + 8} L${x - 5} ${y} L${x + 5} ${y} L${x + 9} ${y + 8} Z`, C.yellow, C.ink, 1.2), path(`M${x - 9} ${y + 8} L${x - 20} ${y + 40} L${x + 20} ${y + 40} L${x + 9} ${y + 8} Z`, 'rgba(242,193,78,0.25)', null));
/** Seated person facing right, hips at (x, y); `hands` are drawn by the caller. */
const sitter = (x: number, y: number, top: string, more: { hair?: 'long' | 'short'; mood?: 'smile' | 'tense' | 'calm' } = {}) => all(
  path(`M${x - 2} ${y} L${x + 18} ${y} L${x + 20} ${y + 22} L${x + 14} ${y + 22} L${x + 13} ${y + 6} L${x - 2} ${y + 6} Z`, C.navy, C.ink, 1.6),
  path(`M${x - 8} ${y + 2} C${x - 10} ${y - 12} ${x - 8} ${y - 24} ${x} ${y - 26} L${x + 6} ${y - 26} C${x + 10} ${y - 20} ${x + 8} ${y - 8} ${x + 6} ${y + 2} Z`, top, C.ink, 1.6),
  more.hair === 'long' ? path(`M${x - 8} ${y - 34} C${x - 12} ${y - 22} ${x - 6} ${y - 22} ${x + 2} ${y - 24} L${x + 2} ${y - 40} Z`, C.hair, C.ink, 1.2) : '',
  circle(x + 3, y - 34, 8, C.skin, C.ink, 1.6), path(`M${x - 5} ${y - 36} C${x - 5} ${y - 46} ${x + 11} ${y - 46} ${x + 11} ${y - 36} C${x + 6} ${y - 40} ${x} ${y - 40} ${x - 5} ${y - 36} Z`, C.hair, C.ink, 1.2),
  circle(x + 7, y - 35, 1, C.ink, null),
  more.mood === 'tense' ? path(`M${x + 5} ${y - 29} L${x + 9} ${y - 30}`, 'none', C.ink, 1.2) : path(`M${x + 5} ${y - 30} Q${x + 7.5} ${y - 28} ${x + 10} ${y - 30}`, 'none', C.ink, 1.2));
const chair = (x: number, y: number, col: string = C.red) => all(rect(x - 12, y, 30, 8, col, 3, C.ink, 1.6), rect(x - 16, y - 30, 8, 38, col, 3, C.ink, 1.6), line(`M${x - 12} ${y + 8} L${x - 12} 112 M${x + 14} ${y + 8} L${x + 14} 112`, C.brown, 3));
const handBook = (x: number, y: number, col: string = C.red, s = 1) => all(at(x, y, s, path('M0 -9 L-10 -12 L-10 6 L0 9 Z', PAGE, C.ink, 1.2), path('M0 -9 L10 -12 L10 6 L0 9 Z', PAGE, C.ink, 1.2), path('M-11 -12 L-11 7 L0 10 L11 7 L11 -12', 'none', col, 2)));
const star5 = (x: number, y: number, r: number, col: string = C.yellow) => star(x, y, r, col);
const sparks = (x: number, y: number, s = 1) => all(sparkle(x, y, 4 * s), sparkle(x + 9 * s, y - 7 * s, 3 * s), sparkle(x - 8 * s, y - 9 * s, 2.6 * s));
const wand = (x1: number, y1: number, x2: number, y2: number) => all(line(`M${x1} ${y1} L${x2} ${y2}`, C.dark, 2.6), star5(x2, y2, 4));
const tree = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s, rect(-2, -12, 4, 12, C.brown, 1, C.ink, 1), circle(0, -18, 9, col, C.ink, 1.4));
const pine = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s, rect(-2, -6, 4, 6, C.brown, 1, null), path('M0 -30 L10 -6 L-10 -6 Z', col, C.ink, 1.2));
const houseB = (x: number, y: number, w: number, h: number, col: string, win: string = '#bfe3f5') => all(rect(x, y - h, w, h, col, 1, C.ink, 1.4), ...Array.from({ length: Math.floor(h / 12) }, (_, i) => all(rect(x + 3, y - h + 4 + i * 12, 5, 5, win, 0.5, null), rect(x + w - 8, y - h + 4 + i * 12, 5, 5, win, 0.5, null))));
const crown = (x: number, y: number, s = 1) => at(x, y, s, path('M-7 3 L-8 -5 L-4 -1 L0 -7 L4 -1 L8 -5 L7 3 Z', C.gold, C.ink, 1.2));
const knife = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M0 -2 L22 -2 C20 2 14 4 0 3 Z', C.silver, C.ink, 1.2), rect(-12, -3, 12, 6, C.dark, 2, C.ink, 1.2));
const wave3 = (x: number, y: number, col: string = HL) => all(...[0, 1, 2].map((i) => path(`M${x + i * 6} ${y - 6 - i * 3} C${x + 4 + i * 6} ${y - 2} ${x + 4 + i * 6} ${y + 2} ${x + i * 6} ${y + 6 + i * 3}`, 'none', col, 2)));

// ── 4341 Romaner och noveller ────────────────────────────────────────
const M1: Record<string, Svg> = {
  // a shelf in sections, each with its own sign: magnifier, rocket, dragon, heart
  'litg.genre': all(rect(6, 46, 108, 62, C.tan, 3, C.ink, 1.8), line('M33 46 L33 108 M60 46 L60 108 M87 46 L87 108', C.brown, 3),
    ...[[C.navy, C.dark], [C.purple, C.lilac], [C.green, C.mint], [C.red, C.pink]].map(([a, b], k) => all(...[0, 1, 2].map((i) => spine(10 + k * 27 + i * 7.5, 104, 6.5, 50 - (i % 2) * 8, i % 2 ? b! : a!)))),
    ...[19.5, 46.5, 73.5, 100.5].map((x) => all(rect(x - 12, 10, 24, 26, C.white, 3, C.ink, 1.4), line(`M${x} 36 L${x} 46`, C.grey, 1.4))),
    magnifier(17, 21, 0.62), rocket(46.5, 23, 0.55, 30), dragon(73, 27, 0.32, C.green), heart(100.5, 25, 0.62),
    frame(2, 4, 116, 108)),
  // a long path across a thick book, with many people along the way
  'litg.roman': all(rect(16, 86, 92, 14, PAGE, 2, C.ink, 1.4), line('M18 90 L106 90 M18 94 L106 94 M18 97 L106 97', C.grey2, 1),
    openBook(60, 58, 2.1, false),
    path('M16 72 C30 50 44 80 56 56 C66 38 80 70 92 48 C98 38 104 44 104 44', 'none', HL, 2.6, ),
    ...[[20, 68, C.red], [36, 64, C.green], [50, 66, C.denim], [66, 50, C.purple], [80, 60, C.orange], [96, 46, C.pink]].map(([x, y, c]) => mini(x as number, y as number, c as string)),
    house(104, 40)),
  // one short scene on a few pages: read over one cup of coffee
  'litg.novell': all(ground(), rect(14, 92, 92, 6, C.tan, 2, C.ink, 1.4), line('M22 98 L22 112 M98 98 L98 112', C.brown, 3),
    at(46, 72, 1.15, path('M0 -14 C-8 -17 -16 -16 -20 -13 L-20 12 C-16 10 -8 10 0 13 Z', PAGE, C.ink, 1.6), path('M0 -14 C8 -17 16 -16 20 -13 L20 12 C16 10 8 10 0 13 Z', PAGE, C.ink, 1.6)),
    mini(40, 72, C.red), star5(56, 66, 5), line('M30 88 L62 88', C.ink, 2.4), ring(46, 72, 28),
    at(88, 84, 1.2, path('M-7 -6 L7 -6 L6 6 C6 9 -6 9 -6 6 Z', C.white, C.ink, 1.6), path('M7 -3 C12 -3 12 4 6 4', 'none', C.ink, 1.6)), path('M84 70 c-3 -4 3 -6 0 -10 M90 70 c-3 -4 3 -6 0 -10', 'none', C.grey, 1.4)),
  // a young author holds up her very first book; a big ”1” and confetti
  'litg.debutroman': all(ground(), P({ x: 46, h: 0.82, top: C.green, hairStyle: 'long', mood: 'laugh' }),
    line('M58 68 L70 44', C.skin, 5), cover(80, 36, 26, 34, C.red, rect(72, 26, 16, 10, C.white, 1, null)), circle(96, 18, 10, C.yellow, HL, 2.4), T(96, 23, '1', 14, C.ink, 900),
    sparkle(20, 30, 5), sparkle(32, 16, 3.5), star5(110, 44, 4, C.pink), star5(64, 14, 3.5, C.sky), sparkle(108, 64, 3)),
  // an editor at a desk reads a manuscript; the house's own books on the shelf behind
  'litg.förlag': all(ground(), rect(6, 10, 108, 48, '#efe6d6', 2, C.ink, 1.4), line('M10 34 L110 34 M10 56 L110 56', C.brown, 2.6),
    ...Array.from({ length: 12 }, (_, i) => spine(12 + i * 8, 33, 6, 18 - (i % 3) * 2, [C.red, C.navy, C.green][i % 3]!)), ...Array.from({ length: 12 }, (_, i) => spine(12 + i * 8, 55, 6, 18 - (i % 2) * 3, [C.green, C.red, C.navy][i % 3]!)),
    rect(30, 82, 76, 6, C.brown, 2, C.ink, 1.6), line('M36 88 L36 112 M100 88 L100 112', C.brown, 3),
    figure({ x: 22, h: 0.72, top: C.purple }), rect(56, 72, 26, 10, PAGE, 1, C.ink, 1.2), line('M58 76 L80 76 M58 79 L76 79', C.grey, 1), rect(60, 66, 26, 10, PAGE, 1, C.ink, 1.2), line('M63 70 L84 70', C.grey, 1),
    line('M30 80 L56 76', C.skin, 4), g('rotate(-30 90 72)', rect(88, 64, 3, 14, C.red, 1, C.ink, 1)),
    frame(4, 8, 112, 52)),
  // the press sends new books out to the readers (motion: the books travel to the right)
  'litg.ge-ut': all(ground(), rect(6, 54, 38, 58, C.grey, 3, C.ink, 1.8), circle(18, 70, 7, C.silver, C.ink, 1.4), circle(32, 70, 7, C.silver, C.ink, 1.4), rect(10, 84, 30, 6, PAGE, 1, C.ink, 1),
    waSpin('lg-geut-g', 3, circle(18, 70, 3, C.dark, null), line('M18 64 L18 76 M12 70 L24 70', C.ink, 1.2)),
    waIn('lg-geut-1', -30, 0, cover(58, 80, 14, 18, C.red)), moving('lg-geut-2', '0%,20%{transform:translate(-50px,0);opacity:.1}70%,100%{transform:translate(0,0);opacity:1}', { dur: 2.6 }, cover(78, 76, 14, 18, C.red)),
    moving('lg-geut-3', '0%,35%{transform:translate(-70px,0);opacity:.1}85%,100%{transform:translate(0,0);opacity:1}', { dur: 2.6 }, cover(100, 72, 14, 18, C.red)),
    arrow(50, 100, 108, 100, HL, 2.6), mini(70, 32, C.green), mini(92, 28, C.pink, true), mini(108, 36, C.denim), line('M70 40 L74 64 M92 36 L96 60', C.grey2, 1.4, '3 3')),
  // continuous text that runs to the edge of the page (the poem with short lines is grey)
  'litg.prosa': all(sheet(10, 14, 58, 92, lines(16, 24, 46, 15, 5.4, C.navy, 1.8)), frame(6, 10, 66, 100),
    greyed(sheet(78, 30, 34, 60, verse(83, 40, [14, 20, 10, 18], 5, C.grey), verse(83, 66, [18, 12, 22, 14], 5, C.grey)))),
  // a book as heavy as a brick: she can hardly lift it (a real brick in grey)
  'litg.tegelsten.2': all(ground(), at(60, 74, 1, rect(-28, -12, 56, 26, '#b9563d', 3, C.ink, 2), rect(-28, -18, 56, 8, PAGE, 2, C.ink, 1.6), line('M-26 -15 L26 -15 M-26 -12.5 L26 -12.5', C.grey2, 0.8),
      line('M-28 -2 L28 -2 M-28 7 L28 7 M-10 -12 L-10 -2 M12 -12 L12 -2 M0 -2 L0 7 M-18 7 L-18 14 M18 7 L18 14', '#8d3d2a', 1.4)),
    figure({ x: 60, h: 0.7, top: C.sky }), line('M48 74 L36 78 M72 74 L84 78', C.skin, 4),
    path('M34 52 l-4 -4 M86 52 l4 -4 M60 34 l0 -6', 'none', C.grey, 1.6), ...[42, 78].map((x) => path(`M${x} 46 c-2 3 2 4 0 6`, 'none', C.sky, 1.6)),
    greyed(rect(94, 98, 20, 14, '#b9563d', 1, C.ink, 1.4), line('M94 105 L114 105 M104 98 L104 105', C.ink, 1))),
  // reading on and on: the clock runs through the night (motion: the hands turn)
  'litg.sträckläsa': all(ground(), rect(78, 10, 34, 30, '#20304f', 2, C.ink, 1.6), moon(98, 22, 7), star5(86, 30, 2, C.white), star5(106, 34, 2, C.white),
    lamp(14, 40), chair(36, 74, C.red), sitter(38, 74, C.green), handBook(60, 60, C.navy, 1), line('M44 56 L54 62 M44 60 L54 64', C.skin, 3.2),
    moving('lg-strl-p', '0%,40%{transform:scaleX(1)}50%{transform:scaleX(-1)}60%,100%{transform:scaleX(1)}', { dur: 1.4, spin: true }, path('M60 51 L70 48 L70 66 L60 69 Z', PAGE, C.ink, 1)),
    clockFace(96, 76, 13, ''), waSpin('lg-strl-c', 2, line('M96 76 L96 66', C.ink, 1.8)), line('M96 76 L103 80', C.ink, 2.2), ring(96, 76, 17)),
  // what the book does to the reader: laughter, tears, a racing heart
  'litg.läsupplevelse': all(ground(), chair(32, 80, C.denim), sitter(34, 80, C.orange, { hair: 'long' }), handBook(56, 66, C.red), line('M40 62 L50 68', C.skin, 3.2),
    thought(84, 26, 50, all(heart(72, 28, 0.55), path('M84 20 c-2 4 -3 7 0 9 c3 -2 2 -5 0 -9 Z', C.sky, C.ink, 1), star5(96, 26, 5), sparkle(84, 34, 3))),
    line('M58 56 C66 48 70 44 72 40', HL, 2, '3 3'), ring(84, 26, 30)),
  // four people round a table, each with the same red book, talking
  'litg.bokcirkel': all(ground(), ellipse(60, 92, 34, 9, C.tan, C.ink, 1.6), line('M60 101 L60 112', C.brown, 4),
    figure({ x: 18, h: 0.6, top: C.green }), figure({ x: 102, h: 0.6, top: C.purple, hairStyle: 'long' }),
    mini(44, 70, C.orange, true), mini(76, 70, C.denim),
    cover(30, 76, 9, 12, C.red), cover(90, 76, 9, 12, C.red), cover(52, 88, 9, 12, C.red), cover(70, 88, 9, 12, C.red),
    bubble(32, 24, 26, line('M24 23 L40 23 M24 27 L34 27', C.navy, 1.4), true), bubble(88, 22, 26, heart(88, 23, 0.4), false), bubble(60, 40, 18, qmark(60, 44, 10), true)),
};
function house(x: number, y: number) { return at(x, y, 0.6, path('M-10 0 L-10 -12 L0 -20 L10 -12 L10 0 Z', C.red, C.ink, 1.6), rect(-3, -7, 6, 7, C.brown, 1, null)); }

// ── 4342 Deckare och thrillers ───────────────────────────────────────
const M2: Record<string, Svg> = {
  // a book cover: magnifier over footprints and a question mark
  'litg.deckare': all(cover(60, 60, 64, 86, C.navy, foot(44, 92, 20, C.white), foot(52, 78, 10, C.white), foot(64, 66, 20, C.white), magnifier(70, 48, 1.6, C.gold), qmark(72, 54, 14, C.white))),
  // a book cover: a figure runs from a long shadow, the pulse races
  'litg.thriller': all(cover(60, 60, 64, 86, C.black,
      at(72, 70, 0.9, circle(2, -30, 5, C.skin, C.ink, 1.2), line('M1 -25 L-2 -12', C.red, 5), line('M-1 -22 L-9 -16 M0 -22 L8 -26', C.skin, 2.6), line('M-2 -12 L6 -6 L4 1 M-2 -12 L-8 -4 L-14 -6', C.grey2, 3)),
      path('M34 92 C40 70 44 60 50 56 L56 62 C50 70 46 82 46 92 Z', '#121218', null), line('M80 46 l10 0 M82 52 l10 0 M80 58 l9 0', C.grey2, 1.4),
      line('M34 30 L46 30 L50 22 L56 38 L60 26 L64 30 L86 30', C.red, 2.2))),
  // a book cover with a ghost under the full moon; the reader behind it shivers
  'litg.rysare': all(cover(52, 54, 56, 76, '#3a2d4f', moon(66, 30, 8, C.white), ghost(48, 60, 1.3), pine(30, 88, 0.9, C.dark), pine(72, 90, 0.8, C.dark)),
    waShake('lg-rys', mini(100, 92, C.green), path('M90 82 l-4 -2 M110 82 l4 -2 M92 90 l-4 0 M108 90 l4 0', 'none', C.grey, 1.4))),
  // on the edge of the seat, sweating, the heart racing (calm grey reader for comparison)
  'litg.nervkittlande': all(ground(), greyed(chair(18, 80, C.grey), sitter(20, 80, C.grey, { mood: 'calm' }), handBook(42, 66, C.grey, 0.8)),
    chair(76, 86, C.red), at(4, -6, 1, sitter(78, 86, C.orange, { mood: 'tense' })), handBook(106, 62, C.navy, 1), line('M88 58 L100 62', C.skin, 3.2),
    path('M92 38 c-2 3 2 4 0 6 M98 34 c-2 3 2 4 0 6', 'none', C.sky, 1.6), waPulse('lg-nerv', line('M64 22 L72 22 L75 14 L79 30 L82 18 L85 22 L94 22', C.red, 2.2)), ring(84, 50, 30)),
  // the detective with a magnifier follows footprints
  'litg.detektiv': all(ground(), figure({ x: 40, h: 0.9, top: C.tan, bottom: C.brown }), path('M28 34 L52 34 L50 28 C48 22 32 22 30 28 Z', C.tan, C.ink, 1.4), rect(26, 33, 28, 3, C.brown, 1, null),
    line('M52 70 L66 78', C.skin, 4.4), magnifier(74, 84, 1.4), foot(80, 102, 80), foot(94, 106, 100), foot(108, 102, 80)),
  // the chief at a board with photos and red strings; uniformed officers listen
  'litg.kommissarie': all(ground(), rect(54, 14, 60, 50, C.white, 2, C.ink, 1.8), ...[[62, 22], [86, 20], [70, 44], [98, 42]].map(([x, y]) => all(rect(x!, y!, 12, 14, C.sky, 1, C.ink, 1), circle(x! + 6, y! + 6, 3, C.skin, null))),
    line('M68 29 L92 27 L76 51 L104 49 L68 29', C.red, 1.4), figure({ x: 34, h: 0.9, top: C.dark, bottom: C.dark }), path('M32 64 L36 64 L37 70 L34 73 L31 70 Z', C.gold, C.ink, 1),
    line('M46 66 L58 46', C.skin, 4.4), at(80, 86, 1, mini(0, 0, C.navy), mini(22, 2, C.navy)), rect(74, 76, 12, 3, C.navy, 1, null), rect(96, 78, 12, 3, C.navy, 1, null)),
  // the hooded murderer sneaks away from the scene at night
  'litg.mördare': all(rect(4, 4, 112, 108, '#2d3550', 3, null), moon(96, 20, 8), ground(),
    at(54, 0, 1, figure({ x: 0, h: 0.95, top: C.black, bottom: C.black }), path('M-12 26 C-14 6 14 6 12 26 L10 34 C6 28 -6 28 -10 34 Z', C.black, C.ink, 1.4), rect(-6, 24, 12, 8, C.dark, 2, null), circle(-2.6, 28, 1, C.white, null), circle(2.6, 28, 1, C.white, null)),
    foot(84, 106, 90, C.grey), foot(98, 102, 90, C.grey)),
  // the weapon in a numbered evidence bag on a table
  'litg.mordvapen': all(rect(10, 78, 100, 6, C.tan, 2, C.ink, 1.6), line('M18 84 L18 112 M102 84 L102 112', C.brown, 3),
    rect(26, 34, 68, 40, 'rgba(220,240,252,0.55)', 4, C.ink, 1.6), line('M26 40 L94 40', C.red, 2.4), knife(48, 56, 1.1, -10),
    rect(76, 60, 16, 10, C.yellow, 1, C.ink, 1), T(84, 68, '7', 8, C.ink, 900), ring(60, 54, 36)),
  // the chapter ends with someone hanging from a cliff, and the page turns
  'litg.cliffhanger': all(openBook(60, 64, 2.2, false), path('M64 40 L100 40 L100 70 L80 70 L72 56 L64 54 Z', '#b9a07a', C.ink, 1.4),
    line('M78 70 L78 80', C.skin, 3), circle(78, 84, 4, C.skin, C.ink, 1.2), path('M74 88 L82 88 L82 100 L74 100 Z', C.red, C.ink, 1.2), line('M75 100 L73 108 M81 100 L83 108', C.navy, 2.4),
    line('M24 46 L52 44 M24 52 L52 50 M24 58 L48 56', C.grey2, 1.4), qmark(36, 82, 18, HL),
    moving('lg-cliff', '0%,60%{transform:rotate(0)}80%,100%{transform:rotate(-12deg)}', { dur: 2.4 }, path('M112 38 L112 92 L104 92 Z', '#ece4cf', C.ink, 1.2))),
};

// ── 4343 Science fiction ─────────────────────────────────────────────
const M3: Record<string, Svg> = {
  // a book cover: a rocket on its way to a ringed planet
  'litg.science-fiction': all(cover(60, 60, 64, 86, '#1d2a4d', ringPlanet(76, 40, 9), rocket(46, 72, 1.2, 30), star5(40, 30, 2.4, C.white), star5(82, 84, 2, C.white), star5(64, 98, 1.8, C.white), star5(88, 64, 1.8, C.white))),
  // a little green visitor from another planet next to its saucer
  'litg.utomjording': all(ground(), ellipse(90, 96, 24, 7, C.silver, C.ink, 1.6), path('M76 94 C78 80 102 80 104 94 Z', 'rgba(191,227,245,0.8)', C.ink, 1.4), ...[76, 90, 104].map((x) => circle(x, 98, 1.8, C.yellow, null)),
    at(40, 0, 1, ellipse(0, 96, 10, 14, '#7fcf7a', C.ink, 1.6), line('M-8 104 L-10 112 M8 104 L10 112', '#7fcf7a', 4), line('M-9 92 L-18 82 M9 92 L18 82', '#7fcf7a', 3.4),
      ellipse(0, 66, 14, 16, '#7fcf7a', C.ink, 1.8), ellipse(-6, 64, 4, 6, C.ink, null), ellipse(6, 64, 4, 6, C.ink, null), path('M-4 74 Q0 77 4 74', 'none', C.ink, 1.2),
      line('M-6 52 L-12 40 M6 52 L12 40', C.ink, 1.4), circle(-12, 40, 2.6, C.yellow, C.ink, 1), circle(12, 40, 2.6, C.yellow, C.ink, 1)), star5(20, 20, 3), star5(100, 30, 2.4)),
  // two identical sheep with the same DNA strand between them
  'litg.klon': all(ground(), ...[24, 96].map((x) => at(x, 92, 1, ellipse(0, 0, 18, 12, C.white, C.ink, 1.6), ...[-12, -4, 4, 12].map((d) => circle(d, -8, 5, C.white, C.ink, 1.2)), ellipse(16, -6, 6, 8, C.dark, C.ink, 1.2), line('M-10 10 L-10 20 M10 10 L10 20', C.dark, 3))),
    path('M54 30 C66 40 54 50 66 60 C54 70 66 80 54 90', 'none', C.denim, 2.4), path('M66 30 C54 40 66 50 54 60 C66 70 54 80 66 90', 'none', HL, 2.4), line('M57 36 L63 36 M57 48 L63 48 M57 66 L63 66 M57 78 L63 78', C.grey, 1.4),
    line('M26 64 L26 52 L94 52 L94 64', C.grey, 1.6, '3 3'), sparkle(110, 70, 4), sparkle(10, 70, 4)),
  // a capsule with a big clock on the front, levers and sparks
  'litg.tidsmaskin': all(ground(), rect(24, 34, 72, 70, C.silver, 12, C.ink, 2), rect(30, 40, 60, 58, '#d9dee3', 8, C.ink, 1.4), clockFace(60, 62, 16, line('M60 62 L60 50 M60 62 L69 66', C.ink, 2)),
    waSpin('lg-tm', 2.4, circle(60, 62, 20, 'none', HL, 2, ), line('M60 42 L60 46', HL, 3)), rect(40, 86, 8, 8, C.red, 2, C.ink, 1), rect(56, 86, 8, 8, C.green, 2, C.ink, 1), rect(72, 86, 8, 8, C.yellow, 2, C.ink, 1),
    line('M96 60 L108 46', C.dark, 3), circle(108, 46, 4, C.red, C.ink, 1.2), rect(32, 104, 10, 6, C.dark, 1, null), rect(78, 104, 10, 6, C.dark, 1, null), sparkle(18, 40, 4), sparkle(104, 90, 4), sparkle(14, 70, 3)),
  // the same street twice, side by side behind a shimmering wall; only the person differs
  'litg.parallellvärld': all(ground(), ...[0, 60].map((dx, i) => all(rect(4 + dx, 10, 52, 102, i === 0 ? '#e7f1f7' : '#f6e7f2', 3, C.ink, 1.4), houseB(10 + dx, 92, 16, 46, C.tan), houseB(32 + dx, 92, 18, 36, C.red), line(`M6 ${92} L${54 + dx} 92`, C.grey, 1.6))),
    mini(26, 104, C.green), mini(86, 104, C.purple, true), waPulse('lg-par', line('M60 10 L60 112', HL, 2.4, '4 4')), path('M50 22 L58 22 M70 22 L62 22', 'none', HL, 2), path('M55 19 L58 22 L55 25 M65 19 L62 22 L65 25', 'none', HL, 2)),
  // a bright town: trees, sun and people hand in hand
  'litg.utopi': all(rect(4, 4, 112, 108, '#e6f4fb', 3, null), sun(96, 22, 8), ground(), rect(4, 96, 112, 16, C.mint, 0, null),
    houseB(12, 96, 18, 40, C.yellow), houseB(64, 96, 20, 52, C.pink), houseB(90, 96, 18, 34, C.sky), tree(40, 96, 1, C.green), tree(56, 98, 0.8, C.green),
    mini(34, 106, C.orange), mini(48, 106, C.green, true), mini(62, 106, C.purple), line('M38 108 L44 108 M52 108 L58 108', C.skin, 2.2), heart(76, 74, 0.6), frame(4, 4, 112, 108, C.green)),
  // the same town in grey: smoke, a watching camera and people in one long identical row
  'litg.dystopi': all(rect(4, 4, 112, 108, '#9aa0a8', 3, null), cloud(30, 20, 1.3, '#5e636b'), cloud(86, 16, 1.1, '#5e636b'), ground(), rect(4, 96, 112, 16, '#6c7178', 0, null),
    houseB(12, 96, 18, 58, '#7b8088', '#cfd3d8'), houseB(64, 96, 20, 66, '#7b8088', '#cfd3d8'), houseB(90, 96, 18, 50, '#7b8088', '#cfd3d8'), rect(44, 56, 6, 40, '#5e636b', 0, C.ink, 1), path('M42 52 C40 44 50 42 48 34', 'none', '#5e636b', 4),
    ...[30, 44, 58, 72, 86].map((x) => mini(x, 106, '#4b5058')), at(100, 32, 1, rect(-8, -4, 14, 8, C.dark, 2, C.ink, 1.2), circle(-8, 0, 3, C.red, C.ink, 1), line('M6 0 L12 -4', C.dark, 2)), frame(4, 4, 112, 108, C.dark)),
};

// ── 4344 Fantasy ─────────────────────────────────────────────────────
const M4: Record<string, Svg> = {
  // a book cover: a castle on a hill with a dragon in the sky
  'litg.fantasy': all(cover(60, 60, 64, 86, '#3d5a3a', path('M30 102 C40 84 80 84 90 102 Z', '#2c4329', null), castle(60, 90, 0.9, C.grey2), dragon(66, 42, 0.62, C.red), sparks(40, 36, 0.8))),
  // things float in a glowing light between two open hands
  'litg.magi': all(ground(), path('M24 98 C30 92 40 92 46 96 L50 104 L22 104 Z', C.skin, C.ink, 1.4), path('M96 98 C90 92 80 92 74 96 L70 104 L98 104 Z', C.skin, C.ink, 1.4),
    circle(60, 56, 30, 'rgba(199,179,230,0.45)', null), waBob('lg-magi-1', 4, at(48, 50, 1, path('M-7 -6 L7 -6 L6 6 C6 9 -6 9 -6 6 Z', C.white, C.ink, 1.4))), waBob('lg-magi-2', 3, cover(72, 46, 12, 15, C.red)), waBob('lg-magi-3', 5, ellipse(60, 70, 7, 5, C.grey, C.ink, 1.4)),
    sparks(36, 34, 1), sparks(86, 76, 0.9), sparkle(60, 28, 4), line('M36 90 C40 80 44 76 48 72 M84 90 C80 80 76 76 72 72', C.purple, 1.6, '3 3')),
  // an old man with a long beard, a starry pointed hat and a staff
  'litg.trollkarl': all(ground(), path('M42 112 L48 60 L72 60 L78 112 Z', C.purple, C.ink, 1.8), star5(54, 88, 3, C.yellow), star5(66, 100, 2.4, C.yellow),
    circle(60, 48, 11, C.skin, C.ink, 1.6), path('M50 52 C52 74 68 74 70 52 C66 56 54 56 50 52 Z', C.white, C.ink, 1.4), circle(56, 46, 1.2, C.ink, null), circle(64, 46, 1.2, C.ink, null),
    path('M46 40 L74 40 L60 6 Z', C.purple, C.ink, 1.6), ellipse(60, 40, 18, 4, C.purple, C.ink, 1.4), star5(60, 24, 3.4, C.yellow), star5(66, 32, 2, C.yellow),
    line('M88 112 L88 44', C.brown, 3), circle(88, 42, 5, C.sky, C.ink, 1.4), line('M76 70 L86 68', C.purple, 6), sparkle(98, 34, 4)),
  // a witch on a broom flies across the moon
  'litg.häxa': all(rect(4, 4, 112, 108, '#2d3550', 3, null), circle(74, 46, 30, '#f6e7b4', null), pine(14, 112, 1.2, '#1f2a3a'), pine(106, 112, 1, '#1f2a3a'),
    waBob('lg-haxa', 3, line('M30 72 L92 60', C.brown, 3), path('M86 56 L104 50 L104 64 L88 64 Z', C.tan, C.ink, 1.2),
      path('M52 70 L58 50 L70 50 L72 66 Z', C.black, C.ink, 1.4), circle(62, 42, 7, C.skin, C.ink, 1.4), path('M52 38 L72 38 L62 14 Z', C.black, C.ink, 1.4), ellipse(62, 38, 13, 3, C.black, C.ink, 1.2),
      path('M56 40 C52 48 54 54 56 54 M68 40 C72 48 70 54 68 54', 'none', C.hair, 2), line('M66 52 L78 62', C.skin, 3))),
  // the wand turns the prince into a frog (motion: the frog appears, the sparks pulse)
  'litg.förtrolla': all(ground(), at(-2, 0, 1, figure({ x: 22, h: 0.72, top: C.purple, hairStyle: 'long' })), wand(32, 66, 50, 52),
    greyed(figure({ x: 70, h: 0.6, top: C.red }), crown(70, 72, 0.9)), waPulse('lg-fort-s', sparks(66, 50, 1.2)),
    arrow(78, 90, 92, 98, HL, 2.4), waGrow('lg-fort-f', at(102, 104, 1, ellipse(0, 0, 10, 6, C.green, C.ink, 1.4), circle(-5, -6, 3, C.green, C.ink, 1.2), circle(5, -6, 3, C.green, C.ink, 1.2), circle(-5, -6, 1, C.ink, null), circle(5, -6, 1, C.ink, null), crown(0, -12, 0.6)))),
  // a dragon with wings breathes fire
  'litg.drake.2': all(ground(), dragon(52, 78, 1.6, C.green), fire(90, 50, 1.1), sparkle(108, 44, 3)),
  // a big troll with a long nose and a tail, by a mossy stone in the forest
  'litg.troll': all(ground(), pine(14, 112, 1.4, C.green), pine(104, 112, 1.2, C.green), ellipse(92, 104, 16, 9, C.grey, C.ink, 1.4), path('M80 100 C86 96 98 96 104 100', 'none', C.green, 3),
    at(54, 0, 1, path('M-18 112 L-14 72 C-14 58 14 58 14 72 L18 112 Z', '#8a7a5c', C.ink, 1.8), circle(0, 52, 14, '#a39270', C.ink, 1.6), path('M2 52 C10 52 18 58 14 64 C10 62 6 60 2 58 Z', '#a39270', C.ink, 1.4),
      path('M-12 42 C-16 30 -4 32 -2 40 M2 40 C6 30 16 34 12 42', 'none', C.hair, 3), circle(-5, 48, 1.6, C.ink, null), circle(5, 48, 1.6, C.ink, null), path('M-6 60 L4 60', 'none', C.ink, 1.4),
      path('M14 100 C26 102 30 92 26 86', 'none', '#8a7a5c', 3), circle(26, 85, 3, C.hair, null), line('M-14 76 L-24 92 M14 76 L22 92', '#8a7a5c', 5))),
  // a slender figure with pointed ears and a bow among the trees
  'litg.alv.2': all(ground(), tree(16, 112, 1.6, C.green), tree(104, 112, 1.4, C.green),
    figure({ x: 60, h: 0.95, top: C.mint, bottom: C.green, hairStyle: 'long', hair: '#f0cf6b' }), path('M48 46 L44 38 L50 44 Z M72 46 L76 38 L70 44 Z', C.skin, C.ink, 1.2),
    path('M84 40 C96 56 96 76 84 92', 'none', C.brown, 2.4), line('M84 40 L84 92', C.grey, 1), ring(60, 44, 18)),
  // the villain in a black cloak grins in front of his dark tower
  'litg.skurk.2': all(rect(4, 4, 112, 108, '#e8e0f0', 3, null), rect(84, 16, 20, 96, C.dark, 1, C.ink, 1.4), path('M82 16 L106 16 L94 4 Z', C.black, C.ink, 1.2), rect(90, 30, 6, 8, C.red, 1, null), ground(),
    path('M30 112 L38 52 L62 52 L70 112 Z', C.black, C.ink, 1.8), path('M36 54 L30 40 L42 50 Z M64 54 L70 40 L58 50 Z', C.red, C.ink, 1.2), circle(50, 42, 10, '#d9c7b8', C.ink, 1.6),
    line('M44 38 L48 40 M56 38 L52 40', C.ink, 1.4), path('M44 46 Q50 51 56 46', 'none', C.ink, 1.4), path('M40 34 C44 28 56 28 60 34 C56 32 44 32 40 34 Z', C.black, null),
    greyed(figure({ x: 18, h: 0.5, top: C.sky })), ring(50, 44, 15)),
  // an old seer reads a glowing scroll: a child with a crown appears above
  'litg.profetia': all(ground(), path('M22 112 L28 66 L52 66 L58 112 Z', C.navy, C.ink, 1.6), circle(40, 56, 10, C.skin, C.ink, 1.4), path('M30 50 C30 36 50 36 50 50 L52 70 L28 70 Z', C.navy, C.ink, 1.4), circle(40, 56, 8.6, C.skin, null), circle(37, 56, 1, C.ink, null), circle(43, 56, 1, C.ink, null),
    rect(54, 74, 30, 22, '#f6e7b4', 3, C.ink, 1.4), line('M58 80 L80 80 M58 85 L78 85 M58 90 L74 90', C.brown, 1.2), circle(69, 85, 22, 'rgba(242,193,78,0.25)', null), line('M48 80 L56 82', C.skin, 3.4),
    thought(86, 30, 44, all(mini(86, 34, C.red), crown(86, 22, 0.8), sparkle(72, 28, 3), sparkle(100, 28, 3)), true)),
  // a knight in light and a dark knight cross swords; sun on one side, storm cloud on the other
  'litg.kampen-mellan-gott-och-ont': all(rect(4, 4, 56, 108, '#fff4cf', 3, null), rect(60, 4, 56, 108, '#4a4f5a', 3, null), sun(22, 22, 8), cloud(96, 20, 1.1, '#2d3038'), ground(),
    figure({ x: 34, h: 0.82, top: C.white, bottom: C.sky }), figure({ x: 86, h: 0.82, top: C.black, bottom: C.dark }), path('M78 44 L94 44 L92 34 C90 30 80 30 78 34 Z', C.black, null),
    line('M44 70 L70 38', C.silver, 3.4), line('M76 70 L50 38', C.silver, 3.4), sparkle(60, 46, 6, C.gold), line('M40 74 L46 68 M80 74 L74 68', C.ink, 3)),
  // three books whose spines carry one picture together: 1, 2, 3
  'litg.trilogi': all(ground(), ...[0, 1, 2].map((i) => all(rect(24 + i * 26, 22, 24, 88, [C.navy, C.denim, C.navy][i]!, 2, C.ink, 1.8), T(36 + i * 26, 100, String(i + 1), 12, C.white, 900))),
    path('M24 70 L40 46 L52 60 L64 36 L80 58 L88 48 L98 62', 'none', C.white, 2.4), circle(88, 34, 5, C.yellow, null), frame(20, 18, 82, 96)),
};

// ── 4345 Historiska romaner ──────────────────────────────────────────
const M5: Record<string, Svg> = {
  // a book cover with an old sailing ship; the arrow of time points back
  'litg.historisk-roman': all(cover(54, 62, 60, 80, '#8a5a3a', rect(32, 32, 44, 44, '#f1e2c2', 2, C.ink, 1.2), ship(54, 62, 0.9), line('M34 68 C44 64 64 72 74 66', '#5aa7d6', 1.6)),
    arrow(116, 30, 92, 30, HL, 2.6), rect(90, 40, 26, 14, C.white, 2, C.ink, 1.2), T(103, 50, '1850', 8, C.ink, 800)),
  // a timeline where one long stretch is marked, with its ship above it
  'litg.epok': all(line('M8 74 L112 74', C.ink, 2.4), arrow(104, 74, 114, 74, C.ink, 2.4), ...[18, 34, 50, 66, 82, 98].map((x) => line(`M${x} 70 L${x} 78`, C.ink, 1.6)),
    rect(34, 66, 48, 16, OR, 3, HL, 2.6), ship(58, 56, 0.9, C.brown), greyed(castle(20, 58, 0.5), rocket(98, 52, 0.7)), path('M34 90 L34 98 L82 98 L82 90', 'none', HL, 2.4)),
  // an 1800s room drawn right in every detail: a candle, a long dress, a quill (green tick)
  'litg.tidstrogen': all(ground(), rect(10, 10, 100, 102, '#f1e2c2', 3, C.ink, 1.4), rect(70, 24, 26, 30, '#bfe3f5', 1, C.ink, 1.4), line('M83 24 L83 54 M70 39 L96 39', C.brown, 2),
    figure({ x: 40, h: 0.85, top: '#6b4a7a', bottom: '#6b4a7a' }), path('M26 112 L30 74 L50 74 L54 112 Z', '#6b4a7a', C.ink, 1.6), rect(72, 82, 30, 4, C.brown, 1, C.ink, 1.2), line('M76 86 L76 112 M98 86 L98 112', C.brown, 2.4),
    rect(84, 72, 4, 10, C.white, 1, C.ink, 1), path('M86 64 C84 68 88 70 86 72', C.orange, null), g('rotate(-25 94 76)', path('M93 64 C96 70 96 76 94 80 L93 80 C92 74 91 70 93 64 Z', C.white, C.ink, 1)),
    circle(98, 18, 9, C.green, C.ink, 1.4), check(98, 18, C.white)),
  // a portrait of a real king in a gold frame, with his years under it
  'litg.historisk-person': all(rect(26, 8, 68, 82, C.gold, 3, C.ink, 2), rect(32, 14, 56, 70, '#5a4632', 2, C.ink, 1.2),
    path('M40 84 C40 66 80 66 80 84 Z', C.red, C.ink, 1.4), circle(60, 50, 12, C.skin, C.ink, 1.4), path('M50 54 C52 68 68 68 70 54 C66 58 54 58 50 54 Z', C.hair, C.ink, 1.2), crown(60, 34, 1.3), circle(56, 48, 1, C.ink, null), circle(64, 48, 1, C.ink, null),
    rect(30, 94, 60, 14, C.white, 2, C.ink, 1.2), T(60, 104, '1496–1560', 8, C.ink, 800)),
  // a family tree with four generations grows out of a book
  'litg.släktkrönika': all(openBook(60, 100, 1.4), line('M60 86 L60 70 M60 70 L32 62 M60 70 L88 62 M32 62 L32 50 M88 62 L88 50 M32 50 L20 40 M32 50 L44 40 M88 50 L76 40 M88 50 L100 40', C.brown, 2.4),
    mini(60, 70, C.grey), mini(32, 56, C.purple), mini(88, 56, C.navy, true), mini(20, 36, C.green), mini(44, 36, C.orange, true), mini(76, 36, C.red), mini(100, 36, C.denim, true),
    mini(50, 16, C.pink), mini(70, 16, C.yellow, true), line('M44 30 L50 22 M76 30 L70 22', C.brown, 1.6), line('M110 16 L110 76', HL, 2.4), arrow(110, 70, 110, 80, HL, 2.4)),
  // people of one era under one shared thought: factory, train and the light bulb (year tag)
  'litg.tidsanda': all(rect(4, 4, 112, 108, '#f1e2c2', 3, null), ground(),
    figure({ x: 26, h: 0.6, top: C.dark, bottom: C.dark }), path('M18 50 L34 50 L32 42 L20 42 Z', C.black, C.ink, 1), figure({ x: 60, h: 0.6, top: '#6b4a7a', hairStyle: 'long' }), figure({ x: 94, h: 0.6, top: C.brown, bottom: C.dark }), path('M86 50 L102 50 L100 42 L88 42 Z', C.black, C.ink, 1),
    ellipse(60, 22, 48, 16, C.white, C.ink, 1.6), circle(28, 44, 2.6, C.white, C.ink, 1), circle(60, 44, 2.6, C.white, C.ink, 1), circle(92, 44, 2.6, C.white, C.ink, 1),
    rect(32, 18, 14, 10, C.grey, 1, C.ink, 1), rect(40, 10, 4, 8, C.grey, 0, C.ink, 1), path('M42 8 C40 4 46 4 44 0', 'none', C.grey, 1.6), circle(62, 22, 6, C.yellow, C.ink, 1.2), rect(59, 28, 6, 4, C.grey, 1, null),
    rect(76, 18, 18, 8, C.red, 2, C.ink, 1), circle(80, 28, 2, C.dark, null), circle(90, 28, 2, C.dark, null), rect(96, 96, 18, 12, C.white, 1, C.ink, 1), T(105, 105, '1900', 6, C.ink, 800), frame(4, 4, 112, 108)),
};

// ── 4346 Barn- och ungdomslitteratur ─────────────────────────────────
const M6: Record<string, Svg> = {
  // a wide open book with one big picture per page and one short line; a small child points at the dog
  'litg.bilderbok': all(ground(), path('M60 30 L8 24 L8 88 L60 94 Z', PAGE, C.ink, 1.8), path('M60 30 L112 24 L112 88 L60 94 Z', PAGE, C.ink, 1.8),
    at(32, 58, 1.1, ellipse(0, 4, 12, 8, C.tan, C.ink, 1.4), circle(10, -4, 6, C.tan, C.ink, 1.4), path('M12 -9 L16 -14 L15 -5 Z', C.brown, null), circle(11, -5, 1, C.ink, null), line('M-8 10 L-8 16 M6 10 L6 16', C.tan, 3)), line('M18 80 L44 82', C.navy, 2),
    sun(86, 46, 9), path('M68 74 C80 66 94 66 106 74 L106 84 L68 84 Z', C.mint, null), line('M72 80 L96 78', C.navy, 2), mini(60, 108, C.yellow)),
  // a book of fairy tales: a castle, a princess and a troll come out of it
  'litg.saga': all(openBook(60, 92, 2, false), castle(40, 80, 0.8, C.lilac), crown(70, 52, 1), circle(70, 62, 6, C.skin, C.ink, 1.2), path('M64 66 L76 66 L80 84 L60 84 Z', C.pink, C.ink, 1.2),
    at(92, 66, 0.55, path('M-18 50 L-14 10 C-14 -4 14 -4 14 10 L18 50 Z', '#8a7a5c', C.ink, 1.8), circle(0, -8, 14, '#a39270', C.ink, 1.6), path('M2 -8 C10 -8 18 -2 14 4 C10 2 6 0 2 -2 Z', '#a39270', C.ink, 1.4)),
    sparks(26, 30, 1), star5(98, 22, 4), star5(54, 24, 3), moon(84, 28, 6)),
  // she draws the rabbit that is on the cover of the finished book
  'litg.illustratör': all(ground(), rect(8, 74, 104, 6, C.tan, 2, C.ink, 1.6), line('M14 80 L14 112 M106 80 L106 112', C.brown, 3),
    figure({ x: 28, h: 0.7, top: C.green, hairStyle: 'long' }), sheet(46, 44, 34, 30, at(63, 62, 1, ellipse(0, 4, 7, 6, C.white, C.ink, 1.2), ellipse(-3, -8, 2, 6, C.white, C.ink, 1), ellipse(3, -8, 2, 6, C.white, C.ink, 1), circle(0, -1, 4, C.white, C.ink, 1))),
    line('M38 66 L56 60', C.skin, 4), g('rotate(30 58 58)', rect(56, 46, 3, 14, C.yellow, 1, C.ink, 1)), ring(63, 58, 20),
    cover(96, 56, 22, 30, C.sky, at(96, 58, 0.8, ellipse(0, 4, 7, 6, C.white, C.ink, 1.2), ellipse(-3, -8, 2, 6, C.white, C.ink, 1), ellipse(3, -8, 2, 6, C.white, C.ink, 1), circle(0, -1, 4, C.white, C.ink, 1)))),
  // a schoolchild reads alone in a thin book with short numbered chapters
  'litg.kapitelbok': all(ground(), figure({ x: 34, h: 0.62, top: C.yellow, hairStyle: 'long' }), line('M44 82 L56 76', C.skin, 3.6),
    at(78, 64, 1.5, path('M0 -14 C-8 -17 -16 -16 -20 -13 L-20 12 C-16 10 -8 10 0 13 Z', PAGE, C.ink, 1.4), path('M0 -14 C8 -17 16 -16 20 -13 L20 12 C16 10 8 10 0 13 Z', PAGE, C.ink, 1.4)),
    T(58, 52, '1', 9, HL, 900), line('M54 58 L72 57 M54 63 L70 62', C.grey2, 1.4), T(84, 52, '2', 9, HL, 900), line('M80 58 L98 59 M80 63 L94 64', C.grey2, 1.4), at(74, 78, 0.5, circle(0, 0, 8, C.yellow, C.ink, 1.4)),
    line('M100 42 L100 40', C.grey, 1)),
  // a comic: three panels with people and speech bubbles
  'litg.serie.3': all(rect(4, 26, 112, 64, C.white, 2, C.ink, 1.8), line('M41 26 L41 90 M79 26 L79 90', C.ink, 1.8),
    mini(22, 76, C.red), bubble(24, 42, 26, line('M15 41 L31 41', C.navy, 1.4), true), mini(54, 76, C.red), mini(68, 78, C.green, true), bubble(64, 42, 22, qmark(64, 46, 9), false),
    mini(98, 76, C.red), mini(108, 78, C.green, true), heart(102, 44, 0.7), frame(2, 22, 116, 72)),
  // a child sits on a tall pile of finished books, already deep in the next one
  'litg.bokslukare': all(ground(), ...[0, 1, 2, 3, 4, 5].map((i) => rect(30 + (i % 2) * 4, 100 - i * 9, 48, 9, [C.red, C.navy, C.green, C.yellow, C.purple, C.denim][i]!, 1.5, C.ink, 1.2)),
    at(56, 46, 1, path('M-10 0 L-10 -16 C-10 -22 6 -22 6 -16 L6 0 Z', C.orange, C.ink, 1.4), circle(-2, -26, 7, C.skin, C.ink, 1.4), path('M-9 -28 C-9 -36 5 -36 5 -28 Z', C.hair, null), line('M-8 0 L-12 8 M4 0 L10 8', C.navy, 3)),
    handBook(66, 30, C.pink, 0.9), cover(92, 104, 12, 16, C.green), cover(102, 106, 12, 16, C.red), cover(18, 104, 12, 16, C.navy), line('M86 92 L94 86 M14 92 L20 86', C.grey, 1.4), sparkle(84, 24, 4)),
  // the age band on the back of a book matches the child who reads it
  'litg.läsålder': all(ground(), cover(36, 56, 44, 60, C.sky, rect(22, 38, 28, 22, C.white, 2, C.ink, 1), rect(20, 70, 32, 12, OR, 3, HL, 2), T(36, 79, '6–9', 9, C.ink, 900)),
    figure({ x: 90, h: 0.62, top: C.green }), line('M110 112 L110 50', C.ink, 1.6), ...[60, 70, 80, 90, 100].map((y) => line(`M106 ${y} L110 ${y}`, C.ink, 1.2)), line('M52 76 L80 70', HL, 1.6, '3 3')),
  // a teenager with headphones and a hoodie reads a book with a heart on the cover
  'litg.ungdomsbok': all(ground(), figure({ x: 50, h: 0.92, top: C.purple, bottom: C.denim }), path('M38 30 C36 12 64 12 62 30', 'none', C.dark, 3), rect(35, 28, 6, 10, C.dark, 2, null), rect(59, 28, 6, 10, C.dark, 2, null),
    path('M36 56 C40 46 60 46 64 56', 'none', C.purple, 4), line('M64 74 L74 70', C.skin, 4.4), cover(84, 66, 22, 30, C.pink, heart(84, 64, 0.6)), phone(104, 96)),
  // the same person grows from a child to a teenager to a grown-up (motion: each step appears in turn)
  'litg.uppväxtskildring': all(ground(), figure({ x: 20, h: 0.5, top: C.yellow }),
    moving('lg-uppv-2', '0%,25%{opacity:.15}45%,100%{opacity:1}', { dur: 3.2 }, figure({ x: 56, h: 0.75, top: C.green })),
    moving('lg-uppv-3', '0%,55%{opacity:.15}75%,100%{opacity:1}', { dur: 3.2 }, figure({ x: 94, h: 1.0, top: C.denim })),
    arrow(30, 22, 46, 22, HL, 2.4), arrow(66, 14, 82, 14, HL, 2.4), path('M8 112 L112 112', 'none', C.grey2, 2), frame(4, 4, 112, 108)),
};
function phone(x: number, y: number) { return g(`translate(${x} ${y})`, rect(-5, -9, 10, 18, C.dark, 2, C.ink, 1.2), rect(-4, -7, 8, 12, '#bfe3f5', 1, null)); }

// ── 4347 Lyrik och poesi ─────────────────────────────────────────────
const poemSheet = (mark: 'none' | 'line' | 'stanza') => all(sheet(30, 8, 60, 104, verse(38, 20, [30, 40, 24, 36], 7), verse(38, 56, [36, 26, 42, 30], 7), verse(38, 92, [28, 38], 7)),
  mark === 'line' ? all(rect(34, 59, 46, 8, OR, 2, null), verse(38, 63, [26], 7), rect(32, 57, 50, 12, 'none', 3, HL, 2.4)) : '',
  mark === 'stanza' ? all(rect(34, 50, 48, 30, OR, 3, null), verse(38, 56, [36, 26, 42, 30], 7), path('M26 50 L22 50 L22 80 L26 80', 'none', HL, 2.6), rect(32, 48, 52, 34, 'none', 3, HL, 2.4)) : '');
const M7: Record<string, Svg> = {
  // the poetry shelf: thin books with short lines, a moon and a heart
  'litg.lyrik': all(rect(8, 70, 104, 6, C.brown, 1, C.ink, 1.6), ...[0, 1, 2, 3, 4, 5, 6].map((i) => spine(14 + i * 9, 70, 6, 30 - (i % 3) * 4, [C.lilac, C.rose, C.mint, C.lilac, C.sky, C.rose, C.mint][i]!)),
    openBook(88, 46, 1.2, false), verse(64, 36, [12, 16, 10, 14], 4.4, C.navy, 1.2), verse(92, 36, [14, 10, 16, 12], 4.4, C.navy, 1.2), moon(98, 16, 6), heart(76, 18, 0.5), frame(6, 6, 108, 72), ground()),
  // a reader with a poem: words float up as music, a heart and stars
  'litg.poesi': all(ground(), P({ x: 36, h: 0.85, top: C.lilac, hairStyle: 'long', mood: 'calm' }), sheet(48, 58, 22, 28, verse(51, 64, [12, 16, 10, 14], 4, C.navy, 1.2)), line('M46 72 L50 70', C.skin, 4),
    line('M64 54 C70 40 80 36 92 30', C.purple, 1.6, '3 3'), note(78, 40, 0.8, C.purple), heart(96, 26, 0.6), star5(104, 44, 4, C.yellow), sparkle(86, 18, 4), sparkle(110, 20, 3)),
  // one sheet with a short poem in lines of different lengths, and a quill
  'litg.dikt': all(sheet(28, 12, 64, 92, verse(38, 28, [34, 44, 26, 38], 8), verse(38, 70, [40, 30, 44], 8)), g('rotate(25 96 70)', path('M94 40 C102 52 102 66 98 78 L96 78 C94 66 92 52 94 40 Z', C.white, C.ink, 1.2), line('M96 50 L97 78', C.grey, 1))),
  // a person writes with a quill at night and looks up at the moon; crumpled drafts on the floor
  'litg.poet': all(rect(70, 8, 42, 36, '#20304f', 2, C.ink, 1.4), moon(92, 22, 7), star5(78, 34, 2, C.white), star5(104, 36, 2, C.white), ground(),
    rect(26, 76, 72, 6, C.brown, 2, C.ink, 1.6), line('M32 82 L32 112 M92 82 L92 112', C.brown, 3), figure({ x: 28, h: 0.78, top: C.navy, hairStyle: 'long' }), sheet(48, 68, 26, 8), line('M50 72 L70 72', C.navy, 1),
    line('M38 74 L58 70', C.skin, 4), g('rotate(30 62 66)', path('M61 52 C66 58 66 66 63 72 L62 72 C60 66 59 58 61 52 Z', C.white, C.ink, 1)), line('M36 50 C44 40 60 34 70 30', C.grey, 1.4, '3 3'),
    circle(70, 106, 5, PAGE, C.ink, 1.2), circle(84, 108, 4, PAGE, C.ink, 1.2), line('M68 104 L72 108 M82 106 L86 110', C.grey, 1)),
  // a thin book with many separate poems fanning out of it
  'litg.diktsamling': all(cover(40, 70, 40, 54, C.lilac, verse(28, 56, [16, 22, 12], 5, C.navy, 1.4), heart(40, 84, 0.5)),
    ...[[78, 26, -12], [90, 50, 0], [84, 78, 12]].map(([x, y, r]) => g(`rotate(${r} ${x} ${y})`, sheet(x! - 12, y! - 14, 24, 28, verse(x! - 8, y! - 8, [12, 16, 10, 14], 4.4, C.navy, 1.2)))),
    line('M60 60 C66 50 68 40 70 36 M60 70 L76 62 M60 80 L72 86', HL, 1.6, '3 3')),
  // a poem: one single line is marked
  'litg.vers.3': poemSheet('line'),
  // the same poem: one group of four lines is marked
  'litg.strof': poemSheet('stanza'),
  // hus and mus: the endings are the same sound (motion: the link between them)
  'litg.rimma': all(ground(), at(28, 86, 1.6, path('M-12 0 L-12 -14 L0 -24 L12 -14 L12 0 Z', C.red, C.ink, 1.6), rect(-4, -9, 8, 9, C.brown, 1, C.ink, 1.2)),
    at(92, 98, 1.5, ellipse(0, 0, 10, 6, C.grey, C.ink, 1.4), circle(9, -3, 4, C.grey, C.ink, 1.2), circle(7, -7, 2.4, C.rose, C.ink, 1), path('M-10 0 C-16 2 -18 -4 -14 -8', 'none', C.ink, 1.2)),
    rect(10, 22, 36, 18, C.white, 3, C.ink, 1.4), T(23, 35, 'h', 11, C.grey, 800), T(36, 35, 'us', 11, HL, 900), rect(74, 22, 36, 18, C.white, 3, C.ink, 1.4), T(87, 35, 'm', 11, C.grey, 800), T(100, 35, 'us', 11, HL, 900),
    waPulse('lg-rim', path('M36 20 C44 4 92 4 100 20', 'none', HL, 2.6), note(64, 14, 0.7, HL))),
  // a tall paper strip with three lines of dots, 5 – 7 – 5, by a pond with a frog
  'litg.haiku': all(rect(14, 6, 44, 104, PAGE, 2, C.ink, 1.6), ...[[46, 5], [36, 7], [26, 5]].map(([x, n]) => all(...Array.from({ length: n! }, (_, i) => circle(x!, 16 + i * 11, 2.6, C.ink, null)), T(x!, 104, String(n), 9, HL, 900))),
    ellipse(88, 98, 26, 8, '#8cc7e8', C.ink, 1.4), path('M72 96 C80 92 96 92 104 96', 'none', C.white, 1.2),
    at(86, 92, 1, ellipse(0, 0, 8, 5, C.green, C.ink, 1.2), circle(-4, -5, 2.4, C.green, C.ink, 1), circle(4, -5, 2.4, C.green, C.ink, 1)), path('M70 40 C76 30 84 30 90 36', 'none', C.brown, 2), circle(72, 36, 3.4, C.pink, null), circle(82, 30, 3.4, C.pink, null), circle(90, 36, 3.4, C.pink, null)),
  // a poet at a lectern reads to a seated audience (motion: the voice goes out)
  'litg.uppläsning': all(ground(), rect(4, 96, 60, 16, C.brown, 1, C.ink, 1.4), g('translate(0 -16)', figure({ x: 24, h: 0.62, top: C.purple, hairStyle: 'long' })), path('M38 96 L52 96 L50 66 L40 66 Z', C.tan, C.ink, 1.4), path('M36 66 L54 62', 'none', C.ink, 2),
    handBook(45, 60, C.lilac, 0.6), waPulse('lg-uppl', wave3(58, 52)),
    ...[[80, 104, C.green, false], [96, 104, C.orange, true], [112, 104, C.denim, false], [88, 88, C.red, true], [104, 88, C.pink, false]].map(([x, y, c, l]) => mini(x as number, y as number, c as string, l as boolean))),
  // the poem turns into a melody (motion: the notes travel from the page to the staff)
  'litg.tonsätta': all(sheet(8, 30, 34, 50, verse(13, 40, [22, 16, 24, 18], 6, C.navy, 1.4), verse(13, 66, [20, 24], 6, C.navy, 1.4)), arrow(46, 56, 60, 56, HL, 2.6),
    line('M64 40 L114 40 M64 48 L114 48 M64 56 L114 56 M64 64 L114 64 M64 72 L114 72', C.ink, 1.2),
    waIn('lg-tons-1', -30, 0, note(74, 58, 0.8)), moving('lg-tons-2', '0%,20%{transform:translate(-40px,0);opacity:.1}70%,100%{transform:translate(0,0);opacity:1}', { dur: 2.6 }, note(90, 50, 0.8)),
    moving('lg-tons-3', '0%,35%{transform:translate(-50px,0);opacity:.1}85%,100%{transform:translate(0,0);opacity:1}', { dur: 2.6 }, note(106, 62, 0.8)), mini(90, 104, C.green, true), line('M98 96 C104 90 108 86 110 80', C.purple, 1.4, '3 3')),
};

export const LITG_MOTIFS: Record<string, Svg> = { ...M1, ...M2, ...M3, ...M4, ...M5, ...M6, ...M7 };
