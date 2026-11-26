/**
 * Kultur & fritid → Språk & litteratur → Svenska språkhistorien, 4361–4367 (0.61): Old Swedish, loanwords from
 * Low German, French and English, the rise of standard Swedish, spelling reforms, dialect areas and language
 * change today. Recurring signs: a three-part timeline (runestone · book · phone) where the orange segment is the
 * period the word names; words are white tiles with short Swedish example words (never the target term), the
 * part the word names is orange and grey tiles or grey drawings are the reference; a simplified map of Sweden
 * (and Finland) where the region the word names is orange. Contrast pairs share one layout: språkfamilj/germansk
 * (the whole tree or one branch), fornnordiska/fornsvenska (ship or writing desk + timeline segment), franska/
 * engelska (flag + greeting), anglicism/svengelska (one tile or a whole bubble), the dialect regions (one map).
 * Flags only as simple colour blocks; no brands; Japanese only as kana in the spelling reform comparison.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, sparkle, star, waGrow, waIn, type Svg } from './kit';
import { HL, T } from './people';
import { figure } from './figures';
import { P, greyed } from './blindFix';

// ── Basics ───────────────────────────────────────────────────────────
const OR = '#fbd3bd';
const GT = '#e4e7eb';
const PARCH = '#f3e3bf';
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const tile = (x: number, y: number, w: number, txt: string, fill: string = C.white, col: string = C.ink, fs = 8.5) =>
  all(rect(x - w / 2, y - 8, w, 16, fill, 3, C.ink, 1.4), T(x, y + 3, txt, fs, col, 700));
const hot = (x: number, y: number, w: number, txt: string, fs = 8.5) => all(tile(x, y, w, txt, OR, C.ink, fs), rect(x - w / 2 - 2.5, y - 10.5, w + 5, 21, 'none', 5, HL, 2.4));
const dim = (x: number, y: number, w: number, txt: string, fs = 8.5) => all(rect(x - w / 2, y - 8, w, 16, GT, 3, C.grey, 1.2), T(x, y + 3, txt, fs, C.grey, 700));
const cross = (x: number, y: number, r = 6, col: string = C.red) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 2.6);
const check = (x: number, y: number, col: string = C.green) => line(`M${x - 6} ${y} L${x - 2} ${y + 5} L${x + 7} ${y - 6}`, col, 3);
const lines = (x: number, y: number, w: number, n: number, gap = 5, col: string = C.grey2) => line(Array.from({ length: n }, (_, i) => `M${x} ${y + i * gap} L${x + w - (i % 3 === 2 ? 8 : 0)} ${y + i * gap}`).join(' '), col, 1.6);
/** Speech bubble with a free shape inside, tail pointing down-left or down-right. */
const say = (x: number, y: number, w: number, inner: Svg, tailLeft = true, fill: string = C.white, stroke: string = C.ink) =>
  all(path(`M${x - w / 2} ${y - 11} L${x + w / 2} ${y - 11} L${x + w / 2} ${y + 9} L${tailLeft ? x - 4 : x + 8} ${y + 9} L${tailLeft ? x - 10 : x + 2} ${y + 16} L${tailLeft ? x - 9 : x + 1} ${y + 9} L${x - w / 2} ${y + 9} Z`, fill, stroke, 1.6), inner);

// ── Flags (plain colour blocks) ──────────────────────────────────────
const flagSe = (x: number, y: number, w = 22, h = 14) => all(rect(x, y, w, h, '#2a65b3', 1, C.ink, 1.2), rect(x + w * 0.3, y, w * 0.14, h, C.yellow, 0, null), rect(x, y + h * 0.42, w, h * 0.16, C.yellow, 0, null));
const flagFr = (x: number, y: number, w = 22, h = 14) => all(rect(x, y, w / 3, h, '#2a4fa3', 0, null), rect(x + w / 3, y, w / 3, h, C.white, 0, null), rect(x + (2 * w) / 3, y, w / 3, h, C.red, 0, null), rect(x, y, w, h, 'none', 1, C.ink, 1.2));
const flagUk = (x: number, y: number, w = 22, h = 14) => all(rect(x, y, w, h, '#24418f', 1, null),
  line(`M${x} ${y} L${x + w} ${y + h} M${x + w} ${y} L${x} ${y + h}`, C.white, h * 0.22), line(`M${x} ${y} L${x + w} ${y + h} M${x + w} ${y} L${x} ${y + h}`, C.red, h * 0.08),
  line(`M${x + w / 2} ${y} L${x + w / 2} ${y + h} M${x} ${y + h / 2} L${x + w} ${y + h / 2}`, C.white, h * 0.34), line(`M${x + w / 2} ${y} L${x + w / 2} ${y + h} M${x} ${y + h / 2} L${x + w} ${y + h / 2}`, C.red, h * 0.18),
  rect(x, y, w, h, 'none', 1, C.ink, 1.2));
const flagDe = (x: number, y: number, w = 22, h = 14) => all(rect(x, y, w, h / 3, C.black, 0, null), rect(x, y + h / 3, w, h / 3, C.red, 0, null), rect(x, y + (2 * h) / 3, w, h / 3, C.gold, 0, null), rect(x, y, w, h, 'none', 1, C.ink, 1.2));
const flagFi = (x: number, y: number, w = 22, h = 14) => all(rect(x, y, w, h, C.white, 1, C.ink, 1.2), rect(x + w * 0.3, y, w * 0.14, h, '#2a4fa3', 0, null), rect(x, y + h * 0.42, w, h * 0.16, '#2a4fa3', 0, null));

// ── Small pictures ───────────────────────────────────────────────────
const runestone = (x: number, y: number, s = 1, col: string = '#b9b4a8') => at(x, y, s, path('M-10 0 C-12 -14 -8 -26 0 -28 C8 -26 12 -14 10 0 Z', col, C.ink, 1.6),
  path('M-6 -4 C-8 -14 -4 -22 0 -23 C4 -22 8 -14 6 -4', 'none', C.red, 1.6), line('M-2 -18 L-2 -10 M-2 -16 L1 -14 M2 -12 L2 -6 M2 -10 L5 -8', C.ink, 1));
const book = (x: number, y: number, s = 1, col: string = C.brown) => at(x, y, s, rect(-10, -13, 20, 26, col, 2, C.ink, 1.6), line('M-6 -13 L-6 13', 'rgba(0,0,0,0.25)', 2), rect(-2, -8, 9, 4, C.gold, 1, null));
const phone = (x: number, y: number, s = 1) => at(x, y, s, rect(-7, -12, 14, 24, C.dark, 3, C.ink, 1.4), rect(-5, -9, 10, 16, '#bfe3f5', 1, null), circle(0, 9.5, 1.2, C.grey2, null));
const openBook = (x: number, y: number, s = 1, fill: string = C.white) => at(x, y, s, path('M0 -14 C-8 -18 -18 -16 -24 -13 L-24 12 C-18 9 -8 9 0 13 Z', fill, C.ink, 1.6), path('M0 -14 C8 -18 18 -16 24 -13 L24 12 C18 9 8 9 0 13 Z', fill, C.ink, 1.6),
  line('M-20 -8 L-5 -9 M-20 -3 L-5 -4 M-20 2 L-5 1 M5 -9 L20 -8 M5 -4 L20 -3 M5 1 L20 2', C.grey, 1.2));
