/**
 * Natur & geografi → Djurvärlden → Kräldjur & groddjur, 2741–2747 (0.44): snakes and lizards, turtles,
 * crocodilians, frogs and toads, salamanders, cold-blooded adaptation, and reproduction in water and on land.
 * Recurring signs: each species is drawn with its field marks (huggorm grey with a black zigzag, snok black with
 * yellow patches on the neck, hasselsnok brown with small dark spots, sandödla green flanks, skogsödla small and
 * brown with a dark stripe, kopparödla shiny copper and legless; tortoise with a high dome, sea turtle with long
 * flippers; crocodilians seen from above so that the snout tells them apart: V-shaped with teeth (krokodil), broad
 * U (alligator), very thin (gavial), short with a ridge between the eyes (kajman); frog smooth and green-brown,
 * toad brown and warty; newts with a crest and an orange belly). Snakes and lizards are mostly seen from above.
 * A yellow sun and heat waves stand for warmth, blue ice crystals for frost. An orange highlight (ring, outline
 * or arrow) marks the part or the process that the word names. Adjectives are scenes where the property
 * dominates, with a small grey reference panel that lacks it. No words, no letters, no brands, no pointing fingers.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, type Svg } from './kit';
import { HL } from './people';

// ── Palette ──────────────────────────────────────────────────────────
const SKY = '#cfe6f7';
const NIGHT = '#2a3560';
const WATER = '#7db7df';
const WATER2 = '#5c9fd0';
const POND = '#8fbfa8';
const GRASS = '#9fcb6e';
const GRASS2 = '#7fb356';
const MOSS = '#6f9a4a';
const SAND = '#ecd9a8';
const SAND2 = '#d9c088';
const SOIL = '#9b7553';
const SOIL2 = '#7a5638';
const MUD = '#5b4a3a';
const ROCK = '#a7a39b';
const ROCK2 = '#8d8981';
const BARK = '#8a5a35';
const SNOW = '#f5f8fb';
const BLACK = '#26262c';
const WHITE = '#fbfbf8';
const YEL = '#f4cf3a';
const ORANGE = '#ef8a3c';
const RED = '#d23b2e';
const COPPER = '#c27a3e';
const LEAF = '#5aa04a';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
/** Same as at() but mirrored, so the figure faces left. */
const atL = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${-s} ${s})`, ...k);
const rot = (x: number, y: number, a: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) rotate(${a}) scale(${s})`, ...k);

