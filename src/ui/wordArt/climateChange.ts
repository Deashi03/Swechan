/**
 * Natur & geografi → Väder & klimat → Klimatförändringar, 2651–2657 (0.43): the greenhouse effect, the
 * greenhouse gases, global warming, climate models, melting ice and sea level, climate adaptation and
 * emission cuts.
 * Recurring signs: yellow straight rays for sunlight and red wavy rays for heat (infrared) radiation, a
 * pale blue shell for the atmosphere, CO₂ as a black ball between two red balls, red for warm and blue for
 * cold, line charts with a grey axis, dashed grey lines for an old or normal level, and an orange highlight
 * ring or box on the thing that the word names. Near words (uppvärmning/global uppvärmning/temperaturökning,
 * återkoppling/självförstärkande, fossilfri/förnybar) differ in the highlighted part. Abstract words are
 * small symbolic scenes, often with a grey reference beside them. Digits only; no words, no brands, no
 * pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { HL } from './people';
import { P as F, type Mood, greyed, coin } from './blindFix';

// ── Palette ──────────────────────────────────────────────────────────
const SKY = '#e2eff8';
const SPACE = '#1f2a48';
const NIGHT = '#27335a';
const SEA = '#5fa3d0';
const SEA2 = '#3c7fb0';
const LAND = '#8cc96a';
const LAND2 = '#5f9e48';
const DRY = '#d9b779';
const ICE = '#e6f4fb';
const WARM = '#e2552e';
const COLD = '#5aa7d6';
const GLASS = 'rgba(214,236,248,0.55)';
const AIR = 'rgba(140,199,232,0.5)';
const SMOKE = '#8f8a86';
const O = '#d64545';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const num = (x: number, y: number, n: string, size = 9, col: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle" fill="${col}">${n}</text>`;

// ── Scenery ──────────────────────────────────────────────────────────
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const field = (y = 96, col: string = LAND) => rect(4, y, 112, 112 - y, col, 0, null);
const sun = (x: number, y: number, r = 7) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 3))} ${f1(y + Math.sin(a) * (r + 3))} L${f1(x + Math.cos(a) * (r + 7))} ${f1(y + Math.sin(a) * (r + 7))}`, C.gold, 2); }), circle(x, y, r, C.yellow, C.ink, 1.3));
const cloud = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M-14 6 C-20 6 -20 -4 -13 -4 C-12 -12 -2 -14 2 -8 C6 -14 16 -10 14 -3 C20 -3 20 6 14 6 Z', col, C.ink, 1.2));
const moon = (x: number, y: number, r = 7) => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${x} ${y + r} A${f1(r * 0.75)} ${r} 0 1 1 ${x} ${y - r} Z`, '#f4e7a8', C.ink, 1.1);
const stars = (pts: number[][]) => all(...pts.map(([x, y]) => sparkle(x!, y!, 1.8, C.white)));
const tree = (x: number, y = 112, s = 1, col: string = LAND2) => at(x, y, s, rect(-2, -14, 4, 14, C.brown, 1, C.ink, 1), circle(0, -20, 9, col, C.ink, 1.2));
const fir = (x: number, y = 112, s = 1, col: string = '#3f7d4e') => at(x, y, s, rect(-1.5, -6, 3, 6, C.brown, 0, null), path('M0 -30 L9 -6 L-9 -6 Z', col, C.ink, 1));
const house = (x: number, y: number, s = 1, col: string = '#e8d9c0', roof: string = '#b84a3a') => at(x, y, s, rect(-9, -12, 18, 12, col, 0, C.ink, 1.1), path('M-11 -12 L0 -21 L11 -12 Z', roof, C.ink, 1.1), rect(-2.5, -7, 5, 7, C.dark, 0, null));
const factory = (x: number, y: number, s = 1, smoke = true) => at(x, y, s, rect(-14, -14, 28, 14, '#b9a99a', 0, C.ink, 1.1), rect(4, -32, 6, 18, '#8c7f74', 0, C.ink, 1.1), path('M-14 -14 L-14 -22 L-6 -14 L-6 -22 L2 -14 Z', '#a89888', C.ink, 1),
  smoke ? all(circle(9, -38, 4, SMOKE, null), circle(13, -45, 5, SMOKE, null), circle(19, -52, 6, SMOKE, null)) : '');
const car = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, path('M-12 0 L-12 -6 L-7 -6 L-4 -11 L6 -11 L9 -6 L12 -6 L12 0 Z', col, C.ink, 1.1), circle(-7, 0, 2.6, C.dark, C.ink, 0.8), circle(7, 0, 2.6, C.dark, C.ink, 0.8));
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.4);
const box = (x: number, y: number, w: number, h: number, col: string = HL, sw = 2.6) => rect(x, y, w, h, 'none', 3, col, sw);
const ban = (x: number, y: number, r = 7, w = 2.4) => all(circle(x, y, r, 'none', C.red, w), line(`M${f1(x - r * 0.7)} ${f1(y + r * 0.7)} L${f1(x + r * 0.7)} ${f1(y - r * 0.7)}`, C.red, w));
const check = (x: number, y: number, r = 7) => all(circle(x, y, r, '#3a9a5a', C.ink, 1.2), path(`M${f1(x - r * 0.45)} ${y} L${f1(x - r * 0.1)} ${f1(y + r * 0.35)} L${f1(x + r * 0.5)} ${f1(y - r * 0.4)}`, 'none', C.white, f1(r * 0.24)));
const thermo = (x: number, y: number, level: number, col: string = C.red, s = 1) => at(x, y, s, rect(-2.6, -26, 5.2, 26, C.white, 2.6, C.ink, 1.1), rect(-1.2, f1(-2 - 22 * level), 2.4, f1(2 + 22 * level), col, 1, null), circle(0, 2, 4.2, col, C.ink, 1.1), line('M2.6 -20 l2 0 M2.6 -14 l2 0 M2.6 -8 l2 0', C.ink, 0.8));
const heat = (x: number, y: number, h = 20, col: string = WARM, sw = 1.8) => line(`M${x} ${y} ` + range(Math.round(h / 5)).map((i) => `q${i % 2 ? -3 : 3} -2.5 0 -5`).join(' '), col, sw);
/** Wavy ray with an arrow head (heat radiation). */
const ray = (x1: number, y1: number, x2: number, y2: number, col: string = WARM, sw = 2) => {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), n = Math.max(2, Math.round(L / 6)), ux = dx / L, uy = dy / L, px = -uy * 2.6, py = ux * 2.6;
  const pts = range(n).map((i) => { const t = (i + 0.5) / n; const s = i % 2 ? -1 : 1; return `${f1(x1 + dx * t + px * s)} ${f1(y1 + dy * t + py * s)}`; });
  const ex = f1(x2 - ux * 5), ey = f1(y2 - uy * 5);
  return all(line(`M${x1} ${y1} L${pts.join(' L')} L${ex} ${ey}`, col, sw), arrow(ex, ey, x2, y2, col, sw));
};
/** Straight sun ray with an arrow head. */
const beam = (x1: number, y1: number, x2: number, y2: number, col: string = C.gold, sw = 2.4) => arrow(x1, y1, x2, y2, col, sw);
const carrow = (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, col: string = HL, sw = 2.6) => {
  const tx = f1(x2 - (x2 - cx) * 0.15), ty = f1(y2 - (y2 - cy) * 0.15);
  return all(line(`M${x1} ${y1} Q${cx} ${cy} ${tx} ${ty}`, col, sw), arrow(tx, ty, x2, y2, col, sw));
};
const ball = (x: number, y: number, r: number, col: string) => all(circle(x, y, r, col, C.ink, 0.9), circle(f1(x - r * 0.35), f1(y - r * 0.35), f1(r * 0.3), 'rgba(255,255,255,0.55)', null));
const co2 = (x: number, y: number, s = 1) => at(x, y, s, ball(-5.6, 0, 3, O), ball(5.6, 0, 3, O), ball(0, 0, 3.6, C.dark));
const ch4 = (x: number, y: number, s = 1) => at(x, y, s, ball(0, -6, 2.2, C.white), ball(-6, 2, 2.2, C.white), ball(6, 2, 2.2, C.white), ball(0, 5, 2.2, C.white), ball(0, 0, 3.6, C.dark));
const globe = (cx: number, cy: number, r: number, land: string = LAND, sea: string = SEA) => all(circle(cx, cy, r, sea, C.ink, 1.6),
  at(f1(cx - r * 0.4), f1(cy - r * 0.25), f1(r / 30), path('M-10 -6 C-6 -14 6 -12 10 -6 C14 0 8 10 2 8 C-4 12 -12 6 -10 -6 Z', land, C.ink, 1.1)),
  at(f1(cx + r * 0.35), f1(cy + r * 0.3), f1(r / 26), path('M-10 -6 C-6 -14 6 -12 10 -6 C14 0 8 10 2 8 C-4 12 -12 6 -10 -6 Z', land, C.ink, 1.1)));
