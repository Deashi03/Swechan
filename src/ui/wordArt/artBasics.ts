/**
 * Kultur & fritid → Bildkonst & design → Bildkonstens grunder, 4511–4517 (0.63): line and shape, colour and colour
 * mixing, composition, perspective, light and shadow, texture and surface, art materials.
 * Recurring signs: the part the word names is orange (an orange ring, frame, arrow or outline); grey shows what the
 * word is not. Pictures hang on a warm wall, drawings lie on white paper, and a hand holds the pencil (no pointing
 * finger). Pairs that are easy to mix up get different kinds of picture: a finished drawing on the fridge (teckning)
 * against loose searching lines in a pad (skiss) against a hand tracing round fingers (kontur); vases of different
 * shapes (form) against crisp shapes (geometrisk) against soft blobs (organisk); three pure blobs (grundfärg) against
 * three "a + b →" rows (sekundärfärg) against two streams running into a bowl (färgblandning); a ball's own dark side
 * close up (egenskugga) against a post's long shadow on the ground (slagskugga). Verbs move (base state = poster
 * frame, transform and opacity only). Only code characters (+, →) appear; no letters, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waIn, waPulse, waSpin, waSway, type Svg } from './kit';
import { HL } from './people';
import { greyed } from './blindFix';

// ── Basics ───────────────────────────────────────────────────────────
const f1 = (n: number) => +n.toFixed(1);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const ground = (y = 112, col: string = C.grey2) => line(`M4 ${y} L116 ${y}`, col, 2);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const WALL = '#efe7da', TABLE = '#d9b98c', WOOD = '#b98352';
const wall = (col: string = WALL) => rect(0, 0, 120, 120, col, 0, null);
const table = (y = 92) => all(rect(0, y, 120, 120 - y, TABLE, 0, null), line(`M0 ${y} L120 ${y}`, C.ink, 1.4));
const sheet = (x: number, y: number, w: number, h: number, fill: string = C.white) => all(rect(x + 2, y + 2, w, h, 'rgba(0,0,0,0.12)', 2, null), rect(x, y, w, h, fill, 2, C.ink, 1.6));
/** Pencil with its tip at (0,0), lying along +x, turned by rot. */
const pencil = (x: number, y: number, rot: number, s = 1, col: string = C.yellow) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  path('M0 0 L6 -3.2 L42 -3.2 L42 3.2 L6 3.2 Z', col, C.ink, 1.4), path('M0 0 L6 -3.2 L6 3.2 Z', C.tan, C.ink, 1), path('M0 0 L2.2 -1.2 L2.2 1.2 Z', C.dark, null),
  rect(42, -3.2, 3, 6.4, C.silver, 0, C.ink, 1), rect(45, -3.2, 5, 6.4, C.pink, 1.5, C.ink, 1.2));
/** A hand (with sleeve) holding a pencil whose tip is at (tx, ty); the pencil points down to the left. */
const drawHand = (tx: number, ty: number, tool: 'pencil' | 'crayon' = 'pencil', sleeve: string = C.denim) => {
  const a = (-40 * Math.PI) / 180, hx = f1(tx + 22 * Math.cos(a)), hy = f1(ty + 22 * Math.sin(a));
  return all(tool === 'pencil' ? pencil(tx, ty, -40) : g(`translate(${tx} ${ty}) rotate(-40)`, rect(0, -4, 30, 8, C.red, 2, C.ink, 1.4), rect(8, -4, 14, 8, C.white, 0, C.ink, 1)),
    g(`translate(${hx} ${hy}) rotate(-40)`, path('M7 -7.5 L70 -10 L70 10 L7 7.5 Z', sleeve, C.ink, 1.6), ellipse(2, 0, 8.5, 7, C.skin, C.ink, 1.6), path('M-4.5 -3 C-8 -1 -7 3.5 -3 3.5', 'none', C.ink, 1.1)));
};
const blob = (x: number, y: number, r: number, col: string, sw = 1.6) =>
  path(`M${f1(x - r)} ${y} C${f1(x - r)} ${f1(y - r * 1.1)} ${f1(x + r * 0.2)} ${f1(y - r * 1.2)} ${f1(x + r * 0.6)} ${f1(y - r * 0.8)} C${f1(x + r * 1.2)} ${f1(y - r * 0.4)} ${f1(x + r * 1.1)} ${f1(y + r * 0.6)} ${f1(x + r * 0.4)} ${f1(y + r * 0.9)} C${f1(x - r * 0.3)} ${f1(y + r * 1.2)} ${f1(x - r)} ${f1(y + r * 0.7)} ${f1(x - r)} ${y} Z`, col, C.ink, sw);
const plus = (x: number, y: number, s = 4) => line(`M${x - s} ${y} L${x + s} ${y} M${x} ${y - s} L${x} ${y + s}`, C.ink, 2.2);
/** A framed picture on the wall. */
const picture = (x: number, y: number, w: number, h: number, inner: Svg, wood: string = WOOD) =>
  all(rect(x - 4, y - 4, w + 8, h + 8, wood, 2, C.ink, 1.6), rect(x, y, w, h, '#f8f4ea', 0, C.ink, 1.2), inner);
