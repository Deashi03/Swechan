/**
 * Matematik & naturvetenskap → Kemi → Molekyler & kemiska bindningar, 3421–3427 (0.51): molecules and formulas,
 * covalent bonds, ions and ionic bonds, metallic bonds, molecular shapes, polar and non-polar molecules and
 * intermolecular forces.
 * Recurring signs: atoms are shaded balls (hydrogen white, oxygen red, carbon dark grey, nitrogen blue, chlorine
 * green, metal silver); bonds are grey sticks; electrons are small blue balls with −. The part the word names is
 * orange (ring, frame, arrow or stroke) and a grey reference shows what the word is not. Close words share one
 * layout where only the marked part differs: enkel-/dubbel-/trippelbindning (two balls with one, two or three
 * orange sticks and a row of three small bond icons where the matching one is ringed); positiv/negativ jon (the
 * same atom losing or gaining an electron, + or − badge); metallbindning/metalljon/fri elektron (one metal
 * lattice: the whole electron sea, one ion or the moving electrons marked); formbar/spröd (one hammer: a metal
 * bar that bends flat versus a crystal that shatters); kulstavs-/kalottmodell (the same water molecule as balls
 * and sticks or as overlapping spheres); polär/opolär (a molecule in a halo: red/blue with + and − versus even
 * and unsigned); intermolekylär kraft/vätebindning/van der Waals-kraft (generic molecules with springs, water
 * H···O dotted lines, long chains side by side).
 * Element letters and digits only; no words, no brands, no logos.
 */
import { C, all, circle, ellipse, g, line, path, rect, sparkle, waPulse, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const SOFT = '#f4f6f8';
const MARK = '#fff3b0';
const H_ = '#fbfbf8';
const O_ = '#e85a5a';
const C_ = '#3d3f4a';
const N_ = '#4a78d0';
const CL = '#8cc84b';
const MET = '#b8c2cc';
const NA = '#9b7fd0';
const ELE = '#3a8ae8';
const WATER = '#bfe3f5';
const COPPER = '#c87533';
const BRASS = '#d9b64a';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ground = line('M4 112 L116 112', C.grey2, 2);
const bg = (col: string = SOFT) => rect(4, 4, 112, 108, col, 3, null);
const ring = (x: number, y: number, r: number, col: string = HL, sw = 2.4) => circle(x, y, r, 'none', col, sw);
const dark = (c: string) => c === C_ || c === N_ || c === O_ || c === NA;
/** Shaded atom ball with an optional element letter. */
const ball = (x: number, y: number, r: number, col: string, letter = '') => all(circle(x, y, r, col, C.ink, 1.4),
  circle(f1(x - r * 0.35), f1(y - r * 0.38), f1(r * 0.25), 'rgba(255,255,255,0.55)', null),
  letter ? T(x, f1(y + r * 0.36), letter, f1(r * (letter.length > 1 ? 0.8 : 1.05)), dark(col) ? C.white : C.ink) : '');
/** Bond stick from (x1, y1) to (x2, y2). */
const stick = (x1: number, y1: number, x2: number, y2: number, col: string = C.grey, sw = 4) => all(line(`M${x1} ${y1} L${x2} ${y2}`, C.ink, sw + 1.6), line(`M${x1} ${y1} L${x2} ${y2}`, col, sw));
/** n parallel sticks between two points (double, triple bonds). */
const sticks = (x1: number, y1: number, x2: number, y2: number, n: number, col: string = C.grey, sw = 3, gap = 6) => {
  const L = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / L, ny = (x2 - x1) / L;
  return all(...range(n).map((i) => { const o = (i - (n - 1) / 2) * gap; return stick(f1(x1 + nx * o), f1(y1 + ny * o), f1(x2 + nx * o), f1(y2 + ny * o), col, sw); }));
};
const electron = (x: number, y: number, r = 3.2, col: string = ELE) => all(circle(x, y, r, col, C.ink, 1), r >= 2.8 ? line(`M${f1(x - r * 0.5)} ${y} L${f1(x + r * 0.5)} ${y}`, C.white, 1.1) : '');
/** Arrowhead with its tip at (x, y), pointing along angle a (radians). */
const head = (x: number, y: number, a: number, col: string, s = 1) => {
  const L = 7 * s, W = 4 * s, c = Math.cos(a), si = Math.sin(a);
  return path(`M${f1(x)} ${f1(y)} L${f1(x - L * c + W * si)} ${f1(y - L * si - W * c)} L${f1(x - L * c - W * si)} ${f1(y - L * si + W * c)} Z`, col, null);
};
const arr = (x1: number, y1: number, x2: number, y2: number, col: string = HL, sw = 3, dash?: string) => all(line(`M${x1} ${y1} L${x2} ${y2}`, col, sw, dash), head(x2, y2, Math.atan2(y2 - y1, x2 - x1), col, sw / 3 + 0.3));
const check = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 9, '#dff2e4', C.green, 1.8), line('M-4.5 0 L-1 3.8 L5 -4', C.green, 2.6));
const cross = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 9, '#f8dede', C.red, 1.8), line('M-4 -4 L4 4 M4 -4 L-4 4', C.red, 2.6));
const badge = (x: number, y: number, sign: string, col: string, r = 10) => all(circle(x, y, r, MARK, HL, 2.6), T(x, f1(y + r * 0.5), sign, f1(r * 1.6), col));
const smell = (x: number, y: number, col: string = C.grey) => line(`M${x} ${y} c-4 -5 4 -8 0 -13 c-4 -5 4 -8 0 -13 M${x + 8} ${y + 2} c-4 -5 4 -8 0 -13 c-4 -5 4 -8 0 -13`, col, 1.8);
const drop = (x: number, y: number, s = 1, col: string = WATER) => path(`M${x} ${f1(y - 6 * s)} C${f1(x + 5 * s)} ${y} ${f1(x + 4 * s)} ${f1(y + 5 * s)} ${x} ${f1(y + 5 * s)} C${f1(x - 4 * s)} ${f1(y + 5 * s)} ${f1(x - 5 * s)} ${y} ${x} ${f1(y - 6 * s)} Z`, col, C.ink, 1);

// ── Molecules ────────────────────────────────────────────────────────
/** Ball-and-stick water: O at (x, y), H atoms below left and right (about 105°). */
const water = (x: number, y: number, s = 1, rot = 0, o: { sticks?: string; letters?: boolean } = {}) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  stick(0, 0, -11, 8.5, o.sticks ?? C.grey, 3.4), stick(0, 0, 11, 8.5, o.sticks ?? C.grey, 3.4),
  ball(0, 0, 8, O_, o.letters ? 'O' : ''), ball(-13, 10, 5.4, H_, o.letters ? 'H' : ''), ball(13, 10, 5.4, H_, o.letters ? 'H' : ''));
