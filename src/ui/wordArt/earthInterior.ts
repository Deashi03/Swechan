/**
 * Natur & geografi → Landskap & geologi → Jordens inre, 2521–2527 (0.42): the crust, the mantle and the core,
 * tectonic plates, continental drift, earthquakes and faults, volcanoes and magma, and mountain building.
 * Recurring signs: a globe with a quarter cut away for the layers (brown crust, orange mantle, amber outer core,
 * yellow inner core), side cross-sections with sky and sea on top, dark grey oceanic and tan continental crust,
 * red magma, and an orange highlight ring on the thing that the word names. Processes are shown with arrows.
 * Digits only; no words, no brands, no pointing fingers. Abstract words are small symbolic scenes with a grey
 * reference beside them as contrast.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { type Build } from './figures';
import { HL, arm, cup } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const SKY = '#e2eff8';
const SPACE = '#24304f';
const SEA = '#5fa3d0';
const SEA2 = '#3c7fb0';
const DEEP = '#2f5f8f';
const LAND = '#8cc96a';
const LAND2 = '#5f9e48';
const CRUST = '#a0673d';
const CONT = '#d2a679';
const OCRUST = '#5d6370';
const MANTLE = '#e0743a';
const MANTLE2 = '#c9582c';
const OUTER = '#f2a93a';
const INNER = '#f8dc4c';
const MAGMA = '#e2402a';
const LAVA = '#f2752a';
const ROCK = '#9a8a78';
const ROCK2 = '#7a6c5c';
const BASALT = '#3e3c44';
const SNOW = '#f7f8fa';
const SAND = '#e9d5a1';
const STEAM = '#eef1f4';
const ASH = '#7d7a80';
const WOOD = '#a0673d';
const WOOD2 = '#7a4a26';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const num = (x: number, y: number, n: string, size = 9, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${n}</text>`;

// ── Scenery ──────────────────────────────────────────────────────────
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const field = (y = 96, col: string = LAND) => rect(4, y, 112, 112 - y, col, 0, null);
const waves = (x1: number, x2: number, y: number, col = SEA2) => line(range(Math.max(1, Math.floor((x2 - x1) / 10))).map((i) => `M${x1 + i * 10} ${y} q2.5 -2.5 5 0 t5 0`).join(' '), col, 1.1);
const cloud = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', col, C.ink, 1.2));
const tree = (x: number, y = 112, s = 1, col: string = LAND2) => at(x, y, s, rect(-2, -14, 4, 14, C.brown, 1, C.ink, 1), circle(0, -20, 9, col, C.ink, 1.2));
const house = (x: number, y: number, s = 1, col: string = '#e8d9c0', roof: string = '#b84a3a') => at(x, y, s, rect(-9, -12, 18, 12, col, 0, C.ink, 1.1), path('M-11 -12 L0 -21 L11 -12 Z', roof, C.ink, 1.1), rect(-2.5, -7, 5, 7, C.dark, 0, null));
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.4);
const ban = (x: number, y: number, r = 7, w = 2.4) => all(circle(x, y, r, 'none', C.red, w), line(`M${f1(x - r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r * 0.7)} ${f1(y - r * 0.7)}`, C.red, w));
const okC = (x: number, y: number, r = 7) => all(circle(x, y, r, '#3a9a5a', C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, f1(r * 0.24)));
const shake = (x: number, y: number, h = 10, col: string = C.ink) => line(`M${x} ${y} l-2 ${h / 4} l4 ${h / 4} l-4 ${h / 4} l2 ${h / 4}`, col, 1.3);
const steam = (x: number, y: number, s = 1) => at(x, y, s, path('M0 0 C-4 -6 4 -10 0 -16 C-4 -22 4 -26 0 -32', 'none', C.white, 3.4), path('M0 0 C-4 -6 4 -10 0 -16 C-4 -22 4 -26 0 -32', 'none', '#c9ced4', 1));
const smoke = (x: number, y: number, s = 1, col: string = '#b9b6bd') => at(x, y, s, circle(0, -6, 7, col, C.ink, 1), circle(6, -14, 9, col, C.ink, 1), circle(-2, -24, 11, col, C.ink, 1), circle(8, -34, 12, col, C.ink, 1));
const thermo = (x: number, y: number, hot = true) => all(rect(x - 2.5, y - 22, 5, 22, C.white, 2.5, C.ink, 1.1), rect(x - 1.2, hot ? y - 19 : y - 7, 2.4, hot ? 19 : 7, hot ? C.red : '#5aa7d6', 1, null), circle(x, y + 2, 4, hot ? C.red : '#5aa7d6', C.ink, 1.1));
const fish = (x: number, y: number, s = 1, col: string = C.yellow) => at(x, y, s, path('M-6 0 C-3 -4 4 -4 6 0 C4 4 -3 4 -6 0 Z M6 0 L10 -3 L10 3 Z', col, C.ink, 0.8), circle(-3, -0.6, 0.7, C.ink, null));
const star8 = (x: number, y: number, r = 6, col: string = C.yellow) => path(range(16).map((i) => { const a = (i / 16) * Math.PI * 2, rr = i % 2 ? r * 0.45 : r; return `${i ? 'L' : 'M'}${f1(x + Math.cos(a) * rr)} ${f1(y + Math.sin(a) * rr)}`; }).join(' ') + ' Z', col, C.ink, 1);
const quake = (x: number, y: number, r = 5) => star8(x, y, r, C.red);

// ── People ───────────────────────────────────────────────────────────
const geo = (x: number, h = 1) => { const s = 0.84 * h, ty = 112 - 49 * s; return { s, ty, sy: f1(ty - 38 * s), sl: f1(x - 13 * s), sr: f1(x + 13 * s) }; };
/** An arm from the shoulder (side −1 = picture-left, 1 = picture-right) to a hand at (tx, ty). */
const reach = (x: number, h: number, side: -1 | 1, tx: number, ty: number, skin: string = C.skin) => { const q = geo(x, h); return all(arm(side < 0 ? q.sl : q.sr, q.sy, tx, ty), circle(tx, ty, f1(3 * Math.max(0.6, h)), skin, C.ink, 1.2)); };
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
/** Figures drawn standing at x = 60 on y = 112, placed with their feet at (x, y) and scaled by s. */
const stand = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s}) translate(-60 -112)`, ...k);
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
const helmetL = (col: string = C.yellow) => all(path('M-13 -60 C-12 -72 12 -72 13 -60 Z', col, C.ink, 1.3), line('M-15 -60 L15 -60', C.ink, 1.4));
const tiny = (x: number, y: number, s = 1, col: string = C.denim) => at(x, y, s, circle(0, -11, 2.6, C.skin, C.ink, 0.7), path('M-3 -8 L3 -8 L3.5 -2 L2 -2 L2 0 L-2 0 L-2 -2 L-3.5 -2 Z', col, C.ink, 0.7));

// ── Globe and layers ─────────────────────────────────────────────────
const blob = (x: number, y: number, s = 1, col: string = LAND, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-10 -6 C-6 -14 6 -12 10 -6 C14 0 8 10 2 8 C-4 12 -12 6 -10 -6 Z', col, C.ink, 1.1));
const globe = (cx: number, cy: number, r: number) => all(circle(cx, cy, r, SEA, C.ink, 1.8), blob(f1(cx - r * 0.45), f1(cy - r * 0.3), f1(r / 30), LAND, 20), blob(f1(cx + r * 0.3), f1(cy + r * 0.35), f1(r / 26), LAND, -30), blob(f1(cx - r * 0.35), f1(cy + r * 0.5), f1(r / 50), LAND, 0));
const quarter = (cx: number, cy: number, r: number) => `M${cx} ${cy} L${cx} ${f1(cy - r)} A${r} ${r} 0 0 1 ${f1(cx + r)} ${cy} Z`;
const band = (cx: number, cy: number, r1: number, r0: number) => r0 <= 0 ? quarter(cx, cy, r1) : `M${f1(cx + r1)} ${cy} A${r1} ${r1} 0 0 0 ${cx} ${f1(cy - r1)} L${cx} ${f1(cy - r0)} A${r0} ${r0} 0 0 1 ${f1(cx + r0)} ${cy} Z`;
type Layer = 'crust' | 'mantle' | 'core' | 'outer' | 'inner' | 'inside';
/** Globe with the upper-right quarter cut away; `hl` outlines one layer with the highlight colour. */
const cutGlobe = (cx: number, cy: number, r: number, hl?: Layer, crust = 0.08, extra: Svg = '') => {
  const rc = r * (1 - crust), ro = r * 0.56, ri = r * 0.26;
  const radii: Record<Layer, [number, number]> = { crust: [r, rc], mantle: [rc, ro], core: [ro, 0], outer: [ro, ri], inner: [ri, 0], inside: [rc, 0] };
  const mid = hl ? (radii[hl][0] + radii[hl][1]) / 2 : 0;
  const a = Math.PI / 4;
  return all(globe(cx, cy, r), path(quarter(cx, cy, r), CRUST, C.ink, 1.4), path(quarter(cx, cy, rc), MANTLE, C.ink, 1), path(quarter(cx, cy, ro), OUTER, C.ink, 1), path(quarter(cx, cy, ri), INNER, C.ink, 1), extra,
    hl ? all(path(band(cx, cy, radii[hl][0], radii[hl][1]), 'none', HL, 2.8), arrow(f1(cx + Math.cos(a) * (r + 18)), f1(cy - Math.sin(a) * (r + 18)), f1(cx + Math.cos(a) * (mid + 2)), f1(cy - Math.sin(a) * (mid + 2)), HL, 2.6)) : '');
};
/** Side cross-section of the ground: sky, a surface strip and coloured layers below. */
const strata = (y0: number, cols: string[], h: number) => all(...cols.map((c, i) => rect(4, f1(y0 + i * h), 112, f1(h), c, 0, null)), line(cols.map((_, i) => `M4 ${f1(y0 + i * h)} L116 ${f1(y0 + i * h)}`).join(' '), C.ink, 0.8));
const dots = (pts: number[][], col: string = C.ink, r = 0.9) => all(...pts.map(([x, y]) => circle(x!, y!, r, col, null)));
/** A tectonic block in cross-section: top surface at y, thickness h, between x1 and x2. */
const block = (x1: number, x2: number, y: number, h: number, col: string, top: string = LAND) => all(rect(x1, y, x2 - x1, h, col, 0, C.ink, 1.2), rect(x1, f1(y - 3), x2 - x1, 3, top, 0, C.ink, 1));
const mantleBase = (y: number) => all(rect(4, y, 112, 112 - y, MANTLE, 0, null), dots([[14, y + 8], [34, y + 12], [58, y + 6], [80, y + 12], [102, y + 8]], MANTLE2, 1.4));
/** Top view of plates: jagged boundary lines over the sea-and-land map. */
const plateMap = (hlPlate = -1, hlEdge = -1) => {
  const plates = [
    'M4 4 L58 4 L52 30 L60 52 L30 60 L4 56 Z',
    'M58 4 L116 4 L116 46 L84 50 L60 52 L52 30 Z',
    'M4 56 L30 60 L60 52 L66 82 L40 112 L4 112 Z',
    'M60 52 L84 50 L116 46 L116 112 L40 112 L66 82 Z',
  ];
  const cols = ['#d9c9a6', '#cbb48a', '#b7c9a4', '#d6bf94'];
  const edges = ['M58 4 L52 30 L60 52', 'M4 56 L30 60 L60 52', 'M60 52 L84 50 L116 46', 'M60 52 L66 82 L40 112'];
  return all(...plates.map((d, i) => path(d, i === hlPlate ? '#f7c08a' : cols[i]!, null)), blob(26, 26, 1.1, LAND, 10), blob(88, 24, 1, LAND, -20), blob(28, 86, 0.9, LAND, 30), blob(90, 84, 1.2, LAND, 0),
    ...edges.map((d, i) => line(d, i === hlEdge ? HL : C.red, i === hlEdge ? 3.6 : 2, i === hlEdge ? undefined : '4 2')), hlPlate >= 0 ? path(plates[hlPlate]!, 'none', HL, 3) : '');
};
const volcano = (x: number, y: number, w: number, h: number, col: string = ROCK, crater = true) => all(path(`M${x - w / 2} ${y} L${f1(x - w * 0.09)} ${y - h} L${f1(x + w * 0.09)} ${y - h} L${x + w / 2} ${y} Z`, col, C.ink, 1.4), crater ? ellipse(x, y - h, f1(w * 0.09), 2, ROCK2, C.ink, 1) : '');
const piece = (x: number, y: number, s: number, col: string, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-10 -10 L-3 -10 C-3 -15 3 -15 3 -10 L10 -10 L10 -3 C15 -3 15 3 10 3 L10 10 L3 10 C3 6 -3 6 -3 10 L-10 10 L-10 3 C-6 3 -6 -3 -10 -3 Z', col, C.ink, 1.2));
const seismo = (x1: number, x2: number, y: number, amps: number[], col: string = C.ink, sw = 1.3) => { const step = (x2 - x1) / amps.length; return line(`M${x1} ${y} ` + amps.map((a, i) => `L${f1(x1 + (i + 0.5) * step)} ${f1(y - a * (i % 2 ? -1 : 1))}`).join(' ') + ` L${x2} ${y}`, col, sw); };
const africaSA = (dx: number, dy: number, gap: number, col: string = LAND) => all(
  at(dx - gap, dy, 1, path('M-4 -26 C4 -28 10 -22 8 -14 C14 -10 12 -2 6 6 C2 16 -2 24 -6 30 C-8 20 -10 10 -14 4 C-18 -4 -14 -14 -12 -20 C-10 -24 -8 -26 -4 -26 Z', col, C.ink, 1.3)),
  at(dx + gap, dy, 1, path('M-6 -30 C6 -32 20 -28 24 -18 C26 -10 18 -6 16 2 C14 12 10 22 4 28 C0 30 -2 24 -2 16 C-2 8 -6 2 -10 -2 C-14 -6 -16 -14 -14 -22 C-12 -28 -10 -30 -6 -30 Z', col, C.ink, 1.3)));
const isle = (x: number, y: number, w: number, col: string = LAND) => all(ellipse(x, y, w, f1(w * 0.35), SAND, C.ink, 1.1), ellipse(x, f1(y - w * 0.08), f1(w * 0.7), f1(w * 0.22), col, null));

/** Round-2 helpers (0.42): a crust column in its own frame, a curved shell band and a black porous stone. */
const crustCol = (x: number, kind: 'cont' | 'ocean') => kind === 'cont'
  ? all(rect(x, 14, 46, 18, SKY, 0, null), rect(x, 29, 46, 3, LAND, 0, C.ink, 1), rect(x, 32, 46, 56, CONT, 0, C.ink, 1.3), rect(x, 88, 46, 18, MANTLE, 0, C.ink, 1), tree(x + 10, 29, 0.45), house(x + 26, 29, 0.55), tree(x + 38, 29, 0.4))
  : all(rect(x, 14, 46, 6, SKY, 0, null), rect(x, 20, 46, 58, DEEP, 0, C.ink, 1), waves(x + 2, x + 44, 22, C.white), rect(x, 78, 46, 8, OCRUST, 0, C.ink, 1.3), rect(x, 86, 46, 20, MANTLE, 0, C.ink, 1), fish(x + 14, 44, 0.9), fish(x + 32, 60, 0.8, C.orange));
const arcY = (cx: number, cy: number, r: number, x: number) => f1(cy - Math.sqrt(r * r - (x - cx) * (x - cx)));
const arcBand = (cx: number, cy: number, r1: number, r0: number, col: string, sw = 1) => { const xs = range(15).map((i) => 4 + i * 8); return path(`M${xs.map((x) => `${x} ${arcY(cx, cy, r1, x)}`).join(' L')} L${xs.slice().reverse().map((x) => `${x} ${arcY(cx, cy, r0, x)}`).join(' L')} Z`, col, C.ink, sw); };
const pumice = (x: number, y: number, s = 1, col: string = BASALT, hole: string = '#1e1d22') => at(x, y, s, path('M-12 6 L-10 -6 L0 -11 L10 -7 L13 4 L4 10 L-6 10 Z', col, C.ink, 1.3), ...[[-5, -3], [2, -5], [6, 2], [-2, 4], [-7, 2]].map(([a, b]) => circle(a!, b!, 1.3, hole, null)));

// ── Motifs ───────────────────────────────────────────────────────────
export const EARTH_INTERIOR_MOTIFS: Record<string, Svg> = {
  // 2521 Jordskorpan
  'jinre.jordklot': all(bg(SPACE), ...[[16, 18], [100, 14], [22, 96], [104, 100], [12, 60], [108, 58], [60, 10]].map(([x, y]) => sparkle(x!, y!, 2, C.white)), globe(60, 60, 40), path('M30 34 C40 26 52 22 62 22', 'none', 'rgba(255,255,255,0.6)', 3), ring(60, 60, 46)),
  'jinre.skikt': all(bg(), rect(18, 30, 84, 74, 'none', 0, null), strata(34, ['#7fbf5a', '#8a5a32', SAND, '#c9a27a', ROCK, '#6f6458'], 12),
    line('M4 34 L116 34', C.ink, 1.2), ...range(12).map((i) => line(`M${8 + i * 9} 34 l-2 -5 M${8 + i * 9} 34 l2 -5`, LAND2, 1.1)),
    path('M106 58 L112 58 L112 70 L106 70', 'none', HL, 2.6), path('M14 58 L8 58 L8 70 L14 70', 'none', HL, 2.6), rect(16, 58, 88, 12, 'none', 0, HL, 2.6), cloud(30, 16, 0.7), cloud(90, 14, 0.6)),
  'jinre.jordskorpa': all(bg(SPACE), cutGlobe(50, 66, 46, 'crust', 0.14), at(50, 20, 0.7, house(0, 0, 1)), tree(66, 23, 0.45)),
  'jinre.kontinental': all(bg('#f3ede2'), crustCol(10, 'cont'), greyed(crustCol(64, 'ocean')), line('M50 34 L50 86', C.ink, 1.4), path('M47 37 L50 32 L53 37 Z M47 83 L50 88 L53 83 Z', C.ink, null), rect(9, 29, 48, 60, 'none', 2, HL, 3)),
  'jinre.havsbotten': all(bg(SEA), rect(4, 4, 112, 22, SKY, 3, null), line('M4 26 L116 26', SEA2, 1.6), waves(8, 108, 26, C.white), rect(4, 26, 112, 70, SEA, 0, null), rect(4, 60, 112, 36, DEEP, 0, null),
    path('M4 96 C24 90 40 94 60 92 C80 90 96 94 116 92 L116 112 L4 112 Z', SAND, C.ink, 1.3), path('M20 94 C18 84 22 78 19 70 M24 94 C26 86 23 80 26 74', 'none', LAND2, 2), at(92, 96, 1, path('M-6 0 C-6 -6 6 -6 6 0 Z', C.red, C.ink, 1), line('M-6 -2 l-3 -3 M6 -2 l3 -3', C.ink, 1)),
    ellipse(50, 98, 4, 2, ROCK, C.ink, 0.8), ellipse(70, 99, 5, 2.4, ROCK, C.ink, 0.8), fish(44, 52, 1.2), fish(80, 72, 1, C.orange), path('M4 94 C24 88 40 92 60 90 C80 88 96 92 116 90', 'none', HL, 3)),
  'jinre.oceanisk': all(bg('#f3ede2'), greyed(crustCol(10, 'cont')), crustCol(64, 'ocean'), rect(63, 19, 48, 68, 'none', 2, HL, 3)),
  'jinre.tvärsnitt': all(bg('#f3ede2'), rect(4, 86, 112, 26, '#c9a874', 0, null), path('M10 70 L70 70 L70 98 L10 98 Z', '#b07a48', C.ink, 1.4), line('M14 78 L66 78 M14 88 L66 88', WOOD2, 0.9),
    ellipse(10, 84, 7, 14, '#c58c5e', C.ink, 1.3), ellipse(84, 72, 20, 28, '#e6c79a', C.ink, 1.8), ...[22, 16, 10, 5].map((r) => ellipse(84, 72, f1(r * 0.71), r, 'none', '#b07a48', 1.2)), circle(84, 72, 1.6, WOOD2, null),
    at(46, 50, 1, path('M-26 0 L10 0 L10 6 L-26 6 Z', C.silver, C.ink, 1.2), path('M10 -2 L24 -2 L24 8 L10 8 Z', WOOD, C.ink, 1.2)), oval(84, 72, 24, 32)),
  'jinre.borrhål': all(bg(), strata(50, ['#8a5a32', SAND, '#c9a27a', ROCK, '#6f6458'], 12.4), field(46, LAND), line('M4 50 L116 50', C.ink, 1.2),
    at(60, 46, 1, line('M-14 0 L0 -40 L14 0 M-10 -10 L10 -10 M-6 -22 L6 -22 M-12 -6 L10 -18 M12 -6 L-10 -18', C.dark, 1.6), rect(-4, -44, 8, 6, C.red, 1, C.ink, 1)), rect(16, 34, 16, 12, C.yellow, 2, C.ink, 1.2),
    rect(58.5, 50, 3, 58, C.dark, 0, null), path('M57 50 L57 108 M63 50 L63 108', 'none', C.ink, 0.8), ellipse(60, 108, 3, 1.4, C.dark, null), oval(60, 80, 9, 32)),
  // 2522 Manteln och kärnan
  'jinre.jordens-inre': all(bg(SPACE), cutGlobe(50, 66, 46, undefined), path(band(50, 66, 42.3, 0), 'none', HL, 3), arrow(108, 20, 80, 42, HL, 2.6), at(98, 100, 1, circle(0, 0, 9, 'none', C.white, 2.4), line('M6 6 L13 13', C.white, 3.4))),
  'jinre.mantel.2': all(bg(SPACE), cutGlobe(50, 66, 46, 'mantle')),
  'jinre.kärna': all(bg(SPACE), cutGlobe(50, 66, 46, 'core')),
  'jinre.yttre-kärna': all(bg(SPACE), cutGlobe(50, 66, 46, 'outer', 0.08, all(path('M66 56 C70 52 72 48 70 44', 'none', C.ink, 1.3), path('M68 43 l2 3 l2 -3', 'none', C.ink, 1.3), path('M58 46 C62 44 64 42 64 40', 'none', C.ink, 1.1)))),
  'jinre.inre-kärna': all(bg(SPACE), cutGlobe(50, 66, 46, 'inner')),
  'jinre.tryck.2': all(bg('#eaf2f8'), circle(60, 62, 18, C.yellow, C.ink, 1.6), ...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return arrow(f1(60 + Math.cos(a) * 44), f1(62 + Math.sin(a) * 44), f1(60 + Math.cos(a) * 22), f1(62 + Math.sin(a) * 22), HL, 3); }),
    greyed(circle(104, 100, 8, C.yellow, C.ink, 1.2)), at(18, 98, 1, circle(0, 0, 9, C.white, C.ink, 1.3), line('M0 0 L6 -5', C.red, 1.8), path('M-7 3 A8 8 0 0 1 7 3', 'none', C.ink, 0.8))),
  'jinre.trögflytande': all(bg('#f6efe0'), at(30, 0, 1, g('rotate(-35 0 24)', rect(-12, 14, 24, 20, '#f0b43a', 3, C.ink, 1.3)), path('M8 24 C12 34 9 44 11 54 C12 58 14 58 14 54 C14 44 15 34 12 26 Z', '#e8a42a', C.ink, 1.2), path('M11 56 C9 60 9 64 12 64 C15 64 15 60 13 56 Z', '#e8a42a', C.ink, 1),
    rect(-4, 84, 30, 22, C.white, 2, C.ink, 1.3), rect(-2, 102, 26, 3, '#e8a42a', 0, null), at(-6, 66, 0.9, path('M-8 6 L8 6 C8 2 4 0 0 0 C-6 0 -8 3 -8 6 Z', '#c9a27a', C.ink, 1), circle(1, 2, 4, '#e0b98a', C.ink, 1), path('M1 2 m-2 0 a2 2 0 1 0 4 0', 'none', C.ink, 0.8), line('M8 4 L12 0 M8 4 L13 3', C.ink, 1))), oval(42, 52, 16, 34),
    greyed(at(88, 0, 1, g('rotate(35 0 24)', rect(-12, 14, 24, 20, '#bfe3f5', 3, C.ink, 1.3)), line('M-10 26 L-8 100', '#5aa7d6', 1.8), rect(-22, 84, 30, 22, C.white, 2, C.ink, 1.3), rect(-20, 88, 26, 17, '#bfe3f5', 0, null), line('M10 50 L18 50 M10 60 L18 60 M10 70 L18 70', C.grey, 1.4)))),
  'jinre.konvektionsström': all(bg('#f3ede2'), rect(22, 92, 76, 8, C.dark, 2, C.ink, 1.2), ...[36, 48, 60, 72, 84].map((x) => path(`M${x} 100 C${x - 3} 104 ${x + 3} 106 ${x} 110`, 'none', C.red, 1.6)),
    path('M22 34 L98 34 L94 92 L26 92 Z', '#c9ced4', C.ink, 1.6), rect(26, 40, 68, 50, '#f4a24a', 0, null), line('M22 34 L98 34', C.ink, 2),
    path('M60 84 L60 50 C60 44 80 44 82 52 L82 80 C82 86 64 86 62 84', 'none', HL, 3), path('M60 84 L60 50 C60 44 40 44 38 52 L38 80 C38 86 56 86 58 84', 'none', HL, 3),
    path('M56 54 L60 46 L64 54 Z', HL, null), path('M78 72 L82 80 L86 72 Z', '#3f7ab8', null), path('M34 72 L38 80 L42 72 Z', '#3f7ab8', null), steam(50, 30, 0.5), steam(70, 30, 0.5)),
  'jinre.magnetfält': all(bg(SPACE), globe(46, 60, 22), ...[1, 1.5, 2].map((k) => all(path(`M46 38 C${f1(46 + 22 * k)} ${f1(38 - 10 * k)} ${f1(46 + 22 * k)} ${f1(82 + 10 * k)} 46 82`, 'none', HL, 1.8), path(`M46 38 C${f1(46 - 22 * k)} ${f1(38 - 10 * k)} ${f1(46 - 22 * k)} ${f1(82 + 10 * k)} 46 82`, 'none', HL, 1.8))),
    at(98, 96, 1, circle(0, 0, 11, C.white, C.ink, 1.6), path('M0 -8 L3 0 L-3 0 Z', C.red, C.ink, 0.6), path('M0 8 L3 0 L-3 0 Z', C.grey, C.ink, 0.6))),
  // 2523 Tektoniska plattor
  'jinre.platta.2': all(plateMap(1)),
  'jinre.tektonisk': all(bg(), rect(4, 4, 112, 40, SKY, 0, null), path('M10 52 L58 52 L66 104 L10 104 Z', CRUST, C.ink, 1.3), path('M58 40 L106 40 L106 92 L66 92 Z', CRUST, C.ink, 1.3), rect(10, 49, 48, 3, LAND, 0, C.ink, 1), rect(58, 37, 48, 3, LAND, 0, C.ink, 1), line('M10 70 L60 70 M62 58 L106 58', '#7a4a26', 1.2),
    line('M58 38 L67 106', HL, 3), arrow(86, 80, 86, 62, HL, 3), arrow(34, 64, 34, 82, HL, 3), shake(6, 20, 14), shake(18, 14, 14), shake(112, 18, 14), shake(100, 12, 14),
    greyed(at(100, 104, 0.5, rect(-16, -12, 32, 12, CRUST, 0, C.ink, 1.3), rect(-16, -14, 32, 2, LAND, 0, null)))),
  'jinre.plattektonik': all(bg(SPACE), at(60, 60, 1, globe(0, 0, 44), line('M-30 -32 L-10 -8 L-38 14 M-10 -8 L22 -6 L40 -20 M22 -6 L12 26 L-14 40 M12 26 L36 30 M-10 -8 L-8 -44', C.red, 2.4),
    arrow(-26, -22, -36, -30, HL, 2.6), arrow(4, -26, 14, -34, HL, 2.6), arrow(30, 6, 40, 14, HL, 2.6), arrow(-24, 4, -34, 12, HL, 2.6), arrow(-2, 22, -8, 34, HL, 2.6), arrow(22, 32, 30, 40, HL, 2.6)), circle(60, 60, 48, 'none', HL, 2)),
  'jinre.litosfär': all(bg(SKY), rect(4, 80, 112, 32, MANTLE, 0, null), arcBand(60, 230, 190, 182, CRUST, 1.2), arcBand(60, 230, 182, 168, '#b08458', 1), arcBand(60, 230, 168, 130, MANTLE, 1),
    path('M14 92 c6 -4 12 4 18 0 M50 98 c6 -4 12 4 18 0 M86 92 c6 -4 12 4 18 0', 'none', MANTLE2, 1.6), arcBand(60, 230, 190, 168, 'none', 3).replace(`stroke="${C.ink}"`, `stroke="${HL}"`), tree(30, 41.5, 0.5), house(64, 40.5, 0.6), tree(92, 42, 0.5), cloud(26, 18, 0.6), cloud(96, 14, 0.5)),
  'jinre.plattgräns': all(plateMap(-1, 0), oval(55, 28, 12, 28)),
  'jinre.glida-isär.2': all(bg(), rect(4, 4, 112, 40, SKY, 0, null), mantleBase(70), path('M54 70 C52 60 58 54 56 44 L64 44 C62 54 68 60 66 70 Z', MAGMA, C.ink, 1.2),
    block(10, 54, 44, 26, CRUST), block(66, 110, 44, 26, CRUST), greyed(line('M4 30 L116 30', C.grey, 1.4, '4 3'), rect(32, 24, 56, 4, C.grey2, 0, null)),
    arrow(46, 56, 22, 56, HL, 3.2), arrow(74, 56, 98, 56, HL, 3.2), tree(24, 41, 0.5), tree(96, 41, 0.5)),
  'jinre.mittoceanisk-rygg': all(bg(), rect(4, 4, 112, 18, SKY, 0, null), rect(4, 22, 112, 66, SEA2, 0, null), waves(8, 108, 22, C.white), line('M4 22 L116 22', C.white, 1.4),
    path('M4 88 L30 84 L40 72 L46 78 L52 58 L58 66 L62 66 L68 58 L74 78 L80 72 L90 84 L116 88 L116 98 L4 98 Z', OCRUST, C.ink, 1.3), line('M60 98 L60 66', MAGMA, 2.4), mantleBase(98), path('M54 112 C56 104 58 100 60 98 C62 100 64 104 66 112 Z', MAGMA, null),
    arrow(46, 92, 20, 94, C.white, 2.2), arrow(74, 92, 100, 94, C.white, 2.2), fish(24, 50, 1.1), fish(96, 40, 0.9, C.orange), oval(60, 72, 34, 18)),
  'jinre.kollidera': all(bg(), rect(4, 4, 112, 44, SKY, 0, null), mantleBase(80), block(4, 50, 52, 28, CONT), block(70, 116, 52, 28, CONT),
    path('M50 49 L50 80 L70 80 L70 49 L64 36 L60 28 L56 36 Z', CRUST, C.ink, 1.3), path('M56 36 L60 28 L64 36', SNOW, C.ink, 1), star8(60, 62, 9, C.yellow), arrow(14, 64, 40, 64, HL, 3.4), arrow(106, 64, 80, 64, HL, 3.4)),
  'jinre.subduktion': all(bg(), rect(4, 4, 112, 36, SKY, 0, null), rect(4, 30, 60, 12, SEA, 0, null), waves(8, 60, 34), mantleBase(66),
    path('M4 42 L60 42 L66 46 C80 56 92 76 100 104 L86 108 C78 82 68 64 56 56 L4 56 Z', OCRUST, C.ink, 1.3), path('M60 30 L116 30 L116 66 L100 66 C90 56 76 48 64 44 Z', CONT, C.ink, 1.3), rect(60, 27, 56, 3, LAND, 0, C.ink, 1),
    arrow(20, 49, 50, 49, C.white, 2.4), path('M74 64 C82 72 88 82 92 96', 'none', HL, 3.2), path('M86 92 L92 100 L96 90 Z', HL, null), house(92, 27, 0.5), oval(80, 72, 22, 34)),
  'jinre.djuphavsgrav': all(bg(), rect(4, 4, 112, 16, SKY, 0, null), rect(4, 20, 112, 92, SEA2, 0, null), waves(8, 108, 20, C.white), at(22, 20, 0.7, path('M-14 -2 L14 -2 L10 4 L-10 4 Z', C.white, C.ink, 1.1), rect(-4, -8, 8, 6, C.red, 0, C.ink, 0.8)),
    path('M4 52 L50 54 L58 104 L64 104 L70 50 L116 44 L116 112 L4 112 Z', OCRUST, C.ink, 1.3), path('M70 50 L116 44 L116 30 L84 34 Z', CONT, C.ink, 1.2), fish(30, 40, 1), oval(61, 80, 10, 28)),
  'jinre.glida-förbi': all(bg('#cfe0bf'), rect(4, 4, 56, 108, '#c7d9ad', 0, null), line('M60 4 L60 112', C.red, 3), line('M20 4 L20 52', '#8a8a8a', 6), line('M100 64 L100 112', '#8a8a8a', 6), line('M20 52 L58 52 M62 64 L100 64', '#8a8a8a', 6),
    line('M20 4 L20 52 M20 52 L58 52 M62 64 L100 64 M100 64 L100 112', C.white, 1, '4 4'), arrow(40, 90, 40, 70, HL, 3.4), arrow(80, 26, 80, 46, HL, 3.4), tree(34, 34, 0.6), tree(88, 94, 0.6), oval(60, 58, 10, 22)),
  // 2524 Kontinentaldrift
  'jinre.driva.2': all(bg(), rect(4, 52, 112, 60, SEA, 0, null), waves(8, 108, 66), waves(14, 104, 88), waves(8, 108, 104),
    at(70, 60, 2, path('M-16 -4 C-10 4 10 4 16 -4 L12 -1 C6 2 -6 2 -12 -1 Z', WOOD, C.ink, 1.3), line('M-6 -4 L-12 -14 M6 -4 L12 -14', WOOD2, 1.4)),
    line('M10 70 C22 64 32 74 44 68 C50 66 54 64 58 64', C.white, 1.6, '3 3'), line('M10 22 L34 22 M16 30 L44 30 M8 38 L28 38', C.grey, 1.6), arrow(70, 30, 98, 30, C.grey, 2), cloud(90, 16, 0.6)),
  'jinre.kontinentaldrift': all(bg(SEA), waves(8, 108, 14, SEA2), waves(8, 108, 104, SEA2), africaSA(60, 66, 18), arrow(36, 66, 16, 66, HL, 3), arrow(84, 66, 104, 66, HL, 3), greyed(at(22, 22, 0.45, rect(-30, -34, 60, 68, C.white, 4, null), africaSA(0, 0, 7, C.grey))), arrow(42, 22, 54, 22, C.grey, 1.6)),
  'jinre.meteorolog': all(bg('#eef2f6'), rect(8, 14, 70, 56, '#d6ecf8', 3, C.ink, 1.6), path('M14 60 C20 40 30 30 44 28 C56 26 64 34 70 48 L72 64 L14 64 Z', LAND, C.ink, 1.1),
    at(30, 36, 0.8, circle(0, 0, 6, C.yellow, C.ink, 1), ...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(Math.cos(a) * 8)} ${f1(Math.sin(a) * 8)} L${f1(Math.cos(a) * 11)} ${f1(Math.sin(a) * 11)}`, C.gold, 1.4); })),
    cloud(56, 40, 0.5), line('M50 48 l-2 5 M56 48 l-2 5 M62 48 l-2 5', '#3f86c4', 1.6), num(24, 58, '18', 8, C.red), num(60, 60, '12', 8, '#3f7ab8'), stand(98, 112, 0.66, fig(60, C.navy, 'smile', { hairStyle: 'long' }), reach(60, 1, -1, 30, 52))),
  'jinre.superkontinent': all(bg(SPACE), circle(60, 60, 44, SEA, C.ink, 1.8), path('M30 28 C46 20 66 22 80 30 C92 38 96 52 88 60 C80 66 70 62 64 70 C58 80 62 92 52 98 C44 102 36 94 34 84 C32 72 24 66 22 56 C20 44 22 34 30 28 Z', LAND, C.ink, 1.4),
    path('M56 46 C62 44 70 46 74 52', 'none', SEA, 3), path('M30 28 C46 20 66 22 80 30 C92 38 96 52 88 60 C80 66 70 62 64 70 C58 80 62 92 52 98 C44 102 36 94 34 84 C32 72 24 66 22 56 C20 44 22 34 30 28 Z', 'none', HL, 3)),
  'jinre.landmassa': all(bg(SEA), waves(8, 108, 12, SEA2), path('M8 30 C20 18 50 16 74 22 C98 26 112 40 110 62 C108 84 92 100 64 102 C40 104 18 94 10 76 C4 62 2 42 8 30 Z', LAND, C.ink, 1.4),
    at(46, 56, 0.9, path('M-14 6 L-6 -8 L0 0 L6 -10 L14 6 Z', ROCK, C.ink, 1)), path('M70 30 C66 46 74 60 64 80', 'none', SEA2, 1.8), tree(84, 74, 0.5), tree(30, 82, 0.5), greyed(isle(104, 104, 7)),
    path('M8 30 C20 18 50 16 74 22 C98 26 112 40 110 62 C108 84 92 100 64 102 C40 104 18 94 10 76 C4 62 2 42 8 30 Z', 'none', HL, 3)),
  'jinre.kustlinje': all(bg(SEA), path('M4 4 L64 4 C58 14 70 22 62 32 C54 40 66 48 58 58 C50 66 62 76 54 86 C48 94 58 104 52 112 L4 112 Z', LAND, null), waves(80, 110, 30), waves(76, 110, 70), waves(80, 110, 100),
    tree(22, 40, 0.6), house(30, 80, 0.7), at(86, 50, 0.6, path('M-14 -2 L14 -2 L10 4 L-10 4 Z', C.white, C.ink, 1.1)), path('M64 4 C58 14 70 22 62 32 C54 40 66 48 58 58 C50 66 62 76 54 86 C48 94 58 104 52 112', 'none', HL, 3.6)),
  'jinre.pussel': all(bg('#f3ede2'), rect(10, 16, 76, 76, '#e8dcc8', 2, C.ink, 1.4), ...range(3).flatMap((r) => range(3).map((c) => (r === 1 && c === 2) ? '' : piece(23 + c * 25, 29 + r * 25, 1.1, ['#7fbf5a', '#5fa3d0', '#f2c14e', '#ef8a3c', '#c7b3e6'][(r * 3 + c) % 5]!))),
    rect(62, 42, 22, 24, '#d9cdb3', 1, C.ink, 0.8, ), piece(98, 84, 1.1, '#5fa3d0', 12), arrow(92, 72, 78, 58, HL, 2.4), oval(73, 54, 15, 16)),
  'jinre.passa-ihop': all(bg('#f3ede2'), at(46, 46, 1, path('M-28 -14 L0 -14 L0 -6 C8 -8 8 6 0 4 L0 14 L-28 14 Z', '#5fa3d0', C.ink, 1.4), path('M0 -14 L28 -14 L28 14 L0 14 L0 4 C8 6 8 -8 0 -6 Z', '#f2c14e', C.ink, 1.4)), okC(84, 30, 8), oval(46, 46, 36, 22),
    greyed(at(44, 94, 0.7, path('M-28 -14 L0 -14 L0 -6 C8 -8 8 6 0 4 L0 14 L-28 14 Z', '#5fa3d0', C.ink, 1.4), path('M6 -14 L34 -14 L34 14 L6 14 L6 8 L14 8 L14 -6 L6 -6 Z', '#f2c14e', C.ink, 1.4))), ban(84, 94, 7)),
  'jinre.havsbottenspridning': all(bg(), rect(4, 4, 112, 22, SKY, 0, null), rect(4, 26, 112, 40, SEA2, 0, null), waves(8, 108, 26, C.white), mantleBase(78),
    ...[0, 1, 2, 3, 4].map((i) => all(rect(f1(56 - (i + 1) * 9), 66, 9, 12, i % 2 ? '#6b707c' : '#4a4f5a', 0, null), rect(f1(64 + i * 9), 66, 9, 12, i % 2 ? '#6b707c' : '#4a4f5a', 0, null))), rect(56, 62, 8, 16, MAGMA, 0, null), path('M54 112 C56 100 58 90 60 80 C62 90 64 100 66 112 Z', MAGMA, null),
    block(4, 12, 54, 24, CONT), block(108, 116, 54, 24, CONT), line('M4 66 L116 66 M4 78 L116 78', C.ink, 0.8), arrow(50, 58, 24, 58, HL, 3), arrow(70, 58, 96, 58, HL, 3)),
  // 2525 Jordbävningar och förkastningar
  'jinre.jordbävning': all(bg(), field(96, '#cdbb94'), ...[[26, 96, 1.3], [60, 96, 1.6], [94, 96, 1.3]].map(([x, y, s]) => g(`rotate(${x === 60 ? -4 : 4} ${x} ${y})`, house(x!, y!, s!))),
    shake(8, 70, 16), shake(44, 64, 16), shake(78, 64, 16), shake(112, 70, 16), path('M20 98 L30 104 L26 108 L38 112 M70 98 L76 104 L72 110', 'none', C.ink, 1.6), line('M4 96 l6 -2 l6 2 l6 -2 l6 2 l6 -2 l6 2 l6 -2 l6 2 l6 -2 l6 2 l6 -2 l6 2 l6 -2 l6 2 l6 -2 l6 2 l6 -2 l4 2', C.ink, 1.2), quake(60, 106, 4)),
  'jinre.skalv': all(bg('#f4ecdc'), rect(4, 92, 112, 20, '#c9a874', 0, null), line('M4 92 L116 92', C.ink, 1.2), line('M44 4 L52 30', C.ink, 1), path('M44 30 L60 30 L56 38 L48 38 Z', C.yellow, C.ink, 1.2), line('M30 26 A30 30 0 0 0 70 32', C.grey, 1.2, '3 3'),
    g('rotate(-8 96 50)', rect(84, 36, 24, 18, '#bfe3f5', 1, C.ink, 1.4)), rect(10, 50, 34, 42, WOOD, 1, C.ink, 1.4), line('M10 64 L44 64 M10 78 L44 78', WOOD2, 1.4), g('rotate(-20 20 64)', rect(14, 54, 5, 10, C.red, 0, C.ink, 0.8)), rect(22, 54, 5, 10, '#3f7ab8', 0, C.ink, 0.8), at(36, 100, 1, g('rotate(30)', rect(-3, -6, 5, 10, C.green, 0, C.ink, 0.8))),
    rect(60, 76, 34, 4, WOOD, 1, C.ink, 1.2), line('M64 80 L64 92 M90 80 L90 92', WOOD2, 2), cup(72, 72), g('rotate(25 84 74)', cup(84, 72)), shake(6, 40, 20), shake(112, 64, 20), shake(54, 52, 14), quake(100, 102, 5)),
  'jinre.förkastning': all(bg(), field(30, LAND), path('M4 34 L52 34 L72 112 L4 112 Z', '#c9a27a', null), path('M52 44 L116 44 L116 112 L72 112 Z', '#c9a27a', null),
    ...['#8a5a32', SAND, ROCK, '#6f6458'].map((c, i) => all(path(`M4 ${46 + i * 16} L${f1(55 + i * 4.2)} ${46 + i * 16} L${f1(59 + i * 4.2)} ${62 + i * 16} L4 ${62 + i * 16} Z`, c, null), path(`M${f1(57 + i * 4.2)} ${58 + i * 16} L116 ${58 + i * 16} L116 ${74 + i * 16} L${f1(61 + i * 4.2)} ${74 + i * 16} Z`, c, null))),
    rect(4, 30, 48, 4, LAND, 0, null), rect(54, 40, 62, 4, LAND, 0, null), line('M50 30 L74 112', HL, 3.4), arrow(44, 52, 48, 66, C.ink, 2), arrow(80, 92, 76, 78, C.ink, 2)),
  'jinre.seismisk-våg': all(bg(), field(30, LAND), strata(34, ['#c9a27a', ROCK, '#8a7a68'], 26), ...[12, 24, 36, 48].map((r) => path(`M${60 - r} 84 A${r} ${r} 0 0 1 ${60 + r} 84`, 'none', HL, 2)), quake(60, 84, 7), house(30, 30, 0.8), house(90, 30, 0.8), shake(30, 10, 10), shake(90, 10, 10)),
  'jinre.hypocentrum': all(bg(), field(30, LAND), strata(34, ['#c9a27a', ROCK, '#8a7a68'], 26), house(60, 30, 0.9), line('M60 32 L60 80', C.ink, 1.2, '3 3'), quake(60, 88, 7), ring(60, 88, 13), arrow(98, 36, 98, 86, C.grey, 1.6)),
  'jinre.epicentrum': all(bg(), field(30, LAND), strata(34, ['#c9a27a', ROCK, '#8a7a68'], 26), ellipse(60, 32, 16, 4, 'none', C.ink, 1), ellipse(60, 32, 28, 7, 'none', C.ink, 0.8), line('M60 36 L60 82', C.ink, 1.2, '3 3'), greyed(quake(60, 88, 7)), house(98, 30, 0.7), circle(60, 32, 3, C.red, C.ink, 1), ring(60, 32, 9)),
  'jinre.magnitud': all(bg('#f3ede2'), seismo(10, 110, 22, [2, 4, 3, 8, 14, 10, 6, 3, 2], C.ink, 1.2), ...[5, 6, 7, 8, 9].map((m, i) => all(rect(14 + i * 20, f1(104 - (i + 1) * 13), 14, f1((i + 1) * 13), i === 4 ? '#f2a93a' : '#c9ced4', 1, C.ink, 1.2), num(21 + i * 20, 110, String(m), 8))), ring(101, 48, 13)),
  'jinre.seismograf': all(bg('#eef0f2'), rect(14, 70, 92, 30, '#6c7078', 3, C.ink, 1.6), ellipse(34, 60, 14, 14, C.white, C.ink, 1.4), rect(34, 46, 52, 28, C.white, 0, null), line('M34 46 L86 46 M34 74 L86 74', C.ink, 1.4), ellipse(86, 60, 14, 14, C.white, C.ink, 1.4),
    seismo(36, 84, 60, [1, 1, 2, 7, 11, 6, 9, 3, 2, 1], C.red, 1.2), line('M70 20 L70 58', C.dark, 2), circle(70, 20, 4, C.dark, null), path('M68 56 L70 62 L72 56 Z', C.red, C.ink, 0.8), rect(22, 80, 8, 6, C.green, 1, C.ink, 0.8), oval(60, 60, 34, 20)),
  'jinre.efterskalv': all(bg('#f3ede2'), line('M8 60 L112 60', C.grey, 1), greyed(seismo(10, 40, 60, [3, 10, 30, 36, 24, 10, 4], C.ink, 1.4)), seismo(44, 112, 60, [2, 8, 3, 2, 6, 2, 2, 5, 1, 2, 4, 1], HL, 1.6), arrow(10, 100, 110, 100, C.ink, 1.6), oval(78, 60, 36, 14)),
  'jinre.tsunami': all(bg(), rect(4, 70, 112, 42, SEA, 0, null), path('M4 112 L4 50 C16 30 40 22 58 30 C66 34 66 44 58 46 C50 48 48 40 52 38 C42 38 38 54 46 66 L64 74 L64 112 Z', SEA2, C.ink, 1.4), path('M10 46 C20 32 40 26 54 32', 'none', C.white, 2),
    path('M66 82 L116 78 L116 112 L66 112 Z', SAND, C.ink, 1), house(84, 84, 0.8), house(102, 82, 0.8), tree(112, 80, 0.5), arrow(30, 92, 58, 92, C.white, 2.4), oval(36, 56, 32, 34)),
  'jinre.jordbävningssäker': all(bg(), field(100, '#cdbb94'), line('M4 100 l6 -2 l6 2 l6 -2 l6 2 l6 -2 l6 2 l6 -2 l6 2 l6 -2 l6 2 l6 -2 l6 2 l6 -2 l6 2 l6 -2 l6 2 l6 -2 l4 2', C.ink, 1.2),
    rect(22, 34, 36, 58, '#e8e2d8', 0, C.ink, 1.4), ...range(4).map((r) => all(rect(28, 40 + r * 12, 8, 7, '#8cc7e8', 0, C.ink, 0.8), rect(44, 40 + r * 12, 8, 7, '#8cc7e8', 0, C.ink, 0.8))), rect(20, 92, 40, 3, C.dark, 0, null),
    ...[26, 40, 54].map((x) => all(rect(x - 3, 95, 6, 5, C.grey, 1, C.ink, 0.8), path(`M${x - 3} 97 l2 1 l2 -1 l2 1`, 'none', C.ink, 0.6))), okC(66, 30, 7), shake(12, 60, 18),
    greyed(g('rotate(10 96 100)', rect(84, 60, 22, 40, '#e8e2d8', 0, C.ink, 1.2), path('M90 66 L96 76 L92 84', 'none', C.ink, 1.2))), ban(98, 46, 6)),
  // 2526 Vulkaner och magma
  'jinre.vulkan': all(bg(), field(98, LAND), volcano(60, 100, 96, 56), path('M53 44 L50 54 L56 52 L58 62 M67 44 L70 52', 'none', LAVA, 2.4), smoke(58, 40, 0.9), tree(14, 104, 0.6), tree(108, 104, 0.6), ring(60, 66, 44)),
  'jinre.vulkanisk': all(bg(), rect(4, 58, 112, 20, SEA, 0, null), waves(8, 108, 64), path('M4 78 C30 72 70 74 116 80 L116 112 L4 112 Z', '#2f2d33', C.ink, 1.3), dots([[14, 92], [24, 100], [40, 90], [52, 104], [66, 96], [80, 104], [94, 94], [106, 102]], '#6a6870', 1),
    pumice(30, 88, 1.3), pumice(50, 94, 1), pumice(70, 86, 1.1), steam(88, 84, 0.6), steam(98, 86, 0.5), ellipse(93, 85, 8, 2, '#1e1d22', null), oval(50, 90, 34, 16),
    greyed(at(102, 36, 1, path('M-12 6 L-10 -6 L0 -11 L10 -7 L13 4 L4 10 L-6 10 Z', '#d8d2c8', C.ink, 1.3), dots([[-5, -3], [2, -5], [6, 2], [-2, 4]], C.ink, 1)))),
  'jinre.magma': all(bg('#8a7a68'), strata(4, ['#a59c86', '#8a7a68', '#7a6c5c', '#6a5c4e'], 27), path('M30 112 C28 96 40 84 36 70 C34 60 46 52 52 40 C56 50 62 56 66 70 C70 86 82 96 84 112 Z', MAGMA, C.ink, 1.4), path('M44 94 C46 80 54 72 56 60', 'none', C.yellow, 2.2),
    ...[[44, 86], [60, 96], [70, 104], [50, 104], [56, 76]].map(([x, y]) => circle(x!, y!, 2.6, LAVA, C.ink, 0.6)), path('M52 40 C50 30 54 22 52 12', 'none', MAGMA, 3), thermo(100, 40, true), oval(58, 82, 30, 30)),
  'jinre.magmakammare': all(bg(), rect(4, 56, 112, 56, '#a08a72', 0, null), volcano(60, 58, 80, 40, ROCK), smoke(58, 18, 0.5), line('M60 20 L60 82', MAGMA, 4), ellipse(60, 92, 30, 12, MAGMA, C.ink, 1.4), ellipse(56, 90, 10, 3, LAVA, null), oval(60, 92, 34, 16)),
  'jinre.krater': all(bg(), path('M4 112 L4 70 C20 60 36 52 50 50 L70 50 C84 52 100 60 116 70 L116 112 Z', ROCK, C.ink, 1.4), ellipse(60, 54, 36, 12, ROCK2, C.ink, 1.4), ellipse(60, 57, 26, 7, '#4a3e34', null), ellipse(60, 58, 12, 3, MAGMA, null),
    steam(52, 54, 0.5), steam(68, 54, 0.4), tiny(30, 54, 0.9, C.red), tiny(92, 56, 0.9, C.denim), oval(60, 55, 42, 16)),
  'jinre.lava': all(bg('#f3ddc9'), path('M4 30 L40 20 L116 70 L116 112 L4 112 Z', BASALT, C.ink, 1.4), path('M30 24 C40 30 50 42 60 52 C72 64 86 80 100 112 L74 112 C66 92 58 80 48 68 C40 58 32 46 26 32 Z', LAVA, C.ink, 1.3),
    path('M34 32 C44 44 54 56 64 66 C74 78 84 92 90 112', 'none', C.yellow, 2.4), ...[[50, 56], [70, 80], [84, 100]].map(([x, y]) => ellipse(x!, y!, 4, 2, BASALT, null)), steam(40, 20, 0.5), oval(64, 70, 28, 40)),
  'jinre.stelna': all(bg('#f3ede2'), ellipse(28, 66, 20, 14, LAVA, C.ink, 1.4), path('M18 64 C24 58 32 70 38 62', 'none', C.yellow, 2), steam(28, 50, 0.4), arrow(52, 66, 72, 66, HL, 3), at(92, 66, 1, path('M-20 6 L-14 -10 L0 -14 L16 -8 L20 8 L4 14 L-12 12 Z', BASALT, C.ink, 1.4), line('M-8 -2 L8 -6', '#6a6878', 1)), thermo(62, 100, false), field(108, '#d4c4a8')),
  'jinre.pyroklastiskt-flöde': all(bg(), path('M4 112 L4 96 L40 40 L52 34 L60 38 L116 100 L116 112 Z', ROCK, C.ink, 1.4), ...[[50, 44, 8], [58, 56, 11], [68, 70, 13], [80, 84, 15], [94, 98, 16]].map(([x, y, r]) => circle(x!, y!, r!, ASH, C.ink, 1.1)),
    line('M36 60 L46 54 M40 74 L54 66 M52 88 L66 80', C.grey, 1.8), arrow(64, 50, 104, 92, HL, 2.6), smoke(50, 30, 0.5, ASH)),
  'jinre.slocknad': all(bg(), field(96, LAND), path('M14 98 L44 50 L76 50 L106 98 Z', '#7fa860', C.ink, 1.4), ellipse(60, 50, 16, 4, SEA, C.ink, 1.2), tree(34, 90, 0.5), tree(84, 88, 0.5), tree(60, 96, 0.5), oval(60, 62, 46, 30),
    greyed(at(100, 30, 0.45, volcano(0, 30, 50, 30, ROCK), smoke(0, 0, 0.8)))),
  'jinre.vulkanolog': all(bg(), path('M4 112 L4 80 C30 70 70 70 116 76 L116 112 Z', ROCK, C.ink, 1.3), steam(92, 78, 0.8), steam(102, 80, 0.6), ellipse(96, 80, 8, 2, '#4a3e34', null),
    stand(46, 104, 0.68, fig(60, C.orange, 'calm'), on(60, 1, helmetL()), reach(60, 1, 1, 90, 60)), at(80, 52, 1, rect(-6, -8, 12, 16, C.dark, 2, C.ink, 1), rect(-4, -6, 8, 6, '#a8e0a0', 1, null), line('M6 4 L18 22', C.dark, 1.6))),
  'jinre.varm-källa': all(bg('#e8eef0'), path('M4 112 L4 76 C30 70 90 70 116 76 L116 112 Z', '#b9ad98', null), ellipse(60, 86, 42, 14, '#9fd8d8', C.ink, 1.6), ...[[18, 80], [100, 82], [30, 98], [92, 98], [60, 102]].map(([x, y]) => ellipse(x!, y!, 8, 5, ROCK, C.ink, 1)),
    steam(46, 78, 0.8), steam(62, 76, 0.9), steam(78, 78, 0.8), at(98, 70, 1, path('M-6 -8 L6 -8 L5 4 L-5 4 Z', WOOD, C.ink, 1), line('M-6 -4 L6 -4', WOOD2, 0.8)), tree(14, 70, 0.5), oval(60, 82, 46, 22)),
  'jinre.gejser': all(bg(), field(100, '#b9ad98'), path('M54 100 C52 70 56 40 60 14 C64 40 68 70 66 100 Z', '#cfe8f4', C.ink, 1.2), path('M58 96 C57 70 59 44 60 24', 'none', C.white, 2), ...[[48, 26, 9], [72, 30, 9], [60, 14, 10]].map(([x, y, r]) => circle(x!, y!, r!, STEAM, C.ink, 1)),
    ellipse(60, 101, 14, 3, '#9fd8d8', C.ink, 1), tiny(18, 108, 1, C.red), tiny(28, 108, 0.9, C.green), tiny(100, 108, 1, C.denim), oval(60, 58, 16, 46)),
  // 2527 Bergskedjebildning
  'jinre.bergskedjebildning': all(bg(), ...[0, 1, 2].map((i) => all(rect(6 + i * 37, 22, 34, 56, SKY, 3, C.ink, 1.2), rect(6 + i * 37, 66, 34, 12, CONT, 0, C.ink, 1))),
    rect(6, 63, 34, 3, LAND, 0, C.ink, 0.8), arrow(10, 54, 18, 54, HL, 2.2), arrow(36, 54, 28, 54, HL, 2.2),
    path('M45 66 L52 58 L57 62 L62 54 L67 62 L71 58 L75 66 Z', ROCK, C.ink, 1.1), arrow(46, 46, 52, 46, HL, 2), arrow(74, 46, 68, 46, HL, 2),
    path('M81 66 L88 46 L93 54 L98 30 L103 54 L108 44 L113 66 Z', ROCK, C.ink, 1.2), path('M95 38 L98 30 L101 38 Z', SNOW, C.ink, 0.8),
    arrow(8, 92, 112, 92, C.ink, 2), line('M20 88 L20 96 M58 88 L58 96 M96 88 L96 96', C.ink, 1.4), ...[[20, 106], [58, 106], [96, 106]].map(([x, y], i) => at(x!, y!, 1, circle(0, 0, 5, C.white, C.ink, 1.2), line(`M0 0 L0 -3.5 M0 0 L${[2, 3, 0][i]} ${[2, 0, 3][i]}`, C.ink, 1)))),
  'jinre.kollision': all(bg('#eef0f2'), line('M4 92 L116 92', C.grey, 2), at(38, 80, 1, rect(-18, -12, 30, 18, C.red, 3, C.ink, 1.4), circle(-10, 8, 4, C.dark, C.ink, 1), circle(6, 8, 4, C.dark, C.ink, 1)),
    at(82, 80, 1, rect(-12, -12, 30, 18, '#3f7ab8', 3, C.ink, 1.4), circle(-4, 8, 4, C.dark, C.ink, 1), circle(12, 8, 4, C.dark, C.ink, 1)), star8(60, 70, 10, C.yellow), line('M8 66 L16 66 M6 74 L14 74 M104 66 L112 66 M106 74 L114 74', C.grey, 1.6), ring(60, 72, 18)),
  'jinre.trycka-ihop': all(bg('#f3ede2'), field(108, '#d9cdb3'), stand(60, 112, 1, fig(60, C.green, 'calm', { hairStyle: 'long' }), path('M46 52 L74 52 L71 59 L74 66 L71 73 L74 80 L46 80 L49 73 L46 66 L49 59 Z', C.tan, C.ink, 1.4), reach(60, 1, -1, 44, 66), reach(60, 1, 1, 76, 66)),
    arrow(14, 66, 34, 66, HL, 2.8), arrow(106, 66, 86, 66, HL, 2.8), greyed(at(102, 100, 0.5, rect(-14, -14, 28, 28, C.tan, 1, C.ink, 1.4)))),
  'jinre.veckning': all(bg(), ...['#8a5a32', SAND, ROCK, '#c9a27a', '#6f6458'].map((c, i) => path(`M4 ${40 + i * 12} C24 ${20 + i * 12} 40 ${20 + i * 12} 60 ${40 + i * 12} C80 ${60 + i * 12} 96 ${60 + i * 12} 116 ${40 + i * 12} L116 ${52 + i * 12} C96 ${72 + i * 12} 80 ${72 + i * 12} 60 ${52 + i * 12} C40 ${32 + i * 12} 24 ${32 + i * 12} 4 ${52 + i * 12} Z`, c, C.ink, 0.9)),
    rect(4, 100, 112, 12, '#6f6458', 0, null), arrow(6, 20, 22, 20, HL, 3), arrow(114, 20, 98, 20, HL, 3), oval(60, 58, 50, 32)),
  'jinre.veckberg': all(bg(), path('M4 112 L4 70 L26 34 L44 60 L64 22 L86 58 L104 36 L116 52 L116 112 Z', ROCK, C.ink, 1.4), path('M60 30 L64 22 L68 30 Z M23 40 L26 34 L29 40 Z M101 42 L104 36 L107 42 Z', SNOW, C.ink, 0.8),
    ...[0, 1, 2, 3].map((i) => path(`M8 ${80 + i * 8} C28 ${60 + i * 8} 44 ${60 + i * 8} 62 ${80 + i * 8} C80 ${100 + i * 8} 96 ${96 + i * 8} 112 ${76 + i * 8}`, 'none', ['#8a5a32', SAND, '#c9a27a', '#6f6458'][i]!, 3)), oval(60, 82, 52, 26)),
  'jinre.bergstopp': all(bg(), path('M4 112 L60 20 L116 112 Z', ROCK, C.ink, 1.4), path('M48 40 L60 20 L72 40 L66 36 L60 42 L54 36 Z', SNOW, C.ink, 1), line('M60 20 L60 6', C.dark, 1.4), path('M60 6 L72 9 L60 12 Z', C.red, C.ink, 0.8), cloud(24, 56, 0.7), cloud(98, 62, 0.6), ring(60, 22, 14)),
  'jinre.bergsbestigare': all(bg(), path('M4 112 L116 30 L116 112 Z', SNOW, C.ink, 1.4), path('M4 112 L116 30', 'none', C.ink, 1.4), line('M30 106 C46 90 58 82 70 74', C.red, 1.4, '3 2'),
    g('rotate(-20 60 100)', stand(60, 100, 0.62, fig(60, C.red, 'smile'), on(60, 1, helmetL(C.orange), path('M8 -40 L20 -40 L20 -14 L8 -14 Z', '#3f7ab8', C.ink, 1.2)), reach(60, 1, 1, 82, 40), line('M82 40 L82 62 M78 42 L88 38', C.dark, 2)))),
  'jinre.erosion': all(bg(), path('M4 112 L4 34 C20 30 36 44 50 60 C60 72 70 80 80 84 L116 88 L116 112 Z', ROCK, C.ink, 1.3), path('M4 34 C20 30 36 44 50 60 C60 72 70 80 80 84 L116 88', 'none', LAND2, 3),
    path('M18 40 C30 52 44 70 60 84 C74 96 92 100 116 100 L116 108 C90 108 72 104 56 92 C40 78 28 60 14 44 Z', SEA, C.ink, 1.2), path('M96 102 C104 100 110 104 116 102 L116 108 C108 110 100 108 96 102 Z', SAND, C.ink, 0.8),
    dots([[24, 48], [32, 58], [40, 68], [50, 80], [62, 90], [74, 98], [86, 102], [98, 104]], '#d9b26a', 1.8), arrow(30, 60, 46, 78, HL, 2.4), arrow(64, 96, 88, 104, HL, 2.4),
    line('M60 14 l-3 8 M72 18 l-3 8 M84 14 l-3 8 M96 18 l-3 8', '#3f86c4', 1.6), cloud(80, 12, 0.7)),
};
