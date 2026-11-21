/**
 * Teknik & digital värld → Programmering & artificiell intelligens → Data & algoritmer, 3841–3847 (0.56):
 * data structures, searching and sorting, algorithms, time complexity, data quality, data processing and
 * data visualisation.
 * Recurring signs: data is small coloured tiles or value bars (never real words); a list is a column of cells,
 * a queue a horizontal tube, a stack an open box with tiles on top of each other; time is a stopwatch; a chart has
 * two dark axes with a tiny stack of cells at the end of the x axis (more data) and a tiny clock at the top of the
 * y axis (more time); the part the word names is ringed or framed in orange, and grey copies show what the word
 * is not.
 * Close words share one layout where only the marked part differs: konstant/kvadratisk/logaritmisk (the same chart
 * with a flat line, a steep parabola with an n×n grid, or a curve that flattens out with a bar that is halved);
 * importera/exportera (a file sinks down into the laptop screen, or rises up out of it to a folder);
 * kö/stack (a tube that is open at both ends, or a box that is only open at the top); nivå/hierarkisk (one band
 * of dots in a tree, or a pyramid of people).
 * Digits and code signs ({ } [ ] ( ) = + - / ✓ ✗ §) only; no words, no brands, no logos, no pointing fingers.
 */
import { C, all, circle, ellipse, g, line, moving, path, rect, sparkle, star, waBob, waIn, waPulse, waSpin, waSway, type Svg } from './kit';
import { HL, arm } from './people';
import { greyed } from './blindFix';
import { figure, type Build } from './figures';

// ── Palette and basics ───────────────────────────────────────────────
const BG = '#eef3f7';
const ED = '#263040';
const ED2 = '#3a4558';
const GREEN = '#3a9a5a';
const RED = '#e2553a';
const BLUE = '#3a6ab0';
const YEL = '#f2c14e';
const PURP = '#8a6bbf';
const BROWN = '#a0673d';
const BAR = '#c3cad2';
const KW = '#c792ea';
const STR = '#a5d672';
const NUM = '#f6b26b';
const ID = '#82aaff';
const TILE = [BLUE, GREEN, YEL, RED, PURP, NUM];
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const bg = (col: string = BG) => rect(4, 4, 112, 108, col, 4, null);
const ground = line('M4 112 L116 112', C.grey2, 2);
const ring = (x: number, y: number, r: number, col: string = HL, sw = 2.6) => circle(x, y, r, 'none', col, sw);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL, sw = 2.6) => ellipse(x, y, rx, ry, 'none', col, sw);
const frame = (x: number, y: number, w: number, h: number, r = 5, col: string = HL) => rect(x, y, w, h, 'none', r, col, 2.6);
const head = (x: number, y: number, a: number, col: string, s = 1) => {
  const L = 7 * s, W = 4 * s, c = Math.cos(a), si = Math.sin(a);
  return path(`M${f1(x)} ${f1(y)} L${f1(x - L * c + W * si)} ${f1(y - L * si - W * c)} L${f1(x - L * c - W * si)} ${f1(y - L * si + W * c)} Z`, col, null);
};
const arr = (x1: number, y1: number, x2: number, y2: number, col: string = HL, sw = 3, dash?: string) => all(line(`M${x1} ${y1} L${x2} ${y2}`, col, sw, dash), head(x2, y2, Math.atan2(y2 - y1, x2 - x1), col, sw / 3 + 0.3));
const ok = (x: number, y: number, r = 7) => all(circle(x, y, r, GREEN, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, r * 0.25));
const no = (x: number, y: number, r = 7) => all(circle(x, y, r, RED, C.ink, 1.2), line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, C.white, r * 0.25));
const txt = (x: number, y: number, s: string, size: number, col: string = C.ink, w = 800, family = 'system-ui,sans-serif') =>
  `<text x="${x}" y="${y}" font-family="${family}" font-weight="${w}" font-size="${size}" text-anchor="middle" fill="${col}">${s}</text>`;
const mono = (x: number, y: number, s: string, size: number, col: string = C.ink, w = 700) => txt(x, y, s, size, col, w, 'DejaVu Sans Mono,Menlo,Consolas,monospace');
const nameBar = (x: number, y: number, w: number, col = '#5a6472', sw = 3) => line(`M${x} ${y} L${x + w} ${y}`, col, sw);
const person = (x: number, top: string = C.green, more: Build = {}) => figure({ x, top, ...more });
/** A small bust: head and shoulders. */
const bust = (x: number, y: number, s = 1, top: string = C.green, hair: string = C.hair) => at(x, y, s, path('M-9 12 C-9 4 -5 2 0 2 C5 2 9 4 9 12 Z', top, C.ink, 1.2), circle(0, -4, 5.4, C.skin, C.ink, 1.2), path('M-5.4 -5 C-5 -11 5 -11 5.4 -5 C3 -7 -3 -7 -5.4 -5 Z', hair, C.ink, 1));

// ── Things ───────────────────────────────────────────────────────────
type CL = [number, number, string];
const editor = (x: number, y: number, w: number, h: number, ...inner: Svg[]) => all(rect(x, y, w, h, ED, 4, C.ink, 1.6), rect(x, y, w, 9, ED2, 4, null), rect(x, y + 5, w, 4, ED2, 0, null),
  circle(x + 6, y + 4.5, 1.6, '#ff6b5e', null), circle(x + 11, y + 4.5, 1.6, YEL, null), circle(x + 16, y + 4.5, 1.6, '#5ac85a', null), ...inner);
const code = (x: number, y: number, ls: CL[], gap = 8, sw = 3) => all(...ls.map(([ind, len, col], i) => line(`M${x + ind} ${y + i * gap} L${x + ind + len} ${y + i * gap}`, col, sw)));
/** A tile with a value in it. */
const chip = (x: number, y: number, s: string, col = '#fff3e0', size = 10, w = 16) => all(rect(x - w / 2, y - 7, w, 14, col, 3, C.ink, 1.2), mono(x, y + size * 0.36, s, size, C.ink, 800));
/** A coloured data tile without a value. */
const tile = (x: number, y: number, col: string, w = 12, h = 10) => all(rect(x - w / 2, y - h / 2, w, h, col, 2, C.ink, 1.1), line(`M${f1(x - w / 2 + 3)} ${y} L${f1(x + w / 2 - 3)} ${y}`, 'rgba(255,255,255,0.75)', 1.6));
const laptop = (x: number, y: number, s = 1, inner: Svg = '') => at(x, y, s, rect(-30, -40, 60, 40, C.dark, 3, C.ink, 1.8), rect(-26, -36, 52, 32, '#fbfbf8', 1, null), inner, path('M-36 0 L36 0 L40 6 L-40 6 Z', '#9aa3ad', C.ink, 1.6));
const phone = (x: number, y: number, s = 1, inner: Svg = '') => at(x, y, s, rect(-20, -36, 40, 72, C.dark, 5, C.ink, 1.8), rect(-17, -30, 34, 58, '#fbfbf8', 1.5, null), inner);
const gear = (x: number, y: number, r: number, col: string = '#9aa3ad') => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return rect(f1(x + Math.cos(a) * r - 2.2), f1(y + Math.sin(a) * r - 2.2), 4.4, 4.4, col, 1, C.ink, 0.8); }),
  circle(x, y, r, col, C.ink, 1.2), circle(x, y, f1(r * 0.38), BG, C.ink, 1));
