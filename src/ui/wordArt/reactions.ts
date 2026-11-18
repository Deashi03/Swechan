/**
 * Matematik & naturvetenskap → Kemi → Kemiska reaktioner, 3431–3437 (0.51): reactants and products,
 * reaction formulas, balancing reactions, combustion, oxidation and reduction, precipitation reactions and
 * reaction rate.
 * Recurring signs: atoms are balls – hydrogen white, oxygen red, carbon dark grey; a reaction is a thick
 * grey arrow. The part the word names is orange (ring, frame, arrow or bar) and a grey reference shows what
 * the word is not. Close words share one layout where only the marked part differs: reaktant/produkt
 * (the same C + O₂ → CO₂ row, left side or right side framed), kemisk/fysikalisk förändring (thing → thing
 * with a way back that is crossed out or open), exoterm/endoterm (the same pouch and thermometer, heat out
 * and hot or heat in and cold), koefficient (2H₂O with the big 2 ringed; the index is T02's word),
 * fullständig/ofullständig förbränning (the same burner, blue flame giving CO₂ and water or yellow flame
 * giving soot and CO), oxidation/reduktion (the same nail-and-arrow layout, an oxygen ball going in or
 * coming out), löslig/svårlöslig (the same glass before and after, the lump gone or still there).
 * Digits, maths signs and chemical symbols only; no words, no brands.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';
import { car } from './homeKit';

// ── Palette and basics ───────────────────────────────────────────────
const HOT = '#d64545';
const COLD = '#3f8fd2';
const WATER = '#cfe8f6';
const GLASS = '#eef6fb';
const HYD = '#fbfbf8';
const OXY = '#e2483d';
const CARB = '#4a4c56';
const RUST = '#b5562b';
const IRON = '#9aa3ad';
const BLUEF = '#4f8fe0';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const ring = (x: number, y: number, r: number, col: string = HL, sw = 2.6) => circle(x, y, r, 'none', col, sw);
const frame = (x: number, y: number, w: number, h: number, col: string = HL, sw = 2.6) => rect(x, y, w, h, 'none', 5, col, sw);
const num = (x: number, y: number, s: string, size = 10, col: string = C.ink) => T(x, y, s, size, col);
/** Chemical formula text; "_2" becomes a subscript 2. */
const fm = (x: number, y: number, s: string, size = 10, col: string = C.ink) =>
  T(x, y, s.replace(/_(\d+)/g, `<tspan font-size="${f1(size * 0.66)}" baseline-shift="sub">$1</tspan>`), size, col);
/** Atom ball. */
const at = (x: number, y: number, r: number, col: string) => circle(x, y, r, col, C.ink, 1.2);
const O2 = (x: number, y: number, r = 5) => all(at(x - r * 0.8, y, r, OXY), at(x + r * 0.8, y, r, OXY));
const H2 = (x: number, y: number, r = 4) => all(at(x - r * 0.8, y, r, HYD), at(x + r * 0.8, y, r, HYD));
const CO2 = (x: number, y: number, r = 5) => all(at(x - r * 1.5, y, r * 0.9, OXY), at(x + r * 1.5, y, r * 0.9, OXY), at(x, y, r, CARB));
const CO = (x: number, y: number, r = 5) => all(at(x - r * 0.8, y, r, CARB), at(x + r * 0.8, y, r * 0.9, OXY));
const H2O = (x: number, y: number, r = 5) => all(at(x - r * 1.05, y + r * 0.7, r * 0.7, HYD), at(x + r * 1.05, y + r * 0.7, r * 0.7, HYD), at(x, y, r, OXY));
/** Thick grey reaction arrow. */
const rx = (x1: number, y: number, x2: number, col: string = C.grey) => arrow(x1, y, x2, y, col, 3);
const plus = (x: number, y: number, col: string = C.ink) => line(`M${x - 4} ${y} L${x + 4} ${y} M${x} ${y - 4} L${x} ${y + 4}`, col, 2);
const cross = (x: number, y: number, r: number, col: string = HOT) => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 2.6);
/** Upright thermometer: bulb centre (x, y), tube height h, liquid level 0–1. */
const therm = (x: number, y: number, h: number, level: number, col: string = HOT) => all(
  rect(x - 3.4, y - h, 6.8, h, C.white, 3.4, C.ink, 1.3),
  rect(x - 1.6, f1(y - 4 - (h - 8) * level), 3.2, f1(4 + (h - 8) * level), col, 1, null),
  circle(x, y + 2, 5.4, col, C.ink, 1.3));
