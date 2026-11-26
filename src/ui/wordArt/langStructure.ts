/**
 * Kultur & fritid → Språk & litteratur → Språkets uppbyggnad, 4311–4317 (0.61): word classes and parts of
 * the sentence, word formation, prefixes and suffixes, meanings of words, idioms, registers and variation.
 * Recurring signs: words are white tiles with short Swedish example words (never the target term), the part
 * the word names is orange (filled tile or orange ring) and grey tiles or grey drawings are the reference.
 * Contrast pairs share one layout where only the marked part differs: subjekt/predikat/objekt (one reading
 * scene over the tiles ”Kenji läser en bok”), förled/efterled (one tile ”fot|boll”), prefix/suffix (front or
 * end tile), bokstavlig/bildlig (a real boat or a shared rain cloud), talspråk/skriftspråk (mouth or pen).
 * Idioms are drawn literally (the cow, the beard in the letter box, the cat round the porridge).
 * No brands; Japanese only as a red sun dot on a flag.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, sparkle, star, waBob, waIn, waShake, type Svg } from './kit';
import { HL, T, bubble, cat, cup, flake, mini, padlock, sun, thought } from './people';
import { figure } from './figures';
import { P, greyed } from './blindFix';

// ── Basics ───────────────────────────────────────────────────────────
const OR = '#fbd3bd';
const GT = '#e4e7eb';
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
/** Word tile centred at (x, y). */
const tile = (x: number, y: number, w: number, txt: string, fill: string = C.white, col: string = C.ink, fs = 8.5) =>
  all(rect(x - w / 2, y - 8, w, 16, fill, 3, C.ink, 1.4), T(x, y + 3, txt, fs, col, 700));
/** Marked (orange) tile. */
const hot = (x: number, y: number, w: number, txt: string, fs = 8.5) => all(tile(x, y, w, txt, OR, C.ink, fs), rect(x - w / 2 - 2.5, y - 10.5, w + 5, 21, 'none', 5, HL, 2.4));
/** Grey reference tile. */
const dim = (x: number, y: number, w: number, txt: string, fs = 8.5) => all(rect(x - w / 2, y - 8, w, 16, GT, 3, C.grey, 1.2), T(x, y + 3, txt, fs, C.grey, 700));
const plus = (x: number, y: number) => line(`M${x - 4} ${y} L${x + 4} ${y} M${x} ${y - 4} L${x} ${y + 4}`, C.ink, 2);
const eq = (x: number, y: number) => line(`M${x - 4} ${y - 2.5} L${x + 4} ${y - 2.5} M${x - 4} ${y + 2.5} L${x + 4} ${y + 2.5}`, C.ink, 2);
const cross = (x: number, y: number, r = 6, col: string = C.red) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 2.6);
const check = (x: number, y: number, col: string = C.green) => line(`M${x - 6} ${y} L${x - 2} ${y + 5} L${x + 7} ${y - 6}`, col, 3);

// ── Small pictures ───────────────────────────────────────────────────
const house = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, path('M-12 0 L-12 -14 L0 -24 L12 -14 L12 0 Z', col, C.ink, 1.6), rect(-4, -9, 8, 9, C.brown, 1, C.ink, 1.2), rect(4, -16, 5, 5, '#bfe3f5', 1, C.ink, 1));
const car = (x: number, y: number, s = 1, col: string = C.denim) => at(x, y, s, path('M-14 -2 L-14 -8 L-8 -9 L-4 -15 L7 -15 L11 -9 L15 -8 L15 -2 Z', col, C.ink, 1.5), rect(-3, -13, 8, 4, '#bfe3f5', 1, null), circle(-8, -1, 3.4, C.dark, C.ink, 1.2), circle(9, -1, 3.4, C.dark, C.ink, 1.2));
const ball = (x: number, y: number, r: number, col: string) => all(circle(x, y, r, col, C.ink, 1.6), path(`M${x - r * 0.6} ${y - r * 0.4} Q${x} ${y - r * 0.9} ${x + r * 0.5} ${y - r * 0.6}`, 'none', 'rgba(255,255,255,0.7)', 1.6));
const book = (x: number, y: number, s = 1, col: string = C.navy) => at(x, y, s, rect(-10, -13, 20, 26, col, 2, C.ink, 1.6), line('M-6 -13 L-6 13', 'rgba(0,0,0,0.25)', 2), rect(-2, -8, 9, 4, C.white, 1, null));
const openBook = (x: number, y: number, s = 1, lines = true) => at(x, y, s, path('M0 -14 C-8 -18 -18 -16 -24 -13 L-24 12 C-18 9 -8 9 0 13 Z', C.white, C.ink, 1.6), path('M0 -14 C8 -18 18 -16 24 -13 L24 12 C18 9 8 9 0 13 Z', C.white, C.ink, 1.6),
  lines ? line('M-20 -8 L-5 -9 M-20 -3 L-5 -4 M-20 2 L-5 1 M5 -9 L20 -8 M5 -4 L20 -3 M5 1 L20 2', C.grey2, 1.4) : '');
const runner = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s, circle(2, -30, 5, C.skin, C.ink, 1.4), line('M1 -25 L-2 -12', col, 5), line('M-1 -22 L-9 -16 M0 -22 L8 -26', C.skin, 2.6), line('M-2 -12 L6 -6 L4 1 M-2 -12 L-8 -4 L-14 -6', C.navy, 3));
const speed = (x: number, y: number) => line(`M${x} ${y} l-10 0 M${x + 2} ${y + 6} l-12 0 M${x} ${y + 12} l-9 0`, C.grey, 1.6);
const bowl = (x: number, y: number, s = 1, fill: string = C.white) => at(x, y, s, path('M-12 -4 L12 -4 C12 6 6 10 0 10 C-6 10 -12 6 -12 -4 Z', '#d9e8f2', C.ink, 1.5), ellipse(0, -4, 12, 3, fill, C.ink, 1.2));
const steam = (x: number, y: number) => line(`M${x - 5} ${y} c-3 -4 3 -6 0 -10 M${x + 1} ${y} c-3 -4 3 -6 0 -10 M${x + 7} ${y} c-3 -4 3 -6 0 -10`, C.grey, 1.4);
const tableTop = (y = 88, x1 = 10, x2 = 110) => all(rect(x1, y, x2 - x1, 6, C.tan, 2, C.ink, 1.6), line(`M${x1 + 8} ${y + 6} L${x1 + 8} 112 M${x2 - 8} ${y + 6} L${x2 - 8} 112`, C.brown, 3));
const qmark = (x: number, y: number, s = 12, col: string = C.navy) => T(x, y, '?', s, col, 900);
const flagSe = (x: number, y: number, w = 22, h = 14) => all(rect(x, y, w, h, '#2a65b3', 1, C.ink, 1.2), rect(x + w * 0.3, y, w * 0.14, h, C.yellow, 0, null), rect(x, y + h * 0.42, w, h * 0.16, C.yellow, 0, null));
const flagJp = (x: number, y: number, w = 22, h = 14) => all(rect(x, y, w, h, C.white, 1, C.ink, 1.2), circle(x + w / 2, y + h / 2, h * 0.3, C.red, null));
const lines = (x: number, y: number, w: number, n: number, gap = 5, col: string = C.grey2) => line(Array.from({ length: n }, (_, i) => `M${x} ${y + i * gap} L${x + w - (i % 3 === 2 ? 8 : 0)} ${y + i * gap}`).join(' '), col, 1.6);
/** Reading person (Kenji) seen from the side with a book: used for the sentence trio. */
const reader = (bookHL: boolean, actHL: boolean, personHL: boolean) => all(
  figure({ x: 34, h: 0.62, top: C.denim, bottom: C.navy }),
  book(58, 66, 0.75, C.red), line('M42 70 L50 66', C.skin, 3.5),
  actHL ? line('M44 56 L52 60 M44 59 L52 63', HL, 2) : line('M44 56 L52 60', C.grey, 1.4),
  personHL ? ring(34, 58, 13) : '', bookHL ? ring(58, 66, 13) : '', actHL ? ring(48, 60, 9) : '');
