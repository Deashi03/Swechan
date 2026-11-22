/**
 * Teknik & digital värld → Maskiner & tillverkning → Teknisk ritning & konstruktion, 4061–4067 (0.58): drawing
 * symbols, dimensioning, tolerances, sections and views, CAD models, prototypes and design changes.
 * Recurring signs: drawings are white sheets with dark blue lines; the part that the word names is orange (a line,
 * a frame, an arrow or the object itself) and grey parts show what the word is not. Words that are easy to mix up
 * get clearly different scenes: ritning (a whole sheet beside the grey real part), ritningshuvud (only the block in
 * the lower right corner), mittlinje (long-short orange lines through a hole) and beteckning (orange balloons with
 * codes); måttsätta (a hand writes a new dimension), måttlinje (only the thin orange line with arrows), yttermått
 * (arrow outside a cabinet) and innermått (arrow inside an open box with things in it); ovanifrån (eye above, arrow
 * down) and från sidan (eye at the side, arrow across); detalj (one orange part, ringed) and sammanställning (many
 * parts together inside an orange frame); CAD-program (screen with toolbar and mouse) and CAD-modell (a shaded
 * object with turning arrows and axes); revision (a stack of sheets, the newest in front) and konstruktionsändring
 * (one sheet where a grey part is crossed out and an orange one replaces it).
 * Digits, codes like A1 and the signs ±, ! and : only; no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, sparkle, waIn, waSway, type Svg } from './kit';
import { HL, T, padlock, plaster } from './people';
import { figure } from './figures';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const BLUE = '#2f5d8a';
const PAPER = '#fdfcf7';
const STEEL = '#b8c0c8';
const CARD = '#c9a26b';
const WOOD = '#d4a373';
const SCREEN = '#dcecf6';
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const cross = (x: number, y: number, s = 6, col: string = C.red) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 3);
const tick = (x: number, y: number, s = 6, col: string = C.green) => line(`M${x - s} ${y} L${x - s / 3} ${y + s * 0.7} L${x + s} ${y - s * 0.8}`, col, 3);
/** Drawing sheet with a thin inner border. */
const sheet = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, PAPER, 2, C.ink, 1.6), rect(x + 3, y + 3, w - 6, h - 6, 'none', 1, BLUE, 0.6));
/** Arrowhead at (x, y) pointing in direction deg. */
const head = (x: number, y: number, deg: number, col: string, s = 4) => g(`translate(${x} ${y}) rotate(${deg})`, path(`M0 0 L${-s} ${-s * 0.55} L${-s} ${s * 0.55} Z`, col, null));
/** Dimension line between (x1, y1) and (x2, y2) with arrowheads at both ends. */
const dim = (x1: number, y1: number, x2: number, y2: number, col: string = BLUE, sw = 1, s = 4) => {
  const deg = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return all(line(`M${x1} ${y1} L${x2} ${y2}`, col, sw), head(x2, y2, deg, col, s), head(x1, y1, deg + 180, col, s));
};
/** Long-short centre line. */
const cline = (d: string, col: string = BLUE, sw = 1) => line(d, col, sw, '9 3 2 3');
/** Hatching with 45° lines inside a rectangle. */
const hatch = (x: number, y: number, w: number, h: number, col: string = BLUE, gap = 5, sw = 1) => {
  const segs: string[] = [];
  for (let c = gap; c < w + h; c += gap) {
    const x1 = x + Math.max(0, c - h), y1 = y + Math.min(h, c), x2 = x + Math.min(w, c), y2 = y + Math.max(0, c - w);
    segs.push(`M${f1(x1)} ${f1(y1)} L${f1(x2)} ${f1(y2)}`);
  }
  return line(segs.join(' '), col, sw);
};
/** Pencil, tip at (x, y), body towards angle deg. */
const pencil = (x: number, y: number, deg = -45, len = 34) => g(`translate(${x} ${y}) rotate(${deg})`, path('M0 0 L7 -3 L7 3 Z', C.beige, C.ink, 1), path('M0 0 L2.5 -1 L2.5 1 Z', C.ink, null),
  rect(7, -3, len, 6, C.yellow, 1, C.ink, 1.2), rect(7 + len, -3, 5, 6, C.pink, 1, C.ink, 1.2));
/** Fist holding something at (x, y), sleeve towards (dx, dy). */
const fist = (x: number, y: number, dx = 14, dy = 14, sleeve: string = C.navy) => all(line(`M${x} ${y} L${x + dx} ${y + dy}`, C.ink, 11), line(`M${x} ${y} L${x + dx} ${y + dy}`, sleeve, 8.6), circle(x, y, 6.5, C.skin, C.ink, 1.4));
/** Eye seen from the side, looking in direction deg. */
const eye = (x: number, y: number, deg = 0, col: string = C.ink) => g(`translate(${x} ${y}) rotate(${deg})`, path('M-10 0 C-4 -8 4 -8 10 0 C4 8 -4 8 -10 0 Z', C.white, col, 1.6), circle(3, 0, 3.6, col === C.ink ? BLUE : col, null), circle(3, 0, 1.6, C.ink, null));
/** Mug seen in perspective (for views). */
const mug = (x: number, y: number, col: string = C.sky) => all(path(`M${x - 12} ${y - 14} L${x - 12} ${y + 10} C${x - 12} ${y + 15} ${x + 12} ${y + 15} ${x + 12} ${y + 10} L${x + 12} ${y - 14} Z`, col, C.ink, 1.6),
  ellipse(x, y - 14, 12, 4, '#6b4a32', C.ink, 1.4), path(`M${x + 12} ${y - 8} C${x + 22} ${y - 8} ${x + 22} ${y + 6} ${x + 12} ${y + 6}`, 'none', C.ink, 3), path(`M${x + 12} ${y - 8} C${x + 22} ${y - 8} ${x + 22} ${y + 6} ${x + 12} ${y + 6}`, 'none', col, 1.6));
