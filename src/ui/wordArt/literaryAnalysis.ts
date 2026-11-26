/**
 * Kultur & fritid → Språk & litteratur → Litterär analys, 4351–4357 (0.61): narrative perspective, theme
 * and motif, symbolism, metaphors and similes, character development, conflict and turning point, and how
 * to interpret a literary work.
 * Recurring signs: an open book is "the story", orange marks the part the word names and grey drawings are
 * the reference. Narrators are drawn as a small figure sitting on the book; the reader is a grey figure.
 * Contrast pairs share one layout: jagberättare/i tredje person (the narrator inside the book points to
 * himself, or a writer outside the book writes "hon/han"), inre/yttre konflikt (forces inside a thought
 * cloud or arrows from outside), metafor/likna vid (one fused picture, or two pictures joined by a moving
 * arrow), tema/motiv (many scenes feeding one big idea, or one small object repeated in several books).
 * Short Swedish example words appear only where they do not give away the target word (hon, han, fin …).
 * No brands; Japanese only as a red sun dot on a flag and a cherry branch.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, sparkle, star, waGrow, waIn, waPulse, waSway, type Svg } from './kit';
import { HL, T, bubble, bulb, cloud, heart, mini, sun, thought } from './people';
import { P, greyed } from './blindFix';

// ── Basics ───────────────────────────────────────────────────────────
const OR = '#fbd3bd';
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const tile = (x: number, y: number, w: number, txt: string, fill: string = C.white, col: string = C.ink, fs = 8.5) =>
  all(rect(x - w / 2, y - 8, w, 16, fill, 3, C.ink, 1.4), T(x, y + 3, txt, fs, col, 700));
const hot = (x: number, y: number, w: number, txt: string, fs = 8.5) => all(tile(x, y, w, txt, OR, C.ink, fs), rect(x - w / 2 - 2.5, y - 10.5, w + 5, 21, 'none', 5, HL, 2.4));
const dim = (x: number, y: number, w: number, txt: string, fs = 8.5) => all(rect(x - w / 2, y - 8, w, 16, '#e4e7eb', 3, C.grey, 1.2), T(x, y + 3, txt, fs, C.grey, 700));
const cross = (x: number, y: number, r = 6, col: string = C.red) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 2.6);
const qmark = (x: number, y: number, s = 12, col: string = C.navy) => T(x, y, '?', s, col, 900);
const lines = (x: number, y: number, w: number, n: number, gap = 5, col: string = C.grey2) =>
  line(Array.from({ length: n }, (_, i) => `M${x} ${y + i * gap} L${x + w - (i % 3 === 2 ? 6 : 0)} ${y + i * gap}`).join(' '), col, 1.5);

// ── Small pictures ───────────────────────────────────────────────────
/** Open book centred at (x, y): the spine at x, pages ±24 wide. */
const openBook = (x: number, y: number, s = 1, txt = true, fill: string = C.white) => at(x, y, s,
  path('M0 -14 C-8 -18 -18 -16 -24 -13 L-24 12 C-18 9 -8 9 0 13 Z', fill, C.ink, 1.6), path('M0 -14 C8 -18 18 -16 24 -13 L24 12 C18 9 8 9 0 13 Z', fill, C.ink, 1.6),
  txt ? line('M-20 -8 L-5 -9 M-20 -3 L-5 -4 M-20 2 L-5 1 M5 -9 L20 -8 M5 -4 L20 -3 M5 1 L20 2', C.grey2, 1.4) : '');
const book = (x: number, y: number, s = 1, col: string = C.navy) => at(x, y, s, rect(-10, -13, 20, 26, col, 2, C.ink, 1.6), line('M-6 -13 L-6 13', 'rgba(0,0,0,0.25)', 2), rect(-2, -8, 9, 4, C.white, 1, null));
/** Book seen from the spine (for shelves). */
const spine = (x: number, y: number, h: number, col: string, w = 8) => all(rect(x - w / 2, y - h, w, h, col, 1.5, C.ink, 1.3), line(`M${x - w / 2 + 1.5} ${y - h + 4} L${x + w / 2 - 1.5} ${y - h + 4} M${x - w / 2 + 1.5} ${y - 5} L${x + w / 2 - 1.5} ${y - 5}`, 'rgba(255,255,255,0.6)', 1));
const house = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, path('M-12 0 L-12 -14 L0 -24 L12 -14 L12 0 Z', col, C.ink, 1.6), rect(-4, -9, 8, 9, C.brown, 1, C.ink, 1.2), rect(4, -16, 5, 5, '#bfe3f5', 1, C.ink, 1));
const eye = (x: number, y: number, s = 1, iris: string = C.navy) => at(x, y, s, path('M-12 0 C-6 -8 6 -8 12 0 C6 8 -6 8 -12 0 Z', C.white, C.ink, 1.6), circle(0, 0, 4.2, iris, C.ink, 1), circle(1.2, -1.2, 1.2, C.white, null));
const flagSe = (x: number, y: number, w = 16, h = 10) => all(rect(x, y, w, h, '#2a65b3', 1, C.ink, 1), rect(x + w * 0.3, y, w * 0.14, h, C.yellow, 0, null), rect(x, y + h * 0.42, w, h * 0.16, C.yellow, 0, null));
const flagJp = (x: number, y: number, w = 16, h = 10) => all(rect(x, y, w, h, C.white, 1, C.ink, 1), circle(x + w / 2, y + h / 2, h * 0.3, C.red, null));
const suitcase = (x: number, y: number, col: string = C.red, s = 1) => at(x, y, s, rect(-9, -8, 18, 16, col, 3, C.ink, 1.6), path('M-4 -8 L-4 -12 L4 -12 L4 -8', 'none', C.ink, 1.6), line('M-9 -1 L9 -1', 'rgba(0,0,0,0.3)', 1.2));
const coin = (x: number, y: number, r = 5) => all(circle(x, y, r, C.gold, C.ink, 1.2), circle(x, y, r * 0.55, 'none', '#b88a20', 1));
const palm = (x: number, y: number, rot = 0, sleeve: string = C.navy, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M0 0 L14 -2 C20 -3 26 -2 30 0 C32 2 30 5 26 5 L20 5 C22 7 21 10 18 10 L4 10 C0 10 -2 6 0 0 Z', C.skin, C.ink, 1.4), rect(-12, -1, 14, 11, sleeve, 2, C.ink, 1.4));
const pen = (x: number, y: number, rot = 0, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-2, -16, 4, 14, C.navy, 1, C.ink, 1), path('M-2 -2 L2 -2 L0 3 Z', C.ink, null));
const rain = (x: number, y: number) => line(`M${x - 8} ${y} l-2 6 M${x} ${y + 2} l-2 6 M${x + 8} ${y} l-2 6`, C.sky, 2);
const bolt = (x: number, y: number, s = 1) => at(x, y, s, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', C.yellow, C.ink, 1.4));
const sakura = (x: number, y: number, s = 1) => at(x, y, s, line('M-14 10 C-6 4 2 0 14 -8', C.brown, 2.6), line('M-2 2 L2 -8', C.brown, 1.8),
  ...[[-8, 2], [2, -9], [10, -6], [4, -1]].map(([cx, cy]) => all(...[0, 72, 144, 216, 288].map((a) => circle(cx! + Math.cos((a * Math.PI) / 180) * 2.6, cy! + Math.sin((a * Math.PI) / 180) * 2.6, 2.2, C.rose, C.ink, 0.6)), circle(cx!, cy!, 1, C.yellow, null))));
const hourglass = (x: number, y: number, s = 1) => at(x, y, s, rect(-9, -14, 18, 3, C.brown, 1, C.ink, 1.2), rect(-9, 11, 18, 3, C.brown, 1, C.ink, 1.2), path('M-7 -11 L7 -11 L1 0 L7 11 L-7 11 L-1 0 Z', '#e8f4fb', C.ink, 1.2), path('M-4 -7 L4 -7 L0 -1 Z M-5 10 L5 10 L0 5 Z', C.gold, null));
const target = (x: number, y: number, r: number) => all(circle(x, y, r, C.white, C.ink, 1.6), circle(x, y, r * 0.66, C.red, C.ink, 1.2), circle(x, y, r * 0.36, C.white, C.ink, 1.2), circle(x, y, r * 0.14, C.red, null));
const caterpillar = (x: number, y: number, s = 1) => at(x, y, s, ...[0, 6, 12, 18].map((d) => circle(d, 0, 4, C.green, C.ink, 1.1)), circle(23, -2, 4.5, C.green, C.ink, 1.1), circle(24.5, -3, 0.9, C.ink, null), line('M22 -6 l-1 -4 M25 -6 l1 -4', C.ink, 1));
const butterfly = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 C-6 -16 -22 -16 -18 -2 C-16 4 -6 4 0 0 Z', C.orange, C.ink, 1.3), path('M0 0 C6 -16 22 -16 18 -2 C16 4 6 4 0 0 Z', C.orange, C.ink, 1.3),
  path('M0 1 C-5 6 -14 10 -12 15 C-8 18 -2 10 0 2 Z', C.yellow, C.ink, 1.2), path('M0 1 C5 6 14 10 12 15 C8 18 2 10 0 2 Z', C.yellow, C.ink, 1.2), line('M0 -6 L0 10', C.ink, 2.2), line('M0 -6 l-3 -6 M0 -6 l3 -6', C.ink, 1));