const brush = (x: number, y: number, rot: number, tip: string = C.dark, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  path('M0 0 C2 -3 6 -3.5 9 -2.5 L9 2.5 C6 3.5 2 3 0 0 Z', tip, C.ink, 1.1), rect(9, -2.5, 6, 5, C.silver, 0.5, C.ink, 1), path('M15 -2 L46 -1.2 L46 1.2 L15 2 Z', '#c0392b', C.ink, 1.1));
const sun = (x: number, y: number, r = 7) => all(...range(8).map((i) => { const a = (i / 8) * Math.PI * 2; return line(`M${f1(x + Math.cos(a) * (r + 3))} ${f1(y + Math.sin(a) * (r + 3))} L${f1(x + Math.cos(a) * (r + 7))} ${f1(y + Math.sin(a) * (r + 7))}`, C.gold, 2); }), circle(x, y, r, C.yellow, C.ink, 1.4));
const flake = (x: number, y: number, s = 1, col = '#5aa7d6') => g(`translate(${x} ${y}) scale(${s})`, line('M0 -8 L0 8 M-7 -4 L7 4 M-7 4 L7 -4 M-2 -6 L0 -4 L2 -6 M-2 6 L0 4 L2 6', col, 1.8));
const drop = (x: number, y: number, s = 1, col = '#8cc7e8') => path(`M${x} ${y - 6 * s} C${x + 5 * s} ${y} ${x + 4 * s} ${y + 5 * s} ${x} ${y + 5 * s} C${x - 4 * s} ${y + 5 * s} ${x - 5 * s} ${y} ${x} ${y - 6 * s} Z`, col, C.ink, 1);
const eye = (x: number, y: number, s = 1) => at(x, y, s, path('M-9 0 Q0 -8 9 0 Q0 8 -9 0 Z', C.white, C.ink, 1.4), circle(0, 0, 3.2, C.navy, null), circle(1, -1, 1, C.white, null));
const mountains = (y: number, col: string, h = 26, xs = [0, 40, 80, 120]) => path(`M-4 ${y} ${xs.map((x, i) => `L${x + 20} ${y - h + (i % 2) * 8} L${x + 40} ${y}`).join(' ')} L124 ${y} L124 ${y + 6} L-4 ${y + 6} Z`, col, C.ink, 1.2);
const spruce = (x: number, y: number, s = 1, col = '#3f7d4f') => at(x, y, s, rect(-1.5, -5, 3, 5, C.brown, 0.5, null), path('M0 -30 L8 -14 L4 -14 L10 -4 L-10 -4 L-4 -14 L-8 -14 Z', col, C.ink, 1.1));
const wedge = (cx: number, cy: number, r0: number, r1: number, a0: number, a1: number, col: string) => {
  const p = (r: number, a: number) => `${f1(cx + r * Math.cos(a))} ${f1(cy + r * Math.sin(a))}`;
  return path(`M${p(r0, a0)} L${p(r1, a0)} A${r1} ${r1} 0 0 1 ${p(r1, a1)} L${p(r0, a1)} A${r0} ${r0} 0 0 0 ${p(r0, a0)} Z`, col, C.ink, 1.2);
};
const WHEEL = ['#f2d43c', '#f5b13a', '#ef8a3c', '#e8613a', '#d64545', '#b5407a', '#8a6bbf', '#5b5fb5', '#3f6fb5', '#2f9a9a', '#4f9d69', '#9cc24a'];
const RED = '#d8322f', YEL = '#f4cf2c', BLU = '#2f5fb8', ORA = '#f08a2a', GRN = '#3f9e4f', PUR = '#7d4fb0';
const VASE = { round: 'M-6 -42 L6 -42 L5 -35 C22 -28 22 -4 10 0 L-10 0 C-22 -4 -22 -28 -5 -35 Z', tall: 'M-5 -60 L5 -60 L4 -52 C10 -40 9 -12 7 0 L-7 0 C-9 -12 -10 -40 -4 -52 Z', cone: 'M-19 -34 L19 -34 L6 0 L-6 0 Z' };
const vase = (x: number, y: number, kind: keyof typeof VASE, col: string, outline?: string) => g(`translate(${x} ${y})`,
  outline ? path(VASE[kind], 'none', outline, 6) : '', path(VASE[kind], col, C.ink, 1.8));
const darkSide = (x: number, y: number, r: number) => `M${x} ${f1(y - r)} A${r} ${r} 0 0 1 ${x} ${f1(y + r)} A${f1(r * 0.45)} ${r} 0 0 0 ${x} ${f1(y - r)} Z`;
const ball = (x: number, y: number, r: number, col: string = '#e8604a', dark = '#9b3426') => all(
  circle(x, y, r, col, C.ink, 1.8), path(darkSide(x, y, r), dark, null), circle(x, y, r, 'none', C.ink, 1.8));
const lamp = (x: number, y: number, s = 1, on = true) => at(x, y, s, line('M0 -40 L0 -14', C.ink, 1.6), path('M-12 0 L-6 -14 L6 -14 L12 0 Z', C.navy, C.ink, 1.6), on ? circle(0, 2, 4, '#fff5b8', C.ink, 1) : circle(0, 2, 4, C.grey2, C.ink, 1));

