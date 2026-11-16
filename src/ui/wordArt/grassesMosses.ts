/**
 * Natur & geografi → Växter & svampar → Gräs & mossor, 2821–2827 (0.45): common grasses, meadow plants, cereals,
 * mosses, lichens, bog vegetation and mountain plants.
 * Recurring signs: plants drawn large and close, standing on the ground line (y = 112) or on a stone; the part the
 * word names (an ear, a panicle, a capsule, a tussock, a hollow) ringed or bracketed in orange; underground parts
 * shown in a cut of brown soil; smell as soft wavy lines, sound as short arcs, wind as grey streaks, cold as blue
 * flakes. Species are told apart by their typical shape and colour (a dense cylinder ear, red stems, a yellow crust,
 * a beard hanging from a branch). Abstract adjectives are small symbolic scenes where the coloured idea dominates and
 * a grey copy stands beside it as contrast. Digits only; no words, no brands and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { type Build } from './figures';
import { HL, arm } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const PAPER = '#f6f2ea';
const SKY = '#d6ecf7';
const GRASS = '#8cc96a';
const GRASS2 = '#5f9e45';
const DGRASS = '#3f7a36';
const STRAW = '#e2c25a';
const STRAW2 = '#c49a2e';
const SOIL = '#8a6040';
const SOIL2 = '#6e4a30';
const WOOD = '#a0673d';
const STONE = '#a9a49c';
const STONE2 = '#8c867d';
const MOSS = '#6fa83c';
const MOSS2 = '#4f8a2c';
const PEAT = '#5a4030';
const WATER = '#8cc7e8';
const WATER2 = '#3f86c0';
const SNOW = '#f4f8fb';
const PALEL = '#dfe3d2';
const YEL = '#f2c14e';
const ORANGE = '#e8892e';
const RED = '#c93a3a';
const LILAC = '#8a7ac8';
const WHITE = '#fbfbf8';
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (x: number, y: number, r: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${r}) scale(${s})`, ...k);
const bg = (col: string = PAPER) => rect(4, 4, 112, 108, col, 3, null);
const ground = line('M4 112 L116 112', C.grey2, 2);
/** Deterministic pseudo-random numbers in [0, 1). */
const rng = (seed: number) => { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; };
const ring = (x: number, y: number, rx: number, ry = rx) => ellipse(x, y, rx, ry, 'none', HL, 2.4);
const bracketTop = (x1: number, x2: number, y: number) => line(`M${x1} ${y + 5} L${x1} ${y} L${x2} ${y} L${x2} ${y + 5}`, HL, 2.4);
const smell = (x: number, y: number, col = '#b07ac0') => line(`M${x} ${y} q3 -3 0 -6 q-3 -3 0 -6 M${x + 6} ${y + 2} q3 -3 0 -6 q-3 -3 0 -6`, col, 1.4);
const sound = (x: number, y: number) => line(`M${x} ${y - 5} q4 5 0 10 M${x + 4} ${y - 8} q6 8 0 16`, C.ink, 1.3);
const wind = (x: number, y: number, w = 22) => line(`M${x} ${y} L${x + w} ${y} M${x + 6} ${y + 6} L${x + w + 4} ${y + 6} M${x} ${y + 12} L${x + w - 4} ${y + 12}`, C.grey, 1.6);
const flake = (x: number, y: number, r = 4, col = '#5aa8d8') => line(`M${x - r} ${y} L${x + r} ${y} M${f1(x - r / 2)} ${f1(y - r * 0.87)} L${f1(x + r / 2)} ${f1(y + r * 0.87)} M${f1(x - r / 2)} ${f1(y + r * 0.87)} L${f1(x + r / 2)} ${f1(y - r * 0.87)}`, col, 1.4);
const sunG = (x: number, y: number, r = 7) => all(circle(x, y, r, C.yellow, C.ink, 1.1), line(Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 5))} ${f1(y + Math.sin(a) * (r + 5))}`; }).join(' '), C.orange, 1.3));
const drop = (x: number, y: number, s = 1, col: string = WATER) => path(`M${x} ${f1(y - 5 * s)} C${f1(x + 4 * s)} ${y} ${f1(x + 3 * s)} ${f1(y + 4 * s)} ${x} ${f1(y + 4 * s)} C${f1(x - 3 * s)} ${f1(y + 4 * s)} ${f1(x - 4 * s)} ${y} ${x} ${f1(y - 5 * s)} Z`, col, C.ink, 0.9);
const dots = (x: number, y: number, w: number, h: number, n: number, col: string, seed: number, rr = 0.7) => { const r = rng(seed); return all(...Array.from({ length: n }, () => circle(f1(x + 1 + r() * (w - 2)), f1(y + 1 + r() * (h - 2)), rr, col, null))); };
const soilCut = (y: number, h = 112 - y) => all(rect(4, y, 112, h, SOIL, 0, null), dots(4, y, 112, h, Math.round(h * 4), SOIL2, 3, 0.8), line(`M4 ${y} L116 ${y}`, C.ink, 1.2));
const field = (y: number, col: string = GRASS) => rect(4, y, 112, 112 - y, col, 0, null);

// ── Grass parts ──────────────────────────────────────────────────────
/** One curved blade from (x, y) upwards. */
const blade = (x: number, y: number, h: number, lean: number, col: string = GRASS2, w = 1.8) => line(`M${x} ${y} Q${f1(x + lean * 0.2)} ${f1(y - h * 0.6)} ${f1(x + lean)} ${f1(y - h)}`, col, w);
/** A tuft of blades fanned out. */
const tuft = (x: number, y: number, h: number, n = 7, col: string = GRASS2, spread = 14, w = 1.8) => all(...Array.from({ length: n }, (_, i) => { const t = n === 1 ? 0 : i / (n - 1) - 0.5; return blade(x + t * 6, y, h * (1 - Math.abs(t) * 0.5), t * spread * 2, col, w); }));
/** Grass ground: a strip of short blades. */
const lawn = (y: number, col: string = GRASS2, step = 5, h = 6) => all(...Array.from({ length: Math.floor(108 / step) }, (_, i) => blade(6 + i * step, y, h + ((i * 7) % 4), ((i * 5) % 7) - 3, col, 1.3)));
/** A stem with a dense spike (ax) on top. */
const spikeGrass = (x: number, y: number, h: number, len = 14, w = 3.4, col: string = '#b8b060', lean = 0) => all(line(`M${x} ${y} Q${x + lean * 0.3} ${y - h * 0.5} ${x + lean} ${y - h}`, GRASS2, 1.6), blade(x, y - h * 0.3, h * 0.35, -8, GRASS2, 1.6), rot(x + lean, y - h, lean * 1.2, 1, rect(-w / 2, -len, w, len, col, w / 2, C.ink, 0.9), line(Array.from({ length: Math.floor(len / 2.4) }, (_, i) => `M${f1(-w / 2)} ${f1(-len + 1.5 + i * 2.4)} L${f1(w / 2)} ${f1(-len + 2.6 + i * 2.4)}`).join(' '), 'rgba(43,42,51,0.45)', 0.6)));
/** A stem with an airy panicle (vippa) on top. */
const panicleGrass = (x: number, y: number, h: number, ph = 22, col = '#a8a070', droop = 0) => {
  const top = y - h; const br: Svg[] = [];
  for (let i = 0; i < 6; i++) {
    const yy = top + 3 + i * (ph / 6); const L = 4 + i * 1.6; const side = i % 2 ? 1 : -1;
    const ex = x + side * L, ey = yy + 2 + droop * (i / 6) * 4;
    br.push(line(`M${x} ${f1(yy)} Q${f1(x + side * L * 0.5)} ${f1(yy - 2)} ${f1(ex)} ${f1(ey)}`, '#8a8a50', 0.9), ellipse(f1(ex), f1(ey), 1.6, 1, col, C.ink, 0.5), ellipse(f1(x + side * L * 0.55), f1(yy + 0.2), 1.3, 0.8, col, C.ink, 0.4));
  }
  return all(line(`M${x} ${y} L${x} ${top}`, GRASS2, 1.6), blade(x, y - h * 0.3, h * 0.35, 9, GRASS2, 1.6), ...br, ellipse(x, top, 1.3, 1.6, col, C.ink, 0.5));
};
/** A single seed-like grain. */
const grain = (x: number, y: number, s = 1, r = 0, col: string = STRAW) => rot(x, y, r, s, ellipse(0, 0, 1.8, 3, col, C.ink, 0.7), line('M0 -2 L0 2', 'rgba(43,42,51,0.35)', 0.5));
/** A cereal ear: n rows of grains, with optional awns. */
const ear = (x: number, y: number, s = 1, n = 6, awn = 0, col: string = STRAW, gw = 1, stemH = 0, bend = 0) => rot(x, y, bend, s,
  stemH ? line(`M0 ${stemH} L0 0`, STRAW2, 1.6) : '',
  ...Array.from({ length: n }, (_, i) => { const yy = -3 - i * 4.2; return all(
    awn ? line(`M-2 ${yy - 2} L${-3 - awn * 0.25} ${yy - 2 - awn} M2 ${yy - 2} L${3 + awn * 0.25} ${yy - 2 - awn}`, STRAW2, 0.8) : '',
    rot(-2.2 * gw, yy, -18, 1, ellipse(0, 0, 2 * gw, 3.2, col, C.ink, 0.8)), rot(2.2 * gw, yy, 18, 1, ellipse(0, 0, 2 * gw, 3.2, col, C.ink, 0.8))); }),
  ellipse(0, -5 - n * 4.2, 1.6 * gw, 2.6, col, C.ink, 0.8));
/** Oats: a hanging panicle of drop-shaped spikelets. */
const oats = (x: number, y: number, s = 1, stemH = 40) => at(x, y, s, line(`M0 0 L0 ${-stemH}`, STRAW2, 1.6), ...[0, 1, 2, 3, 4].map((i) => { const yy = -stemH + 2 + i * 6; const side = i % 2 ? 1 : -1; return all(line(`M0 ${yy} Q${side * 5} ${yy - 2} ${side * 8} ${yy + 2}`, STRAW2, 0.9), path(`M${side * 8} ${yy + 1} C${side * 10} ${yy + 4} ${side * 9} ${yy + 8} ${side * 8} ${yy + 9} C${side * 7} ${yy + 8} ${side * 6} ${yy + 4} ${side * 8} ${yy + 1} Z`, STRAW, C.ink, 0.7)); }));
/** A cereal field band: many ears in rows. */
const cerealRow = (x1: number, x2: number, y: number, s = 0.6, col: string = STRAW, awn = 0) => all(...Array.from({ length: Math.floor((x2 - x1) / 6) + 1 }, (_, i) => ear(x1 + i * 6, y, s, 5, awn, col, 1, 26, ((i * 7) % 5) - 2)));

// ── Flowers ──────────────────────────────────────────────────────────
const bloom = (x: number, y: number, r: number, petals: number, col: string, mid: string = C.yellow, sw = 0.6) => all(...Array.from({ length: petals }, (_, i) => rot(x, y, (360 / petals) * i, 1, ellipse(0, -r * 0.62, r * 0.32, r * 0.5, col, C.ink, sw))), circle(x, y, r * 0.32, mid, C.ink, sw));
const stalk = (x: number, y: number, h: number, lean = 0, col: string = GRASS2, w = 1.5) => line(`M${x} ${y} Q${x + lean * 0.3} ${y - h * 0.5} ${x + lean} ${y - h}`, col, w);
/** Three round leaflets on a short stalk (clover). */
const trefoil = (x: number, y: number, s = 1, col: string = MOSS2, mark = true) => at(x, y, s, line('M0 0 L0 8', col, 1.2), ...[-90, 30, 150].map((a) => rot(0, 0, a, 1, path('M0 0 C3 -1 6 -2 6 -5 C6 -8 3 -8 2 -6 C1 -8 -2 -8 -2 -5 C-2 -2 -1 -1 0 0 Z', col, C.ink, 0.7))), mark ? line('M-1 -3 L1 -3', WHITE, 0.6) : '');
/** A round clover head. */
const cloverHead = (x: number, y: number, r: number, col: string) => all(circle(x, y, r, col, C.ink, 0.9), ...Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * r * 0.4)} ${f1(y + Math.sin(a) * r * 0.4)} L${f1(x + Math.cos(a) * r * 0.95)} ${f1(y + Math.sin(a) * r * 0.95)}`, 'rgba(43,42,51,0.45)', 0.7); }));
const bee = (x: number, y: number, s = 1) => at(x, y, s, ellipse(-2, -6, 3.4, 2.4, 'rgba(255,255,255,0.8)', C.ink, 0.6), ellipse(2, -6, 3.4, 2.4, 'rgba(255,255,255,0.8)', C.ink, 0.6), ellipse(0, 0, 6, 4.6, C.yellow, C.ink, 1), path('M-2 -4.4 L-2 4.4 M2 -4.4 L2 4.4', 'none', C.ink, 1.6), circle(-6, 0, 2.4, C.dark, C.ink, 0.6));
const butterfly = (x: number, y: number, s = 1, col = '#e28a3c') => at(x, y, s, ellipse(-5, -3, 5, 4, col, C.ink, 0.8), ellipse(5, -3, 5, 4, col, C.ink, 0.8), ellipse(-4, 3, 3.4, 2.8, col, C.ink, 0.8), ellipse(4, 3, 3.4, 2.8, col, C.ink, 0.8), ellipse(0, 0, 1, 5, C.dark, null), line('M0 -5 L-2 -9 M0 -5 L2 -9', C.ink, 0.6));
const fly = (x: number, y: number, s = 1) => at(x, y, s, ellipse(-2.4, -2.4, 2.6, 1.6, 'rgba(220,235,245,0.9)', C.ink, 0.5), ellipse(2.4, -2.4, 2.6, 1.6, 'rgba(220,235,245,0.9)', C.ink, 0.5), ellipse(0, 0, 2.2, 3.2, C.dark, null), circle(0, -3, 1.4, '#7a2a2a', null), line('M-2 1 L-4 3 M2 1 L4 3 M-2 -1 L-4 -1 M2 -1 L4 -1', C.ink, 0.5));

