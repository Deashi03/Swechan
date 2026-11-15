/**
 * Natur & geografi → Väder & klimat → Atmosfären, 2611–2617 (0.43): the gases of the air, air pressure,
 * humidity, heat transfer, how wind arises, cloud formation and the layers of the atmosphere.
 * Recurring signs: gas molecules as coloured balls (blue pairs = nitrogen, red pairs = oxygen, a single
 * purple ball = argon, small blue balls = water vapour), red for warm and blue for cold, side cross-sections
 * with sky above the ground, processes with arrows, and an orange highlight ring or band on the thing that
 * the word names. Contrast pairs (high/low pressure, sea/land breeze, expand/contract, absorb/reflect, the
 * four layers) share one layout and differ in the highlighted part. Digits only; no words, no brands, no
 * pointing fingers. Abstract words are small symbolic scenes, often with a grey reference beside them.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { HL } from './people';
import { P as F, type Mood, greyed, drop } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const SKY = '#e2eff8';
const SPACE = '#1f2a48';
const NIGHT = '#27335a';
const SEA = '#5fa3d0';
const SEA2 = '#3c7fb0';
const LAND = '#8cc96a';
const LAND2 = '#5f9e48';
const ROCK = '#9a8a78';
const SNOW = '#f7f8fa';
const WARM = '#f08a5d';
const COLD = '#5aa7d6';
const N2 = '#4a78c8';
const O2 = '#d64545';
const AR = '#8a5ad0';
const H2O = '#3fa0dc';
const GLASS = '#eef6fb';
const HG = '#c3c9d2';
const UV = '#8e4fd6';
const SMOG = '#b49a74';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const num = (x: number, y: number, n: string, size = 9, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${n}</text>`;

// ── Scenery ──────────────────────────────────────────────────────────
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const field = (y = 96, col: string = LAND) => rect(4, y, 112, 112 - y, col, 0, null);
const cloud = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', col, C.ink, 1.2));
const flatCloud = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M-20 6 C-24 -2 -16 -8 -10 -5 C-8 -14 4 -16 8 -8 C14 -12 24 -6 20 6 Z', col, C.ink, 1.2));
const sun = (x: number, y: number, r = 7) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 3))} ${f1(y + Math.sin(a) * (r + 3))} L${f1(x + Math.cos(a) * (r + 7))} ${f1(y + Math.sin(a) * (r + 7))}`, C.gold, 2); }), circle(x, y, r, C.yellow, C.ink, 1.3));
const moon = (x: number, y: number, r = 7) => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${x} ${y + r} A${f1(r * 0.75)} ${r} 0 1 1 ${x} ${y - r} Z`, '#f4e7a8', C.ink, 1.1);
const stars = (pts: number[][], col: string = C.white) => all(...pts.map(([x, y]) => sparkle(x!, y!, 1.8, col)));
const tree = (x: number, y = 112, s = 1, col: string = LAND2) => at(x, y, s, rect(-2, -14, 4, 14, C.brown, 1, C.ink, 1), circle(0, -20, 9, col, C.ink, 1.2));
const fir = (x: number, y = 112, s = 1, col: string = '#3f7d4e') => at(x, y, s, rect(-1.5, -6, 3, 6, C.brown, 0, null), path('M0 -30 L9 -6 L-9 -6 Z', col, C.ink, 1));
const house = (x: number, y: number, s = 1, col: string = '#e8d9c0', roof: string = '#b84a3a') => at(x, y, s, rect(-9, -12, 18, 12, col, 0, C.ink, 1.1), path('M-11 -12 L0 -21 L11 -12 Z', roof, C.ink, 1.1), rect(-2.5, -7, 5, 7, C.dark, 0, null));
const factory = (x: number, y: number, s = 1) => at(x, y, s, rect(-14, -14, 28, 14, '#b9a99a', 0, C.ink, 1.1), rect(4, -32, 6, 18, '#8c7f74', 0, C.ink, 1.1), path('M-14 -14 L-14 -22 L-6 -14 L-6 -22 L2 -14 Z', '#a89888', C.ink, 1));
const car = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, path('M-12 0 L-12 -6 L-7 -6 L-4 -11 L6 -11 L9 -6 L12 -6 L12 0 Z', col, C.ink, 1.1), circle(-7, 0, 2.6, C.dark, C.ink, 0.8), circle(7, 0, 2.6, C.dark, C.ink, 0.8));
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.4);
const box = (x: number, y: number, w: number, h: number, col: string = HL, sw = 2.6) => rect(x, y, w, h, 'none', 3, col, sw);
const ban = (x: number, y: number, r = 7, w = 2.4) => all(circle(x, y, r, 'none', C.red, w), line(`M${f1(x - r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r * 0.7)} ${f1(y - r * 0.7)}`, C.red, w));
/** Thermometer with the bulb at (x, y); level 0–1. */
const thermo = (x: number, y: number, level: number, col: string = C.red, s = 1) => at(x, y, s, rect(-2.6, -26, 5.2, 26, C.white, 2.6, C.ink, 1.1), rect(-1.2, f1(-2 - 22 * level), 2.4, f1(2 + 22 * level), col, 1, null), circle(0, 2, 4.2, col, C.ink, 1.1), line('M2.6 -20 l2 0 M2.6 -14 l2 0 M2.6 -8 l2 0', C.ink, 0.8));
/** A vertical wavy heat line from (x, y) upwards. */
const heat = (x: number, y: number, h = 20, col: string = WARM, sw = 1.8) => line(`M${x} ${y} ` + range(Math.round(h / 5)).map((i) => `q${i % 2 ? -3 : 3} -2.5 0 -5`).join(' '), col, sw);
/** A wavy ray from (x1, y1) to (x2, y2) with an arrow head. */
const ray = (x1: number, y1: number, x2: number, y2: number, col: string = C.gold, sw = 2) => {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), n = Math.max(2, Math.round(L / 6)), ux = dx / L, uy = dy / L, px = -uy * 2.6, py = ux * 2.6;
  const pts = range(n).map((i) => { const t = (i + 0.5) / n; const s = i % 2 ? -1 : 1; return `${f1(x1 + dx * t + px * s)} ${f1(y1 + dy * t + py * s)}`; });
  const ex = f1(x2 - ux * 5), ey = f1(y2 - uy * 5);
  return all(line(`M${x1} ${y1} L${pts.join(' L')} L${ex} ${ey}`, col, sw), arrow(ex, ey, x2, y2, col, sw));
};
/** Curved arrow along a quadratic curve. */
const carrow = (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, col: string = HL, sw = 2.6) => {
  const tx = f1(x2 - (x2 - cx) * 0.15), ty = f1(y2 - (y2 - cy) * 0.15);
  return all(line(`M${x1} ${y1} Q${cx} ${cy} ${tx} ${ty}`, col, sw), arrow(tx, ty, x2, y2, col, sw));
};

