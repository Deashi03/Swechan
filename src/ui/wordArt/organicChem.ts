/**
 * Matematik & naturvetenskap → Kemi → Organisk kemi, 3451–3457 (0.51): hydrocarbons, alcohols, carboxylic
 * acids, esters, the chemistry of carbohydrates, fats and fatty acids, polymers and plastics.
 * Recurring signs (as in T02/T03): atoms are balls – carbon dark grey, hydrogen white, oxygen red; the part the word names is orange (ring or frame) and a grey reference shows what the word is not.
 * Close words share one layout where only the marked part differs: etanol/metanol (thing on the left, the
 * molecule with two or one carbon on the right), mättat/omättat fett (butter and oil side by side, straight
 * packed chains or bent loose chains framed), monomer/polymer (the same beads, loose or linked in a chain),
 * termoplast/härdplast (the same piece on a hot plate, melting and remoulded or staying stiff and charring),
 * fruktsocker/sackaros (a five-ring alone or a six-ring joined to a five-ring), ester/förestring (the fruity
 * molecule itself, or the whole reaction row with the arrow marked).
 * Digits, maths signs and chemical symbols only; no words, no brands.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, waGrow, waPulse, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';
import { car } from './homeKit';

// ── Palette and basics ───────────────────────────────────────────────
const HOT = '#d64545';
const WATER = '#cfe8f6';
const GLASS = '#eef6fb';
const HYD = '#fbfbf8';
const OXY = '#e2483d';
const CARB = '#4a4c56';
const OIL = '#f2cf5b';
const BUTTER = '#f7e08a';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const ring = (x: number, y: number, r: number, col: string = HL, sw = 2.6) => circle(x, y, r, 'none', col, sw);
const frame = (x: number, y: number, w: number, h: number, col: string = HL, sw = 2.6) => rect(x, y, w, h, 'none', 5, col, sw);
const num = (x: number, y: number, s: string, size = 10, col: string = C.ink) => T(x, y, s, size, col);
const cross = (x: number, y: number, r: number, col: string = HOT) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 2.6);
const plus = (x: number, y: number, col: string = C.ink) => line(`M${x - 4} ${y} L${x + 4} ${y} M${x} ${y - 4} L${x} ${y + 4}`, col, 2);

// ── Atoms and molecules ──────────────────────────────────────────────
const at = (x: number, y: number, r: number, col: string) => circle(x, y, r, col, C.ink, 1.2);
const bond = (x1: number, y1: number, x2: number, y2: number, sw = 2.2) => line(`M${f1(x1)} ${f1(y1)} L${f1(x2)} ${f1(y2)}`, C.ink, sw);
/** Double bond drawn as two parallel strokes. */
const dbond = (x1: number, y1: number, x2: number, y2: number, col: string = C.ink) => {
  const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy), nx = (-dy / l) * 2, ny = (dx / l) * 2;
  return all(line(`M${f1(x1 + nx)} ${f1(y1 + ny)} L${f1(x2 + nx)} ${f1(y2 + ny)}`, col, 1.8), line(`M${f1(x1 - nx)} ${f1(y1 - ny)} L${f1(x2 - nx)} ${f1(y2 - ny)}`, col, 1.8));
};
/** Zigzag points: n atoms from (x, y), step dx, up/down dy. */
const zig = (x: number, y: number, n: number, dx = 12, dy = 5): [number, number][] => range(n).map((i) => [x + i * dx, y + (i % 2 ? -dy : dy)]);
/** Carbon chain through the given points (bonds then balls); `bendAt` draws a double bond there. */
const chain = (pts: [number, number][], r = 4.6, col: string = CARB, dblAt = -1) => all(
  ...pts.slice(1).map(([x, y], i) => (i === dblAt ? dbond(pts[i]![0], pts[i]![1], x, y) : bond(pts[i]![0], pts[i]![1], x, y))),
  ...pts.map(([x, y]) => at(x, y, r, col)));
/** Hydrogens above/below each chain atom (alternating with the zigzag). */
const hyd = (pts: [number, number][], r = 2.8, len = 8) => all(...pts.map(([x, y], i) => {
  const up = i % 2 === 1, yy = up ? y - len : y + len;
  return all(bond(x, y, x, yy, 1.4), at(x, yy, r, HYD));
}));
/** Hydroxyl group (O–H) attached to (x, y), pointing in direction (dx, dy). */
const oh = (x: number, y: number, dx: number, dy: number, r = 4.2) => all(bond(x, y, x + dx, y + dy), bond(x + dx, y + dy, x + dx * 1.7, y + dy * 1.7, 1.6), at(x + dx * 1.7, y + dy * 1.7, r * 0.65, HYD), at(x + dx, y + dy, r, OXY));
/** Carboxyl group on (x, y): C with =O up and –OH right. */
const cooh = (x: number, y: number, r = 4.4) => all(dbond(x, y, x, y - 12), at(x, y - 13, r, OXY), oh(x, y, 11, 4, r), at(x, y, r, CARB));
/** Ball-and-stick ethanol: two carbons + OH (with hydrogens). */
const ethanol = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`,
  bond(-14, 0, 0, -6), at(-14 - 7, 0 + 4, 3, HYD), bond(-14, 0, -21, 4, 1.4), bond(-14, 0, -14, 9, 1.4), at(-14, 9, 3, HYD), bond(-14, 0, -18, -8, 1.4), at(-18, -8, 3, HYD),
  bond(0, -6, 0, -15, 1.4), at(0, -15, 3, HYD), bond(0, -6, 4, 3, 1.4), at(4, 3, 3, HYD),
  oh(0, -6, 12, 2, 5), at(-14, 0, 5.4, CARB), at(0, -6, 5.4, CARB));
const methanol = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`,
  bond(-6, -3, -14, -10, 1.4), at(-14, -10, 3, HYD), bond(-6, -3, -15, 3, 1.4), at(-15, 3, 3, HYD), bond(-6, -3, -6, 7, 1.4), at(-6, 7, 3, HYD),
  oh(-6, -3, 12, -2, 5), at(-6, -3, 5.4, CARB));
const H2O = (x: number, y: number, r = 5) => all(at(x - r * 1.05, y + r * 0.7, r * 0.7, HYD), at(x + r * 1.05, y + r * 0.7, r * 0.7, HYD), at(x, y, r, OXY));
/** Regular ring (hexagon n=6, pentagon n=5) of radius r, drawn as a sugar ring. */
const sugarRing = (x: number, y: number, r: number, n: number, fill: string, stroke: string = C.ink) => path(range(n).map((i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / n; return `${i ? 'L' : 'M'}${f1(x + Math.cos(a) * r)} ${f1(y + Math.sin(a) * r)}`; }).join(' ') + ' Z', fill, stroke, 1.8);
/** Benzene-like hexagon ring with an inner circle. */
const benzene = (x: number, y: number, r: number) => all(sugarRing(x, y, r, 6, C.white), circle(x, y, r * 0.55, 'none', C.ink, 1.2));

