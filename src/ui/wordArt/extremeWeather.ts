/**
 * Natur & geografi → Väder & klimat → Extremväder, 2631–2637 (0.43): storms and hurricanes, tornadoes,
 * floods, heat waves, drought, snowstorms and slippery roads, and weather warnings.
 * Recurring signs: wind as white/grey streaks whose number and length grow with the strength, a small
 * three-step strength bar (low–middle–high) under the wind words, dashed grey lines for the normal level
 * of water, red for heat and blue for cold, and an orange highlight ring or box on the thing that the word
 * names. Near words (storm/kuling/orkan, tromb/tornado, värmebölja/hetta, torka/torrperiod) differ in
 * strength, form or duration; abstract words and adjectives are small symbolic scenes with a grey
 * reference beside them. Digits only; no words, no brands, no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { HL, bolt } from './people';
import { P as F, type Mood, greyed, drop } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const SKY = '#e2eff8';
const STORMSKY = '#8a97a8';
const DARKSKY = '#5d6878';
const NIGHT = '#27335a';
const SEA = '#5fa3d0';
const SEA2 = '#3c7fb0';
const FLOOD = '#8fb0b8';
const FLOOD2 = '#6f949e';
const LAND = '#8cc96a';
const LAND2 = '#5f9e48';
const DRY = '#d9b46a';
const DRY2 = '#b8904a';
const SNOW = '#f7f8fa';
const HOT = '#f6d7a8';
const WARM = '#f08a5d';
const COLD = '#5aa7d6';
const WIND = '#ffffff';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const num = (x: number, y: number, n: string, size = 9, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${n}</text>`;

// ── Scenery ──────────────────────────────────────────────────────────
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const field = (y = 96, col: string = LAND) => rect(4, y, 112, 112 - y, col, 0, null);
const cloud = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', col, C.ink, 1.2));
const darkCloud = (x: number, y: number, s = 1) => cloud(x, y, s, '#6b7484');
const sun = (x: number, y: number, r = 7) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 3))} ${f1(y + Math.sin(a) * (r + 3))} L${f1(x + Math.cos(a) * (r + 7))} ${f1(y + Math.sin(a) * (r + 7))}`, C.gold, 2); }), circle(x, y, r, C.yellow, C.ink, 1.3));
const moon = (x: number, y: number, r = 7) => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${x} ${y + r} A${f1(r * 0.75)} ${r} 0 1 1 ${x} ${y - r} Z`, '#f4e7a8', C.ink, 1.1);
const stars = (pts: number[][], col: string = C.white) => all(...pts.map(([x, y]) => sparkle(x!, y!, 1.8, col)));
const tree = (x: number, y = 112, s = 1, col: string = LAND2) => at(x, y, s, rect(-2, -14, 4, 14, C.brown, 1, C.ink, 1), circle(0, -20, 9, col, C.ink, 1.2));
/** A tree bent by wind blowing to the right; b = bend 0–1. */
const bentTree = (x: number, y = 112, s = 1, b = 0.5, col: string = LAND2) => at(x, y, s, path(`M-2 0 Q${f1(-1 + b * 4)} -8 ${f1(b * 10)} -15 L${f1(b * 10 + 3)} -14 Q${f1(2 + b * 4)} -7 2 0 Z`, C.brown, C.ink, 1), ellipse(f1(b * 14), f1(-21 + b * 3), f1(9 + b * 3), f1(9 - b * 3), col, C.ink, 1.2));
const fir = (x: number, y = 112, s = 1, col: string = '#3f7d4e') => at(x, y, s, rect(-1.5, -6, 3, 6, C.brown, 0, null), path('M0 -30 L9 -6 L-9 -6 Z', col, C.ink, 1));
const house = (x: number, y: number, s = 1, col: string = '#e8d9c0', roof: string = '#b84a3a') => at(x, y, s, rect(-9, -12, 18, 12, col, 0, C.ink, 1.1), path('M-11 -12 L0 -21 L11 -12 Z', roof, C.ink, 1.1), rect(-2.5, -7, 5, 7, C.dark, 0, null));
const cottage = (x: number, y: number, s = 1) => house(x, y, s, '#b8402f', '#3d3f4a');
const car = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, path('M-12 0 L-12 -6 L-7 -6 L-4 -11 L6 -11 L9 -6 L12 -6 L12 0 Z', col, C.ink, 1.1), path('M-5 -6 L-3 -9.5 L1 -9.5 L1 -6 Z M3 -6 L3 -9.5 L5.5 -9.5 L7.5 -6 Z', '#cfe6f5', null), circle(-7, 0, 2.6, C.dark, C.ink, 0.8), circle(7, 0, 2.6, C.dark, C.ink, 0.8));
const bus = (x: number, y: number, s = 1) => at(x, y, s, rect(-20, -16, 40, 14, '#d64545', 3, C.ink, 1.2), ...range(4).map((i) => rect(-17 + i * 9, -13, 7, 5, '#cfe6f5', 1, null)), circle(-12, -2, 3, C.dark, C.ink, 0.8), circle(12, -2, 3, C.dark, C.ink, 0.8));
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.4);
const box = (x: number, y: number, w: number, h: number, col: string = HL, sw = 2.6) => rect(x, y, w, h, 'none', 3, col, sw);
const ban = (x: number, y: number, r = 7, w = 2.4) => all(circle(x, y, r, 'none', C.red, w), line(`M${f1(x - r * 0.7)} ${f1(y - r * 0.7)} L${f1(x + r * 0.7)} ${f1(y + r * 0.7)}`, C.red, w));
/** Thermometer with the bulb at (x, y); level 0–1. */
const thermo = (x: number, y: number, level: number, col: string = C.red, s = 1) => at(x, y, s, rect(-2.6, -26, 5.2, 26, C.white, 2.6, C.ink, 1.1), rect(-1.2, f1(-2 - 22 * level), 2.4, f1(2 + 22 * level), col, 1, null), circle(0, 2, 4.2, col, C.ink, 1.1), line('M2.6 -20 l2 0 M2.6 -14 l2 0 M2.6 -8 l2 0', C.ink, 0.8));
/** A vertical wavy heat line from (x, y) upwards. */
const heat = (x: number, y: number, h = 20, col: string = WARM, sw = 1.8) => line(`M${x} ${y} ` + range(Math.round(h / 5)).map((i) => `q${i % 2 ? -3 : 3} -2.5 0 -5`).join(' '), col, sw);
/** Wind streaks blowing to the right: n streaks between y0 and y1, length len. */
const wind = (x: number, y0: number, y1: number, n: number, len: number, col: string = WIND, sw = 2.2) => all(...range(n).map((i) => {
  const y = f1(y0 + (n === 1 ? 0 : (i * (y1 - y0)) / (n - 1))), xs = x + (i % 2) * 8;
  return all(line(`M${xs} ${y} L${xs + len} ${y} q6 0 6 -5 q0 -4 -4 -4`, C.ink, sw + 1.4), line(`M${xs} ${y} L${xs + len} ${y} q6 0 6 -5 q0 -4 -4 -4`, col, sw));
}));
/** Three-step strength bar (low, middle, high) with step k highlighted. */
const scale3 = (k: number, y = 104) => all(...range(3).map((i) => rect(34 + i * 18, y - 4 - i * 3, 14, 6 + i * 3, i <= k ? ['#9fd0ee', '#5f8fd0', '#2f4a9a'][i]! : C.grey2, 1, C.ink, 0.9)), rect(32 + k * 18, y - 6 - k * 3, 18, 10 + k * 3, 'none', 2, HL, 2.2));
const waves = (y: number, col: string = SEA, crest: string = C.white, h = 4) => all(path(`M4 ${y} ` + range(14).map(() => `q4 ${-h} 8 0`).join(' ') + ` L116 112 L4 112 Z`, col, C.ink, 1.1), ...range(7).map((i) => path(`M${10 + i * 16} ${y - h * 0.6} q2 -2 4 0`, 'none', crest, 1.6)));
const rain = (x0: number, x1: number, y: number, n = 6, col: string = '#6f8fc0', len = 7) => all(...range(n).map((i) => line(`M${f1(x0 + (i * (x1 - x0)) / Math.max(1, n - 1))} ${y + (i % 2) * 6} l-3 ${len}`, col, 1.6)));
const flakes = (pts: number[][], r = 2.2) => all(...pts.map(([x, y]) => all(line(`M${x! - r} ${y} L${x! + r} ${y} M${x} ${y! - r} L${x} ${y! + r} M${f1(x! - r * 0.7)} ${f1(y! - r * 0.7)} L${f1(x! + r * 0.7)} ${f1(y! + r * 0.7)} M${f1(x! - r * 0.7)} ${f1(y! + r * 0.7)} L${f1(x! + r * 0.7)} ${f1(y! - r * 0.7)}`, C.white, 1.3))));
const fig = (x: number, top: string, mood: Mood = 'smile', h = 1, more: Record<string, unknown> = {}) => F({ x, top, mood, h, ...more });
const boat = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M-14 0 L14 0 L10 6 L-10 6 Z', col, C.ink, 1.1), line('M0 0 L0 -18', C.ink, 1.2), path('M1 -17 L11 -2 L1 -2 Z', '#f3efe2', C.ink, 1));
/** Spiral storm seen from above (satellite view). */
const spiral = (cx: number, cy: number, r: number, col: string = C.white) => all(...range(4).map((i) => g(`rotate(${i * 90} ${cx} ${cy})`, path(`M${cx} ${cy - r * 0.18} C${f1(cx + r * 0.5)} ${f1(cy - r * 0.3)} ${f1(cx + r * 0.9)} ${f1(cy - r * 0.1)} ${f1(cx + r)} ${f1(cy + r * 0.45)}`, 'none', col, f1(r * 0.28)))),
  circle(cx, cy, f1(r * 0.38), col, null), circle(cx, cy, f1(r * 0.13), SEA2, C.ink, 0.8));