/** Timeline: runestone · book · phone; `mark` = the orange segment (0, 1, 2) or -1 for all. */
const timeline = (mark: number, y = 100) => {
  const xs = [24, 60, 96];
  return all(line(`M8 ${y} L110 ${y}`, C.grey, 2.4), arrow(100, y, 114, y, C.grey, 2.4),
    ...xs.map((x, i) => (mark === i || mark === -1 ? rect(x - 16, y - 4, 32, 8, OR, 3, HL, 2) : rect(x - 16, y - 3, 32, 6, GT, 3, null))),
    ...xs.map((x, i) => circle(x, y, 2.4, mark === i || mark === -1 ? HL : C.grey, null)));
};
const ship = (x: number, y: number, s = 1, sail: string = C.red) => at(x, y, s, path('M-24 0 C-18 8 18 8 24 0 L28 -6 L22 -2 L-22 -2 L-28 -6 Z', C.brown, C.ink, 1.6),
  line('M0 -2 L0 -32', C.ink, 2), path('M-14 -30 L14 -30 L14 -8 L-14 -8 Z', sail, C.ink, 1.4), line('M-14 -24 L14 -24 M-14 -16 L14 -16', C.white, 2));
const cog = (x: number, y: number, s = 1) => at(x, y, s, path('M-26 -4 L-22 6 L22 6 L26 -6 L18 -2 L-18 -2 Z', '#8a5a34', C.ink, 1.6), rect(14, -12, 10, 8, '#8a5a34', 1, C.ink, 1.2),
  line('M0 -2 L0 -36', C.ink, 2), path('M-13 -34 L13 -34 L13 -8 L-13 -8 Z', C.white, C.ink, 1.4), path('M0 -36 L10 -40 L0 -42 Z', C.red, C.ink, 0.8));
const quill = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 L14 -20 C18 -26 24 -26 22 -20 C18 -12 8 -6 0 0 Z', C.white, C.ink, 1.2), line('M0 0 L-2 3', C.ink, 1.6));
const desk = (y = 88, x1 = 14, x2 = 106) => all(rect(x1, y, x2 - x1, 6, C.tan, 2, C.ink, 1.6), line(`M${x1 + 8} ${y + 6} L${x1 + 8} 112 M${x2 - 8} ${y + 6} L${x2 - 8} 112`, C.brown, 3));
const runes = (x: number, y: number, col: string = C.ink) => line(`M${x} ${y - 5} L${x} ${y + 5} M${x} ${y - 5} L${x + 4} ${y - 2} M${x} ${y} L${x + 4} ${y - 3} M${x + 8} ${y - 5} L${x + 8} ${y + 5} M${x + 8} ${y - 5} L${x + 12} ${y} L${x + 12} ${y + 5} M${x + 16} ${y - 5} L${x + 16} ${y + 5} M${x + 16} ${y - 2} L${x + 20} ${y} L${x + 16} ${y + 2}`, col, 1.6);
const squiggle = (x: number, y: number, w: number, col: string = C.navy) => line(`M${x} ${y} q3 -4 6 0 t6 0 t6 0${w > 24 ? ' t6 0' : ''}${w > 30 ? ' t6 0' : ''}`, col, 1.8);
const fan = (x: number, y: number) => at(x, y, 1, path('M0 0 L-10 -12 Q0 -16 10 -12 Z', C.pink, C.ink, 1.2), line('M0 0 L-6 -13 M0 0 L0 -14 M0 0 L6 -13', C.ink, 0.8));
const house = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, path('M-10 0 L-10 -12 L0 -20 L10 -12 L10 0 Z', col, C.ink, 1.4), rect(-3, -7, 6, 7, C.brown, 1, C.ink, 1));
const church = (x: number, y: number, s = 1) => at(x, y, s, rect(-10, -14, 20, 14, C.white, 1, C.ink, 1.4), path('M-12 -14 L0 -22 L12 -14 Z', C.red, C.ink, 1.4), rect(-4, -34, 8, 14, C.white, 1, C.ink, 1.4), path('M-5 -34 L0 -44 L5 -34 Z', C.dark, C.ink, 1.2), line('M0 -44 L0 -48 M-2 -46 L2 -46', C.ink, 1));
const laptop = (x: number, y: number, s = 1, screen: Svg = '') => at(x, y, s, rect(-24, -32, 48, 32, C.dark, 3, C.ink, 1.6), rect(-21, -29, 42, 26, '#dff1fb', 1, null), path('M-30 0 L30 0 L26 6 L-26 6 Z', C.grey2, C.ink, 1.4), screen);
const envelope = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, rect(-12, -8, 24, 16, col, 2, C.ink, 1.4), path('M-12 -8 L0 2 L12 -8', 'none', C.ink, 1.2));
const pen = (x: number, y: number, rot = 0, col: string = C.red) => g(`translate(${x} ${y}) rotate(${rot})`, rect(-2.5, -18, 5, 16, col, 1, C.ink, 1.2), path('M-2.5 -2 L2.5 -2 L0 4 Z', C.beige, C.ink, 1));
const gavel = (x: number, y: number) => at(x, y, 1, g('rotate(-30)', rect(-10, -5, 20, 10, C.brown, 2, C.ink, 1.4), line('M0 5 L0 22', C.brown, 3.4)), rect(-12, 18, 26, 5, C.brown, 1, C.ink, 1.2));
const tree = (x: number, y: number, s = 1) => at(x, y, s, rect(-2, -14, 4, 14, C.brown, 1, C.ink, 1.2), circle(0, -22, 10, C.green, C.ink, 1.4));
const mouthProfile = (x: number, y: number, s = 1) => at(x, y, s, path('M-14 -30 C-2 -32 8 -24 8 -14 L12 -6 L8 -4 C10 0 8 2 6 3 C8 6 6 9 2 9 C2 14 -2 18 -10 18', C.skin, C.ink, 1.8), path('M7 2 L-2 2', 'none', C.ink, 1.4));

