/**
 * Matematik & naturvetenskap → Biologi → Mikrobiologi, 3541–3547 (0.52): the build of bacteria, viruses, archaea,
 * microscopic fungi, routes of infection, antibiotic resistance and microorganisms in ecosystems.
 * Recurring signs: a bacterium is a green rounded rod; a virus is a magenta ball with knobbed spikes; archaea are
 * orange lobed cells; yeast is a cream oval with a bud. The part the word names is ringed or framed in orange, and a
 * grey reference shows what the word is not.
 * Close words share one layout where only the marked part differs: stavformig/klotformig/spiralformig (three
 * panels, one framed), värdcell/infektera (the cell ringed and full of new viruses, or the virus entering along an
 * orange arrow), fotsvamp/nagelsvamp (the same toes; the skin between them or the big toenail is ringed),
 * odla (streak → warmth → colonies) / bakteriekoloni (one dot ringed and zoomed) / odling (a throat swab sent to a dish).
 * Digits, maths signs and chemical symbols only; no words, no brands, no protected emblems.
 */
import { C, all, arrow, circle, ellipse, g, hand, line, path, rect, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';
import { figure } from './figures';
import { headFront } from './body';
import { thumbsUp } from './medical';

// ── Palette and basics ───────────────────────────────────────────────
const BAC = '#9fd07a';
const BAC2 = '#4f8a35';
const VIR = '#d0679a';
const VIR2 = '#8a3460';
const ARC = '#f2a65a';
const ARC2 = '#b8662a';
const YEAST = '#f3e2b0';
const MOULD = '#5fa65a';
const AGAR = '#f6e7b4';
const CYTO = '#fde3dc';
const MEM = '#d9798b';
const NUC = '#b49ade';
const WATER = '#d7ecf8';
const SOIL = '#a87a52';
const CYAN = '#3fa38f';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const ring = (x: number, y: number, r: number, col: string = HL, sw = 2.6) => circle(x, y, r, 'none', col, sw);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL, sw = 2.6) => ellipse(x, y, rx, ry, 'none', col, sw);
const frame = (x: number, y: number, w: number, h: number, col: string = HL, sw = 2.6) => rect(x, y, w, h, 'none', 5, col, sw);
const num = (x: number, y: number, s: string, size = 10, col: string = C.ink) => T(x, y, s, size, col);
const cross = (x: number, y: number, r: number, col: string = C.red) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 2.6);

// ── Microbes ─────────────────────────────────────────────────────────
/** Rod-shaped bacterium (28 × 12 at s = 1). */
const rod = (x: number, y: number, s = 1, rot = 0, fill: string = BAC) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  rect(-14, -6, 28, 12, fill, 6, C.ink, 1.4), circle(-5, -1, 1.2, BAC2, null), circle(4, 2, 1.2, BAC2, null), circle(7, -2, 1, BAC2, null));
const coccus = (x: number, y: number, r = 5, fill: string = BAC) => all(circle(x, y, r, fill, C.ink, 1.3), circle(x - r * 0.3, y - r * 0.2, r * 0.22, BAC2, null));
/** Spiral bacterium: a thick wavy band, 32 long at s = 1. */
const spiro = (x: number, y: number, s = 1, rot = 0, fill: string = BAC) => {
  const d = 'M-16 0 C-14 -7 -10 -7 -8 0 C-6 7 -2 7 0 0 C2 -7 6 -7 8 0 C10 7 14 7 16 0';
  return g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, line(d, C.ink, 6), line(d, fill, 3.6));
};
/** Virus: ball with knobbed spikes. */
const virus = (x: number, y: number, r: number, fill: string = VIR) => all(
  ...range(12).map((i) => { const a = (i / 12) * Math.PI * 2; const x1 = x + Math.cos(a) * r, y1 = y + Math.sin(a) * r, x2 = x + Math.cos(a) * r * 1.38, y2 = y + Math.sin(a) * r * 1.38;
    return all(line(`M${f1(x1)} ${f1(y1)} L${f1(x2)} ${f1(y2)}`, C.ink, Math.max(1, r * 0.12)), circle(f1(x2), f1(y2), f1(Math.max(1.2, r * 0.16)), fill, C.ink, Math.max(0.6, r * 0.05))); }),
  circle(x, y, r, fill, C.ink, Math.max(1, r * 0.08)), circle(f1(x - r * 0.3), f1(y - r * 0.25), f1(r * 0.16), VIR2, null), circle(f1(x + r * 0.35), f1(y + r * 0.1), f1(r * 0.12), VIR2, null), circle(f1(x - r * 0.05), f1(y + r * 0.4), f1(r * 0.1), VIR2, null));
/** Bacteriophage standing on (x, y) (foot level), height ≈ 50 at s = 1. */
const phage = (x: number, y: number, s = 1, fill = '#9a7bd0') => {
  const hex = range(6).map((i) => { const a = (i / 6) * Math.PI * 2 + Math.PI / 6; return `${f1(Math.cos(a) * 11)} ${f1(-38 + Math.sin(a) * 11)}`; }).join(' L');
  return g(`translate(${x} ${y}) scale(${s})`,
    line('M-3 -10 L-14 -2 L-16 0 M3 -10 L14 -2 L16 0 M-2 -10 L-7 0 M2 -10 L7 0', C.ink, 1.6),
    rect(-3, -27, 6, 18, '#c9b6ea', 1.5, C.ink, 1.3), line('M-3 -23 L3 -23 M-3 -19 L3 -19 M-3 -15 L3 -15', C.ink, 0.8),
    rect(-5, -12, 10, 3, fill, 1, C.ink, 1.1), rect(-4.5, -29, 9, 3, fill, 1, C.ink, 1.1),
    path(`M${hex} Z`, fill, C.ink, 1.6), line('M-5 -40 C-2 -44 2 -34 5 -38', '#4a2f80', 1.4));
};
const yeast = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  ellipse(0, 0, 10, 8, YEAST, C.ink, 1.4), circle(10, -5, 4, YEAST, C.ink, 1.3), circle(-2, 1, 2.6, '#d9b86a', null), circle(3, -3, 1.4, '#e0c98c', null));
/** Archaeon: lobed orange cell. */
const arch = (x: number, y: number, s = 1, rot = 0, fill: string = ARC) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  path('M-10 -2 C-12 -10 -4 -12 0 -8 C4 -13 12 -10 10 -3 C14 0 12 9 5 8 C2 12 -6 12 -7 7 C-13 6 -13 0 -10 -2 Z', fill, C.ink, 1.4), circle(-2, 0, 1.4, ARC2, null), circle(3, 3, 1.2, ARC2, null));
/** A happy little microbe face on top of a cell drawn at (x, y). */
const smile = (x: number, y: number, s = 1) => all(circle(x - 2.4 * s, y - 1 * s, 0.9 * s, C.ink, null), circle(x + 2.4 * s, y - 1 * s, 0.9 * s, C.ink, null), line(`M${x - 2.4 * s} ${y + 1.6 * s} Q${x} ${y + 3.6 * s} ${x + 2.4 * s} ${y + 1.6 * s}`, C.ink, 0.9 * s));

