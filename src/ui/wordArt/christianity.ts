/**
 * Historia & humaniora → Religion & idéhistoria → Kristendomens historia, 2111–2117 (0.38): the Bible and the
 * gospels, the early church, the Catholic church, Orthodox Christianity, the Protestant reformation, the history
 * of the Church of Sweden and the Christian holidays. Holy persons are never drawn as caricatures: Jesus is
 * shown only through signs (a cross, an empty tomb, a manger, light), and people are believers, priests, monks
 * and nuns in simple robes. The part that carries the word is drawn in a warm orange fill, in gold, or outlined
 * with the accent colour while a grey reference stays behind. Digits only; no words and no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, star, type Svg } from './kit';
import { type Build } from './figures';
import { HL, T, arm, cloud, sun } from './people';
import { P as F, type Mood, greyed } from './blindFix';

// ── Colours ──────────────────────────────────────────────────────────
const STONE = '#cfc6b4';
const STONE2 = '#a99f8e';
const LIME = '#f3eee2';
const WOOD = '#a8743f';
const WOOD2 = '#7a4a20';
const ROOF = '#b5523b';
const SLATE = '#6b7380';
const GOLD = C.gold;
const GOLD2 = '#b8892a';
const RED = '#c8372d';
const HLF = '#f6b48f';
const BLACK = '#2e2e36';
const BROWN = '#8a5a35';
const WHITE = '#fbfbf8';
const NIGHT = '#2f3a5a';
const SKYC = '#dcecf6';
const GRASS = '#9fcb84';
const SAND = '#e8d3a2';
const BLUE = '#2f5fa8';
const PURPLE = '#7b3fa0';
const f1 = (n: number) => n.toFixed(1);

// ── Basics ───────────────────────────────────────────────────────────
const ground = line('M4 112 L116 112', C.grey2, 2);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const lo = (d: string, col: string, w: number) => line(d, C.ink, w + 2) + line(d, col, w);
const noSign = (x: number, y: number, r = 8) => all(circle(x, y, r, 'none', RED, 2.6), line(`M${f1(x - r * 0.7)} ${f1(y - r * 0.7)} L${f1(x + r * 0.7)} ${f1(y + r * 0.7)}`, RED, 2.6));
const flame = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -16 C8 -6 12 0 10 6 C8 13 -8 13 -10 6 C-12 0 -6 -4 -4 -10 C-2 -4 0 -4 0 -16 Z', C.orange, C.ink, 1.2), path('M0 -2 C4 2 4 8 0 9 C-4 8 -4 2 0 -2 Z', C.yellow, null));
const hill = (x1: number, x2: number, top: number, col: string = GRASS) => path(`M${x1} 112 C${x1 + (x2 - x1) * 0.25} ${top} ${x1 + (x2 - x1) * 0.75} ${top} ${x2} 112 Z`, col, C.ink, 1.5);
const moon = (x: number, y: number, r = 6) => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${f1(x + r * 0.9)} ${f1(y + r * 0.4)} A${f1(r * 0.8)} ${f1(r * 0.8)} 0 1 1 ${x} ${y - r} Z`, '#f3e6a1', C.ink, 1.1);
const rays = (x: number, y: number, r1: number, r2: number, n = 9, col: string = GOLD, a0 = -Math.PI, a1 = 0) => all(...Array.from({ length: n }, (_, i) => { const a = a0 + ((a1 - a0) * (i + 0.5)) / n; return line(`M${f1(x + Math.cos(a) * r1)} ${f1(y + Math.sin(a) * r1)} L${f1(x + Math.cos(a) * r2)} ${f1(y + Math.sin(a) * r2)}`, col, 2); }));
const notes = (x: number, y: number, s = 1, col: string = C.navy) => at(x, y, s, path('M0 6 L0 -10 L8 -12 L8 4', 'none', col, 2), ellipse(-2.5, 6, 3.4, 2.6, col, null), ellipse(5.5, 4, 3.4, 2.6, col, null));
const tree = (x: number, y: number, s = 1, col: string = '#5f9e58') => at(x, y, s, rect(-2, -14, 4, 14, WOOD2, 1, C.ink, 1), circle(0, -20, 10, col, C.ink, 1.4));
const palm = (x: number, y: number, s = 1, rot = 0) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, ...[-4.6, -1.6, 1.4, 4.4].map((d, i) => rect(d - 1.3, -9 + Math.abs(i - 1.5) * 1.2, 2.6, 9, C.skin, 1.3, C.ink, 0.9)), path('M-5.5 -1 L5.5 -1 L5 5 C4 8 -4 8 -5 5 Z', C.skin, C.ink, 1));
/** A Latin cross centred on (x, y): `h` tall. */
const crossS = (x: number, y: number, h = 16, col: string = GOLD, w = 3) => all(lo(`M${x} ${f1(y - h / 2)} L${x} ${f1(y + h / 2)}`, col, w), lo(`M${f1(x - h * 0.3)} ${f1(y - h * 0.18)} L${f1(x + h * 0.3)} ${f1(y - h * 0.18)}`, col, w));
/** An Orthodox cross (three bars, the lowest slanted). */
const orthoCross = (x: number, y: number, h = 20, col: string = GOLD, w = 3) => all(lo(`M${x} ${f1(y - h / 2)} L${x} ${f1(y + h / 2)}`, col, w), lo(`M${f1(x - h * 0.16)} ${f1(y - h * 0.36)} L${f1(x + h * 0.16)} ${f1(y - h * 0.36)}`, col, w), lo(`M${f1(x - h * 0.3)} ${f1(y - h * 0.16)} L${f1(x + h * 0.3)} ${f1(y - h * 0.16)}`, col, w), lo(`M${f1(x - h * 0.18)} ${f1(y + h * 0.2)} L${f1(x + h * 0.18)} ${f1(y + h * 0.08)}`, col, w));
const candle = (x: number, base: number, s = 1, lit = true, col: string = '#f4efe2') => at(x, base, s, rect(-3, -16, 6, 16, col, 1, C.ink, 1), line('M0 -16 L0 -19', C.ink, 1), lit ? flame(0, -22, 0.38) : '');
const fish = (x: number, y: number, s = 1, col: string = C.ink) => at(x, y, s, path('M-10 -5 C-4 6 6 6 10 -2 M-10 5 C-4 -6 6 -6 10 2', 'none', col, 1.8));
const bread = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 0, 8, 4.5, '#d79a52', C.ink, 1.2), line('M-4 -3 L-2 1 M0 -4 L2 0 M4 -3 L6 1', '#9a6428', 1));
const fishFood = (x: number, y: number, s = 1) => at(x, y, s, path('M-9 0 C-5 -5 4 -5 6 0 C4 5 -5 5 -9 0 Z M6 0 L10 -4 L10 4 Z', '#9fb4c4', C.ink, 1), circle(-5, -1, 0.9, C.ink, null));
const basket = (x: number, y: number, s = 1) => at(x, y, s, path('M-12 -4 L12 -4 L9 8 L-9 8 Z', '#c99a5a', C.ink, 1.3), line('M-10 0 L10 0 M-9.5 4 L9.5 4', '#8a6030', 1));
const chalice = (x: number, y: number, s = 1, col: string = GOLD) => at(x, y, s, path('M-9 -14 L9 -14 C9 -4 4 0 1.5 1 L1.5 8 L7 11 L7 13 L-7 13 L-7 11 L-1.5 8 L-1.5 1 C-4 0 -9 -4 -9 -14 Z', col, C.ink, 1.3), path('M-8 -12 L8 -12 C7.5 -8 5 -6 0 -6 C-5 -6 -7.5 -8 -8 -12 Z', '#8a2040', null));
const wafer = (x: number, y: number, r = 7) => all(circle(x, y, r, WHITE, C.ink, 1.3), line(`M${x} ${f1(y - r * 0.6)} L${x} ${f1(y + r * 0.6)} M${f1(x - r * 0.45)} ${f1(y - r * 0.1)} L${f1(x + r * 0.45)} ${f1(y - r * 0.1)}`, '#c9b98a', 1.2));
const ring = (x: number, y: number, r = 5, col: string = GOLD) => all(circle(x, y, r, 'none', C.ink, 3.4), circle(x, y, r, 'none', col, 2));
const coin = (x: number, y: number, r = 5) => all(circle(x, y, r, GOLD, C.ink, 1.2), circle(x, y, r * 0.55, 'none', GOLD2, 1));
const shell = (x: number, y: number, s = 1) => at(x, y, s, path('M0 8 L-10 -2 C-8 -10 8 -10 10 -2 Z', '#f2d9c0', C.ink, 1.2), line('M0 8 L-6 -6 M0 8 L0 -8 M0 8 L6 -6', '#c8a080', 1));
/** A calendar page (digits only). */
const cal = (x: number, y: number, num: string, top: string = RED, w = 30, h = 30) => all(rect(x - w / 2, y - h / 2, w, h, WHITE, 3, C.ink, 1.6), path(`M${x - w / 2} ${y - h / 2 + 3} Q${x - w / 2} ${y - h / 2} ${x - w / 2 + 3} ${y - h / 2} L${x + w / 2 - 3} ${y - h / 2} Q${x + w / 2} ${y - h / 2} ${x + w / 2} ${y - h / 2 + 3} L${x + w / 2} ${y - h / 2 + 8} L${x - w / 2} ${y - h / 2 + 8} Z`, top, C.ink, 1.2), T(x, y + h / 2 - 5, num, h * 0.5, C.ink));

// ── Books ────────────────────────────────────────────────────────────
/** A closed book seen from the front (cover). */
const book = (x: number, y: number, w = 22, h = 30, col: string = BLACK, mark: 'cross' | 'none' | 'notes' = 'cross') => all(
  rect(x - w / 2 + 2, y - h / 2 + 2, w, h, '#efe6d2', 2, C.ink, 1.2), rect(x - w / 2, y - h / 2, w, h, col, 2, C.ink, 1.6), line(`M${x - w / 2 + 3} ${y - h / 2 + 1} L${x - w / 2 + 3} ${y + h / 2 - 1}`, '#00000033', 1.4),
  mark === 'cross' ? crossS(x + 1, y - 1, h * 0.45, GOLD, 1.6) : mark === 'notes' ? notes(x - 1, y, w / 26, GOLD) : '');
