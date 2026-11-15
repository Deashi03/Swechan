/**
 * Natur & geografi → Landskap & geologi → Bergarter & mineral, 2511–2517 (0.42): magmatic, sedimentary and metamorphic
 * rocks, the properties of minerals, crystals and ores, quarries and mines, and the rock cycle.
 * Recurring signs: rock samples drawn as cut blocks whose front face shows what tells the rock apart (grain size,
 * layers, bands, folds, pebbles, holes), molten stone in orange and yellow, heat as a red thermometer, pressure as
 * thick grey arrows, time as an hourglass, a magnifying lens over grains, miners in yellow hard hats with head lamps.
 * Abstract words are small symbolic scenes: the coloured idea dominates and a grey copy stands beside it as contrast
 * where that helps. Digits only; no words, no letters, no brands and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { type Build } from './figures';
import { T, arm } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const PAPER = '#f6f2ea';
const SKY = '#d6ecf7';
const SEA = '#8cc7e8';
const GRASS = '#8cc96a';
const SOIL = '#8a6040';
const GRAVEL = '#b9ab95';
const BED = '#9a948c';
const GRAN = '#d9b3a3';
const PINK = '#e58f7c';
const QTZ = '#e6edf1';
const MICA = '#2e2e36';
const BAS = '#4b4d55';
const SANDST = '#e3c48a';
const SAND = '#ecd29a';
const LIME = '#e8e2cf';
const SHALE = '#5c5864';
const SLATE = '#66717e';
const GN1 = '#d7cfc4';
const GN2 = '#5e5a5f';
const HOT = '#ef6a2e';
const HOT2 = '#f6c64e';
const GOLD = '#e0b23c';
const COPPER = '#c9733a';
const IRON = '#3a3a42';
const WOOD = '#a0673d';
const STEEL = '#b9c1c9';
const GREY = '#8d949c';
const HAT = '#f2c14e';
const VEST = '#ef8a3c';
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (x: number, y: number, r: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${r}) scale(${s})`, ...k);
const bg = (col: string = PAPER) => rect(4, 4, 112, 108, col, 3, null);
const ground = line('M4 112 L116 112', C.grey2, 2);
/** Deterministic pseudo-random numbers in [0, 1). */
const rng = (seed: number) => { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; };
/** Clip children to a path (ids must be unique per motif). */
const clip = (id: string, d: string, ...k: Svg[]) => `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${k.join('')}</g>`;
const rectD = (x: number, y: number, w: number, h: number) => `M${x} ${y} L${x + w} ${y} L${x + w} ${y + h} L${x} ${y + h} Z`;

// ── Textures ─────────────────────────────────────────────────────────
/** A small angular grain. */
const grain = (x: number, y: number, s: number, col: string, r: () => number, sw = 0.6) => {
  const p = Array.from({ length: 5 }, (_, i) => { const a = (i / 5) * Math.PI * 2 + r(); const d = s * (0.6 + r() * 0.5); return `${f1(x + Math.cos(a) * d)} ${f1(y + Math.sin(a) * d)}`; });
  return path(`M${p.join(' L')} Z`, col, sw ? C.ink : null, sw);
};
/** Grains scattered over a rectangle. cols cycles through the colours. */
const grains = (x: number, y: number, w: number, h: number, n: number, size: number, cols: string[], seed: number, sw = 0.6) => {
  const r = rng(seed);
  return all(...Array.from({ length: n }, (_, i) => grain(f1(x + size + r() * (w - 2 * size)), f1(y + size + r() * (h - 2 * size)), size, cols[i % cols.length]!, r, sw)));
};
/** Fine dots over a rectangle. */
const dots = (x: number, y: number, w: number, h: number, n: number, col: string, seed: number, rr = 0.7) => {
  const r = rng(seed);
  return all(...Array.from({ length: n }, () => circle(f1(x + 1 + r() * (w - 2)), f1(y + 1 + r() * (h - 2)), rr, col, null)));
};
/** Granite: pink feldspar, grey quartz, black mica. */
const granTex = (x: number, y: number, w: number, h: number, seed: number, size = 4, n = 0) => all(rect(x, y, w, h, GRAN, 0, null),
  grains(x, y, w, h, n || Math.round((w * h) / (size * size * 3.2)), size, [PINK, QTZ, PINK, MICA, QTZ], seed));
/** Horizontal layers (colours from top) over a rectangle. */
const layersTex = (x: number, y: number, w: number, h: number, cols: string[], wave = 0) => {
  const n = cols.length, lh = h / n;
  return all(...cols.map((c, i) => {
    const y0 = y + i * lh, y1 = y0 + lh;
    if (!wave) return rect(x, f1(y0), w, f1(lh + 0.3), c, 0, null);
    return path(`M${x} ${f1(y0)} C${f1(x + w * 0.3)} ${f1(y0 - wave)} ${f1(x + w * 0.6)} ${f1(y0 + wave)} ${x + w} ${f1(y0)} L${x + w} ${f1(y1 + 2)} L${x} ${f1(y1 + 2)} Z`, c, null);
  }), ...cols.slice(1).map((_, i) => wave
    ? line(`M${x} ${f1(y + (i + 1) * lh)} C${f1(x + w * 0.3)} ${f1(y + (i + 1) * lh - wave)} ${f1(x + w * 0.6)} ${f1(y + (i + 1) * lh + wave)} ${x + w} ${f1(y + (i + 1) * lh)}`, 'rgba(43,42,51,0.45)', 0.8)
    : line(`M${x} ${f1(y + (i + 1) * lh)} L${x + w} ${f1(y + (i + 1) * lh)}`, 'rgba(43,42,51,0.45)', 0.8)));
};
/** Folded bands: n wavy stripes alternating two colours, amplitude amp. */
const foldTex = (x: number, y: number, w: number, h: number, c1: string, c2: string, n: number, amp: number, waves = 1.5) => {
  const lh = h / n, out: Svg[] = [rect(x, y, w, h, c1, 0, null)];
  for (let i = -1; i <= n; i += 2) {
    const yy = y + i * lh, pts: string[] = [];
    for (let k = 0; k <= 24; k++) { const xx = x + (k / 24) * w; pts.push(`${f1(xx)} ${f1(yy + Math.sin((k / 24) * Math.PI * 2 * waves) * amp)}`); }
    const back = pts.slice().reverse().map((p) => { const [a, b] = p.split(' '); return `${a} ${f1(+b! + lh)}`; });
    out.push(path(`M${pts.join(' L')} L${back.join(' L')} Z`, c2, null));
  }
  return all(...out);
};

// ── Things ───────────────────────────────────────────────────────────
/** A cut rock block: front face (x, y, w, h) with texture, a lighter top and a darker side. */
const block = (x: number, y: number, w: number, h: number, col: string, tex: Svg = '', d = 7, id = '') => all(
  path(`M${x} ${y} L${x + d} ${y - d} L${x + w + d} ${y - d} L${x + w} ${y} Z`, col, C.ink, 1.3), path(`M${x} ${y} L${x + d} ${y - d} L${x + w + d} ${y - d} L${x + w} ${y} Z`, 'rgba(255,255,255,0.35)', null),
  path(`M${x + w} ${y} L${x + w + d} ${y - d} L${x + w + d} ${y + h - d} L${x + w} ${y + h} Z`, col, C.ink, 1.3), path(`M${x + w} ${y} L${x + w + d} ${y - d} L${x + w + d} ${y + h - d} L${x + w} ${y + h} Z`, 'rgba(0,0,0,0.22)', null),
  rect(x, y, w, h, col, 0, null), id ? clip(id, rectD(x, y, w, h), tex) : tex, rect(x, y, w, h, 'none', 0, C.ink, 1.4));
/** An irregular rock lump. */
const lump = (cx: number, cy: number, rx: number, ry: number, col: string, seed = 3, sw = 1.4) => {
  const r = rng(seed), n = 10;
  const p = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; const k = 0.86 + r() * 0.18; return `${f1(cx + Math.cos(a) * rx * k)} ${f1(cy + Math.sin(a) * ry * k)}`; });
  return path(`M${p.join(' L')} Z`, col, C.ink, sw);
};
const lumpD = (cx: number, cy: number, rx: number, ry: number, seed = 3) => {
  const r = rng(seed), n = 10;
  return `M${Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; const k = 0.86 + r() * 0.18; return `${f1(cx + Math.cos(a) * rx * k)} ${f1(cy + Math.sin(a) * ry * k)}`; }).join(' L')} Z`;
};
/** Molten stone: an orange blob with a yellow core and heat waves. */
const melt = (cx: number, cy: number, r: number) => all(circle(cx, cy, r + 5, 'rgba(239,106,46,0.25)', null),
  path(`M${cx - r} ${cy} C${cx - r} ${cy - r * 1.2} ${cx + r} ${cy - r * 1.2} ${cx + r} ${cy} C${cx + r} ${cy + r * 0.9} ${cx + r * 0.3} ${cy + r} ${cx} ${cy + r * 0.8} C${cx - r * 0.4} ${cy + r * 1.1} ${cx - r} ${cy + r * 0.8} ${cx - r} ${cy} Z`, HOT, C.ink, 1.3),
  ellipse(cx - r * 0.1, cy - r * 0.1, r * 0.5, r * 0.35, HOT2, null),
  line(`M${cx - r * 0.5} ${cy - r - 4} q-2 -4 0 -7 q2 -3 0 -6 M${cx + r * 0.4} ${cy - r - 4} q-2 -4 0 -7 q2 -3 0 -6`, HOT, 1.4));
/** A thermometer, bulb at (x, y); level 0–1. */
const thermo = (x: number, y: number, level: number, col: string = C.red, s = 1) => at(x, y, s, rect(-3, -30, 6, 30, C.white, 3, C.ink, 1.2), rect(-1.5, f1(-28 * level), 3, f1(28 * level), col, 1.5, null), circle(0, 2, 5, col, C.ink, 1.2),
  line('M3 -24 l3 0 M3 -18 l3 0 M3 -12 l3 0 M3 -6 l3 0', C.ink, 0.8));
/** A thick grey pressure arrow from (x1,y1) to (x2,y2). */
const press = (x1: number, y1: number, x2: number, y2: number) => arrow(x1, y1, x2, y2, '#6f7680', 5);
const hourglass = (x: number, y: number, s = 1) => at(x, y, s, rect(-9, -15, 18, 3, WOOD, 1, C.ink, 1.1), rect(-9, 12, 18, 3, WOOD, 1, C.ink, 1.1), path('M-7 -12 L7 -12 L1 0 L7 12 L-7 12 L-1 0 Z', '#e9f3f8', C.ink, 1.2), path('M-4 -8 L4 -8 L0.6 -1 L-0.6 -1 Z', SAND, null), path('M-6 12 L6 12 L0 6 Z', SAND, null));
/** A magnifying lens: glass at (x, y) radius r showing `inner`, handle down-right. */
const lens = (x: number, y: number, r: number, inner: Svg, id: string) => all(line(`M${f1(x + r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r * 1.5)} ${f1(y + r * 1.5)}`, C.ink, 4.5), line(`M${f1(x + r * 0.75)} ${f1(y + r * 0.75)} L${f1(x + r * 1.45)} ${f1(y + r * 1.45)}`, WOOD, 2.6),
  circle(x, y, r, C.white, null), clip(id, `M${x - r} ${y} A${r} ${r} 0 1 0 ${x + r} ${y} A${r} ${r} 0 1 0 ${x - r} ${y} Z`, inner), circle(x, y, r, 'rgba(200,230,250,0.18)', C.ink, 2.2));
