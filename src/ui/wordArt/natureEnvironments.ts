/**
 * Natur & geografi → Ekologi & miljö → Svenska naturmiljöer, 2911–2917 (0.46): coniferous and deciduous forest,
 * bogs and wetlands, lakes and streams, coast and sea, mountains and tundra, and the farmed landscape.
 * Recurring signs: landscapes drawn as a small window onto one habitat, standing on the ground line (y = 112); the
 * part the word names (a layer of the forest, a zone of the lake, a band of seaweed, an islet) ringed or bracketed in
 * orange while the rest of the scene stays calm or grey; forest layers shown as a cut-away with one layer in colour
 * and the others grey; water in cut-away with light blue for fresh water and blue-green for sea water; wind as grey
 * streaks, cold as blue flakes, sound as short arcs. Birds are told apart by their typical bill, legs and markings.
 * Abstract adjectives are small symbolic scenes where the coloured idea dominates and a grey copy stands beside it
 * as contrast. Digits only; no words, no brands, no emblems and no pointing fingers.
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
const SAND = '#ecd9a8';
const SOIL = '#8a6040';
const WOOD = '#a0673d';
const PINEBARK = '#c0703a';
const STONE = '#a9a49c';
const STONE2 = '#8c867d';
const MOSS = '#6fa83c';
const MOSS2 = '#4f8a2c';
const LICHEN = '#dfe3d2';
const HEATH = '#a8589a';
const SPRUCE = '#2f6e4a';
const PINE = '#3f7a46';
const LEAF = '#5aa040';
const WATER = '#8cc7e8';
const WATER2 = '#3f86c0';
const SEA = '#5aa7b8';
const SEA2 = '#2f7a8c';
const SNOW = '#f4f8fb';
const YEL = '#f2c14e';
const ORANGE = '#e8892e';
const RED = '#c93a3a';
const BROWNWEED = '#9a7a2e';
const WHITE = '#fbfbf8';
const f1 = (n: number) => +n.toFixed(1);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (x: number, y: number, r: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${r}) scale(${s})`, ...k);
const bg = (col: string = PAPER) => rect(4, 4, 112, 108, col, 3, null);
const field = (y: number, col: string = GRASS) => rect(4, y, 112, 112 - y, col, 0, null);
/** Deterministic pseudo-random numbers in [0, 1). */
const rng = (seed: number) => { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; };
const ring = (x: number, y: number, rx: number, ry = rx) => ellipse(x, y, rx, ry, 'none', HL, 2.4);
const bracketV = (x: number, y1: number, y2: number, side: 1 | -1 = 1) => line(`M${x - side * 5} ${y1} L${x} ${y1} L${x} ${y2} L${x - side * 5} ${y2}`, HL, 2.4);
const bracketTop = (x1: number, x2: number, y: number) => line(`M${x1} ${y + 5} L${x1} ${y} L${x2} ${y} L${x2} ${y + 5}`, HL, 2.4);
const sound = (x: number, y: number) => line(`M${x} ${y - 5} q4 5 0 10 M${x + 4} ${y - 8} q6 8 0 16`, C.ink, 1.3);
const wind = (x: number, y: number, w = 22, col: string = C.grey) => line(`M${x} ${y} L${x + w} ${y} M${x + 6} ${y + 6} L${x + w + 4} ${y + 6} M${x} ${y + 12} L${x + w - 4} ${y + 12}`, col, 1.6);
const flake = (x: number, y: number, r = 4, col = '#5aa8d8') => line(`M${x - r} ${y} L${x + r} ${y} M${f1(x - r / 2)} ${f1(y - r * 0.87)} L${f1(x + r / 2)} ${f1(y + r * 0.87)} M${f1(x - r / 2)} ${f1(y + r * 0.87)} L${f1(x + r / 2)} ${f1(y - r * 0.87)}`, col, 1.4);
const sunG = (x: number, y: number, r = 7) => all(circle(x, y, r, C.yellow, C.ink, 1.1), line(Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `M${f1(x + Math.cos(a) * (r + 2))} ${f1(y + Math.sin(a) * (r + 2))} L${f1(x + Math.cos(a) * (r + 5))} ${f1(y + Math.sin(a) * (r + 5))}`; }).join(' '), C.orange, 1.3));
const smell = (x: number, y: number, col = '#b07ac0') => line(`M${x} ${y} q3 -3 0 -6 q-3 -3 0 -6 M${x + 6} ${y + 2} q3 -3 0 -6 q-3 -3 0 -6`, col, 1.4);
const dots = (x: number, y: number, w: number, h: number, n: number, col: string, seed: number, rr = 0.7) => { const r = rng(seed); return all(...Array.from({ length: n }, () => circle(f1(x + 1 + r() * (w - 2)), f1(y + 1 + r() * (h - 2)), rr, col, null))); };
const blade = (x: number, y: number, h: number, lean: number, col: string = GRASS2, w = 1.6) => line(`M${x} ${y} Q${f1(x + lean * 0.2)} ${f1(y - h * 0.6)} ${f1(x + lean)} ${f1(y - h)}`, col, w);
const tuft = (x: number, y: number, h: number, n = 7, col: string = GRASS2, spread = 14, w = 1.6) => all(...Array.from({ length: n }, (_, i) => { const t = n === 1 ? 0 : i / (n - 1) - 0.5; return blade(x + t * 6, y, h * (1 - Math.abs(t) * 0.5), t * spread * 2, col, w); }));
const lawn = (y: number, col: string = GRASS2, step = 5, h = 6) => all(...Array.from({ length: Math.floor(108 / step) }, (_, i) => blade(6 + i * step, y, h + ((i * 7) % 4), ((i * 5) % 7) - 3, col, 1.2)));
const bloom = (x: number, y: number, r: number, petals: number, col: string, mid: string = C.yellow, sw = 0.6) => all(...Array.from({ length: petals }, (_, i) => rot(x, y, (360 / petals) * i, 1, ellipse(0, -r * 0.62, r * 0.32, r * 0.5, col, C.ink, sw))), circle(x, y, r * 0.32, mid, C.ink, sw));
const stalk = (x: number, y: number, h: number, lean = 0, col: string = GRASS2, w = 1.5) => line(`M${x} ${y} Q${x + lean * 0.3} ${y - h * 0.5} ${x + lean} ${y - h}`, col, w);
const rock = (x: number, y: number, w: number, h: number, col: string = STONE) => path(`M${x - w / 2} ${y} C${x - w / 2} ${y - h * 0.7} ${x - w * 0.3} ${y - h} ${x} ${y - h} C${x + w * 0.35} ${y - h} ${x + w / 2} ${y - h * 0.6} ${x + w / 2} ${y} Z`, col, C.ink, 1.2);
const blob = (x: number, y: number, r: number, col: string, seed: number, sw = 0.8) => { const q = rng(seed); const pts = Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * Math.PI * 2; const d = r * (0.75 + q() * 0.4); return [x + Math.cos(a) * d, y + Math.sin(a) * d * 0.7] as const; }); return path(`M${pts.map(([a, b]) => `${f1(a)} ${f1(b)}`).join(' L')} Z`, col, C.ink, sw); };
const lens = (x: number, y: number, r: number, inner: Svg, id: string) => all(line(`M${f1(x + r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r * 1.45)} ${f1(y + r * 1.45)}`, C.ink, 4.5), line(`M${f1(x + r * 0.75)} ${f1(y + r * 0.75)} L${f1(x + r * 1.4)} ${f1(y + r * 1.4)}`, WOOD, 2.6),
  circle(x, y, r, C.white, null), `<clipPath id="${id}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`, circle(x, y, r, 'rgba(200,230,250,0.15)', C.ink, 2.2));

// ── People ───────────────────────────────────────────────────────────
const geo = (x: number, h = 1, y0 = 112) => { const s = 0.84 * h, ty = y0 - 49 * s; return { s, ty, hy: ty - 56 * s, sy: ty - 38 * s, sl: x - 13 * s, sr: x + 13 * s }; };
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}, y0 = 112) =>
  y0 === 112 ? F({ x, top, mood, ...more }) : g(`translate(0 ${f1(y0 - 112)})`, F({ x, top, mood, ...more }));
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number, y0 = 112) => { const q = geo(x, h, y0); return all(arm(f1(side < 0 ? q.sl : q.sr), f1(q.sy), tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), C.skin, C.ink, 1.2)); };

// ── Trees and plants ─────────────────────────────────────────────────
/** Spruce: a dark, narrow, pointed cone of drooping tiers. */
const spruce = (x: number, y: number, s = 1, col: string = SPRUCE) => at(x, y, s, rect(-1.6, -6, 3.2, 6, WOOD, 0.4, C.ink, 0.8),
  path('M0 -52 L-6 -40 L-3 -40 L-10 -28 L-5 -28 L-13 -16 L-7 -16 L-15 -5 L15 -5 L7 -16 L13 -16 L5 -28 L10 -28 L3 -40 L6 -40 Z', col, C.ink, 1));
