/**
 * Matematik & naturvetenskap → Kemi → Syror, baser & lösningar, 3441–3447 (0.51): acids and bases, the pH
 * scale, strong and weak acids, neutralisation, salts, solutions and concentration, and buffer solutions.
 * Recurring signs: acid is red–pink (a lemon as the everyday example), base is blue (a bar of soap), neutral
 * is green (a water drop); the pH bar runs 0–14 from red through green to blue. Hydrogen ions are small white
 * balls with a +, hydroxide ions a red O ball with a white H and a −. The part the word names is orange
 * (ring, frame or arrow) and a grey reference shows what the word is not. Close words share one layout where
 * only the marked part differs: syra/bas (the same beaker, red with H⁺ and a lemon or blue with OH⁻ and
 * soap); vätejon/hydroxidjon (one ion, + or −); sur/neutral/basisk (the same pH bar with the left, middle or
 * right part framed); stark/svag syra (the same beaker, all molecules split or nearly all whole);
 * kalkrik/kalkfattig (the same lake over bedrock with many or almost no white lime lumps).
 * Digits, maths signs and chemical symbols only; no words, no brands, no logos.
 */
import { C, all, circle, ellipse, g, line, path, rect, sparkle, waIn, waPulse, type Svg } from './kit';
import { HL, T, P } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const SOFT = '#f4f6f8';
const MARK = '#fff3b0';
const ACID = '#f39a9a';
const ACID2 = '#e35d5d';
const BASE = '#8fc0ec';
const BASE2 = '#3f7fd0';
const NEUT = '#9fd8a8';
const WATER = '#d6ecf8';
const GLASS = '#eef6fb';
const H_ = '#fbfbf8';
const O_ = '#e85a5a';
const LEMON = '#f5d63c';
const SOAP = '#b9d9f5';
const LIME = '#f2f0e6';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ground = line('M4 112 L116 112', C.grey2, 2);
const bg = (col: string = SOFT) => rect(4, 4, 112, 108, col, 3, null);
const ring = (x: number, y: number, r: number, col: string = HL, sw = 2.6) => circle(x, y, r, 'none', col, sw);
const frame = (x: number, y: number, w: number, h: number, col: string = HL, sw = 2.8) => rect(x, y, w, h, 'none', 4, col, sw);
const head = (x: number, y: number, a: number, col: string, s = 1) => {
  const L = 7 * s, W = 4 * s, c = Math.cos(a), si = Math.sin(a);
  return path(`M${f1(x)} ${f1(y)} L${f1(x - L * c + W * si)} ${f1(y - L * si - W * c)} L${f1(x - L * c - W * si)} ${f1(y - L * si + W * c)} Z`, col, null);
};
const arr = (x1: number, y1: number, x2: number, y2: number, col: string = HL, sw = 3, dash?: string) => all(line(`M${x1} ${y1} L${x2} ${y2}`, col, sw, dash), head(x2, y2, Math.atan2(y2 - y1, x2 - x1), col, sw / 3 + 0.3));
const check = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 9, '#dff2e4', C.green, 1.8), line('M-4.5 0 L-1 3.8 L5 -4', C.green, 2.6));
const cross = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 9, '#f8dede', C.red, 1.8), line('M-4 -4 L4 4 M4 -4 L-4 4', C.red, 2.6));
const drop = (x: number, y: number, s = 1, col: string = WATER) => path(`M${x} ${f1(y - 6 * s)} C${f1(x + 5 * s)} ${y} ${f1(x + 4 * s)} ${f1(y + 5 * s)} ${x} ${f1(y + 5 * s)} C${f1(x - 4 * s)} ${f1(y + 5 * s)} ${f1(x - 5 * s)} ${y} ${x} ${f1(y - 6 * s)} Z`, col, C.ink, 1);

// ── Atoms and ions ───────────────────────────────────────────────────
const ball = (x: number, y: number, r: number, col: string, letter = '', ink: string = C.ink) => all(circle(x, y, r, col, C.ink, 1.3),
  circle(f1(x - r * 0.35), f1(y - r * 0.38), f1(r * 0.25), 'rgba(255,255,255,0.55)', null), letter ? T(x, f1(y + r * 0.38), letter, f1(r * 1.0), ink) : '');
const sign = (x: number, y: number, s: string, col: string, r = 4.4) => all(circle(x, y, r, C.white, col, 1.4), T(x, f1(y + r * 0.6), s, f1(r * 1.8), col));
/** Hydrogen ion: small white ball with a + badge. */
const hIon = (x: number, y: number, r = 5) => all(ball(x, y, r, H_), sign(f1(x + r * 0.9), f1(y - r * 0.9), '+', C.red, f1(r * 0.62)));
/** Hydroxide ion: red O with a white H stuck on, − badge. */
const ohIon = (x: number, y: number, r = 5.4) => all(ball(f1(x + r * 1.05), f1(y + r * 0.3), f1(r * 0.7), H_), ball(x, y, r, O_), sign(f1(x - r * 0.9), f1(y - r * 1.0), '−', BASE2, f1(r * 0.6)));
/** Ball-and-stick water. */
const water = (x: number, y: number, s = 1) => at(x, y, s, line('M0 0 L-11 8.5 M0 0 L11 8.5', C.grey, 3.4), ball(0, 0, 8, O_), ball(-13, 10, 5.4, H_), ball(13, 10, 5.4, H_));
/** Acid molecule HA: white H stuck to a grey ball. */
const acidMol = (x: number, y: number, r = 5, split = false) => split
  ? all(ball(x, y, r * 1.2, C.grey), sign(f1(x - r), f1(y - r * 1.1), '−', C.dark, r * 0.6), hIon(x + r * 3, y - r * 1.2, r * 0.8))
  : all(ball(f1(x + r * 1.3), y, f1(r * 0.75), H_), ball(x, y, r * 1.2, C.grey));

