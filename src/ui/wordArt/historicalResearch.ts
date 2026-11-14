/**
 * Historia & humaniora → Arkeologi & kulturarv → Historisk forskning, 2351–2357 (0.40): archives and
 * documents, primary sources, oral history, chronologies and timelines, source criticism for historians,
 * historical interpretations, and writing a historical account.
 * Recurring signs: paper and parchment in cream with grey lines for text, archive boxes in light brown on
 * grey-blue shelves, a historian in a teal top, a timeline as a dark line with an arrow to the right (the
 * past to the left), old things in sepia. The thing the word names is in full colour and often marked with
 * an orange ring; a grey copy is the contrast. No words or letters (only digits and question marks), no
 * brands, no pointing fingers (palms and thumbs only), no religious symbols.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { type Build } from './figures';
import { HL, arm, thought } from './people';
import { P as F, type Mood, greyed, sepia } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const PARCH = '#f3e6c4';
const PAPER = '#fbf8ef';
const BOX = '#d9c194';
const RACK = '#7f93a8';
const RACK2 = '#5f7287';
const TEAL = '#3a8f8a';
const WOOD = '#a0673d';
const WALL = '#f3ede2';
const SKY = '#dcecf6';
const STONE = '#9a9690';
const FUR = '#8a6a48';
const GRASS = '#7fb46a';
const LAKE = '#6aa8d0';
const SEP = '#c8a878';
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (x: number, y: number, r: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${r}) scale(${s})`, ...k);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const num = (x: number, y: number, n: string, size = 9, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${n}</text>`;

// ── Scenery and figures ──────────────────────────────────────────────
const ground = line('M4 112 L116 112', C.grey2, 2);
const room = (col: string = WALL) => rect(4, 4, 112, 108, col, 3, null);
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: f1(ty - 38 * s), sl: f1(x - 13 * s), sr: f1(x + 13 * s) }; };
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
const headY = (h: number) => f1(112 - 49 * 0.84 * h - 56 * 0.84 * h);
/** Grey hair and glasses for an old person. */
const old = (x: number, h = 1) => on(x, h, path('M-10 -58 C-10 -72 10 -72 10 -58 C6 -63 -6 -63 -10 -58 Z', '#dcdcdc', C.ink, 1.8), circle(-3.6, -56, 2.6, 'none', C.ink, 0.9), circle(3.6, -56, 2.6, 'none', C.ink, 0.9), line('M-1 -56 L1 -56', C.ink, 0.9));
const gloves = (x1: number, y1: number, x2: number, y2: number) => all(circle(x1, y1, 3.2, C.white, C.ink, 1.2), circle(x2, y2, 3.2, C.white, C.ink, 1.2));
const table = (y = 84, x1 = 8, x2 = 112) => all(rect(x1, y, x2 - x1, 6, C.tan, 2, C.ink, 1.6), line(`M${x1 + 8} ${y + 6} L${x1 + 8} 112 M${x2 - 8} ${y + 6} L${x2 - 8} 112`, WOOD, 3));
const ringMark = (x: number, y: number, r: number) => circle(x, y, r, 'none', HL, 2.4);
const tick = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 7, '#3a9a5a', C.ink, 1.2), path('M-3.2 0 L-0.8 2.6 L3.6 -2.8', 'none', C.white, 1.8));
const cross = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 7, C.red, C.ink, 1.2), line('M-3 -3 L3 3 M3 -3 L-3 3', C.white, 1.8));
const qmark = (x: number, y: number, size = 12, col: string = C.navy) => num(x, y, '?', size, col);
const mini = (x: number, y: number, col: string, s = 1, hair: string = C.hair) => at(x, y, s, path('M-6 12 C-6 4 6 4 6 12 Z', col, C.ink, 1), circle(0, 0, 4.4, C.skin, C.ink, 1), path('M-4.4 -1 C-4 -6 4 -6 4.4 -1 C2 -3 -2 -3 -4.4 -1 Z', hair, null));

// ── Paper things ─────────────────────────────────────────────────────
/** A sheet of paper with grey text lines, centred on (x, y). */
const doc = (x: number, y: number, s = 1, col: string = PAPER, n = 4, r = 0) => rot(x, y, r, s, path('M-10 -13 L6 -13 L10 -9 L10 13 L-10 13 Z', col, C.ink, 1.4), path('M6 -13 L6 -9 L10 -9', 'none', C.ink, 1),
  ...range(n).map((i) => line(`M-7 ${-7 + i * 5} L${i === n - 1 ? 2 : 7} ${-7 + i * 5}`, C.grey, 1.3)));