/** Wavy heat arrow from (x1, y1) to (x2, y2). */
const heat = (x1: number, y1: number, x2: number, y2: number, col: string = HL, sw = 2.2) => {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len, n = Math.max(2, Math.round(len / 8));
  const pts = range(n + 1).map((i) => { const t = i / n, w = i === 0 || i === n ? 0 : (i % 2 ? 2.4 : -2.4); return `${f1(x1 + dx * t * 0.86 + nx * w)} ${f1(y1 + dy * t * 0.86 + ny * w)}`; });
  const ex = f1(x1 + dx * 0.86), ey = f1(y1 + dy * 0.86), h = 6;
  return all(line('M' + pts.join(' L'), col, sw), path(`M${x2} ${y2} L${f1(ex + nx * h * 0.6)} ${f1(ey + ny * h * 0.6)} L${f1(ex - nx * h * 0.6)} ${f1(ey - ny * h * 0.6)} Z`, col, col, 1.2));
};
const flame = (x: number, y: number, s = 1, outer: string = C.orange, inner: string = C.yellow) => g(`translate(${x} ${y}) scale(${s})`, path('M0 0 C-8 0 -9 -8 -5 -13 C-4 -9 -2 -9 -2 -11 C-2 -16 1 -19 3 -22 C3 -16 9 -12 8 -6 C8 -2 5 0 0 0 Z', outer, C.ink, 1.2), path('M0 -1 C-3 -1 -4 -4 -2 -7 C-1 -5 1 -6 1 -8 C3 -6 4 -3 3 -2 C2 -1 1 -1 0 -1 Z', inner, null));
const snow = (x: number, y: number, r = 4, col: string = COLD) => line(range(3).map((i) => { const a = (i * Math.PI) / 3; return `M${f1(x - Math.cos(a) * r)} ${f1(y - Math.sin(a) * r)} L${f1(x + Math.cos(a) * r)} ${f1(y + Math.sin(a) * r)}`; }).join(' '), col, 1.4);
/** Straight drinking glass: bottom centre (x, y), width w, height h, liquid level 0–1. */
const glass = (x: number, y: number, w = 30, h = 40, lvl = 0.75, liquid: string = WATER) => all(
  rect(x - w / 2, y - h, w, h, GLASS, 3, null),
  lvl > 0 ? rect(x - w / 2, f1(y - h * lvl), w, f1(h * lvl), liquid, 3, null) : '',
  path(`M${x - w / 2} ${y - h} L${x - w / 2} ${y - 3} Q${x - w / 2} ${y} ${x - w / 2 + 3} ${y} L${x + w / 2 - 3} ${y} Q${x + w / 2} ${y} ${x + w / 2} ${y - 3} L${x + w / 2} ${y - h}`, 'none', C.ink, 1.6));
const bubbles = (x: number, y: number, pts: [number, number][], r = 1.8) => all(...pts.map(([dx, dy]) => circle(x + dx, y + dy, r, C.white, C.ink, 0.8)));
/** Nail lying flat from (x, y), length l. */
const nail = (x: number, y: number, l: number, col: string = IRON, spots = false) => all(
  rect(x, y - 2.5, l, 5, col, 1, C.ink, 1.2), rect(x - 3, y - 6, 4, 12, col, 1, C.ink, 1.2), path(`M${x + l} ${y - 2.5} L${x + l + 7} ${y} L${x + l} ${y + 2.5} Z`, col, C.ink, 1.2),
  spots ? all(circle(x + l * 0.3, y - 0.5, 1.6, '#7a3412', null), circle(x + l * 0.6, y + 0.8, 1.4, '#7a3412', null), circle(x + l * 0.8, y - 1, 1.2, '#7a3412', null)) : '');
/** Bunsen-like gas burner with a flame. */
const burner = (x: number, y: number, fl: Svg) => all(rect(x - 14, y - 4, 28, 4, C.dark, 1, C.ink, 1.2), rect(x - 4, y - 34, 8, 30, C.silver, 1, C.ink, 1.4), rect(x - 6, y - 16, 12, 4, C.grey, 1, C.ink, 1), line(`M${x - 14} ${y - 6} L${x - 24} ${y - 6}`, C.dark, 2.4), g(`translate(${x} ${y - 34})`, fl));
const blueFlame = (s = 1) => g(`scale(${s})`, path('M0 0 C-7 0 -7 -10 -4 -16 C-2 -21 0 -26 0 -30 C1 -26 3 -21 4 -16 C7 -10 7 0 0 0 Z', '#9cc4f2', C.ink, 1.1), path('M0 -1 C-3 -1 -3 -7 0 -14 C3 -7 3 -1 0 -1 Z', BLUEF, null));
const yellowFlame = (s = 1) => g(`scale(${s})`, path('M0 0 C-10 0 -11 -10 -7 -17 C-5 -12 -3 -14 -4 -20 C-2 -27 3 -30 4 -36 C5 -28 11 -22 9 -12 C12 -14 11 -6 9 -3 C7 0 4 0 0 0 Z', C.yellow, C.ink, 1.1), path('M0 -1 C-4 -1 -5 -6 -2 -11 C0 -8 2 -10 2 -13 C5 -9 5 -4 3 -2 Z', C.orange, null));
const smoke = (x: number, y: number, s = 1, col: string = C.dark) => g(`translate(${x} ${y}) scale(${s})`, path('M-10 4 C-16 4 -16 -4 -10 -5 C-10 -12 -2 -14 2 -9 C6 -14 14 -12 13 -5 C18 -4 18 4 12 4 Z', col, C.ink, 1));
/** Small drop (liquid). */
const drop = (x: number, y: number, s = 1, col: string = '#8cc7e8') => path(`M${x} ${y - 5 * s} C${x + 4 * s} ${y} ${x + 3 * s} ${y + 4 * s} ${x} ${y + 4 * s} C${x - 3 * s} ${y + 4 * s} ${x - 4 * s} ${y} ${x} ${y - 5 * s} Z`, col, C.ink, 0.8);
/** Electric kettle seen from the side, cut open (inside shown). */
const kettle = (x: number, y: number, crust: boolean) => all(path(`M${x - 18} ${y} L${x - 15} ${y - 40} L${x + 15} ${y - 40} L${x + 18} ${y} Z`, '#eef0f2', C.ink, 1.6),
  path(`M${x - 16} ${y - 2} L${x - 14} ${y - 26} L${x + 14} ${y - 26} L${x + 16} ${y - 2} Z`, WATER, null), path(`M${x + 15} ${y - 36} C${x + 28} ${y - 34} ${x + 28} ${y - 10} ${x + 17} ${y - 8}`, 'none', C.ink, 2.4),
  path(`M${x - 15} ${y - 40} L${x - 24} ${y - 46} L${x - 14} ${y - 34}`, '#eef0f2', C.ink, 1.4), rect(x - 20, y, 40, 5, C.dark, 2, C.ink, 1.2),
  crust ? all(path(`M${x - 16} ${y - 2} L${x - 15} ${y - 10} C${x - 8} ${y - 7} ${x + 6} ${y - 11} ${x + 15} ${y - 9} L${x + 16} ${y - 2} Z`, C.white, C.ink, 1), line(`M${x - 13} ${y - 6} l3 -1 M${x - 4} ${y - 7} l3 1 M${x + 6} ${y - 6} l3 -1`, C.grey2, 1.2)) : '');