// ── Landscape things ─────────────────────────────────────────────────
const tree = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s, rect(-1.6, -10, 3.2, 10, WOOD, 0.5, C.ink, 0.9), circle(0, -16, 8, col, C.ink, 1));
const oak = (x: number, y: number, s = 1) => at(x, y, s, path('M-3 0 L-2 -16 L-7 -24 M-2 -16 L2 -26 M2 -16 L3 0 Z', WOOD, C.ink, 1), path('M-18 -24 C-24 -34 -14 -46 -4 -42 C0 -50 14 -48 16 -40 C26 -38 24 -24 16 -22 C12 -16 -12 -16 -18 -24 Z', '#4f8a3a', C.ink, 1.2));
const conifer = (x: number, y: number, s = 1, col = '#2f6e4a') => at(x, y, s, rect(-1.4, -5, 2.8, 5, WOOD, 0.4, C.ink, 0.8), path('M0 -30 L-7 -18 L-4 -18 L-9 -10 L-5 -10 L-10 -4 L10 -4 L5 -10 L9 -10 L4 -18 L7 -18 Z', col, C.ink, 1));
const bushG = (x: number, y: number, s = 1, col = '#6a9a4a') => at(x, y, s, path('M-12 0 C-16 -8 -10 -16 -4 -14 C-2 -20 8 -20 9 -13 C15 -14 17 -4 12 0 Z', col, C.ink, 1));
const rock = (x: number, y: number, w: number, h: number, col: string = STONE) => path(`M${x - w / 2} ${y} C${x - w / 2} ${y - h * 0.7} ${x - w * 0.3} ${y - h} ${x} ${y - h} C${x + w * 0.35} ${y - h} ${x + w / 2} ${y - h * 0.6} ${x + w / 2} ${y} Z`, col, C.ink, 1.3);
const mountain = (col = '#9aa7b4') => all(path('M4 80 L34 34 L50 52 L70 22 L116 76 L116 112 L4 112 Z', col, C.ink, 1.3), path('M64 31 L70 22 L77 30 L72 33 L68 30 Z', SNOW, C.ink, 0.9), path('M30 40 L34 34 L38 40 L35 38 Z', SNOW, C.ink, 0.8));
const cow = (x: number, y: number, s = 1, flip = false) => g(`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`, ...[-12, -6, 8, 13].map((d) => rect(d - 2, -8, 4, 8, C.white, 1, C.ink, 1)), ellipse(0, -14, 17, 8, C.white, C.ink, 1.3), ellipse(-5, -15, 5, 3.5, C.dark, null), ellipse(7, -12, 4, 3, C.dark, null),
  path('M14 -18 L24 -20 L26 -12 L18 -10 Z', C.white, C.ink, 1.2), ellipse(25, -12.5, 2.4, 1.8, '#f2b6b6', C.ink, 0.6), line('M18 -20 L18 -24 M22 -20 L23 -24', C.ink, 1.2), circle(21, -16, 0.9, C.ink, null), line('M-17 -16 L-20 -8', C.ink, 1.2));
const grazingCow = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, ...[-12, -6, 8, 13].map((d) => rect(d - 2, -8, 4, 8, C.white, 1, C.ink, 1)), ellipse(0, -14, 17, 8, C.white, C.ink, 1.3), ellipse(-5, -15, 5, 3.5, C.dark, null), path('M14 -14 L24 -6 L22 0 L16 -4 Z', C.white, C.ink, 1.2), line('M16 -14 L17 -18', C.ink, 1.2), circle(20, -6, 0.8, C.ink, null));
const reindeer = (x: number, y: number, s = 1, head: 'up' | 'down' = 'up') => at(x, y, s, ...[-11, -6, 7, 12].map((d) => rect(d - 1.6, -10, 3.2, 10, '#8a7a6a', 1, C.ink, 0.9)), ellipse(0, -15, 15, 7, '#8a7a6a', C.ink, 1.2), ellipse(0, -11, 10, 3, '#e8e0d0', null),
  head === 'up' ? all(path('M11 -18 L16 -28 L22 -26 L17 -16 Z', '#8a7a6a', C.ink, 1.1), line('M16 -28 L12 -38 L8 -40 M13 -35 L17 -40 M18 -27 L22 -36 L26 -37 M21 -33 L19 -38', '#c8b48a', 1.6), circle(19, -25, 0.8, C.ink, null))
    : all(path('M11 -16 L20 -4 L25 -6 L17 -18 Z', '#8a7a6a', C.ink, 1.1), line('M14 -14 L6 -22 L2 -22 M8 -20 L10 -26 M16 -15 L14 -24 L18 -28', '#c8b48a', 1.6), circle(20, -8, 0.8, C.ink, null)));
const goose = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, -5, 8, 4.6, '#8a8a84', C.ink, 1), path('M6 -7 C9 -12 9 -16 12 -17 L15 -16 L12 -14 C11 -11 10 -8 8 -5 Z', C.dark, C.ink, 0.9), line('M-1 0 L-1 3 M2 0 L2 3', ORANGE, 1.2), path('M-8 -5 L-12 -7 L-9 -3 Z', '#5a5a54', C.ink, 0.7));
const geo = (x: number, h = 1, y0 = 112) => { const s = 0.84 * h, ty = y0 - 49 * s; return { s, ty, hy: ty - 56 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}, y0 = 112) =>
  y0 === 112 ? F({ x, top, mood, ...more }) : g(`translate(0 ${f1(y0 - 112)})`, F({ x, top, mood, ...more }));
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number, y0 = 112) => { const q = geo(x, h, y0); return all(arm(f1(side < 0 ? q.sl : q.sr), f1(q.sy), tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };
const scythe = (x: number, y: number, s = 1, r = 0) => rot(x, y, r, s, line('M0 0 L0 -44', WOOD, 2.6), line('M0 -30 L5 -30 M0 -16 L5 -16', WOOD, 2), path('M0 0 C-10 2 -24 2 -32 -2 C-24 -1 -12 -2 0 -3 Z', '#c0c6cc', C.ink, 1));
const flail = (x: number, y: number, s = 1, r = 0) => rot(x, y, r, s, line('M0 0 L0 -34', WOOD, 2.6), line('M0 -34 L0 -36', C.ink, 1.4), rot(0, -36, 30, 1, rect(-2, -18, 4, 18, '#c08850', 1.5, C.ink, 1)));
const combine = (x: number, y: number, s = 1) => at(x, y, s, rect(-20, -20, 34, 14, '#4f9d69', 2, C.ink, 1.3), rect(-18, -34, 14, 14, '#4f9d69', 2, C.ink, 1.3), rect(-16, -32, 10, 7, '#bfe3f5', 1, C.ink, 0.9), circle(-12, -6, 7, C.dark, C.ink, 1.2), circle(-12, -6, 2.4, C.grey, null), circle(8, -5, 5, C.dark, C.ink, 1.1), circle(8, -5, 1.8, C.grey, null),
  rect(14, -16, 22, 8, '#3f8a5a', 1, C.ink, 1.1), ...[17, 21, 25, 29, 33].map((d) => line(`M${d} -16 L${d - 1} -8`, C.ink, 0.6)), line('M-20 -18 L-28 -26 L-30 -20', '#3f8a5a', 3), line('M-20 -18 L-28 -26 L-30 -20', C.ink, 0.6));

// ── Mosses ───────────────────────────────────────────────────────────
/** A small star-shaped moss shoot seen from the side. */
const mossShoot = (x: number, y: number, h: number, col: string = MOSS, stem: string = MOSS2) => all(line(`M${x} ${y} L${x} ${y - h}`, stem, 1.2), ...Array.from({ length: Math.max(2, Math.floor(h / 3)) }, (_, i) => { const yy = y - 2 - i * 3; return line(`M${x} ${yy} L${x - 2.6} ${yy - 2} M${x} ${yy} L${x + 2.6} ${yy - 2}`, col, 1.1); }), line(`M${x - 1.6} ${y - h - 1.4} L${x} ${y - h} L${x + 1.6} ${y - h - 1.4}`, col, 1.2));
/** A mound of moss. */
const cushion = (x: number, y: number, w: number, h: number, col: string = MOSS, seed = 1) => { const r = rng(seed); return all(path(`M${x - w / 2} ${y} C${x - w / 2} ${y - h} ${x + w / 2} ${y - h} ${x + w / 2} ${y} Z`, col, C.ink, 1.2), ...Array.from({ length: Math.round(w / 2.6) }, () => { const t = r() - 0.5; const xx = x + t * w * 0.85; const top = y - h * 0.75 * Math.cos(t * Math.PI) - 1; return line(`M${f1(xx - 1.6)} ${f1(top + 1.4)} L${f1(xx)} ${f1(top)} L${f1(xx + 1.6)} ${f1(top + 1.4)} M${f1(xx)} ${f1(top)} L${f1(xx)} ${f1(top + 2.4)}`, MOSS2, 0.9); })); };
/** A capsule on a thin stalk (sporophyte). */
const capsule = (x: number, y: number, h: number, r = 0) => rot(x, y, r, 1, line(`M0 0 L0 ${-h}`, '#b0702a', 0.9), ellipse(0, -h - 2, 1.4, 2.6, '#9a5a2a', C.ink, 0.6), path(`M-1.2 ${-h - 4.4} L0 ${-h - 6} L1.2 ${-h - 4.4} Z`, '#c08a4a', null));
const lens = (x: number, y: number, r: number, inner: Svg, id: string) => all(line(`M${f1(x + r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r * 1.45)} ${f1(y + r * 1.45)}`, C.ink, 4.5), line(`M${f1(x + r * 0.75)} ${f1(y + r * 0.75)} L${f1(x + r * 1.4)} ${f1(y + r * 1.4)}`, WOOD, 2.6),
  circle(x, y, r, C.white, null), `<clipPath id="${id}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`, circle(x, y, r, 'rgba(200,230,250,0.15)', C.ink, 2.2));

// ── Lichens ──────────────────────────────────────────────────────────
const blob = (x: number, y: number, r: number, col: string, seed: number, sw = 0.8) => { const q = rng(seed); const pts = Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * Math.PI * 2; const d = r * (0.75 + q() * 0.4); return [x + Math.cos(a) * d, y + Math.sin(a) * d * 0.7] as const; }); return path(`M${pts.map(([a, b]) => `${f1(a)} ${f1(b)}`).join(' L')} Z`, col, C.ink, sw); };
/** A leafy lichen rosette: lobes around a centre. */
const rosette = (x: number, y: number, r: number, col: string, n = 8) => all(...Array.from({ length: n }, (_, i) => rot(x, y, (360 / n) * i, 1, path(`M0 0 C${f1(-r * 0.3)} ${f1(-r * 0.4)} ${f1(-r * 0.35)} ${f1(-r)} 0 ${f1(-r)} C${f1(r * 0.35)} ${f1(-r)} ${f1(r * 0.3)} ${f1(-r * 0.4)} 0 0 Z`, col, C.ink, 0.7))), circle(x, y, r * 0.35, col, null));
/** A branched, bushy lichen tuft. */
const branchy = (x: number, y: number, s = 1, col: string = PALEL, stroke = 2.2) => at(x, y, s, line('M0 0 L0 -8 M0 -8 L-5 -14 M0 -8 L5 -15 M-5 -14 L-8 -19 M-5 -14 L-3 -20 M5 -15 L3 -21 M5 -15 L9 -19 M0 -4 L-4 -7 M0 -5 L4 -9', C.ink, stroke + 1.2), line('M0 0 L0 -8 M0 -8 L-5 -14 M0 -8 L5 -15 M-5 -14 L-8 -19 M-5 -14 L-3 -20 M5 -15 L3 -21 M5 -15 L9 -19 M0 -4 L-4 -7 M0 -5 L4 -9', col, stroke));
const cupL = (x: number, y: number, s = 1, tip = false) => at(x, y, s, path('M-1 0 L-1.4 -8 L-5 -14 L5 -14 L1.4 -8 L1 0 Z', '#b8c4a0', C.ink, 0.8), ellipse(0, -14, 5, 1.6, '#9aa684', C.ink, 0.8), tip ? all(circle(-4, -15, 1, RED, null), circle(4, -15, 1, RED, null)) : '');
const beard = (x: number, y: number, len: number, col = '#b8c8a0') => all(...[-3, -1.5, 0, 1.5, 3].map((d, i) => line(`M${x + d * 0.4} ${y} Q${x + d * 1.6} ${y + len * 0.5} ${x + d + ((i % 2) ? 1.5 : -1.5)} ${y + len - Math.abs(d) * 2}`, C.ink, 2.4)), ...[-3, -1.5, 0, 1.5, 3].map((d, i) => line(`M${x + d * 0.4} ${y} Q${x + d * 1.6} ${y + len * 0.5} ${x + d + ((i % 2) ? 1.5 : -1.5)} ${y + len - Math.abs(d) * 2}`, col, 1.4)));
const branchH = (x1: number, x2: number, y: number) => all(line(`M${x1} ${y} L${x2} ${y - 4}`, '#6a4a30', 4), line(`M${f1((x1 + x2) / 2)} ${f1(y - 2)} L${f1((x1 + x2) / 2 + 10)} ${f1(y - 10)}`, '#6a4a30', 2.4));

