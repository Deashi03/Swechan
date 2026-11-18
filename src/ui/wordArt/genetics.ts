/**
 * Matematik & naturvetenskap → Biologi → Genetik & arv, 3521–3527 (0.52): DNA and RNA, genes and chromosomes,
 * alleles and inheritance, mutations, gene expression, genetic variation and gene technology.
 * Recurring signs: DNA is a ladder with blue-grey rails whose rungs are two coloured base halves
 * (A red, T yellow, C blue, G green; U purple in RNA). Chromosomes are lilac X shapes. In the allele pictures a
 * chromosome pair is two upright rods with one band each: a purple band is the allele for purple pea flowers,
 * a white band the allele for white flowers, and the flower beside the pair shows what grows. The part the
 * word names is orange (ring, frame or arrow) and a grey reference shows what the word is not. Close words share
 * one layout where only the marked part differs: dominant/recessiv (the same two rows, top row or bottom row
 * framed); homozygot/heterozygot (a pair with equal or different bands); genotyp/fenotyp (the same pair and
 * flower, the pair or the flower framed); enäggstvilling/tvåäggstvilling (one egg that splits into two equal
 * children or two eggs that give two different children).
 * Digits, maths signs and the base letters A T C G U only; no words, no brands, no logos.
 */
import { C, all, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { figure } from './figures';
import { HL, T, sun } from './people';
import { greyed, P } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const SOFT = '#f4f6f8';
const MARK = '#fff3b0';
const RAIL = '#8193ad';
const BASE: Record<string, string> = { A: '#e8574a', T: '#f2c14e', C: '#4f9de0', G: '#5bb36a', U: '#b07ad8' };
const PAIR: Record<string, string> = { A: 'T', T: 'A', C: 'G', G: 'C' };
const SEQ = 'ATGCCGTAGCATGAC';
const LILA = '#8a5bbf';
const VIT = '#fbfbf8';
const CHROM = '#c7b3e6';
const BAD = '#d64545';
const OK = '#4f9d69';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ground = line('M4 112 L116 112', C.grey2, 2);
const bg = (col: string = SOFT) => rect(4, 4, 112, 108, col, 3, null);
const ring = (x: number, y: number, r: number, col: string = HL, sw = 2.6) => circle(x, y, r, 'none', col, sw);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL, sw = 2.6) => ellipse(x, y, rx, ry, 'none', col, sw);
const frame = (x: number, y: number, w: number, h: number, col: string = HL, sw = 2.8) => rect(x, y, w, h, 'none', 4, col, sw);
const head = (x: number, y: number, a: number, col: string, s = 1) => {
  const L = 7 * s, W = 4 * s, c = Math.cos(a), si = Math.sin(a);
  return path(`M${f1(x)} ${f1(y)} L${f1(x - L * c + W * si)} ${f1(y - L * si - W * c)} L${f1(x - L * c - W * si)} ${f1(y - L * si + W * c)} Z`, col, null);
};
const arr = (x1: number, y1: number, x2: number, y2: number, col: string = HL, sw = 3, dash?: string) => all(line(`M${x1} ${y1} L${x2} ${y2}`, col, sw, dash), head(x2, y2, Math.atan2(y2 - y1, x2 - x1), col, sw / 3 + 0.3));
/** Curved arrow through a control point. */
const carr = (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, col: string = HL, sw = 3, dash?: string) => all(line(`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`, col, sw, dash), head(x2, y2, Math.atan2(y2 - cy, x2 - cx), col, sw / 3 + 0.3));
const check = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 9, '#dff2e4', C.green, 1.8), line('M-4.5 0 L-1 3.8 L5 -4', C.green, 2.6));
const cross = (x: number, y: number, s = 1) => at(x, y, s, circle(0, 0, 9, '#f8dede', C.red, 1.8), line('M-4 -4 L4 4 M4 -4 L-4 4', C.red, 2.6));
const sign = (x: number, y: number, s: string, size = 14, col: string = C.ink) => T(x, y, s, size, col);

// ── DNA ──────────────────────────────────────────────────────────────
const rail = (d: string, col: string = RAIL, w = 3.4) => all(line(d, C.ink, w + 2), line(d, col, w));
/** One rung between (x1, y) and (x2, y), split into two base halves. */
const rung = (x1: number, x2: number, y: number, b: string, b2: string = PAIR[b] ?? 'A', h = 3.6) => {
  const m = (x1 + x2) / 2, lo = Math.min(x1, m), hi = Math.max(x1, m), lo2 = Math.min(m, x2), hi2 = Math.max(m, x2);
  return all(rect(f1(lo), f1(y - h / 2), f1(hi - lo), h, BASE[b] ?? C.grey, 1, C.ink, 0.8), rect(f1(lo2), f1(y - h / 2), f1(hi2 - lo2), h, BASE[b2] ?? C.grey, 1, C.ink, 0.8));
};
/** Twisted double helix standing upright; (cx, top) = top centre. */
const helix = (cx: number, top: number, h: number, amp: number, turns = 1.5, n = 12, seq = SEQ, rh = 3.6) => {
  const P1: string[] = [], P2: string[] = [], N = 48;
  for (let i = 0; i <= N; i++) {
    const t = i / N, y = f1(top + t * h), a = t * turns * Math.PI * 2;
    P1.push(`${f1(cx + amp * Math.sin(a))} ${y}`); P2.push(`${f1(cx - amp * Math.sin(a))} ${y}`);
  }
  const rungs = range(n).map((i) => {
    const t = (i + 0.5) / n, y = top + t * h, a = t * turns * Math.PI * 2, x1 = cx + amp * Math.sin(a), x2 = cx - amp * Math.sin(a);
    return Math.abs(x1 - x2) < 5 ? '' : rung(x1, x2, y, seq[i % seq.length] ?? 'A', undefined, rh);
  });
  return all(...rungs, rail(`M${P1.join(' L')}`), rail(`M${P2.join(' L')}`));
};
/** Straight ladder (untwisted DNA), upright; (cx, top) = top centre. wrong = index of a mismatched rung. */
const ladder = (cx: number, top: number, h: number, w: number, n = 8, seq = SEQ, wrong = -1, rh = 4) => {
  const L = cx - w / 2, R = cx + w / 2;
  const rungs = range(n).map((i) => {
    const y = top + ((i + 0.5) / n) * h, b = seq[i % seq.length] ?? 'A';
    return rung(L, R, y, b, i === wrong ? (b === 'A' ? 'C' : 'A') : undefined, rh);
  });
  return all(...rungs, rail(`M${L} ${top} L${L} ${top + h}`), rail(`M${R} ${top} L${R} ${top + h}`));
};
/** Straight ladder lying down; (left, cy) = left centre. */
const hLadder = (left: number, cy: number, len: number, w: number, n = 10, seq = SEQ, cols?: (i: number) => string | null) => {
  const T0 = cy - w / 2, B0 = cy + w / 2;
  const rungs = range(n).map((i) => {
    const x = left + ((i + 0.5) / n) * len, b = seq[i % seq.length] ?? 'A', b2 = PAIR[b] ?? 'T', c = cols ? cols(i) : null;
    return c ? rect(f1(x - 2), T0, 4, w, c, 1, C.ink, 0.8)
      : all(rect(f1(x - 2), T0, 4, w / 2, BASE[b] ?? C.grey, 1, C.ink, 0.8), rect(f1(x - 2), cy, 4, w / 2, BASE[b2] ?? C.grey, 1, C.ink, 0.8));
  });
  return all(...rungs, rail(`M${left} ${T0} L${left + len} ${T0}`), rail(`M${left} ${B0} L${left + len} ${B0}`));
};
/** Base block with a letter. */
const baseBlock = (x: number, y: number, b: string, w = 16, h = 12) => all(rect(x - w / 2, y - h / 2, w, h, BASE[b] ?? C.grey, 2, C.ink, 1.4), T(x, y + h * 0.33, b, h * 0.85, b === 'T' ? C.ink : C.white));
/** One nucleotide: phosphate ball, sugar pentagon and base block, left to right. */
const nucleotide = (x: number, y: number, s: number, b: string) => at(x, y, s,
  line('M-14 0 L-6 0 M6 0 L12 0', C.ink, 2), circle(-17, 0, 5, '#f0b45a', C.ink, 1.4),
  path('M0 -7 L7 -2 L4.5 6 L-4.5 6 L-7 -2 Z', '#d4dce8', C.ink, 1.4), baseBlock(20, 0, b, 16, 12));
