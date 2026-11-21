/**
 * Teknik & digital värld → Programmering & artificiell intelligens → Maskininlärning, 3851–3857 (0.56):
 * training data, models and parameters, classification and regression, training and validation, overfitting,
 * neural networks, model evaluation.
 * Recurring signs: a data example is a small photo card (mushroom, cat, dog, bird); a model is a blue machine with a
 * gear; a correct answer is a green tick and a wrong one a red cross; a neural network is columns of round nodes joined
 * by lines; the part the word names is ringed or framed in orange, and grey copies show what the word is not.
 * Close words differ in what is marked: neuralt nätverk/lager/neuron (the whole network, one column, or one node);
 * träna/träning (a person teaching a robot with cards, or a machine with a filling progress bar and a falling error
 * curve); validering/testdata (answers checked against an answer sheet during the work, or a locked box kept for the
 * end); svart låda/förklarbar (a black box with a question mark, or a glass box whose gears and reasons are visible).
 * Digits and code signs only; no words, no brands, no logos, no pointing fingers.
 */
import { C, all, circle, ellipse, g, line, moving, path, rect, waBob, waGrow, waIn, waPulse, waShake, waSpin, type Svg } from './kit';
import { HL, arm } from './people';
import { greyed } from './blindFix';
import { figure } from './figures';

// ── Palette and basics ───────────────────────────────────────────────
const BG = '#eef3f7';
const GREEN = '#3a9a5a';
const RED = '#e2553a';
const BLUE = '#3a6ab0';
const MACH = '#6fa0d8';
const YEL = '#f2c14e';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const bg = (col: string = BG) => rect(4, 4, 112, 108, col, 4, null);
const ground = line('M4 112 L116 112', C.grey2, 2);
const ring = (x: number, y: number, r: number, col: string = HL, sw = 2.6) => circle(x, y, r, 'none', col, sw);
const frame = (x: number, y: number, w: number, h: number, r = 5, col: string = HL) => rect(x, y, w, h, 'none', r, col, 2.6);
const head = (x: number, y: number, a: number, col: string, s = 1) => {
  const L = 7 * s, W = 4 * s, c = Math.cos(a), si = Math.sin(a);
  return path(`M${f1(x)} ${f1(y)} L${f1(x - L * c + W * si)} ${f1(y - L * si - W * c)} L${f1(x - L * c - W * si)} ${f1(y - L * si + W * c)} Z`, col, null);
};
const arr = (x1: number, y1: number, x2: number, y2: number, col: string = HL, sw = 3, dash?: string) => all(line(`M${x1} ${y1} L${x2} ${y2}`, col, sw, dash), head(x2, y2, Math.atan2(y2 - y1, x2 - x1), col, sw / 3 + 0.3));
const carr = (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, col: string = HL, sw = 2.4, dash?: string) => all(line(`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`, col, sw, dash), head(x2, y2, Math.atan2(y2 - cy, x2 - cx), col, sw / 3 + 0.3));
const ok = (x: number, y: number, r = 7) => all(circle(x, y, r, GREEN, C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, r * 0.25));
const no = (x: number, y: number, r = 7) => all(circle(x, y, r, RED, C.ink, 1.2), line(`M${f1(x - r * 0.4)} ${f1(y - r * 0.4)} L${f1(x + r * 0.4)} ${f1(y + r * 0.4)} M${f1(x + r * 0.4)} ${f1(y - r * 0.4)} L${f1(x - r * 0.4)} ${f1(y + r * 0.4)}`, C.white, r * 0.25));
const txt = (x: number, y: number, s: string, size: number, col: string = C.ink, w = 800) =>
  `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="${w}" font-size="${size}" text-anchor="middle" fill="${col}">${s}</text>`;
const mono = (x: number, y: number, s: string, size: number, col: string = C.ink, w = 700) =>
  `<text x="${x}" y="${y}" font-family="DejaVu Sans Mono,Menlo,Consolas,monospace" font-weight="${w}" font-size="${size}" text-anchor="middle" fill="${col}">${s}</text>`;

// ── Small icons (drawn around 0,0, about 16 px wide) ─────────────────
const mushroom = (x: number, y: number, s = 1, cap = '#e0a040') => at(x, y, s, path('M-3 0 L-4 7 L4 7 L3 0 Z', '#f4ead8', C.ink, 1), path('M-8 1 C-8 -8 8 -8 8 1 Z', cap, C.ink, 1.1));
const cat = (x: number, y: number, s = 1, col = '#e0a040') => at(x, y, s, path('M-7 -2 L-6 -9 L-2 -5 L2 -5 L6 -9 L7 -2 C7 5 -7 5 -7 -2 Z', col, C.ink, 1.1), circle(-2.6, -1.5, 0.9, C.ink, null), circle(2.6, -1.5, 0.9, C.ink, null), path('M-1 1.4 L1 1.4 L0 2.6 Z', C.pink, null));
const dog = (x: number, y: number, s = 1, col = '#a0673d', spot = '') => at(x, y, s, ellipse(0, 0, 7, 6.5, col, C.ink, 1.1), path('M-7 -4 C-11 -2 -10 5 -7 5 Z M7 -4 C11 -2 10 5 7 5 Z', '#6b4428', C.ink, 0.9), spot, circle(-2.4, -1.2, 0.9, C.ink, null), circle(2.4, -1.2, 0.9, C.ink, null), ellipse(0, 2.2, 1.6, 1.1, C.ink, null));
const bird = (x: number, y: number, s = 1, col = '#5a8ad0') => at(x, y, s, ellipse(0, 0, 7, 5, col, C.ink, 1.1), circle(5, -4, 3.4, col, C.ink, 1), path('M8 -4.5 L11.5 -3.6 L8 -2.6 Z', YEL, null), circle(5.6, -4.6, 0.7, C.ink, null), path('M-6 -1 L-11 -4 L-9 1 Z', col, C.ink, 0.9));
/** A photo card with a small icon on a light background. */
const photo = (x: number, y: number, icon: Svg, w = 22, h = 20, col = '#e8f2e0') => all(rect(x - w / 2, y - h / 2, w, h, C.white, 2, C.ink, 1.2), rect(x - w / 2 + 2, y - h / 2 + 2, w - 4, h - 4, col, 1, null), icon);
/** A luggage-style tag on a string. */
const tag = (x: number, y: number, inner: Svg, col = '#fff3e0') => all(path(`M${x - 9} ${y - 6} L${x + 7} ${y - 6} L${x + 11} ${y} L${x + 7} ${y + 6} L${x - 9} ${y + 6} Z`, col, C.ink, 1.2), circle(x + 6, y, 1.4, C.white, C.ink, 0.8), inner);
/** A gear wheel. */
const gear = (x: number, y: number, r: number, col: string = '#9aa3ad') => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return rect(f1(x + Math.cos(a) * r - 2.2), f1(y + Math.sin(a) * r - 2.2), 4.4, 4.4, col, 1, C.ink, 0.8); }),
  circle(x, y, r, col, C.ink, 1.2), circle(x, y, f1(r * 0.38), BG, C.ink, 1));