const domino = (x: number, y: number, rot = 0, col: string = C.white) => g(`translate(${x} ${y}) rotate(${rot})`, rect(-3, -14, 6, 14, col, 1.2, C.ink, 1.2), circle(0, -10, 0.9, C.ink, null), circle(0, -4, 0.9, C.ink, null));
const pig = (x: number, y: number, s = 1, crown = false) => at(x, y, s, ellipse(0, 0, 14, 10, C.pink, C.ink, 1.6), circle(12, -6, 7, C.pink, C.ink, 1.6), ellipse(17, -5, 3, 2.4, '#e88aa3', C.ink, 1), circle(16.2, -5.2, 0.6, C.ink, null), circle(17.8, -5.2, 0.6, C.ink, null), circle(11, -8, 1, C.ink, null),
  path('M8 -12 L9 -16 L12 -12 Z', C.pink, C.ink, 1), line('M-8 8 L-8 14 M-2 9 L-2 14 M4 9 L4 14 M9 7 L9 13', C.ink, 2), path('M-14 -2 c-4 -2 -4 4 0 2', 'none', C.ink, 1.2),
  crown ? path('M6 -13 L7 -20 L10 -15 L12 -21 L14 -15 L17 -20 L18 -13 Z', C.gold, C.ink, 1.1) : '');
const crownOn = (x: number, y: number, s = 1) => at(x, y, s, path('M-6 0 L-5 -7 L-2 -2 L0 -8 L2 -2 L5 -7 L6 0 Z', C.gold, C.ink, 1.1));
const rope = (x1: number, x2: number, y: number) => all(line(`M${x1} ${y} L${x2} ${y}`, '#8a6a3a', 3.4), line(`M${x1} ${y} L${x2} ${y}`, '#c9a46a', 1.6, '3 3'));
const dice = (x: number, y: number, s = 1) => at(x, y, s, rect(-6, -6, 12, 12, C.white, 2.5, C.ink, 1.4), circle(-3, -3, 1.1, C.ink, null), circle(0, 0, 1.1, C.ink, null), circle(3, 3, 1.1, C.ink, null));
const magnifier = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 9, 'rgba(191,227,245,0.35)', C.ink, 2.4), line('M6.5 6.5 L15 15', C.brown, 4));
const tree = (x: number, y: number, s = 1) => at(x, y, s, rect(-3, -18, 6, 18, C.brown, 1, C.ink, 1.4), circle(0, -28, 14, C.green, C.ink, 1.6));
/** Small figure sitting on a book (the narrator). */
const sitter = (x: number, y: number, col: string, long = false) => mini(x, y, col, long);

/** Comic panel. */
const panel = (x: number, y: number, w: number, h: number, fill: string = C.white) => rect(x, y, w, h, fill, 3, C.ink, 1.6);
/** White bird (dove) facing right. */
const dove = (x: number, y: number, s = 1) => at(x, y, s, path('M-16 0 L-24 -5 L-23 3 L-16 4 Z', C.white, C.ink, 1.2), ellipse(-3, 2, 13, 7, C.white, C.ink, 1.4), circle(10, -4, 5, C.white, C.ink, 1.4), path('M14.5 -5 L20 -3.5 L14.5 -2 Z', C.orange, C.ink, 0.8), circle(11.5, -5, 0.9, C.ink, null), path('M-8 0 C-6 -12 4 -14 6 -10 C4 -4 0 0 -8 0 Z', '#eef2f6', C.ink, 1.2));
/** Two small people hand in hand: peace. */
const peace = (x: number, y: number, s = 1) => at(x, y, s, mini(-8, 0, C.green), mini(8, 0, C.pink, true), line('M-3 8 L3 8', C.skin, 3));
/** Head in profile facing right (flip = facing left). */
const profile = (x: number, y: number, s: number, hair: string, flip = false, down = false) => g(`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`,
  path('M-14 -4 C-16 -22 2 -30 12 -20 C16 -16 16 -10 15 -6 L20 2 L15 4 C16 8 14 12 10 12 L8 22 L-10 22 C-8 14 -14 8 -14 -4 Z', C.skin, C.ink, 1.8),
  path('M-14 -4 C-18 -20 -2 -32 12 -20 C4 -22 -4 -18 -6 -8 C-8 -6 -12 -4 -14 -4 Z', hair, C.ink, 1.4),
  down ? path('M7 -4 Q10 -2 13 -4', 'none', C.ink, 1.4) : circle(9, -6, 1.6, C.ink, null),
  down ? '' : line('M5 -11 L12 -12', C.ink, 1.4), path(down ? 'M10 8 Q12 7 14 8' : 'M10 7 L15 6', 'none', C.ink, 1.3));
/** Small person with a plant in the chest (stage 0 seed, 1 leaves, 2 flower). */
const grower = (x: number, stage: number, straight: boolean) => {
  const cy = 64;
  return all(
    g(straight ? '' : `rotate(7 ${x} 112)`, P({ x, h: 0.72, top: C.denim, mood: straight ? 'smile' : 'frown' })),
    circle(x, cy, 7, C.white, C.ink, 1),
    line(`M${x} ${cy + 5} L${x} ${cy + 1 - stage * 3}`, C.green, 2),
    stage >= 1 ? all(path(`M${x} ${cy + 2 - stage} C${x - 6} ${cy - 1 - stage} ${x - 6} ${cy - 5 - stage} ${x - 1} ${cy - 3 - stage} Z`, C.green, C.ink, 0.8), path(`M${x} ${cy + 1 - stage} C${x + 6} ${cy - 2 - stage} ${x + 6} ${cy - 6 - stage} ${x + 1} ${cy - 4 - stage} Z`, C.green, C.ink, 0.8)) : circle(x, cy + 3, 1.8, C.brown, null));
};

