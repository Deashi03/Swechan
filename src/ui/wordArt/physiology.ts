/**
 * Matematik & naturvetenskap → Biologi → Människans fysiologi, 3551–3557 (0.52): the heart, gas exchange in the
 * lungs, the digestive system, nerve impulses, the hormone system, kidney filtration and the immune system's cells.
 * Recurring signs (as in organs.ts): the part the word names is accent orange, the rest is muted; red = oxygen-rich
 * blood, blue = oxygen-poor blood (textbook convention); a grey reference shows what the word is not.
 * Close words share one layout where only the marked part differs: syrerik/syrefattig (two blood drops, one packed
 * with O₂ and a full bar, one with a single O₂ and an empty bar), stora/lilla kretsloppet (heart–body loop or heart–lung loop), axon/dendrit (the same
 * neuron, long fibre or short branches), synaps/signalsubstans (the same synapse, the gap ringed or the released
 * molecules), centrala/perifera nervsystemet (brain + spinal cord, or the nerves out in the body), ätcell/mördarcell/
 * minnescell (eats a bacterium, kills an infected cell, remembers a germ).
 * Digits, maths signs and chemical symbols only; no words, no brands, no protected emblems.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';
import { organs, headInside } from './organs';
import { pointAt } from './limbs';

// ── Palette and basics ───────────────────────────────────────────────
const RED = '#d64545';
const BLUE = '#4a78c2';
const RBC = '#e05252';
const HEART = '#d65b5b';
const LUNG = '#f4b6b6';
const NERVE = '#f2c14e';
const GLAND = '#f2d27a';
const KID = '#b9625a';
const SKINB = '#f6e3d3';
const WBC = '#eef0fb';
const WBC_N = '#8a6bbf';
const BACT = '#7cb342';
const VIR = '#9b59b6';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ring = (x: number, y: number, r: number, col: string = HL, sw = 2.6) => circle(x, y, r, 'none', col, sw);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL, sw = 2.6) => ellipse(x, y, rx, ry, 'none', col, sw);
const num = (x: number, y: number, s: string, size = 10, col: string = C.ink) => T(x, y, s, size, col);
const o2 = (x: number, y: number, s = 1, col = '#5aa7d6') => g(`translate(${x} ${y}) scale(${s})`, circle(-2.4, 0, 2.6, col, C.ink, 0.8), circle(2.4, 0, 2.6, col, C.ink, 0.8));
const co2 = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, circle(-3.6, 0, 2.2, '#c9ced4', C.ink, 0.7), circle(0, 0, 2.8, '#555', C.ink, 0.8), circle(3.6, 0, 2.2, '#c9ced4', C.ink, 0.7));
const rbc = (x: number, y: number, s = 1, col: string = RBC) => g(`translate(${x} ${y}) scale(${s})`, ellipse(0, 0, 7, 5, col, C.ink, 1.2), ellipse(0, 0, 3.4, 2.2, 'rgba(0,0,0,0.15)', null));
const bact = (x: number, y: number, s = 1, rot = 0, col: string = BACT) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-7, -3, 14, 6, col, 3, C.ink, 1), line('M-7 0 l-4 -2 M7 0 l4 2', C.ink, 0.8));
const virus = (x: number, y: number, s = 1, col: string = VIR) => g(`translate(${x} ${y}) scale(${s})`,
  ...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return all(line(`M${f1(Math.cos(a) * 5)} ${f1(Math.sin(a) * 5)} L${f1(Math.cos(a) * 8)} ${f1(Math.sin(a) * 8)}`, C.ink, 1), circle(f1(Math.cos(a) * 8.6), f1(Math.sin(a) * 8.6), 1.3, col, C.ink, 0.6)); }),
  circle(0, 0, 5.4, col, C.ink, 1.2));
const drop = (x: number, y: number, s = 1, col = '#8cc7e8') => path(`M${x} ${y - 5 * s} C${x + 4 * s} ${y} ${x + 3 * s} ${y + 4 * s} ${x} ${y + 4 * s} C${x - 3 * s} ${y + 4 * s} ${x - 4 * s} ${y} ${x} ${y - 5 * s} Z`, col, C.ink, 0.8);
const zoom = (x1: number, y1: number, r1: number, x2: number, y2: number, r2: number, inner: Svg, id: string) => {
  const a = Math.atan2(y2 - y1, x2 - x1), p = Math.PI / 2;
  const l1 = [x1 + Math.cos(a + p) * r1, y1 + Math.sin(a + p) * r1, x2 + Math.cos(a + p) * r2, y2 + Math.sin(a + p) * r2];
  const l2 = [x1 + Math.cos(a - p) * r1, y1 + Math.sin(a - p) * r1, x2 + Math.cos(a - p) * r2, y2 + Math.sin(a - p) * r2];
  return all(line(`M${f1(l1[0]!)} ${f1(l1[1]!)} L${f1(l1[2]!)} ${f1(l1[3]!)} M${f1(l2[0]!)} ${f1(l2[1]!)} L${f1(l2[2]!)} ${f1(l2[3]!)}`, C.grey, 1.2, '3 2'),
    circle(x1, y1, r1, 'none', C.dark, 1.6), `<clipPath id="${id}"><circle cx="${x2}" cy="${y2}" r="${r2}"/></clipPath>`, circle(x2, y2, r2, C.white, null),
    `<g clip-path="url(#${id})">${inner}</g>`, circle(x2, y2, r2, 'none', C.dark, 2.4));
};
/** Small front body outline (head + trunk + limbs) centred at x, top at y, scale s. */
const body = (x: number, y: number, s = 1, fill = SKINB, stroke: string = C.ink) => g(`translate(${x} ${y}) scale(${s})`,
  path('M0 0 C8 0 10 8 8 16 L6 20 C16 22 24 24 26 30 L34 58 L28 60 L20 38 L18 66 L20 78 L18 114 L4 114 L0 82 L-4 114 L-18 114 L-20 78 L-18 66 L-20 38 L-28 60 L-34 58 L-26 30 C-24 24 -16 22 -6 20 L-8 16 C-10 8 -8 0 0 0 Z', fill, stroke, 2));
