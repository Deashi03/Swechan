/**
 * Teknik & digital värld → Byggnad & infrastruktur → Byggnadens konstruktion, 4111–4117 (0.59): foundations,
 * load-bearing walls, floor structures, roof trusses and roofs, facades and insulation, windows and doors, and
 * building materials.
 * Recurring signs: the part of the building that the word names is orange; the rest of the house is grey or drawn
 * in its natural colour, and soil is brown with small stones. Words that are easy to mix up get clearly different
 * scenes: grund (an orange foundation in the soil with the house still only a dashed outline above it), platta (a
 * thick flat slab in perspective lying on gravel, with thin stone tiles beside it, no house), krypgrund (the low
 * empty space under the floor, with a person crawling in it) and fundament (a single block under a flagpole);
 * vägg (a room wall with a picture and a clock), bärande vägg (a middle wall in a two-storey section with load
 * arrows), regel (one stud among many, close up, half covered by a board) and stomme (a whole house that is only
 * a frame); bjälklag (the thick layer between two rooms with people), undergolv (boards laid under parquet, close
 * up) and innertak (the ceiling seen from inside the room with a lamp); nock (the top line of a whole roof) and
 * takfot (close-up of the overhanging lower edge with a nest); hängränna (horizontal gutter, close up) and stuprör
 * (vertical pipe down a wall); vindskydd (wind arrows outside the wall) and ångspärr (steam from a pot inside,
 * stopped by a film); bruk (a bucket of mortar and a trowel), mura (a hand puts a brick on a wall) and puts (a
 * smooth layer that covers bricks).
 * Digits only; no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waBob, waIn, waPulse, type Svg } from './kit';
import { HL } from './people';
import { figure } from './figures';

// ── Palette and basics ───────────────────────────────────────────────
const SOIL = '#b98b5e';
const SOIL2 = '#8f6a45';
const CONC = '#cfcfca';
const WOOD = '#d9ad78';
const WOOD2 = '#b98652';
const WALL = '#ece6da';
const RED = '#b5463a';
const GLASS = '#cfe8f6';
const PALE = '#fde3d0';
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
/** Brown soil from y down to 112 with a few stones. */
const soil = (y: number) => all(rect(0, y, 120, 112 - y, SOIL, 0, null), ...range(14).map((i) => circle(8 + ((i * 37) % 104), y + 6 + ((i * 23) % Math.max(6, 100 - y)), 1.4, SOIL2, null)), line(`M0 ${y} L120 ${y}`, '#6f8f4e', 2.4));
/** Gravel bed: a band of small grey dots. */
const gravel = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, '#d8d2c4', 0, null), ...range(Math.floor(w / 4) * Math.max(1, Math.floor(h / 4))).map((i) => circle(x + 2 + (i * 4) % w, y + 2 + Math.floor((i * 4) / w) * 4, 1, C.grey, null)));
/** Simple gable house elevation: wall from y1 to y2, roof peak at py. */
const house = (x: number, w: number, y1: number, y2: number, py: number, wall: string = C.grey2, roof: string = C.grey, sw = 1.8) =>
  all(path(`M${x - 4} ${y1} L${x + w / 2} ${py} L${x + w + 4} ${y1} Z`, roof, C.ink, sw), rect(x, y1, w, y2 - y1, wall, 0, C.ink, sw));
const win = (x: number, y: number, w = 14, h = 14) => all(rect(x, y, w, h, GLASS, 1, C.ink, 1.4), line(`M${x + w / 2} ${y} L${x + w / 2} ${y + h} M${x} ${y + h / 2} L${x + w} ${y + h / 2}`, C.ink, 1));
const drop = (x: number, y: number, s = 1) => path(`M${x} ${y - 4 * s} C${x + 3 * s} ${y} ${x + 3 * s} ${y + 3 * s} ${x} ${y + 3 * s} C${x - 3 * s} ${y + 3 * s} ${x - 3 * s} ${y} ${x} ${y - 4 * s} Z`, '#5aa7d6', C.ink, 0.8);
const down = (x: number, y1: number, y2: number, col: string = HL, sw = 3.4) => arrow(x, y1, x, y2, col, sw);
/** Brick wall rows inside a box. */
const bricks = (x: number, y: number, w: number, rows: number, bw = 16, bh = 7, col: string = '#c8664a', joint: string = '#e9e1d2') =>
  all(rect(x, y, w, rows * bh, joint, 0, null), ...range(rows).flatMap((r) => range(Math.ceil(w / bw) + 1).map((i) => {
    const bx = x + i * bw - (r % 2 ? bw / 2 : 0), x0 = Math.max(x, bx + 0.8), x1 = Math.min(x + w, bx + bw - 0.8);
    return x1 > x0 ? rect(x0, y + r * bh + 0.8, x1 - x0, bh - 1.6, col, 0.6, C.ink, 0.6) : '';
  })));