// ── Things ───────────────────────────────────────────────────────────
const flame = (x: number, y: number, s = 1, outer: string = C.orange, inner: string = C.yellow) => g(`translate(${x} ${y}) scale(${s})`, path('M0 0 C-8 0 -9 -8 -5 -13 C-4 -9 -2 -9 -2 -11 C-2 -16 1 -19 3 -22 C3 -16 9 -12 8 -6 C8 -2 5 0 0 0 Z', outer, C.ink, 1.2), path('M0 -1 C-3 -1 -4 -4 -2 -7 C-1 -5 1 -6 1 -8 C3 -6 4 -3 3 -2 C2 -1 1 -1 0 -1 Z', inner, null));
const drop = (x: number, y: number, s = 1, col: string = '#8cc7e8') => path(`M${x} ${y - 5 * s} C${x + 4 * s} ${y} ${x + 3 * s} ${y + 4 * s} ${x} ${y + 4 * s} C${x - 3 * s} ${y + 4 * s} ${x - 4 * s} ${y} ${x} ${y - 5 * s} Z`, col, C.ink, 0.8);
const bubbles = (x: number, y: number, pts: [number, number][], r = 1.8) => all(...pts.map(([dx, dy]) => circle(x + dx, y + dy, r, C.white, C.ink, 0.8)));
/** Scent waves rising from (x, y). */
const scent = (x: number, y: number, col: string = C.purple, h = 22) => all(...[-6, 0, 6].map((d) => line(`M${x + d} ${y} C${x + d - 4} ${y - h * 0.25} ${x + d + 4} ${y - h * 0.5} ${x + d} ${y - h * 0.75} C${x + d - 3} ${y - h * 0.9} ${x + d + 2} ${y - h} ${x + d} ${y - h}`, col, 1.6)));
/** Bottle: bottom centre (x, y), body w × h, liquid colour, cap colour. */
const bottle = (x: number, y: number, w: number, h: number, liquid: string, cap: string = C.dark, lvl = 0.8) => all(
  path(`M${x - w / 2} ${y} L${x - w / 2} ${y - h * 0.62} C${x - w / 2} ${y - h * 0.78} ${x - w * 0.18} ${y - h * 0.8} ${x - w * 0.18} ${y - h * 0.9} L${x + w * 0.18} ${y - h * 0.9} C${x + w * 0.18} ${y - h * 0.8} ${x + w / 2} ${y - h * 0.78} ${x + w / 2} ${y - h * 0.62} L${x + w / 2} ${y} Z`, GLASS, C.ink, 1.6),
  rect(x - w / 2 + 1, f1(y - h * 0.62 * lvl), w - 2, f1(h * 0.62 * lvl - 1), liquid, 2, null),
  rect(f1(x - w * 0.2), f1(y - h), f1(w * 0.4), f1(h * 0.12), cap, 1.5, C.ink, 1.2),
  path(`M${x - w / 2} ${y} L${x - w / 2} ${y - h * 0.62} C${x - w / 2} ${y - h * 0.78} ${x - w * 0.18} ${y - h * 0.8} ${x - w * 0.18} ${y - h * 0.9} L${x + w * 0.18} ${y - h * 0.9} C${x + w * 0.18} ${y - h * 0.8} ${x + w / 2} ${y - h * 0.78} ${x + w / 2} ${y - h * 0.62} L${x + w / 2} ${y} Z`, 'none', C.ink, 1.6));
/** Straight jar: bottom centre (x, y), w × h, contents drawn by caller, lid colour. */
const jar = (x: number, y: number, w: number, h: number, fill: string, lid: string = C.gold) => all(rect(x - w / 2, y - h, w, h, fill, 4, C.ink, 1.6), rect(x - w / 2 - 2, y - h - 6, w + 4, 7, lid, 2, C.ink, 1.4));
const glass = (x: number, y: number, w = 30, h = 40, lvl = 0.75, liquid: string = WATER) => all(
  rect(x - w / 2, y - h, w, h, GLASS, 3, null),
  lvl > 0 ? rect(x - w / 2, f1(y - h * lvl), w, f1(h * lvl), liquid, 3, null) : '',
  path(`M${x - w / 2} ${y - h} L${x - w / 2} ${y - 3} Q${x - w / 2} ${y} ${x - w / 2 + 3} ${y} L${x + w / 2 - 3} ${y} Q${x + w / 2} ${y} ${x + w / 2} ${y - 3} L${x + w / 2} ${y - h}`, 'none', C.ink, 1.6));