// ── Molecules and charts ─────────────────────────────────────────────
type Mol = 'n2' | 'o2' | 'ar' | 'co2' | 'h2o' | 'o3';
const ball = (x: number, y: number, r: number, col: string) => all(circle(x, y, r, col, C.ink, 0.9), circle(f1(x - r * 0.35), f1(y - r * 0.35), f1(r * 0.3), 'rgba(255,255,255,0.55)', null));
const mol = (x: number, y: number, k: Mol, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  k === 'n2' ? all(ball(-3, 0, 3.6, N2), ball(3, 0, 3.6, N2))
    : k === 'o2' ? all(ball(-3, 0, 3.6, O2), ball(3, 0, 3.6, O2))
    : k === 'ar' ? ball(0, 0, 4, AR)
    : k === 'co2' ? all(ball(-5.6, 0, 3, O2), ball(5.6, 0, 3, O2), ball(0, 0, 3.6, C.dark))
    : k === 'o3' ? all(ball(-5, 2.4, 3.4, O2), ball(5, 2.4, 3.4, O2), ball(0, -2, 3.6, O2))
    : all(ball(-3.4, 2.6, 2, C.white), ball(3.4, 2.6, 2, C.white), ball(0, 0, 3.4, H2O)));
const pieSlice = (cx: number, cy: number, r: number, a0: number, a1: number) => { const p = (a: number) => `${f1(cx + Math.cos(a) * r)} ${f1(cy + Math.sin(a) * r)}`; return `M${cx} ${cy} L${p(a0)} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)} Z`; };
/** Pie of the dry air: nitrogen 78, oxygen 21, argon ~1 (argon slice drawn a little wider so it shows). */
const airPie = (cx: number, cy: number, r: number, hl: 'n2' | 'o2' | 'ar') => {
  const T = Math.PI * 2, s0 = -Math.PI / 2, n = s0 + T * 0.78, o = n + T * 0.205, e = s0 + T;
  const parts: [number, number, string, string][] = [[s0, n, N2, 'n2'], [n, o, O2, 'o2'], [o, e, AR, 'ar']];
  return all(...parts.map(([a, b, col]) => path(pieSlice(cx, cy, r, a, b), col, C.ink, 1.2)), ...parts.filter((p) => p[3] === hl).map(([a, b]) => path(pieSlice(cx, cy, r + 3, a - 0.03, b + 0.03), 'none', HL, 3)));
};
const globe = (cx: number, cy: number, r: number) => all(circle(cx, cy, r, SEA, C.ink, 1.6),
  at(f1(cx - r * 0.4), f1(cy - r * 0.25), f1(r / 30), path('M-10 -6 C-6 -14 6 -12 10 -6 C14 0 8 10 2 8 C-4 12 -12 6 -10 -6 Z', LAND, C.ink, 1.1)),
  at(f1(cx + r * 0.35), f1(cy + r * 0.3), f1(r / 26), path('M-10 -6 C-6 -14 6 -12 10 -6 C14 0 8 10 2 8 C-4 12 -12 6 -10 -6 Z', LAND, C.ink, 1.1)));
const shell = (cx: number, cy: number, r: number, w: number, col = 'rgba(140,199,232,0.55)') => circle(cx, cy, r + w / 2, 'none', col, w);
/** Round dial gauge with a needle at angle a (radians, 0 = up). */
const dial = (cx: number, cy: number, r: number, a: number, face: string = '#fbf6e8', rim: string = '#b88a3c') => all(circle(cx, cy, r + 3, rim, C.ink, 1.4), circle(cx, cy, r, face, C.ink, 1),
  ...range(11).map((i) => { const t = -1.2 + i * 0.24; return line(`M${f1(cx + Math.sin(t) * (r - 2))} ${f1(cy - Math.cos(t) * (r - 2))} L${f1(cx + Math.sin(t) * (r - 6))} ${f1(cy - Math.cos(t) * (r - 6))}`, C.ink, 1); }),
  line(`M${cx} ${cy} L${f1(cx + Math.sin(a) * (r - 6))} ${f1(cy - Math.cos(a) * (r - 6))}`, C.red, 2), circle(cx, cy, 2.2, C.ink, null));
/** A glass flask/bottle with a balloon on the neck; bal = balloon radius. */
const bottle = (x: number, y: number, bal: number, balCol: string = C.red) => all(
  path(`M${x - 12} ${y} L${x + 12} ${y} L${x + 12} ${y - 22} C${x + 12} ${y - 30} ${x + 4} ${y - 30} ${x + 4} ${y - 36} L${x - 4} ${y - 36} C${x - 4} ${y - 30} ${x - 12} ${y - 30} ${x - 12} ${y - 22} Z`, GLASS, C.ink, 1.3),
  rect(x - 5, y - 39, 10, 4, balCol, 1, C.ink, 1), ellipse(x, f1(y - 39 - bal), f1(bal * 0.9), bal, balCol, C.ink, 1.2));
/** Cross-section of a pot of water on a hob. */
const pot = (x: number, y: number, w = 56, h = 34, water = '#9fd0ee') => all(rect(x - w / 2 - 6, y, w + 12, 6, C.dark, 2, C.ink, 1.2), path(`M${x - w / 2} ${y} L${x - w / 2} ${y - h} L${x + w / 2} ${y - h} L${x + w / 2} ${y} Z`, water, C.ink, 1.6),
  line(`M${x - w / 2 - 4} ${y - h} L${x - w / 2} ${y - h} M${x + w / 2} ${y - h} L${x + w / 2 + 4} ${y - h}`, C.ink, 2), ...[-14, 0, 14].map((d) => path(`M${x + d - 4} ${y + 6} q4 6 8 0`, '#f2752a', null)));
/** Coast cross-section: land on the left, sea on the right; arrows for a breeze loop. */
const coast = (day: boolean) => all(bg(day ? SKY : NIGHT), path('M4 90 L58 90 L66 96 L116 96 L116 112 L4 112 Z', day ? '#d9a35c' : '#7f8a6a', null),
  rect(64, 92, 52, 20, day ? SEA : '#335a80', 0, null), line('M64 92 L116 92', C.ink, 1), path('M4 90 L58 90 L66 96', 'none', C.ink, 1.2),
  house(22, 90, 0.9), tree(44, 90, 0.7), day ? sun(96, 18, 7) : moon(96, 18, 7), day ? '' : stars([[20, 16], [40, 26], [70, 12], [110, 36]]),
  thermo(14, 50, day ? 0.85 : 0.3, day ? C.red : COLD, 0.8), thermo(106, 64, day ? 0.4 : 0.6, day ? COLD : C.red, 0.8));