/** The model: a blue machine with a gear, a funnel on the left and a chute on the right. */
const machine = (x: number, y: number, col = MACH, spin = '', w = 44, h = 40) => all(
  path(`M${x - w / 2 - 12} ${y - 12} L${x - w / 2} ${y - 6} L${x - w / 2} ${y + 6} L${x - w / 2 - 12} ${y + 12} Z`, '#b7c3d0', C.ink, 1.4),
  path(`M${x + w / 2} ${y - 6} L${x + w / 2 + 12} ${y - 10} L${x + w / 2 + 12} ${y + 10} L${x + w / 2} ${y + 6} Z`, '#b7c3d0', C.ink, 1.4),
  rect(x - w / 2, y - h / 2, w, h, col, 6, C.ink, 1.8), spin ? waSpin(spin, 4, gear(x, y, 9, '#e8edf2')) : gear(x, y, 9, '#e8edf2'));
/** A small robot (the model as a pupil). */
const robot = (x: number, y: number, s = 1) => at(x, y, s, rect(-12, -10, 24, 26, MACH, 4, C.ink, 1.6), rect(-10, -30, 20, 17, '#9fc2e6', 4, C.ink, 1.6), circle(-4.5, -22, 2.4, C.white, C.ink, 1), circle(4.5, -22, 2.4, C.white, C.ink, 1),
  circle(-4.5, -22, 1, C.ink, null), circle(4.5, -22, 1, C.ink, null), line('M0 -30 L0 -35', C.ink, 1.4), circle(0, -36, 2, RED, C.ink, 0.8), line('M-4 -16 L4 -16', C.ink, 1.2), rect(-8, 16, 6, 8, '#5a6472', 1, C.ink, 1.1), rect(2, 16, 6, 8, '#5a6472', 1, C.ink, 1.1));
/** Axes of a small diagram. */
const axes = (x: number, y: number, w: number, h: number) => all(line(`M${x} ${y - h} L${x} ${y} L${x + w} ${y}`, C.ink, 1.8), head(x, y - h - 1, -Math.PI / 2, C.ink, 0.7), head(x + w + 1, y, 0, C.ink, 0.7));
const dot = (x: number, y: number, col = BLUE, r = 2.6) => circle(x, y, r, col, C.ink, 0.8);
/** A neural network: columns of nodes, every node joined to every node in the next column. */
const NET = (cols: number[], x0: number, x1: number, y0: number, y1: number) => {
  const xs = cols.map((_, i) => x0 + ((x1 - x0) * i) / (cols.length - 1));
  const pos = cols.map((n, i) => range(n).map((j) => [xs[i]!, n === 1 ? (y0 + y1) / 2 : y0 + ((y1 - y0) * j) / (n - 1)] as [number, number]));
  return { xs, pos };
};
const netLines = (pos: [number, number][][], col = '#8a96a3', sw = 1) => all(...pos.slice(0, -1).flatMap((c, i) => c.flatMap(([x, y]) => pos[i + 1]!.map(([x2, y2]) => line(`M${x} ${y} L${x2} ${y2}`, col, sw)))));
const netNodes = (pos: [number, number][][], r = 6, fills = ['#f6b26b', '#9fc2e6', '#9fc2e6', '#9fc2e6', '#9fc2e6', '#9fc2e6', '#9fc2e6', '#a8dcc0']) =>
  all(...pos.flatMap((c, i) => c.map(([x, y]) => circle(x, y, r, i === pos.length - 1 ? fills[7]! : i === 0 ? fills[0]! : fills[1]!, C.ink, 1.2))));
