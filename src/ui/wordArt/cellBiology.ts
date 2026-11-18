/**
 * Matematik & naturvetenskap → Biologi → Cellbiologi, 3511–3517 (0.52): the parts of the cell, the cell membrane,
 * the nucleus, mitochondria, protein synthesis, cell division and cell signalling.
 * Recurring signs: an animal cell is a soft pink blob with a purple nucleus; a plant cell is a green-walled box
 * with a blue vacuole and green chloroplasts; mitochondria are orange-red beans with folds. The part the word names
 * is outlined or ringed in orange, and a grey reference shows what the word is not.
 * Close words share one layout where only the marked part differs: encellig/flercellig, växtcell/djurcell,
 * organell/cytoplasma (organelles ringed, or the fluid tinted), kärnmembran/kärnpor/nukleol (the same close-up of a
 * nucleus), eukaryot/prokaryot, passiv/aktiv transport (downhill without energy, uphill through a pump with a bolt),
 * mitos/meios (one cell → two cells with four rods, or four cells with two rods), celldelning/dottercell (the pinch
 * itself, or the two new cells ringed), signalmolekyl/receptor/målcell/cellsignalering.
 * Digits, maths signs and chemical symbols only; no words, no brands.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';
import { figure } from './figures';
import { tree, car } from './homeKit';

// ── Palette and basics ───────────────────────────────────────────────
const CYTO = '#fde3dc';
const CYTO_HL = '#ffcf9e';
const MEM = '#d9798b';
const NUC = '#b49ade';
const NUC2 = '#6e4f9e';
const MITO = '#f09a74';
const CHL = '#62ad55';
const VAC = '#cfe8f6';
const WALL = '#7fa94e';
const PCYTO = '#eef5d9';
const WATER = '#d7ecf8';
const BLOOD = '#d84a4a';
const SKIN = C.skin;
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const ring = (x: number, y: number, r: number, col: string = HL, sw = 2.6) => circle(x, y, r, 'none', col, sw);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL, sw = 2.6) => ellipse(x, y, rx, ry, 'none', col, sw);
const frame = (x: number, y: number, w: number, h: number, col: string = HL, sw = 2.6) => rect(x, y, w, h, 'none', 5, col, sw);
const num = (x: number, y: number, s: string, size = 10, col: string = C.ink) => T(x, y, s, size, col);
const cross = (x: number, y: number, r: number, col: string = C.red) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 2.6);
const bolt = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', C.yellow, C.ink, 1.4));
const drop = (x: number, y: number, s = 1, col: string = '#8cc7e8') => path(`M${x} ${y - 5 * s} C${x + 4 * s} ${y} ${x + 3 * s} ${y + 4 * s} ${x} ${y + 4 * s} C${x - 3 * s} ${y + 4 * s} ${x - 4 * s} ${y} ${x} ${y - 5 * s} Z`, col, C.ink, 0.8);

/** Closed smooth path through points (Catmull-Rom → cubic Bézier). */
function smooth(pts: [number, number][]): string {
  const n = pts.length; let d = `M${f1(pts[0]![0])} ${f1(pts[0]![1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]!, p1 = pts[i]!, p2 = pts[(i + 1) % n]!, p3 = pts[(i + 2) % n]!;
    d += ` C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d + ' Z';
}
/** Wobbly blob of radius r (wobble factors repeat around the outline). */
const blobPts = (x: number, y: number, rx: number, ry: number, wob: number[]): [number, number][] =>
  wob.map((k, i) => { const a = (i / wob.length) * Math.PI * 2; return [x + Math.cos(a) * rx * k, y + Math.sin(a) * ry * k]; });
const WOB = [1, 0.95, 1.04, 0.97, 1.02, 0.94, 1.05, 0.98, 1.01, 0.96];

// ── Cell parts ───────────────────────────────────────────────────────
/** Mitochondrion: bean with folded inner membrane. */
const mito = (x: number, y: number, s = 1, rot = 0, fill: string = MITO) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  ellipse(0, 0, 10, 5.5, fill, C.ink, 1.3), path('M-7 0 L-5 -3.5 L-3 3 L-1 -3.5 L1 3 L3 -3.5 L5 3 L7 0', 'none', '#b4532e', 1));
const chloro = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  ellipse(0, 0, 7, 4, CHL, C.ink, 1.1), line('M-4 -1.5 L-4 1.5 M-1.3 -2 L-1.3 2 M1.3 -2 L1.3 2 M4 -1.5 L4 1.5', '#2f6e2a', 1.2));
const er = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, line('M0 0 C4 -4 8 4 12 0 C16 -4 20 4 24 0 M0 6 C4 2 8 10 12 6 C16 2 20 10 24 6', '#c88aa0', 1.6));
const nucleus = (x: number, y: number, r: number, fill: string = NUC) => all(circle(x, y, r, fill, C.ink, 1.6), circle(x + r * 0.25, y - r * 0.2, r * 0.3, NUC2, null));
const ribo = (x: number, y: number, pts: [number, number][]) => all(...pts.map(([dx, dy]) => circle(x + dx, y + dy, 1, '#7a6a8a', null)));

type AMark = 'nuc' | 'mito' | 'cyto' | 'mem' | 'org' | 'none';
/** Animal cell centred at (x, y), radius r; `mark` outlines one part in orange and greys the others where useful. */
function animalCell(x: number, y: number, r: number, mark: AMark = 'none'): Svg {
  const body = path(smooth(blobPts(x, y, r, r * 0.88, WOB)), mark === 'cyto' ? CYTO_HL : CYTO, mark === 'mem' ? HL : MEM, mark === 'mem' ? 3.4 : 1.8);
  const nx = x - r * 0.12, ny = y + r * 0.02, nr = r * 0.32;
  const inner = all(
    er(x + r * 0.05, y - r * 0.55, r / 40),
    mito(x + r * 0.5, y + r * 0.25, r / 40, -30), mito(x - r * 0.45, y + r * 0.5, r / 44, 20), mito(x + r * 0.35, y - r * 0.3, r / 48, 60),
    ribo(x, y, [[r * 0.55, -r * 0.05], [r * 0.2, r * 0.55], [-r * 0.6, -r * 0.2], [-r * 0.3, -r * 0.5], [r * 0.6, r * 0.5], [-r * 0.65, r * 0.15]]),
    nucleus(nx, ny, nr));
  const rings = mark === 'nuc' ? ring(nx, ny, nr + 4)
    : mark === 'mito' ? all(oval(x + r * 0.5, y + r * 0.25, r * 0.36, r * 0.26), oval(x - r * 0.45, y + r * 0.5, r * 0.33, r * 0.24), oval(x + r * 0.35, y - r * 0.3, r * 0.3, r * 0.22))
    : mark === 'org' ? all(ring(nx, ny, nr + 3, HL, 2.2), oval(x + r * 0.5, y + r * 0.25, r * 0.34, r * 0.24, HL, 2.2), oval(x - r * 0.45, y + r * 0.5, r * 0.32, r * 0.22, HL, 2.2), oval(x + r * 0.35, y - r * 0.3, r * 0.29, r * 0.2, HL, 2.2), oval(x + r * 0.35, y - r * 0.52, r * 0.4, r * 0.16, HL, 2.2))
    : '';
  return all(body, mark === 'cyto' ? greyed(inner) : inner, mark === 'cyto' ? all(...range(14).map((i) => circle(f1(x + Math.cos(i * 2.4) * r * (0.3 + (i % 3) * 0.18)), f1(y + Math.sin(i * 2.4) * r * 0.7 * (0.3 + (i % 3) * 0.2)), 1.2, '#e8935a', null))) : '', rings);
}