/** RNA: one wavy rail with base halves sticking out to the right. */
const rnaStrand = (x: number, top: number, h: number, n = 7, seq = 'AUGCUAG') => {
  const pts = range(25).map((i) => { const t = i / 24; return `${f1(x + 4 * Math.sin(t * Math.PI * 3))} ${f1(top + t * h)}`; });
  return all(...range(n).map((i) => {
    const t = (i + 0.5) / n, y = top + t * h, xx = x + 4 * Math.sin(t * Math.PI * 3), b = seq[i % seq.length] ?? 'A';
    return rect(f1(xx), f1(y - 2.2), 13, 4.4, BASE[b] ?? C.grey, 1, C.ink, 0.8);
  }), rail(`M${pts.join(' L')}`));
};
/** Small helix icon (for "this is DNA"). */
const helixIcon = (x: number, y: number, s = 1) => at(x, y, s, helix(0, -18, 36, 6, 1, 6, SEQ, 2.6));

// ── Chromosomes and alleles ──────────────────────────────────────────
/** X-shaped chromosome; (x, y) = centromere. */
const chromo = (x: number, y: number, s = 1, col: string = CHROM, bands = true) => at(x, y, s,
  g('rotate(-16)', rect(-4.5, -24, 9, 48, col, 4.5, C.ink, 1.6), bands ? line('M-4.5 -14 L4.5 -14 M-4.5 12 L4.5 12', '#7d5fb0', 2) : ''),
  g('rotate(16)', rect(-4.5, -24, 9, 48, col, 4.5, C.ink, 1.6), bands ? line('M-4.5 -14 L4.5 -14 M-4.5 12 L4.5 12', '#7d5fb0', 2) : ''),
  circle(0, 0, 3, '#7d5fb0', C.ink, 1));
/** Y-shaped (small) sex chromosome. */
const chromoY = (x: number, y: number, s = 1, col: string = '#9cc3ec') => at(x, y, s,
  g('rotate(-22)', rect(-4.5, -16, 9, 18, col, 4.5, C.ink, 1.6)), g('rotate(22)', rect(-4.5, -16, 9, 18, col, 4.5, C.ink, 1.6)),
  rect(-4.5, -2, 9, 22, col, 4.5, C.ink, 1.6), circle(0, -1, 3, '#4f7fc0', C.ink, 1));
/** Upright rod (one chromosome of a pair) with a band; (x, y) = bottom centre. */
const rod = (x: number, y: number, band: string, h = 46, w = 10, by = 0.45, dashed = false) => all(
  rect(x - w / 2, y - h, w, h, CHROM, w / 2, C.ink, 1.6),
  rect(x - w / 2, f1(y - h * (1 - by) - 4), w, 8, band, 1, dashed ? C.grey : C.ink, dashed ? 1 : 1.4));
/** A chromosome pair; returns the band centre y too. */
const pair = (x: number, y: number, b1: string, b2: string, h = 46, gap = 16) => all(rod(x - gap / 2, y, b1, h), rod(x + gap / 2, y, b2, h));
const bandY = (y: number, h = 46, by = 0.45) => f1(y - h * (1 - by));
/** Pea flower on a stem; (x, y) = foot of the stem. */
const flower = (x: number, y: number, col: string, s = 1, stem = 26) => at(x, y, s,
  line(`M0 0 L0 ${-stem}`, OK, 2.6), path(`M0 ${-stem * 0.45} C6 ${-stem * 0.6} 11 ${-stem * 0.45} 12 ${-stem * 0.3} C6 ${-stem * 0.25} 3 ${-stem * 0.3} 0 ${-stem * 0.4} Z`, '#8cc78f', C.ink, 1),
  ...range(5).map((i) => { const a = (i / 5) * Math.PI * 2 - Math.PI / 2; return circle(f1(6 * Math.cos(a)), f1(-stem - 8 + 6 * Math.sin(a)), 5.4, col, C.ink, 1.2); }),
  circle(0, -stem - 8, 3, C.yellow, C.ink, 1));