// ── 4351 Berättarperspektiv ──────────────────────────────────────────
const M1: Record<string, Svg> = {
  // an eye beside the story: its orange view cone covers one person only, the other stays grey
  'lita.berättarperspektiv': all(ground(),
    path('M30 46 L86 20 L92 104 Z', 'rgba(239,138,60,0.18)', null), line('M30 46 L86 20 M30 46 L92 104', HL, 1.6, '4 3'),
    eye(24, 46, 1.1), P({ x: 80, h: 0.62, top: C.orange, hairStyle: 'long', mood: 'smile' }), greyed(P({ x: 106, h: 0.58, top: C.green })),
    openBook(60, 100, 0.6, false), ring(24, 46, 15)),
  // a little narrator sits on the open book and talks to the grey reader
  'lita.berättare.2': all(ground(), openBook(42, 92, 1.4), sitter(42, 62, C.orange, true),
    bubble(64, 34, 30, lines(52, 30, 22, 2, 5, C.navy), true), greyed(P({ x: 100, h: 0.62, top: C.grey })), ring(42, 62, 13)),
  // the narrator inside the book points to himself; his speech bubble shows the same person
  'lita.jagberättare': all(ground(), openBook(60, 96, 1.9), P({ x: 52, h: 0.5, top: C.orange, mood: 'smile' }),
    path('M58 64 L49 62', C.skin, C.ink, 1.2), circle(48, 62, 2.6, C.skin, C.ink, 1),
    bubble(84, 30, 30, mini(84, 32, C.orange), true), ring(84, 30, 18), ring(52, 76, 16), line('M78 44 L60 62', HL, 1.6, '3 3')),
  // a writer OUTSIDE the book writes about another person: the page says hon / han
  'lita.i-tredje-person': all(ground(), P({ x: 22, h: 0.6, top: C.navy }), pen(36, 76, 30),
    rect(46, 50, 46, 46, C.white, 2, C.ink, 1.6), hot(69, 64, 26, 'hon'), hot(69, 84, 26, 'han'),
    P({ x: 106, h: 0.5, top: C.orange, hairStyle: 'long' }), line('M84 64 L98 70', HL, 1.6, '3 2')),
  // a big eye above a cut-open house sees every room and every thought
  'lita.allvetande-berättare': all(ground(),
    path('M20 112 L20 56 L60 30 L100 56 L100 112 Z', '#f3e3cf', C.ink, 2), line('M20 84 L100 84 M60 56 L60 112', C.ink, 1.6),
    mini(40, 76, C.green), mini(80, 76, C.denim, true), mini(40, 102, C.pink, true), mini(80, 102, C.purple),
    ...[[40, 64], [80, 64], [40, 92], [80, 92]].map(([x, y]) => all(circle(x! + 8, y! - 4, 3.2, C.white, C.ink, 0.9), heart(x! + 8, y! - 4.6, 0.18))),
    eye(60, 14, 1.2, C.orange), line('M50 22 L36 60 M70 22 L84 60 M56 24 L44 86 M64 24 L76 86', HL, 1.2, '3 3')),
  // someone stands OUTSIDE a closed house and looks in: what happens inside stays a question
  'lita.utifrån': all(ground(), house(74, 112, 2.2, '#cdb7a0'), rect(80, 69, 11, 11, '#56606b', 1, C.ink, 1),
    qmark(74, 90, 14, C.grey), P({ x: 20, h: 0.6, top: C.orange, mood: 'calm' }),
    arrow(30, 60, 64, 66, HL, 2.6), eye(20, 38, 0.5)),
  // a quiet person: no speech bubble, but a stream of thoughts in a big cloud
  'lita.inre-monolog': all(ground(), P({ x: 34, h: 0.62, top: C.denim, face: 'neutral' }),
    line('M30 62 L38 62', C.ink, 1.3), circle(46, 52, 3, C.white, C.ink, 1.2), circle(54, 44, 4, C.white, C.ink, 1.2),
    ellipse(84, 28, 32, 20, C.white, C.ink, 1.6),
    at(64, 26, 0.5, rect(-8, -8, 16, 16, C.white, 8, C.ink, 1.6), line('M0 0 L0 -5 M0 0 L4 2', C.ink, 1.6)), arrow(70, 26, 76, 26, C.grey, 1.6),
    house(84, 34, 0.5), arrow(91, 26, 97, 26, C.grey, 1.6), heart(104, 28, 0.55), qmark(84, 50, 9, C.grey)),
  // the story switches back and forth between two people
  'lita.växla.4': all(ground(), openBook(60, 96, 2.1, false),
    mini(36, 80, C.orange, true), mini(84, 80, C.green),
    moving('lita-vx-a', '0%,45%{opacity:1}50%,95%{opacity:.15}100%{opacity:1}', { dur: 3 }, ring(36, 82, 13)),
    moving('lita-vx-b', '0%,45%{opacity:.15}50%,95%{opacity:1}100%{opacity:.15}', { dur: 3 }, ring(84, 82, 13)),
    path('M42 52 C52 40 68 40 78 52', 'none', HL, 2.4), path('M74 50 L78 52 L77 47', 'none', HL, 2.4),
    path('M78 60 C68 70 52 70 42 60', 'none', HL, 2.4), path('M46 61 L42 60 L44 64', 'none', HL, 2.4)),
  // a whole village with people rises out of the book, full of detail
  'lita.skildring': all(ground(), openBook(60, 100, 2.1),
    path('M18 88 C30 60 90 60 102 88', 'rgba(239,138,60,0.12)', HL, 1.4),
    house(36, 84, 0.8, C.red), house(60, 80, 0.9, C.yellow), house(84, 84, 0.8, C.denim), tree(48, 84, 0.5), tree(74, 82, 0.45),
    mini(30, 64, C.green), mini(92, 64, C.pink, true), sun(60, 40, 6), cloud(30, 34, 0.6, C.white), cloud(92, 38, 0.5, C.white)),
};