const wineGlass = (x: number, y: number, wine: string = '#9b2335') => all(path(`M${x - 11} ${y - 44} C${x - 12} ${y - 26} ${x + 12} ${y - 26} ${x + 11} ${y - 44} Z`, GLASS, C.ink, 1.4), path(`M${x - 11} ${y - 38} C${x - 10} ${y - 27} ${x + 10} ${y - 27} ${x + 11} ${y - 38} Z`, wine, null), line(`M${x} ${y - 30} L${x} ${y - 2}`, C.ink, 1.8), line(`M${x - 9} ${y} L${x + 9} ${y}`, C.ink, 2));
/** GHS-style warning diamond with a skull (poison). */
const poison = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -11 L11 0 L0 11 L-11 0 Z', C.white, HOT, 2), circle(0, -1.5, 3.6, C.ink, null), rect(-2, 1, 4, 3, C.ink, 0.5, null), circle(-1.4, -2, 1, C.white, null), circle(1.4, -2, 1, C.white, null), line('M-5 5 L5 1 M-5 1 L5 5', C.ink, 1.1));
/** GHS-style flame diamond (flammable). */
const flamDiamond = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -11 L11 0 L0 11 L-11 0 Z', C.white, HOT, 2), path('M0 6 C-4 6 -5 2 -3 -1 C-2 1 -1 0 -1 -2 C0 -5 2 -6 2 -7 C3 -4 5 -2 4 2 C4 5 2 6 0 6 Z', C.ink, null));
const pear = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -14 C5 -14 6 -7 6 -4 C12 0 13 12 0 13 C-13 12 -12 0 -6 -4 C-6 -7 -5 -14 0 -14 Z', '#c9d65a', C.ink, 1.4), line('M0 -14 L1 -19', '#6b4a2a', 1.6), path('M1 -17 C5 -20 8 -18 9 -16 C6 -15 3 -15 1 -17 Z', C.green, C.ink, 0.8));
const banana = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-14 -6 C-8 8 8 10 16 -2 C14 -1 12 -1 11 -2 C4 6 -6 4 -10 -6 Z', C.yellow, C.ink, 1.4), line('M-14 -6 L-15 -9', '#6b4a2a', 2));
const potato = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-14 0 C-14 -9 -4 -11 4 -10 C12 -9 16 -4 15 2 C14 9 6 11 -2 10 C-10 9 -14 6 -14 0 Z', '#c99a5b', C.ink, 1.4), circle(-6, -3, 0.9, '#7a5a3a', null), circle(5, 3, 0.9, '#7a5a3a', null), circle(8, -4, 0.8, '#7a5a3a', null));
const fish = (x: number, y: number, s = 1, col: string = '#f0957a') => g(`translate(${x} ${y}) scale(${s})`, path('M-20 0 C-12 -10 10 -10 16 0 C10 10 -12 10 -20 0 Z', col, C.ink, 1.4), path('M16 0 L26 -8 L26 8 Z', col, C.ink, 1.4), circle(-13, -2, 1.4, C.ink, null), line('M-6 -6 C-3 -2 -3 2 -6 6', C.ink, 1));
const spoonOf = (x: number, y: number, fill: string) => g(`translate(${x} ${y}) rotate(-30)`, ellipse(0, 0, 7, 5, fill, C.ink, 1.2), line('M7 0 L24 0', C.silver, 3), line('M7 0 L24 0', C.ink, 0.6));
const stove = (x: number, y: number, w = 60) => all(rect(x - w / 2, y, w, 112 - y, '#e6e8ea', 2, C.ink, 1.6), line(`M${x - w / 2 + 8} ${y + 3} L${x + w / 2 - 8} ${y + 3}`, HOT, 2.4));
const pan = (x: number, y: number, inside: string) => all(path(`M${x - 22} ${y} L${x - 18} ${y + 10} L${x + 18} ${y + 10} L${x + 22} ${y} Z`, C.dark, C.ink, 1.6), line(`M${x + 22} ${y + 3} L${x + 42} ${y}`, C.dark, 4), ellipse(x, y + 1, 18, 3, inside, null));
const bee = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ellipse(-5, -6, 5, 4, 'rgba(220,240,255,0.9)', C.ink, 1), ellipse(3, -6, 5, 4, 'rgba(220,240,255,0.9)', C.ink, 1), ellipse(0, 0, 8, 5.5, C.yellow, C.ink, 1.2), line('M-2 -5 L-2 5 M3 -5 L3 5', C.ink, 2), circle(8, -1, 3, C.ink, null));
const leaf = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M0 0 C4 -8 14 -10 18 -10 C16 -4 10 4 0 0 Z', C.green, C.ink, 1.2), line('M0 0 L14 -8', '#2f6b45', 0.8));
const bag = (x: number, y: number, col: string = 'rgba(240,244,248,0.95)') => all(path(`M${x - 16} ${y - 34} L${x + 16} ${y - 34} L${x + 18} ${y} L${x - 18} ${y} Z`, col, C.ink, 1.6), path(`M${x - 12} ${y - 34} C${x - 12} ${y - 46} ${x - 4} ${y - 46} ${x - 4} ${y - 34} M${x + 4} ${y - 34} C${x + 4} ${y - 46} ${x + 12} ${y - 46} ${x + 12} ${y - 34}`, 'none', C.ink, 1.6));
/** Hot plate with glowing coil. */
const hotplate = (x: number, y: number) => all(rect(x - 24, y, 48, 10, C.dark, 2, C.ink, 1.4), ellipse(x, y, 18, 3, HOT, C.ink, 1), ...[-12, 0, 12].map((d) => line(`M${x + d} ${y - 6} C${x + d - 3} ${y - 10} ${x + d + 3} ${y - 13} ${x + d} ${y - 17}`, HOT, 1.4)));
/** Beads: loose (scattered) or linked in a wavy chain. */
const bead = (x: number, y: number, r = 5, col: string = '#5f9fd6') => all(circle(x, y, r, col, C.ink, 1.2), circle(x - r * 0.35, y - r * 0.35, r * 0.28, 'rgba(255,255,255,0.7)', null));
const beadChain = (pts: [number, number][], r = 5, col: string = '#5f9fd6') => all(line('M' + pts.map(([x, y]) => `${x} ${y}`).join(' L'), C.ink, 2.6), ...pts.map(([x, y]) => bead(x, y, r, col)));
/** Box of chains for the fat pictures: straight packed or bent loose. */
const fatChains = (x: number, y: number, bent: boolean, col: string = C.ink) => all(...range(3).map((i) => bent
  ? line(`M${x + 2 + i * 12} ${y} L${x + 6 + i * 12} ${y + 10} L${x + 2 + i * 12} ${y + 16} L${x + 10 + i * 12} ${y + 22} L${x + 4 + i * 12} ${y + 30}`, col, 2.2)
  : line(`M${x + 4 + i * 7} ${y} L${x + 6 + i * 7} ${y + 6} L${x + 4 + i * 7} ${y + 12} L${x + 6 + i * 7} ${y + 18} L${x + 4 + i * 7} ${y + 24} L${x + 6 + i * 7} ${y + 30}`, col, 2.2)),
  ...range(3).map((i) => circle(bent ? x + 2 + i * 12 : x + 4 + i * 7, y - 2, 3, OXY, C.ink, 1)));
const oilBottle = (x: number, y: number) => bottle(x, y, 22, 50, OIL, C.green, 0.85);
const butterBlock = (x: number, y: number) => all(ellipse(x, y, 22, 5, C.white, C.ink, 1.4), path(`M${x - 16} ${y - 2} L${x - 16} ${y - 16} L${x + 10} ${y - 16} L${x + 16} ${y - 10} L${x + 16} ${y - 2} Z`, BUTTER, C.ink, 1.4), line(`M${x + 10} ${y - 16} L${x + 10} ${y - 10} L${x + 16} ${y - 10}`, C.ink, 1));
/** Shared fat layout (mättat/omättat): butter left and oil right, the chains below; the chosen side is framed. */
const fatRow = (sat: boolean) => {
  const left = all(butterBlock(30, 54), fatChains(18, 66, false));
  const right = all(oilBottle(90, 58), fatChains(74, 66, true));
  return all(ground(), sat ? left : greyed(left), sat ? greyed(right) : right, sat ? frame(6, 30, 50, 72) : frame(64, 4, 52, 98));
};
/** Shared bead layout (monomer/polymer). */
const beadRow = (linked: boolean) => all(
  linked ? all(beadChain([[12, 70], [24, 60], [36, 54], [48, 58], [60, 66], [72, 68], [84, 62], [96, 54], [108, 50]]), frame(4, 40, 112, 40))
    : all(...([[16, 30], [40, 22], [70, 34], [100, 26], [24, 64], [56, 70], [88, 62], [36, 96], [74, 98], [104, 92]] as [number, number][]).map(([x, y]) => bead(x, y)), ring(56, 70, 11)));
/** Shared hot-plate layout (termoplast/härdplast). */
const plasticRow = (thermo: boolean) => all(ground(), hotplate(38, 102),
  thermo ? path('M20 101 C20 92 26 92 30 86 L46 86 C50 92 56 92 56 101 Z', '#7fc2a0', C.ink, 1.4) : all(rect(24, 70, 28, 32, '#7fc2a0', 2, C.ink, 1.4), path('M24 102 L24 94 C30 96 36 92 40 95 C44 92 48 96 52 94 L52 102 Z', '#2e2e36', null), sparkle(56, 70, 3, C.grey)),
  arrow(62, 88, 76, 88, C.grey, 2.4),
  thermo ? all(rect(84, 72, 26, 30, '#7fc2a0', 13, C.ink, 1.4), sparkle(112, 66, 4)) : all(rect(84, 70, 28, 32, '#7fc2a0', 2, C.ink, 1.4), path('M84 102 L84 94 C90 96 96 92 100 95 C104 92 108 96 112 94 L112 102 Z', '#2e2e36', null)),
  thermo ? all(...range(4).map((i) => line(`M${30 + i * 16} ${16 + (i % 2) * 4} C${36 + i * 16} ${24} ${26 + i * 16} ${32} ${32 + i * 16} ${42}`, C.ink, 2)), frame(16, 8, 76, 40))
    : all(...range(4).map((i) => line(`M${30 + i * 16} 14 L${30 + i * 16} 44`, C.ink, 2)), ...range(3).map((i) => line(`M${30 + i * 16} ${20 + i * 8} L${46 + i * 16} ${20 + i * 8}`, HL, 2.4)), frame(16, 8, 76, 40)));