const smallHeart = (x: number, y: number, s = 1, col: string = HEART) => g(`translate(${x} ${y}) scale(${s})`, path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', col, C.ink, 1.6));

// ── A blood drop loaded with O₂ and a level bar (syrerik/syrefattig) ──
/** Drop at x: rich = packed with O₂ pairs and a full bar; poor = dark with one O₂ and an almost empty bar. */
function o2Drop(x: number, rich: boolean, grey = false): Svg {
  const d = `M${x} 8 C${x + 24} 36 ${x + 30} 58 ${x + 26} 72 C${x + 22} 88 ${x - 22} 88 ${x - 26} 72 C${x - 30} 58 ${x - 24} 36 ${x} 8 Z`;
  const out: Svg[] = [path(d, rich ? '#e53935' : '#7a1f3a', C.ink, 2.4)];
  const pts: [number, number][] = rich
    ? [[0, 30], [-10, 42], [10, 42], [-16, 56], [0, 54], [16, 56], [-10, 68], [10, 68], [0, 78]]
    : [[6, 58]];
  for (const [dx, dy] of pts) out.push(o2(x + dx, dy, 1.25, '#7ec8f2'));
  out.push(rect(x - 20, 94, 40, 14, C.white, 4, C.ink, 2), rect(x - 18, 96, rich ? 36 : 5, 10, '#5aa7d6', 3, null));
  const sv = all(...out);
  return grey ? greyed(sv) : sv;
}

// ── Circulation diagram (stora/lilla kretsloppet) ────────────────────
function circulation(mark: 'stora' | 'lilla'): Svg {
  const big = mark === 'stora', small = mark === 'lilla';
  const out: Svg[] = [];
  // lungs at top, heart middle, body (organs box) at bottom
  out.push(line('M60 0 L60 12 M60 12 L46 18 M60 12 L74 18', C.ink, 4.4), line('M60 0 L60 12 M60 12 L46 18 M60 12 L74 18', '#cfd8e6', 2.6));
  out.push(path('M46 12 C32 8 20 20 18 36 C26 40 38 40 46 36 Z', LUNG, C.ink, 1.8), path('M74 12 C88 8 100 20 102 36 C94 40 82 40 74 36 Z', LUNG, C.ink, 1.8));
  out.push(g('translate(4 0)', body(56, 76, 0.36, SKINB)));
  // loops: lung loop (y 30..56), body loop (y 64..110)
  const lungCol = small ? HL : C.grey2;
  out.push(path('M48 52 C30 50 26 42 28 34', 'none', small ? BLUE : C.grey2, small ? 3.4 : 2.4), path('M92 34 C94 42 90 50 72 52', 'none', small ? RED : C.grey2, small ? 3.4 : 2.4));
  out.push(path('M28 34 C30 26 40 24 46 28 M74 28 C80 24 90 26 92 34', 'none', lungCol, small ? 3.4 : 2.2));
  out.push(path('M72 62 C102 64 106 98 84 112', 'none', big ? RED : C.grey2, big ? 3.4 : 2.4), path('M36 112 C14 98 18 64 48 62', 'none', big ? BLUE : C.grey2, big ? 3.4 : 2.4));
  if (big) out.push(arrow(98, 92, 92, 104, HL, 3), arrow(20, 86, 24, 74, HL, 3), oval(60, 92, 50, 26, HL, 2));
  if (small) out.push(arrow(30, 46, 28, 38, HL, 3), arrow(92, 40, 88, 48, HL, 3), oval(60, 34, 52, 26, HL, 2));
  out.push(smallHeart(60, 60, 1.7));
  return all(...out);
}

// ── Neuron with mark (axon/dendrit/nervimpuls) ───────────────────────
function neuronM(mark: 'axon' | 'dendrit' | 'impuls'): Svg {
  const ax = mark === 'axon', de = mark === 'dendrit';
  const out: Svg[] = [];
  const dendr = 'M30 44 L12 30 M20 37 L14 44 M34 38 L30 12 M32 24 L24 20 M26 50 L6 52 M14 51 L8 60 M40 40 L54 20 M48 30 L56 32 M28 58 L16 74 M22 66 L12 66';
  out.push(line(dendr, C.ink, de ? 5.4 : 4.2), line(dendr, de ? HL : NERVE, de ? 3.4 : 2.2));
  out.push(line('M40 54 L100 96', C.ink, 7), line('M40 54 L100 96', ax ? HL : NERVE, 4.6));
  for (const [x, y] of [[56, 65], [68, 74], [80, 82], [92, 90]] as const) out.push(g(`translate(${x} ${y}) rotate(35)`, ellipse(0, 0, 5, 3.2, ax ? '#ffd9c7' : C.white, C.ink, 1.1)));
  out.push(line('M100 96 l10 -2 M100 96 l7 7 M100 96 l1 11', ax ? HL : C.ink, 2.2));
  out.push(circle(34, 48, 11, de || ax ? '#f7dc8a' : NERVE, C.ink, 2.2), circle(34, 48, 4, '#8c6a1c', null));
  if (mark === 'impuls') {
    for (const [x, y] of [[50, 61], [66, 72], [82, 84]] as const) out.push(path(`M${x} ${y - 8} L${x - 5} ${y + 1} L${x - 1} ${y + 1} L${x - 3} ${y + 8} L${x + 4} ${y - 2} L${x} ${y - 2} Z`, C.yellow, C.ink, 1.2));
    out.push(arrow(62, 98, 92, 118 - 4, HL, 3.4));
  }
  return all(...out);
}

// ── Synapse (synaps/signalsubstans) ──────────────────────────────────
function synapse(mark: 'gap' | 'subst'): Svg {
  const out: Svg[] = [];
  // upper ending (axon terminal) and lower cell
  out.push(path('M44 0 L76 0 L76 26 C92 30 96 44 88 52 L32 52 C24 44 28 30 44 26 Z', NERVE, C.ink, 2.2));
  out.push(path('M14 120 L14 74 C14 66 20 64 28 64 L92 64 C100 64 106 66 106 74 L106 120 Z', '#f7dc8a', C.ink, 2.2));
  for (const [x, y] of [[44, 36], [58, 40], [72, 36], [50, 46], [66, 46]] as const) out.push(circle(x, y, 5, C.white, C.ink, 1.1), circle(x - 1, y, 1.2, mark === 'subst' ? HL : '#7a6a8a', null), circle(x + 1.6, y + 1.2, 1.2, mark === 'subst' ? HL : '#7a6a8a', null));
  // receptors on lower membrane
  for (const x of [36, 50, 64, 78, 90]) out.push(path(`M${x - 3} 64 L${x - 3} 60 L${x + 3} 60 L${x + 3} 64`, 'none', C.ink, 1.4));
  const dots: [number, number][] = [[40, 56], [48, 59], [56, 55], [62, 59], [70, 56], [78, 58], [86, 56], [52, 57]];
  out.push(...dots.map(([x, y]) => circle(x, y, mark === 'subst' ? 2.4 : 1.5, mark === 'subst' ? HL : C.grey, C.ink, mark === 'subst' ? 0.8 : 0.5)));
  if (mark === 'gap') out.push(rect(22, 51, 76, 14, 'none', 5, HL, 2.8), arrow(112, 38, 100, 54, HL, 3));
  if (mark === 'subst') out.push(arrow(60, 20, 60, 30, C.navy, 2.2));
  out.push(path('M58 6 L62 14 L58 14 L62 22', 'none', C.yellow, 2.4));
  return all(...out);
}

// ── Nervous system figure (centrala/perifera) ────────────────────────
function nerves(mark: 'cns' | 'pns'): Svg {
  const cns = mark === 'cns', pns = mark === 'pns';
  const fig = 'M60 4 C68 4 70 12 68 20 L66 24 C76 26 84 28 86 34 L94 62 L88 64 L80 42 L78 70 L80 82 L78 118 L64 118 L60 86 L56 118 L42 118 L40 82 L42 70 L40 42 L32 64 L26 62 L34 34 C36 28 44 26 54 24 L52 20 C50 12 52 4 60 4 Z';
  const nv = 'M60 30 L46 34 L36 60 M60 30 L74 34 L84 60 M60 74 L50 84 L48 116 M60 74 L70 84 L72 116 M60 44 L48 50 M60 44 L72 50 M60 58 L50 64 M60 58 L70 64 M36 60 L30 62 M84 60 L90 62 M48 116 L44 116 M72 116 L76 116';
  return all(path(fig, SKINB, C.ink, 2.2),
    line(nv, pns ? C.ink : C.grey2, pns ? 3.6 : 1.8), line(nv, pns ? HL : C.grey2, pns ? 2 : 1.4),
    ellipse(60, 12, 7.4, 6.4, cns ? HL : '#e3c9cf', C.ink, 1.4), line('M60 18 L60 76', C.ink, cns ? 5.4 : 3.4), line('M60 18 L60 76', cns ? HL : '#e3d7b0', cns ? 3.6 : 2));
}

// ── Gland figure (hormonsystem) ──────────────────────────────────────
const glandFigure = (): Svg => {
  const fig = 'M60 4 C68 4 70 12 68 20 L66 24 C76 26 84 28 86 34 L94 62 L88 64 L80 42 L78 70 L80 82 L78 118 L64 118 L60 86 L56 118 L42 118 L40 82 L42 70 L40 42 L32 64 L26 62 L34 34 C36 28 44 26 54 24 L52 20 C50 12 52 4 60 4 Z';
  const gl: [number, number, number, number][] = [[60, 14, 2.4, 2.4], [60, 24, 5, 2.2], [52, 52, 3.4, 2.2], [68, 52, 3.4, 2.2], [62, 60, 6, 2], [53, 72, 2.6, 2], [67, 72, 2.6, 2]];
  return all(path(fig, SKINB, C.ink, 2.2), line('M60 26 L60 80 M60 34 L44 40 M60 34 L76 40', '#e9a0a0', 1.4),
    ...gl.map(([x, y, rx, ry]) => ellipse(x, y, rx, ry, HL, C.ink, 1.2)),
    ...[[100, 24], [104, 40], [98, 56], [16, 30], [12, 48], [20, 70]].map(([x, y]) => circle(x!, y!, 2.2, HL, C.ink, 0.6)),
    line('M88 30 l8 -4 M90 44 l8 0 M32 36 l-8 -4 M30 52 l-8 0', HL, 1.6, '2 2'));
};

// ── Hot pot and stove (reflex) ───────────────────────────────────────
const stove = (): Svg => all(rect(6, 84, 70, 28, C.silver, 2, C.ink, 2), rect(10, 78, 62, 8, C.dark, 2, C.ink, 1.6), ellipse(40, 80, 18, 3, '#e65100', null),
  rect(22, 54, 36, 24, C.grey, 3, C.ink, 2), line('M58 60 L74 58', C.ink, 3), line('M30 48 c-3 -5 3 -8 0 -13 M40 48 c-3 -5 3 -8 0 -13 M50 48 c-3 -5 3 -8 0 -13', '#e57373', 1.8));

export const PHYSIO_MOTIFS: Record<string, Svg> = {
  // ── 3551 Hjärtats funktion ──────────────────────────────────────
  /** hjärta: the trunk organ map with the heart in orange and an arrow. */
  'fysio.hjärta': organs(['hjärta'], [104, 6]),
  /** hjärtmuskel: the heart cut open; the thick wall of muscle is orange with fibre stripes, the chambers inside stay red. */
  'fysio.hjärtmuskel': all(
    path('M60 26 C36 10 6 30 14 62 C20 86 46 100 60 114 C74 100 100 86 106 62 C114 30 84 10 60 26 Z', HL, C.ink, 2.6),
    ...range(9).map((i) => line(`M${f1(22 + i * 9)} ${f1(i < 4 ? 40 + i * 2 : 48 - (i - 4) * 2)} l4 10`, '#a8361a', 1.4)),
    path('M60 40 C46 30 28 42 32 62 C36 78 50 88 60 98 C70 88 84 78 88 62 C92 42 74 30 60 40 Z', '#e57373', C.ink, 1.6),
    line('M60 42 L60 96', HL, 6), line('M60 42 L60 96', C.ink, 0.8),
    path('M50 30 C50 12 64 4 70 18', 'none', RED, 7), path('M46 30 C46 22 34 18 32 26', 'none', BLUE, 6),
    pointAt([22, 70], [6, 100])),
  /** kapillär: a red vessel splits into a net of very thin orange vessels that join a blue vessel; small cells around. */
  'fysio.kapillär': all(
    ...[[30, 30], [62, 22], [92, 34], [34, 92], [64, 98], [92, 88], [48, 60], [78, 60]].map(([x, y]) => all(ellipse(x!, y!, 8, 6, '#fde3dc', '#d9798b', 1.2), circle(x!, y!, 2.2, '#b49ade', null))),
    line('M0 40 L22 50', C.ink, 9), line('M0 40 L22 50', RED, 7), line('M98 70 L120 80', C.ink, 9), line('M98 70 L120 80', BLUE, 7),
    line('M22 50 C40 40 70 44 98 70 M22 50 C40 64 70 76 98 70 M22 50 C44 52 72 58 98 70 M40 46 C46 56 56 60 60 66 M70 50 C72 58 80 64 84 64 M34 58 C40 48 52 46 56 52 M60 70 C66 62 76 62 82 70', C.ink, 3.6), line('M22 50 C40 40 70 44 98 70 M22 50 C40 64 70 76 98 70 M22 50 C44 52 72 58 98 70 M40 46 C46 56 56 60 60 66 M70 50 C72 58 80 64 84 64 M34 58 C40 48 52 46 56 52 M60 70 C66 62 76 62 82 70', HL, 2.2)),
  /** syrerik: a bright red blood drop packed with O₂ and a full bar beside a grey dark drop with one O₂; the full one is ringed. */
  'fysio.syrerik': all(o2Drop(32, true), o2Drop(90, false, true), oval(32, 60, 30, 56), o2(61, 8, 0.9, '#7ec8f2'), num(61, 22, 'O₂', 8)),
  /** syrefattig: the same two drops; now the dark drop with a single O₂ and an almost empty bar is coloured and ringed, the full one grey. */
  'fysio.syrefattig': all(o2Drop(32, true, true), o2Drop(90, false), oval(90, 60, 30, 56), o2(61, 8, 0.9, '#7ec8f2'), num(61, 22, 'O₂', 8)),
  /** stora kretsloppet: heart in the middle, lungs above, body below; the heart–body loop is coloured and ringed. */
  'fysio.stora-kretsloppet': circulation('stora'),
  /** lilla kretsloppet: the same diagram; the heart–lung loop is coloured and ringed. */
  'fysio.lilla-kretsloppet': circulation('lilla'),
  /** puls: a forearm; two fingers of the other hand rest on the wrist, a pulse line beats above and a watch shows 60. */
  'fysio.puls': all(
    path('M0 70 C30 64 60 64 84 68 L84 100 C60 104 30 104 0 98 Z', C.skin, C.ink, 2.2), path('M82 64 C100 62 116 70 116 84 C116 98 100 106 82 102 Z', C.skin, C.ink, 2.2),
    path('M60 40 C64 46 66 60 66 70 L74 70 C74 60 74 48 70 40 Z', C.skin, C.ink, 1.8), path('M70 38 C76 44 78 60 78 70 L86 70 C86 60 84 46 80 38 Z', C.skin, C.ink, 1.8),
    path('M56 14 C58 26 60 36 60 40 L82 38 C84 30 86 22 88 14 Z', C.green, C.ink, 1.8),
    ring(74, 78, 8, HL, 2), line('M2 30 L14 30 L18 22 L23 38 L27 26 L30 30 L44 30', HL, 2.6),
    circle(20, 56, 10, C.white, C.ink, 2), line('M20 56 L20 49 M20 56 L25 59', C.ink, 1.6), num(20, 80, '60', 9, C.ink)),

  // ── 3552 Lungornas gasutbyte ────────────────────────────────────
  /** gasutbyte: one round lung sac wrapped in a capillary; O₂ moves into the blood, CO₂ out, with orange arrows. */
  'fysio.gasutbyte': all(
    circle(48, 50, 30, '#fbe1e1', C.ink, 2.4), line('M48 20 L48 2', C.ink, 10), line('M48 20 L48 2', '#cfd8e6', 7.6),
    path('M84 116 C84 90 92 70 86 48 C82 32 70 22 60 18', 'none', C.ink, 14), path('M84 116 C84 90 92 70 86 48 C82 32 70 22 60 18', 'none', '#e86b6b', 11),
    rbc(86, 92, 0.8), rbc(87, 64, 0.8), rbc(76, 30, 0.8),
    o2(40, 44), o2(52, 60), arrow(54, 48, 78, 52, HL, 3), o2(80, 44, 0.8, '#5aa7d6'),
    co2(100, 76, 0.9), arrow(92, 80, 64, 82, HL, 3), co2(46, 80, 0.9)),
  /** hemoglobin: a red blood cell; a lens shows the protein inside, four coloured parts around Fe, each holding an O₂. */
  'fysio.hemoglobin': all(rbc(24, 92, 2.2), zoom(24, 92, 8, 72, 48, 40, all(rect(30, 6, 90, 90, '#fde7e7', 0, null),
    ...[[60, 38, '#e57373'], [84, 38, '#ef9a9a'], [60, 60, '#ef9a9a'], [84, 60, '#e57373']].map(([x, y, c]) => circle(x as number, y as number, 12, c as string, C.ink, 1.4)),
    circle(72, 49, 6, HL, C.ink, 1.2), num(72, 52, 'Fe', 7, C.white),
    o2(50, 26, 0.9), o2(94, 26, 0.9), o2(50, 72, 0.9), o2(94, 72, 0.9)), 'fyz1')),
  /** syremättnad: a finger in a small clip meter whose screen shows 98 % and a pulse line. */
  'fysio.syremättnad': all(
    path('M0 72 C20 66 50 66 74 68 C90 68 98 74 98 82 C98 90 90 96 74 96 C50 98 20 96 0 92 Z', C.skin, C.ink, 2.2), path('M84 72 C90 72 94 78 92 86', 'none', '#f8d6c4', 1.4),
    rect(46, 52, 46, 26, C.dark, 7, C.ink, 2), rect(48, 88, 42, 14, C.dark, 6, C.ink, 2), line('M52 78 L52 88 M86 78 L86 88', C.ink, 2),
    rect(14, 10, 64, 34, C.white, 6, C.ink, 2), num(42, 34, '98', 18, HL), num(66, 34, '%', 11, C.ink), line('M64 18 L68 18 L70 14 L72 22 L74 18 L76 18', RED, 1.4),
    line('M54 52 L50 44', C.ink, 1.4)),
  /** flimmerhår: a section of an airway; tiny orange hairs on the wall sweep a slime blob with dust up and out. */
  'fysio.flimmerhår': all(
    rect(4, 20, 112, 80, '#f9e4e0', 6, C.ink, 2), rect(4, 20, 112, 14, '#e8a0a0', 4, C.ink, 1.4), rect(4, 86, 112, 14, '#e8a0a0', 4, C.ink, 1.4),
    ...range(18).map((i) => line(`M${8 + i * 6} 34 q1 8 5 13 M${8 + i * 6} 86 q1 -8 5 -13`, HL, 2.4)),
    path('M30 46 C40 40 60 40 66 48 C70 56 54 60 40 58 C30 56 24 52 30 46 Z', '#d9e8b0', C.ink, 1.2), circle(40, 50, 1.6, C.dark, null), circle(52, 48, 1.4, C.dark, null), circle(58, 53, 1.6, C.dark, null),
    arrow(74, 52, 108, 52, C.navy, 3), oval(60, 41, 56, 9, HL, 1.6)),

  // ── 3553 Matsmältningssystemet ──────────────────────────────────
  /** matsmältningskanal: the organ map with the whole food tube lit in orange, from the gullet to the end. */
  'fysio.matsmältningskanal': all(organs(['matstrupe', 'magsäck', 'tunntarm', 'tjocktarm', 'ändtarm']), arrow(108, 4, 70, 4, HL, 3)),
  /** spottkörtel: a head from the side; the salivary glands at the jaw are orange and drops of saliva come into the mouth. */
  'fysio.spottkörtel': all(headInside([]), ellipse(64, 70, 6, 9, HL, C.ink, 1.4), ellipse(80, 82, 6, 3.6, HL, C.ink, 1.4), ellipse(88, 74, 4, 2.6, HL, C.ink, 1.2),
    line('M66 64 C76 64 88 66 92 70', HL, 1.6), drop(96, 76, 0.7), drop(102, 82, 0.6), pointAt([66, 72], [14, 100])),
  /** tolvfingertarm: the stomach (muted) and the C-shaped first part of the small intestine in orange; twelve finger widths beside it. */
  'fysio.tolvfingertarm': all(
    path('M20 18 C40 6 70 10 78 28 C84 44 72 58 56 56 C44 54 34 46 28 38 C40 38 44 32 20 18 Z', '#f2a7a0', C.ink, 2),
    path('M78 36 C98 36 104 56 100 74 C96 92 78 100 62 96', 'none', C.ink, 13), path('M78 36 C98 36 104 56 100 74 C96 92 78 100 62 96', 'none', HL, 10),
    path('M62 96 C50 94 40 100 36 112', 'none', C.ink, 11), path('M62 96 C50 94 40 100 36 112', 'none', '#f3c09a', 8),
    path('M64 78 C72 70 86 70 92 74 C86 82 72 84 64 78 Z', GLAND, C.ink, 1.4),
    ...range(12).map((i) => rect(6 + i * 4.4, 104, 4.2, 12, C.skin, 2, C.ink, 0.8)), line('M6 100 L58 100', C.ink, 1, '2 2')),
  /** tarmludd: a lens on the small intestine shows the inner wall: many small finger-like bumps in orange, each with a red vessel. */
  'fysio.tarmludd': all(
    path('M4 100 C14 94 24 106 34 100 C44 94 54 106 64 100 C74 94 84 106 94 100 C104 94 114 106 118 100', 'none', C.ink, 10), path('M4 100 C14 94 24 106 34 100 C44 94 54 106 64 100 C74 94 84 106 94 100 C104 94 114 106 118 100', 'none', '#f3c09a', 7),
    zoom(34, 100, 7, 62, 48, 42, all(rect(20, 70, 100, 30, '#f0b98e', 0, null),
      ...range(7).map((i) => { const x = 30 + i * 11; return all(path(`M${x - 4} 72 L${x - 4} 36 C${x - 4} 28 ${x + 4} 28 ${x + 4} 36 L${x + 4} 72 Z`, HL, C.ink, 1.2), line(`M${x - 1.4} 70 L${x - 1.4} 36 C${x - 1.4} 32 ${x + 1.4} 32 ${x + 1.4} 36 L${x + 1.4} 70`, RED, 1)); }),
      ...[[40, 20], [64, 16], [86, 22]].map(([x, y]) => circle(x!, y!, 2.6, GLAND, C.ink, 0.8))), 'fyz2')),

  // ── 3554 Nervimpulser ───────────────────────────────────────────
  /** nervimpuls: a nerve cell; yellow sparks run along the long fibre, an orange arrow shows the direction. */
  'fysio.nervimpuls': neuronM('impuls'),
  /** axon: the same nerve cell; the one long fibre is orange. */
  'fysio.axon': neuronM('axon'),
  /** dendrit: the same nerve cell; the many short branches around the cell body are orange. */
  'fysio.dendrit': neuronM('dendrit'),
  /** synaps: a nerve ending meets the next cell; the narrow gap between them is framed in orange. */
  'fysio.synaps': synapse('gap'),
  /** signalsubstans: the same synapse; the small molecules released into the gap (and in the bubbles) are orange. */
  'fysio.signalsubstans': synapse('subst'),
  /** centrala nervsystemet: a figure; brain and spinal cord are orange, the nerves out in the body grey. */
  'fysio.centrala-nervsystemet': nerves('cns'),
  /** perifera nervsystemet: the same figure; the nerves out in arms, legs and body are orange, brain and spinal cord grey. */
  'fysio.perifera-nervsystemet': nerves('pns'),
  /** reaktionstid: a lamp flashes; a hand presses a button; a stopwatch between them shows 0,25 with an orange double arrow. */
  'fysio.reaktionstid': all(
    circle(20, 30, 12, C.yellow, C.ink, 2), rect(15, 42, 10, 8, C.grey, 2, C.ink, 1.4), ...[0, 1, 2, 3, 4, 5].map((i) => { const a = (i / 6) * Math.PI * 2 - 0.3; return line(`M${f1(20 + Math.cos(a) * 15)} ${f1(30 + Math.sin(a) * 15)} l${f1(Math.cos(a) * 5)} ${f1(Math.sin(a) * 5)}`, C.gold, 2); }),
    rect(80, 96, 34, 12, C.dark, 3, C.ink, 1.6), ellipse(97, 94, 9, 4, C.red, C.ink, 1.6),
    path('M90 60 C88 70 90 80 94 90 L102 90 C104 82 104 72 100 62 Z', C.skin, C.ink, 1.8), path('M90 60 C86 54 86 44 92 40 L100 40 C104 46 104 56 100 62 Z', C.skin, C.ink, 1.8),
    circle(58, 74, 18, C.white, C.ink, 2.2), rect(54, 50, 8, 6, C.grey, 1, C.ink, 1.2), line('M58 74 L58 62 M58 74 L66 78', C.ink, 1.8), num(58, 104, '0,25', 10, HL),
    arrow(30, 52, 44, 64, HL, 2.6), arrow(76, 76, 88, 84, HL, 2.6)),
  /** reflex (i kroppen): a hand jerks back from a hot pot on a stove, with motion lines and an orange arrow. */
  'fysio.reflex.2': all(stove(),
    path('M76 48 C86 44 98 44 108 46 L108 58 C98 60 86 60 76 58 C70 58 70 48 76 48 Z', C.skin, C.ink, 2), path('M108 44 L120 42 L120 62 L108 60 Z', C.green, C.ink, 1.8),
    line('M66 46 l-6 0 M66 53 l-8 0 M66 60 l-6 0', C.ink, 1.6), arrow(80, 36, 112, 36, HL, 3.4), path('M60 62 l3 -6 l3 6 Z', C.yellow, C.ink, 1)),

  // ── 3555 Hormonsystemet ─────────────────────────────────────────
  /** hormonsystem: a figure with all the hormone glands in orange (head, neck, kidneys, belly, lower belly); orange dots spread out. */
  'fysio.hormonsystem': glandFigure(),
  /** utsöndra: a gland squeezes orange drops out into a blood vessel, with an orange arrow. */
  'fysio.utsöndra': all(
    path('M20 20 C44 8 76 14 80 36 C84 58 60 70 40 66 C20 62 6 40 20 20 Z', GLAND, C.ink, 2.2), ...[[34, 34], [50, 28], [60, 44], [42, 50]].map(([x, y]) => circle(x!, y!, 4, '#f7e3a8', C.ink, 1)),
    rect(0, 86, 120, 26, '#f6c4c4', 10, C.ink, 2), rect(0, 91, 120, 16, '#e86b6b', 6, null), rbc(20, 99, 0.9), rbc(96, 99, 0.9),
    path('M58 62 C62 70 62 76 60 82', 'none', C.ink, 1.4), arrow(66, 60, 80, 86, HL, 3.2),
    ...[[84, 70, 1], [88, 96, 0.9], [62, 98, 0.9], [74, 102, 0.8]].map(([x, y, s]) => circle(x!, y!, 3 * s!, HL, C.ink, 0.8))),
  /** hypofys: a head from the side; a pea-sized gland just under the brain is orange, with an arrow. */
  'fysio.hypofys': all(headInside([]), circle(64, 51, 3.6, HL, C.ink, 1.2), pointAt([64, 51], [12, 96])),
  /** glukagon: a pancreas sends orange dots into the blood; the sugar cubes in the vessel and a gauge go up; an empty plate and a clock. */
  'fysio.glukagon': all(
    path('M8 22 C24 14 46 16 62 12 C62 20 54 26 42 28 C28 30 16 30 8 22 Z', GLAND, C.ink, 1.6),
    ...[[30, 34], [44, 38], [54, 32]].map(([x, y]) => circle(x!, y!, 2.6, HL, C.ink, 0.7)), arrow(40, 40, 40, 58, HL, 3),
    rect(0, 62, 82, 22, '#f6c4c4', 9, C.ink, 2), ...[14, 30, 46, 62].map((x, i) => rect(x - 4, 68 + (i % 2) * 2, 8, 8, C.white, 1, C.ink, 1)),
    rect(92, 20, 18, 80, C.white, 6, C.ink, 2), rect(96, 46, 10, 50, HL, 3, null), arrow(101, 60, 101, 28, C.ink, 2.4),
    ellipse(30, 104, 16, 5, C.white, C.ink, 1.4), circle(66, 104, 8, C.white, C.ink, 1.6), line('M66 104 L66 98 M66 104 L71 104', C.ink, 1.4)),
  /** könshormon: the female and male symbols, each with orange hormone drops; a growing teenager in silhouette between. */
  'fysio.könshormon': all(
    circle(26, 40, 14, 'none', '#d0548a', 4), line('M26 54 L26 76 M16 66 L36 66', '#d0548a', 4),
    circle(90, 52, 14, 'none', '#3f6fb5', 4), line('M100 42 L112 30 M102 30 L112 30 L112 40', '#3f6fb5', 4),
    ...[[48, 30], [52, 46], [66, 26], [70, 44], [60, 60]].map(([x, y]) => drop(x!, y!, 1, HL)),
    greyed(body(58, 72, 0.34)), arrow(44, 108, 76, 108, C.grey, 2)),

  // ── 3556 Njurarnas filtrering ───────────────────────────────────
  /** nefron: a kidney (muted); a lens shows one tiny filter unit: a ball of vessels and a long looping tube, in orange. */
  'fysio.nefron': all(
    path('M20 70 C4 60 6 30 24 24 C34 22 40 30 36 40 C32 46 32 54 36 60 C40 70 32 76 20 70 Z', KID, C.ink, 2),
    zoom(26, 48, 7, 76, 60, 42, all(rect(30, 16, 92, 90, '#fbefe9', 0, null),
      circle(56, 40, 10, 'none', C.ink, 1.6), path('M50 36 C54 30 60 46 62 38 C64 32 52 46 56 44', 'none', RED, 2.2), line('M40 30 L50 36', RED, 2.4),
      path('M64 44 C76 44 74 54 82 56 C92 58 96 50 100 60 L100 96 C100 102 90 102 90 96 L90 70 C86 66 80 70 82 78 L82 104', 'none', C.ink, 6), path('M64 44 C76 44 74 54 82 56 C92 58 96 50 100 60 L100 96 C100 102 90 102 90 96 L90 70 C86 66 80 70 82 78 L82 104', 'none', HL, 3.6)), 'fyz3')),
  /** blodplasma: a test tube with blood that has settled: dark red cells at the bottom, yellow liquid on top, ringed. */
  'fysio.blodplasma': all(
    path('M46 8 L74 8 L74 96 C74 112 46 112 46 96 Z', 'rgba(220,240,252,0.5)', C.ink, 2.2), path('M47.5 62 L72.5 62 L72.5 96 C72.5 110 47.5 110 47.5 96 Z', '#a8232a', null),
    path('M47.5 22 L72.5 22 L72.5 62 L47.5 62 Z', '#f5d76e', null), line('M46 8 L74 8', C.ink, 3), rect(42, 2, 36, 8, C.grey, 2, C.ink, 1.6),
    rect(42, 18, 36, 48, 'none', 6, HL, 3), pointAt([76, 40], [108, 24]),
    greyed(drop(20, 80, 2.4, RED)), arrow(30, 82, 40, 82, C.grey, 2)),
  /** avfallsprodukt: a cell pushes small grey-brown waste bits out into the blood, which carries them to a waste bin. */
  'fysio.avfallsprodukt': all(
    ellipse(30, 40, 24, 20, '#fde3dc', '#d9798b', 1.8), circle(26, 40, 7, '#b49ade', null),
    rect(0, 74, 120, 24, '#f6c4c4', 9, C.ink, 2), rect(0, 79, 120, 14, '#e86b6b', 5, null),
    ...[[50, 52], [58, 64], [70, 84], [86, 86], [44, 84]].map(([x, y], i) => path(`M${x! - 3} ${y! - 2} L${x! + 2} ${y! - 3} L${x! + 3} ${y! + 2} L${x! - 2} ${y! + 3} Z`, i % 2 ? '#7b6a58' : '#9a8c7a', C.ink, 0.8)),
    arrow(46, 46, 60, 60, HL, 2.8), arrow(96, 86, 108, 86, HL, 2.8),
    path('M94 30 L114 30 L111 64 L97 64 Z', C.grey, C.ink, 1.8), rect(92, 26, 24, 5, C.dark, 1, C.ink, 1.2), line('M100 36 L101 58 M104 36 L104 58 M108 36 L107 58', C.ink, 1)),
  /** urea: the liver (muted) turns a broken-down protein into small orange molecules CO(NH₂)₂ that go to the kidney and out in a yellow drop. */
  'fysio.urea': all(
    path('M4 30 C20 18 48 20 56 26 C52 38 40 46 18 48 C8 46 2 38 4 30 Z', '#b5654a', C.ink, 2),
    ...[[18, 34], [30, 36], [42, 32]].map(([x, y]) => g(`translate(${x} ${y})`, path('M0 -4 L4 0 L0 4 L-4 0 Z', HL, C.ink, 0.8))),
    num(36, 76, 'CO(NH₂)₂', 10, HL), arrow(54, 40, 76, 72, HL, 2.6),
    path('M84 72 C100 72 102 100 86 102 C80 98 82 92 78 88 C82 84 78 76 84 72 Z', KID, C.ink, 2), arrow(86, 104, 86, 112, C.ink, 2), drop(98, 112, 1.2, '#f2d27a')),
  /** vattendrivande: a coffee cup leads to many yellow drops in a toilet bowl; a grey water glass leads to one drop. */
  'fysio.vattendrivande': all(
    path('M8 18 L36 18 L33 44 C33 48 11 48 11 44 Z', C.white, C.ink, 1.8), ellipse(22, 20, 13, 3, '#6d4c41', null), path('M36 24 C44 24 44 36 34 36', 'none', C.ink, 1.8), line('M16 12 c-2 -3 2 -5 0 -8 M24 12 c-2 -3 2 -5 0 -8', C.grey, 1.4),
    arrow(42, 32, 62, 32, HL, 3), ...[[70, 22], [78, 30], [86, 20], [94, 30], [102, 22], [82, 40], [98, 40]].map(([x, y]) => drop(x!, y!, 1.1, '#f2d27a')),
    greyed(path('M12 70 L32 70 L30 98 L14 98 Z', 'rgba(220,240,252,0.6)', C.ink, 1.6), arrow(40, 84, 60, 84, C.grey, 2.4), drop(80, 84, 1.1, '#f2d27a')),
    oval(84, 30, 28, 18, HL, 2)),

  // ── 3557 Immunförsvarets celler ─────────────────────────────────
  /** inflammation: a finger with a small cut is red, swollen and warm (heat lines); white cells gather in a lens beside it. */
  'fysio.inflammation': all(
    path('M0 64 C20 58 50 58 70 60 C88 60 98 66 98 76 C98 86 88 92 70 92 C50 94 20 92 0 88 Z', C.skin, C.ink, 2.2),
    ellipse(66, 76, 20, 14, '#ef8f8f', null), ellipse(66, 76, 12, 8, '#e05a5a', null), line('M60 76 L72 74', '#8c1c13', 2),
    path('M48 60 C52 54 80 54 86 62', 'none', C.ink, 1.2), line('M56 50 c-3 -5 3 -8 0 -13 M66 48 c-3 -5 3 -8 0 -13 M76 50 c-3 -5 3 -8 0 -13', HL, 2),
    ...[[18, 104], [30, 110], [42, 104]].map(([x, y]) => all(circle(x!, y!, 6, WBC, C.ink, 1), circle(x!, y!, 2.4, WBC_N, null))), arrow(50, 104, 60, 94, C.grey, 2)),
  /** ätcell: a large white cell flows around a green rod bacterium and swallows it; another bacterium waits outside. */
  'fysio.ätcell': all(
    path('M20 60 C14 30 50 14 76 24 C98 32 108 56 96 78 C92 70 86 64 80 62 C88 56 88 46 78 44 C68 42 62 52 70 60 C60 64 58 76 64 84 C50 98 26 90 20 60 Z', WBC, C.ink, 2.2),
    circle(40, 64, 10, WBC_N, C.ink, 1.4), bact(76, 54, 1.1, -20), bact(102, 100, 1, 30), bact(56, 36, 0.8, 10, '#a5c97f'), oval(70, 56, 30, 30, HL, 2.4)),
  /** antigen: a virus whose surface knobs are orange; a Y-shaped antibody holds on to one of them. */
  'fysio.antigen': all(
    g('translate(50 56)', ...range(10).map((i) => { const a = (i / 10) * Math.PI * 2; return all(line(`M${f1(Math.cos(a) * 22)} ${f1(Math.sin(a) * 22)} L${f1(Math.cos(a) * 32)} ${f1(Math.sin(a) * 32)}`, C.ink, 2), circle(f1(Math.cos(a) * 34), f1(Math.sin(a) * 34), 4.2, HL, C.ink, 1.2)); }),
      circle(0, 0, 23, VIR, C.ink, 2.2), circle(-6, -4, 6, '#b886cc', null)),
    path('M84 56 L96 68 L96 100 M108 56 L96 68', 'none', C.ink, 6), path('M84 56 L96 68 L96 100 M108 56 L96 68', 'none', '#4a78c2', 3.6),
    ring(84, 56, 7, HL, 2), greyed(virus(16, 104, 0.9))),
  /** mördarcell: a white cell with spikes attacks a body cell full of small viruses; the infected cell cracks. */
  'fysio.mördarcell': all(
    ellipse(80, 62, 26, 22, '#fde3dc', '#d9798b', 2), circle(80, 62, 7, '#b49ade', null), virus(68, 52, 0.55), virus(92, 54, 0.55), virus(84, 76, 0.55), virus(70, 72, 0.5),
    line('M96 44 L88 56 L98 62 L90 76', C.ink, 2), ...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(28 + Math.cos(a) * 20)} ${f1(62 + Math.sin(a) * 20)} l${f1(Math.cos(a) * 6)} ${f1(Math.sin(a) * 6)}`, C.ink, 2.4); }),
    circle(28, 62, 20, WBC, C.ink, 2.2), circle(26, 60, 7, WBC_N, null), path('M44 56 L54 58 L48 62 L58 66', 'none', C.yellow, 3), arrow(40, 40, 56, 46, HL, 3), ring(28, 62, 26, HL, 2.2)),
  /** minnescell: a white cell with a thought bubble holding a bacterium; the same bacterium comes back and Y antibodies wait. */
  'fysio.minnescell': all(
    circle(36, 84, 20, WBC, C.ink, 2.2), circle(34, 82, 7, WBC_N, null), ring(36, 84, 25, HL, 2.2),
    circle(54, 58, 3, C.white, C.ink, 1.2), circle(60, 48, 4.4, C.white, C.ink, 1.2), ellipse(78, 26, 30, 18, C.white, C.ink, 1.8), bact(78, 26, 1.4, -10),
    bact(104, 92, 1, 20), ...[[78, 92], [86, 104], [80, 78]].map(([x, y]) => g(`translate(${x} ${y}) rotate(90)`, path('M-6 -6 L0 0 L0 8 M6 -6 L0 0', 'none', '#4a78c2', 2.4)))),
};