const shell = (cx: number, cy: number, r: number, w: number, col = AIR) => circle(cx, cy, r + w / 2, 'none', col, w);
const fig = (x: number, top: string, mood: Mood = 'smile', h = 1, more: Record<string, unknown> = {}) => F({ x, top, mood, h, ...more });
/** Chart frame: axes from (x, y) with width w and height h. */
const axes = (x: number, y: number, w: number, h: number) => all(rect(x, y - h, w, h, C.white, 2, null), line(`M${x} ${y - h} L${x} ${y} L${x + w} ${y}`, C.ink, 1.4));
const poly = (pts: number[][], col: string, sw = 2) => line('M' + pts.map(([a, b]) => `${a} ${b}`).join(' L'), col, sw);
const bars = (x: number, y: number, hs: number[], w: number, col: string, hl = -1) => all(...hs.map((h, i) => rect(x + i * (w + 2), y - h, w, h, i === hl ? WARM : col, 1, C.ink, 0.8)));
const flame = (x: number, y: number, s = 1, col: string = C.orange) => at(x, y, s, path('M-8 0 C-12 -10 -2 -14 -4 -24 C4 -16 6 -22 4 -30 C14 -20 14 -8 8 0 Z', col, C.ink, 1.2), path('M-3 0 C-5 -6 1 -9 1 -14 C6 -8 7 -4 4 0 Z', C.yellow, null));
const log = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-14, -3.5, 28, 7, C.brown, 3, C.ink, 1), ellipse(14, 0, 2.4, 3.5, C.tan, C.ink, 0.9));
const stump = (x: number, y: number, s = 1) => at(x, y, s, path('M-5 0 L-4 -7 L4 -7 L5 0 Z', C.brown, C.ink, 1), ellipse(0, -7, 4, 1.6, C.tan, C.ink, 0.9));
const cow = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, -14, 16, 9, C.white, C.ink, 1.3), ellipse(-6, -16, 5, 4, C.dark, null), ellipse(7, -12, 4, 3, C.dark, null),
  line('M-11 -6 L-11 2 M-5 -6 L-5 2 M5 -6 L5 2 M11 -6 L11 2', C.ink, 2.4), ellipse(19, -20, 6, 5, C.white, C.ink, 1.2), ellipse(23, -18, 3, 2.4, C.pink, C.ink, 0.8), line('M16 -25 L14 -29 M21 -25 L23 -29', C.ink, 1.4), circle(18, -21, 0.9, C.ink, null), line('M-16 -14 C-20 -10 -20 -4 -18 -2', C.ink, 1.2));