const sentence = (mark: 0 | 1 | 2 | -1, y = 98) => {
  const xs = [26, 60, 94], w = [30, 30, 32], txt = ['Kenji', 'läser', 'en bok'];
  return all(...xs.map((x, i) => (i === mark ? hot(x, y, w[i]!, txt[i]!) : mark === -1 ? tile(x, y, w[i]!, txt[i]!) : dim(x, y, w[i]!, txt[i]!))));
};

// ── 4311 Ordklasser och satsdelar ────────────────────────────────────
const M1: Record<string, Svg> = {
  // letters come together into one word
  'lstruc.ord': all(
    waIn('ls-ord-a', -18, -20, tile(34, 34, 16, 's', C.white, C.ink, 10)), waIn('ls-ord-b', 0, -22, tile(60, 30, 16, 'o', C.white, C.ink, 10)), waIn('ls-ord-c', 18, -20, tile(86, 34, 16, 'l', C.white, C.ink, 10)),
    arrow(60, 46, 60, 64, C.grey, 2.4), hot(60, 80, 40, 'sol', 11), sun(98, 82, 7)),
  // tiles are sorted into three boxes: things, actions, colours
  'lstruc.ordklass': all(ground(),
    ...[22, 60, 98].map((x, i) => all(path(`M${x - 16} 80 L${x - 13} 108 L${x + 13} 108 L${x + 16} 80 Z`, [C.sky, C.mint, '#f7d9a8'][i]!, C.ink, 1.6), rect(x - 17, 77, 34, 5, C.white, 1, C.ink, 1.2))),
    house(22, 100, 0.55), runner(62, 104, 0.6), ball(98, 96, 6, C.red),
    waIn('ls-okl-1', 0, -14, tile(22, 58, 26, 'hus')), waIn('ls-okl-2', 0, -14, tile(60, 50, 32, 'springa', C.white, C.ink, 7.5)), waIn('ls-okl-3', 0, -14, tile(98, 58, 24, 'röd')),
    frame(4, 70, 112, 42)),
  'lstruc.substantiv': all(ground(), house(40, 100, 1.4), car(88, 110, 1.1), hot(40, 30, 28, 'hus'), hot(88, 64, 26, 'bil'), line('M40 40 L40 62', C.grey, 1.4, '3 3'), line('M88 74 L88 90', C.grey, 1.4, '3 3')),
  'lstruc.verb': all(ground(), waBob('ls-verb', 2, runner(58, 110, 1.9)), speed(30, 70), hot(60, 22, 40, 'springa')),
  'lstruc.adjektiv': all(ground(), greyed(ball(30, 96, 11, C.grey)), ball(82, 90, 17, C.red), hot(82, 38, 26, 'röd'), arrow(82, 50, 82, 68, HL, 2.4)),
  'lstruc.adverb': all(ground(), greyed(runner(28, 110, 1.1)), runner(82, 110, 1.4), speed(60, 72), speed(56, 86), hot(70, 26, 36, 'snabbt'), arrow(70, 38, 72, 56, HL, 2.4)),
  // a name is replaced by a short word
  'lstruc.pronomen': all(ground(), P({ x: 34, h: 0.85, top: C.pink, hairStyle: 'long', mood: 'smile' }), dim(86, 30, 30, 'Anna'), cross(86, 30, 8),
    arrow(86, 42, 86, 56, HL, 2.4), hot(86, 70, 24, 'hon'), line('M74 70 L50 62', HL, 1.6, '3 3')),
  'lstruc.preposition': all(tableTop(70, 20, 100), cat(60, 104, 1.1), hot(60, 28, 32, 'under'), arrow(60, 40, 60, 62, HL, 2.4)),
  // a link joins two words
  'lstruc.konjunktion.2': all(cup(28, 82), at(92, 82, 1, path('M-7 -6 L7 -6 L6 6 C6 9 -6 9 -6 6 Z', '#f6e7b4', C.ink, 1.6)), tile(28, 52, 30, 'kaffe'), tile(92, 52, 22, 'te'), hot(60, 52, 22, 'och'),
    line('M43 52 L49 52 M71 52 L81 52', HL, 3), ground(100)),
  // capital letter … full stop: the whole row is one unit
  'lstruc.mening.4': all(rect(6, 46, 108, 30, C.white, 4, C.ink, 1.6),
    `<text x="60" y="66" font-family="system-ui,sans-serif" font-weight="700" font-size="10" text-anchor="middle" fill="${C.ink}"><tspan fill="${HL}" font-size="13" font-weight="900">K</tspan>enji läser en bok<tspan fill="${HL}" font-size="17" font-weight="900">.</tspan></text>`,
    path('M6 84 Q60 98 114 84', 'none', HL, 2.4), path('M6 40 Q60 26 114 40', 'none', HL, 2.4)),
  // one sentence cut into three parts
  'lstruc.satsdel': all(reader(false, false, false), sentence(-1, 92),
    path('M12 104 L12 108 L40 108 L40 104', 'none', C.green, 2.4), path('M46 104 L46 108 L74 108 L74 104', 'none', C.denim, 2.4), path('M79 104 L79 108 L109 108 L109 104', 'none', C.purple, 2.4),
    line('M43 80 L43 112 M76.5 80 L76.5 112', HL, 2, '3 3')),
  'lstruc.subjekt': all(reader(false, false, true), sentence(0)),
  'lstruc.predikat': all(reader(false, true, false), sentence(1)),
  'lstruc.objekt.3': all(reader(true, false, false), sentence(2)),
  // the verb moves from the end (grey, Japanese order) to second place
  'lstruc.ordföljd': all(dim(24, 34, 30, 'Kenji'), dim(60, 34, 32, 'en bok'), dim(96, 34, 30, 'läser'), flagJp(4, 10, 18, 12),
    tile(24, 82, 30, 'Kenji'), tile(96, 82, 32, 'en bok'), waIn('ls-ofj', 36, 0, hot(60, 82, 30, 'läser')), flagSe(4, 58, 18, 12),
    path('M96 44 C96 62 64 58 60 70', 'none', HL, 2.2), arrow(62, 66, 60, 71, HL, 2.2)),
  // one verb, three forms appear one after the other
  'lstruc.böja.2': all(hot(60, 18, 36, 'skriva'), line('M60 28 L60 36 M24 36 L96 36 M24 36 L24 46 M60 36 L60 46 M96 36 L96 46', C.ink, 1.6),
    moving('ls-boja-1', '0%,10%{opacity:0}30%,100%{opacity:1}', { dur: 3.6 }, tile(24, 58, 34, 'skriver', C.white, C.ink, 7.5)),
    moving('ls-boja-2', '0%,35%{opacity:0}55%,100%{opacity:1}', { dur: 3.6 }, tile(60, 58, 28, 'skrev', C.white, C.ink, 7.5)),
    moving('ls-boja-3', '0%,60%{opacity:0}80%,100%{opacity:1}', { dur: 3.6 }, tile(96, 58, 34, 'skrivit', C.white, C.ink, 7.5)),
    at(60, 96, 1, path('M-14 8 L18 -16 L22 -12 L-10 12 L-16 14 Z', C.yellow, C.ink, 1.4), path('M18 -16 L22 -12 L25 -15 L21 -19 Z', C.pink, C.ink, 1.2)), lines(20, 102, 22, 2, 5), lines(80, 102, 22, 2, 5)),
};