// ── 4352 Tema och motiv ──────────────────────────────────────────────
const M2: Record<string, Svg> = {
  // three chapters of one book each hold the same heart, a thread joins them and leads up to one big heart (no person)
  'lita.tema.2': all(ground(), openBook(60, 96, 2.2, false), line('M60 66 L60 124', C.ink, 1.2),
    ...[[24, 84], [48, 80], [74, 80], [98, 84]].map(([x, y]) => all(rect(x! - 9, y! - 9, 18, 18, C.white, 2, C.grey, 1), heart(x!, y! + 1, 0.55))),
    path('M24 85 C34 70 40 92 48 81 C56 70 66 92 74 81 C82 70 90 92 98 85', 'none', C.red, 2),
    line('M24 74 L52 44 M98 74 L68 44 M48 70 L56 46 M74 70 L64 46', C.grey, 1.4, '3 3'),
    circle(60, 30, 18, OR, HL, 2.6), heart(60, 32, 1.4)),
  // the same small suitcase turns up in three different books
  'lita.motiv.3': all(ground(),
    ...[[22, C.navy], [60, C.red], [98, C.green]].map(([x, col]) => all(rect((x as number) - 16, 50, 32, 46, col as string, 3, C.ink, 1.6), rect((x as number) - 12, 54, 24, 38, C.white, 2, null),
      suitcase(x as number, 78, C.orange, 0.8), ring(x as number, 77, 11))),
    line('M8 104 L112 104', C.brown, 3)),
  // a row of pages: in every one of them the orange colour is present, from first to last (grey row: only once)
  'lita.genomgående': all(ground(),
    ...[0, 1, 2, 3, 4].map((i) => all(rect(10 + i * 21, 30, 17, 26, C.white, 2, C.ink, 1.3), rect(10 + i * 21, 42, 17, 6, C.orange, 0, null))),
    line('M8 45 L112 45', HL, 1.4, '2 3'), arrow(10, 64, 110, 64, HL, 2.4),
    ...[0, 1, 2, 3, 4].map((i) => all(rect(10 + i * 21, 76, 17, 26, '#eef0f2', 2, C.grey, 1.2), i === 1 ? rect(10 + i * 21, 88, 17, 6, C.grey, 0, null) : ''))),
  // a needle pulls one red thread through a row of separate pages and joins them
  'lita.röd-tråd': all(ground(),
    ...[0, 1, 2, 3].map((i) => rect(14 + i * 24, 38 + (i % 2) * 6, 18, 50, C.white, 2, C.ink, 1.4)),
    ...[0, 1, 2, 3].map((i) => lines(17 + i * 24, 46 + (i % 2) * 6, 12, 6, 6)),
    path('M6 70 C14 60 20 76 28 64 C36 52 42 74 52 66 C60 58 66 78 76 68 C84 60 92 76 100 64 L110 56', 'none', C.red, 2.6),
    g('rotate(-35 110 56)', rect(104, 54, 18, 3, C.silver, 1.5, C.ink, 1), ellipse(119, 55.5, 2, 1, C.white, C.ink, 0.6))),
  // a spotlight swings onto a grey question and reveals its colours
  'lita.belysa.2': all(ground(),
    rect(10, 18, 16, 10, C.dark, 2, C.ink, 1.4), line('M18 28 L18 40', C.ink, 2),
    moving('lita-bel', '0%{opacity:0}40%,100%{opacity:1}', { dur: 2.8 }, path('M24 26 L96 62 L74 100 Z', 'rgba(242,193,78,0.35)', null)),
    greyed(circle(86, 84, 18, C.grey, C.ink, 1.6)), qmark(86, 92, 22, C.grey),
    moving('lita-bel2', '0%{opacity:0}40%,100%{opacity:1}', { dur: 2.8 }, all(circle(86, 84, 18, '#f8e7b0', C.ink, 1.6), house(80, 94, 0.5), heart(94, 80, 0.5), coin(88, 72, 3.4)))),
  // one orange drop falls into a glass of water and colours all of it
  'lita.genomsyra': all(ground(),
    path('M34 40 L86 40 L80 108 L40 108 Z', 'rgba(220,240,252,0.5)', C.ink, 2),
    waGrow('lita-gs', path('M36 54 L84 54 L80 106 L40 106 Z', 'rgba(239,138,60,0.75)', null)),
    waIn('lita-gs-drop', 0, -18, path('M60 22 C64 28 64 32 60 32 C56 32 56 28 60 22 Z', C.orange, C.ink, 1.2)),
    line('M36 54 L84 54', C.ink, 1.2)),
  // a ribbon from the open book skims past one of three topics and touches it lightly
  'lita.beröra.3': all(ground(), openBook(32, 92, 1.1),
    circle(66, 34, 11, C.white, C.ink, 1.4), coin(66, 34, 6), circle(96, 50, 11, C.white, C.ink, 1.4), house(96, 57, 0.55),
    circle(70, 80, 11, OR, HL, 2.2), heart(70, 81, 0.7),
    waIn('lita-ber', -22, 10, path('M42 82 C48 74 54 78 59 80', 'none', HL, 2.4), circle(59, 80, 2.2, HL, null))),
  // a head built from puzzle pieces: flags, a book and a heart
  'lita.identitet': all(ground(),
    path('M40 104 L40 86 C24 80 22 54 34 40 C46 24 78 24 88 40 C98 56 94 76 84 84 L84 104 Z', OR, HL, 2.6),
    line('M60 30 L60 90 M32 62 L90 62', C.white, 2.2), flagJp(38, 44), flagSe(66, 44), book(48, 76, 0.5, C.navy), heart(74, 76, 0.7),
    ...[[60, 46], [46, 62], [74, 62], [60, 78]].map(([x, y]) => circle(x!, y!, 3, OR, null))),
};

// ── 4353 Symbolik ────────────────────────────────────────────────────
const M3: Record<string, Svg> = {
  // an open book with many symbols around it, linked to each other (a whole system)
  'lita.symbolik': all(ground(), openBook(60, 94, 1.6),
    sakura(24, 40, 0.8), heart(60, 26, 0.9), at(96, 40, 0.7, circle(0, 0, 9, C.yellow, C.ink, 1.4)), hourglass(30, 70, 0.6), at(92, 70, 0.8, path('M-6 6 L6 -6 M-3 6 L-6 9 M0 6 L6 0', 'none', C.ink, 2), circle(6, -6, 4, 'none', C.gold, 2)),
    line('M30 44 L52 30 M68 30 L88 40 M96 50 L92 62 M30 62 L26 48 M38 72 L82 72', HL, 1.2, '3 3'), ring(60, 52, 40, '#f2b38c')),
  // a noun: one thing on a pedestal with a label, and below it the icon of the idea it stands for (still, no arrow)
  'lita.symbol.2': all(ground(), rect(36, 60, 48, 10, C.beige, 2, C.ink, 1.6), rect(42, 70, 36, 30, C.beige, 1, C.ink, 1.6), rect(32, 100, 56, 12, C.beige, 2, C.ink, 1.6),
    dove(60, 44, 1.5), ring(60, 42, 22),
    rect(48, 76, 24, 10, C.white, 2, C.ink, 1), line('M52 81 L68 81', C.grey, 1.4), line('M60 70 L60 76', C.ink, 1),
    rect(8, 18, 26, 24, C.white, 3, C.ink, 1.2), peace(21, 28, 0.65), line('M34 30 L40 38', C.grey, 1.2, '2 2'), rect(86, 18, 26, 24, C.white, 3, C.ink, 1.2), peace(99, 28, 0.65), line('M86 30 L80 38', C.grey, 1.2, '2 2')),
  // three panels: the writer writes about a white dove, the reader reads it, and the reader's thought fills with peace
  'lita.symbolisera': all(
    panel(4, 6, 54, 52), mini(18, 40, C.navy), rect(26, 44, 28, 10, C.tan, 1, C.ink, 1.2), pen(40, 44, 30, 0.7), bubble(40, 20, 26, dove(40, 21, 0.7), true),
    panel(62, 6, 54, 52), openBook(89, 46, 0.8), dove(89, 42, 0.5), mini(78, 24, C.orange, true), line('M82 28 L88 38', C.grey, 1, '2 2'),
    panel(4, 62, 112, 46, '#fff7ee'), mini(24, 92, C.orange, true), circle(36, 82, 2.4, C.white, C.ink, 1), circle(42, 76, 3, C.white, C.ink, 1),
    dove(60, 86, 0.8), waIn('lita-sym', -14, 0, arrow(70, 86, 80, 86, HL, 2.4)),
    waGrow('lita-sym2', all(ellipse(98, 84, 16, 14, C.white, HL, 2.2), peace(98, 84, 0.7)))),
  // a short tile turns into a long one: the abbreviation and what it is short for
  'lita.stå-för.3': all(ground(), hot(26, 44, 26, 'km', 10), arrow(42, 44, 56, 44, HL, 2.6),
    waIn('lita-sf', -24, 0, tile(88, 44, 52, 'kilometer', C.white, C.ink, 8.5)),
    hot(26, 82, 26, 'kg', 10), arrow(42, 82, 56, 82, HL, 2.6), waIn('lita-sf2', -24, 0, tile(88, 82, 52, 'kilogram', C.white, C.ink, 8.5))),
  // pigs on a farm wear a crown, and under the story lies a second picture: a human ruler
  'lita.allegori': all(ground(), rect(8, 76, 104, 36, '#e7f1df', 2, null), line('M8 96 L112 96', C.brown, 1.2, '4 3'),
    pig(36, 96, 1.2, true), pig(78, 100, 0.8), line('M50 78 L64 58', HL, 1.6, '3 3'),
    rect(56, 14, 56, 46, C.white, 3, HL, 2.2), g('translate(84 22)', circle(0, 10, 6, C.skin, C.ink, 1.3), path('M-9 34 C-9 20 9 20 9 34 Z', C.purple, C.ink, 1.3)), crownOn(84, 26, 1),
    mini(68, 50, C.grey), mini(100, 50, C.grey)),
  // dark clouds drift in over a small house before the storm: a sign of what is coming
  'lita.förebåda': all(ground(), house(60, 112, 2, C.red), mini(92, 100, C.denim),
    waIn('lita-fb', -30, 0, all(cloud(42, 30, 1.1, '#6b7280'), cloud(76, 24, 1.3, '#555b66'))),
    waPulse('lita-fb2', bolt(64, 48, 0.8)),
    path('M98 58 C102 54 108 54 112 58 C108 58 104 60 100 62 Z', C.black, C.ink, 1)),
  // two people face each other and the air between them crackles
  'lita.laddad.3': all(ground(), P({ x: 22, h: 0.62, top: C.denim, mood: 'frown' }), P({ x: 98, h: 0.62, top: C.red, hairStyle: 'long', mood: 'frown' }),
    path('M40 52 L50 46 L46 56 L58 48 L54 58 L66 50 L62 60 L76 52 L80 56', 'none', HL, 2.4), bolt(60, 34, 0.7), sparkle(44, 40, 4, HL), sparkle(78, 40, 4, HL)),
  // the street outside and the same street on the pages of the book
  'lita.spegla.3': all(ground(),
    house(18, 70, 0.9, C.red), house(42, 70, 0.9, C.yellow), mini(30, 92, C.green), line('M4 70 L56 70', C.grey2, 1.6),
    openBook(88, 74, 1.3),
    moving('lita-spg', '0%,100%{opacity:1}50%{opacity:.45}', { dur: 2.2 }, all(house(79, 76, 0.4, C.red), house(90, 76, 0.4, C.yellow), mini(98, 80, C.green))),
    arrow(54, 48, 76, 52, HL, 2.2), arrow(76, 60, 54, 64, HL, 2.2)),
  // a book floats like an iceberg: a little above the surface, a lot underneath
  'lita.djup.2': all(rect(4, 40, 112, 72, '#cfe8f5', 0, null), line('M4 40 L116 40', '#5aa7d6', 2),
    book(60, 32, 0.8, C.navy), path('M44 42 L76 42 L92 106 L28 106 Z', 'rgba(255,255,255,0.65)', HL, 2.2),
    heart(52, 62, 0.6), qmark(68, 70, 10, C.navy), star(58, 88, 5, C.gold), hourglass(74, 92, 0.45)),
};