// ── Map of Sweden (and Finland) ──────────────────────────────────────
type Pt = readonly [number, number];
const poly = (pts: readonly Pt[]) => 'M' + pts.map(([x, y]) => `${x} ${y}`).join(' L') + ' Z';
const GOT_W: Pt[] = [[38, 80], [39, 83], [37, 87], [38, 92], [40, 97], [43, 101], [41, 105], [43, 110], [47, 113]];
const GOT_E: Pt[] = [[50, 112], [53, 108], [56, 104], [58, 99], [59, 94], [62, 89], [63, 84], [66, 80]];
const SVEA_W: Pt[] = [[44, 66], [40, 70], [41, 75], [38, 80]];
const SVEA_E: Pt[] = [[66, 80], [70, 76], [67, 72], [64, 68]];
const NORR: Pt[] = [[64, 68], [64, 63], [66, 59], [68, 54], [70, 49], [73, 44], [77, 40], [80, 36], [83, 31], [86, 27], [86, 22], [83, 17], [84, 12], [82, 7], [77, 6], [73, 10], [69, 16], [65, 21], [62, 27], [58, 32], [55, 38], [52, 44], [48, 49], [48, 55], [45, 60], [44, 66]];
const SWEDEN = poly([...NORR.slice(0, -1), ...SVEA_W, ...GOT_W, ...GOT_E, ...SVEA_E.slice(0, -1)]);
const GOT = poly([...GOT_W, ...GOT_E]);
const SVEA = poly([...SVEA_W, ...SVEA_E]);
const NORRP = poly(NORR);
const SKANE = poly([[43, 101], [41, 105], [43, 110], [47, 113], [50, 112], [53, 108], [54, 103], [48, 101]]);
const DALA = poly([[41, 75], [40, 70], [44, 66], [45, 61], [52, 61], [55, 67], [51, 74]]);
const FINLAND = poly([[84, 12], [88, 8], [92, 14], [96, 22], [102, 30], [106, 42], [110, 56], [108, 68], [102, 78], [92, 82], [84, 80], [80, 76], [83, 70], [85, 62], [83, 54], [84, 46], [87, 38], [87, 30], [86, 22]]);
const LAND = '#e8eedf';
const gotland = (fill: string) => all(path('M69 86 C73 85 74 92 72 98 C70 101 67 99 68 94 C67 90 67 87 69 86 Z', fill, C.ink, 1.2), path('M60 96 L62 95 L61 104 L59 104 Z', LAND, C.ink, 1));
/** The map; `regions` are drawn orange on top of the land. */
const sweden = (regions: Svg = '', gotFill: string = LAND, finland = false, finFill: string = GT) => all(rect(10, 4, 100, 110, '#e3f1fb', 8, null),
  finland ? path(FINLAND, finFill, C.ink, 1.2) : '', path(SWEDEN, LAND, null), regions, path(SWEDEN, 'none', C.ink, 1.6), gotland(gotFill));
const area = (d: string, fill: string = '#f6a77c') => path(d, fill, null);
/** Small speech bubble with three wavy lines, used on the map. */
const miniSay = (x: number, y: number, col: string = C.navy, fill: string = C.white) => all(path(`M${x - 9} ${y - 6} L${x + 9} ${y - 6} L${x + 9} ${y + 5} L${x - 1} ${y + 5} L${x - 5} ${y + 10} L${x - 5} ${y + 5} L${x - 9} ${y + 5} Z`, fill, C.ink, 1.2), squiggle(x - 6, y, 12, col));