/** A funnel from a cloud base (x, y0) to the ground (x2, y1); w = top width, tip = bottom width. */
const funnel = (x: number, y0: number, x2: number, y1: number, w: number, tip: number, col = '#8d939e') => all(
  path(`M${x - w / 2} ${y0} C${x - w / 3} ${f1((y0 * 2 + y1) / 3)} ${x2 - tip} ${f1((y0 + y1 * 2) / 3)} ${x2 - tip / 2} ${y1} L${x2 + tip / 2} ${y1} C${x2 + tip} ${f1((y0 + y1 * 2) / 3)} ${x + w / 3} ${f1((y0 * 2 + y1) / 3)} ${x + w / 2} ${y0} Z`, col, C.ink, 1.2),
  ...range(4).map((i) => { const t = (i + 1) / 5, yy = f1(y0 + (y1 - y0) * t), xx = f1(x + (x2 - x) * t), ww = f1((w * (1 - t) + tip * t) / 2 - 1); return line(`M${f1(xx - ww)} ${yy} Q${xx} ${f1(yy + 2.4)} ${f1(xx + ww)} ${yy}`, '#c9ced4', 1); }));
const debris = (pts: number[][]) => all(...pts.map(([x, y], i) => g(`rotate(${i * 37} ${x} ${y})`, rect(x! - 2, y! - 1, 4, 2, i % 2 ? C.brown : C.grey, 0.5, C.ink, 0.6))));
const leaf = (x: number, y: number, rot = 0, col: string = '#d98a2b') => g(`translate(${x} ${y}) rotate(${rot})`, path('M-3 0 Q0 -3 3 0 Q0 3 -3 0 Z', col, C.ink, 0.7));
/** Curved arrow along a quadratic curve. */
const carrow = (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, col: string = HL, sw = 2.4) => {
  const tx = f1(x2 - (x2 - cx) * 0.15), ty = f1(y2 - (y2 - cy) * 0.15);
  return all(line(`M${x1} ${y1} Q${cx} ${cy} ${tx} ${ty}`, col, sw), arrow(tx, ty, x2, y2, col, sw));
};
/** River cross-section: banks at bankY, water surface at wy (above bankY = over the banks). */
const river = (wy: number, bankY = 80, col: string = SEA) => {
  const xl = (y: number) => f1(36 + ((y - bankY) / (104 - bankY)) * 10), xr = (y: number) => f1(84 - ((y - bankY) / (104 - bankY)) * 10);
  const water = wy >= bankY ? path(`M${xl(wy)} ${wy} L${xr(wy)} ${wy} L74 104 L46 104 Z`, col, null) : all(path(`M36 ${bankY} L84 ${bankY} L74 104 L46 104 Z`, col, null), rect(4, wy, 112, bankY - wy, col, 0, null));
  return all(path(`M4 ${bankY} L36 ${bankY} L46 104 L74 104 L84 ${bankY} L116 ${bankY} L116 112 L4 112 Z`, '#a58a62', C.ink, 1.1), rect(4, bankY - 2, 32, 2, LAND, 0, null), rect(84, bankY - 2, 32, 2, LAND, 0, null), water);
};
/** Measuring pole with marks; level line at y. */
const gauge = (x: number, y0: number, y1: number) => all(rect(x - 3, y0, 6, y1 - y0, C.white, 1, C.ink, 1), ...range(Math.floor((y1 - y0) / 6)).map((i) => line(`M${x - 3} ${y0 + 3 + i * 6} l${i % 2 ? 3 : 5} 0`, i % 2 ? C.ink : C.red, 1)));
const day = (x: number, y: number, inner: Svg, col: string = C.white) => all(rect(x - 8, y - 9, 16, 18, col, 2, C.ink, 1), rect(x - 8, y - 9, 16, 4, C.red, 1, null), inner);
const calRow = (y: number, n: number, icon: (x: number) => Svg, x0 = 16, dx = 20) => all(...range(n).map((i) => day(x0 + i * dx, y, icon(x0 + i * dx))));
const triangle = (x: number, y: number, s: number, col: string) => at(x, y, s, path('M0 -12 L12 9 L-12 9 Z', col, C.ink, 1.4), rect(-1.4, -5, 2.8, 8, C.ink, 1, null), circle(0, 5.6, 1.6, C.ink, null));
const phone = (x: number, y: number, s = 1, screen: Svg = '') => at(x, y, s, rect(-13, -22, 26, 44, C.dark, 4, C.ink, 1.4), rect(-10.5, -18, 21, 34, '#eaf3fa', 1.5, null), screen);
const radio = (x: number, y: number, s = 1, col: string = '#e0703a') => at(x, y, s, rect(-18, -12, 36, 24, col, 4, C.ink, 1.3), line('M-10 -12 L-16 -26', C.ink, 1.4), circle(-8, 1, 7, C.dark, C.ink, 1), ...range(3).map((i) => line(`M-13 ${-2 + i * 3} l10 0`, C.grey, 0.8)), rect(4, -6, 10, 5, '#f6f0c8', 1, C.ink, 0.8), circle(9, 5, 2.4, C.white, C.ink, 0.8));
const crank = (x: number, y: number) => all(line(`M${x} ${y} L${x + 8} ${y - 6}`, C.ink, 2.2), circle(x + 8, y - 6, 2.4, C.yellow, C.ink, 1), circle(x, y, 2.2, C.grey, C.ink, 1));
const jerry = (x: number, y: number, s = 1) => at(x, y, s, path('M-12 0 L-12 -26 L12 -26 L12 0 Z', '#4a90d9', C.ink, 1.3), path('M-6 -26 L-6 -32 L6 -32 L6 -26', 'none', C.ink, 2.4), rect(8, -14, 7, 4, C.white, 1, C.ink, 0.8), path('M-10 -20 L-10 -4 L10 -4 L10 -20 Z', 'rgba(255,255,255,0.25)', null));
const can = (x: number, y: number, s = 1, col: string = '#c94a3a') => at(x, y, s, rect(-5, -12, 10, 12, C.silver, 1, C.ink, 1), rect(-5, -9, 10, 6, col, 0, null));
const torch = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-10, -3, 14, 6, C.dark, 1.5, C.ink, 1), path('M4 -5 L9 -6 L9 6 L4 5 Z', '#7a7f8a', C.ink, 1));
const cow = (x: number, y: number, s = 1, flip = false) => g(`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`, rect(-14, -18, 26, 12, C.white, 5, C.ink, 1.2), path('M-6 -18 C-4 -12 2 -12 0 -18 Z M4 -10 C6 -14 10 -12 9 -8 Z', C.dark, null), line('M-11 -6 L-11 0 M-5 -6 L-5 0 M5 -6 L5 0 M10 -6 L10 0', C.ink, 2), ellipse(16, -16, 6, 5, C.white, C.ink, 1.2), ellipse(19, -14, 3, 2.4, '#f2b8b8', C.ink, 0.8), line('M13 -21 l-2 -3 M18 -21 l1 -3', C.ink, 1.2));
const grill = (x: number, y: number, s = 1) => at(x, y, s, path('M-12 -14 L12 -14 Q12 -2 0 -2 Q-12 -2 -12 -14 Z', C.dark, C.ink, 1.2), line('M-13 -15 L13 -15', C.grey, 2), line('M-6 -2 L-10 10 M6 -2 L10 10 M0 -2 L0 10', C.ink, 1.6), path('M-6 -16 C-8 -22 -2 -22 -4 -28 M2 -16 C0 -22 6 -22 4 -28', 'none', C.grey, 1.2));
const pump = (x: number, y: number, s = 1) => at(x, y, s, rect(-8, -10, 16, 10, '#e0b23c', 2, C.ink, 1.2), rect(-3, -14, 6, 4, C.dark, 1, C.ink, 0.8));
const ac = (x: number, y: number, s = 1) => at(x, y, s, rect(-20, -7, 40, 14, C.white, 4, C.ink, 1.3), line('M-16 3 L16 3', C.grey, 1.2), circle(14, -2, 1.4, '#3a9a5a', null));
const bed = (x: number, y: number) => all(rect(x - 34, y - 8, 68, 10, C.brown, 2, C.ink, 1.3), rect(x - 34, y - 22, 6, 24, C.brown, 2, C.ink, 1.2), rect(x - 26, y - 14, 14, 6, C.white, 3, C.ink, 1), line(`M${x - 32} ${y + 2} L${x - 32} ${y + 10} M${x + 32} ${y + 2} L${x + 32} ${y + 10}`, C.brown, 3));
const head = (x: number, y: number, mood: 'hot' | 'ok' = 'hot') => all(circle(x, y, 6, C.skin, C.ink, 1.2), path(`M${x - 6} ${y - 2} C${x - 6} ${y - 9} ${x + 6} ${y - 9} ${x + 6} ${y - 2} C${x + 3} ${y - 5} ${x - 3} ${y - 5} ${x - 6} ${y - 2} Z`, C.hair, C.ink, 1), mood === 'hot' ? all(line(`M${x - 3} ${y} l2 0 M${x + 1} ${y} l2 0`, C.ink, 1), path(`M${x - 2} ${y + 3.4} q2 -1.4 4 0`, 'none', C.ink, 1), drop(x + 8, y - 4, 0.5)) : all(circle(x - 2, y, 0.8, C.ink, null), circle(x + 2, y, 0.8, C.ink, null)));
const shelf = (x: number, y: number, w: number) => all(rect(x, y, w, 3, C.tan, 1, C.ink, 1));