/** Pine: a tall bare orange trunk with a flat, cloud-like crown on top. */
const pine = (x: number, y: number, s = 1, col: string = PINE) => at(x, y, s, path('M-2 0 L-1.4 -46 L1.4 -46 L2 0 Z', PINEBARK, C.ink, 0.9), line('M0 -36 L-8 -44 M0 -40 L7 -48', PINEBARK, 1.6),
  path('M-16 -46 C-20 -52 -12 -58 -6 -55 C-4 -62 8 -62 10 -56 C18 -58 20 -48 14 -45 C8 -42 -10 -42 -16 -46 Z', col, C.ink, 1));
/** A broad deciduous tree with a round crown. */
const leafTree = (x: number, y: number, s = 1, col: string = LEAF, trunk: string = WOOD) => at(x, y, s, path('M-3 0 L-2 -20 L-8 -28 M-2 -20 L2 -30 M2 -20 L3 0 Z', trunk, C.ink, 1),
  path('M-18 -26 C-24 -36 -14 -48 -4 -44 C0 -52 14 -50 16 -42 C26 -40 24 -26 16 -24 C12 -18 -12 -18 -18 -26 Z', col, C.ink, 1.1));
/** Oak: a gnarled trunk and a wide, lumpy crown. */
const oak = (x: number, y: number, s = 1, col = '#4f8a3a') => at(x, y, s, path('M-5 0 L-3 -16 L-10 -24 M-3 -16 L2 -26 M2 -16 L5 0 Z', WOOD, C.ink, 1), path('M-22 -24 C-30 -34 -18 -48 -6 -44 C-2 -54 14 -52 18 -44 C30 -42 28 -26 18 -22 C12 -16 -14 -16 -22 -24 Z', col, C.ink, 1.2));
/** Beech: a smooth grey trunk and a tall, dense crown. */
const beech = (x: number, y: number, s = 1, col = '#6aaa46') => at(x, y, s, path('M-2.6 0 L-2 -26 L2 -26 L2.6 0 Z', '#a8a8a0', C.ink, 0.9), path('M-14 -24 C-18 -38 -10 -54 0 -54 C10 -54 18 -38 14 -24 C8 -20 -8 -20 -14 -24 Z', col, C.ink, 1.1));
const bush = (x: number, y: number, s = 1, col = '#6a9a4a') => at(x, y, s, path('M-12 0 C-16 -8 -10 -16 -4 -14 C-2 -20 8 -20 9 -13 C15 -14 17 -4 12 0 Z', col, C.ink, 1));
/** Heather sprig: a woody stem with tiny purple bells along it. */
const heather = (x: number, y: number, h = 14, col: string = HEATH) => all(line(`M${x} ${y} L${x} ${y - h}`, '#6a4a30', 1.1), ...Array.from({ length: Math.floor(h / 3) }, (_, i) => all(circle(x - 1.4, y - 3 - i * 3, 1.1, col, null), circle(x + 1.4, y - 4.5 - i * 3, 1.1, col, null))));
const heathPatch = (x: number, y: number, w: number, seed = 1) => { const r = rng(seed); return all(...Array.from({ length: Math.round(w / 3) }, (_, i) => heather(f1(x + i * 3 + r() * 1.5), y, f1(6 + r() * 5)))); };
/** Blueberry shrub: thin green twigs with small oval leaves and blue berries. */
const bilberry = (x: number, y: number, s = 1, berries = true) => at(x, y, s, line('M0 0 L0 -12 M0 -6 L-6 -12 M0 -8 L5 -14 M-3 -9 L-5 -15', '#4f8a2c', 1.1), ...[[-6, -12], [5, -14], [-5, -15], [0, -12], [-3, -8], [3, -9]].map(([a, b]) => ellipse(a!, b!, 2, 1.2, '#5aa040', C.ink, 0.5)), berries ? all(circle(-2, -6, 1.6, '#3a4a9a', C.ink, 0.5), circle(3, -5, 1.6, '#3a4a9a', C.ink, 0.5), circle(-6, -9, 1.4, '#3a4a9a', C.ink, 0.5)) : '');
const mossBand = (x: number, y: number, w: number, col: string = MOSS) => all(path(`M${x} ${y} ${Array.from({ length: Math.round(w / 6) }, (_, i) => `Q${x + i * 6 + 3} ${y - 5} ${x + i * 6 + 6} ${y}`).join(' ')} L${x + w} ${y + 4} L${x} ${y + 4} Z`, col, C.ink, 0.8));

// ── Water ────────────────────────────────────────────────────────────
const ripples = (x: number, y: number, w: number) => line(`M${x} ${y} l${w * 0.3} 0 M${x + w * 0.45} ${y + 3} l${w * 0.35} 0`, WHITE, 1.1);
const reed = (x: number, y: number, h: number, lean = 0) => all(line(`M${x} ${y} Q${x + lean * 0.3} ${y - h * 0.5} ${x + lean} ${y - h}`, '#8a9a3a', 1.4), path(`M${x + lean - 1.6} ${y - h + 2} C${x + lean - 2} ${y - h - 4} ${x + lean + 2} ${y - h - 4} ${x + lean + 1.6} ${y - h + 2} Z`, '#8a5a2a', C.ink, 0.6));
const lily = (x: number, y: number, s = 1, flower = true) => at(x, y, s, path('M-8 0 C-8 -4 8 -4 8 0 C8 4 -8 4 -8 0 Z M0 0 L6 -2', '#4f9a3a', C.ink, 0.8), flower ? all(path('M-3 -1 L-2 -6 L0 -2 L2 -6 L3 -1 Z', WHITE, C.ink, 0.6), circle(0, -2, 1, YEL, null)) : '');
const fish = (x: number, y: number, s = 1, col = '#8a9a7a', flip = false) => g(`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`, path('M-8 0 C-4 -5 5 -5 8 0 C5 5 -4 5 -8 0 Z', col, C.ink, 0.9), path('M-8 0 L-13 -4 L-13 4 Z', col, C.ink, 0.9), circle(5, -1, 0.9, C.ink, null));
const boat = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, path('M-16 -6 L16 -6 L11 2 L-11 2 Z', col, C.ink, 1.2), line('M-12 -3 L12 -3', 'rgba(255,255,255,0.6)', 0.8));

// ── Birds ────────────────────────────────────────────────────────────
type BirdOpts = { body: string; back?: string; belly?: string; head?: string; bill?: string; billLen?: number; billCurve?: number; legs?: number; legCol?: string; crest?: number; neck?: number; tail?: string; eye?: string; ruff?: string; stand?: boolean };
/** A side-view bird facing right, feet at (x, y) (or the waterline when legs = 0). */
const bird = (x: number, y: number, s: number, o: BirdOpts, flip = false) => {
  const L = o.legs ?? 8, bodyY = -L - 6, nk = o.neck ?? 0, hx = 9, hy = bodyY - 6 - nk;
  const bl = o.billLen ?? 5, bc = o.billCurve ?? 0;
  return g(`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`,
    L > 0 ? line(`M-2 ${bodyY + 4} L-3 0 M2 ${bodyY + 4} L3 0 M-3 0 L-1 0 M3 0 L5 0`, o.legCol ?? '#8a7a5a', 1.4) : '',
    path(`M-12 ${bodyY - 1} L-17 ${bodyY - 3} L-16 ${bodyY + 2} Z`, o.tail ?? o.back ?? o.body, C.ink, 0.8),
    ellipse(0, bodyY, 12, 6.4, o.body, C.ink, 1.1),
    o.belly ? path(`M-9 ${bodyY + 2} C-4 ${bodyY + 7} 6 ${bodyY + 7} 11 ${bodyY + 1} C6 ${bodyY + 3} -4 ${bodyY + 4} -9 ${bodyY + 2} Z`, o.belly, null) : '',
    o.back ? path(`M-11 ${bodyY - 1} C-6 ${bodyY - 7} 6 ${bodyY - 7} 10 ${bodyY - 2} C4 ${bodyY - 3} -4 ${bodyY - 2} -11 ${bodyY - 1} Z`, o.back, null) : '',
    nk > 0 ? path(`M5 ${bodyY - 3} L${hx - 3} ${hy + 2} L${hx + 3} ${hy + 2} L10 ${bodyY - 1} Z`, o.head ?? o.body, C.ink, 0.9) : '',
    o.ruff ? path(`M${hx - 5} ${hy + 2} C${hx - 8} ${hy + 8} ${hx + 2} ${hy + 10} ${hx + 4} ${hy + 4} Z`, o.ruff, C.ink, 0.8) : '',
    circle(hx, hy, 4.6, o.head ?? o.body, C.ink, 1),
    o.crest ? line(`M${hx - 1} ${hy - 4} C${hx - 3} ${hy - 4 - o.crest} ${hx - 8} ${hy - 6 - o.crest} ${hx - 10} ${hy - 3 - o.crest}`, o.head ?? C.dark, 1.4) : '',
    line(`M${hx + 4} ${hy + 0.5} Q${hx + 4 + bl * 0.6} ${hy + 0.5 + bc * 0.3} ${hx + 4 + bl} ${hy + 1 + bc}`, o.bill ?? C.ink, 2),
    circle(hx + 1.6, hy - 1, 1, o.eye ?? C.ink, null));
};