// ── Cells, people and animals ────────────────────────────────────────
const egg = (x: number, y: number, r = 12) => all(circle(x, y, r, '#fbe3c8', C.ink, 1.6), circle(f1(x + r * 0.2), f1(y - r * 0.15), f1(r * 0.35), '#e8b98a', C.ink, 1));
const sperm = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, line('M4 0 C10 -3 14 3 20 0 C24 -2 26 1 28 0', C.ink, 1.4), ellipse(0, 0, 4.5, 3, '#cfe3f5', C.ink, 1.2));
/** Simple head with hair; curly adds bumps, long adds side hair, freckles adds dots. */
const face = (x: number, y: number, r: number, hair: string, o: { long?: boolean; curly?: boolean; freckles?: boolean; ears?: boolean; skin?: string; mood?: 'smile' | 'sad' } = {}) => {
  const sk = o.skin ?? C.skin;
  return all(
    o.long ? path(`M${f1(x - r * 1.1)} ${y} C${f1(x - r * 1.2)} ${f1(y + r * 1.4)} ${f1(x + r * 1.2)} ${f1(y + r * 1.4)} ${f1(x + r * 1.1)} ${y} Z`, hair, C.ink, 1.4) : '',
    o.ears ? all(ellipse(f1(x - r * 1.02), y, f1(r * 0.32), f1(r * 0.42), sk, C.ink, 1.4), ellipse(f1(x + r * 1.02), y, f1(r * 0.32), f1(r * 0.42), sk, C.ink, 1.4)) : '',
    circle(x, y, r, sk, C.ink, 1.6),
    o.curly ? all(...range(7).map((i) => { const a = Math.PI + (i / 6) * Math.PI; return circle(f1(x + r * 0.92 * Math.cos(a)), f1(y + r * 0.92 * Math.sin(a) - r * 0.08), f1(r * 0.36), hair, C.ink, 1.1); }))
      : path(`M${f1(x - r)} ${f1(y - r * 0.1)} C${f1(x - r)} ${f1(y - r * 1.4)} ${f1(x + r)} ${f1(y - r * 1.4)} ${f1(x + r)} ${f1(y - r * 0.1)} C${f1(x + r * 0.5)} ${f1(y - r * 0.6)} ${f1(x - r * 0.5)} ${f1(y - r * 0.6)} ${f1(x - r)} ${f1(y - r * 0.1)} Z`, hair, C.ink, 1.4),
    circle(f1(x - r * 0.36), f1(y + r * 0.08), f1(Math.max(1, r * 0.1)), C.ink, null), circle(f1(x + r * 0.36), f1(y + r * 0.08), f1(Math.max(1, r * 0.1)), C.ink, null),
    o.mood === 'sad' ? path(`M${f1(x - r * 0.3)} ${f1(y + r * 0.56)} Q${x} ${f1(y + r * 0.38)} ${f1(x + r * 0.3)} ${f1(y + r * 0.56)}`, 'none', C.ink, 1.2)
      : path(`M${f1(x - r * 0.3)} ${f1(y + r * 0.42)} Q${x} ${f1(y + r * 0.62)} ${f1(x + r * 0.3)} ${f1(y + r * 0.42)}`, 'none', C.ink, 1.2),
    o.freckles ? all(...[[-0.55, 0.3], [-0.45, 0.42], [-0.62, 0.45], [0.55, 0.3], [0.45, 0.42], [0.62, 0.45]].map(([a, b]) => circle(f1(x + r * (a ?? 0)), f1(y + r * (b ?? 0)), f1(Math.max(0.6, r * 0.05)), '#b0643a', null))) : '');
};
/** Small standing child/adult built on figure(). */
const kid = (x: number, hair: string, top: string, h = 0.62, long = false) => figure({ x, h, hair, top, hairStyle: long ? 'long' : 'short' });
const RED_HAIR = '#c4542a', BROWN_HAIR = '#5a3d2b', BLOND = '#e8c35a';
/** Side-view dog; (x, y) = feet line centre. */
const dog = (x: number, y: number, o: { body?: string; len?: number; leg?: number; s?: number; ear?: 'up' | 'down' | 'mixed'; spots?: string; fluffy?: boolean; flip?: boolean } = {}) => {
  const b = o.body ?? C.tan, L = o.len ?? 26, lg = o.leg ?? 12, s = o.s ?? 1, by = -lg - 6;
  const spots = o.spots ? all(circle(-L * 0.15, by - 2, 3.4, o.spots, null), circle(L * 0.2, by + 1, 2.8, o.spots, null)) : '';
  const earUp = path(`M${L / 2 + 2} ${by - 13} L${L / 2 + 4} ${by - 22} L${L / 2 + 8} ${by - 14} Z`, b, C.ink, 1.2);
  const earDown = path(`M${L / 2 + 1} ${by - 14} C${L / 2 - 4} ${by - 12} ${L / 2 - 2} ${by - 3} ${L / 2 + 2} ${by - 5} Z`, o.spots ?? C.brown, C.ink, 1.2);
  const ears = o.ear === 'up' ? earUp : o.ear === 'mixed' ? all(earUp, earDown) : earDown;
  return g(`translate(${x} ${y}) scale(${o.flip ? -s : s} ${s})`,
    line(`M${-L / 2} ${by - 2} C${-L / 2 - 6} ${by - 6} ${-L / 2 - 7} ${by - 12} ${-L / 2 - 4} ${by - 16}`, C.ink, 3.6), line(`M${-L / 2} ${by - 2} C${-L / 2 - 6} ${by - 6} ${-L / 2 - 7} ${by - 12} ${-L / 2 - 4} ${by - 16}`, b, 2),
    ...[-L / 2 + 4, -L / 2 + 9, L / 2 - 9, L / 2 - 4].map((lx) => rect(f1(lx - 2), by + 2, 4, lg + 4, b, 1.5, C.ink, 1.1)),
    o.fluffy ? ellipse(0, by, L / 2 + 3, 9, b, C.ink, 1.4) : rect(-L / 2, by - 6, L, 12, b, 6, C.ink, 1.4), spots,
    circle(L / 2 + 4, by - 9, 7, b, C.ink, 1.4), ellipse(L / 2 + 10, by - 7, 4.4, 3.2, b, C.ink, 1.2), circle(L / 2 + 13.6, by - 8, 1.4, C.ink, null),
    circle(L / 2 + 5, by - 11, 1.1, C.ink, null), ears);
};
const sheep = (x: number, y: number, s = 1, wool: string = '#f5f3ee') => at(x, y, s,
  line('M-10 -6 L-10 4 M-4 -6 L-4 4 M6 -6 L6 4 M11 -6 L11 4', C.ink, 2.6),
  ...[[-12, -14], [-5, -18], [3, -18], [10, -14], [-8, -9], [0, -9], [8, -9]].map(([a, b]) => circle(a ?? 0, b ?? 0, 6, wool, C.ink, 1.2)),
  ellipse(17, -16, 5, 6.5, C.dark, C.ink, 1.2), ellipse(14, -20, 3, 1.6, C.dark, C.ink, 1), circle(18.5, -17, 1, C.white, null));