// ── 4361 Fornsvenska ─────────────────────────────────────────────────
const tree3 = (branchHL: number) => {
  const tips: [number, number][] = [[22, 64], [46, 56], [74, 56], [98, 64]];
  const flags = [
    [flagSe(10, 66, 14, 9), flagUk(10, 78, 14, 9), flagDe(10, 90, 14, 9)],
    [all(rect(38, 62, 16, 10, '#e9d8a6', 1, C.ink, 1), T(46, 70, 'हि', 7, C.ink, 700))],
    [all(rect(66, 62, 16, 10, '#c9e3c0', 1, C.ink, 1), T(74, 70, 'Ω', 8, C.ink, 700))],
    [all(rect(90, 66, 16, 10, '#f3c3c3', 1, C.ink, 1), T(98, 74, 'Я', 8, C.ink, 700))],
  ];
  return all(circle(60, 18, 9, C.brown, C.ink, 1.6), line('M60 27 L60 38', C.brown, 3),
    ...tips.map(([x, y], i) => all(line(`M60 38 Q${(60 + x) / 2} ${y - 18} ${x} ${y - 6}`, branchHL === -1 || branchHL === i ? C.brown : C.grey2, branchHL === i ? 4 : 3),
      branchHL === -1 || branchHL === i ? all(...flags[i]!) : greyed(...flags[i]!))),
    branchHL >= 0 ? frame(5, 58, 30, 46) : ring(60, 18, 13));
};
const M1: Record<string, Svg> = {
  // the whole line of time, from runestone to phone, all lit
  'lhist.språkhistoria': all(runestone(24, 80, 1.1), book(60, 72, 1.2), phone(96, 72, 1.2), say(24, 26, 22, runes(16, 26)), say(60, 26, 22, squiggle(53, 26, 14)), say(96, 26, 22, squiggle(89, 26, 14), false),
    timeline(-1), arrow(36, 46, 48, 46, HL, 2.4), arrow(72, 46, 84, 46, HL, 2.4)),
  // one old root, all branches with their languages
  'lhist.språkfamilj': tree3(-1),
  // the same tree, only the branch with Swedish, English and German
  'lhist.germansk': tree3(0),
  // a Viking ship and runes in the bubble; the first segment of the timeline
  'lhist.fornnordiska': all(path('M4 80 Q30 74 60 80 T116 80 L116 92 L4 92 Z', '#bfe3f5', null), ship(56, 80, 1.3), figure({ x: 50, h: 0.38, top: C.denim }),
    say(84, 26, 36, runes(74, 26)), timeline(0, 104)),
  // a scribe writes a law book in the Middle Ages; the middle segment of the timeline
  'lhist.fornsvenska': all(desk(76), P({ x: 34, h: 0.6, top: C.brown, mood: 'calm' }), rect(48, 66, 34, 10, PARCH, 1, C.ink, 1.4), lines(52, 69, 24, 2, 3, C.dark), quill(70, 66, 0.8),
    church(98, 76, 0.7), say(70, 28, 34, squiggle(58, 28, 24)), timeline(1, 104)),
  // the same man: a different form when he does something and when something is done to him
  'lhist.kasus': all(line('M4 60 L116 60', C.grey2, 1.4, '3 3'),
    g('translate(0 -54)', figure({ x: 30, h: 0.38, top: C.denim }), arrow(42, 92, 72, 92, C.grey, 2.2), figure({ x: 90, h: 0.38, top: C.pink, hairStyle: 'long' })), hot(30, 14, 24, 'han', 8.5),
    figure({ x: 30, h: 0.38, top: C.pink, hairStyle: 'long' }), arrow(42, 92, 72, 92, C.grey, 2.2), figure({ x: 90, h: 0.38, top: C.denim }), hot(90, 68, 36, 'honom', 8.5)),
  // a yellowed, ornate page next to a plain modern tile
  'lhist.ålderdomlig': all(dim(26, 30, 34, 'inte', 10), rect(44, 16, 64, 84, PARCH, 3, C.ink, 1.8), path('M44 16 L56 26 L44 30 Z', '#e2cc96', C.ink, 1),
    `<text x="76" y="52" font-family="serif" font-style="italic" font-weight="700" font-size="20" text-anchor="middle" fill="${C.brown}">icke</text>`,
    lines(52, 66, 48, 5, 6, '#c4a76a'), line('M100 20 C104 24 104 30 100 32 M96 20 L104 30', C.grey, 0.8), ring(76, 46, 22)),
  // the bubble of the oldest speaker fades away; the young have none
  'lhist.dö-ut.2': all(ground(), P({ x: 26, h: 0.62, top: C.brown, hair: C.grey2, mood: 'calm' }), P({ x: 60, h: 0.62, top: C.green }), P({ x: 94, h: 0.56, top: C.sky, hairStyle: 'long' }),
    moving('lh-doeut', '0%,15%{opacity:1}70%,100%{opacity:0.08}', { dur: 3.6 }, say(30, 26, 30, squiggle(20, 26, 20))),
    path('M50 18 L70 18 L70 32 L50 32 Z', 'none', C.grey2, 1.4), path('M84 22 L104 22 L104 36 L84 36 Z', 'none', C.grey2, 1.4), T(60, 29, '?', 10, C.grey), T(94, 33, '?', 10, C.grey)),
};
// ── 4362 Lågtyska lånord ─────────────────────────────────────────────
const merchant = (x: number, top: string = C.red) => all(figure({ x, h: 0.5, top, bottom: C.dark }), path(`M${x - 5} 63 C${x - 5} 56 ${x + 5} 56 ${x + 5} 63 Z`, C.dark, C.ink, 1.2), rect(x - 8, 62, 16, 2.6, C.dark, 1, null));
const sweSpeaker = (x: number, top: string = C.sky) => figure({ x, h: 0.5, top, hairStyle: 'long' });
const M2: Record<string, Svg> = {
  // a Hanseatic cog in the harbour and its merchant talking
  'lhist.lågtyska': all(path('M4 92 Q30 86 60 92 T116 92 L116 112 L4 112 Z', '#bfe3f5', null), cog(76, 94, 1.1), merchant(26), say(48, 22, 40, tile(48, 22, 32, 'frukost', OR, C.ink, 7)),
    rect(4, 98, 38, 4, C.brown, 0, C.ink, 1.2)),
  // a word tile travels from the merchant's bubble into the Swedish speaker's bubble (the old one stays)
  'lhist.låna.3': all(ground(), merchant(22), sweSpeaker(98), say(24, 22, 36, tile(24, 22, 28, 'betala', GT, C.grey, 7), false),
    say(96, 22, 36, '', true), flagSe(86, 44, 20, 12), waIn('lh-lana', -60, 0, hot(96, 22, 28, 'betala', 7)), arrow(46, 46, 74, 46, HL, 2.4)),
  // two bubbles of different languages meet and overlap at a market
  'lhist.språkkontakt': all(ground(), rect(36, 72, 48, 6, C.tan, 1, C.ink, 1.4), path('M34 72 L60 60 L86 72 Z', C.red, C.ink, 1.4), line('M40 78 L40 112 M80 78 L80 112', C.brown, 3),
    merchant(18), sweSpeaker(102),
    waIn('lh-kont-a', -16, 0, all(ellipse(46, 30, 24, 16, 'rgba(242,193,78,0.55)', C.ink, 1.6), flagDe(28, 24, 12, 8))),
    waIn('lh-kont-b', 16, 0, all(ellipse(74, 30, 24, 16, 'rgba(140,199,232,0.55)', C.ink, 1.6), flagSe(80, 24, 12, 8))),
    path('M60 18 C66 24 66 36 60 42 C54 36 54 24 60 18 Z', OR, HL, 2)),
  // the wind blows and the young tree bends with it
  'lhist.påverka': all(ground(), waIn('lh-pav-w', -14, 0, line('M8 40 q8 -4 16 0 t16 0 M4 56 q8 -4 16 0 t16 0 M10 72 q8 -4 16 0 t16 0', C.sky, 2.6)),
    greyed(tree(98, 112, 1.3)),
    moving('lh-pav-t', '0%,100%{transform:rotate(0)}50%{transform:rotate(12deg)}', { dur: 2.4 }, g('translate(64 112)', g('rotate(18)', rect(-2.5, -46, 5, 46, C.brown, 1, C.ink, 1.2), circle(0, -54, 16, C.green, C.ink, 1.6)))),
    arrow(36, 30, 52, 30, HL, 2.6)),
  // the word on top, its roots go down through the timeline to an old form and a cog ship
  'lhist.etymologi': all(hot(60, 16, 40, 'fönster', 9), line('M60 28 L60 44', HL, 2.4), path('M60 44 C50 52 34 50 30 62 M60 44 C70 52 86 50 90 62 M60 44 L60 66', 'none', C.brown, 2.4),
    rect(36, 66, 48, 18, PARCH, 3, C.ink, 1.4), T(60, 79, 'vinster', 9, C.brown, 700), cog(60, 112, 0.5), line('M14 92 L106 92', C.grey2, 1.4, '3 3')),
  // breakfast table: bubbles with the things of every day; a grey bubble with a formula
  'lhist.vardagsord': all(desk(86, 10, 74), P({ x: 32, h: 0.6, top: C.yellow, mood: 'smile' }), at(56, 82, 1, path('M-6 -6 L6 -6 L5 4 C5 7 -5 7 -5 4 Z', C.white, C.ink, 1.4)), ellipse(66, 84, 6, 2.4, C.tan, C.ink, 1),
    say(28, 18, 22, at(28, 18, 0.7, path('M-6 -6 L6 -6 L5 4 C5 7 -5 7 -5 4 Z', C.white, C.ink, 1.4))), say(60, 30, 24, at(60, 30, 0.8, rect(-8, -5, 16, 9, C.yellow, 2, C.ink, 1), circle(-4, 5, 2, C.dark, null), circle(4, 5, 2, C.dark, null))),
    say(92, 18, 22, at(92, 18, 0.9, circle(0, 0, 5, C.gold, C.ink, 1.2)), false), frame(6, 3, 108, 46),
    greyed(say(96, 74, 26, T(96, 77, '∑∫√', 8, C.ink, 700), false))),
};

