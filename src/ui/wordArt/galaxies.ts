/**
 * Matematik & naturvetenskap → Astronomi & rymd → Galaxer & universum, 3641–3647 (0.53): the Milky Way, galaxy
 * shapes, star clusters and nebulae, the expansion of the universe, redshift, dark matter and the cosmic microwave
 * background.
 * Recurring signs: space is dark blue with small fixed stars; a spiral galaxy is a yellow core with two pale blue
 * arms. The part the word names is orange (ring, frame, outline or arrow) and grey copies show what the word is not.
 * Close words share one layout where only the marked part differs: centrum / spiralarm (the same galaxy, the core or
 * one arm ringed), the five galaxy shapes (one big galaxy in colour above a grey row of three other shapes),
 * öppen / klotformig stjärnhop (a big panel in colour beside a small grey panel of the other kind), nebulosa / mörk
 * nebulosa (the same cloud shape: glowing in colours, or black in front of stars and a red glow), and
 * blåförskjutning, drawn like rödförskjutning in wavesSound.ts but with the star coming closer and the lines moved
 * towards blue.
 * Digits, maths signs and ? only; no words, no brands and no agency logos.
 */
import { C, all, arrow, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { HL } from './people';
import { greyed } from './blindFix';
import { figure } from './figures';

// ── Palette and basics ───────────────────────────────────────────────
const SPACE = '#141c36';
const NIGHT = '#1f2c55';
const HILL = '#16213a';
const ARM = '#9fb6f2';
const ARM2 = '#e6edff';
const CORE = '#ffe9a8';
const CORE2 = '#f6c25a';
const NEB1 = '#e2558f';
const NEB2 = '#f29ab8';
const DM = '#7a4fc4';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const rot = (a: number, ...k: Svg[]) => g(`rotate(${a})`, ...k);
const op = (o: number, ...k: Svg[]) => `<g opacity="${o}">${k.join('')}</g>`;
const bg = (col: string = SPACE) => rect(4, 4, 112, 108, col, 3, null);
const ring = (x: number, y: number, rx: number, ry = rx, col: string = HL) => ellipse(x, y, rx, ry, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number) => rect(x, y, w, h, 'none', 4, HL, 2.6);
const panel = (x: number, y: number, w: number, h: number, col: string = SPACE) => rect(x, y, w, h, col, 3, C.grey2, 1.2);
/** Digits / maths signs / ? only. */
const num = (s: string, x: number, y: number, size = 10, fill: string = C.ink) => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${size}" fill="${fill}" text-anchor="middle">${s}</text>`;
/** Deterministic scatter of small stars inside a box. */
const rng = (seed: number) => { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; };
const starDots = (n: number, seed: number, x0 = 6, y0 = 6, w = 108, h = 104, col = '#fff6d8', rmax = 1.1) => {
  const r = rng(seed);
  return all(...range(n).map(() => circle(f1(x0 + r() * w), f1(y0 + r() * h), f1(0.4 + r() * rmax), col, null)));
};
/** Soft round glow made of stacked transparent circles. */
const glow = (x: number, y: number, r: number, col: string, steps = 4, o = 0.28) => op(o, ...range(steps).map((i) => circle(x, y, f1(r * (1 - i / (steps + 1))), col, null)));
const hill = (col: string = HILL) => path('M4 96 C30 88 50 92 70 90 C90 88 104 92 116 90 L116 112 L4 112 Z', col, null);
const fir = (x: number, y: number, s = 1, col = '#0f1a2c') => at(x, y, s, path('M0 -22 L-6 -10 L-3 -10 L-8 0 L8 0 L3 -10 L6 -10 Z', col, null));

// ── Galaxies (centred on 0 0, about 70 px wide at s = 1) ──────────────
const ARM_A = 'M3 -3 C14 -9 26 -4 27 8 C28 22 14 31 0 30 C-14 29 -26 20 -29 6';
const BAR_A = 'M13 0 C24 2 29 14 20 24 C10 33 -8 33 -20 26 C-28 21 -32 12 -32 4';
type SpiralO = { bar?: boolean; armHL?: boolean; coreHL?: boolean };
/** Face-on spiral galaxy: faint disk, two arms (or two arms from a bar), bright core. */
const spiral = (x: number, y: number, s = 1, o: SpiralO = {}) => {
  const d = o.bar ? BAR_A : ARM_A;
  const arm = (hl: boolean) => all(hl ? line(d, HL, 12) : '', line(d, ARM, 7), line(d, ARM2, 2.4));
  return at(x, y, s, op(0.3, ellipse(0, 0, 36, 32, '#5f74c0', null)), arm(!!o.armHL), rot(180, arm(false)),
    ...[[20, -6], [27, 8], [14, 26], [-20, 6], [-27, -8], [-14, -26], [2, 30], [-2, -30]].map(([a, b]) => circle(a!, b!, 1.1, C.white, null)),
    o.bar ? rect(-15, -4, 30, 8, CORE2, 4, null) : '', o.bar ? rect(-13, -2.2, 26, 4.4, CORE, 2, null) : '',
    circle(0, 0, 9, CORE2, null), circle(0, 0, 5.5, CORE, null), circle(0, 0, 2.6, C.white, null),
    o.coreHL ? circle(0, 0, 12, 'none', HL, 2.6) : '');
};
/** Elliptical galaxy: smooth yellow-red oval, brightest in the middle. */
const elliptical = (x: number, y: number, s = 1) => at(x, y, s, ellipse(0, 0, 32, 23, '#c9784a', null), ellipse(0, 0, 25, 18, '#e39a5a', null), ellipse(0, 0, 17, 12, '#f3bf78', null), ellipse(0, 0, 9, 6.5, '#ffe2a8', null), ellipse(0, 0, 3.5, 2.6, C.white, null));
/** Lenticular galaxy: a tilted flat disk with a bright bulge and no arms. */
const lenticular = (x: number, y: number, s = 1) => at(x, y, s, rot(-12, ellipse(0, 0, 36, 11, '#b9a27a', null), ellipse(0, 0, 30, 8, '#dcc493', null), ellipse(0, 0, 13, 9, '#f3d9a0', null), ellipse(0, 0, 7, 5, '#fff0c8', null), ellipse(0, 0, 2.6, 2, C.white, null)));
/** Irregular galaxy: lopsided patches of blue stars with pink spots. */
const irregular = (x: number, y: number, s = 1) => at(x, y, s,
  ...[[-14, -6, 13, 9], [4, 2, 16, 10], [18, -10, 9, 7], [-4, 14, 10, 6], [24, 10, 6, 5]].map(([a, b, rx, ry]) => op(0.75, ellipse(a!, b!, rx!, ry!, '#8fb0f0', null))),
  ...[[-10, -4, 6, 4], [8, 4, 7, 5], [20, -10, 4, 3]].map(([a, b, rx, ry]) => ellipse(a!, b!, rx!, ry!, '#dfe8ff', null)),
  circle(-16, 2, 2.4, NEB2, null), circle(12, -4, 2, NEB2, null), circle(2, 12, 1.8, NEB2, null), starDots(10, 7, -26, -16, 52, 32, C.white, 0.8));
type Shape = 'spiral' | 'bar' | 'elliptical' | 'lenticular' | 'irregular';
const shape = (k: Shape, x: number, y: number, s = 1) => (k === 'spiral' ? spiral(x, y, s) : k === 'bar' ? spiral(x, y, s, { bar: true }) : k === 'elliptical' ? elliptical(x, y, s) : k === 'lenticular' ? lenticular(x, y, s) : irregular(x, y, s));
/** One galaxy shape big in colour, framed, above a grey row of three other shapes. */
const shapeCard = (main: Shape, others: [Shape, Shape, Shape], extra: Svg = '') => all(bg(), starDots(26, 3, 6, 6, 108, 70), shape(main, 60, 43, 0.92), extra, frame(10, 8, 100, 70),
  greyed(...others.map((k, i) => all(panel(8 + i * 36, 84, 32, 26), shape(k, 24 + i * 36, 97, 0.36)))));

// ── Stars, clouds and light ──────────────────────────────────────────
const bright = (x: number, y: number, r: number, col = '#fff6c8') => all(glow(x, y, r * 2.2, col, 3, 0.3), sparkle(x, y, r, col), circle(x, y, r * 0.35, C.white, null));
/** The cloud outline shared by nebulosa and mörk nebulosa. */
const CLOUD = 'M14 64 C10 44 26 30 42 36 C48 20 70 18 78 32 C92 26 108 38 104 54 C114 64 104 80 90 76 C84 90 62 92 54 82 C42 92 22 86 24 74 C12 74 10 68 14 64 Z';
const tv = (screen: Svg) => all(line('M48 22 L34 6 M72 22 L88 6', C.dark, 2), circle(34, 6, 2, C.dark, null), circle(88, 6, 2, C.dark, null), rect(14, 22, 92, 72, '#8a6a4a', 8, C.ink, 2), rect(22, 30, 62, 52, '#2a2a2a', 6, C.ink, 1.6), screen,
  circle(95, 42, 4, C.beige, C.ink, 1.2), circle(95, 56, 4, C.beige, C.ink, 1.2), line('M90 68 L100 68 M90 72 L100 72 M90 76 L100 76', C.ink, 1), rect(26, 94, 8, 8, '#6a4a2a', 1, C.ink, 1.2), rect(86, 94, 8, 8, '#6a4a2a', 1, C.ink, 1.2));
/** Noise of grey dots (myrornas krig) inside the box. */
const noise = (x0: number, y0: number, w: number, h: number, n = 260) => { const r = rng(11); const cols = ['#f4f4f4', '#bdbdbd', '#7a7a7a', '#e0e0e0']; return all(rect(x0, y0, w, h, '#9a9a9a', 4, null), ...range(n).map(() => rect(f1(x0 + r() * (w - 2)), f1(y0 + r() * (h - 2)), 1.8, 1.4, cols[Math.floor(r() * 4)]!, 0, null))); };
/** Light wave from left to right (sine). */
const wave = (x0: number, y: number, len: number, amp: number, lambda: number, col: string, sw = 2.6) => {
  const pts = range(Math.round(len) + 1).map((i) => `${f1(x0 + i)} ${f1(y - amp * Math.sin((i / lambda) * Math.PI * 2))}`);
  return line(`M${pts.join(' L')}`, col, sw);
};
const RAINBOW = ['#7b4fc4', '#3c6fd6', '#3fb0d6', '#4fbf6a', '#f2d24e', '#f39a3c', '#e2463a'];
const eye = (x: number, y: number, s = 1) => at(x, y, s, path('M-9 0 C-4 -7 4 -7 9 0 C4 7 -4 7 -9 0 Z', C.white, C.ink, 1.4), circle(0, 0, 3.4, '#3f6fb5', C.ink, 1), circle(0, 0, 1.4, C.ink, null));
/** A horn antenna on a stand (bakgrundsstrålning). */
const horn = (x: number, y: number, s = 1) => at(x, y, s, path('M-22 -14 L14 -4 L14 4 L-22 14 Z', '#d9d9d2', C.ink, 1.4), rect(14, -5, 8, 10, '#b9b9b2', 1, C.ink, 1.2), line('M0 6 L-6 22 M0 6 L8 22', C.dark, 2));

export const GALAX_MOTIFS: Record<string, Svg> = {
  // ── Vintergatan ────────────────────────────────────────────────────
  /** stjärnhimmel: a dark night full of stars over a hill with fir trees; a small person stands and looks up. */
  'galax.stjärnhimmel': all(bg(NIGHT), starDots(70, 5, 6, 6, 108, 84), ...[[20, 20, 3], [48, 12, 2.5], [86, 22, 3.4], [104, 46, 2.4], [30, 50, 2.4], [70, 40, 2.8], [58, 64, 2]].map(([x, y, r]) => bright(x!, y!, r!)),
    hill(), fir(14, 96, 1.2), fir(26, 98, 0.9), fir(104, 94, 1.3), at(0, 0, 1, figure({ x: 70, h: 0.42, top: C.orange }))),
  /** strimma: a dark room; through the narrow gap of a door that stands a little open, a thin, long streak of light runs across the floor. */
  'galax.strimma': all(bg('#24283a'), rect(4, 84, 112, 28, '#34343f', 0, null), rect(36, 18, 44, 66, '#5a4a3a', 2, C.ink, 1.6), circle(42, 54, 2.4, C.gold, null), rect(79, 18, 3, 66, '#fff2b0', 0, null),
    path('M79 84 L82 84 L28 110 L18 110 Z', 'rgba(255,236,150,0.9)', null), ring(52, 97, 40, 11)),
  /** galax: a big spiral galaxy in space; a round magnifier shows that it is made of many single stars; two other small galaxies far away. */
  'galax.galax': all(bg(), starDots(30, 13), spiral(50, 56, 0.95), elliptical(102, 98, 0.26), irregular(16, 18, 0.3),
    line('M70 46 L84 34', C.grey2, 1.4), circle(94, 28, 16, SPACE, C.grey2, 2), starDots(22, 17, 82, 16, 24, 24, '#fff6d8', 1.3), circle(94, 28, 16, 'none', HL, 2.6), ring(50, 56, 34, 30)),
  /** centrum: the spiral galaxy with its bright core ringed in orange. */
  'galax.centrum.2': all(bg(), starDots(30, 19), spiral(60, 58, 1.25, { coreHL: true })),
  /** spiralarm: the same spiral galaxy with one arm outlined in orange. */
  'galax.spiralarm': all(bg(), starDots(30, 19), spiral(60, 58, 1.25, { armHL: true })),
  // ── Galaxers former ────────────────────────────────────────────────
  /** spiralgalax: a spiral galaxy with two arms, in colour; below in grey a barred, an elliptical and an irregular galaxy. */
  'galax.spiralgalax': shapeCard('spiral', ['bar', 'elliptical', 'irregular']),
  /** stavspiralgalax: a barred spiral galaxy (straight bright bar through the core, arms from its ends), the bar ringed; below in grey a plain spiral, an elliptical and a lenticular galaxy. */
  'galax.stavspiralgalax': shapeCard('bar', ['spiral', 'elliptical', 'lenticular'], ring(60, 42, 20, 9)),
  /** elliptisk galax: a smooth yellow-red oval galaxy without arms; below in grey a spiral, a lenticular and an irregular galaxy. */
  'galax.elliptisk-galax': shapeCard('elliptical', ['spiral', 'lenticular', 'irregular']),
  /** linsformad galax: a tilted flat disk with a bright bulge and no arms; below in grey a spiral, an elliptical and an irregular galaxy. */
  'galax.linsformad-galax': shapeCard('lenticular', ['spiral', 'elliptical', 'irregular']),
  /** irreguljär galax: lopsided patches of blue stars without any shape; below in grey a spiral, an elliptical and a lenticular galaxy. */
  'galax.irreguljär-galax': shapeCard('irregular', ['spiral', 'elliptical', 'lenticular']),
  /** dvärggalax: a big grey spiral galaxy; beside it a small galaxy in colour on a dashed path around it, ringed. */
  'galax.dvärggalax': all(bg(), starDots(30, 23), greyed(spiral(54, 60, 0.95)),
    `<ellipse cx="54" cy="60" rx="48" ry="40" fill="none" stroke="${C.grey2}" stroke-width="1.2" stroke-dasharray="3 3"/>`, irregular(96, 34, 0.32), ring(96, 34, 12)),
  /** galaxhop: dozens of small galaxies of different shapes crowded together in one area of space, inside an orange frame. */
  'galax.galaxhop': all(bg(), starDots(16, 29), ...[[30, 30, 'elliptical', 0.3], [56, 24, 'spiral', 0.22], [84, 34, 'elliptical', 0.24], [40, 52, 'spiral', 0.2], [64, 50, 'elliptical', 0.42], [92, 60, 'lenticular', 0.22], [24, 70, 'lenticular', 0.2], [48, 80, 'elliptical', 0.22], [74, 80, 'spiral', 0.2], [98, 86, 'elliptical', 0.18], [20, 44, 'irregular', 0.18], [84, 104, 'irregular', 0.12]].map(([x, y, k, s]) => shape(k as Shape, x as number, y as number, s as number)),
    ring(60, 60, 50, 46)),
  /** smälta samman: three steps from left to right: two blobs side by side, touching, and one bigger blob; orange arrows between the steps. */
  'galax.smälta-samman': all(bg(C.paper), ...[0, 1, 2].map((i) => rect(6 + i * 38, 34, 32, 48, C.white, 3, C.grey2, 1.2)),
    circle(14, 58, 6, '#7aa0e0', C.ink, 1.3), circle(30, 58, 6, '#e0a04a', C.ink, 1.3),
    path('M45 58 C45 51 51 50 54 54 C57 50 63 51 63 58 C63 65 57 66 54 62 C51 66 45 65 45 58 Z', '#b8a0d0', C.ink, 1.3), circle(49, 58, 3, '#7aa0e0', null), circle(59, 58, 3, '#e0a04a', null),
    circle(98, 58, 10, '#b89ac0', C.ink, 1.5), frame(82, 32, 36, 52), arrow(37, 58, 43, 58, HL, 2.4), arrow(73, 58, 81, 58, HL, 2.4), num('1 + 1', 22, 96, 10, C.grey), num('1', 98, 96, 10, HL)),
  // ── Stjärnhopar och nebulosor ──────────────────────────────────────
  /** stjärnhop: a night sky with a few scattered stars and, high up, one small tight group of bright blue-white stars, ringed; a hill and a small person below. */
  'galax.stjärnhop': all(bg(NIGHT), starDots(26, 31, 6, 6, 108, 80), ...[[56, 26], [64, 22], [70, 30], [60, 34], [52, 32], [66, 38], [74, 24]].map(([x, y], i) => bright(x!, y!, i % 3 ? 2.4 : 3.2, '#dfeaff')), ring(63, 30, 20, 16),
    hill(), fir(16, 96, 1.1), fir(104, 94, 1.2), figure({ x: 36, h: 0.4, top: C.orange })),
  /** öppen stjärnhop: a big panel with a loose, scattered group of young blue-white stars; beside it a small grey panel with a dense ball of stars. */
  'galax.öppen-stjärnhop': all(bg(C.paper), panel(6, 18, 74, 80), ...[[20, 34], [36, 28], [58, 30], [70, 44], [28, 52], [48, 48], [62, 62], [18, 74], [40, 70], [56, 84], [70, 80], [30, 88], [12, 56], [46, 36]].map(([x, y], i) => bright(x!, y!, i % 2 ? 2.2 : 3, '#d6e4ff')), frame(4, 16, 78, 84),
    greyed(panel(86, 40, 28, 36), ...range(60).map((i) => { const a = i * 2.4, r = Math.sqrt(i) * 1.5; return circle(f1(100 + Math.cos(a) * r), f1(58 + Math.sin(a) * r), 0.9, '#ffe2a8', null); }))),
  /** klotformig stjärnhop: a big panel with a dense round ball of hundreds of old yellow stars, thickest in the middle; beside it a small grey panel with a loose group. */
  'galax.klotformig-stjärnhop': all(bg(C.paper), panel(6, 18, 74, 80), glow(43, 58, 30, '#ffd88a', 4, 0.22), ...range(260).map((i) => { const a = i * 2.39996, r = Math.sqrt(i) * 1.95; return circle(f1(43 + Math.cos(a) * r), f1(58 + Math.sin(a) * r), i < 40 ? 1.4 : 1, i % 5 ? '#ffe2a8' : '#ffb870', null); }), frame(4, 16, 78, 84),
    greyed(panel(86, 40, 28, 36), ...[[92, 46], [104, 50], [96, 60], [108, 64], [90, 70], [102, 72], [98, 52]].map(([x, y]) => sparkle(x!, y!, 2, '#d6e4ff')))),
  /** dubbelstjärna: a yellow and a blue star close together, both on one dashed oval path with orange arrows; a small grey single star far to the side. */
  'galax.dubbelstjärna': all(bg(), starDots(22, 37), `<ellipse cx="58" cy="58" rx="34" ry="16" fill="none" stroke="${C.grey2}" stroke-width="1.4" stroke-dasharray="4 3"/>`,
    bright(28, 60, 6, '#ffe08a'), circle(28, 60, 4, '#ffd04a', null), bright(90, 56, 5, '#bcd4ff'), circle(90, 56, 3.4, '#8fb4ff', null),
    path('M54 42 C62 41 70 42 76 44', 'none', HL, 2.4), path('M76 44 L70 40 L70 47 Z', HL, null), path('M62 74 C54 75 46 74 40 72', 'none', HL, 2.4), path('M40 72 L46 76 L46 69 Z', HL, null),
    ring(58, 58, 44, 24), greyed(bright(104, 100, 3.6, '#fff6c8'))),
  /** nebulosa: a big cloud of gas in space glowing pink, red and blue, with a few bright young stars inside. */
  'galax.nebulosa': all(bg(), starDots(30, 41), path(CLOUD, 'rgba(226,85,143,0.55)', null), at(60, 58, 0.8, g('translate(-60 -58)', path(CLOUD, 'rgba(242,154,184,0.7)', null))), at(64, 54, 0.5, g('translate(-60 -58)', path(CLOUD, 'rgba(111,168,232,0.75)', null))),
    op(0.55, ellipse(40, 66, 12, 7, NEB1, null), ellipse(84, 50, 10, 6, '#f2c14e', null)), bright(56, 54, 3.4, '#ffffff'), bright(70, 62, 2.6, '#ffffff'), bright(44, 48, 2.2, '#ffffff')),
  /** mörk nebulosa: the same cloud shape, but black, in front of a red glow and many stars, so that the stars behind it do not show; ringed. */
  'galax.mörk-nebulosa': all(bg(), glow(60, 56, 56, NEB1, 4, 0.22), starDots(120, 43, 6, 6, 108, 104, '#fff6d8', 1.2), path(CLOUD, '#0a0d18', null), ring(60, 56, 52, 40)),
  /** ljusfläck: a dark forest; between the trees the sun makes one bright patch of light on the ground, ringed. */
  'galax.ljusfläck': all(bg('#2f4a36'), rect(4, 78, 112, 34, '#3d5a32', 0, null), ...[[10, 6], [30, 10], [84, 8], [104, 6]].map(([x, w]) => rect(x!, 4, w!, 80, '#4a3624', 0, C.ink, 1)),
    path('M52 4 L66 4 L80 92 L40 92 Z', 'rgba(255,240,170,0.28)', null), ellipse(60, 94, 22, 7, '#f6e48a', null), ellipse(60, 94, 14, 4, '#fff6c8', null), ring(60, 94, 26, 10)),
  /** långtidsexponering: a camera on a tripod under the night sky; the stars have drawn long curved trails around one point; a small clock shows a long time. */
  'galax.långtidsexponering': all(bg(NIGHT), ...range(7).map((i) => { const r = 6 + i * 6; return `<path d="M${f1(84 - r)} 54 A${r} ${r} 0 0 1 ${f1(84 + r * Math.cos(-0.9))} ${f1(54 + r * Math.sin(-0.9))}" fill="none" stroke="${i % 3 ? '#cfe0ff' : '#ffe9a8'}" stroke-width="1.4"/>`; }),
    circle(84, 54, 1.6, C.white, null), hill(), rect(26, 64, 26, 16, C.dark, 3, C.ink, 1.4), circle(39, 72, 5, '#5a6a8a', C.ink, 1.2), rect(30, 60, 8, 5, C.dark, 1, C.ink, 1), line('M39 80 L28 110 M39 80 L39 110 M39 80 L50 110', '#9aa3ad', 2),
    circle(96, 92, 12, C.white, C.ink, 1.6), path('M96 92 L96 80 A12 12 0 1 1 84 92 Z', 'rgba(228,87,46,0.55)', null), line('M96 92 L96 82 M96 92 L88 94', C.ink, 1.6)),
  // ── Universums expansion ───────────────────────────────────────────
  /** expandera: a small grey circle with four galaxy dots, and to the right the same dots in a much bigger circle, farther apart, with orange arrows pointing outwards. */
  'galax.expandera': all(bg(), greyed(circle(22, 58, 14, '#2a3560', C.grey2, 1.4), ...[[16, 52], [28, 54], [20, 64], [27, 63]].map(([x, y]) => circle(x!, y!, 2.4, CORE, null))),
    arrow(40, 58, 50, 58, C.grey2, 2), circle(82, 58, 30, '#2a3560', C.grey2, 1.4), ...[[68, 46], [94, 50], [74, 74], [96, 70]].map(([x, y]) => spiral(x!, y!, 0.12)),
    ...[[-1, -1], [1, -1], [-1, 1], [1, 1], [0, -1.4], [0, 1.4], [-1.4, 0], [1.4, 0]].map(([dx, dy]) => arrow(f1(82 + dx! * 21), f1(58 + dy! * 21), f1(82 + dx! * 30), f1(58 + dy! * 30), HL, 2.2))),
  /** mörk energi: the universe drawn as a widening shape from a dot on the left (time going right) that opens faster and faster at the right end; a dark purple ? glows inside and orange arrows push outwards. */
  'galax.mörk-energi': all(bg(), path('M10 60 C40 50 70 46 90 34 C100 28 108 18 112 10 L112 110 C108 102 100 92 90 86 C70 74 40 70 10 60 Z', 'rgba(122,79,196,0.35)', ARM, 1.4), circle(10, 60, 2.6, C.white, null),
    ...[[40, 60], [62, 56], [62, 66], [84, 48], [84, 72], [100, 40], [100, 80]].map(([x, y]) => circle(x!, y!, 1.8, CORE, null)), glow(80, 60, 18, DM, 4, 0.5), num('?', 80, 66, 18, '#d8c8ff'),
    arrow(98, 30, 108, 16, HL, 2.4), arrow(98, 90, 108, 104, HL, 2.4), line('M10 104 L60 104', C.grey2, 1.4), path('M60 104 L55 101 L55 107 Z', C.grey2, null)),
  // ── Rödförskjutning ────────────────────────────────────────────────
  /** ljusvåg: a lamp on the left sends a yellow wavy line across to an eye on the right. */
  'galax.ljusvåg': all(bg(C.paper), circle(20, 50, 10, '#fff3a0', C.ink, 1.6), rect(15, 60, 10, 8, C.grey, 1, C.ink, 1.2), line('M8 50 L4 50 M20 36 L20 32 M10 40 L7 37 M30 40 L33 37', C.gold, 2),
    wave(34, 52, 62, 9, 16, C.gold, 3), path('M96 52 L90 47 L90 57 Z', C.gold, null), eye(106, 52, 0.9), ring(64, 52, 32, 16)),
  /** blåförskjutning: like rödförskjutning, but the star moves left towards an eye; the lines in the orange-framed spectrum lie further left (towards blue) than in the grey one above. */
  'galax.blåförskjutning': all(bg('#1f2a44'), eye(14, 22, 0.9), sparkle(96, 22, 7, C.yellow), arrow(86, 22, 62, 22, C.white, 2), sparkle(54, 22, 4, C.yellow),
    ...[0, 1].map((r) => all(...RAINBOW.map((c, i) => rect(14 + i * 13, 40 + r * 36, 13, 18, c, 0, null)))), greyed(rect(14, 40, 91, 18, 'none', 0, C.white, 1.4)),
    ...[46, 64, 88].map((x) => line(`M${x} 40 L${x} 58`, C.black, 2.4)), rect(12, 74, 95, 22, 'none', 2, HL, 2.6), ...[30, 48, 72].map((x) => line(`M${x} 76 L${x} 94`, C.black, 2.4)), arrow(80, 104, 40, 104, HL, 2.6)),
  // ── Mörk materia ───────────────────────────────────────────────────
  /** mörk materia: a spiral galaxy in colour inside a much bigger dark purple cloud that cannot be seen (dashed edge), ringed. */
  'galax.mörk-materia': all(bg(), starDots(26, 47), glow(60, 58, 52, DM, 5, 0.32), `<circle cx="60" cy="58" r="50" fill="none" stroke="${DM}" stroke-width="1.6" stroke-dasharray="4 3"/>`, spiral(60, 58, 0.5), num('?', 26, 34, 12, '#d8c8ff'), num('?', 94, 88, 12, '#d8c8ff'), ring(60, 58, 52)),
  /** gravitationslins: an eye on the left, a heavy group of galaxies in the middle and a small blue galaxy on the right; light from the blue galaxy bends around the group to the eye, and blue arcs show around the group. */
  'galax.gravitationslins': all(bg(), starDots(20, 53), eye(12, 58, 0.9), ...[[54, 52], [62, 60], [56, 66], [66, 50], [60, 56]].map(([x, y]) => elliptical(x!, y!, 0.16)), glow(60, 58, 16, '#ffd88a', 3, 0.25),
    irregular(104, 58, 0.22), path('M100 54 C84 24 40 24 22 54', 'none', '#bcd4ff', 1.8), path('M100 62 C84 92 40 92 22 62', 'none', '#bcd4ff', 1.8), path('M22 54 L28 49 L29 56 Z M22 62 L29 60 L28 67 Z', '#bcd4ff', null),
    path('M46 36 C54 32 66 32 74 36', 'none', '#8fb4ff', 3.2), path('M46 80 C54 84 66 84 74 80', 'none', '#8fb4ff', 3.2), ring(60, 58, 26, 30)),
  // ── Kosmisk bakgrundsstrålning ─────────────────────────────────────
  /** kosmisk bakgrundsstrålning: an oval map of the whole sky covered in small blue, yellow and red spots; below, a horn antenna catches wavy lines coming from it. */
  'galax.kosmisk-bakgrundsstrålning': all(bg(), ellipse(60, 38, 52, 28, '#4a7ad0', C.white, 1.4), (() => { const r = rng(59); const cols = ['#2f5fb8', '#7fb0e8', '#f2d24e', '#f39a3c', '#e2463a', '#5f8fd8']; return all(...range(150).map(() => { const a = r() * Math.PI * 2, d = Math.sqrt(r()); return ellipse(f1(60 + Math.cos(a) * d * 48), f1(38 + Math.sin(a) * d * 24), f1(2 + r() * 3), f1(1.6 + r() * 2), cols[Math.floor(r() * 6)]!, null); })); })(),
    ellipse(60, 38, 52, 28, 'none', HL, 2.6), wave(58, 76, 22, 3, 7, '#bcd4ff', 1.6), wave(30, 72, 22, 3, 7, '#bcd4ff', 1.6), horn(78, 92, 0.9)),
  /** efterglöd: the sun has just gone down behind the sea; a red and orange glow is left along the horizon, and the first stars come out above. */
  'galax.efterglöd': all(bg('#24305a'), rect(4, 50, 112, 26, '#5a4a7a', 0, null), rect(4, 62, 112, 14, '#d0604a', 0, null), rect(4, 70, 112, 8, '#f2a65a', 0, null), rect(4, 78, 112, 34, '#1e2a48', 0, null),
    line('M14 86 l12 0 M44 92 l16 0 M80 88 l14 0 M24 100 l10 0 M70 102 l18 0', '#f2a65a', 1.2), starDots(12, 61, 6, 6, 108, 30), sparkle(30, 16, 3, '#fff6c8'), sparkle(92, 22, 2.6, '#fff6c8'), ring(60, 70, 54, 12)),
  /** myrornas krig: an old television with two antenna rods; the screen shows only grey and white noise. */
  'galax.myrornas-krig': all(bg(C.paper), tv(noise(24, 32, 58, 48))),
};
