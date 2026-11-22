/**
 * Teknik & digital värld → Byggnad & infrastruktur → Stads- & samhällsteknik, 4161–4167 (0.59): street lighting,
 * fibre networks, district heating networks, waste management, storm-water systems, flood protection and
 * infrastructure planning.
 * Recurring signs: the thing the word names is orange (HL) or drawn strongest; the rest is grey or natural colour.
 * Soil is brown with small stones, water blue, night scenes have a dark blue sky. Words that are easy to mix up get
 * clearly different scenes: lyktstolpe (a whole pole in daylight), armatur (close-up of the lamp head with LED dots),
 * ljuskägla (night, a yellow cone of light on the ground with a person in it), slockna (three lamps at night, the
 * middle one goes dark) and upplyst (a dark grey path beside the same path lit up); fibernät (a cross-section with
 * glowing lines from a node to several houses), fiberkabel (close-up of a cut cable with glowing strands), skyddsrör
 * (an empty orange pipe in a trench), blåsa in (a machine pushes a cable into the pipe with air), kopparnät (old
 * wooden poles with copper wires) and anslutning (one house linked to the main line with a plug); framledning (the
 * hot red pipe with arrows TO the house) and returledning (the blue pipe with arrows BACK to the plant);
 * sopnedkast (a hatch in a stairwell with a chute down to the basement), sopsug (bags blown through a pipe to a far
 * terminal) and underjordsbehållare (a big container in the ground lifted by a crane); svackdike (a wide shallow grass
 * ditch beside a road) and fördröjningsmagasin (water crates under a car park); översvämningsskydd (a permanent wall along a high river) and
 * översvämningsbarriär (a temporary orange tube across a street).
 * Digits only; no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waGrow, type Svg } from './kit';
import { HL } from './people';
import { figure } from './figures';

// ── Palette and basics ───────────────────────────────────────────────
const NIGHT = '#28324d';
const SOIL = '#b98b5e';
const SOIL2 = '#8f6a45';
const GRASS = '#7fb35a';
const ASPH = '#6b6f78';
const CONC = '#cfcfca';
const WATER = '#5aa7d6';
const WATER2 = '#a9d6f0';
const GLOW = '#ffe58a';
const HOT = '#d64545';
const COLD = '#3f7fd0';
const COPPER = '#c27a3a';
const WOOD = '#a0673d';
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const sky = (col: string = NIGHT) => rect(0, 0, 120, 120, col, 0, null);
/** Brown soil from y down to 112 (or to `bottom`) with a few stones and a grass line on top. */
const soil = (y: number, bottom = 112) => all(rect(0, y, 120, bottom - y, SOIL, 0, null), ...range(12).map((i) => circle(6 + ((i * 37) % 108), y + 5 + ((i * 23) % Math.max(6, bottom - y - 8)), 1.3, SOIL2, null)), line(`M0 ${y} L120 ${y}`, '#6f8f4e', 2.4));
const house = (x: number, w: number, y1: number, y2: number, py: number, wall: string = C.grey2, roof: string = C.grey, sw = 1.6) =>
  all(path(`M${x - 3} ${y1} L${x + w / 2} ${py} L${x + w + 3} ${y1} Z`, roof, C.ink, sw), rect(x, y1, w, y2 - y1, wall, 0, C.ink, sw), rect(x + w / 2 - 3, y2 - 9, 6, 9, C.white, 0, C.ink, 1));
const drop = (x: number, y: number, s = 1, col: string = WATER) => path(`M${x} ${y - 4 * s} C${x + 3 * s} ${y} ${x + 3 * s} ${y + 3 * s} ${x} ${y + 3 * s} C${x - 3 * s} ${y + 3 * s} ${x - 3 * s} ${y} ${x} ${y - 4 * s} Z`, col, C.ink, 0.7);
const rain = (x0: number, x1: number, y: number, n = 8) => all(...range(n).map((i) => line(`M${x0 + (i * (x1 - x0)) / Math.max(1, n - 1)} ${y + (i % 2) * 5} l-3 7`, WATER, 1.8)));
const cloud = (x: number, y: number, s = 1, fill: string = C.grey) => g(`translate(${x} ${y}) scale(${s})`, path('M-16 6 C-23 6 -23 -5 -15 -5 C-14 -14 -2 -16 2 -9 C7 -16 18 -12 16 -4 C23 -4 23 6 16 6 Z', fill, C.ink, 1.4));
/** Pipe drawn as a thick coloured line with an ink outline. */
const pipe = (d: string, col: string, w = 6) => line(d, C.ink, w + 2) + line(d, col, w);
/** Street lamp: pole at x from ground to top, arm to head at hx. */
const lamp = (x: number, top: number, hx: number, pole: string = C.grey, head: string = C.dark, glass: string = GLOW) =>
  all(rect(x - 2.5, top, 5, 112 - top, pole, 1, C.ink, 1.4), pipe(`M${x} ${top + 2} C${x} ${top - 6} ${hx - 6} ${top - 7} ${hx} ${top - 4}`, pole, 3),
    path(`M${hx - 9} ${top - 5} L${hx + 9} ${top - 5} L${hx + 6} ${top} L${hx - 6} ${top} Z`, head, C.ink, 1.2), ellipse(hx, top + 0.6, 5, 1.4, glass, null));
