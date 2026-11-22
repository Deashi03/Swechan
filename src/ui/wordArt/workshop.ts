/**
 * Teknik & digital värld → Maskiner & tillverkning → Verktyg & verkstad, 4021–4027 (0.58): hand tools, power
 * tools, measuring tools, drilling and sawing, sanding and polishing, welding, protective equipment in the workshop.
 * Recurring signs: the tool or part that the word names is outlined in orange (ring or frame), wood is light
 * brown with grain lines, metal is grey-blue, and grey parts show what the word is not. Words that are easy to mix
 * up get clearly different scenes: borrmaskin (a big drill with a cord making a hole in the wall, dust) and
 * skruvdragare (a short tool with a big battery driving a screw into a plank); såg (a hand saw in a plank),
 * bågfil (a C-frame saw in a metal pipe), sticksåg (an electric saw cutting a curve) and cirkelsåg (a round
 * spinning blade cutting a straight line); förborra (a thin bit making a narrow hole, the screw waiting) and
 * försänka (a cone-shaped bit, the screw head flush); svetsare (a whole person with an apron and the helmet up)
 * and svetshjälm (only the helmet, close up); slät (a flat profile line) and ojämn (a bumpy profile line);
 * blank (a shining ball with reflections) and polera (a cloth that moves, half the plate still dull).
 * Digits only; no unit letters, no words, no brands, no logos.
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, waBob, waGrow, waIn, waPulse, waShake, waSpin, waSway, type Svg } from './kit';
import { HL, T } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const WOOD = '#e2b97f';
const WOOD2 = '#c9965a';
const STEEL = '#aab4c0';
const STEEL2 = '#7d8896';
const DARKBG = '#2f3340';
const RUBBER = '#2e2e36';
const TOOLRED = '#d64545';
const TOOLGREEN = '#4f9d69';
const HIVIS = '#d7f23a';
const f1 = (n: number) => +n.toFixed(1);
const pts = (a: [number, number][]) => a;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 5, col, 2.6);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const wall = (col = '#efe8dc') => rect(0, 0, 120, 112, col, 0, null);
const cross = (x: number, y: number, s = 6, col: string = C.red) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 3);
const check = (x: number, y: number, s = 1, col: string = C.green) => g(`translate(${x} ${y}) scale(${s})`, line('M-6 0 L-2 5 L7 -6', col, 3.4));
const bolt = (x: number, y: number, s = 1, col: string = C.yellow) => g(`translate(${x} ${y}) scale(${s})`, path('M2 -12 L-7 2 L-1 2 L-4 13 L7 -3 L1 -3 Z', col, C.ink, 1.4));
/** Plank with grain lines. */
const plank = (x: number, y: number, w: number, h: number, col: string = WOOD) => all(rect(x, y, w, h, col, 1.5, C.ink, 1.6),
  line(range(Math.max(1, Math.floor(h / 6))).map((i) => `M${x + 4} ${f1(y + 4 + i * 6)} C${f1(x + w * 0.3)} ${f1(y + 2 + i * 6)} ${f1(x + w * 0.6)} ${f1(y + 6 + i * 6)} ${x + w - 4} ${f1(y + 4 + i * 6)}`).join(' '), WOOD2, 1));
/** Bench top seen from the front at height y. */
const bench = (y = 84) => all(rect(2, y, 116, 8, WOOD2, 2, C.ink, 1.8), line(`M10 ${y + 8} L10 112 M110 ${y + 8} L110 112`, '#8a5a32', 4));
/** Sparks fanning out from (x, y). */
const sparks = (x: number, y: number, n = 7, len = 16, from = -160, to = -20, col: string = C.yellow) => all(...range(n).map((i) => {
  const a = ((from + ((to - from) * i) / Math.max(1, n - 1)) * Math.PI) / 180, l = len * (0.6 + ((i * 37) % 10) / 25);
  return line(`M${f1(x + Math.cos(a) * 3)} ${f1(y + Math.sin(a) * 3)} L${f1(x + Math.cos(a) * l)} ${f1(y + Math.sin(a) * l)}`, col, 1.8);
}));
const dust = (x: number, y: number, n = 6, col = '#d9c9a8') => all(...range(n).map((i) => circle(f1(x + Math.cos(i * 1.9) * (4 + i * 1.6)), f1(y - Math.abs(Math.sin(i * 1.3)) * (3 + i * 1.5)), 1.4 + (i % 3) * 0.5, col, null)));
/** Palm seen from the side (no pointing finger), wrist at (x, y). */
const palm = (x: number, y: number, rot = 0, sleeve: string = C.navy) => g(`translate(${x} ${y}) rotate(${rot})`, path('M0 0 L14 -2 C20 -3 26 -2 30 0 C32 2 30 5 26 5 L20 5 C22 7 21 10 18 10 L4 10 C0 10 -2 6 0 0 Z', C.skin, C.ink, 1.4), rect(-12, -1, 14, 11, sleeve, 2, C.ink, 1.4));
/** Fist around a horizontal grip, centre (x, y). */
const fist = (x: number, y: number, sleeve: string = C.navy, glove = false) => all(rect(x - 7, y - 6, 14, 12, glove ? C.orange : C.skin, 5, C.ink, 1.4), line(`M${x - 2} ${y - 6} L${x - 2} ${y + 6} M${x + 3} ${y - 6} L${x + 3} ${y + 6}`, glove ? '#b85f22' : C.skin2, 1), rect(x - 7, y + 5, 14, 9, sleeve, 2, C.ink, 1.4));
/** Standing person, feet at (x, 112); arms from the shoulders to (lx, ly) and (rx, ry) relative to the neck. */
const person = (x: number, top: string, o: { s?: number; l?: [number, number]; r?: [number, number]; hat?: string; hair?: string; y?: number; apron?: string; legs?: string } = {}) => {
  const s = o.s ?? 1, [lx, ly] = o.l ?? [-12, 22], [rx, ry] = o.r ?? [12, 22];
  return g(`translate(${x} ${o.y ?? 112}) scale(${s})`, line('M-5 0 L-4 -26 M5 0 L4 -26', o.legs ?? C.navy, 7), rect(-11, -56, 22, 32, top, 6, C.ink, 1.6),
    o.apron ? path('M-9 -46 L9 -46 L11 -10 L-11 -10 Z', o.apron, C.ink, 1.4) : '',
    line(`M-9 -52 L${lx} ${-56 + ly}`, C.ink, 6.4), line(`M-9 -52 L${lx} ${-56 + ly}`, top, 4.4), circle(lx, -56 + ly, 3.2, C.skin, C.ink, 1.2),
    line(`M9 -52 L${rx} ${-56 + ry}`, C.ink, 6.4), line(`M9 -52 L${rx} ${-56 + ry}`, top, 4.4), circle(rx, -56 + ry, 3.2, C.skin, C.ink, 1.2),
    circle(0, -67, 10, C.skin, C.ink, 1.6), o.hat ? path('M-12 -70 C-12 -84 12 -84 12 -70 L14 -69 L-14 -69 Z', o.hat, C.ink, 1.6) : path('M-10 -68 C-10 -81 10 -81 10 -68 C6 -73 -6 -73 -10 -68 Z', o.hair ?? C.hair, null),
    circle(-3.5, -66, 1.2, C.ink, null), circle(3.5, -66, 1.2, C.ink, null), path('M-3 -61 C-1 -59 1 -59 3 -61', 'none', C.ink, 1.2));
};

// ── Tools ─────────────────────────────────────────────────────────────
/** Claw hammer, handle end at (x, y), pointing up when rot = 0. */
const hammer = (x: number, y: number, rot = 0, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-3, -40, 6, 40, WOOD, 2, C.ink, 1.4),
  path('M-12 -46 L8 -46 L8 -38 L-12 -38 Z', STEEL2, C.ink, 1.4), path('M8 -46 C14 -46 18 -50 20 -54 L18 -40 C16 -40 12 -38 8 -38 Z', STEEL2, C.ink, 1.2));