const magnifier = (x: number, y: number, r = 9) => all(line(`M${f1(x + r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r * 1.6)} ${f1(y + r * 1.6)}`, '#7a5030', 3.6), circle(x, y, r, 'rgba(220,240,252,0.55)', C.ink, 1.8));
/** Stopwatch; `a` = angle of the hand in degrees from 12 o'clock; `arc` draws the passed time as an orange sector. */
const stopwatch = (x: number, y: number, r: number, a = 90, arc = false, spin = '') => {
  const rad = ((a - 90) * Math.PI) / 180, ex = f1(x + Math.cos(rad) * r * 0.78), ey = f1(y + Math.sin(rad) * r * 0.78);
  const sector = arc ? path(`M${x} ${y} L${x} ${f1(y - r * 0.86)} A${f1(r * 0.86)} ${f1(r * 0.86)} 0 ${a > 180 ? 1 : 0} 1 ${f1(x + Math.cos(rad) * r * 0.86)} ${f1(y + Math.sin(rad) * r * 0.86)} Z`, 'rgba(240,138,60,0.45)', null) : '';
  const hand = line(`M${x} ${y} L${ex} ${ey}`, C.ink, 1.8);
  return all(rect(x - 3, y - r - 7, 6, 5, '#9aa3ad', 1, C.ink, 1), line(`M${f1(x + r * 0.7)} ${f1(y - r * 0.7)} l3 -3`, C.ink, 2), circle(x, y, r, C.white, C.ink, 1.8), sector,
    spin ? waSpin(spin, 2.4, hand) : hand, circle(x, y, 1.6, C.ink, null));
};
/** A table sheet: rows × cols of white cells with value bars; `fill(r, c)` may return a custom cell. */
const sheet = (x: number, y: number, rows: number, cols: number, cw = 14, ch = 9, fill?: (r: number, c: number, cx: number, cy: number) => Svg | null) => all(
  rect(x - 1, y - 1, cols * cw + 2, rows * ch + 2, '#dfe5ea', 1, C.ink, 1.2),
  ...range(rows * cols).map((i) => { const r = Math.floor(i / cols), c = i % cols, cx = x + c * cw, cy = y + r * ch; const custom = fill ? fill(r, c, cx, cy) : null;
    return custom ?? all(rect(cx, cy, cw, ch, r === 0 ? '#e4ecf4' : C.white, 0, '#9aa3ad', 0.6), line(`M${cx + 2.5} ${f1(cy + ch / 2)} L${f1(cx + cw - 3 - ((r + c) % 3) * 1.5)} ${f1(cy + ch / 2)}`, r === 0 ? BLUE : '#7a8590', 1.6)); }));
/** A file icon with a folded corner; `kind` decides the picture on it. */
const file = (x: number, y: number, s = 1, col = '#3a9a5a', kind: 'table' | 'text' | 'chart' = 'table') => at(x, y, s,
  path('M-12 -16 L6 -16 L12 -10 L12 16 L-12 16 Z', C.white, C.ink, 1.4), path('M6 -16 L6 -10 L12 -10', '#dfe5ea', C.ink, 1.2), rect(-12, 9, 24, 7, col, 0, null), path('M-12 9 L12 9 L12 16 L-12 16 Z', 'none', C.ink, 1.2),
  kind === 'table' ? all(...range(3).map((r) => line(`M-8 ${-9 + r * 5} L6 ${-9 + r * 5}`, '#9aa3ad', 1.2)), line('M-2 -11 L-2 5', '#9aa3ad', 1.2), rect(-8, -11, 14, 3, col, 0, null))
    : kind === 'text' ? all(...range(4).map((r) => line(`M-8 ${-10 + r * 4.5} L${6 - (r % 2) * 5} ${-10 + r * 4.5}`, '#7a8590', 1.4)))
      : all(rect(-7, -2, 4, 7, BLUE, 0, null), rect(-2, -8, 4, 13, col, 0, null), rect(3, -5, 4, 10, YEL, 0, null)));
const folder = (x: number, y: number, s = 1, col = '#f2c14e') => at(x, y, s, path('M-16 -10 L-6 -10 L-3 -6 L16 -6 L16 12 L-16 12 Z', col, C.ink, 1.4), line('M-16 -3 L16 -3', '#d9a520', 1.2));
/** Chart axes with a tiny stack of cells at the end of the x axis and a tiny clock at the top of the y axis. */
const axes = (x = 22, y = 96, w = 84, h = 76, icons = true) => all(line(`M${x} ${y - h} L${x} ${y} L${x + w} ${y}`, C.ink, 2.2), head(x + w + 3, y, 0, C.ink, 0.9), head(x, y - h - 3, -Math.PI / 2, C.ink, 0.9),
  icons ? all(...range(3).map((i) => rect(x + w - 6, y + 4 + i * 4, 10, 4, TILE[i]!, 0.5, C.ink, 0.6)), circle(x - 9, y - h + 4, 5, C.white, C.ink, 1.2), line(`M${x - 9} ${y - h + 4} L${x - 9} ${y - h + 1} M${x - 9} ${y - h + 4} L${x - 7} ${y - h + 5}`, C.ink, 1)) : '');
const ptsPath = (pts: [number, number][]) => `M${pts.map(([a, b]) => `${f1(a)} ${f1(b)}`).join(' L')}`;
const curve = (fn: (t: number) => number, x = 22, y = 96, w = 84, h = 76, n = 24) => ptsPath(range(n + 1).map((i) => { const t = i / n; return [x + t * w, y - Math.min(1.05, fn(t)) * h] as [number, number]; }));
const bars = (x: number, base: number, hs: number[], w = 10, gap = 4, cols: string[] = TILE) => all(...hs.map((h, i) => rect(x + i * (w + gap), base - h, w, h, cols[i % cols.length]!, 1, C.ink, 1.1)));
const cellsRow = (x: number, y: number, n: number, w = 10, h = 10, cols: string[] = TILE) => all(...range(n).map((i) => rect(x + i * w, y, w, h, cols[i % cols.length]!, 0.5, C.ink, 0.9)));
const house = (x: number, y: number, s = 1, col = '#e6c79c', dark = false) => at(x, y, s, path('M-12 0 L-12 -14 L0 -24 L12 -14 L12 0 Z', col, C.ink, 1.4), path('M-15 -12 L0 -26 L15 -12', 'none', '#b5523b', 2.6), rect(-3, -9, 6, 9, BROWN, 1, C.ink, 1), rect(-9, -12, 5, 5, dark ? '#4a5260' : '#bfe3f5', 0.5, C.ink, 0.8), rect(4, -12, 5, 5, dark ? '#4a5260' : '#bfe3f5', 0.5, C.ink, 0.8));
const robot = (x: number, y: number, s = 1) => at(x, y, s, rect(-9, -16, 18, 16, '#b7c3d0', 3, C.ink, 1.3), circle(-4, -9, 2, BLUE, null), circle(4, -9, 2, BLUE, null), line('M0 -16 L0 -21', C.ink, 1.2), circle(0, -22, 1.8, RED, null),
  rect(-10, 0, 20, 12, '#9aa3ad', 2, C.ink, 1.3), circle(-6, 13, 3, C.dark, null), circle(6, 13, 3, C.dark, null));
const bulb = (x: number, y: number, s = 1) => at(x, y, s, ...[-1, 0, 1].map((i) => line(`M${i * 11} ${-15 - (i === 0 ? 2 : 0)} l${i * 3} -4`, C.gold, 2)), circle(0, 0, 8, YEL, C.ink, 1.5), rect(-4, 7, 8, 6, '#9aa3ad', 1, C.ink, 1.1));
/** A jigsaw piece (square with a knob on the right and the bottom). */
const piece = (x: number, y: number, s: number, col: string) => at(x, y, s, path('M0 0 L10 0 C10 -4 14 -4 14 0 L24 0 L24 10 C28 10 28 14 24 14 L24 24 L14 24 C14 20 10 20 10 24 L0 24 L0 14 C4 14 4 10 0 10 Z', col, C.ink, 1.3));