// ── Motifs ───────────────────────────────────────────────────────────
export const ORGANIC_MOTIFS: Record<string, Svg> = {
  // ── 3451 Kolväten ───────────────────────────────────────────────
  /** kolväte: a molecule of only dark carbon and white hydrogen balls, framed; a grey molecule with a red oxygen is crossed out. */
  'org.kolväte': all((() => { const p = zig(28, 46, 4, 18, 7); return all(hyd(p, 4, 12), ...p.slice(1).map(([x, y], i) => bond(p[i]![0], p[i]![1], x, y)), bond(p[0]![0], p[0]![1], 14, 46, 1.4), at(14, 46, 4, HYD), bond(p[3]![0], p[3]![1], 96, 34, 1.4), at(96, 34, 4, HYD), ...p.map(([x, y]) => at(x, y, 6.5, CARB))); })(),
    frame(6, 18, 98, 56), num(30, 92, 'C', 13), plus(46, 88), num(62, 92, 'H', 13), greyed(ethanol(96, 98, 0.8)), cross(96, 96, 12, C.grey)),
  /** gasol: a gas grill with flames and a tall gas bottle beside it joined by a hose; the bottle is ringed. */
  'org.gasol': all(ground(), rect(10, 56, 54, 14, C.dark, 3, C.ink, 1.6), path('M10 56 C10 40 64 40 64 56 Z', '#555a66', C.ink, 1.6), line('M16 70 L12 112 M58 70 L62 112', C.dark, 3),
    flame(26, 56, 0.5), flame(37, 56, 0.55), flame(48, 56, 0.5), line('M64 64 C76 70 72 90 84 88', C.dark, 2.4),
    path('M80 112 L80 62 C80 54 108 54 108 62 L108 112 Z', '#6aa3d8', C.ink, 1.8), rect(88, 46, 12, 10, C.silver, 2, C.ink, 1.4), line('M80 74 L108 74', C.ink, 1), ring(94, 82, 24)),
  /** butan: a see-through lighter with liquid inside and a flame; a chain of four carbon balls above. */
  'org.butan': all(ground(), rect(40, 58, 26, 52, 'rgba(200,230,250,0.6)', 4, C.ink, 1.8), rect(42, 82, 22, 26, '#a8d4f0', 2, null), line('M42 82 L64 82', '#5a9ccc', 1.4), bubbles(53, 92, [[-4, 4], [3, 8], [0, -2]], 1.4),
    rect(42, 48, 22, 10, C.silver, 2, C.ink, 1.4), rect(60, 44, 8, 8, C.dark, 2, C.ink, 1.2), flame(48, 46, 0.7), ring(53, 92, 16),
    chain(zig(26, 20, 4, 14, 5), 5.4), frame(16, 6, 62, 26)),
  /** oljeraffinaderi: tall distillation towers, round tanks and pipes; a small flare burns on a chimney. */
  'org.oljeraffinaderi': all(ground(), rect(14, 26, 14, 86, C.silver, 3, C.ink, 1.6), rect(34, 40, 12, 72, C.silver, 3, C.ink, 1.6), ...[40, 56, 72, 88].map((y) => line(`M14 ${y} L28 ${y}`, C.ink, 1)), ...[54, 70, 86].map((y) => line(`M34 ${y} L46 ${y}`, C.ink, 1)),
    line('M28 50 L34 50 M28 80 L34 80 M46 96 L58 96', C.dark, 2.4), rect(58, 82, 26, 30, '#e6e8ea', 4, C.ink, 1.6), rect(88, 88, 24, 24, '#e6e8ea', 4, C.ink, 1.6), ellipse(71, 82, 13, 3, '#d4d8dc', C.ink, 1), ellipse(100, 88, 12, 3, '#d4d8dc', C.ink, 1),
    rect(96, 20, 6, 66, C.grey, 1, C.ink, 1.4), flame(99, 20, 0.7), path('M60 40 C66 32 76 34 78 26', 'none', C.grey2, 2), line('M46 60 L70 60 L70 82', C.dark, 2.2)),
  /** fotogen: an old lamp with a glass chimney; the fuel in its round base is ringed. */
  'org.fotogen': all(ground(), ellipse(60, 108, 22, 4, C.brown, C.ink, 1.4), path('M42 104 C38 84 82 84 78 104 Z', 'rgba(240,210,120,0.55)', C.ink, 1.6), path('M43 102 C42 96 78 96 77 102 Z', '#f2d36b', null),
    rect(52, 78, 16, 8, C.gold, 2, C.ink, 1.4), path('M50 78 C42 64 48 42 54 30 L66 30 C72 42 78 64 70 78 Z', 'rgba(230,244,252,0.7)', C.ink, 1.6), flame(60, 66, 0.9), ring(60, 96, 20), sparkle(30, 40, 5), sparkle(92, 44, 4)),
  /** asfalt: a road roller pressing a fresh black road surface; the steaming black layer is framed. */
  'org.asfalt': all(rect(4, 94, 112, 14, '#2e2e36', 1, C.ink, 1.4), rect(4, 108, 112, 4, '#b9a58a', 0, null), ...[16, 40, 70, 96].map((x) => circle(x, 101, 1.4, '#6a6a72', null)),
    circle(36, 80, 14, C.grey, C.ink, 1.8), rect(30, 44, 44, 26, C.yellow, 3, C.ink, 1.8), rect(52, 30, 20, 16, '#d8eef8', 2, C.ink, 1.4), circle(78, 86, 8, C.dark, C.ink, 1.4), line('M74 62 L82 78', C.dark, 3),
    ...[92, 102, 112].map((x) => line(`M${x} 90 C${x - 3} 84 ${x + 3} 80 ${x} 74`, C.grey2, 1.6)), frame(4, 92, 112, 18)),
  /** kolkedja: a long zigzag of carbon balls bound one after another, with an orange bracket along it. */
  'org.kolkedja': all(chain(zig(14, 56, 8, 13, 8), 6.4), line('M10 82 L10 88 L106 88 L106 82', HL, 3), greyed(at(60, 26, 6.4, CARB)), num(60, 110, '1 2 3 4 5 6 7 8', 9, C.grey)),

  // ── 3452 Alkoholer ──────────────────────────────────────────────
  /** alkohol (i drycker): a beer glass, a wine glass and a bottle on a table. */
  'org.alkohol': all(ground(), rect(8, 92, 104, 6, C.tan, 2, C.ink, 1.6), glass(30, 92, 24, 40, 0.8, '#f2c14e'), rect(18, 52, 24, 8, C.white, 3, null), wineGlass(62, 92), bottle(94, 92, 18, 56, '#3f7a3a', C.gold, 0.7)),
  /** alkohol (kemi): three different molecules, each with a red–white OH group, framed together; a grey hydrocarbon without OH outside is crossed out. */
  'org.alkohol.2': all(methanol(26, 28, 1), ethanol(80, 30, 1), (() => { const p = zig(28, 72, 3, 18, 6); return all(...p.slice(1).map(([x, y], i) => bond(p[i]![0], p[i]![1], x, y)), ...p.map(([x, y], i) => oh(x, y, 0, i % 2 ? -10 : 10, 4)), ...p.map(([x, y]) => at(x, y, 5.4, CARB))); })(),
    frame(4, 6, 112, 86), ...[[38, 26], [92, 28]].map(([x, y]) => ring(x!, y!, 9, HL, 1.6)), greyed(chain(zig(42, 104, 4, 12, 3), 4)), cross(60, 104, 9, C.grey)),
  /** hydroxylgrupp: one large ethanol molecule; the O–H group at its end is ringed and the rest is greyed. */
  'org.hydroxylgrupp': all(greyed(g('translate(56 64) scale(2.2)', bond(-14, 0, 0, -6), at(-14, 0, 5.4, CARB), at(0, -6, 5.4, CARB), bond(-14, 0, -21, 4, 1.4), at(-21, 4, 3, HYD), bond(0, -6, 0, -15, 1.4), at(0, -15, 3, HYD))),
    g('translate(48 64) scale(2.2)', oh(0, -6, 12, 2, 5)), greyed(circle(48, 51, 12, CARB, C.ink, 1.2)), ring(93, 54, 22), num(94, 98, 'OH', 16, HL)),
  /** etanol: a wine glass on the left; the ethanol molecule with two carbons on the right, ringed. */
  'org.etanol': all(ground(), wineGlass(28, 110), ethanol(84, 60, 1.5), ring(84, 58, 30), num(84, 104, 'C<tspan font-size="7" baseline-shift="sub">2</tspan>H<tspan font-size="7" baseline-shift="sub">5</tspan>OH', 10)),
  /** jäsning: a big glass bottle with juice and yeast; bubbles rise and leave through a water lock on top. */
  'org.jäsning': all(ground(), path('M24 110 C10 110 10 60 40 56 L40 40 L56 40 L56 56 C86 60 86 110 72 110 Z', GLASS, C.ink, 1.8), path('M15 92 C16 70 30 66 40 64 L56 64 C68 66 80 70 81 92 C81 104 78 108 72 108 L24 108 C18 108 15 104 15 92 Z', '#e9b44c', null),
    ...range(10).map((i) => circle(f1(26 + (i * 17) % 46), f1(98 + (i % 3) * 3), 1.4, '#c98b2a', null)), bubbles(48, 80, [[-10, 6], [4, 0], [-2, -10], [10, -6], [0, 12], [-6, -4], [8, 8]], 2),
    path('M44 40 L44 28 C44 20 52 20 52 28 L52 40', 'none', C.ink, 1.8), path('M46 28 C46 24 50 24 50 28', 'none', '#5a9ccc', 2.4), bubbles(48, 12, [[0, 0], [5, -6]], 2.4), waPulse('b4-org-jasning-1', ring(48, 84, 26))),
  /** alkoholhalt: a beer bottle (5 %) and a strong spirit bottle (40 %); a bar beside each shows the share; the percentages are ringed. */
  'org.alkoholhalt': all(ground(), bottle(26, 110, 18, 60, '#b77b2a', C.gold, 0.8), rect(12, 4, 28, 14, C.white, 3, C.ink, 1.2), num(26, 15, '5 %', 9, HL), rect(44, 50, 6, 60, C.white, 1, C.ink, 1), rect(44, 107, 6, 3, HL, 0, null),
    bottle(86, 110, 20, 66, '#e9eef2', C.dark, 0.85), rect(70, 4, 32, 14, C.white, 3, C.ink, 1.2), num(86, 15, '40 %', 9, HL), rect(104, 50, 6, 60, C.white, 1, C.ink, 1), rect(104, 86, 6, 24, HL, 0, null), ring(26, 11, 14, HL, 2), ring(86, 11, 17, HL, 2)),
  /** rödsprit: a bottle of red liquid with a flame warning sign; a cloth wipes a shining window beside it. */
  'org.rödsprit': all(ground(), bottle(32, 110, 26, 70, '#d63a3a', C.white, 0.85), flamDiamond(32, 86, 0.9), ring(32, 76, 30),
    rect(66, 22, 46, 58, '#e6f4fb', 2, C.ink, 1.8), line('M89 22 L89 80 M66 51 L112 51', C.ink, 1.4), sparkle(78, 36, 4), sparkle(100, 64, 4), path('M86 64 C92 58 102 60 104 68 C100 74 90 74 86 64 Z', '#f6c445', C.ink, 1.2)),
  /** metanol: a bottle with a poison sign on the left; the methanol molecule with one carbon on the right, ringed. */
  'org.metanol': all(ground(), bottle(28, 110, 24, 70, '#e8eef2', C.dark, 0.85), poison(28, 84, 0.95), methanol(88, 62, 1.7), ring(86, 58, 28), num(84, 104, 'CH<tspan font-size="7" baseline-shift="sub">3</tspan>OH', 10)),
  /** glykol: a car and a jug of green coolant with a snowflake and a low thermometer; the molecule with two OH groups is above. */
  'org.glykol': all(ground(), car(30, 106, 1, C.grey), bottle(84, 110, 30, 58, '#62c48a', C.dark, 0.8), g('translate(84 92)', line('M-6 0 L6 0 M0 -6 L0 6 M-4 -4 L4 4 M4 -4 L-4 4', C.white, 1.8)),
    (() => { const p: [number, number][] = [[54, 26], [70, 20]]; return all(bond(54, 26, 70, 20), oh(54, 26, -10, 6, 4.4), oh(70, 20, 11, 4, 4.4), ...p.map(([x, y]) => at(x, y, 5.4, CARB))); })(), frame(34, 6, 72, 34)),
  /** glycerol: a jar of hand cream; the molecule with three carbons and three OH groups above it, framed. */
  'org.glycerol': all(ground(), jar(60, 110, 46, 26, C.white, '#8ab7e0'), path('M44 84 C50 74 70 74 76 84', C.white, C.ink, 1.2), path('M56 80 C58 74 64 74 66 80', 'none', C.grey2, 1.2),
    (() => { const p = zig(38, 32, 3, 22, 6); return all(...p.slice(1).map(([x, y], i) => bond(p[i]![0], p[i]![1], x, y)), ...p.map(([x, y], i) => oh(x, y, 0, i % 2 ? -10 : 11, 4.4)), ...p.map(([x, y]) => at(x, y, 5.8, CARB))); })(), frame(18, 4, 84, 58)),

  // ── 3453 Karboxylsyror ──────────────────────────────────────────
  /** karboxylsyra: three different carbon chains (one, three and four carbons), each ending in the same COOH group, ringed; framed together as one group; a grey alcohol (only OH) outside. */
  'org.karboxylsyra': all(
    g('translate(0 30)', at(38, 4, 4.4, CARB), bond(38, 4, 52, 0), g('translate(52 0)', cooh(0, 0, 4.4)), ring(59, -3, 13)),
    g('translate(0 64)', chain(zig(16, 0, 3, 11, 4), 4.4), bond(38, 4, 52, 0), g('translate(52 0)', cooh(0, 0, 4.4)), ring(59, -3, 13)),
    g('translate(0 98)', chain(zig(10, 0, 4, 10, 4), 4.4), bond(40, -4, 52, 0), g('translate(52 0)', cooh(0, 0, 4.4)), ring(59, -3, 13)),
    frame(3, 10, 79, 104), num(101, 52, 'COOH', 10, HL),
    greyed(ethanol(104, 100, 0.55)), cross(102, 98, 8, C.grey)),
  /** ättika: a bottle of clear vinegar pours into a jar of cucumber slices. */
  'org.ättika': all(ground(), g('translate(34 34) rotate(-60)', bottle(0, 22, 18, 46, '#f2f6f8', C.red, 0.7)), drop(52, 52, 1.2, '#e9f2f6'), drop(55, 62, 1, '#e9f2f6'),
    jar(66, 110, 46, 40, 'rgba(225,240,220,0.8)'), ...[[54, 96], [70, 90], [80, 100], [60, 80], [76, 78]].map(([x, y]) => all(circle(x!, y!, 6, '#9cc96b', C.ink, 1), circle(x!, y!, 3, '#d7ebb4', null))), ring(34, 26, 18)),
  /** konserveringsmedel: a jam jar with a label E 210 under a shield; bacteria outside are crossed out. */
  'org.konserveringsmedel': all(ground(), jar(60, 110, 40, 46, '#b82b3a'), rect(46, 80, 28, 16, C.white, 2, C.ink, 1.2), num(60, 92, 'E 210', 7.5, HL),
    path('M60 26 L84 34 C84 52 74 60 60 66 C46 60 36 52 36 34 Z', 'none', HL, 2.6), ...[[18, 40], [102, 46], [16, 82], [104, 84]].map(([x, y]) => all(ellipse(x!, y!, 7, 4.5, '#7dbb5c', C.ink, 1.2), line(`M${x! - 7} ${y!} l-3 2 M${x! + 7} ${y!} l3 -2`, C.ink, 1), cross(x!, y!, 8, HOT)))),
  /** bensoesyra: lingonberries on a twig and a jar of lingon jam; the ring molecule with COOH is framed. */
  'org.bensoesyra': all(ground(), line('M8 86 C20 80 30 82 40 76', '#6b4a2a', 2), leaf(18, 82, 0.6, -20), ...[[14, 92], [22, 94], [30, 88], [36, 96], [26, 100]].map(([x, y]) => circle(x!, y!, 4, '#c0283a', C.ink, 1)),
    jar(80, 110, 34, 34, '#b82b3a'), benzene(40, 30, 14), bond(54, 30, 64, 30), g('translate(66 30)', cooh(0, 0, 4.6)), frame(20, 8, 70, 40)),
  /** surkål: a jar packed with pale shredded cabbage and bubbles; a cabbage head beside it. */
  'org.surkål': all(ground(), jar(44, 110, 44, 60, 'rgba(240,246,226,0.9)', C.grey), ...range(12).map((i) => line(`M${26 + (i % 4) * 9} ${60 + Math.floor(i / 4) * 14} c4 3 6 -3 10 0`, '#b9c97a', 2)), bubbles(44, 80, [[-10, 6], [8, -4], [2, 16], [-4, -12]], 1.8),
    circle(94, 96, 16, '#cfe3a0', C.ink, 1.6), path('M80 92 C88 86 100 86 108 92 M84 104 C92 98 100 98 106 104', 'none', '#9cb86a', 1.4), ring(44, 80, 30)),

  // ── 3454 Estrar ─────────────────────────────────────────────────
  /** ester: a pear and a banana give off a scent; the ester molecule (C=O with an O inside the chain) is ringed. */
  'org.ester': all(ground(), pear(24, 96, 1.3), banana(64, 100, 1.2), scent(24, 74, C.purple, 18), scent(64, 88, C.purple, 18),
    chain([[18, 30], [32, 24]], 5), bond(32, 24, 46, 30), dbond(46, 30, 46, 16), at(46, 15, 4.6, OXY), bond(46, 30, 60, 26), at(60, 26, 4.6, OXY), bond(60, 26, 74, 32), chain([[74, 32], [88, 26], [102, 32]], 5), at(46, 30, 5, CARB), ring(53, 24, 16), frame(8, 6, 104, 38)),
  /** förestring: acid + alcohol → ester + water written as balls; the reaction arrow is orange and everything is framed. */
  'org.förestring': all(g('translate(18 34)', chain([[-8, 4]], 4), bond(-8, 4, 2, 0), g('translate(2 0)', cooh(0, 0, 4))), plus(48, 32), ethanol(86, 34, 0.85),
    arrow(60, 50, 60, 70, HL, 3.4), g('translate(14 92)', at(0, 0, 4, CARB), bond(0, 0, 10, -4), dbond(10, -4, 10, -14), at(10, -15, 3.6, OXY), bond(10, -4, 20, 0), at(20, 0, 3.6, OXY), bond(20, 0, 30, -4), chain([[30, -4], [40, 0]], 4), at(10, -4, 4, CARB)),
    plus(66, 90), H2O(84, 88, 5), drop(104, 94, 1.4), frame(4, 6, 112, 102)),
  /** smakämne: a small dropper bottle with a strawberry on it drips into a glass of fizzy drink and onto sweets. */
  'org.smakämne': all(ground(), g('translate(40 28) rotate(25)', rect(-8, -10, 16, 24, '#f6d2dc', 3, C.ink, 1.4), rect(-3, -18, 6, 8, C.white, 1, C.ink, 1.2), path('M0 6 C-5 6 -6 0 -4 -2 C-2 -4 2 -4 4 -2 C6 0 5 6 0 6 Z', HOT, C.ink, 0.8)), drop(50, 52, 1.2, HOT), drop(52, 64, 0.9, HOT),
    glass(56, 110, 30, 38, 0.8, '#f6b7c6'), bubbles(56, 92, [[-6, 6], [4, 0], [0, 10]], 1.4), ...[[92, 104, '#f2c14e'], [104, 100, '#8cc7e8'], [98, 92, '#ef9fb5']].map(([x, y, c]) => ellipse(x as number, y as number, 6, 4, c as string, C.ink, 1.2)), ring(40, 30, 20)),
  /** luftfräschare: a spray can on the toilet cistern sends a flower scent into the room. */
  'org.luftfräschare': all(ground(), rect(14, 48, 40, 22, C.white, 3, C.ink, 1.6), path('M18 70 L50 70 L46 90 C46 98 22 98 22 90 Z', C.white, C.ink, 1.6), path('M24 98 L44 98 L42 110 L26 110 Z', C.white, C.ink, 1.4),
    rect(66, 70, 18, 40, '#c7b3e6', 4, C.ink, 1.6), rect(70, 62, 10, 8, C.white, 2, C.ink, 1.2), line('M80 64 L88 60', C.ink, 1.4), ...[[96, 52], [104, 40], [92, 34], [108, 26]].map(([x, y]) => circle(x!, y!, 2, C.lilac, null)),
    ...[[94, 22], [76, 30]].map(([x, y]) => g(`translate(${x} ${y})`, ...range(5).map((i) => circle(f1(Math.cos(i * 1.26) * 4), f1(Math.sin(i * 1.26) * 4), 3, C.pink, C.ink, 0.8)), circle(0, 0, 2, C.yellow, null))), scent(100, 70, C.purple, 20), ring(75, 86, 20)),
  /** vax: a honeycomb with a bee and a yellow candle made of the wax. */
  'org.vax': all(ground(), ...range(7).map((i) => { const x = 22 + (i % 3) * 16 + (Math.floor(i / 3) % 2) * 8, y = 40 + Math.floor(i / 3) * 14; return path(range(6).map((k) => { const a = Math.PI / 6 + (k * Math.PI) / 3; return `${k ? 'L' : 'M'}${f1(x + Math.cos(a) * 8)} ${f1(y + Math.sin(a) * 8)}`; }).join(' ') + ' Z', '#f2c14e', '#b8860b', 1.4); }),
    bee(80, 26, 1.2), rect(80, 68, 16, 44, '#f3d27a', 2, C.ink, 1.6), line('M88 68 L88 60', C.ink, 1.4), flame(88, 60, 0.9), ring(38, 56, 30)),

  // ── 3455 Kolhydraters kemi ──────────────────────────────────────
  /** fruktsocker: an apple, grapes and a honey jar; a single five-ring is ringed above them. */
  'org.fruktsocker': all(ground(), circle(22, 98, 12, C.red, C.ink, 1.4), line('M22 86 L24 80', '#6b4a2a', 1.6), ...[[48, 92], [56, 92], [52, 100], [44, 100], [60, 100], [48, 108], [56, 108]].map(([x, y]) => circle(x!, y!, 4, C.purple, C.ink, 1)),
    jar(92, 110, 30, 32, '#e8a530'), drop(92, 72, 1.4, '#e8a530'), sugarRing(60, 36, 16, 5, '#fbe7a3'), ring(60, 37, 24), greyed(sugarRing(102, 30, 9, 6, C.white))),
  /** sackaros: a sugar bowl with cubes; the six-ring joined to a five-ring is ringed above it. */
  'org.sackaros': all(ground(), path('M32 92 C32 112 88 112 88 92 Z', C.white, C.ink, 1.6), ellipse(60, 92, 28, 5, C.white, C.ink, 1.4), ...[[46, 86], [58, 84], [70, 86], [52, 78], [64, 78]].map(([x, y]) => rect(x! - 5, y! - 5, 10, 10, C.white, 1, C.ink, 1.2)),
    sugarRing(42, 34, 14, 6, '#fbf3dc'), line('M56 36 L66 36', C.ink, 2), sugarRing(80, 36, 13, 5, '#fbe7a3'), frame(22, 14, 76, 42)),
  /** sockerbeta: a big white root with green leaves in the soil of a field; arrow to sugar cubes. */
  'org.sockerbeta': all(rect(4, 66, 112, 46, '#a07a52', 0, null), line('M4 66 L116 66', '#7a5a3a', 2), path('M44 60 C40 82 48 104 56 110 C62 104 70 82 66 60 Z', '#f4efe2', C.ink, 1.8), line('M48 74 l4 1 M52 88 l5 0 M60 80 l4 -1', C.grey2, 1),
    ...[[-30, -26], [-12, -34], [8, -34], [26, -26]].map(([dx, dy]) => path(`M55 62 C${55 + dx! * 0.3} ${62 + dy! * 0.5} ${55 + dx!} ${62 + dy!} ${55 + dx! * 1.1} ${62 + dy! * 1.1} C${55 + dx! * 0.6} ${62 + dy! * 0.6} ${55 + dx! * 0.2} ${62 + dy! * 0.2} 55 62 Z`, C.green, C.ink, 1.2)), ring(55, 84, 22),
    arrow(80, 88, 94, 88, C.white, 2.4), rect(96, 80, 10, 10, C.white, 1, C.ink, 1.2), rect(104, 92, 10, 10, C.white, 1, C.ink, 1.2)),
  /** potatismjöl: a potato → a bowl of fine white powder; a spoonful goes into a sauce pan. */
  'org.potatismjöl': all(ground(), potato(22, 40, 1.2), arrow(38, 46, 52, 58, C.grey, 2.4), path('M48 70 C48 88 88 88 88 70 Z', '#cfe3f0', C.ink, 1.6), path('M50 70 C56 60 80 60 86 70 Z', C.white, C.ink, 1.2), ...range(6).map((i) => circle(56 + i * 5, 66 - (i % 2) * 2, 0.8, C.grey2, null)), ring(68, 70, 22),
    rect(14, 92, 36, 18, C.silver, 3, C.ink, 1.6), ellipse(32, 92, 18, 3, '#e3c07a', C.ink, 1), line('M50 96 L62 94', C.dark, 3), spoonOf(26, 82, C.white)),
  /** jodlösning: a brown dropper bottle drips onto a potato slice, where a dark blue spot appears; the bottle is ringed. */
  'org.jodlösning': all(ground(), g('translate(46 30) rotate(30)', rect(-9, -12, 18, 26, '#8a4b1f', 3, C.ink, 1.6), rect(-3, -20, 6, 8, C.white, 1, C.ink, 1.2)), drop(56, 54, 1.3, '#8a4b1f'),
    ellipse(60, 92, 34, 12, '#f2e3b6', C.ink, 1.6), ellipse(60, 90, 13, 6, '#1f2a5c', null), ring(46, 30, 22), greyed(ellipse(104, 100, 10, 5, '#f2e3b6', C.ink, 1.2)), drop(104, 92, 0.8, '#8a4b1f')),
  /** spjälka: a long chain of six-rings is cut by orange marks into single rings. */
  'org.spjälka': all(...range(5).map((i) => all(sugarRing(14 + i * 22, 30, 9, 6, '#fbf3dc'), i < 4 ? line(`M${23 + i * 22} 30 L${27 + i * 22} 30`, C.ink, 2) : '')), ...range(4).map((i) => line(`M${25 + i * 22} 20 L${25 + i * 22} 40`, HL, 2.4, '3 2')),
    arrow(60, 48, 60, 64, C.grey, 3), waGrow('b4-org-spjalka-1', ...range(5).map((i) => sugarRing(14 + i * 23, 86 + (i % 2) * 8, 9, 6, '#fbf3dc'))), waPulse('b4-org-spjalka-2', ...range(4).map((i) => sparkle(25 + i * 23, 76, 3.4, HL)))),
  /** karamellisera: white sugar (grey) → in a pan on the stove it melts into brown caramel, ringed. */
  'org.karamellisera': all(stove(78, 92, 64), pan(72, 80, '#9a5a1e'), path('M58 82 C62 76 82 76 86 82', 'none', '#b8722a', 2), ...[[62, 72], [72, 68], [82, 72]].map(([x, y]) => line(`M${x!} ${y!} c-3 -4 3 -8 0 -12`, C.grey2, 1.4)), waPulse('b4-org-karamellisera-1', ring(72, 80, 22)),
    greyed(path('M8 70 C10 58 34 58 36 70 Z', C.white, C.ink, 1.4), ...range(6).map((i) => rect(12 + (i % 3) * 7, 62 + Math.floor(i / 3) * 4, 3, 3, C.white, 0.5, C.ink, 0.6))), arrow(30, 50, 48, 62, C.grey, 2.2)),

  // ── 3456 Fett och fettsyror ─────────────────────────────────────
  /** fettsyra: a long zigzag carbon chain with the COOH head at one end; the head is ringed and the long tail has a bracket. */
  'org.fettsyra': all(chain(zig(8, 56, 8, 10, 6), 4.6), bond(78, 62, 88, 56), g('translate(90 56)', cooh(0, 0, 4.6)), ring(96, 52, 15), line('M6 74 L6 80 L80 80 L80 74', HL, 2.6), num(48, 96, '16 – 18', 10, C.grey)),
  /** triglycerid: an E-shaped molecule – three linked glycerol carbons on the left, each with a long chain to the right; framed. */
  'org.triglycerid': all(bond(16, 26, 16, 60), bond(16, 60, 16, 94), ...[26, 60, 94].map((y) => all(bond(16, y, 26, y), at(26, y, 4, OXY), chain(zig(36, y, 7, 11, 4), 3.8), bond(26, y, 36, y + 4), at(16, y, 5.4, CARB))), frame(4, 12, 112, 96)),
  /** mättat fett: butter and oil side by side; the solid butter with straight packed chains is framed, the oil greyed. */
  'org.mättat-fett': fatRow(true),
  /** omättat fett: the same layout; the liquid oil with bent loose chains is framed, the butter greyed. */
  'org.omättat-fett': fatRow(false),
  /** fet fisk: a salmon on a plate with golden oil drops coming out of it; a lean grey fish beside it has none. */
  'org.fet-fisk': all(ground(), ellipse(56, 92, 46, 9, C.white, C.ink, 1.6), fish(52, 80, 1.8, '#f0957a'), line('M30 74 C40 70 56 70 70 76 M28 84 C40 80 56 80 70 86', C.white, 1.4),
    drop(34, 98, 1.2, OIL), drop(60, 100, 1.4, OIL), drop(80, 98, 1.1, OIL), ring(54, 82, 34), greyed(fish(90, 26, 0.8, '#c9ced4'))),
  /** emulsion: a grey glass where oil and water lie in two layers; in the framed glass the oil is spread as tiny drops (like mayonnaise). */
  'org.emulsion': all(ground(), greyed(glass(30, 110, 34, 60, 0.85, WATER), rect(13, 59, 34, 14, OIL, 2, null)),
    glass(88, 110, 34, 60, 0.85, '#f6f1dc'), ...range(22).map((i) => circle(f1(75 + (i * 11) % 28), f1(62 + ((i * 7) % 44)), 1.8, OIL, C.ink, 0.5)), frame(66, 44, 44, 68)),
  /** förtvålning: an oil drop + a bottle of strong base → a bar of soap with foam; the arrow is orange. */
  'org.förtvålning': all(ground(), drop(20, 60, 3, OIL), plus(38, 62), bottle(56, 84, 18, 44, '#dce8f0', C.dark, 0.8), g('translate(56 72) scale(0.7)', path('M0 -11 L11 0 L0 11 L-11 0 Z', C.white, HOT, 2), line('M-5 -2 L-1 -6 M1 2 L5 -2', C.ink, 2)),
    arrow(68, 68, 82, 68, HL, 3.4), rect(84, 78, 30, 18, C.pink, 5, C.ink, 1.6), bubbles(99, 72, [[-10, 0], [-4, -4], [2, -2], [8, -5], [12, 0], [0, -9]], 2.6), frame(80, 54, 38, 46)),

  // ── 3457 Polymerer och plaster ──────────────────────────────────
  /** monomer: many loose beads of the same kind; one bead is ringed. */
  'org.monomer': beadRow(false),
  /** polymer: the same beads linked into one long chain, framed. */
  'org.polymer': beadRow(true),
  /** polyeten: a plastic bag and a plastic bottle; above them a long chain of carbons with hydrogens. */
  'org.polyeten': all(ground(), bag(32, 110), bottle(84, 110, 22, 50, 'rgba(200,230,250,0.7)', C.sky, 0.7), (() => { const p = zig(12, 26, 9, 12, 4); return all(hyd(p, 2.4, 7), chain(p, 4)); })(), frame(4, 10, 112, 32)),
  /** naturgummi: a tree trunk with a slanted cut; white sap runs into a small cup; a tyre beside it. */
  'org.naturgummi': all(ground(), rect(14, 10, 26, 102, '#8a6a46', 4, C.ink, 1.8), line('M14 46 L40 36 M14 54 L40 44', '#5a3f22', 2), path('M38 44 C40 52 38 60 40 66', 'none', C.white, 3), path('M34 66 L46 66 L44 76 L36 76 Z', '#d8c9a8', C.ink, 1.2), ellipse(40, 66, 6, 2, C.white, null), ring(40, 56, 18),
    circle(88, 88, 22, '#2e2e36', C.ink, 1.8), circle(88, 88, 10, C.silver, C.ink, 1.4), ...range(8).map((i) => { const a = (i * Math.PI) / 4; return line(`M${f1(88 + Math.cos(a) * 16)} ${f1(88 + Math.sin(a) * 16)} L${f1(88 + Math.cos(a) * 21)} ${f1(88 + Math.sin(a) * 21)}`, '#555', 1.6); })),
  /** termoplast: a plastic piece on a hot plate melts and is remoulded into a new shape; loose chains above, framed. */
  'org.termoplast': plasticRow(true),
  /** härdplast: the same piece on the hot plate stays stiff and only chars; chains bound across (orange) above, framed. */
  'org.härdplast': plasticRow(false),
  /** cellplast: a white foam box with fish; a broken piece shows it is full of small air bubbles, ringed. */
  'org.cellplast': all(ground(), rect(10, 60, 64, 50, C.white, 3, C.ink, 1.8), path('M10 60 L20 48 L84 48 L74 60 Z', '#f4f4f0', C.ink, 1.6), path('M74 60 L84 48 L84 98 L74 110 Z', '#e8e8e2', C.ink, 1.6), fish(42, 56, 0.8, '#9ab8cf'),
    path('M90 80 L112 76 L114 100 L92 104 Z', C.white, C.ink, 1.6), ...range(10).map((i) => circle(f1(95 + (i * 7) % 16), f1(84 + (i * 5) % 16), 2.2, 'none', C.grey, 0.8)), ring(102, 90, 16)),
  /** silikon: a soft red baking cup pressed flat springs back into shape; the same cup holds a hot muffin. */
  'org.silikon': all(ground(), path('M8 110 L12 98 C24 92 44 92 56 98 L60 110 Z', '#e24b6a', C.ink, 1.6), ...range(5).map((i) => line(`M${16 + i * 9} 99 L${15 + i * 9} 108`, '#b8304e', 1)), arrow(30, 84, 30, 70, C.grey, 2), arrow(62, 96, 70, 96, C.grey, 2.4), path('M70 110 L74 84 L106 84 L110 110 Z', '#e24b6a', C.ink, 1.6), ...range(5).map((i) => line(`M${78 + i * 7} 86 L${77 + i * 7} 108`, '#b8304e', 1)),
    path('M72 84 C70 64 110 64 108 84 Z', '#c98a4a', C.ink, 1.6), ...[[30, 56], [40, 48], [50, 56]].map(([x, y]) => line(`M${x! + 50} ${y!} c-3 -4 3 -8 0 -12`, HOT, 1.6)), ring(34, 100, 18)),
  /** bioplast: a corn cob and a green leaf → a bag with a leaf on it, ringed. */
  'org.bioplast': all(ground(), g('translate(26 70) rotate(-15)', ellipse(0, 0, 9, 24, C.yellow, C.ink, 1.4), ...range(5).map((i) => line(`M-7 ${-16 + i * 8} L7 ${-16 + i * 8}`, '#d9a520', 1)), path('M-9 10 C-16 0 -14 -16 -8 -24 C-8 -10 -6 0 0 20 Z', C.green, C.ink, 1.2)),
    arrow(44, 72, 60, 72, C.grey, 2.6), bag(88, 110, '#dff1df'), leaf(80, 92, 1.1, -30), ring(88, 88, 26)),
};