const stamp = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 5, 'none', C.red, 1.6), circle(0, 0, 2.2, C.red, null));
const squiggle = (x: number, y: number, s = 1, col: string = C.navy) => at(x, y, s, line('M-6 0 C-4 -4 -2 4 0 0 C2 -4 4 4 6 -1', col, 1.2));
const book = (x: number, y: number, s = 1, col: string = C.red, cover: Svg = '') => at(x, y, s, rect(-11, -14, 22, 28, col, 2, C.ink, 1.5), rect(-11, -14, 4, 28, 'rgba(0,0,0,0.18)', 1, null), cover);
const openBook = (x: number, y: number, s = 1, l: Svg = '', r: Svg = '', col: string = PAPER) => at(x, y, s, path('M0 -14 C-8 -17 -18 -16 -24 -13 L-24 13 C-18 10 -8 10 0 13 Z', col, C.ink, 1.4), path('M0 -14 C8 -17 18 -16 24 -13 L24 13 C18 10 8 10 0 13 Z', col, C.ink, 1.4), line('M0 -14 L0 13', C.ink, 1), l, r);
const textLines = (x: number, y: number, w: number, n: number, gap = 4.4, col: string = C.grey) => all(...range(n).map((i) => line(`M${x} ${f1(y + i * gap)} L${f1(x + (i === n - 1 ? w * 0.6 : w))} ${f1(y + i * gap)}`, col, 1.2)));
const envelope = (x: number, y: number, s = 1, r = 0, col: string = PAPER) => rot(x, y, r, s, rect(-11, -7, 22, 14, col, 1.5, C.ink, 1.4), path('M-11 -7 L0 2 L11 -7', 'none', C.ink, 1.2), circle(0, 1, 2, C.red, null));
const pen = (x: number, y: number, s = 1, r = 30) => rot(x, y, r, s, rect(-1.6, -14, 3.2, 14, C.navy, 1, C.ink, 1), path('M-1.6 0 L1.6 0 L0 4 Z', C.ink, null));
const archBox = (x: number, y: number, s = 1, col: string = BOX, n = '') => at(x, y, s, rect(-9, -13, 18, 13, col, 1, C.ink, 1.3), rect(-5, -10, 10, 5, PAPER, 0.5, C.ink, 0.8), n ? num(0, -6.2, n, 4.6) : '');
/** A grey-blue archive rack with boxes, from x1 to x2, top y1 to the floor. */
const rack = (x1: number, x2: number, y1: number, rows = 3) => {
  const h = (112 - y1) / rows, out: Svg[] = [rect(x1, y1, x2 - x1, 112 - y1, '#e7ecf1', 1, RACK2, 1.6)];
  for (let r = 0; r < rows; r++) {
    const yb = f1(y1 + (r + 1) * h);
    for (let x = x1 + 11; x <= x2 - 9; x += 20) out.push(archBox(x, yb - 1, Math.min(1, h / 15), r % 2 ? BOX : '#e3cfa6'));
    out.push(rect(x1, yb - 1.5, x2 - x1, 3, RACK, 1, RACK2, 1));
  }
  return all(...out);
};
const magnifier = (x: number, y: number, s = 1, inner: Svg = '') => at(x, y, s, line('M7 7 L15 15', C.ink, 4), line('M7 7 L15 15', WOOD, 2.4), circle(0, 0, 9, 'rgba(220,240,252,0.75)', C.ink, 1.8), inner);
const house = (x: number, y: number, s = 1, col: string = '#c84a3c') => at(x, y, s, rect(-9, -10, 18, 10, col, 0.5, C.ink, 1.2), path('M-11 -10 L0 -19 L11 -10 Z', '#6b4a3a', C.ink, 1.2), rect(-2, -6, 4, 6, '#5a3a2a', 0.3, null));
const crown = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 4 L-9 -5 L-4 -1 L0 -7 L4 -1 L9 -5 L8 4 Z', C.yellow, C.ink, 1.2), circle(0, -1, 1.2, C.red, null));
const castle = (x: number, y: number, s = 1, col: string = '#c9c2b6') => at(x, y, s, rect(-16, -16, 32, 16, col, 0.5, C.ink, 1.3), rect(-20, -26, 9, 26, col, 0.5, C.ink, 1.3), rect(11, -26, 9, 26, col, 0.5, C.ink, 1.3),
  path('M-20 -26 L-20 -29 L-17 -29 L-17 -26 M-14 -26 L-14 -29 L-11 -29 L-11 -26 M11 -26 L11 -29 L14 -29 L14 -26 M17 -26 L17 -29 L20 -29 L20 -26', 'none', C.ink, 1.1), path('M-4 0 L-4 -8 C-4 -12 4 -12 4 -8 L4 0 Z', '#5a4a3a', null));
const ship = (x: number, y: number, s = 1) => at(x, y, s, path('M-14 0 L14 0 L10 6 L-10 6 Z', WOOD, C.ink, 1.2), line('M0 0 L0 -18', C.ink, 1.4), path('M1 -17 L12 -4 L1 -4 Z', C.white, C.ink, 1));
const train = (x: number, y: number, s = 1) => at(x, y, s, rect(-14, -12, 20, 12, C.dark, 1, C.ink, 1.2), rect(4, -18, 8, 18, C.dark, 1, C.ink, 1.2), rect(-12, -18, 5, 6, C.dark, 0.5, C.ink, 1), circle(-8, 1, 3, C.grey, C.ink, 1), circle(6, 1, 3, C.grey, C.ink, 1), ellipse(-10, -23, 4, 2.4, C.grey2, null));
const mobile = (x: number, y: number, s = 1) => at(x, y, s, rect(-5, -9, 10, 18, C.dark, 2, C.ink, 1.2), rect(-3.6, -7, 7.2, 13, '#bfe3f5', 0.5, null));
const axe = (x: number, y: number, s = 1) => at(x, y, s, line('M0 8 L0 -8', WOOD, 2.6), path('M-1 -9 L-8 -6 L-7 0 L-1 -3 Z', STONE, C.ink, 1));
const fire = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -16 C6 -10 7 -5 4 -1 C2 0 -2 0 -4 -1 C-7 -5 -5 -10 0 -16 Z', C.orange, C.ink, 1.1), path('M0 -9 C3 -6 3 -3 1 -1 C0 0 -1 0 -2 -1 C-3 -3 -2 -6 0 -9 Z', C.yellow, null));
const clock = (x: number, y: number, r = 7) => all(circle(x, y, r, C.white, C.ink, 1.4), line(`M${x} ${y} L${x} ${f1(y - r * 0.65)} M${x} ${y} L${f1(x + r * 0.5)} ${y}`, C.ink, 1.3));
/** A timeline from x1 to x2 at height y with an arrowhead to the right. */
const tline = (y: number, x1 = 10, x2 = 110, col: string = C.ink) => all(line(`M${x1} ${y} L${x2 - 4} ${y}`, col, 2.6), path(`M${x2} ${y} L${x2 - 7} ${y - 4} L${x2 - 7} ${y + 4} Z`, col, col, 1));
const tk = (x: number, y: number, col: string = C.ink) => line(`M${x} ${y - 4} L${x} ${y + 4}`, col, 1.8);
const recorder = (x: number, y: number, s = 1) => at(x, y, s, rect(-20, -14, 40, 18, '#6f6a60', 2, C.ink, 1.5), circle(-10, -18, 8, '#c9c2b6', C.ink, 1.3), circle(10, -18, 8, '#c9c2b6', C.ink, 1.3), circle(-10, -18, 2, C.ink, null), circle(10, -18, 2, C.ink, null),
  line('M-10 -10 L10 -10', '#5a3a2a', 1.4), ...[-12, -4, 4, 12].map((bx) => rect(bx - 3, -4, 6, 4, C.grey2, 0.5, C.ink, 0.8)));
const waves = (x: number, y: number, s = 1, col: string = C.navy) => at(x, y, s, line('M0 -5 C3 -2 3 2 0 5 M4 -8 C9 -3 9 3 4 8', col, 1.4));
const hill = (y = 90, col: string = GRASS) => path(`M4 ${y} C30 ${y - 8} 70 ${y - 6} 116 ${y - 2} L116 112 L4 112 Z`, col, null);
const flag = (x: number, y: number, col: string = HL) => all(line(`M${x} ${y} L${x} ${y - 18}`, C.ink, 1.6), path(`M${x} ${y - 18} L${x + 11} ${y - 14} L${x} ${y - 10} Z`, col, C.ink, 1));