const water = (x: number, y: number, w: number, h: number, col: string = SEA) => all(rect(x, y, w, h, col, 0, null), line(Array.from({ length: Math.floor(w / 12) }, (_, i) => `M${x + 3 + i * 12} ${y + 4} q3 -2 6 0`).join(' '), C.white, 1.1));
const fish = (x: number, y: number, s = 1, col: string = C.orange, dir = 1) => g(`translate(${x} ${y}) scale(${dir * s} ${s})`, ellipse(0, 0, 6, 3.4, col, C.ink, 1), path('M-5 0 L-10 -3.5 L-10 3.5 Z', col, C.ink, 1), circle(3, -0.8, 0.8, C.ink, null));
const shell = (x: number, y: number, s = 1, col = '#f1d9b8') => at(x, y, s, path('M0 0 C-9 0 -10 -10 -3 -12 C4 -14 9 -8 7 -2 C5 3 -2 3 -3 -1 C-4 -5 1 -7 3 -4', col, C.ink, 1.2), path('M0 0 L10 2 L8 -2', col, C.ink, 1.1));
const scallop = (x: number, y: number, s = 1, col = '#f4c7a8') => at(x, y, s, path('M0 4 L-9 -6 C-6 -12 6 -12 9 -6 Z', col, C.ink, 1.2), line('M0 4 L-5 -9 M0 4 L0 -10 M0 4 L5 -9', '#c98a6a', 0.8), rect(-3, 3, 6, 3, col, 1, C.ink, 1));
const crystal = (x: number, y: number, w: number, h: number, col: string, r = 0, edge: string = C.ink) => rot(x, y, r, 1,
  path(`M${-w / 2} 0 L${-w / 2} ${-h} L0 ${-h - w * 0.7} L${w / 2} ${-h} L${w / 2} 0 Z`, col, edge, 1.2), line(`M0 0 L0 ${-h} L0 ${f1(-h - w * 0.7)} M${-w / 2} ${-h} L0 ${f1(-h + w * 0.25)} L${w / 2} ${-h} M0 ${f1(-h + w * 0.25)} L0 0`, 'rgba(43,42,51,0.35)', 0.8),
  line(`M${f1(-w / 2 + 2)} ${f1(-h * 0.2)} L${f1(-w / 2 + 2)} ${f1(-h * 0.8)}`, 'rgba(255,255,255,0.8)', 1.4));
const cube = (x: number, y: number, s: number, col: string, edge: string = C.ink) => all(path(`M${x} ${y} L${x + s} ${y} L${x + s} ${y - s} L${x} ${y - s} Z`, col, edge, 1.1),
  path(`M${x} ${y - s} L${f1(x + s * 0.4)} ${f1(y - s * 1.4)} L${f1(x + s * 1.4)} ${f1(y - s * 1.4)} L${x + s} ${y - s} Z`, col, edge, 1.1), path(`M${x} ${y - s} L${f1(x + s * 0.4)} ${f1(y - s * 1.4)} L${f1(x + s * 1.4)} ${f1(y - s * 1.4)} L${x + s} ${y - s} Z`, 'rgba(255,255,255,0.35)', null),
  path(`M${x + s} ${y} L${f1(x + s * 1.4)} ${f1(y - s * 0.4)} L${f1(x + s * 1.4)} ${f1(y - s * 1.4)} L${x + s} ${y - s} Z`, col, edge, 1.1), path(`M${x + s} ${y} L${f1(x + s * 1.4)} ${f1(y - s * 0.4)} L${f1(x + s * 1.4)} ${f1(y - s * 1.4)} L${x + s} ${y - s} Z`, 'rgba(0,0,0,0.22)', null));
const gem = (x: number, y: number, s: number, col: string) => at(x, y, s, path('M-8 -3 L-4 -8 L4 -8 L8 -3 L0 8 Z', col, C.ink, 1.1), line('M-8 -3 L8 -3 M-4 -8 L-2 -3 L0 8 L2 -3 L4 -8', 'rgba(255,255,255,0.6)', 0.8));
const hammerG = (x: number, y: number, s = 1, r = 0) => rot(x, y, r, s, rect(-1.6, 0, 3.2, 24, WOOD, 1.4, C.ink, 1), path('M-9 -4 L6 -4 L9 0 L6 4 L-9 4 Z', STEEL, C.ink, 1.2));
const pick = (x: number, y: number, s = 1, r = 0) => rot(x, y, r, s, rect(-1.6, 0, 3.2, 26, WOOD, 1.4, C.ink, 1), path('M-13 2 C-6 -4 6 -4 13 2 L11 3 C5 -1 -5 -1 -11 3 Z', STEEL, C.ink, 1.1));
const magnet = (x: number, y: number, s = 1, r = 0) => rot(x, y, r, s, path('M-10 0 L-10 -10 C-10 -22 10 -22 10 -10 L10 0 L4 0 L4 -10 C4 -15 -4 -15 -4 -10 L-4 0 Z', C.red, C.ink, 1.3), rect(-10, -1, 6, 5, STEEL, 0.5, C.ink, 1.1), rect(4, -1, 6, 5, STEEL, 0.5, C.ink, 1.1));
const truck = (x: number, y: number, s = 1, load: Svg = '', col: string = HAT) => at(x, y, s, rect(-30, -14, 38, 10, col, 1.5, C.ink, 1.3), load, rect(8, -20, 14, 16, col, 2, C.ink, 1.3), rect(11, -17, 8, 6, '#bfe3f5', 1, C.ink, 1),
  circle(-20, -3, 5, C.dark, C.ink, 1.2), circle(-20, -3, 2, GREY, null), circle(14, -3, 5, C.dark, C.ink, 1.2), circle(14, -3, 2, GREY, null));
const geo = (x: number, h = 1, y0 = 112) => { const s = 0.84 * h, ty = y0 - 49 * s; return { s, ty, hy: ty - 56 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}, y0 = 112) =>
  y0 === 112 ? F({ x, top, mood, ...more }) : g(`translate(0 ${f1(y0 - 112)})`, F({ x, top, mood, ...more }));