// ── Forest cut-away (layers) ─────────────────────────────────────────
type Layer = 'träd' | 'busk' | 'fält' | 'botten';
/** A cut through a forest from the treetops to the ground; the named layer is in colour, the others are grey, and an
 * orange bracket on the right marks its height. */
const layers = (hi: Layer) => {
  const crown = (x: number, col: string) => all(rect(x - 2, 40, 4, 60, WOOD, 0.5, C.ink, 0.9), path(`M${x - 16} 44 C${x - 22} 30 ${x - 12} 10 ${x} 10 C${x + 12} 10 ${x + 22} 30 ${x + 16} 44 C${x + 8} 50 ${x - 8} 50 ${x - 16} 44 Z`, col, C.ink, 1.1));
  const tree = all(crown(20, '#5a9a40'), crown(56, '#4f8a3a'), crown(88, '#6aaa46'));
  const shrub = all(at(38, 100, 1.7, bush(0, 0, 1, '#7aa84a')), at(72, 100, 1.5, bush(0, 0, 1, '#7aa84a')), at(100, 100, 0.8, spruce(0, 0, 0.7)));
  const fieldL = all(...[8, 16, 26, 46, 54, 64, 82, 92].map((x, i) => i % 2 ? bilberry(x, 100, 1.1) : all(tuft(x, 100, 12, 5, GRASS2, 6, 1.1), bloom(x + 2, 89, 2.6, 5, i % 3 ? WHITE : YEL))));
  const bottom = all(rect(4, 98, 100, 8, MOSS, 0, null), mossBand(4, 98, 100), ...Array.from({ length: 16 }, (_, i) => line(`M${8 + i * 6} 104 l-1.6 -2.6 M${8 + i * 6} 104 l1.6 -2.6`, MOSS2, 1)));
  const pick = (l: Layer, k: Svg) => (l === hi ? k : greyed(k));
  const span: Record<Layer, [number, number]> = { träd: [10, 50], busk: [64, 100], fält: [84, 100], botten: [96, 106] };
  const [y1, y2] = span[hi];
  return all(bg(SKY), rect(4, y1 - 1, 106, y2 - y1 + 2, 'rgba(232,137,46,0.16)', 0, null), rect(4, 106, 112, 6, SOIL, 0, null), pick('träd', tree), pick('botten', bottom), pick('busk', shrub), pick('fält', fieldL), line('M4 106 L104 106', C.ink, 1), bracketV(111, y1, y2));
};