/** Pouch (heat or cold pack) centred at (x, y). */
const pouch = (x: number, y: number, col: string) => all(rect(x - 18, y - 24, 36, 48, col, 8, C.ink, 1.8), line(`M${x - 18} ${y - 18} L${x + 18} ${y - 18}`, C.ink, 1), ...range(6).map((i) => circle(x - 9 + (i % 3) * 9, y - 6 + Math.floor(i / 3) * 14, 2.2, 'rgba(255,255,255,0.7)', null)));
/** Level balance beam on a stand with a plate at each end; the plates carry the given drawings. */
const beam = (x: number, y: number, left: Svg, right: Svg, col: string = C.dark) => all(
  path(`M${x - 14} 110 L${x + 14} 110 L${x + 3} ${y} L${x - 3} ${y} Z`, col, C.ink, 1.4), line(`M${x - 44} ${y} L${x + 44} ${y}`, col, 3.4),
  line(`M${x - 40} ${y} L${x - 40} ${y - 6} M${x + 40} ${y} L${x + 40} ${y - 6}`, col, 2.4),
  g(`translate(${x - 40} ${y - 6})`, rect(-18, -2, 36, 4, C.silver, 2, C.ink, 1.2), left),
  g(`translate(${x + 40} ${y - 6})`, rect(-18, -2, 36, 4, C.silver, 2, C.ink, 1.2), right));
/** Silver spoon lying diagonally; col = bowl and handle colour. */
const spoon = (x: number, y: number, col: string) => g(`translate(${x} ${y}) rotate(-35)`, ellipse(0, 0, 9, 12, col, C.ink, 1.4), rect(-2.2, 11, 4.4, 34, col, 2, C.ink, 1.2), ellipse(-3, -3, 2.4, 4, 'rgba(255,255,255,0.7)', null));
/** Apple half seen from the cut side. */
const appleHalf = (x: number, y: number, flesh: string) => all(path(`M${x} ${y - 16} C${x + 18} ${y - 22} ${x + 22} ${y + 4} ${x + 10} ${y + 14} C${x + 4} ${y + 18} ${x - 4} ${y + 18} ${x - 10} ${y + 14} C${x - 22} ${y + 4} ${x - 18} ${y - 22} ${x} ${y - 16} Z`, flesh, '#c0392b', 2.4),
  path(`M${x - 4} ${y - 2} C${x - 3} ${y - 6} ${x + 3} ${y - 6} ${x + 4} ${y - 2} C${x + 3} ${y + 3} ${x - 3} ${y + 3} ${x - 4} ${y - 2} Z`, 'none', '#8a6a3a', 1), line(`M${x} ${y - 16} L${x + 1} ${y - 22}`, '#6b4a2a', 1.6));