/** Something drawn in head coordinates (head centre ≈ (0, -56)). */
const on = (x: number, h: number, ...k: Svg[]) => { const q = geo(x, h); return g(`translate(${x} ${f1(q.ty)}) scale(${f1(q.s)})`, ...k); };
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number) => { const q = geo(x, h); return all(arm(f1(side < 0 ? q.sl : q.sr), f1(q.sy), tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };
const hardhat = (lamp = true) => all(path('M-12 -61 C-12 -76 12 -76 12 -61 Z', HAT, C.ink, 1.3), path('M-15 -61 L15 -61 L13 -58 L-13 -58 Z', HAT, C.ink, 1.1), lamp ? all(circle(0, -66, 3, '#fff6c8', C.ink, 1), path('M2 -66 L22 -72 L22 -58 Z', 'rgba(255,240,170,0.5)', null)) : '');
const miner = (x: number, h = 1, mood: Mood = 'calm', lamp = true) => all(fig(x, VEST, mood, { h, bottom: '#3d4a66' }), on(x, h, line('M-12 -36 L12 -36', '#e8e8e8', 2), hardhat(lamp)));
/** A forearm from the edge, fist at (x2, y2). */
const forearm = (x1: number, y1: number, x2: number, y2: number, col: string = C.skin) => all(line(`M${x1} ${y1} L${x2} ${y2}`, C.ink, 10), line(`M${x1} ${y1} L${x2} ${y2}`, col, 7.6), circle(x2, y2, 5.4, col, C.ink, 1.3));
const glint = (x: number, y: number, r = 3) => sparkle(x, y, r, C.white);
const motion = (x: number, y: number, dir = -1) => line(`M${x} ${y} l${dir * 6} 0 M${x} ${y + 5} l${dir * 9} 0 M${x} ${y + 10} l${dir * 6} 0`, GREY, 1.4);
const flame = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 C-8 0 -9 -8 -4 -14 C-4 -9 -1 -9 -1 -12 C-1 -18 3 -20 4 -24 C6 -18 10 -12 9 -6 C8 -2 5 0 0 0 Z', HOT, C.ink, 1.1), path('M0 -2 C-4 -2 -4 -7 -1 -10 C0 -7 3 -8 3 -12 C6 -8 6 -3 0 -2 Z', HOT2, null));
const cart = (x: number, y: number, s = 1, load: string = IRON) => at(x, y, s, path('M-14 -14 L14 -14 L11 0 L-11 0 Z', '#7a6a5a', C.ink, 1.3), path('M-13 -14 C-8 -21 8 -21 13 -14 Z', load, C.ink, 1), circle(-7, 2, 3, C.dark, C.ink, 1), circle(7, 2, 3, C.dark, C.ink, 1));
const bar = (x: number, y: number, s: number, col: string) => at(x, y, s, path('M-10 0 L10 0 L7 -6 L-7 -6 Z', col, C.ink, 1.2), line('M-6 -4.5 L5 -4.5', 'rgba(255,255,255,0.7)', 1));
const tree = (x: number, y: number, s = 1) => at(x, y, s, rect(-1.5, -8, 3, 8, WOOD, 0.5, C.ink, 0.9), circle(0, -12, 6, C.green, C.ink, 1));
const house = (x: number, y: number, s = 1, col = '#c0563d') => at(x, y, s, rect(-12, -14, 24, 14, col, 0.5, C.ink, 1.3), path('M-15 -14 L0 -26 L15 -14 Z', C.dark, C.ink, 1.3), rect(-3, -9, 6, 9, C.white, 0.5, C.ink, 1), rect(-10, -11, 5, 5, '#bfe3f5', 0.5, C.ink, 0.9), rect(5, -11, 5, 5, '#bfe3f5', 0.5, C.ink, 0.9));
const hexD = (x: number, y: number, r: number, flat = 0.55) => `M${f1(x - r)} ${y} L${f1(x - r / 2)} ${f1(y - r * flat)} L${f1(x + r / 2)} ${f1(y - r * flat)} L${f1(x + r)} ${y} L${f1(x + r / 2)} ${f1(y + r * flat)} L${f1(x - r / 2)} ${f1(y + r * flat)} Z`;
const seedling = (x: number, y: number, stage: number, col = C.green) => stage === 0 ? ellipse(x, y - 3, 4, 3, '#a0673d', C.ink, 1)
  : stage === 1 ? all(line(`M${x} ${y} L${x} ${y - 10}`, col, 2), ellipse(x - 4, y - 11, 4, 2, col, C.ink, 0.8), ellipse(x + 4, y - 11, 4, 2, col, C.ink, 0.8))
  : stage === 2 ? all(line(`M${x} ${y} L${x} ${y - 20}`, '#6b8f3a', 2.4), ...[[-6, -10], [6, -14], [-6, -18], [5, -21]].map(([dx, dy]) => ellipse(x + dx!, y + dy!, 5, 2.4, col, C.ink, 0.8)))
  : all(rect(x - 2, y - 16, 4, 16, WOOD, 1, C.ink, 1), circle(x, y - 26, 12, col, C.ink, 1.2), circle(x - 4, y - 24, 2, C.red, null), circle(x + 5, y - 29, 2, C.red, null));

export const ROCKS_MINERALS_MOTIFS: Record<string, Svg> = {
  // ── 2511 Magmatiska bergarter ──
  /** bergart: three cut rock samples side by side, each clearly a different kind – speckled granite, layered sandstone, banded gneiss – grouped by a bracket above. */
  'berg.bergart': all(bg(), ground, block(10, 72, 26, 36, GRAN, granTex(10, 72, 26, 36, 11, 3.4), 7, 'bA1'), block(46, 72, 26, 36, SANDST, layersTex(46, 72, 26, 36, [SANDST, '#d2a86a', SANDST, '#c99a5e', SANDST, '#ddb878']), 7, 'bA2'),
    block(82, 72, 24, 36, GN1, foldTex(82, 72, 24, 36, GN1, GN2, 7, 2.5, 1), 7, 'bA3'), line('M16 52 L16 46 L104 46 L104 52', C.accent, 2)),
  /** berggrund: a cut through the ground under a house – grass, brown soil, grey gravel and, at the bottom, the thick solid grey bedrock outlined in orange. */
  'berg.berggrund': all(bg(SKY), rect(4, 46, 112, 6, GRASS, 0, C.ink, 1), rect(4, 52, 112, 14, SOIL, 0, C.ink, 1), rect(4, 66, 112, 10, GRAVEL, 0, C.ink, 1), dots(4, 66, 112, 10, 60, '#7a6d5a', 4, 1.1),
    path('M4 76 L116 76 L116 112 L4 112 Z', BED, null), line('M20 84 L28 96 L24 106 M64 80 L58 92 M90 88 L100 98 L96 108', '#6d6861', 1.4), path('M5 77 L115 77 L115 111 L5 111 Z', 'none', C.accent, 2.6),
    house(46, 46, 1.3), rect(40, 46, 12, 30, '#b8b0a4', 0, C.ink, 1), line('M42 52 L42 74 M46 52 L46 74 M50 52 L50 74', '#8d857a', 0.8), tree(92, 46, 1.2)),
  /** urberg: a very old, smooth, rounded rock dome of pink and grey bands rising from the ground, with a large hourglass in front and many thin time rings on its side. */
  'berg.urberg': all(bg(SKY), clip('bUr', 'M8 112 C12 70 40 52 66 54 C92 56 110 80 112 112 Z', foldTex(8, 52, 104, 62, GN1, '#c99a8a', 8, 3, 1.2), dots(8, 52, 104, 62, 80, '#6e6a70', 7, 0.9)),
    path('M8 112 C12 70 40 52 66 54 C92 56 110 80 112 112 Z', 'none', C.ink, 1.8), ground, path('M30 62 C34 58 40 58 44 60', 'none', '#7aa860', 3), hourglass(60, 86, 1.25), ...[0, 1, 2, 3].map((i) => circle(98, 34, 5 + i * 3.2, 'none', '#b8a07a', 1)), circle(98, 34, 2, '#b8a07a', null)),
  /** magmatisk: molten orange stone (thermometer high) → arrow with blue cooling marks → the same stone hard and speckled like granite (thermometer low). */
  'berg.magmatisk': all(bg(), ground, melt(30, 66, 18), thermo(12, 104, 0.9, C.red, 0.8), arrow(52, 66, 68, 66, C.accent, 3), line('M56 56 q2 -3 4 0 q2 3 4 0 M56 76 q2 -3 4 0 q2 3 4 0', C.sky, 1.6),
    clip('bMg', lumpD(92, 70, 18, 15, 5), granTex(72, 52, 40, 36, 13, 2.8)), lump(92, 70, 18, 15, 'none', 5, 1.6), thermo(108, 104, 0.2, C.sky, 0.8)),
  /** djupbergart: a cut through the ground – a thin green surface with a tree at the top, and far down a body of speckled rock cooling slowly (hourglass); a depth arrow runs from the surface down to it. */
  'berg.djupbergart': all(bg(SKY), rect(4, 22, 112, 4, GRASS, 0, C.ink, 1), tree(30, 22, 1), house(80, 22, 0.8), rect(4, 26, 112, 86, '#b3a898', 0, C.ink, 1), dots(4, 26, 112, 86, 70, '#8e8476', 9, 1),
    clip('bDj', 'M30 104 C24 84 46 72 66 74 C88 76 98 90 92 104 Z', granTex(22, 70, 80, 36, 17, 3.2)), path('M30 104 C24 84 46 72 66 74 C88 76 98 90 92 104 Z', 'none', C.accent, 2.2),
    line('M12 28 L12 96', C.accent, 1.8, '3 2'), arrow(12, 86, 12, 98, C.accent, 2), line('M9 40 L15 40 M9 54 L15 54 M9 68 L15 68 M9 82 L15 82', C.accent, 1.2), hourglass(104, 56, 0.8)),
  /** kvarts: a large milky-white glassy chunk of quartz with shiny facets; beside it a granite slab whose grey glassy grains are ringed in orange – the same mineral. */
  'berg.kvarts': all(bg(), ground, path('M50 104 L46 74 L60 52 L80 48 L98 62 L102 92 L88 106 Z', QTZ, C.ink, 1.6), path('M60 52 L68 72 L46 74 M68 72 L80 48 M68 72 L98 62 M68 72 L88 106 M68 72 L102 92', 'none', '#b9c7d0', 1),
    path('M62 56 L66 68 L52 70 Z', 'rgba(255,255,255,0.85)', null), glint(84, 60, 3.4), glint(92, 84, 2.4), block(8, 76, 26, 30, GRAN, all(rect(8, 76, 26, 30, GRAN, 0, null), grains(8, 76, 26, 30, 14, 3.4, [PINK, PINK, MICA], 21), ...[[14, 84], [26, 82], [20, 96], [29, 100]].map(([x, y]) => all(grain(x!, y!, 3.2, QTZ, rng(x! * y!)), circle(x!, y!, 4.6, 'none', C.accent, 1.4)))), 6, 'bKv'),
    arrow(36, 78, 44, 72, C.accent, 1.8)),
  /** fältspat: a pink blocky crystal of feldspar with flat faces; beside it a granite slab whose pink grains are ringed in orange – the same mineral. */
  'berg.fältspat': all(bg(), ground, cube(54, 104, 34, PINK), line('M60 98 L84 98 M60 90 L84 90', 'rgba(43,42,51,0.25)', 0.9), glint(78, 64, 3), block(8, 76, 26, 30, GRAN, all(rect(8, 76, 26, 30, GRAN, 0, null), grains(8, 76, 26, 30, 14, 3.2, [QTZ, QTZ, MICA], 23), ...[[14, 84], [26, 82], [20, 96], [29, 100]].map(([x, y]) => all(grain(x!, y!, 3.4, PINK, rng(x! + y!)), circle(x!, y!, 4.8, 'none', C.accent, 1.4)))), 6, 'bFs'),
    arrow(36, 78, 46, 74, C.accent, 1.8)),
  /** glimmer: a black, shiny book of mica whose top sheets peel off as thin glinting flakes, one lifted by a hand. */
  'berg.glimmer': all(bg(), ground, ...[0, 1, 2, 3, 4, 5].map((i) => path(`M24 ${104 - i * 4} L82 ${100 - i * 4} L96 ${88 - i * 4} L38 ${92 - i * 4} Z`, i % 2 ? '#3a3a44' : MICA, C.ink, 1)),
    path('M40 64 C56 52 76 50 98 56 L104 62 C84 58 62 60 46 70 Z', '#4a4a56', C.ink, 1.1), path('M52 48 C66 38 82 36 100 40 L104 44 C88 42 70 44 56 52 Z', '#5a5a66', C.ink, 1), glint(70, 74, 3.4), glint(54, 86, 2.6), glint(86, 54, 2.6), glint(90, 40, 2.2),
    forearm(118, 30, 102, 42)),
  /** grovkornig: a big rock block with large, clearly visible grains under a lens; a small grey block with tiny dots stands beside it as contrast. */
  'berg.grovkornig': all(bg(), ground, block(10, 54, 54, 54, GRAN, granTex(10, 54, 54, 54, 31, 6.5), 8, 'bGk'), lens(62, 40, 16, granTex(44, 22, 36, 36, 31, 8.5), 'bGkL'),
    greyed(block(86, 86, 22, 22, BAS, dots(86, 86, 22, 22, 80, '#9a9aa2', 33, 0.6), 5, 'bGk2'))),
  /** finkornig: a big dark rock block with a smooth face of tiny dots, seen under a lens where the grains are still very small; a small grey block with large grains stands beside it as contrast. */
  'berg.finkornig': all(bg(), ground, block(10, 54, 54, 54, BAS, dots(10, 54, 54, 54, 260, '#8a8c96', 41, 0.6), 8, 'bFk'), lens(62, 40, 16, all(rect(44, 22, 36, 36, BAS, 0, null), dots(44, 22, 36, 36, 160, '#9fa1aa', 43, 0.9)), 'bFkL'),
    greyed(block(86, 86, 22, 22, GRAN, granTex(86, 86, 22, 22, 45, 4.5), 5, 'bFk2'))),
  /** basalt: dark grey six-sided stone columns standing tightly together in steps by the sea, the hexagonal tops showing. */
  'berg.basalt': all(bg(SKY), water(4, 92, 112, 20), ...[[22, 70], [38, 60], [54, 52], [70, 58], [86, 48], [102, 62]].map(([x, top]) => all(
    rect(x! - 8, top!, 16, 112 - top!, BAS, 0, C.ink, 1.2), rect(x! + 2, top!, 6, 112 - top!, 'rgba(0,0,0,0.18)', 0, null), path(hexD(x!, top!, 8, 0.4), '#6b6d76', C.ink, 1.1))),
    line('M14 84 L30 84 M46 76 L62 76 M78 72 L94 72', 'rgba(255,255,255,0.18)', 1)),
  /** diabas: a pink granite cliff cut through by a dark, almost black band of diabase; in front, a small polished black slab with a shine. */
  'berg.diabas': all(bg(SKY), clip('bDb', 'M4 112 L4 40 C30 30 80 28 116 36 L116 112 Z', granTex(4, 28, 112, 84, 51, 3.6), path('M40 30 L64 30 L84 112 L58 112 Z', '#2f3036', null), dots(40, 30, 44, 82, 50, '#4e5058', 53, 0.8)),
    path('M4 112 L4 40 C30 30 80 28 116 36 L116 112', 'none', C.ink, 1.8), line('M40 30 L58 112 M64 30 L84 112', C.ink, 1.3),
    rect(88, 86, 20, 24, '#26272c', 2, C.ink, 1.4), line('M90 104 L106 88', 'rgba(255,255,255,0.4)', 1.6), ground),
  /** porfyr: a polished red-brown slab where big light crystals float in a fine dark-red mass, with a lens on one crystal, and a small polished urn of the same stone. */
  'berg.porfyr': all(bg(), ground, rect(10, 30, 62, 74, '#8a3f36', 4, C.ink, 1.6), dots(10, 30, 62, 74, 180, '#6e2f29', 61, 0.7), ...(() => { const r = rng(63); return Array.from({ length: 14 }, () => { const x = 16 + r() * 50, y = 36 + r() * 62; return rot(f1(x), f1(y), f1(r() * 180), 1, rect(-3.5, -2, 7, 4, '#f1d6c8', 0.6, C.ink, 0.6)); }); })(),
    line('M16 38 L40 38', 'rgba(255,255,255,0.45)', 2), path('M88 108 L84 92 C80 84 82 74 90 70 L90 64 L102 64 L102 70 C110 74 112 84 108 92 L104 108 Z', '#8a3f36', C.ink, 1.4), ...[[90, 84], [100, 78], [96, 96], [104, 90]].map(([x, y]) => rect(x! - 2.5, y! - 1.5, 5, 3, '#f1d6c8', 0.5, null)),
    line('M88 76 L90 92', 'rgba(255,255,255,0.45)', 1.6)),
  /** gatsten: a street paved with square grey and pink stones laid in arcs, running away between two house fronts. */
  'berg.gatsten': all(bg(SKY), rect(4, 20, 22, 46, '#e8c39a', 0, C.ink, 1.2), rect(94, 18, 22, 48, '#c9d8a8', 0, C.ink, 1.2), rect(9, 30, 8, 10, '#bfe3f5', 0.5, C.ink, 0.9), rect(101, 28, 8, 10, '#bfe3f5', 0.5, C.ink, 0.9),
    path('M4 66 L116 66 L116 112 L4 112 Z', '#b8b0a8', null), ...(() => { const out: Svg[] = []; const r = rng(71); for (let row = 0; row < 7; row++) { const y = 68 + row * 6.4, s = 3 + row * 0.9, n = Math.floor(112 / (s * 1.25)); for (let i = 0; i < n; i++) { const x = 6 + i * s * 1.25 + (row % 2) * s * 0.6; if (x > 112) continue; const bend = Math.sin(((x - 4) / 112) * Math.PI) * 2.4; out.push(rect(f1(x), f1(y - bend), f1(s), f1(s * 0.85), r() > 0.7 ? '#cf9e94' : '#9a9aa0', 1, C.ink, 0.7)); } } return out; })(),
    line('M4 66 L116 66', C.ink, 1.2)),

  // ── 2512 Sedimentära bergarter ──
  /** pressa ihop: a tall loose stack of layers under a heavy weight with thick arrows pressing down → the same stack pressed thin and tight. */
  'berg.pressa-ihop': all(bg(), ground, ...[0, 1, 2, 3].map((i) => rect(10, 108 - (i + 1) * 13 + 2, 36, 10, [SANDST, '#c9a070', LIME, '#a88a6a'][i]!, 2, C.ink, 1)), ...[0, 1, 2, 3].map((i) => dots(10, 108 - (i + 1) * 13 + 2, 36, 10, 8, '#7a6a5a', 80 + i, 0.8)),
    rect(8, 46, 40, 10, '#5d6470', 2, C.ink, 1.3), press(28, 18, 28, 42), arrow(54, 84, 66, 84, C.accent, 3),
    ...[0, 1, 2, 3].map((i) => rect(72, 108 - (i + 1) * 6, 38, 6, [SANDST, '#c9a070', LIME, '#a88a6a'][i]!, 0, C.ink, 1)), rect(70, 74, 42, 10, '#5d6470', 2, C.ink, 1.3), press(91, 40, 91, 70), press(78, 46, 82, 70), press(104, 46, 100, 70)),
  /** sedimentär: sand, small stones and shells sinking through water to the bottom and settling in layers → a layered rock block with a fossil shell in it. */
  'berg.sedimentär': all(bg(), water(6, 14, 54, 70, '#a6d4ee'), dots(10, 20, 46, 40, 24, '#b08a50', 91, 1.3), shell(22, 40, 0.5), scallop(44, 30, 0.5), ...[[16, 52], [34, 56], [50, 50]].map(([x, y]) => arrow(x!, y!, x!, y! + 10, '#6f7680', 1.6)),
    layersTex(6, 84, 54, 26, [SANDST, '#c9a070', LIME, '#a88a6a']), rect(6, 84, 54, 26, 'none', 0, C.ink, 1.4), arrow(64, 76, 74, 76, C.accent, 3),
    block(78, 60, 30, 48, LIME, all(layersTex(78, 60, 30, 48, ['#e3c48a', '#c9a070', LIME, '#a88a6a', '#e3c48a', '#bfa080']), g('translate(93 86) scale(0.7)', path('M0 0 C-9 0 -10 -10 -3 -12 C4 -14 9 -8 7 -2 C5 3 -2 3 -3 -1 C-4 -5 1 -7 3 -4', '#8a7a62', C.ink, 1.2))), 6, 'bSd'), ground),
  /** sandsten: a cut block of yellow-brown stone made of sand grains, with faint layers; beside it a small pile of loose sand and an arrow from the sand to the stone. */
  'berg.sandsten': all(bg(), ground, block(40, 50, 60, 58, SANDST, all(layersTex(40, 50, 60, 58, [SANDST, '#d9b47a', SANDST, '#d4ab70', SANDST]), dots(40, 50, 60, 58, 320, '#a8844a', 101, 0.7)), 8, 'bSs'),
    path('M8 110 C10 96 26 92 32 110 Z', SAND, C.ink, 1.2), dots(10, 98, 22, 12, 30, '#a8844a', 103, 0.8), arrow(22, 88, 34, 74, C.accent, 2.4)),
  /** lerskiffer: a dark grey layered block whose top splits into thin flat flakes, with broken flakes lying in front. */
  'berg.lerskiffer': all(bg(), ground, block(16, 62, 64, 46, SHALE, layersTex(16, 62, 64, 46, [SHALE, '#4e4a56', SHALE, '#4e4a56', SHALE, '#4e4a56', SHALE, '#4e4a56', SHALE]), 8, 'bLs'),
    rot(48, 48, -8, 1, path('M-30 0 L30 0 L36 -6 L-24 -6 Z', '#6a6672', C.ink, 1.1)), rot(54, 36, -16, 1, path('M-24 0 L24 0 L30 -5 L-18 -5 Z', '#706c78', C.ink, 1.1)),
    path('M86 108 L100 104 L110 108 Z', SHALE, C.ink, 1), path('M90 102 L104 98 L108 102 L94 104 Z', '#6a6672', C.ink, 1), line('M30 52 l-6 -6 M70 40 l6 -6', GREY, 1.2)),
  /** konglomerat: a cut block of brown stone full of round pebbles of different colours and sizes, set in a sandy mass. */
  'berg.konglomerat': all(bg(), ground, block(14, 40, 80, 68, '#b8a284', all(dots(14, 40, 80, 68, 200, '#8a7458', 111, 0.7), ...(() => { const r = rng(113); const cols = ['#9a9aa2', '#e3a08a', '#f0ece2', '#4b4d55', '#c9b48a', '#7a8a9a']; return Array.from({ length: 22 }, (_, i) => { const rr = 3 + r() * 5; return all(ellipse(f1(20 + r() * 68), f1(46 + r() * 56), f1(rr), f1(rr * 0.8), cols[i % cols.length]!, C.ink, 1)); }); })()), 9, 'bKg')),
  /** snäckskal: two spiral snail shells and a ribbed scallop shell lying on a sandy beach by the water. */
  'berg.snäckskal': all(bg(SKY), water(4, 40, 112, 22), path('M4 62 C40 58 80 66 116 60 L116 112 L4 112 Z', SAND, C.ink, 1.2), dots(4, 66, 112, 44, 40, '#c9a868', 121, 0.9),
    shell(34, 92, 2.2), scallop(84, 92, 2), shell(66, 104, 1, '#e8c0a8')),
  /** korall: under a warm sea – branching pink and orange corals and a round coral growing from the bottom, with small fish swimming among them. */
  'berg.korall': all(bg(), water(4, 8, 112, 104, '#6fc0d8'), path('M4 100 C30 96 80 104 116 98 L116 112 L4 112 Z', SAND, C.ink, 1.2),
    line('M36 100 L36 76 M36 86 L26 70 M36 80 L46 62 M26 70 L20 60 M26 70 L30 58 M46 62 L42 50 M46 62 L54 54', '#ef7aa0', 5), line('M36 100 L36 76 M36 86 L26 70 M36 80 L46 62 M26 70 L20 60 M26 70 L30 58 M46 62 L42 50 M46 62 L54 54', '#f6a8c0', 2.4),
    line('M80 100 L80 82 M80 90 L70 76 M80 86 L92 70 M92 70 L96 60', '#ef8a3c', 5), line('M80 100 L80 82 M80 90 L70 76 M80 86 L92 70 M92 70 L96 60', '#f7b070', 2.4),
    path('M56 100 C52 88 72 86 70 100 Z', '#c9a0d8', C.ink, 1.2), line('M58 96 q3 -4 6 0 q3 4 5 0', '#9a6ab0', 1), fish(70, 40, 1.1, C.yellow, -1), fish(96, 30, 0.9, '#3f6fb5')),
  /** porös: water drops sinking into a pale stone full of small holes, which turns dark where it gets wet; a grey dense stone beside it lets the drops lie on top. */
  'berg.porös': all(bg(), ground, block(10, 58, 50, 50, SANDST, all(rect(10, 58, 50, 50, SANDST, 0, null), path('M10 58 L60 58 L60 74 C46 80 26 78 10 72 Z', '#c09a5a', null),
    ...(() => { const r = rng(131); return Array.from({ length: 40 }, () => circle(f1(13 + r() * 44), f1(61 + r() * 44), f1(0.8 + r() * 1.4), '#7a5a30', null)); })()), 7, 'bPo'),
    ...[[24, 34], [38, 26], [48, 38]].map(([x, y]) => path(`M${x} ${y! - 5} C${x! + 4} ${y} ${x! + 3} ${y! + 4} ${x} ${y! + 4} C${x! - 3} ${y! + 4} ${x! - 4} ${y} ${x} ${y! - 5} Z`, '#5aa8e0', C.ink, 0.9)), arrow(36, 44, 36, 56, '#3f6fb5', 2),
    greyed(block(74, 74, 34, 34, '#8a8c92', '', 6), ...[[82, 66], [94, 64]].map(([x, y]) => ellipse(x!, y!, 4, 2.4, '#5aa8e0', C.ink, 0.9)))),

  // ── 2513 Metamorfa bergarter ──
  /** omvandla: sunlight → arrow → a solar panel → arrow → a glowing light bulb: one thing turned into something completely different. */
  'berg.omvandla': all(bg(), ground, circle(18, 30, 9, C.yellow, C.ink, 1.4), ...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(18 + Math.cos(a) * 12)} ${f1(30 + Math.sin(a) * 12)} L${f1(18 + Math.cos(a) * 16)} ${f1(30 + Math.sin(a) * 16)}`, GOLD, 2); }),
    arrow(30, 44, 42, 58, C.accent, 2.6), path('M40 92 L56 64 L84 64 L68 92 Z', '#2f4a7a', C.ink, 1.4), line('M48 78 L76 78 M60 64 L52 92 M72 64 L64 92', '#8cb4e0', 1), line('M62 92 L62 106 M54 106 L70 106', C.ink, 2),
    arrow(80, 82, 90, 74, C.accent, 2.6), circle(102, 56, 10, C.yellow, C.ink, 1.4), rect(98, 66, 8, 7, C.grey, 1, C.ink, 1.1), ...[-1, 0, 1].map((i) => line(`M${102 + i * 13} ${40 - (i === 0 ? 2 : 0)} l${i * 3} -5`, GOLD, 2))),
  /** metamorf: a layered rock → a box with a flame below, pressure arrows above and a high thermometer → a new rock with wavy light and dark bands. */
  'berg.metamorf': all(bg(), ground, block(6, 80, 22, 28, SANDST, layersTex(6, 80, 22, 28, [SANDST, '#c9a070', LIME, '#a88a6a']), 5, 'bMt1'), arrow(32, 92, 40, 92, C.accent, 2.4),
    rect(42, 70, 34, 30, '#f3e6dc', 3, C.ink, 1.4), rect(50, 80, 18, 14, '#b9a48a', 1, C.ink, 1), flame(58, 112, 0.7), press(59, 40, 59, 66), thermo(84, 74, 0.95, C.red, 0.7), arrow(78, 98, 86, 98, C.accent, 2.4),
    block(88, 80, 22, 28, GN1, foldTex(88, 80, 22, 28, GN1, GN2, 6, 2.4, 1), 5, 'bMt2')),
  /** gnejs: a rounded rock by the sea with wavy light and dark bands running through it, some of them bent. */
  'berg.gnejs': all(bg(SKY), water(4, 84, 112, 28), clip('bGn', 'M6 104 C8 70 34 48 64 48 C92 48 112 70 114 104 Z', foldTex(6, 44, 108, 62, GN1, GN2, 11, 3.4, 1.4)),
    path('M6 104 C8 70 34 48 64 48 C92 48 112 70 114 104 Z', 'none', C.ink, 1.8), line('M6 104 L114 104', C.ink, 1.2)),
  /** veckad: a rock face whose coloured layers are bent into big waves, like folded cloth; a small grey block with straight layers stands below as contrast. */
  'berg.veckad': all(bg(), clip('bVk', rectD(8, 12, 104, 66), foldTex(8, 6, 104, 76, LIME, '#b0784e', 8, 9, 1.3)), rect(8, 12, 104, 66, 'none', 2, C.ink, 1.8),
    greyed(block(70, 90, 30, 18, LIME, layersTex(70, 90, 30, 18, [LIME, '#b0784e', LIME, '#b0784e']), 5, 'bVk2')), ground),
  /** klyva: an axe coming down into a log on a chopping block, the log splitting lengthwise into two halves that fall apart. */
  'berg.klyva': all(bg(), ground, rect(36, 92, 48, 16, '#8a5a3a', 2, C.ink, 1.4), ellipse(60, 92, 24, 5, '#c99a6a', C.ink, 1.2),
    path('M42 92 L46 50 L58 48 L58 92 Z', '#d9b07a', C.ink, 1.3), path('M62 92 L62 48 L74 50 L78 92 Z', '#d9b07a', C.ink, 1.3), ellipse(52, 49, 6, 2.4, '#e9cfa0', C.ink, 1), ellipse(68, 49, 6, 2.4, '#e9cfa0', C.ink, 1),
    rot(60, 46, 0, 1, path('M-7 0 L7 0 L5 -12 L-5 -12 Z', STEEL, C.ink, 1.3)), line('M60 34 L96 14', WOOD, 4), forearm(116, 6, 98, 14), line('M44 60 l-8 -2 M76 60 l8 -2', GREY, 1.4)),
  /** skiffer: a house roof covered in rows of flat dark-grey slate tiles; in front, a stack of thin slate slabs, one being split off. */
  'berg.skiffer': all(bg(SKY), ground, path('M10 60 L60 22 L110 60 Z', SLATE, C.ink, 1.6), ...[0, 1, 2, 3, 4].map((i) => line(`M${f1(60 - (i + 1) * 9.6)} ${f1(22 + (i + 1) * 7.3)} L${f1(60 + (i + 1) * 9.6)} ${f1(22 + (i + 1) * 7.3)}`, '#4a535e', 1)),
    ...(() => { const out: Svg[] = []; for (let i = 0; i < 5; i++) { const y = 22 + (i + 1) * 7.3, half = (i + 1) * 9.6; for (let x = 60 - half + 6; x < 60 + half - 2; x += 7) out.push(line(`M${f1(x + (i % 2) * 3)} ${f1(y - 7)} L${f1(x + (i % 2) * 3)} ${f1(y)}`, '#4a535e', 0.8)); } return out; })(),
    rect(18, 60, 84, 24, '#e8d8c0', 0, C.ink, 1.3), rect(52, 66, 14, 18, '#7a5a3a', 0.5, C.ink, 1),
    ...[0, 1, 2, 3].map((i) => path(`M14 ${108 - i * 4} L50 ${108 - i * 4} L54 ${104 - i * 4} L18 ${104 - i * 4} Z`, i % 2 ? '#5a6470' : SLATE, C.ink, 0.9)), rot(40, 88, -14, 1, path('M-16 0 L16 0 L19 -3 L-13 -3 Z', SLATE, C.ink, 0.9))),
  /** kvartsit: a dull grey sandstone → arrow → a pale pink, glassy, very hard block; a knife tip slides off it with a spark and leaves no mark. */
  'berg.kvartsit': all(bg(), ground, greyed(block(8, 84, 22, 24, SANDST, dots(8, 84, 22, 24, 50, '#a8844a', 141, 0.7), 5, 'bKq1')), arrow(34, 94, 44, 94, C.accent, 2.4),
    block(48, 58, 52, 50, '#f2dcd6', all(rect(48, 58, 52, 50, '#f2dcd6', 0, null), grains(48, 58, 52, 50, 40, 4, ['#f7e8e4', '#ead0c8', '#fbf2ef'], 143, 0.4)), 8, 'bKq2'), path('M54 64 L70 64 L56 80 Z', 'rgba(255,255,255,0.6)', null),
    rot(86, 46, 35, 1, path('M0 0 L4 -26 L8 -26 L6 0 Z', STEEL, C.ink, 1.1), rect(3, -40, 6, 14, '#3d3f4a', 2, C.ink, 1)), sparkle(84, 54, 5, C.yellow)),
  /** täljsten: a hand with a knife carving a soft grey-green stone into a bowl, with curly shavings falling off. */
  'berg.täljsten': all(bg(), ground, path('M24 108 C18 84 30 66 60 66 C90 66 102 84 96 108 Z', '#9aa898', C.ink, 1.6), ellipse(60, 70, 30, 7, '#7e8c7c', C.ink, 1.3), ellipse(60, 71, 22, 4, '#6a7868', null),
    dots(24, 74, 72, 34, 40, '#7e8c7c', 151, 0.9), rot(76, 58, -30, 1, path('M0 0 L3 -18 L6 -18 L5 0 Z', STEEL, C.ink, 1.1), rect(1.5, -32, 6, 14, WOOD, 2, C.ink, 1)), forearm(116, 10, 67, 34),
    path('M50 60 C46 52 54 48 52 42 C50 38 56 36 56 40', 'none', '#7e8c7c', 2.2), path('M40 104 c3 -3 6 0 4 3 M100 102 c3 -3 6 0 4 3', 'none', '#7e8c7c', 2)),
  /** glimmerskiffer: a silvery grey layered rock that glitters all over in the sunshine. */
  'berg.glimmerskiffer': all(bg(SKY), ground, circle(100, 20, 8, C.yellow, C.ink, 1.2), line('M88 30 L80 38 M92 34 L88 42 M84 26 L76 30', GOLD, 1.6),
    block(14, 50, 76, 58, '#a9aeb4', layersTex(14, 50, 76, 58, ['#b4b9bf', '#9aa0a8', '#c0c4ca', '#9aa0a8', '#b4b9bf', '#a2a8b0', '#bcc0c6'], 2), 8, 'bGs'),
    ...(() => { const r = rng(161); return Array.from({ length: 14 }, () => sparkle(f1(18 + r() * 68), f1(54 + r() * 50), f1(1.6 + r() * 2.2), C.white)); })()),

  // ── 2514 Mineralens egenskaper ──
  /** mineral: a granite block under a lens; arrows lead from it to its three building blocks – a pink crystal, a grey glassy crystal and a stack of black flakes. */
  'berg.mineral.2': all(bg(), ground, block(10, 64, 40, 44, GRAN, granTex(10, 64, 40, 44, 171, 4.5), 7, 'bMi'), arrow(54, 76, 70, 40, C.accent, 2), arrow(56, 84, 72, 74, C.accent, 2), arrow(54, 94, 70, 104, C.accent, 2),
    cube(80, 46, 16, PINK), crystal(86, 90, 12, 16, QTZ, 0), ...[0, 1, 2].map((i) => path(`M74 ${108 - i * 3} L96 ${106 - i * 3} L102 ${102 - i * 3} L80 ${104 - i * 3} Z`, MICA, C.ink, 0.9))),
  /** glans: light falls on two stones – a gold-coloured cube that shines strongly with bright highlights and sparkles, and a grey dull lump beside it as contrast. */
  'berg.glans.2': all(bg(), ground, ...[0, 1, 2].map((i) => line(`M${14 + i * 10} 8 L${40 + i * 8} 50`, '#f6d77a', 2.4)), cube(30, 104, 38, GOLD), path('M34 70 L58 70 L44 86 Z', 'rgba(255,255,255,0.75)', null), sparkle(66, 54, 6, C.white), sparkle(40, 62, 4, C.white), sparkle(78, 80, 3.4, C.white),
    greyed(lump(98, 98, 14, 11, '#8a8478', 7))),
  /** hårdhet: the same steel nail scratches two stones – the soft grey one gets a deep scratch and powder, the hard coloured one only a spark and no mark; a gauge stands high beside it. */
  'berg.hårdhet': all(bg(), ground, greyed(lump(28, 96, 20, 12, '#d8d4c8', 8), line('M16 92 L38 96', '#8a8478', 2.4), dots(18, 104, 22, 6, 12, '#aaa', 181, 1), rot(42, 80, 30, 1, rect(-1.5, -22, 3, 22, STEEL, 1, C.ink, 1))),
    gem(78, 92, 2.2, '#bfe6f5'), rot(88, 72, 30, 1, rect(-1.5, -22, 3, 22, STEEL, 1, C.ink, 1), rect(-4, -26, 8, 4, STEEL, 1, C.ink, 1)), sparkle(84, 80, 5, C.yellow),
    rect(104, 24, 8, 80, C.white, 2, C.ink, 1.2), rect(105.5, 32, 5, 70, C.accent, 1, null), line('M112 40 l3 0 M112 56 l3 0 M112 72 l3 0 M112 88 l3 0', C.ink, 1)),
  /** talk: a soft, pale green-white stone; a thumb rubs over it and its nail leaves a groove while fine white powder falls into a little heap. */
  'berg.talk': all(bg(), ground, lump(54, 92, 36, 18, '#e2eadc', 9), dots(22, 80, 64, 26, 30, '#c2ccb8', 191, 0.9), path('M40 84 C52 80 64 80 74 84', 'none', '#a8b29e', 3),
    forearm(118, 46, 84, 74), rot(78, 79, 40, 1, rect(-3, -3, 6, 5, '#f6dcd0', 2, C.ink, 0.9)),
    dots(84, 96, 14, 12, 20, C.white, 193, 1.2), path('M80 110 C82 100 98 100 100 110 Z', '#f6f6f2', C.ink, 1)),
  /** hårdhetsskala: a ladder-like scale numbered 1 to 10 from bottom to top, with a soft pale stone at step 1 and a sparkling diamond at step 10. */
  'berg.hårdhetsskala': all(bg(), rect(44, 10, 32, 100, C.white, 3, C.ink, 1.6), ...Array.from({ length: 10 }, (_, i) => all(line(`M44 ${f1(108 - (i + 1) * 9.6)} L76 ${f1(108 - (i + 1) * 9.6)}`, '#c9ced4', 1), T(60, f1(106 - i * 9.6), String(i + 1), 8, i > 7 ? C.accent : C.ink))),
    arrow(36, 104, 36, 18, C.accent, 2.6), lump(94, 100, 12, 8, '#e2eadc', 9), gem(94, 20, 1.6, '#bfe6f5'), sparkle(106, 12, 3.4, C.yellow), line('M78 101 L84 101 M78 20 L84 20', C.ink, 1.2)),
  /** repa: a hand drags the sharp tip of a crystal across a pane of glass and leaves a thin white scratch behind it. */
  'berg.repa-verb': all(bg(), ground, path('M10 104 L26 44 L110 44 L94 104 Z', 'rgba(190,225,245,0.7)', C.ink, 1.6), line('M30 56 L42 52', C.white, 2), path('M30 88 C44 82 58 80 74 74', 'none', C.white, 2.2), path('M30 88 C44 82 58 80 74 74', 'none', 'rgba(43,42,51,0.35)', 0.6),
    crystal(78, 74, 8, 14, QTZ, 30), forearm(116, 30, 92, 52), motion(26, 82, -1)),
  /** kalkspat: a clear, slanted crystal lying on a striped page; seen through the crystal every line appears twice. */
  'berg.kalkspat': all(bg(), ground, rect(10, 30, 100, 76, C.white, 2, C.ink, 1.4), ...[0, 1, 2, 3, 4, 5, 6].map((i) => line(`M18 ${42 + i * 9} L102 ${42 + i * 9}`, '#5a6270', 2.4)),
    path('M34 52 L74 44 L92 76 L52 86 Z', 'rgba(245,250,252,0.92)', C.ink, 1.4), clip('bKs', 'M34 52 L74 44 L92 76 L52 86 Z', ...[0, 1, 2, 3, 4, 5, 6].map((i) => line(`M18 ${42 + i * 9} L102 ${42 + i * 9}`, '#5a6270', 1.8)), ...[0, 1, 2, 3, 4, 5, 6].map((i) => line(`M18 ${46.5 + i * 9} L102 ${46.5 + i * 9}`, '#5a6270', 1.8))),
    path('M34 52 L40 46 L80 38 L74 44 Z', 'rgba(220,235,245,0.9)', C.ink, 1.2), path('M74 44 L80 38 L98 70 L92 76 Z', 'rgba(200,220,235,0.9)', C.ink, 1.2)),
  /** streckfärg: a hand draws a gold-coloured stone across a white unglazed tile, and the line it leaves is black. */
  'berg.streckfärg': all(bg(), ground, rect(10, 60, 80, 44, '#fbfbf6', 3, C.ink, 1.6), line('M14 64 L86 64', '#e8e8e2', 1), path('M18 90 C34 84 50 82 66 76', 'none', '#2b2a2e', 4.2),
    cube(64, 82, 14, GOLD), sparkle(80, 62, 3, C.white), forearm(118, 50, 88, 66)),
  /** magnetisk: a red horseshoe magnet lifts a black stone that clings to it, with field lines between; a grey stone lies still on the ground as contrast. */
  'berg.magnetisk': all(bg(), ground, magnet(46, 40, 1.6), lump(46, 60, 14, 9, IRON, 11), glint(42, 58, 2.4), line('M30 46 C26 52 30 56 36 56 M62 46 C66 52 62 56 56 56', '#8cc7e8', 1.4, '2 2'),
    line('M46 4 L46 14', C.ink, 1.6), arrow(46, 84, 46, 72, C.accent, 2.4), greyed(lump(92, 102, 14, 8, '#9a948c', 13))),
  /** densitet: a balance with two cubes of exactly the same size – the gold cube is heavy and sinks, the light wooden cube rises. */
  'berg.densitet': all(bg(), ground, rect(56, 50, 8, 58, '#6a6f78', 2, C.ink, 1.3), rect(40, 104, 40, 6, '#6a6f78', 2, C.ink, 1.2), rot(60, 48, 14, 1, line('M-40 0 L40 0', C.ink, 3)),
    circle(60, 48, 3, C.dark, null), line('M21 38 L13 66 M21 38 L29 66 M99 58 L91 86 M99 58 L107 86', C.ink, 1), path('M9 66 L33 66 L31 70 L11 70 Z', '#9aa3ad', C.ink, 1.1), path('M87 86 L111 86 L109 90 L89 90 Z', '#9aa3ad', C.ink, 1.1),
    cube(13, 66, 13, GOLD), cube(91, 86, 13, '#e6c48a'), line('M95 78 L102 78 M95 82 L102 82', '#b8925a', 0.8), arrow(10, 80, 10, 96, C.accent, 2.2), arrow(116, 76, 116, 62, C.accent, 2.2)),

  // ── 2515 Kristaller och malmer ──
  /** kristall: a group of crystals with flat faces and straight sharp edges – white salt cubes, a clear six-sided column and a purple double point – under a lens. */
  'berg.kristall': all(bg(), ground, cube(12, 108, 16, '#f2f2ee'), cube(30, 108, 10, '#f2f2ee'), crystal(62, 108, 18, 44, '#cfe8f5', 0), crystal(80, 108, 12, 26, '#cfe8f5', 18),
    rot(100, 88, 0, 1, path('M0 -16 L9 0 L0 16 L-9 0 Z', '#b9a0e0', C.ink, 1.2), line('M-9 0 L9 0 M0 -16 L3 0 L0 16', 'rgba(43,42,51,0.35)', 0.8)), glint(58, 72, 3), glint(20, 88, 2.4)),
  /** sexkantig: a big coloured hexagon with its six corners marked by dots and a six-armed snowflake inside; a small grey square stands beside it as contrast. */
  'berg.sexkantig': all(bg(), path(hexD(52, 58, 40, 0.866), '#cfe8f5', C.ink, 2.4), ...[0, 1, 2, 3, 4, 5].map((i) => { const a = (i / 6) * Math.PI * 2; return circle(f1(52 + Math.cos(a) * 40), f1(58 + Math.sin(a) * 40), 3.2, C.accent, C.ink, 1); }),
    ...[0, 1, 2, 3, 4, 5].map((i) => { const a = (i / 6) * Math.PI * 2 + Math.PI / 6; const x2 = f1(52 + Math.cos(a) * 18), y2 = f1(58 + Math.sin(a) * 18); return line(`M52 58 L${x2} ${y2} M${f1(52 + Math.cos(a) * 11)} ${f1(58 + Math.sin(a) * 11)} l${f1(Math.cos(a + 0.9) * 5)} ${f1(Math.sin(a + 0.9) * 5)} M${f1(52 + Math.cos(a) * 11)} ${f1(58 + Math.sin(a) * 11)} l${f1(Math.cos(a - 0.9) * 5)} ${f1(Math.sin(a - 0.9) * 5)}`, '#3f6fb5', 1.8); }),
    greyed(rect(94, 88, 18, 18, '#cfe8f5', 1, C.ink, 1.6))),
  /** bergkristall: clear, glassy, six-sided quartz points growing up from a grey stone, with bright highlights. */
  'berg.bergkristall': all(bg(), ground, lump(60, 100, 44, 12, '#9a948c', 17), crystal(58, 96, 18, 50, 'rgba(225,240,248,0.92)', 0, '#4a5a68'), crystal(38, 98, 12, 30, 'rgba(225,240,248,0.92)', -22, '#4a5a68'),
    crystal(80, 98, 12, 34, 'rgba(225,240,248,0.92)', 20, '#4a5a68'), crystal(94, 102, 8, 18, 'rgba(225,240,248,0.92)', 36, '#4a5a68'), glint(54, 50, 3.6), glint(84, 66, 2.6), glint(36, 74, 2.4)),
  /** ametist: a round grey stone broken in half; the hollow inside is lined with many small purple crystal points. */
  'berg.ametist': all(bg(), ground, ellipse(60, 70, 46, 38, '#a49c90', C.ink, 1.8), ellipse(60, 70, 40, 32, '#efe8e0', C.ink, 1.2), ellipse(60, 72, 32, 24, '#7a4aa8', null),
    ...(() => { const out: Svg[] = []; for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2; const x = 60 + Math.cos(a) * 30, y = 72 + Math.sin(a) * 22; out.push(rot(f1(x), f1(y), f1((a * 180) / Math.PI - 90), 1, path('M-4 2 L0 -9 L4 2 Z', i % 2 ? '#9a6ad0' : '#b98ae0', C.ink, 0.8))); } return out; })(),
    ...[[50, 66], [66, 78], [62, 62], [52, 80]].map(([x, y]) => path(`M${x! - 4} ${y! + 3} L${x} ${y! - 9} L${x! + 4} ${y! + 3} Z`, '#c9a0ec', C.ink, 0.8)), glint(66, 64, 2.6)),
  /** ädelsten: a velvet cushion with three cut, sparkling gems – red, blue and green – and a gold ring with a stone. */
  'berg.ädelsten': all(bg(), ground, path('M10 96 C10 84 110 84 110 96 C110 108 10 108 10 96 Z', '#7a2a4a', C.ink, 1.6), line('M20 94 C40 90 80 90 100 94', '#9a3a62', 1.2),
    gem(36, 82, 1.8, '#d64545'), gem(62, 76, 2.1, '#3f6fb5'), gem(88, 82, 1.8, '#3f9a5a'), sparkle(50, 62, 4, C.white), sparkle(76, 58, 3.4, C.white), sparkle(98, 66, 3, C.white),
    ellipse(60, 38, 14, 6, 'none', GOLD, 3.4), gem(60, 26, 1, '#bfe6f5'), sparkle(70, 20, 2.6, C.yellow)),
  /** pyrit: a cluster of shiny gold-coloured cubes with straight edges growing on a dark stone. */
  'berg.pyrit': all(bg(), ground, lump(60, 100, 46, 12, '#5a5650', 19), cube(30, 100, 20, GOLD), cube(52, 94, 26, '#e8c04a'), cube(80, 100, 16, GOLD), cube(44, 76, 12, '#e8c04a'),
    line('M56 80 L74 80 M56 86 L74 86', 'rgba(140,100,20,0.35)', 0.8), sparkle(64, 64, 4.4, C.white), sparkle(36, 82, 3, C.white), sparkle(90, 84, 2.6, C.white)),
  /** malm: a rough rock lump with veins and flecks of copper and gold → arrow → shining bars of copper and gold metal; a pickaxe lies by the rock. */
  'berg.malm': all(bg(), ground, lump(32, 82, 26, 22, '#8a8478', 21), path('M12 74 C24 82 34 70 50 80', 'none', COPPER, 3), path('M18 92 C28 88 36 96 48 90', 'none', GOLD, 2.6), ...[[22, 70], [40, 86], [30, 96], [44, 72]].map(([x, y]) => circle(x!, y!, 2, '#4a9a7a', C.ink, 0.6)),
    pick(30, 50, 0.8, -60), arrow(62, 80, 76, 80, C.accent, 3), bar(96, 104, 1.5, COPPER), bar(96, 94, 1.5, GOLD), bar(96, 84, 1.5, COPPER), sparkle(108, 76, 3, C.white)),
  /** järnmalm: a railway ore wagon heaped with heavy black and dark-red lumps → arrow → a steel beam. */
  'berg.järnmalm': all(bg(), line('M4 104 L116 104', C.ink, 1.6), line('M4 108 L116 108', '#6a6f78', 1), path('M8 66 L64 66 L60 94 L12 94 Z', '#6a4a3a', C.ink, 1.4), line('M10 80 L62 80', '#5a3a2a', 1),
    ...(() => { return Array.from({ length: 10 }, (_, i) => lump(f1(14 + (i % 5) * 11), f1(i < 5 ? 64 : 56), 6.5, 5, i % 3 ? IRON : '#6a3a34', 211 + i, 1)); })(),
    circle(20, 98, 6, C.dark, C.ink, 1.2), circle(52, 98, 6, C.dark, C.ink, 1.2), arrow(70, 78, 82, 78, C.accent, 3),
    path('M86 64 L112 64 L112 68 L101 68 L101 88 L112 88 L112 92 L86 92 L86 88 L97 88 L97 68 L86 68 Z', STEEL, C.ink, 1.3)),
  /** fyndighet: a cut through the ground – a drill tower on the surface, and deep below a large dark body of ore full of glinting metal, outlined in orange, with the drill line reaching it. */
  'berg.fyndighet': all(bg(SKY), rect(4, 32, 112, 4, GRASS, 0, C.ink, 1), rect(4, 36, 112, 76, '#b8ad9c', 0, C.ink, 1), dots(4, 36, 112, 76, 60, '#988d7c', 221, 1),
    path('M22 96 C18 78 40 70 62 72 C86 74 104 82 98 100 C80 108 40 108 22 96 Z', '#4b4650', C.accent, 2.4), ...(() => { const r = rng(223); return Array.from({ length: 10 }, () => sparkle(f1(32 + r() * 60), f1(78 + r() * 20), 2.2, GOLD)); })(),
    path('M54 32 L60 6 L66 32', 'none', '#c0563d', 2), line('M56 22 L64 22 M57 14 L63 14', '#c0563d', 1.4), line('M60 32 L60 74', C.ink, 1.6, '3 2')),
  /** magnetit: a black, shiny eight-sided crystal (a double point) with a small red magnet stuck to its side and a paper clip pulled towards it. */
  'berg.magnetit': all(bg(), ground, path('M56 14 L88 58 L56 102 L24 58 Z', IRON, C.ink, 1.6), path('M56 14 L64 58 L56 102 M24 58 L64 58 L88 58', 'none', '#5a5a64', 1.2), path('M56 14 L64 58 L88 58 Z', '#4a4a54', null),
    line('M44 40 L50 30', 'rgba(255,255,255,0.5)', 2), glint(46, 36, 3), magnet(92, 52, 0.9, 90), path('M100 82 L112 82 C116 82 116 90 112 90 L102 90 C99 90 99 86 102 86 L110 86', 'none', STEEL, 1.6), arrow(98, 86, 84, 80, C.accent, 1.8)),
  /** halt: two lumps of ore, each with a gauge beside it – the coloured lump is full of metal flecks and its gauge is filled high; the grey lump has few flecks and a low gauge. */
  'berg.halt': all(bg(), ground, lump(30, 92, 22, 16, '#6a6470', 23), ...(() => { const r = rng(231); return Array.from({ length: 16 }, () => circle(f1(14 + r() * 32), f1(82 + r() * 20), 1.8, '#c9cfd6', C.ink, 0.5)); })(),
    rect(56, 30, 10, 76, C.white, 2, C.ink, 1.3), rect(57.5, 46, 7, 58, C.accent, 1, null),
    greyed(lump(88, 98, 16, 11, '#6a6470', 29), circle(84, 96, 1.8, '#c9cfd6', C.ink, 0.5), circle(94, 100, 1.8, '#c9cfd6', C.ink, 0.5), rect(108, 50, 8, 56, C.white, 2, C.ink, 1.2), rect(109.5, 94, 5, 10, C.accent, 1, null))),
  /** utvinna: a lump of ore goes into a small smelting works with a glowing opening → out comes a shiny metal bar: something valuable taken out of the rock. */
  'berg.utvinna': all(bg(), ground, lump(18, 98, 12, 10, '#8a8478', 31), ...[[14, 94], [22, 100]].map(([x, y]) => circle(x!, y!, 1.8, COPPER, null)), arrow(32, 96, 40, 96, C.accent, 2.4),
    rect(42, 62, 40, 46, '#9a5a42', 1, C.ink, 1.4), rect(70, 30, 8, 32, '#7a4a3a', 0.5, C.ink, 1.2), path('M50 108 L50 92 C50 84 74 84 74 92 L74 108 Z', '#3a2a2a', C.ink, 1.2), ellipse(62, 100, 9, 5, HOT, null), ellipse(62, 100, 5, 3, HOT2, null),
    path('M72 26 C68 18 80 14 76 6', 'none', GREY, 2), arrow(86, 96, 94, 96, C.accent, 2.4), bar(106, 104, 1.1, STEEL), sparkle(108, 90, 3, C.white)),

  // ── 2516 Stenbrott och gruvor ──
  /** schakt: a cut through a mine – a head-frame tower on the surface, a long straight shaft (outlined in orange) going down with a lift cage in it, and tunnels branching off sideways. */
  'berg.schakt.2': all(bg(SKY), rect(4, 30, 112, 82, '#a99d8c', 0, C.ink, 1), dots(4, 30, 112, 82, 60, '#887c6c', 241, 1), rect(4, 28, 112, 3, GRASS, 0, C.ink, 1),
    path('M46 28 L52 6 L58 28 M48 18 L56 18', 'none', '#c0563d', 2.2), circle(52, 8, 3, C.dark, null), rect(48, 30, 8, 80, '#3a3530', 0, null), rect(47, 30, 10, 80, 'none', 0, C.accent, 2),
    rect(49, 62, 6, 9, HAT, 0.5, C.ink, 0.9), line('M52 8 L52 62', C.ink, 0.8), rect(57, 56, 50, 7, '#3a3530', 0, null), rect(14, 88, 33, 7, '#3a3530', 0, null), rect(57, 98, 40, 7, '#3a3530', 0, null),
    circle(90, 59, 1.8, '#fff6c8', null), circle(24, 91, 1.8, '#fff6c8', null)),
  /** gruvarbetare: a miner in a yellow hard hat with a shining head lamp and an orange work shirt, holding a pickaxe, in a dark tunnel propped up with wooden beams. */
  'berg.gruvarbetare': all(bg('#4a4440'), path('M4 112 L4 30 C30 8 90 8 116 30 L116 112 Z', '#5e564e', null), line('M14 112 L14 32 M106 112 L106 32 M10 32 C30 16 90 16 110 32', WOOD, 5), ground,
    miner(56, 0.9, 'calm'), reach(56, 0.9, 1, 82, 70), pick(86, 64, 0.9, 30)),
  /** gruvgång: inside a mine – a long tunnel through the rock seen from the inside, held up by wooden frames, with rails running into the dark, a hanging lamp and an ore cart. */
  'berg.gruvgång': all(bg('#3a3532'), path('M4 112 L4 10 L116 10 L116 112 Z', '#6a6058', null), path('M50 72 L70 72 L70 58 C70 48 50 48 50 58 Z', '#1e1b1a', C.ink, 1),
    ...[0, 1, 2].map((i) => { const k = 1 - i * 0.28, cx = 60, w = 52 * k, h = 90 * k, y = 112 - i * 14; return all(line(`M${f1(cx - w)} ${y} L${f1(cx - w)} ${f1(y - h)} L${f1(cx + w)} ${f1(y - h)} L${f1(cx + w)} ${y}`, WOOD, f1(6 * k))); }),
    path('M40 112 L56 70 M80 112 L64 70', 'none', '#8a8f96', 2), line('M46 98 L74 98 M50 86 L70 86 M53 78 L67 78', '#6b4a2b', 1.6), line('M60 22 L60 30', C.ink, 1), circle(60, 33, 3.4, '#fff1a8', C.ink, 1), circle(60, 33, 8, 'rgba(255,241,168,0.25)', null),
    cart(88, 104, 0.9)),
  /** spränga: a rock cliff blown apart – a big yellow-orange burst with dust clouds and pieces of rock flying out in all directions. */
  'berg.spränga': all(bg(SKY), ground, path('M4 112 L4 50 L40 40 L46 112 Z', '#9a948c', C.ink, 1.4), path('M84 112 L88 44 L116 50 L116 112 Z', '#9a948c', C.ink, 1.4),
    path('M64 18 L70 40 L92 30 L78 50 L100 62 L76 64 L82 86 L64 70 L50 90 L52 66 L28 70 L46 54 L28 36 L52 44 Z', HOT2, C.ink, 1.4), path('M64 34 L68 46 L80 42 L72 54 L84 60 L70 62 L72 74 L64 66 L56 76 L56 64 L44 64 L54 56 L44 46 L56 50 Z', HOT, null),
    ...[[18, 24, 20], [100, 20, -30], [104, 76, 40], [14, 82, -20], [40, 14, 10]].map(([x, y, r]) => rot(x!, y!, r!, 1, path('M-5 -3 L3 -5 L6 2 L-2 5 Z', '#7e7870', C.ink, 1))),
    path('M30 100 C24 92 36 86 42 92 C48 84 60 88 58 96 C66 94 70 104 62 106 L32 106 C24 106 24 100 30 100 Z', '#d8d2c8', C.ink, 1.1)),
  /** sprängämne: a rock face with drilled holes, each filled with a charge, wires running to a detonator box marked with a warning triangle. */
  'berg.sprängämne': all(bg(SKY), ground, path('M4 112 L4 20 L80 14 L84 112 Z', '#9a948c', C.ink, 1.6), dots(4, 20, 80, 92, 40, '#7e7870', 251, 1),
    ...[[24, 40], [50, 36], [30, 66], [58, 62], [40, 90]].map(([x, y]) => all(circle(x!, y!, 4.4, '#3a3530', C.ink, 1), circle(x!, y!, 3, '#d64545', null))),
    path('M24 40 C40 48 60 50 70 60 M50 36 C64 44 72 52 76 62 M30 66 C50 72 64 70 76 72 M58 62 C66 66 72 70 78 74 M40 90 C56 92 70 86 80 80', 'none', HAT, 1.4),
    path('M76 60 C86 70 90 84 96 92', 'none', HAT, 1.6), rect(88, 92, 22, 16, '#5a5f68', 2, C.ink, 1.3), path('M99 62 L110 82 L88 82 Z', HAT, C.ink, 1.4), T(99, 80, '!', 13, C.ink)),
  /** dynamit: a bundle of three red sticks tied together, with a burning fuse throwing sparks. */
  'berg.dynamit': all(bg(), ground, ...[0, 1, 2].map((i) => all(rect(28 + i * 18, 44, 16, 62, C.red, 3, C.ink, 1.6), line(`M${32 + i * 18} 50 L${32 + i * 18} 100`, 'rgba(255,255,255,0.35)', 2))),
    rect(24, 62, 58, 7, '#3d3f4a', 1, C.ink, 1.2), rect(24, 86, 58, 7, '#3d3f4a', 1, C.ink, 1.2), path('M54 44 C54 30 66 26 74 22 C80 18 84 20 88 16', 'none', '#5a4a3a', 2.4),
    sparkle(90, 14, 6, C.yellow), sparkle(98, 22, 3, C.orange), sparkle(84, 8, 2.6, C.orange), line('M92 10 l4 -4 M96 16 l5 -1', C.orange, 1.4)),
  /** stenbrott: a quarry cut in steps into a pink-grey granite hill, with square cut blocks stacked on the floor, a crane lifting one block and a small pool of water. */
  'berg.stenbrott': all(bg(SKY), path('M4 112 L4 34 L30 34 L30 54 L56 54 L56 74 L84 74 L84 112 Z', GRAN, C.ink, 1.6), dots(4, 34, 80, 78, 120, '#9a7a70', 261, 1), line('M4 54 L30 54 M4 74 L56 74 M14 34 L14 54 M40 54 L40 74 M70 74 L70 96', '#a8887c', 1),
    ...[[92, 98], [106, 98], [99, 86]].map(([x, y]) => block(x! - 6, y! - 6, 12, 12, GRAN, '', 3)), ellipse(40, 104, 18, 5, '#7fbde4', C.ink, 1.1),
    line('M96 112 L96 18 L64 18', '#e0a030', 3), line('M96 30 L84 18', '#e0a030', 2), line('M70 18 L70 46', C.ink, 1), block(64, 50, 12, 10, GRAN, '', 3), ground),
  /** stenhuggare: a stonemason in a dusty apron hammers a chisel into a large granite block, chips flying. */
  'berg.stenhuggare': all(bg(), ground, fig(34, '#9aa3ad', 'calm', { h: 0.9, bottom: '#5a6270' }), on(34, 0.9, rect(-12, -38, 24, 36, '#e8dcc4', 3, C.ink, 1.2)),
    reach(34, 0.9, 1, 60, 62), reach(34, 0.9, 1, 64, 78), hammerG(58, 62, 0.8, -60), rot(68, 76, 60, 1, rect(-1.4, -14, 2.8, 14, STEEL, 0.6, C.ink, 0.9)),
    block(72, 70, 38, 38, GRAN, granTex(72, 70, 38, 38, 271, 2.8), 6, 'bSh'), ...[[78, 60, 20], [84, 54, -10], [90, 62, 40]].map(([x, y, r]) => rot(x!, y!, r!, 1, path('M-2 -1 L2 -2 L3 1 L-1 2 Z', GRAN, C.ink, 0.8)))),
  /** dagbrott: a huge open pit in the ground with terraced steps going round and down, and a dump truck driving on the ramp. */
  'berg.dagbrott': all(bg(SKY), rect(4, 30, 112, 82, '#9fbf7a', 0, null), ...[0, 1, 2, 3, 4].map((i) => ellipse(60, f1(66 + i * 5), f1(54 - i * 10), f1(30 - i * 5.6), ['#b8a88e', '#a8987e', '#98886e', '#887860', '#6a6050'][i]!, C.ink, 1.2)),
    path('M20 62 C30 78 60 88 92 80', 'none', '#d8ccb4', 3), truck(70, 86, 0.38, rect(-28, -18, 34, 6, '#7a6a5a', 1, C.ink, 0.8)), ellipse(60, 92, 6, 3, '#7fbde4', null)),

  // ── 2517 Bergarters kretslopp ──
  /** geologi: the study of the Earth – a globe in the middle surrounded by its subjects: a layered rock cut, a rock hammer, a crystal and a lens, joined in a ring. */
  'berg.geologi': all(bg(), circle(60, 60, 46, '#fbf6ea', C.ink, 1.4), circle(60, 60, 16, '#7fbde4', C.ink, 1.4), path('M50 52 C56 48 60 56 66 50 C70 56 64 66 58 68 C52 64 46 60 50 52 Z', GRASS, C.ink, 1),
    block(22, 26, 18, 14, SANDST, layersTex(22, 26, 18, 14, [SANDST, '#c9a070', LIME]), 4, 'bGl'), hammerG(92, 26, 0.7, 40), crystal(30, 104, 10, 16, '#cfe8f5', 0), lens(88, 88, 8, granTex(78, 78, 20, 20, 281, 2.6), 'bGlL')),
  /** geolog: a geologist in an orange field vest with a backpack, a hand lens on a cord, raising a rock hammer against an outcrop of layered rock. */
  'berg.geolog': all(bg(SKY), clip('bGo', 'M70 112 L76 40 C90 34 108 36 116 40 L116 112 Z', layersTex(70, 34, 46, 78, [SANDST, '#c9a070', LIME, '#a88a6a', SANDST, '#8a7a6a'])), path('M70 112 L76 40 C90 34 108 36 116 40', 'none', C.ink, 1.6), ground,
    rect(18, 58, 12, 26, '#3f6fb5', 3, C.ink, 1.2), fig(38, '#e8dcc4', 'smile', { h: 0.92, bottom: '#5a6270' }), on(38, 0.92, path('M-14 -42 L-6 -42 L-4 2 L-12 2 Z M14 -42 L6 -42 L4 2 L12 2 Z', VEST, C.ink, 1), circle(0, -22, 3.4, 'rgba(200,230,250,0.7)', C.ink, 1.2), line('M-4 -40 L0 -25 L4 -40', C.ink, 0.8), path('M-10 -66 C-10 -76 10 -76 10 -66 L14 -64 L-10 -64 Z', '#3d6a5a', C.ink, 1.1)),
    reach(38, 0.92, 1, 64, 50), hammerG(68, 46, 0.8, 120)),
  /** geologisk: a coloured block diagram cut through the ground, showing tilted layers of different rocks with a granite body – the geologist’s view; an ordinary grey road map lies beside it as contrast. */
  'berg.geologisk': all(bg(), block(10, 42, 66, 50, '#e3c48a', all(foldTex(10, 30, 66, 70, '#e3c48a', '#8aa86a', 7, 6, 0.8), path('M40 92 C36 74 52 66 66 72 C76 76 76 88 76 92 Z', GRAN, C.ink, 1), grains(40, 72, 36, 20, 10, 2.4, [PINK, MICA], 291)), 10, 'bGg'),
    hammerG(30, 98, 0.6, -80), greyed(rect(82, 64, 30, 40, '#f0f0ea', 2, C.ink, 1.2), line('M84 80 L110 76 M92 64 L96 104 M84 96 L110 92', '#9aa3ad', 2.4), circle(100, 84, 2, C.red, null)), line('M4 112 L116 112', C.grey2, 2)),
  /** stenprov: a small chipped piece of rock in a clear plastic bag with a numbered label, a rock hammer lying beside it. */
  'berg.stenprov': all(bg(), ground, rect(20, 26, 50, 66, 'rgba(230,240,248,0.75)', 3, C.ink, 1.4), line('M20 34 L70 34', C.red, 2), lump(45, 66, 16, 13, GRAN, 33), clip('bSp', lumpD(45, 66, 16, 13, 33), granTex(28, 52, 34, 28, 301, 2.6)),
    lump(45, 66, 16, 13, 'none', 33, 1.4), rect(26, 78, 38, 10, C.white, 1, C.ink, 1), T(45, 86, '17', 8, C.ink), hammerG(90, 104, 0.9, -70)),
  /** berggrundskarta: an unfolded map with patches of pink, green, yellow and purple showing which rock lies where, and a column of colour keys beside it. */
  'berg.berggrundskarta': all(bg(), ground, path('M8 22 L36 18 L64 24 L92 18 L92 104 L64 108 L36 102 L8 106 Z', '#f4efe2', C.ink, 1.6),
    clip('bBk', 'M8 22 L36 18 L64 24 L92 18 L92 104 L64 108 L36 102 L8 106 Z', path('M8 18 L50 18 C46 40 30 50 8 56 Z', '#e8a8a0', C.ink, 1), path('M50 18 L92 18 L92 50 C74 56 60 46 50 18 Z', '#a8d098', C.ink, 1),
      path('M8 56 C30 50 46 40 50 18 C60 46 74 56 92 50 L92 80 C70 86 40 70 8 84 Z', '#f0d890', C.ink, 1), path('M8 84 C40 70 70 86 92 80 L92 108 L8 108 Z', '#c0a8d8', C.ink, 1), path('M40 60 C44 54 56 56 54 64 C50 70 40 68 40 60 Z', '#e8a8a0', C.ink, 1)),
    line('M36 18 L36 102 M64 24 L64 108', 'rgba(43,42,51,0.25)', 1), ...[['#e8a8a0', 30], ['#a8d098', 46], ['#f0d890', 62], ['#c0a8d8', 78]].map(([c, y]) => all(rect(98, +y!, 12, 9, c as string, 1, C.ink, 1), line(`M98 ${+y! + 12} L110 ${+y! + 12}`, '#c9ced4', 1)))),
  /** process: a chain of changes following one after another along a long arrow – ice cube → water drop → steam cloud – with a clock showing that it takes time. */
  'berg.process': all(bg(), arrow(8, 86, 112, 86, C.accent, 3), cube(12, 74, 16, '#d8eef8'), path('M60 46 C68 58 70 66 60 72 C50 66 52 58 60 46 Z', '#5aa8e0', C.ink, 1.3), path('M84 64 C80 64 80 56 86 56 C86 50 96 48 98 54 C104 52 108 58 104 62 C108 64 104 70 100 68 L86 68 C82 68 80 66 84 64 Z', '#eef2f6', C.ink, 1.3),
    arrow(36, 64, 48, 64, '#6f7680', 2), arrow(72, 62, 80, 62, '#6f7680', 2), circle(60, 24, 11, C.white, C.ink, 1.4), line('M60 24 L60 16 M60 24 L66 27', C.ink, 1.8), ...[[22, 96], [60, 96], [96, 96]].map(([x, y], i) => all(circle(x!, y!, 6, C.white, C.ink, 1.2), T(x!, y! + 3, String(i + 1), 8, C.ink)))),
  /** stadium: four steps in the growth of a plant – seed, sprout, young plant, tree with fruit – in a row; only the third step is coloured and framed, the others are grey. */
  'berg.stadium': all(bg(), ground, greyed(seedling(16, 100, 0), seedling(40, 100, 1), seedling(96, 100, 3)), seedling(68, 100, 2), rect(54, 64, 28, 44, 'none', 4, C.accent, 2.2), arrow(22, 86, 30, 86, '#9aa3ad', 1.6), arrow(48, 86, 54, 86, '#9aa3ad', 1.6), arrow(82, 86, 86, 86, '#9aa3ad', 1.6)),
  /** transportera: a yellow truck loaded with stones driving along a road, with motion lines behind it. */
  'berg.transportera': all(bg(SKY), rect(4, 96, 112, 16, '#8a8f96', 0, null), line('M10 104 L24 104 M40 104 L54 104 M70 104 L84 104 M100 104 L114 104', C.white, 1.6),
    truck(64, 98, 1.3, all(lump(-22, -16, 6, 4, '#9a948c', 41, 1), lump(-12, -18, 6, 5, '#8a8478', 43, 1), lump(-2, -16, 5, 4, '#a49c90', 47, 1), lump(-16, -22, 5, 4, '#9a948c', 49, 1))), motion(14, 74, -1)),
  /** ständig: arrows running round and round a clock face without ever stopping; a grey straight arrow that ends at a wall stands beside it as contrast. */
  'berg.ständig': all(bg(), circle(52, 56, 24, C.white, C.ink, 1.6), line('M52 56 L52 40 M52 56 L64 62', C.ink, 2), ...[0, 1, 2, 3].map((i) => { const a0 = (i / 4) * Math.PI * 2, a1 = a0 + 1.2; return all(path(`M${f1(52 + Math.cos(a0) * 34)} ${f1(56 + Math.sin(a0) * 34)} A34 34 0 0 1 ${f1(52 + Math.cos(a1) * 34)} ${f1(56 + Math.sin(a1) * 34)}`, 'none', C.accent, 3.4), arrow(f1(52 + Math.cos(a1 - 0.15) * 34), f1(56 + Math.sin(a1 - 0.15) * 34), f1(52 + Math.cos(a1) * 34), f1(56 + Math.sin(a1) * 34), C.accent, 3.4)); }),
    greyed(arrow(76, 104, 104, 104, C.accent, 3), rect(106, 94, 4, 18, C.dark, 1, null))),
};
