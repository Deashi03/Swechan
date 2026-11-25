/**
 * Kultur & fritid → Språk & litteratur → Berättande & texttyper, 4331–4337 (0.61): the structure of a story,
 * descriptions of setting and people, dialogue in text, non-fiction and reportage, columns and essays,
 * instructions and manuals, and reviews.
 * Recurring signs: the part that the word names is orange (or framed or ringed in orange); grey things show what the
 * word is not. Books are blue or green with white pages and grey text lines; speech is a white bubble; a story arc is
 * a grey curve that rises to a peak and falls again. Words that are easy to mix up get clearly different scenes:
 * berättelse (a grandmother tells a child a three-picture story), handling (a chain of events rising out of an open
 * book), klimax (the peak of the arc bursts), upplösning (the question marks of the arc end in a tick and an open
 * padlock), lyckligt slut (the last page: two people, a heart and the sun), öppet slut (the path out of the book forks
 * into fog with a question mark); karaktär (three different characters stand on a book) and huvudperson (one person in
 * the spotlight, the others grey); dialog (two people talk out of a book), replik (one line of an actor is ringed),
 * monolog (one person alone on a stage with a long bubble), talstreck (the dashes at the start of each line),
 * direkt tal (the same signs between quotation marks) and indirekt tal (a third person passes the words on, with
 * "att"); sakprosa (the facts shelf, not the fantasy shelf), biografi (a writer and another person's life line);
 * jagform (the writer's own face starts every line), slutkläm (the last line of a column bursts); slutligen (step 4 of
 * 4), numrera (digits appear beside a list), följa (someone does what the
 * card shows); läsvärd (a book with a medal) and sevärd (a screen with a medal).
 * Digits, code signs and a few short Swedish example words that are not the target word; no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, heart, line, moving, path, rect, sparkle, star, waGrow, waIn, waPulse, waShake, type Svg } from './kit';
import { HL, T, cat } from './people';
import { figure } from './figures';
import { P, greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const PAPER = '#fffdf6';
const TXT = '#c3c8cf';
const BLUEB = '#3f6fb5';
const GREENB = '#4f9d69';
const NIGHT = '#24345a';
const GOLD = '#e0b23c';
const TEAR = '#5aa9e6';
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const f1 = (n: number) => +n.toFixed(1);
const bg = (col: string = '#f4f0e8') => rect(0, 0, 120, 120, col, 0, null);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 5, col, 2.6);
const tick = (x: number, y: number, s = 1, col: string = C.green) => line(`M${x - 4 * s} ${y} L${x - 1 * s} ${y + 3 * s} L${x + 5 * s} ${y - 4 * s}`, col, 2.6);
/** Left-aligned text. */
const TL = (x: number, y: number, s: string, size: number, fill: string = C.ink, w = 700) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="${w}" font-size="${size}" fill="${fill}">${s}</text>`;
/** n grey text lines, the last one shorter. */
const lines = (x: number, y: number, w: number, n: number, gap = 5, col: string = TXT, sw = 2) =>
  all(...range(n).map((i) => line(`M${x} ${y + i * gap} L${f1(x + (i === n - 1 && n > 1 ? w * 0.6 : w))} ${y + i * gap}`, col, sw)));
const sheet = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x, y, w, h, PAPER, 2, C.ink, 1.6), inner);
/** Open book: spine at (x, y), pages 42·s wide to each side and 40·s high above y. */
const openBook = (x: number, y: number, s = 1, left: Svg = '', right: Svg = '', cover: string = BLUEB) => g(`translate(${x} ${y}) scale(${s})`,
  path('M0 2 C-16 -2 -32 -2 -46 2 L-46 -38 C-32 -42 -16 -42 0 -38 C16 -42 32 -42 46 -38 L46 2 C32 -2 16 -2 0 2 Z', cover, C.ink, 1.8),
  path('M0 -2 C-14 -6 -30 -6 -42 -3 L-42 -40 C-30 -44 -14 -44 0 -40 Z', PAPER, C.ink, 1.6),
  path('M0 -2 C14 -6 30 -6 42 -3 L42 -40 C30 -44 14 -44 0 -40 Z', PAPER, C.ink, 1.6),
  left, right);
/** Closed book seen from the front. */
const book = (x: number, y: number, w: number, h: number, col: string, cover: Svg = '') => all(
  rect(x + 3, y + 3, w, h, '#e9e4d8', 2, C.ink, 1.4), rect(x, y, w, h, col, 2, C.ink, 1.8), line(`M${x + 5} ${y + 1} L${x + 5} ${y + h - 1}`, 'rgba(0,0,0,0.25)', 1.6), cover);
/** Speech bubble (x1,y1)–(x2,y2) with a tail to (tx, ty) from the bottom edge (or the top edge when ty < y1). */
function bub(x1: number, y1: number, x2: number, y2: number, tx: number, ty: number, fill: string = C.white, stroke: string = C.ink, inner: Svg = ''): Svg {
  const top = ty < y1, ey = top ? y1 : y2, ax = Math.min(Math.max(tx - 5, x1 + 4), x2 - 12);
  return all(rect(x1, y1, x2 - x1, y2 - y1, fill, 6, stroke, 1.6), path(`M${ax} ${ey} L${tx} ${ty} L${ax + 8} ${ey} Z`, fill, stroke, 1.6), line(`M${ax + 1.2} ${ey} L${ax + 6.8} ${ey}`, fill, 2.6), inner);
}
/** Small head (bust) for icons. */
const mhead = (x: number, y: number, r = 5, hair: string = C.hair, body: string = C.sky) => all(
  path(`M${x - r * 1.5} ${y + r * 2.6} C${x - r * 1.5} ${y + r} ${x + r * 1.5} ${y + r} ${x + r * 1.5} ${y + r * 2.6} Z`, body, C.ink, 1.2),
  circle(x, y, r, C.skin, C.ink, 1.2), path(`M${x - r} ${y - r * 0.2} C${x - r} ${y - r * 1.5} ${x + r} ${y - r * 1.5} ${x + r} ${y - r * 0.2} C${x + r * 0.5} ${y - r * 0.7} ${x - r * 0.5} ${y - r * 0.7} ${x - r} ${y - r * 0.2} Z`, hair, null));
/** A figure moved up or down (figures stand on y = 112). */
const at = (dy: number, ...k: Svg[]) => g(`translate(0 ${dy})`, ...k);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const stage = () => all(rect(0, 96, 120, 24, '#c99a62', 0, null), line('M0 96 L120 96', C.ink, 1.6), line('M0 104 L120 104 M0 112 L120 112', '#b0834f', 1));
const spot = (x: number, w: number) => path(`M${x - 6} 0 L${x + 6} 0 L${x + w} 104 L${x - w} 104 Z`, 'rgba(255,236,150,0.55)', null);
const qmark = (x: number, y: number, size = 16, col: string = C.grey) => T(x, y, '?', size, col, 900);
const tree = (x: number, y: number, s = 1, col = '#2f6b45') => g(`translate(${x} ${y}) scale(${s})`, rect(-1.5, -4, 3, 4, '#6b4a2b', 0, null), path('M0 -22 L8 -8 L4 -8 L10 0 L-10 0 L-4 -8 L-8 -8 Z', col, C.ink, 1));
const boat = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-8 0 L8 0 L5 4 L-5 4 Z', C.brown, C.ink, 1), line('M0 0 L0 -10', C.ink, 1), path('M0.5 -10 L6 -2 L0.5 -2 Z', C.white, C.ink, 0.9));
const goldMedal = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-6 4 L-10 18 L-4 15 L-1 20 L1 6 Z M6 4 L10 18 L4 15 L1 20 L-1 6 Z', C.red, C.ink, 1.1), circle(0, 0, 8, GOLD, C.ink, 1.4), star(0, 0, 4.4, '#fff1b8'));
const tear = (x: number, y: number, s = 1) => path(`M${x} ${y - 4 * s} C${x + 3 * s} ${y} ${x + 2.6 * s} ${y + 3.4 * s} ${x} ${y + 3.4 * s} C${x - 2.6 * s} ${y + 3.4 * s} ${x - 3 * s} ${y} ${x} ${y - 4 * s} Z`, TEAR, C.ink, 0.8);
/** Story arc: grey curve from bottom left to a peak at (72, 30) and down to the right. */
const ARC = 'M10 98 C30 94 50 76 66 40 C69 32 75 30 78 38 C86 60 96 78 112 84';
const arcBase = () => all(line('M8 104 L114 104', C.grey2, 1.6), line(ARC, C.grey, 3));
/** Coloured shape signs that stand for "the words someone said". */
const words3 = (x: number, y: number, s = 1, grey = false) => g(`translate(${x} ${y}) scale(${s})`,
  star(-9, 0, 4.4, grey ? C.grey2 : C.yellow), circle(0, 0, 3.4, grey ? C.grey : C.red, C.ink, 1.2), path('M6 3 L9.5 -3.5 L13 3 Z', grey ? C.grey2 : C.green, C.ink, 1.2));
const thumbDown = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`,
  path('M-9 -10 L2 -10 L2 10 L-9 10 Z', C.skin, C.ink, 1.4), path('M2 -9 L14 -9 C18 -9 18 -4 14 -4 C18 -4 18 1 14 1 C17 1 17 5 13 5 L8 5 C9 9 10 14 6 16 C3 17 3 13 2 10 Z', C.skin, C.ink, 1.4));