const lemonHalf = (x: number, y: number) => all(ellipse(x, y, 12, 9, '#fbe36b', '#d9b417', 1.8), ...range(6).map((i) => { const a = (i * Math.PI) / 3; return line(`M${x} ${y} L${f1(x + Math.cos(a) * 9)} ${f1(y + Math.sin(a) * 6.5)}`, '#e8c93a', 1); }));
/** Small dropper bottle tipped to pour at (x, y). */
const bottle = (x: number, y: number, rot: number, col: string = '#e6f0d8') => g(`translate(${x} ${y}) rotate(${rot})`, rect(-7, -10, 14, 22, col, 3, C.ink, 1.4), rect(-3, -16, 6, 6, C.white, 1, C.ink, 1.2));
/** Cave ceiling and floor with stalactites / stalagmites. */
const caveRock = '#b9a58a';
/** Speedometer gauge, needle angle 0 (left) – 180 (right). */
const gauge = (x: number, y: number, r: number, ang: number, col: string = HL) => {
  const a = Math.PI - (ang * Math.PI) / 180;
  return all(path(`M${x - r} ${y} A${r} ${r} 0 0 1 ${x + r} ${y} Z`, C.white, C.ink, 1.6),
    line(range(5).map((i) => { const b = Math.PI - (i * Math.PI) / 4; return `M${f1(x + Math.cos(b) * (r - 2))} ${f1(y - Math.sin(b) * (r - 2))} L${f1(x + Math.cos(b) * (r - 6))} ${f1(y - Math.sin(b) * (r - 6))}`; }).join(' '), C.ink, 1.2),
    line(`M${x} ${y} L${f1(x + Math.cos(a) * (r - 4))} ${f1(y - Math.sin(a) * (r - 4))}`, col, 2.6), circle(x, y, 2.4, C.ink, null));
};
/** Shared C + O₂ → CO₂ row (reaktant/produkt); side 'L' or 'R' is framed in orange, the other greyed. */
const reactRow = (side: 'L' | 'R') => {
  const left = all(at(13, 60, 7, CARB), plus(26, 60), O2(44, 60, 6));
  const right = CO2(96, 60, 7);
  return all(side === 'L' ? left : greyed(left), rx(62, 60, 78), side === 'R' ? right : greyed(right),
    side === 'L' ? frame(4, 42, 58, 36) : frame(78, 42, 38, 36),
    side === 'L' ? all(fm(13, 92, 'C', 10, C.ink), fm(44, 92, 'O_2', 10, C.ink), greyed(fm(96, 92, 'CO_2', 10))) : all(greyed(fm(13, 92, 'C', 10), fm(44, 92, 'O_2', 10)), fm(96, 92, 'CO_2', 10, C.ink)));
};
/** Shared change row (kemisk/fysikalisk förändring): A → B on top, a way back below that is open or crossed. */
const changeRow = (a: Svg, b: Svg, back: boolean) => all(ground(), a, rx(46, 46, 70), b, back ? arrow(70, 78, 46, 78, HL, 3) : all(greyed(arrow(70, 78, 46, 78, C.grey, 3)), cross(58, 78, 8, HL)));
/** Shared pouch layout (exoterm/endoterm). */
const packRow = (hot: boolean) => all(ground(), pouch(46, 64, hot ? '#f4a259' : '#9cc9ef'),
  hot ? all(heat(68, 50, 86, 40), heat(68, 70, 88, 76), heat(26, 50, 10, 40), heat(26, 70, 8, 78), heat(46, 36, 46, 16))
    : all(heat(88, 40, 68, 52, C.grey), heat(88, 80, 68, 72, C.grey), heat(6, 40, 26, 52, C.grey), heat(6, 80, 26, 72, C.grey), snow(46, 64, 7, C.white)),
  therm(104, 100, 60, hot ? 0.92 : 0.12, hot ? HOT : COLD), ring(104, 102, 10));
/** Water formula: 'k' = 2H₂O with the big 2 (koefficient) ringed; 'i' = H₂O with the small 2 ringed (spare variant). */
const waterFormula = (which: 'i' | 'k') => all(
  which === 'k' ? all(H2O(36, 26, 8), H2O(80, 26, 8)) : all(H2O(58, 26, 10), ring(46, 40, 6, C.grey, 1.4), ring(70, 40, 6, C.grey, 1.4)),
  T(60, 86, which === 'k' ? '2H<tspan font-size="20" baseline-shift="sub">2</tspan>O' : 'H<tspan font-size="20" baseline-shift="sub">2</tspan>O', 34, C.ink),
  which === 'k' ? ring(23, 74, 14) : ring(which === 'i' ? 60 : 0, 90, 10));
/** Shared burner layout (fullständig/ofullständig förbränning). */
const burnRow = (full: boolean) => all(ground(),
  burner(40, 112, full ? blueFlame(1.1) : yellowFlame(1.05)),
  full ? all(arrow(54, 50, 72, 36, HL, 2.4), CO2(92, 30, 6), arrow(54, 62, 72, 72, HL, 2.4), drop(90, 72, 1.8, '#8cc7e8'), drop(102, 76, 1.4, '#8cc7e8'))
    : all(smoke(40, 22, 1.1), smoke(56, 12, 0.8), arrow(56, 56, 72, 48, HL, 2.4), CO(92, 46, 7), ring(92, 46, 16), line('M78 76 L106 76', C.dark, 1, '1 3'), circle(88, 84, 2, C.dark, null), circle(98, 80, 1.6, C.dark, null), circle(104, 88, 1.8, C.dark, null)));
/** Shared oxygen-in / oxygen-out layout (oxidation/reduktion). */
const redoxRow = (ox: boolean) => all(ground(),
  ox ? nail(6, 86, 28, IRON) : g('translate(20 86)', path('M-16 6 C-18 -4 -8 -12 2 -10 C12 -12 18 -2 14 6 Z', RUST, C.ink, 1.4), circle(-6, -2, 1.6, '#7a3412', null), circle(6, 0, 1.6, '#7a3412', null)),
  rx(46, 86, 72),
  ox ? nail(80, 86, 28, RUST, true) : rect(78, 80, 34, 12, '#cfd5db', 2, C.ink, 1.4), ox ? '' : line('M82 83 L106 83', C.white, 1.6),
  ox ? all(at(60, 30, 9, OXY), arrow(60, 42, 60, 74, HL, 3)) : all(arrow(60, 76, 60, 44, HL, 3), at(60, 30, 9, OXY)),
  ring(60, 30, 14));
/** Glass before → glass after (löslig/svårlöslig). */
const dissolveRow = (gone: boolean) => all(ground(),
  glass(28, 110, 32, 50), gone ? rect(22, 96, 12, 12, C.white, 1, C.ink, 1.2) : path('M18 108 C18 100 24 96 30 98 C36 96 40 102 38 108 Z', '#d9d2c3', C.ink, 1.2),
  line('M24 80 C26 72 32 72 32 64', C.grey, 1.4), rx(48, 84, 70),
  glass(92, 110, 32, 50),
  gone ? all(...range(10).map((i) => circle(f1(80 + (i * 7) % 24), f1(72 + ((i * 13) % 34)), 0.9, C.grey, null))) : path('M82 108 C82 100 88 96 94 98 C100 96 104 102 102 108 Z', '#d9d2c3', C.ink, 1.2),
  frame(72, 54, 40, 58));