// ── Objects ──────────────────────────────────────────────────────────
/** Petri dish seen from slightly above, with agar. */
const dish = (x: number, y: number, rx: number, ry: number) => all(ellipse(x, y + 3, rx, ry, '#e6eef2', '#7a8a96', 1.6), ellipse(x, y, rx, ry, AGAR, '#7a8a96', 1.6), ellipse(x, y, rx - 3, ry - 2.4, 'none', '#d8c890', 1));
const colony = (x: number, y: number, r: number, fill = '#fbf5e6') => circle(x, y, r, fill, '#a99b6e', 0.9);
/** Zoom: small circle at (x1, y1) joined to a big lens at (x2, y2). */
const zoom = (x1: number, y1: number, r1: number, x2: number, y2: number, r2: number, inner: Svg, id: string, bg: string = C.white) => {
  const a = Math.atan2(y2 - y1, x2 - x1), p = Math.PI / 2;
  const l1 = [x1 + Math.cos(a + p) * r1, y1 + Math.sin(a + p) * r1, x2 + Math.cos(a + p) * r2, y2 + Math.sin(a + p) * r2];
  const l2 = [x1 + Math.cos(a - p) * r1, y1 + Math.sin(a - p) * r1, x2 + Math.cos(a - p) * r2, y2 + Math.sin(a - p) * r2];
  return all(line(`M${f1(l1[0]!)} ${f1(l1[1]!)} L${f1(l1[2]!)} ${f1(l1[3]!)} M${f1(l2[0]!)} ${f1(l2[1]!)} L${f1(l2[2]!)} ${f1(l2[3]!)}`, C.grey, 1.2, '3 2'),
    circle(x1, y1, r1, 'none', C.dark, 1.6), `<clipPath id="${id}"><circle cx="${x2}" cy="${y2}" r="${r2}"/></clipPath>`, circle(x2, y2, r2, bg, null),
    `<g clip-path="url(#${id})">${inner}</g>`, circle(x2, y2, r2, 'none', C.dark, 2.4));
};
const thermo = (x: number, y: number, level: number, col: string = C.red) => all(rect(x - 3.5, y - 40, 7, 40, C.white, 3.5, C.ink, 1.4), rect(x - 1.6, y - level, 3.2, level, col, 1.6, null), circle(x, y + 2, 5.5, col, C.ink, 1.4),
  line(`M${x + 3.5} ${y - 10} l3 0 M${x + 3.5} ${y - 20} l3 0 M${x + 3.5} ${y - 30} l3 0`, C.ink, 1));