const screen = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x, y, w, h, C.dark, 3, C.ink, 1.8), rect(x + 3, y + 3, w - 6, h - 6, '#a9d7ef', 1, null), inner);
const wolf = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-14 0 L-12 -10 C-8 -14 4 -14 8 -10 L14 -14 L13 -8 L18 -6 L12 -3 L10 0 L7 0 L6 -5 L-6 -5 L-8 0 Z', '#8c8f99', C.ink, 1.2), path('M-14 -6 C-20 -6 -22 -2 -24 0', 'none', C.ink, 2.4), circle(12, -10, 0.9, C.ink, null));
const pen = (x: number, y: number, rot = 35, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-2.5, -18, 5, 16, C.navy, 1, C.ink, 1.2), path('M-2.5 -2 L2.5 -2 L0 4 Z', GOLD, C.ink, 1));
const desk = (y = 84) => all(rect(6, y, 108, 6, C.tan, 2, C.ink, 1.6), line(`M14 ${y + 6} L14 112 M106 ${y + 6} L106 112`, C.brown, 3));
const cup = (x: number, y: number, col: string = C.white) => all(path(`M${x - 5} ${y - 7} L${x + 5} ${y - 7} L${x + 4} ${y} L${x - 4} ${y} Z`, col, C.ink, 1.2), path(`M${x + 5} ${y - 5} C${x + 9} ${y - 5} ${x + 9} ${y - 1} ${x + 4} ${y - 1}`, 'none', C.ink, 1.2));
const newsPage = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x, y, w, h, '#f7f4ec', 1, C.ink, 1.6), inner);
const stars5 = (x: number, y: number, n: number, r = 5, gap = 12) => all(...range(5).map((i) => star(x + i * gap, y, r, i < n ? C.yellow : C.white)));