// ── 4312 Ordbildning ─────────────────────────────────────────────────
const footIcon = (x: number, y: number, s = 1, col: string = C.skin) => at(x, y, s, path('M-4 -12 C-6 -2 -8 4 -6 8 C-4 11 8 11 9 7 C10 4 4 2 3 -2 L3 -12 Z', col, C.ink, 1.4));
const fotboll = (side: 0 | 1) => all(ground(),
  footIcon(30, 56, 1.5, side === 0 ? C.skin : C.grey2), at(88, 54, 1, circle(0, 0, 13, side === 1 ? C.white : GT, C.ink, 1.6), path('M0 -5 L5 -1 L3 5 L-3 5 L-5 -1 Z', side === 1 ? C.dark : C.grey, null)),
  side === 0 ? ring(32, 56, 22) : ring(88, 54, 19),
  rect(14, 86, 92, 20, C.white, 4, C.ink, 1.6), rect(side === 0 ? 14 : 54, 86, side === 0 ? 40 : 52, 20, OR, 4, HL, 2.6), line('M54 86 L54 106', C.ink, 1.6),
  T(34, 100, 'fot', 10, side === 0 ? C.ink : C.grey, 800), T(80, 100, 'boll', 10, side === 1 ? C.ink : C.grey, 800));
const gear = (x: number, y: number, r: number, col: string = C.grey) => all(...Array.from({ length: 8 }, (_, i) => g(`rotate(${i * 45} ${x} ${y})`, rect(x - 2.5, y - r - 4, 5, 6, col, 1, C.ink, 1))), circle(x, y, r, col, C.ink, 1.4), circle(x, y, r * 0.35, C.white, C.ink, 1.2));
const M2: Record<string, Svg> = {
  // a word workshop: parts go in, a new word comes out
  'lstruc.ordbildning': all(ground(), rect(38, 50, 44, 40, C.navy, 4, C.ink, 1.8), moving('ls-obl-g', '0%{transform:rotate(0)}100%{transform:rotate(360deg)}', { dur: 4, spin: true }, gear(60, 66, 9, C.silver)),
    rect(30, 90, 60, 6, C.dark, 1, C.ink, 1.2), tile(18, 36, 22, 'tand', C.white, C.ink, 7.5), tile(18, 58, 26, 'läkare', C.white, C.ink, 7), arrow(30, 44, 38, 56, C.grey, 2),
    waIn('ls-obl-o', -16, 0, hot(98, 70, 34, 'tandläkare', 6.5)), sparkle(106, 52, 5), sparkle(88, 50, 3.5)),
  // two words + become one word
  'lstruc.sammansättning.2': all(sun(22, 30, 8), at(60, 34, 1, path('M-10 8 L-6 -10 L8 -10 L4 8 Z M-12 8 L10 8', '#e8c477', C.ink, 1.4)), tile(22, 54, 24, 'sol'), plus(41, 54), tile(60, 54, 26, 'stol'), eq(78, 54),
    hot(98, 54, 30, 'solstol', 7), ground(), sun(80, 84, 6), at(98, 104, 1.1, path('M-16 0 L-6 -18 L12 -18 M-6 -18 L4 0 M-14 -6 L10 -6', 'none', C.brown, 2.4), path('M-6 -18 L12 -18 L6 -6 L-12 -6 Z', '#f7d9a8', C.ink, 1.2))),
  'lstruc.förled': fotboll(0),
  'lstruc.efterled': fotboll(1),
  // one fixed core with changing endings
  'lstruc.stam.4': all(...[[22, 26, '-er'], [98, 26, '-te'], [22, 96, '-a'], [98, 96, '-are']].map(([x, y, t]) => all(line(`M${x} ${y} L60 60`, C.grey2, 1.6, '3 3'), dim(x as number, y as number, 28, t as string))), hot(60, 60, 30, 'läs', 11)),
  // a gap splits the word: now the nurse is the one who is ill
  'lstruc.särskrivning': all(tile(24, 22, 30, 'sjuk'), tile(82, 22, 50, 'sköterska', C.white, C.ink, 7.5), rect(43, 12, 10, 20, '#fde0d6', 2, C.red, 2), cross(48, 22, 4),
    rect(12, 78, 96, 14, C.white, 3, C.ink, 1.6), line('M14 92 L14 108 M106 92 L106 108', C.brown, 3), rect(14, 66, 22, 14, C.white, 6, C.ink, 1.4),
    circle(32, 66, 8, C.skin, C.ink, 1.4), path('M26 60 L38 60 L37 56 L27 56 Z', C.white, C.ink, 1.2), line('M31 56 L31 58 M30 57 L32 57', C.red, 1.2), line('M28 67 L30 66 M34 66 L36 67', C.ink, 1.1),
    path('M36 76 C56 70 90 70 106 76 L106 80 L36 80 Z', C.sky, C.ink, 1.4), line('M24 70 L18 62', C.dark, 1.6), rect(16, 58, 4, 6, C.red, 1, null), drops(46, 48), ring(32, 64, 14)),
  'lstruc.bindestreck': all(at(60, 86, 1.3, rect(-16, -11, 32, 22, C.white, 2, C.ink, 1.6), path('M-16 -11 L0 3 L16 -11', 'none', C.ink, 1.4)),
    T(28, 46, 'e', 16, C.ink, 800), T(84, 46, 'post', 16, C.ink, 800), rect(44, 37, 14, 5, HL, 1.5, null), ring(51, 40, 11), rect(14, 26, 92, 28, 'none', 4, C.ink, 1.4)),
  'lstruc.kortord': all(dim(60, 22, 56, 'biograf', 10), arrow(60, 34, 60, 50, HL, 2.4), hot(60, 62, 28, 'bio', 11),
    rect(26, 80, 68, 26, C.dark, 2, C.ink, 1.6), rect(30, 83, 60, 18, '#bfe3f5', 1, null), path('M54 87 L66 92 L54 97 Z', C.white, null), ...[34, 46, 74, 86].map((x) => circle(x, 110, 3, C.dark, null))),
  // a new word flies into the old word list
  'lstruc.nyord': all(rect(22, 14, 64, 92, C.white, 3, C.ink, 1.6), ...[26, 40, 54, 68].map((y) => rect(30, y, 40 - (y % 3) * 4, 8, GT, 2, null)),
    waIn('ls-nyord', 24, -10, all(rect(30, 82, 52, 12, OR, 3, HL, 2.2), rect(34, 86, 30, 4, C.white, 1, null))), sparkle(94, 80, 6), sparkle(88, 98, 4), star(98, 64, 5)),
  'lstruc.uppslagsord': all(openBook(60, 66, 2.1, false), rect(18, 40, 30, 8, C.ink, 2, null), ring(33, 44, 18), lines(18, 56, 34, 6, 6), lines(72, 40, 32, 9, 6),
    at(96, 98, 1, circle(0, 0, 9, 'rgba(191,227,245,0.5)', C.ink, 2), line('M6 6 L14 14', C.ink, 3.4))),
};
function drops(x: number, y: number): Svg { return line(`M${x - 6} ${y} l-2 4 M${x + 2} ${y + 2} l-2 4`, C.sky, 1.8); }