// ── Containers ───────────────────────────────────────────────────────
/** Beaker with liquid; (x, y) = bottom centre. */
const beaker = (x: number, y: number, w: number, h: number, liq: string, level = 0.65, ...inside: Svg[]) => {
  const L = x - w / 2, R = x + w / 2, top = y - h, ly = f1(y - h * level);
  return all(rect(L, ly, w, f1(y - ly), liq, 3, null), ...inside, path(`M${L - 3} ${top} L${L} ${top + 3} L${L} ${y - 3} Q${L} ${y} ${L + 3} ${y} L${R - 3} ${y} Q${R} ${y} ${R} ${y - 3} L${R} ${top + 3} L${R + 3} ${top}`, 'none', C.ink, 2),
    line(`M${L + 4} ${top + 8} L${L + 4} ${y - 8}`, 'rgba(255,255,255,0.8)', 2));
};
/** Drinking glass (slightly tapered); (x, y) = bottom centre. */
const glass = (x: number, y: number, w: number, h: number, liq: string, level = 0.7, ...inside: Svg[]) => {
  const t = w / 2, b = w / 2 - 4, ly = y - h * level, lt = b + (t - b) * level;
  return all(path(`M${f1(x - lt)} ${f1(ly)} L${f1(x + lt)} ${f1(ly)} L${x + b} ${y} L${x - b} ${y} Z`, liq, null), ...inside, path(`M${x - t} ${y - h} L${x - b} ${y} L${x + b} ${y} L${x + t} ${y - h}`, 'none', C.ink, 2));
};
/** Bottle with a white label; (x, y) = bottom centre. */
const bottle = (x: number, y: number, col: string, label = '', h = 54, w = 26) => all(
  path(`M${x - w / 2} ${y} L${x - w / 2} ${y - h + 18} Q${x - w / 2} ${y - h + 8} ${x - 5} ${y - h + 4} L${x - 5} ${y - h - 4} L${x + 5} ${y - h - 4} L${x + 5} ${y - h + 4} Q${x + w / 2} ${y - h + 8} ${x + w / 2} ${y - h + 18} L${x + w / 2} ${y} Z`, col, C.ink, 1.8),
  rect(x - 6, y - h - 10, 12, 7, C.dark, 2, C.ink, 1.2),
  label ? all(rect(x - w / 2 + 3, y - h * 0.62, w - 6, 18, C.white, 2, C.ink, 1.2), T(x, f1(y - h * 0.62 + 13), label, label.length > 4 ? 7.5 : 9.5)) : '');
/** Hazard diamond with a corrosion sign (drops eating a bar and a hand). */
const corrosive = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -14 L14 0 L0 14 L-14 0 Z', C.white, C.red, 2.4),
  path('M-6 -6 L-3 -6 L-3 -2 L-6 -2 Z M3 -6 L6 -6 L6 -2 L3 -2 Z', C.ink, null), circle(-4.5, 0, 1, C.ink, null), circle(4.5, 0, 1, C.ink, null),
  path('M-8 5 L-1 5 L-2 3 Z', C.ink, null), path('M1 6 C1 3 8 3 8 6 Z', C.ink, null));
/** Small hazard diamond with an exclamation mark. */
const warn = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -12 L12 0 L0 12 L-12 0 Z', C.white, C.red, 2.2), line('M0 -6 L0 2', C.ink, 2.4), circle(0, 6, 1.4, C.ink, null));

// ── Everyday props ───────────────────────────────────────────────────
const lemon = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 0, 13, 9, LEMON, C.ink, 1.6), path('M12 -2 L16 0 L12 2 Z', '#d9b62a', C.ink, 1), circle(-4, -3, 2, 'rgba(255,255,255,0.6)', null));
const halfLemon = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 12, LEMON, C.ink, 1.6), circle(0, 0, 9, '#fbeb8f', null),
  ...range(6).map((i) => { const a = (i / 6) * Math.PI * 2; return line(`M0 0 L${f1(8 * Math.cos(a))} ${f1(8 * Math.sin(a))}`, '#e8c93a', 1.4); }));
const soap = (x: number, y: number, s = 1) => at(x, y, s, rect(-13, -7, 26, 14, SOAP, 6, C.ink, 1.6), circle(-15, -10, 3, C.white, C.grey, 1), circle(-9, -13, 2.2, C.white, C.grey, 1), circle(15, -9, 2.6, C.white, C.grey, 1));
const fish = (x: number, y: number, s = 1, col: string = C.orange, dead = false) => g(`translate(${x} ${y}) scale(${s})${dead ? ' rotate(180)' : ''}`,
  path('M-12 0 C-6 -8 8 -8 12 0 C8 8 -6 8 -12 0 Z', col, C.ink, 1.4), path('M-12 0 L-19 -6 L-19 6 Z', col, C.ink, 1.4),
  dead ? line('M5 -3 L9 1 M9 -3 L5 1', C.ink, 1.2) : circle(7, -2, 1.4, C.ink, null));
/** Cloud with rain. */
const rainCloud = (x: number, y: number, col: string = C.grey2, dropCol: string = '#7fb2dc') => all(
  path(`M${x - 22} ${y + 8} C${x - 30} ${y + 8} ${x - 30} ${y - 4} ${x - 20} ${y - 4} C${x - 18} ${y - 14} ${x - 4} ${y - 16} ${x} ${y - 8} C${x + 6} ${y - 16} ${x + 22} ${y - 12} ${x + 20} ${y - 2} C${x + 28} ${y - 2} ${x + 28} ${y + 8} ${x + 20} ${y + 8} Z`, col, C.ink, 1.6),
  ...[-14, -4, 6, 16].map((d, i) => line(`M${x + d} ${y + 13 + (i % 2) * 4} l-2 6`, dropCol, 2)));
