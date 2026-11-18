/**
 * Matematik & naturvetenskap → Astronomi & rymd → Stjärnor, 3631–3637 (0.53): star birth, nuclear fusion in stars,
 * spectral classes, red giants, supernovae, neutron stars and black holes.
 * Recurring signs: space is a dark blue night with small white dots; a star is a round ball with a soft glow;
 * the part the word names is ringed or framed in orange, and grey copies show what the word is not.
 * Close words share one layout where only the marked part differs: vit dvärg/röd dvärg/gul dvärg/röd jätte/superjätte
 * (the same row of five stars from small to big; only the named star is coloured and ringed, the others are grey);
 * blåvit (three stars of one size: only the colour differs);
 * gasmoln/protostjärna (the same dark cloud, empty or with a glowing ball and a flat disc in the middle);
 * planetarisk nebulosa/supernovarest (a smooth round coloured ring around a white dot, or ragged threads flying outward).
 * Digits and maths signs only; no words, no brands and no pointing fingers.
 */
import { C, all, circle, ellipse, g, line, path, rect, sparkle, type Svg } from './kit';
import { HL, T, globe } from './people';
import { greyed } from './blindFix';
import { figure, type Build } from './figures';

// ── Palette and basics ───────────────────────────────────────────────
const NIGHT = '#1f2740';
const SOFT = '#f4f6f8';
const LIGHT = '#f2b705';
const RED = '#e2553a';
const ORANGE = '#f29a3a';
const YEL = '#ffd34d';
const BW = '#cfe6ff';
const BLUE = '#7fb4ff';
const WHITE = '#fbfbf8';
const GAS = '#b07fc9';
const GAS2 = '#7d5aa6';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const bg = (col: string = NIGHT) => rect(4, 4, 112, 108, col, 3, null);
const ring = (x: number, y: number, r: number, col: string = HL, sw = 2.6) => circle(x, y, r, 'none', col, sw);
const oval = (x: number, y: number, rx: number, ry: number, col: string = HL, sw = 2.6) => ellipse(x, y, rx, ry, 'none', col, sw);
const frame = (x: number, y: number, w: number, h: number) => rect(x, y, w, h, 'none', 4, HL, 2.6);
const cross = (x: number, y: number, r = 5, col: string = '#d8343a') => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, 2.6);
/** Arrowhead with its tip at (x, y), pointing along angle a (radians). */
const head = (x: number, y: number, a: number, col: string, s = 1) => {
  const L = 7 * s, W = 4 * s, c = Math.cos(a), si = Math.sin(a);
  return path(`M${f1(x)} ${f1(y)} L${f1(x - L * c + W * si)} ${f1(y - L * si - W * c)} L${f1(x - L * c - W * si)} ${f1(y - L * si + W * c)} Z`, col, null);
};
const arr = (x1: number, y1: number, x2: number, y2: number, col: string = HL, sw = 3, dash?: string) => all(line(`M${x1} ${y1} L${x2} ${y2}`, col, sw, dash), head(x2, y2, Math.atan2(y2 - y1, x2 - x1), col, sw / 3 + 0.3));

/** Fixed pseudo-random field of small white dots (background stars), kept away from a free area. */
const DOTS: [number, number, number][] = [[12, 12, 1], [30, 9, 0.8], [52, 14, 1.1], [77, 8, 0.8], [98, 13, 1], [108, 30, 0.8], [9, 34, 0.9], [20, 52, 0.7], [106, 52, 1], [12, 78, 0.8], [104, 84, 0.9], [30, 102, 0.8], [58, 106, 1], [86, 103, 0.8], [110, 104, 0.7], [40, 30, 0.6], [86, 28, 0.7], [70, 96, 0.6], [16, 92, 0.6], [96, 66, 0.6]];
const dots = (keep: (x: number, y: number) => boolean = () => true) => all(...DOTS.filter(([x, y]) => keep(x, y)).map(([x, y, r]) => circle(x, y, r, WHITE, null)));
const sky = (keep?: (x: number, y: number) => boolean) => all(bg(), dots(keep));