/** Space-filling water. */
const waterFill = (x: number, y: number, s = 1) => at(x, y, s, circle(-11, 9, 8, H_, C.ink, 1.4), circle(11, 9, 8, H_, C.ink, 1.4), circle(0, 0, 13, O_, C.ink, 1.4), circle(-4, -5, 3, 'rgba(255,255,255,0.5)', null));
/** Straight CO2. */
const co2 = (x: number, y: number, s = 1) => at(x, y, s, stick(-16, 0, 16, 0, C.grey, 3), ball(-17, 0, 7, O_), ball(17, 0, 7, O_), ball(0, 0, 8, C_));
/** Methane in perspective (one H up, three below). */
const methane = (x: number, y: number, s = 1, cMark = false) => at(x, y, s,
  stick(0, 0, 0, -20), stick(0, 0, -18, 9), stick(0, 0, 17, 11), stick(0, 0, 5, 16),
  ball(0, -22, 6, H_), ball(-20, 10, 6, H_), ball(19, 12, 6, H_), ball(6, 19, 6, H_),
  cMark ? circle(0, 0, 13, MARK, null) : '', ball(0, 0, 9, C_), cMark ? ring(0, 0, 13) : '');
/** Ammonia as a low pyramid: N on top, three H below. */
const ammonia = (x: number, y: number, s = 1) => at(x, y, s, stick(0, 0, -16, 12), stick(0, 0, 16, 12), stick(0, 0, 3, 18), ball(-17, 13, 6, H_), ball(17, 13, 6, H_), ball(3, 20, 6, H_), ball(0, 0, 9, N_));
/** Two atoms side by side (diatomic). */
const diatomic = (x: number, y: number, col: string, r = 10, n = 1, d = 26, stickCol: string = C.grey, letter = '') => all(sticks(x - d / 2, y, x + d / 2, y, n, stickCol, n > 1 ? 2.6 : 3.6, 6), ball(x - d / 2, y, r, col, letter), ball(x + d / 2, y, r, col, letter));
/** Row of three small grey bond icons (one, two, three sticks); the chosen one is ringed in orange. */
const icons = (k: number) => all(...[0, 1, 2].map((i) => sticks(18 + i * 34, 92, 34 + i * 34, 92, i + 1, C.grey, 1.6, 4)), ring(26 + k * 34, 92, 13));
/** Gas cylinder. */
const cylinder = (x: number, y: number, col: string, h = 56) => all(rect(x - 11, y - h, 22, h, col, 9, C.ink, 1.8), rect(x - 4, y - h - 8, 8, 9, C.silver, 1, C.ink, 1.4), rect(x - 7, y - h - 12, 14, 5, C.dark, 2, C.ink, 1.2));
/** Gas bubble with content. */
const bubbleC = (x: number, y: number, r: number, ...k: Svg[]) => all(circle(x, y, r, C.white, C.ink, 1.6), ...k);

// ── Electrons and atoms ──────────────────────────────────────────────
/** Atom with a nucleus dot and one shell carrying n electrons; `gap` leaves dashed empty slots. */
const shellAtom = (x: number, y: number, r: number, n: number, o: { slots?: number; ringCol?: string; ringW?: number; nucleus?: string; start?: number } = {}) => {
  const tot = o.slots ?? n, a0 = o.start ?? -Math.PI / 2;
  return all(circle(x, y, r, 'none', o.ringCol ?? C.grey, o.ringW ?? 1.6), circle(x, y, r * 0.3, o.nucleus ?? '#e8a0a0', C.ink, 1.2),
    ...range(tot).map((i) => { const a = a0 + (i / tot) * Math.PI * 2, ex = f1(x + r * Math.cos(a)), ey = f1(y + r * Math.sin(a)); return i < n ? electron(ex, ey, 3.2) : circle(ex, ey, 3.2, C.white, C.grey, 1.2); }));
};

// ── Metal lattice ────────────────────────────────────────────────────
const LAT: [number, number][] = [];
for (const yy of [38, 62, 86]) for (const xx of [30, 60, 90]) LAT.push([xx, yy]);
const EL: [number, number][] = [[45, 30], [75, 46], [18, 50], [45, 74], [102, 58], [75, 96], [30, 100], [62, 50], [90, 74], [16, 80], [104, 32]];
const metalIon = (x: number, y: number, r = 9, grey = false) => all(circle(x, y, r, grey ? C.grey2 : MET, grey ? C.grey : C.ink, 1.4), T(x, y + 4.5, '+', 13, grey ? C.grey : C.red));
const lattice = (mode: 'bond' | 'ion' | 'free') => all(
  bg(), mode === 'bond' ? rect(8, 20, 104, 92 - 4, '#dcebfb', 14, HL, 3) : rect(8, 20, 104, 88, '#e9f1fa', 14, null),
  ...LAT.map(([x, y], i) => all(mode === 'ion' && i === 4 ? circle(x, y, 14, MARK, null) : '', metalIon(x, y, 9, mode === 'free'), mode === 'ion' && i === 4 ? ring(x, y, 14) : '')),
  ...EL.map(([x, y], i) => mode === 'ion' ? greyed(electron(x, y, 3)) : all(mode === 'free' && i < 4 ? line(`M${x - 14} ${y + 3} L${x - 5} ${y}`, HL, 2, '3 2') : '', electron(x, y, 3.2), mode === 'free' && i < 4 ? ring(x, y, 6, HL, 1.8) : '')),
  mode === 'bond' ? all(arr(60, 62 - 13, 62, 52, HL, 1.8), arr(60 - 12, 74 - 2, 46, 74, HL, 1.8)) : '');

// ── Hammer test (formbar / spröd) ────────────────────────────────────
const hammer = (x: number, y: number, rot = -30) => g(`translate(${x} ${y}) rotate(${rot})`, rect(-3, -2, 6, 40, C.tan, 2, C.ink, 1.6), rect(-14, -12, 28, 12, C.dark, 2, C.ink, 1.6));
const anvil = all(path('M30 96 L90 96 L84 88 L36 88 Z', C.dark, C.ink, 1.6), rect(50, 96, 20, 10, C.dark, 1, C.ink, 1.4), rect(38, 106, 44, 6, C.dark, 1, C.ink, 1.4));