/** An open book (two pages) centred on (x, y). */
const openBook = (x: number, y: number, w = 40, col: string = BLACK, lines = true) => {
  const h = w * 0.55;
  return all(path(`M${x - w / 2 - 2} ${y + h / 2 + 2} L${x - w / 2 - 2} ${y - h / 2 + 2} L${x + w / 2 + 2} ${y - h / 2 + 2} L${x + w / 2 + 2} ${y + h / 2 + 2} Z`, col, C.ink, 1.4),
    path(`M${x} ${y - h / 2 + 4} C${x - w * 0.2} ${y - h / 2} ${x - w * 0.4} ${y - h / 2} ${x - w / 2} ${y - h / 2 + 2} L${x - w / 2} ${y + h / 2} C${x - w * 0.4} ${y + h / 2 - 2} ${x - w * 0.2} ${y + h / 2 - 2} ${x} ${y + h / 2 + 2} Z`, WHITE, C.ink, 1.2),
    path(`M${x} ${y - h / 2 + 4} C${x + w * 0.2} ${y - h / 2} ${x + w * 0.4} ${y - h / 2} ${x + w / 2} ${y - h / 2 + 2} L${x + w / 2} ${y + h / 2} C${x + w * 0.4} ${y + h / 2 - 2} ${x + w * 0.2} ${y + h / 2 - 2} ${x} ${y + h / 2 + 2} Z`, WHITE, C.ink, 1.2),
    lines ? all(...[0.2, 0.4, 0.6, 0.8].flatMap((t) => [line(`M${f1(x - w * 0.42)} ${f1(y - h / 2 + 4 + t * (h - 6))} L${f1(x - w * 0.08)} ${f1(y - h / 2 + 5 + t * (h - 6))}`, C.grey, 1), line(`M${f1(x + w * 0.08)} ${f1(y - h / 2 + 5 + t * (h - 6))} L${f1(x + w * 0.42)} ${f1(y - h / 2 + 4 + t * (h - 6))}`, C.grey, 1)])) : '');
};
/** Book seen from the side so the page block shows (for the two testaments). */
const bibleBlock = (hl: 'old' | 'new' | 'none') => all(
  path('M16 34 L100 34 L104 92 L20 92 Z', BLACK, C.ink, 1.8),
  rect(22, 40, 54, 46, hl === 'old' ? HLF : '#f2ecdf', 1, C.ink, 1.4), rect(76, 40, 24, 46, hl === 'new' ? HLF : '#f2ecdf', 1, C.ink, 1.4),
  ...[48, 56, 64, 72, 80].map((y) => line(`M24 ${y} L74 ${y}`, '#d9cfbb', 0.8)), ...[48, 56, 64, 72, 80].map((y) => line(`M78 ${y} L98 ${y}`, '#d9cfbb', 0.8)),
  path('M16 92 L104 92 L104 100 L16 100 Z', BLACK, C.ink, 1.6), crossS(60, 96, 6, GOLD, 1),
  hl === 'old' ? rect(19, 37, 60, 52, 'none', 3, HL, 2.4) : '', hl === 'new' ? rect(73, 37, 30, 52, 'none', 3, HL, 2.4) : '');
/** Two stone tablets (the commandments) with digits. */
const tablets = (x: number, y: number, s = 1, hl = false) => at(x, y, s,
  path('M-26 22 L-26 -14 C-26 -26 -2 -26 -2 -14 L-2 22 Z', hl ? HLF : STONE, C.ink, 1.6), path('M2 22 L2 -14 C2 -26 26 -26 26 -14 L26 22 Z', hl ? HLF : STONE, C.ink, 1.6),
  ...[1, 2, 3, 4, 5].map((n, i) => T(-14, -8 + i * 7, String(n), 6, C.ink)), ...[6, 7, 8, 9, 10].map((n, i) => T(14, -8 + i * 7, String(n), 6, C.ink)));

// ── Buildings ────────────────────────────────────────────────────────
/** A small church with a tower on the right (local base 0). */
const churchL = (col: string = LIME, roof: string = ROOF, tip: Svg = '') => all(
  rect(-26, -32, 34, 32, col, 0.5, C.ink, 1.5), path('M-29 -32 L-9 -48 L11 -32 Z', roof, C.ink, 1.5),
  rect(8, -62, 16, 62, col, 0.5, C.ink, 1.5), path('M6 -62 L16 -86 L26 -62 Z', roof, C.ink, 1.5),
  tip || line('M16 -86 L16 -95 M12 -91 L20 -91', C.ink, 1.6),
  path('M-13 0 L-13 -12 C-13 -18 -5 -18 -5 -12 L-5 0 Z', WOOD2, C.ink, 1.2), path('M13 -44 C13 -50 19 -50 19 -44 L19 -38 L13 -38 Z', '#5a6a80', C.ink, 1), rect(-22, -24, 5, 8, '#9fc3dc', 1, C.ink, 0.9), rect(-1, -24, 5, 8, '#9fc3dc', 1, C.ink, 0.9));
const church = (x: number, base: number, s = 1, col: string = LIME, roof: string = ROOF, tip: Svg = '') => at(x, base, s, churchL(col, roof, tip));
/** An onion dome (local: centred on the drum top at 0,0). */
const onionL = (w = 16, col: string = GOLD) => all(path(`M0 ${f1(-w * 1.5)} C${f1(w * 0.15)} ${f1(-w * 1.15)} ${f1(w * 0.75)} ${f1(-w * 0.95)} ${f1(w * 0.62)} ${f1(-w * 0.35)} C${f1(w * 0.55)} -2 ${f1(w * 0.3)} 0 0 0 C${f1(-w * 0.3)} 0 ${f1(-w * 0.55)} -2 ${f1(-w * 0.62)} ${f1(-w * 0.35)} C${f1(-w * 0.75)} ${f1(-w * 0.95)} ${f1(-w * 0.15)} ${f1(-w * 1.15)} 0 ${f1(-w * 1.5)} Z`, col, C.ink, 1.4), orthoCross(0, -w * 1.5 - 6, 11, GOLD2, 1.3));
/** An Orthodox church with one big and two small onion domes (local base 0). */
const orthoChurchL = (dome: string = GOLD, wall: string = LIME) => all(
  rect(-30, -34, 60, 34, wall, 0.5, C.ink, 1.5), rect(-10, -54, 20, 20, wall, 0.5, C.ink, 1.4), g('translate(0 -54)', onionL(18, dome)),
  rect(-28, -44, 12, 10, wall, 0.5, C.ink, 1.2), g('translate(-22 -44)', onionL(10, dome)), rect(16, -44, 12, 10, wall, 0.5, C.ink, 1.2), g('translate(22 -44)', onionL(10, dome)),
  path('M-6 0 L-6 -14 C-6 -20 6 -20 6 -14 L6 0 Z', WOOD2, C.ink, 1.2), ...[-20, 20].map((d) => path(`M${d - 3} -16 L${d - 3} -24 C${d - 3} -28 ${d + 3} -28 ${d + 3} -24 L${d + 3} -16 Z`, '#5a6a80', C.ink, 1)));
const orthoChurch = (x: number, base: number, s = 1, dome: string = GOLD, wall: string = LIME) => at(x, base, s, orthoChurchL(dome, wall));
/** A Swedish country church: white walls, grey roof, a tall spire (local base 0). */
const sweChurchL = (wall: string = WHITE) => all(
  rect(-34, -30, 44, 30, wall, 0.5, C.ink, 1.5), path('M-37 -30 L-12 -46 L13 -30 Z', SLATE, C.ink, 1.5),
  rect(10, -54, 18, 54, wall, 0.5, C.ink, 1.5), path('M8 -54 L19 -92 L30 -54 Z', BLACK, C.ink, 1.5), line('M19 -92 L19 -101 M15 -97 L23 -97', GOLD2, 1.6),
  path('M14 0 L14 -12 C14 -18 24 -18 24 -12 L24 0 Z', WOOD2, C.ink, 1.2), ...[-26, -12, 2].map((d) => path(`M${d - 3} -10 L${d - 3} -20 C${d - 3} -25 ${d + 3} -25 ${d + 3} -20 L${d + 3} -10 Z`, '#9fc3dc', C.ink, 0.9)), circle(19, -42, 4, WHITE, C.ink, 1));
const sweChurch = (x: number, base: number, s = 1, wall: string = WHITE) => at(x, base, s, sweChurchL(wall));
/** A domed basilica with a colonnade (St Peter's style, local base 0). */
const basilicaL = () => all(
  rect(-22, -40, 44, 40, LIME, 0.5, C.ink, 1.5), path('M-26 -40 L0 -52 L26 -40 Z', LIME, C.ink, 1.4), rect(-12, -66, 24, 14, LIME, 0.5, C.ink, 1.3),
  path('M-16 -66 C-16 -92 16 -92 16 -66 Z', '#a9c4cf', C.ink, 1.6), rect(-3, -97, 6, 9, LIME, 1, C.ink, 1), crossS(0, -102, 8, GOLD2, 1.3),
  ...[-16, -8, 0, 8, 16].map((d) => rect(d - 1.6, -34, 3.2, 34, WHITE, 0.5, C.ink, 0.9)));
const house = (x: number, base: number, s = 1, wall: string = '#e9d9b6', roof: string = ROOF) => at(x, base, s, path('M-13 -18 L0 -30 L13 -18 Z', roof, C.ink, 1.3), rect(-11, -18, 22, 18, wall, 0.5, C.ink, 1.3), rect(-3, -9, 6, 9, WOOD2, 0.5, null), rect(-8.5, -14, 4, 4, '#5a6a80', 0.5, null));
const hut = (x: number, base: number, s = 1) => at(x, base, s, path('M-14 -14 L0 -30 L14 -14 Z', '#c9a25a', C.ink, 1.3), rect(-11, -14, 22, 14, '#b98a52', 0.5, C.ink, 1.3), rect(-3, -9, 6, 9, WOOD2, 0.5, null));