/** An arrow stuck in a target at x,y (shaft up to the right, coloured feathers). */
const dart = (x: number, y: number, col: string) => all(line(`M${x} ${y} L${f1(x + 13)} ${f1(y - 13)}`, '#7a5030', 1.8), path(`M${f1(x + 10)} ${f1(y - 14)} L${f1(x + 16)} ${f1(y - 16)} L${f1(x + 14)} ${f1(y - 10)} Z`, col, C.ink, 0.6));
const STD = NET([3, 4, 4, 2], 20, 100, 30, 90);
/** Overfitting: a curve through every point that overshoots wildly between them. */
const OVP: [number, number][] = [[22, 84], [32, 90], [42, 70], [52, 78], [62, 56], [72, 66], [82, 42], [92, 54], [102, 30]];
const OVER = 'M22 84 ' + OVP.slice(1).map(([x, y], i) => { const [x0, y0] = OVP[i]!, k = i % 2 ? 26 : -26, d = (x - x0) / 3; return `C${x0 + d} ${y0 + k} ${x - d} ${y + k} ${x} ${y}`; }).join(' ');
/** An answer sheet: a card with lines and ticks. */
const sheet = (x: number, y: number, n = 4) => all(rect(x - 14, y - 18, 28, 36, C.white, 2, C.ink, 1.3), ...range(n).map((i) => all(line(`M${x - 9} ${y - 10 + i * 8} L${x + 3} ${y - 10 + i * 8}`, '#9aa3ad', 2), ok(x + 8, y - 10 + i * 8, 2.6))));
const padlock = (x: number, y: number, s = 1) => at(x, y, s, path('M-5 -2 L-5 -7 C-5 -13 5 -13 5 -7 L5 -2', 'none', '#7a8590', 2.4), rect(-8, -2, 16, 13, YEL, 2, C.ink, 1.3), circle(0, 3.6, 1.6, C.ink, null), line('M0 4 L0 8', C.ink, 1.2));
const hourglass = (x: number, y: number, s = 1) => at(x, y, s, rect(-9, -16, 18, 3, '#a0673d', 1, C.ink, 1), rect(-9, 13, 18, 3, '#a0673d', 1, C.ink, 1),
  path('M-7 -13 L7 -13 L1 0 L7 13 L-7 13 L-1 0 Z', 'rgba(220,240,252,0.7)', C.ink, 1.2), path('M-4 -8 L4 -8 L1 -1 L-1 -1 Z', YEL, null), path('M-5 12 L5 12 L0 6 Z', YEL, null));