// ── 4354 Metaforer och liknelser ─────────────────────────────────────
const M4: Record<string, Svg> = {
  // A IS B, drawn literally: her heart is a stone (no ~, no "som")
  'lita.metafor': all(ground(), P({ x: 46, h: 0.95, top: C.white, mood: 'calm' }),
    circle(52, 56, 13, 'none', C.ink, 1.2),
    at(52, 56, 0.55, path('M-16 2 L-12 -10 L-2 -16 L10 -14 L16 -4 L12 10 L-4 14 L-14 10 Z', '#8d8f99', C.ink, 2.4), line('M-2 -16 L0 -4 L-10 2 M10 -14 L6 -2 L12 6', '#6d6f79', 1.6)),
    ring(52, 56, 16), line('M68 56 L84 44', HL, 1.6, '3 3'),
    at(98, 40, 0.75, path('M-16 2 L-12 -10 L-2 -16 L10 -14 L16 -4 L12 10 L-4 14 L-14 10 Z', '#8d8f99', C.ink, 2), line('M-2 -16 L0 -4 L-10 2 M10 -14 L6 -2 L12 6', '#6d6f79', 1.4)), T(98, 68, '=', 16, HL, 900), heart(98, 86, 1, C.red)),
  // two separate pictures (a child and the sun) are joined by a moving arrow: one is compared to the other
  'lita.likna.2': all(ground(), P({ x: 22, h: 0.6, top: C.navy }), mini(50, 84, C.yellow), sun(94, 80, 10),
    waIn('lita-lk', -24, 0, all(path('M62 76 C70 66 78 66 84 74', 'none', HL, 2.4), path('M80 72 L84 74 L83 69', 'none', HL, 2.4))),
    bubble(42, 30, 40, all(circle(32, 30, 4, C.skin, C.ink, 1), T(42, 33, '~', 10, HL, 900), circle(52, 30, 4, C.yellow, C.ink, 1)), true)),
  // the lines of text in the book turn into small pictures
  'lita.bildspråk': all(ground(), openBook(60, 82, 2.3, false),
    line('M14 64 L28 63 M14 76 L24 75 M14 88 L30 87 M68 63 L82 64 M74 76 L84 77 M66 88 L80 89', C.grey2, 1.6),
    sun(40, 62, 4), heart(36, 76, 0.5), path('M34 88 c3 -3 6 3 9 0 c3 -3 6 3 9 0', 'none', '#5aa7d6', 1.8),
    star(94, 62, 4), at(98, 76, 0.4, cloud(0, 0, 1, C.white)), path('M86 86 l4 4 l6 -8', 'none', C.green, 1.8), ring(60, 76, 44, '#f2b38c')),
  // the tree has a face and sings, the sun smiles: things become living beings
  'lita.besjälning': all(ground(), rect(54, 76, 12, 36, C.brown, 2, C.ink, 1.6), circle(60, 54, 30, C.green, C.ink, 2),
    circle(52, 50, 2.4, C.ink, null), circle(68, 50, 2.4, C.ink, null), ellipse(60, 62, 5, 4, '#c84a4a', C.ink, 1.2),
    line('M36 68 C28 66 24 60 22 54 M84 68 C92 66 96 60 98 54', C.brown, 3), T(20, 40, '♪', 14, HL, 900), T(102, 36, '♪', 12, HL, 900),
    sun(98, 16, 7), path('M95 17 Q98 20 101 17', 'none', C.ink, 1)),
  // a huge storm blows the roof off, and the calm person says something tiny
  'lita.underdrift': all(ground(), house(84, 112, 2, C.red), g('rotate(-25 90 40)', path('M70 50 L90 34 L110 50 Z', C.brown, C.ink, 1.6)),
    line('M8 30 C30 24 50 36 70 28 M4 46 C26 40 46 52 66 44 M10 62 C30 56 44 66 60 60', C.grey, 2.2),
    P({ x: 26, h: 0.6, top: C.green, mood: 'calm' }), bubble(40, 40, 18, cloud(40, 40, 0.28, C.grey2), true), ring(40, 40, 14)),
  // an open toolbox holds the devices: =, ~, a magnifier and a winking face
  'lita.stilfigur': all(ground(), path('M14 80 L106 80 L100 110 L20 110 Z', C.red, C.ink, 2), rect(48, 72, 24, 6, C.dark, 2, C.ink, 1.4),
    rect(22, 48, 18, 24, C.white, 2, C.ink, 1.4), T(31, 64, '=', 14, HL, 900), rect(44, 40, 18, 24, C.white, 2, C.ink, 1.4), T(53, 56, '~', 14, HL, 900),
    magnifier(78, 54, 0.8), at(98, 56, 1, circle(0, 0, 9, C.yellow, C.ink, 1.4), path('M-5 -2 l3 0', 'none', C.ink, 1.4), circle(3.5, -2, 1.2, C.ink, null), path('M-4 3 Q0 6 4 3', 'none', C.ink, 1.2))),
  // one and the same speech bubble, used again and again: copies behind, the front one faded, torn and patched
  'lita.sliten.2': all(ground(),
    path('M34 14 L108 14 L108 58 L66 58 L54 70 L56 58 L34 58 Z', '#ececec', C.grey, 1.2), path('M26 22 L100 22 L100 66 L58 66 L46 78 L48 66 L26 66 Z', '#e4e4e4', C.grey, 1.2),
    path('M16 32 L92 32 L90 44 L94 50 L92 78 L50 78 L36 94 L40 78 L16 78 L18 62 L14 54 Z', '#e8e2d4', C.ink, 2),
    lines(26, 46, 52, 3, 8, '#c9c2b2'), rect(60, 52, 18, 12, C.tan, 1, C.ink, 1), line('M62 54 l14 8 M62 62 l14 -8', C.ink, 0.6),
    path('M30 64 l6 -4 l4 6 l-6 3 Z', C.paper, C.ink, 1), path('M80 38 l4 6 l-5 3', 'none', C.ink, 1.2),
    path('M100 92 C110 86 112 74 104 68', 'none', HL, 2.2), path('M100 70 L104 67 L106 72', 'none', HL, 2.2),
    path('M8 86 C4 96 10 106 20 106', 'none', HL, 2.2), path('M16 102 L20 106 L16 109', 'none', HL, 2.2)),
  // a copier spits out the same speech bubble again and again; the listener yawns
  'lita.klyscha': all(ground(), rect(10, 70, 46, 30, C.grey2, 3, C.ink, 1.8), rect(14, 64, 38, 8, C.white, 2, C.ink, 1.2), rect(56, 84, 10, 4, C.dark, 1, null),
    ...[0, 1, 2].map((i) => bubble(76 + i * 6, 70 - i * 18, 26, lines(68 + i * 6, 66 - i * 18, 16, 2, 5, C.grey), true)),
    P({ x: 106, h: 0.44, top: C.denim, mood: 'sleepy' })),
  // an arrow flies from a speech bubble straight into the centre of a target
  'lita.träffande': all(ground(), bubble(26, 40, 32, lines(14, 36, 24, 2, 5, C.navy), false),
    target(92, 52, 20), arrow(40, 52, 88, 52, HL, 3), sparkle(98, 34, 4, HL), sparkle(104, 66, 3, HL)),
  // a hand picks one word tile out of several near synonyms
  'lita.ordval': all(ground(), dim(24, 86, 28, 'fin'), dim(56, 86, 32, 'snygg'), dim(92, 86, 30, 'söt'),
    hot(60, 46, 36, 'vacker'), palm(28, 34, 10, C.denim, 0.9), arrow(60, 74, 60, 60, HL, 2.2)),
};