const sheep = (x: number, y: number, s = 1) => at(x, y, s, ...[-8, 0, 8].map((d) => circle(d, -14, 7, C.white, C.ink, 1)), circle(0, -18, 7, C.white, null), line('M-7 -8 L-7 0 M7 -8 L7 0', C.ink, 2), ellipse(14, -17, 4, 5, C.dark, C.ink, 1));
const panel = (x: number, y: number, s = 1) => at(x, y, s, path('M-14 0 L14 0 L18 -12 L-10 -12 Z', '#2f4a7a', C.ink, 1.2), line('M-5 0 L-1 -12 M4 0 L8 -12 M-12 -6 L16 -6', '#8fb4e0', 0.8), line('M2 0 L2 6', C.ink, 1.6));
const turbine = (x: number, y: number, s = 1, rot = 10) => at(x, y, s, path('M-1.6 0 L-0.8 -46 L0.8 -46 L1.6 0 Z', C.white, C.ink, 1), g(`translate(0 -46) rotate(${rot})`, ...[0, 120, 240].map((a) => g(`rotate(${a})`, path('M0 0 C2 -6 2 -18 0 -24 C-1 -18 -1.4 -6 0 0 Z', C.white, C.ink, 1))), circle(0, 0, 2, C.grey2, C.ink, 0.8)));
const pumpjack = (x: number, y: number, s = 1) => at(x, y, s, path('M-10 0 L0 -26 L10 0', 'none', C.dark, 2.4), line('M-24 -28 L22 -24', C.dark, 4), path('M-30 -34 C-30 -22 -22 -20 -20 -28 L-24 -36 Z', C.dark, C.ink, 1), line('M-26 -24 L-26 0', C.ink, 1.4), circle(0, -26, 2, C.grey, C.ink, 1), rect(14, -10, 12, 10, C.grey, 1, C.ink, 1));
const barrel = (x: number, y: number, s = 1) => at(x, y, s, rect(-7, -18, 14, 18, '#3a3a40', 2, C.ink, 1.2), line('M-7 -12 L7 -12 M-7 -6 L7 -6', C.grey, 1));
const oilDrop = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -9 C5 -2 6 3 0 6 C-6 3 -5 -2 0 -9 Z', '#2b2a30', C.ink, 1), ellipse(-1.6, -1, 1, 1.8, 'rgba(255,255,255,0.4)', null));
const coalLump = (x: number, y: number, s = 1) => at(x, y, s, path('M-6 2 L-5 -4 L0 -6 L6 -3 L5 3 L-1 5 Z', '#2e2e36', C.ink, 1));
const plug = (x: number, y: number, s = 1) => at(x, y, s, rect(-6, -6, 12, 10, C.dark, 2, C.ink, 1), line('M-3 -6 L-3 -11 M3 -6 L3 -11', C.silver, 2), line('M0 4 C0 10 -6 10 -6 16', C.dark, 2.4));
const bolt = (x: number, y: number, s = 1) => at(x, y, s, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', C.yellow, C.ink, 1.2));
const gasPump = (x: number, y: number, s = 1) => at(x, y, s, rect(-8, -26, 16, 26, C.red, 2, C.ink, 1.2), rect(-5, -22, 10, 7, C.white, 1, C.ink, 0.8), path('M8 -18 C14 -18 14 -6 12 -2', 'none', C.ink, 1.6));
const screen = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, C.dark, 3, C.ink, 1.4), rect(x + 3, y + 3, w - 6, h - 6, '#16213a', 1, null), rect(x + w / 2 - 4, y + h, 8, 6, C.grey, 0, C.ink, 1), rect(x + w / 2 - 12, y + h + 6, 24, 3, C.grey, 1, C.ink, 1));
/** A globe with a lat/long grid. */
const gridGlobe = (cx: number, cy: number, r: number) => all(globe(cx, cy, r), ...[-0.6, -0.2, 0.2, 0.6].map((t) => line(`M${f1(cx - r * Math.sqrt(1 - t * t))} ${f1(cy + r * t)} L${f1(cx + r * Math.sqrt(1 - t * t))} ${f1(cy + r * t)}`, C.white, 0.8)),
  ...[0.35, 0.75].map((k) => ellipse(cx, cy, f1(r * k), r, 'none', C.white, 0.8)), line(`M${cx} ${cy - r} L${cx} ${cy + r}`, C.white, 0.8));
const tax = (x: number, y: number, s = 1) => at(x, y, s, path('M-12 -8 L8 -8 L14 0 L8 8 L-12 8 Z', '#f4e2a8', C.ink, 1.2), circle(-7, 0, 2, C.white, C.ink, 0.8));