type PMark = 'wall' | 'vac' | 'chl' | 'nuc' | 'none';
/** Plant cell: box with wall, membrane, vacuole, nucleus and chloroplasts. */
function plantCell(x: number, y: number, w: number, h: number, mark: PMark = 'none'): Svg {
  const wallStroke = mark === 'wall' ? HL : WALL, wallW = mark === 'wall' ? 4.4 : 3;
  const s = Math.min(w, h) / 60;
  const chls: [number, number, number][] = [[x + w * 0.12, y + h * 0.2, 80], [x + w * 0.88, y + h * 0.3, 100], [x + w * 0.85, y + h * 0.78, 70], [x + w * 0.2, y + h * 0.84, 10], [x + w * 0.5, y + h * 0.1, 0], [x + w * 0.55, y + h * 0.9, 0], [x + w * 0.1, y + h * 0.55, 90]];
  const vac = rect(x + w * 0.24, y + h * 0.22, w * 0.52, h * 0.56, VAC, 8 * s, '#6aa6cc', 1.4);
  const nuc = nucleus(x + w * 0.8, y + h * 0.55, 6 * s);
  const parts = all(vac, nuc, ...chls.map(([cx, cy, rot]) => chloro(cx, cy, s * 0.9, rot)));
  const marks = mark === 'vac' ? rect(x + w * 0.2, y + h * 0.18, w * 0.6, h * 0.64, 'none', 8 * s, HL, 2.6)
    : mark === 'chl' ? all(...chls.slice(0, 4).map(([cx, cy]) => ring(cx, cy, 8 * s, HL, 2.2)))
    : mark === 'nuc' ? ring(x + w * 0.8, y + h * 0.55, 9 * s) : '';
  const greyParts = mark === 'wall' ? greyed(parts) : parts;
  return all(rect(x, y, w, h, '#dcebc3', 5, wallStroke, wallW), rect(x + 3, y + 3, w - 6, h - 6, PCYTO, 4, '#a9c98a', 1), greyParts, marks);
}

// ── Small things ─────────────────────────────────────────────────────
/** Zoom: small circle at (x1, y1) joined to a big lens at (x2, y2). */
const zoom = (x1: number, y1: number, r1: number, x2: number, y2: number, r2: number, inner: Svg, id: string) => {
  const a = Math.atan2(y2 - y1, x2 - x1), p = Math.PI / 2;
  const l1 = [x1 + Math.cos(a + p) * r1, y1 + Math.sin(a + p) * r1, x2 + Math.cos(a + p) * r2, y2 + Math.sin(a + p) * r2];
  const l2 = [x1 + Math.cos(a - p) * r1, y1 + Math.sin(a - p) * r1, x2 + Math.cos(a - p) * r2, y2 + Math.sin(a - p) * r2];
  return all(line(`M${f1(l1[0]!)} ${f1(l1[1]!)} L${f1(l1[2]!)} ${f1(l1[3]!)} M${f1(l2[0]!)} ${f1(l2[1]!)} L${f1(l2[2]!)} ${f1(l2[3]!)}`, C.grey, 1.2, '3 2'),
    circle(x1, y1, r1, 'none', C.dark, 1.6), `<clipPath id="${id}"><circle cx="${x2}" cy="${y2}" r="${r2}"/></clipPath>`, circle(x2, y2, r2, C.white, null),
    `<g clip-path="url(#${id})">${inner}</g>`, circle(x2, y2, r2, 'none', C.dark, 2.4));
};
const leaf = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M0 14 C-12 4 -10 -10 0 -16 C10 -10 12 4 0 14 Z', C.green, C.ink, 1.4), line('M0 14 L0 -12', '#2f6e2a', 1.2));
const potPlant = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-12 0 L12 0 L9 16 L-9 16 Z', '#c8743c', C.ink, 1.6), line('M0 0 L0 -26', '#3f7a35', 2), leaf(-7, -14, 0.7, -50), leaf(7, -20, 0.7, 50), leaf(0, -30, 0.6, 0));
const dog = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ellipse(0, 0, 16, 9, C.tan, C.ink, 1.6), circle(15, -9, 7, C.tan, C.ink, 1.6), path('M18 -15 L22 -8 L16 -9 Z', C.brown, C.ink, 1), circle(18, -10, 1.2, C.ink, null), circle(22, -7, 1.4, C.ink, null),
  line('M-10 7 L-11 16 M-3 8 L-3 16 M6 8 L6 16 M12 7 L13 16', C.ink, 2.4), line('M-16 -2 C-22 -6 -22 -12 -18 -14', C.ink, 2));
const bacterium = (x: number, y: number, s = 1, rot = 0, fill = '#9fd07a') => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  rect(-14, -6, 28, 12, fill, 6, C.ink, 1.4), line('M14 0 C18 -4 22 4 26 0', C.ink, 1));
/** Phospholipid (head + two tails) pointing down from (x, y); `up` flips it. */
const lipid = (x: number, y: number, s = 1, up = false, head: string = '#f2a55a') => g(`translate(${x} ${y}) scale(${s} ${up ? -s : s})`,
  line('M-1.6 3 C-3 7 -0.5 10 -2 15 M1.6 3 C3 7 0.5 10 2 15', C.ink, 1.1), circle(0, 0, 3.2, head, C.ink, 1));
/** Horizontal bilayer from x0 to x1 centred on y. */
const bilayer = (x0: number, x1: number, y: number, step = 7, s = 0.8, head?: string) => all(...range(Math.floor((x1 - x0) / step) + 1).map((i) => all(lipid(x0 + i * step, y - 12 * s, s, false, head), lipid(x0 + i * step, y + 12 * s, s, true, head))));
/** Vertical bilayer from y0 to y1 centred on x. */
const vbilayer = (x: number, y0: number, y1: number, step = 7, s = 0.75) => g(`rotate(90 ${x} ${(y0 + y1) / 2})`, bilayer(x - (y1 - y0) / 2, x + (y1 - y0) / 2, (y0 + y1) / 2, step, s));
const hand = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-14 -6 C-6 -10 8 -10 14 -6 C18 -4 18 4 14 5 L2 6 C0 10 -8 10 -10 6 C-15 4 -17 -3 -14 -6 Z', SKIN, C.ink, 1.4), line('M6 -7 L14 -4', '#d9a57c', 1.2));
/** Chromosome rod (X-ish pair drawn as one bar). */
const rod = (x: number, y: number, col: string, h = 9, rot = 0) => g(`translate(${x} ${y}) rotate(${rot})`, rect(-1.8, -h / 2, 3.6, h, col, 1.8, C.ink, 0.8));
const RED = '#e05252', BLUE = '#4a7fd0';
const tri = (x: number, y: number, s = 1, col: string = HL) => path(`M${x} ${y - 5 * s} L${x + 5 * s} ${y + 4 * s} L${x - 5 * s} ${y + 4 * s} Z`, col, C.ink, 1);
/** Cup-shaped receptor sitting in a membrane at (x, y) facing up (notch fits `tri`). */
const receptor = (x: number, y: number, s = 1, col = '#5aa0c8') => g(`translate(${x} ${y}) scale(${s})`, path('M-8 8 L-8 -6 L-4 -6 L0 -1 L4 -6 L8 -6 L8 8 Z', col, C.ink, 1.3));

