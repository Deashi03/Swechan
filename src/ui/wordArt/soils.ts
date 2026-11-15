/**
 * Natur & geografi → Landskap & geologi → Mark & jordarter, 2551–2557 (0.42): sand and gravel, clay and silt,
 * topsoil and humus, soil formation, erosion and weathering, landslides and rockfalls, and land use.
 * Recurring signs: the ground drawn as a cut (a block seen from the side) whose layers show what the word names;
 * grain size as dots of clearly different sizes (gravel = pebbles, sand = small dots, silt = very fine dots,
 * clay = smooth blue-grey); water as light blue drops and dark blue arrows; the thing the word names ringed or
 * bracketed in orange. Weathering happens in place (no arrows away), transport has arrows; a fall goes straight
 * down, a slide moves along the slope. Abstract adjectives are small symbolic scenes: the coloured idea dominates
 * and a grey copy stands beside it as contrast. Digits only; no words, no brands and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { type Build } from './figures';
import { HL, arm } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const PAPER = '#f6f2ea';
const SKY = '#d6ecf7';
const GRASS = '#8cc96a';
const GRASS2 = '#6aa84f';
const SAND = '#ecd29a';
const SAND2 = '#c9a868';
const GRAVEL = '#b9ab95';
const PEB = ['#9a948c', '#c2b49c', '#8a8070', '#d8ccb6', '#a89880'];
const CLAY = '#9fa9b4';
const CLAY2 = '#7d8894';
const SILT = '#cfc2a6';
const TOP = '#4a3426';
const SOIL = '#8a6040';
const SOIL2 = '#6e4a30';
const PALE = '#cfccc4';
const RUST = '#c0682e';
const BED = '#9a948c';
const WATER = '#8cc7e8';
const WATER2 = '#3f86c0';
const LEAF = '#d9a03a';
const NEEDLE = '#2f6e4a';
const WOOD = '#a0673d';
const STEEL = '#b9c1c9';
const ASPH = '#3a3b42';
const HAT = '#f2c14e';
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (x: number, y: number, r: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${r}) scale(${s})`, ...k);
const bg = (col: string = PAPER) => rect(4, 4, 112, 108, col, 3, null);
const ground = line('M4 112 L116 112', C.grey2, 2);
/** Deterministic pseudo-random numbers in [0, 1). */
const rng = (seed: number) => { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; };
const clip = (id: string, d: string, ...k: Svg[]) => `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${k.join('')}</g>`;
const rectD = (x: number, y: number, w: number, h: number) => `M${x} ${y} L${x + w} ${y} L${x + w} ${y + h} L${x} ${y + h} Z`;
const ring = (x: number, y: number, rx: number, ry = rx) => ellipse(x, y, rx, ry, 'none', HL, 2.4);
const bracket = (x: number, y1: number, y2: number, side = 1) => line(`M${x} ${y1} L${x + 4 * side} ${y1} L${x + 4 * side} ${y2} L${x} ${y2}`, HL, 2.4);

// ── Textures ─────────────────────────────────────────────────────────
const dots = (x: number, y: number, w: number, h: number, n: number, col: string, seed: number, rr = 0.7) => {
  const r = rng(seed);
  return all(...Array.from({ length: n }, () => circle(f1(x + 1 + r() * (w - 2)), f1(y + 1 + r() * (h - 2)), rr, col, null)));
};
/** Rounded pebbles over a rectangle. */
const pebbles = (x: number, y: number, w: number, h: number, n: number, r0: number, r1: number, seed: number, cols: string[] = PEB, sw = 0.8) => {
  const r = rng(seed);
  return all(...Array.from({ length: n }, (_, i) => { const rr = r0 + r() * (r1 - r0); return ellipse(f1(x + rr + r() * (w - 2 * rr)), f1(y + rr + r() * (h - 2 * rr)), f1(rr), f1(rr * 0.78), cols[i % cols.length]!, C.ink, sw); }));
};
/** A small angular stone. */
const shard = (x: number, y: number, s: number, col: string, seed: number, sw = 1) => {
  const r = rng(seed);
  const p = Array.from({ length: 5 }, (_, i) => { const a = (i / 5) * Math.PI * 2 + r() * 0.5; const d = s * (0.7 + r() * 0.5); return `${f1(x + Math.cos(a) * d)} ${f1(y + Math.sin(a) * d)}`; });
  return path(`M${p.join(' L')} Z`, col, C.ink, sw);
};
const sandTex = (x: number, y: number, w: number, h: number, seed: number, col = SAND) => all(rect(x, y, w, h, col, 0, null), dots(x, y, w, h, Math.round(w * h / 9), SAND2, seed, 0.8));
const gravelTex = (x: number, y: number, w: number, h: number, seed: number) => all(rect(x, y, w, h, GRAVEL, 0, null), pebbles(x, y, w, h, Math.round(w * h / 30), 2, 4, seed));
const clayTex = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, CLAY, 0, null), line(`M${x + 4} ${y + h * 0.4} q${w * 0.2} -2 ${w * 0.4} 0 M${x + w * 0.5} ${y + h * 0.75} q${w * 0.2} -2 ${w * 0.4} 0`, CLAY2, 0.8));
const soilTex = (x: number, y: number, w: number, h: number, col: string, seed: number, dot = '#3a2a1e') => all(rect(x, y, w, h, col, 0, null), dots(x, y, w, h, Math.round(w * h / 22), dot, seed, 0.8));
/** A cut through the ground: layers [height, texture-maker] from the top, with an outline and an optional grass top. */
type Layer = [number, (x: number, y: number, w: number, h: number) => Svg];
const cut = (x: number, y: number, w: number, layers: Layer[], grass = true) => {
  let yy = y; const out: Svg[] = [];
  for (const [h, tex] of layers) { out.push(tex(x, yy, w, h)); yy += h; }
  const lines = layers.slice(0, -1).reduce<{ y: number; d: string[] }>((a, [h]) => { a.y += h; a.d.push(`M${x} ${f1(a.y)} L${x + w} ${f1(a.y)}`); return a; }, { y, d: [] }).d;
  return all(...out, lines.length ? line(lines.join(' '), 'rgba(43,42,51,0.5)', 0.9) : '', grass ? rect(x, y - 3, w, 3, GRASS, 0, C.ink, 0.9) : '', rect(x, y, w, yy - y, 'none', 0, C.ink, 1.4));
};
const L = (h: number, col: string, seed = 1, dot = '#3a2a1e'): Layer => [h, (x, y, w, hh) => soilTex(x, y, w, hh, col, seed, dot)];
const flat = (h: number, col: string): Layer => [h, (x, y, w, hh) => rect(x, y, w, hh, col, 0, null)];