// ── 4313 Prefix och suffix ───────────────────────────────────────────
const M3: Record<string, Svg> = {
  'lstruc.prefix': all(hot(24, 50, 18, 'o', 12), plus(42, 50), dim(70, 50, 38, 'ärlig', 10), arrow(24, 22, 24, 36, HL, 2.6),
    waIn('ls-prefix', -20, 0, all(hot(36, 88, 18, 'o', 11), tile(70, 88, 38, 'ärlig', C.white, C.ink, 10))), line('M14 74 L106 74', C.grey2, 1.4, '3 3')),
  'lstruc.suffix': all(dim(46, 50, 40, 'vänlig', 9.5), plus(72, 50), hot(94, 50, 26, 'het', 10), arrow(94, 22, 94, 36, HL, 2.6),
    waIn('ls-suffix', 20, 0, all(tile(40, 88, 40, 'vänlig', C.white, C.ink, 9.5), hot(76, 88, 26, 'het', 10))), line('M14 74 L106 74', C.grey2, 1.4, '3 3')),
  // one word, two new words grow out of it
  'lstruc.avledning': all(dim(60, 96, 38, 'ärlig', 10), arrow(52, 86, 32, 58, HL, 2.4), arrow(68, 86, 88, 58, HL, 2.4), hot(30, 44, 38, 'oärlig', 9), hot(88, 44, 46, 'ärlighet', 8.5), sparkle(60, 30, 5)),
  // same word, the end changes when there are two
  'lstruc.ändelse': all(ground(), car(30, 54, 1.1), tile(30, 78, 26, 'bil', C.white, C.ink, 10), arrow(48, 70, 62, 70, C.grey, 2.2),
    car(82, 48, 0.9), car(98, 60, 0.9, C.red), all(rect(68, 70, 44, 16, C.white, 3, C.ink, 1.4), T(82, 81, 'bil', 10, C.ink, 700), rect(94, 70, 18, 16, OR, 3, HL, 2.4), T(103, 81, 'ar', 10, C.ink, 800))),
  // inflected forms lead back to the form in the dictionary
  'lstruc.grundform': all(dim(22, 20, 32, 'sprang', 8), dim(60, 14, 36, 'springer', 7.5), dim(98, 20, 34, 'sprungit', 7.5),
    arrow(26, 30, 50, 52, C.grey, 2), arrow(60, 24, 60, 50, C.grey, 2), arrow(94, 30, 70, 52, C.grey, 2), hot(60, 64, 42, 'springa', 9.5), openBook(60, 96, 1.4, true)),
};

// ── 4314 Ords betydelser ─────────────────────────────────────────────
const fork = (x: number, y: number) => line(`M${x} ${y} L${x} ${y + 14} M${x - 3} ${y} L${x - 3} ${y + 5} M${x + 3} ${y} L${x + 3} ${y + 5} M${x - 3} ${y + 5} L${x + 3} ${y + 5}`, C.silver, 1.6);
/** Butterfly (for ”ha fjärilar i magen”). */
const butterfly = (x: number, y: number, s = 1, col: string = C.yellow) => at(x, y, s, ellipse(-4, -3, 4, 3.4, col, C.ink, 1), ellipse(4, -3, 4, 3.4, col, C.ink, 1), ellipse(-3, 3, 3, 2.4, col, C.ink, 1), ellipse(3, 3, 3, 2.4, col, C.ink, 1), line('M0 -5 L0 5', C.ink, 1.4));
/** Shared layout for bokstavlig/bildlig: the expression in a bubble at the top, one interpretation framed below. */
const fjarilar = (scene: Svg) => all(rect(14, 6, 92, 22, C.white, 6, C.ink, 1.6), path('M54 28 L60 35 L66 28', C.white, C.ink, 1.6), rect(55, 26, 10, 3, C.white, 0, null),
  T(60, 21, 'fjärilar i magen', 9, C.navy, 800), frame(8, 40, 104, 72), scene);