// ── Bog and mountain things ──────────────────────────────────────────
const tussock = (x: number, y: number, w: number, h: number, col: string = MOSS) => all(path(`M${x - w / 2} ${y} C${x - w / 2} ${y - h} ${x + w / 2} ${y - h} ${x + w / 2} ${y} Z`, col, C.ink, 1.1), tuft(x, y - h * 0.7, h * 0.9, 5, GRASS2, 8, 1.2));
const pool = (x: number, y: number, w: number, h: number) => all(ellipse(x, y, w / 2, h / 2, WATER, C.ink, 1), line(`M${x - w * 0.25} ${y} l4 0 M${x + w * 0.05} ${y + h * 0.15} l5 0`, WHITE, 1));
const board = (x: number, y: number, w: number) => all(rect(x, y - 3, w, 4, '#c8a070', 0.5, C.ink, 0.9), line(`M${x + 2} ${y + 1} L${x + 2} ${y + 4} M${x + w - 2} ${y + 1} L${x + w - 2} ${y + 4}`, WOOD, 1.4));
const cotton = (x: number, y: number, h: number, s = 1) => all(stalk(x, y, h, 0, GRASS2, 1.2), at(x, y - h - 3, s, circle(0, 0, 4, WHITE, C.ink, 0.8), circle(-2.4, 1.6, 2.6, WHITE, null), circle(2.4, 1.6, 2.6, WHITE, null), circle(0, -1.6, 2.6, WHITE, null)));
const cloudberry = (x: number, y: number, s = 1, col = ORANGE) => at(x, y, s, line('M0 0 L0 -14', GRASS2, 1.4), path('M-12 -4 C-14 -10 -8 -14 -4 -10 C-4 -14 2 -14 2 -9 L0 -4 Z', MOSS2, C.ink, 0.8), ...[[0, -18], [-2.4, -16], [2.4, -16], [-1.6, -20], [1.6, -20], [0, -15], [-3, -19], [3, -19]].map(([a, b]) => circle(a!, b!, 1.8, col, C.ink, 0.6)));
const berry = (x: number, y: number, r: number, col: string, shine = true) => all(circle(x, y, r, col, C.ink, 0.8), shine ? circle(f1(x - r * 0.35), f1(y - r * 0.35), f1(r * 0.3), 'rgba(255,255,255,0.7)', null) : '');
const crookedBirch = (x: number, y: number, s = 1) => at(x, y, s, path('M-3 0 C-4 -8 -10 -12 -8 -22 M1 0 C2 -10 0 -16 6 -24 M3 0 C6 -6 12 -10 12 -16', 'none', C.ink, 4.4), path('M-3 0 C-4 -8 -10 -12 -8 -22 M1 0 C2 -10 0 -16 6 -24 M3 0 C6 -6 12 -10 12 -16', 'none', WHITE, 2.8), line('M-6 -12 l2 0 M2 -14 l2 0 M9 -10 l2 0', C.ink, 1), ellipse(-8, -27, 7, 6, '#8cc04a', C.ink, 1), ellipse(6, -29, 7, 6, '#8cc04a', C.ink, 1), ellipse(13, -19, 5, 4.4, '#8cc04a', C.ink, 1));

/** A vertical measuring scale (red bottom, yellow middle, green top) with a pointer high or low. */
const gauge = (x: number, y: number, lvl: 'hi' | 'lo') => all(rect(x - 4, y, 8, 15, '#4caf50', 0, null), rect(x - 4, y + 15, 8, 14, YEL, 0, null), rect(x - 4, y + 29, 8, 15, '#e04a3a', 0, null), rect(x - 4, y, 8, 44, 'none', 2, C.ink, 1.2),
  path(lvl === 'hi' ? `M${x - 9} ${y + 5} L${x - 4} ${y + 8} L${x - 9} ${y + 11} Z` : `M${x - 9} ${y + 34} L${x - 4} ${y + 37} L${x - 9} ${y + 40} Z`, C.ink, C.ink, 0.8), rect(x - 2, y + 44, 4, 6, '#c0c6cc', 0.5, C.ink, 0.8));