// ── Small props ──────────────────────────────────────────────────────
const glassW = (x: number, y: number, fill: string = WATER, w = 26, h = 40) => all(path(`M${x - w / 2} ${y - h} L${x + w / 2} ${y - h} L${x + w / 2 - 3} ${y} L${x - w / 2 + 3} ${y} Z`, 'rgba(220,240,252,0.5)', C.ink, 1.6), path(`M${x - w / 2 + 1} ${y - h * 0.75} L${x + w / 2 - 1} ${y - h * 0.75} L${x + w / 2 - 3.4} ${y - 1} L${x - w / 2 + 3.4} ${y - 1} Z`, fill, null));
const bottle = (x: number, y: number, col: string, h = 50, cap: string = C.white) => all(path(`M${x - 12} ${y} L${x - 12} ${y - h + 14} C${x - 12} ${y - h + 6} ${x - 5} ${y - h + 6} ${x - 5} ${y - h} L${x + 5} ${y - h} C${x + 5} ${y - h + 6} ${x + 12} ${y - h + 6} ${x + 12} ${y - h + 14} L${x + 12} ${y} Z`, col, C.ink, 1.6), rect(x - 6, y - h - 7, 12, 8, cap, 2, C.ink, 1.4));
const tap = (x: number, y: number) => all(rect(x - 30, y - 6, 34, 10, C.silver, 4, C.ink, 1.6), path(`M${x - 4} ${y - 6} L${x + 6} ${y - 6} C${x + 12} ${y - 6} ${x + 14} ${y} ${x + 14} ${y + 8} L${x + 6} ${y + 8} C${x + 6} ${y + 4} ${x + 4} ${y + 4} ${x - 4} ${y + 4} Z`, C.silver, C.ink, 1.6), rect(x - 22, y - 16, 12, 10, C.silver, 2, C.ink, 1.4));
/** Halo around a molecule: polar (red/blue halves with signs) or even. */
const halo = (x: number, y: number, rx: number, ry: number, polar: boolean, col: string = HL) => polar
  ? all(path(`M${x - rx} ${y} A${rx} ${ry} 0 0 1 ${x + rx} ${y} Z`, 'rgba(58,138,232,0.25)', null), path(`M${x - rx} ${y} A${rx} ${ry} 0 0 0 ${x + rx} ${y} Z`, 'rgba(232,90,90,0.25)', null), ellipse(x, y, rx, ry, 'none', col, 2.6))
  : ellipse(x, y, rx, ry, 'rgba(242,193,78,0.25)', col, 2.6);