/** Flat screwdriver, handle end at (x, y). */
const screwdriver = (x: number, y: number, rot = 0, s = 1, col: string = C.yellow) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-4, -18, 8, 18, col, 3, C.ink, 1.4), rect(-1.4, -38, 2.8, 20, STEEL, 1, C.ink, 1));
/** Open-end + ring spanner, centre (x, y). */
const spanner = (x: number, y: number, rot = 0, s = 1, col: string = STEEL) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-24, -3.5, 48, 7, col, 3, C.ink, 1.4),
  path('M-24 -9 A9 9 0 1 0 -24 9 A9 9 0 1 0 -24 -9 Z', col, C.ink, 1.4), path('M-28.5 -4 L-24 -6.5 L-19.5 -4 L-19.5 1 L-24 3.5 L-28.5 1 Z', '#efe8dc', C.ink, 1),
  path('M24 -10 C34 -10 36 -4 36 -4 L28 -4 L28 4 L36 4 C36 4 34 10 24 10 C20 6 20 -6 24 -10 Z', col, C.ink, 1.4));
/** Hand saw, handle at (x, y), blade towards +x. */
const handSaw = (x: number, y: number, rot = 0, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
  path('M8 -8 L60 -4 L60 6 L8 10 Z', STEEL, C.ink, 1.4), path(range(13).map((i) => `M${10 + i * 4} ${f1(10 - i * 0.3)} l2 3 l2 -3`).join(' '), 'none', C.ink, 1),
  path('M-14 -10 C-14 -16 10 -16 10 -10 L10 12 C10 16 -14 16 -14 10 Z', TOOLRED, C.ink, 1.6), path('M-8 -6 L4 -6 L4 6 L-8 6 Z', '#efe8dc', C.ink, 1.2));
/** Hex nut seen from the front. */
const nut = (x: number, y: number, r = 7, col: string = STEEL) => all(path(range(6).map((i) => { const a = (i * 60 * Math.PI) / 180; return `${i ? 'L' : 'M'}${f1(x + Math.cos(a) * r)} ${f1(y + Math.sin(a) * r)}`; }).join(' ') + ' Z', col, C.ink, 1.4), circle(x, y, r * 0.45, '#efe8dc', C.ink, 1.1));
/** Screw seen from the side: head at (x, y), length l, pointing down. */
const screwSide = (x: number, y: number, l = 26, col: string = STEEL) => all(path(`M${x - 6} ${y} L${x + 6} ${y} L${x + 2.5} ${y + 5} L${x - 2.5} ${y + 5} Z`, col, C.ink, 1.2),
  path(`M${x - 2.5} ${y + 5} L${x + 2.5} ${y + 5} L${x + 2.5} ${y + l - 4} L${x} ${y + l} L${x - 2.5} ${y + l - 4} Z`, col, C.ink, 1.2), line(range(Math.floor((l - 6) / 4)).map((i) => `M${x - 3} ${y + 7 + i * 4} L${x + 3} ${y + 9 + i * 4}`).join(' '), C.ink, 1));
/** Power drill (pistol shape), chuck tip at (x, y), facing right. body colour col. */
const drill = (x: number, y: number, s = 1, col: string = TOOLGREEN, battery = false, bitLen = 20) => g(`translate(${x} ${y}) scale(${s})`,
  rect(0, -3, bitLen, 6, STEEL, 1, C.ink, 1.2), line(range(Math.floor(bitLen / 4)).map((i) => `M${2 + i * 4} -3 L${4 + i * 4} 3`).join(' '), C.ink, 0.9),
  path('M-14 -8 L0 -6 L0 6 L-14 8 Z', C.dark, C.ink, 1.4), line('M-11 -7 L-11 7 M-7 -6.5 L-7 6.5 M-3 -6 L-3 6', '#66707e', 1),
  path('M-54 -16 L-14 -16 L-14 12 L-30 12 L-28 36 L-46 36 L-46 12 L-54 10 Z', col, C.ink, 1.8), rect(-30, 12, 5, 9, C.dark, 2, C.ink, 1.2),
  battery ? rect(-52, 34, 30, 14, C.dark, 3, C.ink, 1.6) : '', battery ? rect(-48, 38, 10, 4, C.yellow, 1, null) : '');