export const GRASSES_MOSSES_MOTIFS: Record<string, Svg> = {
  // ── 2821 Vanliga gräsarter ──
  /** gräsart: four clearly different grasses stand side by side – one with a dense cylinder ear, one with an airy panicle, one with a drooping panicle, one in a tussock – grouped by an orange bracket above. */
  'grms.gräsart': all(bg(), ground, lawn(112, GRASS2, 6, 4), spikeGrass(22, 112, 62, 18, 4, '#b8b060'), panicleGrass(48, 112, 64, 26), panicleGrass(74, 112, 56, 22, '#c0a8c8', 1), tuft(98, 112, 50, 9, GRASS2, 10, 1.6), bracketTop(14, 106, 14)),
  /** grässtrå: a hand holds up one single long blade of grass, ringed in orange, above a lawn where countless other blades grow. */
  'grms.grässtrå': all(bg(SKY), field(92), lawn(94, GRASS2, 3, 8), lawn(112, DGRASS, 4, 10), rect(70, 86, 12, 22, C.skin, 5, C.ink, 1.3), line('M73 92 L79 92 M73 97 L79 97', 'rgba(43,42,51,0.4)', 0.8), line('M76 86 Q70 50 54 18', GRASS2, 3), line('M76 86 Q70 50 54 18', C.ink, 0.5), ring(64, 50, 12, 36)),
  /** tuva: a meadow with one big round mound of grass growing tight together in the middle, ringed in orange, and flat short grass around it. */
  'grms.tuva': all(bg(SKY), field(96), lawn(112, GRASS2, 5, 4), path('M26 104 C26 70 94 70 94 104 Z', '#7ab05a', C.ink, 1.4), tuft(60, 92, 34, 15, GRASS2, 16, 1.6), tuft(42, 98, 20, 7, GRASS2, 10, 1.3), tuft(78, 98, 20, 7, GRASS2, 10, 1.3), ring(60, 84, 42, 30)),
  /** ax: a tall grass stem whose top is one dense, narrow spike packed with seeds, the spike ringed in orange; a zoomed spike shows the tightly packed rows. */
  'grms.ax': all(bg(), ground, lawn(112, GRASS2, 6, 4), spikeGrass(40, 112, 70, 26, 6, '#c8b860'), ring(40, 29, 9, 17), line('M50 28 L68 28', HL, 1.6), at(88, 58, 1.4, ear(0, 0, 1, 7, 0, '#c8b860', 0.9))),
  /** vippa: a tall grass whose top is a loose, airy cluster of thin branches with tiny flowers that sway in the wind, the cluster ringed in orange. */
  'grms.vippa': all(bg(), ground, lawn(112, GRASS2, 6, 4), at(60, 0, 1.5, panicleGrass(0, 75, 52, 30)), ring(60, 30, 22, 26), wind(86, 22, 14)),
  /** gräsfrö: a paper bag tips and pours small pale grass seeds onto a patch of bare brown soil; beside it a few seeds have already sprouted tiny green blades. */
  'grms.gräsfrö': all(bg(SKY), soilCut(84), rot(38, 50, 40, 1, path('M-12 -16 L12 -16 L14 16 L-14 16 Z', '#e8d8b0', C.ink, 1.4), rect(-8, -6, 16, 12, '#8cc96a', 2, C.ink, 0.9), tuft(0, 4, 8, 5, DGRASS, 6, 1)), ...[[52, 64], [56, 70], [50, 74], [58, 78], [54, 82]].map(([a, b]) => grain(a!, b!, 0.7, 30, '#e8dca0')),
    ...[[50, 86], [58, 88], [64, 86], [46, 90]].map(([a, b]) => grain(a!, b!, 0.7, 70, '#e8dca0')), tuft(88, 86, 10, 5, GRASS2, 6, 1.2), tuft(100, 86, 8, 4, GRASS2, 6, 1.2), tuft(78, 86, 7, 3, GRASS2, 6, 1.2)),
  /** ogräs: a neat garden bed of orange carrots/flowers where a few wild, scraggly green plants grow in between; a gloved hand pulls one of them out by the root, ringed in orange. */
  'grms.ogräs': all(bg(SKY), soilCut(88), ...[20, 40, 80, 100].map((x) => all(bloom(x, 66, 9, 6, C.pink), stalk(x, 88, 22))), tuft(60, 88, 14, 7, '#7a9a3a', 12, 1.4), tuft(32, 88, 10, 5, '#7a9a3a', 10, 1.2), tuft(92, 88, 10, 5, '#7a9a3a', 10, 1.2),
    rect(64, 24, 14, 16, '#5a8ad0', 4, C.ink, 1.3), tuft(70, 50, 12, 6, '#7a9a3a', 10, 1.4), line('M70 50 L70 58 M70 58 L66 64 M70 58 L73 65', '#e8dcc0', 1.4), line('M70 40 L70 50', '#7a9a3a', 1.6), ring(70, 52, 12, 14)),
  /** utlöpare: a cut through the soil shows a grass plant whose long white runner grows sideways under the ground and sends up two new little plants with their own roots; the runner is traced by an orange arrow. */
  'grms.utlöpare': all(bg(SKY), soilCut(70), tuft(22, 70, 34, 9), line('M22 70 L18 82 M22 70 L24 84 M22 70 L28 80', '#e8dcc0', 1.2), path('M22 78 C40 84 54 84 62 80 C74 76 86 82 98 80', 'none', C.ink, 4), path('M22 78 C40 84 54 84 62 80 C74 76 86 82 98 80', 'none', '#f3ead8', 2.6),
    tuft(62, 70, 20, 7), line('M62 80 L62 70', '#f3ead8', 2), line('M62 82 L58 90 M62 82 L65 91', '#e8dcc0', 1), tuft(98, 70, 12, 5), line('M98 80 L98 70', '#f3ead8', 2), line('M98 82 L95 89 M98 82 L101 89', '#e8dcc0', 1), arrow(30, 98, 92, 98, HL, 2.4)),
  /** timotej: a tall field grass with long, narrow, dense cylinder-shaped heads like little brushes; beside it a bale of hay and a rabbit nibbling hay. */
  'grms.timotej': all(bg(SKY), field(100), lawn(112, GRASS2, 5, 6), ...[20, 32, 44, 56].map((x, i) => spikeGrass(x, 112, 66 + (i % 2) * 8, 26, 5, '#a8b070', (i - 1.5) * 2)), rect(70, 86, 34, 22, STRAW, 3, C.ink, 1.3), line('M70 93 L104 93 M70 101 L104 101', STRAW2, 1),
    at(92, 86, 1, ellipse(0, -6, 7, 5, '#c8b8a8', C.ink, 1), circle(-6, -10, 4, '#c8b8a8', C.ink, 1), ellipse(-6, -17, 1.4, 4, '#c8b8a8', C.ink, 0.8), ellipse(-3, -17, 1.4, 4, '#c8b8a8', C.ink, 0.8), circle(-8, -10, 0.7, C.ink, null), line('M-10 -9 L-14 -10', GRASS2, 1.2))),
  /** rajgräs: a dark green, shiny lawn where two children play football; a close-up circle shows the glossy dark grass blades. */
  'grms.rajgräs': all(bg(SKY), field(88, '#3f8a3a'), lawn(90, DGRASS, 3, 5), lawn(112, DGRASS, 3, 6), rect(96, 52, 16, 36, 'none', 0, WHITE, 2), fig(30, C.red, 'laugh', { h: 0.62, bottom: C.navy }, 104), fig(70, C.denim, 'smile', { h: 0.58, bottom: C.navy }, 104), circle(50, 100, 4.4, WHITE, C.ink, 1.2), circle(50, 100, 1.4, C.dark, null),
    circle(22, 22, 14, '#e6f0dc', C.ink, 1.6), ...[-8, -4, 0, 4, 8].map((d) => line(`M${22 + d} 34 Q${22 + d * 0.7} 22 ${22 + d * 1.3} 12`, '#2f6e2a', 2.4)), line('M18 22 l2 -6', 'rgba(255,255,255,0.8)', 1)),
  /** rödsvingel: under a magnifying lens, a tuft of grass with leaves as thin as threads whose bases are red, ringed in orange, growing in dry sandy ground in the sun. */
  'grms.rödsvingel': all(bg(SKY), sunG(102, 18), rect(4, 96, 112, 16, '#ecd29a', 0, null), dots(4, 96, 112, 16, 60, '#c9a868', 7), tuft(30, 98, 30, 12, GRASS2, 9, 0.9),
    lens(72, 56, 30, all(rect(42, 26, 60, 60, '#f6f0dc', 0, null), ...[-12, -8, -4, 0, 4, 8, 12].map((d) => line(`M${72 + d * 0.4} 82 Q${72 + d} 60 ${72 + d * 1.8} 32`, GRASS2, 1.1)), ...[-6, -3, 0, 3, 6].map((d) => line(`M${72 + d * 0.4} 86 L${72 + d * 0.5} 74`, RED, 2.4))), 'gRs'), ring(72, 78, 10, 7)),
  /** ängsgröe: a cut through a lawn: above the ground grasses with soft, airy panicles; below the ground creeping white runners that send up new shoots where the grass was worn. */
  'grms.ängsgröe': all(bg(SKY), soilCut(80), lawn(80, GRASS2, 4, 6), panicleGrass(30, 80, 50, 22, '#a890b8'), panicleGrass(56, 80, 58, 26, '#a890b8'), panicleGrass(84, 80, 46, 20, '#a890b8'),
    path('M30 86 C48 92 66 88 84 92 C92 94 100 90 108 92', 'none', C.ink, 3.4), path('M30 86 C48 92 66 88 84 92 C92 94 100 90 108 92', 'none', '#f3ead8', 2.2), line('M70 89 L70 80 M100 91 L100 80', '#f3ead8', 1.8), tuft(100, 80, 8, 4, GRASS2, 6, 1.2)),
  /** kvickrot: a gardener pulls on a weed, and from the soil comes a long tangle of white runners with many joints that goes on and on; small broken pieces in the soil already sprout new shoots. */
  'grms.kvickrot': all(bg(SKY), soilCut(78), fig(92, '#4f9d69', 'frown', { h: 0.72, bottom: '#4a5a3a' }, 78), reach(92, 0.72, -1, 72, 40, 78), tuft(70, 38, 12, 5, GRASS2, 10, 1.4),
    path('M70 40 C66 54 72 66 62 78 C52 90 30 84 22 96 C18 102 30 106 40 100', 'none', C.ink, 4), path('M70 40 C66 54 72 66 62 78 C52 90 30 84 22 96 C18 102 30 106 40 100', 'none', '#f3ead8', 2.6), line('M65 58 l4 0 M64 72 l4 2 M46 86 l2 4 M28 92 l3 2 M30 104 l2 -3', C.ink, 0.8),
    rect(80, 96, 10, 3, '#f3ead8', 1.4, C.ink, 0.7), tuft(85, 96, 10, 3, GRASS2, 6, 1.1), rect(98, 102, 9, 3, '#f3ead8', 1.4, C.ink, 0.7), tuft(102, 102, 12, 3, GRASS2, 6, 1.1), line('M85 99 L85 78 M102 105 L102 78', GRASS2, 1)),
  /** tuvtåtel: on wet ground with puddles, several huge round grass tussocks with stiff, rough leaves stand above the short grass; a cow grazes around them but leaves the tussocks. */
  'grms.tuvtåtel': all(bg(SKY), field(94), lawn(112, GRASS2, 4, 3), pool(30, 106, 22, 6), pool(96, 108, 18, 5), path('M18 100 C18 72 56 72 56 100 Z', '#6a9a4a', C.ink, 1.3), tuft(37, 92, 36, 17, '#4a7a34', 18, 1.3), at(37, 58, 1, panicleGrass(0, 6, 4, 14, '#b8a8c0')),
    path('M66 96 C66 80 90 80 90 96 Z', '#6a9a4a', C.ink, 1.2), tuft(78, 90, 24, 11, '#4a7a34', 14, 1.2), grazingCow(94, 112, 0.7)),
  /** vårbrodd: in a spring meadow with a few early flowers, a small grass with a short golden spike; a person lies in the grass and smells it, soft sweet smell-lines rising from the grass. */
  'grms.vårbrodd': all(bg(SKY), field(90), lawn(92, GRASS2, 4, 6), lawn(112, GRASS2, 4, 5), bloom(14, 88, 6, 5, WHITE), bloom(30, 94, 5, 5, YEL), spikeGrass(50, 100, 46, 14, 5, '#d8b040'), spikeGrass(60, 100, 40, 12, 5, '#d8b040', 3), ring(54, 46, 12, 16),
    smell(64, 40, '#c08a40'), smell(68, 30, '#c08a40'), fig(94, '#e88a9a', 'calm', { h: 0.72, hairStyle: 'long', bottom: '#3d4a66' })),
  // ── 2822 Ängsväxter ──
  /** ängsväxt: a meadow full of many different wild plants – red clover, white daisies, blue round flowers, yellow flowers and grasses – grouped under an orange bracket. */
  'grms.ängsväxt': all(bg(SKY), field(84), lawn(112, GRASS2, 4, 6), cloverHead(18, 70, 6, '#d06a8a'), trefoil(18, 86, 1), stalk(18, 108, 32), bloom(38, 62, 10, 10, WHITE), stalk(38, 108, 40), circle(58, 66, 6, LILAC, C.ink, 0.9), stalk(58, 108, 36), panicleGrass(74, 108, 56, 20), bloom(92, 70, 7, 5, YEL), stalk(92, 108, 34), at(104, 108, 1, spikeGrass(0, 0, 50, 14, 4)), bracketTop(10, 110, 30)),
  /** hagmark: an open pasture with grass and flowers, and a few large old oaks standing here and there; cows graze between the trees. */
  'grms.hagmark': all(bg(SKY), field(80), lawn(112, GRASS2, 5, 4), oak(26, 92, 1), oak(90, 84, 0.8), bushG(58, 86, 0.6), cow(52, 108, 0.7), grazingCow(90, 110, 0.6), bloom(14, 104, 3, 5, YEL), bloom(70, 100, 3, 5, WHITE), bloom(110, 104, 3, 5, YEL)),
  /** slåtter: summer meadow mowing – a man swings a long scythe through tall flowering grass, and behind him the cut grass lies in a neat row; a woman rakes it together. */
  'grms.slåtter': all(bg(SKY), sunG(104, 16), field(84), ...[64, 72, 80, 88, 96, 104, 112].map((x) => all(tuft(x, 112, 28, 5, GRASS2, 6, 1.2), bloom(x + 2, 84, 2.4, 5, (x % 16) ? WHITE : YEL))), path('M6 108 C14 104 40 104 52 108 Z', '#b8c060', C.ink, 1),
    fig(46, '#f3efe6', 'calm', { h: 0.8, bottom: '#4a5a3a' }), scythe(56, 108, 1, -60), reach(46, 0.8, 1, 58, 76), fig(14, C.red, 'smile', { h: 0.7, hairStyle: 'long', bottom: '#3d4a66' }), line('M24 72 L32 108 M28 108 L36 108', WOOD, 1.8)),
  /** lie: a scythe drawn large on its own – a long wooden handle with two small grips and a long curved steel blade at the bottom – lying in front of tall grass. */
  'grms.lie': all(bg(SKY), field(96), lawn(112, GRASS2, 4, 10), rot(76, 96, -20, 1.6, line('M0 0 L0 -44', WOOD, 2.6), line('M0 -30 L6 -30 M0 -14 L6 -14', WOOD, 2.2), path('M0 0 C-10 2 -24 2 -32 -2 C-24 -1 -12 -2 0 -3 Z', '#c0c6cc', C.ink, 1), line('M-4 -1 L-26 -1', 'rgba(255,255,255,0.8)', 0.6))),
  /** slåtteräng: a very flower-rich meadow in bloom (white, yellow, red, blue, purple flowers among grasses), with a little wooden barn and a hay rack at the edge; a scythe leans against the barn. */
  'grms.slåtteräng': all(bg(SKY), field(70), rect(80, 46, 30, 24, '#b8452e', 1, C.ink, 1.2), path('M77 46 L95 34 L113 46 Z', C.dark, C.ink, 1.2), scythe(76, 70, 0.6, 10), ...Array.from({ length: 34 }, (_, i) => { const r = rng(i + 3); const x = 8 + r() * 104, y = 76 + r() * 34; const cols = [WHITE, YEL, '#d06a8a', LILAC, '#5a7ad0', WHITE]; return all(stalk(x, y + 6, 6, 0, GRASS2, 1), bloom(f1(x), f1(y), 2.6, 5, cols[i % 6]!)); }), lawn(112, GRASS2, 3, 5)),
  /** hässja: a long hay-drying rack – wooden poles with wires between them – with cut grass hung thickly over the wires, drying in sun and wind on a mown field. */
  'grms.hässja': all(bg(SKY), sunG(102, 16), wind(8, 14, 16), field(90, '#b8c860'), lawn(112, '#9ab050', 4, 3), ...[14, 40, 66, 92].map((x) => line(`M${x} 112 L${x + 4} 46`, WOOD, 3)), ...[58, 70, 82].map((y) => line(`M14 ${y + 4} L96 ${y}`, '#7a7a7a', 1)),
    path('M12 52 C30 48 70 46 98 44 L100 92 C70 96 30 98 12 98 Z', '#b8b050', C.ink, 1.3), ...Array.from({ length: 16 }, (_, i) => line(`M${16 + i * 5.4} ${52 - i * 0.4} L${15 + i * 5.4} ${96 - i * 0.2}`, '#8a8a30', 0.9))),
  /** växa igen: three panels in a row joined by orange arrows: an open flowery meadow, the same place full of bushes and young trees, and finally a dense forest. */
  'grms.växa-igen': all(bg(), rect(6, 40, 32, 50, SKY, 2, C.ink, 1.2), rect(6, 72, 32, 18, GRASS, 0, null), ...[12, 20, 28, 34].map((x, i) => bloom(x, 76 + (i % 2) * 4, 2.6, 5, i % 2 ? YEL : WHITE)), rect(6, 40, 32, 50, 'none', 2, C.ink, 1.2),
    rect(44, 40, 32, 50, SKY, 2, C.ink, 1.2), rect(44, 72, 32, 18, GRASS, 0, null), bushG(52, 88, 0.5), bushG(68, 86, 0.6), tree(60, 86, 0.7, '#8cc04a'), rect(44, 40, 32, 50, 'none', 2, C.ink, 1.2),
    rect(82, 40, 32, 50, SKY, 2, C.ink, 1.2), rect(82, 72, 32, 18, '#5a8a3a', 0, null), conifer(88, 88, 0.9), tree(98, 84, 1, '#3f7a36'), conifer(108, 88, 0.85), tree(92, 76, 0.7, '#4f8a3a'), rect(82, 40, 32, 50, 'none', 2, C.ink, 1.2),
    arrow(36, 100, 46, 100, HL, 2.4), arrow(74, 100, 84, 100, HL, 2.4)),
  /** rödklöver: a large red-pink round clover flower head with three-part leaves on its stem, and a bumblebee landing on it. */
  'grms.rödklöver': all(bg(SKY), field(100), lawn(112, GRASS2, 4, 6), stalk(56, 112, 60, 0, GRASS2, 2), cloverHead(56, 46, 16, '#d0507a'), trefoil(42, 80, 1.6), trefoil(70, 90, 1.5), bee(84, 30, 1.4)),
  /** vitklöver: a low lawn with many small white round clover flowers and three-part leaves; a child kneels and holds up one leaf with four leaflets. */
  'grms.vitklöver': all(bg(SKY), field(84), lawn(112, GRASS2, 4, 4), ...[[16, 96], [36, 104], [56, 94], [84, 102], [104, 92]].map(([a, b]) => all(stalk(a!, b! + 10, 14), cloverHead(a!, b! - 4, 5, WHITE))), ...[[24, 108], [48, 106], [72, 108], [96, 106]].map(([a, b]) => trefoil(a!, b!, 1)),
    fig(84, C.yellow, 'laugh', { h: 0.5, bottom: '#3d4a66' }, 92), reach(84, 0.5, -1, 62, 50, 92), at(62, 42, 1.6, ...[0, 90, 180, 270].map((a) => rot(0, 0, a, 1, path('M0 0 C3 -1 6 -2 6 -5 C6 -8 3 -8 2 -6 C1 -8 -2 -8 -2 -5 C-2 -2 -1 -1 0 0 Z', MOSS2, C.ink, 0.7)))), ring(62, 42, 13)),
  /** käringtand: a low plant in short dry grass with clusters of small yellow pea-like flowers; some buds are still red. */
  'grms.käringtand': all(bg(SKY), field(92), lawn(112, GRASS2, 4, 3), ...[[34, 56], [70, 46]].map(([cx, cy]) => all(stalk(cx!, 112, 112 - cy!, 0, GRASS2, 1.6), ...[[-6, 0, YEL], [0, -4, YEL], [6, 0, YEL], [-3, 4, ORANGE], [3, 4, RED]].map(([dx, dy, col]) => all(path(`M${cx! + (dx as number)} ${cy! + (dy as number)} c-3 -2 -3 -6 0 -7 c3 1 3 5 0 7 Z`, col as string, C.ink, 0.8), path(`M${cx! + (dx as number)} ${cy! + (dy as number)} c2 1 3 3 2 5`, 'none', C.ink, 0.6))))),
    ...[[30, 90], [40, 80], [66, 84], [76, 74]].map(([a, b]) => at(a!, b!, 1, ellipse(-3, 0, 3, 1.6, MOSS2, C.ink, 0.6), ellipse(3, 0, 3, 1.6, MOSS2, C.ink, 0.6), ellipse(0, -2.4, 1.6, 3, MOSS2, C.ink, 0.6))), stalk(96, 112, 30, 0, GRASS2, 1.6), path('M96 82 c-3 -2 -3 -6 0 -7 c3 1 3 5 0 7 Z', RED, C.ink, 0.8)),
  /** gulmåra: bushy plants covered with foamy clouds of tiny yellow flowers and thin leaves, with sweet honey smell-lines rising; a bee flies to them. */
  'grms.gulmåra': all(bg(SKY), field(96), lawn(112, GRASS2, 4, 4), ...[[30, 52], [64, 44], [94, 60]].map(([cx, cy], k) => all(stalk(cx!, 112, 112 - cy! - 8, 0, GRASS2, 1.6), line(`M${cx! - 4} ${cy! + 30} l-4 -2 M${cx! + 4} ${cy! + 26} l4 -2 M${cx! - 4} ${cy! + 46} l-4 -2 M${cx! + 4} ${cy! + 42} l4 -2`, GRASS2, 1), ...Array.from({ length: 26 }, (_, i) => { const r = rng(i + 10 * k); return circle(f1(cx! + (r() - 0.5) * 20), f1(cy! + (r() - 0.5) * 18), 1.6, YEL, C.ink, 0.4); }))), smell(54, 30, '#d0a020'), smell(84, 38, '#d0a020'), bee(20, 26, 1)),
  /** ängsvädd: late-summer wet meadow with tall thin stems topped by round blue-violet flower balls; a butterfly sits on one. */
  'grms.ängsvädd': all(bg(SKY), field(92), lawn(112, GRASS2, 4, 5), pool(96, 106, 22, 6), ...[[28, 40], [52, 30], [76, 44], [100, 52]].map(([x, y]) => all(stalk(x!, 112, 112 - y!, 2, GRASS2, 1.4), circle(x! + 2, y!, 7, '#6a6ad0', C.ink, 1), ...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return circle(f1(x! + 2 + Math.cos(a) * 4.4), f1(y! + Math.sin(a) * 4.4), 1.4, '#9a8ae8', null); }))), butterfly(54, 18, 1.2)),
  /** ängsskallra: yellow flowers with flat, round, papery seed pods along the stem; the wind blows and the dry pods rattle, shown by sound arcs; a close-up shows loose seeds inside a pod. */
  'grms.ängsskallra': all(bg(SKY), field(96), lawn(112, GRASS2, 4, 5), wind(6, 20, 18), ...[[30, 34], [54, 42]].map(([x, y]) => all(stalk(x!, 112, 112 - y!, 0, GRASS2, 1.6), path(`M${x} ${y} c-4 -1 -6 -6 -3 -8 c2 0 4 2 3 8 Z`, YEL, C.ink, 0.8), ...[12, 22, 32].map((d, i) => all(ellipse(x! + (i % 2 ? 5 : -5), y! + d, 4.4, 3.4, '#d8c890', C.ink, 0.8))))), sound(64, 52), sound(40, 60),
    circle(92, 54, 16, '#f2e8c8', C.ink, 1.4), circle(88, 52, 2.6, '#8a6a3a', C.ink, 0.6), circle(96, 57, 2.6, '#8a6a3a', C.ink, 0.6), line('M72 54 L76 54', HL, 1.6)),

  // ── 2823 Sädesväxter ──
  /** sädesväxt: one whole cereal plant drawn tall – roots in a soil cut, a tuft of grass-like leaves and a heavy golden ear on top – beside a grey ordinary grass for comparison. */
  'grms.sädesväxt': all(bg(SKY), soilCut(90), greyed(tuft(92, 90, 30, 7)), line('M44 90 L44 56', STRAW2, 1.8), blade(44, 74, 24, -16, STRAW2, 2), blade(44, 66, 22, 16, STRAW2, 2), blade(44, 84, 18, -14, '#9ab050', 2), ear(44, 56, 1.25, 6, 6, STRAW), line('M44 90 L36 104 M44 90 L42 108 M44 90 L50 106 M44 90 L54 100 M40 98 L34 102', '#e8dcc0', 1.1), ring(44, 36, 10, 20)),
  /** sädesslag: four different cereal ears side by side – a plump wheat ear, a thin rye ear with long whiskers, a barley ear with very long whiskers and a hanging oat panicle – under an orange bracket. */
  'grms.sädesslag': all(bg(), ground, ear(18, 112, 1.2, 7, 3, STRAW, 1.2, 40), ear(44, 112, 1.2, 8, 9, '#c8b878', 0.8, 40), ear(70, 112, 1.2, 6, 18, '#d8c070', 1, 40), oats(98, 112, 1.1, 80), bracketTop(8, 112, 10)),
  /** korn.2: barley – a field of ears with very long straight whiskers, and one big barley ear drawn close with its long whiskers and grains in rows, ringed in orange. */
  'grms.korn.2': all(bg(SKY), field(88, '#d8c070'), cerealRow(8, 112, 108, 0.5, '#d8c070', 14), at(60, 84, 1.6, ear(0, 0, 1, 6, 14, '#d8c070', 1, 12)), ring(60, 44, 16, 30)),
  /** dinkel: an old-style ear of spelt with flattened, distinct grains in a stepped row, next to a round rustic loaf and a bowl of pasta made from it. */
  'grms.dinkel': all(bg(), rect(4, 92, 112, 20, '#d4a373', 0, C.ink, 1), at(34, 90, 1.8, line('M0 0 L0 -12', STRAW2, 1.6), ...Array.from({ length: 6 }, (_, i) => rot(i % 2 ? 2.4 : -2.4, -14 - i * 5, i % 2 ? 24 : -24, 1, rect(-2.4, -3.6, 4.8, 7.2, '#c8a060', 1.4, C.ink, 0.8)))), ring(34, 54, 13, 34),
    ellipse(80, 84, 22, 12, '#b0703a', C.ink, 1.3), line('M66 80 L94 80 M70 86 L90 86', '#8a5028', 1.2), ellipse(96, 104, 14, 4, WHITE, C.ink, 1.1), path('M84 103 q4 -6 8 0 q4 -6 8 0', 'none', '#e8c870', 2)),
  /** sädesfält: a wide golden field of ripe grain under a blue summer sky, rows of ears at the front, a red farmhouse far away. */
  'grms.sädesfält': all(bg(SKY), sunG(98, 18), rect(4, 60, 112, 52, '#e2c25a', 0, null), line('M4 60 L116 60', C.ink, 1), rect(14, 50, 14, 10, '#b8452e', 0.5, C.ink, 1), path('M12 50 L21 44 L30 50 Z', C.dark, C.ink, 1), tree(40, 60, 0.6), ...[70, 80, 90].map((y) => line(`M4 ${y} L116 ${y}`, '#c8a040', 1)), cerealRow(6, 114, 112, 0.6, STRAW, 3)),
  /** höstsäd: a field in late autumn/winter: rows of short green sprouts stick up through a thin layer of snow, snowflakes falling, a bare tree with one last yellow leaf. */
  'grms.höstsäd': all(bg('#e4ecf2'), soilCut(92), ...[22, 40, 58, 76, 94].map((x) => all(tuft(x, 92, 14, 5, '#4f9d3a', 6, 1.6), tuft(x + 8, 92, 12, 4, '#4f9d3a', 6, 1.6))), rect(4, 88, 112, 6, SNOW, 2, C.ink, 0.8), ...[[20, 24], [44, 16], [70, 30], [96, 20], [34, 50], [84, 54], [58, 62]].map(([a, b]) => flake(a!, b!, 3.4)),
    line('M104 88 L104 60 M104 70 L96 62 M104 66 L110 58', WOOD, 2), ellipse(96, 60, 2.4, 1.6, YEL, C.ink, 0.6)),
  /** vårsäd: spring sowing – a farmer sows seeds from a bag into fresh brown soil rows, the sun shines, a snowdrop and green buds show it is spring; tiny sprouts in the first rows. */
  'grms.vårsäd': all(bg(SKY), sunG(100, 18), soilCut(84), ...[90, 98, 106].map((y) => line(`M4 ${y} L116 ${y}`, SOIL2, 1.4)), fig(40, '#4f9d69', 'smile', { h: 0.74, bottom: '#4a5a3a' }, 84), rect(46, 44, 10, 12, '#e8d8b0', 2, C.ink, 1), reach(40, 0.74, 1, 64, 52, 84), ...[[66, 60], [70, 66], [74, 72], [70, 78]].map(([a, b]) => grain(a!, b!, 0.6, 30)),
    ...[84, 96, 108].map((x) => tuft(x, 90, 5, 3, '#6aba4a', 5, 1.2)), stalk(14, 84, 14, 0, GRASS2, 1.2), path('M14 70 c-3 2 -3 6 0 8 c3 -2 3 -6 0 -8 Z', WHITE, C.ink, 0.8), tree(110, 60, 0.6, '#b8e08a')),
  /** skördetröska: a big green combine harvester drives through a golden grain field, cutting the grain at the front and blowing chaff out behind. */
  'grms.skördetröska': all(bg(SKY), rect(4, 70, 112, 42, '#e2c25a', 0, null), cerealRow(70, 116, 104, 0.6, STRAW, 3), rect(4, 96, 60, 16, '#d8c070', 0, null), ...[8, 14, 20, 26, 32, 38, 44, 50, 56].map((x) => line(`M${x} 104 L${x} 98`, STRAW2, 1.2)), at(58, 100, 1.3, combine(0, 0, 1)), ...[[8, 60], [14, 66], [6, 70], [18, 58]].map(([a, b]) => ellipse(a!, b!, 2, 1, '#e8d8a0', null))),
  /** tröska: in an old barn, a man beats sheaves of grain on the floor with a flail; grains jump out and lie on the floor, separated from the straw. */
  'grms.tröska': all(bg('#e8dcc8'), rect(4, 96, 112, 16, '#b08860', 0, C.ink, 1), line('M4 30 L60 8 L116 30', WOOD, 3), fig(34, '#f3efe6', 'calm', { h: 0.82, bottom: '#4a5a3a' }, 96), reach(34, 0.82, 1, 50, 40, 96), flail(50, 40, 1, 40),
    ...[0, 10, 20].map((d) => all(line(`M${64 + d} 96 L${90 + d} 90`, STRAW2, 1.6), line(`M${66 + d} 94 L${92 + d} 92`, STRAW2, 1.6))), ...[[72, 80], [80, 74], [90, 78], [100, 72], [84, 84]].map(([a, b]) => grain(a!, b!, 0.8, 40)), line('M76 74 l-2 -3 M94 72 l2 -3 M104 70 l2 -2', C.ink, 0.8), ...[[64, 102], [76, 104], [88, 102], [100, 104], [108, 101]].map(([a, b]) => grain(a!, b!, 0.7, 80))),
  /** agn: winnowing – a person throws threshed grain up from a flat basket; the wind blows the light, thin husks away to the side while the heavy grains fall straight down into a pile. */
  'grms.agn': all(bg(SKY), wind(4, 16, 20), rect(4, 100, 112, 12, '#c8a878', 0, C.ink, 1), fig(28, '#f3efe6', 'calm', { h: 0.8, bottom: '#4a5a3a' }, 100), path('M34 50 C40 56 56 56 62 50 Z', '#c8a060', C.ink, 1.2), reach(28, 0.8, 1, 36, 52, 100),
    ...[[50, 40], [52, 30], [48, 22], [54, 60], [50, 72], [52, 84], [48, 92]].map(([a, b]) => grain(a!, b!, 0.8, 10, STRAW)), path('M40 100 C42 92 58 92 60 100 Z', STRAW, C.ink, 1), ...[[66, 30], [76, 26], [88, 34], [98, 24], [106, 38], [82, 44], [96, 48]].map(([a, b], i) => rot(a!, b!, i * 40, 1, path('M-3 0 C-1 -2 1 -2 3 0 C1 1 -1 1 -3 0 Z', '#f3e8c0', C.ink, 0.6))), arrow(64, 56, 100, 56, HL, 2.4)),
  /** stubbåker: a harvested field of short, cut yellow stubble in rows stretching away, with grey geese walking and picking up fallen grain. */
  'grms.stubbåker': all(bg(SKY), rect(4, 58, 112, 54, '#e8d488', 0, null), line('M4 58 L116 58', C.ink, 1), ...[64, 72, 82, 94, 108].map((y, k) => line(Array.from({ length: 28 }, (_, i) => `M${6 + i * 4 + (k % 2) * 2} ${y} l${(i % 3) - 1} ${-2 - k * 0.6}`).join(' '), STRAW2, 1 + k * 0.25)),
    goose(36, 100, 1.4), goose(64, 92, 1.1), goose(86, 104, 1.4), ...[[50, 102], [74, 98], [100, 100]].map(([a, b]) => grain(a!, b!, 0.6, 50))),

  // ── 2824 Mossor ──
  /** mossa: a big soft green moss mound growing on a stone and on the forest floor, with a close-up circle showing the tiny leafy shoots. */
  'grms.mossa': all(bg('#e4eedc'), ground, rock(50, 112, 72, 46), path('M14 112 C14 84 40 64 60 66 C78 68 88 90 88 112 Z', MOSS, C.ink, 1.3), cushion(30, 112, 34, 16, MOSS, 4), cushion(100, 112, 26, 14, MOSS, 5), ...Array.from({ length: 16 }, (_, i) => mossShoot(20 + i * 4.2, 104 - Math.sin((i / 15) * Math.PI) * 32, 6)),
    circle(94, 34, 20, '#f4f8ee', C.ink, 1.6), ...[82, 88, 94, 100, 106].map((x) => mossShoot(x, 48, 20)), line('M78 52 L68 72', HL, 1.6)),
  /** mossig: an old wooden cabin whose roof, wall and steps are thickly covered with green moss, beside a grey clean copy of the same cabin. */
  'grms.mossig': all(bg(), ground, at(36, 112, 1.1, rect(-22, -30, 44, 30, '#a0673d', 0.5, C.ink, 1.3), line('M-22 -22 L22 -22 M-22 -14 L22 -14 M-22 -6 L22 -6', '#7a4a28', 1), path('M-27 -30 L0 -50 L27 -30 Z', '#6a6a6a', C.ink, 1.3), path('M-26 -30 C-20 -38 -8 -46 0 -49 C6 -44 18 -38 26 -30 C16 -33 -14 -33 -26 -30 Z', MOSS, C.ink, 1), rect(-6, -18, 12, 18, '#5a3a20', 0.5, C.ink, 1), cushion(-14, -2, 14, 6, MOSS, 2), cushion(16, 0, 12, 7, MOSS, 3), cushion(-20, -22, 6, 5, MOSS, 4)),
    greyed(at(92, 112, 0.7, rect(-22, -30, 44, 30, '#a0673d', 0.5, C.ink, 1.3), path('M-27 -30 L0 -50 L27 -30 Z', '#6a6a6a', C.ink, 1.3), rect(-6, -18, 12, 18, '#5a3a20', 0.5, C.ink, 1)))),
  /** mossmatta: a forest floor completely covered by a thick, soft, unbroken carpet of green moss between tree trunks; a hand presses into it and sinks. */
  'grms.mossmatta': all(bg('#e4eedc'), rect(8, 8, 8, 70, WOOD, 1, C.ink, 1.1), rect(96, 8, 10, 70, WOOD, 1, C.ink, 1.1), path('M4 112 L4 78 C30 70 90 70 116 78 L116 112 Z', MOSS, C.ink, 1.4), ...Array.from({ length: 60 }, (_, i) => { const r = rng(i + 7); const x = 8 + r() * 104, y = 80 + r() * 28; return line(`M${f1(x - 1.6)} ${f1(y + 1.4)} L${f1(x)} ${f1(y)} L${f1(x + 1.6)} ${f1(y + 1.4)}`, MOSS2, 0.9); }),
    rect(52, 56, 14, 20, C.skin, 5, C.ink, 1.3), path('M48 80 C52 74 66 74 70 80', 'none', MOSS2, 2), line('M56 60 L56 70 M60 60 L60 70 M64 60 L64 70', 'rgba(43,42,51,0.35)', 0.8)),
  /** bladmossa: a magnifying lens over a moss cushion shows one moss shoot drawn large: a small stem with many tiny leaves all around it, like a miniature plant. */
  'grms.bladmossa': all(bg('#e4eedc'), ground, cushion(36, 112, 52, 22, MOSS, 8), lens(70, 50, 32, all(rect(38, 18, 64, 64, '#f4f8ee', 0, null), line('M70 82 L70 26', MOSS2, 2), ...Array.from({ length: 10 }, (_, i) => { const y = 78 - i * 5; return all(rot(70, y, -50, 1, ellipse(-5, 0, 5, 1.8, MOSS, C.ink, 0.6)), rot(70, y, 50, 1, ellipse(5, 0, 5, 1.8, MOSS, C.ink, 0.6))); })), 'gBm')),
  /** levermossa: on a wet stone by a stream lie flat, green, forked bands with lobed edges pressed tightly against the surface, with tiny umbrella-like stalks; water drops around. */
  'grms.levermossa': all(bg('#e4eedc'), rect(4, 96, 112, 16, WATER, 0, null), line('M10 104 l8 0 M40 106 l10 0 M84 104 l8 0', WHITE, 1.2), rock(60, 100, 96, 50, STONE), ...[[34, 74, -20], [56, 66, 0], [80, 74, 20]].map(([x, y, r]) => rot(x!, y!, r!, 1, path('M0 14 C-4 6 -10 2 -14 -6 C-10 -10 -6 -6 -4 -2 C-4 -8 -2 -14 0 -16 C2 -14 4 -8 4 -2 C6 -6 10 -10 14 -6 C10 2 4 6 0 14 Z', '#5aa03a', C.ink, 1), line('M0 12 L0 -12 M0 2 L-10 -5 M0 2 L10 -5', '#3a7a28', 0.8))),
    ...[[50, 52], [64, 50]].map(([x, y]) => all(line(`M${x} ${y! + 10} L${x} ${y}`, '#7aa05a', 1.2), path(`M${x! - 5} ${y} C${x! - 4} ${y! - 4} ${x! + 4} ${y! - 4} ${x! + 5} ${y} Z`, '#5aa03a', C.ink, 0.8))), drop(24, 60, 1), drop(96, 62, 1)),
  /** sporkapsel: a green moss cushion with many thin red-brown stalks rising above it, each with a small brown capsule on top; one capsule is drawn large and ringed, with tiny dust grains drifting out on the wind. */
  'grms.sporkapsel': all(bg('#e4eedc'), ground, cushion(40, 112, 64, 22, MOSS, 9), ...[18, 26, 34, 42, 50, 58].map((x, i) => capsule(x, 100 - (i % 2) * 3, 34 + (i % 3) * 4, (i - 2.5) * 4)), line('M80 112 L84 50', '#b0702a', 1.2), rot(84, 50, 10, 2.4, ellipse(0, -4, 2.8, 5, '#9a5a2a', C.ink, 0.6), path('M-2.4 -8.4 L0 -11 L2.4 -8.4 Z', '#c08a4a', C.ink, 0.4)), ring(86, 36, 10, 16),
    ...[[96, 26], [102, 22], [106, 30], [100, 34], [110, 20]].map(([a, b]) => circle(a!, b!, 0.9, '#9a5a2a', null)), wind(92, 44, 16)),
  /** pionjärväxt: a bare grey rock in the sun with nothing on it except a few small cushions of moss and spots of lichen, the very first life, ringed in orange; a grey copy of the empty rock beside it. */
  'grms.pionjärväxt': all(bg(SKY), ground, greyed(rock(26, 112, 36, 30)), rock(76, 112, 72, 60, STONE), cushion(66, 64, 16, 7, MOSS, 3), cushion(86, 70, 12, 6, MOSS, 4), blob(58, 90, 5, '#e0c040', 2), blob(94, 92, 4, '#c8d4b8', 3), ring(76, 68, 20, 12), sunG(100, 18)),
  /** vitmossa: a pale green and pinkish moss growing in a wet bog; a hand squeezes a handful of it and lots of water streams out between the fingers. */
  'grms.vitmossa': all(bg('#e4eedc'), rect(4, 92, 112, 20, '#b8d07a', 0, null), ...Array.from({ length: 22 }, (_, i) => all(circle(8 + i * 5, 92 + (i % 2) * 2, 3, i % 3 ? '#b8d07a' : '#d8a0a0', C.ink, 0.7))), pool(96, 106, 26, 6),
    path('M44 40 C40 50 42 60 50 64 L70 64 C76 58 78 46 72 40 Z', '#c8d88a', C.ink, 1.2), rect(42, 30, 32, 16, C.skin, 6, C.ink, 1.3), line('M48 30 L48 42 M56 30 L56 42 M64 30 L64 42', 'rgba(43,42,51,0.35)', 0.8), ...[[50, 72], [56, 78], [62, 70], [66, 80], [52, 84]].map(([a, b]) => drop(a!, b!, 1.1, '#5aa8d8'))),
  /** björnmossa: a tall, dark green moss in a thick clump; each shoot seen from above is a little green star and from the side looks like a tiny spruce tree; a pencil beside it shows its height. */
  'grms.björnmossa': all(bg('#e4eedc'), ground, ...[14, 22, 30, 38, 46, 54, 62].map((x, i) => all(line(`M${x} 112 L${x} ${54 + (i % 3) * 6}`, '#5a3a20', 1.4), ...Array.from({ length: 9 }, (_, k) => { const y = 108 - k * 5.6; return y < 54 + (i % 3) * 6 ? '' : line(`M${x} ${y} L${x - 4} ${y - 3} M${x} ${y} L${x + 4} ${y - 3}`, '#2f6e2a', 1.4); }))),
    circle(92, 34, 16, '#f4f8ee', C.ink, 1.4), ...Array.from({ length: 8 }, (_, i) => rot(92, 34, i * 45, 1, path('M0 0 L-1.4 -12 L0 -14 L1.4 -12 Z', '#2f6e2a', C.ink, 0.5))), rect(84, 60, 6, 52, '#f2c14e', 1, C.ink, 1), path('M84 60 L87 54 L90 60 Z', '#e8c8a0', C.ink, 0.8)),
  /** väggmossa: a soft forest-floor moss with bright red stems and light green leaves, ringed; behind it an old log house whose wall gaps between the logs are stuffed with the same moss. */
  'grms.väggmossa': all(bg('#e4eedc'), ground, ...[0, 1, 2, 3].map((i) => all(rect(50, 20 + i * 12, 66, 10, '#a0673d', 5, C.ink, 1.2), path(`M52 ${31 + i * 12} q8 2 16 0 q8 2 16 0 q8 2 16 0 q8 2 14 0`, 'none', MOSS, 2.4))),
    ...[12, 20, 28, 36, 44].map((x, i) => at(x, 112, 1.6, mossShoot(0, 0, 22 + (i % 2) * 4, '#a8d06a', RED))), ring(28, 92, 22, 20)),
  /** husmossa: a moss shoot shaped like stairs – each year a new feathery fern-like branch grows up out of the previous one; the steps are numbered with small orange dots 1 to 4. */
  'grms.husmossa': all(bg('#e4eedc'), ground, cushion(60, 112, 96, 12, MOSS, 3), ...[0, 1, 2, 3].map((i) => { const x0 = 24 + i * 18, y0 = 100 - i * 18; return all(path(`M${x0} ${y0} C${x0 + 4} ${y0 - 8} ${x0 + 12} ${y0 - 14} ${x0 + 22} ${y0 - 16}`, 'none', '#8a5a2a', 1.6), ...Array.from({ length: 6 }, (_, k) => { const t = k / 6; const xx = x0 + 22 * t, yy = y0 - 16 * Math.sqrt(t); return line(`M${f1(xx)} ${f1(yy)} L${f1(xx - 2)} ${f1(yy - 5)} M${f1(xx)} ${f1(yy)} L${f1(xx + 3)} ${f1(yy + 3)}`, MOSS, 1.4); }), circle(x0, y0 + 4, 3.4, HL, null), circle(x0, y0 + 4, 1, WHITE, null)); })),
  /** kvastmossa: dense tufts of moss on a stone whose long narrow leaves all bend the same way, as if brushed; a small hand brush beside it shows the same shape. */
  'grms.kvastmossa': all(bg('#e4eedc'), ground, rock(48, 112, 80, 40, STONE), ...[24, 34, 44, 54, 64, 72].map((x, i) => all(...Array.from({ length: 6 }, (_, k) => path(`M${x + k * 1.4 - 4} ${88 - (i % 2) * 2} C${x + k * 1.4 - 3} ${78} ${x + k * 1.4 + 2} ${72} ${x + k * 1.4 + 8} ${72 + (k % 2) * 2}`, 'none', MOSS2, 1.3)))),
    rot(98, 84, -10, 1, rect(-4, -30, 8, 18, WOOD, 2, C.ink, 1.1), ...Array.from({ length: 6 }, (_, k) => path(`M${-3 + k * 1.2} -12 C${-3 + k * 1.2} -4 ${k} 0 ${6 + k} 2`, 'none', '#c8a050', 1.3)))),
  // ── 2825 Lavar ──
  /** skorplav: a grey rock covered with flat, paint-like patches of crust lichen in yellow, orange, grey-green and white, pressed flat to the stone; a finger tries to lift one but cannot. */
  'grms.skorplav': all(bg(SKY), ground, rock(60, 112, 104, 76, STONE), blob(36, 70, 12, '#e0c040', 2), blob(64, 60, 10, '#c8d4b8', 3), blob(84, 80, 14, ORANGE, 4), blob(48, 94, 10, WHITE, 5), blob(78, 100, 8, '#9ab070', 6), blob(30, 92, 6, '#c8d4b8', 7)),
  /** bladlav: on a birch trunk, round green-grey rosettes of flat, leaf-like lobes; the edge of one lobe is lifted a little by a fingernail, showing it is a separate layer. */
  'grms.bladlav': all(bg('#e4eedc'), ground, rect(36, 4, 48, 108, WHITE, 2, C.ink, 1.4), line('M38 20 L52 20 M66 34 L82 34 M38 58 L50 58 M70 76 L82 76 M40 96 L54 96', C.ink, 1.6), rosette(56, 48, 14, '#9ab890', 9), rosette(68, 90, 10, '#a8b8a0', 8), rosette(46, 74, 7, '#9ab890', 7),
    rect(92, 34, 14, 20, C.skin, 5, C.ink, 1.3), path('M70 46 C76 40 84 40 92 44', 'none', '#9ab890', 3), path('M70 46 C76 40 84 40 92 44', 'none', C.ink, 0.6)),
  /** busklav: grey-green lichens like tiny branched trees or bushes – some standing up from the ground, one hanging from a branch above – ringed in orange. */
  'grms.busklav': all(bg('#e4eedc'), ground, branchH(4, 70, 22), branchy(40, 22, -1.6, '#b8c8a0'), branchy(30, 112, 2.2, '#c8d4b0'), branchy(60, 112, 2.6, '#c8d4b0'), branchy(88, 112, 2, '#c8d4b0'), ring(60, 88, 16, 24)),
  /** renlav: a thick pale grey-white carpet of soft, densely branched, cauliflower-like lichen covering the dry ground among a few pine trees; close-up of a branched tuft. */
  'grms.renlav': all(bg(SKY), conifer(14, 70, 1.2), conifer(108, 66, 1.1), path('M4 112 L4 70 C30 64 90 64 116 70 L116 112 Z', '#e8ecdc', C.ink, 1.3), ...Array.from({ length: 30 }, (_, i) => { const r = rng(i + 20); return branchy(f1(8 + r() * 104), f1(76 + r() * 34), 0.5, '#f0f2e6', 1.4); }), circle(60, 34, 20, '#f4f8ee', C.ink, 1.6), branchy(60, 50, 1.6, '#e8ecdc', 2.4), line('M60 54 L60 66', HL, 1.6)),
  /** renbete: in a snowy forest a reindeer digs a hole in the snow with its front hoof and grazes on the pale lichen under the snow; another reindeer stands nearby. */
  'grms.renbete': all(bg('#e4ecf2'), conifer(14, 70, 1.2), conifer(104, 66, 1.1), rect(4, 70, 112, 42, SNOW, 0, C.ink, 1), path('M50 112 C52 96 82 96 84 112 Z', '#e8ecdc', C.ink, 1.1), ...[56, 64, 72, 80].map((x) => branchy(x, 112, 0.6, '#c8d4b0', 1.4)), reindeer(48, 104, 1.2, 'down'), reindeer(96, 88, 0.7, 'up'), flake(30, 20, 3), flake(70, 14, 3), flake(90, 34, 3)),
  /** bägarlav: on a mossy stump small grey-green lichens shaped like tiny cups or goblets stand in a row; a few have little red dots on the rim. */
  'grms.bägarlav': all(bg('#e4eedc'), ground, path('M20 112 L24 70 L96 70 L100 112 Z', WOOD, C.ink, 1.4), ellipse(60, 70, 36, 7, '#d8b884', C.ink, 1.2), ellipse(60, 70, 20, 3.4, 'none', '#b08850', 0.8), cushion(60, 70, 60, 8, MOSS, 5), ...[34, 46, 58, 70, 84].map((x, i) => cupL(x, 66, 1.5, i % 2 === 1))),
  /** islandslav: brown and olive, flat, narrow, strap-like branching lichen growing on dry heath; beside it a cup of steaming tea. */
  'grms.islandslav': all(bg(SKY), ground, rect(4, 92, 112, 20, '#c8c0a0', 0, null), ...[[24, 104], [44, 106], [64, 104]].map(([x, y]) => at(x!, y!, 1.5, ...[-30, -10, 10, 30].map((r) => rot(0, 0, r, 1, path('M-1.6 0 L-2 -10 L-4 -16 L-1 -14 L0 -20 L1 -14 L4 -16 L2 -10 L1.6 0 Z', '#8a6a3a', C.ink, 0.7))))),
    path('M84 82 L104 82 L102 104 L86 104 Z', WHITE, C.ink, 1.3), path('M104 86 C110 86 110 96 103 96', 'none', C.ink, 1.3), ellipse(94, 84, 9, 2, '#c8a060', null), line('M90 74 q-2 -4 0 -8 M96 72 q-2 -4 0 -8', '#aaa', 1.2)),
  /** skägglav: long grey-green beard-like lichen hanging from the branches of an old spruce in clean air; the sky is clear and blue. */
  'grms.skägglav': all(bg(SKY), rect(10, 4, 8, 108, '#6a4a30', 1, C.ink, 1.2), branchH(14, 100, 30), branchH(14, 84, 66), beard(40, 28, 30), beard(62, 26, 34), beard(84, 24, 26), beard(36, 64, 24), beard(60, 62, 30), ground),
  /** vägglav: the roof and wall of an old barn and a stone are covered with bright yellow-orange leafy lichen patches; a farm with a cow in the background. */
  'grms.vägglav': all(bg(SKY), ground, rect(14, 54, 60, 58, '#b8452e', 0.5, C.ink, 1.3), path('M8 54 L44 28 L80 54 Z', '#7a7a7a', C.ink, 1.3), ...[[30, 44], [50, 40], [62, 48], [24, 50]].map(([a, b]) => rosette(a!, b!, 4.4, '#f0a020', 7)), ...[[28, 70], [56, 86]].map(([a, b]) => rosette(a!, b!, 5, '#f0a020', 7)), rock(94, 112, 30, 22), rosette(92, 100, 5, '#f0a020', 7), rosette(100, 104, 3.4, '#f0a020', 6)),
  /** kartlav: a grey rock covered with yellow-green patches of crust lichen, each fenced by black lines, so that it looks like a map of countries with borders; a paper map beside it for comparison. */
  'grms.kartlav': all(bg(SKY), ground, rock(48, 112, 84, 66, STONE), ...[[30, 76, 9, 1], [50, 68, 10, 2], [68, 80, 9, 3], [40, 94, 9, 4], [60, 98, 8, 5]].map(([x, y, r, s]) => blob(x!, y!, r!, '#c8d84a', s!, 1.6)),
    rect(88, 28, 24, 30, '#f6eed8', 1, C.ink, 1.2), path('M90 40 L98 34 L106 38 L110 30 M92 50 L100 46 L110 52 M98 34 L100 46', 'none', C.ink, 0.9), rect(90, 30, 8, 6, '#c8d84a', 0, null)),
  /** indikatorart: two panels of the same rock. Left: clean air, blue sky and sun; small green plants and lichen spots grow on the rock (ringed in orange), and a dotted arrow leads from them to a measuring scale beside it whose pointer stands high in the green zone. Right: grey smoky air from a factory; the same rock is bare, and the scale's pointer stands low in the red zone. */
  'grms.indikatorart': all(bg(), rect(6, 10, 52, 100, SKY, 2, C.ink, 1.2), sunG(16, 22, 5), rock(26, 108, 34, 30), cushion(20, 86, 16, 9, MOSS, 3), cushion(33, 86, 14, 8, MOSS, 4), blob(22, 99, 4, '#9ac060', 5), blob(34, 98, 3.4, '#c8d84a', 6), ring(27, 89, 16, 13),
    gauge(48, 24, 'hi'), line('M34 76 C40 70 40 60 42 54', HL, 1.4, '2 2'),
    rect(62, 10, 52, 100, '#c8c4bc', 2, C.ink, 1.2), rect(66, 50, 10, 58, '#8a847c', 0.5, C.ink, 1), circle(72, 44, 4, '#7a7a80', null), circle(78, 36, 5, '#6e6e74', null), circle(86, 28, 6, '#66666c', null), rock(90, 108, 30, 30), gauge(104, 24, 'lo'), rect(6, 10, 52, 100, 'none', 2, C.ink, 1.2), rect(62, 10, 52, 100, 'none', 2, C.ink, 1.2)),

  // ── 2826 Myrvegetation ──
  /** myr: a wide, open, flat wet bog with brown and green moss, small pools of water, low tussocks with white cotton-grass, and a forest edge far away. */
  'grms.myr': all(bg(SKY), conifer(14, 56, 0.6), conifer(24, 56, 0.7), conifer(100, 56, 0.6), conifer(110, 56, 0.7), rect(4, 56, 112, 56, '#b8b06a', 0, null), line('M4 56 L116 56', C.ink, 1), pool(40, 68, 26, 6), pool(86, 78, 30, 8), pool(30, 96, 34, 9), tussock(70, 98, 20, 10, '#9ab050'), tussock(100, 104, 16, 8, '#9ab050'), tussock(56, 74, 12, 6, '#9ab050'), cotton(74, 88, 10, 0.8), cotton(66, 88, 8, 0.8), cotton(102, 96, 8, 0.8)),
  /** kärr: a green wet meadow-like bog fed by a little stream coming from the hillside; many grasses and flowers (purple, yellow) grow in it. */
  'grms.kärr': all(bg(SKY), path('M4 56 C30 40 50 40 70 56 L4 56 Z', '#8ab070', C.ink, 1.1), conifer(24, 48, 0.6), rect(4, 56, 112, 56, '#9ac070', 0, null), line('M4 56 L116 56', C.ink, 1), path('M40 56 C44 66 30 74 40 84 C50 94 70 92 76 104 L84 112', 'none', WATER2, 4), path('M40 56 C44 66 30 74 40 84 C50 94 70 92 76 104 L84 112', 'none', WATER, 2.4),
    arrow(30, 50, 40, 60, HL, 2), ...[[16, 92], [24, 104], [60, 76], [96, 80], [104, 98], [92, 106], [20, 72]].map(([x, y], i) => all(stalk(x!, y! + 10, 12), i % 2 ? bloom(x!, y!, 3.4, 5, YEL) : circle(x!, y!, 2.6, '#a05ab8', C.ink, 0.6))), tuft(70, 112, 14, 7), tuft(108, 76, 12, 5)),
  /** hölja: a cut through a bog: two raised mossy tussocks with dry plants on top, and between them a low wet hollow where water stands up to the moss surface, the hollow ringed in orange; a boot sinks in it. */
  'grms.hölja': all(bg(SKY), rect(4, 80, 112, 32, PEAT, 0, C.ink, 1), path('M4 80 C10 52 34 52 40 80 Z', MOSS, C.ink, 1.2), path('M80 80 C86 52 110 52 116 80 Z', MOSS, C.ink, 1.2), tuft(22, 62, 14, 5), tuft(98, 62, 14, 5), rect(40, 74, 40, 10, WATER, 1, C.ink, 1), rect(40, 82, 40, 4, '#b8d07a', 0, null), line('M46 77 l6 0 M64 77 l6 0', WHITE, 1), ring(60, 78, 22, 12),
    rot(60, 70, 0, 1, path('M-5 -20 L5 -20 L5 0 L10 2 L10 8 L-5 8 Z', '#3a6a3a', C.ink, 1.1)), line('M52 74 q2 -2 4 0 M64 74 q2 -2 4 0', WATER2, 1)),
  /** gungfly: a person walks carefully on a floating carpet of moss at the edge of a small dark lake; a cut shows dark water under the thin mat, and wave lines show the ground swaying. */
  'grms.gungfly': all(bg(SKY), rect(4, 76, 112, 36, '#2f5a7a', 0, C.ink, 1), rect(4, 70, 84, 10, MOSS, 2, C.ink, 1.2), ...Array.from({ length: 14 }, (_, i) => line(`M${8 + i * 6} 70 l-1 -3 l2 -2`, MOSS2, 1)), rect(88, 70, 28, 8, WATER2, 0, null), fig(48, '#e8892e', 'shock', { h: 0.62, bottom: '#3d4a66' }, 70), path('M20 84 q6 -4 12 0 q6 4 12 0 q6 -4 12 0 q6 4 12 0', 'none', '#8cc7e8', 1.4), path('M30 66 q4 -3 8 0 M58 66 q4 -3 8 0', 'none', C.ink, 1.2), line('M10 100 l10 0 M70 104 l12 0', '#8cc7e8', 1.2)),
  /** spång: a narrow walkway of wooden planks zigzags across a wet bog with pools; a hiker with a backpack walks on it with dry boots. */
  'grms.spång': all(bg(SKY), rect(4, 56, 112, 56, '#b8b06a', 0, null), line('M4 56 L116 56', C.ink, 1), conifer(108, 56, 0.6), pool(24, 74, 30, 7), pool(94, 98, 30, 8), board(30, 108, 30), board(56, 98, 24), board(70, 88, 22), board(80, 78, 18), board(88, 68, 14), fig(48, '#3a8a5a', 'smile', { h: 0.62, bottom: '#3d4a66' }, 104), rect(32, 66, 8, 14, '#c0563d', 2, C.ink, 1)),
  /** tuvull: a bog in early summer with tussocks; each stem carries one single fluffy white cotton ball, so the bog looks white as if it had snowed. */
  'grms.tuvull': all(bg(SKY), rect(4, 70, 112, 42, '#b8b06a', 0, null), line('M4 70 L116 70', C.ink, 1), tussock(30, 104, 40, 14, '#9ab050'), tussock(84, 108, 40, 14, '#9ab050'), ...[18, 26, 34, 42].map((x, i) => cotton(x, 94, 24 + (i % 2) * 6, 1.3)), ...[72, 80, 88, 96].map((x, i) => cotton(x, 98, 22 + (i % 2) * 6, 1.3)), cotton(58, 70, 12, 0.9), cotton(106, 72, 10, 0.9)),
  /** hjortron: a low plant with broad lobed leaves growing on a bog, with one large orange raspberry-like berry on top; a hand picks a second berry into a small bucket. */
  'grms.hjortron': all(bg(SKY), rect(4, 80, 112, 32, '#b8c06a', 0, null), line('M4 80 L116 80', C.ink, 1), at(44, 104, 2.6, cloudberry(0, 0, 1)), at(90, 104, 1.4, cloudberry(0, 0, 1, RED)), path('M84 50 L104 50 L102 70 L86 70 Z', '#c8d0d8', C.ink, 1.3), path('M84 50 C84 40 104 40 104 50', 'none', C.ink, 1.2), ...[[90, 50], [96, 49], [100, 51]].map(([a, b]) => circle(a!, b!, 3, ORANGE, C.ink, 0.6))),
  /** tranbär: on a pale green moss carpet, very thin red creeping stems with tiny leaves carry small shiny red berries; a few berries are much bigger in the front. */
  'grms.tranbär': all(bg(SKY), rect(4, 66, 112, 46, '#c8d88a', 0, null), ...Array.from({ length: 26 }, (_, i) => circle(8 + (i % 13) * 8.6, 72 + Math.floor(i / 13) * 14 + (i % 2) * 3, 3, '#b8d07a', C.ink, 0.5)),
    path('M8 96 C30 88 50 104 70 94 C86 86 100 98 114 92', 'none', '#8a3a2a', 1), path('M10 84 C28 80 44 88 60 82', 'none', '#8a3a2a', 1), ...[[20, 90], [42, 96], [64, 96], [88, 90], [104, 94], [30, 82], [52, 84]].map(([a, b]) => all(ellipse(a! - 2, b! - 3, 1.6, 0.8, '#3a6a3a', null), berry(a!, b! + 3, 3.4, RED))), berry(36, 106, 6, RED), berry(78, 106, 7, RED)),
  /** skvattram: a low shrub with narrow rusty-brown leaves and round clusters of white flowers on a bog; strong smell-lines rise from it and a person nearby holds their nose. */
  'grms.skvattram': all(bg(SKY), rect(4, 80, 112, 32, '#b8b06a', 0, null), line('M4 80 L116 80', C.ink, 1), at(44, 104, 1, line('M0 0 L-10 -30 M0 0 L0 -36 M0 0 L12 -30', '#6a4a30', 2), ...[[-10, -30], [0, -36], [12, -30]].map(([a, b]) => all(...[-40, -10, 20, 50].map((r) => rot(a!, b! + 8, r, 1, ellipse(0, -4, 1.2, 4, '#7a6a3a', C.ink, 0.5))), ...Array.from({ length: 7 }, (_, i) => circle(a! + Math.cos(i) * 4, b! - 4 + Math.sin(i) * 3, 2.2, WHITE, C.ink, 0.5))))),
    smell(28, 50, '#8a7a2a'), smell(54, 46, '#8a7a2a'), fig(92, '#5a7ad0', 'sick', { h: 0.62, bottom: '#3d4a66' }, 104), circle(92, 49, 2.6, C.skin, C.ink, 0.9)),
  /** pors: a low shrub with small grey-green leaves at the edge of a lake; a hand rubs a leaf between the fingers and a soft pleasant smell rises; a glass of beer stands beside it. */
  'grms.pors': all(bg(SKY), rect(4, 72, 112, 14, WATER, 0, null), rect(4, 86, 112, 26, '#9ac070', 0, null), line('M4 86 L116 86', C.ink, 1), at(40, 110, 1, line('M0 0 L-12 -34 M0 0 L2 -40 M0 0 L14 -32 M-6 -16 L-14 -22 M6 -16 L14 -18', '#7a4a30', 1.8), ...[[-12, -34], [2, -40], [14, -32], [-14, -22], [14, -18], [-4, -26], [8, -28]].map(([a, b]) => all(ellipse(a! - 3, b!, 3.4, 1.4, '#7a9a6a', C.ink, 0.5), ellipse(a! + 3, b! + 1, 3.4, 1.4, '#7a9a6a', C.ink, 0.5)))),
    rect(70, 40, 12, 18, C.skin, 5, C.ink, 1.3), ellipse(76, 58, 4, 1.6, '#7a9a6a', C.ink, 0.6), smell(72, 34, '#6a9a4a'), path('M94 84 L106 84 L105 106 L95 106 Z', '#f2c14e', C.ink, 1.2), path('M94 84 C94 78 106 78 106 84 Z', WHITE, C.ink, 1)),
  /** sileshår: close-up of a small round red leaf covered with red hairs, each tipped with a shining sticky drop; a small fly is stuck on it and the hairs bend around it. */
  'grms.sileshår': all(bg('#e4eedc'), ground, cushion(60, 112, 100, 14, '#c8d88a', 4), line('M60 104 L60 70', '#a04a3a', 1.6), circle(60, 54, 18, '#c85a4a', C.ink, 1.3), ...Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2; const x = 60 + Math.cos(a) * 24, y = 54 + Math.sin(a) * 24; return all(line(`M${f1(60 + Math.cos(a) * 16)} ${f1(54 + Math.sin(a) * 16)} L${f1(x)} ${f1(y)}`, '#a02a2a', 1.2), circle(f1(x), f1(y), 2, 'rgba(220,240,255,0.9)', '#a02a2a', 0.6)); }), fly(64, 50, 1.6),
    ...[[30, 98], [92, 100]].map(([a, b]) => all(line(`M${a} 110 L${a} ${b}`, '#a04a3a', 1.2), circle(a!, b! - 4, 4, '#c85a4a', C.ink, 0.8)))),
  /** köttätande växt: a plant with a leaf shaped like a toothed jaw that snaps shut around a fly, an insect flying towards an open leaf beside it, small orange arrows show the closing. */
  'grms.köttätande-växt': all(bg('#e4eedc'), ground, cushion(60, 112, 100, 12, '#c8d88a', 6), line('M44 104 L44 66', GRASS2, 2), line('M80 104 L80 58', GRASS2, 2),
    at(44, 60, 1.6, path('M0 6 C-12 4 -16 -6 -12 -10 C-6 -6 -2 -2 0 6 Z', '#6ab04a', C.ink, 1), path('M0 6 C12 4 16 -6 12 -10 C6 -6 2 -2 0 6 Z', '#6ab04a', C.ink, 1), path('M0 6 C-8 2 -10 -4 -12 -10 M0 6 C8 2 10 -4 12 -10', 'none', RED, 1.4), line('M-12 -10 l-2 -3 M-9 -8 l-2 -3 M12 -10 l2 -3 M9 -8 l2 -3', C.ink, 0.8)), fly(44, 52, 1.2), arrow(20, 40, 30, 46, HL, 2), arrow(68, 40, 58, 46, HL, 2),
    at(80, 52, 1.6, path('M0 6 C-14 0 -16 -10 -10 -14 C-6 -6 -2 0 0 6 Z', '#6ab04a', C.ink, 1), path('M0 6 C14 0 16 -10 10 -14 C6 -6 2 0 0 6 Z', '#6ab04a', C.ink, 1), line('M-10 -14 l-2 -3 M-13 -10 l-3 -2 M10 -14 l2 -3 M13 -10 l3 -2', C.ink, 0.8)), fly(102, 24, 1.2)),
  /** dika: a long straight ditch has been dug through a bog; water runs out of the bog into the ditch (orange arrows), and on the dry side small trees have started to grow; a spade stands in the earth. */
  'grms.dika': all(bg(SKY), rect(4, 56, 112, 56, '#b8b06a', 0, null), line('M4 56 L116 56', C.ink, 1), rect(4, 56, 50, 56, '#a8986a', 0, null), path('M52 112 L58 56 L66 56 L62 112 Z', WATER2, C.ink, 1.1), path('M58 112 L61 56', 'none', WATER, 1.4), arrow(96, 84, 70, 84, HL, 2.4), arrow(96, 100, 70, 100, HL, 2.4), pool(96, 70, 18, 5),
    tree(18, 80, 0.7, '#8cc04a'), tree(34, 96, 0.8, '#8cc04a'), conifer(24, 108, 0.7), rot(44, 70, 10, 1, line('M0 0 L0 -26', WOOD, 2.4), path('M-4 0 L4 0 L3 8 L-3 8 Z', '#c0c6cc', C.ink, 1))),

  // ── 2827 Växter i fjällmiljö ──
  /** kalfjäll: a mountain where a belt of birch forest covers the lower slopes and stops at a clear line; above it the wide bare mountain with only low vegetation and rocks, ringed in orange. */
  'grms.kalfjäll': all(bg(SKY), mountain('#a8b4a0'), path('M4 92 C30 84 70 84 116 90 L116 112 L4 112 Z', '#5a9a4a', C.ink, 1.1), ...[10, 20, 30, 42, 54, 66, 78, 90, 102, 112].map((x, i) => crookedBirch(x, 100 + (i % 2) * 6, 0.5)), line('M4 84 C30 76 70 76 116 82', HL, 1.4, '4 3'), ...[[40, 66], [76, 58], [60, 74]].map(([a, b]) => rock(a!, b!, 8, 5)), ring(66, 54, 34, 18)),
  /** fjällväxt: among stones high in the mountains, a tiny cushion plant with comparatively big pink and white flowers grows close to the ground; snowy peaks behind. */
  'grms.fjällväxt': all(bg(SKY), path('M4 70 L30 34 L50 56 L76 24 L116 66 L116 70 Z', '#b0bcc8', C.ink, 1.2), path('M70 32 L76 24 L83 32 Z', SNOW, C.ink, 0.8), rect(4, 70, 112, 42, '#b8b8a0', 0, null), rock(20, 112, 26, 18), rock(98, 112, 30, 22), rock(60, 84, 14, 8),
    path('M36 112 C36 92 84 92 84 112 Z', '#4f8a3a', C.ink, 1.2), ...[[44, 98], [52, 92], [60, 90], [68, 92], [76, 98], [56, 100], [66, 100]].map(([a, b], i) => bloom(a!, b!, 7, 5, i % 2 ? '#e88ab0' : WHITE))),
  /** lågväxt: on a windy mountain, a flat, ground-hugging coloured plant grows close to the soil out of the wind, while a grey tall plant beside it bends in the wind; wind streaks. */
  'grms.lågväxt': all(bg(SKY), ground, wind(8, 20, 30), wind(60, 34, 24), path('M10 112 C10 100 60 100 60 112 Z', '#4f8a3a', C.ink, 1.3), ...[[18, 104], [28, 102], [38, 101], [48, 102], [54, 106]].map(([a, b], i) => bloom(a!, b!, 5, 5, i % 2 ? '#e88ab0' : YEL)),
    greyed(line('M92 112 Q90 80 104 40', GRASS2, 2.4), blade(92, 100, 30, 18, GRASS2, 2), blade(94, 80, 26, 20, GRASS2, 2), bloom(104, 38, 7, 5, YEL)), line('M66 112 L66 100 M62 104 L66 100 L70 104', HL, 2.2)),
  /** härdig: a small flowering plant blooms happily in the snow with frost flakes falling around it, while a grey drooping plant next to it has wilted in the cold. */
  'grms.härdig': all(bg('#e4ecf2'), rect(4, 96, 112, 16, SNOW, 0, C.ink, 1), ...[[16, 20], [40, 12], [64, 26], [92, 14], [108, 40], [30, 44], [80, 50]].map(([a, b]) => flake(a!, b!, 3.4)), stalk(38, 98, 40, 0, '#3f8a3a', 2.4), blade(38, 84, 18, -14, '#3f8a3a', 2.4), blade(38, 80, 16, 14, '#3f8a3a', 2.4), bloom(38, 56, 16, 6, '#e85a8a'),
    greyed(path('M86 98 C86 80 90 70 100 66', 'none', GRASS2, 2.4), path('M100 66 C106 66 108 72 106 78', 'none', GRASS2, 2), bloom(106, 82, 8, 5, YEL), blade(86, 90, 12, 10, GRASS2, 2))),
  /** snölega: a mountain slope in midsummer, green and flowery, but in a hollow a large patch of snow still lies; around the snow edge only a narrow ring of new pale green, ringed in orange. */
  'grms.snölega': all(bg(SKY), sunG(102, 18), path('M4 112 L4 50 C40 40 80 52 116 70 L116 112 Z', '#6aa84a', C.ink, 1.3), path('M30 92 C26 72 70 62 84 80 C90 92 60 100 30 92 Z', '#c8e0a0', C.ink, 1), path('M36 88 C34 74 66 68 78 80 C82 88 58 94 36 88 Z', SNOW, C.ink, 1.2), ring(57, 81, 32, 16),
    ...[[14, 70], [100, 92], [18, 100], [94, 106], [104, 84]].map(([a, b], i) => bloom(a!, b!, 4, 5, i % 2 ? YEL : '#e88ab0'))),
  /** fjällhed: a wide dry mountain heath in autumn colours – red, orange and brown low shrubs, pale lichen patches and black berries – with mountains far away. */
  'grms.fjällhed': all(bg(SKY), path('M4 60 L36 30 L58 50 L84 28 L116 58 L116 62 L4 62 Z', '#b0bcc8', C.ink, 1.1), rect(4, 60, 112, 52, '#c88a3a', 0, null), line('M4 60 L116 60', C.ink, 1), ...Array.from({ length: 40 }, (_, i) => { const r = rng(i + 30); const x = 8 + r() * 104, y = 66 + r() * 42; const cols = [RED, '#d86a2a', '#8a5a2a', '#e8b03a']; return circle(f1(x), f1(y), 2.4 + r() * 2, cols[i % 4]!, null); }), ...[[30, 90], [80, 80], [60, 104]].map(([a, b]) => blob(a!, b!, 6, '#e8ecdc', a!)), ...[[44, 76], [96, 98]].map(([a, b]) => berry(a!, b!, 1.8, C.dark))),
  /** dvärgbjörk: a tiny birch only knee-high with small round leaves, turned red in autumn, next to a hiker's leg and boot for size. */
  'grms.dvärgbjörk': all(bg(SKY), ground, rect(4, 100, 112, 12, '#b8a870', 0, null), at(44, 112, 0.75, path('M0 0 C-2 -10 -10 -14 -14 -24 M0 0 C2 -12 8 -18 12 -28 M-6 -10 L4 -20', 'none', '#6a4a30', 1.6), ...[[-14, -24], [12, -28], [4, -20], [-8, -16], [8, -14], [-12, -30], [16, -34], [-2, -24], [6, -32]].map(([a, b]) => circle(a!, b!, 3, '#d8452a', C.ink, 0.7))),
    fig(90, '#3a6aa8', 'smile', { h: 0.95, bottom: '#3d4a66' }), line('M30 86 L78 86', HL, 1.4, '3 2')),
  /** vide: low dense willow shrubs with narrow silver-grey leaves grow along a mountain stream; a reindeer nibbles a branch. */
  'grms.vide': all(bg(SKY), mountain('#b0bcc8'), rect(4, 80, 112, 32, '#8ab06a', 0, null), path('M20 80 C30 92 50 90 60 100 C70 108 90 106 100 112', 'none', WATER2, 5), path('M20 80 C30 92 50 90 60 100 C70 108 90 106 100 112', 'none', WATER, 3),
    ...[[30, 86], [52, 94], [78, 100]].map(([x, y]) => at(x!, y!, 1, ...[-40, -20, 0, 20, 40].map((r) => rot(0, 0, r, 1, line('M0 0 L0 -18', '#7a4a30', 1.2), ...[-6, -10, -14, -18].map((d) => all(ellipse(-2.4, d, 2.6, 1, '#c8d0c8', C.ink, 0.4), ellipse(2.4, d + 1, 2.6, 1, '#c8d0c8', C.ink, 0.4))))))), reindeer(96, 92, 0.6, 'up')),
  /** kråkbär: a low, mat-forming plant with tiny needle-like leaves on creeping twigs and shiny black berries, on a heath; a close-up of a twig with berries. */
  'grms.kråkbär': all(bg(SKY), rect(4, 84, 112, 28, '#7a9a4a', 0, null), ...Array.from({ length: 14 }, (_, i) => all(line(`M${6 + i * 8} 108 C${10 + i * 8} 98 ${14 + i * 8} 92 ${12 + i * 8} 86`, '#5a3a20', 1), ...[0, 1, 2, 3].map((k) => line(`M${f1(8 + i * 8 + k * 1.4)} ${102 - k * 4} l-2 -2 M${f1(8 + i * 8 + k * 1.4)} ${102 - k * 4} l2 -2`, '#2f6e2a', 1)), berry(12 + i * 8, 92 + (i % 3) * 4, 1.8, C.dark))),
    circle(60, 40, 26, '#f4f8ee', C.ink, 1.6), path('M40 54 C50 44 64 40 80 32', 'none', '#5a3a20', 2), ...Array.from({ length: 10 }, (_, k) => { const x = 42 + k * 4, y = 52 - k * 2; return line(`M${x} ${y} l-2 -5 M${x} ${y} l3 -4`, '#2f6e2a', 1.6); }), berry(52, 52, 5, C.dark), berry(64, 46, 5, C.dark), berry(58, 40, 4.4, C.dark)),
  /** fjällsippa: a low mat of small dark green leaves with large white flowers, each with eight petals and a yellow centre, turned towards the sun. */
  'grms.fjällsippa': all(bg(SKY), sunG(102, 18), rect(4, 90, 112, 22, '#b8b8a0', 0, null), path('M10 112 C10 94 110 94 110 112 Z', '#3f6e3a', C.ink, 1.2), ...Array.from({ length: 16 }, (_, i) => ellipse(16 + i * 6, 102 + (i % 2) * 4, 2.6, 1.6, '#2f5a2a', C.ink, 0.5)), stalk(40, 100, 30, 6), bloom(46, 64, 22, 8, WHITE, YEL, 0.8), stalk(84, 100, 22, 4), bloom(88, 76, 14, 8, WHITE, YEL, 0.7), line('M60 52 L90 30', 'rgba(242,193,78,0.6)', 1.4, '3 3')),
  /** isranunkel: on a rocky summit near snow and ice, small plants with white and pink flowers grow between the stones – the highest flowers of all; below, the mountain falls away. */
  'grms.isranunkel': all(bg(SKY), path('M4 112 L4 90 L40 40 L60 20 L80 40 L116 90 L116 112 Z', '#a8a49c', C.ink, 1.3), path('M48 32 L60 20 L72 32 L64 36 L56 34 Z', SNOW, C.ink, 1), rock(46, 60, 14, 8, STONE2), rock(74, 56, 12, 7, STONE2),
    ...[[56, 44, WHITE], [64, 46, '#f0a8c0'], [60, 52, WHITE], [52, 54, '#e87aa0']].map(([a, b, col]) => all(stalk(a as number, (b as number) + 8, 8, 0, GRASS2, 1.2), bloom(a as number, b as number, 6, 5, col as string))), flake(30, 20, 3), flake(92, 22, 3), arrow(96, 56, 70, 44, HL, 2.2)),
};