export const TTYPE_MOTIFS: Record<string, Svg> = {
  // ── 4331 Berättelsens struktur ──
  // berättelse: a grandmother tells a child a story; her bubble holds three pictures in a row (boat, storm, island)
  'ttype.berättelse': all(bg(), ground(),
    figure({ x: 22, h: 0.92, top: C.purple, hairStyle: 'long', hair: '#d9d9d9' }),
    P({ x: 98, h: 0.58, top: C.yellow, mood: 'smile' }),
    bub(32, 4, 116, 44, 26, 30, C.white, C.ink,
      all(rect(37, 10, 22, 26, '#d8eef9', 2, C.ink, 1), line('M37 30 Q42 27 47 30 Q52 33 59 30', TEAR, 1.4), boat(48, 27, 0.9),
        rect(63, 10, 22, 26, '#c9d2dc', 2, C.ink, 1), path('M66 18 C64 14 70 11 72 14 C74 10 82 12 81 17 Z', C.grey, C.ink, 0.9), path('M75 18 L71 24 L74 24 L72 29 L78 22 L75 22 Z', C.yellow, C.ink, 0.6), boat(70, 30, 0.8, -18),
        rect(89, 10, 22, 26, '#d8eef9', 2, C.ink, 1), path('M90 31 C94 24 104 24 110 31 Z', '#e8d39a', C.ink, 0.9), tree(100, 27, 0.5, GREENB), circle(106, 15, 3, C.yellow, C.ink, 0.8),
        arrow(59.5, 23, 62.5, 23, HL, 1.6), arrow(85.5, 23, 88.5, 23, HL, 1.6)))),
  // titel (namn på en bok): a book cover whose big title bar is ringed; the same bar on the spine of the book behind
  'ttype.titel.2': all(bg(), rect(70, 20, 16, 84, GREENB, 2, C.ink, 1.6), rect(73, 36, 10, 40, C.white, 1, C.ink, 1), line('M78 40 L78 72', HL, 3),
    book(24, 14, 52, 88, BLUEB, all(rect(32, 24, 38, 16, C.white, 2, C.ink, 1.2), line('M37 30 L65 30', HL, 4), line('M41 36 L61 36', HL, 2.4),
      circle(51, 66, 12, '#a9d7ef', C.ink, 1.2), path('M41 72 L48 62 L54 70 L58 66 L61 72 Z', GREENB, C.ink, 1), lines(36, 88, 30, 1, 5, '#cfd8e6', 1.6))),
    frame(28, 20, 46, 24)),
  // handling (i en berättelse): out of an open book rises a chain of events – meeting, quarrel, making up – along an arrow
  'ttype.handling.3': all(bg(), openBook(60, 110, 1, lines(-36, -34, 30, 6, 5), lines(6, -34, 30, 6, 5)),
    line('M30 66 C34 58 40 52 50 50', HL, 1.4, '3 3'),
    arrow(14, 52, 108, 14, HL, 2.6),
    circle(26, 46, 11, C.white, C.ink, 1.4), mhead(22, 44, 3.4, C.hair, C.orange), mhead(30, 44, 3.4, '#c4542a', C.green),
    circle(60, 32, 11, C.white, C.ink, 1.4), mhead(55, 31, 3.4, C.hair, C.orange), mhead(65, 31, 3.4, '#c4542a', C.green), path('M60 22 L57 28 L60 28 L58 33 L63 26 L60 26 Z', C.yellow, C.ink, 0.6),
    circle(94, 18, 11, C.white, C.ink, 1.4), mhead(91, 17, 3.4, C.hair, C.orange), mhead(97, 17, 3.4, '#c4542a', C.green), heart(94, 9.5, 2.4)),
  // spänning (spännande): a reader holds a dark book close, eyes wide, sweat drops, her heart beats outside her chest
  'ttype.spänning.2': all(bg(), ground(),
    P({ x: 60, h: 1, top: C.green, hairStyle: 'long', mood: 'shock' }),
    book(46, 56, 28, 34, NIGHT, all(circle(64, 64, 4, '#f6e7a8', null), path('M50 88 L56 76 L62 84 L66 78 L72 88 Z', '#14203a', null))),
    tear(43, 22, 0.9), tear(80, 26, 0.8),
    line('M30 12 L36 18 M24 26 L32 28 M90 12 L84 18 M96 26 L88 28', HL, 2.2),
    waPulse('ttypespä', heart(92, 52, 6, C.red), line('M98 46 L104 42 M100 52 L106 52 M98 58 L104 62', C.red, 1.6))),
  // klimax: the story arc; its peak bursts in orange
  'ttype.klimax': all(bg(), arcBase(), circle(10, 98, 3, C.grey, null), circle(112, 84, 3, C.grey, null),
    line('M58 54 C62 46 64 42 66 40 C69 32 75 30 78 38 C80 44 82 48 84 52', HL, 4.4),
    path('M72 6 L76 16 L86 10 L82 20 L94 22 L84 28 L90 36 L79 33 L74 42 L70 32 L60 36 L65 27 L54 22 L65 19 L62 9 L70 15 Z', C.yellow, C.ink, 1.4),
    T(73, 29, '!', 13, HL, 900), sparkle(98, 12, 4), sparkle(50, 16, 3.4)),
  // upplösning (slutet): the arc carries grey question marks; where it ends the answer comes – a tick and an open padlock
  'ttype.upplösning.4': all(bg(), arcBase(), line('M86 62 C94 76 102 82 112 84', HL, 4.4),
    qmark(36, 82, 15), qmark(54, 58, 15), qmark(72, 22, 15),
    circle(104, 62, 13, C.white, HL, 2.6), tick(104, 62, 1.6, C.green),
    g('translate(80 90) scale(0.9)', path('M-6 -4 L-6 -12 C-6 -20 6 -20 6 -14', 'none', C.ink, 3), rect(-10, -5, 20, 16, GOLD, 3, C.ink, 1.6), circle(0, 2, 2, C.ink, null))),
  // lyckligt slut: the last page of a book shows two people hugging under a heart and a sun
  'ttype.lyckligt-slut': all(bg(), openBook(60, 108, 1.18, lines(-36, -34, 30, 7, 5), all(rect(4, -38, 36, 32, '#e6f4fb', 2, null),
      circle(32, -32, 4, C.yellow, C.ink, 0.8), mhead(17, -20, 4, C.hair, C.orange), mhead(26, -20, 4, '#c4542a', C.green), heart(21.5, -31, 2.6), line('M4 -9 L40 -9', GREENB, 2))),
    ring(84, 77, 26), sparkle(16, 20, 4), sparkle(104, 24, 4)),
  // öppet slut: the path that leaves the book forks; both ways vanish in fog under a big question mark
  'ttype.öppet-slut': all(bg(), openBook(36, 112, 0.7, lines(-36, -34, 30, 6, 5), lines(6, -34, 30, 6, 5)),
    line('M42 86 C50 76 58 70 66 64', C.brown, 3.4), line('M66 64 C70 52 72 44 74 36', C.brown, 2.6, '4 3'), line('M66 64 C78 60 88 56 98 54', C.brown, 2.6, '4 3'),
    g('translate(66 22) scale(0.38)', figure({ x: 0, h: 1, top: C.orange })),
    ellipse(76, 30, 18, 9, 'rgba(220,226,232,0.95)', null), ellipse(102, 50, 16, 10, 'rgba(220,226,232,0.95)', null),
    T(92, 26, '?', 30, HL, 900)),
  // uppföljare: book 1 (grey) and book 2 with the same cover picture; an arrow from 1 to 2
  'ttype.uppföljare': all(bg(), greyed(book(10, 26, 40, 62, BLUEB, all(path('M16 70 L26 50 L34 62 L40 54 L46 70 Z', GREENB, C.ink, 1), T(30, 44, '1', 16, C.white, 900)))),
    book(64, 26, 40, 62, BLUEB, all(path('M70 70 L80 50 L88 62 L94 54 L100 70 Z', GREENB, C.ink, 1), T(84, 44, '2', 16, C.white, 900))),
    arrow(46, 102, 74, 102, HL, 3), frame(60, 22, 50, 74)),

  // ── 4332 Miljö- och personbeskrivning ──
  // beskrivning (omgång 2): a finished product sheet on a clipboard – picture of a chair, a heading bar, lines with small
  // measure, colour and weight signs – each line joined by a dashed line to the real chair beside it; nobody is writing
  'ttype.beskrivning': all(bg(), ground(),
    rect(6, 10, 60, 98, '#b98a5a', 4, C.ink, 1.8), rect(24, 6, 24, 9, C.silver, 2, C.ink, 1.4),
    rect(11, 18, 50, 86, PAPER, 2, C.ink, 1.4), rect(16, 23, 40, 7, C.ink, 1, null),
    g('translate(36 46) scale(0.45)', rect(-14, -30, 6, 34, '#c46a3a', 1, C.ink, 2), rect(-14, -4, 30, 6, '#c46a3a', 1, C.ink, 2), line('M-12 2 L-12 24 M14 2 L14 24', C.ink, 3)),
    line('M17 64 L25 64', C.ink, 1.4), line('M17 62 L17 66 M25 62 L25 66', C.ink, 1.2), lines(29, 64, 26, 1),
    rect(17, 72, 7, 6, '#c46a3a', 1, C.ink, 1), lines(29, 75, 26, 1),
    path('M17 92 L19 86 L23 86 L25 92 Z', C.grey, C.ink, 1), circle(21, 85, 1.4, 'none', C.ink, 1), lines(29, 89, 26, 1),
    g('translate(94 112)', rect(-14, -60, 7, 34, '#c46a3a', 1, C.ink, 1.8), rect(-14, -30, 30, 7, '#c46a3a', 1, C.ink, 1.8), line('M-12 -23 L-12 0 M14 -23 L14 0', C.ink, 3)),
    line('M56 64 C66 62 72 60 80 58 M56 75 C66 76 74 80 84 82 M56 89 C66 92 74 96 82 100', HL, 1.4, '3 3'),
    line('M70 42 L70 48 M70 45 L112 45 M112 42 L112 48', C.ink, 1.2), frame(8, 12, 56, 94)),
  // miljö (i en berättelse): out of an open book rises a winter night – snowy forest, a red cottage with a lit window, the moon
  'ttype.miljö.3': all(bg(), rect(14, 6, 92, 66, NIGHT, 4, C.ink, 1.6), circle(90, 20, 7, '#f6e7a8', C.ink, 1),
    ...[[24, 18], [44, 12], [62, 24], [80, 34], [34, 32], [100, 44]].map(([x, y]) => circle(x!, y!, 1.2, C.white, null)),
    path('M14 60 C40 54 80 54 106 60 L106 72 L14 72 Z', C.white, null),
    tree(26, 62, 1.1), tree(38, 58, 0.8), tree(96, 62, 1.1), tree(86, 58, 0.8),
    rect(52, 44, 22, 16, '#b8463a', 1, C.ink, 1.2), path('M49 45 L63 34 L77 45 Z', '#5a2e2a', C.ink, 1.2), rect(57, 48, 6, 6, '#ffd75e', 1, C.ink, 1), rect(66, 50, 5, 10, '#5a2e2a', 1, C.ink, 1),
    frame(14, 6, 92, 66), openBook(60, 114, 1, lines(-36, -32, 30, 5, 5), lines(6, -32, 30, 5, 5)),
    line('M30 84 L24 72 M90 84 L96 72', HL, 1.4, '3 3')),
  // utspela sig: a map pin drops onto a town on a map; a dashed line leads to it from an open book
  'ttype.utspela-sig': all(bg(), openBook(30, 106, 0.6, lines(-36, -32, 30, 5, 5), lines(6, -32, 30, 5, 5)),
    rect(54, 30, 60, 70, '#bfe3f5', 3, C.ink, 1.6), path('M58 34 C74 32 84 40 92 36 C100 32 106 40 110 38 L110 96 L74 96 C70 86 62 84 58 76 Z', '#cfe7b8', C.ink, 1.2),
    line('M64 80 C76 74 86 70 104 62 M80 94 C82 80 86 66 92 48', '#e6d3a0', 2), circle(86, 68, 3.4, C.dark, null), circle(70, 50, 2, C.grey, null), circle(100, 86, 2, C.grey, null),
    line('M44 82 C56 76 70 72 82 70', HL, 1.4, '3 3'),
    waIn('ttypeutsp', 0, -34, g('translate(86 66)', path('M0 0 C-4 -8 -9 -12 -9 -18 C-9 -24 9 -24 9 -18 C9 -12 4 -8 0 0 Z', HL, C.ink, 1.4), circle(0, -18, 3.4, C.white, null)))),
  // karaktär (i en berättelse): three different characters – a girl, a cat and a robot – stand on an open book
  'ttype.karaktär.2': all(bg(), openBook(60, 112, 1.2, lines(-36, -34, 30, 6, 5), lines(6, -34, 30, 6, 5)),
    at(-46, P({ x: 32, h: 0.55, top: C.orange, hairStyle: 'long', mood: 'smile' })),
    g('translate(64 66)', cat(0, 0, 0.9), path('M-18 -22 L-6 -22 L-9 -30 L-15 -30 Z', NIGHT, C.ink, 1)),
    g('translate(94 66)', rect(-8, -22, 16, 18, C.silver, 2, C.ink, 1.4), rect(-6, -34, 12, 11, C.silver, 2, C.ink, 1.4), circle(-2.6, -29, 1.6, '#4fd1ff', null), circle(2.6, -29, 1.6, '#4fd1ff', null),
      line('M0 -34 L0 -39', C.ink, 1.2), circle(0, -40, 1.6, C.red, null), line('M-8 -16 L-13 -10 M8 -16 L13 -10 M-4 -4 L-4 0 M4 -4 L4 0', C.ink, 2)),
    sparkle(18, 20, 4), sparkle(108, 18, 4), sparkle(62, 14, 3)),
  // huvudperson: one person stands in the spotlight in the middle, ringed; the others at the sides are small and grey
  'ttype.huvudperson': all(bg('#e9e4f0'), stage(), spot(60, 30),
    at(-12, figure({ x: 20, h: 0.56, grey: true }), figure({ x: 100, h: 0.56, grey: true })),
    at(-12, figure({ x: 60, h: 0.9, top: C.orange, hairStyle: 'long' })), ring(60, 26, 14)),
  // målande (omgång 2): an open book whose coloured words rise in coloured ribbons and turn into a bright picture above it –
  // sun, sea and a bird; the words on the page are the same colours as the picture
  'ttype.målande': all(bg(), openBook(60, 114, 1.15,
      all(line('M-36 -34 L-24 -34', C.yellow, 3), lines(-21, -34, 15, 1), lines(-36, -27, 30, 1), line('M-36 -20 L-20 -20', '#2f86c8', 3), lines(-17, -20, 11, 1), lines(-36, -13, 22, 1)),
      all(lines(6, -34, 30, 1), line('M6 -27 L20 -27', GREENB, 3), lines(23, -27, 13, 1), line('M10 -20 L24 -20', C.red, 3), lines(6, -13, 26, 1))),
    line('M32 76 C28 62 30 50 36 40', C.yellow, 2.4, '4 3'), line('M42 84 C42 70 48 58 54 52', '#2f86c8', 2.4, '4 3'), line('M78 82 C82 70 80 56 76 46', GREENB, 2.4, '4 3'), line('M86 90 C94 76 96 60 92 42', C.red, 2.4, '4 3'),
    rect(14, 6, 92, 50, '#e6f4fb', 6, C.ink, 1.6), circle(36, 22, 9, C.yellow, C.ink, 1.2), ...range(8).map((i) => { const a = (i * Math.PI) / 4; return line(`M${f1(36 + Math.cos(a) * 11)} ${f1(22 + Math.sin(a) * 11)} L${f1(36 + Math.cos(a) * 14)} ${f1(22 + Math.sin(a) * 14)}`, C.gold, 1.6); }),
    path('M14 44 C30 38 44 50 60 44 C76 38 90 50 106 44 L106 56 L14 56 Z', '#2f86c8', C.ink, 1.2), path('M60 30 L70 22 L80 30 L76 30 L76 40 L64 40 L64 30 Z', C.red, C.ink, 1), rect(80, 34, 22, 6, GREENB, 1, null),
    path('M82 16 q4 -4 8 0 q4 -4 8 0', 'none', C.ink, 1.6), sparkle(110, 64, 4, HL), sparkle(10, 66, 4, HL)),
  // ── 4333 Dialog i text ──
  // dialog (i en text): two people talk out of an open book; their bubbles take turns
  'ttype.dialog.2': all(bg(), openBook(60, 112, 1.2, lines(-36, -34, 30, 6, 5), lines(6, -34, 30, 6, 5)),
    mhead(22, 50, 7, C.hair, C.orange), mhead(98, 50, 7, '#c4542a', C.green),
    bub(34, 8, 74, 24, 26, 42, C.white, C.ink, lines(40, 14, 28, 2, 5)),
    bub(48, 28, 88, 44, 96, 46, C.white, C.ink, lines(54, 34, 28, 2, 5))),
  // replik (i pjäs och bok): two actors on a stage; the line one of them is saying now is ringed, the other's is grey and dashed
  'ttype.replik.3': all(bg('#efe6e6'), stage(), rect(0, 0, 10, 96, '#a33a3a', 0, null), rect(110, 0, 10, 96, '#a33a3a', 0, null),
    at(-16, greyed(figure({ x: 30, h: 0.82 })), P({ x: 84, h: 0.82, top: C.orange, hairStyle: 'long', mood: 'laugh' })),
    bub(14, 6, 46, 22, 30, 34, C.white, C.grey, lines(19, 12, 22, 2, 5)), rect(14, 6, 32, 16, 'none', 6, C.grey, 1.6),
    bub(52, 6, 108, 30, 84, 38, C.white, C.ink, lines(58, 13, 44, 3, 6)), frame(48, 2, 64, 32)),
  // manus (film och teater): a stapled script – short name bars, then lines – beside a clapperboard
  'ttype.manus.1': all(bg(), g('rotate(-6 50 60)', sheet(24, 12, 56, 88), sheet(20, 16, 56, 88, all(rect(24, 18, 6, 4, C.grey, 0, null),
      rect(38, 26, 20, 4, C.ink, 1, null), lines(28, 35, 40, 2, 5), rect(38, 48, 20, 4, C.ink, 1, null), lines(28, 57, 40, 2, 5), rect(38, 70, 20, 4, C.ink, 1, null), lines(28, 79, 40, 3, 5)))),
    g('translate(94 92)', rect(-16, -8, 32, 22, C.dark, 2, C.ink, 1.6), g('rotate(-18 -16 -8)', rect(-16, -16, 32, 8, C.white, 1, C.ink, 1.4), ...range(4).map((i) => path(`M${-14 + i * 8} -16 L${-10 + i * 8} -16 L${-12 + i * 8} -8 L${-16 + i * 8} -8 Z`, C.dark, null))),
      lines(-12, -1, 22, 2, 5, '#8a909a', 1.4)),
    frame(16, 8, 68, 100)),
  // talstreck: every line on the page starts with an orange dash; a magnifying glass over the first one
  'ttype.talstreck': all(bg(), sheet(14, 10, 80, 98, all(
      ...[24, 44, 64, 84].map((y) => all(line(`M22 ${y} L30 ${y}`, HL, 3.2), lines(34, y, 52, 1), lines(22, y + 6, 64, 1))))),
    circle(28, 24, 14, 'rgba(230,244,252,0.5)', C.ink, 2.4), line('M38 34 L50 46', C.ink, 5), line('M38 34 L50 46', C.brown, 3)),
  // direkt tal: someone says three signs; exactly the same signs land on the page between quotation marks
  'ttype.direkt-tal': all(bg(), ground(), P({ x: 24, h: 0.78, top: C.green, mood: 'smile' }),
    bub(6, 8, 50, 28, 26, 42, C.white, C.ink, words3(26, 18, 1)),
    sheet(56, 46, 58, 52, all(lines(62, 82, 46, 3, 5))),
    T(64, 74, '”', 24, HL, 900), T(108, 74, '”', 24, HL, 900),
    waIn('ttypedir', -50, -40, words3(84, 64, 1.1))),
  // indirekt tal: what someone said (grey, in the past) is passed on by another person: a small head, "att", fewer signs, no quotation marks
  'ttype.indirekt-tal': all(bg(), ground(), rect(4, 6, 42, 38, '#e7e9ec', 4, C.grey, 1.4, ), greyed(mhead(14, 28, 5), bub(22, 12, 44, 26, 16, 30, C.white, C.ink, words3(33, 19, 0.6))),
    P({ x: 46, h: 0.8, top: C.orange, hairStyle: 'long', mood: 'smile' }), P({ x: 98, h: 0.66, top: C.sky }),
    waGrow('ttypeind', bub(56, 18, 116, 42, 54, 44, C.white, C.ink, all(mhead(64, 28, 3.4), arrow(70, 30, 76, 30, C.ink, 1.4), T(86, 34, 'att', 10, HL, 900), circle(102, 30, 3, C.red, C.ink, 1), star(110, 30, 3.4, C.yellow))))),
  // anföringsverb: three lines of dialogue; the verb that tells how it was said is marked in each line
  'ttype.anföringsverb': all(bg(), sheet(6, 14, 108, 88, all(
      rect(46, 25, 22, 13, '#ffd9c7', 3, null), rect(44, 51, 40, 13, '#ffd9c7', 3, null), rect(46, 77, 46, 13, '#ffd9c7', 3, null),
      TL(12, 35, '– …,', 11, C.grey), TL(48, 35, 'sa', 11, HL, 900), TL(72, 35, 'hon.', 11, C.grey),
      TL(12, 61, '– …!', 11, C.grey), TL(46, 61, 'ropade', 11, HL, 900), TL(88, 61, 'han.', 11, C.grey),
      TL(12, 87, '– …,', 11, C.grey), TL(48, 87, 'viskade', 11, HL, 900), TL(94, 87, 'Ali.', 10, C.grey)))),
  // muttra: a cross person, a small dark rain cloud overhead, mutters a tangled scribble that shakes
  'ttype.muttra': all(bg(), ground(), P({ x: 46, h: 0.95, top: '#6b7a8f', mood: 'angry' }),
    path('M30 14 C24 14 24 6 31 6 C32 0 42 -1 45 4 C49 0 58 3 56 9 C61 10 60 16 55 16 Z', C.grey, C.ink, 1.2), line('M34 18 L32 22 M42 18 L40 22 M50 18 L48 22', TEAR, 1.4),
    waShake('ttypemut', bub(66, 22, 96, 38, 56, 40, '#e1e3e8', C.ink, line('M70 30 C72 26 74 34 76 28 C78 24 80 34 82 28 C84 25 86 33 88 29 C89 27 91 31 92 30', C.dark, 1.4)))),
  // utbrista: a person throws up her arms; a big burst bubble with "!" grows out of her
  'ttype.utbrista': all(bg(), ground(),
    g('translate(0 6)', path('M40 54 L28 28 L34 25 L48 50 Z M64 54 L76 28 L70 25 L56 50 Z', C.orange, C.ink, 1.6), circle(30, 25, 3.6, C.skin, C.ink, 1.2), circle(74, 25, 3.6, C.skin, C.ink, 1.2)),
    figure({ x: 52, h: 0.95, top: C.orange, hairStyle: 'long' }),
    g('translate(52 32)', circle(0, 0, 7, C.skin, null), circle(-3, -1, 1.8, C.white, C.ink, 0.8), circle(3, -1, 1.8, C.white, C.ink, 0.8), circle(-3, -1, 0.8, C.ink, null), circle(3, -1, 0.8, C.ink, null), ellipse(0, 4, 2.2, 2.8, '#c84a4a', C.ink, 0.9)),
    waGrow('ttypeutb', g('translate(92 30)', path('M0 -24 L5 -12 L18 -18 L12 -6 L24 -2 L12 4 L18 16 L5 10 L0 22 L-5 10 L-18 16 L-12 4 L-24 -2 L-12 -6 L-18 -18 L-5 -12 Z', C.yellow, C.ink, 1.6), T(0, 8, '!', 22, HL, 900))),
    line('M64 34 L72 32', C.ink, 1.4)),
  // stamma: a nervous person; in the bubble the same first sign comes again and again before the rest
  'ttype.stamma': all(bg(), ground(), P({ x: 26, h: 0.9, top: C.sky, mood: 'blush' }), tear(40, 20, 0.8),
    bub(40, 14, 116, 40, 34, 34, C.white, C.ink, all(
      ...range(3).map((i) => moving(`ttypesta${i}`, '0%,20%{opacity:0}35%,100%{opacity:1}', { dur: 3, delay: i * 0.4 }, rect(46 + i * 13, 22, 8, 10, HL, 1.5, C.ink, 1), line(`M${55 + i * 13} 27 L${58 + i * 13} 27`, C.ink, 1.4))),
      moving('ttypesta3', '0%,55%{opacity:0}70%,100%{opacity:1}', { dur: 3 }, rect(85, 22, 8, 10, HL, 1.5, C.ink, 1), circle(98, 27, 3.6, C.red, C.ink, 1), path('M103 31 L106.5 23 L110 31 Z', C.green, C.ink, 1))))),
  // monolog: one person alone on a stage in the spotlight with one very long bubble; the seats in front are empty
  'ttype.monolog': all(bg('#e9e4f0'), stage(), spot(34, 26), at(-14, P({ x: 34, h: 0.86, top: C.purple, mood: 'smile' })),
    bub(54, 4, 114, 82, 44, 30, C.white, C.ink, lines(60, 12, 48, 13, 5.4)),
    ...[12, 36, 60, 84, 108].map((x) => all(rect(x - 8, 104, 16, 10, C.grey2, 3, C.ink, 1), rect(x - 8, 112, 16, 6, C.grey, 1, C.ink, 1)))),

  // ── 4334 Sakprosa och reportage ──
  // sakprosa (omgång 2): a ringed shelf of real-life books – a cookbook (pot), a row of reference volumes, a biography
  // (portrait), an atlas (globe) – and apart from it a fairy-tale book (dragon and castle) that is crossed out in red
  'ttype.sakprosa': all(bg(),
    rect(4, 26, 74, 70, '#b98a5a', 2, C.ink, 1.6), rect(8, 30, 66, 62, '#8f6640', 1, null), line('M4 96 L78 96', C.ink, 2),
    rect(10, 46, 16, 46, C.red, 1, C.ink, 1.2), path('M13 60 L23 60 L22 66 L14 66 Z', C.dark, C.ink, 0.9), line('M12 60 L24 60', C.ink, 1.4), line('M16 56 C15 53 18 53 17 50 M20 56 C19 53 22 53 21 50', C.grey, 1),
    ...[0, 1, 2].map((i) => all(rect(28 + i * 7, 40, 7, 52, '#2e5590', 1, C.ink, 1.1), rect(29 + i * 7, 48, 5, 4, GOLD, 0, null), rect(29 + i * 7, 80, 5, 4, GOLD, 0, null))),
    rect(50, 44, 12, 48, '#e8d8b0', 1, C.ink, 1.2), mhead(56, 56, 3.4, '#d9d9d9', C.orange),
    rect(63, 50, 10, 42, GREENB, 1, C.ink, 1.2), circle(68, 62, 4, '#7fc4e8', C.ink, 1), path('M66 60 C68 59 69 62 68 63 Z', GREENB, null),
    frame(2, 22, 78, 78),
    g('translate(98 70) rotate(8)', rect(-14, -22, 28, 40, C.purple, 2, C.ink, 1.6), path('M-8 10 L-8 -2 L-5 -2 L-5 -6 L-2 -2 L1 -6 L1 -2 L2 -2 L2 10 Z', C.white, C.ink, 0.9),
      path('M2 -10 C6 -18 12 -16 10 -10 C14 -12 14 -6 10 -6 L6 -4 Z', '#3fa45b', C.ink, 0.9), star(-6, -14, 3.4)),
    line('M84 50 L112 92 M112 50 L84 92', C.red, 4)),
  // biografi: a writer at a desk writes a book; above her runs another person's life – baby, child, adult, old
  'ttype.biografi': all(bg(), desk(88), P({ x: 28, h: 0.8, top: C.green, hairStyle: 'long', mood: 'calm' }),
    book(54, 64, 22, 24, '#8a5a32', mhead(66, 72, 4, '#d9d9d9', C.orange)), pen(84, 80, 30, 0.8),
    rect(42, 6, 74, 36, C.white, 4, C.ink, 1.4), line('M48 34 L110 34', HL, 2.4),
    circle(52, 26, 3.4, C.skin, C.ink, 1), ellipse(52, 31, 4, 2.4, C.orange, C.ink, 0.9),
    mhead(68, 24, 3.4, C.hair, C.orange), mhead(86, 21, 4, C.hair, C.orange), mhead(104, 21, 4, '#d9d9d9', C.orange),
    ...[52, 68, 86, 104].map((x) => circle(x, 34, 1.8, HL, null)), line('M66 62 C66 52 70 46 76 42', HL, 1.4, '3 3')),
  // populärvetenskap: a grey board full of hard formulas becomes a simple picture of a planet in a book that a reader enjoys
  'ttype.populärvetenskap': all(bg(), ground(), greyed(rect(4, 12, 48, 36, '#2f4f3f', 2, C.ink, 1.6), TL(8, 26, '∫ Σ √x', 10, C.white), TL(8, 40, 'λ = h/p', 9, C.white), figure({ x: 22, h: 0.56 })),
    arrow(52, 58, 68, 58, HL, 3),
    P({ x: 96, h: 0.86, top: C.orange, hairStyle: 'long', mood: 'laugh' }),
    openBook(92, 74, 0.5, all(circle(-20, -22, 9, C.orange, C.ink, 1.4), ellipse(-20, -22, 16, 4, 'none', C.ink, 1.4)), lines(6, -34, 30, 5, 6)),
    sparkle(70, 22, 4), sparkle(112, 30, 3)),
  // reseskildring: an open book with a little map and a dashed route on one page and text on the other; a backpack beside it
  'ttype.reseskildring': all(bg(), openBook(52, 108, 1.08,
      all(rect(-40, -38, 36, 32, '#cfe7b8', 1, null), path('M-36 -12 C-30 -20 -24 -18 -20 -26 C-16 -32 -10 -30 -8 -34', 'none', HL, 1.6), circle(-36, -12, 1.8, C.red, null), circle(-20, -26, 1.8, C.red, null), circle(-8, -34, 1.8, C.red, null), path('M-40 -16 C-32 -18 -28 -10 -22 -8 L-22 -6 L-40 -6 Z', '#9fd3f2', null)),
      all(lines(6, -34, 30, 3, 5), g('translate(22 -14)', rect(-12, -5, 22, 9, C.red, 2, C.ink, 1), rect(-9, -3, 4, 3, '#bfe3f5', 0, null), rect(-3, -3, 4, 3, '#bfe3f5', 0, null), circle(-8, 4.5, 1.6, C.ink, null), circle(6, 4.5, 1.6, C.ink, null)), lines(6, -6, 30, 1))),
    g('translate(100 96)', rect(-12, -28, 24, 34, '#d07a3a', 6, C.ink, 1.6), rect(-8, -12, 16, 12, '#b5622c', 3, C.ink, 1.2), path('M-6 -28 C-6 -36 6 -36 6 -28', 'none', C.ink, 2)),
    ring(29, 84, 22)),
  // dokumentär: a TV shows a real wolf in a forest; a film camera on a tripod stands beside it
  'ttype.dokumentär': all(bg(), screen(6, 18, 72, 54, all(rect(9, 21, 66, 48, '#b9dcb0', 1, null), tree(20, 56, 1), tree(64, 54, 0.9), wolf(44, 62, 1.1), circle(70, 26, 2.2, C.red, null))),
    rect(36, 72, 12, 8, C.dark, 0, null), rect(26, 80, 32, 4, C.dark, 2, null),
    g('translate(98 54)', rect(-12, -10, 20, 14, C.dark, 2, C.ink, 1.4), circle(-6, -16, 6, C.dark, C.ink, 1.2), circle(4, -16, 6, C.dark, C.ink, 1.2), path('M8 -6 L16 -10 L16 2 L8 -2 Z', C.grey, C.ink, 1.2), line('M-2 4 L-12 56 M-2 4 L-2 56 M-2 4 L8 56', C.ink, 2))),
  // faktaruta: an article page with text and a photo; one small box with digits and a little chart is ringed
  'ttype.faktaruta': all(bg(), newsPage(8, 8, 104, 104, all(rect(14, 14, 92, 9, C.ink, 1, null), rect(14, 28, 50, 32, '#bcd6e8', 1, C.ink, 1), path('M14 60 L30 42 L42 54 L50 46 L64 60 Z', GREENB, null),
      lines(14, 68, 50, 7, 5.4), lines(70, 28, 36, 2, 5.4),
      rect(70, 42, 36, 62, '#fff2c7', 2, C.ink, 1.4), TL(73, 54, '1850', 10, C.ink, 900), TL(73, 67, '12 000', 9, C.ink, 800),
      rect(74, 88, 6, 10, BLUEB, 0, null), rect(83, 82, 6, 16, BLUEB, 0, null), rect(92, 76, 6, 22, HL, 0, null), line('M73 98 L102 98', C.ink, 1))),
    frame(66, 38, 44, 70)),

  // ── 4335 Krönikor och essäer ──
  // essä (manuellt spår): a contrast pair. Left, ringed: a long text of many stacked pages with a big question mark at the
  // top and a balance in the middle – on one hand, on the other hand – and many lines of reasoning. Right, small, grey and
  // fenced off: a short newspaper column with a portrait (krönika), which the word is not
  'ttype.essä': all(bg(),
    ...[6, 4, 2].map((d) => rect(8 + d, 4 + d, 66, 104, '#f1ede2', 2, C.ink, 1.2)),
    rect(8, 4, 66, 104, PAPER, 2, C.ink, 1.6),
    T(41, 26, '?', 24, HL, 900), lines(14, 34, 54, 2, 5),
    g('translate(41 58)', line('M0 -12 L0 12', C.ink, 2.4), path('M-6 14 L6 14 L4 10 L-4 10 Z', C.grey, C.ink, 1.2),
      line('M-22 -8 L22 -12', C.ink, 2.2), circle(0, -10, 2, C.ink, null),
      line('M-22 -8 L-28 2 M-22 -8 L-16 2 M22 -12 L16 -2 M22 -12 L28 -2', C.ink, 1),
      path('M-30 2 L-14 2 C-15 7 -29 7 -30 2 Z', '#ffd9c7', C.ink, 1.2), path('M14 -2 L30 -2 C29 3 15 3 14 -2 Z', '#cfe7f5', C.ink, 1.2),
      T(-22, 0, '+', 9, HL, 900), T(22, -4, '−', 9, BLUEB, 900)),
    lines(14, 78, 54, 6, 5),
    frame(4, 1, 78, 114),
    line('M88 6 L88 114', C.grey2, 2, '4 3'),
    greyed(newsPage(92, 30, 24, 52, all(rect(95, 34, 18, 4, C.ink, 1, null), mhead(104, 46, 4, C.hair, C.purple), lines(95, 60, 18, 4, 4.4))))),
  // kultursida: an open newspaper; the ringed page shows a book, a film strip, a music note and a paint palette, the grey page news
  'ttype.kultursida': all(bg(), greyed(newsPage(6, 16, 54, 88, all(rect(10, 20, 46, 6, C.ink, 1, null), rect(10, 30, 46, 24, '#bcd6e8', 1, C.ink, 1), rect(20, 42, 24, 8, C.red, 2, C.ink, 1), lines(10, 62, 44, 7, 5)))),
    newsPage(60, 16, 54, 88, all(rect(64, 20, 46, 6, C.ink, 1, null),
      book(65, 31, 17, 22, BLUEB), g('translate(98 42)', rect(-10, -9, 20, 18, C.dark, 1, C.ink, 1), ...range(3).map((i) => rect(-8 + i * 6, -6, 4, 12, '#bfe3f5', 0, null))),
      g('translate(74 76)', path('M0 8 L0 -10 L10 -12 L10 6', 'none', C.ink, 2), ellipse(-2.6, 8, 3.4, 2.6, C.ink, null), ellipse(7.4, 6, 3.4, 2.6, C.ink, null)),
      g('translate(98 76)', path('M-10 0 C-10 -10 10 -12 11 -2 C12 4 6 2 4 6 C2 10 -10 10 -10 0 Z', C.tan, C.ink, 1.2), circle(-5, -3, 2, C.red, null), circle(1, -6, 2, C.yellow, null), circle(6, -2, 2, BLUEB, null)),
      lines(64, 92, 44, 2, 5))),
    frame(58, 12, 58, 96)),
  // jagform (omgång 2): a plain page of text where the word "jag" is marked again and again; an arrow runs from the page
  // to the writer herself, who sits beside it with a pen; no newspaper layout, no portrait in the text
  'ttype.jagform': all(bg(), ground(), sheet(4, 8, 74, 98, all(
      ...[[22, 'jag', 30], [38, 'jag', 46], [54, 'jag', 30], [70, 'jag', 52], [86, 'jag', 30]].map(([y, w, x]) => all(lines(10, +y!, +x! - 14, 1), rect(+x! - 3, +y! - 8, 20, 11, '#ffd9c7', 3, null), TL(+x! - 1, +y! + 1, String(w), 10, HL, 900), lines(+x! + 20, +y!, 50 - +x!, 1))))),
    P({ x: 100, h: 0.8, top: C.green, hairStyle: 'long', mood: 'smile' }), pen(110, 80, 25, 0.7),
    arrow(66, 40, 90, 34, HL, 2.6), ring(100, 39, 12)),
  // anekdot: at a café table a woman tells a short funny story – a gull steals an ice cream – and the two listening laugh
  'ttype.anekdot': all(bg(), ground(), rect(36, 86, 48, 5, C.tan, 2, C.ink, 1.4), line('M60 91 L60 112', C.brown, 3), cup(48, 86), cup(72, 86),
    P({ x: 18, h: 0.8, top: C.green, hairStyle: 'long', mood: 'smile' }), P({ x: 98, h: 0.76, top: C.sky, mood: 'laugh' }),
    bub(30, 6, 94, 46, 22, 46, C.white, C.ink, all(mhead(46, 28, 5, C.hair, C.purple), path('M52 30 L56 22 L60 30 Z', '#f4d9a8', C.ink, 1), circle(56, 20, 3.4, C.pink, C.ink, 1),
      g('translate(76 18)', path('M-10 0 C-6 -6 -2 -4 0 0 C2 -4 6 -6 10 0 C6 -2 2 -1 0 2 C-2 -1 -6 -2 -10 0 Z', C.white, C.ink, 1.2), circle(10, 2, 3, C.pink, C.ink, 0.9)), arrow(62, 26, 70, 22, C.ink, 1.4)))),
  // självironi: a man has spilt coffee all over his own shirt and laughs, his thumb pointing at himself
  'ttype.självironi': all(bg(), ground(), P({ x: 56, h: 1, top: C.white, mood: 'laugh' }),
    path('M50 58 C46 62 50 70 56 68 C60 74 66 70 64 64 C68 60 62 54 58 58 C56 54 50 54 50 58 Z', '#8a5a32', null),
    g('translate(90 108) rotate(160)', cup(0, 0)), path('M80 110 C86 106 96 108 104 111 Z', '#8a5a32', null),
    T(88, 30, 'ha', 10, HL, 900), T(98, 44, 'ha', 10, HL, 900), sparkle(28, 26, 4)),
  // slutkläm: a narrow newspaper column; its very last line bursts like a little firework and makes the reader laugh
  'ttype.slutkläm': all(bg(), newsPage(26, 6, 52, 108, all(rect(31, 11, 42, 8, C.ink, 1, null), mhead(38, 28, 4, C.hair, C.purple), lines(46, 26, 26, 2, 5), lines(31, 40, 42, 10, 5.4))),
    line('M31 102 L66 102', HL, 4.4), arrow(96, 74, 80, 98, HL, 2.6),
    path('M74 102 L78 94 L80 101 L88 96 L84 103 L92 106 L84 108 L86 115 L79 110 L74 116 L73 109 L66 110 L71 105 Z', C.yellow, C.ink, 1.2),
    circle(102, 54, 10, C.yellow, C.ink, 1.4), path('M97 51 Q99 48 101 51 M103 51 Q105 48 107 51', 'none', C.ink, 1.2), path('M97 56 Q102 63 107 56 Z', '#c84a4a', C.ink, 1)),

  // ── 4336 Instruktioner och manualer ──
  // manual: a thick booklet with numbered parts of a printer on the cover, beside the printer itself
  'ttype.manual': all(bg(), ground(),
    book(8, 22, 52, 72, '#e8eef4', all(rect(14, 28, 40, 6, C.ink, 1, null), g('translate(34 62)', rect(-14, -10, 28, 16, C.grey2, 2, C.ink, 1.2), rect(-8, -16, 16, 6, C.white, 1, C.ink, 1), rect(-10, 6, 20, 4, C.white, 1, C.ink, 1)),
      ...[[18, 48, '1'], [50, 50, '2'], [34, 84, '3']].map(([x, y, d]) => all(circle(+x!, +y!, 4.4, HL, C.ink, 1), T(+x!, +y! + 3, String(d), 7, C.white, 900))))),
    g('translate(92 96)', rect(-22, -18, 44, 26, C.grey2, 3, C.ink, 1.6), rect(-14, -28, 28, 10, C.white, 1, C.ink, 1.2), rect(-16, 2, 32, 8, C.white, 1, C.ink, 1.2), circle(14, -10, 2.4, C.green, null), line('M-16 -6 L4 -6', C.ink, 1.4))),
  // följa (regler, instruktioner): the card shows "block on top of the box"; the person puts the block exactly there and gets a tick
  'ttype.följa.3': all(bg(), ground(), rect(8, 14, 38, 40, C.white, 3, C.ink, 1.6), rect(18, 38, 18, 10, C.tan, 1, C.ink, 1), rect(22, 22, 10, 8, C.red, 1, C.ink, 1), arrow(27, 30, 27, 36, HL, 1.8),
    line('M27 54 L27 112', C.grey, 2.4), P({ x: 70, h: 0.92, top: C.green, mood: 'smile' }),
    rect(86, 88, 28, 24, C.tan, 2, C.ink, 1.6), waIn('ttypeföl', 0, -26, rect(93, 74, 14, 14, C.red, 2, C.ink, 1.6)),
    line('M46 34 C62 30 84 50 96 70', HL, 1.4, '3 3'), circle(104, 30, 9, C.white, C.green, 2), tick(104, 30, 1.2)),
  // slutligen: four numbered steps; 1–3 are grey and ticked, step 4 – the finished shelf – is ringed
  'ttype.slutligen': all(bg(), ...[0, 1, 2].map((i) => all(greyed(rect(6 + i * 28, 30, 24, 50, C.white, 3, C.ink, 1.4), T(18 + i * 28, 46, String(i + 1), 12, C.ink, 900), rect(12 + i * 28, 56, 12, 6 + i * 6, C.tan, 1, C.ink, 1)), tick(18 + i * 28, 72, 1, C.green))),
    rect(90, 24, 26, 62, '#fff2e8', 3, C.ink, 1.6), T(103, 40, '4', 14, HL, 900), rect(95, 48, 16, 30, C.tan, 1, C.ink, 1.2), line('M95 58 L111 58 M95 68 L111 68', C.ink, 1.2), path('M110 46 L110 38 L117 41 L110 44', C.red, C.ink, 0.9),
    arrow(8, 98, 104, 98, C.grey, 2.4), frame(87, 20, 32, 70)),
  // numrera: a list of three items; the digits 1, 2, 3 appear one after another in orange circles, a pen beside them
  'ttype.numrera': all(bg(), sheet(18, 10, 74, 98, all(...[30, 56, 82].map((y) => lines(44, y, 40, 2, 6)))),
    ...[30, 56, 82].map((y, i) => moving(`ttypenum${i}`, '0%,15%{opacity:0;transform:scale(.4)}35%,100%{opacity:1;transform:scale(1)}', { dur: 3.2, delay: i * 0.5, spin: true },
      circle(31, y + 3, 8, HL, C.ink, 1.4), T(31, y + 7.5, String(i + 1), 12, C.white, 900))),
    pen(104, 92, 30, 1.1)),
  // vanliga frågor: a web page with a list of question rows; one is open and shows its answer; small people with question marks below
  'ttype.vanliga-frågor': all(bg(), rect(6, 6, 108, 78, C.white, 4, C.ink, 1.6), rect(6, 6, 108, 10, '#dfe5ea', 4, C.ink, 1.4), ...[14, 22, 30].map((x) => circle(x, 11, 2, C.grey, null)),
    ...[24, 38, 66].map((y) => all(circle(16, y, 5, HL, C.ink, 1), T(16, y + 3.4, '?', 8, C.white, 900), lines(26, y, 70, 1), path(`M102 ${y - 2} L106 ${y + 2} L110 ${y - 2}`, 'none', C.ink, 1.4))),
    rect(24, 44, 84, 16, '#eef6e8', 2, null), lines(28, 49, 70, 2, 5, '#9bbf8a'), line('M6 74 L114 74', C.grey2, 1),
    ...[30, 60, 90].map((x) => all(mhead(x, 100, 5, C.hair, x === 60 ? C.green : C.sky), T(x, 90, '?', 10, C.grey, 900)))),
  // lathund: a small card with three picture steps is taped to a coffee machine; the thick manual lies grey beside it
  'ttype.lathund': all(bg(), desk(92), rect(26, 18, 46, 74, C.dark, 4, C.ink, 1.8), rect(36, 60, 26, 20, '#3a3c46', 2, C.ink, 1.2), cup(49, 80, C.white),
    g('rotate(-5 49 38)', rect(30, 24, 38, 28, '#fff7d6', 1, C.ink, 1.2), rect(44, 21, 10, 5, 'rgba(230,230,200,0.85)', 0, null),
      cup(37, 42), arrow(42, 39, 46, 39, C.ink, 1.2), circle(51, 38, 3.4, C.red, C.ink, 1), arrow(56, 39, 59, 39, C.ink, 1.2), line('M62 42 C60 38 64 36 62 32', C.grey, 1.2)),
    ring(49, 38, 24), greyed(book(80, 64, 32, 26, BLUEB, all(lines(86, 72, 20, 2, 5, C.white))), rect(84, 89, 32, 3, C.white, 0, C.ink, 1))),

  // ── 4337 Recensioner ──
  // recensent: a person with a notepad watches a film on a screen and writes; above the screen a rating of four stars out of five
  'ttype.recensent': all(bg(), screen(52, 22, 62, 44, all(rect(55, 25, 56, 38, '#c9b8e8', 1, null), mhead(74, 40, 6, C.hair, C.red), mhead(92, 42, 5, '#c4542a', C.yellow))),
    stars5(58, 10, 4, 5, 12),
    P({ x: 28, h: 0.92, top: C.orange, hairStyle: 'long', mood: 'calm' }),
    sheet(34, 62, 20, 24, lines(37, 68, 14, 3, 5)), pen(52, 70, 25, 0.7), ring(44, 74, 15)),
  // såga (kritisera hårt): the review gives one star, the book is torn in two and a thumb points down and shakes
  'ttype.såga.2': all(bg(), newsPage(6, 8, 62, 104, all(rect(11, 13, 52, 7, C.ink, 1, null), stars5(16, 30, 1, 4.4, 10.5), lines(11, 42, 52, 4, 5),
      g('translate(36 82)', path('M-16 -18 L-1 -18 L2 -12 L-2 -6 L2 0 L-1 6 L2 12 L-16 12 Z', BLUEB, C.ink, 1.4), g('translate(4 4) rotate(12)', path('M-1 -18 L16 -18 L16 12 L2 12 L-1 6 L2 0 L-2 -6 L2 -12 Z', BLUEB, C.ink, 1.4))))),
    waShake('ttypesåg', thumbDown(88, 34, 1.3)),
    P({ x: 96, h: 0.5, top: C.purple, mood: 'frown' })),
  // läsvärd: an open book with a gold medal and sparkles, and reading glasses on it
  'ttype.läsvärd': all(bg(), openBook(56, 104, 1.2, lines(-36, -34, 30, 6, 5), lines(6, -34, 30, 6, 5)),
    g('translate(56 50)', circle(-9, 0, 7, 'rgba(230,244,252,0.6)', C.ink, 1.8), circle(9, 0, 7, 'rgba(230,244,252,0.6)', C.ink, 1.8), line('M-2 0 L2 0', C.ink, 1.8)),
    goldMedal(98, 22, 1.4), sparkle(18, 30, 5), sparkle(40, 20, 3.4), line('M86 34 L76 46', HL, 1.4, '3 3')),
  // sevärd: a cinema screen with a film on it, a gold medal and sparkles; seats in front
  'ttype.sevärd': all(bg('#2d2f3a'), rect(10, 14, 84, 52, '#f2f0ea', 2, C.ink, 1.6), rect(14, 18, 76, 44, '#bfe3f5', 1, null), path('M14 62 L34 40 L46 52 L58 34 L90 62 Z', GREENB, null), circle(76, 28, 5, C.yellow, null),
    ...[16, 36, 56, 76, 96].map((x) => all(rect(x - 8, 92, 16, 14, '#a33a3a', 4, C.ink, 1), rect(x - 8, 104, 16, 6, '#7d2b2b', 1, C.ink, 1))),
    goldMedal(104, 24, 1.3), sparkle(104, 60, 4, C.yellow)),
  // välskriven: a messy grey page with crossings-out next to a neat page with even lines, a fountain pen and a tick
  'ttype.välskriven': all(bg(), greyed(sheet(4, 14, 50, 70, all(line('M10 26 C20 22 30 30 46 24 M10 36 C18 40 30 32 40 38 M10 48 L44 46 M10 60 C22 56 30 64 38 58 M10 70 L30 72', C.ink, 1.6), line('M14 44 L40 52 M14 52 L40 44', C.ink, 1.6), path('M30 62 C36 56 44 66 48 60', 'none', C.ink, 2)))),
    sheet(62, 14, 54, 74, lines(68, 24, 42, 10, 5.6, C.navy, 1.6)), pen(110, 92, 30, 1), frame(58, 10, 62, 82), tick(90, 102, 1.6, C.green)),
  // gripande: a person reads a book with tears on her cheeks and a hand on her heart; a big heart glows above
  'ttype.gripande-adj.1': all(bg(), ground(), P({ x: 56, h: 1, top: C.purple, hairStyle: 'long', mood: 'frown' }),
    tear(50, 30, 0.9), tear(62, 33, 0.9), tear(49, 40, 0.7),
    book(30, 66, 22, 26, BLUEB), circle(64, 56, 3.4, C.skin, C.ink, 1.2),
    waPulse('ttypegri', heart(90, 22, 10, C.red), sparkle(76, 12, 3.4), sparkle(106, 36, 3.4))),
};