/** Monitor with stand. */
const monitor = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x + w / 2 - 4, y + h, 8, 8, C.dark, 1, C.ink, 1.2), rect(x + w / 2 - 14, y + h + 7, 28, 4, C.dark, 2, C.ink, 1.2),
  rect(x, y, w, h, C.dark, 3, C.ink, 1.6), rect(x + 3, y + 3, w - 6, h - 6, SCREEN, 1, null), inner);
/** Flat plate with two holes, drawn as a 2D outline. */
const plateDraw = (x: number, y: number, w: number, h: number, col: string = BLUE, sw = 1.6) => all(rect(x, y, w, h, 'none', 4, col, sw), circle(x + w * 0.25, y + h / 2, h * 0.18, 'none', col, sw), circle(x + w * 0.75, y + h / 2, h * 0.18, 'none', col, sw));
/** L-shaped bracket in 3D (shaded). */
const bracket3d = (x: number, y: number, s = 1, top: string = '#f5a46a', front: string = HL, side: string = '#c0451f') => g(`translate(${x} ${y}) scale(${s})`,
  path('M-24 -2 L6 -2 L18 -10 L-12 -10 Z', top, C.ink, 1.4), path('M-24 -2 L6 -2 L6 8 L-24 8 Z', front, C.ink, 1.4), path('M6 -2 L18 -10 L18 0 L6 8 Z', side, C.ink, 1.4),
  path('M-24 -2 L-24 -30 L-12 -38 L-12 -10 Z', side, C.ink, 1.4), path('M-24 -30 L-14 -30 L-2 -38 L-12 -38 Z', top, C.ink, 1.4), path('M-14 -30 L-14 -10 L-2 -10 L-2 -38 Z', front, C.ink, 1.2),
  ellipse(-7, -20, 3, 4, C.dark, null), ellipse(0, 3, 4, 2.4, C.dark, null));
/** Simple car seen from the side, wheels on y. */
const car = (x: number, y: number, s = 1, col: string = C.sky) => g(`translate(${x} ${y}) scale(${s})`, path('M-30 -6 L-30 -16 L-18 -18 L-8 -30 L14 -30 L24 -18 L32 -16 L32 -6 Z', col, C.ink, 1.6),
  path('M-6 -27 L4 -27 L4 -19 L-13 -19 Z M8 -27 L13 -27 L19 -19 L8 -19 Z', '#dff1fb', C.ink, 1.2), circle(-18, -6, 6, C.dark, C.ink, 1.4), circle(20, -6, 6, C.dark, C.ink, 1.4), circle(-18, -6, 2, C.silver, null), circle(20, -6, 2, C.silver, null));
/** Light bulb (idea). */
const idea = (x: number, y: number, s = 1) => g(`translate(${x} ${y}) scale(${s})`, path('M-7 4 C-12 -2 -10 -13 0 -13 C10 -13 12 -2 7 4 L5 8 L-5 8 Z', C.yellow, C.ink, 1.4), rect(-5, 8, 10, 5, C.grey, 1, C.ink, 1.2),
  line('M0 -17 L0 -21 M-10 -13 L-13 -16 M10 -13 L13 -16', C.gold, 1.6));
/** Small house seen from the front (for scale pictures). */
const house = (x: number, y: number, s: number, col: string, roof: string) => g(`translate(${x} ${y}) scale(${s})`, rect(-14, -16, 28, 16, col, 0, C.ink, 1.6), path('M-17 -16 L0 -30 L17 -16 Z', roof, C.ink, 1.6), rect(-4, -9, 8, 9, C.white, 0, C.ink, 1.2), rect(6, -12, 5, 5, C.white, 0, C.ink, 1));