const rabbit = (x: number, y: number, s = 1, fur: string, eye: string) => at(x, y, s,
  ellipse(0, -10, 15, 11, fur, C.ink, 1.6), circle(-15, -9, 3.6, fur, C.ink, 1.2), circle(14, -18, 8, fur, C.ink, 1.6),
  ellipse(10, -33, 3.4, 10, fur, C.ink, 1.4), ellipse(17, -32, 3.4, 10, fur, C.ink, 1.4), ellipse(10, -33, 1.4, 7, '#f2b8c6', null), ellipse(17, -32, 1.4, 7, '#f2b8c6', null),
  circle(17, -19, 2.2, eye, C.ink, 0.8), circle(21.5, -15.5, 1.3, '#e88aa0', null), ellipse(4, -1, 6, 2.4, fur, C.ink, 1.2));
const corn = (x: number, y: number, s = 1, col = '#f2c94c') => at(x, y, s,
  path('M-6 14 C-14 4 -14 -14 -4 -26 L-2 -8 Z', '#7cbf6a', C.ink, 1.4), path('M6 14 C14 4 14 -14 4 -26 L2 -8 Z', '#6aaf5a', C.ink, 1.4),
  ellipse(0, -6, 8, 20, col, C.ink, 1.6), ...range(5).map((i) => line(`M-6 ${-18 + i * 6} L6 ${-18 + i * 6}`, '#d6a92c', 1)), line('M-2.6 -24 L-2.6 12 M2.6 -24 L2.6 12', '#d6a92c', 1));
const syringe = (x: number, y: number, rot = 0, s = 1, inside: Svg = '') => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  rect(-26, -6, 34, 12, '#eef6fb', 2, C.ink, 1.6), inside, rect(-34, -2, 8, 4, C.grey, 1, C.ink, 1.2), rect(-37, -7, 3, 14, C.grey, 1, C.ink, 1.2),
  rect(8, -3, 4, 6, C.grey, 1, C.ink, 1.2), line('M12 0 L26 0', C.ink, 1.4));
const scissors = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  path('M0 0 L22 -4 L22 -1 Z', C.silver, C.ink, 1.2), path('M0 0 L22 4 L22 1 Z', C.silver, C.ink, 1.2),
  circle(-7, -5, 5, 'none', HL, 2.6), circle(-7, 5, 5, 'none', HL, 2.6), circle(0, 0, 1.4, C.ink, null));
const tube = (x: number, y: number, h = 46, liq: string = '#d6ecf8', level = 0.5, cap?: string) => all(
  rect(x - 7, f1(y - h * level), 14, f1(h * level), liq, 6, null), path(`M${x - 7} ${y - h} L${x - 7} ${y - 7} C${x - 7} ${y + 2} ${x + 7} ${y + 2} ${x + 7} ${y - 7} L${x + 7} ${y - h}`, 'none', C.ink, 1.8),
  cap ? rect(x - 8.5, y - h - 6, 17, 7, cap, 2, C.ink, 1.4) : '');
const toggle = (x: number, y: number, on: boolean) => all(rect(x - 9, y - 5, 18, 10, on ? C.green : C.grey2, 5, C.ink, 1.3), circle(on ? x + 4 : x - 4, y, 3.8, C.white, C.ink, 1.1));
const strawberry = (x: number, y: number, s = 1) => at(x, y, s, path('M0 10 C-10 2 -9 -7 -4 -8 C-2 -9 2 -9 4 -8 C9 -7 10 2 0 10 Z', '#e04a4a', C.ink, 1.4),
  path('M-5 -8 L-2 -12 L0 -8 L2 -12 L5 -8 Z', '#5bb36a', C.ink, 1), ...[[-3, -3], [2, -4], [-1, 2], [3, 1]].map(([a, b]) => circle(a ?? 0, b ?? 0, 0.8, '#f8e08a', null)));
const milkGlass = (x: number, y: number, s = 1) => at(x, y, s, path('M-7 -18 L7 -18 L6 0 L-6 0 Z', C.white, C.ink, 1.6), line('M-6 -13 L6 -13', '#d8dde3', 1));
const tomato = (x: number, y: number, r: number, col = '#e04a3a') => all(circle(x, y, r, col, C.ink, 1.2), path(`M${f1(x - r * 0.5)} ${f1(y - r * 0.8)} L${x} ${f1(y - r * 0.5)} L${f1(x + r * 0.5)} ${f1(y - r * 0.8)}`, 'none', OK, 1.4));
const plant = (x: number, y: number, h: number, fruitR: number, nFruit: number) => all(line(`M${x} ${y} L${x} ${y - h}`, OK, 2.6),
  ...range(3).map((i) => path(`M${x} ${f1(y - h * (0.3 + i * 0.25))} C${x + (i % 2 ? -10 : 10)} ${f1(y - h * (0.38 + i * 0.25))} ${x + (i % 2 ? -14 : 14)} ${f1(y - h * (0.3 + i * 0.25))} ${x + (i % 2 ? -12 : 12)} ${f1(y - h * (0.22 + i * 0.25))}`, '#8cc78f', C.ink, 1)),
  ...range(nFruit).map((i) => tomato(x + (i % 2 ? fruitR + 2 : -fruitR - 2), f1(y - h * (0.35 + 0.22 * i)), fruitR)));
/** Barcode-like DNA profile strip; marks = band positions 0..1. */
const strip = (x: number, y: number, w: number, marks: number[], col: string = C.dark) => all(rect(x, y, w, 12, C.white, 2, C.ink, 1.3), ...marks.map((m) => line(`M${f1(x + 3 + m * (w - 6))} ${y + 2} L${f1(x + 3 + m * (w - 6))} ${y + 10}`, col, 2.4)));
const envelope = (x: number, y: number, s = 1) => at(x, y, s, rect(-14, -9, 28, 18, '#f3ead6', 2, C.ink, 1.6), line('M-14 -9 L0 2 L14 -9', C.ink, 1.4));
const swab = (x: number, y: number, rot = 0, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, line('M0 0 L24 0', C.white, 3), line('M0 0 L24 0', C.ink, 0.6), ellipse(-2, 0, 4, 2.6, '#f5f0e6', C.ink, 1));
const siamese = (x: number, y: number, s = 1) => {
  const cream = '#f3e6cc', pt = '#5a3d2b';
  return at(x, y, s,
    path('M14 -4 C26 -6 30 -20 24 -30', 'none', C.ink, 5.2), path('M14 -4 C26 -6 30 -20 24 -30', 'none', pt, 3.4),
    ellipse(0, -10, 17, 10, cream, C.ink, 1.6),
    ...[-12, -6, 6, 12].map((lx) => all(rect(lx - 2.4, -6, 4.8, 12, cream, 2, C.ink, 1.1), rect(lx - 2.6, 3, 5.2, 4, pt, 2, C.ink, 1))),
    path('M-24 -30 L-22 -40 L-16 -32 Z M-12 -32 L-8 -40 L-6 -30 Z', pt, C.ink, 1.2),
    circle(-15, -24, 10, cream, C.ink, 1.6), ellipse(-15, -21, 6, 5.6, pt, null),
    ellipse(-19, -26, 2.2, 1.6, '#5aa0e0', C.ink, 0.6), ellipse(-11, -26, 2.2, 1.6, '#5aa0e0', C.ink, 0.6), path('M-16.4 -21 L-13.6 -21 L-15 -19.4 Z', C.ink, null));
};