/** Small crawling person seen from the side (head right). */
const crawler = (x: number, y: number) => all(ellipse(x, y, 9, 3.6, C.sky, C.ink, 1.2), circle(x + 11, y - 1, 3.6, C.skin, C.ink, 1.2), line(`M${x + 5} ${y + 2} L${x + 8} ${y + 6} M${x - 6} ${y + 2} L${x - 9} ${y + 6}`, C.navy, 2));
/** Hand holding something, seen from the side. */
const fist = (x: number, y: number) => all(ellipse(x, y, 6, 5, C.skin, C.ink, 1.4), line(`M${x - 3} ${y - 2} L${x + 3} ${y - 2}`, C.skin2, 1));
const flame = (x: number, y: number, s = 1, col: string = C.orange) => g(`translate(${x} ${y}) scale(${s})`, path('M0 -16 C8 -8 10 -2 7 4 C5 8 -5 8 -7 4 C-10 -2 -4 -6 -2 -12 C0 -8 2 -8 0 -16 Z', col, C.ink, 1.2), path('M0 -4 C3 -1 4 2 2 5 C0 6 -2 6 -3 4 C-4 1 -1 -1 0 -4 Z', C.yellow, null));
/** A stud wall section: vertical studs between top and bottom plates. */
const studs = (x: number, y: number, w: number, h: number, n: number, col: string = WOOD, hl = -1) =>
  all(rect(x, y, w, 5, col, 0, C.ink, 1.2), rect(x, y + h - 5, w, 5, col, 0, C.ink, 1.2), ...range(n).map((i) => rect(x + (i * (w - 6)) / (n - 1), y + 5, 6, h - 10, i === hl ? HL : col, 0, C.ink, 1.2)));
const truss = (x: number, y: number, w: number, h: number, col: string, sw = 2.2) =>
  line(`M${x} ${y} L${x + w / 2} ${y - h} L${x + w} ${y} Z M${x + w / 4} ${y} L${x + w / 2} ${y - h} L${x + (3 * w) / 4} ${y} M${x + w / 4} ${y} L${x + w * 0.36} ${y - h * 0.56} M${x + (3 * w) / 4} ${y} L${x + w * 0.64} ${y - h * 0.56}`, col, sw);
const snowCap = (d: string) => path(d, C.white, C.ink, 1.4);
const person = (x: number, top: string = C.green, more = {}) => figure({ x, top, ...more });