export const HISTORICAL_RESEARCH_MOTIFS: Record<string, Svg> = {
  // ── 2351 Arkiv och handlingar ──
  'hfor.handling.2': all(room(), table(90), doc(28, 78, 1.1, PAPER, 4, -8), doc(36, 76, 1.1, PAPER, 4, -3), at(70, 58, 2.1, path('M-10 -13 L6 -13 L10 -9 L10 13 L-10 13 Z', PAPER, C.ink, 0.8), path('M6 -13 L6 -9 L10 -9', 'none', C.ink, 0.6),
    ...range(4).map((i) => line(`M-7 ${-8 + i * 4} L7 ${-8 + i * 4}`, C.grey, 0.8))), stamp(78, 76, 1.5), squiggle(58, 78, 1.3), path('M54 30 L54 22 C54 18 60 18 60 22 L60 34', 'none', C.silver, 1.6), ground),
  'hfor.förteckning': all(room(), at(34, 58, 2.2, path('M-11 -22 L11 -22 L11 22 L-11 22 Z', PAPER, C.ink, 0.7),
    ...range(5).map((i) => all(num(-7, -14 + i * 8, String(i + 1), 4.4), line(`M-3 ${-15.5 + i * 8} L8 ${-15.5 + i * 8}`, C.grey, 0.7)))),
    rect(70, 20, 42, 92, '#e7ecf1', 1, RACK2, 1.4), ...[1, 2, 3, 4, 5].map((n, i) => archBox(f1(81 + (i % 2) * 20), f1(40 + Math.floor(i / 2) * 26), 1, BOX, String(n))), ...[40, 66, 92].map((y) => rect(70, y, 42, 3, RACK, 1, RACK2, 1)),
    line('M58 22 C64 18 66 26 72 28', HL, 1.6, '3 2'), ground),
  'hfor.arkivarie': all(room(), rack(6, 114, 20, 4), fig(60, RACK, 'smile', { bottom: C.dark }),
    reach(60, 1, -1, 50, 66), reach(60, 1, 1, 70, 66), archBox(60, 70, 1.5, BOX, '7'), gloves(50, 66, 70, 66), on(60, 1, rect(-5, -36, 10, 3, C.white, 1, C.ink, 0.8))),
  'hfor.akt': all(room(), table(96), at(60, 66, 2.4, path('M-16 -12 L16 -12 L16 12 L-16 12 Z', '#d8b878', C.ink, 0.8), path('M-14 -14 L12 -14 L14 -12 L-16 -12 Z', PAPER, C.ink, 0.5), line('M-15 -13 L13 -13', C.grey, 0.4),
    rect(-11, -7, 13, 10, PAPER, 0.5, C.ink, 0.5), path('M-8 2 C-8 -1 -2 -1 -2 2 Z', C.navy, null), circle(-5, -3, 2, C.skin, C.ink, 0.4), line('M5 -5 L12 -5 M5 -2 L12 -2 M5 1 L10 1', C.grey, 0.6),
    line('M-16 6 L16 6', '#b04a3a', 1.4), path('M0 6 C-3 9 -5 10 -6 13 M0 6 C3 9 5 10 6 13', 'none', '#b04a3a', 1)),  ground),
  'hfor.husförhörslängd': all(room('#f2ebdc'), table(100), openBook(60, 60, 2.2,
    all(at(-14, -8, 0.45, house(0, 0, 1)), ...range(3).map((i) => all(circle(-19, -1 + i * 4.4, 1.5, C.skin, C.ink, 0.4), line(`M-16 ${-1 + i * 4.4} L-8 ${-1 + i * 4.4}`, C.grey, 0.6))), line('M-24 -4 L-2 -4', C.ink, 0.4)),
    all(...range(3).map((i) => all(rect(4, -2 + i * 4.4, 4, 2.6, C.red, 0.3, C.ink, 0.3), path(`M13 ${-1 + i * 4.4} L14.5 ${0.4 + i * 4.4} L17 ${-2 + i * 4.4}`, 'none', '#2e8a4a', 0.8))), line('M2 -4 L22 -4', C.ink, 0.4), line('M10 -6 L10 12', C.grey, 0.4)), PARCH),
    pen(98, 86, 1.2, 40), ground),
  'hfor.beställa-fram': all(room(), rect(4, 4, 46, 108, '#e7ecf1', 0, null), rack(6, 46, 20, 3), line('M50 4 L50 112', C.dark, 3), fig(30, RACK, 'smile', { bottom: C.dark, h: 0.9 }),
    rect(46, 76, 12, 24, C.dark, 1, C.ink, 1.2), archBox(30, 74, 1.4, BOX, '3'), reach(30, 0.9, 1, 38, 70), reach(30, 0.9, -1, 22, 70),
    table(88, 60, 114), fig(96, TEAL, 'smile', { h: 0.95 }), doc(76, 78, 0.7, PAPER, 3, -10), reach(96, 0.95, -1, 80, 76), arrow(46, 60, 70, 60, HL, 2.6)),
  'hfor.mikrofilm': all(room(), table(92), rect(32, 36, 56, 44, '#5a5f6a', 3, C.ink, 1.8), rect(38, 42, 44, 30, '#f8f6d8', 1, C.ink, 1.2), textLines(44, 48, 32, 5, 4.6, '#8a8a70'), rect(40, 80, 40, 12, '#4a4f5a', 2, C.ink, 1.4),
    circle(18, 80, 9, '#3a3a40', C.ink, 1.4), circle(18, 80, 3, C.grey2, null), path('M22 88 L40 86', 'none', '#6a5030', 3),
    ...[0, 1, 2, 3].map((i) => all(rect(94 + (i % 2) * 0, 48 + i * 10, 14, 9, '#4a3a28', 0.5, C.ink, 0.8), rect(96, 50 + i * 10, 10, 5, '#e9dfc0', 0.3, null))), ground),

  // ── 2352 Primärkällor ──
  'hfor.kvarleva': all(rect(4, 4, 112, 108, SKY, 3, null), greyed(house(34, 70, 2.2, '#999'), mini(76, 56, '#888', 1.4), mini(92, 58, '#888', 1.2), hill(72, '#bbb')), rect(4, 80, 112, 32, '#efe6d2', 0, null),
    rect(22, 88, 30, 16, PARCH, 1, C.ink, 1.4), textLines(26, 93, 22, 3, 3.6), num(46, 102, '3', 6), at(82, 96, 1.6, circle(-8, 0, 5, 'none', '#7a6a50', 2.4), line('M-3 0 L10 0 M6 0 L6 4 M9 0 L9 3', '#7a6a50', 2.4)),
    ringMark(37, 96, 18), ringMark(82, 96, 18), arrow(60, 76, 60, 86, HL, 2), ground),
  'hfor.berättande-källa': all(room(), table(92), openBook(38, 80, 1.3, textLines(-20, -8, 16, 4, 4.4), textLines(4, -8, 16, 4, 4.4)), ringMark(38, 80, 26),
    path('M8 8 L108 8 L108 46 L50 46 L42 58 L42 46 L8 46 Z', C.white, C.ink, 1.6), rect(12, 12, 92, 30, '#bfe3f5', 2, null), path('M12 34 C40 28 70 38 104 30 L104 42 L12 42 Z', LAKE, null), ship(34, 34, 0.7), mini(64, 22, C.red, 0.9), mini(76, 22, C.green, 0.9), fire(92, 34, 0.6),
    greyed(at(96, 86, 1.2, rect(-8, -5, 16, 10, '#ddd', 1, C.ink, 1), textLines(-6, -2, 12, 2, 3)), at(96, 100, 1, circle(-6, 0, 4, 'none', C.ink, 2), line('M-2 0 L8 0 M5 0 L5 3', C.ink, 2)))),
  'hfor.förstahandsuppgift': all(rect(4, 4, 112, 108, SKY, 3, null), rect(4, 58, 112, 54, '#eceef0', 0, null),
    house(16, 44, 1, '#c84a3c'), fire(16, 26, 0.6), mini(40, 26, C.orange, 1.5), arrow(50, 34, 62, 34, HL, 2.2), doc(76, 34, 1.1, PARCH, 3), circle(84, 22, 6, '#3a9a5a', C.ink, 1), num(84, 25.5, '1', 8, C.white), arrow(90, 34, 98, 34, HL, 2.2), mini(106, 26, C.green, 1.5),
    greyed(house(14, 98, 0.9, '#999'), fire(14, 82, 0.5), mini(32, 80, '#999', 1.3), arrow(40, 88, 46, 88, C.ink, 1.6), mini(54, 80, '#999', 1.3), arrow(62, 88, 68, 88, C.ink, 1.6), doc(78, 88, 0.9, '#eee', 3), num(86, 80, '2', 7), arrow(88, 88, 94, 88, C.ink, 1.6), mini(104, 80, '#999', 1.3)),
    tick(108, 10, 0.7)),
  'hfor.brevväxling': all(room(), fig(20, C.green, 'smile', { h: 0.9 }), fig(100, C.orange, 'smile', { h: 0.9, hairStyle: 'long' }), reach(20, 0.9, 1, 32, 70), reach(100, 0.9, -1, 88, 70),
    envelope(36, 68, 0.8), envelope(84, 68, 0.8), path('M36 40 C50 26 70 26 84 40', 'none', HL, 2), path('M80 44 L86 41 L83 36', 'none', HL, 2), path('M84 54 C70 66 50 66 36 54', 'none', HL, 2), path('M40 50 L34 53 L37 58', 'none', HL, 2),
    envelope(60, 30, 0.7, -10), envelope(60, 61, 0.7, 10), ...[0, 1, 2].map((i) => envelope(14 + i * 2, 104 - i * 4, 0.6)), ...[0, 1, 2].map((i) => envelope(106 - i * 2, 104 - i * 4, 0.6)), ground),
  'hfor.självbiografi': all(room(), fig(36, C.navy, 'smile', { h: 0.95 }), old(36, 0.95), reach(36, 0.95, 1, 60, 66), book(76, 60, 2, '#3f7fbf', all(circle(1, -4, 5, C.skin, C.ink, 0.8), path('M-4 -7 C-4 -11 6 -11 6 -7', '#dcdcdc', C.ink, 0.6), path('M-6 8 C-6 2 8 2 8 8 Z', C.navy, C.ink, 0.6))),
    thought(84, 18, 40, all(mini(72, 16, C.yellow, 0.6), mini(84, 14, C.green, 0.7), mini(96, 14, C.navy, 0.8, '#dcdcdc'), line('M76 18 L80 18 M88 18 L92 18', C.ink, 0.8))), ground),
  'hfor.fotografi': all(room(), table(92), at(56, 62, 2.2, rect(-15, -12, 30, 24, '#f6efe0', 1, C.ink, 0.7), rect(-12, -9, 24, 18, SEP, 0.5, null), path('M-12 9 L-12 0 L12 0 L12 9 Z', '#b09068', null),
    house(6, 2, 0.5, '#9a7a58'), mini(-6, -1, '#7a5a3a', 0.5, '#5a4030'), mini(-1, 0, '#8a6a4a', 0.42, '#5a4030'), mini(-10, 1, '#6a4a30', 0.38, '#5a4030')),
    at(100, 86, 1, rect(-10, -8, 20, 14, C.dark, 2, C.ink, 1.2), circle(0, -1, 4.6, C.grey, C.ink, 1.2), rect(-6, -11, 6, 3, C.dark, 0.5, C.ink, 0.8)), ground),
  'hfor.upphovsman': all(room(), table(92), fig(34, C.green, 'calm', { h: 0.95 }), reach(34, 0.95, 1, 52, 82), doc(64, 80, 0.9, PARCH, 4, -6), pen(54, 80, 0.8, 30),
    line('M70 70 C84 52 70 30 48 30', HL, 1.8, '3 2'), path('M52 26 L46 30 L52 34', 'none', HL, 1.8), ringMark(34, headY(0.95) + 6, 14), greyed(fig(98, C.grey, 'calm', { h: 0.85 }))),

  // ── 2353 Muntlig historia ──
  'hfor.muntlig-historia': all(room(), sepia(book(60, 26, 1.4, '#8a5a34', textLines(-6, -6, 12, 4, 3.4, '#e8d8b0'))), ringMark(60, 26, 24),
    ...[[20, train(20, 66, 0.4)], [60, house(60, 68, 0.6)], [100, ship(100, 64, 0.5)]].map(([x, k]) => all(rect((x as number) - 15, 52, 30, 20, C.white, 3, C.ink, 1.3), path(`M${(x as number) - 3} 72 L${x} 78 L${(x as number) + 3} 72`, C.white, C.ink, 1.1), k as Svg, arrow(x as number, 50, f1(60 + ((x as number) - 60) * 0.35), 44, HL, 1.8))),
    mini(20, 88, '#9a6aaa', 1.5, '#dcdcdc'), mini(60, 88, C.navy, 1.5, '#dcdcdc'), mini(100, 88, C.green, 1.5, '#dcdcdc'), ground),
  'hfor.berättare': all(rect(4, 4, 112, 108, '#2f3a5a', 3, null), circle(96, 18, 6, '#f6f0c8', null), fire(60, 106, 1.4), line('M50 108 L70 104 M50 104 L70 108', WOOD, 2.6), fig(26, C.red, 'laugh', { h: 0.95 }), reach(26, 0.95, 1, 42, 54), reach(26, 0.95, -1, 12, 56),
    mini(84, 92, C.green, 1.2), mini(102, 94, C.yellow, 1.1), mini(92, 80, C.sky, 1)),
  'hfor.livsberättelse': all(room(), fig(20, C.purple, 'smile', { h: 0.9 }), old(20, 0.9), path('M34 8 L114 8 L114 52 L44 52 L32 62 L36 52 L34 52 Z', C.white, C.ink, 1.6),
    mini(46, 30, C.purple, 0.55), mini(62, 27, C.purple, 0.75), mini(80, 24, C.purple, 0.95), mini(100, 22, C.purple, 1.1, '#dcdcdc'), line('M50 44 L56 44 M68 44 L74 44 M86 44 L92 44', C.ink, 1), path('M54 41 L56 44 L54 47 M72 41 L74 44 L72 47 M90 41 L92 44 L90 47', 'none', C.ink, 1), ground),
  'hfor.bandspelare': all(room(), table(92), recorder(56, 88, 1.6), at(96, 84, 1, line('M0 0 L0 -20', C.ink, 1.6), ellipse(0, -24, 4, 6, C.dark, C.ink, 1.2), rect(-6, 0, 12, 4, C.dark, 1, C.ink, 1)), waves(106, 60, 1, C.grey), ground),
  'hfor.efterhandskonstruktion': all(rect(4, 4, 112, 108, '#eef3e4', 3, null), greyed(path('M14 96 C30 60 6 50 30 40 C60 30 30 90 60 80 C84 70 60 30 92 34', 'none', C.ink, 2.4)), circle(14, 96, 4, C.grey, C.ink, 1.2), flag(96, 40),
    line('M14 96 L92 36', HL, 3), fig(100, TEAL, 'smile', { h: 0.62 }), reach(100, 0.62, -1, 92, 82), pen(90, 82, 0.8, -40), clock(22, 20, 8), path('M32 20 L40 20', 'none', C.ink, 1.4), path('M37 17 L40 20 L37 23', 'none', C.ink, 1.4), ground),
  'hfor.sägen': all(rect(4, 4, 112, 108, '#cfe0ec', 3, null), path('M40 70 L64 26 L90 70 Z', '#8a8a92', C.ink, 1.6), ellipse(70, 92, 44, 12, LAKE, C.ink, 1.4), at(64, 52, 1.2, path('M-8 18 C-10 4 -8 -6 0 -8 C8 -6 10 4 8 18 Z', '#6a7a5a', C.ink, 1.2), circle(0, -12, 6, '#6a7a5a', C.ink, 1.2), circle(-2, -13, 1, C.ink, null), circle(2, -13, 1, C.ink, null), path('M-2 -9 Q0 -8 2 -9', 'none', C.ink, 0.8)),
    hill(104, GRASS), fig(18, '#b05a8a', 'calm', { h: 0.62, hairStyle: 'long' }), old(18, 0.62), mini(36, 98, C.yellow, 0.9), ground),

  // ── 2354 Kronologier och tidslinjer ──
  'hfor.kronologi': all(room(), ...[[16, castle(0, 6, 0.5)], [44, ship(0, 2, 0.7)], [72, train(0, 6, 0.6)], [100, mobile(0, 0, 0.9)]].map(([x, k], i) => all(rect((x as number) - 12, 60, 24, 26, PAPER, 2, C.ink, 1.2), g(`translate(${x} 76)`, k as Svg), num(x as number, 100, String(i + 1), 11, HL))),
    greyed(rot(30, 26, -12, 1, rect(-10, -10, 20, 20, PAPER, 2, C.ink, 1.2), ship(0, 4, 0.5)), rot(60, 22, 10, 1, rect(-10, -10, 20, 20, PAPER, 2, C.ink, 1.2), mobile(0, 0, 0.7)), rot(90, 28, -6, 1, rect(-10, -10, 20, 20, PAPER, 2, C.ink, 1.2), castle(0, 6, 0.4))), arrow(60, 40, 60, 54, HL, 2.4)),
  'hfor.tidslinje': all(room(), tline(80, 8, 114), ...[[18, '1500', castle(18, 68, 0.6)], [44, '1700', ship(44, 64, 0.8)], [72, '1900', train(72, 68, 0.7)], [98, '2000', mobile(98, 62, 1.1)]].map(([x, y, k]) => all(tk(x as number, 80), num(x as number, 96, y as string, 8.5), k as Svg)), ground),
  'hfor.sekelskifte': all(room('#f1ead8'), tline(96, 8, 114), tk(20, 96), num(20, 108, '1899', 8), tk(60, 96), num(60, 108, '1900', 9, HL), tk(100, 96), num(100, 108, '1901', 8),
    sepia(fig(42, '#5a4a6a', 'smile', { h: 0.62, hairStyle: 'long', bottom: '#5a4a6a' }), on(42, 0.62, ellipse(0, -66, 16, 4, '#4a3a5a', C.ink, 1.2), rect(-8, -76, 16, 10, '#4a3a5a', 2, C.ink, 1.2), path('M-12 0 L-18 48 L18 48 L12 0 Z', '#5a4a6a', C.ink, 1.4)), fig(76, C.dark, 'smile', { h: 0.66 }), on(76, 0.66, rect(-8, -80, 16, 12, C.black, 1, C.ink, 1.2), rect(-12, -69, 24, 2, C.black, 1, null))),
    at(100, 70, 1, line('M0 18 L0 -14', C.dark, 2.4), path('M-6 -14 L6 -14 L4 -22 L-4 -22 Z', '#f6e7a0', C.ink, 1.2)), ground),
  'hfor.forntid': all(rect(4, 4, 112, 108, '#e8dcc2', 3, null), hill(92, '#9ab070'), path('M70 92 L88 62 L106 92 Z', FUR, C.ink, 1.6), path('M84 92 L88 78 L92 92 Z', '#3a2a1a', null), fire(52, 102, 1.3),
    fig(24, FUR, 'smile', { h: 0.82, bottom: FUR }), reach(24, 0.82, 1, 38, 70), axe(40, 66, 1.2), tline(16, 10, 110, C.grey), rect(10, 11, 22, 10, HL, 2, null), tk(32, 16, C.grey)),
  'hfor.nutid': all(rect(4, 4, 112, 108, SKY, 3, null), rect(62, 30, 22, 82, '#9fb6c8', 1, C.ink, 1.4), rect(86, 46, 24, 66, '#b8c8d6', 1, C.ink, 1.4), ...range(5).map((i) => line(`M66 ${38 + i * 14} L80 ${38 + i * 14} M90 ${54 + i * 11} L106 ${54 + i * 11}`, '#e6f2fa', 2.4)),
    fig(36, C.orange, 'smile', { h: 0.85 }), reach(36, 0.85, 1, 48, 64), mobile(50, 62, 0.9), tline(16, 10, 110, C.grey), rect(88, 11, 22, 10, HL, 2, null), tk(88, 16, C.grey), ground),
  'hfor.periodisering': all(room(), ...[[10, 36, '#c9b28a', axe(23, 60, 1.6)], [36, 66, '#e0a85a', at(51, 60, 1, path('M0 10 L0 -10 L3 -12 L6 -10 L6 10 Z', '#c98b3a', C.ink, 1.2))], [66, 96, '#9aa3ad', at(81, 60, 1, path('M0 10 L0 -12 L3 -14 L6 -12 L6 10 Z', '#565b64', C.ink, 1.2))], [96, 112, '#bfe3f5', mobile(104, 60, 0.9)]].map(([x1, x2, col, k]) => all(rect(x1 as number, 76, (x2 as number) - (x1 as number), 16, col as string, 0, C.ink, 1.2), k as Svg)),
    ...[36, 66, 96].map((x) => line(`M${x} 70 L${x} 98`, HL, 3)), arrow(10, 104, 110, 104, C.ink, 2)),
  'hfor.brytningstid': all(rect(4, 4, 112, 108, '#eef0e6', 3, null), greyed(castle(30, 92, 1.3)), path('M60 112 L56 98 L64 88 L58 74 L62 62', 'none', C.ink, 2.4), at(92, 92, 1.1, rect(-18, -24, 36, 24, '#b86a4a', 0.5, C.ink, 1.3), path('M-18 -24 L-10 -32 L-10 -24 L-2 -32 L-2 -24 L6 -32 L6 -24', '#b86a4a', C.ink, 1.2), rect(10, -46, 6, 22, '#8a4a3a', 0.5, C.ink, 1.2), ellipse(14, -52, 6, 3.6, C.grey2, null), ellipse(20, -58, 7, 4, C.grey2, null)),
    sparkle(84, 34, 4), arrow(40, 30, 80, 30, HL, 2.4), ground),
  'hfor.regeringstid': all(room(), tline(98, 8, 114), tk(30, 98), num(30, 110, '1523', 8), tk(90, 98), num(90, 110, '1560', 8), rect(30, 92, 60, 12, 'rgba(228,87,46,0.25)', 1, null), line('M30 88 L30 84 L90 84 L90 88', HL, 2),
    g('translate(0 -30)', rect(46, 48, 28, 32, '#8a2a3a', 3, C.ink, 1.4), fig(60, '#2f4a7a', 'calm', { h: 0.6 }), crown(60, headY(0.6) - 9, 1.1))),
  'hfor.föregå': all(room(), tline(88, 8, 114), tk(34, 88), tk(86, 88), at(34, 64, 1, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', '#7a808a', C.ink, 1.4), line('M-8 10 l-2 6 M0 10 l-2 6 M8 10 l-2 6', '#5aa7d6', 2)),
    ringMark(34, 66, 22), num(34, 104, '1', 12, HL), greyed(ship(86, 70, 1.3)), num(86, 104, '2', 12, C.grey), arrow(56, 66, 70, 66, HL, 2.2)),
  'hfor.anakronism': all(rect(4, 4, 112, 108, '#e8e0cc', 3, null), fig(50, '#8a6a48', 'smile', { bottom: '#6a4a30' }), on(50, 1, path('M-11 -60 C-11 -74 11 -74 11 -60 Z', '#9aa3ad', C.ink, 1.8), line('M0 -72 L0 -58', C.ink, 1.4), path('M-11 -62 L-16 -68 M11 -62 L16 -68', 'none', '#efe6d2', 3)),
    at(26, 80, 1.3, circle(0, 0, 12, '#a04a2a', C.ink, 1.6), circle(0, 0, 3, '#c9c2b6', C.ink, 1)), reach(50, 1, 1, 74, 52), mobile(78, 46, 1.1), ringMark(78, 46, 15), ground),

  // ── 2355 Källkritik för historiker ──
  'hfor.källvärde': all(room(), ...[[22, 5, PARCH], [60, 3, PAPER], [98, 1, '#e8e8e8']].map(([x, n, col]) => all(doc(x as number, 46, 1.6, col as string, 4), magnifier((x as number) + 8, 58, 0.5),
    ...range(5).map((i) => rect((x as number) - 14 + i * 6, 96 - (i < (n as number) ? 8 + i * 3 : 4), 5, i < (n as number) ? 8 + i * 3 : 4, i < (n as number) ? (n === 5 ? '#3a9a5a' : n === 3 ? C.yellow : C.red) : C.grey2, 0.5, C.ink, 0.8)))),
    ringMark(22, 52, 24), ground),
  'hfor.tidsavstånd': all(room(), house(18, 64, 1.4), fire(18, 38, 0.9), fig(98, TEAL, 'calm', { h: 0.72 }), doc(82, 82, 0.6, PARCH, 3), tline(96, 8, 114, C.grey), tk(18, 96, C.grey), tk(98, 96, C.grey),
    line('M24 86 L88 86', HL, 2.4), path('M24 86 L31 82 L31 90 Z', HL, HL, 1), path('M88 86 L81 82 L81 90 Z', HL, HL, 1), num(56, 80, '100', 10, HL), clock(56, 54, 9)),
  'hfor.tendentiös': all(room(), at(60, 26, 1.6, rect(-14, -12, 28, 24, PARCH, 1, C.ink, 0.9), crown(0, -4, 0.7), circle(0, 3, 3, C.skin, C.ink, 0.6), sparkle(-9, -6, 1.6), sparkle(9, -6, 1.6), line('M-10 9 L10 9', C.grey, 0.8)),
    line('M60 48 L60 106', C.ink, 2.4), rect(48, 104, 24, 6, WOOD, 1, C.ink, 1.2), line('M24 66 L96 40', C.ink, 2.6), circle(60, 53, 3, C.ink, null),
    line('M24 66 L14 82 M24 66 L34 82 M96 40 L86 56 M96 40 L106 56', C.ink, 1), path('M10 82 L38 82 C36 88 12 88 10 82 Z', C.gold, C.ink, 1.2), path('M82 56 L110 56 C108 62 84 62 82 56 Z', C.gold, C.ink, 1.2),
    ...[0, 1, 2].map((i) => all(rect(16 + i * 2, 70 - i * 4, 14, 11, PARCH, 1, C.ink, 1), crown(23 + i * 2, 74 - i * 4, 0.4))), greyed(rect(90, 46, 12, 9, '#eee', 1, C.ink, 1)), arrow(46, 40, 30, 56, HL, 2.2), ground),
  'hfor.förvanska': all(room(), ...[[20, house(20, 64, 1)], [60, house(60, 64, 1.1)], [100, castle(100, 64, 0.65, '#d8a050')]].map(([x, k]) => all(rect((x as number) - 16, 32, 32, 40, PARCH, 1, C.ink, 1.3), k as Svg)),
    at(60, 48, 1, rect(-4, -12, 8, 6, '#c84a3c', 0.5, C.ink, 1)), arrow(37, 52, 43, 52, C.ink, 1.8), arrow(77, 52, 83, 52, C.ink, 1.8), tick(20, 86, 0.9), cross(100, 86, 0.9), ringMark(100, 52, 22), ground),

  // ── 2356 Historiska tolkningar ──
  'hfor.historiker': all(room(), rack(76, 114, 20, 4), table(88, 8, 82), fig(36, TEAL, 'calm', { h: 1 }), on(36, 1, circle(-3.6, -56, 2.6, 'none', C.ink, 0.9), circle(3.6, -56, 2.6, 'none', C.ink, 0.9)), reach(36, 1, 1, 54, 80), magnifier(58, 76, 0.7), doc(66, 82, 0.6, PARCH, 3), openBook(22, 84, 0.5), ground),
  'hfor.historiesyn': all(room(), line('M54 44 L66 44', C.ink, 2.4), circle(32, 46, 24, 'rgba(242,193,78,0.35)', C.ink, 3), circle(88, 46, 24, 'rgba(120,190,230,0.35)', C.ink, 3),
    line('M12 56 L52 56 M68 56 L108 56', C.ink, 1.6), crown(22, 44, 1), crown(42, 44, 1), mini(32, 32, C.navy, 0.8), mini(74, 46, C.green, 0.7), mini(84, 46, C.orange, 0.7), mini(94, 46, C.red, 0.7), mini(102, 46, C.sky, 0.6),
    greyed(tline(98, 8, 114), crown(30, 88, 0.6), mini(60, 84, '#999', 0.6), mini(70, 84, '#999', 0.6), mini(80, 84, '#999', 0.6)), line('M32 72 L32 84 M88 72 L88 84', C.grey, 1.4, '2 2')),
  'hfor.historieskrivning': all(room(), table(92), ...[[16, 34, -10], [22, 56, 6], [14, 76, -4]].map(([x, y, r]) => doc(x as number, y as number, 0.9, PARCH, 3, r as number)), ...[[30, 36], [34, 58], [28, 76]].map(([x, y]) => arrow(x as number, y as number, 46, 70, HL, 1.6)),
    openBook(62, 80, 1, textLines(-20, -8, 16, 4, 4.4), all(castle(12, 2, 0.32), textLines(4, 6, 16, 1))), fig(96, TEAL, 'calm', { h: 0.95 }), reach(96, 0.95, -1, 80, 80), pen(78, 80, 0.8, 30)),
  'hfor.omtolkning': all(room(), table(96), at(60, 84, 1.4, path('M-16 8 C-18 -6 -6 -12 4 -10 C14 -8 18 0 16 8 Z', STONE, C.ink, 1.4), line('M-8 0 L8 0 M-4 0 L-6 -6 M4 0 L6 -6 M-8 0 C-6 4 6 4 8 0', '#4a4a4a', 1.2)),
    greyed(thought(30, 24, 40, at(30, 26, 0.6, ellipse(0, 0, 10, 5, '#999', C.ink, 1), line('M-6 4 L-6 9 M6 4 L6 9 M8 -2 L14 -8', C.ink, 1.4)))), cross(46, 14, 0.7),
    thought(88, 24, 40, at(88, 28, 0.7, ship(0, 0, 0.9))), tick(104, 14, 0.7), magnifier(92, 76, 1), arrow(48, 30, 66, 30, HL, 2)),
  'hfor.revidera': all(room(), at(26, 64, 1.8, rect(-12, -16, 24, 32, PAPER, 1, C.ink, 0.8), ...range(5).map((i) => line(`M-8 ${-10 + i * 5} L8 ${-10 + i * 5}`, C.grey, 0.9)), line('M-9 -5 L9 -5 M-9 5 L9 5', C.red, 1.2)), num(26, 104, '1', 9, C.grey),
    arrow(50, 64, 68, 64, HL, 2.6), at(92, 64, 1.8, rect(-12, -16, 24, 32, PAPER, 1, C.ink, 0.8), ...range(5).map((i) => line(`M-8 ${-10 + i * 5} L8 ${-10 + i * 5}`, i === 1 || i === 3 ? '#2e8a4a' : C.grey, i === 1 || i === 3 ? 1.4 : 0.9))), num(92, 104, '2', 9, HL),
    rot(59, 24, -8, 1.1, path('M-10 -8 L10 -8 L10 8 L-10 8 Z', PARCH, C.ink, 1.2), line('M-7 -3 L7 -3 M-7 1 L7 1 M-7 5 L3 5', '#8a6a48', 1)), sparkle(74, 14, 3), sparkle(44, 16, 2.4), line('M59 36 L59 54', HL, 1.6, '3 2')),
  'hfor.kontrafaktisk': all(rect(4, 4, 112, 108, '#eef3e4', 3, null), line('M60 112 L60 80', '#8a8f99', 10), line('M60 80 C60 60 40 54 28 44', '#8a8f99', 10), line('M60 80 C60 60 80 54 92 44', HL, 3, '5 4'),
    greyed(castle(26, 36, 0.7), path('M14 36 L18 30 L22 34', 'none', C.ink, 1.2)), thought(92, 22, 40, castle(92, 28, 0.6, '#e8d8a8')), sparkle(104, 12, 3), fig(60, C.orange, 'calm', { h: 0.5 }), qmark(74, 74, 14, HL)),
  'hfor.efterhandsklokhet': all(rect(4, 4, 112, 108, '#eef3e4', 3, null), ellipse(44, 112, 16, 4, '#3a2a1a', null), greyed(fig(18, C.grey, 'smile', { h: 0.72 })), arrow(28, 90, 34, 90, C.grey, 1.6),
    fig(88, C.orange, 'frown', { h: 0.85 }), reach(88, 0.85, 1, 98, headY(0.85) + 2), reach(88, 0.85, -1, 76, 80), at(88, 14, 1, circle(0, 0, 7, C.yellow, C.ink, 1.4), rect(-3, 6, 6, 4, C.grey, 1, C.ink, 1), line('M-11 -4 L-14 -6 M11 -4 L14 -6 M0 -10 L0 -13', C.gold, 1.6)), line('M80 60 C70 64 60 80 52 100', HL, 1.6, '3 2'), ground),
  'hfor.historiebruk': all(room(), sepia(rect(10, 16, 34, 40, '#e8d8b0', 2, C.ink, 1.4), crown(27, 26, 1), circle(27, 36, 6, C.skin, C.ink, 1), path('M18 54 C18 44 36 44 36 54 Z', '#5a4a6a', null)), arrow(46, 36, 60, 36, HL, 2.4),
    rect(62, 12, 46, 52, '#4a8ac0', 3, C.ink, 1.6), crown(85, 24, 1.3), circle(85, 36, 7, C.skin, C.ink, 1.2), path('M74 58 C74 46 96 46 96 58 Z', '#c43b30', null), sparkle(68, 18, 3), sparkle(102, 50, 3), table(84, 54, 112), at(70, 84, 1, rect(-6, -16, 12, 16, '#f2c14e', 2, C.ink, 1.2), crown(0, -9, 0.5)),
    fig(26, C.green, 'smile', { h: 0.62 }), reach(26, 0.62, 1, 40, 80)),
  'hfor.glorifiera': all(rect(4, 4, 112, 108, '#f3ede2', 3, null), rect(46, 88, 40, 24, '#c9c2b6', 1, C.ink, 1.4), circle(66, 40, 26, '#fbe8a0', null), sparkle(44, 24, 4), sparkle(90, 22, 4), sparkle(94, 56, 3),
    fig(66, '#c43b30', 'smile', { h: 1, muscle: true, shoulders: 1.3, bottom: C.yellow }), on(66, 1, path('M-8 -68 L-9 -77 L-4 -73 L0 -79 L4 -73 L9 -77 L8 -68 Z', C.yellow, C.ink, 1.2)), on(66, 1, line('M18 -36 L28 -66', C.ink, 2.2), path('M28 -66 L40 -62 L28 -56 Z', C.yellow, C.ink, 1)),
    greyed(fig(22, C.grey, 'calm', { h: 0.55, belly: 0.6 }))),

  // ── 2357 Att skriva en historisk framställning ──
  'hfor.historisk': all(rect(4, 4, 112, 108, SKY, 3, null), castle(40, 108, 1.5, '#cbb98e'), flag(30, 66, C.red), at(78, 90, 1, rect(-12, -10, 24, 14, PARCH, 1, C.ink, 1.2), num(0, 0, '1523', 7)), line('M78 94 L78 108', WOOD, 2),
    greyed(rect(92, 52, 20, 60, '#ccc', 1, C.ink, 1.2), ...range(4).map((i) => line(`M96 ${60 + i * 12} L108 ${60 + i * 12}`, C.white, 2))), ringMark(40, 84, 30), ground),
  'hfor.framställning': all(room(), table(96), ...[2, 1, 0].map((i) => rect(28 + i * 3, 30 - i * 3, 52, 64, PAPER, 1, C.ink, 1.3)), rect(34, 36, 40, 6, C.navy, 1, null), rect(34, 46, 18, 3, C.ink, 0.5, null), textLines(34, 53, 40, 3), rect(34, 66, 18, 3, C.ink, 0.5, null),
    rect(56, 64, 18, 14, SEP, 0.5, C.ink, 0.8), textLines(34, 73, 18, 3), num(54, 90, '27', 6), rect(30, 26, 6, 4, C.silver, 1, C.ink, 0.8), pen(96, 90, 1.2, 50)),
  'hfor.redogöra': all(room(), rect(40, 14, 72, 52, C.white, 2, C.ink, 1.6), ...[[54, '1'], [76, '2'], [98, '3']].map(([x, n]) => all(circle(x as number, 32, 8, '#bfe3f5', C.ink, 1.2), num(x as number, 36, n as string, 10))), arrow(62, 32, 68, 32, C.ink, 1.6), arrow(84, 32, 90, 32, C.ink, 1.6),
    textLines(48, 48, 56, 3, 5), fig(24, TEAL, 'smile', { h: 0.9 }), reach(24, 0.9, 1, 42, 40), mini(66, 94, C.orange, 1.1), mini(90, 96, C.green, 1), ground),
  'hfor.skildra': all(room(), table(96), fig(22, C.navy, 'calm', { h: 0.8 }), reach(22, 0.8, 1, 38, 88), doc(46, 88, 0.7, PAPER, 3), pen(40, 86, 0.7, 30),
    line('M50 76 C56 60 60 50 66 44', HL, 1.6, '2 2'), rect(56, 10, 56, 40, '#bfe3f5', 4, C.ink, 1.6), path('M56 40 C72 34 92 36 112 32 L112 50 L56 50 Z', GRASS, null), house(74, 42, 0.8), circle(102, 18, 4, C.yellow, null), mini(92, 34, C.red, 0.6), mini(100, 35, C.green, 0.55), ground),
  'hfor.källhänvisning': all(room(), rect(8, 14, 60, 84, PAPER, 2, C.ink, 1.6), textLines(14, 24, 48, 3), rect(12, 40, 54, 10, 'rgba(242,193,78,0.55)', 1, null), line('M15 45 L46 45', C.grey, 1.3),
    num(50, 48, '(', 10, HL), book(56, 45, 0.28, C.green), num(62, 48, ')', 10, HL), textLines(14, 60, 48, 6),
    path('M64 40 C80 26 92 40 94 64', 'none', HL, 2.2), path('M90 60 L94 66 L98 60', 'none', HL, 2.2), book(96, 86, 1.3, C.green), ringMark(96, 86, 22), ground),
  'hfor.problematisera': all(room(), greyed(line('M14 30 L50 30', C.ink, 3), path('M50 30 L44 26 L44 34 Z', C.ink, null)), cross(58, 30, 0.8), qmark(24, 80, 18, C.navy),
    path('M34 76 C48 76 50 56 64 56 M34 76 L66 76 M34 76 C48 76 50 96 64 96', 'none', HL, 2), qmark(74, 60, 14, C.red), qmark(76, 80, 14, C.green), qmark(74, 100, 14, C.purple),
    path('M84 56 C92 56 92 48 100 48 M84 56 C92 56 92 64 100 64', 'none', HL, 1.4), qmark(106, 52, 10, C.orange), qmark(106, 68, 10, C.orange), fig(98, TEAL, 'calm', { h: 0.36 })),
};