export const ML_MOTIFS: Record<string, Svg> = {
  // ── 3851 Träningsdata ──────────────────────────────────────────────
  /** träningsdata: a tall pile of photo cards (mushrooms, cats, birds), each with a small green tick tag, slides along an arrow into the funnel of a blue machine with a gear; the pile of cards is framed. */
  'mlrn.träningsdata': all(bg(), ground,
    ...range(5).map((i) => { const y = 96 - i * 17, ic = [mushroom(0, 0, 0.9), cat(0, 0, 0.8), bird(0, 0, 0.8), mushroom(0, 0, 0.9, '#c8402a'), dog(0, 0, 0.8)][i]!;
      return all(photo(26 + (i % 2) * 3, y, g(`translate(${26 + (i % 2) * 3} ${y})`, ic)), ok(40 + (i % 2) * 3, y - 7, 3.4)); }),
    frame(10, 18, 40, 90, 6),
    waIn('ml-td-in', -16, 0, photo(60, 56, g('translate(60 56)', cat(0, 0, 0.8))), ok(74, 49, 3.4)), arr(52, 70, 70, 70, HL, 2.6),
    machine(96, 70, MACH, 'ml-td-gear', 26, 34)),
  /** etikett (i maskininlärning): a big photo card of a cat with a cream tag tied to it by a string; on the tag a small cat face and a green tick; the tag is ringed; beside it, small and grey, the same kind of photo with no tag. */
  'mlrn.etikett.4': all(bg(), greyed(photo(100, 94, g('translate(100 94)', cat(0, 0, 0.9)), 24, 22)),
    photo(40, 66, g('translate(40 68)', cat(0, 0, 2.2)), 56, 52), line('M66 42 C74 36 76 32 80 30', C.ink, 1.4),
    waBob('ml-et-tag', 2, g('translate(92 30) rotate(-15) scale(1.9)', tag(0, 0, all(cat(-2.5, 0.5, 0.55), ok(4, 0, 2.6))))), ring(92, 30, 24)),

  // ── 3852 Modeller och parametrar ───────────────────────────────────
  /** modell (i AI): a big blue machine with a turning gear; a photo of a dog goes in on the left, and a speech bubble with a dog face and a tick comes out on the right; behind the machine a faint pile of many photo cards that it has learned from; the machine is framed. */
  'mlrn.modell.5': all(bg(), ground, greyed(...range(4).map((i) => photo(48 + i * 4, 26 - i * 3, '', 20, 16))),
    machine(60, 68, MACH, 'ml-mod-gear', 44, 40), photo(14, 68, g('translate(14 68)', dog(0, 0, 0.8)), 18, 18), arr(24, 68, 30, 68, HL, 2),
    path('M88 44 L114 44 L114 64 L104 64 L100 70 L98 64 L88 64 Z', C.white, C.ink, 1.3), dog(96, 54, 0.7), waGrow('ml-mod-ok', ok(108, 54, 4)),
    frame(34, 44, 52, 48, 7)),
  /** parameter (i maskininlärning): the blue machine with its front open, showing a panel of many small sliders at different heights; one slider moves up and down by itself; the slider panel is framed; the closed machine outline is grey. */
  'mlrn.parameter.3': all(bg(), ground, rect(14, 18, 92, 84, MACH, 8, C.ink, 1.8), greyed(gear(98, 26, 6, '#e8edf2')),
    rect(22, 28, 76, 64, '#f4f6f8', 4, C.ink, 1.4),
    ...range(8).map((i) => { const x = 30 + i * 8.6, y = 40 + ((i * 37) % 40); return all(line(`M${f1(x)} 34 L${f1(x)} 86`, '#9aa3ad', 1.8), i === 3 ? '' : rect(f1(x - 3.4), y - 2.5, 6.8, 5, '#f6b26b', 1.5, C.ink, 1)); }),
    moving('ml-par-slide', '0%,100%{transform:translate(0,0)}50%{transform:translate(0,-22px)}', { dur: 2.4 }, rect(f1(30 + 3 * 8.6 - 3.4), 70, 6.8, 5, HL, 1.5, C.ink, 1)),
    frame(18, 24, 84, 72, 5)),
  /** statistisk: a histogram of many blue bars rising to a peak in the middle and falling again, with a smooth orange bell curve over the bar tops and a dashed line at the peak; above it a small crowd of many tiny grey people from which the bars are counted, and "%" beside the peak; a single grey person alone on the left is crossed out; the histogram is framed. */
  'mlrn.statistisk': all(bg(),
    ...range(7).map((i) => circle(40 + i * 10, 14, 2.4, C.skin, C.ink, 0.7)), ...range(7).map((i) => rect(38.4 + i * 10, 17, 3.2, 6, '#9aa3ad', 1, C.ink, 0.6)),
    ...range(6).map((i) => circle(45 + i * 10, 26, 2.4, C.skin, C.ink, 0.7)),
    arr(74, 32, 74, 42, '#9aa3ad', 1.8),
    greyed(circle(14, 60, 4, C.skin, C.ink, 1), rect(10, 64, 8, 12, C.sky, 2, C.ink, 1)), line('M6 52 L22 80 M22 52 L6 80', RED, 2.2),
    axes(32, 102, 82, 54),
    ...range(9).map((i) => { const x = 36 + i * 8.6, h = f1(46 * Math.exp(-(((i - 4) / 2) ** 2))) + 3; return rect(f1(x), f1(102 - h), 7.4, h, BLUE, 1, C.ink, 0.8); }),
    path(`M33 101 ${range(41).map((j) => { const x = 33 + j * 2.05, t = (x - 73.3) / 17.2; return `L${f1(x)} ${f1(102 - 3 - 46 * Math.exp(-t * t))}`; }).join(' ')}`, 'none', HL, 2.6),
    line('M73.3 102 L73.3 48', C.ink, 1.4, '3 2'), txt(96, 62, '%', 14, C.purple),
    frame(28, 44, 88, 64, 6)),

  // ── 3853 Klassificering och regression ─────────────────────────────
  /** klassificering: photo cards ride along a belt; one card with a cat drops into the box marked with a cat face, the next card with a dog waits; two open boxes below are marked with a cat face and a dog face, and both boxes are framed. */
  'mlrn.klassificering': all(bg(), ground, rect(8, 30, 70, 7, '#5a6472', 3.5, C.ink, 1.4), ...range(5).map((i) => circle(14 + i * 14, 33.5, 2, '#9aa3ad', null)),
    photo(22, 20, g('translate(22 20)', dog(0, 0, 0.7)), 18, 16), photo(46, 20, g('translate(46 20)', cat(0, 0, 0.7)), 18, 16),
    waIn('ml-kl-drop', -10, -40, photo(32, 70, g('translate(32 70)', cat(0, 0, 0.7)), 18, 16)), carr(74, 34, 86, 48, 40, 60, HL, 2),
    path('M12 76 L52 76 L48 106 L16 106 Z', '#d9a96a', C.ink, 1.6), path('M66 76 L106 76 L102 106 L70 106 Z', '#d9a96a', C.ink, 1.6),
    circle(32, 94, 8, C.white, C.ink, 1), cat(32, 95, 0.8), circle(86, 94, 8, C.white, C.ink, 1), dog(86, 95, 0.8),
    frame(8, 72, 104, 38, 5)),
  /** regression (i statistik): a diagram with scattered blue dots that rise to the right and an orange straight line drawn through them; a dashed line goes from a new place on the line to the side axis, where a tile with a question mark turns into a number. */
  'mlrn.regression.2': all(bg(), axes(16, 102, 94, 88),
    ...[[24, 88], [30, 92], [36, 80], [44, 82], [50, 72], [56, 76], [62, 64], [70, 66], [76, 56], [84, 58], [90, 46], [98, 48]].map(([x, y]) => dot(x!, y!, BLUE, 2.8)),
    g('translate(20 94)', moving('ml-reg-line', '0%{transform:scaleX(0)}60%,100%{transform:scaleX(1)}', { dur: 2.8 }, line('M0 0 L86 -58', HL, 3))),
    line('M66 64 L16 64', '#7a8590', 1.4, '3 2'), line('M66 64 L66 102', '#7a8590', 1.4, '3 2'), circle(66, 64, 4, HL, C.ink, 1.2),
 waPulse('ml-reg-val', rect(20, 14, 28, 16, '#fff3e0', 3, C.ink, 1.2), mono(34, 26, '250', 10)), carr(30, 32, 22, 48, 18, 60, '#7a8590', 1.2)),
  /** bildigenkänning: a phone shows a photo of a dog in a park; an orange dashed box pulses around the dog while a light scan line moves over the screen, and a tag with a small dog face and a tick appears next to the box. */
  'mlrn.bildigenkänning': all(bg(), rect(26, 10, 68, 100, C.dark, 8, C.ink, 1.8), rect(31, 20, 58, 80, '#cfe8f5', 2, null), rect(31, 74, 58, 26, '#9bd08a', 0, null),
    circle(80, 30, 5, YEL, null), path('M36 74 C40 60 48 60 50 74 Z', '#4f9d69', C.ink, 1), dog(60, 72, 1.6),
    moving('ml-bild-scan', '0%{transform:translate(0,0);opacity:.8}100%{transform:translate(0,76px);opacity:.2}', { dur: 2.2 }, rect(31, 21, 58, 3, '#7dffa0', 0, null)),
    waPulse('ml-bild-box', rect(46, 58, 28, 28, 'none', 2, HL, 2.4)), waGrow('ml-bild-tag', g('translate(82 50)', tag(0, 0, all(dog(-2, 0, 0.5), ok(4, 0, 2.4)))))),

  // ── 3854 Träning och validering ────────────────────────────────────
  /** träna (en modell): a person holds up a photo card of a bird to a small blue robot; the robot answers with a bubble showing a bird; an orange round arrow goes from the answer back to the robot (try, check, try again), and the card moves towards the robot again and again. */
  'mlrn.träna.3': all(bg(), ground, figure({ x: 30, top: C.green }), arm(42, 74, 50, 58), circle(50, 58, 3, C.skin, C.ink, 1.2),
    waIn('ml-trana-kort', -8, 6, photo(56, 50, g('translate(56 50)', bird(0, 0, 0.7)), 20, 18)),
    robot(92, 88, 1), path('M90 24 L114 24 L114 42 L104 42 L100 48 L98 42 L90 42 Z', C.white, C.ink, 1.2), bird(100, 33, 0.6), ok(110, 33, 3),
    carr(96, 46, 84, 56, 82, 66, HL, 2.2), carr(70, 64, 70, 54, 72, 46, HL, 2.2)),
  /** träning (av en modell): the blue machine with a turning gear eats a pile of photo cards; under it a progress bar slowly fills, and beside it a small diagram where the error curve falls over time; an hourglass stands next to it. */
  'mlrn.träning.2': all(bg(), ...range(4).map((i) => photo(16, 30 - i * 3, '', 18, 14)), arr(26, 30, 34, 30, HL, 2), machine(54, 30, MACH, 'ml-tr-gear', 30, 30),
    rect(16, 56, 76, 9, '#e3e7eb', 4, C.ink, 1.2), g('translate(16 56)', moving('ml-tr-bar', '0%{transform:scaleX(0)}85%,100%{transform:scaleX(1)}', { dur: 4 }, rect(0, 0, 76, 9, GREEN, 4, null))),
    axes(18, 104, 70, 30), line('M22 76 C34 98 50 100 84 101', RED, 2.4), hourglass(102, 88, 1), frame(10, 50, 88, 22, 5)),
  /** testdata: a small pile of photo cards locked in a yellow box with a padlock, standing apart and framed; a big grey pile of other cards goes into a grey machine. */
  'mlrn.testdata': all(bg(), ground, greyed(...range(5).map((i) => photo(22, 40 - i * 4, '', 20, 16)), arr(34, 40, 44, 40, C.grey, 2), machine(66, 40, MACH, '', 28, 28)),
    rect(56, 74, 46, 32, '#d9a96a', 4, C.ink, 1.6), ...range(3).map((i) => photo(70 + i * 9, 72 - i * 3, g(`translate(${70 + i * 9} ${72 - i * 3})`, [cat(0, 0, 0.55), dog(0, 0, 0.55), bird(0, 0, 0.55)][i]!), 16, 14)),
    rect(56, 74, 46, 32, '#d9a96a', 4, C.ink, 1.6), padlock(79, 90, 1.2), frame(50, 56, 58, 54, 6)),
  /** validering (kontroll): a column of four small answer cards from the machine next to an answer sheet; a magnifier moves down the cards and a green tick appears beside each one in turn, one gets a red cross; the cards with their ticks are framed. */
  'mlrn.validering.3': all(bg(), machine(24, 24, MACH, '', 22, 22), arr(24, 38, 24, 46, HL, 2),
    ...range(4).map((i) => all(photo(30, 56 + i * 14, g(`translate(30 ${56 + i * 14})`, [bird(0, 0, 0.5), cat(0, 0, 0.5), dog(0, 0, 0.5), bird(0, 0, 0.5)][i]!), 16, 12))),
    ...range(4).map((i) => moving(`ml-val-${i}`, `0%,${15 + i * 18}%{opacity:0}${25 + i * 18}%,100%{opacity:1}`, { dur: 4 }, i === 2 ? no(48, 56 + i * 14, 4) : ok(48, 56 + i * 14, 4))),
    sheet(88, 72, 4), moving('ml-val-lupp', '0%{transform:translate(0,0)}100%{transform:translate(0,42px)}', { dur: 4 }, line('M66 58 L72 64', '#7a5030', 3), circle(61, 53, 7, 'rgba(220,240,252,0.5)', C.ink, 1.4)),
    frame(18, 46, 38, 64, 5)),
  /** datorkraft: a big rack of black computers with rows of blinking green lights and graphics cards with fans, a lightning bolt above it and a speed gauge with its needle at the top; beside it a small grey laptop. */
  'mlrn.datorkraft': all(bg(), ground, greyed(rect(8, 96, 22, 13, C.dark, 2, C.ink, 1), path('M4 109 L34 109 L32 112 L6 112 Z', '#9aa3ad', C.ink, 1)),
    rect(40, 26, 50, 86, C.dark, 3, C.ink, 1.8), ...range(6).map((i) => all(rect(44, 30 + i * 13, 42, 10, '#3d4250', 1.5, C.ink, 1), circle(52, 35 + i * 13, 3, '#5a6472', C.ink, 0.6), circle(62, 35 + i * 13, 3, '#5a6472', C.ink, 0.6),
      waPulse(`ml-dk-${i}`, circle(78, 35 + i * 13, 1.6, '#7dffa0', null), circle(83, 35 + i * 13, 1.6, '#7dffa0', null)))),
    g('translate(104 34)', path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', YEL, C.ink, 1.4)),
    path('M94 80 A10 10 0 0 1 114 80', 'none', '#c9ced4', 4), line('M104 80 L109 72', RED, 2.2), circle(104, 80, 2.2, C.ink, null),
    frame(36, 22, 58, 90, 5)),

  // ── 3855 Överanpassning ────────────────────────────────────────────
  /** överanpassning: a diagram with blue dots; an orange wiggly curve snakes through every single dot, while a grey straight line follows the general direction; a new star-shaped dot lies near the grey line but far from the wiggly curve and gets a red cross; the wiggly curve is the marked part. */
  'mlrn.överanpassning': all(bg(), axes(14, 104, 96, 90),
    greyed(line('M18 92 L106 30', C.grey, 3)),
    ...OVP.map(([x, y]) => dot(x, y, BLUE, 2.8)),
    moving('ml-over-curve', '0%{opacity:0}50%,100%{opacity:1}', { dur: 3 }, line(OVER, HL, 2.6)),
    path('M67 52 L69 57 L74 57 L70 60 L72 65 L67 62 L62 65 L64 60 L60 57 L65 57 Z', YEL, C.ink, 1), no(80, 66, 5)),
  /** komplex: many coloured gears of different sizes all meshed together in a tight cluster with criss-crossing belts; in the corner one single small grey gear on its own. */
  'mlrn.komplex': all(bg(), greyed(gear(18, 96, 8)),
    ...[[46, 40, 12, '#f6b26b'], [70, 30, 9, '#9fc2e6'], [88, 48, 11, '#a8dcc0'], [62, 58, 10, '#c7b3e6'], [40, 70, 9, '#f2c14e'], [80, 78, 12, '#ef9fb5'], [100, 26, 7, '#9fc2e6'], [60, 90, 8, '#a8dcc0']].map(([x, y, r, col]) => gear(Number(x), Number(y), Number(r), String(col))),
    line('M46 40 L80 78 M70 30 L40 70 M88 48 L60 90 M100 26 L62 58', '#7a5030', 1.4, '2 2'),
    waSpin('ml-komplex', 6, gear(62, 58, 10, '#c7b3e6')), frame(26, 14, 88, 92, 8)),
  /** brus (i data): a smooth green dashed wave runs through the middle; around it a jittery orange zig-zag line and scattered small dots jump about, hiding the wave; the noisy band is framed. */
  'mlrn.brus.2': all(bg(), axes(12, 100, 98, 84),
    line('M14 60 C30 30 46 30 60 60 C74 90 90 90 106 60', GREEN, 2.4, '5 3'),
    waShake('ml-brus', line('M14 56 L19 68 L23 46 L28 52 L32 34 L37 44 L41 30 L46 46 L50 38 L55 66 L59 52 L64 74 L68 66 L73 90 L77 74 L82 92 L86 80 L91 88 L95 70 L100 76 L106 54', HL, 1.6),
      ...range(22).map((i) => dot(16 + ((i * 37) % 90), 26 + ((i * 53) % 70), '#f6b26b', 1.4))),
    frame(10, 20, 102, 82, 6)),
  /** generalisera (i maskininlärning): three small grey photo cards of different dogs go into a blue machine; on the right a new, big, spotted dog that the machine has never seen gets a green tick that grows in; the new dog and its tick are framed. */
  'mlrn.generalisera.2': all(bg(), ground, greyed(...range(3).map((i) => photo(16, 30 + i * 22, g(`translate(16 ${30 + i * 22})`, dog(0, 0, 0.75, ['#a0673d', '#e0b070', '#6b4428'][i]!)), 20, 18))),
    arr(28, 52, 34, 52, C.grey, 2), machine(52, 52, MACH, 'ml-gen-gear', 22, 28), arr(70, 52, 76, 52, HL, 2.4),
    waIn('ml-gen-ny', 10, 0, photo(96, 52, g('translate(96 54)', dog(0, 0, 1.6, C.white, all(circle(-3, -4, 2, C.ink, null), circle(4, 3, 1.6, C.ink, null)))), 30, 30)),
    waGrow('ml-gen-ok', ok(96, 80, 7)), frame(78, 32, 36, 58, 6)),

  // ── 3856 Neurala nätverk ───────────────────────────────────────────
  /** hjärna: a person's head seen from the side, with the top cut open like a window so that a big pink brain with folds shows inside. */
  'mlrn.hjärna': all(bg(), ground, path('M30 96 L30 80 C16 72 14 46 26 32 C40 14 78 12 92 30 C102 42 100 56 96 62 L104 76 C106 80 102 82 98 82 L96 92 C94 98 86 98 80 96 L78 108 L40 108 Z', C.skin, C.ink, 2),
    path('M28 44 C28 22 52 14 70 16 C88 18 98 32 94 48 C92 58 80 60 72 58 C64 64 50 64 42 58 C32 60 26 54 28 44 Z', C.pink, C.ink, 1.8),
    line('M40 30 C46 34 44 40 50 42 M56 22 C56 30 62 32 60 40 M72 24 C70 32 78 34 76 42 M84 32 C80 38 86 44 82 50 M36 46 C42 46 46 52 52 50 M58 50 C62 46 68 48 70 54', '#c76a86', 1.6),
    circle(86, 66, 1.8, C.ink, null), ring(60, 40, 30)),
  /** neuralt nätverk: four columns of round nodes (3, 4, 4, 2) where every node is joined by thin lines to every node in the next column; orange nodes on the left, blue in the middle, green on the right; the whole network is framed. */
  'mlrn.neuralt-nätverk': all(bg(), netLines(STD.pos), netNodes(STD.pos), waPulse('ml-nn-in', circle(20, 30, 6, 'none', C.white, 2)), frame(8, 18, 104, 84, 8)),
  /** neuron (i neurala nätverk): the same network in grey, except one big blue node in the middle that is ringed; three orange arrows run into it from the left, a plus sign sits inside it, and one orange arrow leaves it to the right. */
  'mlrn.neuron.2': all(bg(), greyed(netLines(STD.pos), netNodes(STD.pos)),
    arr(26, 30, 52, 50, HL, 2.2), arr(26, 60, 50, 60, HL, 2.2), arr(26, 90, 52, 70, HL, 2.2), circle(62, 60, 12, '#9fc2e6', C.ink, 1.8), txt(62, 66, '+', 16, C.ink, 900),
    waIn('ml-neuron-ut', -6, 0, arr(76, 60, 98, 60, HL, 2.6)), ring(62, 60, 16)),
  /** lager (i neurala nätverk): the same network, all grey except the second column of four blue nodes, which stands out and is framed by a tall orange rounded box. */
  'mlrn.lager-förråd.3': all(bg(), greyed(netLines(STD.pos), netNodes(STD.pos)), ...STD.pos[1]!.map(([x, y]) => circle(x, y, 6, '#9fc2e6', C.ink, 1.4)),
    waPulse('ml-lager', rect(STD.xs[1]! - 11, 20, 22, 80, 'rgba(228,87,46,0.12)', 8, null)), frame(STD.xs[1]! - 11, 20, 22, 80, 8)),
  /** vikt (i neurala nätverk): three nodes on the left joined to one node on the right by lines of very different thickness; the thickest line is orange with a tile showing 0,9 and is framed, the others are thin grey lines with tiles 0,1 and 0,2. */
  'mlrn.vikt.4': all(bg(), circle(20, 26, 8, '#f6b26b', C.ink, 1.4), circle(20, 60, 8, '#f6b26b', C.ink, 1.4), circle(20, 94, 8, '#f6b26b', C.ink, 1.4), circle(98, 60, 11, '#a8dcc0', C.ink, 1.6),
    line('M28 26 L88 56', '#9aa3ad', 1.2), line('M28 94 L88 64', '#9aa3ad', 2), line('M28 60 L87 60', HL, 7),
    greyed(rect(42, 24, 20, 12, C.white, 2, C.ink, 1), mono(52, 33, '0,1', 7.5), rect(42, 84, 20, 12, C.white, 2, C.ink, 1), mono(52, 93, '0,2', 7.5)),
    waPulse('ml-vikt', rect(46, 66, 24, 14, '#fff3e0', 3, C.ink, 1.3), mono(58, 76, '0,9', 9)), frame(42, 50, 32, 34, 5)),
  /** försvaga: a big bright orange wave goes in on the left through a thin pipe between two nodes and comes out on the right as a small, pale wave that keeps shrinking; the small pale wave is framed. */
  'mlrn.försvaga': all(bg(), circle(16, 60, 8, '#f6b26b', C.ink, 1.4), circle(104, 60, 8, '#a8dcc0', C.ink, 1.4), line('M24 60 L96 60', '#9aa3ad', 1),
    path('M22 60 C26 30 34 30 38 60 C42 90 50 90 54 60', 'none', HL, 4),
    g('translate(80 60)', moving('ml-forsvaga', '0%{transform:scale(1.8);opacity:1}70%,100%{transform:scale(1);opacity:.5}', { dur: 2.6 }, path('M-12 0 C-10 -8 -6 -8 -4 0 C-2 8 2 8 4 0 C6 -8 10 -8 12 0', 'none', HL, 2))),
    arr(58, 60, 66, 60, '#7a8590', 1.6), frame(64, 44, 32, 32, 5)),
  /** djupinlärning: a long tunnel of many see-through panels (eight layers) standing one behind the other and getting smaller; a photo of a cat goes in at the front and a bubble with a cat face comes out at the far end; under it, a long arrow shows the depth; all the layers together are framed. */
  'mlrn.djupinlärning': all(bg(), photo(14, 64, g('translate(14 64)', cat(0, 0, 0.7)), 18, 18),
    ...range(8).map((i) => { const x = 28 + i * 9, h = 70 - i * 5; return path(`M${x} ${60 - h / 2} L${x + 6} ${60 - h / 2 + 4} L${x + 6} ${60 + h / 2 - 4} L${x} ${60 + h / 2} Z`, 'rgba(159,194,230,0.55)', C.ink, 1.1); }),
    waIn('ml-djup', -40, 0, circle(70, 60, 2.4, HL, null)),
    path('M98 48 L116 48 L116 64 L110 64 L106 70 L104 64 L98 64 Z', C.white, C.ink, 1.2), cat(107, 56, 0.55),
    arr(28, 104, 100, 104, '#7a8590', 2), frame(24, 18, 76, 84, 6)),
  /** svart låda (som man inte förstår): a big black box with a white question mark; a photo goes in on the left along an arrow and an answer tile with a tick comes out on the right. */
  'mlrn.svart-låda.2': all(bg(), ground, path('M34 40 L86 40 L96 30 L44 30 Z', '#4a4c58', C.ink, 1.6), path('M86 40 L96 30 L96 82 L86 92 Z', '#24252c', C.ink, 1.6), rect(34, 40, 52, 52, C.black, 2, C.ink, 1.8),
    txt(60, 78, '?', 34, C.white, 900), photo(14, 66, g('translate(14 66)', dog(0, 0, 0.7)), 18, 18), arr(24, 66, 32, 66, HL, 2.2),
    arr(97, 66, 104, 66, HL, 2.2), waGrow('ml-svart-ok', ok(110, 66, 6)), ring(60, 64, 34)),

  // ── 3857 Modellutvärdering ─────────────────────────────────────────
  /** träffsäkerhet: a round target board with red and white rings; nine arrows stick in the middle and one arrow missed and sticks in the edge; next to it a column of ten small dots, nine green and one red. */
  'mlrn.träffsäkerhet': all(bg(), ground, line('M48 96 L40 112 M48 96 L56 112', '#a0673d', 3),
    ...[34, 27, 20, 13, 6].map((r, i) => circle(48, 58, r, i % 2 ? C.white : '#e2553a', C.ink, 1.2)),
    ...range(9).map((i) => { const a = i * 0.7, rr = 1.5 + (i % 3) * 2.4; return dart(f1(48 + Math.cos(a) * rr), f1(58 + Math.sin(a) * rr), GREEN); }),
    dart(71, 36, RED),
    ...range(10).map((i) => circle(104, 18 + i * 9, 3, i === 3 ? RED : GREEN, C.ink, 0.8)), frame(96, 11, 16, 96, 4)),
  /** mått (mått på): a round gauge like a speedometer with a red, yellow and green arc and a needle that swings up to the green; under it two machines side by side with bars of different height showing which is better; the gauge is ringed. */
  'mlrn.mått.3': all(bg(), path('M24 60 A36 36 0 0 1 48 26', 'none', RED, 8), path('M48 26 A36 36 0 0 1 72 26', 'none', YEL, 8), path('M72 26 A36 36 0 0 1 96 60', 'none', GREEN, 8),
    ...range(7).map((i) => { const a = Math.PI + (i * Math.PI) / 6; return line(`M${f1(60 + Math.cos(a) * 28)} ${f1(60 + Math.sin(a) * 28)} L${f1(60 + Math.cos(a) * 24)} ${f1(60 + Math.sin(a) * 24)}`, C.ink, 1.4); }),
    g('translate(60 60)', moving('ml-matt', '0%{transform:rotate(-70deg)}60%,100%{transform:rotate(0deg)}', { dur: 2.8 }, path('M-2 0 L18 -16 L2 2 Z', C.ink, null))), circle(60, 60, 3.4, C.ink, null),
    machine(36, 96, MACH, '', 16, 14), machine(84, 96, MACH, '', 16, 14), rect(50, 92, 4, 14, YEL, 1, C.ink, 0.8), rect(98, 84, 4, 22, GREEN, 1, C.ink, 0.8),
    ring(60, 50, 42)),
  /** falsklarm: a white smoke alarm on the ceiling shakes and sends out red sound waves; below it a frying pan with a little steam and no fire; a crossed-out flame floats next to the pan. */
  'mlrn.falsklarm': all(bg(), rect(4, 4, 112, 8, '#d8dde2', 0, null), waShake('ml-falsk-larm', ellipse(60, 18, 18, 6, C.white, C.ink, 1.6), circle(60, 20, 2.4, RED, null)),
    waPulse('ml-falsk-vag', path('M34 20 C30 26 30 32 34 38 M86 20 C90 26 90 32 86 38 M28 16 C22 26 22 36 28 44 M92 16 C98 26 98 36 92 44', 'none', RED, 2.2)),
    ground, rect(16, 92, 88, 20, '#c9ced4', 2, C.ink, 1.4), ellipse(52, 88, 22, 5, '#5a6472', C.ink, 1.6), line('M74 88 L100 84', '#3d3f4a', 4), ellipse(52, 86, 14, 3, '#f2d27a', C.ink, 1),
    path('M46 78 C42 72 50 70 46 62 M56 78 C52 72 60 70 56 64', 'none', '#b9c0c7', 1.6),
    path('M96 66 C88 58 92 50 96 44 C100 52 106 56 100 66 Z', '#ef8a3c', C.ink, 1.2), line('M86 44 L108 68', RED, 3), ring(60, 26, 24)),
  /** förklarbar: a glass box where you can see the gears inside; a photo goes in, and the answer comes out together with a speech bubble that shows the reason as a little chain: dog ear, arrow, dog face; in the corner a small grey black box with a question mark. */
  'mlrn.förklarbar': all(bg(), ground, greyed(rect(92, 90, 18, 18, C.black, 2, C.ink, 1), txt(101, 104, '?', 12, C.white, 900)),
    rect(30, 46, 50, 46, 'rgba(220,240,252,0.6)', 4, C.ink, 1.8), line('M34 50 L44 50', C.white, 2), gear(46, 70, 8, '#f6b26b'), gear(62, 78, 6, '#a8dcc0'), gear(64, 60, 6, '#9fc2e6'),
    photo(12, 70, g('translate(12 70)', dog(0, 0, 0.6)), 16, 16), arr(21, 70, 28, 70, HL, 2), arr(82, 70, 90, 70, HL, 2),
    path('M18 10 L104 10 L104 36 L64 36 L58 44 L56 36 L18 36 Z', C.white, C.ink, 1.4), path('M30 28 C26 20 32 14 36 20 Z', '#6b4428', C.ink, 1), arr(42, 23, 56, 23, '#7a8590', 1.8), dog(70, 23, 0.8), ok(90, 23, 5),
    frame(26, 6, 82, 90, 7)),
};