/** Head in profile facing right (nose near x 104, mouth around y 76). */
const PROFILE = path('M30 10 C70 4 96 30 96 56 L104 66 L96 70 L98 80 C98 96 80 104 62 102 L58 112 L22 112 C24 90 14 70 18 44 C20 24 22 14 30 10 Z', SKIN, C.ink, 2) + circle(60, 40, 2.4, C.ink, null) + path('M20 30 C24 6 70 0 88 24 C70 18 40 20 28 40 Z', C.hair, C.ink, 1.6);

// ── Layout helpers for pairs ─────────────────────────────────────────
/** encellig / flercellig: one big cell (left) vs a many-celled little animal (right). */
function cellCount(single: boolean): Svg {
  const one = all(animalCell(30, 56, 20), num(30, 98, '1', 14));
  const many = all(path('M66 70 C66 40 112 40 112 66 C112 84 66 90 66 70 Z', '#fbd9cf', C.ink, 1.8),
    ...range(16).map((i) => { const cx = 72 + (i % 6) * 7, cy = 52 + Math.floor(i / 6) * 9 + ((i % 2) * 2); return all(circle(cx, cy, 3.6, '#fde9e4', MEM, 0.9), circle(cx, cy, 1.2, NUC, null)); }),
    circle(106, 62, 1.6, C.ink, null), line('M70 82 L66 92 M80 84 L78 94 M96 84 L98 94 M106 80 L110 90', C.ink, 1.6));
  return single ? all(one, frame(6, 28, 48, 80), greyed(many)) : all(greyed(one), many, frame(60, 30, 56, 74));
}
/** växtcell / djurcell: plant with a box cell (left) vs dog with a round cell (right). */
function plantAnimal(plant: boolean): Svg {
  const left = all(potPlant(30, 88, 0.9), plantCell(10, 12, 40, 34));
  const right = all(dog(86, 96, 0.9), animalCell(88, 32, 20));
  return plant ? all(left, frame(4, 6, 52, 108), greyed(right)) : all(greyed(left), right, frame(62, 6, 54, 108));
}
/** Close-up of a nucleus for kärnmembran / kärnpor / nukleol. */
function nucleusClose(mark: 'membrane' | 'pore' | 'nucleolus'): Svg {
  const cx = 60, cy = 58, r = 40;
  const pores = range(8).map((i) => (i * Math.PI * 2) / 8 + 0.3);
  const gaps = pores.map((a) => circle(f1(cx + Math.cos(a) * r), f1(cy + Math.sin(a) * r), 3, CYTO, null)).join('');
  const memCol = mark === 'membrane' ? HL : '#8a6fbf';
  const membrane = all(circle(cx, cy, r + 2.5, 'none', memCol, mark === 'membrane' ? 3 : 1.8), circle(cx, cy, r - 2.5, 'none', memCol, mark === 'membrane' ? 3 : 1.8), gaps);
  const chromatin = line('M34 48 C40 40 48 52 54 44 M40 70 C46 62 52 76 60 70 M66 82 C72 74 80 84 84 76 M70 40 C76 34 82 44 86 38', '#7d62ad', 1.6);
  const nucleolus = circle(70, 58, 9, NUC2, C.ink, 1.2);
  const poreMarks = mark === 'pore' ? all(...pores.slice(0, 5).map((a) => ring(f1(cx + Math.cos(a) * r), f1(cy + Math.sin(a) * r), 6, HL, 2.2)), arrow(f1(cx + Math.cos(pores[1]!) * (r - 10)), f1(cy + Math.sin(pores[1]!) * (r - 10)), f1(cx + Math.cos(pores[1]!) * (r + 14)), f1(cy + Math.sin(pores[1]!) * (r + 14)), HL, 2)) : '';
  return all(rect(4, 4, 112, 108, CYTO, 6, null), circle(cx, cy, r, '#ddd0f2', null),
    mark === 'nucleolus' ? all(greyed(chromatin), membrane, nucleolus, ring(70, 58, 14)) : all(chromatin, membrane, mark === 'membrane' ? greyed(nucleolus) : nucleolus), poreMarks);
}
/** eukaryot / prokaryot: big cell with nucleus (left) vs small bacterium with free DNA loop (right). */
function euPro(eu: boolean): Svg {
  const left = all(animalCell(34, 52, 28), ring(30, 53, 13, eu ? HL : C.grey, 2));
  const right = all(rect(70, 42, 42, 22, '#c9e7b0', 11, C.ink, 1.6), path('M80 53 C80 46 100 46 100 53 C100 60 80 60 80 53 Z', 'none', '#3a7a3a', 1.6), line('M112 53 C116 48 118 58 120 53', C.ink, 1.2), ribo(91, 53, [[-14, -6], [14, 6], [-12, 6], [12, -6]]));
  return eu ? all(left, frame(2, 14, 64, 78), greyed(right)) : all(greyed(left), right, frame(66, 32, 50, 42));
}
/** passiv / aktiv transport: a vertical membrane, many dots left, few right; the arrow and the hill sign differ. */
function transport(active: boolean): Svg {
  const many: [number, number][] = [[14, 30], [26, 40], [16, 52], [32, 58], [20, 70], [34, 80], [14, 88], [28, 96], [40, 44], [40, 70]];
  const few: [number, number][] = [[86, 38], [100, 70], [90, 92]];
  const dots = all(...many.map(([x, y]) => circle(x, y, 3.2, '#5aa0c8', C.ink, 0.8)), ...few.map(([x, y]) => circle(x, y, 3.2, '#5aa0c8', C.ink, 0.8)));
  const mem = vbilayer(60, 14, 112, 7, 0.7);
  if (!active) return all(dots, mem, arrow(30, 64, 92, 64, HL, 3.6), circle(60, 64, 3.2, '#5aa0c8', C.ink, 0.8),
    path('M76 22 L112 22 L76 6 Z', 'none', C.grey, 1.6), circle(84, 12, 3, C.grey2, C.ink, 1), arrow(90, 12, 102, 18, C.grey, 1.6));
  return all(dots, mem, rect(52, 54, 16, 22, '#7bc4a4', 5, C.ink, 1.4), arrow(92, 64, 30, 64, HL, 3.6), bolt(60, 92, 0.9),
    path('M4 22 L40 22 L40 6 Z', 'none', C.grey, 1.6), circle(30, 13, 3, C.grey2, C.ink, 1), arrow(26, 20, 34, 10, C.grey, 1.6));
}
/** mitos / meios: one cell with four rods → two cells with four rods, or four cells with two rods. */
function division(meiosis: boolean): Svg {
  const cell = (x: number, y: number, r: number, rods: [string, number][]) => all(circle(x, y, r, CYTO, MEM, 1.6), ...rods.map(([c, dx], i) => rod(x + dx, y + (i % 2 ? 2 : -2), c, r * 0.5)));
  const top = cell(60, 24, 16, [[RED, -6], [BLUE, -2], [RED, 2], [BLUE, 6]]);
  if (!meiosis) return all(top, num(84, 28, '4', 11, C.grey), arrow(52, 42, 36, 58, C.grey, 2.4), arrow(68, 42, 84, 58, C.grey, 2.4),
    cell(30, 80, 18, [[RED, -6], [BLUE, -2], [RED, 2], [BLUE, 6]]), cell(90, 80, 18, [[RED, -6], [BLUE, -2], [RED, 2], [BLUE, 6]]),
    num(30, 110, '4', 11), num(90, 110, '4', 11), frame(6, 56, 108, 58));
  return all(top, num(84, 28, '4', 11, C.grey), ...[18, 46, 74, 102].map((x) => arrow(60, 42, x, 62, C.grey, 1.8)),
    cell(18, 82, 12, [[RED, -2], [BLUE, 2]]), cell(46, 82, 12, [[BLUE, -2], [RED, 2]]), cell(74, 82, 12, [[RED, -2], [RED, 2]]), cell(102, 82, 12, [[BLUE, -2], [BLUE, 2]]),
    ...[18, 46, 74, 102].map((x) => num(x, 108, '2', 10)), frame(4, 64, 112, 50));
}
/** Two signalling cells: sender left, receiver right with receptors; `mark` picks what is orange. */
function signal(mark: 'all' | 'molecule' | 'receptor'): Svg {
  const sender = path(smooth(blobPts(22, 60, 18, 26, WOB)), CYTO, MEM, 1.8);
  const recv = path(smooth(blobPts(98, 60, 18, 26, WOB)), CYTO, MEM, 1.8);
  const recs = [[80, 48, 90], [79, 62, 90], [80, 76, 90]].map(([x, y, r]) => g(`rotate(${r} ${x} ${y})`, receptor(x!, y!, 0.6)));
  const mols = [[44, 44], [56, 58], [50, 74], [66, 52]].map(([x, y]) => tri(x!, y!, 0.9, mark === 'receptor' ? C.grey2 : HL));
  if (mark === 'molecule') return all(greyed(sender, recv, ...recs, nucleus(20, 60, 6), nucleus(102, 60, 6)), ...mols, ring(56, 58, 10), tri(56, 102, 2.4), arrow(56, 70, 56, 86, C.grey, 1.8));
  if (mark === 'receptor') return all(greyed(sender, nucleus(20, 60, 6)), recv, nucleus(102, 60, 6), ...recs, ...mols, ring(80, 62, 9), ring(80, 48, 9), ring(80, 76, 9));
  return all(sender, nucleus(20, 60, 6), recv, nucleus(102, 60, 6), ...recs, ...mols, arrow(38, 96, 84, 96, HL, 3.2), sparkle(104, 34, 6, C.gold), sparkle(112, 46, 4, C.gold), frame(2, 24, 116, 82));
}

