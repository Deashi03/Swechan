/**
 * Teknik & digital värld → Programmering & artificiell intelligens → Programmeringens grunder, 3811–3817 (0.56):
 * variables and data types, conditions, loops, functions and parameters, lists and objects, errors and exceptions,
 * comments and documentation.
 * Recurring signs: code is a dark editor window with coloured bars (never real words); a variable is an open box
 * with a grey name tag; a function is a machine with a gear, values go in on the left and come out on the right;
 * a list is a column of cells inside square brackets; the part the word names is ringed or framed in orange, and grey
 * copies show what the word is not.
 * Close words share one layout where only the marked part differs: kod/kodrad (the whole editor, or one line);
 * variabel/värde (the box, or what lies in it); funktion/parameter/utdata (the whole machine, the input slots on top,
 * or what comes out); anropa/returnera (an orange call goes from the code to the machine, or a green value comes back);
 * element/index (one cell lifted out, or the small number tags); klass/objekt (the cookie cutter, or one finished
 * cookie); sann/falsk (a green tick, or a red cross); syntaxfel/logiskt fel (a red wavy line under the code, or a
 * wrong answer from a program that runs).
 * Digits and code signs ({ } [ ] ( ) = > < + // ' and ✓ ✗) only; no words, no brands, no logos, no pointing fingers.
 */
import { C, all, circle, ellipse, g, line, moving, path, rect, waBob, waGrow, waIn, waPulse, waShake, waSpin, waSway, type Svg } from './kit';
import { HL, arm, bolt } from './people';
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
const BAR = '#c3cad2';
const KW = '#c792ea';
const STR = '#a5d672';
const NUM = '#f6b26b';
const ID = '#82aaff';
const TXT = '#cfd8e3';
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
const carr = (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, col: string = HL, sw = 2.4, dash?: string) => all(line(`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`, col, sw, dash), head(x2, y2, Math.atan2(y2 - cy, x2 - cx), col, sw / 3 + 0.3));
const ok = (x: number, y: number, r = 7) => all(circle(x, y, r, GREEN, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, r * 0.25));
const no = (x: number, y: number, r = 7) => all(circle(x, y, r, RED, C.ink, 1.2), line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, C.white, r * 0.25));
const txt = (x: number, y: number, s: string, size: number, col: string = C.ink, w = 800, family = 'system-ui,sans-serif') =>
  `<text x="${x}" y="${y}" font-family="${family}" font-weight="${w}" font-size="${size}" text-anchor="middle" fill="${col}">${s}</text>`;
const mono = (x: number, y: number, s: string, size: number, col: string = C.ink, w = 700) => txt(x, y, s, size, col, w, 'DejaVu Sans Mono,Menlo,Consolas,monospace');
const bars = (x: number, y: number, w: number, n: number, gap = 5, col: string = BAR, sw = 1.8) => all(...range(n).map((i) => line(`M${x} ${y + i * gap} L${f1(x + w - ((i * 7) % 4) * w * 0.08 - (i === n - 1 ? w * 0.3 : 0))} ${y + i * gap}`, col, sw)));
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };
const person = (x: number, top: string = C.green, more: Build = {}) => figure({ x, top, ...more });

// ── Code editor ──────────────────────────────────────────────────────
type CL = [number, number, string];
/** Dark editor window with three dots in its top bar. */
const editor = (x: number, y: number, w: number, h: number, ...inner: Svg[]) => all(rect(x, y, w, h, ED, 4, C.ink, 1.6), rect(x, y, w, 9, ED2, 4, null), rect(x, y + 5, w, 4, ED2, 0, null),
  circle(x + 6, y + 4.5, 1.6, '#ff6b5e', null), circle(x + 11, y + 4.5, 1.6, YEL, null), circle(x + 16, y + 4.5, 1.6, '#5ac85a', null), ...inner);
/** Code lines as coloured bars: [indent, length, colour]. */
const code = (x: number, y: number, ls: CL[], gap = 8, sw = 3) => all(...ls.map(([ind, len, col], i) => line(`M${x + ind} ${y + i * gap} L${x + ind + len} ${y + i * gap}`, col, sw)));
const SAMPLE: CL[] = [[0, 14, KW], [0, 30, ID], [6, 24, STR], [6, 34, TXT], [6, 18, NUM], [0, 10, KW], [6, 28, ID], [6, 20, TXT]];
/** Line numbers as small grey digits. */
const nums = (x: number, y: number, n: number, gap = 8) => all(...range(n).map((i) => mono(x, y + i * gap + 2.2, String(i + 1), 5.5, '#6b7788', 600)));
const laptop = (x: number, y: number, s = 1, inner: Svg = '') => at(x, y, s, rect(-30, -40, 60, 40, C.dark, 3, C.ink, 1.8), rect(-26, -36, 52, 32, ED, 1, null), inner, path('M-36 0 L36 0 L40 6 L-40 6 Z', '#9aa3ad', C.ink, 1.6));
const desk = (y = 86) => all(rect(4, y, 112, 6, '#c8a070', 1, C.ink, 1.4), line(`M12 ${y + 6} L12 112 M108 ${y + 6} L108 112`, '#a0673d', 3));
const phone = (x: number, y: number, s = 1, inner: Svg = '') => at(x, y, s, rect(-14, -24, 28, 48, C.dark, 4, C.ink, 1.6), rect(-11.5, -19, 23, 37, '#fbfbf8', 1.4, null), inner);

// ── Boxes, machines, lists ───────────────────────────────────────────
/** An open box (a variable) with a grey name tag on a string. */
const box = (x: number, y: number, w = 40, h = 28, col = '#d9a96a', tag = true) => all(
  path(`M${x} ${y} L${x + w} ${y} L${x + w - 3} ${y + h} L${x + 3} ${y + h} Z`, col, C.ink, 1.6),
  path(`M${x} ${y} L${x + 6} ${y - 7} L${x + w - 6} ${y - 7} L${x + w} ${y}`, '#b9864a', C.ink, 1.4),
  tag ? all(line(`M${x + 3} ${y + 6} L${x - 6} ${y + 12}`, C.ink, 1), rect(x - 20, y + 9, 16, 10, '#f4f6f8', 2, C.ink, 1.2), line(`M${x - 17} ${y + 14} L${x - 7} ${y + 14}`, '#7a8590', 2.2)) : '');
/** A gear wheel. */
const gear = (x: number, y: number, r: number, col: string = '#9aa3ad') => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return rect(f1(x + Math.cos(a) * r - 2.2), f1(y + Math.sin(a) * r - 2.2), 4.4, 4.4, col, 1, C.ink, 0.8); }),
  circle(x, y, r, col, C.ink, 1.2), circle(x, y, f1(r * 0.38), '#eef3f7', C.ink, 1));