// ── Recurring scenes ─────────────────────────────────────────────────
/** Two rows: pair → flower. Top row purple+white → purple, bottom row white+white → white. */
const twoRows = (mark: 'top' | 'bottom') => {
  const row = (y: number, b1: string, b2: string, col: string, on: boolean) => {
    const content = all(pair(30, y, b1, b2, 40), arr(48, y - 20, 66, y - 20, on ? HL : C.grey, 2.4), flower(90, y, col, 0.8, 22));
    return on ? all(rect(10, y - 50, 100, 52, MARK, 6, null), content, frame(10, y - 50, 100, 52)) : greyed(content);
  };
  return all(bg(), row(56, LILA, VIT, LILA, mark === 'top'), row(110, VIT, VIT, VIT, mark === 'bottom'));
};
/** Pair and flower side by side; which part is framed. */
const pairAndFlower = (mark: 'pair' | 'flower') => {
  const p = pair(34, 98, LILA, VIT, 52), fl = flower(88, 106, LILA, 1.15, 30);
  return all(bg(), ground, mark === 'pair' ? all(rect(14, 36, 40, 68, MARK, 6, null), p, frame(14, 36, 40, 68), greyed(fl)) : all(greyed(p), rect(64, 30, 48, 80, MARK, 6, null), fl, frame(64, 30, 48, 80)),
    arr(56, 70, 70, 70, C.grey, 2.2));
};
/** Twins: one egg splitting into two equal children, or two eggs giving two different children. */
const twins = (one: boolean) => all(bg(), ground,
  one ? all(egg(60, 24, 12), sperm(36, 16, 0.7, 20), arr(52, 38, 34, 54), arr(68, 38, 86, 54), ring(60, 24, 16))
    : all(egg(40, 24, 11), egg(80, 24, 11), sperm(18, 16, 0.6, 20), sperm(98, 16, 0.6, 160), arr(40, 38, 32, 54), arr(80, 38, 88, 54), ring(40, 24, 15), ring(80, 24, 15)),
  one ? all(kid(32, BROWN_HAIR, C.green, 0.56), kid(88, BROWN_HAIR, C.green, 0.56), sign(60, 94, '=', 18, HL))
    : all(kid(32, BROWN_HAIR, C.green, 0.56), kid(88, BLOND, C.pink, 0.56, true), sign(60, 94, '≠', 18, HL)));