// ── 4355 Karaktärsutveckling ─────────────────────────────────────────
const M5: Record<string, Svg> = {
  // across the pages of the book a small, scared person becomes a big, happy one
  'lita.karaktärsutveckling': all(ground(), openBook(60, 96, 2.2, false),
    line('M22 84 C40 70 70 68 98 54', HL, 2, '4 3'), ...[34, 60, 86].map((x) => line(`M${x} 96 L${x} 100`, C.grey, 1.4)),
    greyed(P({ x: 22, h: 0.34, top: C.grey, mood: 'frown' })),
    waIn('lita-ku', -50, 22, P({ x: 98, h: 0.6, top: C.orange, mood: 'laugh' }))),
  // a person wears three badges on the chest: a heart, a light bulb and a gift; the magnifier shows one
  'lita.karaktärsdrag': all(ground(), P({ x: 46, h: 0.95, top: C.white }),
    heart(40, 62, 0.6), at(52, 64, 0.5, circle(0, -2, 6, C.yellow, C.ink, 1.4), rect(-3, 4, 6, 3, C.grey, 1, C.ink, 1)), at(46, 78, 0.5, rect(-7, -5, 14, 10, C.red, 1, C.ink, 1.3), line('M0 -5 L0 5 M-7 0 L7 0', C.yellow, 1.6)),
    magnifier(94, 50, 1.6), heart(94, 50, 0.9), line('M44 62 L82 50', HL, 1.2, '3 3')),
  // on the stage, the main person in the middle is grey; the one at the side is marked
  'lita.bifigur': all(ground(), rect(6, 96, 108, 16, C.brown, 2, C.ink, 1.6), path('M40 10 L80 10 L94 96 L26 96 Z', 'rgba(242,193,78,0.25)', null),
    greyed(P({ x: 60, h: 0.72, top: C.grey })), P({ x: 102, h: 0.5, top: C.orange, hairStyle: 'long', mood: 'smile' }), ring(102, 64, 13)),
  // out of the book steps a figure with a cape and a shield, protecting two small people
  'lita.hjälte.2': all(ground(), openBook(60, 100, 2.1),
    path('M50 46 L70 46 L80 90 L40 90 Z', C.red, C.ink, 1.6), P({ x: 60, h: 0.62, top: C.denim, mood: 'smile' }),
    at(78, 72, 0.7, path('M0 -16 L14 -11 C14 4 8 12 0 17 C-8 12 -14 4 -14 -11 Z', C.gold, C.ink, 1.8), star(0, 0, 5, C.red)),
    mini(28, 82, C.green), mini(94, 82, C.pink, true), sparkle(36, 36, 4), sparkle(88, 36, 4)),
  // the main person in the book has a torn cape and hides a stolen cookie behind his back
  'lita.antihjälte': all(ground(), openBook(60, 100, 2.1),
    path('M50 48 L70 48 L74 70 L68 76 L72 84 L62 80 L56 88 L52 78 L46 84 Z', '#8a8f99', C.ink, 1.4), P({ x: 60, h: 0.62, top: C.dark, mood: 'angry' }),
    at(36, 70, 0.6, path('M0 -16 L14 -11 C14 4 8 12 0 17 C-8 12 -14 4 -14 -11 Z', '#8a8f99', C.ink, 1.8), line('M-2 -14 L3 -2 L-3 4 L2 15', C.ink, 1.6)),
    circle(78, 84, 4.5, C.tan, C.ink, 1.1), circle(77, 83, 0.8, C.brown, null), circle(79.5, 85, 0.8, C.brown, null), circle(84, 94, 1, C.tan, null), circle(81, 98, 0.8, C.tan, null)),
  // a pen draws on the page and a person grows up out of it
  'lita.gestalta': all(ground(), rect(14, 88, 92, 18, C.white, 2, C.ink, 1.6), lines(20, 94, 40, 2, 5),
    pen(88, 92, 25, 1.4), palm(96, 80, 205, C.navy, 0.8),
    waGrow('lita-ges', P({ x: 54, h: 0.6, top: C.orange, hairStyle: 'long', mood: 'smile' })), line('M38 88 C44 80 64 80 70 88', HL, 1.6, '3 3')),
  // a smiling person with open hands; two others lean in, small hearts float to her
  'lita.sympatisk': all(ground(), P({ x: 60, h: 0.7, top: C.orange, hairStyle: 'long', mood: 'smile' }),
    greyed(P({ x: 20, h: 0.58, top: C.grey })), greyed(P({ x: 100, h: 0.58, top: C.grey })),
    heart(36, 46, 0.6), heart(84, 46, 0.6), heart(60, 18, 0.7)),
  // a flat cut-out on a stand: from the side it is just a thin line (grey: a round person)
  'lita.platt.2': all(ground(), rect(22, 34, 34, 74, OR, 2, HL, 2.2), at(39, 0, 1, circle(0, 46, 8, C.skin, C.ink, 1.4), path('M-10 72 L10 72 L8 100 L-8 100 Z', C.denim, C.ink, 1.3)),
    path('M30 108 L48 108 L39 98 Z', C.brown, C.ink, 1.2), rect(80, 34, 3, 74, HL, 1, C.ink, 1.2), arrow(60, 70, 74, 70, C.grey, 1.8),
    greyed(ellipse(104, 70, 9, 30, C.grey, C.ink, 1.3))),
  // three panels, same person, same size: a plant in the chest grows from seed to flower while she helps others and stands taller
  'lita.växa.3': all(ground(),
    panel(2, 10, 38, 102), panel(41, 10, 38, 102), panel(80, 10, 38, 102),
    grower(21, 0, false),
    grower(58, 1, true), mini(70, 100, C.yellow), line('M66 86 L69 92', C.skin, 2.4),
    grower(99, 2, true), waGrow('lita-vx3', all(...[0, 72, 144, 216, 288].map((a) => circle(99 + Math.cos((a * Math.PI) / 180) * 3.6, 56 + Math.sin((a * Math.PI) / 180) * 3.6, 2.8, C.pink, C.ink, 0.6)), circle(99, 56, 1.8, C.yellow, null))),
    ring(99, 60, 11)),
  // a caterpillar fades away and a butterfly appears
  'lita.förvandlas': all(ground(), line('M10 100 C30 96 40 104 60 100', C.green, 3),
    moving('lita-fv1', '0%,30%{opacity:1}60%,100%{opacity:.15}', { dur: 3 }, greyed(caterpillar(20, 94, 1))),
    arrow(52, 80, 66, 66, HL, 2.4), sparkle(70, 44, 5, HL), sparkle(104, 76, 4, HL),
    moving('lita-fv2', '0%,30%{opacity:0}60%,100%{opacity:1}', { dur: 3 }, butterfly(88, 52, 1.6))),
  // a tangled scribble in the thought cloud becomes a glowing light bulb
  'lita.komma-till-insikt': all(ground(), P({ x: 26, h: 0.64, top: C.denim, mood: 'shock' }),
    circle(42, 50, 2.6, C.white, C.ink, 1.1), circle(48, 42, 3.4, C.white, C.ink, 1.1), ellipse(80, 28, 36, 22, C.white, C.ink, 1.6),
    moving('lita-ins1', '0%,35%{opacity:1}55%,100%{opacity:.2}', { dur: 3 }, path('M52 30 C55 18 62 40 66 24 C68 16 72 36 74 28', 'none', C.grey, 1.6)),
    arrow(74, 30, 86, 30, HL, 2),
    moving('lita-ins2', '0%,35%{opacity:0}55%,100%{opacity:1}', { dur: 3 }, bulb(100, 32))),
};