/** A function machine with a gear, a funnel on the left and a chute on the right. */
const machine = (x: number, y: number, col = '#6fa0d8', spin = '') => all(
  path(`M${x - 34} ${y - 12} L${x - 22} ${y - 6} L${x - 22} ${y + 6} L${x - 34} ${y + 12} Z`, '#b7c3d0', C.ink, 1.4),
  path(`M${x + 22} ${y - 6} L${x + 34} ${y - 10} L${x + 34} ${y + 10} L${x + 22} ${y + 6} Z`, '#b7c3d0', C.ink, 1.4),
  rect(x - 22, y - 20, 44, 40, col, 6, C.ink, 1.8), spin ? waSpin(spin, 4, gear(x, y, 9, '#e8edf2')) : gear(x, y, 9, '#e8edf2'));
/** A tile with a value in it. */
const chip = (x: number, y: number, s: string, col = '#fff3e0', size = 10) => all(rect(x - 8, y - 7, 16, 14, col, 3, C.ink, 1.2), mono(x, y + size * 0.36, s, size, C.ink, 800));
/** A list: a column of cells inside square brackets. */
const LIST = { x: 46, y: 22, w: 34, h: 15 };
const cells = (vals: Svg[], x = LIST.x, y = LIST.y, w = LIST.w, h = LIST.h) => all(
  ...vals.map((v, i) => all(rect(x, y + i * h, w, h, C.white, 0, C.ink, 1.2), v)),
  line(`M${x - 4} ${y - 2} L${x - 8} ${y - 2} L${x - 8} ${y + vals.length * h + 2} L${x - 4} ${y + vals.length * h + 2}`, C.ink, 2),
  line(`M${x + w + 4} ${y - 2} L${x + w + 8} ${y - 2} L${x + w + 8} ${y + vals.length * h + 2} L${x + w + 4} ${y + vals.length * h + 2}`, C.ink, 2));
const nameBar = (x: number, y: number, w: number, col = '#5a6472') => line(`M${x} ${y} L${x + w} ${y}`, col, 3);
const LISTVALS = (y = LIST.y, h = LIST.h) => [nameBar(52, y + h * 0.5, 20), nameBar(52, y + h * 1.5, 14, BLUE), nameBar(52, y + h * 2.5, 22, GREEN), nameBar(52, y + h * 3.5, 16, '#a0673d'), nameBar(52, y + h * 4.5, 18, '#8a6bbf')];
/** A star cookie and a star cookie cutter. */
const starPts = (x: number, y: number, r: number) => { const p: string[] = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5; const rr = i % 2 ? r * 0.48 : r; p.push(`${f1(x + rr * Math.cos(a))} ${f1(y + rr * Math.sin(a))}`); } return `M${p.join(' L')} Z`; };
const cookie = (x: number, y: number, r: number, icing = '', col = '#e0b070') => all(path(starPts(x, y, r), col, C.ink, 1.4), icing);
const cutter = (x: number, y: number, r: number) => all(path(starPts(x, y, r), 'none', '#8a939d', 5), path(starPts(x, y, r), 'none', '#d5dbe0', 2.6), path(`M${f1(x - r * 0.5)} ${f1(y - r - 6)} L${f1(x + r * 0.5)} ${f1(y - r - 6)}`, 'none', '#8a939d', 3));
/** A card with a statement such as 5 > 3. */
const card = (x: number, y: number, s: string, w = 50) => all(rect(x - w / 2, y - 13, w, 26, C.white, 4, C.ink, 1.5), mono(x, y + 5, s, 14, C.ink, 800));
/** Hourglass. */
const hourglass = (x: number, y: number, s = 1) => at(x, y, s, rect(-12, -22, 24, 4, '#a0673d', 1, C.ink, 1.2), rect(-12, 18, 24, 4, '#a0673d', 1, C.ink, 1.2),
  path('M-9 -18 L9 -18 L1 0 L9 18 L-9 18 L-1 0 Z', 'rgba(220,240,252,0.7)', C.ink, 1.4), path('M-6 -12 L6 -12 L1 -1 L-1 -1 Z', YEL, null), path('M-7 17 L7 17 L0 9 Z', YEL, null), line('M0 0 L0 9', '#d9a520', 1));