export const NATURE_ENV_MOTIFS: Record<string, Svg> = {
  // ── 2911 Barrskogar ──
  /** tallmo: a bright, open pine forest on dry sandy ground – tall pines with orange trunks standing far apart, the ground pale grey with lichen and with purple heather patches, sun overhead. */
  'nmil.tallmo': all(bg(SKY), sunG(100, 18), field(80, SAND), ...[[20, 108, 1.15], [56, 100, 1], [92, 110, 1.2], [76, 86, 0.6], [36, 86, 0.55]].map(([x, y, s]) => pine(x!, y!, s!)),
    ...[[14, 96], [44, 104], [70, 96], [104, 100], [30, 92], [84, 106]].map(([a, b], i) => blob(a!, b!, 7, LICHEN, i + 3)), heathPatch(48, 112, 18, 2), heathPatch(8, 112, 12, 5), heathPatch(96, 112, 15, 9)),
  /** ljung: a close-up of a low woody heather shrub covered with many tiny purple bell flowers along its stems, on dry ground; a bee visits it. */
  'nmil.ljung': all(bg(SKY), field(96, SAND), ...[-30, -18, -8, 0, 8, 18, 30].map((r) => rot(60, 108, r, 1, line('M0 0 L0 -50', '#6a4a30', 1.8), ...Array.from({ length: 12 }, (_, i) => all(circle(-2.4, -14 - i * 3.2, 1.9, HEATH, C.ink, 0.4), circle(2.4, -15.6 - i * 3.2, 1.9, '#c07ab8', C.ink, 0.4))), ...[-4, -8, -12].map((d) => line(`M0 ${d} l-3 -2 M0 ${d - 1} l3 -2`, DGRASS, 1)))),
    at(96, 38, 1.2, ellipse(-2, -6, 3.4, 2.4, 'rgba(255,255,255,0.8)', C.ink, 0.6), ellipse(2, -6, 3.4, 2.4, 'rgba(255,255,255,0.8)', C.ink, 0.6), ellipse(0, 0, 6, 4.6, C.yellow, C.ink, 1), path('M-2 -4.4 L-2 4.4 M2 -4.4 L2 4.4', 'none', C.ink, 1.6), circle(-6, 0, 2.4, C.dark, C.ink, 0.6))),
  /** blåbärsris: under tall dark spruce trunks the whole forest floor is covered with low green blueberry shrubs with small leaves and a few blue berries; the shrubs are bracketed in orange. */
  'nmil.blåbärsris': all(bg('#cfe3d6'), ...[16, 46, 80, 106].map((x) => all(rect(x - 2.4, 4, 4.8, 92, '#7a5a3a', 0.5, C.ink, 0.9), path(`M${x - 18} 30 L${x} 18 L${x + 18} 30 Z M${x - 20} 48 L${x} 34 L${x + 20} 48 Z`, SPRUCE, C.ink, 0.9))), field(94, MOSS2),
    ...Array.from({ length: 13 }, (_, i) => bilberry(8 + i * 8.5, 110 - (i % 2) * 2, 1.25)), bracketTop(6, 114, 80)),
  /** fältskikt: a cut-away of a forest from treetops to ground: only the low layer of blueberry shrubs, grass and small flowers at knee height is in colour, the trees, bushes and moss are grey; an orange bracket marks the low layer. */
  'nmil.fältskikt': layers('fält'),
  /** bottenskikt: the same forest cut-away, but now only the lowest layer – the green carpet of moss right on the ground – is in colour; an orange bracket marks it. */
  'nmil.bottenskikt': layers('botten'),
  /** vindfälle: after a storm, a big spruce lies fallen on the forest floor with its flat plate of roots and soil standing up in the air; other spruces still stand; grey wind streaks. */
  'nmil.vindfälle': all(bg(SKY), field(96, MOSS2), spruce(18, 100, 1.2), spruce(104, 98, 1.1), wind(30, 14, 26), wind(64, 26, 22),
    rot(32, 96, 90, 1, spruce(0, 0, 1)), ellipse(30, 82, 8, 18, SOIL, C.ink, 1.3), line('M30 70 L24 64 M36 68 L38 60 M40 80 L46 76 M26 84 L20 82 M34 92 L28 96', '#6a4a30', 1.4), ...[[32, 74], [36, 86], [28, 92]].map(([a, b]) => rock(a!, b!, 5, 3, STONE))),

  // ── 2912 Lövskogar ──
  /** ädellövskog: a rich deciduous forest of different broad-leaved trees – a wide oak, a tall grey-trunked beech and a lime – with a light green leafy canopy, white spring flowers on the ground. */
  'nmil.ädellövskog': all(bg(SKY), field(92, GRASS), oak(26, 108, 1.15), beech(62, 108, 1.4), leafTree(96, 108, 1.2, '#7ab84a'), ...[[90, 66], [98, 60], [104, 70]].map(([a, b]) => path(`M${a} ${b} c-3 -3 -3 -6 0 -5 c3 -1 3 2 0 5 Z`, '#9ad06a', C.ink, 0.5)),
    ...Array.from({ length: 12 }, (_, i) => bloom(10 + i * 9, 106 - (i % 2) * 4, 3, 6, WHITE)), bracketTop(8, 112, 8)),
  /** lövfällning: a deciduous tree in autumn with yellow and red leaves; many leaves are falling through the air and lying in a heap on the ground under it; an orange arrow points down. */
  'nmil.lövfällning': all(bg(SKY), field(100, '#c8b070'), path('M54 112 L56 70 L46 54 M56 70 L64 50 M56 80 L70 66 M58 112 Z', WOOD, C.ink, 2.4), line('M56 112 L56 70', WOOD, 5), line('M56 112 L56 70', C.ink, 0.8),
    path('M30 56 C24 44 36 30 48 34 C54 24 72 26 76 34 C88 34 90 50 82 56 C76 62 38 64 30 56 Z', '#e8a83a', C.ink, 1.2), ...[[40, 46, RED], [62, 38, YEL], [74, 50, RED], [52, 52, ORANGE]].map(([a, b, c]) => circle(a as number, b as number, 4, c as string, null)),
    ...[[24, 72, 20], [36, 84, -30], [84, 70, 40], [94, 88, -10], [70, 92, 60], [20, 96, -50], [46, 96, 10]].map(([a, b, r], i) => rot(a!, b!, r!, 1, path('M0 -4 C3 -2 3 2 0 4 C-3 2 -3 -2 0 -4 Z', i % 2 ? RED : YEL, C.ink, 0.6))),
    path('M30 112 C34 104 78 104 84 112 Z', '#d88a3a', C.ink, 1), arrow(102, 54, 102, 92, HL, 2.6)),
  /** ramslök: a damp forest floor carpeted with broad, shiny green leaves and round clusters of small white star flowers; next to it a garlic bulb and smell lines show the strong garlic smell. */
  'nmil.ramslök': all(bg('#d8ead2'), field(92, '#4f7a3a'), ...[10, 26, 42, 58, 74].map((x, i) => all(...[-24, -8, 10, 24].map((r) => rot(x, 112, r, 1, path('M0 0 C-5 -10 -5 -24 0 -32 C5 -24 5 -10 0 0 Z', '#5aaa40', C.ink, 0.8), line('M0 -2 L0 -28', '#3f8a2c', 0.6))), stalk(x + 2, 112, 40 + (i % 2) * 6, 0, GRASS2, 1.2),
    ...Array.from({ length: 7 }, (_, k) => { const a = (k / 7) * Math.PI * 2; return bloom(f1(x + 2 + Math.cos(a) * 4), f1(112 - 40 - (i % 2) * 6 + Math.sin(a) * 4), 3, 6, WHITE, '#e8e0a0', 0.4); }))),
    at(100, 72, 1.2, path('M0 -14 C-10 -10 -12 6 0 8 C12 6 10 -10 0 -14 Z', '#f4eee0', C.ink, 1.1), line('M0 -14 L0 -20 M-4 -6 C-3 0 -3 4 -2 7 M4 -6 C3 0 3 4 2 7', C.ink, 0.8), line('M-6 8 l-2 3 M0 8 l0 3 M6 8 l2 3', '#c8b890', 1)), smell(94, 52, '#9a8a40'), smell(102, 46, '#9a8a40')),
  /** buskskikt: the forest cut-away again – now only the middle layer of bushes and young trees is in colour, with the tall trees, low plants and moss grey; an orange bracket marks the bush layer. */
  'nmil.buskskikt': layers('busk'),
  /** ekollon: a big acorn drawn close – a smooth brown nut sitting in a rough little cup with a stalk – with two lobed oak leaves; a few more acorns lie on the ground and a squirrel holds one. */
  'nmil.ekollon': all(bg(SKY), field(100, '#c8b070'), rot(46, 56, -15, 2.2, path('M-6 -2 C-7 8 -3 16 0 17 C3 16 7 8 6 -2 Z', '#b07a3a', C.ink, 0.9), path('M-1 15 L0 18 L1 15', 'none', C.ink, 0.6), path('M-8 -2 C-8 -8 8 -8 8 -2 C4 0 -4 0 -8 -2 Z', '#8a6a3a', C.ink, 0.9), dots(-7, -7, 14, 6, 14, '#5a4020', 2, 0.6), line('M0 -7 L1 -11', '#6a4a20', 1.4), line('M-3 2 C-3 8 -2 11 -1 13', 'rgba(255,255,255,0.5)', 0.8)),
    ...[[84, 28, 20], [20, 30, -30]].map(([a, b, r]) => rot(a!, b!, r!, 1.3, path('M0 12 C-4 10 -6 8 -4 6 C-8 5 -8 2 -5 1 C-8 -1 -7 -5 -3 -4 C-5 -8 -2 -11 0 -12 C2 -11 5 -8 3 -4 C7 -5 8 -1 5 1 C8 2 8 5 4 6 C6 8 4 10 0 12 Z', '#5a9a3a', C.ink, 0.8), line('M0 12 L0 -10', '#3f7a2a', 0.6))),
    ...[[18, 108], [28, 106], [104, 108]].map(([a, b]) => rot(a!, b!, 70, 0.9, path('M-6 -2 C-7 8 -3 16 0 17 C3 16 7 8 6 -2 Z', '#b07a3a', C.ink, 0.9), path('M-8 -2 C-8 -8 8 -8 8 -2 C4 0 -4 0 -8 -2 Z', '#8a6a3a', C.ink, 0.9))),
    at(84, 104, 0.9, path('M10 0 C16 -10 18 -24 8 -30 C2 -32 -2 -26 2 -22 C8 -16 4 -6 6 0 Z', '#c0602a', C.ink, 1), ellipse(-4, -10, 9, 10, '#c0602a', C.ink, 1.1), circle(-8, -24, 6, '#c0602a', C.ink, 1), path('M-10 -30 L-11 -35 L-7 -31 Z', '#c0602a', C.ink, 0.8), circle(-10, -25, 1, C.ink, null), ellipse(-11, -16, 2.4, 3.2, '#b07a3a', C.ink, 0.6))),
  /** jätteek: an enormous, very old oak with a thick gnarled trunk and a huge spreading crown; three small people stand holding hands around the trunk, showing how thick it is. */
  'nmil.jätteek': all(bg(SKY), field(96, GRASS), path('M40 112 C44 96 42 80 36 70 L28 60 M36 70 C44 66 50 60 52 50 M78 112 C74 96 76 82 82 72 L92 62 M82 72 C76 66 70 60 68 50 Z', WOOD, C.ink, 1.4), path('M40 112 C44 96 42 80 38 68 C48 62 70 62 82 70 C76 82 74 96 78 112 Z', '#8a5a34', C.ink, 1.4), line('M48 80 C50 90 48 100 50 110 M66 78 C64 90 68 100 66 110 M56 74 C58 84 56 96 58 106', '#5a3a20', 1),
    path('M10 54 C2 40 14 18 34 22 C42 8 76 6 86 20 C106 18 118 38 108 54 C100 64 74 60 60 62 C44 64 18 66 10 54 Z', '#4f8a3a', C.ink, 1.4), ...[[30, 36], [56, 24], [84, 34], [100, 48], [20, 48]].map(([a, b]) => circle(a!, b!, 6, '#5f9a46', null)),
    fig(30, C.red, 'smile', { h: 0.38, bottom: C.navy }), fig(59, YEL, 'smile', { h: 0.36, hairStyle: 'long', bottom: C.navy }, 104), fig(88, C.denim, 'smile', { h: 0.38, bottom: C.navy }), line('M35 96 L52 94 M66 94 L83 96', C.skin, 2)),
  /** hålträd: a thick old tree trunk with several round holes; an owl looks out of the top hole, a woodpecker clings to the trunk beside a hole, and a bat hangs from another. */
  'nmil.hålträd': all(bg(SKY), field(100, GRASS), path('M36 112 L40 20 C40 12 80 12 80 20 L84 112 Z', '#8a6a4a', C.ink, 1.6), line('M50 24 L48 110 M66 24 L68 110', '#6a4a30', 1), path('M36 22 C30 10 48 2 60 6 C72 2 90 10 84 22 C76 18 44 18 36 22 Z', '#5a9a40', C.ink, 1.2),
    ellipse(60, 40, 9, 11, '#2b2420', C.ink, 1.4), circle(56, 40, 3.4, '#f2c14e', C.ink, 0.8), circle(64, 40, 3.4, '#f2c14e', C.ink, 0.8), circle(56, 40, 1.4, C.ink, null), circle(64, 40, 1.4, C.ink, null), path('M58 44 L60 47 L62 44 Z', ORANGE, C.ink, 0.6), path('M52 34 L54 30 L57 34 M63 34 L66 30 L68 34', '#8a6a4a', C.ink, 0.8),
    ellipse(52, 74, 6, 7, '#2b2420', C.ink, 1.2), at(42, 78, 1, ellipse(0, 0, 4, 8, '#2e2e36', C.ink, 0.9), circle(0, -9, 3.4, '#2e2e36', C.ink, 0.9), path('M0 -12 L-2 -14 L1 -13 Z', RED, null), line('M3 -9 L8 -9', C.ink, 1.4), ellipse(0, 1, 2.2, 4, WHITE, null), path('M0 8 L-1 13 L1 13 Z', '#2e2e36', C.ink, 0.6)),
    ellipse(70, 92, 5, 6, '#2b2420', C.ink, 1.2), at(70, 100, 1, line('M0 -4 L0 -2', C.ink, 1), path('M0 -2 C-6 -2 -9 4 -8 10 C-5 8 -3 9 0 12 C3 9 5 8 8 10 C9 4 6 -2 0 -2 Z', '#4a3a4a', C.ink, 0.8), circle(0, 4, 2.6, '#5a4a5a', C.ink, 0.6))),

  // ── 2913 Myrar och våtmarker ──
  /** göl: a small, round, very dark pond lying alone on an open bog, surrounded by tussocks and cottongrass, with a few spruces at the edge of the bog. */
  'nmil.göl': all(bg(SKY), field(70, '#a8b860'), spruce(14, 74, 0.6), spruce(26, 72, 0.5), spruce(104, 74, 0.6), ellipse(60, 92, 30, 11, '#2a3440', C.ink, 1.4), line('M40 88 l10 0 M66 92 l8 0', 'rgba(255,255,255,0.45)', 1.2), ...[[22, 104], [96, 104], [20, 84], [100, 86], [60, 110]].map(([a, b]) => all(path(`M${a! - 7} ${b} C${a! - 7} ${b! - 6} ${a! + 7} ${b! - 6} ${a! + 7} ${b} Z`, MOSS, C.ink, 0.9), tuft(a!, b! - 3, 7, 5, GRASS2, 6, 1))),
    ...[[30, 96], [88, 98], [46, 78], [78, 78]].map(([a, b]) => all(stalk(a!, b!, 10, 0, GRASS2, 1), circle(a!, b! - 11, 2.4, WHITE, C.ink, 0.6))), ring(60, 92, 36, 16)),
  /** sank: a boot that sinks deep into soaking wet, mossy ground with water squelching up around it in drops, next to a grey boot standing on top of firm dry ground. */
  'nmil.sank': all(bg(), rect(6, 74, 56, 38, '#5a7a3a', 2, C.ink, 1.2), path('M6 74 Q20 70 34 74 Q48 78 62 74', 'none', MOSS, 3), ellipse(34, 82, 22, 5, WATER2, C.ink, 0.8),
    rect(25, 12, 16, 36, C.navy, 2, C.ink, 1.2), path('M24 44 L42 44 L42 84 L24 84 Z', '#3f6a3a', C.ink, 1.3), rect(22, 42, 22, 5, '#2f5a2a', 1, C.ink, 1.1), path('M6 84 Q20 78 34 84 Q48 88 62 82 L62 112 L6 112 Z', '#5a7a3a', null), path('M8 84 Q20 78 34 84 Q48 88 60 82', 'none', MOSS, 3), ...[[18, 70], [50, 68], [14, 78], [54, 76], [30, 66]].map(([a, b]) => path(`M${a} ${b! - 4} C${a! + 3} ${b} ${a! + 2} ${b! + 3} ${a} ${b! + 3} C${a! - 2} ${b! + 3} ${a! - 3} ${b} ${a} ${b! - 4} Z`, WATER, C.ink, 0.8)), arrow(48, 36, 48, 60, HL, 2.6),
    greyed(rect(66, 82, 48, 30, '#b8a080', 2, C.ink, 1.2), rect(77, 14, 16, 36, C.navy, 2, C.ink, 1.2), path('M76 46 L76 82 L106 82 C108 76 104 72 98 72 L94 72 L94 46 Z', '#4a6a3a', C.ink, 1.3), rect(74, 44, 22, 5, '#2f5a2a', 1, C.ink, 1.1))),
  /** storspov: a large brown, streaked wading bird with long legs and a very long bill curving downwards, standing on a bog among tussocks; sound arcs show its call. */
  'nmil.storspov': all(bg(SKY), field(88, '#a8b860'), ...[[16, 104], [100, 106], [28, 92]].map(([a, b]) => all(path(`M${a! - 8} ${b} C${a! - 8} ${b! - 7} ${a! + 8} ${b! - 7} ${a! + 8} ${b} Z`, MOSS, C.ink, 0.9), tuft(a!, b! - 3, 8, 5, GRASS2, 6, 1))),
    bird(44, 104, 2.3, { body: '#a88a5a', back: '#8a6a3a', belly: '#e8dcc0', head: '#a88a5a', bill: '#5a4a3a', billLen: 13, billCurve: 7, legs: 12, legCol: '#7a8a9a', neck: 4 }), dots(24, 56, 30, 14, 26, '#5a4020', 4, 0.8), sound(100, 22)),
  /** vadarfågel: in shallow water and on wet mud, three different long-legged birds wade and probe with their long bills; an orange bracket groups them. */
  'nmil.vadarfågel': all(bg(SKY), rect(4, 82, 112, 30, '#9a8a6a', 0, null), path('M4 92 C30 88 70 96 116 90 L116 112 L4 112 Z', WATER, C.ink, 0.8), ripples(16, 100, 20), ripples(70, 104, 24),
    bird(22, 98, 1.4, { body: '#a88a5a', back: '#8a6a3a', belly: '#e8dcc0', bill: '#5a4a3a', billLen: 14, billCurve: 6, legs: 13, legCol: '#7a8a9a', neck: 3 }),
    bird(56, 104, 1.4, { body: WHITE, back: '#2e2e36', head: '#2e2e36', bill: '#e8602a', billLen: 9, legs: 9, legCol: '#e88a8a' }),
    rot(86, 102, 20, 1.1, bird(0, 0, 1, { body: '#c8b8a0', back: '#9a8a70', belly: WHITE, bill: C.ink, billLen: 11, legs: 13, legCol: '#5a5a40', neck: 2 })), bracketTop(8, 112, 28)),

  // ── 2914 Livet i sjöar och vattendrag ──
  /** strandzon: a cut-away of a lake from the shore outwards; the shallow strip nearest the shore, with reeds, water lilies, small fish and sunlight reaching the bottom, is bracketed in orange, while the deep water further out is dark and empty. */
  'nmil.strandzon': all(bg(SKY), sunG(20, 16), path('M4 52 L30 52 L116 52 L116 112 L4 112 Z', WATER, null), path('M58 52 L116 52 L116 112 L80 112 Z', WATER2, null), path('M4 46 L18 46 C30 56 44 70 60 82 C76 94 96 104 116 108 L116 112 L4 112 Z', '#b0905a', C.ink, 1.2), path('M4 46 L18 46', 'none', C.ink, 1.2),
    rect(4, 40, 14, 8, GRASS, 0, null), line('M4 52 L116 52', C.ink, 1), ...[24, 28, 32, 36].map((x, i) => reed(x, 60 + i * 2, 24 + (i % 2) * 4)), lily(46, 52, 1), lily(56, 52, 0.9, false), fish(40, 72, 0.8, '#8a9a7a'), line('M30 30 L40 70 M40 30 L48 74', 'rgba(242,193,78,0.7)', 1.4, '3 3'), bracketTop(18, 62, 36)),
  /** vattenloppa: a magnifying lens over a drop of lake water shows a water flea – a tiny see-through oval body with a dark eye, a curled tail spine and big branched antennae for swimming. */
  'nmil.vattenloppa': all(bg(SKY), rect(4, 70, 112, 42, WATER, 0, null), line('M4 70 L116 70', C.ink, 1), ...[[16, 90], [28, 100], [96, 96], [104, 84], [20, 80]].map(([a, b]) => circle(a!, b!, 1.2, '#5a7a9a', null)),
    lens(56, 52, 34, all(rect(20, 16, 72, 72, '#d8eef8', 0, null), at(56, 54, 1.6, path('M-8 -12 C4 -16 14 -6 12 6 C10 14 0 16 -8 10 C-14 4 -14 -8 -8 -12 Z', 'rgba(220,200,150,0.55)', C.ink, 1), path('M-4 -6 C2 -8 6 -2 4 4 C2 8 -4 6 -6 2 C-6 -2 -6 -4 -4 -6 Z', '#9ab86a', null), circle(-9, -9, 2.6, C.ink, null), path('M10 10 C14 14 16 18 20 18', 'none', C.ink, 1),
      path('M-10 -12 C-16 -20 -22 -22 -26 -18 M-16 -19 C-18 -26 -22 -28 -26 -28 M-16 -19 L-26 -12', 'none', C.ink, 1.2), ...[[-26, -18], [-26, -28], [-26, -12]].map(([a, b]) => line(`M${a} ${b} l-3 -1 M${a} ${b} l-3 2`, C.ink, 0.8)))), 'nVl')),
  /** skäggdopping: a slim grebe with a long thin white neck floats on a lake; on its head it has an orange-brown ruff and black ear tufts, and a striped chick rides on its back among reeds. */
  'nmil.skäggdopping': all(bg(SKY), rect(4, 80, 112, 32, WATER, 0, null), line('M4 80 L116 80', C.ink, 1), ...[8, 12, 16, 104, 108, 112].map((x, i) => reed(x, 84, 30 + (i % 3) * 6, (i % 2) * 2)), ripples(30, 92, 20), ripples(70, 96, 22),
    at(60, 84, 2, path('M-16 0 C-14 -8 8 -8 12 -2 C12 2 -12 4 -16 0 Z', '#7a6a5a', C.ink, 1), path('M6 -4 C7 -12 6 -18 8 -22 L12 -22 C11 -16 12 -10 12 -3 Z', WHITE, C.ink, 0.9), ellipse(10, -21, 5.4, 4.4, '#c8602a', C.ink, 0.7), circle(10, -23, 3, WHITE, C.ink, 0.8), path('M8 -25 L5 -30 L10 -26 M11 -26 L12 -31 L13 -25', '#2e2e36', C.ink, 0.6), line('M13 -23 L19 -22', '#c86a7a', 1.4), circle(11, -24, 0.8, RED, null),
      ellipse(-6, -8, 4, 2.6, '#e8e0d0', C.ink, 0.6), line('M-9 -9 l6 0 M-9 -7 l6 0', C.ink, 0.5), circle(-2, -10, 1.6, '#e8e0d0', C.ink, 0.5))),
  /** sjöbotten: a cut-away of a lake – grey-blue water above and, ringed in orange, the bottom of the lake with stones, mud, a mussel, water plants rooted in it and a worm; a small fish swims above. */
  'nmil.sjöbotten': all(bg(SKY), path('M4 34 L116 34 L116 112 L4 112 Z', WATER, null), line('M4 34 L116 34', C.ink, 1), path('M4 88 C30 84 50 92 70 88 C90 84 104 90 116 88 L116 112 L4 112 Z', '#7a6040', C.ink, 1.3), dots(4, 92, 112, 20, 60, '#5a4028', 6, 0.8),
    rock(30, 94, 14, 8, STONE), rock(84, 92, 12, 7, STONE2), ellipse(58, 94, 6, 3, '#4a4a5a', C.ink, 0.8), line('M96 98 q3 -3 6 0 q3 3 6 0', '#c87a7a', 1.6), ...[[16, 90], [44, 90], [70, 90]].map(([a, b]) => all(stalk(a!, b!, 26, 4, '#5a9a3a', 1.4), stalk(a! + 3, b!, 20, -4, '#5a9a3a', 1.4))), fish(60, 54, 1, '#8a9a7a'), ring(60, 98, 54, 14)),
  /** stillastående: a perfectly still, mirror-smooth pond in colour, with a tree reflected upside down in it and no movement, next to a small grey stream where the water rushes past in arrows and waves. */
  'nmil.stillastående': all(bg(), ellipse(36, 84, 30, 14, WATER, C.ink, 1.3), leafTree(36, 70, 0.7), '<clipPath id="nStl"><ellipse cx="36" cy="84" rx="29" ry="13"/></clipPath><g clip-path="url(#nStl)">' + g('translate(0 140) scale(1 -1)', leafTree(36, 70, 0.7, '#9ac8a0', '#a8b8c0')) + '</g>', ellipse(36, 84, 30, 14, 'rgba(140,199,232,0.35)', null), line('M16 84 L56 84', 'rgba(255,255,255,0.7)', 1),
    greyed(path('M72 112 C78 90 86 70 92 40 L110 40 C106 70 100 92 102 112 Z', WATER2, C.ink, 1.2), line('M88 56 q4 -3 8 0 q4 3 8 0 M84 76 q4 -3 8 0 q4 3 8 0 M80 96 q4 -3 8 0 q4 3 8 0', WHITE, 1.4), arrow(100, 46, 92, 104, C.ink, 2))),
  /** siktdjup: a person in a small boat lowers a white disc on a marked rope into a lake; deep down the disc fades away, and an orange line and a measuring scale beside it show how deep it is still visible. */
  'nmil.siktdjup': all(bg(SKY), rect(4, 44, 112, 68, WATER, 0, null), path('M4 76 L116 76 L116 112 L4 112 Z', 'rgba(63,134,192,0.45)', null), line('M4 44 L116 44', C.ink, 1), boat(40, 44, 1.2, C.red), fig(40, '#4f9d69', 'calm', { h: 0.36, bottom: C.navy }, 38), reach(40, 0.36, 1, 54, 22, 38),
    line('M54 22 L56 40 L56 82', C.ink, 1), ...[50, 58, 66, 74].map((y) => line(`M54.5 ${y} L57.5 ${y}`, RED, 1.6)), ellipse(56, 84, 8, 2.6, 'rgba(251,251,248,0.75)', C.ink, 0.9), line('M48 84 L52 84 M60 84 L64 84', 'rgba(43,42,51,0.5)', 0.8),
    rect(90, 44, 8, 56, WHITE, 1, C.ink, 1), ...[0, 1, 2, 3, 4, 5, 6].map((i) => line(`M90 ${44 + i * 8} L94 ${44 + i * 8}`, C.ink, 1)), line('M64 84 L90 84', HL, 2, '3 2'), arrow(104, 46, 104, 82, HL, 2.4)),

  // ── 2915 Kust och hav ──
  /** bräckt vatten: a light blue river flows from the land into a blue-green sea; where they meet the colours mix in swirls, and in front a fresh-water drop plus a salty sea drop becomes one mixed drop. */
  'nmil.bräckt-vatten': all(bg(SKY), path('M4 34 L60 34 C56 46 66 52 62 64 L4 64 Z', GRASS, C.ink, 1), path('M4 64 L116 34 L116 76 L4 76 Z', SEA, null), path('M4 34 L20 34 C24 44 16 52 26 64 L4 64 Z', 'none', null),
    path('M14 34 C18 42 26 46 32 52 C38 58 48 60 58 62', 'none', WATER, 8), path('M14 34 C18 42 26 46 32 52 C38 58 48 60 58 62', 'none', C.ink, 0.6), path('M52 60 C62 56 70 64 80 58 C88 54 96 60 104 54', 'none', '#7ab8c8', 6), line('M60 62 q6 -4 12 0 M78 58 q6 -4 12 0', WHITE, 1.2), rect(4, 76, 112, 36, PAPER, 0, null),
    path('M16 88 C20 94 20 100 16 102 C12 100 12 94 16 88 Z', WATER, C.ink, 1), path('M42 88 C46 94 46 100 42 102 C38 100 38 94 42 88 Z', SEA2, C.ink, 1), ...[[40, 96], [43, 98], [41, 100]].map(([a, b]) => rect(a!, b!, 1.6, 1.6, WHITE, 0, null)), line('M26 96 L32 96 M29 93 L29 99', C.ink, 1.6), line('M50 94 L58 94 M50 98 L58 98', C.ink, 1.6),
    path('M74 84 C80 92 80 102 74 106 C68 102 68 92 74 84 Z', '#6ab0c0', C.ink, 1.2), ring(74, 96, 12, 14), ring(62, 60, 14, 8)),
  /** fågelskär: a small bare rock islet in the sea, covered with many white seabirds sitting and flying around it; a boat passes at a distance. */
  'nmil.fågelskär': all(bg(SKY), rect(4, 70, 112, 42, SEA, 0, null), line('M4 70 L116 70', C.ink, 1), boat(100, 70, 0.6, C.red), path('M24 82 C30 60 50 52 64 56 C80 58 92 70 96 82 Z', STONE, C.ink, 1.4), path('M36 64 C44 60 56 60 62 62', 'none', WHITE, 2),
    ...[[36, 70], [46, 64], [56, 62], [66, 66], [76, 72], [44, 76], [62, 76], [84, 78], [52, 70]].map(([a, b], i) => at(a!, b!, 0.5, ellipse(0, 0, 6, 3.6, WHITE, C.ink, 1), circle(5, -3, 2.6, WHITE, C.ink, 0.9), line('M7 -3 L10 -2', i % 3 ? YEL : ORANGE, 1.4), path('M-6 -1 L-4 -3 L2 -2 Z', '#9aa3ad', null))),
    ...[[24, 34], [44, 24], [70, 30], [92, 40], [58, 42]].map(([a, b]) => line(`M${a! - 6} ${b} q3 -4 6 0 q3 -4 6 0`, C.ink, 1.4)), ring(60, 70, 40, 18)),
  /** strandäng: a flat, low green meadow right by the sea shore with the blue sea behind, a few puddles in the grass, and cows grazing on it. */
  'nmil.strandäng': all(bg(SKY), rect(4, 48, 112, 16, SEA, 0, null), line('M4 48 L116 48', C.ink, 1), path('M4 62 C30 60 80 64 116 60 L116 112 L4 112 Z', '#9ac86a', C.ink, 1), lawn(112, GRASS2, 4, 4), ellipse(30, 74, 10, 3, WATER, C.ink, 0.8), ellipse(86, 70, 8, 2.4, WATER, C.ink, 0.8),
    ...[[30, 104, 0.8, false], [78, 98, 0.7, true]].map(([x, y, s, fl]) => g(`translate(${x} ${y}) scale(${fl ? -(s as number) : s} ${s})`, ...[-12, -6, 8, 13].map((d) => rect(d - 2, -8, 4, 8, C.white, 1, C.ink, 1)), ellipse(0, -14, 17, 8, C.white, C.ink, 1.3), ellipse(-5, -15, 5, 3.5, C.dark, null), ellipse(7, -12, 4, 3, C.dark, null), path('M14 -14 L24 -6 L22 0 L16 -4 Z', C.white, C.ink, 1.2), circle(20, -6, 0.8, C.ink, null))),
    ...[[56, 82], [100, 88], [14, 90]].map(([a, b]) => bloom(a!, b!, 3, 5, '#d08ab8'))),
  /** strandskata: a black and white bird with a long, straight, bright orange-red bill and pink-red legs, standing on stones at the water's edge. */
  'nmil.strandskata': all(bg(SKY), rect(4, 76, 112, 36, SEA, 0, null), line('M4 76 L116 76', C.ink, 1), path('M4 100 C40 94 80 96 116 100 L116 112 L4 112 Z', SAND, C.ink, 1), ...[[20, 106, 12, 7], [90, 108, 14, 8], [104, 104, 8, 5]].map(([a, b, w, h]) => rock(a!, b!, w!, h!)),
    bird(50, 106, 2.3, { body: WHITE, back: '#2e2e36', head: '#2e2e36', tail: '#2e2e36', bill: '#f0602a', billLen: 12, legs: 9, legCol: '#e8808a', eye: RED, neck: 2 })),
  /** blåstång: underwater, brown seaweed grows from a rock; its flat forked fronds have a midrib and pairs of round air bladders, ringed in orange; a small fish swims past. */
  'nmil.blåstång': all(bg(SEA), rect(4, 4, 112, 10, '#8ac8d8', 0, null), rock(56, 112, 70, 18, STONE2), ...[-30, -6, 18].map((r, k) => rot(50 + k * 8, 96, r, 1, path('M0 0 C-2 -20 2 -40 -2 -60', 'none', BROWNWEED, 5), path('M0 -30 C6 -36 10 -44 10 -54 M-1 -46 C-8 -52 -10 -58 -8 -66', 'none', BROWNWEED, 4.4), line('M0 0 C-2 -20 2 -40 -2 -60', '#6a5420', 0.8),
    ...[[-2, -20], [-1, -40], [8, -46], [-7, -58]].map(([a, b]) => all(circle(a! - 3, b!, 2.6, '#b8963a', C.ink, 0.7), circle(a! + 3, b!, 2.6, '#b8963a', C.ink, 0.7))))), ring(57, 54, 10, 10), fish(96, 40, 1, '#7a8a6a', true), line('M20 20 q2 -3 4 0 M100 70 q2 -3 4 0', WHITE, 1)),
  /** tångbälte: a cut-away along a rocky shore under water; a dense belt of brown seaweed grows on the rocks at one depth, bracketed in orange, with fish among it; above it the bright surface, below it deeper dark water. */
  'nmil.tångbälte': all(bg(SKY), rect(4, 24, 112, 88, SEA, 0, null), path('M4 76 L116 76 L116 112 L4 112 Z', SEA2, null), line('M4 24 L116 24', C.ink, 1), path('M4 20 L22 20 C30 40 50 60 70 80 C84 94 100 104 116 108 L116 112 L4 112 Z', STONE2, C.ink, 1.2),
    ...Array.from({ length: 10 }, (_, i) => { const x = 22 + i * 5, y = 38 + i * 4.6; return all(path(`M${x} ${y} C${x + 3} ${y - 6} ${x + 1} ${y - 12} ${x + 4} ${y - 18}`, 'none', BROWNWEED, 3.4), circle(x + 3, y - 10, 1.6, '#b8963a', C.ink, 0.5)); }), fish(66, 46, 0.8, '#9a9a6a', true), fish(84, 66, 0.7, '#9a9a6a'),
    line('M16 38 L60 92', HL, 2.4), line('M12 42 L20 34 M56 96 L64 88', HL, 2.4)),
  /** sillgrissla: on narrow ledges of a steep sea cliff, many upright dark brown and white seabirds stand tightly side by side like small figures; one is drawn large in front with its pointed bill. */
  'nmil.sillgrissla': all(bg(SKY), rect(4, 96, 112, 16, SEA, 0, null), path('M4 12 L60 12 L66 112 L4 112 Z', '#9a8a7a', C.ink, 1.3), ...[34, 58, 82].map((y) => path(`M4 ${y} L${60 + y * 0.06} ${y} L${60 + y * 0.06} ${y + 4} L4 ${y + 4} Z`, '#b8a898', C.ink, 1)),
    ...[34, 58, 82].map((y) => all(...[10, 20, 30, 40, 50].map((x) => at(x, y, 0.55, ellipse(0, -10, 5, 10, '#3a3030', C.ink, 0.9), ellipse(1.6, -8, 3, 7, WHITE, null), circle(0, -21, 3.6, '#3a3030', C.ink, 0.9), line('M3 -21 L8 -20', C.ink, 1.4))))),
    at(90, 104, 1.8, ellipse(0, -14, 8, 14, '#3a3030', C.ink, 1.2), ellipse(2.4, -11, 4.6, 10, WHITE, null), circle(0, -30, 5.4, '#3a3030', C.ink, 1.1), path('M4 -31 L13 -29 L4 -28 Z', C.ink, C.ink, 0.8), circle(2, -31.5, 1, WHITE, null), line('M-2 0 L-3 2 M2 0 L3 2', '#3a3030', 1.6), path('M-7 -18 C-10 -12 -10 -6 -6 -2', 'none', C.ink, 1))),

  // ── 2916 Fjäll och tundra ──
  /** vindpinad: on a bare hilltop, a small crooked tree is bent hard to one side by strong grey wind streaks, with only a few leaves left; beside it, in grey, the same tree stands straight and full in calm air. */
  'nmil.vindpinad': all(bg(SKY), path('M4 112 C10 80 40 70 64 76 L64 112 Z', '#9aa880', C.ink, 1.2), path('M34 76 C36 64 44 56 58 50 M40 66 C48 64 54 62 60 60', 'none', '#6a4a30', 3), ellipse(56, 50, 9, 4, '#6a9a4a', C.ink, 0.9), ellipse(60, 59, 6, 3, '#6a9a4a', C.ink, 0.9), wind(6, 30, 30, C.dark), wind(10, 52, 26, C.dark), wind(4, 72, 18, C.dark), arrow(8, 44, 40, 44, C.dark, 2),
    greyed(path('M68 112 C74 96 96 92 116 96 L116 112 Z', '#9aa880', C.ink, 1.2), leafTree(92, 96, 1.1))),
  /** lavin: a huge mass of snow slides down a steep mountain slope in a cloud of white powder, towards a few small trees at the bottom; orange arrows show the snow rushing down. */
  'nmil.lavin': all(bg(SKY), path('M4 112 L4 70 L36 16 L54 36 L116 100 L116 112 Z', '#b0bcc8', C.ink, 1.4), path('M26 34 L36 16 L46 28 Z', SNOW, C.ink, 1), path('M38 30 C50 34 56 46 70 56 C84 66 90 80 100 94 C86 98 70 92 60 82 C50 72 42 56 38 30 Z', SNOW, C.ink, 1.2),
    ...[[92, 90, 10], [80, 84, 9], [100, 98, 8], [70, 76, 8]].map(([a, b, r]) => circle(a!, b!, r!, WHITE, C.ink, 1)), spruce(104, 112, 0.5), spruce(112, 112, 0.45), spruce(16, 112, 0.5), arrow(52, 46, 72, 66, HL, 2.6), arrow(70, 68, 88, 86, HL, 2.6)),
  /** fjällripa: a plump grouse-like bird in white winter plumage sits in the snow, with feathered white feet, a black tail edge, a small black bill and a red comb over the eye; a small inset shows the same bird brown-grey in summer. */
  'nmil.fjällripa': all(bg('#e4ecf2'), rect(4, 86, 112, 26, SNOW, 0, C.ink, 1), ...[[54, 18], [80, 10], [104, 22], [96, 44], [50, 46]].map(([a, b]) => flake(a!, b!, 3)),
    at(66, 96, 2, path('M-16 -4 L-20 -2 L-16 0 Z', '#2e2e36', C.ink, 0.8), ellipse(0, -8, 14, 9, WHITE, C.ink, 1.2), circle(10, -18, 6, WHITE, C.ink, 1.1), path('M15 -18 L19 -17 L15 -16 Z', C.ink, C.ink, 0.6), path('M8 -23 C10 -26 13 -25 13 -22 Z', RED, C.ink, 0.5), circle(11.5, -19.5, 0.9, C.ink, null), line('M8 -20 L14 -20', C.ink, 0.8), ellipse(-2, 1, 3, 2, WHITE, C.ink, 0.7), ellipse(4, 1, 3, 2, WHITE, C.ink, 0.7)),
    rect(8, 8, 32, 30, '#e8e0c8', 3, C.ink, 1.2), at(24, 32, 1, ellipse(0, -8, 10, 6.4, '#8a7a5a', C.ink, 1), dots(-8, -13, 16, 10, 12, '#5a4a30', 8, 0.7), circle(7, -15, 4.2, '#8a7a5a', C.ink, 0.9), path('M10.5 -15 L13 -14.5 L10.5 -14 Z', C.ink, null), path('M5 -19 C6 -21 8 -20 8 -18 Z', RED, null), ellipse(0, 0, 6, 1.4, '#9ab060', null)), sunG(34, 14, 3)),
  /** ljungpipare: a plover with a golden-spotted brown back, a black face and belly bordered with white, standing upright on a mountain heath with lichen; sound arcs show its call. */
  'nmil.ljungpipare': all(bg(SKY), path('M4 64 L30 36 L50 54 L76 30 L116 62 L116 66 L4 66 Z', '#b0bcc8', C.ink, 1.1), rect(4, 64, 112, 48, '#a88a4a', 0, null), line('M4 64 L116 64', C.ink, 1), dots(4, 70, 112, 40, 80, '#7a5a2a', 9, 1.1), ...[[20, 96], [92, 100], [100, 80]].map(([a, b], i) => blob(a!, b!, 6, LICHEN, i + 5)),
    bird(58, 104, 2.6, { body: '#2e2e36', back: '#a8823a', belly: '#2e2e36', head: '#a8823a', bill: C.ink, billLen: 4, legs: 8, legCol: '#4a4a4a' }), dots(36, 66, 40, 10, 30, YEL, 3, 1), sound(100, 28)),

  // ── 2917 Odlingslandskap ──
  /** betesdjur: on a green pasture a cow, a sheep and a horse graze with their heads down, grouped by an orange bracket above them. */
  'nmil.betesdjur': all(bg(SKY), field(78, GRASS), lawn(112, GRASS2, 4, 4),
    at(26, 104, 0.7, ...[-12, -6, 8, 13].map((d) => rect(d - 2, -8, 4, 8, C.white, 1, C.ink, 1)), ellipse(0, -14, 17, 8, C.white, C.ink, 1.3), ellipse(-5, -15, 5, 3.5, C.dark, null), path('M14 -14 L24 -6 L22 0 L16 -4 Z', C.white, C.ink, 1.2), line('M16 -14 L17 -18', C.ink, 1.2), circle(20, -6, 0.8, C.ink, null)),
    at(60, 106, 0.8, ...[-8, -3, 4, 9].map((d) => line(`M${d} -6 L${d} 0`, C.dark, 2)), ellipse(0, -10, 12, 7, '#f0ece0', C.ink, 1.2), ...Array.from({ length: 7 }, (_, i) => circle(-9 + i * 3, -15, 2.4, '#f0ece0', C.ink, 0.6)), path('M10 -10 L17 -2 L14 1 L9 -5 Z', C.dark, C.ink, 1), circle(14, -3, 0.7, WHITE, null)),
    at(94, 106, 0.75, ...[-12, -7, 8, 13].map((d) => rect(d - 1.6, -14, 3.2, 14, '#8a5a34', 1, C.ink, 0.9)), ellipse(0, -18, 17, 8, '#8a5a34', C.ink, 1.3), path('M13 -22 L20 -8 L26 -2 L22 2 L14 -6 L10 -16 Z', '#8a5a34', C.ink, 1.2), path('M12 -24 C16 -20 18 -14 18 -10', 'none', '#3a2a20', 2.4), path('M-17 -18 C-22 -14 -22 -6 -20 -2', 'none', '#3a2a20', 2.6), circle(22, -4, 0.8, C.ink, null)),
    bracketTop(8, 112, 66)),
  /** gärdsgård: an old-style wooden fence crosses a meadow: long thin poles lie diagonally side by side between pairs of upright posts tied together, all of grey weathered wood. */
  'nmil.gärdsgård': all(bg(SKY), field(70, GRASS), lawn(112, GRASS2, 4, 5), ...[14, 40, 66, 92, 116].map((x) => line(`M${x - 2} 104 L${x - 6} 52 M${x + 2} 104 L${x - 2} 52`, '#7a6a5a', 2.6)),
    ...Array.from({ length: 11 }, (_, i) => { const x = 6 + i * 10; return all(line(`M${x} 100 L${x + 24} 60`, '#a89a88', 3.4), line(`M${x} 100 L${x + 24} 60`, C.ink, 0.6)); }), ...[14, 40, 66, 92].map((x) => line(`M${x - 6} 62 L${x + 2} 62 M${x - 4} 80 L${x + 4} 80`, '#6a5a3a', 1.6)), rect(110, 40, 6, 72, SKY, 0, null), rect(110, 70, 6, 42, GRASS, 0, null)),
  /** odlingsröse: at the edge of a ploughed field lies a big heap of grey field stones with a little birch growing on it; a farmer carries one more stone from the field to the heap, shown by an orange arrow. */
  'nmil.odlingsröse': all(bg(SKY), rect(4, 76, 112, 36, '#a07a50', 0, null), ...[84, 92, 100, 108].map((y) => line(`M4 ${y} L116 ${y - 4}`, '#7a5a38', 1.4)), line('M4 76 L116 76', C.ink, 1),
    ...[[78, 94, 14, 10], [94, 96, 14, 11], [86, 84, 14, 10], [104, 94, 10, 8], [70, 98, 10, 7], [96, 82, 10, 8], [86, 74, 10, 8]].map(([a, b, w, h], i) => rock(a!, b!, w!, h!, i % 2 ? STONE : STONE2)), at(90, 72, 0.6, path('M-1 0 L-1 -24 L1 -24 L1 0 Z', WHITE, C.ink, 0.8), ellipse(0, -28, 8, 9, '#8cc04a', C.ink, 0.9)),
    fig(28, '#4f9d69', 'calm', { h: 0.72, bottom: '#4a5a3a' }), rock(42, 62, 12, 9, STONE), reach(28, 0.72, 1, 38, 60), reach(28, 0.72, -1, 46, 60), arrow(50, 54, 70, 66, HL, 2.4)),
  /** åkerholme: a wide yellow-brown field with, in its middle, a small island of trees, bushes and grey rocks – like a little green island in a sea of crops – ringed in orange. */
  'nmil.åkerholme': all(bg(SKY), rect(4, 52, 112, 60, '#e2c25a', 0, null), line('M4 52 L116 52', C.ink, 1), ...[64, 76, 90, 104].map((y) => line(`M4 ${y} L116 ${y}`, '#c8a040', 1.2)), leafTree(16, 52, 0.5), leafTree(100, 52, 0.45),
    path('M30 92 C30 76 90 74 92 90 C92 98 30 100 30 92 Z', '#7ab05a', C.ink, 1.2), leafTree(48, 88, 1, '#4f8a3a'), spruce(66, 88, 0.8), leafTree(80, 88, 0.8, '#5a9a40'), rock(40, 94, 10, 6), rock(84, 94, 8, 5), bush(58, 94, 0.6), ring(61, 76, 38, 26)),
  /** tofsvipa: a black and white bird with a long, thin curled crest sticking up from the back of its head and a dark green-shiny back, standing on a spring field; another flies above with broad rounded wings. */
  'nmil.tofsvipa': all(bg(SKY), field(84, '#9a8a5a'), ...[92, 100, 108].map((y) => line(`M4 ${y} L116 ${y}`, '#7a6a40', 1.2)), ...[20, 40, 90, 104].map((x) => tuft(x, 90, 5, 3, '#6aba4a', 5, 1.1)),
    bird(56, 108, 2.6, { body: WHITE, back: '#2f5a4a', head: '#2e2e36', tail: '#2e2e36', bill: C.ink, billLen: 3.6, legs: 8, legCol: '#c87a7a', crest: 7 }),
    at(92, 26, 1, path('M0 0 C-8 -10 -18 -10 -22 -4 C-16 -6 -8 -2 0 0 C8 -2 16 -6 22 -4 C18 -10 8 -10 0 0 Z', '#2e2e36', C.ink, 0.8), ellipse(0, 1, 5, 3, WHITE, C.ink, 0.6), circle(5, -1, 2, '#2e2e36', null))),
};