export const BSTRUC_MOTIFS: Record<string, Svg> = {
  // ── Grund och fundament ───────────────────────────────────────────
  // grund: an orange foundation lies in the soil; the house above it is not built yet, only a grey dashed outline.
  'bstruc.grund-noun': all(soil(70),
    line('M22 62 L22 30 L60 12 L98 30 L98 62', C.grey, 2, '4 4'), line('M22 30 L98 30', C.grey, 1.4, '4 4'),
    path('M16 62 L104 62 L104 72 L98 72 L98 92 L86 92 L86 72 L34 72 L34 92 L22 92 L22 72 L16 72 Z', HL, C.ink, 2),
    rect(14, 92, 24, 6, HL, 0, C.ink, 1.6), rect(82, 92, 24, 6, HL, 0, C.ink, 1.6)),
  // platta: a thick, flat slab seen in perspective, lying on gravel; two thin stone tiles lean beside it. No house.
  'bstruc.platta.3': all(ground(), gravel(8, 92, 84, 16),
    path('M10 84 L36 62 L104 62 L78 84 Z', '#f6b98d', C.ink, 2), path('M10 84 L78 84 L78 94 L10 94 Z', HL, C.ink, 2), path('M78 84 L104 62 L104 72 L78 94 Z', '#c9531f', C.ink, 2),
    path('M96 112 L100 80 L108 80 L104 112 Z', CONC, C.ink, 1.6), path('M104 112 L110 86 L116 86 L112 112 Z', '#b9b9b2', C.ink, 1.6)),
  // krypgrund: a low, empty space between the soil and the floor of the house; a person crawls in it with a lamp.
  'bstruc.krypgrund': all(soil(84), house(20, 80, 40, 66, 14),
    rect(14, 66, 92, 6, WOOD2, 0, C.ink, 1.8), rect(14, 72, 8, 22, CONC, 0, C.ink, 1.6), rect(98, 72, 8, 22, CONC, 0, C.ink, 1.6),
    rect(22, 72, 76, 12, PALE, 0, HL, 2.6), rect(100, 76, 4, 4, C.dark, 0, null), crawler(48, 80), path('M63 79 L82 74 L82 84 Z', '#fff3b0', null)),
  // sockel: a red wooden house; the grey band at the bottom of the wall, between the grass and the red boards, is orange.
  'bstruc.sockel.2': all(soil(96), path('M14 40 L60 12 L106 40 Z', C.grey, C.ink, 1.8), rect(18, 40, 84, 44, RED, 0, C.ink, 1.8),
    line(range(13).map((i) => `M${24 + i * 6} 40 L${24 + i * 6} 84`).join(' '), '#8e3329', 1), win(30, 52), win(74, 52), rect(52, 56, 14, 28, C.white, 1, C.ink, 1.4),
    rect(16, 84, 88, 12, HL, 0, C.ink, 2), line('M30 90 L40 90 M64 89 L76 91', '#c9531f', 1)),
  // fundament: a flagpole stands on a big orange concrete block that is half buried in the soil.
  'bstruc.fundament': all(soil(78), line('M60 74 L60 10', C.grey, 3), path('M61 12 L86 16 L61 22 Z', C.sky, C.ink, 1.2), circle(60, 9, 2.4, C.gold, C.ink, 1),
    path('M36 68 L44 62 L84 62 L76 68 Z', '#f6b98d', C.ink, 1.8), path('M36 68 L76 68 L76 100 L36 100 Z', HL, C.ink, 2), path('M76 68 L84 62 L84 94 L76 100 Z', '#c9531f', C.ink, 1.8)),
  // schakta: an excavator digs a pit next to a pile of soil; the bucket swings up with earth.
  'bstruc.schakta': all(soil(80), path('M12 80 L20 104 L56 104 L64 80 Z', '#7a5636', HL, 2.6), path('M72 80 C76 70 86 66 96 70 L104 80 Z', SOIL, C.ink, 1.4),
    rect(80, 56, 32, 18, C.yellow, 3, C.ink, 1.8), rect(96, 44, 14, 14, C.yellow, 2, C.ink, 1.8), rect(99, 47, 8, 7, GLASS, 1, C.ink, 1), rect(78, 74, 36, 8, C.dark, 4, C.ink, 1.4),
    moving('bstruc-dig', '0%,100%{transform:rotate(0)}50%{transform:rotate(14deg)}', { dur: 2.6 },
      line('M86 58 L66 34 L40 66', C.yellow, 5), line('M86 58 L66 34 L40 66', C.ink, 1), path('M32 62 L46 62 L44 76 L34 74 Z', C.grey, C.ink, 1.6), path('M34 64 C38 58 44 60 45 64 Z', '#7a5636', null))),
  // dränering: in a soil section by the foundation, an orange pipe with holes lies in gravel; water drops sink down to it.
  'bstruc.dränering': all(soil(40), rect(8, 14, 40, 26, C.grey2, 0, C.ink, 1.6), rect(8, 40, 22, 56, CONC, 0, C.ink, 1.8), rect(4, 92, 34, 8, CONC, 0, C.ink, 1.6),
    gravel(30, 74, 30, 26), circle(46, 88, 7, HL, C.ink, 2), ...[-3, 0, 3].map((d) => circle(46 + d, 84, 0.9, C.ink, null)),
    waIn('bstruc-drops', 0, -16, drop(56, 56), drop(70, 64), drop(84, 52), drop(62, 70)), arrow(56, 92, 100, 92, '#5aa7d6', 2.6), rect(100, 78, 12, 26, C.grey, 1, C.ink, 1.6)),
  // sättning: a house on clay has sunk on one side; it tilts, the wall has an orange crack and orange arrows point down.
  'bstruc.sättning': all(soil(84), path('M8 84 C30 88 60 92 112 98', 'none', SOIL2, 2),
    moving('bstruc-sink', '0%{transform:translate(0,-6px) rotate(-4deg)}60%,100%{transform:translate(0,0) rotate(0)}', { dur: 3, spin: true },
      g('rotate(4 60 70)', house(28, 64, 44, 84, 22), win(36, 54), win(70, 54), line('M60 46 L56 56 L62 62 L57 72 L61 80', HL, 2.6))),
    down(86, 98, 110), down(100, 96, 110)),

  // ── Bärande väggar ────────────────────────────────────────────────
  // vägg: inside a room, a large plain wall (orange outline) with a picture, a clock and a shelf; floor in front.
  'bstruc.vägg': all(rect(0, 92, 120, 20, WOOD, 0, null), line('M0 92 L120 92', C.ink, 1.6), rect(12, 10, 96, 82, WALL, 0, HL, 3),
    rect(26, 30, 30, 22, C.white, 1, C.ink, 1.8), path('M30 48 L38 38 L44 44 L48 40 L52 48 Z', C.green, null), circle(48, 36, 3, C.yellow, null),
    circle(84, 32, 9, C.white, C.ink, 1.8), line('M84 32 L84 26 M84 32 L88 34', C.ink, 1.4), rect(66, 62, 34, 4, WOOD2, 1, C.ink, 1.4), rect(72, 54, 6, 8, C.red, 1, C.ink, 1), rect(82, 56, 8, 6, C.sky, 1, C.ink, 1)),
  // bärande vägg: a two-storey section; the middle wall (orange) holds up the floor above, with heavy arrows on it. A dashed thin wall is grey.
  'bstruc.bärande-vägg': all(ground(), rect(10, 20, 100, 92, WALL, 0, C.ink, 2), rect(10, 58, 100, 8, C.grey, 0, C.ink, 1.6), path('M6 20 L60 4 L114 20 Z', C.grey, C.ink, 1.8),
    rect(54, 66, 10, 46, HL, 0, C.ink, 2), line('M88 66 L88 112', C.grey, 2, '3 3'), down(59, 26, 54), person(30, C.sky, { h: 0.42 }), g('translate(0 -46)', person(84, C.green, { h: 0.42 }))),
  // stomme: a whole house that is only a frame: studs, beams and roof trusses in orange, no walls yet.
  'bstruc.stomme': all(ground(), line('M14 112 L14 54 L106 54 L106 112 M14 54 L60 18 L106 54', HL, 3.2),
    line(range(7).map((i) => `M${27 + i * 13} 54 L${27 + i * 13} 112`).join(' '), HL, 2.2), line('M14 82 L106 82', HL, 2.2), line('M37 36 L37 54 M60 18 L60 54 M83 36 L83 54', HL, 1.8),
    rect(10, 108, 100, 4, C.grey, 0, C.ink, 1)),
  // regel: close up of a wall: wooden studs in a row, one of them orange; a board covers half the wall and a screw goes into the orange stud.
  'bstruc.regel.3': all(ground(), studs(10, 14, 100, 98, 6, WOOD, 2), rect(70, 14, 40, 98, '#eeeeea', 0, C.ink, 1.6),
    line('M60 60 L48 60', C.grey, 2.4), path('M48 56 L42 60 L48 64 Z', C.silver, C.ink, 1), path('M74 54 L94 54 L96 66 L74 66 Z', C.dark, C.ink, 1.4), rect(60, 58, 14, 4, C.grey, 1, C.ink, 1)),
  // last: a beam on two pillars carries heavy things (boxes, snow, a person); big orange arrows press it down and it bends a little.
  'bstruc.last.2': all(ground(), rect(14, 72, 12, 40, C.grey2, 0, C.ink, 1.8), rect(94, 72, 12, 40, C.grey2, 0, C.ink, 1.8), path('M10 66 Q60 74 110 66 L110 74 Q60 82 10 74 Z', WOOD, C.ink, 1.8),
    rect(26, 52, 18, 16, C.tan, 1, C.ink, 1.4), rect(30, 40, 12, 12, C.tan, 1, C.ink, 1.4), rect(74, 56, 22, 12, '#9aa3ad', 1, C.ink, 1.4), down(36, 8, 34), down(60, 8, 62), down(84, 8, 50)),
  // stötta: a wall below a floor has been taken away; an orange steel prop rises and holds the floor up.
  'bstruc.stötta.2': all(ground(), rect(6, 18, 108, 10, C.grey, 0, C.ink, 1.8), rect(6, 28, 108, 4, WOOD, 0, C.ink, 1), line('M40 32 L40 112 M80 32 L80 112', C.grey2, 2, '4 4'),
    moving('bstruc-prop', '0%{transform:translate(0,14px)}55%,100%{transform:translate(0,0)}', { dur: 2.6 }, rect(54, 32, 12, 4, HL, 0, C.ink, 1.4), rect(57, 36, 6, 40, HL, 0, C.ink, 1.6)),
    rect(55.5, 74, 9, 34, '#c9531f', 0, C.ink, 1.6), rect(50, 108, 20, 4, '#c9531f', 0, C.ink, 1.4), person(96, C.sky, { h: 0.7 })),
  // konstruktion: loose grey sticks lie in a pile on the left; an arrow leads to the same sticks joined into an orange bridge.
  'bstruc.konstruktion': all(ground(), line('M8 108 L34 104 M10 102 L36 108 M12 106 L30 98 M14 98 L38 104', C.grey, 3), arrow(38, 92, 52, 80, C.grey, 2.4),
    line('M52 96 L112 96 M52 96 L62 76 L72 96 L82 76 L92 96 L102 76 L112 96 M62 76 L102 76', HL, 3), rect(50, 96, 6, 16, C.grey2, 0, C.ink, 1.2), rect(108, 96, 6, 16, C.grey2, 0, C.ink, 1.2)),

  // ── Bjälklag ──────────────────────────────────────────────────────
  // bjälklag: two rooms on top of each other with a person in each; the thick layer between them, with beams inside, is orange.
  'bstruc.bjälklag': all(ground(), rect(8, 6, 104, 106, WALL, 0, C.ink, 2), rect(8, 50, 104, 16, HL, 0, C.ink, 2),
    ...range(6).map((i) => rect(14 + i * 17, 53, 8, 10, '#c9531f', 0, C.ink, 1)), line('M8 52 L112 52 M8 64 L112 64', C.ink, 1),
    person(40, C.sky, { h: 0.46 }), g('translate(0 -62)', person(76, C.green, { h: 0.46 }))),
  // undergolv: close up: grey beams at the bottom, orange boards laid over them, and a hand puts a parquet plank on top.
  'bstruc.undergolv': all(rect(0, 92, 120, 20, C.grey2, 0, null), ...range(4).map((i) => rect(8 + i * 30, 80, 14, 22, C.grey, 0, C.ink, 1.4)),
    path('M6 80 L114 80 L114 70 L6 70 Z', HL, C.ink, 2), line('M33 70 L33 80 M60 70 L60 80 M87 70 L87 80', C.ink, 1.2),
    path('M58 64 L112 64 L112 70 L58 70 Z', WOOD, C.ink, 1.6), line('M76 64 L76 70 M94 64 L94 70', WOOD2, 1), path('M34 50 L70 50 L70 56 L34 56 Z', WOOD, C.ink, 1.6), fist(30, 50), line('M24 46 L12 36', C.skin, 6)),
  // innertak: inside a room, seen from the floor: the ceiling (orange) with a hanging lamp; grey walls and a floor.
  'bstruc.innertak': all(path('M0 0 L120 0 L96 30 L24 30 Z', HL, C.ink, 2), path('M0 0 L24 30 L24 92 L0 112 Z', C.grey2, C.ink, 1.6), path('M120 0 L96 30 L96 92 L120 112 Z', C.grey2, C.ink, 1.6),
    rect(24, 30, 72, 62, WALL, 0, C.ink, 1.6), path('M0 112 L24 92 L96 92 L120 112 Z', WOOD, C.ink, 1.6), line('M60 14 L60 36', C.ink, 1.4), path('M50 44 L70 44 L64 36 L56 36 Z', C.yellow, C.ink, 1.6), rect(40, 50, 18, 14, C.white, 1, C.ink, 1.4)),
  // trapphål: a section through a floor: an opening in it, outlined in orange, with a staircase going up through it and a railing.
  'bstruc.trapphål': all(ground(), rect(6, 6, 108, 106, WALL, 0, C.ink, 1.8), rect(6, 46, 46, 12, C.grey, 0, C.ink, 1.6), rect(92, 46, 22, 12, C.grey, 0, C.ink, 1.6),
    rect(52, 46, 40, 12, PALE, 0, HL, 3), path(range(8).map((i) => `${i ? 'L' : 'M'}${30 + i * 8} ${112 - i * 9} L${38 + i * 8} ${112 - i * 9}`).join(' ') + ' L94 40', 'none', WOOD2, 3.4),
    line('M12 46 L12 32 L52 32 M24 32 L24 46 M38 32 L38 46', HL, 2)),
  // stegljud: a person walks in the room above; orange sound waves pass down through the floor to a person below who holds an ear.
  'bstruc.stegljud': all(ground(), rect(6, 6, 108, 106, WALL, 0, C.ink, 1.8), rect(6, 50, 108, 10, C.grey, 0, C.ink, 1.6),
    g('translate(-20 -62)', person(60, C.green, { h: 0.46 })), waPulse('bstruc-steps', line('M34 64 Q40 70 46 64 M30 70 Q40 78 50 70 M26 76 Q40 86 54 76', HL, 2.6)),
    person(80, C.sky, { h: 0.46 }), circle(87, 79, 3, C.skin, C.ink, 1.2)),
  // svikta: a person stands on a long board between two supports; the board bends down under the weight and springs back.
  'bstruc.svikta.2': all(ground(), rect(8, 76, 14, 36, C.grey2, 0, C.ink, 1.6), rect(98, 76, 14, 36, C.grey2, 0, C.ink, 1.6), line('M14 76 L106 76', C.grey, 1.4, '3 3'),
    waBob('bstruc-flex', 4, path('M14 72 Q60 92 106 72 L106 78 Q60 98 14 78 Z', HL, C.ink, 1.8), g('translate(0 -28)', person(60, C.sky, { h: 0.62 })))),

  // ── Takstolar och tak ─────────────────────────────────────────────
  // tak: a house with grey walls; the whole roof with its tiles is orange, and rain falls on it.
  'bstruc.tak': all(ground(), rect(22, 60, 76, 52, C.grey2, 0, C.ink, 1.8), path('M10 62 L60 20 L110 62 Z', HL, C.ink, 2),
    line('M24 50 L96 50 M38 38 L82 38', '#c9531f', 1.4), win(32, 72), win(74, 72), rect(52, 84, 16, 28, C.white, 1, C.ink, 1.4),
    line('M20 10 L16 18 M44 6 L40 14 M76 6 L72 14 M100 10 L96 18', '#5aa7d6', 2)),
  // takstol: on top of grey walls stand roof trusses in a row; the one in front, a triangle with struts, is orange.
  'bstruc.takstol': all(ground(), rect(14, 70, 92, 42, C.grey2, 0, C.ink, 1.8), truss(22, 70, 92, 40, C.grey, 1.6), truss(18, 70, 92, 42, C.grey, 1.6),
    truss(12, 72, 96, 44, HL, 3.2)),
  // nock: a whole house in three-quarter view; only the top line of the roof, from end to end, is a thick orange line, with a bird on it.
  'bstruc.nock': all(ground(), path('M14 66 L36 40 L58 66 Z', C.grey2, C.ink, 1.8), rect(14, 66, 44, 46, C.grey2, 0, C.ink, 1.8), rect(58, 66, 50, 46, C.grey2, 0, C.ink, 1.8),
    path('M36 40 L98 40 L112 68 L58 68 Z', C.grey, C.ink, 1.8), line('M36 40 L98 40', HL, 5), path('M74 34 C78 30 84 32 84 36 L74 37 Z', C.dark, C.ink, 1), win(26, 78, 12, 12), win(72, 80), win(90, 80)),
  // takfot: close up of a wall and the lower edge of a roof; the overhanging edge is orange, and a bird nest hangs under it.
  'bstruc.takfot': all(rect(54, 30, 60, 82, C.grey2, 0, C.ink, 1.8), path('M114 4 L114 18 L20 46 L16 38 Z', C.grey, C.ink, 1.8),
    path('M54 34 L16 38 L20 46 L54 42 Z', HL, C.ink, 2.2), path('M28 48 C26 56 40 58 40 48 Z', '#a0673d', C.ink, 1.2), line('M8 60 L12 70 M20 66 L24 76 M32 72 L36 82', '#5aa7d6', 2), ground()),
  // taklutning: a house gable with an orange arc and the number 27 at the slope of the roof; the sloping edge is orange.
  'bstruc.taklutning': all(ground(), rect(24, 64, 72, 48, C.grey2, 0, C.ink, 1.8), path('M14 66 L60 36 L106 66 Z', C.grey, C.ink, 1.8), line('M14 66 L60 36', HL, 4),
    line('M14 66 L58 66', C.ink, 1, '3 3'), path('M40 66 A26 26 0 0 0 36 52', 'none', HL, 2.4), `<text x="46" y="60" font-family="system-ui,sans-serif" font-weight="800" font-size="11" fill="${HL}">27°</text>`, win(52, 78)),
  // hängränna: close up of the lower roof edge: an orange gutter runs along it and catches rain from the tiles.
  'bstruc.hängränna': all(path('M0 10 L120 10 L120 46 L0 46 Z', RED, C.ink, 1.8), line('M0 22 L120 22 M0 34 L120 34', C.ink, 0.8), rect(0, 60, 120, 52, C.grey2, 0, null),
    path('M4 48 L116 48 L114 60 Q60 66 6 60 Z', HL, C.ink, 2), waIn('bstruc-rain', 0, -10, drop(30, 50, 0.8), drop(60, 50, 0.8), drop(90, 50, 0.8)), rect(98, 62, 10, 50, C.grey, 0, C.ink, 1.4)),
  // stuprör: a wall corner with an orange vertical pipe from the grey gutter down to the ground; water runs out at the bottom.
  'bstruc.stuprör': all(ground(), rect(14, 20, 84, 92, C.grey2, 0, C.ink, 1.8), path('M8 12 L112 12 L110 20 L10 20 Z', C.grey, C.ink, 1.6),
    path('M84 20 L92 20 L92 104 L100 108 L96 112 L84 106 Z', HL, C.ink, 2), waIn('bstruc-spout', -8, -8, drop(104, 110, 0.8), drop(110, 106, 0.7)), win(30, 40), win(30, 70)),
  // snölast: a roof with a thick layer of snow; big orange arrows press down on the snow and the roof.
  'bstruc.snölast': all(ground(), rect(24, 70, 72, 42, C.grey2, 0, C.ink, 1.8), path('M14 72 L60 42 L106 72 Z', C.grey, C.ink, 1.8),
    snowCap('M12 70 L60 38 L108 70 L106 60 C90 46 76 34 60 26 C44 34 30 46 14 60 Z'), down(34, 8, 42), down(60, 2, 22), down(86, 8, 42)),
  // snörasskydd: snow lies on a roof and is held back by a low orange rail near the edge; a person walks safely on the pavement below.
  'bstruc.snörasskydd': all(ground(), rect(6, 56, 60, 56, C.grey2, 0, C.ink, 1.8), path('M2 58 L76 14 L76 58 Z', C.grey, C.ink, 1.8),
    snowCap('M14 46 L76 12 L76 20 L22 50 Z'), line('M18 50 L48 32', HL, 3), line('M22 53 L22 46 M32 47 L32 40 M42 41 L42 34', HL, 2), person(94, C.green, { h: 0.62 })),
  // lägga om: half of the roof has old grey broken tiles, the other half new red ones; a new tile slides into place.
  'bstruc.lägga-om.3': all(ground(), rect(22, 66, 76, 46, C.grey2, 0, C.ink, 1.8), path('M10 68 L60 26 L60 68 Z', C.grey, C.ink, 1.8), line('M22 58 L60 58 M34 48 L60 48 M46 38 L60 38', C.ink, 0.8), line('M30 54 L36 60 M44 44 L40 50', C.dark, 1.4),
    path('M60 26 L110 68 L60 68 Z', RED, C.ink, 1.8), line('M60 58 L98 58 M60 48 L86 48 M60 38 L74 38', C.ink, 0.8), waIn('bstruc-tile', 18, -18, rect(64, 32, 14, 6, HL, 1, C.ink, 1.4))),

  // ── Fasad och isolering ───────────────────────────────────────────
  // puts: a wall of bricks; the right half is covered with a smooth orange layer that a trowel spreads out.
  'bstruc.puts': all(ground(), bricks(10, 14, 100, 14), path('M58 14 L110 14 L110 112 L52 112 C56 80 50 50 58 14 Z', '#f2b48a', HL, 2.4),
    path('M44 62 L66 54 L70 62 L48 70 Z', C.silver, C.ink, 1.4), line('M56 66 L50 82', WOOD2, 4)),
  // måla om: a house wall, the left half grey and flaking, the right half freshly painted; a roller moves over the wall.
  'bstruc.måla-om': all(ground(), rect(10, 20, 100, 92, C.grey2, 0, C.ink, 1.8), path('M60 20 L110 20 L110 112 L60 112 Z', HL, null), rect(10, 20, 100, 92, 'none', 0, C.ink, 1.8),
    path('M22 40 L28 36 L30 44 Z M34 70 L42 66 L40 76 Z M18 90 L24 88 L24 96 Z', C.white, C.ink, 0.8),
    waIn('bstruc-roller', -18, 0, rect(52, 50, 12, 24, C.white, 3, C.ink, 1.6), line('M64 62 L74 62 L74 94', C.ink, 2)), line('M74 94 L74 104', WOOD2, 4)),
  // luftspalt: a wall section: grey wall, yellow insulation, an orange-outlined gap and wooden boards; air arrows rise in the gap.
  'bstruc.luftspalt': all(ground(), rect(6, 8, 22, 104, C.grey2, 0, C.ink, 1.6), rect(28, 8, 34, 104, '#f3dc8a', 0, C.ink, 1.6), path(range(10).map((i) => `M30 ${14 + i * 10} Q45 ${8 + i * 10} 60 ${14 + i * 10}`).join(' '), 'none', '#d9b85a', 1),
    rect(62, 8, 4, 104, C.dark, 0, null), rect(66, 8, 14, 104, PALE, 0, HL, 2.6), rect(80, 8, 14, 104, WOOD, 0, C.ink, 1.6), line('M94 8 L94 112', C.ink, 1.4),
    waIn('bstruc-air', 0, 20, arrow(73, 96, 73, 72, '#5aa7d6', 2.4), arrow(73, 56, 73, 30, '#5aa7d6', 2.4))),
  // vindskydd: a house frame filled with insulation; outside it an orange sheet covers the wall, and blue wind arrows bounce off it.
  'bstruc.vindskydd.2': all(ground(), rect(10, 20, 54, 92, '#f3dc8a', 0, C.ink, 1.6), studs(10, 20, 54, 92, 4, WOOD), rect(64, 20, 8, 92, HL, 0, C.ink, 2),
    arrow(112, 40, 78, 40, '#5aa7d6', 3), arrow(78, 52, 104, 62, '#5aa7d6', 2.2), arrow(112, 80, 78, 80, '#5aa7d6', 3), arrow(78, 92, 104, 102, '#5aa7d6', 2.2)),
  // ångspärr: inside a room, steam rises from a pot; it meets an orange plastic film in front of the insulation and is stopped.
  'bstruc.ångspärr': all(ground(), rect(84, 8, 32, 104, '#f3dc8a', 0, C.ink, 1.6), studs(84, 8, 32, 104, 3, WOOD), path('M80 8 L84 8 L84 112 L80 112 Z', HL, C.ink, 1.8), line('M82 20 L82 24 M82 50 L82 54 M82 80 L82 84', C.ink, 1.2),
    rect(10, 84, 46, 6, C.dark, 1, C.ink, 1.4), path('M18 70 L48 70 L46 84 L20 84 Z', C.grey, C.ink, 1.6), waIn('bstruc-steam', -20, 16, path('M30 64 C24 56 36 50 30 42 M40 64 C34 54 46 48 40 38', 'none', C.grey, 2.4), arrow(52, 40, 74, 34, C.grey, 2.2)),
    line('M74 34 L64 44', C.grey, 2.2, '3 3')),

  // ── Fönster och dörrar ────────────────────────────────────────────
  // dörr: a door in a wall, orange, with a handle; it stands a little open.
  'bstruc.dörr': all(ground(), rect(4, 8, 112, 104, WALL, 0, C.ink, 1.6), rect(34, 22, 46, 90, C.dark, 0, C.ink, 1.6),
    path('M34 22 L70 28 L70 108 L34 112 Z', HL, C.ink, 2), rect(40, 36, 22, 26, '#f6b98d', 2, C.ink, 1.2), rect(40, 72, 22, 26, '#f6b98d', 2, C.ink, 1.2), circle(64, 68, 2.6, C.gold, C.ink, 1.2)),
  // karm: a window in a wall; the fixed frame around it is orange, while the open window sash and its glass are grey and blue.
  'bstruc.karm': all(rect(0, 0, 120, 112, WALL, 0, null), rect(24, 16, 72, 84, HL, 0, C.ink, 2), rect(32, 24, 56, 68, '#9cc9e4', 0, C.ink, 1.6),
    path('M32 24 L60 30 L60 98 L32 92 Z', C.grey2, C.ink, 1.6), path('M36 30 L56 34 L56 92 L36 88 Z', GLASS, C.ink, 1), ground()),
  // ruta: a hand holds a pane of glass (orange edge, shine) beside an empty grey window frame.
  'bstruc.ruta.2': all(rect(0, 0, 120, 112, WALL, 0, null), rect(14, 18, 40, 64, C.grey2, 0, C.ink, 1.8), rect(20, 24, 28, 52, WALL, 0, C.ink, 1.2), ground(),
    rect(66, 22, 40, 56, GLASS, 1, HL, 3), line('M74 34 L84 28 M74 46 L94 32', C.white, 2.4), fist(64, 52), fist(108, 52), line('M60 56 L52 72', C.skin, 6), line('M112 56 L116 70', C.skin, 6)),
  // fönsterbleck: a window seen from outside; under it an orange metal sill leans outwards and rain runs off its edge.
  'bstruc.fönsterbleck': all(rect(0, 0, 120, 112, RED, 0, null), line(range(19).map((i) => `M${4 + i * 6} 0 L${4 + i * 6} 112`).join(' '), '#8e3329', 1),
    rect(30, 14, 60, 60, C.white, 0, C.ink, 1.8), win(36, 20, 48, 48), path('M24 76 L96 76 L102 86 L18 86 Z', HL, C.ink, 2), waIn('bstruc-sill', 0, -8, drop(30, 94), drop(60, 96), drop(90, 94)), ground()),
  // tröskel: an open doorway seen from the front; the low strip on the floor under it is orange, and a foot steps over it.
  'bstruc.tröskel': all(rect(0, 0, 120, 92, WALL, 0, null), rect(0, 92, 120, 20, WOOD, 0, null), rect(34, 14, 52, 80, '#cfe3c8', 0, C.ink, 1.8), path('M86 14 L104 20 L104 98 L86 94 Z', C.white, C.ink, 1.6),
    rect(28, 92, 64, 8, HL, 1, C.ink, 2), path('M46 88 L66 88 C72 88 74 82 70 80 L56 78 Z', C.dark, C.ink, 1.4)),
  // säkerhetsdörr: a thick dark steel door with three orange locks, a shield and a heavy frame.
  'bstruc.säkerhetsdörr': all(ground(), rect(4, 8, 112, 104, WALL, 0, C.ink, 1.6), rect(28, 14, 64, 98, C.grey, 0, C.ink, 2.4), rect(34, 20, 52, 92, C.dark, 0, C.ink, 2),
    line('M38 40 L82 40 M38 64 L82 64 M38 88 L82 88', '#545765', 2), ...[36, 60, 84].map((y) => all(circle(78, y, 4, HL, C.ink, 1.4), line(`M78 ${y - 2} L78 ${y + 2}`, C.ink, 1.2))),
    g('translate(50 52) scale(0.9)', path('M0 -16 L14 -11 C14 4 8 12 0 17 C-8 12 -14 4 -14 -11 Z', C.silver, C.ink, 1.8))),
  // titthål: a front door with a small orange-ringed peephole; a round bubble shows the curved view of a visitor outside.
  'bstruc.titthål': all(ground(), rect(4, 8, 112, 104, WALL, 0, C.ink, 1.6), rect(14, 16, 50, 96, C.brown, 0, C.ink, 2), circle(39, 44, 3, C.dark, HL, 2.4), circle(58, 70, 2.6, C.gold, C.ink, 1),
    line('M42 42 L74 30', C.grey, 1.4, '3 3'), circle(92, 34, 22, GLASS, C.ink, 2), circle(92, 30, 7, C.skin, C.ink, 1.4), path('M80 54 C80 42 104 42 104 54 Z', C.green, C.ink, 1.4), path('M86 26 C86 20 98 20 98 26 C95 23 89 23 86 26 Z', C.hair, null)),
  // glasa in: a balcony on a house; orange-edged glass panels slide in along the railing until the balcony is closed.
  'bstruc.glasa-in': all(ground(), rect(8, 8, 104, 104, C.grey2, 0, C.ink, 1.6), rect(20, 20, 30, 40, GLASS, 1, C.ink, 1.4), rect(20, 66, 80, 6, C.grey, 0, C.ink, 1.6), rect(20, 90, 80, 8, C.grey, 0, C.ink, 1.6), line('M24 72 L24 90 M40 72 L40 90 M56 72 L56 90 M72 72 L72 90 M88 72 L88 90', C.ink, 1.4),
    waIn('bstruc-glass', 40, 0, ...[20, 40, 60, 80].map((x) => rect(x, 26, 20, 40, 'rgba(207,232,246,.7)', 0, HL, 2)))),

  // ── Byggmaterial ──────────────────────────────────────────────────
  // byggmaterial: a pallet with different materials together: planks, bricks, a concrete block and a steel beam.
  'bstruc.byggmaterial': all(ground(), rect(8, 100, 104, 8, WOOD2, 0, C.ink, 1.4), line('M14 108 L14 112 M60 108 L60 112 M106 108 L106 112', C.ink, 2),
    ...range(3).map((i) => rect(12, 88 - i * 8, 46, 8, WOOD, 1, C.ink, 1.2)), bricks(62, 72, 46, 4, 15, 7), rect(14, 52, 30, 20, CONC, 1, C.ink, 1.6),
    path('M50 56 L104 56 L104 60 L80 60 L80 64 L104 64 L104 68 L50 68 L50 64 L74 64 L74 60 L50 60 Z', C.silver, C.ink, 1.4), rect(4, 44, 112, 68, 'none', 6, HL, 2.4)),
  // brännbar: a wooden log burns with a big orange flame; a grey stone beside it does not catch fire.
  'bstruc.brännbar': all(ground(), path('M14 96 L58 96 L58 108 L14 108 Z', WOOD, C.ink, 1.8), ellipse(58, 102, 4, 6, '#e8c79e', C.ink, 1.4), flame(36, 92, 2.4), flame(24, 94, 1.3, C.red), flame(48, 94, 1.4, C.red),
    path('M76 108 C72 96 82 84 96 86 C108 88 112 100 106 108 Z', C.grey, C.ink, 1.8), line('M92 76 C96 70 94 64 90 60', C.grey2, 2, '3 3')),
  // lättbetong: a big light-grey block full of small holes; a saw cuts easily into it.
  'bstruc.lättbetong': all(ground(), path('M14 70 L30 56 L100 56 L84 70 Z', '#f4f3ef', C.ink, 1.8), path('M14 70 L84 70 L84 108 L14 108 Z', '#e9e8e2', C.ink, 2), path('M84 70 L100 56 L100 94 L84 108 Z', '#d3d2cb', C.ink, 1.8),
    ...range(26).map((i) => circle(20 + (i * 13) % 60, 76 + Math.floor((i * 13) / 60) * 8, 1.4, '#b9b8b0', null)),
    path('M50 56 L56 30 L104 18 L98 44 Z', C.silver, C.ink, 1.4), line('M50 56 L56 30', C.ink, 1.2), rect(98, 12, 14, 22, WOOD2, 3, C.ink, 1.4)),
  // natursten: rough rock from a mountain on the left and a cut, speckled stone slab (orange outline) in front.
  'bstruc.natursten': all(ground(), path('M4 112 L20 50 L40 66 L56 40 L74 112 Z', '#a8a29a', C.ink, 1.8), line('M20 70 L30 80 M44 60 L50 76', '#7e786f', 1.4),
    path('M50 92 L64 80 L112 80 L98 92 Z', '#d6d0c8', C.ink, 1.6), path('M50 92 L98 92 L98 108 L50 108 Z', '#c7c0b6', HL, 2.6), path('M98 92 L112 80 L112 96 L98 108 Z', '#aaa298', C.ink, 1.6),
    ...range(16).map((i) => circle(54 + (i * 11) % 42, 95 + Math.floor((i * 11) / 42) * 4, 1, i % 2 ? C.dark : C.white, null))),
  // bruk: a bucket full of grey-orange mortar with a trowel in it; beside it a small wall where the mortar between the bricks is orange.
  'bstruc.bruk.3': all(ground(), path('M10 72 L50 72 L46 110 L14 110 Z', C.grey, C.ink, 1.8), ellipse(30, 72, 20, 5, '#f2b48a', C.ink, 1.6), path('M24 70 L40 52 L46 56 L30 74 Z', C.silver, C.ink, 1.4), line('M43 54 L52 42', WOOD2, 4),
    bricks(62, 70, 50, 6, 16, 7, '#c8664a', HL)),
  // mura: a hand with a trowel; a brick moves down onto a wall of bricks, rows of bricks below.
  'bstruc.mura': all(ground(), bricks(14, 70, 92, 6, 18, 7), waIn('bstruc-brick', 0, -22, rect(50, 62, 18, 7, HL, 0.6, C.ink, 1.2)), fist(76, 52), line('M80 48 L96 34', C.skin, 6),
    path('M18 64 L40 58 L42 64 L22 68 Z', C.silver, C.ink, 1.2), line('M38 60 L48 52', WOOD2, 3)),
  // återbruk: an old grey house is taken down; its old door moves along a curved orange arrow into a new house on the right.
  'bstruc.återbruk': all(ground(), g('translate(0 0)', path('M6 70 L26 54 L46 70 Z', C.grey, C.ink, 1.6), rect(10, 70, 32, 42, C.grey2, 0, C.ink, 1.6), line('M14 76 L24 86 M34 74 L28 90', C.dark, 1.4)),
    path('M74 66 L94 48 L114 66 Z', RED, C.ink, 1.6), rect(78, 66, 32, 46, WALL, 0, C.ink, 1.6), rect(88, 86, 12, 26, 'none', 0, C.ink, 1.2),
    path('M30 46 C40 20 76 20 86 40', 'none', HL, 3), path('M86 40 L80 34 L90 34 Z', HL, HL, 1.4),
    moving('bstruc-reuse', '0%{transform:translate(-62px,0);opacity:.3}60%,100%{transform:translate(0,0);opacity:1}', { dur: 3 }, rect(88, 86, 12, 26, WOOD, 1, C.ink, 1.4), circle(97, 99, 1.2, C.gold, null))),
};