export const WSHOP_MOTIFS: Record<string, Svg> = {
  // ── 4021 Handverktyg ──
  'wshop.byggvaruhus': all(rect(0, 0, 120, 112, '#cfe8f5', 0, null), rect(4, 34, 112, 78, '#e9e4dc', 2, C.ink, 2), rect(4, 26, 112, 12, C.orange, 2, C.ink, 1.8),
    g('translate(60 20)', circle(0, 0, 14, C.white, C.ink, 1.8), g('rotate(-30)', hammer(0, 10, 0, 0.42)), g('rotate(35)', spanner(0, -2, 90, 0.32))),
    rect(42, 72, 36, 40, '#bfe3f5', 1, C.ink, 1.8), line('M60 72 L60 112', C.ink, 1.4), rect(10, 48, 26, 18, '#bfe3f5', 1, C.ink, 1.4), rect(84, 48, 26, 18, '#bfe3f5', 1, C.ink, 1.4),
    g('translate(96 100)', rect(-14, -10, 26, 10, C.grey, 1, C.ink, 1.4), line('M-14 -10 L-18 -16', C.ink, 1.6), circle(-10, 4, 3, C.dark, null), circle(8, 4, 3, C.dark, null), plank(-16, -18, 34, 5), plank(-14, -24, 34, 5)), ground()),
  'wshop.handverktyg': all(wall(), rect(8, 8, 104, 74, '#d8c3a0', 3, C.ink, 1.8), ...range(9).flatMap((i) => range(6).map((j) => circle(16 + i * 11, 15 + j * 12, 1.1, '#9c8460', null))),
    hammer(26, 76, 0, 0.9), screwdriver(46, 74, 0, 1, TOOLRED), spanner(80, 30, 0, 0.75), handSaw(62, 58, 0, 0.62), frame(5, 5, 110, 80),
    greyed(drill(108, 96, 0.5, C.grey), circle(86, 98, 3, C.dark, null)), cross(92, 100, 9), ground()),
  'wshop.slägga': all(wall('#eef0f2'), rect(54, 82, 52, 30, '#b7b2a8', 2, C.ink, 1.8), line('M76 82 L72 94 L80 100 L76 112 M90 82 L94 96', C.ink, 1.6),
    person(30, C.orange, { l: [26, 4], r: [22, 6] }), g('translate(56 54) rotate(-55)', rect(-3, -6, 6, 58, WOOD, 2, C.ink, 1.6), rect(-13, 48, 26, 18, C.dark, 3, C.ink, 1.8)),
    ring(96, 74, 15), line('M100 70 L108 64 M104 78 L112 78', C.ink, 1.6), greyed(hammer(110, 60, 0, 0.45)), ground()),
  'wshop.gummiklubba': all(wall(), plank(10, 78, 48, 12), plank(60, 78, 48, 12), g('translate(64 66) rotate(-30)', rect(-3, -46, 6, 44, WOOD, 2, C.ink, 1.6), rect(-14, -2, 28, 16, RUBBER, 6, C.ink, 1.8), line('M-10 2 L-10 10', '#555', 1.4)),
    ring(62, 70, 15), line('M44 66 L38 60 M44 76 L36 78 M82 66 L88 60', C.ink, 1.6), bench(92)),
  'wshop.avbitartång': all(wall(), line('M6 60 L50 60', C.silver, 3.2), line('M70 60 L114 60', C.silver, 3.2), line('M6 60 L50 60 M70 60 L114 60', C.ink, 0.8),
    g('translate(60 60)', path('M-3 -2 L-14 -12 C-10 -16 -4 -12 0 -6 Z', STEEL2, C.ink, 1.4), path('M3 -2 L14 -12 C10 -16 4 -12 0 -6 Z', STEEL2, C.ink, 1.4), circle(0, 2, 4, STEEL, C.ink, 1.4),
      path('M-3 4 C-8 20 -16 36 -20 46 L-12 48 C-8 38 -2 22 1 6 Z', TOOLRED, C.ink, 1.6), path('M3 4 C8 20 16 36 20 46 L12 48 C8 38 2 22 -1 6 Z', TOOLRED, C.ink, 1.6)),
    ring(60, 52, 12), line('M52 46 L48 40 M68 46 L72 40', C.ink, 1.4), ground()),
  'wshop.blocknyckel': all(wall('#eef0f2'), rect(16, 74, 30, 30, STEEL2, 2, C.ink, 1.6), nut(31, 64, 9), rect(29, 70, 4, 6, STEEL, 1, C.ink, 1),
    g('translate(31 64)', spanner(36, 0, 0, 1.15, STEEL)), T(72, 70, '13', 8, C.ink), frame(18, 48, 98, 32), greyed(nut(98, 96, 7), nut(84, 100, 5))),
  'wshop.fil.4': all(wall(), rect(6, 70, 66, 16, STEEL2, 2, C.ink, 1.6), g('translate(60 58) rotate(-18)', rect(-46, -5, 70, 10, '#8f98a4', 2, C.ink, 1.6),
    line(range(16).map((i) => `M${-44 + i * 4.2} -5 L${-41 + i * 4.2} 5`).join(' '), C.ink, 0.8), line(range(16).map((i) => `M${-41 + i * 4.2} -5 L${-44 + i * 4.2} 5`).join(' '), C.ink, 0.6),
    rect(24, -6, 30, 12, WOOD, 5, C.ink, 1.6)), ring(44, 64, 28), ...range(6).map((i) => circle(30 + i * 5, 92 + (i % 2) * 6, 1.2, STEEL2, null)), ground()),
  'wshop.hyvel': all(wall(), plank(6, 78, 108, 16), g('translate(62 66)', path('M-34 12 L30 12 L30 0 L-26 0 Z', '#8a5a32', C.ink, 1.8), path('M-30 0 C-30 -14 -18 -16 -14 -8 L-12 0 Z', WOOD, C.ink, 1.6),
    path('M12 0 C14 -12 24 -16 30 -10 L28 0 Z', WOOD, C.ink, 1.6), path('M-6 0 L-2 -14 L6 -14 L4 0 Z', STEEL2, C.ink, 1.4)),
    path('M60 64 C58 46 76 40 82 50 C86 58 76 62 72 56 C70 52 74 50 76 52', 'none', WOOD2, 3.4), ring(56, 68, 34), ground()),
  'wshop.stämjärn': all(wall(), plank(6, 76, 108, 20), rect(30, 76, 26, 6, '#a97a45', 0, C.ink, 1.2),
    g('translate(64 72) rotate(35)', path('M-5 0 L5 0 L4 -26 L-4 -26 Z', STEEL, C.ink, 1.4), line('M-5 0 L5 0', C.white, 1.4), rect(-6, -54, 12, 28, WOOD2, 4, C.ink, 1.6), rect(-6.5, -30, 13, 5, C.dark, 1, null)),
    ...pts([[36, 70], [42, 66], [50, 70]]).map(([x, y]) => path(`M${x} ${y} l4 -2 l1 3 Z`, WOOD2, C.ink, 0.8)), ring(64, 66, 13), ground()),
  'wshop.kofot': all(wall(), plank(10, 80, 100, 14), rect(62, 66, 40, 10, WOOD, 1, C.ink, 1.6),
    waSway('wkof', 5, g('translate(62 74) rotate(-28)', path('M0 0 L-56 0', 'none', C.ink, 9), path('M0 0 L-56 0', 'none', TOOLRED, 6), path('M0 0 C8 0 10 4 8 10', 'none', C.ink, 9), path('M0 0 C8 0 10 4 8 10', 'none', TOOLRED, 6), path('M-56 0 L-62 -4', 'none', TOOLRED, 6))),
    arrow(20, 44, 20, 28, HL, 2.8), arrow(84, 60, 92, 48, HL, 2.8), ground()),
  'wshop.mattkniv': all(wall(), rect(4, 74, 112, 16, '#c9b089', 1, C.ink, 1.6), line('M10 82 L64 82', C.ink, 1.2, '3 2'),
    g('translate(64 80) rotate(-18)', path('M0 0 L10 -4 L10 2 Z', STEEL, C.ink, 1), line('M3 -1 L4 -3 M6 -2 L7 -4', C.ink, 0.6), path('M10 -8 L56 -8 C60 -8 62 -4 62 0 L62 4 L10 4 Z', C.yellow, C.ink, 1.8), rect(22, -11, 10, 4, C.dark, 1, C.ink, 1)),
    ring(66, 79, 9), ground()),
  'wshop.skruvstycke': all(wall('#eef0f2'), bench(84), rect(30, 72, 60, 12, '#3f6fb5', 2, C.ink, 1.8), rect(30, 44, 14, 30, '#3f6fb5', 2, C.ink, 1.8), rect(74, 44, 14, 30, '#3f6fb5', 2, C.ink, 1.8),
    rect(44, 48, 30, 10, STEEL, 4, C.ink, 1.6), line('M88 60 L112 60', STEEL2, 4), rect(108, 50, 4, 20, STEEL2, 1, C.ink, 1), line(range(5).map((i) => `M${46 + i * 6} 44 L${46 + i * 6} 48`).join(' '), C.ink, 1),
    arrow(20, 58, 30, 58, HL, 2.6), arrow(100, 40, 90, 40, HL, 2.6), frame(26, 40, 66, 46), ground()),
  'wshop.handtag': all(wall('#f2ede4'), rect(14, 10, 56, 102, '#c99a68', 2, C.ink, 1.8), rect(22, 18, 40, 38, '#d6ab7b', 2, C.ink, 1.2), rect(22, 62, 40, 42, '#d6ab7b', 2, C.ink, 1.2),
    circle(60, 62, 3.4, STEEL, C.ink, 1.4), path('M60 59 L78 59 C80 59 80 65 78 65 L60 65 Z', STEEL, C.ink, 1.6), ring(70, 62, 13), palm(84, 66, 180, C.green),
    g('translate(96 102) rotate(-90)', hammer(0, 0, 0, 0.6)), ring(98, 92, 10), ground()),

  // ── 4022 Elverktyg ──
  'wshop.elverktyg': all(wall('#eef0f2'), drill(54, 40, 0.7, TOOLGREEN), g('translate(80 70)', rect(-16, -8, 32, 16, C.orange, 4, C.ink, 1.6), circle(-22, 0, 9, STEEL, C.ink, 1.4), rect(16, -4, 14, 8, C.dark, 2, C.ink, 1.2)),
    line('M30 66 C30 84 50 96 70 98 L82 98', C.dark, 2), rect(82, 92, 14, 12, C.white, 2, C.ink, 1.4), line('M85 96 L85 100 M93 96 L93 100', C.ink, 1.6), bolt(104, 30, 0.9), frame(4, 14, 112, 72),
    greyed(hammer(18, 108, -70, 0.45)), cross(18, 100, 7), ground()),
  'wshop.borrmaskin': all(wall('#e8e1d6'), rect(92, 0, 28, 112, '#cfc6b8', 0, C.ink, 1.8), circle(92, 52, 3, C.dark, null),
    waIn('wbor', -10, 0, drill(90, 52, 1, TOOLGREEN, false, 18)), moving('wbord', '0%,100%{opacity:1}50%{opacity:.3}', { dur: 0.8 }, dust(94, 64, 7, '#bfb3a0')),
    line('M44 88 C44 104 70 106 80 108 L104 108', C.dark, 2.2), rect(104, 100, 10, 12, C.white, 2, C.ink, 1.2), ring(64, 52, 30), ground()),
  'wshop.skruvdragare': all(wall(), plank(8, 84, 104, 14), screwSide(88, 72, 18), drill(88, 62, 0.75, C.orange, true, 8), rect(84, 60, 8, 4, STEEL, 1, C.ink, 1),
    ring(56, 96, 14), path('M98 54 A10 10 0 1 1 98 70', 'none', HL, 2.4), arrow(98, 70, 94, 72, HL, 2.4), ground()),
  'wshop.chuck': all(wall('#eef0f2'), path('M4 34 L40 34 L40 86 L4 86 Z', TOOLGREEN, C.ink, 1.8), path('M40 40 L74 46 L74 74 L40 80 Z', C.dark, C.ink, 1.8),
    line(range(6).map((i) => `M${46 + i * 5} ${f1(41 + i * 1)} L${46 + i * 5} ${f1(79 - i * 1)}`).join(' '), '#66707e', 1.4), rect(74, 54, 6, 12, STEEL2, 1, C.ink, 1.2),
    rect(80, 56, 36, 8, STEEL, 1, C.ink, 1.2), line(range(9).map((i) => `M${82 + i * 4} 56 L${84 + i * 4} 64`).join(' '), C.ink, 0.9), frame(38, 36, 44, 48),
    path('M50 24 A22 10 0 0 1 72 26', 'none', HL, 2.4), arrow(70, 25, 74, 30, HL, 2.4)),
  'wshop.bits': all(wall(), rect(10, 70, 100, 28, '#3d4a6a', 4, C.ink, 1.8), ...range(8).map((i) => all(rect(16 + i * 12, 60, 6, 24, STEEL, 1, C.ink, 1.1), path(`M${16 + i * 12} 60 L${19 + i * 12} 54 L${22 + i * 12} 60 Z`, STEEL2, C.ink, 1))),
    g('translate(60 32)', path('M-6 16 L-6 -2 L-2 -12 L2 -12 L6 -2 L6 16 Z', STEEL, C.ink, 1.6), line('M-6 4 L6 4 M-6 10 L6 10', STEEL2, 1.2), line('M-4 -8 L4 -8 M0 -12 L0 -4', C.ink, 1.6)), ring(60, 30, 20), line('M52 50 L40 58', HL, 2), ground()),
  'wshop.förlängningssladd': all(wall('#e9e6df'), rect(4, 30, 10, 14, C.white, 2, C.ink, 1.4), circle(9, 37, 1.2, C.ink, null),
    path('M14 37 C40 37 30 96 50 96 L60 96', 'none', C.orange, 3), g('translate(70 88)', circle(0, 0, 18, C.orange, C.ink, 1.8), circle(0, 0, 6, C.dark, C.ink, 1.4), line('M0 -18 L0 18 M-18 0 L18 0', '#c86b26', 1), rect(-18, 18, 36, 6, C.dark, 2, C.ink, 1.2)),
    path('M88 88 C100 88 104 70 104 56', 'none', C.orange, 3), rect(98, 44, 14, 12, C.white, 2, C.ink, 1.4), line('M44 20 L100 20', HL, 2.4, '5 4'), arrow(96, 20, 104, 20, HL, 2.4), ground()),
  'wshop.avtryckare': all(wall('#eef0f2'), g('translate(8 0) scale(1.4)', path('M8 18 L60 18 L60 46 L40 46 L42 76 L18 76 L18 46 L8 44 Z', TOOLGREEN, C.ink, 1.4), path('M60 22 L74 24 L74 40 L60 42 Z', C.dark, C.ink, 1.2), rect(74, 30, 10, 4, STEEL, 1, C.ink, 1)),
    moving('wtrig', '0%,30%{transform:translateX(0)}50%,80%{transform:translateX(-4px)}100%{transform:translateX(0)}', { dur: 2.2 }, rect(62, 66, 8, 16, C.dark, 3, C.ink, 1.4)), ring(66, 74, 13),
    fist(44, 92, C.navy), waPulse('wtrigs', line('M112 66 l6 -2 M112 74 l7 0 M112 82 l6 2', C.ink, 1.6))),

  // ── 4023 Mätverktyg ──
  'wshop.mätverktyg': all(wall(), rect(6, 26, 108, 76, '#3d4a6a', 4, C.ink, 1.8), rect(10, 30, 100, 68, '#5a6a8e', 2, null),
    g('translate(14 36)', rect(0, 0, 60, 10, C.yellow, 1, C.ink, 1.4), line(range(12).map((i) => `M${4 + i * 5} 0 L${4 + i * 5} ${i % 2 ? 3 : 5}`).join(' '), C.ink, 1)),
    g('translate(14 54)', rect(0, 0, 70, 12, C.green, 2, C.ink, 1.4), rect(28, 2, 14, 8, '#e6f7a0', 2, C.ink, 1), circle(35, 6, 2, C.white, null)),
    g('translate(90 48)', circle(0, 0, 13, C.yellow, C.ink, 1.6), circle(0, 0, 4, C.dark, null), rect(-2, 12, 16, 4, '#f6e6a0', 1, C.ink, 1)),
    g('translate(16 76)', rect(0, 0, 64, 6, STEEL, 1, C.ink, 1.2), path('M4 6 L4 18 L10 18 L10 6 Z M16 6 L16 16 L22 16 L22 6 Z', STEEL, C.ink, 1.2), rect(20, -6, 18, 12, '#dfe9d8', 2, C.ink, 1.2)), frame(3, 23, 114, 82)),
  'wshop.tumstock': all(wall(), path('M8 92 L58 92 L58 82 L8 82 Z', C.yellow, C.ink, 1.6), g('translate(58 87) rotate(-40)', path('M0 -5 L50 -5 L50 5 L0 5 Z', C.yellow, C.ink, 1.6),
    line(range(10).map((i) => `M${4 + i * 5} -5 L${4 + i * 5} ${i % 2 ? -2 : 0}`).join(' '), C.ink, 1), circle(0, 0, 2, STEEL2, null)),
    line(range(10).map((i) => `M${12 + i * 5} 82 L${12 + i * 5} ${i % 2 ? 85 : 87}`).join(' '), C.ink, 1), T(20, 78, '10', 7), T(45, 78, '20', 7), circle(58, 87, 2.4, STEEL2, C.ink, 1), ring(52, 74, 40), ground()),
  'wshop.vattenpass': all(wall(), rect(8, 70, 104, 8, WOOD2, 1, C.ink, 1.6), line('M14 78 L14 90 M106 78 L106 90', C.dark, 3),
    rect(16, 54, 88, 16, TOOLGREEN, 3, C.ink, 1.8), rect(46, 57, 28, 10, '#e6f7a0', 4, C.ink, 1.4), line('M54 57 L54 67 M66 57 L66 67', C.ink, 1.2), ellipse(60, 62, 4.5, 3, C.white, C.ink, 0.8),
    ring(60, 62, 18), line('M4 40 L116 40', C.grey, 1.4, '4 4'), check(100, 30), ground()),
  'wshop.lasermätare': all(rect(0, 0, 120, 112, '#e9e4dc', 0, null), rect(104, 0, 16, 112, '#cfc6b8', 0, C.ink, 1.8), rect(10, 80, 26, 16, C.dark, 3, C.ink, 1.8), rect(14, 83, 14, 8, '#dfe9d8', 1, null), T(21, 90, '3', 7),
    line('M36 86 L104 86', TOOLRED, 1.6), waPulse('wlas', circle(104, 86, 3.6, TOOLRED, null), circle(104, 86, 7, 'rgba(214,69,69,0.3)', null)), ring(23, 88, 18),
    line('M36 100 L104 100', HL, 2.2), arrow(70, 100, 102, 100, HL, 2.2), arrow(70, 100, 38, 100, HL, 2.2), ground()),
  'wshop.kontrollmäta': all(wall(), plank(10, 74, 100, 14), line('M10 70 L10 64 M90 70 L90 64', C.ink, 1.6), line('M90 70 L90 92', C.ink, 1.4, '3 2'),
    line('M12 58 L88 58', C.ink, 1.8), arrow(50, 58, 88, 58, C.ink, 1.8), arrow(50, 58, 12, 58, C.ink, 1.8), T(50, 54, '80', 9),
    moving('wkon', '0%,35%{opacity:0;transform:translateY(-6px)}55%,100%{opacity:1;transform:translateY(0)}', { dur: 3.2 }, line('M12 42 L88 42', HL, 2.2), arrow(50, 42, 88, 42, HL, 2.2), arrow(50, 42, 12, 42, HL, 2.2), T(50, 38, '80', 9, HL)),
    moving('wkonc', '0%,60%{opacity:0}75%,100%{opacity:1}', { dur: 3.2 }, check(104, 46, 1.2)), T(104, 66, '2', 9, HL), ground()),
  'wshop.snickarpenna': all(wall(), plank(6, 76, 108, 18), line('M14 82 L70 82', C.dark, 1.6),
    g('translate(70 82) rotate(-35)', path('M0 0 L8 -4 L8 4 Z', '#e7c79a', C.ink, 1), rect(8, -4, 48, 8, TOOLRED, 1, C.ink, 1.6), line('M0 0 L3 0', C.dark, 2)),
    g('translate(28 34)', rect(-12, -6, 24, 12, TOOLRED, 1, C.ink, 1.6), rect(-5, -1.5, 10, 3, C.dark, 0, null)), ring(28, 34, 18), line('M42 42 L66 66', HL, 2, '3 3'), ground()),
  'wshop.noggrann': all(wall('#f5f1ea'), rect(10, 64, 100, 12, C.white, 1, C.ink, 1.6), line(range(20).map((i) => `M${14 + i * 5} 64 L${14 + i * 5} ${i % 5 === 0 ? 72 : 68}`).join(' '), C.ink, 1),
    line('M64 50 L64 80', TOOLGREEN, 2.4), circle(64, 58, 16, 'rgba(220,240,255,0.5)', C.ink, 2.4), line('M75 69 L90 84', C.dark, 5), check(92, 30, 1.2),
    greyed(line('M24 92 C30 88 34 98 40 92 C46 86 50 98 56 94', C.ink, 2), cross(40, 104, 6)), ground()),

  // ── 4024 Borrning och sågning ──
  'wshop.såg': all(wall(), plank(4, 70, 112, 16), rect(62, 70, 3, 16, '#efe8dc', 0, null), g('translate(110 30) scale(-1 1) rotate(38)', handSaw(0, 0, 0, 0.9)), dust(60, 96, 6), ring(66, 64, 24), bench(86)),
  'wshop.bågfil': all(wall('#eef0f2'), rect(4, 74, 112, 12, STEEL, 6, C.ink, 1.8), line('M8 77 L112 77', C.white, 1.4),
    g('translate(64 60)', path('M-34 10 L-34 -14 L34 -14 L34 10', 'none', '#3f6fb5', 5), path('M-34 10 L34 10', 'none', C.ink, 1.6), line(range(17).map((i) => `M${-32 + i * 4} 10 l2 2`).join(' '), C.ink, 0.8),
      path('M-34 -14 L-44 -2 L-48 10 L-38 14 L-34 10 Z', TOOLRED, C.ink, 1.6)), ring(64, 68, 40), ...range(4).map((i) => circle(58 + i * 4, 92 + (i % 2) * 3, 1.1, STEEL2, null)), ground()),
  'wshop.sticksåg': all(wall(), plank(6, 74, 108, 18), line('M14 74 C14 60 36 54 46 64 C56 54 78 60 78 74', C.ink, 1.4, '3 2'), path('M14 74 C14 64 30 60 40 66', 'none', C.ink, 2),
    g('translate(74 74)', path('M-20 -10 L20 -10 C24 -10 24 -30 18 -36 L-10 -36 C-18 -30 -22 -18 -20 -10 Z', '#3f6fb5', C.ink, 1.8), path('M-4 -36 C-4 -46 14 -46 14 -36', 'none', C.ink, 2.4),
      rect(-22, -10, 44, 4, STEEL2, 1, C.ink, 1.2), waBob('wsti', 4, rect(-14, -6, 4, 14, STEEL, 0, C.ink, 1))), ring(62, 72, 14), ground()),
  'wshop.cirkelsåg': all(wall(), plank(4, 78, 112, 14), line('M4 82 L56 82', C.ink, 1.4, '4 3'), line('M56 82 L112 82', '#efe8dc', 2),
    g('translate(58 66)', waSpin('wcir', 0.6, circle(0, 0, 18, STEEL, C.ink, 1.6), ...range(16).map((i) => g(`rotate(${i * 22.5})`, path('M-2 -18 L2 -18 L0 -22 Z', STEEL2, C.ink, 0.8))), circle(0, 0, 3, C.dark, null)),
      path('M-24 -6 C-24 -26 24 -26 28 -6 L28 4 L-24 4 Z', 'rgba(239,138,60,0.85)', C.ink, 1.8), rect(4, -36, 34, 12, C.orange, 4, C.ink, 1.6)), ring(58, 70, 28), dust(26, 76, 5), ground()),
  'wshop.sågblad': all(wall('#eef0f2'), g('translate(36 52)', circle(0, 0, 26, STEEL, C.ink, 1.6), ...range(24).map((i) => g(`rotate(${i * 15})`, path('M-3 -26 L3 -26 L0 -32 Z', STEEL2, C.ink, 0.8))), circle(0, 0, 5, '#eef0f2', C.ink, 1.4)),
    g('translate(72 86)', path('M0 0 L44 0 L44 10 L0 10 Z', STEEL, C.ink, 1.4), line(range(11).map((i) => `M${i * 4} 0 l2 -4 l2 4`).join(' '), C.ink, 1.1), circle(4, 5, 1.6, '#eef0f2', C.ink, 0.8)), ring(36, 52, 36), ring(94, 88, 16)),
  'wshop.tving': all(wall(), bench(84), plank(20, 74, 70, 10), path('M60 30 L60 100 L56 100 L56 30 Z', STEEL2, C.ink, 1.4), rect(56, 26, 22, 8, STEEL2, 2, C.ink, 1.4), rect(56, 94, 22, 8, STEEL2, 2, C.ink, 1.4),
    rect(70, 34, 4, 38, STEEL, 1, C.ink, 1.2), rect(64, 66, 16, 6, STEEL, 2, C.ink, 1.2), rect(66, 34, 12, 14, TOOLRED, 3, C.ink, 1.6), arrow(90, 46, 90, 64, HL, 2.6), frame(50, 22, 34, 84)),
  'wshop.kapa': all(wall(), bench(90), plank(4, 76, 76, 14), line('M80 70 L80 96', HL, 2, '3 2'),
    moving('wkap', '0%,30%{transform:translate(0,0) rotate(0)}70%,100%{transform:translate(4px,10px) rotate(14deg)}', { dur: 3, spin: true }, plank(81, 76, 34, 14)),
    handSaw(98, 54, 70, 0.55), T(42, 66, '80', 9), arrow(24, 70, 4, 70, C.ink, 1.6), arrow(60, 70, 78, 70, C.ink, 1.6)),
  'wshop.försänka.2': all(wall('#f5f1ea'), rect(6, 70, 108, 30, WOOD, 1, C.ink, 1.6), line('M10 80 C40 78 70 82 110 80 M10 92 C40 90 70 94 110 92', WOOD2, 1),
    path('M24 70 L36 70 L32 76 L32 100 L28 100 L28 76 Z', '#efe8dc', C.ink, 1.2), moving('wfors', '0%{transform:translateY(-12px)}60%,100%{transform:translateY(0)}', { dur: 2.6 }, path('M24 70 L36 70 L30 78 Z', STEEL2, C.ink, 1.2), rect(28, 40, 4, 30, STEEL, 1, C.ink, 1)),
    path('M78 70 L90 70 L86 76 L86 100 L82 100 L82 76 Z', '#efe8dc', C.ink, 1.2), path('M78 70 L90 70 L86 76 L82 76 Z', STEEL, C.ink, 1.2), rect(82, 76, 4, 24, STEEL, 0, C.ink, 1), line('M80 70 L88 70', C.ink, 2),
    line('M66 70 L102 70', C.green, 1.6, '3 2'), ring(84, 72, 12), arrow(44, 58, 70, 64, HL, 2.4)),
  'wshop.förborra': all(wall(), plank(6, 74, 108, 22), path('M34 74 L38 74 L38 92 L34 92 Z', '#8a5a32', null),
    moving('wforb', '0%{transform:translateY(-14px)}60%,100%{transform:translateY(0)}', { dur: 2.6 }, rect(34.5, 44, 3, 40, STEEL, 0.5, C.ink, 1), rect(32, 30, 8, 14, C.dark, 2, C.ink, 1.2)), T(36, 22, '1', 10, HL),
    greyed(screwSide(84, 38, 30)), path('M82 74 L86 74 L86 92 L82 92 Z', '#8a5a32', null), T(84, 22, '2', 10), arrow(52, 50, 70, 50, HL, 2.4), ring(36, 82, 10), ground()),
  'wshop.arbetsbänk': all(wall('#ebe5da'), greyed(hammer(24, 46, 0, 0.6), screwdriver(40, 46, 0, 0.8), spanner(80, 30, 0, 0.6)),
    rect(4, 60, 112, 12, WOOD, 2, C.ink, 2), line('M8 64 C40 62 80 66 112 64', WOOD2, 1), rect(10, 72, 8, 40, '#8a5a32', 1, C.ink, 1.6), rect(102, 72, 8, 40, '#8a5a32', 1, C.ink, 1.6),
    rect(18, 92, 84, 6, WOOD2, 1, C.ink, 1.4), frame(2, 56, 116, 56), ground()),
  'wshop.sågbock': all(wall(), plank(6, 50, 108, 10), ...[30, 90].map((x) => all(rect(x - 14, 60, 28, 6, WOOD2, 1, C.ink, 1.4), line(`M${x - 10} 66 L${x - 18} 112 M${x + 10} 66 L${x + 18} 112`, '#8a5a32', 4), line(`M${x - 14} 92 L${x + 14} 92`, '#8a5a32', 2.4))), frame(10, 56, 40, 58), ground()),
  'wshop.borr.2': all(wall('#eef0f2'), rect(10, 88, 100, 16, C.dark, 3, C.ink, 1.8), ...[3, 4, 5, 6, 8, 10].map((w, i) => all(rect(20 + i * 15 - w / 2, 88 - (30 + i * 6), w, 30 + i * 6, STEEL, 1, C.ink, 1.1),
    line(range(Math.floor((30 + i * 6) / 5)).map((j) => `M${20 + i * 15 - w / 2} ${88 - (30 + i * 6) + 4 + j * 5} L${20 + i * 15 + w / 2} ${88 - (30 + i * 6) + 7 + j * 5}`).join(' '), C.ink, 0.8), path(`M${20 + i * 15 - w / 2} ${88 - (30 + i * 6)} L${20 + i * 15} ${88 - (34 + i * 6)} L${20 + i * 15 + w / 2} ${88 - (30 + i * 6)} Z`, STEEL2, C.ink, 1))),
    ring(95, 58, 24), ground()),

  // ── 4025 Slipning och polering ──
  'wshop.sandpapper': all(wall(), g('translate(18 22) rotate(-6)', rect(0, 0, 50, 64, '#c98b4a', 1, C.ink, 1.6), ...range(40).map((i) => circle(4 + ((i * 17) % 44), 4 + ((i * 29) % 58), 1.4, '#7a4a20', null)), path('M38 64 L50 52 L50 64 Z', '#f3e3c3', C.ink, 1.2)),
    g('translate(62 30) rotate(5)', rect(0, 0, 46, 60, '#9c5c3a', 1, C.ink, 1.6), ...range(90).map((i) => circle(3 + ((i * 13) % 41), 3 + ((i * 23) % 55), 0.7, '#5a2a10', null))), T(40, 104, '80', 9), T(86, 104, '240', 9), frame(10, 14, 104, 82)),
  'wshop.slipkloss': all(wall(), plank(6, 82, 108, 14), g('translate(56 68)', rect(-20, 0, 40, 14, '#c98b4a', 2, C.ink, 1.6), rect(-18, -10, 36, 12, '#c7a46e', 2, C.ink, 1.6)), palm(30, 54, 10, C.green),
    ring(56, 70, 24), arrow(14, 104, 40, 104, HL, 2.4), arrow(98, 104, 72, 104, HL, 2.4), dust(84, 80, 4), ground()),
  'wshop.slipmaskin': all(wall(), plank(6, 84, 108, 14), waShake('wslm', g('translate(58 70)', rect(-24, 6, 48, 8, '#c98b4a', 1, C.ink, 1.6), rect(-22, -10, 44, 16, '#3f6fb5', 4, C.ink, 1.8), path('M-12 -10 C-12 -26 14 -26 14 -10', 'none', C.ink, 6), path('M-12 -10 C-12 -26 14 -26 14 -10', 'none', C.dark, 4))),
    moving('wslmd', '0%,100%{opacity:1}50%{opacity:.3}', { dur: 0.8 }, dust(90, 82, 6), dust(28, 82, 5)), ring(58, 72, 30), ground()),
  'wshop.vinkelslip': all(rect(0, 0, 120, 112, '#e9e6df', 0, null), rect(4, 82, 112, 10, STEEL2, 1, C.ink, 1.6),
    g('translate(40 66)', rect(0, -8, 60, 16, C.orange, 6, C.ink, 1.8), rect(48, -14, 8, 6, C.dark, 2, C.ink, 1.2), rect(-6, -12, 10, 22, C.dark, 2, C.ink, 1.4), ellipse(-2, 14, 18, 4, STEEL, C.ink, 1.4), path('M-20 14 A18 4 0 0 0 16 14 L16 6 L-20 6 Z', C.grey, C.ink, 1.4)),
    sparks(30, 82, 6, 18, -170, -120, C.yellow), frame(16, 48, 90, 36), ground()),
  'wshop.gnista.3': all(rect(0, 0, 120, 112, DARKBG, 0, null), greyed(circle(20, 92, 16, STEEL, C.ink, 1.4), rect(0, 104, 40, 8, STEEL2, 0, null)),
    waPulse('wgni', sparks(32, 84, 11, 70, -80, -10, '#ffd36b'), sparks(32, 84, 7, 40, -70, -20, C.orange)), circle(86, 36, 4, '#fff1b0', null), ring(86, 36, 10), ground()),
  'wshop.stålull': all(wall(), rect(6, 74, 108, 22, '#b06a3a', 2, C.ink, 1.6), ...range(10).map((i) => circle(12 + i * 10, 80 + (i % 3) * 5, 2, '#7a3a14', null)), rect(60, 74, 54, 22, STEEL, 2, C.ink, 1.6), line('M64 80 L110 80', C.white, 1.4),
    g('translate(60 60)', ellipse(0, 0, 22, 14, '#bcc3cb', C.ink, 1.6), path('M-18 0 C-12 -10 -4 8 4 -6 C10 -14 16 6 20 -2 M-16 6 C-8 -2 0 10 8 2 C12 -4 18 8 14 6 M-12 -6 C-6 -12 2 -2 10 -10', 'none', '#7d8896', 1)), ring(60, 60, 26), ground()),
  'wshop.polera': all(wall(), rect(6, 48, 108, 52, '#7d8896', 4, C.ink, 1.8), rect(60, 50, 52, 48, '#c9e3f5', 2, null), line('M66 58 L80 58 M64 66 L100 66', C.white, 2.4),
    ...pts([[98, 82], [76, 90]]).map(([x, y]) => path(`M${x} ${y - 5} L${x + 1.4} ${y - 1.4} L${x + 5} ${y} L${x + 1.4} ${y + 1.4} L${x} ${y + 5} L${x - 1.4} ${y + 1.4} L${x - 5} ${y} L${x - 1.4} ${y - 1.4} Z`, C.white, null)),
    moving('wpol', '0%,100%{transform:translate(0,0)}25%{transform:translate(6px,-5px)}50%{transform:translate(12px,0)}75%{transform:translate(6px,5px)}', { dur: 1.6 }, path('M40 64 C46 56 62 58 64 66 C66 76 52 84 42 80 C34 78 34 70 40 64 Z', C.yellow, C.ink, 1.6), palm(24, 66, 0, C.green)), ground()),
  'wshop.polermedel': all(wall(), g('translate(36 64) rotate(-20)', rect(-12, -34, 24, 52, C.white, 4, C.ink, 1.8), rect(-8, -42, 16, 8, C.red, 2, C.ink, 1.4), rect(-12, -14, 24, 14, '#3f6fb5', 1, C.ink, 1.2), path('M-6 -8 L0 -12 L6 -8 L0 -4 Z', C.white, null)),
    rect(56, 82, 56, 12, C.yellow, 4, C.ink, 1.6), path('M74 82 C72 72 86 70 88 78 C90 82 84 84 80 82 Z', '#f5f0e6', C.ink, 1.4), ring(81, 78, 12),
    path('M100 60 L102 66 L108 68 L102 70 L100 76 L98 70 L92 68 L98 66 Z', C.gold, C.ink, 1), ground()),
  'wshop.lackera': all(wall(), plank(6, 74, 108, 18, '#e6c48e'), rect(6, 74, 58, 18, 'rgba(160,90,40,0.55)', 1.5, null), line('M10 77 L60 77', 'rgba(255,255,255,0.7)', 2),
    moving('wlac', '0%{transform:translateX(-40px)}100%{transform:translateX(0)}', { dur: 2.8 }, g('translate(64 72) rotate(-30)', rect(-6, -6, 12, 10, '#a05a28', 1, C.ink, 1.4), rect(-5, -14, 10, 8, STEEL, 1, C.ink, 1.2), rect(-3, -44, 6, 30, WOOD2, 2, C.ink, 1.4))),
    g('translate(100 40)', path('M-12 -10 L12 -10 L10 14 L-10 14 Z', '#a05a28', C.ink, 1.6), ellipse(0, -10, 12, 3, '#7a3e18', C.ink, 1.2)), ring(64, 82, 12), ground()),
  'wshop.blank': all(wall('#f5f1ea'), greyed(circle(28, 70, 20, '#b9b2a6', C.ink, 1.6)), circle(80, 62, 28, '#c9d6e3', C.ink, 2), path('M64 52 C66 42 76 38 84 38', 'none', C.white, 5), ellipse(92, 72, 6, 3, C.white, null),
    rect(66, 56, 10, 10, 'rgba(255,255,255,0.7)', 1, null), ...pts([[104, 40], [58, 84], [100, 92]]).map(([x, y]) => path(`M${x} ${y - 6} L${x + 1.6} ${y - 1.6} L${x + 6} ${y} L${x + 1.6} ${y + 1.6} L${x} ${y + 6} L${x - 1.6} ${y + 1.6} L${x - 6} ${y} L${x - 1.6} ${y - 1.6} Z`, C.gold, C.ink, 0.8)),
    ring(80, 62, 34), ground(96)),
  'wshop.slät': all(wall('#f5f1ea'), rect(10, 56, 100, 16, WOOD, 1, null), line('M10 56 L110 56', HL, 3.2), palm(36, 44, 0, C.green), arrow(70, 40, 100, 40, HL, 2.4),
    greyed(path('M10 96 L14 92 L20 98 L26 90 L32 97 L38 91 L44 98 L50 92 L56 96 L62 90 L68 98 L74 92 L80 97 L86 90 L92 98 L98 92 L104 97 L110 92 L110 106 L10 106 Z', '#c9b089', C.ink, 1.4))),
  'wshop.ojämn': all(wall('#f5f1ea'), path('M6 70 C16 54 24 76 34 62 C42 50 50 74 60 60 C68 50 78 76 88 62 C96 52 104 70 114 64 L114 84 L6 84 Z', WOOD, null),
    line('M6 70 C16 54 24 76 34 62 C42 50 50 74 60 60 C68 50 78 76 88 62 C96 52 104 70 114 64', HL, 3.2), g('translate(60 56) rotate(-8)', rect(-14, -18, 28, 4, '#7d8896', 1, C.ink, 1.4), line('M-11 -14 L-12 0 M11 -14 L12 4', C.ink, 2.4)),
    waShake('wojm', line('M44 34 l-6 -3 M76 34 l6 -3', C.ink, 1.4)), greyed(rect(10, 98, 100, 8, '#c9b089', 1, C.ink, 1.2))),

  // ── 4026 Svetsning ──
  'wshop.svetsare': all(wall('#e2ddd4'), person(56, C.navy, { apron: '#8a5a32', l: [-16, 30], r: [18, 22], legs: C.dark }),
    g('translate(56 45)', path('M-12 -4 C-12 -16 12 -16 12 -4 L12 -2 L-12 -2 Z', C.dark, C.ink, 1.6), rect(-6, -10, 12, 5, '#2b4a3c', 1, null)),
    g('translate(74 78) rotate(-30)', rect(-3, -4, 6, 18, C.dark, 2, C.ink, 1.2), rect(-2, -14, 4, 10, STEEL, 1, C.ink, 1)), line('M74 86 C80 100 92 104 102 106', C.dark, 2),
    fist(39, 86, C.navy, true), frame(30, 22, 52, 92), ground()),
  'wshop.svetsaggregat': all(wall('#e2ddd4'), rect(24, 40, 56, 58, '#3f6fb5', 4, C.ink, 2), rect(30, 46, 44, 20, '#cfd8e2', 2, C.ink, 1.4), circle(42, 56, 6, C.white, C.ink, 1.4), line('M42 56 L45 52', C.ink, 1.6), circle(62, 56, 6, C.white, C.ink, 1.4),
    rect(32, 74, 10, 6, C.dark, 1, null), rect(48, 74, 10, 6, C.red, 1, null), circle(32, 102, 6, C.dark, C.ink, 1.4), circle(72, 102, 6, C.dark, C.ink, 1.4),
    line('M80 80 C96 80 100 94 108 96', C.dark, 2.4), line('M66 98 C66 108 90 108 104 106', C.dark, 2.4), rect(104, 92, 10, 8, C.red, 2, C.ink, 1.2),
    greyed(rect(4, 30, 14, 70, C.green, 6, C.ink, 1.4)), frame(20, 36, 64, 72), ground()),
  'wshop.elektrod': all(wall('#eef0f2'), g('translate(30 72) rotate(-35)', rect(-6, 0, 12, 30, C.dark, 3, C.ink, 1.6), rect(-8, -10, 16, 10, '#b5361e', 2, C.ink, 1.4)),
    g('translate(38 60) rotate(-35)', rect(-2, -54, 4, 52, '#9aa0a8', 1, C.ink, 1.2), rect(-2.6, -54, 5.2, 42, '#c8b28a', 1, C.ink, 1.2)), ring(24, 36, 13),
    rect(64, 84, 46, 18, '#e6d3b3', 2, C.ink, 1.6), ...range(5).map((i) => rect(68 + i * 8, 70, 4, 16, '#c8b28a', 1, C.ink, 1)), ground()),
  'wshop.ljusbåge': all(rect(0, 0, 120, 112, DARKBG, 0, null), rect(10, 78, 100, 14, STEEL2, 1, C.ink, 1.6), g('translate(60 40)', rect(-3, -40, 6, 30, '#c8b28a', 1, C.ink, 1.2), rect(-2, -10, 4, 22, '#9aa0a8', 1, C.ink, 1)),
    waPulse('wlju', circle(60, 70, 18, 'rgba(190,225,255,0.55)', null), circle(60, 70, 9, '#f2f8ff', null), path('M60 52 L56 60 L62 64 L58 76', 'none', '#bfe3ff', 2.4), sparks(60, 74, 9, 26, -180, 0, '#d7ecff')), ring(60, 66, 22)),
  'wshop.svetstråd': all(wall('#e2ddd4'), g('translate(32 50)', circle(0, 0, 24, C.dark, C.ink, 1.8), circle(0, 0, 18, '#c8743a', C.ink, 1.2), ...range(4).map((i) => circle(0, 0, 16 - i * 3, 'none', '#a85a24', 0.8)), circle(0, 0, 5, C.dark, C.ink, 1.2)),
    line('M32 26 C58 24 64 30 70 50', '#c8743a', 2), circle(66, 40, 4, STEEL, C.ink, 1), circle(74, 40, 4, STEEL, C.ink, 1), line('M70 50 C74 80 92 86 104 92', C.dark, 4),
    waIn('wswt', -16, -14, ...pts([[64, 30], [70, 44]]).map(([x, y]) => path(`M${x} ${y} l5 3 l-5 3 Z`, HL, null))), ring(32, 50, 28), ground()),
  'wshop.skyddsgas': all(wall('#e2ddd4'), rect(8, 24, 26, 86, '#4f9d69', 12, C.ink, 2), rect(14, 12, 14, 14, STEEL2, 2, C.ink, 1.4), circle(30, 18, 6, C.white, C.ink, 1.4),
    line('M34 18 C60 18 70 50 82 70', C.dark, 2.4), rect(10, 80, 70, 12, STEEL2, 1, C.ink, 1.6), g('translate(84 74) rotate(30)', rect(-4, -14, 8, 14, STEEL, 1, C.ink, 1.2)),
    waGrow('wsgg', circle(78, 80, 14, 'rgba(120,180,240,0.45)', '#3f7fc8', 1.4)), circle(78, 80, 3, '#fff1b0', null), ring(21, 64, 20), ground()),
  'wshop.svetshjälm': all(wall('#eef0f2'), path('M30 26 C30 6 90 6 90 26 L94 84 C94 98 80 106 60 106 C40 106 26 98 26 84 Z', '#2e2e36', C.ink, 2.2), rect(42, 40, 36, 20, '#3b6b4a', 3, C.ink, 1.8),
    line('M46 44 L56 44', 'rgba(255,255,255,0.4)', 2), path('M40 72 C48 80 72 80 80 72', 'none', '#55575f', 2), circle(28, 56, 5, STEEL2, C.ink, 1.4), circle(92, 56, 5, STEEL2, C.ink, 1.4), ring(60, 60, 44)),
  'wshop.svetsrök': all(wall('#e2ddd4'), rect(20, 88, 80, 12, STEEL2, 1, C.ink, 1.6), line('M40 88 L80 88', '#c8b28a', 3),
    moving('wsrk', '0%{transform:translateY(14px);opacity:.2}60%,100%{transform:translateY(0);opacity:1}', { dur: 3 }, path('M54 84 C44 74 64 66 54 56 C46 46 66 40 58 28 C54 20 66 14 62 6', 'none', '#7d8896', 9), path('M64 84 C72 74 58 66 70 56 C78 46 62 40 72 28', 'none', '#9aa3ad', 7),
      ...range(8).map((i) => circle(48 + ((i * 7) % 26), 20 + i * 8, 1.4, C.dark, null))), ring(60, 46, 30), ground()),
  'wshop.svetsfog': all(wall('#eef0f2'), path('M8 78 L58 70 L58 90 L8 98 Z', STEEL, C.ink, 1.8), path('M62 70 L112 78 L112 98 L62 90 Z', STEEL2, C.ink, 1.8),
    ...range(6).map((i) => ellipse(60, 72 + i * 3.4, 5, 2.4, '#d9dde2', C.ink, 0.9)), ring(60, 80, 16), ground()),
  'wshop.skärbrännare': all(rect(0, 0, 120, 112, '#d8d3ca', 0, null), rect(6, 70, 108, 22, STEEL2, 1, C.ink, 1.8), line('M60 70 L60 92', DARKBG, 3),
    g('translate(60 40) rotate(20)', rect(-4, -30, 8, 28, STEEL, 2, C.ink, 1.4), rect(-3, -2, 6, 10, '#c8743a', 1, C.ink, 1.2)),
    waPulse('wskb', path('M58 52 C54 60 60 66 60 72 C62 66 66 60 62 52 Z', '#5aa7d6', C.ink, 1), path('M60 56 C58 62 60 66 60 70 C61 66 62 62 61 56 Z', '#e6f4ff', null)),
    moving('wskbd', '0%{transform:translateY(-8px);opacity:1}100%{transform:translateY(10px);opacity:0}', { dur: 1.2 }, circle(58, 96, 2, C.orange, null), circle(63, 100, 1.6, C.yellow, null)),
    line('M50 14 C40 6 20 10 8 4', TOOLRED, 2), line('M52 12 C44 2 30 2 14 0', '#3f6fb5', 2), ring(60, 64, 14), ground()),

  // ── 4027 Skyddsutrustning i verkstad ──
  'wshop.skyddssko': all(wall(), path('M14 104 L14 56 C14 50 20 48 36 48 L44 48 L46 74 C62 76 92 80 100 88 C106 94 106 104 98 104 Z', '#5a3e2a', C.ink, 2), rect(12, 104, 92, 6, C.dark, 2, C.ink, 1.6),
    path('M70 80 C86 82 100 88 100 98 L100 104 L70 104 Z', STEEL, C.ink, 1.6), line('M24 56 L40 56 M24 64 L40 64', C.yellow, 1.6), ring(86, 92, 18),
    waBob('wssk', 6, rect(74, 46, 26, 20, C.dark, 2, C.ink, 1.6)), arrow(87, 30, 87, 42, HL, 2.4), ground(112)),
  'wshop.andningsskydd': all(wall('#eef0f2'), circle(60, 54, 32, C.skin, C.ink, 2), path('M28 46 C28 16 92 16 92 46 C84 34 36 34 28 46 Z', C.hair, null), circle(48, 48, 2, C.ink, null), circle(72, 48, 2, C.ink, null),
    path('M40 62 C40 54 80 54 80 62 L74 82 C68 88 52 88 46 82 Z', '#e8eaee', C.ink, 1.8), circle(40, 74, 9, '#d64545', C.ink, 1.6), circle(80, 74, 9, '#d64545', C.ink, 1.6), line('M30 62 L18 58 M90 62 L102 58', C.dark, 2),
    ...range(10).map((i) => circle(f1(14 + ((i * 41) % 92)), f1(90 + ((i * 17) % 18)), 1.6, '#b8ad98', null)), ring(60, 72, 30)),
  'wshop.visir': all(wall('#eef0f2'), circle(54, 66, 24, C.skin, C.ink, 1.8), path('M28 58 C28 26 84 26 84 58 L28 58 Z', C.yellow, C.ink, 1.8), rect(24, 56, 64, 6, C.yellow, 2, C.ink, 1.4),
    circle(46, 66, 1.8, C.ink, null), circle(62, 66, 1.8, C.ink, null), path('M26 62 L86 62 L84 98 C70 104 40 104 30 98 Z', 'rgba(170,215,240,0.45)', C.ink, 1.8), line('M34 68 L40 90', C.white, 2),
    sparks(112, 80, 6, 22, 150, 220, C.yellow), frame(22, 58, 68, 46)),
  'wshop.varselväst': all(wall(), path('M36 16 L50 16 C52 24 68 24 70 16 L84 16 L98 34 L94 104 L26 104 L22 34 Z', HIVIS, C.ink, 2), path('M50 16 L58 104 M70 16 L62 104', 'none', C.ink, 1.2),
    rect(24, 62, 72, 7, '#d9dde2', 0, C.ink, 1), rect(24, 80, 72, 7, '#d9dde2', 0, C.ink, 1), line('M30 34 L30 104 M90 34 L90 104', '#b5cc20', 1.2), ground()),
  'wshop.förbandslåda': all(wall(), rect(24, 30, 72, 56, C.green, 5, C.ink, 2), rect(50, 24, 20, 8, C.green, 2, C.ink, 1.6), rect(54, 42, 12, 32, C.white, 1, null), rect(44, 52, 32, 12, C.white, 1, null),
    g('translate(28 100)', rect(-14, -6, 28, 12, '#f1d8b8', 4, C.ink, 1.4), rect(-4, -6, 8, 12, '#e6c49a', 1, null)), g('translate(94 100)', circle(0, 0, 10, C.white, C.ink, 1.6), circle(0, 0, 4, '#e6e6e6', C.ink, 1)), frame(20, 20, 80, 70), ground()),
  'wshop.punktutsug': all(wall('#e2ddd4'), rect(90, 0, 26, 20, STEEL2, 2, C.ink, 1.6), line('M100 20 L100 34 L66 46', C.ink, 9), line('M100 20 L100 34 L66 46', '#e8b84a', 6), circle(100, 34, 4, C.dark, null),
    path('M56 44 L74 44 L82 62 L48 62 Z', '#e8b84a', C.ink, 1.8), rect(20, 88, 80, 10, STEEL2, 1, C.ink, 1.4), line('M50 88 L70 88', '#c8b28a', 3),
    waIn('wpus', 0, 16, path('M58 84 C54 78 62 74 58 68 M64 84 C68 78 60 74 66 68', 'none', '#9aa3ad', 3)), arrow(40, 70, 52, 64, HL, 2.4), arrow(84, 76, 74, 66, HL, 2.4), frame(44, 40, 42, 26), ground()),
  'wshop.säkerhetsföreskrift': all(wall('#eef0f2'), rect(18, 8, 84, 100, C.white, 4, C.ink, 2), ...pts([[38, 30], [82, 30], [38, 62], [82, 62]]).map(([x, y]) => circle(x, y, 13, '#2f6fb5', C.ink, 1.6)),
    g('translate(38 30)', rect(-9, -3, 7, 6, C.white, 2, null), rect(2, -3, 7, 6, C.white, 2, null), line('M-2 0 L2 0', C.white, 1.6)), g('translate(82 30)', path('M-8 4 C-8 -10 8 -10 8 4', 'none', C.white, 2), rect(-10, 0, 5, 8, C.white, 2, null), rect(5, 0, 5, 8, C.white, 2, null)),
    g('translate(38 62)', path('M-6 8 L-6 -2 L-4 -8 L-2 -2 L0 -9 L2 -2 L4 -8 L6 -2 L6 8 Z', C.white, null)), g('translate(82 62)', path('M-8 6 L-8 -6 L0 -6 L0 0 L8 2 L8 6 Z', C.white, null)),
    ...[84, 96].map((y) => all(check(32, y, 0.7), line(`M42 ${y} L88 ${y}`, C.grey, 2))), ground()),
};