/** Horizontal pH bar 0–14 from (x, y), width w. */
const PHC = ['#d23b3b', '#e0533a', '#ea733a', '#f0963a', '#f2b63c', '#e7cf3c', '#b6d548', '#5fb85a', '#3fae8a', '#3c9fb0', '#3f86c8', '#4a6fd0', '#5a59c6', '#6a4bb5', '#6a3d9e'];
const phBar = (x: number, y: number, w: number, h = 12, labels = true) => {
  const cw = w / 15;
  return all(...PHC.map((c, i) => rect(f1(x + i * cw), y, f1(cw + 0.3), h, c, 0, null)), rect(x, y, w, h, 'none', 2, C.ink, 1.4),
    labels ? all(T(x + cw / 2, y + h + 10, '0', 8), T(f1(x + cw * 7.5), y + h + 10, '7', 8), T(f1(x + w - cw / 2), y + h + 10, '14', 8)) : '');
};
const pan = (x: number, y: number) => all(ellipse(x, y, 20, 6, C.dark, C.ink, 1.6), line(`M${x + 19} ${y - 1} L${x + 38} ${y - 6}`, C.ink, 4));
const bag = (x: number, y: number, col: string, h = 36, w = 30, ...k: Svg[]) => all(path(`M${x - w / 2} ${y} L${x - w / 2 + 2} ${y - h} L${x + w / 2 - 2} ${y - h} L${x + w / 2} ${y} Z`, col, C.ink, 1.8), path(`M${x - w / 2 + 2} ${y - h} L${x - w / 2 + 6} ${y - h - 5} L${x + w / 2 - 6} ${y - h - 5} L${x + w / 2 - 2} ${y - h} Z`, col, C.ink, 1.4), ...k);
const powder = (x: number, y: number, w = 16, col: string = C.white) => path(`M${x - w} ${y} Q${x} ${y - w * 0.7} ${x + w} ${y} Z`, col, C.ink, 1.4);
const crystalCube = (x: number, y: number, s: number, col: string = C.white, edge: string = C.grey) => all(
  path(`M${x} ${f1(y - s)} L${f1(x + s)} ${f1(y - s * 0.5)} L${x} ${y} L${f1(x - s)} ${f1(y - s * 0.5)} Z`, col, edge, 1.2),
  path(`M${f1(x - s)} ${f1(y - s * 0.5)} L${x} ${y} L${x} ${f1(y + s)} L${f1(x - s)} ${f1(y + s * 0.5)} Z`, col, edge, 1.2),
  path(`M${f1(x + s)} ${f1(y - s * 0.5)} L${x} ${y} L${x} ${f1(y + s)} L${f1(x + s)} ${f1(y + s * 0.5)} Z`, col, edge, 1.2));
const blueCrystal = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -14 L10 -6 L8 10 L-6 12 L-11 -2 Z', '#2f7fd6', C.ink, 1.6), path('M0 -14 L2 0 L8 10 M2 0 L-11 -2 M2 0 L10 -6', 'none', '#8cc4f5', 1.2));
const dots = (pts: [number, number][], col: string = ACID2, r = 1.8) => all(...pts.map(([x, y]) => circle(x, y, r, col, null)));
const scatter = (n: number, x0: number, y0: number, w: number, h: number, seed = 1): [number, number][] => range(n).map((i) => {
  const a = Math.sin((i + 1) * 12.9898 * seed) * 43758.5453, b = Math.sin((i + 1) * 78.233 * seed) * 12345.678;
  return [f1(x0 + (a - Math.floor(a)) * w), f1(y0 + (b - Math.floor(b)) * h)];
});
const tooth = (x: number, y: number, s = 1, enamel: string = C.white, inner: string = '#f3e3b8', ink: string = C.ink) => at(x, y, s,
  path('M-18 -18 C-18 -32 -6 -30 0 -26 C6 -30 18 -32 18 -18 C18 -4 14 2 12 14 C11 22 6 24 4 14 C3 8 -3 8 -4 14 C-6 24 -11 22 -12 14 C-14 2 -18 -4 -18 -18 Z', enamel, ink, 1.8),
  path('M-11 -16 C-11 -24 -4 -22 0 -19 C4 -22 11 -24 11 -16 C11 -6 8 0 7 10 L-7 10 C-8 0 -11 -6 -11 -16 Z', inner, null));
const syringeDrop = (x: number, y: number, col: string) => all(rect(x - 4, y - 26, 8, 20, C.white, 2, C.ink, 1.4), rect(x - 3, y - 18, 6, 11, col, 1, null), path(`M${x - 4} ${y - 6} L${x + 4} ${y - 6} L${x + 1} ${y} L${x - 1} ${y} Z`, C.white, C.ink, 1.2), ellipse(x, y - 30, 6, 5, C.dark, C.ink, 1.2));