export const BONDS_MOTIFS: Record<string, Svg> = {
  // ── 3421 Molekyler och kemiska formler ──────────────────────────────
  /** index (kemi): a big formula H₂O on a card; the small low 2 is framed in orange; below, the water molecule with its two white H balls ringed in orange (two of them). */
  'bind.index.3': all(bg(), rect(12, 16, 96, 50, C.white, 6, C.ink, 1.8), T(36, 54, 'H', 32), rect(48, 44, 16, 20, MARK, 3, HL, 2.6), T(56, 60, '2', 16, HL), T(80, 54, 'O', 32), water(60, 82, 1.2), ring(44.4, 94, 8.5, HL, 2), ring(75.6, 94, 8.5, HL, 2)),
  /** strukturformel: a card with H–O–H where the two bond strokes are thick and orange; above it a small grey H₂O for comparison. */
  'bind.strukturformel': all(bg(), greyed(T(60, 32, 'H₂O', 18)), rect(10, 46, 100, 44, C.white, 6, C.ink, 1.8), T(26, 80, 'H', 26), T(60, 80, 'O', 26), T(94, 80, 'H', 26), line('M37 70 L49 70', HL, 4.4), line('M71 70 L83 70', HL, 4.4)),
  /** molekylmodell: an open kit box with loose red, white and black balls and grey sticks; beside it a built water model on a little stand, ringed in orange. */
  'bind.molekylmodell': all(bg('#f1ece2'), rect(6, 88, 108, 6, C.tan, 2, C.ink, 1.4), rect(10, 66, 52, 22, '#7aa8d8', 3, C.ink, 1.6), path('M10 66 L18 52 L70 52 L62 66 Z', '#a8c8ea', C.ink, 1.4), ball(20, 76, 5, O_), ball(31, 79, 4.4, H_), ball(41, 75, 5, C_), ball(52, 79, 4.4, H_), line('M20 70 L30 66 M36 70 L50 68', C.grey, 2.4), circle(88, 52, 26, MARK, null), water(88, 50, 1.5), line('M88 64 L88 88', C.dark, 2), rect(80, 84, 16, 4, C.dark, 1, C.ink, 1), ring(88, 52, 26)),
  /** vattenmolekyl: a big blue water drop; a magnifier circle on it shows one water molecule (red O, two white H) ringed in orange. */
  'bind.vattenmolekyl': all(bg(), drop(38, 66, 7), line('M52 58 L66 48', C.grey, 1.4, '3 3'), circle(84, 40, 26, C.white, C.ink, 2), water(84, 36, 1.5), ring(84, 40, 29), line('M64 60 L52 74', C.dark, 4)),
  /** syrgas: a white-shouldered gas cylinder with a hose to a nose cannula on a resting face; a bubble above shows an O₂ molecule (two red balls) ringed in orange. */
  'bind.syrgas': all(bg(), cylinder(28, 108, '#e8eef2'), rect(17, 52, 22, 10, C.white, 0, C.ink, 1.4), path('M28 40 C28 22 64 20 70 50 C74 64 70 70 78 74', 'none', '#9fd3f0', 2.4), rect(60, 90, 50, 18, C.white, 3, C.ink, 1.4), circle(84, 80, 13, C.skin, C.ink, 1.6), path('M71 76 C72 64 96 64 97 76 C90 70 78 70 71 76 Z', C.hair, null), line('M78 82 L82 82 M86 82 L90 82', C.ink, 1.2), path('M76 86 C80 90 88 90 92 86', 'none', '#9fd3f0', 2), bubbleC(86, 32, 18, diatomic(86, 32, O_, 7, 2, 16)), ring(86, 32, 21)),
  /** vätgas: a small car at a fuel pump whose nozzle is in the car; a bubble above the pump shows an H₂ molecule (two white balls) ringed in orange. */
  'bind.vätgas': all(bg(), ground, rect(12, 54, 22, 58, '#5aa0d8', 3, C.ink, 1.8), rect(16, 60, 14, 12, C.white, 2, C.ink, 1.2), path('M34 70 C46 70 48 80 58 82', 'none', C.dark, 2.4), path('M48 96 L54 82 L94 80 L108 96 L108 104 L48 104 Z', '#7fc1a3', C.ink, 1.8), path('M60 82 L66 72 L90 72 L96 82 Z', '#cfeaf7', C.ink, 1.4), circle(62, 106, 6, C.dark, C.ink, 1.4), circle(98, 106, 6, C.dark, C.ink, 1.4), bubbleC(70, 32, 18, diatomic(70, 32, H_, 7, 1, 16)), ring(70, 32, 21)),

  // ── 3422 Kovalenta bindningar ───────────────────────────────────────
  /** kovalent bindning: two atoms with grey shells overlap; in the overlap two electrons sit together; the whole joint between the atoms is framed in orange. */
  'bind.kovalent-bindning': all(bg(), circle(42, 60, 26, 'rgba(140,199,232,0.25)', C.grey, 1.6), circle(78, 60, 26, 'rgba(140,199,232,0.25)', C.grey, 1.6), circle(42, 60, 7, '#e8a0a0', C.ink, 1.2), circle(78, 60, 7, '#e8a0a0', C.ink, 1.2), ellipse(60, 60, 10, 22, MARK, HL, 2.8), electron(60, 52, 3.6), electron(60, 68, 3.6)),
  /** elektronpar: two blue electrons side by side inside an orange oval, with a small 2 beside them; a single grey electron alone to the left. */
  'bind.elektronpar': all(bg(), greyed(electron(22, 60, 7)), ellipse(70, 60, 34, 22, MARK, HL, 3), electron(56, 60, 11), electron(84, 60, 11), T(70, 100, '2', 18, HL)),
  /** ädelgasstruktur: left, a grey atom with seven electrons and one empty dashed slot; an arrow leads to the same atom on the right with all eight places filled and its outer ring orange, with a green check. */
  'bind.ädelgasstruktur': all(bg(), greyed(shellAtom(28, 56, 18, 7, { slots: 8 })), arr(50, 56, 62, 56, C.grey, 2), circle(88, 56, 22, MARK, null), waPulse('b4-bind-adelgasstruktur-1', shellAtom(88, 56, 18, 8, { ringCol: HL, ringW: 3.4 })), check(88, 96)),
  /** elektronformel: a card with H : O : H where the electrons are blue dots round the letters (two pairs between the atoms, two pairs on O above and below); the dots are ringed by an orange outline. */
  'bind.elektronformel': (() => {
    const dot = (x: number, y: number) => circle(x, y, 2.6, ELE, C.ink, 0.6);
    return all(bg(), rect(8, 30, 104, 60, C.white, 6, C.ink, 1.8), T(20, 70, 'H', 22), T(60, 70, 'O', 24), T(100, 70, 'H', 22),
      dot(38, 56), dot(38, 66), dot(82, 56), dot(82, 66), dot(55, 42), dot(65, 42), dot(55, 82), dot(65, 82),
      ellipse(38, 61, 6, 11, 'none', HL, 2), ellipse(82, 61, 6, 11, 'none', HL, 2), ellipse(60, 42, 11, 6, 'none', HL, 2), ellipse(60, 82, 11, 6, 'none', HL, 2));
  })(),
  /** enkelbindning: two white H balls joined by one orange stick; below, three small grey bond icons (one, two, three sticks) with the first ringed. */
  'bind.enkelbindning': all(bg(), diatomic(60, 46, H_, 13, 1, 52, HL, 'H'), icons(0)),
  /** dubbelbindning: two red O balls joined by two orange sticks; below, the same three small bond icons with the middle one ringed. */
  'bind.dubbelbindning': all(bg(), diatomic(60, 46, O_, 13, 2, 52, HL, 'O'), icons(1)),
  /** trippelbindning: two blue N balls joined by three orange sticks; below, the three small bond icons with the last one ringed. */
  'bind.trippelbindning': all(bg(), diatomic(60, 46, N_, 13, 3, 52, HL, 'N'), icons(2)),
  /** klorgas: a closed glass jar full of yellow-green gas, with a hazard diamond showing a skull; a bubble shows a Cl₂ molecule (two green balls) ringed in orange. */
  'bind.klorgas': all(bg(), ground, path('M18 112 L18 50 C18 44 22 42 26 42 L58 42 C62 42 66 44 66 50 L66 112 Z', 'rgba(170,215,90,0.55)', C.ink, 1.8), rect(22, 34, 40, 9, C.grey, 2, C.ink, 1.4), ...[[30, 66], [50, 80], [36, 96], [54, 58]].map(([x, y]) => circle(x!, y!, 5, 'rgba(140,200,75,0.7)', null)),
    g('translate(42 86) rotate(45)', rect(-9, -9, 18, 18, C.white, 1, C.red, 2)), circle(42, 84, 3.6, C.white, C.ink, 1.1), line('M39 90 L45 90', C.ink, 1.2), bubbleC(90, 36, 20, diatomic(90, 36, CL, 7.5, 1, 17)), ring(90, 36, 23)),

  // ── 3423 Joner och jonbindning ──────────────────────────────────────
  /** laddad: two balls, one red with + and one blue with −, each in an orange glow ring; a grey ball with +− balanced sits between them below. */
  'bind.laddad': all(bg(), circle(30, 44, 20, MARK, HL, 2.6), ball(30, 44, 14, O_), T(30, 51, '+', 20, C.white), circle(90, 44, 20, MARK, HL, 2.6), ball(90, 44, 14, ELE), T(90, 51, '−', 20, C.white), greyed(ball(60, 88, 13, C.grey2), T(54, 93, '+', 12), T(67, 92, '−', 12))),
  /** positiv jon: an atom shell with two electrons; a third electron flies away out of the shell along a grey dashed arrow (its old place empty); a big orange-framed + badge. */
  'bind.positiv-jon': all(bg(), shellAtom(48, 62, 26, 2, { slots: 3, start: Math.PI / 6 + Math.PI * 2 / 3 }), arr(60, 46, 90, 22, C.grey, 1.8, '3 2'), electron(98, 16, 4), badge(48, 62, '+', C.red, 12)),
  /** negativ jon: the same atom shell with two electrons; a third electron comes in from outside along a dashed arrow to an empty place; a big orange-framed − badge. */
  'bind.negativ-jon': all(bg(), shellAtom(48, 62, 26, 2, { slots: 3, start: Math.PI / 6 + Math.PI * 2 / 3 }), electron(98, 16, 4), arr(94, 20, 64, 44, C.grey, 1.8, '3 2'), badge(48, 62, '−', ELE, 12)),
  /** jonbindning: on top an electron jumps from a silver metal ball to a green ball; below, the silver + ion and the green − ion stuck together, joined by an orange band with attraction arrows. */
  'bind.jonbindning': all(bg(), greyed(ball(32, 28, 9, MET), ball(88, 28, 11, CL)), line('M40 22 C54 8 70 8 80 20', C.grey, 1.6, '3 2'), electron(60, 12, 3), rect(30, 58, 60, 40, MARK, 20, HL, 2.8), ball(46, 78, 13, MET), T(46, 84, '+', 18, C.red), ball(76, 78, 15, CL), T(76, 84, '−', 20, ELE)),
  /** natriumklorid: a salt shaker; a magnifier shows a small cube of alternating purple and green balls, ringed in orange. */
  'bind.natriumklorid': all(bg('#f1ece2'), ground, path('M14 112 L18 62 L42 62 L46 112 Z', C.white, C.ink, 1.8), path('M18 62 C18 46 42 46 42 62 Z', C.silver, C.ink, 1.6), ...[[26, 54], [30, 51], [34, 54]].map(([x, y]) => circle(x!, y!, 1.2, C.ink, null)), ...[[24, 104], [36, 100], [30, 92]].map(([x, y]) => rect(x!, y!, 3, 3, C.white, 0.5, C.grey, 0.6)),
    line('M48 70 L60 62', C.dark, 4), circle(84, 46, 30, C.white, C.ink, 2), ...range(3).flatMap((r) => range(3).map((c) => ball(70 + c * 14, 32 + r * 14, (r + c) % 2 ? 6.6 : 4.6, (r + c) % 2 ? CL : NA))), ring(84, 46, 33)),
  /** gitter: a flat pattern of equal dots on an orange square grid, one square shaded yellow and copied along with small arrows (the same pattern again and again); below, the same dots in grey lying in a jumble with no order */
  'bind.gitter': all(bg(), ...range(5).map((i) => line(`M${20 + i * 20} 18 L${20 + i * 20} 78`, HL, 1.8)), ...range(4).map((j) => line(`M20 ${18 + j * 20} L100 ${18 + j * 20}`, HL, 1.8)), rect(20, 18, 20, 20, 'rgba(255,243,176,0.9)', 0, HL, 2.6), ...range(5).flatMap((i) => range(4).map((j) => circle(20 + i * 20, 18 + j * 20, 4.4, '#7d8fb3', C.ink, 1.2))), arr(44, 28, 54, 28, C.ink, 1.4), arr(30, 42, 30, 52, C.ink, 1.4), greyed(...[[18, 98], [30, 104], [44, 94], [58, 106], [70, 96], [84, 104], [98, 95], [36, 92], [76, 108], [104, 106]].map(([x, y]) => circle(x!, y!, 4.4, '#7d8fb3', C.ink, 1.2)))),
  /** fluorid: a toothpaste tube squeezing paste onto a brush; beside it a white tooth behind an orange shield, with a small light-green ball with − on the shield. */
  'bind.fluorid': all(bg(), path('M8 70 L44 64 L46 76 L10 86 Z', '#e8f4fb', C.ink, 1.6), rect(44, 64, 8, 12, '#5aa0d8', 2, C.ink, 1.2), line('M14 100 L62 92', '#5aa0d8', 5), rect(48, 84, 14, 7, C.white, 2, C.ink, 1.2), path('M50 82 C50 76 60 76 60 82', '#bfe9f5', C.ink, 1),
    path('M82 30 C74 30 70 38 72 48 C74 58 76 74 80 76 C84 76 84 62 88 62 C92 62 92 76 96 76 C100 74 102 58 104 48 C106 38 102 30 94 30 C90 30 90 33 88 33 C86 33 86 30 82 30 Z', C.white, C.ink, 1.8), path('M72 36 L104 36 L104 56 C104 70 88 82 88 82 C88 82 72 70 72 56 Z', 'rgba(255,243,176,0.55)', HL, 2.6), ball(88, 52, 7, '#c6e870'), T(88, 56, '−', 10, C.ink)),

  // ── 3424 Metallbindning ─────────────────────────────────────────────
  /** metallbindning: rows of silver + ions in a blue sea of electrons; the whole sea is framed in orange and two small orange arrows show ions and electrons pulling on each other. */
  'bind.metallbindning': lattice('bond'),
  /** metalljon: the same metal lattice; one silver + ion in the middle is ringed in orange, the electrons are grey. */
  'bind.metalljon': lattice('ion'),
  /** fri elektron: the same lattice with grey ions; the blue electrons are bright and some of them have orange rings and dashed tracks to show that they move freely. */
  'bind.fri-elektron': lattice('free'),
  /** leda ström: a battery, wires and a metal rod make a circle with a glowing lamp, the rod framed in orange; below, the same circle with a wooden stick and a dark lamp in grey. */
  'bind.leda-ström': (() => {
    const circuit = (y: number, rod: string, lit: boolean) => all(rect(10, y - 8, 22, 16, C.dark, 2, C.ink, 1.4), rect(32, y - 4, 4, 8, C.silver, 1, C.ink, 1), line(`M21 ${y - 8} L21 ${y - 18} L50 ${y - 18} M70 ${y - 18} L96 ${y - 18} L96 ${y - 6} M96 ${y + 6} L96 ${y + 10} L36 ${y + 10} L36 ${y + 4}`, C.ink, 1.6), rect(50, y - 22, 20, 8, rod, 2, C.ink, 1.2), lit ? all(...[-1, 0, 1].map((i) => line(`M${96 + i * 10} ${y - 14 + Math.abs(i) * 4} l${i * 3} -4`, C.gold, 1.8))) : '', circle(96, y, 6.5, lit ? C.yellow : C.grey2, C.ink, 1.4));
    return all(bg(), circuit(44, MET, true), rect(46, 18, 28, 16, 'none', 3, HL, 2.6), greyed(circuit(94, C.tan, false)));
  })(),
  /** koppartråd: a wooden spool wound with shiny copper wire, a loose end curling out, ringed in orange. */
  'bind.koppartråd': all(bg(), ground, rect(26, 30, 12, 76, C.tan, 3, C.ink, 1.6), rect(82, 30, 12, 76, C.tan, 3, C.ink, 1.6), rect(38, 40, 44, 56, COPPER, 2, C.ink, 1.6), ...range(13).map((i) => line(`M38 ${43 + i * 4.2} L82 ${43 + i * 4.2}`, '#e9a36b', 1.2)), path('M82 92 C100 96 106 80 98 70 C92 62 104 52 110 56', 'none', C.ink, 3.6), path('M82 92 C100 96 106 80 98 70 C92 62 104 52 110 56', 'none', COPPER, 2.4), ellipse(60, 68, 28, 34, 'none', HL, 2.6)),
  /** metallglans: a polished silver metal bar with white streaks and sparkles; a yellow light ray hits it and bounces off brightly, the bar ringed in orange; beside it a matte grey stone where the same ray just stops */
  'bind.metallglans': all(bg(), ground, path('M10 96 L58 88 L66 96 L18 104 Z', '#e4e9ee', C.ink, 1.8), path('M18 104 L66 96 L66 102 L18 110 Z', '#aab4be', C.ink, 1.4), line('M20 98 L50 93', C.white, 2.6), sparkle(30, 96, 6), sparkle(52, 92, 4), arr(10, 30, 34, 92, '#f2b705', 2.6), arr(36, 92, 58, 34, '#f2b705', 2.6), sparkle(60, 30, 5), ellipse(38, 97, 32, 14, 'none', HL, 2.6), ellipse(96, 102, 16, 9, '#8f969d', C.ink, 1.6), line('M88 100 L92 98 M100 104 L104 101', C.grey, 1), arr(78, 30, 94, 92, '#f2b705', 2.2), greyed(circle(110, 28, 7, C.yellow, C.ink, 1.2))),
  /** formbar: a hammer comes down on a metal bar on an anvil; the bar is beaten flat and bent, outlined in orange, with no cracks. */
  'bind.formbar': all(bg(), hammer(70, 28, -25), path('M24 82 C36 80 50 86 60 86 C72 86 84 80 96 84 L96 88 C84 85 72 90 60 90 C48 90 36 84 24 86 Z', MET, HL, 2.6), anvil, line('M48 52 l-4 -4 M58 50 l0 -6', C.grey, 1.4)),
  /** spröd (om material): the same hammer and anvil; a glassy blue crystal block shatters into sharp pieces that fly out, outlined in orange. */
  'bind.spröd.2': all(bg(), hammer(70, 28, -25), anvil, path('M44 88 L52 74 L60 84 Z', '#cdeaf7', HL, 2), path('M60 84 L70 72 L78 88 Z', '#cdeaf7', HL, 2), path('M30 80 L38 70 L42 84 Z', '#cdeaf7', HL, 2), path('M82 78 L92 70 L94 84 Z', '#cdeaf7', HL, 2), path('M50 64 L56 58 L58 66 Z', '#cdeaf7', HL, 1.6), line('M26 66 l-6 -4 M96 64 l6 -4 M40 58 l-4 -6', C.grey, 1.4)),
  /** mässing: a yellow door handle on a door and a little yellow bell; above, a copper ball + a grey metal ball = a yellow ball, ringed in orange. */
  'bind.mässing': all(bg(), rect(8, 46, 50, 66, '#e8d8bf', 2, C.ink, 1.6), circle(46, 80, 5, BRASS, C.ink, 1.4), rect(44, 77, 20, 6, BRASS, 3, C.ink, 1.4), path('M78 110 C78 92 82 82 92 80 C102 82 106 92 106 110 Z', BRASS, C.ink, 1.6), circle(92, 76, 4, BRASS, C.ink, 1.2), ball(18, 22, 7, COPPER), T(32, 27, '+', 12), ball(46, 22, 7, C.grey2), T(60, 27, '=', 12), circle(80, 22, 11, MARK, null), ball(80, 22, 8, BRASS), ring(80, 22, 11), sparkle(102, 92, 4)),
  /** aluminiumfolie: a roll of foil with a crinkled silver sheet pulled out, wrapped round a potato that peeks out. */
  'bind.aluminiumfolie': all(bg(), ground, rect(10, 30, 64, 16, '#9fb0bf', 3, C.ink, 1.6), ellipse(74, 38, 4, 8, '#d6dde3', C.ink, 1.2), path('M14 46 L70 46 L66 70 L18 66 Z', '#dfe5ea', C.ink, 1.4), line('M24 52 L30 60 M42 50 L46 62 M56 52 L60 64', '#b9c3cc', 1.2), path('M60 108 C50 104 52 84 66 80 C80 76 100 80 104 92 C108 104 96 110 84 108 Z', '#dfe5ea', C.ink, 1.8), line('M66 84 L74 96 M86 82 L84 100 M96 88 L98 102', '#b9c3cc', 1.2), path('M60 108 C56 100 60 92 68 96 C66 102 64 106 60 108 Z', '#c99a5c', C.ink, 1.2), sparkle(92, 70, 5)),

  // ── 3425 Molekylers former ──────────────────────────────────────────
  /** centralatom: a methane model; the dark carbon ball in the middle sits on a yellow disc ringed in orange, the four white balls around it. */
  'bind.centralatom': all(bg(), methane(60, 62, 1.9, true)),
  /** fritt elektronpar: a water molecule; above the red O ball two blue lobes, each with two dots, are outlined in orange (the pairs that are not bonds). */
  'bind.fritt-elektronpar': (() => {
    const lobe = (rot: number) => g(`translate(60 62) rotate(${rot})`, ellipse(0, -34, 11, 17, 'rgba(58,138,232,0.25)', HL, 2.6), circle(-4, -37, 3.2, ELE, C.ink, 0.6), circle(4, -37, 3.2, ELE, C.ink, 0.6));
    return all(bg(), lobe(-40), lobe(40), water(60, 62, 2.2));
  })(),
  /** bindningsvinkel: a big water molecule with an orange arc between its two bonds and the number 105° in orange. */
  'bind.bindningsvinkel': all(bg(), water(60, 40, 2.6), path('M31.4 61.9 A36 36 0 0 0 88.6 61.9', 'none', HL, 3.4), T(60, 104, '105°', 16, HL)),
  /** vinklad: a water molecule with an orange V drawn through its atoms; below, a grey straight carbon dioxide molecule with a straight line. */
  'bind.vinklad': all(bg(), water(60, 36, 2.4), line(`M${f1(60 - 31)} ${f1(36 + 24)} L60 36 L${f1(60 + 31)} ${f1(36 + 24)}`, HL, 3, '5 3'), greyed(co2(60, 94, 1.3), line('M28 94 L92 94', C.ink, 1.4, '5 3'))),
  /** tetraeder: an orange wireframe tetrahedron (triangular base, point on top) with a methane model inside, its four H balls at the corners. */
  'bind.tetraeder': all(bg(), path('M60 18 L22 90 L98 90 Z', 'rgba(255,243,176,0.4)', null), line('M60 18 L22 90 L98 90 Z M60 18 L74 74 M22 90 L74 74 M98 90 L74 74', HL, 2.2), line('M60 18 L60 64 M22 90 L60 64 M98 90 L60 64 M74 74 L60 64', C.grey, 3.4), ball(60, 18, 6, H_), ball(22, 90, 6, H_), ball(98, 90, 6, H_), ball(74, 74, 6, H_), ball(60, 64, 9, C_)),
  /** ammoniak: a cleaning bottle with green smell lines rising from it; a bubble shows a low pyramid of one blue N ball and three white H balls, ringed in orange. */
  'bind.ammoniak': all(bg(), ground, bottle(30, 112, '#bfe3f5', 54, C.green), rect(22, 76, 16, 14, C.white, 2, C.ink, 1), smell(26, 50, C.green), circle(84, 82, 30, C.white, C.ink, 1.6), ammonia(84, 74, 1.5), ring(84, 82, 33)),
  /** kulstavsmodell: a water molecule as balls and sticks with the sticks orange; a small grey space-filling water in the corner. */
  'bind.kulstavsmodell': all(bg(), stick(60, 44, 26, 78, HL, 6), stick(60, 44, 94, 78, HL, 6), ball(60, 44, 17, O_), ball(26, 80, 11, H_), ball(94, 80, 11, H_), greyed(waterFill(100, 100, 0.7))),
  /** kalottmodell: the same water molecule as overlapping spheres outlined in orange; a small grey ball-and-stick water in the corner. */
  'bind.kalottmodell': all(bg(), circle(30, 76, 19, H_, HL, 2.6), circle(90, 76, 19, H_, HL, 2.6), circle(60, 50, 30, O_, HL, 2.6), circle(50, 38, 7, 'rgba(255,255,255,0.5)', null), greyed(water(100, 98, 0.9))),

  // ── 3426 Polära och opolära molekyler ───────────────────────────────
  /** elektronegativitet: a small white H ball and a big red O ball joined by a bond; the two blue electrons of the bond sit close to O, and a thick orange arrow points into O; under O a high number, under H a low one. */
  'bind.elektronegativitet': all(bg(), stick(30, 56, 82, 56, C.grey, 4), ball(26, 56, 10, H_, 'H'), ball(84, 56, 18, O_, 'O'), electron(64, 50, 3.6), electron(64, 62, 3.6), arr(40, 34, 70, 34, HL, 4), T(26, 94, '2,2', 12, C.grey), T(84, 98, '3,4', 16, HL)),
  /** polär: a water molecule in an oval halo, the O half blue with −, the H half red with +; the halo is outlined in orange. */
  'bind.polär': all(bg(), halo(60, 56, 46, 38, true), water(60, 48, 2.4), T(60, 28, '−', 22, ELE), T(30, 92, '+', 20, C.red), T(90, 92, '+', 20, C.red)),
  /** opolär: a straight symmetric carbon dioxide molecule in an even yellow halo outlined in orange, with no + or −; a small grey polar water halo with signs in the corner. */
  'bind.opolär': all(bg(), halo(60, 50, 50, 26, false), co2(60, 50, 2.2), greyed(halo(98, 96, 14, 11, true, C.grey), water(98, 94, 0.6))),
  /** lösa sig: three glasses of tea: a sugar cube falling in, the cube half gone with swirls, and clear tea with only the swirl left; the last glass is ringed in orange. */
  'bind.lösa-sig': all(bg(), ground, glassW(22, 110, '#e8b878'), rect(17, 48, 10, 10, C.white, 1, C.ink, 1.2), arr(22, 62, 22, 76, C.grey, 1.6), glassW(60, 110, '#e8b878'), rect(56, 96, 8, 6, C.white, 1, C.ink, 1), path('M52 90 C58 84 64 92 70 86', 'none', C.white, 1.6), glassW(98, 110, '#e8b878'), line('M90 92 C96 86 102 94 108 88', C.white, 1.6, '2 2'), waPulse('b4-bind-losa-sig-1', ring(98, 92, 22))),
  /** blanda sig: water and red juice poured together become one even pink liquid with a green check; below in grey, a bottle where yellow oil lies on water, with a red cross. */
  'bind.blanda-sig': all(bg(), glassW(26, 56, WATER, 22, 34), T(46, 46, '+', 14), glassW(64, 56, '#e86a6a', 22, 34), arr(80, 40, 88, 40, C.grey, 1.6), glassW(102, 56, '#f2a6a6', 22, 34), waPulse('b4-bind-blanda-sig-1', ring(102, 40, 20)), check(102, 74, 0.8), greyed(rect(44, 80, 32, 30, C.white, 4, C.ink, 1.6), rect(46, 96, 28, 13, WATER, 2, null), rect(46, 86, 28, 10, '#f2d36b', 2, null)), cross(92, 96, 0.8)),
  /** fettlöslig: the same red grains fall into two equal glasses; in the yellow oil they spread into red streaks (ringed in orange, green check); in the blue water they lie in a lump at the bottom (red cross) */
  'bind.fettlöslig': all(bg(), ground, glassW(32, 110, '#f2d36b', 36, 60), glassW(88, 110, WATER, 36, 60), ...[[27, 38], [32, 34], [35, 40]].map(([x, y]) => rect(x!, y!, 3, 3, C.red, 0.5, null)), ...[[83, 38], [88, 34], [91, 40]].map(([x, y]) => rect(x!, y!, 3, 3, C.red, 0.5, null)), arr(32, 44, 32, 52, C.grey, 1.4), arr(88, 44, 88, 52, C.grey, 1.4), line('M20 76 C26 70 32 82 40 74', '#e04a3a', 2.2), line('M22 92 C28 86 36 98 44 90', '#e04a3a', 2.2), line('M24 104 C30 99 36 106 42 101', '#e04a3a', 1.8), ring(32, 88, 20), ...[[84, 106], [88, 105], [92, 106], [86, 103], [90, 103]].map(([x, y]) => rect(x!, y!, 3, 3, C.red, 0.5, null)), check(32, 20, 0.8), cross(88, 20, 0.8)),
  /** vattenavstötande: a slanted blue jacket fabric with round water beads rolling off it (orange arrow); below in grey, a cloth with a dark wet patch soaked in. */
  'bind.vattenavstötande': all(bg(), path('M8 38 L104 62 L104 78 L8 54 Z', '#3f6fb5', C.ink, 1.6), ...[[28, 38], [52, 44], [76, 50]].map(([x, y]) => all(circle(x!, y! - 2, 5, '#cfeefb', C.ink, 1.2), circle(x! - 1.6, y! - 3.6, 1.4, C.white, null))), drop(110, 82, 1.2, '#cfeefb'), arr(36, 26, 86, 38, HL, 2.6), drop(44, 14, 1, '#cfeefb'), drop(70, 10, 1, '#cfeefb'), greyed(rect(22, 88, 76, 20, '#d8c9a8', 3, C.ink, 1.4), ellipse(60, 98, 20, 7, '#8a7a5a', null))),
  /** vattenstråle: a kitchen tap with a thin straight stream of water falling into a sink, the stream ringed in orange. */
  'bind.vattenstråle': all(bg(), tap(50, 30), rect(55, 38, 4, 52, '#7fc4ea', 2, null), line('M55.6 40 L55.6 88', C.white, 1), path('M14 90 L106 90 L98 110 L22 110 Z', '#dfe5ea', C.ink, 1.8), ellipse(57, 92, 10, 3, '#7fc4ea', null), ellipse(57, 64, 10, 30, 'none', HL, 2.6)),

  // ── 3427 Intermolekylära krafter ────────────────────────────────────
  /** intermolekylär kraft: four grey two-ball molecules with solid sticks inside; between the molecules orange zigzag springs pull them towards each other. */
  'bind.intermolekylär-kraft': (() => {
    const m = (x: number, y: number, r: number) => g(`translate(${x} ${y}) rotate(${r})`, stick(-9, 0, 9, 0, C.dark, 3.4), ball(-10, 0, 8, '#8fa7c7'), ball(10, 0, 8, '#c7a7d8'));
    const spring = (x1: number, y1: number, x2: number, y2: number) => { const L = Math.hypot(x2 - x1, y2 - y1), a = Math.atan2(y2 - y1, x2 - x1); const pts = range(9).map((i) => `${i ? 'L' : 'M'}${f1((L * i) / 8)} ${i === 0 || i === 8 ? 0 : i % 2 ? -4 : 4}`).join(' '); return g(`translate(${x1} ${y1}) rotate(${f1((a * 180) / Math.PI)})`, line(pts, HL, 2.2)); };
    return all(bg(), m(32, 34, 10), m(88, 34, -15), m(32, 88, -20), m(88, 88, 15), spring(50, 36, 70, 36), spring(50, 86, 70, 86), spring(32, 48, 32, 74), spring(88, 48, 88, 74));
  })(),
  /** vätebindning: two water molecules; an H of the left one points to the O of the right one, joined by an orange dotted line; a third water above in grey. */
  'bind.vätebindning': all(bg(), water(24, 72, 1.6, -60), water(88, 60, 1.6, -90), line('M53 61 L75 60', HL, 3.4, '3 3'), greyed(water(56, 24, 1.1))),
  /** van der Waals-kraft: two long zigzag chains of dark balls lying side by side; many short orange dotted lines join them along their whole length; a small candle in the corner. */
  'bind.van-der-Waals-kraft': (() => {
    const chain = (y: number, ph: number) => { const xs = range(8).map((i) => 16 + i * 12); return all(line(xs.map((x, i) => `${i ? 'L' : 'M'}${x} ${y + ((i + ph) % 2 ? 5 : -5)}`).join(' '), C.grey, 3), ...xs.map((x, i) => ball(x, y + ((i + ph) % 2 ? 5 : -5), 4.6, C_))); };
    return all(bg(), chain(36, 0), chain(62, 1), ...range(8).map((i) => line(`M${16 + i * 12} ${i % 2 ? 44 : 34} L${16 + i * 12} ${i % 2 ? 54 : 64}`, HL, 1.8, '2 3')), rect(92, 82, 12, 26, '#fbf4e6', 2, C.ink, 1.4), line('M98 82 L98 76', C.ink, 1.2), path('M98 64 C102 70 102 76 98 76 C94 76 94 70 98 64 Z', C.yellow, C.orange, 1));
  })(),
  /** ytspänning: a glass bowl of water seen from the side; a paper clip lies on the surface, pressing a small dent into it without sinking; the curved surface is orange. */
  'bind.ytspänning': all(bg(), path('M10 50 L110 50 L104 108 L16 108 Z', 'rgba(220,240,252,0.5)', C.ink, 1.8), path('M12 66 L44 66 C52 66 52 72 60 72 C68 72 68 66 76 66 L108 66 L104 106 L16 106 Z', WATER, null), path('M12 66 L44 66 C52 66 52 72 60 72 C68 72 68 66 76 66 L108 66', 'none', HL, 2.6), path('M44 66 L76 66 C80 66 80 60 76 60 L48 60 C44 60 44 64 48 64 L72 64', 'none', C.silver, 2.2), path('M44 66 L76 66 C80 66 80 60 76 60 L48 60 C44 60 44 64 48 64 L72 64', 'none', C.ink, 0.6)),
  /** flyktig: an open bottle with a few drops of clear liquid on the table; puffs of vapour rush up quickly from them, with orange arrows; a grey glass of water beside it with no vapour. */
  'bind.flyktig': all(bg(), ground, bottle(36, 112, 'rgba(220,240,252,0.7)', 48, C.white), ellipse(64, 108, 10, 3, WATER, C.ink, 1), ...[[30, 50], [42, 36], [62, 86]].map(([x, y]) => all(circle(x!, y!, 5, 'rgba(201,206,212,0.8)', null), circle(x! + 6, y! - 4, 4, 'rgba(201,206,212,0.8)', null))), arr(30, 58, 30, 20, HL, 2.4), arr(64, 96, 64, 66, HL, 2.4), greyed(glassW(96, 110, WATER, 22, 34))),
  /** kapillärkraft: a glass of blue water with a strip of kitchen paper standing in it; the blue colour has crept far up the paper, with an orange arrow going up. */
  'bind.kapillärkraft': all(bg(), ground, glassW(52, 110, '#6fb6e6', 40, 44), rect(46, 22, 14, 82, C.white, 1, C.ink, 1.4), rect(46, 44, 14, 60, '#9fd0f0', 1, null), line('M46 44 C50 41 56 47 60 44', '#6fb6e6', 1.6), rect(46, 22, 14, 82, 'none', 1, C.ink, 1.4), arr(76, 96, 76, 46, HL, 3)),
  /** aceton: a small bottle of clear liquid beside a cotton pad; a hand whose nails are half red and half clean after wiping. */
  'bind.aceton': all(bg(), ground, bottle(26, 112, 'rgba(220,240,252,0.8)', 46, C.dark), ellipse(54, 106, 12, 5, C.white, C.ink, 1.4), ellipse(56, 104, 5, 2, '#f2a6a6', null),
    path('M76 112 L76 70 C76 66 82 66 82 70 L82 52 C82 48 88 48 88 52 L88 48 C88 44 94 44 94 48 L94 52 C94 48 100 48 100 52 L100 60 C100 56 106 56 106 60 L106 90 C106 100 100 112 96 112 Z', C.skin, C.ink, 1.4), rect(82.6, 51, 4.8, 6, C.red, 2, null), rect(88.6, 47, 4.8, 6, C.red, 2, null), rect(94.6, 51, 4.8, 6, '#f6e4d8', 2, C.grey, 0.6), rect(100.6, 59, 4.8, 6, '#f6e4d8', 2, C.grey, 0.6)),
};