const M4: Record<string, Svg> = {
  // a word points at what it stands for
  'lstruc.betydelse': all(hot(28, 40, 28, 'katt', 10), arrow(44, 46, 62, 60, HL, 2.6), thought(84, 50, 48, cat(84, 60, 0.9), true), ring(84, 56, 22), ground(), cat(32, 104, 0.8)),
  // alone the word is unclear; in the scene it is clear
  'lstruc.sammanhang.2': all(dim(28, 22, 28, 'rätt', 10), qmark(50, 26, 14, C.grey),
    tableTop(90, 22, 112), rect(26, 46, 82, 42, 'none', 6, HL, 2.6), P({ x: 46, h: 0.5, top: C.green, mood: 'smile' }), tile(86, 56, 28, 'rätt', C.white, C.ink, 10),
    at(86, 84, 1, ellipse(0, 0, 14, 4.5, C.white, C.ink, 1.4), ellipse(0, -2, 8, 3, C.orange, null), ellipse(4, -3, 3, 2, C.green, null)), fork(106, 72)),
  // two words, one meaning
  'lstruc.synonym': all(tile(26, 24, 30, 'börja'), tile(94, 24, 30, 'starta'), eq(60, 24), arrow(30, 34, 52, 58, HL, 2.4), arrow(90, 34, 68, 58, HL, 2.4),
    ground(), line('M30 110 L30 64 L48 70 L30 76', C.ink, 1.8), path('M30 64 L48 70 L30 76 Z', C.green, null), line('M24 112 L96 112', C.white, 3, '6 6'), runner(78, 110, 1.3)),
  // two words with opposite meanings
  'lstruc.motsatsord': all(sun(28, 50, 13), flake(92, 50, 2), hot(28, 92, 30, 'varm'), hot(92, 92, 26, 'kall'), path('M48 92 L72 92', 'none', C.ink, 2.2), arrow(66, 92, 74, 92, C.ink, 2.2), arrow(54, 92, 46, 92, C.ink, 2.2),
    rect(4, 22, 52, 56, '#fff1d8', 6, null), rect(64, 22, 52, 56, '#e3f1fb', 6, null), sun(30, 50, 13), flake(90, 50, 2.2)),
  // one word, two unrelated things
  'lstruc.homonym': all(hot(60, 20, 26, 'fil', 11), arrow(50, 30, 30, 50, HL, 2.4), arrow(70, 30, 90, 50, HL, 2.4),
    at(28, 80, 1.3, path('M-12 -4 L12 -4 C12 6 6 10 0 10 C-6 10 -12 6 -12 -4 Z', '#d9e8f2', C.ink, 1.4), ellipse(0, -4, 12, 3, C.white, C.ink, 1.2)), line('M34 66 L44 54', C.silver, 2.4),
    path('M74 108 L84 58 L98 58 L110 108 Z', C.grey, C.ink, 1.4), line('M91 62 L91 70 M91 78 L91 86 M91 94 L91 104', C.white, 2)),
  // literally: real butterflies fly out of a surprised person's stomach
  'lstruc.bokstavlig': fjarilar(all(P({ x: 40, h: 0.62, top: C.sky, mood: 'shock' }), ellipse(40, 86, 9, 8, 'rgba(255,255,255,0.75)', HL, 1.6),
    butterfly(40, 86, 0.8), butterfly(62, 74, 1.1, C.orange), butterfly(80, 60, 1.2, C.purple), butterfly(94, 82, 1, C.yellow), line('M48 82 C56 80 58 78 60 76', C.grey, 1.2, '2 2'))),
  // figuratively: the same words mean being nervous before a test; the heart beats fast
  'lstruc.bildlig': fjarilar(all(rect(56, 92, 52, 5, C.tan, 1, C.ink, 1.4), line('M62 97 L62 112 M102 97 L102 112', C.brown, 2.6), rect(70, 82, 22, 10, C.white, 1, C.ink, 1.2), line('M73 85 L88 85 M73 88 L84 88', C.grey, 1),
    P({ x: 40, h: 0.62, top: C.sky, mood: 'frown' }), line('M27 54 l-1 4 M53 54 l1 4', C.sky, 1.8), at(86, 58, 0.8, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', C.red, C.ink, 1.4)),
    line('M70 58 L74 58 L76 52 L79 64 L81 58 L84 58', HL, 1.6), line('M96 58 L102 58', HL, 1.6))),
};

// ── 4315 Idiom och fasta uttryck ─────────────────────────────────────
const cow = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, -12, 16, 9, C.white, C.ink, 1.6), ellipse(-5, -14, 5, 4, C.dark, null), ellipse(7, -10, 4, 3, C.dark, null),
  line('M-11 -5 L-11 4 M-5 -4 L-5 4 M6 -4 L6 4 M12 -5 L12 4', C.ink, 2.4), ellipse(19, -18, 7, 5.5, C.white, C.ink, 1.5), ellipse(23, -16, 3, 2.4, C.pink, C.ink, 0.8), line('M15 -23 L13 -27 M20 -23 L21 -27', C.ink, 1.6), circle(18, -20, 0.9, C.ink, null),
  path('M-16 -14 C-20 -12 -20 -6 -18 -4', 'none', C.ink, 1.4));