// ── 4356 Konflikt och vändpunkt ──────────────────────────────────────
const M6: Record<string, Svg> = {
  // one person sways between two wishes in her own thought clouds: stay home or leave
  'lita.inre-konflikt': all(ground(),
    waSway('lita-ik', 6, P({ x: 60, h: 0.66, top: C.orange, hairStyle: 'long', mood: 'frown' })),
    thought(24, 26, 34, house(24, 34, 0.7), false), thought(96, 26, 34, suitcase(96, 28, C.red, 0.9), true),
    arrow(46, 48, 32, 40, HL, 2), arrow(74, 48, 88, 40, HL, 2)),
  // forces from outside press on one person: a storm on one side, an angry opponent on the other
  'lita.yttre-konflikt': all(ground(), P({ x: 60, h: 0.6, top: C.orange, mood: 'frown' }), cloud(18, 30, 1, '#6b7280'), rain(18, 46),
    P({ x: 104, h: 0.6, top: C.dark, mood: 'angry' }), arrow(28, 56, 46, 66, HL, 2.6), arrow(92, 56, 74, 66, HL, 2.6), arrow(60, 20, 60, 40, HL, 2.6), coin(60, 14, 5)),
  // two players across a game board: each is the other's opponent
  'lita.motståndare.2': all(ground(), rect(36, 78, 48, 8, C.tan, 1, C.ink, 1.6), line('M44 86 L44 112 M76 86 L76 112', C.brown, 3),
    ...[0, 1, 2, 3].map((i) => rect(42 + i * 9, 70, 9, 8, i % 2 ? C.white : C.dark, 0, C.ink, 0.8)),
    P({ x: 18, h: 0.6, top: C.denim, mood: 'angry' }), P({ x: 102, h: 0.6, top: C.red, hairStyle: 'long', mood: 'angry' }),
    path('M36 40 L44 46 M84 40 L76 46', 'none', HL, 2.2)),
  // a staircase: each step up, the angry bubbles get bigger
  'lita.trappa-upp.2': all(ground(), path('M8 112 L8 96 L36 96 L36 80 L64 80 L64 64 L92 64 L92 48 L112 48 L112 112 Z', C.beige, C.ink, 1.6),
    waIn('lita-tu1', 0, 8, bubble(22, 80, 14, bolt(22, 78, 0.35), true)),
    waIn('lita-tu2', 0, 10, bubble(50, 60, 20, bolt(50, 58, 0.55), true)),
    waIn('lita-tu3', 0, 12, bubble(80, 38, 28, all(bolt(74, 36, 0.6), bolt(86, 36, 0.6)), true)),
    arrow(14, 24, 100, 14, HL, 2.2)),
  // the family house and a heart lie on the table while the dice roll
  'lita.stå-på-spel': all(ground(), rect(10, 78, 100, 8, C.green, 2, C.ink, 1.6), line('M20 86 L20 112 M100 86 L100 112', C.brown, 3),
    house(44, 78, 1.1, C.red), heart(70, 68, 1), ring(56, 64, 24),
    waSway('lita-sp', 25, dice(92, 50, 1.2)), sparkle(102, 38, 3)),
  // close-up: two faces in profile, close; one holds up a photo as proof, the other lowers his eyes
  'lita.konfrontation': all(
    profile(26, 52, 1.05, C.hair), profile(96, 54, 1.05, '#8a5a3a', true, true),
    path('M16 76 L36 76 L40 112 L12 112 Z', C.denim, C.ink, 1.6), path('M84 78 L104 78 L108 112 L80 112 Z', C.red, C.ink, 1.6),
    line('M34 90 L50 76', C.skin, 5),
    waIn('lita-kf', -12, 6, all(g('rotate(-8 60 64)', rect(48, 52, 24, 22, C.white, 1, C.ink, 1.6), rect(51, 55, 18, 15, '#bfe3f5', 0, null), mini(60, 63, C.red, true)), circle(60, 63, 15, 'none', HL, 2.2))),
    path('M106 38 C108 34 110 34 110 38 C110 40 106 40 106 38 Z', '#8cc7e8', C.ink, 0.8)),
  // two people balance on the very tip of a sharp peak: it cannot go on like this
  'lita.ställas-på-sin-spets': all(ground(), path('M20 112 L60 40 L100 112 Z', '#b9bec6', C.ink, 2),
    waSway('lita-spets', 5, all(mini(52, 30, C.denim), mini(68, 30, C.red, true), line('M44 42 L76 42', C.ink, 1.6))),
    path('M56 40 L60 36 L64 40', 'none', HL, 2.4), ring(60, 34, 18)),
  // a tug of war: two sides pull on one rope
  'lita.kamp': all(ground(), rope(16, 104, 74), line('M60 66 L60 82', HL, 2.4),
    P({ x: 22, h: 0.6, top: C.denim, mood: 'angry' }), P({ x: 98, h: 0.6, top: C.red, hairStyle: 'long', mood: 'angry' }),
    line('M14 112 l-6 0 M106 112 l6 0', C.brown, 2), path('M30 66 L36 74 M90 66 L84 74', 'none', C.skin, 3)),
  // the story line runs calmly along, then suddenly swerves the other way: a surprise (!)
  'lita.vändning.2': all(ground(), openBook(60, 98, 2.2, false),
    line('M14 82 L66 74', C.grey, 2.6), mini(18, 72, C.denim),
    waIn('lita-vd', -10, 8, all(path('M66 74 C78 72 86 70 86 60 C86 46 70 40 60 44', 'none', HL, 3.2), path('M64 39 L60 44 L66 47', 'none', HL, 3.2))),
    T(98, 44, '!', 26, HL, 900), sparkle(104, 22, 4, HL)),
  // one small push makes a long row of dominoes fall and the house collapses
  'lita.ödesdiger': all(ground(), palm(10, 92, 0, C.navy, 0.5),
    ...[0, 1, 2, 3, 4].map((i) => domino(26 + i * 12, 112, 20 + i * 5, i === 0 ? OR : C.white)),
    house(98, 112, 1.4, '#7a7f88'), path('M86 80 L94 88 L90 92 L100 100', 'none', C.ink, 1.4), cloud(98, 70, 0.7, C.grey2), cross(98, 50, 6)),
};

