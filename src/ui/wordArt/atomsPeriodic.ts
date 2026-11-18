/**
 * Matematik & naturvetenskap → Kemi → Atomer & periodiska systemet, 3411–3417 (0.51): the parts of the atom,
 * the elements, atomic number and mass number, the groups of the periodic table, metals and non-metals,
 * isotopes, electron shells and valence electrons.
 * Recurring signs (as in modernPhysics.ts): protons are red balls with +, neutrons grey balls, electrons small
 * blue balls with −. The part the word names is orange (ring, frame, arrow or cells) and a grey reference shows
 * what the word is not. Close words share one layout where only the marked part differs:
 * positiv/negativ laddning (the same big ball: red with + or blue with −); grupp/period/alkalimetall/halogen/
 * övergångsmetall/icke-metall/halvmetall (the same periodic-table outline: one column, one row, the first
 * column, column 17, the middle block, the upper right corner or the staircase marked); stabil/instabil (the same nucleus before and after a
 * clock: unchanged, or split with rays); avge/ta upp (the same atom: an electron leaves, or arrives).
 * Element names are everyday scenes (balloon gas, hot spring, swimming pool, solar panel, foil, rings).
 * Digits, maths signs and chemical symbols that do not spell the word only; no words, no brands, no logos.
 */
import { C, all, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { HL, T, globe } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const SOFT = '#f4f6f8';
const MARK = '#fff3b0';
const PRO = '#e85a5a';
const NEU = '#a9b1ba';
const ELE = '#3a8ae8';
const WATER = 'rgba(140,199,232,0.55)';
const SULF = '#f2d43a';
const ALU = '#d5dbe0';
const GOLD = '#e8b923';
const SILV = '#cfd6dc';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ground = line('M4 112 L116 112', C.grey2, 2);
const bg = (col: string = SOFT) => rect(4, 4, 112, 108, col, 3, null);
const ring = (x: number, y: number, r: number, col: string = HL, sw = 2.4) => circle(x, y, r, 'none', col, sw);

/** Arrowhead with its tip at (x, y), pointing along angle a (radians). */
const head = (x: number, y: number, a: number, col: string, s = 1) => {
  const L = 7 * s, W = 4 * s, c = Math.cos(a), si = Math.sin(a);
  return path(`M${f1(x)} ${f1(y)} L${f1(x - L * c + W * si)} ${f1(y - L * si - W * c)} L${f1(x - L * c - W * si)} ${f1(y - L * si + W * c)} Z`, col, null);
};
const arr = (x1: number, y1: number, x2: number, y2: number, col: string = HL, sw = 3, dash?: string) => all(line(`M${x1} ${y1} L${x2} ${y2}`, col, sw, dash), head(x2, y2, Math.atan2(y2 - y1, x2 - x1), col, sw / 3 + 0.3));

// ── Particles and atoms ──────────────────────────────────────────────
const proton = (x: number, y: number, r = 5) => all(circle(x, y, r, PRO, C.ink, 1), r >= 4 ? T(x, y + r * 0.45, '+', r * 1.3, C.white) : '');
const neutron = (x: number, y: number, r = 5) => circle(x, y, r, NEU, C.ink, 1);
const electron = (x: number, y: number, r = 3.4, col: string = ELE) => all(circle(x, y, r, col, C.ink, 1), r >= 3 ? line(`M${f1(x - r * 0.5)} ${y} L${f1(x + r * 0.5)} ${y}`, C.white, 1.1) : '');
/** Positions of the balls in a round cluster of k balls. */
const cluster = (x: number, y: number, k: number, r: number) => range(k).map((i) => { const d = i === 0 ? 0 : Math.sqrt(i) * r * 0.95, a = i * 2.4; return [f1(x + d * Math.cos(a)), f1(y + d * Math.sin(a))] as const; });
/** A round cluster of p protons and n neutrons (alternating). */
const nucleus = (x: number, y: number, p: number, n: number, r = 5) => {
  const kinds: boolean[] = []; let pp = p, nn = n;
  while (pp + nn > 0) { if (pp > 0 && (pp >= nn || kinds.length % 2 === 0)) { kinds.push(true); pp--; } else { kinds.push(false); nn--; } }
  const pos = cluster(x, y, kinds.length, r);
  return all(...kinds.map((isP, i) => (isP ? proton(pos[i]![0], pos[i]![1], r) : neutron(pos[i]![0], pos[i]![1], r))));
};
/** Dashed empty circle (a free place for an electron). */
const hole = (x: number, y: number, r = 3.4) => line(`M${f1(x - r)} ${y} A${r} ${r} 0 1 0 ${f1(x + r)} ${y} A${r} ${r} 0 1 0 ${f1(x - r)} ${y}`, C.grey, 1.2, '2 1.6');
/** Shell atom: nucleus and rings (radii rs) with the given electron counts; `gap` adds one empty place on the outer ring at angle gapAt. */
const shellAtom = (x: number, y: number, counts: number[], rs: number[] = [16, 29, 42], o: { mark?: number; gap?: boolean; gapAt?: number } = {}) => all(
  ...counts.map((_, i) => circle(x, y, rs[i]!, 'none', o.mark === i ? HL : C.grey, o.mark === i ? 3.4 : 1.4)),
  nucleus(x, y, 3, 3, 3.2),
  ...counts.flatMap((c, i) => {
    const last = i === counts.length - 1, slots = o.gap && last ? c + 1 : c;
    const base = o.gap && last ? (o.gapAt ?? 0) - (c / slots) * Math.PI * 2 : -Math.PI / 2 + i * 0.4;
    return range(slots).map((j) => {
      const a = base + (j / slots) * Math.PI * 2, ex = f1(x + rs[i]! * Math.cos(a)), ey = f1(y + rs[i]! * Math.sin(a));
      return j === c ? hole(ex, ey) : electron(ex, ey, 3.2);
    });
  }),
);

// ── Periodic table outline ───────────────────────────────────────────
/** Rows that column c has in the 18-column table (rows 0–6). */
const rowsOf = (c: number) => (c === 0 || c === 17 ? [0, 1, 2, 3, 4, 5, 6] : c === 1 || c >= 12 ? [1, 2, 3, 4, 5, 6] : [3, 4, 5, 6]);
/** Periodic table outline; cells for which mark(c, r) is true are filled orange, the rest light grey. */
const ptable = (x0: number, y0: number, cw: number, ch: number, mark: (c: number, r: number) => boolean) => all(...range(18).flatMap((c) => rowsOf(c).map((r) => {
  const m = mark(c, r);
  return rect(f1(x0 + c * cw), f1(y0 + r * ch), f1(cw - 0.8), f1(ch - 0.8), m ? '#ffb27a' : '#e2e6ea', 0.6, m ? HL : C.grey, m ? 0.9 : 0.5);
})));
/** Standard placement: the table fills the top of the picture. */
const PT = (mark: (c: number, r: number) => boolean) => ptable(9, 12, 5.7, 7.2, mark);
/** Cells left of / on the staircase between metals and non-metals (B, Si, Ge, As, Sb, Te). */
const STAIR: [number, number][] = [[12, 1], [13, 2], [13, 3], [14, 3], [14, 4], [15, 4]];
const isStair = (c: number, r: number) => STAIR.some(([a, b]) => a === c && b === r);
const isNonMetal = (c: number, r: number) => (c === 0 && r === 0) || (c === 17) || (c === 13 && r === 1) || (c === 14 && r <= 2) || (c === 15 && r <= 3) || (c === 16 && r <= 4);

// ── Things ───────────────────────────────────────────────────────────
const bubbles = (pts: [number, number, number][]) => all(...pts.map(([x, y, r]) => circle(x, y, r, 'rgba(255,255,255,0.8)', '#5aa7d6', 0.9)));
/** A water dish (seen from the side) from x to x + w with the water surface at y. */
const dish = (x: number, y: number, w: number, h = 22) => all(rect(x, y - 4, w, h + 4, WATER, 3, null), path(`M${x} ${y - 8} L${x} ${y + h} L${x + w} ${y + h} L${x + w} ${y - 8}`, 'none', C.ink, 1.8));
const clock = (x: number, y: number, r = 8) => all(circle(x, y, r, C.white, C.ink, 1.6), line(`M${x} ${y} L${x} ${y - r * 0.7} M${x} ${y} L${x + r * 0.55} ${y + r * 0.2}`, C.ink, 1.6));
const glass = (x: number, y: number, w = 30, h = 46) => all(path(`M${x - w / 2} ${y - h} L${x + w / 2} ${y - h} L${x + w / 2 - 3} ${y} L${x - w / 2 + 3} ${y} Z`, 'rgba(220,240,252,0.5)', C.ink, 1.8), path(`M${x - w / 2 + 0.6} ${y - h + 10} L${x + w / 2 - 0.6} ${y - h + 10} L${x + w / 2 - 3} ${y} L${x - w / 2 + 3} ${y} Z`, WATER, null));
const ice = (x: number, y: number, s = 12) => all(rect(x - s / 2, y - s / 2, s, s, 'rgba(235,248,255,0.95)', 2, '#5aa7d6', 1.4), line(`M${x - s / 4} ${y - s / 4} L${x} ${y - s / 4}`, C.white, 1.4));
/** A balloon on a string from (x, y) down to (x + dx, y2). */
const balloon = (x: number, y: number, col: string, y2: number, dx = 0) => all(path(`M${x} ${y + 12} C${x - 3} ${y + 22} ${x + dx + 3} ${y2 - 10} ${x + dx} ${y2}`, 'none', C.ink, 1), ellipse(x, y, 9, 11, col, C.ink, 1.4), path(`M${x - 2} ${y + 11} L${x + 2} ${y + 11} L${x} ${y + 14} Z`, col, C.ink, 1), ellipse(x - 3, y - 4, 2, 3, 'rgba(255,255,255,0.6)', null));
const stink = (x: number, y: number, col = '#9bbf3a') => all(...[0, 7, 14].map((d) => path(`M${x + d} ${y} C${x + d - 4} ${y - 5} ${x + d + 4} ${y - 9} ${x + d} ${y - 14}`, 'none', col, 2)));
const ringJewel = (x: number, y: number, col: string, dark: string) => all(ellipse(x, y, 11, 9, 'none', dark, 5.6), ellipse(x, y, 11, 9, 'none', col, 3.6), path(`M${x - 4} ${y - 9} L${x} ${y - 15} L${x + 4} ${y - 9} Z`, '#dff4ff', C.ink, 1));
const bar = (x: number, y: number, col: string, dark: string) => all(path(`M${x - 16} ${y + 6} L${x - 11} ${y - 6} L${x + 11} ${y - 6} L${x + 16} ${y + 6} Z`, col, dark, 1.6), line(`M${x - 9} ${y - 3} L${x + 7} ${y - 3}`, 'rgba(255,255,255,0.7)', 1.6));
const medal = (x: number, y: number, col: string, dark: string, n: string) => all(path(`M${x - 6} ${y - 30} L${x} ${y - 12} L${x + 6} ${y - 30}`, 'none', C.red, 3), circle(x, y, 11, col, dark, 2), circle(x, y, 7.5, 'none', dark, 1), T(x, y + 4.5, n, 12, dark));
/** Drink can. */
const can = (x: number, y: number, col: string = ALU) => all(rect(x - 9, y - 30, 18, 30, col, 3, C.ink, 1.6), ellipse(x, y - 30, 9, 2.4, '#eef1f4', C.ink, 1.2), line(`M${x - 5} ${y - 26} L${x - 5} ${y - 4}`, 'rgba(255,255,255,0.8)', 2));
/** Grey gas cylinder with a valve on top. */
const cylinder = (x: number, y: number, col = '#8fb3d9') => all(rect(x - 10, y - 50, 20, 50, col, 9, C.ink, 1.8), rect(x - 4, y - 58, 8, 8, C.dark, 1, C.ink, 1.2), line(`M${x + 4} ${y - 54} L${x + 12} ${y - 54}`, C.dark, 3));
const tile = (x: number, y: number, sym: string, num: string, o: { markSym?: boolean; w?: number } = {}) => {
  const w = o.w ?? 30;
  return all(rect(x - w / 2, y - w / 2 - 4, w, w + 8, C.white, 3, C.ink, 1.8), T(x - w / 2 + 6, y - w / 2 + 6, num, 7, C.grey), o.markSym ? rect(x - w / 2 + 3, y - 9, w - 6, 20, MARK, 3, HL, 2.2) : '', T(x, y + 7, sym, 17));
};
const seaweed = (x: number, y: number) => all(path(`M${x} ${y} C${x - 8} ${y - 14} ${x + 8} ${y - 26} ${x - 2} ${y - 42} C${x + 6} ${y - 28} ${x + 14} ${y - 14} ${x + 6} ${y} Z`, '#3d6b3a', C.ink, 1.4));
const fish = (x: number, y: number, s = 1) => at(x, y, s, path('M-14 0 C-6 -9 8 -9 12 0 C8 9 -6 9 -14 0 Z', '#7fa7c9', C.ink, 1.4), path('M12 0 L20 -7 L20 7 Z', '#7fa7c9', C.ink, 1.4), circle(-8, -2, 1.4, C.ink, null));
const shaker = (x: number, y: number) => all(path(`M${x - 8} ${y} L${x - 6} ${y - 22} L${x + 6} ${y - 22} L${x + 8} ${y} Z`, C.white, C.ink, 1.6), rect(x - 7, y - 28, 14, 6, C.silver, 2, C.ink, 1.2), ...[-3, 0, 3].map((d) => circle(x + d, y - 26, 0.8, C.ink, null)));
const flame = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 C-8 -4 -7 -14 0 -22 C2 -14 9 -10 6 -2 C5 0 2 1 0 0 Z', '#ff8a2a', '#d4541a', 1.2), path('M0 -2 C-3 -5 -2 -10 1 -13 C3 -9 4 -5 2 -2 Z', '#ffe066', null));

export const ATOMS_MOTIFS: Record<string, Svg> = {
  // ── 3411 Atomens grunddelar ───────────────────────────────────────────
  /** byggsten: a toy house built of identical square blocks; one more block hangs above the house, ringed in orange, with a dashed arrow to the empty place in the wall where it fits. */
  'atom.byggsten': all(bg('#eef4f8'), ground, path('M22 54 L60 26 L98 54 Z', '#d86a4a', C.ink, 1.8),
    ...range(4).flatMap((r) => range(6).map((c) => (r === 1 && c === 4 ? '' : rect(24 + c * 12, 56 + r * 14, 12, 14, ['#f2c14e', '#8cc7e8', '#a8dcc0', '#ef9fb5'][(r + c) % 4]!, 1.5, C.ink, 1.3)))),
    rect(72, 70, 12, 14, 'none', 2, C.grey, 1.2), rect(92, 30, 12, 14, '#f2c14e', 1.5, C.ink, 1.4), ring(98, 37, 12), arr(96, 48, 82, 64, C.grey, 1.6, '3 2')),
  /** elektronhölje: a big atom: the small nucleus in the middle is grey; the whole round region around it, where the electrons move on their rings, is filled yellow and outlined in orange. */
  'atom.elektronhölje': all(bg(), circle(60, 58, 48, MARK, HL, 3), circle(60, 58, 12, '#e8eaee', C.grey, 1.4), circle(60, 58, 26, 'none', '#d9b84a', 1.2), circle(60, 58, 40, 'none', '#d9b84a', 1.2),
    greyed(nucleus(60, 58, 3, 3, 3.2)), ...[[60, 32], [86, 58], [34, 58], [32, 30], [92, 82], [60, 98], [28, 80], [94, 34]].map(([x, y]) => electron(x!, y!, 3.6))),
  /** nukleon: a big nucleus of red protons and grey neutrons where every single ball has its own small orange ring; two electrons outside are grey. */
  'atom.nukleon': all(bg(), ...cluster(60, 58, 8, 15).map(([x, y], i) => all(i % 2 ? neutron(x, y, 8) : proton(x, y, 8), ring(x, y, 10.5, HL, 2))), greyed(circle(60, 58, 50, 'none', C.ink, 1.2), electron(16, 40, 4), electron(104, 80, 4))),
  /** kretsa: the Moon goes round the Earth: a dashed oval path around a blue Earth, the Moon on the path, and three orange arrows following the path all the way round. */
  'atom.kretsa': all(bg('#1f2740'), ...[[12, 14], [30, 100], [104, 16], [98, 104], [16, 64], [108, 60]].map(([x, y]) => circle(x!, y!, 1.2, C.white, null)), globe(60, 60, 16),
    ellipse(60, 60, 46, 30, 'none', 'rgba(255,255,255,0.5)', 1.4), ellipse(60, 60, 46, 30, 'none', HL, 2.6),
    head(24, 78, 2.6, HL, 1.3), head(96, 42, -0.55, HL, 1.3), head(60, 30, 0, HL, 1.3), circle(104, 62, 8, '#e3e3d8', C.ink, 1.4), circle(102, 60, 1.6, '#c9c9bc', null)),
  /** positiv laddning: one big red ball with a white + in the middle, framed in orange; a small grey electron (−) waits to the side. */
  'atom.positiv-laddning': all(bg(), rect(18, 20, 64, 76, MARK, 8, HL, 3), circle(50, 58, 26, PRO, C.ink, 2), line('M38 58 L62 58 M50 46 L50 70', C.white, 6), greyed(electron(100, 58, 10))),
  /** negativ laddning: the same layout: one big blue ball with a white − in the middle, framed in orange; a small grey proton (+) waits to the side. */
  'atom.negativ-laddning': all(bg(), rect(18, 20, 64, 76, MARK, 8, HL, 3), circle(50, 58, 26, ELE, C.ink, 2), line('M38 58 L62 58', C.white, 6), greyed(proton(100, 58, 10))),

  // ── 3412 Grundämnen ──────────────────────────────────────────────────
  /** helium: a light-blue gas cylinder fills a balloon through its valve; three filled balloons float up and press against the ceiling; a grey balloon of ordinary air lies on the floor. */
  'atom.helium': all(bg('#f3efe6'), rect(4, 4, 112, 6, C.grey2, 0, null), ground, cylinder(26, 112), balloon(46, 46, '#f28fb6', 58, -8), arr(40, 40, 44, 22, C.grey, 1.4),
    balloon(66, 22, '#8cc7e8', 64, 4), balloon(86, 22, '#f2c14e', 70, -2), balloon(104, 22, '#a8dcc0', 66, -4), greyed(ellipse(94, 104, 10, 7, '#ef9fb5', C.ink, 1.4))),
  /** svavel: a steaming hot spring among rocks; bright yellow crusts and crystals cover the stones at its edge, ringed in orange; green smell lines rise. */
  'atom.svavel': all(bg('#e6eef2'), rect(4, 76, 112, 36, '#a8a091', 0, null), ellipse(56, 84, 36, 9, '#9fd0d8', C.ink, 1.6), ...[[30, 60], [52, 52], [74, 58]].map(([x, y]) => path(`M${x} ${y! + 14} C${x! - 6} ${y! + 6} ${x! + 6} ${y! - 2} ${x} ${y! - 10}`, 'none', 'rgba(255,255,255,0.9)', 3)),
    path('M86 96 L90 82 L98 78 L108 84 L110 98 Z', '#8a8275', C.ink, 1.4), path('M88 90 L94 80 L100 84 L98 92 Z M100 92 L104 84 L110 90 L108 98 Z', SULF, C.ink, 1.2), path('M10 100 L16 88 L28 90 L30 102 Z', '#8a8275', C.ink, 1.4), path('M14 94 L18 88 L26 92 L22 98 Z', SULF, C.ink, 1.2),
    ...[[94, 74], [104, 76], [18, 84]].map(([x, y]) => path(`M${x} ${y} l3 -7 l3 7 Z`, SULF, C.ink, 1)), ring(98, 88, 16), stink(88, 60), stink(12, 72)),
  /** klor: an indoor swimming pool with a swimmer; at the edge a white canister with a yellow-green cloud rising from the water near it, ringed in orange. */
  'atom.klor': all(bg('#e8f1f4'), rect(4, 66, 112, 46, '#4fb3d9', 0, null), ...[72, 84, 96].map((y) => line(`M8 ${y} C30 ${y - 3} 50 ${y + 3} 70 ${y} S100 ${y - 3} 112 ${y}`, 'rgba(255,255,255,0.6)', 1.4)), rect(4, 58, 112, 8, '#e9ecef', 0, C.ink, 1.2),
    circle(80, 84, 6, C.skin, C.ink, 1.2), path('M74 82 C76 74 84 74 86 82 Z', '#3a3f9e', null), line('M70 92 L60 86 M90 92 L100 86', C.skin, 3), rect(18, 36, 18, 22, C.white, 3, C.ink, 1.6), rect(23, 30, 8, 6, '#2f9e5a', 1, C.ink, 1.2),
    ellipse(44, 46, 14, 9, 'rgba(190,220,80,0.55)', null), ellipse(54, 38, 10, 7, 'rgba(190,220,80,0.45)', null), ellipse(36, 70, 10, 4, 'rgba(190,220,80,0.6)', null), ring(42, 50, 22)),
  /** jod: a small brown glass bottle with a dropper lets a brown drop fall, ringed in orange; around it a strip of seaweed, a fish and a salt shaker — the food where the element is found. */
  'atom.jod': all(bg('#f3efe6'), ground, rect(46, 66, 24, 40, '#7a3d12', 4, C.ink, 1.8), rect(50, 56, 16, 10, C.dark, 2, C.ink, 1.2), path('M58 56 C58 40 64 36 66 30', 'none', C.ink, 1.6), ellipse(66, 28, 4, 3, C.dark, null),
    path('M66 36 C69 40 69 44 66 44 C63 44 63 40 66 36 Z', '#8a3a0a', C.ink, 1), ring(58, 84, 20), rect(50, 78, 16, 12, '#f3e2c8', 1, null), seaweed(18, 108), fish(98, 54, 1), shaker(98, 108)),
  /** kisel: a pile of light sand on the ground, a blue solar panel tilted on a stand and a small square computer chip with legs, ringed in orange. */
  'atom.kisel': all(bg('#e4f1fa'), ground, path('M8 112 C14 96 34 92 44 112 Z', '#e8d29a', C.ink, 1.4), ...range(10).map((i) => circle(f1(14 + ((i * 13) % 26)), f1(106 - ((i * 7) % 10)), 0.9, '#b89a5a', null)),
    g('translate(78 66) skewX(-18)', rect(-24, -18, 44, 30, '#2d4f8f', 2, C.ink, 1.8), ...range(3).map((i) => line(`M${-24 + (i + 1) * 11} -18 L${-24 + (i + 1) * 11} 12`, '#8fb3e8', 1)), line('M-24 -3 L20 -3', '#8fb3e8', 1)), line('M80 78 L84 112', C.dark, 3),
    rect(44, 26, 20, 20, '#30343c', 2, C.ink, 1.6), rect(49, 31, 10, 10, '#9aa3ad', 1, null), ...range(4).flatMap((i) => [line(`M${47 + i * 4.6} 26 L${47 + i * 4.6} 21`, C.silver, 1.6), line(`M${47 + i * 4.6} 46 L${47 + i * 4.6} 51`, C.silver, 1.6)]), ring(54, 36, 18), sparkle(98, 20, 6, C.gold)),
  /** aluminium: a roll of shiny silver foil with a long sheet pulled out over a fish on a plate, and a silver drink can beside it. */
  'atom.aluminium': all(bg('#f3efe6'), rect(8, 84, 104, 6, C.tan, 2, C.ink, 1.6), line('M16 90 L16 112 M104 90 L104 112', C.brown, 3), rect(12, 50, 44, 14, ALU, 6, C.ink, 1.6), ellipse(12, 57, 4, 7, '#eef1f4', C.ink, 1.2), circle(12, 57, 2, '#a07a4a', null),
    path('M40 64 L56 64 L78 82 L44 82 Z', ALU, C.ink, 1.4), line('M48 70 L64 80 M52 66 L70 80', 'rgba(255,255,255,0.9)', 1.4), ellipse(60, 84, 22, 3, C.white, C.ink, 1), can(96, 84), sparkle(30, 40, 4, C.white), sparkle(74, 66, 3, C.white)),
  /** guld: gold things: a bright yellow ring, a stack of yellow bars and a medal with the number 1, all glowing with sparkles. */
  'atom.guld': all(bg('#fbf4e2'), rect(4, 96, 112, 16, '#5a3b2a', 0, null), bar(36, 92, GOLD, '#a87a10'), bar(52, 92, GOLD, '#a87a10'), bar(44, 80, GOLD, '#a87a10'), ringJewel(88, 84, GOLD, '#a87a10'), medal(60, 46, GOLD, '#a87a10', '1'), sparkle(28, 66, 5, C.gold), sparkle(102, 64, 4, C.gold), sparkle(80, 30, 4, C.gold)),
  /** silver: the same things in white-grey: a silver ring, a stack of silver bars and a medal with the number 2, with white sparkles. */
  'atom.silver': all(bg('#eef2f5'), rect(4, 96, 112, 16, '#3a4250', 0, null), bar(36, 92, SILV, '#7c8792'), bar(52, 92, SILV, '#7c8792'), bar(44, 80, SILV, '#7c8792'), ringJewel(88, 84, SILV, '#7c8792'), medal(60, 46, SILV, '#7c8792', '2'), sparkle(28, 66, 5, C.white), sparkle(102, 64, 4, C.white), sparkle(80, 30, 4, C.white)),

  // ── 3413 Atomnummer och masstal ──────────────────────────────────────
  /** kemiskt tecken: three tiles from the periodic table with H, C and O; in each tile the big letter is framed in orange, while the small number in the corner stays grey. */
  'atom.kemiskt-tecken': all(bg(), tile(24, 60, 'H', '1', { markSym: true }), tile(60, 60, 'C', '6', { markSym: true }), tile(96, 60, 'O', '8', { markSym: true })),
  /** lika många: top, four red + balls each joined by a line to four blue − balls, with an orange = sign; below, in grey, three red against five blue that do not match. */
  'atom.lika-många': all(bg(), rect(8, 12, 104, 54, MARK, 5, HL, 2.6), ...range(4).map((i) => all(line(`M${24 + i * 24} 28 L${24 + i * 24} 52`, HL, 1.6, '3 2'), proton(24 + i * 24, 24, 7), electron(24 + i * 24, 56, 6))),
    greyed(...range(3).map((i) => proton(30 + i * 30, 80, 6)), ...range(5).map((i) => electron(16 + i * 22, 100, 5))), T(60, 46, '=', 18, HL)),
  /** atommassa: a balance scale: one atom (a small nucleus with an electron) in the left pan balances small weights in the right pan; above, a tile shows the decimal number 12,01 framed in orange. */
  'atom.atommassa': all(bg(), rect(56, 70, 8, 38, C.dark, 1, C.ink, 1.2), rect(40, 106, 40, 6, C.dark, 1, C.ink, 1.2), line('M22 70 L98 70', C.ink, 3), circle(60, 70, 3, GOLD, C.ink, 1),
    line('M22 70 L12 90 M22 70 L32 90 M98 70 L88 90 M98 70 L108 90', C.ink, 1), path('M8 90 L36 90 C34 96 10 96 8 90 Z', C.silver, C.ink, 1.2), path('M84 90 L112 90 C110 96 86 96 84 90 Z', C.silver, C.ink, 1.2),
    nucleus(22, 82, 2, 2, 3), electron(30, 76, 2.4), ...[[92, 86], [98, 86], [104, 86], [95, 81], [101, 81]].map(([x, y]) => rect(x! - 2.6, y! - 2.6, 5.2, 5.2, '#7c8792', 1, C.ink, 0.8)),
    rect(30, 14, 60, 34, C.white, 3, C.ink, 1.8), rect(34, 18, 52, 26, MARK, 3, HL, 2.4), T(60, 38, '12,01', 16)),

  // ── 3414 Periodiska systemets grupper ────────────────────────────────
  /** grupp (i periodiska systemet): the periodic-table outline in grey; one whole column (column 14) is orange, with an orange arrow running down beside it. */
  'atom.grupp.2': all(bg(), PT((c) => c === 13), arr(92, 14, 92, 64, HL, 2.6)),
  /** period (i periodiska systemet): the same outline; one whole row (the fourth) is orange, with an orange arrow running from left to right under it. */
  'atom.period.2': all(bg(), PT((_, r) => r === 3), arr(10, 70, 110, 70, HL, 2.6)),
  /** reaktiv: two identical water dishes. In the left, grey, a lump lies quietly. In the right, a lump fizzes and spins: big bubbles, sparks and a little flame, all ringed in orange. */
  'atom.reaktiv': all(bg(), greyed(dish(8, 76, 44), ellipse(30, 74, 8, 4, C.silver, C.ink, 1.2)), dish(66, 76, 46), ellipse(89, 74, 8, 4, C.silver, C.ink, 1.2),
    bubbles([[80, 70, 3], [96, 68, 3.6], [86, 64, 2.4], [100, 76, 2.2], [76, 78, 2]]), flame(89, 66, 0.9), sparkle(74, 56, 4, C.gold), sparkle(104, 54, 4, C.gold), ring(89, 70, 24)),
  /** alkalimetall: the periodic-table outline with the first column (below hydrogen) orange; under it a small soft silver lump fizzing in a water dish. */
  'atom.alkalimetall': all(bg(), PT((c, r) => c === 0 && r > 0), dish(30, 96, 60, 12), ellipse(60, 94, 7, 3, C.silver, C.ink, 1.2), bubbles([[52, 92, 2.4], [68, 91, 3], [60, 88, 2]]), sparkle(74, 84, 3.4, C.gold), arr(12, 66, 44, 88, HL, 1.6, '3 2')),
  /** natrium: a salt shaker held upside down pours little white salt cubes onto a plate; beside it a soft silver metal block that a knife has cut straight through, its fresh cut shining, ringed in orange. */
  'atom.natrium': all(bg('#f3efe6'), rect(8, 92, 104, 6, C.tan, 2, C.ink, 1.6), line('M16 98 L16 112 M104 98 L104 112', C.brown, 3), g('rotate(150 26 50)', shaker(26, 60)), ...[[22, 70], [27, 76], [20, 80], [25, 86], [30, 88], [18, 90]].map(([x, y]) => rect(x!, y!, 2.6, 2.6, C.white, 0.4, C.grey, 0.6)), ellipse(24, 92, 12, 2, C.white, C.ink, 1),
    rect(54, 72, 22, 20, '#c3c9cf', 2, C.ink, 1.6), rect(82, 72, 22, 20, '#c3c9cf', 2, C.ink, 1.6), rect(76, 73, 6, 18, '#f4f7fa', 1, null), path('M76 36 L82 36 L82 70 L79 74 L76 70 Z', '#e6ebef', C.ink, 1.2), rect(75, 22, 8, 15, C.brown, 2, C.ink, 1.2), sparkle(79, 82, 3, C.white), ring(79, 80, 22)),
  /** halogen: the periodic-table outline with column 17 (next to the last) orange; under it a closed glass flask filled with a yellow-green gas. */
  'atom.halogen': all(bg(), PT((c) => c === 16), path('M54 70 L54 80 C40 84 38 108 60 108 C82 108 80 84 66 80 L66 70 Z', 'rgba(190,220,80,0.55)', C.ink, 1.6), rect(52, 66, 16, 5, C.tan, 1, C.ink, 1.2), arr(102, 62, 76, 82, HL, 1.6, '3 2')),
  /** övergångsmetall: the periodic-table outline with the low middle block orange; under it an iron pan, a copper pipe and a gold ring. */
  'atom.övergångsmetall': all(bg(), PT((c, r) => c >= 2 && c <= 11 && r >= 3), ellipse(28, 96, 16, 6, '#3d3f4a', C.ink, 1.6), line('M44 96 L58 92', C.dark, 3), rect(62, 90, 26, 8, '#d07a3a', 4, C.ink, 1.4), ringJewel(100, 96, GOLD, '#a87a10'), arr(60, 68, 60, 82, HL, 1.6, '3 2')),

  // ── 3415 Metaller och icke-metaller ──────────────────────────────────
  /** icke-metall: the periodic-table outline with the upper right corner (and hydrogen) orange; under it a dull yellow lump of sulphur and a black piece of coal; a shiny metal bar beside them is grey. */
  'atom.icke-metall': all(bg(), PT(isNonMetal), path('M30 104 L34 90 L46 86 L54 96 L50 106 Z', SULF, C.ink, 1.4), path('M60 106 L64 92 L76 90 L82 100 L76 108 Z', '#2e2e36', C.ink, 1.4), ellipse(56, 98, 32, 13, 'none', HL, 2.4), greyed(bar(100, 100, C.silver, C.ink))),
  /** halvmetall: the same outline with only the staircase cells between metals and non-metals orange; under it a grey crystal that shines but has a crack. */
  'atom.halvmetall': all(bg(), PT(isStair), path('M44 106 L48 88 L62 80 L76 88 L72 106 Z', '#8d97a6', C.ink, 1.6), path('M50 92 L60 84 L64 90 Z', '#e6edf5', null), line('M62 82 L58 94 L64 100 L60 106', C.ink, 1.6), sparkle(80, 82, 4, C.white), ellipse(60, 93, 24, 17, 'none', HL, 2.4)),
  /** lättmetall: a seesaw with two blocks of exactly the same size: the shiny silver block, ringed in orange, sits high up in the air with small feather-light lines; the grey block on the other end presses its side down to the ground. */
  'atom.lättmetall': all(bg('#e9f2f8'), ground, path('M52 112 L60 92 L68 112 Z', C.dark, C.ink, 1.6), line('M14 70 L106 106', C.brown, 5), g('rotate(21.4 26 66)', rect(14, 46, 24, 22, ALU, 3, C.ink, 1.8), line('M18 52 L32 52', 'rgba(255,255,255,0.9)', 2)), ring(24, 56, 20),
    ...[[10, 30], [24, 26], [38, 30]].map(([x, y]) => line(`M${x} ${y} l0 -8`, '#8fb3d9', 1.6)), greyed(g('rotate(21.4 94 100)', rect(82, 80, 24, 22, '#5a6068', 3, C.ink, 1.8))), sparkle(46, 40, 3, C.white)),

  // ── 3416 Isotoper ────────────────────────────────────────────────────
  /** deuterium: right, a hydrogen atom whose nucleus has one proton and one neutron, with the neutron ringed in orange and one electron around; left, grey, ordinary hydrogen with only one proton. */
  'atom.deuterium': all(bg(), greyed(circle(28, 60, 20, 'none', C.ink, 1.2), proton(28, 60, 7), electron(28, 40, 4)), circle(80, 60, 30, 'none', C.grey, 1.4), proton(72, 60, 9), neutron(89, 60, 9), ring(89, 60, 12), electron(80, 30, 5)),
  /** tungt vatten: two glasses of water: in the left, grey, the ice cube floats at the top; in the right the ice cube lies on the bottom, ringed in orange, with an orange arrow down. */
  'atom.tungt-vatten': all(bg(), ground, greyed(glass(32, 108), ice(32, 66)), glass(88, 108), ice(88, 100), ring(88, 100, 11), arr(88, 58, 88, 84, HL, 2.4)),
  /** stabil (om atomkärna): a nucleus on the left, an arrow with a clock, and on the right exactly the same nucleus again, whole and framed in orange. */
  'atom.stabil.2': all(bg(), nucleus(24, 60, 4, 4, 5), arr(42, 60, 70, 60, C.grey, 2), clock(56, 44), rect(76, 34, 38, 52, MARK, 6, HL, 2.6), nucleus(95, 60, 4, 4, 5)),
  /** instabil (om atomkärna): the same nucleus and clock; on the right the nucleus has broken into two pieces flying apart with orange rays and a flash, framed in orange. */
  'atom.instabil.2': all(bg(), nucleus(24, 60, 4, 4, 5), arr(42, 60, 70, 60, C.grey, 2), clock(56, 44), rect(76, 24, 38, 72, MARK, 6, HL, 2.6), nucleus(88, 44, 2, 2, 5), nucleus(102, 78, 2, 2, 5),
    ...[[-2.4, 0], [-0.6, 0], [0.9, 0], [2.4, 0]].map(([a]) => arr(f1(95 + Math.cos(a!) * 8), f1(60 + Math.sin(a!) * 8), f1(95 + Math.cos(a!) * 17), f1(60 + Math.sin(a!) * 17), HL, 1.8)), sparkle(95, 60, 5, C.gold)),
  /** uran: a nuclear power plant with a cooling tower and steam in the background; in front, a stack of small yellow fuel pellets standing in a row, ringed in orange, with a yellow radiation sign. */
  'atom.uran': all(bg('#e4f1fa'), ground, path('M64 112 C70 90 70 60 62 34 L96 34 C88 60 88 90 94 112 Z', '#cfd5db', C.ink, 1.6), ellipse(79, 26, 16, 8, C.white, C.grey, 1), ellipse(90, 16, 12, 6, C.white, C.grey, 1), rect(96, 76, 18, 36, '#b8c2cc', 1, C.ink, 1.4),
    ...range(4).map((i) => all(rect(18 + i * 9, 88, 8, 22, C.yellow, 2, C.ink, 1.2), ellipse(22 + i * 9, 88, 4, 1.6, '#f7dc7a', C.ink, 0.8))), ellipse(32, 98, 24, 13, 'none', HL, 2.4),
    circle(22, 34, 12, C.yellow, C.ink, 1.4), ...[0, 120, 240].map((r) => g(`translate(22 34) rotate(${r})`, path('M0 -2 L-4.6 -10 A10.5 10.5 0 0 1 4.6 -10 Z', C.black, null))), circle(22, 34, 1.8, C.black, null)),
  /** spårämne: a patient lies in a ring-shaped scanner; on a screen above, the body outline shows two bright orange spots where the substance has gathered; a syringe lies beside the bed. */
  'atom.spårämne': all(bg('#eef2f5'), ground, rect(14, 86, 70, 8, C.white, 2, C.ink, 1.6), line('M20 94 L20 112 M78 94 L78 112', C.dark, 3), ellipse(58, 76, 22, 26, 'none', '#cfd5db', 10), ellipse(58, 76, 22, 26, 'none', C.ink, 1.2),
    rect(18, 78, 60, 8, '#8cc7e8', 3, C.ink, 1.2), circle(22, 78, 6, C.skin, C.ink, 1.2), rect(84, 14, 30, 40, C.dark, 3, C.ink, 1.6), path('M99 20 C104 20 104 26 99 26 C94 26 94 20 99 20 Z M95 28 L103 28 L104 44 L101 44 L100 50 L98 50 L97 44 L94 44 Z', '#3a4250', '#8fb3d9', 1),
    circle(99, 33, 2.6, '#ff9a3c', null), circle(101, 40, 2, '#ff9a3c', null), ring(100, 36, 9, HL, 1.8), g('rotate(-20 30 104)', rect(22, 102, 20, 4, '#e6f2fb', 1, C.ink, 1), line('M42 104 L48 104', C.grey, 1), line('M18 104 L22 104', C.ink, 1.6))),

  // ── 3417 Elektronskal och valenselektroner ───────────────────────────
  /** fullt skal: right, an atom with 2 electrons on the inner ring and 8 on the outer ring; the outer ring with every place taken is thick orange. Left, grey, a smaller atom whose outer ring has an empty place. */
  'atom.fullt-skal': all(bg(), greyed(shellAtom(24, 60, [2, 7], [9, 17], { gap: true, gapAt: 0 })), shellAtom(78, 60, [2, 8], [14, 30], { mark: 1 })),
  /** elektronkonfiguration: an atom with 2, 8 and 1 electrons on three rings; dashed lines lead from each ring to a row of three orange boxes with the digits 2, 8 and 1. */
  'atom.elektronkonfiguration': all(bg(), shellAtom(42, 52, [2, 8, 1], [11, 22, 33]), line('M53 52 L36 100 M64 52 L60 100 M75 52 L84 100', HL, 1.2, '3 2'),
    ...[[36, '2'], [60, '8'], [84, '1']].map(([x, d]) => all(rect((x as number) - 9, 98, 18, 14, MARK, 2, HL, 2), T(x as number, 109, d as string, 11)))),
  /** avge (elektroner): an atom with rings; one electron leaves the outer ring and flies away to the right along a thick orange arrow; its empty place is dashed. */
  'atom.avge.2': all(bg(), shellAtom(44, 60, [2, 3], [14, 30], { gap: true }), arr(76, 60, 100, 60, HL, 3.4), electron(108, 60, 5)),
  /** ta upp (elektroner): the same atom; an electron comes in from the right along a thick orange arrow towards the empty dashed place on the outer ring. */
  'atom.ta-upp-kropp.3': all(bg(), shellAtom(44, 60, [2, 3], [14, 30], { gap: true }), electron(108, 60, 5), arr(100, 60, 80, 60, HL, 3.4)),
};