const card = (x: number, y: number, rot: number, suit: string, col: string = C.red) => g(`rotate(${rot} ${x} ${y})`, rect(x - 8, y - 11, 16, 22, C.white, 2, C.ink, 1.3), T(x, y + 4, suit, 11, col, 700));
const shoe = (x: number, y: number, col: string = C.dark) => path(`M${x - 7} ${y} L${x - 7} ${y - 5} L${x - 1} ${y - 5} L${x + 7} ${y - 2} L${x + 7} ${y} Z`, col, C.ink, 1.2);
const M5: Record<string, Svg> = {
  // word for word gives a wrong picture; the whole expression gives the meaning
  'lstruc.idiom': all(rect(10, 10, 100, 24, C.white, 4, C.ink, 1.6), ...[28, 52, 76, 96].map((x, i) => rect(x - 9, 16, [18, 14, 18, 14][i]!, 12, C.grey2, 2, null)), path('M30 34 L36 42 L42 34', C.white, C.ink, 1.6),
    arrow(32, 46, 24, 64, C.grey, 2.2), arrow(88, 46, 96, 64, HL, 2.6), greyed(cow(26, 92, 0.75), rect(6, 94, 40, 8, '#d4ecf7', 2, C.grey, 1)), cross(26, 82, 12),
    circle(94, 88, 16, OR, HL, 2.4), path('M86 92 Q94 99 102 92', 'none', C.ink, 2), circle(89, 84, 1.8, C.ink, null), circle(99, 84, 1.8, C.ink, null), check(110, 66)),
  // words locked together
  'lstruc.fast-uttryck': all(tile(26, 54, 30, 'fatta'), tile(58, 54, 22, 'ett'), tile(92, 54, 36, 'beslut'), line('M41 54 L47 54 M69 54 L74 54', HL, 4), frame(6, 40, 108, 28), padlock(60, 92, 1.5, false, C.gold), line('M60 68 L60 78', C.ink, 1.6)),
  // an old person tells a short wise sentence
  'lstruc.ordspråk': all(ground(), P({ x: 34, h: 0.9, top: C.purple, hair: C.grey2, mood: 'calm' }), line('M50 88 L54 112', C.brown, 2.6),
    bubble(82, 30, 52, all(rect(62, 23, 40, 12, '#f7ecd0', 2, C.ink, 1), circle(62, 29, 3, '#e6d3b3', C.ink, 1), circle(102, 29, 3, '#e6d3b3', C.ink, 1), line('M68 27 L96 27 M68 31 L90 31', C.brown, 1.2)), true),
    at(82, 70, 1, circle(0, 0, 7, C.yellow, C.ink, 1.4), rect(-3, 6, 6, 5, C.grey, 1, C.ink, 1)), sparkle(98, 62, 4)),
  // the cow is safe on land, the ice is empty: no hurry
  'lstruc.ingen-ko-på-isen': all(rect(4, 96, 50, 16, '#9ccc8a', 0, null), rect(56, 82, 60, 30, '#d4ecf7', 6, '#7fb7d9', 1.6), line('M66 92 L76 96 M92 90 L104 98', C.white, 1.6), ring(86, 96, 14), check(86, 96),
    cow(20, 100, 0.75), P({ x: 46, h: 0.62, top: C.orange, mood: 'calm' }), cup(60, 44)),
  // gliding in on a big shrimp sandwich
  'lstruc.glida-in-på-en-räkmacka': all(ground(), rect(92, 30, 20, 82, C.brown, 2, C.ink, 1.6), circle(96, 72, 1.6, C.gold, null), star(102, 20, 5),
    waIn('ls-rakm', -40, 0, all(at(52, 100, 1, rect(-26, -6, 52, 9, '#d9a35f', 3, C.ink, 1.4), path('M-24 -6 C-16 -12 16 -12 24 -6 Z', '#9ccc8a', C.ink, 1),
      ...[-16, -6, 4, 14].map((x) => path(`M${x - 4} -9 C${x - 4} -14 ${x + 4} -14 ${x + 4} -9 C${x + 2} -11 ${x - 2} -11 ${x - 4} -9 Z`, '#f49a7f', C.ink, 0.8))),
      P({ x: 52, h: 0.55, top: C.sky, mood: 'laugh' }))), speed(22, 74)),
  // the beard is caught in the letter box of the door
  'lstruc.sitta-med-skägget-i-brevlådan': all(ground(), rect(24, 10, 72, 102, C.brown, 2, C.ink, 1.8), rect(30, 18, 60, 36, '#8a5533', 2, C.ink, 1.2), rect(30, 62, 60, 40, '#8a5533', 2, C.ink, 1.2),
    rect(42, 66, 36, 9, C.dark, 2, C.silver, 1.6), circle(84, 82, 2.4, C.gold, C.ink, 1),
    waShake('ls-skagg', path('M48 75 C46 90 54 100 60 104 C66 100 74 90 72 75 Z', '#b9a089', C.ink, 1.4), line('M54 80 L55 94 M60 80 L60 98 M66 80 L65 94', '#8c7660', 1.2)), ring(60, 76, 16), qmark(104, 40, 14, C.red)),
  // the cat walks round and round the hot porridge
  'lstruc.gå-som-katten-kring-het-gröt': all(ground(), ellipse(60, 100, 44, 10, 'none', C.grey2, 1.4), bowl(60, 82, 1.4, '#f0e2c0'), steam(60, 64),
    moving('ls-katt', '0%{transform:rotate(0)}100%{transform:rotate(360deg)}', { dur: 6, spin: true }, all(circle(60, 82, 40, 'none', null), cat(94, 98, 0.65)))),
  // promising gold and green forests: much more than he can give
  'lstruc.lova-guld-och-gröna-skogar': all(ground(), P({ x: 26, h: 0.78, top: C.dark, mood: 'laugh' }), line('M34 62 L44 52', C.skin, 4),
    bubble(70, 26, 76, all(...[[44, 22], [52, 28], [60, 22]].map(([x, y]) => waIn(`ls-guld-${x}`, -6, 8, all(circle(x!, y!, 5, C.gold, C.ink, 1.2), circle(x!, y!, 2.6, 'none', '#b88a20', 1)))),
      ...[78, 90, 102].map((x, k) => all(rect(x - 1.5, 26 + (k % 2), 3, 6, C.brown, 0, null), path(`M${x} ${12 + (k % 2) * 2} L${x + 6} ${27 + (k % 2)} L${x - 6} ${27 + (k % 2)} Z`, C.green, C.ink, 1)))), true),
    P({ x: 96, h: 0.7, top: C.orange, mood: 'frown' }), qmark(110, 56, 12)),
  // the thumb in the middle of the hand: the hammer slips
  'lstruc.ha-tummen-mitt-i-handen': all(at(56, 66, 1.4, path('M-16 20 L-16 -6 C-16 -10 -10 -10 -10 -6 L-10 -18 C-10 -22 -4 -22 -4 -18 L-4 -20 C-4 -24 2 -24 2 -20 L2 -18 C2 -22 8 -22 8 -18 L8 -4 L10 -2 L14 16 L-16 22 Z', C.skin, C.ink, 1.6),
      ellipse(-3, 6, 4, 7, '#e9b48c', C.ink, 1.3), ring(-3, 6, 9)),
    waShake('ls-tumme', g('rotate(28 96 40)', rect(92, 22, 6, 40, C.brown, 1, C.ink, 1.2), rect(84, 16, 22, 10, C.dark, 2, C.ink, 1.2))), line('M100 70 l6 4 M104 64 l8 0', C.grey, 1.6), qmark(18, 30, 14, C.red)),
  // the cards are laid face up on the table
  'lstruc.lägga-korten-på-bordet': all(tableTop(78, 6, 114), card(34, 66, -10, '♥'), card(52, 64, 0, '♠', C.ink), card(70, 64, 8, '♦'),
    waIn('ls-kort', 0, -26, all(card(90, 64, 14, '♣', C.ink), path('M84 40 C92 36 100 40 104 48 L96 54 L86 50 Z', C.skin, C.ink, 1.4), line('M104 48 L116 30', C.sky, 7))), frame(20, 48, 88, 30)),
  // at the door: shoes off, like everybody else here
  'lstruc.ta-seden-dit-man-kommer': all(ground(), rect(92, 18, 24, 94, C.brown, 2, C.ink, 1.6), circle(96, 66, 1.8, C.gold, null), shoe(12, 112, C.grey), shoe(27, 112, C.grey), shoe(42, 112, C.grey),
    waIn('ls-sko', 12, -18, shoe(57, 112, C.red)), ring(57, 108, 10), P({ x: 76, h: 0.68, top: C.orange, mood: 'smile' })),
  // travelling is fine, home is best
  'lstruc.borta-bra-men-hemma-bäst': all(ground(), greyed(at(28, 46, 1, path('M-14 0 C-14 -2 10 -3 14 0 C10 3 -14 2 -14 0 Z M-2 -1 L-8 -12 L-4 -12 L6 -1 Z M-2 1 L-8 12 L-4 12 L6 1 Z', C.white, C.ink, 1.2)), at(28, 100, 1, rect(-9, -8, 18, 16, C.denim, 3, C.ink, 1.4))),
    house(84, 112, 2.2, C.red), at(84, 30, 1, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', C.red, C.ink, 1.4)), frame(54, 14, 60, 98)),
};

// ── 4316 Språkliga register ──────────────────────────────────────────
const suitPerson = (x: number, h: number) => all(P({ x, h, top: C.dark, bottom: C.dark, mood: 'smile' }), path(`M${x - 1.5} ${112 - 49 * 0.84 * h - 42 * 0.84 * h} l3 0 l1 ${14 * h} l-2.5 ${3 * h} l-2.5 ${-3 * h} Z`, C.red, null));
const M6: Record<string, Svg> = {
  // the same person speaks one way to a child and another way to a boss
  'lstruc.register.2': all(ground(), P({ x: 60, h: 0.8, top: C.green, mood: 'smile' }), P({ x: 16, h: 0.42, top: C.yellow, mood: 'laugh' }), suitPerson(104, 0.78),
    bubble(32, 22, 34, all(heart2(26, 22), star(38, 22, 4)), false), bubble(86, 22, 40, lines(70, 18, 32, 3, 4, C.navy), true), ring(60, 50, 16)),
  // manual track: the same person writes two messages. Framed: a letter to the authority (envelope, stamp,
  // straight lines, greeting line; a casual ”Hej!” is crossed out). Grey: a chat message to a friend.
  'lstruc.formell': all(
    rect(6, 6, 64, 72, C.white, 2, C.ink, 1.6), rect(10, 10, 26, 14, C.white, 1, C.ink, 1.2), path('M10 10 L23 19 L36 10', 'none', C.ink, 1.1), rect(29, 12, 5, 5, C.red, 0.5, null),
    circle(58, 18, 7, 'none', C.navy, 1.6), circle(58, 18, 3.4, C.navy, null), lines(12, 32, 52, 5, 5, C.navy), line('M12 62 L40 62', C.ink, 1.8), path('M12 72 C16 66 20 76 24 69 C28 64 30 74 36 70', 'none', C.navy, 1.2),
    bubble(56, 64, 22, T(56, 67, 'Hej!', 7, C.grey, 800), false), cross(56, 62, 8), frame(2, 2, 72, 80),
    greyed(rect(84, 10, 30, 54, C.dark, 4, C.ink, 1.4), rect(87, 16, 24, 40, '#bfe3f5', 1, null), rect(89, 20, 18, 9, C.white, 3, null), T(98, 27, '!!', 7, C.red, 900),
      circle(98, 42, 6, C.yellow, C.ink, 1), circle(96, 41, 0.9, C.ink, null), circle(100, 41, 0.9, C.ink, null), path('M95 44 Q98 47 101 44', 'none', C.ink, 1)),
    ground(), mini(38, 96, C.green), at(38, 112, 1, rect(-30, -14, 60, 4, C.tan, 1, C.ink, 1.2)), line('M46 104 L56 100', C.skin, 3), arrow(40, 88, 38, 84, HL, 2),
    greyed(mini(98, 96, C.green), at(98, 112, 1, rect(-14, -14, 28, 4, C.tan, 1, C.ink, 1.2))), arrow(98, 88, 98, 68, C.grey, 2)),
  // polite: holding the door with a smile and a little bow; the other says thanks. Grey: someone pushing in first
  'lstruc.artig': all(ground(), rect(92, 20, 24, 92, C.brown, 2, C.ink, 1.6), path('M92 20 L80 28 L80 106 L92 112 Z', '#8a5533', C.ink, 1.4),
    g('rotate(-10 74 112)', P({ x: 74, h: 0.8, top: C.green, mood: 'smile' })), line('M80 62 L88 58', C.skin, 4),
    P({ x: 42, h: 0.74, top: C.pink, hairStyle: 'long', mood: 'laugh' }), bubble(44, 20, 30, all(heart2(38, 20), check(51, 20)), true),
    greyed(P({ x: 12, h: 0.62, top: C.grey, mood: 'angry' })), arrow(4, 46, 20, 46, C.grey, 2), frame(26, 6, 66, 106)),
  // the doctor's special words; the patient does not follow
  'lstruc.fackspråk': all(ground(), P({ x: 36, h: 0.9, top: C.white, mood: 'smile' }), path('M30 40 C28 54 44 54 42 40', 'none', C.dark, 1.6), circle(36, 55, 2.4, C.silver, C.ink, 1),
    bubble(78, 22, 56, all(T(62, 26, 'Hb', 8, C.navy, 800), T(78, 26, 'mmol', 7, C.navy, 800), T(96, 26, '∑', 9, C.navy, 800)), true), P({ x: 92, h: 0.72, top: C.orange, mood: 'shock' }), qmark(108, 50, 12)),
  // an official letter full of small text and paragraph signs
  'lstruc.myndighetsspråk': all(rect(20, 10, 58, 80, C.white, 2, C.ink, 1.6), at(49, 22, 1, path('M-6 -6 L6 -6 L6 2 C6 6 0 8 0 8 C0 8 -6 6 -6 2 Z', C.navy, C.ink, 1)), lines(26, 34, 46, 10, 4, C.grey), T(68, 84, '§', 14, C.navy, 800), T(32, 84, '§', 10, C.navy, 800),
    ground(), P({ x: 96, h: 0.72, top: C.green, mood: 'frown' }), qmark(96, 22, 14, C.red), frame(16, 6, 66, 88)),
  // an ugly word after hitting the thumb
  'lstruc.svordom': all(ground(), P({ x: 34, h: 0.9, top: C.orange, mood: 'angry' }), g('rotate(-30 58 74)', rect(54, 60, 5, 30, C.brown, 1, C.ink, 1.2), rect(48, 56, 18, 8, C.dark, 2, C.ink, 1.2)),
    path('M64 12 L74 20 L82 8 L88 20 L100 12 L98 26 L112 30 L100 38 L106 50 L92 46 L86 58 L80 46 L66 50 L70 38 L58 32 L70 26 Z', '#ffe9a8', C.red, 2), T(85, 36, '#@!', 12, C.red, 900)),
};
function heart2(x: number, y: number): Svg { return g(`translate(${x} ${y}) scale(0.5)`, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', C.red, C.ink, 1.4)); }

// ── 4317 Dialekter och variation ─────────────────────────────────────
const wave = (x: number, y: number, w: number, col: string, amp = 3) => path(`M${x} ${y} q${w / 8} ${-amp} ${w / 4} 0 t${w / 4} 0 t${w / 4} 0 t${w / 4} 0`, 'none', col, 2);
const zig = (x: number, y: number, w: number, col: string) => line(`M${x} ${y} l${w / 6} -4 l${w / 6} 8 l${w / 6} -8 l${w / 6} 8 l${w / 6} -8 l${w / 6} 4`, col, 2);
const mouth = (x: number, y: number) => at(x, y, 1, path('M-14 -4 C-6 -12 6 -12 14 -4 C8 10 -8 10 -14 -4 Z', '#c84a4a', C.ink, 1.6), path('M-10 -4 C-4 -8 4 -8 10 -4 L10 -2 L-10 -2 Z', C.white, null));
const M7: Record<string, Svg> = {
  // the same word sounds different from person to person
  'lstruc.variation': all(...[[20, 30, C.green, 0], [60, 22, C.orange, 1], [100, 30, C.purple, 2]].map(([x, y, c, k]) => all(
      bubble(x as number, y as number, 32, k === 0 ? wave((x as number) - 12, y as number, 24, c as string) : k === 1 ? zig((x as number) - 12, (y as number) + 1, 24, c as string) : wave((x as number) - 12, y as number, 24, c as string, 6), true))),
    ground(), P({ x: 22, h: 0.6, top: C.green, mood: 'smile' }), P({ x: 60, h: 0.62, top: C.orange, hairStyle: 'long', mood: 'smile' }), P({ x: 100, h: 0.58, top: C.purple, mood: 'smile' }), frame(4, 6, 112, 40)),
  // spoken: mouth and sound waves (the pen is grey)
  'lstruc.talspråk': all(mouth(40, 60), ...[0, 1, 2].map((i) => path(`M${62 + i * 10} ${44 - i * 4} C${70 + i * 10} ${52} ${70 + i * 10} ${68} ${62 + i * 10} ${76 + i * 4}`, 'none', HL, 2.4)), ring(40, 60, 24),
    greyed(rect(70, 92, 40, 16, C.white, 1, C.ink, 1.2), line('M74 98 L104 98 M74 103 L98 103', C.grey, 1.2), g('rotate(-35 96 92)', rect(94, 76, 4, 18, C.yellow, 1, C.ink, 1)))),
  // written: a hand writes on paper (the mouth is grey)
  'lstruc.skriftspråk': all(rect(28, 44, 70, 56, C.white, 2, C.ink, 1.6), lines(34, 54, 56, 6, 7, C.navy), g('rotate(-35 86 76)', rect(84, 50, 6, 30, C.yellow, 1, C.ink, 1.2), path('M84 80 L87 86 L90 80 Z', C.tan, C.ink, 1)), ring(64, 72, 40),
    greyed(at(20, 22, 0.6, path('M-14 -4 C-6 -12 6 -12 14 -4 C8 10 -8 10 -14 -4 Z', '#c84a4a', C.ink, 1.6)), line('M34 16 C38 20 38 26 34 30', C.grey, 1.6))),
  // two groups: each speaks its own way
  'lstruc.sociolekt': all(ground(), ...[14, 38].map((x) => all(P({ x, h: 0.6, top: C.orange, mood: 'smile' }), path(`M${x - 8} ${62} C${x - 8} ${54} ${x + 8} ${54} ${x + 8} ${62} Z`, C.yellow, C.ink, 1.2))),
    ...[82, 106].map((x) => suitPerson(x, 0.62)), bubble(26, 22, 40, zig(10, 23, 32, C.orange), true), bubble(94, 22, 40, wave(78, 22, 32, C.navy), false),
    frame(2, 8, 50, 104, C.orange), frame(68, 8, 50, 104, C.navy)),
  // young people with their own words; the older man does not follow
  'lstruc.ungdomsspråk': all(ground(), P({ x: 30, h: 0.62, top: C.purple, mood: 'laugh' }), P({ x: 58, h: 0.6, top: C.green, hairStyle: 'long', mood: 'laugh' }),
    path('M20 54 C20 46 40 46 40 54 L46 54 L40 52', C.red, C.ink, 1.2), bubble(44, 22, 44, all(star(32, 22, 4), sparkle(44, 22, 4), star(56, 22, 4, C.orange)), true),
    greyed(P({ x: 98, h: 0.8, top: C.grey, mood: 'shock' })), qmark(98, 22, 14, C.grey), frame(6, 6, 72, 106)),
  // manual track: two bilingual friends; mid-sentence the speaker jumps from Swedish to Japanese (でも).
  // Grey below: reading from a dictionary and translating is not code-switching.
  'lstruc.kodväxla': all(
    path('M8 8 L112 8 L112 32 L40 32 L32 40 L32 32 L8 32 Z', C.white, C.ink, 1.6), flagSe(12, 13, 14, 9), T(48, 24, 'Jag vill,', 8, C.ink, 800),
    moving('ls-kodv-pil', '0%,100%{opacity:1}50%{opacity:.3}', { dur: 1.6 }, path('M68 20 C72 12 78 12 82 20', 'none', HL, 2.4), path('M78 18 L82 21 L84 16', 'none', HL, 2.2)),
    T(96, 25, 'でも…', 9, C.red, 800), line('M66 10 L66 30', HL, 1.2, '2 2'),
    mini(32, 52, C.denim), waBob('ls-kodv-nick', 1.5, mini(88, 52, C.pink, true)), check(104, 46), frame(2, 4, 116, 64),
    greyed(openBook(36, 96, 1, true), mini(78, 96, C.grey), line('M70 104 L58 98', C.skin, 3), arrow(92, 84, 108, 84, C.grey, 2), rect(94, 90, 20, 14, C.white, 2, C.ink, 1), line('M97 95 L111 95 M97 99 L107 99', C.grey, 1)),
    cross(96, 100, 9)),
};

export const LSTRUC_MOTIFS: Record<string, Svg> = { ...M1, ...M2, ...M3, ...M4, ...M5, ...M6, ...M7 };