export const DATAALG_MOTIFS: Record<string, Svg> = {
  // ── 3841 Datastrukturer ────────────────────────────────────────────
  /** datastruktur: at the top a grey jumble of loose data tiles; an arrow leads down into an orange frame in which the same kind of tiles are ordered in three ways: a column of cells between square brackets, a small tree of dots, and a row of cells in a tube. */
  'dalg.datastruktur': all(bg(), greyed(...[[20, 16, 20], [34, 22, -15], [48, 14, 30], [64, 20, 10], [78, 13, -25], [92, 21, 15]].map(([x, y, r], i) => g(`rotate(${r} ${x} ${y})`, tile(Number(x), Number(y), TILE[i]!)))),
    arr(60, 30, 60, 42, C.grey, 2.2),
    mono(14, 86, '[', 22, C.ink), cellsRow(19, 58, 1, 12, 10), rect(19, 58, 12, 40, 'none', 0, null), ...range(4).map((i) => rect(19, 52 + i * 11, 12, 11, TILE[i]!, 0.5, C.ink, 0.9)), mono(37, 86, ']', 22, C.ink),
    line('M66 54 L56 70 M66 54 L76 70 M56 70 L50 84 M56 70 L62 84 M76 70 L82 84', '#7a8590', 1.4), ...[[66, 54], [56, 70], [76, 70], [50, 84], [62, 84], [82, 84]].map(([x, y], i) => circle(Number(x), Number(y), 4, TILE[i]!, C.ink, 1)),
    rect(88, 52, 22, 46, '#dfe5ea', 6, C.ink, 1.2), ...range(4).map((i) => rect(92, 55 + i * 10.5, 14, 9, TILE[i + 1]!, 1, C.ink, 0.9)),
    frame(8, 44, 106, 62, 6)),
  /** kö (i programmering): a horizontal tube with numbered tiles 2, 3, 4 in it; tile 1 has just left the tube at the left end along a green arrow, and a new tile 5 slides in at the right end; under the tube, small grey people stand in a line; the tube is framed. */
  'dalg.kö.2': all(bg(), rect(26, 38, 70, 26, '#dfe5ea', 13, C.ink, 1.6), chip(40, 51, '2', '#e4f1fb'), chip(58, 51, '3', '#e4f1fb'), chip(76, 51, '4', '#e4f1fb'),
    chip(12, 51, '1', '#dff1e4'), arr(24, 30, 8, 30, GREEN, 2.6), waIn('dalg-ko-in', 16, 0, chip(102, 51, '5', '#fff3e0')), arr(114, 72, 98, 72, HL, 2.4),
    greyed(...range(5).map((i) => bust(22 + i * 18, 96, 1, C.sky))), frame(22, 34, 78, 34, 14)),
  /** stack (i programmering): a tall box that is only open at the top, with four tiles lying on top of each other; the top tile is lifted out above the box and bobs up and down, with a double arrow at the opening; beside it a small grey pile of plates; the box is framed. */
  'dalg.stack.2': all(bg(), ground, path('M38 46 L38 104 L82 104 L82 46', '#dfe5ea', C.ink, 2), ...range(4).map((i) => rect(42, 92 - i * 12, 36, 10, TILE[i]!, 2, C.ink, 1.1)),
    waBob('dalg-stack', 4, rect(42, 20, 36, 10, NUM, 2, C.ink, 1.3)), line('M92 22 L92 44', HL, 2.4), head(92, 18, -Math.PI / 2, HL, 1), head(92, 48, Math.PI / 2, HL, 1),
    greyed(...range(4).map((i) => ellipse(104, 106 - i * 5, 10, 3, C.white, C.ink, 1.2))), frame(34, 14, 52, 94, 4)),
  /** nivå (i en ordning): a tree of dots with lines: one dot at the top, two under it, four at the bottom; the small digits 0, 1 and 2 stand at the left of each row; the bottom row is lit in an orange band and its dots are coloured, the rest are grey. */
  'dalg.nivå.3': all(bg(), rect(10, 70, 102, 22, 'rgba(240,138,60,0.18)', 6, null),
    line('M64 22 L40 50 M64 22 L88 50 M40 50 L26 80 M40 50 L52 80 M88 50 L76 80 M88 50 L100 80', '#9aa3ad', 1.8),
    ...[[64, 22], [40, 50], [88, 50]].map(([x, y]) => circle(Number(x), Number(y), 6, C.grey2, C.ink, 1.2)), ...[26, 52, 76, 100].map((x, i) => circle(x, 80, 7, TILE[i]!, C.ink, 1.4)),
    ...['0', '1', '2'].map((d, i) => mono(10, [25, 53, 84][i]!, d, 9, i === 2 ? C.ink : '#8a939d', 800)), frame(10, 70, 102, 22, 6)),
  /** hierarkisk: a pyramid of people: one person in a gold top at the top, three in blue under, five in green at the bottom, joined by lines downwards; an orange triangle frames the pyramid. */
  'dalg.hierarkisk': all(bg(), line('M60 34 L32 58 M60 34 L60 58 M60 34 L88 58 M32 70 L16 88 M32 70 L38 88 M60 70 L60 88 M88 70 L82 88 M88 70 L104 88', '#7a8590', 1.4),
    bust(60, 26, 1.3, C.gold), ...[32, 60, 88].map((x) => bust(x, 62, 1.05, BLUE)), ...[16, 38, 60, 82, 104].map((x) => bust(x, 96, 0.9, GREEN)),
    path('M60 6 L114 108 L6 108 Z', 'none', HL, 2.6)),
  /** uppsättning: an open case with five screwdrivers in a row in their own slots, from small to big, all with the same orange handles; a single grey odd wrench lies outside the case; the case is framed. */
  'dalg.uppsättning': all(bg(), ground, rect(14, 34, 76, 66, '#2f3a4a', 5, C.ink, 1.8), rect(18, 38, 68, 58, '#465468', 3, null),
    ...range(5).map((i) => { const x = 25 + i * 13, L = 22 + i * 4; return all(rect(x - 3.5, 44, 7, 46, '#3a4558', 2, null), rect(x - 3, 46, 6, 16, HL, 2, C.ink, 1), line(`M${x} 62 L${x} ${62 + L}`, '#c3cad2', 2.4), line(`M${x - 1.5} ${62 + L} L${x + 1.5} ${62 + L}`, '#c3cad2', 2)); }),
    greyed(g('rotate(-30 102 92)', rect(90, 89, 22, 5, '#9aa3ad', 2, C.ink, 1), circle(112, 91.5, 5, '#9aa3ad', C.ink, 1))), frame(10, 30, 84, 74, 6)),
  /** länka (koppla ihop): three boxes in a row, each split into a value part and a small dark pointer part; an arrow goes from the pointer part of the first box to the second box, and an orange arrow grows from the second box to the third; above them a small grey chain of three links. */
  'dalg.länka.2': all(bg(), ...[10, 44, 78].map((x, i) => all(rect(x, 50, 32, 22, C.white, 3, C.ink, 1.4), rect(x + 22, 50, 10, 22, '#5a6472', 0, C.ink, 1.2), tile(x + 11, 61, TILE[i]!, 14, 10), circle(x + 27, 61, 2, C.white, null))),
    arr(39, 61, 44, 61, C.ink, 2.2), moving('dalg-lanka', '0%{transform:scaleX(0);opacity:.2}60%,100%{transform:scaleX(1);opacity:1}', { dur: 2.6 }, arr(73, 61, 78, 61, HL, 2.6)),
    greyed(...[46, 60, 74].map((x) => ellipse(x, 28, 9, 5, 'none', '#7a8590', 3))),
    oval(80, 61, 10, 16)),
  /** strukturera: on the left a grey messy pile of coloured sheets lying askew; an arrow points right, where the same sheets fly into a neat grid with one colour per row; the neat grid is framed. */
  'dalg.strukturera': all(bg(), greyed(...[[16, 70, 25], [26, 62, -20], [20, 82, -8], [34, 76, 35], [14, 92, 12], [30, 90, -30], [24, 52, 10]].map(([x, y, r], i) => g(`rotate(${r} ${x} ${y})`, rect(Number(x) - 8, Number(y) - 5, 16, 10, TILE[i % 4]!, 1, C.ink, 1)))),
    arr(44, 72, 56, 72, HL, 2.6),
    waIn('dalg-strukt', -24, 6, ...range(12).map((i) => { const r = Math.floor(i / 3), c = i % 3; return rect(64 + c * 16, 40 + r * 15, 14, 11, TILE[r]!, 1, C.ink, 1); })),
    frame(60, 36, 54, 64, 5)),

  // ── 3842 Sökning och sortering ─────────────────────────────────────
  /** söka igenom: nine document cards in three rows; an orange dashed zig-zag path runs over every card row by row, and a magnifier moves along it to the last card; the whole set of cards is framed. */
  'dalg.söka-igenom': all(bg(), ...range(9).map((i) => { const r = Math.floor(i / 3), c = i % 3, x = 18 + c * 32, y = 18 + r * 30; return all(rect(x, y, 22, 24, C.white, 2, C.ink, 1.3), ...range(3).map((k) => line(`M${x + 4} ${y + 7 + k * 5} L${x + 18 - (k % 2) * 5} ${y + 7 + k * 5}`, '#9aa3ad', 1.4))); }),
    line('M24 30 L94 30 L94 60 L24 60 L24 90 L90 90', HL, 2.2, '4 3'),
    moving('dalg-sok', '0%{transform:translate(-64px,-60px)}20%{transform:translate(0,-60px)}35%{transform:translate(0,-30px)}55%{transform:translate(-64px,-30px)}70%{transform:translate(-64px,0)}90%,100%{transform:translate(0,0)}', { dur: 4 }, magnifier(92, 88, 10)),
    frame(12, 12, 100, 96, 6)),
  /** relevans: a search bar with a blue query bar and a magnifier; under it three result rows: the first has the same blue bar and a full green meter, the second a half meter, the third an almost empty grey meter; the full meter is ringed. */
  'dalg.relevans': all(bg(), rect(10, 12, 100, 18, C.white, 9, C.ink, 1.6), nameBar(20, 21, 46, BLUE, 4), magnifier(96, 19, 5),
    ...[[BLUE, 5], [GREEN, 3], ['#9aa3ad', 1]].map(([col, n], r) => { const y = 42 + r * 22; return all(rect(10, y, 100, 18, r === 0 ? '#fff' : '#f6f8fa', 3, C.ink, 1.2), nameBar(16, y + 6, 40, String(col), 3), nameBar(16, y + 12, 28, BAR, 2),
      ...range(5).map((k) => rect(70 + k * 7, y + 12 - k * 1.6, 5, 4 + k * 1.6, k < Number(n) ? (r === 0 ? GREEN : r === 1 ? YEL : C.grey) : '#e3e7eb', 0.5, C.ink, 0.6))); }),
    oval(87, 48, 22, 11)),
  /** sortera (i ordning): five coloured bars of different heights; they slide sideways into place so that they stand from the lowest to the highest; an orange arrow under them points right; the sorted row is framed. */
  'dalg.sortera.2': all(bg(), ground, line('M12 94 L108 94', C.ink, 2),
    ...[[14, 3], [28, 0], [42, 4], [56, 1], [70, 2]].map(([h, from], i) => moving(`dalg-sort-${i}`, `0%,15%{transform:translateX(${(Number(from) - i) * 18}px)}65%,100%{transform:translateX(0)}`, { dur: 3.2 }, rect(18 + i * 18, 94 - Number(h) - 12, 14, Number(h) + 12, TILE[i]!, 1.5, C.ink, 1.2))),
    arr(22, 104, 98, 104, HL, 2.6), frame(12, 20, 96, 78, 5)),
  /** i omvänd ordning: at the top a grey row of cards 1 2 3 4; at the bottom the same cards in colour as 4 3 2 1; a big orange U-turn arrow on the right leads from the top row down to the bottom row, which is framed. */
  'dalg.i-omvänd-ordning': all(bg(), greyed(...['1', '2', '3', '4'].map((d, i) => chip(18 + i * 22, 30, d, C.white, 12, 18))),
    path('M100 30 C116 30 116 82 100 82', 'none', HL, 3.4), head(100, 82, Math.PI, HL, 1.3),
    ...['4', '3', '2', '1'].map((d, i) => chip(18 + i * 22, 82, d, ['#fde3dd', '#fff3e0', '#e4f1fb', '#dff1e4'][i]!, 12, 18)), frame(6, 70, 90, 24, 5)),
  /** hamna (i en ordning): a phone with a list of four rows; an orange row with a small bicycle slides up from the bottom to the top place, which is ringed; the other rows are grey. */
  'dalg.hamna.2': all(bg(), phone(60, 60, 1.25, all(...range(3).map((i) => all(rect(-15, -6 + i * 10, 30, 8, '#eef1f4', 1.5, '#b7c3d0', 0.6), nameBar(-12, -2 + i * 10, 14, BAR, 2))),
    moving('dalg-hamna', '0%,10%{transform:translateY(30px)}60%,100%{transform:translateY(0)}', { dur: 3 }, rect(-15, -18, 30, 9, '#fde3c8', 1.5, HL, 1), circle(-10, -13, 2.2, 'none', C.ink, 0.8), circle(-4, -13, 2.2, 'none', C.ink, 0.8), line('M-10 -13 L-7 -16 L-4 -13', C.ink, 0.8), nameBar(1, -13.5, 11, HL, 2)))),
    oval(60, 43, 26, 9)),
  /** sökhistorik: a search bar with a dropdown list of four earlier searches under it; each row starts with a small clock with a round arrow; the dropdown is framed. */
  'dalg.sökhistorik': all(bg(), rect(10, 14, 100, 18, C.white, 9, C.ink, 1.6), magnifier(20, 22, 5), waPulse('dalg-hist-cur', line('M32 17 L32 27', C.ink, 1.4)),
    rect(10, 34, 100, 70, C.white, 4, C.ink, 1.4), ...range(4).map((i) => { const y = 46 + i * 16; return all(circle(22, y, 5.5, '#f4f6f8', C.ink, 1.2), line(`M22 ${y} L22 ${y - 3.5} M22 ${y} L24.5 ${y + 1.5}`, C.ink, 1), path(`M15.5 ${y - 2} A7 7 0 0 1 20 ${y - 7}`, 'none', HL, 1.4), head(20, y - 7, -0.2, HL, 0.5), nameBar(34, y, 30 + ((i * 13) % 30), '#7a8590', 3)); }),
    frame(8, 34, 104, 72, 5)),

  // ── 3843 Algoritmer ────────────────────────────────────────────────
  /** instruktion (till en dator): a grey code window where one single line is bright and ringed: an arrow sign and a 1; a dashed line leads from it to a small robot, which rolls one step forward. */
  'dalg.instruktion.2': all(bg(), ground, greyed(editor(8, 10, 70, 60, code(16, 28, [[0, 20, KW], [6, 30, ID], [6, 24, STR], [0, 26, NUM], [6, 18, ID]], 8))),
    rect(12, 39, 62, 10, '#fbfbf8', 2, null), mono(26, 47, '→', 9, C.ink), mono(40, 47, '1', 9, C.ink), line('M48 44 L68 44', BLUE, 3), oval(43, 44, 34, 9),
    line('M78 46 C92 50 92 66 90 76', HL, 1.8, '3 2'), line('M64 106 L104 106', '#c3cad2', 1, '2 2'), waIn('dalg-instr', -16, 0, robot(92, 94, 1))),
  /** regel: a booklet with a big § on its cover; beside it two cards: one with a person walking and a green tick, one with a person running and a red cross; the booklet is ringed. */
  'dalg.regel': all(bg(), rect(14, 22, 44, 62, '#3a6ab0', 3, C.ink, 1.8), rect(14, 22, 6, 62, '#2a4f88', 0, null), mono(39, 64, '§', 34, C.white, 800),
    rect(66, 20, 44, 38, C.white, 4, C.ink, 1.4), at(80, 50, 0.9, circle(0, -20, 4, C.skin, C.ink, 1), line('M0 -16 L0 -6 M0 -6 L-4 2 M0 -6 L3 2 M0 -13 L-4 -8 M0 -13 L4 -9', C.ink, 1.8)), ok(98, 30, 6),
    rect(66, 66, 44, 38, C.white, 4, C.ink, 1.4), at(80, 96, 0.9, circle(2, -20, 4, C.skin, C.ink, 1), line('M0 -16 L-2 -6 M-2 -6 L-9 0 M-2 -6 L6 -1 L6 3 M0 -13 L-7 -11 M0 -13 L7 -16', C.ink, 1.8)), no(98, 76, 6),
    oval(36, 54, 28, 38)),
  /** flödesschema: a flow chart: a green oval at the top, an arrow to a box, an arrow to a yellow diamond, two arrows out of the diamond to a box on each side, and arrows from both boxes down to a red oval; the whole chart is framed. */
  'dalg.flödesschema': all(bg(), ellipse(60, 14, 14, 6, '#bfe8c8', C.ink, 1.4), arr(60, 20, 60, 26, C.ink, 1.6), rect(44, 27, 32, 12, C.white, 2, C.ink, 1.4), nameBar(50, 33, 20, '#7a8590', 2),
    arr(60, 39, 60, 46, C.ink, 1.6), path('M60 46 L76 58 L60 70 L44 58 Z', '#fde9a8', C.ink, 1.4), mono(60, 62, '?', 10, C.ink),
    line('M44 58 L26 58 L26 74', C.ink, 1.6), head(26, 76, Math.PI / 2, C.ink, 0.8), line('M76 58 L94 58 L94 74', C.ink, 1.6), head(94, 76, Math.PI / 2, C.ink, 0.8), ok(34, 52, 3.6), no(86, 52, 3.6),
    rect(12, 77, 28, 12, C.white, 2, C.ink, 1.4), nameBar(17, 83, 18, GREEN, 2), rect(80, 77, 28, 12, C.white, 2, C.ink, 1.4), nameBar(85, 83, 18, RED, 2),
    line('M26 89 L26 98 L52 98 M94 89 L94 98 L68 98', C.ink, 1.6), ellipse(60, 100, 10, 5, '#fbd0c6', C.ink, 1.4), frame(7, 6, 106, 102, 6)),
  /** pseudokod: a spiral notepad with three numbered lines, 1. 2. 3., each followed by wavy handwriting; a grey arrow leads from the notepad to a small grey code window; the notepad is ringed. */
  'dalg.pseudokod': all(bg(), rect(10, 16, 62, 86, '#fffdf2', 3, C.ink, 1.6), ...range(6).map((i) => circle(18 + i * 9.5, 16, 2.4, 'none', C.ink, 1.2)),
    ...['1.', '2.', '3.'].map((d, i) => { const y = 40 + i * 22; return all(mono(21, y + 3, d, 9, BLUE, 800), line(`M30 ${y} q3 -4 6 0 t6 0 t6 0 t6 0 t6 0${i === 1 ? '' : ' t6 0'}`, '#5a6472', 1.6)); }),
    arr(76, 60, 86, 60, C.grey, 2), greyed(editor(86, 40, 28, 40, code(90, 58, [[0, 12, KW], [3, 16, ID], [3, 10, STR]], 7, 2.4))), oval(41, 60, 36, 46)),
  /** problemlösning: a square puzzle of four pieces; three are in place and the last orange piece slides into the gap; above, a light bulb glows; the puzzle is framed. */
  'dalg.problemlösning': all(bg(), piece(26, 48, 1.15, BLUE), piece(54, 48, 1.15, GREEN), piece(26, 76, 1.15, YEL), rect(54, 76, 28, 28, '#dfe5ea', 1, '#9aa3ad', 1, ),
    waIn('dalg-pussel', 26, 18, piece(54, 76, 1.15, HL)), waPulse('dalg-lampa', bulb(96, 26, 1.1)), frame(20, 42, 70, 68, 5)),
  /** bryta ner (dela upp): a big orange block with a question mark at the top; arrows lead down to three small blocks that slide out of it, each with a green tick; the three small blocks are framed. */
  'dalg.bryta-ner.2': all(bg(), rect(32, 10, 56, 30, HL, 4, C.ink, 1.8), mono(60, 32, '?', 20, C.white, 800),
    arr(46, 42, 26, 62, C.ink, 2), arr(60, 42, 60, 62, C.ink, 2), arr(74, 42, 94, 62, C.ink, 2),
    ...[[26, -20], [60, 0], [94, 20]].map(([x, dx], i) => waIn(`dalg-bryt-${i}`, -Number(dx), -26, rect(Number(x) - 14, 66, 28, 20, '#fde3c8', 3, C.ink, 1.4), ok(Number(x), 98, 6))),
    frame(8, 62, 104, 46, 6)),
  /** optimera: a half-round gauge from red over yellow to green, whose needle swings from red to green; under it two time bars with a small stopwatch: a long grey bar and a short orange bar; the gauge is ringed. */
  'dalg.optimera': all(bg(), path('M18 62 A42 42 0 0 1 46 22 L52 36 A27 27 0 0 0 33 62 Z', RED, C.ink, 1.2), path('M46 22 A42 42 0 0 1 74 22 L68 36 A27 27 0 0 0 52 36 Z', YEL, C.ink, 1.2), path('M74 22 A42 42 0 0 1 102 62 L87 62 A27 27 0 0 0 68 36 Z', GREEN, C.ink, 1.2),
    moving('dalg-opt', '0%,10%{transform:rotate(-110deg)}65%,100%{transform:rotate(0)}', { dur: 3.2, spin: true }, line('M32 82 L88 42', 'none', 3), line('M60 62 L88 42', C.ink, 3), circle(60, 62, 4, C.ink, null)),
    stopwatch(14, 92, 7), greyed(rect(26, 84, 82, 7, '#9aa3ad', 3, C.ink, 1)), rect(26, 96, 34, 7, HL, 3, C.ink, 1), oval(60, 46, 50, 24)),
  // ── 3844 Tidskomplexitet ───────────────────────────────────────────
  /** tidskomplexitet: three rows: a short list of two cells next to a stopwatch with a small orange sector, a list of four cells with a bigger sector, and a list of eight cells with an almost full sector; an orange curve joins the three stopwatches; everything is framed. */
  'dalg.tidskomplexitet': all(bg(), cellsRow(12, 18, 2, 8, 9), cellsRow(12, 50, 4, 8, 9), cellsRow(12, 84, 8, 8, 9),
    stopwatch(90, 24, 9, 40, true), stopwatch(90, 56, 9, 130, true), stopwatch(90, 89, 9, 320, true),
    line('M101 24 C110 34 110 46 101 54 M101 58 C114 70 114 80 101 88', HL, 1.8, '3 2'), frame(7, 8, 108, 98, 6)),
  /** ta tid på: a hand holds a big stopwatch and the thumb presses its button while the hand of the watch turns; beside it a laptop shows a bar that fills up. */
  'dalg.ta-tid-på': all(bg(), ground, arm(36, 112, 34, 92), ellipse(34, 88, 11, 8, C.skin, C.ink, 1.3), stopwatch(34, 58, 22, 120, false, 'dalg-tatid'), ellipse(34, 33, 4, 3, C.skin, C.ink, 1.1),
    laptop(88, 100, 0.7, all(rect(-20, -24, 40, 7, '#e3e7eb', 3, C.ink, 1), moving('dalg-tatid-bar', '0%{transform:scaleX(0)}80%,100%{transform:scaleX(1)}', { dur: 2.4 }, rect(-20, -24, 40, 7, GREEN, 3, null)))),
    ring(34, 58, 27)),
  /** konstant (tid): a chart with two axes; a thick orange line runs flat all the way, while a thin grey line climbs; on the flat line stand three identical small stopwatches; the flat line is framed. */
  'dalg.konstant-adj': all(bg(), axes(), greyed(line('M22 96 L104 26', '#7a8590', 1.8, '4 3')), line('M22 70 L104 70', HL, 4),
    ...[40, 64, 88].map((x) => stopwatch(x, 56, 6, 90, true)), frame(18, 62, 92, 16, 5)),
  /** kvadratisk (om tillväxt): the same chart: a thick orange curve that bends up steeply while a yellow dot climbs along it, and a thin grey straight line; at the bottom right a small square grid of 4 × 4 cells; the steep curve is ringed at its top. */
  'dalg.kvadratisk.2': all(bg(), axes(), greyed(line('M22 96 L104 56', '#7a8590', 1.8, '4 3')), line(curve((t) => t * t * 1.0), HL, 4),
    moving('dalg-kvadr', '0%{transform:translate(-82px,76px)}35%{transform:translate(-41px,57px)}60%{transform:translate(-20.5px,33.2px)}85%,100%{transform:translate(0,0)}', { dur: 3 }, circle(104, 20, 4, YEL, C.ink, 1.2)),
    ...range(16).map((i) => rect(66 + (i % 4) * 7, 66 + Math.floor(i / 4) * 6, 7, 6, (i % 4 + Math.floor(i / 4)) % 2 ? '#fde3c8' : '#f6b26b', 0, C.ink, 0.6)), oval(98, 30, 12, 16)),
  /** logaritmisk: the same chart: a thick orange curve that rises fast at first and then flattens out while a yellow dot travels along it, and a thin grey straight line above it at the end; at the top right a bar that is cut in half again and again; the flat part of the curve is framed. */
  'dalg.logaritmisk': all(bg(), axes(), greyed(line('M22 96 L104 22', '#7a8590', 1.8, '4 3')), line(curve((t) => Math.log2(1 + 15 * t) / 4 * 0.55), HL, 4),
    moving('dalg-log', '0%{transform:translate(-82px,41.8px)}25%{transform:translate(-61.5px,18.3px)}50%{transform:translate(-41px,9.5px)}85%,100%{transform:translate(0,0)}', { dur: 3 }, circle(104, 54.2, 4, YEL, C.ink, 1.2)),
    rect(64, 14, 40, 5, BLUE, 1, C.ink, 0.8), rect(64, 22, 20, 5, BLUE, 1, C.ink, 0.8), rect(64, 30, 10, 5, BLUE, 1, C.ink, 0.8), rect(64, 38, 5, 5, BLUE, 1, C.ink, 0.8),
    frame(60, 46, 50, 22, 5)),
  /** minnesanvändning: a green memory stick with black chips; above it a long meter that is filled about four fifths with orange, and a small app window pours into it along an arrow; the meter is framed. */
  'dalg.minnesanvändning': all(bg(), rect(10, 78, 100, 22, '#2f8a4a', 2, C.ink, 1.6), ...range(5).map((i) => rect(16 + i * 19, 82, 14, 12, '#1d2128', 1, null)), ...range(14).map((i) => rect(14 + i * 7, 100, 4, 5, C.gold, 0, null)),
    rect(12, 46, 96, 16, '#e3e7eb', 4, C.ink, 1.4), moving('dalg-minne', '0%{transform:scaleX(.2)}70%,100%{transform:scaleX(1)}', { dur: 3 }, rect(12, 46, 78, 16, HL, 4, null)), line('M90 46 L90 62', C.ink, 1),
    rect(40, 10, 26, 20, C.white, 2, C.ink, 1.3), rect(40, 10, 26, 5, BLUE, 2, null), arr(53, 32, 53, 43, C.ink, 2), frame(8, 42, 104, 24, 5)),
  // ── 3845 Datakvalitet ──────────────────────────────────────────────
  /** datakvalitet: a neat table where every cell is filled, with a big green rosette with a tick and three stars on its corner; beside it a small grey messy table with a red cross; the neat table is framed. */
  'dalg.datakvalitet': all(bg(), sheet(12, 30, 6, 4, 15, 10), at(80, 30, 1, circle(0, 0, 13, GREEN, C.ink, 1.6), path('M-7 10 L-11 26 L-3 21 L0 28 L2 12', GREEN, C.ink, 1.2), path('M7 10 L11 26 L3 21 L0 28', GREEN, C.ink, 1.2), ok(0, 0, 8)),
    ...[-12, 0, 12].map((d) => star(80 + d, 52, 5)), greyed(at(98, 94, 0.5, sheet(-20, -16, 3, 3, 14, 10, (r, c, cx, cy) => (r + c) % 2 ? rect(cx, cy, 14, 10, '#fde3dd', 0, '#9aa3ad', 0.6) : null)), no(104, 74, 5)),
    frame(8, 26, 68, 68, 5)),
  /** ofullständig: a table where several cells are empty, with dashed orange outlines and question marks; the rest of the cells hold value bars; the table is framed. */
  'dalg.ofullständig': all(bg(), sheet(14, 22, 7, 4, 23, 11, (r, c, cx, cy) => (r > 0 && [[1, 2], [3, 1], [4, 3], [6, 2], [2, 3]].some(([a, b]) => a === r && b === c)) ? all(rect(cx + 1, cy + 1, 21, 9, '#fff7ef', 0, HL, 1.2).replace('/>', ' stroke-dasharray="2 1.5"/>'), mono(cx + 11.5, cy + 8.5, '?', 8, HL, 900)) : null),
    frame(10, 18, 100, 86, 5)),
  /** inaktuell: an old yellowed address card with a house on it and a cobweb in its corner; a dashed line leads from the card to the same house, now with dark windows and nobody home, while a moving van drives away; the old card is ringed. */
  'dalg.inaktuell': all(bg(), ground, rect(8, 14, 50, 34, '#efe2b8', 3, '#9a8a5a', 1.4), house(22, 40, 0.65), nameBar(32, 24, 20, '#9a8a5a', 2.4), nameBar(32, 31, 16, '#9a8a5a', 2), nameBar(32, 38, 18, '#9a8a5a', 2),
    line('M58 14 L48 24 M58 14 L52 26 M58 14 L46 18 M56 16 C54 20 50 20 49 21 M54 20 C53 23 51 24 50 24', '#7a6a40', 0.8),
    line('M34 50 C38 70 48 80 52 86', '#7a8590', 1.4, '3 2'), house(64, 112, 1.25, '#d9d0c0', true),
    at(98, 104, 1, rect(-14, -16, 18, 16, C.white, 1, C.ink, 1.2), path('M4 -12 L12 -12 L16 -6 L16 0 L4 0 Z', BLUE, C.ink, 1.2), circle(-8, 1, 3, C.dark, null), circle(10, 1, 3, C.dark, null)), line('M112 92 L118 92 M113 98 L118 98', '#7a8590', 1.2),
    oval(33, 31, 30, 22)),
  /** rensa (gå igenom): a table with five rows; two red rows with crosses slide out to the right and drop into a bin, while a broom sweeps; the rows that stay have green ticks; the table is framed. */
  'dalg.rensa.6': all(bg(), ground, ...range(3).map((i) => all(rect(10, 18 + i * 18, 56, 14, C.white, 2, C.ink, 1.2), nameBar(16, 25 + i * 18, 28, '#7a8590', 3), ok(58, 25 + i * 18, 4.5))),
    moving('dalg-rensa', '0%,10%{transform:translate(-40px,-40px);opacity:1}70%,100%{transform:translate(0,0);opacity:1}', { dur: 3 }, rect(78, 66, 30, 9, '#fde3dd', 2, RED, 1.2), no(102, 70.5, 3.6), rect(80, 58, 30, 9, '#fde3dd', 2, RED, 1.2)),
    path('M74 76 L112 76 L108 110 L78 110 Z', '#9aa3ad', C.ink, 1.6), line('M80 82 L82 104 M93 82 L93 104 M106 82 L104 104', '#6b7380', 1.4),
    waSway('dalg-rensa-borste', 10, line('M44 76 L58 100', BROWN, 3), path('M52 98 L66 92 L70 104 L56 108 Z', YEL, C.ink, 1.2)), frame(6, 14, 64, 56, 5)),
  /** mata in: two hands type on a keyboard; digits fly up from the keys into the empty cell of a table on a screen above; the cell that is being filled is ringed. */
  'dalg.mata-in': all(bg(), rect(12, 10, 96, 56, C.dark, 4, C.ink, 1.6), sheet(18, 16, 4, 4, 21, 11, (r, c, cx, cy) => (r === 3 && c === 2) ? rect(cx, cy, 21, 11, '#fff3e0', 0, HL, 1.4) : null),
    waIn('dalg-matain', 0, 30, mono(70.5, 57, '42', 8, C.ink, 800)), ring(70.5, 54.5, 12),
    rect(14, 80, 92, 26, '#c9ced4', 4, C.ink, 1.6), ...range(14).map((i) => rect(18 + (i % 7) * 12.4, 84 + Math.floor(i / 7) * 10, 9, 7, C.white, 1, C.ink, 0.8)),
    waBob('dalg-matain-v', 2, ellipse(40, 90, 9, 6, C.skin, C.ink, 1.2)), moving('dalg-matain-h', '0%,100%{transform:translate(0,0)}50%{transform:translate(0,-2px)}', { dur: 2.2, delay: 1.1 }, ellipse(80, 90, 9, 6, C.skin, C.ink, 1.2)),
    arm(32, 112, 38, 94), arm(88, 112, 82, 94)),

  // ── 3846 Databearbetning ───────────────────────────────────────────
  /** rådata: a long paper printout that curls and folds, full of small scattered digits in no order; beside it a small grey tidy bar chart; the printout is ringed. */
  'dalg.rådata': all(bg(), path('M10 16 L62 12 L66 40 L14 46 Z', '#fbfbf8', C.ink, 1.2), path('M14 46 L66 40 L60 70 L8 74 Z', '#f4f4ee', C.ink, 1.2), path('M8 74 L60 70 L66 102 L14 106 Z', '#fbfbf8', C.ink, 1.2),
    ...'7 3 9 1 4 8 2 6 0 5 3 7 1 9 4 2 8 6 5 0 7 2 9 3 1 6 4 8'.split(' ').map((d, i) => mono(18 + ((i * 17) % 42), 24 + Math.floor(i / 2.4) * 8.6 + ((i * 5) % 4), d, 7, ['#5a6472', BLUE, '#5a6472', RED][i % 4]!, 700)),
    greyed(bars(78, 100, [12, 20, 28, 36], 7, 3)), oval(37, 59, 33, 50)),
  /** importera (data i en app): a green table file sinks down from above into the screen of a laptop along a downward arrow; the screen already shows a table; the laptop is framed. */
  'dalg.importera.3': all(bg(), ground, laptop(60, 100, 1.25, sheet(-20, -32, 4, 4, 10, 6)), waIn('dalg-import', 0, -24, file(60, 26, 0.9, GREEN, 'table')), arr(60, 46, 60, 58, GREEN, 3),
    frame(10, 44, 100, 66, 6)),
  /** exportera (i datorn): the same laptop with a table on its screen; a blue table file rises up out of the screen along an upward arrow into a yellow folder at the top right; the folder is framed. */
  'dalg.exportera.2': all(bg(), ground, laptop(44, 100, 1.1, sheet(-18, -32, 4, 4, 9, 6)), arr(54, 46, 72, 32, BLUE, 3),
    folder(92, 26, 1.2), waIn('dalg-export', -28, 30, file(92, 22, 0.6, BLUE, 'table')), frame(68, 6, 46, 40, 5)),
  /** konvertera (fil och format): a blue text document on the left and an orange chart document on the right with the same top band; between them two round arrows turn; the new document slides out on the right and is framed. */
  'dalg.konvertera.2': all(bg(), file(24, 60, 1.35, BLUE, 'text'),
    waSpin('dalg-konv', 2.6, path('M48 52 A12 12 0 0 1 72 52', 'none', C.ink, 2.4), head(72, 52, Math.PI / 2, C.ink, 0.8), path('M72 68 A12 12 0 0 1 48 68', 'none', C.ink, 2.4), head(48, 68, -Math.PI / 2, C.ink, 0.8)),
    waIn('dalg-konv-ut', -20, 0, file(96, 60, 1.35, HL, 'chart')), frame(76, 34, 40, 52, 5)),
  /** summera (räkna ihop): a column of the digits 3, 5, 2 and 4 with a plus sign and a line under them; the sum 14 drops into place under the line and is ringed. */
  'dalg.summera': all(bg(), ...['3', '5', '2', '4'].map((d, i) => mono(66, 24 + i * 16, d, 16, C.ink, 800)), mono(38, 72, '+', 18, BLUE, 800), line('M30 82 L84 82', C.ink, 2.6),
    waIn('dalg-summa', 0, -14, mono(62, 104, '14', 20, HL, 900)), ring(62, 97, 16)),
  /** bearbeta (data): messy grey data tiles ride on a belt into a machine with a turning gear, and out on the other side come neat coloured bars in a small chart; the machine is framed. */
  'dalg.bearbeta.3': all(bg(), ground, rect(4, 86, 112, 7, '#5a6472', 3.5, C.ink, 1.3), greyed(...[[12, 78, 20], [24, 76, -25], [18, 70, 10]].map(([x, y, r], i) => g(`rotate(${r} ${x} ${y})`, tile(Number(x), Number(y), TILE[i]!)))),
    rect(36, 48, 40, 38, '#6fa0d8', 5, C.ink, 1.8), waSpin('dalg-bearb', 3, gear(56, 66, 10, '#e8edf2')), waIn('dalg-bearb-ut', -14, 0, bars(84, 84, [8, 14, 20, 26], 6, 2)),
    frame(32, 44, 48, 46, 6)),
  /** anonymisera: three ID cards with a face and name bars; on each card a black box slides over the name and the face turns into a grey shape with a question mark; the cards are framed. */
  'dalg.anonymisera': all(bg(), ...range(3).map((i) => { const y = 14 + i * 32; return all(rect(12, y, 96, 26, C.white, 3, C.ink, 1.4), circle(28, y + 13, 9, '#c3cad2', C.ink, 1.2), mono(28, y + 17, '?', 11, C.white, 900),
    moving(`dalg-anon-${i}`, `0%,10%{transform:scaleX(0)}55%,100%{transform:scaleX(1)}`, { dur: 3, delay: i * 0.3 }, rect(44, y + 6, 56, 8, '#1d2128', 1, null)), nameBar(44, y + 19, 30, '#9aa3ad', 2.4)); }),
    frame(8, 10, 104, 98, 6)),
  /** i realtid: a phone with a map and a bus route; a bus moves along the route while a red dot next to a small clock blinks; the phone is ringed. */
  'dalg.i-realtid': all(bg(), phone(60, 62, 1.3, all(rect(-17, -30, 34, 58, '#e8f0e0', 1.5, null), line('M-12 20 L-12 0 L4 -6 L4 -24', '#9aa3ad', 4), line('M-12 20 L-12 0 L4 -6 L4 -24', C.white, 1.6, '2 2'),
    moving('dalg-buss', '0%{transform:translate(0,14px)}45%{transform:translate(0,0)}100%{transform:translate(16px,-8px)}', { dur: 4 }, rect(-16, -6, 9, 6, YEL, 1.2, C.ink, 0.8)),
    waPulse('dalg-live', circle(10, 18, 3, RED, null)), circle(4, 18, 3.4, C.white, C.ink, 0.8), line('M4 18 L4 16 M4 18 L5.5 19', C.ink, 0.7))),
    oval(60, 62, 34, 52)),
  /** öppna data: an open box with an open padlock beside it; out of the box come a table, a chart and a map file along arrows to three people around it; the box is framed. */
  'dalg.öppna-data': all(bg(), ground, path('M38 70 L82 70 L82 104 L38 104 Z', '#d9a96a', C.ink, 1.6), path('M38 70 L26 58 L48 58 L60 70 M82 70 L94 58 L72 58 L60 70', '#e8c088', C.ink, 1.4),
    at(92, 92, 0.9, rect(-7, -4, 14, 12, C.gold, 2, C.ink, 1.3), path('M-4 -4 L-4 -10 C-4 -16 4 -16 4 -10', 'none', C.ink, 2)),
    file(60, 40, 0.6, GREEN, 'table'), file(36, 34, 0.55, BLUE, 'chart'), file(84, 34, 0.55, HL, 'table'), arr(52, 60, 42, 48, C.ink, 1.6), arr(68, 60, 78, 48, C.ink, 1.6), arr(60, 64, 60, 54, C.ink, 1.6),
    bust(14, 22, 0.8, C.sky), bust(60, 14, 0.75, C.green), bust(106, 22, 0.8, PURP), frame(34, 54, 52, 54, 5)),

  // ── 3847 Visualisering av data ─────────────────────────────────────
  /** tydlig: two bar charts side by side: the left one is grey and blurred with double edges; the right one has bright bars with sharp black outlines and is framed. */
  'dalg.tydlig': all(bg(), greyed(`<g opacity="0.5">${bars(10, 88, [20, 34, 26, 42], 9, 3)}</g>`, `<g opacity="0.5" transform="translate(2 1.5)">${bars(10, 88, [20, 34, 26, 42], 9, 3)}</g>`, line('M8 88 L56 88', '#7a8590', 1.2)),
    line('M64 30 L64 90 L114 90', C.ink, 2.4), bars(68, 90, [20, 34, 26, 46], 9, 3), frame(60, 24, 56, 72, 5)),
  /** visualisera (visa med bilder): a small table of digits on the left; an orange arrow points right to a bar chart whose bars rise up one by one; the chart is framed. */
  'dalg.visualisera.2': all(bg(), rect(8, 30, 40, 60, C.white, 2, C.ink, 1.4), ...['12', '30', '21', '40'].map((d, i) => all(line(`M8 ${45 + i * 15} L48 ${45 + i * 15}`, '#c3cad2', 0.8), mono(28, 41 + i * 15, d, 9, C.ink, 700))),
    arr(52, 60, 62, 60, HL, 3), line('M68 26 L68 92 L114 92', C.ink, 2.2),
    ...[12, 30, 21, 40].map((h, i) => moving(`dalg-vis-${i}`, `0%,${i * 12}%{transform:translateY(${h + 8}px);opacity:0}${30 + i * 12}%,100%{transform:translateY(0);opacity:1}`, { dur: 3 }, rect(72 + i * 10, 92 - h * 1.4, 8, h * 1.4, TILE[i]!, 1, C.ink, 1))),
    frame(64, 20, 52, 78, 5)),
  /** datapunkt: a scatter chart with about a dozen grey dots; one dot is orange and ringed, with a small value card 12 beside it. */
  'dalg.datapunkt': all(bg(), axes(18, 100, 90, 84, false), ...[[30, 86], [38, 78], [44, 82], [52, 70], [58, 74], [66, 60], [74, 64], [82, 52], [88, 56], [96, 42], [48, 60], [92, 70]].map(([x, y]) => circle(x!, y!, 3.4, '#9aa3ad', C.ink, 0.8)),
    circle(70, 38, 4.6, HL, C.ink, 1.2), ring(70, 38, 9), rect(80, 18, 22, 14, C.white, 3, C.ink, 1.2), mono(91, 28, '12', 9, C.ink, 800), line('M78 32 L74 34', C.ink, 1)),
  /** mönster (något som upprepas): a long row of small bars that repeats the same shape four times: low, low, high; a bracket marks each repeat, and one repeat is framed. */
  'dalg.mönster.2': all(bg(), line('M8 92 L112 92', C.ink, 2), ...range(12).map((i) => { const hi = i % 3 === 2; return rect(10 + i * 8.6, 92 - (hi ? 44 : 16), 6.6, hi ? 44 : 16, hi ? HL : BLUE, 1, C.ink, 0.9); }),
    ...range(4).map((k) => line(`M${10 + k * 25.8} 102 L${10 + k * 25.8} 106 L${32 + k * 25.8} 106 L${32 + k * 25.8} 102`, '#5a6472', 1.4)), frame(36, 40, 28, 56, 4)),
  /** värmekarta: a grid of 6 × 5 squares coloured from pale yellow to dark red, darkest in the middle; at the right a colour scale bar from pale to dark; the grid is framed. */
  'dalg.värmekarta': all(bg(), ...range(30).map((i) => { const r = Math.floor(i / 6), c = i % 6, d = Math.hypot(c - 2.6, r - 2) / 3.3, cols = ['#9b1b1b', '#d2402a', '#f08a3c', '#f6c56a', '#fbeab0']; return rect(10 + c * 14, 20 + r * 16, 14, 16, cols[Math.min(4, Math.floor(d * 5))]!, 0, '#fff', 0.8); }),
    ...['#fbeab0', '#f6c56a', '#f08a3c', '#d2402a', '#9b1b1b'].map((col, i) => rect(100, 96 - i * 16, 10, 16, col, 0, C.ink, 0.8)), frame(7, 17, 90, 86, 4)),
  /** färgkoda: a scatter of dots in three groups; the grey dots turn blue, green and orange group by group, and a small key at the side shows the three colours; the dots are framed. */
  'dalg.färgkoda': all(bg(), ...[[BLUE, [[22, 30], [30, 24], [28, 38], [38, 32], [20, 44]]], [GREEN, [[70, 26], [80, 34], [74, 40], [86, 24], [66, 36]]], [HL, [[40, 80], [52, 74], [46, 90], [60, 86], [34, 92]]]].map(([col, pts], k) => all(
    ...(pts as number[][]).map(([x, y]) => circle(x!, y!, 5, String(col), C.ink, 1)),
    moving(`dalg-farg-${k}`, `0%,${10 + k * 15}%{opacity:1}${40 + k * 15}%,100%{opacity:0}`, { dur: 3.4 }, ...(pts as number[][]).map(([x, y]) => circle(x!, y!, 5, '#b7bec6', C.ink, 1))))),
    rect(88, 66, 24, 40, C.white, 3, C.ink, 1.2), ...[BLUE, GREEN, HL].map((col, i) => all(rect(92, 72 + i * 11, 7, 7, col, 1, C.ink, 0.8), nameBar(101, 75.5 + i * 11, 8, '#7a8590', 2))), frame(12, 14, 80, 88, 6)),
  /** infografik: a tall poster with a big water drop and the number 70 %, a row of ten small people where seven are coloured, a small pie chart and an arrow; the poster is framed. */
  'dalg.infografik': all(bg(), rect(22, 8, 76, 104, '#fbfbf8', 3, C.ink, 1.6), path('M38 22 C44 30 46 34 46 38 C46 43 42 46 38 46 C34 46 30 43 30 38 C30 34 32 30 38 22 Z', '#5aa7d6', C.ink, 1.2), txt(72, 42, '70%', 18, BLUE, 900),
    ...range(10).map((i) => at(30 + i * 6.6, 62, 0.42, circle(0, -8, 4, i < 7 ? C.skin : '#d5dbe0', null), path('M-5 8 L-5 -2 C-5 -4 5 -4 5 -2 L5 8 Z', i < 7 ? BLUE : '#d5dbe0', null))),
    circle(42, 90, 12, '#e3e7eb', C.ink, 1.2), path('M42 90 L42 78 A12 12 0 0 1 53.4 93.7 Z', HL, C.ink, 1.2), arr(62, 96, 84, 82, GREEN, 2.6), line('M60 102 L88 102', BAR, 2.4),
    frame(18, 4, 84, 112, 5)),
  /** instrumentpanel (på skärmen): a wide screen with four tiles: a round gauge, a small line graph, a big number 98 and a small bar chart; the screen is framed. */
  'dalg.instrumentpanel.2': all(bg(), ground, rect(8, 14, 104, 72, C.dark, 4, C.ink, 1.8), rect(12, 18, 96, 64, '#f4f6f8', 2, null), rect(56, 86, 8, 14, '#9aa3ad', 0, C.ink, 1.2), rect(40, 100, 40, 5, '#9aa3ad', 2, C.ink, 1.2),
    rect(15, 21, 44, 28, C.white, 2, '#c3cad2', 0.8), path('M23 43 A14 14 0 0 1 51 43', 'none', '#e3e7eb', 5), path('M23 43 A14 14 0 0 1 45 32', 'none', GREEN, 5), line('M37 43 L45 33', C.ink, 1.6),
    rect(61, 21, 44, 28, C.white, 2, '#c3cad2', 0.8), line('M65 42 L73 36 L80 39 L88 28 L96 31 L102 25', BLUE, 2),
    rect(15, 51, 44, 28, C.white, 2, '#c3cad2', 0.8), mono(37, 71, '98', 16, HL, 900),
    rect(61, 51, 44, 28, C.white, 2, '#c3cad2', 0.8), bars(66, 76, [8, 14, 11, 19, 16], 6, 2.4), frame(5, 11, 110, 78, 6)),
  /** översikt: a map of a whole small town seen from above, with houses, roads, a river and a park, inside an orange frame; at the corner a small grey magnifier shows a single house close up. */
  'dalg.översikt': all(bg(), rect(10, 10, 100, 84, '#e8f0e0', 3, null), path('M10 70 C34 60 60 84 110 66 L110 74 C60 92 34 68 10 78 Z', '#8cc7e8', null), line('M10 40 L110 36 M44 10 L50 94 M80 10 L84 94', C.white, 4),
    ...[[24, 30], [32, 24], [62, 28], [70, 22], [96, 26], [24, 56], [64, 54], [96, 52], [30, 90], [66, 92]].map(([x, y], i) => rect(x! - 4, y! - 4, 8, 8, ['#e6c79c', '#d98c6a', '#c9d3dc'][i % 3]!, 1, C.ink, 0.8)),
    circle(92, 84, 6, '#6fae5a', null), circle(100, 88, 5, '#6fae5a', null), frame(8, 8, 104, 88, 4),
    greyed(at(100, 102, 0.55, circle(0, 0, 14, '#eef3f7', C.ink, 2), house(0, 8, 0.8), line('M10 10 L20 20', '#7a5030', 4)))),
  /** lyfta fram: a bar chart with five grey bars; the middle bar is orange, rises a little and glows, with small sparkles beside it; the orange bar is ringed. */
  'dalg.lyfta-fram': all(bg(), line('M10 96 L110 96', C.ink, 2), ...[24, 34, 0, 28, 20].map((h, i) => i === 2 ? '' : rect(14 + i * 20, 96 - h, 14, h, '#b7bec6', 1, C.ink, 1)),
    waBob('dalg-lyft', 4, rect(54, 40, 14, 56, HL, 1, C.ink, 1.4)), waPulse('dalg-lyft-glans', sparkle(76, 36, 5), sparkle(46, 30, 4)), oval(61, 66, 16, 36)),
  /** missvisande: a bar chart whose axis starts at 90 with a zigzag break, so that the right bar looks three times taller than the left; a red warning triangle stands beside it; at the bottom right the same values in a small grey honest chart, almost equal; the broken start of the axis is ringed. */
  'dalg.missvisande': all(bg(), line('M24 14 L24 64 M24 72 L24 92 L84 92', C.ink, 2.2), line('M20 64 L28 66 L20 69 L28 72', C.ink, 1.6), mono(14, 95, '90', 7, C.ink, 800), mono(14, 20, '93', 7, C.ink, 800),
    rect(34, 72, 16, 20, BLUE, 1, C.ink, 1.2), rect(58, 22, 16, 70, HL, 1, C.ink, 1.2),
    path('M96 14 L112 42 L80 42 Z', YEL, C.ink, 1.6), mono(96, 39, '!', 16, C.ink, 900),
    greyed(line('M84 104 L84 70 M84 104 L114 104', C.ink, 1.6), rect(88, 76, 9, 28, BLUE, 1, C.ink, 0.8), rect(101, 74, 9, 30, HL, 1, C.ink, 0.8)), ring(24, 78, 13)),
  /** presentera (visa och berätta): a woman stands beside a big screen with a bar chart and lifts her open hand towards it; three people sit in front with their backs to us; the bars on the screen grow, and the woman and the screen are framed. */
  'dalg.presentera.2': all(bg(), ground, rect(44, 12, 70, 48, C.dark, 3, C.ink, 1.6), rect(47, 15, 64, 42, C.white, 1, null), line('M52 52 L106 52', C.ink, 1.4),
    ...[14, 24, 18, 32].map((h, i) => waIn(`dalg-pres-${i}`, 0, 8, rect(58 + i * 12, 52 - h, 8, h, TILE[i]!, 1, C.ink, 0.9))),
    person(26, C.orange, { hairStyle: 'long', h: 0.82 }), arm(36, 62, 46, 46), circle(47, 44, 3.2, C.skin, C.ink, 1.2),
    ...[56, 78, 100].map((x, i) => all(path(`M${x - 9} 112 C${x - 9} 98 ${x + 9} 98 ${x + 9} 112 Z`, [C.sky, GREEN, PURP][i]!, C.ink, 1.2), circle(x, 92, 6, C.hair, C.ink, 1.2))),
    frame(8, 8, 108, 72, 6)),
};