/** A star: a ball with a soft glow. */
const ball = (x: number, y: number, r: number, col: string, glow: string | null = col, edge: string = C.ink) => all(glow ? `<circle cx="${x}" cy="${y}" r="${f1(r + Math.min(r * 0.45, 7))}" fill="${glow}" opacity="0.25"/>` : '', circle(x, y, r, col, edge, 1.2));
/** Light rays around a star (for bright stars). */
const rays = (x: number, y: number, r1: number, r2: number, col: string = YEL, n = 12, sw = 2) => all(...range(n).map((i) => { const a = (i / n) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * r1)} ${f1(y + Math.sin(a) * r1)} L${f1(x + Math.cos(a) * r2)} ${f1(y + Math.sin(a) * r2)}`, col, sw); }));
/** A burst (explosion) of n pointed rays. */
const burst = (x: number, y: number, r: number, col: string = YEL, inner: string = WHITE, n = 14) => {
  const pts = range(n * 2).map((i) => { const a = (i / (n * 2)) * Math.PI * 2, rr = i % 2 ? r * 0.5 : r; return `${f1(x + Math.cos(a) * rr)} ${f1(y + Math.sin(a) * rr)}`; });
  return all(path(`M${pts.join(' L')} Z`, col, C.ink, 1.2), circle(x, y, r * 0.35, inner, null));
};
/** Soft cloud of gas (several overlapping translucent blobs). */
const gasCloud = (x: number, y: number, s = 1, col: string = GAS, col2: string = GAS2) => at(x, y, s,
  path('M-44 10 C-52 -6 -38 -22 -22 -18 C-18 -34 4 -38 14 -26 C26 -36 48 -26 44 -8 C56 0 50 22 32 22 C24 34 -4 34 -12 24 C-30 32 -50 26 -44 10 Z', col, null),
  `<path d="M-30 8 C-34 -4 -20 -12 -10 -8 C-6 -20 12 -20 18 -10 C30 -14 36 0 28 10 C26 20 4 22 -2 16 C-14 22 -30 20 -30 8 Z" fill="${col2}" opacity="0.6"/>`,
  ...range(14).map((i) => circle(f1(-36 + ((i * 37) % 72)), f1(-18 + ((i * 23) % 38)), 0.9, '#e8d6f5', null)));

// ── Star lineup (vit dvärg, röd dvärg, gul dvärg, röd jätte, superjätte) ─────────────
type Kind = 'vit' | 'rodd' | 'gul' | 'rodj' | 'super';
const LINE: Record<Kind, [number, number, string]> = { vit: [11, 2.6, WHITE], rodd: [21, 4.2, RED], gul: [35, 7.5, YEL], rodj: [57, 13.5, ORANGE], super: [92, 17, RED] };
const lineup = (mark: Kind) => {
  const base = 78;
  const parts = (Object.keys(LINE) as Kind[]).map((k) => {
    const [x, r, col] = LINE[k];
    return k === mark ? '' : greyed(circle(x, base - r, r, col, C.ink, 1.2));
  });
  const [x, r, col] = LINE[mark];
  const glow = mark === 'vit' ? '#9fc6ff' : col;
  return all(sky((_x, y) => y < 40 || y > 92), line('M6 78 L114 78', 'rgba(255,255,255,0.25)', 1, '2 3'), ...parts, ball(x, base - r, r, col, glow), ring(x, base - r, r + 4.5));
};

// ── People ───────────────────────────────────────────────────────────
const person = (x: number, top: string = C.green, more: Build = {}) => figure({ x, top, ...more });

export const STARS_MOTIFS: Record<string, Svg> = {
  // ── 3631 Stjärnors födelse ───────────────────────────────────────────
  /** gasmoln: a big, soft violet cloud of gas floating among the stars in the night sky; no star in it yet. */
  'stjarn.gasmoln': all(sky(), gasCloud(60, 60, 1.15)),
  /** stoft: the same violet cloud, small and faded, with a big magnifying glass over it; inside the lens many tiny brown and grey grains. */
  'stjarn.stoft': all(sky(), greyed(gasCloud(36, 44, 0.6)), circle(66, 62, 30, '#3a3550', C.ink, 3), ...range(26).map((i) => { const a = i * 2.4, rr = 24 * Math.sqrt((i * 0.618) % 1); return path(`M${f1(66 + rr * Math.cos(a))} ${f1(62 + rr * Math.sin(a))} l2.2 -0.8 l0.8 2 l-2 1 Z`, i % 3 ? '#a8865a' : '#c9ced4', null); }), line('M88 84 L106 104', C.brown, 7), ring(66, 62, 33), line('M40 50 L44 52', 'rgba(255,255,255,0.4)', 1)),
  /** protostjärna: the same dark cloud with a small glowing orange ball in the middle, a flat glowing disc around it and two thin jets up and down; the ball is ringed. */
  'stjarn.protostjärna': all(sky(), gasCloud(60, 62, 1.15, '#7a5c8f', '#5a4370'), line('M60 30 L60 46 M60 78 L60 94', '#ffe6a8', 2.2), ellipse(60, 62, 30, 6, 'rgba(255,170,90,0.75)', '#ffcf8a', 1.2), ball(60, 62, 7, ORANGE, '#ffb36b'), ring(60, 62, 12)),
  /** planetsystem: a red-orange star in the middle with three orbit ellipses and a planet on each; the whole system is framed. */
  'stjarn.planetsystem': all(sky((x, y) => x < 10 || x > 110 || y < 14 || y > 106), ...[[16, 7], [30, 13], [46, 20]].map(([rx, ry]) => ellipse(60, 60, rx!, ry!, 'none', 'rgba(255,255,255,0.55)', 1.2)), ball(60, 60, 7, ORANGE, '#ffb36b'), circle(76, 60, 3, '#9fd2ee', C.ink, 1), circle(44, 71, 4, '#c9a77a', C.ink, 1), circle(97, 50, 5.5, '#e0b88a', C.ink, 1), frame(10, 34, 100, 52)),

  // ── 3632 Kärnfusion i stjärnor ───────────────────────────────────────
  /** kärna (i en stjärna): a star cut open like a fruit: yellow outer layer, an orange middle layer and a small white-hot centre that is ringed. */
  'stjarn.kärna.3': all(sky(), ball(60, 60, 40, YEL, null), circle(60, 60, 27, ORANGE, C.ink, 1), ...range(10).map((i) => { const a = (i / 10) * Math.PI * 2; return line(`M${f1(60 + Math.cos(a) * 15)} ${f1(60 + Math.sin(a) * 15)} L${f1(60 + Math.cos(a) * 24)} ${f1(60 + Math.sin(a) * 24)}`, '#ffd27a', 1.4); }), circle(60, 60, 11, WHITE, '#ffe6a8', 2), ring(60, 60, 14)),
  /** fusionsreaktor: a big ring-shaped (doughnut) chamber in a grey hall with copper magnet coils around it and a glowing violet ring of hot gas inside; a small person in a hard hat stands next to it for size. */
  'stjarn.fusionsreaktor': all(bg('#e4e7ea'), line('M4 112 L116 112', C.grey2, 2), ellipse(54, 66, 44, 22, '#b9c0c8', C.ink, 2), ellipse(54, 66, 22, 9, '#e4e7ea', C.ink, 1.8), ellipse(54, 66, 33, 15, 'none', 'rgba(190,120,255,0.9)', 4.5), ellipse(54, 66, 33, 15, 'none', '#f0d8ff', 1.4), ...[-36, -20, 0, 20, 36].map((dx) => rect(54 + dx - 2.5, 66 - Math.sqrt(1 - (dx / 44) ** 2) * 22 - 2, 5, Math.sqrt(1 - (dx / 44) ** 2) * 44 + 4, 'rgba(200,120,60,0.85)', 1, C.ink, 1)), rect(46, 88, 16, 24, '#8a929c', 2, C.ink, 1.6), person(104, C.orange, { h: 0.55 }), path('M98.5 60 C98.5 53 109.5 53 109.5 60 Z', C.yellow, C.ink, 1.2)),

  // ── 3633 Stjärnors spektralklasser ───────────────────────────────────
  /** blåvit: three stars of the same size side by side: a red one and a yellow one in grey, and a blue-white one in colour with a blue glow that is ringed. */
  'stjarn.blåvit': all(sky(), greyed(circle(22, 64, 12, RED, C.ink, 1.2)), greyed(circle(50, 64, 12, YEL, C.ink, 1.2)), ball(88, 64, 16, BW, BLUE), circle(88, 64, 9, WHITE, null), ring(88, 64, 22)),
  /** spektralklass: seven boxes side by side, each holding small stars of one colour from blue to red; the yellow box is framed. */
  'stjarn.spektralklass': all(sky((_x, y) => y < 30 || y > 92), ...[BLUE, BW, WHITE, '#fff2c0', YEL, ORANGE, RED].map((col, i) => all(rect(6 + i * 15.5, 38, 14, 48, 'rgba(255,255,255,0.08)', 2, 'rgba(255,255,255,0.5)', 1), circle(13 + i * 15.5, 50, 4, col, C.ink, 0.8), circle(13 + i * 15.5, 62, 3.2, col, C.ink, 0.8), circle(13 + i * 15.5, 74, 3.6, col, C.ink, 0.8))), frame(66, 34, 21, 56)),
  /** gul dvärg: a row of five stars from small to big; only the small yellow sun-like star (third) is coloured and ringed. */
  'stjarn.gul-dvärg': lineup('gul'),
  /** röd dvärg: the same row of five stars; only the second, small red star is coloured and ringed. */
  'stjarn.röd-dvärg': lineup('rodd'),

  // ── 3634 Röda jättar ─────────────────────────────────────────────────
  /** röd jätte: the same row of five stars; only the fourth, big orange-red star is coloured and ringed. */
  'stjarn.röd-jätte': lineup('rodj'),
  /** superjätte: the same row of five stars; only the last and biggest red star is coloured and ringed. */
  'stjarn.superjätte': lineup('super'),
  /** vit dvärg: the same row of five stars; only the first, tiny white star is coloured and ringed. */
  'stjarn.vit-dvärg': lineup('vit'),
  /** planetarisk nebulosa: a smooth round glowing ring of gas, blue-green inside and red at the edge, around a tiny white star; the whole ring is framed. */
  'stjarn.planetarisk-nebulosa': all(sky((x, y) => Math.hypot(x - 60, y - 60) > 44), circle(60, 60, 36, 'rgba(226,85,58,0.55)', null), circle(60, 60, 30, 'rgba(110,200,190,0.75)', null), circle(60, 60, 18, 'rgba(160,230,220,0.5)', null), circle(60, 60, 30, 'none', '#ff9a7a', 3), circle(60, 60, 2.6, WHITE, null), circle(60, 60, 5, 'none', 'rgba(255,255,255,0.5)', 1), frame(18, 18, 84, 84)),

  // ── 3635 Supernovor ──────────────────────────────────────────────────
  /** supernova: small grey picture of a big red star in the corner, an arrow, and the same star blowing up in a huge white-yellow burst with rays. */
  'stjarn.supernova': all(sky(), greyed(circle(18, 20, 9, RED, C.ink, 1.2)), arr(30, 28, 42, 40, WHITE, 2), rays(68, 66, 20, 36, '#ffe58a', 18, 2), burst(68, 66, 27, YEL, WHITE, 16), circle(68, 66, 8, WHITE, null), ring(68, 66, 39)),
  /** chockvåg: an explosion on the left; one thick orange arc (the wave front) moves out from it to the right and pushes into a violet gas cloud, followed by thin grey arcs. */
  'stjarn.chockvåg': all(sky(), gasCloud(98, 60, 0.42), burst(18, 60, 10, YEL), ...[28, 40].map((r) => path(`M${f1(18 + r * Math.cos(-0.9))} ${f1(60 + r * Math.sin(-0.9))} A${r} ${r} 0 0 1 ${f1(18 + r * Math.cos(0.9))} ${f1(60 + r * Math.sin(0.9))}`, 'none', 'rgba(255,255,255,0.45)', 1.6)), path(`M${f1(18 + 58 * Math.cos(-0.85))} ${f1(60 + 58 * Math.sin(-0.85))} A58 58 0 0 1 ${f1(18 + 58 * Math.cos(0.85))} ${f1(60 + 58 * Math.sin(0.85))}`, 'none', HL, 5), arr(66, 60, 82, 60, HL, 2.6)),
  /** supernovarest: ragged red and orange threads of gas flying outward in all directions from a tiny bright dot, with small white arrows pointing outward. */
  'stjarn.supernovarest': all(sky(), ...range(16).map((i) => { const a = (i / 16) * Math.PI * 2 + 0.2, r1 = 14 + (i % 3) * 4, r2 = 34 + (i % 4) * 4; return line(`M${f1(60 + Math.cos(a) * r1)} ${f1(60 + Math.sin(a) * r1)} Q${f1(60 + Math.cos(a + 0.25) * (r1 + r2) / 2)} ${f1(60 + Math.sin(a + 0.25) * (r1 + r2) / 2)} ${f1(60 + Math.cos(a) * r2)} ${f1(60 + Math.sin(a) * r2)}`, i % 2 ? RED : ORANGE, 2.6); }), `<circle cx="60" cy="60" r="26" fill="rgba(120,170,255,0.18)"/>`, ...range(6).map((i) => { const a = (i / 6) * Math.PI * 2 + 0.5; return arr(f1(60 + Math.cos(a) * 42), f1(60 + Math.sin(a) * 42), f1(60 + Math.cos(a) * 50), f1(60 + Math.sin(a) * 50), WHITE, 1.4); }), circle(60, 60, 2.6, WHITE, null), ring(60, 60, 6, BLUE, 1.6)),
  /** stjärnstoft: an exploding star at the top left sends a glittering golden stream of dust across the sky down to the Earth at the bottom right; the stream is ringed. */
  'stjarn.stjärnstoft': all(sky(), burst(22, 24, 12, YEL), ...range(22).map((i) => { const t = i / 21, x = 30 + t * 56 + Math.sin(t * 6) * 6, y = 32 + t * 50; return sparkle(f1(x), f1(y), 1.6 + (i % 3) * 0.8, i % 2 ? YEL : WHITE); }), globe(92, 92, 14), oval(58, 58, 18, 34, HL, 2.4)),
  /** gäststjärna: at night an old scholar in a long robe sits on a roof terrace with a brush and a paper scroll and looks up at a new, bright star beside the crescent moon; the new star is ringed. */
  'stjarn.gäststjärna': all(sky((_x, y) => y < 70), path('M88 18 A12 12 0 1 0 100 34 A9 9 0 1 1 88 18 Z', '#f5e7b0', C.ink, 1.2), rays(62, 26, 6, 12, WHITE, 8, 1.6), circle(62, 26, 4.5, WHITE, YEL, 1.4), ring(62, 26, 15), rect(4, 82, 112, 30, '#5a4636', 0, null), path('M4 82 L116 82 L108 76 L12 76 Z', '#7a3d2a', C.ink, 1.4), path('M24 82 C22 66 28 56 36 56 C44 56 48 66 48 82 Z', '#3d6b8a', C.ink, 1.4), circle(36, 50, 7, C.skin, C.ink, 1.4), path('M30 46 C30 40 42 40 42 46 Z', C.hair, null), rect(34, 38, 4, 5, C.dark, 1, null), line('M40 48 L43 46', C.ink, 1), rect(50, 72, 26, 8, '#f3ead6', 1, C.ink, 1.2), line('M54 75 L72 75 M54 77.5 L66 77.5', '#3d3a3a', 0.8), line('M44 66 L56 70', C.skin, 4), line('M56 70 L60 66', C.brown, 1.6)),

  // ── 3636 Neutronstjärnor ─────────────────────────────────────────────
  /** neutronstjärna: a tiny bright blue-white ball floating above the dark outline of a city; two arrows of the same length show that the ball is no wider than the city (20). */
  'stjarn.neutronstjärna': all(sky((x, y) => y < 60 && (x < 40 || x > 84)), ...[[48, 84, 9, 28], [57, 74, 8, 38], [65, 88, 11, 24]].map(([x, y, w, h]) => rect(x!, y!, w!, h!, '#4a5470', 0, C.ink, 1)), rect(4, 108, 112, 4, '#4a5470', 0, null), greyed(rect(8, 96, 30, 16, '#4a5470', 0, null), rect(84, 92, 30, 20, '#4a5470', 0, null)), line('M48 69 L76 69', WHITE, 1.6), head(48, 69, Math.PI, WHITE, 0.7), head(76, 69, 0, WHITE, 0.7), T(90, 73, '20', 10, WHITE), ball(62, 26, 14, BW, BLUE), circle(62, 26, 7, WHITE, null), line('M48 49 L76 49', WHITE, 1.6), head(48, 49, Math.PI, WHITE, 0.7), head(76, 49, 0, WHITE, 0.7), T(90, 53, '20', 10, WHITE), ring(62, 26, 19)),
  /** pulsar: a small blue-white ball with two long yellow light cones going out from top and bottom, a curved arrow around it showing that it spins, and below a row of short regular blips like a signal. */
  'stjarn.pulsar': all(sky(), path('M52 46 L30 6 L48 6 Z', 'rgba(255,230,120,0.75)', null), path('M68 62 L90 102 L72 102 Z', 'rgba(255,230,120,0.75)', null), ball(60, 54, 9, BW, BLUE), circle(60, 54, 4.5, WHITE, null), path('M40 60 A22 10 0 0 0 80 60', 'none', HL, 2.4), head(81, 58, -0.6, HL, 1), line('M10 104 L20 104 L22 94 L24 104 L42 104 L44 94 L46 104 L64 104', '#9fe0a0', 1.6), ring(60, 54, 14)),

  // ── 3637 Svarta hål ──────────────────────────────────────────────────
  /** osynlig: two people side by side: a grey ordinary person on the left, and on the right only a dashed outline of a person with a hat and a scarf floating in the air; the outline is ringed. */
  'stjarn.osynlig': all(bg(SOFT), line('M4 112 L116 112', C.grey2, 2), greyed(person(32, C.green)), path('M84 112 L84 80 L78 80 L78 52 C78 44 98 44 98 52 L98 80 L92 80 L92 112', 'none', C.grey, 1.4), circle(88, 34, 9, 'none', C.grey, 1.4), path('M76 26 L100 26 L96 22 L94 12 L82 12 L80 22 Z', C.dark, C.ink, 1.4), path('M79 46 C84 50 92 50 97 46 L99 50 C92 55 84 55 77 50 Z', RED, C.ink, 1.2), path('M95 50 L99 66 L94 66 L91 51 Z', RED, C.ink, 1.2), `<g stroke-dasharray="3 3">${path('M84 112 L84 80 L78 80 L78 52 C78 44 98 44 98 52 L98 80 L92 80 L92 112', 'none', C.ink, 1.2)}${circle(88, 34, 9, 'none', C.ink, 1.2)}</g>`, oval(88, 64, 22, 44)),
  /** flykthastighet: the Earth at the bottom; a grey rocket goes up in a dashed curve and falls back (red cross), while a coloured rocket flies straight up and away along an orange arrow marked 11. */
  'stjarn.flykthastighet': all(sky(), path('M4 112 L4 96 C30 82 90 82 116 96 L116 112 Z', '#7fb8e0', C.ink, 1.6), path('M20 98 C30 90 38 92 46 98 Z', '#79b66a', null), line('M30 88 C28 52 52 44 58 84', '#c9ced4', 1.6, '3 3'), greyed(at(30, 72, 0.7, path('M0 -12 C4 -8 4 0 3 6 L-3 6 C-4 0 -4 -8 0 -12 Z', WHITE, C.ink, 1.2))), cross(58, 84, 4), arr(84, 82, 84, 16, HL, 3), at(84, 54, 1, path('M0 -14 C5 -9 5 0 4 8 L-4 8 C-5 0 -5 -9 0 -14 Z', WHITE, C.ink, 1.3), path('M-4 4 L-8 10 L-4 9 Z M4 4 L8 10 L4 9 Z', RED, C.ink, 1), circle(0, -3, 2, BLUE, C.ink, 0.8), path('M-2.5 8 L0 15 L2.5 8 Z', ORANGE, null)), T(102, 40, '11', 12, HL)),
  /** händelsehorisont: a black ball in space with a dashed orange circle drawn tightly around it; a yellow light ray just outside the circle bends and gets away, while another ray that crosses the circle ends inside. */
  'stjarn.händelsehorisont': all(sky((x, y) => Math.hypot(x - 60, y - 64) > 34), circle(60, 64, 22, '#000000', null), circle(60, 64, 30, 'rgba(255,255,255,0.06)', null), circle(60, 64, 22, 'none', HL, 3, ), `<circle cx="60" cy="64" r="22" fill="none" stroke="${NIGHT}" stroke-width="3" stroke-dasharray="4 4"/>`, line('M6 30 C40 34 70 36 92 28 L112 20', LIGHT, 2.2), head(112, 20, -0.38, LIGHT, 1), line('M6 54 C24 56 40 60 50 64', LIGHT, 2.2), circle(50, 64, 2, LIGHT, null)),
  /** ackretionsskiva: a yellow star on the right loses a stream of gas that spirals into a flat, glowing orange disc around a small black hole on the left; the disc is ringed. */
  'stjarn.ackretionsskiva': all(sky(), ball(96, 34, 12, YEL, '#ffe08a'), path('M86 40 C74 50 64 52 56 56', 'none', ORANGE, 3), ellipse(44, 66, 34, 10, 'rgba(242,154,58,0.85)', '#ffd27a', 1.4), ellipse(44, 66, 22, 6, 'rgba(255,220,140,0.9)', null), circle(44, 64, 7, '#000000', '#ffb36b', 1.2), path('M37 66 A7 3 0 0 0 51 66', 'none', 'rgba(255,220,140,0.95)', 2), oval(44, 66, 39, 15)),
  /** supermassivt svart hål: a big spiral of stars (a galaxy) with a black hole in its centre that is ringed; a small grey black hole in the corner shows an ordinary one. */
  'stjarn.supermassivt-svart-hål': all(sky(), ...range(2).map((k) => line(range(40).map((i) => { const a = i * 0.16 + k * Math.PI, r = 6 + i * 1.15; return `${i ? 'L' : 'M'}${f1(64 + Math.cos(a) * r)} ${f1(62 + Math.sin(a) * r * 0.75)}`; }).join(' '), 'rgba(200,210,255,0.75)', 7)), circle(64, 62, 14, 'rgba(255,220,160,0.55)', null), circle(64, 62, 7, '#000000', '#ffb36b', 1.6), ring(64, 62, 11), greyed(circle(16, 100, 4, '#000000', C.white, 1), ellipse(16, 100, 8, 2.4, 'none', C.white, 1))),
  /** rumtid: a square grid drawn like a stretched cloth seen from the side; a heavy yellow ball (the sun) makes a deep dip in it, and a small blue planet rolls along the bent lines. */
  'stjarn.rumtid': all(sky((_x, y) => y < 40), ...range(9).map((i) => { const y = 54 + i * 6; return line(range(29).map((j) => { const x = 6 + j * 3.9, d = 26 * Math.exp(-(((x - 60) / 22) ** 2 + ((y - 76) / 12) ** 2)); return `${j ? 'L' : 'M'}${f1(x)} ${f1(y + d)}`; }).join(' '), 'rgba(140,200,255,0.8)', 1.1); }), ...range(11).map((j) => { const x0 = 10 + j * 10; return line(range(9).map((i) => { const y = 54 + i * 6, x = x0 + (x0 - 60) * (i - 4) * 0.03, d = 26 * Math.exp(-(((x - 60) / 22) ** 2 + ((y - 76) / 12) ** 2)); return `${i ? 'L' : 'M'}${f1(x)} ${f1(y + d)}`; }).join(' '), 'rgba(140,200,255,0.8)', 1.1); }), ball(60, 86, 11, YEL, '#ffe08a'), circle(94, 72, 4.5, '#7fb8e0', C.ink, 1.1), path('M88 64 C80 60 70 62 64 66', 'none', WHITE, 1.4, ), head(64, 66, 2.6, WHITE, 0.7)),
  /** gravitationsvåg: two small black holes circling each other in the middle (curved arrows), with orange wavy rings spreading out around them over a faint grid. */
  'stjarn.gravitationsvåg': all(sky(), ...[18, 30, 42].map((r, i) => line(range(73).map((k) => { const a = (k / 72) * Math.PI * 2, rr = r + 2.2 * Math.sin(a * 8 + i); return `${k ? 'L' : 'M'}${f1(60 + Math.cos(a) * rr)} ${f1(60 + Math.sin(a) * rr)}`; }).join(' '), i === 0 ? HL : `rgba(239,138,60,${0.8 - i * 0.22})`, 2.4)), circle(52, 60, 5, '#000000', '#ffb36b', 1.2), circle(68, 60, 5, '#000000', '#ffb36b', 1.2), path('M52 52 A10 10 0 0 1 66 51', 'none', WHITE, 1.4), head(67, 52, 0.5, WHITE, 0.6), path('M68 68 A10 10 0 0 1 54 69', 'none', WHITE, 1.4), head(53, 68, 3.6, WHITE, 0.6)),
};