/** Layers of the atmosphere as a side cross-section; hl = index of the highlighted band (0 = lowest). */
const BANDS: [number, number, string][] = [[84, 112, '#cfe6f5'], [56, 84, '#9fc4e6'], [32, 56, '#5f7fb8'], [4, 32, '#2b3766']];
const layers = (hl: number, extra: Svg = '') => all(...BANDS.map(([y0, y1, col]) => rect(4, y0, 112, y1 - y0, col, 0, null)), line('M4 84 L116 84 M4 56 L116 56 M4 32 L116 32', C.white, 0.8, '3 2'),
  path('M4 112 L4 104 L16 94 L26 102 L40 90 L54 104 L70 100 L86 106 L100 98 L116 104 L116 112 Z', ROCK, C.ink, 1.1), path('M36 94 L40 90 L44 94 Z', SNOW, null),
  cloud(28, 92, 0.45), cloud(84, 90, 0.4), stars([[20, 12], [60, 8], [96, 14], [110, 26]]), extra,
  rect(5, BANDS[hl]![0] + 1, 110, BANDS[hl]![1] - BANDS[hl]![0] - 2, 'none', 2, HL, 3));
const plane = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, path('M-12 0 C-12 -2 10 -3 13 0 C10 3 -12 2 -12 0 Z', C.white, C.ink, 1), path('M-2 -1 L-6 -8 L-2 -8 L4 -1 Z M-2 1 L-6 8 L-2 8 L4 1 Z M-11 0 L-14 -5 L-11 -5 L-8 -1 Z', C.grey2, C.ink, 0.9));
const balloon = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, -14, 10, 12, C.white, C.ink, 1.2), line('M0 -2 L0 10', C.ink, 0.9), rect(-3, 10, 6, 5, C.orange, 1, C.ink, 0.9));
const glider = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, line('M-40 0 L40 0', C.ink, 3.4), line('M-40 0 L40 0', C.white, 2), path('M-16 -2 C-16 -6 20 -6 24 -1 C20 3 -16 3 -16 -2 Z', C.white, C.ink, 1.1), path('M-14 -2 L-20 -10 L-16 -10 L-10 -2 Z', C.white, C.ink, 1), ellipse(14, -3.2, 4.5, 2, '#9fd0ee', C.ink, 0.8), line('M-24 -1 L-14 -1', C.white, 2.2));
const bird = (x: number, y: number, s = 1) => at(x, y, s, path('M-8 0 Q-4 -5 0 0 Q4 -5 8 0', 'none', C.ink, 1.6));
const fig = (x: number, top: string, mood: Mood = 'smile', h = 1) => F({ x, top, mood, h });
/** Puffs of vapour as small blue dots. */
const vapour = (pts: number[][], r = 1.6, col: string = H2O) => all(...pts.map(([x, y]) => circle(x!, y!, r, col, null)));
const crystal = (x: number, y: number, r: number, col: string = '#bfe3f7') => at(x, y, 1, ...range(6).map((i) => g(`rotate(${i * 60})`, line(`M0 0 L0 ${-r} M0 ${f1(-r * 0.55)} L${f1(r * 0.25)} ${f1(-r * 0.75)} M0 ${f1(-r * 0.55)} L${f1(-r * 0.25)} ${f1(-r * 0.75)}`, col, 2.4), line(`M0 0 L0 ${-r}`, C.ink, 0.5))), circle(0, 0, 2, col, C.ink, 0.6));
const curtain = (x: number, y: number, w: number, h: number, col: string) => path(`M${x} ${y} C${x + w * 0.3} ${y - 8} ${x + w * 0.6} ${y + 8} ${x + w} ${y} L${x + w} ${y + h} C${x + w * 0.6} ${y + h + 6} ${x + w * 0.3} ${y + h - 6} ${x} ${y + h} Z`, col, null);