// ── Scenery ──────────────────────────────────────────────────────────
const bg = (col: string = SKY) => rect(4, 4, 112, 108, col, 3, null);
const field = (y = 96, col: string = GRASS) => rect(4, y, 112, 112 - y, col, 0, null);
const sea = (y = 80, col: string = WATER) => all(rect(4, y, 112, 112 - y, col, 0, null), line(range(5).map((i) => `M${10 + i * 22} ${y + 8 + (i % 2) * 10} q4 -2 8 0`).join(' '), WHITE, 1));
const under = (col: string = WATER) => all(rect(4, 4, 112, 108, col, 3, null), line(range(4).map((i) => `M${14 + i * 28} ${12 + (i % 2) * 6} q4 -2 8 0`).join(' '), '#d6ecf9', 1));
const sun = (x: number, y: number, r = 7) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 2.5))} ${f1(y + Math.sin(a) * (r + 2.5))} L${f1(x + Math.cos(a) * (r + 6))} ${f1(y + Math.sin(a) * (r + 6))}`, C.gold, 1.8); }), circle(x, y, r, C.yellow, C.ink, 1.2));
const moon = (x: number, y: number, r = 7) => path(`M${x} ${y - r} A${r} ${r} 0 1 0 ${x + r * 0.9} ${y + r * 0.5} A${r * 0.8} ${r * 0.8} 0 1 1 ${x} ${y - r} Z`, '#f5e7a8', C.ink, 0.8);
const heat = (x: number, y: number, n = 3, col: string = ORANGE) => line(range(n).map((i) => `M${x + i * 6} ${y} q-2 -3 0 -6 q2 -3 0 -6`).join(' '), col, 1.3);
const flake = (x: number, y: number, r = 3, col = '#5aa7d8') => line(`M${x - r} ${y} L${x + r} ${y} M${x - r / 2} ${f1(y - r * 0.87)} L${x + r / 2} ${f1(y + r * 0.87)} M${x - r / 2} ${f1(y + r * 0.87)} L${x + r / 2} ${f1(y - r * 0.87)}`, col, 1.1);
const rockAt = (x: number, y: number, w: number, h: number, col: string = ROCK) => path(`M${x - w / 2} ${y} C${x - w / 2} ${y - h} ${x - w / 5} ${y - h} ${x} ${y - h} C${x + w / 4} ${y - h} ${x + w / 2} ${y - h * 0.7} ${x + w / 2} ${y} Z`, col, C.ink, 1.2);
/** A flat stone seen from above. */
const slab = (x: number, y: number, rx: number, ry: number, col: string = ROCK) => all(ellipse(x, y + 2, rx, ry, ROCK2, null), ellipse(x, y, rx, ry, col, C.ink, 1.2));
const tree = (x: number, y: number, s = 1, col: string = GRASS2) => at(x, y, s, rect(-2, -14, 4, 14, BARK, 1, C.ink, 1), circle(0, -20, 9, col, C.ink, 1.2), circle(-5, -15, 5.5, col, null), circle(5, -16, 5.5, col, null));
const pine = (x: number, y: number, s = 1, col = '#3f8a4f') => at(x, y, s, rect(-1.5, -5, 3, 5, BARK, 0, C.ink, 0.8), path('M0 -30 L9 -5 L-9 -5 Z', col, C.ink, 1.1));
const bush = (x: number, y: number, s = 1, col: string = GRASS2) => at(x, y, s, path('M-16 0 C-20 -10 -12 -18 -4 -16 C0 -24 12 -22 13 -14 C20 -14 22 -4 16 0 Z', col, C.ink, 1.2));
const reed = (x: number, y: number, h = 22) => all(line(`M${x} ${y} L${x} ${y - h}`, '#6f8f3a', 1.4), ellipse(x, y - h - 3, 1.6, 4, '#8a5a35', C.ink, 0.6));
const palm = (x: number, y: number, s = 1) => at(x, y, s, line('M0 0 C2 -12 1 -24 4 -34', BARK, 3), path('M4 -34 C-6 -40 -14 -36 -18 -30 C-8 -34 -2 -33 4 -34 Z M4 -34 C14 -40 22 -36 24 -28 C14 -33 8 -33 4 -34 Z M4 -34 C0 -44 6 -50 12 -48 C6 -44 5 -40 4 -34 Z', GRASS2, C.ink, 0.9));
const leafAt = (x: number, y: number, a = 0, s = 1, col: string = LEAF) => rot(x, y, a, s, path('M0 0 C8 -10 26 -10 34 0 C26 10 8 10 0 0 Z', col, C.ink, 1), line('M2 0 L32 0', '#3f7a35', 0.8));
const stump = (x: number, y: number, s = 1) => at(x, y, s, path('M-14 0 L-12 -18 L12 -18 L14 0 Z', BARK, C.ink, 1.2), ellipse(0, -18, 12, 4, '#d9b07a', C.ink, 1.1), ellipse(0, -18, 7, 2.3, 'none', '#b88a54', 0.8), ellipse(0, -18, 3, 1, 'none', '#b88a54', 0.8), path('M-14 0 L-20 2 M14 0 L20 2', 'none', BARK, 2));
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.4);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.4);
/** Grey reference: the same kind of scene without the property, drained of colour. */
const grey = (...k: Svg[]): Svg => `<g opacity="0.8" style="filter:grayscale(1)">${k.join('')}</g>`;
const greyPane = (x: number, y: number, s: number, ...k: Svg[]) => all(rect(x + 4 * s, y + 4 * s, 112 * s, 108 * s, C.white, 2, null), grey(g(`translate(${x} ${y}) scale(${s})`, ...k)), rect(x + 4 * s, y + 4 * s, 112 * s, 108 * s, 'none', 2, C.grey, 1.2));
const bracket = (x1: number, x2: number, y: number) => line(`M${x1} ${y - 4} L${x1} ${y} L${x2} ${y} L${x2} ${y - 4}`, HL, 2.2);
const thermo = (x: number, y: number, level: number, col: string = RED) => all(rect(x - 3, y - 30, 6, 28, WHITE, 3, C.ink, 1), rect(x - 1.4, y - 2 - level, 2.8, level, col, 1, null), circle(x, y, 4.5, col, C.ink, 1), line(`M${x + 3} ${y - 10} l2 0 M${x + 3} ${y - 18} l2 0 M${x + 3} ${y - 26} l2 0`, C.ink, 0.7));
const egg = (x: number, y: number, s = 1, col: string = '#f3ecdc') => ellipse(x, y, 4 * s, 5.2 * s, col, C.ink, 0.9);
const bubbles = (x: number, y: number) => all(circle(x, y, 1.6, 'none', WHITE, 0.9), circle(x + 2, y - 5, 1.2, 'none', WHITE, 0.9), circle(x - 1, y - 9, 0.9, 'none', WHITE, 0.9));
const speed = (x: number, y: number, len: number, n = 3, gap = 5, col: string = C.grey) => line(range(n).map((i) => `M${x} ${y + i * gap} l${-len} 0`).join(' '), col, 1.4);
/** A thumb seen from the side, pressing down (no pointing finger). */
const thumb = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(-6, -14, 12, 12, C.skin, 3, C.ink, 1.2), path('M-4 -2 L-4 6 C-4 9 3 9 3 6 L3 -2 Z', C.skin, C.ink, 1.2), path('M-8 -26 L8 -26 L8 -13 L-8 -13 Z', C.denim, C.ink, 1.1));

// ── People ───────────────────────────────────────────────────────────
/** A standing person, feet at (x, y); arms is an optional path in local coordinates (shoulders at y≈-16). */
const kid = (x: number, y: number, s = 1, col: string = C.orange, arms = '', extra: Svg = '') => at(x, y, s, line('M-2 0 L-1.5 -8 M2 0 L1.5 -8', C.ink, 1.8), path('M-3.8 -8 L3.8 -8 L3.2 -17 L-3.2 -17 Z', col, C.ink, 0.9), circle(0, -20.5, 3.4, C.skin, C.ink, 0.9), path('M-3.4 -21 C-3.4 -25.5 3.4 -25.5 3.4 -21 C1.5 -22.5 -1.5 -22.5 -3.4 -21 Z', C.hair, null), line(arms || 'M-3.2 -16 L-4.6 -9 M3.2 -16 L4.6 -9', C.ink, 1.5), extra);

// ── Snakes ───────────────────────────────────────────────────────────
type Snake = { col?: string; zig?: string; nape?: string; spots?: string; stripe?: string; shine?: boolean; w?: number; amp?: number; waves?: number; tongue?: boolean; open?: boolean; head?: string; mark?: string; blunt?: boolean; eyelid?: boolean; phase?: number };
/** A snake seen from above, slithering to the right from (x0, y) to (x1, y); the head is at the right end. */
const snake = (x0: number, x1: number, y: number, o: Snake = {}): Svg => {
  const w = o.w ?? 7, A = o.amp ?? 6, k = ((o.waves ?? 1.5) * 2 * Math.PI) / (x1 - x0), ph = o.phase ?? 0, N = 40;
  const pts = range(N + 1).map((i) => { const x = x0 + ((x1 - x0) * i) / N; return [f1(x), f1(y + A * Math.sin(k * (x - x0) + ph))] as [number, number]; });
  const wid = (i: number) => w * Math.min(1, (o.blunt ? 0.75 : 0.18) + i / (N * (o.blunt ? 0.6 : 0.45)));
  const seg = (i: number, extra: number, col: string) => line(`M${pts[i]![0]} ${pts[i]![1]} L${pts[i + 1]![0]} ${pts[i + 1]![1]}`, col, f1(wid(i) + extra));
  const col = o.col ?? '#8f8a6a';
  const [hx, hy] = pts[N]!, [px, py] = pts[N - 1]!;
  const a = f1((Math.atan2(hy - py, hx - px) * 180) / Math.PI);
  const zig = o.zig ? line(range(N - 9).map((j) => { const i = j + 6; const [x, yy] = pts[i]!; return `${j ? 'L' : 'M'}${x} ${f1(yy + (j % 2 ? 1 : -1) * wid(i) * 0.28)}`; }).join(' '), o.zig, f1(w * 0.26)) : '';
  const spots = o.spots ? all(...range(12).map((j) => { const i = 6 + j * 2.6; const p = pts[Math.round(i)]!; return all(circle(p[0], f1(p[1] - wid(Math.round(i)) * 0.22), f1(w * 0.12), o.spots!, null), circle(p[0] + 1.5, f1(p[1] + wid(Math.round(i)) * 0.22), f1(w * 0.12), o.spots!, null)); })) : '';
  const stripe = o.stripe ? line(pts.slice(4, N - 1).map(([x, yy], j) => `${j ? 'L' : 'M'}${x} ${yy}`).join(' '), o.stripe, f1(w * 0.22)) : '';
  const shine = o.shine ? line(pts.slice(8, N - 2).map(([x, yy], j) => `${j ? 'L' : 'M'}${x} ${f1(yy - w * 0.22)}`).join(' '), 'rgba(255,255,255,0.55)', f1(w * 0.14)) : '';
  const hw = o.blunt ? w * 0.8 : w;
  const head = g(`translate(${hx} ${hy}) rotate(${a})`,
    o.tongue ? line(`M${f1(hw * 1.6)} 0 L${f1(hw * 2.6)} 0 L${f1(hw * 3.1)} ${f1(-hw * 0.35)} M${f1(hw * 2.6)} 0 L${f1(hw * 3.1)} ${f1(hw * 0.35)}`, RED, 1) : '',
    o.open ? path(`M${f1(hw * 0.6)} ${f1(-hw * 0.5)} L${f1(hw * 2)} ${f1(-hw * 1.3)} L${f1(hw * 1.1)} 0 L${f1(hw * 2)} ${f1(hw * 1.3)} L${f1(hw * 0.6)} ${f1(hw * 0.5)} Z`, '#e88a8a', C.ink, 0.8) : '',
    ellipse(f1(hw * 0.65), 0, f1(hw * 1.05), f1(hw * 0.72), o.head ?? col, C.ink, 1),
    o.mark ? path(`M${f1(hw * 0.1)} ${f1(-hw * 0.35)} L${f1(hw * 0.7)} 0 L${f1(hw * 0.1)} ${f1(hw * 0.35)}`, 'none', o.mark, f1(hw * 0.18)) : '',
    circle(f1(hw * 1.05), f1(-hw * 0.38), f1(hw * 0.17), o.eyelid ? COPPER : '#e9c44a', C.ink, 0.5), circle(f1(hw * 1.05), f1(-hw * 0.38), f1(hw * 0.07), C.ink, null),
    circle(f1(hw * 1.05), f1(hw * 0.38), f1(hw * 0.17), o.eyelid ? COPPER : '#e9c44a', C.ink, 0.5), circle(f1(hw * 1.05), f1(hw * 0.38), f1(hw * 0.07), C.ink, null),
  );
  const nape = o.nape ? g(`translate(${px} ${py}) rotate(${a})`, ellipse(0, f1(-w * 0.32), f1(w * 0.34), f1(w * 0.22), o.nape, C.ink, 0.5), ellipse(0, f1(w * 0.32), f1(w * 0.34), f1(w * 0.22), o.nape, C.ink, 0.5)) : '';
  return all(...range(N).map((i) => seg(i, 2, C.ink)), ...range(N).map((i) => seg(i, 0, col)), zig, spots, stripe, shine, nape, head);
};
/** A snake coiled in a spiral seen from above, centre (x, y), with the head lifted in the middle. */
const coil = (x: number, y: number, R: number, o: Snake = {}): Svg => {
  const w = o.w ?? 7, col = o.col ?? '#8f8a6a', N = 50, turns = 2.1;
  const pts = range(N + 1).map((i) => { const t = i / N, a = t * turns * 2 * Math.PI, r = R - t * (R - w * 0.9); return [f1(x + r * Math.cos(a)), f1(y + r * Math.sin(a) * 0.8)] as [number, number]; });
  const wid = (i: number) => w * Math.min(1, 0.2 + i / (N * 0.3));
  const seg = (i: number, extra: number, c: string) => line(`M${pts[i]![0]} ${pts[i]![1]} L${pts[i + 1]![0]} ${pts[i + 1]![1]}`, c, f1(wid(i) + extra));
  const zig = o.zig ? line(range(N - 6).map((j) => { const i = j + 4, [px, py] = pts[i]!; return `${j ? 'L' : 'M'}${px} ${f1(py + (j % 2 ? 1 : -1) * wid(i) * 0.26)}`; }).join(' '), o.zig, f1(w * 0.24)) : '';
  const [hx, hy] = pts[N]!;
  return all(...range(N).map((i) => seg(i, 2, C.ink)), ...range(N).map((i) => seg(i, 0, col)), zig,
    ellipse(hx + 2, hy - 2, f1(w * 1.05), f1(w * 0.75), o.head ?? col, C.ink, 1),
    o.mark ? path(`M${f1(hx - 1)} ${f1(hy - 4)} L${f1(hx + 3)} ${f1(hy - 2)} L${f1(hx - 1)} ${f1(hy)}`, 'none', o.mark, 1.4) : '',
    circle(hx + 5, hy - 4, 1.1, '#e9c44a', C.ink, 0.5), circle(hx + 5, hy, 1.1, '#e9c44a', C.ink, 0.5),
    o.tongue ? line(`M${hx + 9} ${hy - 2} L${hx + 15} ${hy - 2} L${hx + 18} ${hy - 4} M${hx + 15} ${hy - 2} L${hx + 18} ${hy}`, RED, 1) : '');
};
const HUGGORM: Snake = { col: '#a9a59a', zig: BLACK, mark: BLACK, head: '#a9a59a' };
const SNOK: Snake = { col: '#3e4044', nape: YEL, head: '#3e4044' };
const HASSEL: Snake = { col: '#a8876a', spots: '#4e3626', head: '#a8876a', mark: '#4e3626', w: 6 };
const KOPPAR: Snake = { col: COPPER, shine: true, head: COPPER, blunt: true, eyelid: true, w: 6, amp: 3, waves: 1 };
const GENERIC_SNAKE: Snake = { col: '#8f8a6a' };

// ── Lizards ──────────────────────────────────────────────────────────
type Lizard = { col?: string; flank?: string; stripe?: string; dots?: string; belly?: string; noTail?: boolean; stub?: boolean; eyesShut?: boolean };
/** A lizard seen from above, facing right, centre of the body at (0, 0); about 60 units long at scale 1. */
const lizard = (o: Lizard = {}): Svg => {
  const col = o.col ?? '#9c7a4e';
  const leg = (x: number, sy: number, fx: number) => all(line(`M${x} ${sy * 4} L${x + fx * 0.6} ${sy * 10} L${x + fx} ${sy * 12}`, C.ink, 3.6), line(`M${x} ${sy * 4} L${x + fx * 0.6} ${sy * 10} L${x + fx} ${sy * 12}`, col, 2), line(`M${x + fx} ${sy * 12} l2 ${sy * 1.5} M${x + fx} ${sy * 12} l-0.5 ${sy * 2.4} M${x + fx} ${sy * 12} l-2.4 ${sy * 1.2}`, C.ink, 0.8));
  const tail = o.noTail ? '' : o.stub ? path('M-12 -3 C-16 -3 -19 -2 -21 0 C-19 2 -16 3 -12 3 Z', col, C.ink, 1) : path('M-12 -3.4 C-24 -3.4 -32 1 -44 8 C-32 5 -24 3.4 -12 3.4 Z', col, C.ink, 1);
  return all(
    leg(8, -1, 6), leg(8, 1, 6), leg(-8, -1, -4), leg(-8, 1, -4),
    tail,
    path('M-13 0 C-13 -6 -4 -6.5 6 -5.5 C12 -5 15 -4 16 -3.4 L16 3.4 C15 4 12 5 6 5.5 C-4 6.5 -13 6 -13 0 Z', col, C.ink, 1.1),
    o.flank ? all(path('M-10 -3.5 C-4 -5.8 4 -5.8 12 -4.4 L12 -2.8 C4 -3.8 -4 -3.6 -10 -2.2 Z', o.flank, null), path('M-10 3.5 C-4 5.8 4 5.8 12 4.4 L12 2.8 C4 3.8 -4 3.6 -10 2.2 Z', o.flank, null)) : '',
    o.stripe ? line(`M-12 0 L14 0${o.noTail || o.stub ? '' : ' M-14 0 L-30 1.8'}`, o.stripe, 1.6) : '',
    o.dots ? all(...[[-6, -2.2], [0, -2.4], [6, -2.2], [-6, 2.2], [0, 2.4], [6, 2.2]].map(([x, y]) => all(circle(x!, y!, 1.2, o.dots!, null), circle(x!, y!, 0.45, WHITE, null)))) : '',
    path('M14 -3.8 C18 -4.6 22 -3.6 25 -1.4 C26 -0.6 26 0.6 25 1.4 C22 3.6 18 4.6 14 3.8 Z', col, C.ink, 1.1),
    o.eyesShut ? line('M18.5 -3.6 l2 0 M18.5 3.6 l2 0', C.ink, 0.9) : all(circle(19.5, -3.4, 0.9, C.ink, null), circle(19.5, 3.4, 0.9, C.ink, null)),
  );
};
const SKOGSODLA: Lizard = { col: '#8a6a45', stripe: '#3e2c1c', dots: '#e9d9a8' };
const SANDODLA: Lizard = { col: '#9c7a4e', flank: '#5fae3e', dots: '#3e2c1c' };
const GENERIC_LIZARD: Lizard = { col: '#9c8a5a' };

// ── Turtles ──────────────────────────────────────────────────────────
type Tortoise = { shell?: string; scute?: string; skin?: string; low?: boolean; headIn?: boolean; mouthLeaf?: boolean; outline?: boolean; small?: boolean };
/** A tortoise seen from the side, facing right, feet at (0, 0). */
const tortoise = (o: Tortoise = {}): Svg => {
  const sh = o.shell ?? '#a0763f', sk = o.skin ?? '#a7a074', top = o.low ? -20 : -30;
  return all(
    o.headIn ? '' : all(rect(-15, -8, 6, 8, sk, 2, C.ink, 1), rect(9, -8, 6, 8, sk, 2, C.ink, 1), path('M18 -10 C22 -12 26 -16 30 -15 C34 -14 35 -10 32 -8 C28 -6 22 -6 18 -6 Z', sk, C.ink, 1), circle(30, -12.5, 0.9, C.ink, null), path('M-20 -7 L-25 -5 L-20 -4 Z', sk, C.ink, 0.8)),
    o.headIn ? all(rect(-15, -4, 6, 4, sk, 2, C.ink, 1), rect(9, -4, 6, 4, sk, 2, C.ink, 1)) : '',
    o.mouthLeaf ? path('M32 -9 C36 -12 42 -10 42 -6 C38 -5 34 -6 32 -9 Z', LEAF, C.ink, 0.8) : '',
    path(`M-22 -6 C-22 ${top} 22 ${top} 22 -6 Z`, sh, C.ink, 1.2),
    path(`M-6 ${top + 6} L6 ${top + 6} L9 ${f1((top - 6) / 2)} L0 ${f1((top - 6) / 2 + 4)} L-9 ${f1((top - 6) / 2)} Z`, o.scute ?? '#d6a85a', C.ink, 0.9),
    path(`M-19 -10 L-13 ${f1((top - 6) / 2 + 2)} L-9 ${f1((top - 6) / 2)} M19 -10 L13 ${f1((top - 6) / 2 + 2)} L9 ${f1((top - 6) / 2)} M0 ${f1((top - 6) / 2 + 4)} L0 -8`, 'none', C.ink, 0.9),
    rect(-23, -9, 46, 4, '#8a6232', 2, C.ink, 1),
    o.outline ? path(`M-24 -5 C-24 ${top - 3} 24 ${top - 3} 24 -5 Z`, 'none', HL, 2.4) : '',
  );
};
type SeaTurtle = { shell?: string; skin?: string };
/** A sea turtle seen from above, swimming to the right, centre (0, 0). */
const seaTurtle = (o: SeaTurtle = {}): Svg => {
  const sh = o.shell ?? '#7a6a3a', sk = o.skin ?? '#9fae7a';
  return all(
    path('M6 -10 C12 -22 22 -32 34 -34 C28 -26 20 -16 12 -8 Z', sk, C.ink, 1), path('M6 10 C12 22 22 32 34 34 C28 26 20 16 12 8 Z', sk, C.ink, 1),
    path('M-14 -8 C-18 -14 -24 -16 -28 -14 C-24 -10 -20 -8 -16 -5 Z', sk, C.ink, 1), path('M-14 8 C-18 14 -24 16 -28 14 C-24 10 -20 8 -16 5 Z', sk, C.ink, 1),
    path('M-20 -2 L-26 0 L-20 2 Z', sk, C.ink, 0.8),
    ellipse(20, 0, 7, 5.5, sk, C.ink, 1), circle(23, -3, 0.9, C.ink, null), circle(23, 3, 0.9, C.ink, null),
    ellipse(0, 0, 20, 14, sh, C.ink, 1.2),
    path('M-8 -5 L0 -7 L8 -5 L8 5 L0 7 L-8 5 Z', '#9a8648', C.ink, 0.8),
    line('M-8 -5 L-16 -6 M-8 5 L-16 6 M8 -5 L16 -6 M8 5 L16 6 M0 -7 L0 -13 M0 7 L0 13 M-8 0 L-19 0', C.ink, 0.8),
  );
};
/** A tiny sea turtle hatchling seen from above, heading up (to the sea). */
const hatchling = (x: number, y: number, a = -90, s = 0.35) => rot(x, y, a, s, seaTurtle({ shell: '#4a4236', skin: '#6b6a5a' }));

// ── Crocodilians ─────────────────────────────────────────────────────
type Croc = { snout?: 'V' | 'U' | 'thin' | 'short'; col?: string; teeth?: boolean; ridge?: boolean };
/** A crocodilian seen from above, facing right, centre (0, 0); about 110 units long at scale 1. */
const crocTop = (o: Croc = {}): Svg => {
  const col = o.col ?? '#5f7a3e', dk = 'rgba(0,0,0,0.25)';
  const snout = o.snout === 'U' ? 'M20 -7 C32 -7.5 42 -7 42 0 C42 7 32 7.5 20 7 Z'
    : o.snout === 'thin' ? 'M20 -6 C24 -4 25 -2.2 28 -2 L52 -1.6 C55 -3 57 -2 57 0 C57 2 55 3 52 1.6 L28 2 C25 2.2 24 4 20 6 Z'
    : o.snout === 'short' ? 'M20 -7 C28 -7.5 36 -6 36 0 C36 6 28 7.5 20 7 Z'
    : 'M20 -7 C28 -6 38 -4 44 -1.6 C46 -0.6 46 0.6 44 1.6 C38 4 28 6 20 7 Z';
  const teeth = o.teeth === false ? '' : o.snout === 'U' ? '' : o.snout === 'thin' ? line(range(9).map((i) => `M${30 + i * 2.6} -1.8 l0.8 -1.4 M${30 + i * 2.6} 1.8 l0.8 1.4`).join(' '), WHITE, 0.8)
    : line(range(5).map((i) => `M${24 + i * 4} ${f1(-6.6 + i * 1)} l1 -1.6 M${24 + i * 4} ${f1(6.6 - i * 1)} l1 1.6`).join(' '), WHITE, 1.1);
  const leg = (x: number, sy: number, fx: number) => all(line(`M${x} ${sy * 7} L${x + fx * 0.5} ${sy * 13} L${x + fx} ${sy * 15}`, C.ink, 4.6), line(`M${x} ${sy * 7} L${x + fx * 0.5} ${sy * 13} L${x + fx} ${sy * 15}`, col, 2.8));
  return all(
    leg(12, -1, 6), leg(12, 1, 6), leg(-12, -1, -5), leg(-12, 1, -5),
    path('M-18 -6 C-34 -6 -48 -2 -64 1 C-48 4 -34 6 -18 6 Z', col, C.ink, 1.1),
    line('M-22 -3 l-3 3 l3 3 M-32 -2.4 l-3 2.4 l3 2.4 M-42 -1.6 l-3 1.6 l3 1.6 M-52 -0.8 l-3 1 l3 1', dk, 1),
    path(snout, col, C.ink, 1.1), teeth,
    o.snout === 'thin' ? ellipse(54, 0, 3.4, 3.2, col, C.ink, 1) : '',
    ellipse(0, 0, 22, 9, col, C.ink, 1.2),
    line(range(5).map((i) => `M${-14 + i * 6} -3 l0 0.1 M${-14 + i * 6} 3 l0 0.1 M${-11 + i * 6} 0 l0 0.1`).join(' '), dk, 2.2),
    path('M18 -7 C22 -8 26 -7 28 -5 L28 5 C26 7 22 8 18 7 Z', col, C.ink, 1),
    ellipse(23, -5, 2.6, 2, '#e9d04a', C.ink, 0.8), ellipse(23, 5, 2.6, 2, '#e9d04a', C.ink, 0.8), line('M22 -5 l2 0 M22 5 l2 0', C.ink, 0.8),
    o.ridge ? line('M27 -4 C29 -2 29 2 27 4', C.ink, 1.3) : '',
    circle(o.snout === 'thin' ? 55 : o.snout === 'short' ? 34 : o.snout === 'U' ? 40 : 43, -1.2, 0.6, C.ink, null), circle(o.snout === 'thin' ? 55 : o.snout === 'short' ? 34 : o.snout === 'U' ? 40 : 43, 1.2, 0.6, C.ink, null),
  );
};
/** A crocodile seen from the side, facing right, belly on the ground at (0, 0); open = gaping. */
const crocSide = (o: { col?: string; open?: boolean } = {}): Svg => {
  const col = o.col ?? '#5f7a3e';
  return all(
    path('M-20 -4 C-36 -6 -50 -4 -64 0 C-50 1 -36 1 -20 0 Z', col, C.ink, 1.1),
    line('M-24 -5 l2 -3 l2 3 M-34 -5 l2 -3 l2 3 M-44 -4 l2 -2.4 l2 2.4', C.ink, 0.9),
    rect(-14, -5, 6, 6, col, 2, C.ink, 1), rect(10, -5, 6, 6, col, 2, C.ink, 1),
    path('M-22 -2 C-22 -12 -6 -14 12 -12 C18 -11.5 22 -10 24 -8 L24 0 L-22 0 Z', col, C.ink, 1.2),
    line('M-16 -12 l2 -3 l2 3 M-8 -13 l2 -3 l2 3 M0 -13 l2 -3 l2 3 M8 -12.5 l2 -3 l2 3', C.ink, 0.9),
    o.open
      ? all(path('M22 -6 L50 -24 L52 -21 L26 -4 Z', col, C.ink, 1.1), path('M24 -2 L54 -2 L54 1 L24 1 Z', col, C.ink, 1.1), path('M26 -4 L50 -21 L52 -2 L26 -2 Z', '#e88a8a', null), line('M30 -7 l1 1.6 M36 -11 l1 1.6 M42 -15 l1 1.6 M48 -19 l1 1.6 M32 -2 l0.8 -1.8 M38 -2 l0.8 -1.8 M44 -2 l0.8 -1.8 M50 -2 l0.8 -1.8', WHITE, 1.1))
      : all(path('M22 -9 C34 -9 46 -7 54 -4 C56 -3 56 0 54 0 L22 0 Z', col, C.ink, 1.1), line('M30 -1 l1 -2 M36 -1 l1 -2 M42 -1 l1 -2 M48 -1 l1 -2', WHITE, 1)),
    path('M18 -10 C19 -14 24 -14 25 -10 Z', col, C.ink, 1), circle(21.6, -11.6, 1.2, '#e9d04a', C.ink, 0.6),
  );
};
/** Eyes and nostrils of a crocodilian just above the water line y = 0, facing right. */
const lurk = (col = '#5f7a3e') => all(path('M-6 1 C-6 -5 0 -5 0 1 Z', col, C.ink, 1), path('M4 1 C4 -5 10 -5 10 1 Z', col, C.ink, 1), ellipse(-3, -2, 1.8, 1.4, '#e9d04a', C.ink, 0.6), ellipse(7, -2, 1.8, 1.4, '#e9d04a', C.ink, 0.6), line('M-3 -3 l0 2 M7 -3 l0 2', C.ink, 0.8), path('M30 1 C30 -3 36 -3 36 1 Z', col, C.ink, 1), line('M-16 2 q4 -2 8 0 M14 2 q6 -2 12 0 M40 2 q4 -2 8 0', WHITE, 1));

// ── Frogs ────────────────────────────────────────────────────────────
type Frog = { col?: string; belly?: string; spots?: string; warts?: string; stripe?: string; discs?: boolean; sac?: boolean; eye?: string; pattern?: string; legHL?: boolean };
/** A frog sitting, seen from the side, facing right, feet at (0, 0); about 34 units long at scale 1. */
const frog = (o: Frog = {}): Svg => {
  const col = o.col ?? '#7a9a48';
  return all(
    path('M-12 -2 C-14 -14 -4 -22 8 -20 C15 -19 20 -14 19.5 -9 C19 -4 11 -1 0 -1 Z', col, C.ink, 1.2),
    o.belly ? path('M-8 -2.6 C0 -1.6 12 -2.6 18 -7 C17 -4 11 -1 0 -1 C-4 -1 -7 -1.6 -8 -2.6 Z', o.belly, null) : '',
    o.stripe ? line('M18 -13 C10 -12 0 -10 -10 -8', o.stripe, 1.6) : '',
    o.pattern ? all(...[[-6, -12, 2.6], [2, -16, 2.2], [-1, -8, 2], [8, -13, 1.8], [-9, -6, 1.6]].map(([x, y, r]) => circle(x!, y!, r!, o.pattern!, null))) : '',
    o.spots ? all(...[[-6, -12], [0, -16], [-1, -8], [6, -12], [-9, -7], [3, -6]].map(([x, y]) => ellipse(x!, y!, 1.6, 1.1, o.spots!, null))) : '',
    o.warts ? all(...[[-7, -12], [-3, -16], [1, -12], [5, -16], [-9, -8], [-4, -8], [3, -8], [8, -12], [-1, -18], [10, -16]].map(([x, y]) => circle(x!, y!, 1.1, o.warts!, C.ink, 0.4))) : '',
    path('M-10 -4 C-14 -12 -2 -15 1 -7 C-1 -2 -7 -1 -10 -4 Z', col, C.ink, 1.1),
    path('M-6 -1.5 L9 -1.5 C11 -1.5 12 -0.6 12 0 L-6 0 Z', col, C.ink, 1),
    o.legHL ? oval(-3, -5, 11, 7) : '',
    line('M10 -6 L12 0 M12 0 l2.4 0 M12 0 l-1.6 0.2', C.ink, 2.2), line('M10 -6 L12 0', col, 1),
    o.discs ? all(circle(14.4, 0, 1.1, col, C.ink, 0.6), circle(12.4, -0.2, 1.1, col, C.ink, 0.6), circle(9.6, -1.5, 1.1, col, C.ink, 0.6)) : '',
    o.sac ? circle(18, -4, 4.6, '#f3e6c4', C.ink, 0.9) : '',
    line('M19.4 -9.6 C15 -8.6 11 -8.6 7 -10', C.ink, 0.9),
    circle(11, -19, 3.6, col, C.ink, 1), circle(11.6, -19.4, 2.1, o.eye ?? '#e9c44a', C.ink, 0.5), ellipse(11.8, -19.4, 1.4, 0.7, C.ink, null),
  );
};
const GRODA: Frog = { col: '#8a8a4a', belly: '#e9e3c4', spots: '#4e4a2a', stripe: '#4e3a26' };
const PADDA: Frog = { col: '#9a7650', belly: '#e9d9b8', warts: '#7a5638', eye: '#e8a33a' };
const LOVGRODA: Frog = { col: '#4fbf3a', belly: '#f3efd8', stripe: '#3e3226', discs: true };
const PILGIFT: Frog = { col: '#2f7ad9', belly: '#2f7ad9', pattern: BLACK, eye: BLACK };
/** A frog leaping to the right with its hind legs stretched out, centre (0, 0). */
const frogJump = (o: Frog = {}): Svg => {
  const col = o.col ?? '#7a9a48';
  return all(
    path('M-8 -2 L-24 4 L-36 8 L-38 6 L-26 1 L-10 -5 Z', col, C.ink, 1), path('M-8 2 L-24 9 L-35 14 L-37 12 L-25 6 L-10 -1 Z', col, C.ink, 1),
    o.legHL ? all(oval(-24, 4, 15, 5), oval(-23, 9, 15, 5)) : '',
    path('M-10 0 C-10 -8 6 -10 14 -6 C18 -4 18 2 14 3 C6 6 -10 6 -10 0 Z', col, C.ink, 1.2),
    line('M12 3 L20 7 M12 1 L21 3', C.ink, 1.6),
    circle(10, -7, 2.8, col, C.ink, 0.9), circle(10.6, -7.4, 1.5, '#e9c44a', null), circle(10.8, -7.4, 0.6, C.ink, null),
  );
};

// ── Salamanders ──────────────────────────────────────────────────────
type Newt = { col?: string; belly?: string; bellySpots?: string; spots?: string; crest?: 'high' | 'low'; crestHL?: boolean; gills?: string; blotch?: string; noLeg?: boolean; newLeg?: boolean };
/** A newt or salamander seen from the side, facing right, feet at (0, 0); about 62 units long at scale 1. */
const newt = (o: Newt = {}): Svg => {
  const col = o.col ?? '#8a7350';
  const crest = o.crest === 'high' ? 'M-6 -8 L-4 -13 L-2 -9 L0 -14 L2 -9.4 L4 -14 L6 -9.4 L8 -13 L10 -9 M-14 -7.6 L-17 -12 L-20 -7.6 L-23 -11 L-26 -7 L-29 -10 L-32 -6 L-36 -8 L-40 -4'
    : 'M-6 -8.6 Q-3 -12 0 -9.4 Q3 -12 6 -9.4 Q9 -11 11 -9 M-14 -8 Q-18 -11 -22 -7.6 Q-26 -10 -30 -6.6 Q-34 -8 -40 -4';
  const crestFill = o.crest === 'high' ? 'M-8 -8 L-4 -13 L-2 -9 L0 -14 L2 -9.4 L4 -14 L6 -9.4 L8 -13 L11 -8.6 Z M-12 -7.6 L-17 -12 L-20 -7.6 L-23 -11 L-26 -7 L-29 -10 L-32 -6 L-36 -8 L-41 -4 L-30 -5 Z'
    : 'M-8 -8.6 Q-3 -12 0 -9.4 Q3 -12 6 -9.4 Q9 -11 12 -8.6 Z M-12 -8 Q-18 -11 -22 -7.6 Q-26 -10 -30 -6.6 Q-34 -8 -41 -4 L-30 -5 Z';
  const legs = all(
    line('M10 -3 L13 0 M8 -3 L5 0', C.ink, 2.8), line('M10 -3 L13 0 M8 -3 L5 0', col, 1.4),
    o.noLeg ? line('M-6 -3 l-1 1', C.ink, 1.2) : all(line('M-6 -3 L-9 0', C.ink, 2.8), line('M-6 -3 L-9 0', o.newLeg ? '#f0b7a0' : col, 1.4)),
    line('M-4 -3 L-1 0', C.ink, 2.8), line('M-4 -3 L-1 0', col, 1.4),
  );
  return all(
    legs,
    o.crest ? path(crestFill, col, null) : '', o.crest ? line(crest, o.crestHL ? HL : C.ink, o.crestHL ? 1.8 : 0.9) : '',
    path('M-10 -7.6 C-22 -8 -32 -6.4 -42 -3.6 C-32 -2.4 -22 -2.2 -10 -2.6 Z', col, C.ink, 1),
    path('M-12 -5 C-12 -9 0 -9.4 12 -8.4 C16 -8 18 -7.6 19 -7 L19 -3 C14 -2.4 4 -2 -6 -2 C-10 -2 -12 -3 -12 -5 Z', col, C.ink, 1.1),
    o.belly ? path('M-10 -3 C0 -2.4 10 -2.8 18 -3.4 L18.6 -2.8 C10 -2 0 -1.8 -8 -2 Z', o.belly, null) : '',
    o.bellySpots ? line('M-6 -2.4 l0 0.1 M-1 -2.3 l0 0.1 M4 -2.4 l0 0.1 M9 -2.6 l0 0.1 M14 -2.8 l0 0.1', o.bellySpots, 1.2) : '',
    o.spots ? all(...[[-8, -6], [-3, -7], [2, -6], [7, -7], [12, -6], [-16, -5.6], [-24, -5], [-32, -4]].map(([x, y]) => circle(x!, y!, 0.8, o.spots!, null))) : '',
    o.blotch ? all(...[[-7, -6.4, 2.2], [0, -7, 1.8], [7, -6.2, 2], [-18, -5.6, 1.8], [-28, -4.6, 1.5]].map(([x, y, r]) => circle(x!, y!, r!, o.blotch!, null))) : '',
    path('M14 -8.4 C18 -9.6 23 -9 25 -6.4 C25.6 -5.4 25 -4 23 -3.4 C20 -2.8 16 -2.8 14 -3 Z', col, C.ink, 1),
    o.blotch ? circle(18, -7.4, 1.6, o.blotch, null) : '',
    o.gills ? all(...[-1, 0, 1].map((i) => rot(14, -8, -70 + i * 28, 1, line('M0 0 L9 0', o.gills!, 1.6), line('M2 0 l1 -1.6 M4 0 l1 -1.6 M6 0 l1 -1.6 M2 0 l1 1.6 M4 0 l1 1.6 M6 0 l1 1.6', o.gills!, 0.8)))) : '',
    circle(21, -7, 1, o.gills ? BLACK : '#e9c44a', C.ink, 0.4), circle(21.2, -7, 0.4, C.ink, null),
    line('M25 -5 C22 -4.4 20 -4.4 18.6 -4.8', C.ink, 0.6),
  );
};
const STORRE: Newt = { col: '#3f3a34', belly: ORANGE, bellySpots: BLACK, crest: 'high', spots: '#24221f' };
const MINDRE: Newt = { col: '#a98a5e', belly: '#f0a24a', bellySpots: BLACK, crest: 'low', spots: '#4e3a26' };
const ELD: Newt = { col: BLACK, blotch: YEL };
const AXOLOTL: Newt = { col: '#f0b7c0', gills: '#e0607a' };
const SALAMANDER: Newt = { col: '#7f6a4e', belly: '#d9b07a', spots: '#3e2c1c' };

// ── Small scenes used more than once ─────────────────────────────────
const pondEdge = (y = 70) => all(rect(4, y, 112, 112 - y, POND, 0, null), line(`M4 ${y} L116 ${y}`, C.ink, 0.8), reed(12, y), reed(18, y - 2, 18), reed(104, y, 20));
const lily = (x: number, y: number, r = 12) => path(`M${x} ${y} L${x + r} ${y - 2} A${r} ${f1(r * 0.35)} 0 1 1 ${x + r} ${y + 2} Z`, '#5f9e48', C.ink, 1);

export const REPTILE_MOTIFS: Record<string, Svg> = {
  // ── 2741 Ormar och ödlor ──
  'krald.orm': all(bg('#e8efd8'), field(4, GRASS), ...[[16, 20], [96, 24], [30, 96], [100, 98]].map(([x, y]) => line(`M${x} ${y} l2 -5 M${x! + 4} ${y} l-1 -6`, GRASS2, 1.2)), snake(10, 104, 60, { ...GENERIC_SNAKE, w: 8, amp: 10, tongue: true })),
  'krald.ödla': all(bg('#e8efd8'), field(4, GRASS), slab(60, 62, 48, 30), at(64, 60, 1.2, lizard(GENERIC_LIZARD))),
  'krald.kräldjur': all(bg('#eef1e6'), snake(10, 56, 30, { ...GENERIC_SNAKE, w: 5, amp: 4 }), at(88, 30, 0.55, lizard(GENERIC_LIZARD)), at(34, 80, 0.75, tortoise()), at(88, 76, 0.35, crocTop()), bracket(10, 110, 102), line('M60 102 L60 108', HL, 2.2)),
  'krald.sicksackmönster': all(bg('#eef1e6'), rect(14, 30, 92, 40, '#a9a59a', 8, C.ink, 1.4), line('M18 50 L26 38 L34 62 L42 38 L50 62 L58 38 L66 62 L74 38 L82 62 L90 38 L98 62 L102 50', BLACK, 5), rect(10, 26, 100, 48, 'none', 10, HL, 2.4), snake(30, 90, 92, { ...HUGGORM, w: 5, amp: 4 })),
  'krald.huggorm': all(bg('#e9e4cf'), field(4, '#c9c08a'), slab(56, 62, 50, 28), snake(12, 98, 60, { ...HUGGORM, w: 9, amp: 9 })),
  'krald.giftorm': all(bg('#efe9df'), g('translate(0 0)', path('M30 104 C20 104 16 96 26 92 C40 88 70 92 74 84 C78 76 64 70 62 58 C60 48 66 40 74 38', 'none', C.ink, 10), path('M30 104 C20 104 16 96 26 92 C40 88 70 92 74 84 C78 76 64 70 62 58 C60 48 66 40 74 38', 'none', '#8f8a6a', 8)), path('M70 30 C76 26 90 28 92 36 L80 40 L92 44 C90 50 76 50 72 46 Z', '#8f8a6a', C.ink, 1.2), path('M80 40 L92 36 L92 44 Z', '#e88a8a', null), path('M86 37 L87.5 43 L89 37.5 Z M82 38.5 L83 42 L84 38.5 Z', WHITE, C.ink, 0.6), circle(78, 33, 1.6, '#e9c44a', C.ink, 0.5), path('M87.5 46 C86 49 86 51 87.5 52 C89 51 89 49 87.5 46 Z', '#7bd04a', C.ink, 0.7), ring(86, 42, 12)),
  'krald.ormbett': all(bg('#efe9df'), field(80, GRASS), path('M30 4 L54 4 L56 70 C56 80 62 86 74 88 C84 90 86 100 78 102 L38 102 C30 102 28 92 30 80 Z', C.skin, C.ink, 1.3), path('M30 4 L54 4 L55 40 L30 40 Z', C.denim, C.ink, 1.2), ellipse(52, 82, 12, 8, '#f0a08a', null), circle(48, 80, 1.6, RED, null), circle(55, 80, 1.6, RED, null), ring(51.5, 80, 8), snake(70, 112, 104, { ...HUGGORM, w: 4, amp: 2, waves: 1, phase: Math.PI }), speed(66, 96, 8, 2, 4)),
  'krald.snok': all(bg(), sea(40), snake(10, 98, 70, { ...SNOK, w: 9, amp: 7 }), line('M6 74 q4 -2 8 0 M100 66 q4 -2 8 0', WHITE, 1.2)),
  'krald.hasselsnok': all(bg('#efe6d6'), field(4, '#c8b27a'), ...[[18, 30], [98, 22], [24, 96], [96, 100]].map(([x, y]) => all(line(`M${x} ${y} l-3 -6 M${x} ${y} l0 -7 M${x} ${y} l3 -6`, '#8a6a9a', 1.1))), snake(12, 100, 60, { ...HASSEL, w: 8, amp: 9 })),
  'krald.sandödla': all(bg(SAND), ...[[20, 24], [92, 30], [30, 96], [96, 92]].map(([x, y]) => circle(x!, y!, 1.2, SAND2, null)), at(62, 60, 1.35, lizard(SANDODLA))),
  'krald.skogsödla': all(bg('#d8e6c4'), field(4, MOSS), ...[[18, 22], [100, 28], [24, 100], [98, 96]].map(([x, y]) => line(`M${x} ${y} l3 -4 M${x! + 3} ${y} l-2 -5`, '#4f7a35', 1.2)), slab(60, 62, 44, 26, '#b0a890'), at(62, 60, 1.05, lizard(SKOGSODLA))),
  'krald.kopparödla': all(bg('#d8e6c4'), field(4, MOSS), ...range(5).map((i) => leafAt(14 + i * 22, 98 - (i % 2) * 8, -20 + i * 15, 0.5, '#b8862e')), snake(18, 96, 56, { ...KOPPAR, w: 7 })),
  'krald.benlös': all(bg('#eef1e6'), snake(14, 100, 38, { ...KOPPAR, w: 7 }), oval(57, 38, 46, 13), greyPane(56, 58, 0.48, bg(), at(64, 60, 1.3, lizard(GENERIC_LIZARD)))),
  'krald.ringla-sig': all(bg('#e9e4cf'), field(4, '#c9c08a'), slab(60, 62, 46, 32), coil(60, 60, 26, { ...HUGGORM, w: 7, tongue: true }), arrow(98, 40, 96, 72, HL, 2.4)),
  'krald.väsa': all(bg('#efe9df'), field(84, GRASS), path('M10 104 C30 106 40 96 38 86 C36 74 32 64 40 56', 'none', C.ink, 9), path('M10 104 C30 106 40 96 38 86 C36 74 32 64 40 56', 'none', '#8f8a6a', 7), path('M36 52 C40 46 52 46 54 52 L46 55 L54 58 C52 62 40 62 36 58 Z', '#8f8a6a', C.ink, 1.1), path('M46 55 L54 52 L54 58 Z', '#e88a8a', null), line('M54 55 L60 55 L63 53 M60 55 L63 57', RED, 1), circle(42, 51, 1.3, '#e9c44a', C.ink, 0.5), line('M66 46 q4 3 0 6 q-4 3 0 6 M72 42 q5 5 0 10 q-5 5 0 10 M78 38 q6 7 0 14 q-6 7 0 14', C.grey, 1.4), atL(104, 96, 0.9, path('M0 0 L-2 -12 C-2 -20 6 -22 14 -20 L22 -20 C26 -24 30 -22 30 -18 C30 -14 26 -12 22 -12 L16 0 Z', '#c49a6c', C.ink, 1.1), circle(24, -18, 0.9, C.ink, null))),
  'krald.tappa-svansen': all(bg('#e8efd8'), field(4, GRASS), at(78, 46, 1.1, lizard({ ...GENERIC_LIZARD, stub: true })), speed(48, 42, 10, 3, 4), path('M44 84 C34 80 26 88 16 82 C24 92 34 88 44 88 Z', '#9c8a5a', C.ink, 1), line('M18 74 q-3 3 0 6 M26 72 q-3 3 0 6 M34 74 q-3 3 0 6', C.grey, 1.2), ring(30, 85, 18)),

  // ── 2742 Sköldpaddor ──
  'krald.sköldpadda': all(bg(), field(84, GRASS), at(58, 96, 1.7, tortoise())),
  'krald.ryggsköld': all(bg(), field(84, GRASS), at(58, 96, 1.7, tortoise({ outline: true }))),
  'krald.dra-in-huvudet': all(bg(), field(70, GRASS), at(28, 80, 0.9, tortoise()), arrow(52, 64, 66, 64, HL, 2.6), at(90, 80, 0.9, tortoise({ headIn: true })), ring(94, 66, 9)),
  'krald.landsköldpadda': all(bg('#f0e6c8'), field(80, '#c9c08a'), bush(100, 82, 0.8, '#8aa84e'), at(52, 98, 1.6, tortoise({ mouthLeaf: true }))),
  'krald.långlivad': all(bg('#eef1e6'), at(20, 48, 0.5, tortoise()), rect(36, 34, 76, 12, HL, 3, C.ink, 1.1), line(range(7).map((i) => `M${46 + i * 10} 34 l0 12`).join(' '), C.white, 0.9), grey(at(20, 92, 1, path('M-12 0 C-14 -10 2 -14 10 -8 C14 -6 16 -2 12 0 Z', '#9aa0a7', C.ink, 1.2), circle(10, -7, 0.9, C.ink, null), line('M-12 -2 C-20 -2 -24 -6 -26 -10', C.ink, 1)), rect(36, 78, 12, 12, '#9aa0a7', 3, C.ink, 1.1))),
  'krald.husdjur': all(bg('#f3e9d8'), rect(4, 84, 112, 28, '#c9a27a', 0, null), line('M4 84 L116 84', C.ink, 1), at(24, 102, 1, path('M-12 0 L-12 -14 C-12 -20 -4 -22 2 -20 L8 -26 L10 -18 C14 -16 14 -10 10 -6 L10 0 M-12 -8 L-20 -14', '#c49a6c', C.ink, 1.2), circle(4, -18, 0.9, C.ink, null)), kid(52, 102, 1.8, C.green), at(80, 102, 1, path('M-10 0 C-12 -12 -2 -16 6 -12 L8 -20 L11 -14 L14 -20 L15 -12 C18 -8 16 0 10 0 Z', '#8d949c', C.ink, 1.2), line('M-10 -4 C-16 -6 -18 -14 -14 -18', C.ink, 1.4), circle(10, -11, 0.8, C.ink, null)), at(102, 106, 0.55, tortoise())),
  'krald.havssköldpadda': all(under(WATER2), rect(4, 96, 112, 16, SAND, 0, null), ...[[20, 96], [96, 96]].map(([x, y]) => path(`M${x} ${y} C${x! - 3} ${y! - 10} ${x! + 3} ${y! - 16} ${x} ${y! - 24}`, 'none', '#4f9a5a', 2)), at(58, 50, 1.25, seaTurtle()), bubbles(96, 30)),
  'krald.sjögräs': all(under(WATER), rect(4, 96, 112, 16, SAND, 0, null), ...range(11).map((i) => path(`M${12 + i * 9} 98 C${8 + i * 9} ${80 - (i % 3) * 6} ${16 + i * 9} ${62 - (i % 2) * 8} ${10 + i * 9} ${46 - (i % 3) * 6} C${18 + i * 9} ${62 - (i % 2) * 8} ${12 + i * 9} ${80 - (i % 3) * 6} ${15 + i * 9} 98 Z`, i % 2 ? '#4f9a5a' : '#6fb85a', C.ink, 0.8)), bubbles(100, 26)),
  'krald.lägga-ägg': all(bg(NIGHT), moon(98, 18), rect(4, 66, 112, 46, SAND, 0, null), line('M4 66 L116 66', SAND2, 1), path('M24 96 C24 82 64 82 64 96 Z', SAND2, C.ink, 1), ...[[38, 92], [44, 94], [50, 92], [42, 89], [47, 89]].map(([x, y]) => egg(x!, y!, 0.6, WHITE)), oval(44, 92, 13, 7), at(78, 82, 0.95, tortoise({ shell: '#6b5a32', skin: '#8a9468', low: true }))),
  'krald.nykläckt': all(bg(SKY), sea(30, WATER2), rect(4, 50, 112, 62, SAND, 0, null), line('M4 50 L116 50', '#cfe6f7', 2), ...[[30, 96], [56, 100], [84, 94]].map(([x, y]) => all(path(`M${x! - 6} ${y} C${x! - 6} ${y! - 6} ${x! + 6} ${y! - 6} ${x! + 6} ${y} Z`, '#f3ecdc', C.ink, 0.8), line(`M${x! - 6} ${y} l2 -3 l2 2 l2 -3 l2 3 l2 -2`, C.ink, 0.7))), hatchling(32, 74, -95), hatchling(58, 64, -85), hatchling(80, 74, -100), hatchling(98, 60, -80), line('M32 84 l0 4 M58 74 l0 6 M80 84 l0 4', C.grey, 1)),

  // ── 2743 Krokodildjur ──
  'krald.krokodil': all(bg('#c9b98a'), rect(4, 4, 112, 52, WATER, 3, null), line('M4 56 L116 56', C.ink, 0.8), at(62, 72, 0.85, crocTop({ snout: 'V' })), oval(98, 72, 12, 8)),
  'krald.alligator': all(bg('#6f8f4a'), rect(4, 60, 112, 52, '#5c8a7a', 0, null), line('M4 60 L116 60', C.ink, 0.8), ...[[14, 56], [100, 54]].map(([x, y]) => reed(x!, y!, 30)), at(62, 78, 0.85, crocTop({ snout: 'U', col: '#3f4a32' })), oval(94, 78, 10, 8)),
  'krald.kajman': all(bg('#8fb07a'), rect(4, 4, 112, 108, '#6f9a8a', 3, null), line(range(4).map((i) => `M${12 + i * 28} ${20 + (i % 2) * 70} q4 -2 8 0`).join(' '), WHITE, 1), at(62, 60, 0.85, crocTop({ snout: 'short', col: '#7a7a4a', ridge: true }))),
  'krald.gavial': all(bg('#b9a77a'), rect(4, 4, 112, 108, '#8aa0a0', 3, null), at(60, 62, 0.8, crocTop({ snout: 'thin', col: '#6a7a5a' })), oval(98, 62, 10, 6), path('M100 40 C104 36 112 38 112 42 C112 46 104 48 100 44 L96 46 L96 38 Z', '#c9d2da', C.ink, 0.9)),
  'krald.krokodildjur': all(bg('#eef1e6'), ...(['V', 'U', 'thin', 'short'] as const).map((sn, i) => at(i % 2 ? 89 : 33, 34 + Math.floor(i / 2) * 40, 0.42, g('translate(0 0)', crocTop({ snout: sn, col: ['#5f7a3e', '#3f4a32', '#6a7a5a', '#7a7a4a'][i]!, ridge: sn === 'short' })))), bracket(8, 112, 104)),
  'krald.pansar.2': all(bg('#c9b98a'), rect(14, 24, 92, 70, '#5f7a3e', 10, C.ink, 1.4), ...range(4).flatMap((r) => range(6).map((c) => path(`M${20 + c * 14} ${30 + r * 16} l12 0 l-1 12 l-10 0 Z`, '#4e6632', C.ink, 1))), ...range(4).flatMap((r) => range(6).map((c) => circle(26 + c * 14, 36 + r * 16, 1.8, '#3f5428', null))), rect(10, 20, 100, 78, 'none', 12, HL, 2.4)),
  'krald.nos': all(bg('#efe6d6'), field(92, GRASS), at(50, 104, 1.6, path('M-24 0 L-24 -26 C-24 -40 -6 -46 8 -40 L18 -34 C26 -32 34 -30 36 -24 C38 -18 32 -14 24 -14 L12 -10 L12 0 Z', '#c49a6c', C.ink, 1.2), path('M-14 -40 C-20 -50 -12 -56 -6 -46 Z', '#a87a4c', C.ink, 1.1), circle(8, -32, 1.6, C.ink, null), ellipse(35, -26, 3, 2.4, C.dark, C.ink, 0.6), line('M24 -16 C28 -18 32 -18 34 -20', C.ink, 0.9)), oval(96, 66, 18, 13)),
  'krald.ligga-på-lur': all(bg('#e9d9a8'), rect(4, 56, 112, 56, '#7aa7a0', 0, null), line('M4 56 L116 56', C.ink, 0.8), at(30, 76, 1, lurk()), path('M80 56 L84 46 L88 56', 'none', '#a07a4c', 2), at(90, 54, 1, path('M-14 -16 C-10 -22 6 -22 10 -16 L14 -4 L12 -2 L6 -12 C2 -10 -6 -10 -10 -12 L-12 0 L-14 0 Z', '#c48a4a', C.ink, 1.1), line('M-12 -12 L-10 2 M8 -12 L10 2', C.ink, 1.4)), line('M94 56 q2 -1 4 0', WHITE, 1), oval(36, 74, 22, 8)),
  'krald.träsk': all(bg('#cfdcc0'), rect(4, 62, 112, 50, '#6f8a5a', 0, null), ...range(5).map((i) => line(`M${10 + i * 24} ${74 + (i % 2) * 14} q5 -2 10 0`, '#9ab48a', 1.2)), ...[[24, 70], [78, 66], [104, 72]].map(([x, y]) => all(rect(x! - 3, y! - 50, 6, 50, '#6d5a3c', 1, C.ink, 1), path(`M${x! - 3} ${y} l-5 4 M${x! + 3} ${y} l5 4`, 'none', '#6d5a3c', 2), path(`M${x! - 16} ${y! - 46} C${x! - 16} ${y! - 62} ${x! + 16} ${y! - 62} ${x! + 16} ${y! - 46} Z`, '#4f7a3a', C.ink, 1), line(`M${x! - 10} ${y! - 48} l0 14 M${x! + 8} ${y! - 48} l0 18`, '#9ab48a', 1.2))), reed(50, 70, 18), reed(56, 72, 14), at(60, 94, 0.5, lurk('#3f4a32'))),
  'krald.gapa': all(bg('#e9d9a8'), field(90, '#d9c088'), at(64, 92, 0.9, crocSide({ open: true })), sun(100, 20)),
  'krald.vakta': all(bg('#e9d9a8'), field(80, '#c9b07a'), path('M76 96 C76 80 112 80 112 96 Z', '#8a7a4a', C.ink, 1.1), ...[[86, 90], [94, 88], [102, 90], [90, 94], [98, 94]].map(([x, y]) => egg(x!, y!, 0.55, WHITE)), at(42, 98, 0.55, crocSide()), oval(94, 90, 20, 10)),
  'krald.dinosaurie': all(bg('#f3e2b8'), field(92, '#c9b07a'), path('M36 34 L44 4 L52 34 Z', '#8a7a6a', C.ink, 1), palm(100, 94, 0.9), at(52, 92, 1.4, path('M-26 -8 C-26 -24 10 -26 14 -14 C18 -24 22 -38 24 -46 C26 -50 32 -50 32 -46 C30 -38 26 -22 22 -8 C20 0 -20 2 -26 -8 Z M-26 -12 C-34 -12 -42 -8 -48 -2 C-40 -6 -32 -6 -24 -6 Z', '#7a9a5a', C.ink, 1.2), rect(-18, -4, 6, 8, '#7a9a5a', 2, C.ink, 1), rect(6, -4, 6, 8, '#7a9a5a', 2, C.ink, 1), circle(30, -46, 0.9, C.ink, null))),

  // ── 2744 Grodor och paddor ──
  'krald.groda': all(bg(), pondEdge(60), lily(52, 86, 24), at(56, 86, 1.6, frog(GRODA))),
  'krald.padda': all(bg('#e9e1cf'), field(70, '#c9b48a'), ...[[18, 94], [100, 100]].map(([x, y]) => ellipse(x!, y!, 4, 2, '#a99a7a', null)), at(54, 98, 1.9, frog(PADDA))),
  'krald.groddjur': all(bg('#eef1e6'), at(24, 54, 0.95, frog(GRODA)), at(74, 54, 0.95, frog(PADDA)), at(62, 92, 0.8, newt(SALAMANDER)), bracket(8, 112, 104)),
  'krald.bakben': all(bg(), pondEdge(84), at(70, 54, 1.4, frogJump({ ...GRODA, legHL: true }))),
  'krald.kväka': all(bg(NIGHT), moon(98, 18), pondEdge(68), lily(40, 92, 24), at(44, 92, 1.5, frog({ ...GRODA, sac: true })), line('M78 70 q4 3 0 6 q-4 3 0 6 M84 66 q6 5 0 10 q-6 5 0 10 M90 62 q7 7 0 14 q-7 7 0 14', '#e9e3c4', 1.4)),
  'krald.vårtig': all(bg('#e9e1cf'), at(48, 54, 1.7, frog({ ...PADDA, warts: '#6a4a2c' })), oval(48, 38, 28, 18), greyPane(56, 58, 0.48, bg(), at(56, 86, 1.8, frog({ col: '#8a8a4a', belly: '#e9e3c4' })))),
  'krald.lövgroda': all(bg('#d6ecc8'), line('M30 112 C34 80 40 50 36 4', '#6f8f3a', 3), leafAt(36, 50, -30, 1.4), leafAt(36, 80, 200, 1.1), at(58, 60, 1.6, frog(LOVGRODA))),
  'krald.pilgiftsgroda': all(bg('#2f5a3a'), leafAt(10, 86, -10, 3.1, '#3f8a4a'), leafAt(70, 30, 160, 1.4, '#4f9a4a'), at(54, 82, 1.6, frog(PILGIFT))),

  // ── 2745 Salamandrar ──
  'krald.salamander': all(bg('#d8e6c4'), field(70, MOSS), rockAt(100, 74, 26, 16), at(66, 90, 1.4, newt(SALAMANDER))),
  'krald.vattensalamander': all(under(POND), rect(4, 96, 112, 16, MUD, 0, null), ...[[14, 96], [104, 96], [92, 96]].map(([x, y]) => path(`M${x} ${y} C${x! - 4} ${y! - 14} ${x! + 4} ${y! - 24} ${x} ${y! - 40}`, 'none', '#4f9a5a', 2)), at(68, 58, 1.4, newt(MINDRE)), bubbles(92, 40)),
  'krald.större-vattensalamander': all(under(POND), rect(4, 96, 112, 16, MUD, 0, null), at(68, 66, 1.45, newt(STORRE))),
  'krald.mindre-vattensalamander': all(under('#a8d0c0'), rect(4, 96, 112, 16, '#8a7a5a', 0, null), at(68, 66, 1.45, newt(MINDRE))),
  'krald.ryggkam': all(under(POND), at(68, 72, 1.45, newt({ ...STORRE, crestHL: true }))),
  'krald.eldsalamander': all(bg('#cfd9b8'), field(60, '#6a5a3a'), ...range(6).map((i) => leafAt(10 + i * 19, 100 - (i % 2) * 30, i * 50, 0.4, '#b8862e')), at(68, 86, 1.45, newt(ELD))),
  'krald.axolotl': all(rect(4, 4, 112, 108, '#cfe8f2', 3, null), rect(8, 20, 104, 86, '#a8d8ec', 2, C.ink, 1.4), rect(8, 96, 104, 10, '#c9b48a', 0, null), path('M20 96 C16 84 24 76 20 64 M100 96 C104 84 96 78 100 68', 'none', '#4f9a5a', 2), at(68, 76, 1.35, newt(AXOLOTL)), bubbles(94, 48)),
  'krald.hudandning': all(under(POND), rect(4, 96, 112, 16, MUD, 0, null), at(68, 80, 1.4, newt(MINDRE)), ...[[30, 40], [50, 36], [70, 38], [90, 42]].map(([x, y]) => all(circle(x!, y! - 12, 3, '#d6ecf9', C.ink, 0.7), arrow(x!, y! - 7, x! + (60 - x!) * 0.15, y! + 12, HL, 2)))),
  'krald.växa-ut-igen': all(bg('#eef1e6'), at(58, 42, 1.15, newt({ ...SALAMANDER, noLeg: true })), ring(50, 40, 6, C.grey), arrow(100, 46, 100, 70, HL, 2.6), at(58, 96, 1.15, newt({ ...SALAMANDER, newLeg: true })), ring(50, 94, 6)),
  'krald.gömma-sig': all(bg(), field(84, GRASS), tree(74, 96, 2.4), kid(82, 104, 1.5, C.orange, 'M-3.2 -16 L-6 -12 M3.2 -16 L2 -10'), kid(24, 104, 1.5, C.green, 'M-3.2 -16 L-1 -21 M3.2 -16 L1 -21')),
  'krald.stubbe': all(bg('#d8e6c4'), field(70, MOSS), pine(16, 74, 1.4), pine(104, 72, 1.2), at(60, 96, 2.2, stump(0, 0))),

  // ── 2746 Växelvarm anpassning ──
  'krald.sola-sig': all(bg('#f3e7c0'), sun(96, 20, 9), line('M80 34 L64 48 M90 40 L80 54 M74 28 L52 40', C.gold, 1.4), field(84, GRASS), rockAt(52, 92, 80, 30), at(52, 70, 1.05, lizard({ ...SANDODLA, eyesShut: true }))),
  'krald.solvarm': all(bg('#f3e7c0'), sun(28, 20, 8), field(80, GRASS), rockAt(34, 92, 56, 32, '#c9a080'), heat(24, 54, 3), greyPane(62, 58, 0.44, bg(), field(80, GRASS), rect(4, 4, 112, 76, '#8d949c', 0, null), rockAt(60, 92, 70, 34))),
  'krald.söka-skugga': all(bg('#f7e1a8'), sun(20, 18, 8), rect(4, 80, 112, 32, SAND, 0, null), heat(12, 70, 3), bush(86, 82, 1.4, '#7a9a4a'), ellipse(86, 90, 22, 6, 'rgba(60,60,40,0.35)', null), at(50, 94, 0.75, lizard(GENERIC_LIZARD)), arrow(66, 94, 80, 92, HL, 2.4)),
  'krald.trög': all(bg('#e2ecf2'), flake(18, 18), flake(34, 28), flake(100, 16), field(80, '#c8d0c0'), thermo(104, 68, 6, '#5aa7d8'), at(52, 92, 1.2, lizard({ ...GENERIC_LIZARD, eyesShut: true })), line('M30 100 l4 0', C.grey, 1.2), greyPane(56, 2, 0.4, bg(), field(80, GRASS), at(70, 92, 1.4, lizard(GENERIC_LIZARD)), speed(30, 86, 14, 3, 5))),
  'krald.gå-i-dvala': all(bg('#e2ecf2'), rect(4, 30, 112, 82, SOIL, 0, null), rect(4, 26, 112, 8, SNOW, 2, C.ink, 0.8), flake(20, 14), flake(60, 10), flake(96, 16), rect(4, 34, 112, 14, '#b9c9d6', 0, null), ...[[26, 60], [90, 62]].map(([x, y]) => rockAt(x!, y!, 26, 12, ROCK)), path('M28 98 C28 74 94 74 94 98 Z', SOIL2, C.ink, 1.2), coil(48, 90, 11, { ...HUGGORM, w: 4 }), coil(74, 90, 10, { ...HUGGORM, w: 4 }), oval(61, 89, 36, 13)),
  'krald.frostfri': all(bg('#e2ecf2'), rect(4, 20, 112, 92, SOIL, 0, null), rect(4, 20, 112, 30, '#b9d6ea', 0, null), ...range(6).map((i) => flake(14 + i * 18, 34 + (i % 2) * 6, 3, '#2f7ab0')), line('M4 50 L116 50', C.ink, 1, '3 2'), rect(10, 56, 100, 50, 'none', 4, HL, 2.4), at(60, 92, 1.1, frog(GRODA))),
  'krald.övervintringsplats': all(bg('#e2ecf2'), rect(4, 40, 112, 72, SOIL, 0, null), rect(4, 36, 112, 8, SNOW, 2, C.ink, 0.8), flake(30, 18), flake(84, 24), stump(84, 40, 1.2), rockAt(30, 44, 40, 18), path('M20 96 C20 70 70 70 70 96 Z', SOIL2, C.ink, 1.2), coil(36, 88, 9, { ...HUGGORM, w: 3.6 }), coil(54, 88, 8, { ...SNOK, w: 3.6 }), rect(14, 66, 62, 36, 'none', 6, HL, 2.4), line('M88 52 C90 62 86 72 90 80', SOIL2, 2)),
  'krald.gyttja': all(bg(SKY), rect(4, 30, 112, 82, WATER, 0, null), line('M4 30 L116 30', C.ink, 0.8), path('M4 84 C30 78 60 82 90 78 C100 77 110 79 116 80 L116 112 L4 112 Z', MUD, C.ink, 1), ...range(7).map((i) => circle(14 + i * 15, 100 + (i % 2) * 6, 1.4, '#3f3226', null)), at(62, 92, 0.9, frog({ ...GRODA, col: '#6a6a3a' })), oval(60, 96, 50, 13)),

  // ── 2747 Fortplantning i vatten och på land ──
  'krald.yttre-befruktning': all(under(POND), at(44, 54, 1.25, frog(GRODA)), at(48, 44, 1.05, frog({ ...GRODA, col: '#6a6a3a' })), ...range(12).map((i) => circle(80 + (i % 4) * 7, 66 + Math.floor(i / 4) * 7, 2.6, '#f3efe0', C.ink, 0.6)), ...range(12).map((i) => circle(80 + (i % 4) * 7, 66 + Math.floor(i / 4) * 7, 0.9, BLACK, null)), ...range(6).map((i) => line(`M${70 + i * 6} ${58 + (i % 2) * 4} q2 -2 4 0`, WHITE, 0.9)), oval(90, 72, 20, 15)),
  'krald.inre-befruktning': all(bg('#efe9df'), field(84, '#c9b07a'), at(66, 62, 1.3, lizard(SANDODLA)), ellipse(61, 62, 10, 5, '#f6e9e0', C.ink, 0.8), egg(57, 62, 0.55), egg(65, 62, 0.55), oval(61, 62, 13, 7), greyPane(56, 72, 0.4, under(POND), ...range(9).map((i) => circle(40 + (i % 3) * 14, 50 + Math.floor(i / 3) * 14, 5, '#f3efe0', C.ink, 0.8)))),
  'krald.grodrom': all(under(POND), ...range(30).map((i) => { const a = i * 2.4, r = 4 + (i % 6) * 4.4; const x = f1(60 + Math.cos(a) * r * 1.3), y = f1(60 + Math.sin(a) * r); return all(circle(x, y, 4.4, '#eef3ea', C.ink, 0.6), circle(x, y, 1.6, BLACK, null)); }), path('M14 112 C14 90 20 80 16 66 M104 112 C102 96 108 86 104 74', 'none', '#4f9a5a', 2)),
  'krald.grodyngel': all(under(POND), rect(4, 98, 112, 14, MUD, 0, null), ...[[30, 36, 10], [70, 30, -8], [50, 62, 4], [86, 70, -12], [26, 80, 14]].map(([x, y, a]) => rot(x!, y!, a!, 1.2, path('M-4 0 C-14 -4 -22 0 -26 -3 C-22 2 -14 4 -4 2 Z', '#4e4a3a', C.ink, 0.8), ellipse(0, 0, 6.4, 5, '#4e4a3a', C.ink, 1), circle(3, -2, 0.9, '#e9c44a', null)))),
  'krald.läderartad': all(bg('#efe9df'), ellipse(46, 66, 22, 28, '#f3ecdc', C.ink, 1.4), path('M36 42 C42 50 50 50 56 42', 'none', '#cfc4a8', 1.4), thumb(46, 34, 1.4), oval(46, 48, 14, 8), greyPane(56, 58, 0.48, bg(), ellipse(60, 66, 20, 26, '#f3ecdc', C.ink, 1.4), line('M44 50 L52 58 L48 64 L58 70 L54 78', C.ink, 1.4))),
  'krald.levandefödande': all(bg('#e9e4cf'), field(4, '#c9c08a'), snake(10, 96, 40, { ...HUGGORM, w: 8, amp: 6 }), snake(14, 44, 76, { ...HUGGORM, w: 3, amp: 2, waves: 1 }), snake(28, 58, 92, { ...HUGGORM, w: 3, amp: 2, waves: 1, phase: 1 }), oval(37, 84, 30, 15), greyPane(66, 64, 0.4, bg('#e9e4cf'), field(4, '#c9c08a'), snake(10, 70, 40, { ...SNOK, w: 8, amp: 6 }), ...[[40, 80], [56, 84], [72, 80], [48, 92], [64, 92]].map(([x, y]) => egg(x!, y!, 1.4)))),
  'krald.kön': all(bg('#eef1e6'), egg(60, 24, 1.8), arrow(52, 36, 34, 54, HL, 2.4), arrow(68, 36, 86, 54, HL, 2.4), at(36, 92, 0.65, newt({ ...MINDRE, crest: 'high' })), at(94, 92, 0.65, newt({ ...MINDRE, crest: undefined })), circle(14, 66, 5, 'none', C.navy, 1.8), line('M17.5 62.5 L22 58 M18 58 L22 58 L22 62', C.navy, 1.8), circle(106, 64, 5, 'none', RED, 1.8), line('M106 69 L106 76 M103 73 L109 73', RED, 1.8)),
};