// ── Motifs ───────────────────────────────────────────────────────────
export const EXTREME_WEATHER_MOTIFS: Record<string, Svg> = {
  // 2631 Stormar och orkaner
  'extrem.oväder': all(bg(STORMSKY), field(98, '#6f9e58'), darkCloud(36, 22, 1.4), darkCloud(84, 20, 1.5), rain(20, 100, 36, 10, '#dfe8f2', 9), bolt(60, 46, 1), wind(10, 62, 76, 2, 18),
    house(80, 98, 1.6, '#e8d9c0', '#8c4a3a'), rect(84, 80, 7, 6, '#f6e7a0', 0, C.ink, 0.8), bentTree(26, 98, 1, 0.6), box(6, 8, 108, 52)),
  'extrem.storm': all(bg(STORMSKY), field(98, '#6f9e58'), darkCloud(30, 18, 1.1), darkCloud(84, 16, 1.2), wind(6, 34, 66, 4, 26), bentTree(20, 98, 1.2, 0.9), bentTree(50, 98, 1, 0.9),
    at(80, 98, 1, rect(-2, -6, 4, 6, C.brown, 1, C.ink, 1), g('rotate(68 0 -4)', rect(-2, -30, 4, 26, C.brown, 1, C.ink, 1), circle(0, -36, 8, LAND2, C.ink, 1.2))), leaf(70, 40, 20), leaf(80, 56, 70, LAND2), leaf(100, 46, 140, LAND2), scale3(1)),
  'extrem.kuling': all(bg('#b8c6d4'), cloud(28, 18, 1, '#dfe4ea'), cloud(84, 22, 0.9, '#dfe4ea'), waves(70, SEA, C.white, 5), wind(8, 38, 52, 2, 22),
    rect(4, 82, 40, 30, '#9a9488', 0, C.ink, 1), at(26, 82, 0.9, boat(0, 0, 1)), line('M14 82 L10 76', C.ink, 1), at(84, 82, 0.7, boat(0, -6, 1, C.white)), g('rotate(14 84 76)', rect(66, 72, 2, 2, 'none', 0, null)), scale3(0)),
  'extrem.orkan': all(bg(DARKSKY), field(98, '#5f8a4c'), darkCloud(60, 16, 1.6), wind(4, 30, 74, 6, 32), house(30, 98, 1.6, '#e8d9c0', '#8c4a3a'),
    g('rotate(-24 84 54)', path('M70 54 L98 54 L92 44 L76 44 Z', '#8c4a3a', C.ink, 1.2)), arrow(52, 66, 70, 56, HL, 2.2), debris([[100, 70], [108, 84], [92, 86], [104, 40]]), bentTree(80, 98, 1, 1), scale3(2)),
  'extrem.extremväder': all(bg('#f3f0ea'),
    rect(6, 6, 52, 40, DARKSKY, 3, C.ink, 1.2), wind(8, 16, 30, 2, 16), house(22, 44, 1.1), g('rotate(-28 44 22)', path('M34 24 L52 24 L48 18 L38 18 Z', '#8c4a3a', C.ink, 1)), bentTree(46, 44, 0.7, 1),
    rect(62, 6, 52, 40, '#f4b26a', 3, C.ink, 1.2), sun(88, 22, 9), heat(70, 44, 14, C.red, 2), heat(106, 44, 14, C.red, 2), thermo(108, 36, 1, C.red, 0.5),
    rect(6, 50, 52, 40, '#9fb0c0', 3, C.ink, 1.2), house(32, 86, 1.6), rect(7, 66, 50, 23, 'rgba(111,148,158,0.85)', 0, null), line('M7 66 L57 66', C.ink, 1), rain(12, 52, 52, 6, '#3c5f90'),
    rect(62, 50, 52, 40, '#b9c4d0', 3, C.ink, 1.2), house(88, 86, 1.6), path('M63 89 L63 70 C76 64 100 66 113 70 L113 89 Z', SNOW, C.ink, 1), wind(64, 56, 62, 2, 12, '#eef2f6', 1.6), flakes([[70, 58], [84, 56], [104, 60], [96, 54]], 2),
    rect(4, 4, 112, 88, 'none', 4, HL, 2.6), triangle(60, 48, 0.8, '#f2a03c'),
    greyed(rect(40, 94, 40, 16, SKY, 2, C.ink, 1), sun(52, 102, 3), cloud(68, 102, 0.35))),
  'extrem.dra-in-över': all(bg(SKY), path('M4 4 L64 4 C58 30 66 60 60 112 L4 112 Z', STORMSKY, null), waves(88, SEA, C.white, 3), path('M60 88 L116 88 L116 112 L60 112 Z', '#d9c38a', null), line('M60 88 L116 88', C.ink, 1),
    darkCloud(22, 22, 1.3), darkCloud(48, 30, 1.1), rain(8, 56, 40, 8, '#dfe8f2'), sun(98, 18, 7), house(88, 88, 1), house(106, 88, 0.8), carrow(42, 54, 64, 46, 86, 54, HL, 3)),
  'extrem.blåsa-omkull': all(bg('#c8d2dc'), field(98, '#6f9e58'), wind(6, 30, 54, 3, 22), greyed(tree(20, 98, 1.1)),
    at(70, 98, 1, rect(-3, -4, 6, 4, C.brown, 1, C.ink, 1), g('rotate(64 0 -2)', rect(-2.5, -34, 5, 32, C.brown, 1, C.ink, 1), circle(0, -42, 11, LAND2, C.ink, 1.2))), carrow(62, 50, 84, 52, 98, 76, HL, 2.6), arrow(36, 80, 52, 80, C.grey, 1.6)),
  'extrem.rotvälta': all(bg(SKY), field(92, '#6f8e4c'), fir(12, 92, 1.1), fir(108, 92, 0.9),
    ellipse(36, 94, 12, 4, '#5a4632', C.ink, 1), rect(44, 80, 46, 7, C.brown, 2, C.ink, 1.2), path('M86 70 L112 83 L86 96 Z', '#3f7d4e', C.ink, 1.2), path('M80 74 L100 83 L80 92 Z', '#4f8f5e', C.ink, 1),
    path('M28 94 C20 66 52 62 48 94 Z', '#7a5a3c', C.ink, 1.3), ...[[-7, -8], [0, -14], [7, -8], [-3, -4], [4, -18]].map(([dx, dy]) => line(`M38 84 l${dx} ${dy}`, '#4a3626', 1.6)), oval(38, 78, 16, 18)),
  'extrem.orkan.2': all(bg('#1f2a48'), stars([[12, 12], [108, 14], [104, 100]]), rect(4, 70, 112, 42, SEA2, 0, null), path('M4 4 L116 4 L116 70 L4 70 Z', SEA, null), path('M70 70 C76 58 96 56 116 62 L116 80 L84 82 Z', LAND, C.ink, 1), spiral(48, 46, 30), ring(48, 46, 36), thermo(102, 32, 0.8, C.red, 0.7)),
  'extrem.stormflod': all(bg(STORMSKY), darkCloud(30, 18, 1.1), wind(10, 32, 44, 2, 22), path('M4 70 L60 70 L60 112 L4 112 Z', '#b9b0a0', C.ink, 1), house(16, 70, 1.1), house(40, 70, 1.1, '#e8d9c0', '#3d6fa0'),
    path('M4 76 C30 72 50 78 116 66 L116 112 L4 112 Z', 'rgba(95,163,208,0.85)', C.ink, 1), line('M60 92 L116 92', C.grey, 1.6, '4 3'), path('M70 66 q8 -10 16 0 q8 -10 16 0', 'none', C.white, 2), arrow(108, 82, 70, 76, HL, 3), arrow(96, 100, 96, 72, HL, 2.2)),

  // 2632 Tromber och tornador
  'extrem.tromb': all(bg('#b4c0cc'), field(96, LAND), path('M4 4 L116 4 L116 30 C80 36 40 36 4 30 Z', '#6b7484', null), funnel(62, 30, 56, 96, 20, 3), ellipse(56, 96, 9, 3, 'rgba(160,140,110,0.7)', null), debris([[48, 88], [66, 86], [60, 80]]),
    cottage(96, 96, 1.2), tree(16, 96, 0.8), tree(28, 96, 0.6), ring(58, 62, 26)),
  'extrem.tornado': all(bg('#9aa6b4'), rect(4, 90, 112, 22, '#d6c08a', 0, null), line('M4 90 L116 90', C.ink, 0.8), path('M4 4 L116 4 L116 26 C80 32 40 32 4 26 Z', '#4f5868', null), funnel(62, 26, 66, 90, 64, 18), ellipse(66, 90, 26, 5, 'rgba(140,120,90,0.8)', null),
    debris([[34, 70], [96, 62], [40, 52], [100, 80], [28, 84], [92, 44]]), car(98, 78, 0.6, C.denim), g('rotate(30 30 60)', rect(26, 58, 10, 4, C.brown, 1, C.ink, 0.8)), house(14, 90, 0.6), box(6, 26, 108, 70)),
  'extrem.virvelvind': all(bg('#f2e6c8'), field(96, DRY), sun(98, 18, 7), carrow(44, 92, 30, 86, 44, 80, HL, 2), carrow(44, 80, 62, 74, 48, 66, HL, 2), carrow(48, 66, 30, 58, 46, 50, HL, 2),
    ...[[38, 88, 0], [54, 78, 60], [36, 70, 120], [56, 60, 30], [40, 52, 90]].map(([x, y, r]) => leaf(x!, y!, r!)), ellipse(46, 96, 12, 2.6, 'rgba(160,130,80,0.5)', null), fig(90, C.green, 'shock', 0.7)),
  'extrem.virvla': all(bg('#d8e4ee'), field(98, SNOW), house(32, 98, 1.6, '#e8d9c0', '#8c4a3a'), carrow(70, 90, 112, 76, 92, 50, '#7aa0c8', 1.6), carrow(92, 50, 66, 30, 52, 44, '#7aa0c8', 1.6), carrow(52, 44, 64, 66, 84, 64, '#7aa0c8', 1.6),
    flakes([[74, 86], [100, 72], [96, 52], [74, 34], [56, 46], [66, 62], [86, 62], [108, 88]], 2.6), oval(82, 60, 32, 32)),
  'extrem.trattformad': all(bg('#f6f2ea'), path('M14 30 L58 30 L40 96 L32 96 Z', '#b9c4d0', C.ink, 1.6), ellipse(36, 30, 22, 5, '#d4dde6', C.ink, 1.4), box(10, 22, 52, 80),
    greyed(rect(74, 30, 30, 66, '#b9c4d0', 2, C.ink, 1.6), ellipse(89, 30, 15, 4, '#d4dde6', C.ink, 1.4)), arrow(36, 44, 36, 84, HL, 2)),
  'extrem.skydrag': all(bg('#aab8c6'), path('M4 4 L116 4 L116 28 C80 34 40 34 4 28 Z', '#5d6878', null), waves(80, SEA, C.white, 3), funnel(54, 28, 60, 80, 16, 3, '#9aa2ae'), ellipse(60, 80, 10, 3, 'rgba(255,255,255,0.8)', null),
    at(100, 84, 0.6, boat(0, 0, 1)), ring(58, 58, 26), path('M4 100 L36 100 L44 112 L4 112 Z', '#d9c38a', null)),
  'extrem.slita-loss': all(bg(STORMSKY), field(100, '#6f9e58'), wind(6, 24, 44, 3, 20), rect(16, 66, 46, 34, '#e8d9c0', 0, C.ink, 1.2), path('M12 66 L39 46 L66 66 Z', '#7a7f8a', C.ink, 1.2), rect(34, 82, 9, 18, C.dark, 0, null),
    path('M39 46 L66 66 L54 66 Z', '#d9c9b0', C.ink, 0.8), g('rotate(-30 84 46)', rect(68, 42, 32, 8, '#9aa3ad', 1, C.ink, 1.2), line('M72 46 L96 46', C.ink, 0.6)), arrow(62, 56, 78, 44, HL, 2.6), line('M60 58 l3 -3 M57 60 l3 -3', C.ink, 1.2)),
  'extrem.stormjägare': all(bg('#9aa6b4'), rect(4, 90, 112, 22, '#d6c08a', 0, null), path('M4 4 L116 4 L116 22 C80 28 40 28 4 22 Z', '#4f5868', null), funnel(28, 22, 30, 90, 30, 8), car(76, 104, 1.6, '#e8e4dc'),
    fig(104, C.orange, 'shock', 0.62), rect(86, 60, 10, 7, C.dark, 1, C.ink, 1), circle(86, 63.5, 2.6, '#9fc4e6', C.ink, 0.8), line('M96 64 L100 66', C.skin, 3), line('M84 63 L52 56', HL, 1.4, '3 2')),
  'extrem.fönsterlös': all(bg('#f3eee4'), rect(4, 104, 112, 8, '#c9b593', 0, null),
    rect(10, 46, 44, 58, '#e8dcc4', 0, C.ink, 1.6), path('M6 46 L32 26 L58 46 Z', '#b84a3a', C.ink, 1.4), rect(27, 88, 10, 16, C.dark, 0, C.ink, 1), box(6, 22, 52, 84),
    greyed(rect(66, 46, 44, 58, '#e8dcc4', 0, C.ink, 1.6), path('M62 46 L88 26 L114 46 Z', '#b84a3a', C.ink, 1.4), ...[[72, 54], [92, 54], [72, 72], [92, 72]].map(([x, y]) => rect(x!, y!, 12, 12, '#cfe6f5', 1, C.ink, 1.2)), rect(83, 88, 10, 16, C.dark, 0, C.ink, 1))),

  // 2633 Översvämningar
  'extrem.vattennivå': all(bg(SKY), river(90), gauge(60, 40, 104), line('M38 90 L82 90', HL, 2.6), arrow(98, 104, 98, 92, HL, 2.4), arrow(98, 76, 98, 88, HL, 2.4), tree(16, 78, 0.7), tree(104, 78, 0.7)),
  'extrem.högvatten': all(bg('#d4dde6'), cloud(30, 18, 0.9, C.grey2), river(78, 80), line('M44 96 L76 96', C.grey, 1.6, '4 3'), gauge(60, 50, 104), line('M28 78 L92 78', HL, 2.6), tree(16, 78, 0.7), tree(104, 78, 0.7), arrow(100, 98, 100, 82, HL, 2)),
  'extrem.svämma-över': all(bg('#c8d2dc'), cloud(60, 16, 1, C.grey2), rain(40, 80, 26, 5), river(74, 80), path('M4 78 L116 78 L116 84 L4 84 Z', 'rgba(95,163,208,0.85)', null), line('M44 98 L76 98', C.grey, 1.6, '4 3'),
    arrow(40, 78, 14, 78, HL, 2.6), arrow(80, 78, 106, 78, HL, 2.6), tree(22, 78, 0.7), tree(98, 78, 0.7)),
  'extrem.översvämma': all(bg('#c8d2dc'), field(80, LAND), house(30, 80, 1.3), house(92, 80, 1.3, '#e8d9c0', '#3d6fa0'), tree(60, 80, 0.8), rect(4, 78, 112, 34, 'none', 0, null),
    path('M4 112 L4 72 C24 70 40 74 60 72 C80 70 96 74 116 72 L116 112 Z', 'rgba(111,148,158,0.75)', C.ink, 1), arrow(14, 96, 28, 96, HL, 2.2), arrow(106, 96, 92, 96, HL, 2.2), arrow(60, 104, 60, 90, HL, 2.2), cloud(60, 20, 1, C.grey2), rain(44, 76, 30, 5)),
  'extrem.stå-under-vatten': all(bg('#d4dde6'), rect(4, 46, 112, 66, FLOOD, 0, null), line('M4 46 L116 46', FLOOD2, 1.4), rect(10, 20, 30, 26, '#e8d9c0', 0, C.ink, 1.1), path('M6 20 L25 8 L44 20 Z', '#8c4a3a', C.ink, 1.1),
    car(76, 70, 1.4, C.red), line('M100 46 L100 16', C.ink, 1.6), circle(100, 14, 6, C.white, C.red, 2), rect(4, 46, 112, 66, 'rgba(111,148,158,0.55)', 0, null), line('M4 46 L116 46', C.ink, 1), box(56, 52, 44, 30)),
  'extrem.vårflod': all(bg(SKY), sun(100, 16, 7), path('M4 80 L4 58 L28 22 L48 50 L66 26 L96 66 L116 70 L116 80 Z', '#9a8a78', C.ink, 1.2), path('M20 35 L28 22 L36 34 L32 38 L28 34 L24 38 Z M58 38 L66 26 L74 38 L70 42 L66 38 L62 42 Z', SNOW, C.ink, 0.8),
    ...[[30, 40], [64, 44]].map(([x, y]) => all(drop(x!, y! + 6, 0.5), arrow(x!, y! + 10, x!, y! + 18, '#5fa3d0', 1.6))), river(78, 80), line('M44 96 L76 96', C.grey, 1.6, '4 3'), arrow(100, 98, 100, 82, HL, 2.2),
    at(18, 78, 0.8, rect(-1.5, -16, 3, 16, C.white, 1, C.ink, 1), ...[[-5, -18], [4, -20], [0, -24], [6, -14], [-6, -12]].map(([x, y]) => circle(x!, y!, 2.6, '#a8dc7a', C.ink, 0.6))), path('M86 78 l2 -4 l2 4 M94 78 l2 -5 l2 5', 'none', '#e0b23c', 1.6)),
  'extrem.länsa': all(bg('#efe8dc'), rect(4, 50, 112, 4, C.dark, 0, null), rect(4, 4, 112, 46, SKY, 0, null), field(46, LAND), rect(8, 54, 104, 54, '#d9cfbf', 0, C.ink, 1.2), rect(9, 90, 102, 17, FLOOD, 0, null), line('M9 76 L111 76', C.grey, 1.4, '4 3'),
    pump(38, 100, 1), line('M38 86 C38 70 52 66 52 40 L70 40', '#3d6fa0', 3), arrow(70, 40, 86, 40, HL, 2.6), path('M86 38 q6 2 10 8', 'none', '#5fa3d0', 2.4), fig(80, C.denim, 'smile', 0.5), arrow(54, 98, 44, 98, HL, 1.8)),

  // 2634 Värmeböljor
  'extrem.maxtemperatur': all(bg('#fbf4e6'), line('M14 96 L108 96 M14 96 L14 20', C.ink, 1.4), path('M14 84 C30 82 40 40 60 34 C80 40 90 80 108 82', 'none', WARM, 3), circle(60, 34, 4, C.red, C.ink, 1), ring(60, 34, 9),
    sun(60, 14, 5), moon(20, 106, 4), moon(104, 106, 4), line('M60 43 L60 96', C.grey, 1, '3 2'), thermo(100, 46, 0.85, C.red, 0.8)),
  'extrem.i-sträck': all(bg('#f6f2ea'), calRow(46, 7, (x) => sun(x, 48, 3), 13, 15.6), path('M8 32 Q60 6 112 32', 'none', HL, 3), line('M8 32 L8 38 M112 32 L112 38', HL, 3), box(4, 34, 112, 24),
    greyed(calRow(92, 7, (x) => (x === 13 + 15.6 * 2 || x === 13 + 15.6 * 5 ? all(rect(x - 4, 92, 8, 2, C.grey, 1, null)) : sun(x, 94, 3)), 13, 15.6))),
  'extrem.värmebölja': all(bg(HOT), sun(102, 18, 7), calRow(18, 5, (x) => sun(x, 20, 2.6), 14, 18), rect(5, 7, 90, 22, 'none', 3, HL, 2.2), rect(4, 98, 112, 14, '#c9b08a', 0, null), house(22, 98, 1.5), house(98, 98, 1.5, '#e8d9c0', '#3d6fa0'),
    ...[40, 76].map((x) => heat(x, 92, 22)), heat(52, 60, 14), heat(68, 60, 14), fig(60, C.yellow, 'sick', 0.5), drop(70, 58, 0.6), thermo(108, 70, 0.9, C.red, 0.7)),
  'extrem.tropisk-natt': all(bg(NIGHT), stars([[14, 14], [52, 22], [70, 10], [86, 18]]), rect(4, 84, 112, 28, '#5a4a6a', 0, null), rect(10, 30, 30, 26, '#3a4a7a', 1, C.ink, 1.2), line('M25 30 L25 56 M10 43 L40 43', C.ink, 1), moon(32, 37, 3),
    bed(64, 94), head(44, 76), path('M50 80 L94 80 L96 86 L50 86 Z', '#f2c0c0', C.ink, 1), heat(70, 74, 12, WARM, 1.4), heat(82, 74, 12, WARM, 1.4), thermo(102, 66, 0.6, C.red, 0.8), num(102, 34, '20', 9, C.white), oval(102, 52, 11, 28)),
  'extrem.värmerekord': all(bg('#fbf4e6'), line('M10 40 L110 40', C.grey, 2, '5 4'), greyed(thermo(30, 100, 0.55, C.red, 2.6)), thermo(76, 100, 1, C.red, 2.6), line('M70 30 L82 24 M72 40 L84 38', C.red, 1.6), sparkle(86, 28, 4, C.gold), sparkle(64, 32, 3, C.gold),
    at(100, 26, 1, path('M-8 -12 L8 -12 L6 0 C4 6 -4 6 -6 0 Z', C.gold, C.ink, 1.2), path('M-8 -10 C-14 -10 -14 -2 -6 -1 M8 -10 C14 -10 14 -2 6 -1', 'none', C.ink, 1.2), rect(-2, 5, 4, 5, C.gold, 0, C.ink, 1), rect(-7, 10, 14, 4, C.brown, 1, C.ink, 1), num(0, -3, '1', 8)), box(62, 8, 28, 102)),
  'extrem.uttorkning': all(bg(HOT), sun(100, 18, 8), field(100, '#c9b08a'), fig(46, C.sky, 'sick', 0.9), drop(62, 30, 0.6), drop(30, 36, 0.6), at(84, 100, 1, path('M-6 0 L-6 -22 L-3 -26 L3 -26 L6 -22 L6 0 Z', 'rgba(220,240,252,0.6)', C.ink, 1.2), rect(-3, -30, 6, 4, C.denim, 1, C.ink, 0.8)), ring(84, 86, 16),
    at(96, 52, 0.9, drop(0, 0, 1.6, '#8cc7e8')), line('M90 58 L102 46', C.red, 2.4)),
  'extrem.luftkonditionering': all(bg('#eef4f8'), rect(4, 100, 112, 12, '#c9b593', 0, null), rect(12, 40, 32, 30, HOT, 1, C.ink, 1.2), sun(28, 52, 5), ac(76, 24, 1.2), ...[60, 76, 92].map((x) => all(line(`M${x} 34 q-4 8 0 16 q4 8 0 16`, COLD, 1.8))),
    fig(80, C.green, 'calm', 0.6), thermo(104, 92, 0.25, COLD, 0.6), oval(76, 24, 28, 12)),

  // 2635 Torka
  'extrem.torka-noun': all(bg('#f2e2bc'), sun(96, 18, 10), rect(4, 66, 112, 46, DRY, 0, null), line('M4 66 L116 66', C.ink, 1), ...[[14, 74, 30, 90, 22, 104], [44, 70, 54, 84, 46, 100], [70, 76, 84, 88, 78, 106], [96, 70, 104, 86, 112, 96]].map(([a, b, c, d, e, h]) => line(`M${a} ${b} L${c} ${d} L${e} ${h}`, DRY2, 1.6)),
    ...[20, 40, 60, 80].map((x) => all(line(`M${x} 66 l0 -10`, '#9a7a3a', 1.4), path(`M${x} 58 q-5 0 -6 5 M${x} 60 q5 0 6 5`, 'none', '#9a7a3a', 1.2))), path('M4 40 C30 52 60 44 116 56', 'none', 'rgba(255,255,255,0)', 1), cloud(30, 22, 0.6, 'rgba(255,255,255,0.4)'), box(6, 64, 108, 46)),
  'extrem.foderbrist': all(bg(SKY), field(92, DRY), rect(30, 92, 50, 10, C.brown, 1, C.ink, 1.2), rect(32, 90, 46, 4, '#7a5a3a', 0, null), path('M50 92 q4 -4 8 0', 'none', '#d9c06a', 1.6),
    cow(18, 92, 1.1), cow(100, 92, 1.1, true), ring(55, 92, 18), greyed(at(98, 40, 1, rect(-12, -8, 24, 16, '#e8d06a', 2, C.ink, 1))), line('M86 32 L110 48', C.red, 2.4)),
  'extrem.grillförbud': all(bg('#f2e6c8'), field(94, DRY), fir(14, 94, 1.1), fir(30, 94, 0.9), fir(100, 94, 1.2), grill(62, 94, 1.4), ban(62, 60, 26, 4)),

  // 2636 Snöoväder och halka
  'extrem.snöoväder': all(bg('#aeb8c4'), field(96, SNOW), cloud(60, 16, 1.6, '#8a94a2'), wind(6, 40, 60, 3, 20, '#eef2f6'), flakes([[18, 34], [40, 30], [70, 34], [96, 32], [28, 70], [60, 74], [84, 66], [104, 76], [48, 52], [90, 50]], 2.6),
    house(30, 96, 1.4), path('M4 96 C20 86 34 92 46 96 Z', SNOW, C.ink, 0.8), fir(90, 96, 1.1, '#5f8a6a'), path('M70 96 C86 84 104 88 116 96 Z', SNOW, C.ink, 0.8)),
  'extrem.snökaos': all(bg('#c8d0da'), rect(4, 80, 112, 32, '#e6eaf0', 0, null), flakes([[14, 18], [40, 14], [70, 20], [98, 12], [24, 40], [60, 36], [92, 42]], 2.2), bus(34, 84, 1.1), car(78, 92, 1.1, C.denim), car(102, 100, 0.9, C.yellow),
    path('M4 86 C20 78 50 82 64 88 L64 112 L4 112 Z', SNOW, C.ink, 0.8), path('M64 98 C80 90 100 94 116 92 L116 112 L64 112 Z', SNOW, C.ink, 0.8), triangle(92, 60, 0.9, C.yellow), box(6, 50, 108, 58)),
  'extrem.insnöad': all(bg('#d4dce6'), flakes([[10, 14], [34, 10], [58, 16], [82, 10], [106, 14]], 2),
    rect(10, 42, 54, 44, '#b8402f', 0, C.ink, 1.3), path('M6 42 L37 20 L68 42 Z', C.white, C.ink, 1.3), rect(40, 50, 18, 14, '#f6e7a0', 1, C.ink, 1), head(49, 59, 'ok'), path('M46 62.5 q3 -1.6 6 0', 'none', C.ink, 0.9), rect(16, 58, 12, 28, C.dark, 0, C.ink, 1),
    path('M4 112 L4 62 C14 54 30 56 38 66 C48 70 60 70 72 76 L72 112 Z', SNOW, C.ink, 1.2), oval(24, 70, 14, 18), carrow(40, 34, 30, 28, 22, 50, HL, 2),
    greyed(rect(78, 66, 34, 30, '#b8402f', 0, C.ink, 1.1), path('M75 66 L95 52 L115 66 Z', C.white, C.ink, 1.1), rect(84, 78, 8, 18, C.dark, 0, null), path('M72 112 L72 98 L84 96 L92 96 L116 98 L116 112 Z', SNOW, C.ink, 0.8), rect(84, 96, 8, 16, '#9aa3ad', 0, null))),
  'extrem.köra-fast.2': all(bg('#d4dce6'), field(92, SNOW), g('rotate(-6 56 88)', car(56, 92, 2.2, C.red)), path('M14 112 L14 92 C30 86 44 92 52 98 C66 92 84 88 106 94 L106 112 Z', SNOW, C.ink, 0.9),
    ...[[30, 82], [26, 74], [36, 76], [22, 84]].map(([x, y]) => circle(x!, y!, 2, C.white, C.ink, 0.6)), carrow(48, 100, 36, 108, 30, 96, HL, 2), path('M36 92 q-8 -10 -16 -6', 'none', C.grey, 1.4), oval(42, 98, 14, 9)),

  // 2637 Vädervarningar
  'extrem.vädervarning': all(bg(STORMSKY), darkCloud(28, 22, 1), wind(8, 40, 52, 2, 14), phone(68, 66, 1.6), triangle(68, 52, 0.9, '#f2a03c'), darkCloud(68, 80, 0.5), line('M60 86 l-2 4 M68 86 l-2 4 M76 86 l-2 4', C.denim, 1), box(48, 30, 40, 72)),
  'extrem.varningsnivå': all(bg('#f6f2ea'), triangle(24, 74, 1.1, '#f2d34e'), triangle(60, 66, 1.4, '#f2a03c'), triangle(98, 56, 1.8, '#e04a3a'), carrow(16, 40, 50, 18, 92, 22, HL, 2.6), line('M8 100 L112 100', C.grey, 1.4)),
  'extrem.hålla-sig-uppdaterad': all(bg('#eef2f6'), fig(30, C.denim, 'smile', 0.9), phone(58, 58, 0.8, all(triangle(0, -4, 0.45, '#f2a03c'), line('M-6 8 L6 8 M-6 11 L3 11', C.grey, 1))), line('M44 58 L46 66', C.skin, 4),
    carrow(78, 34, 104, 30, 104, 56, HL, 2.4), carrow(104, 60, 104, 84, 80, 82, HL, 2.4), radio(96, 98, 0.6), at(92, 42, 1, circle(0, 0, 8, C.white, C.ink, 1.2), line('M0 0 L0 -5 M0 0 L4 2', C.ink, 1.4))),
  'extrem.hemberedskap': all(bg(SKY), rect(4, 106, 112, 6, LAND, 0, null), path('M8 40 L50 10 L92 40 Z', '#b84a3a', C.ink, 1.4), rect(12, 40, 76, 66, '#f6efe0', 0, C.ink, 1.6), line('M50 40 L50 106', C.ink, 1.2),
    rect(16, 50, 26, 22, '#cfe6f5', 1, C.ink, 1), fig(30, C.green, 'smile', 0.32), fig(40, C.orange, 'smile', 0.26),
    shelf(54, 68, 32), shelf(54, 88, 32), shelf(54, 104, 32), jerry(62, 68, 0.5), jerry(74, 68, 0.5), can(82, 68, 0.7), can(60, 88, 0.7), can(68, 88, 0.7, '#3a8a5a'), radio(78, 86, 0.4), torch(66, 102, 0.7), at(80, 104, 0.8, rect(-2, -10, 4, 10, C.white, 1, C.ink, 0.8)), box(52, 54, 36, 54),
    greyed(at(104, 106, 1, rect(-10, -36, 20, 36, '#e6d6b8', 1, C.ink, 1.2), line('M-10 -24 L10 -24 M-10 -12 L10 -12', C.ink, 1)))),
  'extrem.vattendunk': all(bg('#eef4f8'), rect(4, 100, 112, 12, '#c9b593', 0, null), jerry(60, 100, 2.4), arrow(100, 70, 100, 92, HL, 2.2), path('M96 64 q4 -6 8 0 q0 6 -4 6 q-4 0 -4 -6 Z', '#8cc7e8', C.ink, 1), oval(60, 64, 34, 40)),
  'extrem.vevradio': all(bg('#f3ede2'), rect(4, 100, 112, 12, '#c9b593', 0, null), radio(52, 72, 2.2), crank(92, 70), carrow(100, 54, 116, 70, 102, 86, HL, 2.4), ...[[24, 26], [30, 20]].map(([x, y]) => path(`M${x} ${y} q4 -4 8 0`, 'none', C.ink, 1.2)), ring(96, 66, 12)),
};