// ── Motifs ───────────────────────────────────────────────────────────
export const ATMOSPHERE_MOTIFS: Record<string, Svg> = {
  // 2611 Luftens sammansättning
  'atmo.atmosfär': all(bg(SPACE), stars([[14, 14], [104, 12], [18, 100], [106, 104], [60, 8], [10, 60]]), shell(60, 62, 38, 8), globe(60, 62, 38), circle(60, 62, 46.5, 'none', HL, 2.6), arrow(108, 30, 94, 38, HL, 2.6), sun(14, 30, 5)),
  'atmo.kväve': all(bg(GLASS), airPie(40, 60, 30, 'n2'), num(36, 50, '78', 12, C.white), mol(92, 38, 'n2', 2.2), ring(92, 38, 20), greyed(mol(86, 84, 'o2', 1.4), mol(104, 96, 'ar', 1.4))),
  'atmo.argon': all(bg(GLASS), airPie(40, 60, 30, 'ar'), mol(92, 38, 'ar', 2.4), ring(92, 38, 16), greyed(mol(84, 84, 'n2', 1.4), mol(104, 96, 'o2', 1.4))),
  'atmo.ädelgas': all(bg('#2a2f45'), line('M14 30 C30 20 40 40 56 30 S82 20 96 32', '#ff7ad9', 6), line('M14 30 C30 20 40 40 56 30 S82 20 96 32', '#ffd2f2', 2), line('M18 52 L98 52', '#c68bff', 6), line('M18 52 L98 52', '#efdcff', 2),
    rect(10, 26, 6, 10, C.grey, 1, C.ink, 0.8), rect(94, 28, 6, 10, C.grey, 1, C.ink, 0.8), rect(12, 48, 6, 8, C.grey, 1, C.ink, 0.8), rect(98, 48, 6, 8, C.grey, 1, C.ink, 0.8),
    rect(10, 66, 100, 42, GLASS, 3, C.ink, 1), ...[[24, 80], [48, 92], [72, 78], [96, 94]].map(([x, y]) => mol(x!, y!, 'ar', 1.6)), ring(48, 92, 10), mol(70, 98, 'o2', 1.1, 20), ban(84, 86, 5, 1.8)),
  'atmo.vattenånga': all(bg(SKY), rect(4, 86, 112, 26, SEA, 0, null), line('M4 86 L116 86', SEA2, 1.4), sun(100, 18, 7),
    ...[[18, 70], [36, 58], [52, 74], [70, 54], [86, 68], [30, 40], [62, 34], [92, 44]].map(([x, y], i) => mol(x!, y!, 'h2o', 1, i * 40)), ring(70, 54, 10), line('M60 60 L36 22', HL, 1.6, '3 2'),
    circle(28, 22, 13, C.white, C.ink, 1.4), mol(28, 22, 'h2o', 2.2), line('M37 31 L44 38', C.ink, 3), arrow(18, 82, 18, 72, H2O, 1.6), arrow(52, 84, 52, 78, H2O, 1.6), arrow(86, 82, 86, 74, H2O, 1.6)),
  'atmo.luftförorening': all(bg('#d8cbb4'), path('M4 60 C30 40 90 40 116 60 L116 112 L4 112 Z', 'rgba(150,120,80,0.35)', null), field(100, '#9a9a9a'), factory(24, 100, 1), house(56, 100, 1), factory(92, 100, 0.9), car(70, 108, 0.8), car(40, 108, 0.8, C.denim),
    ...[[31, 64], [97, 70]].map(([x, y]) => all(circle(x!, y!, 7, SMOG, C.ink, 0.8), circle(x! + 6, y! - 8, 9, SMOG, C.ink, 0.8), circle(x! - 2, y! - 18, 10, SMOG, C.ink, 0.8))), circle(60, 20, 6, '#e8c46a', C.ink, 1), fig(108, C.denim, 'sick', 0.5), oval(60, 64, 54, 22)),

  // 2612 Lufttryck
  'atmo.lufttryck.2': all(bg('#f3f7fb'), ...range(7).map((i) => all(...range(5 - Math.floor(i / 2)).map((j) => mol(14 + i * 16, 92 - j * (10 + i % 2 * 2) - (j > 0 ? j * 3 : 0), i % 3 ? 'n2' : 'o2', 0.9, j * 30)))), field(100, LAND),
    ...[16, 36, 56, 76, 96].map((x) => arrow(x + 4, 8, x + 4, 26, HL, 2.4)), at(60, 100, 1, rect(-10, -14, 20, 14, C.tan, 1, C.ink, 1.2)), arrow(60, 66, 60, 84, HL, 3), arrow(44, 92, 49, 92, HL, 2), arrow(76, 92, 71, 92, HL, 2)),
  'atmo.luftpelare': all(bg(SKY), rect(4, 4, 112, 20, SPACE, 3, null), stars([[14, 12], [50, 8], [104, 14]]), field(96, LAND), path('M40 96 L80 96 L88 104 L32 104 Z', '#c9a874', C.ink, 1.2),
    rect(40, 10, 40, 86, 'rgba(140,199,232,0.6)', 0, null), ...range(14).map((i) => circle(46 + (i * 13) % 30, 90 - i * 6, 1.8 - i * 0.08, N2, null)), rect(40, 10, 40, 86, 'none', 1, HL, 3),
    at(98, 78, 1, path('M-10 0 L10 0 L7 -14 L-7 -14 Z', C.dark, C.ink, 1.2), path('M-4 -14 C-4 -20 4 -20 4 -14', 'none', C.ink, 1.6)), num(98, 74, '10', 7, C.white), arrow(60, 70, 60, 94, C.ink, 1.8)),
  'atmo.barometer': all(bg('#efe4d0'), rect(20, 10, 80, 98, '#9a6236', 6, C.ink, 1.6), dial(60, 58, 32, -0.6), sun(84, 44, 4), cloud(36, 46, 0.4), at(60, 80, 0.6, cloud(0, 0, 1, C.grey2)), line('M54 87 l-2 4 M60 87 l-2 4 M66 87 l-2 4', C.denim, 1.2), circle(60, 58, 36, 'none', HL, 2.4)),
  'atmo.kvicksilver': all(bg('#f2efe9'), ellipse(60, 92, 44, 12, C.white, C.ink, 1.4), ellipse(60, 90, 30, 6, '#e8e8ec', null), ...[[52, 88, 9, 4.6], [70, 90, 6, 3.4], [38, 92, 3, 2], [80, 94, 3.4, 2.2], [62, 95, 2.4, 1.6]].map(([x, y, rx, ry]) => all(ellipse(x!, y!, rx!, ry!, HG, C.ink, 1), ellipse(x! - rx! * 0.35, y! - ry! * 0.4, rx! * 0.3, ry! * 0.25, C.white, null))),
    g('rotate(-12 60 40)', rect(56, 6, 8, 60, C.white, 4, C.ink, 1.2), rect(58.6, 20, 2.8, 42, HG, 1, null), circle(60, 66, 6, HG, C.ink, 1.2)), oval(52, 88, 14, 9)),
  'atmo.vakuum': all(bg('#eef0f2'), rect(6, 98, 108, 6, C.dark, 2, C.ink, 1),
    path('M18 98 L18 44 C18 26 52 26 52 44 L52 98 Z', GLASS, C.ink, 1.4), ellipse(35, 70, 11, 14, C.red, C.ink, 1.2), line('M35 84 L35 98', C.ink, 1), box(16, 30, 38, 66),
    greyed(path('M66 98 L66 44 C66 26 100 26 100 44 L100 98 Z', GLASS, C.ink, 1.4), ellipse(83, 80, 6, 8, C.red, C.ink, 1.2), line('M83 88 L83 98', C.ink, 1), ...[[72, 50], [90, 44], [78, 64], [94, 70], [86, 56], [72, 86], [96, 88]].map(([x, y]) => mol(x!, y!, 'n2', 0.8))),
    rect(30, 104, 10, 6, C.grey, 1, C.ink, 1), line('M35 108 L10 108 L10 92', C.ink, 1.6), arrow(26, 50, 10, 50, C.ink, 1.6)),
  'atmo.hektopascal': all(bg('#f3f7fb'), dial(60, 52, 36, 0.05, C.white, C.grey), num(60, 44, '1013', 13), num(30, 72, '980', 6), num(90, 72, '1040', 6), rect(28, 34, 64, 14, 'none', 3, HL, 2.6), field(100, LAND), house(20, 100, 0.9), tree(100, 100, 0.6)),
  'atmo.högtryck': all(bg(SKY), field(100, LAND), sun(60, 22, 8), line('M14 96 C14 40 106 40 106 96', '#7aa6d0', 1.2, '3 2'),
    arrow(40, 40, 40, 80, HL, 3), arrow(60, 40, 60, 84, HL, 3), arrow(80, 40, 80, 80, HL, 3), arrow(48, 94, 18, 94, HL, 2.4), arrow(72, 94, 102, 94, HL, 2.4), house(30, 100, 0.8), tree(90, 100, 0.6), thermo(108, 78, 0.8, C.red, 0.6)),
  'atmo.lågtryck': all(bg('#c9d2dc'), field(100, '#7fae5e'), cloud(40, 24, 1.1, C.grey2), cloud(76, 22, 1.2, C.grey2), ...[30, 44, 70, 86].map((x) => line(`M${x} 36 l-3 8 M${x + 6} 40 l-3 8`, C.denim, 1.4)),
    arrow(40, 84, 40, 50, HL, 3), arrow(60, 88, 60, 50, HL, 3), arrow(80, 84, 80, 50, HL, 3), arrow(16, 94, 46, 94, HL, 2.4), arrow(104, 94, 74, 94, HL, 2.4), house(28, 100, 0.8), tree(92, 100, 0.6)),
  'atmo.isobar': all(bg('#eef2e6'), path('M4 4 L60 4 C50 20 56 40 40 52 C24 64 18 90 4 96 Z', '#cfe2b8', null), path('M4 4 L60 4 C50 20 56 40 40 52 C24 64 18 90 4 96', 'none', C.ink, 1), rect(4, 4, 112, 108, 'none', 3, C.ink, 1),
    ...[12, 24, 36].map((r) => ellipse(74, 64, r * 1.15, r, 'none', C.dark, 1.3)), ellipse(74, 64, 36 * 1.15, 36, 'none', HL, 3), ...[[74, 28], [33, 64], [115, 64], [74, 100]].map(([x, y]) => circle(x!, y!, 2.6, C.white, C.ink, 1)), circle(74, 64, 3, C.red, C.ink, 1)),

  // 2613 Luftfuktighet
  'atmo.avdunstning': all(bg(SKY), sun(96, 18, 8), rect(4, 76, 112, 36, SEA, 0, null), line('M4 76 L116 76', SEA2, 1.4), ...range(6).map((i) => all(heat(14 + i * 18, 72, 26, H2O, 1.6), arrow(14 + i * 18, 48, 14 + i * 18, 40, H2O, 1.6))), vapour([[22, 30], [44, 24], [70, 32], [88, 40], [56, 46], [34, 52]], 1.8), rect(6, 34, 108, 44, 'none', 3, HL, 2.4)),
  'atmo.kondensation': all(bg('#eef4f8'), rect(4, 92, 112, 20, '#d9c3a0', 0, null), path('M40 92 L44 34 L80 34 L84 92 Z', GLASS, C.ink, 1.4), path('M42 60 L82 60 L84 92 L40 92 Z', '#bfe3f7', null), ...[[46, 56], [76, 48], [44, 72], [80, 70], [78, 84], [46, 86], [80, 40]].map(([x, y]) => drop(x!, y!, 0.8, '#8cc7e8')),
    ...[[20, 40], [24, 62], [16, 80], [100, 46], [104, 66], [98, 84]].map(([x, y]) => mol(x!, y!, 'h2o', 0.8)), arrow(26, 48, 40, 54, H2O, 1.6), arrow(96, 58, 84, 62, H2O, 1.6), at(62, 66, 0.9, rect(-6, -6, 12, 12, '#e6f6ff', 2, C.ink, 0.8)), oval(80, 70, 9, 18)),
  'atmo.mättad': all(bg('#f6f2ea'), greyed(rect(8, 30, 46, 60, GLASS, 3, C.ink, 1.3), ...[[18, 44], [40, 58], [24, 76], [44, 82]].map(([x, y]) => mol(x!, y!, 'h2o', 0.9))),
    rect(64, 30, 46, 60, GLASS, 3, C.ink, 1.3), ...range(4).flatMap((r) => range(4).map((c) => mol(71 + c * 11, 40 + r * 12, 'h2o', 0.85, (r + c) * 30))), ...[[72, 86], [86, 87], [100, 86]].map(([x, y]) => drop(x!, y!, 0.6)), box(62, 28, 50, 64), thermo(60, 106, 0.5, C.red, 0.5)),
  'atmo.relativ-luftfuktighet': all(bg('#f6f2ea'), rect(14, 24, 60, 70, GLASS, 3, C.ink, 1.3), ...[[24, 36], [46, 32], [62, 44], [30, 56], [52, 60], [22, 78], [44, 82], [64, 76]].map(([x, y]) => mol(x!, y!, 'h2o', 0.9)),
    rect(86, 24, 14, 70, C.white, 3, C.ink, 1.3), rect(88, 52, 10, 40, H2O, 2, null), line('M100 38 l4 0 M100 52 l4 0 M100 66 l4 0 M100 80 l4 0', C.ink, 1), rect(84, 22, 18, 74, 'none', 3, HL, 2.6), num(93, 18, '60%', 9), line('M74 52 L86 52', H2O, 1.4, '2 2')),
  'atmo.daggpunkt': all(bg('#e9f0f6'), field(96, LAND), ...range(10).map((i) => line(`M${10 + i * 11} 96 l-2 -8 M${10 + i * 11} 96 l2 -8`, LAND2, 1.4)), ...[[16, 88], [38, 89], [60, 88], [82, 89], [104, 88]].map(([x, y]) => drop(x!, y!, 0.6)),
    thermo(40, 72, 0.35, COLD, 1.4), arrow(66, 22, 66, 56, COLD, 2.4), line('M20 50 L104 50', HL, 2.4, '5 3'), oval(82, 88, 30, 6), moon(100, 18, 6)),
  'atmo.hygrometer': all(bg('#efe8de'), rect(26, 24, 68, 70, C.white, 8, C.ink, 1.6), rect(34, 32, 52, 34, '#cfe0c8', 3, C.ink, 1.1), drop(46, 49, 1.6, H2O), num(70, 56, '45', 16), num(84, 56, '%', 8), rect(36, 74, 48, 10, C.grey2, 3, C.ink, 1), rect(36, 74, 22, 10, H2O, 3, null), rect(22, 20, 76, 78, 'none', 9, HL, 2.6)),
  'atmo.avfuktare': all(bg('#e6e2d8'), rect(4, 104, 112, 8, '#b9a98e', 0, null), rect(36, 30, 48, 74, C.white, 6, C.ink, 1.6), line('M42 40 L78 40 M42 46 L78 46 M42 52 L78 52', C.grey, 1.4), rect(42, 70, 36, 26, '#cfe8f6', 2, C.ink, 1.2), rect(42, 82, 36, 14, H2O, 2, null), circle(72, 60, 2.6, '#3a9a5a', C.ink, 0.8),
    ...[[12, 40], [18, 60], [10, 80]].map(([x, y]) => drop(x!, y!, 0.9)), arrow(14, 50, 34, 50, H2O, 2), arrow(86, 44, 108, 36, C.grey, 2), heat(100, 60, 16, C.grey, 1.2), oval(60, 84, 22, 14)),

  // 2614 Temperatur och värmeöverföring
  'atmo.reflektera.2': all(bg(SKY), sun(18, 18, 8), field(80, SNOW), line('M4 80 L116 80', C.ink, 1), ...range(8).map((i) => line(`M${10 + i * 14} 90 l6 -3`, '#c9d6e2', 1.2)),
    arrow(30, 32, 52, 78, C.gold, 2.6), arrow(52, 78, 74, 32, HL, 2.8), arrow(18, 40, 36, 78, C.gold, 2.2), arrow(36, 78, 54, 40, HL, 2.4), thermo(100, 74, 0.2, COLD, 0.8), ring(52, 78, 6)),
  'atmo.värmekälla': all(bg('#2b3354'), field(100, '#4a5a3e'), ...[-14, 0, 14].map((d) => line(`M${60 + d - 6} 100 L${60 - d + 6} 92`, C.brown, 3.4)), path('M48 94 C44 80 54 74 52 62 C60 70 62 62 60 52 C70 62 76 74 72 94 Z', C.orange, C.ink, 1.3), path('M54 94 C52 84 58 80 58 72 C64 80 68 86 66 94 Z', C.yellow, null),
    ...[-1, 1].flatMap((s) => [ray(60 + s * 18, 74, 60 + s * 40, 70, WARM, 1.6), ray(60 + s * 16, 60, 60 + s * 36, 44, WARM, 1.6)]), ring(60, 76, 24), stars([[14, 14], [100, 18], [24, 34]])),
  'atmo.värmeöverföring': all(bg('#f6f2ea'), rect(10, 52, 38, 38, '#e2552e', 4, C.ink, 1.6), rect(72, 52, 38, 38, '#6fb4e2', 4, C.ink, 1.6), heat(22, 46, 14, C.red), heat(34, 46, 14, C.red), path('M80 44 l6 -6 M88 44 l6 -6 M96 44 l6 -6', 'none', '#a8d6f2', 1.4),
    arrow(46, 71, 76, 71, HL, 4), thermo(29, 106, 0.9, C.red, 0.5), thermo(91, 106, 0.15, COLD, 0.5)),
  'atmo.strålning': all(bg(SPACE), stars([[60, 12], [70, 104], [40, 100], [100, 16], [50, 30]]), circle(4, 60, 30, C.yellow, C.ink, 1.4), ...range(8).map((i) => { const a = -1.2 + i * 0.34; return line(`M${f1(4 + Math.cos(a) * 33)} ${f1(60 + Math.sin(a) * 33)} L${f1(4 + Math.cos(a) * 38)} ${f1(60 + Math.sin(a) * 38)}`, C.gold, 2); }),
    globe(100, 60, 14), ray(40, 44, 84, 54, WARM, 2.4), ray(42, 60, 84, 60, WARM, 2.4), ray(40, 76, 84, 66, WARM, 2.4), rect(38, 38, 52, 44, 'none', 3, HL, 2.4)),
  'atmo.ledning': all(bg('#f3ede2'), rect(4, 100, 112, 12, '#c9b593', 0, null), path('M10 100 C8 88 16 84 14 74 C20 82 24 76 22 68 C30 78 32 88 30 100 Z', C.orange, C.ink, 1.2), path('M15 100 C14 92 20 88 20 82 C24 88 26 94 25 100 Z', C.yellow, null),
    ...range(10).map((i) => rect(14 + i * 8, 66, 8, 8, ['#e2402a', '#e8582e', '#ee7034', '#f08a40', '#eea25a', '#d9b37a', '#b8b8a0', '#9fb6c4', '#8fb4d6', '#86b0dc'][i]!, 0, null)), rect(14, 66, 80, 8, 'none', 1, C.ink, 1.2),
    arrow(30, 58, 84, 58, HL, 3), rect(88, 62, 18, 16, C.skin, 5, C.ink, 1.2), line('M88 66 L106 66 M88 70 L106 70 M88 74 L106 74', C.skin2, 0.8), heat(97, 58, 10, C.red, 1.2)),
  'atmo.konvektion': all(bg('#f3ede2'), pot(60, 92, 64, 50), carrow(60, 82, 64, 52, 60, 50, C.red, 2.6), carrow(56, 48, 34, 44, 34, 60, HL, 2.6), carrow(34, 62, 34, 84, 54, 84, COLD, 2.6), carrow(64, 48, 86, 44, 86, 60, HL, 2.6), carrow(86, 62, 86, 84, 66, 84, COLD, 2.6), heat(52, 34, 18, '#c9ced4'), heat(68, 34, 18, '#c9ced4')),
  'atmo.absorbera': all(bg(SKY), sun(18, 18, 8), field(80, '#3a3a40'), line('M4 80 L116 80', C.ink, 1), line('M10 96 L30 96 M50 96 L70 96 M90 96 L110 96', C.white, 2, '6 6'),
    arrow(30, 32, 52, 82, C.gold, 2.6), arrow(18, 40, 36, 82, C.gold, 2.2), arrow(46, 30, 68, 82, C.gold, 2.2), ...[40, 56, 72].map((x) => heat(x, 100, 12, C.red, 1.4)), thermo(100, 74, 0.9, C.red, 0.8), oval(52, 88, 28, 8)),
  'atmo.utvidga-sig': all(bg('#f6f2ea'), rect(30, 74, 60, 34, '#e86a4a', 3, C.ink, 1.4), rect(30, 74, 60, 6, '#f2a07e', 0, null), ...[44, 60, 76].map((x) => heat(x, 72, 8, C.red, 1.2)), g('translate(0 6)', bottle(60, 98, 16)),
    arrow(60, 30, 60, 14, HL, 2.6), arrow(42, 42, 30, 36, HL, 2.6), arrow(78, 42, 90, 36, HL, 2.6), thermo(104, 104, 0.85, C.red, 0.6)),
  'atmo.dra-ihop-sig': all(bg('#f6f2ea'), rect(30, 74, 60, 34, '#9fd0ee', 3, C.ink, 1.4), ...[[40, 80], [56, 84], [76, 80]].map(([x, y]) => rect(x!, y!, 8, 7, SNOW, 1, C.ink, 0.8)), g('translate(0 6)', bottle(60, 98, 5, C.red)),
    arrow(60, 22, 60, 38, HL, 2.6), arrow(36, 34, 48, 46, HL, 2.6), arrow(84, 34, 72, 46, HL, 2.6), thermo(104, 104, 0.15, COLD, 0.6)),
  'atmo.avkylning': all(bg(NIGHT), moon(98, 18, 7), stars([[14, 14], [40, 22], [70, 10], [24, 44], [110, 44]]), field(96, '#cfdbe4'), ...range(8).map((i) => arrow(12 + i * 14, 92, 12 + i * 14, 72, '#9fc4e6', 1.4)),
    tree(20, 96, 0.7, '#cfe0d8'), house(96, 96, 0.9, '#d8d0c4', '#8c7a8a'), thermo(60, 60, 0.12, COLD, 1.2), arrow(76, 30, 76, 62, HL, 3)),

  // 2615 Vindens uppkomst
  'atmo.tryckskillnad': all(bg('#f3f7fb'), field(100, LAND), rect(8, 30, 40, 70, 'rgba(95,127,184,0.25)', 3, C.ink, 1.2), ...range(18).map((i) => mol(14 + (i % 4) * 9.5, 38 + Math.floor(i / 4) * 13, 'n2', 0.7, i * 23)),
    rect(72, 30, 40, 70, 'rgba(95,127,184,0.08)', 3, C.ink, 1.2), ...[[80, 46], [100, 60], [86, 80], [104, 90]].map(([x, y]) => mol(x!, y!, 'n2', 0.7, 30)), arrow(42, 70, 80, 70, HL, 4), dial(28, 18, 9, 0.9, C.white, C.grey), dial(92, 18, 9, -0.9, C.white, C.grey)),
  'atmo.luftström': all(bg(SKY), field(100, LAND), ...[34, 50, 66].map((y, i) => line(`M6 ${y} C30 ${y - 10} 50 ${y + 10} 74 ${y} S100 ${y - 8} 108 ${y}`, i === 1 ? HL : '#7aa6d0', i === 1 ? 3 : 1.8)), arrow(100, 50, 112, 50, HL, 3),
    ...[[30, 42, '#e0a030'], [70, 58, '#d06a30'], [48, 30, '#8cbf4a']].map(([x, y, c]) => g(`translate(${x} ${y}) rotate(30)`, path('M-5 0 C-3 -4 3 -4 5 0 C3 4 -3 4 -5 0 Z', c as string, C.ink, 0.8))), bird(88, 40, 1.2), tree(20, 100, 0.8), tree(100, 100, 0.6)),
  'atmo.sjöbris': all(coast(true), line('M30 76 C30 40 92 40 92 76', '#9aa3ad', 1.4, '3 3'), arrow(30, 70, 30, 46, '#9aa3ad', 1.8), arrow(92, 48, 92, 72, '#9aa3ad', 1.8), arrow(96, 84, 50, 84, HL, 3.4)),
  'atmo.landbris': all(coast(false), line('M30 76 C30 40 92 40 92 76', '#9aa3ad', 1.4, '3 3'), arrow(92, 70, 92, 46, '#9aa3ad', 1.8), arrow(30, 48, 30, 72, '#9aa3ad', 1.8), arrow(30, 84, 80, 84, HL, 3.4)),
  'atmo.halvklot': all(bg(SPACE), stars([[14, 14], [104, 12], [18, 104], [106, 104]]), globe(60, 60, 42), path('M18 60 A42 42 0 0 1 102 60 Z', 'rgba(239,138,60,0.45)', null), path('M18 60 A42 42 0 0 1 102 60 Z', 'none', HL, 3), line('M16 60 L104 60', C.red, 1.8, '4 3')),
  'atmo.passadvind': all(bg(SPACE), globe(60, 60, 46), line('M14 60 L106 60', C.red, 1.6, '4 3'), ...[30, 50, 70, 90].flatMap((x) => [arrow(x + 8, 28, x, 52, HL, 2.6), arrow(x + 8, 92, x, 68, HL, 2.6)]), at(60, 60, 0.7, path('M-8 2 L8 2 L5 6 L-5 6 Z', C.brown, C.ink, 1), line('M0 2 L0 -12', C.ink, 1), path('M0 -12 L7 -2 L0 -2 Z', C.white, C.ink, 0.8))),
  'atmo.rotation': all(bg(SPACE), stars([[14, 14], [104, 14], [14, 104], [104, 104]]), globe(60, 62, 34), path('M60 28 A34 34 0 0 1 60 96 A17 34 0 0 0 60 28 Z', 'rgba(20,24,48,0.55)', null), line('M52 18 L68 106', C.ink, 1.6, '4 3'),
    path('M20 52 C20 40 100 40 100 52', 'none', HL, 3), arrow(92, 46, 102, 54, HL, 3), path('M20 72 C20 84 100 84 100 72', 'none', HL, 3), sun(10, 62, 4)),
  'atmo.corioliseffekt': all(bg(SPACE), circle(60, 62, 46, SEA, C.ink, 1.6), circle(60, 62, 3, C.ink, null), line('M60 30 L60 92', C.white, 1.6, '4 3'), path('M60 30 C60 50 70 72 92 84', 'none', HL, 3), arrow(86, 81, 94, 86, HL, 3), arrow(60, 22, 60, 30, C.white, 2),
    path('M20 30 A50 50 0 0 0 20 94', 'none', C.white, 2), arrow(20, 88, 24, 98, C.white, 2), greyed(arrow(60, 74, 60, 94, C.white, 2.4))),

  // 2616 Molnbildning
  'atmo.molnbildning': all(bg(SKY), field(100, LAND), sun(18, 18, 7), arrow(60, 96, 60, 52, HL, 3), vapour([[52, 80], [68, 74], [56, 64], [66, 58]], 1.6), cloud(60, 34, 1.5), ...[[44, 46], [60, 48], [76, 46]].map(([x, y]) => circle(x!, y!, 1.6, H2O, null)), thermo(100, 90, 0.7, C.red, 0.6), thermo(100, 44, 0.25, COLD, 0.6), tree(26, 100, 0.7)),
  'atmo.kondensationskärna': all(bg('#eef4f8'), circle(60, 60, 42, '#dff0fa', C.ink, 1.8), circle(60, 60, 20, '#9fd0ee', C.ink, 1.2), path('M54 56 L60 52 L66 57 L64 64 L56 65 Z', '#b88a5c', C.ink, 1.2), ring(60, 60, 9),
    ...[[30, 34], [94, 38], [26, 86], [92, 88], [60, 24]].map(([x, y]) => all(mol(x!, y!, 'h2o', 0.9), arrow(x! + (60 - x!) * 0.2, y! + (60 - y!) * 0.2, x! + (60 - x!) * 0.5, y! + (60 - y!) * 0.5, H2O, 1.6)))),
  'atmo.sväva': all(bg(SKY), field(102, LAND), ellipse(60, 104, 8, 2, 'rgba(0,0,0,0.15)', null), at(60, 40, 1, line('M0 0 L0 22', C.grey, 1.2), ...range(12).map((i) => { const a = (i / 12) * Math.PI * 2; return line(`M0 0 L${f1(Math.cos(a) * 12)} ${f1(Math.sin(a) * 12 - 6)}`, '#c9ced4', 1); }), circle(0, 23, 2, C.brown, null)),
    path('M30 30 q4 -3 8 0 M80 46 q4 -3 8 0 M28 62 q4 -3 8 0', 'none', '#9aa3ad', 1.2), line('M60 70 L60 96', C.grey, 1, '2 4'), oval(60, 38, 20, 22)),
  'atmo.molndroppe': all(bg(SKY), cloud(30, 30, 1.4), circle(76, 66, 32, C.white, C.ink, 2), ...[[64, 54], [80, 50], [90, 64], [70, 72], [84, 80], [62, 84], [76, 62]].map(([x, y]) => circle(x!, y!, 2, H2O, C.ink, 0.6)), ring(76, 62, 6), line('M100 90 L112 104', C.ink, 4), line('M44 42 L52 46', C.ink, 1.2, '2 2'), greyed(drop(20, 94, 2.4))),
  'atmo.iskristall': all(bg('#d6e6f2'), cloud(28, 24, 1, C.white), circle(66, 66, 36, '#eaf6fd', C.ink, 2), crystal(66, 66, 26, '#7fc0ea'), line('M92 92 L106 106', C.ink, 4), thermo(16, 96, 0.1, COLD, 0.7)),
  'atmo.uppvind': all(bg(SKY), path('M40 112 L84 40 L116 74 L116 112 Z', ROCK, C.ink, 1.3), path('M78 50 L84 40 L90 48 Z', SNOW, null), path('M4 112 L4 100 L40 100 L40 112 Z', LAND, null),
    arrow(6, 96, 38, 96, HL, 2.6), carrow(40, 96, 64, 84, 78, 46, HL, 2.8), carrow(20, 84, 50, 78, 66, 44, '#7aa6d0', 1.8), cloud(84, 24, 1), bird(64, 30, 1)),
  'atmo.termik': all(bg(SKY), field(96, '#c9a65a'), rect(4, 96, 30, 16, '#6aa44f', 0, null), rect(86, 96, 30, 16, '#6aa44f', 0, null), fir(14, 96, 0.8), fir(104, 96, 0.8), sun(16, 18, 7),
    path('M44 92 C40 70 48 60 60 56 C72 60 80 70 76 92 Z', 'rgba(240,138,93,0.25)', '#f08a5d', 1.2), arrow(60, 90, 60, 50, HL, 3), ...[52, 68].map((x) => heat(x, 92, 20, WARM, 1.4)), cloud(60, 32, 0.9), line('M48 46 C40 40 80 40 72 46', C.ink, 0.8, '2 2'), bird(72, 44, 0.9)),
  'atmo.segelflygplan': all(bg(SKY), cloud(26, 26, 0.9), cloud(96, 86, 0.8), glider(60, 58, 1.2, -6), field(108, LAND)),
  'atmo.molnbas': all(bg(SKY), field(100, LAND), flatCloud(60, 40, 2.2), line('M16 54 L104 54', HL, 3), line('M110 54 L110 98', C.ink, 1.2), path('M107 57 L110 52 L113 57 Z M107 95 L110 100 L113 95 Z', C.ink, null), house(30, 100, 0.8), tree(84, 100, 0.6)),

  // 2617 Atmosfärens lager
  'atmo.troposfär': layers(0, all(plane(64, 90, 0.7), bird(100, 92, 0.6))),
  'atmo.stratosfär': layers(1, all(...[[20, 66], [40, 70], [64, 64], [88, 70], [106, 66]].map(([x, y]) => mol(x!, y!, 'o3', 0.6)), balloon(50, 82, 0.6))),
  'atmo.mesosfär': layers(2, all(line('M20 34 L44 50', '#ffd27a', 2.2), circle(45, 50.5, 2.4, '#ffb04a', null), line('M70 36 L90 48', '#ffd27a', 1.8), circle(91, 48.5, 2, '#ffb04a', null))),
  'atmo.termosfär': layers(3, all(curtain(14, 12, 40, 14, 'rgba(90,230,150,0.55)'), curtain(58, 10, 34, 12, 'rgba(240,120,200,0.45)'), at(96, 22, 0.7, rect(-4, -3, 8, 6, C.silver, 1, C.ink, 0.8), rect(-16, -2, 10, 4, '#3f6fb5', 0, C.ink, 0.6), rect(6, -2, 10, 4, '#3f6fb5', 0, C.ink, 0.6)))),
  'atmo.ozon': all(bg('#eef2f8'), mol(60, 48, 'o3', 3.2), ring(60, 46, 26), greyed(mol(28, 96, 'o2', 1.6), mol(92, 96, 'o2', 1.6))),
  'atmo.ozonskikt': all(bg(SPACE), sun(14, 16, 6), globe(60, 102, 40), circle(60, 102, 50, 'none', 'rgba(142,79,214,0.5)', 7), circle(60, 102, 54, 'none', HL, 2),
    ...[[30, 14, 38, 42], [50, 10, 54, 38], [72, 10, 72, 38]].map(([a, b, c, d]) => ray(a!, b!, c!, d!, UV, 2)), ...[[38, 44], [54, 40], [72, 40]].map(([x, y]) => ban(x!, y!, 4, 1.6)), ray(94, 14, 98, 52, '#f2c14e', 1.6)),
  'atmo.uv-strålning': all(bg('#f2f6fa'), sun(20, 20, 9), field(100, '#f0dca8'), fig(72, C.yellow, 'frown', 1), ellipse(72, 28, 6, 2, 'rgba(230,80,70,0.45)', null),
    ray(32, 30, 62, 32, UV, 2.4), ray(32, 40, 64, 52, UV, 2.4), ray(28, 46, 56, 74, UV, 2.4), circle(72, 26, 10, 'none', HL, 2.2)),
  'atmo.norrsken': all(bg('#121a33'), stars([[14, 12], [100, 10], [60, 6], [110, 40], [20, 46]]), curtain(10, 14, 50, 34, 'rgba(90,230,150,0.6)'), curtain(50, 10, 56, 30, 'rgba(120,240,170,0.5)'), curtain(70, 22, 36, 22, 'rgba(240,120,200,0.35)'),
    field(92, '#dde6ef'), fir(16, 92, 0.9, '#20402c'), fir(30, 92, 0.7, '#20402c'), fir(102, 92, 1, '#20402c'), house(66, 92, 1, '#7a4a2a', '#3d3f4a'), rect(64, 84, 4, 4, '#f2c14e', 0, null)),
  'atmo.meteor': all(bg('#18213d'), stars([[14, 70], [30, 20], [100, 60], [104, 18], [60, 50], [80, 90]]), path('M18 18 L76 66 L72 70 Z', 'rgba(255,230,160,0.8)', null), line('M18 18 L74 68', '#fff3c8', 1.4), circle(76, 69, 5, '#ffb04a', C.ink, 1), circle(76, 69, 9, 'none', 'rgba(255,176,74,0.5)', 3),
    path('M4 112 L4 98 C30 92 60 100 116 94 L116 112 Z', '#2e3a2a', null), fir(20, 100, 0.7, '#1c2a1e'), fir(96, 96, 0.8, '#1c2a1e')),
  'atmo.jetström': all(bg(SPACE), globe(60, 66, 44), path('M16 52 C30 34 44 54 60 40 S90 30 104 46', 'none', HL, 4), arrow(98, 42, 106, 48, HL, 4), line('M16 52 C30 34 44 54 60 40 S90 30 104 46', C.white, 1, '4 4'), plane(52, 40, 0.6, -20)),
  'atmo.väderballong': all(bg(SKY), cloud(26, 70, 0.8), cloud(96, 50, 0.7), ellipse(60, 30, 22, 24, C.white, C.ink, 1.6), path('M54 52 L60 58 L66 52', 'none', C.ink, 1), line('M60 58 L60 84', C.ink, 1), rect(54, 84, 12, 9, C.orange, 1.5, C.ink, 1.1), line('M57 93 L57 98 M63 93 L63 98', C.ink, 0.8), arrow(96, 104, 96, 80, HL, 2.6), field(108, LAND)),
};