export const GENETICS_MOTIFS: Record<string, Svg> = {
  // ── 3521 DNA och RNA ────────────────────────────────────────────────
  /** DNA: a glass of mashed strawberries; a stick lifts a white stringy clump out of the clear top layer (ringed), with an arrow up to a small coloured double helix. */
  'gen.DNA': all(bg(), ground, path('M22 50 L26 108 L66 108 L70 50 Z', '#eef6fb', null), path('M24.6 84 L26 108 L66 108 L67.4 84 Z', '#f08a8a', null), path('M23.3 66 L24.6 84 L67.4 84 L68.7 66 Z', '#f7fbfe', null),
    path('M22 50 L26 108 L66 108 L70 50', 'none', C.ink, 2), line('M58 26 L44 74', C.brown, 3),
    path('M38 72 C34 66 42 62 40 56 C38 50 46 48 46 54 C46 60 52 62 48 68 C46 72 42 76 38 72 Z', C.white, C.grey, 1.2), line('M40 58 C42 62 44 64 42 68 M44 54 C45 58 47 60 46 64', C.grey2, 1),
    ring(43, 63, 13), strawberry(84, 104, 0.9), strawberry(100, 102, 0.8), arr(58, 50, 82, 36, HL, 2.4), helixIcon(96, 32, 0.9)),
  /** RNA: one single wavy strand with coloured bases (among them a purple U) in an orange ring; a grey double helix beside it as the DNA reference. */
  'gen.RNA': all(bg(), circle(48, 60, 40, MARK, null), rnaStrand(42, 26, 70, 7), ring(48, 60, 40), greyed(helix(98, 30, 64, 8, 1.2, 8))),
  /** dubbelspiral: a big twisted ladder (two rails winding round each other) framed in orange; a small grey straight ladder as reference. */
  'gen.dubbelspiral': all(bg(), rect(16, 10, 64, 100, MARK, 6, null), helix(48, 16, 88, 20, 1.5, 14), frame(16, 10, 64, 100), greyed(ladder(100, 50, 50, 14, 5))),
  /** nukleotid: a grey single strand of linked units; one unit (phosphate ball, sugar pentagon, base block) is pulled out, enlarged and ringed. */
  'gen.nukleotid': all(bg(), greyed(line('M22 14 L22 106', RAIL, 3), ...range(5).map((i) => all(circle(22, 18 + i * 20, 4, '#f0b45a', C.ink, 1), rect(26, 15 + i * 20, 12, 6, BASE[SEQ[i] ?? 'A'] ?? C.grey, 1, C.ink, 0.8)))),
    rect(24, 52, 14, 16, 'none', 2, HL, 2), arr(42, 60, 52, 60, HL, 2.4), circle(80, 60, 30, MARK, null), nucleotide(76, 60, 1.25, 'G'), ring(80, 60, 30)),
  /** kvävebas: four coloured blocks marked A, T, C and G in an orange frame; under them a short grey ladder whose rung halves are the same blocks. */
  'gen.kvävebas': all(bg(), rect(10, 14, 100, 40, MARK, 6, null), baseBlock(24, 34, 'A', 18, 16), baseBlock(48, 34, 'T', 18, 16), baseBlock(72, 34, 'C', 18, 16), baseBlock(96, 34, 'G', 18, 16), frame(10, 14, 100, 40),
    greyed(hLadder(14, 86, 92, 26, 8, 'ATCGATCG'))),
  /** baspar: a grey ladder with one rung in colour, ringed; beside it the pair enlarged: an A block and a T block joined by dotted bonds. */
  'gen.baspar': all(bg(), greyed(ladder(32, 12, 96, 24, 8)), rung(20, 44, 54, 'A', 'T', 5), oval(32, 54, 17, 7),
    arr(52, 54, 62, 54, HL, 2.4), rect(64, 36, 48, 36, MARK, 6, null), baseBlock(76, 54, 'A', 20, 16), baseBlock(100, 54, 'T', 20, 16), line('M86 50 L90 50 M86 58 L90 58', C.ink, 1.6, '1.5 1.5'), frame(64, 36, 48, 36)),
  /** kopiera: one ladder on the left, an orange arrow, and two identical ladders on the right with = between them. */
  'gen.kopiera': all(bg(), ladder(22, 24, 72, 18, 7), arr(36, 60, 54, 60), ladder(70, 24, 72, 18, 7), ladder(102, 24, 72, 18, 7), sign(86, 64, '=', 14, HL)),

  // ── 3522 Gener och kromosomer ───────────────────────────────────────
  /** kromosom: a big lilac X-shaped chromosome in an orange ring; from one arm a thin DNA thread unwinds to a small helix, showing that it is packed DNA. */
  'gen.kromosom': all(bg(), circle(46, 58, 38, MARK, null), chromo(46, 58, 1.5), ring(46, 58, 38), path('M70 30 C80 26 78 40 88 36 C96 32 92 46 100 44', 'none', RAIL, 2), helixIcon(100, 76, 0.8)),
  /** könskromosom: a grid of 22 small grey chromosome pairs; the last pair, one big X and one small Y shape, is in colour and framed. */
  'gen.könskromosom': all(bg(), greyed(...range(22).map((i) => { const c = i % 6, r = Math.floor(i / 6); const s = 0.3 - i * 0.006; return all(chromo(14 + c * 16, 20 + r * 24, s, CHROM, false), chromo(20 + c * 16, 20 + r * 24, s, CHROM, false)); })),
    rect(62, 80, 50, 30, MARK, 6, null), chromo(78, 95, 0.5, '#f2a8c0', false), chromoY(96, 96, 0.55), frame(62, 80, 50, 30)),

  // ── 3523 Alleler och nedärvning ─────────────────────────────────────
  /** allel: three chromosome rods, each with a band at the same place in a different colour (purple, white, pink); the three bands are ringed together. */
  'gen.allel': all(bg(), rod(32, 100, LILA, 70), rod(60, 100, VIT, 70), rod(88, 100, '#f2a8c0', 70), oval(60, bandY(100, 70), 42, 10), flower(32, 26, LILA, 0.4, 10), flower(60, 26, VIT, 0.4, 10), flower(88, 26, '#f2a8c0', 0.4, 10)),
  /** dominant (genetik): two rows (purple+white → purple flower; white+white → white flower); the top row is framed in orange, the bottom row grey. */
  'gen.dominant.2': all(twoRows('top'), ring(22, bandY(56, 40), 8)),
  /** recessiv: one pair with a purple and a white band; the white band is ringed, but the flower that grows is purple. A dashed arrow from the white band leads to a faint dashed white flower that is crossed out: the white allele is there but does not show. */
  'gen.recessiv': all(bg(), ground, pair(32, 108, LILA, VIT, 76, 22), ring(43, bandY(108, 76), 9), arr(48, 74, 62, 84, C.grey, 2.2), flower(86, 110, LILA, 1.05, 28),
    line('M50 62 C60 52 68 44 74 40', HL, 2, '3 3'), `<g opacity="0.55">${flower(92, 46, VIT, 0.95, 12).replace(/stroke="#2b2a33"/g, 'stroke="#9aa3ad" stroke-dasharray="2 2"')}</g>`, cross(106, 16, 0.75)),
  /** homozygot: a pair with two equal purple bands and an orange = between them, framed; a small grey pair with purple+white as reference. */
  'gen.homozygot': all(bg(), rect(16, 20, 56, 90, MARK, 6, null), pair(44, 104, LILA, LILA, 76, 26), sign(44, bandY(104, 76) + 6, '=', 18, HL), frame(16, 20, 56, 90), greyed(pair(96, 104, LILA, VIT, 44, 14))),
  /** heterozygot: the same layout with one purple and one white band and an orange ≠ between them, framed; a small grey purple+purple pair as reference. */
  'gen.heterozygot': all(bg(), rect(16, 20, 56, 90, MARK, 6, null), pair(44, 104, LILA, VIT, 76, 26), sign(44, bandY(104, 76) + 6, '≠', 18, HL), frame(16, 20, 56, 90), greyed(pair(96, 104, LILA, LILA, 44, 14))),
  /** genotyp: a chromosome pair (purple+white) and a purple pea flower; the pair is framed, the flower grey. */
  'gen.genotyp': pairAndFlower('pair'),
  /** fenotyp: the same pair and flower; the flower is framed, the pair grey. */
  'gen.fenotyp': pairAndFlower('flower'),
  /** korsningsschema: a 2×2 table framed in orange; purple and white balls along the top and left, and in each cell the pair of balls the child gets (one cell white+white). */
  'gen.korsningsschema': all(bg(), circle(56, 18, 6, LILA, C.ink, 1.2), circle(88, 18, 6, VIT, C.ink, 1.2), circle(22, 50, 6, LILA, C.ink, 1.2), circle(22, 86, 6, VIT, C.ink, 1.2),
    rect(38, 32, 68, 72, C.white, 3, C.ink, 1.6), line('M72 32 L72 104 M38 68 L106 68', C.ink, 1.6),
    ...[[55, 50, LILA, LILA], [89, 50, LILA, VIT], [55, 86, VIT, LILA], [89, 86, VIT, VIT]].map(([x, y, a, b]) => all(circle((x as number) - 6, y as number, 5.5, a as string, C.ink, 1.1), circle((x as number) + 6, y as number, 5.5, b as string, C.ink, 1.1))),
    frame(34, 28, 76, 80)),
  /** anlagsbärare: a healthy smiling woman with a badge on her chest: a pair with one green and one red band, the red band ringed; a grey woman with a green+green pair as reference. */
  'gen.anlagsbärare': all(bg(), ground, greyed(figure({ x: 24, h: 0.82, hairStyle: 'long', top: C.sky }), pair(24, 78, OK, OK, 22, 8)),
    figure({ x: 76, hairStyle: 'long', top: C.white }), rect(62, 54, 28, 28, C.white, 4, C.ink, 1.2), pair(76, 80, OK, BAD, 24, 10), ring(81, bandY(80, 24), 6), check(104, 22, 0.9)),
  /** hoppa över en generation: grandfather with red hair, mother with brown hair, child with red hair; an orange arrow arcs from the grandfather over the mother to the child. */
  'gen.hoppa-över-en-generation': all(bg(), ground, figure({ x: 22, h: 0.9, hair: RED_HAIR, top: C.navy }), figure({ x: 60, h: 0.84, hair: BROWN_HAIR, hairStyle: 'long', top: C.green }), kid(98, RED_HAIR, C.orange, 0.56),
    carr(28, 28, 62, -10, 96, 52), ring(22, 34, 10), ring(98, 62, 8)),

  // ── 3524 Mutationer ─────────────────────────────────────────────────
  /** kopieringsfel: a ladder on the left, an arrow, and its copy on the right where one rung has the wrong colour pair (red with blue instead of yellow), ringed in red. */
  'gen.kopieringsfel': all(bg(), ladder(28, 16, 88, 22, 8), arr(44, 60, 62, 60, C.grey, 2.4), ladder(88, 16, 88, 22, 8, SEQ, 4), ring(88, 16 + 4.5 * 11, 12, BAD), sign(108, 22, '≠', 14, BAD)),
  /** hudcancer: a forearm with a large, uneven dark spot in an orange ring; a hot sun in the corner; a small normal round mole on the arm stays plain. */
  'gen.hudcancer': all(bg('#fff7e6'), sun(18, 18, 8), line('M30 26 L40 36 M26 32 L34 44', C.gold, 1.8), g('translate(2 22)', path('M0 46 C30 40 70 40 96 44 L96 82 C70 86 30 86 0 80 Z', C.skin, C.ink, 2.2), path('M94 40 C108 38 118 46 118 62 C118 80 108 86 94 84 Z', C.skin, C.ink, 2.2),
    circle(26, 70, 2.2, '#8a5a3a', null), path('M58 54 C64 50 72 54 70 60 C74 64 68 72 62 69 C56 72 50 66 54 61 C50 57 54 53 58 54 Z', '#4a3026', C.ink, 1), circle(62, 58, 2.4, '#7a4a32', null)), ring(64, 83, 16)),
  /** skadlig: a bottle with a red hazard diamond gives off dark green fumes; a man next to it holds his belly and looks sick; a small plant beside the bottle has wilted. No cigarette, no cells. */
  'gen.skadlig': all(bg(), ground, path('M14 112 L14 70 Q14 62 22 60 L22 50 L32 50 L32 60 Q40 62 40 70 L40 112 Z', '#d6ecf8', C.ink, 1.8), rect(21, 44, 12, 7, C.dark, 2, C.ink, 1.2),
    at(27, 88, 1, path('M0 -11 L11 0 L0 11 L-11 0 Z', C.white, C.red, 2.2), line('M0 -5 L0 2', C.ink, 2.2), circle(0, 5.5, 1.3, C.ink, null)),
    path('M30 42 C24 32 38 28 32 18 M38 44 C46 34 40 26 50 20', 'none', '#6b8f3a', 3), circle(52, 24, 3, '#9bbf5a', null), circle(44, 12, 2.4, '#9bbf5a', null),
    P({ x: 82, top: C.sky, mood: 'sick' }), line('M72 76 L80 72 M88 72 L94 76', C.skin, 2), line('M66 30 l4 -2 M68 36 l5 0', C.ink, 1.2),
    line('M52 112 L52 98 C52 92 56 92 58 96', OK, 2), path('M52 100 C46 100 44 104 46 108 C50 106 52 104 52 100 Z', '#a8b86a', C.ink, 1)),
  /** albino: a white rabbit with a red eye, ringed in orange; a grey brown rabbit as the ordinary reference. */
  'gen.albino': all(bg('#eef6ea'), ground, greyed(rabbit(26, 112, 0.8, '#a07850', C.ink)), circle(78, 86, 28, MARK, null), rabbit(72, 112, 1.05, C.white, '#e03a4a'), ring(78, 86, 28)),
  /** pigment: a patch of brown skin with a zoom circle that shows many small brown grains in the cells, ringed; the colour comes from the grains. */
  'gen.pigment': all(bg(), path('M8 70 C30 62 50 64 60 70 L60 108 L8 108 Z', '#b07a52', C.ink, 1.8), circle(30, 86, 8, 'none', C.ink, 1.4), line('M36 80 L58 52', C.ink, 1.4),
    circle(84, 44, 30, '#f6e4d0', C.ink, 1.8), ...range(4).map((i) => circle(70 + (i % 2) * 26, 32 + Math.floor(i / 2) * 24, 10, '#f9efe2', C.grey, 1)),
    ...[[68, 28], [72, 34], [66, 36], [94, 30], [98, 36], [92, 28], [70, 54], [74, 58], [96, 52], [99, 58], [80, 44], [86, 40], [88, 48]].map(([a, b]) => circle(a ?? 0, b ?? 0, 2.2, '#6b4226', null)), ring(84, 44, 33)),

  // ── 3525 Genuttryck ─────────────────────────────────────────────────
  /** genuttryck: a lying DNA ladder with three gene sections; the middle section glows yellow with a green switch (on), and an orange arrow leads to a folded chain of beads (the protein); the other sections are grey with switches off. */
  'gen.genuttryck': all(bg(), hLadder(8, 40, 104, 18, 13, SEQ, (i) => (i >= 5 && i <= 8 ? null : C.grey2)), rect(46, 28, 30, 24, 'none', 3, HL, 2.6), sparkle(61, 22, 5, C.gold),
    toggle(26, 62, false), toggle(61, 62, true), toggle(96, 62, false), arr(61, 70, 61, 84),
    ...[[50, 92], [58, 96], [66, 92], [72, 100], [64, 106], [54, 104], [46, 100]].map(([a, b]) => circle(a ?? 0, b ?? 0, 4, '#f2a35a', C.ink, 1.1))),
  /** laktosintolerant: a woman holding her belly with a pained face and gas bubbles; a glass of milk on a stool beside her. */
  'gen.laktosintolerant': all(bg(), ground, P({ x: 42, hairStyle: 'long', top: C.purple, mood: 'sick' }), line('M30 76 L38 72 M46 72 L54 76', C.skin, 2), circle(42, 78, 10, 'none', HL, 2.4),
    circle(60, 70, 2.4, C.white, C.grey, 1), circle(64, 64, 1.8, C.white, C.grey, 1), line('M54 52 l3 -3 M58 56 l4 -1', C.ink, 1.2), rect(80, 90, 26, 4, C.brown, 1, C.ink, 1.4), line('M84 94 L84 112 M102 94 L102 112', C.brown, 3), milkGlass(93, 90, 1.2), cross(106, 56, 0.9)),
  /** siameskatt: a cream-coloured cat with dark brown ears, face mask, paws and tail, and blue eyes. */
  'gen.siameskatt': all(bg('#f3f0ea'), ground, siamese(66, 106, 1.6)),

  // ── 3526 Genetisk variation och arv ─────────────────────────────────
  /** enäggstvilling: one egg cell (ringed) with one sperm that splits into two children who look exactly the same, with an orange = between them. */
  'gen.enäggstvilling': twins(true),
  /** tvåäggstvilling: two egg cells (ringed), each with its own sperm, giving two children who look different (boy and girl), with an orange ≠ between them. */
  'gen.tvåäggstvilling': twins(false),
  /** brås på: a father and his son side by side, both with the same big ears, curly red hair and freckles; orange dashed lines join the same features. */
  'gen.brås-på': all(bg(), face(36, 52, 22, RED_HAIR, { curly: true, freckles: true, ears: true }), face(88, 64, 15, RED_HAIR, { curly: true, freckles: true, ears: true }),
    line('M58 52 C66 48 70 56 72 62', HL, 2, '3 3'), line('M36 26 C56 16 78 30 86 46', HL, 2, '3 3'), path('M20 82 C24 96 48 96 52 82', C.navy, C.ink, 1.6), path('M80 86 C82 96 94 96 96 86', C.orange, C.ink, 1.4)),
  /** blandras: two grey parents of different breeds (a long low brown dog and a tall white dog with black spots) and below them, in colour and ringed, their young dog that mixes them: brown with black spots, one ear up and one ear down. */
  'gen.blandras': all(bg(), greyed(dog(30, 46, { body: '#8a4a2a', len: 28, leg: 5, s: 0.8 }), dog(88, 46, { body: C.white, len: 22, leg: 18, s: 0.8, spots: C.dark, ear: 'up' })), arr(38, 54, 54, 70, C.grey, 2.2), arr(80, 54, 66, 70, C.grey, 2.2),
    circle(60, 92, 20, MARK, null), dog(58, 108, { body: '#a06a3a', len: 22, leg: 10, s: 0.9, spots: C.dark, ear: 'mixed' }), ring(60, 92, 20)),
  /** växtförädling: a small grey wild tomato plant with tiny fruits; orange arrows lead through a middle plant to a big plant with big red tomatoes. */
  'gen.växtförädling': all(bg(), ground, greyed(plant(18, 112, 30, 2.4, 3)), arr(28, 90, 38, 90, HL, 2.2), plant(54, 112, 46, 4.4, 3), arr(66, 80, 76, 80, HL, 2.2), plant(96, 112, 86, 8, 3)),

  // ── 3527 Genteknikens metoder ───────────────────────────────────────
  /** genteknik: a lab bench with a test tube holding a small helix, a pipette dripping into it, scissors cutting a short ladder, and a dish with small rod-shaped bacteria. */
  'gen.genteknik': all(bg(), rect(4, 96, 112, 8, '#d9dee3', 2, C.ink, 1.6), tube(24, 94, 54, '#e3f1fa', 0.7), helixIcon(24, 70, 0.7), line('M24 8 L24 30', C.ink, 3), rect(20, 4, 8, 8, C.grey, 3, C.ink, 1.2),
    hLadder(50, 30, 58, 14, 7), scissors(80, 46, 0.9, -90), ellipse(84, 88, 22, 6, '#eef6fb', C.ink, 1.6), ...[[76, 87], [84, 89], [92, 86]].map(([a, b]) => rect((a ?? 0) - 3, (b ?? 0) - 1.4, 6, 2.8, '#9fd8a8', 1.4, C.ink, 0.6))),
  /** genmodifierad: a corn cob with a syringe putting a small helix into it, ringed; a plain grey corn cob as reference. */
  'gen.genmodifierad': all(bg(), ground, greyed(corn(22, 96, 1)), circle(70, 70, 30, MARK, null), corn(70, 82, 1.4), syringe(100, 38, 135, 0.8, helix(-10, -4, 8, 2, 0.5, 2, SEQ, 1.6)), ring(70, 70, 32)),
  /** gensax: a lying DNA ladder with orange scissors cutting it at exactly one rung; the cut is ringed and the two ends spread apart. */
  'gen.gensax': all(bg(), hLadder(6, 70, 48, 20, 6), hLadder(66, 70, 48, 20, 6, 'GCATGC'), line('M60 54 L60 86', HL, 1.6, '3 3'), scissors(48, 30, 1.2, 60), ring(60, 70, 18)),
  /** klona: one sheep on the left, an orange arrow, and two identical sheep on the right with = between them. */
  'gen.klona': all(bg('#eef6ea'), ground, sheep(22, 86, 1), arr(44, 70, 58, 58), arr(44, 80, 58, 92), sheep(78, 54, 0.85), sheep(78, 104, 0.85), sign(108, 82, '=', 18, HL)),
  /** DNA-test: a person rubbing a cotton swab inside the cheek, a small tube with the swab, and an envelope with an arrow to a small helix. */
  'gen.DNA-test': all(bg(), face(34, 50, 22, BROWN_HAIR, { long: true }), path('M20 80 C24 94 44 94 48 80', C.sky, C.ink, 1.6), swab(42, 60, -20, 1.1), ring(38, 58, 12), tube(76, 96, 40, '#eef6fb', 0.2, C.sky), swab(76, 70, 90, 0.8),
    envelope(100, 92, 0.8), arr(100, 78, 100, 56, HL, 2.2), helixIcon(100, 32, 0.6)),
  /** faderskapstest: a man and a child; under each a DNA profile strip, and orange dashed lines join the bands that match; a green check. */
  'gen.faderskapstest': all(bg(), ground, figure({ x: 28, h: 0.62, hair: BROWN_HAIR, top: C.navy }), kid(88, BROWN_HAIR, C.orange, 0.46), strip(6, 20, 46, [0.1, 0.35, 0.6, 0.85]), strip(68, 20, 46, [0.1, 0.25, 0.6, 0.75]),
    line('M10 34 L72 34', HL, 1.4, '2 2'), line('M32 36 L94 36', HL, 1.4, '2 2'), check(60, 52, 0.9)),
  /** genterapi: a syringe with a small helix inside, injecting into a cell with a damaged red band that turns green; a green check. */
  'gen.genterapi': all(bg(), syringe(34, 34, 45, 1.1, helix(-10, -5, 10, 3, 0.5, 3, SEQ, 1.8)), circle(78, 78, 28, '#fde8d2', C.ink, 1.8), circle(82, 74, 12, CHROM, C.ink, 1.4), rect(76, 72, 12, 4, OK, 1, C.ink, 1), ring(78, 78, 31), check(106, 108 - 6, 0.8)),
};