// ── People ───────────────────────────────────────────────────────────
const fig = (x: number, top: string, mood: Mood = 'smile', more: Partial<Build> = {}) => F({ x, top, mood, ...more });
/** Draw in the local coordinates of the standing figure at x (head centre 0,−56; feet at 49). */
const on = (x: number, h: number, ...k: Svg[]) => { const s = 0.84 * h; return g(`translate(${x} ${f1(112 - 49 * s)}) scale(${s.toFixed(3)})`, ...k); };
const lift = (dy: number, ...k: Svg[]) => g(`translate(0 ${dy})`, ...k);
type Pose = 'down' | 'pray' | 'book' | 'up' | 'out' | 'staff' | 'chest';
type PO = { robe?: string; skin?: string; hair?: string | null; beard?: string; mood?: 'smile' | 'calm' | 'neutral' | 'open'; pose?: Pose; hat?: Svg; behind?: Svg; front?: Svg; collar?: boolean; stole?: string; belt?: string; grey?: boolean; bookCol?: string };
/** A person in a long robe (priests, monks, believers), local coordinates like `on`. */
const robeL = (o: PO = {}) => {
  const robe = o.robe ?? '#7a8ba0', skin = o.skin ?? C.skin, hair = o.hair === undefined ? C.hair : o.hair, pose = o.pose ?? 'down';
  const hand = (x: number, y: number) => circle(x, y, 3.6, skin, C.ink, 1.3);
  const sleeve = (d: string) => line(d, C.ink, 9) + line(d, robe, 7);
  const arms = pose === 'pray' ? all(sleeve('M-12 -38 L-9 -24 L-2 -27'), sleeve('M12 -38 L9 -24 L2 -27'), path('M-2.5 -36 L2.5 -36 L3 -25 L-3 -25 Z', skin, C.ink, 1.2))
    : pose === 'book' ? all(sleeve('M-12 -38 L-12 -22 L-6 -20'), sleeve('M12 -38 L12 -22 L6 -20'), rect(-11, -30, 22, 15, o.bookCol ?? BLACK, 1.5, C.ink, 1.3), crossS(0, -23, 7, GOLD, 1), hand(-8, -19), hand(8, -19))
    : pose === 'up' ? all(sleeve('M-12 -38 L-22 -56'), sleeve('M12 -38 L22 -56'), hand(-23, -58), hand(23, -58))
    : pose === 'out' ? all(sleeve('M-12 -38 L-26 -26'), sleeve('M12 -38 L26 -26'), hand(-28, -25), hand(28, -25))
    : pose === 'staff' ? all(lo('M24 -60 L24 47', WOOD, 2.4), sleeve('M-12 -38 L-17 -4'), sleeve('M12 -38 L22 -28'), hand(-17, -2), hand(24, -28))
    : pose === 'chest' ? all(sleeve('M-12 -38 L-16 -4'), sleeve('M12 -38 L8 -24 L1 -30'), hand(-16, -2), hand(0, -31))
    : all(sleeve('M-12 -38 L-17 -4'), sleeve('M12 -38 L17 -4'), hand(-17, -2), hand(17, -2));
  const face = o.mood === 'calm' ? path('M-5.5 -55 Q-3.6 -58 -1.8 -55 M1.8 -55 Q3.6 -58 5.5 -55', 'none', C.ink, 1.3) : all(circle(-3.4, -56, 1.2, C.ink, null), circle(3.4, -56, 1.2, C.ink, null));
  const mouth = o.mood === 'neutral' ? line('M-3 -50 L3 -50', C.ink, 1.3) : o.mood === 'open' ? ellipse(0, -50, 2.2, 2.4, '#c84a4a', C.ink, 1) : path('M-3 -51 Q0 -48.4 3 -51', 'none', C.ink, 1.3);
  const k = all(o.behind ?? '',
    path('M-13 -42 C-16 -20 -19 20 -20 46 L20 46 C19 20 16 -20 13 -42 Z', robe, C.ink, 2),
    o.stole ? all(path('M-6 -41 L-4 30 L-1 30 L-2 -41 Z M6 -41 L4 30 L1 30 L2 -41 Z', o.stole, C.ink, 0.9)) : '',
    o.belt ? line('M-14 -6 L14 -6', o.belt, 2.2) + line('M4 -6 L6 14', o.belt, 1.6) : '',
    ellipse(-8, 47, 6, 2.6, BLACK, null), ellipse(8, 47, 6, 2.6, BLACK, null), arms,
    rect(-3.5, -48, 7, 7, skin, 2, C.ink, 1.4), circle(0, -56, 10, skin, C.ink, 2),
    hair ? path('M-10 -58 C-10 -72 10 -72 10 -58 C6 -63 -6 -63 -10 -58 Z', hair, C.ink, 1.6) : '',
    o.beard ? path('M-9 -54 C-9 -38 9 -38 9 -54 C6 -49 -6 -49 -9 -54 Z', o.beard, C.ink, 1.3) : '', face, o.beard ? '' : mouth,
    o.collar ? rect(-3, -44, 6, 3, WHITE, 1, C.ink, 0.8) : '', o.hat ?? '', o.front ?? '');
  return o.grey ? greyed(k) : k;
};
const person = (x: number, h: number, o: PO = {}) => on(x, h, robeL(o));
// Headwear and attributes (local figure coordinates)
const mitre = (col: string = WHITE) => all(path('M-9 -63 L-10 -76 L-4 -84 L0 -79 L4 -84 L10 -76 L9 -63 Z', col, C.ink, 1.3), line('M0 -79 L0 -64 M-5 -71 L5 -71', GOLD2, 1.6));
const zucchetto = (col: string = RED) => path('M-9 -62 C-8 -70 8 -70 9 -62 Z', col, C.ink, 1.2);
const kamilavka = () => rect(-10, -78, 20, 14, BLACK, 1.5, C.ink, 1.2);
const kVeil = () => path('M-12 -72 L-15 -34 L15 -34 L12 -72 Z', BLACK, C.ink, 1.1);
const hood = (col: string = BROWN) => path('M-12 -50 C-14 -72 14 -72 12 -50 C10 -62 -10 -62 -12 -50 Z', col, C.ink, 1.4);
const veil = (col: string = BLACK) => all(path('M-12 -46 C-15 -74 15 -74 12 -46 L14 -36 L-14 -36 Z', col, C.ink, 1.4), path('M-9 -58 C-8 -66 8 -66 9 -58 Z', WHITE, null));
const halo = (col: string = GOLD) => circle(0, -58, 15, '#f6e6a8', col, 2);
const pendant = (col: string = GOLD) => all(path('M-6 -42 L0 -32 L6 -42', 'none', col, 1), crossS(0, -27, 9, col, 1.4));
/** A small believer seen from the side, kneeling (local base 0, facing right). */
const kneel = (x: number, base: number, s = 1, col: string = C.denim) => at(x, base, s, path('M-8 0 L-8 -6 L6 -6 L8 0 Z', C.navy, C.ink, 1.2), path('M-9 -6 C-10 -18 -6 -26 0 -26 C4 -26 6 -18 6 -12 L-2 -6 Z', col, C.ink, 1.3), circle(0, -32, 6, C.skin, C.ink, 1.3), path('M-6 -33 C-6 -40 6 -40 6 -33 C3 -36 -3 -36 -6 -33 Z', C.hair, null), line('M3 -20 L9 -24', C.skin, 3.4), circle(9.5, -24.5, 2.2, C.skin, C.ink, 0.9));
const pew = (x: number, w = 40) => all(rect(x, 96, w, 4, WOOD, 1, C.ink, 1.2), rect(x, 84, w, 4, WOOD, 1, C.ink, 1.2), line(`M${x + 3} 100 L${x + 3} 112 M${x + w - 3} 100 L${x + w - 3} 112 M${x + 3} 88 L${x + 3} 96 M${x + w - 3} 88 L${x + w - 3} 96`, WOOD2, 2));
const speech = (x: number, y: number, w: number, inner: Svg, tailLeft = true) => all(path(`M${x - w / 2} ${y - 12} L${x + w / 2} ${y - 12} L${x + w / 2} ${y + 10} L${tailLeft ? x - w / 2 + 12 : x + w / 2 - 6} ${y + 10} L${tailLeft ? x - w / 2 + 4 : x + w / 2 - 2} ${y + 17} L${tailLeft ? x - w / 2 + 6 : x + w / 2 - 12} ${y + 10} L${x - w / 2} ${y + 10} Z`, WHITE, C.ink, 1.5), inner);
const squig = (x: number, y: number, w: number, col: string = C.grey, sw = 1.4) => line(`M${x} ${y} ${Array.from({ length: Math.floor(w / 6) }, () => 'q1.5 -3 3 0 q1.5 3 3 0').join(' ')}`, col, sw);
const icon = (x: number, y: number, w = 22, h = 28, hl = false) => all(rect(x - w / 2, y - h / 2, w, h, WOOD2, 2, C.ink, 1.4), rect(x - w / 2 + 2.5, y - h / 2 + 2.5, w - 5, h - 5, GOLD, 1, null),
  circle(x, y - h * 0.12, w * 0.3, '#f6e6a8', GOLD2, 1), circle(x, y - h * 0.12, w * 0.18, C.skin2, C.ink, 0.9), path(`M${f1(x - w * 0.32)} ${f1(y + h / 2 - 3)} C${f1(x - w * 0.3)} ${f1(y + h * 0.05)} ${f1(x + w * 0.3)} ${f1(y + h * 0.05)} ${f1(x + w * 0.32)} ${f1(y + h / 2 - 3)} Z`, hl ? RED : '#7a2a3a', C.ink, 0.9),
  hl ? rect(x - w / 2 - 2, y - h / 2 - 2, w + 4, h + 4, 'none', 3, HL, 2.2) : '');

/** A thought cloud with small trailing bubbles towards the lower left. */
const thinkCloud = (x: number, y: number, inner: Svg) => all(ellipse(x, y, 18, 16, WHITE, C.ink, 1.5), circle(x - 16, y + 18, 3, WHITE, C.ink, 1.1), circle(x - 21, y + 24, 2, WHITE, C.ink, 1), inner);