/** A small robot arm on a stand. */
const robotArm = (x: number, y: number) => all(rect(x - 10, y - 6, 20, 6, '#5a6472', 1, C.ink, 1.2), rect(x - 3, y - 26, 6, 20, '#f2a03c', 2, C.ink, 1.2), circle(x, y - 26, 4, '#5a6472', C.ink, 1));
/** A small bug. */
const bug = (x: number, y: number, s = 1) => at(x, y, s, line('M-6 -3 L-10 -6 M-6 1 L-11 1 M-6 4 L-10 7 M6 -3 L10 -6 M6 1 L11 1 M6 4 L10 7 M-2 -7 L-4 -11 M2 -7 L4 -11', C.ink, 1.1), ellipse(0, 1, 6, 7, RED, C.ink, 1.1), circle(0, -6, 3.4, C.dark, null), line('M0 -5 L0 8', C.ink, 0.8));
/** Conveyor belt. */
const belt = (x: number, y: number, w: number) => all(rect(x, y, w, 7, '#5a6472', 3.5, C.ink, 1.4), ...range(Math.floor(w / 12)).map((i) => circle(x + 6 + i * 12, y + 3.5, 2, '#9aa3ad', null)));
const crate = (x: number, y: number, col = '#d9a96a') => all(rect(x - 7, y - 12, 14, 12, col, 1, C.ink, 1.1), line(`M${x - 7} ${y - 8} L${x + 7} ${y - 8}`, '#a0673d', 1));
const wrench = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-3 -2 L18 -2 L18 2 L-3 2 Z', '#9aa3ad', C.ink, 1.2), path('M-10 -7 C-14 -3 -14 3 -10 7 L-7 4 L-7 -4 Z M-10 -7 L-4 -7 L-4 7 L-10 7', '#9aa3ad', C.ink, 1.2));
const magnifier = (x: number, y: number, r = 9) => all(line(`M${f1(x + r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r * 1.6)} ${f1(y + r * 1.6)}`, '#7a5030', 3.6), circle(x, y, r, 'rgba(220,240,252,0.55)', C.ink, 1.8));
const calendar = (x: number, y: number, s = 1) => at(x, y, s, rect(-14, -12, 28, 26, C.white, 2, C.ink, 1.2), rect(-14, -12, 28, 6, RED, 2, null), ...range(8).map((i) => ok(-8 + (i % 4) * 5.3, -1 + Math.floor(i / 4) * 7, 2.2)));
const umbrella = (x: number, y: number, s = 1, col = BLUE) => at(x, y, s, path('M-14 0 C-12 -12 12 -12 14 0 Z', col, C.ink, 1.3), line('M0 0 L0 14 C0 17 -4 17 -4 14', C.ink, 1.4));
const rain = (x: number, y: number, w: number) => all(...range(Math.floor(w / 6)).map((i) => line(`M${x + i * 6} ${y + (i % 2) * 4} l-2 5`, '#5aa7d6', 1.6)));
const cloudy = (x: number, y: number, s = 1, fill = '#9aa3ad') => at(x, y, s, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', fill, C.ink, 1.3));
const lunchbox = (x: number, y: number, s = 1) => at(x, y, s, rect(-10, -6, 20, 13, '#e2553a', 3, C.ink, 1.3), rect(-10, -6, 20, 4, '#f08a6a', 2, null), path('M-5 -6 C-5 -11 5 -11 5 -6', 'none', C.ink, 1.3));
const backpack = (x: number, y: number) => all(rect(x - 7, y - 10, 14, 18, '#3a6ab0', 3, C.ink, 1.3), rect(x - 5, y - 2, 10, 6, '#5a8ad0', 1.5, C.ink, 1));

export const PROG_MOTIFS: Record<string, Svg> = {
  // ── 3811 Variabler och datatyper ───────────────────────────────────
  /** programmering (ämnet): a shelf of four school books standing side by side, each with a subject sign on its spine: plus and minus, the letters Aa, a music note and curly braces; the first three are grey and the book with { } is bright and ringed; below, a strip without people shows the work: a light bulb, an arrow, a code window, an arrow, a phone with an app. */
  'prog.programmering': all(bg(), rect(8, 62, 104, 4, '#a0673d', 1, C.ink, 1.2),
    greyed(rect(14, 18, 18, 44, '#d96a5a', 2, C.ink, 1.4), txt(23, 44, '+−', 10, C.white, 900), rect(36, 22, 18, 40, '#5a8ad0', 2, C.ink, 1.4), txt(45, 46, 'Aa', 9, C.white, 900), rect(58, 16, 18, 46, '#6aa86a', 2, C.ink, 1.4), path('M64 46 L64 34 L71 32 L71 44', 'none', C.white, 1.6), circle(62.5, 46, 2, C.white, null), circle(69.5, 44, 2, C.white, null)),
    rect(82, 12, 24, 50, ED, 2, C.ink, 1.6), mono(94, 44, '{}', 12, KW, 800), line('M86 22 L102 22 M86 54 L102 54', STR, 2), ring(94, 37, 20),
    circle(18, 92, 7, YEL, C.ink, 1.2), rect(15, 99, 6, 4, '#9aa3ad', 1, C.ink, 1), arr(28, 94, 40, 94, C.dark, 1.8), editor(44, 80, 30, 26, code(48, 94, [[0, 12, KW], [3, 16, ID], [3, 10, STR]], 4, 1.8)), arr(78, 94, 88, 94, C.dark, 1.8),
    phone(100, 94, 0.5, all(...range(4).map((k) => rect(-8 + (k % 2) * 9, -12 + Math.floor(k / 2) * 9, 7, 7, [BLUE, GREEN, YEL, RED][k]!, 1.5, null))))),
  /** programmeringsspråk: three speech bubbles, each with code in its own sign system: curly braces, angle brackets with a slash, and round brackets; all three bubbles together are framed. */
  'prog.programmeringsspråk': all(bg(),
    path('M8 14 L58 14 L58 46 L22 46 L14 54 L16 46 L8 46 Z', ED, C.ink, 1.4), mono(20, 36, '{', 16, KW), code(26, 25, [[0, 16, ID], [4, 14, STR], [0, 12, NUM]], 6, 2.4), mono(52, 42, '}', 12, KW),
    path('M62 30 L112 30 L112 62 L104 62 L106 70 L98 62 L62 62 Z', '#fbfbf8', C.ink, 1.4), mono(87, 46, '&lt;/&gt;', 13, BLUE), line('M70 54 L104 54', BAR, 2.4),
    path('M20 70 L76 70 L76 102 L40 102 L32 110 L34 102 L20 102 Z', '#fff4dc', C.ink, 1.4), mono(30, 92, '(', 16, '#a0673d'), code(36, 81, [[0, 18, '#a0673d'], [6, 12, GREEN], [0, 20, '#8a6bbf']], 6, 2.4), mono(66, 92, ')', 16, '#a0673d'),
    frame(5, 10, 110, 102, 8)),
  /** kod (i ett program): a big editor window full of coloured code bars with line numbers, braces and an equals sign; the whole code area is framed. */
  'prog.kod.3': all(bg(), editor(10, 12, 100, 92, nums(17, 28, 8, 9), code(26, 28, SAMPLE, 9), mono(80, 30, '{', 9, KW), mono(86, 57, '=', 9, TXT), mono(50, 84, '}', 9, KW)), frame(6, 8, 108, 100, 7)),
  /** koda: two hands type on a keyboard under a screen; on the screen a new line of code grows out from a blinking cursor while the older lines stay; the new line is ringed. */
  'prog.koda': all(bg(), editor(14, 10, 92, 62, code(22, 28, [[0, 18, KW], [6, 30, ID], [6, 24, STR]], 9),
    moving('pg-koda-rad', '0%{transform:scaleX(0)}60%,100%{transform:scaleX(1)}', { dur: 2.4 }, line('M28 55 L70 55', NUM, 3)), waPulse('pg-koda-mark', rect(72, 51, 2, 8, C.white, 0, null))),
    rect(16, 82, 88, 22, '#c9ced4', 4, C.ink, 1.6), ...range(14).map((i) => rect(20 + (i % 7) * 12, 85 + Math.floor(i / 7) * 9, 9, 6, C.white, 1, C.ink, 0.8)),
    waBob('pg-koda-v', 2, ellipse(40, 88, 9, 6, C.skin, C.ink, 1.2)), moving('pg-koda-h', '0%,100%{transform:translate(0,0)}50%{transform:translate(0,-2px)}', { dur: 2.2, delay: 1.1 }, ellipse(80, 88, 9, 6, C.skin, C.ink, 1.2)),
    oval(50, 55, 30, 8)),
  /** kodrad: the same editor window, all grey except one single line, which is white with a thick orange frame. */
  'prog.kodrad': all(bg(), greyed(editor(10, 12, 100, 92, nums(17, 28, 8, 9), code(26, 28, SAMPLE, 9))), rect(12, 50, 96, 11, '#fbfbf8', 2, null), mono(17, 58, '4', 6, '#6b7788'), line('M32 55.5 L66 55.5', BLUE, 3.4), mono(74, 59, '=', 9, C.ink), line('M80 55.5 L96 55.5', NUM, 3.4), frame(10, 48, 100, 15, 3)),
  /** variabel (i programmering): an open brown box with a grey name tag on a string; the digit 42 lies in it, and a grey 7 flies out of it along an arrow to show that the value can change; the box is framed. */
  'prog.variabel.3': all(bg(), ground, box(46, 60, 50, 40), chip(71, 56, '42', '#fff3e0', 11), waIn('pg-var-ut', -14, 14, greyed(chip(100, 22, '7'))), carr(74, 44, 82, 26, 92, 24, C.grey, 1.6, '3 2'), frame(22, 44, 80, 62, 8)),
  /** värde (i programmering): the same box with its tag, but grey; only the digit 42 in it is bright and ringed. */
  'prog.värde.3': all(bg(), ground, greyed(box(46, 60, 50, 40)), chip(71, 52, '42', '#fff3e0', 14), ring(71, 52, 16)),
  /** datatyp: a shape-sorter board with three different holes: a round hole marked 42, a square hole marked with quote signs and a grey bar, and a hole marked with a tick and a cross; above it, a round tile with 7 drops into the round hole along an arrow; the three holes are framed. */
  'prog.datatyp': all(bg(), rect(10, 66, 100, 36, '#c8a070', 4, C.ink, 1.6),
    circle(28, 84, 11, '#7a5030', C.ink, 1.2), mono(28, 88, '42', 9, C.white), rect(48, 73, 24, 22, '#7a5030', 2, C.ink, 1.2), mono(54, 88, "'", 12, C.white), line('M57 84 L64 84', C.white, 2.2), mono(67, 88, "'", 12, C.white),
    path('M86 74 L102 84 L86 94 Z', '#7a5030', C.ink, 1.2), ok(94, 76, 4), no(94, 92, 4),
    waIn('pg-datatyp', 0, -18, circle(28, 40, 10, NUM, C.ink, 1.4), mono(28, 44, '7', 11, C.ink)), arr(28, 52, 28, 64, HL, 2.4), frame(12, 68, 96, 32, 4)),
  /** decimaltal: the big digits 3,5 with the comma part ringed; under it a number line from 3 to 4 with an orange mark halfway; a grey 3 stands to the side. */
  'prog.decimaltal': all(bg(), txt(62, 52, '3,5', 38, C.ink, 800), oval(74, 40, 18, 18), greyed(txt(16, 46, '3', 18, C.ink, 800)),
    line('M16 86 L104 86', C.ink, 2), ...[16, 60, 104].map((x) => line(`M${x} 81 L${x} 91`, C.ink, 2)), mono(16, 102, '3', 9, C.dark), mono(104, 102, '4', 9, C.dark), circle(60, 86, 5, HL, C.ink, 1.2), line('M60 70 L60 80', HL, 2)),
  /** sträng (i programmering): letter tiles strung on a thread like beads, between two big quote signs; the whole thread with its quote signs is ringed. */
  'prog.sträng-noun.2': all(bg(), mono(12, 66, "'", 30, HL), mono(108, 66, "'", 30, HL), line('M18 56 L102 56', '#7a5030', 1.6),
    ...['K', 'e', 'n', 'j', 'i'].map((ch, i) => all(rect(24 + i * 15, 47, 13, 18, ['#fff3e0', '#e4f1fb', '#eaf6e4', '#fdeaea', '#f1eafb'][i]!, 3, C.ink, 1.2), mono(30.5 + i * 15, 61, ch, 12, C.ink))),
    oval(60, 56, 54, 20)),
  /** tecken (i en text): six separate square tiles in two rows, each with one sign: a letter, a digit, @, !, ? and an empty space; one tile (@) is lifted out, big and ringed. */
  'prog.tecken.3': all(bg(), ...[['A', 18, 84], ['7', 40, 84], ['!', 62, 84], ['?', 84, 84], ['', 106, 84]].map(([ch, x, y]) => greyed(all(rect(Number(x) - 9, Number(y) - 10, 18, 20, C.white, 3, C.ink, 1.2), mono(Number(x), Number(y) + 5, String(ch), 13, C.ink)))),
    line('M101 88 L101 90 L111 90 L111 88', C.ink, 1.2), waBob('pg-tecken', 3, rect(46, 18, 28, 32, C.white, 4, C.ink, 1.6), mono(60, 42, '@', 22, C.ink)), ring(60, 34, 22)),

  // ── 3812 Villkor och jämförelser ───────────────────────────────────
  /** villkorssats: a small flow chart in a frame: a yellow diamond with x > 5 in it; a green arrow with a tick goes down-left to a green box, and a red arrow with a cross goes down-right to a red box. */
  'prog.villkorssats': all(bg(), path('M60 12 L90 36 L60 60 L30 36 Z', '#fde9a8', C.ink, 1.6), mono(60, 40, 'x&gt;5', 11, C.ink),
    arr(42, 50, 28, 74, GREEN, 2.6), ok(26, 60, 5), arr(78, 50, 92, 74, RED, 2.6), no(96, 60, 5),
    rect(8, 78, 40, 22, '#dff1e4', 4, C.ink, 1.4), bars(14, 86, 28, 2, 6, GREEN, 2.2), rect(72, 78, 40, 22, '#fde3dd', 4, C.ink, 1.4), bars(78, 86, 28, 2, 6, RED, 2.2), frame(5, 8, 110, 98, 8)),
  /** annars: a path splits at a signpost with a question mark: the upper branch (grey, with a tick) leads to a dry person with an umbrella; the lower branch is orange, has a cross and leads to a person standing wet in the rain; the lower branch and the wet person are ringed. */
  'prog.annars': all(bg(), circle(14, 60, 7, '#fde9a8', C.ink, 1.3), txt(14, 64, '?', 10, C.ink), greyed(carr(20, 56, 40, 28, 64, 28, GREEN, 2.4), ok(40, 30, 5), at(88, 40, 0.85, umbrella(0, -24, 1.4), circle(0, -8, 6, C.skin, C.ink, 1.2), rect(-7, -2, 14, 18, C.green, 3, C.ink, 1.2))),
    carr(20, 64, 40, 92, 64, 92, HL, 3), no(40, 90, 5), cloudy(88, 64, 0.8), rain(78, 72, 22), at(88, 102, 0.85, circle(0, -16, 6, C.skin, C.ink, 1.2), rect(-7, -10, 14, 18, C.sky, 3, C.ink, 1.2), path('M-3 -18 l-1 3 M3 -19 l1 3', 'none', '#5aa7d6', 1.4)),
    ring(84, 86, 22)),
  /** sann: a big white card with 5 > 3 and a big green tick on it; behind it, small and grey, a card with 2 > 7 and a red cross. */
  'prog.sann': all(bg(), greyed(card(88, 26, '2&gt;7', 36), no(102, 18, 5)), card(52, 66, '5&gt;3', 64), waGrow('pg-sann', ok(52, 96, 12)), ring(52, 80, 36)),
  /** falsk: a big white card with 2 > 7 and a big red cross on it; behind it, small and grey, a card with 5 > 3 and a green tick. */
  'prog.falsk': all(bg(), greyed(card(88, 26, '5&gt;3', 36), ok(102, 18, 5)), card(52, 66, '2&gt;7', 64), waShake('pg-falsk', no(52, 96, 12)), ring(52, 80, 36)),

  // ── 3813 Loopar och iteration ──────────────────────────────────────
  /** loop (i ett program): a short block of code bars in an editor; a thick orange arrow goes from the bottom of the block round the right side and back up to the top, and a small dot runs along it again and again. */
  'prog.loop.2': all(bg(), editor(10, 24, 64, 66, code(20, 44, [[0, 30, KW], [6, 26, ID], [6, 34, STR], [6, 22, NUM]], 10)),
    path('M76 78 C110 78 110 36 76 36', 'none', HL, 4), head(76, 36, Math.PI, HL, 1.6), line('M14 40 L14 82', HL, 1.6, '2 2'),
    moving('pg-loop-dot', '0%{transform:translate(0,0)}25%{transform:translate(22px,-8px)}50%{transform:translate(26px,-21px)}75%{transform:translate(18px,-36px)}100%{transform:translate(0,-42px)}', { dur: 2 }, circle(78, 78, 4, YEL, C.ink, 1.2))),
  /** iteration (i programmering): a row of three identical round arrows with the small digits 1, 2 and 3 in them; the first and last are grey and the middle one is orange and ringed: one round of many. */
  'prog.iteration.2': all(bg(), ...[[22, '1', true], [60, '2', false], [98, '3', true]].map(([x, d, grey]) => { const X = Number(x); const k = all(path(`M${X + 12} ${f1(58 - 6)} A13 13 0 1 0 ${X + 6} ${f1(58 + 11)}`, 'none', grey ? C.grey : HL, 3.4), head(X + 6, 69, 2.6, grey ? C.grey : HL, 1.2), mono(X, 63, String(d), 13, C.ink)); return grey ? greyed(k) : k; }),
    line('M8 90 L112 90', C.grey2, 2, '4 3'), ring(60, 58, 22)),
  /** köra (ett program): a code window with a big green play button being pressed; next to it a gear turns and a bar fills up, and a small window with a tick appears; the play button is ringed. */
  'prog.köra.3': all(bg(), editor(8, 14, 64, 60, code(16, 32, [[0, 20, KW], [6, 30, ID], [6, 24, STR], [0, 14, KW]], 9)),
    circle(40, 92, 12, GREEN, C.ink, 1.6), path('M36 85 L48 92 L36 99 Z', C.white, null), waSpin('pg-kora-kugge', 3, gear(92, 34, 11)),
    rect(78, 56, 30, 7, '#e3e7eb', 3, C.ink, 1), moving('pg-kora-bar', '0%{transform:scaleX(0)}70%,100%{transform:scaleX(1)}', { dur: 2.6 }, rect(78, 56, 30, 7, GREEN, 3, null)), waGrow('pg-kora-ok', ok(93, 84, 8)), ring(40, 92, 16)),
  /** räknare (som räknar antal): a hand tally counter with a display showing 05 and a big button on top; next to it, tally marks in groups; an orange +1 floats up from the button. */
  'prog.räknare.2': all(bg(), circle(54, 66, 30, '#c0c6cc', C.ink, 1.8), rect(36, 56, 36, 18, '#2b2f38', 3, C.ink, 1.2), mono(54, 70, '05', 14, '#7dffa0'), rect(48, 24, 12, 10, '#9aa3ad', 2, C.ink, 1.4), path('M78 52 C92 50 92 74 78 76', 'none', C.ink, 2.4),
    waIn('pg-raknare', 0, 10, txt(66, 20, '+1', 12, HL, 900)), line('M92 92 L92 106 M96 92 L96 106 M100 92 L100 106 M104 92 L104 106 M90 104 L106 94', C.dark, 1.6), ring(54, 66, 34)),
  /** så länge (som): an hourglass with sand running; next to it a round orange arrow keeps turning, and both are joined by a bracket: the turning goes on while sand is left; a grey still arrow beside an empty hourglass shows the end. */
  'prog.så-länge': all(bg(), hourglass(34, 54, 1.4), waSpin('pg-salange', 2.4, path('M86 40 A16 16 0 1 1 74 50', 'none', HL, 4), head(74, 50, 2.3, HL, 1.4)), line('M30 92 L30 100 L90 100 L90 92', HL, 2),
    moving('pg-salange-sand', '0%{transform:translate(0,0);opacity:1}100%{transform:translate(0,8px);opacity:0}', { dur: 1.2 }, circle(34, 56, 1.3, YEL, null)), frame(10, 14, 100, 92, 8)),
  /** repetitiv: a grey man stands behind a conveyor belt and reaches for box after box; a long row of identical boxes, each with the same orange stamp, stretches from the left to the right; the row of identical boxes is framed. */
  'prog.repetitiv': all(bg(), ground, person(60, '#8a93a0', { h: 0.62, face: 'neutral' }), reach(60, 0.62, 1, 70, 72), belt(4, 80, 112), ...range(7).map((i) => all(crate(12 + i * 16, 80), circle(12 + i * 16, 74, 2.4, HL, null))),
    frame(4, 62, 112, 28, 4)),
  /** automatisera: an orange robot arm moves up and down and stamps boxes on a moving conveyor belt; a woman sits relaxed beside it with a cup; the robot arm is ringed. */
  'prog.automatisera': all(bg(), ground, belt(4, 80, 84), moving('pg-auto-lador', '0%{transform:translate(-16px,0)}100%{transform:translate(0,0)}', { dur: 1.6 }, ...range(5).map((i) => crate(14 + i * 16, 80))),
    robotArm(46, 50), waBob('pg-auto-arm', 6, rect(42, 24, 8, 26, '#f2a03c', 2, C.ink, 1.2), rect(39, 48, 14, 6, '#5a6472', 1, C.ink, 1)), rect(36, 14, 20, 10, '#5a6472', 2, C.ink, 1.2),
    person(102, C.orange, { hairStyle: 'long', h: 0.6 }), rect(90, 90, 12, 8, C.white, 2, C.ink, 1), ring(46, 40, 20)),

  // ── 3814 Funktioner och parametrar ─────────────────────────────────
  /** funktion (i programmering): a blue machine with a gear; the tile 3 goes into its funnel on the left and the tile 9 comes out of its chute on the right; the whole machine is framed. */
  'prog.funktion.3': all(bg(), machine(60, 62), chip(14, 62, '3'), arr(22, 62, 26, 62, C.dark, 2), chip(106, 62, '9'), arr(94, 62, 98, 62, C.dark, 2), frame(22, 36, 76, 52, 8)),
  /** parameter (i programmering): the same machine, grey, with two slots on its top; the tiles 2 and 5 drop into the slots along orange arrows; the two slots are ringed. */
  'prog.parameter.2': all(bg(), greyed(machine(60, 74)), rect(44, 50, 12, 6, '#2b2f38', 1, C.ink, 1.2), rect(64, 50, 12, 6, '#2b2f38', 1, C.ink, 1.2),
    waIn('pg-param', 0, -12, chip(50, 22, '2'), chip(70, 22, '5')), arr(50, 31, 50, 46, HL, 2.4), arr(70, 31, 70, 46, HL, 2.4), oval(60, 40, 26, 22)),
  /** anropa (en funktion): on the left a code window with one bright line that ends in ( ); an orange dashed arrow goes from that line to the machine on the right, and the machine lights up and its gear starts turning; the arrow is ringed. */
  'prog.anropa.2': all(bg(), editor(4, 30, 50, 52, greyed(code(10, 48, [[0, 20, KW], [0, 30, ID]], 9)), line('M10 66 L28 66', NUM, 3), mono(38, 69.5, '()', 9, C.white)),
    waPulse('pg-anropa-ljus', circle(90, 56, 22, '#ffe9b0', null)), at(90, 56, 0.75, machine(0, 0, '#6fa0d8', 'pg-anropa-kugge')), waIn('pg-anropa-pil', -16, 0, arr(48, 66, 64, 58, HL, 3, '4 3')), ring(56, 62, 12)),
  /** skicka med: a mother at the door hands a red lunch box to her son, who has a backpack and is going out; the lunch box moves from her hands to his; the lunch box is ringed. */
  'prog.skicka-med': all(bg(), ground, rect(6, 28, 26, 84, '#c8a070', 2, C.ink, 1.6), circle(26, 72, 1.8, C.ink, null),
    person(44, C.orange, { hairStyle: 'long', h: 0.92 }), reach(44, 0.92, 1, 62, 74), person(88, C.sky, { h: 0.6 }), backpack(100, 88), reach(88, 0.6, -1, 72, 80),
    moving('pg-skicka', '0%,15%{transform:translate(-8px,-4px)}70%,100%{transform:translate(0,0)}', { dur: 2.6 }, lunchbox(68, 80, 0.9)), ring(68, 80, 13)),
  /** returnera (i programmering): the same code window and machine; a green tile 9 travels back from the machine's chute along a green arrow into the empty ( ) at the end of the code line; the tile is ringed. */
  'prog.returnera.2': all(bg(), editor(4, 30, 54, 52, greyed(code(10, 48, [[0, 20, KW], [0, 30, ID]], 9)), line('M10 66 L22 66', NUM, 3), mono(28, 69.5, '(', 10, C.white), mono(52, 69.5, ')', 10, C.white)),
    greyed(at(90, 50, 0.75, machine(0, 0))), carr(108, 62, 100, 100, 50, 78, GREEN, 3), moving('pg-retur', '0%{transform:translate(64px,-8px)}60%,100%{transform:translate(0,0)}', { dur: 2.6 }, chip(40, 66, '9', '#dff1e4')), ring(40, 66, 13)),
  /** utdata: the machine, grey, takes in a grey tile on the left; on the right a white sheet with a bar chart and a list comes out of its chute; the sheet is ringed. */
  'prog.utdata': all(bg(), greyed(machine(46, 60), chip(8, 60, '3')),
    waIn('pg-utdata', -14, 0, rect(84, 42, 28, 36, C.white, 2, C.ink, 1.4), rect(88, 60, 5, 12, BLUE, 0, null), rect(95, 54, 5, 18, GREEN, 0, null), rect(102, 64, 5, 8, HL, 0, null), bars(88, 48, 20, 2, 4, BAR, 1.4)), ring(98, 60, 22)),
  /** inbyggd (finns från början): a phone seen from the back with its camera lens drawn inside the case and ringed; next to it, small and grey, a separate camera on a strap with a red cross. */
  'prog.inbyggd.2': all(bg(), phone(48, 62, 1.7, all(rect(-11.5, -19, 23, 37, '#3d3f4a', 1.4, null), circle(-4, -11, 4, '#1f232b', '#9aa3ad', 1.2), circle(-4, -11, 1.6, '#5aa7d6', null), circle(4, -12, 1.4, YEL, null))), ring(41, 43, 12),
    greyed(rect(86, 82, 24, 16, '#3d3f4a', 3, C.ink, 1.2), circle(98, 90, 5, '#9aa3ad', C.ink, 1), path('M86 84 C80 70 116 70 110 84', 'none', C.ink, 1.2)), no(108, 78, 5)),

  // ── 3815 Listor och objekt ─────────────────────────────────────────
  /** lista (i programmering): a column of five cells with coloured name bars inside a pair of big square brackets; the whole list is framed. */
  'prog.lista.2': all(bg(), cells(LISTVALS()), frame(32, 14, 62, 92, 6)),
  /** tom (utan innehåll): an open cardboard box with nothing in it, seen from above, bright and ringed; next to it, small and grey, the same box full of things. */
  'prog.tom.1': all(bg(), ground, path('M20 58 L72 58 L68 104 L24 104 Z', '#d9a96a', C.ink, 1.8), path('M20 58 L28 50 L76 50 L72 58 Z', '#8a5a2a', C.ink, 1.4), path('M20 58 L8 46 M72 58 L86 46', 'none', C.ink, 1.6), path('M20 58 L8 46 L14 40 L28 50 Z M72 58 L86 46 L84 40 L76 50 Z', '#c99a5e', C.ink, 1.4), ring(46, 76, 34),
    greyed(path('M92 88 L112 88 L110 104 L94 104 Z', '#d9a96a', C.ink, 1.2), circle(98, 84, 4, RED, C.ink, 1), rect(102, 78, 6, 10, BLUE, 1, C.ink, 1), circle(108, 86, 3, GREEN, C.ink, 1))),
  /** element (i en lista): the list of five cells, grey; one cell rises up out of the column and to the right, bright with an orange border, and is ringed. */
  'prog.element.4': all(bg(), greyed(cells([...LISTVALS().slice(0, 2), '', ...LISTVALS().slice(3)])), rect(46, 52, 34, 15, 'none', 0, '#9aa3ad', 1.2),
    waIn('pg-element', -18, 10, rect(78, 40, 34, 15, '#fff3e0', 2, HL, 2.4), nameBar(84, 47.5, 22, GREEN)), carr(80, 60, 76, 52, 80, 46, C.grey, 1.2, '2 2'), ring(95, 47, 20)),
  /** index (i en lista): the list of five cells, grey; on its left side a column of small orange number tags 0, 1, 2, 3, 4, one for each cell, and the tag 0 is ringed. */
  'prog.index.4': all(bg(), greyed(cells(LISTVALS())), ...range(5).map((i) => all(rect(16, 23 + i * 15, 16, 13, '#fff3e0', 3, HL, 1.6), mono(24, 33 + i * 15, String(i), 10, C.ink, 800))), ring(24, 29.5, 11)),
  /** objekt (i programmering): a star cookie cutter, grey, at the top; below, three star cookies made with it, each with its own colour of icing and sprinkles; one cookie is ringed. */
  'prog.objekt.4': all(bg(), greyed(cutter(60, 30, 16)), greyed(arr(48, 48, 26, 70, C.grey, 1.6), arr(60, 50, 60, 66, C.grey, 1.6), arr(72, 48, 94, 70, C.grey, 1.6)),
    cookie(22, 88, 14, path(starPts(22, 88, 9), '#f3a6c4', null)), cookie(60, 86, 16, all(path(starPts(60, 86, 10), '#9cd3f0', null), circle(57, 84, 1.4, RED, null), circle(63, 88, 1.4, YEL, null), circle(60, 81, 1.4, GREEN, null))), cookie(98, 88, 14, path(starPts(98, 88, 9), '#b6e0a0', null)), ring(60, 86, 20)),
  /** klass (i programmering): a big metal star cookie cutter pressed on rolled dough, ringed; grey arrows go from it to three small grey star cookies below. */
  'prog.klass.4': all(bg(), ellipse(60, 46, 46, 18, '#f0d9a8', C.ink, 1.4), cutter(60, 42, 20), ring(60, 40, 30), greyed(arr(40, 66, 26, 82, C.grey, 1.6), arr(60, 70, 60, 82, C.grey, 1.6), arr(80, 66, 94, 82, C.grey, 1.6), cookie(22, 96, 10), cookie(60, 96, 10), cookie(98, 96, 10))),
  /** nyckel (i programmering): a table of three rows; on the left of each row a luggage tag with a small key sign and a grey bar, an arrow, and on the right a value (a grey bar, the digit 42, a phone number); the first tag is ringed. */
  'prog.nyckel.3': all(bg(), ...range(3).map((i) => { const y = 28 + i * 30; return all(path(`M10 ${y - 9} L40 ${y - 9} L48 ${y} L40 ${y + 9} L10 ${y + 9} Z`, i === 0 ? '#fff3e0' : '#eef1f4', C.ink, 1.3), circle(42, y, 1.6, C.ink, null),
      at(18, y, 0.5, circle(0, 0, 5, 'none', '#c99a2e', 2.4), line('M5 0 L14 0 M10 0 L10 4 M13 0 L13 3', '#c99a2e', 2.4)), line(`M26 ${y} L38 ${y}`, '#7a8590', 2.4), arr(52, y, 64, y, C.dark, 1.8),
      rect(68, y - 9, 44, 18, C.white, 2, C.ink, 1.2), [nameBar(74, y, 30), mono(90, y + 4, '42', 11, C.ink), mono(90, y + 3.5, '0701234', 8, C.ink)][i]!); }), ring(29, 28, 22)),

  // ── 3816 Fel och undantag ──────────────────────────────────────────
  /** gå fel: a dashed grey path leads straight to a target flag; a yellow ball rolls along a solid orange path that bends away from the target and ends at a red cross with a small burst; the ball moves along the wrong path. */
  'prog.gå-fel': all(bg(), ground, line('M12 92 L96 92', C.grey, 2, '4 3'), line('M100 92 L100 66', C.ink, 1.8), path('M100 66 L114 71 L100 76 Z', GREEN, C.ink, 1.2),
    path('M12 92 C40 92 52 80 60 54 C64 40 70 30 80 26', 'none', HL, 3.4), no(84, 24, 8),
    moving('pg-gafel', '0%{transform:translate(-62px,64px)}35%{transform:translate(-40px,52px)}65%{transform:translate(-22px,28px)}100%{transform:translate(0,0)}', { dur: 2.6 }, circle(74, 30, 5, YEL, C.ink, 1.2)), ring(84, 24, 13)),
  /** loggfil: a long white file with rows; each row starts with a time in small digits, then a coloured dot and a grey bar; one row has a red dot and is pale red; the whole file is framed. */
  'prog.loggfil': all(bg(), rect(14, 8, 92, 102, C.white, 3, C.ink, 1.6), path('M92 8 L106 8 L106 22 Z', '#e3e7eb', C.ink, 1.2),
    ...['08:01', '08:02', '08:05', '08:07', '08:09', '08:12', '08:15'].map((t, i) => all(i === 4 ? rect(16, 18 + i * 13, 88, 11, '#fde3dd', 1, null) : '', mono(30, 26.5 + i * 13, t, 7, '#5a6472', 600), circle(48, 23.5 + i * 13, 2.4, i === 4 ? RED : GREEN, null), line(`M54 ${23.5 + i * 13} L${86 + ((i * 5) % 14)} ${23.5 + i * 13}`, BAR, 2))),
    frame(10, 4, 100, 110, 6)),
  /** undantag (i programmering): two flows from left to right. Above, grey: a box, a lightning bolt hits the flow, and the flow ends in a broken red cross (the program crashes). Below, bright: the same box and lightning bolt, but the bolt is caught in a net, and the flow takes a curved detour round it and goes on to a big green tick; the net with the bolt is ringed. */
  'prog.undantag.2': all(bg(), greyed(rect(8, 16, 20, 16, '#6fa0d8', 3, C.ink, 1.2), line('M28 24 L58 24', C.dark, 2.4), bolt(64, 24, 0.8), line('M70 24 L86 24', C.dark, 2.4, '3 3'), no(96, 24, 8)),
    line('M8 46 L112 46', C.grey2, 1.4, '4 3'),
    rect(8, 70, 20, 16, '#6fa0d8', 3, C.ink, 1.2), line('M28 78 L44 78', C.dark, 2.4), line('M44 60 L60 66', '#7a5030', 2.4), waSway('pg-undantag', 5, path('M42 66 C42 92 74 92 74 66 Z', 'rgba(255,255,255,0.7)', C.ink, 1.3), line('M46 72 L70 86 M70 72 L46 86 M58 66 L58 90', C.grey, 0.8), bolt(58, 78, 0.8)),
    carr(36, 82, 58, 112, 88, 84, GREEN, 3), ok(100, 78, 10), ring(58, 78, 19)),
  /** syntaxfel: an editor window with a few lines of code; one line ends with a round bracket opened but a square bracket closing it, and has a red wavy line under it and a small red cross at the line number; this line is ringed. */
  'prog.syntaxfel': all(bg(), editor(6, 16, 108, 84, nums(13, 34, 6, 10), greyed(code(22, 34, [[0, 20, KW], [6, 34, ID]], 10)), line('M28 54 L52 54', ID, 3), mono(58, 57.5, '(', 10, TXT), line('M62 54 L80 54', STR, 3), mono(86, 57.5, ']', 10, RED),
    path('M28 60 q2 -2.5 4 0 t4 0 t4 0 t4 0 t4 0 t4 0 t4 0 t4 0 t4 0 t4 0 t4 0 t4 0 t4 0 t4 0 t4 0', 'none', RED, 1.4), greyed(code(22, 74, [[6, 26, TXT], [0, 12, KW]], 10))), no(10, 54, 4), oval(60, 56, 46, 10)),
  /** logiskt fel: a screen where a program runs (a green play sign and a turning gear) and shows 2 + 2 = 5; the answer 5 is red and ringed, and a grey correct 4 is crossed out beside it. */
  'prog.logiskt-fel': all(bg(), editor(8, 12, 104, 70, circle(22, 32, 6, GREEN, null), path('M20 29 L26 32 L20 35 Z', C.white, null), waSpin('pg-logiskt', 4, gear(98, 32, 7)), txt(52, 64, '2+2=', 20, C.white, 800), txt(92, 64, '5', 22, RED, 900)), ring(92, 57, 14),
    greyed(txt(60, 104, '4', 16, C.ink, 800)), ok(74, 99, 5)),

  // ── 3817 Kommentarer och dokumentation ─────────────────────────────
  /** kommentar (i kod): an editor window with coloured code lines; one line in grey-green starts with // and is followed by a short note, and it is ringed; a small person icon beside it reads it. */
  'prog.kommentar.3': all(bg(), editor(6, 14, 108, 88, code(18, 58, [[0, 20, KW], [6, 34, ID], [6, 26, STR], [0, 12, KW]], 10), mono(24, 43, '//', 10, '#9ccc65'), line('M34 40 L86 40', '#9ccc65', 2.4), line('M18 30 L40 30', KW, 3)), oval(56, 40, 44, 9)),
  /** dokumentation (beskrivning): a thick ring binder lies open next to a laptop; its pages show a small drawing of the app screens with arrows between them and lines of grey text; the binder is ringed. */
  'prog.dokumentation.2': all(bg(), ground, desk(90), laptop(94, 88, 0.5, code(-18, -28, [[0, 16, KW], [4, 22, ID], [4, 14, STR]], 6, 2)),
    rect(8, 36, 56, 52, C.white, 2, C.ink, 1.6), line('M36 36 L36 88', C.ink, 1.4), ...range(4).map((i) => circle(36, 44 + i * 12, 1.8, '#9aa3ad', C.ink, 0.8)),
    rect(13, 42, 9, 14, '#dbe8f8', 1, C.ink, 0.9), rect(25, 42, 9, 14, '#dbe8f8', 1, C.ink, 0.9), arr(22, 49, 25, 49, HL, 1.2), bars(13, 64, 19, 4, 5, BAR, 1.4), bars(40, 44, 20, 8, 5, BAR, 1.4), ring(36, 62, 32)),
  /** instruktion: a sheet with three numbered steps, 1, 2 and 3, each with a small picture (put the parts together, screw, done with a tick), joined by arrows; the sheet is framed. */
  'prog.instruktion.1': all(bg(), rect(10, 8, 100, 104, C.white, 3, C.ink, 1.6),
    ...[0, 1, 2].map((i) => all(circle(22, 26 + i * 32, 7, HL, C.ink, 1.2), txt(22, 30 + i * 32, String(i + 1), 9, C.white, 900), rect(36, 14 + i * 32, 34, 24, '#f4f6f8', 2, C.grey, 1), bars(76, 22 + i * 32, 28, 2, 6, BAR, 1.8))),
    rect(42, 22, 10, 10, '#d9a96a', 1, C.ink, 1), rect(56, 24, 8, 8, '#d9a96a', 1, C.ink, 1), rect(44, 56, 20, 8, '#d9a96a', 1, C.ink, 1), wrench(50, 52, 0.5, -30), rect(42, 86, 22, 10, '#d9a96a', 1, C.ink, 1), ok(64, 82, 4),
    arr(53, 39, 53, 45, C.dark, 1.4), arr(53, 71, 53, 77, C.dark, 1.4), frame(6, 4, 108, 112, 6)),
  /** läsbar (lätt att läsa): two pages; the left page is grey, cramped and messy with tangled scribbles and a red cross; the right page has neat, well spaced lines in clear colours, an eye with a green tick above it, and it is ringed. */
  'prog.läsbar.2': all(bg(), greyed(rect(8, 24, 44, 66, C.white, 2, C.ink, 1.2), ...range(10).map((i) => path(`M12 ${30 + i * 5.6} q4 -3 8 0 t8 1 t8 -2 t8 1`, 'none', C.dark, 1.2))), no(46, 24, 6),
    rect(62, 24, 50, 66, C.white, 2, C.ink, 1.6), ...range(5).map((i) => line(`M68 ${36 + i * 11} L${100 - (i % 2) * 10} ${36 + i * 11}`, [KW, ID, STR, NUM, ID][i]!, 3)),
    ellipse(87, 12, 10, 6, C.white, C.ink, 1.2), circle(87, 12, 3, BLUE, null), ok(102, 10, 5), ring(87, 57, 32)),
  /** ta över (ansvar): a woman with a bag walks away to the left; she has handed a laptop with code to a man, and the laptop moves from her hands into his; the laptop is ringed. */
  'prog.ta-över': all(bg(), ground, person(30, C.orange, { hairStyle: 'long', h: 0.86 }), reach(30, 0.86, 1, 50, 70), rect(12, 76, 10, 12, '#a0673d', 2, C.ink, 1.2), arr(14, 30, 4, 30, C.grey, 1.8),
    person(90, C.green, { h: 0.92 }), reach(90, 0.92, -1, 72, 70),
    moving('pg-taover', '0%,15%{transform:translate(-12px,0)}70%,100%{transform:translate(0,0)}', { dur: 2.8 }, laptop(64, 72, 0.32, code(-18, -28, [[0, 18, KW], [4, 24, ID], [4, 14, STR]], 6, 2.4))), ring(64, 64, 14)),
  /** underhålla (sköta): an editor window with code and a gear; a wrench turns back and forth on the gear, and a small calendar beside it has a tick on every day; the wrench and gear are ringed. */
  'prog.underhålla.2': all(bg(), editor(6, 18, 70, 60, code(14, 36, [[0, 20, KW], [6, 30, ID], [6, 24, STR], [0, 14, KW]], 9)), gear(60, 64, 10), waSway('pg-underhall', 18, wrench(60, 64, 1, -40)),
    calendar(96, 90, 1.2), ring(60, 64, 20)),
  /** kodgranskning: two people sit at one big screen with code; the second person moves a magnifying glass slowly down over the code lines; at one line a small red bug is found and marked, and the others get green ticks; the magnifying glass is ringed. */
  'prog.kodgranskning': all(bg(), editor(18, 8, 84, 62, code(28, 26, [[0, 24, KW], [6, 34, ID], [6, 26, STR], [6, 30, TXT], [0, 14, KW]], 9)), ok(96, 26, 3), ok(96, 35, 3), bug(96, 44, 0.5),
    person(28, C.orange, { hairStyle: 'long', h: 0.5 }), person(92, C.green, { h: 0.5 }),
    moving('pg-granska', '0%{transform:translate(-14px,-18px)}50%{transform:translate(0,0)}100%{transform:translate(-14px,-18px)}', { dur: 3.4 }, magnifier(64, 44, 9)), ring(64, 44, 13)),
};