export const ARTB_MOTIFS: Record<string, Svg> = {
  // ── 4511 Linje och form ──────────────────────────────────────────
  // konst: a gallery wall – a framed landscape, a framed abstract painting and a bust on a plinth, a note between them
  'artb.konst': all(wall(), rect(0, 100, 120, 20, '#cdb79a', 0, null), line('M0 100 L120 100', C.ink, 1.4),
    picture(10, 14, 38, 28, all(rect(10, 14, 38, 28, '#bfe3f5', 0, null), path('M10 42 L10 34 L20 26 L28 33 L36 27 L48 36 L48 42 Z', '#6f9f6a', C.ink, 1.2), circle(40, 21, 3.5, YEL, C.ink, 1))),
    picture(58, 12, 22, 34, all(rect(60, 16, 10, 12, RED, 0, null), circle(72, 36, 5, YEL, C.ink, 1), path('M60 44 L78 30', 'none', BLU, 3))),
    rect(88, 70, 22, 30, '#e6e2da', 1, C.ink, 1.6), path('M92 70 C90 60 92 52 99 50 C106 52 108 60 106 70 Z', '#dcd6cc', C.ink, 1.6), circle(99, 42, 8, '#dcd6cc', C.ink, 1.6),
    rect(14, 56, 60, 30, '#f8f4ea', 2, C.ink, 1.4), path('M22 80 C30 62 40 62 46 74 C50 66 58 64 66 78', 'none', C.dark, 2), circle(26, 64, 3, C.dark, null),
    at(96, 18, 1, line('M2.6 5 L2.6 -10 C6 -8 8 -6 8 -2', C.navy, 2), ellipse(0, 5.6, 3.4, 2.6, C.navy, null))),
  // teckna: a hand draws a cat with a pencil; the hand moves along the line
  'artb.teckna.2': all(table(70), sheet(14, 30, 92, 70),
    path('M34 84 C30 70 34 58 46 56 L44 46 L52 53 L60 53 L66 46 L65 57 C76 62 78 76 72 84 Z', 'none', C.dark, 2), circle(52, 66, 1.4, C.dark, null), circle(60, 66, 1.4, C.dark, null), path('M54 72 L56 74 L58 72', 'none', C.dark, 1.4),
    path('M72 80 C84 78 88 70 86 62', 'none', C.dark, 2),
    moving('artb-teckna', '0%{transform:translate(-30px,6px)}50%{transform:translate(-14px,-10px)}100%{transform:translate(0,0)}', { dur: 2.6 }, drawHand(86, 62))),
  // teckning: a finished colour drawing (a house, a sun) held on the fridge door by a magnet
  'artb.teckning': all(rect(0, 0, 120, 120, '#e8edf0', 0, null), rect(18, 4, 84, 112, C.white, 8, C.ink, 2), line('M18 40 L102 40', C.ink, 1.6), rect(92, 18, 4, 14, C.grey, 2, C.ink, 1), rect(92, 52, 4, 22, C.grey, 2, C.ink, 1),
    sheet(28, 46, 60, 52), path('M40 88 L40 70 L52 60 L64 70 L64 88 Z', '#f2a65a', C.ink, 1.6), path('M38 71 L52 58 L66 71', 'none', RED, 3), rect(48, 76, 8, 12, C.brown, 1, C.ink, 1.2),
    sun(76, 58, 5), line('M30 92 L86 92', GRN, 3), circle(58, 47, 4.5, RED, C.ink, 1.4)),
  // skiss: a pad with loose, searching pencil lines of a house – several tries, nothing finished
  'artb.skiss': all(table(96), sheet(12, 14, 96, 82, '#fbfaf5'), line('M12 20 L108 20', C.grey2, 1),
    path('M30 80 L31 52 L58 32 L86 52 L85 80', 'none', C.grey, 1.4), path('M28 79 L29 54 L57 34 L88 53 L87 81', 'none', C.grey, 1.1), line('M33 81 L33 50 L59 30 L84 50', C.dark, 1.2, '6 3'),
    path('M27 80 L90 81 M29 82 L88 79', 'none', C.grey, 1.1), path('M50 80 L50 64 L62 64 L62 80', 'none', C.dark, 1.2), path('M48 81 L51 63 L63 65 L61 81', 'none', C.grey, 1),
    path('M68 58 L78 58 L78 68 L68 68 Z', 'none', C.grey, 1.1), line('M70 46 L76 40 M40 46 L36 42', C.grey2, 1.2),
    pencil(96, 88, -150, 0.8)),
  // kontur: a hand lies on the paper and a pencil traces round the fingers – the orange line is the outline
  'artb.kontur': all(table(14), sheet(10, 22, 100, 90),
    path('M40 104 L40 66 C38 56 46 56 47 64 L48 56 C47 44 55 44 56 54 L57 50 C57 38 65 38 65 50 L66 54 C67 44 75 45 74 56 L74 70 C80 62 88 64 84 72 C80 80 74 90 70 104 Z', 'none', HL, 3),
    path('M44 104 L44 68 C43 62 46 62 47 67 L49 58 C49 50 54 50 54 57 L56 54 C56 44 63 44 63 54 L64 57 C65 50 70 51 70 58 L70 74 C76 68 82 69 80 74 C77 80 72 90 68 104 Z', C.skin, C.ink, 1.6),
    rect(42, 104, 30, 10, C.denim, 0, C.ink, 1.4), drawHand(85, 71, 'pencil', C.green)),
  // form: three vases in the same colour but with different shapes, each shape outlined in orange
  'artb.form.2': all(wall(), table(96),
    vase(26, 96, 'round', '#4c7fc0', HL), vase(60, 96, 'tall', '#4c7fc0', HL), vase(94, 96, 'cone', '#4c7fc0', HL)),
  // geometrisk: a picture of crisp circle, triangle and square (in colour); soft blobs in grey at the side
  'artb.geometrisk': all(wall(), picture(14, 14, 64, 64, all(rect(20, 46, 26, 26, BLU, 0, C.ink, 1.6), path('M50 72 L62 44 L74 72 Z', YEL, C.ink, 1.6), circle(44, 30, 11, RED, C.ink, 1.6), line('M18 40 L76 40', C.ink, 1.2))),
    frame(6, 6, 80, 80), greyed(blob(102, 30, 9, C.green), blob(100, 62, 8, C.orange), blob(104, 92, 7, C.purple))),
  // organisk: a picture of soft, rounded shapes like a leaf, a pebble and a cloud (in colour); hard squares in grey at the side
  'artb.organisk.2': all(wall(), picture(14, 14, 64, 64, all(path('M22 68 C20 50 34 38 48 44 C40 52 34 60 22 68 Z', GRN, C.ink, 1.6), path('M22 68 C34 58 40 52 48 44', 'none', C.ink, 1),
    blob(60, 60, 11, '#e9a178'), path('M30 30 C30 22 40 20 44 26 C48 18 62 20 62 28 C70 28 70 38 62 38 L32 38 C24 38 24 30 30 30 Z', '#9fc8e8', C.ink, 1.6))),
    frame(6, 6, 80, 80), greyed(rect(94, 22, 16, 16, C.navy, 0, C.ink, 1.4), path('M94 70 L102 54 L110 70 Z', C.yellow, C.ink, 1.4), rect(94, 86, 16, 16, C.red, 0, C.ink, 1.4))),
  // oval: a mirror with an oval frame (ringed in orange), an egg below; a round mirror in grey for reference
  'artb.oval': all(wall(), ellipse(46, 50, 24, 36, WOOD, C.ink, 2), ellipse(46, 50, 18, 30, '#d6eaf2', C.ink, 1.4), line('M36 32 L44 62 M50 28 L58 58', C.white, 2),
    ellipse(46, 50, 30, 42, 'none', HL, 2.6), ellipse(46, 106, 8, 10, '#fbf4e6', C.ink, 1.6),
    greyed(circle(96, 44, 15, WOOD, C.ink, 2), circle(96, 44, 11, '#d6eaf2', C.ink, 1.4))),
  // spiral: an orange spiral drawn on paper, turning slowly; a snail shell beside it
  'artb.spiral': all(table(98), sheet(8, 10, 74, 84),
    g('translate(45 52)', waSpin('artb-spiral', 9, path('M0 0 C2 -3 6 -1 5 3 C4 8 -4 8 -6 2 C-9 -6 1 -12 8 -8 C16 -4 15 10 5 14 C-6 18 -16 8 -14 -2 C-12 -14 2 -22 14 -16 C26 -10 26 10 16 20', 'none', HL, 3.2))),
    path('M88 108 C84 96 92 86 102 88 C112 90 114 102 106 106 C100 110 94 104 98 98 C101 94 106 97 104 101', '#e3b98a', C.ink, 1.8), path('M84 110 L116 110 L112 104 L90 104 Z', '#c9a07a', C.ink, 1.4)),

  // ── 4512 Färg och färgblandning ─────────────────────────────────────
  // färg: a fan of colour cards – many colours side by side
  'artb.färg.1': all(wall(), ...['#d64545', '#ef8a3c', '#f2c14e', '#9cc24a', '#4f9d69', '#2f9a9a', '#3f6fb5', '#8a6bbf', '#b5407a'].map((col, i) =>
    g(`rotate(${-64 + i * 16} 60 104)`, rect(53, 20, 14, 84, C.white, 3, C.ink, 1.4), rect(54.5, 22, 11, 26, col, 2, null))), circle(60, 104, 4, C.silver, C.ink, 1.4)),
  // grundfärg: three big, pure blobs – red, yellow, blue – each ringed; nothing mixed
  'artb.grundfärg': all(wall('#f6f1e8'), blob(60, 30, 17, YEL), blob(32, 80, 17, RED), blob(88, 80, 17, BLU), ring(60, 30, 24), ring(32, 80, 24), ring(88, 80, 24)),
  // färgblandning: yellow and blue paint run into a white bowl and become green; the drops keep falling
  'artb.färgblandning': all(wall(), table(96), path('M28 74 C28 98 92 98 92 74 Z', C.white, C.ink, 1.8), ellipse(60, 74, 32, 7, C.white, C.ink, 1.8), ellipse(60, 74, 28, 5, GRN, null),
    path('M44 74 C50 70 56 78 62 73 C68 70 72 76 78 74', 'none', '#2f7e3e', 1.6), g('translate(26 30) rotate(-130)', rect(-7, -10, 14, 22, YEL, 3, C.ink, 1.6), rect(-3, -16, 6, 7, C.white, 1, C.ink, 1.4)), g('translate(94 30) rotate(130)', rect(-7, -10, 14, 22, BLU, 3, C.ink, 1.6), rect(-3, -16, 6, 7, C.white, 1, C.ink, 1.4)),
    moving('artb-mix-y', '0%{transform:translate(-8px,-18px);opacity:0}30%{opacity:1}100%{transform:translate(0,0);opacity:1}', { dur: 1.8 }, drop(38, 58, 1.3, YEL)),
    moving('artb-mix-b', '0%{transform:translate(8px,-18px);opacity:0}30%{opacity:1}100%{transform:translate(0,0);opacity:1}', { dur: 1.8, delay: 0.9 }, drop(82, 58, 1.3, BLU)),
    line('M32 40 C36 46 38 50 38 52 M88 40 C84 46 82 50 82 52', C.grey, 1.4, '2 3')),
  // sekundärfärg: three rows "a + b →" – red + yellow → orange, yellow + blue → green, blue + red → purple; the results ringed
  'artb.sekundärfärg': all(wall('#f6f1e8'), ...[[RED, YEL, ORA], [YEL, BLU, GRN], [BLU, RED, PUR]].map(([a, b, c], i) => {
    const y = 22 + i * 38;
    return all(circle(18, y, 9, a!, C.ink, 1.4), plus(36, y), circle(54, y, 9, b!, C.ink, 1.4), arrow(68, y, 84, y, C.ink, 2.4), blob(100, y, 11, c!), ring(100, y, 16));
  })),
  // färgcirkel: a wheel of twelve colours in order
  'artb.färgcirkel': all(wall(), ...WHEEL.map((col, i) => wedge(60, 60, 18, 48, ((i - 3) * Math.PI) / 6 - Math.PI / 12, ((i - 2) * Math.PI) / 6 - Math.PI / 12, col)), circle(60, 60, 18, C.white, C.ink, 1.4)),
  // varm färg: red, orange and yellow swatches with a sun; a cold blue swatch in grey
  'artb.varm-färg': all(wall('#fbf3e6'), sun(92, 24, 10), rect(12, 42, 26, 52, '#d64545', 3, C.ink, 1.6), rect(42, 42, 26, 52, '#ef8a3c', 3, C.ink, 1.6), rect(72, 52, 26, 42, '#f2c14e', 3, C.ink, 1.6),
    frame(6, 36, 98, 64), greyed(rect(100, 100, 14, 14, '#3f6fb5', 2, C.ink, 1.2))),
  // kall färg: blue, blue-green and violet swatches with a snowflake and water; a warm red swatch in grey
  'artb.kall-färg': all(wall('#eef4f8'), flake(92, 24, 1.6), drop(74, 24, 1.3), rect(12, 42, 26, 52, '#3f6fb5', 3, C.ink, 1.6), rect(42, 42, 26, 52, '#2f9a9a', 3, C.ink, 1.6), rect(72, 52, 26, 42, '#6f6ac4', 3, C.ink, 1.6),
    frame(6, 36, 98, 64), greyed(rect(100, 100, 14, 14, '#d64545', 2, C.ink, 1.2))),
  // mättad: paint pressed out of a tube as a pure, strong red, ringed; the same paint mixed with grey, greyed out
  'artb.mättad.3': all(wall(), path('M12 30 L44 22 L48 38 L16 46 Z', '#e9e9e9', C.ink, 1.6), rect(44, 24, 8, 12, C.dark, 1, C.ink, 1.2), blob(76, 46, 22, '#e3122b', 2), ring(76, 46, 30),
    greyed(blob(30, 92, 12, '#b9868b'), blob(62, 98, 10, '#c0a0a4'))),
  // blek: the same T-shirt twice – before: strong and dark blue (grey frame); after sun and washing: faded and patchy (orange frame); a sun and a time arrow between
  'artb.blek.2': all(wall(), sun(60, 18, 8), arrow(46, 62, 74, 62, C.ink, 2.6),
    tee(24, 64, '#1f3f8f'), frame(4, 36, 40, 54, C.grey),
    tee(96, 64, '#a9b4c6'), path('M86 58 C90 54 96 60 100 56 L102 70 C96 74 90 68 86 72 Z', '#c7cfdb', null), path('M92 80 C96 78 102 82 106 80 L106 86 L92 86 Z', '#c3cbd8', null), frame(76, 36, 40, 54),
    drop(54, 98, 1.1), drop(66, 102, 1.1)),
  // palett: a wooden palette with a thumb hole and blobs of paint, a brush across it
  'artb.palett': all(wall(), path('M16 70 C8 40 40 18 72 22 C102 26 116 50 104 72 C96 86 80 80 74 90 C68 102 44 104 30 94 C22 88 20 80 16 70 Z', '#d7a86e', C.ink, 2),
    ellipse(80, 64, 6, 5, WALL, C.ink, 1.6), blob(36, 50, 7, RED, 1.2), blob(54, 38, 7, YEL, 1.2), blob(76, 38, 7, BLU, 1.2), blob(92, 52, 6, C.white, 1.2), blob(40, 76, 7, GRN, 1.2), blob(58, 62, 6, ORA, 1.2),
    brush(28, 104, -30)),

  // ── 4513 Komposition ───────────────────────────────────────────────
  // komposition: a picture whose parts (hill, tree, sun, boat) are placed on orange guide lines that divide it in thirds
  'artb.komposition': all(wall(), picture(12, 18, 96, 72, all(rect(12, 18, 96, 72, '#cfe6f2', 0, null), path('M12 70 C40 60 70 66 108 58 L108 90 L12 90 Z', '#8fbf7a', null), spruce(44, 70, 1.1), sun(76, 38, 6),
    line('M44 18 L44 90 M76 18 L76 90 M12 42 L108 42 M12 66 L108 66', HL, 1.6, '4 3'), circle(44, 42, 3, HL, null), circle(76, 42, 3, HL, null), circle(44, 66, 3, HL, null), circle(76, 66, 3, HL, null)))),
  // blickfång: a grey sea picture with one red boat; an eye looks at it along an orange line, the boat ringed
  'artb.blickfång': all(wall(), picture(10, 14, 74, 60, all(rect(10, 14, 74, 60, '#c9d2da', 0, null), path('M10 52 C30 48 60 50 84 48 L84 74 L10 74 Z', '#9aa7b3', null), path('M58 56 L78 56 L74 62 L62 62 Z', '#e0322b', C.ink, 1.4), line('M68 56 L68 40', C.ink, 1.4), path('M68 40 L68 54 L78 54 Z', C.white, C.ink, 1))),
    ring(68, 54, 12), eye(100, 100, 1.4), line('M94 94 L76 64', HL, 2, '3 3')),
  // asymmetrisk: a dashed axis through a pine with a long branch to one side – the two sides differ; a symmetric tree in grey
  'artb.asymmetrisk.2': all(wall(), ground(104), line('M44 14 L44 106', HL, 2, '5 4'),
    rect(41, 64, 6, 40, C.brown, 1, C.ink, 1.4), path('M44 66 C60 58 80 56 98 60 C86 50 66 48 52 54 C58 44 54 32 44 28 C34 34 34 50 44 58 Z', '#3f7d4f', C.ink, 1.6), path('M47 70 C64 68 80 72 94 76 C80 66 62 64 47 66 Z', '#4f9d69', C.ink, 1.4),
    greyed(rect(100, 86, 4, 18, C.brown, 0, C.ink, 1), path('M102 60 L112 86 L92 86 Z', '#3f7d4f', C.ink, 1.2))),
  // balans: a beam on a triangle with one big block near the middle and two small ones far out – it rocks and stays level
  'artb.balans.2': all(wall(), path('M52 106 L60 88 L68 106 Z', C.grey, C.ink, 1.6), ground(106),
    g('translate(60 88)', waSway('artb-balans', 4, all(rect(-50, -4, 100, 6, WOOD, 2, C.ink, 1.6), rect(-30, -30, 26, 26, C.navy, 2, C.ink, 1.6), rect(30, -16, 12, 12, HL, 2, C.ink, 1.4), rect(30, -28, 12, 12, HL, 2, C.ink, 1.4))))),
  // format: three sheets – tall, wide and square – each with the same small picture, the tall one with orange size arrows
  'artb.format.1': all(wall(), sheet(10, 14, 34, 50), mountains(56, '#8fbf7a', 10, [10]), circle(32, 28, 4, YEL, C.ink, 1),
    sheet(54, 30, 58, 34), path('M56 62 L72 50 L84 60 L96 48 L110 62 Z', '#8fbf7a', C.ink, 1), circle(98, 40, 4, YEL, C.ink, 1),
    sheet(36, 74, 34, 34), path('M38 106 L52 92 L68 106 Z', '#8fbf7a', C.ink, 1), circle(60, 84, 4, YEL, C.ink, 1),
    arrow(6, 40, 6, 16, HL, 2.2), arrow(6, 40, 6, 62, HL, 2.2), arrow(27, 68, 12, 68, HL, 2.2), arrow(27, 68, 42, 68, HL, 2.2)),
  // gyllene snittet: a rectangle cut into squares that get smaller, with the orange curve through them; the big square ringed
  'artb.gyllene-snittet': all(wall(), rect(12, 30, 97, 60, '#f8f4ea', 0, C.ink, 2), line('M72 30 L72 90 M72 67 L109 67 M86 67 L86 90 M72 76 L86 76', C.ink, 1.4),
    path('M12 90 A60 60 0 0 1 72 30 A37 37 0 0 1 109 67 A23 23 0 0 1 86 90 A14 14 0 0 1 72 76', 'none', HL, 3), frame(10, 28, 64, 64, C.grey)),

  // ── 4514 Perspektiv ─────────────────────────────────────────────────
  // försvinningspunkt: a straight road and fences run to one point on the horizon – the point is ringed, guide lines dashed
  'artb.försvinningspunkt': all(rect(0, 0, 120, 52, '#cfe6f2', 0, null), rect(0, 52, 120, 68, '#a8cf8e', 0, null), line('M0 52 L120 52', C.ink, 1.4),
    path('M20 120 L60 52 L100 120 Z', '#9aa3ad', C.ink, 1.4), line('M60 56 L60 62 M60 70 L60 80 M60 90 L60 106', C.white, 2),
    line('M0 80 L60 52 M120 80 L60 52 M0 104 L60 52 M120 104 L60 52', HL, 1.4, '3 3'), ...[0, 1, 2, 3].map((i) => { const t = [0.1, 0.3, 0.55, 0.85][i]!; const x = f1(60 - 60 * t), y = f1(52 + 28 * t); return line(`M${x} ${y} L${x} ${f1(y - 14 * t - 2)}`, C.brown, 2); }),
    circle(60, 52, 3, HL, null), ring(60, 52, 8)),
  // djupverkan: three ridges, paler and bluer further back, trees smaller and smaller – an orange arrow points into the picture
  'artb.djupverkan': all(rect(0, 0, 120, 120, '#e6f0f6', 0, null), mountains(52, '#c9d8e6', 18), mountains(72, '#9db8cf', 20, [-20, 20, 60, 100]), path('M-4 86 C30 80 80 84 124 80 L124 124 L-4 124 Z', '#7fae6c', C.ink, 1.2),
    spruce(16, 116, 1.5), spruce(34, 110, 1.1), spruce(50, 92, 0.7), spruce(62, 86, 0.45), spruce(72, 82, 0.3), arrow(92, 112, 72, 70, HL, 3)),
  // proportion: a standing figure beside a column of seven head-sized ovals – head to height, marked in orange
  'artb.proportion': all(wall(), ...range(7).map((i) => ellipse(30, 22 + i * 12.6, 6, 6.3, i === 0 ? HL : 'none', i === 0 ? C.ink : HL, 1.6)), line('M18 16 L42 16 M18 104 L42 104', HL, 2),
    circle(76, 22, 6.3, C.skin, C.ink, 1.6), path('M70 30 L82 30 L84 62 L68 62 Z', C.sky, C.ink, 1.6), line('M70 32 L62 58 M82 32 L90 58', C.ink, 4), line('M70 32 L62 58 M82 32 L90 58', C.skin, 2.6),
    path('M69 62 L83 62 L82 104 L77 104 L76 70 L75 104 L70 104 Z', C.navy, C.ink, 1.6), line('M50 22 L104 22 M50 104 L104 104', C.grey2, 1, '2 3')),
  // realistisk: a pear drawn with light, shadow and colour (framed in orange) beside a child-like flat pear in grey
  'artb.realistisk.2': all(wall(), picture(10, 22, 56, 70, all(path('M38 36 C30 36 32 50 28 58 C20 70 22 86 38 86 C54 86 56 70 48 58 C44 50 46 36 38 36 Z', '#c9c24a', C.ink, 1.6),
    path('M46 58 C52 68 54 84 38 86 C48 80 50 68 44 58 Z', '#8f8a2e', null), ellipse(32, 66, 3, 6, '#f2efb8', null), line('M38 36 L40 28', C.brown, 2), ellipse(52, 88, 12, 3, 'rgba(0,0,0,0.18)', null))),
    frame(2, 14, 72, 86), greyed(picture(84, 40, 28, 36, all(path('M98 46 C94 46 94 54 92 58 C88 64 90 72 98 72 C106 72 108 64 104 58 C102 54 102 46 98 46 Z', C.yellow, C.ink, 1.4), circle(96, 60, 1, C.ink, null), circle(100, 60, 1, C.ink, null))))),
  // fågelperspektiv: roofs and streets seen from straight above, a bird flying over them, an orange arrow pointing down
  'artb.fågelperspektiv': all(rect(0, 0, 120, 120, '#a8cf8e', 0, null), rect(0, 52, 120, 12, '#9aa3ad', 0, null), rect(52, 0, 12, 120, '#9aa3ad', 0, null),
    ...[[8, 8], [8, 70], [72, 8], [72, 70]].map(([x, y]) => all(rect(x!, y!, 38, 38, '#c9603e', 1, C.ink, 1.4), line(`M${x} ${y! + 19} L${x! + 38} ${y! + 19}`, C.ink, 1.2), line(`M${x} ${y} L${x! + 19} ${y! + 19} L${x} ${y! + 38} M${x! + 38} ${y} L${x! + 19} ${y! + 19} L${x! + 38} ${y! + 38}`, '#8e3b24', 1))),
    circle(30, 52, 2.4, C.red, null), circle(84, 64, 2.4, C.yellow, null),
    g('translate(80 40)', path('M-16 -2 C-8 -10 -2 -6 0 0 C2 -6 8 -10 16 -2 C8 -4 4 -2 0 4 C-4 -2 -8 -4 -16 -2 Z', C.dark, C.ink, 1)), arrow(100, 18, 100, 34, HL, 2.6)),
  // grodperspektiv: a tall tree seen from the ground, its trunk narrowing to the sky; a frog at the bottom looks up, an orange arrow up
  'artb.grodperspektiv': all(rect(0, 0, 120, 120, '#cfe6f2', 0, null), path('M44 120 L56 30 L64 30 L76 120 Z', '#8a5a3a', C.ink, 1.6),
    path('M60 4 C30 6 18 30 30 44 C40 54 80 54 90 44 C102 30 90 6 60 4 Z', '#3f7d4f', C.ink, 1.6), path('M40 40 C48 32 72 32 80 40', 'none', '#2f6040', 1.4),
    path('M8 120 C10 106 24 104 30 110 L36 120 Z', '#6fae5a', C.ink, 1.6), circle(14, 106, 3.6, C.white, C.ink, 1.2), circle(24, 104, 3.6, C.white, C.ink, 1.2), circle(14, 105, 1.6, C.ink, null), circle(24, 103, 1.6, C.ink, null),
    arrow(20, 94, 30, 70, HL, 2.6)),

  // ── 4515 Ljus och skugga ────────────────────────────────────────────
  // ljus: sunlight falls through a window as a broad pale beam onto the floor of a dim room
  'artb.ljus-noun': all(rect(0, 0, 120, 120, '#6c6a7c', 0, null), rect(0, 92, 120, 28, '#5a5566', 0, null), rect(14, 14, 34, 42, '#fff4c4', 2, C.ink, 2), line('M31 14 L31 56 M14 35 L48 35', C.ink, 2),
    path('M14 56 L48 56 L110 104 L52 112 Z', 'rgba(255,240,170,0.55)', null), path('M14 14 L48 14 L48 56 L14 56 Z', 'none', C.ink, 2)),
  // lysa upp: a lamp in a dark room comes on and its light spreads over the table
  'artb.lysa-upp': all(rect(0, 0, 120, 120, '#3a3850', 0, null), rect(10, 92, 100, 6, WOOD, 2, C.ink, 1.6), line('M20 98 L20 116 M100 98 L100 116', C.ink, 3),
    waPulse('artb-lysa', path('M60 50 L20 92 L100 92 Z', 'rgba(255,236,150,0.6)', null), ellipse(60, 92, 40, 4, 'rgba(255,236,150,0.8)', null)), lamp(60, 48, 1.1), cup(76, 92)),
  // skugga (i en teckning): a hand shades the dark side of a drawn ball with hatching
  'artb.skugga-verb.2': all(table(100), sheet(8, 10, 92, 90), circle(46, 52, 24, 'none', C.dark, 2),
    ...range(8).map((i) => line(`M${f1(50 + i * 2.6)} ${f1(30 + i * 1.4)} L${f1(50 + i * 2.6)} ${f1(74 - i * 1.4)}`, C.grey, 1.6)), path('M24 82 C40 88 66 86 74 80', 'none', C.grey, 1.6),
    moving('artb-skugga', '0%,100%{transform:translate(0,0)}25%{transform:translate(-4px,6px)}50%{transform:translate(0,12px)}75%{transform:translate(-4px,6px)}', { dur: 1.6 }, drawHand(66, 48))),
  // egenskugga: a big ball lit from the left – its own dark side is outlined in orange
  'artb.egenskugga': all(rect(0, 0, 120, 120, '#ece6dc', 0, null), lamp(14, 40, 0.8), ball(66, 62, 36, '#d9d4cc', '#7a7470'),
    path(darkSide(66, 62, 36), 'none', HL, 3.2)),
  // slagskugga: the sun is low and a post throws a long shadow over the ground – the shadow is orange and grows
  'artb.slagskugga': all(rect(0, 0, 120, 120, '#f2eadb', 0, null), rect(0, 80, 120, 40, '#cdd9a6', 0, null), line('M0 80 L120 80', C.ink, 1.2), sun(14, 50, 7),
    rect(42, 34, 8, 60, WOOD, 1, C.ink, 1.6), ellipse(46, 94, 6, 2, '#6a5a3a', null),
    moving('artb-slag', '0%{transform:translate(-30px,0);opacity:.2}60%,100%{transform:translate(0,0);opacity:1}', { dur: 2.8 }, path('M46 92 L112 104 L112 110 L46 96 Z', 'rgba(110,90,70,0.6)', null), path('M46 92 L112 104 L112 110 L46 96 Z', 'none', HL, 2.4))),
  // högdager: a glossy cherry pair – the tiny white light spots are ringed in orange
  'artb.högdager': all(wall(), path('M60 18 C56 34 44 48 38 62 M60 18 C66 34 76 50 82 64', 'none', '#5a7a3a', 2.4), path('M60 18 C70 12 80 16 84 22 C74 24 66 22 60 18 Z', GRN, C.ink, 1.2),
    circle(38, 78, 20, '#b8202c', C.ink, 1.8), circle(82, 80, 20, '#b8202c', C.ink, 1.8), ellipse(31, 70, 4, 3, C.white, null), ellipse(75, 72, 4, 3, C.white, null), ring(31, 70, 9), ring(75, 72, 9)),
  // dunkel: a dim room – one small candle, and only faint outlines of a chair and a table in the dark
  'artb.dunkel': all(rect(0, 0, 120, 120, '#2e2c3e', 0, null), circle(60, 70, 34, 'rgba(255,220,140,0.18)', null), rect(42, 86, 36, 4, '#4a4458', 1, '#5c566c', 1.2), line('M46 90 L46 112 M74 90 L74 112', '#5c566c', 2),
    path('M14 112 L14 70 L30 70 L30 90 L14 90 M30 90 L30 112', 'none', '#57526a', 2), rect(56, 72, 8, 14, '#efe6d4', 1, null), waPulse('artb-dunkel', ellipse(60, 66, 3, 5, '#ffd36a', null)), line('M60 72 L60 69', C.ink, 1)),

  // ── 4516 Textur och yta ─────────────────────────────────────────────
  // knottrig: a close-up of an orange's peel covered in small bumps, framed; a smooth surface in grey
  'artb.knottrig': all(wall(), circle(52, 58, 40, '#f29a2e', C.ink, 2), ...range(36).map((i) => { const a = i * 2.4, r = 6 + (i % 6) * 5.6; return circle(f1(52 + Math.cos(a) * r), f1(58 + Math.sin(a) * r), 2, '#f7b65a', '#c86f17', 0.9); }),
    path('M46 18 C48 12 56 12 58 18', 'none', '#5a7a3a', 2), frame(8, 14, 88, 88), greyed(circle(106, 100, 10, '#f29a2e', C.ink, 1.4))),
  // räfflad: a drinking glass with many narrow vertical ridges, framed; a smooth glass in grey
  'artb.räfflad': all(wall(), table(100), path('M28 22 L76 22 L70 100 L34 100 Z', 'rgba(220,240,252,0.8)', C.ink, 2), ...range(9).map((i) => line(`M${f1(32 + i * 5)} 24 L${f1(36 + i * 4)} 98`, '#8fb7cf', 1.6)), ellipse(52, 22, 24, 4, 'rgba(240,250,255,0.9)', C.ink, 1.6),
    frame(20, 12, 64, 94), greyed(path('M94 70 L112 70 L110 100 L96 100 Z', 'rgba(220,240,252,0.8)', C.ink, 1.4))),
  // mönster: a folded cloth with the same flower and dot repeated over and over
  'artb.mönster.1': all(wall(), path('M10 30 L110 22 L110 96 L10 104 Z', '#f6e7c6', C.ink, 2), path('M10 104 L26 112 L114 104 L110 96 Z', '#e8d3a6', C.ink, 1.6),
    ...range(4).flatMap((r) => range(5).map((c) => { const x = 22 + c * 20, y = 38 + r * 18 - c * 1.6; return (r + c) % 2 ? circle(x, y, 2.6, C.navy, null) : all(...range(5).map((k) => circle(f1(x + Math.cos(k * 1.256) * 3.6), f1(y + Math.sin(k * 1.256) * 3.6), 2.4, '#e2574c', null)), circle(x, y, 1.8, C.yellow, null)); }))),
  // relief: a stone slab with a fish that stands out from the surface, lit from the side, a hand feeling it
  'artb.relief': all(wall(), rect(14, 16, 92, 84, '#c9c1b2', 4, C.ink, 2), rect(20, 22, 80, 72, '#d6cfc1', 2, '#a69d8c', 1.4),
    path('M30 60 C40 44 66 42 80 58 L94 48 L92 70 L80 62 C66 78 40 76 30 60 Z', '#e8e2d6', C.ink, 1.6), path('M34 62 C44 74 66 76 80 62 L92 70 L93 66', 'none', '#8c8474', 3), circle(40, 56, 2, C.ink, null), path('M52 50 C56 56 56 64 52 70 M62 50 C66 56 66 64 62 70', 'none', '#a69d8c', 1.4),
    path('M96 108 L104 84 C106 78 112 80 110 86 L106 100 L116 102 L116 120 L94 120 Z', C.skin, C.ink, 1.6)),
  // frottage: paper over a leaf; a crayon rubs back and forth and the veins of the leaf appear
  'artb.frottage': all(table(10), sheet(12, 20, 92, 88, '#fbfaf5'),
    path('M30 92 C30 60 54 38 84 34 C82 64 62 88 30 92 Z', 'rgba(70,120,70,0.35)', null), path('M30 92 C46 76 62 58 84 34 M44 80 L42 66 M52 72 L66 72 M58 62 L56 50 M66 54 L76 56 M70 46 L70 40', 'none', '#3f6f40', 1.6),
    moving('artb-frottage', '0%,100%{transform:translate(0,0)}50%{transform:translate(-16px,10px)}', { dur: 1.2 }, drawHand(78, 52, 'crayon', C.purple))),
  // patina: a copper roof gone green with age above an old copper jug, also green in patches
  'artb.patina': all(rect(0, 0, 120, 120, '#e8eef2', 0, null), path('M20 56 C20 30 40 14 60 12 C80 14 100 30 100 56 Z', '#5fb39a', C.ink, 2), path('M30 52 C32 40 40 30 50 26 M74 26 C86 32 92 42 92 52', 'none', '#3e8a73', 2),
    path('M44 40 C48 36 54 40 50 44 Z M70 44 C74 40 80 44 76 48 Z', '#b0773a', null), rect(14, 56, 92, 8, '#d9d2c4', 1, C.ink, 1.6), line('M60 12 L60 4', C.ink, 2),
    path('M44 112 C40 96 44 84 52 80 L50 72 L72 72 L70 80 C78 84 82 96 78 112 Z', '#b0773a', C.ink, 1.8), path('M46 100 C52 96 56 104 62 100 C68 96 74 104 78 100 L78 112 L44 112 Z', '#5fb39a', null), path('M78 88 C92 86 94 102 80 104', 'none', C.ink, 2.4), path('M48 84 C54 88 60 82 66 86', 'none', '#5fb39a', 3)),

  // ── 4517 Konstnärliga material ─────────────────────────────────────
  // papper: a stack of white sheets; one more sheet floats down onto the pile
  'artb.papper': all(wall(), table(98), ...range(5).map((i) => rect(22 - i, 86 - i * 3.4, 76, 10, i % 2 ? '#f4f1ea' : C.white, 1, C.ink, 1.2)),
    moving('artb-papper', '0%{transform:translate(-12px,-26px) rotate(-8deg);opacity:.2}60%,100%{transform:translate(0,0) rotate(0);opacity:1}', { dur: 2.6 }, path('M20 64 L96 60 L98 70 L22 74 Z', C.white, C.ink, 1.4))),
  // skissblock: a spiral-bound pad, open, with a small sketch of a tree
  'artb.skissblock': all(table(104), rect(22, 14, 76, 92, '#2f4a7a', 4, C.ink, 2), rect(26, 18, 68, 84, '#fbfaf5', 2, C.ink, 1.4), ...range(9).map((i) => ellipse(30 + i * 7.5, 16, 2.4, 4.6, 'none', C.silver, 2)),
    path('M60 88 L60 64 M60 70 L50 60 M60 66 L70 56', 'none', C.grey, 1.4), path('M42 56 C40 40 52 32 60 34 C72 30 84 42 78 56 C74 64 46 64 42 56 Z', 'none', C.dark, 1.4), line('M36 90 L84 90', C.grey, 1.2)),
  // krita: a box of colour crayons with paper wrappers, some lying in front
  'artb.krita': all(wall(), table(96), ...[RED, ORA, YEL, GRN, BLU, PUR].map((col, i) => all(path(`M${24 + i * 12} 40 L${28 + i * 12} 30 L${32 + i * 12} 40 Z`, col, C.ink, 1.2), rect(24 + i * 12, 40, 8, 30, col, 1, C.ink, 1.2), rect(24 + i * 12, 48, 8, 14, C.white, 0, C.ink, 1))),
    rect(16, 56, 88, 36, '#f2c14e', 3, C.ink, 2), line('M16 66 L104 66', C.ink, 1.2), g('rotate(-12 40 104)', rect(22, 100, 36, 7, RED, 2, C.ink, 1.2), rect(32, 100, 14, 7, C.white, 0, C.ink, 1), path('M22 100 L16 103.5 L22 107 Z', RED, C.ink, 1)),
    g('rotate(8 86 106)', rect(70, 102, 34, 7, BLU, 2, C.ink, 1.2), rect(80, 102, 14, 7, C.white, 0, C.ink, 1))),
  // tuschpenna: felt-tip pens with caps in a row; one uncapped pen draws a thick line
  'artb.tuschpenna': all(wall(), table(100), sheet(8, 70, 104, 28), path('M18 86 C34 76 50 92 66 82', 'none', C.purple, 3.4),
    ...[RED, GRN, BLU, ORA].map((col, i) => g(`translate(${24 + i * 18} 14)`, rect(-5, 0, 10, 14, col, 2, C.ink, 1.4), rect(-4, 14, 8, 36, C.white, 2, C.ink, 1.4), rect(-4, 26, 8, 6, col, 0, null))),
    g('translate(66 82) rotate(-50)', path('M0 0 L4 -3 L10 -3 L10 3 L4 3 Z', C.purple, C.ink, 1.2), rect(10, -4, 36, 8, C.white, 2, C.ink, 1.4), rect(24, -4, 6, 8, C.purple, 0, null))),
  // färg (målarfärg): an open tin of paint with a drip running down, a brush across the top and a small jar
  'artb.färg.2': all(wall(), table(100), path('M24 52 L24 98 C24 104 76 104 76 98 L76 52 Z', '#c9ced4', C.ink, 2), ellipse(50, 52, 26, 7, '#3f8fd0', C.ink, 2), path('M30 54 C30 64 34 66 34 58 C36 54 38 56 38 54', '#3f8fd0', C.ink, 1.2),
    path('M24 60 C40 66 60 66 76 60', 'none', C.ink, 1.2), brush(60, 50, 200, '#3f8fd0'), rect(86, 76, 20, 24, '#e2574c', 3, C.ink, 1.6), rect(84, 70, 24, 8, C.dark, 2, C.ink, 1.4)),
  // klistra in: a hand presses a cut-out picture into an open book; a glue stick stands beside it
  'artb.klistra-in.2': all(table(100), path('M8 40 L60 46 L112 40 L112 104 L60 110 L8 104 Z', C.white, C.ink, 2), line('M60 46 L60 110', C.ink, 1.4), rect(16, 54, 36, 26, '#cfe6f2', 1, C.ink, 1.2), sun(38, 64, 4),
    rect(94, 14, 14, 34, '#f2c14e', 3, C.ink, 1.6), rect(94, 8, 14, 10, '#e2574c', 3, C.ink, 1.4),
    waIn('artb-klistra', 0, -20, rect(68, 56, 36, 28, '#f6d9a8', 1, C.ink, 1.4), path('M72 80 L84 66 L92 74 L98 68 L102 80 Z', GRN, C.ink, 1), path('M78 60 L104 52 L108 64 L84 72 Z', C.skin, C.ink, 1.6), path('M104 52 L120 46 L120 62 L108 64 Z', C.green, C.ink, 1.4))),
  // collage: a picture made of torn paper scraps, a strip of newspaper, a photo and a button, glued together
  'artb.collage': all(wall(), picture(12, 12, 96, 96, all(path('M12 12 L70 12 L64 52 L12 58 Z', '#f2c14e', C.ink, 1.2), path('M60 30 L108 22 L108 70 L66 74 Z', '#8fc7e8', C.ink, 1.2),
    path('M16 62 L58 56 L62 104 L18 108 Z', '#e9e4d8', C.ink, 1.2), ...range(6).map((i) => line(`M22 ${68 + i * 6} L54 ${64 + i * 6}`, C.grey, 1.4)), rect(68, 78, 34, 26, C.white, 1, C.ink, 1.4), path('M71 101 L82 88 L90 96 L99 86 L99 101 Z', GRN, null), circle(92, 84, 3, YEL, null),
    path('M24 20 L44 26 L36 44 L20 38 Z', '#e2574c', C.ink, 1.2), circle(86, 40, 7, '#7d4fb0', C.ink, 1.4), circle(84, 38, 1.2, C.ink, null), circle(88, 38, 1.2, C.ink, null), circle(84, 42, 1.2, C.ink, null), circle(88, 42, 1.2, C.ink, null)))),
  // naturmaterial: a pine cone, a stick, a leaf, a stone and a shell laid out on a table
  'artb.naturmaterial': all(wall(), table(70), path('M20 84 C14 76 18 62 26 60 C34 62 38 76 32 84 Z', '#8a5a3a', C.ink, 1.6), path('M20 72 L32 72 M19 78 L33 78 M22 66 L30 66', 'none', '#5a3a22', 1.2),
    path('M44 104 L104 92', 'none', C.ink, 5), path('M44 104 L104 92', 'none', '#a0673d', 3), path('M84 96 L92 84', 'none', '#a0673d', 2.4),
    path('M48 80 C50 66 62 60 74 64 C70 74 62 80 48 80 Z', '#e2574c', C.ink, 1.4), path('M48 80 C56 74 64 68 74 64', 'none', C.ink, 1),
    ellipse(96, 72, 12, 7, '#9aa3ad', C.ink, 1.6), path('M10 106 C10 98 22 96 26 104 Z', '#f6e7c6', C.ink, 1.4), line('M14 104 L18 98 M18 104 L20 98 M22 104 L22 99', '#c9a07a', 1)),
};

/** T-shirt centred at (x, y) (blek). */
function tee(x: number, y: number, col: string) {
  return g(`translate(${x} ${y})`, path('M-8 -20 C-4 -16 4 -16 8 -20 L18 -15 L15 -5 L10 -7 L10 20 L-10 20 L-10 -7 L-15 -5 L-18 -15 Z', col, C.ink, 1.6), path('M-8 -20 C-4 -14 4 -14 8 -20', 'none', C.ink, 1.2));
}

/** Small cup (lysa upp). */
function cup(x: number, y: number) {
  return g(`translate(${x} ${y})`, path('M-6 -10 L6 -10 L5 0 L-5 0 Z', C.white, C.ink, 1.4), path('M6 -8 C10 -8 10 -3 5 -3', 'none', C.ink, 1.2));
}