const cone = (x: number, top: number, w: number, col: string = GLOW, op = 0.8) => `<path d="M${x - 5} ${top} L${x + 5} ${top} L${x + w} 110 L${x - w} 110 Z" fill="${col}" opacity="${op}"/>` + `<ellipse cx="${x}" cy="110" rx="${w}" ry="3" fill="${col}" opacity="${op}"/>`;
const small = (x: number, s: number, top: string = C.green, more = {}) => g(`translate(${x} 112) scale(${s}) translate(${-x} -112)`, figure({ x, top, ...more }));
const coin = (x: number, y: number, r = 5) => all(circle(x, y, r, C.gold, C.ink, 1.2), circle(x, y, r * 0.6, 'none', '#b88a1e', 0.9));
const bin = (x: number, y: number, col: string, w = 14, h = 20) => all(path(`M${x} ${y} L${x + w} ${y} L${x + w - 1.5} ${y + h} L${x + 1.5} ${y + h} Z`, col, C.ink, 1.3), rect(x - 1.5, y - 3, w + 3, 3.5, col, 1, C.ink, 1.2), circle(x + 3, y + h + 1, 1.8, C.dark, null), circle(x + w - 3, y + h + 1, 1.8, C.dark, null));
const bag = (x: number, y: number, col = '#3d3f4a', s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-5 -4 C-6 4 -5 7 0 7 C5 7 6 4 5 -4 Z', col, C.ink, 1), path('M-2 -4 L-3 -8 M2 -4 L3 -8', 'none', C.ink, 1));
const tree = (x: number, s = 1, col = '#6fa65a') => g(`translate(${x} 112) scale(${s})`, rect(-2, -16, 4, 16, WOOD, 1, C.ink, 1), circle(0, -24, 11, col, C.ink, 1.2));
const truck = (x: number, y: number, col: string = C.green, s = 1) => g(`translate(${x} ${y}) scale(${s})`, rect(0, -18, 30, 18, col, 2, C.ink, 1.4), path('M30 -14 L40 -14 L44 -6 L44 0 L30 0 Z', col, C.ink, 1.4), rect(33, -12, 6, 5, '#cfe8f6', 1, C.ink, 0.8), circle(8, 2, 4, C.dark, C.ink, 1), circle(36, 2, 4, C.dark, C.ink, 1));
const flame = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -12 C6 -6 8 -1 5 3 C3 6 -3 6 -5 3 C-8 -1 -3 -4 -1 -9 C0 -6 1 -6 0 -12 Z', C.orange, C.ink, 1), path('M0 -3 C2 -1 3 1 1 4 C0 5 -2 5 -2 3 C-3 1 -1 -1 0 -3 Z', C.yellow, null));
const grate = (x: number, y: number, w = 12) => all(rect(x, y, w, 3, C.dark, 0, C.ink, 1), ...range(Math.floor(w / 3)).map((i) => line(`M${x + 1.5 + i * 3} ${y} L${x + 1.5 + i * 3} ${y + 3}`, C.grey, 0.8)));
const arrowsAlong = (pts: Array<[number, number, number, number]>, col: string, sw = 2.4) => all(...pts.map(([a, b, c, d]) => arrow(a, b, c, d, col, sw)));
const spade = (x: number, y: number, s = 1, r = 0) => g(`translate(${x} ${y}) rotate(${r}) scale(${s})`, path('M-5 0 L5 0 L5 -10 L-5 -10 Z', C.silver, C.ink, 1), line('M0 -10 L0 -34', WOOD, 2.6), line('M-4 -34 L4 -34', WOOD, 2.6));

export const CITYT_MOTIFS: Record<string, Svg> = {
  // ── Gatubelysning ─────────────────────────────────────────────────
  // lyktstolpe: daylight street; one tall pole with its arm and head stands out in orange, a grey house and tree behind.
  'cityt.lyktstolpe': all(sky('#dcecf6'), house(8, 30, 74, 106, 56), tree(100, 0.9, '#b9c9b0'), rect(0, 106, 120, 6, CONC, 0, null), ground(106),
    rect(56, 22, 7, 84, HL, 1, C.ink, 1.6), rect(52, 100, 15, 8, HL, 1, C.ink, 1.6), pipe('M59.5 24 C59 12 72 10 84 15', HL, 4),
    path('M76 14 L96 14 L92 21 L80 21 Z', C.dark, C.ink, 1.4), ellipse(86, 21.6, 6, 1.6, '#fff3b0', null)),
  // armatur: close-up of the lamp head on top of a grey pole: the flat head is orange, its glass underneath is full of yellow LED dots.
  'cityt.armatur': all(sky('#dcecf6'), rect(57, 50, 6, 62, C.grey, 1, C.ink, 1.4), ground(),
    path('M14 26 L106 26 C108 26 108 30 106 32 L96 46 L24 46 L14 32 C12 30 12 26 14 26 Z', HL, C.ink, 2.2), rect(52, 40, 16, 12, C.grey, 1, C.ink, 1.4),
    rect(28, 46, 64, 7, '#fff3b0', 2, C.ink, 1.4), ...range(10).map((i) => circle(32 + i * 6.2, 49.5, 1.8, C.yellow, C.ink, 0.6)),
    ...range(5).map((i) => line(`M${36 + i * 12} 58 L${32 + i * 14} 74`, '#f2d36b', 1.6, '3 3'))),
  // slockna: night, three street lamps; the outer two still throw yellow light, the light of the middle one goes out.
  'cityt.slockna': all(sky(), rect(0, 108, 120, 4, '#3d4560', 0, null),
    cone(26, 32, 14), cone(94, 32, 14), cone(60, 32, 14),
    lamp(16, 32, 26), lamp(84, 32, 94), lamp(50, 32, 60),
    moving('cityt-slockna', '0%,25%{opacity:0}70%,100%{opacity:1}', { dur: 3.2 },
      `<path d="M54 32.5 L66 32.5 L75 111 L45 111 Z" fill="${NIGHT}"/>`, rect(44, 107, 32, 5, '#3d4560', 0, null), ellipse(60, 32.6, 5, 1.6, '#7a7f8c', null)),
    circle(102, 12, 1.2, C.white, null), circle(12, 18, 1, C.white, null)),
  // ljuskägla: night; under one lamp a broad yellow cone of light reaches the ground, a person stands inside it, the rest is dark.
  'cityt.ljuskägla': all(sky(), rect(0, 108, 120, 4, '#3d4560', 0, null),
    `<path d="M58 26 L70 26 L98 110 L30 110 Z" fill="${GLOW}" opacity="0.9"/>`, `<ellipse cx="64" cy="110" rx="34" ry="4" fill="${GLOW}"/>`,
    line('M58 26 L30 110 M70 26 L98 110', HL, 2, '4 3'), lamp(34, 26, 64), small(70, 0.62, C.red, { hairStyle: 'long' })),
  // upplyst: grey, dark path with a lamp that is off (grey reference) beside the same path lit warm by two lamps.
  'cityt.upplyst.2': all(rect(0, 0, 58, 120, '#3a3d48', 0, null), rect(62, 0, 58, 120, '#fdf1c8', 0, null), line('M60 4 L60 116', C.ink, 2),
    path('M18 112 L28 70 L34 70 L44 112 Z', '#55585f', null), lamp(12, 40, 20, '#6b6e75', '#55585f', '#6b6e75'),
    path('M80 112 L88 70 L94 70 L104 112 Z', '#f4c56a', C.ink, 1), cone(76, 40, 14, GLOW, 0.9), cone(108, 40, 12, GLOW, 0.9), lamp(70, 40, 78, HL, C.dark), lamp(114, 40, 108, HL, C.dark)),

  // ── Fibernät ──────────────────────────────────────────────────────
  // fibernät: cross-section; three houses on the ground, and under them glowing orange lines run from a grey node box to each house.
  'cityt.fibernät': all(sky('#dcecf6'), soil(64), house(10, 22, 46, 64, 32), house(48, 22, 46, 64, 32), house(86, 22, 46, 64, 32),
    rect(4, 90, 14, 12, C.grey, 1, C.ink, 1.4),
    pipe('M18 96 L100 96', HL, 3), pipe('M22 96 L22 72 L21 64', HL, 2.4), pipe('M60 96 L60 64', HL, 2.4), pipe('M98 96 L98 64', HL, 2.4),
    ...[[40, 96], [80, 96], [22, 80], [60, 80], [98, 80]].map(([x, y]) => circle(x!, y!, 2.2, GLOW, null))),
  // fiberkabel: close-up of a thick orange cable that ends in a cut face full of thin glass strands; light shines out of them.
  'cityt.fiberkabel': all(sky('#e8f2f8'), path('M4 92 C30 92 40 60 70 58 L78 58 L78 86 L70 86 C48 88 34 112 4 112 Z', HL, C.ink, 2),
    ellipse(78, 72, 9, 14, '#2e2e36', C.ink, 2), ...[[78, 64], [74, 69], [82, 69], [78, 72], [74, 76], [82, 76], [78, 80]].map(([x, y]) => circle(x!, y!, 2.1, '#cfe8f6', C.ink, 0.6)),
    ...[[64, -18], [70, -9], [74, 0], [70, 9], [64, 18]].map(([dx, dy]) => line(`M88 ${72 + dy! / 3} L${88 + dx! / 2} ${72 + dy!}`, '#f2c14e', 2.2)),
    ...[[112, 54], [116, 66], [116, 78], [112, 90]].map(([x, y]) => circle(x!, y!, 2.4, GLOW, null))),
  // anslutning: one house; from its wall a short orange line with a plug goes down to the grey main line under the street.
  'cityt.anslutning.2': all(sky('#dcecf6'), soil(70), house(24, 40, 40, 70, 18), rect(86, 66, 34, 4, ASPH, 0, null),
    pipe('M0 98 L120 98', C.grey, 5), pipe('M58 66 L58 98', HL, 3.4), rect(53, 56, 10, 10, C.white, 2, C.ink, 1.4), circle(56, 61, 1.2, C.ink, null), circle(60, 61, 1.2, C.ink, null),
    circle(58, 98, 4.6, HL, C.ink, 1.6), arrow(70, 88, 61, 95, HL, 2.2)),
  // fiberförening: countryside; three neighbours dig a long trench together between red farmhouses, an orange cable lies in it.
  'cityt.fiberförening': all(sky('#dcecf6'), rect(0, 84, 120, 28, GRASS, 0, null), house(4, 22, 64, 84, 50, '#b5463a'), house(94, 22, 64, 84, 50, '#b5463a'),
    path('M0 100 L120 96 L120 102 L0 106 Z', SOIL2, C.ink, 1), pipe('M0 103 L120 99', HL, 2.4),
    small(36, 0.5, C.green), spade(46, 100, 0.55, 20), small(62, 0.5, C.sky, { hairStyle: 'long' }), spade(72, 99, 0.55, 20), small(88, 0.5, C.yellow), spade(78, 99, 0.55, -20)),
  // tomtgräns: plan seen from above; a green plot with a house roof and a hedge, its edge is a dashed orange line with marker posts; grey street and neighbour plot.
  'cityt.tomtgräns': all(rect(0, 0, 120, 120, '#c9d9b8', 0, null), rect(0, 92, 120, 28, ASPH, 0, null), line('M0 106 L120 106', C.white, 2, '8 6'),
    rect(14, 12, 64, 76, GRASS, 0, null), rect(30, 26, 30, 24, '#b5463a', 1, C.ink, 1.6), line('M30 38 L60 38', C.ink, 1.2), ...range(7).map((i) => circle(20 + i * 8, 82, 3.6, '#4f8a3f', C.ink, 0.8)),
    rect(14, 12, 64, 76, 'none', 0, HL, 3), `<rect x="14" y="12" width="64" height="76" fill="none" stroke="${C.white}" stroke-width="1.2" stroke-dasharray="5 5"/>`,
    ...[[14, 12], [78, 12], [14, 88], [78, 88]].map(([x, y]) => circle(x!, y!, 3, HL, C.ink, 1.2)), rect(84, 12, 32, 76, '#dbe6cf', 0, null), rect(92, 26, 18, 18, C.grey2, 1, C.ink, 1)),
  // skyddsrör: a narrow trench in the soil; an empty orange plastic pipe lies in it, its open end shows that it is hollow.
  'cityt.skyddsrör': all(sky('#dcecf6'), soil(52), rect(0, 60, 120, 44, '#d9b88f', 0, null), line('M0 60 L120 60 M0 104 L120 104', SOIL2, 1.6), path('M70 52 C78 38 100 38 108 52 Z', SOIL2, C.ink, 1.2),
    path('M4 86 L100 86 L100 100 L4 100 Z', HL, C.ink, 2), ellipse(100, 93, 4, 7, '#c9531f', C.ink, 1.6), ellipse(100, 93, 2.4, 4.6, '#4a2a1a', null), line('M6 89 L98 89', '#f6b98d', 1.6),
    spade(92, 46, 0.7, 10)),
  // blåsa in: a machine with a fan at the left pushes the cable into the orange pipe with air; puffs of air and the cable move into the pipe.
  'cityt.blåsa-in.2': all(sky('#e8f2f8'), soil(76), rect(6, 46, 34, 30, C.yellow, 2, C.ink, 1.6), circle(23, 61, 10, C.white, C.ink, 1.4), path('M23 61 L23 52 C28 53 30 57 23 61 M23 61 L32 64 C30 69 26 70 23 61 M23 61 L15 66 C13 61 15 57 23 61', C.grey, C.ink, 1),
    pipe('M40 70 C56 70 56 92 70 92 L120 92', HL, 8), line('M40 70 C56 70 56 92 70 92 L118 92', '#f6b98d', 2),
    moving('cityt-blasa', '0%{transform:translate(-36px,0);opacity:.2}60%,100%{transform:translate(0,0);opacity:1}', { dur: 2.8 },
      line('M58 92 L106 92', C.ink, 2.4), ...[[66, 84], [80, 84], [94, 84]].map(([x, y]) => all(arrow(x!, y!, x! + 9, y!, '#5aa7d6', 1.8))))),
  // mediaomvandlare: a small white box on the wall with green lamps (orange frame); the thin orange fibre comes in from below, a grey cable goes to the router.
  'cityt.mediaomvandlare': all(rect(0, 0, 120, 120, '#efe8dc', 0, null), rect(0, 100, 120, 12, '#c9b393', 0, null), ground(),
    rect(26, 28, 38, 46, C.white, 4, HL, 3.4), ...[0, 1, 2].map((i) => circle(36 + i * 9, 40, 2.4, '#4fbf5a', C.ink, 0.8)), rect(34, 56, 22, 6, C.grey2, 1, C.ink, 1),
    pipe('M45 74 L45 100', HL, 2.2), pipe('M60 66 C74 66 74 84 86 84', C.grey, 2.6),
    rect(78, 84, 34, 14, C.dark, 2, C.ink, 1.4), line('M84 84 L82 66 M106 84 L108 66', C.dark, 2), circle(90, 91, 1.6, '#4fbf5a', null), circle(96, 91, 1.6, '#4fbf5a', null), rect(72, 98, 46, 4, '#b98652', 0, C.ink, 1)),
  // kopparnät: old brown wooden telephone poles along a country road with sagging copper-coloured wires; a small house with an old phone in the window.
  'cityt.kopparnät': all(sky('#dcecf6'), rect(0, 98, 120, 14, GRASS, 0, null), house(84, 30, 76, 104, 58), rect(90, 82, 10, 8, '#cfe8f6', 0, C.ink, 1), path('M92 88 C92 84 98 84 98 88 Z', C.dark, null),
    ...[14, 54].map((x) => all(rect(x - 2.5, 26, 5, 80, WOOD, 1, C.ink, 1.4), rect(x - 9, 30, 18, 3, WOOD, 0, C.ink, 1), circle(x - 7, 29, 1.6, C.white, C.ink, 0.6), circle(x + 7, 29, 1.6, C.white, C.ink, 0.6))),
    line('M7 30 C24 42 38 42 47 30 M21 30 C34 40 48 40 61 30 M47 30 C64 42 80 52 90 76 M61 30 C76 42 86 54 96 76', COPPER, 2.4)),

  // ── Fjärrvärmenät ─────────────────────────────────────────────────
  // fjärrvärmenät: cross-section of a town; from a plant with a chimney a red and a blue pipe run side by side under the ground and branch up to every house.
  'cityt.fjärrvärmenät': all(sky('#dcecf6'), soil(62), rect(4, 30, 26, 32, C.grey2, 0, C.ink, 1.6), rect(18, 10, 6, 20, C.grey, 0, C.ink, 1.4), cloud(24, 6, 0.5, C.white),
    house(42, 18, 46, 62, 34), house(68, 18, 46, 62, 34), house(94, 18, 46, 62, 34),
    pipe('M22 62 L22 86 L104 86 L104 62', HOT, 3.2), pipe('M14 62 L14 94 L110 94 L110 66 L100 62', COLD, 3.2), pipe('M51 86 L51 62', HOT, 2.4), pipe('M77 86 L77 62', HOT, 2.4), pipe('M57 94 L57 62', COLD, 2.4), pipe('M83 94 L83 62', COLD, 2.4),
    rect(8, 80, 108, 20, 'none', 2, HL, 1.6)),
  // värmeverk: a plant that only makes heat: a hall with a tall chimney, a pile of wood chips and a fire inside; only a red hot-water pipe leaves it, no power lines.
  'cityt.värmeverk': all(sky('#dcecf6'), ground(), rect(30, 50, 56, 62, HL, 0, C.ink, 2), rect(70, 12, 10, 38, C.grey, 0, C.ink, 1.6), cloud(80, 8, 0.6, C.white), cloud(92, 4, 0.4, C.white),
    rect(40, 72, 22, 18, '#3d3f4a', 1, C.ink, 1.4), flame(51, 88, 1.1), rect(66, 62, 12, 10, '#cfe8f6', 1, C.ink, 1),
    path('M2 112 C6 92 22 92 28 112 Z', '#b98652', C.ink, 1.4), ...range(8).map((i) => rect(6 + (i * 5) % 18, 100 + (i % 3) * 3, 3, 2, '#7a5530', 0, null)),
    pipe('M86 98 L118 98', HOT, 4)),
  // hetvatten: cut-open pipe full of red-hot water under pressure, a thermometer showing 120° and a pressure gauge with the needle far up; no bubbles.
  'cityt.hetvatten': all(sky('#e8f2f8'), rect(6, 54, 108, 30, C.grey, 4, C.ink, 2), rect(12, 58, 96, 22, HL, 2, C.ink, 1.2), ...range(5).map((i) => line(`M${18 + i * 18} 69 C${24 + i * 18} 64 ${28 + i * 18} 74 ${34 + i * 18} 69`, '#f6b98d', 1.6)),
    rect(20, 12, 10, 40, C.white, 5, C.ink, 1.4), rect(23, 16, 4, 32, HOT, 2, null), circle(25, 50, 6, HOT, C.ink, 1.4),
    `<text x="46" y="30" font-family="system-ui,sans-serif" font-weight="800" font-size="13" text-anchor="middle" fill="${HOT}">120°</text>`,
    circle(88, 30, 14, C.white, C.ink, 1.6), path('M78 38 A13 13 0 0 1 98 38', 'none', C.grey2, 2), line('M88 30 L97 22', HOT, 2.4), circle(88, 30, 2, C.ink, null), rect(85, 44, 6, 10, C.grey, 0, C.ink, 1.2)),
  // kulvert: under a street with a car, an orange concrete channel in the soil carries two pipes and cables.
  'cityt.kulvert': all(sky('#dcecf6'), soil(46), rect(0, 40, 120, 6, ASPH, 0, null), truck(70, 38, C.sky, 0.6),
    rect(22, 64, 76, 38, CONC, 3, HL, 3.4), rect(28, 70, 64, 26, '#e9e4d8', 1, null), circle(44, 84, 8, HOT, C.ink, 1.6), circle(66, 84, 8, COLD, C.ink, 1.6), circle(84, 78, 3, C.dark, C.ink, 1), circle(84, 88, 3, C.dark, C.ink, 1)),
  // framledning: a heat plant at the left and a house at the right; the upper red pipe is thick with arrows TO the house, the lower return pipe is thin and grey.
  'cityt.framledning': all(sky('#f6f2ea'), ground(), rect(4, 52, 28, 60, C.grey2, 0, C.ink, 1.6), rect(16, 34, 6, 18, C.grey, 0, C.ink, 1.2), flame(18, 96, 1),
    house(88, 26, 68, 112, 50), pipe('M32 72 L90 72', HOT, 7), arrowsAlong([[38, 62, 52, 62], [58, 62, 72, 62], [76, 62, 88, 62]], HOT, 2.6),
    pipe('M32 98 L88 98', C.grey2, 3)),
  // returledning: the same plant and house; now the lower blue pipe is thick with arrows BACK to the plant, the upper pipe is thin and grey.
  'cityt.returledning': all(sky('#f6f2ea'), ground(), rect(4, 52, 28, 60, C.grey2, 0, C.ink, 1.6), rect(16, 34, 6, 18, C.grey, 0, C.ink, 1.2), flame(18, 96, 1),
    house(88, 26, 68, 112, 50), pipe('M32 72 L88 72', C.grey2, 3), pipe('M32 98 L90 98', COLD, 7),
    arrowsAlong([[86, 88, 72, 88], [66, 88, 52, 88], [46, 88, 34, 88]], COLD, 2.6)),
  // fjärrvärmecentral: in a basement a white cabinet (orange frame) with a display and gauges; a red and a blue pipe come up from the floor into it.
  'cityt.fjärrvärmecentral': all(rect(0, 0, 120, 120, '#dcd6cb', 0, null), rect(0, 104, 120, 8, '#a59d90', 0, null), ground(),
    rect(34, 18, 52, 74, C.white, 3, HL, 3.4), rect(44, 26, 32, 12, '#2e2e36', 1, C.ink, 1), line('M48 32 L56 32 M60 32 L72 32', '#4fbf5a', 2),
    circle(48, 52, 6, C.white, C.ink, 1.2), line('M48 52 L52 48', HOT, 1.6), circle(72, 52, 6, C.white, C.ink, 1.2), line('M72 52 L69 48', COLD, 1.6), rect(42, 64, 36, 10, C.grey2, 2, C.ink, 1),
    pipe('M48 92 L48 112', HOT, 4), pipe('M72 92 L72 112', COLD, 4), pipe('M86 70 L116 70', C.grey, 3)),

  // ── Avfallshantering ──────────────────────────────────────────────
  // avfallshantering: the whole chain in a loop of arrows: a house with a bin, a refuse truck, a plant with a chimney and a recycling bale.
  'cityt.avfallshantering': all(sky('#f6f2ea'), house(10, 24, 30, 52, 16), bin(40, 34, '#4f9d69', 10, 16), truck(70, 50, C.green, 0.8),
    rect(76, 76, 30, 24, C.grey2, 0, C.ink, 1.4), rect(96, 60, 6, 16, C.grey, 0, C.ink, 1), rect(14, 80, 24, 18, '#7fb35a', 2, C.ink, 1.4), line('M14 89 L38 89', C.ink, 1),
    arrowsAlong([[54, 42, 68, 42], [100, 54, 100, 70], [72, 92, 44, 92], [24, 76, 24, 58]], HL, 3)),
  // fyrfackskärl: a big green bin with the lid open; seen from above inside it has four coloured compartments with a bottle, paper, a can and an apple core.
  'cityt.fyrfackskärl': all(sky('#f6f2ea'), ground(), path('M30 54 L90 54 L86 108 L34 108 Z', '#4f9d69', C.ink, 2), circle(38, 110, 3.4, C.dark, null), circle(82, 110, 3.4, C.dark, null),
    path('M28 54 L92 54 L100 22 L36 22 Z', '#3e7f55', C.ink, 1.8), path('M32 50 L88 50 L94 26 L40 26 Z', '#e9e4d8', C.ink, 1.4), line('M37 38 L91 38 M64 26 L60 50', HL, 2.4),
    rect(48, 28, 5, 9, '#7fc0e8', 1, C.ink, 0.8), rect(72, 29, 10, 7, C.white, 0, C.ink, 0.8), rect(45, 41, 7, 7, C.silver, 1, C.ink, 0.8), circle(76, 44, 3.4, '#c94a3a', C.ink, 0.8),
    rect(30, 20, 72, 4, '#3e7f55', 2, C.ink, 1.4)),
  // sopnedkast: section of a block of flats; in the stairwell a hand drops a bag into an open metal hatch, a dashed chute leads down to a container in the basement.
  'cityt.sopnedkast': all(rect(0, 0, 120, 120, '#efe8dc', 0, null), line('M0 40 L120 40 M0 76 L120 76', C.grey, 2), rect(0, 96, 120, 16, '#a59d90', 0, null),
    rect(56, 6, 18, 100, '#d6d0c4', 0, null), line('M56 6 L56 96 M74 6 L74 96', C.grey, 1.4, '4 3'),
    rect(54, 20, 22, 16, HL, 2, C.ink, 1.8), path('M56 22 L74 22 L80 12 L62 12 Z', C.silver, C.ink, 1.4), bag(66, 16, '#3d3f4a', 0.9), path('M86 14 C80 12 76 14 72 16 L74 20 C80 20 84 20 88 22 Z', C.skin, C.ink, 1.2),
    rect(48, 98, 34, 14, C.dark, 1, C.ink, 1.4), arrow(65, 60, 65, 92, HL, 2.6), bag(64, 102, '#55585f', 0.7),
    line('M10 76 L30 76 L30 64 L44 64 L44 52', C.grey, 2)),
  // sopsug: a slim inlet column on a courtyard; under the ground a pipe carries bags with air to a far terminal building with a container.
  'cityt.sopsug': all(sky('#dcecf6'), soil(62), rect(14, 30, 12, 32, C.silver, 3, C.ink, 1.6), rect(16, 36, 8, 6, C.dark, 1, null),
    pipe('M20 62 L20 92 L96 92 L96 70', HL, 8), rect(84, 34, 32, 28, C.grey2, 0, C.ink, 1.6), rect(90, 46, 20, 16, C.dark, 0, C.ink, 1),
    moving('cityt-sopsug', '0%{transform:translate(-40px,0);opacity:.2}60%,100%{transform:translate(0,0);opacity:1}', { dur: 2.4 }, bag(50, 92, '#3d3f4a', 0.6), bag(68, 92, '#4f9d69', 0.6)),
    arrowsAlong([[34, 84, 46, 84], [72, 84, 84, 84]], '#5aa7d6', 1.8)),
  // underjordsbehållare: only a short column with a lid stands on the ground; below it a big orange container fills a deep hole, a crane hook is fastened on top.
  'cityt.underjordsbehållare': all(sky('#dcecf6'), soil(52), path('M36 56 L84 56 L82 108 L38 108 Z', HL, C.ink, 2), line('M38 70 L82 70', '#c9531f', 1.4),
    rect(46, 30, 28, 22, C.grey, 2, C.ink, 1.6), rect(50, 36, 20, 5, C.dark, 1, null), rect(44, 28, 32, 4, C.dark, 1, C.ink, 1.2),
    line('M60 28 L60 10', C.ink, 1.6), path('M56 10 C56 4 64 4 64 10', 'none', C.ink, 1.6), pipe('M60 4 L112 4', C.yellow, 4)),
  // insamling: a refuse truck drives along a row of different coloured bins; arrows show how everything is gathered into the truck.
  'cityt.insamling.2': all(sky('#f6f2ea'), rect(0, 106, 120, 6, ASPH, 0, null), ground(106),
    bin(6, 66, '#4f9d69'), bin(26, 66, '#3f6fb5'), bin(46, 66, '#8a6a3a'), bin(66, 66, C.grey), truck(72, 102, HL, 1),
    arrowsAlong([[13, 60, 80, 70], [33, 58, 84, 72], [53, 58, 88, 76], [73, 60, 92, 78]], HL, 1.8)),
  // avfallstrappa: a staircase of five steps from green at the top to red at the bottom: a crossed-out cart, a chair, a recycling loop, a flame and a landfill heap.
  'cityt.avfallstrappa': all(sky('#f6f2ea'), ...[['#4f9d69', 0], ['#8fbf5a', 1], ['#f2c14e', 2], ['#ef8a3c', 3], ['#d64545', 4]].map(([col, i]) => rect(8 + (i as number) * 4, 10 + (i as number) * 20, 104 - (i as number) * 8, 18, col as string, 2, C.ink, 1.4)),
    g('translate(60 19)', rect(-8, -4, 14, 8, C.white, 1, C.ink, 1), circle(-5, 6, 1.6, C.ink, null), circle(3, 6, 1.6, C.ink, null), line('M-11 -7 L11 7', C.red, 2.4)),
    g('translate(60 39)', rect(-6, -1, 12, 2, WOOD, 0, C.ink, 0.8), rect(-6, -8, 2, 7, WOOD, 0, C.ink, 0.8), line('M-5 1 L-5 6 M5 1 L5 6', WOOD, 1.6)),
    g('translate(60 59)', path('M-6 2 A6 6 0 1 1 6 2', 'none', C.ink, 1.8), path('M6 2 L8 -2 M6 2 L2 0', 'none', C.ink, 1.8)),
    flame(60, 83, 0.8), path('M48 106 C52 96 68 96 72 106 Z', '#8a6a3a', C.ink, 1.2)),

  // ── Dagvattensystem ───────────────────────────────────────────────
  // dagvattensystem: rain on a town; water from a roof and a street grate runs in orange-marked pipes and ditches to a pond and on to a river.
  'cityt.dagvattensystem': all(sky('#dcecf6'), cloud(30, 10, 0.8), rain(16, 46, 18, 6), soil(56), house(6, 26, 36, 56, 22), rect(32, 52, 50, 4, ASPH, 0, null), grate(52, 52),
    path('M86 58 C92 66 108 66 116 58 Z', WATER, C.ink, 1.2), pipe('M30 40 L34 40 L34 76 L58 76 L58 58', HL, 2.4), pipe('M58 76 L96 76 L96 62', HL, 2.4), pipe('M104 64 L104 100 L120 100', HL, 2.4),
    arrowsAlong([[40, 80, 52, 80], [72, 80, 86, 80], [108, 104, 118, 104]], WATER, 1.8)),
  // dimensionera: heavy rain falls into a pipe opening; beside a small grey pipe a big orange pipe grows to the right size, a measuring arrow across it.
  'cityt.dimensionera': all(sky('#f6f2ea'), cloud(60, 12, 1.1), rain(36, 84, 22, 9), ground(),
    circle(22, 84, 8, C.grey2, C.ink, 1.4), circle(22, 84, 5, '#6b6f78', null),
    waGrow('cityt-dim', circle(76, 78, 26, HL, C.ink, 2), circle(76, 78, 19, '#4a2a1a', null), drop(70, 76, 1.2, WATER2), drop(82, 82, 1.2, WATER2)),
    arrow(50, 110, 102, 110, C.ink, 2), arrow(102, 110, 50, 110, C.ink, 2)),
  // fördröjningsmagasin: a car park on top; under the asphalt orange crates full of water hold the rain, with a grate above and a small outlet pipe.
  'cityt.fördröjningsmagasin': all(sky('#dcecf6'), rain(60, 110, 6, 6), soil(46), rect(0, 40, 120, 6, ASPH, 0, null), truck(14, 38, C.sky, 0.55), grate(80, 40),
    ...range(4).flatMap((c) => range(2).map((r) => all(rect(20 + c * 20, 62 + r * 20, 20, 20, WATER, 0, HL, 2), line(`M${20 + c * 20} ${62 + r * 20} L${40 + c * 20} ${82 + r * 20} M${40 + c * 20} ${62 + r * 20} L${20 + c * 20} ${82 + r * 20}`, '#c9531f', 0.8)))),
    pipe('M86 46 L86 62', C.grey, 2.4), pipe('M100 96 L118 96', C.grey, 2.4)),
  // svackdike: section across a road: the asphalt at left, then a wide, very shallow grass dip with a little water at the bottom, then lawn and a house.
  'cityt.svackdike': all(sky('#dcecf6'), rect(0, 66, 120, 46, SOIL, 0, null), rect(0, 60, 36, 6, ASPH, 0, C.ink, 1.2), path('M36 66 C50 66 54 82 66 82 C78 82 82 66 96 66 L96 70 C82 70 78 86 66 86 C54 86 50 70 36 70 Z', GRASS, HL, 2.6),
    path('M56 81 C62 84 70 84 76 81 Z', WATER, null), rect(96, 62, 24, 6, GRASS, 0, null), house(98, 18, 44, 62, 32), arrow(30, 56, 52, 70, WATER, 2.2), car(6, 60)),

  // ── Översvämningsskydd ────────────────────────────────────────────
  // översvämningsskydd: a high river at left; a permanent orange wall on an embankment holds it back, the town on the right stays dry and lower than the water.
  'cityt.översvämningsskydd': all(sky('#dcecf6'), rect(0, 96, 120, 16, SOIL, 0, null), path('M0 52 L44 52 L44 112 L0 112 Z', WATER, null), line('M0 52 L44 52', WATER2, 2),
    path('M44 112 L44 44 L54 44 L60 112 Z', HL, C.ink, 2), house(68, 20, 76, 96, 62), house(94, 20, 76, 96, 62), line('M60 52 L116 52', WATER, 1.4, '4 4')),
  // hundraårsregn: a black cloud pours very heavy rain over a street where the water reaches the wheels of a car; a calendar sheet shows 100.
  'cityt.hundraårsregn': all(sky('#c9d3dc'), cloud(54, 16, 1.6, '#4a4e5a'), ...range(14).map((i) => line(`M${18 + i * 6} ${30 + (i % 3) * 4} l-5 14`, WATER, 2.4)),
    rect(0, 92, 120, 20, WATER, 0, null), car(30, 96), house(84, 26, 66, 104, 50),
    rect(6, 44, 26, 26, C.white, 2, C.ink, 1.4), rect(6, 44, 26, 7, HL, 2, C.ink, 1.4),
    `<text x="19" y="66" font-family="system-ui,sans-serif" font-weight="800" font-size="11" text-anchor="middle" fill="${C.ink}">100</text>`),
  // skyfallskarta: a town map with streets; patches where water collects are light and dark blue, a house sits next to a dark patch, a small legend of blue shades.
  'cityt.skyfallskarta': all(rect(6, 8, 108, 104, '#f2efe4', 3, HL, 3), line('M6 40 L114 40 M6 78 L114 78 M40 8 L40 112 M82 8 L82 112', C.white, 6), line('M6 40 L114 40 M6 78 L114 78 M40 8 L40 112 M82 8 L82 112', C.grey2, 1),
    path('M44 44 C60 40 78 46 78 58 C76 72 56 74 46 66 C40 60 40 50 44 44 Z', '#a9d6f0', null), path('M52 52 C60 50 68 54 66 60 C62 66 54 64 52 52 Z', '#2f6fb0', null), path('M86 82 C98 80 110 86 108 98 C100 106 88 100 86 82 Z', '#5aa7d6', null),
    rect(20, 50, 12, 10, '#b5463a', 1, C.ink, 1.2), path('M18 50 L26 44 L34 50 Z', '#7a3a32', C.ink, 1), rect(12, 88, 8, 6, '#a9d6f0', 0, C.ink, 0.8), rect(12, 96, 8, 6, '#5aa7d6', 0, C.ink, 0.8), rect(12, 104, 8, 6, '#2f6fb0', 0, C.ink, 0.8)),
  // översvämningsbarriär: close-up of a street: a long orange tube filled with water lies across it; high water on the left, dry street and a house on the right.
  'cityt.översvämningsbarriär': all(sky('#dcecf6'), rect(0, 100, 120, 12, ASPH, 0, null), rect(0, 74, 48, 38, WATER, 0, null), line('M0 74 L48 74', WATER2, 2),
    path('M40 100 C40 70 66 70 66 100 Z', HL, C.ink, 2.2), path('M46 86 C50 80 58 80 62 86', 'none', '#f6b98d', 2), house(80, 30, 66, 100, 46), line('M66 100 L120 100', C.grey2, 1.6)),

  // ── Infrastrukturplanering ────────────────────────────────────────
  // sträckning: a landscape seen from above with a town at each end; the chosen route is an orange dashed line that bends round the lake, a grey dashed line cuts through the forest.
  'cityt.sträckning.2': all(rect(0, 0, 120, 120, '#d9e8c8', 0, null), path('M44 40 C60 30 80 40 76 56 C72 70 50 70 44 58 C40 50 40 46 44 40 Z', WATER, C.ink, 1.2),
    ...range(9).map((i) => circle(60 + (i % 3) * 9, 78 + Math.floor(i / 3) * 9, 5, '#4f8a3f', C.ink, 0.8)),
    rect(6, 54, 18, 14, C.grey2, 1, C.ink, 1.2), rect(96, 54, 18, 14, C.grey2, 1, C.ink, 1.2),
    line('M24 61 C40 100 90 100 96 61', C.grey, 2.4, '5 4'), line('M24 61 C30 20 92 16 96 61', C.ink, 5), line('M24 61 C30 20 92 16 96 61', HL, 3.4, '6 3')),
  // samhällsekonomisk: a big balance over a whole town: on one pan the costs (coins), on the other what society gains (people, a clock, a tree); grey: one small shop that only counts its own coin.
  'cityt.samhällsekonomisk': all(sky('#f6f2ea'), ...[10, 26, 42, 58, 74, 90, 104].map((x, i) => rect(x, 112 - 16 - (i % 3) * 8, 13, 16 + (i % 3) * 8, '#f6c9a8', 0, HL, 1.2)),
    line('M60 26 L60 84', C.ink, 3), line('M24 34 L96 30', C.ink, 3), line('M24 34 L18 52 M24 34 L32 52 M96 30 L88 48 M96 30 L104 48', C.ink, 1.2),
    path('M14 52 L36 52 C34 58 16 58 14 52 Z', C.grey2, C.ink, 1.2), coin(20, 48, 4), coin(28, 48, 4), coin(24, 42, 4),
    path('M84 48 L108 48 C106 54 86 54 84 48 Z', C.grey2, C.ink, 1.2), circle(90, 40, 3, C.skin, C.ink, 0.8), path('M86 47 C86 42 94 42 94 47 Z', C.sky, null), circle(100, 40, 4, C.white, C.ink, 0.8), line('M100 40 L100 37 M100 40 L102 41', C.ink, 0.8), tree(96, 0.3),
    g('translate(2 8) scale(0.6)', rect(0, 10, 22, 16, C.grey2, 0, C.grey, 1), path('M-2 10 L11 2 L24 10 Z', C.grey, null), circle(30, 18, 5, C.grey2, C.grey, 1))),
  // kostnadsökning: a bar chart; the grey bar reaches the dashed line of the budget, then the orange part of the second bar shoots up far above it, coins beside.
  'cityt.kostnadsökning': all(sky('#f6f2ea'), line('M14 104 L110 104 M14 104 L14 14', C.ink, 2), line('M14 62 L110 62', C.ink, 1.6, '5 4'),
    rect(28, 62, 24, 42, C.grey2, 1, C.ink, 1.4), rect(64, 62, 24, 42, C.grey2, 1, C.ink, 1.4),
    moving('cityt-kost', '0%{transform:translate(0,30px);opacity:.2}60%,100%{transform:translate(0,0);opacity:1}', { dur: 2.8 }, rect(64, 20, 24, 42, HL, 1, C.ink, 1.6), arrow(98, 56, 98, 22, HL, 3)),
    coin(104, 98, 5), coin(104, 90, 5), coin(104, 82, 5)),
};

// a small car seen from the side, wheels on y + 4
function car(x: number, y: number): Svg {
  return all(path(`M${x} ${y} L${x + 4} ${y - 6} L${x + 18} ${y - 6} L${x + 24} ${y} L${x + 28} ${y} L${x + 28} ${y + 4} L${x} ${y + 4} Z`, C.red, C.ink, 1.2), rect(x + 6, y - 5, 10, 4, '#cfe8f6', 0, null), circle(x + 6, y + 4, 2.6, C.dark, null), circle(x + 22, y + 4, 2.6, C.dark, null));
}