// ── 4363 Franska och engelska lånord ─────────────────────────────────
const greeter = (flag: Svg, word: string, top: string) => all(ground(), P({ x: 40, h: 0.82, top, mood: 'smile' }), say(84, 30, 44, T(84, 34, word, 10, C.navy, 800), true), flag, frame(60, 52, 48, 32));
const M3: Record<string, Svg> = {
  'lhist.franska': greeter(flagFr(64, 56, 40, 24), 'bonjour', C.navy),
  'lhist.engelska': greeter(flagUk(64, 56, 40, 24), 'hello', C.red),
  'lhist.tyska': greeter(flagDe(64, 56, 40, 24), 'hallo', C.green),
  // an elegant lady with fan and feathered hat, nose high; a plain grey person beside
  'lhist.förnäm': all(ground(), greyed(figure({ x: 26, h: 0.8 })),
    path('M62 112 L68 56 L92 56 L102 112 Z', C.purple, C.ink, 2), figure({ x: 80, h: 0.8, top: C.purple, bottom: C.purple, hairStyle: 'long' }),
    path('M66 30 C70 18 90 16 96 28 Z', C.lilac, C.ink, 1.6), path('M92 22 C100 10 108 12 104 22', 'none', C.pink, 3), fan(64, 66), sparkle(104, 40, 5), sparkle(58, 18, 4),
    line('M76 36 L72 33', C.ink, 1.2)),
  // a French word becomes a Swedish-looking word
  'lhist.försvenska': all(flagFr(8, 18, 20, 13), dim(62, 24, 52, 'bureau', 10), arrow(62, 36, 62, 54, HL, 2.6), flagSe(8, 62, 20, 13), waIn('lh-forsv', 0, -24, hot(62, 68, 44, 'byrå', 11)),
    at(62, 106, 1, rect(-22, -20, 44, 22, C.brown, 2, C.ink, 1.6), line('M-20 -13 L20 -13 M-20 -6 L20 -6', C.ink, 1.2), circle(0, -16, 1.4, C.gold, null), circle(0, -9, 1.4, C.gold, null), circle(0, -2, 1.4, C.gold, null))),
  // one tile in a Swedish sentence is English
  'lhist.anglicism': all(flagSe(6, 20, 20, 13), tile(26, 56, 28, 'Tack'), tile(52, 56, 18, 'för'), hot(86, 56, 44, 'feedback', 8), flagUk(98, 30, 16, 10), line('M100 40 L94 46', HL, 1.6),
    P({ x: 60, h: 0.42, top: C.green, mood: 'smile' }), ground()),
  // laptop with a new message
  'lhist.mejl': all(desk(96, 10, 110), laptop(60, 92, 1.5, all(envelope(0, -16, 1.2), circle(10, -24, 5, C.red, C.ink, 1), T(10, -21.5, '1', 6.5, C.white, 800))), T(28, 30, '@', 18, HL, 800)),
  // a whole bubble mixed of two languages; the listener does not follow
  'lhist.svengelska': all(ground(), P({ x: 30, h: 0.7, top: C.navy, mood: 'smile' }), greyed(P({ x: 98, h: 0.62, top: C.grey, mood: 'frown' })), T(108, 30, '?', 13, C.grey),
    path('M8 6 L88 6 L88 40 L40 40 L30 50 L32 40 L8 40 Z', C.white, C.ink, 1.6),
    tile(26, 16, 26, 'vi ska', C.white, C.ink, 7), all(tile(62, 16, 36, 'meeta', '#c9d6f2', C.ink, 7)), tile(26, 31, 26, 'och', C.white, C.ink, 7), tile(62, 31, 36, 'deadline', '#c9d6f2', C.ink, 7),
    flagSe(10, 52, 12, 8), flagUk(24, 52, 12, 8), frame(5, 3, 86, 40)),
  // a word on a stage in the spotlight, the popularity curve rises and falls
  'lhist.modeord': all(path('M30 0 L18 70 L102 70 L90 0 Z', 'rgba(242,193,78,0.25)', null), rect(30, 70, 60, 12, C.brown, 2, C.ink, 1.6), hot(60, 58, 40, 'hållbar', 8.5), sparkle(30, 46, 5), sparkle(92, 42, 6), star(96, 22, 5),
    line('M10 106 C30 104 40 86 52 88 C62 90 70 104 110 106', C.grey, 2, '0'), circle(52, 88, 3, HL, null), line('M8 108 L112 108', C.grey2, 1.4)),
};