// ── Motifs ───────────────────────────────────────────────────────────
export const CLIMATE_CHANGE_MOTIFS: Record<string, Svg> = {
  // 2651 Växthuseffekten
  'klimf.växthus': all(bg(SKY), field(96, LAND), sun(102, 18, 7), path('M18 96 L18 54 L60 30 L102 54 L102 96 Z', GLASS, C.ink, 1.6), line('M60 30 L60 96 M18 54 L102 54 M39 42 L39 96 M81 42 L81 96', C.ink, 1.1),
    ...[30, 50, 70, 90].map((x) => all(line(`M${x} 96 L${x} 70`, LAND2, 2), circle(x - 3, 78, 3, C.red, C.ink, 0.8), circle(x + 3, 72, 3, C.red, C.ink, 0.8), ellipse(x + 4, 84, 4, 2, LAND2, null))), thermo(110, 92, 0.85, C.red, 0.6)),
  'klimf.solstrålning': all(bg(SKY), field(92, LAND), house(84, 92, 1), tree(30, 92, 0.8), sun(18, 18, 9), ...[[34, 30, 60, 88], [26, 36, 44, 88], [40, 22, 100, 70], [36, 26, 82, 74]].map(([a, b, c, d]) => beam(a!, b!, c!, d!)), box(30, 22, 72, 70)),
  'klimf.värmestrålning': all(bg(NIGHT), moon(100, 18, 6), stars([[16, 14], [44, 20], [70, 10]]), field(92, '#8a7a62'), path('M36 92 C36 76 84 76 84 92 Z', '#b8885c', C.ink, 1.3), ...[44, 60, 76].map((x) => ray(x, 80, x + (x - 60) * 0.4, 36, WARM, 2.2)), thermo(16, 104, 0.7, C.red, 0.6), box(34, 30, 52, 52)),
  'klimf.infraröd': all(bg('#efe8de'), greyed(house(28, 82, 1.9, '#e8d9c0', '#b84a3a')), rect(58, 26, 56, 64, C.dark, 5, C.ink, 1.4), rect(62, 30, 48, 46, '#1d1440', 2, null),
    at(86, 70, 1.6, rect(-9, -12, 18, 12, '#6a2c9a', 0, null), path('M-11 -12 L0 -21 L11 -12 Z', '#f2c14e', null), rect(-7, -10, 5, 5, '#ef6a2a', 0, null), rect(2, -10, 5, 5, '#ef6a2a', 0, null), rect(-2.5, -7, 5, 7, '#f2c14e', 0, null)),
    circle(86, 84, 3, C.grey, C.ink, 1), rect(80, 90, 12, 14, C.dark, 2, C.ink, 1), box(60, 28, 52, 50)),
  'klimf.släppa-igenom': all(bg('#f6f2ea'), sun(14, 16, 7), rect(46, 10, 8, 46, GLASS, 1, C.ink, 1.4), beam(24, 22, 46, 33, C.gold, 2.6), beam(54, 33, 104, 50, HL, 3), ring(50, 33, 9),
    greyed(rect(46, 64, 12, 44, '#b0644a', 1, C.ink, 1.2), line('M46 72 L58 72 M46 80 L58 80 M46 88 L58 88 M46 96 L58 96 M52 64 L52 72 M52 80 L52 88 M52 96 L52 104', C.ink, 0.8), beam(20, 76, 44, 84, C.gold, 2.4))),
  'klimf.jordyta': all(rect(4, 4, 112, 108, SPACE, 3, null), stars([[14, 14], [50, 10], [90, 18], [106, 40]]), path('M4 62 C40 50 80 50 116 62 L116 112 L4 112 Z', '#7a6a5a', null), path('M4 56 C40 44 80 44 116 56 L116 64 C80 52 40 52 4 64 Z', AIR, null),
    path('M4 62 C40 50 80 50 116 62 L116 70 C80 58 40 58 4 70 Z', LAND, null), path('M60 53 C80 53 96 56 116 62 L116 70 C96 64 80 61 60 61 Z', SEA, null), line('M4 62 C40 50 80 50 116 62', HL, 3), tree(30, 58, 0.4), house(48, 56, 0.5), fig(80, C.orange, 'smile', 0.14)),
  'klimf.växthuseffekt': all(bg(SPACE), stars([[14, 100], [106, 104], [100, 14]]), sun(14, 18, 8), shell(64, 70, 34, 9), globe(64, 70, 34), beam(22, 26, 52, 46, C.gold, 2.4),
    ray(70, 44, 92, 8, WARM, 1.8), ray(76, 46, 92, 28, WARM, 1.8), carrow(92, 28, 100, 36, 86, 50, HL, 2.4), thermo(108, 100, 0.65, C.red, 0.6)),
  'klimf.medeltemperatur': all(bg('#f6f2ea'), axes(14, 100, 96, 80), bars(18, 100, [14, 16, 24, 34, 46, 56, 62, 58, 46, 34, 22, 16], 5.8, '#9fc4e6'), line('M14 63 L110 63', HL, 3, '6 3'), thermo(8, 50, 0.45, C.red, 0.5)),
  'klimf.förstärka': all(bg(SPACE), greyed(shell(30, 64, 18, 3), globe(30, 64, 18), thermo(30, 104, 0.3, C.red, 0.5)), arrow(52, 64, 66, 64, HL, 3.4), shell(90, 64, 18, 9, 'rgba(140,199,232,0.8)'), globe(90, 64, 18), thermo(90, 108, 0.9, C.red, 0.5), co2(78, 30, 0.9), co2(102, 32, 0.9), co2(90, 22, 0.9)),

  // 2652 Växthusgaser
  'klimf.miljondel': all(bg('#f6f2ea'), rect(8, 14, 66, 66, C.white, 2, C.ink, 1.2), ...range(10).flatMap((r) => range(10).map((c) => circle(13 + c * 6.4, 19 + r * 6.4, 1.6, '#c9ced4', null))), circle(45, 51, 2.4, C.dark, null), ring(45, 51, 5),
    line('M49 55 L78 80', HL, 1.6, '3 2'), circle(94, 86, 18, C.white, C.ink, 2), co2(94, 86, 1.6), line('M107 99 L114 106', C.ink, 4)),
  'klimf.mätstation': all(bg(SKY), path('M4 112 L4 92 L40 64 L60 58 L80 64 L116 92 L116 112 Z', '#7a5a4a', C.ink, 1.2), rect(4, 100, 112, 12, SEA, 0, null), rect(46, 40, 28, 18, C.white, 1, C.ink, 1.2), path('M46 40 L60 32 L74 40 Z', '#c9ced4', C.ink, 1.2),
    line('M86 58 L86 18', C.ink, 1.6), path('M86 22 L98 22 M86 22 L74 22', 'none', C.ink, 1.4), circle(98, 22, 2, C.grey, C.ink, 0.8), circle(74, 22, 2, C.grey, C.ink, 0.8), path('M86 30 L94 33 L86 36', C.white, C.ink, 1), co2(28, 30, 1), co2(40, 18, 0.8), arrow(34, 34, 48, 44, HL, 2), oval(66, 44, 26, 18)),
  'klimf.förbränning.2': all(bg('#2b3354'), field(98, '#4a5a3e'), log(52, 98, 1, -12), log(68, 98, 1, 12), flame(60, 92, 1.4), co2(34, 36, 1.1), co2(84, 30, 1.1), co2(60, 18, 1), ...[44, 76].map((x) => heat(x, 66, 16, C.orange, 1.6)), ellipse(60, 104, 18, 3, C.grey, null), oval(60, 56, 46, 44)),
  'klimf.olja.2': all(bg(SKY), field(96, DRY), pumpjack(58, 96, 1.4), rect(4, 100, 112, 12, '#8a6a4a', 0, null), line('M22 96 L22 108', C.ink, 1.4), path('M18 104 C22 112 26 112 26 104', '#2b2a30', null), barrel(100, 96, 1.1), oilDrop(100, 64, 1.6), ring(100, 64, 14)),
  'klimf.naturgas': all(bg('#eef0f2'), rect(4, 86, 112, 26, '#a88e6a', 0, null), path('M4 98 C30 92 60 104 116 96 L116 112 L4 112 Z', '#8a7050', null), ellipse(26, 102, 14, 5, '#cfd6dc', C.ink, 1), ch4(26, 102, 0.8),
    line('M26 96 L26 70 L70 70 L70 60', C.grey, 4), rect(52, 52, 40, 8, C.dark, 2, C.ink, 1.2), ...[60, 66, 72, 78, 84].map((x) => path(`M${x} 52 C${x - 3} 46 ${x} 42 ${x} 38 C${x + 3} 42 ${x + 3} 46 ${x} 52 Z`, '#5a9ae6', C.ink, 0.6)), oval(72, 46, 24, 12)),
  'klimf.idisslare': all(bg(SKY), field(92, LAND), cow(46, 100, 1.3), sheep(98, 104, 0.9), circle(75, 72, 2, C.white, C.ink, 0.6), carrow(80, 66, 88, 50, 76, 40, '#9aa3ad', 1.6), carrow(70, 40, 60, 48, 66, 62, '#9aa3ad', 1.6), ch4(92, 36, 0.8), oval(48, 82, 34, 20)),
  'klimf.avskogning': all(bg(SKY), field(96, '#b89a6a'), ...[86, 98, 110].map((x) => fir(x, 98, 1.1)), ...[[14, 98], [30, 102], [46, 96], [62, 102], [24, 108], [56, 108]].map(([x, y]) => stump(x!, y!, 1)), log(40, 88, 1, -6), log(26, 82, 0.9, 4), box(8, 76, 64, 34)),
  'klimf.kolsänka': all(bg(SKY), field(84, LAND), rect(64, 84, 52, 28, SEA, 0, null), ...[14, 28, 42, 56].map((x) => fir(x, 86, 1.1)), co2(24, 24, 1), co2(52, 18, 1), co2(84, 22, 1), co2(104, 36, 0.9), arrow(28, 32, 30, 56, HL, 2.6), arrow(52, 26, 46, 52, HL, 2.6), arrow(86, 30, 88, 80, HL, 2.6), arrow(104, 44, 100, 80, HL, 2.6)),

  // 2653 Global uppvärmning
  'klimf.uppvärmning.2': all(bg('#f6f2ea'), ...[0, 1, 2].map((i) => all(rect(8 + i * 36, 60, 32, 40, ['#9fd0ee', '#f2b27a', '#e2552e'][i]!, 3, C.ink, 1.2), thermo(24 + i * 36, 54, 0.25 + i * 0.35, i ? C.red : COLD, 0.7))), arrow(10, 106, 110, 106, HL, 2.6), arrow(18, 26, 100, 14, HL, 3)),
  'klimf.global-uppvärmning': all(bg(SPACE), stars([[14, 14], [104, 106], [14, 100]]), sun(104, 16, 6), globe(54, 62, 40, '#c9a65a', '#5f8fb8'), circle(54, 62, 40, 'rgba(226,85,46,0.32)', null), circle(54, 62, 46, 'none', HL, 2.6), thermo(104, 92, 0.92, C.red, 1)),
  'klimf.förindustriell': all(bg(SKY), field(92, LAND), at(30, 92, 1, rect(-4, -34, 8, 34, '#e8d9c0', 1, C.ink, 1.1), ...[0, 90, 180, 270].map((a) => g(`translate(0 -34) rotate(${a + 20})`, rect(-1.5, -20, 3, 20, C.brown, 0, C.ink, 0.8)))), house(62, 92, 1.1, '#e8d9c0', '#c9a65a'),
    at(90, 102, 0.8, ellipse(0, -12, 10, 6, C.brown, C.ink, 1), line('M-6 -6 L-6 4 M6 -6 L6 4', C.ink, 2), path('M8 -16 L14 -24 L16 -18 Z', C.brown, C.ink, 1)), box(8, 40, 102, 68), greyed(factory(102, 36, 0.6))),
  'klimf.temperaturökning': all(bg('#f6f2ea'), thermo(40, 96, 0.82, C.red, 2.4), line('M46 72 L70 72', C.grey, 1.4, '3 2'), arrow(80, 72, 80, 32, HL, 3.6), num(98, 56, '+2', 14, C.red), line('M46 40 L70 40', HL, 2)),
  'klimf.mätserie': all(bg('#f6f2ea'), axes(10, 92, 100, 70), ...range(25).map((i) => circle(14 + i * 3.9, f1(76 - i * 1.1 - Math.sin(i * 1.7) * 6), 1.8, C.denim, null)), num(16, 104, '1', 8), num(104, 104, '9', 8), line('M14 104 L100 104', C.grey, 1, '2 2'), box(12, 26, 96, 64)),
  'klimf.rekordvarm': all(bg('#fbefe2'), sun(100, 18, 7), axes(10, 104, 84, 74), bars(14, 104, [24, 30, 22, 34, 38, 32, 44, 50, 64], 7, '#f2b27a', 8), line('M14 54 L94 54', C.grey, 1.2, '3 2'), sparkle(90, 32, 4, C.gold), ring(88, 40, 8)),
  'klimf.trend.2': all(bg('#f6f2ea'), axes(10, 100, 100, 80), poly(range(16).map((i) => [14 + i * 6.2, f1(86 - i * 3.2 + (i % 2 ? -8 : 7) + (i % 3) * 2)]), C.grey, 1.6), line('M14 90 L108 34', HL, 3.4), arrow(100, 39, 109, 33, HL, 3.4)),
  'klimf.klimatforskare': all(bg('#eef2f4'), screen(54, 18, 56, 40), poly([[60, 50], [70, 46], [80, 48], [90, 38], [100, 30], [104, 26]], C.red, 2), fig(32, C.white, 'calm', 0.92, { bottom: C.navy }), globe(86, 96, 12), rect(64, 108, 44, 4, C.brown, 1, null)),
  'klimf.samstämmig': all(bg('#f6f2ea'), ...[[20, C.orange], [60, C.green], [100, C.denim]].map(([x, c]) => all(fig(x as number, c as string, 'smile', 0.62), rect((x as number) - 14, 8, 28, 22, C.white, 3, C.ink, 1.2), path(`M${(x as number) - 4} 30 L${x} 36 L${(x as number) + 4} 30`, C.white, C.ink, 1), poly([[(x as number) - 10, 26], [(x as number) - 2, 20], [(x as number) + 10, 12]], C.red, 2), check((x as number) + 10, 54, 5))), box(4, 4, 112, 36)),
  'klimf.påverkan.2': all(bg(SKY), field(96, LAND), factory(24, 96, 1), car(30, 106, 0.8), arrow(46, 58, 70, 58, HL, 3.4), tree(84, 96, 0.9, '#b8a050'), tree(102, 96, 0.8, '#9a8a50'), field(104, DRY), thermo(96, 50, 0.85, C.red, 0.8)),
  'klimf.naturlig-variation': all(bg('#f6f2ea'), axes(10, 100, 100, 70), line('M12 66 L108 66', C.grey, 1.6, '4 3'), poly(range(17).map((i) => [12 + i * 6, f1(66 + Math.sin(i * 1.1) * 14)]), HL, 2.6), sun(30, 18, 5), path('M86 26 L94 12 L102 26 Z', '#8a6a5a', C.ink, 1), circle(94, 9, 3, SMOKE, null)),
  'klimf.solaktivitet': all(bg(SPACE), circle(56, 60, 38, C.yellow, C.ink, 1.6), circle(56, 60, 38, 'rgba(239,138,60,0.3)', null), ...[[44, 50, 4], [50, 54, 2.6], [68, 70, 3.4], [72, 66, 2]].map(([x, y, r]) => circle(x!, y!, r!, '#7a4a20', null)), path('M86 40 C104 28 110 50 92 56', 'none', C.orange, 4), path('M22 82 C8 92 16 104 28 92', 'none', C.orange, 3.4), ring(56, 60, 44)),

  // 2654 Klimatmodeller
  'klimf.klimatmodell': all(bg('#eef2f4'), screen(14, 10, 92, 76), gridGlobe(60, 48, 30), rect(48, 30, 10, 10, 'rgba(226,85,46,0.7)', 0, null), rect(62, 50, 10, 10, 'rgba(226,85,46,0.5)', 0, null), rect(40, 50, 8, 8, 'rgba(90,167,214,0.7)', 0, null), box(12, 8, 96, 80)),
  'klimf.beräkna': all(bg('#f6f2ea'), rect(14, 20, 40, 70, C.dark, 5, C.ink, 1.4), rect(19, 25, 30, 14, '#cfe0c8', 2, null), num(34, 36, '420', 10), ...range(3).flatMap((r) => range(3).map((c) => rect(19 + c * 11, 44 + r * 14, 8, 10, C.grey2, 2, C.ink, 0.8))),
    rect(64, 22, 46, 60, C.white, 2, C.ink, 1.2), ...range(5).map((i) => line(`M70 ${32 + i * 10} L${100 - (i % 2) * 10} ${32 + i * 10}`, C.grey, 1.4)), num(88, 88, '=', 12), box(10, 16, 104, 78)),
  'klimf.superdator': all(bg('#2b2f3a'), rect(4, 100, 112, 12, '#4a4f5a', 0, null), ...[10, 32, 54, 76].map((x) => all(rect(x, 22, 18, 78, '#15171f', 2, C.ink, 1.2), ...range(10).map((i) => all(line(`M${x + 3} ${28 + i * 7} L${x + 15} ${28 + i * 7}`, '#3a3f4a', 1.2), circle(x + 14, 28 + i * 7, 0.9, i % 3 ? '#4fdc7a' : '#5aa7ff', null))))), fig(106, C.orange, 'smile', 0.62)),
  'klimf.osäkerhet.2': all(bg('#f6f2ea'), axes(10, 100, 100, 80), path('M60 62 L108 30 L108 92 Z', 'rgba(226,85,46,0.25)', null), poly([[12, 74], [24, 70], [36, 72], [48, 66], [60, 62]], C.ink, 2.2), line('M60 62 L108 60', HL, 2.4, '4 3'), line('M60 62 L108 30 M60 62 L108 92', HL, 1.4), line('M108 32 L108 90', HL, 3)),
  'klimf.sannolikhet': all(bg('#f6f2ea'), cloud(40, 32, 1.6, C.grey2), ...[24, 36, 48, 60].map((x) => line(`M${x} 50 l-3 8`, C.denim, 1.8)), rect(14, 76, 92, 14, C.white, 3, C.ink, 1.2), rect(14, 76, 64, 14, C.denim, 3, null), rect(14, 76, 92, 14, 'none', 3, C.ink, 1.2), num(92, 50, '70%', 14), box(10, 72, 100, 22)),
  'klimf.återkoppling.2': all(bg('#f6f2ea'), sun(60, 16, 6), rect(8, 46, 30, 18, ICE, 2, C.ink, 1.2), rect(82, 46, 30, 18, SEA2, 2, C.ink, 1.2), thermo(60, 104, 0.8, C.red, 0.8),
    carrow(40, 52, 60, 36, 80, 52, HL, 2.6), carrow(96, 68, 92, 92, 70, 96, HL, 2.6), carrow(50, 96, 26, 92, 22, 68, HL, 2.6)),
  'klimf.självförstärkande': all(bg('#f6f2ea'), path('M60 60 m-4 0 a4 4 0 1 1 8 0 a10 10 0 1 1 -18 2 a18 18 0 1 1 34 -4 a28 28 0 1 1 -48 10', 'none', HL, 3), arrow(16, 70, 14, 82, HL, 3), greyed(path('M96 96 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0', 'none', C.grey, 2.4)), num(60, 64, '+', 10, WARM), num(84, 50, '+', 12, WARM), num(28, 30, '+', 16, WARM)),

  // 2655 Isavsmältning och havsnivå
  'klimf.havsis': all(bg('#dfeaf2'), rect(4, 56, 112, 56, SEA2, 0, null), ...[[24, 60, 18], [62, 62, 22], [100, 59, 12]].map(([x, y, w]) => all(path(`M${x! - w!} ${y} L${x! + w!} ${y} L${x! + w! - 4} ${y! + 6} L${x! - w! + 3} ${y! + 6} Z`, ICE, C.ink, 1.2), path(`M${x! - w! + 3} ${y! + 6} L${x! + w! - 4} ${y! + 6} L${x! + w! - 8} ${y! + 14} L${x! - w! + 6} ${y! + 14} Z`, 'rgba(230,244,251,0.5)', null))), line('M4 62 L116 62', '#9fd0ee', 1),
    at(62, 60, 0.6, ellipse(0, -10, 14, 8, C.white, C.ink, 1.2), circle(14, -14, 6, C.white, C.ink, 1.2), circle(16, -15, 0.9, C.ink, null), line('M-8 -3 L-8 2 M6 -3 L6 2', C.ink, 3)), oval(62, 64, 28, 12)),
  'klimf.havsnivåhöjning': all(bg(SKY), path('M4 112 L4 50 L40 50 L60 70 L60 112 Z', '#c9a874', C.ink, 1.2), house(22, 50, 1), rect(60, 66, 56, 46, SEA, 0, null), line('M40 86 L116 86', C.grey, 1.4, '4 3'), line('M58 66 L116 66', HL, 2.6), rect(98, 40, 4, 72, C.white, 0, C.ink, 1), ...range(7).map((i) => line(`M98 ${44 + i * 10} L102 ${44 + i * 10}`, C.ink, 1)), arrow(86, 84, 86, 68, HL, 3)),
  'klimf.värmeutvidgning': all(bg('#f6f2ea'), ...[[30, '#9fd0ee', 70, COLD, 0.15], [86, '#f2a07e', 54, C.red, 0.85]].map(([x, col, lv, tc, l]) => all(path(`M${(x as number) - 16} 40 L${(x as number) - 16} 96 L${(x as number) + 16} 96 L${(x as number) + 16} 40`, 'none', C.ink, 1.6), rect((x as number) - 15, lv as number, 30, 96 - (lv as number), col as string, 0, null), thermo((x as number) + 24, 92, l as number, tc as string, 0.5))),
    line('M14 70 L102 70', C.grey, 1.2, '3 2'), line('M70 54 L102 54', HL, 2.6), arrow(86, 68, 86, 58, HL, 2.6), arrow(50, 76, 64, 76, C.ink, 2)),
  'klimf.låglänt': all(bg(SKY), rect(4, 80, 112, 32, SEA, 0, null), path('M4 82 L30 82 L34 76 L116 76 L116 112 L4 112 Z', LAND, C.ink, 1), line('M4 80 L30 80', '#9fd0ee', 1), path('M30 82 L34 72 L38 76', '#8a7a5a', C.ink, 1), ...[50, 70, 90].map((x) => house(x, 76, 0.7)),
    line('M42 78 L116 78', HL, 2.6), greyed(path('M80 76 L96 44 L112 76 Z', '#8a8a8a', null)), line('M118 76 L118 80', C.ink, 1)),

  // 2656 Klimatanpassning
  'klimf.riskområde': all(bg('#eef2e6'), rect(8, 8, 104, 100, '#e6edd8', 3, C.ink, 1.2), path('M8 60 C30 54 50 70 70 60 S100 50 112 58', 'none', SEA, 6), path('M8 46 C30 40 50 56 70 46 S100 36 112 44 L112 74 C100 66 86 76 70 74 S30 70 8 76 Z', 'rgba(214,69,69,0.35)', C.red, 1.4),
    ...[[24, 30], [52, 92], [90, 92], [96, 26]].map(([x, y]) => house(x!, y!, 0.7)), house(46, 62, 0.7), path('M90 50 L100 34 L110 50 Z', C.yellow, C.ink, 1.2), line('M100 40 L100 45 M100 47 L100 48', C.ink, 1.6)),
  'klimf.torktålig': all(bg('#fbefe2'), sun(100, 16, 7), field(90, DRY), ...range(6).map((i) => line(`M${10 + i * 18} 96 l6 4 l-3 6`, '#a0805a', 1.2)), greyed(line('M30 90 L30 64', C.brown, 2), path('M30 66 C22 70 20 78 24 82 M30 70 C38 72 40 80 36 84', 'none', C.brown, 2)),
    at(80, 90, 1, rect(-5, -36, 10, 36, '#5f9e48', 5, C.ink, 1.2), rect(-15, -26, 7, 14, '#5f9e48', 3, C.ink, 1), rect(8, -30, 7, 16, '#5f9e48', 3, C.ink, 1), circle(0, -38, 3, C.pink, C.ink, 0.8)), oval(80, 66, 22, 30)),

  // 2657 Utsläppsminskningar
  'klimf.Parisavtalet': all(bg('#f3f0e8'), at(28, 104, 1, path('M-14 0 L-4 -40 L0 -70 L4 -40 L14 0 L8 0 L0 -26 L-8 0 Z', '#8a7a6a', C.ink, 1.2), line('M-9 -18 L9 -18 M-5 -40 L5 -40', C.ink, 1.2)), rect(50, 14, 58, 76, C.white, 2, C.ink, 1.4), globe(79, 38, 14), num(79, 70, '2015', 11),
    ...range(4).map((i) => path(`M${56 + i * 13} 84 q3 -6 6 0 q2 -4 4 0`, 'none', C.navy, 1.2)), box(46, 10, 66, 84)),
  'klimf.klimatmål': all(bg('#f6f2ea'), axes(10, 100, 100, 80), bars(14, 100, [70, 66, 58, 50, 40, 30, 20, 10], 9, C.grey2), poly([[18, 32], [40, 40], [62, 56], [84, 78], [100, 99]], HL, 2.4), line('M102 99 L102 64', C.ink, 1.4), path('M102 64 L114 68 L102 72 Z', HL, C.ink, 1), num(104, 58, '2045', 9)),
  'klimf.utsläppsminskning': all(bg(SKY), field(100, LAND), ...[0, 1, 2].map((i) => at(22 + i * 36, 100, 0.9, rect(-8, -16, 16, 16, '#b9a99a', 0, C.ink, 1), rect(2, -30, 5, 14, '#8c7f74', 0, C.ink, 1), ...range(3 - i).map((j) => circle(5 + j * 4, -36 - j * 7, 4 + j, SMOKE, null)))), arrow(14, 20, 106, 54, HL, 3.4)),
  'klimf.fasa-ut': all(bg('#f6f2ea'), ...[0, 1, 2, 3].map((i) => `<g opacity="${(1 - i * 0.28).toFixed(2)}">${all(coalLump(20 + i * 26, 64, 2 - i * 0.4))}</g>`), circle(98, 64, 9, 'none', C.grey2, 1.4), arrow(14, 90, 106, 90, HL, 3), ...[20, 46, 72, 98].map((x, i) => rect(x - 6, 96, 12, 4, i === 3 ? HL : C.grey2, 1, null))),
  'klimf.fossilfri': all(bg(SKY), field(96, LAND), turbine(28, 96, 1), panel(64, 96, 1), sun(64, 22, 6), arrow(76, 80, 92, 80, C.ink, 2), house(104, 96, 0.9), bolt(104, 62, 0.8), greyed(barrel(18, 40, 0.9), coalLump(34, 34, 1.4)), ban(26, 30, 14, 2.6)),
  'klimf.vindkraft': all(bg(SKY), field(96, LAND), path('M4 96 C40 82 80 82 116 96', LAND2, null), turbine(34, 92, 1.3, 20), turbine(84, 90, 1.1, 60), ...[20, 30, 40].map((y) => line(`M6 ${y} l14 0`, C.white, 2)), line('M84 90 L84 104 L110 104', C.dark, 1.4), bolt(110, 96, 0.6)),
  'klimf.solenergi': all(bg(SKY), field(96, LAND), sun(20, 18, 8), beam(30, 30, 54, 70, C.gold, 2.4), beam(36, 24, 70, 66, C.gold, 2.4), panel(62, 84, 1.6), line('M66 92 L66 100 L94 100', C.dark, 1.6), house(98, 96, 1.1), bolt(80, 100, 0.5), at(98, 70, 0.8, circle(0, -6, 8, '#fff2b0', C.ink, 1.2), rect(-3.5, 2, 7, 5, C.grey, 1, C.ink, 1)), box(24, 14, 52, 62)),
  'klimf.elektrifiering': all(bg(SKY), field(100, '#c9ced4'), greyed(gasPump(18, 98, 1), car(40, 104, 0.8, C.grey)), arrow(52, 74, 70, 74, HL, 3.4), car(88, 100, 1, C.green), plug(100, 70, 0.9), bolt(84, 60, 0.9), line('M100 86 L94 94', C.dark, 2)),
  'klimf.koldioxidskatt': all(bg('#f6f2ea'), factory(28, 100, 1.1), co2(46, 26, 1.2), tax(84, 38, 1.6), co2(82, 38, 0.6), ...[0, 1, 2, 3].map((i) => coin(84, 98 - i * 6, 8)), arrow(60, 32, 66, 36, C.ink, 1.8), box(58, 18, 52, 90)),
};