// ── 4357 Tolka ett litterärt verk ────────────────────────────────────
const M7: Record<string, Svg> = {
  // a whole library of different kinds of books: novels on the shelves, a poem page, a play with masks (no people)
  'lita.litteratur': all(ground(), rect(10, 14, 100, 76, C.brown, 2, C.ink, 1.8), line('M10 52 L110 52', C.ink, 2),
    ...[[18, 30, C.red], [27, 28, C.navy], [36, 31, C.green], [45, 26, C.yellow], [54, 30, C.purple], [63, 29, C.denim], [72, 27, C.orange], [81, 31, C.red], [90, 28, C.mint], [99, 30, C.navy]].map(([x, h, col]) => spine(x as number, 51, h as number, col as string)),
    ...[[18, 30, C.green], [27, 32, C.pink], [36, 28, C.navy], [45, 31, C.red], [54, 27, C.yellow], [63, 30, C.green], [72, 32, C.denim], [81, 28, C.purple], [90, 31, C.orange], [99, 29, C.red]].map(([x, h, col]) => spine(x as number, 89, h as number, col as string)),
    rect(12, 92, 30, 20, C.white, 1, C.ink, 1.4), line('M16 97 L34 97 M16 101 L30 101 M16 106 L34 106 M16 110 L28 110', C.grey2, 1.4),
    at(62, 102, 1, path('M-10 -8 C-10 4 -2 8 0 8 C2 8 6 4 6 -8 Z', C.white, C.ink, 1.3), circle(-5, -3, 1, C.ink, null), circle(1, -3, 1, C.ink, null), path('M-5 2 Q-2 5 1 2', 'none', C.ink, 1)),
    at(78, 102, 1, path('M-6 -8 C-6 4 2 8 4 8 C6 8 10 4 10 -8 Z', C.yellow, C.ink, 1.3), circle(-1, -3, 1, C.ink, null), circle(5, -3, 1, C.ink, null), path('M-1 4 Q2 1 5 4', 'none', C.ink, 1)),
    book(100, 100, 0.5, C.navy)),
  // contrast pair: the bound classics with a feather pen belong to literature (orange, tick); a manual and a phone book do not (grey, cross)
  'lita.litterär': all(ground(),
    rect(4, 10, 54, 98, '#fff3e6', 4, HL, 2.6),
    ...[[14, C.red], [24, C.navy], [34, C.green], [44, C.purple]].map(([x, col]) => all(rect((x as number) - 4.5, 34, 9, 44, col as string, 1.5, C.ink, 1.3), line(`M${(x as number) - 3} 40 L${(x as number) + 3} 40 M${(x as number) - 3} 70 L${(x as number) + 3} 70`, C.gold, 1.6))),
    line('M8 78 L54 78', C.brown, 3), path('M14 104 C22 88 34 82 48 80 C40 90 30 98 18 104 Z', C.white, C.ink, 1.3), line('M16 104 L22 96', C.ink, 1.2),
    path('M22 22 l4 5 l9 -11', 'none', C.green, 3),
    greyed(all(rect(64, 30, 22, 30, C.white, 1.5, C.ink, 1.4), at(75, 45, 0.6, circle(0, 0, 6, 'none', C.ink, 2), line('M4 4 L12 12', C.ink, 3)),
      rect(90, 30, 24, 30, C.yellow, 1.5, C.ink, 1.4), line('M93 36 L111 36 M93 41 L111 41 M93 46 L111 46 M93 51 L111 51 M102 34 L102 56', C.ink, 0.8),
      rect(64, 64, 50, 44, '#eef0f2', 4, C.grey, 1.6))), cross(89, 84, 12)),
  // everything starts from the book: arrows grow outwards from it to new ideas
  'lita.utgå-från': all(ground(), openBook(32, 82, 1.3), ring(32, 82, 22),
    waIn('lita-ut1', -40, 20, arrow(56, 74, 84, 52, HL, 2.4)), waIn('lita-ut2', -40, 0, arrow(58, 84, 90, 84, HL, 2.4)),
    circle(94, 42, 10, C.white, C.ink, 1.4), bulb(94, 44), circle(102, 86, 10, C.white, C.ink, 1.4), heart(102, 86, 0.6)),
  // a magnifying glass over one line: every word is read closely
  'lita.närläsning': all(ground(), rect(14, 20, 70, 88, C.white, 2, C.ink, 1.6), lines(22, 32, 54, 3, 8), lines(22, 80, 54, 3, 8),
    rect(20, 56, 58, 12, OR, 2, null), line('M24 62 L40 62 M44 62 L58 62 M62 62 L74 62', C.ink, 1.6),
    magnifier(66, 62, 2), eye(100, 34, 0.9)),
  // a page in the book shows a rich man standing on poor people, with a red warning mark
  'lita.samhällskritik': all(ground(), openBook(60, 90, 2.3, false),
    rect(44, 44, 26, 24, C.gold, 2, C.ink, 1.4), T(57, 60, '¤', 12, C.ink, 900), at(57, 0, 1, circle(0, 32, 5, C.skin, C.ink, 1.2), rect(-5, 18, 10, 6, C.black, 1, C.ink, 1), path('M-6 44 L6 44 L5 37 L-5 37 Z', C.black, C.ink, 1)),
    mini(30, 80, C.grey), mini(86, 80, C.grey), line('M38 76 L44 70 M78 76 L70 70', C.grey, 1.4),
    path('M92 20 L108 48 L76 48 Z', C.red, C.ink, 1.6), T(92, 44, '!', 14, C.white, 900)),
  // one author and a row of his own books, one after the other, in order
  'lita.författarskap': all(ground(), rect(28, 88, 88, 6, C.brown, 1, C.ink, 1.6),
    rect(4, 26, 26, 30, C.white, 2, C.ink, 1.6), at(17, 0, 1, circle(0, 36, 6, C.skin, C.ink, 1.4), path('M-6 34 C-6 28 6 28 6 34 C3 31 -3 31 -6 34 Z', C.hair, null), path('M-9 54 C-9 45 9 45 9 54 Z', C.navy, C.ink, 1.2)),
    ...[0, 1, 2, 3, 4, 5].map((i) => all(spine(38 + i * 14, 88, 30, C.navy, 11), circle(38 + i * 14, 72, 2.6, OR, null))),
    line('M30 46 L110 46', HL, 1.4, '3 3'), ...[0, 1, 2, 3, 4, 5].map((i) => line(`M${38 + i * 14} 46 L${38 + i * 14} 56`, HL, 1.2, '2 2')),
    arrow(36, 102, 108, 102, C.grey, 1.8), ring(17, 41, 18)),
  // a life on a timeline (baby, school, portrait) is mirrored in the book: arrows go from each event into a chapter
  'lita.biografisk': all(ground(),
    line('M8 34 L112 34', C.grey, 2), arrow(100, 34, 114, 34, C.grey, 2),
    at(20, 30, 1, path('M-10 -2 L10 -2 C10 6 -10 6 -10 -2 Z', C.tan, C.ink, 1.3), circle(-4, -5, 4, C.skin, C.ink, 1.1)),
    house(56, 30, 0.7, C.yellow), rect(84, 12, 20, 22, C.white, 1, C.ink, 1.4), mini(94, 26, C.denim),
    openBook(60, 90, 2.1), line('M30 80 L44 80 M30 86 L44 86 M52 80 L56 80 M66 80 L70 80 M76 80 L90 80 M76 86 L90 86', C.grey2, 1.4),
    arrow(20, 42, 34, 74, HL, 2.2), arrow(56, 42, 58, 74, HL, 2.2), arrow(94, 42, 84, 74, HL, 2.2)),
};

export const LITA_MOTIFS: Record<string, Svg> = { ...M1, ...M2, ...M3, ...M4, ...M5, ...M6, ...M7 };
