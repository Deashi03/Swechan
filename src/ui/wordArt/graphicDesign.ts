/**
 * Kultur & fritid → Bildkonst & design → Grafisk design, 4551–4557 (0.63): typography, logos and symbols, layout and
 * grid, colour palettes, illustration, information design, brand identity.
 * Recurring signs: printed matter is a white sheet with grey text lines (never words), pictures are a small blue
 * landscape, the invented logo is an orange circle with a white wave (never a real brand), the part that the word
 * names is orange or ringed in orange, and grey shows what the word is not.
 * Sample letters (Aa, a row of capitals, a name in boxes, two initials) appear only where the word is about letter
 * shapes (typografi, seriff, kursiv, tryckbokstav, monogram) and never spell the word itself.
 * Pairs that are easy to mix up share one layout where only the marked part differs: skrivstil/tryckbokstav
 * (joined loops on a ruled sheet or one capital in each box of a form), stiliserad/detaljrik (a simple orange
 * shape beside a grey detailed one, or the other way round), luftig/rörig (an airy page against a crammed grey one).
 */
import { C, all, arrow, circle, ellipse, g, line, moving, path, rect, sparkle, star, waIn, type Svg } from './kit';
import { HL } from './people';
import { greyed } from './blindFix';

// ── Palette and basics ───────────────────────────────────────────────
const RED = '#e8302c';
const GREEN = '#3fa45b';
const WALL = '#efe6d6';
const DESK = '#c79a6b';
const SKY = '#bfe3f5';
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const f1 = (n: number) => +n.toFixed(1);
const ground = (y = 112) => line(`M4 ${y} L116 ${y}`, C.grey2, 2);
const ring = (x: number, y: number, r: number, col: string = HL) => circle(x, y, r, 'none', col, 2.6);
const frame = (x: number, y: number, w: number, h: number, col: string = HL) => rect(x, y, w, h, 'none', 4, col, 2.6);
const tick = (x: number, y: number, s = 1, col: string = GREEN) => line(`M${x - 4 * s} ${y} L${x - 1 * s} ${y + 3 * s} L${x + 5 * s} ${y - 4 * s}`, col, 2.8);
const cross = (x: number, y: number, s = 5, col: string = RED) => line(`M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, col, 2.8);
const at = (x: number, y: number, s: number, ...k: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...k);
const txt = (x: number, y: number, s: string, size: number, fill: string = C.ink, family = 'system-ui,sans-serif', weight = 700, extra = '') =>
  `<text x="${x}" y="${y}" font-family="${family}" font-weight="${weight}" font-size="${size}" text-anchor="middle" fill="${fill}"${extra}>${s}</text>`;
const SERIF = 'Georgia,"Times New Roman",serif';
/** White sheet. */
const sheet = (x: number, y: number, w: number, h: number, fill: string = C.white, sw = 1.4) => rect(x, y, w, h, fill, 1.5, C.ink, sw);
/** n grey text lines from (x, y), gap apart. */
const tl = (x: number, y: number, w: number, n: number, gap = 4, col: string = C.grey, sw = 1.4) =>
  line(range(n).map((i) => `M${x} ${f1(y + i * gap)} L${f1(x + w - (i % 3) * (w / 6))} ${f1(y + i * gap)}`).join(' '), col, sw);
/** Small landscape picture. */
const pic = (x: number, y: number, w: number, h: number) => all(rect(x, y, w, h, SKY, 1, C.ink, 1.1),
  path(`M${x + 0.6} ${y + h - 0.6} L${f1(x + w * 0.35)} ${f1(y + h * 0.45)} L${f1(x + w * 0.6)} ${f1(y + h * 0.75)} L${f1(x + w * 0.78)} ${f1(y + h * 0.55)} L${f1(x + w - 0.6)} ${y + h - 0.6} Z`, '#6fae6f', null),
  circle(f1(x + w * 0.76), f1(y + h * 0.3), f1(Math.min(w, h) * 0.12), C.yellow, null));
/** The invented logo: an orange circle with a white wave. */
const logo = (x: number, y: number, s = 1, col: string = HL) => at(x, y, s, circle(0, 0, 9, col, C.ink, 1.4), path('M-6 2 C-3 -4 0 6 3 0 C4 -2 5 -2 6.5 -1', 'none', C.white, 2.2));
const swatch = (x: number, y: number, w: number, h: number, col: string) => rect(x, y, w, h, col, 1.5, C.ink, 1);
/** Vertical double arrow. */
const dArrow = (x: number, y1: number, y2: number, col: string = HL) => all(line(`M${x} ${y1 + 3} L${x} ${y2 - 3}`, col, 2),
  path(`M${x - 3} ${y1 + 4} L${x} ${y1} L${x + 3} ${y1 + 4} Z`, col, col, 1), path(`M${x - 3} ${y2 - 4} L${x} ${y2} L${x + 3} ${y2 - 4} Z`, col, col, 1));
const desk = (y = 88, x1 = 10, x2 = 110) => all(rect(x1, y, x2 - x1, 5, DESK, 1.5, C.ink, 1.6), rect(x1 + 4, y + 5, x2 - x1 - 8, 112 - y - 5, '#b4865a', 1, C.ink, 1.4));
const monitor = (x: number, y: number, w: number, h: number, inner: Svg = '') => all(rect(x, y, w, h, C.dark, 2.5, C.ink, 1.6), rect(x + 3, y + 3, w - 6, h - 8, C.white, 1, null), inner,
  rect(f1(x + w / 2 - 3), y + h, 6, 6, C.grey, 0, C.ink, 1), rect(f1(x + w / 2 - 10), y + h + 6, 20, 3, C.grey, 1, C.ink, 1));
const wall = (col: string = WALL, floorY = 100) => all(rect(0, 0, 120, 120, col, 0, null), rect(0, floorY, 120, 120 - floorY, '#d8c7a8', 0, null), line(`M0 ${floorY} L120 ${floorY}`, C.ink, 1.4));
const pen = (x: number, y: number, rot = 30, col: string = C.navy, s = 1) => g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, rect(-1.8, -22, 3.6, 18, col, 1, C.ink, 1), path('M-1.8 -4 L1.8 -4 L0 1 Z', C.beige, C.ink, 0.8));
const crown = (x: number, y: number, s = 1, col: string = C.gold) => at(x, y, s, path('M-8 4 L-9 -6 L-4 -1 L0 -8 L4 -1 L9 -6 L8 4 Z', col, C.ink, 1.2));
/** Pictogram person (white on a sign). */
const pictoMan = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, circle(0, -11, 3.4, col, null), path('M-5 -6 L5 -6 L4 4 L2 4 L2 13 L-2 13 L-2 4 L-4 4 Z', col, null));
const bubble = (x: number, y: number, w: number, h: number, tx: number, ty: number, n = 1) => all(
  path(`M${x + 3} ${y} L${x + w - 3} ${y} Q${x + w} ${y} ${x + w} ${y + 3} L${x + w} ${y + h - 3} Q${x + w} ${y + h} ${x + w - 3} ${y + h} L${f1(x + w / 2 + 3)} ${y + h} L${tx} ${ty} L${f1(x + w / 2 - 3)} ${y + h} L${x + 3} ${y + h} Q${x} ${y + h} ${x} ${y + h - 3} L${x} ${y + 3} Q${x} ${y} ${x + 3} ${y} Z`, C.white, C.ink, 1.1),
  ...range(n).map((i) => line(`M${x + 3} ${f1(y + (h / (n + 1)) * (i + 1))} L${x + w - 3 - (i % 2) * 3} ${f1(y + (h / (n + 1)) * (i + 1))}`, C.grey, 1.2)));
const thought = (x: number, y: number, rx: number, ry: number, tx: number, ty: number, inner: Svg) => all(ellipse(x, y, rx, ry, C.white, C.ink, 1.4),
  circle(f1((x + tx) / 2), f1(y + ry + (ty - y - ry) * 0.45), 2.4, C.white, C.ink, 1), circle(tx, ty, 1.6, C.white, C.ink, 0.9), inner);

// ── People ───────────────────────────────────────────────────────────
type Pt = [number, number];
type Fig = { top?: string; bottom?: string; hair?: 'short' | 'long' | 'bun'; hairCol?: string; grey?: boolean; mouth?: 'smile' | 'open' | 'flat' | 'frown'; armL?: Pt[]; armR?: Pt[]; skirt?: boolean; extra?: Svg; front?: Svg; brows?: boolean };
const HANG_L: Pt[] = [[-14, -48], [-15, -34]];
const HANG_R: Pt[] = [[14, -48], [15, -34]];
/** Standing person, feet at (x, y): head centre (0, −80), shoulders (±10, −64). Height ≈ 92·s. */
const fig = (x: number, s: number, o: Fig = {}, y = 112) => {
  const grey = o.grey ?? false, ink = C.ink;
  const skin = grey ? C.grey2 : C.skin;
  const top = grey ? C.grey : (o.top ?? C.sky);
  const bot = grey ? C.grey : (o.bottom ?? C.navy);
  const hair = grey ? C.grey : (o.hairCol ?? C.hair);
  const armPath = (side: number, pts: Pt[]) => { const d = `M${side * 9} -62 ` + pts.map(([a, b]) => `L${a} ${b}`).join(' '); const [hx, hy] = pts[pts.length - 1]!; return all(line(d, ink, 7.4), line(d, top, 5), circle(hx, hy, 3.2, skin, ink, 1.2)); };
  const m = o.mouth ?? 'smile';
  const mouth = m === 'open' ? ellipse(0, -74.5, 2.6, 3, '#c84a4a', ink, 1) : m === 'flat' ? line('M-3 -74.5 L3 -74.5', ink, 1.2)
    : m === 'frown' ? path('M-3 -73.5 Q0 -76.5 3 -73.5', 'none', ink, 1.3) : path('M-3.4 -75.5 Q0 -72.5 3.4 -75.5', 'none', ink, 1.3);
  const legs = o.skirt ? all(path('M-11 -36 L11 -36 L15 -12 L-15 -12 Z', bot, ink, 1.8), line('M-5 -12 L-5 -1 M5 -12 L5 -1', skin, 4.4))
    : all(line('M-5 -36 L-6 -2', ink, 7.6), line('M-5 -36 L-6 -2', bot, 5.6), line('M5 -36 L6 -2', ink, 7.6), line('M5 -36 L6 -2', bot, 5.6));
  const shoes = all(ellipse(-7, -1, 5, 2.4, grey ? C.grey : C.black, null), ellipse(7, -1, 5, 2.4, grey ? C.grey : C.black, null));
  const hairBack = o.hair === 'long' ? path('M-11 -82 C-14 -64 -8 -62 0 -64 C8 -62 14 -64 11 -82 C10 -96 -10 -96 -11 -82 Z', hair, ink, 1.6) : '';
  const hairTop = o.hair === 'bun' ? all(circle(0, -93, 4.5, hair, ink, 1.4), path('M-10 -82 C-10 -96 10 -96 10 -82 C6 -87 -6 -87 -10 -82 Z', hair, ink, 1.6))
    : path('M-10 -82 C-10 -96 10 -96 10 -82 C6 -87 -6 -87 -10 -82 Z', hair, ink, 1.6);
  const brows = o.brows ? line('M-6 -86 L-2 -84.5 M6 -86 L2 -84.5', ink, 1.2) : '';
  return g(`translate(${x} ${y}) scale(${s})`, legs, shoes, hairBack,
    path('M-11 -66 L11 -66 L10 -34 L-10 -34 Z', top, ink, 1.8),
    armPath(-1, o.armL ?? HANG_L), armPath(1, o.armR ?? HANG_R),
    rect(-3, -71, 6, 6, skin, 2, ink, 1.2), circle(0, -80, 10, skin, ink, 1.8), hairTop,
    circle(-3.6, -81, 1.2, ink, null), circle(3.6, -81, 1.2, ink, null), brows, mouth, o.extra ?? '', o.front ?? '');
};
const W = (x: number, s: number, o: Fig = {}, y = 112) => fig(x, s, { hair: 'long', top: C.orange, ...o }, y);
const M = (x: number, s: number, o: Fig = {}, y = 112) => fig(x, s, { top: C.green, ...o }, y);

// ── Letters ──────────────────────────────────────────────────────────
/** A capital T drawn as shapes; serif = with small cross strokes at the ends. */
const letterT = (x: number, y: number, s: number, col: string, serif: boolean) => at(x, y, s,
  rect(-16, -40, 32, 7, col, 0, null), rect(-3.5, -34, 7, 34, col, 0, null),
  serif ? all(rect(-17, -40, 3.4, 12, col, 0, null), rect(13.6, -40, 3.4, 12, col, 0, null), rect(-9, -3, 18, 3.4, col, 0, null)) : '');
/** Cursive loops (joined handwriting), from x0 to x1 on the baseline y. */
const cursive = (x0: number, y: number, n: number, step: number, col: string = C.navy, sw = 1.8) =>
  line(`M${x0} ${y} ` + range(n).map((i) => { const x = x0 + i * step; return `C${f1(x + step * 0.3)} ${y - 10} ${f1(x + step * 0.75)} ${y - 10} ${f1(x + step * 0.45)} ${y - 2} C${f1(x + step * 0.3)} ${y + 2} ${f1(x + step * 0.7)} ${y + 2} ${f1(x + step)} ${y}`; }).join(' '), col, sw);

export const GDES_MOTIFS: Record<string, Svg> = {
  // ── 4551 Typografi ───────────────────────────────────────────────
  'gdes.typografi': all(rect(0, 0, 120, 120, C.paper, 0, null), sheet(22, 8, 76, 104),
    txt(44, 44, 'Aa', 30, C.ink, SERIF, 700), txt(80, 44, 'Aa', 18, C.navy, 'system-ui,sans-serif', 400),
    rect(30, 52, 60, 5, C.ink, 1, null), tl(30, 63, 60, 3, 5, C.grey, 1.6), tl(30, 82, 28, 5, 4, C.grey, 1.2), tl(62, 82, 28, 5, 4, C.grey, 1.2),
    dArrow(94, 61, 68), line('M60 80 L60 100', HL, 1.2, '2 2'), frame(16, 4, 88, 112)),
  'gdes.seriff': all(rect(0, 0, 120, 120, C.paper, 0, null), sheet(8, 18, 56, 84), letterT(36, 88, 1.25, C.ink, true),
    ring(18.5, 44, 7), ring(53.5, 44, 7), ring(36, 86, 8),
    greyed(sheet(70, 34, 42, 60), letterT(91, 84, 0.9, C.ink, false))),
  'gdes.kursiv': all(rect(0, 0, 120, 120, C.paper, 0, null),
    greyed(sheet(6, 30, 46, 60), txt(29, 70, 'Aa', 26, C.ink, SERIF, 400), line('M18 46 L18 76 M40 46 L40 76', C.grey, 1.2, '3 3')),
    sheet(62, 22, 52, 76), `<g transform="translate(88 0) skewX(-16) translate(-88 0)">${txt(88, 72, 'Aa', 32, HL, SERIF, 400)}</g>`,
    line('M74 84 L84 40 M98 84 L108 40', HL, 1.4, '3 3'), arrow(56, 60, 62, 60, C.grey, 2.2)),
  'gdes.radavstånd': all(rect(0, 0, 120, 120, C.paper, 0, null),
    greyed(sheet(6, 22, 40, 70), tl(11, 28, 30, 18, 3.4, C.ink, 1.6)),
    sheet(54, 12, 60, 96), tl(60, 22, 44, 8, 11, C.ink, 2.2), dArrow(108, 45, 55), frame(56, 42, 56, 16)),
  'gdes.läsbarhet': all(rect(0, 0, 120, 120, '#e6eef2', 0, null),
    greyed(rect(6, 40, 42, 32, C.grey2, 2, C.ink, 1.4), tl(10, 47, 34, 6, 3.6, '#b9bfc5', 0.9), line('M27 72 L27 100', C.ink, 2.4), cross(27, 26, 6)),
    rect(56, 26, 58, 46, C.white, 2, C.ink, 1.8), rect(62, 34, 46, 7, C.ink, 1, null), rect(62, 47, 38, 6, C.ink, 1, null), rect(62, 59, 42, 6, C.ink, 1, null),
    line('M85 72 L85 104', C.ink, 3), ground(),
    ellipse(85, 12, 10, 6, C.white, C.ink, 1.4), circle(85, 12, 3.4, C.navy, null), tick(104, 12, 1.2), ring(85, 49, 32)),
  'gdes.skrivstil': all(rect(0, 0, 120, 120, C.paper, 0, null), sheet(8, 20, 104, 76), line('M8 44 L112 44 M8 64 L112 64 M8 84 L112 84', '#b9d4ea', 1.2),
    cursive(14, 64, 6, 13, C.navy, 2), cursive(14, 84, 4, 13, C.navy, 2), pen(70, 82, 35, C.dark, 1.3), ring(40, 61, 13)),
  'gdes.tryckbokstav': all(rect(0, 0, 120, 120, C.paper, 0, null), sheet(8, 16, 104, 88), tl(14, 26, 40, 1, 4, C.grey, 2),
    ...range(5).map((i) => rect(14 + i * 19, 32, 16, 20, C.white, 1, C.ink, 1.4)),
    ...['K', 'E', 'N', 'J', 'I'].map((c, i) => txt(22 + i * 19, 48, c, 15, C.navy, 'system-ui,sans-serif', 500)),
    tl(14, 64, 40, 1, 4, C.grey, 2), ...range(5).map((i) => rect(14 + i * 19, 70, 16, 20, C.white, 1, C.ink, 1.4)), pen(96, 96, 35, C.dark, 1.2),
    frame(10, 28, 96, 28)),

  // ── 4552 Logotyper och symboler ──────────────────────────────────
  'gdes.piktogram': all(wall('#e9e2d4', 104), rect(14, 30, 34, 74, '#9aa8b5', 1, C.ink, 1.6), circle(42, 70, 1.6, C.ink, null),
    rect(19, 36, 24, 24, '#2f6db5', 3, C.ink, 1.4), pictoMan(31, 51, 1.1),
    rect(66, 30, 40, 40, '#2f6db5', 4, C.ink, 1.6), line('M80 38 L80 62 M77 38 L77 46 M80 38 L80 46 M83 38 L83 46 M77 46 C77 49 83 49 83 46', C.white, 2.2), path('M92 38 C97 40 97 50 93 52 L93 62', 'none', C.white, 2.6),
    ring(31, 48, 15), ring(86, 50, 24)),
  'gdes.emblem': all(rect(0, 0, 120, 120, C.paper, 0, null),
    path('M30 20 L48 12 C54 18 66 18 72 12 L90 20 L108 40 L96 52 L88 44 L88 108 L32 108 L32 44 L24 52 L12 40 Z', '#2f8a57', C.ink, 2),
    path('M48 12 C54 22 66 22 72 12', 'none', C.ink, 1.6),
    circle(72, 46, 12, C.gold, C.ink, 1.6), circle(72, 46, 8.5, C.navy, C.ink, 1), star(72, 46, 5.5, C.gold),
    path('M60 50 C58 42 60 36 64 34 M84 50 C86 42 84 36 80 34', 'none', C.gold, 1.6), ring(72, 46, 17)),
  'gdes.vapensköld': all(rect(0, 0, 120, 120, '#c9c2b4', 0, null),
    ...range(5).map((r) => line(`M0 ${20 + r * 22} L120 ${20 + r * 22}`, '#aaa293', 1.4)),
    crown(60, 16, 1.6), path('M28 24 L92 24 L92 60 C92 84 76 98 60 106 C44 98 28 84 28 60 Z', '#2f5fa8', C.ink, 2.2),
    crown(46, 44, 1), crown(74, 44, 1), crown(60, 70, 1.1), path('M28 24 L92 24', 'none', C.gold, 2), ring(60, 64, 46)),
  'gdes.monogram': all(rect(0, 0, 120, 120, C.paper, 0, null), ground(),
    rect(18, 86, 84, 14, '#d8e6ef', 4, C.ink, 1.6), rect(14, 100, 92, 12, '#c7d9e6', 4, C.ink, 1.6),
    rect(22, 34, 76, 52, C.white, 5, C.ink, 1.8), line('M22 76 L98 76', '#d0d6dc', 2), line('M22 80 L98 80', '#d0d6dc', 1.2),
    txt(54, 66, 'A', 28, C.gold, SERIF, 700, ' font-style="italic"'), txt(68, 66, 'E', 28, '#b8862b', SERIF, 700, ' font-style="italic"'), ring(60, 56, 20)),
  'gdes.beställare': all(rect(0, 0, 120, 120, WALL, 0, null),
    W(26, 0.72, { top: C.orange, armR: [[16, -58], [26, -50]], mouth: 'open' }, 100),
    fig(96, 0.72, { top: C.grey2, bottom: C.grey, armL: [[-14, -54], [-20, -46]] }, 100),
    desk(84, 8, 112), sheet(38, 70, 14, 14), sheet(53, 70, 14, 14), sheet(68, 70, 14, 14),
    circle(45, 77, 4, C.grey, null), logo(60, 77, 0.45), rect(71, 73, 8, 8, C.grey, 1, null), tick(60, 64, 1),
    ring(26, 52, 24)),
  'gdes.design': all(rect(0, 0, 120, 120, C.paper, 0, null), ground(),
    sheet(6, 18, 50, 66, '#eef5fb'), line('M31 30 C20 30 16 44 18 48 L44 48 C46 44 42 30 31 30 Z M31 48 L31 72 M22 74 L40 74', '#3f6fb5', 1.4),
    line('M12 30 L12 74 M50 48 L50 74', '#3f6fb5', 0.9, '2 2'),
    path('M88 30 C72 30 66 52 70 58 L106 58 C110 52 104 30 88 30 Z', HL, C.ink, 1.8), line('M88 58 L88 104', C.dark, 3), ellipse(88, 106, 13, 3.4, C.dark, C.ink, 1.2),
    ellipse(88, 60, 9, 2, '#fff3b0', null), sparkle(108, 26, 5, C.gold), arrow(58, 50, 66, 50, C.grey, 2.2), ring(88, 66, 30)),
  'gdes.designa': all(rect(0, 0, 120, 120, WALL, 0, null),
    M(36, 0.78, { top: C.purple, armR: [[14, -50], [24, -40]], armL: [[-12, -50], [-2, -42]] }, 116),
    desk(90, 6, 114), monitor(58, 24, 52, 40, moving('gdes-designa', '0%{transform:scale(.2);opacity:.1}60%,100%{transform:scale(1);opacity:1}', { dur: 3, spin: true }, logo(84, 44, 1.5))),
    rect(28, 84, 26, 6, C.dark, 1.5, C.ink, 1.2),
    waIn('gdes-designa-pen', -6, 2, pen(52, 86, 40, C.dark, 0.7))),
  'gdes.stiliserad': all(rect(0, 0, 120, 120, C.paper, 0, null),
    greyed(path('M10 66 C14 50 30 44 42 50 C48 44 56 46 54 52 L60 54 L54 56 C52 70 38 78 24 74 L12 84 L16 72 Z', C.brown, C.ink, 1.4),
      line('M20 60 L30 58 M22 66 L34 64 M26 72 L38 68 M36 54 L44 56', C.ink, 0.9), circle(50, 50, 1.4, C.ink, null),
      line('M30 76 L28 90 M36 76 L36 90', C.ink, 1.4)),
    arrow(58, 62, 70, 62, C.grey, 2.4),
    circle(92, 66, 16, HL, C.ink, 1.8), circle(100, 46, 8, HL, C.ink, 1.8), path('M107 45 L116 48 L107 50 Z', C.gold, C.ink, 1.2), circle(102, 44, 1.6, C.ink, null),
    path('M80 70 C84 60 96 60 100 70 C94 74 86 74 80 70 Z', '#c94a22', C.ink, 1.4), ring(96, 60, 24)),
  'gdes.igenkännbar': all(rect(0, 0, 120, 120, '#dfe9ef', 0, null), ground(),
    greyed(rect(6, 18, 20, 14, C.white, 2, C.ink, 1.2), line('M16 32 L16 60', C.ink, 2), rect(30, 26, 18, 12, C.white, 2, C.ink, 1.2), line('M39 38 L39 60', C.ink, 2)),
    rect(52, 12, 24, 22, C.white, 2, C.ink, 1.4), logo(64, 23, 0.95), line('M64 34 L64 60', C.ink, 2.4), ring(64, 23, 14),
    fig(30, 0.5, { top: C.denim, armR: [[12, -60], [18, -70]] }, 112),
    thought(88, 74, 18, 12, 44, 86, all(logo(84, 74, 0.8), tick(98, 74, 1.1)))),

  // ── 4553 Layout och rutnät ───────────────────────────────────────
  'gdes.uppslag': all(rect(0, 0, 120, 120, '#d9cbb2', 0, null),
    path('M8 22 L58 26 L58 104 L8 100 Z', C.white, C.ink, 1.6), path('M112 22 L62 26 L62 104 L112 100 Z', C.white, C.ink, 1.6), path('M58 26 C60 28 60 28 62 26 L62 104 C60 106 60 106 58 104 Z', '#c9ced4', C.ink, 1),
    pic(14, 30, 92, 34), line('M60 30 L60 64', C.ink, 1),
    tl(14, 72, 38, 6, 4.6, C.grey, 1.3), tl(68, 72, 38, 6, 4.6, C.grey, 1.3), frame(4, 18, 112, 90)),
  'gdes.broschyr': all(rect(0, 0, 120, 120, WALL, 0, null), rect(0, 96, 120, 24, DESK, 0, C.ink, 1.4),
    path('M18 30 L48 24 L48 98 L18 102 Z', C.white, C.ink, 1.6), path('M48 24 L78 30 L78 104 L48 98 Z', '#f4f8fb', C.ink, 1.6), path('M78 30 L106 24 L106 98 L78 104 Z', C.white, C.ink, 1.6),
    g('skewY(-11) translate(0 9)', pic(22, 36, 22, 16), tl(22, 60, 22, 5, 4.4, C.grey, 1.2)),
    g('skewY(11) translate(0 -10)', pic(52, 40, 22, 16), tl(52, 64, 22, 5, 4.4, C.grey, 1.2)),
    g('skewY(-11) translate(0 17)', logo(92, 46, 0.8), tl(83, 60, 20, 5, 4.4, C.grey, 1.2)), frame(12, 18, 100, 92)),
  'gdes.trycksak': all(rect(0, 0, 120, 120, C.paper, 0, null), ground(),
    rect(8, 26, 30, 42, C.white, 1, C.ink, 1.4), pic(12, 30, 22, 16), tl(12, 52, 22, 3, 4, C.grey, 1.2),
    rect(44, 18, 34, 46, '#fdf3e2', 1, C.ink, 1.4), logo(61, 32, 1.1), tl(48, 48, 26, 3, 4.4, C.grey, 1.2),
    path('M84 30 L110 26 L112 66 L86 70 Z', C.white, C.ink, 1.4), tl(89, 40, 18, 5, 5, C.grey, 1.2),
    rect(10, 80, 30, 18, C.white, 1.5, C.ink, 1.4), logo(18, 89, 0.5), tl(26, 86, 10, 3, 3.6, C.grey, 1),
    rect(46, 76, 34, 26, '#e6d3b3', 1, C.ink, 1.4), path('M46 76 L63 90 L80 76', 'none', C.ink, 1.2),
    ellipse(98, 96, 14, 5, C.white, C.ink, 1.4), rect(84, 84, 28, 12, C.white, 0, null), line('M84 84 L84 96 M112 84 L112 96', C.ink, 1.4), ellipse(98, 84, 14, 5, '#f4f8fb', C.ink, 1.4),
    frame(4, 12, 112, 96)),
  'gdes.luftig.2': all(rect(0, 0, 120, 120, C.paper, 0, null),
    greyed(sheet(4, 18, 46, 84), pic(7, 21, 22, 16), pic(26, 30, 22, 14), tl(7, 48, 40, 12, 3.2, C.ink, 1.4), pic(10, 86, 18, 14), pic(30, 84, 18, 14), cross(27, 10, 5)),
    sheet(58, 10, 58, 100), pic(70, 24, 34, 24), tl(70, 60, 34, 4, 6, C.ink, 1.6),
    rect(63, 15, 48, 90, 'none', 2, HL, 1.4), line('M63 15 L70 24 M111 15 L104 24 M63 105 L70 84 M111 105 L104 84', HL, 1, '2 2'), tick(87, 96, 1.4)),

  // ── 4554 Färgpaletter ────────────────────────────────────────────
  'gdes.färgpalett': all(rect(0, 0, 120, 120, WALL, 0, null), desk(98, 4, 116),
    monitor(10, 14, 100, 70, all(...['#24476b', '#3f7f8f', '#e9c46a', '#f4a261', '#fbf6ee'].map((c, i) => circle(26 + i * 17, 34, 7, c, C.ink, 1.2)),
      rect(18, 48, 84, 26, '#fbf6ee', 1, C.ink, 1), rect(18, 48, 26, 26, '#24476b', 0, null), circle(31, 58, 5, '#e9c46a', null), rect(50, 54, 36, 4, '#3f7f8f', 1, null), rect(50, 62, 26, 3, '#f4a261', 1, null))),
    frame(16, 25, 88, 18)),
  'gdes.neutral.4': all(rect(0, 0, 120, 120, '#e8e1d6', 0, null), rect(0, 96, 120, 24, '#b9a68c', 0, null), line('M0 96 L120 96', C.ink, 1.4),
    path('M14 70 L74 70 L74 96 L14 96 Z', '#9b9a96', C.ink, 1.6), rect(10, 64, 8, 32, '#8a8984', 2, C.ink, 1.4), rect(70, 64, 8, 32, '#8a8984', 2, C.ink, 1.4), rect(22, 62, 18, 12, C.white, 3, C.ink, 1.2), rect(46, 62, 18, 12, '#e6d9c3', 3, C.ink, 1.2),
    rect(84, 14, 30, 58, C.white, 2, C.ink, 1.4), ...[C.white, '#e6d9c3', '#b9b5ad', '#7c6a58', '#2e2e36'].map((c, i) => swatch(88, 18 + i * 10, 22, 8, c)), frame(82, 12, 34, 62),
    greyed(...[RED, C.yellow, GREEN].map((c, i) => circle(16 + i * 12, 26, 5, c, C.ink, 1))), cross(28, 26, 7)),
  'gdes.harmonisk': all(rect(0, 0, 120, 120, C.paper, 0, null),
    ...['#1f5e7a', '#2f7f8f', '#4f9d8a', '#86b99a', '#c6dfc0'].map((c, i) => swatch(10 + i * 20, 24, 18, 30, c)), path('M14 62 C40 74 80 74 106 62', 'none', GREEN, 2.4), tick(60, 84, 1.6),
    greyed(...[RED, '#2dd4bf', C.yellow, C.purple].map((c, i) => swatch(26 + i * 18, 96, 14, 14, c))), cross(104, 103, 5)),
  'gdes.signalfärg': all(rect(0, 0, 120, 120, '#cfd5da', 0, null), rect(0, 92, 120, 28, '#9aa3ad', 0, null), line('M0 92 L120 92', C.ink, 1.4),
    greyed(fig(16, 0.6, {}, 100), fig(104, 0.6, { hair: 'long' }, 100), rect(30, 20, 24, 50, C.grey2, 1, C.ink, 1.2)),
    M(66, 0.78, { top: '#ff7a1a', bottom: C.navy, front: all(rect(-10, -56, 20, 4, '#e8ff5a', 0, null), rect(-10, -44, 20, 4, '#e8ff5a', 0, null)) }, 104),
    path('M92 104 L102 86 L112 104 Z', '#ff7a1a', C.ink, 1.6), path('M98 100 L102 93 L106 100 Z', C.white, null),
    ...[[44, 30], [90, 30], [40, 66], [94, 64]].map(([x, y]) => sparkle(x!, y!, 5, '#ffb000')), ring(66, 60, 24)),
  'gdes.färgsätta': all(rect(0, 0, 120, 120, C.paper, 0, null),
    path('M8 12 L112 12 L112 78 L8 78 Z', C.white, C.ink, 1.6),
    waIn('gdes-farg-vagg', -10, 40, path('M10 14 L110 14 L110 56 L10 56 Z', '#a8c9b8', null)),
    line('M8 56 L112 56', C.ink, 1.2),
    waIn('gdes-farg-soffa', 20, 30, path('M26 50 L74 50 L74 72 L26 72 Z', '#d98c5f', C.ink, 1.4), rect(22, 46, 8, 26, '#c97a4d', 2, C.ink, 1.2), rect(70, 46, 8, 26, '#c97a4d', 2, C.ink, 1.2)),
    rect(86, 22, 16, 22, '#f2d7a6', 1, C.ink, 1.2), line('M94 44 L94 56', C.ink, 1.4),
    rect(8, 86, 104, 26, '#efe6d6', 2, C.ink, 1.2), ...['#a8c9b8', '#d98c5f', '#f2d7a6', '#5b6e7a'].map((c, i) => swatch(16 + i * 24, 92, 18, 14, c)),
    arrow(25, 88, 30, 62, HL, 2), arrow(49, 88, 54, 76, HL, 2)),
  'gdes.färgprov': all(wall('#f3efe7', 100),
    rect(56, 16, 52, 44, '#7fa6c9', 1, null), line('M56 16 L108 16 L108 60 L56 60 Z', C.ink, 1, '3 3'),
    W(30, 0.8, { top: C.green, armR: [[16, -64], [34, -76]] }, 112),
    rect(60, 18, 14, 50, C.white, 2, C.ink, 1.4), ...['#dbe7f2', '#b5cde4', '#7fa6c9', '#4f7fae', '#2f5a8a'].map((c, i) => rect(62, 20 + i * 9.4, 10, 8, c, 1, C.ink, 0.6)),
    rect(80, 90, 24, 20, '#c0c6cc', 2, C.ink, 1.4), ellipse(92, 90, 12, 3, '#7fa6c9', C.ink, 1.2), ring(67, 43, 15)),
  'gdes.tryckfärg': all(rect(0, 0, 120, 120, '#e3e6ea', 0, null), ground(),
    ...['#00a3d9', '#e0218a', '#ffd400', '#2e2e36'].map((c, i) => all(rect(8 + i * 27, 66, 22, 30, C.silver, 2, C.ink, 1.6), ellipse(19 + i * 27, 66, 11, 3.6, c, C.ink, 1.2), rect(8 + i * 27, 78, 22, 8, c, 0, C.ink, 1))),
    rect(14, 18, 92, 10, '#8a8f96', 4, C.ink, 1.6), rect(22, 28, 76, 12, '#00a3d9', 5, C.ink, 1.4), line('M22 34 L98 34', '#0088b8', 1),
    line('M10 23 L4 23 L4 50 M110 23 L116 23 L116 50', C.dark, 2.4), sheet(30, 42, 60, 16), circle(44, 50, 3, '#00a3d9', null), circle(54, 50, 3, '#e0218a', null), circle(64, 50, 3, '#ffd400', null), circle(74, 50, 3, '#2e2e36', null),
    frame(4, 60, 112, 40)),
  'gdes.gråskala': all(rect(0, 0, 120, 120, C.paper, 0, null),
    rect(14, 14, 92, 52, '#c8c8c8', 2, C.ink, 1.6), circle(84, 30, 8, '#f0f0f0', null), path('M15 65 L44 34 L64 54 L78 44 L105 65 Z', '#6a6a6a', null), path('M15 65 L30 50 L48 65 Z', '#3a3a3a', null),
    ...range(8).map((i) => { const v = Math.round(250 - i * 32); const h = v.toString(16).padStart(2, '0'); return rect(10 + i * 12.5, 80, 12.5, 20, `#${h}${h}${h}`, 0, C.ink, 1); }),
    rect(10, 80, 100, 20, 'none', 1, C.ink, 1.6), frame(6, 76, 108, 28)),

  // ── 4555 Illustration ────────────────────────────────────────────
  'gdes.serietecknare': all(rect(0, 0, 120, 120, WALL, 0, null),
    W(28, 0.78, { top: C.purple, armR: [[14, -50], [28, -48]] }, 116),
    path('M48 90 L112 90 L104 40 L56 40 Z', '#e9dcc6', C.ink, 1.6), line('M50 90 L46 112 M110 90 L114 112', C.brown, 3),
    path('M58 44 L102 44 L108 86 L52 86 Z', C.white, C.ink, 1.4),
    line('M80 44 L80 86 M55 65 L105 65', C.ink, 1.2),
    circle(68, 58, 4, C.orange, C.ink, 0.8), bubble(60, 47, 14, 6, 66, 54, 1), circle(92, 58, 4, C.sky, C.ink, 0.8), bubble(85, 47, 15, 6, 90, 54, 1),
    circle(66, 78, 4, C.orange, C.ink, 0.8), circle(94, 78, 4, C.sky, C.ink, 0.8), path('M70 76 L76 72', 'none', C.ink, 1), sparkle(82, 74, 3, C.gold),
    pen(49, 69, 50, C.dark, 0.8)),
  'gdes.seriefigur': all(rect(0, 0, 120, 120, C.white, 0, null), rect(8, 8, 104, 104, C.white, 2, C.ink, 2.4),
    rect(10, 80, 100, 30, '#e8f3d8', 0, null),
    ellipse(52, 74, 22, 20, '#7cc6e8', C.ink, 2), path('M36 60 L30 40 L46 54 Z M68 60 L74 40 L58 54 Z', '#7cc6e8', C.ink, 2),
    ellipse(44, 68, 6, 7, C.white, C.ink, 1.4), ellipse(60, 68, 6, 7, C.white, C.ink, 1.4), circle(45, 69, 2.6, C.ink, null), circle(61, 69, 2.6, C.ink, null),
    path('M44 82 C48 88 56 88 60 82', 'none', C.ink, 1.8), line('M40 94 L38 104 M64 94 L66 104', C.ink, 2.4),
    bubble(70, 16, 36, 22, 64, 46, 2), ring(52, 72, 30)),
  'gdes.omslag': all(rect(0, 0, 120, 120, C.paper, 0, null), ground(),
    greyed(rect(8, 40, 14, 72, '#8a5a3a', 1, C.ink, 1.2), rect(22, 50, 12, 62, '#3f6fb5', 1, C.ink, 1.2), rect(96, 46, 14, 66, '#4f9d69', 1, C.ink, 1.2)),
    rect(38, 16, 56, 96, '#2f6a4f', 2, C.ink, 2), path('M38 18 L42 16 L42 112 L38 112 Z', '#24533d', null),
    path('M46 96 L56 70 L62 84 L70 62 L88 96 Z', '#245a3e', null), circle(80, 32, 6, '#f6e7a8', null),
    path('M56 96 C54 86 60 80 68 82 L74 78 L78 72 L80 80 C86 82 88 92 82 96 Z', HL, C.ink, 1.4), path('M70 80 L68 70 L74 76 Z M76 77 L80 68 L81 77 Z', HL, C.ink, 1.1), circle(76, 80, 1, C.ink, null), path('M84 92 C94 92 98 84 96 78 C92 86 88 88 82 88', HL, C.ink, 1.2),
    rect(48, 22, 36, 5, C.white, 1, null), rect(54, 30, 24, 3, '#d8e6d0', 1, null), frame(34, 12, 64, 104)),
  'gdes.vektorgrafik': all(rect(0, 0, 120, 120, C.paper, 0, null),
    path('M20 90 C20 50 50 22 92 24 C94 60 70 92 20 90 Z', '#8fd18f', C.ink, 2), line('M20 90 C40 70 60 50 92 24', C.ink, 1.2),
    line('M20 90 L8 62 M20 90 L46 98 M92 24 L66 18 M92 24 L100 52', '#3f6fb5', 1.2),
    ...[[20, 90], [92, 24]].map(([x, y]) => rect(x! - 3.5, y! - 3.5, 7, 7, C.white, 0, '#3f6fb5', 1.6)),
    ...[[8, 62], [46, 98], [66, 18], [100, 52]].map(([x, y]) => circle(x!, y!, 2.8, '#3f6fb5', null)),
    greyed(rect(86, 78, 28, 28, C.white, 1, C.ink, 1.2), path('M88 104 L88 98 L92 98 L92 92 L96 92 L96 88 L102 88 L102 84 L110 84 L110 104 Z', '#8fd18f', C.ink, 1)),
    ring(56, 58, 46)),
  'gdes.detaljrik': all(rect(0, 0, 120, 120, C.paper, 0, null), ground(),
    greyed(rect(18, 70, 6, 42, C.brown, 1, C.ink, 1.2), circle(21, 56, 16, GREEN, C.ink, 1.4)),
    rect(78, 66, 8, 46, C.brown, 1, C.ink, 1.4), line('M80 80 L82 92 M84 70 L83 78', '#6e4529', 1),
    ...[[82, 30, 16], [66, 44, 14], [98, 44, 14], [74, 56, 12], [92, 58, 12]].map(([x, y, r]) => circle(x!, y!, r!, '#4f9d69', C.ink, 1.3)),
    ...[[72, 30], [90, 24], [62, 46], [104, 40], [80, 48], [96, 56], [70, 60], [86, 38]].map(([x, y]) => path(`M${x} ${y} l3 -3 l3 3 l-3 3 Z`, '#3f7f4d', C.ink, 0.6)),
    ...[[76, 38], [94, 48], [68, 52], [100, 34]].map(([x, y]) => circle(x!, y!, 2.6, RED, C.ink, 0.8)),
    path('M98 18 C100 14 106 14 108 18 L112 16 L108 20 C106 24 100 22 98 18 Z', C.navy, C.ink, 0.8),
    ...[[60, 108], [70, 110], [96, 108], [106, 110]].map(([x, y]) => all(line(`M${x} ${y} L${x} ${y! - 6}`, GREEN, 1), circle(x!, y! - 7, 2.4, C.pink, C.ink, 0.6))),
    path('M88 108 C88 102 96 102 96 108 Z', '#c9a27a', C.ink, 0.8), ring(84, 66, 36)),

  // ── 4556 Informationsdesign ──────────────────────────────────────
  'gdes.informationsdesign': all(rect(0, 0, 120, 120, '#e6eef2', 0, null),
    greyed(rect(6, 24, 40, 56, C.white, 1, C.ink, 1.2), tl(10, 30, 32, 13, 3.6, C.ink, 1.1), rect(12, 36, 26, 30, 'none', 0, null)),
    txt(26, 100, '?', 20, RED, 'system-ui,sans-serif', 800), arrow(50, 52, 60, 52, C.grey, 2.4),
    rect(64, 12, 50, 82, C.white, 3, C.ink, 1.8),
    rect(68, 18, 42, 14, '#2f6db5', 2, C.ink, 1), pictoMan(76, 27, 0.55), arrow(86, 25, 104, 25, C.white, 2.4),
    rect(68, 36, 42, 14, GREEN, 2, C.ink, 1), arrow(104, 43, 86, 43, C.white, 2.4), rect(72, 39, 8, 8, C.white, 1, null),
    rect(68, 56, 42, 32, '#f4f8fb', 2, C.ink, 1), ...[14, 24, 18].map((h, i) => rect(74 + i * 12, 84 - h, 8, h, ['#2f6db5', GREEN, HL][i]!, 1, C.ink, 0.8)),
    tick(89, 104, 1.6), frame(60, 8, 58, 90)),
  'gdes.vägvisning': all(rect(0, 0, 120, 120, '#d7ecf7', 0, null), rect(0, 96, 120, 24, '#b9c3a9', 0, null), line('M0 96 L120 96', C.ink, 1.4),
    line('M60 20 L60 108', C.dark, 4),
    path('M62 18 L104 18 L112 26 L104 34 L62 34 Z', '#2f6db5', C.ink, 1.6), pictoMan(72, 31, 0.6), line('M80 26 L100 26', C.white, 1.8),
    path('M58 40 L16 40 L8 48 L16 56 L58 56 Z', GREEN, C.ink, 1.6), plane(24, 48),
    path('M62 62 L100 62 L108 70 L100 78 L62 78 Z', C.yellow, C.ink, 1.6), rect(70, 66, 10, 8, C.white, 1, C.ink, 0.8), line('M84 70 L98 70', C.ink, 1.4),
    line('M18 108 L50 100 M70 100 L110 108', HL, 3, '6 4'), frame(4, 14, 112, 68)),
  'gdes.informationstavla': all(rect(0, 0, 120, 120, '#d4ecd0', 0, null), ground(), circle(16, 80, 10, '#4f9d69', C.ink, 1.2), rect(14, 88, 4, 22, C.brown, 0, C.ink, 1),
    line('M40 76 L40 110 M88 76 L88 110', '#7a5236', 4), rect(30, 14, 68, 64, '#6e4529', 3, C.ink, 1.8), rect(34, 18, 60, 56, C.white, 1, C.ink, 1.2),
    rect(37, 22, 32, 30, '#cfe8c5', 1, C.ink, 0.9), ellipse(50, 34, 8, 5, '#8cc7e8', C.ink, 0.6), line('M38 46 C46 42 56 46 68 40', '#b5835a', 1.6, '2 1.5'), circle(60, 44, 2.4, RED, null),
    tl(72, 24, 18, 6, 4.4, C.grey, 1.3), tl(38, 58, 52, 3, 5, C.grey, 1.3),
    fig(104, 0.5, { top: C.denim, armL: [[-14, -60], [-18, -66]] }, 112), frame(26, 10, 76, 72)),
  'gdes.utrymningsplan': all(wall('#efeae0', 104), rect(78, 44, 30, 60, '#b98a5c', 1.5, C.ink, 1.6), circle(102, 74, 1.6, C.gold, null),
    rect(80, 26, 26, 12, GREEN, 2, C.ink, 1.2), pictoMan(88, 36, 0.5), arrow(94, 32, 103, 32, C.white, 1.8),
    rect(10, 18, 58, 72, C.white, 2, C.ink, 1.8), rect(14, 22, 50, 56, '#f4f4ee', 0, C.ink, 1),
    line('M14 46 L38 46 L38 22 M38 60 L38 78 M38 60 L64 60 M50 22 L50 46', C.ink, 1.4), circle(26, 34, 3.4, RED, C.ink, 0.8),
    arrow(28, 40, 28, 54, GREEN, 2.2), arrow(30, 56, 56, 56, GREEN, 2.2), arrow(57, 56, 57, 70, GREEN, 2.2), rect(54, 72, 10, 6, GREEN, 0, null),
    tl(16, 82, 26, 2, 3.4, C.grey, 1), rect(48, 81, 14, 6, GREEN, 1, null), frame(6, 14, 66, 80)),
  'gdes.användarvänlig': all(rect(0, 0, 120, 120, C.paper, 0, null),
    greyed(rect(8, 30, 40, 60, C.dark, 4, C.ink, 1.6), ...range(5).flatMap((r) => range(4).map((c) => rect(12 + c * 9, 36 + r * 10, 6, 6, C.grey2, 1, C.ink, 0.6))), txt(28, 108, '?', 18, C.ink, 'system-ui,sans-serif', 800)),
    rect(64, 14, 44, 84, C.dark, 7, C.ink, 1.8), rect(68, 22, 36, 66, C.white, 2, null),
    rect(72, 30, 28, 20, GREEN, 4, C.ink, 1.2), path('M82 36 L82 44 L90 40 Z', C.white, null), rect(72, 58, 28, 20, '#2f6db5', 4, C.ink, 1.2), line('M80 68 L92 68', C.white, 2.4),
    tick(86, 108, 1.6), ring(86, 56, 34)),

  // ── 4557 Varumärkesidentitet ─────────────────────────────────────
  'gdes.varumärkesidentitet': all(rect(0, 0, 120, 120, C.paper, 0, null),
    line('M60 60 L24 24 M60 60 L96 24 M60 60 L24 96 M60 60 L96 96', C.grey, 1.6, '3 3'),
    circle(24, 24, 15, C.white, C.ink, 1.4), all(...['#24476b', HL, '#e9c46a'].map((c, i) => swatch(15 + i * 6, 18, 6, 12, c))),
    circle(96, 24, 15, C.white, C.ink, 1.4), txt(96, 30, 'Aa', 15, C.ink, SERIF, 700),
    circle(24, 96, 15, C.white, C.ink, 1.4), g('translate(24 98) scale(1.2)', path('M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -8 0 -6 C0 -8 1 -10 4 -10 C10 -10 12 0 0 8 Z', RED, C.ink, 1.2)),
    circle(96, 96, 15, C.white, C.ink, 1.4), bubble(85, 88, 22, 14, 90, 106, 2),
    logo(60, 60, 1.8), ring(60, 60, 54)),
  'gdes.grafisk-manual': all(rect(0, 0, 120, 120, '#d9cbb2', 0, null),
    path('M8 20 L58 24 L58 104 L8 100 Z', C.white, C.ink, 1.6), path('M112 20 L62 24 L62 104 L112 100 Z', C.white, C.ink, 1.6), line('M60 24 L60 104', C.ink, 1.2),
    logo(33, 46, 1.4), line('M15 30 L51 30 L51 62 L15 62 Z', '#3f6fb5', 1, '3 2'), dArrow(12, 30, 62, '#3f6fb5'),
    ...[HL, '#24476b', '#e9c46a'].map((c, i) => all(swatch(16 + i * 12, 72, 10, 10, c), line(`M${16 + i * 12} 86 L${26 + i * 12} 86`, C.grey, 1.4))),
    txt(86, 52, 'Aa', 22, C.ink, SERIF, 700), tl(72, 62, 30, 3, 5, C.grey, 1.3), cross(76, 88, 4), logo(90, 88, 0.6, C.grey), tick(104, 88, 1),
    frame(4, 16, 112, 92)),
  'gdes.designbyrå': all(rect(0, 0, 120, 120, WALL, 0, null),
    rect(12, 10, 52, 36, '#e9dcc6', 2, C.ink, 1.4), sheet(16, 14, 14, 12), pic(34, 14, 14, 10), ...[HL, '#24476b', '#e9c46a'].map((c, i) => swatch(52, 14 + i * 9, 8, 7, c)), logo(23, 36, 0.6), sheet(32, 30, 16, 12), cursive(34, 36, 2, 6, C.grey, 1),
    W(26, 0.6, { top: C.purple, armR: [[12, -52], [20, -46]] }, 112), M(94, 0.6, { top: C.denim, armL: [[-12, -52], [-20, -46]] }, 112),
    desk(88, 4, 116), monitor(34, 62, 22, 18, logo(45, 70, 0.5)), monitor(66, 62, 22, 18, rect(70, 66, 14, 8, '#e9c46a', 1, null)),
    path('M108 30 C100 22 104 12 110 10 C112 18 116 22 108 30 Z', GREEN, C.ink, 1), rect(102, 30, 12, 12, '#c0563f', 1, C.ink, 1)),
  'gdes.visitkort': all(rect(0, 0, 120, 120, WALL, 0, null), ground(),
    M(24, 0.72, { top: C.navy, armR: [[16, -58], [32, -56]] }, 112), W(96, 0.72, { top: C.orange, armL: [[-16, -58], [-30, -56]] }, 112),
    rect(46, 63, 20, 12, C.white, 1, C.ink, 1.2),
    rect(34, 8, 52, 30, C.white, 2, C.ink, 1.6), logo(46, 20, 0.8), tl(56, 18, 24, 3, 5, C.grey, 1.4), line('M40 32 L80 32', C.grey2, 1),
    line('M56 62 L60 40', HL, 1.2, '2 2'), ring(56, 69, 11), frame(30, 4, 60, 38)),
  'gdes.profilprodukt': all(rect(0, 0, 120, 120, C.paper, 0, null), ground(),
    path('M10 60 L40 60 L38 104 L12 104 Z', C.white, C.ink, 1.6), path('M40 70 C50 70 50 92 39 92', 'none', C.ink, 2), logo(25, 82, 0.8),
    path('M50 54 L90 54 L94 108 L46 108 Z', '#e6d3b3', C.ink, 1.6), path('M58 54 C58 38 82 38 82 54', 'none', C.ink, 2.2), logo(70, 82, 1.1),
    rect(98, 30, 6, 74, C.white, 2, C.ink, 1.4), path('M98 104 L101 110 L104 104 Z', C.dark, C.ink, 0.8), logo(101, 56, 0.35),
    path('M22 30 C22 16 46 16 46 30 L52 32 L16 32 Z', '#2f6db5', C.ink, 1.6), logo(34, 25, 0.5),
    frame(6, 10, 106, 102)),
  'gdes.förpackningsdesign': all(rect(0, 0, 120, 120, WALL, 0, null), rect(0, 96, 120, 24, DESK, 0, C.ink, 1.4),
    path('M10 70 L30 70 L30 50 L50 50 L50 70 L70 70 L70 86 L50 86 L50 106 L30 106 L30 86 L10 86 Z', C.white, C.ink, 1.4),
    line('M30 70 L50 70 L50 86 L30 86 Z', C.grey, 1, '3 2'), logo(40, 78, 0.6), pen(74, 104, 60, C.dark, 0.9),
    path('M80 30 L108 30 L108 94 L80 94 Z', '#24476b', C.ink, 1.8), path('M80 30 L88 22 L114 22 L108 30 Z', '#3a6590', C.ink, 1.4), path('M108 30 L114 22 L114 86 L108 94 Z', '#1b3550', C.ink, 1.4),
    ...range(3).map((r) => path(`M82 ${44 + r * 12} C86 ${40 + r * 12} 90 ${40 + r * 12} 94 ${44 + r * 12} C98 ${40 + r * 12} 102 ${40 + r * 12} 106 ${44 + r * 12}`, 'none', C.gold, 1.4)),
    logo(94, 82, 0.8, C.gold), arrow(58, 60, 74, 60, C.grey, 2.2), frame(76, 18, 42, 80)),
  'gdes.omprofilering': all(rect(0, 0, 120, 120, '#e6eef2', 0, null), ground(),
    rect(30, 46, 84, 66, '#efe6d6', 1, C.ink, 1.6), rect(38, 64, 30, 30, SKY, 1, C.ink, 1.4), rect(78, 62, 26, 50, '#8a5a3a', 1, C.ink, 1.4),
    rect(34, 14, 76, 26, C.white, 3, C.ink, 1.8),
    moving('gdes-om-new', '0%,20%{transform:scale(.4);opacity:0}60%,100%{transform:scale(1);opacity:1}', { dur: 3.6, spin: true }, logo(50, 27, 1), rect(64, 22, 38, 4, HL, 1, null), rect(64, 29, 26, 3, '#24476b', 1, null)),
    greyed(g('rotate(-12 18 96)', rect(2, 84, 34, 16, C.grey2, 2, C.ink, 1.2), circle(10, 92, 4, C.grey, C.ink, 1), line('M17 92 L32 92', C.grey, 2.4))),
    path('M20 78 C18 54 22 36 30 28', 'none', HL, 2.2), arrow(26, 34, 32, 26, HL, 2.4), frame(30, 10, 84, 34)),
};

/** Plane pictogram for the signpost. */
function plane(x: number, y: number): Svg {
  return g(`translate(${x} ${y})`, path('M-7 0 L7 0 M0 -6 L2 0 L0 6 M-6 -2 L-6 2', 'none', C.white, 1.8));
}