// ── 4364 Standardsvenskans framväxt ──────────────────────────────────
const M4: Record<string, Svg> = {
  // one language in the middle, used by the school, the news and the newspaper
  'lhist.standardsvenska': all(line('M60 60 L22 26 M60 60 L98 26 M60 60 L60 100', C.grey, 1.6, '3 3'),
    at(22, 24, 1, rect(-16, -12, 32, 22, C.dark, 2, C.ink, 1.4), rect(-13, -9, 26, 16, '#3c6e55', 1, null), line('M-9 -4 L5 -4 M-9 1 L8 1', C.white, 1.2)),
    at(98, 24, 1, rect(-16, -12, 32, 22, C.dark, 2, C.ink, 1.4), rect(-13, -9, 26, 16, '#bfe3f5', 1, null), circle(0, -2, 4, C.skin, null), path('M-6 7 C-6 2 6 2 6 7 Z', C.navy, null)),
    at(60, 102, 1, rect(-16, -10, 32, 20, C.white, 1, C.ink, 1.4), rect(-13, -7, 12, 8, C.grey2, 0, null), lines(2, -6, 11, 3, 4, C.grey)),
    say(60, 58, 36, flagSe(50, 52, 20, 12)), ring(60, 56, 24)),
  // a plant made of word tiles grows from a seed into a tree
  'lhist.växa-fram': all(ground(), path('M44 112 L76 112 L72 100 L48 100 Z', '#c4794a', C.ink, 1.6),
    waGrow('lh-vaxa', all(line('M60 100 L60 40', C.green, 4), path('M60 72 C48 70 40 62 38 54 C48 56 56 62 60 70 Z M60 60 C72 58 80 50 82 42 C72 44 64 50 60 58 Z', C.green, C.ink, 1.2),
      rect(26, 40, 22, 10, C.white, 2, C.ink, 1.2), rect(72, 30, 22, 10, C.white, 2, C.ink, 1.2), rect(48, 18, 24, 12, OR, 2, HL, 1.8), squiggle(29, 45, 14, C.grey), squiggle(75, 35, 14, C.grey))),
    line('M100 104 L100 76', C.grey2, 1.4, '3 3'), arrow(100, 80, 100, 66, C.grey, 2)),
  // a man in an apron pulls the lever of a wooden press; printed sheets pile up
  'lhist.boktryckare': all(ground(), rect(52, 30, 8, 82, C.brown, 1, C.ink, 1.6), rect(92, 30, 8, 82, C.brown, 1, C.ink, 1.6), rect(48, 24, 56, 10, C.brown, 2, C.ink, 1.6),
    rect(62, 52, 28, 8, C.dark, 1, C.ink, 1.4), line('M76 34 L76 52', C.grey, 3), rect(56, 72, 40, 6, C.tan, 1, C.ink, 1.4), rect(64, 66, 24, 6, C.white, 1, C.ink, 1.2),
    P({ x: 26, h: 0.82, top: C.white, mood: 'calm' }), path('M18 64 L34 64 L36 104 L16 104 Z', C.beige, C.ink, 1.4), line('M36 54 L62 50', C.skin, 4), line('M62 50 L90 44', C.dark, 2.6),
    at(104, 106, 1, rect(-10, -6, 20, 6, C.white, 1, C.ink, 1), rect(-10, -11, 20, 5, C.white, 1, C.ink, 1))),
  // experts in robes around a table with a big book, a medal on the wall
  'lhist.akademi': all(rect(14, 22, 92, 6, C.white, 1, C.ink, 1.4), ...[22, 42, 62, 82, 98].map((x) => rect(x, 28, 6, 16, C.white, 0, C.ink, 1)), path('M10 22 L60 6 L110 22 Z', C.white, C.ink, 1.4),
    circle(60, 15, 4, C.gold, C.ink, 1),
    rect(14, 86, 92, 6, C.brown, 2, C.ink, 1.6), openBook(60, 80, 0.9, PARCH),
    ...[24, 44, 76, 96].map((x, i) => all(circle(x, 58, 6, C.skin, C.ink, 1.4), path(`M${x - 6} 54 C${x - 6} 48 ${x + 6} 48 ${x + 6} 54 Z`, i % 2 ? C.grey : C.hair, null), path(`M${x - 10} 86 L${x - 8} 66 C${x - 4} 62 ${x + 4} 62 ${x + 8} 66 L${x + 10} 86 Z`, C.navy, C.ink, 1.4), path(`M${x - 3} 64 L${x} 72 L${x + 3} 64`, 'none', C.gold, 1.4)))),
  // a template (dashed outline under a ruler) that texts are measured against: three fit it, one sticks out; a dictionary beside
  'lhist.språknorm': all(rect(18, 8, 84, 12, C.yellow, 2, C.ink, 1.6), line('M26 8 L26 14 M34 8 L34 12 M42 8 L42 14 M50 8 L50 12 M58 8 L58 14 M66 8 L66 12 M74 8 L74 14 M82 8 L82 12 M90 8 L90 14', C.ink, 1.2),
    line('M30 20 L30 104 M80 20 L80 104', HL, 2, '4 3'),
    ...[34, 54, 74].map((y) => all(rect(30, y - 7, 50, 14, C.white, 2, C.ink, 1.4), lines(35, y - 2, 40, 2, 4, C.grey), check(90, y))),
    g('rotate(-8 64 96)', rect(40, 89, 50, 14, '#fde0d6', 2, C.red, 1.6), lines(45, 94, 40, 2, 4, C.grey)), cross(102, 96, 5),
    at(12, 74, 1, rect(-8, -20, 16, 40, C.navy, 2, C.ink, 1.4), rect(-5, -14, 10, 4, C.white, 1, null), line('M-5 -2 L5 -2 M-5 3 L5 3 M-5 8 L4 8', C.white, 1))),
  // one language high on a pedestal under a crown and stars, many look up at it; another language stands low and grey
  'lhist.prestige': all(ground(), path('M44 112 L48 46 L80 46 L84 112 Z', C.white, C.ink, 1.8), rect(42, 40, 44, 8, C.white, 2, C.ink, 1.6), line('M52 56 L52 104 M64 56 L64 104 M76 56 L76 104', C.grey2, 1.4),
    say(64, 28, 34, squiggle(53, 28, 22, C.purple), true, '#f2e6ff', C.purple),
    at(64, 10, 1, path('M-10 4 L-10 -4 L-5 0 L0 -6 L5 0 L10 -4 L10 4 Z', C.gold, C.ink, 1.2)), star(36, 12, 4.5), star(92, 12, 4.5), sparkle(30, 30, 4), sparkle(98, 32, 4),
    ...[[14, 104], [26, 108], [102, 104], [114, 108]].map(([x, y]) => all(circle(x!, y! - 12, 4.5, C.skin, C.ink, 1.2), path(`M${x! - 5} ${y! + 4} C${x! - 5} ${y! - 6} ${x! + 5} ${y! - 6} ${x! + 5} ${y! + 4} Z`, C.green, C.ink, 1.2), line(`M${x!} ${y! - 18} L${x! < 60 ? x! + 6 : x! - 6} ${y! - 26}`, C.gold, 1.2, '2 2'))),
    greyed(say(22, 72, 24, squiggle(14, 72, 14, C.grey)))),
  // the word is cared for like a plant: it grows in a pot, is watered and trimmed by a person who keeps a dictionary at hand
  'lhist.språkvård': all(ground(), P({ x: 28, h: 0.78, top: C.green, mood: 'smile' }),
    at(46, 58, 1, path('M-10 -6 L8 -6 L12 4 L-8 6 Z', C.grey, C.ink, 1.4), line('M10 -2 L20 -8', C.grey, 3), line('M-8 -4 C-14 -10 -12 -18 -4 -14', C.ink, 1.6)),
    waIn('lh-vard-w', -6, -6, line('M64 64 l2 6 M70 66 l2 6 M66 74 l2 6', '#3c8fd0', 2.4)),
    path('M64 112 L96 112 L100 88 L60 88 Z', '#c4794a', C.ink, 1.6), line('M80 88 L80 66', C.green, 3),
    path('M80 78 C70 76 66 70 66 64 C74 66 78 70 80 76 Z M80 74 C90 72 94 66 94 60 C86 62 82 66 80 72 Z', C.green, C.ink, 1.2),
    hot(80, 52, 30, 'mejl', 9), at(104, 64, 1, line('M-6 -6 L6 6 M6 -6 L-6 6', C.silver, 2), circle(-7, 7, 2.6, 'none', C.ink, 1.2), circle(7, 7, 2.6, 'none', C.ink, 1.2)),
    openBook(102, 100, 0.45, PARCH)),
};