const capsule = (x: number, y: number, rot = 0, col: string = C.red, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M0 -4 L-5 -4 C-9 -4 -9 4 -5 4 L0 4 Z', col, C.ink, 1.1), path('M0 -4 L5 -4 C9 -4 9 4 5 4 L0 4 Z', C.white, C.ink, 1.1));
const tablet = (x: number, y: number, r = 4, col: string = C.white) => all(circle(x, y, r, col, C.ink, 1.1), line(`M${x - r * 0.6} ${y} L${x + r * 0.6} ${y}`, C.grey, 0.9));
const swab = (x1: number, y1: number, x2: number, y2: number) => all(line(`M${x1} ${y1} L${x2} ${y2}`, '#e9dcc0', 2.4), line(`M${x1} ${y1} L${x2} ${y2}`, C.ink, 0.5), circle(x2, y2, 3.4, C.white, C.ink, 1.1));
const steam = (x: number, y: number) => line(`M${x} ${y} C${x - 4} ${y - 5} ${x + 4} ${y - 9} ${x} ${y - 14}`, C.grey2, 2);
const leaf = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M0 14 C-12 4 -10 -10 0 -16 C10 -10 12 4 0 14 Z', C.green, C.ink, 1.4), line('M0 14 L0 -12', '#2f6e2a', 1.2));
const germ = (x: number, y: number, r = 2.4) => all(circle(x, y, r, '#8cc65a', '#3f7a2a', 0.9), line(`M${x - r - 1.2} ${y} l-1.6 0 M${x + r + 1.2} ${y} l1.6 0 M${x} ${y - r - 1.2} l0 -1.6`, '#3f7a2a', 0.9));
const blobCell = (x: number, y: number, r: number, stroke: string = MEM, sw = 1.8, fill: string = CYTO) =>
  path(`M${x - r} ${y} C${x - r} ${y - r * 0.9} ${x - r * 0.4} ${y - r * 1.02} ${x + r * 0.1} ${y - r * 0.95} C${x + r * 0.8} ${y - r * 0.9} ${x + r * 1.04} ${y - r * 0.3} ${x + r} ${y + r * 0.1} C${x + r * 0.95} ${y + r * 0.8} ${x + r * 0.3} ${y + r * 0.98} ${x - r * 0.2} ${y + r * 0.92} C${x - r * 0.8} ${y + r * 0.85} ${x - r * 1.02} ${y + r * 0.5} ${x - r} ${y} Z`, fill, stroke, sw);
/** Toes from above for fotsvamp / nagelsvamp. */
function toes(mark: 'skin' | 'nail'): Svg {
  const out: Svg[] = [path('M24 56 C24 44 96 42 98 56 C102 78 96 104 88 120 L34 120 C26 102 22 76 24 56 Z', C.skin, C.ink, 2.4)];
  const tt: [number, number, number, number][] = [[38, 40, 11, 14], [58, 38, 7.5, 10], [72, 41, 6.6, 9], [84, 46, 6, 8], [93, 54, 5, 6.6]];
  for (const [x, y, rx, ry] of tt) out.push(ellipse(x, y, rx, ry, C.skin, C.ink, 2.2));
  for (const [i, [x, y, rx, ry]] of tt.entries()) {
    if (i === 0 && mark === 'nail') out.push(path(`M${x - rx * 0.7} ${y - ry * 0.1} C${x - rx * 0.8} ${y - ry * 0.9} ${x + rx * 0.8} ${y - ry * 0.9} ${x + rx * 0.7} ${y - ry * 0.1} L${x + rx * 0.6} ${y + ry * 0.35} L${x - rx * 0.6} ${y + ry * 0.35} Z`, '#e8c84a', '#9a7a20', 1.6),
      line(`M${x - 3} ${y - 6} L${x - 1} ${y + 2} M${x + 3} ${y - 7} L${x + 4} ${y} M${x - 6} ${y - 1} l2 3`, '#9a7a20', 1.2), circle(x + 2, y - 2, 1.2, '#c9a035', null));
    else out.push(ellipse(x, y - ry * 0.3, rx * 0.55, ry * 0.42, C.rose, C.ink, 1.1));
  }
  if (mark === 'skin') {
    const gaps: [number, number][] = [[49, 52], [66, 52], [79, 56]];
    for (const [x, y] of gaps) out.push(ellipse(x, y, 3.4, 6, '#f3d9d0', '#c8746a', 1.2), line(`M${x - 2} ${y - 3} l2 1 M${x + 1} ${y + 1} l2 1 M${x - 2} ${y + 3} l1.5 1`, C.white, 1.4));
    out.push(oval(64, 54, 22, 12), line('M104 26 l4 -4 l2 4 l4 -4 M104 36 l4 -4 l2 4 l4 -4', C.red, 1.6));
  } else out.push(ring(38, 36, 15), greyed(ellipse(64, 54, 18, 6, 'none', C.grey, 1)));
  return all(...out);
}
/** Stavformig / klotformig / spiralformig: three panels, the chosen one framed, the other two greyed. */
function shapes(which: 0 | 1 | 2): Svg {
  const p = [
    all(rod(22, 36, 0.9, -25), rod(20, 60, 0.9, 20), rod(24, 84, 0.9, -8)),
    all(...[[52, 30], [58, 38], [62, 47], [60, 56], [56, 65], [58, 74], [63, 82], [62, 91]].map(([x, y]) => coccus(x!, y!, 4.6)), coccus(68, 30, 4.6), coccus(68, 39, 4.6)),
    all(spiro(98, 36, 0.85, -20), spiro(98, 60, 0.85, 15), spiro(98, 84, 0.85, -10)),
  ];
  const xs = [5, 43, 81];
  return all(...p.map((s, i) => (i === which ? all(s, frame(xs[i]!, 16, 34, 88, HL, 3)) : greyed(s))));
}

export const MICROBIO_MOTIFS: Record<string, Svg> = {
  // ── 3541 Bakteriers uppbyggnad ──────────────────────────────────
  /** plasmid: a big bacterium; its tangled main DNA greyed, two small separate DNA rings ringed in orange. */
  'mikro.plasmid': all(rect(6, 28, 108, 64, '#dcefc8', 32, BAC2, 2.6),
    greyed(path('M30 58 C26 44 46 40 50 50 C54 60 40 70 34 64 C28 58 44 50 52 58 C60 66 70 52 62 46 C54 40 46 70 58 72 C66 74 70 62 64 58', 'none', '#3a7a3a', 2)),
    ...[[30, 40], [46, 80], [70, 36], [40, 52], [76, 78]].map(([x, y]) => circle(x!, y!, 1.3, '#7a6a8a', null)),
    circle(88, 48, 6, 'none', '#2f6e2a', 2.6), circle(84, 72, 5, 'none', '#2f6e2a', 2.6), ring(88, 48, 10.5), ring(84, 72, 9.5)),
  /** flagell: a bacterium swims in water; its long whip-like tail is orange. */
  'mikro.flagell': all(rect(4, 24, 112, 72, WATER, 6, null), line('M8 50 L18 50 M6 60 L16 60 M8 70 L18 70', C.grey, 1.8),
    line('M60 60 C66 48 72 48 78 60 C84 72 90 72 96 60 C100 52 106 52 112 58', HL, 3.8), rod(40, 60, 1.6), arrow(36, 88, 14, 88, C.grey, 2)),
  /** stavformig: three panels of bacteria; the panel with short straight rods is framed. */
  'mikro.stavformig': shapes(0),
  /** klotformig: the same panels; the ball-shaped bacteria in a chain are framed. */
  'mikro.klotformig': shapes(1),
  /** spiralformig: the same panels; the corkscrew-shaped bacteria are framed. */
  'mikro.spiralformig': shapes(2),
  /** dela sig: one bacterium (1) → the same bacterium pinching in the middle → two bacteria (2). */
  'mikro.dela-sig': all(rod(60, 22, 1.6), num(12, 26, '1', 13),
    path('M32 56 C24 56 24 72 32 72 L54 72 C57 69 63 69 66 72 L88 72 C96 72 96 56 88 56 L66 56 C63 59 57 59 54 56 Z', BAC, C.ink, 1.6),
    circle(42, 62, 1.3, BAC2, null), circle(78, 66, 1.3, BAC2, null), arrow(60, 46, 60, 54, HL, 2.2), arrow(60, 82, 60, 74, HL, 2.2),
    rod(36, 100, 1.35), rod(84, 100, 1.35), num(12, 104, '2', 13), arrow(108, 30, 108, 54, C.grey, 2), arrow(108, 74, 108, 90, C.grey, 2)),
  /** odla (bakterier): a swab streaks an empty dish → warm 37° → the dish is covered with colonies along the streak. */
  'mikro.odla.2': all(dish(28, 44, 24, 16), line('M12 40 L22 48 L30 38 L38 48 L44 42', HL, 1.8), swab(40, 10, 44, 38),
    arrow(54, 44, 66, 44, HL, 3), dish(92, 44, 24, 16),
    ...[[76, 40], [80, 46], [84, 42], [88, 47], [92, 39], [96, 46], [100, 41], [104, 46], [86, 38], [98, 50]].map(([x, y], i) => colony(x!, y!, 1.8 + (i % 3) * 0.5)),
    thermo(48, 104, 26), num(64, 96, '37°', 11), path('M86 70 L98 70 L98 106 L86 106 Z', 'none', null), circle(96, 88, 14, C.white, C.ink, 1.6), line('M96 88 L96 79 M96 88 L103 92', C.ink, 1.8), arrow(84, 70, 92, 62, C.grey, 1.6)),
  /** bakteriekoloni: a dish with cream dots; one dot is ringed and a lens shows it is made of thousands of rods. */
  'mikro.bakteriekoloni': all(dish(38, 80, 34, 22), ...[[20, 76], [30, 88], [26, 70], [44, 92], [56, 84], [58, 72], [36, 66], [46, 76]].map(([x, y], i) => colony(x!, y!, 2.2 + (i % 3) * 0.8)),
    zoom(46, 76, 5, 84, 36, 30, all(rect(50, 0, 70, 70, '#fbf5e6', 0, null), ...range(30).map((i) => rod(60 + (i % 6) * 9 + (Math.floor(i / 6) % 2) * 4, 12 + Math.floor(i / 6) * 9, 0.32, (i * 37) % 180))), 'mz1')),
  /** mjölksyrabakterie: milk → a bowl of yoghurt with a spoon; a lens shows chains of small rods in it. */
  'mikro.mjölksyrabakterie': all(ground(), greyed(path('M8 112 L8 76 L14 68 L26 68 L32 76 L32 112 Z', C.white, C.ink, 1.6)), arrow(34, 96, 44, 96, C.grey, 2),
    path('M44 88 L88 88 C88 104 80 112 66 112 C52 112 44 104 44 88 Z', C.white, C.ink, 1.8), ellipse(66, 88, 22, 5, '#fbf8ef', C.ink, 1.4), line('M76 86 L92 66', C.silver, 3), line('M76 86 L92 66', C.ink, 0.6),
    zoom(60, 88, 5, 82, 34, 28, all(rect(50, 0, 70, 70, '#fbf8ef', 0, null), ...range(4).map((r) => all(...range(4).map((i) => rod(62 + i * 11, 16 + r * 12 + (i % 2) * 2, 0.36, (r % 2 ? 8 : -8), '#bfe39a'))))), 'mz2')),

  // ── 3542 Virus och viruspartiklar ───────────────────────────────
  /** virus: a big magenta ball with knobbed spikes, two small copies beside it. */
  'mikro.virus': all(virus(58, 58, 30), virus(102, 22, 7), virus(100, 98, 6), virus(16, 100, 5)),
  /** värdcell: a body cell with its outline orange; inside it, many new virus particles; one virus still sits outside. */
  'mikro.värdcell': all(blobCell(60, 62, 44, HL, 3.4), circle(48, 66, 9, NUC, C.ink, 1.4),
    ...[[70, 40], [80, 56], [74, 74], [62, 86], [86, 72], [64, 52], [44, 44], [34, 70], [52, 82], [90, 50]].map(([x, y]) => virus(x!, y!, 3.4)), virus(108, 16, 6)),
  /** proteinhölje: a cut-open virus: the six-sided outer shell is orange, the coiled DNA inside is greyed. */
  'mikro.proteinhölje': all(path(range(6).map((i) => { const a = (i / 6) * Math.PI * 2 + Math.PI / 6; return `${i ? 'L' : 'M'}${f1(56 + Math.cos(a) * 44)} ${f1(58 + Math.sin(a) * 44)}`; }).join(' ') + ' Z', HL, C.ink, 2.2),
    path(range(6).map((i) => { const a = (i / 6) * Math.PI * 2 + Math.PI / 6; return `${i ? 'L' : 'M'}${f1(56 + Math.cos(a) * 34)} ${f1(58 + Math.sin(a) * 34)}`; }).join(' ') + ' Z', '#fdf2ec', C.ink, 1.6),
    ...range(12).map((i) => { const a = (i / 12) * Math.PI * 2; return circle(f1(56 + Math.cos(a) * 39), f1(58 + Math.sin(a) * 39), 3, '#f7a27e', C.ink, 0.8); }),
    greyed(path('M40 50 C36 40 52 36 56 46 C60 56 44 62 46 70 C48 78 64 76 66 66 C68 56 76 52 72 44', 'none', '#6a4f9e', 3)), greyed(virus(108, 104, 6))),
  /** infektera: a virus travels along an orange arrow into a cell and its orange DNA goes inside. */
  'mikro.infektera': all(blobCell(74, 72, 38), circle(84, 80, 8, NUC, C.ink, 1.4), virus(20, 22, 10), arrow(30, 32, 48, 50, HL, 3.4),
    path('M50 56 C56 60 52 66 58 68 C64 70 60 76 66 78', 'none', HL, 2.4)),
  /** bakteriofag: a little machine-like virus with a six-sided head, tail and legs stands on a big bacterium and injects its DNA. */
  'mikro.bakteriofag': all(rect(6, 74, 108, 40, BAC, 18, C.ink, 1.8), circle(30, 92, 1.6, BAC2, null), circle(88, 98, 1.6, BAC2, null),
    phage(56, 74, 1.3), line('M56 76 C52 82 60 86 56 92 C52 98 60 100 58 106', '#6a4f9e', 2, '3 2'), greyed(phage(98, 74, 0.6))),
  /** förkylning: a person with a red nose, a scarf and a thermometer in the mouth, holding a tissue. */
  'mikro.förkylning': all(headFront([], { frown: true, skinMarks: all(ellipse(60, 70, 7, 6, '#e8685c', null), ellipse(42, 70, 6, 3.6, '#f4a8a0', null), ellipse(78, 70, 6, 3.6, '#f4a8a0', null)) }),
    path('M36 98 C48 106 72 106 84 98 L88 110 C70 118 50 118 32 110 Z', C.red, C.ink, 1.8), line('M40 104 L36 116', C.red, 5),
    line('M66 84 L92 96', C.white, 3.4), line('M66 84 L92 96', C.ink, 0.6), circle(92, 96, 2.4, C.red, C.ink, 1),
    path('M8 70 C4 62 12 56 18 60 C24 54 30 62 26 68 C30 74 22 80 16 76 C10 80 4 76 8 70 Z', C.white, C.ink, 1.4), line('M98 40 l3 6 M104 36 l3 6', C.sky, 2)),
  /** munsår: a face; small blisters at the corner of the mouth are ringed. */
  'mikro.munsår': all(headFront([], {}), ...[[71, 83], [74, 81], [73, 86], [76, 84], [70, 87]].map(([x, y]) => all(circle(x!, y!, 2.6, '#e88b7a', null), circle(x!, y!, 1.7, '#fff3d6', '#c8746a', 0.6))), ring(73, 84, 9)),
  /** vårta: a thumb; a rough little bump on it is ringed. */
  'mikro.vårta': all(thumbsUp(), circle(74, 30, 5.5, '#e2b48c', C.ink, 1.2), ...[[72, 28], [76, 31], [73, 33], [76, 27]].map(([x, y]) => circle(x!, y!, 0.9, '#a47a56', null)), ring(74, 30, 10)),

  // ── 3543 Arkéer ─────────────────────────────────────────────────
  /** arké: a steaming hot spring with orange edges; a lens shows lobed orange cells living in the hot water. */
  'mikro.arké': all(ellipse(34, 96, 30, 12, ARC, C.ink, 1.6), ellipse(34, 96, 22, 8, '#f6d36b', null), ellipse(34, 96, 14, 5, '#8fd0e6', null), steam(24, 84), steam(36, 82), steam(46, 86),
    zoom(34, 96, 5, 80, 40, 32, all(rect(40, 0, 80, 80, '#d6eef6', 0, null), arch(70, 28, 1), arch(92, 36, 0.9, 40), arch(76, 52, 1.1, -20), arch(96, 58, 0.8, 80), arch(62, 46, 0.7, 10), rect(84, 16, 12, 10, ARC, 1, C.ink, 1.2)), 'mz3')),
  /** värmeälskande: a bubbling beaker at 90° full of happy orange cells is framed; a cool beaker at 20° with one cell is greyed. */
  'mikro.värmeälskande': all(ground(),
    path('M10 50 L52 50 L52 106 C52 110 48 112 44 112 L18 112 C14 112 10 110 10 106 Z', '#f6b39a', C.ink, 1.8), ...[[18, 66], [30, 60], [44, 70], [22, 88], [36, 82], [46, 96], [26, 100]].map(([x, y]) => all(arch(x!, y!, 0.55), smile(x!, y!, 0.6))),
    circle(20, 56, 2, C.white, C.ink, 0.8), circle(38, 54, 2.4, C.white, C.ink, 0.8), steam(20, 44), steam(32, 42), steam(44, 44), thermo(4, 98, 36), num(30, 22, '90°', 12, C.red), frame(2, 10, 56, 104),
    greyed(path('M68 50 L110 50 L110 106 C110 110 106 112 102 112 L76 112 C72 112 68 110 68 106 Z', WATER, C.ink, 1.8), arch(90, 84, 0.55), thermo(116, 98, 10, C.sky), num(90, 30, '20°', 12))),
  /** syrefri: water with O₂ above a layer of dark mud; in the framed mud O₂ is crossed out and cells make gas bubbles. */
  'mikro.syrefri': all(rect(4, 6, 112, 46, WATER, 4, null), num(26, 26, 'O₂', 11, C.navy), num(66, 40, 'O₂', 11, C.navy), num(96, 22, 'O₂', 11, C.navy),
    rect(4, 52, 112, 60, '#6f5038', 4, null), ...[[22, 92], [50, 100], [80, 90], [100, 102], [36, 72]].map(([x, y]) => arch(x!, y!, 0.6)),
    ...[[30, 60], [60, 64], [88, 58], [70, 74]].map(([x, y]) => circle(x!, y!, 2.2, '#e8eef2', '#b8c4cc', 0.8)), num(62, 90, 'O₂', 12, C.white), cross(62, 86, 9), frame(4, 52, 112, 60, HL, 3)),
  /** våm: a cow; inside its belly the big first stomach is shown and ringed in orange, full of grass and tiny cells. */
  'mikro.våm': all(ground(), line('M30 76 L28 110 M42 78 L42 110 M78 78 L78 110 M90 76 L92 110', C.ink, 4),
    ellipse(60, 58, 42, 22, C.white, C.ink, 2), path('M30 44 C36 40 44 44 42 52 C36 56 28 52 30 44 Z', C.dark, null), path('M76 66 C84 64 90 70 84 76 C78 78 72 72 76 66 Z', C.dark, null),
    path('M98 46 C104 36 116 40 116 52 C116 62 108 66 100 62 Z', C.white, C.ink, 2), circle(108, 49, 1.6, C.ink, null), line('M100 40 L96 34 M108 38 L110 32', C.ink, 1.8), line('M18 56 C10 60 10 70 14 76', C.ink, 2),
    circle(56, 58, 15, '#d8eec4', C.ink, 1.4), line('M48 54 l6 -2 M52 62 l7 1 M58 52 l5 3 M60 64 l4 -3', C.green, 1.6), ...[[50, 58], [62, 56], [56, 64], [64, 60]].map(([x, y]) => circle(x!, y!, 1.3, ARC2, null)), ring(56, 58, 19, HL, 3)),

  // ── 3544 Mikroskopiska svampar ──────────────────────────────────
  /** svamp (organism): a mushroom, a mouldy bread slice and yeast cells together in an orange frame; a grey flower and dog below. */
  'mikro.svamp.3': all(path('M8 40 C8 24 40 24 40 40 Z', '#c8743c', C.ink, 1.6), rect(20, 40, 8, 22, '#f3e6cc', 2, C.ink, 1.4), circle(16, 34, 2, C.white, null), circle(30, 32, 2.4, C.white, null),
    path('M46 62 L46 34 C40 32 40 22 50 22 L70 22 C80 22 80 32 74 34 L74 62 Z', '#f6e2b0', '#c98a4a', 2.4), ...[[54, 40, 5], [64, 50, 4], [56, 54, 3]].map(([x, y, r]) => circle(x!, y!, r!, MOULD, '#2f6e2a', 0.8)),
    yeast(92, 32, 0.8), yeast(102, 52, 0.7, 30), yeast(88, 54, 0.6, -20), frame(4, 14, 112, 54),
    greyed(line('M28 112 L28 86', '#3f7a35', 2), circle(28, 82, 7, C.pink, C.ink, 1.2), circle(28, 82, 2.6, C.yellow, null), g('translate(86 102) scale(0.7)', ellipse(0, 0, 16, 9, C.tan, C.ink, 1.6), circle(15, -9, 7, C.tan, C.ink, 1.6), line('M-10 7 L-11 16 M-3 8 L-3 16 M6 8 L6 16 M12 7 L13 16', C.ink, 2.4)))),
  /** jästsvamp: a grey yeast packet; a lens shows oval cells with small buds growing out of them; one is ringed. */
  'mikro.jästsvamp': all(greyed(rect(6, 86, 26, 20, '#f3e2b0', 2, C.ink, 1.4), line('M6 92 L32 92', C.ink, 1)), zoom(22, 92, 5, 70, 50, 42, all(rect(28, 0, 92, 100, '#fffaf0', 0, null),
    yeast(56, 30, 1.3, -10), yeast(90, 36, 1.1, 30), yeast(62, 66, 1.2, 20), yeast(94, 72, 1.0, -40), yeast(44, 52, 0.8, 70), yeast(78, 88, 0.8, 0)), 'mz4'), ring(60, 28, 18)),
  /** surdeg: a glass jar with bubbly dough and a rubber band; a bag of flour and a loaf beside it. */
  'mikro.surdeg': all(ground(), path('M30 36 L74 36 L74 104 C74 110 70 112 64 112 L40 112 C34 112 30 110 30 104 Z', 'rgba(215,236,248,0.6)', C.ink, 2), rect(28, 30, 48, 8, C.grey2, 3, C.ink, 1.4),
    path('M33 66 C40 60 50 64 56 60 C62 64 68 60 71 64 L71 104 C71 108 68 110 64 110 L40 110 C36 110 33 108 33 104 Z', '#f1e2bf', null), line('M30 62 L74 62', C.red, 2.4),
    ...[[40, 76, 2], [52, 84, 3], [62, 72, 2], [46, 96, 2.4], [64, 94, 1.6], [56, 102, 2]].map(([x, y, r]) => circle(x!, y!, r!, '#fffaf0', '#c9b48a', 0.8)),
    greyed(path('M86 112 L84 80 L90 74 L106 74 L112 80 L110 112 Z', C.white, C.ink, 1.6)), path('M6 112 C4 96 24 96 24 112 Z', '#d29a5a', C.ink, 1.6)),
  /** blåmögelost: a wedge of cheese with blue-green veins. */
  'mikro.blåmögelost': all(ground(), path('M14 84 L98 52 L106 66 L106 98 L14 98 Z', '#f6efd6', C.ink, 2), path('M14 84 L98 52 L106 66 L22 92 Z', '#fbf6e4', C.ink, 1.6), line('M22 92 L22 98', C.ink, 1.4),
    line('M30 92 C36 88 40 94 46 90 M56 94 C60 86 66 92 70 86 M80 92 C84 84 90 88 96 80 M40 86 C44 82 50 84 54 80', '#4f8a8a', 2.2),
    ...[[34, 94], [62, 90], [88, 86], [98, 92], [48, 95], [74, 95]].map(([x, y]) => circle(x!, y!, 1.6, '#3d7a7a', null)), line('M60 28 L96 46', C.silver, 4), line('M40 18 L60 28', C.brown, 5)),
  /** fotsvamp: toes from above; the red, flaky skin between the toes is ringed, with itch marks. */
  'mikro.fotsvamp': toes('skin'),
  /** nagelsvamp: the same toes; the thick, yellow, cracked big toenail is ringed. */
  'mikro.nagelsvamp': toes('nail'),

  // ── 3545 Smittvägar ─────────────────────────────────────────────
  /** armveck: a person coughs into the inside of the bent elbow; the droplets stop there, and the elbow crease is ringed. */
  'mikro.armveck': all(ground(), path('M28 112 L30 76 C30 68 62 68 64 76 L66 112 Z', C.green, C.ink, 2), circle(54, 50, 15, C.skin, C.ink, 2), path('M40 46 C40 30 68 30 68 44 C62 38 48 38 40 46 Z', C.hair, C.ink, 1.6),
    circle(60, 47, 1.4, C.ink, null), ellipse(67, 56, 2.2, 1.6, C.ink, null), ...[[71, 57], [72, 52], [73, 61]].map(([x, y]) => circle(x!, y!, 1.3, C.sky, null)),
    line('M56 80 L82 54', C.ink, 12), line('M56 80 L82 54', C.green, 9), line('M82 54 L62 30', C.ink, 12), line('M82 54 L62 30', C.green, 9), circle(60, 28, 4.4, C.skin, C.ink, 1.4),
    line('M76 54 L80 50', C.ink, 1.2), ring(76, 53, 9)),
  /** munskydd: a face wearing a pale blue pleated mask over the nose and mouth. */
  'mikro.munskydd': all(headFront([], {}), path('M36 66 C48 62 72 62 84 66 L82 88 C74 96 46 96 38 88 Z', '#cfe6f3', C.ink, 2), line('M38 72 C50 70 70 70 82 72 M38 79 C50 77 70 77 82 79 M39 86 C50 84 70 84 81 86', '#8cb6cc', 1.4),
    line('M36 68 C30 64 28 64 28 62 M38 86 C32 80 28 74 28 70 M84 68 C90 64 92 64 92 62 M82 86 C88 80 92 74 92 70', C.white, 1.8)),
  /** dörrhandtag: a door; its handle is ringed, small green germs sit on it, and a hand reaches for it. */
  'mikro.dörrhandtag': all(ground(), rect(14, 6, 70, 106, '#c98a4a', 2, C.ink, 2), rect(22, 16, 54, 36, '#d9a066', 2, '#9a6436', 1.2), rect(22, 62, 54, 40, '#d9a066', 2, '#9a6436', 1.2),
    rect(64, 52, 10, 14, C.silver, 2, C.ink, 1.4), rect(52, 54, 22, 6, C.silver, 3, C.ink, 1.6), germ(56, 52, 1.8), germ(64, 50, 1.6), germ(70, 62, 1.6), ring(64, 58, 15), hand(104, 60, 1.6, 180)),
  /** salmonella: a raw chicken leg and an egg on a cutting board; a lens shows rod bacteria with many thin hairs. */
  'mikro.salmonella': all(ground(), rect(6, 96, 76, 10, '#e2c08a', 3, C.ink, 1.6), path('M16 94 C10 82 22 72 34 76 C44 80 46 88 40 92 L54 94 Z', '#f4b8b0', C.ink, 1.6), rect(52, 88, 10, 6, C.white, 3, C.ink, 1.2),
    ellipse(70, 90, 6, 7.5, '#f6ead6', C.ink, 1.4),
    zoom(30, 84, 5, 82, 38, 32, all(rect(40, 0, 80, 80, '#fff4f2', 0, null), ...[[70, 26, 20], [96, 40, -30], [74, 54, 60], [96, 64, 10]].map(([x, y, r]) => all(g(`translate(${x} ${y}) rotate(${r})`, line('M-14 -6 l-4 -4 M-6 -6 l-2 -6 M4 -6 l2 -6 M12 -6 l4 -4 M-14 6 l-4 4 M-6 6 l-2 6 M4 6 l2 6 M12 6 l4 4', C.ink, 0.8)), rod(x!, y!, 0.8, r!, '#e88e8e')))), 'mz5')),
  /** blodsmitta: a drop of blood with a virus goes from one person through a used syringe to another person. */
  'mikro.blodsmitta': all(ground(), figure({ x: 16, h: 0.62, top: C.sky }), figure({ x: 104, h: 0.62, top: C.green }),
    g('translate(60 44) rotate(-10)', rect(-22, -6, 36, 12, 'rgba(255,255,255,0.8)', 2, C.ink, 1.6), rect(-20, -4, 22, 8, C.red, 1, null), rect(14, -1.5, 6, 3, C.grey2, 0, C.ink, 1), line('M20 0 L34 0', C.ink, 1.6), rect(-30, -8, 8, 16, C.grey2, 1, C.ink, 1.2)),
    path('M60 64 C56 72 54 76 60 80 C66 76 64 72 60 64 Z', C.red, C.ink, 1.2), virus(60, 75, 2.2, C.white), arrow(28, 92, 48, 80, HL, 2.6), arrow(72, 80, 92, 92, HL, 2.6)),
  /** smittbärare: a smiling, healthy-looking person full of green germs is ringed; arrows go to two grey, sick people. */
  'mikro.smittbärare': all(ground(), figure({ x: 60, h: 0.9, top: C.orange }), ...[[52, 52], [68, 58], [56, 72], [66, 80], [50, 88], [62, 40], [72, 70]].map(([x, y]) => germ(x!, y!, 2)),
    oval(60, 70, 24, 44), greyed(figure({ x: 14, h: 0.55, face: 'neutral' }), figure({ x: 106, h: 0.55, face: 'neutral' })), thermo(26, 70, 30), arrow(36, 60, 24, 66, C.grey, 2), arrow(84, 60, 96, 66, C.grey, 2)),

  // ── 3546 Antibiotikaresistens ───────────────────────────────────
  /** odling (prov): a cotton swab touches the back of an open mouth; an arrow goes to a dish where colonies grow from the sample. */
  'mikro.odling.2': all(g('translate(-14 -6) scale(0.8)', headFront([], {}), ellipse(60, 84, 10, 7, '#7a2f36', C.ink, 1.6), ellipse(60, 88, 6, 3, '#e86f7a', null)),
    swab(96, 50, 36, 60), arrow(74, 90, 84, 100, HL, 2.6), dish(100, 104, 16, 8), colony(94, 103, 1.8), colony(100, 106, 2.2), colony(106, 102, 1.6), colony(100, 101, 1.4)),
  /** penicillin: a dish of bacteria with a green mould spot in the middle; around the mould an orange-ringed zone is empty of bacteria. */
  'mikro.penicillin': all(dish(60, 60, 52, 40), ...range(30).map((i) => { const a = i * 2.4, rr = 30 + (i % 4) * 4; return colony(f1(60 + Math.cos(a) * rr), f1(60 + Math.sin(a) * rr * 0.68), 2 + (i % 3) * 0.5); }),
    circle(60, 60, 9, MOULD, '#2f6e2a', 1.2), ...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(60 + Math.cos(a) * 9)} ${f1(60 + Math.sin(a) * 9)} L${f1(60 + Math.cos(a) * 13)} ${f1(60 + Math.sin(a) * 13)}`, '#2f6e2a', 1.4); }),
    oval(60, 60, 24, 17, HL, 2.6)),
  /** resistent: capsules rain down on bacteria; the grey ones are crossed out, one bacterium behind a shield is ringed and alive. */
  'mikro.resistent': all(ground(), ...[[20, 14, 30], [44, 10, -20], [70, 16, 50], [96, 8, 10]].map(([x, y, r]) => capsule(x!, y!, r!)), arrow(20, 24, 20, 44, C.grey, 1.8), arrow(44, 22, 44, 58, C.grey, 1.8), arrow(96, 20, 92, 46, C.grey, 1.8),
    greyed(rod(20, 66, 1), rod(40, 92, 1, 20), rod(18, 98, 1, -30)), cross(20, 66, 6), cross(40, 92, 6), cross(18, 98, 6),
    path('M74 50 L104 50 C104 76 96 90 89 96 C82 90 74 76 74 50 Z', '#cfe6f3', C.navy, 2), rod(89, 76, 1.1), smile(89, 75, 0.9), arrow(92, 46, 108, 34, C.grey, 1.6), ring(89, 76, 26)),
  /** överanvändning: one grey tablet is enough; next to it a measuring glass overflows with far too many orange-framed pills. */
  'mikro.överanvändning': all(ground(), greyed(tablet(16, 104, 5), num(16, 88, '1', 12)),
    path('M42 46 L88 46 L84 112 L46 112 Z', 'rgba(215,236,248,0.6)', C.ink, 1.8), line('M44 80 L86 80', C.grey, 1.6, '4 3'),
    ...range(22).map((i) => { const x = 48 + (i % 6) * 6.6, y = 106 - Math.floor(i / 6) * 8; return i % 2 ? capsule(x, y, (i * 40) % 180, C.red, 0.8) : tablet(x, y, 3.4); }),
    ...[[52, 40, 20], [64, 34, -30], [78, 38, 60], [94, 50, 10], [100, 70, 80], [104, 106, -20], [96, 100, 40]].map(([x, y, r]) => capsule(x!, y!, r!, C.red, 0.8)), tablet(70, 44, 3.4), tablet(110, 92, 3.4),
    frame(38, 26, 78, 88)),

  // ── 3547 Mikroorganismer i ekosystem ────────────────────────────
  /** rotknöl (på baljväxter): a pea plant with a pod; under the soil its roots carry small round pink knobs that are ringed. */
  'mikro.rotknöl.2': all(rect(4, 50, 112, 62, SOIL, 3, null), line('M4 50 L116 50', C.ink, 1.6), line('M60 50 L60 12', '#3f7a35', 2.4), leaf(48, 26, 0.7, -60), leaf(72, 34, 0.7, 60), leaf(50, 42, 0.6, -70),
    path('M64 18 C78 14 84 22 80 28 C74 30 66 26 64 18 Z', '#8cc65a', C.ink, 1.2),
    line('M60 50 L58 72 L50 96 M58 72 L74 92 M60 50 L40 66 L30 84 M60 50 L84 64 L96 80 M50 96 L44 106 M74 92 L82 104', '#e8d6b0', 2),
    ...[[44, 63], [34, 78], [54, 84], [68, 84], [78, 98], [90, 74], [80, 66], [48, 100]].map(([x, y]) => circle(x!, y!, 3.6, '#f2a0a6', C.ink, 1)), ring(54, 84, 7.5), ring(90, 74, 7.5), ring(34, 78, 7.5)),
  /** kvävefixerande: N₂ from the air goes into a ringed cluster of bacteria in the soil, which send nourishment up to a plant. */
  'mikro.kvävefixerande': all(rect(4, 62, 112, 50, SOIL, 3, null), line('M4 62 L116 62', C.ink, 1.6), circle(22, 18, 6, '#8cb6e8', C.ink, 1.2), circle(32, 18, 6, '#8cb6e8', C.ink, 1.2), num(27, 36, 'N₂', 11, C.navy),
    arrow(30, 40, 46, 76, HL, 3), circle(60, 88, 16, '#c9a07a', C.ink, 1.2), rod(54, 82, 0.5, 20), rod(66, 86, 0.5, -30), rod(58, 94, 0.5, 70), rod(66, 96, 0.5, 0), ring(60, 88, 20),
    arrow(78, 80, 92, 54, C.green, 3), line('M96 62 L96 30', '#3f7a35', 2.4), leaf(88, 36, 0.8, -50), leaf(104, 44, 0.8, 50), leaf(96, 22, 0.6, 0)),
  /** cyanobakterie: a lake with green scum in the sun; a lens shows chains of blue-green beads, one chain ringed. */
  'mikro.cyanobakterie': all(circle(14, 14, 8, C.yellow, C.ink, 1.2), rect(4, 76, 112, 36, '#7fb8d6', 4, null), path('M4 76 C20 72 30 80 46 76 C62 72 76 80 92 76 C104 74 110 78 116 76 L116 84 L4 84 Z', '#6db04a', null),
    ...[[14, 80], [30, 82], [60, 80], [84, 82], [104, 80]].map(([x, y]) => circle(x!, y!, 2, '#4c9a36', null)),
    zoom(40, 80, 5, 78, 40, 32, all(rect(40, 0, 80, 80, '#eaf6f2', 0, null),
      ...[[58, 22, 0], [62, 50, 20], [86, 64, -10]].map(([x, y, r]) => g(`translate(${x} ${y}) rotate(${r})`, ...range(7).map((i) => circle(i * 7, 0, i === 3 ? 4 : 3.2, i === 3 ? '#cfe2a0' : CYAN, C.ink, 0.8))))), 'mz6'), oval(84, 25, 26, 8)),
};