// ── Motifs ───────────────────────────────────────────────────────────
export const REACTIONS_MOTIFS: Record<string, Svg> = {
  // ── 3431 Reaktanter och produkter ───────────────────────────────
  /** reaktant: C + O₂ → CO₂; the starting substances on the left are framed, the product greyed. */
  'reak.reaktant': all(ground(), reactRow('L')),
  /** produkt (kemi): the same row; the new substance on the right is framed, the starting substances greyed. */
  'reak.produkt.3': all(ground(), reactRow('R')),
  /** kemisk förändring: raw egg → fried egg; the way back is crossed out. */
  'reak.kemisk-förändring': changeRow(
    g('translate(24 46)', ellipse(0, 0, 18, 12, '#f3f6f8', C.grey, 1.2), ellipse(0, 0, 14, 9, 'rgba(255,255,255,0.6)', C.ink, 1), circle(1, 0, 6, '#f6c445', C.ink, 1.2)),
    g('translate(94 46)', path('M-18 2 C-20 -10 -6 -14 2 -12 C14 -14 20 -4 16 6 C12 14 -12 14 -18 2 Z', C.white, C.ink, 1.4), path('M-12 4 C-8 8 6 10 12 4', 'none', '#c99a4a', 1.4), circle(0, -1, 6.5, '#f2a93b', C.ink, 1.2)), false),
  /** fysikalisk förändring: ice cube → water; the way back is open (orange). */
  'reak.fysikalisk-förändring': changeRow(
    g('translate(24 46)', path('M-12 -6 L0 -12 L12 -6 L12 9 L0 15 L-12 9 Z', '#dff1fb', C.ink, 1.4), line('M-12 -6 L0 0 L12 -6 M0 0 L0 15', C.ink, 1)),
    g('translate(94 52)', ellipse(0, 6, 20, 5, '#a9d6f2', C.ink, 1.2), drop(0, -8, 2.2, '#8cc7e8')), true),
  /** bildas: two loose atoms (greyed) meet, and a new molecule appears in an orange ring with sparkles. */
  'reak.bildas': all(ground(), greyed(at(14, 40, 7, '#5fa8d3'), at(14, 80, 7, C.yellow)), arrow(26, 44, 44, 56, C.grey, 2), arrow(26, 76, 44, 64, C.grey, 2),
    circle(70, 60, 26, '#fff7e0', null), at(62, 60, 9, '#5fa8d3'), at(78, 60, 9, C.yellow), ring(70, 60, 26), sparkle(98, 32, 6), sparkle(102, 86, 5), sparkle(46, 30, 4)),
  /** exoterm: a heat pouch sends heat out; the thermometer is high. */
  'reak.exoterm': packRow(true),
  /** endoterm: a cold pouch takes heat in; the thermometer is low. */
  'reak.endoterm': packRow(false),
  /** bakpulver: an open tin of white powder and a measuring spoon; a cake in the oven tin rising with bubbles inside. */
  'reak.bakpulver': all(ground(), rect(8, 66, 30, 44, '#e9eef2', 3, C.ink, 1.6), ellipse(23, 66, 15, 4, C.white, C.ink, 1.4), path('M12 66 C16 60 30 60 34 66', C.white, null),
    g('translate(48 56) rotate(-20)', ellipse(0, 0, 8, 4, C.white, C.ink, 1.2), line('M8 0 L24 0', C.ink, 2)), ring(23, 66, 18),
    arrow(46, 80, 60, 80, C.grey, 2.4), rect(64, 90, 50, 20, '#8a8f99', 2, C.ink, 1.6), path('M66 90 C66 64 112 64 112 90 Z', '#e9c27a', C.ink, 1.6),
    bubbles(88, 80, [[-12, 0], [-4, -6], [6, -2], [14, 2], [0, 4], [-8, -12], [8, -12]], 2), arrow(118, 86, 118, 64, HL, 2)),

  // ── 3432 Reaktionsformler ───────────────────────────────────────
  /** reaktionsformel: the methane combustion formula written out and framed, the molecules drawn above it. */
  'reak.reaktionsformel': all(
    at(14, 30, 6, CARB), at(6, 24, 3.4, HYD), at(22, 24, 3.4, HYD), at(6, 36, 3.4, HYD), at(22, 36, 3.4, HYD), plus(32, 30), O2(44, 24, 4), O2(44, 38, 4),
    rx(54, 30, 66), CO2(80, 24, 4), plus(94, 30), H2O(106, 22, 4), H2O(106, 38, 4),
    frame(2, 58, 116, 30), fm(60, 78, 'CH_4 + 2O_2 → CO_2 + 2H_2O', 9)),
  /** koefficient (kemi): 2H₂O with the big 2 in front ringed; two whole water molecules above. */
  'reak.koefficient.2': waterFormula('k'),

  // ── 3433 Balansera reaktioner ───────────────────────────────────
  /** balansera (kemi): a level beam – 2 H₂ + O₂ on the left, 2 H₂O on the right with the added 2 in orange; an orange = and a level line. */
  'reak.balansera.2': all(ground(), beam(60, 80, all(H2(-9, -10, 4.4), H2(9, -10, 4.4), O2(0, -22, 4.6)), all(H2O(-6, -13, 5), H2O(10, -13, 5))),
    num(78, 70, '2', 16, HL), num(60, 44, '=', 24, HL), line('M8 88 L112 88', HL, 1.6, '3 3')),
  /** lagen om massans bevarande: a closed bottle on a scale before (tablet) and after (bubbles) – the same number on both displays. */
  'reak.lagen-om-massans-bevarande': all(ground(),
    rect(4, 96, 50, 14, C.dark, 3, C.ink, 1.4), rect(14, 99, 30, 8, '#d9f0d0', 2, C.ink, 1), num(29, 106, '250', 7.5, HL),
    rect(20, 60, 18, 36, GLASS, 4, C.ink, 1.4), rect(25, 54, 8, 6, C.dark, 1, C.ink, 1), rect(20, 70, 18, 26, WATER, 3, null), rect(25, 88, 8, 4, C.white, 1, C.ink, 0.8),
    rx(56, 80, 64),
    rect(66, 96, 50, 14, C.dark, 3, C.ink, 1.4), rect(76, 99, 30, 8, '#d9f0d0', 2, C.ink, 1), num(91, 106, '250', 7.5, HL),
    rect(82, 60, 18, 36, GLASS, 4, C.ink, 1.4), rect(87, 54, 8, 6, C.dark, 1, C.ink, 1), rect(82, 70, 18, 26, WATER, 3, null), bubbles(91, 80, [[-4, 6], [3, 2], [-2, -4], [4, -6], [0, 10], [-5, -8], [5, 8]], 1.5),
    num(60, 30, '=', 22, HL), frame(12, 96, 34, 14, HL, 2), frame(74, 96, 34, 14, HL, 2)),
  /** fattas: an egg carton for six with five eggs; the empty place is ringed. */
  'reak.fattas': all(ground(), rect(10, 60, 100, 40, '#c9b79a', 4, C.ink, 1.8),
    ...range(6).map((i) => ellipse(26 + (i % 3) * 34, 70 + Math.floor(i / 3) * 20, 12, 8, '#b8a383', C.ink, 1)),
    ...range(6).filter((i) => i !== 5).map((i) => ellipse(26 + (i % 3) * 34, 66 + Math.floor(i / 3) * 20, 9, 11, '#f7efe2', C.ink, 1.3)),
    ring(94, 90, 15), num(94, 50, '?', 16, HL)),
  /** överskott (kemi): 2 C + 4 O₂ → 2 CO₂; two O₂ molecules are left over after the arrow and framed. */
  'reak.överskott.3': all(ground(),
    at(14, 40, 6, CARB), at(14, 70, 6, CARB), plus(28, 55), O2(44, 28, 5), O2(44, 46, 5), O2(44, 64, 5), O2(44, 82, 5),
    rx(56, 55, 70), CO2(92, 30, 5), CO2(92, 50, 5), O2(92, 84, 5), O2(92, 100, 5), frame(76, 72, 32, 38)),
  /** tvåatomig: O₂, H₂ and N₂ – each two balls joined – in an orange frame; a single grey atom beside. */
  'reak.tvåatomig': all(ground(), greyed(at(18, 60, 9, C.lilac)), cross(18, 60, 13, C.grey),
    O2(64, 30, 8), H2(64, 60, 6), all(at(56, 90, 8, '#5f7fd1'), at(72, 90, 8, '#5f7fd1')), frame(40, 14, 48, 92), num(102, 64, '2', 18, HL)),

  // ── 3434 Förbränning ────────────────────────────────────────────
  /** låga: a candle; its flame is enlarged and ringed. */
  'reak.låga': all(ground(), rect(48, 70, 24, 42, '#f7efe2', 2, C.ink, 1.6), line('M60 70 L60 62', C.ink, 1.6), flame(60, 62, 1.9), ring(60, 42, 22)),
  /** fullständig förbränning: burner with a blue flame; arrows to CO₂ and water. */
  'reak.fullständig-förbränning': burnRow(true),
  /** ofullständig förbränning: the same burner with a yellow sooty flame; black smoke, soot and CO (ringed). */
  'reak.ofullständig-förbränning': burnRow(false),
  /** kolmonoxid: a car running in a closed garage; the invisible gas (dashed) and a big CO molecule ringed. */
  'reak.kolmonoxid': all(rect(4, 30, 112, 82, '#e9e3d8', 2, C.ink, 1.6), path('M2 32 L60 10 L118 32', 'none', C.ink, 2), ground(), car(38, 104, 1.1, C.grey),
    path('M66 100 C76 96 72 86 82 84 C90 70 106 74 108 86 C116 90 112 104 100 104 Z', 'rgba(255,255,255,0.4)', C.grey, 1.2), line('M64 101 L60 100', C.dark, 2),
    CO(88, 56, 9), ring(88, 56, 20)),
  /** brandtriangel: a triangle around a flame; its corners are fuel (a log), oxygen (O₂) and heat (thermometer). */
  'reak.brandtriangel': all(path('M60 14 L108 96 L12 96 Z', 'none', HL, 3), flame(60, 80, 1.5),
    g('translate(60 14)', O2(0, 0, 7)), g('translate(14 98)', rect(-12, -6, 24, 12, C.brown, 6, C.ink, 1.4), circle(10, 0, 5, C.tan, C.ink, 1)), therm(108, 100, 26, 0.85)),
  /** antändningstemperatur: a thermometer whose marked level (230) is linked to a sheet of paper catching fire; lower down it does not burn. */
  'reak.antändningstemperatur': all(ground(), rect(20, 10, 18, 94, C.white, 7, C.ink, 1.6), rect(26, 30, 6, 72, HOT, 2, null), circle(29, 102, 8, HOT, C.ink, 1.4),
    line(range(9).map((i) => `M38 ${18 + i * 9} l4 0`).join(' '), C.ink, 1), line('M16 30 L42 30', HL, 2.6), num(8, 26, '230', 7, HL),
    line('M44 30 L70 30', HL, 1.6, '3 2'), rect(74, 26, 30, 36, C.white, 1, C.ink, 1.4), flame(96, 30, 0.9), path('M74 38 C80 36 84 40 90 34', 'none', '#6b4a2a', 1.6),
    greyed(line('M44 78 L70 78', C.grey, 1.4, '3 2'), rect(74, 70, 30, 36, C.white, 1, C.ink, 1.4)), ring(89, 44, 24)),
  /** kväva (eld): a burning pan on the stove; an orange lid is put on and the flames shrink. */
  'reak.kväva': all(ground(), rect(14, 92, 92, 20, '#e6e8ea', 2, C.ink, 1.6), rect(28, 76, 64, 16, C.dark, 3, C.ink, 1.6), line('M92 82 L112 80', C.dark, 4),
    flame(48, 78, 0.7), flame(60, 78, 0.6), flame(72, 78, 0.7),
    path('M24 56 C24 44 96 44 96 56 Z', HL, C.ink, 1.6), rect(54, 40, 12, 6, C.dark, 2, C.ink, 1), arrow(60, 22, 60, 36, HL, 3)),

  // ── 3435 Oxidation och reduktion ────────────────────────────────
  /** oxidation: a shiny nail → a rusty nail; an oxygen ball goes in (arrow down, into the reaction). */
  'reak.oxidation': redoxRow(true),
  /** reduktion (kemi): rusty ore → shiny metal bar; the oxygen ball leaves (arrow up, out of the reaction). */
  'reak.reduktion.2': redoxRow(false),
  /** svartna: a bright silver spoon (greyed) → after many days (calendar 30) the same spoon is black, ringed. */
  'reak.svartna': all(ground(), greyed(spoon(24, 50, C.silver)), rx(44, 60, 66), rect(46, 30, 18, 18, C.white, 2, C.ink, 1.2), rect(46, 30, 18, 5, HOT, 1, null), num(55, 45, '30', 8),
    spoon(90, 50, '#3a3a40'), ring(90, 60, 26)),
  /** antioxidant: two apple halves after an hour – the plain one has turned brown (grey), the one with lemon juice is still white; the lemon is ringed. */
  'reak.antioxidant': all(ground(), greyed(appleHalf(28, 80, '#b88a4a')), appleHalf(88, 80, '#fbf3dc'), lemonHalf(92, 30), drop(90, 48, 1.2, '#f7e27a'), drop(98, 54, 1, '#f7e27a'), ring(92, 30, 18)),

  // ── 3436 Fällningsreaktioner ────────────────────────────────────
  /** fällning: two clear liquids poured together; a white solid sinks and settles on the bottom, ringed. */
  'reak.fällning': all(ground(), bottle(24, 30, 50, '#dff0fa'), bottle(96, 30, -50, '#f4f0d0'), drop(42, 44, 1, '#dff0fa'), drop(78, 44, 1, '#f4f0d0'),
    glass(60, 110, 44, 56, 0.8, '#e9f4fb'), ...range(14).map((i) => circle(f1(44 + (i * 11) % 32), f1(72 + ((i * 7) % 20)), 1.6, C.white, C.grey, 0.6)),
    path('M40 108 C46 100 74 100 80 108 Z', C.white, C.ink, 1.2), ring(60, 102, 16)),
  /** löslig: a sugar cube in water → after stirring it is gone and the water is clear (framed). */
  'reak.löslig': dissolveRow(true),
  /** svårlöslig: a lump of chalk in water → after stirring it is still lying on the bottom (framed). */
  'reak.svårlöslig': dissolveRow(false),
  /** klar (om vätska): stripes behind two glasses – seen through the clear water (framed), hidden by the grey cloudy liquid. */
  'reak.klar.2': all(ground(), line(range(5).map((i) => `M6 ${56 + i * 10} L114 ${56 + i * 10}`).join(' '), '#5f7fd1', 3),
    glass(30, 110, 36, 64, 0.9, '#d6d2ca'), ...range(12).map((i) => circle(f1(16 + (i * 7) % 28), f1(56 + ((i * 11) % 48)), 1.2, '#b9b2a4', null)), glass(90, 110, 36, 64, 0.9, 'rgba(223,240,250,0.45)'), line(range(5).map((i) => `M73 ${56 + i * 10} L107 ${56 + i * 10}`).join(' '), '#7f9be0', 3), frame(68, 40, 44, 72)),
  /** avkalka: an electric kettle with a white crust; a bottle pours in → the same kettle clean inside. */
  'reak.avkalka': all(ground(), greyed(kettle(28, 106, true)), bottle(30, 44, 120, '#f4f0d0'), drop(28, 56, 1, '#f4f0d0'), rx(52, 84, 64), kettle(92, 106, false), sparkle(108, 54, 5), frame(70, 50, 46, 62)),
  /** droppsten: a cave with stone icicles from the ceiling and stone cones from the floor; a drop falls; one icicle is ringed. */
  'reak.droppsten': all(rect(0, 0, 120, 120, '#5c5048', 0, null), path('M0 0 L120 0 L120 18 C100 22 80 14 60 20 C40 26 20 16 0 20 Z', caveRock, C.ink, 1.4),
    path('M20 18 L24 50 L28 18 Z M44 22 L48 64 L53 22 Z M70 18 L73 44 L77 18 Z M92 16 L96 56 L100 16 Z', caveRock, C.ink, 1.2),
    path('M0 112 L120 112 L120 120 L0 120 Z', caveRock, null), path('M38 112 L48 80 L58 112 Z M84 112 L95 72 L106 112 Z M10 112 L16 96 L22 112 Z', caveRock, C.ink, 1.2),
    drop(96, 64, 1.1, '#bfe3f5'), ring(48, 44, 16)),
  /** tillsätta (ämne): a small bottle pours drops into a beaker of liquid; orange arrow. */
  'reak.tillsätta.2': all(ground(), glass(60, 110, 50, 54, 0.6, '#dff0fa'), bottle(84, 30, -60, '#f6d2a8'), drop(72, 46, 1.2, '#f6a35b'), drop(68, 56, 1, '#f6a35b'), circle(64, 76, 6, '#f8c08a', null),
    arrow(100, 18, 76, 50, HL, 2.6)),

  // ── 3437 Reaktionshastighet ─────────────────────────────────────
  /** reaktionshastighet: two glasses with tablets – the grey one bubbles slowly (gauge low), the framed one fast (gauge high). */
  'reak.reaktionshastighet': all(ground(), greyed(glass(28, 110, 34, 46), rect(22, 102, 12, 5, C.white, 1, C.ink, 1), bubbles(28, 88, [[-4, 6], [4, -4]], 1.6), gauge(28, 46, 16, 25, C.grey)),
    glass(90, 110, 34, 46), rect(84, 102, 12, 5, C.white, 1, C.ink, 1), bubbles(90, 86, [[-10, 12], [-4, 4], [4, 8], [10, 0], [-8, -6], [2, -10], [8, -16], [-2, -18], [10, 14], [-12, -2]], 1.8),
    gauge(90, 46, 16, 160), frame(70, 26, 40, 86)),
  /** katalysator: the exhaust pipe under a car with a box cut open (honeycomb inside, ringed); dark gas in, light gas out. */
  'reak.katalysator': all(ground(), car(60, 50, 1.8, C.grey2),
    line('M10 66 L44 66 M76 66 L112 66', C.dark, 4), rect(44, 56, 32, 20, C.silver, 4, C.ink, 1.6),
    ...range(4).flatMap((i) => range(3).map((j) => rect(47 + i * 7, 59 + j * 5.4, 6, 4.4, C.white, 0.6, C.grey, 0.6))),
    smoke(22, 84, 0.8, C.dark), arrow(34, 82, 44, 74, C.dark, 2), smoke(100, 86, 0.7, '#e9eef2'), arrow(78, 74, 88, 82, C.grey, 2), ring(60, 66, 20)),
  /** kontaktyta: one big cube (grey) against the same cube cut into many small cubes whose faces are all orange. */
  'reak.kontaktyta': all(ground(), greyed(rect(10, 70, 36, 36, C.white, 1, C.ink, 1.6), path('M10 70 L20 60 L56 60 L46 70 Z M46 70 L56 60 L56 96 L46 106 Z', C.grey2, C.ink, 1.4)),
    ...range(3).flatMap((i) => range(3).map((j) => g(`translate(${68 + i * 15} ${70 + j * 13})`, rect(0, 0, 10, 10, '#ffd2b0', 1, HL, 1.6), path('M0 0 L3 -3 L13 -3 L10 0 Z M10 0 L13 -3 L13 7 L10 10 Z', '#f6a35b', HL, 1)))),
    arrow(52, 50, 70, 50, C.grey, 2.4)),
  /** aktiveringsenergi: an energy hill – a ball at the low start must be pushed over the top; the height up to the top is an orange double arrow. */
  'reak.aktiveringsenergi': all(ground(), line('M10 16 L10 108 L114 108', C.ink, 1.6),
    path('M10 80 L34 80 C46 80 50 26 62 26 C74 26 80 94 92 94 L112 94', 'none', C.dark, 2.6), circle(28, 74, 6, C.yellow, C.ink, 1.3),
    line('M22 80 L22 26 L62 26', C.grey, 1, '2 2'), arrow(22, 70, 22, 32, HL, 2.6), arrow(22, 36, 22, 76, HL, 2.6), arc2()),
  /** explosion: a big orange and yellow blast with pieces flying out and smoke. */
  'reak.explosion': all(ground(), smoke(30, 86, 1.4, C.grey2), smoke(92, 88, 1.3, C.grey2),
    path(range(16).map((i) => { const a = (i * Math.PI) / 8, r = i % 2 ? 22 : 44; return `${i ? 'L' : 'M'}${f1(60 + Math.cos(a) * r)} ${f1(62 + Math.sin(a) * r)}`; }).join(' ') + ' Z', C.orange, C.ink, 1.6),
    path(range(16).map((i) => { const a = (i * Math.PI) / 8 + 0.2, r = i % 2 ? 12 : 26; return `${i ? 'L' : 'M'}${f1(60 + Math.cos(a) * r)} ${f1(62 + Math.sin(a) * r)}`; }).join(' ') + ' Z', C.yellow, null),
    rect(12, 18, 7, 5, C.dark, 1, null), rect(102, 24, 6, 6, C.dark, 1, null), rect(14, 100, 6, 4, C.dark, 1, null), rect(104, 98, 7, 4, C.dark, 1, null)),
};

/** Small curved push arrow behind the ball (aktiveringsenergi). */
function arc2(): Svg { return all(path('M16 66 C20 60 26 60 30 62', 'none', C.grey, 1.6)); }