// ── Motifs ───────────────────────────────────────────────────────────
export const CHRISTIANITY_MOTIFS: Record<string, Svg> = {
  // ── 2111 Bibeln och evangelierna ──
  'krist.kristen': all(rect(0, 0, 120, 120, '#eef3f6', 18, null), greyed(fig(22, C.grey, 'smile', { h: 0.7 })), fig(66, HLF, 'smile', { h: 0.9, bottom: C.denim }),
    on(66, 0.9, path('M-7 -42 L0 -28 L7 -42', 'none', GOLD, 1.2), crossS(0, -20, 14, GOLD, 2.2)), circle(66, 70, 13, 'none', HL, 2.2),
    thinkCloud(100, 26, all(church(98, 44, 0.42), crossS(108, 14, 9, GOLD, 1.6))), ground),
  'krist.bibel': all(rect(0, 0, 120, 120, '#f2ece0', 18, null), path('M28 20 L92 20 L96 100 L32 100 Z', '#efe6d2', C.ink, 1.6), path('M24 16 L88 16 L92 96 L28 96 Z', BLACK, C.ink, 2),
    path('M30 20 L86 20 L89.4 92 L33.4 92 Z', 'none', GOLD, 1.2), crossS(58, 52, 34, GOLD, 4), path('M70 96 L70 112 L74 108 L78 112 L78 96 Z', RED, C.ink, 1.2), line('M96 22 L98 100', '#d9cfbb', 1)),
  'krist.Gamla-testamentet': all(bibleBlock('old'), tablets(49, 18, 0.42, true), greyed(crossS(88, 22, 14, GOLD, 2))),
  'krist.Nya-testamentet': all(bibleBlock('new'), greyed(tablets(49, 18, 0.42)), crossS(88, 22, 16, HL, 2.6)),
  'krist.skapelseberättelse': all(...[0, 1, 2, 3, 4, 5].map((i) => { const x = 6 + (i % 3) * 37, y = 10 + Math.floor(i / 3) * 52; return all(rect(x, y, 34, 48, i === 0 ? '#fdf6d8' : i === 3 ? NIGHT : SKYC, 3, C.ink, 1.4), T(x + 6, y + 10, String(i + 1), 8, i === 3 ? WHITE : C.ink)); }),
    rays(23, 40, 6, 14, 10, GOLD, 0, Math.PI * 2), circle(23, 40, 5, C.yellow, C.ink, 1),
    path('M43 46 Q51 40 59 46 T75 46 L75 58 L43 58 Z', '#9fd0ea', C.ink, 1), cloud(59, 26, 0.55, WHITE),
    rect(80, 48, 34, 10, GRASS, 0, C.ink, 1), tree(92, 50, 0.55), tree(104, 50, 0.45, '#7bb46a'),
    circle(14, 74, 5, C.yellow, C.ink, 1), moon(30, 78, 5), star(24, 92, 3.5, C.yellow),
    path('M43 100 Q51 94 59 100 T75 100 L75 110 L43 110 Z', '#9fd0ea', C.ink, 1), fishFood(56, 104, 0.6), path('M50 72 q4 -4 8 0 q4 -4 8 0', 'none', C.ink, 1.4),
    rect(80, 100, 34, 10, GRASS, 0, C.ink, 1), at(93, 100, 0.32, robeL({ robe: HLF })), at(106, 100, 0.5, path('M-8 0 L-8 -6 C-8 -12 6 -12 8 -6 L8 0 Z M8 -8 C10 -14 14 -14 14 -10', '#c9a07a', C.ink, 1.3))),
  'krist.budord': all(rect(0, 0, 120, 120, '#eef3f6', 18, null), hill(10, 110, 72, '#b9ad93'), tablets(60, 52, 1.35, true), ground),
  'krist.evangelium': all(...[0, 1, 2, 3].map((i) => i === 2 ? '' : greyed(book(22 + i * 25, 76, 20, 50, BLACK, 'cross'))), book(72, 60, 22, 52, RED, 'cross'), ...[1, 2, 3, 4].map((n, i) => T(22 + i * 25, 108, String(n), 9, i === 2 ? HL : C.grey)), arrow(72, 28, 72, 18, HL, 2.2), ground),
  'krist.evangelist': all(rect(66, 74, 50, 6, WOOD, 2, C.ink, 1.4), line('M72 80 L72 112 M110 80 L110 112', WOOD2, 3), openBook(92, 66, 34, RED),
    person(44, 0.82, { robe: HLF, beard: '#8a8a8a', hair: '#8a8a8a', pose: 'down' }), lo('M60 62 L84 56', WHITE, 1.4), circle(58, 64, 3, C.skin, C.ink, 1), arm(54, 52, 58, 64), path('M84 56 L92 46', 'none', '#7a6a5a', 1.2), path('M86 54 C90 44 96 42 98 40 C96 46 92 52 86 56 Z', WHITE, C.ink, 1), ground),
  'krist.mirakel': all(rect(0, 0, 120, 120, '#f7f1e4', 18, null), basket(24, 92, 0.9), ...[16, 24, 32].map((x) => bread(x, 82, 0.6)), bread(20, 76, 0.6), bread(28, 76, 0.6), fishFood(20, 66, 0.6), fishFood(30, 66, 0.6),
    arrow(44, 80, 60, 80, HL, 2.6), ...[[78, 100], [104, 100], [78, 70], [104, 70], [91, 40]].map(([x, y]) => all(basket(x!, y!, 0.85), bread(x! - 6, y! - 8, 0.55), bread(x! + 6, y! - 8, 0.55), fishFood(x!, y! - 13, 0.5))), sparkle(66, 34, 6), sparkle(110, 22, 5), sparkle(60, 56, 4)),
  'krist.kors': all(rect(0, 0, 120, 120, '#eef3f6', 18, null), crossS(60, 58, 84, WOOD, 9), greyed(path('M10 112 L110 112', 'none', C.grey, 2))),
  'krist.korsfästa': all(rect(0, 0, 120, 120, '#e9d9c0', 18, null), circle(98, 30, 10, '#f3c16b', null), hill(4, 116, 50, '#b9a47a'), crossS(60, 52, 50, WOOD2, 5), crossS(28, 74, 32, '#8a6a4a', 3.4), crossS(92, 74, 32, '#8a6a4a', 3.4)),
  'krist.uppståndelse': all(rect(0, 0, 120, 120, '#fdf3dc', 18, null), rays(60, 70, 34, 52, 11, GOLD), path('M14 112 L14 70 C14 44 106 44 106 70 L106 112 Z', '#c9bca2', C.ink, 1.6),
    path('M42 112 L42 82 C42 64 66 64 66 82 L66 112 Z', '#fff4c8', C.ink, 1.4), rays(54, 92, 6, 18, 7, GOLD, -Math.PI, 0), circle(90, 96, 16, STONE, C.ink, 1.6), path('M80 92 C84 86 94 86 98 92', 'none', STONE2, 1.2), arrow(76, 108, 94, 108, HL, 2.2), ground),
  'krist.apostel': all(rect(0, 0, 120, 120, '#eef3f6', 18, null), path('M4 98 C40 92 70 104 116 96 L116 112 L4 112 Z', SAND, null), house(100, 98, 0.8), house(86, 100, 0.6), line('M4 104 C40 100 70 108 116 102', '#c9b080', 1.4, '4 3'),
    person(40, 0.78, { robe: HLF, beard: C.hair, pose: 'staff', front: lift(-4, rect(-20, -36, 9, 18, '#f2e2b8', 2, C.ink, 1)) }), arrow(62, 40, 84, 40, HL, 2.4), crossS(96, 70, 10, GOLD, 1.6), ground),
  // ── 2112 Fornkyrkan ──
  'krist.fornkyrka': all(rect(4, 10, 112, 102, '#efe3c8', 3, C.ink, 1.4), ...[12, 108].map((x) => all(rect(x - 4, 20, 8, 92, WHITE, 1, C.ink, 1.2), rect(x - 6, 16, 12, 5, WHITE, 1, C.ink, 1))), fish(60, 30, 1.3, '#6a5a8a'),
    rect(30, 84, 60, 5, WOOD, 2, C.ink, 1.3), line('M36 89 L36 112 M84 89 L84 112', WOOD2, 3), bread(52, 81, 0.6), bread(68, 81, 0.6),
    person(30, 0.52, { robe: HLF }), person(52, 0.5, { robe: '#c9a07a', beard: C.hair }), person(72, 0.52, { robe: HLF, hair: C.hair }), person(92, 0.5, { robe: '#c9a07a' }), ground),
  'krist.missionär': all(rect(0, 0, 120, 120, '#eef3f6', 18, null), path('M4 112 C40 100 80 104 116 96 L116 112 Z', SAND, null), hut(96, 104, 0.85), hut(110, 102, 0.6), tree(80, 104, 0.6, '#6aa85a'),
    person(36, 0.8, { robe: HLF, pose: 'book', front: lift(0, rect(14, -40, 10, 26, '#9a7a4a', 3, C.ink, 1.2)) }), arrow(58, 46, 80, 52, HL, 2.4), ground),
  'krist.hedning': all(greyed(church(102, 112, 0.6)), rect(18, 60, 26, 6, STONE, 1, C.ink, 1.3), rect(22, 66, 18, 46, STONE, 1, C.ink, 1.3), at(31, 60, 0.5, robeL({ robe: WHITE, skin: WHITE, hair: '#d8d0c0', beard: '#d8d0c0', pose: 'staff' })),
    rect(52, 96, 16, 16, STONE, 1, C.ink, 1.2), flame(60, 90, 0.6), person(80, 0.62, { robe: HLF, pose: 'up' }), ground),
  'krist.martyr': all(rect(0, 0, 120, 120, '#f6efe0', 18, null), person(60, 0.95, { robe: HLF, behind: halo(), pose: 'chest', mood: 'calm' }),
    lo('M86 92 C84 70 80 50 70 34', '#4f8a3a', 2), ...[0, 1, 2, 3, 4].map((i) => { const y = 42 + i * 10; return path(`M${80 - i * 1.5} ${y} q8 -4 14 -12 M${78 - i * 1.5} ${y + 2} q-8 -4 -10 -12`, 'none', '#5f9e48', 2.2); }), circle(86, 94, 3, C.skin, C.ink, 1), ground),
  'krist.katakomb': all(rect(0, 0, 120, 120, '#8a7a62', 18, null), path('M30 112 L30 40 C30 20 90 20 90 40 L90 112 Z', '#4a3a2e', null), path('M4 4 L30 40 L30 112 L4 112 Z M116 4 L90 40 L90 112 L116 112 Z', '#b8a584', C.ink, 1.4),
    ...[[8, 50], [8, 74], [8, 98], [104, 50], [104, 74], [104, 98]].map(([x, y]) => rect(x!, y!, 14, 9, '#5a4a3a', 2, C.ink, 1)), fish(17, 34, 0.7, '#3a2a1e'), rect(52, 96, 16, 16, '#3a2e24', 1, null),
    path('M54 66 C54 60 66 60 66 66 L64 70 L56 70 Z', '#c9a05a', C.ink, 1.1), flame(60, 60, 0.4), line('M60 50 L60 56', C.ink, 0.8), line('M30 112 L90 112', '#3a2e24', 2)),
  'krist.kyrkomöte': all(rect(4, 10, 112, 102, '#efe6d2', 3, null), rect(18, 84, 84, 6, '#c9a07a', 2, C.ink, 1.4), openBook(60, 78, 26, RED), line('M24 90 L24 112 M96 90 L96 112', WOOD2, 3),
    ...[16, 38, 82, 104].map((x) => person(x, 0.55, { robe: x < 60 ? HLF : '#e4a070', beard: '#9a9a9a', hat: mitre(), pose: 'down' })), person(60, 0.6, { robe: HLF, beard: '#9a9a9a', hat: mitre(GOLD), pose: 'out' }), ground),
  'krist.trosbekännelse': all(church(98, 112, 0.55), ...[14, 36, 58].map((x, i) => person(x, 0.55 + (i % 2) * 0.04, { robe: [HLF, '#e4a070', HLF][i]!, pose: 'book', mood: 'open', hair: C.hair })),
    speech(40, 22, 56, all(crossS(26, 22, 14, GOLD, 2), path('M38 26 L46 14 L54 26 Z', 'none', HL, 2), circle(60, 21, 4, C.yellow, C.ink, 1))), ground),
  'krist.treenighet': all(rect(0, 0, 120, 120, '#f6efe0', 18, null), path('M60 14 L104 92 L16 92 Z', 'none', GOLD, 4), ...[[60, 46], [44, 72], [76, 72]].map(([x, y]) => circle(x!, y!, 18, 'none', HL, 3.4)), circle(60, 64, 4, GOLD, C.ink, 1)),
  'krist.kyrkofader': all(rect(4, 10, 112, 102, '#efe6d2', 3, null), rect(56, 76, 58, 6, WOOD, 2, C.ink, 1.4), line('M62 82 L62 112 M108 82 L108 112', WOOD2, 3), openBook(80, 68, 30, RED), book(102, 64, 12, 18, BROWN, 'none'), book(104, 46, 12, 18, '#5a6a80', 'none'),
    person(36, 0.86, { robe: HLF, beard: '#e6e6e6', hair: '#d8d8d8', hat: mitre(), pose: 'down' }), path('M56 54 L68 60', 'none', C.ink, 1.2), circle(55, 54, 3, C.skin, C.ink, 1), arm(46, 44, 55, 54), ground),
  'krist.eremit': all(rect(0, 0, 120, 120, '#f6e6c4', 18, null), sun(98, 22, 7), path('M4 112 L4 60 C20 40 50 38 70 56 C80 64 82 80 82 112 Z', '#c9a87a', C.ink, 1.6), path('M24 112 L24 84 C24 70 50 70 50 84 L50 112 Z', '#5a4a3a', C.ink, 1.3), path('M82 112 C90 104 100 100 116 100 L116 112 Z', SAND, null),
    person(96, 0.66, { robe: '#a08060', beard: '#bdbdbd', hair: '#bdbdbd', pose: 'pray', mood: 'calm' }), ground),
  // ── 2113 Katolska kyrkan ──
  'krist.Vatikanen': all(rect(0, 0, 120, 120, '#e4eff6', 18, null), at(60, 100, 1, basilicaL()), ...[0, 1, 2, 3, 4, 5].map((i) => rect(6 + i * 6, 82, 3, 18, WHITE, 0.5, C.ink, 0.8)), ...[0, 1, 2, 3, 4, 5].map((i) => rect(81 + i * 6, 82, 3, 18, WHITE, 0.5, C.ink, 0.8)), rect(4, 79, 36, 4, LIME, 0.5, C.ink, 1), rect(80, 79, 36, 4, LIME, 0.5, C.ink, 1),
    line('M106 20 L106 50', C.ink, 1.4), rect(106, 20, 8, 10, C.yellow, 0, C.ink, 1), rect(114, 20, 0.1, 10, WHITE, 0, null), rect(110, 20, 4, 10, WHITE, 0, C.ink, 1), path('M4 100 L116 100 L116 112 L4 112 Z', '#e0d6c0', null), ground),
  'krist.kardinal': all(greyed(person(24, 0.66, { robe: BLACK, collar: true, pose: 'down' })), person(66, 0.92, { robe: RED, hat: zucchetto(), pose: 'chest', front: all(line('M-13 -8 L13 -8', '#9a1a1a', 4), pendant()) }), greyed(person(104, 0.66, { robe: BLACK, collar: true, pose: 'down' })), ground),
  'krist.ärkebiskop': all(greyed(person(18, 0.6, { robe: WHITE, hat: mitre(), pose: 'down' })), greyed(person(102, 0.6, { robe: WHITE, hat: mitre(), pose: 'down' })), person(60, 0.9, { robe: HLF, hat: mitre(GOLD), stole: WHITE, pose: 'staff', front: pendant() }), ground),
  'krist.nattvard': all(rect(14, 78, 92, 34, WHITE, 2, C.ink, 1.6), rect(14, 78, 92, 8, GOLD, 1, C.ink, 1.2), crossS(60, 98, 14, GOLD, 2), chalice(44, 62, 1.25), ellipse(80, 74, 14, 4, GOLD, C.ink, 1.2), wafer(76, 66, 6), wafer(86, 68, 5), bread(80, 60, 0.7), candle(20, 78, 1.2), candle(100, 78, 1.2), ground),
  'krist.oblat': all(rect(0, 0, 120, 120, '#f6efe0', 18, null), greyed(chalice(60, 92, 1.1)), wafer(60, 44, 22), rays(60, 44, 26, 36, 12, GOLD, 0, Math.PI * 2)),
  'krist.sakrament': all(rect(0, 0, 120, 120, '#f6efe0', 18, null), ...[0, 1, 2, 3, 4, 5, 6].map((i) => { const a = Math.PI + (i * Math.PI) / 6, x = 60 + Math.cos(a) * 44, y = 84 + Math.sin(a) * 52; return circle(+f1(x), +f1(y), 11, i === 0 || i === 3 ? HLF : '#efe3c8', C.ink, 1.4); }),
    ...[[29, 50], [91, 50], [104, 84], [82, 33]].map(([x, y]) => greyed(crossS(x!, y!, 10, C.grey, 1.4))), shell(16, 84, 0.7), chalice(60, 33, 0.6), ring(34 - 1, 41, 4), ring(37, 43, 4), T(60, 104, '7', 26, HL)),
  'krist.bikt': all(rect(0, 0, 120, 120, '#efe6d2', 18, null), path('M20 112 L20 24 L100 24 L100 112 Z', WOOD, C.ink, 1.6), path('M16 24 L60 8 L104 24 Z', WOOD2, C.ink, 1.6), rect(56, 24, 8, 88, WOOD2, 0, C.ink, 1.2),
    rect(26, 36, 26, 76, '#5a3a20', 1, C.ink, 1), rect(68, 36, 26, 76, '#5a3a20', 1, C.ink, 1), rect(54, 54, 12, 16, '#e8d8b0', 1, C.ink, 1), ...[57, 60, 63].map((x) => line(`M${x} 54 L${x} 70`, WOOD2, 1)),
    lift(-2, at(42, 110, 0.9, kneel(0, 0, 1, HLF))), at(80, 110, 0.5, robeL({ robe: BLACK, collar: true, mood: 'calm' }))),
  'krist.vigvatten': all(rect(0, 0, 120, 120, '#efe6d2', 18, null), path('M4 112 L4 20 L40 20 L40 112 Z', STONE, C.ink, 1.4), path('M30 112 L30 30 C30 14 46 14 46 30 L46 112', 'none', C.ink, 1.4),
    rect(68, 70, 8, 42, STONE, 1, C.ink, 1.4), path('M50 56 L94 56 C94 70 84 76 72 76 C60 76 50 70 50 56 Z', STONE, C.ink, 1.6), ellipse(72, 57, 20, 4, '#9fd0ea', C.ink, 1.2), ...[[66, 60], [78, 62]].map(([x, y]) => circle(x!, y!, 1.2, '#4d8fc0', null)),
    g('translate(84 40) rotate(150) scale(1.1)', ...[-4.6, -1.6, 1.4, 4.4].map((d, i) => rect(d - 1.3, -9 + Math.abs(i - 1.5) * 1.2, 2.6, 9 + (i === 1 || i === 2 ? 4 : 0), C.skin, 1.3, C.ink, 0.9)), path('M-5.5 -1 L5.5 -1 L5 5 C4 8 -4 8 -5 5 Z', C.skin, C.ink, 1)), line('M92 30 L110 16', C.skin, 6), line('M92 30 L110 16', C.ink, 0.6)),
  'krist.rosenkrans': all(rect(0, 0, 120, 120, '#f6efe0', 18, null), ...Array.from({ length: 22 }, (_, i) => { const a = -Math.PI / 2 + 0.5 + (i * (Math.PI * 2 - 1)) / 21; return circle(+f1(60 + Math.cos(a) * 34), +f1(46 + Math.sin(a) * 30), i % 6 === 0 ? 4 : 3, i % 6 === 0 ? GOLD : '#8a3a5a', C.ink, 0.9); }),
    line('M60 76 L60 88', C.ink, 1.2), circle(60, 81, 3, GOLD, C.ink, 0.9), crossS(60, 98, 16, GOLD, 2.4), palm(30, 82, 1.1, -20)),
  'krist.orden': all(greyed(sweChurch(94, 112, 0.5, STONE)), ...[18, 46, 74].map((x) => person(x, 0.7, { robe: BROWN, hat: hood(), hair: null, belt: WHITE, pose: 'pray', mood: 'calm' })), rect(2, 40, 90, 74, 'none', 6, HL, 2), ground),
  'krist.celibat': all(person(34, 0.86, { robe: BLACK, collar: true, pose: 'book', mood: 'calm' }), greyed(fig(84, C.grey, 'smile', { h: 0.5 }), fig(104, C.grey, 'smile', { h: 0.47, hairStyle: 'long' })), ring(90, 28, 7), ring(100, 28, 7), noSign(95, 28, 15), ground),
  // ── 2114 Ortodox kristendom ──
  'krist.ortodox': all(rect(0, 0, 120, 120, '#eef3f6', 18, null), greyed(orthoChurch(86, 112, 0.7, '#9fb0c8')), orthoCross(36, 54, 76, GOLD, 5), ground),
  'krist.bysantinsk': all(rect(0, 0, 120, 120, '#f6e6c4', 18, null), rect(14, 74, 92, 38, '#e6c9a0', 0.5, C.ink, 1.6), path('M30 74 C30 46 90 46 90 74 Z', GOLD, C.ink, 1.8), rect(46, 40, 28, 8, '#e6c9a0', 1, C.ink, 1.2), path('M42 74 C42 50 78 50 78 74', 'none', GOLD2, 1),
    path('M14 74 C14 62 34 62 34 74 Z M86 74 C86 62 106 62 106 74 Z', GOLD, C.ink, 1.4), ...[28, 46, 64, 82].map((x) => path(`M${x} 100 L${x} 88 C${x} 82 ${x + 10} 82 ${x + 10} 88 L${x + 10} 100 Z`, '#5a6a80', C.ink, 1)), crossS(60, 32, 12, GOLD2, 1.6), ground),
  'krist.östkyrka': all(rect(0, 0, 120, 120, '#eef3f6', 18, null), line('M60 14 L60 112', C.grey, 1.6, '4 4'), greyed(church(28, 112, 0.66)), orthoChurch(92, 112, 0.7), sun(104, 24, 6), rect(62, 42, 54, 72, 'none', 6, HL, 2.2), ground),
  'krist.västkyrka': all(rect(0, 0, 120, 120, '#eef3f6', 18, null), line('M60 14 L60 112', C.grey, 1.6, '4 4'), church(30, 112, 0.66, HLF), greyed(orthoChurch(92, 112, 0.7)), path('M6 30 C6 20 22 20 22 30 Z', C.orange, C.ink, 1.2), line('M2 30 L26 30', C.ink, 1.2), rect(4, 42, 54, 72, 'none', 6, HL, 2.2), ground),
  'krist.schism': all(rect(0, 0, 120, 120, '#eef3f6', 18, null), g('translate(-14 0)', church(44, 100, 0.8, LIME)), g('translate(16 0)', orthoChurch(76, 100, 0.66)), path('M60 10 L56 30 L64 46 L56 62 L62 80 L58 100', 'none', HL, 3), arrow(30, 20, 14, 20, HL, 2.4), arrow(90, 20, 106, 20, HL, 2.4), T(60, 112, '1054', 11, C.ink), line('M4 100 L116 100', C.grey2, 2)),
  'krist.patriark': all(rect(0, 0, 120, 120, '#f6efe0', 18, null), person(56, 0.96, { robe: BLACK, beard: '#e6e6e6', hair: null, hat: kamilavka(), behind: kVeil(), pose: 'staff', front: all(circle(0, -26, 5, GOLD, C.ink, 1.2), circle(0, -26, 2.5, BLUE, null), path('M-6 -42 L0 -31 L6 -42', 'none', GOLD, 1.2)) }), orthoCross(92, 22, 16, GOLD2, 1.6), ground),
  'krist.lökkupol': all(rect(0, 0, 120, 120, '#e4eff6', 18, null), greyed(at(24, 112, 1, rect(-8, -50, 16, 50, LIME, 0.5, C.ink, 1.4), path('M-10 -50 L0 -82 L10 -50 Z', SLATE, C.ink, 1.4))), at(76, 112, 1, rect(-14, -46, 28, 46, LIME, 0.5, C.ink, 1.6), rect(-10, -56, 20, 10, LIME, 0.5, C.ink, 1.3), g('translate(0 -56)', onionL(28, GOLD))), ground),
  'krist.ikon': all(rect(0, 0, 120, 120, '#efe6d2', 18, null), icon(60, 50, 56, 72, false), candle(36, 112, 1.4), candle(84, 112, 1.4), rect(24, 106, 72, 6, GOLD2, 1, C.ink, 1)),
  'krist.ikonostas': all(rect(4, 6, 112, 106, GOLD2, 3, C.ink, 1.6), ...[0, 1, 2, 3, 4].map((i) => icon(17 + i * 21.5, 22, 17, 22)), ...[0, 1, 2, 3, 4].map((i) => i === 2 ? '' : icon(17 + i * 21.5, 50, 17, 22)),
    path('M48 112 L48 74 C48 62 72 62 72 74 L72 112 Z', GOLD, C.ink, 1.6), line('M60 66 L60 112', GOLD2, 1.4), path('M10 112 L10 80 C10 72 24 72 24 80 L24 112 Z M96 112 L96 80 C96 72 110 72 110 80 L110 112 Z', '#c9a05a', C.ink, 1.4), icon(36, 88, 14, 20), icon(84, 88, 14, 20), orthoCross(60, 48, 16, '#8a1a2a', 1.6)),
  'krist.korstecken': all(rect(0, 0, 120, 120, '#f6efe0', 18, null), person(56, 1.05, { robe: '#7a8ba0', hair: C.hair, pose: 'chest', mood: 'calm' }),
    line(`M56 ${f1(112 - 105 * 0.882 + 6)} L56 ${f1(112 - 30 * 0.882 * 1.05)}`, HL, 2.2, '3 3'), arrow(56, 32, 56, 50, HL, 2), arrow(70, 56, 42, 56, HL, 2), ground),
  'krist.liturgi': all(rect(4, 6, 112, 106, '#efe3c8', 3, null), rect(70, 10, 46, 70, GOLD2, 1, C.ink, 1.2), ...[0, 1].map((i) => icon(82 + i * 22, 30, 16, 20)), person(92, 0.7, { robe: GOLD, beard: C.hair, hat: kamilavka(), behind: kVeil(), pose: 'up' }),
    ...[16, 34, 52].map((x) => person(x, 0.5, { robe: '#5a6a80', pose: 'book', mood: 'open' })), notes(28, 30, 0.8), notes(50, 22, 0.7), ground),
  // ── 2115 Protestantisk reformation ──
  'krist.nåd': all(rect(0, 0, 120, 120, '#fdf6e4', 18, null), rays(60, 0, 14, 40, 9, GOLD, 0.2, Math.PI - 0.2), rect(48, 40, 24, 20, HLF, 2, C.ink, 1.6), line('M60 40 L60 60 M48 50 L72 50', RED, 2.4), path('M52 40 C48 32 58 34 60 40 C62 34 72 32 68 40', 'none', RED, 2),
    palm(46, 76, 1.5, 30), palm(74, 76, 1.5, -30), greyed(coin(18, 98, 7), coin(30, 102, 7)), noSign(24, 100, 14), ground),
  'krist.frälsning': all(rect(0, 0, 120, 120, NIGHT, 18, null), path('M120 0 L120 120 L40 120 C60 80 80 30 120 0 Z', '#fdf3d0', null), rays(118, 4, 16, 50, 7, GOLD, Math.PI * 0.5, Math.PI), person(66, 0.72, { robe: HLF, pose: 'up', mood: 'smile' }), arrow(22, 96, 44, 80, HL, 2.4), line('M4 112 L116 112', C.grey2, 2)),
  'krist.protestantisk': all(rect(0, 0, 120, 120, '#f6efe0', 18, null), greyed(at(60, 44, 0.62, basilicaL())), greyed(at(60, -20, 0.62, path('M-10 10 L-10 -6 C-10 -16 10 -16 10 -6 L10 10 Z', GOLD, C.ink, 1.3), line('M-10 2 L10 2 M-10 -5 L10 -5', C.ink, 1))),
    line('M60 48 L60 56 M20 56 L100 56', HL, 2.4), arrow(20, 56, 20, 66, HL, 2.4), arrow(60, 56, 60, 66, HL, 2.4), arrow(100, 56, 100, 66, HL, 2.4), T(88, 52, '1517', 9, HL),
    church(26, 112, 0.5, HLF, SLATE), at(60, 112, 0.5, sweChurchL(HLF)), church(102, 112, 0.5, HLF, ROOF), rect(4, 62, 112, 52, 'none', 6, HL, 2), ground),
  'krist.bibelöversättning': all(rect(0, 0, 120, 120, '#f6efe0', 18, null), greyed(openBook(28, 54, 40, BROWN, false), ...[0, 1, 2, 3].map((i) => line(`M12 ${46 + i * 5} L26 ${46 + i * 5}`, BLACK, 2.6)), ...[0, 1, 2, 3].map((i) => line(`M31 ${46 + i * 5} L45 ${46 + i * 5}`, BLACK, 2.6))),
    arrow(50, 54, 66, 54, HL, 2.6), openBook(92, 54, 40, BLACK, false), ...[0, 1, 2, 3].flatMap((i) => [squig(76, 46 + i * 5, 12, HL, 1.4), squig(95, 46 + i * 5, 12, HL, 1.4)]), ...[18, 40, 62, 84, 102].map((x, i) => fig(x, [HLF, '#e4a070', HLF, '#e4a070', HLF][i]!, 'smile', { h: 0.3 })), ground),
  'krist.reformert': all(rect(4, 6, 112, 106, WHITE, 3, C.ink, 1.4), path('M20 6 L20 112 M100 6 L100 112', 'none', '#e0e0dc', 1.4), rect(50, 50, 20, 18, WOOD, 2, C.ink, 1.6), path('M54 68 L66 68 L63 112 L57 112 Z', WOOD2, C.ink, 1.4), openBook(60, 46, 20, BLACK, false),
    lift(-46, person(60, 0.42, { robe: BLACK, collar: true, mood: 'open', pose: 'out' })), pew(12, 30), pew(78, 30), greyed(at(104, 30, 0.7, icon(0, 0, 18, 24)), at(16, 30, 0.7, icon(0, 0, 18, 24))), noSign(104, 30, 12), noSign(16, 30, 12)),
  'krist.anglikansk': all(rect(0, 0, 120, 120, '#e4eff6', 18, null), at(56, 112, 1, rect(-30, -40, 44, 40, '#d9cfbb', 0.5, C.ink, 1.5), path('M-33 -40 L-8 -56 L17 -40 Z', SLATE, C.ink, 1.5), rect(14, -74, 20, 74, '#d9cfbb', 0.5, C.ink, 1.5), ...[16, 22, 28].map((d) => rect(d - 2, -80, 4, 6, '#d9cfbb', 0.5, C.ink, 1)), path('M20 -50 C20 -58 28 -58 28 -50 L28 -40 L20 -40 Z', '#5a6a80', C.ink, 1)),
    path('M14 18 L20 34 L30 22 L40 34 L46 18 L46 38 L14 38 Z', GOLD, C.ink, 1.4), ...[20, 30, 40].map((x) => circle(x, 22 - (x === 30 ? 2 : 0) + 0, 2, RED, null)),
    line('M98 30 L98 72', C.ink, 1.4), rect(98, 30, 18, 12, WHITE, 0, C.ink, 1), rect(98, 34.5, 18, 3, RED, 0, null), rect(105.5, 30, 3, 12, RED, 0, null), ground),
  'krist.motreformation': all(rect(0, 0, 120, 120, '#f6efe0', 18, null), greyed(church(24, 112, 0.6)),
    at(84, 112, 0.82, rect(-30, -50, 60, 50, HLF, 0.5, C.ink, 1.6), path('M-34 -50 L0 -66 L34 -50 Z', HLF, C.ink, 1.4), rect(-12, -76, 24, 10, HLF, 1, C.ink, 1.2), path('M-14 -76 C-14 -98 14 -98 14 -76 Z', GOLD, C.ink, 1.6), crossS(0, -104, 10, GOLD2, 1.4),
      ...[-24, -12, 12, 24].map((d) => rect(d - 2, -46, 4, 46, WHITE, 0.5, C.ink, 0.9)), path('M-6 0 L-6 -18 C-6 -26 6 -26 6 -18 L6 0 Z', WOOD2, C.ink, 1.2)), T(84, 18, '1545', 9, HL),
    ...[24, 38].map((x, i) => fig(x, i ? C.denim : '#c96b3c', 'smile', { h: 0.4 })), arrow(16, 104, 46, 104, HL, 2.6),
    person(54, 0.5, { robe: BLACK, pose: 'out', front: pendant(WOOD) }), ground),
  'krist.jesuit': all(rect(4, 10, 112, 102, '#efe6d2', 3, null), rect(10, 18, 34, 24, '#3d5a4a', 2, C.ink, 1.4), crossS(96, 30, 14, WOOD, 2), person(26, 0.86, { robe: BLACK, collar: false, pose: 'book', front: pendant(WOOD) }),
    ...[64, 92].map((x) => all(rect(x - 12, 84, 24, 4, WOOD, 1, C.ink, 1.2), line(`M${x - 9} 88 L${x - 9} 112 M${x + 9} 88 L${x + 9} 112`, WOOD2, 2), fig(x, x < 80 ? '#c96b3c' : C.denim, 'smile', { h: 0.4 }))), ground),
  'krist.religionsfred': all(rect(0, 0, 120, 120, '#f6efe0', 18, null), church(22, 112, 0.6, HLF), church(98, 112, 0.6, '#e4a070'), rect(38, 20, 44, 52, WHITE, 2, C.ink, 1.6), ...[30, 38, 46].map((y) => line(`M44 ${y} L76 ${y}`, C.grey, 1.4)), circle(66, 60, 6, RED, C.ink, 1.2),
    at(60, 92, 1, path('M-24 0 L-8 -4 L0 -10 L8 -4 L24 0 L8 4 L0 8 L-8 4 Z', C.skin, C.ink, 1.4), line('M-24 -2 L-30 -2 M24 -2 L30 -2', C.navy, 6)), ground),
  // ── 2116 Svenska kyrkans historia ──
  'krist.Svenska-kyrkan': all(rect(0, 0, 120, 120, '#e4eff6', 18, null), hill(4, 116, 92, GRASS), sweChurch(60, 108, 1), line('M100 40 L100 100', C.ink, 1.4), rect(100, 40, 16, 10, BLUE, 0, C.ink, 1), rect(104, 40, 3, 10, C.yellow, 0, null), rect(100, 43.5, 16, 3, C.yellow, 0, null), ground),
  'krist.kristnande': all(rect(0, 0, 120, 120, '#eef3f6', 18, null), greyed(at(24, 112, 1, path('M-12 0 L-14 -40 C-12 -54 12 -54 14 -40 L12 0 Z', STONE, C.ink, 1.4), path('M-6 -40 C-2 -34 2 -46 6 -38 M-6 -30 C-2 -24 2 -36 6 -28', 'none', RED, 1.4))),
    arrow(44, 70, 62, 70, HL, 2.6), church(92, 112, 0.9, HLF), ...[70, 112].map((x) => fig(x, C.denim, 'smile', { h: 0.36 })), ground),
  'krist.socken': all(rect(0, 0, 120, 120, '#e6f0d8', 18, null), path('M14 30 C30 8 90 8 104 26 C118 46 112 92 92 104 C70 116 30 112 16 96 C4 80 2 48 14 30 Z', '#f6efd8', HL, 2.4), church(58, 70, 0.6, WHITE, SLATE), ...[[32, 44], [86, 40], [34, 92], [88, 92], [62, 104]].map(([x, y]) => house(x!, y!, 0.55)), tree(100, 64, 0.45), tree(20, 66, 0.45)),
  'krist.kyrkoherde': all(greyed(sweChurch(88, 112, 0.66)), greyed(person(104, 0.46, { robe: BLACK, collar: true }), person(80, 0.44, { robe: '#5a6a80', hair: C.hair })), person(40, 0.92, { robe: BLACK, collar: true, stole: GOLD, pose: 'book', front: pendant() }), ground),
  'krist.katekes': all(rect(0, 0, 120, 120, '#f6efe0', 18, null), openBook(60, 54, 80, BROWN, false), ...[0, 1, 2].flatMap((i) => [T(30, 42 + i * 13, '?', 11, HL), line(`M37 ${38 + i * 13} L54 ${38 + i * 13}`, C.grey, 1.4), line(`M66 ${38 + i * 13} L94 ${38 + i * 13}`, C.green, 1.8)]), crossS(60, 16, 12, GOLD2, 1.6), fig(30, '#c96b3c', 'smile', { h: 0.34 }), fig(90, C.denim, 'smile', { h: 0.34, hairStyle: 'long' }), ground),
  'krist.husförhör': all(rect(4, 10, 112, 102, '#e9d9b6', 3, C.ink, 1.2), ...[24, 40, 56].map((y) => line(`M4 ${y} L116 ${y}`, '#c9b080', 1)), rect(12, 78, 46, 5, WOOD, 2, C.ink, 1.3), line('M16 83 L16 112 M54 83 L54 112', WOOD2, 3), openBook(26, 74, 18, BROWN, true),
    person(42, 0.72, { robe: BLACK, collar: true, pose: 'down' }), fig(74, '#c96b3c', 'smile', { h: 0.42 }), at(74, 78, 0.6, book(0, 0, 16, 12, BROWN, 'none')), greyed(fig(92, C.grey, 'smile', { h: 0.6, hairStyle: 'long' }), fig(108, C.grey, 'smile', { h: 0.64 })), ground),
  'krist.psalmbok': all(rect(0, 0, 120, 120, '#f2ece0', 18, null), path('M26 22 L86 22 L90 104 L30 104 Z', '#efe6d2', C.ink, 1.6), path('M22 18 L82 18 L86 100 L26 100 Z', BLACK, C.ink, 2), notes(54, 58, 1.6, GOLD), crossS(54, 30, 12, GOLD, 1.8), notes(98, 30, 0.9, HL), notes(104, 58, 0.7, HL)),
  'krist.konfirmation': all(rect(4, 10, 112, 102, '#efe6d2', 3, null), crossS(60, 24, 18, GOLD, 2.4), person(60, 0.68, { robe: BLACK, collar: true, stole: GOLD, pose: 'out' }),
    ...[16, 34, 86, 104].map((x, i) => person(x, 0.54, { robe: WHITE, hair: C.hair, pose: 'pray', mood: 'calm', front: pendant(WOOD), belt: i % 2 ? undefined : undefined })), ground),
  'krist.väckelserörelse': all(rect(0, 0, 120, 120, '#e4eff6', 18, null), at(54, 112, 1, rect(-40, -44, 80, 44, '#c8553d', 0.5, C.ink, 1.6), path('M-44 -44 L0 -70 L44 -44 Z', SLATE, C.ink, 1.6), rect(-34, -36, 68, 30, '#fdf3d0', 1, C.ink, 1.2)),
    ...[30, 46, 62, 78].map((x, i) => lift(-6, on(x, 0.36, robeL({ robe: [HLF, '#e4a070', HLF, '#e4a070'][i]!, pose: i % 2 ? 'book' : 'pray' })))), fig(108, C.denim, 'smile', { h: 0.44 }), arrow(102, 96, 92, 96, HL, 2), ground),
  'krist.frikyrka': all(rect(0, 0, 120, 120, '#e4eff6', 18, null), at(50, 112, 1, rect(-38, -40, 76, 40, '#f2ece0', 0.5, C.ink, 1.6), path('M-42 -40 L-42 -46 L42 -46 L42 -40 Z', SLATE, C.ink, 1.4), rect(-26, -32, 52, 16, '#9fc3dc', 1, C.ink, 1.2), rect(-6, -14, 12, 14, WOOD2, 1, C.ink, 1.2), crossS(28, -58, 18, WOOD, 2.4)),
    greyed(at(100, 112, 0.8, sweChurchL())), notes(20, 30, 0.9, HL), notes(80, 22, 0.8, HL), ground),
  'krist.kyrkoavgift': all(rect(0, 0, 120, 120, '#f6efe0', 18, null), rect(8, 18, 48, 62, WHITE, 2, C.ink, 1.6), ...[30, 40, 50].map((y) => line(`M14 ${y} L50 ${y}`, C.grey, 1.4)), line('M14 62 L50 62', HL, 2.4), T(32, 74, '1%', 10, HL),
    arrow(60, 50, 74, 50, HL, 2.6), sweChurch(94, 112, 0.66), coin(86, 40, 6), coin(98, 34, 6), ground),
  // ── 2117 Kristna högtider ──
  'krist.advent': all(rect(4, 6, 112, 106, NIGHT, 3, C.ink, 1.4), rect(10, 14, 100, 60, '#3a4a6a', 2, C.ink, 1.2), line('M60 14 L60 74 M10 44 L110 44', WOOD, 3), star(60, 30, 13, C.yellow), line('M60 4 L60 17', C.ink, 1),
    rect(10, 76, 100, 30, WOOD, 2, C.ink, 1.4), ...[0, 1, 2, 3].map((i) => candle(24 + i * 24, 92, 1.1, i === 0)), rect(14, 92, 92, 6, '#2f6a3a', 2, C.ink, 1.2), ...[0, 1, 2, 3].map((i) => T(24 + i * 24, 104, String(i + 1), 7, i === 0 ? C.yellow : '#9aa3ad'))),
  'krist.kyrkoår': all(rect(0, 0, 120, 120, '#f6efe0', 18, null), ...[[PURPLE, 0], [WHITE, 1], [GREEN_OR(), 2], [PURPLE, 3], [WHITE, 4], [RED, 5]].map(([col, i]) => { const a0 = -Math.PI / 2 + (Number(i) * Math.PI) / 3, a1 = a0 + Math.PI / 3; return path(`M60 60 L${f1(60 + Math.cos(a0) * 44)} ${f1(60 + Math.sin(a0) * 44)} A44 44 0 0 1 ${f1(60 + Math.cos(a1) * 44)} ${f1(60 + Math.sin(a1) * 44)} Z`, String(col), C.ink, 1.3); }),
    candle(78, 34, 0.7), star(88, 62, 6, C.yellow), crossS(60, 90, 12, GOLD, 1.8), flame(30, 70, 0.6), circle(60, 60, 10, WHITE, C.ink, 1.3), arrow(110, 24, 112, 34, HL, 2.2), path('M96 12 C106 18 112 26 112 34', 'none', HL, 2.4)),
  'krist.julkrubba': all(rect(0, 0, 120, 120, NIGHT, 18, null), star(60, 16, 8, C.yellow), rays(60, 16, 10, 18, 8, '#f6e08a', 0, Math.PI * 2), path('M14 112 L14 54 L60 28 L106 54 L106 112 Z', WOOD, C.ink, 1.6), path('M20 112 L20 58 L100 58 L100 112 Z', '#5a3a20', C.ink, 1.2),
    path('M48 104 L72 104 L68 94 L52 94 Z', '#c99a5a', C.ink, 1.2), line('M52 94 L68 94', '#e8c860', 3), ellipse(60, 90, 6, 4, WHITE, C.ink, 1), circle(60, 87, 3, C.skin, C.ink, 0.9),
    lift(-2, on(34, 0.42, robeL({ robe: BLUE, hat: veil(BLUE), hair: null, pose: 'pray', mood: 'calm' }))), lift(-2, on(86, 0.46, robeL({ robe: BROWN, beard: C.hair, pose: 'staff' }))), line('M4 112 L116 112', C.grey2, 2)),
  'krist.julotta': all(rect(0, 0, 120, 120, NIGHT, 18, null), ...[[14, 14], [40, 8], [100, 12], [76, 20]].map(([x, y]) => star(x!, y!, 2.4, '#f6e08a')), path('M4 96 C40 90 80 92 116 88 L116 112 L4 112 Z', WHITE, null),
    at(78, 96, 0.9, sweChurchL(WHITE)), ...[[52, 84], [66, 84], [80, 84], [87, 66]].map(([x, y]) => rect(x! - 2.5, y! - 4, 5, 8, '#f6d36a', 1, null)),
    ...[18, 34].map((x) => lift(-14, on(x, 0.42, robeL({ robe: x < 30 ? '#5a3a2a' : '#3a4a6a', hair: C.hair, pose: 'out' })))), ...[6, 46].map((x) => flame(x, 64, 0.4)), line('M4 112 L116 112', C.grey2, 2)),
  'krist.trettondedag-jul': all(rect(0, 0, 120, 120, NIGHT, 18, null), star(60, 18, 10, C.yellow), rays(60, 18, 12, 22, 8, '#f6e08a', 0, Math.PI * 2), cal(98, 32, '6', BLUE, 26, 28),
    ...[24, 52, 80].map((x, i) => on(x, 0.62, robeL({ robe: [RED, PURPLE, '#2f7a5a'][i]!, beard: i === 1 ? '#c9c9c9' : C.hair, skin: i === 2 ? C.skin2 : C.skin, pose: 'chest', hat: path('M-9 -64 L-9 -72 L-5 -68 L0 -74 L5 -68 L9 -72 L9 -64 Z', GOLD, C.ink, 1.1) }))), line('M4 112 L116 112', C.grey2, 2)),
  'krist.fettisdag': all(rect(0, 0, 120, 120, '#f6efe0', 18, null), ellipse(52, 96, 40, 9, WHITE, C.ink, 1.6), path('M20 92 C18 72 86 72 84 92 Z', '#d8a058', C.ink, 1.6), path('M24 80 C30 66 76 66 80 80 C70 84 34 84 24 80 Z', WHITE, C.ink, 1.4),
    path('M28 72 C34 54 70 54 76 72 C66 70 38 70 28 72 Z', '#d8a058', C.ink, 1.6), ...[[40, 64], [52, 60], [64, 64]].map(([x, y]) => circle(x!, y!, 1.3, WHITE, null)), cal(98, 30, '2', HL, 26, 28)),
  'krist.palmsöndag': all(rect(0, 0, 120, 120, '#f6e6c4', 18, null), path('M4 112 L4 100 L116 100 L116 112 Z', SAND, null), ...[[28, 106, -10], [64, 108, 8], [96, 106, -4]].map(([x, y, r]) => g(`translate(${x} ${y}) rotate(${r})`, line('M-16 0 L16 0', '#4f8a3a', 1.6), ...[-12, -6, 0, 6, 12].map((d) => path(`M${d} 0 l-3 -5 M${d} 0 l-3 5`, 'none', '#5f9e48', 2)))),
    ...[20, 50, 80, 104].map((x, i) => all(person(x, 0.6, { robe: [HLF, '#e4a070', HLF, '#e4a070'][i]!, hair: C.hair, pose: 'up', mood: 'open' }), g(`translate(${x + 13} ${f1(112 - 105 * 0.504 - 4)})`, line('M0 0 L4 -20', '#4f8a3a', 1.6), ...[-16, -12, -8, -4].map((d) => path(`M${f1(-d * 0.2 + 1)} ${d} l-5 -2 M${f1(-d * 0.2 + 1)} ${d} l4 -4`, 'none', '#5f9e48', 2))))), ground),
  'krist.skärtorsdag': all(rect(0, 0, 120, 120, '#f4f0d8', 18, null), fig(52, '#2f6ab0', 'smile', { h: 0.82, bottom: RED }), on(52, 0.82, path('M-12 -60 C-14 -74 14 -74 12 -60 L14 -48 L-14 -48 Z', '#e88aa8', C.ink, 1.3), circle(0, -56, 9.2, C.skin, null), circle(-3.4, -56, 1.2, C.ink, null), circle(3.4, -56, 1.2, C.ink, null),
    circle(-6, -52, 2.6, '#e05050', null), circle(6, -52, 2.6, '#e05050', null), path('M-3 -50.5 Q0 -48 3 -50.5', 'none', C.ink, 1.2), path('M-14 -48 L14 -48 L4 -40 Z', '#e88aa8', C.ink, 1)),
    lo('M78 112 L92 40', WOOD, 2.2), path('M74 112 L82 112 L88 92 Z', '#c9a25a', C.ink, 1.2), at(28, 92, 1, path('M-8 0 L-8 -12 C-8 -18 8 -18 8 -12 L8 0 Z', '#b0b6bc', C.ink, 1.2), path('M8 -10 C14 -10 14 -2 8 -2', 'none', C.ink, 1.4)), cal(100, 24, '4', C.green, 22, 24), ground),
  'krist.långfredag': all(rect(4, 6, 112, 106, '#4a4a5a', 3, C.ink, 1.4), crossS(60, 52, 64, WOOD2, 6), path('M48 40 L72 40 L68 64 L52 64 Z', BLACK, C.ink, 1.2), ...[24, 96].map((x) => candle(x, 104, 1.6, false)), rect(14, 104, 92, 8, '#3a3a46', 1, null), cal(100, 22, '5', '#6a6a7a', 22, 24)),
  'krist.påskdag': all(rect(0, 0, 120, 120, '#fdf6e0', 18, null), sun(98, 22, 8), at(44, 112, 0.95, churchL(WHITE, ROOF)), ...[72, 86, 100].map((x) => all(line(`M${x} 112 L${x} 82`, '#4f8a3a', 1.6), path(`M${x} 82 L${x - 6} 72 L${x - 2} 74 L${x} 68 L${x + 2} 74 L${x + 6} 72 Z`, WHITE, C.ink, 1.1), path(`M${x} 96 l6 -4`, 'none', '#4f8a3a', 2))), cal(18, 24, '7', C.yellow, 22, 24), ground),
  'krist.Kristi-himmelsfärdsdag': all(rect(0, 0, 120, 120, '#e4eff6', 18, null), hill(4, 116, 80, GRASS), rays(60, 22, 14, 34, 9, GOLD, 0, Math.PI * 2), cloud(60, 30, 1.4, WHITE), arrow(60, 76, 60, 50, HL, 2.6), ...[48, 72].map((x) => ellipse(x === 48 ? 54 : 66, 88, 3, 5, '#7a8a6a', null)), cal(100, 76, '40', BLUE, 24, 24), ground),
  'krist.pingst': all(rect(0, 0, 120, 120, '#f6efe0', 18, null), ...[16, 40, 64, 88, 108].map((x, i) => all(person(x, 0.56, { robe: [HLF, '#e4a070', HLF, '#e4a070', HLF][i]!, hair: C.hair, beard: i % 2 ? C.hair : undefined, mood: 'open', pose: i === 2 ? 'up' : 'down' }), flame(x, 38, 0.42))),
    speech(28, 16, 34, squig(16, 16, 24, HL, 1.4)), speech(88, 14, 34, all(...[78, 86, 94].map((x) => rect(x - 2, 10, 4, 7, HL, 0.5, null))), false), ground),
  'krist.allhelgonahelg': all(rect(0, 0, 120, 120, NIGHT, 18, null), moon(98, 20, 7), path('M4 92 L116 92 L116 112 L4 112 Z', '#3a4a3a', null), ...[[22, 92], [60, 90], [98, 92]].map(([x, y]) => all(path(`M${x! - 12} ${y} L${x! - 12} ${y! - 26} C${x! - 12} ${y! - 38} ${x! + 12} ${y! - 38} ${x! + 12} ${y! - 26} L${x! + 12} ${y} Z`, '#9aa3ad', C.ink, 1.4), crossS(x!, y! - 22, 10, '#6a7380', 1.4))),
    ...[[14, 104], [30, 104], [50, 102], [68, 104], [90, 104], [106, 104], [40, 110], [80, 110]].map(([x, y]) => all(rect(x! - 3, y! - 6, 6, 8, '#c8372d', 1, C.ink, 0.8), flame(x!, y! - 9, 0.26))), line('M4 112 L116 112', C.grey2, 2)),
};
function GREEN_OR(): string { return '#3f8a4a'; }