// ── 4365 Stavningsreformer ───────────────────────────────────────────
const box = (x: number, y: number, ch: string, fill: string = C.white, col: string = C.ink) => all(rect(x - 7, y - 9, 14, 18, fill, 2, C.ink, 1.3), T(x, y + 4, ch, 11, col, 800));
const M5: Record<string, Svg> = {
  // the word letter by letter in boxes; a grey wrong version below
  'lhist.stavning': all(...['k', 'a', 'f', 'f', 'e'].map((c, i) => box(24 + i * 16, 34, c, i === 2 || i === 3 ? OR : C.white)), check(108, 34), frame(13, 21, 86, 26),
    at(60, 70, 1, path('M-6 -6 L6 -6 L5 4 C5 7 -5 7 -5 4 Z', C.white, C.ink, 1.4), path('M6 -3 C10 -3 10 3 5 2', 'none', C.ink, 1.2)),
    ...['k', 'a', 'f', 'e'].map((c, i) => box(32 + i * 16, 98, c, GT, C.grey)), cross(108, 98, 5)),
  // an official paper with a seal: the old spelling is struck out, the new one slides in
  'lhist.stavningsreform': all(rect(16, 10, 88, 100, C.white, 3, C.ink, 1.8), T(60, 26, '1906', 10, C.grey, 800), dim(60, 46, 44, 'hvad', 11), cross(60, 46, 7), arrow(60, 58, 60, 70, HL, 2.4),
    waIn('lh-reform', 0, -16, hot(60, 82, 40, 'vad', 11)), circle(90, 98, 8, C.red, C.ink, 1.4), path('M86 104 L84 112 L90 108 L96 112 L94 104', C.red, C.ink, 1)),
  // each sound from the mouth matches exactly one letter
  'lhist.ljudenlig': all(mouthProfile(22, 46, 1.3), ...[0, 1, 2].map((i) => line(`M${44 + i * 22} 34 q4 -4 8 0 t8 0`, C.sky, 2.4)),
    ...['s', 'o', 'l'].map((c, i) => all(box(52 + i * 22, 70, c), line(`M${52 + i * 22} 40 L${52 + i * 22} 60`, HL, 2))), frame(42, 26, 64, 54),
    greyed(all(line('M30 98 q4 -4 8 0 t8 0', C.sky, 2.4), line('M48 98 L64 92 M48 98 L64 98 M48 98 L64 104', C.ink, 1.4), T(76, 95, 'sj', 7, C.ink), T(76, 101, 'sk', 7, C.ink), T(92, 98, 'stj', 7, C.ink)))),
};

// ── 4366 Svenska dialektområden ──────────────────────────────────────
const regionSay = (map: Svg, x: number, y: number, extra: Svg = '') => all(map, miniSay(x, y, C.navy), extra);
const M6: Record<string, Svg> = {
  // the map in several coloured dialect areas, each with its own bubble
  'lhist.dialektområde': all(sweden(all(area(NORRP, '#cfe0f5'), area(SVEA, '#f7e3a8'), area(GOT, '#d6ecc9'), area(SKANE, '#f6c9c9'), area(DALA, '#e2d4f2')), '#f2d2a8', true, '#f3e2c8'),
    miniSay(68, 28, C.navy), miniSay(50, 72, C.purple), miniSay(48, 92, C.green), miniSay(30, 108, C.red), miniSay(84, 90, C.brown), miniSay(98, 50, C.dark)),
  // the map in three big parts with clear borders, no bubbles
  'lhist.landsdel': all(sweden(all(area(NORRP, '#9ec3e6'), area(SVEA, '#f2d27a'), area(GOT, '#9fd08a')), '#9fd08a'),
    line('M44 66 L64 68 M38 80 L66 80', C.ink, 2.4)),
  'lhist.skånska': regionSay(sweden(area(SKANE)), 30, 104, all(ring(48, 107, 10), T(18, 96, 'rr', 7, C.navy, 800))),
  'lhist.gotländska': regionSay(sweden('', '#f6a77c'), 86, 86, ring(70, 92, 10)),
  'lhist.dalmål': regionSay(sweden(area(DALA)), 26, 62, all(ring(47, 68, 12),
    at(90, 70, 1, path('M-8 6 L-8 -2 L-4 -6 L-6 -12 L-2 -10 L2 -6 L8 -6 L8 6 L5 6 L5 2 L-4 2 L-4 6 Z', C.red, C.ink, 1.2), line('M-2 -2 L4 -2', C.yellow, 1)))),
  'lhist.norrländska': regionSay(sweden(area(NORRP)), 98, 30),
  'lhist.finlandssvenska': all(sweden('', LAND, true, '#f6d2bd'), path('M84 54 L86 62 L83 70 L80 76 L84 80 L88 74 L90 62 L88 54 Z', HL, null), miniSay(100, 66, C.navy), flagFi(92, 92, 18, 12), flagSe(92, 22, 14, 9), ring(86, 68, 12)),
  // an old man in his village speaks his own local way; a grey standard bubble on the radio
  'lhist.mål.5': all(ground(), house(16, 112, 1.1), church(102, 112, 0.9), house(84, 112, 0.8, C.yellow),
    P({ x: 48, h: 0.78, top: C.brown, hair: C.grey2, mood: 'smile' }), say(64, 22, 44, line('M48 22 q3 -5 6 0 q3 5 6 0 q3 -5 6 0 q3 5 6 0 q3 -5 6 0', C.brown, 2.2), false, '#fff4dc', C.brown),
    frame(40, 9, 48, 26)),
  // two vowels glide into each other in one syllable
  'lhist.diftong': all(mouthProfile(20, 60, 1.4), box(62, 44, 'a', OR), box(86, 44, 'u', OR), path('M62 30 C70 18 80 18 86 30', 'none', HL, 2.4), arrow(80, 24, 86, 30, HL, 2),
    path('M50 64 L98 64 L98 70 L50 70 Z', 'none', C.ink, 0), path('M52 66 C62 78 86 78 96 66', 'none', C.grey, 2), tile(74, 92, 40, 'paus', C.white, C.ink, 10), frame(52, 32, 46, 24)),
};