export const ACIDS_MOTIFS: Record<string, Svg> = {
  // ── 3441 Syror och baser ────────────────────────────────────────────
  /** syra (kemi): a beaker of pink-red liquid full of small white H⁺ balls, ringed in orange; a big + badge above it; a small grey blue beaker with OH⁻ ions as the base reference. No fruit, no bottle. */
  'syra.syra.2': all(bg(), beaker(50, 106, 56, 66, ACID, 0.72, hIon(36, 70), hIon(56, 62), hIon(46, 84), hIon(64, 80), hIon(34, 96), hIon(60, 98)), ring(50, 76, 38), hIon(50, 20, 9), greyed(beaker(100, 106, 24, 34, BASE, 0.7, ohIon(96, 92, 4)))),
  /** bas (kemi): the same beaker with blue liquid full of red-and-white OH⁻ ions, ringed in orange, with a bar of soap beside it; a small grey red beaker as reference. */
  'syra.bas.2': all(bg(), beaker(52, 104, 52, 62, BASE, 0.7, ohIon(38, 70), ohIon(58, 64), ohIon(46, 86), ohIon(64, 84), ohIon(36, 98), ohIon(60, 98)), ring(52, 76, 36), soap(30, 26, 1.1), greyed(beaker(98, 104, 20, 28, ACID, 0.6))),
  /** vätejon: one big white H ball with a red + badge in an orange ring; a small grey electron flies away from it along a dashed line. */
  'syra.vätejon': all(bg(), circle(52, 62, 30, MARK, null), ball(52, 62, 18, H_, 'H'), sign(70, 44, '+', C.red, 9), ring(52, 62, 30), greyed(line('M84 76 L102 92', C.grey, 1.6, '3 3'), circle(104, 94, 5, '#3a8ae8', C.ink, 1), line('M101.5 94 L106.5 94', C.white, 1.2))),
  /** hydroxidjon: one big red O ball with a white H stuck on it and a blue − badge, in an orange ring. */
  'syra.hydroxidjon': all(bg(), circle(56, 62, 32, MARK, null), ball(76, 70, 12, H_, 'H'), ball(50, 60, 19, O_, 'O', C.white), sign(32, 40, '−', BASE2, 9), ring(56, 62, 32)),
  /** citronsyra: a cut lemon half beside a bag of white powder with a lemon drawn on it; a heap of white powder in front, ringed in orange. */
  'syra.citronsyra': all(bg('#fbf7e8'), ground, bag(78, 96, '#fff6c8', 50, 36, halfLemon(78, 70, 0.9)), halfLemon(28, 90, 1.3), circle(56, 102, 14, MARK, null), powder(56, 108, 14), ring(56, 102, 16)),
  /** kaustiksoda: a jar of white granules with a corrosion hazard diamond pours granules into a sink drain; a gloved hand holds the jar. */
  'syra.kaustiksoda': all(bg(), rect(10, 86, 100, 10, '#d9dee3', 2, C.ink, 1.6), ellipse(64, 91, 22, 4, '#b7c0c9', C.ink, 1.4), circle(64, 91, 4, C.dark, null),
    g('rotate(-35 40 44)', rect(26, 24, 30, 40, C.white, 4, C.ink, 1.8), rect(24, 18, 34, 8, C.red, 2, C.ink, 1.4), ...scatter(12, 29, 44, 24, 18).map(([x, y]) => circle(x, y, 1.6, C.white, C.grey, 0.8)), corrosive(41, 42, 0.75)),
    ...[[56, 66], [60, 74], [62, 82], [58, 80]].map(([x, y]) => circle(x!, y!, 1.8, C.white, C.grey, 0.8)), path('M16 58 C10 50 16 40 26 42 L30 52 Z', '#f2c14e', C.ink, 1.6), ring(64, 90, 10, HL, 2.2)),
  /** tvättsoda: a box of white crystal powder beside a bucket of warm soapy water; a sponge wipes a greasy frying pan clean (yellow grease spots on one half, a sparkle on the other). */
  'syra.tvättsoda': all(bg(), ground, rect(10, 60, 30, 46, '#dfe9f4', 2, C.ink, 1.8), crystalCube(25, 74, 7, C.white, C.grey), rect(10, 98, 30, 8, BASE, 1, null), path('M48 74 L52 108 L84 108 L88 74 Z', '#9fb5c8', C.ink, 1.8), ellipse(68, 74, 20, 4, '#d6ecf8', C.ink, 1.4), ...[[60, 70], [70, 68], [78, 71]].map(([x, y]) => circle(x!, y!, 3, C.white, C.grey, 1)),
    pan(76, 40), circle(68, 38, 3, '#e8c34a', null), circle(74, 41, 2.4, '#e8c34a', null), sparkle(86, 38, 4), rect(80, 26, 14, 8, '#f2c14e', 2, C.ink, 1.4), ring(58, 88, 22, HL, 2.2)),

  // ── 3442 pH-skalan ──────────────────────────────────────────────────
  /** pH-värde: three things in a row – a lemon, a glass of water and a bar of soap – each with a number tag (2, 7, 10) framed in orange; a thin pH bar underneath. */
  'syra.pH-värde': all(bg(), lemon(22, 46, 1), glass(60, 58, 20, 26, WATER, 0.75), soap(98, 48, 0.9), ...[[22, '2'], [60, '7'], [98, '10']].map(([x, n]) => all(rect((x as number) - 12, 66, 24, 18, C.white, 3, HL, 2.6), T(x as number, 80, n as string, 13))), phBar(10, 92, 100, 8, false)),
  /** sur (kemi): the pH bar 0–14; its red left part is framed in orange, with a lemon above it; the rest is plain. */
  'syra.sur.2': all(bg(), phBar(10, 70, 100), frame(8, 66, 48, 20), lemon(32, 40, 1.3), greyed(drop(66, 44, 1.6), soap(96, 46, 0.8))),
  /** neutral (pH): the same pH bar with only the green middle (7) framed in orange and a water drop above it. */
  'syra.neutral.3': all(bg(), phBar(10, 70, 100), frame(52, 66, 16, 20), drop(60, 42, 2.4), greyed(lemon(24, 46, 0.8), soap(96, 46, 0.8))),
  /** basisk: the same pH bar with the blue right part framed in orange and a bar of soap above it. */
  'syra.basisk': all(bg(), phBar(10, 70, 100), frame(64, 66, 48, 20), soap(88, 42, 1.3), greyed(lemon(24, 46, 0.8), drop(52, 44, 1.6))),
  /** indikator (kemi): a dropper with purple liquid, ringed in orange, drips into three test tubes that turn red, green and blue. */
  'syra.indikator.2': all(bg(), syringeDrop(60, 40, '#8a5bbf'), ring(60, 22, 18), drop(60, 48, 0.6, '#8a5bbf'),
    ...[[30, ACID2], [60, '#5fb85a'], [90, BASE2]].map(([x, c]) => all(rect((x as number) - 7, 62, 14, 44, GLASS, 7, C.ink, 1.6), rect((x as number) - 6, 82, 12, 22, c as string, 6, null)))),
  /** lackmuspapper: two paper strips dipped into a beaker of lemon juice and one of soapy water; one strip has turned red, the other blue; both strips are ringed in orange. */
  'syra.lackmuspapper': all(bg(), beaker(32, 106, 36, 40, '#fbeb8f', 0.6), beaker(88, 106, 36, 40, SOAP, 0.6), lemon(20, 44, 0.6), soap(100, 44, 0.6),
    rect(28, 30, 8, 60, '#f7f1e3', 1, C.ink, 1.2), rect(28, 64, 8, 26, ACID2, 0, null), rect(84, 30, 8, 60, '#f7f1e3', 1, C.ink, 1.2), rect(84, 64, 8, 26, BASE2, 0, null), frame(24, 26, 16, 68), frame(80, 26, 16, 68)),
  /** rödkål: a whole purple red cabbage and a cut half showing its pale veins; beside it a glass of purple cabbage juice. */
  'syra.rödkål': all(bg(), ground, circle(36, 84, 26, '#7b3f8f', C.ink, 2), path('M16 76 C26 66 46 66 56 78 M20 94 C30 84 44 86 54 96 M36 60 C30 72 30 96 36 108', 'none', '#b483c6', 1.8), circle(78, 98, 14, '#7b3f8f', C.ink, 1.6), path('M66 98 C70 90 86 90 90 98 M70 104 C74 98 82 98 86 104', 'none', '#e8d6ef', 1.6), glass(100, 112, 18, 30, '#8a4bb0', 0.7)),
  /** pH-mätare: a slim digital meter stands in a beaker; its display shows 7.0, framed in orange. */
  'syra.pH-mätare': all(bg(), beaker(60, 108, 56, 40, WATER, 0.6), rect(48, 14, 24, 80, '#5b7d9e', 6, C.ink, 1.8), rect(52, 20, 16, 22, '#dff3e4', 2, C.ink, 1.2), T(60, 35, '7.0', 8.5), frame(49, 17, 22, 28), circle(60, 54, 3, C.white, C.ink, 1), line('M60 94 L60 100', C.ink, 2)),
  /** destillerat vatten: a clear canister of water with a drop symbol pours into a steam iron. */
  'syra.destillerat-vatten': all(bg(), ground, g('rotate(-30 40 56)', rect(22, 34, 36, 46, '#eef8ff', 6, C.ink, 1.8), rect(32, 26, 16, 9, C.white, 2, C.ink, 1.4), drop(40, 58, 1.8, WATER)), path('M56 54 C58 62 60 70 62 78', 'none', '#8cc7e8', 2.4),
    path('M50 104 L100 104 C104 90 96 80 80 80 L58 80 C50 84 48 96 50 104 Z', '#eef1f4', C.ink, 1.8), path('M64 80 C66 70 90 70 92 80', 'none', C.ink, 3), circle(84, 92, 3, '#8cc7e8', null), ring(40, 58, 22, HL, 2.2)),
  /** läskedryck: a tall glass of brown fizzy drink with bubbles and a straw beside an unmarked red can. */
  'syra.läskedryck': all(bg(), ground, glass(46, 110, 34, 64, '#8a4b2a', 0.8, ...scatter(10, 34, 52, 24, 52, 3).map(([x, y]) => circle(x, y, 1.6, 'rgba(255,255,255,0.7)', null))), line('M52 40 L62 22', C.red, 3), rect(78, 62, 26, 48, C.red, 4, C.ink, 1.8), ellipse(91, 62, 13, 3, C.silver, C.ink, 1.2), path('M80 80 C88 74 96 90 102 82', 'none', C.white, 2)),
  /** försurning: a rain cloud drops rain on a lake; in the lake a grey fish floats upside down; an orange arrow beside the lake goes down from 7 to 5. */
  'syra.försurning': all(bg('#eef3f7'), rainCloud(42, 22), path('M8 78 C30 70 80 70 112 78 L112 112 L8 112 Z', '#b9cfa6', null), path('M14 82 C34 76 74 76 100 82 L94 104 L20 104 Z', '#a9c7d9', C.ink, 1.6), fish(52, 92, 1, C.grey, true),
    T(96, 30, '7', 13), arr(96, 36, 96, 54, HL, 3), T(96, 68, '5', 13, HL)),
  /** tandemalj: a big tooth whose hard white outer layer is thick and outlined in orange; the inside is pale yellow. */
  'syra.tandemalj': all(bg(), tooth(60, 62, 2), path('M-18 -18 C-18 -32 -6 -30 0 -26 C6 -30 18 -32 18 -18', 'none', HL, 2.2).replace('<path', `<path transform="translate(60 62) scale(2)"`), sparkle(96, 26, 5)),

  // ── 3443 Starka och svaga syror ─────────────────────────────────────
  /** stark syra: a beaker where every acid molecule has split: grey − balls and free white H⁺ balls everywhere; the beaker is ringed in orange; a small tag reads 1. */
  'syra.stark-syra': all(bg(), beaker(56, 108, 66, 72, ACID, 0.78, ...[[34, 60], [64, 56], [42, 82], [72, 78], [34, 100], [62, 98]].map(([x, y]) => acidMol(x!, y!, 5, true))), ring(56, 74, 42), rect(94, 14, 18, 18, C.white, 3, C.ink, 1.4), T(103, 28, '1', 12)),
  /** svag syra: the same beaker where nearly every acid molecule is still whole (H stuck to the grey ball); only one has split; ringed in orange; a small tag reads 4. */
  'syra.svag-syra': all(bg(), beaker(56, 108, 66, 72, '#f8cccc', 0.78, acidMol(34, 60), acidMol(64, 56), acidMol(40, 82, 5, true), acidMol(72, 80), acidMol(34, 100), acidMol(62, 98)), ring(56, 74, 42), rect(94, 14, 18, 18, C.white, 3, C.ink, 1.4), T(103, 28, '4', 12)),
  /** protolys: an acid molecule (white H on a grey ball) hands its H over to a water molecule along a curved orange arrow. */
  'syra.protolys': all(bg(), ball(28, 66, 12, C.grey), sign(16, 50, '−', C.dark, 6), hIon(58, 38, 6), line('M34 54 C38 42 46 38 50 38', C.grey, 2, '3 3'), waIn('b4-syra-protolys-1', -7, -8, arr(66, 42, 78, 56, HL, 3)), water(88, 70, 1.4), ring(58, 38, 12)),
  /** oxoniumjon: a water molecule with three white H balls round a red O and a red + badge, in an orange ring; a small grey ordinary water molecule beside it. */
  'syra.oxoniumjon': all(bg(), circle(56, 60, 34, MARK, null), line('M56 58 L36 74 M56 58 L76 74 M56 58 L56 34', C.grey, 4), ball(56, 58, 13, O_, 'O', C.white), ball(34, 76, 8, H_, 'H'), ball(78, 76, 8, H_, 'H'), ball(56, 32, 8, H_, 'H'), sign(80, 36, '+', C.red, 8), ring(56, 60, 34), greyed(water(100, 98, 0.7))),
  /** saltsyra: a bottle with the label HCl, ringed in orange, next to a stomach outline with acid inside. */
  'syra.saltsyra': all(bg(), ground, bottle(38, 110, '#f6e2e2', 'HCl', 60, 32), ring(38, 76, 30), path('M76 46 C70 46 70 58 78 62 C70 76 76 100 98 96 C112 92 110 74 104 66 C98 58 92 48 84 50 Z', '#f6c9d4', C.ink, 1.8), path('M80 80 C88 90 100 88 104 78 C104 90 98 94 90 94 C84 94 80 88 80 80 Z', ACID, null), line('M78 46 L78 30', C.ink, 3)),
  /** svavelsyra: a cut-open car battery with plus and minus poles shows liquid inside; beside it a bottle with the label H₂SO₄, ringed in orange. */
  'syra.svavelsyra': all(bg(), ground, rect(46, 56, 64, 54, C.dark, 4, C.ink, 2), rect(52, 66, 52, 38, '#f8d4d4', 2, C.ink, 1.2), ...[60, 74, 88].map((x) => rect(x, 64, 6, 36, C.grey, 1, C.ink, 1)), rect(54, 48, 10, 8, C.red, 1, C.ink, 1.2), rect(92, 48, 10, 8, C.ink, 1, C.ink, 1.2), T(59, 44, '+', 10, C.red), T(97, 44, '−', 10),
    bottle(24, 110, '#f6e2e2', 'H₂SO₄', 56, 34), ring(24, 76, 27)),
  /** salpetersyra: a bottle with the label HNO₃, ringed in orange, gives off yellow-brown fumes; beside it a sack of fertiliser pellets. */
  'syra.salpetersyra': all(bg(), ground, bottle(40, 110, '#fbf3d6', 'HNO₃', 58, 30), ring(40, 78, 28), path('M36 40 C30 32 42 28 36 20 M44 40 C50 32 38 26 46 18', 'none', '#c99a3a', 2.6), path('M74 110 L76 70 L104 70 L108 110 Z', '#d8c9a8', C.ink, 1.8), ...scatter(8, 80, 90, 22, 14, 2).map(([x, y]) => circle(x, y, 2, '#f2f2f2', C.grey, 0.8)), rect(80, 76, 20, 10, '#7fb36a', 2, null)),
  /** fosforsyra: a glass of dark cola-like drink next to a bottle with the label H₃PO₄, ringed in orange; a rusty bolt beside gets clean. */
  'syra.fosforsyra': all(bg(), ground, bottle(34, 110, '#eef3e6', 'H₃PO₄', 58, 30), ring(34, 78, 28), glass(82, 110, 30, 50, '#4a2a1a', 0.8, ...scatter(6, 72, 70, 20, 36, 5).map(([x, y]) => circle(x, y, 1.4, 'rgba(255,255,255,0.6)', null)))),
  /** kolsyra: a glass of clear sparkling water full of rising bubbles, the bubbles ringed in orange; a tag shows H₂CO₃. */
  'syra.kolsyra': all(bg(), ground, glass(52, 110, 46, 76, WATER, 0.85, ...scatter(18, 36, 40, 32, 64, 7).map(([x, y]) => circle(x, y, 2.2, C.white, '#7fb2dc', 1))), ring(52, 70, 30), rect(80, 16, 34, 16, C.white, 3, C.ink, 1.4), T(97, 28, 'H₂CO₃', 8.5), ...[[48, 26], [56, 18], [44, 14]].map(([x, y]) => circle(x!, y!, 2, C.white, '#7fb2dc', 1))),
  /** mjölksyra: a glass of milk, an arrow with small bacteria dots, and a bowl of thick sour yoghurt; the sour drops in the bowl are red and ringed in orange. */
  'syra.mjölksyra': all(bg(), ground, glass(22, 110, 24, 44, C.white, 0.85), arr(38, 84, 56, 84, C.grey, 2.4), ...[[44, 76], [50, 72], [47, 92]].map(([x, y]) => ellipse(x!, y!, 3, 1.6, C.green, null)),
    path('M60 86 L112 86 C110 106 96 110 86 110 C76 110 62 106 60 86 Z', C.white, C.ink, 1.8), ellipse(86, 86, 26, 6, '#fbf7ee', C.ink, 1.4), drop(78, 85, 0.6, ACID2), drop(92, 84, 0.6, ACID2), drop(86, 88, 0.5, ACID2), ring(86, 86, 18)),

  // ── 3444 Neutralisation ─────────────────────────────────────────────
  /** neutralisera: a red beaker and a blue beaker are poured together into one green beaker, which is ringed in orange and has a green check. */
  'syra.neutralisera': all(bg(), g('rotate(30 26 40)', beaker(26, 52, 26, 30, ACID, 0.7)), g('rotate(-30 94 40)', beaker(94, 52, 26, 30, BASE, 0.7)), path('M40 46 C46 52 52 58 56 66', 'none', ACID2, 2.4), path('M80 46 C74 52 68 58 64 66', 'none', BASE2, 2.4), beaker(60, 108, 40, 38, NEUT, 0.7), waPulse('b4-syra-neutralisera-1', ring(60, 92, 24)), check(96, 96)),
  /** droppvis: a dropper above a beaker lets single drops fall, one after another, numbered 1, 2, 3 in a vertical row; the falling drops are ringed in orange. */
  'syra.droppvis': all(bg(), syringeDrop(46, 34, BASE2), drop(46, 46, 0.6, BASE2), drop(46, 62, 0.6, BASE2), drop(46, 78, 0.6, BASE2), T(62, 50, '1', 10), T(62, 66, '2', 10), T(62, 82, '3', 10), ellipse(46, 62, 10, 24, 'none', HL, 2.4), beaker(46, 110, 40, 22, ACID, 0.5)),
  /** ta ut varandra (verkan): a block between two equally long arrows pushing in opposite directions – a red one from the left and a blue one from the right; the block does not move: below it = 0, framed in orange. */
  'syra.ta-ut-varandra.2': all(bg(), ground, rect(46, 70, 28, 28, C.tan, 3, C.ink, 1.8), arr(8, 84, 44, 84, ACID2, 5), arr(112, 84, 76, 84, BASE2, 5), T(26, 72, '+', 14, ACID2), T(94, 72, '−', 14, BASE2), rect(40, 30, 40, 26, C.white, 4, HL, 2.8), T(60, 49, '= 0', 15)),
  /** ofarlig: a bottle with a green check that a happy child holds safely; a grey bottle with a hazard diamond and a red cross stands aside as the contrast. */
  'syra.ofarlig': all(bg(), ground, bottle(46, 110, '#dff2e4', '', 52, 30), check(46, 80, 1.2), ring(46, 84, 26), greyed(bottle(96, 110, '#f6e2e2', '', 40, 22), warn(96, 86, 0.7)), cross(104, 60, 0.8)),

  // ── 3445 Salter ─────────────────────────────────────────────────────
  /** salt (kemi): four little dishes with salt crystals of different colours – white, blue, yellow and pink – each with a tiny + and − ion pair; the group is framed in orange. */
  'syra.salt.2': all(bg(), ...[[30, 44, C.white], [84, 44, '#2f7fd6'], [30, 90, '#f2d64e'], [84, 90, '#f2a3b8']].map(([x, y, c]) => all(ellipse(x as number, (y as number) + 8, 20, 5, C.white, C.ink, 1.4), crystalCube((x as number) - 6, (y as number) - 2, 6, c as string), crystalCube((x as number) + 6, (y as number), 5, c as string), sign((x as number) + 14, (y as number) - 14, '+', C.red, 3.6), sign((x as number) - 14, (y as number) - 14, '−', BASE2, 3.6))), frame(8, 18, 104, 94)),
  /** koksalt: a salt shaker sprinkles white grains over boiled potatoes on a plate; the shaker is ringed in orange. */
  'syra.koksalt': all(bg('#fbf7ee'), g('rotate(150 58 34)', path('M48 20 L68 20 L66 50 L50 50 Z', '#eef6fb', C.ink, 1.8), rect(48, 12, 20, 9, C.silver, 3, C.ink, 1.4), ...scatter(10, 51, 26, 14, 20, 4).map(([x, y]) => circle(x, y, 1.3, C.white, C.grey, 0.6))), ring(58, 34, 22),
    ...scatter(8, 44, 62, 30, 20, 6).map(([x, y]) => circle(x, y, 1.1, C.white, C.grey, 0.6)), ellipse(60, 96, 46, 10, C.white, C.ink, 1.8), ellipse(46, 88, 12, 9, '#e8c87a', C.ink, 1.4), ellipse(68, 86, 13, 9, '#e8c87a', C.ink, 1.4), ellipse(58, 92, 11, 8, '#e8c87a', C.ink, 1.4)),
  /** kalciumkarbonat: a lump of white limestone, an eggshell and a seashell, all joined by lines to a card that reads CaCO₃, framed in orange. */
  'syra.kalciumkarbonat': all(bg(), rect(28, 12, 64, 24, C.white, 4, HL, 2.8), T(60, 30, 'CaCO₃', 14), line('M40 36 L26 64 M60 36 L60 64 M80 36 L94 64', C.grey, 1.6, '3 3'),
    path('M10 92 L18 70 L36 66 L44 84 L38 100 L16 102 Z', LIME, C.ink, 1.8), path('M48 90 C48 70 72 70 72 90 L66 86 L62 92 L58 86 L54 92 Z', '#fbf3e4', C.ink, 1.6), path('M80 100 C80 76 110 76 110 100 Z', '#f6dccb', C.ink, 1.6), path('M95 100 L95 80 M88 100 L90 82 M102 100 L100 82', 'none', '#d9a98a', 1.2)),
  /** kopparsulfat: big bright blue crystals grow on a string in a jar of blue liquid; one crystal is ringed in orange. */
  'syra.kopparsulfat': all(bg(), beaker(60, 110, 70, 76, '#a9cff3', 0.75), line('M30 26 L90 26', C.brown, 3), line('M60 26 L60 58', C.ink, 1.2), blueCrystal(60, 70, 1.4), blueCrystal(42, 100, 0.8), blueCrystal(78, 100, 0.9), ring(60, 70, 24)),
  /** kristallisera: a shallow dish of salt water under the sun; wavy steam rises, and white cube crystals form at the edge, ringed in orange; an orange arrow points from the liquid to the crystals. */
  'syra.kristallisera': all(bg('#fbf6e6'), circle(98, 22, 10, C.yellow, C.ink, 1.4), line('M40 50 c-4 -5 4 -8 0 -13 c-4 -5 4 -8 0 -13 M56 50 c-4 -5 4 -8 0 -13 c-4 -5 4 -8 0 -13', C.grey, 1.8),
    ellipse(56, 84, 46, 14, C.white, C.ink, 1.8), ellipse(56, 82, 36, 9, '#d6ecf8', null), crystalCube(86, 78, 6), crystalCube(96, 86, 5), crystalCube(78, 90, 5), ring(88, 84, 16), waIn('b4-syra-kristallisera-1', -10, -1, arr(56, 82, 72, 84, HL, 2.4))),

  // ── 3446 Lösningar och koncentration ────────────────────────────────
  /** lösning (kemi): sugar cubes go into a glass of water; an arrow leads to the same glass where the water is clear and the sugar can no longer be seen; the second glass is ringed in orange. */
  'syra.lösning.3': all(bg(), glass(28, 104, 34, 50, WATER, 0.7, crystalCube(24, 86, 5), crystalCube(34, 92, 5)), crystalCube(28, 32, 6), arr(28, 42, 28, 54, C.grey, 2), arr(50, 80, 66, 80, C.grey, 2.4), glass(90, 104, 34, 50, '#e6f3fb', 0.7), ring(90, 80, 28)),
  /** mättad (lösning): a glass of liquid with a big heap of sugar lying on the bottom; a spoon above adds still more; the heap at the bottom is ringed in orange. */
  'syra.mättad.2': all(bg(), glass(56, 108, 52, 68, '#e6f3fb', 0.8, path('M36 108 Q56 84 76 108 Z', C.white, C.grey, 1.4), dots(scatter(10, 44, 98, 24, 8, 2), C.grey, 1.2)), ellipse(56, 98, 22, 12, 'none', HL, 2.6), g('rotate(-25 84 24)', ellipse(72, 24, 9, 5, C.silver, C.ink, 1.4), line('M80 24 L104 24', C.ink, 3)), ...[[66, 34], [62, 42], [66, 50]].map(([x, y]) => circle(x!, y!, 1.6, C.white, C.grey, 0.8))),
  /** koncentration (kemi): three equal beakers with more and more red dots in them; an orange arrow rises along them. */
  'syra.koncentration.2': all(bg(), beaker(24, 104, 26, 44, '#fbe9e9', 0.8, dots(scatter(4, 14, 72, 20, 28, 2))), beaker(60, 104, 26, 44, '#f8d4d4', 0.8, dots(scatter(12, 50, 72, 20, 28, 3))), beaker(96, 104, 26, 44, '#f3b8b8', 0.8, dots(scatter(28, 86, 72, 20, 28, 4))), arr(16, 46, 104, 22, HL, 3)),
  /** utspädd: a glass of dark red juice (grey, as reference) – a jug pours water – and a glass of pale pink juice, ringed in orange. */
  'syra.utspädd': all(bg(), glass(20, 106, 22, 40, '#8e1f30', 0.8), g('rotate(25 64 40)', path('M50 26 L76 26 L74 58 L52 58 Z', '#eef6fb', C.ink, 1.8), path('M76 30 C84 32 84 46 75 48', 'none', C.ink, 2), rect(52, 38, 22, 20, WATER, 0, null)), path('M50 58 C52 66 54 74 56 80', 'none', '#8cc7e8', 2.4), glass(68, 106, 38, 40, '#f6c6cf', 0.8), ring(68, 88, 26)),
  /** blandningsförhållande: one small glass of dark syrup and four glasses of water, with 1 : 4 written below and framed in orange. */
  'syra.blandningsförhållande': all(bg(), glass(18, 72, 16, 26, '#b0283a', 0.8), T(18, 86, '1', 11), ...[44, 64, 84, 104].map((x) => glass(x, 72, 16, 26, WATER, 0.8)), T(74, 86, '4', 11), rect(30, 92, 60, 18, C.white, 3, HL, 2.8), T(60, 106, '1 : 4', 13)),
  /** promille: a breath-test device whose display shows 0,2 ‰ (framed in orange); beside it a car key and a wine glass. */
  'syra.promille': all(bg(), rect(40, 16, 36, 86, '#3f5a78', 8, C.ink, 2), rect(44, 26, 28, 20, '#dff3e4', 2, C.ink, 1.2), T(58, 40, '0,2‰', 9), frame(41, 23, 34, 26), rect(54, 6, 8, 12, C.white, 2, C.ink, 1.2), circle(58, 70, 7, C.grey2, C.ink, 1.2),
    path('M88 40 L104 40 C104 54 96 58 96 58 C96 58 88 54 88 40 Z', '#f3d6d6', C.ink, 1.6), line('M96 58 L96 76 M89 76 L103 76', C.ink, 1.8), circle(20, 86, 6, C.silver, C.ink, 1.4), rect(24, 84, 14, 4, C.silver, 1, C.ink, 1.2)),
  /** mol: a heap of countless tiny balls in a bowl and a card reading 6 · 10²³, framed in orange. */
  'syra.mol': all(bg(), path('M18 84 C18 108 102 108 102 84 Z', C.white, C.ink, 1.8), ...scatter(60, 26, 62, 68, 24, 9).map(([x, y]) => circle(x, y, 2.6, '#9aa3ad', C.ink, 0.6)), rect(24, 16, 72, 28, C.white, 4, HL, 2.8), T(60, 37, '6 · 10²³', 15)),

  // ── 3447 Buffertlösningar ───────────────────────────────────────────
  /** buffertlösning: two beakers each get a drop of acid; the grey water beaker's tag falls from 7 to 3, while the buffer beaker, ringed in orange, keeps 7 with a green check. */
  'syra.buffertlösning': all(bg(), greyed(beaker(30, 106, 34, 40, WATER, 0.6), drop(30, 46, 0.7, ACID2), T(30, 30, '7→3', 11)), beaker(86, 106, 36, 40, '#cfe9d6', 0.6), drop(86, 46, 0.7, ACID2), rect(72, 18, 28, 16, C.white, 3, C.ink, 1.4), T(86, 30, '7', 12), ring(86, 88, 26), check(108, 96, 0.8)),
  /** syra-basbalans: a person outline with a balance scale on the chest; the pans hold a lemon and a bar of soap and hang level; a tag below shows 7,4, framed in orange. */
  'syra.syra-basbalans': all(bg(), path('M60 14 C70 14 74 22 74 30 C74 38 68 44 60 44 C52 44 46 38 46 30 C46 22 50 14 60 14 Z M34 112 L36 62 C36 52 46 48 60 48 C74 48 84 52 84 62 L86 112 Z', '#e9eef3', C.grey, 1.6),
    line('M60 56 L60 76 M36 60 L84 60', C.ink, 2.2), line('M36 60 L30 72 M36 60 L42 72 M84 60 L78 72 M84 60 L90 72', C.grey, 1.2), path('M26 72 L46 72 C44 78 28 78 26 72 Z', C.silver, C.ink, 1.2), path('M74 72 L94 72 C92 78 76 78 74 72 Z', C.silver, C.ink, 1.2), lemon(36, 68, 0.5), soap(84, 68, 0.5), rect(42, 86, 36, 18, C.white, 3, HL, 2.8), T(60, 100, '7,4', 12)),
  /** vätekarbonat: a big red blood drop; inside, an ion card HCO₃⁻ catches a white H⁺ ball along an orange arrow; the card is ringed in orange. */
  'syra.vätekarbonat': all(bg(), path('M60 10 C76 34 98 54 98 76 C98 98 80 110 60 110 C40 110 22 98 22 76 C22 54 44 34 60 10 Z', '#f6c9c9', C.red, 2), rect(32, 62, 48, 20, C.white, 4, C.ink, 1.4), T(56, 77, 'HCO₃⁻', 11), ring(56, 72, 28), hIon(84, 42, 6), arr(80, 48, 70, 60, HL, 2.4)),
  /** hyperventilera: a person with a hand on the chest breathes fast – many short breath puffs come out of the mouth – sweat drops and a dizzy spiral above the head. */
  'syra.hyperventilera': all(bg(), ground, P(46, { top: C.sky }), line('M38 60 L46 66', C.skin, 5), waIn('b4-syra-hyperventilera-1', -12, 4, ...[[66, 26, 8], [76, 22, 6], [86, 30, 7], [80, 38, 5]].map(([x, y, r]) => ellipse(x!, y!, r!, r! * 0.7, C.white, C.grey, 1.2))), path('M40 6 c4 -4 10 0 6 4 c-3 3 -8 0 -4 -3', 'none', HL, 2), drop(32, 22, 0.5, '#8cc7e8'), drop(60, 18, 0.5, '#8cc7e8')),
  /** kalkrik: a lake over bedrock with many white lime lumps (bedrock framed in orange); happy fish swim in the lake. */
  'syra.kalkrik': all(bg('#eef3f7'), path('M8 48 C30 42 90 42 112 48 L112 70 L8 70 Z', '#a9c7d9', C.ink, 1.4), fish(40, 58, 0.8), fish(76, 56, 0.8, C.yellow), rect(8, 70, 104, 40, '#8f8a82', 0, C.ink, 1.4),
    ...scatter(14, 14, 76, 90, 28, 3).map(([x, y]) => ellipse(x, y, 7, 4, LIME, C.ink, 1)), frame(6, 68, 108, 44)),
  /** kalkfattig: the same lake over grey bedrock with almost no white lime lumps (bedrock framed in orange); a grey fish floats upside down in the lake. */
  'syra.kalkfattig': all(bg('#eef3f7'), path('M8 48 C30 42 90 42 112 48 L112 70 L8 70 Z', '#b7c9cf', C.ink, 1.4), fish(58, 56, 0.8, C.grey, true), rect(8, 70, 104, 40, '#8f8a82', 0, C.ink, 1.4),
    ...scatter(10, 14, 76, 90, 28, 5).map(([x, y]) => path(`M${x - 6} ${y} L${x} ${y - 4} L${x + 6} ${y + 1} L${x + 1} ${y + 4} Z`, '#a7a29a', C.ink, 0.8)), ellipse(90, 98, 4, 2.6, LIME, C.ink, 1), frame(6, 68, 108, 44)),
};