export const CELL_MOTIFS: Record<string, Svg> = {
  // ── 3511 Cellens delar ──────────────────────────────────────────
  /** cell: a hand; a zoom lens on the skin shows many small cells, one of them ringed. */
  'cell.cell': all(figure({ x: 26, h: 0.62, top: C.green }), greyed(tree(108, 110, 0.8)), zoom(38, 84, 5, 76, 42, 38, all(rect(30, 0, 90, 90, '#fbe4dc', 0, null),
    ...range(20).map((i) => { const cx = 44 + (i % 5) * 15 + (Math.floor(i / 5) % 2) * 7, cy = 14 + Math.floor(i / 5) * 15; return all(path(smooth(blobPts(cx, cy, 7, 6.5, WOB)), '#fdeee8', MEM, 1.2), circle(cx - 1, cy, 2.4, NUC, null)); })), 'zc1'),
    ring(69, 42, 10)),
  /** objektglas: a long thin glass slide with a drop and a thin specimen, ringed; a grey microscope behind. */
  'cell.objektglas': all(ground(), greyed(path('M78 108 L108 108 L104 100 L82 100 Z', C.dark, C.ink, 1.4), rect(90, 40, 8, 60, C.dark, 2, C.ink, 1.2), rect(86, 30, 14, 18, C.grey, 3, C.ink, 1.2), rect(76, 76, 34, 5, C.dark, 1, C.ink, 1)),
    path('M10 78 L70 66 L74 76 L14 88 Z', 'rgba(205,232,246,0.9)', '#5a8fb0', 1.6), ellipse(42, 76, 7, 3, '#cfe8f6', '#5a8fb0', 1), path('M36 74 C38 72 46 71 48 73', 'none', '#b6a3dd', 2),
    line('M40 40 L44 60', C.dark, 3), path('M38 30 L46 30 L44 42 L40 42 Z', '#e8eef2', C.ink, 1.2), drop(44, 64, 0.8), oval(42, 77, 36, 14)),
  /** encellig: one big cell with “1” framed; a many-celled little animal greyed. */
  'cell.encellig': cellCount(true),
  /** flercellig: the same layout; the little animal made of many cells is framed, the single cell greyed. */
  'cell.flercellig': cellCount(false),
  /** amöba: in a pond-water lens a shapeless cell stretches an arm towards a small bacterium. */
  'cell.amöba': all(rect(4, 70, 112, 42, WATER, 4, null), line('M4 70 C20 66 34 74 50 70 C66 66 80 74 96 70 C104 68 110 70 116 70', '#6aa6cc', 1.6),
    path('M30 50 C24 34 40 24 52 32 C58 22 74 22 76 34 C90 30 98 36 92 46 C102 54 92 66 80 62 C72 72 54 70 50 62 C36 68 22 62 30 50 Z', '#e6d6f2', '#8a6fbf', 1.8),
    nucleus(56, 46, 7), circle(70, 40, 3, '#cfe8f6', '#6aa6cc', 1), circle(44, 54, 2.4, '#cfe8f6', '#6aa6cc', 1), bacterium(108, 24, 0.4, 20), ring(62, 46, 36)),
  /** organell: an animal cell where the nucleus, mitochondria and ER are each ringed in orange. */
  'cell.organell': animalCell(60, 60, 46, 'org'),
  /** cytoplasma: the same cell; the fluid is tinted orange with dots, the organelles greyed. */
  'cell.cytoplasma': all(animalCell(60, 60, 46, 'cyto'), drop(104, 104, 1.6, CYTO_HL)),
  /** cellvägg: a plant cell whose thick outer wall is orange; a small tree stands beside it. */
  'cell.cellvägg': all(plantCell(8, 10, 84, 84, 'wall'), tree(106, 108, 0.9)),
  /** kloroplast: a leaf in the sun; in the plant cell beside it the green chloroplasts are ringed. */
  'cell.kloroplast': all(leaf(18, 96, 1.3, -20), line('M6 10 L14 18 M2 26 L12 28 M20 4 L22 14', C.gold, 2), circle(8, 8, 6, C.yellow, C.ink, 1.2), plantCell(34, 22, 80, 76, 'chl')),
  /** vakuol: a plant cell where the big blue water sac is framed, with drops inside. */
  'cell.vakuol': all(plantCell(8, 8, 104, 100, 'vac'), drop(50, 52, 1.6), drop(66, 64, 1.4), drop(56, 74, 1.2)),
  /** växtcell: a potted plant with a box-shaped cell framed; a dog with a round cell greyed. */
  'cell.växtcell': plantAnimal(true),
  /** djurcell: the same layout; the dog with its round cell framed, the plant greyed. */
  'cell.djurcell': plantAnimal(false),
  /** vävnad: one grey cell → arrow → a sheet of many identical long cells framed (a muscle). */
  'cell.vävnad': all(greyed(path(smooth(blobPts(16, 60, 10, 6, WOB)), '#f7c6c0', MEM, 1.2)), arrow(28, 60, 40, 60, C.grey, 2.4),
    ...range(15).map((i) => { const cx = 58 + (i % 3) * 18, cy = 22 + Math.floor(i / 3) * 18; return all(ellipse(cx, cy, 9, 7.5, '#f4b3ad', MEM, 1.2), circle(cx, cy, 2, NUC2, null)); }), frame(46, 10, 72, 94)),
  /** hudcell: a hand; the zoom lens shows layers of flat skin cells, the top ones flaking off; one cell ringed. */
  'cell.hudcell': all(hand(22, 94, 1.5, -10), zoom(26, 90, 6, 72, 46, 38, all(rect(30, 0, 90, 100, '#f7d3c2', 0, null),
    ...range(4).map((row) => all(...range(6).map((i) => ellipse(40 + i * 14 + (row % 2) * 7, 30 + row * 10, 7, 4, row === 0 ? '#fbe9df' : '#f6c8b4', '#c98a74', 1)))),
    ellipse(64, 16, 6, 2.6, '#fbe9df', '#c98a74', 1), ellipse(84, 12, 5, 2.4, '#fbe9df', '#c98a74', 1)), 'zc2'), ring(68, 50, 9)),

  // ── 3512 Cellmembranet ──────────────────────────────────────────
  /** cellmembran: an animal cell with its outer skin orange; a lens shows the double layer of lipids. */
  'cell.cellmembran': all(animalCell(40, 64, 32, 'mem'), zoom(66, 46, 5, 94, 30, 24, all(rect(60, 0, 60, 60, CYTO, 0, null), bilayer(72, 118, 30, 6, 0.6)), 'zc3')),
  /** fosfolipid: one big lipid (round head, two tails) ringed; below, a grey double layer of them. */
  'cell.fosfolipid': all(lipid(60, 22, 3), drop(84, 14, 1.2), drop(92, 22, 1), ring(60, 34, 24), greyed(bilayer(10, 110, 90, 7, 0.75))),
  /** halvgenomsläpplig: a dashed membrane; small blue balls pass through it, big red balls bounce back crossed. */
  'cell.halvgenomsläpplig': all(rect(4, 56, 112, 8, '#f6d3a8', 3, HL, 2.4), ...range(9).map((i) => rect(12 + i * 12, 56, 4, 8, C.white, 0, null)),
    ...[[22, 30], [58, 26], [94, 32]].map(([x, y]) => all(circle(x!, y!, 4, '#5aa0c8', C.ink, 1), arrow(x!, y! + 6, x!, 84, '#5aa0c8', 1.8), circle(x!, 92, 4, '#5aa0c8', C.ink, 1))),
    ...[[40, 34], [76, 30]].map(([x, y]) => all(circle(x!, y!, 9, '#e07a6a', C.ink, 1.4), cross(x!, y! + 16, 4)))),
  /** saltlösning: salt pours from a shaker into a glass of water and is stirred; the glass is ringed. */
  'cell.saltlösning': all(ground(), path('M40 54 L80 54 L76 110 L44 110 Z', 'rgba(215,236,248,0.9)', C.ink, 1.8), line('M42 66 L78 66', '#6aa6cc', 1.4),
    g('translate(72 20) rotate(140)', rect(-7, -12, 14, 22, C.white, 4, C.ink, 1.6), rect(-7, -16, 14, 6, C.silver, 2, C.ink, 1.2)), ...[[64, 36], [62, 44], [60, 52], [66, 48]].map(([x, y]) => circle(x!, y!, 1.2, C.white, C.ink, 0.6)),
    line('M54 42 L60 100', C.silver, 3), num(60, 92, 'NaCl', 8, C.grey), ring(60, 82, 34)),
  /** osmos: a U-tube with a membrane at the bottom; water moves (orange arrow) to the salty side, which rises. */
  'cell.osmos': all(path('M20 20 L20 92 C20 112 100 112 100 92 L100 20', 'none', C.ink, 2), path('M36 20 L36 90 C36 96 84 96 84 90 L84 20', 'none', C.ink, 2),
    path('M21 64 L35 64 L35 90 C35 96 60 98 60 98 L60 108 C40 108 21 104 21 92 Z', WATER, null), path('M85 34 L99 34 L99 92 C99 104 80 108 60 108 L60 98 C70 98 85 96 85 90 Z', WATER, null),
    line('M60 94 L60 110', HL, 2.6, '2 2'), ...[[90, 44], [94, 56], [88, 66], [94, 76], [89, 88], [93, 98]].map(([x, y]) => circle(x!, y!, 1.6, C.white, C.ink, 0.7)),
    line('M14 50 L42 50 M78 50 L106 50', C.grey, 1.2, '2 2'), arrow(40, 104, 80, 104, HL, 2.4), arrow(110, 50, 110, 34, HL, 2)),
  /** transportprotein: a membrane with a barrel-shaped protein; a sugar ring passes through it, ringed. */
  'cell.transportprotein': all(rect(4, 4, 112, 36, WATER, 4, null), rect(4, 80, 112, 32, CYTO, 4, null), bilayer(6, 40, 60, 7, 0.8), bilayer(80, 116, 60, 7, 0.8),
    rect(46, 40, 10, 40, '#7bc4a4', 4, C.ink, 1.4), rect(64, 40, 10, 40, '#7bc4a4', 4, C.ink, 1.4),
    path('M60 18 L66 22 L66 28 L60 32 L54 28 L54 22 Z', C.white, C.ink, 1.3), arrow(60, 36, 60, 92, HL, 2.6), ring(60, 60, 22), circle(24, 22, 5, '#e07a6a', C.ink, 1.2), cross(24, 34, 3.4)),
  /** passiv transport: dots move by themselves from many to few through the membrane (orange arrow); a ball rolls downhill. */
  'cell.passiv-transport': transport(false),
  /** aktiv transport: the same layout; a pump with a bolt moves dots from few to many; a ball is pushed uphill. */
  'cell.aktiv-transport': transport(true),
  /** skrumpna: a fresh grey apple → arrow → the same apple small and wrinkled, ringed. */
  'cell.skrumpna': all(ground(), greyed(circle(28, 80, 20, C.red, C.ink, 1.8), line('M28 60 L30 52', C.brown, 2)), arrow(52, 80, 66, 80, C.grey, 2.6),
    path('M80 108 C70 108 70 92 76 88 C72 82 80 76 88 80 C96 76 104 82 100 88 C106 94 104 108 94 108 C90 106 86 106 80 108 Z', '#b8573e', C.ink, 1.8), line('M80 92 C84 96 88 92 92 96 M78 100 C84 102 90 98 96 102 M84 86 C86 88 90 86 92 88', '#7a3020', 1.2), line('M88 80 L90 72', C.brown, 2), ring(88, 94, 22)),

  // ── 3513 Cellkärnan ─────────────────────────────────────────────
  /** cellkärna: an animal cell with the purple nucleus ringed. */
  'cell.cellkärna': animalCell(60, 60, 46, 'nuc'),
  /** kärnmembran: a close-up of a nucleus; its double outer skin is orange. */
  'cell.kärnmembran': nucleusClose('membrane'),
  /** kärnpor: the same close-up; the small holes in the skin are ringed and an arrow goes out through one. */
  'cell.kärnpor': nucleusClose('pore'),
  /** nukleol: the same close-up; the dark spot inside the nucleus is ringed. */
  'cell.nukleol': nucleusClose('nucleolus'),
  /** eukaryot: a big cell with a nucleus framed; a small bacterium without nucleus greyed. */
  'cell.eukaryot': euPro(true),
  /** prokaryot: the same layout; the small bacterium with a free loop of DNA framed, the big cell greyed. */
  'cell.prokaryot': euPro(false),
  /** slemhinna: a face in profile with an open mouth; a cotton swab rubs the wet pink inside of the cheek, ringed. */
  'cell.slemhinna': all(PROFILE,
    path('M70 72 C80 70 94 72 98 74 C94 84 80 88 70 84 C66 80 66 76 70 72 Z', '#d9566a', C.ink, 1.6), path('M72 76 C78 74 88 76 92 77', 'none', '#f2a3ae', 1.6),
    line('M118 70 L82 78', C.white, 2.6), line('M118 70 L82 78', C.ink, 0.6), ellipse(80, 78, 4, 3, C.white, C.ink, 1), drop(76, 86, 0.6, '#cfe8f6'), ring(80, 78, 13)),
  /** färgämne: a dropper drips blue onto a slide; grey faint cells on the left, the same cells clearly blue on the right. */
  'cell.färgämne': all(g('translate(60 22)', rect(-6, -14, 12, 22, '#2f5fb5', 3, C.ink, 1.4), path('M-3 8 L3 8 L1 16 L-1 16 Z', C.white, C.ink, 1)), drop(60, 46, 1.2, '#2f5fb5'), ring(60, 24, 18),
    path('M8 82 L112 82 L112 96 L8 96 Z', 'rgba(205,232,246,0.9)', '#5a8fb0', 1.4),
    greyed(...[18, 30, 42].map((x) => all(ellipse(x, 89, 5, 4, 'none', C.grey2, 1), circle(x, 89, 1.2, C.grey2, null)))), arrow(52, 89, 66, 89, C.grey, 2),
    ...[78, 90, 102].map((x) => all(ellipse(x, 89, 5, 4, '#bcd0f2', '#2f5fb5', 1.2), circle(x, 89, 1.8, '#1f3f8a', null)))),

  // ── 3514 Mitokondrier ───────────────────────────────────────────
  /** mitokondrie: a big bean-shaped organelle with folded inner membrane, ringed; a small cell with grey ones beside. */
  'cell.mitokondrie': all(mito(58, 50, 4.4, -10), ring(58, 50, 50), bolt(108, 18, 1.1), greyed(animalCell(100, 98, 16))),
  /** ATP: a mitochondrion → arrow → a molecule (ring + three P balls) with a spark, ringed → arrow → a flexing muscle. */
  'cell.ATP': all(mito(18, 30, 1.4, 0), arrow(34, 30, 44, 30, C.grey, 2.2), path('M50 32 L58 24 L66 32 L62 40 L54 40 Z', '#f2e3b6', C.ink, 1.4),
    ...[74, 86, 98].map((x) => all(line(`M${x - 8} 32 L${x - 4} 32`, C.ink, 1.6), circle(x, 32, 5, C.yellow, C.ink, 1.2), num(x, 35, 'P', 7))), sparkle(106, 22, 5, HL), ring(76, 32, 32),
    arrow(76, 66, 70, 76, C.grey, 2.2), g('translate(30 46) scale(0.6)', figure({ x: 60, muscle: true, top: C.orange })), bolt(92, 88, 0.9)),
  /** förbränning (i kroppen): a jogger; bread and O₂ go in, CO₂ and heat come out; the glowing body is framed. */
  'cell.förbränning.3': all(ground(), figure({ x: 60, top: C.orange }), ...[[44, 50], [76, 50], [60, 34]].map(([x, y]) => line(`M${x! - 3} ${y} c-3 -4 3 -8 0 -12`, HL, 1.6)),
    g('translate(16 30)', path('M-12 6 L-12 -1 C-12 -9 12 -9 12 -1 L12 6 Z', '#e0b070', C.ink, 1.4), line('M-5 -6 L-7 4 M1 -7 L-1 4 M7 -5 L5 4', '#a8742e', 1.2)), ...[[34, 72], [34, 90], [88, 72], [88, 90]].map(([x, y]) => line(`M${x! - 3} ${y} c-3 -4 3 -8 0 -12`, HL, 1.8)), arrow(26, 34, 40, 50, C.grey, 2), num(16, 62, 'O₂', 10, '#3a7ab8'), arrow(24, 60, 40, 64, C.grey, 2),
    arrow(72, 26, 92, 18, C.grey, 2), num(102, 18, 'CO₂', 9, C.grey), frame(38, 10, 44, 102)),
  /** muskelcell: a flexed arm; the zoom shows a long striped muscle cell with several nuclei, ringed. */
  'cell.muskelcell': all(path('M8 108 C8 84 26 76 36 80 C38 68 54 66 60 76 C66 88 60 108 60 108 Z', SKIN, C.ink, 1.8), zoom(40, 86, 7, 80, 40, 34, all(rect(40, 0, 80, 80, '#fbe4dc', 0, null),
    rect(52, 30, 58, 18, '#f09a94', 9, MEM, 1.4), ...range(12).map((i) => line(`M${58 + i * 4.4} 32 L${58 + i * 4.4} 46`, '#c95a5a', 1)), ...[64, 84, 102].map((x) => ellipse(x, 39, 3, 2, NUC2, null)),
    greyed(rect(52, 54, 58, 12, '#f09a94', 6, MEM, 1))), 'zc4'), oval(81, 39, 31, 14)),

  // ── 3515 Proteinsyntes ──────────────────────────────────────────
  /** aminosyra: a short grey chain of coloured beads; one single bead lifted out and ringed. */
  'cell.aminosyra': all(greyed(...range(8).map((i) => all(i ? line(`M${12 + (i - 1) * 13 + 5} ${86 + ((i - 1) % 2) * 6} L${12 + i * 13 - 5} ${86 + (i % 2) * 6}`, C.ink, 1.6) : '', circle(12 + i * 13, 86 + (i % 2) * 6, 5.6, ['#e07a6a', '#5aa0c8', '#f2c14e', '#7bc4a4'][i % 4]!, C.ink, 1.2)))),
    circle(60, 38, 16, '#f2c14e', C.ink, 1.8), num(52, 42, 'N', 9), num(68, 42, 'C', 9), line('M60 22 L60 14 M60 54 L60 62', C.ink, 1.6), ring(60, 38, 24), arrow(60, 64, 60, 76, C.grey, 2)),
  /** ribosom: a two-part ribosome sits on a thin strand; a bead chain grows out of it; ringed. */
  'cell.ribosom': all(line('M4 78 C30 74 90 82 116 78', '#8a6fbf', 2.4), ...range(10).map((i) => line(`M${10 + i * 11} 78 L${10 + i * 11} 84`, '#8a6fbf', 1.4)),
    ellipse(58, 62, 24, 16, '#8fb7e0', C.ink, 1.8), ellipse(58, 88, 18, 9, '#bcd5ee', C.ink, 1.6),
    ...range(6).map((i) => circle(f1(70 + i * 7), f1(40 - i * 5 + (i % 2) * 3), 3.4, ['#e07a6a', '#5aa0c8', '#f2c14e', '#7bc4a4'][i % 4]!, C.ink, 1)), ring(58, 70, 32)),
  /** proteinsyntes: the whole chain framed: a nucleus → a strand out through the pore → a ribosome → a folded bead chain. */
  'cell.proteinsyntes': all(rect(4, 4, 112, 108, CYTO, 6, null), circle(26, 40, 20, '#ddd0f2', '#8a6fbf', 2), line('M16 34 C20 28 26 40 32 34', '#7d62ad', 1.6),
    path('M30 46 C44 54 50 66 58 76', 'none', '#8a6fbf', 2.4), ellipse(64, 74, 12, 8, '#8fb7e0', C.ink, 1.4), ellipse(64, 86, 9, 5, '#bcd5ee', C.ink, 1.2),
    ...range(7).map((i) => circle(f1(80 + Math.cos(i * 0.9) * 10 + i * 2), f1(58 - Math.sin(i * 0.9) * 10 - i * 2), 3, ['#e07a6a', '#5aa0c8', '#f2c14e', '#7bc4a4'][i % 4]!, C.ink, 0.9)),
    arrow(44, 18, 92, 18, HL, 3), frame(8, 8, 104, 100)),
  /** keratin: a hand with nails and a long hair; the nails and the hair are ringed. */
  'cell.keratin': all(path('M8 108 C8 84 14 66 30 66 C46 66 52 84 52 108 Z', C.green, C.ink, 1.6), circle(30, 46, 16, SKIN, C.ink, 1.6), path('M14 48 C10 20 50 20 46 48 L50 84 C44 76 46 60 44 44 C38 34 22 34 16 44 C14 60 16 76 10 84 Z', '#5a3a2a', C.ink, 1.4), circle(25, 47, 1.6, C.ink, null), circle(35, 47, 1.6, C.ink, null), ring(14, 70, 13),
    rect(66, 74, 40, 34, SKIN, 10, C.ink, 1.6), ...[66, 76, 86, 96].map((x, i) => all(rect(x + 0.5, 44 + (i === 0 || i === 3 ? 6 : 0), 9, 36 - (i === 0 || i === 3 ? 6 : 0), SKIN, 4.5, C.ink, 1.4), rect(x + 2, 46 + (i === 0 || i === 3 ? 6 : 0), 6, 8, '#fbe1e7', 3, C.ink, 1))), g('rotate(-35 64 88)', rect(52, 82, 20, 9, SKIN, 4.5, C.ink, 1.4)), oval(86, 52, 24, 12)),
  /** kollagen: a block of skin; inside it a net of pink rope-like fibres, one rope (three twisted strands) ringed. */
  'cell.kollagen': all(rect(10, 40, 100, 66, '#fbe4dc', 4, C.ink, 1.6), rect(10, 40, 100, 10, '#f1c7a1', 4, C.ink, 1.4),
    ...range(5).map((i) => line(`M14 ${60 + i * 9} C34 ${54 + i * 9} 50 ${66 + i * 9} 70 ${60 + i * 9} C86 ${54 + i * 9} 98 ${64 + i * 9} 106 ${58 + i * 9}`, '#e48aa0', 2)),
    g('translate(60 20)', line('M-30 0 C-20 -6 -10 6 0 0 C10 -6 20 6 30 0', '#c8506e', 2.2), line('M-30 0 C-20 6 -10 -6 0 0 C10 6 20 -6 30 0', '#e48aa0', 2.2), line('M-30 -3 C-20 3 -10 -3 0 3 C10 -3 20 3 30 -3', '#f2b6c4', 2)), oval(60, 20, 38, 12), arrow(60, 34, 60, 50, C.grey, 1.8)),
  /** proteinpulver: a tub of powder with a scoop and a shaker bottle; the tub is ringed. */
  'cell.proteinpulver': all(ground(), rect(14, 54, 46, 56, '#2f3a56', 6, C.ink, 1.8), rect(12, 46, 50, 12, C.dark, 4, C.ink, 1.6), line('M24 78 L50 78', C.silver, 3), rect(20, 70, 6, 16, C.silver, 1.5, C.ink, 1), rect(48, 70, 6, 16, C.silver, 1.5, C.ink, 1),
    path('M70 60 L94 60 L92 110 L72 110 Z', 'rgba(230,236,242,0.9)', C.ink, 1.8), rect(70, 50, 24, 10, C.orange, 3, C.ink, 1.4), rect(72, 80, 20, 28, '#f3e7d0', 2, null),
    ellipse(100, 38, 10, 5, '#f3e7d0', C.ink, 1.2), line('M108 36 L116 30', C.dark, 3), ring(37, 78, 32)),

  // ── 3516 Celldelning ────────────────────────────────────────────
  /** celldelning: one cell pinching in the middle with a nucleus in each half; orange arrows pull apart; framed. */
  'cell.celldelning': all(path('M14 60 C14 32 52 30 58 50 C60 54 60 66 58 70 C52 90 14 88 14 60 Z M106 60 C106 32 68 30 62 50 C60 54 60 66 62 70 C68 90 106 88 106 60 Z', CYTO, MEM, 1.8),
    nucleus(36, 60, 9), nucleus(84, 60, 9), line('M60 40 L60 80', HL, 2, '3 3'), arrow(40, 98, 18, 98, HL, 2.6), arrow(80, 98, 102, 98, HL, 2.6), frame(4, 24, 112, 84)),
  /** dottercell: a grey cell → arrow → two new cells, each ringed. */
  'cell.dottercell': all(greyed(animalCell(60, 22, 16)), arrow(52, 40, 34, 56, C.grey, 2.4), arrow(68, 40, 86, 56, C.grey, 2.4), animalCell(30, 82, 20), animalCell(90, 82, 20), ring(30, 82, 26), ring(90, 82, 26)),
  /** cellcykel: an orange circle of arrows with a growing cell, a cell with doubled rods, a pinching cell and two cells. */
  'cell.cellcykel': all(path('M60 14 A46 46 0 1 1 59 14', 'none', HL, 3), path('M60 14 L52 9 L53 19 Z', HL, HL, 1),
    circle(60, 14, 8, CYTO, MEM, 1.4), circle(104, 60, 12, CYTO, MEM, 1.4), rod(100, 60, RED, 8), rod(104, 60, BLUE, 8), rod(108, 60, RED, 8),
    path('M46 104 C46 94 58 94 60 100 C62 94 74 94 74 104 C74 114 62 114 60 108 C58 114 46 114 46 104 Z', CYTO, MEM, 1.4),
    circle(12, 54, 7, CYTO, MEM, 1.2), circle(20, 68, 7, CYTO, MEM, 1.2), nucleus(60, 14, 3), nucleus(12, 54, 2.4), nucleus(20, 68, 2.4)),
  /** mitos: one cell with four rods → two cells with four rods each (4 → 4, 4); the result is framed. */
  'cell.mitos': division(false),
  /** meios: the same start → four cells with two rods each (4 → 2, 2, 2, 2); the result is framed. */
  'cell.meios': division(true),
  /** könscell: an egg cell and a sperm cell, both ringed; an ordinary skin cell greyed beside. */
  'cell.könscell': all(circle(36, 62, 24, '#f6c9d4', C.ink, 2), circle(36, 62, 28, 'none', '#f2a7b8', 2), circle(40, 58, 6, '#fbe1e7', C.ink, 1.2), ring(36, 62, 33),
    g('translate(92 40)', ellipse(0, 0, 6, 4.4, C.white, C.ink, 1.4), line('M6 0 C12 -4 16 4 22 0', C.ink, 1.4)), ring(100, 40, 16), greyed(ellipse(96, 92, 14, 9, '#f6c8b4', '#c98a74', 1.2), circle(96, 92, 3, NUC2, null))),
  /** embryo: 1 cell → 2 → 4 → a ball of many cells, the ball ringed. */
  'cell.embryo': all(...[[14, 1], [36, 2], [60, 4]].map(([x, n]) => greyed(circle(x!, 60, 10, '#fde9e4', '#f2a7b8', 1.4), ...range(n!).map((i) => circle(f1(x! + (n === 1 ? 0 : Math.cos(i * Math.PI * 2 / n!) * 4)), f1(60 + (n === 1 ? 0 : Math.sin(i * Math.PI * 2 / n!) * 4)), n === 1 ? 6 : 4, '#fbd9cf', MEM, 0.8)))),
    ...[[24, 60], [47, 60], [70, 60]].map(([x, y]) => arrow(x! - 1, y!, x! + 3, y!, C.grey, 1.4)),
    circle(94, 60, 18, '#fde9e4', '#f2a7b8', 1.6), ...range(13).map((i) => circle(f1(94 + Math.cos(i * 2.4) * (i < 1 ? 0 : 5 + (i % 2) * 5)), f1(60 + Math.sin(i * 2.4) * (i < 1 ? 0 : 5 + (i % 2) * 5)), 4, '#fbd9cf', MEM, 0.8)), ring(94, 60, 23)),
  /** stamcell: a plain round cell in the middle, ringed, with arrows to a nerve cell, a red blood cell, a muscle cell and a skin cell. */
  'cell.stamcell': all(circle(60, 60, 14, '#fdf2d8', '#d8b35a', 1.8), nucleus(60, 60, 5), ring(60, 60, 19),
    arrow(46, 48, 30, 32, C.grey, 2), arrow(74, 48, 90, 32, C.grey, 2), arrow(46, 72, 30, 88, C.grey, 2), arrow(74, 72, 90, 88, C.grey, 2),
    g('translate(18 20)', circle(0, 0, 6, '#f2c14e', C.ink, 1.2), line('M-6 0 L-14 -4 M0 -6 L-2 -14 M5 -3 L12 -10 M5 4 L18 12', C.ink, 1.6)),
    g('translate(102 20)', ellipse(0, 0, 11, 8, BLOOD, C.ink, 1.4), ellipse(0, 0, 5, 3, '#b83030', null)),
    g('translate(18 100)', rect(-14, -5, 28, 10, '#f09a94', 5, MEM, 1.2), line('M-8 -4 L-8 4 M-3 -4 L-3 4 M2 -4 L2 4 M7 -4 L7 4', '#c95a5a', 1)),
    g('translate(102 100)', ellipse(0, 0, 12, 6, '#f6c8b4', '#c98a74', 1.2), circle(0, 0, 2, NUC2, null))),
  /** sårläkning: three steps on a knee: a fresh red wound → a brown scab → smooth healed skin; framed. */
  'cell.sårläkning': all(...[20, 60, 100].map((x) => ellipse(x, 60, 18, 24, SKIN, C.ink, 1.6)),
    path('M12 54 C16 50 24 52 28 56 C26 64 18 66 12 62 Z', '#c92a2a', C.ink, 1), drop(20, 72, 0.8, '#c92a2a'),
    path('M52 54 C56 50 64 52 68 56 C66 64 58 66 52 62 Z', '#8a4b2a', C.ink, 1.2), path('M94 56 C98 54 104 55 106 58', 'none', '#e8a888', 1.4),
    arrow(40, 96, 46, 96, C.grey, 2), arrow(80, 96, 86, 96, C.grey, 2), arrow(10, 104, 110, 104, HL, 2.6), frame(2, 30, 116, 82)),

  // ── 3517 Cellsignalering ────────────────────────────────────────
  /** cellsignalering: a sender cell releases orange molecules that travel to a receiver cell with receptors, which sparkles; framed. */
  'cell.cellsignalering': signal('all'),
  /** signalmolekyl: the same two cells greyed; the small orange molecule between them is ringed and shown big below. */
  'cell.signalmolekyl': signal('molecule'),
  /** receptor: the same scene; the cup-shaped receptors on the receiver are ringed (the molecules grey). */
  'cell.receptor': signal('receptor'),
  /** målcell: molecules float in a blood vessel past three cells; two grey cells without receptors, one with receptors catching them and sparkling, framed. */
  'cell.målcell': all(rect(4, 8, 112, 30, '#f7c4c4', 8, BLOOD, 1.6), ...[[20, 22], [44, 18], [68, 26], [92, 20]].map(([x, y]) => tri(x!, y!, 0.9)),
    greyed(path(smooth(blobPts(20, 82, 15, 15, WOB)), CYTO, MEM, 1.6), path(smooth(blobPts(100, 82, 15, 15, WOB)), CYTO, MEM, 1.6)),
    path(smooth(blobPts(60, 82, 17, 17, WOB)), CYTO, MEM, 1.8), nucleus(60, 84, 5), receptor(52, 64, 0.6), receptor(68, 64, 0.6), tri(52, 61, 0.7), arrow(68, 40, 68, 54, HL, 1.8), sparkle(80, 96, 5, C.gold), frame(38, 56, 44, 50)),
  /** doftämne: a steaming coffee cup; small molecule shapes rise to a nose, the molecules ringed. */
  'cell.doftämne': all(ground(), path('M14 80 L50 80 L46 108 L18 108 Z', C.white, C.ink, 1.8), path('M50 86 C60 86 60 98 48 98', 'none', C.ink, 1.8), ellipse(32, 82, 16, 3, '#6b3e1f', null),
    ...[[30, 66], [38, 56], [48, 50], [58, 44]].map(([x, y], i) => i % 2 ? tri(x!, y!, 0.8, '#b07ad0') : circle(x!, y!, 3.4, '#b07ad0', C.ink, 1)), oval(44, 54, 22, 20),
    g('translate(126 4) scale(-0.56 0.56)', PROFILE), arrow(60, 42, 66, 40, C.grey, 1.4)),
  /** histamin: a cell bursts and releases many orange dots (ringed); a sneezing face with pollen beside it. */
  'cell.histamin': all(path(smooth(blobPts(30, 70, 20, 20, WOB)), CYTO, MEM, 1.8), nucleus(28, 72, 6), ...range(10).map((i) => circle(f1(30 + Math.cos(i * 0.7 - 1.2) * (26 + (i % 3) * 5)), f1(70 + Math.sin(i * 0.7 - 1.2) * (26 + (i % 3) * 5)), 2.2, HL, C.ink, 0.6)), ring(46, 48, 22),
    circle(92, 72, 18, SKIN, C.ink, 1.8), line('M84 66 L88 70 M100 66 L96 70', C.ink, 1.6), ellipse(92, 82, 4, 3, C.ink, null), line('M74 84 L66 90 M74 90 L64 96', '#8cc7e8', 1.6), circle(92, 74, 2, '#e06060', null),
    ...[[92, 26], [104, 34], [80, 30]].map(([x, y]) => all(circle(x!, y!, 3.2, C.yellow, C.ink, 0.8), circle(x! - 1, y! - 1, 0.8, '#c89a20', null)))),
  /** blockera (stänga vägen): a fallen tree lies across a road; the car must stop (cross); the tree is ringed. */
  'cell.blockera.2': all(rect(4, 76, 112, 24, '#8a8f98', 0, null), line('M8 88 L20 88 M32 88 L44 88 M56 88 L68 88 M80 88 L92 88 M104 88 L112 88', C.white, 2),
    g('rotate(-8 74 84)', rect(52, 78, 50, 10, C.brown, 4, C.ink, 1.6)), circle(100, 74, 12, C.green, C.ink, 1.4), circle(92, 66, 9, C.green, C.ink, 1.2), ring(78, 80, 26),
    car(24, 98, 0.7, C.sky), cross(44, 66, 5), tree(14, 70, 0.6)),
};