// ── 4367 Språklig förändring i nutid ─────────────────────────────────
const M7: Record<string, Svg> = {
  // the same word tile changes shape and colour as the clock turns
  'lhist.språkförändring': all(circle(60, 26, 16, C.white, C.ink, 1.8), moving('lh-fh', '0%{transform:rotate(0)}100%{transform:rotate(360deg)}', { dur: 4 }, g('translate(60 26)', line('M0 0 L0 -12', C.ink, 2))), line('M60 26 L68 26', C.ink, 2),
    dim(24, 76, 36, 'de / dem', 8), arrow(46, 76, 64, 76, HL, 2.4),
    moving('lh-fh2', '0%,30%{opacity:0.2}70%,100%{opacity:1}', { dur: 4 }, hot(88, 76, 34, 'dom', 11)), line('M10 100 L110 100', C.grey, 2), arrow(100, 100, 114, 100, C.grey, 2)),
  // this year's list of new words: a calendar page and a list with stars
  'lhist.nyordslista': all(rect(30, 14, 64, 94, C.white, 3, C.ink, 1.8), rect(30, 14, 64, 14, HL, 3, C.ink, 1.8), circle(42, 14, 2.4, C.dark, null), circle(82, 14, 2.4, C.dark, null),
    ...[40, 56, 72, 88].map((y, i) => all(star(42, y, 4.5, i === 0 ? C.yellow : C.gold), rect(52, y - 4, 32 - (i % 2) * 8, 8, i === 0 ? OR : GT, 2, null))), sparkle(102, 34, 6), sparkle(18, 60, 5)),
  // two teenagers with caps chatting in their own words; a grey adult does not follow
  'lhist.slang.2': all(ground(), P({ x: 30, h: 0.66, top: C.red, mood: 'laugh' }), path('M20 54 C20 46 40 46 40 54 L44 54 Z', C.dark, C.ink, 1.2), P({ x: 62, h: 0.66, top: C.green, mood: 'laugh' }),
    path('M52 54 C52 46 72 46 72 54 L76 54 Z', C.navy, C.ink, 1.2), say(46, 20, 40, all(T(38, 24, 'asså', 8, C.navy, 800), T(56, 24, '!!', 8, HL, 900))),
    greyed(P({ x: 98, h: 0.8, top: C.grey, mood: 'frown' })), T(108, 30, '?', 13, C.grey)),
  // a person without he/she: the grey words are crossed, the bubble points to an open slot
  'lhist.hen': all(ground(), figure({ x: 60, h: 0.7, top: C.mint, bottom: C.grey }), dim(18, 32, 26, 'han', 9), cross(18, 32, 7, C.grey), dim(102, 32, 26, 'hon', 9), cross(102, 32, 7, C.grey),
    say(60, 18, 30, rect(50, 12, 20, 12, OR, 2, HL, 2)), line('M60 34 L60 42', HL, 1.6, '2 2')),
  // a toilet door sign with one neutral figure for everyone
  'lhist.könsneutral': all(rect(30, 8, 60, 104, C.tan, 3, C.ink, 1.8), circle(82, 64, 3, C.gold, C.ink, 1), rect(40, 20, 40, 44, C.white, 4, C.ink, 1.6),
    circle(60, 30, 5, C.dark, null), path('M52 58 L54 40 C56 37 64 37 66 40 L68 58 Z', C.dark, null), T(60, 82, 'WC', 12, C.dark, 800),
    greyed(at(10, 50, 1, circle(0, 0, 4, C.ink, null), rect(-4, 5, 8, 12, C.ink, 1, null))), greyed(at(110, 50, 1, circle(0, 0, 4, C.ink, null), path('M-6 17 L0 5 L6 17 Z', C.ink, null))), frame(36, 16, 48, 52)),
  // young people among apartment blocks, their bubble mixes words from many languages
  'lhist.multietnolekt': all(ground(), rect(6, 30, 26, 82, '#d9c6a5', 1, C.ink, 1.4), rect(90, 22, 26, 90, '#c9d3dc', 1, C.ink, 1.4),
    ...[40, 54, 68, 82].map((y) => all(rect(10, y, 6, 6, '#bfe3f5', 0, C.ink, 0.8), rect(22, y, 6, 6, '#bfe3f5', 0, C.ink, 0.8), rect(94, y - 8, 6, 6, '#bfe3f5', 0, C.ink, 0.8), rect(106, y - 8, 6, 6, '#bfe3f5', 0, C.ink, 0.8))),
    P({ x: 48, h: 0.6, top: C.orange, mood: 'laugh' }), P({ x: 74, h: 0.6, top: C.purple, hairStyle: 'long', mood: 'smile' }),
    path('M30 8 L94 8 L94 34 L66 34 L58 42 L58 34 L30 34 Z', C.white, C.ink, 1.6), rect(34, 14, 16, 14, '#f2c14e', 2, null), rect(50, 14, 14, 14, '#8cc7e8', 0, null), rect(64, 14, 14, 14, '#a8dcc0', 0, null), rect(78, 14, 12, 14, '#ef9fb5', 2, null),
    T(62, 25, 'jalla', 9, C.ink, 800)),
  // a word tile cracks and crumbles; a grumpy old man complains
  'lhist.språkförfall': all(ground(), P({ x: 28, h: 0.78, top: C.brown, hair: C.grey2, mood: 'angry' }), path('M18 18 C14 10 26 6 30 12 C34 6 44 10 40 18 Z', C.grey2, C.ink, 1.2), line('M24 22 L22 28 M32 22 L30 28', C.sky, 1.6),
    path('M58 40 L80 40 L78 56 L60 56 Z', C.white, C.ink, 1.6), path('M80 40 L104 40 L102 56 L82 56 L84 48 Z', C.white, C.ink, 1.6), line('M80 40 L84 48 L82 56', C.ink, 1.6),
    T(70, 52, 'vä', 9, C.ink, 700), T(93, 52, 'ldigt', 8, C.ink, 700), g('rotate(20 88 84)', rect(80, 78, 12, 9, C.white, 1, C.ink, 1.2)), g('rotate(-25 104 98)', rect(98, 94, 10, 8, C.white, 1, C.ink, 1.2)), rect(66, 102, 8, 6, C.white, 1, C.ink, 1.2),
    line('M70 60 L72 70 M96 60 L98 70', C.grey, 1.4, '2 2')),
  // the red pen corrects a tile; the corrected form gets a tick
  'lhist.språkriktighet': all(rect(14, 16, 92, 70, C.white, 3, C.ink, 1.6), tile(34, 36, 26, 'Jag', C.white), tile(70, 36, 40, 'gav dem', C.white), dim(34, 62, 26, 'de', 9.5), cross(34, 62, 6), hot(78, 62, 30, 'dem', 9.5), check(100, 62),
    arrow(48, 62, 60, 62, HL, 2), pen(100, 104, 40), lines(20, 100, 40, 2, 5)),
  // the law book with the section sign, a gavel and the Swedish bubble
  'lhist.språklag': all(at(40, 64, 1.5, rect(-16, -22, 32, 44, C.red, 2, C.ink, 1.6), line('M-12 -22 L-12 22', 'rgba(0,0,0,0.25)', 2), T(2, 6, '§', 22, C.white, 800)), gavel(90, 84),
    say(88, 24, 32, flagSe(78, 18, 20, 12), false), ground()),
  // one big Swedish bubble fills the country; small bubbles of other languages beside it
  'lhist.huvudspråk': all(sweden(area(poly([...NORR, ...SVEA_W, ...GOT_W, ...GOT_E, ...SVEA_E]), '#cfe0f5')), say(60, 62, 42, flagSe(47, 54, 26, 16)), ring(60, 60, 26),
    miniSay(22, 24, C.green, '#e9f5e0'), miniSay(98, 100, C.purple, '#efe6f8'), miniSay(98, 30, C.red, '#fde4e4'), miniSay(22, 100, C.brown, '#f7ead8')),
};

export const LHIST_MOTIFS: Record<string, Svg> = { ...M1, ...M2, ...M3, ...M4, ...M5, ...M6, ...M7 };