export const TDRAW_MOTIFS: Record<string, Svg> = {
  // ── 4061 Ritningssymboler ──────────────────────────────────────────
  // ritning (teknisk): the whole sheet with views and dimensions, framed in orange; the grey real part beside it.
  'tdraw.ritning.2': all(ground(), sheet(8, 14, 74, 60), plateDraw(18, 30, 44, 20), dim(18, 62, 62, 62), T(40, 60, '60', 6, BLUE), dim(70, 30, 70, 50), cline('M29 26 L29 54 M51 26 L51 54'),
    frame(5, 11, 80, 66), greyed(g('translate(98 100)', path('M-14 -4 L14 -4 L18 -8 L-10 -8 Z', STEEL, C.ink, 1.2), rect(-14, -4, 28, 8, STEEL, 1, C.ink, 1.2), ellipse(-7, 0, 2.6, 1.6, C.dark, null), ellipse(7, 0, 2.6, 1.6, C.dark, null)))),
  // rita (göra ritning): a hand draws the outline of a house with a pencil; the pencil travels along the new line.
  'tdraw.rita.2': all(sheet(10, 20, 100, 80), rect(26, 56, 40, 28, 'none', 0, BLUE, 1.6), path('M22 56 L46 38 L70 56', 'none', BLUE, 1.6), rect(40, 68, 10, 16, 'none', 0, BLUE, 1.2),
    moving('tdraw-rita', '0%{transform:translate(-30px,18px)}60%,100%{transform:translate(0,0)}', { dur: 2.8 }, line('M70 56 L84 66', HL, 2), pencil(84, 66, -40), fist(96, 56, 12, 16))),
  // mittlinje: a plate with a round hole; long-short orange lines cross the centre of the hole.
  'tdraw.mittlinje.1': all(sheet(10, 14, 100, 92), rect(24, 34, 72, 52, 'none', 4, BLUE, 2), circle(60, 60, 14, 'none', BLUE, 2), cline('M60 26 L60 94 M16 60 L104 60', HL, 2.2)),
  // ritningshuvud: a sheet with a faint grey drawing; only the block of fields in the lower right corner is orange.
  'tdraw.ritningshuvud.1': all(sheet(6, 12, 108, 92), greyed(plateDraw(18, 24, 50, 26), dim(18, 58, 68, 58)), g('translate(64 72)', rect(0, 0, 44, 28, '#fde7d9', 1, HL, 2.4),
    line('M0 10 L44 10 M0 19 L44 19 M22 0 L22 28', HL, 1.2), line('M3 5 L18 5 M25 5 L40 5 M25 15 L36 15 M3 24 L16 24', C.ink, 1), T(11, 17, '1:2', 6, C.ink), T(33, 26, '07', 6, C.ink))),
  // skalenlig (symbol): a big grey house and a small orange copy with exactly the same shape; a squashed copy is crossed out.
  'tdraw.skalenlig.1': all(ground(), greyed(house(38, 112, 2, C.beige, C.brown)), house(94, 112, 1, '#fde7d9', HL), T(94, 70, '1:2', 9, HL),
    g('translate(102 26)', house(0, 0, 0.6, C.grey2, C.grey), cross(0, -8, 9))),
  // naturlig storlek: an orange screw lies exactly on its own drawing on the sheet; the scale says 1:1.
  'tdraw.naturlig-storlek.1': all(sheet(8, 20, 104, 80), g('translate(18 52)', rect(0, 0, 14, 18, 'none', 1, BLUE, 1.4), rect(14, 5, 70, 8, 'none', 0, BLUE, 1.4)),
    g('translate(20 54)', rect(0, 0, 14, 18, HL, 2, C.ink, 1.4), rect(14, 5, 70, 8, '#f5a46a', 1, C.ink, 1.2), line(range(16).map((i) => `M${18 + i * 4} 5 L${16 + i * 4} 13`).join(' '), C.ink, 0.8)),
    T(92, 92, '1:1', 10, HL), dim(18, 84, 102, 84)),
  // beteckning: parts on a drawing get orange balloons with short codes.
  'tdraw.beteckning.1': all(sheet(6, 10, 108, 96), rect(30, 60, 60, 14, 'none', 2, BLUE, 1.6), rect(40, 40, 12, 20, 'none', 1, BLUE, 1.6), rect(68, 40, 12, 20, 'none', 1, BLUE, 1.6), circle(60, 88, 8, 'none', BLUE, 1.6),
    ...[[20, 30, 42, 46, 'A1'], [98, 30, 76, 46, 'A2'], [18, 90, 34, 70, 'B1'], [96, 92, 68, 88, 'C1']].map(([bx, by, tx, ty, s]) => all(line(`M${bx} ${by} L${tx} ${ty}`, HL, 1.2), circle(tx as number, ty as number, 1.6, HL, null),
      circle(bx as number, by as number, 9, '#fde7d9', HL, 2), T(bx as number, (by as number) + 3, s as string, 7, C.ink)))),

  // ── 4062 Måttsättning ──────────────────────────────────────────────
  // måttsätta: a hand writes a new dimension on the drawing; the orange line and the number come in.
  'tdraw.måttsätta.1': all(sheet(8, 14, 104, 92), plateDraw(20, 36, 64, 28), line('M20 66 L20 82 M84 66 L84 82', BLUE, 0.8),
    waIn('tdraw-matts', -20, 0, dim(20, 78, 84, 78, HL, 1.6, 5), T(52, 75, '64', 8, HL)), moving('tdraw-mattsp', '0%{transform:translate(-30px,0)}55%,100%{transform:translate(0,0)}', { dur: 2.6 }, pencil(70, 72, -50), fist(84, 56, 12, 16))),
  // ta mått: a person holds a yellow tape measure across a window; the tape runs out from the case.
  'tdraw.ta-mått.1': all(rect(0, 0, 120, 112, '#efe8dc', 0, null), rect(16, 18, 56, 54, '#bfe3f5', 2, C.ink, 2), line('M44 18 L44 72 M16 45 L72 45', C.ink, 2), rect(12, 72, 64, 5, C.white, 1, C.ink, 1.4), ground(),
    figure({ x: 98, top: C.green }), line('M88 52 L76 30', C.skin, 5), moving('tdraw-tape', '0%{transform:translate(50px,0);opacity:.3}55%,100%{transform:translate(0,0);opacity:1}', { dur: 2.8 }, rect(16, 27, 58, 4, C.yellow, 0, C.ink, 0.8),
      line(range(14).map((i) => `M${20 + i * 4} 27 L${20 + i * 4} ${i % 2 ? 29 : 30}`).join(' '), C.ink, 0.6), rect(12, 25, 5, 8, C.dark, 1, null)), rect(72, 22, 12, 14, C.yellow, 3, C.ink, 1.4)),
  // längd: a long board with an orange arrow from one end to the other.
  'tdraw.längd.1': all(ground(), path('M8 82 L104 82 L112 76 L16 76 Z', '#e6c08f', C.ink, 1.4), rect(8, 82, 96, 10, WOOD, 0, C.ink, 1.4), path('M104 82 L112 76 L112 86 L104 92 Z', '#b98652', C.ink, 1.4),
    line('M8 74 L8 52 M104 74 L104 52', HL, 1), dim(8, 58, 104, 58, HL, 2.4, 6), T(56, 52, '2000', 9, HL)),
  // måttlinje: no hand, only the thin orange line with arrowheads between two extension lines, number above.
  'tdraw.måttlinje.1': all(sheet(8, 14, 104, 92), rect(28, 30, 64, 36, 'none', 2, BLUE, 2), line('M28 70 L28 92 M92 70 L92 92', BLUE, 0.8), dim(28, 86, 92, 86, HL, 1.8, 6), T(60, 81, '64', 9, C.ink)),
  // yttermått: a kitchen cabinet with thick walls; the orange arrow spans the outer edges; the inner width is grey.
  'tdraw.yttermått.1': all(ground(), rect(30, 40, 60, 72, WOOD, 2, C.ink, 1.8), rect(38, 48, 44, 56, '#f3e2c4', 1, C.ink, 1.2), line('M38 76 L82 76', C.ink, 1.2),
    line('M30 38 L30 18 M90 38 L90 18', HL, 1.2), dim(30, 24, 90, 24, HL, 2.4, 6), greyed(dim(38, 66, 82, 66, C.grey, 1, 4))),
  // innermått: an open box seen from above with things inside; the orange arrow runs between the inner walls.
  'tdraw.innermått.1': all(rect(14, 26, 92, 70, CARD, 3, C.ink, 1.8), rect(24, 36, 72, 50, '#f3e2c4', 1, C.ink, 1.4), rect(30, 44, 16, 24, C.sky, 1, C.ink, 1.2), rect(50, 46, 14, 22, C.green, 1, C.ink, 1.2),
    dim(24, 78, 96, 78, HL, 2.4, 6), greyed(line('M14 106 L14 98 M106 106 L106 98', C.grey, 1), dim(14, 104, 106, 104, C.grey, 1, 4))),

  // ── 4063 Toleranser ────────────────────────────────────────────────
  // tolerans (symbol): a measuring scale with an orange allowed band around the target; parts inside get a tick, one outside a cross.
  'tdraw.tolerans.3': all(rect(42, 20, 36, 76, 'rgba(228,87,46,0.18)', 0, null), line('M42 16 L42 100 M78 16 L78 100', HL, 2.4), cline('M60 14 L60 102', BLUE, 1.2), line('M10 100 L110 100', C.ink, 1.4),
    line(range(11).map((i) => `M${10 + i * 10} 100 L${10 + i * 10} 105`).join(' '), C.ink, 1), ...[[52, 36], [66, 58]].map(([x, y]) => all(circle(x!, y!, 6, STEEL, C.ink, 1.4), tick(x! + 12, y!, 4))),
    circle(96, 80, 6, STEEL, C.ink, 1.4), cross(96, 66, 5)),
  // plus minus (symbol): a clock at seven with an orange sector a little before and after; a big ± beside it.
  'tdraw.plus-minus.1': all(circle(46, 60, 34, C.white, C.ink, 2.2),
    path(`M46 60 L${f1(46 + 34 * Math.sin(Math.PI * (200 / 180)))} ${f1(60 - 34 * Math.cos(Math.PI * (200 / 180)))} A34 34 0 0 1 ${f1(46 + 34 * Math.sin(Math.PI * (220 / 180)))} ${f1(60 - 34 * Math.cos(Math.PI * (220 / 180)))} Z`, 'rgba(228,87,46,0.45)', HL, 1.4),
    ...range(12).map((i) => line(`M${f1(46 + 30 * Math.sin((i * Math.PI) / 6))} ${f1(60 - 30 * Math.cos((i * Math.PI) / 6))} L${f1(46 + 34 * Math.sin((i * Math.PI) / 6))} ${f1(60 - 34 * Math.cos((i * Math.PI) / 6))}`, C.ink, 1.4)),
    line(`M46 60 L${f1(46 + 18 * Math.sin(Math.PI * (210 / 180)))} ${f1(60 - 18 * Math.cos(Math.PI * (210 / 180)))} M46 60 L46 32`, C.ink, 2.6), circle(46, 60, 2.4, C.ink, null),
    line('M98 42 L98 66 M86 54 L110 54 M86 74 L110 74', HL, 4.4)),
  // passa (rätt storlek): an orange peg slides down into the matching square hole; a round grey peg beside it does not fit.
  'tdraw.passa.3': all(ground(), path('M10 112 L10 78 L46 78 L46 88 L62 88 L62 78 L110 78 L110 112 Z', WOOD, C.ink, 1.8), path('M46 78 L46 88 L62 88 L62 78', 'none', C.ink, 1.8),
    moving('tdraw-passa', '0%{transform:translate(0,-34px)}55%,100%{transform:translate(0,0)}', { dur: 2.6 }, rect(47, 54, 14, 34, HL, 1, C.ink, 1.6)), tick(54, 44, 5),
    greyed(rect(82, 40, 18, 30, C.grey, 9, C.ink, 1.4)), cross(91, 30, 5)),
  // utbytbar (symbol): two identical orange parts and swap arrows; either one fits the same slot in the grey machine.
  'tdraw.utbytbar.1': all(greyed(rect(30, 66, 60, 40, C.grey, 4, C.ink, 1.6), rect(50, 66, 20, 16, C.white, 0, C.ink, 1.2)), rect(51, 66, 18, 15, HL, 1, C.ink, 1.4), circle(60, 74, 3, C.white, C.ink, 1),
    rect(14, 18, 18, 15, HL, 1, C.ink, 1.4), circle(23, 26, 3, C.white, C.ink, 1), path('M34 22 C46 10 74 10 86 22', 'none', HL, 2.4), head(86, 22, 45, HL, 6),
    path('M86 36 C74 48 46 48 34 36', 'none', HL, 2.4), head(34, 36, 225, HL, 6), rect(88, 18, 18, 15, HL, 1, C.ink, 1.4), circle(97, 26, 3, C.white, C.ink, 1)),

  // ── 4064 Tvärsnitt och vyer ────────────────────────────────────────
  // vy (ritning): a small grey box with a hole in perspective and three orange views of it: front, side and top.
  'tdraw.vy.2': all(sheet(4, 6, 112, 108), greyed(g('translate(92 88)', path('M-14 -6 L4 -6 L14 -14 L-4 -14 Z', C.beige, C.ink, 1.2), rect(-14, -6, 18, 16, C.beige, 0, C.ink, 1.2), path('M4 -6 L14 -14 L14 2 L4 10 Z', WOOD, C.ink, 1.2), ellipse(0, -10, 3, 1.6, C.dark, null))),
    rect(14, 18, 40, 26, '#fde7d9', 0, HL, 2), rect(62, 18, 24, 26, '#fde7d9', 0, HL, 2), rect(14, 62, 40, 24, '#fde7d9', 0, HL, 2), circle(34, 74, 5, 'none', HL, 2), line('M34 18 L34 44', HL, 1, '3 2'),
    line('M34 48 L34 58 M56 31 L60 31', BLUE, 0.8, '2 2')),
  // ovanifrån (symbol): an eye high above a mug looks straight down (orange arrow); what it sees is a circle.
  'tdraw.ovanifrån.1': all(ground(), mug(36, 92), eye(36, 18, 90), arrow(36, 30, 36, 66, HL, 3), g('translate(92 82)', circle(0, 0, 14, '#fde7d9', HL, 2.4), circle(0, 0, 10, 'none', HL, 1.2), rect(14, -3, 9, 6, 'none', 1, HL, 2)), arrow(56, 82, 70, 82, C.grey, 2)),
  // från sidan (symbol): an eye at the side of the mug looks straight across (orange arrow); what it sees is a rectangle with a handle.
  'tdraw.från-sidan.1': all(ground(), eye(12, 80, 0), arrow(24, 80, 46, 80, HL, 3), mug(66, 90), g('translate(98 40)', rect(-10, -14, 20, 28, '#fde7d9', 1, HL, 2.4), path('M10 -8 C18 -8 18 8 10 8', 'none', HL, 2.4)), arrow(78, 66, 88, 56, C.grey, 2)),
  // skraffera: a hand hatches the cut surface of a pipe section; the slanted strokes come in one after the other.
  'tdraw.skraffera.1': all(sheet(8, 14, 104, 92), rect(20, 30, 60, 14, 'none', 0, BLUE, 1.6), rect(20, 70, 60, 14, 'none', 0, BLUE, 1.6), line('M20 44 L80 44 M20 70 L80 70', BLUE, 1, '4 2'),
    hatch(20, 30, 60, 14, BLUE, 5, 1), waIn('tdraw-hatch', -18, 0, hatch(20, 70, 60, 14, HL, 5, 1.4)), pencil(82, 72, -50), fist(96, 56, 12, 16)),
  // sprängskiss: a stool drawn with all its parts a little apart along dashed lines.
  'tdraw.sprängskiss.1': all(sheet(6, 4, 108, 112), ellipse(60, 22, 32, 8, '#f5c79c', C.ink, 1.6), path('M28 22 L28 27 C28 36 92 36 92 27 L92 22', '#e7a873', C.ink, 1.4),
    ...[[36, 0], [84, 0], [52, 8], [70, 8]].map(([x, dy]) => all(line(`M${x} 34 L${x} ${48 + dy!}`, BLUE, 0.8, '3 2'), rect(x! - 4, 50 + dy!, 8, 46, WOOD, 2, C.ink, 1.4))),
    ...[36, 84].map((x) => all(rect(x - 1.5, 38, 3, 8, C.silver, 1, C.ink, 1))), line('M30 76 L90 76', BLUE, 0.8, '3 2'), rect(40, 72, 40, 6, '#e7a873', 2, C.ink, 1.2)),
  // skära itu: a knife has cut an apple; the two halves move apart and show the core.
  'tdraw.skära-itu.1': all(ground(), ellipse(60, 108, 46, 4, C.tan, null),
    moving('tdraw-itu-l', '0%{transform:translate(10px,0)}55%,100%{transform:translate(0,0)}', { dur: 2.6 }, path('M54 64 C34 58 22 76 30 96 C34 106 46 108 54 104 Z', C.red, C.ink, 1.8), path('M54 70 C42 68 36 80 40 92 C44 100 50 100 54 98 Z', '#fbf1d8', null), ellipse(50, 84, 2, 3.4, C.brown, null)),
    moving('tdraw-itu-r', '0%{transform:translate(-10px,0)}55%,100%{transform:translate(0,0)}', { dur: 2.6 }, path('M66 64 C86 58 98 76 90 96 C86 106 74 108 66 104 Z', C.red, C.ink, 1.8), path('M66 70 C78 68 84 80 80 92 C76 100 70 100 66 98 Z', '#fbf1d8', null), ellipse(70, 84, 2, 3.4, C.brown, null)),
    g('translate(60 40) rotate(90)', rect(-30, -4, 34, 8, C.silver, 1, C.ink, 1.4), rect(4, -5, 22, 10, C.dark, 3, C.ink, 1.4)), line('M60 56 L60 62', HL, 2)),
  // insida: a box with the front cut away; the inner walls and floor are orange, the outside grey.
  'tdraw.insida.1': all(ground(), path('M18 104 L18 44 L34 30 L104 30 L104 90 L88 104 Z', C.grey2, C.ink, 1.8), path('M28 96 L28 52 L40 42 L96 42 L96 84 L84 96 Z', '#f5a46a', C.ink, 1.4),
    path('M40 42 L40 84 L28 96 M40 84 L96 84', 'none', C.ink, 1.2), path('M40 84 L96 84 L84 96 L28 96 Z', HL, C.ink, 1.2), path('M18 44 L28 52 M104 30 L96 42 M104 90 L96 84 M18 104 L28 96', 'none', C.ink, 1.2)),

  // ── 4065 CAD-modeller ──────────────────────────────────────────────
  // CAD-program: a screen with a toolbar and a drawing of a part with a dimension; mouse and keyboard in front.
  'tdraw.CAD-program.1': all(rect(0, 92, 120, 28, C.beige, 0, null), monitor(14, 12, 92, 64, all(rect(17, 15, 12, 58, '#bcd0e0', 0, null), ...range(5).map((i) => rect(19, 18 + i * 11, 8, 8, i === 1 ? HL : C.white, 1, C.ink, 0.8)),
    rect(17, 15, 86, 6, '#9fb6c9', 0, null), plateDraw(40, 34, 50, 20, BLUE, 1.4), dim(40, 62, 90, 62, BLUE, 0.8, 3), T(65, 60, '120', 5, BLUE))), rect(24, 96, 60, 10, C.grey2, 2, C.ink, 1.2),
    line(range(9).map((i) => `M${28 + i * 6} 99 L${30 + i * 6} 99 M${28 + i * 6} 103 L${30 + i * 6} 103`).join(' '), C.ink, 1), ellipse(98, 102, 7, 9, C.white, C.ink, 1.4), line('M98 93 L98 99', C.ink, 1)),
  // CAD-modell: a shaded orange part floats with x-y-z axes and turning arrows; it rocks a little to show that it can be turned.
  'tdraw.CAD-modell.1': all(rect(6, 6, 108, 108, SCREEN, 6, C.ink, 1.4), waSway('tdraw-model', 8, bracket3d(64, 72, 1.3)),
    g('translate(22 96)', arrow(0, 0, 16, 0, C.red, 1.6), arrow(0, 0, 0, -16, C.green, 1.6), arrow(0, 0, -8, 8, BLUE, 1.6)), path('M28 30 C40 16 82 16 94 30', 'none', HL, 2), head(94, 30, 50, HL, 6), path('M94 96 C80 106 46 106 34 98', 'none', HL, 2), head(34, 98, 215, HL, 6)),
  // konstruktör: a person at a desk with a screen that shows a part; a printed drawing and a part on the desk.
  'tdraw.konstruktör.1': all(rect(0, 0, 120, 112, '#eef1f4', 0, null), ground(), figure({ x: 34, top: C.white, bottom: C.navy, face: 'smile' }), rect(54, 74, 64, 6, C.tan, 1, C.ink, 1.4), line('M60 80 L60 112 M112 80 L112 112', C.brown, 3),
    monitor(66, 38, 44, 30, bracket3d(88, 60, 0.55)), sheet(56, 66, 20, 8), line('M46 64 L60 70', C.skin, 5), g('translate(102 72)', rect(-6, -4, 12, 4, STEEL, 1, C.ink, 1))),
  // skissa: a hand sketches loose, wobbly lines of an idea on paper; the pencil swings back and forth.
  'tdraw.skissa.1': all(rect(10, 22, 96, 76, PAPER, 2, C.ink, 1.4), path('M26 72 C30 52 44 46 52 50 C58 40 74 40 80 52 C88 52 92 64 84 72 C70 76 40 78 26 72 Z', 'none', C.dark, 1.4), path('M30 70 C46 74 66 76 82 70', 'none', C.dark, 1),
    path('M40 82 L48 78 M56 84 L66 80', 'none', C.grey, 1.2), circle(40, 60, 3, 'none', C.dark, 1.2), moving('tdraw-skiss', '0%,100%{transform:translate(0,0)}25%{transform:translate(-6px,4px)}50%{transform:translate(4px,-3px)}75%{transform:translate(-3px,-4px)}', { dur: 1.4 },
      path('M74 60 C78 56 84 58 82 64', 'none', HL, 1.6), pencil(82, 64, -40), fist(96, 54, 12, 16))),
  // detalj (del till maskin): one orange part with holes, ringed; more grey parts lie in a box behind it.
  'tdraw.detalj.2': all(ground(), greyed(rect(66, 70, 46, 30, CARD, 2, C.ink, 1.4), bracket3d(80, 70, 0.5, C.grey2, C.grey, C.dark), bracket3d(100, 66, 0.5, C.grey2, C.grey, C.dark)), rect(4, 100, 112, 12, C.beige, 0, null),
    bracket3d(40, 92, 1.1), ring(38, 72, 32)),
  // sammanställning (delar): a small cart built from many parts, all inside an orange frame; one loose grey part outside.
  'tdraw.sammanställning.2': all(ground(), frame(8, 18, 80, 90), rect(16, 50, 64, 18, STEEL, 2, C.ink, 1.6), rect(22, 30, 8, 20, C.sky, 1, C.ink, 1.4), rect(66, 30, 8, 20, C.sky, 1, C.ink, 1.4), line('M22 30 L74 30', C.green, 4),
    ...[28, 68].map((x) => all(circle(x, 82, 12, C.dark, C.ink, 1.6), circle(x, 82, 4, STEEL, C.ink, 1.2))), ...[24, 72].map((x) => circle(x, 59, 2, C.dark, null)), greyed(rect(98, 90, 14, 14, STEEL, 2, C.ink, 1.4), circle(105, 97, 3, C.dark, null))),
  // ritbord: a big tilted drawing board on a stand with a sheet, a ruler arm and a lamp.
  'tdraw.ritbord.1': all(rect(0, 0, 120, 112, '#efe8dc', 0, null), ground(), line('M60 70 L44 112 M60 70 L76 112 M50 96 L70 96', C.dark, 3.4), path('M14 76 L100 76 L110 14 L28 14 Z', C.white, C.ink, 2),
    path('M24 70 L94 70 L102 22 L34 22 Z', PAPER, BLUE, 0.8), plateDraw(46, 36, 34, 16, BLUE, 1), line('M30 60 L98 60', C.green, 3), line('M66 28 L60 64', C.green, 3), circle(64, 46, 3, C.dark, null)),

  // ── 4066 Prototyper ────────────────────────────────────────────────
  // modell (liten kopia): a small orange model airplane on a stand on a table; the real airplane flies big and grey in the sky.
  'tdraw.modell.2': all(rect(0, 0, 120, 112, '#dff1fb', 0, null), greyed(g('translate(62 30) scale(2.2)', path('M-20 0 C-20 -3 14 -4 20 0 C14 4 -20 3 -20 0 Z', C.white, C.ink, 1), path('M-2 0 L-10 -12 L-5 -12 L6 0 Z M-2 0 L-10 12 L-5 12 L6 0 Z M-18 0 L-22 -7 L-18 -7 L-14 0 Z', C.white, C.ink, 1))),
    rect(6, 92, 108, 8, C.tan, 2, C.ink, 1.6), line('M14 100 L14 112 M106 100 L106 112', C.brown, 3), line('M60 92 L60 80', C.dark, 2.4), rect(52, 90, 16, 3, C.dark, 1, null),
    g('translate(60 78)', path('M-20 0 C-20 -3 14 -4 20 0 C14 4 -20 3 -20 0 Z', HL, C.ink, 1.4), path('M-2 0 L-10 -12 L-5 -12 L6 0 Z M-2 0 L-10 12 L-5 12 L6 0 Z M-18 0 L-22 -7 L-18 -7 L-14 0 Z', '#f5a46a', C.ink, 1.2))),
  // attrapp: a television made of cardboard on a shop shelf; the folded edge and the tape show that it is not real.
  'tdraw.attrapp.1': all(rect(0, 0, 120, 112, '#efe8dc', 0, null), ground(), rect(10, 84, 100, 28, C.brown, 2, C.ink, 1.8), path('M18 24 L96 24 L104 18 L104 72 L96 78 Z', '#a8844f', C.ink, 1.6), rect(18, 24, 78, 54, CARD, 1, C.ink, 1.8),
    rect(24, 30, 66, 42, '#3a3f4b', 1, null), path('M30 66 L84 36', 'none', 'rgba(255,255,255,0.18)'), line('M30 64 L52 40', '#5a606c', 6), rect(50, 20, 14, 8, '#e8dfc5', 1, C.ink, 1), line('M26 78 L26 84 M88 78 L88 84', C.ink, 2),
    path('M96 24 L104 18 L112 10 L104 16 Z', '#d9b886', C.ink, 1.2), line('M98 26 C99 28 101 28 102 26 C103 24 104 30 101 34 M100 40 C102 44 98 48 101 52 C103 56 99 60 101 64', '#8a6a3a', 1), rect(40, 76, 34, 5, '#e8dfc5', 1, C.ink, 0.8), g('translate(84 96)', rect(0, 0, 20, 10, C.white, 1, C.ink, 1), T(10, 8, '499:-', 6, C.ink))),
  // konstruera: a bridge is drawn with ruler and pencil; the last orange beam slides into place.
  'tdraw.konstruera.1': all(sheet(6, 14, 108, 92), line('M14 80 L106 80', BLUE, 2), line('M14 80 L30 52 L46 80 L62 52 L78 80 L94 52 L106 80 M30 52 L94 52', BLUE, 1.6), rect(10, 80, 10, 20, 'none', 0, BLUE, 1.4), rect(100, 80, 10, 20, 'none', 0, BLUE, 1.4),
    waIn('tdraw-bridge', 0, -16, line('M62 52 L78 80', HL, 3)), rect(14, 90, 70, 6, '#cfe3c8', 1, C.ink, 1), pencil(80, 82, -50), fist(94, 66, 12, 16)),
  // provköra: a new car drives on a test track between cones; it moves forward.
  'tdraw.provköra.1': all(rect(0, 88, 120, 32, '#9aa3ad', 0, null), line('M0 100 L120 100', C.white, 2, '10 8'), ...[14, 54, 94].map((x) => path(`M${x} 88 L${x + 4} 76 L${x + 8} 88 Z`, HL, C.ink, 1.2)),
    moving('tdraw-drive', '0%{transform:translate(-40px,0)}60%,100%{transform:translate(0,0)}', { dur: 2.6 }, car(66, 96, 1.1, C.green), line('M20 80 L30 80 M16 86 L28 86', C.grey, 1.6)), g('translate(102 24)', circle(0, 0, 10, C.white, C.ink, 1.6), line('M0 0 L0 -7 M0 0 L5 2', C.ink, 1.6))),
  // barnsjukdom (ny produkt, symbol): a brand-new car with sparkles has small problems: a warning light, a little smoke and a plaster.
  'tdraw.barnsjukdom.2': all(ground(), car(60, 106, 1.5, C.sky), sparkle(20, 40, 6), sparkle(102, 36, 5), sparkle(30, 22, 4), plaster(40, 84, -20),
    path('M90 70 C86 62 94 58 90 50 C88 44 96 40 94 34', 'none', C.grey, 3), g('translate(62 28)', path('M0 -12 L12 9 L-12 9 Z', C.yellow, C.ink, 1.6), line('M0 -4 L0 3', C.ink, 2), circle(0, 6, 1.2, C.ink, null))),
  // patent: a certificate with a red seal and a light bulb on it, locked with a padlock.
  'tdraw.patent.1': all(rect(14, 10, 72, 96, PAPER, 2, C.ink, 1.8), rect(20, 16, 60, 84, 'none', 1, C.gold, 1.4), idea(50, 48, 1.4), line('M28 76 L72 76 M28 84 L62 84', C.grey, 1.6),
    circle(70, 92, 9, C.red, C.ink, 1.4), path('M64 98 L60 112 L66 108 L70 114 L72 99', C.red, C.ink, 1.2), padlock(98, 70, 1.4, false, C.gold)),
  // produktutveckling: a circle of orange arrows from an idea via a sketch and a rough cardboard model to a finished shiny product.
  'tdraw.produktutveckling.1': all(idea(60, 24, 1), g('translate(96 60)', rect(-11, -9, 22, 18, PAPER, 1, C.ink, 1.2), path('M-6 4 C-4 -4 4 -4 6 4', 'none', C.dark, 1.2)),
    g('translate(60 96)', rect(-12, -9, 24, 18, CARD, 1, C.ink, 1.4), line('M-12 -2 L12 -2', '#8a6a3a', 1, '2 2')), g('translate(24 60)', rect(-12, -9, 24, 18, C.sky, 4, C.ink, 1.6), circle(0, 0, 4, C.white, C.ink, 1), sparkle(12, -12, 4)),
    path('M74 22 C88 28 96 38 98 46', 'none', HL, 2.4), head(98, 47, 75, HL, 6), path('M96 74 C92 86 84 94 76 96', 'none', HL, 2.4), head(75, 96, 165, HL, 6),
    path('M44 96 C32 92 26 84 24 74', 'none', HL, 2.4), head(24, 72, 255, HL, 6), path('M24 46 C28 34 38 26 46 23', 'none', HL, 2.4), head(48, 22, -15, HL, 6)),

  // ── 4067 Konstruktionsändringar ────────────────────────────────────
  // konstruktionsändring: on one drawing the thin grey arm is crossed out and replaced by a thicker orange arm inside a revision cloud.
  'tdraw.konstruktionsändring.1': all(sheet(6, 10, 108, 100), rect(16, 70, 60, 14, 'none', 1, BLUE, 1.6), greyed(rect(22, 36, 6, 34, 'none', 0, C.grey, 1.4)), cross(25, 52, 7),
    rect(56, 36, 14, 34, '#fde7d9', 0, HL, 2.4), arrow(32, 52, 52, 52, HL, 2), path('M50 30 C54 24 60 24 63 28 C66 24 72 24 75 30 C80 32 80 40 76 42 C80 48 78 58 76 62 C80 68 76 76 70 76 C66 80 58 80 55 76 C48 76 46 68 50 64 C46 58 46 48 50 44 C46 40 46 32 50 30 Z', 'none', HL, 1.2),
    g('translate(100 96)', path('M-8 6 L0 -8 L8 6 Z', '#fde7d9', HL, 1.6))),
  // revision (symbol): a stack of drawings; the old ones behind are grey and crossed, the newest one in front has an orange corner tag.
  'tdraw.revision.2': all(greyed(g('translate(10 8)', sheet(0, 0, 66, 76), T(56, 70, 'A', 8, C.ink)), g('translate(22 18)', sheet(0, 0, 66, 76), T(56, 70, 'B', 8, C.ink))), cross(24, 20, 6), cross(36, 30, 6),
    sheet(34, 30, 72, 80), plateDraw(44, 44, 46, 20), path('M86 90 L106 90 L106 110 L86 110 Z', HL, C.ink, 1.4), T(96, 105, 'C', 12, C.white), tick(60, 86, 7)),
  // avvikelserapport: a form on a clipboard with a warning sign and filled lines; a hand writes, a broken part lies beside it.
  'tdraw.avvikelserapport.1': all(ground(), rect(18, 12, 62, 92, C.brown, 4, C.ink, 1.8), rect(24, 20, 50, 80, C.white, 1, C.ink, 1.2), rect(40, 8, 18, 8, C.silver, 2, C.ink, 1.2),
    g('translate(49 38)', path('M0 -12 L13 10 L-13 10 Z', C.yellow, HL, 2), line('M0 -4 L0 3', C.ink, 2.2), circle(0, 6.6, 1.3, C.ink, null)), line('M30 60 L68 60 M30 70 L68 70 M30 80 L56 80 M30 90 L62 90', C.grey, 1.6),
    ...[60, 70].map((y) => rect(30, y - 4, 4, 4, 'none', 0, C.ink, 1)), pencil(62, 90, -45, 26), g('translate(98 100)', rect(-14, -4, 12, 8, STEEL, 1, C.ink, 1.2), rect(2, -4, 12, 8, STEEL, 1, C.ink, 1.2), path('M-2 -4 L0 0 L-2 4 M2 -4 L0 0 L2 4', 'none', C.red, 1.4))),
};