// ── Things ───────────────────────────────────────────────────────────
const tree = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s, rect(-1.6, -9, 3.2, 9, WOOD, 0.5, C.ink, 0.9), circle(0, -14, 7, col, C.ink, 1));
const conifer = (x: number, y: number, s = 1, col: string = NEEDLE) => at(x, y, s, rect(-1.4, -5, 2.8, 5, WOOD, 0.4, C.ink, 0.8), path('M0 -30 L-7 -18 L-4 -18 L-9 -10 L-5 -10 L-10 -4 L10 -4 L5 -10 L9 -10 L4 -18 L7 -18 Z', col, C.ink, 1));
const house = (x: number, y: number, s = 1, col = '#c0563d') => at(x, y, s, rect(-12, -14, 24, 14, col, 0.5, C.ink, 1.3), path('M-15 -14 L0 -26 L15 -14 Z', C.dark, C.ink, 1.3), rect(-3, -9, 6, 9, C.white, 0.5, C.ink, 1), rect(-10, -11, 5, 5, '#bfe3f5', 0.5, C.ink, 0.9), rect(5, -11, 5, 5, '#bfe3f5', 0.5, C.ink, 0.9));
const cloud = (x: number, y: number, s = 1, col = '#e8edf2') => at(x, y, s, path('M-16 4 C-22 4 -22 -6 -14 -6 C-14 -14 -2 -16 2 -9 C6 -14 16 -12 15 -4 C22 -4 22 4 16 4 Z', col, C.ink, 1.2));
const rain = (x: number, y: number, w: number, n = 5, col = WATER2) => line(Array.from({ length: n }, (_, i) => `M${f1(x + (i * w) / Math.max(1, n - 1))} ${y} l-2 6`).join(' '), col, 1.6);
const sunG = (x: number, y: number, r = 7) => all(circle(x, y, r, C.yellow, C.ink, 1.1), line(Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 5))} ${f1(y + Math.sin(a) * (r + 5))}`; }).join(' '), C.orange, 1.3));
const flake = (x: number, y: number, r = 5, col = '#5aa8d8') => line(`M${x - r} ${y} L${x + r} ${y} M${f1(x - r / 2)} ${f1(y - r * 0.87)} L${f1(x + r / 2)} ${f1(y + r * 0.87)} M${f1(x - r / 2)} ${f1(y + r * 0.87)} L${f1(x + r / 2)} ${f1(y - r * 0.87)}`, col, 1.6);
const drop = (x: number, y: number, s = 1, col: string = WATER) => path(`M${x} ${f1(y - 5 * s)} C${f1(x + 4 * s)} ${y} ${f1(x + 3 * s)} ${f1(y + 4 * s)} ${x} ${f1(y + 4 * s)} C${f1(x - 3 * s)} ${f1(y + 4 * s)} ${f1(x - 4 * s)} ${y} ${x} ${f1(y - 5 * s)} Z`, col, C.ink, 0.9);
const worm = (x: number, y: number, s = 1, r = 0) => rot(x, y, r, s, path('M-14 0 C-10 -6 -4 6 0 0 C4 -6 10 6 14 0', 'none', C.ink, 5.4), path('M-14 0 C-10 -6 -4 6 0 0 C4 -6 10 6 14 0', 'none', '#d98a86', 3.8), line('M-3 2 L-1 -2', '#b8605c', 1.2), circle(14, 0, 0.6, C.ink, null));
const mushroom = (x: number, y: number, s = 1, col = '#c0563d') => at(x, y, s, path('M-2.5 0 L-2 -8 L2 -8 L2.5 0 Z', '#f3ead8', C.ink, 1), path('M-9 -8 C-9 -18 9 -18 9 -8 Z', col, C.ink, 1.1), circle(-3, -12, 1.2, C.white, null), circle(3, -13, 1, C.white, null));
const leaf = (x: number, y: number, s = 1, r = 0, col: string = LEAF) => rot(x, y, r, s, path('M-7 0 C-4 -5 4 -5 7 0 C4 5 -4 5 -7 0 Z', col, C.ink, 0.9), line('M-6 0 L6 0', 'rgba(43,42,51,0.45)', 0.7));
const holeyLeaf = (x: number, y: number, s = 1) => at(x, y, s, path('M-7 0 C-4 -5 4 -5 7 0 C4 5 -4 5 -7 0 Z', '#b8862e', C.ink, 0.9), circle(-2, -1, 1.4, PAPER, C.ink, 0.6), circle(3, 1, 1.8, PAPER, C.ink, 0.6), circle(1, -2.4, 0.9, PAPER, C.ink, 0.6));
const needle = (x: number, y: number, r = 0) => rot(x, y, r, 1, line('M-4 0 L4 0', '#9a7a3a', 1.3));
const twig = (x: number, y: number, r = 0) => rot(x, y, r, 1, line('M-7 0 L7 0 M0 0 L3 -3', WOOD, 1.4));
const spade = (x: number, y: number, s = 1, r = 0) => rot(x, y, r, s, rect(-1.3, -30, 2.6, 26, WOOD, 1, C.ink, 0.9), path('M-5 -4 L5 -4 L4 6 C2 9 -2 9 -4 6 Z', STEEL, C.ink, 1), rect(-4, -33, 8, 3, WOOD, 1, C.ink, 0.8));
const pot = (x: number, y: number, s = 1, col = '#c9733a') => at(x, y, s, path('M-9 -12 L9 -12 L7 0 L-7 0 Z', col, C.ink, 1.2), rect(-10, -14, 20, 3, col, 1, C.ink, 1.1));
const flower = (x: number, y: number, s = 1, col: string = C.pink) => at(x, y, s, line('M0 0 L0 -12', C.green, 1.6), ellipse(-3, -6, 3, 1.5, C.green, C.ink, 0.6), ...[0, 72, 144, 216, 288].map((a) => rot(0, -14, a, 1, ellipse(0, -3, 2, 3, col, C.ink, 0.6))), circle(0, -14, 1.6, C.yellow, null));
const lens = (x: number, y: number, r: number, inner: Svg, id: string) => all(line(`M${f1(x + r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r * 1.5)} ${f1(y + r * 1.5)}`, C.ink, 4.5), line(`M${f1(x + r * 0.75)} ${f1(y + r * 0.75)} L${f1(x + r * 1.45)} ${f1(y + r * 1.45)}`, WOOD, 2.6),
  circle(x, y, r, C.white, null), clip(id, `M${x - r} ${y} A${r} ${r} 0 1 0 ${x + r} ${y} A${r} ${r} 0 1 0 ${x - r} ${y} Z`, inner), circle(x, y, r, 'rgba(200,230,250,0.18)', C.ink, 2.2));
const jar = (x: number, y: number, w: number, h: number, inner: Svg, id: string) => all(clip(id, rectD(x, y - h, w, h), inner), rect(x, y - h, w, h, 'rgba(220,240,252,0.25)', 3, C.ink, 1.4), rect(x - 1, y - h - 4, w + 2, 4, STEEL, 1, C.ink, 1), line(`M${x + 3} ${y - h + 4} L${x + 3} ${y - 6}`, 'rgba(255,255,255,0.7)', 1.4));
const cow = (x: number, y: number, s = 1, flip = false) => g(`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`, ...[-12, -6, 8, 13].map((d) => rect(d - 2, -8, 4, 8, C.white, 1, C.ink, 1)), ellipse(0, -14, 17, 8, C.white, C.ink, 1.3), ellipse(-5, -15, 5, 3.5, C.dark, null), ellipse(7, -12, 4, 3, C.dark, null),
  path('M14 -18 L24 -20 L26 -12 L18 -10 Z', C.white, C.ink, 1.2), ellipse(25, -12.5, 2.4, 1.8, '#f2b6b6', C.ink, 0.6), line('M18 -20 L18 -24 M22 -20 L23 -24', C.ink, 1.2), circle(21, -16, 0.9, C.ink, null), line('M-17 -16 L-20 -8', C.ink, 1.2));
const fence = (x1: number, x2: number, y: number) => all(line(`M${x1} ${y - 8} L${x2} ${y - 8} M${x1} ${y - 3} L${x2} ${y - 3}`, WOOD, 1.4), ...Array.from({ length: Math.floor((x2 - x1) / 12) + 1 }, (_, i) => rect(x1 + i * 12 - 1, y - 11, 2.4, 11, WOOD, 0.4, C.ink, 0.7)));
const stump = (x: number, y: number, s = 1) => at(x, y, s, path('M-5 0 L-4 -6 L4 -6 L5 0 Z', WOOD, C.ink, 1), ellipse(0, -6, 4, 1.6, '#e3c48a', C.ink, 0.8), line('M-5 0 L-8 2 M5 0 L8 2', WOOD, 1.4));
const logs = (x: number, y: number, s = 1) => at(x, y, s, ...[[-8, 0], [0, 0], [8, 0], [-4, -7], [4, -7], [0, -14]].map(([a, b]) => all(circle(a!, b! - 4, 4, '#e3c48a', C.ink, 1), circle(a!, b! - 4, 1.6, 'none', WOOD, 0.8))));
const factory = (x: number, y: number, s = 1) => at(x, y, s, rect(-18, -16, 30, 16, '#a8a29a', 1, C.ink, 1.2), path('M-18 -16 L-12 -22 L-12 -16 L-6 -22 L-6 -16 L0 -22 L0 -16', '#a8a29a', C.ink, 1.1), rect(4, -40, 6, 24, '#8a847c', 0.5, C.ink, 1.1),
  rect(-14, -10, 5, 5, '#f6d78a', 0.5, C.ink, 0.7), rect(-6, -10, 5, 5, '#f6d78a', 0.5, C.ink, 0.7));
const smoke = (x: number, y: number) => all(circle(x, y, 4, '#7a7a80', null), circle(x + 5, y - 5, 5, '#6e6e74', null), circle(x + 12, y - 8, 6, '#66666c', null));
const roller = (x: number, y: number, s = 1) => at(x, y, s, rect(-6, -20, 22, 10, HAT, 2, C.ink, 1.2), rect(0, -32, 12, 12, HAT, 2, C.ink, 1.2), rect(2, -30, 8, 6, '#bfe3f5', 1, C.ink, 0.9), circle(-12, -9, 9, STEEL, C.ink, 1.3), circle(-12, -9, 3, '#8a929a', null), circle(16, -6, 6, C.dark, C.ink, 1.2), circle(16, -6, 2, C.grey, null));
const harvester = (x: number, y: number, s = 1) => at(x, y, s, rect(-16, -12, 28, 8, '#4f9d69', 2, C.ink, 1.2), ...[-11, -3, 5].map((d) => circle(d, -4, 4, C.dark, C.ink, 1)), rect(-14, -24, 12, 12, '#4f9d69', 2, C.ink, 1.2), rect(-12, -22, 8, 6, '#bfe3f5', 1, C.ink, 0.9),
  line('M8 -12 L18 -30 L28 -22', '#e0b23c', 3.2), line('M8 -12 L18 -30 L28 -22', C.ink, 0.6), rect(25, -26, 8, 8, C.dark, 1, C.ink, 1));
const candle = (x: number, y: number) => all(rect(x - 2.5, y - 12, 5, 12, '#f6f2ea', 1, C.ink, 1), path(`M${x} ${y - 19} C${x + 3} ${y - 15} ${x + 2} ${y - 12} ${x} ${y - 12} C${x - 2} ${y - 12} ${x - 3} ${y - 15} ${x} ${y - 19} Z`, C.orange, C.ink, 0.7), circle(x, y - 14, 1, C.yellow, null));
const geo = (x: number, h = 1, y0 = 112) => { const s = 0.84 * h, ty = y0 - 49 * s; return { s, ty, hy: ty - 56 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}, y0 = 112) =>
  y0 === 112 ? F({ x, top, mood, ...more }) : g(`translate(0 ${f1(y0 - 112)})`, F({ x, top, mood, ...more }));
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number, y0 = 112) => { const q = geo(x, h, y0); return all(arm(f1(side < 0 ? q.sl : q.sr), f1(q.sy), tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };
/** A small soil column (for the symbol pairs): x, y top, w, h with texture. */
const column = (x: number, y: number, w: number, h: number, tex: Svg, id: string) => all(clip(id, rectD(x, y, w, h), tex), rect(x, y, w, h, 'none', 2, C.ink, 1.4));

export const SOIL_MOTIFS: Record<string, Svg> = {
  // ── 2551 Sand och grus ──
  /** jordart: three glass jars side by side filled with three loose materials – pebbly gravel, fine yellow sand and smooth blue-grey clay – grouped by an orange bracket above. */
  'jord.jordart': all(bg(), ground, jar(10, 110, 28, 52, gravelTex(10, 58, 28, 52, 3), 'jA1'), jar(46, 110, 28, 52, sandTex(46, 58, 28, 52, 5), 'jA2'), jar(82, 110, 28, 52, clayTex(82, 58, 28, 52), 'jA3'),
    line('M16 44 L16 38 L104 38 L104 44', HL, 2.4)),
  /** sand: a beach – a heap of fine yellow sand with a sandcastle, a red bucket and a little spade, the sea behind. */
  'jord.sand': all(bg(SKY), rect(4, 52, 112, 18, WATER, 0, null), line('M10 58 q4 -2 8 0 M40 62 q4 -2 8 0 M80 57 q4 -2 8 0', C.white, 1.2), path('M4 112 L4 70 C30 64 90 64 116 70 L116 112 Z', SAND, C.ink, 1.4), dots(4, 70, 112, 42, 220, SAND2, 7, 0.8),
    rect(42, 82, 30, 18, SAND, 0, C.ink, 1.2), rect(38, 74, 10, 26, SAND, 0, C.ink, 1.2), rect(66, 74, 10, 26, SAND, 0, C.ink, 1.2), path('M38 74 l2 -3 l2 3 l2 -3 l2 3 l2 -3 l0 3 M66 74 l2 -3 l2 3 l2 -3 l2 3 l2 -3 l0 3', 'none', C.ink, 1), rect(54, 90, 6, 10, '#a8844a', 3, C.ink, 1),
    path('M88 92 L104 92 L102 106 L90 106 Z', C.red, C.ink, 1.3), path('M88 92 C88 82 104 82 104 92', 'none', C.ink, 1.2), spade(22, 104, 0.6, -30)),
  /** grus: a big heap of small rounded grey-brown stones beside a gravel path, with a shovel stuck in the heap. */
  'jord.grus': all(bg(SKY), ground, clip('jGr', 'M10 112 C24 70 50 50 64 50 C80 50 102 76 112 112 Z', gravelTex(8, 48, 106, 66, 11)), path('M10 112 C24 70 50 50 64 50 C80 50 102 76 112 112 Z', 'none', C.ink, 1.6), spade(80, 64, 1, 20)),
  /** sandkorn: a heap of sand, and above it a magnifying lens showing one single big rounded grain, ringed in orange, with a few tiny grains around it. */
  'jord.sandkorn': all(bg(), ground, path('M8 112 C20 92 44 86 60 86 C78 86 100 94 112 112 Z', SAND, C.ink, 1.4), dots(8, 86, 104, 26, 140, SAND2, 13, 0.7),
    lens(54, 46, 26, all(rect(28, 20, 52, 52, '#fbf6ea', 0, null), ellipse(54, 46, 11, 8.5, '#e6c88a', C.ink, 1.4), ellipse(50, 43, 3, 2, 'rgba(255,255,255,0.7)', null), circle(34, 32, 1.4, SAND2, null), circle(72, 60, 1.6, SAND2, null), circle(70, 30, 1.2, SAND2, null)), 'jSk'), ring(54, 46, 15, 12)),
  /** kornstorlek: a row of grains from tiny to big – a smooth smear, very fine dots, small sand dots, small pebbles, a large stone – above a ruler, with an orange arrow growing from left to right. */
  'jord.kornstorlek': all(bg(), rect(8, 92, 104, 12, '#f2e2b0', 1, C.ink, 1.2), line(Array.from({ length: 21 }, (_, i) => `M${8 + i * 5.2} 92 l0 ${i % 5 ? 3 : 6}`).join(' '), C.ink, 0.9),
    ellipse(18, 74, 8, 4, CLAY, C.ink, 1), dots(30, 68, 14, 12, 40, '#8a7a5a', 17, 0.4), dots(50, 66, 16, 14, 18, SAND2, 19, 1.2), pebbles(70, 64, 16, 16, 4, 3, 4, 21), ellipse(100, 72, 10, 8, PEB[0]!, C.ink, 1.2),
    arrow(14, 46, 108, 46, HL, 3), line('M14 46 L14 46', HL, 1)),
  /** sandig: a coloured sneaker on a wooden floor indoors, covered all over with sand grains, a few grains trickling out of it; beside it the same sneaker in grey, clean, as contrast. */
  'jord.sandig': all(bg(), rect(4, 96, 112, 16, '#d8b48a', 0, null), line('M4 96 L116 96 M4 104 L116 104 M30 96 L30 104 M76 96 L76 104 M52 104 L52 112 M98 104 L98 112', '#a8845a', 1), ground,
    path('M10 94 L12 70 C12 64 22 62 28 66 L40 74 C52 76 64 80 66 88 L66 94 Z', '#e8574a', C.ink, 1.6), path('M10 94 L66 94 L66 98 L10 98 Z', C.white, C.ink, 1.3), line('M24 70 L32 76 M28 68 L36 74 M32 72 L40 78', C.white, 1.6),
    dots(14, 66, 50, 30, 60, SAND2, 29, 1.1), dots(14, 84, 50, 14, 40, '#a8844a', 31, 1), ...[[70, 94], [74, 96], [72, 92], [78, 95]].map(([x, y]) => circle(x!, y!, 1.1, SAND2, null)),
    greyed(path('M80 94 L81 80 C81 76 87 75 90 77 L97 82 C104 83 111 85 112 90 L112 94 Z', '#e8574a', C.ink, 1.4), path('M80 94 L112 94 L112 97 L80 97 Z', C.white, C.ink, 1.1))),
  /** genomsläpplig: a coloured column of sand under rain, the drops running down through it (arrows) and out at the bottom; beside it a grey column of clay with the water lying as a pool on top. */
  'jord.genomsläpplig': all(bg(), ground, column(14, 46, 38, 56, sandTex(14, 46, 38, 56, 37), 'jGs1'), cloud(33, 18, 0.9, '#cfdbe6'), rain(22, 28, 22, 5), ...[24, 33, 42].map((x, i) => all(drop(x, 58 + i * 12, 0.8), arrow(x, 66 + i * 12, x, 74 + i * 12, WATER2, 1.6))),
    drop(26, 108, 0.8), drop(40, 108, 0.8), greyed(column(70, 52, 38, 50, clayTex(70, 52, 38, 50), 'jGs2'), ellipse(89, 50, 18, 3, WATER, C.ink, 1), cloud(89, 18, 0.9), rain(78, 28, 22, 5))),
  // ── 2552 Lera och silt ──
  /** lera: two hands shaping a smooth blue-grey lump of wet clay on a board, with a thumbprint dent in it; a small finished clay bowl stands beside. */
  'jord.lera': all(bg(), rect(10, 92, 100, 8, WOOD, 2, C.ink, 1.4), path('M30 92 C26 70 40 58 56 58 C74 58 86 70 82 92 Z', CLAY, C.ink, 1.6), ellipse(52, 72, 5, 3.4, CLAY2, null), line('M38 80 q6 -3 12 0 M58 84 q6 -3 12 0', CLAY2, 1),
    g('translate(0 0)', line('M8 70 L22 72', C.ink, 10), line('M8 70 L22 72', C.skin, 7.6), circle(25, 73, 5.4, C.skin, C.ink, 1.3), line('M112 70 L92 74', C.ink, 10), line('M112 70 L92 74', C.skin, 7.6), circle(89, 75, 5.4, C.skin, C.ink, 1.3)),
    path('M92 92 L90 84 L108 84 L106 92 Z', CLAY, C.ink, 1.2)),
  /** silt: three small heaps under a lens strip – coarse sand on the left, very fine powdery silt in the middle ringed in orange, smooth clay on the right; fingers rub the fine silt like flour. */
  'jord.silt': all(bg(), ground, path('M8 112 C10 96 32 96 34 112 Z', SAND, C.ink, 1.2), dots(10, 98, 22, 14, 26, SAND2, 51, 1.3), path('M42 112 C44 88 76 88 78 112 Z', SILT, C.ink, 1.4), dots(44, 92, 32, 20, 260, '#a8987a', 53, 0.35),
    path('M86 112 C88 96 110 96 112 112 Z', CLAY, C.ink, 1.2), ring(60, 100, 22, 15), line('M50 60 L60 76', C.ink, 9), line('M50 60 L60 76', C.skin, 6.6), circle(61, 78, 4.6, C.skin, C.ink, 1.2), line('M74 60 L66 76', C.ink, 9), line('M74 60 L66 76', C.skin, 6.6), circle(65, 78, 4.6, C.skin, C.ink, 1.2),
    dots(56, 80, 14, 8, 24, '#a8987a', 55, 0.4)),
  /** lerjord: a flat field cut open – a thin dark top, then thick smooth blue-grey clay – with rainwater standing in puddles on the surface because it cannot sink in. */
  'jord.lerjord': all(bg(SKY), cut(4, 52, 112, [L(12, SOIL, 61), [48, (x, y, w, h) => clayTex(x, y, w, h)]]), ellipse(30, 49, 14, 2.6, WATER, C.ink, 1), ellipse(84, 49, 18, 2.6, WATER, C.ink, 1), cloud(60, 22, 1), rain(48, 32, 24, 5),
    ...[20, 50, 80, 100].map((x) => line(`M${x} 46 l0 -6 M${x - 3} 44 l3 -4 l3 4`, GRASS2, 1.2))),
  /** lerig: a coloured dirt road through a field, full of wet brown mud with deep wheel ruts and puddles of water; beside it, grey, a dry gravel road as contrast. */
  'jord.lerig': all(bg(SKY), rect(4, 48, 112, 64, GRASS, 0, null), path('M30 48 L44 48 L76 112 L4 112 Z', '#7a5a3e', C.ink, 1.3), line('M35 50 L18 112 M40 50 L56 112', '#5a4030', 3), line('M35 50 L18 112 M40 50 L56 112', '#8a6a4e', 1),
    ellipse(30, 96, 10, 3, WATER, C.ink, 0.9), ellipse(44, 78, 6, 2, WATER, C.ink, 0.8), ellipse(36, 64, 4, 1.4, WATER, C.ink, 0.7), ellipse(58, 104, 7, 2.2, WATER, C.ink, 0.8), ellipse(16, 106, 5, 1.6, '#5a4030', null), ellipse(48, 90, 4, 1.4, '#5a4030', null),
    greyed(path('M88 48 L96 48 L116 112 L80 112 Z', '#d0c8b8', C.ink, 1.2), dots(82, 50, 32, 62, 50, '#8a8070', 251, 1)), line('M4 48 L116 48', C.ink, 1)),
  /** avsätta (2): a river flows from the left into a calm lake; where the water slows down, fine grains sink (small arrows) and settle on the bottom in a growing layer, ringed in orange. */
  'jord.avsätta.2': all(bg(SKY), rect(4, 40, 112, 72, '#b8dcef', 0, null), path('M4 40 L40 40 L40 62 L4 62 Z', WATER2, null), arrow(8, 50, 34, 50, C.white, 2.4), dots(8, 44, 30, 14, 20, SAND2, 71, 1.1),
    ...[[52, 54], [64, 60], [76, 64], [90, 68]].map(([x, y]) => all(circle(x!, y!, 1.4, SAND2, null), arrow(x!, y! + 3, x!, y! + 12, '#6f7680', 1.4))),
    path('M40 112 L40 96 C60 88 90 90 116 94 L116 112 Z', SAND, C.ink, 1.2), path('M40 96 C60 88 90 90 116 94 L116 100 C90 96 60 94 40 102 Z', SAND2, null), dots(40, 92, 76, 20, 60, '#a8844a', 73, 0.8), ring(80, 96, 30, 7),
    rect(4, 62, 36, 50, '#a89878', 0, C.ink, 1), rect(4, 36, 112, 4, GRASS, 0, C.ink, 0.9)),
  /** dränera: a field cut open with a perforated pipe lying in the soil; water drops seep into the pipe and run out of its end into a ditch, arrows showing the way. */
  'jord.dränera': all(bg(SKY), cut(4, 44, 84, [L(16, SOIL, 75), [52, (x, y, w, h) => clayTex(x, y, w, h)]]), path('M88 41 L96 70 L108 70 L116 41 L116 112 L88 112 Z', '#7a5a3e', C.ink, 1.2), rect(96, 64, 12, 6, WATER, 0, null),
    rect(10, 74, 82, 9, '#f0ece2', 4, C.ink, 1.3), ...[18, 30, 42, 54, 66, 78].map((x) => circle(x, 78.5, 1.4, C.ink, null)), ...[24, 48, 72].map((x) => all(drop(x, 62, 0.8), arrow(x, 66, x, 72, WATER2, 1.4))), arrow(84, 78, 100, 68, WATER2, 2.4),
    ...[16, 40, 64].map((x) => line(`M${x} 40 l0 -6 M${x - 3} 38 l3 -4 l3 4`, GRASS2, 1.2))),

  // ── 2553 Matjord och humus ──
  /** humus: a cut through the ground – brown leaves lying on top and rotting into a thick, almost black layer ringed in orange, with lighter soil below. */
  'jord.humus': all(bg(), cut(4, 48, 112, [L(24, TOP, 81, '#2a1c14'), L(40, '#b89a74', 83, '#8a7050')], false), leaf(20, 44, 1, 10), leaf(40, 46, 0.9, -20, '#c0782e'), holeyLeaf(62, 46, 1), leaf(86, 45, 1, 30, '#9a6a2a'), holeyLeaf(104, 46, 0.9),
    ...[[24, 56], [50, 62], [76, 54], [98, 64]].map(([x, y]) => holeyLeaf(x!, y!, 0.6)), rect(6, 48, 108, 24, 'none', 2, HL, 2.6)),
  /** organisk: a coloured group of things that once lived – a leaf, an apple core, a twig and a feather – inside an orange ring; beside it a grey stone and a grey screw as contrast. */
  'jord.organisk': all(bg(), ground, ring(42, 76, 36, 30), leaf(28, 62, 1.6, -20, C.green), path('M46 58 C40 58 40 70 44 72 C40 76 40 88 46 88 C52 88 52 76 48 72 C52 70 52 58 46 58 Z', '#f3e2b0', C.ink, 1.2), line('M46 58 L46 52', WOOD, 1.6), ellipse(49, 53, 3, 1.6, C.green, C.ink, 0.6),
    twig(30, 92, -10), path('M58 96 C62 84 66 78 70 74 C68 82 66 90 58 96 Z', C.white, C.ink, 1), greyed(ellipse(94, 94, 12, 9, '#9a948c', C.ink, 1.4), all(rect(86, 60, 16, 4, STEEL, 1, C.ink, 1), rect(92, 64, 4, 18, STEEL, 0.5, C.ink, 1), line('M92 68 L96 70 M92 72 L96 74 M92 76 L96 78', C.ink, 0.8)))),
  /** daggmask: a cut through dark soil with a long pink-brown earthworm crawling through its tunnel, and another poking out at the grassy surface. */
  'jord.daggmask': all(bg(SKY), cut(4, 40, 112, [L(72, SOIL, 91)]), path('M20 74 C34 64 50 84 70 72 C84 64 96 78 108 70', 'none', '#4a3022', 10), worm(46, 74, 1.6, 6), worm(86, 40, 0.8, -70), ...[20, 50, 100].map((x) => line(`M${x} 36 l0 -6 M${x - 3} 34 l3 -4 l3 4`, GRASS2, 1.2))),
  /** lucker: a cut through loose, crumbly soil full of air pockets – a spade slides easily all the way down (orange arrow); beside it, grey, a spade that stops at the surface of hard packed soil as contrast. */
  'jord.lucker': all(bg(SKY), column(6, 50, 60, 58, all(rect(6, 50, 60, 58, SOIL, 0, null), ...(() => { const r = rng(95); return Array.from({ length: 34 }, () => ellipse(f1(9 + r() * 54), f1(53 + r() * 52), f1(1.4 + r() * 2.2), f1(1 + r() * 1.4), '#f0e6d6', null)); })(), dots(6, 50, 60, 58, 60, '#4a3022', 97, 1.3)), 'jLu'),
    spade(36, 92, 1.1, 0), arrow(54, 26, 54, 48, HL, 2.6), rect(6, 47, 60, 3, GRASS, 0, C.ink, 0.9),
    greyed(column(76, 70, 36, 38, all(rect(76, 70, 36, 38, SOIL2, 0, null), line('M80 84 L92 80 M96 96 L108 90', C.ink, 1)), 'jLu2'), spade(94, 70, 0.9, 0), line('M86 66 L102 66', C.ink, 2.4))),
  /** nedbrytare: a dead brown leaf being eaten from all sides – a mushroom grows from it, an earthworm nibbles at its edge and a lens shows tiny bacteria on it. */
  'jord.nedbrytare': all(bg(), rect(4, 88, 112, 24, SOIL, 0, null), dots(4, 88, 112, 24, 50, '#4a3022', 101, 0.9), line('M4 88 L116 88', C.ink, 1.2), at(54, 86, 4, holeyLeaf(0, 0, 1)), mushroom(30, 90, 1.6), worm(86, 92, 0.9, -10),
    lens(78, 42, 18, all(rect(60, 24, 36, 36, '#f6efe0', 0, null), ...[[70, 36, 20], [80, 44, -30], [74, 50, 60], [86, 34, 10], [66, 46, -50]].map(([x, y, r]) => rot(x!, y!, r!, 1, rect(-3.5, -1.4, 7, 2.8, '#7aaa5a', 1.4, C.ink, 0.6)))), 'jNb')),
  /** bryta ner: a row of four steps from left to right with arrows – a whole leaf, the leaf full of holes with a worm, small crumbs, and a heap of dark soil. */
  'jord.bryta-ner': all(bg(), ground, leaf(16, 70, 1.6, -10, '#c0782e'), arrow(30, 70, 38, 70, HL, 2.4), holeyLeaf(48, 70, 1.4), worm(48, 86, 0.6), arrow(60, 70, 68, 70, HL, 2.4),
    ...[[74, 66], [80, 72], [77, 76], [84, 66], [86, 74]].map(([x, y], i) => path(`M${x} ${y} l3 -1 l1 3 l-3 1 Z`, i % 2 ? '#b8862e' : '#8a5a2a', C.ink, 0.6)), arrow(90, 70, 96, 70, HL, 2.4), path('M94 82 C96 62 112 62 114 82 Z', TOP, C.ink, 1.2), dots(97, 66, 15, 14, 18, '#2a1c14', 105, 0.9)),
  /** förna: a forest floor cut open under a spruce – on top a loose layer of fallen leaves, needles and twigs ringed in orange, dark soil below. */
  'jord.förna': all(bg(SKY), conifer(30, 58, 1.4), tree(92, 58, 1.4), cut(4, 66, 112, [L(46, SOIL2, 107)], false), rect(4, 58, 112, 8, '#c9a26a', 0, C.ink, 1), ...(() => { const r = rng(109); return Array.from({ length: 26 }, (_, i) => { const x = 8 + r() * 104, y = 59 + r() * 6, a = r() * 180; return i % 3 === 0 ? leaf(f1(x), f1(y), 0.5, f1(a), i % 2 ? LEAF : '#a8642a') : i % 3 === 1 ? needle(f1(x), f1(y), f1(a)) : twig(f1(x), f1(y), f1(a)); }); })(),
    ring(60, 62, 56, 8)),
  /** gödsla: a gardener tips a bucket of dark compost onto a vegetable bed with small plants, the compost spreading over the soil. */
  'jord.gödsla': all(bg(SKY), rect(4, 96, 112, 16, SOIL, 0, C.ink, 1.2), dots(4, 96, 112, 16, 40, '#4a3022', 111, 0.9), ...[56, 72, 88, 104].map((x) => all(line(`M${x} 96 L${x} 86`, C.green, 1.6), ellipse(x - 3, 88, 3.4, 1.6, C.green, C.ink, 0.6), ellipse(x + 3, 86, 3.4, 1.6, C.green, C.ink, 0.6))),
    fig(24, '#6a9a5a', 'smile', { h: 0.9, bottom: '#3d4a66' }), rot(50, 62, 50, 1, path('M-8 -8 L8 -8 L6 8 L-6 8 Z', '#8a929a', C.ink, 1.2)), reach(24, 0.9, 1, 44, 56), path('M54 68 C58 76 62 84 66 94 L50 94 C52 84 52 76 54 68 Z', TOP, null), dots(52, 70, 14, 24, 20, '#2a1c14', 113, 0.9), path('M48 96 C56 92 72 92 80 96 Z', TOP, C.ink, 1)),
  /** planteringsjord: an open plastic sack (with only a flower picture on it) pouring dark soil into a flowerpot on a balcony floor. */
  'jord.planteringsjord': all(bg(), ground, rot(40, 70, -30, 1, path('M-18 -30 L18 -30 L20 30 L-20 30 Z', '#3a8a5a', C.ink, 1.6), rect(-10, -10, 20, 20, '#f6f2ea', 2, C.ink, 1), flower(0, 8, 0.9), path('M-18 -30 L-14 -36 L14 -36 L18 -30', TOP, C.ink, 1.2)),
    path('M56 46 C64 56 70 70 78 84 L70 86 C66 72 60 60 54 50 Z', TOP, null), dots(56, 52, 20, 32, 20, '#2a1c14', 115, 0.9), pot(82, 110, 1.6), ellipse(82, 88, 14, 3, TOP, C.ink, 1)),

  // ── 2554 Jordmånsbildning ──
  /** barrskog: a dense forest of dark green, pointed spruce and pine trees on a hillside. */
  'jord.barrskog': all(bg(SKY), path('M4 112 L4 84 C40 74 80 74 116 82 L116 112 Z', GRASS2, C.ink, 1.2), ...[[16, 92, 1.3], [34, 86, 1.6], [52, 84, 1.4], [70, 86, 1.7], [88, 84, 1.4], [104, 90, 1.3], [24, 108, 1.2], [60, 108, 1.4], [96, 108, 1.2]].map(([x, y, s]) => conifer(x!, y!, s!, (x! + y!) % 3 ? NEEDLE : '#24583a'))),
  /** lövskog: a forest of broad, round-crowned leafy trees in fresh greens. */
  'jord.lövskog': all(bg(SKY), path('M4 112 L4 84 C40 74 80 74 116 82 L116 112 Z', GRASS, C.ink, 1.2), ...[[18, 92, 1.5], [44, 86, 1.9], [72, 88, 1.7], [98, 86, 1.8], [30, 110, 1.6], [84, 110, 1.5]].map(([x, y, s], i) => tree(x!, y!, s!, ['#5aa04a', '#7ab84a', '#4f9d69'][i % 3]!))),
  /** jordmån: a cut through the ground under a plant, with sun, rain and a worm acting on it; the top layers, changed by them, are bracketed in orange, and the unchanged grey material and bedrock lie below. */
  'jord.jordmån': all(bg(SKY), sunG(20, 18, 6), cloud(90, 16, 0.8), rain(82, 24, 16, 4), cut(4, 48, 112, [L(8, TOP, 121, '#2a1c14'), L(12, '#a08060', 123), L(14, '#c09a6a', 125), [16, (x, y, w, h) => all(rect(x, y, w, h, '#b8b2a8', 0, null), pebbles(x, y, w, h, 12, 1.5, 3, 127))], flat(14, BED)]),
    tree(60, 45, 1.3), line('M60 48 L54 64 M60 48 L66 66 M60 48 L60 70', '#f0e0c0', 1.2), worm(30, 62, 0.6), bracket(116, 48, 82, -1), line('M108 48 L116 48 M108 82 L116 82', HL, 2.4)),
  /** markprofil: a dug pit seen from the side – its straight wall shows coloured layers from top to bottom; a spade leans on the edge and a measuring stick with marks stands against the wall. */
  'jord.markprofil': all(bg(SKY), rect(4, 34, 30, 3, GRASS, 0, C.ink, 0.9), rect(86, 34, 30, 3, GRASS, 0, C.ink, 0.9), cut(34, 37, 52, [L(8, TOP, 131), flat(10, PALE), L(14, RUST, 133, '#8a4a20'), [24, (x, y, w, h) => all(rect(x, y, w, h, '#b8b2a8', 0, null), pebbles(x, y, w, h, 10, 1.5, 3, 135))]], false),
    rect(4, 37, 30, 75, '#a89878', 0, C.ink, 1), rect(86, 37, 30, 75, '#a89878', 0, C.ink, 1), rect(40, 40, 5, 52, C.white, 0.5, C.ink, 1), line('M40 48 l3 0 M40 56 l3 0 M40 64 l3 0 M40 72 l3 0 M40 80 l3 0 M40 88 l3 0', C.red, 1.2), spade(100, 34, 1, 20),
    path('M34 93 L86 93', 'none', C.ink, 1.2), path('M34 37 L34 93 M86 37 L86 93', 'none', HL, 2.2)),
  /** podsol: a soil profile under a spruce – a thin dark top, a grey ash-like layer, a rust-orange layer and grey material at the bottom – four clear stripes. */
  'jord.podsol': all(bg(SKY), conifer(60, 34, 1), cut(22, 34, 76, [L(6, TOP, 141), flat(16, PALE), L(18, RUST, 143, '#8a4a20'), L(16, '#d0a070', 145, '#8a6040'), [20, (x, y, w, h) => all(rect(x, y, w, h, '#b8b2a8', 0, null), pebbles(x, y, w, h, 12, 1.5, 3, 147))]], true),
    dots(22, 40, 76, 16, 30, '#a8a49c', 149, 0.7)),
  /** urlaka: a soil column with rain falling on it; water drops trickle down through the pale top layer carrying small orange iron grains (arrows) down into a rusty layer below. */
  'jord.urlaka': all(bg(SKY), cloud(60, 14, 1), rain(46, 24, 28, 6), cut(26, 40, 68, [flat(30, PALE), L(22, RUST, 151, '#8a4a20'), [18, (x, y, w, h) => all(rect(x, y, w, h, '#b8b2a8', 0, null), pebbles(x, y, w, h, 8, 1.5, 3, 153))]], true),
    ...[38, 60, 82].map((x) => all(drop(x, 48, 0.9), circle(x + 3, 52, 1.6, RUST, C.ink, 0.5), arrow(x, 56, x, 76, WATER2, 2), circle(x + 3, 72, 1.6, RUST, C.ink, 0.5))), dots(26, 70, 68, 22, 30, '#8a4a20', 155, 1.1)),
  /** blekjord: a podsol profile in which only the grey, ash-coloured layer under the thin dark top is ringed in orange. */
  'jord.blekjord': all(bg(SKY), conifer(98, 30, 0.8), cut(16, 32, 88, [L(6, TOP, 161), flat(18, PALE), L(18, RUST, 163, '#8a4a20'), [30, (x, y, w, h) => all(rect(x, y, w, h, '#b8b2a8', 0, null), pebbles(x, y, w, h, 14, 1.5, 3, 165))]], true),
    dots(16, 38, 88, 18, 34, '#a8a49c', 167, 0.7), rect(12, 37, 96, 20, 'none', 3, HL, 2.6)),
  /** rostjord: a podsol profile in which only the rust-orange layer under the grey layer is ringed in orange, a few iron-red grains marked in it. */
  'jord.rostjord': all(bg(SKY), conifer(98, 30, 0.8), cut(16, 32, 88, [L(6, TOP, 171), flat(18, PALE), L(18, RUST, 173, '#8a4a20'), [30, (x, y, w, h) => all(rect(x, y, w, h, '#b8b2a8', 0, null), pebbles(x, y, w, h, 14, 1.5, 3, 175))]], true),
    rect(12, 55, 96, 22, 'none', 3, HL, 2.6)),
  /** brunjord: a soil profile under a leafy oak – dark brown all the way down with no clear stripes, with earthworms mixing it. */
  'jord.brunjord': all(bg(SKY), tree(60, 36, 1.4, '#5aa04a'), cut(16, 36, 88, [[52, (x, y, w, h) => all(rect(x, y, w, h, '#6e4a30', 0, null), rect(x, y + h * 0.6, w, h * 0.4, '#7e5a3e', 0, null), dots(x, y, w, h, 120, '#3a2a1e', 181, 0.9))], [20, (x, y, w, h) => all(rect(x, y, w, h, '#b8a890', 0, null), pebbles(x, y, w, h, 10, 1.5, 3, 183))]], true),
    leaf(30, 32, 0.7, 20, LEAF), leaf(84, 32, 0.7, -10, '#c0782e'), worm(40, 56, 0.6, 30), worm(76, 70, 0.6, -20), worm(56, 80, 0.5, 10)),
  /** näringsfattig: a coloured patch of pale, sandy, bare ground with one thin, small pine with few needles; beside it, grey, a dark rich soil with a big leafy plant as contrast. */
  'jord.näringsfattig': all(bg(), column(8, 80, 60, 28, sandTex(8, 80, 60, 28, 191, '#efe2c0'), 'jNf'), at(38, 80, 1, line('M0 0 L0 -36', WOOD, 2), line('M0 -12 L-6 -16 M0 -20 L6 -24 M0 -28 L-4 -31', '#5a8a5a', 1.4), ellipse(0, -36, 3, 4, '#7aa86a', C.ink, 0.6)), ground,
    greyed(column(78, 84, 34, 24, soilTex(78, 84, 34, 24, TOP, 193), 'jNf2'), at(95, 84, 1, line('M0 0 L0 -30', C.green, 2.4), ...[[-8, -10], [8, -14], [-8, -20], [8, -24], [0, -32]].map(([dx, dy]) => ellipse(dx!, dy!, 7, 4, C.green, C.ink, 0.8))))),

  // ── 2555 Erosion och vittring ──
  /** urholka (2): a sea cliff whose foot has been hollowed into a deep cave by waves; curved arrows show the water scooping the hole, ringed in orange. */
  'jord.urholka.2': all(bg(SKY), path('M40 112 L40 20 L116 20 L116 112 Z', '#b0a594', C.ink, 1.6), line('M60 30 L70 46 M90 26 L84 40 M100 50 L108 60', '#8a8070', 1.2), path('M40 112 L40 70 C48 62 66 62 74 76 C80 88 70 100 60 104 L40 112 Z', '#4a4650', C.ink, 1.4),
    rect(4, 86, 70, 26, WATER, 0, null), line('M8 92 q4 -2 8 0 M22 96 q4 -2 8 0', C.white, 1.2), arrow(14, 80, 46, 80, WATER2, 2.6), path('M48 92 C56 84 64 80 66 88', 'none', WATER2, 2.2), arrow(64, 84, 60, 94, WATER2, 2.2), ring(58, 86, 20, 18)),
  /** vittring: a big boulder lying in the same place, split by cracks into blocks, with flakes and grit lying right around its foot; sun, rain and frost act on it, but nothing carries the pieces away. */
  'jord.vittring': all(bg(SKY), ground, sunG(18, 20, 6), cloud(64, 18, 0.8), rain(56, 26, 16, 4), flake(102, 20, 6), path('M24 112 C20 80 40 54 62 54 C86 54 102 80 98 112 Z', '#b0a594', C.ink, 1.6), line('M60 54 L56 76 L64 92 L60 112 M56 76 L36 84 M64 92 L90 88 M74 58 L70 74', C.ink, 1.6),
    shard(16, 108, 4, '#b0a594', 201), shard(106, 108, 3.6, '#b0a594', 203), shard(30, 104, 2.6, '#b0a594', 205), dots(14, 106, 98, 6, 30, '#8a8070', 207, 0.8)),
  /** frostsprängning: a rock with a crack; water in the crack → the same crack filled with an ice crystal, the two halves pushed apart by orange arrows. */
  'jord.frostsprängning': all(bg(), ground, path('M8 112 L10 70 L24 62 L28 112 Z', '#b0a594', C.ink, 1.4), path('M30 112 L28 64 L46 66 L50 112 Z', '#b0a594', C.ink, 1.4), path('M27 66 L29 112', WATER, null), path('M26 66 L28 70 L27 76 L29 84 L28 94 L29 104', 'none', WATER2, 1.8), drop(28, 58, 0.9),
    arrow(54, 86, 64, 86, C.grey, 2.4), path('M68 112 L66 68 L82 60 L84 112 Z', '#b0a594', C.ink, 1.4), path('M94 112 L92 62 L110 66 L112 112 Z', '#b0a594', C.ink, 1.4), path('M84 62 L92 62 L94 112 L84 112 Z', '#d6ecf7', C.ink, 1), flake(89, 74, 4), flake(89, 92, 4),
    arrow(80, 50, 70, 50, HL, 2.6), arrow(96, 50, 106, 50, HL, 2.6)),
  /** surt regn: factory chimneys send dark smoke into a grey cloud that rains on a stone statue whose face is worn and pitted, and on a lake with a dead fish. */
  'jord.surt-regn': all(bg('#e4e6e8'), factory(22, 64, 1), smoke(30, 22), smoke(40, 16), cloud(74, 20, 1.2, '#9aa0a8'), line('M60 32 l-3 8 M70 34 l-3 8 M80 32 l-3 8 M90 34 l-3 8 M66 46 l-3 8 M84 46 l-3 8', '#7a9a3a', 1.8), ground,
    rect(68, 92, 24, 20, '#c8c2b6', 1, C.ink, 1.2), path('M72 92 L72 70 C72 60 88 60 88 70 L88 92 Z', '#d8d2c6', C.ink, 1.3), circle(80, 66, 6, '#d8d2c6', C.ink, 1.2), circle(77, 66, 1, '#8a847c', null), circle(82, 68, 1.4, '#8a847c', null), circle(76, 80, 1.4, '#8a847c', null), circle(84, 86, 1.2, '#8a847c', null),
    rect(4, 100, 52, 12, '#9ab8a0', 0, C.ink, 1), ellipse(30, 103, 6, 2.4, '#b8b8b0', C.ink, 0.8), line('M26 102 l1.4 1.4 M27.4 102 l-1.4 1.4', C.ink, 0.6)),
  /** vegetation: a hillside fully covered with many kinds of plants – trees, bushes, tall grass and flowers – the green cover outlined in orange. */
  'jord.vegetation': all(bg(SKY), path('M4 112 L4 70 C40 56 80 56 116 66 L116 112 Z', GRASS, C.ink, 1.3), tree(20, 72, 1.4), conifer(42, 66, 1.2), tree(66, 62, 1.6, '#5aa04a'), tree(96, 68, 1.3), ...[[28, 96], [52, 90], [80, 94], [104, 100], [14, 104]].map(([x, y]) => ellipse(x!, y!, 9, 6, GRASS2, C.ink, 1)),
    ...[34, 60, 90, 70].map((x, i) => flower(x, 108 - (i % 2) * 6, 0.8, i % 2 ? C.yellow : C.pink)), line(Array.from({ length: 18 }, (_, i) => `M${8 + i * 6} 112 l-1 -7 M${10 + i * 6} 112 l1 -6`).join(' '), GRASS2, 1), path('M4 70 C40 56 80 56 116 66', 'none', HL, 2.4)),
  /** rotsystem: a small plant above the ground and, in the cut below, its big network of roots spreading wide and deep through the soil, outlined in orange. */
  'jord.rotsystem': all(bg(SKY), cut(4, 40, 112, [L(72, SOIL, 211)]), line('M60 40 L60 24', C.green, 2.4), ellipse(52, 26, 8, 3.4, C.green, C.ink, 0.9), ellipse(68, 22, 8, 3.4, C.green, C.ink, 0.9),
    line('M60 40 L58 60 L60 82 L56 104 M58 60 L40 70 L24 76 L14 90 M40 70 L36 92 M60 82 L78 90 L96 98 M58 60 L80 62 L100 70 L108 84 M80 62 L86 80 M24 76 L16 70 M60 82 L44 100', '#f0e0c0', 2), line('M60 40 L58 60 L60 82 L56 104 M58 60 L40 70 L24 76 L14 90 M58 60 L80 62 L100 70 L108 84', 'rgba(43,42,51,0.35)', 0.6),
    path('M60 44 C30 50 10 70 10 96 C40 108 80 108 112 96 C112 70 90 50 60 44 Z', 'none', HL, 2, )),

  // ── 2556 Jordskred och ras ──
  /** ras: a steep cliff with rocks breaking off its top and falling straight down onto a road, arrows pointing down; a warning sign stands by the road. */
  'jord.ras': all(bg(SKY), path('M4 112 L4 14 L44 14 L48 40 L44 70 L50 112 Z', '#b0a594', C.ink, 1.6), line('M20 30 L30 40 M24 60 L36 66 M14 80 L28 88', '#8a8070', 1.2), rect(4, 104, 112, 8, ASPH, 0, C.ink, 1), line('M50 108 L60 108 M72 108 L82 108 M94 108 L104 108', C.white, 1.2),
    shard(58, 30, 6, '#b0a594', 221), shard(66, 52, 5, '#b0a594', 223), shard(56, 70, 7, '#b0a594', 225), shard(62, 98, 6, '#9a8f7e', 227), shard(74, 100, 4, '#9a8f7e', 229), arrow(80, 30, 80, 58, HL, 2.6), arrow(80, 64, 80, 92, HL, 2.6),
    rect(102, 82, 2, 22, C.grey, 0.5, C.ink, 0.8), path('M103 66 L113 82 L93 82 Z', C.white, C.red, 2.4), shard(103, 77, 2.4, C.ink, 231, 0)),
  /** jordskred: a gentle slope where a whole slab of ground, with a house and a tree still on it, has torn loose along a curved crack and slides down along the slope; an orange arrow follows the slope. */
  'jord.jordskred': all(bg(SKY), path('M4 112 L4 40 C30 40 50 48 70 64 C90 80 104 92 116 96 L116 112 Z', '#a89878', C.ink, 1.4), rect(4, 37, 30, 3, GRASS, 0, null), path('M30 42 C40 60 40 80 34 96', 'none', C.ink, 1.6, ),
    g('translate(16 10) rotate(10 60 80)', path('M34 50 C50 54 66 66 80 80 L74 96 C60 92 46 88 34 86 C38 74 38 60 34 50 Z', '#b8a07a', C.ink, 1.6), path('M34 50 C50 54 66 66 80 80', 'none', GRASS, 3), house(52, 60, 0.7), tree(68, 70, 0.8)),
    arrow(36, 30, 88, 74, HL, 3), line('M54 96 C70 100 90 104 110 104', '#8a7458', 1.2)),
  /** vattenmättad: a coloured column of soil filled with water to the very top – blue between all the grains and a pool on the surface where new drops just bounce off; beside it a grey dry column as contrast. */
  'jord.vattenmättad': all(bg(), ground, column(12, 52, 44, 56, all(rect(12, 52, 44, 56, '#8fb8d6', 0, null), pebbles(12, 52, 44, 56, 26, 2.4, 4, 241, ['#a8987a', '#b8a888', '#9a8a6e'], 0.7)), 'jVm'), ellipse(34, 50, 22, 3.6, WATER, C.ink, 1.1),
    ...[24, 34, 44].map((x) => all(drop(x, 34, 0.8), line(`M${x - 3} 44 l-2 -3 M${x + 3} 44 l2 -3`, WATER2, 1.2))), cloud(34, 16, 0.9, '#cfdbe6'),
    greyed(column(70, 60, 38, 48, all(rect(70, 60, 38, 48, '#e8dcc4', 0, null), pebbles(70, 60, 38, 48, 20, 2.4, 4, 243, ['#a8987a', '#b8a888'], 0.7)), 'jVm2'))),
  /** kvicklera: a firm-looking block of grey clay is struck by a hammer → arrow → the same clay has turned into a runny grey liquid flowing out in a wide puddle. */
  'jord.kvicklera': all(bg(), ground, rect(10, 70, 36, 40, CLAY, 2, C.ink, 1.6), line('M14 84 q8 -2 16 0 M20 98 q8 -2 16 0', CLAY2, 1), rot(40, 50, 30, 1, rect(-1.6, 0, 3.2, 22, WOOD, 1.4, C.ink, 1), path('M-8 -4 L6 -4 L8 0 L6 4 L-8 4 Z', STEEL, C.ink, 1.2)), line('M24 64 L22 58 M30 62 L32 56 M18 66 L14 62', HL, 1.6),
    arrow(52, 90, 64, 90, HL, 3), path('M66 112 C66 102 72 96 82 98 C90 92 104 96 108 104 C114 106 116 110 116 112 Z', CLAY, C.ink, 1.4), path('M74 104 q6 -3 12 0 q6 3 12 0', 'none', CLAY2, 1.2), drop(80, 92, 0.7, CLAY), drop(96, 90, 0.7, CLAY)),
  /** omkomma: a quiet memorial – lit candles and laid-down flowers in front of an empty place where a person's outline fades away; a small neutral wave sign in a circle hints at the event. */
  'jord.omkomma': all(bg('#ecebef'), ground, `<g opacity="0.35">${path('M48 96 L48 70 C48 62 72 62 72 70 L72 96 Z', '#b8b4c0', null)}${circle(60, 52, 9, '#b8b4c0', null)}</g>`, path('M48 96 L48 70 C48 62 72 62 72 70 L72 96', 'none', '#8a8696', 1.4), circle(60, 52, 9, 'none', '#8a8696', 1.4),
    rect(30, 96, 60, 6, '#d8d4dc', 1, C.ink, 1), ...[38, 50, 70, 82].map((x) => candle(x, 96)), flower(56, 110, 1, C.white), flower(64, 110, 1, C.white), rot(46, 110, -60, 1, flower(0, 0, 1, C.yellow)), rot(76, 110, 60, 1, flower(0, 0, 1, C.white)),
    circle(100, 22, 10, C.white, C.ink, 1.2), line('M93 22 q3.5 -4 7 0 q3.5 4 7 0 M93 27 q3.5 -4 7 0 q3.5 4 7 0', WATER2, 1.4)),
  // ── 2557 Markanvändning ──
  /** markanvändning: a map seen from above split into areas used for different things – dark green forest, yellow and brown fields, red houses in a grey town, a road – with orange borders between them. */
  'jord.markanvändning': all(bg(), rect(8, 8, 104, 100, '#eef3e6', 2, C.ink, 1.6), path('M8 8 L64 8 L56 52 L8 60 Z', '#4f8a5a', null), ...(() => { const r = rng(251); return Array.from({ length: 16 }, () => circle(f1(12 + r() * 44), f1(12 + r() * 40), 3, '#3a6e48', C.ink, 0.5)); })(),
    path('M64 8 L112 8 L112 50 L56 52 Z', '#f2d06a', null), line('M68 14 L108 14 M66 22 L108 22 M64 30 L108 30 M62 38 L108 38 M60 46 L108 46', '#d8a83a', 1), path('M8 60 L56 52 L58 108 L8 108 Z', '#c99a6a', null), line('M14 70 L50 64 M14 80 L52 74 M14 90 L54 84 M14 100 L56 94', '#a8784a', 1),
    path('M56 52 L112 50 L112 108 L58 108 Z', '#d0ccc6', null), ...[[70, 64], [86, 62], [100, 66], [72, 82], [90, 80], [102, 92], [76, 98]].map(([x, y]) => rect(x!, y!, 8, 8, C.red, 0.5, C.ink, 0.7)), line('M8 60 L56 52 L112 50 M56 52 L58 108 M64 8 L56 52', HL, 2), line('M30 108 C40 80 80 60 112 58', '#7a7a80', 3)),
  /** åkermark: a wide flat field of brown ploughed soil stretching to the horizon, the furrows running towards a farm far away. */
  'jord.åkermark': all(bg(SKY), path('M4 112 L4 54 L116 54 L116 112 Z', '#9a6a40', null), ...Array.from({ length: 11 }, (_, i) => line(`M${f1(60 + (i - 5) * 4)} 54 L${f1(60 + (i - 5) * 22)} 112`, '#6e4a2c', 1.4)), line('M4 54 L116 54', C.ink, 1.2), house(100, 54, 0.5), tree(88, 54, 0.6), tree(20, 54, 0.5)),
  /** betesmark: a green fenced pasture with short grass where two cows and a sheep graze, trees and a meadow flower here and there. */
  'jord.betesmark': all(bg(SKY), path('M4 112 L4 62 C40 56 80 56 116 60 L116 112 Z', GRASS, C.ink, 1.2), fence(8, 112, 74), tree(20, 60, 1.2), tree(100, 60, 1), cow(40, 104, 1), cow(86, 96, 0.8, true),
    at(70, 108, 1, ...[[-6, -2], [0, -4], [6, -2], [-3, 2], [3, 2]].map(([a, b]) => circle(a!, b! - 6, 5, C.white, C.ink, 1)), ellipse(10, -8, 3.6, 3, C.dark, null), line('M-5 0 L-5 4 M4 0 L4 4', C.dark, 1.8)), flower(108, 110, 0.7, C.yellow), flower(16, 108, 0.7, C.pink)),
  /** odlingslandskap: a gentle farming landscape – a patchwork of yellow and brown fields, a red farmhouse with a barn, a pasture with cows, a stone wall and a few trees. */
  'jord.odlingslandskap': all(bg(SKY), path('M4 112 L4 50 C40 44 80 44 116 48 L116 112 Z', GRASS, C.ink, 1.2), path('M4 60 L56 54 L60 76 L4 84 Z', '#f2d06a', C.ink, 0.8), path('M56 54 L116 52 L116 70 L60 76 Z', '#9a6a40', C.ink, 0.8), line('M64 60 L112 58 M64 66 L114 64', '#6e4a2c', 0.9),
    path('M4 84 L60 76 L64 112 L4 112 Z', '#9ad07a', C.ink, 0.8), house(84, 92, 1.1, '#b84030'), at(104, 94, 0.9, rect(-8, -14, 16, 14, '#b84030', 0.5, C.ink, 1.1), path('M-10 -14 L0 -22 L10 -14 Z', C.dark, C.ink, 1.1)), cow(24, 104, 0.6), cow(46, 100, 0.5, true),
    ...Array.from({ length: 12 }, (_, i) => ellipse(8 + i * 5, f1(84 - i * 0.7), 2.6, 2, PEB[i % 4]!, C.ink, 0.6)), tree(64, 50, 0.8), tree(30, 50, 0.7)),
  /** skogsbruk: a forest machine with a long crane arm fells and lifts a spruce; cut logs lie in a pile and small new spruces are planted in front. */
  'jord.skogsbruk': all(bg(SKY), path('M4 112 L4 80 L116 80 L116 112 Z', '#9ab86a', null), ...[10, 24, 92, 108].map((x) => conifer(x, 82, 1.3)), harvester(54, 104, 1.2), rot(100, 78, 80, 1, conifer(0, 0, 1.1)), logs(22, 110, 1), ...[70, 82, 94, 106].map((x) => conifer(x, 110, 0.3, '#4f9d69'))),
  /** kalhygge: a large open area where all trees have been cut down – only stumps, branches and bare ground – with the dark edge of the forest behind. */
  'jord.kalhygge': all(bg(SKY), ...[8, 20, 32, 44, 56, 68, 80, 92, 104, 114].map((x, i) => conifer(x, 58 + (i % 2) * 2, 1.2)), path('M4 112 L4 60 L116 60 L116 112 Z', '#b8a07a', C.ink, 1), ...(() => { const r = rng(261); return Array.from({ length: 13 }, (_, i) => stump(f1(12 + (i % 5) * 22 + r() * 8), f1(72 + Math.floor(i / 5) * 14 + r() * 4), 1)); })(),
    ...(() => { const r = rng(263); return Array.from({ length: 10 }, () => twig(f1(10 + r() * 100), f1(68 + r() * 40), f1(r() * 180))); })()),
  /** asfaltera: a road roller presses fresh, steaming black asphalt onto a gravel road; a worker with a rake spreads it, the black part behind the roller and grey gravel in front. */
  'jord.asfaltera': all(bg(SKY), rect(4, 96, 112, 16, GRAVEL, 0, null), pebbles(60, 98, 56, 12, 16, 1.2, 2, 271), rect(4, 96, 64, 16, ASPH, 0, null), line('M4 96 L116 96', C.ink, 1.2), line('M14 92 q-2 -4 0 -8 q2 -4 0 -8 M30 92 q-2 -4 0 -8 q2 -4 0 -8', '#b8b8b8', 1.2), roller(54, 104, 1),
    fig(98, C.orange, 'calm', { h: 0.8, bottom: '#3d4a66' }), rot(84, 80, 30, 1, rect(-1, 0, 2.4, 30, WOOD, 1, C.ink, 0.8), rect(-6, 28, 12, 3, STEEL, 0.5, C.ink, 0.8)), reach(98, 0.8, -1, 86, 76)),
  /** markägare: a person stands proudly inside their own fenced plot of land – a house, a field and a piece of forest – holding a map of the plot; the boundary is outlined in orange. */
  'jord.markägare': all(bg(SKY), path('M4 112 L4 70 L116 70 L116 112 Z', GRASS, null), path('M10 74 L110 74 L110 110 L10 110 Z', 'none', HL, 2.4, ), house(88, 92, 1), conifer(104, 92, 0.9), conifer(96, 98, 0.8), path('M16 96 L50 96 L50 108 L16 108 Z', '#f2d06a', C.ink, 0.8),
    fig(62, '#3a6aa8', 'smile', { h: 0.82, bottom: '#3d4a66' }), rect(32, 66, 22, 16, C.white, 1, C.ink, 1.1), path('M35 69 L51 69 L51 79 L35 79 Z', 'none', HL, 1.2), rect(36, 72, 6, 5, '#f2d06a', 0, null), rect(44, 70, 6, 6, '#4f8a5a', 0, null), reach(62, 0.82, -1, 54, 74)),
};
